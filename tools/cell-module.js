/* ===== Custom model set 1: Eukaryotic cell — detailed 3D =====
   Fully procedural, hand-modelled geometry (no imported mesh): parametric surfaces for the membrane, nuclear envelope with pores, mitochondria with cristae,
   rough ER sheets with ribosomes, Golgi stack, lysosomes, vesicles, centrioles and microtubules. Source for the block injected by tools/inject-anatomy.py.
   Proportions are artistic but follow textbook organisation; sizes are NOT to scale and the protein-traffic particles are schematic (stated on screen). */
(function(){
const PI=Math.PI,TAU=PI*2,sin=Math.sin,cos=Math.cos,min=Math.min,max=Math.max,lerp=(a,b,t)=>a+(b-a)*t,cl=(v,a,b)=>max(a,min(b,v));
const Q_=(k,l)=>{cf[k]=l};
const lb=(id,en,hi,p,o={})=>({id,en,hi,at:typeof p==="function"?p:()=>p,...o});
const note=(en,hi,a,b)=>Rt(en,hi,`${a}<br><span class="hi" lang="hi">${b}</span>`);
/* deterministic noise */
let sd=7;const R=()=>(sd=(sd*16807)%2147483647)/2147483647;
const h3=(x,y,z)=>{const s=sin(x*127.1+y*311.7+z*74.7)*43758.5453;return s-Math.floor(s)};
const sm=t=>t*t*(3-2*t);
const vn=(x,y,z)=>{const X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z),a=sm(x-X),b=sm(y-Y),d=sm(z-Z),L=(p,q,t)=>p+(q-p)*t;
 return L(L(L(h3(X,Y,Z),h3(X+1,Y,Z),a),L(h3(X,Y+1,Z),h3(X+1,Y+1,Z),a),b),L(L(h3(X,Y,Z+1),h3(X+1,Y,Z+1),a),L(h3(X,Y+1,Z+1),h3(X+1,Y+1,Z+1),a),b),d)};
const fbm=(x,y,z)=>vn(x,y,z)*.6+vn(x*2.1,y*2.1,z*2.1)*.28+vn(x*4.3,y*4.3,z*4.3)*.12;
/* parametric surface builder: f(u,v)->[x,y,z] */
function param(nu,nv,f){const P=new Float32Array((nu+1)*(nv+1)*3),I=[];
 for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){const p=f(i/nu,j/nv),k=(i*(nv+1)+j)*3;P[k]=p[0];P[k+1]=p[1];P[k+2]=p[2]}
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=i*(nv+1)+j,b=a+nv+1;I.push(a,b,a+1,b,b+1,a+1)}
 const g=new zt;g.setAttribute("position",new dn(P,3));g.setIndex(I);g.computeVertexNormals();return g}
const sph=(r,amp=0,fr=1.2,sx=1,sy=1,sz=1,nu=48,nv=64,seed=0)=>param(nu,nv,(u,v)=>{const th=u*PI,ph=v*TAU,x=sin(th)*cos(ph),y=cos(th),z=sin(th)*sin(ph),k=1+amp*(fbm(x*fr+seed,y*fr,z*fr)-.5);return[x*r*k*sx,y*r*k*sy,z*r*k*sz]});
/* tube along points (parallel-transport frame) */
function tube(pts,r,seg=10,rf=null){const cur=new It(pts),N=Math.max(8,pts.length*8),Pp=cur.getPoints(N);let T,Nn=c(0,1,0);const frames=[];
 for(let i=0;i<=N;i++){T=(i<N?Pp[i+1].clone().sub(Pp[i]):Pp[i].clone().sub(Pp[i-1])).normalize();const B=T.clone().cross(Nn);if(B.lengthSq()<1e-6)Nn=c(1,0,0).cross(T).normalize();else{Nn=B.cross(T).normalize()}frames.push([Nn.clone(),T.clone().cross(Nn).normalize()])}
 return param(N,seg,(u,v)=>{const i=Math.round(u*N),p=Pp[i],f=frames[i],a=v*TAU,rr=(rf?rf(u):1)*r;return[p.x+rr*(cos(a)*f[0].x+sin(a)*f[1].x),p.y+rr*(cos(a)*f[0].y+sin(a)*f[1].y),p.z+rr*(cos(a)*f[0].z+sin(a)*f[1].z)]})}
