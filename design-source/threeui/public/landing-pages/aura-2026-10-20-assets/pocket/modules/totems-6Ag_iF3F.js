import{a as e}from"grail/chunk-BEqpzyXh.js";import{n as t,t as n}from"grail/jsx-runtime-B4RpOl0S.js";import{t as r}from"grail/viewport-DYDJlLll.js";import{t as i}from"grail/device-DfrJF2Wj.js";var a=e(t(),1),o=`
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,s=`
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < 4; i++) { v += valueNoise(p) * amp; p = p * 2.03 + 7.1; amp *= 0.5; }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Domain-warped noise → a slow, fluid "heat over dark gold" field (the same
  // warp idea as the accept-quest ink, but barely moving).
  float t = uTime * 0.05;
  vec2 q = vec2(fbm(p * 1.7 + vec2(0.0, t)), fbm(p * 1.7 + vec2(4.6, -t)));
  vec2 r = vec2(fbm(p * 1.7 + 2.2 * q + vec2(1.7, 9.2)), fbm(p * 1.7 + 2.2 * q + vec2(8.3, 2.8)));
  float n = fbm(p * 1.7 + 2.6 * r);
  n = smoothstep(0.35, 1.0, n); // keep most of it near black

  // Cursor = a roving warm light, a torch grazing the wall.
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float glow = exp(-dot(p - m, p - m) * 2.4);

  // Edges sit darker than the centre.
  float vig = 1.0 - 0.45 * length(uv - 0.5);
  float field = n * vig;

  // Compose, very dark: near-black + faint gilded sheen + cool wash + warm torch.
  vec3 col = vec3(0.006, 0.006, 0.008);
  col += vec3(0.085, 0.062, 0.028) * field;                  // dim gold sheen in the haze
  col += vec3(0.015, 0.020, 0.040) * field * (1.0 - glow);   // cool wash away from the cursor
  col += vec3(0.20, 0.135, 0.06) * glow * (0.35 + 0.7 * field); // warm pool at the cursor
  gl_FragColor = vec4(col, 1.0);
}
`;function c(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r);throw e.deleteShader(r),Error(`totemBackdrop compile failed: `+t)}return r}function l(e){let t=e.getContext(`webgl`,{alpha:!1,antialias:!1});if(!t)throw Error(`WebGL not available`);let n=t.createProgram(),r=c(t,t.VERTEX_SHADER,o),i=c(t,t.FRAGMENT_SHADER,s);if(t.attachShader(n,r),t.attachShader(n,i),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS))throw Error(`totemBackdrop link failed: `+t.getProgramInfoLog(n));t.useProgram(n);let a=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,a),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW);let l=t.getAttribLocation(n,`aPos`);t.enableVertexAttribArray(l),t.vertexAttribPointer(l,2,t.FLOAT,!1,0,0);let u=t.getUniformLocation(n,`uRes`),d=t.getUniformLocation(n,`uTime`),f=t.getUniformLocation(n,`uMouse`);return{draw(r){t.viewport(0,0,e.width,e.height),t.useProgram(n),t.uniform2f(u,e.width,e.height),t.uniform1f(d,r.time),t.uniform2f(f,r.mouse[0],r.mouse[1]),t.drawArrays(t.TRIANGLE_STRIP,0,4)},dispose(){t.deleteProgram(n),t.deleteShader(r),t.deleteShader(i),t.deleteBuffer(a)}}}var u=n();function d({active:e=!0,className:t,style:n}){let o=(0,a.useRef)(null),s=(0,a.useRef)(e);return(0,a.useEffect)(()=>{s.current=e},[e]),(0,a.useEffect)(()=>{let e=o.current,t;try{t=l(e)}catch{return}let n=0,a=!0,c=0,u=performance.now()/1e3,d={x:.5,y:.5},f={x:.5,y:.5},p=e=>{d.x=e.clientX/window.innerWidth,d.y=e.clientY/window.innerHeight};window.addEventListener(`mousemove`,p);let m=()=>{let t=i(1.5,1);e.width=Math.floor(e.clientWidth*t),e.height=Math.floor(e.clientHeight*t)};m();let h=r(m),g=()=>{if(!a)return;let e=performance.now()/1e3,r=Math.min(.05,e-u);u=e,s.current&&(c+=r,f.x+=(d.x-f.x)*Math.min(1,r*3),f.y+=(d.y-f.y)*Math.min(1,r*3),t.draw({time:c,mouse:[f.x,f.y]})),n=requestAnimationFrame(g)};return n=requestAnimationFrame(g),()=>{a=!1,cancelAnimationFrame(n),window.removeEventListener(`mousemove`,p),h(),t.dispose()}},[]),(0,u.jsx)(`canvas`,{ref:o,className:t,style:n,"aria-hidden":!0})}var f=[{slug:`knight`,name:`Knight`,characterName:`Vaelorn`,classRole:`Oathbound Knight`,epithet:`Vaelorn`,description:`A brave heart, a tiny sword, and a little courage for every new adventure.`,model:`sprite`,rotY:0},{slug:`ranger`,name:`Ranger`,characterName:`Thyren`,classRole:`Briar Ranger`,epithet:`Thyren`,description:`A steady bow and a curious spirit. Every little detail is worth discovering.`,model:`sprite`,rotY:0},{slug:`bard`,name:`Bard`,characterName:`Orvynn`,classRole:`Requiem Bard`,epithet:`Orvynn`,description:`A warm smile and a pocket full of songs. Every match deserves an encore.`,model:`sprite`,rotY:0},{slug:`paladin`,name:`Paladin`,characterName:`Sevran`,classRole:`Dawnward Paladin`,epithet:`Sevran`,description:`A kind heart behind a shining shield. Small hero, legendary bravery.`,model:`sprite`,rotY:0},{slug:`mage`,name:`Mage`,characterName:`Lyriath`,classRole:`Moonveil Arcanist`,epithet:`Lyriath`,description:`An enormous hat and a little sparkle. There is magic in every perfect pair.`,model:`sprite`,rotY:0},{slug:`rogue`,name:`Rogue`,characterName:`Nyravel`,classRole:`Veilborne Rogue`,epithet:`Nyravel`,description:`Quick hands and quicker thinking. One golden key, a thousand tiny adventures.`,model:`sprite`,rotY:0}].filter(e=>e.model);export{d as n,f as t};