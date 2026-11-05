import assert from 'node:assert/strict';
import{fresh,unlocked,record,finish,recommend,restore,metrics}from'./dist/engine.mjs';
import{CHARACTERS,QUESTIONS,DIAGNOSTIC}from'./dist/content.mjs';
import{slidesFor,followingCharacter,resumeIndex}from'./dist/journey.mjs';
import{taiwanVoice,createPlayer}from'./dist/audio.mjs';
let s=fresh();assert(unlocked(s,'1'));assert(!unlocked(s,'1*'));
assert.equal(CHARACTERS.find(c=>c.id==='kan').readings.length,2);assert.equal(CHARACTERS.find(c=>c.id==='kan').readings[1].words.length,0);
for(const c of CHARACTERS){let qs=QUESTIONS.filter(q=>q.characterId===c.id);assert(qs.length===0||qs.length===5);for(const q of qs){assert(c.readings.some(r=>r.id===q.readingId));assert(c.readings.some(r=>r.words.some(w=>q.word.startsWith(w.text))));}}
assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,QUESTIONS.length);assert.equal(DIAGNOSTIC.length,6);assert(DIAGNOSTIC.every(Boolean));
const q=QUESTIONS[0],now=1000;s=record(s,q,false,'lesson',now);assert.equal(s.mistakes[q.id].wrongCount,1);assert.equal(s.attempts.length,1);
s=record(s,q,true,'review',now+1);assert.equal(s.mistakes[q.id].correctStreak,1);assert.equal(s.mistakes[q.id].due,now+1+86400000);
s=record(s,q,true,'review',now+2);assert.equal(s.mistakes[q.id].correctStreak,2);
s=record(s,q,false,'review',now+3);assert.equal(s.mistakes[q.id].correctStreak,0);assert.equal(s.mistakes[q.id].wrongCount,2);
assert(!finish(s,'lesson','hao',3,5).lessons.hao.passed);s=finish(s,'lesson','hao',4,5);assert(s.lessons.hao.passed);s=finish(s,'lesson','hao',1,5);assert.equal(s.lessons.hao.best,4);assert(s.lessons.hao.passed);
assert(!unlocked(finish(s,'stage','1',3,5),'1*'));s=finish(s,'stage','1',4,5);assert(unlocked(s,'1*'));assert(!unlocked(s,'2'));
s=finish(s,'stage','1*',8,10);assert(unlocked(s,'2'));assert(unlocked(s,'1*'));assert.deepEqual(restore(JSON.stringify(s)),s);
let later=fresh();later.start='2';assert(unlocked(later,'1*'));assert(unlocked(later,'2'));assert(!unlocked(later,'2*'));
assert.equal(recommend(5,6),'2');assert.equal(recommend(3,6),'1*');assert.equal(recommend(1,6),'1');assert.throws(()=>restore({version:2}));
console.log('Learning flow checks passed: scope, five-question checks, review scheduling, shared progress, pass thresholds, unlocks, backup, and sample starting suggestions.');

