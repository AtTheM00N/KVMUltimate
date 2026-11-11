import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/** One decorative canvas. The page's content and navigation never depend on it. */
export function mountStudio(root, gsap, ScrollTrigger, isCurrent) {
  const canvas = root.querySelector('canvas');
  const base = root.dataset.assets;
  const controller = new AbortController();
  let timeout;
  let disposed = false, frame = 0, trigger, observer, resizeObserver, model, environment, loader;
  let visible = true, inView = true, dirty = true, previousTime = 0, slowFrames = 0;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'default' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0b0b0d');
  const camera = new THREE.PerspectiveCamera(27, 1, .1, 100);
  const pointer = new THREE.Vector2(), currentPointer = new THREE.Vector2();
  const position = new THREE.Vector3(), target = new THREE.Vector3();
  const playhead = { value: 0 };
  let knots = [], distance = 1, hinge, width = 1, height = 1;
  const disposables = new Set();
  const fallback = () => {
    if (!isCurrent()) return;
    const anchor = [...root.querySelectorAll('[data-chapter]')].find(el => el.getBoundingClientRect().bottom > 100);
    const before = anchor?.getBoundingClientRect().top;
    root.classList.remove('is-immersive', 'is-painted', 'is-in-view');
    root.classList.add('is-static'); root.dataset.sceneState = 'fallback';
    if (anchor && scrollY > 0) window.scrollBy(0, anchor.getBoundingClientRect().top - before);
  };
  function disposeGraph(graph) {
    graph.traverse(object => {
      if (object.geometry) disposables.add(object.geometry);
      for (const material of (Array.isArray(object.material) ? object.material : [object.material]).filter(Boolean)) {
        for (const value of Object.values(material)) if (value?.isTexture) disposables.add(value);
        disposables.add(material);
      }
    });
    for (const resource of disposables) { resource.dispose(); resource.image?.close?.(); }
    disposables.clear();
  }
  function cleanup() {
    if (disposed) return;
    disposed = true; clearTimeout(timeout); controller.abort(); cancelAnimationFrame(frame);
    trigger?.scrollTrigger?.kill(); trigger?.kill(); observer?.disconnect(); resizeObserver?.disconnect();
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerout', leave);
    window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility);
    canvas.removeEventListener('webglcontextlost', lost);
    root.removeEventListener('focusin', focusChapter);
    ScrollTrigger.removeEventListener('refreshInit', measure);
    disposeGraph(scene);
    environment?.dispose(); loader?.dispose(); renderer.dispose();
    if (isCurrent()) root.classList.remove('is-immersive', 'is-painted', 'is-in-view');
  }
  function lost(event) { event.preventDefault(); fallback(); cleanup(); }
  function queue() { dirty = true; if (!frame && visible && inView && !disposed) frame = requestAnimationFrame(render); }
  function move(event) {
    pointer.set((event.clientX / innerWidth - .5) * 2, (event.clientY / innerHeight - .5) * 2); queue();
  }
  function leave(event) { if (!event.relatedTarget) { pointer.set(0, 0); queue(); } }
  function visibility() { visible = !document.hidden; previousTime = 0; if (visible) queue(); }
  function focusChapter(event) {
    const chapter = event.target.closest('[data-chapter]');
    if (chapter && event.target.getBoundingClientRect().top < 0) chapter.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  let shots;
  function measure() {
    if (!shots || disposed) return;
    const absolute = el => el.getBoundingClientRect().top + scrollY - (root.getBoundingClientRect().top + scrollY);
    distance = Math.max(1, root.offsetHeight - innerHeight);
    const find = id => root.querySelector(`[data-chapter="${id}"]`);
    const shot = id => shots.find(s => s.id === id);
    const add = (at, id, framing = 0, dx = 0) => {
      const s = shot(id); if (!s) return;
      knots.push({ at: THREE.MathUtils.clamp(at, 0, distance), position: new THREE.Vector3(...s.position).add(new THREE.Vector3(dx, 0, 0)), target: new THREE.Vector3(...s.target), cover: s.cover, framing });
    };
    knots = [];
    add(0, 'intro'); add(innerHeight * .35, 'intro');
    const work = find('work');
    if (work) { add(absolute(work) - innerHeight * .3, 'work', .16); add(absolute(work) + work.offsetHeight * .55, 'work', .14, 1.2); }
    root.querySelectorAll('[data-service-beat]').forEach(el => add(absolute(el) - innerHeight * .25, el.dataset.serviceBeat, .16));
    for (const [id, framing] of [['process', -.12], ['studio', -.16], ['contact', -.17]]) {
      const el = find(id); if (el) add(absolute(el) - innerHeight * .1, id, framing);
    }
    add(distance, 'contact', -.17);
    knots.sort((a, b) => a.at - b.at);
    queue();
  }
  function resize() {
    if (disposed) return;
    width = root.clientWidth; height = innerHeight;
    renderer.setSize(width, height, false); camera.aspect = width / height;
    // Match Blender's 48mm camera with horizontal 36mm sensor for the first frame.
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(36 / (2 * 48 * camera.aspect)));
    camera.updateProjectionMatrix();
    root.querySelectorAll('[data-chapter]:not(.chapter-intro):not(.chapter-services) .chapter-body').forEach(body => {
      body.classList.remove('is-tall');
      body.classList.toggle('is-tall', body.scrollHeight > height * .72);
    });
    measure(); queue();
  }
  function render(time) {
    frame = 0; if (disposed || !inView || !visible || !knots.length) return;
    const elapsed = previousTime ? time - previousTime : 16; previousTime = time;
    if (dirty && elapsed > 36 && elapsed < 250) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 45 && renderer.getPixelRatio() > 1) { renderer.setPixelRatio(1); renderer.setSize(width, height, false); slowFrames = 0; }
    currentPointer.lerp(pointer, .08);
    const at = playhead.value * distance;
    let i = knots.findIndex((point, index) => index < knots.length - 1 && at <= knots[index + 1].at);
    if (i < 0) i = knots.length - 2;
    const a = knots[i], b = knots[i + 1];
    const progress = THREE.MathUtils.clamp((at - a.at) / Math.max(1, b.at - a.at), 0, 1);
    const t = progress * progress * (3 - 2 * progress);
    position.lerpVectors(a.position, b.position, t);
    target.lerpVectors(a.target, b.target, t);
    camera.position.copy(position); camera.position.x += currentPointer.x * .09; camera.position.y -= currentPointer.y * .07;
    camera.lookAt(target);
    const framing = THREE.MathUtils.lerp(a.framing, b.framing, t);
    camera.setViewOffset(width, height, width * framing, 0, width, height);
    if (hinge) hinge.rotation.x = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(a.cover, b.cover, t));
    try { renderer.render(scene, camera); } catch { fallback(); cleanup(); return; }
    if (!root.classList.contains('is-painted')) { root.classList.add('is-painted'); root.dataset.sceneState = 'ready'; }
    dirty = false;
    if (currentPointer.distanceToSquared(pointer) > .00001) queue();
  }
  async function initialise() {
    const [sceneResponse, shotsResponse] = await Promise.all([
      fetch(base + 'studio.glb', { signal: controller.signal }), fetch(base + 'shots.json', { signal: controller.signal })
    ]);
    if (disposed) return;
    if (!sceneResponse.ok || !shotsResponse.ok) throw new Error('Studio assets unavailable');
    const [shotData, sceneData] = await Promise.all([shotsResponse.json(), sceneResponse.arrayBuffer()]);
    if (disposed) return;
    shots = shotData;
    loader = new KTX2Loader().setTranscoderPath(base + '../vendor/basis/').detectSupport(renderer);
    const gltfLoader = new GLTFLoader().setKTX2Loader(loader).setMeshoptDecoder(MeshoptDecoder);
    const gltf = await gltfLoader.parseAsync(sceneData, base);
    if (disposed || !isCurrent()) { disposeGraph(gltf.scene); cleanup(); return; }
    model = gltf.scene; scene.add(model);
    hinge = model.getObjectByName('CoverHinge');
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    environment = pmrem.fromScene(room, .04); scene.environment = environment.texture;
    scene.environmentIntensity = .7; room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xdce5f5, 0x393338, 1.1));
    const key = new THREE.DirectionalLight(0xe9edf5, 3.2); key.position.set(-4, 9, 3); scene.add(key);
    const rim = new THREE.DirectionalLight(0xf0d2cc, 1.6); rim.position.set(5, 7, -5); scene.add(rim);
    let projects = [];
    try { projects = JSON.parse(root.querySelector('[data-projects]')?.dataset.projects || '[]'); } catch {}
    projects.slice(0, 2).forEach((project, index) => {
      if (!project.image) return;
      const surface = model.getObjectByName(`ProjectSurface${index + 1}`);
      if (!surface?.isMesh) return;
      new THREE.TextureLoader().load(project.image, texture => {
        if (disposed) { texture.dispose(); return; }
        texture.flipY = false; texture.colorSpace = THREE.SRGBColorSpace;
        const ratio = texture.image.width / texture.image.height, targetRatio = 2.16 / 2.89;
        if (ratio > targetRatio) { texture.repeat.x = targetRatio / ratio; texture.offset.x = (1 - texture.repeat.x) / 2; }
        else { texture.repeat.y = ratio / targetRatio; texture.offset.y = (1 - texture.repeat.y) / 2; }
        disposables.add(surface.material); surface.material = new THREE.MeshStandardMaterial({ map: texture, roughness: .8 });
        const artwork = model.getObjectByName(`ProjectInk${index + 1}`); if (artwork) artwork.visible = false;
        queue();
      }, undefined, () => { /* The original Konnect spread remains visible. */ });
    });
    root.classList.add('is-immersive'); root.classList.remove('is-static'); resize();
    await renderer.compileAsync(scene, camera);
    if (!isCurrent() || disposed) { cleanup(); return; }
    clearTimeout(timeout);
    trigger = gsap.to(playhead, { value: 1, ease: 'none', onUpdate: queue,
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: .5, invalidateOnRefresh: true }
    });
    ScrollTrigger.addEventListener('refreshInit', measure);
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === root) { inView = entry.isIntersecting; root.classList.toggle('is-in-view', inView); if (inView) queue(); }
        else if (entry.isIntersecting) root.querySelectorAll('[data-chapter-link]').forEach(link => {
          if (link.dataset.chapterLink === entry.target.dataset.chapter) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-20% 0px -45% 0px', threshold: 0 });
    observer.observe(root); root.querySelectorAll('[data-chapter]').forEach(el => observer.observe(el));
    resizeObserver = new ResizeObserver(() => { measure(); ScrollTrigger.refresh(); }); resizeObserver.observe(root);
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerout', leave);
    window.addEventListener('resize', resize); document.addEventListener('visibilitychange', visibility);
    canvas.addEventListener('webglcontextlost', lost); root.addEventListener('focusin', focusChapter);
    ScrollTrigger.refresh(); queue();
  }
  timeout = setTimeout(() => { fallback(); cleanup(); }, 15000);
  initialise().catch(error => {
    if (disposed) return;
    fallback(); cleanup();
    console.warn('Konnect studio: static presentation is active.', error.message);
  });
  return cleanup;
}
