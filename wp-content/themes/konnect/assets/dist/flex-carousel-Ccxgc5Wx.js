import{a as e,i as t,n,r,t as i}from"./pocket-motion-D1MPYsaD.js";var a=new Uint8Array(4);function o(e){return!(e&e-1)}var s=1,c=class{constructor(e,{image:t,target:n=e.TEXTURE_2D,type:r=e.UNSIGNED_BYTE,format:i=e.RGBA,internalFormat:a=i,wrapS:o=e.CLAMP_TO_EDGE,wrapT:c=e.CLAMP_TO_EDGE,wrapR:l=e.CLAMP_TO_EDGE,generateMipmaps:u=n===(e.TEXTURE_2D||e.TEXTURE_CUBE_MAP),minFilter:d=u?e.NEAREST_MIPMAP_LINEAR:e.LINEAR,magFilter:f=e.LINEAR,premultiplyAlpha:p=!1,unpackAlignment:m=4,flipY:h=n==(e.TEXTURE_2D||e.TEXTURE_3D),anisotropy:g=0,level:_=0,width:v,height:y=v,length:b=1}={}){this.gl=e,this.id=s++,this.image=t,this.target=n,this.type=r,this.format=i,this.internalFormat=a,this.minFilter=d,this.magFilter=f,this.wrapS=o,this.wrapT=c,this.wrapR=l,this.generateMipmaps=u,this.premultiplyAlpha=p,this.unpackAlignment=m,this.flipY=h,this.anisotropy=Math.min(g,this.gl.renderer.parameters.maxAnisotropy),this.level=_,this.width=v,this.height=y,this.length=b,this.texture=this.gl.createTexture(),this.store={image:null},this.glState=this.gl.renderer.state,this.state={},this.state.minFilter=this.gl.NEAREST_MIPMAP_LINEAR,this.state.magFilter=this.gl.LINEAR,this.state.wrapS=this.gl.REPEAT,this.state.wrapT=this.gl.REPEAT,this.state.anisotropy=0}bind(){this.glState.textureUnits[this.glState.activeTextureUnit]!==this.id&&(this.gl.bindTexture(this.target,this.texture),this.glState.textureUnits[this.glState.activeTextureUnit]=this.id)}update(e=0){let t=!(this.image===this.store.image&&!this.needsUpdate);if((t||this.glState.textureUnits[e]!==this.id)&&(this.gl.renderer.activeTexture(e),this.bind()),t){if(this.needsUpdate=!1,this.flipY!==this.glState.flipY&&(this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,this.flipY),this.glState.flipY=this.flipY),this.premultiplyAlpha!==this.glState.premultiplyAlpha&&(this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),this.glState.premultiplyAlpha=this.premultiplyAlpha),this.unpackAlignment!==this.glState.unpackAlignment&&(this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT,this.unpackAlignment),this.glState.unpackAlignment=this.unpackAlignment),this.minFilter!==this.state.minFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MIN_FILTER,this.minFilter),this.state.minFilter=this.minFilter),this.magFilter!==this.state.magFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MAG_FILTER,this.magFilter),this.state.magFilter=this.magFilter),this.wrapS!==this.state.wrapS&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_S,this.wrapS),this.state.wrapS=this.wrapS),this.wrapT!==this.state.wrapT&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_T,this.wrapT),this.state.wrapT=this.wrapT),this.wrapR!==this.state.wrapR&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_R,this.wrapR),this.state.wrapR=this.wrapR),this.anisotropy&&this.anisotropy!==this.state.anisotropy&&(this.gl.texParameterf(this.target,this.gl.renderer.getExtension(`EXT_texture_filter_anisotropic`).TEXTURE_MAX_ANISOTROPY_EXT,this.anisotropy),this.state.anisotropy=this.anisotropy),this.image){if(this.image.width&&(this.width=this.image.width,this.height=this.image.height),this.target===this.gl.TEXTURE_CUBE_MAP)for(let e=0;e<6;e++)this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+e,this.level,this.internalFormat,this.format,this.type,this.image[e]);else if(ArrayBuffer.isView(this.image))this.target===this.gl.TEXTURE_2D?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,this.image):(this.target===this.gl.TEXTURE_2D_ARRAY||this.target===this.gl.TEXTURE_3D)&&this.gl.texImage3D(this.target,this.level,this.internalFormat,this.width,this.height,this.length,0,this.format,this.type,this.image);else if(this.image.isCompressedTexture)for(let e=0;e<this.image.length;e++)this.gl.compressedTexImage2D(this.target,e,this.internalFormat,this.image[e].width,this.image[e].height,0,this.image[e].data);else this.target===this.gl.TEXTURE_2D?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.format,this.type,this.image):this.gl.texImage3D(this.target,this.level,this.internalFormat,this.width,this.height,this.length,0,this.format,this.type,this.image);this.generateMipmaps&&(!this.gl.renderer.isWebgl2&&(!o(this.image.width)||!o(this.image.height))?(this.generateMipmaps=!1,this.wrapS=this.wrapT=this.gl.CLAMP_TO_EDGE,this.minFilter=this.gl.LINEAR):this.gl.generateMipmap(this.target)),this.onUpdate&&this.onUpdate()}else if(this.target===this.gl.TEXTURE_CUBE_MAP)for(let e=0;e<6;e++)this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,a);else this.width?this.target===this.gl.TEXTURE_2D?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,null):this.gl.texImage3D(this.target,this.level,this.internalFormat,this.width,this.height,this.length,0,this.format,this.type,null):this.gl.texImage2D(this.target,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,a);this.store.image=this.image}}},l=class{constructor(e,{width:t=e.canvas.width,height:n=e.canvas.height,target:r=e.FRAMEBUFFER,color:i=1,depth:a=!0,stencil:o=!1,depthTexture:s=!1,wrapS:l=e.CLAMP_TO_EDGE,wrapT:u=e.CLAMP_TO_EDGE,wrapR:d=e.CLAMP_TO_EDGE,minFilter:f=e.LINEAR,magFilter:p=f,type:m=e.UNSIGNED_BYTE,format:h=e.RGBA,internalFormat:g=h,unpackAlignment:_,premultiplyAlpha:v}={}){this.gl=e,this.width=t,this.height=n,this.depth=a,this.stencil=o,this.buffer=this.gl.createFramebuffer(),this.target=r,this.gl.renderer.bindFramebuffer(this),this.textures=[];let y=[];for(let r=0;r<i;r++)this.textures.push(new c(e,{width:t,height:n,wrapS:l,wrapT:u,wrapR:d,minFilter:f,magFilter:p,type:m,format:h,internalFormat:g,unpackAlignment:_,premultiplyAlpha:v,flipY:!1,generateMipmaps:!1})),this.textures[r].update(),this.gl.framebufferTexture2D(this.target,this.gl.COLOR_ATTACHMENT0+r,this.gl.TEXTURE_2D,this.textures[r].texture,0),y.push(this.gl.COLOR_ATTACHMENT0+r);y.length>1&&this.gl.renderer.drawBuffers(y),this.texture=this.textures[0],s&&(this.gl.renderer.isWebgl2||this.gl.renderer.getExtension(`WEBGL_depth_texture`))?(this.depthTexture=new c(e,{width:t,height:n,minFilter:this.gl.NEAREST,magFilter:this.gl.NEAREST,format:this.stencil?this.gl.DEPTH_STENCIL:this.gl.DEPTH_COMPONENT,internalFormat:e.renderer.isWebgl2?this.stencil?this.gl.DEPTH24_STENCIL8:this.gl.DEPTH_COMPONENT16:this.gl.DEPTH_COMPONENT,type:this.stencil?this.gl.UNSIGNED_INT_24_8:this.gl.UNSIGNED_INT}),this.depthTexture.update(),this.gl.framebufferTexture2D(this.target,this.stencil?this.gl.DEPTH_STENCIL_ATTACHMENT:this.gl.DEPTH_ATTACHMENT,this.gl.TEXTURE_2D,this.depthTexture.texture,0)):(a&&!o&&(this.depthBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_COMPONENT16,t,n),this.gl.framebufferRenderbuffer(this.target,this.gl.DEPTH_ATTACHMENT,this.gl.RENDERBUFFER,this.depthBuffer)),o&&!a&&(this.stencilBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.stencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.STENCIL_INDEX8,t,n),this.gl.framebufferRenderbuffer(this.target,this.gl.STENCIL_ATTACHMENT,this.gl.RENDERBUFFER,this.stencilBuffer)),a&&o&&(this.depthStencilBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthStencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_STENCIL,t,n),this.gl.framebufferRenderbuffer(this.target,this.gl.DEPTH_STENCIL_ATTACHMENT,this.gl.RENDERBUFFER,this.depthStencilBuffer))),this.gl.renderer.bindFramebuffer({target:this.target})}setSize(e,t){if(this.width!==e||this.height!==t){this.width=e,this.height=t,this.gl.renderer.bindFramebuffer(this);for(let n=0;n<this.textures.length;n++)this.textures[n].width=e,this.textures[n].height=t,this.textures[n].needsUpdate=!0,this.textures[n].update(),this.gl.framebufferTexture2D(this.target,this.gl.COLOR_ATTACHMENT0+n,this.gl.TEXTURE_2D,this.textures[n].texture,0);this.depthTexture?(this.depthTexture.width=e,this.depthTexture.height=t,this.depthTexture.needsUpdate=!0,this.depthTexture.update(),this.gl.framebufferTexture2D(this.target,this.gl.DEPTH_ATTACHMENT,this.gl.TEXTURE_2D,this.depthTexture.texture,0)):(this.depthBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_COMPONENT16,e,t)),this.stencilBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.stencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.STENCIL_INDEX8,e,t)),this.depthStencilBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthStencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_STENCIL,e,t))),this.gl.renderer.bindFramebuffer({target:this.target})}}},u=class t extends e{constructor(e,{width:n=1,height:r=1,widthSegments:i=1,heightSegments:a=1,attributes:o={}}={}){let s=i,c=a,l=(s+1)*(c+1),u=s*c*6,d=new Float32Array(l*3),f=new Float32Array(l*3),p=new Float32Array(l*2),m=u>65536?new Uint32Array(u):new Uint16Array(u);t.buildPlane(d,f,p,m,n,r,0,s,c),Object.assign(o,{position:{size:3,data:d},normal:{size:3,data:f},uv:{size:2,data:p},index:{data:m}}),super(e,o)}static buildPlane(e,t,n,r,i,a,o,s,c,l=0,u=1,d=2,f=1,p=-1,m=0,h=0){let g=m,_=i/s,v=a/c;for(let y=0;y<=c;y++){let b=y*v-a/2;for(let a=0;a<=s;a++,m++){let v=a*_-i/2;if(e[m*3+l]=v*f,e[m*3+u]=b*p,e[m*3+d]=o/2,t[m*3+l]=0,t[m*3+u]=0,t[m*3+d]=o>=0?1:-1,n[m*2]=a/s,n[m*2+1]=1-y/c,y===c||a===s)continue;let x=g+a+y*(s+1),S=g+a+(y+1)*(s+1),C=g+a+(y+1)*(s+1)+1,w=g+a+y*(s+1)+1;r[h*6]=x,r[h*6+1]=S,r[h*6+2]=w,r[h*6+3]=S,r[h*6+4]=C,r[h*6+5]=w,h++}}}},d=12,f=`#version 300 es
in vec3 position;
in vec2 uv;
uniform vec4 uRect;
uniform vec2 uResolution;
out vec2 vUv;
out vec2 vLocal;
void main() {
  vUv = uv;
  vLocal = vec2(position.x, -position.y) * uRect.zw;
  vec2 px = uRect.xy + vLocal;
  gl_Position = vec4(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0, 0.0, 1.0);
}
`,p=`#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 uSize;
uniform vec2 uImage;
uniform float uRadius;
uniform float uAlpha;
uniform float uReady;
uniform float uShift;
uniform float uDpr;
uniform vec3 uPlaceholder;
in vec2 vUv;
in vec2 vLocal;
out vec4 fragColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float sd = roundedBox(vLocal, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float mask = clamp(0.5 - sd * uDpr, 0.0, 1.0);
  vec2 local = vLocal / uSize + 0.5;
  float cardAspect = uSize.x / uSize.y;
  float imageAspect = uImage.x / max(uImage.y, 1.0);
  vec2 scale = imageAspect > cardAspect ? vec2(cardAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / cardAspect);
  scale /= 1.08;
  vec2 uv = vec2(local.x, 1.0 - local.y);
  uv = (uv - 0.5) * scale + 0.5;
  uv.x += uShift * (1.0 - scale.x) * 0.5;
  vec3 image = texture(tMap, uv).rgb;
  vec3 color = mix(uPlaceholder, image, uReady);
  float alpha = mask * uAlpha;
  fragColor = vec4(color * alpha, alpha);
}
`,m=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,h=`#version 300 es
precision highp float;
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uAngle;
uniform float uExponent;
uniform float uInner;
uniform float uOuter;
uniform float uFlow;
uniform float uCurl;
uniform float uDispersion;
uniform float uStrength;
uniform float uSceneAlpha;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  vec2 uv = frag / uResolution;
  vec2 rel = frag - vec2(uCenter.x, uResolution.y - uCenter.y);
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec2 local = vec2(ca * rel.x + sa * rel.y, -sa * rel.x + ca * rel.y);
  vec2 k = max(abs(local) / uHalf, vec2(1e-5));
  float nd = pow(pow(k.x, uExponent) + pow(k.y, uExponent), 1.0 / uExponent);
  vec2 grad = pow(k, vec2(uExponent - 1.0)) * sign(local) / uHalf * pow(nd, 1.0 - uExponent);
  float glen = max(length(grad), 1e-6);
  float edge = (nd - 1.0) / glen;
  vec2 outward = grad / glen;
  vec2 normal = vec2(ca * outward.x - sa * outward.y, sa * outward.x + ca * outward.y);
  vec2 along = vec2(-normal.y, normal.x);

  float t = clamp((edge + uInner) / (uInner + uOuter), 0.0, 1.0);
  float ramp = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float slope = 16.0 * t * t * (1.0 - t) * (1.0 - t);
  float reachX = rel.x / (uResolution.x * 0.5);
  float side = smoothstep(0.02, 0.3, abs(reachX)) * (uCurl == 0.0 ? sign(reachX) : uCurl);
  float lift = ramp * side * uFlow * uStrength;
  vec2 swirl = along * along.y * side * slope * uFlow * uStrength * 0.35;
  vec2 drift = vec2(0.0, -lift) - swirl;
  vec2 shifted = uv + drift / uResolution;

  vec2 texels = uResolution * uDpr;
  vec2 gx = dFdx(shifted);
  vec2 gy = dFdy(shifted);
  gx *= min(1.0, 3.0 / max(length(gx * texels), 1e-4));
  gy *= min(1.0, 3.0 / max(length(gy * texels), 1e-4));

  vec4 color = textureGrad(tScene, shifted, gx, gy);
  vec2 spread = vec2(0.0, side * slope * uFlow * uStrength) / uResolution * uDispersion;
  float spreadPx = length(spread * texels);
  if (color.a > 0.002 && spreadPx > 0.25) {
    vec3 base = color.rgb / color.a;
    vec3 sumColor = vec3(0.0);
    vec3 sumWeight = vec3(0.0);
    for (int i = 0; i < ${d}; i++) {
      float s = (float(i) + 0.5) / float(${d});
      vec4 c = textureGrad(tScene, shifted + spread * (s - 0.5), gx, gy);
      vec3 w = max(1.0 - abs(vec3(s) - vec3(0.15, 0.5, 0.85)) * 2.6, 0.0) * c.a;
      sumColor += c.rgb * (w / max(c.a, 0.002));
      sumWeight += w;
    }
    vec3 split = mix(base, sumColor / max(sumWeight, vec3(1e-4)), clamp(sumWeight * 2.0, 0.0, 1.0));
    color.rgb = mix(color.rgb, clamp(split, 0.0, 1.0) * color.a, smoothstep(0.25, 1.5, spreadPx));
  }

  fragColor = color * uSceneAlpha;
}
`,g=(e,t,n)=>Math.max(t,Math.min(n,e)),_=e=>Object.fromEntries(Object.entries(e).map(([e,t])=>[e,{value:t}]));function v(e,a){let o=document.createElement(`canvas`);o.setAttribute(`aria-hidden`,`true`);let s=o.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1});if(!s)throw Error(`Flex Carousel needs WebGL 2`);let d=new r({canvas:o,alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1});s.clearColor(0,0,0,0);let v=a.map((e,t)=>({texture:new c(s,{image:e,minFilter:s.LINEAR_MIPMAP_LINEAR}),size:[e.naturalWidth,e.naturalHeight],color:t%2?[0,0,0]:[143/255,0,0]})),y=_({tMap:v[0].texture,uRect:[0,0,1,1],uResolution:[1,1],uSize:[1,1],uImage:[1,1],uRadius:1,uAlpha:1,uReady:1,uShift:0,uDpr:1,uPlaceholder:[0,0,0]}),b=new l(s,{width:2,height:2,depth:!1,minFilter:s.LINEAR_MIPMAP_LINEAR,magFilter:s.LINEAR}),x=_({tScene:b.texture,uResolution:[1,1],uDpr:1,uCenter:[0,0],uHalf:[1,1],uAngle:0,uExponent:2,uInner:60,uOuter:80,uFlow:0,uCurl:0,uDispersion:0,uStrength:1,uSceneAlpha:1}),S=new t(s,{vertex:f,fragment:p,uniforms:y,transparent:!0,depthTest:!1,depthWrite:!1});S.setBlendFunc(s.ONE,s.ONE_MINUS_SRC_ALPHA);let C=new t(s,{vertex:m,fragment:h,uniforms:x,depthTest:!1,depthWrite:!1});if(![S,C].every(e=>s.getProgramParameter(e.program,s.LINK_STATUS)))throw s.getExtension(`WEBGL_lose_context`)?.loseContext(),Error(`Flex Carousel shaders failed to link`);let w=new n(s,{geometry:new u(s),program:S}),T=new n(s,{geometry:new i(s),program:C});e.append(o);let E=0,D=0,O=0,k=0,A=!1;function j(){if(k=0,A||s.isContextLost())return;let t=e.clientWidth,n=e.clientHeight;if(!t||!n)return;(t!==E||n!==D)&&(E=t,D=n,d.dpr=Math.min(devicePixelRatio||1,1.75,Math.sqrt(45e5/(E*D))),d.setSize(E,D),b.setSize(Math.max(2,Math.floor(E*d.dpr)),Math.max(2,Math.floor(D*d.dpr))));let r=Math.min(D*.72,E*.53),i=r+g(E*.015,10,22),a=r*(1-.12*Math.sin(O%1*Math.PI)),o=E/2,c=D*.47;y.uResolution.value=x.uResolution.value=[E,D],y.uDpr.value=x.uDpr.value=d.dpr,y.uSize.value=[a,a];let l=!0;for(let e=0;e<v.length;e++){let t=(e-O)*i;Math.abs(t)>o+a/2+8||(y.tMap.value=v[e].texture,y.uImage.value=v[e].size,y.uPlaceholder.value=v[e].color,y.uRect.value=[o+t,c,a+2,a+2],y.uShift.value=g(t/E,-1,1),d.render({scene:w,target:b,clear:l,frustumCull:!1}),l=!1)}d.bindFramebuffer(),b.texture.bind(),s.generateMipmap(s.TEXTURE_2D);let u=E*.37,f=D*.59,p=Math.max(4,.38*(u+f)*.5);x.uCenter.value=[o,c],x.uHalf.value=[u,f],x.uAngle.value=62*Math.PI/180,x.uInner.value=p,x.uOuter.value=p*1.6,x.uFlow.value=Math.min(D*.09,.22*(u+f)*.45),d.render({scene:T,frustumCull:!1})}function M(){!k&&!A&&(k=requestAnimationFrame(j))}let N=new ResizeObserver(M);return N.observe(e),{canvas:o,seek(e){O=g(e,0,v.length-1),M()},dispose(){A=!0,cancelAnimationFrame(k),N.disconnect(),o.remove(),s.getExtension(`WEBGL_lose_context`)?.loseContext()}}}export{v as createFlexCarousel};