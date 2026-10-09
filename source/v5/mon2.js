/* 새 지역 몬스터 그림: 전갈 · 정령 · 임프 · 골렘 · 나가 · 게 · 예티 · 표범 (mon.js 규칙 그대로: 부위 굽기 + 매 프레임 조립) */
Object.assign(MON_H,{scorpion:32,elemental:54,imp:36,golem:62,serpent:54,crab:30,yeti:60,panther:30});
const M2A=new WeakMap();// 그리기 전용 누적 상태 (정령 파편 궤도 각)
const m2rgb=(c,a)=>Kit.rgb(Kit.hex(c),a);
// 폴리라인을 두께 있는 다각형으로 (굽는 순간에만)
function m2Limb(q,pts,w0,w1){const n=pts.length,L=[],R=[];
  for(let i=0;i<n;i++){const p=pts[i],a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,w=(w0+(w1-w0)*i/(n-1))/2;L.push([p[0]-dy/d*w,p[1]+dx/d*w]);R.push([p[0]+dy/d*w,p[1]-dx/d*w])}
  q.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)q.lineTo(L[i][0],L[i][1]);const e=pts[n-1],ew=w1/2;q.lineTo(e[0]+(e[0]-pts[n-2][0])*.15*ew,e[1]+(e[1]-pts[n-2][1])*.15*ew);for(let i=n-1;i>=0;i--)q.lineTo(R[i][0],R[i][1]);q.closePath()}
function m2Gloss(g,x,y,rx,ry,r,a){g.fillStyle=`rgba(255,250,235,${a==null?.55:a})`;g.beginPath();g.ellipse(x,y,rx,ry,r||0,0,6.283);g.fill()}
// 털 뭉치: 경로 안에 짧은 붓질 (밝은 쪽은 위, 어두운 쪽은 아래)
function m2Fur(g,c,x0,y0,x1,y1,n,len,seed){const s=mulberry(seed||7);g.lineCap='round';
  for(let i=0;i<n;i++){const x=x0+s()*(x1-x0),y=y0+s()*(y1-y0),l=len*(.6+s()*.6),up=(y-y0)/(y1-y0||1);
    g.strokeStyle=s()<.6-up*.3?m2rgb(liteOf(c,.5),.5):m2rgb(darkOf(c,.4),.28);g.lineWidth=.6+s()*.6;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x-l*.3,y+l*.5,x-l*.55+s()*.6,y+l);g.stroke()}}
