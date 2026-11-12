// Exercise the actual 2D scroll module with DOM/GSAP doubles, without a GPU.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const source=await readFile('src/scroll.js','utf8');
const report=[];
function pass(message){report.push(`PASS ${message}`);console.log(report.at(-1));}
async function fixture(fail=false){
 const frames=new Map(), listeners=new Map(), classes=new Set();
 const state={style:'filter: contrast(1.1)',kills:0,disconnects:0,refreshes:0,tweens:0};
 const image={getAttribute:()=>state.style,setAttribute:(_,value)=>{state.style=value;},removeAttribute:()=>{state.style=null;},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 const poster={getClientRects:()=>[{}],querySelector:()=>image,getBoundingClientRect:()=>({top:900})};
 const root={offsetHeight:6000,getBoundingClientRect:()=>({top:100}),querySelectorAll:selector=>selector==='img'?[image]:[poster],dataset:{},classList:{add:name=>classes.add(name),remove:name=>classes.delete(name)}};
 const timeline={progress(value){return value === undefined ? .4 : this;},clear(){return this;},fromTo(){state.style='transform: matrix(1,0,0,1,0,10)';state.tweens++;return this;},to(){return this;},kill(){state.kills++;}};
 let ready;
 const context=vm.createContext({innerHeight:900,scrollY:0,document:{fonts:{ready:new Promise(resolve=>{ready=resolve;})}},ResizeObserver:class{observe(){if(fail)throw new Error('observer failure');}disconnect(){state.disconnects++;}},requestAnimationFrame:fn=>{frames.set(1,fn);return 1;},cancelAnimationFrame:id=>frames.delete(id)});
 const module=new vm.SourceTextModule(source,{context});await module.link(()=>{});await module.evaluate();
 const ScrollTrigger={create(config){config.onRefreshInit();return {kill(){state.kills++;}};},refresh(){state.refreshes++;}};
 return {state,root,frames,listeners,classes,ready,mount:()=>module.namespace.mountScroll(root,{timeline:()=>timeline},ScrollTrigger)};
}
const mounted=await fixture();
const dispose=mounted.mount();
assert.equal(mounted.root.dataset.sceneState,'ready');
assert.ok(mounted.state.tweens>0);
mounted.listeners.get('load')();assert.equal(mounted.frames.size,1);
dispose();dispose();
assert.equal(mounted.state.style,'filter: contrast(1.1)');
assert.equal(mounted.state.kills,2);assert.equal(mounted.state.disconnects,1);
assert.equal(mounted.frames.size,0);assert.equal(mounted.listeners.size,0);
assert.equal(mounted.classes.size,0);
const refreshes=mounted.state.refreshes;mounted.ready();await Promise.resolve();
assert.equal(mounted.state.refreshes,refreshes);assert.equal(mounted.frames.size,0);
pass('2D cleanup restores author styles, cancels refreshes and removes observers/listeners idempotently');
const failed=await fixture(true);
assert.throws(()=>failed.mount(),/observer failure/);
assert.equal(failed.state.style,'filter: contrast(1.1)');assert.equal(failed.state.kills,2);
assert.equal(failed.root.dataset.sceneState,'static');assert.equal(failed.classes.size,0);
pass('2D setup failure releases partial resources and restores static presentation');

// The real base module must never import animation when a visitor opts out.
const mainSource=await readFile('src/main.js','utf8');
for(const mode of ['reduced-motion','save-data']){
 const classes=new Set();let imports=0;
 const context=vm.createContext({console,navigator:{connection:{saveData:mode==='save-data'}},matchMedia:()=>({matches:mode!=='reduced-motion',addEventListener(){}}),window:{addEventListener(){}},document:{documentElement:{classList:{add(){}}},querySelector:()=>({classList:{add:name=>classes.add(name),remove:name=>classes.delete(name)}}),querySelectorAll:()=>[]}});
 const main=new vm.SourceTextModule(mainSource,{context,importModuleDynamically:()=>{imports++;throw new Error('Unexpected scroll import');}});
 await main.link(name=>name==='gsap'?new vm.SyntheticModule(['default'],function(){this.setExport('default',{registerPlugin(){},matchMedia:()=>({add(){}})});},{context}):new vm.SyntheticModule(['ScrollTrigger'],function(){this.setExport('ScrollTrigger',{});},{context}));
 await main.evaluate();assert.equal(imports,0);assert.ok(classes.has('is-static'));
}
pass('Reduced-motion and Save-Data preferences keep the real base module static');

await mkdir('artifacts',{recursive:true});
await writeFile('artifacts/lifecycle-verification.txt',report.join('\n')+'\n');
