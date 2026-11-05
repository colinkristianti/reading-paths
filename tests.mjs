import assert from 'node:assert/strict';
import{fresh,unlocked,record,finish,recommend,restore,metrics}from'./dist/engine.mjs';
import{CHARACTERS,QUESTIONS,DIAGNOSTIC}from'./dist/content.mjs';
import{slidesFor,followingCharacter,resumeIndex}from'./dist/journey.mjs';
import{taiwanVoice,createPlayer,isDictionaryNarration}from'./dist/audio.mjs';
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
 let played=[],spoken=[],errors=[],started=[];globalThis.fetch=async()=>({ok:true,json:async()=>({entries:{'reading:hao-3':{src:'./audio/2727.mp3'}}})});
 globalThis.Audio=class{constructor(src){this.src=src;this.currentTime=0;}play(){played.push(this.src);return Promise.resolve();}pause(){}};
 globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
 globalThis.speechSynthesis={getVoices:()=>[{name:'Taiwan',lang:'zh-TW',localService:true}],cancel(){},speak(u){spoken.push(u);}};
 const p=createPlayer({onError:e=>errors.push(e),onStarted:key=>started.push(key)});await p.play({key:'reading:hao-3',text:'好',kind:'character'});assert.equal(played[0],'./audio/2727.mp3');p.stop();
 await p.play({key:'word:hao-4:好奇',text:'好奇',kind:'word'},'slow');assert.equal(spoken[0].lang,'zh-TW');assert.equal(spoken[0].voice.name,'Taiwan');assert.equal(spoken[0].text,'好奇');assert.equal(spoken[0].rate,.65);p.stop();
 await p.play({key:'reading:missing',text:'好',kind:'character'});assert.equal(spoken.length,1);assert(errors.some(e=>e.includes('recording')));
 globalThis.speechSynthesis={getVoices:()=>[{lang:'zh-CN'}],cancel(){},speak(){throw Error('Must not use an unapproved locale');},addEventListener(_,fn){queueMicrotask(fn);},removeEventListener(){}};
 const p2=createPlayer({onError:e=>errors.push(e)});await p2.play({key:'sentence:test',text:'但是，她自己快樂嗎？',kind:'sentence'});assert(errors.some(e=>e.includes('No Taiwan Mandarin voice')));
 let resolvers=[];globalThis.fetch=()=>new Promise(r=>{resolvers.push(r);});const p3=createPlayer({onError:e=>errors.push(e)}),pending=p3.play({key:'reading:hao-3',text:'好',kind:'character'});p3.stop();for(const resolve of resolvers)resolve({ok:true,json:async()=>({entries:{'reading:hao-3':{src:'./audio/2727.mp3'}}})});await pending;assert.equal(played.length,1);
 globalThis.fetch=async()=>({ok:true,json:async()=>({entries:{'reading:hao-3':{src:'./audio/2727.mp3',sourceUrl:'https://dict.concised.moe.edu.tw/sound/word/2727.mp3'}}})});
 globalThis.speechSynthesis={getVoices:()=>[{name:'Taiwan',lang:'zh-TW',localService:true}],cancel(){},speak(u){spoken.push(u);u.onstart?.();}};
 const cleanPlayer=createPlayer({onStarted:key=>started.push(key),onError:e=>errors.push(e)});
 await cleanPlayer.play({key:'reading:hao-3',text:'好',kind:'character',cue:{text:'好像'}});
 assert.equal(played.length,1,'dictionary metadata narration must not be played');assert.equal(spoken.at(-1).text,'好像');assert.equal(started.at(-1),'reading:hao-3');cleanPlayer.stop();
 const speechCount=spoken.length;await cleanPlayer.play({key:'reading:kan-1',text:'看',kind:'character'});assert.equal(spoken.length,speechCount,'do not guess isolated heteronyms');
 await cleanPlayer.play({key:'assessment:pending',text:'中',kind:'assessment',requiresRecording:true});assert.equal(spoken.length,speechCount);
 assert(isDictionaryNarration({containsDictionaryMetadata:true}));assert(!isDictionaryNarration({src:'./audio/clean/a.mp3'}));
}finally{for(const[k,v]of Object.entries(original)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}}
console.log('Mobile journey, legacy progress, metric denominators, pronunciation audio, strict Taiwan locale and playback cancellation checks passed.');

