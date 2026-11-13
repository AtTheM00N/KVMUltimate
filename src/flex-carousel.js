import { Renderer, Program, Mesh, Triangle, Plane, Texture, RenderTarget } from 'ogl';
import { cardVertex, cardFragment, lensVertex, lensFragment } from './flex-carousel-shaders.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const uniforms = values => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, { value }]));

// The supplied Flex Carousel draws cards to a texture and bends that texture
// around a lens. Here the page scroll supplies the fractional card index.
export function createFlexCarousel(stage, images) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
  if (!gl) throw new Error('Flex Carousel needs WebGL 2');

  const renderer = new Renderer({ canvas, alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
  gl.clearColor(0, 0, 0, 0);
  const cards = images.map((image, index) => ({
    texture: new Texture(gl, { image, minFilter: gl.LINEAR_MIPMAP_LINEAR }),
    size: [image.naturalWidth, image.naturalHeight],
    color: index % 2 ? [0, 0, 0] : [143 / 255, 0, 0],
  }));
  const card = uniforms({
    tMap: cards[0].texture, uRect: [0, 0, 1, 1], uResolution: [1, 1],
    uSize: [1, 1], uImage: [1, 1], uRadius: 1, uAlpha: 1, uReady: 1, uShift: 0,
    uDpr: 1, uPlaceholder: [0, 0, 0],
  });
  const target = new RenderTarget(gl, {
    width: 2, height: 2, depth: false, minFilter: gl.LINEAR_MIPMAP_LINEAR, magFilter: gl.LINEAR,
  });
  const lens = uniforms({
    tScene: target.texture, uResolution: [1, 1], uDpr: 1, uCenter: [0, 0],
    uHalf: [1, 1], uAngle: 0, uExponent: 2, uInner: 60, uOuter: 80,
    uFlow: 0, uCurl: 1, uDispersion: 0.018, uStrength: 1, uSceneAlpha: 1,
  });
  const cardProgram = new Program(gl, {
    vertex: cardVertex, fragment: cardFragment, uniforms: card, transparent: true, depthTest: false, depthWrite: false,
  });
  cardProgram.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const lensProgram = new Program(gl, {
    vertex: lensVertex, fragment: lensFragment, uniforms: lens, depthTest: false, depthWrite: false,
  });
  if (![cardProgram, lensProgram].every(p => gl.getProgramParameter(p.program, gl.LINK_STATUS))) {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    throw new Error('Flex Carousel shaders failed to link');
  }
  const cardMesh = new Mesh(gl, { geometry: new Plane(gl), program: cardProgram });
  const lensMesh = new Mesh(gl, { geometry: new Triangle(gl), program: lensProgram });
  stage.append(canvas);

  let width = 0;
  let height = 0;
  let position = 0;
  let frame = 0;
  let disposed = false;

  function render() {
    frame = 0;
    if (disposed || gl.isContextLost()) return;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    if (w !== width || h !== height) {
      width = w;
      height = h;
      renderer.dpr = Math.min(devicePixelRatio || 1, 1.75, Math.sqrt(4.5e6 / (width * height)));
      renderer.setSize(width, height);
      target.setSize(Math.max(2, Math.floor(width * renderer.dpr)), Math.max(2, Math.floor(height * renderer.dpr)));
    }

    const cardSize = Math.min(height * .72, width * .53);
    const pitch = cardSize + clamp(width * .015, 10, 22);
    // Keep the original squeeze during travel, easing back at each card.
    const size = cardSize * (1 - .12 * Math.sin(Math.PI * (position % 1)));
    const center = width / 2;
    const y = height * .47;
    card.uResolution.value = lens.uResolution.value = [width, height];
    card.uDpr.value = lens.uDpr.value = renderer.dpr;
    card.uSize.value = [size, size];
    let first = true;
    for (let i = 0; i < cards.length; i++) {
      const rel = (i - position) * pitch;
      if (Math.abs(rel) > center + size / 2 + 8) continue;
      card.tMap.value = cards[i].texture;
      card.uImage.value = cards[i].size;
      card.uPlaceholder.value = cards[i].color;
      card.uRect.value = [center + rel, y, size + 2, size + 2];
      card.uShift.value = clamp(rel / width, -1, 1);
      renderer.render({ scene: cardMesh, target, clear: first, frustumCull: false });
      first = false;
    }
    renderer.bindFramebuffer();
    target.texture.bind();
    gl.generateMipmap(gl.TEXTURE_2D);

    // The snippet's arch preset, scaled to the available stage height.
    const spanW = Math.min(width * .40, height * 1.4);
    const spanH = height * .34;
    const reach = Math.max(4, .36 * (spanW + spanH) * .5);
    lens.uCenter.value = [center, y];
    lens.uHalf.value = [spanW, spanH];
    lens.uInner.value = reach;
    lens.uOuter.value = reach * 1.6;
    lens.uFlow.value = Math.min(height * .14, .30 * (spanW + spanH) * .45);
    renderer.render({ scene: lensMesh, frustumCull: false });
  }

  function requestRender() {
    if (!frame && !disposed) frame = requestAnimationFrame(render);
  }
  const resize = new ResizeObserver(requestRender);
  resize.observe(stage);
  return {
    canvas,
    seek(index) {
      position = clamp(index, 0, cards.length - 1);
      requestRender();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
