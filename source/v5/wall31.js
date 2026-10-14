/* ---------- v31 던전 벽에 몬스터가 갇히는 문제 (사용자 2026-10-13 23:41) ----------
   「던전에서 몹이 벽 끝까지 밀려나면 아예 거기 갇혀서 데미지를 받지도 공격을 하지도 못하는 문제」
   원인: 밀치기(applyFx knock)가 벽을 보지 않고 자리를 그대로 옮겼다. 벽 속(또는 몸이 벽에 걸친 자리)에 들어간 몬스터는
     걷기(moveBody)가 「네 귀퉁이가 다 바닥이어야」 움직이므로 다시는 못 움직이고, 화살 · 마법 구슬은 벽에 닿는 순간 사라져서 맞힐 수도 없었다.
   · 밀치기: 옮기는 거리를 8px씩 나눠 걷기와 같은 벽 검사로 옮긴다(벽을 따라 미끄러짐). 들판도 같은 걷기 검사(물 · 절벽).
   · 구조: 던전에서 몸이 벽에 걸린 몬스터는 가장 가까운 빈 바닥(120px 안)으로 옮긴다. 다른 이유(서로 밀기 · 소환 자리 등)로 걸린 것도 같이 풀린다.
   같이 하기 참가자 쪽은 몬스터를 움직이지 않으므로 방장만 한다. 저장 없음. */
const W31={step:8,far:120,n:0};
function w31R(e){return Math.min(e.r||14,30)}
function w31Free(e,x,y){return DG?dgFree(x,y,w31R(e)):!blockedAt(x,y)}
function w31Rescue(e){const r=w31R(e);for(let d=6;d<=W31.far;d+=6){const n=Math.max(8,Math.round(d/4));for(let i=0;i<n;i++){const a=i/n*6.283,x=e.x+Math.cos(a)*d,y=e.y+Math.sin(a)*d;if(dgFree(x,y,r)){e.x=x;e.y=y;W31.n++;return true}}}return false}
{const _af=applyFx;applyFx=function(e,s,from){if(!e||e===P||!s||!s.knock)return _af.apply(this,arguments);const x0=e.x,y0=e.y,r=_af.apply(this,arguments);
  if(e.dead||!Number.isFinite(e.x)||!Number.isFinite(e.y))return r;const dx=e.x-x0,dy=e.y-y0,L=Math.hypot(dx,dy);if(L<.5)return r;
  if(!DG&&!(LQ||typeof TGRID!=='undefined'&&TGRID))return r;e.x=x0;e.y=y0;const n=Math.ceil(L/W31.step);for(let i=0;i<n;i++)moveBody(e,dx/n,dy/n);return r}}
{const _u=update;update=function(dt){_u.apply(this,arguments);if(!DG||NET.guest)return;for(const e of enemies){if(e.dead||e.gone||e.ally)continue;if(!dgFree(e.x,e.y,w31R(e)))w31Rescue(e)}}}
setTimeout(()=>{if(window.__game)Object.assign(window.__game,{W31,w31Rescue,w31Free})},0);
