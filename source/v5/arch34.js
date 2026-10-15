/* ---------- v34: 궁수 2차 호크아이 — 여러 발 · 꿰뚫기만 있던 기술을 다른 모양으로 (ongi33.js 뒤, qa.js 앞) ----------
   사용자 요청(2026-10-15): 「궁수 2차스킬이 너무 개성이 없다는 피드백이 있었어. 여러발 아니면 피어싱 두 종류라고. 좀더 다양한 형태의 스킬들이 나왔으면 좋겠어」
   · 호크아이 공격 기술 다섯을 새 모양으로 바꾼다. id · 위계 · 선행 · 마나 · 재사용은 그대로(단축칸 · 장비 옵션 · 저장 안전).
     피어싱 블로(관통 일격)   → 센트리 발리스타(쇠뇌 포대): 설치형. 10초 동안 알아서 가까운 적을 쏜다.
     스플리팅 애로우(분열 화살) → 퓨즈 애로우(꽂히는 폭약 화살): 연계형. 3초 뒤 터지고, 그 사이 내 공격이 맞을 때마다 폭발이 커진다.
     엘리멘탈 레인(원소 화살비) → 애로우 펜스(화살 울타리): 지형형. 일자로 꽂힌 화살 벽 — 닿는 적은 맞고 밀려난다(불 · 얼음 · 번개 차례로).
     리트리팅 샷(물러나며 쏘기) → 리트리트 넷(그물 깔고 물러서기): 이동기. 뒤로 뛰며 서 있던 자리에 그물을 남겨 묶는다.
     보우 오브 헤븐(천궁)      → 하늘의 활: 소환형 마무리기. 12초 동안 빛의 활이 머리 위에 떠서 내가 노리는 적에게 빛 화살을 내리꽂는다.
   · 그대로: 트리플 샷 · 스나이프 · 마크 오브 데스 · 애로우 볼텍스 · 포커스 · 패시브 둘. 레인저 갈래는 그대로(덫 · 연막 · 그물 · 미끼로 이미 모양이 다양).
   · 위력(mult): 피어싱 블로 · 보우 오브 헤븐은 시전 시간이 있어 v24(×1+0.15×초) · v32(×1.1) 규칙으로 이미 오른 값을 「기술 위력」으로 그대로 두고,
     한 발 · 한 번 내리꽂기의 피해를 그 위력의 몇 %로 정한다(A34.k). 나머지 셋은 새 배율.
   · 새 종류(turret · fence · skybow)는 b3.js switch가 모르는 이름이라 기본 동작이 없고, 여기 a34Post가 시전 뒤에 처리한다.
     같이 하기의 다른 사람 시전(GHOST)은 그림만(피해 0). 몬스터를 미는 일은 방장(혼자면 나)만.
   · 저장: 바뀐 다섯 기술에 찍은 점수는 이 판을 처음 불러올 때 한 번 스킬 포인트로 돌려준다(rs27과 같은 방식, 저장 필드 rs34).
     원래 점수는 rs34.old에 보관. 캐릭터 키는 지우거나 비우지 않는다(불러온 값의 사본만 고침). */
