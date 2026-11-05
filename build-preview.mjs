import fs from 'node:fs/promises';
import path from 'node:path';

// A review artifact for environments that cannot run a local HTTP server.
// The deployed website keeps its original ES modules and relative asset paths.
const root=process.cwd();
const out=path.resolve(root,'../output/Reading_Paths_手機版_v2_本機預覽.html');
const encode=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const modules={};
for(const name of ['engine','content','journey'])modules[name]=encode(await fs.readFile(`dist/${name}.mjs`,'utf8'));
const raw=JSON.parse(await fs.readFile('dist/audio-manifest.json','utf8'));
const manifest=structuredClone(raw.entries||raw);
for(const item of Object.values(manifest)){
 if(!item?.src)continue;
 const file=path.resolve(root,'dist',item.src);
 const bytes=await fs.readFile(file);
 item.src='data:audio/mpeg;base64,'+bytes.toString('base64');
}
let audio=await fs.readFile('dist/audio.mjs','utf8');
const start=audio.indexOf(" let manifest={};const ready=fetch(");
const end=audio.indexOf('\n const stop=',start);
if(start<0||end<0)throw Error('Audio module changed; review the preview builder.');
audio=audio.slice(0,start)+` let manifest=${JSON.stringify(manifest)};const ready=Promise.resolve();`+audio.slice(end);
modules.audio=encode(audio);
let app=await fs.readFile('dist/app.mjs','utf8');
for(const[name,url]of Object.entries(modules))app=app.replaceAll(`'./${name}.mjs'`,JSON.stringify(url));
// Keep preview progress independent of the production site and source previews.
app=app.replaceAll('reading-paths-v1','reading-paths-mobile-preview-v2');
const licence=await fs.readFile('dist/audio/LICENSE-MOE.pdf');
app=app.replaceAll('./audio/README.md','https://language.moe.gov.tw/001/Upload/Files/site_content/M0001/respub/dict_concised_download.html')
 .replaceAll('./audio/LICENSE-MOE.pdf','data:application/pdf;base64,'+licence.toString('base64'))
 .replace('Full lessons are still being reviewed. Your learning records stay in this browser.','Full lessons are still being reviewed. This local preview includes two original recordings for 看; other recordings are pending. Your learning records stay in this browser.');
let html=await fs.readFile('dist/index.html','utf8');
// The review file opens offline without waiting for external font stylesheets.
const css=(await fs.readFile('dist/styles.css','utf8')).replace(/^@import[^;]+;\s*/, '');
html=html.replace('<link rel="stylesheet" href="./styles.css">',`<style>${css}</style>`)
 .replace('<script type="module" src="./app.mjs"></script>',`<script type="module" src="${encode(app)}"></script>`)
 .replace('<title>Reading Paths · 一字多讀</title>','<title>Reading Paths · Mobile v2 local preview</title>');
await fs.mkdir(path.dirname(out),{recursive:true});
await fs.writeFile(out,html);
console.log(`${out}\n${Buffer.byteLength(html)} bytes; ${Object.keys(manifest).length} locally available audio keys. Public deployment assets are unchanged.`);
