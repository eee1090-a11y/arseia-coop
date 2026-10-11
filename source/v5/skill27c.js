/* ---------- v27 (SKILL): 흔한 이름 · 새 스킬 시전 시간 · 아이콘 · 저장 옮기기 (맨 뒤, qa.js 앞) ----------
   데이터는 skill27.js, 선행 · 칸은 skill27b.js.
   · 이름(사용자 5번): 많은 게임에서 흔히 쓰는 이름이 있으면 그 이름으로. 낮은 위계일수록 기본 이름(던 블레싱 → 블레싱),
     높은 위계는 지금의 멋진 이름을 그대로 둔다. 표시 이름(n)만 바꾸고 id는 그대로(저장 · 단축칸 · 장비 옵션 안전).
   · 시전 시간: 새 큰 기술 둘(볼케이노 샷 0.8초 · 글레이셜 스파이크 0.7초). cast24.js와 같은 규칙으로 기본 배율 ×(1+0.15×시전 초).
   · 저장: 하는 일이 크게 바뀐 궁수 원소 사격 스킬(REFUND27)에 찍은 점수는 이 판을 처음 불러올 때 한 번 스킬 포인트로 돌려준다.
     원래 점수는 저장의 rs27.old에 보관. 저장에 rs27이 있으면 다시 돌려주지 않는다. 캐릭터 키는 지우거나 비우지 않는다(불러온 값의 사본만 고침).
     자리만 옮긴 스킬(사제 심판 ↔ 퇴마 등)은 점수 그대로. 없어진 두 발 쏘기 · 빛의 회오리는 v19와 같은 길로 파워 샷 · 턴 언데드로 옮겨진다. */
const RENAME27={
  // 사제
  blessing:'블레싱',agiup:'헤이스트',lightward:'홀리 실드',barrier:'배리어',closewounds:'하이 힐',renew:'리제너레이션',prayerheal:'매스 힐',
  holycross:'홀리 크로스',holyfire:'홀리 파이어',consecration:'컨세크레이션',greatjudgment:'홀리 노바',
  // 마법사
  spark:'파이어 볼트',splash:'워터 볼트',windblade:'윈드 커터',arcanemissiles:'매직 미사일',
  // 전사
  shieldbash:'실드 배시',doubleslash:'더블 슬래시',crossslash:'크로스 슬래시',swordmastery:'소드 마스터리',polearmmastery:'폴암 마스터리',
  shieldcharge:'실드 차지',bladedance:'블레이드 댄스',taunt:'타운트',laststand:'라스트 스탠드',
  // 궁수
  fanshot:'멀티플 샷',fulldraw:'차지 샷',streamshot:'래피드 샷',steadyhand:'보우 마스터리',powershot:'파워 샷',
  flamearrow:'플레임 애로우',icearrow:'프로스트 애로우',shockarrow:'윈드 애로우',
  burstarrow:'익스플로시브 애로우',glacialarrow:'프리징 애로우',galearrow:'게일 애로우',
  firerain:'파이어 레인',blizzardshot:'블리자드 샷',cyclonearrow:'사이클론 애로우',
  volcanoshot:'볼케이노 샷',glacialspike:'글레이셜 스파이크',thunderarrow:'썬더스톰 애로우'};
// 하는 일이 바뀐 스킬의 설정 이름(kn) · 영어 이름
const KN27={shockarrow:['바람 화살','Wind Arrow'],thunderarrow:['폭풍 화살','Thunderstorm Arrow'],burstarrow:['터지는 화살','Explosive Arrow'],
  glacialarrow:['얼리는 화살','Freezing Arrow'],greatjudgment:['정화의 빛','Holy Nova']};
for(const id in RENAME27)if(SPELLS[id])SPELLS[id].n=RENAME27[id];
for(const id in KN27)if(SPELLS[id]){SPELLS[id].kn=KN27[id][0];SPELLS[id].en=KN27[id][1]}
if(CLASSES.archer&&CLASSES.archer.trees)CLASSES.archer.trees[1]='원소 사격';
if(CLASSES.archer)CLASSES.archer.desc='멀리서 활을 당깁니다. 민첩이 오를수록 강해지고 잘 맞힙니다. 덫과 사냥 동료, 그리고 화염 · 냉기 · 바람 중 고른 원소 사격을 씁니다.';

/* ---- 시전 시간 (cast24.js와 같은 규칙) ---- */
const CAST_T27={volcanoshot:.8,glacialspike:.7};
for(const id in CAST_T27){const s=SPELLS[id];if(!s||CAST_T[id])continue;CAST_T[id]=CAST_T27[id];s.mult=Math.round(s.mult*(1+.15*CAST_T27[id])*1000)/1000}

