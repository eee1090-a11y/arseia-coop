/* ---------- v31 전사 명중 (사용자 2026-10-13 23:43) ----------
   「전사는 근접해야 해서 공격도 어려운데 명중까지 있으니까 보스전이 너무 어려워」
   v30까지: 명중 = 80% + (민첩 + 레벨 + 명중 옵션 − 몬스터 레벨×2.5)×0.3%, 준보스 −3% · 보스 −5%, 65~97%.
     전사는 힘 · 체력에 점수를 쓰니 민첩이 낮아 레벨이 오를수록 떨어졌다(같은 레벨 보스에게 5레벨 77% → 60레벨 69% → 100레벨 65%). 궁수는 84~97%.
   · 전사 검술 명중: 명중 점수에 레벨×1.5를 더하고, 준보스 · 보스 감점은 절반, 최소 85%(최대 97% 그대로).
     같은 레벨 보스: 5레벨 85% · 30레벨 약 89% · 60레벨 97% · 100레벨 97%. 궁수 · 다른 직업은 그대로. 저장 없음. */
const W31A={per:1.5,min:.85,max:.97,bossBack:.5};
{const _h=hitChance;hitChance=function(e){const h=_h.apply(this,arguments);if(!P||P.cls!=='warrior'||!e)return h;if(h>=1)return h;const t=TYPES[e.k]||{};
  const back=(t.boss?.05:0)+(t.mini?.03:0);return clamp(h+W31A.per*Math.max(1,P.lvl|0)*.003+back*W31A.bossBack,W31A.min,Math.max(W31A.max,h))}}
setTimeout(()=>{if(window.__game)Object.assign(window.__game,{W31A})},0);