const A34={ids:['pierceblow','splitarrow','elemrain','backshot','heavenbow'],
  k:{pierceblow:.19,heavenbow:.09},// 기술 위력 대비 한 발(포대) · 한 번 내리꽂기(하늘의 활)의 피해
  tur:[],fen:[],bomb:[],sky:[],net:[],fall:[],cx:null};
{const S=SPELLS;
  {const s=S.pierceblow;delete s.len;delete s.w;Object.assign(s,{kind:'turret',n:'센트리 발리스타',kn:'쇠뇌 포대',en:'Sentry Ballista',chant:'자리를 지켜라',
    turret:{dur:10,iv:.8,reach:520,spd:950},desc:'겨눈 곳(가까이)에 작은 쇠뇌 포대를 세웁니다(0.6초). 10초 동안 0.8초마다 둘레의 가장 가까운 적에게 화살을 쏩니다. 포대는 하나만 세워 두며, 다시 쓰면 새 자리로 옮깁니다.'})}
  {const s=S.splitarrow;delete s.split;Object.assign(s,{mult:1.2,n:'퓨즈 애로우',kn:'꽂히는 폭약 화살',en:'Fuse Arrow',
    stick:{t:3,mult:2.6,per:.3,max:6,rad:120},desc:'폭약을 단 화살이 적에게 꽂힙니다. 3초 뒤 터져 둘레를 함께 칩니다. 터지기 전에 내 다른 공격이 그 적에게 맞을 때마다 폭발이 30%씩 커집니다(최대 6번). 적이 먼저 쓰러지면 그 자리에서 바로 터집니다.'})}
  {const s=S.elemrain;for(const k of ['rate','srad','rad'])delete s[k];Object.assign(s,{kind:'fence',mult:1,n:'애로우 펜스',kn:'화살 울타리',en:'Arrow Fence',chant:'여기서 멈춰라!',
    fence:{len:300,w:26,dur:6,iv:.5,push:46},desc:'겨눈 곳에 화살을 일자로 꽂아 6초 동안 울타리를 세웁니다(내가 겨눈 방향에 가로로). 울타리에 닿은 적은 0.5초마다 맞고 뒤로 밀려나며, 화살은 불(불태움) · 얼음(잠깐 얼림) · 번개(잠깐 기절) 차례로 효과가 붙습니다. 보스 · 준보스는 밀려나지 않습니다.'})}
  {const s=S.backshot;delete s.shot;Object.assign(s,{n:'리트리트 넷',kn:'그물 깔고 물러서기',en:'Net Retreat',
    net:{rad:140,root:2,bossRoot:.8,mult:1.5,life:2.2},desc:'뒤로 뛰어 거리를 벌리면서, 서 있던 자리에 그물을 펼칩니다. 그물 둘레(반경 140)의 적은 조금 맞고 2초 동안 묶입니다(보스 · 준보스는 0.8초). 쫓아오는 적을 떼어 낼 때.'})}
  {const s=S.heavenbow;delete s.len;delete s.w;delete s.knock;Object.assign(s,{kind:'skybow',kn:'하늘의 활',
    skybow:{dur:12,iv:.75,rad:70,reach:620,fall:.28},desc:'하늘의 활을 불러냅니다(시전 1.2초). 12초 동안 빛의 활이 머리 위에 떠서 0.75초마다 내가 겨누는 곳에서 가장 가까운 적(없으면 내 둘레의 가장 가까운 적)에게 빛 화살을 내리꽂습니다. 화살은 맞은 자리 둘레(반경 70)도 함께 칩니다. 재사용 60초.'})}
  for(const id of A34.ids)if(NAMES_J2[id])NAMES_J2[id]=[S[id].n,S[id].chant||''];
}
['turret','fence'].forEach(k=>AIMED.add(k));
setTimeout(()=>{try{if(typeof KINDN==='object')Object.assign(KINDN,{turret:'설치',fence:'울타리',skybow:'하늘 소환'})}catch(_){}},0);

