/* ---------- 몬스터 그림: 부위 인형 + 굽기 캐시 (좌우는 fx 반전) ---------- */
// 단위 좌표: 발밑 (0,0), 앞쪽이 +x, 위가 음수. 기본색은 TYPES[k].col → 같은 종류라도 지역마다 색이 다르다.
const MANIM=new WeakMap();// 그리기 전용 상태 (저장 안 함)
const MON_H={slime:28,wolf:30,goblin:36,skeleton:44,wraith:52,ogre:58,knight:52,apostle:62};
// 이름 있는 준보스 · 보스 장식
const MON_V={m_bolg:'crown',m_wolfking:'collar',b_arsil:'kingcrown',m_grol:'moss',m_drowned:'weed',b_devourer:'maw',
  m_herdin:'broken',m_packlord:'bonearmor',b_baldrak:'warlord',m_seren:'halo',m_archbishop:'mitre',b_morgath:'flamecrown'};
function monBs(sc){return Math.max(1,DPR)*Math.max(1,Math.ceil(sc*2)/2)}
function monPart(kind,part,col,v,bs,w,h,ax,ay,paint){return SC.get(`mon/${kind}/${part}/${col}/${v||''}/${bs}`,w,h,ax,ay,paint,{force:1,scale:bs})}
const rimC='rgba(255,236,206,.8)';
const darkOf=(c,k)=>Kit.lit(c,-(k||.4)),liteOf=(c,k)=>Kit.lit(c,k||.25);
function mPart(g,img,x,y,r,sx,sy){if(!img)return;if(!r&&!sx&&!sy){SC.draw(g,img,x,y);return}g.save();g.translate(x,y);if(r)g.rotate(r);if(sx||sy)g.scale(sx||1,sy||1);SC.draw(g,img,0,0);g.restore()}
function mGlow(g,x,y,r,col,a){if(Q.lvl===0&&r<5&&g===ctx)return;heroGlow(g,x,y,r,col,a)}
function crownPaint(g,x,y,w,col,spikes){g.save();g.translate(x,y);const n=spikes||5,c=q=>{q.moveTo(-w/2,0);for(let i=0;i<=n*2;i++){const px=-w/2+i*w/(n*2);q.lineTo(px,i%2?-w*.18:-w*.48)}q.lineTo(w/2,0);q.lineTo(w/2,w*.16);q.lineTo(-w/2,w*.16);q.closePath()};
  Kit.solid(g,c,-w/2,-w*.5,w/2,w*.16,col,{tex:'metal',texA:.5,rim:'rgba(255,255,230,1)',lineW:.7});g.fillStyle='#e04a3a';g.beginPath();g.arc(0,w*.02,w*.07,0,6.283);g.fill();g.restore()}
function hornPaint(g,x,y,len,col,dir){g.save();g.translate(x,y);g.scale(dir,1);const h=q=>{q.moveTo(-2,0);q.bezierCurveTo(-1,-len*.5,len*.4,-len*.9,len*.55,-len);q.bezierCurveTo(len*.2,-len*.7,3,-len*.4,3,0);q.closePath()};
  Kit.solid(g,h,-2,-len,len*.6,0,col,{tex:'bone',texA:.5,lineW:.7});g.restore()}
// ---- v20 손그림 다듬기 도구: 모두 굽는 순간에만 쓰고, 매 프레임에는 구운 그림만 찍는다 ----
const mrgb=(c,a)=>Kit.rgb(Kit.hex(c),a);
// 부위 전체 윤곽선: 지금까지 그린 실루엣을 어둡게 칠해 8방향으로 살짝 밀어 뒤에 깐다 (주인공 그림과 같은 짙은 테두리)
function mInk(g,col,w){const cv=g.canvas,W=cv.width,H=cv.height,d=Math.max(.8,(w||.7)*g.getTransform().a);
  const t=document.createElement('canvas');t.width=W;t.height=H;const q=t.getContext('2d');q.drawImage(cv,0,0);q.globalCompositeOperation='source-in';q.fillStyle=col||'rgba(20,12,9,.9)';q.fillRect(0,0,W,H);
  g.save();g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='destination-over';for(let i=0;i<8;i++){const a=i*.7854;g.drawImage(t,Math.cos(a)*d,Math.sin(a)*d)}g.restore()}
// 굽기 + 윤곽선 (ink=0 이면 윤곽선 없음)
function monPartX(kind,part,col,v,bs,w,h,ax,ay,paint,ink){return monPart(kind,part,col,v,bs,w,h,ax,ay,g=>{g.save();paint(g);g.restore();if(ink!==0)mInk(g,null,ink)})}
// 덩어리 명암: 왼쪽 위 빛 · 오른쪽 아래 그늘 · 아래쪽 차폐 (경로 안쪽만)
function mForm(g,path,x0,y0,x1,y1,k,lx,ly){k=k==null?1:k;const w=x1-x0,h=y1-y0,cx=x0+w*(lx==null?.3:lx),cy=y0+h*(ly==null?.24:ly),R=Math.hypot(w,h)*.8;
  g.save();g.beginPath();path(g);g.clip();
  let gr=g.createRadialGradient(cx,cy,0,cx,cy,R);gr.addColorStop(0,`rgba(255,236,200,${.32*k})`);gr.addColorStop(.32,'rgba(255,236,200,0)');gr.addColorStop(.66,`rgba(18,8,22,${.14*k})`);gr.addColorStop(1,`rgba(18,8,22,${.5*k})`);
  g.fillStyle=gr;g.fillRect(x0-2,y0-2,w+4,h+4);
  gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.62,'rgba(0,0,0,0)');gr.addColorStop(1,`rgba(14,6,16,${.34*k})`);g.fillStyle=gr;g.fillRect(x0-2,y0-2,w+4,h+4);g.restore()}
// 얼룩 · 털 · 주름 (경로 안쪽만)
function mSpeck(g,path,x0,y0,x1,y1,c,n,seed,r,a){const s=mulberry(seed||3);a=a==null?1:a;g.save();g.beginPath();path(g);g.clip();
  for(let i=0;i<n;i++){const x=x0+s()*(x1-x0),y=y0+s()*(y1-y0),rr=(r||1)*(.4+s()),dk=s()<.55;g.fillStyle=dk?mrgb(darkOf(c,.5),.26*a):mrgb(liteOf(c,.4),.2*a);g.beginPath();g.ellipse(x,y,rr,rr*.66,s()*3,0,6.283);g.fill()}g.restore()}
function mFur(g,path,c,x0,y0,x1,y1,n,len,seed,dir){const s=mulberry(seed||5);dir=dir||1;g.save();g.beginPath();path(g);g.clip();g.lineCap='round';
  for(let i=0;i<n;i++){const x=x0+s()*(x1-x0),y=y0+s()*(y1-y0),l=len*(.55+s()*.7),up=(y-y0)/((y1-y0)||1),lt=s()<.62-up*.45;
    g.strokeStyle=lt?mrgb(liteOf(c,.45),.36):mrgb(darkOf(c,.5),.26);g.lineWidth=.35+s()*.45;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x-dir*l*.45,y+l*.25,x-dir*l,y+l*.5+s()*.6);g.stroke()}g.restore()}
function mLine(g,pts,col,w,a){g.strokeStyle=mrgb(col,a==null?1:a);g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++){const p=pts[i];if(p.length===4)g.quadraticCurveTo(p[0],p[1],p[2],p[3]);else g.lineTo(p[0],p[1])}g.stroke()}
// 접힘: 어두운 골 + 옆의 밝은 마루
function mFold(g,pts,c,w){mLine(g,pts,darkOf(c,.55),w||1,.55);g.save();g.translate(-.6,-.3);mLine(g,pts,liteOf(c,.4),(w||1)*.5,.4);g.restore()}
// 눈: 흰자/홍채/동공/반사광 (빛나는 눈은 매 프레임 빛을 덧씌운다)
function mEye(g,x,y,rx,ry,iris,rot,sclera){g.save();g.translate(x,y);g.rotate(rot||0);g.fillStyle=sclera||'#1a0e08';g.beginPath();g.ellipse(0,0,rx,ry,0,0,6.283);g.fill();
  g.fillStyle=iris;g.beginPath();g.ellipse(rx*.15,0,rx*.62,ry*.86,0,0,6.283);g.fill();g.fillStyle='#0a0604';g.beginPath();g.ellipse(rx*.2,0,rx*.2,ry*.62,0,0,6.283);g.fill();
  g.fillStyle='rgba(255,255,240,.95)';g.beginPath();g.arc(-rx*.15,-ry*.35,Math.max(.35,rx*.22),0,6.283);g.fill();g.restore()}
// 이빨 줄
function mTeeth(g,x0,y0,x1,y1,n,len,col,up){g.fillStyle=col||'#efe6cc';for(let i=0;i<n;i++){const u=(i+.5)/n,x=x0+(x1-x0)*u,y=y0+(y1-y0)*u,w=Math.abs(x1-x0)/n*.42;g.beginPath();g.moveTo(x-w,y);g.lineTo(x,y+(up?-len:len));g.lineTo(x+w,y);g.closePath();g.fill()}}

// ---- 종류별 부위와 조립 ----
const MON={
slime(g,e,t,st){const c=t.col,v=st.v,bs=st.bs;
  const body=monPart('slime','body',c,v,bs,46,40,23,35,g=>{g.translate(23,35);
    const dk=darkOf(c,.55),dd=darkOf(c,.75),lt=liteOf(c,.45);
    const p=q=>{q.moveTo(-17,0);q.bezierCurveTo(-18.5,-6,-16,-11,-12.5,-16);q.bezierCurveTo(-9,-23,-5,-27.5,.5,-27.5);q.bezierCurveTo(7,-27.5,12,-22,14.6,-15);q.bezierCurveTo(17,-9,18.4,-4,17,0);q.bezierCurveTo(10,2.6,-10,2.6,-17,0);q.closePath()};
    // 바닥에 퍼진 점액 웅덩이
    g.fillStyle=mrgb(dd,.75);g.beginPath();g.ellipse(0,.4,19.6,3.2,0,0,6.283);g.fill();
    g.fillStyle=mrgb(c,.5);g.beginPath();g.ellipse(-1,0,17,2.2,0,0,6.283);g.fill();
    for(const [x,r] of [[-20,1.6],[19.5,1.3],[-14,1]]){g.fillStyle=mrgb(dk,.75);g.beginPath();g.ellipse(x,.6,r*1.6,r*.8,0,0,6.283);g.fill();g.fillStyle='rgba(255,255,240,.55)';g.beginPath();g.ellipse(x-.4,.1,r*.6,r*.25,0,0,6.283);g.fill()}
    // 짙은 테두리 (안쪽 절반은 몸이 덮어 반투명 가장자리가 된다)
    g.strokeStyle='rgba(16,14,10,.85)';g.lineWidth=1.8;g.lineJoin='round';g.beginPath();p(g);g.stroke();
    g.globalAlpha=.9;
    let gr=g.createRadialGradient(-3,-9,1,0,-11,22);gr.addColorStop(0,lt);gr.addColorStop(.38,liteOf(c,.12));gr.addColorStop(.72,c);gr.addColorStop(1,dk);g.fillStyle=gr;g.beginPath();p(g);g.fill();g.globalAlpha=1;
    g.save();g.beginPath();p(g);g.clip();
    // 속이 비치는 핵과 떠다니는 찌꺼기
    gr=g.createRadialGradient(2,-9,0,2,-9,10);gr.addColorStop(0,mrgb(dd,.55));gr.addColorStop(1,mrgb(dd,0));g.fillStyle=gr;g.fillRect(-12,-20,28,22);
    g.save();g.translate(-4,-6);g.rotate(.5);g.fillStyle='rgba(226,214,180,.55)';g.fillRect(-3.2,-.6,6.4,1.2);g.beginPath();g.arc(-3.2,-.6,1,0,6.283);g.arc(-3.2,.6,1,0,6.283);g.arc(3.2,-.6,1,0,6.283);g.arc(3.2,.6,1,0,6.283);g.fill();g.restore();
    g.fillStyle=mrgb(dd,.5);g.beginPath();g.ellipse(6,-4,2.2,1.6,.4,0,6.283);g.fill();
    if(v==='moss'){g.fillStyle='rgba(240,232,210,.6)';for(const [x,y,r] of [[-7,-11,.5],[8,-17,-.4]]){g.save();g.translate(x,y);g.rotate(r);g.fillRect(-4,-.8,8,1.6);g.beginPath();g.arc(-4,0,1.4,0,6.283);g.arc(4,0,1.4,0,6.283);g.fill();g.restore()}}
    // 기포
    for(const [x,y,r] of [[-9,-7,1.9],[7,-19,1.2],[11,-6,1.5],[-3,-20,.9],[-11,-14,.8],[3,-2,1.1],[-6,-2,.7],[13,-12,.7]]){g.fillStyle=mrgb(lt,.25);g.beginPath();g.arc(x,y,r,0,6.283);g.fill();g.strokeStyle=mrgb(lt,.6);g.lineWidth=.45;g.stroke();g.fillStyle='rgba(255,255,245,.85)';g.beginPath();g.arc(x-r*.35,y-r*.38,r*.32,0,6.283);g.fill()}
    // 가장자리 짙어짐 + 아래 차폐
    g.strokeStyle=mrgb(dk,.55);g.lineWidth=4;g.beginPath();p(g);g.stroke();
    gr=g.createLinearGradient(0,-8,0,2);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,mrgb(dd,.55));g.fillStyle=gr;g.fillRect(-19,-8,38,10);
    // 오른쪽 아래 반사광
    g.strokeStyle=mrgb(liteOf(c,.6),.45);g.lineWidth=1.2;g.beginPath();g.moveTo(15.4,-12);g.quadraticCurveTo(17,-5,14.5,-1);g.stroke();
    g.restore();
    // 흘러내리는 방울
    for(const [x,y,l] of [[-15.2,-7,5],[16.2,-5,4],[-8,-.6,2.4],[9,-.4,2]]){g.fillStyle=mrgb(c,.92);g.beginPath();g.moveTo(x-1.3,y);g.quadraticCurveTo(x-1.4,y+l,x,y+l+1.2);g.quadraticCurveTo(x+1.4,y+l,x+1.3,y);g.closePath();g.fill();g.strokeStyle='rgba(16,14,10,.6)';g.lineWidth=.5;g.stroke();g.fillStyle='rgba(255,255,240,.7)';g.beginPath();g.arc(x-.4,y+l*.7,.45,0,6.283);g.fill()}
    // 큰 하이라이트 (창문 반사 모양) + 반짝임
    g.fillStyle='rgba(255,255,248,.38)';g.beginPath();g.ellipse(-6.5,-20,7,3.4,-.55,0,6.283);g.fill();
    g.fillStyle='rgba(255,255,250,.92)';g.beginPath();g.ellipse(-7.6,-21.2,3.6,1.5,-.55,0,6.283);g.fill();g.beginPath();g.ellipse(-12.4,-14.6,1,1.9,.5,0,6.283);g.fill();g.beginPath();g.arc(-3,-24.4,.7,0,6.283);g.fill();
    // 얼굴: 젤리 속에 잠긴 눈 (어둡게 꺼진 자리 + 빛나는 동공) · 희미한 아가리
    g.fillStyle=mrgb(dd,.55);g.beginPath();g.ellipse(5.6,-13.4,2.8,2.2,.2,0,6.283);g.ellipse(11.6,-12.8,2.4,2,-.2,0,6.283);g.fill();
    g.fillStyle=mrgb(dd,.85);g.beginPath();g.ellipse(5.8,-13.2,1.8,1.3,.3,0,6.283);g.ellipse(11.4,-12.6,1.5,1.1,-.3,0,6.283);g.fill();
    g.fillStyle='#f4ec9a';g.beginPath();g.ellipse(6.1,-13.1,.75,1,0,0,6.283);g.ellipse(11.6,-12.5,.65,.9,0,0,6.283);g.fill();
    g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.arc(5.4,-14.2,.45,0,6.283);g.arc(11,-13.5,.4,0,6.283);g.fill();
    g.fillStyle=mrgb(dd,.6);g.beginPath();g.moveTo(3.4,-8.6);g.quadraticCurveTo(9,-5,14.6,-8.8);g.quadraticCurveTo(9,-7.4,3.4,-8.6);g.closePath();g.fill();
    g.strokeStyle=mrgb(lt,.55);g.lineWidth=.4;g.beginPath();g.moveTo(5,-7.2);g.quadraticCurveTo(9,-5.2,13,-7.4);g.stroke();
    if(v==='moss'){g.fillStyle='#3e5a22';for(let i=0;i<16;i++){const a=-2.7+i*.17;g.beginPath();g.ellipse(Math.cos(a)*13.6,-14+Math.sin(a)*13.4,3,1.6,a,0,6.283);g.fill()}g.fillStyle='#5e7e30';for(let i=0;i<10;i++){const a=-2.5+i*.2;g.beginPath();g.ellipse(Math.cos(a)*13,-14.6+Math.sin(a)*12.8,1.6,.8,a,0,6.283);g.fill()}g.fillStyle='#e8a0c0';g.beginPath();g.arc(-2,-27.6,2.2,0,6.283);g.fill();g.fillStyle='#ffe0f0';g.beginPath();g.arc(-2.6,-28.2,.7,0,6.283);g.fill()}});
  const k=st.lunge,q=Math.sin(st.ph*6)*(.05+.05*st.mv);
  g.save();g.translate(k*7,0);g.scale((1+q)*(1+.25*k),(1-q)*(1-.15*k));SC.draw(g,body,0,0);g.restore()},

