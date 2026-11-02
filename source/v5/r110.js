/* ---------- v51 110레벨 이후 새 땅 (움직임 · 그림 · 지역 놀이) · 자료는 r110d.js · 대성당은 r110c.js ----------
   사용자 2026-11-02 「사냥하고 던전깨고 퀘스트깨고 하는 것밖에 없어 … 좀 더 다양한 플레이 경험」 → 지역마다 그 지역에서만 하는 일 하나씩.
   · 유리얼음 호수: 걸어 다닐 수 있는 맑은 얼음판(그 밑으로 물고기 그림자) · 얼음 낚시(구멍 곁 F → 입질! 에 다시 F) · 금 간 얇은 얼음(1.5초 넘게 서 있으면 빠짐)
       · 가운데 바위섬의 무당 기둥(하루 한 번 천 묶기 → 30분 축복) · 던전 입구도 바위섬에.
   · 구름 첨봉: 마을 → 북쪽 정상까지 산길 · 윗길에서는 옆바람(하얀 줄무늬 예고 → 밀림) · 굴러오는 돌(그림자 예고) · 돌무덤 셋 · 정상 깃발(하루 한 번 등반 보상)
       · 언덕 위 돌 예배당 종(하루 한 번 30분 축복).
   · 대강 밀림: 지도를 가로지르는 흙탕 강(길이 지나는 곳만 얕은 여울) · 나루 셋을 잇는 뗏목(F) · 8분마다 3분은 밤(밤 몬스터 둘로 바뀜 · 반딧불) · 독안개 늪.
   · 오로라 빙관: 6분마다 80초 오로라(하늘 빛 · 오로라 정령 · 경험치 +25%) · 추위(모닥불 · 마을 곁이 아니면 2분에 걸쳐 차오름 → 다 차면 느려지고 조금씩 다침).
   · 풍경 기록: 지역마다 다섯 곳(+광장 둘) 경치 좋은 자리 → 가까이 가면 기록. 성장(G) 창 「풍경 · 도감」 칸에서 모아 보기 · 업적.
   · 낮/밤 · 오로라 시계는 실제 시각으로 정해서 같이 하기 동료와 같다. 얼음 · 바람 · 돌 · 추위 · 낚시 · 뗏목은 각자 화면에서(동료 것은 계산하지 않음).
   · 저장: P.r110 하나 (없으면 기본값 · 옛 판은 모르는 값이라 그대로 둔다). 기존 저장 값은 건드리지 않는다. */
const R110V={toff:0,force:{night:null,aurora:null},fish:null,ice:null,iceT:0,cold:0,ride:null,gust:null,gustT:6,rocks:[],rockT:4,fogT:0,said:{},last:{},hole:{},vchk:0,prevN:null,prevA:null,spT:0};
const R110T={nightCyc:480,nightLen:180,aurCyc:360,aurLen:80,coldUp:100/120,coldDown:30,fireR:230,iceBreak:1.5,gustEvery:[7,11],rockEvery:[4.5,7.5]};
window.__r110=R110V;
const r110Now=()=>Date.now()/1000+R110V.toff;
const r110Day=()=>Math.floor((Date.now()+9*3600e3)/86400000);
const r110Night=()=>R110V.force.night!=null?!!R110V.force.night:(r110Now()%R110T.nightCyc)>=R110T.nightCyc-R110T.nightLen;
const r110Aurora=()=>R110V.force.aurora!=null?!!R110V.force.aurora:(r110Now()%R110T.aurCyc)<R110T.aurLen;
const r110In=id=>!DG&&!IN&&REG&&REG.id===id;
queueMicrotask(()=>{try{if(typeof BGM_REG==='object')Object.assign(BGM_REG,{[R110.sq]:'town',[R110.lake]:'snow',[R110.peak]:'field',[R110.jungle]:'forest',[R110.aurora]:'sea'})}catch(_){}});
// 선공 · 비선공 섞기 (v26 규칙): 혼령 · 거인 · 산양 · 골렘 · 개구리 · 석상 · 반딧불 · 곰 · 망령 · 오로라 정령은 먼저 덤비지 않는다
if(typeof AG26==='object')for(const k of ['lk1_mist','lk1_giant','pk1_ram','pk1_golem','jg1_frog','jg1_idol','jg1_firefly','au1_bear','au1_whale','au1_spirit'])AG26.P.add(k);

/* ===== 저장 칸 ===== */
const r110Obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
function r110Clean(raw){const o=r110Obj(raw)?Object.assign({},raw):{};
  for(const k of ['v','f','d','dy'])o[k]=r110Obj(o[k])?Object.assign({},o[k]):{};
  for(const k of ['sm','au','fn','cath'])o[k]=Number.isFinite(+o[k])?Math.max(0,Math.min(1e9,+o[k]|0)):0;return o}
const r110Empty=o=>!Object.keys(o.v).length&&!Object.keys(o.f).length&&!Object.keys(o.d).length&&!Object.keys(o.dy).length&&!o.sm&&!o.au&&!o.fn&&!o.cath;
const r110S=()=>{if(!P)return r110Clean(null);if(!r110Obj(P.r110)||!r110Obj(P.r110.v))P.r110=r110Clean(P.r110);return P.r110};
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P&&P.r110){const s=r110Clean(P.r110);if(!r110Empty(s))d.r110=s}}catch(e){if(window.__QA)throw e}return d}}
{const _ld=load;load=function(d){const ok=_ld.apply(this,arguments);if(ok){try{P.r110=r110Clean(d&&d.r110)}catch(e){if(window.__QA)throw e;P.r110=r110Clean(null)}r110Reset()}return ok}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);if(P)P.r110=r110Clean(null);r110Reset();return r}}
function r110Reset(){Object.assign(R110V,{fish:null,ice:null,iceT:0,cold:0,ride:null,gust:null,rocks:[],fogT:0,hole:{}})}
const r110Buff=(id,n,t,o)=>{P.buffs[id]=Object.assign({t,max:t,n},o||{})};

/* ===== 1) 지도 다듬기 (지역 땅은 region.js가 이미 만들어 둠 · 여기서 호수 · 산길 · 강 · 모닥불 · 풍경 자리를 더한다) ===== */
const R110L={lake:{cx:3650,cy:3000,rx:1950,ry:1700},isle:{x:3650,y:3000,r:340},
  trail:[[3000,4800],[3320,4250],[2720,3650],[3300,3050],[2680,2450],[3220,1850],[2860,1250],[3000,760]],sum:{x:3000,y:700},chapel:{x:3560,y:4460},
  riverY:x=>3000+420*Math.sin(x/950+.6)+160*Math.sin(x/430),riverW:170,docks:[[900,-1],[3000,1],[5100,-1]],
  fogs:[[1250,4650,240],[2550,5150,220],[4150,4800,250],[5150,4100,210]]};
const r110D=(x,y,t,o)=>Object.assign({x,y,k:'r110',t,s:1,v:0,zl:0},o||{});
const r110Seg=(px,py,pts)=>{let m=1e9;for(let i=1;i<pts.length;i++)m=Math.min(m,segDist(px,py,pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1]));return m};
function r110Free(L,x,y,r){if(L.lq){const prev=LQ;LQ=L.lq;const b=liqAt(x,y)>.15;LQ=prev;if(b)return false}const T=L.town;if(T&&Math.hypot(x-T.x,y-T.y)<(T.safe||SAFE)+60)return false;
  return !L.decor.some(d=>(d.k==='cave'||d.k==='edgeportal'||d.k==='bld'||d.k==='r110')&&Math.hypot(d.x-x,d.y-y)<r)}
