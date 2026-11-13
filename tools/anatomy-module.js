/* ===== Realistic anatomy topics (eye, elbow joint, lungs) =====
   Source for the block injected into index.html by tools/inject-anatomy.py (it lives inside the engine scope: needs Ne, Ge, Je, Me, N, zt, dn, J, c, we, Wn, it, gt, bt, Zt, vt, Hi, Hj, X9, Se, Rt, $e, cf, Px, Vt).
   Meshes: BodyParts3D (DBCLS, CC BY-SA 2.1 JP) via Z-Anatomy (CC BY-SA 4.0), simplified + Draco-compressed (modified). Packs built by tools/build-pack.mjs.
   Procedural parts (light rays, alveoli clusters, gas particles, muscle shortening, forearm swing) are schematic and are labelled as such on screen. */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,min=Math.min,max=Math.max,rnd=Math.random,lerp=(a,b,t)=>a+(b-a)*t,cl=(v,a,b)=>max(a,min(b,v));
const Q_=(k,l)=>{cf[k]=l};
const lb=(id,en,hi,p,o={})=>({id,en,hi,at:typeof p==="function"?p:()=>p,...o});
const note=(en,hi,a,b)=>Rt(en,hi,`${a}<br><span class="hi" lang="hi">${b}</span>`);
const V=a=>c(a[0],a[1],a[2]);
const bbox=a=>{const mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let i=0;i<a.length;i+=3)for(let k=0;k<3;k++){mn[k]=min(mn[k],a[i+k]);mx[k]=max(mx[k],a[i+k])}return{mn,mx,c:V([(mn[0]+mx[0])/2,(mn[1]+mx[1])/2,(mn[2]+mx[2])/2])}};
function bar(show,p,txt){let el=document.getElementById("assetBar");if(!el){el=document.createElement("div");el.id="assetBar";el.setAttribute("role","status");el.innerHTML='<div class="ab-t"></div><div class="ab-p"><i></i></div>';document.getElementById("stage").appendChild(el)}
 el.hidden=!show;if(show){el.querySelector(".ab-t").textContent=txt;el.querySelector("i").style.width=Math.round(cl(p,0,1)*100)+"%"}}
function loadPack(D,key,dir){if(D.state==="loading"||D.state==="ready")return;D.state="loading";D.err="";
 const here=()=>Se&&Se.__tp&&Se.__tp.key===key;
 if(location.protocol==="file:"){D.state="failed";D.err="3D assets need the page to be served over http(s); a file:// copy uses the built-in model";if(here())Rt("Using the built-in model","बिल्ट-इन मॉडल का उपयोग",D.err);return}
 const file=(typeof ts!=="undefined"&&ts.level>=2)?dir+".glb":dir+"_lo.glb";bar(true,0,"Loading realistic anatomy… · यथार्थ मॉडल लोड हो रहा है…");
 import(new URL("assets/va-assets.js",document.baseURI).href).then(m=>m.loadMeshes(dir+"/"+file,{onProgress:f=>bar(true,f,"Loading realistic anatomy… "+Math.round(f*100)+" %")}))
 .then(r=>{D.data=r;D.state="ready";bar(false);if(here())window.__atlas.rebuild(key)})
 .catch(e=>{D.state="failed";D.err=String(e&&e.message||e);bar(false);console.warn("[atlas] realistic model unavailable:",key,D.err);
  if(here())Rt("Using the built-in model","बिल्ट-इन मॉडल का उपयोग","The detailed anatomy could not be loaded ("+D.err.slice(0,120)+"). The simpler model is shown instead.")})}
const CREDIT='Anatomy © BodyParts3D (DBCLS, CC BY-SA 2.1 JP) · Z-Anatomy (CC BY-SA 4.0), simplified.';
/* generic factory: cfg = {key,slot,dir,scale,c,floor,fallback,style(id),info,kind(id),skip(id),group(id),pivot,cam,stageCam,steps,op(id,s,ctx),labels,tools,predict,frame(ctx,s,t),extra(ctx),clip}
   returns a topic builder that falls back to the old schematic scene until the meshes are ready. */
