/* ---------- v57 장비 기본 능력치 (사용자 2026-11-07 「주스탯과 체력은 장비 레벨에 비례하도록 기본적으로 붙어줘야 한다 …
   이 부분을 모든 아이템들에 반영하고, 비슷한 컨셉으로 장비 선택을 제한할 수밖에 없는 세팅이 되어 있다면 그것도 수정」) ----------
   · 모든 장비(무기 · 보조 · 갑옷/로브 · 모자 · 반지 · 목걸이, 모든 등급)에 기본 두 줄: 주 능력치(pri) + 생명력(hp).
     값 = 아이템 레벨 × 부위 몫 × 등급 배수 (무작위 없음). pri 1 = 지능 1(마법사 · 사제) = 힘 1(전사) = 민첩 1(궁수).
     주 능력치는 끼는 사람의 직업으로 센다 → 다른 직업이 줍던 반지 · 목걸이도 그대로 쓸모 있음.
   · 원래 옵션(지팡이 지능 · 무기 공격력 · 반지 마나 · 무작위 옵션 …)은 그대로. 등급이 높으면 옵션으로 지능 · 생명력이 더 붙을 수 있는 것도 그대로.
   · 옛 장비: 처음 볼 때(불러오기 · 장비 계산 · 가방/창고 줄) 기본 두 줄을 더하고 it.b57=1. 원래 값은 하나도 안 빼고, 두 번 더하지 않는다.
   저장: 장비 안 stats.pri · stats.hp 와 b57 표시만 늘어남. 캐릭터 키는 건드리지 않음. */
const G57={P:1.3,H:5,ver:1,
  share:{staff:{p:.30,h:.10},robe:{p:.20,h:.30},hat:{p:.15,h:.20},off:{p:.10,h:.15},ring:{p:.10,h:.10},amulet:{p:.15,h:.10}},
  rar:[1,1.05,1.12,1.18,1.25,1.35]};
const g57Main=cls=>PHYS_CLS[cls]?(cls==='warrior'?'str':'dex'):'int';
const G57_MN={int:'지능',str:'힘',dex:'민첩'};
function g57Base(it){const S=G57.share[it&&it.slot];if(!S)return null;const L=clamp(Math.round(Number(it.il)||1),1,MAXLV+3),m=G57.rar[clamp(it.rar|0,0,5)];
  return{pri:Math.max(1,Math.round(L*G57.P*S.p*m)),hp:Math.max(1,Math.round(L*G57.H*S.h*m))}}
SCALE.add('pri');
function g57Ensure(it){if(!it||typeof it!=='object'||!it.stats||typeof it.stats!=='object'||it.b57)return it;const b=g57Base(it);if(!b)return it;
  const st=it.stats,o={pri:Math.round((Number(st.pri)||0)+b.pri)};
  for(const k in st){if(k==='pri')continue;o[k]=st[k]}
  o.hp=Math.round((Number(st.hp)||0)+b.hp);it.stats=o;it.b57=G57.ver;return it}
