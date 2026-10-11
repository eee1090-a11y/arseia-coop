/* ---------- v27 (SKILL): 궁수 원소 사격 3갈래 · 사제 심판/퇴마 나누기 — 데이터 (사용자 2026-10-10 16:10, 5·6·7번) ----------
   skill19.js 바로 뒤, b2.js(TREE·PRE·TREEPOS) 앞에 붙는다. 선행 연결·칸 배치는 skill27b.js(b2.js 바로 뒤),
   흔한 이름 · 시전 시간 · 아이콘 · 저장 옮기기(점수 돌려주기)는 skill27c.js(맨 뒤, qa.js 앞).
   · 궁수 「원소 화살」 → 「원소 사격」: 1위계(1레벨)에 화염 · 냉기 · 바람 화살 셋. 고른 원소를 3 · 5 · 7위계(10 · 23 · 38레벨)에서 키운다.
     원소마다 범위기 2~3개. 공통: 엘리멘탈 퀴버(패시브, 2위계) · 엘리멘탈 임뷰(강화, 6위계) · 트리니티 샤프트(상위 기술).
   · 궁수 「사격」: 두 발 쏘기(doubleshot)는 팬 샷의 아래 호환이라 없애고 파워 샷(powershot)으로 바꾼다.
   · 사제: 심판(0) = 멀리서 정확히(한 대상 강타 · 직선 관통 · 하늘에서 내리치기). 퇴마(1) = 내 둘레를 정화(둘레 · 앞쪽 범위 ·
     태우기 · 밀치기 · 묶기, 언데드 2~3배). 겹치던 빛의 회오리(divinestorm) → 턴 언데드. 어느 한쪽만 올려도 기본기 · 범위기 ·
     묶기 · 8위계 큰 한 방이 다 있다(심판 8위계 사방의 성호 = 둘러싸였을 때 쓰는 큰 한 방, 퇴마 8위계 홀리 노바 = 옛 대심판).
   · id는 그대로 둔다(단축칸 · 장비 +스킬 옵션 · 같이 하기 · 저장). 자리만 옮긴 스킬의 점수는 그대로 남는다.
     없어지는 둘은 MERGE_V19에 넣어 점수 · 단축칸 · 옵션 · 옛 판 동료의 시전이 남는 스킬로 이어진다(v19와 같은 길).
     하는 일이 크게 바뀐 궁수 원소 사격 스킬(REFUND27)의 점수만 skill27c.js가 처음 불러올 때 한 번 돌려준다. */

/* ---- 1. 없어지는 스킬 → 이어 받는 스킬 (단축칸 · +스킬 옵션 · 옛 판 동료) ---- */
const GONE27={doubleshot:'powershot',divinestorm:'turnundead'};

/* ---- 2. 새 스킬 (def 모양은 cls.js와 같음: 값은 v18 기준 배율, 뒤의 시전 · 장판 규칙(cast24.js)이 똑같이 적용됨) ---- */
// 사격: 파워 샷
def('archer',2,'powershot','강한 한 발','Power Shot','phys','bolt',8,3,{phys:1,wt:'bow',mult:2,spd:900,r:7,knock:60,stun:.4},
  '활을 힘껏 당겨 무거운 화살 한 대를 쏩니다. 맞은 적은 뒤로 밀려나며 0.4초 동안 멈칫합니다. 재사용이 짧은 한 대상 강타.');
// 원소 사격 · 화염
def('archer',5,'firerain','불화살 비','Fire Rain','fire','rain',26,12,{phys:1,wt:'bow',mult:1.3,rad:170,dur:3,rate:9,srad:36,burn:1},
  '불붙은 화살을 하늘로 쏘아 올려 3초 동안 넓은 곳에 쏟아붓습니다. 맞은 적은 불탑니다.');
def('archer',7,'volcanoshot','화산 화살','Volcano Shot','fire','strike',36,9,{phys:1,wt:'bow',mult:6,rad:170,delay:.5,burn:1},
  '화살에 불을 가득 모아(시전 0.8초) 쏘면, 떨어진 자리가 화산처럼 터져 넓은 둘레를 크게 태웁니다.');
