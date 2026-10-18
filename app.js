(() => {
 'use strict';
 const C=NoteCore,$=id=>document.getElementById(id),form=$('note-form');
 let current=C.empty();
 const controls=Object.keys(C.fields);
 const tell=s=>{$('message').textContent=s;};
 function read(){const n=C.empty();for(const k of controls)n[k]=$(k).value;n.fictional=$('fictional').checked;return n;}
 function render(){
  current=read();$('example-label').hidden=!current.fictional;
  const list=$('flags');list.replaceChildren();const flags=C.flags(current);
  for(const text of flags){const li=document.createElement('li');li.textContent=text;list.append(li);}
  $('check-status').textContent=flags.length?`${flags.length} recording checks to consider`:'No missing recording fields detected';
  $('no-verdict').textContent=flags.length?'These checks describe this note, not the truth of the claim.':'Completeness is not verification. The claim, source and decision still need your review.';
  const dl=$('preview-fields');dl.replaceChildren();
  for(const k of controls){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=C.fields[k];dd.textContent=C.value(current,k);dl.append(dt,dd);}
 }
 function fill(n){for(const k of controls)$(k).value=n[k];$('fictional').checked=n.fictional;render();}
 function download(name,text,type){const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);tell(name+' downloaded. It contains your recorded fields, not a verified conclusion.');}
 form.addEventListener('input',render);form.addEventListener('submit',e=>e.preventDefault());
 $('demo').addEventListener('click',()=>{fill(JSON.parse($('example-data').textContent));tell('Fictional example loaded. Every property, source and date in it is invented.');$('decision').focus();});
 $('clear').addEventListener('click',()=>{$('clear-confirm').hidden=false;$('cancel-clear').focus();});
 $('cancel-clear').addEventListener('click',()=>{$('clear-confirm').hidden=true;$('clear').focus();});
 $('confirm-clear').addEventListener('click',()=>{fill(C.empty());$('clear-confirm').hidden=true;tell('All fields cleared.');$('decision').focus();});
 $('markdown').addEventListener('click',()=>download('evidence-note.md',C.markdown(read()),'text/markdown;charset=utf-8'));
 $('json').addEventListener('click',()=>download('evidence-note.json',JSON.stringify(read(),null,2)+'\n','application/json'));
 $('html').addEventListener('click',()=>download('evidence-note.html',C.html(read()),'text/html;charset=utf-8'));
 $('print').addEventListener('click',()=>window.print());
 $('import').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>1048576)throw Error('Use a note no larger than 1 MB.');const n=C.normalize(JSON.parse(await file.text()));fill(n);tell('Note restored locally. Its source links and content have not been verified.');$('decision').focus();}
  catch(error){tell('Could not import: '+error.message+' Current fields were kept.');}
  finally{e.target.value='';}
 });
 fill(current);
})();
