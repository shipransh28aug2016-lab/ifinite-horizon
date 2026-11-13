// Generic anatomy-pack builder (same pipeline as build-digestive.mjs): extract named meshes, weld, simplify, Draco-compress.
// usage: node build-pack.mjs <dir with *.glb layers> <out dir> <pack name> <config.mjs exporting default WANT>
// WANT: id -> [layer, source node name, group, hi triangles, lo triangles]. Only listed structures are copied.
import {Document,NodeIO} from '@gltf-transform/core';
import {KHRDracoMeshCompression} from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import {MeshoptSimplifier} from 'meshoptimizer';
import fs from 'node:fs';
import path from 'node:path';
const [,, SRC, OUT, PACK, CFG]=process.argv;await MeshoptSimplifier.ready;
const dec=await draco3d.createDecoderModule(),enc=await draco3d.createEncoderModule();
const rd=new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({'draco3d.decoder':dec});
const WANT=(await import(path.resolve(CFG))).default;
const docs={};for(const l of ['visceral','skeletal','muscular','nervous','joints','cardiovascular'])docs[l]=await rd.read(`${SRC}/${l}.glb`);
function extract(lod){
 const out=new Document();const buf=out.createBuffer();const scene=out.createScene(PACK);const manifest={lod,parts:{}};
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
 const f=lod?PACK+'_lo.glb':PACK+'.glb';await io.write(`${OUT}/${f}`,out);const tri=Object.values(manifest.parts).reduce((a,p)=>a+p.triangles,0);console.log(f,fs.statSync(`${OUT}/${f}`).size,'bytes',tri,'triangles',Object.keys(manifest.parts).length,'meshes');full[lod?'lo':'hi']={file:f,bytes:fs.statSync(`${OUT}/${f}`).size,triangles:tri};if(!lod)fs.writeFileSync(`${OUT}/parts.json`,JSON.stringify(manifest.parts))}
fs.writeFileSync(`${OUT}/sizes.json`,JSON.stringify(full));