function factory(cfg){const D=(X9.ds[cfg.slot]=X9.ds[cfg.slot]||{state:"idle",data:null,err:""});
 return function(){
  if(D.state!=="ready"){loadPack(D,cfg.key,cfg.dir);return cfg.fallback()}
  const d=D.data.parts,S=cfg.scale,n=new Ne;Ge(n);Je(n,cfg.floor,12,.1);Vt.localClippingEnabled=!0;
  const root=new J;root.scale.setScalar(S);root.position.set(-cfg.c[0]*S,-cfg.c[1]*S,-cfg.c[2]*S);n.add(root);
  const toW=v=>v.clone().multiplyScalar(S).add(root.position);const plane=new Zt(c(-1,0,0),0);
  const M={},Mt={},BB={},G={},pick=[];
  for(const id in d){if(cfg.skip&&cfg.skip(id))continue;const p=d[id];BB[id]=bbox(p.position);
   const g=new zt;g.setAttribute("position",new dn(p.position,3));p.normal&&g.setAttribute("normal",new dn(new Float32Array(p.normal),3));p.index&&g.setIndex(new dn(p.index,1));
   const st=cfg.style(id);const mat=Me(st.color,{roughness:st.rough??.45,clearcoat:st.clear??.5,clearcoatRoughness:st.cr??.3,bumpMap:st.bump===0?null:$t,bumpScale:st.bump??.2,sheen:st.sheen??.3,sheenColor:new we(st.sheenC??0xffdddd),side:vt,transparent:!0,opacity:st.op??1,emissive:0x000000,metalness:st.metal??0,transmission:st.trans??0,ior:st.ior??1.45,thickness:st.th??0,envMapIntensity:st.env??1.1});
   const m=new N(g,mat);m.userData.part=id;m.frustumCulled=!1;m.castShadow=!st.noShadow;
   const gk=cfg.group&&cfg.group(id);if(gk){if(!G[gk]){const gr=new J,pv=cfg.pivot[gk]||[0,0,0];gr.position.set(pv[0],pv[1],pv[2]);root.add(gr);G[gk]=gr;gr.userData.pv=pv}const pv=G[gk].userData.pv;m.position.set(-pv[0],-pv[1],-pv[2]);G[gk].add(m)}else root.add(m);
   M[id]=m;Mt[id]=mat;pick.push(m)}
  const wp=id=>M[id].localToWorld(BB[id].c.clone());
  const ctx={d,M,Mt,BB,G,root,n,toW,wp,plane,S,sel:null,hl:new Set(),trans:0,isolate:0,allLab:0,cut:0};
  const ex=cfg.extra?cfg.extra(ctx):{};Object.assign(ctx,ex);
  const fly=k=>window.__atlas.fly(cfg.cam[k][0].toArray(),cfg.cam[k][1].toArray(),1.3);
  const ST=cfg.steps;let lastS=-1,lastT=0;
  const labels=cfg.labels(ctx).map(([id,en,hi,part,st])=>lb(id,en,hi,()=>ctx.allLab||st.includes(lastS)?(part.call?part():wp(part)):c(1e6,1e6,1e6),{steps:{includes:i=>ctx.allLab||st.includes(i),length:1,find:()=>st[0]},up:!0}));
  const tools=[...Object.keys(cfg.cam).map((k,i)=>({label:"📷 "+cfg.camNames[k],group:"cam",on:i===0,act:()=>fly(k)})),
   {label:"Transparent organs",toggle:()=>(ctx.trans=ctx.trans?0:1,!!ctx.trans)},{label:"Isolate selected",toggle:()=>(ctx.isolate=ctx.isolate?0:1,!!ctx.isolate)},...(cfg.clipIds?[{label:"✂ Cut-away",toggle:()=>(ctx.cut=ctx.cut?0:1,!!ctx.cut)}]:[]),...(cfg.tools?cfg.tools(ctx):[]),{label:"All labels",toggle:()=>(ctx.allLab=ctx.allLab?0:1,!!ctx.allLab)}];
  return{scene:n,view:{pos:cfg.cam[Object.keys(cfg.cam)[0]][0],target:cfg.cam[Object.keys(cfg.cam)[0]][1]},labels,pickables:pick,tools,
   steps:ST.map(s=>({dur:s[6],en:`${s[0]} · ${s[1]} — ${s[3]}`,hi:`${s[2]} — ${s[4]}`})),predict:cfg.predict,
   onPick(o){const id=o.userData.part,k=cfg.kind(id),i=cfg.info[id]||cfg.info[k];if(i)note(i[0],i[1],i[2],i[3]);ctx.sel=id;ctx.hl.clear();ctx.hl.add(id)},
   apply(s,k,t){const dt=min(.1,max(0,t-lastT));lastT=t;if(s!==lastS){lastS=s;fly(cfg.stageCam[s])}
    cfg.frame&&cfg.frame(ctx,s,t,dt);
    for(const id in Mt){const m=Mt[id];let o=cfg.op(id,s,ctx);if(ctx.trans&&o>.2)o=min(o,.4);if(ctx.isolate&&ctx.sel&&id!==ctx.sel)o=min(o,.06);
     m.opacity=o;m.transparent=o<.999;m.depthWrite=o>.6;const act=cfg.hot?cfg.hot(id,s):0,hv=(act||ctx.hl.has(id))?.14+.07*sin(t*3):0;m.emissive.setHex(hv>0?(ctx.hl.has(id)?0x44aaff:0x3a2a2a):0);m.emissiveIntensity=hv>0?1:0;
     const clip=ctx.cut&&cfg.clipIds&&cfg.clipIds(id);m.clippingPlanes=clip?[plane]:null;m.clipShadows=!!clip}
    const i=ST[s];$e(`<b>${i[0]} · ${i[1]}</b> <span style="color:var(--hi)">/ ${i[2]}</span><br><span style="color:#ffd36b">${i[5]}</span> · ${i[3]}<br><span style="color:#9fb3cf;font-size:.82em">${CREDIT} ${cfg.credit||""}</span>`)}}}}
const topicBuild=(chapterOf,id)=>chapterOf().topics.find(t=>t.id===id).build;

/* =============================== EYE =============================== */
const EYE_INFO={
 sclera:["Sclera","श्वेतपटल","The tough white outer coat. It keeps the shape of the eyeball and protects it.","कठोर सफ़ेद बाहरी परत; नेत्रगोलक का आकार बनाए रखती और रक्षा करती है।"],
 cornea:["Cornea","कॉर्निया","Transparent front window. It bends (refracts) most of the light entering the eye.","पारदर्शी अगली खिड़की; आँख में आने वाले अधिकांश प्रकाश का अपवर्तन करती है।"],
 iris:["Iris","आइरिस (परितारिका)","Coloured muscle ring. It changes the size of the pupil: smaller in bright light, larger in dim light.","रंगीन पेशी-छल्ला; पुतली का आकार बदलता है — तेज़ प्रकाश में छोटी, मंद प्रकाश में बड़ी।"],
 lens:["Crystalline lens","नेत्र लेंस","Transparent convex lens. Ciliary muscles change its curvature so that near and far objects focus on the retina (accommodation).","पारदर्शी उत्तल लेंस; पक्ष्माभी पेशियाँ इसकी वक्रता बदलकर पास व दूर की वस्तुओं को रेटिना पर फ़ोकस करती हैं।"],
 retina:["Retina","रेटिना (दृष्टिपटल)","Light-sensitive screen at the back. Rod and cone cells form an inverted real image and send signals to the brain.","पीछे का प्रकाश-संवेदी पर्दा; शलाका व शंकु कोशिकाएँ उल्टा वास्तविक प्रतिबिंब बनाकर संकेत मस्तिष्क को भेजती हैं।"],
 vitreous:["Vitreous humour","काचाभ द्रव","Clear jelly filling the eyeball; it keeps its shape and lets light reach the retina.","नेत्रगोलक को भरने वाला पारदर्शी जेली; आकार बनाए रखता है।"],
 zonular:["Suspensory (zonular) fibres","निलंबन तंतु","Thin fibres joining the lens to the ciliary muscles; they change the lens shape when the muscles relax or contract.","लेंस को पक्ष्माभी पेशियों से जोड़ने वाले महीन तंतु।"],
 "anterior-chamber":["Aqueous humour","नेत्रोद (एक्वस ह्यूमर)","Clear watery fluid between the cornea and the lens; it nourishes the front of the eye.","कॉर्निया व लेंस के बीच का जलीय द्रव; आँख के अगले भाग को पोषण देता है।"],
 "optic-nerve":["Optic nerve","दृक् तंत्रिका","Carries electrical signals from the retina to the brain, where the image is understood.","रेटिना से विद्युत संकेत मस्तिष्क तक ले जाती है, जहाँ दृश्य समझा जाता है।"],
 muscle:["Eye muscle","नेत्र पेशी","Six small muscles around each eyeball turn it up, down, left and right.","प्रत्येक आँख के चारों ओर छह छोटी पेशियाँ उसे ऊपर-नीचे, दाएँ-बाएँ घुमाती हैं।"]};
