const practiceWords=reading=>reading.words.filter(word=>word.text.length>1).slice(0,2);
const reviewedSentences=reading=>reading.sentences.filter(sentence=>(sentence.status??sentence.source?.status)==='approved');

export function slidesFor(character){
 const slides=[{id:`${character.id}:intro`,kind:'intro',reading:character.readings[0]}];
 const canIdentifyAudio=character.readings.every(reading=>practiceWords(reading).length>0);
 for(const[readingIndex,reading]of character.readings.entries()){
  slides.push(
   {id:`${reading.id}:listen`,kind:'listen',readingIndex,reading},
   {id:`${reading.id}:meaning`,kind:'meaning',readingIndex,reading},
   {id:`${reading.id}:speak`,kind:'speak',readingIndex,reading},
   {id:`${reading.id}:write`,kind:'write',readingIndex,reading},
   {id:`${reading.id}:vocab`,kind:'vocab-preview',readingIndex,reading}
  );
  if(canIdentifyAudio)slides.push({id:`${reading.id}:audio-check`,kind:'audio-choice',readingIndex,reading});
  slides.push(...practiceWords(reading).map((word,index)=>({id:`${reading.id}:word:${index}`,kind:'word',readingIndex,reading,word})));
  slides.push(...reviewedSentences(reading).map((sentence,index)=>({id:`${reading.id}:sentence:${index}`,kind:'sentence',readingIndex,reading,sentence})));
 }
 const pairs=character.readings.flatMap(reading=>practiceWords(reading).map(word=>[word.text,reading.id]));
 if(new Set(pairs.map(([,readingId])=>readingId)).size>1)slides.push({id:`${character.id}:mixed-review`,kind:'sort',reading:character.readings[0],pairs});
 return slides;
}
export function followingCharacter(characters,id,state,mode,isUnlocked){const index=characters.findIndex(character=>character.id===id);return characters.slice(index+1).find(character=>mode==='explore'||isUnlocked(state,character.level))||null;}
export function resumeIndex(character,resume){const slides=slidesFor(character);if(resume?.characterId!==character.id)return 0;return Math.max(0,Math.min(Number.isInteger(resume.index)?resume.index:0,slides.length));}
