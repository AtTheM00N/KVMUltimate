"""Original manufactured props and studio architecture. Executed by build_studio.py.
No third-party models, trademarks or invented client data. Blender Z-up.
"""
import numpy as np

def remove_group(name):
    root=bpy.data.objects.get(name)
    if root:
        for ob in list(root.children_recursive): bpy.data.objects.remove(ob,do_unlink=True)
        bpy.data.objects.remove(root,do_unlink=True)

def surface_texture(mat,name,kind):
    # Physical-scale variation is deliberately restrained, rather than a noise overlay.
    n=1024; rng=np.random.default_rng(26)
    y,x=np.mgrid[0:n,0:n].astype(np.float32)
    noise=rng.normal(0,1,(n,n)).astype(np.float32)
    if kind=='oak': value=.90+.035*np.sin(y*.31+np.sin(x*.005)*3)+noise*.018
    elif kind=='metal': value=.96+.018*np.sin(y*2.7)+noise*.008
    elif kind=='paper': value=.97+noise*.018
    else: value=.92+.025*np.sin(x*.017)*np.sin(y*.013)+noise*.012
    base=np.array(mat.diffuse_color[:3]); pixels=np.ones((n,n,4),dtype=np.float32)
    # Images are stored as sRGB; convert linear material values for the texture.
    color=np.clip(value[:,:,None]*base[None,None,:],0,1)
    pixels[:,:,:3]=np.where(color<.0031308,12.92*color,1.055*np.power(color,1/2.4)-.055)
    im=bpy.data.images.new(name,width=n,height=n,alpha=False)
    im.pixels.foreach_set(pixels.ravel()); im.filepath_raw=str(SOURCE/(name+'.png')); im.file_format='PNG'; im.save(); im.pack()
    tex=mat.node_tree.nodes.new('ShaderNodeTexImage'); tex.image=im
    bs=mat.node_tree.nodes.get('Principled BSDF')
    mat.node_tree.links.new(tex.outputs['Color'],bs.inputs['Base Color'])
    return im

def cable(name,points,radius,mat,owner=None):
    curve=bpy.data.curves.new(name,'CURVE'); curve.dimensions='3D'; curve.resolution_u=12
    curve.bevel_depth=radius; curve.bevel_resolution=3
    path=curve.splines.new('BEZIER'); path.bezier_points.add(len(points)-1)
    for p,co in zip(path.bezier_points,points): p.co=co; p.handle_left_type='AUTO'; p.handle_right_type='AUTO'
    ob=bpy.data.objects.new(name,curve); scene.collection.objects.link(ob); curve.materials.append(mat)
    bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True); bpy.context.view_layer.objects.active=ob; bpy.ops.object.convert(target='MESH')
    return parent(bpy.context.object,owner)

def consolidate(owner):
    # Retain prop groups; batch meshes by material to reduce runtime draw calls.
    # Individual parts can be regenerated and edited through this source script.
    meshes=[o for o in owner.children_recursive if o.type=='MESH']
    batches={}
    for ob in meshes: batches.setdefault(tuple(m.name for m in ob.data.materials),[]).append(ob)
    for index,objects in enumerate(batches.values()):
        if len(objects)<2: continue
        bpy.ops.object.select_all(action='DESELECT')
        for ob in objects: ob.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]; bpy.ops.object.join()
        bpy.context.object.name=owner.name+'Material'+str(index)

for name in ['ContentDisplay','WebsiteStructure','CampaignBrief','DeskLamp','Pencil','Ruler']:
    remove_group(name)

alloy=material('Bead blasted graphite aluminium',(.085,.09,.10),.32,.85)
trim=material('Diamond cut edge',(.28,.30,.32),.22,.92)
rubber=material('Soft black elastomer',(.009,.010,.012),.88)
keys=material('Satin keycaps',(.017,.018,.021),.48)
screen=material('Screen printed dark glass',(.013,.017,.022),.18,.22)
screen.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value=.65
screen.node_tree.nodes['Principled BSDF'].inputs['Coat Roughness'].default_value=.12
lens=material('Optical lens coating',(.025,.045,.065),.08,.45)
paperwhite=material('Uncoated grey paper',(.44,.44,.43),.92)
wall=material('Charcoal mineral plaster',(.045,.047,.05),.93)
oak=material('Smoked oak',(.027,.022,.021),.65)
floor=material('Polished concrete',(.032,.034,.037),.64)
bookred=material('Scarlet book cloth',(.30,.008,.014),.9)
surface_texture(alloy,'alloy-brush','metal'); surface_texture(paperwhite,'paper-fibre','paper')
surface_texture(wall,'plaster-grain','plaster'); surface_texture(oak,'oak-grain','oak')
surface_texture(deskmat,'desk-grain','oak')