/* ===== 그림: 처음 한 번 굽기 ===== */
const A34B=new Map();
function a34Bake(k,w,h,f){let c=A34B.get(k);if(c)return c;c=document.createElement('canvas');c.width=w;c.height=h;try{f(c.getContext('2d'),w,h)}catch(_){}A34B.set(k,c);return c}
const A34S={
  turret(){return a34Bake('tur',64,64,(g)=>{g.translate(32,58);g.lineCap='round';
    g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(0,0,20,7,0,0,6.283);g.fill();
    g.strokeStyle='#5a3a1c';g.lineWidth=4;for(const [x,y] of [[-16,2],[16,2],[0,-4]]){g.beginPath();g.moveTo(0,-26);g.lineTo(x,y);g.stroke()}
    g.strokeStyle='#a8763e';g.lineWidth=2;for(const [x,y] of [[-16,2],[16,2]]){g.beginPath();g.moveTo(0,-26);g.lineTo(x*.92,y);g.stroke()}
    const gr=g.createLinearGradient(0,-40,0,-24);gr.addColorStop(0,'#c89a5a');gr.addColorStop(1,'#6a4424');g.fillStyle=gr;g.fillRect(-14,-36,28,9);
    g.strokeStyle='#2a1a0c';g.lineWidth=1.2;g.strokeRect(-14,-36,28,9);
    g.strokeStyle='#dfe3ea';g.lineWidth=2.6;g.beginPath();g.moveTo(-6,-46);g.quadraticCurveTo(-24,-32,-6,-18);g.stroke();
    g.strokeStyle='#f4ead2';g.lineWidth=1;g.beginPath();g.moveTo(-6,-46);g.lineTo(10,-32);g.lineTo(-6,-18);g.stroke();
    g.strokeStyle='#e8c35a';g.lineWidth=2;g.beginPath();g.moveTo(-10,-32);g.lineTo(18,-32);g.stroke();g.fillStyle='#ffffff';g.beginPath();g.moveTo(22,-32);g.lineTo(16,-35);g.lineTo(16,-29);g.closePath();g.fill()})},
  fenceArrow(el){return a34Bake('fa'+el,16,44,(g)=>{const c=EL[el]||'#e8e4d8';g.lineCap='round';
    g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(8,41,6,2.4,0,0,6.283);g.fill();
    g.strokeStyle='#5a3a1c';g.lineWidth=2.6;g.beginPath();g.moveTo(8,41);g.lineTo(8,6);g.stroke();g.strokeStyle='#c89a5a';g.lineWidth=1;g.beginPath();g.moveTo(7.4,40);g.lineTo(7.4,8);g.stroke();
    g.fillStyle=c;for(const sd of [-1,1]){g.beginPath();g.moveTo(8,4);g.lineTo(8+sd*6,1);g.lineTo(8+sd*6,10);g.lineTo(8,15);g.closePath();g.fill()}
    g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=.8;g.beginPath();g.moveTo(8,4);g.lineTo(8,15);g.stroke();
    g.fillStyle='#8a7350';g.beginPath();g.ellipse(8,40,4.5,1.8,0,0,6.283);g.fill()})},
  net(){return a34Bake('net',120,60,(g)=>{g.translate(60,30);g.scale(1,.5);g.strokeStyle='rgba(232,224,200,.85)';g.lineWidth=2;
    g.beginPath();g.arc(0,0,54,0,6.283);g.stroke();g.lineWidth=1.2;for(let k=-4;k<=4;k++){const d=k*12,h=Math.sqrt(Math.max(0,54*54-d*d));g.beginPath();g.moveTo(d,-h);g.lineTo(d,h);g.moveTo(-h,d);g.lineTo(h,d);g.stroke()}
    g.fillStyle='#c9a46a';for(let k=0;k<8;k++){const a=k/8*6.283;g.beginPath();g.arc(Math.cos(a)*54,Math.sin(a)*54,3.4,0,6.283);g.fill()}})},
  bow(){return a34Bake('sbow',96,72,(g)=>{g.translate(48,36);const gl=g.createRadialGradient(0,0,0,0,0,46);gl.addColorStop(0,'rgba(255,244,200,.55)');gl.addColorStop(1,'rgba(255,220,130,0)');g.fillStyle=gl;g.fillRect(-48,-36,96,72);
    g.lineCap='round';g.strokeStyle='#fff6d8';g.lineWidth=4;g.beginPath();g.moveTo(-34,-6);g.quadraticCurveTo(0,-40,34,-6);g.stroke();
    g.strokeStyle='#ffd76a';g.lineWidth=2;g.beginPath();g.moveTo(-34,-6);g.quadraticCurveTo(0,-40,34,-6);g.stroke();
    g.strokeStyle='rgba(255,250,230,.9)';g.lineWidth=1;g.beginPath();g.moveTo(-34,-6);g.lineTo(0,14);g.lineTo(34,-6);g.stroke();
    g.strokeStyle='#ffffff';g.lineWidth=2;g.beginPath();g.moveTo(0,14);g.lineTo(0,-30);g.stroke();g.fillStyle='#ffffff';g.beginPath();g.moveTo(0,-36);g.lineTo(-4,-28);g.lineTo(4,-28);g.closePath();g.fill();
    g.fillStyle='rgba(255,240,200,.85)';for(const sd of [-1,1]){g.beginPath();g.moveTo(sd*34,-6);g.quadraticCurveTo(sd*46,-20,sd*44,-30);g.quadraticCurveTo(sd*40,-16,sd*30,-10);g.closePath();g.fill()}})},
  bomb(){return a34Bake('bomb',24,24,(g)=>{g.translate(12,13);g.fillStyle='#3a2c22';g.beginPath();g.arc(0,0,7,0,6.283);g.fill();g.strokeStyle='#e8c35a';g.lineWidth=1.4;g.stroke();
    g.strokeStyle='#c9a46a';g.lineWidth=1.6;g.beginPath();g.moveTo(3,-6);g.quadraticCurveTo(7,-11,10,-9);g.stroke()})}};