const g57EnsureAll=list=>{if(Array.isArray(list))for(const it of list)g57Ensure(it);else if(list&&typeof list==='object')for(const k in list)g57Ensure(list[k])};
// 굴림 · 이름 · 비교 점수
{const _rs=rollStat;rollStat=function(k,il){if(k==='pri'){const m=rnd(.75,1.2);return 1+Math.round(il*G57.P*m)}return _rs.apply(this,arguments)}}
ITEM_W.pri=3;
{const _sn=statName;statName=function(k){if(k==='pri')return `주 능력치(${G57_MN[g57Main(P&&P.cls)]||'지능'})`;return _sn.apply(this,arguments)}}
// 모든 생성 경로 (드랍 · 상점 · 보상 · 모자 · 세트 · 유니크)
{const _mi=makeItem;makeItem=function(){return g57Ensure(_mi.apply(this,arguments))}}
// 장비 합계: 주 능력치를 직업의 주 능력치로
const G57_DONE=new WeakSet();
{const _gs=gearStats;gearStats=function(){if(P&&P.gear){let ch=false;for(const s in P.gear){const it=P.gear[s];if(it&&it.stats&&!it.b57){g57Ensure(it);ch=true}}if(ch)gsKey=''}
  const o=_gs.apply(this,arguments);if(o&&!G57_DONE.has(o)){G57_DONE.add(o);if(o.pri){const mk=g57Main(P.cls);o[mk]=Math.round(((o[mk]||0)+o.pri)*10)/10;delete o.pri}}return o}}
{const _ir=itemRow;itemRow=function(it){g57Ensure(it);return _ir.apply(this,arguments)}}
{const _is=itemScore;itemScore=function(it){g57Ensure(it);return _is.apply(this,arguments)}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok&&P){try{g57EnsureAll(P.gear);g57EnsureAll(P.bag);gsKey=''}catch(err){if(window.__QA)throw err}}return ok}}
/* 몬스터도 같이 (사용자 2026-11-07 결정 카드 「몬스터도 올리기」): 기본 능력치로 캐릭터가 세지는 만큼(희귀 장비 기준 위력 약 +20% · 생명력 +11~17%)
   모든 몬스터(들판 · 던전 · 보스 · 정예)의 생명력 ×1.2, 보스의 피해 ×1.13 · 준보스 피해 ×1.13(단, 한 대 28% 상한까지) (방장 · 혼자 화면. 참가자는 방장이 보낸 값을 그대로).
   들판 · 던전 일반 몬스터와 정예의 한 대 피해는 그대로: 「들판 몬스터 한 대 ≤ 맨몸 생명력의 15~30%」 규칙(FIELD_BUDGET · 어둠 단계와 같은 원칙).
   캐릭터를 본뜬 거울 몬스터(생명력이 캐릭터 기준)는 그대로. */
G57.mob={hp:1.2,dmg:1.13};
function g57Scale(e){if(!e||e.g57)return e;e.g57=1;if(NET.guest||e.net||e.mirror)return e;
  e.hp=Math.max(1,Math.round(e.hp*G57.mob.hp));e.max=Math.max(1,Math.round(e.max*G57.mob.hp));const T=TYPES[e.k]||{};if((T.boss||T.mini)&&Number.isFinite(e.dmg)){const up=e.dmg*G57.mob.dmg;
    // 준보스는 「한 대 ≤ 맨몸 생명력의 28%」(FIELD_BUDGET.mini) 상한까지만 → 이미 상한에 가까운 준보스는 덜 오르고, 원래 넘던 값은 그대로(내리지 않음)
    e.dmg=T.boss||typeof dm21Cap!=='function'?up:Math.max(e.dmg,Math.min(up,dm21Cap(e.k,e.lvl|0||1,!!e.elite)))}return e}
// 만들 때 바로 (던전 · 보스 · 정예 · 들판 우두머리 = dgMob, 들판 = spawnEnemy) → 만든 뒤 따로 정한 값(시험 · 대본 보스)은 그 값 그대로
{const _dm=dgMob;dgMob=function(){return g57Scale(_dm.apply(this,arguments))}}
{const _se=spawnEnemy;spawnEnemy=function(){const n=enemies.length,r=_se.apply(this,arguments);for(let i=n;i<enemies.length;i++)g57Scale(enemies[i]);return r}}
// 다른 길로 들어온 몬스터(현상금 분신 · 경이 등)는 처음 움직일 때 한 번
function g57Mob(){if(NET.guest)return;for(const e of enemies)if(e&&!e.g57&&!e.qa)g57Scale(e)}
{const _ue=updateEnemies;updateEnemies=function(dt){const r=_ue.apply(this,arguments);try{g57Mob()}catch(err){if(window.__QA)throw err}return r}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{G57,g57Base,g57Ensure,g57Main,g57Mob})}catch(_){}},0);