import{QUESTION_BANK as B}from'./dist/question-bank.mjs';
import{evaluateDraft,recordDraft,draftSummary,latestDraftMistakes,recordStartingCheck}from'./dist/question-engine.mjs';
import{draftQuestionMarkup}from'./dist/draft-views.mjs';
import fs from 'node:fs/promises';
assert.equal(B.fullBank.length,64);assert.equal(B.fullBank.flatMap(g=>g.questions).length,320);assert.equal(B.worksheetRevisions.flatMap(g=>g.questions).length,15);assert.equal(B.startingCheck.length,20);
const allDraft=[...B.fullBank.flatMap(g=>g.questions),...B.worksheetRevisions.flatMap(g=>g.questions),...B.startingCheck];
assert.equal(new Set(allDraft.map(q=>q.id)).size,355);
assert(B.fullBank.every(g=>g.questions.length===5));
for(const q of allDraft){
 assert(q.rawText&&q.source.url&&q.source.row&&q.fingerprint);assert.equal(q.status,'team-draft');
 if(q.kind==='matching'){assert(q.pairs.length>=2);assert(q.pairs.every(p=>q.matchChoices.includes(p.answer)));}
 else{assert(q.options.length>=2);assert(q.correct.every(id=>q.options.some(o=>o.id===id)));assert(q.options.every(o=>!o.label.includes('✅')));assert(!q.prompt.includes('✅'));}
 if(q.scoreAllowed){const response=q.kind==='matching'?Object.fromEntries(q.pairs.map(p=>[p.id,p.answer])):q.correct;
  assert.deepEqual(evaluateDraft(q,response,{heard:true}),{graded:true,correct:true});
  assert.equal(evaluateDraft(q,response,{heard:true,previewed:true}).graded,false);
  if(q.listening)assert.equal(evaluateDraft(q,response).graded,false);
 }else assert.equal(evaluateDraft(q,'a',{heard:true}).graded,false);
}
assert.equal(allDraft.filter(q=>!q.scoreAllowed).length,7);
assert(B.fullBank.find(g=>g.character==='多').questions.slice(0,3).every(q=>!q.scoreAllowed));
assert.equal(B.worksheetRevisions.find(g=>g.character==='行').questions.filter(q=>!q.scoreAllowed).length,4);
const choice=allDraft.find(q=>q.kind==='choice'&&q.scoreAllowed&&!q.listening);
const match=allDraft.find(q=>q.kind==='matching');
assert.equal(evaluateDraft(match,{}).graded,false);
const wrong=choice.options.find(o=>!choice.correct.includes(o.id)).id;
let draftState=recordDraft(fresh(),choice,wrong,evaluateDraft(choice,wrong),100);
assert.equal(latestDraftMistakes(draftState).length,1);assert.equal(metrics(draftState).answerCount,0);assert.equal(draftState.stagePasses.length,0);
draftState=recordDraft(draftState,choice,choice.correct,evaluateDraft(choice,choice.correct),101);assert.equal(latestDraftMistakes(draftState).length,0);
const ds=draftSummary([{graded:true,correct:true},{graded:true,correct:false},{graded:false,correct:null}]);assert.deepEqual(ds,{total:3,scored:2,correct:1,unscored:1,percent:50});
draftState=recordStartingCheck(draftState,ds,102);assert.equal(draftState.startingChecks.length,1);assert.equal(metrics(draftState).accuracy,null);assert.deepEqual(restore(draftState),draftState);
const old=fresh();delete old.teamAttempts;delete old.teamHistory;delete old.startingChecks;assert.deepEqual(restore(old).teamAttempts,[]);assert.deepEqual(restore(old).startingChecks,[]);
assert.throws(()=>restore({...fresh(),teamAttempts:'broken'}));assert.throws(()=>restore({...fresh(),teamHistory:[{}]}));
const t={outcomes:[],index:0,answered:false,matchAnswers:{},heard:false,previewed:false};
const ui=draftQuestionMarkup(choice,t,{play:()=>'',icon:()=>''});assert(!ui.includes('✅'));assert(!ui.includes(choice.rawText));assert(ui.includes('Show worksheet key'));
const app=await fs.readFile('dist/app.mjs','utf8');assert(app.includes("['progress','Progress','progress'],['profile','Profile','profile']"));assert(app.includes('QUESTION_BANK.startingCheck'));assert(app.includes('recordStartingCheck'));assert(!app.includes('6 sample questions'));
console.log('355 source draft items verified: keys, matching, answer masking, unscored disputes, listening gates, score isolation, starting history and legacy backup migration.');

await import('./ui-flow-tests.mjs');