/* ===== 시전 앞뒤 ===== */
const a34Pw=(id,L,s,k)=>GHOST?0:physPower()*(s.mult||0)*physBuffMul()*physScale(id,L)*(k||1);
function a34Pre(id,t){const s0=SPELLS[id];if(!s0||!A34.ids.includes(id))return null;
  return {id,s0,t,cd0:P.cd[id]||0,CM:CAST_MOD,G:GHOST,ox:P.x,oy:P.y,tg:t||(GHOST?{x:P.x+Math.cos(P.face)*120,y:P.y+Math.sin(P.face)*120}:aimPoint())}}
function a34Post(c){if(!c)return;const id=c.id,G=c.G;const did=c.CM?true:(P.cd[id]||0)>c.cd0+1e-9;if(!did)return;
  const L=Math.max(1,skLv(id)),s=eff(id,L);if(G)s.ghost=1;const own=G||P;
  const pose=(k,d)=>{if(typeof heroAtk==='function')heroAtk(own,k,d)};
  if(s.kind==='turret'){const T=s.turret,p0=clampRange(c.tg,300),p=landAt(c.ox,c.oy,p0.x,p0.y);
    for(const q of A34.tur)if(q.own===own)q.t=0;
    A34.tur.push({x:p.x,y:p.y,t:T.dur,max:T.dur,cd:.35,iv:T.iv,reach:T.reach,spd:T.spd,a:Math.atan2(c.tg.y-c.oy,c.tg.x-c.ox),own,G:!!G,
      dmg:a34Pw(id,L,s,A34.k.pierceblow),s:Object.assign({},s,{kind:'bolt',turret:0,a34tur:1,ghost:G?1:0})});
    rings.push({x:p.x,y:p.y,r:6,max:50,life:.4,col:'#e8c35a'});burst(p.x,p.y,'#c9a46a',14,90,3,8);pose('bash',.3);
    if(!G)msg(`${s.n}: 10초 동안 알아서 쏩니다`,'#e8c35a')}
  else if(s.kind==='fence'){const F=s.fence,p0=clampRange(c.tg,520),p=G?p0:landAt(c.ox,c.oy,p0.x,p0.y),a=Math.atan2(c.tg.y-c.oy,c.tg.x-c.ox)+1.5708;
    A34.fen.push({x:p.x,y:p.y,ux:Math.cos(a),uy:Math.sin(a),h:F.len/2,w:F.w,t:F.dur,max:F.dur,iv:F.iv,push:F.push,G:!!G,i:0,
      dmg:a34Pw(id,L,s),s:Object.assign({},s,{kind:'field',fence:0,ghost:G?1:0}),hitT:new WeakMap(),seed:(R()*90)|0});
    if(A34.fen.length>6)A34.fen.shift();
    for(let i=-3;i<=3;i++)burst(p.x+Math.cos(a)*F.len/2*i/3,p.y+Math.sin(a)*F.len/2*i/3,'#c9a46a',5,90,2.5,10);shake=Math.max(shake,3);pose('volley',.45)}
  else if(s.kind==='skybow'){const B=s.skybow;for(const q of A34.sky)if(q.own===own)q.t=0;
    A34.sky.push({own,G:!!G,t:B.dur,max:B.dur,cd:.3,iv:B.iv,rad:B.rad,reach:B.reach,fall:B.fall,dmg:a34Pw(id,L,s,A34.k.heavenbow),
      s:Object.assign({},s,{kind:'strike',skybow:0,ghost:G?1:0}),tgt:G?{x:c.tg.x,y:c.tg.y}:null});
    rings.push({x:own.x,y:own.y,r:10,max:160,life:.8,col:'#ffe9a8'});burst(own.x,own.y,'#fff2c0',40,180,3,60);flash={col:'#ffe9a8',a:.18};pose('shout',.5);
    if(!G)msg(`${s.n}: 12초 동안 하늘에서 빛 화살이 내리꽂힙니다`,'#ffe9a8')}
  else if(id==='backshot'&&s.net){const N=s.net,x=c.ox,y=c.oy;A34.net.push({x,y,t:N.life,max:N.life,rad:N.rad});
    rings.push({x,y,r:10,max:N.rad,life:.45,col:'#e8e0c8'});burst(x,y,'#e8e0c8',18,N.rad*1.2,2.5,10);
    if(!G){const pw=physPower()*N.mult*physBuffMul()*physScale(id,L),ns=Object.assign({},s,{kind:'strike',net:0,phys:0,mult:N.mult});
      for(const e of enemies)if(!e.dead&&Math.hypot(e.x-x,e.y-y)<N.rad+hR(e)){hurtE(e,pw*rnd(.9,1.1),ns);if(!e.dead)applyFx(e,{root:N.root,bossRoot:N.bossRoot,job2:'hawkeye'},{x,y})}}}}
{const _tc=tryCast;tryCast=function(id,t){const c=a34Pre(id,t);if(!c)return _tc(id,t);const r=_tc(id,t);try{a34Post(c)}catch(err){if(window.__QA)throw err}return r}}
{const _cr=_castRelease;_castRelease=function(cu){const c=cu&&a34Pre(cu.id,cu.tg);if(!c)return _cr(cu);_cr(cu);try{a34Post(c)}catch(err){if(window.__QA)throw err}}}

