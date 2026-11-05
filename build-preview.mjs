import fs from 'node:fs/promises';
import path from 'node:path';
// A single review file for environments that cannot start a local HTTP server.
// Each module keeps its private scope; the deployed site still uses ES modules.
const root=process.cwd();
const out=path.resolve(root,'../output/Reading_Paths_手機版_v3_本機預覽.html');
const names=['engine','content','journey','question-bank','question-engine','draft-views','audio'];
const symbol=n=>'__'+n.replaceAll('-','_');
const raw=JSON.parse(await fs.readFile('dist/audio-manifest.json','utf8'));
const clean=JSON.parse(await fs.readFile('dist/clean-audio-manifest.json','utf8'));
const manifest=structuredClone({...raw.entries,...clean.entries});
for(const[key,item]of Object.entries(manifest))if(item.containsDictionaryMetadata||/dict\.concised\.moe\.edu\.tw\/sound\/word\//i.test(item.sourceUrl||''))delete manifest[key];
for(const item of Object.values(manifest)){if(item.src)item.src='data:audio/mpeg;base64,'+(await fs.readFile(path.resolve(root,'dist',item.src))).toString('base64');}
let bundled='';
for(const name of names){
 let src=await fs.readFile(`dist/${name}.mjs`,'utf8');
 if(name==='audio'){
  const start=src.indexOf(' let manifest={};const ready='),end=src.indexOf('\n const stop=',start);
  if(start<0||end<0)throw Error('Audio module changed; review preview builder.');
  src=src.slice(0,start)+` let manifest=${JSON.stringify(manifest)};const ready=Promise.resolve();`+src.slice(end);
 }
 const exports=[...src.matchAll(/export\s+(?:const|function)\s+([A-Za-z_$][\w$]*)/g)].map(m=>m[1]);
 if(!exports.length)throw Error(`No exports found for ${name}`);
 bundled+=`const ${symbol(name)}=(()=>{\n${src.replaceAll(/export\s+(?=const|function)/g,'')}\nreturn {${exports.join(',')}};})();\n`;
}
let app=await fs.readFile('dist/app.mjs','utf8');
app=app.replaceAll(/import\{([^}]+)\}from'\.\/([^']+)\.mjs';/g,(_,bindings,name)=>`const{${bindings.replaceAll(/\s+as\s+/g,':')}}=${symbol(name)};`)
 .replaceAll('reading-paths-v1','reading-paths-mobile-preview-v3')
 .replaceAll('./audio/README.md','https://language.moe.gov.tw/001/Upload/Files/site_content/M0001/respub/dict_concised_download.html')
 .replaceAll('./audio/LICENSE-MOE.pdf','https://language.moe.gov.tw/001/Upload/Files/site_content/M0001/respub/dict_concised_download.html');
const script=(bundled+app).replaceAll(/<\/script/gi,'<\\/script');
const css=(await fs.readFile('dist/styles.css','utf8')).replace(/^@import[^\n]+\n/,'');
let html=await fs.readFile('dist/index.html','utf8');
html=html.replace('<link rel="stylesheet" href="./styles.css">',()=>`<style>${css}</style>`)
 .replace('<script type="module" src="./app.mjs"></script>',()=>`<script type="module">${script}</script>`)
 .replace('<title>Reading Paths · 一字多讀</title>','<title>Reading Paths · Mobile v3 local preview</title>');
await fs.mkdir(path.dirname(out),{recursive:true});await fs.writeFile(out,html);
console.log(`${out}\n${Buffer.byteLength(html)} bytes; ${Object.keys(manifest).length} approved clean audio keys. Browser voice required for device speech.`);
