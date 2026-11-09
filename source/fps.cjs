// node fps.cjs GAME.html [--off=a,b] [--secs=6] [--w=1280 --h=800 --dpr=1] [--scenes=town,fight,r9,forest,edge,walk] [--runs=1] [--out=FILE.json]
// v18 (OPT): 우리 빌드(build-to.sh 조각 · v17/v18 모두)에서 돈다. 마을 = 첫 마을, 싸움 자리는 막힌 곳(물·절벽)이면 가장 가까운 빈 땅,
//   forest = 깊은 숲 지역 한가운데, edge = 깊은 숲 서쪽 끝(v18은 산자락 절벽 곁), walk = 평원을 걷기. --runs=N 이면 장면마다 N번 재서 평균.
// real rAF loop: frame interval (what player sees) and JS time per frame
const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const opt={};const files=[];for(const a of process.argv.slice(2)){const m=/^--([^=]+)(?:=(.*))?$/.exec(a);if(m)opt[m[1]]=m[2]==null?true:m[2];else files.push(a)}
const html=fs.readFileSync(path.resolve(files[0]),'utf8');
const page0='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+html+'</body></html>';
const MAP=fs.existsSync(path.resolve(files[0])+'.map.json')?JSON.parse(fs.readFileSync(path.resolve(files[0])+'.map.json','utf8')):[];
const where=l=>{let f='?',s=1;for(const [n,st] of MAP)if(l+1>=st){f=n;s=st}return f+':'+(l+1-s+1)};
function PROF(profile,sc){const byId=new Map(profile.nodes.map(n=>[n.id,n]));const parent=new Map();for(const n of profile.nodes)for(const c of n.children||[])parent.set(c,n.id);
 const key=n=>{const cf=n.callFrame;return (cf.functionName||'(anon)')+' @'+(cf.url?where(cf.lineNumber):'native')};
 const self=new Map(),incl=new Map();let tot=0,idle=0;for(let i=0;i<profile.samples.length;i++){const d=profile.timeDeltas[i]||0;let id=profile.samples[i];const n0=byId.get(id);const k0=key(n0);if(/\(idle\)/.test(k0)){idle+=d;continue}tot+=d;self.set(k0,(self.get(k0)||0)+d);
  const seen=new Set();while(id!=null){const k=key(byId.get(id));if(!seen.has(k)){seen.add(k);incl.set(k,(incl.get(k)||0)+d)}id=parent.get(id)}}
 const fmt=m=>[...m].sort((a,b)=>b[1]-a[1]).slice(0,+(opt.top||25)).map(([k,v])=>'   '+(v/tot*100).toFixed(1).padStart(5)+'%  '+k).join('\n');
 console.log(`  [${sc}] busy ${(tot/1e3).toFixed(0)}ms idle ${(idle/1e3).toFixed(0)}ms\n  SELF\n${fmt(self)}\n  INCLUSIVE\n${fmt(incl)}`)}