function r110Clear(L,f){for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(d.town||d.k==='cave'||d.k==='edgeportal'||d.k==='r110'||d.k==='bld'||d.k==='tfolk'||d.k==='npc'||d.k==='gate'||d.k==='shop'||d.k==='stash')continue;if(f(d))L.decor.splice(i,1)}}
function r110Post(){
  // 호수: 얼음판 위 장식은 걷어내고(얼음 바위 몇 개만) 바위섬 · 무당 기둥 · 낚시 구멍 · 얇은 얼음
  {const L=RCACHE[R110.lake];if(L&&!L.r110){const K=R110L.lake,I=R110L.isle,s=mulberry(4111),inLake=(x,y,m)=>((x-K.cx)/(K.rx+(m||0)))**2+((y-K.cy)/(K.ry+(m||0)))**2<1;
    r110Clear(L,d=>inLake(d.x,d.y,40)&&!(d.k==='iceboulder'&&s()<.08));
    const wet=(x,y)=>{const pv=LQ;LQ=L.lq;const b=liqAt(x,y)>.1;LQ=pv;return b},holes=[],thin=[],ok=(x,y,r)=>inLake(x,y,-160)&&!wet(x,y)&&Math.hypot(x-I.x,y-I.y)>I.r+140&&[...holes,...thin].every(h=>Math.hypot(h.x-x,h.y-y)>r)&&!L.caves.some(c=>Math.hypot(c.x-x,c.y-y)<260);
    for(let i=0;i<400&&holes.length<9;i++){const a=s()*6.283,r=.35+s()*.55,x=K.cx+Math.cos(a)*K.rx*r,y=K.cy+Math.sin(a)*K.ry*r;if(ok(x,y,380))holes.push({x,y,i:holes.length})}
    for(let i=0;i<600&&thin.length<14;i++){const a=s()*6.283,r=.25+s()*.7,x=K.cx+Math.cos(a)*K.rx*r,y=K.cy+Math.sin(a)*K.ry*r,rr=95+s()*45;if(ok(x,y,260))thin.push({x,y,r:rr,i:thin.length,brk:-99})}
    const cr=[];for(let i=0;i<150;i++){const a=s()*6.283,r=s()**.6,x=K.cx+Math.cos(a)*K.rx*r*.97,y=K.cy+Math.sin(a)*K.ry*r*.97;if(Math.hypot(x-I.x,y-I.y)<I.r+30)continue;
      const pts=[[x,y]];let b=s()*6.283,px=x,py=y;for(let k=0;k<4+(s()*5|0);k++){b+=(s()-.5)*1.4;px+=Math.cos(b)*(30+s()*60);py+=Math.sin(b)*(30+s()*60);pts.push([px,py])}cr.push(pts)}
    // 바위섬: 바위 테두리 · 무당 기둥 무리 · 하얀 바위 절벽
    for(let i=0;i<22;i++){const a=i/22*6.283+s()*.2,r=I.r*(.82+s()*.25);L.decor.push({x:I.x+Math.cos(a)*r,y:I.y+Math.sin(a)*r*.92,k:s()<.6?'rock':'mossrock',s:.9+s()*.6,v:s(),zl:0})}
    for(let i=0;i<6;i++){const a=-1.2+i*.32;L.decor.push({x:I.x+Math.cos(a)*120,y:I.y-60+Math.sin(a)*80,k:'snowpine',s:.8+s()*.3,v:s(),zl:0})}
    const pole=r110D(I.x-120,I.y+60,'pole',{light:110,label:'무당 기둥'});L.decor.push(pole);for(let i=0;i<8;i++){const a=i/8*6.283;L.decor.push(r110D(pole.x+Math.cos(a)*48,pole.y+Math.sin(a)*30,'pole',{v:i+1,small:1}))}
    L.r110={holes,thin,cr,pole,fish:Array.from({length:16},(_,i)=>({a:s()*6.283,r:.2+s()*.7,sp:(.02+s()*.04)*(s()<.5?-1:1),ph:s()*6.283,k:.6+s()*.8}))};
    for(const h of holes)L.decor.push(r110D(h.x+40,h.y-30,'tent',{v:h.i}))}}
  // 구름 첨봉: 정상 산길(길 그림 · 장식 걷기) · 돌무덤 셋 · 정상 깃발 · 언덕 위 돌 예배당 · 높은 곳은 눈 덮인 나무와 바위로
  {const L=RCACHE[R110.peak];if(L&&!L.r110){const tr=R110L.trail,s=mulberry(4127),pts=[];
    for(let i=1;i<tr.length;i++){const [a,b]=[tr[i-1],tr[i]];for(let k=0;k<12;k++){const u=k/12;pts.push({x:a[0]+(b[0]-a[0])*u,y:a[1]+(b[1]-a[1])*u})}}pts.push({x:tr[tr.length-1][0],y:tr[tr.length-1][1]});
    L.roads.push(pts);r110Clear(L,d=>r110Seg(d.x,d.y,tr)<80||Math.hypot(d.x-R110L.sum.x,d.y-R110L.sum.y)<260||Math.hypot(d.x-R110L.chapel.x,d.y-R110L.chapel.y)<200);
    for(const d of L.decor){if(d.town||d.k==='cave'||d.k==='edgeportal')continue;if(d.y<2300&&/^(windtree|bush|flowers|mossrock)$/.test(d.k))d.k=s()<.6?'snowpine':'iceboulder'}
    for(let i=0;i<40;i++){const x=600+s()*4800,y=300+s()*1700;if(r110Seg(x,y,tr)<120||Math.hypot(x-R110L.sum.x,y-R110L.sum.y)<300)continue;L.decor.push({x,y,k:s()<.5?'icespike':'iceboulder',s:.9+s()*.7,v:s(),zl:0})}
    const cairns=[2,4,6].map((i,n)=>r110D(tr[i][0]+70,tr[i][1],'cairn',{n:n+1,label:`돌무덤 ${n+1}`}));L.decor.push(...cairns);
    const flag=r110D(R110L.sum.x,R110L.sum.y,'flag',{light:160,label:'구름 첨봉 정상'}),chapel=r110D(R110L.chapel.x,R110L.chapel.y,'chapel',{light:120,label:'구름 위 돌 예배당'});
    L.decor.push(flag,chapel);L.r110={cairns,flag,chapel}}}
  // 대강 밀림: 흙탕 강을 판다(길이 지나는 곳은 얕은 여울로 남김) · 물에 잠긴 장식 걷기 · 나루 셋 · 독안개 늪
  {const L=RCACHE[R110.jungle];if(L&&!L.r110){const lq=L.lq,Y=R110L.riverY,W0=R110L.riverW,T=L.town;
    const rb=L.roads.map(r=>r.map(p=>[p.x,p.y])),road=(x,y)=>{let m=1e9;for(const r of rb){m=Math.min(m,r110Seg(x,y,r));if(m<90)break}return m};
    for(let j=0;j<LQN;j++)for(let i=0;i<LQN;i++){const x=i*LQS,y=j*LQS,d=Math.abs(y-Y(x));if(d>W0+60)continue;let a=clamp((W0+40-d)/80,0,1);if(!a)continue;
      const keep=Math.min((road(x,y)-60)/70,(Math.hypot(x-T.x,y-T.y)-SAFE-160)/150,...L.edges.map(e=>(Math.hypot(x-e.x,y-e.y)-260)/120),...L.caves.map(c=>(Math.hypot(x-c.x,y-c.y)-280)/120));
      if(keep<1)a*=clamp(keep,0,1);const k=j*LQN+i;lq[k]=Math.max(lq[k],a)}
    {const prev=LQ;LQ=lq;r110Clear(L,d=>liqAt(d.x,d.y)>.12);LQ=prev}
    const docks=R110L.docks.map(([x,sd],i)=>{const y=Y(x)+sd*(W0+70);return r110D(x,y,'dock',{i,sd,light:110,label:`뗏목 나루 ${i+1}`})});
    r110Clear(L,d=>docks.some(k=>Math.hypot(d.x-k.x,d.y-k.y)<140)||R110L.fogs.some(f=>Math.hypot(d.x-f[0],d.y-f[1])<f[2]*.6&&s110(d)));L.decor.push(...docks);L.r110={docks}}}
  // 오로라 빙관: 모닥불 열 곳 (마을 곁은 마을이 녹여 줌)
  {const L=RCACHE[R110.aurora];if(L&&!L.r110){const s=mulberry(4153),fires=[],T=L.town;
    for(let i=0;i<500&&fires.length<11;i++){const x=500+s()*5000,y=500+s()*5000;if(Math.hypot(x-T.x,y-T.y)<700||fires.some(f=>Math.hypot(f.x-x,f.y-y)<900))continue;if(!r110Free(L,x,y,200))continue;fires.push(r110D(x,y,'fire',{light:200,i:fires.length}))}
    r110Clear(L,d=>fires.some(f=>Math.hypot(d.x-f.x,d.y-f.y)<120));L.decor.push(...fires);L.r110={fires}}}
  // 첨탑 광장: 순례자 천막 몇 개
  {const L=RCACHE[R110.sq];if(L&&!L.r110)L.r110={}}
  r110Views();r110Labels()}
const s110=d=>d.k!=='templestone';
// 맵 끝 포탈 이름: 지옥 레벨로 (천둥 우는 첨봉 → 광장은 world3.js w3Labels가 이미 지옥 레벨로 적는다)
function r110Labels(){for(const id of R110.ids){const L=RCACHE[id];if(!L||!L.edges)continue;for(const e of L.edges){const D=REGIONS[e.to];if(!D)continue;e.label=`${D.n}로 · ${D.hell?'지옥 ':''}Lv${D.base+(D.hell?40:0)}~`}}}