// 발광 균열: 넓고 흐린 선 + 가는 밝은 선 (구울 때만)
function m2Crack(g,pts,col,w){g.lineCap='round';g.lineJoin='round';for(const [lw,a,c] of [[w*4,.25,col],[w*2.2,.6,col],[w*.9,1,liteOf(col,.6)]]){g.strokeStyle=m2rgb(c,a);g.lineWidth=lw;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.stroke()}}
function m2Add(g,f){const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';f();g.globalCompositeOperation=po}

Object.assign(MON,{
// ---- 사막 전갈: 마디 갑각, 집게 둘, 들어 올린 독침 꼬리, 다리 여섯 ----
scorpion(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,ch={tex:'bone',texA:.3,rim:'rgba(255,244,214,.95)',lineW:.6},dk=darkOf(c,.3);
  const body=monPart('scorp','body',c,v,bs,42,20,24,10,g=>{g.translate(24,10);
    const ab=q=>{q.moveTo(-17,0);q.bezierCurveTo(-17,-6,-6,-7,3,-5);q.lineTo(3,4);q.bezierCurveTo(-6,6,-17,5,-17,0);q.closePath()};
    Kit.solid(g,ab,-17,-7,3,6,c,ch);
    g.save();g.beginPath();ab(g);g.clip();
    for(let i=0;i<5;i++){const x=-15+i*3.8;g.strokeStyle=m2rgb(darkOf(c,.65),.8);g.lineWidth=1;g.beginPath();g.moveTo(x+3.4,-7);g.quadraticCurveTo(x+4.6,0,x+3.4,6);g.stroke();
      m2Gloss(g,x+1.6,-4.2,1.6,.8,-.2,.5);g.fillStyle=m2rgb(darkOf(c,.5),.35);g.fillRect(x,2,3.6,4)}
    g.restore();
    const ce=q=>{q.moveTo(1,-5);q.bezierCurveTo(5,-7.5,12,-6.5,15,-3);q.quadraticCurveTo(16.4,0,14,2);q.lineTo(9,3.4);q.quadraticCurveTo(4,4.6,1,4);q.closePath()};
    Kit.solid(g,ce,1,-7,16,4.6,liteOf(c,.08),ch);
    g.strokeStyle=m2rgb(darkOf(c,.6),.7);g.lineWidth=.7;g.beginPath();g.moveTo(4,-5.6);g.quadraticCurveTo(7,-1,6,3.6);g.stroke();
    m2Gloss(g,8,-4.8,3.4,1,-.12,.6);
    g.fillStyle='#120a06';for(const [x,y] of [[11.6,-4.4],[13.2,-3.6]]){g.beginPath();g.arc(x,y,.9,0,6.283);g.fill()}
    Kit.solid(g,q=>{q.moveTo(14,0);q.lineTo(18,.6);q.lineTo(14.6,2.4);q.closePath()},14,0,18,2.4,darkOf(c,.2),{lineW:.4})});
  const leg=b=>monPart('scorp',b?'legB':'leg',c,v,bs,18,18,3,6,g=>{g.translate(3,6);const lc=b?darkOf(c,.5):darkOf(c,.28),P=[[0,0],[5,-3.4],[10,1],[13,9]];Kit.solid(g,q=>m2Limb(q,P,3,1),0,-5,13,9,lc,{tex:'bone',texA:.25,rim:'rgba(255,240,210,.85)',lineW:.8});
    g.fillStyle=m2rgb(darkOf(c,.7),.9);for(const [x,y] of [[5,-3.4],[10,1]]){g.beginPath();g.arc(x,y,1.1,0,6.283);g.fill()}});
  const seg=monPart('scorp','seg',c,v,bs,12,10,6,5,g=>{g.translate(6,5);const p=q=>q.ellipse(0,0,3.8,3.4,0,0,6.283);Kit.solid(g,p,-3.8,-3.4,3.8,3.4,c,ch);
    g.strokeStyle=m2rgb(darkOf(c,.6),.7);g.lineWidth=.6;g.beginPath();g.arc(0,0,2.4,-2.6,-.6);g.stroke();m2Gloss(g,-1.2,-1.6,1.4,.7,-.5,.65)});
  const sting=monPart('scorp','sting',c,v,bs,20,18,4,9,g=>{g.translate(4,9);g.scale(1.25,1.25);
    Kit.solid(g,q=>q.ellipse(3,0,4.2,3.4,0,0,6.283),-1,-3.4,7,3.4,liteOf(c,.12),ch);m2Gloss(g,2,-1.6,1.6,.8,-.3,.7);
    Kit.solid(g,q=>{q.moveTo(6,-1.6);q.quadraticCurveTo(11,-1.4,12.6,3.4);q.quadraticCurveTo(10,1.4,6.4,1.6);q.closePath()},6,-1.6,12.6,3.4,'#2a1c14',{rim:'rgba(255,230,190,.9)',lineW:.4})});
  const arm=b=>monPart('scorp',b?'armB':'arm',c,v,bs,16,12,2,7,g=>{g.translate(2,7);Kit.solid(g,q=>m2Limb(q,[[0,0],[5,-4],[11,-3]],3.2,2.6),0,-5.6,12,0,b?darkOf(c,.35):c,ch);g.fillStyle=m2rgb(darkOf(c,.7),.9);g.beginPath();g.arc(5,-4,1.2,0,6.283);g.fill()});
  const claw=b=>monPart('scorp',b?'clawB':'claw',c,v,bs,24,16,4,8,g=>{g.translate(4,8);const cc=b?darkOf(c,.32):liteOf(c,.08);
    Kit.solid(g,q=>{q.moveTo(-2,-.5);q.bezierCurveTo(-1,-6,7,-6.6,10,-3.2);q.bezierCurveTo(13,-4.4,17,-3.6,19,-.2);q.quadraticCurveTo(15,-1.6,10.6,.4);q.bezierCurveTo(9,4,0,4.4,-2,1.4);q.closePath()},-2,-6.6,19,4.4,cc,ch);
    m2Gloss(g,3.4,-3.4,3.2,1.2,-.15,.65);g.strokeStyle=m2rgb(darkOf(c,.7),.8);g.lineWidth=.5;g.beginPath();g.moveTo(9.6,-2.8);g.quadraticCurveTo(9,0,10.4,.6);g.stroke();
    g.fillStyle=m2rgb(darkOf(c,.75),.9);for(const x of [12,14,16])g.fillRect(x,-1.6+(x-12)*.18,.6,1)});
  const pin=b=>monPart('scorp',b?'pinB':'pin',c,v,bs,36,20,2,12,g=>{g.translate(2,12);SC.draw(g,arm(b),0,0);SC.draw(g,claw(b),10,-4)});
  const fing=b=>monPart('scorp',b?'fingB':'fing',c,v,bs,14,10,1,4,g=>{g.translate(1,4);Kit.solid(g,q=>{q.moveTo(0,-1.4);q.quadraticCurveTo(7,-2,10.6,2.2);q.quadraticCurveTo(6,2,0,1.6);q.closePath()},0,-2,10.6,2.2,b?darkOf(c,.38):c,{tex:'bone',texA:.25,rim:'rgba(255,240,210,.85)',lineW:.5})});
  const ph=st.ph*15,mv=st.mv,k=st.lunge,u=k>0?1-k:0;
  let bx=0,by=-Math.abs(Math.sin(ph))*.6*mv,a0=-2.25+Math.sin(st.t*1.6)*.06,bend=.5,sl=1;
  if(k>0){if(u<.35){const w=u/.35;a0=-2.25-.3*w;bend=.5+.08*w;by+=1.4*w}else{const w=Math.min(1,(u-.35)/.25),r=u>.75?(u-.75)/.25:0,s=w*(1-r);a0=-2.55+1.4*s;bend=.58-.16*s;sl=1+.75*s;bx+=4*s}}
  g.save();g.translate(bx,by);
  const sw=i=>Math.sin(ph+i*2.1)*.32*mv,lf=i=>Math.max(0,Math.sin(ph+i*2.1))*-1.2*mv;
  // 먼 쪽 다리 · 집게
  for(let i=0;i<3;i++){const x=6-i*6;mPart(g,leg(1),x,-10+lf(i+1),[-.35,-.05,-.1][i]+sw(i+1),i===2?-1:1,.95)}
  const cl=k>0?Math.sin(Math.min(1,u*2)*Math.PI)*.5:0,snip=Math.max(0,Math.sin(st.t*3.1))*.35,rc=k>0?3*Math.sin(Math.PI*u):0;
  mPart(g,pin(1),9+rc*.8,-10,-.08);mPart(g,fing(1),28.6+rc*.8,-15.2,.3+snip-cl*.4);
  // 꼬리 (뒤에서 몸 위로 휘어 오른다)
  const chain=(g,ox,oy,a0,bend,sl)=>{let x=ox,y=oy,a=a0;const pts=[];for(let i=0;i<5;i++){const L=4.6*sl*(1-i*.04);x+=Math.cos(a)*L;y+=Math.sin(a)*L;pts.push([x,y,a]);a+=bend}return{pts,a}};
  const tailDraw=(g,ox,oy,a0,bend,sl,stingNow)=>{const r=chain(g,ox,oy,a0,bend,sl);const gz=1+(sl-1)*.35;for(let i=4;i>=0;i--){const p=r.pts[i],s=(1-i*.07)*gz;mPart(g,seg,p[0],p[1],p[2],s,s)}mPart(g,seg,ox,oy,a0,1.08,1.08);
    const tp=r.pts[4];r.stg=()=>mPart(g,sting,tp[0]+Math.cos(r.a)*2,tp[1]+Math.sin(r.a)*2,r.a+.25);if(stingNow)r.stg();return r};
  // 가만히 · 걷기: 한 장으로 구운 꼬리를 살짝 흔든다. 공격 중에만 마디별로 조립
  const late=k>0&&u>.35;let TR=null;
  if(k>0)TR=tailDraw(g,-14,-10,a0,bend,sl,!late);
  else mPart(g,monPart('scorp','tail',c,v,bs,30,32,12,26,q=>{q.translate(12,26);tailDraw(q,0,0,-2.25,.5,1,1)}),-14,-10,a0+2.25);
  SC.draw(g,body,0,-10);
  // 가까운 쪽 다리 · 집게
  for(let i=0;i<3;i++){const x=4-i*6;mPart(g,leg(0),x,-7+lf(i),[-.25,.05,0][i]+sw(i)*-1,i===2?-1:1,1)}
  mPart(g,pin(0),10+rc,-7,0);mPart(g,fing(0),29.6+rc,-10.6,.35+snip*.8-cl*.5);
  if(late){for(let i=3;i<5;i++){const p=TR.pts[i],s2=(1-i*.07)*(1+(sl-1)*.35);mPart(g,seg,p[0],p[1],p[2],s2,s2)}TR.stg()}
  const ec=t.eye||'#ffcf5a';mGlow(g,12.4,-14.5,2.4,ec,.85);
  if(late&&u<.8){const tp=TR.pts[4],a=TR.a;m2Add(g,()=>mGlow(g,tp[0]+Math.cos(a)*9,tp[1]+Math.sin(a)*9,5,t.pcol||'#b8ff5a',.8))}
  g.restore();st.head={x:4+bx,y:-34+by}},

// ---- 원소 정령: 빛나는 핵 + 바위 몸 + 궤도를 도는 수정 조각 (색은 col: 얼음 · 불 · 폭풍) ----
elemental(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,rock=Kit.mix(darkOf(c,.45),'#3a3640',.45),hi=liteOf(c,.55),gl=t.eye||liteOf(c,.35);
  const cry={tex:'metal',texA:.18,rim:'rgba(255,255,255,1)',rimW:1.2,lineW:.6},stn={tex:'stone',texA:.55,rim:m2rgb(hi,.8),lineW:.7};
  const facet=(g,pts,col)=>{const p=q=>{q.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)q.lineTo(pts[i][0],pts[i][1]);q.closePath()};let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [x,y] of pts){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
    Kit.solid(g,p,x0,y0,x1,y1,col,cry);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=.5;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);g.lineTo((pts[1][0]+pts[pts.length-1][0])/2*.5+pts[0][0]*.5,(pts[1][1]+pts[pts.length-1][1])/2*.5+pts[0][1]*.5);g.stroke()};
  const body=monPart('elem','body',c,v,bs,40,40,20,24,g=>{g.translate(20,24);
    const p=q=>{q.moveTo(-11,-14);q.lineTo(-4,-19);q.lineTo(7,-18);q.lineTo(13,-11);q.lineTo(10,-1);q.lineTo(4,8);q.lineTo(-3,10);q.lineTo(-9,3);q.lineTo(-13,-6);q.closePath()};
    Kit.solid(g,p,-13,-19,13,10,rock,stn);
    g.strokeStyle=m2rgb(darkOf(rock,.6),.7);g.lineWidth=.7;g.beginPath();g.moveTo(-9,-8);g.lineTo(-3,-4);g.moveTo(8,-12);g.lineTo(4,-6);g.moveTo(-2,6);g.lineTo(2,2);g.stroke();
    for(const [x,y,r] of [[-8,-11,.4],[8,-14,-.2],[-6,2,.6],[6,-3,-.5]])m2Crack(g,[[x,y],[x*.45,y*.5],[x*.15,y*.2]],gl,.6);
    // 어깨에 솟은 결정
    facet(g,[[-12,-16],[-17,-25],[-14,-26],[-8,-17]],c);facet(g,[[-8,-18],[-9,-30],[-6,-31],[-3,-19]],liteOf(c,.15));
    facet(g,[[7,-18],[10,-29],[13,-28],[12,-16]],c);facet(g,[[11,-13],[18,-21],[19,-18],[13,-9]],darkOf(c,.12));
    // 핵을 감싼 구멍
    g.fillStyle=m2rgb(darkOf(c,.7),.85);g.beginPath();g.ellipse(0,-6,6.4,7,0,0,6.283);g.fill()});
  const core=monPart('elem','core',c,v,bs,16,20,8,10,g=>{g.translate(8,10);const p=q=>{q.moveTo(0,-8);q.lineTo(5.4,-2);q.lineTo(4,5);q.lineTo(0,8.6);q.lineTo(-4,5);q.lineTo(-5.4,-2);q.closePath()};
    Kit.solid(g,p,-5.4,-8,5.4,8.6,hi,{rim:'rgba(255,255,255,1)',rimW:1.6,lineW:.5});
    g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=.5;g.beginPath();g.moveTo(0,-8);g.lineTo(0,8.6);g.moveTo(-5.4,-2);g.lineTo(0,1);g.lineTo(5.4,-2);g.moveTo(-4,5);g.lineTo(0,1);g.lineTo(4,5);g.stroke();
    m2Gloss(g,-2,-3,1.6,2.6,.3,.85)});
  const head=monPart('elem','head',c,v,bs,24,24,12,16,g=>{g.translate(12,16);
    facet(g,[[-4,-5],[-7,-14],[-4,-15],[-1,-6]],c);facet(g,[[0,-6],[1,-15],[4,-15],[4,-5]],liteOf(c,.2));facet(g,[[4,-4],[9,-11],[10,-8],[6,-2]],c);
    const p=q=>{q.moveTo(-6,-5);q.lineTo(2,-8);q.lineTo(8,-4);q.lineTo(7,3);q.lineTo(0,5);q.lineTo(-6,2);q.closePath()};Kit.solid(g,p,-6,-8,8,5,rock,stn);
    g.fillStyle=m2rgb(darkOf(c,.75),.95);g.beginPath();g.moveTo(1,-2);g.lineTo(8,-2.6);g.lineTo(7,.6);g.lineTo(1.4,.6);g.closePath();g.fill()});
  const fist=b=>monPart('elem',b?'fistB':'fist',c,v,bs,22,22,11,11,g=>{g.translate(11,11);const r2=b?darkOf(rock,.25):rock,cc=b?darkOf(c,.25):c;
    facet(g,[[-3,-3],[-6,-10],[-3,-10],[0,-4]],cc);
    Kit.solid(g,q=>{q.moveTo(-6,-4);q.lineTo(1,-6);q.lineTo(6,-2);q.lineTo(5,4);q.lineTo(-1,6);q.lineTo(-6,3);q.closePath()},-6,-6,6,6,r2,stn);
    facet(g,[[2,-3],[9,-6],[8,-1],[4,1]],cc);facet(g,[[1,2],[8,4],[5,7],[0,5]],liteOf(cc,.1));m2Crack(g,[[-4,0],[0,-1],[3,1]],gl,.5)});
  const sh=i=>monPart('elem','sh'+i,c,v,bs,12,14,6,7,g=>{g.translate(6,7);const S=[[[0,-6.4],[2.6,-1],[1.6,5.6],[-1.8,4],[-2.4,-1]],[[0,-5],[3.4,0],[0,5],[-3,1]],[[-1,-5.6],[2.4,-3],[2.2,3.4],[-.6,5.6],[-2.6,1]]][i];facet(g,S,i===1?liteOf(c,.15):c)});
  // 궤도 각: 공격 중이면 빨리 돈다
  let A=M2A.get(e);if(!A){A={a:(e.anim||0)*1.7,l:st.t};M2A.set(e,A)}const dt=Math.max(0,Math.min(.1,st.t-A.l));A.l=st.t;const k=st.lunge,u=k>0?1-k:0;A.a+=dt*(1.5+k*9+st.mv*.6);
  const fl=-28+Math.sin(st.t*2.1+(e.anim||0))*2.6,lean=st.mv*.12+(k>0?Math.sin(Math.PI*u)*.25:0),rr=17+k*5,ang=A.a;
  const orb=[];for(let i=0;i<6;i++){const q=ang+i*1.047,s=Math.sin(q);orb.push({x:Math.cos(q)*rr,y:fl+s*5+Math.sin(q*2+st.t)*2-2,s,i,r:q*1.3+i})}
  const drawOrb=front=>{for(const o of orb)if((o.s>0)===front){const z=.62+.18*o.s+(o.i%3)*.08;mPart(g,sh(o.i%3),o.x,o.y,o.r,z,z)}};
  // 아래로 흩어지는 꼬리 조각
  m2Add(g,()=>{mGlow(g,0,fl+2,19+k*6,m2rgb(c,.5),.55)});
  for(let i=0;i<2;i++){const y=fl+13+i*6,x=-2-i*1.5+Math.sin(st.t*3+i)*1.2,z=.66-i*.2;mPart(g,sh(i),x,y,st.t*1.5+i,z,z)}
  drawOrb(false);
  const pf=k>0?Math.sin(Math.PI*Math.min(1,u*1.4)):0;
  mPart(g,fist(1),-13+Math.sin(st.t*1.8)*1,fl-2+Math.cos(st.t*1.8)*1.5,.1);
  g.save();g.translate(0,fl+4);g.rotate(lean);SC.draw(g,body,0,0);
  const cp=1+Math.sin(st.t*5)*.06+k*.2;mPart(g,core,0,-6,0,cp,cp);
  m2Add(g,()=>{mGlow(g,0,-6,10+Math.sin(st.t*5)*1.5+k*6,gl,.95)});
  SC.draw(g,head,1,-19);g.restore();
  const hx=1+Math.sin(lean)*23,hy=fl-15;m2Add(g,()=>mGlow(g,hx+3.6,hy,3.4,gl,1));
  mPart(g,fist(0),14+pf*12+Math.sin(st.t*1.8+1)*1,fl+1-pf*3+Math.cos(st.t*1.8+1)*1.5,-.1-pf*.3);
  if(pf>.3)m2Add(g,()=>mGlow(g,14+pf*14,fl-1-pf*3,8*pf,gl,.8));
  drawOrb(true);
  st.head={x:hx,y:fl-34}},

// ---- 임프: 작은 날개 악마, 뿔 · 박쥐 날개 · 꼬리, 깡충 뛴다 · 은은히 빛난다 ----
imp(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,gl=t.eye||t.pcol||'#ffb040',sk={tex:'leather',texA:.35,rim:rimC,lineW:.6};
  const wing=b=>monPartX('imp',b?'wingB':'wing',c,v,bs,30,30,24,22,g=>{g.translate(24,22);const wc=b?darkOf(c,.5):darkOf(c,.25);
    const p=q=>{q.moveTo(0,0);q.lineTo(-6,-14);q.lineTo(-19,-18);q.quadraticCurveTo(-17,-12,-21,-8);q.quadraticCurveTo(-15,-7,-17,-1);q.quadraticCurveTo(-11,-3,-10,4);q.quadraticCurveTo(-5,0,0,2);q.closePath()};
    g.globalAlpha=.94;Kit.solid(g,p,-21,-18,0,4,wc,{tex:'leather',texA:.3,rim:'rgba(255,220,190,.7)',lineW:.6});g.globalAlpha=1;
    g.strokeStyle=darkOf(c,.65);g.lineWidth=1.1;g.lineCap='round';g.beginPath();g.moveTo(0,0);g.lineTo(-6,-14);g.lineTo(-19,-18);g.moveTo(-6,-14);g.lineTo(-21,-8);g.moveTo(-6,-14);g.lineTo(-17,-1);g.moveTo(-6,-14);g.lineTo(-10,4);g.stroke();
    g.strokeStyle=m2rgb(liteOf(c,.4),.6);g.lineWidth=.5;g.beginPath();g.moveTo(-.6,-.6);g.lineTo(-6.4,-14.6);g.lineTo(-19,-18.6);g.stroke();
    Kit.solid(g,q=>{q.moveTo(-6,-14);q.lineTo(-7.6,-17);q.lineTo(-4.8,-14.6);q.closePath()},-8,-17,-4.8,-14,'#e8dcc0',{lineW:.3});
    mForm(g,p,-21,-18,0,4,.8,.6,.2);g.save();g.beginPath();p(g);g.clip();g.strokeStyle=m2rgb(darkOf(c,.6),.35);g.lineWidth=.35;for(const [x1,y1] of [[-14,-14],[-13,-6],[-8,-2]]){g.beginPath();g.moveTo(-6,-14);g.quadraticCurveTo((x1-6)/2,(y1-14)/2+1,x1,y1);g.stroke()}g.fillStyle=m2rgb(liteOf(c,.5),.18);g.beginPath();g.ellipse(-12,-10,5,3,-.4,0,6.283);g.fill();g.restore()},.5);
  const body=monPartX('imp','body',c,v,bs,22,22,11,18,g=>{g.translate(11,18);
    const p=q=>{q.moveTo(-4,-14);q.bezierCurveTo(2,-15,6,-11,7,-6);q.bezierCurveTo(8,-1,5,2,0,2);q.bezierCurveTo(-5,2,-7,-3,-6,-8);q.quadraticCurveTo(-6,-12,-4,-14);q.closePath()};
    Kit.solid(g,p,-7,-15,8,2,c,sk);
    g.fillStyle=m2rgb(liteOf(c,.3),.45);g.beginPath();g.ellipse(2.6,-4,3.4,4,.2,0,6.283);g.fill();
    g.strokeStyle=m2rgb(darkOf(c,.55),.6);g.lineWidth=.6;for(const y of [-6,-3.6,-1.2]){g.beginPath();g.moveTo(.6,y);g.quadraticCurveTo(3,y+.8,5.4,y);g.stroke()}
    mForm(g,p,-7,-15,8,2,1,.45,.2);mSpeck(g,p,-7,-15,8,2,c,16,5,.6);mFold(g,[[-3,-12.6],[0,-10.6,3,-12]],c,.6);
    const lc=q=>{q.moveTo(-6,-1);q.lineTo(6,-1);q.lineTo(4,3);q.lineTo(1,1.4);q.lineTo(-2,3.4);q.lineTo(-5,1.4);q.closePath()};Kit.solid(g,lc,-6,-1,6,3.4,'#3a1e14',{tex:'leather',texA:.6,lineW:.35});
    g.strokeStyle='#1a0c08';g.lineWidth=.8;g.beginPath();g.moveTo(-6.2,-1.2);g.lineTo(6.2,-1.2);g.stroke();g.fillStyle='#c8a050';g.beginPath();g.arc(1.6,-1.2,.7,0,6.283);g.fill()},.5);
  const head=monPartX('imp','head',c,v,bs,28,28,12,18,g=>{g.translate(12,18);
    hornPaint(g,-3,-9,9,'#2a1a14',-1);
    Kit.solid(g,q=>{q.moveTo(-5,-6);q.lineTo(-11,-10);q.lineTo(-4,-3);q.closePath()},-11,-10,-4,-3,darkOf(c,.2),{lineW:.5});
    const p=q=>{q.moveTo(-6,-4);q.bezierCurveTo(-6,-11,4,-12,7,-7);q.lineTo(10,-3);q.quadraticCurveTo(9,1,6,2);q.quadraticCurveTo(0,4,-4,1);q.quadraticCurveTo(-6,-1,-6,-4);q.closePath()};
    Kit.solid(g,p,-6,-11,10,3,c,sk);
    hornPaint(g,1,-9,10,'#3a2418',1);
    mForm(g,p,-6,-11,10,3,1,.35,.2);mSpeck(g,p,-6,-11,10,3,c,14,8,.5);
    g.fillStyle=m2rgb(darkOf(c,.6),.8);g.beginPath();g.ellipse(6,-4.4,2.2,1.4,-.1,0,6.283);g.fill();mEye(g,6.3,-4.4,1.4,.9,gl,-.15,'#2a0a04');
    g.fillStyle=darkOf(c,.55);g.beginPath();g.moveTo(1,-7.4);g.lineTo(9,-6);g.lineTo(8.6,-5);g.lineTo(1.4,-6);g.fill();
    g.fillStyle='#1a0806';g.beginPath();g.ellipse(9.4,-2.6,.5,.35,0,0,6.283);g.fill();
    g.fillStyle='#1a0806';g.beginPath();g.moveTo(1,-.6);g.quadraticCurveTo(5,1.6,9,-1.6);g.quadraticCurveTo(6,2.8,1.4,.8);g.fill();
    g.fillStyle='#f4ecd0';for(const x of [3.4,5.6,7.4]){g.beginPath();g.moveTo(x,.2+(x-3)*-.2);g.lineTo(x+.7,1.8);g.lineTo(x+1.2,0);g.fill()}},.5);
  const arm=b=>monPartX('imp',b?'armB':'arm',c,v,bs,12,16,4,3,g=>{g.translate(4,3);const ac=b?darkOf(c,.3):c;Kit.solid(g,q=>m2Limb(q,[[0,0],[1,5],[3,9]],2.6,1.8),-1,0,4,10,ac,sk);mForm(g,q=>m2Limb(q,[[0,0],[1,5],[3,9]],2.6,1.8),-1,0,4,10,.8);
    g.strokeStyle='#1a0e0a';g.lineWidth=.6;g.lineCap='round';for(const d of [-.4,.3,1]){g.beginPath();g.moveTo(3,9.6);g.lineTo(3+Math.cos(d)*2.6+1,9.6+Math.sin(d)*2.6+1);g.stroke()}},.45);
  const leg=b=>monPartX('imp',b?'legB':'leg',c,v,bs,10,14,4,2,g=>{g.translate(4,2);Kit.solid(g,q=>m2Limb(q,[[0,0],[2.4,4],[-.4,7],[.6,9.6]],3,1.6),-2,0,4,10,b?darkOf(c,.3):c,sk);
    mForm(g,q=>m2Limb(q,[[0,0],[2.4,4],[-.4,7],[.6,9.6]],3,1.6),-2,0,4,10,.8);Kit.solid(g,q=>{q.moveTo(-1,9);q.lineTo(2.6,9);q.lineTo(3,10.6);q.lineTo(-1.4,10.6);q.closePath()},-1.4,9,3,10.6,'#1e1410',{lineW:.4})},.45);
  const tail=monPartX('imp','tail',c,v,bs,22,18,19,8,g=>{g.translate(19,8);g.strokeStyle=darkOf(c,.55);g.lineWidth=2.2;g.lineCap='round';const tp=q=>{q.moveTo(0,0);q.bezierCurveTo(-6,3,-10,6,-13,0);q.quadraticCurveTo(-15,-4,-14,-5)};
    g.beginPath();tp(g);g.stroke();g.strokeStyle=c;g.lineWidth=1.3;g.beginPath();tp(g);g.stroke();
    Kit.solid(g,q=>{q.moveTo(-14,-4);q.lineTo(-17.6,-6);q.lineTo(-13.6,-9.6);q.lineTo(-11.6,-6);q.closePath()},-17.6,-9.6,-11.6,-4,darkOf(c,.2),{lineW:.5})},.45);
  const ph=st.ph*9,mv=st.mv,k=st.lunge,u=k>0?1-k:0,hop=Math.abs(Math.sin(ph))*mv,fl=Math.sin(st.t*14+(e.anim||0));
  let by=-hop*6-(1-mv)*(2+Math.sin(st.t*3)*1.2),bx=0,lean=mv*.12;
  if(k>0){if(u<.35){by+=2;lean=-.15}else{const w=(u-.35)/.65;bx=8*Math.sin(Math.PI*w);by-=4*Math.sin(Math.PI*w);lean=.35*Math.sin(Math.PI*w)}}
  const fsp=(st.mv>.5||k>0)?1:.55;
  g.save();g.translate(bx,by);
  m2Add(g,()=>mGlow(g,0,-14,15,m2rgb(gl,.5),.45));
  mPart(g,wing(1),-2,-18,-.25+fl*.35*fsp,1,1-.25*fl*fsp);
  mPart(g,tail,-4,-6,Math.sin(st.t*4)*.2);
  const ls=Math.sin(ph)*.5*mv;mPart(g,leg(1),1,-8,-ls-(hop>.5?.3:0));mPart(g,arm(1),-1,-15,-.5-k*.6);
  g.save();g.translate(0,-6);g.rotate(lean);SC.draw(g,body,0,0);
  mPart(g,head,1,-13,Math.sin(st.t*2)*.05-(k>0&&u<.35?.15:0));g.restore();
  mPart(g,leg(0),-1,-7,ls-(hop>.5?.3:0));
  mPart(g,wing(0),-4,-17,-.1+fl*.4*fsp,1,1-.3*fl*fsp);
  const ar=k>0?(u<.35?.8:-1.6*Math.sin(Math.PI*(u-.35)/.65)):-.5+Math.sin(st.t*2.4)*.1;
  mPart(g,arm(0),3,-15,ar);
  const hx=3-Math.sin(ar)*10,hy=-15+Math.cos(ar)*10;
  m2Add(g,()=>{mGlow(g,hx,hy-1,4.2+Math.sin(st.t*11)*.8+k*5,gl,.95);mGlow(g,hx,hy-1,1.6,'#ffffff',.9)});
  const ehx=1+Math.sin(lean)*19,ehy=-25;m2Add(g,()=>{mGlow(g,ehx+5.6,ehy+.6,2.2,gl,1)});
  g.restore();st.head={x:bx+2,y:by-36}},

// ---- 골렘: 묵직한 바위 몸, 균열이 빛난다 (col 계열), 느린 발구름, 공격하면 큰 주먹 ----
golem(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,rk=Kit.mix(c,'#4e4a44',.58),gl=t.eye||Kit.mix(liteOf(c,.4),'#ffd890',.3),so={tex:'stone',texA:.75,rim:'rgba(255,240,214,.85)',lineW:.8};
  const blk=(g,pts,col)=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [x,y] of pts){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}const P=q=>{q.moveTo(pts[0][0],pts[0][1]);for(const p of pts)q.lineTo(p[0],p[1]);q.closePath()};Kit.solid(g,P,x0,y0,x1,y1,col,so);mForm(g,P,x0,y0,x1,y1,.8);mSpeck(g,P,x0,y0,x1,y1,col,Math.round((x1-x0)*(y1-y0)/9),pts.length*7+(x0|0),.9,1.2);
    g.strokeStyle=m2rgb(liteOf(col,.5),.55);g.lineWidth=.5;g.beginPath();g.moveTo(pts[0][0]+.4,pts[0][1]+.5);g.lineTo(pts[1][0],pts[1][1]+.5);g.stroke()};
  const leg=b=>monPartX('golem',b?'legB':'leg',c,v,bs,20,24,10,3,g=>{g.translate(10,3);const lc=b?darkOf(rk,.3):rk;
    blk(g,[[-6,-1],[5,-2],[6,9],[4,11],[-5,11],[-7,8]],lc);blk(g,[[-7,11],[7,10.4],[8.6,19],[-8,19.6]],darkOf(lc,.1));m2Crack(g,[[-3,2],[0,6],[-1,9]],gl,.5)},.7);
  const body=monPartX('golem','body',c,v,bs,60,52,30,46,g=>{g.translate(30,46);
    blk(g,[[-9,-8],[9,-9],[11,0],[-10,0]],darkOf(rk,.15));
    blk(g,[[-19,-38],[-6,-44],[12,-43],[22,-34],[20,-20],[13,-8],[-12,-7],[-20,-20]],rk);
    blk(g,[[-15,-30],[-3,-34],[8,-31],[6,-20],[-10,-18]],liteOf(rk,.06));
    blk(g,[[-6,-16],[10,-18],[12,-9],[-8,-8]],darkOf(rk,.05));
    g.strokeStyle=m2rgb(darkOf(rk,.7),.6);g.lineWidth=.8;g.beginPath();g.moveTo(-19,-24);g.lineTo(-12,-28);g.moveTo(16,-40);g.lineTo(18,-30);g.moveTo(-4,-42);g.lineTo(-2,-36);g.stroke();
    m2Crack(g,[[-1,-34],[1,-28],[-2,-24],[2,-19],[1,-14]],gl,1);m2Crack(g,[[2,-19],[8,-17],[12,-12]],gl,.7);m2Crack(g,[[1,-28],[-6,-26],[-12,-27]],gl,.6);m2Crack(g,[[14,-38],[16,-32],[19,-29]],gl,.5);
    g.fillStyle='#4e6a2c';for(const [x,y,r] of [[-16,-36,2.4],[-10,-41,2],[-5,-43,1.6],[10,-43,1.8]]){g.beginPath();g.ellipse(x,y,r*1.6,r*.8,-.2,0,6.283);g.fill()}g.fillStyle='rgba(150,190,90,.6)';for(const [x,y] of [[-17,-37],[-10,-42],[10,-44]]){g.beginPath();g.ellipse(x,y,1.6,.6,-.2,0,6.283);g.fill()}
    // 이끼 술 · 새겨진 문양
    g.strokeStyle='#3e5a22';g.lineWidth=.7;g.lineCap='round';for(const [x,y,l] of [[-17,-35,4],[-14,-38,3],[-9,-40,5],[11,-42,3.4],[-19,-22,3]]){g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+.8,y+l*.5,x-.2,y+l);g.stroke()}
    m2Crack(g,[[-14,-14],[-11,-16],[-9,-13],[-12,-11],[-14,-14]],gl,.35)},.75);
  const head=monPartX('golem','head',c,v,bs,24,22,12,16,g=>{g.translate(12,16);blk(g,[[-7,-10],[4,-12],[9,-6],[8,3],[-6,4],[-8,-3]],liteOf(rk,.05));
    g.fillStyle='#120c0a';g.beginPath();g.moveTo(0,-5);g.lineTo(9,-5.6);g.lineTo(8.6,-2.6);g.lineTo(0,-2.4);g.closePath();g.fill();
    blk(g,[[-6,-11],[6,-13],[9,-8],[0,-7],[-7,-8]],darkOf(rk,.1));m2Crack(g,[[1,-5.4],[8.6,-5.8]],gl,.35)},.6);
  const arm=b=>monPartX('golem',b?'armB':'arm',c,v,bs,28,48,14,8,g=>{g.translate(14,8);const ac=b?darkOf(rk,.3):rk;
    blk(g,[[-9,-6],[3,-8],[10,-2],[8,6],[-6,8],[-11,2]],ac);
    blk(g,[[-6,6],[6,5],[7,20],[-5,21]],darkOf(ac,.08));
    blk(g,[[-9,20],[7,18],[10,28],[7,36],[-6,37],[-10,29]],liteOf(ac,.04));
    g.strokeStyle=m2rgb(darkOf(ac,.7),.65);g.lineWidth=.7;for(const x of [-4,0,4]){g.beginPath();g.moveTo(x,28);g.lineTo(x+.6,36);g.stroke()}
    m2Crack(g,[[-2,-4],[1,0],[0,4]],gl,.55);m2Crack(g,[[-2,23],[2,27],[1,31]],gl,.55)},.7);
  const ph=st.ph*5,mv=st.mv,k=st.lunge,u=k>0?1-k:0,sw=Math.sin(ph)*.32*mv,stomp=Math.pow(Math.abs(Math.sin(ph)),.5);
  const bob=-stomp*2.6*mv+Math.sin(st.t*1.6)*.5,lean=k>0?(u<.4?-.1*u/.4:-.1+.3*Math.sin(Math.PI*Math.min(1,(u-.4)/.5))):mv*.05;
  mPart(g,arm(1),-15,-50+bob,.25-sw*.6);
  mPart(g,leg(1),-7,-20+bob*.3,-sw);mPart(g,leg(0),8,-20+bob*.3,sw);
  g.save();g.translate(0,-18+bob);g.rotate(lean);SC.draw(g,body,0,0);
  const pu=1+Math.sin(st.t*3)*.15;m2Add(g,()=>{mGlow(g,0,-24,9*pu+k*5,m2rgb(gl,.8),.65);mGlow(g,0,-24,3,'#fff8e0',.6)});
  SC.draw(g,head,2,-40);m2Add(g,()=>mGlow(g,8,-43,3+Math.sin(st.t*4)*.5,gl,1));g.restore();
  const rot=k>0?(u<.4?.7*u/.4:.7-2.3*Math.sin(Math.PI*.5*Math.min(1,(u-.4)/.3))*(u>.85?1-(u-.85)/.15*.6:1)):-.15+sw*.5;
  const sx=15+Math.sin(lean)*30,sy=-50+bob;mPart(g,arm(0),sx,sy,rot);
  if(k>0&&u>.55&&u<.9){const fx=sx-Math.sin(rot)*30,fy=sy+Math.cos(rot)*30;m2Add(g,()=>mGlow(g,fx,fy,12,m2rgb(gl,.7),.7))}
  st.head={x:4,y:-72+bob}},

