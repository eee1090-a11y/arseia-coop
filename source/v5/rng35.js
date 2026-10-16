/* ---------- v35: 상위 · 고레벨 부채꼴 · 시전자 중심 원형 기술 범위 넓힘 ----------
   사용자 2026-10-15 「글레이셜에이지같은 상위 스킬은 바로 앞 부채꼴만 적용될 정도로 너무 범위가 적어 … 제로 도메인도 동일해.
   그 이전의 앱솔루트제로보다는 더 범위가 넓어야지 … 특히 부채꼴이나 시전자 중심 원형 스킬들은 그 범위를 늘려줘」
   · RNG35: 부채꼴(range 길이 · ang 벌어짐 각도, 라디안)과 둘레 원(rad 반지름)의 새 기본값. 표에 없는 기술은 그대로.
   · 같은 직업 · 같은 모양(부채꼴 / 둘레 원 / 채널링으로 도는 원) 안에서 위계(rank)가 높은 기술이 낮은 기술보다 좁지 않다(5위계 이상, 피해 주는 기술).
   · 부채꼴 길이도 둘레 원처럼 스킬 레벨마다 1.5%씩 길어진다(예전엔 레벨을 올려도 그대로). 갈고리(hook)는 한 줄로 당기는 기술이라 그대로. */
const RNG35={
  // 마법사 부채꼴
  dawnblade:{range:300,ang:1.6},dragonbreath:{range:340,ang:1.3},turncurrent:{range:360,ang:1.7},glacier:{range:450,ang:2.1},
  // 마법사 둘레 원
  quake:{rad:210},eyeofstorm:{rad:220},timestop:{rad:260},raisemountain:{rad:320},absolutezero:{rad:420},
  // 사제 부채꼴 · 둘레 원
  waveoflight:{range:320,ang:1.2},sunsword:{range:420,ang:2},
  greatjudgment:{rad:320},grandcross:{rad:300},confessbell:{rad:320},
  // 전사 부채꼴 · 둘레 원 · 도는 원
  thousandcuts:{range:190,ang:1.6},myriadslash:{range:300,ang:2},
  stomp:{rad:200},grandtaunt:{rad:340},terrorroar:{rad:340},ragespin:{rad:150},whirlslash:{rad:190}};
const RNG35_OLD={};
for(const id in RNG35){const s=SPELLS[id];if(!s)continue;RNG35_OLD[id]={};for(const k in RNG35[id]){RNG35_OLD[id][k]=s[k];s[k]=RNG35[id][k]}}
const RNG35_FIX=new Set(['hook']);
{const _ef=eff;eff=function(id,L){const e=_ef(id,L);
  if(e&&e.kind==='cone'&&e.range>0&&!RNG35_FIX.has(id))e.range=Math.round(e.range*(1+.015*(Math.max(1,L||1)-1)));
  return e}}