/* ===== 꽂히는 폭약: 붙이기 · 키우기 ===== */
const A34BOOM={id:'splitarrow',n:'폭약',cls:'archer',el:'phys',kind:'strike',rank:13,phys:0,a34boom:1};
{const _he=hurtE;hurtE=function(e,amt,s){if(!e||e.dead||!s||s.ghost||GHOST||s.a34boom)return _he(e,amt,s);
  e._miss=null;const r=_he(e,amt,s),hit=e._miss!==s;if(!hit)return r;// 빗나감은 cls2.js가 e._miss에 남긴다(허수아비처럼 생명력이 안 줄어드는 적도 맞은 것으로 셈)
  if(s.stick&&s.id==='splitarrow'&&s.kind==='bolt'){const b=e.a34b;
    if(b&&b.t>0)a34Grow(e,b);
    else{const K=s.stick,B={e,t:K.t,n:0,max:K.max,per:K.per,rad:K.rad,dmg:amt*K.mult/(s.mult||1)};e.a34b=B;A34.bomb.push(B);ftext(e.x,e.y-20,'폭약','#ffb070',false,e.r*2+30)}}
  else if(e.a34b&&e.a34b.t>0&&s.cls==='archer'&&P.cls==='archer'&&!s.proc&&s.kind!=='summon')a34Grow(e,e.a34b);
  return r}}
function a34Grow(e,b){if(b.n>=b.max||b.last===time)return;b.last=time;b.n++;ftext(e.x,e.y-20,`폭약 +${b.n}`,'#ffb070',false,e.r*2+30)}
function a34Boom(b){const e=b.e,x=e.x,y=e.y,k=1+b.per*b.n;e.a34b=null;
  rings.push({x,y,r:8,max:b.rad*(1+.1*b.n),life:.4,col:'#ffb070'});burst(x,y,'#ffb070',24+b.n*6,b.rad*2,4,16);burst(x,y,'#fff2c0',10,b.rad,3,16);decal(x,y,b.rad*.5,'fire');shake=Math.max(shake,3+b.n);
  for(const o of enemies)if(!o.dead&&Math.hypot(o.x-x,o.y-y)<b.rad+hR(o))hurtE(o,b.dmg*k*rnd(.95,1.05),A34BOOM)}

