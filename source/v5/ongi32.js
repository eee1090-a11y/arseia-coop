/* ---------- v32 옹기여신의 설원 (움직임 · 그림) · 자료는 ongi32d.js ----------
   · 쉼터 한가운데 분수 → 「옹기여신 동상」(가짜코 동상 그림을 흙빛으로 · 그림이 없으면 코드 그림 + 이름판).
   · 쉼터 북쪽 「옹기여신 신전」(대성당 그림을 흙빛 지붕으로). 신전 문 = 던전 「심연의 입구」 입구(동굴 그림은 숨김).
     동굴 자리는 신전 안, 문은 동굴 + 80 (던전에서 나오면 문 앞에 선다 · 기존 규칙 그대로).
   · 2인조 보스: 옹기돼지(던전 보스) + 가짜코 여신(돼지가 깨어나면 함께 내려옴).
     - 생명력 하나를 같이 쓴다(어느 쪽을 때려도 둘 다 깎임). 쓰러질 때 둘이 「나하고 파티를 해요...」.
     - 돼지는 옹기를 던지고, 여신은 코에서 실리콘 화살을 쏜다. 공격(기술 포함) 3번마다 한 번 대사.
     - 30초마다 협동 공격: 둘이 갑자기 멀어짐 → 사이에 일직선 예고 2초 → 옹기 · 실리콘 미사일 3초 연사.
   · 같이 하기: 계산은 방장(혼자면 나)만. 참가자에게는 몬스터 · 투사체가 늘 보내지고, 대사 · 일직선 · 쓰러짐 대사는 'v20x' 메시지(옛 판은 무시).
   · 저장: 새 값 없음. */
const OG_JAR='#a8642f',OG_SIL='#f3c9d6';
const OGT={line:2,fire:3,every:30,dash:.6,shot:.15,band:26};// 예고 2초 · 연사 3초 · 30초마다 · 멀어지기 0.6초 · 연사 간격 · 줄 반폭
const OGV={say:[],line:null};// 화면 전용 (저장 안 함)
const OG_LINES=['진한 화장을 해라!','이태희 원장님이 주신 새 생명!','나하고 파티를 해요...'];
Object.assign(MON_H,{ongipig:58,ongigod:68});
if(typeof R22_HW==='object')Object.assign(R22_HW,{ongipig:22,ongigod:15});
queueMicrotask(()=>{try{if(typeof BGM_REG==='object')BGM_REG[OG32.reg]='snow'}catch(_){}});
// 선공 · 비선공 섞기(v26): 진흙덩이 · 숭배자는 비선공 (빌린 모양의 원래 성격과 같음)
if(typeof AG26==='object')for(const k of ['og_1','og_3'])AG26.P.add(k);