/* ===== 2) 풍경 기록: 지역마다 다섯 곳 + 광장 둘 ===== */
const R110_VIEWS=[];
function r110Views(){if(R110_VIEWS.length)return;const add=(reg,id,n,d,x,y,o)=>{const v=Object.assign({reg,id,n,d,x,y},o||{});R110_VIEWS.push(v);const L=RCACHE[reg];if(L)L.decor.push(r110D(x,y,'view',{vw:v}))};
  const K=R110L.lake,I=R110L.isle,tr=R110L.trail,dk=RCACHE[R110.jungle]&&RCACHE[R110.jungle].r110?RCACHE[R110.jungle].r110.docks:[],fire=RCACHE[R110.aurora]&&RCACHE[R110.aurora].r110?RCACHE[R110.aurora].r110.fires:[];
  const free=(reg,x,y)=>{const L=RCACHE[reg];if(!L)return [x,y];for(let k=0;k<40;k++){const a=k*2.4,r=k*22,X=x+Math.cos(a)*r,Y=y+Math.sin(a)*r;if(r110Free(L,X,Y,90))return [X,Y]}return [x,y]};
  const at=(reg,x,y)=>free(reg,x,y);
  add(R110.lake,'lk_isle','바위섬의 무당 기둥','천 조각이 바람에 나부끼는 바위섬. 얼음 위로 해가 비치면 기둥 그림자가 길게 눕습니다.',...at(R110.lake,I.x-210,I.y+40));/* 던전 입구(바위섬 오른쪽 아래)와 겹치지 않게 */
  add(R110.lake,'lk_clear','발밑의 물고기 떼','얼음이 유리처럼 맑아 발밑으로 물고기 떼가 지나갑니다.',...at(R110.lake,K.cx-K.rx*.55,K.cy+K.ry*.2));
  add(R110.lake,'lk_cliff','하얀 절벽 끝','호수 북쪽 끝, 하얀 바위 절벽이 얼음 속으로 내려앉는 곳.',...at(R110.lake,K.cx+300,K.cy-K.ry-180));
  add(R110.lake,'lk_east','동쪽 얼음 바다','얼음판이 끝없이 이어져 하늘과 맞닿은 동쪽 끝.',...at(R110.lake,K.cx+K.rx+170,K.cy+300));
  add(R110.lake,'lk_dock','은물결 나루의 아침','나루 장대에 얼음꽃이 핀 아침.',...at(R110.lake,RCACHE[R110.lake].town.x+420,RCACHE[R110.lake].town.y-330));
  add(R110.peak,'pk_sum','구름 첨봉 정상','발아래로 구름 바다가 펼쳐진 정상. 정상 깃발 곁에 서야 기록됩니다.',R110L.sum.x+60,R110L.sum.y+70,{need:'sum'});
  add(R110.peak,'pk_chapel','구름 위 돌 예배당','초록 언덕 꼭대기, 구름에 걸린 작은 돌 예배당.',R110L.chapel.x-130,R110L.chapel.y+120);
  add(R110.peak,'pk_mid','두 번째 돌무덤에서 본 골짜기','산길 한가운데서 내려다본 초록 골짜기와 돌집 마을.',tr[4][0]-160,tr[4][1]+40);
  add(R110.peak,'pk_ice','빙하의 혀','봉우리에서 흘러내린 빙하가 초록 들판 앞에서 멈춘 곳.',...at(R110.peak,1100,1500));
  add(R110.peak,'pk_east','동쪽 능선','바람이 깎은 능선 너머로 오로라 빙관의 하늘이 보입니다.',...at(R110.peak,5000,2400));
  add(R110.jungle,'jg_bend','흙탕 강의 큰 굽이','강이 크게 휘돌아 나가는 곳. 강물이 바다처럼 넓습니다.',...at(R110.jungle,2000,R110L.riverY(2000)-R110L.riverW-130));
  add(R110.jungle,'jg_night','반딧불 강가','밤에만 기록됩니다. 강가 수풀이 반딧불로 반짝입니다.',...at(R110.jungle,4200,R110L.riverY(4200)-R110L.riverW-140),{need:'night'});
  add(R110.jungle,'jg_dock','세 번째 나루','뗏목꾼들이 쉬어 가는 동쪽 나루.',dk[2]?dk[2].x+70:5100,dk[2]?dk[2].y-90:2500);
  add(R110.jungle,'jg_swamp','안개 늪의 가장자리','초록 안개가 낮게 깔린 늪. 오래 머물면 숨이 막힙니다.',...at(R110.jungle,R110L.fogs[1][0]+R110L.fogs[1][2]+60,R110L.fogs[1][1]-60));
  add(R110.jungle,'jg_canopy','하늘을 가린 나무 지붕','나무 지붕이 너무 높아 낮에도 어스름한 숲 한가운데.',...at(R110.jungle,1100,1900));
  add(R110.aurora,'au_sky','오로라 아래 얼음 바다','오로라가 피었을 때만 기록됩니다. 초록 빛 커튼이 얼음 바다 위에서 일렁입니다.',...at(R110.aurora,3600,3000),{need:'aurora'});
  add(R110.aurora,'au_fire','외딴 모닥불','눈보라 속에서 꺼지지 않는 모닥불.',fire[3]?fire[3].x+90:2500,fire[3]?fire[3].y+60:2500);
  add(R110.aurora,'au_north','세상의 북쪽 끝','더 갈 곳이 없는 북쪽 끝. 하늘과 얼음의 경계가 사라집니다.',...at(R110.aurora,3200,450));
  add(R110.aurora,'au_spikes','얼음 가시 숲','바람이 깎아 세운 얼음 가시들이 숲처럼 늘어선 곳.',...at(R110.aurora,4800,4400));
  add(R110.aurora,'au_camp','극야 파수막의 불빛','멀리서 본 파수막. 이 땅에서 유일하게 따뜻한 빛입니다.',...at(R110.aurora,RCACHE[R110.aurora].town.x+620,RCACHE[R110.aurora].town.y-420));
  add(R110.sq,'sq_front','아홉 첨탑 정면','광장 한가운데서 올려다본 알록달록한 아홉 첨탑.',3000,2850);
  add(R110.sq,'sq_east','광장 동쪽 성벽 길','순례자 천막 너머로 첨탑들이 겹쳐 보이는 자리.',3600,2700)}
function r110ViewTick(){if(DG||IN||!P||P.dead)return;R110V.vchk-=1/60;if(R110V.vchk>0)return;R110V.vchk=.25;const S0=r110S();
  for(const v of R110_VIEWS){if(v.reg!==REG.id||S0.v[v.id])continue;if(Math.hypot(P.x-v.x,P.y-v.y)>90)continue;
    if(v.need==='night'&&!r110Night()){r110Once('vn','반딧불 강가는 밤에만 기록할 수 있습니다','#c8ff6a');continue}
    if(v.need==='aurora'&&!r110Aurora()){r110Once('va','오로라가 피었을 때만 기록할 수 있습니다','#9affd0');continue}
    S0.v[v.id]=r110Day();const n=Object.keys(S0.v).length;banner={t:`풍경 기록 · ${v.n}`,sub:`${v.d} (${n}/${R110_VIEWS.length})`,col:'#ffe8a0',life:3,max:3};
    rings.push({x:v.x,y:v.y,r:6,max:110,life:.8,col:'#ffe8a0'});burst(v.x,v.y,'#ffe8a0',30,150,3,20);P.gold+=P.lvl*60;msg(`풍경 기록: ${v.n} · 금화 ${(P.lvl*60).toLocaleString()} (성장 G · 풍경 · 도감)`,'#ffe8a0');save()}}
function r110Once(k,m,c){if(time-(R110V.said[k]||-99)<8)return;R110V.said[k]=time;msg(m,c)}

/* ===== 3) 유리얼음 호수: 얼음 낚시 · 얇은 얼음 · 무당 기둥 ===== */
const R110_FISH=[
  {id:'trout',n:'은빛 얼음송어',w:34,g:1},{id:'smelt',n:'유리 빙어',w:30,g:.8},{id:'stick',n:'호수 가시고기',w:16,g:1.4},
  {id:'sturg',n:'푸른 등 철갑상어',w:9,g:4,b:['철갑상어의 기운',{dr:.05}]},{id:'cat',n:'바위섬 무당 메기',w:6,g:5,b:['무당 메기의 기운',{dmg:.05}]},
  {id:'carp',n:'천 년 얼음잉어',w:3,g:10,b:['얼음잉어의 기운',{dmg:.06,spd:.06}]},{id:'golom',n:'투명 기름 물고기',w:1.6,g:16,b:['투명 물고기의 기운',{cdr:.06}]},
  {id:'scale',n:'누르간의 은비늘',w:.4,g:30,item:1}];
const r110Hole=()=>{const L=RCACHE[R110.lake],H=L&&L.r110;if(!H)return null;let b=null,bd=72;for(const h of H.holes){const d=dist(P,h);if(d<bd){bd=d;b=h}}return b};
function r110FishPick(){const tot=R110_FISH.reduce((a,f)=>a+f.w,0);let t=R()*tot;for(const f of R110_FISH){t-=f.w;if(t<=0)return f}return R110_FISH[0]}
function r110FishStart(h){if(R110V.fish)return;const cd=(R110V.hole[h.i]||-99)+25-time;if(cd>0){msg(`이 구멍은 다시 얼고 있습니다 (${Math.ceil(cd)}초)`,'#9fe8ff');return}
  R110V.fish={h,t:0,bite:rnd(2.4,5.2),x:P.x,y:P.y,st:'wait'};msg('낚싯줄을 얼음 구멍에 내렸습니다. 찌가 출렁이면 F!','#9fe8ff')}
function r110FishTick(dt){const F=R110V.fish;if(!F)return;if(P.dead||REG.id!==R110.lake||DG||Math.hypot(P.x-F.x,P.y-F.y)>18){R110V.fish=null;msg('낚싯줄을 거뒀습니다','#a39d8f');return}
  F.t+=dt;if(F.st==='wait'&&F.t>=F.bite){F.st='bite';F.bt=F.t;ftext(P.x,P.y-40,'입질!','#ffe066',true,90);rings.push({x:F.h.x,y:F.h.y,r:4,max:50,life:.4,col:'#ffe066'})}
  else if(F.st==='bite'&&F.t-F.bt>.95){R110V.fish=null;msg('물고기가 미끼만 먹고 달아났습니다. 다시 F로 내려 보세요','#a39d8f')}}
function r110FishCatch(){const F=R110V.fish;if(!F||F.st!=='bite')return false;R110V.fish=null;R110V.hole[F.h.i]=time;const f=r110FishPick(),S0=r110S();S0.f[f.id]=(S0.f[f.id]|0)+1;S0.fn++;
  const gold=Math.round(P.lvl*25*f.g);P.gold+=gold;let ex='';
  if(f.b)r110Buff('r110_fish',f.b[0],600,f.b[1]);
  if(f.item){let it=null;for(let i=0;i<60&&!it;i++){const x=makeItem(P.lvl,true);if(x&&x.rar>=2)it=x}if(!it)it=makeItem(P.lvl,true);if(P.bag.length<BAG_MAX)P.bag.push(it);else loot.push({x:P.x,y:P.y,kind:'item',item:it,t:0});ex=` · ${itemName(it)}`}
  burst(F.h.x,F.h.y,'#cfefff',24,140,3,24);ftext(P.x,P.y-30,f.n,'#cfefff',true,80);
  msg(`낚았다! ${f.n}${S0.f[f.id]===1?' (도감에 새로)':''} · 금화 ${gold.toLocaleString()}${f.b?` · ${f.b[0]} 10분`:''}${ex}`,f.item?'#ffd76a':'#cfefff');save();return true}
