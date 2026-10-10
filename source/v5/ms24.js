/* ---------- v24 장비의 이동 속도 옵션 (사용자 2026-10-10 05:24) ----------
   「이동속도를 소폭 증가시키는 옵션을 아이템을 통해서 챙길 수 있도록 · 최대 이동속도 증가는 50%까지」
   · 새로 떨어지는 마법 · 희귀 · 세트 장비의 덧붙는 옵션 후보에 「이동 속도 %」를 한 칸 넣는다(모든 부위, 네 직업).
     값: 아이템 레벨 1~39 2~4% · 40~89 3~5% · 90 이상 4~6%. 한 아이템에 두 번 뽑혀도 그 레벨의 최대값(4 · 5 · 6%)을 넘지 않는다.
   · 합계 상한: 장비 이동 속도는 예전대로 40%까지 · 강화(버프)는 60%까지, 그리고 둘을 더해 +50%까지(b2.js spdMul의 SPD_CAP24).
   · 이미 가진 장비 · 저장은 그대로. */
const MS24={lo:2,hi:4};
const ms24Roll=il=>ri(MS24.lo,MS24.hi)+(il>=40?1:0)+(il>=90?1:0);
{const _a=affixPool;affixPool=function(){const p=_a.apply(this,arguments);p.push('ms');return p}}
{const _a=affixPoolV18;affixPoolV18=function(){const p=_a.apply(this,arguments);p.push('ms');return p}}
{const _rs=rollStat;rollStat=function(k,il){if(k==='ms')return ms24Roll(il||1);return _rs.apply(this,arguments)}}
const ms24Max=il=>MS24.hi+(il>=40?1:0)+(il>=90?1:0);
{const _mi=makeItem;makeItem=function(il){const it=_mi.apply(this,arguments);if(it&&it.stats&&it.rar>=1&&it.rar<=3&&it.stats.ms>ms24Max(it.il||il||1))it.stats.ms=ms24Max(it.il||il||1);return it}}
window.__ms24={MS24,ms24Roll,SPD_CAP24};
