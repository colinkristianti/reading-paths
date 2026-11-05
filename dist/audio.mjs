export const taiwanVoice=voices=>voices.filter(v=>/^(zh|cmn)(-Hant)?-TW$/i.test(v.lang.replaceAll('_','-'))).sort((a,b)=>Number(b.localService)-Number(a.localService))[0]||null;
export const isDictionaryNarration=asset=>!!asset?.containsDictionaryMetadata||/dict\.concised\.moe\.edu\.tw\/sound\/word\//i.test(asset?.sourceUrl||'');
export function createPlayer({onState=()=>{},onError=()=>{},onStarted=()=>{}}={}){
 let active=null,currentKey=null,utterance=null,serial=0;const synth=globalThis.speechSynthesis;
 let manifest={};const ready=Promise.all(['./audio-manifest.json','./clean-audio-manifest.json'].map(url=>fetch(url).then(r=>r.ok?r.json():{}).catch(()=>({})))).then(values=>{manifest=Object.assign({},...values.map(v=>v.entries||v));});
 const stop=()=>{serial++;if(active){active.pause();active.currentTime=0;active=null;}if(utterance){synth?.cancel();utterance=null;}currentKey=null;onState(null);};
 async function play(item,speed='normal'){
  if(currentKey===item.key){stop();return;}stop();const request=serial;await ready;if(request!==serial)return;
  const candidate=manifest[item.key],asset=isDictionaryNarration(candidate)?null:candidate;
  currentKey=item.key;onState(item.key);
  const error=message=>{if(request===serial){stop();onError(message);}};
  if(asset?.src){active=new Audio(asset.src);active.playbackRate=speed==='slow'?.8:1;active.onended=()=>{if(request===serial)stop();};active.onerror=()=>error('This recording could not load. Please try again when you are online.');try{await active.play();if(request===serial)onStarted(item.key);}catch{error('Audio could not start. Tap the speaker to try again.');}return;}
  if(item.requiresRecording){error('This exact listening recording is pending. You can preview its written cue without a score.');return;}
  // An isolated heteronym is never guessed. A visible, existing lesson word can be a cue.
  if(item.kind==='character'&&!item.cue){error('A clean recording for this reading is still pending. Its word examples have their own play buttons.');return;}
  if(!synth){error('Speech playback is unavailable here. Open Audio setup in Profile for device guidance.');return;}
  let voice=taiwanVoice(synth.getVoices());if(!voice){await new Promise(resolve=>{let timer=setTimeout(done,1000);function done(){clearTimeout(timer);synth.removeEventListener?.('voiceschanged',done);resolve();}synth.addEventListener?.('voiceschanged',done,{once:true});});voice=taiwanVoice(synth.getVoices());}
  if(request!==serial)return;if(!voice){error('No Taiwan Mandarin voice is available on this device. Open Profile → Audio setup to add a Chinese (Taiwan) voice.');return;}
  utterance=new SpeechSynthesisUtterance(item.kind==='character'?item.cue.text:item.text);utterance.lang='zh-TW';utterance.voice=voice;utterance.rate=speed==='slow'?.65:.85;utterance.onstart=()=>{if(request===serial)onStarted(item.key);};utterance.onend=()=>{if(request===serial)stop();};utterance.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))error('Speech playback could not start. Tap the speaker to try again.');};synth.speak(utterance);
 }
 return{play,stop,get voiceInfo(){const v=taiwanVoice(synth?.getVoices()||[]);return v?{name:v.name,lang:v.lang,localService:v.localService}:null;},get activeKey(){return currentKey;}};
}