// 얇은 얼음: 1.5초 넘게 서 있으면 깨져 빠진다(피해 8% · 30% 느려짐 3초 · 가장자리로 밀려남). 깨진 자리는 30초 동안 물
function r110IceTick(dt){const L=RCACHE[R110.lake],H=L&&L.r110;if(!H||P.dead||R110V.ride)return;let on=null;
  for(const p of H.thin){const d=Math.hypot(P.x-p.x,P.y-p.y);if(time-p.brk<30){if(d<p.r){const a=Math.atan2(P.y-p.y,P.x-p.x);P.x=p.x+Math.cos(a)*(p.r+4);P.y=p.y+Math.sin(a)*(p.r+4)}continue}if(d<p.r){on=p;break}}
  if(!on){R110V.ice=null;R110V.iceT=0;return}if(R110V.ice!==on){R110V.ice=on;R110V.iceT=0}R110V.iceT+=dt;
  if(R110V.iceT>.5&&R()<dt*6)ftext(P.x+rnd(-20,20),P.y-10,'쩍','#cfefff',false,30);
  if(R110V.iceT>=R110T.iceBreak){on.brk=time;R110V.ice=null;R110V.iceT=0;burst(P.x,P.y,'#cfefff',40,180,4,10);rings.push({x:P.x,y:P.y,r:6,max:on.r,life:.6,col:'#9fe8ff'});shake=Math.max(shake,6);
    if(P.invT<=0){const d=Math.round(maxHp()*.08);P.hp=Math.max(1,P.hp-d);ftext(P.x,P.y,'-'+d,'#9fe8ff',false,50);r110Buff('r110_wet','얼음물에 젖음',3,{spd:-.3})}
    const a=Math.atan2(P.y-on.y,P.x-on.x)||0;P.x=on.x+Math.cos(a)*(on.r+10);P.y=on.y+Math.sin(a)*(on.r+10);followCam();msg('얇은 얼음이 깨져 얼음물에 빠졌습니다!','#9fe8ff')}}
function r110Rib(){const S0=r110S(),d=r110Day();if(S0.dy.rib===d){msg('오늘은 이미 무당 기둥에 천을 묶었습니다. 내일 다시 오세요','#a39d8f');return}
  S0.dy.rib=d;r110Buff('r110_rib','호수 무당의 축복',1800,{dmg:.05,dr:.05});rings.push({x:P.x,y:P.y,r:8,max:140,life:.9,col:'#7ad0ff'});burst(P.x,P.y,'#e8f4ff',40,170,3,30);
  msg('무당 기둥에 파란 천을 묶었습니다 · 호수 무당의 축복 30분 (피해 +5% · 받는 피해 -5%)','#7ad0ff');save()}

/* ===== 4) 구름 첨봉: 정상 · 돌무덤 · 예배당 종 · 옆바람 · 굴러오는 돌 ===== */
const r110Pk=()=>{const L=RCACHE[R110.peak];return L&&L.r110};
const r110OnTrail=()=>P.y<3750&&r110Seg(P.x,P.y,R110L.trail)<320;
function r110Summit(){const S0=r110S(),d=r110Day();if(S0.dy.sum===d){r110Once('sum0','오늘은 이미 정상에 올랐습니다. 내일 다시 오세요','#a39d8f');return false}
  S0.dy.sum=d;S0.sm++;const gold=P.lvl*400;P.gold+=gold;let it=null;for(let i=0;i<80&&!it;i++){const x=makeItem(P.lvl,true);if(x&&x.rar===2)it=x}if(!it)it=makeItem(P.lvl,true);if(it.rar>=3)it.rar=2;
  if(P.bag.length<BAG_MAX)P.bag.push(it);else loot.push({x:P.x,y:P.y,kind:'item',item:it,t:0});
  banner={t:'구름 첨봉 정상!',sub:`등반 ${S0.sm}번째 · 금화 ${gold.toLocaleString()} · ${itemName(it)}`,col:'#ffe8a0',life:3.2,max:3.2};burst(P.x,P.y,'#ffe8a0',60,220,4,30);rings.push({x:P.x,y:P.y,r:10,max:180,life:1,col:'#ffe8a0'});
  msg(`정상에 올랐습니다! 하루 한 번 등반 보상: 금화 ${gold.toLocaleString()} · ${itemName(it)}`,'#ffe8a0');save();return true}
function r110Bell(){const S0=r110S(),d=r110Day();if(S0.dy.bell===d){msg('오늘은 이미 예배당 종을 쳤습니다. 내일 다시 오세요','#a39d8f');return}
  S0.dy.bell=d;r110Buff('r110_bell','산의 축복',1800,{spd:.08,regen:.6});rings.push({x:P.x,y:P.y,r:8,max:160,life:1,col:'#ffe8a0'});for(let i=0;i<3;i++)rings.push({x:R110L.chapel.x,y:R110L.chapel.y,r:10+i*30,max:260+i*60,life:1.2,col:'#fff0c0',faint:1});
  msg('뎅— 종소리가 골짜기를 울립니다 · 산의 축복 30분 (이동 속도 +8% · 생명력 회복)','#ffe8a0');save()}
function r110PeakTick(dt){const K=r110Pk();if(!K||P.dead)return;
  for(const c of K.cairns)if(Math.hypot(P.x-c.x,P.y-c.y)<90&&R110V.last.cairn!==c.n){R110V.last.cairn=c.n;P.hp=Math.min(maxHp(),P.hp+maxHp()*.25);P.mp=Math.min(maxMp(),P.mp+maxMp()*.25);
    rise(P.x,P.y,'#ffe8a0');msg(`돌무덤 ${c.n}에 돌 하나를 얹었습니다 · 숨을 고릅니다${c.n<3?` (정상까지 ${3-c.n+1}구간)`:' (정상이 코앞!)'}`,'#d8e0c8')}
  if(Math.hypot(P.x-R110L.sum.x,P.y-R110L.sum.y)<120){if(!R110V.last.sumAt){R110V.last.sumAt=1;r110Summit()}}else R110V.last.sumAt=0;
  if(P.y>4300)R110V.last.cairn=0;
  // 위험: 산길 윗부분에서만
  const on=r110OnTrail();
  if(R110V.gust){const g=R110V.gust;g.t-=dt;if(g.t<=0&&!g.done){g.done=1;g.push=.6}if(g.push>0){g.push-=dt;if(P.invT<=0){const k=230*dt;moveBody(P,g.dx*k,g.dy*k);followCam()}if(g.push<=0)R110V.gust=null}}
  else if(on){R110V.gustT-=dt;if(R110V.gustT<=0){R110V.gustT=rnd(...R110T.gustEvery);const sd=R()<.5?1:-1;R110V.gust={t:1.2,max:1.2,dx:sd*.8,dy:-sd*.6*.5,done:0,push:0};msg('옆바람이 붑니다!','#e8f0ff')}}
  if(on){R110V.rockT-=dt;if(R110V.rockT<=0){R110V.rockT=rnd(...R110T.rockEvery);const a=R()*6.283,r=rnd(0,90);R110V.rocks.push({x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r-20,t:1.4,max:1.4,rad:72})}}
  for(const k of R110V.rocks){k.t-=dt;if(k.t<=0&&!k.done){k.done=1;burst(k.x,k.y,'#9a948a',24,160,4,8);shake=Math.max(shake,5);
    if(!P.dead&&P.invT<=0&&Math.hypot(P.x-k.x,P.y-k.y)<k.rad+P.r){const d=Math.round(maxHp()*.12);P.hp=Math.max(1,P.hp-d);ftext(P.x,P.y,'-'+d,'#d8c8a0',false,50);msg('굴러온 돌에 맞았습니다','#d8c8a0')}}}
  R110V.rocks=R110V.rocks.filter(k=>k.t>-.4)}

/* ===== 5) 대강 밀림: 뗏목 · 밤 · 독안개 ===== */
const r110Jg=()=>{const L=RCACHE[R110.jungle];return L&&L.r110};
const r110Dock=()=>{const K=r110Jg();if(!K)return null;return K.docks.find(d=>Math.hypot(P.x-d.x,P.y-d.y)<85)||null};
function r110RaftGo(from){const K=r110Jg();if(!K||R110V.ride)return false;const to=K.docks[(from.i+1)%K.docks.length],Y=R110L.riverY,pts=[[from.x,from.y],[from.x,Y(from.x)]];
  const n=Math.max(2,Math.ceil(Math.abs(to.x-from.x)/120));for(let i=1;i<=n;i++){const x=from.x+(to.x-from.x)*i/n;pts.push([x,Y(x)])}pts.push([to.x,to.y]);
  let len=0;for(let i=1;i<pts.length;i++)len+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
  R110V.ride={pts,len,u:0,to,sp:520};R110V.fish=null;msg(`뗏목을 타고 강을 따라 ${to.label}(으)로 갑니다`,'#c8e07a');return true}
