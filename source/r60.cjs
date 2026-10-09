const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const F=process.argv[2],OUT=process.argv[3]||'qa-v16';
(async()=>{const b=await chromium.launch();const errs=[];const html=require('fs').readFileSync(F,'utf8');
for(const vp of [{width:1400,height:860,tag:'pc'},{width:390,height:844,tag:'m'}]){
 const p=await b.newPage({viewport:{width:vp.width,height:vp.height}});p.on('pageerror',e=>errs.push(vp.tag+' '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(vp.tag+' console: '+m.text())});
 await p.setContent('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body>'+html+'</body></html>');
 await p.waitForTimeout(800);await p.screenshot({path:`${OUT}/intro-${vp.tag}.png`});
 await p.click('[data-cls="mage"]');await p.waitForTimeout(500);
 const dur=vp.tag==='pc'?62000:15000,t0=Date.now();let nan=0,k=0;const keys=['KeyW','KeyD','KeyS','KeyA'];
 while(Date.now()-t0<dur){const key=keys[k++%4];await p.keyboard.down(key);await p.mouse.click(vp.width/2+80,vp.height/2-40);await p.waitForTimeout(900);await p.keyboard.up(key);
  const bad=await p.evaluate(()=>{const g=window.__game,P=g.P;return !isFinite(P.x)||!isFinite(P.y)||g.enemies.some(e=>!isFinite(e.x)||!isFinite(e.y)||!isFinite(e.hp))});if(bad)nan++;
  if(k===4)await p.screenshot({path:`${OUT}/play-${vp.tag}.png`})}
 await p.evaluate(()=>{const g=window.__game;const T=g.ALLTOWNS[0];g.P.x=T.x;g.P.y=T.y+150});await p.waitForTimeout(3500);await p.screenshot({path:`${OUT}/statue-${vp.tag}.png`});
 await p.keyboard.press('KeyM');await p.waitForTimeout(600);await p.screenshot({path:`${OUT}/map-${vp.tag}.png`});await p.keyboard.press('Escape');
 console.log(vp.tag,'played',Math.round((Date.now()-t0)/1000),'s nan',nan);await p.close()}
console.log('errors',JSON.stringify(errs));await b.close()})();