const eyeKind=id=>/rectus|oblique/.test(id)?"muscle":id;
const EYE_ST=[
["1","The eye and its muscles","आँख और उसकी पेशियाँ","The human eye is a nearly spherical ball about 2.5 cm across. Six small muscles turn it in every direction.","मानव आँख लगभग गोलाकार, लगभग 2.5 cm व्यास की होती है; छह छोटी पेशियाँ उसे हर दिशा में घुमाती हैं।","Anatomical",7],
["2","Cornea: the front window","कॉर्निया: अगली खिड़की","Light enters through the transparent cornea. Most of the bending of light happens here. The white sclera forms the rest of the outer coat.","प्रकाश पारदर्शी कॉर्निया से प्रवेश करता है; अधिकांश अपवर्तन यहीं होता है। सफ़ेद श्वेतपटल शेष बाहरी परत बनाता है।","Anatomical",8],
["3","Iris and pupil","आइरिस और पुतली","The iris controls how much light passes through the pupil: the pupil gets smaller in bright light and larger in dim light.","आइरिस पुतली से जाने वाले प्रकाश की मात्रा नियंत्रित करता है: तेज़ प्रकाश में पुतली सिकुड़ती, मंद प्रकाश में फैलती है।","Anatomical + animated",9],
["4","Lens: fine focusing","लेंस: सूक्ष्म फ़ोकस","The convex lens focuses the light on the retina. Ciliary muscles make it thicker for near objects and thinner for distant ones (accommodation).","उत्तल लेंस प्रकाश को रेटिना पर फ़ोकस करता है। पास की वस्तु के लिए पक्ष्माभी पेशियाँ उसे मोटा और दूर की वस्तु के लिए पतला करती हैं (समंजन)।","Anatomical + animated (thickness exaggerated)",9],
["5","Retina: the image forms","रेटिना: प्रतिबिंब बनता है","A real, inverted and diminished image forms on the retina. Rods see in dim light; cones see colour in bright light.","रेटिना पर वास्तविक, उल्टा व छोटा प्रतिबिंब बनता है। शलाकाएँ मंद प्रकाश में व शंकु तेज़ प्रकाश में रंग देखते हैं।","Anatomical + rays schematic",9],
["6","Optic nerve to the brain","दृक् तंत्रिका से मस्तिष्क तक","Signals leave through the optic nerve. The brain turns the inverted image the right way up and gives us the sense of sight.","संकेत दृक् तंत्रिका से जाते हैं; मस्तिष्क उल्टे प्रतिबिंब को सीधा करके देखने की अनुभूति देता है।","Anatomical",8],
["7","Inside the eye (cut-away)","आँख के भीतर (अनुप्रस्थ काट)","Cut open the eye to see all parts together: cornea, aqueous humour, iris, lens, vitreous humour and retina.","आँख को काटकर सभी भाग एक साथ देखिए: कॉर्निया, नेत्रोद, आइरिस, लेंस, काचाभ द्रव और रेटिना।","Anatomical (cut-away)",9]];
const eyeStyle=id=>({sclera:{color:0xf4efe6,rough:.55,clear:.3,op:.9,bump:.15},cornea:{color:0xd8ecff,rough:.05,clear:1,cr:.05,op:.35,bump:0,trans:.6,th:.4,env:1.6,noShadow:1},iris:{color:0x6a4426,rough:.5,clear:.2,bump:.6,op:1},lens:{color:0xfff0b8,rough:.08,clear:1,cr:.05,op:.6,bump:0,trans:.5,th:.5,env:1.5,noShadow:1},
 retina:{color:0xcc4b34,rough:.6,clear:.15,op:1,bump:.3},vitreous:{color:0xbfe2ff,rough:.05,clear:1,op:.18,bump:0,noShadow:1},zonular:{color:0xffffff,rough:.5,clear:0,op:.8,bump:0},"anterior-chamber":{color:0xaed8ff,rough:.05,clear:1,op:.15,bump:0,noShadow:1},
 "optic-nerve":{color:0xf3e3b5,rough:.5,clear:.3,op:1,bump:.2}}[id]||{color:0xb23a3a,rough:.5,clear:.4,op:1,bump:.35,sheen:.6});