# A real bench inside an architectural room, rather than an endless flat plane.
room=group('StudioArchitecture')
box('ConcreteFloor',(0,0,-3.7),(65,60,.22),floor,.04,room)
box('PlasterBackdrop',(0,9.2,4),(42,.32,15.4),wall,.04,room)
box('Skirting',(0,8.97,-3.1),(42,.16,.65),ink,.01,room)
for x in (-7.3,7.3):
    box('DeskLeg',(x,0,-1.9),(.3,9.4,3.4),ink,.07,room)
    box('DeskFoot',(x,0,-3.52),(.65,9.7,.15),rubber,.05,room)
box('DeskApron',(0,4.7,-.65),(15,.2,.65),ink,.02,room)
# Ribbed acoustic timber and a shallow floating shelf in the right background.
for x in np.arange(5.7,14,.25): box('AcousticSlat',(float(x),8.88,2.4),(.11,.16,11),oak,.025,room)
for z in (1.3,4.4):
    box('FloatingShelf',(7.4,8.35,z),(8,1.1,.15),alloy,.035,room)
    for i in range(7):
        book=group('BoundStudioBook',(4.2+i*.33,8.1,z+.08)); book.parent=room
        book.rotation_euler.y=(-.05 if i==6 else 0)
        height=1.0+(i%3)*.08; cloth=darkpaper if i%3 else bookred
        box('BookPageBlock',(0,0,height/2),(.19,.60,height-.04),paperwhite,.004,book)
        for x in (-.113,.113): box('BookCover',(x,0,height/2),(.028,.66,height),cloth,.004,book)
        box('ClothSpine',(0,-.322,height/2),(.24,.027,height),cloth,.012,book)
        for dz in (.12,height-.12): box('SpineFoil',(0,-.338,dz),(.13,.001,.008),grey,0,book)
    box('ArchiveBox',(9.1,8.1,z+.46),(2.3,.8,.75),grey,.04,room)
    box('ArchiveLid',(9.1,8.1,z+.84),(2.33,.83,.055),darkpaper,.015,room)
    box('ArchiveHandle',(9.1,7.694,z+.49),(.42,.008,.075),black,.025,room)
# Frosted architectural window; light is authored separately, not a CSS wash.
windowmat=material('Frosted grey window',(.23,.25,.28),.55)
bs=windowmat.node_tree.nodes['Principled BSDF']; bs.inputs['Emission Color'].default_value=(.30,.32,.36,1); bs.inputs['Emission Strength'].default_value=.6
box('WindowGlass',(-11,5,2.5),(.10,7.8,10.6),windowmat,.02,room)
for y in (1,3.6,6.2,9): box('WindowMullion',(-10.9,y,2.5),(.18,.1,10.8),ink,.015,room)
for z in (-2.8,2.5,7.8): box('WindowCrossbar',(-10.9,5,z),(.18,8.1,.1),ink,.015,room)
consolidate(room)

# Laptop: tapered milled enclosure, recessed keyboard, separate keycaps, trackpad,
# speaker perforations, working hinge geometry, display gasket and USB-C ports.
laptop=group('StudioLaptop',(-4.8,-2.65,.025),-.16)
box('LaptopLowerShell',(0,0,.10),(3.72,2.52,.17),alloy,.075,laptop)
box('LaptopChamfer',(0,0,.18),(3.68,2.48,.045),trim,.05,laptop)
box('LaptopPalmRest',(0,0,.205),(3.64,2.44,.06),alloy,.05,laptop)
box('KeyboardWell',(0,.38,.24),(3.12,1.5,.025),rubber,.04,laptop)
for i in range(13):
    x=-1.40+i*.233
    box('FunctionKey',(x,1.055,.267),(.204,.13,.042),keys,.012,laptop)
    if i in (0,12): text('FunctionLegend','esc' if i==0 else 'power',(x-.065,1.035,.29),.038,label,laptop,False)