wolf(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,und=t.undead,dk=darkOf(c,.5),lt=liteOf(c,.42),fo={tex:'leather',texA:.22,rim:rimC,rimW:1.2,lineW:.5};
  const body=monPartX('wolf','body',c,v,bs,50,28,25,14,g=>{g.translate(25,14);
    const p=q=>{q.moveTo(-17,-1);q.bezierCurveTo(-16,-6.4,-9,-7.6,-2,-7);q.bezierCurveTo(4,-6.6,8,-9.6,13.6,-8.8);q.bezierCurveTo(18.6,-7,19,-1,16.4,2.6);q.bezierCurveTo(14.4,5.6,9,6,6,5);q.bezierCurveTo(2,3.6,-3,2.2,-7,2.8);q.bezierCurveTo(-11,3.6,-14,5.6,-15.8,4.4);q.bezierCurveTo(-17.8,3,-17.8,1,-17,-1);q.closePath()};
    Kit.solid(g,p,-17,-10,19,8,c,fo);
    g.save();g.beginPath();p(g);g.clip();
    // 등의 짙은 털 · 배의 밝은 털
    let gr=g.createLinearGradient(0,-10,0,8);gr.addColorStop(0,mrgb(darkOf(c,.45),.75));gr.addColorStop(.38,mrgb(c,0));gr.addColorStop(.72,mrgb(lt,0));gr.addColorStop(1,mrgb(lt,.55));g.fillStyle=gr;g.fillRect(-18,-11,38,20);
    // 어깨뼈 · 허벅지 근육 윤곽
    mFold(g,[[-9.4,-5.6],[-15,-2.6,-12.8,3.6]],c,.8);
    if(und){g.fillStyle='#1a0c08';g.beginPath();g.ellipse(-2.4,-.6,6.4,4,.05,0,6.283);g.fill();g.strokeStyle='#d8ccb0';g.lineWidth=1.1;for(let i=0;i<4;i++){g.beginPath();g.arc(-6+i*3,-5.6,4.6,Math.PI*.35,Math.PI*.78);g.stroke()}
      g.fillStyle='rgba(255,120,40,.9)';for(const [x,y] of [[-11,-3],[7,-5],[-4,3.4],[2,1]]){g.beginPath();g.arc(x,y,.8,0,6.283);g.fill()}}
    g.restore();
    mForm(g,p,-17,-10,19,8,.9);
    mFur(g,p,c,-17,-10,19,8,190,2,11);
    // 목 갈기 (들쭉날쭉한 털 뭉치)
    const ruff=q=>{q.moveTo(8,-10.4);for(let i=0;i<7;i++){const a=-1.9+i*.5,r=i%2?8.6:10.4;q.lineTo(12+Math.cos(a)*r*.8,-2+Math.sin(a)*r)}q.lineTo(12,4);q.quadraticCurveTo(8,0,8,-10.4);q.closePath()};
    {const gr2=g.createLinearGradient(8,-12,14,8);gr2.addColorStop(0,liteOf(c,.22));gr2.addColorStop(1,darkOf(c,.15));g.fillStyle=gr2;g.beginPath();ruff(g);g.fill();mFur(g,ruff,c,6,-12,20,8,70,2.4,12)}
    // 배 아래 털 술
    g.fillStyle=lt;for(const [x,y] of [[10,6],[6,5.6],[1,4.2],[-4,3.4]]){g.beginPath();g.moveTo(x-2,y-1.4);g.lineTo(x-.6,y+1.6);g.lineTo(x+1.4,y-1);g.closePath();g.fill()}
    if(v==='bonearmor'){for(let i=0;i<4;i++)Kit.solid(g,q=>{q.ellipse(-10+i*6,-7.4,4,2.6,-.2,0,6.283)},-14+i*6,-10,-6+i*6,-4,'#d8ccb0',{tex:'bone',texA:.5,lineW:.6})}});
  const head=monPartX('wolf','head',c,v,bs,36,30,9,17,g=>{g.translate(9,17);
    const ear=(x,col)=>{const q0=q=>{q.moveTo(x-2.4,-6);q.quadraticCurveTo(x-1.2,-12,x+1.2,-15.4);q.quadraticCurveTo(x+4.2,-11,x+4.6,-6);q.closePath()};Kit.solid(g,q0,x-2.4,-15.4,x+4.6,-6,col,{lineW:.5,rim:rimC});
      g.fillStyle=mrgb(darkOf(col,.6),.85);g.beginPath();g.moveTo(x-.4,-6.6);g.quadraticCurveTo(x+.2,-10.6,x+1.3,-12.6);g.quadraticCurveTo(x+2.6,-10,x+2.8,-6.6);g.closePath();g.fill();mFur(g,q0,col,x-2,-15,x+4,-6,10,1.6,3)};
    ear(-3.4,darkOf(c,.3));
    const jaw=q=>{q.moveTo(-3,2);q.quadraticCurveTo(6,5.4,16.4,2.4);q.lineTo(16.2,4);q.quadraticCurveTo(9,8,1,7.4);q.quadraticCurveTo(-3,6,-3,2);q.closePath()};
    Kit.solid(g,jaw,-3,2,16.4,8,darkOf(c,.18),fo);
    const p=q=>{q.moveTo(-7,3);q.bezierCurveTo(-8,-5,-3,-8.6,3,-8);q.bezierCurveTo(7,-7.6,9,-5.6,11,-4.6);q.lineTo(19.4,-3);q.quadraticCurveTo(21.6,-2,21,.2);q.quadraticCurveTo(19,2.2,16,2.2);q.quadraticCurveTo(8,4,3,3.6);q.quadraticCurveTo(-3,7,-7,3);q.closePath()};
    Kit.solid(g,p,-8,-9,21.6,6,c,fo);
    g.save();g.beginPath();p(g);g.clip();let gr=g.createLinearGradient(0,-9,0,4);gr.addColorStop(0,mrgb(darkOf(c,.4),.6));gr.addColorStop(.5,mrgb(c,0));gr.addColorStop(1,mrgb(lt,.5));g.fillStyle=gr;g.fillRect(-9,-10,32,15);g.restore();
    mForm(g,p,-8,-9,21.6,5,.8,.4,.2);mFur(g,p,c,-8,-9,12,5,60,2.2,7);
    // 이마 주름 · 콧등 빛 · 입술선 · 이빨
    mFold(g,[[6,-6.6],[9,-5.2,12,-4.8]],c,.8);
    g.strokeStyle=mrgb(lt,.6);g.lineWidth=.8;g.beginPath();g.moveTo(11,-4.6);g.lineTo(19,-3.2);g.stroke();
    g.fillStyle='#120a08';g.beginPath();g.moveTo(8,3.4);g.quadraticCurveTo(13,2.6,17.6,1.8);g.lineTo(16.4,3.2);g.quadraticCurveTo(12,4.4,8,3.4);g.closePath();g.fill();
    mTeeth(g,10,2.8,16.6,1.9,4,1.3,'#f2ead2',false);g.fillStyle='#f2ead2';g.beginPath();g.moveTo(14.6,2);g.lineTo(15.2,4.6);g.lineTo(15.8,2);g.fill();
    g.fillStyle='#0e0806';g.beginPath();g.ellipse(20.2,-1.3,1.7,1.3,0,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.arc(19.7,-1.9,.5,0,6.283);g.fill();
    g.fillStyle=mrgb(dk,.8);for(const [x,y] of [[15,-.8],[16.4,-.4],[15.8,.6]]){g.beginPath();g.arc(x,y,.3,0,6.283);g.fill()}
    // 눈: 짙은 눈두덩 + 노란 눈
    g.fillStyle=mrgb(darkOf(c,.6),.7);g.beginPath();g.ellipse(8.6,-3.6,3.2,1.8,-.2,0,6.283);g.fill();
    mEye(g,8.8,-3.6,1.9,1.15,und?'#ff7a2a':(t.eye||'#e8c040'),-.22);
    g.strokeStyle=mrgb(darkOf(c,.7),.9);g.lineWidth=.8;g.beginPath();g.moveTo(6.2,-5.6);g.quadraticCurveTo(9,-6.4,11.4,-4.6);g.stroke();
    // 뺨 털 술
    g.fillStyle=liteOf(c,.15);g.beginPath();g.moveTo(-6,0);for(let i=0;i<5;i++)g.lineTo(-8-(i%2)*2.4,1+i*1.6);g.lineTo(-2,7);g.closePath();g.fill();
    ear(.4,c);
    if(v==='collar'){g.strokeStyle='#3a2414';g.lineWidth=3.4;g.beginPath();g.moveTo(-5,-4);g.lineTo(-3,6);g.stroke();g.strokeStyle='#6a4a2a';g.lineWidth=2;g.stroke();for(let i=0;i<4;i++)hornPaint(g,-6+i*1,-4+i*3,6,'#e8dcc0',-1);g.strokeStyle='rgba(255,90,70,.8)';g.lineWidth=.9;g.beginPath();g.moveTo(5,-7);g.lineTo(9,-1);g.stroke()}
    if(v==='bonearmor'){hornPaint(g,0,-6,10,'#e0d4b8',-1);hornPaint(g,3,-6,8,'#c8bc9e',-1)}});
  const tail=monPartX('wolf','tail',c,v,bs,26,16,22,6,g=>{g.translate(22,6);
    const p=q=>{q.moveTo(1,-2.6);q.bezierCurveTo(-6,-6,-13,-4.6,-20,2.6);for(let i=0;i<5;i++){q.lineTo(-17+i*3.4,3.6+(i%2?1.4:-.2))}q.bezierCurveTo(-6,3.4,-2,3,1,2.4);q.closePath()};
    Kit.solid(g,p,-20,-6,1,5,c,fo);g.save();g.beginPath();p(g);g.clip();const gr=g.createLinearGradient(-20,0,0,0);gr.addColorStop(0,mrgb(darkOf(c,.65),.9));gr.addColorStop(.3,mrgb(dk,0));g.fillStyle=gr;g.fillRect(-21,-7,23,13);g.restore();
    mForm(g,p,-20,-6,1,5,.7);mFur(g,p,c,-20,-6,1,5,46,2.4,9,-1)},.6);
  const leg=(h,b)=>monPartX('wolf',(h?'legH':'legF')+(b?'B':''),c,v,bs,14,21,7,3,g=>{g.translate(7,3);g.scale(.92,1.16);const col=b?darkOf(c,.32):c;
    const p=h?q=>{q.moveTo(-4.2,-2);q.lineTo(3.4,-2);q.bezierCurveTo(4.8,1.4,3.8,4,2,6);q.lineTo(.4,8);q.lineTo(1.4,11.2);q.quadraticCurveTo(4.2,12,4.2,13.6);q.lineTo(-1,13.6);q.lineTo(-1,12);q.lineTo(-3.2,8.4);q.bezierCurveTo(-4.6,6,-5.2,1.6,-4.2,-2);q.closePath()}
      :q=>{q.moveTo(-2.8,-2);q.lineTo(2.6,-2);q.bezierCurveTo(3,2.4,1.8,4.6,1.5,7.6);q.lineTo(1.7,10.6);q.quadraticCurveTo(4.4,11.8,4.4,13.6);q.lineTo(-1.3,13.6);q.lineTo(-1,11);q.lineTo(-1.1,7.6);q.bezierCurveTo(-1.6,4.6,-3.4,3,-2.8,-2);q.closePath()};
    Kit.solid(g,p,-5,-2,5,14,col,fo);
    g.save();g.beginPath();p(g);g.clip();const gr=g.createLinearGradient(0,-2,0,14);gr.addColorStop(0,mrgb(darkOf(col,.3),.5));gr.addColorStop(.4,mrgb(col,0));gr.addColorStop(.75,mrgb(liteOf(col,.3),.35));gr.addColorStop(1,mrgb(darkOf(col,.4),.6));g.fillStyle=gr;g.fillRect(-6,-3,12,18);g.restore();
    mForm(g,p,-5,-2,5,14,.7);mFur(g,p,col,-5,-2,5,9,22,2,h?4:6);
    if(h)mFold(g,[[3.6,0],[1,3.4,-3.2,5]],col,.8);
    g.strokeStyle=mrgb(darkOf(col,.7),.9);g.lineWidth=.45;for(const x of [1.4,2.8]){g.beginPath();g.moveTo(x,12.4);g.lineTo(x+.2,13.6);g.stroke()}
    g.fillStyle='#1a120c';for(const x of [2,3.2,4.3]){g.beginPath();g.moveTo(x-.4,13.4);g.lineTo(x+.5,13.9);g.lineTo(x-.2,13.9);g.fill()}
    // 위쪽은 몸에 스며들게
    g.globalCompositeOperation='destination-in';const fd=g.createLinearGradient(0,-2,0,1.6);fd.addColorStop(0,'rgba(0,0,0,0)');fd.addColorStop(1,'#000');g.fillStyle=fd;g.fillRect(-7,-3,14,22);g.globalCompositeOperation='source-over'},.6);
  const LF=leg(0,0),LH=leg(1,0),LFB=leg(0,1),LHB=leg(1,1),ph=st.ph*12,mv=st.mv,sw=k=>Math.sin(ph+k)*.6*mv;
  let bx=0,by=-Math.abs(Math.sin(ph))*1.6*mv,hr=0;
  const u=st.lunge>0?1-st.lunge:0;if(st.lunge>0){if(u<.45){by+=3*u/.45;hr=.25}else{const w=(u-.45)/.55;bx+=14*w;by-=7*Math.sin(Math.PI*w);hr=-.15}}
  g.save();g.translate(bx,by);
  mPart(g,LFB,10,-16,sw(Math.PI));mPart(g,LHB,-8,-16,sw(0));
  mPart(g,tail,-14,-20,Math.sin(st.t*8)*.25-.1);
  SC.draw(g,body,0,-18);
  mPart(g,head,13,-22,hr+Math.sin(st.ph*2)*.03);
  mPart(g,LF,8,-15.6,sw(0));mPart(g,LH,-10,-15.6,sw(Math.PI));
  const ec=t.eye||(t.undead?'#ff6a2a':'#ffdf6a');mGlow(g,21.8,-25.6+hr*-6,2.6,ec,.8);
  g.restore();st.head={x:bx+18,y:by-28}},

goblin(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,skin=Kit.mix(c,'#7a6a3a',.25),sk={tex:'leather',texA:.25,rim:rimC,lineW:.5},hide='#5a3e24';
  const leg=monPartX('goblin','leg',c,v,bs,14,16,6,3,g=>{g.translate(6,3);
    const p=q=>{q.moveTo(-2.4,-1.6);q.lineTo(2.2,-1.6);q.quadraticCurveTo(3,2.4,1.6,4.6);q.quadraticCurveTo(1.2,6.6,1.8,8.4);q.lineTo(5.6,10);q.quadraticCurveTo(6.4,11.2,5,11.4);q.lineTo(-2.6,11.4);q.quadraticCurveTo(-3,10,-1.8,8.4);q.quadraticCurveTo(-1,6.6,-1.6,4.6);q.quadraticCurveTo(-3.4,2.4,-2.4,-1.6);q.closePath()};
    Kit.solid(g,p,-3,-1.6,6,11.4,skin,sk);mForm(g,p,-3,-1.6,6,11.4,.8);
    g.fillStyle=mrgb(liteOf(skin,.35),.5);g.beginPath();g.ellipse(.2,4.4,1.4,1,0,0,6.283);g.fill();
    // 발싸개
    const wr=q=>{q.moveTo(-2.2,7.8);q.lineTo(2.4,7.8);q.lineTo(5.6,10);q.quadraticCurveTo(6.4,11.2,5,11.4);q.lineTo(-2.6,11.4);q.closePath()};Kit.solid(g,wr,-2.6,7.8,6.4,11.4,'#6a5236',{tex:'cloth',texA:.4,lineW:.4});
    for(const x of [-1.6,0,1.6,3.2]){g.strokeStyle='rgba(30,20,10,.55)';g.lineWidth=.45;g.beginPath();g.moveTo(x,7.9);g.lineTo(x+1.2,11.2);g.stroke()}
    g.fillStyle='#d8ccb0';for(const x of [5.3,4.2]){g.beginPath();g.moveTo(x,10.6);g.lineTo(x+1.4,11.3);g.lineTo(x,11.4);g.fill()}
    g.globalCompositeOperation='destination-in';const fd=g.createLinearGradient(0,-1.6,0,1);fd.addColorStop(0,'rgba(0,0,0,0)');fd.addColorStop(1,'#000');g.fillStyle=fd;g.fillRect(-6,-3,14,18);g.globalCompositeOperation='source-over'},.55);
  const torso=monPartX('goblin','torso',c,v,bs,30,30,15,24,g=>{g.translate(15,24);
    // 뒤쪽 팔 (늘어뜨린 마른 팔 + 갈고리 손)
    const ab=q=>m2Limb(q,[[-6,-16],[-9,-10],[-9.4,-4]],3.2,2.2);Kit.solid(g,ab,-11,-17,-6,-3,darkOf(skin,.3),sk);
    g.fillStyle=darkOf(skin,.35);g.beginPath();g.ellipse(-9.4,-3,1.9,1.6,0,0,6.283);g.fill();g.strokeStyle='#1a1008';g.lineWidth=.6;for(const a of [-.4,.2,.8]){g.beginPath();g.moveTo(-9.4+Math.sin(a)*1.4,-1.8);g.lineTo(-9.4+Math.sin(a)*2.2,-.2);g.stroke()}
    // 몸: 굽은 등 · 갈비 드러난 가슴
    const bp=q=>{q.moveTo(-8,-18);q.quadraticCurveTo(-1,-21,6,-18.4);q.quadraticCurveTo(9.6,-12,7.6,-3);q.lineTo(-7.4,-3);q.quadraticCurveTo(-10.4,-11,-8,-18);q.closePath()};
    Kit.solid(g,bp,-10.4,-21,9.6,-3,skin,sk);mForm(g,bp,-10.4,-21,9.6,-3,.9);mSpeck(g,bp,-10,-21,9,-3,skin,26,4,.7);
    for(let i=0;i<3;i++)mFold(g,[[1.6,-15+i*2.4],[4.6,-14.2+i*2.4,7.2,-15+i*2.4]],skin,.6);
    mFold(g,[[-1,-18.6],[0,-15,-.6,-11]],skin,.6);
    // 가죽 조끼 (한쪽 어깨) + 누더기 허리천
    const vest=q=>{q.moveTo(-8.4,-18);q.quadraticCurveTo(-4,-20.6,1,-19.6);q.lineTo(2.4,-12);q.lineTo(-1,-6);q.lineTo(-7.6,-6);q.quadraticCurveTo(-10.2,-12,-8.4,-18);q.closePath()};
    Kit.solid(g,vest,-10.2,-20.6,2.4,-6,hide,{tex:'leather',texA:.6,rim:rimC,lineW:.5});mForm(g,vest,-10.2,-20.6,2.4,-6,.7);
    g.strokeStyle='rgba(220,200,160,.6)';g.lineWidth=.45;g.setLineDash([.8,.9]);g.beginPath();g.moveTo(1.4,-18.8);g.lineTo(2,-12.4);g.lineTo(-1.2,-6.6);g.stroke();g.setLineDash([]);
    const lc=q=>{q.moveTo(-9,-6.6);q.lineTo(9,-6.6);q.lineTo(9.6,-1);q.lineTo(7,1.6);q.lineTo(5.4,-.6);q.lineTo(3,2.4);q.lineTo(.6,-.4);q.lineTo(-2,2.2);q.lineTo(-4.4,-.4);q.lineTo(-7,2);q.lineTo(-9.8,-.6);q.closePath()};
    Kit.solid(g,lc,-9.8,-6.6,9.6,2.4,'#4a3a26',{tex:'cloth',texA:.6,rim:rimC,lineW:.5});mForm(g,lc,-9.8,-6.6,9.6,2.4,.7);mFold(g,[[-4,-5.4],[-3.4,-2,-4.6,1]],'#4a3a26',.7);mFold(g,[[3,-5.4],[3.4,-2,2.6,1.6]],'#4a3a26',.7);
    // 허리띠 · 주머니 · 뼈 단검
    Kit.solid(g,q=>q.rect(-9.4,-7.8,19,2.4),-9.4,-7.8,9.6,-5.4,'#2e2014',{tex:'leather',texA:.6,lineW:.4});
    Kit.solid(g,q=>q.rect(-1,-8,2.4,2.8),-1,-8,1.4,-5.2,'#a08850',{tex:'metal',texA:.6,lineW:.35});
    Kit.solid(g,q=>{q.ellipse(-6,-4.4,2.4,2.8,0,0,6.283)},-8.4,-7.2,-3.6,-1.6,'#6a4a2c',{tex:'leather',texA:.6,lineW:.4});
    Kit.solid(g,q=>{q.moveTo(5.4,-8);q.lineTo(7.4,-8);q.lineTo(6.8,1);q.lineTo(6.2,3);q.lineTo(5.6,1);q.closePath()},5.4,-8,7.4,3,'#ddd0b0',{tex:'bone',texA:.5,lineW:.4});
    // 이빨 목걸이
    g.strokeStyle='#3a2414';g.lineWidth=.5;g.beginPath();g.moveTo(-6,-18.4);g.quadraticCurveTo(0,-13.6,6,-17.6);g.stroke();
    for(let i=0;i<5;i++){const u=(i+.5)/5,x=-6+12*u,y=-18.4+Math.sin(u*Math.PI)*4.2;g.fillStyle='#ece2c4';g.beginPath();g.moveTo(x-.6,y);g.lineTo(x,y+2.1);g.lineTo(x+.6,y);g.fill()}
    if(v==='crown'){Kit.solid(g,q=>{q.ellipse(-8,-18,4,2.6,-.3,0,6.283)},-12,-21,-4,-15,'#5a4a3a',{tex:'leather',texA:.6,lineW:.5})}});
  const head=monPartX('goblin','head',c,v,bs,40,32,20,27,g=>{g.translate(20,27);
    const ear=(s,col)=>{const q0=q=>{q.moveTo(s*3.6,-11);q.quadraticCurveTo(s*10,-16,s*17,-16.8);q.lineTo(s*14,-14.2);q.lineTo(s*15.4,-13.2);q.quadraticCurveTo(s*10,-8,s*4.4,-5.4);q.closePath()};
      Kit.solid(g,q0,Math.min(s*3.6,s*17),-16.8,Math.max(s*3.6,s*17),-5.4,col,sk);g.fillStyle=mrgb(darkOf(col,.5),.55);g.beginPath();g.moveTo(s*5,-10);g.quadraticCurveTo(s*10,-13.4,s*14,-14.6);g.quadraticCurveTo(s*9,-10,s*5.4,-7.6);g.closePath();g.fill()};
    ear(1,darkOf(skin,.25));
    const p=q=>{q.moveTo(-6,-6);q.bezierCurveTo(-7.6,-13,-3,-17.4,2,-16.8);q.bezierCurveTo(6.6,-16.4,8.6,-13,8.4,-10);q.quadraticCurveTo(9,-6,7.6,-3.4);q.quadraticCurveTo(3,-.4,-1,-1.6);q.quadraticCurveTo(-5,-2.6,-6,-6);q.closePath()};
    Kit.solid(g,p,-7.6,-17.4,9,-.4,skin,sk);mForm(g,p,-7.6,-17.4,9,-.4,1,.35,.2);mSpeck(g,p,-7.6,-17.4,9,-.4,skin,34,6,.6);
    // 눈두덩 · 이마 주름
    g.fillStyle=mrgb(darkOf(skin,.55),.75);g.beginPath();g.ellipse(4.2,-10.6,3,2,-.15,0,6.283);g.fill();
    mFold(g,[[-1,-14],[2,-15,5,-14]],skin,.6);mFold(g,[[0,-12.6],[3,-13.4,6,-12.6]],skin,.5);
    mEye(g,4.6,-10.6,1.6,1.1,'#ffd84a',-.1,'#f0e0a0');
    g.strokeStyle=mrgb(darkOf(skin,.7),.95);g.lineWidth=1;g.beginPath();g.moveTo(1.8,-12.8);g.lineTo(7.4,-11.4);g.stroke();
    // 매부리 코
    const nose=q=>{q.moveTo(6.4,-11);q.quadraticCurveTo(11,-10.6,13,-6.6);q.quadraticCurveTo(12.6,-5.2,10.6,-5.8);q.quadraticCurveTo(8,-6.4,6.6,-7);q.closePath()};
    Kit.solid(g,nose,6.4,-11,13,-5.2,liteOf(skin,.06),sk);mForm(g,nose,6.4,-11,13,-5.2,.7);g.fillStyle='#1a0e08';g.beginPath();g.ellipse(10.4,-6.2,.8,.45,.3,0,6.283);g.fill();
    // 입: 들쭉날쭉한 이빨
    g.fillStyle='#1a0806';g.beginPath();g.moveTo(1,-4.6);g.quadraticCurveTo(5,-2.8,8.2,-4.4);g.quadraticCurveTo(5.4,-1.8,1.6,-3.2);g.closePath();g.fill();
    mTeeth(g,2,-4.2,7.6,-4.2,4,1.2,'#f0e6c4',false);g.fillStyle='#f0e6c4';g.beginPath();g.moveTo(6.4,-3.2);g.lineTo(7,-5.6);g.lineTo(7.6,-3.4);g.fill();
    // 듬성듬성한 머리털
    g.strokeStyle='#2a1a10';g.lineWidth=.55;g.lineCap='round';for(let i=0;i<7;i++){g.beginPath();g.moveTo(-4+i*.9,-16.6+i*.1);g.quadraticCurveTo(-7+i*.4,-19,-9+i*.3,-17+i*.4);g.stroke()}
    ear(-1,skin);
    g.fillStyle='#c8a050';g.beginPath();g.arc(-14,-12.4,.9,0,6.283);g.fill();g.strokeStyle='#8a6a2a';g.lineWidth=.4;g.stroke();
    // 짐승 가죽 두건 + 뼈 장식
    Kit.solid(g,q=>{q.moveTo(-7.4,-11);q.quadraticCurveTo(-6,-19.6,2,-19);q.quadraticCurveTo(8,-18,8.6,-13.4);q.quadraticCurveTo(2,-16,-7.4,-11);q.closePath()},-7.4,-19.6,8.6,-11,'#6a4a2a',{tex:'leather',texA:.6,rim:rimC,lineW:.5});
    mFur(g,q=>{q.moveTo(-7.4,-11);q.quadraticCurveTo(-6,-19.6,2,-19);q.quadraticCurveTo(8,-18,8.6,-13.4);q.quadraticCurveTo(2,-16,-7.4,-11);q.closePath()},'#6a4a2a',-7.4,-19.6,8.6,-11,30,1.6,5);
    hornPaint(g,-1,-18.4,6,'#e6dcc0',-1);hornPaint(g,3,-18.6,5,'#d8ccb0',1)});
  const staff=monPartX('goblin','staff',c,v,bs,18,50,9,31,g=>{g.translate(9,31);
    Kit.solid(g,q=>m2Limb(q,[[0,16],[-.8,8],[.6,0],[-.6,-8],[.4,-16],[-.2,-21]],2.6,2.2),-2,-22,2,16,'#4a3018',{tex:'wood',texA:.7,rim:rimC,lineW:.4});
    for(const y of [-4,6]){g.fillStyle='#3a2410';g.beginPath();g.ellipse(.2,y,1.6,.8,.3,0,6.283);g.fill()}
    g.strokeStyle='#8a6a3a';g.lineWidth=.6;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-1.4,-15+i*1.1);g.lineTo(1.4,-14.4+i*1.1);g.stroke()}
    // 깃털 · 구슬 끈
    g.strokeStyle='#b0402a';g.lineWidth=.7;g.beginPath();g.moveTo(1,-19);g.quadraticCurveTo(4,-15,3.4,-10);g.stroke();
    Kit.solid(g,q=>{q.ellipse(3.6,-9,1,2.6,-.2,0,6.283)},2.6,-11.6,4.6,-6.4,'#d8c070',{lineW:.35});Kit.solid(g,q=>{q.ellipse(-3.4,-11,1,2.8,.3,0,6.283)},-4.4,-13.8,-2.4,-8.2,'#4a6a8a',{lineW:.35});
    g.strokeStyle='#d8c070';g.lineWidth=.6;g.beginPath();g.moveTo(-1,-19);g.quadraticCurveTo(-4,-16,-3.4,-13.4);g.stroke();
    for(const [x,y,col] of [[2.2,-16.4,'#c84a3a'],[2.8,-13.6,'#e8dcc0'],[-2.6,-16,'#4a8aa8']]){g.fillStyle=col;g.beginPath();g.arc(x,y,.7,0,6.283);g.fill()}
    // 뿔 달린 짐승 해골
    hornPaint(g,-2,-24,6,'#cfc2a0',-1);hornPaint(g,2,-24,6,'#cfc2a0',1);
    const sk2=q=>{q.moveTo(-3.6,-25);q.bezierCurveTo(-4,-29.6,4,-29.6,3.6,-25);q.lineTo(2.4,-21.4);q.lineTo(-2.4,-21.4);q.closePath()};
    Kit.solid(g,sk2,-4,-29.6,4,-21.4,'#e8dcc0',{tex:'bone',texA:.5,rim:rimC,lineW:.4});mForm(g,sk2,-4,-29.6,4,-21.4,.6);
    g.fillStyle='#1a120a';g.beginPath();g.ellipse(-1.4,-25.4,.9,1.1,0,0,6.283);g.ellipse(1.4,-25.4,.9,1.1,0,0,6.283);g.fill();g.fillRect(-1.4,-22.6,.4,1);g.fillRect(-.2,-22.6,.4,1);g.fillRect(1,-22.6,.4,1)},.5);
  const hand=monPartX('goblin','hand',c,v,bs,8,8,4,4,g=>{g.translate(4,4);Kit.solid(g,q=>q.ellipse(0,0,2.3,2.1,0,0,6.283),-2.3,-2.1,2.3,2.1,skin,sk);
    g.strokeStyle=mrgb(darkOf(skin,.6),.9);g.lineWidth=.4;for(const y of [-.7,.3,1.2]){g.beginPath();g.moveTo(-.4,y);g.lineTo(1.8,y);g.stroke()}},.45);
  const ph=st.ph*10,mv=st.mv,sw=Math.sin(ph)*.5*mv,bob=-Math.abs(Math.sin(ph))*1.2*mv;
  const L=leg;mPart(g,L,-3,-11+bob,sw);mPart(g,L,3,-11+bob,-sw);
  const k=st.lunge;
  SC.draw(g,torso,0,-9+bob);
  const ax=12+k*6,ay=-22+bob-k*3,rot=-.08+k*.8;
  mPart(g,staff,ax,ay,rot);
  SC.draw(g,head,0,-26+bob);
  const sx=ax+Math.sin(rot)*25,sy=ay-Math.cos(rot)*25;mGlow(g,sx,sy,6+Math.sin(st.t*9)*1.2,t.pcol||'#ff7a3a',.95);mGlow(g,sx,sy,2.6,'#fff',.8);
  SC.draw(g,hand,ax,ay);
  st.head={x:0,y:-48+bob}},