const EYE_FB=()=>topicBuild(()=>Hi.find(h=>h.no===10),"eye");
const Meye=factory({key:"ch10/eye3d",slot:"eye",dir:"eye",scale:120,c:[.0305,1.591,.0635],floor:-2.5,fallback:()=>EYE_FB()(),style:eyeStyle,info:EYE_INFO,kind:eyeKind,
 cam:{front:[c(2.2,1.2,8.2),c(0,0,0)],side:[c(8.8,1.2,1.6),c(0,0,-.4)],back:[c(-3.6,1,-8),c(0,0,0)]},camNames:{front:"Front",side:"Side",back:"Back"},
 stageCam:["front","front","front","side","side","back","side"],steps:EYE_ST,clipIds:id=>/^(sclera|cornea|vitreous|anterior-chamber)$/.test(id),
 credit:"Light rays and the pupil/lens motion are schematic.",
 op:(id,s,x)=>{const m=/rectus|oblique/.test(id);const T={sclera:[.9,.8,.5,.3,.3,.3,.9],cornea:[.35,.7,.35,.35,.3,.3,.4],iris:[.5,.5,1,.8,.6,.4,1],lens:[.5,.3,.5,1,.7,.3,1],retina:[.4,.2,.2,.4,1,.6,1],vitreous:[.12,.08,.1,.12,.2,.1,.35],zonular:[0,0,.4,1,.2,0,.9],"anterior-chamber":[.1,.15,.2,.1,.1,.08,.25],"optic-nerve":[1,.35,.35,.35,.7,1,1]};
  return m?(s===0?1:.18):T[id][s]*(id==="sclera"&&x.cut?.7:1)},
 hot:(id,s)=>({1:/^(cornea|sclera)$/,2:/^iris$/,3:/^(lens|zonular)$/,4:/^retina$/,5:/^optic/}[s]||/^$/).test(id),
 group:id=>id==="iris"?"iris":id==="lens"?"lens":null,pivot:{iris:[.0315,1.5915,.0735],lens:[.0315,1.5915,.0715]},
 extra:x=>{const NP=40,sph=new Wn(new it(.0007,8,6),new bt({color:0xffe27a}),NP);sph.frustumCulled=!1;x.root.add(sph);const m4=new gt;
  const zf=.112,zl=.0715,zr=x.BB.retina.mn[2]+.0016,cx=.0315,cy=1.5915;return{sph,m4,zf,zl,zr,cx,cy,NP}},
 frame:(x,s,t)=>{const bright=.5+.5*sin(t*.8);if(x.G.iris){const f=s===2?1.22-.5*bright:1;x.G.iris.scale.set(f,f,1)}
  if(x.G.lens){const th=s===3?1+.22*(.5+.5*sin(t*1.2)):1;x.G.lens.scale.set(1,1,th)}
  const on=s>=3&&s<=4;for(let i=0;i<x.NP;i++){if(!on){x.m4.makeScale(0,0,0);x.sph.setMatrixAt(i,x.m4);continue}
   const r=i%5,h=(r-2)*.0042,f=((i/5|0)/8+t*.35)%1;let z,y;if(f<.5){const q=f/.5;z=lerp(x.zf,x.zl,q);y=h*lerp(1,.55,q)}else{const q=(f-.5)/.5;z=lerp(x.zl,x.zr,q);y=h*.55*(1-q)}
   x.m4.makeScale(1,1,1);x.m4.setPosition(x.cx,x.cy+y,z);x.sph.setMatrixAt(i,x.m4)}x.sph.instanceMatrix.needsUpdate=!0},
 labels:x=>[["e-cornea","Cornea","कॉर्निया","cornea",[1,6]],["e-sclera","Sclera","श्वेतपटल","sclera",[0,1]],["e-iris","Iris","आइरिस","iris",[2,6]],["e-pupil","Pupil (opening in the iris)","पुतली",()=>x.toW(c(.0315,1.5915,.0735)),[2]],["e-lens","Lens","लेंस","lens",[3,6]],["e-zon","Ciliary / suspensory fibres","पक्ष्माभी / निलंबन तंतु","zonular",[3]],
  ["e-ret","Retina (image forms here)","रेटिना (प्रतिबिंब यहाँ)","retina",[4,6]],["e-vit","Vitreous humour","काचाभ द्रव","vitreous",[6]],["e-aq","Aqueous humour","नेत्रोद","anterior-chamber",[6]],["e-on","Optic nerve → brain","दृक् तंत्रिका → मस्तिष्क","optic-nerve",[5]],["e-mu","Eye muscle","नेत्र पेशी","rectus-sup",[0]]],
 predict:{q:"Which part of the eye controls how much light enters?",opts:[["Cornea",!1,"The cornea bends light but cannot change the amount entering."],["Iris",!0,"Correct — the iris changes the size of the pupil."],["Retina",!1,"The retina is the screen that detects light."]]}});
Q_("ch10/eye3d",[["Which part of the eye forms the image?","आँख का कौन-सा भाग प्रतिबिंब बनाता है?",["Cornea","Retina","Iris","Sclera"],1,"The image falls on the retina."],["What happens to the pupil in bright light?","तेज़ प्रकाश में पुतली को क्या होता है?",["It becomes smaller","It becomes larger","It stays the same","It disappears"],0,"The iris makes it smaller to protect the retina."],["The change in focal length of the eye lens is called…","नेत्र लेंस की फ़ोकस दूरी में परिवर्तन कहलाता है…",["Dispersion","Accommodation","Reflection","Scattering"],1,"Ciliary muscles change the lens curvature."]]);
Px["ch10/eye3d"]=[["Cameras work like the eye: a lens focuses light on a sensor (retina).","कैमरा आँख जैसा काम करता है: लेंस प्रकाश को सेंसर (रेटिना) पर फ़ोकस करता है।"],["Eating carrots, papaya and green leafy vegetables gives vitamin A, which keeps the retina healthy.","गाजर, पपीता और हरी सब्ज़ियों से विटामिन A मिलता है, जो रेटिना को स्वस्थ रखता है।"]];

