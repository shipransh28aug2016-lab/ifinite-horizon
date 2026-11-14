/* Vigyan Atlas — Cinematic mode (stage 1: live 3D tour).
   One tap turns any guided lesson into a presentation: side panels and toolbars hide, letterbox bars appear, the lesson plays itself step by step
   (camera flights + captions), with a large lower-third caption and a progress bar. Works on every topic that has steps. Esc / ✕ exits.
   Stage 2 (planned): pre-rendered video / 360° turntable clips per topic, declared in public/cinema/<chapter>/<topic>/manifest.json. */
(()=>{"use strict";
const $=s=>document.querySelector(s),B=document.body,A=()=>window.__atlas;
const stage=$("#stage"),bar=$("#stagebar");if(!stage||!bar)return;
const LS={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
const css=document.createElement("style");css.textContent=`
#cineBtn{flex-shrink:0}
#cine{position:absolute;inset:0;z-index:6;pointer-events:none;display:none}
body.cine #cine{display:block}
#cine .lb{position:absolute;left:0;right:0;height:9%;background:#050a14;transition:height .5s}
#cine .lb.t{top:0}#cine .lb.b{bottom:0}
#cine .prog{position:absolute;left:0;bottom:0;height:4px;background:linear-gradient(90deg,#60a5fa,#a78bfa);width:0;transition:width .5s;z-index:2}
#cine .ctl{position:absolute;right:14px;top:calc(9% + 10px);display:flex;gap:8px;pointer-events:auto;z-index:3}
#cine .ctl button{border:1px solid rgba(255,255,255,.35);background:rgba(8,14,30,.72);color:#fff;border-radius:999px;min-width:44px;height:44px;padding:0 14px;font:700 15px system-ui,sans-serif;cursor:pointer}
#cine .ctl button:hover{background:rgba(29,78,216,.9)}
#cine .ttl{position:absolute;left:5%;top:calc(9% + 14px);color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.6);font:700 15px system-ui,sans-serif;letter-spacing:.4px;opacity:.9;max-width:55%}
#cine .ttl small{display:block;font-weight:500;opacity:.8;margin-top:2px}
#cine .end{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(5,10,20,.55);pointer-events:auto;z-index:3}
#cine.ended .end{display:flex}
#cine .end div{background:#fff;color:#0b1b3a;border-radius:16px;padding:22px 28px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5)}
#cine .end b{display:block;font-size:20px;margin-bottom:12px}
#cine .end button{margin:4px;border:0;border-radius:10px;background:#1d4ed8;color:#fff;font:700 15px system-ui,sans-serif;padding:11px 20px;cursor:pointer}
#cine .end button.s{background:#e7efff;color:#1d4ed8}
#cine .cap{position:absolute;left:5%;right:5%;bottom:calc(9% + 18px);display:none;background:linear-gradient(180deg,rgba(5,10,20,.62),rgba(5,10,20,.82));color:#fff;border-radius:14px;padding:14px 22px;font:500 calc(19px*var(--fs))/1.5 system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.5)}
#cine .cap .hi{display:block;color:#ffd9a8;margin-top:4px;font-size:.92em}
#cine.explore .cap{display:block}
#cine.nostep #cPrev,#cine.nostep #cNext,#cine.nostep #cPlay{display:none}
body.cine-nolab #labels,body.cine-nolab #leaders{display:none!important}
/* big lower-third caption: restyle the existing step caption while cinema is on */
body.cine #stagebar,body.cine #edgeL,body.cine #edgeR,body.cine #fpsm,body.cine #perfBar,body.cine #thome,body.cine #crumb{display:none!important}
body.cine #hud{left:5%!important;right:5%!important;bottom:calc(9% + 18px)!important;max-width:none!important;width:auto!important;font-size:calc(19px*var(--fs))!important;line-height:1.5;background:linear-gradient(180deg,rgba(5,10,20,.62),rgba(5,10,20,.82))!important;color:#fff!important;border:0!important;border-radius:14px!important;padding:14px 22px!important;box-shadow:0 10px 40px rgba(0,0,0,.5)!important}
body.cine #hud *{color:#fff!important}body.cine #hud b{color:#ffd54f!important}
body.cine #hud span[style*="9fb3cf"]{display:none}
body.cine #labels .lab{transform-origin:left top}
@media (max-width:700px){#cine .ttl{display:none}body.cine #hud{font-size:calc(15px*var(--fs))!important}}
@media print{#cine,#cineBtn{display:none}}`;
document.head.appendChild(css);
const btn=document.createElement("button");btn.type="button";btn.className="ib";btn.id="cineBtn";btn.textContent="🎬 Cinema";btn.title="Play this lesson as a cinematic presentation (C)";
bar.insertBefore(btn,$("#tlab")||null);
const el=document.createElement("div");el.id="cine";
el.innerHTML=`<div class="lb t"></div><div class="lb b"></div><div class="ttl"><span id="cineT"></span><small id="cineS"></small></div>
<div class="ctl"><button type="button" id="cPrev" title="Previous step (←)">◀</button><button type="button" id="cPlay" title="Pause / play (Space)">❚❚</button><button type="button" id="cNext" title="Next step (→)">▶</button><button type="button" id="cLab" title="Show / hide labels (L)">🏷</button><button type="button" id="cX" title="Exit (Esc)">✕</button></div>
<div class="cap" id="cineCap"></div><div class="prog"></div>
<div class="end"><div><b>Lesson complete · पाठ पूर्ण</b><button type="button" id="cAgain">↺ Replay · दोबारा</button><button type="button" id="cExit" class="s">Exit · बाहर</button></div></div>`;
stage.appendChild(el);
const prog=el.querySelector(".prog"),cT=$("#cineT"),cS=$("#cineS"),cPlay=$("#cPlay");
let on=false,prevHide=null,timer=null,wasFull=false;
const playBtn=()=>document.getElementById("play");
const state=()=>{const t=(playBtn()||{}).textContent||"";return/Again|↺/.test(t)?"ended":/Pause|❚/.test(t)?"playing":"paused"};
const stepNo=()=>{const t=($("#stepno")||{}).textContent||"";const m=t.match(/(\d+)\s*(?:\/|of)\s*(\d+)/);return m?[+m[1],+m[2]]:null};
function tick(){if(!on)return;const exp=B.classList.contains("explore");el.classList.toggle("explore",exp);el.classList.toggle("nostep",exp);
 if(exp){const hud=$("#hud"),hasHud=hud&&!hud.hidden&&(hud.textContent||"").trim();const ip=$("#intro");const cap=$("#cineCap");
  if(hasHud)el.classList.remove("explore");else if(ip){const ps=[...ip.querySelectorAll("p,div,span")].filter(x=>x.children.length===0&&x.textContent.trim());const en=ps.find(x=>!x.classList.contains("hi")&&!x.closest(".hi")),hi=ps.find(x=>x.classList.contains("hi")||x.closest(".hi"));
   cap.innerHTML=(en?"<div>"+en.textContent+"</div>":"")+(hi?'<span class="hi" lang="hi">'+hi.textContent+"</span>":"")}
  prog.style.width="0";cPlay.textContent="";const tl0=$("#ttl .en"),th0=$("#ttl .hi");cT.textContent=(tl0?tl0.textContent:"")+(th0&&th0.textContent?" · "+th0.textContent:"");cS.textContent="Live model · drag to rotate";return}
 const st=state();el.classList.toggle("ended",st==="ended");cPlay.textContent=st==="playing"?"❚❚":"▶";
 const s=stepNo();if(s)prog.style.width=Math.round(s[0]/s[1]*100)+"%";else prog.style.width=st==="ended"?"100%":"0";
 const tl=$("#ttl .en"),th=$("#ttl .hi");cT.textContent=(tl?tl.textContent:"")+(th&&th.textContent?" · "+th.textContent:"");cS.textContent=s?"Step "+s[0]+" / "+s[1]:""}
function enter(){if(on)return;if(!$("#play")||!$("#steps")||!$("#steps").children.length&&!$("#play").offsetParent&&!document.body.classList.contains("explore")){}
 on=true;B.classList.add("cine");B.classList.add("cine-nolab");try{A()&&A().hide&&A().hide(true,true)}catch{}
 try{if(document.documentElement.requestFullscreen&&!document.fullscreenElement){document.documentElement.requestFullscreen().then(()=>{wasFull=true}).catch(()=>{})}}catch{}
 window.dispatchEvent(new Event("resize"));
 if(!B.classList.contains("explore")){try{A().send("REPLAY",void 0,"playback")}catch{}}
 timer=setInterval(tick,300);tick()}
function exit(){if(!on)return;on=false;B.classList.remove("cine","cine-nolab");clearInterval(timer);try{A().send("PAUSE",void 0,"playback")}catch{}
 try{A()&&A().hide&&A().hide(false,false)}catch{}
 try{if(wasFull&&document.fullscreenElement)document.exitFullscreen()}catch{}wasFull=false;el.classList.remove("ended");window.dispatchEvent(new Event("resize"))}
btn.onclick=()=>on?exit():enter();
$("#cX").onclick=$("#cExit").onclick=exit;$("#cLab").onclick=()=>B.classList.toggle("cine-nolab");
$("#cAgain").onclick=()=>{try{A().send("REPLAY",void 0,"playback")}catch{}el.classList.remove("ended")};
cPlay.onclick=()=>{try{A().send("TOGGLE",void 0,"playback")}catch{}setTimeout(tick,50)};
$("#cNext").onclick=()=>{const n=$("#next");n&&n.click();setTimeout(tick,80)};
$("#cPrev").onclick=()=>{const n=$("#prev");n&&n.click();setTimeout(tick,80)};
addEventListener("keydown",e=>{if(e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName||""))return;
 if(on&&e.key==="Escape"){exit();return}
 if(on&&(e.key==="l"||e.key==="L")){$("#cLab").click()}
 else if(e.key==="c"||e.key==="C"){on?exit():enter()}
 else if(on&&e.key===" "){e.preventDefault();cPlay.click()}});
document.addEventListener("fullscreenchange",()=>{if(on&&!document.fullscreenElement&&wasFull){wasFull=false}});
window.__vaCinema={enter,exit,active:()=>on};
})();