skeleton(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,bo={tex:'bone',texA:.5,rim:rimC,lineW:.45},cav='#140c08',dk=darkOf(c,.5);
  const bone=(g,pts,w0,w1,col)=>{const p=q=>m2Limb(q,pts,w0,w1);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [x,y] of pts){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}Kit.solid(g,p,x0-2,y0-2,x1+2,y1+2,col||c,bo);return p};
  const knob=(g,x,y,r,col)=>{Kit.solid(g,q=>q.ellipse(x,y,r,r*.85,0,0,6.283),x-r,y-r,x+r,y+r,col||c,bo)};
  const leg=monPartX('skel','leg',c,v,bs,14,24,6,3,g=>{g.translate(6,3);
    knob(g,0,-.6,2.2);bone(g,[[0,0],[.4,4.4],[.6,8.6]],1.9,1.5);knob(g,.6,9.2,1.7);knob(g,1.6,9.6,1,liteOf(c,.1));
    bone(g,[[-.2,10],[-.4,14],[-.2,17.4]],1.3,1.1,darkOf(c,.2));bone(g,[[.8,10],[.9,14],[.8,17.4]],1.7,1.3);
    knob(g,.3,17.8,1.3);const ft=q=>{q.moveTo(-1.6,17.6);q.lineTo(2.4,17.6);q.lineTo(5.2,19.2);q.lineTo(5,20.2);q.lineTo(-1.8,20.2);q.closePath()};Kit.solid(g,ft,-1.8,17.6,5.2,20.2,c,bo);
    g.strokeStyle=mrgb(dk,.85);g.lineWidth=.35;for(const x of [1.6,2.8,4]){g.beginPath();g.moveTo(x,18);g.lineTo(x+.4,20);g.stroke()}},.5);
  const arm=monPartX('skel','arm',c,v,bs,10,18,5,3,g=>{g.translate(5,3);knob(g,0,0,1.8);bone(g,[[0,0],[.2,5.4]],1.6,1.3);knob(g,.2,5.8,1.4);bone(g,[[-.4,6],[-.2,11.4]],1,.9,darkOf(c,.2));bone(g,[[.6,6],[.6,11.4]],1.2,1)},.45);
  const torso=monPartX('skel','torso',c,v,bs,32,36,16,31,g=>{g.translate(16,31);
    // 뒤쪽 팔 (어깨에서 늘어진 뼈)
    g.save();g.translate(-3,-24);g.rotate(.18);bone(g,[[0,0],[0,6]],1.5,1.2,darkOf(c,.3));bone(g,[[0,6.4],[.4,12]],1.2,1,darkOf(c,.35));g.restore();
    // 골반
    const pel=q=>{q.moveTo(-5.6,-4.6);q.quadraticCurveTo(-1,-6.4,5,-4.4);q.quadraticCurveTo(6,-1.6,3.6,.6);q.lineTo(1,-.6);q.lineTo(-1.4,.8);q.lineTo(-4,-.4);q.quadraticCurveTo(-6.6,-2,-5.6,-4.6);q.closePath()};
    Kit.solid(g,pel,-6.6,-6.4,6,.8,c,bo);mForm(g,pel,-6.6,-6.4,6,.8,.7);g.fillStyle=cav;g.beginPath();g.ellipse(.4,-2.6,1.3,1,0,0,6.283);g.fill();
    // 척추 마디
    for(let i=0;i<8;i++){const y=-6.6-i*2.3,x=-1.6-Math.sin(i*.35)*.8;Kit.solid(g,q=>q.ellipse(x,y,1.5,1.1,0,0,6.283),x-1.5,y-1.1,x+1.5,y+1.1,i%2?darkOf(c,.08):c,bo)}
    // 갈비뼈: 등뼈에서 앞쪽 가슴뼈로 휘어 든다
    const sx=4.6;Kit.solid(g,q=>{q.moveTo(sx-1,-24);q.lineTo(sx+1,-24);q.lineTo(sx+.6,-12.6);q.lineTo(sx-.8,-12.6);q.closePath()},sx-1,-24,sx+1,-12.6,c,bo);
    for(let i=0;i<5;i++){const y=-22.4+i*2.6,w=5.8+Math.sin((i+1)/6*Math.PI)*2,dy=2.4+i*.3;
      g.strokeStyle=mrgb(cav,.9);g.lineWidth=2.2;g.lineCap='round';g.beginPath();g.moveTo(-2,y-1.4);g.bezierCurveTo(-2+w*.4,y-3.4,sx+3.4,y-1,sx,y+dy*.4);g.stroke();
      g.strokeStyle=i>2?darkOf(c,.12):c;g.lineWidth=1.25;g.stroke();g.strokeStyle='rgba(255,250,232,.55)';g.lineWidth=.4;g.beginPath();g.moveTo(-1,y-2.2);g.bezierCurveTo(0,y-3.4,sx+1,y-2.4,sx+2.2,y-.8);g.stroke()}
    // 쇄골 · 녹슨 어깨받이
    bone(g,[[-3,-25.4],[2,-25.8],[6,-24.8]],1.5,1.2);
    const pad=q=>{q.moveTo(-6.4,-24);q.quadraticCurveTo(-3,-30,3,-27.6);q.quadraticCurveTo(4.6,-24,2.4,-22);q.quadraticCurveTo(-2,-24.4,-6.4,-24);q.closePath()};
    Kit.solid(g,pad,-6.4,-30,4.6,-22,'#6a5a48',{tex:'metal',texA:.7,rim:rimC,lineW:.45});mForm(g,pad,-6.4,-30,4.6,-22,.8);
    mSpeck(g,pad,-6.4,-30,4.6,-22,'#8a4a24',14,5,.9,1.4);g.fillStyle='#2a2018';for(const [x,y] of [[-3.6,-25.6],[0,-27],[2.4,-24.8]]){g.beginPath();g.arc(x,y,.45,0,6.283);g.fill()}
    // 누더기 허리천
    const rag=q=>{q.moveTo(-6.4,-6.2);q.lineTo(6,-6);q.lineTo(5.6,-1);q.lineTo(4,2.6);q.lineTo(2.6,-.4);q.lineTo(1,3.8);q.lineTo(-.6,0);q.lineTo(-2.6,2.8);q.lineTo(-3.8,-.6);q.lineTo(-5.8,1.8);q.lineTo(-6.8,-2);q.closePath()};
    Kit.solid(g,rag,-6.8,-6.2,6,3.8,'#4a3e34',{tex:'cloth',texA:.6,rim:rimC,lineW:.4});mForm(g,rag,-6.8,-6.2,6,3.8,.7);mFold(g,[[-2,-5],[-1.6,-2,-2.4,1.6]],'#4a3e34',.6);mFold(g,[[2.4,-5],[2.8,-2,2,2]],'#4a3e34',.6);
    Kit.solid(g,q=>q.rect(-6.8,-7.4,13.2,1.8),-6.8,-7.4,6.4,-5.6,'#2e2218',{tex:'leather',texA:.6,lineW:.35});
    if(v==='crown'){Kit.solid(g,q=>{q.moveTo(-11,-27);q.quadraticCurveTo(-13,-22,-9,-19);q.lineTo(-5,-25);q.closePath();q.moveTo(11,-27);q.quadraticCurveTo(13,-22,9,-19);q.lineTo(5,-25);q.closePath()},-13,-27,13,-19,'#8a6a3a',{tex:'metal',texA:.6,lineW:.6})}});
  const skull=monPartX('skel','skull',c,v,bs,26,26,13,21,g=>{g.translate(13,21);g.scale(.88,.9);
    const jaw=q=>{q.moveTo(-1.6,-3.4);q.lineTo(1,-2.4);q.lineTo(5.6,-2.6);q.quadraticCurveTo(6.6,-1,5.6,.6);q.lineTo(.6,1.4);q.quadraticCurveTo(-1.6,.8,-1.6,-3.4);q.closePath()};
    Kit.solid(g,jaw,-1.6,-3.4,6.6,1.4,darkOf(c,.12),bo);mTeeth(g,1.4,-2.6,5.4,-2.6,4,1,liteOf(c,.2),true);
    const p=q=>{q.moveTo(-6.4,-6);q.bezierCurveTo(-7.6,-16.6,7,-17.6,7.6,-8.6);q.quadraticCurveTo(8,-6.6,7.2,-5.6);q.lineTo(7.2,-3.6);q.lineTo(1.6,-3.2);q.quadraticCurveTo(-1,-2.4,-2.6,-4);q.quadraticCurveTo(-6,-3.2,-6.4,-6);q.closePath()};
    Kit.solid(g,p,-7.6,-17.6,8,-2.4,c,bo);mForm(g,p,-7.6,-17.6,8,-2.4,1,.35,.15);mSpeck(g,p,-7.6,-17.6,8,-2.4,c,20,8,.7,.8);
    // 관자 오목 · 광대뼈
    g.fillStyle=mrgb(dk,.4);g.beginPath();g.ellipse(-1.2,-8.4,2.6,2,0,0,6.283);g.fill();
    g.strokeStyle=mrgb(liteOf(c,.4),.8);g.lineWidth=.6;g.beginPath();g.moveTo(.6,-5.4);g.quadraticCurveTo(3,-4.6,5.4,-5.6);g.stroke();
    // 눈구멍 (깊게) · 코 구멍
    for(const [x,y,rx,ry] of [[4.4,-8.6,2.3,2.5],[0,-8.8,1.6,2.3]]){g.fillStyle=mrgb(dk,.8);g.beginPath();g.ellipse(x,y,rx+.5,ry+.4,0,0,6.283);g.fill();g.fillStyle=cav;g.beginPath();g.ellipse(x+.1,y+.2,rx,ry,0,0,6.283);g.fill()}
    g.fillStyle=cav;g.beginPath();g.moveTo(6,-6.2);g.lineTo(7.2,-4.2);g.lineTo(5.4,-4.4);g.closePath();g.fill();
    mTeeth(g,1.6,-3.4,6.6,-3.6,5,1.1,liteOf(c,.25),false);g.strokeStyle=mrgb(cav,.8);g.lineWidth=.3;for(let i=1;i<5;i++){g.beginPath();g.moveTo(1.6+i,-3.5);g.lineTo(1.6+i,-2.4);g.stroke()}
    // 금 · 이음매
    mLine(g,[[-2,-16.4],[-.6,-13.4],[-2.6,-11.4],[-1.6,-10]],cav,.5,.8);mLine(g,[[3,-16.4],[4.2,-13.6]],cav,.4,.6);
    if(v==='crown')crownPaint(g,.6,-15,15,'#b08a3a',4)});
  const sword=monPartX('skel','sword',c,v,bs,14,46,7,38,g=>{g.translate(7,38);
    Kit.solid(g,q=>{q.moveTo(-1.6,-3);q.lineTo(1.6,-3);q.lineTo(1.2,4);q.lineTo(-1.2,4);q.closePath()},-2,-3,2,4,'#4a3020',{tex:'leather',texA:.5,lineW:.4});
    g.strokeStyle='rgba(20,12,6,.6)';g.lineWidth=.4;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-1.4,-2+i*1.6);g.lineTo(1.4,-1.2+i*1.6);g.stroke()}
    Kit.solid(g,q=>q.ellipse(0,4.8,1.6,1.2,0,0,6.283),-1.6,3.6,1.6,6,'#6a5a40',{tex:'metal',texA:.6,lineW:.4});
    Kit.solid(g,q=>{q.moveTo(-4.4,-4.6);q.quadraticCurveTo(0,-3.6,4.4,-4.6);q.lineTo(4,-2.8);q.quadraticCurveTo(0,-2,-4,-2.8);q.closePath()},-4.4,-4.6,4.4,-2,'#6a5a40',{tex:'metal',texA:.5,lineW:.4});
    const bl=q=>{q.moveTo(-1.8,-4.6);q.lineTo(1.8,-4.6);q.lineTo(1.5,-15);q.lineTo(.9,-16);q.lineTo(1.4,-17);q.lineTo(1.3,-28);q.lineTo(0,-34);q.lineTo(-1.4,-29);q.lineTo(-.7,-26);q.lineTo(-1.5,-25);q.lineTo(-1.6,-12);q.closePath()};
    Kit.solid(g,bl,-2,-34,2,-4,'#8a8278',{tex:'metal',texA:.7,rim:'rgba(255,255,255,.9)',lineW:.4});
    g.fillStyle='rgba(40,34,30,.55)';g.fillRect(-.35,-27,.7,21);g.fillStyle='rgba(255,255,255,.5)';g.fillRect(-1.2,-26,.4,19);
    mSpeck(g,bl,-2,-34,2,-4,'#8a4a20',24,9,.8,1.6)},.45);
  const shield=monPartX('skel','shield',c,v,bs,26,28,13,14,g=>{g.translate(13,14);
    const p=q=>q.ellipse(0,0,9.4,11.4,0,0,6.283);
    Kit.solid(g,p,-9.4,-11.4,9.4,11.4,'#5a3e24',{tex:'wood',texA:.8,rim:rimC});mForm(g,p,-9.4,-11.4,9.4,11.4,.9);
    g.strokeStyle='rgba(20,12,6,.65)';g.lineWidth=.6;for(const x of [-4.6,0,4.6]){g.beginPath();g.moveTo(x,-11);g.lineTo(x,11);g.stroke()}
    // 쪼개진 틈 · 화살 자국
    g.fillStyle='#1a120a';g.beginPath();g.moveTo(6.2,-8.6);g.lineTo(9.4,-6);g.lineTo(7.2,-2.6);g.lineTo(6.6,-5);g.closePath();g.fill();
    mLine(g,[[-5,4],[-3,6.4],[-4.2,8.6]],'#140c06',.5,.8);
    g.strokeStyle='#3a3630';g.lineWidth=2.2;g.beginPath();g.ellipse(0,0,8.8,10.8,0,0,6.283);g.stroke();g.strokeStyle='#8a8478';g.lineWidth=1.1;g.beginPath();g.ellipse(-.2,-.3,8.8,10.8,0,Math.PI*.9,Math.PI*1.7);g.stroke();
    g.fillStyle='#b0aaa0';for(let i=0;i<8;i++){const a=i/8*6.283;g.beginPath();g.arc(Math.cos(a)*8.8,Math.sin(a)*10.8,.55,0,6.283);g.fill()}
    Kit.solid(g,q=>q.arc(0,0,3,0,6.283),-3,-3,3,3,'#8a8680',{tex:'metal',texA:.6,rim:'rgba(255,255,255,.9)',lineW:.4});mSpeck(g,q=>q.arc(0,0,3,0,6.283),-3,-3,3,3,'#8a4a20',6,2,.7,1.4)});
  const ph=st.ph*9,mv=st.mv,sw=Math.sin(ph)*.45*mv,bob=-Math.abs(Math.sin(ph))*1.2*mv;
  mPart(g,leg,-3,-20+bob,-sw);
  mPart(g,shield,-2,-26+bob,.1);
  mPart(g,leg,2,-20+bob,sw);
  SC.draw(g,torso,0,-20+bob);
  mPart(g,skull,1,-44+bob,Math.sin(st.ph*1.3)*.05);
  const k=st.lunge,rot=-.5+(k>0?(k>.5?-1.1*(1-k)*2:-1.1+2.4*(1-k*2)):0)+Math.sin(ph)*.12*mv;
  mPart(g,arm,4,-41.6+bob,-.46);
  mPart(g,sword,9,-31+bob,rot+.9);
  const ec=t.eye||'#ff7a3a';mGlow(g,4.9,-51.7+bob,2.3,ec,.9);mGlow(g,1,-51.9+bob,1.8,ec,.8);
  st.head={x:1,y:-60+bob}},