/* ============================= ELBOW JOINT ============================= */
const JI={
 bone:["Bone","अस्थि","Bones form the rigid frame of the body. At the elbow the humerus (upper arm) meets the radius and ulna (forearm).","अस्थियाँ शरीर का कठोर ढाँचा बनाती हैं; कोहनी पर भुजा की ह्यूमरस, अग्रबाहु की रेडियस व अल्ना से मिलती है।"],
 humerus:["Humerus","प्रगंडिका (ह्यूमरस)","The bone of the upper arm; its lower end forms the elbow hinge.","ऊपरी भुजा की अस्थि; इसका निचला सिरा कोहनी का कब्ज़ा बनाता है।"],
 radius:["Radius","बहिःप्रकोष्ठिका (रेडियस)","Forearm bone on the thumb side.","अँगूठे की ओर की अग्रबाहु अस्थि।"],ulna:["Ulna","अंतःप्रकोष्ठिका (अल्ना)","Forearm bone on the little-finger side; its hook-shaped top (olecranon) fits the humerus like a hinge.","छोटी उँगली की ओर की अस्थि; इसका हुकनुमा ऊपरी सिरा ह्यूमरस में कब्ज़े की तरह बैठता है।"],
 scapula:["Shoulder blade","स्कंधास्थि","Flat triangular bone at the back of the shoulder; a ball-and-socket joint forms with the humerus.","कंधे के पीछे की चपटी त्रिकोणाकार अस्थि; ह्यूमरस के साथ गेंद-गड्ढा संधि बनाती है।"],clavicle:["Collar bone","जत्रुक","Links the shoulder to the breastbone.","कंधे को उरोस्थि से जोड़ती है।"],
 biceps:["Biceps","द्विशिर पेशी","Flexor on the front of the arm. When it contracts (shortens) the forearm bends up.","भुजा के आगे की आकुंचक पेशी; सिकुड़ने पर अग्रबाहु ऊपर मुड़ती है।"],
 triceps:["Triceps","त्रिशिर पेशी","Extensor on the back of the arm. When it contracts the forearm straightens.","भुजा के पीछे की प्रसारक पेशी; सिकुड़ने पर अग्रबाहु सीधी होती है।"],brachialis:["Brachialis","प्रगंडिका पेशी","Deep flexor that helps the biceps bend the elbow.","द्विशिर की सहायक गहरी आकुंचक पेशी।"],
 capsule:["Joint capsule","संधि कैप्सूल","A tough sleeve around the joint that holds synovial fluid and keeps the bones together.","संधि के चारों ओर की मज़बूत थैली जिसमें साइनोवियल द्रव होता है।"],ligament:["Ligament","स्नायु (लिगामेंट)","Strong fibrous band that joins bone to bone and stabilises the joint.","अस्थि को अस्थि से जोड़ने वाला मज़बूत रेशेदार पट्ट।"]};
const jKind=id=>/biceps/.test(id)?"biceps":/triceps/.test(id)?"triceps":/capsule/.test(id)?"capsule":/lig/.test(id)?"ligament":JI[id]?id:"bone";
const JOINT_ST=[
["1","Bones of the arm","भुजा की अस्थियाँ","The upper arm has one bone (humerus); the forearm has two (radius and ulna). They are joined at the elbow.","ऊपरी भुजा में एक अस्थि (ह्यूमरस) और अग्रबाहु में दो (रेडियस व अल्ना) होती हैं; कोहनी पर ये जुड़ती हैं।","Anatomical",7],
["2","The elbow: a hinge joint","कोहनी: कब्ज़ा संधि","At a hinge joint movement is in one plane only — like a door. A capsule and ligaments hold the bones together.","कब्ज़ा संधि में गति एक ही तल में होती है — दरवाज़े की तरह। कैप्सूल व स्नायु अस्थियों को जोड़े रखते हैं।","Anatomical",8],
["3","Muscles work in pairs","पेशियाँ जोड़ी में कार्य करती हैं","Biceps (front) and triceps (back) are an antagonistic pair: when one contracts the other relaxes. Muscles can only pull, never push.","द्विशिर (आगे) व त्रिशिर (पीछे) विरोधी जोड़ी हैं: एक सिकुड़ती है तो दूसरी शिथिल होती है। पेशियाँ केवल खींच सकती हैं, धकेल नहीं।","Anatomical",9],
["4","Bending the arm (flexion)","भुजा मोड़ना (आकुंचन)","The biceps contracts and shortens, pulling the forearm up. The triceps relaxes.","द्विशिर सिकुड़कर छोटी होती है और अग्रबाहु को ऊपर खींचती है; त्रिशिर शिथिल रहती है।","Animated (schematic: swing and muscle length)",10],
["5","Straightening the arm (extension)","भुजा सीधी करना (प्रसारण)","The triceps contracts and pulls the forearm back down; the biceps relaxes.","त्रिशिर सिकुड़कर अग्रबाहु को नीचे खींचती है; द्विशिर शिथिल होती है।","Animated (schematic)",10]];
const jStyle=id=>/capsule/.test(id)?{color:0xe8c9a0,rough:.7,clear:.1,op:.3,bump:.1,noShadow:1}:/lig/.test(id)?{color:0xf2f2ea,rough:.5,clear:.2,bump:.3,sheen:.5}:/biceps|triceps|brachialis/.test(id)?{color:0xb23838,rough:.42,clear:.5,cr:.35,bump:.5,sheen:.7,sheenC:0xff9a8a}:{color:0xeee2c4,rough:.55,clear:.15,bump:.5};
const J_FB=()=>topicBuild(()=>Hj.find(h=>h.kp==="ix2"),"joint");
const Mjoint=factory({key:"ix2/joint3d",slot:"limb",dir:"limb",scale:8.6,c:[.2,1.13,-.03],floor:-3.6,fallback:()=>J_FB()(),style:jStyle,info:JI,kind:jKind,skip:id=>/^knee|^(acl|pcl|lcl|mcl|meniscus)/.test(id),
 cam:{front:[c(0,.2,10.5),c(0,.1,0)],side:[c(10.5,.4,0),c(0,.1,0)],close:[c(4.4,-.1,5.4),c(-.1,-.45,0)]},camNames:{front:"Front",side:"Side",close:"Elbow"},stageCam:["front","close","side","side","side"],steps:JOINT_ST,
 credit:"The forearm swing and muscle shortening are a simplified model.",
 group:id=>/^(radius|ulna|annular-lig)$/.test(id)?"fore":/^(biceps|triceps)/.test(id)?id:null,
 pivot:{fore:[.215,1.088,-.026],"biceps-long":[.17,1.36,.0],"biceps-short":[.17,1.36,.0],"triceps-long":[.2,1.36,-.045],"triceps-lateral":[.22,1.36,-.045],"triceps-medial":[.2,1.36,-.045]},
 op:(id,s)=>{if(/^(radius|ulna|humerus)$/.test(id))return 1;if(/scapula|clavicle/.test(id))return s===0?1:.35;if(/capsule/.test(id))return s===1?.45:s===0?0:.12;if(/lig/.test(id))return s===1?1:s===0?0:.4;return s<2?0:/brachialis/.test(id)?.7:1},
 hot:(id,s)=>(s===1&&/capsule|lig/.test(id))||(s===3&&/biceps/.test(id))||(s===4&&/triceps/.test(id)),
 frame:(x,s,t)=>{const T=(t%10);const f=s===3?cl(T/7,0,1):s===4?1-cl(T/7,0,1):s===2?.25:s===1?.12*(.5+.5*sin(t)):0;
  if(x.G.fore)x.G.fore.rotation.x=-2.0*f;const bs=s===3?1-.16*f:s===4?1-.16*f:1-.08*f;
  for(const k in x.G)if(/^biceps/.test(k))x.G[k].scale.set(1,bs,1);else if(/^triceps/.test(k))x.G[k].scale.set(1,s===4?1-.15*(1-f):1+.08*f,1)},
 labels:x=>[["j-hum","Humerus","ह्यूमरस","humerus",[0,2]],["j-rad","Radius","रेडियस","radius",[0,1]],["j-uln","Ulna","अल्ना","ulna",[0,1]],["j-cap","Joint capsule","संधि कैप्सूल","capsule-elbow",[1]],["j-lig","Ligament","स्नायु","annular-lig",[1]],
  ["j-bic","Biceps (flexor)","द्विशिर (आकुंचक)","biceps-long",[2,3]],["j-tri","Triceps (extensor)","त्रिशिर (प्रसारक)","triceps-long",[2,4]],["j-sc","Shoulder blade","स्कंधास्थि","scapula",[0]],["j-hinge","Hinge joint (elbow)","कब्ज़ा संधि (कोहनी)",()=>x.wp("humerus").clone().setY(x.wp("radius").y+.9),[1,3,4]]],
 predict:{q:"When you bend your arm, which muscle contracts?",opts:[["Biceps",!0,"Correct — the biceps shortens and pulls the forearm up."],["Triceps",!1,"The triceps contracts to straighten the arm."],["Both equally",!1,"They work as an antagonistic pair: one contracts while the other relaxes."]]}});