/* ---- 아이콘 (iconsphys.js 문양 조각) ---- */
Object.assign(ICP,{
  powershot:c=>ICX.bow(12,20,-45,.85,1)+ICX.arrow(18,14,-45,1.05)+ICX.burst(26,6,.4,'#fff'),
  shockarrow:c=>ICX.lines(8,24,-45,.6,PAL.wind[0],3)+ICX.arrow(17,15,-45,1,PAL.wind[2],PAL.wind[0])+ICX.path('M6 10q6-4 12 0',PAL.wind[0],1.2,.8),
  galearrow:c=>ICX.path('M3 22q8-6 16-2t10-4',PAL.wind[0],1.6,.8)+ICX.path('M3 14q8-6 16-2',PAL.wind[0],1.2,.6)+ICX.arrow(18,14,-20,1,PAL.wind[2],PAL.wind[0]),
  cyclonearrow:c=>ICX.spiral(16,16,1.15,PAL.wind[0])+ICX.arrow(16,13,-45,.65,PAL.wind[2],PAL.wind[0]),
  thunderarrow:c=>ICX.cloud(16,6,.85,'#5a6088')+ICX.zap(9,19,0,.7)+ICX.zap(22,21,0,.7)+ICX.spiral(16,24,.5,PAL.wind[0])+ICX.arrow(16,15,-80,.5,PAL.storm[2],PAL.storm[0]),
  firerain:c=>ICX.cloud(16,6,.85,'#7a3a2a')+[[9,15],[15,19],[21,14],[25,21],[12,24]].map(([x,y])=>ICX.arrow(x,y,70,.4,PAL.fire[0],PAL.fire[0])).join('')+ICX.flame(18,26,.4),
  volcanoshot:c=>ICX.path('M4 28L12 16 16 20 20 14 28 28z','#5a2a18',1.2)+ICX.flame(16,13,.9)+ICX.burst(16,13,.7,PAL.fire[0],9)+ICX.arrow(9,22,-60,.5,PAL.fire[0],PAL.fire[0]),
  blizzardshot:c=>ICX.cloud(16,8,.85,'#7a90a8')+ICX.flake(10,20,.5)+ICX.flake(21,23,.55)+ICX.flake(16,16,.45)+ICX.arrow(24,12,110,.5,PAL.ice[2],PAL.ice[0]),
  glacialspike:c=>`<path d="M16 3L20 26H12z" fill="${PAL.ice[0]}" stroke="${PAL.ice[1]}" stroke-width=".8"/><path d="M8 12L11 27H5z M24 12L27 27H21z" fill="${PAL.ice[2]}" stroke="${PAL.ice[1]}" stroke-width=".6" opacity=".9"/>`+ICX.ring(16,27,.7,PAL.ice[0])});

/* ---- 저장: 바뀐 원소 사격 스킬의 점수를 한 번 돌려주기 ---- */
const REFUND27={archer:['flamearrow','icearrow','shockarrow','burstarrow','glacialarrow','thunderarrow']};
const rs27Clean=x=>{const o={v:1};if(x&&typeof x==='object'&&!Array.isArray(x)&&x.old&&typeof x.old==='object'&&!Array.isArray(x.old)){const old={};for(const k in x.old){const v=x.old[k]|0;if(v>0&&v<=99)old[k]=v}if(Object.keys(old).length)o.old=old}return o};
// 불러올 저장(d)의 사본에서 돌려줄 점수를 빼고 sp에 더한다 (d 자체는 고치지 않음)
function rs27Fix(d){if(!d||typeof d!=='object'||d.rs27||!(d.v>=4)||!d.sk||typeof d.sk!=='object'||!REFUND27[d.cls])return {d,n:0};
  const sk=Object.assign({},d.sk),old={};let n=0;
  for(const id of REFUND27[d.cls]){const v=clamp(sk[id]|0,0,MAXSK);if(v>0){old[id]=v;n+=v}delete sk[id]}
  if(!n)return {d,n:0};
  return {d:Object.assign({},d,{sk,sp:(d.sp|0)+n,rs27:{v:1,old}}),n,old}}
{const _ld=load;load=function(d,slot){const f=rs27Fix(d);const ok=_ld.call(this,f.d,slot);
  if(ok&&P){P.rs27=rs27Clean(f.d&&f.d.rs27);
    if(f.n>0)setTimeout(()=>{msg(`원소 사격이 화염 · 냉기 · 바람 세 갈래로 새로 짜였습니다. 바뀐 원소 화살에 찍었던 ${f.n}점을 스킬 포인트로 돌려받았습니다`,'#ffd76a');msg('스킬 트리(T)의 「원소 사격」에서 갈래를 골라 다시 찍으세요','#ffd76a')},700)}
  return ok}}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P)d.rs27=rs27Clean(P.rs27)}catch(err){if(window.__QA)throw err}return d}}

setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{RENAME27,REFUND27,GONE27,LINKS27,CAST_T27,rs27Fix})}catch(_){}},0);
