/* ---------- v22: 마법 사거리 · 보스 맞는 크기 ----------
   · 사거리(R22.cap): 투사체·연쇄 번개·광선·한 적을 노리는 마법은 화면 절반쯤(480)까지만 닿는다.
     몬스터가 나를 알아차리는 거리(들판 몬스터 보통 360~470)와 비슷하다. 예전엔 투사체가 1000~1500, 연쇄 번개는 화면 어디든 닿았다.
     궁수의 화살은 조금 더(540) — 「먼 시야」 패시브는 그 위에 더하기로만 붙는다(+400×값, 최대 +120).
     땅에 까는 범위 마법(지대·비·낙하)은 예전 그대로(가운데 520~560까지). 가운데를 제한하지 않던 3차 마법만 560으로 맞춘다.
   · 투사체: 날아간 거리(처음 나온 자리에서)가 사거리를 넘으면 사라진다. 휘어 쫓는 화살·유도 미사일도 같다.
   · 연쇄 번개: 첫 대상은 사거리 안에서만 고른다. 그다음 튀는 거리는 그대로.
   · 광선·물벽·돌격·던지기의 길이(len·range)는 eff()에서 사거리로 줄인다(툴팁 숫자도 같이 줄어듦).
   · 자동 겨누기(키보드·터치 단축칸): 사거리 안의 가장 가까운 적만.
   · 맞는 크기 hR(e): 내 공격(투사체·광선·연쇄·범위 끝)만 쓰는 반지름. 그림의 몸 반폭(크기 배율 sc 포함)과 e.r 중 큰 값.
     몬스터의 움직임·몸 부딪힘·몬스터의 공격 거리·한 방 상한·알아차리는 거리는 e.r 그대로.
   · 겨눈 곳이 몬스터 몸(그림) 위면 그 몬스터 발밑을 겨눈다(aimAt) — 키 큰 보스의 가슴을 눌러도 땅의 뒤쪽이 아니라 보스를 쏜다.
     이동 기술(순간 이동·도약·돌진 …)은 원래 누른 자리 그대로. */
const R22={cap:480,arc:540,gnd:560,gen:0,genT:0,
  // v26 (사용자 2026-10-10 12:53 「궁수는 기본적으로 리치가 현재 사거리의 1.5배 … 피어싱과 같이 관통하는 스킬은 2배까지」)
  // 궁수 공격: 사거리 · 광선 길이 · 휘는 화살 · 별 · 던지기 거리 ×1.5(화살 540 → 810, 먼 시야 더한 값도 같이), 꿰뚫는 기술 ×2(1080), 땅 범위 가운데 560 → 840.
  // 그대로: 덫 던지는 거리(TRAP_RANGE) · 스캐터 발리(가까운 적 부채꼴 300) · 이동 기술 · 소환수
  ak:1.5,apk:2};
// 그림 몸 반폭(월드 단위, 크기 배율 1): 화면 폭(가운데 90% 덩어리와 전체 폭의 평균)/2 ÷ 1.06(월드 → 화면 가로 배율). v22 측정값
const R22_HW={slime:18,wolf:30,goblin:15,skeleton:16,wraith:20,ogre:21,knight:21,apostle:16,golem:27,panther:28,elemental:19,scorpion:27,serpent:17,yeti:21,imp:18,crab:28};
// 새 그림(Flare) 몸 반폭. 맞는 크기는 그림 설정과 상관없이 늘 같아야 하므로(같이 하기에서 서로 설정이 달라도 같은 판정) 종류마다 두 그림 중 큰 값을 고정으로 쓴다.
// 비룡(wyvern)은 날개 폭이 아니라 몸통 폭(26: 크기 3배 보스 → 78)
const R22_FLHW={goblin:20,skeleton:19,ogre:33,antlion:34,zombie:10,wyvern:26,skelmage:19};
// 종류별 고정 몸 반폭(크기 배율 1): 처음 한 번만 정하고 바뀌지 않는다
const R22_TW={};
function r22TW(k){let v=R22_TW[k];if(v!=null)return v;const t=TYPES[k];if(!t)return 0;const id=FLTYPE[k]||FLDRAW[t.draw];v=Math.max(R22_HW[t.draw]||0,id&&R22_FLHW[id]||0);R22_TW[k]=v;return v}
const R22_MOVE=new Set(['blink','leap','charge','mleap','sidestep','swap','intervene']);
const R22_GND=new Set(['field','rain','strike','gale','spchain','brandburst']);
// v26: 궁수의 꿰뚫는 기술 (화살이 일직선의 적을 꿰뚫음: 피어싱 샷 · 풀 드로우 · 윈드 피어서 · 시즈 샷 · 피어싱 블로 · 보우 오브 헤븐 · 리턴 애로우). 짐승 떼(와일드 런)는 아님
const R22_APX=new Set(['returnarrow']);
const r22Pierce=s=>!!s&&s.cls==='archer'&&(s.pierce>0||s.kind==='beam'&&s.id!=='wildrun'||R22_APX.has(s.id));
const r22AK=s=>s&&s.cls==='archer'?(r22Pierce(s)?R22.apk:R22.ak):1;
// 땅에 까는 범위 마법의 가운데 한계 (궁수 ×1.5)
const r22Gnd=s=>Math.round(R22.gnd*(s&&s.cls==='archer'?R22.ak:1));
// 이 마법의 사거리 (궁수 화살은 조금 더 + 먼 시야, v26부터 그 값의 1.5배 · 꿰뚫는 기술 2배)
function r22Cap(s){if(s&&s.cls==='archer'){let rg=0;if(!GHOST&&P&&P.cls==='archer'){try{rg=Math.max(0,passSum('range')||0)}catch(_){rg=0}}return Math.round((R22.arc+Math.min(120,Math.round(400*rg)))*r22AK(s))}return R22.cap}
function r22HR(e){let w=0;const t=TYPES[e.k];
  if(t&&!e.mirror){const sc=e.sc||(e.elite?1.25:1);w=r22TW(e.k)*sc}
  return Math.max(e.r||0,Math.round(w))}
