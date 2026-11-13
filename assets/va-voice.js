/* Vigyan Atlas — Teacher narration (Hindi / English / bilingual, male or female voice).
   Zero cost: uses the voices already installed on the device (Web Speech API) and works offline.
   If a real recording exists in assets/voice/ (see docs/VOICE.md) it is played instead of the synthetic voice.
   The script of each topic = hand-written teacher text (assets/va-voice-data.js) + the topic's own lesson text
   (intro, steps, labels, real-life) so the words always match what is on the screen. */
(()=>{"use strict";
const DATA=window.VA_VOICE_DATA;const $=s=>document.querySelector(s),B=document.body,A=()=>window.__atlas;
const stage=$("#stage"),bar=$("#stagebar");if(!stage||!bar||!DATA)return;
const LS={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,String(v))}catch{}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const SS=window.speechSynthesis,HAS=!!(SS&&window.SpeechSynthesisUtterance);

/* ------------------------------------------------------------ pronunciation helpers */
const EL=new Set("H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Ti Cr Mn Fe Co Ni Cu Zn Br Ag Sn I Au Hg Pb U Ba Sr Xe".split(" "));
const LH={A:"ए",B:"बी",C:"सी",D:"डी",E:"ई",F:"एफ़",G:"जी",H:"एच",I:"आई",J:"जे",K:"के",L:"एल",M:"एम",N:"एन",O:"ओ",P:"पी",Q:"क्यू",R:"आर",S:"एस",T:"टी",U:"यू",V:"वी",W:"डब्ल्यू",X:"एक्स",Y:"वाई",Z:"ज़ेड"};
const DH=["ज़ीरो","वन","टू","थ्री","फ़ोर","फ़ाइव","सिक्स","सेवन","एट","नाइन"],DE=["zero","one","two","three","four","five","six","seven","eight","nine"];
const SUB="₀₁₂₃₄₅₆₇₈₉",SUP="⁰¹²³⁴⁵⁶⁷⁸⁹";
const dig=c=>{const i=SUB.indexOf(c),j=SUP.indexOf(c);return i>=0?i:j>=0?j:+c};
const spell=(t,hi)=>{const o=[];for(const c of t){if(/[A-Za-z]/.test(c))o.push(hi?LH[c.toUpperCase()]:c.toUpperCase());else if(/[0-9₀-₉⁰-⁹]/.test(c))o.push((hi?DH:DE)[dig(c)]);else if(c==="⁺"||c==="+")o.push(hi?"प्लस":"plus");else if(c==="⁻"||c==="−"||c==="-")o.push(hi?"माइनस":"minus")}return o.join(" ")};
const NAMES={Na:["सोडियम","sodium"],Mg:["मैग्नीशियम","magnesium"],Ca:["कैल्शियम","calcium"],Fe:["आयरन","iron"],Cu:["कॉपर","copper"],Zn:["ज़िंक","zinc"],Ag:["सिल्वर","silver"],Au:["गोल्ड","gold"],Pb:["लेड","lead"],Hg:["मरकरी","mercury"],Cl:["क्लोरीन","chlorine"],Br:["ब्रोमीन","bromine"]};
const GREEK={"α":["अल्फ़ा","alpha"],"β":["बीटा","beta"],"γ":["गामा","gamma"],"Δ":["डेल्टा","delta"],"θ":["थीटा","theta"],"λ":["लैम्डा","lambda"],"μ":["माइक्रो","micro"],"π":["पाई","pi"],"ρ":["रो","rho"],"Ω":["ओम","ohm"],"σ":["सिग्मा","sigma"],"ε":["एप्सिलॉन","epsilon"],"φ":["फ़ाई","phi"]};
const UNIT={kWh:["किलोवाट घंटा","kilowatt hour"],kg:["किलोग्राम","kilogram"],mg:["मिलीग्राम","milligram"],g:["ग्राम","gram"],km:["किलोमीटर","kilometre"],cm:["सेंटीमीटर","centimetre"],mm:["मिलीमीटर","millimetre"],nm:["नैनोमीटर","nanometre"],m:["मीटर","metre"],s:["सेकंड","second"],min:["मिनट","minute"],h:["घंटे","hour"],N:["न्यूटन","newton"],J:["जूल","joule"],kW:["किलोवाट","kilowatt"],W:["वाट","watt"],V:["वोल्ट","volt"],mA:["मिलीऐम्पियर","milliampere"],A:["ऐम्पियर","ampere"],kHz:["किलोहर्ट्ज़","kilohertz"],Hz:["हर्ट्ज़","hertz"],Pa:["पास्कल","pascal"],mol:["मोल","mole"],K:["केल्विन","kelvin"],L:["लीटर","litre"],mL:["मिलीलीटर","millilitre"]};
const FRE=/(?<![A-Za-z0-9])(\d{0,2})((?:[A-Z][a-z]?(?:[₀-₉]+|\d+)?|\((?:[A-Z][a-z]?(?:[₀-₉]+|\d+)?)+\)(?:[₀-₉]+|\d+)?)+)((?:[⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻])?)(?![A-Za-z])/g;
const ROMAN={IX:["नौ","nine"],X:["दस","ten"],XI:["ग्यारह","eleven"],XII:["बारह","twelve"],VIII:["आठ","eight"],VII:["सात","seven"],VI:["छह","six"]};
function normalize(t,hi){const L=hi?0:1;let s=String(t);
 s=s.replace(/\p{Extended_Pictographic}|[★•▶◀✓✕✔✖▪►■□●○◆↺⟲]/gu," ").replace(/[“”"‘]/g,"").replace(/(?<![A-Za-z])’|’(?![A-Za-z])/g,"").replace(/[*_#`]/g,"");
 s=s.replace(/Class\s+(XII|XI|IX|X|VIII|VII|VI)\b/g,(m,r)=>(hi?"कक्षा ":"Class ")+ROMAN[r][L]);
 s=s.replace(/(?<=[A-Za-z0-9₀-₉\)])\((aq|s|l|g)\)/g,(m,x)=>" "+({aq:["जलीय","aqueous"],s:["ठोस","solid"],l:["द्रव","liquid"],g:["गैस","gas"]})[x][L]);
 s=s.replace(/([A-Za-z₀-₉\)])·(?=[\d½¼]?[A-Z])/g,"$1, ");
 s=s.replace(/\bpH\b/g,hi?"पी एच":"pee aitch");
 s=s.replace(FRE,(m,co,body,ch)=>{const syms=body.match(/[A-Z][a-z]?/g)||[];const ok=syms.every(x=>EL.has(x))&&(/[₀-₉()]/.test(body)||ch||syms.length>=2);if(!ok)return m;return(co?(hi?DH:DE)[+co[0]]+(co[1]?" "+(hi?DH:DE)[+co[1]]:"")+" ":"")+spell(body+ch,hi)});
 s=s.replace(/(?<![A-Za-z0-9])(Na|Mg|Ca|Fe|Cu|Zn|Ag|Au|Pb|Hg|Cl|Br)(?![A-Za-z0-9₀-₉⁺⁻])/g,(m,x)=>NAMES[x][L]);
 s=s.replace(/(?<![A-Za-z])[A-Z]{2,6}(?![A-Za-z])/g,m=>spell(m,hi));
 s=s.replace(/(?<![A-Za-z])[A-Za-z]{2}(?![A-Za-z])/g,m=>m[0].toLowerCase()===m[1].toLowerCase()?spell(m,hi):m);
 s=s.replace(/(?<![A-Za-z])[A-Za-z]{4}(?![A-Za-z])/g,m=>m[0].toLowerCase()===m[1].toLowerCase()&&m[2].toLowerCase()===m[3].toLowerCase()?spell(m,hi):m);
 s=s.replace(/(?<![A-Za-z0-9])([A-Z])(\d)(?![A-Za-z0-9])/g,(m,a,d)=>spell(a+d,hi));
 s=s.replace(/(\d)\s?°\s?C\b/g,(m,d)=>d+(hi?" डिग्री सेल्सियस":" degree Celsius")).replace(/°C\b/g,hi?"डिग्री सेल्सियस":"degree Celsius").replace(/°/g,hi?" डिग्री":" degree");
 s=s.replace(/\b(m|km)\s?\/\s?(s|h)(²)?/g,(m,a,b,sq)=>UNIT[a][L]+(hi?" प्रति ":" per ")+UNIT[b][L]+(sq?(hi?" वर्ग":" squared"):""));
 s=s.replace(/(\d(?:[.,]\d+)?)\s?(kWh|kg|mg|g|km|cm|mm|nm|m|s|min|h|N|J|kW|W|V|mA|A|kHz|Hz|Pa|mol|K|L|mL)(?![A-Za-z])/g,(m,d,u)=>d+" "+UNIT[u][L]);
 s=s.replace(/[αβγΔθλμπρσεφΩ]/g,c=>" "+GREEK[c][L]+" ");
 s=s.replace(/(\d)\s?[–-]\s?(\d)/g,hi?"$1 से $2":"$1 to $2");
 s=s.replace(/([0-9A-Za-z\)])(⁻?)([⁰-⁹]+)/g,(m,pre,neg,d)=>{const n=[...d].map(c=>SUP.indexOf(c)).join("");if(!neg&&/\D/.test(pre)&&(n==="2"||n==="3"))return pre+(n==="2"?(hi?" वर्ग":" squared"):(hi?" घन":" cubed"));return pre+(hi?" घात ":" to the power ")+(neg?(hi?"ऋण ":"minus "):"")+n});
 s=s.replace(/[₀-₉]+/g,m=>" "+[...m].map(c=>SUB.indexOf(c)).join(""));
 const M=hi?{"→":" देता है, ","⇌":" संतुलन में ","=":" बराबर ","×":" गुणा ","÷":" भाग ","≈":" लगभग ","≥":" से अधिक या बराबर ","≡":" ट्रिपल बॉन्ड ","∠":" कोण ","⊥":" लंबवत ","≤":" से कम या बराबर ","∝":" अनुक्रमानुपाती ","<":" से कम ",">":" से अधिक ","%":" प्रतिशत","½":" आधा ","¼":" चौथाई ","√":" वर्गमूल ","↑":" ऊपर ","↓":" नीचे ","²":" वर्ग","³":" घन","&":" और ","/":" भाग ","+":" प्लस ","−":" माइनस "}:{"→":" gives ","⇌":" in equilibrium with ","=":" equals ","×":" times ","÷":" divided by ","≈":" about ","≥":" at least ","≡":" triple bond ","∠":" angle ","⊥":" perpendicular to ","≤":" at most ","∝":" proportional to ","<":" less than ",">":" greater than ","%":" percent","½":" half ","¼":" a quarter ","√":" square root of ","↑":" up ","↓":" down ","²":" squared","³":" cubed","&":" and ","/":" by ","+":" plus ","−":" minus "};
 s=s.replace(/[→⇌=×÷≈≥≤∝<>%½¼√↑↓²³&\/+−≡∠⊥]/g,c=>M[c]);
 s=s.replace(/[·]/g,", ").replace(/\s[—–]\s/g,", ").replace(/[—–]/g," ").replace(/[()\[\]]/g,", ").replace(/…/g,".").replace(/:\s*(?=\S)/g,", ");
 if(hi)s=s.replace(/(?<![A-Za-z])[A-Za-z](?![A-Za-z])/g,c=>LH[c.toUpperCase()]);
 return s.replace(/\s*,(\s*,)+/g,",").replace(/\s+([,.;।?!])/g,"$1").replace(/\s+/g," ").trim()}