// A single item per learning card; every word, reading and real sentence is reachable.
for(const c of CHARACTERS){const slides=slidesFor(c);assert.equal(slides.filter(s=>s.kind==='character').length,c.readings.length);assert.equal(slides.filter(s=>s.kind==='word').length,c.readings.reduce((v,r)=>v+r.words.length,0));assert.equal(slides.filter(s=>s.kind==='sentence').length,c.readings.reduce((v,r)=>v+r.sentences.length,0));assert.equal(new Set(slides.map(s=>s.id)).size,slides.length);assert.equal(resumeIndex(c,{characterId:c.id,index:9999}),slides.length);}
assert.equal(followingCharacter(CHARACTERS,'hao',fresh(),'guided',unlocked).id,'kan');
assert.equal(followingCharacter(CHARACTERS,'kan',fresh(),'guided',unlocked),null);
assert.equal(followingCharacter(CHARACTERS,'kan',fresh(),'explore',unlocked).id,'le');
let stats=fresh();assert.equal(metrics(stats).accuracy,null);assert.equal(metrics(stats).quizAverage,null);
stats=record(stats,QUESTIONS[0],false,'lesson',1);stats=record(stats,QUESTIONS[0],true,'review',2);stats=record(stats,QUESTIONS[1],true,'stage',3);stats=record(stats,QUESTIONS[2],false,'diagnostic',4);
stats=finish(stats,'lesson','hao',4,5);stats=finish(stats,'lesson','hao',2,5);stats=finish(stats,'stage','1',5,5);
assert.equal(metrics(stats).quizAverage,60);assert.equal(metrics(stats).quizCount,2);assert.equal(metrics(stats).accuracy,200/3);assert.equal(metrics(stats).firstAccuracy,50);assert.equal(metrics(stats).answerCount,3);
const legacy={...fresh()};delete legacy.quizHistory;delete legacy.resume;delete legacy.viewed;delete legacy.learningMode;delete legacy.preferences.speed;assert.equal(restore(legacy).preferences.speed,'normal');assert.deepEqual(restore(legacy).quizHistory,[]);assert.throws(()=>restore({...fresh(),mistakes:'invalid'}));

// Locale selection never silently falls back to China Mandarin or an English voice.
assert.equal(taiwanVoice([{name:'China',lang:'zh-CN'},{name:'English',lang:'en-US'}]),null);
assert.equal(taiwanVoice([{name:'TW network',lang:'zh-TW',localService:false},{name:'TW device',lang:'zh_TW',localService:true}]).name,'TW device');
const original={fetch:globalThis.fetch,Audio:globalThis.Audio,speechSynthesis:globalThis.speechSynthesis,SpeechSynthesisUtterance:globalThis.SpeechSynthesisUtterance};
try{
 let played=[],spoken=[],errors=[];globalThis.fetch=async()=>({ok:true,json:async()=>({entries:{'reading:hao-3':{src:'./audio/2727.mp3'}}})});
 globalThis.Audio=class{constructor(src){this.src=src;this.currentTime=0;}play(){played.push(this.src);return Promise.resolve();}pause(){}};
 globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
 globalThis.speechSynthesis={getVoices:()=>[{name:'Taiwan',lang:'zh-TW',localService:true}],cancel(){},speak(u){spoken.push(u);}};
 const p=createPlayer({onError:e=>errors.push(e)});await p.play({key:'reading:hao-3',text:'好',kind:'character'});assert.equal(played[0],'./audio/2727.mp3');p.stop();
 await p.play({key:'word:hao-4:好奇',text:'好奇',kind:'word'},'slow');assert.equal(spoken[0].lang,'zh-TW');assert.equal(spoken[0].voice.name,'Taiwan');assert.equal(spoken[0].text,'好奇');assert.equal(spoken[0].rate,.65);p.stop();
 await p.play({key:'reading:missing',text:'好',kind:'character'});assert.equal(spoken.length,1);assert(errors.some(e=>e.includes('recording')));
 globalThis.speechSynthesis={getVoices:()=>[{lang:'zh-CN'}],cancel(){},speak(){throw Error('Must not use an unapproved locale');},addEventListener(_,fn){queueMicrotask(fn);},removeEventListener(){}};
 const p2=createPlayer({onError:e=>errors.push(e)});await p2.play({key:'sentence:test',text:'但是，她自己快樂嗎？',kind:'sentence'});assert(errors.some(e=>e.includes('No Taiwan Mandarin voice')));
 let resolve;globalThis.fetch=()=>new Promise(r=>{resolve=r;});const p3=createPlayer({onError:e=>errors.push(e)}),pending=p3.play({key:'reading:hao-3',text:'好',kind:'character'});p3.stop();resolve({ok:true,json:async()=>({entries:{'reading:hao-3':{src:'./audio/2727.mp3'}}})});await pending;assert.equal(played.length,1);
}finally{for(const[k,v]of Object.entries(original)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}}
console.log('Mobile journey, legacy progress, metric denominators, pronunciation audio, strict Taiwan locale and playback cancellation checks passed.');
