// Regression check: every scene loads, every tool can be clicked, no console errors, no stopped scenes.
// Run: node tests/regression.js [http://localhost:8765/index.html]     (needs Playwright + Chromium; uses software GL, so it checks correctness, not speed)
const {chromium}=require('playwright');const path=require('path');
(async()=>{
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1280,height:800}});const errs=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});
  const url=process.argv[2]||('file://'+path.resolve(__dirname,'..','index.html'));await p.goto(url);await p.waitForTimeout(2500);
  const keys=await p.evaluate(()=>__atlas.keys());let clicks=0;const dead=[];
  for(const k of keys){
    await p.evaluate(k=>{__atlas.go(k)},k);await p.waitForTimeout(k==='ch5/digest3d'?9000:350);await p.evaluate(()=>__atlas.closePredict());await p.waitForTimeout(250);
    const n=await p.evaluate(()=>document.querySelectorAll('#tools .btn').length);
    for(let i=0;i<n;i++){await p.evaluate(i=>document.querySelectorAll('#tools .btn')[i].click(),i);await p.waitForTimeout(300);clicks++}
    if(await p.evaluate(()=>!document.body.classList.contains('explore')))for(let i=0;i<8;i++){await p.evaluate(()=>document.querySelector('#next').click());await p.waitForTimeout(150)}
    if(await p.evaluate(()=>{const i=document.querySelector('#info');return i&&!i.hidden&&/hit a problem/.test(i.innerText)}))dead.push(k);
  }
  await b.close();
  console.log(`scenes ${keys.length} · tool clicks ${clicks} · stopped scenes ${dead.length} · console errors ${errs.length}`);
  if(dead.length)console.log('stopped:',dead.join(', '));if(errs.length)console.log(errs.slice(0,10).join('\n'));
  process.exit(dead.length||errs.length?1:0);
})();