Q_("ix2/joint3d",[["The elbow is an example of a…","कोहनी किसका उदाहरण है?",["Ball and socket joint","Hinge joint","Pivot joint","Fixed joint"],1,"It moves in one plane, like a door."],["Which muscle straightens the arm?","भुजा को कौन-सी पेशी सीधी करती है?",["Biceps","Triceps","Deltoid","Diaphragm"],1,"The triceps contracts in extension."],["Ligaments join…","स्नायु जोड़ते हैं…",["Muscle to bone","Bone to bone","Muscle to muscle","Skin to bone"],1,"Tendons join muscle to bone."]]);
Px["ix2/joint3d"]=[["Lifting a school bag bends your elbow — your biceps is working hard.","बैग उठाते समय कोहनी मुड़ती है — द्विशिर काम करती है।"],["Weightlifters train biceps and triceps both, because they work as a pair.","भारोत्तोलक द्विशिर व त्रिशिर दोनों का अभ्यास करते हैं क्योंकि वे जोड़ी में कार्य करती हैं।"]];

/* ============================ LUNGS & AIRWAYS ============================ */
const LI={
 lung:["Lung","फेफड़ा","Spongy organ for gas exchange. The right lung has three lobes, the left has two (the heart takes the space).","गैस विनिमय का स्पंजी अंग; दाएँ फेफड़े में तीन व बाएँ में दो पालियाँ (हृदय के लिए जगह)।"],
 trachea:["Windpipe (trachea)","श्वासनली","Cartilage-ringed tube that carries air from the throat to the lungs; the rings keep it open.","उपास्थि के छल्लों वाली नली जो वायु को गले से फेफड़ों तक ले जाती है; छल्ले इसे खुला रखते हैं।"],
 bronchus:["Bronchus","श्वसनी","The windpipe divides into two bronchi, one for each lung; they branch again and again like an upside-down tree.","श्वासनली दो श्वसनियों में बँटती है — प्रत्येक फेफड़े के लिए एक; वे उल्टे पेड़ की तरह बार-बार शाखित होती हैं।"],
 bronchiole:["Smaller air tubes (bronchioles)","श्वसनिकाएँ","Branches get narrower and end in clusters of air sacs called alveoli.","शाखाएँ पतली होती जाती हैं और वायु-कोष्ठिकाओं (एल्वियोलाई) के गुच्छों में समाप्त होती हैं।"],
 epiglottis:["Epiglottis","घांटी-ढक्कन","Flap that covers the windpipe during swallowing so food does not enter it.","निगलते समय श्वासनली को ढकने वाला ढक्कन।"],
 diaphragm:["Diaphragm","डायाफ्राम (मध्यपटल)","Dome-shaped muscle below the lungs. It flattens and moves down when we breathe in.","फेफड़ों के नीचे की गुंबदाकार पेशी; श्वास लेते समय चपटी होकर नीचे जाती है।"],
 rib:["Rib cage","पसली-पिंजर","Protects the lungs; ribs move up and out when we breathe in.","फेफड़ों की रक्षा करता है; श्वास लेते समय पसलियाँ ऊपर-बाहर जाती हैं।"],bone:["Breastbone","उरोस्थि","Flat bone in the middle of the chest where the ribs join.","छाती के बीच की चपटी अस्थि जहाँ पसलियाँ जुड़ती हैं।"]};