wraith(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,dk=darkOf(c,.55),dd=darkOf(c,.78),cl={tex:'cloth',texA:.6,rim:'rgba(255,255,255,.8)',rimW:1.2,lineW:.5};
  const body=monPart('wraith','body',c,v,bs,50,64,25,59,g=>{g.translate(25,59);
    // 안쪽 겉감 (더 어두운 뒷자락)
    const back=q=>{q.moveTo(-9,-44);q.bezierCurveTo(-14,-30,-17,-14,-18,-2);for(let i=0;i<5;i++)q.lineTo(-15+i*6,i%2?-6:1);q.bezierCurveTo(10,-20,4,-36,-9,-44);q.closePath()};
    g.fillStyle=dd;g.beginPath();back(g);g.fill();
    const p=q=>{q.moveTo(-6,-52);q.bezierCurveTo(6,-58,12,-46,11,-36);q.bezierCurveTo(12,-24,15,-14,16.4,-4);
      const J=[[13,2],[10.6,-4],[8,1.4],[5,-5],[2,2.6],[-.6,-3.4],[-3.4,1],[-6,-5],[-9,1.8],[-11,-3.6],[-14.6,0]];for(const [x,y] of J)q.lineTo(x,y);
      q.bezierCurveTo(-15,-14,-12,-26,-11,-36);q.bezierCurveTo(-11,-46,-10,-50,-6,-52);q.closePath()};
    Kit.solid(g,p,-15,-56,16,2,c,cl);mForm(g,p,-15,-56,16,2,1.1,.3,.15);
    g.save();g.beginPath();p(g);g.clip();
    // 세로 주름 (골 + 마루)
    for(const [x0,x1,x2] of [[-6,-9,-11],[-2,-3,-4],[2,4,5],[6,9,11],[9,12,14]]){mFold(g,[[x0*.6,-38],[x1,-20,x2,-2]],c,1.3)}
    // 찢어진 구멍
    for(const [x,y,rx,ry] of [[-6,-14,1.6,2.6],[7,-9,1.2,2],[1,-24,1,1.6]]){g.fillStyle=dd;g.beginPath();g.ellipse(x,y,rx,ry,.2,0,6.283);g.fill();g.strokeStyle=mrgb(liteOf(c,.3),.6);g.lineWidth=.4;g.beginPath();g.ellipse(x-.3,y-.3,rx,ry,.2,Math.PI,Math.PI*1.8);g.stroke()}
    // 허리 끈 + 늘어진 사슬
    g.strokeStyle=mrgb(dd,.9);g.lineWidth=1.4;g.beginPath();g.moveTo(-11,-30);g.quadraticCurveTo(1,-26,12.4,-30);g.stroke();g.strokeStyle=mrgb(liteOf(c,.25),.7);g.lineWidth=.6;g.beginPath();g.moveTo(-11,-30.6);g.quadraticCurveTo(1,-26.6,12.4,-30.6);g.stroke();
    g.strokeStyle='rgba(150,150,160,.85)';g.lineWidth=.6;for(let i=0;i<6;i++){g.beginPath();g.ellipse(4+i*.4,-27+i*2,.8,1.1,i%2?.6:0,0,6.283);g.stroke()}
    if(v==='kingcrown'){g.fillStyle='#3a1e5a';g.beginPath();g.moveTo(-12,-40);g.quadraticCurveTo(0,-30,12,-40);g.lineTo(13,-34);g.quadraticCurveTo(0,-24,-13,-34);g.closePath();g.fill();g.strokeStyle='#d8b050';g.lineWidth=1.2;g.stroke()}
    if(v==='weed'){g.strokeStyle='rgba(40,90,50,.85)';g.lineWidth=1.4;for(const x of [-9,-2,5,10]){g.beginPath();g.moveTo(x,-40);g.bezierCurveTo(x+3,-30,x-3,-20,x+1,-6);g.stroke()}}
    g.restore();
    // 두건: 겹친 천 가장자리
    const hood=q=>{q.moveTo(-8,-50);q.bezierCurveTo(-4,-58,8,-58,11,-48);q.bezierCurveTo(12.6,-42,11,-36,8,-33);q.quadraticCurveTo(2,-31,-2,-34);q.bezierCurveTo(-7,-37,-10,-44,-8,-50);q.closePath()};
    Kit.solid(g,hood,-10,-58,12.6,-31,liteOf(c,.05),cl);mForm(g,hood,-10,-58,12.6,-31,1,.3,.1);
    mFold(g,[[-5,-52],[-7,-46,-5,-38]],c,.9);
    // 두건 속 어둠 + 희미한 해골 윤곽
    g.fillStyle=dd;g.beginPath();g.ellipse(4.4,-42,6.2,7.2,.15,0,6.283);g.fill();
    g.fillStyle='#07050c';g.beginPath();g.ellipse(4.8,-41.4,5,6.2,.15,0,6.283);g.fill();
    g.fillStyle='rgba(200,190,220,.16)';g.beginPath();g.ellipse(5,-41.6,3.4,4,.1,0,6.283);g.fill();
    g.fillStyle='rgba(220,210,240,.22)';g.beginPath();g.moveTo(2.4,-38.4);g.lineTo(7.6,-38.6);g.lineTo(6.6,-36.6);g.lineTo(3.4,-36.6);g.closePath();g.fill();
    g.strokeStyle=mrgb(liteOf(c,.35),.7);g.lineWidth=.7;g.beginPath();g.ellipse(4.4,-42,6.2,7.2,.15,-2.4,-.4);g.stroke();
    // 아래로 갈수록 흩어짐
    g.globalCompositeOperation='destination-in';const gr=g.createLinearGradient(0,-56,0,2);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.55,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(-25,-60,50,64);g.globalCompositeOperation='source-over';
    // 윤곽선 (위쪽만 짙게: 아래는 흩어지므로 그대로)
    mInk(g,'rgba(14,8,20,.85)',.6);
    if(v==='kingcrown')crownPaint(g,1,-53,16,'#d8b050',5);
    if(v==='weed'){g.strokeStyle='#d8c070';g.lineWidth=1;g.beginPath();g.moveTo(-2,-32);g.lineTo(2,-26);g.lineTo(6,-32);g.stroke();Kit.solid(g,q=>{q.arc(2,-24,2.4,0,6.283)},0,-26,4,-22,'#e8c860',{lineW:.4})}});
  const arm=monPartX('wraith','arm',c,v,bs,34,20,4,7,g=>{g.translate(4,7);
    const sl=q=>{q.moveTo(0,-3);q.quadraticCurveTo(7,-5.6,12.6,-4.4);q.lineTo(15.4,-4.8);q.lineTo(14.6,-1);q.lineTo(15.6,2.6);q.lineTo(13.4,3.4);q.lineTo(12.6,8);q.lineTo(10.8,4.4);q.lineTo(8.8,9);q.lineTo(7.4,4.6);q.quadraticCurveTo(3,4.6,0,4);q.closePath()};
    Kit.solid(g,sl,0,-6.4,16,9,c,cl);mForm(g,sl,0,-6.4,16,9,.9);mFold(g,[[3,-1],[8,0,12,1]],c,.8);mFold(g,[[9,0],[10,3,9.6,6]],c,.6);
    // 뼈만 남은 손 · 긴 손톱
    const bn='#d8d0e0';Kit.solid(g,q=>q.ellipse(16,0,2.2,1.8,0,0,6.283),13.8,-1.8,18.2,1.8,bn,{tex:'bone',texA:.4,lineW:.4});
    g.lineCap='round';for(let i=0;i<4;i++){const y=-1.4+i*1.1,x2=24+(i===1?1:0)-(i===3?2:0);g.strokeStyle='#2a2030';g.lineWidth=1.1;g.beginPath();g.moveTo(17,y*.6);g.quadraticCurveTo(21,y*.9-.4,x2,y+1.4);g.stroke();g.strokeStyle=bn;g.lineWidth=.6;g.stroke();g.fillStyle='#1a1420';g.beginPath();g.moveTo(x2-.4,y+1);g.lineTo(x2+1.6,y+2.8);g.lineTo(x2,y+1.8);g.fill()}},.5);
  const fl=-7+Math.sin(st.t*2.2+(e.anim||0))*3,k=st.lunge,sk=Math.sin(st.t*1.7)*.05+(st.mv?-.08:0);
  if(st.mv>.2&&!st.noTrail&&(Q.lvl>0||g!==ctx)){for(const [d,a] of [[14,.16],[7,.28]]){g.globalAlpha=a*st.alpha;g.save();g.translate(-d,fl+d*.2);g.transform(1,0,sk,1,0,0);SC.draw(g,body,0,0);g.restore()}g.globalAlpha=st.alpha}
  g.save();g.translate(0,fl);g.transform(1,0,sk,1,0,0);
  mPart(g,arm,-2,-36,-.25+k*-.3);
  SC.draw(g,body,0,0);
  mPart(g,arm,2,-34,.15-k*.6+Math.sin(st.t*3)*.05);
  g.restore();
  const ec=v==='weed'?'#8ae8ff':'#ffffff';mGlow(g,6.4,-43+fl,2.4,ec,.95);mGlow(g,2.6,-43.4+fl,2,ec,.9);mGlow(g,4.4,-42+fl,8,c,.3);
  st.head={x:2,y:-62+fl}},

