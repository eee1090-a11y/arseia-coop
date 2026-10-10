const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const cls of [process.argv[2]]){const p=await b.newPage({viewport:{width:1400,height:860}});p.on('pageerror',e=>errs.push(cls+': '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(cls+' console: '+m.text())});
const html=require('fs').readFileSync(process.env.G||'game-v5.html','utf8');
await p.route('http://t11.test/',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:'<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>'}));await p.goto('http://t11.test/');
await p.waitForTimeout(300);await p.click(`[data-cls="${cls}"]`);await p.waitForTimeout(300);
const r=await p.evaluate((cls)=>{const g=window.__game,P=g.P;P.lvl=40;const bad=[];let n=0;
 for(const id in g.SPELLS){const s=g.SPELLS[id];P.sk[id]=1;if(s.cls!==cls||!(s.mult>0)||['heal','hot','shield'].includes(s.kind))continue;let ok=0;n++;if(g.clsGearFor){g.clsGearFor(id);if(P.st.dex!=null&&P.st.str!=null)P.st.dex=Math.max(P.st.dex,600)}/* 전사·궁수: 무기를 쥐여 주고 명중률을 상한(97%)으로 — 이 점검은 '닿는가'를 본다 */
  for(let k=0;k<3;k++){P.x=1500;P.y=3600;P.mp=9999;P.cd={};P.dead=false;P.hp=9999;g.enemies.length=0;
   for(let j=0;j<4;j++){g.spawnEnemy();const e=g.enemies[g.enemies.length-1];e.x=P.x+120+j*25;e.y=P.y+(j%2?20:-20);e.hp=e.max=99999;e.aggroed=true;}/* v26: 비선공 몬스터도 싸우는 중으로 (갑옷 · 둘레 기술이 맞는지 보려면 몬스터가 다가와야 함) */
   const E0=g.enemies.slice();const tot=()=>E0.reduce((a,e)=>a+e.hp,0);const h=tot();
   if(g.JOB2){P.job2=s.job2||Object.keys(g.JOB2[cls])[0];P.lvl=Math.max(40,s.upLv||0);P.st.spi=Math.max(P.st.spi||0,400);P.mp=9999}if(window.__j3){if(s.job3){P.job3=s.job3;P.job2=window.__j3.JOB2_OF3[s.job3];P.st.spi=Math.max(P.st.spi||0,900);P.mp=99999}else P.job3=null}/* v20: 3차 기술은 3차 전직(그 갈래)이어야 씀 *//* v19: 2차 기술·상위 기술은 전직하고 그 레벨이어야 씀 · 레벨에 따라 오른 마나 값을 낼 정신력 */
   g.tryCast(id,{x:g.enemies[0].x,y:g.enemies[0].y});for(let i=0;i<(s.kind==='summon'||s.kind==='armor'?400:s.charge?Math.ceil((s.charge.max+2.5)/.016):160+Math.ceil((s.delay||0)/.016));i++){g.update(0.016);if(i%60==0)g.render()}if(tot()<h)ok++;}
  g.allies.length=0;P.armor=null;P.orbits=null;if(ok<2)bad.push(id+':'+ok);}
 return {n,bad}},cls);console.log(cls,'tested',r.n,'failing:',JSON.stringify(r.bad));}
console.log('errors',errs);await b.close()})();
