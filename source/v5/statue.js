
/* ---------- 브렌힐 광장: 가짜코 동상과 페이스라인성형외과 간판 ---------- */
const STATUE={sc:()=>Math.min(2.4,Math.max(1,DPR)*1.35)};
function paintStatue(g){
  const stone='#8c8678',marble='#ddd6c6';
  Kit.shadow(g,6,4,78,26,.85);
  // 둥근 분수 받침과 물
  // [v22] 둘레는 돌 블록을 쌓은 낮은 벽 + 갓돌 고리, 안은 깊이가 보이는 물
  const s=mulberry(77),P=(th,z,k)=>({x:Math.cos(th)*66*(k||1),y:-z+Math.sin(th)*27*(k||1)}),lt=th=>.3*Math.cos(th-2.25)-.08;
  const patch=(t0,t1,z0,z1,fill,k)=>{g.fillStyle=fill;g.beginPath();for(let i=0;i<=6;i++){const p=P(t0+(t1-t0)*i/6,z0,k);i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)}for(let i=6;i>=0;i--){const p=P(t0+(t1-t0)*i/6,z1,k);g.lineTo(p.x,p.y)}g.closePath();g.fill()};
  patch(0,Math.PI,-2,6,Kit.lit(stone,-.55));{let a=0;while(a<Math.PI){const bw=.24+s()*.14,a0=a+.012,a1=Math.min(Math.PI,a+bw)-.012,m=(a0+a1)/2;patch(a0,a1,-1.4,5.4,Kit.lit(stone,lt(m)+(s()-.5)*.16));patch(a0,a1,4.4,5.4,'rgba(255,244,220,.22)');a+=bw}}
  for(let i=0;i<26;i++){const a=s()*Math.PI,p=P(a,-1+s()*3);g.fillStyle=`rgba(${60+s()*36|0},${88+s()*36|0},38,${.35+s()*.3})`;g.beginPath();g.ellipse(p.x,p.y,1.4+s()*2.6,.9+s(),0,0,6.283);g.fill()}
  const rim=c=>{c.ellipse(0,-6,66,27,0,0,6.283)};Kit.solid(g,rim,-66,-33,66,21,Kit.lit(stone,.1),{rim:'rgba(255,240,210,.55)',tex:'stone',texA:.45});
  g.strokeStyle='rgba(40,36,32,.55)';g.lineWidth=.7;for(let i=0;i<20;i++){const a=i/20*6.283+.1,p=P(a,6,.85),q=P(a,6);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}
  g.save();g.beginPath();g.ellipse(0,-6,56,23,0,0,6.283);g.clip();g.fillStyle='#3e3a34';g.fillRect(-60,-32,120,50);
  {const gr=g.createRadialGradient(-14,-8,4,0,-4,58);gr.addColorStop(0,'#4a8a9a');gr.addColorStop(.55,'#24586a');gr.addColorStop(1,'#12303e');g.fillStyle=gr;g.beginPath();g.ellipse(0,-3,56,21,0,0,6.283);g.fill()}
  g.fillStyle='rgba(190,230,245,.22)';g.beginPath();g.ellipse(-30,-12,16,3.4,-.08,0,6.283);g.fill();for(let i=0;i<6;i++){g.fillStyle='rgba(230,190,90,.55)';g.beginPath();g.ellipse(-36+s()*72,-2+s()*12,1.3,.7,0,0,6.283);g.fill()}g.restore();
  // 네모 받침돌
  const front=c=>{c.rect(-24,-78,48,66)};Kit.solid(g,front,-24,-78,24,-12,stone,{rim:'rgba(255,240,210,.6)'});
  g.fillStyle='rgba(0,0,0,.18)';g.fillRect(6,-78,18,66);
  // 받침돌 줄눈 · 이끼 · 빗물 자국
  g.strokeStyle='rgba(50,46,40,.45)';g.lineWidth=.7;for(let y=-12,r=0;y>-78;y-=11,r++){g.beginPath();g.moveTo(-24,y);g.lineTo(24,y);for(let x=-24+(r%2?8:16);x<24;x+=16){g.moveTo(x,y);g.lineTo(x,Math.max(-78,y-11))}g.stroke()}
  g.strokeStyle='rgba(80,90,70,.22)';g.lineWidth=1.2;for(let i=0;i<5;i++){const x=-20+i*9;g.beginPath();g.moveTo(x,-78);g.lineTo(x+.6,-60+i%3*6);g.stroke()}
  for(let i=0;i<14;i++){g.fillStyle=`rgba(${60+s()*30|0},${90+s()*30|0},40,${.35+s()*.3})`;g.beginPath();g.ellipse(-22+s()*44,-13-Math.pow(s(),2)*10,1.4+s()*2.2,1+s(),0,0,6.283);g.fill()}
  const top=c=>{c.moveTo(-29,-78);c.lineTo(0,-87);c.lineTo(29,-78);c.lineTo(0,-70);c.closePath()};Kit.solid(g,top,-29,-87,29,-70,'#a8a294');
  const base=c=>{c.rect(-28,-18,56,8)};Kit.solid(g,base,-28,-18,28,-10,'#7a7468');
  // 이름판
  const pl=c=>{c.rect(-19,-58,38,17)};Kit.solid(g,pl,-19,-58,19,-41,'#9a7840',{rim:'rgba(255,230,160,.9)'});
  g.fillStyle='#fff0c8';g.font=`700 10.5px ${DISPLAY}`;g.textAlign='center';g.textBaseline='middle';g.fillText('가짜코',0,-49.5);
  // 여인상 (대리석): 긴 드레스, 허리에 손, 다른 손은 자랑스레 코끝을 가리킨다
  const gown=c=>{c.moveTo(-9,-132);c.quadraticCurveTo(-14,-110,-22,-82);c.quadraticCurveTo(0,-76,22,-82);c.quadraticCurveTo(14,-110,9,-132);c.closePath()};
  Kit.solid(g,gown,-22,-132,22,-78,marble,{rim:'rgba(255,255,255,.9)',tex:'stone',texA:.25});mForm(g,gown,-22,-132,22,-78,.8);
  g.strokeStyle='rgba(90,80,64,.35)';g.lineWidth=1;for(const x of [-8,-1,6]){g.beginPath();g.moveTo(x*.6,-126);g.quadraticCurveTo(x*1.2,-104,x*2.2,-82);g.stroke()}
  const torso=c=>{c.moveTo(-8,-131);c.quadraticCurveTo(-12,-146,-13,-160);c.quadraticCurveTo(0,-164,13,-160);c.quadraticCurveTo(12,-146,8,-131);c.closePath()};
  Kit.solid(g,torso,-13,-164,13,-131,marble,{rim:'rgba(255,255,255,.9)'});
  // 허리에 얹은 왼팔
  const armL=c=>{c.moveTo(12,-158);c.quadraticCurveTo(22,-148,17,-136);c.lineTo(10,-134);c.lineTo(13,-140);c.quadraticCurveTo(16,-148,9,-154);c.closePath()};
  Kit.solid(g,armL,9,-158,22,-134,marble);
  // 코를 가리키는 오른팔
  const armR=c=>{c.moveTo(-12,-158);c.quadraticCurveTo(-24,-150,-26,-168);c.quadraticCurveTo(-27,-178,-30,-186);c.lineTo(-25,-187);c.quadraticCurveTo(-22,-176,-20,-168);c.quadraticCurveTo(-18,-156,-8,-152);c.closePath()};
  Kit.solid(g,armR,-30,-187,-8,-152,marble);
  // 목과 머리 (옆얼굴)
  const neck=c=>{c.rect(-3.5,-172,7,12)};Kit.solid(g,neck,-3.5,-172,3.5,-160,marble);
  const head=c=>{c.ellipse(1,-182,10,11.5,0,0,6.283)};Kit.solid(g,head,-9,-194,11,-170,marble,{rim:'rgba(255,255,255,.95)'});
  // 높고 뾰족하게 세운 코 (이 동상의 자랑)
  const nose=c=>{c.moveTo(-7,-189);c.quadraticCurveTo(-13,-186,-24,-178);c.quadraticCurveTo(-17,-175,-8,-176);c.closePath()};
  Kit.solid(g,nose,-24,-189,-7,-175,'#e8e2d4',{rim:'rgba(255,255,255,1)',rimW:1.2});
  g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1.1;g.beginPath();g.moveTo(-8,-188);g.quadraticCurveTo(-14,-184,-22,-178.5);g.stroke();
  g.strokeStyle='rgba(70,60,50,.55)';g.lineWidth=1;g.beginPath();g.arc(-3,-183,1.8,3.4,6);g.stroke();
  g.beginPath();g.moveTo(-7,-172);g.quadraticCurveTo(-4,-171,-2,-173);g.stroke();
  // 틀어 올린 머리
  const bun=c=>{c.ellipse(8,-191,6.5,6,0,0,6.283)};Kit.solid(g,bun,1,-197,15,-185,'#cfc8b8');
  const hair=c=>{c.moveTo(-6,-191);c.quadraticCurveTo(2,-199,11,-188);c.quadraticCurveTo(10,-180,8,-176);c.quadraticCurveTo(4,-186,-6,-191);c.closePath()};
  Kit.solid(g,hair,-6,-199,11,-176,'#cfc8b8');
}
function paintSign(g){
  Kit.shadow(g,4,2,58,14,.75);
  const wood='#6e4c2e';
  for(const x of [-40,36]){const post=c=>{c.rect(x,-96,6,96)};Kit.solid(g,post,x,-96,x+6,0,'#5a3c22')}
  const board=c=>{c.roundRect?c.roundRect(-56,-104,114,46,4):c.rect(-56,-104,114,46)};Kit.solid(g,board,-56,-104,58,-58,wood,{rim:'rgba(255,230,190,.6)'});
  g.strokeStyle='rgba(30,18,8,.35)';g.lineWidth=1;for(let y=-96;y<-60;y+=7){g.beginPath();g.moveTo(-52,y);g.lineTo(54,y+1);g.stroke()}
  const inner=c=>{c.rect(-50,-99,102,36)};g.fillStyle='#f4ead8';g.beginPath();inner(g);g.fill();g.strokeStyle='#c8a060';g.lineWidth=1.6;g.beginPath();inner(g);g.stroke();
  // 작은 옆얼굴 표시
  g.fillStyle='#e07a8a';g.beginPath();g.arc(-38,-81,8,0,6.283);g.fill();g.fillStyle='#f4ead8';g.beginPath();g.moveTo(-44,-84);g.lineTo(-50,-80);g.lineTo(-44,-78);g.fill();
  g.fillStyle='#4a2a3a';g.textAlign='center';g.textBaseline='middle';
  g.font=`700 11px ${DISPLAY}`;g.fillText('페이스라인',8,-88);g.font=`700 13px ${DISPLAY}`;g.fillStyle='#b0405a';g.fillText('성형외과',8,-73);
}
const STAT_D={statue:{w:170,h:220,ax:85,ay:200,p:paintStatue},facesign:{w:130,h:120,ax:64,ay:110,p:paintSign}};
{const _rd=drawRegionDecor;drawRegionDecor=function(d){const df=STAT_D[d.k];if(!df)return _rd(d);
  const e=SC.get('statue/'+d.k,df.w,df.h,df.ax,df.ay,g=>twBake(g,df.w,df.h,df.ax,df.ay,df.p,{ao:0}),{scale:STATUE.sc()});const s=d._s;if(!e)return true;SC.draw(ctx,e,s.x,s.y);
  if(d.k==='statue'){ctx.strokeStyle='rgba(220,240,255,.35)';ctx.lineWidth=1;const k=(time*.6)%1;ctx.beginPath();ctx.ellipse(s.x-22,s.y-9,6+k*18,2.5+k*7,0,0,6.283);ctx.stroke();
    if(dist(P,d)<380){ctx.font=`600 13px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText('가짜코 동상',s.x,s.y-212);ctx.fillStyle='#f3e2b0';ctx.fillText('가짜코 동상',s.x,s.y-212)}}
  return true}}
// 브렌힐 한가운데의 분수를 동상으로, 그 옆 집 앞에 간판
{const T0=TOWN,f=HOME.decor.find(d=>d.k==='fountain'&&d.x===T0.x&&d.y===T0.y);if(f)f.k='statue';
  const h=HOME.decor.find(d=>d.k==='house'&&d.town===T0&&d.v===5);
  if(h){const sg={x:h.x+(T0.x-h.x)*.38,y:h.y+(T0.y-h.y)*.38,k:'facesign',s:1,v:0,light:90};HOME.decor.push(sg);HOME.lights.push(sg);if(REG.id==='home'){decor.push(sg);LIGHTS.push(sg)}}}