const isDev=s=>{const d=(s.match(/[ऀ-ॿ]/g)||[]).length,l=(s.match(/[A-Za-z]/g)||[]).length;return d>=l};
function sents(t){t=String(t||"").replace(/\s+/g," ").trim();if(!t)return[];const out=[];
 t.split(/(?<=[।!?])\s+|(?<=[a-z\)]\.)\s+(?=[A-Z"“(])/).forEach(s=>{s=s.trim();if(!s)return;if(s.length<=190){out.push(s);return}let cur="";s.split(/(?<=[,;:—–])\s+/).forEach(p=>{if((cur+" "+p).length>150&&cur){out.push(cur);cur=p}else cur=cur?cur+" "+p:p});if(cur)out.push(cur)});return out}
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};

/* ------------------------------------------------------------ settings & voices */
const S={lang:LS.get("va.vt.lang")||(LS.get("va.lang")==="en"?"en":"hi"),gender:LS.get("va.vt.gender")==="f"?"f":"m",rate:+LS.get("va.vt.rate")||1,pm:+LS.get("va.vt.pm")||.78,pf:+LS.get("va.vt.pf")||1.04,vHi:LS.get("va.vt.vhi")||"",vEn:LS.get("va.vt.ven")||"",auto:LS.get("va.vt.auto")==="1"};
if(!["hi","en","both"].includes(S.lang))S.lang="hi";
const save=()=>{LS.set("va.vt.lang",S.lang);LS.set("va.vt.gender",S.gender);LS.set("va.vt.rate",S.rate);LS.set("va.vt.pm",S.pm);LS.set("va.vt.pf",S.pf);LS.set("va.vt.vhi",S.vHi);LS.set("va.vt.ven",S.vEn);LS.set("va.vt.auto",S.auto?1:0)};
let VOICES=[];const bad=new Set();
const loadVoices=()=>{try{VOICES=SS.getVoices()||[]}catch{VOICES=[]}};if(HAS){loadVoices();SS.addEventListener&&SS.addEventListener("voiceschanged",()=>{loadVoices();paintCfg()})}
const FEM=/swara|kalpana|heera|lekha|neerja|priya|veena|zira|aditi|raveena|samantha|karen|tessa|susan|hazel|female|woman|sangeeta|ananya|kavya|aarti|jenny|aria|sonia|libby|ava\b|emma|natasha|ruth|catherine|kyoko|amelie|victoria|fiona|moira/i;
const MAL=/madhur|hemant|prabhat|ravi\b|rishi|david|mark\b|alex\b|daniel|fred\b|\bmale\b|james|george|ryan|guy\b|christopher|eric\b|roger|thomas|oliver|arjun|aarav|kabir|rohan|yash|rishabh/i;
const gOf=v=>{const n=v.name+" "+v.voiceURI;return FEM.test(n)?"f":MAL.test(n)?"m":"?"};
const langOf=v=>v.lang.replace("_","-").toLowerCase();
function score(v,lang,g){if(bad.has(v.voiceURI))return-1e9;const n=v.name+" "+v.voiceURI,L=langOf(v);
 if(lang==="hi"){if(!L.startsWith("hi"))return-1e9}else{if(!L.startsWith("en"))return-1e9}
 let s=lang==="en"?(L==="en-in"?30:L==="en-gb"?12:L==="en-us"?8:L==="en-au"?6:0):0;
 if(/natural|neural|online|enhanced|premium/i.test(n))s+=40;if(/google/i.test(n))s+=12;if(v.localService)s+=6;
 const k=gOf(v);if(k===g)s+=60;else if(k!=="?")s-=80;return s}
function pickVoice(lang,g){const want=lang==="hi"?S.vHi:S.vEn;if(want){const v=VOICES.find(x=>x.voiceURI===want&&!bad.has(x.voiceURI));if(v)return v}
 let best=null,bs=-1e8;VOICES.forEach(v=>{const s=score(v,lang,g);if(s>bs){bs=s;best=v}});return bs>-1e8?best:null}
const prof=()=>({base:{hi:.9,en:.95},pitch:S.gender==="m"?S.pm:S.pf});

/* ------------------------------------------------------------ script builder */
const D=DATA,T=e=>e?e.textContent.replace(/\s+/g," ").trim():"";
const pairOf=r=>({hi:T(r.querySelector(".hi")),en:T(r.querySelector(".en"))});
const in2d=()=>!!(window.__va2d&&window.__va2d.get()==="2d");
function readLesson(){const o={title:pairOf($("#ttl")||document.body),intro:null,steps:[],real:[],labels:[]};
 const i=$("#intro .bi");if(i)o.intro=pairOf(i);
 let n=0;try{n=A().state().playback.steps||0}catch{}
 if(n>0)document.querySelectorAll("#steps li .bi").forEach(b=>o.steps.push(pairOf(b)));
 if(!$("#real").hidden)document.querySelectorAll("#real details.rl").forEach(d=>{const b=d.querySelector(".bi");if(!b)return;const lab=T(d.querySelector("summary .en")).toLowerCase();o.real.push({fact:/reality|fact/.test(lab),...pairOf(b)})});
 try{o.labels=A().labels().map(l=>({hi:l.hi||"",en:l.en||""}))}catch{}return o}
function buildScript(opt={}){const key=(A()&&A().key&&A().key())||"",grp=key.split("/")[0],C=D.chapters[grp],vi=hash(key)%3,m=S.lang,les=readLesson(),two=in2d();
 const segs=[];let sec=-1;
 const pv=(arr)=>arr[vi%arr.length];
 const push=(lang,text,o={})=>{const disp=text;const say=normalize(text,lang==="hi"||isDev(text));if(!say)return;
  const parts=[],mixed=/[\u0900-\u0963\u0966-\u097F]/.test(say)&&/[A-Za-z]/.test(say);(mixed?say.split(/([A-Za-z][A-Za-z0-9'’\-\s,.]*[A-Za-z0-9]|[A-Za-z])/).filter(x=>x&&x.trim()):[say]).forEach(x=>{if(!/[\p{L}\p{N}]/u.test(x)&&parts.length)parts[parts.length-1]+=x.trim();else parts.push(x)});
  if(parts.length>1&&!/[\p{L}\p{N}]/u.test(parts[0])){parts[1]=parts[0]+" "+parts[1];parts.shift()}
  parts.forEach((p,k)=>{const dv=/[\u0900-\u0963\u0966-\u097F]/.test(p),L=/[A-Za-z]/.test(p)&&!dv?"en":dv?"hi":(parts[k-1]?segs[segs.length-1].lang:lang);const last=k===parts.length-1;
   segs.push({sec,lang:L,disp:k?"":disp,say:L==="en"?p.trim().replace(/[।॥]/g,"."):p.trim(),pause:last?(o.pause||0):0,on:k?null:o.on,off:k?null:o.off,kind:o.kind})})};
 /* a bilingual item -> segments for the chosen mode; callbacks attach to the first segment */
 const item=(hi,en,o={})=>{hi=(hi||"").trim();en=(en||"").trim();if(!hi&&!en)return;
  const langs=m==="both"?[["hi",hi],["en",en]]:m==="hi"?[["hi",hi||en]]:[["en",en||hi]];
  let first=true;langs.forEach(([L,t])=>{if(!t)return;const dl=isDev(t)?"hi":"en";const ss=sents(t);ss.forEach((s,k)=>{const last=k===ss.length-1;push(dl,s,{pause:last?(o.pause??520):380,on:first&&k===0?o.on:null,off:last?o.off:null,kind:o.kind});});first=false})};
 const next=()=>{sec++};
 if(opt.greet!==false){next();item(pv(D.greet.hi),pv(D.greet.en),{pause:500})}
 next();item(pv(D.topic.hi)+" "+(les.title.hi||les.title.en),pv(D.topic.en)+" "+(les.title.en||les.title.hi),{pause:800,kind:"title"});
 if(C){next();item(C.h[0],C.h[1],{pause:700,kind:"hook"});next();item(pv(D.idea.hi),pv(D.idea.en),{pause:350});item(C.i[0],C.i[1],{pause:1000,kind:"idea"})}
 const labelWalk=(numbered)=>{const L=numbered?window.__va2d.info().marks:les.labels;if(!L||!L.length)return;next();item(numbered?"अब चित्र के हर भाग को क्रम से पहचानते हैं।":pv(D.parts.hi),numbered?"Let us identify each part of the picture in order.":pv(D.parts.en),{pause:450});
  const cap=numbered?L.length:Math.min(L.length,9);
  for(let i=0;i<cap;i++){const l=L[i],on=numbered?()=>window.__va2d.select(i):()=>hl3(i),off=numbered?()=>window.__va2d.clear():clear3;
   const hi=l.hi||"",en=l.en||"";next();
   if(m==="both"){item((numbered?"नंबर "+(i+1)+": ":"")+(hi||en),(numbered?"Number "+(i+1)+": ":"")+(en||hi),{on,off,pause:420})}
   else item((numbered?"नंबर "+(i+1)+": ":"")+(hi||en),(numbered?"Number "+(i+1)+": ":"")+(en||hi),{on,off,pause:420})}
  if(!numbered&&L.length>cap){next();item("और भी कई भाग हैं। उन पर टैप करके उनका काम जानिए।","There are more parts. Tap them to learn what they do.",{pause:500})}};
 if(two&&window.__va2d.info()){const inf=window.__va2d.info();next();item("अब इस चित्र को ध्यान से देखिए।","Now look at this picture carefully.",{pause:450});
  const hi=[],en=[];String(inf.desc||"").split(/(?<=[।.])\s+/).forEach(x=>{x=x.trim();if(!x)return;(isDev(x)?hi:en).push(x)});
  next();item(hi.join(" "),en.join(" "),{pause:700,kind:"desc"});labelWalk(true)}
 else{
  const iv=les.intro;if(iv&&(iv.hi||iv.en)){next();item(pv(D.model.hi),pv(D.model.en),{pause:350});item(iv.hi,iv.en,{pause:700,kind:"intro"})}
  if(les.steps.length){const lastI=les.steps.length-1;next();item("अब इसे क़दम-दर-क़दम समझते हैं।","Now let us follow it step by step.",{pause:400});
   les.steps.forEach((s,i)=>{next();const od=D.step.hi[i]||"अगला",oe=D.step.en[i]||"Next";item(od+" चरण: "+(s.hi||s.en),oe+" step: "+(s.en||s.hi),{pause:i===lastI?700:650,on:()=>{try{A().goStep(i)}catch{}},kind:"step"})})}
  labelWalk(false)}
 les.real.forEach(r=>{next();item(pv((r.fact?D.fact:D.real).hi),pv((r.fact?D.fact:D.real).en),{pause:300});item(r.hi,r.en,{pause:800,kind:"real"})});
 next();item(pv(D.think.hi),pv(D.think.en),{pause:2600,kind:"think"});
 next();item(pv(D.close.hi),pv(D.close.en),{pause:300,kind:"close"});
 return segs}

/* highlight helpers (3D label / 2D label) */
function hl3(i){clear3();const e=[...document.querySelectorAll("#labels .lab")][i];if(e&&e.style.display!=="none"&&!e.classList.contains("sel"))e.click()}
function clear3(){document.querySelectorAll("#labels .lab.sel").forEach(e=>e.click())}

/* ------------------------------------------------------------ player engine */
let testMode=false,segs=[],idx=0,gen=0,state="idle",startKey="",startView="",navBusy=false,clip=null,timer=0,dog=0,manifest=null,silent=false;
const jit=(x,p)=>x*(1+(Math.random()*2-1)*p);
function stopSpeech(){gen++;clearTimeout(timer);clearTimeout(dog);if(HAS)try{SS.cancel()}catch{}}
function speakSeg(s,done){const g=gen,pr=prof();const finish=()=>{if(g!==gen)return;clearTimeout(dog);done()};
 const v=HAS?pickVoice(s.lang,S.gender):null;
 if(!v){silent=true;timer=setTimeout(finish,Math.max(1800,s.say.length*(s.lang==="hi"?85:65)/S.rate));return}
 const u=new SpeechSynthesisUtterance(s.say);u.voice=v;u.lang=v.lang;u.rate=Math.max(.5,Math.min(1.6,jit(pr.base[s.lang]*S.rate,.025)));u.pitch=Math.max(.3,Math.min(1.8,jit(pr.pitch,.02)));u.volume=1;
 let started=false;u.onstart=()=>{started=true};u.onend=finish;
 u.onerror=e=>{if(g!==gen)return;const er=e&&e.error;if(er==="interrupted"||er==="canceled")return;if(!started){bad.add(v.voiceURI)}clearTimeout(dog);if(!started&&!s.retried){s.retried=true;speakSeg(s,done)}else done()};
 dog=setTimeout(()=>{if(g!==gen)return;try{SS.cancel()}catch{}finish()},Math.max(5000,s.say.length*(s.lang==="hi"?150:110)/S.rate)+3000);
 setTimeout(()=>{if(g===gen)try{SS.speak(u)}catch{finish()}},30)}
function showCap(s,i){const c=$("#vtCap");if(!c)return;c.innerHTML=`<span class="vt-l">${s.lang==="hi"?"हिं":"EN"}</span> ${esc(s.disp||s.say)}`;const n=segs.reduce((a,x)=>Math.max(a,x.sec),0);$("#vtPos").textContent=(s.sec+1)+" / "+(n+1)}
function run(i){if(state!=="playing")return;if(i>=segs.length)return finished();idx=i;const s=segs[i],g=++gen;
 try{const prev=segs[i-1];if(prev&&prev.off&&prev.sec!==s.sec)prev.off()}catch{}
 try{s.on&&s.on()}catch{}showCap(s,i);
 speakSeg(s,()=>{if(g!==gen||state!=="playing")return;timer=setTimeout(()=>{if(g===gen&&state==="playing")run(i+1)},(s.pause?jit(s.pause,.2):320)*(window.__vaPS||1))})}
function secStart(sec){let i=segs.findIndex(x=>x.sec===sec);return i<0?segs.length:i}
function go(i){if(state==="idle")return;stopSpeech();state="playing";paint();run(Math.max(0,i))}
function nextSec(){go(secStart((segs[idx]||{sec:0}).sec+1))}
function prevSec(){const c=segs[idx]||{sec:0};const st=secStart(c.sec);go(idx-st>1?st:secStart(Math.max(0,c.sec-1)))}
function pause(){if(clip){clip.pause()}else{stopSpeech()}state="paused";paint()}
function resume(){state="playing";paint();if(clip)clip.play();else run(idx)}
function stop(quiet){testMode=false;stopSpeech();if(clip){try{clip.pause()}catch{}clip=null}state="idle";try{clear3();window.__va2d&&window.__va2d.clear()}catch{}paint();if(!quiet){const c=$("#vtCap");if(c)c.textContent=""}}
function finished(){stopSpeech();try{clear3();window.__va2d&&window.__va2d.clear()}catch{}
 if(testMode){testMode=false;state="idle";paint();return}
 if(S.auto){const nx=$("#pgNext");if(nx&&!nx.disabled){const k0=A().key();navBusy=true;nx.click();let n=0;const w=setInterval(()=>{if(A().key()!==k0||++n>20){clearInterval(w);navBusy=false;if(A().key()!==k0)setTimeout(()=>begin({greet:false}),1400);else{state="idle";paint()}}},150);return}}
 state="idle";paint();const c=$("#vtCap");if(c)c.textContent="✓ पूरा हुआ · Finished"}
async function loadManifest(){if(manifest)return manifest;try{const r=await fetch(new URL("voice/index.json",(document.currentScript||{}).src||new URL("assets/va-voice.js",location.href)).href,{cache:"no-cache"});manifest=r.ok?await r.json():{clips:{}}}catch{manifest={clips:{}}}return manifest}
async function findClip(key){const m=await loadManifest(),f=(m.clips||{})[key.replace("/","-")+"."+S.lang];return f?new URL("voice/"+f,new URL("assets/va-voice.js",location.href)).href:null}
async function begin(o={}){stop(true);if(!A()||!A().key)return;startKey=A().key();startView=in2d()?"2d":"3d";state="playing";paint();
 const f=await findClip(startKey).catch(()=>null);
 if(f){const a=new Audio(f);clip=a;a.onerror=()=>{clip=null;segs=buildScript(o);idx=0;if(state==="playing")run(0)};a.onended=()=>{clip=null;finished()};a.onplaying=()=>{const c=$("#vtCap");c.innerHTML='<span class="vt-l">🎧</span> असली शिक्षक की रिकॉर्ड की गई आवाज़ · Recorded teacher voice'};a.play().catch(()=>a.onerror());return}
 segs=buildScript(o);idx=0;silent=false;if(!segs.length){state="idle";paint();return}
 const need=S.lang==="en"?["en"]:S.lang==="hi"?["hi"]:["hi","en"];
 note(need.some(l=>HAS&&!pickVoice(l,S.gender))||!HAS?"no":"");run(0)}
const toggle=()=>state==="idle"?begin({greet:true}):state==="playing"?pause():resume();

/* stop when the learner moves to another topic / switches 3D-2D */
const watch=()=>{if(state==="idle"||navBusy)return;const k=A()&&A().key&&A().key();if(k!==startKey||(in2d()?"2d":"3d")!==startView){stop();const c=$("#vtCap");if(c)c.textContent=""}};setInterval(watch,300);addEventListener("hashchange",watch);

/* ------------------------------------------------------------ UI */
const css=document.createElement("style");css.textContent=`
#vtBtn{white-space:nowrap}#vtBtn.on{border-color:var(--acc);box-shadow:inset 0 0 0 1px var(--acc)}
#vtp{position:absolute;left:12px;right:12px;bottom:10px;margin:0 auto;max-width:820px;z-index:5;background:var(--glass);border:1px solid var(--bd);border-radius:14px;padding:8px 10px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 10px 34px rgba(0,0,0,.45);color:var(--ink);font-size:calc(13px*var(--fs))}
#vtp[hidden]{display:none}
#vtCap:empty{display:none}#vtCap{min-height:2.7em;max-height:4.6em;overflow:auto;line-height:1.45;padding:2px 4px 6px;font-size:calc(14.5px*var(--fs))}
#vtCap .vt-l{display:inline-block;min-width:26px;text-align:center;border-radius:6px;background:var(--acc);color:#0b1220;font-size:11px;font-weight:700;padding:0 4px;margin-right:4px;vertical-align:1px}
.vt-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.vt-row .sp{flex:1;min-width:2px}.vt-opts{display:contents}
#vtp.mob{position:fixed;left:8px;right:8px;bottom:8px;max-width:none;z-index:60}
@media (max-width:640px){#vtp:not(.cfgopen) .vt-opts{display:none}#vtCap{max-height:3.2em}}
#vtp .ib{padding:5px 10px}#vtPlay{font-weight:700;min-width:96px}#vtPos{opacity:.75;font-size:12px;padding:0 4px}
#vtCfgBox{margin-top:8px;padding-top:8px;border-top:1px dashed var(--bd);display:grid;grid-template-columns:1fr 1fr;gap:8px 14px;font-size:calc(12.5px*var(--fs))}
#vtCfgBox[hidden]{display:none}#vtCfgBox label{display:flex;flex-direction:column;gap:2px}#vtCfgBox select,#vtCfgBox input[type=range]{width:100%}
#vtCfgBox select{background:var(--glass);color:var(--ink);border:1px solid var(--bd);border-radius:8px;padding:4px 6px;font:inherit}
#vtCfgBox select option{background:#12262b;color:#e8eef2}#vtNote{grid-column:1/-1;font-size:12px;line-height:1.5;color:var(--ink);opacity:.9}
#vtNote:empty{display:none}.vt-warn{color:#ffd54f}
@media (max-width:640px){#vtCfgBox{grid-template-columns:1fr}#vtPlay{min-width:0}}`;
document.head.appendChild(css);
const btn=document.createElement("button");btn.className="ib";btn.id="vtBtn";btn.type="button";btn.title="Teacher narration · शिक्षक की आवाज़ में समझाएँ";btn.innerHTML="🎙 शिक्षक · Teacher";
const seg=bar.querySelector(".vseg");bar.insertBefore(btn,seg?seg.nextSibling:($("#tlab")||null));
const p=document.createElement("div");p.id="vtp";p.hidden=true;p.setAttribute("role","region");p.setAttribute("aria-label","Teacher narration");
p.innerHTML=`<div id="vtCap" aria-live="polite"></div>
<div class="vt-row"><button class="ib" id="vtPrev" type="button" aria-label="Previous part">⏮</button><button class="ib on" id="vtPlay" type="button">▶ सुनिए</button><button class="ib" id="vtNextB" type="button" aria-label="Next part">⏭</button><button class="ib" id="vtStop" type="button" aria-label="Stop">■</button><span id="vtPos"></span><span class="sp"></span>
<span class="vt-opts"><div class="vseg" id="vtLang" role="group" aria-label="Language"><button data-v="hi" type="button">हिंदी</button><button data-v="en" type="button">English</button><button data-v="both" type="button">दोनों</button></div>
<div class="vseg" id="vtGen" role="group" aria-label="Voice"><button data-v="m" type="button">👨‍🏫 सर</button><button data-v="f" type="button">👩‍🏫 मैडम</button></div></span>
<button class="ib" id="vtCfg" type="button" aria-label="Voice settings" aria-expanded="false">⚙</button><button class="ib" id="vtX" type="button" aria-label="Close">✕</button></div>
<div id="vtCfgBox" hidden>
<label><span>गति · Speed <b id="vtRv"></b></span><input id="vtRate" type="range" min=".6" max="1.3" step=".05"></label>
<label><span>गहराई · Depth (भारी ← → हल्की) <b id="vtPv"></b></span><input id="vtPitch" type="range" min=".5" max="1.3" step=".02"></label>
<label><span>हिंदी आवाज़ · Hindi voice</span><select id="vtVhi"></select></label>
<label><span>English voice</span><select id="vtVen"></select></label>
<label style="flex-direction:row;align-items:center;gap:8px"><input id="vtAuto" type="checkbox"><span>पूरा होने पर अगला विषय अपने-आप · Auto-play next topic</span></label>
<button class="ib" id="vtTest" type="button">🔊 आवाज़ जाँचें · Test voice</button>
<div id="vtNote"></div></div>`;
stage.appendChild(p);
const ro=window.ResizeObserver?new ResizeObserver(()=>setPanelH()):null;ro&&ro.observe(p);
const mq=window.matchMedia("(max-width:640px)");
function place(){const mob=mq.matches;p.classList.toggle("mob",mob);const host=mob?document.body:stage;if(p.parentNode!==host)host.appendChild(p)}
function setPanelH(){place();const h=p.hidden||p.classList.contains("mob")?0:p.offsetHeight+18;window.__vaPanelH=h;document.documentElement.style.setProperty("--vtp",h+"px")}
function note(kind){const n=$("#vtNote");if(!n)return;const hiOk=HAS&&pickVoice("hi",S.gender),enOk=HAS&&pickVoice("en",S.gender);let t="";
 if(!HAS)t='<span class="vt-warn">इस ब्राउज़र में आवाज़ की सुविधा नहीं है — Chrome या Edge खोलिए। केवल पाठ चल रहा है।</span>';
 else if(kind==="no"||(S.lang!=="en"&&!hiOk)){if(S.lang!=="en"&&!hiOk)t='<span class="vt-warn">इस डिवाइस में हिंदी आवाज़ नहीं मिली, इसलिए अभी केवल पाठ चल रहा है।</span><br>Windows: Settings → Time &amp; language → Speech → Add voices → Hindi. Android: Settings → Text-to-speech → Google → Hindi. Edge browser में "Madhur / Swara (Natural)" सबसे अच्छी आवाज़ें हैं।'}
 const hv=hiOk,g=S.gender;if(!t&&HAS&&hv&&gOf(hv)!==g&&gOf(hv)!=="?")t="इस डिवाइस पर हिंदी की "+(g==="m"?"पुरुष":"महिला")+" आवाज़ नहीं मिली; गहराई (pitch) बदलकर अलग आवाज़ दी जा रही है।";
 else if(!t&&HAS&&hv&&gOf(hv)==="?")t="यह आवाज़ पुरुष/महिला के रूप में पहचानी नहीं जा सकी; 'सर' पर पिच घटाकर भारी आवाज़ दी जाती है। बेहतर आवाज़ ⚙ में चुनिए।";
 n.innerHTML=t}
function paintCfg(){const fill=(sel,lang,cur)=>{const el=$(sel);if(!el)return;const vs=VOICES.filter(v=>langOf(v).startsWith(lang)).sort((a,b)=>score(b,lang,S.gender)-score(a,lang,S.gender));el.innerHTML='<option value="">अपने-आप (Auto)</option>'+vs.map(v=>`<option value="${esc(v.voiceURI)}">${esc(v.name)} · ${gOf(v)==="m"?"♂":gOf(v)==="f"?"♀":"·"}${v.localService?"":" ☁"}</option>`).join("");el.value=cur&&vs.some(v=>v.voiceURI===cur)?cur:""};
 fill("#vtVhi","hi",S.vHi);fill("#vtVen","en",S.vEn);note()}
function paint(){const pl=$("#vtPlay");if(!pl)return;pl.textContent=state==="playing"?"⏸ रोकिए":state==="paused"?"▶ जारी रखें":"▶ सुनिए";btn.classList.toggle("on",!p.hidden);B.classList.toggle("vt-open",!p.hidden);
 $("#vtLang").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===S.lang)));$("#vtGen").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===S.gender)));
 $("#vtRate").value=S.rate;$("#vtRv").textContent=S.rate.toFixed(2)+"×";const pv=S.gender==="m"?S.pm:S.pf;$("#vtPitch").value=pv;$("#vtPv").textContent=pv.toFixed(2);$("#vtAuto").checked=S.auto;setPanelH()}