const SECS=+(opt.secs||6),RUNS=+(opt.runs||1),scenes=(opt.scenes||'town,fight,r9,forest,edge').split(',');
(async()=>{const srv=http.createServer((q,r)=>{r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});r.end(page0)});await new Promise(o=>srv.listen(0,'127.0.0.1',o));const port=srv.address().port;
 const b=await chromium.launch({args:['--disable-gpu-vsync','--disable-frame-rate-limit'].concat(opt.sw?['--disable-accelerated-2d-canvas']:[])});
 const out={};
 for(const sc of scenes){const acc=[];for(let run=0;run<RUNS;run++){
 const ctx=await b.newContext({viewport:{width:+(opt.w||1280),height:+(opt.h||800)},deviceScaleFactor:+(opt.dpr||1)});const pg=await ctx.newPage();
 await ctx.addInitScript(o=>{window.__OFF=Object.fromEntries(o.split(',').filter(Boolean).map(k=>[k,1]));
   const raf=window.requestAnimationFrame.bind(window);window.__F={js:[],iv:[],last:0,on:false};
   window.requestAnimationFrame=cb=>raf(t=>{const F=window.__F;const t0=performance.now();cb(t);const t1=performance.now();if(F.on){F.js.push(t1-t0);if(F.last)F.iv.push(t0-F.last)}F.last=t0})},String(opt.off||''));
 await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(`http://127.0.0.1:${port}/`))return r.continue();return r.fulfill({status:200,body:''})});
 const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.goto(`http://127.0.0.1:${port}/`,{waitUntil:'load'});await pg.waitForTimeout(800);
 await pg.click('[data-cls="mage"]');await pg.waitForTimeout(300);
 await pg.evaluate(sc=>{const g=window.__game,P=g.P;P.lvl=60;
   const keep=()=>{P.hp=1e6;P.mp=1e6;P.cd={}};const mhp=Object.getOwnPropertyDescriptor(P,'hp');
   setInterval(()=>{P.hp=99999;P.mp=99999;P.dead=false},50);
   const free=(x,y)=>{if(!g.blockedAt(x,y))return{x,y};for(let r=50;r<1500;r+=50)for(let a=0;a<6.283;a+=.3){const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(!g.blockedAt(px,py))return{x:px,y:py}}return{x,y}};
   if(sc==='town'){const T=(g.TOWNS||g.ALLTOWNS)[0];P.x=T.x;P.y=T.y+110}
   if(sc==='forest'||sc==='field'){g.loadRegion('forest');const p=free(2000,2000);P.x=p.x;P.y=p.y}
   if(sc==='edge'){g.loadRegion('forest');const p=free(500,2000);P.x=p.x;P.y=p.y}
   if(sc==='walk'){g.loadRegion('plains');const p=free(1200,1200);P.x=p.x;P.y=p.y;setInterval(()=>{const nx=P.x+3,ny=P.y+1;if(!g.blockedAt(nx,ny)){P.x=nx;P.y=ny}else P.y+=3},16)}
   if(sc==='fight'||sc==='r9'){const p=free(2600,2600);P.x=p.x;P.y=p.y;// open field away from towns
     const ks=Object.keys(g.TYPES).filter(k=>!g.TYPES[k].boss&&!g.TYPES[k].mini&&!/^m_|^b_|qa/.test(k)).slice(0,12);
     window.__horde=()=>{let n=g.enemies.filter(e=>!e.dead).length;for(;n<50;n++){const a=Math.random()*6.283,d=160+Math.random()*360;const e=g.dgMob(ks[n%ks.length],P.x+Math.cos(a)*d,P.y+Math.sin(a)*d,25);e.aggroed=true}};
     if(sc==='fight'){P.sk.firebolt=10;P.sk.fireburst=5;window.__horde();setInterval(()=>{window.__horde();P.cd={};const es=g.enemies.filter(e=>!e.dead);const e=es[0];if(e){g.tryCast('firebolt',e);g.tryCast('fireburst',e)}},120)}
     else{const r9=Object.values(g.SPELLS).filter(s=>s.cls==='mage'&&s.rank===9&&s.dmg).map(s=>s.id);for(const id of r9)P.sk[id]=20;let k=0;window.__horde();
       setInterval(()=>{window.__horde();P.cd={};const es=g.enemies.filter(e=>!e.dead);const e=es[k%Math.max(1,es.length)]||{x:P.x+200,y:P.y};g.tryCast(r9[k++%r9.length],{x:e.x,y:e.y})},100)}}
 },sc);
 await pg.waitForTimeout(4000);// warm-up (ground bake, sprite bake)
 let cdp=null;if(opt.prof){cdp=await ctx.newCDPSession(pg);await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:200});await cdp.send('Profiler.start')}
 await pg.evaluate(()=>{window.__F.on=true});await pg.waitForTimeout(SECS*1000);
 if(cdp){const {profile}=await cdp.send('Profiler.stop');PROF(profile,sc)}
 const F=await pg.evaluate(()=>{const F=window.__F;F.on=false;const g=window.__game;return {js:F.js,iv:F.iv,en:g.enemies.length,q:null}});
 const st=a=>{const s=a.slice().sort((x,y)=>x-y);return{avg:+(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2),p95:+s[Math.floor(s.length*.95)].toFixed(1),max:+s[s.length-1].toFixed(1)}};
 const o={fps:+(F.iv.length/SECS).toFixed(1),interval:st(F.iv),js:st(F.js),frames:F.iv.length,enemies:F.en,errors:errs.slice(0,3)};acc.push(o);
 console.log(sc.padEnd(6),'fps',o.fps,'interval',JSON.stringify(o.interval),'js',JSON.stringify(o.js),'enemies',F.en,errs.length?'ERR '+errs[0]:'');
 await ctx.close()}
 const av=f=>+(acc.reduce((a,o)=>a+f(o),0)/acc.length).toFixed(2);out[sc]=Object.assign({},acc[acc.length-1],{runs:acc.length,intervalAvg:av(o=>o.interval.avg),jsAvg:av(o=>o.js.avg),fpsAvg:av(o=>o.fps)});
 if(RUNS>1)console.log(sc.padEnd(6),'AVG of',RUNS,'interval',out[sc].intervalAvg,'js',out[sc].jsAvg,'fps',out[sc].fpsAvg)}
 if(opt.out)fs.writeFileSync(opt.out,JSON.stringify(out,null,1));
 await b.close();srv.close()})();