// 내 공격이 쓰는 맞는 크기 (그림 설정과 무관. 2초마다 다시 잼: e.r·sc가 나중에 바뀌어도 따라감)
function hR(e){if(e._hrG!==R22.gen){e._hr=r22HR(e);e._hrG=R22.gen}return e._hr}
// from(보통 P)에서 사거리 안(몸 가장자리 기준)에 있나
const r22In=(e,from,cap)=>dist(e,from)<=cap+hR(e);
// 연쇄 · 한 적 마법의 첫 대상: 겨눈 곳 둘레(rad)에서 사거리 안의 적 → 없으면 나에게서 사거리 안의 가장 가까운 적
function r22First(t,rad,s){const C=r22Cap(s);let b=null,bd=rad;
  if(t)for(const e of enemies){if(e.dead||!r22In(e,P,C))continue;const d=dist(e,t);if(d<bd){bd=d;b=e}}
  if(b)return b;bd=1e9;for(const e of enemies){if(e.dead)continue;const d=dist(e,P)-hR(e);if(d<=C&&d<bd){bd=d;b=e}}return b}
// 화면의 한 점이 어느 몬스터의 몸(그림) 위인가: 몸 반폭 × 키(그림 높이) 상자
function r22Pick(sx,sy){let b=null,bd=1e9;
  for(const e of enemies){if(e.dead)continue;const t=TYPES[e.k];if(!t)continue;const s=W2S(e.x,e.y),sc=e.sc||(e.elite?1.25:1),hr=hR(e),hw=hr*1.06+4,H=(MON_H[t.draw]||40)*sc*1.25;
    const dx=sx-s.x;if(Math.abs(dx)>hw||sy>s.y+hr*.53+4||sy<s.y-H)continue;
    const d=Math.hypot(dx/hw,(sy-(s.y-H*.45))/(H*.6));if(d<bd){bd=d;b=e}}
  return b}
function aimAt(sx,sy){const raw=S2W(sx,sy),e=r22Pick(sx,sy);return e?{x:e.x,y:e.y,snap:e,raw}:raw}
// 자동 겨누기: 사거리 안에서만
{const _ap=aimPoint;aimPoint=function(){
  if(!touchMode&&mouse.active)return aimAt(mouse.x,mouse.y);
  const C=r22Cap({cls:P.cls});let b=null,bd=1e9;for(const e of enemies){if(e.dead)continue;const d=dist(e,P)-hR(e);if(d<=C&&d<bd){bd=d;b=e}}
  if(b)return{x:b.x,y:b.y};return{x:P.x+Math.cos(P.face)*300,y:P.y+Math.sin(P.face)*300}}}
// 시전: 이동 기술은 몸에 붙인 겨눔을 풀고, 땅에 까는 마법은 가운데를 560 안으로
{const _tc=tryCast;tryCast=function(id,t){const s=SPELLS[id];
  if(t&&s){if(t.snap)t=R22_MOVE.has(s.kind)?t.raw:{x:t.x,y:t.y};
    if(R22_GND.has(s.kind)&&!s.self)t=clampRange(t,r22Gnd(s))}
  return _tc.call(this,id,t)}}
