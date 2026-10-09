/* ---------- v21 속성 사냥터 (실행) ----------
   데이터는 wx21-world.js (월드 확장 스레드 설계 · rpg/world-expansion/v21-element). world3.js 바로 뒤에 붙는다.
   · 몬스터 속성: TYPES[k].el = WX21_EL[k] (82종). 피해 배율과 이름 옆 점은 GEAR(elem21.js)가 맡는다.
   · 새 지역 6곳은 region.js가 REGIONS 맨 끝(고원·왕도 뒤)에 합친다 → 옛 지역의 같이 하기 번호는 그대로.
   · 지옥 전용 4곳(별이 언 바다 · 천둥 우는 첨봉 · 대지의 뿌리 · 빛이 꺼진 성역)은 world3.js 봉인 규칙(REGIONS[id].hell)을 그대로 따른다.
     뿌리 · 성역은 왕도 뒤라 왕도 길이 열려야 간다(w3BlockReg).
   · 포탈 글자 · 큰 지도에 지역 대표 속성 「· 냉기」(WX21_REGEL). */
for(const k in WX21_EL)if(TYPES[k])TYPES[k].el=WX21_EL[k];
// 배경음악: 같은 성격의 곡을 함께 쓴다 (audio.js가 뒤에 붙으므로 한 박자 늦게)
queueMicrotask(()=>{try{if(typeof BGM_REG==='object')Object.assign(BGM_REG,{mistlake:'sea',scorch:'desert',starsea:'snow',thunder:'snow',roots:'forest',eclipse:'dark'})}catch(_){}});
// 지역 대표 속성 글자: {t:' · 냉기', c:색} (없으면 null)
function wx21ElTag(id){const el=typeof WX21_REGEL!=='undefined'&&WX21_REGEL[id];return el&&WX21_ELN[el]?{t:` · ${WX21_ELN[el]}`,c:WX21_ELCOL[el]||'#e8e0cc',el}:null}
const wx21RegLabel=id=>{const x=wx21ElTag(id);return REGIONS[id]?REGIONS[id].n+(x?x.t:''):''};
// 맵 끝 포탈 글자 끝에 속성을 붙인다 (닫힌 봉인 글자에는 붙이지 않음 · 이미 붙었으면 그대로)
function wx21EdgeTags(){for(const id in RCACHE){const L=RCACHE[id];if(!L||!L.edges)continue;
  for(const e of L.edges){const x=wx21ElTag(e.to);if(!x||e.w3s||typeof e.label!=='string'||e.label.endsWith(x.t))continue;e.label+=x.t}}}
{const _wl=w3Labels;w3Labels=function(){_wl();wx21EdgeTags()}}
wx21EdgeTags();
setTimeout(()=>{try{window.__wx21={WX21_REGIONS,WX21_DUNGEONS,WX21_EL,WX21_REGEL,WX21_TYPES,wx21ElTag,wx21RegLabel,wx21EdgeTags}}catch(_){}},0);