// 원소 사격 · 냉기
def('archer',5,'blizzardshot','눈보라 화살','Blizzard Shot','ice','field',26,14,{phys:1,wt:'bow',mult:.5,rad:190,dur:5,slow:1,freeze:.8},
  '꽂힌 화살에서 눈보라가 일어 5초 동안 넓은 곳의 적을 계속 얼리며 느리게 합니다. 가끔 잠깐 얼어붙습니다.');
def('archer',7,'glacialspike','빙하 가시','Glacial Spike','ice','strike',36,10,{phys:1,wt:'bow',mult:5.2,rad:190,delay:.4,freeze:1.8},
  '얼음 화살을 땅에 박아(시전 0.7초) 거대한 얼음 가시를 솟구치게 합니다. 넓은 둘레의 적을 1.8초 동안 얼립니다.');
// 원소 사격 · 바람
def('archer',3,'galearrow','돌풍 화살','Gale Arrow','wind','beam',12,3,{phys:1,wt:'bow',mult:2.2,len:420,w:30,knock:70},
  '돌풍을 실은 화살이 앞쪽 일직선의 적을 모두 꿰뚫고 뒤로 밀어냅니다.');
def('archer',5,'cyclonearrow','회오리 화살','Cyclone Arrow','wind','field',24,14,{phys:1,wt:'bow',mult:.45,rad:170,dur:4,pull:1},
  '꽂힌 자리에 4초 동안 회오리를 일으켜 둘레의 적을 가운데로 끌어모으며 벱니다. 다른 범위기와 함께 쓰기 좋습니다.');
for(const id of ['powershot','firerain','volcanoshot','blizzardshot','glacialspike','galearrow','cyclonearrow'])SPELLS[id].kn=SPELLS[id].n;

/* ---- 3. 있던 스킬 바꾸기 (덧셈 규칙 그대로 · 이름은 skill27c.js) ---- */
const SPELL_PATCH27={
  // 궁수 · 원소 사격 1위계: 셋 다 1레벨부터, 싸고 짧게
  flamearrow:{rank:1,cost:5,cd:.8,mult:1.2,desc:'불붙은 화살. 맞은 적은 3초 동안 불탑니다. 화염 갈래의 첫 기술.'},
  icearrow:{rank:1,cost:5,cd:1,mult:1,freeze:.5,desc:'맞은 적을 잠깐 얼리고 느리게 합니다. 냉기 갈래의 첫 기술.'},
  shockarrow:{rank:1,el:'wind',en:'Wind Arrow',cost:5,cd:1,mult:1,spd:1000,r:6,pierce:1,knock:30,arc:0,
    desc:'바람을 두른 빠른 화살이 일직선의 적을 모두 꿰뚫고 살짝 밀어냅니다. 바람 갈래의 첫 기술.'},
  elementquiver:{rank:2,desc:'패시브: 원소 사격 계열(화염 · 냉기 · 바람)의 피해가 오릅니다(1레벨 5%, 레벨마다 +1%). 세 갈래 모두에 적용됩니다.'},
  burstarrow:{rank:3,cost:12,cd:2.5,mult:2.2,aoe:120,desc:'꽂히는 순간 터져 둘레의 적을 태웁니다.'},
  glacialarrow:{rank:3,cost:12,cd:3.5,mult:1.8,aoe:130,freeze:1,slow:1,desc:'터지며 둘레의 적을 1초 동안 얼리고 느리게 합니다.'},
  imbue:{rank:6},
  // 바람 갈래의 끝: 내 둘레에 6초 동안 벼락이 계속 떨어짐(움직이며 쏠 수 있음)
  thunderarrow:{rank:7,kind:'storm',cost:38,cd:30,mult:1.9,dur:6,rate:4,range:380,rad:0,delay:0,stun:0,
    desc:'하늘로 쏜 화살이 폭풍을 부릅니다. 6초 동안 내 둘레(380)의 적에게 벼락이 1초에 네 번씩 떨어집니다. 움직이며 다른 기술과 함께 쓸 수 있습니다.'},
  // 사제 · 심판: 일찍 쓰는 원거리 기술을 앞으로
  javelin:{rank:2},chainoflight:{rank:3,desc:'빛이 적에서 적으로 다섯 번 튀며 맞은 적을 잠깐 멈칫하게 합니다. 심판 갈래의 첫 범위기.'},
  // 사제 · 퇴마: 내 둘레 정화 · 언데드 특효
  holycross:{ud:2},holyfire:{ud:2},consecration:{ud:2},holychains:{ud:2},waveoflight:{ud:2},thunderprayer:{ud:2},
  symbolflash:{rank:3,ud:2},holysun:{rank:6,ud:2},sunsword:{ud:2},
  turnundead:{mult:1.2,rad:150,desc:'사방으로 빛을 터뜨려 둘레의 적을 밀어냅니다. 재사용이 짧아 몰려든 적을 자주 칠 수 있습니다. 언데드에게 세 배.'},
  grandcross:{desc:'발밑에 거대한 십자를 그어 둘레를 심판하고 잠깐 멈칫하게 합니다. 적에게 둘러싸였을 때 쓰는 심판의 큰 한 방. 언데드에게 두 배.'},
  greatjudgment:{ud:3,desc:'둘레의 모든 적을 한꺼번에 정화합니다. 퇴마의 가장 큰 한 방. 언데드에게 세 배.'}};