/* ===== 매 프레임 ===== */
function a34Tick(dt){
  // 쇠뇌 포대
  for(const q of A34.tur){q.t-=dt;q.cd-=dt;if(q.t<=0)continue;let tg=null,bd=q.reach;for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-q.x,e.y-q.y);if(d<bd){bd=d;tg=e}}
    if(!tg)continue;q.a=Math.atan2(tg.y-q.y,tg.x-q.x);if(q.cd>0)continue;q.cd=q.iv;
    projs.push({x:q.x+Math.cos(q.a)*16,y:q.y+Math.sin(q.a)*16,z:28,vx:Math.cos(q.a)*q.spd,vy:Math.sin(q.a)*q.spd,r:6,dmg:q.dmg,owner:'p',s:q.s,life:q.reach/q.spd+.1,col:EL.phys,hit:null});
    burst(q.x,q.y,'#e8e4d8',4,60,2,28)}
  A34.tur=A34.tur.filter(q=>q.t>0);
  // 화살 울타리: 닿은 적은 0.5초마다 맞고 밀려난다(보스 · 준보스는 안 밀림)
  for(const f of A34.fen){f.t-=dt;if(f.t<=0||f.G)continue;const nx=-f.uy,ny=f.ux;
    for(const e of enemies){if(e.dead)continue;const dx=e.x-f.x,dy=e.y-f.y,al=dx*f.ux+dy*f.uy,pe=dx*nx+dy*ny,r=hR(e);
      if(Math.abs(al)>f.h+r||Math.abs(pe)>f.w+r)continue;
      const t0=f.hitT.get(e);if(t0!=null&&time-t0<f.iv)continue;f.hitT.set(e,time);
      const el=J2TRI[f.i++%3],ss=(f._tv||(f._tv={}))[el]||(f._tv[el]=Object.assign({},f.s,{el,burn:el==='fire'?1:0,freeze:el==='ice'?.4:0,stun:el==='storm'?.3:0}));
      hurtE(e,f.dmg*rnd(.9,1.1),ss);if(e.dead)continue;applyFx(e,{freeze:ss.freeze,stun:ss.stun},e);burst(e.x,e.y,EL[el],8,90,2.5,16);
      const T=TYPES[e.k]||{};if(T.boss||T.mini||NET.guest)continue;const sd=pe>=0?1:-1,k=f.push+Math.max(0,f.w+r-Math.abs(pe));moveBody(e,nx*sd*k,ny*sd*k)}}
  A34.fen=A34.fen.filter(f=>f.t>0);
  // 꽂히는 폭약
  for(const b of A34.bomb){b.t-=dt;if(b.e.dead||b.t<=0){b.t=0;a34Boom(b)}}
  A34.bomb=A34.bomb.filter(b=>b.t>0);
  // 하늘의 활: 겨누는 곳에서 가장 가까운 적 → 없으면 내 둘레의 가장 가까운 적
  for(const q of A34.sky){q.t-=dt;q.cd-=dt;const o=q.own;if(q.t<=0||!o||o.dead){q.t=0;continue}if(q.cd>0)continue;
    const aim=q.G?q.tgt:aimPoint();let tg=null;if(aim){let bd=220;for(const e of enemies){if(e.dead||Math.hypot(e.x-o.x,e.y-o.y)>q.reach)continue;const d=Math.hypot(e.x-aim.x,e.y-aim.y);if(d<bd){bd=d;tg=e}}}
    if(!tg){let bd=q.reach;for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-o.x,e.y-o.y);if(d<bd){bd=d;tg=e}}}
    if(!tg)continue;q.cd=q.iv;A34.fall.push({sx:o.x,sy:o.y,x:tg.x,y:tg.y,e:tg,t:q.fall,max:q.fall,rad:q.rad,dmg:q.dmg,s:q.s})}
  A34.sky=A34.sky.filter(q=>q.t>0);
  for(const f of A34.fall){f.t-=dt;if(f.e&&!f.e.dead){f.x=f.e.x;f.y=f.e.y}if(f.t>0)continue;
    rings.push({x:f.x,y:f.y,r:6,max:f.rad*1.3,life:.35,col:'#ffe9a8'});burst(f.x,f.y,'#fff2c0',18,f.rad*2,3.5,10);decal(f.x,f.y,f.rad*.4,'holy');
    if(!f.s.ghost)for(const e of enemies)if(!e.dead&&Math.hypot(e.x-f.x,e.y-f.y)<f.rad+hR(e))hurtE(e,f.dmg*rnd(.9,1.1)*(e===f.e?1:.6),f.s)}
  A34.fall=A34.fall.filter(f=>f.t>0);
  for(const n of A34.net)n.t-=dt;A34.net=A34.net.filter(n=>n.t>0)}
{const _u=update;update=function(dt){_u(dt);if(!paused||NET.on)try{a34Tick(dt)}catch(err){if(window.__QA)throw err}}}
// 지역 · 던전을 옮기면 남은 것 정리
function a34Clear(){A34.tur.length=0;A34.fen.length=0;A34.bomb.length=0;A34.sky.length=0;A34.net.length=0;A34.fall.length=0}
{const _lr=loadRegion;loadRegion=function(){a34Clear();return _lr.apply(this,arguments)}}
{const _ed=enterDungeon;enterDungeon=function(){a34Clear();return _ed.apply(this,arguments)}}
{const _xd=leaveDungeon;leaveDungeon=function(){a34Clear();return _xd.apply(this,arguments)}}
{const _ng=newGame;newGame=function(){a34Clear();return _ng.apply(this,arguments)}}

