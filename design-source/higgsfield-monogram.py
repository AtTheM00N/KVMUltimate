import bpy, math
from mathutils import Vector
scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE'
scene.world=bpy.data.worlds.new('Studio world')
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.012,.012,.016,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.3
def mat(name,c,rough,metal):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*c,1)
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*c,1);bs.inputs['Roughness'].default_value=rough;bs.inputs['Metallic'].default_value=metal
 return m
red=mat('Konnect scarlet lacquer',(.55,.005,.012),.23,.38)
floor=mat('Graphite stage',(.015,.016,.019),.38,.15)
# A continuous, deliberately broad K silhouette with a machined edge.
outline=[(-1.8,0),(-.65,0),(-.65,1.85),(1.25,0),(2.75,0),(.25,2.5),(2.65,4.8),(1.15,4.8),(-.65,2.95),(-.65,4.8),(-1.8,4.8)]
n=len(outline)
verts=[(x,y,z) for y in (-.42,.42) for x,z in outline]
faces=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]
faces += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
mesh=bpy.data.meshes.new('Machined K profile');mesh.from_pydata(verts,[],faces);mesh.update()
ob=bpy.data.objects.new('HERO_K',mesh);scene.collection.objects.link(ob);ob.data.materials.append(red)
bevel=ob.modifiers.new('Soft lacquer edge','BEVEL');bevel.width=.075;bevel.segments=5
ob.modifiers.new('Corner normals','WEIGHTED_NORMAL')
bpy.ops.mesh.primitive_plane_add(size=200);stage=bpy.context.object;stage.name='ENV_floor';stage.location.z=-.08;stage.data.materials.append(floor)
def light(name,pos,power,radius):
 d=bpy.data.lights.new(name,'POINT');d.energy=power;d.shadow_soft_size=radius
 o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos
light('LGT_key',(-4,-4,7),2000,3)
light('LGT_fill',(5,-1,4),700,2.5)
light('LGT_rim',(1,4,6),2400,2)
d=bpy.data.cameras.new('CAM_main');c=bpy.data.objects.new('CAM_main',d);scene.collection.objects.link(c);scene.camera=c
c.location=(7,-11,6);c.rotation_euler=(Vector((.2,0,2.3))-c.location).to_track_quat('-Z','Y').to_euler();d.lens=48
scene.view_settings.view_transform='AgX'
scene.render.resolution_x=960;scene.render.resolution_y=640;scene.render.resolution_percentage=100
target=artifacts.file(name='konnect-monogram.png',media_type='image/png')
scene.render.filepath=str(target.path);scene.render.image_settings.media_type='IMAGE';scene.render.image_settings.file_format='PNG'
bpy.ops.render.render(write_still=True);target.publish()
result={'hero':ob.name,'dimensions':list(ob.dimensions),'vertices':len(mesh.vertices),'camera':list(c.location)}