// ---- 나가 / 바다뱀: 똬리 튼 비늘 몸이 물결치고, 코브라 목깃 + 팔 달린 윗몸, 공격하면 솟구친다 ----
serpent(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,bel=Kit.mix(liteOf(c,.45),'#e8d8a0',.4),sc2={tex:'leather',texA:.45,rim:rimC,lineW:.6};
  const scales=(g,x0,y0,x1,y1,col,r)=>{for(let y=y0,j=0;y<y1;y+=r*.9,j++)for(let x=x0+(j%2)*r;x<x1;x+=r*2){g.fillStyle=m2rgb(liteOf(col,.35),.22);g.beginPath();g.ellipse(x,y+r*.35,r*.7,r*.45,0,0,6.283);g.fill();g.strokeStyle=m2rgb(darkOf(col,.55),.5);g.lineWidth=.5;g.beginPath();g.arc(x,y,r,.2,Math.PI-.2);g.stroke()}};
  const seg=monPartX('serp','seg',c,v,bs,16,14,8,7,g=>{g.translate(8,7);const p=q=>q.ellipse(0,0,6.4,5.6,0,0,6.283);Kit.solid(g,p,-6.4,-5.6,6.4,5.6,c,sc2);
    g.save();g.beginPath();p(g);g.clip();scales(g,-7,-6,7,3,c,1.5);g.fillStyle=bel;g.beginPath();g.ellipse(0,5.4,6,2.6,0,0,6.283);g.fill();g.strokeStyle=m2rgb(darkOf(bel,.4),.6);g.lineWidth=.5;for(const x of [-3,0,3]){g.beginPath();g.moveTo(x,3);g.lineTo(x,6);g.stroke()}g.restore();
    mForm(g,p,-6.4,-5.6,6.4,5.6,.9);g.strokeStyle=m2rgb(darkOf(c,.7),.55);g.lineWidth=.8;g.beginPath();g.ellipse(0,0,6,5.2,0,.2,Math.PI-.2);g.stroke();m2Gloss(g,-2.4,-3,2.2,1,-.3,.4)},0);
  const torso=monPartX('serp','torso',c,v,bs,24,34,12,30,g=>{g.translate(12,30);
    const p=q=>{q.moveTo(-6,0);q.bezierCurveTo(-7,-10,-6,-18,-4,-24);q.lineTo(5,-24);q.bezierCurveTo(7,-16,8,-8,7,0);q.closePath()};
    Kit.solid(g,p,-7,-24,8,0,c,sc2);g.save();g.beginPath();p(g);g.clip();scales(g,-8,-24,4,0,c,1.6);
    g.fillStyle=bel;g.beginPath();g.moveTo(2,-24);g.lineTo(6,-24);g.bezierCurveTo(8,-14,8,-8,7,0);g.lineTo(1,0);g.bezierCurveTo(2,-8,1,-16,2,-24);g.fill();
    g.strokeStyle=m2rgb(darkOf(bel,.45),.7);g.lineWidth=.6;for(let y=-22;y<0;y+=2.6){g.beginPath();g.moveTo(1.6,y);g.quadraticCurveTo(4.5,y+.8,7.6,y);g.stroke()}g.restore();mForm(g,p,-7,-24,8,0,.9)},.5);
  const hood=monPartX('serp','hood',c,v,bs,34,36,17,26,g=>{g.translate(17,26);
    const p=q=>{q.moveTo(-2,8);q.bezierCurveTo(-13,2,-15,-12,-8,-20);q.quadraticCurveTo(-2,-25,4,-22);q.bezierCurveTo(12,-16,12,0,5,8);q.closePath()};
    Kit.solid(g,p,-15,-25,12,8,darkOf(c,.18),sc2);g.save();g.beginPath();p(g);g.clip();scales(g,-15,-24,12,8,darkOf(c,.18),1.7);
    g.fillStyle=m2rgb(darkOf(c,.6),.55);g.beginPath();g.ellipse(-1,-6,6,11,0,0,6.283);g.fill();
    g.strokeStyle=m2rgb(bel,.85);g.lineWidth=1.2;g.lineCap='round';for(let i=0;i<4;i++){const y=-14+i*5;g.beginPath();g.moveTo(-7+i*.6,y-2);g.lineTo(-1,y+1.4);g.lineTo(5-i*.6,y-2);g.stroke()}
    g.fillStyle=m2rgb(bel,.8);for(const s2 of [-1,1]){g.beginPath();g.ellipse(-1+s2*7,-10,1.8,2.6,0,0,6.283);g.fill()}g.fillStyle='#1a0e08';for(const s2 of [-1,1]){g.beginPath();g.ellipse(-1+s2*7,-10,.8,1.4,0,0,6.283);g.fill()}
    g.restore();mForm(g,p,-15,-25,12,8,.9);if(v){crownPaint(g,-1,-21,10,'#d8b050',4)}},.6);
  const head=monPartX('serp','head',c,v,bs,24,16,6,9,g=>{g.translate(6,9);
    const p=q=>{q.moveTo(-5,-1);q.bezierCurveTo(-5,-6,3,-6,8,-4);q.quadraticCurveTo(13,-3,13,0);q.quadraticCurveTo(11,2.6,6,3);q.quadraticCurveTo(-2,4,-5,-1);q.closePath()};
    Kit.solid(g,p,-5,-6,13,4,c,sc2);g.fillStyle=bel;g.beginPath();g.moveTo(-3,2);g.quadraticCurveTo(5,4,12,1);g.quadraticCurveTo(6,2.4,-3,1);g.fill();
    g.fillStyle=darkOf(c,.6);g.beginPath();g.moveTo(2,-4.4);g.lineTo(9,-3.4);g.lineTo(9,-2.6);g.lineTo(2,-3);g.fill();
    g.strokeStyle='#1a1008';g.lineWidth=.6;g.beginPath();g.moveTo(4,1.4);g.lineTo(12.6,.4);g.stroke();g.fillStyle='#f4ecd0';g.beginPath();g.moveTo(9,1);g.lineTo(9.6,3.4);g.lineTo(10.2,.8);g.fill();
    mForm(g,p,-5,-6,13,4,.8,.4,.2);g.save();g.beginPath();p(g);g.clip();scales(g,-5,-6,8,-1,c,1.2);g.restore();
    g.fillStyle=m2rgb(darkOf(c,.6),.8);g.beginPath();g.ellipse(8.4,-3.4,1.9,1.2,-.1,0,6.283);g.fill();mEye(g,8.5,-3.4,1.3,.85,t.eye||'#ffe25a',-.1,'#1a1008');
    g.fillStyle='#1a0806';g.beginPath();g.ellipse(12,-1.2,.45,.3,0,0,6.283);g.fill();g.fillStyle='#f4ecd0';g.beginPath();g.moveTo(10.6,.9);g.lineTo(11.1,3);g.lineTo(11.6,.7);g.fill();
    m2Gloss(g,3,-4,3,.8,-.1,.5)},.5);
  const arm=b=>monPartX('serp',b?'armB':'arm',c,v,bs,14,18,4,3,g=>{g.translate(4,3);Kit.solid(g,q=>m2Limb(q,[[0,0],[1.6,6],[5,10]],3,2),-1,0,6,11,b?darkOf(c,.3):c,sc2);
    g.strokeStyle='#1a1008';g.lineWidth=.6;g.lineCap='round';for(const d of [-.2,.4,1]){g.beginPath();g.moveTo(5.4,10.4);g.lineTo(5.4+Math.cos(d)*2.6,10.4+Math.sin(d)*2.6);g.stroke()}},.45);
  const k=st.lunge,u=k>0?1-k:0,mv=st.mv,ph=st.ph*6;
  let rise=0,lean=Math.sin(st.t*1.3)*.04+mv*.1;if(k>0){if(u<.4){rise=6*u/.4;lean=-.2*u/.4}else{const w=Math.sin(Math.PI*Math.min(1,(u-.4)/.5));rise=6-2*w;lean=-.2+.65*w}}
  // 똬리: 한 바퀴 반, 안쪽으로 감기며 물결친다
  const segs=[],N=12;for(let i=0;i<N;i++){const s=i/(N-1),th=.35+s*6.6,rr=(1-s*.45)*(12+Math.sin(s*9-st.t*3-ph)*1.3),lay=s>.62?1:0;
    segs.push({x:-5+Math.cos(th)*rr*1.05,y:-3+Math.sin(th)*rr*.42-lay*3.4-(s>.62?(s-.62)*6:0),z:Math.sin(th)*rr*.42+lay*6+s*.01,sc:1.12-s*.6})}
  const order=segs.map((o,i)=>i).sort((a,b)=>segs[a].z-segs[b].z);
  const tz=1.5;let drawn=false;
  const sk=k>0&&u>.4?Math.sin(Math.PI*Math.min(1,(u-.4)/.45)):0;
  const drawTorso=()=>{g.save();g.translate(4,-6);g.rotate(lean);
    mPart(g,arm(1),-2,-22-rise,-.3-sk*1.2+Math.sin(st.t*1.6+1)*.08);
    mPart(g,hood,0,-27-rise,Math.sin(st.t*1.7)*.04);
    g.save();g.scale(1,1+rise/26);SC.draw(g,torso,0,0);g.restore();
    const hx=1+sk*5,hy=-38-rise+sk*2;mPart(g,head,hx,hy,sk*.2+Math.sin(st.t*1.7)*.05,1.15,1.15);
    if(Math.sin(st.t*2.3+(e.anim||0))>.6||k>0){g.strokeStyle='#d0303a';g.lineWidth=.8;g.beginPath();g.moveTo(hx+14,hy+.6);g.lineTo(hx+18,hy+.3);g.lineTo(hx+19.4,hy-1.2);g.moveTo(hx+18,hy+.3);g.lineTo(hx+19.4,hy+1.6);g.stroke()}
    m2Add(g,()=>mGlow(g,hx+8.4,hy-3.4,2.4,t.eye||'#ffe25a',1));
    const ar=k>0?(u<.4?.5*u/.4:.5-1.9*sk):-.3+Math.sin(st.t*1.6)*.08;mPart(g,arm(0),4,-20-rise,ar);
    g.restore();drawn=true};
  for(const i of order){if(!drawn&&segs[i].z>tz)drawTorso();const o=segs[i];mPart(g,seg,o.x,o.y,0,o.sc,o.sc)}
  if(!drawn)drawTorso();
  // 똬리 끝 꼬리
  st.head={x:6+Math.sin(lean)*36,y:-58-rise}},

