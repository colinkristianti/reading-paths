import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root=process.cwd(),directory=path.join(root,'dist/audio');
const targets=JSON.parse(await fs.readFile(path.join(root,'audio-sources.json'),'utf8'));
await fs.mkdir(directory,{recursive:true});
function validMp3(bytes){if(bytes.length<1000||bytes.length>2000000)return false;if(bytes.subarray(0,3).toString()==='ID3')return true;for(let i=0;i<Math.min(bytes.length-1,4096);i++)if(bytes[i]===255&&(bytes[i+1]&224)===224)return true;return false;}
const groups=new Map();for(const t of targets){if(!/^\d+$/.test(t.dictionaryId))throw Error('Invalid dictionary ID');const u=new URL(t.canonicalUrlCandidate);if(u.origin!=='https://dict.concised.moe.edu.tw'||u.pathname!==`/sound/word/${t.dictionaryId}.mp3`)throw Error('Unexpected audio source');if(!groups.has(t.dictionaryId))groups.set(t.dictionaryId,[]);groups.get(t.dictionaryId).push(t);}
const manifest={},failures=[];let queue=[...groups.entries()];
async function download(id,items){const file=path.join(directory,`${id}.mp3`),source=items[0];let bytes;try{bytes=await fs.readFile(file);if(!validMp3(bytes))bytes=null;}catch{}
 if(!bytes)for(let attempt=0;attempt<2;attempt++)try{const r=await fetch(source.canonicalUrlCandidate,{headers:{'User-Agent':'ReadingPaths educational audio preparation','Referer':source.sourceEntry},signal:AbortSignal.timeout(25000),redirect:'error'});if(!r.ok)throw Error(`HTTP ${r.status}`);const type=r.headers.get('content-type')||'';if(/text\/|html|json/i.test(type))throw Error(`Unexpected Content-Type ${type}`);bytes=Buffer.from(await r.arrayBuffer());if(!validMp3(bytes))throw Error('Response is not MPEG audio');const expected=Number(r.headers.get('content-length'));if(expected&&expected!==bytes.length)throw Error('Incomplete audio response');await fs.writeFile(file,bytes);break;}catch(error){bytes=null;if(attempt===1)failures.push({id,keys:items.map(t=>t.key),error:error.message});}
 if(!bytes)return;const sha256=createHash('sha256').update(bytes).digest('hex');for(const t of items)manifest[t.key]={src:`./audio/${id}.mp3`,source:t.source,sourceEntry:t.sourceEntry,sourceUrl:t.canonicalUrlCandidate,dictionaryId:id,zhuyin:t.zhuyin,pinyin:t.pinyin,bytes:bytes.length,sha256,status:'downloaded-and-mpeg-validated',pronunciationReview:'pending-human-listening-review'};console.log(`Audio ${id}: ${bytes.length} bytes; ${items.length} playback keys`);}
await Promise.all(Array.from({length:3},async()=>{while(queue.length){const[id,items]=queue.shift();await download(id,items);}}));
await fs.writeFile(path.join(root,'dist/audio-manifest.json'),JSON.stringify({version:2,source:'MOE Concised Mandarin Dictionary; official complete recordings',entries:manifest,failures},null,2));
const missingReadings=targets.filter(t=>t.key.startsWith('reading:')&&!manifest[t.key]);console.log(JSON.stringify({availableKeys:Object.keys(manifest).length,expectedKeys:targets.length,uniqueFiles:new Set(Object.values(manifest).map(t=>t.dictionaryId)).size,failures}));
if(missingReadings.length)throw Error(`Required character recordings could not be prepared: ${missingReadings.map(t=>t.key).join(', ')}`);
// A missing word file has a strictly Taiwan-locale device-speech fallback. Character readings never use guesswork.
