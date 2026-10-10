
/* ---------- rendering ---------- */
function ell(x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.283);ctx.fill()}
function circ(x,y,r){ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill()}
function poly(pts,fill){ctx.fillStyle=fill;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill()}
const up=(p,h)=>({x:p.x,y:p.y-h});
// 빛 번짐은 색마다 한 번 구운 그림을 붙인다 (매 프레임 그라디언트를 만들지 않음)
function glow(x,y,r,col){if(r>0)ctx.drawImage(Kit.glowCv(col),x-r,y-r,r*2,r*2)}
// 맞았을 때 번쩍임: filter 대신 흰 빛을 덧칠한다
function hurtFlash(x,y,r,a){const pa=ctx.globalAlpha,po=ctx.globalCompositeOperation;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;glow(x,y,r,'rgba(255,255,255,.9)');ctx.globalAlpha=pa;ctx.globalCompositeOperation=po}
function polyY(pts,fill,y0,y1){const h=(y1-y0)||1;ctx.save();ctx.translate(0,y0);ctx.scale(1,h);ctx.fillStyle=fill;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,(p.y-y0)/h):ctx.moveTo(p.x,(p.y-y0)/h));ctx.closePath();ctx.fill();ctx.restore()}
function strokePts(pts,w,col,a){ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke()}
let shx=0,shy=0;
const G=()=>ctx.setTransform(DPR*KI,DPR*KI/2,-DPR*KI,DPR*KI/2,DPR*(-camX+shx),DPR*(-camY+shy));
const S=()=>ctx.setTransform(DPR,0,0,DPR,DPR*shx,DPR*shy);
function onScreen(s,m){return s.x>-m&&s.x<W+m&&s.y>-m&&s.y<H+m*1.6}
function render(){
  frameN++;chunkBudget=paused?6:3;SC.bakeLeft=paused?16:4;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='low';
  shx=shake>0?rnd(-shake,shake):0;shy=shake>0?rnd(-shake,shake):0;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#050506';ctx.fillRect(0,0,cv.width,cv.height);
  /* 땅 */
  G();
  const cs=[S2W(0,0),S2W(W,0),S2W(0,H),S2W(W,H)];
  const cx0=Math.floor(Math.min(...cs.map(c=>c.x))/CH),cx1=Math.floor(Math.max(...cs.map(c=>c.x))/CH),cy0=Math.floor(Math.min(...cs.map(c=>c.y))/CH),cy1=Math.floor(Math.max(...cs.map(c=>c.y))/CH);
  if(DG)drawDungeonFloor();else drawGround(cx0,cx1,cy0,cy1);
  drawDecalsFields();
  S();drawGroundFx();
  /* 물체: 깊이(x+y) 순서 */
  S();
  for(const l of loot){const s=W2S(l.x,l.y);if(onScreen(s,40))drawLoot(l,s,false)}
  if(typeof FXP!=='undefined')FXP.ground(ctx,W2S);// v18 덫·깃발
  const vis=[];
  const DVIS=DG?DG.walls:decoVisible(cx0,cx1,cy0,cy1,[]);for(const d of DVIS){const s=W2S(d.x,d.y);if(onScreen(s,200)){if(d.zh){if(d.cell&&d.cell._front)continue;s.y-=d.zh}d._s=s;vis.push(d)}}
  if(!DG)terrVis(vis);// v18 절벽 칸: 화면에 걸친 칸만 (terrain.js)
  for(const e of enemies){e._s=W2S(e.x,e.y);vis.push(e)}
  for(const a of allies){a._s=W2S(a.x,a.y);vis.push(a)}
  if(!P.dead){P._s=W2S(P.x,P.y);vis.push(P)}
  if(NET.on&&!IN)for(const r of NET.peers.values())if(!r.dead&&netSame(r)){r._s=W2S(r.x,r.y);vis.push(r)}
  vis.sort((a,b)=>(a.zk!=null?a.zk:a.x+a.y)-(b.zk!=null?b.zk:b.x+b.y));
  drawCorpses();
  for(const o of vis){if(o===P)drawHero();else if(o.remote)drawRemote(o);else if(o.ally)drawAlly(o);else if(o.wall)drawWall(o);else if(o.cliff)drawCliff(o);else if(o.k==='cave')drawCave(o);else if(o.k in TYPES)drawEnemy(o);else drawDecor(o)}
  /* 어둠과 빛 */
  const zl=DG?DG.lvl:zoneLevel(P.x,P.y),dark=DG?.84:zl===0?.26:Math.min(.75,.4+zl*.007+P.diff*.05);
  lctx.setTransform(1,0,0,1,0,0);lctx.globalCompositeOperation='source-over';lctx.globalAlpha=1;lctx.clearRect(0,0,lc.width,lc.height);
  lctx.fillStyle=`rgba(3,4,10,${dark})`;lctx.fillRect(0,0,lc.width,lc.height);if(fogOn())atmosLayer(lctx,lc);lctx.globalCompositeOperation='destination-out';
  const Lt=(x,y,r,a)=>{if(x<-r||x>W+r||y<-r||y>H+r)return;lctx.globalAlpha=a==null?1:clamp(a,0,1);lctx.drawImage(LS,(x-r)/2,(y-r*.62)/2,r,r*.62)};
  if(!P.dead)Lt(P._s.x,P._s.y-20,420,1);
  if(NET.on)for(const r of NET.peers.values())if(r._s&&!r.dead&&netSame(r))Lt(r._s.x,r._s.y-20,340,.9);
  for(const d of DG?DG.torches:LIGHTS){const s=W2S(d.x,d.y);Lt(s.x,s.y-20,d.light*2,.9)}
  groundLights(Lt);
  if(DG)for(const p of DG.portals){const s=W2S(p.x,p.y);Lt(s.x,s.y,260,.9)}
  if(P.orbits)Lt(P._s.x,P._s.y-20,P.orbits.rad*3.4,.6);for(const a of allies)if(a.s.form==='hydra'){const s=W2S(a.x,a.y);Lt(s.x,s.y-30,160,.7)}
  for(const p of projs){const s=P3(p);Lt(s.x,s.y,p.owner==='p'?FXR.lt(p):80,.8)}
  for(const f of fields){const s=W2S(f.x,f.y);Lt(s.x,s.y,f.rad*2.4,.7)}
  for(const b of pillars){const s=W2S(b.x,b.y);Lt(s.x,s.y-60,300,b.life/b.max)}
  for(const b of beams){const s=W2S((b.x1+b.x2)/2,(b.y1+b.y2)/2);Lt(s.x,s.y,360,b.life/b.max)}
  for(const b of bolts){if(b.delay>0)continue;const s=P3(b.b);Lt(s.x,s.y,b.w*70,b.life/b.max)}
  for(const e of enemies)if(e.burn){const s=e._s;Lt(s.x,s.y-10,90,.6)}
  for(const m of pend)if(!m.s.mini){const s=W2S(m.x,m.y);Lt(s.x,s.y,m.s.rad*2,1-m.t/m.max)}
  for(const r of rings){if(r.faint)continue;const s=W2S(r.x,r.y);Lt(s.x,s.y,r.r*2.4,clamp(r.life*2,0,.7))}
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(lc,0,0,cv.width,cv.height);
  if(fogOn())drawAtmos(zl);// v20 등불 빛 번짐 (terrain.js) · 안개·가장자리 그늘은 위 어둠 층에 같이 그림(atmosLayer)
  /* 빛나는 마법 효과(어둠 위에) */
  G();ctx.globalCompositeOperation='lighter';
  for(const c of circles)drawRuneCircle(c);
  castDraw();
  for(const f of fields){const col=f.s.heal?'#9fe39a':EL[f.s.el],fade=Math.min(1,f.t*2,(f.max-f.t)*4);ctx.globalAlpha=.55*fade;ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,f.rad,0,6.283);ctx.stroke();
    ctx.globalAlpha=.1*fade;ctx.fillStyle=col;circ(f.x,f.y,f.rad*.8);
    if(f.s.el==='holy'){ctx.globalAlpha=.5*fade;ctx.beginPath();ctx.arc(f.x,f.y,f.rad*.7,0,6.283);ctx.moveTo(f.x-f.rad*.5,f.y);ctx.lineTo(f.x+f.rad*.5,f.y);ctx.moveTo(f.x,f.y-f.rad*.5);ctx.lineTo(f.x,f.y+f.rad*.5);ctx.stroke()}}
  for(const r of rains){ctx.globalAlpha=.3;ctx.strokeStyle=EL[r.s.el];ctx.lineWidth=2;ctx.setLineDash([8,10]);ctx.beginPath();ctx.arc(r.x,r.y,r.rad,0,6.283);ctx.stroke();ctx.setLineDash([])}
  for(const m of pend){if(m.s.mini)continue;const k=1-m.t/m.max;ctx.strokeStyle=EL[m.s.el];ctx.globalAlpha=.4+.4*k;ctx.lineWidth=3;ctx.beginPath();ctx.arc(m.x,m.y,m.s.rad,0,6.283);ctx.stroke();ctx.globalAlpha=.1+.15*k;ctx.fillStyle=EL[m.s.el];circ(m.x,m.y,m.s.rad*k)}
  for(const r of rings){ctx.strokeStyle=r.col;ctx.globalAlpha=clamp(r.life*2,0,1)*(r.faint?.32:1);ctx.lineWidth=r.faint?2:5;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,6.283);ctx.stroke()}
  ctx.globalAlpha=1;
  drawV5Glow();G();ctx.globalCompositeOperation='lighter';
  S();
  if(P.storm&&!P.dead){const s=P._s,a=Math.min(1,P.storm.t);ctx.globalCompositeOperation='source-over';
    for(let i=0;i<7;i++){const ox=Math.sin(time*.7+i*1.7)*120,oy=-300+Math.cos(time*.5+i)*14;ctx.globalAlpha=.35*a;ctx.fillStyle='#14121c';ell(s.x+ox,s.y+oy,90,34)}
    ctx.globalCompositeOperation='lighter';if(R()<.15){ctx.globalAlpha=.25*a;glow(s.x+rnd(-140,140),s.y-300,90,'#9a7cff')}}
  ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
  for(const p of projs){const s=P3(p);if(p.owner==='e'){drawEProj(p,s);continue}FXR.draw(ctx,p,s,DPR,DPR*shx,DPR*shy,W2S)}
  FXR.drawImpacts(ctx,DPR,DPR*shx,DPR*shy,W2S);FXB.draw(ctx,W2S);if(typeof FXP!=='undefined')FXP.draw(ctx,W2S);ctx.globalAlpha=1;
  for(const m of pend){if(!m.s.fall)continue;const k=1-m.t/m.max,s=W2S(m.x,m.y),big=m.s.mini?12:Math.max(26,m.s.rad*.3);glow(s.x-(m.s.mini?90:220)*(1-k),s.y-(m.s.mini?220:420)*(1-k),big,m.s.el==='light'?'#fff1a0':'#ff8a2a')}
  for(const b of pillars){const a=clamp(b.life/b.max,0,1),s=W2S(b.x,b.y),w=b.w*1.1;const pe=SC.get('fx/pillar/'+b.col,16,128,8,128,g=>{const gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,b.col);g.fillStyle=gr;g.fillRect(0,0,16,128)},{force:1,scale:1});ctx.globalAlpha=a;ctx.drawImage(pe.cv,s.x-w/2,s.y-460,w,460);ctx.fillStyle='#fff';ctx.fillRect(s.x-w/6,s.y-460,w/3,460);ctx.globalAlpha=a*.6;ctx.fillStyle=b.col;ell(s.x,s.y,w*.9,w*.45)}
  ctx.globalAlpha=1;
  for(const b of beams)drawBeam(b);
  for(const p of parts){const s=P3(p);ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.col;circ(s.x,s.y,p.sz)}
  ctx.globalAlpha=1;
  for(const b of bolts)drawBolt(b);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  /* 글자, 체력바, 아이템 이름 */
  drawV5Labels();
  for(const l of loot){const s=W2S(l.x,l.y);if(onScreen(s,60))drawLoot(l,s,true)}
  for(const e of enemies){const t=TYPES[e.k],sc=e.sc||(e.elite?1.25:1),s=e._s;if(e.big)continue;if(!onScreen(s,60))continue;
    if(e.stunT>0&&e.freezeT<=0){ctx.fillStyle='#ffe066';for(let i=0;i<3;i++){const aa=time*5+i*2.09;circ(s.x+Math.cos(aa)*10,s.y-e.r*sc*2.2-6+Math.sin(aa)*3,2)}}
    if(e.hp<e.max||e.elite){const w=30*sc,y=s.y-e.r*sc*2.4-10;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,5);ctx.fillStyle=e.elite?'#6f9bff':'#c0362c';ctx.fillRect(s.x-w/2,y,w*clamp(e.hp/e.max,0,1),3)}}
  ctx.textAlign='center';
  for(const t of texts){const s=P3(t);ctx.globalAlpha=clamp(t.life*1.6,0,1);ctx.font=t.chant?`700 14px ${DISPLAY}`:`${t.big?'800 18px':'700 13px'} ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(t.t,s.x,s.y);ctx.fillStyle=t.c;ctx.fillText(t.t,s.x,s.y)}
  ctx.globalAlpha=1;
  if(window.COOP_SERVER)drawSays();
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if(!P.dead&&P.hp/maxHp()<.3){const a=.25+.15*Math.sin(time*6);const ve=SC.get(`fx/vignette/${W|0}x${H|0}`,W,H,0,0,g=>{const rv=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.7);rv.addColorStop(0,'rgba(120,0,0,0)');rv.addColorStop(1,'rgba(140,10,10,1)');g.fillStyle=rv;g.fillRect(0,0,W,H)},{force:1,scale:.5});ctx.globalAlpha=a;ctx.drawImage(ve.cv,0,0,W,H);ctx.globalAlpha=1}
  if(flash&&flash.a>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=flash.a;ctx.fillStyle=flash.col;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  if(banner){const a=clamp(Math.min(banner.life*2,(banner.max-banner.life)*6),0,1),y=H*.22;ctx.globalAlpha=a;ctx.textAlign='center';ctx.font=`800 ${Math.min(40,W/12)}px ${DISPLAY}`;ctx.lineWidth=6;ctx.strokeStyle='rgba(0,0,0,.75)';ctx.globalAlpha=a*.25;ctx.lineWidth=16;ctx.strokeStyle=banner.col;ctx.strokeText(banner.t,W/2,y);ctx.globalAlpha=a;ctx.lineWidth=6;ctx.strokeStyle='rgba(0,0,0,.75)';ctx.strokeText(banner.t,W/2,y);ctx.fillStyle=banner.col;ctx.fillText(banner.t,W/2,y);ctx.font=`13px ${FONT}`;ctx.fillStyle='#e8e2d2';ctx.lineWidth=3;ctx.strokeText(banner.sub,W/2,y+24);ctx.fillText(banner.sub,W/2,y+24);ctx.globalAlpha=1}
  if(joy){ctx.strokeStyle='rgba(236,230,214,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(joy.ox,joy.oy,44,0,6.283);ctx.stroke();const dx=joy.x-joy.ox,dy=joy.y-joy.oy,l=Math.hypot(dx,dy),f=l>44?44/l:1;ctx.fillStyle='rgba(236,230,214,.35)';circ(joy.ox+dx*f,joy.oy+dy*f,18)}
}
function drawBolt(b){
  if(b.delay>0)return;
  if(b.flick&&time-b.gen>.06){b.paths=zapPaths(b.a,b.b,b.o);b.gen=time}
  const a=clamp(b.life/b.max*1.8,0,1);
  for(const p of b.paths){const pts=p.pts.map(P3),w=b.w*p.w;
    strokePts(pts,w*6,b.glow,.16*a);strokePts(pts,w*2.2,b.glow,.75*a);strokePts(pts,Math.max(.8,w*.8),b.col,a)}
  ctx.globalAlpha=1}
function drawBeam(b){
  const a=clamp(b.life/b.max*2,0,1),A=P3({x:b.x1,y:b.y1,z:b.z}),B=P3({x:b.x2,y:b.y2,z:b.z-4});
  if(b.el==='storm'){if(b.rank>=6){const st=stormStyle(b.rank);strokePts([A,B],b.w*2.6,st.glow,.35*a);strokePts([A,B],b.w*.5,'#fff',.9*a);glow(B.x,B.y,40*a+10,st.glow)}glow(A.x,A.y,18,'#cfe0ff');ctx.globalAlpha=1;return}
  if(b.el==='earth')return;
  if(b.el==='holy'||b.el==='light'){strokePts([A,B],b.w*3,b.col,.3*a);strokePts([A,B],b.w*1.4,b.col,.8*a);strokePts([A,B],b.w*.45,'#fff',a);
    for(let i=0;i<6;i++){const f=R(),x=A.x+(B.x-A.x)*f,y=A.y+(B.y-A.y)*f;ctx.globalAlpha=a*.8;ctx.fillStyle='#fff';circ(x+rnd(-b.w,b.w),y+rnd(-b.w,b.w),1.5)}ctx.globalAlpha=1;return}
  strokePts([A,B],b.w*1.4,b.col,a);strokePts([A,B],b.w*.35,'#fff',a);ctx.globalAlpha=1}
function drawHero(){
  const s=P._s;
  drawFigure(ctx,P,s.x,s.y,PK,{bs:Math.max(1,DPR)*HS*PK});
  ctx.save();ctx.translate(s.x,s.y);ctx.scale(PK,PK);ctx.globalCompositeOperation='lighter';
  if(P.shield>0||P.invT>0){const c=P.invT>0?'255,227,154':'143,216,255';ctx.strokeStyle=`rgba(${c},.75)`;ctx.lineWidth=2;ctx.fillStyle=`rgba(${c},.13)`;ctx.beginPath();ctx.arc(0,-28,32+Math.sin(time*5)*1.5,0,6.283);ctx.fill();ctx.stroke()}
  if(P.ward){ctx.strokeStyle='rgba(255,227,154,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,-74+Math.sin(time*3)*2,7,0,6.283);ctx.stroke()}
  ctx.globalCompositeOperation='source-over';
  ctx.restore();
}
function treePal(zl){return zl<4?['#1c3014','#2a4620','#3c5e2c','#56783a']:zl<12?['#16241a','#203624','#2c462c','#3e5a36']:['#22261a','#2e3222','#3a3e2a','#4c4e36']}
function drawDecor(d){
  const s=d._s;
  if(d.k==='house'||d.k==='mill'){drawHouse(d);return}
  if(d.k==='npc'){drawNpc(d);return}
  if(d.k==='shop'&&d.stall){drawShop(d);return}
  if(drawRegionDecor(d))return;
  ctx.save();ctx.translate(s.x,s.y);ctx.scale(d.s,d.s);
  switch(d.k){
    case'tree':{ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(14,3,28,9,.25,0,6.283);ctx.fill();
      ctx.fillStyle='#2a1e14';ctx.fillRect(-3,-16,6,18);ctx.fillStyle='#1a120a';ctx.fillRect(1,-16,2,18);
      if(d.zl>=14&&d.v<.6){ctx.strokeStyle='#2e241c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(-12,-30);ctx.moveTo(0,-16);ctx.lineTo(10,-36);ctx.moveTo(-6,-22);ctx.lineTo(-16,-24);ctx.moveTo(5,-26);ctx.lineTo(14,-28);ctx.stroke();break}
      const c=treePal(d.zl);
      ctx.fillStyle=c[0];circ(0,-28,20);circ(-11,-23,13);circ(11,-23,13);
      ctx.fillStyle=c[1];circ(-5,-34,14);circ(7,-31,13);
      ctx.fillStyle=c[2];circ(-8,-40,9);circ(3,-42,8);
      ctx.fillStyle=c[3];circ(-10,-43,4);circ(-3,-46,3);break}
    case'bush':{const c=treePal(d.zl);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(6,2,16,5,.25,0,6.283);ctx.fill();ctx.fillStyle=c[0];circ(-6,-6,8);circ(6,-6,8);circ(0,-10,9);ctx.fillStyle=c[2];circ(-3,-13,4);break}
    case'stump':{ctx.fillStyle='rgba(0,0,0,.35)';ell(5,2,10,4);ctx.fillStyle='#3a2a1a';ctx.fillRect(-6,-8,12,9);ctx.fillStyle='#6a5236';ell(0,-8,6,3);break}
    case'rock':{ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(6,2,16,5,.25,0,6.283);ctx.fill();const c=d.zl>=12?['#3e3a36','#58524c','#6e6860']:['#4e4c46','#6e6c64','#8a887e'];
      ctx.fillStyle=c[0];ctx.beginPath();ctx.moveTo(-13,0);ctx.lineTo(-10,-10);ctx.lineTo(-2,-15);ctx.lineTo(9,-11);ctx.lineTo(13,0);ctx.closePath();ctx.fill();
      ctx.fillStyle=c[1];ctx.beginPath();ctx.moveTo(-10,-10);ctx.lineTo(-2,-15);ctx.lineTo(2,-5);ctx.lineTo(-11,-2);ctx.closePath();ctx.fill();ctx.fillStyle=c[2];ctx.beginPath();ctx.moveTo(-6,-12);ctx.lineTo(-2,-15);ctx.lineTo(0,-10);ctx.closePath();ctx.fill();break}
    case'ruin':{ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(12,2,22,6,.25,0,6.283);ctx.fill();ctx.fillStyle='#6a645a';ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(-8,-34-d.v*20);ctx.lineTo(-2,-30-d.v*24);ctx.lineTo(3,-38-d.v*16);ctx.lineTo(8,-32);ctx.lineTo(8,0);ctx.closePath();ctx.fill();
      ctx.fillStyle='#4a4640';ctx.fillRect(2,-30,6,30);ctx.fillStyle='#5a544a';ctx.fillRect(-11,-4,22,5);ctx.fillRect(12,-5,10,5);break}
    case'tomb':{ctx.fillStyle='rgba(0,0,0,.4)';ell(6,2,12,4);ctx.fillStyle='#5a564e';ctx.beginPath();ctx.moveTo(-7,0);ctx.lineTo(-7,-16);ctx.arc(0,-16,7,Math.PI,0);ctx.lineTo(7,0);ctx.closePath();ctx.fill();ctx.fillStyle='#3a3630';ctx.fillRect(-1,-19,2,10);ctx.fillRect(-4,-16,8,2);break}
    case'lamp':{ctx.fillStyle='rgba(0,0,0,.4)';ell(8,1,10,3);ctx.fillStyle='#1e1a16';ctx.fillRect(-1.5,-34,3,35);ctx.fillRect(-5,-38,10,5);ctx.globalCompositeOperation='lighter';const gr=grad('lamp',()=>{const gr=ctx.createRadialGradient(0,-36,0,0,-36,44);gr.addColorStop(0,'rgba(255,200,110,.9)');gr.addColorStop(1,'rgba(0,0,0,0)');return gr});ctx.fillStyle=gr;circ(0,-36,44);ctx.globalCompositeOperation='source-over';break}
    case'shop':{ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(10,8,42,11,.2,0,6.283);ctx.fill();
      ctx.fillStyle='#5a3a7a';ctx.fillRect(-6,-28,12,18);ctx.fillStyle='#e8c09a';circ(0,-32,5.5);ctx.fillStyle='#2a1e12';ell(0,-36,8,2.5);ctx.fillRect(-4,-43,8,7);
      ctx.fillStyle='#6a4628';ctx.fillRect(-32,-12,64,20);ctx.fillStyle='#4a2e18';ctx.fillRect(-32,-12,64,4);ctx.fillStyle='#3a2414';ctx.fillRect(10,-8,22,16);
      ctx.fillStyle='#d0443a';circ(-20,-15,3.5);ctx.fillStyle='#3a6ad6';circ(-11,-15,3.5);ctx.fillStyle='#e8c35a';circ(13,-15,3);ctx.fillStyle='#b9a2ff';ctx.fillRect(19,-19,3,8);
      ctx.fillStyle='#3a2a1a';ctx.fillRect(-32,-54,3,44);ctx.fillRect(29,-54,3,44);
      for(let i=0;i<6;i++){ctx.fillStyle=i%2?'#d8d0c0':'#8a2a22';ctx.fillRect(-36+i*12,-58,12,10)}
      ctx.font='700 13px '+FONT;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('상점',0,-66);ctx.fillStyle='#ffd27a';ctx.fillText('상점',0,-66);break}
    case'stash':{ctx.fillStyle='rgba(0,0,0,.42)';ctx.beginPath();ctx.ellipse(8,5,34,9,.2,0,6.283);ctx.fill();
      // 나무 상자: 앞면(밝음) · 옆면(어두움) · 뚜껑, 철띠와 빛나는 자물쇠
      ctx.fillStyle='#7a5230';ctx.beginPath();ctx.moveTo(-24,-4);ctx.lineTo(10,6);ctx.lineTo(10,-20);ctx.lineTo(-24,-30);ctx.closePath();ctx.fill();
      ctx.fillStyle='#4e321c';ctx.beginPath();ctx.moveTo(10,6);ctx.lineTo(28,-4);ctx.lineTo(28,-30);ctx.lineTo(10,-20);ctx.closePath();ctx.fill();
      ctx.fillStyle='#93663c';ctx.beginPath();ctx.moveTo(-24,-30);ctx.lineTo(10,-20);ctx.quadraticCurveTo(20,-34,28,-30);ctx.lineTo(-6,-40);ctx.quadraticCurveTo(-18,-44,-24,-30);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(40,24,12,.55)';ctx.lineWidth=1;for(const k of [.33,.66]){ctx.beginPath();ctx.moveTo(-24,-4-26*k);ctx.lineTo(10,6-26*k);ctx.stroke()}
      ctx.fillStyle='#3a3632';for(const x0 of [-17,2]){ctx.beginPath();ctx.moveTo(x0,-6+(x0+24)*.29);ctx.lineTo(x0+4,-5+(x0+28)*.29);ctx.lineTo(x0+4,-33+(x0+28)*.29);ctx.lineTo(x0,-34+(x0+24)*.29);ctx.closePath();ctx.fill()}
      ctx.fillStyle='#2a2622';ctx.beginPath();ctx.moveTo(10,6);ctx.lineTo(13,4);ctx.lineTo(13,-22);ctx.lineTo(10,-20);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(255,220,160,.35)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-24,-30);ctx.quadraticCurveTo(-18,-44,-6,-40);ctx.stroke();
      ctx.fillStyle='#e8c35a';ctx.fillRect(-9,-21,6,7);ctx.fillStyle='#7a5a1a';ctx.fillRect(-7,-18,2,3);
      ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(255,210,120,${.18+.08*Math.sin(time*2.4)})`;circ(-6,-18,9);ctx.globalCompositeOperation='source-over';
      ctx.font='700 13px '+FONT;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('창고',2,-54);ctx.fillStyle='#ffd27a';ctx.fillText('창고',2,-54);break}
    case'gate':{ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(10,4,38,9,.2,0,6.283);ctx.fill();
      for(const [x0,c] of [[-28,'#7a7468'],[18,'#5a564c']]){ctx.fillStyle=c;ctx.fillRect(x0,-52,10,56)}ctx.fillStyle='#8a8478';ctx.fillRect(-32,-62,64,11);ctx.fillStyle='#5a564c';ctx.fillRect(-32,-53,64,2);
      ctx.fillStyle='#b9a2ff';for(let i=0;i<5;i++)ctx.fillRect(-20+i*9,-59,3,5);
      ctx.globalCompositeOperation='lighter';const sp=time*2;for(let i=0;i<3;i++){ctx.strokeStyle=`rgba(185,162,255,${.6-i*.15})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-25,14-i*3,25-i*6,0,sp*(i%2?-1:1)+i,sp*(i%2?-1:1)+i+4.6);ctx.stroke()}
      const gr=grad('gate',()=>{const gr=ctx.createRadialGradient(0,-25,0,0,-25,26);gr.addColorStop(0,'rgba(185,162,255,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');return gr});ctx.fillStyle=gr;ell(0,-25,17,29);ctx.globalCompositeOperation='source-over';
      ctx.font='700 13px '+FONT;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('짝문',0,-70);ctx.fillStyle='#c9b4ff';ctx.fillText('짝문',0,-70);break}
    case'spire':{ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(24,4,34,9,.25,0,6.283);ctx.fill();ctx.fillStyle='#d8d2c6';ctx.fillRect(-10,-90,20,92);ctx.fillStyle='#a8a090';ctx.fillRect(2,-90,8,92);
      ctx.fillStyle='#24325c';ctx.beginPath();ctx.moveTo(-13,-90);ctx.lineTo(0,-130);ctx.lineTo(13,-90);ctx.fill();ctx.fillStyle='#16203a';ctx.beginPath();ctx.moveTo(0,-130);ctx.lineTo(13,-90);ctx.lineTo(2,-90);ctx.fill();ctx.fillStyle='#ffd27a';ctx.fillRect(-4,-66,5,8);ctx.fillRect(-4,-40,5,8);break}
    case'fountain':{ctx.fillStyle='#6a645a';ell(0,0,72,36);ctx.fillStyle='#4a463e';ell(0,4,72,36);ctx.fillStyle='#7a7468';ell(0,-2,72,35);ctx.fillStyle='#1f4a6a';ell(0,-3,62,29);
      ctx.strokeStyle='rgba(200,236,255,.5)';ctx.lineWidth=1.5;for(let i=0;i<3;i++){const r=((time*14+i*17)%56);ctx.globalAlpha=1-r/56;ctx.beginPath();ctx.ellipse(0,-3,r,r*.5,0,0,6.283);ctx.stroke()}ctx.globalAlpha=1;
      ctx.fillStyle='#8a8478';ctx.fillRect(-5,-34,10,31);ctx.fillStyle='#6a645a';ctx.fillRect(1,-34,4,31);ctx.globalCompositeOperation='lighter';const gr=grad('fountain',()=>{const gr=ctx.createRadialGradient(0,-38,0,0,-38,30);gr.addColorStop(0,'rgba(170,230,255,.9)');gr.addColorStop(1,'rgba(0,0,0,0)');return gr});ctx.fillStyle=gr;circ(0,-38,30);ctx.globalCompositeOperation='source-over';break}
  }
  ctx.restore();
}
// 쿼터뷰 집: 두 벽면 + 박공지붕
function drawHouse(d){
  const t=d.town,w=100,dp=78,h=44,rh=36,x=d.x,y=d.y;
  const A=W2S(x-w/2,y-dp/2),B=W2S(x+w/2,y-dp/2),C=W2S(x+w/2,y+dp/2),D=W2S(x-w/2,y+dp/2),R1=W2S(x-w/2,y),R2=W2S(x+w/2,y);
  const wall=t&&t.white?['#c4bcac','#948c7e']:['#8a7254','#5e4c36'],roof=t?t.roof[d.v%4]:'#6a2c22';
  poly([D,C,{x:C.x+60,y:C.y+22},{x:D.x+60,y:D.y+22}],'rgba(0,0,0,.35)');
  poly([D,C,up(C,h),up(D,h)],wall[0]);
  poly([C,B,up(B,h),up(C,h)],wall[1]);
  ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1;for(let k=1;k<4;k++){const f=k/4;ctx.beginPath();ctx.moveTo(D.x,D.y-h*f);ctx.lineTo(C.x,C.y-h*f);ctx.lineTo(B.x,B.y-h*f);ctx.stroke()}
  const lit=(time*.3+d.v)%7>.4;
  for(const f of [.25,.68]){const p=W2S(x-w/2+w*f,y+dp/2);ctx.fillStyle=lit?'#ffc860':'#3a2a1a';ctx.beginPath();ctx.moveTo(p.x-5,p.y-h*.62+2.5);ctx.lineTo(p.x+5,p.y-h*.62-2.5);ctx.lineTo(p.x+5,p.y-h*.3-2.5);ctx.lineTo(p.x-5,p.y-h*.3+2.5);ctx.closePath();ctx.fill()}
  {const p=W2S(x+w/2,y+dp*.15);ctx.fillStyle='#2a1a10';ctx.beginPath();ctx.moveTo(p.x-6,p.y-3);ctx.lineTo(p.x+6,p.y+3);ctx.lineTo(p.x+6,p.y+3-h*.6);ctx.lineTo(p.x-6,p.y-3-h*.6);ctx.closePath();ctx.fill()}
  poly([up(B,h),up(C,h),up(R2,h+rh)],wall[1]);
  poly([up(A,h+2),up(B,h+2),up(R2,h+rh),up(R1,h+rh)],'#1a1210');
  poly([up(D,h-2),up(C,h-2),up(R2,h+rh),up(R1,h+rh)],roof);
  ctx.globalAlpha=.25;poly([up(D,h-2),up(C,h-2),up(R2,h+rh),up(R1,h+rh)],'#000');ctx.globalAlpha=1;
  polyY([up(D,h-2),up(C,h-2),up(R2,h+rh),up(R1,h+rh)],grad('roof',()=>{const g=ctx.createLinearGradient(0,0,0,1);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(0,0,0,.25)');return g}),R1.y-h-rh,D.y-h);
  ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(up(R1,h+rh).x,up(R1,h+rh).y);ctx.lineTo(up(R2,h+rh).x,up(R2,h+rh).y);ctx.stroke();
  if(d.k==='mill'){const c=up(W2S(x+w/2+4,y),h+rh*.5);ctx.save();ctx.translate(c.x,c.y);ctx.rotate(time*.6);ctx.fillStyle='#c8bca0';for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.fillRect(-3,-40,6,36)}ctx.restore();ctx.fillStyle='#2a1a10';circ(c.x,c.y,4)}
}
function drawRuneCircle(c){const a=clamp(c.life/c.max,0,1),k=1-a,r=c.r*(.6+.4*Math.min(1,k*4));
  ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.rot+k*2.5);ctx.globalAlpha=a;ctx.strokeStyle=c.col;ctx.fillStyle=c.col;ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(0,0,r,0,6.283);ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,r*.78,0,6.283);ctx.stroke();
  ctx.beginPath();for(let i=0;i<6;i++){const t=i/6*6.283;ctx.moveTo(Math.cos(t)*r*.78,Math.sin(t)*r*.78);ctx.lineTo(Math.cos(t+2.094)*r*.78,Math.sin(t+2.094)*r*.78)}ctx.stroke();
  for(let i=0;i<16;i++){const t=i/16*6.283;ctx.fillRect(Math.cos(t)*r*.89-2,Math.sin(t)*r*.89-2,4,4)}
  ctx.restore()}
function drawLoot(l,s,label){
  const b=Math.sin(l.t*4)*1.5,pop=Math.min(1,l.t*5);ctx.save();ctx.translate(s.x,s.y-b);ctx.scale(pop,pop);
  ctx.font='700 11px '+FONT;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.9)';
  if(l.kind==='gold'){
    if(label){ctx.strokeText(l.amt+' 금화',0,-12);ctx.fillStyle='#ffd65a';ctx.fillText(l.amt+' 금화',0,-12)}
    else{ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.3+.15*Math.sin(l.t*5);glow(0,-2,20,'#ffc93a');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';const e=Art.get('coin');if(e)SC.draw(ctx,e,0,0)}}
  else if(l.kind==='hp'||l.kind==='mp'){const c=l.kind==='hp'?'#e0574b':'#5f8bf0',nm=potName(l.kind,l.tier>=0&&l.tier<POT_T.length?l.tier:POT_DEF);
    if(label){ctx.strokeText(nm,0,-12);ctx.fillStyle='#e8e2d2';ctx.fillText(nm,0,-12)}
    else{ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.3;glow(0,-6,16,c);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';const e=Art.get('potion',l.kind);if(e)SC.draw(ctx,e,0,0)}}
  else if(l.kind==='tp')drawTpLoot(l,label);
  else{const c=RAR[l.item.rar].c;
    if(label){ctx.font='12px '+FONT;const tw=ctx.measureText(l.item.name).width;ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(-tw/2-23,-28,tw+27,17);ctx.drawImage(iconCanvas(itemIconKey(l.item),1),-tw/2-22,-27.5,16,16);ctx.strokeStyle=c;ctx.lineWidth=1;ctx.strokeRect(-tw/2-22,-27.5,16,16);ctx.fillStyle=c;ctx.fillText(l.item.name,0,-15)}
    else{if(l.item.rar>=3){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+.2*Math.sin(l.t*3);const pe=SC.get('fx/pillar/'+c,16,128,8,128,g=>{const gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,c);g.fillStyle=gr;g.fillRect(0,0,16,128)},{force:1,scale:1});ctx.drawImage(pe.cv,-5,-150,10,150);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
      Kit.shadow(ctx,0,1,11,4,.8);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.3;glow(0,-11,15,c);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.drawImage(itemGroundCv(l.item),-15,-27,30,30)}}
  ctx.restore();
}
function drawMinimap(){
  const S0=mm.width,m=S0/2600;mctx.setTransform(1,0,0,1,0,0);mctx.fillStyle='#0c0d0c';mctx.fillRect(0,0,S0,S0);
  if(DG){drawDungeonMap(S0,m*1.4);mctx.setTransform(1,0,0,1,0,0);mctx.fillStyle='#fff';mctx.beginPath();mctx.arc(S0/2,S0/2,6,0,6.283);mctx.fill();return}
  if(!mmBg){mmBg=document.createElement('canvas');const N=120;mmBg.width=mmBg.height=N;const c=mmBg.getContext('2d');
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){const g=groundRGB((i+.5)/N*WORLD,(j+.5)/N*WORLD);c.fillStyle=`rgb(${g[0]*1.6|0},${g[1]*1.6|0},${g[2]*1.6|0})`;c.fillRect(i,j,1,1)}
    c.strokeStyle='#a89060';c.lineWidth=1.4;for(const r of ROADS){c.beginPath();r.forEach((p,i)=>i?c.lineTo(p.x/WORLD*N,p.y/WORLD*N):c.moveTo(p.x/WORLD*N,p.y/WORLD*N));c.stroke()}terrMinimap(c,N)}
  const px=(P.x-P.y)*KI,py=(P.x+P.y)*KI/2;
  mctx.setTransform(m*KI,m*KI/2,-m*KI,m*KI/2,S0/2-m*px,S0/2-m*py);
  mctx.imageSmoothingEnabled=true;mctx.drawImage(mmBg,0,0,WORLD,WORLD);
  for(const tw of TOWNS){const known=P.towns.includes(tw.id);mctx.fillStyle=known?'#e8c45a':'#6a6458';mctx.beginPath();mctx.arc(tw.x,tw.y,90,0,6.283);mctx.fill()}
  for(const c of CAVES){mctx.fillStyle='#ff8a3a';mctx.fillRect(c.x-50,c.y-50,100,100)}
  for(const e of EDGES){mctx.fillStyle=e.col;mctx.beginPath();mctx.moveTo(e.x,e.y-110);mctx.lineTo(e.x+110,e.y);mctx.lineTo(e.x,e.y+110);mctx.lineTo(e.x-110,e.y);mctx.fill()}
  if(REG.lair&&!REG.bossDead){mctx.strokeStyle='#ff4a3a';mctx.lineWidth=30;mctx.beginPath();mctx.arc(REG.lair.x,REG.lair.y,110,0,6.283);mctx.stroke()}
  {const qt=questTarget();if(qt){mctx.strokeStyle=WX_QCOL.main;mctx.lineWidth=36;mctx.globalAlpha=.6+.4*Math.sin(time*4);mctx.beginPath();mctx.arc(qt.x,qt.y,150,0,6.283);mctx.stroke();mctx.globalAlpha=1}}
  for(const e of enemies){mctx.fillStyle=e.elite?'#7aa2ff':'#e0574b';mctx.fillRect(e.x-22,e.y-22,44,44)}
  for(const l of loot)if(l.kind==='item'){mctx.fillStyle=RAR[l.item.rar].c;mctx.fillRect(l.x-20,l.y-20,40,40)}
  mctx.setTransform(1,0,0,1,0,0);mctx.fillStyle='#fff';mctx.beginPath();mctx.arc(S0/2,S0/2,6,0,6.283);mctx.fill();mctx.strokeStyle='#000';mctx.lineWidth=2;mctx.stroke();
}