// ---- 큰 게: 넓은 등딱지, 큰 집게, 옆걸음 ----
crab(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,sh={tex:'stone',texA:.4,rim:'rgba(255,244,220,.95)',lineW:.7},dk=darkOf(c,.3);
  const shell=monPart('crab','shell',c,v,bs,44,26,22,16,g=>{g.translate(22,16);
    const p=q=>{q.moveTo(-17,0);q.lineTo(-19,-4);q.lineTo(-16,-6);q.bezierCurveTo(-12,-13,12,-13,16,-6);q.lineTo(19,-4);q.lineTo(17,0);q.bezierCurveTo(10,5,-10,5,-17,0);q.closePath()};
    Kit.solid(g,p,-19,-13,19,5,c,sh);
    g.save();g.beginPath();p(g);g.clip();g.fillStyle=m2rgb(darkOf(c,.5),.45);g.beginPath();g.ellipse(0,4,18,4,0,0,6.283);g.fill();
    g.strokeStyle=m2rgb(darkOf(c,.6),.7);g.lineWidth=.8;g.beginPath();g.moveTo(-6,-10);g.quadraticCurveTo(-3,-5,-8,0);g.moveTo(6,-10);g.quadraticCurveTo(3,-5,8,0);g.moveTo(-3,-3);g.quadraticCurveTo(0,-1,3,-3);g.stroke();
    m2Gloss(g,-6,-8,6,1.6,-.15,.45);
    g.fillStyle=m2rgb(liteOf(c,.5),.6);for(const [x,y,r] of [[-12,-6,1.1],[-9,-9,.8],[10,-8,1],[13,-5,.7],[2,-10,.7]]){g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}
    g.restore();
    for(const s of [-1,1])for(let i=0;i<3;i++)Kit.solid(g,q=>{q.moveTo(s*(12+i*2.4),-8+i*2.6);q.lineTo(s*(15.6+i*2.4),-9.4+i*2.6);q.lineTo(s*(13.6+i*2.4),-6.2+i*2.6);q.closePath()},-20,-10,20,0,liteOf(c,.15),{lineW:.4});
    for(const [x,y,r] of [[-9,-5,1.6],[-6.6,-4.2,1.1],[9,-4,1.4]]){Kit.solid(g,q=>q.arc(x,y,r,0,6.283),x-r,y-r,x+r,y+r,'#d8d0b8',{lineW:.4});g.fillStyle='#3a3028';g.beginPath();g.arc(x,y-.2,r*.35,0,6.283);g.fill()}
    g.fillStyle=darkOf(c,.55);g.fillRect(-4,1,8,2.4);g.strokeStyle=m2rgb(liteOf(c,.2),.6);g.lineWidth=.5;for(const x of [-3,-1,1,3]){g.beginPath();g.moveTo(x,1);g.lineTo(x,3.4);g.stroke()}});
  const eye1=g=>{Kit.solid(g,q=>q.rect(-.8,-7,1.6,8),-1,-7,1,1,dk,{lineW:.4});Kit.solid(g,q=>q.arc(0,-8,1.9,0,6.283),-2,-10,2,-6,'#1a120e',{rim:'rgba(255,255,255,1)',lineW:.4});m2Gloss(g,-.6,-8.8,.6,.5,0,.9)};
  const eye=monPart('crab','eyes',c,v,bs,14,13,7,11,g=>{g.translate(7,11);for(const s of [-1,1]){g.save();g.translate(s*2.6,0);g.rotate(s*.14);eye1(g);g.restore()}});
  const leg=b=>monPart('crab',b?'legB':'leg',c,v,bs,18,16,2,6,g=>{g.translate(2,6);Kit.solid(g,q=>m2Limb(q,[[0,0],[6,-4],[11,1],[13,8]],2.8,.9),0,-5,13,8,b?darkOf(c,.38):darkOf(c,.12),{tex:'bone',texA:.25,rim:'rgba(255,240,210,.7)',lineW:.5});
    g.strokeStyle=m2rgb(liteOf(c,.3),.6);g.lineWidth=.4;g.beginPath();g.moveTo(1,-1.2);g.lineTo(6,-4.8);g.stroke()});
  const claw=(b,big)=>monPart('crab',(b?'clawB':'claw')+(big?'L':''),c,v,bs,26,22,4,14,g=>{g.translate(4,14);const cc=b?darkOf(c,.25):liteOf(c,.04),z=big?1.2:.9;g.scale(z,z);
    Kit.solid(g,q=>m2Limb(q,[[0,0],[3,-5],[7,-6]],3.4,3),-1,-8,8,0,dk,sh);
    Kit.solid(g,q=>{q.moveTo(5,-6);q.bezierCurveTo(5,-12,13,-13,15,-9);q.quadraticCurveTo(18,-11,19,-7);q.quadraticCurveTo(16,-7,14.6,-5.4);q.bezierCurveTo(13,-2,6,-1,5,-6);q.closePath()},5,-13,19,-1,cc,sh);
    m2Gloss(g,9,-10,3,1,-.2,.55);g.fillStyle=m2rgb(liteOf(c,.5),.8);for(const x of [8,10.4,12.6]){g.beginPath();g.arc(x,-11.6+(x-8)*.1,.6,0,6.283);g.fill()}g.fillStyle='#2a1a14';g.beginPath();g.moveTo(17,-9.4);g.lineTo(19,-7);g.lineTo(17.6,-7.2);g.fill()});
  const fing=(b,big)=>monPart('crab',(b?'fingB':'fing')+(big?'L':''),c,v,bs,14,10,1,4,g=>{g.translate(1,4);const z=big?1.2:.9;g.scale(z,z);Kit.solid(g,q=>{q.moveTo(0,-1.4);q.quadraticCurveTo(5,-1.4,8.6,1.6);q.quadraticCurveTo(4,1.8,0,1.6);q.closePath()},0,-1.4,8.6,1.8,b?darkOf(c,.3):c,sh);g.fillStyle='#2a1a14';g.beginPath();g.moveTo(7.6,.6);g.lineTo(8.8,1.8);g.lineTo(7.2,1.6);g.fill()});
  const ph=st.ph*14,mv=st.mv,k=st.lunge,u=k>0?1-k:0,sway=Math.sin(ph)*1.2*mv,bob=-Math.abs(Math.sin(ph*2))*.8*mv+Math.sin(st.t*2)*.3;
  const lr=i=>Math.sin(ph+i*1.6)*.35*mv,ll=i=>Math.min(0,-Math.sin(ph+i*1.6))*1.6*mv;
  g.save();g.translate(sway,bob);
  for(let i=0;i<2;i++){mPart(g,leg(1),-9+i*2.4,-12+i*1.2+ll(i+1),-.45+i*.55+lr(i+1),-1,1);mPart(g,leg(1),9-i*2.4,-12+i*1.2+ll(i),-.45+i*.55+lr(i),1,1)}
  const snap=k>0?Math.sin(Math.PI*Math.min(1,u*1.6)):0,rx=snap*8;
  mPart(g,claw(1,0),-10,-14,.2-.1*Math.sin(st.t*1.7),-1,1);mPart(g,fing(1,0),-23.4,-12.4,-.2+Math.max(0,Math.sin(st.t*2.4))*.3,-1,1);
  mPart(g,eye,0,-19,Math.sin(st.t*2)*.06);
  SC.draw(g,shell,0,-12);
  for(let i=0;i<3;i++){mPart(g,leg(0),-11+i*1.8,-9+i*1+ll(i),-.25+i*.42-lr(i),-1,1);mPart(g,leg(0),11-i*1.8,-9+i*1+ll(i+1),-.25+i*.42+lr(i+1),1,1)}
  const cy=-11-snap*3;mPart(g,claw(0,1),12+rx,cy,-.1-snap*.25);
  const fa=-.1-snap*.25,fx=12+rx+Math.cos(fa)*17.4-Math.sin(fa)*-4.8,fy=cy+Math.sin(fa)*17.4+Math.cos(fa)*-4.8;
  mPart(g,fing(0,1),fx,fy,fa+.15+(k>0?(u<.5?.5:-.1):Math.max(0,Math.sin(st.t*2.4+1))*.35));
  if(t.eye){m2Add(g,()=>{for(const s of [-1,1])mGlow(g,s*2.6+Math.sin(s*.12)*8,-27,2,t.eye,.8)})}
  g.restore();st.head={x:0,y:-32+bob}},

