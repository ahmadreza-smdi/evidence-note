/* Pure note formatting. No network, storage, scoring or automatic fact checking. */
const NoteCore = (() => {
  const fields = {
    decision:'Decision this informs', claim:'Claim to examine', reference:'Property or record reference',
    scope:'Geography, population or scope', measure:'Measure and unit', sourceTitle:'Source title',
    sourceUrl:'Source URL', publisher:'Source publisher', observed:'Observation date',
    published:'Publication date', accessed:'Access date', relation:'Relationship to the claim',
    excerpt:'Relevant source excerpt or observation', limits:'Missing evidence and limits',
    nextCheck:'Next check and responsible role'
  };
  const relations=['not_checked','supports','contradicts','partly_supports','unclear'];
  const relationNames={not_checked:'Not checked',supports:'Author-recorded: supports',contradicts:'Author-recorded: contradicts',partly_supports:'Author-recorded: partly supports',unclear:'Author-recorded: unclear'};
  const empty=()=>({schema:'ahmadreza-samadi/evidence-note',version:1,fictional:false,...Object.fromEntries(Object.keys(fields).map(k=>[k,k==='relation'?'not_checked':'']))});
  const isDate=s=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
    const d=new Date(s+'T00:00:00Z');return !Number.isNaN(d.valueOf())&&d.toISOString().slice(0,10)===s;
  };
  const safeUrl=s=>{try{const u=new URL(s);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}};
  function normalize(input){
    if(!input||Array.isArray(input)||typeof input!=='object'||input.schema!=='ahmadreza-samadi/evidence-note'||input.version!==1)throw Error('This is not an Evidence Note version 1 file.');
    if(typeof input.fictional!=='boolean')throw Error('The fictional-example field must be true or false.');
    const n=empty();n.fictional=input.fictional;
    for(const k of Object.keys(fields)){
      if(typeof input[k]!=='string'||input[k].length>6000)throw Error('Invalid or oversized field: '+fields[k]);
      n[k]=input[k];
    }
    if(!relations.includes(n.relation))throw Error('Unrecognised source relationship.');
    return n;
  }
  function flags(n){
    const out=[];
    for(const k of Object.keys(fields).filter(k=>k!=='relation'))if(!n[k].trim())out.push(fields[k]+' is not recorded.');
    if(n.sourceUrl.trim()&&!safeUrl(n.sourceUrl.trim()))out.push('Source URL must use http or https; no link will be created.');
    for(const k of ['observed','published','accessed'])if(n[k]&&!isDate(n[k]))out.push(fields[k]+' is not a valid YYYY-MM-DD calendar date.');
    if(n.relation==='not_checked')out.push('The source relationship has not been checked.');
    if(isDate(n.observed)&&isDate(n.accessed)&&n.observed>n.accessed)out.push('Observation date is later than access date; explain whether this is a forecast or a date error.');
    return out;
  }
  const value=(n,k)=>k==='relation'?relationNames[n[k]]:n[k].trim()||'Not recorded';
  const intro='A source note recorded by the user. It does not independently verify the claim, source, property identity or decision.';
  function markdown(n){
    const lines=['# Evidence note','',n.fictional?'FICTIONAL TEACHING EXAMPLE — not a real property or source.':'User-entered note — not independently verified.','',intro,''];
    for(const k of Object.keys(fields))lines.push('## '+fields[k],'',...value(n,k).split('\n').map(line=>'    '+line),'');
    lines.push('## Unresolved recording checks','',...(flags(n).length?flags(n).map(s=>'- '+s):['No missing recording fields were detected. This is not a truth, adequacy or readiness check.']),'','Template: Ahmadreza Samadi · AI for property decisions · https://a-samadi.com/about.html','All dates above are user-recorded source dates, not a verified chronology.');
    return lines.join('\n')+'\n';
  }
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function html(n){
    const rows=Object.keys(fields).map(k=>'<dt>'+escape(fields[k])+'</dt><dd>'+escape(value(n,k)).replace(/\n/g,'<br>')+'</dd>').join('');
    return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Evidence note | Ahmadreza Samadi</title><style>body{font:16px/1.6 system-ui,sans-serif;color:#0E2A33;background:#F2F7F5;max-width:760px;margin:40px auto;padding:24px;overflow-wrap:anywhere}h1{line-height:1.2}dt{font-weight:650;margin-top:20px}dd{margin:4px 0}.notice{padding:16px;border:1px solid #0B6A7A;border-radius:12px}footer{margin-top:32px;font-size:13px}@media print{body{background:white;margin:0;max-width:none}dt{break-after:avoid}dd{break-inside:avoid}}</style><header><p>Ahmadreza Samadi · Start with the Decision</p><h1>Evidence note</h1></header><p class="notice">'+(n.fictional?'FICTIONAL TEACHING EXAMPLE — not a real property or source.':'User-entered note — not independently verified.')+'</p><p>'+intro+'</p><dl>'+rows+'</dl><h2>Unresolved recording checks</h2><ul>'+flags(n).map(s=>'<li>'+escape(s)+'</li>').join('')+'</ul>'+(!flags(n).length?'<p>No missing recording fields detected. This is not a truth, adequacy or readiness check.</p>':'')+'<footer>Template by Ahmadreza Samadi · AI for property decisions · a-samadi.com<br>Dates and relationships are user-recorded; no independent verification is implied.</footer></html>';
  }
  return {fields,relations,relationNames,empty,isDate,safeUrl,normalize,flags,value,markdown,html};
})();
if(typeof module!=='undefined')module.exports=NoteCore;
