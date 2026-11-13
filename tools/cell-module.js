/* ===== Custom model sets 1-2: eukaryotic animal cell, plant cell, bacterium (detailed 3D) =====
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
/* ---------- Custom model set 2: plant cell + bacterium (reuses the helpers above) ---------- */
const KIND2={
 wall:["Cell wall","कोशिका भित्ति","Rigid layer of cellulose outside the membrane. It gives the plant cell its fixed, boxy shape and protects it. Absent in animal cells.","झिल्ली के बाहर सेलुलोज़ की कठोर परत; पादप कोशिका को निश्चित, आयताकार आकार व सुरक्षा देती है। जंतु कोशिका में नहीं होती।"],
 pd:["Plasmodesmata","जीवद्रव्य तंतु","Tiny channels through the wall that join neighbouring plant cells so that materials can pass between them.","भित्ति में सूक्ष्म नलिकाएँ जो पड़ोसी पादप कोशिकाओं को जोड़ती हैं और पदार्थों का आदान-प्रदान होने देती हैं।"],
 pvac:["Large central vacuole","बड़ी केंद्रीय रिक्तिका","Fluid-filled sac that takes up most of the cell. It stores water and wastes and its pressure (turgor) keeps the cell firm. It pushes the nucleus to the side.","तरल से भरी बड़ी थैली; जल व अपशिष्ट जमा करती है, दाब (स्फीति) से कोशिका को कड़ा रखती है और केंद्रक को किनारे धकेलती है।"],
 chl:["Chloroplast","हरितलवक","Double-membrane organelle with stacks of thylakoids (grana) holding chlorophyll. Photosynthesis makes glucose from CO₂, water and sunlight and releases O₂.","दोहरी झिल्ली वाला अंगक; क्लोरोफ़िल युक्त थायलेकॉइड के ढेर (ग्रेना)। प्रकाश-संश्लेषण में CO₂, जल व सूर्य-प्रकाश से ग्लूकोज़ बनता और O₂ निकलती है।"],
 grana:["Grana (thylakoid stacks)","ग्रेना (थायलेकॉइड ढेर)","Coin-like stacks where chlorophyll traps light energy.","सिक्कों जैसे ढेर जहाँ क्लोरोफ़िल प्रकाश-ऊर्जा सोखता है।"],
 capsule:["Capsule / slime layer","कैप्सूल / श्लेष्मा परत","Sticky outer coat that protects the bacterium and helps it stick to surfaces.","चिपचिपी बाहरी परत; जीवाणु की रक्षा करती और सतहों से चिपकाती है।"],
 bwall:["Cell wall (peptidoglycan)","कोशिका भित्ति (पेप्टिडोग्लाइकन)","Strong mesh that keeps the bacterium's shape. Many antibiotics (such as penicillin) attack it.","मज़बूत जाल जो आकार बनाए रखता है; पेनिसिलिन जैसी अनेक प्रतिजैविक औषधियाँ इसी पर वार करती हैं।"],
 bmem:["Plasma membrane","कोशिका झिल्ली","Thin membrane that controls what enters and leaves; also where bacteria make energy, since they have no mitochondria.","पतली झिल्ली जो आवागमन नियंत्रित करती है; माइटोकॉन्ड्रिया न होने से ऊर्जा भी यहीं बनती है।"],
 nucleoid:["Nucleoid (DNA)","केंद्राभ (DNA)","A single long circular DNA coiled in the cytoplasm. There is NO nuclear membrane — that is why a bacterium is a prokaryote.","कोशिकाद्रव्य में कुंडलित एक लंबा वृत्ताकार DNA; केंद्रक झिल्ली नहीं होती — इसी कारण जीवाणु प्रोकैरियोट है।"],
 plasmid:["Plasmid","प्लाज़्मिड","Small extra DNA ring. It can carry useful genes, e.g. for antibiotic resistance, and is used in genetic engineering.","छोटा अतिरिक्त DNA छल्ला; उपयोगी जीन (जैसे प्रतिजैविक-प्रतिरोध) ले जा सकता है और आनुवंशिक इंजीनियरिंग में उपयोगी है।"],
 brib:["Ribosomes","राइबोसोम","Tiny protein factories scattered freely in the cytoplasm — the only organelle a bacterium has.","कोशिकाद्रव्य में बिखरे सूक्ष्म प्रोटीन-कारखाने; जीवाणु में केवल यही अंगक है।"],
 flag:["Flagellum","कशाभिका","Whip-like tail rotated by a tiny motor at its base; it pushes the bacterium forward.","कोड़े जैसी पूँछ, जिसके आधार पर सूक्ष्म मोटर उसे घुमाती है और जीवाणु को आगे धकेलती है।"],
 pili:["Pili (fimbriae)","पिली (रोम)","Short hair-like threads used to attach to surfaces and to other cells.","छोटे बालों जैसे तंतु जो सतहों व अन्य कोशिकाओं से चिपकने में काम आते हैं।"]};