ogre(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,skin=c,sk={tex:'leather',texA:.3,rim:rimC,lineW:.5},hide='#5a3e24';
  const leg=monPartX('ogre','leg',c,v,bs,22,24,11,3,g=>{g.translate(11,3);
    const p=q=>{q.moveTo(-6,-2);q.lineTo(6,-2);q.bezierCurveTo(7.4,4,5.6,8,5,11);q.quadraticCurveTo(5.4,13.4,5.4,14.6);q.lineTo(8.6,16.6);q.quadraticCurveTo(9.6,18.6,7.6,18.6);q.lineTo(-6.4,18.6);q.quadraticCurveTo(-7,16.6,-5,14.6);q.quadraticCurveTo(-5,13,-4.8,11);q.bezierCurveTo(-6.4,7,-7.6,3,-6,-2);q.closePath()};
    Kit.solid(g,p,-7.6,-2,9.6,18.6,skin,sk);mForm(g,p,-7.6,-2,9.6,18.6,1);mSpeck(g,p,-7.6,-2,9.6,18.6,skin,22,3,1);
    g.fillStyle=mrgb(liteOf(skin,.3),.45);g.beginPath();g.ellipse(.6,8.6,3.2,2.2,0,0,6.283);g.fill();mFold(g,[[-2.6,9.6],[.6,11,3.6,9.6]],skin,.7);
    // 정강이 감개
    const wr=q=>{q.moveTo(-5,11.6);q.lineTo(5.2,11.6);q.lineTo(5.4,15);q.lineTo(-5.2,15);q.closePath()};Kit.solid(g,wr,-5.2,11.6,5.4,15,'#6a5a40',{tex:'cloth',texA:.5,lineW:.4});
    for(let i=0;i<4;i++){g.strokeStyle='rgba(30,20,10,.55)';g.lineWidth=.5;g.beginPath();g.moveTo(-5,12+i*.9);g.lineTo(5.2,12.6+i*.9);g.stroke()}
    g.strokeStyle=mrgb(darkOf(skin,.6),.9);g.lineWidth=.5;for(const x of [2.4,4.6,6.6]){g.beginPath();g.moveTo(x,16.6);g.lineTo(x+.6,18.4);g.stroke()}
    g.fillStyle='#d8ccb0';for(const x of [3.4,5.6,7.8]){g.beginPath();g.ellipse(x,18.2,.8,.45,0,0,6.283);g.fill()}
    g.globalCompositeOperation='destination-in';const fd=g.createLinearGradient(0,-2,0,1.6);fd.addColorStop(0,'rgba(0,0,0,0)');fd.addColorStop(1,'#000');g.fillStyle=fd;g.fillRect(-11,-3,22,24);g.globalCompositeOperation='source-over'},.6);
  const body=monPartX('ogre','body',c,v,bs,58,54,29,45,g=>{g.translate(29,45);
    const p=q=>{q.moveTo(-14,-38);q.bezierCurveTo(-6,-46,8,-46,14,-40);q.bezierCurveTo(20,-35,21,-30,18.6,-26);q.bezierCurveTo(25,-18,22,-3,10,0);q.lineTo(-12,0);q.bezierCurveTo(-21,-6,-22,-28,-14,-38);q.closePath()};
    Kit.solid(g,p,-22.6,-45,24.6,0,skin,sk);
    g.save();g.beginPath();p(g);g.clip();
    // 가슴 · 배 덩어리 (빛 받는 면)
    for(const [x,y,rx,ry,r,a] of [[-4,-30,7.6,4.6,-.3,.38],[8,-29,6.6,4,.3,.38],[5,-13,11,9.6,0,.3],[6,-16,6,5,0,.25]]){const gr=g.createRadialGradient(x-rx*.3,y-ry*.4,0,x,y,Math.max(rx,ry));gr.addColorStop(0,mrgb(liteOf(skin,.42),a));gr.addColorStop(1,mrgb(skin,0));g.fillStyle=gr;g.beginPath();g.ellipse(x,y,rx,ry,r,0,6.283);g.fill()}
    mFold(g,[[-8,-25],[0,-23,3,-26]],skin,1);mFold(g,[[3,-26],[8,-23,14,-25]],skin,1);mFold(g,[[-6,-6],[5,-2,16,-6]],skin,1.2);{const gb=g.createLinearGradient(0,-13,0,-8);gb.addColorStop(0,mrgb(darkOf(skin,.6),0));gb.addColorStop(1,mrgb(darkOf(skin,.7),.75));g.fillStyle=gb;g.fillRect(-20,-13,44,5)}mFold(g,[[-2,-26],[6,-21,17,-25]],skin,1.3);
    g.fillStyle=mrgb(darkOf(skin,.65),.85);g.beginPath();g.ellipse(6,-13,1.1,1.5,0,0,6.283);g.fill();
    // 가슴털 · 흉터
    g.save();g.translate(0,0);mFur(g,q=>q.ellipse(3,-27,10,6,0,0,6.283),'#2a1a10',-7,-33,13,-21,40,1.8,6);g.restore();
    mLine(g,[[11,-36],[15,-30]],'#5a2a20',.9,.7);mLine(g,[[11.6,-35],[14.6,-31.4]],'#e8b0a0',.35,.6);for(let i=0;i<3;i++)mLine(g,[[11.6+i*1.2,-35.6+i*1.8],[13+i*1.2,-34.6+i*1.8]],'#3a1a10',.35,.7);
    if(v==='maw'){g.fillStyle='#2a0a08';g.beginPath();g.ellipse(4,-14,8,6,0,0,6.283);g.fill();g.fillStyle='#f0e8d0';for(let i=0;i<7;i++){const a=i/6*Math.PI;g.beginPath();g.moveTo(4+Math.cos(a)*8,-14-Math.sin(a)*5.6);g.lineTo(4+Math.cos(a)*5,-14-Math.sin(a)*3);g.lineTo(4+Math.cos(a+.2)*8,-14-Math.sin(a+.2)*5.6);g.fill();g.beginPath();g.moveTo(4+Math.cos(a)*8,-14+Math.sin(a)*5.6);g.lineTo(4+Math.cos(a)*5,-14+Math.sin(a)*3);g.lineTo(4+Math.cos(a+.2)*8,-14+Math.sin(a+.2)*5.6);g.fill()}}
    g.restore();
    mForm(g,p,-22.6,-45,24.6,0,1.1,.4,.15);mSpeck(g,p,-22.6,-45,24.6,0,skin,70,7,1.3);
    // 등 쪽 가죽 어깨걸이 + 가시
    const pd=q=>{q.moveTo(-17,-34);q.quadraticCurveTo(-10,-46,2,-42);q.quadraticCurveTo(-2,-36,-6,-33);q.quadraticCurveTo(-12,-30,-17,-34);q.closePath()};
    Kit.solid(g,pd,-17,-46,2,-30,'#4a3420',{tex:'leather',texA:.7,rim:rimC,lineW:.5});mForm(g,pd,-17,-46,2,-30,.8);
    for(const [x,y,a] of [[-12,-39,-.9],[-7,-42,-.4],[-2,-43,.1]]){g.save();g.translate(x,y);g.rotate(a);Kit.solid(g,q=>{q.moveTo(-1.4,0);q.lineTo(0,-4.4);q.lineTo(1.4,0);q.closePath()},-1.4,-4.4,1.4,0,'#9a948a',{tex:'metal',texA:.5,lineW:.35});g.restore()}
    g.strokeStyle='#2a1a0e';g.lineWidth=1.2;g.beginPath();g.moveTo(-4,-34);g.lineTo(12,-6);g.stroke();g.strokeStyle='#6a4a2a';g.lineWidth=.6;g.stroke();
    // 털가죽 허리두르개 + 해골 버클
    const lc=q=>{q.moveTo(-14.6,-8.6);q.lineTo(15,-8.6);q.lineTo(13.4,-2);q.lineTo(12.4,5.6);q.lineTo(10,3);q.lineTo(7.6,6.6);q.lineTo(5.4,3);q.lineTo(3,5.8);q.lineTo(1.4,-3);q.lineTo(-4,-2.4);q.lineTo(-7,-5);q.lineTo(-10,-1.4);q.lineTo(-14.6,-3.6);q.closePath()};
    Kit.solid(g,lc,-14.6,-8.6,15,6.6,'#6a5034',{tex:'leather',texA:.4,rim:rimC,lineW:.5});mForm(g,lc,-14.6,-8.6,14.6,5.4,.8);mFur(g,lc,'#6a5034',-14.6,-8.6,14.6,5.4,90,2.2,13);
    Kit.solid(g,q=>q.rect(-14.6,-10.4,29.2,2.8),-14.6,-10.4,14.6,-7.6,'#3a2414',{tex:'leather',texA:.6,lineW:.4});
    const sb=q=>{q.moveTo(3.4,-12);q.bezierCurveTo(3.4,-14.6,8.6,-14.6,8.6,-12);q.lineTo(7.6,-8.6);q.lineTo(4.4,-8.6);q.closePath()};Kit.solid(g,sb,3.4,-14.6,8.6,-8.6,'#e8dcc0',{tex:'bone',texA:.5,lineW:.4});
    g.fillStyle='#1a120a';g.beginPath();g.ellipse(5,-11.6,.8,.9,0,0,6.283);g.ellipse(7,-11.6,.8,.9,0,0,6.283);g.fill()});
  const head=monPartX('ogre','head',c,v,bs,32,28,13,23,g=>{g.translate(13,23);
    if(v==='maw'){hornPaint(g,-3,-12,12,'#d8ccb0',-1);hornPaint(g,3,-13,11,'#c8bc9e',1)}
    const ear=q=>{q.moveTo(-5,-9);q.quadraticCurveTo(-10,-11,-9.4,-6);q.quadraticCurveTo(-8,-4,-5,-5);q.closePath()};Kit.solid(g,ear,-10,-11,-5,-4,darkOf(skin,.15),sk);
    const jaw=q=>{q.moveTo(-5,-4);q.quadraticCurveTo(3,-2,11.6,-3.6);q.quadraticCurveTo(12.4,1,8,2);q.quadraticCurveTo(0,3,-5,-1);q.closePath()};
    Kit.solid(g,jaw,-5,-4,12.4,3,liteOf(skin,.04),sk);mForm(g,jaw,-5,-4,12.4,3,.8);
    const p=q=>{q.moveTo(-6,-3);q.bezierCurveTo(-8,-14,4,-17.4,9,-11);q.lineTo(11.6,-7.4);q.quadraticCurveTo(10.6,-4.6,8,-4.2);q.quadraticCurveTo(1,-3,-6,-3);q.closePath()};
    Kit.solid(g,p,-8,-17.4,11.6,-3,skin,sk);mForm(g,p,-8,-17.4,11.6,-3,1,.3,.15);mSpeck(g,p,-8,-17.4,11.6,-3,skin,22,9,.8);
    // 무거운 눈썹뼈 · 작은 눈
    const br=q=>{q.moveTo(1,-11.6);q.quadraticCurveTo(6,-13.4,11,-9.6);q.lineTo(10.6,-8.4);q.quadraticCurveTo(6,-10.4,1.6,-9.6);q.closePath()};Kit.solid(g,br,1,-13.4,11,-8.4,liteOf(skin,.1),{lineW:.4});
    g.fillStyle=mrgb(darkOf(skin,.65),.85);g.beginPath();g.ellipse(6.8,-8.2,2.2,1.2,0,0,6.283);g.fill();mEye(g,7,-8,1.1,.8,'#ffcf5a',0,'#e8d8a0');
    // 납작코
    Kit.solid(g,q=>{q.moveTo(9,-9);q.quadraticCurveTo(12.6,-7.6,12,-5.4);q.lineTo(9.6,-5.6);q.closePath()},9,-9,12.6,-5.4,liteOf(skin,.08),{lineW:.4});g.fillStyle='#1a0e08';g.beginPath();g.ellipse(10.8,-5.8,.7,.4,0,0,6.283);g.fill();
    // 아래턱 송곳니 (엄니)
    g.fillStyle='#1a0806';g.beginPath();g.moveTo(3,-3.4);g.quadraticCurveTo(7,-2.4,11,-3.6);g.lineTo(10.6,-2.6);g.quadraticCurveTo(7,-1.6,3,-2.6);g.closePath();g.fill();
    for(const [x,h] of [[9.4,4.4],[4.6,3.2]])Kit.solid(g,q=>{q.moveTo(x-1,-2.4);q.quadraticCurveTo(x-.8,-2.4-h,x+.6,-2.6-h);q.quadraticCurveTo(x+.4,-3.6,x+1,-2.4);q.closePath()},x-1,-2.6-h,x+1,-2.4,'#ece2c4',{tex:'bone',texA:.4,lineW:.35});
    // 정수리 상투
    g.strokeStyle='#2a1a10';g.lineWidth=1.6;g.lineCap='round';g.beginPath();g.moveTo(-1,-15.6);g.quadraticCurveTo(-5,-20,-9,-17);g.stroke();g.fillStyle='#8a6a3a';g.fillRect(-2.4,-17.2,2,1.4)});
  const arm=b=>monPartX('ogre',b?'armB':'arm',c,v,bs,22,36,11,5,g=>{g.translate(11,5);const col=b?darkOf(skin,.28):skin;
    const p=q=>{q.moveTo(-5.6,-3);q.quadraticCurveTo(0,-6,6.6,-2.4);q.quadraticCurveTo(8.6,4,6.6,9);q.quadraticCurveTo(6.4,14,5.4,19);q.lineTo(-4,19);q.quadraticCurveTo(-5.4,14,-5.6,10);q.quadraticCurveTo(-7.6,4,-5.6,-3);q.closePath()};
    Kit.solid(g,p,-7.6,-6,8.6,19,col,sk);mForm(g,p,-7.6,-6,8.6,19,1);mSpeck(g,p,-7.6,-6,8.6,19,col,20,b?2:4,.9);
    g.fillStyle=mrgb(liteOf(col,.32),.42);g.beginPath();g.ellipse(1.4,2.6,3.4,4.6,0,0,6.283);g.fill();mFold(g,[[-4,9],[0,10.4,5,8.6]],col,.8);
    // 손목 감개 · 주먹
    Kit.solid(g,q=>q.rect(-4.6,15.4,10.2,3.4),-4.6,15.4,5.6,18.8,'#5a4a34',{tex:'cloth',texA:.6,lineW:.4});
    const f=q=>q.ellipse(.6,23,5.4,4.8,0,0,6.283);Kit.solid(g,f,-4.8,18.2,6,27.8,col,sk);mForm(g,f,-4.8,18.2,6,27.8,.9);
    g.strokeStyle=mrgb(darkOf(col,.65),.9);g.lineWidth=.55;for(const y of [21.2,23.4,25.4]){g.beginPath();g.moveTo(1.6,y);g.lineTo(5.6,y+.2);g.stroke()}
    g.fillStyle=mrgb(liteOf(col,.4),.6);for(const y of [20.6,22.8,24.8]){g.beginPath();g.arc(5,y,.6,0,6.283);g.fill()}},.6);
  const club=monPartX('ogre','club',c,v,bs,22,56,11,45,g=>{g.translate(11,45);
    const p=q=>{q.moveTo(-1.8,6);q.lineTo(1.8,6);q.lineTo(3,-6);q.bezierCurveTo(5.4,-14,7,-24,5.6,-31);q.quadraticCurveTo(4,-41,-1,-40.6);q.quadraticCurveTo(-6.6,-38.6,-5.6,-30);q.bezierCurveTo(-5.6,-22,-3.6,-12,-2.6,-6);q.closePath()};
    Kit.solid(g,p,-6.6,-41,7,6,'#5e4026',{tex:'wood',texA:.8,rim:rimC});mForm(g,p,-6.6,-41,7,6,1);
    for(const [x,y] of [[-2,-26],[2.6,-18],[-1,-34]]){g.fillStyle='#3a2414';g.beginPath();g.ellipse(x,y,1.6,1,.3,0,6.283);g.fill();g.strokeStyle='rgba(160,120,80,.6)';g.lineWidth=.4;g.beginPath();g.ellipse(x,y,2.4,1.5,.3,0,6.283);g.stroke()}
    // 쇠 띠 · 쇠못
    Kit.solid(g,q=>{q.moveTo(-5.4,-28.4);q.lineTo(5.8,-28.4);q.lineTo(5.8,-26.2);q.lineTo(-5.4,-26.2);q.closePath()},-5.4,-28.4,5.8,-26.2,'#6a6660',{tex:'metal',texA:.6,lineW:.35});
    for(const [x,y,a] of [[-5.4,-33,-1.6],[5.6,-31,1.5],[-5,-22,-1.4],[5.4,-20,1.6],[-1,-40,-.1],[4,-38,.7],[-4.6,-38,-.8]]){g.save();g.translate(x,y);g.rotate(a);Kit.solid(g,q=>{q.moveTo(-1.2,.6);q.lineTo(0,-3.2);q.lineTo(1.2,.6);q.closePath()},-1.2,-3.2,1.2,.6,'#a8a49c',{tex:'metal',texA:.5,rim:'rgba(255,255,255,.9)',lineW:.3});g.restore()}
    // 손잡이 밧줄
    for(let i=0;i<5;i++){g.strokeStyle='#8a7048';g.lineWidth=1;g.beginPath();g.moveTo(-2.2,-2+i*1.4);g.lineTo(2.2,-1.2+i*1.4);g.stroke();g.strokeStyle='rgba(30,20,10,.6)';g.lineWidth=.35;g.stroke()}},.6);
  const ph=st.ph*7,mv=st.mv,sw=Math.sin(ph)*.4*mv,bob=-Math.abs(Math.sin(ph))*2*mv+Math.sin(st.t*2)*.5;
  mPart(g,arm(1),-10,-42+bob,.25-sw*.5);
  mPart(g,leg,-7,-18+bob*.3,-sw);mPart(g,leg,7,-18+bob*.3,sw);
  SC.draw(g,body,0,-16+bob);
  mPart(g,head,3,-56+bob,Math.sin(ph*.5)*.04);
  const k=st.lunge,u=k>0?1-k:0,rot=k>0?(u<.4?-2.2*u/.4:-2.2+2.8*(u-.4)/.6):(-.35+sw*.4);
  mPart(g,arm(0),11,-44+bob,rot*.6);
  const hx=11-Math.sin(rot*.6)*23,hy=-44+bob+Math.cos(rot*.6)*23;mPart(g,club,hx,hy,rot+.4);
  st.head={x:4,y:-74+bob}},

