/* ---------- v25 바닥 아이템 90초 뒤 사라짐 (사용자 2026-10-10 09:22 「자원 소모를 줄이기 위해 바닥에 떨어진 아이템들은 1.5분 이상 지나면 사라지도록」) ----------
   · 금화 · 물약 · 귀환 두루마리 · 장비 모두 떨어진 지 90초가 지나면 사라진다(예전 120초, b3.js update의 loot 거르기).
   · 사라지기 전 마지막 5초는 깜빡인다(마지막 2초는 더 빨리).
   · 예외(keep): 가방이 가득 차 발밑에 놓인 의뢰 · 전직 · 현상금 보상, 3차 전용 유니크의 첫 확정 드랍. 사라지면 다시 못 받으니까 그대로 둔다.
   · 같이 하기: 떨어진 물건은 원래 각자 화면에 따로 생기고(주고받지 않음) 각자 같은 90초로 사라진다. 던전을 나갔다 돌아오면(dgkeep22) 나가 있던 동안은 시간이 가지 않는다.
   · 저장 · 규칙은 그대로(바닥 물건은 저장되지 않음). */
const LOOT25={life:90,blink:5};
const loot25Gone=l=>!l.keep&&l.t>=LOOT25.life;
// 깜빡임: 마지막 5초는 0.25초마다(마지막 2초는 0.125초마다) 그리지 않는다
const loot25Hide=l=>{if(!l||l.keep)return false;const left=LOOT25.life-(l.t||0);if(left>LOOT25.blink)return false;const p=left<2?.125:.25;return Math.floor(left/p)%2===1};
{const _dl=drawLoot;drawLoot=function(l){if(loot25Hide(l))return;return _dl.apply(this,arguments)}}
window.__loot25={LOOT25,loot25Gone,loot25Hide};