/* ===== 그리기 (FXP.draw: 화면 좌표) ===== */
{const _fd=FXP.draw;FXP.draw=function(c,map,now){_fd.call(this,c,map,now);try{a34Draw(c,map)}catch(err){if(window.__QA)throw err}}}
function a34Draw(c,map){if(!A34.tur.length&&!A34.fen.length&&!A34.bomb.length&&!A34.sky.length&&!A34.net.length&&!A34.fall.length)return;
  const op=c.globalCompositeOperation,ga=c.globalAlpha;c.globalCompositeOperation='source-over';
  for(const n of A34.net){const p=map(n.x,n.y),k=n.rad/54,sp=A34S.net();c.globalAlpha=.7*Math.min(1,n.t*2,(n.max-n.t)*6);c.drawImage(sp,p.x-60*k,p.y-30*k,120*k,60*k)}
  for(const f of A34.fen){const fade=Math.min(1,f.t*2,(f.max-f.t)*5),n=13;c.globalAlpha=fade;
    for(let i=0;i<n;i++){const u=(i/(n-1)*2-1)*f.h,p=map(f.x+f.ux*u,f.y+f.uy*u),el=J2TRI[(i+f.seed)%3],sp=A34S.fenceArrow(el),up=Math.min(1,(f.max-f.t)*8);c.drawImage(sp,p.x-10,p.y-54*up,20,56*up)}}
  for(const q of A34.tur){const p=map(q.x,q.y),sp=A34S.turret(),fl=Math.cos(q.a)-Math.sin(q.a)<0;c.globalAlpha=Math.min(1,q.t*2,(q.max-q.t)*6);
    c.save();c.translate(p.x,p.y);if(fl)c.scale(-1,1);c.drawImage(sp,-32,-58);c.restore()}
  for(const b of A34.bomb){const e=b.e;if(e.dead)continue;const p=map(e.x,e.y),bl=b.t<1?(Math.sin(time*30)>0?1:.5):1;c.globalAlpha=bl;c.drawImage(A34S.bomb(),p.x-12+e.r*.4,p.y-e.r*1.6-30,24,24)}
  c.globalCompositeOperation='lighter';
  for(const q of A34.sky){const o=q.own,p=map(o.x,o.y),bob=Math.sin(time*2.4)*4;c.globalAlpha=Math.min(1,q.t*2,(q.max-q.t)*4)*.95;c.drawImage(A34S.bow(),p.x-48,p.y-150+bob,96,72)}
  for(const f of A34.fall){const k=1-f.t/f.max,a=map(f.sx,f.sy),b=map(f.x,f.y),x0=a.x,y0=a.y-150,x=x0+(b.x-x0)*k,y=y0+(b.y-y0)*k;c.globalAlpha=1;
    c.strokeStyle='#fff6d8';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(x0+(b.x-x0)*Math.max(0,k-.35),y0+(b.y-y0)*Math.max(0,k-.35));c.lineTo(x,y);c.stroke();
    c.drawImage(Kit.glowCv('#ffe9a8'),x-14,y-14,28,28)}
  c.globalAlpha=ga;c.globalCompositeOperation=op}

/* ===== 스킬 창 숫자 ===== */
{const _na=numsAt;numsAt=function(id,L){const out=_na(id,L);if(!A34.ids.includes(id))return out;const s=eff(id,Math.max(1,L||1)),Lv=Math.max(1,L||1);
  const rng=d=>`${Math.round(d*.9)}~${Math.round(d*1.1)}`,base=physPower()*(s.mult||0)*physBuffMul()*physScale(id,Lv),put=(k,v)=>{const i=out.findIndex(r=>r[0]===k);if(i>=0)out[i]=[k,v];else out.unshift([k,v])};
  if(id==='pierceblow'){put('피해',rng(base*A34.k.pierceblow)+' /한 발');out.splice(1,0,['포대',`${s.turret.dur}초 · ${s.turret.iv}초마다 한 발 · 사거리 ${s.turret.reach}`])}
  if(id==='splitarrow'){put('피해',rng(base)+' (꽂힐 때)');out.splice(1,0,['폭발',`${rng(base*s.stick.mult)} · 범위 ${s.stick.rad} · ${s.stick.t}초 뒤`],['내 공격이 맞을 때마다',`폭발 +${Math.round(s.stick.per*100)}% (최대 ${s.stick.max}번)`])}
  if(id==='elemrain'){put('피해',rng(base)+' /0.5초');out.splice(1,0,['울타리',`길이 ${s.fence.len} · ${s.fence.dur}초`],['밀어내기','닿으면 뒤로 (보스 · 준보스 제외)'])}
  if(id==='backshot'){const N=s.net;put('피해',rng(physPower()*N.mult*physBuffMul()*physScale(id,Lv))+' (그물)');out.splice(1,0,['그물',`범위 ${N.rad} · 묶기 ${N.root}초 (보스 ${N.bossRoot}초)`])}
  if(id==='heavenbow'){put('피해',rng(base*A34.k.heavenbow)+' /한 번');out.splice(1,0,['하늘의 활',`${s.skybow.dur}초 · ${s.skybow.iv}초마다 · 범위 ${s.skybow.rad}`])}
  return out}}