/* cap of a sphere (curved cisterna), centred on direction d, half-angle a, radius r */
function cap(r,a,fl=.25,wob=.02,seed=0){return param(24,48,(u,v)=>{const th=u*a*(1+fl*u*u),ph=v*TAU,k=r*(1+wob*(fbm(u*3+seed,v*3,seed)-.5)+(u>.82?.05*(u-.82)/.18:0));return[sin(th)*cos(ph)*k,cos(th)*k-r,sin(th)*sin(ph)*k]})}
/* cell body */
const MAT=(col,o={})=>Me(col,{roughness:.4,clearcoat:.6,clearcoatRoughness:.25,sheen:.4,sheenColor:new we(0xffffff),side:vt,transparent:!0,opacity:1,emissive:0x000000,bumpMap:$t,bumpScale:.12,envMapIntensity:1.2,...o});
const KINDS={
 mem:["Plasma membrane","कोशिका झिल्ली","Phospholipid bilayer with proteins. Selectively permeable: it decides what enters and leaves the cell.","प्रोटीन युक्त फ़ॉस्फ़ोलिपिड द्विस्तर; वरणात्मक पारगम्य — तय करती है कि क्या अंदर आए, क्या बाहर जाए।"],
 nuc:["Nucleus","केंद्रक","Control room: holds DNA as chromatin and is wrapped in a double envelope with pores.","नियंत्रण कक्ष: DNA को क्रोमैटिन के रूप में रखता है; दोहरी झिल्ली व छिद्रों से घिरा।"],
 nucleolus:["Nucleolus","केंद्रिका","Dense spot inside the nucleus where ribosomes are made.","केंद्रक के भीतर घना बिंदु जहाँ राइबोसोम बनते हैं।"],
 chromatin:["Chromatin (DNA)","क्रोमैटिन (DNA)","Long DNA threads packed with proteins; they condense into chromosomes when the cell divides.","प्रोटीन से लिपटे लंबे DNA धागे; कोशिका विभाजन के समय गुणसूत्र बन जाते हैं।"],
 mit:["Mitochondrion","माइटोकॉन्ड्रिया","Double-membrane organelle; the folded inner membrane (cristae) is the site of ATP production — the powerhouse.","दोहरी झिल्ली; मुड़ी भीतरी झिल्ली (क्रिस्टी) पर ATP बनता है — ऊर्जा-गृह।"],
 rer:["Rough ER","खुरदरी अंतःप्रद्रव्यी जालिका","Flattened sacs studded with ribosomes; makes proteins for export and for the membrane.","राइबोसोम लगी चपटी थैलियाँ; निर्यात व झिल्ली के लिए प्रोटीन बनाती हैं।"],
 ser:["Smooth ER","चिकनी अंतःप्रद्रव्यी जालिका","Tubular network without ribosomes; makes lipids and detoxifies.","राइबोसोम-रहित नलिकाकार जाल; लिपिड बनाता और विषहरण करता है।"],
 rib:["Ribosomes","राइबोसोम","Tiny protein factories — free in the cytoplasm or attached to the rough ER.","सूक्ष्म प्रोटीन-कारखाने — कोशिकाद्रव्य में मुक्त या खुरदरी ER पर लगे।"],
 golgi:["Golgi apparatus","गॉल्जी उपकरण","Stack of flat sacs that modifies, sorts and packs proteins into vesicles.","चपटी थैलियों का ढेर; प्रोटीन को संशोधित, छाँटकर पुटिकाओं में पैक करता है।"],
 ves:["Vesicle","पुटिका","Small membrane bag that carries material between organelles and to the membrane.","छोटी झिल्लीदार थैली जो पदार्थ को अंगकों के बीच व झिल्ली तक ले जाती है।"],
 lys:["Lysosome","लाइसोसोम","Bag of digestive enzymes that breaks down worn-out parts and germs — the 'suicide bag'.","पाचक एंज़ाइमों की थैली; घिसे भागों व रोगाणुओं को तोड़ती है — 'आत्मघाती थैली'।"],
 cen:["Centrioles","तारककाय","A pair of barrel-shaped structures (9 triplets of microtubules) that organise the spindle in cell division.","बैरल-आकार की जोड़ी (सूक्ष्मनलिकाओं के 9 त्रिक) जो कोशिका विभाजन में तर्कु बनाती है।"],
 mt:["Microtubules","सूक्ष्मनलिकाएँ","Hollow protein tubes of the cytoskeleton: give shape, and act as tracks for transport.","कंकाल-तंत्र की खोखली प्रोटीन नलिकाएँ: आकार देती हैं और परिवहन की पटरियाँ हैं।"],
 vac:["Vacuole","रिक्तिका","Storage sac for water, nutrients and wastes.","जल, पोषक तत्व व अपशिष्ट का भंडार।"]};
