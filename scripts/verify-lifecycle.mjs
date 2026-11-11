// Unit checks of the real scene module's asynchronous lifecycle, without a browser or GPU.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile('src/studio.js', 'utf8');
const report = [];
const pass = message => { report.push(`PASS ${message}`); console.log(report.at(-1)); };
const flush = () => new Promise(resolve => setImmediate(resolve));

async function fixture({ decoding = false } = {}) {
  const timers = new Map(), requests = [], parsed = [];
  let rendererDisposals = 0, decoderDisposals = 0, nextTimer = 0;
  class Renderer { setPixelRatio() {} dispose() { rendererDisposals++; } }
  class Scene {
    constructor() { this.children = []; }
    add(child) { this.children.push(child); }
    traverse(fn) { this.children.forEach(child => child.traverse(fn)); }
  }
  class Loader {
    setKTX2Loader() { return this; }
    setMeshoptDecoder() { return this; }
    parseAsync() { return new Promise(resolve => parsed.push(resolve)); }
  }
  class Decoder {
    setTranscoderPath() { return this; }
    detectSupport() { return this; }
    dispose() { decoderDisposals++; }
  }
  const noOp = () => {};
  const context = vm.createContext({
    console, AbortController, devicePixelRatio: 2, scrollY: 0,
    setTimeout(fn) { const id = ++nextTimer; timers.set(id, fn); return id; },
    clearTimeout: id => timers.delete(id), cancelAnimationFrame: noOp,
    window: { removeEventListener: noOp }, document: { removeEventListener: noOp },
    fetch(url, { signal }) {
      requests.push({ url, signal });
      if (decoding) return Promise.resolve({ ok: true, json: async () => [], arrayBuffer: async () => new ArrayBuffer(0) });
      return new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true }));
    }
  });
  const module = new vm.SourceTextModule(source, { context });
  const libraries = {
    three: { WebGLRenderer: Renderer, Scene, Color: class {}, PerspectiveCamera: class {}, Vector2: class {}, Vector3: class {} },
    'three/addons/loaders/GLTFLoader.js': { GLTFLoader: Loader },
    'three/addons/loaders/KTX2Loader.js': { KTX2Loader: Decoder },
    'three/addons/libs/meshopt_decoder.module.js': { MeshoptDecoder: {} },
    'three/addons/environments/RoomEnvironment.js': { RoomEnvironment: class {} }
  };
  await module.link(name => {
    const exports = libraries[name];
    assert.ok(exports, `Unexpected dependency ${name}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  const classes = new Set();
  const root = {
    dataset: { assets: '/test-assets/' },
    classList: { add: (...names) => names.forEach(name => classes.add(name)), remove: (...names) => names.forEach(name => classes.delete(name)) },
    querySelector: () => ({ removeEventListener: noOp }), querySelectorAll: () => [], removeEventListener: noOp
  };
  let current = true;
  const dispose = module.namespace.mountStudio(root, {}, { removeEventListener: noOp }, () => current);
  return { root, classes, dispose, timers, requests, parsed, retire: () => { current = false; },
    disposed: () => ({ renderer: rendererDisposals, decoder: decoderDisposals }) };
}

const pending = await fixture();
assert.equal(typeof pending.dispose, 'function');
assert.equal(pending.requests.length, 2);
pending.retire(); pending.dispose(); pending.dispose();
await flush();
assert.ok(pending.requests.every(request => request.signal.aborted));
assert.deepEqual(pending.disposed(), { renderer: 1, decoder: 0 });
assert.equal(pending.timers.size, 0);
assert.equal(pending.root.dataset.sceneState, undefined);
pass('Resize can dispose an in-flight mount immediately; fetches abort and cleanup is idempotent');

const slow = await fixture();
[...slow.timers.values()][0]();
await flush();
assert.equal(slow.root.dataset.sceneState, 'fallback');
assert.ok(slow.classes.has('is-static'));
assert.ok(slow.requests.every(request => request.signal.aborted));
assert.equal(slow.disposed().renderer, 1);
pass('Whole-initialisation timeout restores static content and releases the renderer');

const decoding = await fixture({ decoding: true });
await flush();
assert.equal(decoding.parsed.length, 1);
decoding.retire(); decoding.dispose();
decoding.classes.add('is-immersive'); // Represents a replacement mount using the same root.
let geometryDisposed = 0, materialDisposed = 0;
decoding.parsed[0]({ scene: { traverse: fn => fn({
  geometry: { dispose() { geometryDisposed++; } },
  material: { dispose() { materialDisposed++; } }
}) } });
await flush();
assert.equal(geometryDisposed, 1); assert.equal(materialDisposed, 1);
assert.deepEqual(decoding.disposed(), { renderer: 1, decoder: 1 });
assert.ok(decoding.classes.has('is-immersive'));
pass('Late decoded geometry is released without changing a replacement scene');

await writeFile('artifacts/lifecycle-verification.txt', report.join('\n') + '\n');
