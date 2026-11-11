// Vigyan Atlas asset loader (ES module, loaded lazily by dynamic import).
// Loads a Draco-compressed GLB, decodes it with the vendored Three r160 loaders, and returns PLAIN typed arrays,
// so the app's own bundled Three.js never has to share classes with this module.
// Features: download progress, in-memory + Cache API caching, abort, clear errors for the caller's fallback path.
const mem=new Map();let mods=null;
const base=new URL('.',import.meta.url);
export const supported=()=>location.protocol!=='file:';
async function loaders(){
  if(!mods){const [G,D]=await Promise.all([import('./vendor/loaders/GLTFLoader.js'),import('./vendor/loaders/DRACOLoader.js')]);
    const draco=new D.DRACOLoader().setDecoderPath(new URL('vendor/draco/',base).href);
    const gltf=new G.GLTFLoader().setDRACOLoader(draco);mods={gltf,draco}}
  return mods}
async function fetchBuffer(url,onProgress,signal){
  let cache=null;try{cache=await caches.open('va-assets-v1');const hit=await cache.match(url);if(hit){const b=await hit.arrayBuffer();onProgress&&onProgress(1,b.byteLength,true);return b}}catch{}
  const res=await fetch(url,{signal});if(!res.ok)throw new Error('HTTP '+res.status+' for '+url);
  const total=+res.headers.get('content-length')||0;const reader=res.body&&res.body.getReader();
  if(!reader){const b=await res.arrayBuffer();onProgress&&onProgress(1,b.byteLength,false);try{cache&&await cache.put(url,new Response(b))}catch{}return b}
  const chunks=[];let got=0;for(;;){const {done,value}=await reader.read();if(done)break;chunks.push(value);got+=value.length;onProgress&&onProgress(total?got/total:0,got,false)}
  const out=new Uint8Array(got);let o=0;for(const c of chunks){out.set(c,o);o+=c.length}
  try{cache&&await cache.put(url,new Response(out.buffer.slice(0)))}catch{}
  return out.buffer}
/** @returns {Promise<{parts:Object<string,{position:Float32Array,normal:Float32Array,index:Uint16Array|Uint32Array}>}>} */
export async function loadMeshes(path,{onProgress,signal}={}){
  if(!supported())throw new Error('3D assets need the page to be served over http(s); a file:// copy uses the built-in model instead');
  const url=new URL(path,base).href;if(mem.has(url))return mem.get(url);
  const buf=await fetchBuffer(url,onProgress,signal);const {gltf}=await loaders();
  const gl=await new Promise((ok,bad)=>gltf.parse(buf,'',ok,bad));const parts={};
  gl.scene.traverse(o=>{if(!o.isMesh)return;const g=o.geometry;parts[o.name]={position:g.attributes.position.array.slice(),normal:g.attributes.normal?g.attributes.normal.array.slice():null,index:g.index?g.index.array.slice():null};g.dispose()});
  const r={parts};mem.set(url,r);return r}
export const evict=path=>mem.delete(new URL(path,base).href);
