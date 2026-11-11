// Build the heart / circulation asset set from Z-Anatomy-derived anatomy layers.
// usage: node build-digestive.mjs <dir with visceral.glb skeletal.glb muscular.glb> <out dir>
// Only the structures listed in WANT are copied. Nothing else from the source layers is kept.
import {Document,NodeIO} from '@gltf-transform/core';
import {KHRDracoMeshCompression} from '@gltf-transform/extensions';
import {weld} from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import {MeshoptSimplifier} from 'meshoptimizer';
import fs from 'node:fs';
const [,, SRC, OUT]=process.argv;await MeshoptSimplifier.ready;
const dec=await draco3d.createDecoderModule(),enc=await draco3d.createEncoderModule();
const rd=new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({'draco3d.decoder':dec});
// id: [layer, source node name, group, hi triangles, lo triangles]
const T=(n)=>Math.round(n);
const WANT={
 'right-atrium':['cardiovascular','Right atrium','chamber',3500,1500],'left-atrium':['cardiovascular','Left atrium','chamber',3500,1500],'right-ventricle':['cardiovascular','Right ventricle','chamber',5000,2000],'left-ventricle':['cardiovascular','Left ventricle','chamber',5000,2000],
 'valve-tricuspid-1':['cardiovascular','Inferior leaflet of right atrioventricular valve','valve',900,500],'valve-tricuspid-2':['cardiovascular','Septal leaflet of right atrioventricular valve','valve',900,500],'valve-mitral':['cardiovascular','Posterior leaflet of left atrioventricular valve','valve',900,500],
 'valve-pulm-1':['cardiovascular','Anterior semilunar leaflet of pulmonary valve','valve',500,300],'valve-pulm-2':['cardiovascular','Left semilunar leaflet of pulmonary valve','valve',500,300],'valve-pulm-3':['cardiovascular','Right semilunar leaflet of pulmonary valve','valve',500,300],
 'valve-aortic-1':['cardiovascular','Left coronary leaflet','valve',400,250],'valve-aortic-2':['cardiovascular','Right coronary leaflet','valve',400,250],'valve-aortic-3':['cardiovascular','Non-coronary leaflet','valve',300,200],
 'ascending-aorta':['cardiovascular','Ascending aorta','artery',576,400],'aortic-arch':['cardiovascular','Aortic arch','artery',576,400],'thoracic-aorta':['cardiovascular','Thoracic aorta','artery',864,500],'abdominal-aorta':['cardiovascular','Abdominal aorta','artery',2016,900],'brachiocephalic-trunk':['cardiovascular','Brachiocephalic trunk','artery',576,300],
 'pulmonary-trunk':['cardiovascular','Pulmonary trunk','artery',230,200],'pulmonary-artery-l':['cardiovascular','Left pulmonary artery','artery',2016,900],'pulmonary-artery-r':['cardiovascular','Right pulmonary artery','artery',576,400],
 'pulmonary-vein-l1':['cardiovascular','Left superior pulmonary vein','vein',864,500],'pulmonary-vein-l2':['cardiovascular','Left inferior pulmonary vein','vein',864,500],'pulmonary-vein-r1':['cardiovascular','Right superior pulmonary vein','vein',1728,800],'pulmonary-vein-r2':['cardiovascular','Right inferior pulmonary vein','vein',576,400],
 'superior-vena-cava':['cardiovascular','Superior vena cava','vein',2500,1000],'inferior-vena-cava':['cardiovascular','Inferior vena cava (thoracic part)','vein',2500,1000],
 'coronary-right':['cardiovascular','Right coronary artery','coronary',2500,900],'coronary-circumflex':['cardiovascular','Circumflex artery of heart','coronary',1800,700],'coronary-lad':['cardiovascular','Anterior interventricular artery','coronary',1200,500],
 'lung-l-upper':['visceral','Superior lobe of left lung','lung',6000,2500],'lung-l-lower':['visceral','Inferior lobe of left lung','lung',6000,2500],'lung-r-upper':['visceral','Superior lobe of right lung','lung',5500,2300],'lung-r-middle':['visceral','Middle lobe of right lung','lung',4500,2000],'lung-r-lower':['visceral','Inferior lobe of right lung','lung',6000,2500],
 'trachea':['visceral','Trachea','airway',1800,900],'bronchus-r':['visceral','Right main bronchus','airway',288,200],'bronchus-l':['visceral','Left main bronchus','airway',576,300],
 'sternum-body':['skeletal','Body of sternum','bone',1500,700],'sternum-manubrium':['skeletal','Manubrium of sternum','bone',900,500],'sternum-xiphoid':['skeletal','Xiphoid process','bone',400,250],
 'clavicle-l':['skeletal','Clavicle.l','bone',600,350],'clavicle-r':['skeletal','Clavicle.r','bone',600,350],'diaphragm':['muscular','Diaphragm','landmark',4000,1500]};