for row,letters in enumerate(['1234567890','QWERTYUIOP','ASDFGHJKL','ZXCVBNM']):
    y=.85-row*.265; start=-1.32+row*.05
    for col,ch in enumerate(letters):
        x=start+col*.277
        box('Keycap',(x,y,.275),(.245,.222,.058),keys,.018,laptop)
        text('KeyLegend',ch,(x-.026,y-.027,.307),.070,label,laptop,False)
for x,w in [(-1.3,.23),(-.98,.28),(0,1.4),(.98,.28),(1.3,.23)]: box('ModifierKey',(x,-.25,.275),(w,.20,.058),keys,.015,laptop)
for x,y,w,caption in [(1.46,.85,.22,'del'),(1.45,.585,.24,'['),(1.34,.32,.43,'enter'),(-1.4,.055,.25,'shift'),(1.08,.055,.88,'shift')]:
    box('UtilityKey',(x,y,.275),(w,.222,.058),keys,.018,laptop)
    text('UtilityLegend',caption,(x-w*.35,y-.025,.307),.045,label,laptop,False)
box('TrackpadSeam',(0,-.77,.24),(1.5,.69,.012),rubber,.045,laptop)
box('GlassTrackpad',(0,-.77,.249),(1.47,.66,.014),alloy,.04,laptop)
for x in (-1.67,1.67):
    for y in np.linspace(-.18,.96,15):
        for dx in (-.032,.032): cylinder('SpeakerPerforation',(x+dx,float(y),.241),.012,.003,rubber,laptop)
    for y in (-.7,-.32): box('USBPort',(x*1.105,y,.11),(.012,.23,.075),rubber,.018,laptop)
for x in (-1.28,1.28):
    h=cylinder('LaptopHinge',(x,1.16,.25),.105,.55,alloy,laptop); h.rotation_euler.y=math.pi/2
lid=group('LaptopDisplay',(0,1.17,.25)); lid.parent=laptop; lid.rotation_euler.x=math.radians(76)
# Lid is authored in local X/Y plane then rotated up around its hinge.
box('DisplayRear',(0,1.18,0),(3.72,2.36,.10),alloy,.065,lid)
box('DisplayGasket',(0,1.18,.058),(3.60,2.24,.023),rubber,.048,lid)
box('LaptopGlass',(0,1.18,.074),(3.48,2.12,.018),screen,.045,lid)
box('LaptopScreen',(0,1.18,.086),(3.31,1.93,.004),ink,.015,lid)
cylinder('LaptopWebcam',(0,2.245,.077),.028,.009,lens,lid)
text('ScreenBrand','KONNECT',(-1.48,1.88,.09),.12,label,lid)
box('BrowserHairline',(0,1.72,.090),(2.98,.006,.002),grey,0,lid)
text('ScreenTitle','Made to\nconnect.',(-1.47,1.30,.091),.25,label,lid)
box('ScreenArtwork',(1.00,.9,.092),(.9,1.3,.003),red,.012,lid)
text('ScreenArt','K',(.72,.6,.096),.95,label,lid)
for i,w in enumerate((1.3,1.65,1.1)): box('ScreenCopy',(-1.47+w/2,.43-i*.075,.092),(w,.018,.002),grey,0,lid)
for x in (-1.45,1.45):
    for y in (-.95,.95): cylinder('LaptopFoot',(x,y,.005),.09,.035,rubber,laptop)
consolidate(laptop)

