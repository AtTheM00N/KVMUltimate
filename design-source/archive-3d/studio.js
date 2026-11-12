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
  const animatedCopy = new Set();
  let visible = true, inView = true, dirty = true, previousTime = 0, slowFrames = 0;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'default' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // Furniture is static: cache its shadow pass while the camera travels.
  renderer.shadowMap.autoUpdate = false;
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
      object.shadow?.dispose();
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
    for (const element of animatedCopy) gsap.set(element, { clearProps: 'opacity,visibility,transform' });
    animatedCopy.clear();
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
    const chapter=event.target.closest('[data-chapter]');
    if(!chapter)return;
    const project=event.target.closest('[data-project-beat]');
    const service=event.target.closest('[data-service-beat]');
    // Keyboard focus follows the matching camera beat, including hidden later copy.
    const lead=event.target.closest('.story-project,.service-words,.chapter-enquiry,.chapter-lead,.hero-actions');
    if(lead && Number(getComputedStyle(lead).opacity)<.95){
      const offset=project ? Number(project.dataset.projectBeat)*chapter.offsetHeight*.43+innerHeight*.65 : innerHeight*.25;
      window.scrollTo({top:(service||chapter).getBoundingClientRect().top+scrollY+offset,behavior:'instant'});
    }
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
    add(0, 'intro'); add(innerHeight * .22, 'intro');
    const work = find('work');
    if (work) { add(absolute(work), 'work'); if(work.querySelectorAll('[data-project-beat]').length>1)add(absolute(work) + work.offsetHeight * .58, 'work', 0, .8); }
    root.querySelectorAll('[data-service-beat]').forEach(el => add(absolute(el), el.dataset.serviceBeat, 0));
    for (const [id, framing] of [['process', 0], ['studio', 0], ['contact', -.20]]) {
      const el = find(id); if (el) add(absolute(el), id, framing);
    }
    add(distance, 'contact', -.20);
    knots.sort((a, b) => a.at - b.at);
    choreograph(); queue();
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
      const lead = body.querySelector('.chapter-lead');
      const enquiry = body.querySelector('.chapter-enquiry');
      body.classList.toggle('is-tall', (lead?.scrollHeight || 0) > height * .72 || (enquiry?.scrollHeight || 0) > height * .76);
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
    // Hermite interpolation keeps velocity continuous across connected camera shots.
    const prev = knots[Math.max(0, i - 1)], next = knots[Math.min(knots.length - 1, i + 2)];
    const interpolate = (out, key) => {
      const u = progress, u2 = u*u, u3 = u2*u, span = b.at-a.at;
      const m0 = b[key].clone().sub(prev[key]).multiplyScalar(.7 * span / Math.max(1,b.at-prev.at));
      const m1 = next[key].clone().sub(a[key]).multiplyScalar(.7 * span / Math.max(1,next.at-a.at));
      out.copy(a[key]).multiplyScalar(2*u3-3*u2+1).addScaledVector(m0,u3-2*u2+u).addScaledVector(b[key],-2*u3+3*u2).addScaledVector(m1,u3-u2);
    };
    interpolate(position,'position'); interpolate(target,'target');
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
  function choreograph() {
    if(!trigger)return;
    const progress=trigger.progress();
    trigger.clear();
    for(const element of animatedCopy)gsap.set(element,{clearProps:'opacity,visibility,transform'});
    animatedCopy.clear();
    trigger.fromTo(playhead, { value: 0 }, { value: 1, duration: 1, ease: 'none' }, 0);
    const scrollPosition = element => {
      const top = element.getBoundingClientRect().top + scrollY - root.getBoundingClientRect().top - scrollY;
      return THREE.MathUtils.clamp(top / distance, 0, 1);
    };
    const reveal = (element, start, span = .06, scale = .97) => {
      if (!element) return;
      const at = THREE.MathUtils.clamp(start, 0, .94);
      const duration = THREE.MathUtils.clamp(span, .012, 1 - at);
      animatedCopy.add(element);
      trigger.fromTo(element, { opacity: 0, y: 24, scale }, { opacity: 1, y: 0, scale: 1, duration, ease: 'none' }, at);
    };
    for (const chapter of root.querySelectorAll('[data-chapter]')) {
      const top = scrollPosition(chapter);
      const span = chapter.offsetHeight / distance;
      const lead = chapter.querySelector('.chapter-lead:not(.screen-reader-text)');
      if (chapter.dataset.chapter === 'intro') {
        if (lead) { animatedCopy.add(lead); trigger.to(lead,{opacity:0,y:-80,scale:1.08,duration:.07,ease:'none'},.012); }
        const actions=chapter.querySelector('.hero-actions');
        if(actions){animatedCopy.add(actions);trigger.to(actions,{opacity:0,duration:.035},.035);}
      } else if (lead) {
        reveal(lead, Math.max(0,top-.045), .045, 1);
        if(chapter.dataset.chapter !== 'contact')trigger.to(lead,{opacity:0,y:-40,duration:.035,ease:'none'},Math.min(.94,top+span-.075));
      }
      chapter.querySelectorAll('.story-project').forEach((project,index)=>{
        const at=top+.02+index*span*.43;
        reveal(project,at,.045,1);
        trigger.to(project,{opacity:0,y:-25,duration:.025,ease:'none'},at+span*.36);
      });
      chapter.querySelectorAll('[data-service-beat]').forEach(article=>{
        const words=article.querySelector('.service-words'); const at=scrollPosition(article);
        reveal(words,at-.035,.045,1);
        trigger.to(words,{opacity:0,y:-35,duration:.025,ease:'none'},at+innerHeight/distance-.055);
      });
      chapter.querySelectorAll('.story-process span').forEach((step,index)=>{reveal(step,top-.03+index*.024,.045,1);trigger.to(step,{opacity:0,y:-30,duration:.035,ease:'none'},top+span-.055);});
      const enquiry=chapter.querySelector('.chapter-enquiry');
      if(enquiry)reveal(enquiry,top-.035,.045,1);
    }
    trigger.progress(progress, true);
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
    const movingCover = new Set();
    hinge?.traverse(object => movingCover.add(object));
    const anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    model.traverse(object => {
      if (!object.isMesh) return;
      object.castShadow = !movingCover.has(object);
      object.receiveShadow = true;
      for (const material of (Array.isArray(object.material) ? object.material : [object.material])) {
        if (material.map) material.map.anisotropy = anisotropy;
      }
    });
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    environment = pmrem.fromScene(room, .04); scene.environment = environment.texture;
    scene.environmentIntensity = .38; room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xdce5f5, 0x17171c, .5));
    const key = new THREE.DirectionalLight(0xe9edf5, 3.4); key.position.set(-6, 11, 5);
    key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: .5, far: 45 });
    key.shadow.camera.updateProjectionMatrix(); key.shadow.normalBias = .008; key.shadow.bias = -.0001;
    scene.add(key); renderer.shadowMap.needsUpdate = true;
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
    // A single normalized GSAP timeline maps the native page scroll to the camera,
    // portfolio hinge, chapter copy, project cards and service beats.
    trigger = gsap.timeline({ onUpdate: queue,
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: .5, invalidateOnRefresh: true }
    });
    choreograph();
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
    ScrollTrigger.refresh();
    const destination=location.hash && document.getElementById(location.hash.slice(1));
    if(destination && root.contains(destination)) destination.scrollIntoView({behavior:'instant',block:'start'});
    queue();
  }
  timeout = setTimeout(() => { fallback(); cleanup(); }, 15000);
  initialise().catch(error => {
    if (disposed) return;
    fallback(); cleanup();
    console.warn('Konnect studio: static presentation is active.', error.message);
  });
  return cleanup;
}