const ST=[
["1","A eukaryotic cell","एक यूकैरियोटिक कोशिका","A cell is the basic unit of life. This is an animal cell, wrapped in a thin, flexible plasma membrane. Everything you will see is hidden inside.","कोशिका जीवन की मूल इकाई है। यह पशु कोशिका है, जो पतली लचीली कोशिका झिल्ली से घिरी है; सब कुछ भीतर छिपा है।","Artistic model",8],
["2","Cut open: the nucleus","काटकर देखें: केंद्रक","The nucleus is the control room. A double envelope with pores guards the DNA; the dark spot is the nucleolus, where ribosomes are made.","केंद्रक नियंत्रण कक्ष है: दोहरी झिल्ली व छिद्र DNA की रक्षा करते हैं; गहरा बिंदु केंद्रिका है जहाँ राइबोसोम बनते हैं।","Artistic model",9],
["3","Mitochondria: the powerhouse","माइटोकॉन्ड्रिया: ऊर्जा-गृह","Each mitochondrion has an outer membrane and a folded inner membrane (cristae). Respiration here releases energy as ATP.","प्रत्येक माइटोकॉन्ड्रिया में बाहरी झिल्ली व मुड़ी भीतरी झिल्ली (क्रिस्टी) होती है; श्वसन से यहाँ ATP के रूप में ऊर्जा मिलती है।","Artistic model (shape simplified)",9],
["4","Rough ER and ribosomes","खुरदरी ER व राइबोसोम","Flattened sacs of rough ER, dotted with ribosomes, wrap around the nucleus. Ribosomes build proteins.","खुरदरी ER की चपटी थैलियाँ केंद्रक के चारों ओर होती हैं, राइबोसोम उन पर लगे हैं और प्रोटीन बनाते हैं।","Artistic model",9],
["5","Golgi and protein traffic","गॉल्जी व प्रोटीन का परिवहन","Proteins travel in vesicles from the ER to the Golgi, are modified and packed, then sent to the membrane or out of the cell (exocytosis).","प्रोटीन पुटिकाओं में ER से गॉल्जी तक जाते हैं, वहाँ संशोधित व पैक होकर झिल्ली तक या कोशिका से बाहर (बहिःस्राव) जाते हैं।","Animated (schematic path)",11],
["6","Lysosomes and vacuoles","लाइसोसोम व रिक्तिकाएँ","Lysosomes digest worn-out parts and germs; small vacuoles store water and wastes. Together they keep the cell clean.","लाइसोसोम घिसे भागों व रोगाणुओं को पचाते हैं, छोटी रिक्तिकाएँ जल व अपशिष्ट रखती हैं; दोनों मिलकर कोशिका साफ़ रखते हैं।","Artistic model",8],
["7","Cytoskeleton and centrioles","कंकाल-तंत्र व तारककाय","Microtubules radiate from the centrioles and act as the cell's scaffolding and transport tracks; they also form the spindle in division.","सूक्ष्मनलिकाएँ तारककाय से निकलकर कोशिका का ढाँचा व परिवहन-पटरियाँ बनाती हैं; विभाजन में तर्कु भी बनाती हैं।","Artistic model",9]];
function Mcell3d(){
 sd=7;const n=new Ne;Ge(n,{key:1.9});Je(n,-4.6,13,.1);Vt.localClippingEnabled=!0;
 const g=new J;n.add(g);const org=[],M={};const mats=[];
 const add=(id,geo,mat,p=[0,0,0],o={})=>{const m=new N(geo,mat);m.position.set(p[0],p[1],p[2]);if(o.rot)m.rotation.set(...o.rot);if(o.scl)m.scale.set(...o.scl);m.userData.part=id;m.castShadow=!o.ns;m.frustumCulled=!1;(o.parent||g).add(m);org.push({m,id,mat});return m};
 const NUC=[-.5,.35,0];
 /* --- plasma membrane: bumpy translucent shell, front slice cut away --- */
 const plane=new Zt(c(0,0,-1),99);const memMat=MAT(0xf3c9b8,{opacity:.28,roughness:.18,clearcoat:1,clearcoatRoughness:.1,transmission:.35,thickness:.6,ior:1.3,depthWrite:!1,bumpScale:.25});memMat.clippingPlanes=[plane];
 const mem=add("mem",sph(4.3,.07,1.1,1.12,.95,1,64,96),memMat,[0,0,0],{ns:1});
 const inner=add("mem",sph(4.17,.05,1.1,1.12,.95,1,48,72),MAT(0xe8a5a0,{opacity:.1,depthWrite:!1,bumpScale:.1}),[0,0,0],{ns:1});inner.material.clippingPlanes=[plane];
 /* --- nucleus --- */
 const nuc=new J;nuc.position.set(...NUC);g.add(nuc);
 const envMat=MAT(0x8d92e6,{opacity:.55,roughness:.3,clearcoat:.8,emissive:0x1b2160,emissiveIntensity:.25,bumpScale:.2});
 add("nuc",sph(1.35,.05,1.6,1,1,1,56,80),envMat,[0,0,0],{parent:nuc,ns:1});
 add("nuc",sph(1.42,.04,1.6,1,1,1,40,64,3),MAT(0xa4a9f0,{opacity:.22,depthWrite:!1,bumpScale:.1}),[0,0,0],{parent:nuc,ns:1});
 /* pores */
 const NPO=70,pores=new Wn(new it(.045,8,6),new bt({color:0x2a2f9a}),NPO);const m4=new gt;pores.frustumCulled=!1;
 for(let i=0;i<NPO;i++){const y=1-(i+.5)/NPO*2,r=Math.sqrt(1-y*y),a=i*2.399963,p=[cos(a)*r*1.4,y*1.4,sin(a)*r*1.4];m4.makeScale(1,1,.5);m4.setPosition(p[0],p[1],p[2]);pores.setMatrixAt(i,m4)}nuc.add(pores);
 /* chromatin: coiled strands */
 const chrMat=MAT(0xf08a6a,{roughness:.5,clearcoat:.4,opacity:.95,emissive:0x5a1a08,emissiveIntensity:.2});
 for(let k=0;k<7;k++){const pts=[];const cx=(R()-.5)*.7,cy=(R()-.5)*.7,cz=(R()-.5)*.7;for(let i=0;i<14;i++){const a=i/13*TAU*2.3+k,rr=.3+.28*R();pts.push(c(cx+cos(a*1.7+k)*rr,cy+sin(a*1.3)*rr,cz+sin(a*1.7+k)*rr))}add("chromatin",tube(pts,.045,8),chrMat,[0,0,0],{parent:nuc,ns:1})}
 add("nucleolus",sph(.36,.12,3,1,1,1,24,32,5),MAT(0x5b2f86,{roughness:.6,clearcoat:.2,opacity:1,emissive:0x1d0a33,emissiveIntensity:.3,bumpScale:.35}),[.35,-.1,.25],{parent:nuc});
 /* --- mitochondria --- */
 const mitOuter=MAT(0xf0a24a,{opacity:.34,roughness:.2,clearcoat:1,transmission:.3,thickness:.3,depthWrite:!1,emissive:0x4a2000,emissiveIntensity:.15});
 const mitInner=MAT(0xd9732b,{roughness:.45,clearcoat:.5,opacity:1,emissive:0x5a2200,emissiveIntensity:.25,bumpScale:.25});
 const cristae=(L,Rr)=>param(48,56,(u,v)=>{const th=u*PI,ph=v*TAU,x=cos(th),rad=sin(th),f=.78+.22*cos(x*12*PI*.5)*0+(-.34*Math.pow(Math.abs(sin(x*7.5)),1.4)*rad),yy=sin(ph),zz=cos(ph);return[x*L,rad*yy*Rr*(.8+f*.2)*(1-.28*Math.pow(Math.abs(sin(x*7.5+yy*.8)),1.6)),rad*zz*Rr*(.8+f*.2)*(1-.28*Math.pow(Math.abs(sin(x*7.5+zz*.8)),1.6))]});
 const mits=[];[[2.2,-.9,1.3,.3,.8,-.3],[-2.6,-1.5,1.4,.1,-.5,.4],[1.1,2.1,-1.4,.5,.2,.9],[-1.9,1.9,-1.8,-.4,1,-.2],[2.9,.4,-.9,.2,-.2,.1],[.1,-2.3,-1.4,.7,.1,.5],[-3.0,-.2,.2,.3,.4,-.4]].forEach((p,i)=>{const mg=new J;mg.position.set(p[0],p[1],p[2]);mg.rotation.set(p[3],p[4],p[5]);g.add(mg);
  add("mit",sph(1,0,1,.95,.5,.5,32,48),mitOuter,[0,0,0],{parent:mg,ns:1,scl:[1.0,1,1]});add("mit",cristae(.84,.41),mitInner,[0,0,0],{parent:mg,ns:1});mits.push(mg)});
 /* --- rough ER: curved sheets hugging the nucleus + ribosomes --- */
 const erMat=MAT(0xe08fb4,{opacity:.88,roughness:.45,clearcoat:.5,bumpScale:.2,emissive:0x40122a,emissiveIntensity:.12});const rib=[];
 const sheets=[[1.75,.9,[.8,.2,.6]],[1.95,.85,[.7,.3,.2]],[2.15,.82,[-.2,.9,.5]],[1.75,.8,[.2,-.9,.5]],[1.95,.7,[.5,-.7,-.6]],[2.15,.8,[-.8,.1,-.7]]];
 sheets.forEach(([r,a,d],i)=>{const dir=c(...d).normalize();const gr=new J;gr.position.set(...NUC);g.add(gr);const geo=param(30,56,(u,v)=>{const th=u*a*(1+.25*u*u),ph=v*TAU,k=r*(1+.025*(fbm(u*4+i,v*4,i)-.5)*2);return[sin(th)*cos(ph)*k,cos(th)*k,sin(th)*sin(ph)*k]});
  const e=add("rer",geo,erMat,[0,0,0],{parent:gr,ns:1});gr.quaternion.setFromUnitVectors(c(0,1,0),dir);
  for(let k=0;k<60;k++){const u=Math.sqrt(R())*.98,v=R(),th=u*a*(1+.25*u*u),ph=v*TAU,kk=r*1.012;rib.push([gr,sin(th)*cos(ph)*kk,cos(th)*kk,sin(th)*sin(ph)*kk])}});
 const NR=rib.length,ribos=new Wn(new it(.03,8,6),new bt({color:0x1f6f7d}),NR);ribos.frustumCulled=!1;g.add(ribos);
 const ribM=new gt;const setRib=()=>{rib.forEach((r,i)=>{const v=c(r[1],r[2],r[3]).applyQuaternion(r[0].quaternion).add(r[0].position);ribM.makeScale(1,1,1);ribM.setPosition(v.x,v.y,v.z);ribos.setMatrixAt(i,ribM)});ribos.instanceMatrix.needsUpdate=!0};setRib();
 /* smooth ER tubules */
 const serMat=MAT(0xf2a3c4,{opacity:.9,roughness:.4,emissive:0x40122a,emissiveIntensity:.1});
 for(let k=0;k<4;k++){const pts=[];const a0=k*1.6+.4;for(let i=0;i<9;i++){const a=a0+i*.4,rr=2.4+.35*sin(i*1.7+k);pts.push(c(NUC[0]+cos(a)*rr,NUC[1]+(i-4)*.28*(k%2?1:-1),NUC[2]+sin(a)*rr*.9))}add("ser",tube(pts,.055,8),serMat,[0,0,0],{ns:1})}
 /* --- Golgi --- */
 const GP=[2.0,-.2,1.7],golgiMat=MAT(0xf2c64a,{opacity:.95,roughness:.35,clearcoat:.6,emissive:0x5a4000,emissiveIntensity:.2,bumpScale:.15});const gg=new J;gg.position.set(...GP);gg.rotation.set(.3,.6,-.2);g.add(gg);
 for(let i=0;i<6;i++){const m=add("golgi",cap(1.1-.07*i,.62+.04*i,.5,.04,i*3),golgiMat,[0,i*.19-.45,0],{parent:gg,ns:1});m.rotation.x=PI}
 const vesMat=MAT(0xf7d58a,{opacity:.85,roughness:.25,clearcoat:.9,emissive:0x4a3000,emissiveIntensity:.15});
 for(let i=0;i<7;i++){const a=i/7*TAU;add("ves",sph(.11+.05*R(),.05,3,1,1,1,14,18),vesMat,[cos(a)*1.0,-.5+R()*1.0,sin(a)*1.0],{parent:gg,ns:1})}
 /* --- lysosomes, vacuoles --- */
 const lysMat=MAT(0xc94f58,{opacity:.9,roughness:.3,clearcoat:.8,emissive:0x40080c,emissiveIntensity:.2,bumpScale:.3});
 [[-2.2,2.2,.9],[.2,2.9,1.3],[3.2,-1.8,.3],[-1.2,-2.6,1.0],[1.4,-1.6,2.4]].forEach(p=>{add("lys",sph(.3,.06,2.5,1,1,1,24,32,p[0]),lysMat,p);for(let k=0;k<6;k++)add("lys",sph(.045,0,1,1,1,1,8,10),new bt({color:0x3a0a10}),[p[0]+(R()-.5)*.3,p[1]+(R()-.5)*.3,p[2]+(R()-.5)*.3],{ns:1})});
 const vacMat=MAT(0xa5d3f0,{opacity:.4,roughness:.1,clearcoat:1,transmission:.5,thickness:.4,depthWrite:!1,bumpScale:.05});
 [[2.8,2.0,1.0,.45],[-3.0,.8,1.6,.38],[-.6,-1.6,2.8,.34]].forEach(p=>add("vac",sph(p[3],.05,2,1,1,1,24,32,p[0]),vacMat,p,{ns:1}));
 /* --- centrioles + microtubules --- */
 const CP=[-.2,.2,-2.2];const cenMat=MAT(0xb6e08a,{roughness:.4,opacity:1,emissive:0x1f3a08,emissiveIntensity:.2});const cg=new J;cg.position.set(...CP);g.add(cg);
 const barrel=()=>{const gr=new J;for(let k=0;k<9;k++){const a=k/9*TAU;const m=new N(tube([c(cos(a)*.17,-.3,sin(a)*.17),c(cos(a)*.17,.3,sin(a)*.17)],.04,8),cenMat);m.userData.part="cen";m.frustumCulled=!1;gr.add(m);org.push({m,id:"cen",mat:cenMat})}return gr};
 const c1=barrel();c1.position.set(0,0,0);cg.add(c1);const c2=barrel();c2.position.set(.4,0,.15);c2.rotation.z=PI/2;cg.add(c2);
 const mtMat=MAT(0x8fd4a6,{opacity:.65,roughness:.4,depthWrite:!1,emissive:0x0f3a22,emissiveIntensity:.15});
 for(let k=0;k<34;k++){const dir=c(R()-.5,R()-.5,(R()-.5)*1.4).normalize(),len=2.6+R()*1.2,pts=[];for(let i=0;i<8;i++){const q=i/7;pts.push(c(CP[0]+dir.x*len*q+(R()-.5)*.15*q,CP[1]+dir.y*len*q+(R()-.5)*.15*q,CP[2]+dir.z*len*q+(R()-.5)*.15*q))}add("mt",tube(pts,.022,6),mtMat,[0,0,0],{ns:1})}
 /* --- free ribosomes + traffic particles --- */
 const NF=80,fr=new Wn(new it(.026,6,5),new bt({color:0x2e7d8a}),NF);fr.frustumCulled=!1;g.add(fr);
 for(let i=0;i<NF;i++){const p=c(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(2.2+R()*1.4);p.x*=1.1;p.y*=.9;ribM.makeScale(1,1,1);ribM.setPosition(p.x,p.y,p.z);fr.setMatrixAt(i,ribM)}
 const NT=24,tr=new Wn(new it(.075,10,8),new bt({color:0xffe27a}),NT);tr.frustumCulled=!1;g.add(tr);
 const path=new It([c(NUC[0]+1.7,NUC[1]-.2,NUC[2]+.9),c(1.2,-.1,1.4),c(GP[0]-.2,GP[1]+.1,GP[2]-.1),c(GP[0]+.6,GP[1],GP[2]+.6),c(3.0,-.2,2.6),c(4.3,-.2,3.0)]).getPoints(60);
 /* animation + labels */
 const cams=[[c(0,2,16),c(0,0,0)],[c(-1.6,1.4,7.2),c(-.5,.3,0)],[c(4.4,.6,6.4),c(1.7,-.3,0)],[c(-.5,1.4,6.6),c(-.5,.3,0)],[c(3.6,.8,6.2),c(1.5,-.1,.5)],[c(0,-1.2,8),c(0,-.6,.6)],[c(-.4,.2,5),c(-.2,.2,-1.6)]];
 const camK=["Whole cell","Nucleus","Mitochondria","ER","Golgi","Lysosomes","Skeleton"];
 let lastS=-1,lastT=0,sel=null,allLab=0,iso=0,cut=1;const hl=new Set();
 const fly=i=>window.__atlas.fly(cams[i][0].toArray(),cams[i][1].toArray(),1.4);
 const show={mem:[1,1,1,1,1,1,1],nuc:[0,1,1,1,1,1,1],nucleolus:[0,1,0,0,0,0,0],chromatin:[0,1,0,0,0,0,0],mit:[0,0,1,0,0,0,0],rer:[0,0,0,1,1,0,0],ser:[0,0,0,1,1,0,0],golgi:[0,0,0,0,1,0,0],ves:[0,0,0,0,1,0,0],lys:[0,0,0,0,0,1,0],vac:[0,0,0,0,0,1,0],cen:[0,0,0,0,0,0,1],mt:[0,0,0,0,0,0,1]};
 const base={mem:.28,nuc:.55,nucleolus:1,chromatin:.95,mit:.34,rer:.88,ser:.9,golgi:.95,ves:.85,lys:.9,vac:.4,cen:1,mt:.65};
 const W=id=>()=>{const o=org.find(q=>q.id===id);return o.m.getWorldPosition(c())};
 const labels=[["c-mem","Plasma membrane","कोशिका झिल्ली",()=>c(4.3,.8,.9),[0,1]],["c-nuc","Nucleus","केंद्रक",()=>g.localToWorld(c(NUC[0]+1.3,NUC[1]+.9,NUC[2]+.2)),[1,3]],["c-nl","Nucleolus","केंद्रिका",()=>g.localToWorld(c(NUC[0]+.35,NUC[1]-.1,NUC[2]+.25)),[1]],["c-ch","Chromatin (DNA)","क्रोमैटिन (DNA)",()=>g.localToWorld(c(NUC[0]-.3,NUC[1]+.2,NUC[2]+.2)),[1]],["c-np","Nuclear pores","केंद्रक छिद्र",()=>g.localToWorld(c(NUC[0]-1.0,NUC[1]+.95,NUC[2]+.6)),[1]],
  ["c-mi","Mitochondrion (cristae inside)","माइटोकॉन्ड्रिया (भीतर क्रिस्टी)",()=>g.localToWorld(c(2.2,-.9,1.3)),[2]],["c-mi2","ATP: energy released here","ATP: यहाँ ऊर्जा मुक्त",()=>g.localToWorld(c(-2.6,-1.5,1.4)),[2]],
  ["c-er","Rough ER (with ribosomes)","खुरदरी ER (राइबोसोम सहित)",()=>g.localToWorld(c(NUC[0]+1.2,NUC[1]+1.5,NUC[2]+1.2)),[3,4]],["c-rb","Ribosomes","राइबोसोम",()=>g.localToWorld(c(NUC[0]+1.9,NUC[1]+.5,NUC[2]+.7)),[3]],["c-se","Smooth ER","चिकनी ER",()=>g.localToWorld(c(NUC[0]+2.4,NUC[1]+.4,NUC[2]+.4)),[3]],
  ["c-go","Golgi apparatus","गॉल्जी उपकरण",()=>g.localToWorld(c(GP[0],GP[1]+.2,GP[2])),[4]],["c-ve","Vesicles carry proteins","पुटिकाएँ प्रोटीन ले जाती हैं",()=>g.localToWorld(c(GP[0]+1.0,GP[1]-.1,GP[2])),[4]],["c-ex","Exocytosis (out of the cell)","बहिःस्राव (कोशिका से बाहर)",()=>c(4.3,-.2,3.0),[4]],
  ["c-ly","Lysosome (digestion)","लाइसोसोम (पाचन)",()=>g.localToWorld(c(-2.2,2.2,.9)),[5]],["c-va","Vacuole (storage)","रिक्तिका (भंडारण)",()=>g.localToWorld(c(2.8,2.0,1.0)),[5]],
  ["c-ce","Centrioles","तारककाय",()=>g.localToWorld(c(CP[0]+.2,CP[1],CP[2])),[6]],["c-mt","Microtubules","सूक्ष्मनलिकाएँ",()=>g.localToWorld(c(CP[0]+1.6,CP[1]+.6,CP[2]+1.2)),[6]]].map(([id,en,hi,p,st])=>lb(id,en,hi,p,{steps:{includes:i=>allLab||st.includes(i),length:1,find:()=>st[0]},up:!0}));
 const tools=[...cams.map((q,i)=>({label:"📷 "+camK[i],group:"cam",on:i===0,act:()=>fly(i)})),{label:"✂ Cut-away membrane",on:!0,toggle:()=>(cut=cut?0:1,!!cut)},{label:"Isolate selected",toggle:()=>(iso=iso?0:1,!!iso)},{label:"All labels",toggle:()=>(allLab=allLab?0:1,!!allLab)}];
 return{scene:n,view:{pos:cams[0][0],target:cams[0][1]},labels,pickables:org.map(o=>o.m),tools,
  steps:ST.map(s=>({dur:s[6],en:`${s[0]} · ${s[1]} — ${s[3]}`,hi:`${s[2]} — ${s[4]}`})),
  predict:{q:"Which organelle releases energy (ATP) from food?",opts:[["Nucleus",!1,"The nucleus stores DNA and controls the cell."],["Mitochondrion",!0,"Correct — its folded inner membrane (cristae) makes ATP."],["Golgi apparatus",!1,"The Golgi sorts and packs proteins."]]},
  onPick(o){const id=o.userData.part,i=KINDS[id];if(i)note(i[0],i[1],i[2],i[3]);sel=id;hl.clear();hl.add(id)},
  apply(s,k,t){const dt=min(.1,max(0,t-lastT));lastT=t;if(s!==lastS){lastS=s;fly(s)}
   g.rotation.y=sin(t*.12)*.18;plane.constant=s===0||!cut?99:.9;
   mits.forEach((m,i)=>{m.position.y+=sin(t*.9+i)*.0015;m.rotation.z+=sin(t*.5+i)*.0008});
   for(let i=0;i<NT;i++){if(s!==4){ribM.makeScale(0,0,0)}else{const f=((i/NT)+t*.07)%1,p=path[Math.min(59,Math.floor(f*59))];ribM.makeScale(1,1,1);ribM.setPosition(p.x,p.y,p.z)}tr.setMatrixAt(i,ribM)}tr.instanceMatrix.needsUpdate=!0;
   for(const o of org){let a=base[o.id]*(show[o.id][s]?1:.07);if(o.id==="mem"&&s>=1)a=.14;if(s===0)a=o.id==="mem"?.2:o.id==="nuc"?.0:.0;if(iso&&sel&&o.id!==sel)a=min(a,.05);const m=o.mat;if(m.opacity!==undefined){m.opacity=a;m.transparent=a<.999;m.depthWrite=a>.6}
    const on=show[o.id]&&show[o.id][s]&&s>0,h=(on?.12+.06*sin(t*3):0)+(hl.has(o.id)?.2:0);if(m.emissive&&o.id!=="mem"){m.userData.e0=m.userData.e0??m.emissiveIntensity;m.emissiveIntensity=m.userData.e0+h}}
   pores.visible=s===1;ribos.visible=s>=3&&s<=4;fr.visible=s>=3&&s<=4;tr.visible=s===4;
   const i=ST[s];$e(`<b>${i[0]} · ${i[1]}</b> <span style="color:var(--hi)">/ ${i[2]}</span><br><span style="color:#ffd36b">${i[5]}</span> · ${i[3]}<br><span style="color:#9fb3cf;font-size:.82em">Hand-modelled procedural geometry (no imported mesh). Sizes are not to scale; protein-traffic particles are schematic.</span>`)}}}
Q_("ix1/cell3d",[["Which organelle is called the powerhouse of the cell?","कोशिका का ऊर्जा-गृह किसे कहते हैं?",["Nucleus","Mitochondrion","Golgi apparatus","Lysosome"],1,"It releases energy as ATP."],["Ribosomes attached to the ER make…","ER से लगे राइबोसोम क्या बनाते हैं?",["Lipids","Proteins","Starch","DNA"],1,"Ribosomes are protein factories."],["Which organelle packs proteins into vesicles?","कौन-सा अंगक प्रोटीन को पुटिकाओं में पैक करता है?",["Golgi apparatus","Nucleolus","Vacuole","Centriole"],0,"Golgi modifies, sorts and packs."],["Digestive enzymes are stored in…","पाचक एंज़ाइम कहाँ रहते हैं?",["Lysosomes","Ribosomes","Centrioles","Nucleus"],0,"Lysosomes digest worn-out parts."]]);
Px["ix1/cell3d"]=[["Muscle cells have many mitochondria because they need a lot of energy.","पेशी कोशिकाओं में अधिक माइटोकॉन्ड्रिया होते हैं क्योंकि उन्हें अधिक ऊर्जा चाहिए।"],["Cells that make hormones or enzymes (like in the pancreas) have a lot of rough ER and Golgi.","हार्मोन या एंज़ाइम बनाने वाली कोशिकाओं (जैसे अग्न्याशय) में खुरदरी ER व गॉल्जी अधिक होते हैं।"]];
{const L=Hj.find(h=>h.kp==="ix1").topics,i=L.findIndex(x=>x.id==="cell");L.splice(i<0?L.length:i+1,0,{id:"cell3d",title:"Animal cell — detailed 3D",hi:"पशु कोशिका — विस्तृत 3D",build:Mcell3d,ncert:"Class IX · cell as the unit of life"})}
})();
