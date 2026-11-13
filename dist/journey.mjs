export function slidesFor(c){if(c.id==='hao')return[
 {id:'hao:intro',kind:'intro',reading:c.readings[0]},
 {id:'hao:hao3-listen',kind:'listen',readingIndex:0,reading:c.readings[0]},
 {id:'hao:hao3-meaning',kind:'meaning',readingIndex:0,reading:c.readings[0]},
 {id:'hao:hao3-speak',kind:'speak',readingIndex:0,reading:c.readings[0]},
 {id:'hao:hao3-write',kind:'write',readingIndex:0,reading:c.readings[0]},
 {id:'hao:hao3-vocab',kind:'vocab-preview',readingIndex:0,reading:c.readings[0]},
 {id:'hao:hao3-audio-check',kind:'audio-choice',readingIndex:0,reading:c.readings[0]},
 {id:'hao:hao3-word-a',kind:'word',readingIndex:0,reading:c.readings[0],word:c.readings[0].words.find(w=>w.text==='好像')},
 {id:'hao:hao3-word-b',kind:'word',readingIndex:0,reading:c.readings[0],word:c.readings[0].words.find(w=>w.text==='最好')},
 {id:'hao:hao3-sentence',kind:'sentence-pending',readingIndex:0,reading:c.readings[0]},
 {id:'hao:hao4-listen',kind:'listen',readingIndex:1,reading:c.readings[1]},
 {id:'hao:hao4-meaning',kind:'meaning',readingIndex:1,reading:c.readings[1]},
 {id:'hao:hao4-speak',kind:'speak',readingIndex:1,reading:c.readings[1]},
 {id:'hao:hao4-write',kind:'write',readingIndex:1,reading:c.readings[1]},
 {id:'hao:hao4-vocab',kind:'vocab-preview',readingIndex:1,reading:c.readings[1]},
 {id:'hao:hao4-audio-check',kind:'audio-choice',readingIndex:1,reading:c.readings[1]},
 {id:'hao:hao4-word-a',kind:'word',readingIndex:1,reading:c.readings[1],word:c.readings[1].words.find(w=>w.text==='愛好')},
 {id:'hao:hao4-word-b',kind:'word',readingIndex:1,reading:c.readings[1],word:c.readings[1].words.find(w=>w.text==='好奇')},
 {id:'hao:hao4-sentence',kind:'sentence-pending',readingIndex:1,reading:c.readings[1]},
 {id:'hao:mixed-review',kind:'sort',reading:c.readings[0]}
];return c.readings.flatMap((r,readingIndex)=>[
 {id:`${r.id}:listen`,kind:'listen',readingIndex,reading:r},
 {id:`${r.id}:meaning`,kind:'meaning',readingIndex,reading:r},
 {id:`${r.id}:write`,kind:'write',readingIndex,reading:r},
 ...r.words.map((w,i)=>({id:`${r.id}:word:${i}`,kind:'word',readingIndex,reading:r,word:w})),
 ...(r.sentences.length?r.sentences.map((s,i)=>({id:`${r.id}:sentence:${i}`,kind:'sentence',readingIndex,reading:r,sentence:s})):[{id:`${r.id}:sentence:pending`,kind:'sentence-pending',readingIndex,reading:r}])]);}
export function followingCharacter(characters,id,state,mode,isUnlocked){const index=characters.findIndex(c=>c.id===id);return characters.slice(index+1).find(c=>mode==='explore'||isUnlocked(state,c.level))||null;}
export function resumeIndex(c,resume){const slides=slidesFor(c);if(resume?.characterId!==c.id)return 0;return Math.max(0,Math.min(Number.isInteger(resume.index)?resume.index:0,slides.length));}