knight(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,tab=v==='broken'?'#4a2a5a':v==='warlord'?'#5a1414':Kit.mix(c,'#6a1e1e',.6);
  const mo={tex:'metal',texA:.7,rim:'rgba(255,255,255,.95)',lineW:.45},gold='#c8a050',dkm=darkOf(c,.6);
  const rivet=(g,x,y,r)=>{g.fillStyle=mrgb(dkm,.9);g.beginPath();g.arc(x+.15,y+.15,r||.5,0,6.283);g.fill();g.fillStyle='rgba(255,255,240,.9)';g.beginPath();g.arc(x-.1,y-.1,(r||.5)*.55,0,6.283);g.fill()};
  const shine=(g,pts,w)=>mLine(g,pts,'#ffffff',w||.6,.55);
  const leg=monPartX('knight','leg',c,v,bs,14,24,7,3,g=>{g.translate(7,3);
    const cu=q=>{q.moveTo(-3.6,-2);q.lineTo(3.6,-2);q.lineTo(3.2,6.6);q.lineTo(-3.2,6.6);q.closePath()};Kit.solid(g,cu,-3.6,-2,3.6,6.6,c,mo);mForm(g,cu,-3.6,-2,3.6,6.6,.8);shine(g,[[-1.8,-.6],[-1.6,5.4]],.5);
    g.fillStyle=mrgb(darkOf(c,.5),.9);g.fillRect(-3.4,6.4,6.6,1.2);
    const gr=q=>{q.moveTo(-3,8.6);q.lineTo(3,8.6);q.lineTo(2.8,14.6);q.lineTo(-2.8,14.6);q.closePath()};Kit.solid(g,gr,-3,8.6,3,14.6,darkOf(c,.08),mo);mForm(g,gr,-3,8.6,3,14.6,.8);shine(g,[[-1.4,9.4],[-1.3,13.8]],.45);
    // 무릎 덮개 + 날개
    const kn=q=>q.ellipse(.2,7.8,3.8,2.6,0,0,6.283);Kit.solid(g,kn,-3.6,5.2,4,10.4,c,mo);Kit.solid(g,q=>{q.moveTo(-3.4,7);q.lineTo(-5.4,6);q.lineTo(-4.6,9.4);q.closePath()},-5.4,6,-3.4,9.4,c,mo);rivet(g,.4,7.6,.55);
    // 쇠신 (마디)
    const sb=q=>{q.moveTo(-3,14.4);q.lineTo(2.8,14.4);q.lineTo(5.8,16.6);q.quadraticCurveTo(6.6,18.4,5,18.4);q.lineTo(-3.4,18.4);q.closePath()};Kit.solid(g,sb,-3.4,14.4,6.6,18.4,darkOf(c,.15),mo);
    g.strokeStyle=mrgb(dkm,.8);g.lineWidth=.4;for(const x of [1,2.6,4.2]){g.beginPath();g.moveTo(x,14.8+(x-1)*.5);g.lineTo(x-.4,18.2);g.stroke()}
    g.globalCompositeOperation='destination-in';const fd=g.createLinearGradient(0,-2,0,1);fd.addColorStop(0,'rgba(0,0,0,0)');fd.addColorStop(1,'#000');g.fillStyle=fd;g.fillRect(-7,-3,14,24);g.globalCompositeOperation='source-over'},.5);
  const cape=monPartX('knight','cape',c,v,bs,38,48,19,4,g=>{g.translate(19,4);const cc=darkOf(tab,.2);
    const p=q=>{q.moveTo(-8,0);q.lineTo(8,0);q.bezierCurveTo(10,14,8,30,5,40);const J=[[3,37.6],[1.6,41.6],[-.6,37],[-3,42.4],[-5,38],[-7.6,41],[-9,36.4],[-11.4,38.6]];for(const [x,y] of J)q.lineTo(x,y);q.bezierCurveTo(-16,26,-12,12,-8,0);q.closePath()};
    Kit.solid(g,p,-16,0,10,42,cc,{tex:'cloth',texA:.6,rim:rimC,lineW:.45});mForm(g,p,-16,0,10,42,1,.4,.1);
    g.save();g.beginPath();p(g);g.clip();for(const [a,b,c2] of [[-4,-7,-9],[0,-2,-3],[4,4,2]])mFold(g,[[a,2],[b,20,c2,40]],cc,1.4);g.restore();
    if(v==='broken'||v==='warlord'){g.fillStyle='rgba(0,0,0,.5)';for(const [x,y] of [[-6,30],[0,24],[-10,36]]){g.beginPath();g.arc(x,y,2.2,0,6.283);g.fill()}}},.5);
  const torso=monPartX('knight','torso',c,v,bs,36,34,18,29,g=>{g.translate(18,29);
    // 흉갑 (가운데 능선)
    const p=q=>{q.moveTo(-8,-24);q.lineTo(9,-24);q.quadraticCurveTo(11.4,-12,8.4,-5);q.lineTo(-8,-5);q.quadraticCurveTo(-11,-12,-8,-24);q.closePath()};
    Kit.solid(g,p,-11,-24,11.4,-5,c,mo);mForm(g,p,-11,-24,11.4,-5,1,.25,.15);
    g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.moveTo(-3,-22);g.quadraticCurveTo(-5,-14,-3,-7);g.lineTo(-1.8,-7);g.quadraticCurveTo(-3.6,-14,-1.8,-22);g.fill();
    mLine(g,[[1.4,-23],[2.6,-15,1.4,-7]],dkm,.7,.6);
    // 목가리개
    Kit.solid(g,q=>{q.moveTo(-5,-25.6);q.quadraticCurveTo(1,-28,7,-25.6);q.lineTo(6.4,-23.2);q.quadraticCurveTo(1,-25,-4.6,-23.2);q.closePath()},-5,-28,7,-23.2,darkOf(c,.1),mo);
    // 겉옷 (금테 · 문장)
    const tb=q=>{q.moveTo(-7,-13);q.lineTo(8,-13);q.lineTo(7.4,2.4);q.lineTo(3.6,.4);q.lineTo(.4,3.4);q.lineTo(-3,.6);q.lineTo(-7,2.4);q.closePath()};
    Kit.solid(g,tb,-7,-13,8,3.4,tab,{tex:'cloth',texA:.5,lineW:.45});mForm(g,tb,-7,-13,8,3.4,.9);mFold(g,[[-3,-11],[-2.4,-5,-3.4,.4]],tab,.7);mFold(g,[[4,-11],[4.6,-5,3.8,.4]],tab,.7);
    g.strokeStyle=gold;g.lineWidth=.6;g.beginPath();g.moveTo(-7,2.4);g.lineTo(-3,.6);g.lineTo(.4,3.4);g.lineTo(3.6,.4);g.lineTo(7.4,2.4);g.stroke();
    g.strokeStyle=gold;g.lineWidth=1.1;g.beginPath();g.moveTo(.5,-11);g.lineTo(.5,-2);g.moveTo(-2.6,-7.6);g.lineTo(3.6,-7.6);g.stroke();g.strokeStyle='rgba(255,240,180,.7)';g.lineWidth=.4;g.beginPath();g.moveTo(.2,-11);g.lineTo(.2,-2);g.stroke();
    // 허리띠 · 버클
    Kit.solid(g,q=>q.rect(-8.4,-6.4,17.4,2.4),-8.4,-6.4,9,-4,'#2a2018',{tex:'leather',texA:.6,lineW:.35});Kit.solid(g,q=>q.rect(-.6,-6.8,2.6,3.2),-.6,-6.8,2,-3.6,gold,{tex:'metal',texA:.5,lineW:.3});
    // 어깨받이: 세 겹 판
    const pad=s=>{const W=v==='warlord'?7.6:5.8,H=v==='warlord'?4.6:3.6;for(let i=2;i>=0;i--){const y=-23+i*2.2,cx=s*7,pp=q=>q.ellipse(cx,y,W-i*.5,H-i*.4,s*.3,0,6.283);Kit.solid(g,pp,cx-W,y-H,cx+W,y+H,i?darkOf(c,.12*i):c,mo)}
      rivet(g,s*7-2,-24,.5);rivet(g,s*7+2,-24.4,.5);g.strokeStyle=gold;g.lineWidth=.5;g.beginPath();g.ellipse(s*7,-23,W-.6,H-.6,s*.3,Math.PI*1.1,Math.PI*1.9);g.stroke()};pad(-1);pad(1);
    if(v==='warlord'){for(const s of [-1,1])for(let i=0;i<3;i++)hornPaint(g,s*7+s*(i*2.6-2.6),-26,5,'#d8ccb0',s)}});
  const helm=monPartX('knight','helm',c,v,bs,32,34,16,27,g=>{g.translate(16,27);
    if(v==='warlord'){hornPaint(g,-4,-12,14,'#2a2420',-1);hornPaint(g,4,-13,13,'#3a3430',1)}
    if(v!=='warlord'&&v!=='broken'){// 깃털 장식
      const pl=q=>{q.moveTo(0,-16.6);q.bezierCurveTo(-4,-23,-10,-22,-13,-15);q.bezierCurveTo(-10,-18,-6,-18,-3,-15.4);q.closePath()};Kit.solid(g,pl,-13,-23,0,-15,'#8a2a1e',{tex:'cloth',texA:.5,rim:rimC,lineW:.4});
      g.strokeStyle='rgba(30,8,4,.6)';g.lineWidth=.4;for(let i=0;i<5;i++){g.beginPath();g.moveTo(-2-i*2,-17.4-i*.4);g.lineTo(-4-i*2,-15.6-i*.2);g.stroke()}}
    const p=q=>{q.moveTo(-6,0);q.lineTo(-6.6,-10);q.quadraticCurveTo(-5,-17,1,-17);q.quadraticCurveTo(7.6,-16,7.6,-9);q.quadraticCurveTo(8.6,-5,7,0);q.closePath()};
    Kit.solid(g,p,-7,-17,8.6,0,c,mo);mForm(g,p,-7,-17,8.6,0,1,.25,.15);
    // 가운데 능선 · 눈구멍 · 숨구멍
    mLine(g,[[1,-17],[5,-15.6,7.4,-10.4]],'#ffffff',.6,.5);
    g.fillStyle='#0a0806';g.beginPath();g.moveTo(1.4,-10.6);g.lineTo(8,-10.4);g.lineTo(8,-8.6);g.lineTo(1.6,-8.8);g.closePath();g.fill();
    g.fillStyle=mrgb(dkm,.9);g.fillRect(4.4,-8.6,1,3.4);for(const [x,y] of [[2.6,-5.6],[3.8,-4.6],[2.6,-3.6],[6,-5.2],[6.6,-4]]){g.beginPath();g.arc(x,y,.4,0,6.283);g.fill()}
    g.fillStyle='rgba(255,255,255,.6)';g.fillRect(-4,-14,1,10);
    for(const [x,y] of [[-5,-2],[-5.4,-8],[6.6,-1.6]])rivet(g,x,y,.45);
    g.strokeStyle=mrgb(dkm,.7);g.lineWidth=.5;g.beginPath();g.moveTo(-6,-1.4);g.quadraticCurveTo(1,-.4,7.2,-1.4);g.stroke();
    mLine(g,[[-2.4,-12.6],[-1.4,-11.4]],'#1a1410',.4,.7);mLine(g,[[3.6,-14.6],[4.6,-13]],'#1a1410',.4,.6);
    if(v==='broken'){g.strokeStyle='#0a0806';g.lineWidth=.9;g.beginPath();g.moveTo(-3,-16);g.lineTo(-1,-11);g.lineTo(-3,-7);g.lineTo(-1,-3);g.stroke();crownPaint(g,0,-15.5,11,'#7a6a5a',3)}
    if(v==='warlord')crownPaint(g,.5,-16,13,'#d8b050',5)});
  const sword=monPartX('knight','sword',c,v,bs,16,52,8,43,g=>{g.translate(8,43);
    Kit.solid(g,q=>q.rect(-1.3,-2,2.6,6.6),-1.3,-2,1.3,4.6,'#3a2a1a',{tex:'leather',texA:.6,lineW:.35});
    g.strokeStyle='rgba(200,160,90,.6)';g.lineWidth=.35;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-1.3,-1.4+i*1.5);g.lineTo(1.3,-.6+i*1.5);g.stroke()}
    Kit.solid(g,q=>q.ellipse(0,5.4,1.8,1.5,0,0,6.283),-1.8,3.9,1.8,6.9,'#b09050',{tex:'metal',texA:.5,lineW:.35});
    Kit.solid(g,q=>{q.moveTo(-5.6,-2.4);q.quadraticCurveTo(-6.4,-4.2,-5,-4);q.lineTo(5,-4);q.quadraticCurveTo(6.4,-4.2,5.6,-2.4);q.closePath()},-6.4,-4.2,6.4,-2.4,'#b09050',{tex:'metal',texA:.5,rim:rimC,lineW:.35});
    const bl=q=>{q.moveTo(-2,-4);q.lineTo(2,-4);q.lineTo(1.7,-36);q.lineTo(0,-40.6);q.lineTo(-1.7,-36);q.closePath()};
    Kit.solid(g,bl,-2,-40.6,2,-4,v==='warlord'?'#5a4a44':'#c8c4bc',{tex:'metal',texA:.6,rim:'rgba(255,255,255,1)',lineW:.4});
    g.fillStyle='rgba(40,40,50,.45)';g.fillRect(-.35,-34,.7,28);g.fillStyle='rgba(255,255,255,.75)';g.fillRect(-1.3,-34,.45,28)},.45);
  const shield=monPartX('knight','shield',c,v,bs,26,32,13,15,g=>{g.translate(13,15);
    const p=q=>{q.moveTo(-9,-12);q.quadraticCurveTo(0,-13.6,9,-12);q.lineTo(9,0);q.quadraticCurveTo(8,9,0,14);q.quadraticCurveTo(-8,9,-9,0);q.closePath()};
    Kit.solid(g,p,-9,-13.6,9,14,tab,{tex:'cloth',texA:.4,rim:rimC});mForm(g,p,-9,-13.6,9,14,1);
    // 문장: 금색 사선 띠 + 십자
    g.save();g.beginPath();p(g);g.clip();g.fillStyle=mrgb(darkOf(tab,.35),.8);g.beginPath();g.moveTo(-9,-3);g.lineTo(9,-9);g.lineTo(9,-4);g.lineTo(-9,2);g.closePath();g.fill();g.restore();
    g.strokeStyle=gold;g.lineWidth=1.6;g.beginPath();g.moveTo(0,-9);g.lineTo(0,9);g.moveTo(-5,-3);g.lineTo(5,-3);g.stroke();g.strokeStyle='rgba(255,240,180,.75)';g.lineWidth=.45;g.beginPath();g.moveTo(-.4,-9);g.lineTo(-.4,9);g.moveTo(-5,-3.4);g.lineTo(5,-3.4);g.stroke();
    // 쇠 테두리 · 징 · 흠집
    g.strokeStyle=darkOf(c,.35);g.lineWidth=2.2;g.beginPath();p(g);g.stroke();g.strokeStyle=c;g.lineWidth=1.2;g.beginPath();p(g);g.stroke();g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=.4;g.beginPath();g.moveTo(-9,0);g.lineTo(-9,-12);g.quadraticCurveTo(0,-13.6,9,-12);g.stroke();
    for(const [x,y] of [[-7.6,-10.6],[7.6,-10.6],[-7.6,0],[7.6,0],[0,12]])rivet(g,x,y,.55);
    mLine(g,[[3,4],[5.4,6.4]],'#140c06',.5,.7);mLine(g,[[-5.4,-8],[-3.4,-6.4]],'#140c06',.45,.6)});
  const ph=st.ph*8,mv=st.mv,sw=Math.sin(ph)*.45*mv,bob=-Math.abs(Math.sin(ph))*1.4*mv;
  mPart(g,cape,-2,-46+bob,.12+Math.sin(st.t*1.6)*.04+mv*.12);
  mPart(g,leg,-4,-20+bob,-sw);mPart(g,leg,4,-20+bob,sw);
  SC.draw(g,torso,0,-18+bob);
  mPart(g,helm,1,-44+bob,0);
  const k=st.lunge,rot=k>0?-1.4+2.6*(1-k):-.2+sw*.3;
  mPart(g,sword,10,-30+bob,rot+.6);
  mPart(g,shield,8,-30+bob,-.08);
  const ec=v==='warlord'?'#ff4a1a':t.eye||'#ff5a2a';mGlow(g,7,-54.4+bob,2.6,ec,.9);mGlow(g,4.6,-54.4+bob,2,ec,.8);
  if(v==='warlord'){const sx=10+Math.sin(rot+.6)*20,sy=-30+bob-Math.cos(rot+.6)*20;mGlow(g,sx,sy,14+Math.sin(st.t*10)*2,'#ff6a2a',.8)}
  st.head={x:1,y:-66+bob}},