const rod=(L,r,amp=0,fr=1.4,seed=0)=>param(44,56,(u,v)=>{const t=u*PI,ph=v*TAU,x=cos(t)*(L/2+r*.55),rad=r*Math.pow(sin(t),.38),k=1+amp*(fbm(x*fr+seed,sin(ph)*fr,cos(ph)*fr)-.5);return[x,rad*sin(ph)*k,rad*cos(ph)*k]});
const sg=(a,e)=>Math.sign(a)*Math.pow(Math.abs(a),e);
const boxy=(A,B,C,e=.22,amp=0,seed=0)=>param(56,72,(u,v)=>{const th=u*PI,ph=v*TAU,x=sin(th)*cos(ph),y=cos(th),z=sin(th)*sin(ph),k=1+amp*(fbm(x*2+seed,y*2,z*2)-.5);return[sg(x,e)*A*k,sg(y,e)*B*k,sg(z,e)*C*k]});
const torus=(R_,r)=>param(36,14,(u,v)=>{const a=u*TAU,b=v*TAU;return[(R_+r*cos(b))*cos(a),r*sin(b),(R_+r*cos(b))*sin(a)]});
const cristae2=(L,Rr)=>param(40,48,(u,v)=>{const th=u*PI,ph=v*TAU,x=cos(th),rad=sin(th),yy=sin(ph),zz=cos(ph),f=1-.3*Math.pow(Math.abs(sin(x*7.5+yy*.8)),1.6);return[x*L,rad*yy*Rr*f,rad*zz*Rr*f]});
/* shared runner */
function run(C){const {n,g,org,show,base,ST,cams,camK,labels,frame,predict,plane,cutAt=.9,op}=C;let lastS=-1,lastT=0,sel=null,allLab=0,iso=0,cut=1;const hl=new Set();
 const fly=i=>window.__atlas.fly(cams[i][0].toArray(),cams[i][1].toArray(),1.4);
 const lab=labels.map(([id,en,hi,p,st])=>lb(id,en,hi,p,{steps:{includes:i=>allLab||st.includes(i),length:1,find:()=>st[0]},up:!0}));
 const tools=[...cams.map((q,i)=>({label:"📷 "+camK[i],group:"cam",on:i===0,act:()=>fly(i)})),...(plane?[{label:"✂ Cut-away",on:!0,toggle:()=>(cut=cut?0:1,!!cut)}]:[]),{label:"Isolate selected",toggle:()=>(iso=iso?0:1,!!iso)},{label:"All labels",toggle:()=>(allLab=allLab?0:1,!!allLab)}];
 return{scene:n,view:{pos:cams[0][0],target:cams[0][1]},labels:lab,pickables:org.map(o=>o.m),tools,
  steps:ST.map(s=>({dur:s[6],en:`${s[0]} · ${s[1]} — ${s[3]}`,hi:`${s[2]} — ${s[4]}`})),predict,
  onPick(o){const id=o.userData.part,i=KIND2[id]||KINDS[id];if(i)note(i[0],i[1],i[2],i[3]);sel=id;hl.clear();hl.add(id)},
  apply(s,k,t){const dt=min(.1,max(0,t-lastT));lastT=t;if(s!==lastS){lastS=s;fly(s)}
   if(plane)plane.constant=s===0||!cut?99:cutAt;frame&&frame(s,t,dt);
   for(const o of org){const sh=show[o.id];let a=(base[o.id]??1)*(sh&&sh[s]?1:.07);const q=op&&op(o.id,s,a);if(q!==undefined)a=q;if(iso&&sel&&o.id!==sel)a=min(a,.05);const m=o.mat;if(m.opacity!==undefined){m.opacity=a;m.transparent=a<.999;m.depthWrite=a>.6}
    const on=sh&&sh[s]&&s>0,h=(on?.12+.06*sin(t*3):0)+(hl.has(o.id)?.2:0);if(m.emissive){m.userData.e0=m.userData.e0??m.emissiveIntensity;m.emissiveIntensity=m.userData.e0+h}}
   const i=ST[s];$e(`<b>${i[0]} · ${i[1]}</b> <span style="color:var(--hi)">/ ${i[2]}</span><br><span style="color:#ffd36b">${i[5]}</span> · ${i[3]}<br><span style="color:#9fb3cf;font-size:.82em">Hand-modelled procedural geometry (no imported mesh). Sizes are not to scale; particles and motion are schematic.</span>`)}}}