/* ===== 그림: 옹기 (투사체 · 돼지 손 · 동상 손이 같이 씀) ===== */
function ogPaintJar(g){// 발밑 (0,0) · 높이 22
  const body=q=>{q.moveTo(-3.6,-17);q.bezierCurveTo(-11,-15,-10.6,-2,-5,0);q.lineTo(5,0);q.bezierCurveTo(10.6,-2,11,-15,3.6,-17);q.closePath()};
  Kit.solid(g,body,-10.6,-17,10.6,0,'#7a4424',{rim:'rgba(255,220,180,.8)',lineW:.5});
  {const gr=g.createRadialGradient(-3.4,-11,0,-3,-10,8);gr.addColorStop(0,'rgba(255,214,170,.55)');gr.addColorStop(1,'rgba(255,214,170,0)');g.fillStyle=gr;g.beginPath();body(g);g.fill()}
  g.strokeStyle='rgba(40,20,8,.6)';g.lineWidth=.7;g.beginPath();for(let i=0;i<=10;i++){const x=-8.6+i*1.72,y=-8.6+(i%2?-1.1:1.1);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();// 손가락 물결 무늬
  Kit.solid(g,q=>q.rect(-3.8,-21,7.6,4.4),-3.8,-21,3.8,-16.6,'#6a3a1e',{lineW:.4});
  Kit.solid(g,q=>q.ellipse(0,-21,5.2,1.7,0,0,6.283),-5.2,-22.7,5.2,-19.3,'#8a5230',{rim:'rgba(255,230,190,.8)',lineW:.4});
  g.fillStyle='#2a1408';g.beginPath();g.ellipse(0,-21,3.4,1,0,0,6.283);g.fill()}
const ogJarImg=bs=>SC.get('og/jar/'+bs,26,26,13,24,g=>{g.translate(13,24);ogPaintJar(g)},{force:1,scale:bs||2});

/* ===== 그림: 옹기돼지 (두 발로 선 분홍 돼지 · 짙은 화장 · 옹기를 든다) ===== */
MON.ongipig=function(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,sk={rim:rimC,lineW:.5};
  const leg=monPartX('ongipig','leg',c,v,bs,14,18,7,1,g=>{g.translate(7,1);
    const p=q=>{q.moveTo(-4.4,0);q.lineTo(4.4,0);q.quadraticCurveTo(5,7,4.4,12);q.lineTo(-4.4,12);q.quadraticCurveTo(-5,7,-4.4,0);q.closePath()};Kit.solid(g,p,-5,0,5,12,c,sk);mForm(g,p,-5,0,5,12,.8);
    Kit.solid(g,q=>{q.moveTo(-4.6,11.4);q.lineTo(4.8,11.4);q.lineTo(5.2,15.4);q.lineTo(-4.8,15.4);q.closePath()},-4.8,11.4,5.2,15.4,'#4a2a22',{lineW:.4});mLine(g,[[.2,11.6],[.4,15.2]],'#1a0a08',.6,.8)},.6);
  const body=monPartX('ongipig','body',c,v,bs,46,42,23,39,g=>{g.translate(23,39);
    mLine(g,[[-15,-20],[-21,-22,-20,-26],[-17,-29,-20,-31]],darkOf(c,.2),2.2);// 꼬불 꼬리
    const p=q=>{q.ellipse(0,-17,16.6,17.6,0,0,6.283)};Kit.solid(g,p,-16.6,-34.6,16.6,.6,c,sk);
    {const gr=g.createRadialGradient(5,-13,0,5,-13,12);gr.addColorStop(0,mrgb(liteOf(c,.35),.75));gr.addColorStop(1,mrgb(c,0));g.fillStyle=gr;g.beginPath();g.ellipse(5,-13,11,12,0,0,6.283);g.fill()}
    mForm(g,p,-16.6,-34.6,16.6,.6,1,.35,.2);
    // 화려한 치마 주름 + 진주 목걸이
    const sk2=q=>{q.moveTo(-16,-9);q.quadraticCurveTo(0,-5,16,-9);q.lineTo(17.6,-1);q.quadraticCurveTo(14,1.6,10.6,-.4);q.quadraticCurveTo(7,2,3.6,-.4);q.quadraticCurveTo(0,2,-3.6,-.4);q.quadraticCurveTo(-7,2,-10.6,-.4);q.quadraticCurveTo(-14,1.6,-17.6,-1);q.closePath()};
    Kit.solid(g,sk2,-17.6,-9,17.6,2,'#b03a6a',{rim:'rgba(255,200,230,.8)',lineW:.5,tex:'cloth',texA:.4});for(const x of [-10,-3,4,11])mFold(g,[[x,-7],[x+.6,-1]],'#b03a6a',.7);
    for(let i=0;i<9;i++){const a=Math.PI*(.15+.7*i/8),x=Math.cos(a)*11+3,y=-30+Math.sin(a)*4.6;g.fillStyle='#fff8ee';g.beginPath();g.arc(x,y,1.25,0,6.283);g.fill();g.fillStyle='rgba(180,170,200,.7)';g.beginPath();g.arc(x+.3,y+.4,.5,0,6.283);g.fill()}});
  const head=monPartX('ongipig','head',c,v,bs,36,32,15,28,g=>{g.translate(15,28);
    const ear=(x,r)=>{g.save();g.translate(x,-20);g.rotate(r);Kit.solid(g,q=>{q.moveTo(-3.6,0);q.lineTo(0,-8.6);q.lineTo(3.6,0);q.closePath()},-3.6,-8.6,3.6,0,darkOf(c,.08),sk);g.fillStyle=mrgb('#ff8aa0',.7);g.beginPath();g.moveTo(-1.8,-.6);g.lineTo(0,-5.6);g.lineTo(1.8,-.6);g.fill();g.restore()};
    ear(-6,-.5);const hp=q=>{q.ellipse(0,-12,12.6,11.4,0,0,6.283)};Kit.solid(g,hp,-12.6,-23.4,12.6,-.6,c,sk);mForm(g,hp,-12.6,-23.4,12.6,-.6,.9,.35,.2);ear(4,.45);
    // 코(주둥이)
    const sn=q=>{q.ellipse(12.4,-10.4,5.2,4.4,0,0,6.283)};Kit.solid(g,sn,7.2,-14.8,17.6,-6,liteOf(c,.12),sk);g.fillStyle='#6a2a30';for(const y of [-11.8,-8.8]){g.beginPath();g.ellipse(14.6,y,.9,1.3,0,0,6.283);g.fill()}
    // 짙은 화장: 파란 눈두덩 · 긴 속눈썹 · 진한 볼터치 · 새빨간 입술 · 점
    g.fillStyle='rgba(70,110,230,.85)';g.beginPath();g.ellipse(4.4,-15.6,4.6,3,-.15,Math.PI,6.283);g.fill();g.fillStyle='rgba(150,90,230,.6)';g.beginPath();g.ellipse(4.4,-16.6,4.2,2.2,-.15,Math.PI,6.283);g.fill();
    mEye(g,4.6,-14.6,2.4,1.9,'#3a1a10',0,'#fffaf0');
    g.strokeStyle='#120808';g.lineWidth=.7;g.lineCap='round';for(const [a,b,cx,cy] of [[2.4,-16.2,1.4,-18.6],[4,-16.6,3.4,-19.4],[5.6,-16.6,5.8,-19.4],[7,-16,7.8,-18.4]]){g.beginPath();g.moveTo(a,b);g.lineTo(cx,cy);g.stroke()}
    mLine(g,[[1.6,-20.6],[4.6,-22.4,8.4,-20.6]],'#2a1408',.8);
    {const gr=g.createRadialGradient(2.6,-8.4,0,2.6,-8.4,4.6);gr.addColorStop(0,'rgba(255,40,90,.75)');gr.addColorStop(1,'rgba(255,40,90,0)');g.fillStyle=gr;g.beginPath();g.arc(2.6,-8.4,4.6,0,6.283);g.fill()}
    Kit.solid(g,q=>{q.moveTo(7.6,-5.4);q.quadraticCurveTo(10.6,-7.4,13.6,-5.6);q.quadraticCurveTo(10.6,-2.2,7.6,-5.4);q.closePath()},7.6,-7.4,13.6,-2.4,'#e0103a',{rim:'rgba(255,200,210,1)',lineW:.4});
    g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.ellipse(10.4,-5.6,1.2,.4,0,0,6.283);g.fill();g.fillStyle='#2a1008';g.beginPath();g.arc(6.4,-4,.6,0,6.283);g.fill()});
  const arm=monPartX('ongipig','arm',c,v,bs,16,20,5,4,g=>{g.translate(5,4);const p=q=>{q.moveTo(-3.6,-1.6);q.quadraticCurveTo(3,-3,6.6,8);q.lineTo(9.2,11.6);q.quadraticCurveTo(7,14.6,3.6,12);q.lineTo(.6,5);q.quadraticCurveTo(-1.6,2.6,-3.6,-1.6);q.closePath()};
    Kit.solid(g,p,-3.6,-3,9.2,14.6,c,sk);mForm(g,p,-3.6,-3,9.2,14.6,.8);Kit.solid(g,q=>q.ellipse(6.6,12.4,2.6,2,0,0,6.283),4,10.4,9.2,14.4,'#4a2a22',{lineW:.4})});
  const L=st.lunge,b=Math.sin(st.ph*7)*st.mv*1.2,sw=Math.sin(st.ph*7)*st.mv*3;
  mPart(g,leg,-6-sw,-15);mPart(g,leg,5+sw,-15);mPart(g,body,0,b);mPart(g,head,6,-31+b);
  if(L>0){mPart(g,arm,4,-27+b,-2.3+L*.8)}// 던지는 팔 (옹기는 손을 떠남)
  else{mPart(g,ogJarImg(bs),15,-14+b);mPart(g,arm,4,-27+b,-.15)}
  st.head={x:8,y:-50}};
/* ===== 그림: 가짜코 여신 (가짜코 동상 모습 그대로 · 공중에 떠 있고 코끝이 빛난다) ===== */
// 그림 묶음(cg-town)이 있으면 동상 그림에서 여신만 잘라 쓴다(받침 · 분수는 뺌). 없으면(#qa 등) 브렌힐 동상 코드 그림을 좌우로 뒤집어 쓴다.
const OG_GOD_CROP=[42,4,83,161,53,156],OG_GOD_K=.42;
function ogPaintGod(g){g.scale(-.55,.55);g.translate(0,78);const marble='#ece6d8',m2='#f6eee4';
  const gown=c=>{c.moveTo(-9,-132);c.quadraticCurveTo(-14,-110,-22,-82);c.quadraticCurveTo(0,-76,22,-82);c.quadraticCurveTo(14,-110,9,-132);c.closePath()};
  Kit.solid(g,gown,-22,-132,22,-78,marble,{rim:'rgba(255,255,255,.9)',tex:'stone',texA:.25});mForm(g,gown,-22,-132,22,-78,.8);
  g.strokeStyle='rgba(90,80,64,.35)';g.lineWidth=1;for(const x of [-8,-1,6]){g.beginPath();g.moveTo(x*.6,-126);g.quadraticCurveTo(x*1.2,-104,x*2.2,-82);g.stroke()}
  const torso=c=>{c.moveTo(-8,-131);c.quadraticCurveTo(-12,-146,-13,-160);c.quadraticCurveTo(0,-164,13,-160);c.quadraticCurveTo(12,-146,8,-131);c.closePath()};Kit.solid(g,torso,-13,-164,13,-131,marble,{rim:'rgba(255,255,255,.9)'});
  const armL=c=>{c.moveTo(12,-158);c.quadraticCurveTo(22,-148,17,-136);c.lineTo(10,-134);c.lineTo(13,-140);c.quadraticCurveTo(16,-148,9,-154);c.closePath()};Kit.solid(g,armL,9,-158,22,-134,marble);
  const armR=c=>{c.moveTo(-12,-158);c.quadraticCurveTo(-24,-150,-26,-168);c.quadraticCurveTo(-27,-178,-30,-186);c.lineTo(-25,-187);c.quadraticCurveTo(-22,-176,-20,-168);c.quadraticCurveTo(-18,-156,-8,-152);c.closePath()};Kit.solid(g,armR,-30,-187,-8,-152,marble);
  Kit.solid(g,c=>c.rect(-3.5,-172,7,12),-3.5,-172,3.5,-160,marble);Kit.solid(g,c=>c.ellipse(1,-182,10,11.5,0,0,6.283),-9,-194,11,-170,m2,{rim:'rgba(255,255,255,.95)'});
  const nose=c=>{c.moveTo(-7,-189);c.quadraticCurveTo(-13,-186,-24,-178);c.quadraticCurveTo(-17,-175,-8,-176);c.closePath()};Kit.solid(g,nose,-24,-189,-7,-175,'#fff4f6',{rim:'rgba(255,255,255,1)',rimW:1.2});
  g.strokeStyle='rgba(70,60,50,.55)';g.lineWidth=1;g.beginPath();g.arc(-3,-183,1.8,3.4,6);g.stroke();g.beginPath();g.moveTo(-7,-172);g.quadraticCurveTo(-4,-171,-2,-173);g.stroke();
  Kit.solid(g,c=>c.ellipse(8,-191,6.5,6,0,0,6.283),1,-197,15,-185,'#cfc8b8');
  Kit.solid(g,c=>{c.moveTo(-6,-191);c.quadraticCurveTo(2,-199,11,-188);c.quadraticCurveTo(10,-180,8,-176);c.quadraticCurveTo(4,-186,-6,-191);c.closePath()},-6,-199,11,-176,'#cfc8b8')}
function ogGodImg(){const PK=typeof cgPK==='function'&&!DG_NOART()?cgPK(CG.TOWN):null,r=PK&&PK.meta.r['076_statue_false_nose_single'];if(!r)return null;
  if(!PK.og32god){const C=OG_GOD_CROP,cv=document.createElement('canvas');cv.width=C[2];cv.height=C[3];cv.getContext('2d').drawImage(PK.img,r[0]+C[0],r[1]+C[1],C[2],C[3],0,0,C[2],C[3]);PK.og32god=cv}return PK.og32god}
const DG_NOART=()=>typeof GFX==='object'&&GFX.art==='old';
MON.ongigod=function(g,e,t,st){const fl=-3-Math.sin(st.t*2.2+(e.anim||0))*2.4,L=st.lunge;
  // 발밑 빛 (떠 있는 느낌)
  const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';mGlow(g,0,-2,18,'rgba(255,190,214,.5)',.7);g.globalCompositeOperation=po;
  const I=ogGodImg();let nx=13,ny=-55;
  if(I){const C=OG_GOD_CROP,k=OG_GOD_K;g.save();g.translate(0,fl);g.scale(-1,1);g.drawImage(I,-C[4]*k,-C[5]*k,C[2]*k,C[3]*k);g.restore();nx=8;ny=-58}
  else{const B=monPartX('ongigod','body',t.col,st.v,st.bs,42,74,18,70,g=>{g.translate(18,70);ogPaintGod(g)},.5);mPart(g,B,0,fl)}
  g.globalCompositeOperation='lighter';mGlow(g,nx,ny+fl,3.4+L*5+Math.sin(st.t*6)*.8,'#ffd6e0',.9);if(L>0)mGlow(g,nx+4,ny+fl,8*L,'#ffffff',.8);g.globalCompositeOperation=po;
  st.head={x:2,y:-60+fl}};

/* ===== 그림: 투사체 (옹기 · 실리콘 화살) ===== */
const ogSilImg=()=>SC.get('og/sil',44,14,32,7,g=>{const gr=g.createLinearGradient(0,7,40,7);gr.addColorStop(0,'rgba(243,201,214,0)');gr.addColorStop(.55,'rgba(243,201,214,.55)');gr.addColorStop(1,'rgba(255,236,242,.95)');
  g.fillStyle=gr;g.beginPath();g.moveTo(0,7);g.quadraticCurveTo(22,2.6,33,3);g.quadraticCurveTo(42,4.4,42,7);g.quadraticCurveTo(42,9.6,33,11);g.quadraticCurveTo(22,11.4,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.ellipse(34,5.6,5,1.2,0,0,6.283);g.fill();g.strokeStyle='rgba(200,120,150,.6)';g.lineWidth=.6;g.beginPath();g.moveTo(26,4);g.quadraticCurveTo(40,4.6,41.4,7);g.stroke()},{force:1,scale:2});
{const _d=drawEProj;drawEProj=function(p,s){
  if(p.col===OG_JAR){const k=p.r/11*1.15;ctx.save();ctx.translate(s.x,s.y);ctx.rotate((reduceMotion?0:time*7)+p.x*.01);ctx.scale(k,k);SC.draw(ctx,ogJarImg(2),0,11);ctx.restore();
    const po=ctx.globalCompositeOperation;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.45;glow(s.x,s.y,p.r*2,'#ffb070');ctx.globalAlpha=1;ctx.globalCompositeOperation=po;return}
  if(p.col===OG_SIL){const ang=Math.atan2((p.vx+p.vy)*KI/2,(p.vx-p.vy)*KI),k=p.r/6;ctx.save();ctx.translate(s.x,s.y);ctx.rotate(ang);ctx.scale(k,k);SC.draw(ctx,ogSilImg(),0,0);ctx.restore();
    const po=ctx.globalCompositeOperation;ctx.globalCompositeOperation='lighter';glow(s.x,s.y,p.r*2.6,'#ffd6e0');ctx.globalCompositeOperation=po;return}
  return _d.apply(this,arguments)}}

/* ===== 쉼터: 옹기여신 동상 · 옹기여신 신전 ===== */
const OG_TEMPLE={W:150,D:230};
function og32Camp(){const L=RCACHE[OG32.reg];if(!L||!L.town)return null;const t=L.town,c=L.caves.find(c=>c.cave===OG32_DG);if(!c)return null;
  let f=L.decor.find(d=>(d.k==='fountain'||d.k==='statue')&&Math.hypot(d.x-t.x,d.y-t.y)<12);if(f){f.k='statue';f.og=1}else L.decor.push(f={x:t.x,y:t.y,k:'statue',og:1,s:1,v:0,light:190});
  // 신전: 문(+y 면 가운데)이 동굴 + 80 에 오도록. 긴 쪽이 y(북쪽으로 길게)
  const {W,D}=OG_TEMPLE,b=twMkBld(t,{id:'og_temple',st:'arden',dx:c.x-t.x,dy:c.y+80-18-D/2-t.y,W,D,h:70,rh:56,big:1,tall:1,ridge:'y',door:{face:'y',f:.5},v:1,lamp:1,label:'옹기여신 신전',light:120});
  const F=b.foot[0],in_=d=>d.x>F[0]-40&&d.x<F[2]+40&&d.y>F[1]-40&&d.y<F[3]+50;
  for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(d===f||d.k==='cave'||d.k==='edgeportal'||d.town===t||d.k==='tfolk'||d.k==='npc')continue;if(in_(d))L.decor.splice(i,1)}
  L.decor.push(b);(TW.blds[L.id]||(TW.blds[L.id]=[])).push(b);if(L.lights)L.lights.push(b);
  if(typeof tw22Safe==='function')tw22Safe(L,t);return b}
const OG_CAMP=og32Camp();
// 동굴 그림 숨김 (입구는 신전 문) · 문 앞에 옅은 심연 빛
{const _dc=drawCave;drawCave=function(d){if(!DG&&d.cave&&d.cave.og)return;return _dc.apply(this,arguments)}}
// 그림 묶음 신전: 대성당 그림의 파란 지붕을 흙빛(옹기색)으로
function ogTint(img,sx,sy,w,h,col,mode,a){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.drawImage(img,sx,sy,w,h,0,0,w,h);
  g.globalCompositeOperation=mode;g.globalAlpha=a;g.fillStyle=col;g.fillRect(0,0,w,h);g.globalAlpha=1;g.globalCompositeOperation='destination-in';g.drawImage(img,sx,sy,w,h,0,0,w,h);return cv}
if(typeof cgBld==='function'){const _cb=cgBld;cgBld=function(d){if(d.id!=='og_temple')return _cb.apply(this,arguments);const PK=cgPK(CG.TOWN),r=PK&&cgR(PK,'062_arden_cathedral');if(!r)return false;
  const T=PK.og32tm||(PK.og32tm=ogTint(PK.img,r[0],r[1],r[2],r[3],'#b8683a','hue',.9));
  const s=d._s,gw=(d.W+d.D)*KI,k=Math.max(.8,Math.min(1.3,gw*1.05/r[2])),cx=s.x+(d.W-d.D)/2*KI,cy=s.y+(d.W+d.D)/4*KI,x0=cx-r[4]*k,y0=cy-r[5]*k,w=r[2]*k,h=r[3]*k;
  let a=1;if(!P.dead&&P._s){const ps=P._s,front=P.x>d.foot[0][2]||P.y>d.foot[0][3];if(!front&&dist(P,d)<420&&ps.x>x0+12&&ps.x<x0+w-12&&ps.y>y0+10&&ps.y<cy+6)a=.42}
  ctx.globalAlpha=a;ctx.drawImage(T,x0,y0,w,h);ctx.globalAlpha=1;d._cg=1;d._cgDoor=W2S(d.door.x,d.door.y);if(TW.vis!==frameN){TW.vis=frameN;TW.visB.length=0}TW.visB.push(d);return true}}
// 동상: 그림 묶음이면 가짜코 동상 그림을 흙빛으로, 아니면 코드 그림(브렌힐 동상 + 옹기 + 「옹기여신」 이름판)
function paintOgStatue(g){paintStatue(g);
  g.save();g.globalCompositeOperation='source-atop';g.fillStyle='rgba(176,98,52,.42)';g.fillRect(-90,-210,180,230);g.restore();
  const pl=c=>{c.rect(-21,-58,42,17)};Kit.solid(g,pl,-21,-58,21,-41,'#7a4a28',{rim:'rgba(255,220,170,.9)'});g.fillStyle='#ffe6c0';g.font=`700 9.5px ${DISPLAY}`;g.textAlign='center';g.textBaseline='middle';g.fillText('옹기여신',0,-49.5);
  g.save();g.translate(-28,-184);g.scale(.62,.62);ogPaintJar(g);g.restore()}
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(!(d.og&&d.k==='statue'))return _rd.apply(this,arguments);const s=d._s,k=d.s||1;let top=212;
  const PK=!DG&&typeof cgPK==='function'?cgPK(CG.TOWN):null,r=PK&&PK.meta.r['076_statue_false_nose_single'];
  if(r){const T=PK.og32st||(PK.og32st=ogTint(PK.img,r[0],r[1],r[2],r[3],'#c07a48','color',.5));ctx.drawImage(T,s.x-r[4]*k,s.y-r[5]*k,r[2]*k,r[3]*k);top=r[5]*k+6}
  else{const e=SC.get('statue/ongi',170,220,85,200,g=>twBake(g,170,220,85,200,paintOgStatue,{ao:0}),{scale:STATUE.sc()});if(e)SC.draw(ctx,e,s.x,s.y)}
  if(dist(P,d)<380){ctx.font=`600 13px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText('옹기여신 동상',s.x,s.y-top);ctx.fillStyle='#f3d2b0';ctx.fillText('옹기여신 동상',s.x,s.y-top)}
  return true}}

/* ===== 던전: 2인조 보스 ===== */
const ogIs=e=>e&&!e.dead&&TYPES[e.k]&&TYPES[e.k].og;
const ogHost=()=>!NET.guest;
function ogNew(){return{god:null,S:null,pT:OGT.every,ph:null,phT:0,fireT:0,a:null,b:null,dead:0}}
{const _e=enterDungeon;enterDungeon=function(c){OGV.say=[];OGV.line=null;const r=_e.apply(this,arguments);if(DG&&DG.d&&DG.d.og&&!DG.og)DG.og=ogNew();return r}}
{const _l=leaveDungeon;leaveDungeon=function(){OGV.say=[];OGV.line=null;return _l.apply(this,arguments)}}
if(typeof netEnterDg==='function'){const _n=netEnterDg;netEnterDg=function(){OGV.say=[];OGV.line=null;return _n.apply(this,arguments)}}
// 다시 들어온 던전: 보스가 처음 상태로 돌아가면 여신은 다시 내려오기 전으로
{const _r=k22BossReset;k22BossReset=function(){const r=_r.apply(this,arguments);if(!(DG&&DG.og&&DG.boss&&!DG.boss.dead&&!DG.bossDead))return r;
  const had=!!DG.og.god;enemies=enemies.filter(o=>o.og!==2);const b=DG.boss;b.cast=0;b.ogN=0;b.ogA=null;DG.og=ogNew();OGV.say=[];OGV.line=null;return r||had}}
// 대사: 머리 위 말풍선 (같이 하기: 방장이 알림)
function ogSay(e,w,quiet){if(!e)return;if(NET.on&&!e.id)e.id=++NET.eid;OGV.say=OGV.say.filter(q=>q.ref!==e&&!(q.id&&q.id===e.id));
  OGV.say.push({ref:e,id:e.id||0,x:e.x,y:e.y,k:e.k,w,t0:time});if(!quiet&&NET.on&&NET.host)v20Send('ogs',{i:e.id,w,x:Math.round(e.x),y:Math.round(e.y),m:e.k})/* k는 메시지 이름 자리라 몬스터 종류는 m */}
V20NET.ogs=m=>{if(!DG)return;const e=enemies.find(o=>o.id===m.i);OGV.say=OGV.say.filter(q=>q.id!==m.i);OGV.say.push({ref:e||null,id:m.i,x:m.x,y:m.y,k:m.m,w:m.w,t0:time})};
V20NET.ogl=m=>{if(!DG)return;const a=m.a;OGV.line={x1:a[0],y1:a[1],x2:a[2],y2:a[3],t0:time-(m.f?OGT.line:0)}};
V20NET.ogd=m=>{if(!DG)return;const a=m.a;OGV.line=null;OGV.say=[{ref:null,id:0,x:a[0],y:a[1],k:OG32.pig,w:2,t0:time}];if(a.length>2)OGV.say.push({ref:null,id:0,x:a[2],y:a[3],k:OG32.god,w:2,t0:time})};
function ogCount(e){e.ogN=(e.ogN||0)+1;if(e.ogN%3===0)ogSay(e,e.og===2?1:0)}
// 여신이 내려옴: 돼지와 같은 생명력(하나를 나눠 씀) · 같은 레벨 · 같은 파티 배수
function ogSpawnGod(og,pig){let x=pig.x,y=pig.y;for(let i=0;i<12;i++){const a=i/12*6.283+R()*.3,X=pig.x+Math.cos(a)*220,Y=pig.y+Math.sin(a)*220;if(dgFree(X,Y,30)){x=X;y=Y;break}}
  const g=dgMob(OG32.god,x,y,pig.lvl);Object.assign(g,{hp:pig.hp,max:pig.max,dmg:pig.dmg*TYPES[OG32.god].dmg/TYPES[OG32.pig].dmg,ps:pig.ps,_b24:pig._b24,aggroed:true,boss:1,big:1,og:2,skT:rnd(2,3.5),atkCd:99});pig.og=1;
  og.god=g;og.S=pig.hp;rings.push({x,y,r:6,max:120,life:.7,col:'#ffd6e0'});for(let i=0;i<24;i++)parts.push({x:x+rnd(-20,20),y:y+rnd(-20,20),z:rnd(60,140),vx:rnd(-30,30),vy:rnd(-30,30),vz:-rnd(40,120),life:1,max:1,col:'#ffd6e0',sz:2.4});
  banner={t:'옹기돼지 · 가짜코 여신',sub:'두 보스는 생명력을 함께 씁니다 · 30초마다 둘 사이 일직선을 피하세요',col:'#ffb0c8',life:3,max:3};msg('가짜코 여신이 내려왔습니다! 두 보스는 생명력을 함께 씁니다','#ffb0c8');return g}
// 생명력 하나: 지난번 값에서 두 몸이 각각 깎인 만큼을 모두 빼서 둘 다 같은 값으로
function ogSync(og){const p=DG.boss,g=og.god;if(!p||!g||p.dead||g.dead||og.S==null)return;const S=og.S-Math.max(0,og.S-p.hp)-Math.max(0,og.S-g.hp);og.S=S;p.hp=g.hp=S;
  if(S<=0)killE(p)}
// 협동 공격 자리: 보스 방 가운데를 지나는 선 위 양 끝 (벽 · 막힘 없는 곳)
function ogPoints(p,g){const m={x:(p.x+g.x)/2,y:(p.y+g.y)/2},rm=DG.rooms.find(r=>{const t=dgTile(m.x,m.y);return t.i>=r.i&&t.i<r.i+r.w&&t.j>=r.j&&t.j<r.j+r.h});const c=rm?tc(rm.cx,rm.cy):m;
  const clear=(a,b)=>{const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/30);for(let i=0;i<=n;i++)if(!dgFree(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n,8))return false;return dgFree(a.x,a.y,30)&&dgFree(b.x,b.y,30)};
  const a0=rm&&rm.w>=rm.h?0:Math.PI/2;for(const D of [520,460,400,340,280,220])for(let k=0;k<6;k++){const a=a0+(k?rnd(-.7,.7):0)+(k>2?Math.PI/2:0),A={x:c.x+Math.cos(a)*D/2,y:c.y+Math.sin(a)*D/2},B={x:c.x-Math.cos(a)*D/2,y:c.y-Math.sin(a)*D/2};
    if(clear(A,B))return Math.hypot(p.x-A.x,p.y-A.y)+Math.hypot(g.x-B.x,g.y-B.y)<=Math.hypot(p.x-B.x,p.y-B.y)+Math.hypot(g.x-A.x,g.y-A.y)?[A,B]:[B,A]}
  return [{x:p.x,y:p.y},{x:g.x,y:g.y}]}
function ogShot(e,tx,ty,o){const a=Math.atan2(ty-e.y,tx-e.x),jar=e.k===OG32.pig,sp=jar?260:430;
  projs.push({x:e.x+Math.cos(a)*e.r*.6,y:e.y+Math.sin(a)*e.r*.6,z:jar?34:58,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:jar?11:6,dmg:e.dmg*(o&&o.k||(jar?1:.85)),src:g29Source(e),owner:'e',life:o&&o.life||2.2,col:jar?OG_JAR:OG_SIL});e.lunge=.15;e.fx=(Math.cos(a)-Math.sin(a))>=0?1:-1}
function ogTick(dt){const og=DG.og,p=DG.boss;if(!p||p.k!==OG32.pig||og.dead||p.dead)return;
  if(!og.god&&p.aggroed&&p.hp>0)ogSpawnGod(og,p);const g=og.god;if(!g)return;if(g.dead){return}
  ogSync(og);if(og.dead||p.dead)return;
  const both=[p,g];
  if(!og.ph){og.pT-=dt;if(og.pT<=0){og.pT=OGT.every;const [A,B]=ogPoints(p,g);og.a=A;og.b=B;og.ph='dash';og.phT=OGT.dash;for(const e of both){e.cast=9;e.dash=0;e.lunge=0}
      msg('두 보스가 갑자기 멀어집니다! 둘 사이 일직선을 피하세요','#ff8ab0');for(const e of both)rings.push({x:e.x,y:e.y,r:6,max:80,life:.4,col:'#ffd6e0'})}}
  if(og.ph){for(const e of both){e.cast=9;e.atkCd=99}og.phT-=dt;
    if(og.ph==='dash'){const k=Math.min(1,dt*10);for(const [e,T] of [[p,og.a],[g,og.b]]){moveBody(e,(T.x-e.x)*k,(T.y-e.y)*k);if(R()<.5)parts.push({x:e.x+rnd(-10,10),y:e.y+rnd(-10,10),z:10,vx:0,vy:0,vz:30,life:.4,max:.4,col:'#ffd6e0',sz:2})}
      if(og.phT<=0){p.x=og.a.x;p.y=og.a.y;g.x=og.b.x;g.y=og.b.y;p.fx=(og.b.x-og.a.x)-(og.b.y-og.a.y)>=0?1:-1;g.fx=-p.fx;og.ph='line';og.phT=OGT.line;
        OGV.line={x1:p.x,y1:p.y,x2:g.x,y2:g.y,t0:time};if(NET.on&&NET.host)v20Send('ogl',{a:[p.x,p.y,g.x,g.y].map(Math.round)})}}
    else if(og.ph==='line'){if(og.phT<=0){og.ph='fire';og.phT=OGT.fire;og.fireT=0}}
    else if(og.ph==='fire'){og.fireT-=dt;const L=Math.hypot(g.x-p.x,g.y-p.y);
      while(og.fireT<=0){og.fireT+=OGT.shot;ogShot(p,g.x,g.y,{k:.45,life:L/260});ogShot(g,p.x,p.y,{k:.4,life:L/430})}
      if(og.phT<=0){og.ph=null;for(const e of both){e.cast=0;e.skT=rnd(1.5,2.5);e.ogA=rnd(.4,1)}}}}}
{const _u=updateEnemies;updateEnemies=function(dt){
  const on=DG&&DG.og&&ogHost(),og=on&&DG.og,mine=on?enemies.filter(e=>ogIs(e)):[];
  for(const e of mine){e.atkCd=99;e._sk0=e.skT}
  if(on&&!og.ph)for(const e of mine){if(!e.aggroed||e.cast>0||e.freezeT>0||e.stunT>0||e.dash>0)continue;if(e.ogA==null)e.ogA=rnd(.5,1.2);e.ogA-=dt;if(e.ogA>0)continue;
    const {tg,d}=enemyTarget(e);if(tg&&!tg.dead&&d<520&&(!DG||dgSees(e,tg))){e.ogA=TYPES[e.k].atk*(e.rage?.8:1);ogShot(e,tg.x,tg.y);ogCount(e)}}
  const r=_u.apply(this,arguments);
  if(on){for(const e of mine)if(!e.dead&&!og.ph&&e.skT>e._sk0+.5)ogCount(e);ogTick(dt)}
  return r}}
// 쓰러짐: 둘이 함께 (보상 · 빛나는 문은 돼지 한 번) · 둘 다 「나하고 파티를 해요...」
{const _k=killE;killE=function(e){const t=TYPES[e.k];if(!t||!t.og||!DG||!DG.og||DG.og.dead)return _k.apply(this,arguments);
  const og=DG.og;og.dead=1;og.ph=null;OGV.line=null;const pig=DG.boss&&DG.boss.k===OG32.pig?DG.boss:e,g=og.god;
  OGV.say=[];ogSay(pig,2,1);if(g)ogSay(g,2,1);if(NET.on&&NET.host)v20Send('ogd',{a:(g?[pig.x,pig.y,g.x,g.y]:[pig.x,pig.y]).map(Math.round)});
  if(g&&!g.dead){g.dead=true;g.hp=0;killFx(g)}
  projs=projs.filter(q=>!(q.owner==='e'&&(q.col===OG_JAR||q.col===OG_SIL)));// 날아가던 옹기 · 실리콘도 함께 사라짐
  if(e!==pig){if(pig.dead)return;pig.hp=0;return _k.call(this,pig)}
  return _k.apply(this,arguments)}}
// 같이 하기 몫: 여신에게 준 피해도 보스(돼지) 몫으로 센다
if(typeof PTY==='object'&&PTY.onDmg){const _o=PTY.onDmg;PTY.onDmg=function(e,k,d,s){const r=_o.apply(this,arguments);
  if(e&&e.og===2&&DG&&DG.boss&&DG.boss.k===OG32.pig){const C=DG.boss.cd||(DG.boss.cd=new Map());C.set(k,(C.get(k)||0)+d)}return r}}

/* ===== 그리기: 일직선 예고 · 말풍선 · 신전 문 빛 ===== */
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);const o=ctx.globalCompositeOperation;
  if(DG&&OGV.line){const l=OGV.line,age=time-l.t0,T=OGT.line+OGT.fire;if(age>T+.2)OGV.line=null;else{G();ctx.lineCap='round';ctx.globalCompositeOperation='lighter';
    const fire=age>=OGT.line,u=Math.min(1,age/OGT.line),pul=.5+.5*Math.sin(time*(fire?20:9));
    ctx.globalAlpha=fire?.32+.12*pul:.12+.1*pul;ctx.strokeStyle=fire?'#ff4a7a':'#ff8ab0';ctx.lineWidth=OGT.band*2;ctx.beginPath();ctx.moveTo(l.x1,l.y1);ctx.lineTo(l.x2,l.y2);ctx.stroke();
    ctx.globalAlpha=fire?.75:.55;ctx.lineWidth=fire?10:5;const mx=(l.x1+l.x2)/2,my=(l.y1+l.y2)/2;ctx.beginPath();ctx.moveTo(l.x1,l.y1);ctx.lineTo(l.x1+(mx-l.x1)*u,l.y1+(my-l.y1)*u);ctx.moveTo(l.x2,l.y2);ctx.lineTo(l.x2+(mx-l.x2)*u,l.y2+(my-l.y2)*u);ctx.stroke();
    ctx.globalAlpha=1;S()}}
  if(!DG&&REG.id===OG32.reg&&OG_CAMP){const s=W2S(OG_CAMP.door.x,OG_CAMP.door.y);if(onScreen(s,80)){S();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.45+.15*Math.sin(time*2.4);glow(s.x,s.y-30,34,'rgba(190,110,255,.8)');ctx.globalAlpha=.3;glow(s.x,s.y-10,22,'#ffb0c8');ctx.globalAlpha=1}}
  ctx.globalCompositeOperation=o}}
{const _lb=drawV5Labels;drawV5Labels=function(){_lb.apply(this,arguments);if(!DG||!OGV.say.length)return;S();OGV.say=OGV.say.filter(q=>time-q.t0<(q.w===2?4:2.4));
  ctx.font='700 14px '+FONT;ctx.textAlign='center';ctx.textBaseline='middle';
  for(const q of OGV.say){let o=q.ref&&!q.ref.dead?q.ref:q.id?enemies.find(e=>e.id===q.id):null;if(!o||o.dead)o=null;const x=o?o.x:q.x,y=o?o.y:q.y;if(o){q.x=x;q.y=y}
    const s=W2S(x,y),t=TYPES[q.k]||{},H=(MON_H[t.draw]||50)*((o&&o.sc)||t.sc||1),sy=s.y-H-26;if(!onScreen({x:s.x,y:sy},120))continue;
    const txt=OG_LINES[q.w],w=ctx.measureText(txt).width+20,age=time-q.t0;ctx.globalAlpha=Math.min(1,age*6,((q.w===2?4:2.4)-age)*3);
    ctx.fillStyle=q.w===2?'rgba(40,14,28,.9)':'rgba(255,246,250,.94)';ctx.strokeStyle=q.k===OG32.pig?'#c0506a':'#e8a0b8';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect?ctx.roundRect(s.x-w/2,sy-15,w,30,9):ctx.rect(s.x-w/2,sy-15,w,30);ctx.moveTo(s.x-6,sy+15);ctx.lineTo(s.x,sy+23);ctx.lineTo(s.x+6,sy+15);ctx.fill();ctx.stroke();
    ctx.fillStyle=q.w===2?'#ffd6e0':q.k===OG32.pig?'#a01a3a':'#7a3a5a';ctx.fillText(txt,s.x,sy+1)}
  ctx.globalAlpha=1;ctx.textBaseline='alphabetic'}}
// 그림 묶음 장식 그리기(cg28 drawDecor)가 'statue'를 브렌힐 동상 그림으로 먼저 가로채므로, 옹기여신 동상은 그 앞에서 받는다
{const _dd=drawDecor;drawDecor=function(d){if(d.og&&d.k==='statue'){drawRegionDecor(d);return}return _dd.apply(this,arguments)}}
