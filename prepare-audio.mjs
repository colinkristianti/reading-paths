import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
// This build never contacts a speech provider or downloads dictionary narration.
const manifest=JSON.parse(await fs.readFile('dist/clean-audio-manifest.json','utf8'));
let count=0;
for(const[key,item]of Object.entries(manifest.entries||{})){
 if(!item.src?.startsWith('./audio/clean/'))throw Error(`Invalid clean audio path: ${key}`);
 const target=path.resolve('dist',item.src),base=path.resolve('dist/audio/clean')+path.sep;
 if(!target.startsWith(base))throw Error('Audio path escapes the clean folder');
 if(item.reviewStatus!=='approved'||item.locale!=='zh-TW'||!item.rights||!item.text)throw Error(`Incomplete audio review: ${key}`);
 const bytes=await fs.readFile(target);if(bytes.length<100)throw Error('Empty audio file');
 const sha=createHash('sha256').update(bytes).digest('hex');if(item.sha256!==sha)throw Error(`Audio checksum mismatch: ${key}`);count++;
}
console.log(`Validated ${count} approved clean recordings. Free Taiwan device speech is used where available. No provider calls or dictionary downloads.`);