const open=()=>{p.hidden=false;paint();if(state==="idle")begin({greet:true})};
const close=()=>{stop();p.hidden=true;paint()};
btn.onclick=()=>p.hidden?open():close();
$("#vtPlay").onclick=toggle;$("#vtNextB").onclick=nextSec;$("#vtPrev").onclick=prevSec;$("#vtStop").onclick=()=>{stop()};$("#vtX").onclick=close;
$("#vtCfg").onclick=()=>{const b=$("#vtCfgBox");b.hidden=!b.hidden;p.classList.toggle("cfgopen",!b.hidden);$("#vtCfg").setAttribute("aria-expanded",String(!b.hidden));paintCfg();setPanelH()};
const restartIf=()=>{save();paint();paintCfg();if(state==="playing"||state==="paused"){const c=segs[idx]||{sec:0};const wasSec=c.sec;stopSpeech();segs=buildScript({greet:false});idx=0;state="playing";paint();go(secStart(Math.min(wasSec,Math.max(...segs.map(x=>x.sec)))))}};
$("#vtLang").onclick=e=>{const b=e.target.closest("button[data-v]");if(b){S.lang=b.dataset.v;restartIf()}};
$("#vtGen").onclick=e=>{const b=e.target.closest("button[data-v]");if(b){S.gender=b.dataset.v;S.vHi=S.vEn="";restartIf()}};
$("#vtRate").oninput=e=>{S.rate=+e.target.value;save();paint()};
$("#vtPitch").oninput=e=>{if(S.gender==="m")S.pm=+e.target.value;else S.pf=+e.target.value;save();paint()};
$("#vtVhi").onchange=e=>{S.vHi=e.target.value;save();note()};$("#vtVen").onchange=e=>{S.vEn=e.target.value;save();note()};
$("#vtAuto").onchange=e=>{S.auto=e.target.checked;save()};
$("#vtTest").onclick=()=>{if(!HAS)return;stop(true);testMode=true;state="playing";const mk=(l,t)=>({sec:0,lang:l,disp:t,say:t,pause:300});segs=[];if(S.lang!=="en")segs.push(mk("hi","यह मेरी आवाज़ है। ध्यान से सुनिए, और आगे का पाठ समझिए।"));if(S.lang!=="hi")segs.push(mk("en","This is how I will sound. Please listen carefully."));idx=0;paint();run(0)};
addEventListener("resize",setPanelH);addEventListener("pagehide",()=>{try{SS&&SS.cancel()}catch{}});
paint();paintCfg();
window.__vaVoice={script:buildScript,normalize,start:begin,stop,toggle,state:()=>({state,idx,total:segs.length,silent,lang:S.lang,gender:S.gender}),voices:()=>VOICES.map(v=>v.name),setLang:v=>{S.lang=v;save();paint()},setGender:v=>{S.gender=v;save();paint()},open,close,segs:()=>segs,pick:pickVoice};
})();
