"""Original Konnect studio. Run with Blender 4.5 LTS in background mode.
The .blend, GLB, baked desk light map and responsive renders are reproducible.
Coordinates here are Blender Z-up; exported story cameras use glTF Y-up.
"""
import bpy, math, os, json, sys
from mathutils import Vector
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'design-source'
ASSETS = ROOT / 'wp-content/themes/konnect/assets/studio'
RENDERS = SOURCE / 'renders'
for folder in (ASSETS, RENDERS): folder.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.view_settings.view_transform = 'AgX'
scene.world.color = (.16, .16, .16)
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.14,.15,.18,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .30

def material(name, color, rough=.5, metal=0):
    mat=bpy.data.materials.new(name); mat.diffuse_color=(*color,1); mat.use_nodes=True
    bs=mat.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Roughness'].default_value=rough; bs.inputs['Metallic'].default_value=metal
    return mat

red=material('Scarlet lacquer',(.57,.008,.016),.27,.18)
ink=material('Carbon graphite',(.018,.019,.024),.62)
deskmat=material('Graphite desk',(.052,.054,.061),.72)
grey=material('Warm grey stock',(.28,.29,.31),.85)
darkpaper=material('Charcoal print',(.075,.079,.088),.9)
silver=material('Brushed aluminium',(.36,.38,.40),.3,.8)
black=material('Black ink',(.008,.009,.012),.62)
label=material('Light grey ink',(.66,.67,.68),.8)
glass=material('Display glass',(.018,.022,.028),.2,.15)
font=bpy.data.fonts.load(str(SOURCE/'fonts/Unbounded.woff2'))
bodyfont=bpy.data.fonts.load(str(SOURCE/'fonts/Manrope.woff2'))

def parent(obj, group):
    if group: obj.parent=group
    return obj
def group(name, pos=(0,0,0), rot=0):
    ob=bpy.data.objects.new(name,None); scene.collection.objects.link(ob)
    ob.location=pos; ob.rotation_euler.z=rot
    return ob
