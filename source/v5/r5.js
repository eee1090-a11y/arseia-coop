/* ---------- v5 그리기: 던전, 소환수, 궤도, 보스 예고 ---------- */
// 던전 바닥 · 벽 → ground.js
function drawAlly(a){const s=a._s;if(!onScreen(s,80))return;ctx.save();ctx.translate(s.x,s.y);
  Kit.shadow(ctx,4,2,a.r*1.4,a.r*.55,1);
  if(a.s.form==='hydra'){const t=time*3;ctx.fillStyle='#3a1a10';ell(0,-4,16,8);
    for(let k=-1;k<=1;k++){const sw=Math.sin(t+k)*4,hx=k*12+sw,hy=-38-Math.abs(k)*-6+(a.lunge>0?6:0);ctx.strokeStyle='#8a2a14';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(k*6,-6);ctx.quadraticCurveTo(k*14,-22,hx,hy);ctx.stroke();
      ctx.fillStyle='#b8401c';ell(hx+a.fx*3,hy,7,5);ctx.globalCompositeOperation='lighter';ctx.fillStyle='#ffd040';circ(hx+a.fx*6,hy-1,1.6);glow(hx+a.fx*9,hy+1,7,'#ff7a2e');ctx.globalCompositeOperation='source-over'}}
  else{const b=Math.sin(a.anim*6)*1.5,l=a.lunge>0?4*a.fx:0;
    ctx.fillStyle='#6a5a44';ell(-9,-6,8,10);ell(9,-6,8,10);
    ctx.fillStyle='#7a6850';ctx.beginPath();ctx.moveTo(-16,-10);ctx.lineTo(16,-10);ctx.lineTo(13,-38+b);ctx.lineTo(-13,-38+b);ctx.closePath();ctx.fill();
    ctx.fillStyle='#5e5040';ell(-20+l,-22+b,7,11);ell(20+l,-22+b,7,11);ctx.fillStyle='#8a7860';ell(0,-46+b,10,8);
    ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,190,90,.9)';circ(-3+a.fx*2,-47+b,1.8);circ(3+a.fx*2,-47+b,1.8);ctx.fillStyle='rgba(255,170,70,.5)';ctx.fillRect(-1.5,-34+b,3,14);ctx.fillRect(-6,-28+b,12,2.5);ctx.globalCompositeOperation='source-over'}
  if(a.hurt>0)hurtFlash(0,-24,a.r*1.4,.5);const w=34,y=a.s.form==='hydra'?-58:-62;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(-w/2-1,y-1,w+2,5);ctx.fillStyle='#6ad06a';ctx.fillRect(-w/2,y,w*clamp(a.hp/a.max,0,1),3);ctx.fillStyle='#c9a46a';ctx.fillRect(-w/2,y+4,w*clamp(a.t/a.s.dur,0,1),1.5);
  ctx.restore()}
function drawCave(d){const s=d._s;ctx.save();ctx.translate(s.x,s.y);
  Kit.shadow(ctx,8,4,78,24,1);
  ctx.fillStyle='#3e3a34';ell(-34,-10,30,22);ell(34,-10,30,22);ell(0,-34,46,30);
  ctx.fillStyle='#55504a';ell(-30,-16,20,12);ell(26,-38,22,12);ell(0,-50,26,12);
  ctx.fillStyle='#050404';ctx.beginPath();ctx.moveTo(-24,0);ctx.quadraticCurveTo(-26,-44,0,-48);ctx.quadraticCurveTo(26,-44,24,0);ctx.closePath();ctx.fill();
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4+.12*Math.sin(time*3);glow(0,-14,30,d.cave&&d.cave.reg?d.cave.torch:'rgba(255,110,60,.6)');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  for(const k of [-1,1]){ctx.fillStyle='#2a2018';ctx.fillRect(k*34-1.5,-40,3,40);ctx.globalCompositeOperation='lighter';glow(k*34,-44,10+Math.sin(time*9+k)*2,d.cave&&d.cave.reg?d.cave.torch:'#ff9a40');ctx.globalCompositeOperation='source-over'}
  ctx.restore()}