for(const id in SPELL_PATCH27){const s=SPELLS[id];if(!s)continue;const p=SPELL_PATCH27[id];
  for(const k in p){if(p[k]===0&&k!=='rank')delete s[k];else s[k]=p[k]}}

/* ---- 4. 계열 (b2.js가 TREE_V18의 모든 직업을 마지막에 덮어씀) ---- */
TREE_V18.archer[0]='quickshot hawkeye powershot piercearrow steadyhand fanshot fulldraw streamshot ricochet arrowrain deadeye siegeshot skyvolley';
TREE_V18.archer[1]='flamearrow icearrow shockarrow elementquiver burstarrow glacialarrow galearrow firerain blizzardshot cyclonearrow imbue volcanoshot glacialspike thunderarrow trinityarrow';
TREE_V18.priest={0:'smite javelin hammerofjustice chainoflight radiance pillaroflight rainoflight hammerofwrath judgment godspear sacredsword grandcross apotheosis',
  1:'holycross turnundead holyfire symbolflash consecration blessedhammer holychains exorcircle waveoflight holysun thunderprayer greatjudgment magnus sunsword'};

/* ---- 5. 선행 연결 (skill27b.js가 이 계열들의 PRE를 이것으로 다시 만든다) ---- */
const LINKS27={
  archer:{0:'quickshot>powershot quickshot>fanshot piercearrow>fulldraw fulldraw>siegeshot fanshot>arrowrain arrowrain>skyvolley streamshot>skyvolley',
    1:'flamearrow>burstarrow burstarrow>firerain firerain>volcanoshot icearrow>glacialarrow glacialarrow>blizzardshot blizzardshot>glacialspike shockarrow>galearrow galearrow>cyclonearrow cyclonearrow>thunderarrow elementquiver>trinityarrow'},
  priest:{0:'smite>javelin smite>chainoflight javelin>radiance javelin>pillaroflight pillaroflight>rainoflight pillaroflight>judgment hammerofjustice>hammerofwrath javelin>godspear radiance>sacredsword judgment>grandcross',
    1:'holycross>symbolflash symbolflash>holychains symbolflash>waveoflight holychains>thunderprayer turnundead>blessedhammer turnundead>exorcircle exorcircle>greatjudgment holyfire>consecration consecration>holysun holysun>magnus waveoflight>sunsword'}};

// 공통 기술은 세 갈래 가운데 칸에 (skill27b.js 칸 배치)
for(const id of ['elementquiver','imbue','trinityarrow'])if(SPELLS[id])SPELLS[id].col27=1;

/* ---- 6. 없애기 (이름은 GONE_V19에 적어 두고, 합칠 곳은 MERGE_V19에 — skill19b.js가 단축칸 · 옵션 표를 만든다) ---- */
for(const id in GONE27){const s=SPELLS[id];if(s)GONE_V19[id]={n:s.n,cls:s.cls,rank:s.rank,v27:1};MERGE_V19[id]=GONE27[id];delete SPELLS[id]}