function r110RaftTick(dt){const R0=R110V.ride;if(!R0)return;if(P.dead||REG.id!==R110.jungle||DG){R110V.ride=null;return}R0.u+=R0.sp*dt;let u=R0.u;
  if(u>=R0.len){const t=R0.to;P.x=t.x;P.y=t.y;R110V.ride=null;for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}followCam();msg(`${t.label}에 닿았습니다`,'#c8e07a');
    if(!NET.guest&&R()<.4){for(let i=0;i<2;i++){const e=dgMob('jg1_snake',t.x+rnd(-160,160),t.y+rnd(-160,160),Math.max(1,Math.floor(levelAt(t.x,t.y))+DIFF[P.diff].add));e.aggroed=true}msg('강물 속에서 큰뱀이 따라 올라왔습니다!','#ffb07a')}return}
  for(let i=1;i<R0.pts.length;i++){const a=R0.pts[i-1],b=R0.pts[i],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(u<=l||i===R0.pts.length-1){const k=l?Math.min(1,u/l):1;P.x=a[0]+(b[0]-a[0])*k;P.y=a[1]+(b[1]-a[1])*k;P.fx=b[0]>=a[0]?1:-1;break}u-=l}
  followCam();if(R()<dt*12)parts.push({x:P.x+rnd(-26,26),y:P.y+rnd(-14,14),z:2,vx:rnd(-20,20),vy:rnd(-20,20),vz:20,life:.5,max:.5,col:'#d8c8a0',sz:2})}
// 첨탑 광장: 몬스터가 나오지 않는 안전한 광장 (왕도 아르덴과 같음)
{const _se=spawnEnemy;spawnEnemy=function(){if(!DG&&REG.id===R110.sq)return;return _se.apply(this,arguments)}}
// 밤 몬스터: 밤에는 재규어 · 석상 대신 반딧불 혼령 · 박쥐왕
{const _se=spawnEnemy;spawnEnemy=function(){if(DG||REG.id!==R110.jungle||!r110Night())return _se.apply(this,arguments);const m=REG.mobs;REG.mobs=['jg1_snake','jg1_firefly','jg1_frog','jg1_bat'];try{return _se.apply(this,arguments)}finally{REG.mobs=m}}}
function r110FogTick(dt){let on=false;for(const f of R110L.fogs)if(Math.hypot(P.x-f[0],P.y-f[1])<f[2]){on=true;break}
  if(!on){R110V.fogT=Math.max(0,R110V.fogT-dt*2);return}R110V.fogT+=dt;if(R110V.fogT<2||P.invT>0)return;
  const d=maxHp()*.02*dt;if(P.hp-d>maxHp()*.1){P.hp-=d;if(R()<dt*2)ftext(P.x,P.y-20,'콜록','#9aff6a',false,40)}r110Once('fog','독안개에 숨이 막힙니다. 늪을 벗어나세요','#9aff6a')}

/* ===== 6) 오로라 빙관: 오로라 · 정령 · 추위 · 모닥불 ===== */
const r110Au=()=>{const L=RCACHE[R110.aurora];return L&&L.r110};
function r110Warm(){const K=r110Au();if(!K)return true;const T=TOWNS[0];if(T&&Math.hypot(P.x-T.x,P.y-T.y)<tSafe(T)+40)return true;return K.fires.some(f=>Math.hypot(P.x-f.x,P.y-f.y)<R110T.fireR)}
function r110AuroraTick(dt){const on=r110Aurora();
  if(R110V.prevA!==on){if(R110V.prevA!=null){if(on){banner={t:'오로라가 피었습니다',sub:'빛의 정령이 내려옵니다 · 사냥 경험치 +25%',col:'#9affd0',life:3,max:3};msg('하늘에 오로라가 피었습니다! 오로라 정령을 찾아보세요 (경험치 +25%)','#9affd0')}
      else{msg('오로라가 잦아들었습니다','#a8c0d0');if(!NET.guest){for(const e of enemies)if(e.k==='au1_spirit'&&!e.dead)burst(e.x,e.y,'#9affd0',16,120,3,20);enemies=enemies.filter(e=>e.k!=='au1_spirit')}}}R110V.prevA=on}
  if(on&&!NET.guest){R110V.spT-=dt;if(R110V.spT<=0){R110V.spT=3.5;if(enemies.filter(e=>e.k==='au1_spirit'&&!e.dead).length<6){for(let k=0;k<10;k++){const a=R()*6.283,r=rnd(420,760),x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;if(x<80||y<80||x>WORLD-80||y>WORLD-80||blockedAt(x,y)||inSafe(x,y,0))continue;
      const e=dgMob('au1_spirit',x,y,Math.max(1,Math.floor(zoneLevel(x,y))+DIFF[P.diff].add));e.r110s=1;rings.push({x,y,r:4,max:60,life:.6,col:'#9affd0'});break}}}}
  // 정령은 천천히 떠다닌다(싸우지 않음)
  if(!NET.guest)for(const e of enemies)if(e.k==='au1_spirit'&&!e.dead){e.atkCd=99;e.aggroed=false;const a=time*.4+(e.anim||0);moveBody(e,Math.cos(a)*18*dt,Math.sin(a*1.3)*12*dt)}
  // 추위
  if(P.dead)return;const warm=r110Warm();R110V.cold=clamp(R110V.cold+(warm?-R110T.coldDown:R110T.coldUp)*dt,0,100);
  if(R110V.cold>=100){if(!P.buffs.r110_cold)msg('몸이 얼어붙었습니다! 모닥불이나 마을 곁에서 녹이세요','#9fd0ff');r110Buff('r110_cold','꽁꽁 얼어붙음',1,{spd:-.25});
    if(P.invT<=0){const d=maxHp()*.015*dt;if(P.hp-d>maxHp()*.15)P.hp-=d}}
  else if(R110V.cold>=70)r110Once('cold70','몸이 점점 식어 갑니다. 모닥불을 찾으세요','#9fd0ff')}
{const _gx=gainXp;gainXp=function(n){if(r110In(R110.aurora)&&r110Aurora()&&n>0)n=Math.round(n*1.25);return _gx.call(this,n)}}

/* ===== 7) 도감 · 오로라 조각 · 업적 ===== */
const R110_DEX={jg1_firefly:'반딧불 혼령 (밤의 밀림)',jg1_bat:'밤그늘 박쥐왕 (밤의 밀림)',au1_spirit:'오로라 정령 (오로라 빙관)',lk1_giant:'유리얼음 거인',pk1_golem:'빙하 거석 골렘',jg1_idol:'덩굴 감긴 황금 석상',au1_whale:'얼음 고래 망령',
  b_lk1_seal:'호수 밑 물범 신령 누르간',b_pk1_roc:'바람뱀 카즈라',b_jg1_croc:'카이만 우루',b_au1_whale:'고래 오로르',b_ct_tsar:'첨탑의 주인 바실리온'};
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&e&&R110_DEX[e.k]){const S0=r110S();if(!S0.d[e.k]){S0.d[e.k]=r110Day();msg(`도감에 새로: ${R110_DEX[e.k]}`,'#c8e0ff')}}
  if(P&&e&&e.k==='au1_spirit'){const S0=r110S();S0.au++;ftext(e.x,e.y-20,'오로라 조각 +1','#9affd0',true,70)}}catch(err){if(window.__QA)throw err}return r}}
const R110_AUX=[{n:15,k:'item',t:'희귀 장비 한 점'},{n:40,k:'uniq',t:'유니크 이상 장비 한 점(드묾: 상급 유니크)'}];
V20A.r110ax=n=>{const X=R110_AUX.find(x=>x.n===(n|0)),S0=r110S();if(!X||S0.au<X.n)return;S0.au-=X.n;let it=null;
  if(X.k==='item'){for(let i=0;i<80&&!it;i++){const x=makeItem(P.lvl,true);if(x&&x.rar===2)it=x}if(!it)it=makeItem(P.lvl,true);if(it.rar>=3)it.rar=2}
  else{for(let i=0;i<400&&!it;i++){const x=makeItem(P.lvl+2,true);if(x&&x.rar>=3)it=x}if(!it){it=makeItem(P.lvl+2,true)}}
  if(P.bag.length<BAG_MAX)P.bag.push(it);else loot.push({x:P.x,y:P.y,kind:'item',item:it,t:0});msg(`오로라 조각 ${X.n}개를 바꿨습니다: ${itemName(it)}`,'#9affd0');save()};
