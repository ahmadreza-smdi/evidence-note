"""Build a self-contained offline note editor. No installs or external services."""
from pathlib import Path
import base64,json,html,hashlib,zipfile
P=Path(__file__).resolve().parent
site=P.parents[2]/'a-samadi.com/ahmadreza-smdi.github.io'
for local,source in [('sora-latin-wght.woff2','assets/fonts/sora-latin-wght.woff2'),('LICENSE-Sora.txt','assets/fonts/OFL.txt'),('monogram.svg','assets/brand/ahmadreza-samadi-mark-azure.svg')]:
 if not (P/local).exists():(P/local).write_bytes((site/source).read_bytes())
fields={
 'decision':('Decision this informs','textarea'), 'claim':('Claim to examine','textarea'), 'reference':('Property or record reference','text'), 'scope':('Geography, population or scope','text'), 'measure':('Measure and unit','text'),
 'sourceTitle':('Source title','text'),'sourceUrl':('Source URL','text'),'publisher':('Source publisher','text'),'observed':('Observation date · YYYY-MM-DD','text'),'published':('Publication date · YYYY-MM-DD','text'),'accessed':('Access date · YYYY-MM-DD','text'),'relation':('How does this source relate to the claim?','select'),'excerpt':('Relevant source excerpt or observation','textarea'),
 'limits':('Missing evidence and limits','textarea'),'nextCheck':('Next check and responsible role','textarea')}
def field(k):
 label,kind=fields[k];control=f'<textarea id="{k}" maxlength="6000" rows="3"></textarea>' if kind=='textarea' else (f'<select id="{k}">'+''.join(f'<option value="{v}">{html.escape(n)}</option>' for v,n in [('not_checked','Not checked'),('supports','I recorded: supports'),('contradicts','I recorded: contradicts'),('partly_supports','I recorded: partly supports'),('unclear','I recorded: unclear')])+'</select>' if kind=='select' else f'<input id="{k}" type="text" maxlength="6000" autocomplete="off"'+(' inputmode="url" spellcheck="false"' if k=='sourceUrl' else '')+'>')
 return f'<div class="field"><label for="{k}">{html.escape(label)}</label>{control}</div>'
s=(P/'template.html').read_text();repl={'__FONT__':base64.b64encode((P/'sora-latin-wght.woff2').read_bytes()).decode(),'__MARK__':base64.b64encode((P/'monogram.svg').read_bytes()).decode(),'__LICENCE__':(P/'LICENSE-Sora.txt').read_text(),'__EXAMPLE__':json.dumps(json.loads((P/'example.json').read_text()),ensure_ascii=False).replace('<','\\u003c'),'__CORE__':(P/'core.js').read_text(),'__APP__':(P/'app.js').read_text(),'__CLAIM_FIELDS__':''.join(field(k) for k in list(fields)[:5]),'__SOURCE_FIELDS__':''.join(field(k) for k in list(fields)[5:13]),'__LIMIT_FIELDS__':''.join(field(k) for k in list(fields)[13:])}
for token,value in repl.items():
 if token in ['__CORE__','__APP__','__LICENCE__']:assert '</script' not in value.lower()
 s=s.replace(token,value)
(P/'index.html').write_text(s)
if (P/'README.txt').exists():
 names=['index.html','template.html','core.js','app.js','example.json','build.py','README.txt','test_core.cjs','test_replacement.cjs','sora-latin-wght.woff2','LICENSE-Sora.txt','monogram.svg']
 m={n:hashlib.sha256((P/n).read_bytes()).hexdigest() for n in names};(P/'manifest-sha256.json').write_text(json.dumps(m,indent=2)+'\n')
 with zipfile.ZipFile(P/'evidence-note-builder.zip','w',zipfile.ZIP_DEFLATED) as z:
  for n in [*names,'manifest-sha256.json']:z.write(P/n,n)
print('Built self-contained Evidence Note editor; not published.')
