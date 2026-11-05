export function slidesFor(c){return c.readings.flatMap((r,readingIndex)=>[
 {id:`${r.id}:character`,kind:'character',readingIndex,reading:r},
 ...r.words.map((w,i)=>({id:`${r.id}:word:${i}`,kind:'word',readingIndex,reading:r,word:w})),
 ...(r.sentences.length?r.sentences.map((s,i)=>({id:`${r.id}:sentence:${i}`,kind:'sentence',readingIndex,reading:r,sentence:s})):[{id:`${r.id}:sentence:pending`,kind:'sentence-pending',readingIndex,reading:r}])]);}
export function followingCharacter(characters,id,state,mode,isUnlocked){const index=characters.findIndex(c=>c.id===id);return characters.slice(index+1).find(c=>mode==='explore'||isUnlocked(state,c.level))||null;}
export function resumeIndex(c,resume){const slides=slidesFor(c);if(resume?.characterId!==c.id)return 0;return Math.max(0,Math.min(Number.isInteger(resume.index)?resume.index:0,slides.length));}
