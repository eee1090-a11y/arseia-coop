const {chromium}=require('/opt/node-tools/node_modules/playwright');const {spawn}=require('child_process');
const SRV=process.argv[2],OUT=process.argv[3];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const res=[];const ok=(n,c,x='')=>{res.push([n,c?'통과':'실패',x]);console.log((c?'PASS ':'FAIL ')+n+' '+x)};
function start(){const p=spawn('node',['server.js'],{cwd:SRV,env:Object.assign({},process.env,{PORT:'8099'})});p.stdout.on('data',d=>process.stdout.write('[srv] '+d));return p}
(async()=>{let srv=start();await sleep(1200);
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:800}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
// existing save before "install": simulate a character already on this address
await p.goto('http://localhost:8099/');await p.waitForTimeout(4000);
const man=await (await p.request.get('http://localhost:8099/app/manifest.webmanifest')).json();ok('manifest',man.name==='아르세이아의 견습생');
for(const f of ['icon-192.png','icon-512.png','icon-180.png','icon.svg']){const r=await p.request.get('http://localhost:8099/app/'+f);ok('icon '+f,r.status()===200,r.headers()['content-type'])}
ok('bad path 404',(await p.request.get('http://localhost:8099/app/../server.js')).status()===404);
ok('bad path2 404',(await p.request.get('http://localhost:8099/app/%2e%2e%2fserver.js')).status()===404);
// v35: img 폴더의 그림 파일(무료 그림 flare-* · 스킬 이펙트 fx-*)을 서버가 모두 내주는지 — v31~v34는 fx-*를 404로 막아 이펙트 그림이 안 나왔음
{const fs=require('fs'),dir=require('path').join(SRV,'img'),fl=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>/\.js$/.test(f)):[];const bad=[];
  for(const f of fl){const r=await p.request.get('http://localhost:8099/img/'+f);if(r.status()!==200)bad.push(f+' '+r.status())}
  ok('img 그림 파일 모두 받아짐',fl.some(f=>/^fx-/.test(f))&&fl.some(f=>/^flare-/.test(f))&&!bad.length,fl.length+'개 '+bad.join(' '))}
const cdp=await ctx.newCDPSession(p);
await p.waitForTimeout(2000);
const inst=await cdp.send('Page.getInstallabilityErrors');ok('installable (Chrome criteria)',inst.installabilityErrors.length===0,JSON.stringify(inst.installabilityErrors));
const sw=await p.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();return r&&r.active?r.active.scriptURL:null});ok('service worker active',!!sw,sw);
const sec=await p.evaluate(()=>{const e=document.getElementById('appInstall');return e?e.innerText:null});ok('start screen install section',!!sec,(sec||'').slice(0,40));
await p.screenshot({path:OUT+'/pc-start.png'});
// beforeinstallprompt simulation
await p.evaluate(()=>{const e=new Event('beforeinstallprompt');e.prompt=()=>{window.__prompted=1};e.userChoice=Promise.resolve({outcome:'accepted'});dispatchEvent(e)});
await p.waitForTimeout(200);
ok('install button shown when browser allows',await p.evaluate(()=>!document.getElementById('appInstBtn').hidden));
await p.click('#appInstBtn');await p.waitForTimeout(300);
ok('button calls install prompt',await p.evaluate(()=>window.__prompted===1));
ok('message after install',(await p.textContent('#appInstMsg')).includes('설치했습니다'));
// save sharing: write a fake key via page, check from "app window" (same origin) 
await p.evaluate(()=>localStorage.setItem('arseia-apptest','x'));
// emulate standalone app window
const p2=await ctx.newPage();const c2=await ctx.newCDPSession(p2);
await p2.addInitScript(()=>{const o=window.matchMedia.bind(window);window.matchMedia=q=>/display-mode: standalone/.test(q)?{matches:true,media:q,addEventListener(){},removeEventListener(){}}:o(q)});
const errs2=[];p2.on('pageerror',e=>errs2.push(String(e)));
await p2.goto('http://localhost:8099/?app=1');await p2.waitForTimeout(4000);
const st=await p2.evaluate(()=>({sa:matchMedia('(display-mode: standalone)').matches,sec:!!document.getElementById('appInstall'),ls:localStorage.getItem('arseia-apptest'),slots:Object.keys(localStorage).filter(k=>k.startsWith('arseia-char')).length}));
ok('app window: same storage as browser',st.ls==='x',JSON.stringify(st));ok('app window: no install section',st.sa&&!st.sec);
await p2.evaluate(()=>localStorage.removeItem('arseia-apptest'));
await p2.screenshot({path:OUT+'/app-window-start.png'});
// phone
const ph=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});
const pp=await ph.newPage();await pp.goto('http://localhost:8099/');await pp.waitForTimeout(4000);
await pp.evaluate(()=>document.getElementById('appInstall').scrollIntoView());await pp.screenshot({path:OUT+'/phone-iphone-hint.png'});
ok('iPhone hint',(await pp.textContent('#appInstMsg')).includes('홈 화면에 추가'));
// offline fallback
srv.kill();await sleep(500);
await p2.reload().catch(()=>{});await p2.waitForTimeout(1500);
const off=await p2.evaluate(()=>document.body.innerText);ok('server down: guide page instead of blank',off.includes('서버에 연결하지 못했습니다'));
await p2.screenshot({path:OUT+'/offline.png'});
srv=start();await sleep(1200);await p2.click('button');await p2.waitForTimeout(4000);
ok('retry button returns to game',await p2.evaluate(()=>!!document.getElementById('intro')));
ok('no console errors',errs.length+errs2.length===0,[...errs,...errs2].slice(0,3).join(' | '));
// artifact-style (no server): section absent
const pa=await b.newPage();await pa.goto('file://'+SRV+'/game.html');await pa.waitForTimeout(3000);
ok('Artifact/file mode: unchanged (no section)',await pa.evaluate(()=>!document.getElementById('appInstall')));
await b.close();srv.kill();
require('fs').writeFileSync(OUT+'/app-test-result.json',JSON.stringify(res,null,1));
console.log(res.filter(r=>r[1]==='실패').length?'SOME FAIL':'ALL PASS');process.exit(0)})();