// ---- 예티: 흰 털 뭉치, 긴 팔, 공격하면 포효하며 내려친다 ----
yeti(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,skin=Kit.mix(darkOf(c,.35),'#4a5a78',.55),fo={tex:'cloth',texA:.25,rim:'rgba(255,255,255,1)',rimW:2,lineW:.8};
  const tufts=(q,pts)=>{q.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1];q.quadraticCurveTo(mx+dy*.35,my-dx*.35,b[0],b[1])}q.closePath()};
  const leg=b=>monPart('yeti',b?'legB':'leg',c,v,bs,20,22,10,3,g=>{g.translate(10,3);const lc=b?darkOf(c,.28):c,p=q=>tufts(q,[[-6,-1],[6,-2],[7,6],[6,13],[-5,13],[-7,5],[-6,-1]]);Kit.solid(g,p,-7,-2,7,14,lc,fo);m2Fur(g,lc,-5,0,5,12,7,3,3);
    Kit.solid(g,q=>{q.moveTo(-5,13);q.lineTo(8,12.6);q.quadraticCurveTo(9,17,7,17);q.lineTo(-6,17);q.closePath()},-6,12.6,9,17,skin,{tex:'leather',texA:.4,lineW:.5})});
  const body=monPart('yeti','body',c,v,bs,56,50,28,46,g=>{g.translate(28,46);
    const p=q=>tufts(q,[[-12,-2],[-18,-10],[-20,-22],[-15,-34],[-5,-42],[6,-41],[14,-35],[19,-25],[18,-14],[12,-5],[2,0],[-12,-2]]);
    Kit.solid(g,p,-20,-42,19,0,c,fo);
    g.save();g.beginPath();p(g);g.clip();
    g.fillStyle=m2rgb(darkOf(c,.4),.3);g.beginPath();g.ellipse(8,-10,12,9,0,0,6.283);g.fill();
    for(const [x,y,r] of [[-9,-33,6],[1,-37,6],[-15,-22,5],[-6,-25,6],[6,-28,5],[13,-22,4],[-10,-12,5],[2,-15,5]]){g.fillStyle=m2rgb(liteOf(c,.5),.5);g.beginPath();g.moveTo(x-r,y);g.quadraticCurveTo(x,y-r*1.2,x+r,y);g.quadraticCurveTo(x+r*.2,y+r*.55,x-r,y);g.fill();g.strokeStyle=m2rgb(darkOf(c,.4),.35);g.lineWidth=.7;g.beginPath();g.moveTo(x-r,y+.4);g.quadraticCurveTo(x+r*.2,y+r*.6,x+r,y+.2);g.stroke()}
    g.restore();
    Kit.outline(g,p,m2rgb(darkOf(c,.6),.7),.8)});
  const hd=open=>monPart('yeti',open?'headR':'head',c,v,bs,30,30,12,20,g=>{g.translate(12,20);
    const p=q=>tufts(q,[[-7,2],[-9,-6],[-5,-13],[3,-14],[8,-10],[9,-5],[6,2],[-7,2]]);Kit.solid(g,p,-9,-14,9,2,c,fo);m2Fur(g,c,-8,-12,6,1,14,3,5);
    const f=q=>{q.moveTo(1,-9);q.quadraticCurveTo(9,-10,11,-5);if(open){q.lineTo(13,-2);q.lineTo(10,6);q.quadraticCurveTo(4,6,2,1)}else{q.quadraticCurveTo(12,0,8,2);q.quadraticCurveTo(3,3,1,0)}q.closePath()};
    Kit.solid(g,f,1,-10,13,open?6:3,skin,{tex:'leather',texA:.4,rim:'rgba(220,235,255,.8)',lineW:.6});
    g.fillStyle=darkOf(skin,.5);g.beginPath();g.moveTo(2,-8.4);g.lineTo(10.6,-7);g.lineTo(10,-5.4);g.lineTo(2.4,-6);g.fill();
    if(open){g.fillStyle='#2a0a10';g.beginPath();g.moveTo(5,-2);g.lineTo(12.4,-2.6);g.lineTo(10,4.6);g.quadraticCurveTo(6,4.6,5,-2);g.fill();g.fillStyle='#f4f0e0';for(const [x,y,d] of [[6,-2,1],[11,-2.6,1],[6.4,3.6,-1],[10,4,-1]]){g.beginPath();g.moveTo(x-.7,y);g.lineTo(x,y+d*2.4);g.lineTo(x+.7,y);g.fill()}}
    else{g.strokeStyle='#1a1418';g.lineWidth=.7;g.beginPath();g.moveTo(4,-.4);g.lineTo(10,-1);g.stroke();g.fillStyle='#f4f0e0';for(const x of [5,8.6]){g.beginPath();g.moveTo(x,-.6);g.lineTo(x+.6,-3);g.lineTo(x+1.2,-.7);g.fill()}}
    });
  const arm=b=>monPart('yeti',b?'armB':'arm',c,v,bs,24,46,12,6,g=>{g.translate(12,6);const ac=b?darkOf(c,.3):c;
    const p=q=>tufts(q,[[-6,-4],[3,-6],[8,0],[7,12],[6,24],[5,30],[-4,30],[-5,22],[-8,10],[-6,-4]]);Kit.solid(g,p,-8,-6,8,30,ac,fo);m2Fur(g,ac,-6,-3,6,29,14,3.4,9);
    Kit.solid(g,q=>{q.moveTo(-5,29);q.lineTo(6,29);q.quadraticCurveTo(9,34,6,37);q.lineTo(-4,37);q.quadraticCurveTo(-7,33,-5,29);q.closePath()},-7,29,9,37,b?darkOf(skin,.25):skin,{tex:'leather',texA:.4,lineW:.5});
    g.strokeStyle='#e8e4d8';g.lineWidth=.8;g.lineCap='round';for(const x of [-3,0,3]){g.beginPath();g.moveTo(x+.6,36.6);g.lineTo(x+1.4,38.6);g.stroke()}});
  const ph=st.ph*7,mv=st.mv,k=st.lunge,u=k>0?1-k:0,sw=Math.sin(ph)*.45*mv,bob=-Math.abs(Math.sin(ph))*2*mv+Math.sin(st.t*2)*.6;
  const roar=k>0&&u<.75,hr=k>0?(u<.45?-.4*u/.45:-.4+.5*(u-.45)/.55):Math.sin(ph*.5)*.04;
  const lift=k>0?(u<.45?-3*Math.min(1,u/.3):-3+2.5*Math.min(1,(u-.45)/.2)):0;
  const lean=k>0?(u<.45?-.12:.12):mv*.06;
  mPart(g,arm(1),-6,-46+bob,(k>0?lift*.9:.2-sw*.8));
  mPart(g,leg(1),-8,-17+bob*.3,-sw);mPart(g,leg(0),5,-17+bob*.3,sw);
  g.save();g.translate(0,-14+bob);g.rotate(lean);SC.draw(g,body,0,0);
  mPart(g,hd(roar),15,-26,hr,1.2,1.2);
  const ec=t.eye||'#8ae0ff',ex=(7.4*Math.cos(hr)+7*Math.sin(hr))*1.2,ey=(-7*Math.cos(hr)+7.4*Math.sin(hr))*1.2;m2Add(g,()=>mGlow(g,15+ex,-26+ey,2.4,ec,1));
  g.restore();
  mPart(g,arm(0),7+Math.sin(lean)*30,-45+bob,(k>0?lift:-.15+sw*.8));
  if(k>0&&u>.6&&u<.9){const a=lift,hx=7-Math.sin(a)*36,hy=-45+bob+Math.cos(a)*36;m2Add(g,()=>mGlow(g,hx,hy,12,'rgba(200,235,255,.7)',.7))}
  st.head={x:10,y:-66+bob}},