const mkAdd=(g,org)=>(id,geo,mat,p=[0,0,0],o={})=>{const m=new N(geo,mat);m.position.set(p[0],p[1],p[2]);if(o.rot)m.rotation.set(...o.rot);if(o.scl)m.scale.set(...o.scl);m.userData.part=id;m.castShadow=!o.ns;m.frustumCulled=!1;(o.parent||g).add(m);org.push({m,id,mat});return m};
const mkParts=(n,add)=>({});
/* ============================== PLANT CELL ============================== */
const PST=[
["1","A plant cell","एक पादप कोशिका","A plant cell is boxy because of its rigid cell wall. Inside, a huge vacuole, many chloroplasts and a nucleus pushed to the side are the clues that tell it from an animal cell.","पादप कोशिका कठोर कोशिका भित्ति के कारण आयताकार होती है। भीतर विशाल रिक्तिका, अनेक हरितलवक और किनारे खिसका केंद्रक इसे जंतु कोशिका से अलग पहचान देते हैं।","Artistic model",8],
["2","Cell wall and membrane","कोशिका भित्ति व झिल्ली","Outside is the thick cellulose wall (full of tiny channels, the plasmodesmata); just inside it lies the thin plasma membrane that controls entry and exit.","बाहर मोटी सेलुलोज़ भित्ति (जिसमें सूक्ष्म जीवद्रव्य तंतु हैं); उसके ठीक भीतर पतली कोशिका झिल्ली आवागमन नियंत्रित करती है।","Artistic model",9],
["3","The large central vacuole","बड़ी केंद्रीय रिक्तिका","The vacuole stores water and wastes. When it is full, its pressure pushes against the wall and keeps the cell firm (turgid); if water is lost the plant wilts.","रिक्तिका जल व अपशिष्ट रखती है; भरी होने पर उसका दाब भित्ति पर पड़ता है और कोशिका कड़ी (स्फीत) रहती है; जल घटने पर पौधा मुरझा जाता है।","Animated (turgor pulse exaggerated)",10],
["4","Chloroplasts: making food","हरितलवक: भोजन बनाना","Chloroplasts hold chlorophyll in stacks called grana. With sunlight they turn CO₂ and water into glucose and release oxygen — photosynthesis.","हरितलवक में क्लोरोफ़िल ग्रेना के ढेरों में होता है; सूर्य-प्रकाश से CO₂ व जल ग्लूकोज़ में बदलते हैं और ऑक्सीजन निकलती है — प्रकाश-संश्लेषण।","Animated (schematic particles)",11],
["5","Nucleus, mitochondria and the rest","केंद्रक, माइटोकॉन्ड्रिया व अन्य","The nucleus is squeezed to the edge. Mitochondria still release energy by respiration, and ER and Golgi make and pack proteins, as in an animal cell.","केंद्रक किनारे दबा होता है; माइटोकॉन्ड्रिया श्वसन से ऊर्जा देते हैं, ER व गॉल्जी जंतु कोशिका की तरह प्रोटीन बनाते व पैक करते हैं।","Artistic model",9],
["6","Plant vs animal cell","पादप बनाम जंतु कोशिका","Only plant cells have a cell wall, chloroplasts and a large central vacuole. Both have a nucleus, mitochondria, ER, Golgi and a plasma membrane.","केवल पादप कोशिका में कोशिका भित्ति, हरितलवक व बड़ी रिक्तिका होती है; दोनों में केंद्रक, माइटोकॉन्ड्रिया, ER, गॉल्जी व कोशिका झिल्ली होती है।","Summary",9]];
function Mplant(){sd=11;const n=new Ne;Ge(n,{key:1.9});Je(n,-4.4,13,.1);Vt.localClippingEnabled=!0;const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const plane=new Zt(c(0,0,-1),99);const wallMat=MAT(0x9bc86a,{opacity:.5,roughness:.4,clearcoat:.2,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.3,emissive:0x1d3a08,emissiveIntensity:.1});wallMat.clippingPlanes=[plane];
 add("wall",boxy(4.8,3.3,3.3,.2,.02,1),wallMat,[0,0,0],{ns:1});
 const memMat=MAT(0xf0c9a8,{opacity:.28,roughness:.3,clearcoat:.2,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.1});memMat.clippingPlanes=[plane];add("mem",boxy(4.55,3.1,3.1,.2,.015,2),memMat,[0,0,0],{ns:1});
 /* plasmodesmata: small channels through the wall on the +x/-x faces */
 const pdMat=MAT(0xf2e6a0,{roughness:.4,opacity:1});for(let i=0;i<9;i++){const y=(i%3-1)*1.6,z=(((i/3)|0)-1)*1.6;add("pd",tube([c(4.45,y,z),c(4.95,y,z)],.09,10),pdMat,[0,0,0],{ns:1});add("pd",tube([c(-4.95,y*.9,z),c(-4.45,y*.9,z)],.09,10),pdMat,[0,0,0],{ns:1})}
 /* vacuole */
 const vacMat=MAT(0x90cdf2,{opacity:.4,roughness:.08,clearcoat:.4,transmission:0,depthWrite:!1,bumpScale:.04,ior:1.33});const vac=add("pvac",sph(2.7,.05,1.4,1.2,.9,.9,40,56,4),vacMat,[.35,-.05,0],{ns:1});
 /* nucleus at the edge */
 const NP=[-3.55,1.5,1.3],nuc=new J;nuc.position.set(...NP);g.add(nuc);
 add("nuc",sph(.82,.05,1.6,1,1,1,40,56),MAT(0x8d92e6,{opacity:.55,roughness:.3,clearcoat:.8,emissive:0x1b2160,emissiveIntensity:.25}),[0,0,0],{parent:nuc,ns:1});
 add("nucleolus",sph(.24,.1,3,1,1,1,20,28,5),MAT(0x5b2f86,{roughness:.6,opacity:1,emissive:0x1d0a33,emissiveIntensity:.3}),[.18,-.05,.12],{parent:nuc});
 for(let k=0;k<4;k++){const pts=[];for(let i=0;i<10;i++){const a=i/9*TAU*1.8+k;pts.push(c(cos(a*1.5+k)*.35,sin(a*1.2)*.3,sin(a*1.5+k)*.35))}add("chromatin",tube(pts,.035,6),MAT(0xf08a6a,{emissive:0x5a1a08,emissiveIntensity:.2}),[0,0,0],{parent:nuc,ns:1})}
 /* chloroplasts with grana */
 const chOut=MAT(0x4caf50,{opacity:.4,roughness:.15,clearcoat:1,transmission:.3,thickness:.2,depthWrite:!1,emissive:0x0e3a0e,emissiveIntensity:.12}),chIn=MAT(0x7cc46a,{opacity:.9,roughness:.5,emissive:0x0e3a0e,emissiveIntensity:.15}),grMat=MAT(0x1f8f3a,{roughness:.35,clearcoat:.6,emissive:0x07300f,emissiveIntensity:.25,bumpScale:.1});
 const CH=[[-2.6,-2.55,1.9,.2],[2.9,2.5,1.6,-.3],[3.4,-2.4,-1.4,.5],[-.6,2.6,-1.8,.1],[-3.2,-1.2,-2.2,.9],[1.2,-2.8,2.1,-.2],[-1.2,2.5,2.0,.3],[3.9,.2,2.0,0]];const chs=[];
 CH.forEach((p,i)=>{const cg=new J;cg.position.set(p[0],p[1],p[2]);cg.rotation.set(p[3],i*.7,p[3]*.5);g.add(cg);chs.push(cg);
  add("chl",sph(1,.03,3,.66,.31,.31,22,32,i),chOut,[0,0,0],{parent:cg,ns:1});add("chl",sph(.9,0,1,.6,.27,.27,18,24),chIn,[0,0,0],{parent:cg,ns:1});
  [-.32,0,.32].forEach((x,j)=>{for(let d=0;d<5;d++)add("grana",sph(.1,0,1,1,.16,1,10,14),grMat,[x,-.12+d*.06,(j-1)*.04],{parent:cg,ns:1});});
  add("grana",tube([c(-.4,.0,.03),c(-.15,.02,-.05),c(.15,-.01,.05),c(.4,.0,-.02)],.018,6),grMat,[0,0,0],{parent:cg,ns:1})});
 /* mitochondria, ER, Golgi */
 const mO=MAT(0xf0a24a,{opacity:.34,roughness:.2,clearcoat:1,depthWrite:!1,emissive:0x4a2000,emissiveIntensity:.15}),mI=MAT(0xd9732b,{roughness:.45,emissive:0x5a2200,emissiveIntensity:.25,bumpScale:.25});
 [[-1.6,-2.8,-1.2,.4,.6,0],[3.1,-.9,-2.5,.2,1,.3],[-3.8,-.5,1.0,.7,.1,.6],[.8,2.9,1.2,.1,.5,.2]].forEach(p=>{const mg=new J;mg.position.set(p[0],p[1],p[2]);mg.rotation.set(p[3],p[4],p[5]);g.add(mg);add("mit",sph(1,0,1,.6,.31,.31,22,32),mO,[0,0,0],{parent:mg,ns:1});add("mit",cristae2(.52,.25),mI,[0,0,0],{parent:mg,ns:1})});
 const erMat=MAT(0xe08fb4,{opacity:.88,roughness:.45,emissive:0x40122a,emissiveIntensity:.12});
 for(let i=0;i<3;i++){const gr=new J;gr.position.set(NP[0],NP[1],NP[2]);gr.quaternion.setFromUnitVectors(c(0,1,0),c(.4,.5,.2+i*.4).normalize());g.add(gr);add("rer",param(22,40,(u,v)=>{const th=u*.8*(1+.2*u*u),ph=v*TAU,k=1.05+.15*i;return[sin(th)*cos(ph)*k,cos(th)*k,sin(th)*sin(ph)*k]}),erMat,[0,0,0],{parent:gr,ns:1})}
 const gg=new J;gg.position.set(-3.3,-.6,-1.2);gg.rotation.set(.5,.8,0);g.add(gg);const gm=MAT(0xf2c64a,{opacity:.95,roughness:.35,emissive:0x5a4000,emissiveIntensity:.2});for(let i=0;i<5;i++){const m=add("golgi",cap(.75-.05*i,.6+.04*i,.5,.04,i*3),gm,[0,i*.14-.3,0],{parent:gg,ns:1});m.rotation.x=PI}
 /* photosynthesis particles */
 const NPT=36,pt=new Wn(new it(.07,8,6),new bt({color:0xffffff}),NPT);pt.frustumCulled=!1;g.add(pt);const m4=new gt,col=new we;const kind=i=>i%3;const cols=[0xffe27a,0x9aa5b1,0x59b4ff];for(let i=0;i<NPT;i++)pt.setColorAt(i,col.setHex(cols[kind(i)]));
 const cams=[[c(0,2.6,17),c(0,0,0)],[c(5.4,1.6,9),c(2,0,0)],[c(0,1.2,10),c(.3,0,0)],[c(3.6,2.6,11),c(2.4,2,1)],[c(-4,2,8),c(-3,.6,.5)],[c(0,2.6,17),c(0,0,0)]];
 const camK=["Whole cell","Wall","Vacuole","Chloroplast","Nucleus etc.","Summary"];
 const show={wall:[1,1,0,0,0,1],mem:[1,1,0,0,0,1],pd:[0,1,0,0,0,1],pvac:[0,0,1,0,0,1],chl:[0,0,0,1,0,1],grana:[0,0,0,1,0,1],nuc:[0,0,0,0,1,1],nucleolus:[0,0,0,0,1,0],chromatin:[0,0,0,0,1,0],mit:[0,0,0,0,1,1],rer:[0,0,0,0,1,0],golgi:[0,0,0,0,1,0]};
 const base={wall:.4,mem:.28,pd:1,pvac:.24,chl:.4,grana:1,nuc:.55,nucleolus:1,chromatin:.95,mit:.34,rer:.45,golgi:.95};
 const L=(p)=>()=>g.localToWorld(c(...p));
 const labels=[["p-w","Cell wall (cellulose)","कोशिका भित्ति (सेलुलोज़)",L([4.8,2.4,3.3]),[0,1,5]],["p-m","Plasma membrane","कोशिका झिल्ली",L([4.5,-2.2,2.9]),[1]],["p-pd","Plasmodesmata","जीवद्रव्य तंतु",L([4.9,1.6,1.6]),[1]],["p-v","Large central vacuole","बड़ी केंद्रीय रिक्तिका",L([.4,.4,2.4]),[2,5]],["p-tu","Turgor pressure ↔ wall","स्फीति दाब ↔ भित्ति",L([3.3,-1.2,2.0]),[2]],
  ["p-c","Chloroplast","हरितलवक",L([2.9,2.5,1.6]),[3,5]],["p-g","Grana (chlorophyll)","ग्रेना (क्लोरोफ़िल)",L([-2.6,-2.55,1.9]),[3]],["p-s","Sunlight","सूर्य-प्रकाश",L([4.2,4.6,3]),[3]],["p-co","CO₂ in · O₂ out","CO₂ अंदर · O₂ बाहर",L([1.2,3.6,2.4]),[3]],
  ["p-n","Nucleus (pushed to the side)","केंद्रक (किनारे खिसका)",L(NP),[4,5]],["p-mi","Mitochondrion","माइटोकॉन्ड्रिया",L([3.1,-.9,-2.5]),[4]],["p-er","Rough ER","खुरदरी ER",L([-3.2,2.1,1.5]),[4]],["p-go","Golgi apparatus","गॉल्जी उपकरण",L([-3.3,-.5,-1.2]),[4]]];
 return run({n,g,org,show,base,ST:PST,cams,camK,labels,plane,cutAt:1.2,
  frame:(s,t)=>{g.rotation.y=sin(t*.12)*.16;const tu=s===2?1+.03*sin(t*1.6):1;vac.scale.set(tu,tu,tu);
   for(let i=0;i<NPT;i++){if(s!==3){m4.makeScale(0,0,0);pt.setMatrixAt(i,m4);continue}const ch=chs[i%chs.length],f=((i/NPT)+t*.12)%1,k=kind(i),T=ch.position;let p;
    if(k===0)p=c(T.x+5*(1-f),T.y+6*(1-f),T.z+3*(1-f));else if(k===1)p=c(T.x+(1-f)*1.5,T.y+(1-f)*3.4,T.z+(1-f)*2.2+.4);else p=c(T.x+f*1.6+.3,T.y+f*3.2,T.z+f*2.6);
    m4.makeScale(k===0?1.3:1,k===0?1.3:1,k===0?1.3:1);m4.setPosition(p.x,p.y,p.z);pt.setMatrixAt(i,m4)}pt.instanceMatrix.needsUpdate=!0},
  predict:{q:"Which structure gives a plant cell its fixed rectangular shape?",opts:[["Cell membrane",!1,"All cells have one, but it is soft and flexible."],["Cell wall",!0,"Correct — the rigid cellulose wall."],["Nucleus",!1,"The nucleus controls the cell; it does not give shape."]]}})}