// 겨눔을 따로 주지 않은 시전(단축키)도 b3의 clsAim을 지나므로 같은 처리
{const _ca=clsAim;clsAim=function(s,t){if(t&&s){if(t.snap)t=R22_MOVE.has(s.kind)?t.raw:{x:t.x,y:t.y};if(R22_GND.has(s.kind)&&!s.self)t=clampRange(t,r22Gnd(s))}return _ca(s,t)}}
// 길이·거리 값: 광선·물벽·천군 돌격 길이, 던지기·일곱 별·휘는 화살·검기 거리
const R22_LEN=new Set(['beam','wave','sweep']),R22_RNG=new Set(['throw','stars','homing','gale']);
{const _ef=eff;eff=function(id,L){const e=_ef(id,L);if(!e||!(e.mult>0))return e;
  // 천군의 돌격(sweep)은 시전자 60 뒤에서 출발하므로 +60
  const k=r22AK(e);// v26: 궁수는 길이 · 거리도 1.5배(꿰뚫는 기술 2배)한 뒤 사거리로 줄인다
  if(R22_LEN.has(e.kind)&&e.len>0){const C=r22Cap(e)+(e.kind==='sweep'?60:0);e.len=Math.min(C,Math.round(e.len*k))}
  if(R22_RNG.has(e.kind)&&e.range>0){const C=r22Cap(e);e.range=Math.min(C,Math.round(e.range*k))}
  return e}}
// 투사체: 처음 나온 자리에서 사거리를 넘게 날아가면 사라진다 (내 것 · 동료 그림자 · 소환수 것 모두).
// 시전자 곁에서 나온 것은 시전자 자리에서 잰다. 다음 한 프레임에 사거리를 넘을 것도 미리 없앤다(빠른 화살이 한 프레임만큼 더 닿지 않게)
function r22Proj(dt){
  for(const p of projs){if(p.owner!=='p'||p.life<=0)continue;
    if(!p._o){const sp=Math.hypot(p.vx,p.vy)||0,near=Math.hypot(p.x-P.x,p.y-P.y)<=24+sp/40;p._o={x:near?P.x:p.x,y:near?P.y:p.y,c:r22Cap(p.s)}}
    if(Math.hypot(p.x-p._o.x,p.y-p._o.y)+Math.hypot(p.vx,p.vy)*(dt||0)>p._o.c){p.life=0;if(parts.length<Q.pcap)burst(p.x,p.y,p.col||'#fff',4,50,2,p.z||20)}}
  if(J3W.hom.length)for(const h of J3W.hom){if(h.life<=0)continue;if(!h._o)h._o={x:h.x,y:h.y,c:r22Cap(h.s)};else if(Math.hypot(h.x-h._o.x,h.y-h._o.y)>h._o.c)h.life=0}}
{const _u=update;update=function(dt){R22.genT+=dt;if(R22.genT>=2){R22.genT=0;R22.gen++}r22Proj(dt);_u(dt);r22Proj(dt)}}
// v22 (사용자 06:54): 투사체(화살 포함)는 화면에 그려진 몸과 겹치면 맞는다. 땅의 원(hR)만 보면 키 큰 몸의 위쪽을 지나는 화살이
// 그림으로는 맞았는데 빗나갔다. 몸 상자: 가로 = 몸 반폭(hR)×0.9, 세로 = 발밑(조금 아래까지)부터 그림 키의 90%까지, 땅 깊이로는 몸 뒤 2×hR+20 안. 몸 옆·머리 위로 확실히 비켜 간 것은 그대로 빗나감
function r22Box(e,p){const t=TYPES[e.k];if(!t||e.mirror)return false;const sc=e.sc||(e.elite?1.25:1),H=(MON_H[t.draw]||40)*sc*1.25*.9,hr=hR(e),pr=(p.r||5)*.8;
  const dx=((p.x-p.y)-(e.x-e.y))*KI;if(Math.abs(dx)>hr*1.06*.9+pr)return false;
  // 땅에서 몸 뒤쪽으로 너무 먼(몸 두께의 두 배 + 20 넘게) 투사체는 그림이 겹쳐도 몸 뒤를 지나가는 것 → 안 맞음 (큰 보스 뒤로 지나가는 화살이 가로막히지 않게)
  const dg=((p.x+p.y)-(e.x+e.y))*KI/2;if(dg<-(2*hr+20)*.53)return false;
  const dy=dg-(p.z||0);return dy<=hr*.53*.5+pr&&dy>=-H-pr}
