export const LEVELS=['1','1*','2','2*','3','3*'];
export const fresh=()=>({version:1,name:'Learner',onboarded:false,recommended:'1',start:'1',preferences:{size:'medium',notation:'pinyin',motion:'system'},lessons:{},mistakes:{},attempts:[],stagePasses:[]});
export function unlocked(s,level){let i=LEVELS.indexOf(level);return i>=0&&(i<=LEVELS.indexOf(s.start)||s.stagePasses.includes(level)||s.stagePasses.includes(LEVELS[i-1]));}
export function record(s,q,correct,mode='lesson',now=Date.now()){
 const n=structuredClone(s);n.attempts.push({questionId:q.id,characterId:q.characterId,readingId:q.readingId,correct,mode,at:now});
 if(!correct){const prior=n.mistakes[q.id];n.mistakes[q.id]={questionId:q.id,characterId:q.characterId,readingId:q.readingId,wrongCount:(prior?.wrongCount||0)+1,correctStreak:0,due:now,lastAt:now};}
 else if(n.mistakes[q.id]){let m=n.mistakes[q.id];m.correctStreak++;m.lastAt=now;m.due=now+(m.correctStreak===1?86400000:3*86400000);}
 return n;
}
export function finish(s,type,id,score,total){const n=structuredClone(s);const passed=total>0&&score/total>=.8;if(type==='stage'){if(passed&&!n.stagePasses.includes(id))n.stagePasses.push(id);}else{let old=n.lessons[id];n.lessons[id]={best:Math.max(old?.best||0,score),total,passed:passed||!!old?.passed,at:Date.now()};}return n;}
export function recommend(score,total){return total&&score/total>=.8?'2':score/total>=.5?'1*':'1';}
export function restore(raw){const v=typeof raw==='string'?JSON.parse(raw):raw;if(v?.version!==1||!LEVELS.includes(v.start)||!LEVELS.includes(v.recommended)||typeof v.name!=='string'||v.name.length>60||!Array.isArray(v.attempts)||!Array.isArray(v.stagePasses)||!v.stagePasses.every(l=>LEVELS.includes(l))||!v.lessons||!v.mistakes)throw Error('This is not a Reading Paths backup.');let s={...fresh(),...v,preferences:{...fresh().preferences,...v.preferences}};if(!['small','medium','large'].includes(s.preferences.size)||!['pinyin','zhuyin','both','none'].includes(s.preferences.notation)||!['system','reduced'].includes(s.preferences.motion))throw Error('Invalid display preferences.');return s;}