/* ===== 아이콘 ===== */
Object.assign(ICP,{
  pierceblow:c=>ICX.path('M16 17L8 29M16 17L24 29M16 17V29',ICC.woodD,1.8)+ICX.xbow(16,12,0,.85)+ICX.lines(25,8,-20,.4,c.hi,2),
  splitarrow:c=>ICX.arrow(13,19,-45,.85)+`<circle cx="22" cy="10" r="4.6" fill="#3a2c22" stroke="${ICC.gold}" stroke-width="1"/>`+ICX.burst(25,6,.4,PAL.fire[0],6),
  elemrain:c=>ICX.path('M3 27h26',ICC.woodD,1.6)+ICX.arrow(8,18,90,.55,PAL.fire[0],PAL.fire[0])+ICX.arrow(16,18,90,.55,PAL.ice[0],PAL.ice[0])+ICX.arrow(24,18,90,.55,PAL.storm[0],PAL.storm[0]),
  backshot:c=>ICX.boot(9,11,0,.6)+ICX.lines(16,11,180,.45,c.hi,3)+ICX.path('M12 19l14 9M12 28l14-9M17 19v9M22 19v9M12 23.5h14',c.hi,1),
  heavenbow:c=>ICX.wings(16,10,.75,ICC.feather)+ICX.bow(16,11,0,.7)+ICX.arrow(16,24,90,.55,'#ffe9a8','#ffe9a8')});

/* ===== 저장: 바뀐 다섯 기술의 점수를 한 번 돌려주기 (rs27과 같은 방식) ===== */
const REFUND34={archer:A34.ids.slice()};
const rs34Clean=x=>{const o={v:1};if(x&&typeof x==='object'&&!Array.isArray(x)&&x.old&&typeof x.old==='object'&&!Array.isArray(x.old)){const old={};for(const k in x.old){const v=x.old[k]|0;if(v>0&&v<=99)old[k]=v}if(Object.keys(old).length)o.old=old}return o};
function rs34Fix(d){if(!d||typeof d!=='object'||d.rs34||!(d.v>=4)||!d.sk||typeof d.sk!=='object'||!REFUND34[d.cls])return {d,n:0};
  const sk=Object.assign({},d.sk),old={};let n=0;
  for(const id of REFUND34[d.cls]){const v=clamp(sk[id]|0,0,MAXSK);if(v>0){old[id]=v;n+=v}delete sk[id]}
  if(!n)return {d,n:0};
  return {d:Object.assign({},d,{sk,sp:(d.sp|0)+n,rs34:{v:1,old}}),n,old}}
{const _ld=load;load=function(d,slot){a34Clear();const f=rs34Fix(d);const ok=_ld.call(this,f.d,slot);
  if(ok&&P){P.rs34=rs34Clean(f.d&&f.d.rs34);
    if(f.n>0)setTimeout(()=>{msg(`호크아이 기술 다섯이 새 모양(포대 · 폭약 · 울타리 · 그물 · 하늘의 활)으로 바뀌었습니다. 찍었던 ${f.n}점을 스킬 포인트로 돌려받았습니다`,'#ffd76a');msg('스킬 트리(T)의 「명궁」 갈래에서 다시 찍으세요','#ffd76a')},800)}
  return ok}}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P)d.rs34=rs34Clean(P.rs34)}catch(err){if(window.__QA)throw err}return d}}

setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{A34,REFUND34,rs34Fix})}catch(_){}},0);
