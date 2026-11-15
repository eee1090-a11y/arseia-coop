/* ---------- v62 거점은 70레벨 이상 모든 사냥터에서 (사용자 2026-11-15 「거점은 왜 70-100레벨에만 있는거야? 특정 레벨 이후의 사냥터에서는 모두 적용되도록 해야지」) ----------
   v42 거점(g42f.js)은 70~100레벨 여섯 쉼터(G42_BSREG)에서만 고를 수 있었다.
   · 이제 쉼터(마을 · 야영지)가 있는 지역 가운데 사냥터 레벨(지역 기본 레벨 + 지옥 지역이면 지옥 더하기 40)이 G62BS.lv(70) 이상인 곳은 모두 거점이 된다:
     원래 여섯 + 재 내리는 고원 · 불 꺼진 왕도 · 별이 언 바다 · 천둥 우림 · 대지의 뿌리 · 빛이 꺼진 성역 · 110레벨 다섯 땅 · 100레벨 이후 땅들 …
     나중에 더해지는 지역도 같은 규칙으로 저절로 들어간다(지역을 불러올 때 다시 맞춤).
   · 거점 건물(대장간 · 약초밭 · 훈련 허수아비 · 휴식 침대)의 효과 · 값 · 옮기기 금화는 그대로. 거점 표지판 · 세계 지도 ⌂ · 「거점」 칸 목록도 같은 목록을 쓴다.
   저장: 바꾸지 않음(P.g42.bs.reg에 새 지역 id가 들어갈 수 있을 뿐). */
const G62BS={lv:70,hell:()=>DIFF[2].add};
const g62BsLv=id=>{const R=REGIONS[id];if(!R)return 0;return (Number(R.base)||0)+(R.hell?G62BS.hell():0)};
function g62BsSync(){let n=0;for(const id in REGIONS){if(id==='home'||G42_BSREG.includes(id))continue;if(g62BsLv(id)>=G62BS.lv){G42_BSREG.push(id);n++}}
  if(n&&typeof g51PlacePosts==='function')try{g51PlacePosts()}catch(err){if(window.__QA)throw err}/* 새 쉼터에도 거점 표지판 */return n}
g62BsSync();
{const _lr=loadRegion;loadRegion=function(){g62BsSync();return _lr.apply(this,arguments)}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{G62BS,g62BsSync,g62BsLv})}catch(_){}},0);