const lKind=id=>/^lung/.test(id)?"lung":/^br\d/.test(id)?"bronchus":/^sg/.test(id)?"bronchiole":/^rib/.test(id)?"rib":/^sternum/.test(id)?"bone":LI[id]?id:"rib";
const LUNG_ST=[
["1","The respiratory system in the chest","छाती में श्वसन तंत्र","The lungs lie on both sides of the chest, protected by the rib cage, with the diaphragm below.","फेफड़े छाती के दोनों ओर पसली-पिंजर के भीतर होते हैं; नीचे डायाफ्राम होता है।","Anatomical",7],
["2","The air passage","वायु का मार्ग","Air enters through the nose and mouth, passes the throat and the windpipe, and then splits into two bronchi.","वायु नाक व मुख से गले व श्वासनली में जाकर दो श्वसनियों में बँट जाती है।","Anatomical",8],
["3","The bronchial tree","श्वसनी-वृक्ष","Each bronchus branches into smaller and smaller tubes, like an upside-down tree, and carries air deep into every lobe.","प्रत्येक श्वसनी छोटी-छोटी नलियों में शाखित होकर हर पाली तक वायु पहुँचाती है — उल्टे पेड़ की तरह।","Anatomical",9],
["4","Lobes of the lungs","फेफड़ों की पालियाँ","The right lung has three lobes and the left lung has two. The left lung is smaller to leave room for the heart.","दाएँ फेफड़े में तीन व बाएँ में दो पालियाँ हैं; बायाँ फेफड़ा छोटा है क्योंकि हृदय को जगह चाहिए।","Anatomical (lobes coloured for clarity)",8],
["5","Alveoli: gas exchange","एल्वियोलाई: गैस विनिमय","Each bronchiole ends in a bunch of tiny air sacs (alveoli) wrapped in blood capillaries. Oxygen diffuses into the blood and carbon dioxide diffuses out.","प्रत्येक श्वसनिका सूक्ष्म वायु-कोष्ठिकाओं (एल्वियोलाई) के गुच्छे में समाप्त होती है, जिनके चारों ओर रक्त केशिकाएँ होती हैं। ऑक्सीजन रक्त में और CO₂ बाहर विसरित होती है।","Conceptual (alveoli enlarged, not to scale)",10],
["6","Breathing in and out","श्वास लेना व छोड़ना","Breathing in: the diaphragm flattens and the ribs move up and out, so the chest gets bigger and air rushes in. Breathing out: the opposite.","श्वास लेना: डायाफ्राम चपटा और पसलियाँ ऊपर-बाहर जाती हैं, छाती बड़ी होती है और वायु अंदर आती है। श्वास छोड़ना: इसका उल्टा।","Animated (schematic)",10]];
const lStyle=id=>/^lung/.test(id)?{color:{"lung-l-upper":0xe39a96,"lung-l-lower":0xd98a8a,"lung-r-upper":0xe8a39c,"lung-r-middle":0xd9948f,"lung-r-lower":0xde9090}[id]||0xe0a09a,rough:.6,clear:.3,cr:.4,sheen:.8,sheenC:0xffd0d0,bump:.4,op:.5}:/^(trachea|br\d|sg\d|epiglottis)/.test(id)?{color:0xf1e6d0,rough:.4,clear:.5,bump:.5}:id==="diaphragm"?{color:0xb64a44,rough:.55,clear:.3,bump:.3,op:.6}:{color:0xebdcbc,rough:.55,clear:.15,bump:.4};
const L_FB=()=>topicBuild(()=>Hi.find(h=>h.no===5),"alveoli");
const Mlungs=factory({key:"ch5/lungs3d",slot:"lungs",dir:"lungs",scale:14,c:[0,1.3,.01],floor:-3.6,fallback:()=>L_FB()(),style:lStyle,info:LI,kind:lKind,
 cam:{whole:[c(0,.2,9.4),c(0,-.2,0)],airway:[c(.6,1.4,6.4),c(0,1.2,0)],side:[c(8.6,.6,1.6),c(0,0,0)]},camNames:{whole:"Chest",airway:"Airways",side:"Side"},stageCam:["whole","airway","whole","whole","whole","side"],steps:LUNG_ST,
 credit:"Alveoli, gas particles and the breathing motion are schematic.",
 group:id=>id==="diaphragm"?"dia":/^rib|^sternum/.test(id)?"cage":/^lung/.test(id)?"lungs":null,pivot:{dia:[0,1.2,0],cage:[0,1.3,.0],lungs:[0,1.3,0]},
 op:(id,s)=>{const lung=/^lung/.test(id),air=/^(trachea|br\d|sg\d|epiglottis)/.test(id);if(lung)return[.45,.12,.16,.7,.28,.45][s];if(air)return s===0?.55:1;if(id==="diaphragm")return s===5?.7:s===0?.3:.1;return[.3,.05,.05,.08,.05,.55][s]},
 hot:(id,s)=>(s===1&&/^(trachea|br\d)/.test(id))||(s===2&&/^(br|sg)\d/.test(id)),
 extra:x=>{const sg=Object.keys(x.BB).filter(k=>/^sg\d/.test(k)),carina=[0,1.25,.0],cl_=[];
  sg.forEach(k=>{const a=x.d[k].position;let best=0,bd=-1;for(let i=0;i<a.length;i+=3){const q=(a[i]-carina[0])**2+(a[i+1]-carina[1])**2+(a[i+2]-carina[2])**2;if(q>bd){bd=q;best=i}}cl_.push([a[best],a[best+1],a[best+2]])});
  const per=7,NA=cl_.length*per,al=new Wn(new it(.0042,10,8),new bt({color:0xff9aa8}),NA);al.frustumCulled=!1;x.root.add(al);const m4=new gt,off=[];
  for(let i=0;i<NA;i++){const o=[(rnd()-.5)*.016,(rnd()-.5)*.016,(rnd()-.5)*.016,.6+rnd()*.6];off.push(o)}
  const NG=cl_.length*3,gas=new Wn(new it(.0016,8,6),new bt({color:0xffffff}),NG);gas.frustumCulled=!1;x.root.add(gas);const col=new we;for(let i=0;i<NG;i++)gas.setColorAt(i,col.setHex(i%2?0x4f6bff:0xe43b3b));
  return{cl_,per,NA,al,off,m4,NG,gas,col}},
 frame:(x,s,t)=>{const br=.5-.5*cos(t*1.25),act=s===5?br:0;
  if(x.G.dia)x.G.dia.position.y=1.2-.02*act;if(x.G.cage){x.G.cage.scale.set(1+.035*act,1+.02*act,1+.05*act)}if(x.G.lungs)x.G.lungs.scale.set(1+.04*act,1+.05*act,1+.06*act);
  for(let i=0;i<x.NA;i++){const k=i/x.per|0,o=x.off[i],p=x.cl_[k],on=s===4,sc=on?o[3]*(1+.08*sin(t*2+i)):0;x.m4.makeScale(sc,sc,sc);x.m4.setPosition(p[0]+o[0],p[1]+o[1]-.004,p[2]+o[2]);x.al.setMatrixAt(i,x.m4)}x.al.instanceMatrix.needsUpdate=!0;
  for(let i=0;i<x.NG;i++){const k=i/3|0,p=x.cl_[k],f=((i*.37+t*.4)%1),on=s===4,out=i%2;const sc=on?1:0;x.m4.makeScale(sc,sc,sc);
   const dir=out?f:1-f;x.m4.setPosition(p[0]+(rnd()*0)+.003*sin(t*3+i)+.012*(dir-.5),p[1]+.012*(dir-.5)+.006*cos(t*2+i),p[2]+.012*(dir-.5));x.gas.setMatrixAt(i,x.m4)}x.gas.instanceMatrix.needsUpdate=!0},
 labels:x=>[["l-tr","Windpipe (trachea)","श्वासनली","trachea",[1]],["l-br","Bronchus","श्वसनी","br0",[1,2]],["l-bn","Bronchioles (smaller tubes)","श्वसनिकाएँ","sg7",[2]],["l-rl","Right lung (3 lobes)","दायाँ फेफड़ा (3 पालियाँ)","lung-r-upper",[0,3]],["l-ll","Left lung (2 lobes)","बायाँ फेफड़ा (2 पालियाँ)","lung-l-upper",[0,3]],
  ["l-ep","Epiglottis","घांटी-ढक्कन","epiglottis",[1]],["l-al","Alveoli (air sacs)","एल्वियोलाई (वायु-कोष्ठिकाएँ)",()=>x.toW(V(x.cl_[4])),[4]],["l-o2","O₂ in → blood, CO₂ out (conceptual)","O₂ अंदर → रक्त, CO₂ बाहर",()=>x.toW(V(x.cl_[9])),[4]],["l-di","Diaphragm","डायाफ्राम","diaphragm",[0,5]],["l-ri","Rib cage","पसली-पिंजर","rib-5-r",[0,5]]],
 predict:{q:"When you breathe in, what does the diaphragm do?",opts:[["Moves up",!1,"That happens when you breathe out."],["Flattens and moves down",!0,"Correct — the chest becomes bigger, so air rushes in."],["Stays still",!1,"The diaphragm is the main breathing muscle."]]}});