// ---- 표범: 길고 낮은 몸, 긴 꼬리, 고양이 머리, 덮치기 ----
panther(g,e,t,st){const c=t.col,v=st.v,bs=st.bs,fo={tex:'leather',texA:.22,rim:'rgba(255,240,220,.95)',rimW:1.4,lineW:.6};
  const spots=(g,x0,y0,x1,y1,n,sd)=>{const s=mulberry(sd);g.fillStyle=m2rgb(darkOf(c,.6),.5);for(let i=0;i<n;i++){const x=x0+s()*(x1-x0),y=y0+s()*(y1-y0),r=.8+s()*.9;g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}};
  const body=monPart('panther','body',c,v,bs,44,22,24,11,g=>{g.translate(24,11);
    const p=q=>{q.moveTo(-18,-1);q.bezierCurveTo(-18,-7,-10,-6,-3,-5.4);q.bezierCurveTo(4,-5,9,-8,14,-6);q.bezierCurveTo(19,-4,18,5,13,6);q.bezierCurveTo(8,7,4,4,-2,4);q.bezierCurveTo(-8,4,-13,6.4,-16,4.4);q.quadraticCurveTo(-19,2,-18,-1);q.closePath()};
    Kit.solid(g,p,-19,-8,19,6,c,fo);g.save();g.beginPath();p(g);g.clip();spots(g,-16,-6,14,2,22,5);
    
    g.fillStyle=m2rgb(liteOf(c,.4),.35);g.beginPath();g.ellipse(6,4,6,1.8,.1,0,6.283);g.fill();g.restore();
    g.strokeStyle='rgba(255,250,235,.55)';g.lineWidth=.8;g.beginPath();g.moveTo(-14,-5.4);g.bezierCurveTo(-8,-6,0,-5,6,-6.6);g.stroke()});
  const head=monPart('panther','head',c,v,bs,24,20,8,12,g=>{g.translate(8,12);
    Kit.solid(g,q=>{q.moveTo(-2,-5);q.lineTo(-1,-10);q.lineTo(3,-6);q.closePath()},-2,-10,3,-5,darkOf(c,.15),{lineW:.5});
    const p=q=>{q.moveTo(-5,0);q.bezierCurveTo(-6,-6,2,-8,6,-6);q.quadraticCurveTo(10,-4.4,12,-2);q.quadraticCurveTo(12.6,1,10,2);q.quadraticCurveTo(7,4.6,2,4);q.quadraticCurveTo(-3,4,-5,0);q.closePath()};
    Kit.solid(g,p,-6,-8,12.6,4.6,c,fo);g.save();g.beginPath();p(g);g.clip();spots(g,-4,-6,5,-1,6,9);g.restore();
    Kit.solid(g,q=>{q.moveTo(1,-6);q.lineTo(2,-10.4);q.lineTo(5,-6.4);q.closePath()},1,-10.4,5,-6,c,{lineW:.5});g.fillStyle='#d88a8a';g.beginPath();g.moveTo(2,-6.6);g.lineTo(2.4,-8.8);g.lineTo(3.8,-6.6);g.fill();
    g.fillStyle='#1a1010';g.beginPath();g.ellipse(11.4,-1.6,1.1,.8,0,0,6.283);g.fill();
    g.strokeStyle=m2rgb(darkOf(c,.7),.8);g.lineWidth=.6;g.beginPath();g.moveTo(11.4,-.8);g.lineTo(11,1);g.quadraticCurveTo(9.6,2,8,1.4);g.stroke();
    g.strokeStyle='rgba(240,236,220,.7)';g.lineWidth=.35;for(const d of [-.15,.05,.25]){g.beginPath();g.moveTo(10,.2);g.lineTo(15,.2+d*8);g.stroke()}
    g.fillStyle='#120c08';g.beginPath();g.ellipse(6.6,-3.6,1.8,1,-.2,0,6.283);g.fill()});
  const jaw=monPart('panther','jaw',c,v,bs,16,10,2,3,g=>{g.translate(2,3);Kit.solid(g,q=>{q.moveTo(0,-1);q.lineTo(9,-.6);q.quadraticCurveTo(9,2.6,4,2.6);q.quadraticCurveTo(0,2.4,0,-1);q.closePath()},0,-1,9,2.6,darkOf(c,.1),{lineW:.5});g.fillStyle='#f4ecd0';g.beginPath();g.moveTo(7,-.6);g.lineTo(7.6,-2.6);g.lineTo(8.2,-.6);g.fill()});
  const tail=(i)=>monPart('panther','tail'+i,c,v,bs,18,8,16,4,g=>{g.translate(16,4);const w0=i?1.9:2.8,w1=i?1.4:1.9;Kit.solid(g,q=>m2Limb(q,[[0,0],[-7,-.6],[-14,0]],w0,w1),-15,-2,0,2,c,fo);
    if(i){g.fillStyle=darkOf(c,.4);g.beginPath();g.ellipse(-13.4,0,2,1.2,0,0,6.283);g.fill()}});
  const leg=(b,h)=>monPart('panther',(b?'legB':'leg')+(h?'H':''),c,v,bs,12,22,6,3,g=>{g.translate(6,3);const lc=b?darkOf(c,.32):c,P=h?[[0,0],[-1.8,6],[.6,10],[-.4,15]]:[[0,0],[.6,7],[0,12],[.6,15]];
    Kit.solid(g,q=>m2Limb(q,P,h?4.4:3.6,2),-3,0,3,16,lc,fo);Kit.solid(g,q=>q.ellipse(1,15.6,2.6,1.3,0,0,6.283),-1.6,14,3.6,17,lc,{lineW:.5})});
  const ph=st.ph*11,mv=st.mv,k=st.lunge,u=k>0?1-k:0,sw=j=>Math.sin(ph+j)*.55*mv;
  let bx=0,by=-Math.abs(Math.sin(ph))*.8*mv,br=0,fl=0,hl=0;
  if(k>0){if(u<.4){const w=u/.4;by+=3.4*w;br=.06*w;fl=.3*w;hl=-.3*w}else{const w=(u-.4)/.6,s=Math.sin(Math.PI*w);bx=17*w;by+=3.4*(1-w)-9*s;br=-.18*s;fl=-1.3*s;hl=1*s}}
  g.save();g.translate(bx,by);g.rotate(br);
  mPart(g,leg(1,1),-12,-16,sw(Math.PI)+hl);mPart(g,leg(1,0),10,-15,sw(0)+fl);
  const tw=Math.sin(st.t*3+(e.anim||0))*.25,t1=-.5+tw-mv*.25;mPart(g,tail(0),-17,-15,t1);
  const tx=-17-Math.cos(t1)*14,ty=-15-Math.sin(t1)*14;mPart(g,tail(1),tx,ty,t1+.6+Math.sin(st.t*3-1+(e.anim||0))*.5);
  SC.draw(g,body,0,-16);
  const hr=(k>0&&u>.4?-.12:0)+Math.sin(st.ph*2)*.03;
  if(k>0)mPart(g,jaw,13,-17,hr+.35);
  mPart(g,head,12,-20,hr);
  mPart(g,leg(0,1),-14,-14,sw(0)+hl);mPart(g,leg(0,0),8,-13,sw(Math.PI)+fl);
  const ec=t.eye||'#b8ff5a';m2Add(g,()=>mGlow(g,18.4,-23.8,2.2,ec,1));
  g.restore();st.head={x:bx+16,y:by-30}},
});