function r110PanelHtml(){const S0=r110S(),nv=Object.keys(S0.v).length;let h=`<div class="v20box"><h3>풍경 기록 <b style="color:#ffe8a0">${nv}/${R110_VIEWS.length}</b> <span class="muted">· 110레벨 이후 새 땅의 경치 좋은 자리에 가까이 가면 기록됩니다</span></h3>`;
  for(const id of R110.ids){const vs=R110_VIEWS.filter(v=>v.reg===id);if(!vs.length)continue;h+=`<div class="v20row"><div style="flex-basis:100%"><b>${REGIONS[id].n}</b></div>`;
    for(const v of vs){const ok=!!S0.v[v.id];h+=`<div style="flex:1 1 220px;opacity:${ok?1:.6}"><b style="color:${ok?'#ffe8a0':'#a39d8f'}">${ok?'✔ ':''}${v.n}</b> <span class="muted" style="font-size:12px">${ok?v.d:v.need==='night'?'밤에만':v.need==='aurora'?'오로라가 필 때만':v.need==='sum'?'정상 깃발 곁':'아직 못 봄'}</span></div>`}h+='</div>'}
  h+='</div>';const nf=R110_FISH.filter(f=>S0.f[f.id]).length;
  h+=`<div class="v20box"><h3>호수 물고기 <b style="color:#cfefff">${nf}/${R110_FISH.length}</b> <span class="muted">· 낚은 수 ${S0.fn}</span></h3><div class="v20row">`;
  for(const f of R110_FISH){const n=S0.f[f.id]|0;h+=`<div style="flex:1 1 180px;opacity:${n?1:.55}"><b style="color:${n?'#cfefff':'#a39d8f'}">${n?f.n:'???'}</b> <span class="muted" style="font-size:12px">${n?`${n}마리${f.b?' · '+f.b[0]:''}${f.item?' · 장비':''}`:''}</span></div>`}h+='</div></div>';
  const nd=Object.keys(R110_DEX).filter(k=>S0.d[k]).length;h+=`<div class="v20box"><h3>새 땅 생물 · 주인 <b style="color:#c8e0ff">${nd}/${Object.keys(R110_DEX).length}</b></h3><div class="v20row">`;
  for(const k in R110_DEX){const ok=!!S0.d[k];h+=`<div style="flex:1 1 200px;opacity:${ok?1:.55}"><b style="color:${ok?'#c8e0ff':'#a39d8f'}">${ok?R110_DEX[k]:'???'}</b></div>`}h+='</div></div>';
  h+=`<div class="v20box"><h3>오로라 조각 <b style="color:#9affd0">${S0.au}</b> <span class="muted">· 오로라 빙관에 오로라가 필 때 오로라 정령을 잡으면 나옵니다</span></h3>`;
  for(const X of R110_AUX)h+=`<div class="v20row"><div>${X.n}개 → ${X.t}</div><div class="btns">${v20Btn('r110ax',String(X.n),'바꾸기',{dis:S0.au<X.n})}</div></div>`;
  h+=`<p class="muted" style="margin:6px 0 0">구름 첨봉 정상 등반 ${S0.sm}번 · 오늘: 정상 ${S0.dy.sum===r110Day()?'✔':'—'} · 무당 기둥 ${S0.dy.rib===r110Day()?'✔':'—'} · 예배당 종 ${S0.dy.bell===r110Day()?'✔':'—'}${S0.cath?` · 바실리온 처치 ${S0.cath}번`:''}</p></div>`;return h}
if(typeof G42==='object'&&Array.isArray(G42.tabs))G42.tabs.push({k:'r110',n:'풍경 · 도감',html:r110PanelHtml});
if(typeof G42==='object'&&Array.isArray(G42.ach)){const add=(id,n,d,need,cur,pts)=>G42.ach.push({id,n,d,need,cur,grp:'새 땅',pts:pts||10});const S1=()=>r110S();
  add('r110v10','풍경을 모으는 자','풍경 기록 10곳',10,()=>Object.keys(S1().v).length,10);add('r110v22','세상의 화가','풍경 기록 22곳 모두',22,()=>Object.keys(S1().v).length,30);
  add('r110f8','호수의 낚시꾼','호수 물고기 8종 모두 낚기',8,()=>R110_FISH.filter(f=>S1().f[f.id]).length,20);add('r110sm10','구름을 밟은 자','구름 첨봉 정상 10번 오르기',10,()=>S1().sm,20);
  add('r110au','오로라를 모은 자','오로라 정령 50마리',50,()=>S1().auT|0,10);add('r110cath','첨탑의 주인을 넘어선 자','아홉 첨탑 대성당의 주인 쓰러뜨리기',1,()=>S1().cath,30)}
// 오로라 조각은 써도 업적 수가 줄지 않게 누적 수를 따로 센다
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&e&&e.k==='au1_spirit'){const S0=r110S();S0.auT=(S0.auT|0)+1}}catch(err){if(window.__QA)throw err}return r}}

/* ===== 8) 할 일(F) ===== */
function r110Act(){if(DG||IN||P.dead||act)return;
  if(R110V.ride){act=null;return}
  if(REG.id===R110.lake){if(R110V.fish&&R110V.fish.st==='bite'){act='r110_catch';return}const h=r110Hole();if(h&&!R110V.fish){act='r110_fish';R110V.act=h;return}
    const L=RCACHE[R110.lake],K=L&&L.r110;if(K&&dist(P,K.pole)<95){act='r110_rib';return}}
  else if(REG.id===R110.peak){if(Math.hypot(P.x-R110L.chapel.x,P.y-(R110L.chapel.y+40))<110){act='r110_bell';return}}
  else if(REG.id===R110.jungle){const d=r110Dock();if(d){act='r110_raft';R110V.act=d;return}}}
{const _tl=twActLabel;twActLabel=function(a){if(a==='r110_fish')return '얼음 낚시 (F)';if(a==='r110_catch')return '입질! 지금 당기기 (F)';if(a==='r110_rib')return '무당 기둥에 천 묶기 · 하루 한 번 (F)';
  if(a==='r110_bell')return '예배당 종 치기 · 하루 한 번 (F)';if(a==='r110_raft'&&R110V.act){const K=r110Jg();return `뗏목 타기 → ${K?K.docks[(R110V.act.i+1)%K.docks.length].label:''} (F)`}return _tl.apply(this,arguments)}}
{const _da=doAct;doAct=function(){if(act==='r110_fish'&&R110V.act){r110FishStart(R110V.act);return}if(act==='r110_catch'){r110FishCatch();return}if(act==='r110_rib'){r110Rib();return}
  if(act==='r110_bell'){r110Bell();return}if(act==='r110_raft'&&R110V.act){r110RaftGo(R110V.act);return}return _da.apply(this,arguments)}}

/* ===== 9) 매 프레임 ===== */
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(!P||paused)return r;try{r110Tick(dt)}catch(e){if(window.__QA)throw e}return r}}
function r110Tick(dt){if(DG||IN){R110V.fish=null;R110V.ride=null;return}const id=REG.id;
  if(id===R110.lake){r110FishTick(dt);r110IceTick(dt)}else{R110V.fish=null;R110V.ice=null}
  if(id===R110.peak)r110PeakTick(dt);else{R110V.gust=null;R110V.rocks.length=0}
  if(id===R110.jungle){r110RaftTick(dt);r110FogTick(dt);const n=r110Night();if(R110V.prevN!==n){if(R110V.prevN!=null)banner=n?{t:'밀림에 밤이 내렸습니다',sub:'반딧불 혼령과 박쥐왕이 깨어납니다',col:'#c8ff6a',life:2.6,max:2.6}:{t:'밀림에 아침이 밝았습니다',sub:'낮 짐승들이 돌아옵니다',col:'#ffe8a0',life:2.2,max:2.2};R110V.prevN=n}}
  else{R110V.ride=null;R110V.prevN=null}
  if(id===R110.aurora)r110AuroraTick(dt);else{R110V.cold=Math.max(0,R110V.cold-30*dt);R110V.prevA=null}
  if(R110.ids.includes(id))r110ViewTick();
  r110Act()}

