/* ---------- v62 몬스터가 못 가는 곳에 있지 않게 (사용자 2026-11-15 「누구 잡으라는 퀘스트는 잡아야되는 대상이 적어도 내가 못가는 벽으로 가면 안될거 아니야」) ----------
   들판 몬스터(의뢰 · 현상금 · 처치 목표 · 우두머리 · 보통 몬스터 모두)는
   · 걸어서 닿는 땅에만 있는다: 마을 · 짝문 · 상점 · 지역 끝 길 · 동굴 앞 · 둥지 · 의뢰인 자리(terrTargets)와 지금 내가 선 자리에서 물 · 절벽을 막힘으로 보고 이어진 땅.
   · 절벽 안이나 절벽 · 물로 둘러싸인 섬(걸어서 못 가는 곳)에 생기거나 밀려 들어가면, 가장 가까운 닿는 땅으로 옮긴다(0.25초마다 확인, 마을 안 · 던전 · 참가자 화면 제외).
     예전에는 절벽 안에 한 번 들어간 몬스터가 절벽을 그냥 지나다녔다(moveBody는 막힌 곳에 있으면 막지 않음).
   · 현상금 자리도 닿는 땅에서만 고른다.
   저장은 바꾸지 않는다. */
const RCH62={dt:.25,t:0,c:{},r:40};
function r62Add(C,x,y){if(blockedAt(x,y))return;const k=terrLQi(x,y);if(C.ok[k])return;const o=terrReachLQ(C.L,C.T&&C.T.w,x,y);for(let i=0;i<o.length;i++)if(o[i])C.ok[i]=1}
// 지금 지역에서 걸어서 닿는 격자 (LQS 간격 점). 못 보면 null
function r62Reach(){if(DG||(typeof IN!=='undefined'&&IN)||!TREADY||!P)return null;const id=REG.id,L=terrLayer(id);if(!L)return null;const T=terrEnsure(id);if(!T)return null;let C=RCH62.c[id];
  if(!C||C.L!==L||C.T!==T){C=RCH62.c[id]={L,T,ok:new Uint8Array(LQN*LQN)};const S=terrSnap(id);for(const p of (S&&S.tg)||[])r62Add(C,p.x,p.y)}
  if(!P.dead&&!blockedAt(P.x,P.y))r62Add(C,P.x,P.y);return C.ok}
// 그 자리 둘레 격자점 넷 중 하나라도 닿으면 닿는 곳
function r62At(ok,x,y){if(!ok)return true;const N=LQN,i0=clamp(Math.floor(x/LQS),0,N-1),j0=clamp(Math.floor(y/LQS),0,N-1),i1=Math.min(N-1,i0+1),j1=Math.min(N-1,j0+1);
  return !!(ok[j0*N+i0]||ok[j0*N+i1]||ok[j1*N+i0]||ok[j1*N+i1])}
function r62Ok(x,y){return !blockedAt(x,y)&&r62At(r62Reach(),x,y)}
// 가장 가까운 닿는 땅 (마을 안전 구역은 빼고)
function r62Spot(ok,x,y){const N=LQN,i0=clamp(Math.round(x/LQS),0,N-1),j0=clamp(Math.round(y/LQS),0,N-1);
  for(let r=0;r<=RCH62.r;r++){let best=null,bd=1e18;for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){if(Math.max(Math.abs(i-i0),Math.abs(j-j0))!==r||i<1||j<1||i>=N-1||j>=N-1)continue;
      if(!ok[j*N+i])continue;const px=i*LQS,py=j*LQS;if(blockedAt(px,py)||inSafe(px,py,0))continue;const d=(px-x)*(px-x)+(py-y)*(py-y);if(d<bd){bd=d;best={x:px,y:py}}}
    if(best)return best}return null}
function r62Fix(e,ok){if(!e||e.dead||e.net||e.qa||e.k==='qa_dummy')return false;if(!blockedAt(e.x,e.y)&&r62At(ok,e.x,e.y))return false;const s=r62Spot(ok,e.x,e.y);if(!s)return false;
  e.x=s.x;e.y=s.y;e.wx=s.x;e.wy=s.y;e.dash=0;e.r62=(e.r62|0)+1;return true}
function r62Tick(dt,now){if(NET.guest||DG||(typeof IN!=='undefined'&&IN))return 0;RCH62.t-=dt;if(RCH62.t>0&&!now)return 0;RCH62.t=RCH62.dt;const ok=r62Reach();if(!ok)return 0;let n=0;for(const e of enemies)if(r62Fix(e,ok))n++;return n}
{const _ue=updateEnemies;updateEnemies=function(dt){const r=_ue.apply(this,arguments);try{r62Tick(dt)}catch(err){if(window.__QA)throw err}return r}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{RCH62,r62Reach,r62Ok,r62Tick})}catch(_){}},0);