function drawV5Glow(){
  // 지면 예고 (보스 기술)
  G();ctx.globalCompositeOperation='lighter';
  for(const w of warns){const k=1-w.t/w.max;ctx.globalAlpha=.5;ctx.strokeStyle=w.col;ctx.lineWidth=4;ctx.beginPath();ctx.arc(w.x,w.y,w.rad,0,6.283);ctx.stroke();ctx.globalAlpha=.18+.2*k;ctx.fillStyle=w.col;circ(w.x,w.y,w.rad*k)}
  if(DG)for(const p of DG.portals){ctx.globalAlpha=.6;ctx.strokeStyle='#9fe0ff';ctx.lineWidth=3;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(p.x,p.y,22+k*10+Math.sin(time*3+k)*3,time*2+k,time*2+k+4.2);ctx.stroke()}ctx.globalAlpha=.25;ctx.fillStyle='#6ac8ff';circ(p.x,p.y,34)}
  ctx.globalAlpha=1;S();
  if(DG)for(const t of DG.torches){const s=W2S(t.x,t.y);if(!onScreen(s,60))continue;ctx.globalAlpha=.7;glow(s.x,s.y-82+Math.sin(time*13+t.x)*1.5,16+Math.sin(time*9+t.y)*2,DG.d.torch);drawTorchFlame(s,t)}
  if(P.orbits&&!P.dead){const o=P.orbits,c=EL[o.s.el];for(let i=0;i<o.n;i++){const a=o.a+i*6.283/o.n,s=W2S(P.x+Math.cos(a)*o.rad,P.y+Math.sin(a)*o.rad);ctx.globalAlpha=.95;glow(s.x,s.y-20,13,c);ctx.globalAlpha=.4;glow(s.x,s.y-20,24,c)}}
  if(P.armor&&!P.dead){const s=W2S(P.x,P.y),c=EL[P.armor.s.el];ctx.globalAlpha=.28+.08*Math.sin(time*6);glow(s.x,s.y-20,P.armor.aura?60:36,c);if(P.armor.aura){ctx.globalAlpha=.25;ctx.strokeStyle=c;ctx.lineWidth=2;G();ctx.beginPath();ctx.arc(P.x,P.y,P.armor.aura,0,6.283);ctx.stroke();S()}}
  for(const e of enemies)if(e.cast>0){const s=e._s||W2S(e.x,e.y);ctx.globalAlpha=.5;glow(s.x,s.y-e.r*(e.sc||1),e.r*1.6,'#ff5a3a')}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
function drawV5Labels(){ctx.textAlign='center';ctx.font='700 13px '+FONT;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';
  if(!DG)for(const c of CAVES){const s=W2S(c.x,c.y);if(!onScreen(s,80))continue;const t=`${c.cave.n} · 던전 Lv${c.cave.lvl+DIFF[P.diff].add}`;ctx.strokeText(t,s.x,s.y-74);ctx.fillStyle='#ffb07a';ctx.fillText(t,s.x,s.y-74)}
  if(DG)for(const p of DG.portals){const s=W2S(p.x,p.y);if(!onScreen(s,60))continue;ctx.strokeText('나가는 문',s.x,s.y-46);ctx.fillStyle='#9fe0ff';ctx.fillText('나가는 문',s.x,s.y-46)}}
function drawDungeonMap(S0,m){
  const px=(P.x-P.y)*KI,py=(P.x+P.y)*KI/2;
  mctx.setTransform(m*KI,m*KI/2,-m*KI,m*KI/2,S0/2-m*px,S0/2-m*py);
  const [r,g,b]=DG.d.floor;mctx.fillStyle=`rgb(${r*2.2|0},${g*2.2|0},${b*2.2|0})`;
  for(const [i,j] of DG.floor)mctx.fillRect(OX+i*TS,OY+j*TS,TS+2,TS+2);
  for(const p of DG.portals){mctx.fillStyle='#6ac8ff';mctx.beginPath();mctx.arc(p.x,p.y,70,0,6.283);mctx.fill()}
  for(const e of enemies){mctx.fillStyle=e.big?'#ff8a3a':e.elite?'#7aa2ff':'#e0574b';const z=e.big?60:24;mctx.fillRect(e.x-z,e.y-z,z*2,z*2)}
  for(const l of loot)if(l.kind==='item'){mctx.fillStyle=RAR[l.item.rar].c;mctx.fillRect(l.x-20,l.y-20,40,40)}}