// ---- 갤러리: 새 종류 × 상태 + 색 변형 ----
function mon2Gallery(box){
  const wrap=document.createElement('div');wrap.style.cssText='margin:6px 0 18px';box.insertBefore(wrap,box.querySelector('#galGrid'));
  const KS=[['scorpion','#b07a3a',16],['elemental','#7ac8ff',16],['imp','#c0402a',12],['golem','#8a7a68',22],['serpent','#3a8a7a',17],['crab','#c0503a',16],['yeti','#e4ecf0',22],['panther','#3a3440',15]];
  const ST=['가만히','걷기','공격','맞음','얼음','불붙음','정예','보스 크기'];
  const VS=[['elemental','#7ac8ff','얼음'],['elemental','#ff7a3a','불'],['elemental','#b89cff','폭풍'],['golem','#8a7a68','돌'],['golem','#d0582a','용암'],['scorpion','#3e3440','검은'],['serpent','#b08a40','사막'],['crab','#4a6a8a','푸른'],['panther','#c8963a','점박이'],['imp','#6a3a8a','보라']];
  const CW=100,CH=96,BH=150,dp=Math.min(2,window.devicePixelRatio||1);
  const mk=(title,w,h)=>{const t=document.createElement('div');t.textContent=title;t.style.cssText='margin:8px 0 4px;font-weight:600';wrap.appendChild(t);const cv=document.createElement('canvas');cv.width=w*dp;cv.height=h*dp;cv.style.cssText=`width:${w}px;height:${h}px;max-width:100%;background:#2a2620;border:1px solid #3a342a;border-radius:6px`;wrap.appendChild(cv);return cv};
  const c1=mk('새 지역 몬스터 · 종류 × 상태',CW*8+60,CH*7+BH+20),c2=mk('새 지역 몬스터 · 색 변형 (TYPES.col)',CW*10,CH+20);
  const tk=(i,v)=>'__g_'+(v?'v'+i:KS[i][0]);
  const types=()=>{const o={};KS.forEach(([d,col,r],i)=>o[tk(i)]={n:d,col,r,draw:d,hp:1});VS.forEach(([d,col],i)=>o[tk(i,1)]={n:d,col,r:KS.find(x=>x[0]===d)[2],draw:d,hp:1});return o};
  const TT=types();
  const es=ST.map((s,r)=>KS.map((k,j)=>({k:tk(j),x:0,y:0,fx:1,anim:j,elite:r===6,boss:r===7?1:0,sc:r===7?1.6:undefined,lunge:0,hurt:0,freezeT:r===4?1:0,stunT:0,slowT:0,burn:r===5?{t:1}:null})));
  const vs=VS.map((x,i)=>({k:tk(i,1),x:0,y:0,fx:1,anim:i,lunge:0,hurt:0,freezeT:0,stunT:0,slowT:0}));
  const t0=performance.now();
  const step=()=>{if(!wrap.isConnected)return;const t=(performance.now()-t0)/1000;
    Object.assign(TYPES,TT);
    try{
      let g=c1.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c1.width,c1.height);g.scale(dp,dp);g.font='11px sans-serif';
      for(let j=0;j<8;j++){g.fillStyle='#e8e2d2';g.textAlign='center';g.fillText(KS[j][0],60+CW*j+CW/2,12)}
      for(let r=0;r<8;r++){const y0=20+CH*r,h=r===7?BH:CH;g.textAlign='left';g.fillStyle='rgba(232,226,210,.65)';g.fillText(ST[r],4,y0+h/2);
        for(let j=0;j<8;j++){const e=es[r][j];e.lunge=r===2?Math.max(0,.15-(t%1.2)*.25):0;e.hurt=r===3?Math.max(0,.12-(t%1)*.24):0;
          drawMon(g,e,60+CW*j+CW/2,y0+h-14,{t,mv:r===1?1:0,noHover:1})}}
      g=c2.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c2.width,c2.height);g.scale(dp,dp);g.font='11px sans-serif';g.textAlign='center';
      vs.forEach((e,i)=>{const cx=CW*i+CW/2;e.lunge=Math.max(0,.15-((t+i*.37)%2)*.25);drawMon(g,e,cx,CH-10,{t,mv:0,noHover:1});g.fillStyle='#e8e2d2';g.fillText(VS[i][2]+' '+VS[i][0],cx,CH+12)});
    }finally{for(const k in TT)delete TYPES[k]}
    requestAnimationFrame(step)};
  requestAnimationFrame(step)}
{const _mg=monGallery;monGallery=function(box){_mg(box);mon2Gallery(box)}}
