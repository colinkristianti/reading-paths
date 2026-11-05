// Draft worksheet results stay separate from the reviewed learning path.
export function evaluateDraft(q,response,{previewed=false,heard=false}={}){
 if(previewed||!q.scoreAllowed||(q.listening&&!heard))return{graded:false,correct:null};
 if(q.kind==='matching'){
  if(!response||typeof response!=='object'||!q.pairs.every(p=>q.matchChoices.includes(response[p.id])))return{graded:false,correct:null};
  return{graded:true,correct:q.pairs.every(p=>response[p.id]===p.answer)};
 }
 const chosen=Array.isArray(response)?response:[response];
 if(!chosen.length||chosen.some(id=>!q.options.some(o=>o.id===id)))return{graded:false,correct:null};
 return{graded:true,correct:chosen.length===q.correct.length&&q.correct.every(id=>chosen.includes(id))};
}
export function recordDraft(s,q,response,outcome,now=Date.now()){
 const n=structuredClone(s);n.teamAttempts??=[];
 n.teamAttempts.push({questionId:q.id,bank:q.bank,character:q.character,response,graded:outcome.graded,correct:outcome.correct,fingerprint:q.fingerprint,at:now});
 return n;
}
export function draftSummary(outcomes){const scored=outcomes.filter(x=>x.graded);return{total:outcomes.length,scored:scored.length,correct:scored.filter(x=>x.correct).length,unscored:outcomes.length-scored.length,percent:scored.length?100*scored.filter(x=>x.correct).length/scored.length:null};}
export function latestDraftMistakes(s){const latest=new Map();for(const a of s.teamAttempts||[])if(a.graded)latest.set(a.questionId,a);return[...latest.values()].filter(a=>!a.correct);}
export function recordStartingCheck(s,summary,now=Date.now()){
 const n=structuredClone(s);n.startingChecks??=[];n.startingChecks.push({...summary,at:now,status:'team-draft'});return n;
}
