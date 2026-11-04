import assert from 'node:assert/strict';
import{fresh,unlocked,record,finish,recommend,restore}from'./dist/engine.mjs';
import{CHARACTERS,QUESTIONS,DIAGNOSTIC}from'./dist/content.mjs';
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
