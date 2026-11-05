export const taiwanVoice=voices=>voices.filter(v=>/^(zh|cmn)(-Hant)?-TW$/i.test(v.lang.replaceAll('_','-'))).sort((a,b)=>Number(b.localService)-Number(a.localService))[0]||null;
export function createPlayer({onState=()=>{},onError=()=>{}}={}){
 let active=null,currentKey=null,utterance=null,serial=0;const synth=globalThis.speechSynthesis;
 let manifest={};const ready=fetch('./audio-manifest.json').then(r=>r.ok?r.json():{}).then(v=>{manifest=v.entries||v;}).catch(()=>{});
 const stop=()=>{serial++;if(active){active.pause();active.currentTime=0;active=null;}if(utterance){synth?.cancel();utterance=null;}currentKey=null;onState(null);};
 async function play(item,speed='normal'){
  if(currentKey===item.key){stop();return;}stop();const request=serial;await ready;if(request!==serial)return;
  const asset=manifest[item.key];currentKey=item.key;onState(item.key);
  const error=message=>{if(request===serial){stop();onError(message);}};
  if(asset?.src){active=new Audio(asset.src);active.playbackRate=speed==='slow'?.8:1;active.onended=()=>{if(request===serial)stop();};active.onerror=()=>error('This recording could not load. Please try again when you are online.');try{await active.play();}catch{error('Audio could not start. Tap the speaker to try again.');}return;}
  // Never let a generic voice guess an isolated heteronym's reading.
  if(item.kind==='character'){error('This reading’s recording is still being prepared. Its word examples have their own play buttons.');return;}
  if(!synth){error('Speech playback is unavailable in this browser. Please try Safari or Chrome with a Taiwan Mandarin voice.');return;}
  let voice=taiwanVoice(synth.getVoices());if(!voice){await new Promise(resolve=>{let timer=setTimeout(done,1000);function done(){clearTimeout(timer);synth.removeEventListener?.('voiceschanged',done);resolve();}synth.addEventListener?.('voiceschanged',done,{once:true});});voice=taiwanVoice(synth.getVoices());}
  if(request!==serial)return;if(!voice){error('No Taiwan Mandarin voice is available on this device. Add a Chinese (Taiwan) voice in your device’s speech settings, then try again.');return;}
  utterance=new SpeechSynthesisUtterance(item.text);utterance.lang='zh-TW';utterance.voice=voice;utterance.rate=speed==='slow'?.65:.85;utterance.onend=()=>{if(request===serial)stop();};utterance.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))error('Speech playback could not start. Tap the speaker to try again.');};synth.speak(utterance);
 }
 return{play,stop,get activeKey(){return currentKey;}};
}