const RIBS=['First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth'];
for(const s of ['l','r'])RIBS.forEach((r,i)=>{WANT['rib-'+(i+1)+'-'+s]=['skeletal',r+' rib.'+s,'rib',700,350]});
const docs={};for(const l of ['visceral','skeletal','muscular','cardiovascular'])docs[l]=await rd.read(`${SRC}/${l}.glb`);
function extract(lod){
 const out=new Document();const buf=out.createBuffer();const scene=out.createScene('heart');const manifest={lod,parts:{}};
 for(const [id,[layer,name,group,hi,lo]] of Object.entries(WANT)){
  const node=docs[layer].getRoot().listNodes().find(n=>n.getName()===name&&n.getMesh());if(!node)throw new Error('missing '+name);
  const M=node.getWorldMatrix();const P=[],I=[];let base=0;
  for(const pr of node.getMesh().listPrimitives()){const pa=pr.getAttribute('POSITION').getArray(),ia=pr.getIndices()?pr.getIndices().getArray():null;
   for(let i=0;i<pa.length;i+=3){const x=pa[i],y=pa[i+1],z=pa[i+2];P.push(M[0]*x+M[4]*y+M[8]*z+M[12],M[1]*x+M[5]*y+M[9]*z+M[13],M[2]*x+M[6]*y+M[10]*z+M[14])}
   const n=pa.length/3;if(ia)for(const v of ia)I.push(v+base);else for(let i=0;i<n;i++)I.push(i+base);base+=n}
  // weld coincident vertices, then simplify to the triangle budget
  const key=new Map(),pos=[],idx=new Uint32Array(I.length);for(let t=0;t<I.length;t++){const v=I[t],k=Math.round(P[v*3]*1e6)+','+Math.round(P[v*3+1]*1e6)+','+Math.round(P[v*3+2]*1e6);let j=key.get(k);if(j===undefined){j=pos.length/3;key.set(k,j);pos.push(P[v*3],P[v*3+1],P[v*3+2])}idx[t]=j}
  const pf=new Float32Array(pos);const target=Math.min(idx.length,(lod?lo:hi)*3);
  let ni=idx;if(target<idx.length){const r=MeshoptSimplifier.simplify(idx,pf,3,Math.floor(target/3)*3,0.05,[]);ni=r[0]}
  // keep only used vertices, compute smooth normals
  const rem=new Map(),np=[],fi=new Uint32Array(ni.length);for(let t=0;t<ni.length;t++){const v=ni[t];let j=rem.get(v);if(j===undefined){j=np.length/3;rem.set(v,j);np.push(pf[v*3],pf[v*3+1],pf[v*3+2])}fi[t]=j}
  const nv=np.length/3,nn=new Float32Array(nv*3);for(let t=0;t<fi.length;t+=3){const a=fi[t],b=fi[t+1],c=fi[t+2];const ux=np[b*3]-np[a*3],uy=np[b*3+1]-np[a*3+1],uz=np[b*3+2]-np[a*3+2],vx=np[c*3]-np[a*3],vy=np[c*3+1]-np[a*3+1],vz=np[c*3+2]-np[a*3+2];const x=uy*vz-uz*vy,y=uz*vx-ux*vz,z=ux*vy-uy*vx;for(const q of [a,b,c]){nn[q*3]+=x;nn[q*3+1]+=y;nn[q*3+2]+=z}}
  for(let i=0;i<nv;i++){const l=Math.hypot(nn[i*3],nn[i*3+1],nn[i*3+2])||1;nn[i*3]/=l;nn[i*3+1]/=l;nn[i*3+2]/=l}
  const mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let i=0;i<np.length;i+=3)for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],np[i+k]);mx[k]=Math.max(mx[k],np[i+k])}
  const prim=out.createPrimitive().setAttribute('POSITION',out.createAccessor().setType('VEC3').setArray(new Float32Array(np)).setBuffer(buf)).setAttribute('NORMAL',out.createAccessor().setType('VEC3').setArray(nn).setBuffer(buf)).setIndices(out.createAccessor().setType('SCALAR').setArray(nv>65535?fi:new Uint16Array(fi)).setBuffer(buf));
  const mesh=out.createMesh(id).addPrimitive(prim);const nd=out.createNode(id).setMesh(mesh);scene.addChild(nd);
  manifest.parts[id]={group,source:name,layer,triangles:fi.length/3,min:mn,max:mx}}
 return {out,manifest}}
const io=new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({'draco3d.encoder':enc,'draco3d.decoder':dec});
fs.mkdirSync(OUT,{recursive:true});const full={};
for(const lod of [0,1]){const {out,manifest}=extract(lod);out.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({method:KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,encodeSpeed:5,decodeSpeed:5,quantizePosition:14,quantizeNormal:10});
 const f=lod?'heart_lo.glb':'heart.glb';await io.write(`${OUT}/${f}`,out);const tri=Object.values(manifest.parts).reduce((a,p)=>a+p.triangles,0);console.log(f,fs.statSync(`${OUT}/${f}`).size,'bytes',tri,'triangles',Object.keys(manifest.parts).length,'meshes');full[lod?'lo':'hi']={file:f,bytes:fs.statSync(`${OUT}/${f}`).size,triangles:tri};if(!lod)fs.writeFileSync(`${OUT}/parts.json`,JSON.stringify(manifest.parts))}
fs.writeFileSync(`${OUT}/sizes.json`,JSON.stringify(full));
