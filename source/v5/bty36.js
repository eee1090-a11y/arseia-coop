/* ---------- v36: 현상금 게시판 15곳 더 ----------
   사용자 2026-10-15 「지금 새로운 고레벨 지역의 퀘스트가 너무 부실한 것 같아. 현상금사냥도 없고」
   · 게시판이 없던 마을 15곳에 게시판(지역 들판 몬스터 넷 중 날마다 셋). 규칙 · 보상 · 하루 상한은 bounty20.js 그대로.
   · 브렌힐(시작 마을, 헤이븐 게시판을 씀)과 왕도 아르덴(성 안이라 들판 몬스터가 없음)은 뺀다.
   · 고레벨 지역 · 옹기 설원은 bounty20.js보다 나중에 생기므로 여기(빌드 끝 쪽)에서 표에 더하고 게시판을 세운다. */
const BTY36={mistford:'mistlake',charkiln:'scorch',ongi_camp:'ongi',pilgrimtent:'plateau',frostlamp:'starsea',stormcloister:'thunder',rootwatch:'roots',keeperhouse:'capital',lastvigil:'eclipse',
  h29_reed_camp:'h29_reed',h29_kiln_camp:'h29_kiln',h29_crystal_camp:'h29_crystal',h29_snow_camp:'h29_snow',h29_bell_camp:'h29_bell',h29_veil_camp:'h29_veil'};
{const OFF=[[150,-90],[-150,90],[120,140],[-120,-130],[200,0],[-200,0]];
  for(const id in BTY36){if(BTY_BOARDS[id])continue;const reg=BTY36[id],R=REGIONS[reg];const mobs=(R&&R.mobs||[]).filter(k=>TYPES[k]);if(!mobs.length)continue;
    BTY_BOARDS[id]={reg,mobs};if(!v20Town(id))continue;let d=null;for(const o of OFF){d=v20AddProp(id,o[0],o[1],{k:'bboard',pv:0,use:'bty:'+id});if(d)break}if(d)BTY_PROP[id]=d}
  v20SyncDecor()}
