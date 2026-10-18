// Exercise the real app event handlers; this is a DOM stub, not browser certification.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('./core.js');
function harness(){
 const els=new Map();
 const el=id=>{if(!els.has(id))els.set(id,{value:'',checked:false,hidden:false,textContent:'',listeners:{},children:[],addEventListener(k,f){this.listeners[k]=f},replaceChildren(){this.children=[]},append(...x){this.children.push(...x)},focus(){}});return els.get(id)};
 el('replace-confirm').hidden=true;
 el('example-data').textContent=fs.readFileSync(__dirname+'/example.json','utf8');
 const document={getElementById:el,createElement:()=>({textContent:''})};
 vm.runInNewContext(fs.readFileSync(__dirname+'/app.js','utf8'),{NoteCore:C,document,window:{},setTimeout});
 return {el,get prompts(){return el('replace-confirm').hidden?[]:[el('replace-message').textContent]},accept(){el('confirm-replace').listeners.click()},cancel(){el('cancel-replace').listeners.click()},snapshot(){return JSON.stringify([...Object.keys(C.fields)].map(k=>el(k).value).concat(el('fictional').checked))},demo(){return el('demo').listeners.click()},async load(text){const target={files:[{size:100,text:async()=>text}],value:'selected'};await el('import').listeners.change({target});assert.equal(target.value,'');}};
}
(async()=>{
 let h=harness();h.demo();assert.equal(h.prompts.length,0);assert.equal(h.el('fictional').checked,true);
 h=harness();h.el('claim').value='Keep my actual draft';const original=h.snapshot();h.demo();assert.equal(h.snapshot(),original);assert.equal(h.prompts.length,1);h.cancel();assert.match(h.el('message').textContent,/cancelled/);assert.equal(h.snapshot(),original);
 h.demo();h.accept();assert.equal(h.el('fictional').checked,true);assert.notEqual(h.snapshot(),original);
 h=harness();h.el('claim').value='Keep draft';const saved=h.snapshot();const incoming=C.empty();incoming.claim='Imported note';
 await h.load(JSON.stringify(incoming));assert.equal(h.snapshot(),saved);assert.equal(h.prompts.length,1);
 h.accept();assert.equal(h.el('claim').value,'Imported note');
 h=harness();await h.load(JSON.stringify(incoming));assert.equal(h.prompts.length,0);assert.equal(h.el('claim').value,'Imported note');
 h=harness();h.el('claim').value='Keep invalid import';const kept=h.snapshot();await h.load('{broken');assert.equal(h.snapshot(),kept);assert.equal(h.prompts.length,0);
 // A draft typed while file reading is pending must be protected too.
 h=harness();let resolve;const pending=new Promise(r=>resolve=r),target={files:[{size:100,text:()=>pending}],value:'selected'};
 const load=h.el('import').listeners.change({target});h.el('claim').value='Typed during file read';resolve(JSON.stringify(incoming));await load;assert.equal(h.el('claim').value,'Typed during file read');assert.equal(h.prompts.length,1);
 h=harness();h.el('relation').value='supports';h.demo();assert.equal(h.el('relation').value,'supports');assert.equal(h.prompts.length,1);
 h=harness();h.el('fictional').checked=true;h.demo();assert.equal(h.prompts.length,1);
 console.log('PASS: 10 replacement scenarios (empty/example/import/cancel/accept/invalid/async edit/relationship/fictional flag).');
})().catch(e=>{console.error(e);process.exitCode=1});
