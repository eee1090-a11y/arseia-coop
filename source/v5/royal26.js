/* ---------- v26 왕도 · 남부 정리 (사용자 2026-10-10 12:05 · 12:18 「두 곳으로 해줘」) ----------
   「왕도를 옆의 별도 맵으로 … 좀 더 화려하게 … 사방으로 이어지도록 … 각 직업들의 전당/사무실 … 주요한 편의기능들은 그래도 왕도에서는 모두」
   · 왕도 지도: region.js REGIONS.royal (남부 북쪽, 세계 지도 [0,-1]). 마을 배치: town.js TWLAY.arden · 전당 셋 실내: TWROOM. 전직관 넷: job2q.js
   · 남부 마을: 브렌힐 · 헤이븐 둘. 윌로벤 사람 · 주점 · 오두막 · 나루는 헤이븐 남쪽 「헤이븐 나루」로. 들판 레벨 · 길은 옛 네 마을 자리(b1.js TOWN0) 그대로
   · 저장: 새 값 없음. 옛 저장이 사라진 마을(윌로벤) · 옛 아르덴 자리에 서 있으면 불러올 때 헤이븐 · 왕도로 옮긴다. 가 본 마을 목록의 윌로벤 → 헤이븐. 레벨 · 경험치 · 짐은 그대로 */
const ROYAL={safe:2400,moved:null,
  oldArden:{x:2500,y:1300,r:950},oldWillowen:{x:3500,y:4450,r:800}};
// 1) 왕도 전체가 안전 지대 (몬스터 없음 · 마을 음악). 고갯길 끝 포탈까지 들어간다 (포탈은 한가운데에서 1750)
{const t=RCACHE.royal&&RCACHE.royal.town;if(t)t.safe=ROYAL.safe}
// 안전 지대 바깥(고갯길 너머 모서리)에서도 들판 몬스터가 나오지 않는다
{const _se=spawnEnemy;spawnEnemy=function(){if(!DG&&REG.id==='royal')return;return _se.apply(this,arguments)}}
// 2) 옛 저장 옮기기 (불러오기 전에 저장 내용만 고친다 · 캐릭터 키는 지우지 않는다)
function royalMigrate(d){if(!d||typeof d!=='object')return null;let note=null;
  if(Array.isArray(d.towns)){const s=new Set(d.towns.map(id=>id==='willowen'?'haven':id));d.towns=[...s]}
  if(d.home==='willowen')d.home='haven';
  const rg=d.reg||'home';
  if(rg==='home'&&typeof d.x==='number'&&typeof d.y==='number'){const A=ROYAL.oldArden,W0=ROYAL.oldWillowen;
    if(Math.hypot(d.x-A.x,d.y-A.y)<A.r){const t=RCACHE.royal.town;d.reg='royal';d.x=t.gate.x+40;d.y=t.gate.y+40;if(Array.isArray(d.towns)&&!d.towns.includes('arden'))d.towns.push('arden');if(d.home==='arden'||!d.home)d.home='arden';note='arden'}
    else if(Math.hypot(d.x-W0.x,d.y-W0.y)<W0.r){const H=HOME.towns.find(t=>t.id==='haven');d.x=H.gate.x+40;d.y=H.gate.y+40;if(Array.isArray(d.towns)&&!d.towns.includes('haven'))d.towns.push('haven');note='willowen'}}
  return note}
{const _ld=load;load=function(d,slot){const note=royalMigrate(d);ROYAL.moved=note;const ok=_ld(d,slot);
  if(ok&&note)setTimeout(()=>msg(note==='arden'?'왕도 아르덴이 북쪽 새 지도로 옮겨 가서, 왕도 광장 짝문 앞에서 이어 갑니다':'윌로벤 사람들이 헤이븐 나루로 옮겨 가서, 헤이븐 교차로 짝문 앞에서 이어 갑니다','#ffd98a'),600);
  return ok}}
