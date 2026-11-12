var e=`
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,t=`
precision highp float;

uniform vec2 uRes;
uniform vec2 uOrigin;
uniform float uProgress;
uniform float uNoiseAmp;
uniform float uNoiseScale;
uniform float uEdge;
uniform float uTime;
uniform vec3 uBright;
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uBackdrop;

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
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += valueNoise(p) * amp;
    p = p * 2.02 + 11.3;
    amp *= 0.5;
  }
  return v / 0.969;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  // Flip y so the origin is top-left, matching iOS / the pointer coords.
  vec2 uv = vec2(frag.x / uRes.x, 1.0 - frag.y / uRes.y);

  float aspect = uRes.x / uRes.y;
  vec2 delta = uv - uOrigin;
  delta.x *= aspect;
  float dist = length(delta);

  // Normalize distance: 0 at origin -> 1 at the farthest corner.
  float md = 0.0;
  vec2 d0 = vec2(0.0, 0.0) - uOrigin; d0.x *= aspect; md = max(md, length(d0));
  vec2 d1 = vec2(1.0, 0.0) - uOrigin; d1.x *= aspect; md = max(md, length(d1));
  vec2 d2 = vec2(0.0, 1.0) - uOrigin; d2.x *= aspect; md = max(md, length(d2));
  vec2 d3 = vec2(1.0, 1.0) - uOrigin; d3.x *= aspect; md = max(md, length(d3));
  float d = dist / max(md, 0.001);

  // Domain warp: shove the sample point by a flowing noise field.
  vec2 wq = uv * 2.2;
  vec2 warp = vec2(fbm(wq + uTime * 0.24), fbm(wq + 31.7 - uTime * 0.2)) - 0.5;
  vec2 suv = uv + warp * 0.4;

  // Animated 2D fractal field.
  float scl = uNoiseScale * 0.5;
  float nz = fbm(suv * scl + uTime * 0.14);
  nz = nz * 0.6 + fbm(suv * scl * 2.3 - uTime * 0.09) * 0.4;

  // Ridged layer -> thin reaching fingers.
  float ridged = 1.0 - abs(nz * 2.0 - 1.0);
  // Big low-frequency lobes warp the whole outline, so it reads as a random
  // blob rather than a circle.
  float lobe = fbm(suv * (scl * 0.3) + 7.0 + uTime * 0.06);
  float fieldNoise = (nz - 0.5) * 1.4 + (ridged - 0.5) * 0.6 + (lobe - 0.5) * 1.9;

  float reach = uProgress * 1.35 - 0.05;
  // Keep the boundary wild mid-spread, then let the distortion vanish so the
  // screen fills to clean, hole-free pink at the end.
  float settle = 1.0 - smoothstep(0.4, 1.0, uProgress);
  // Concentrate the distortion toward the advancing edge, so the centre stays
  // solid (no holes) while the boundary gets thoroughly deformed.
  float edge = clamp(d * 1.8, 0.0, 1.0);
  float coverage = (reach - d) + fieldNoise * uNoiseAmp * max(reach, 0.0) * settle * edge;

  float aa = max(uEdge, 0.004);
  float alpha = smoothstep(-aa, aa, coverage);

  // Faint uneven pooling inside the blot.
  float inside = step(0.0, coverage);
  float mottle = fbm(uv * 7.0 + 3.0) * 0.08 * inside;

  // Radial gradient color (bright center -> base -> deep edge), in pixels.
  float pixelDist = length((uv - uOrigin) * uRes);
  float gradT = clamp(pixelDist / (max(uRes.x, uRes.y) * 0.6), 0.0, 1.0);
  vec3 col = gradT < 0.5
    ? mix(uBright, uBase, gradT * 2.0)
    : mix(uBase, uDeep, (gradT - 0.5) * 2.0);
  col *= (1.0 - mottle);

#ifdef TRANSPARENT
  // Premultiplied output: outside the ink (alpha→0) the colour goes to black too,
  // so it composites to truly transparent. Straight alpha (col, alpha) leaves the
  // pink colour in "transparent" pixels, which iOS/WebKit paints as solid pink.
  gl_FragColor = vec4(col * alpha, alpha); // transparent outside the ink
#else
  gl_FragColor = vec4(mix(uBackdrop, col, alpha), 1.0);
#endif
}
`;function n(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r);throw e.deleteShader(r),Error(`warpFill shader compile failed: `+t)}return r}function r(r,i={}){let a=r.getContext(`webgl`,{alpha:!!i.transparent,antialias:!1,premultipliedAlpha:!0});if(!a)throw Error(`WebGL not available`);let o=a.createProgram(),s=n(a,a.VERTEX_SHADER,e),c=n(a,a.FRAGMENT_SHADER,(i.transparent?`#define TRANSPARENT
`:``)+t);if(a.attachShader(o,s),a.attachShader(o,c),a.linkProgram(o),!a.getProgramParameter(o,a.LINK_STATUS))throw Error(`warpFill link failed: `+a.getProgramInfoLog(o));a.useProgram(o);let l=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,l),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),a.STATIC_DRAW);let u=a.getAttribLocation(o,`aPos`);a.enableVertexAttribArray(u),a.vertexAttribPointer(u,2,a.FLOAT,!1,0,0);let d=e=>a.getUniformLocation(o,e),f=d(`uRes`),p=d(`uOrigin`),m=d(`uProgress`),h=d(`uNoiseAmp`),g=d(`uNoiseScale`),_=d(`uEdge`),v=d(`uTime`),y=d(`uBright`),b=d(`uBase`),x=d(`uDeep`),S=d(`uBackdrop`);return{draw(e){a.viewport(0,0,r.width,r.height),a.useProgram(o),a.uniform2f(f,r.width,r.height),a.uniform2f(p,e.origin[0],e.origin[1]),a.uniform1f(m,e.progress),a.uniform1f(h,e.noiseAmp),a.uniform1f(g,e.noiseScale),a.uniform1f(_,e.edge),a.uniform1f(v,e.time),a.uniform3fv(y,e.bright),a.uniform3fv(b,e.base),a.uniform3fv(x,e.deep),a.uniform3fv(S,e.backdrop),a.drawArrays(a.TRIANGLE_STRIP,0,4)},dispose(){a.deleteProgram(o),a.deleteShader(s),a.deleteShader(c),a.deleteBuffer(l)}}}function i(e){let[t,n,r]=e;return{bright:[Math.min(t+.02,1),Math.min(n+.1,1),Math.min(r+.02,1)],base:e,deep:[t*.6,n*.34,Math.min(r*.95+.05,1)]}}function a(e){let t=parseInt(e.replace(`#`,``),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}export{i as n,a as r,r as t};