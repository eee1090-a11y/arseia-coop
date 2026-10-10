/* ---------- v24 마을 안에서는 공격 기술 못 씀 (사용자 2026-10-10 05:16) ----------
   「마을 안에서 밖의 몬스터를 리스크 없이 공격할 수 있음 → 마을 밖으로 나가야 공격 기술이 되게」
   · 마을 안전 구역(inSafe, 몬스터가 쫓아오지 않는 곳) · 건물 안(IN)에서는 피해를 주는 기술(isDmg: 기본 공격 · 투사체 · 장판 · 소환 · 덫 등)을 시작하지 않는다.
     알림: 「마을 안에서는 공격 기술을 쓸 수 없습니다」(1.5초에 한 번).
   · 치유 · 강화 · 보호막 · 가호 · 순간이동(피해 없는 것과 blink) · 부활은 그대로.
   · 던전 안은 마을이 아니라 그대로. 동료 화면의 유령 시전(GHOST) · 채널링 틱(CAST_MOD)은 손대지 않는다(채널링은 시작할 때 막힘). */
const SAFE24={msgT:0};
const safe24Here=()=>!!(P&&!DG&&(IN||inSafe(P.x,P.y,0)));
const safe24Blocks=id=>{const s=SPELLS[id];return !!(s&&s.cls&&s.kind!=='passive'&&s.kind!=='blink'&&isDmg(s))};
{const _tc=tryCast;tryCast=function(id,target){
  if(!GHOST&&!CAST_MOD&&safe24Here()&&safe24Blocks(id)){if(time-SAFE24.msgT>1.5){SAFE24.msgT=time;msg('마을 안에서는 공격 기술을 쓸 수 없습니다 · 마을 밖으로 나가 주세요','#a39d8f')}return}
  return _tc.apply(this,arguments)}}
window.__safe24={SAFE24,safe24Here,safe24Blocks};