apostle(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,pc=t.pcol||'#ff5a2a',robe=Kit.mix(c,'#2a1410',.55);
  const body=monPart('apostle','robe',c,v,bs,40,60,20,58,g=>{g.translate(20,58);
    const p=q=>{q.moveTo(-6,-50);q.lineTo(7,-50);q.bezierCurveTo(10,-34,13,-16,17,0);q.quadraticCurveTo(0,4,-16,0);q.bezierCurveTo(-12,-16,-10,-34,-6,-50);q.closePath()};
    Kit.solid(g,p,-16,-50,17,3,robe,{tex:'cloth',texA:.55,rim:rimC});
    g.save();g.beginPath();p(g);g.clip();
    g.fillStyle=c;g.beginPath();g.moveTo(1,-50);g.lineTo(5,-50);g.lineTo(8,3);g.lineTo(-2,3);g.closePath();g.fill();
    g.strokeStyle='#d8b050';g.lineWidth=1.2;g.beginPath();g.moveTo(1,-50);g.lineTo(-2,3);g.moveTo(5,-50);g.lineTo(8,3);g.stroke();
    g.fillStyle='#d8b050';for(let y=-42;y<0;y+=7){g.beginPath();g.moveTo(3+y*-.04,y);g.lineTo(5+y*-.04,y+2.4);g.lineTo(3+y*-.04,y+4.8);g.lineTo(1+y*-.04,y+2.4);g.closePath();g.fill()}
    g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1.3;for(const x of [-10,-5,11,14]){g.beginPath();g.moveTo(x*.4,-40);g.quadraticCurveTo(x*.8,-20,x,2);g.stroke()}
    g.strokeStyle='#d8b050';g.lineWidth=2;g.beginPath();g.moveTo(-16,0);g.quadraticCurveTo(0,4,17,0);g.stroke();
    g.restore()});
  const hood=monPart('apostle','hood',c,v,bs,36,40,18,30,g=>{g.translate(18,30);
    if(v==='halo'){g.strokeStyle='#e8d070';g.lineWidth=2;g.beginPath();g.arc(-2,-14,11,Math.PI*.9,Math.PI*2.35);g.stroke();g.strokeStyle='#5a3a6a';g.beginPath();g.moveTo(8,-20);g.lineTo(5,-17);g.stroke()}
    if(v==='flamecrown'){hornPaint(g,-4,-16,14,'#1e1410',-1);hornPaint(g,4,-17,14,'#2a1e18',1)}
    const p=q=>{q.moveTo(-8,0);q.bezierCurveTo(-11,-12,-6,-20,1,-20);q.bezierCurveTo(9,-20,11,-10,9,0);q.closePath()};
    Kit.solid(g,p,-11,-20,11,0,robe,{tex:'cloth',texA:.5,rim:rimC});
    g.fillStyle='#08040a';g.beginPath();g.ellipse(4,-9,5,6,.1,0,6.283);g.fill();
    g.strokeStyle='#d8b050';g.lineWidth=1.2;g.beginPath();g.ellipse(4,-9,5.6,6.6,.1,-1.9,1.6);g.stroke();
    if(v==='mitre'){Kit.solid(g,q=>{q.moveTo(-6,-18);q.quadraticCurveTo(-6,-34,1,-38);q.quadraticCurveTo(8,-34,8,-18);q.closePath()},-6,-38,8,-18,'#e8e0c8',{tex:'cloth',texA:.4,rim:rimC});g.strokeStyle='#d8b050';g.lineWidth=1.4;g.beginPath();g.moveTo(1,-36);g.lineTo(1,-19);g.moveTo(-3,-28);g.lineTo(5,-28);g.stroke()}
    if(v==='flamecrown')crownPaint(g,1,-19,13,'#2a1a14',5)});
  const staff=monPart('apostle','staff',c,v,bs,18,70,9,40,g=>{g.translate(9,40);
    Kit.solid(g,q=>{q.moveTo(-1.4,26);q.lineTo(1.4,26);q.lineTo(1.2,-30);q.lineTo(-1.2,-30);q.closePath()},-2,-30,2,26,'#3a2218',{tex:'wood',texA:.6,lineW:.5});
    Kit.solid(g,q=>{q.moveTo(-6,-32);q.lineTo(6,-32);q.lineTo(3,-27);q.lineTo(-3,-27);q.closePath()},-6,-32,6,-27,'#8a6a3a',{tex:'metal',texA:.6,rim:rimC,lineW:.5});
    g.strokeStyle='#8a6a3a';g.lineWidth=1.2;for(const s of [-1,1]){g.beginPath();g.moveTo(s*5.6,-32);g.quadraticCurveTo(s*7,-36,s*3,-38);g.stroke()}});
  const sway=Math.sin(st.t*1.4)*.025,mv=st.mv,bob=Math.sin(st.t*1.6)*.6-Math.abs(Math.sin(st.ph*6))*mv;
  const k=st.lunge;
  mPart(g,staff,-9,-34+bob,-.08-k*.2);
  mGlow(g,-9+Math.sin(-.08-k*.2)*36,-34+bob-36,9+Math.sin(st.t*8)*1.5,pc,.95);mGlow(g,-9,-70+bob,3,'#fff',.85);
  g.save();g.transform(1,0,sway+(mv?-.05:0),1,0,0);SC.draw(g,body,0,bob*.4);g.restore();
  SC.draw(g,hood,1,-48+bob);
  mGlow(g,6,-58+bob,2.6,pc,.95);mGlow(g,3,-58.4+bob,2.2,pc,.9);
  // 손에 떠도는 마력
  const hx=12+k*6,hy=-30+bob-k*4;Kit.solid(g,q=>q.arc(hx-3,hy+2,2.4,0,6.283),hx-5,hy,hx-1,hy+4,'#c8a080',{lineW:.4});
  const n=v==='flamecrown'?4:2;for(let i=0;i<n;i++){const a=st.t*3+i*6.283/n;mGlow(g,hx+Math.cos(a)*7,hy-4+Math.sin(a)*3,3.4,pc,.9)}
  mGlow(g,hx,hy-4,7+Math.sin(st.t*6)*1.5+k*6,pc,.9);mGlow(g,hx,hy-4,2.6,'#fff',.9);
  st.head={x:2,y:-74+bob}},
};