Q_("ch5/lungs3d",[["Where does gas exchange take place in the lungs?","फेफड़ों में गैस विनिमय कहाँ होता है?",["Trachea","Bronchi","Alveoli","Diaphragm"],2,"Alveoli have thin walls and many capillaries."],["How many lobes does the right lung have?","दाएँ फेफड़े में कितनी पालियाँ होती हैं?",["Two","Three","Four","One"],1,"The left lung has two lobes."],["Which muscle helps in breathing?","श्वसन में कौन-सी पेशी सहायक है?",["Biceps","Diaphragm","Triceps","Deltoid"],1,"The diaphragm flattens when we breathe in."]]);
Px["ch5/lungs3d"]=[["Your lungs hold about 5–6 litres of air; you breathe about 15–18 times a minute at rest.","फेफड़ों में लगभग 5–6 लीटर वायु आती है; विश्राम में लगभग 15–18 बार प्रति मिनट श्वास लेते हैं।"],["Smoke and dust damage the tiny alveoli — never smoke, and cover your face in dust.","धुआँ व धूल सूक्ष्म एल्वियोलाई को नुकसान पहुँचाते हैं।"]];

/* register topics next to their classic versions */
const addAfter=(list,afterId,t)=>{const i=list.findIndex(x=>x.id===afterId);list.splice(i<0?list.length:i+1,0,t)};
addAfter(Hi.find(h=>h.no===10).topics,"eye",{id:"eye3d",title:"Human eye — realistic 3D",hi:"मानव नेत्र — यथार्थ 3D",build:Meye,ncert:"Ch 10 · the human eye"});
addAfter(Hj.find(h=>h.kp==="ix2").topics,"joint",{id:"joint3d",title:"Elbow joint & muscles — realistic 3D",hi:"कोहनी संधि व पेशियाँ — यथार्थ 3D",build:Mjoint,ncert:"Class IX · joints and muscles"});
addAfter(Hi.find(h=>h.no===5).topics,"alveoli",{id:"lungs3d",title:"Lungs & airways — realistic 3D",hi:"फेफड़े व वायु मार्ग — यथार्थ 3D",build:Mlungs,ncert:"Ch 5 · respiration in human beings"});
})();