# Tablet: chamfered case, inset optical glass, front camera and side controls.
tablet=group('ContentDisplay',(-4.85,1.45,.045),.14)
box('TabletShell',(0,0,.055),(2.18,3.18,.11),alloy,.10,tablet)
box('TabletPolishedEdge',(0,0,.109),(2.16,3.16,.027),trim,.09,tablet)
box('TabletGasket',(0,0,.127),(2.10,3.10,.02),rubber,.085,tablet)
box('TabletCoverGlass',(0,0,.141),(2.07,3.07,.018),screen,.08,tablet)
box('TabletDisplay',(0,0,.153),(1.91,2.77,.005),ink,.06,tablet)
box('TabletArtwork',(0,.16,.159),(1.73,2.18,.005),red,.015,tablet)
text('TabletHeading','A point\nof view.',(-.72,.78,.166),.29,label,tablet)
# Printed campaign composition, with flat ink rather than a plastic ring.
for i in range(12):
    stripe=box('TabletPrint',(-.43+i*.08,-.53,.165),(.035,.55,.001),label,0,tablet); stripe.rotation_euler.z=-.4
box('TabletGesture',(0,-1.34,.165),(.43,.014,.003),label,.006,tablet)
cylinder('TabletCamera',(0,1.45,.153),.026,.008,lens,tablet)
for x in np.linspace(-.64,.64,13):
    for y in (-1.588,1.588):
        hole=cylinder('TabletSpeaker',(float(x),y,.055),.012,.004,rubber,tablet); hole.rotation_euler.x=math.pi/2
box('TabletUSB',(0,-1.591,.055),(.23,.006,.038),rubber,.012,tablet)
for y in (.8,1.13): box('VolumeButton',(1.098,y,.057),(.015,.22,.045),trim,.01,tablet)
consolidate(tablet)

# Campaign brief: layered paper with a lightly lifted corner and printed form fields.
brief=group('CampaignBrief',(4.1,-2.2,.045),.20)
for i in range(4): box('BriefPaperLayer',(i*.012,-i*.01,i*.008),(2.65,3.20,.007),paperwhite,.004,brief)
verts=[]; faces=[]; nx=18; ny=22
for j in range(ny+1):
    for i in range(nx+1):
        x=-1.325+i*2.65/nx; y=-1.6+j*3.2/ny
        lift=.15*max(0,(x-.75)/.575)**2*max(0,(-y-.95)/.65)**2
        verts.append((x,y,.036+lift))
for j in range(ny):
    for i in range(nx):
        k=j*(nx+1)+i; faces.append((k,k+1,k+nx+2,k+nx+1))
mesh=bpy.data.meshes.new('CurledPaperMesh'); mesh.from_pydata(verts,[],faces); mesh.update()
sheet=bpy.data.objects.new('CurledBriefSheet',mesh); scene.collection.objects.link(sheet); sheet.parent=brief; mesh.materials.append(paperwhite)
bpy.ops.object.select_all(action='DESELECT'); sheet.select_set(True); bpy.context.view_layer.objects.active=sheet
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.uv.smart_project(); bpy.ops.object.mode_set(mode='OBJECT')
text('BriefWordmark','KONNECT',(-1.10,1.23,.042),.13,black,brief)
text('BriefTitle','Your next\nproject.',(-1.10,.72,.043),.30,black,brief)
for y,caption in [(.15,'Name'),(-.23,'Email'),(-.61,'What do you have in mind?')]:
    text('PrintedFormLabel',caption,(-1.1,y,.043),.075,black,brief,False)
    box('PrintedFormRule',(0,y-.14,.042),(2.2,.005,.001),darkpaper,0,brief)
box('BriefMargin',(0,1.08,.042),(2.2,.008,.001),red,0,brief)
for y in (-1.03,-1.22): box('BriefWritingLine',(0,y,.042),(2.2,.004,.001),darkpaper,0,brief)
# Real folded-wire clip, no generic ring.
cable('WirePaperclip',[(-.9,1.25,.06),(-1.05,1.3,.06),(-1.1,1.59,.06),(-.9,1.65,.06),(-.85,1.23,.06),(-1.01,1.19,.06),(-1.05,1.5,.06),(-.95,1.53,.06)],.012,silver,brief)
consolidate(brief)