Q_("ix1/plant3d",[["Which organelle in a plant cell carries out photosynthesis?","पादप कोशिका का कौन-सा अंगक प्रकाश-संश्लेषण करता है?",["Mitochondrion","Chloroplast","Golgi","Nucleus"],1,"Chloroplasts hold chlorophyll."],["Why is the nucleus of a mature plant cell pushed to the side?","परिपक्व पादप कोशिका का केंद्रक किनारे क्यों होता है?",["It is small","The large central vacuole takes the space","The wall pushes it","It has no role"],1,"The vacuole fills most of the cell."],["Plasmodesmata are…","जीवद्रव्य तंतु हैं…",["Channels through the cell wall","Chloroplast stacks","DNA rings","Ribosomes"],0,"They link neighbouring plant cells."],["A wilted plant has lost water from its…","मुरझाए पौधे ने जल खोया है…",["Vacuoles","Nucleus","Ribosomes","Centrioles"],0,"Turgor pressure drops."]]);
Px["ix1/plant3d"]=[["Leaves look green because chloroplasts contain the green pigment chlorophyll.","पत्तियाँ हरी इसलिए दिखती हैं क्योंकि हरितलवक में हरा वर्णक क्लोरोफ़िल होता है।"],["Crisp celery goes limp when left out: its vacuoles lose water and turgor drops.","कुरकुरी सेलरी रखी रहने पर नरम पड़ जाती है: रिक्तिकाओं का जल घटता है।"]];
/* ============================== BACTERIUM ============================== */
const BST=[
["1","A bacterium (prokaryote)","जीवाणु (प्रोकैरियोट)","A bacterium is a single, tiny cell, about 1–5 µm long, with no nucleus. This rod-shaped cell is drawn thousands of times larger than life.","जीवाणु एकल सूक्ष्म कोशिका (लगभग 1–5 µm) है जिसमें केंद्रक नहीं होता। यह छड़-आकार की कोशिका वास्तविक से हज़ारों गुना बड़ी दिखाई है।","Artistic model",8],
["2","The cell envelope","कोशिका आवरण","From outside in: a sticky capsule, a strong peptidoglycan cell wall, and the thin plasma membrane around the cytoplasm.","बाहर से भीतर: चिपचिपा कैप्सूल, मज़बूत पेप्टिडोग्लाइकन भित्ति और कोशिकाद्रव्य को घेरे पतली कोशिका झिल्ली।","Artistic model (cut-away)",9],
["3","Nucleoid and plasmids","केंद्राभ व प्लाज़्मिड","The DNA is one long circular thread coiled in the cytoplasm (nucleoid) — no nuclear membrane. Small extra DNA rings called plasmids may carry useful genes.","DNA कोशिकाद्रव्य में कुंडलित एक लंबा वृत्ताकार धागा (केंद्राभ) है — केंद्रक झिल्ली नहीं। प्लाज़्मिड छोटे अतिरिक्त DNA छल्ले हैं जो उपयोगी जीन ले जा सकते हैं।","Artistic model",10],
["4","Ribosomes: the only organelle","राइबोसोम: एकमात्र अंगक","The cytoplasm holds thousands of free ribosomes that make proteins. Bacteria have no mitochondria, ER, Golgi or other membrane-bound organelles.","कोशिकाद्रव्य में हज़ारों मुक्त राइबोसोम प्रोटीन बनाते हैं; जीवाणु में माइटोकॉन्ड्रिया, ER, गॉल्जी जैसे झिल्ली-युक्त अंगक नहीं होते।","Artistic model",9],
["5","Flagellum and pili","कशाभिका व पिली","A flagellum, spun by a tiny motor in the wall, drives the bacterium forward; short pili help it stick to surfaces.","दीवार में लगी सूक्ष्म मोटर से घूमती कशाभिका जीवाणु को आगे बढ़ाती है; छोटी पिली चिपकने में मदद करती हैं।","Animated (schematic motion)",11],
["6","Prokaryote vs eukaryote","प्रोकैरियोट बनाम यूकैरियोट","Prokaryote: no true nucleus, no membrane-bound organelles, small (1–5 µm). Eukaryote: DNA inside a nucleus and many membrane-bound organelles, larger (10–100 µm).","प्रोकैरियोट: सच्चा केंद्रक नहीं, झिल्ली-युक्त अंगक नहीं, छोटा (1–5 µm)। यूकैरियोट: DNA केंद्रक में व अनेक झिल्ली-युक्त अंगक, बड़ा (10–100 µm)।","Summary",9]];
function Mbact(){sd=21;const n=new Ne;Ge(n,{key:1.9});Je(n,-3.6,13,.1);Vt.localClippingEnabled=!0;const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);const cell=new J;g.add(cell);
 const plane=new Zt(c(0,0,-1),99);const L=5.2,r=1.35;
 const cap_=MAT(0xd8e8c8,{opacity:.16,roughness:.3,clearcoat:.2,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.4});cap_.clippingPlanes=[plane];add("capsule",rod(L+.5,r+.32,.06,1.1,1),cap_,[0,0,0],{parent:cell,ns:1});
 const bw=MAT(0xd8c694,{opacity:.4,roughness:.4,clearcoat:.15,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.5,emissive:0x3a2f0a,emissiveIntensity:.1});bw.clippingPlanes=[plane];add("bwall",rod(L+.2,r+.1,.025,1.8,2),bw,[0,0,0],{parent:cell,ns:1});
 const bm=MAT(0xe8a5a5,{opacity:.3,roughness:.3,clearcoat:.2,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.1});bm.clippingPlanes=[plane];add("bmem",rod(L,r,.01,1,3),bm,[0,0,0],{parent:cell,ns:1});
 /* nucleoid: coiled circular DNA */
 const pts=[];for(let i=0;i<=90;i++){const a=i/90*TAU;pts.push(c(sin(3*a)*1.6+.45*sin(11*a),.6*sin(5*a)+.3*sin(13*a),.6*cos(4*a)+.3*cos(15*a)))}
 const dna=MAT(0x5e6ad8,{roughness:.4,clearcoat:.6,emissive:0x16206a,emissiveIntensity:.3});add("nucleoid",tube(pts,.055,8),dna,[0,0,0],{parent:cell,ns:1});
 const pm=MAT(0xff9d5c,{roughness:.4,clearcoat:.6,emissive:0x5a2a08,emissiveIntensity:.25});[[1.3,-.55,.3,.3],[-1.6,.5,-.35,1.1],[.3,.65,-.4,.7]].forEach(p=>add("plasmid",torus(.2+.05*p[3],.04),pm,[p[0],p[1],p[2]],{parent:cell,rot:[p[3]*2,p[3],0],ns:1}));
 /* ribosomes */
 const NR=300,rb=new Wn(new it(.05,8,6),new bt({color:0x1f7f8a}),NR);rb.frustumCulled=!1;cell.add(rb);const m4=new gt;for(let i=0;i<NR;i++){const x=(R()-.5)*(L+.6),q=Math.sqrt(R())*r*.92*Math.pow(1-Math.pow(Math.abs(x)/(L/2+.7),3),.4),a=R()*TAU;m4.makeScale(1,1,1);m4.setPosition(x,q*sin(a),q*cos(a));rb.setMatrixAt(i,m4)}
 org.push({m:rb,id:"brib",mat:rb.material});rb.userData.part="brib";
 /* flagellum + basal body, pili */
 const fl=new J;fl.position.set(-L/2-.7,0,0);cell.add(fl);const fp=[];for(let i=0;i<=40;i++){const q=i/40,amp=.16+.2*q;fp.push(c(-q*5.4,amp*sin(q*34),amp*cos(q*34)))}const fm=MAT(0xe8d49a,{roughness:.35,clearcoat:.6,emissive:0x3a2f0a,emissiveIntensity:.15});add("flag",tube(fp,.07,10,u=>1-.4*u),fm,[0,0,0],{parent:fl,ns:1});
 [0,.18,.36].forEach((x,i)=>add("flag",torus(.17-.02*i,.035),fm,[-.0-x*1+.62,0,0],{parent:cell,rot:[0,0,PI/2],ns:1}));
 for(let i=0;i<34;i++){const a=R()*TAU,x=(R()-.5)*L*.9,dy=sin(a),dz=cos(a),rr=r+.34;add("pili",tube([c(x,dy*rr,dz*rr),c(x+.05,dy*(rr+.45),dz*(rr+.45)),c(x+.12,dy*(rr+.85),dz*(rr+.85))],.025,5),fm,[0,0,0],{parent:cell,ns:1})}
 const cams=[[c(0,1.6,11.5),c(0,0,0)],[c(0,.6,7.6),c(0,0,0)],[c(0,1.2,8.6),c(0,0,0)],[c(0,.4,7),c(0,0,0)],[c(-2.4,1.2,9.6),c(-2.2,0,0)],[c(0,1.6,11.5),c(0,0,0)]];const camK=["Whole","Envelope","DNA","Ribosomes","Flagellum","Summary"];
 const show={capsule:[1,1,0,0,1,1],bwall:[1,1,0,0,1,1],bmem:[1,1,0,0,1,1],nucleoid:[0,0,1,0,0,1],plasmid:[0,0,1,0,0,1],brib:[0,0,0,1,0,1],flag:[0,0,0,0,1,1],pili:[0,0,0,0,1,1]};
 const base={capsule:.16,bwall:.4,bmem:.3,nucleoid:1,plasmid:1,brib:1,flag:1,pili:1};
 const W=(p)=>()=>cell.localToWorld(c(...p));
 const labels=[["b-ca","Capsule","कैप्सूल",W([1.2,1.9,.4]),[1]],["b-w","Cell wall (peptidoglycan)","कोशिका भित्ति",W([2.0,1.7,0]),[0,1]],["b-m","Plasma membrane","कोशिका झिल्ली",W([-.6,-1.45,0]),[1]],["b-cy","Cytoplasm (no organelles)","कोशिकाद्रव्य (अंगक नहीं)",W([.2,-.2,.9]),[1]],
  ["b-n","Nucleoid — DNA, no nuclear membrane","केंद्राभ — DNA, केंद्रक झिल्ली नहीं",W([-.2,.5,.4]),[2,5]],["b-p","Plasmid","प्लाज़्मिड",W([1.3,-.55,.3]),[2]],["b-r","Ribosomes","राइबोसोम",W([-1.0,-.6,.5]),[3,5]],["b-f","Flagellum","कशाभिका",W([-5.0,.2,.2]),[4]],["b-bb","Basal body (motor)","आधार-मोटर",W([-2.5,0,0]),[4]],["b-pi","Pili","पिली",W([1.0,2.1,.8]),[4]],["b-sz","About 1–5 µm long","लगभग 1–5 µm लंबा",W([0,-2.2,0]),[0]]];
 return run({n,g,org,show,base,ST:BST,cams,camK,labels,plane,cutAt:.5,
  frame:(s,t)=>{g.rotation.y=s===4?sin(t*.3)*.25:sin(t*.12)*.16;fl.rotation.x=t*(s===4?7:1.2);cell.position.x=s===4?sin(t*.4)*.8:0;cell.position.y=s===4?sin(t*.9)*.12:0},
  predict:{q:"Why is a bacterium called a prokaryote?",opts:[["It has no true nucleus",!0,"Correct — its DNA lies free in the cytoplasm (nucleoid)."],["It has no DNA",!1,"It does have DNA, as a circular chromosome."],["It is multicellular",!1,"Bacteria are single-celled."]]}})}
