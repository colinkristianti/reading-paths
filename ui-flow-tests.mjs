// Controller integration with a small DOM stub; this does not replace phone/browser visual QA.
import assert from 'node:assert/strict';
import{QUESTION_BANK as B}from'./dist/question-bank.mjs';
const names=['document','window','location','localStorage','addEventListener','scrollTo','fetch'];
const original=Object.fromEntries(names.map(k=>[k,globalThis[k]]));
try{
 const els=new Map(),listeners={};let saved=null,hash='#/profile';
 const el=id=>{if(!els.has(id))els.set(id,{innerHTML:'',dataset:{},value:'1',focus(){},addEventListener(){},classList:{add(){},remove(){}}});return els.get(id);};
 globalThis.document={documentElement:{dataset:{}},body:{dataset:{}},querySelector:el,querySelectorAll:()=>[],addEventListener:(n,f)=>listeners['doc:'+n]=f};
 globalThis.window=globalThis;globalThis.scrollTo=()=>{};globalThis.addEventListener=(n,f)=>listeners[n]=f;
 globalThis.location={get hash(){return hash;},set hash(v){hash=v.startsWith('#')?v:'#'+v;}};
 globalThis.localStorage={getItem:()=>null,setItem:(_,v)=>saved=JSON.parse(v)};
 globalThis.fetch=async()=>({ok:true,json:async()=>({entries:{}})});
 await import('./dist/app.mjs');
 const view=()=>el('#app').innerHTML;
 const navigate=path=>{location.hash='#/'+path;listeners.hashchange();};
 const click=async data=>{const before=hash;await listeners['doc:click']({target:{closest:()=>({dataset:data})}});if(before!==hash)listeners.hashchange();};
 assert(view().includes('Take starting check'));
 await click({action:'diagnostic'});assert(view().includes('1 / 20'));
 for(const q of B.startingCheck){if(q.listening)await click({action:'preview-listening'});await click({answer:q.correct[0]});assert(view().includes('Next question')||view().includes('See draft result'));await click({action:'next-question'});}
 assert(view().includes('20 questions explored · 5 unscored'));assert.equal(saved.startingChecks.length,1);assert.equal(saved.attempts.length,0);
 el('#result-start').value='1*';await click({action:'accept-start'});assert(view().includes('Learning'));
 navigate('profile');assert(view().includes('Retake starting check'));assert.equal(saved.start,'1*');
 navigate('team');assert(view().includes('64 source character sets'));
 const group=B.fullBank.find(g=>g.character==='好');await click({teamGroup:group.id});
 for(const q of group.questions){
  if(q.listening)await click({action:'preview-listening'});
  if(q.kind==='matching'){for(const p of q.pairs)await listeners['doc:change']({target:{id:'',dataset:{match:p.id},value:p.answer}});await click({action:'check-matching'});}
  else await click({answer:q.correct[0]});
  await click({action:'next-question'});
 }
 assert(view().includes('Worksheet preview complete'));assert.equal(saved.teamAttempts.length,5);assert.equal(saved.teamHistory.length,1);assert.equal(saved.attempts.length,0);assert.equal(saved.quizHistory.length,0);assert.equal(saved.stagePasses.length,0);
 navigate('progress');assert(view().includes('0 practice answers'));assert(view().includes('5 responses'));
 console.log('Controller flow passed: first-time Profile → full 20-item check → custom start → retake entry → five mixed-format draft items → separate history and unchanged learning metrics.');
}finally{for(const[k,v]of Object.entries(original)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}}