// 공통 바닥 그림 (한 번만 굽는다)
function monRing(col){return SC.get('mon/ring/'+col,96,48,48,24,g=>{g.translate(48,24);g.scale(1,.5);for(let i=0;i<3;i++){g.strokeStyle=Kit.rgb(Kit.hex(col),.35-i*.1);g.lineWidth=5-i*1.5;g.beginPath();g.arc(0,0,40-i*3,0,6.283);g.stroke()}g.strokeStyle=Kit.rgb(Kit.hex(col),.9);g.lineWidth=1.4;g.beginPath();g.arc(0,0,40,0,6.283);g.stroke()},{force:1,pin:1,scale:2})}
function monAura(){return SC.get('mon/aura',128,64,64,32,g=>{const gr=g.createRadialGradient(64,32,0,64,32,64);gr.addColorStop(0,'rgba(40,0,0,.75)');gr.addColorStop(.6,'rgba(60,6,4,.45)');gr.addColorStop(1,'rgba(0,0,0,0)');g.save();g.scale(1,.5);g.translate(0,32);g.fillStyle=gr;g.fillRect(0,-32,128,128);g.restore()},{force:1,pin:1,scale:1})}
function monIce(){return SC.get('mon/ice',40,60,20,56,g=>{g.translate(20,56);const sh=q=>{q.moveTo(-15,0);q.lineTo(-17,-22);q.lineTo(-10,-42);q.lineTo(-3,-52);q.lineTo(4,-46);q.lineTo(10,-54);q.lineTo(15,-34);q.lineTo(17,-16);q.lineTo(14,0);q.quadraticCurveTo(0,4,-15,0);q.closePath()};
  g.globalAlpha=.5;Kit.solid(g,sh,-17,-54,17,3,'#8fd8ff',{rim:'rgba(255,255,255,1)',rimW:2.4,lineW:1});g.globalAlpha=1;g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1;for(const [a,b,c2,d] of [[-10,-32,-4,-14],[6,-40,10,-22],[-2,-8,6,-2]]){g.beginPath();g.moveTo(a,b);g.lineTo(c2,d);g.stroke()}},{force:1,pin:1,scale:2})}

// 몬스터 하나 그리기. g: 캔버스, (x,y): 발밑 화면 좌표, o: {t, mv, k(배율), noHover, die}
function drawMon(g,e,x,y,o){o=o||{};const t=TYPES[e.k];if(!t||!MON[t.draw])return;
  const sc=(e.sc||(e.elite?1.25:1))*(o.k||1),now=o.t!=null?o.t:time;
  let a=MANIM.get(e);if(!a){a={ph:e.anim||0,last:now,lx:e.x,ly:e.y,mv:0};MANIM.set(e,a)}
  const dt=Math.max(0,Math.min(.1,now-a.last));a.last=now;
  const moved=Math.hypot(e.x-a.lx,e.y-a.ly);a.lx=e.x;a.ly=e.y;
  const held=e.freezeT>0||e.stunT>0;
  a.mv+=(((o.mv!=null?o.mv:moved>.2)&&!held?1:0)-a.mv)*Math.min(1,dt*10);
  if(!held)a.ph+=dt*(e.slowT>0?.45:1)*(.3+a.mv);
  const st={ph:a.ph,mv:a.mv,t:held?a.frz||(a.frz=now):(a.frz=0,now),lunge:held?0:Math.max(0,e.lunge||0)/.15,bs:monBs(sc),v:MON_V[e.k]||'',alpha:o.alpha==null?1:o.alpha,noTrail:o.die!=null};
  const big=e.boss||t.boss||t.mini,hk=Math.max(0,e.hurt||0)/.12,cast=e.cast>0&&big,dash=e.dash>0;
  g.save();g.translate(x+(e.lunge>0&&!held?e.fx*3:0)-e.fx*hk*4*(o.k||1),y);
  if(o.die==null){
    if(big){const A=monAura(),r=t.r*sc*1.9;g.globalAlpha=.9;g.drawImage(A.cv,-r,-r*.5,r*2,r);g.globalAlpha=1;
      const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';mGlow(g,0,-t.r*sc*.9,t.r*sc*(1.7+Math.sin(now*3)*.12)+(cast?10:0),t.boss?'rgba(255,60,40,.55)':'rgba(255,120,60,.45)',1);g.globalCompositeOperation=po}
    if(cast){const k=Math.min(1,e.cast/.95),Hc=MON_H[t.draw]*sc,R0=monRing('#ff3a2a'),r=t.r*sc*(2.4-1.2*k);g.drawImage(R0.cv,-r,-r*.5,r*2,r);const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';mGlow(g,0,-Hc*.5,Hc*(.5+.3*(1-k))+Math.sin(now*20)*2,'rgba(255,80,40,.6)',.6);g.globalCompositeOperation=po}
    if(e.elite){const R0=monRing('#6e96ff'),r=t.r*sc*1.5;g.drawImage(R0.cv,-r,-r*.5,r*2,r)}
    if(t.boss){const R0=monRing('#ff5a3a'),r=t.r*sc*1.7*(1+Math.sin(now*2.4)*.04);g.drawImage(R0.cv,-r,-r*.5,r*2,r)}
    if(e.slowT>0){const R0=monRing('#8fd8ff'),r=t.r*sc*1.2;g.globalAlpha=.8;g.drawImage(R0.cv,-r,-r*.5,r*2,r);g.globalAlpha=1}
    Kit.shadow(g,t.r*.2*sc,1,t.r*1.3*sc,t.r*.5*sc,t.draw==='wraith'?.55:1);
    if(e===hover&&!o.noHover){const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';mGlow(g,0,-t.r*sc,t.r*sc*1.8,'rgba(255,90,60,.5)',.8);g.globalCompositeOperation=po}
    if(e.elite){const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';mGlow(g,0,-MON_H[t.draw]*sc*.5,MON_H[t.draw]*sc*.75,e.elite?'rgba(110,150,255,.55)':'rgba(200,190,255,.12)',1);g.globalCompositeOperation=po}
  }
  g.save();
  if(o.die!=null){const u=o.die;g.globalAlpha=(1-u)*(1-u);g.translate(0,u*3);g.rotate(-u*1.25);g.scale(sc*e.fx,sc*(1-u*.2))}
  else{if(cast){g.translate(Math.sin(now*55)*1.2,-2-Math.sin(now*8));}if(dash)g.rotate(e.fx*.16);g.scale(sc*e.fx,sc)}
  if(dash&&o.die==null){for(const [d,al] of [[22,.18],[11,.3]]){g.globalAlpha=al;g.save();g.translate(-d,0);MON[t.draw](g,e,t,Object.assign({},st,{noTrail:1}));g.restore()}g.globalAlpha=1}
  if(o.alpha!=null)g.globalAlpha=o.alpha;
  MON[t.draw](g,e,t,st);
  g.restore();
  if(o.die!=null){g.restore();return}
  const H=MON_H[t.draw]*sc,hd=st.head||{x:0,y:-MON_H[t.draw]};const hx=hd.x*sc*e.fx,hy=hd.y*sc;
  const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';
  if(cast){mGlow(g,hx,hy+8*sc,7*sc,'#ffd0a0',.7)}
  if(e.burn){for(let i=0;i<3;i++){const f=Math.sin(now*14+i*2.1);mGlow(g,(i-1)*t.r*.5*sc,-H*(.25+i*.18)+f*2,(5+f*1.6)*Math.sqrt(sc),i%2?'#ffb040':'#ff6a2a',.9)}}
  if(hk>0)mGlow(g,0,-H*.5,H*.75,'rgba(255,255,255,.95)',hk*.75);
  g.globalCompositeOperation=po;
  if(e.freezeT>0){const I=monIce(),w=Math.max(30,t.r*2.4)*sc,h=H*1.15;g.drawImage(I.cv,-w/2,-h,w,h*1.07)}
  if(e.stunT>0){const S0=heroPart('mage','star',0,'');for(let i=0;i<3;i++){const an=now*4+i*2.094;SC.draw(g,S0,hx+Math.cos(an)*10*Math.sqrt(sc),hy-6+Math.sin(an)*3)}
    if(Math.sin(now*17)>.4){g.strokeStyle='rgba(255,240,120,.9)';g.lineWidth=1.2;g.beginPath();g.moveTo(hx-8,hy-2);g.lineTo(hx-3,hy+4);g.lineTo(hx-6,hy+6);g.lineTo(hx,hy+12);g.stroke()}}
  g.restore()}
function drawEnemy(e){const s=e._s,t=TYPES[e.k],sc=e.sc||(e.elite?1.25:1);if(!onScreen(s,(MON_H[t.draw]||40)*sc+40))return;drawMon(ctx,e,s.x,s.y)}
// 죽을 때: 쓰러지며 흩어진다 (그리기 전용)
let corpses=[];
function monDie(e){if(corpses.length>40)corpses.shift();corpses.push({e:{k:e.k,x:e.x,y:e.y,fx:e.fx||1,sc:e.sc,elite:e.elite,anim:e.anim,lunge:0,hurt:0,freezeT:0,stunT:0,slowT:0},t0:time})}
function drawCorpses(){corpses=corpses.filter(c=>time-c.t0<.6);for(const c of corpses){const s=W2S(c.e.x,c.e.y);if(!onScreen(s,120))continue;drawMon(ctx,c.e,s.x,s.y,{die:(time-c.t0)/.6,mv:0})}}
// 몬스터 투사체: 꼬리와 빛
function drawEProj(p,s){const ang=Math.atan2((p.vx+p.vy)*KI/2,(p.vx-p.vy)*KI),col=p.col||'#ff7a3a';
  const E=SC.get('mon/proj/'+col,64,20,52,10,g=>{const gr=g.createLinearGradient(0,10,58,10);gr.addColorStop(0,Kit.rgb(Kit.hex(col),0));gr.addColorStop(.7,Kit.rgb(Kit.hex(col),.55));gr.addColorStop(1,Kit.rgb(Kit.hex(col),.95));
    g.fillStyle=gr;g.beginPath();g.moveTo(0,10);g.quadraticCurveTo(30,3,52,4);g.arc(52,10,6,-Math.PI/2,Math.PI/2);g.quadraticCurveTo(30,17,0,10);g.fill();
    g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.moveTo(24,10);g.quadraticCurveTo(40,8,52,7.6);g.arc(52,10,2.4,-Math.PI/2,Math.PI/2);g.quadraticCurveTo(40,12,24,10);g.fill()},{force:1,scale:2});
  const k=p.r/6;ctx.save();ctx.translate(s.x,s.y);ctx.rotate(ang);ctx.scale(k*1.1,k);const po=ctx.globalCompositeOperation;ctx.globalCompositeOperation='lighter';
  SC.draw(ctx,E,0,0);ctx.restore();ctx.globalCompositeOperation='lighter';glow(s.x,s.y,p.r*3.4,col);glow(s.x,s.y,p.r*1.2,'#ffffff');ctx.globalCompositeOperation=po}
// 갤러리: 종류별 × 상태, 이름 있는 몬스터
function monGallery(box){
  const wrap=document.createElement('div');wrap.style.cssText='margin:6px 0 18px';box.insertBefore(wrap,box.querySelector('#galGrid'));
  const KS=['slime','wolf','goblin','ashsoldier','wraith','ogre','ashknight','apostle'],ST=['걷기','공격','맞음','얼음','마비','둔화','불붙음','정예','죽음'];
  const CW=96,CH=96,dp=Math.min(2,window.devicePixelRatio||1);
  const mk=(title,w,h)=>{const t=document.createElement('div');t.textContent=title;t.style.cssText='margin:8px 0 4px;font-weight:600';wrap.appendChild(t);const cv=document.createElement('canvas');cv.width=w*dp;cv.height=h*dp;cv.style.cssText=`width:${w}px;height:${h}px;max-width:100%;background:#2a2620;border:1px solid #3a342a;border-radius:6px`;wrap.appendChild(cv);return cv};
  const c1=mk('몬스터 · 종류 × 상태',CW*8+60,CH*9+20),NB=Object.keys(MON_V),c2=mk('이름 있는 준보스 · 보스 (가만히 / 기술 준비 / 돌진)',190*6,250*2+30);
  const es=ST.map((s,r)=>KS.map((k,j)=>({k,x:0,y:0,fx:1,anim:j,elite:r===7,lunge:0,hurt:0,freezeT:r===3?1:0,stunT:r===4?1:0,slowT:r===5?1:0,burn:r===6?{t:1}:null,sc:undefined})));
  const bs=NB.map((k,i)=>({k,x:0,y:0,fx:1,anim:i,lunge:0,hurt:0,freezeT:0,stunT:0,slowT:0,sc:TYPES[k].sc,boss:1,cast:0,dash:0}));
  const t0=performance.now();
  const step=()=>{if(!wrap.isConnected)return;const t=(performance.now()-t0)/1000;
    let g=c1.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c1.width,c1.height);g.scale(dp,dp);g.font='11px sans-serif';
    for(let j=0;j<8;j++){g.fillStyle='#e8e2d2';g.textAlign='center';g.fillText(TYPES[KS[j]].draw,60+CW*j+CW/2,12)}
    for(let r=0;r<9;r++){g.textAlign='left';g.fillStyle='rgba(232,226,210,.65)';g.fillText(ST[r],4,20+CH*r+CH/2);
      for(let j=0;j<8;j++){const e=es[r][j];e.lunge=r===1?Math.max(0,.15-(t%1)*.3):0;e.hurt=r===2?Math.max(0,.12-(t%1)*.24):0;
        const cx=60+CW*j+CW/2,cy=20+CH*r+CH-14;
        if(r===8)drawMon(g,e,cx,cy,{t,die:(t%1.2)/1.2>1?1:Math.min(1,(t%1.2)/.8),mv:0,noHover:1});else drawMon(g,e,cx,cy,{t,mv:r===0?1:0,noHover:1})}}
    g=c2.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c2.width,c2.height);g.scale(dp,dp);g.font='12px sans-serif';g.textAlign='center';
    bs.forEach((e,i)=>{const col=i%6,row=Math.floor(i/6),cx=95+col*190,cy=row*265+235,ph=Math.floor(t/1.5+i)%3;e.cast=ph===1?.6:0;e.dash=ph===2?.3:0;
      drawMon(g,e,cx,cy,{t,mv:ph===2?1:0,noHover:1,k:.62});g.fillStyle='#ffb08a';g.fillText(TYPES[e.k].n,cx,cy+18)});
    requestAnimationFrame(step)};
  requestAnimationFrame(step)}