# Machined pen with a tapered nib, grip rings and pocket clip.
pen=group('StudioPen',(2.0,-3.7,.10),-.35)
barrel=cylinder('PenBarrel',(0,0,0),.055,1.8,red,pen); barrel.rotation_euler.x=math.pi/2
for y in np.linspace(-.65,-.3,8):
    grip=ring('PenGrip',(0,float(y),0),.057,.003,silver,pen); grip.rotation_euler.x=math.pi/2
bpy.ops.mesh.primitive_cone_add(vertices=48,radius1=.053,radius2=.014,depth=.34,location=(0,-1.07,0))
tip=bpy.context.object; tip.name='PenNib'; tip.rotation_euler.x=math.pi/2; tip.data.materials.append(silver); tip.parent=pen
cable('PenPocketClip',[(0,.8,.05),(0,.8,.11),(0,.32,.10),(0,.25,.065)],.015,silver,pen)
consolidate(pen)

# Articulated task lamp and a believable power cable.
lamp=group('DeskLamp',(-6.4,4,.02))
cylinder('LampWeightedFoot',(0,0,.07),.56,.14,alloy,lamp)
for name,points in [('LowerLampArm',[(0,0,.12),(0,.28,1.5)]),('UpperLampArm',[(0,.28,1.5),(.55,-.45,2.7)])]: cable(name,points,.046,alloy,lamp)
for co in [(0,.28,1.5),(.55,-.45,2.7)]:
    joint=cylinder('LampAdjustmentJoint',co,.12,.14,trim,lamp); joint.rotation_euler.y=math.pi/2
box('LampHead',(.55,-.8,2.7),(1.2,.85,.11),alloy,.12,lamp)
diffuser=material('Lamp diffuser',(.5,.49,.45),.7)
diffuser.node_tree.nodes['Principled BSDF'].inputs['Emission Color'].default_value=(.6,.57,.50,1)
diffuser.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value=1.0
box('LampDiffuser',(.55,-.8,2.635),(1.08,.72,.015),diffuser,.07,lamp)
cable('LampPowerCable',[(0,.4,.015),(-.5,.9,.015),(-1.0,1.2,.015),(-1.1,2.0,-.10),(-1.1,2.1,-1.3)],.022,rubber,lamp)
consolidate(lamp)

# Edge construction and fine stitching give the portfolio physical scale.
for x in (-2.32,2.32):
    for y in np.arange(-3.13,-.18,.09): box('CoverStitch',(x,float(y),.069),(.014,.036,.003),darkpaper,.004,hinge)
for y in (-3.18,-.12):
    for x in np.arange(-2.25,2.26,.09): box('CoverStitch',(float(x),y,.069),(.036,.014,.003),darkpaper,.004,hinge)
# Flatten raised print art into actual printed graphics.
for ob in list(bpy.data.objects):
    if ob.name.startswith(('SpreadCircle','SpreadBar','SocialMark','PaperClip')): bpy.data.objects.remove(ob,do_unlink=True)
for i in (1,2):
    art=bpy.data.objects['ProjectInk'+str(i)]; x=-1.16 if i==1 else 1.16
    for j in range(14):
        mark=box('PrintedIdentity',(x-.54+j*.08,-.42,.321),(.035,1.0,.001),red,0,art); mark.rotation_euler.z=.32 if i==1 else -.32
    consolidate(art)
consolidate(hinge)

# The remaining layouts are printed stationery, not raised plastic UI shapes.
for ob in list(bpy.data.objects):
    if ob.name.startswith(('ProcessImprint','ProcessCentre')): bpy.data.objects.remove(ob,do_unlink=True)
    if ob.name.startswith('Swatch'):
        ob.scale.z=.04; ob.location.z=.013
    if ob.name.startswith('IdentityTitle'): ob.location.z=.012
for i,word in enumerate(('The brief','Creative direction','Ready to launch'),1):
    sheet=bpy.data.objects['ProcessSheet'+str(i)]
    text('ProcessPrint',word,(-.88,.50,.013),.095,label,sheet,False)
    box('PrintTopRule',(0,.33,.014),(1.76,.005,.001),red,0,sheet)
    for j,w in enumerate((1.5,1.66,1.3,1.52)):
        box('PrintBodyRule',(-.88+w/2,.13-j*.13,.014),(w,.012,.001),grey,0,sheet)
    consolidate(sheet)
