// node xsave.cjs game-v17.html game-v18.html : v17 캐릭터를 v18에서 불러오기 + v18 4직업 저장 왕복
const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const A17=fs.readFileSync(path.resolve(process.argv[2]),'utf8'),A18=fs.readFileSync(path.resolve(process.argv[3]),'utf8');
(async()=>{const srv=http.createServer((q,r)=>{r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});r.end(q.url.startsWith('/v17')?A17:A18)});await new Promise(ok=>srv.listen(0,'127.0.0.1',ok));const port=srv.address().port;
const b=await chromium.launch();const errs=[];const res=[];
const sum=`(()=>{const P=window.__game.P;return{cls:P.cls,lvl:P.lvl,gold:P.gold,sp:P.sp,ap:P.ap,sk:Object.entries(P.sk).filter(e=>e[1]>0).length,gear:Object.values(P.gear||{}).filter(Boolean).length,bag:P.bag.length,pot:P.pot.hp+'/'+P.pot.mp,diff:P.diff,q:P.q&&P.q.i}})()`;
for(const cls of ['mage','priest']){
  const ctx=await b.newContext();const pg=await ctx.newPage();pg.on('pageerror',e=>errs.push('v17:'+e.message));
  await pg.goto(`http://127.0.0.1:${port}/v17`,{waitUntil:'load'});await pg.waitForTimeout(500);await pg.click(`[data-cls="${cls}"]`);await pg.waitForTimeout(400);
  const s17=await pg.evaluate(c=>{const g=window.__game,P=g.P;P.lvl=44;P.gold=23456;P.sp=4;P.ap=2;P.pot.hp=11;P.pot.mp=6;P.diff=1;P.q={i:9,st:1,c:{}};
    let n=0;for(const id in g.SPELLS||{}){}return JSON.stringify(g.saveData())},cls);
  const before=await pg.evaluate(sum);await ctx.close();
  const c2=await b.newContext();const p2=await c2.newPage();p2.on('pageerror',e=>errs.push('v18:'+e.message));
  await p2.goto(`http://127.0.0.1:${port}/`,{waitUntil:'load'});await p2.waitForTimeout(500);
  const r=await p2.evaluate(([s,sumSrc])=>{const g=window.__game;localStorage.setItem('arseia-char-0',s);const d=g.readSlot(0);if(!d)return{err:'readSlot null'};const ok=g.load(d,0);
    for(let i=0;i<180;i++)g.update(1/60);g.render();const a=eval(sumSrc);const d2=JSON.stringify(g.saveData());localStorage.setItem('arseia-char-1',d2);const ok2=g.load(g.readSlot(1),1);const b2=eval(sumSrc);const d3=JSON.stringify(g.saveData());
    const P=g.P;return{ok,ok2,after:a,round:b2,roundSame:d2===d3,nan:!isFinite(P.x)||!isFinite(P.hp),keys:Object.keys(localStorage).sort()}},[s17,sum]);
  res.push({cls,before,...r});await c2.close()}
for(const cls of ['warrior','archer']){const ctx=await b.newContext();const pg=await ctx.newPage();pg.on('pageerror',e=>errs.push('v18:'+e.message));
  await pg.goto(`http://127.0.0.1:${port}/`,{waitUntil:'load'});await pg.waitForTimeout(500);await pg.click(`[data-cls="${cls}"]`);await pg.waitForTimeout(400);
  const r=await pg.evaluate(sumSrc=>{const g=window.__game,P=g.P;P.lvl=33;P.gold=777;for(let i=0;i<120;i++)g.update(1/60);const d1=JSON.stringify(g.saveData());localStorage.setItem('arseia-char-5',d1);const ok=g.load(g.readSlot(5),5);const d2=JSON.stringify(g.saveData());return{ok,same:d1===d2,s:eval(sumSrc)}},sum);
  res.push({cls,...r});await ctx.close()}
console.log(JSON.stringify(res,null,1));console.log('errors',errs);await b.close();srv.close()})();