/* ===== 10) 그림 ===== */
// 땅 위 납작한 것(호수 얼음판 · 얇은 얼음 · 낚시 구멍 · 물고기 그림자 · 독안개 늪 바닥 · 굴러올 돌 그림자)
{const _ddf=drawDecalsFields;drawDecalsFields=function(){_ddf.apply(this,arguments);if(DG||IN)return;try{
  if(REG.id===R110.lake)r110DrawLake();else if(REG.id===R110.jungle)r110DrawFogFloor();
  if(REG.id===R110.peak&&R110V.rocks.length)for(const k of R110V.rocks){const u=1-Math.max(0,k.t)/k.max;ctx.globalAlpha=.25+.35*u;ctx.fillStyle='#1a1410';ctx.beginPath();ctx.ellipse(k.x,k.y,k.rad*(.4+.6*u),k.rad*(.4+.6*u),0,0,6.283);ctx.fill();ctx.globalAlpha=.6;ctx.strokeStyle='#ffd08a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(k.x,k.y,k.rad,0,6.283);ctx.stroke();ctx.globalAlpha=1}
  }catch(e){if(window.__QA)throw e}}}
function r110DrawLake(){const L=RCACHE[R110.lake],Q=L&&L.r110;if(!Q)return;const K=R110L.lake,I=R110L.isle;
  ctx.save();ctx.beginPath();ctx.ellipse(K.cx,K.cy,K.rx,K.ry,0,0,6.283);ctx.moveTo(I.x+I.r,I.y);ctx.ellipse(I.x,I.y,I.r,I.r*.92,0,0,6.283,true);
  const gr=ctx.createRadialGradient(K.cx-300,K.cy-200,100,K.cx,K.cy,K.rx);gr.addColorStop(0,'rgba(96,170,214,.86)');gr.addColorStop(.7,'rgba(120,186,222,.84)');gr.addColorStop(.95,'rgba(176,214,236,.7)');gr.addColorStop(1,'rgba(220,236,246,.35)');
  ctx.fillStyle=gr;ctx.fill('evenodd');ctx.clip('evenodd');
  // 얼음 밑 물고기 그림자
  ctx.fillStyle='rgba(20,46,70,.32)';for(const f of Q.fish){const a=f.a+time*f.sp,x=K.cx+Math.cos(a)*K.rx*f.r,y=K.cy+Math.sin(a)*K.ry*f.r;for(let i=0;i<5;i++){const b=a-i*.012*Math.sign(f.sp),X=K.cx+Math.cos(b)*K.rx*f.r+Math.sin(time*2+f.ph+i)*6,Y=K.cy+Math.sin(b)*K.ry*f.r;ctx.beginPath();ctx.ellipse(X,Y,9*f.k,3.6*f.k,b+1.57,0,6.283);ctx.fill()}void x;void y}
  // 금 · 반짝임
  const cs=W2S(P.x,P.y);ctx.strokeStyle='rgba(235,248,255,.42)';ctx.lineWidth=1.6;ctx.beginPath();for(const c of Q.cr){const s=W2S(c[0][0],c[0][1]);if(Math.abs(s.x-cs.x)>W||Math.abs(s.y-cs.y)>H)continue;ctx.moveTo(c[0][0],c[0][1]);for(let i=1;i<c.length;i++)ctx.lineTo(c[i][0],c[i][1])}ctx.stroke();
  ctx.globalCompositeOperation='lighter';for(let i=0;i<24;i++){const a=i*2.4+Math.floor(time*.5+i)*.7,r=.15+((i*37)%80)/100,x=K.cx+Math.cos(a)*K.rx*r,y=K.cy+Math.sin(a)*K.ry*r,k=Math.max(0,Math.sin(time*1.6+i));if(k<.2)continue;ctx.globalAlpha=k*.5;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(x,y,14*k,2.6,.6,0,6.283);ctx.fill()}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.restore();
  // 얇은 얼음 · 깨진 자리
  for(const p of Q.thin){const brk=time-p.brk<30,me=R110V.ice===p?R110V.iceT/R110T.iceBreak:0;
    ctx.globalAlpha=brk?.92:.5+me*.3;ctx.fillStyle=brk?'#1a4a6a':'#3a7aa8';ctx.beginPath();ctx.ellipse(p.x,p.y,p.r,p.r*.94,0,0,6.283);ctx.fill();
    ctx.globalAlpha=brk?.5:.75;ctx.strokeStyle=brk?'#cfefff':'rgba(230,246,255,.9)';ctx.lineWidth=brk?3:1.4;ctx.beginPath();
    if(brk){ctx.ellipse(p.x,p.y,p.r,p.r*.94,0,0,6.283)}else for(let i=0;i<7;i++){const a=i*.9+p.i,l=p.r*(.5+.4*((i*13+p.i)%5)/5)*(1+me*.3);ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+Math.cos(a)*l,p.y+Math.sin(a)*l)}ctx.stroke();ctx.globalAlpha=1}
  // 낚시 구멍
  for(const h of Q.holes){const cd=time-(R110V.hole[h.i]||-99)<25;ctx.fillStyle=cd?'#6a9ab8':'#0e2a40';ctx.beginPath();ctx.ellipse(h.x,h.y,30,28,0,0,6.283);ctx.fill();ctx.strokeStyle='#e8f6ff';ctx.lineWidth=5;ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<6;i++){const a=i*1.05;ctx.beginPath();ctx.arc(h.x+Math.cos(a)*38,h.y+Math.sin(a)*36,4,0,6.283);ctx.fill()}
    const F=R110V.fish;if(F&&F.h===h){const bob=F.st==='bite'?Math.sin(time*30)*5:Math.sin(time*3)*1.5;ctx.fillStyle='#ff5a3a';ctx.beginPath();ctx.arc(h.x+4,h.y+bob,5,0,6.283);ctx.fill();if(F.st==='bite'){ctx.strokeStyle='rgba(255,230,120,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.x+4,h.y,14+Math.sin(time*20)*4,0,6.283);ctx.stroke()}}}}
function r110DrawFogFloor(){for(const f of R110L.fogs){const gr=ctx.createRadialGradient(f[0],f[1],10,f[0],f[1],f[2]);gr.addColorStop(0,'rgba(60,90,30,.55)');gr.addColorStop(.7,'rgba(70,100,40,.35)');gr.addColorStop(1,'rgba(70,100,40,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(f[0],f[1],f[2],0,6.283);ctx.fill()}}
// 장식 그림 (r110 종류)
const r110Spr={
  pole:sm=>SC.get('r110/pole'+(sm?'s':''),40,sm?70:120,20,sm?66:116,g=>{g.translate(20,sm?66:116);const h=sm?58:108;
    Kit.solid(g,q=>q.rect(-3,-h,6,h),-3,-h,3,0,'#6a5038',{lineW:.5,tex:'wood',texA:.5});
    const cols=['#3a7ae0','#e8e8e8','#e0503a','#3ab070','#e0b030'];for(let i=0;i<(sm?3:6);i++){const y=-h+10+i*(sm?14:15),c=cols[i%cols.length];g.fillStyle=c;g.beginPath();g.moveTo(2,y);g.quadraticCurveTo(12,y+4,16,y+12+i%2*4);g.lineTo(10,y+10);g.quadraticCurveTo(6,y+6,2,y+6);g.fill()}
    if(!sm){Kit.solid(g,q=>q.ellipse(0,-h,6,3,0,0,6.283),-6,-h-3,6,-h+3,'#8a6a48',{lineW:.4})}},{scale:2}),
  tent:()=>SC.get('r110/tent',70,60,35,52,g=>{g.translate(35,52);Kit.solid(g,q=>{q.moveTo(-26,0);q.lineTo(0,-38);q.lineTo(26,0);q.closePath()},-26,-38,26,0,'#8a6a4a',{tex:'cloth',texA:.5,rim:'rgba(255,240,220,.6)'});
    g.fillStyle='#2a1a10';g.beginPath();g.moveTo(-6,0);g.lineTo(0,-16);g.lineTo(6,0);g.fill();g.strokeStyle='#e8f4ff';g.lineWidth=2;g.beginPath();g.moveTo(-24,-2);g.lineTo(0,-36);g.lineTo(24,-2);g.stroke()},{scale:2}),
  cairn:()=>SC.get('r110/cairn',60,70,30,62,g=>{g.translate(30,62);const st=[[0,-6,20,8],[2,-17,16,7],[-1,-27,12,6],[1,-36,9,5],[0,-43,6,4]];for(const [x,y,rx,ry] of st)Kit.solid(g,q=>q.ellipse(x,y,rx,ry,0,0,6.283),x-rx,y-ry,x+rx,y+ry,'#8a8478',{tex:'stone',texA:.6,rim:'rgba(255,255,255,.6)'});
    g.fillStyle='#e04a3a';g.beginPath();g.moveTo(1,-47);g.lineTo(1,-62);g.lineTo(14,-57);g.lineTo(1,-52);g.fill()},{scale:2}),
  flag:()=>SC.get('r110/flag',90,150,30,140,g=>{g.translate(30,140);for(const [x,y,rx,ry] of [[0,-6,26,10],[10,-18,18,8]])Kit.solid(g,q=>q.ellipse(x,y,rx,ry,0,0,6.283),x-rx,y-ry,x+rx,y+ry,'#c8ccd4',{tex:'stone',texA:.5});
    Kit.solid(g,q=>q.rect(-2,-128,4,120),-2,-128,2,-8,'#5a4a3a',{lineW:.4});Kit.solid(g,q=>{q.moveTo(2,-126);q.quadraticCurveTo(28,-130,52,-118);q.quadraticCurveTo(30,-108,2,-98);q.closePath()},2,-130,52,-98,'#c83a2a',{tex:'cloth',texA:.4,rim:'rgba(255,220,200,.8)'});
    g.fillStyle='#ffe8a0';g.beginPath();g.arc(20,-114,5,0,6.283);g.fill()},{scale:2}),
  chapel:()=>SC.get('r110/chapel',200,230,100,200,g=>{g.translate(100,200);const st={tex:'stone',texA:.7,rim:'rgba(255,240,210,.6)'};
    // 돌담 · 몸채 · 둥근 지붕 탑 (산 위 작은 돌 예배당)
    Kit.solid(g,q=>{q.moveTo(-92,0);q.lineTo(-92,-22);q.lineTo(92,-22);q.lineTo(92,0);q.closePath()},-92,-22,92,0,'#8a7e6a',st);
    Kit.solid(g,q=>{q.moveTo(-56,-16);q.lineTo(-56,-80);q.lineTo(0,-104);q.lineTo(56,-80);q.lineTo(56,-16);q.closePath()},-56,-104,56,-16,'#a8987a',st);
    Kit.solid(g,q=>{q.moveTo(-60,-78);q.lineTo(0,-108);q.lineTo(60,-78);q.lineTo(54,-74);q.lineTo(0,-100);q.lineTo(-54,-74);q.closePath()},-60,-108,60,-74,'#6a6458',{lineW:.5});
    Kit.solid(g,q=>q.rect(-20,-150,40,52),-20,-150,20,-98,'#a8987a',st);Kit.solid(g,q=>{q.moveTo(-24,-148);q.lineTo(0,-182);q.lineTo(24,-148);q.closePath()},-24,-182,24,-148,'#6a6458',{lineW:.5});
    g.fillStyle='#2a2018';g.beginPath();g.moveTo(-12,-16);g.lineTo(-12,-46);g.quadraticCurveTo(0,-58,12,-46);g.lineTo(12,-16);g.fill();for(const x of [-36,36]){g.beginPath();g.moveTo(x-5,-52);g.lineTo(x-5,-66);g.quadraticCurveTo(x,-72,x+5,-66);g.lineTo(x+5,-52);g.fill()}
    g.fillStyle='#ffd88a';g.beginPath();g.moveTo(-6,-128);g.lineTo(-6,-140);g.quadraticCurveTo(0,-146,6,-140);g.lineTo(6,-128);g.fill();
    Kit.solid(g,q=>q.rect(-1.6,-198,3.2,18),-1.6,-198,1.6,-180,'#c8b070');Kit.solid(g,q=>q.rect(-6,-192,12,3),-6,-192,6,-189,'#c8b070')},{scale:2}),
  dock:()=>SC.get('r110/dock',150,90,75,60,g=>{g.translate(75,60);for(let i=0;i<7;i++){const y=-22+i*7;Kit.solid(g,q=>q.rect(-56,y,112,6),-56,y,56,y+6,i%2?'#7a5a3a':'#6a4a2e',{lineW:.3,tex:'wood',texA:.5})}
    for(const x of [-54,54])Kit.solid(g,q=>q.rect(x-3,-34,6,40),x-3,-34,x+3,6,'#4a3220',{lineW:.4});
    Kit.solid(g,q=>{q.moveTo(-40,18);q.lineTo(40,18);q.lineTo(34,30);q.lineTo(-34,30);q.closePath()},-40,18,40,30,'#8a6a3a',{tex:'wood',texA:.6,rim:'rgba(255,230,190,.5)'});
    g.strokeStyle='#3a2a1a';g.lineWidth=2;for(let x=-30;x<=30;x+=10){g.beginPath();g.moveTo(x,19);g.lineTo(x-2,29);g.stroke()}},{scale:2}),
  fire:()=>SC.get('r110/fire',70,50,35,40,g=>{g.translate(35,40);for(let i=0;i<8;i++){const a=i/8*6.283;Kit.solid(g,q=>q.ellipse(Math.cos(a)*18,Math.sin(a)*8,6,4,0,0,6.283),-24,-12,24,12,'#7a7a80',{tex:'stone',texA:.5})}
    for(const r of [-.45,.45]){g.save();g.rotate(r);Kit.solid(g,q=>q.rect(-16,-3,32,6),-16,-3,16,3,'#4a3020',{lineW:.4,tex:'wood',texA:.5});g.restore()}},{scale:2}),
  view:()=>SC.get('r110/view',50,80,25,74,g=>{g.translate(25,74);Kit.solid(g,q=>q.rect(-2,-60,4,60),-2,-60,2,0,'#6a5038',{tex:'wood',texA:.5});
    Kit.solid(g,q=>q.rect(-18,-72,36,26),-18,-72,18,-46,'#e8dcc0',{rim:'rgba(255,255,255,.8)',lineW:.6});g.strokeStyle='#8a6a3a';g.lineWidth=2;g.strokeRect(-18,-72,36,26);
    g.strokeStyle='#5a8ab0';g.lineWidth=1.6;g.beginPath();g.moveTo(-14,-52);g.lineTo(-6,-62);g.lineTo(0,-56);g.lineTo(8,-66);g.lineTo(15,-52);g.stroke();g.fillStyle='#e0a040';g.beginPath();g.arc(9,-66,2.5,0,6.283);g.fill()},{scale:2})};
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.k!=='r110')return _rd.apply(this,arguments);const s=d._s;if(!s)return true;let e=null;
  if(d.t==='pole')e=r110Spr.pole(d.small);else if(r110Spr[d.t])e=r110Spr[d.t]();
  if(d.t==='view'){const ok=!!r110S().v[d.vw.id];ctx.globalAlpha=ok?.55:1;if(e)SC.draw(ctx,e,s.x,s.y);ctx.globalAlpha=1;
    if(!ok){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4+.2*Math.sin(time*3);glow(s.x,s.y-60,22,'#ffe8a0');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
    if(dist(P,d)<300)r110Name(s,d.vw.n,ok?'#a39d8f':'#ffe8a0',84);return true}
  if(e)SC.draw(ctx,e,s.x,s.y);
  if(d.t==='fire'){ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const k=1+Math.sin(time*9+i*2)*.15;ctx.globalAlpha=.7-i*.18;ctx.fillStyle=['#ffe08a','#ff9a3a','#ff5a2a'][i];ctx.beginPath();ctx.moveTo(s.x-10*k+i*3,s.y-4);ctx.quadraticCurveTo(s.x,s.y-46*k+i*8,s.x+10*k-i*3,s.y-4);ctx.fill()}
    ctx.globalAlpha=.35;glow(s.x,s.y-16,60,'#ff9a3a');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';if(dist(P,d)<260)r110Name(s,'모닥불',R110V.cold>0?'#ffb07a':'#d8c8b0',50)}
  else if(d.label&&dist(P,d)<360)r110Name(s,d.label,d.t==='flag'?'#ffe8a0':'#e8e0d0',d.t==='chapel'?205:d.t==='flag'?150:d.t==='dock'?50:d.t==='pole'?125:72);
  return true}}
function r110Name(s,t,c,h){ctx.font=`600 13px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(t,s.x,s.y-h);ctx.fillStyle=c;ctx.fillText(t,s.x,s.y-h)}
// 하늘 · 밤 · 바람 · 추위 (화면 위에)
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);if(DG||IN)return;try{const o=ctx.globalCompositeOperation;
  if(REG.id===R110.aurora&&r110Aurora())r110DrawAurora();
  if(REG.id===R110.jungle&&r110Night()){S();ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.2;ctx.fillStyle='#06101e';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;
    ctx.globalCompositeOperation='lighter';for(let i=0;i<40;i++){const x=((i*173+time*(10+i%7))%(W+80))-40,y=((i*97+Math.sin(time+i)*40)%(H+40))-20,k=.5+.5*Math.sin(time*3+i*1.7);ctx.globalAlpha=k*.8;glow(x,y,6,'#d8ff7a')}ctx.globalAlpha=1}
  if(REG.id===R110.jungle&&R110V.fogT>0){S();ctx.globalCompositeOperation='source-over';ctx.globalAlpha=Math.min(.28,R110V.fogT*.08);ctx.fillStyle='#5a8a2a';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
  if(REG.id===R110.peak&&R110V.gust&&!R110V.gust.done){S();ctx.globalCompositeOperation='lighter';const g=R110V.gust,u=1-g.t/g.max;ctx.strokeStyle='rgba(240,248,255,.55)';ctx.lineWidth=2;
    for(let i=0;i<18;i++){const y=(i*53)%H,x0=((time*900*(g.dx>0?1:-1)+i*211)%(W+300)+W+300)%(W+300)-150;ctx.globalAlpha=.2+.5*u;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0+(g.dx>0?-120:120),y+8);ctx.stroke()}ctx.globalAlpha=1}
  if(REG.id===R110.aurora&&R110V.cold>0){S();ctx.globalCompositeOperation='source-over';const c=R110V.cold/100;if(c>.6){ctx.globalAlpha=(c-.6)*.6;const gr=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.7);gr.addColorStop(0,'rgba(180,220,255,0)');gr.addColorStop(1,'rgba(200,235,255,.9)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
    if(c>.15&&P._s){const s=P._s,w=46;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(s.x-w/2,s.y-82,w,6);ctx.fillStyle=c>=1?'#e8f4ff':'#7ab8ff';ctx.fillRect(s.x-w/2+1,s.y-81,(w-2)*c,4);ctx.font=`600 11px ${FONT}`;ctx.textAlign='center';ctx.fillStyle='#cfe8ff';ctx.fillText('추위',s.x,s.y-86)}}
  ctx.globalCompositeOperation=o}catch(e){if(window.__QA)throw e}}}
function r110DrawAurora(){S();const o=ctx.globalCompositeOperation;ctx.globalCompositeOperation='lighter';const t=time*.25;
  for(let b=0;b<3;b++){const base=H*(.08+b*.07),amp=H*.05,col=['rgba(90,255,180,','rgba(150,110,255,','rgba(110,230,255,'][b];
    for(let x=-20;x<W+20;x+=14){const y=base+Math.sin(x/170+t*2+b)*amp+Math.sin(x/61-t*3)*amp*.3,h=H*(.16+.06*Math.sin(x/90+t+b*2));const gr=ctx.createLinearGradient(0,y,0,y+h);
      gr.addColorStop(0,col+'0)');gr.addColorStop(.3,col+(.16+.08*Math.sin(x/40+t*5))+')');gr.addColorStop(1,col+'0)');ctx.fillStyle=gr;ctx.fillRect(x,y,15,h)}}
  ctx.globalCompositeOperation=o}
for(const id of R110.ids)delete TERR[id];

// 바위 언덕(terrain.js): 호수 얼음판 · 산길 · 새 물건(나루 · 모닥불 · 풍경 자리 …) 둘레에는 세우지 않고, 얼음판 위에 다시 놓인 나무는 걷는다
{const _tg=terrGrid;terrGrid=function(id){const w=_tg.apply(this,arguments);try{if(w&&R110.ids.includes(id))r110TerrFix(id,w)}catch(e){if(window.__QA)throw e}return w}}
function r110TerrFix(id,w){const L=RCACHE[id];if(!L)return;const K=R110L.lake,mine=L.decor.filter(d=>d.k==='r110');
  for(let j=0;j<TNC;j++)for(let i=0;i<TNC;i++){const k=terrIdx(i,j);if(!w[k])continue;const x=(i+.5)*TCS,y=(j+.5)*TCS;
    if(id===R110.lake&&((x-K.cx)/(K.rx+180))**2+((y-K.cy)/(K.ry+180))**2<1||id===R110.peak&&r110Seg(x,y,R110L.trail)<220||mine.some(d=>Math.abs(d.x-x)<170&&Math.abs(d.y-y)<170))w[k]=0}}
{const _tb=terrBuild;terrBuild=function(id){const T=_tb.apply(this,arguments);try{if(id===R110.lake){const L=RCACHE[id],K=R110L.lake,I=R110L.isle;
  r110Clear(L,d=>((d.x-K.cx)/(K.rx+30))**2+((d.y-K.cy)/(K.ry+30))**2<1&&Math.hypot(d.x-I.x,d.y-I.y)>I.r+20&&!(d.k==='iceboulder'&&hash(d.x|0,d.y|0)<.1))}}catch(e){if(window.__QA)throw e}return T}}
r110Post();
setTimeout(()=>{if(window.__game)Object.assign(window.__game,{R110V,R110L,R110_VIEWS,R110_FISH,r110S,r110Clean,r110FishCatch,r110RaftGo,r110Summit})},0);
