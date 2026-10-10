/* ---------- v24 시전 시간 나누기 (사용자 2026-10-10 05:13) ----------
   「1차에서도 즉시시전 기술이 절대다수 → 짧은 캐스팅부터 큰 캐스팅까지」 「캐스팅은 0.5~2초, 위력에 따라」
   「즉시시전 장판기는 위력이 좀 더 약해야(노 리스크로 깔아두고 다른 기술을 쓸 수 있으니까)」
   「캐스팅/채널링은 최대 50% 정도」 「단순 투사체 기본기는 캐스팅 없음 · 크고 강하게 관통하는 투사체만 제한적으로」
   · CAST_T_V24: 새로 시전 시간이 생기는 공격 기술(1차 · 상위 기술 · 2차 일부). 위력(배율 · 범위 · 재사용)이 클수록 길게 0.5~1.5초.
     예전부터 시전 시간이 있던 기술(메테오 · 인페르노 코어 · 선 폴 등)과 채널링은 그대로.
   · 새로 시전 시간이 생긴 공격 기술은 외우는 동안의 위험만큼 기본 배율 ×(1+0.15×시전 초) (0.5초 +7.5% · 1초 +15% · 1.5초 +22.5%).
   · 즉시 시전 장판(지속 지대 field · 광역 낙하 rain · 주변 낙뢰 storm)인 공격 기술은 기본 배율 ×0.85 (1차 · 상위 기술 · 2차).
     치유 지대 · 채널링 · 시전 시간이 있는 장판은 그대로. 3차 기술은 따로 맞춘 끝 콘텐츠라 그대로.
   · 다른 곳에서 그 기술의 배율을 이미 바꿨으면(v23 값과 다르면) 덮어쓰지 않는다. 시전 후 짧은 회복(recov.js)은 기존 규칙(시전 기술 ×0.6)대로. */
const CAST_T_V24={
  // 마법사 1차 · 상위 기술: 큰 · 관통 투사체
  flamelance:.6,lancelight:.7,obsidian:.6,vacuumblade:.8,
  // 직선 · 부채꼴
  fissure:.5,callwave:.7,dragonbreath:.8,turncurrent:.8,dawnblade:.8,magmariver:1,glacier:1.2,rendingsky:1.4,
  // 지정 낙하 · 주변 범위 · 큰 장판
  spacetwist:.8,jaws:.9,heavenbolt:1.3,quake:.6,eyeofstorm:.8,frozenground:.9,earthquake:.8,callstorm:1,starlight:1.2,
  // 사제
  hammerofwrath:.7,pillaroflight:.7,holysun:.8,grandcross:1,sunsword:1,greatjudgment:1.2,sacredsword:1.2,godspear:1.5,
  // 전사 (크게 휘두르기 · 내려찍기)
  lungepierce:.5,endblow:.5,stomp:.5,heavycrash:.6,
  // 궁수 (크게 당기기 · 터지는 화살 · 큰 낙하)
  burstarrow:.5,weakspot:.5,arrowrain:.6,thunderarrow:.7,apexhunt:1,
  // 2차 일부 (큰 낙하 · 큰 한 방)
  steamburst:.7,finalverdict:.8,execute:.5,pierceblow:.6};
const CAST24_GROUND=new Set(['field','rain','storm']);
const CAST24_MULT={};// id: [v23 배율, v24 배율] (#qa · 보고용)
for(const id in CAST_T_V24){const s=SPELLS[id];if(!s||CAST_T[id]||CHAN[id])continue;CAST_T[id]=CAST_T_V24[id];
  if(isDmg(s)){const o=s.mult,n=Math.round(o*(1+.15*CAST_T_V24[id])*1000)/1000;CAST24_MULT[id]=[o,n];s.mult=n}}
for(const id in SPELLS){const s=SPELLS[id];if(!s||!s.cls||s.job3||!CAST24_GROUND.has(s.kind)||!isDmg(s)||s.heal||id==='healcircle'||CAST_T[id]||CHAN[id]||s.charge||id in CAST24_MULT)continue;
  const o=s.mult,n=Math.round(o*.85*1000)/1000;CAST24_MULT[id]=[o,n];s.mult=n}
/* v24(사용자 05:22): 「강력한 공격 마법의 재사용 대기시간을 최소 20%부터 50%까지 늘려줘」
   · 강한 공격 기술(재사용 5초 이상, 또는 재사용 4초 이상이면서 배율 4 이상): 재사용 ×(1+늘림) · 늘림 = 4초 +20% → 20초 이상 +50% (사이는 곧게). 소수 첫째 자리까지.
   · 그대로: 재사용 4초 이하의 보통 기술(기본 투사체 · 초반 사냥용 싼 광역기 · 무기 기본 공격) · 배율 1 미만(묶기 · 표식 · 덫 같은 도움 기술)
     · 끌어오기 · 도발 · 묶기 기술 · 치유의 원 · 소환 · 궤도 · 갑옷 · 순간이동 · 피해 없는 기술
     · 3차 기술(이미 12~90초로 길게 맞췄고, 「3차가 2차보다 세야 함」 규칙을 지키려고 그대로). */
const CD24_MIN=4,cd24Inc=cd=>cd<CD24_MIN?0:Math.min(.5,.2+.3*(cd-CD24_MIN)/16);
const CD24={};// id: [v23 재사용, v24 재사용]
const CD24_SKIP=new Set(['healcircle','grandtaunt','provokemark','chainpull','hook','holychains','hold','spaceprison','netshot']);
for(const id in SPELLS){const s=SPELLS[id];if(!s||!s.cls||s.job3||!isDmg(s)||CD24_SKIP.has(id)||['summon','orbit','armor','blink','passive'].includes(s.kind)||!(s.cd>=5||(s.cd>=CD24_MIN&&s.mult>=4))||!(s.mult>=1))continue;
  const o=s.cd,n=Math.round(o*(1+cd24Inc(o))*10)/10;CD24[id]=[o,n];s.cd=n}
window.__cast24={CAST_T,CHAN,CAST_T_V24,CAST24_MULT,CD24,chanOf,castTimeOf,isDmg};