def box(name, pos, scale, mat, bevel=.04, group=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    ob=bpy.context.object; ob.name=name; ob.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    ob.data.materials.append(mat)
    if bevel:
        mod=ob.modifiers.new('Soft machined edges','BEVEL'); mod.width=bevel; mod.segments=3
        bpy.ops.object.modifier_apply(modifier=mod.name)
        ob.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL')
    return parent(ob,group)
def cylinder(name,pos,radius,depth,mat,group=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=40,radius=radius,depth=depth,location=pos)
    ob=bpy.context.object; ob.name=name; ob.data.materials.append(mat)
    bevel=ob.modifiers.new('Edge roll','BEVEL'); bevel.width=.018; bevel.segments=3
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    for poly in ob.data.polygons: poly.use_smooth=True
    ob.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return parent(ob,group)
def text(name, content, pos, size, mat, group=None, display=True, rotation=0):
    curve=bpy.data.curves.new(name,'FONT'); curve.body=content; curve.font=font if display else bodyfont
    curve.size=size; curve.extrude=.0008; curve.resolution_u=6; curve.space_character=1.05
    ob=bpy.data.objects.new(name,curve); scene.collection.objects.link(ob)
    ob.location=pos; ob.rotation_euler.z=rotation; curve.materials.append(mat)
    bpy.context.view_layer.objects.active=ob; ob.select_set(True)
    bpy.ops.object.convert(target='MESH'); ob.select_set(False)
    return parent(ob,group)
def ring(name,pos,radius,tube,mat,group=None):
    bpy.ops.mesh.primitive_torus_add(major_segments=56,minor_segments=10,location=pos,major_radius=radius,minor_radius=tube)
    ob=bpy.context.object; ob.name=name; ob.data.materials.append(mat)
    for p in ob.data.polygons: p.use_smooth=True
    return parent(ob,group)
def paper(name,pos,w,h,mat=grey,angle=0):
    ob=group(name,pos,angle); box(name+'Stock',(0,0,0),(w,h,.022),mat,.012,ob); return ob

desk=box('StudioDesk',(0,0,-.23),(18,12,.4),deskmat,.18)
# A shallow inset work mat gives the portfolio a physical place in the composition.
box('WorkMat',(0,-.15,.005),(8.6,5.7,.035),ink,.25)
folio=group('Portfolio',(-.3,-.7,.06),-.13)
box('PortfolioBase',(0,0,.09),(4.8,3.3,.18),red,.09,folio)
for i in range(5): box('BoundPaper'+str(i),(0,0,.20+i*.017),(4.58,3.1,.014),grey,.02,folio)
hinge=group('CoverHinge',(0,1.65,.43)); hinge.parent=folio
box('PortfolioCover',(0,-1.65,0),(4.8,3.3,.13),red,.07,hinge)
text('CoverTitle','KONNECT',(-2.06,-1.30,.073),.39,label,hinge)
text('CoverSubtitle','VISION MEDIA',(-2.03,-1.61,.074),.105,label,hinge,False)
text('CoverFooter','FROM BRIEF TO LAUNCH',(-2.03,-2.87,.074),.072,label,hinge,False)
text('CoverEdition','01 / STUDIO',(.95,-2.87,.074),.072,label,hinge,False)
box('CoverRule',(0,-2.56,.074),(4.06,.009,.003),label,0,hinge)
for x in (-2.12,2.12):
    pin=cylinder('HingePin',(x,1.60,.29),.045,.36,silver,folio); pin.rotation_euler.y=math.pi/2

for i,x in enumerate((-1.16,1.16),1):
    # These named planes are replaced with public WP project images at runtime.
    bpy.ops.mesh.primitive_plane_add(size=1,location=(x,0,.305))
    surface=bpy.context.object; surface.name='ProjectSurface'+str(i); surface.scale=(2.16,2.89,1)
    surface.data.materials.append(grey if i==1 else darkpaper); surface.parent=folio
    graphics=group('ProjectInk'+str(i)); graphics.parent=folio
    text('SpreadHeading'+str(i),'MAKE\nA MARK.' if i==1 else 'FORM\n& FEEL.',(x-.92,.55,.32),.29,black if i==1 else label,graphics)
    ring('SpreadCircle'+str(i),(x,-.38,.34),.49,.065,red,graphics)
    box('SpreadBar'+str(i),(x,-.38,.335),(.14,1.2,.018),red,.02,graphics)
    text('SpreadCaption'+str(i),'KVM / DESIGN STUDY',(x-.92,-1.26,.32),.065,black if i==1 else label,graphics,False)

# Social content display with a physical aluminium frame and laid-out creative.
social=group('ContentDisplay',(-4.75,1.55,.15),.17)
box('DisplayBody',(0,0,.1),(2.25,3.42,.2),silver,.16,social)
box('DisplayGlass',(0,0,.212),(2.10,3.26,.025),glass,.12,social)
box('ContentTile',(0,-.03,.23),(1.87,2.56,.014),red,.02,social)
text('SocialTitle','A POINT\nOF VIEW.',(-.78,.52,.25),.225,label,social)
text('SocialCaption','CONTENT / CULTURE / CONNECTION',(-.77,-1.06,.25),.045,label,social,False)
cylinder('DisplayCamera',(0,1.44,.24),.035,.01,black,social)
ring('SocialMark',(.4,-.45,.27),.32,.045,label,social)

# Identity sheets, deliberate physical offsets rather than floating decoration.
for i in range(3):
    p=paper('IdentitySheet'+str(i),(3.80,1.65,.06+i*.04),2.6,3.4,grey,(.18 if i==2 else .13)+i*.015)
    if i==2:
        text('IdentityTitle','K / V',(-1.05,.73,.022),.58,black,p)
        text('IdentityLabel','VISUAL IDENTITY',(-1.05,.38,.023),.09,black,p,False)
        for j,mat in enumerate((red,ink,silver)):
            box('Swatch'+str(j),(-.76+j*.77,-.43,.028),(.68,.9,.02),mat,.015,p)
        text('IdentityFooter','SHAPE. COLOUR. CHARACTER.',(-1.05,-1.42,.023),.063,black,p,False)

search=paper('WebsiteStructure',(-4.6,-2.57,.07),2.8,2.2,grey,-.17)
text('SearchTitle','BE FOUND.',(-1.18,.67,.024),.22,black,search)
text('SearchSubtitle','A CLEARER DIGITAL FOUNDATION',(-1.16,.43,.024),.064,black,search,False)
for y,width in ((.06,2.3),(-.28,1.7),(-.62,2.0)):
    box('SearchRule',(-1.16+width/2,y,.027),(width,.10,.006),red if y==.06 else darkpaper,.015,search)

brief=paper('CampaignBrief',(4.1,-2.1,.07),2.7,3.1,grey,.20)
text('BriefTitle','THE NEXT\nCONNECTION.',(-1.12,.75,.027),.20,black,brief)
text('BriefSub','CAMPAIGN / CREATIVE / ENQUIRY',(-1.12,.21,.027),.059,black,brief,False)
for j in range(4): box('BriefLine',(-.2,-.15-j*.25,.026),(1.84,.009,.004),darkpaper,0,brief)
box('BriefCTA',(-.18,-1.18,.031),(1.91,.31,.018),red,.02,brief)
text('BriefAction','START A CONVERSATION',(-.98,-1.21,.045),.074,label,brief,False)

# Quiet studio details: pencil, steel ruler, clips and a directional lamp.
pen=group('Pencil',(1.5,-3.25,.10),-.36)
pencil=cylinder('RedPencil',(0,0,0),.055,2.4,red,pen); pencil.rotation_euler.x=math.pi/2
tip=cylinder('PencilTip',(0,-1.21,0),.023,.19,black,pen); tip.rotation_euler.x=math.pi/2
rule=group('Ruler',(0,3.55,.04),.04)
box('RulerBody',(0,0,0),(4.8,.37,.025),silver,.025,rule)
for i in range(44): box('RulerTick',(-2.15+i*.10,-.10,.016),(.008,.14 if i%5==0 else .075,.003),black,0,rule)
for x in (-2.9,2.9):
    clip=ring('PaperClip',(x,2.7,.08),.15,.024,silver); clip.scale.y=1.5
lamp=group('DeskLamp',(-6,4,.02))
cylinder('LampFoot',(0,0,.12),.63,.2,ink,lamp)
stem=cylinder('LampStem',(0,0,1.1),.055,2.0,silver,lamp)
shade=cylinder('LampShade',(.2,-.1,2.3),.72,.24,ink,lamp); shade.rotation_euler.x=.12

# Three process sheets behind the work zone; these align under the overhead camera.
for i,(title,subtitle) in enumerate((('01 / UNDERSTAND','THE RIGHT QUESTIONS'),('02 / CREATE','A CLEAR EXPRESSION'),('03 / CONNECT','OUT INTO THE WORLD'))):
    p=paper('ProcessSheet'+str(i+1),(-2.35+i*2.35,2.35,.08),2.12,1.65,darkpaper,(-.06+i*.05))
    text('ProcessTitle'+str(i),title,(-.91,.47,.024),.10,label,p,False)
    box('ProcessLine'+str(i),(0,.19,.024),(1.82,.014,.004),red,0,p)
    text('ProcessCopy'+str(i),subtitle,(-.91,-.55,.024),.075,label,p,False)

def area(name,pos,power,color,size,target):
    light=bpy.data.lights.new(name,'AREA'); light.energy=power; light.shape='DISK'; light.size=size; light.color=color
    obj=bpy.data.objects.new(name,light); scene.collection.objects.link(obj); obj.location=pos
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox',(-4,-3,9),1300,(.92,.95,1),7,(0,0,0))
area('Rim softbox',(5,5,7),1100,(1,.85,.83),5,(0,0,0))
area('Front bounce',(0,-7,4),350,(.85,.9,1),4,(0,0,0))

# Bake static desk lighting. Dynamic objects retain physically based materials.
bpy.ops.object.select_all(action='DESELECT'); desk.select_set(True); bpy.context.view_layer.objects.active=desk
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.uv.smart_project(island_margin=.025); bpy.ops.object.mode_set(mode='OBJECT')
lightmap=bpy.data.images.new('DeskLightBake',width=1024,height=1024,alpha=False)
tex=deskmat.node_tree.nodes.new('ShaderNodeTexImage'); tex.image=lightmap; deskmat.node_tree.nodes.active=tex
scene.cycles.samples=64
scene.render.bake.use_pass_direct=True; scene.render.bake.use_pass_indirect=True; scene.render.bake.use_pass_color=True
bpy.ops.object.bake(type='DIFFUSE')
lightmap.filepath_raw=str(SOURCE/'desk-light.png'); lightmap.file_format='PNG'; lightmap.save(); lightmap.pack()
# Export baked desk as unlit; the bake contains soft shadows and indirect illumination.
nodes=deskmat.node_tree.nodes; out=nodes.get('Material Output'); emission=nodes.new('ShaderNodeEmission')
deskmat.node_tree.links.new(tex.outputs['Color'],emission.inputs['Color'])
deskmat.node_tree.links.new(emission.outputs[0],out.inputs['Surface'])

camera_data=bpy.data.cameras.new('StudioCamera'); camera=bpy.data.objects.new('StudioCamera',camera_data)
scene.collection.objects.link(camera); scene.camera=camera; camera_data.lens=48
shots=[
 {'id':'intro','position':[8,-11,13.5],'target':[0,0,0],'cover':0},
 {'id':'work','position':[1,-6.8,9.2],'target':[-.3,-.65,.25],'cover':-110},
 {'id':'social','position':[-6.4,-2.8,8.3],'target':[-4.5,1.3,.3],'cover':-110},
 {'id':'identity','position':[5.2,-2.2,8.4],'target':[3.6,1.5,.2],'cover':-110},
 {'id':'search','position':[-5.7,-6.5,7.8],'target':[-4.3,-2.4,.2],'cover':-110},
 {'id':'lead','position':[6,-6.2,8.2],'target':[4,-1.9,.2],'cover':-110},
 {'id':'process','position':[0,1.1,10.5],'target':[0,1.2,0],'cover':-110},
 {'id':'studio','position':[8,-10,14],'target':[0,0,0],'cover':-60},
 {'id':'contact','position':[4,-6,9],'target':[3.7,-1.8,.1],'cover':0},
]
def pose(shot):
    camera.location=shot['position']; camera.rotation_euler=(Vector(shot['target'])-camera.location).to_track_quat('-Z','Y').to_euler()
    hinge.rotation_euler.x=math.radians(shot['cover'])
pose(shots[0])
scene.render.resolution_x=1440; scene.render.resolution_y=900
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE/'konnect-studio.blend'))
# Lights/cameras are supplied by the runtime; retain only original mesh hierarchy.
bpy.ops.object.select_all(action='DESELECT')
for ob in scene.objects:
    if ob.type in ('MESH','EMPTY'): ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(SOURCE/'studio-source.glb'),export_format='GLB',use_selection=True,export_apply=True,export_cameras=False,export_lights=False,export_yup=True,export_animations=False)
def yup(v): return [v[0],v[2],-v[1]]
(ASSETS/'shots.json').write_text(json.dumps([{**s,'position':yup(s['position']),'target':yup(s['target'])} for s in shots],indent=2))
scene.render.engine='CYCLES'; scene.cycles.samples=24
for shot in shots:
    pose(shot)
    scene.render.resolution_x=1440; scene.render.resolution_y=900
    scene.render.filepath=str(RENDERS/(shot['id']+'.png')); bpy.ops.render.render(write_still=True)
    if shot['id'] in ('intro','work','process','studio','contact'):
        camera.location=Vector(shot['target'])+(Vector(shot['position'])-Vector(shot['target']))*1.18
        scene.render.resolution_x=800; scene.render.resolution_y=1000
        scene.render.filepath=str(RENDERS/(shot['id']+'-mobile.png')); bpy.ops.render.render(write_still=True)
print('KONNECT STUDIO COMPLETE')