Q_("ix1/bacterium3d",[["Which of these is absent in a bacterial cell?","जीवाणु कोशिका में क्या नहीं होता?",["Ribosomes","Nuclear membrane","Cell wall","DNA"],1,"Prokaryotes have no nuclear membrane."],["The genetic material of a bacterium lies in the…","जीवाणु का आनुवंशिक पदार्थ कहाँ होता है?",["Nucleus","Nucleoid","Vacuole","Golgi"],1,"The nucleoid region of the cytoplasm."],["What does the flagellum do?","कशाभिका क्या करती है?",["Makes proteins","Helps swimming","Stores DNA","Makes energy"],1,"It is a rotating whip-like tail."],["Small extra DNA rings in bacteria are…","जीवाणु में छोटे अतिरिक्त DNA छल्ले…",["Plasmids","Ribosomes","Pili","Capsules"],0,"Used in genetic engineering."]]);
Px["ix1/bacterium3d"]=[["Antibiotics like penicillin work by attacking the bacterial cell wall — human cells have none, so they are safe.","पेनिसिलिन जैसी औषधियाँ जीवाणु की भित्ति पर वार करती हैं; मानव कोशिका में भित्ति नहीं होती, इसलिए वे सुरक्षित हैं।"],["Curd forms when Lactobacillus bacteria turn milk sugar into lactic acid.","दही में लैक्टोबैसिलस जीवाणु दूध की शर्करा को लैक्टिक अम्ल में बदलते हैं।"]];
{const Lh=Hj.find(h=>h.kp==="ix1").topics,i=Lh.findIndex(x=>x.id==="cell3d");Lh.splice(i<0?Lh.length:i+1,0,{id:"plant3d",title:"Plant cell — detailed 3D",hi:"पादप कोशिका — विस्तृत 3D",build:Mplant,ncert:"Class IX · plant cell"},{id:"bacterium3d",title:"Bacterium — detailed 3D",hi:"जीवाणु — विस्तृत 3D",build:Mbact,ncert:"Class IX · prokaryotic cell"})}
})();
