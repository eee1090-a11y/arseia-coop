/* ---------- v19 (SKILL): 1차 스킬 정리 · 상위 기술 탭 데이터 · 3차 대비 (데이터) ----------
   설계: rpg/v19-design (v19-설계서.md · code/v19-skill-cleanup.js) + job-advancement-3/다른설계-변경요청.md 0·B절(가장 새 결정).
   ranks18.js 바로 뒤, b2.js(TREE·LINKS·PRE·TREEPOS·skLoad) 앞에 붙는다. 실행 중에 감싸는 코드는 skill19b.js.
   · 1차 스킬은 1~8위계(RANK_LV 1·5·10·16·23·31·38·45, b1.js). 옛 9위계는 2차 전직 뒤에 여는 「상위 기술」 탭으로 옮긴다
     (id·점수 그대로, tab:'adv' · upLv 50~60). 2차 전직(P.job2) 전에는 찍지도 쓰지도 못하고 잠겨 보이기만 한다.
   · 같은 일을 하는 스킬은 하나로 합친다(MERGE_V19: 없어지는 id → 남는 id). 2·3차가 가져가는 스킬은 1차에서 빼고 점수를 모두 돌려준다(RETIRE_V19).
   · 저장: skLoad(b2.js)가 없어진 스킬의 점수를 남는 스킬로 옮기고(최대 20 · 레벨 규칙), 못 옮긴 만큼은 스킬 포인트로 돌려준다.
     원래 점수는 P.skOld에 그대로 보관한다. 단축칸·장비 +스킬 옵션·같이 하기의 옛 판 동료도 남는 스킬로 이어진다.
   · 더 합치기: 나중에 합칠 표는 MERGE_MORE_V19에 넣으면(또는 V19_MORE.on) 저장 옮기기·단축칸·옵션·선행 연결이 저절로 따라온다. */

/* ---- 0. v18이 9위계로 올렸던 마법 중 1차에 남는 넷은 다시 8위계로 (v19에서 약하게 했거나 한 사람 치유가 됨) ---- */
for(const id of ['timestop','rewind','regeneration','inviolable'])if(SPELLS[id]&&SPELLS[id].rank>8)SPELLS[id].rank=8;

/* ---- 1. 상위 기술 탭 (2차 전직 뒤, 직업 공통 탭). 순서 = 열리는 순서 ---- */
const ADV_LV=[50,52,54,56,58,60];
const ADV_IDS={
  mage:['sunfall','heavenbolt','glacier','raisemountain','rendingsky','starlight'],
  priest:['aegis','apotheosis','benediction','magnus','returnmiracle','sunsword'],
  warrior:['sunderingstrike','heavenpiercer','undying','warlordroar'],
  archer:['skyvolley','trinityarrow','beastcage','apexhunt']};
for(const c in ADV_IDS)ADV_IDS[c].forEach((id,i)=>{const s=SPELLS[id];if(s){s.tab='adv';s.upLv=ADV_LV[i];s.rank=9}});
const isAdv=id=>!!(SPELLS[id]&&SPELLS[id].tab==='adv');
// 상위 기술은 2차 전직 뒤, 그 기술이 열리는 레벨부터. 상위 기술이 아니면 늘 true
function advUnlocked(id){const s=SPELLS[id];if(!s||s.tab!=='adv')return true;return !!(P&&P.job2)&&P.lvl>=s.upLv}
// 그 스킬의 요구 레벨 (상위 기술은 upLv, 1차는 위계 요구 레벨)
const reqLvOf=id=>{const s=SPELLS[id];return s&&s.upLv||RANK_LV[(s?s.rank:1)-1]||RANK_LV[RANK_LV.length-1]};

/* ---- 2. 합치기: 없어지는 스킬 → 합쳐지는 스킬 (점수 더하기, 넘치면 돌려받기) ---- */
const MERGE_V19={
  // 사제 · 심판
  holyspark:'smite',lightarrow:'smite',chastise:'hammerofjustice',avengersshield:'chainoflight',fistofheaven:'pillaroflight',
  gloriadomini:'godspear',condemn:'holysun',
  // 사제 · 퇴마
  holyburst:'turnundead',burningsigil:'exorcircle',
  // 사제 · 치유
  sanctuary:'healcircle',lingering:'renew',
  // 사제 · 축복
  magnificat:'wisdom',fortitude:'kings',herobless:'impositio',aspersio:'impositio',assumptio:'painsup',
  // 사제 · 수호
  grace:'guardianspirit',oath:'guardianspirit',safetywall:'barrier',
  // 마법사
  frost:'frostdiver',waterjet:'splash',lightspear:'lightning',doubledgust:'gust',crystallance:'fissure',twinflames:'firebolt',
  thunderrain:'lordvermilion',stormgust:'blizzard',
  // 상위 기술 안에서 겹치는 것 (2차 50레벨 전직, 사용자 17:00)
  splitcanyon:'rendingsky',spacerend:'rendingsky',monsoon:'starlight'};
// 더 합치기 — v20: 사용자가 「75개쯤」을 골라(2026-10-08 22:32) 켬. 마법사 1차 105 → 80개 (v19-설계서.md 4b절)
const MAGE_TRIM_V19={
  blazinggust:'flamelash',smokecall:'firewall',ringoffire:'firestorm',callmagma:'meteor',pillar:'meteor',firebirdflock:'firebird',heartoffire:'flamemantle',
  iceblade:'waterwhip',mire:'whirlpool',shardvolley:'frostarrow',endlesswinter:'blizzard',callrain:'blizzard',icecitadel:'iceshield',iceprison:'frostdiver',gatherdew:'arcaneheal',
  clearair:'gust',sandstorm:'dustdevil',thundervoice:'eyeofstorm',lightningbody:'windleap',windshaping:'whirlwind',
  sandshaping:'earthshaping',mudgrasp:'quicksand',
  slowtime:'hold',flash:'hold',heatoflight:'lancelight'};
const MAGE_TRIM_KEEP90=['pillar','iceprison','gatherdew','windshaping','mudgrasp'];
const V19_MORE={on:true,keep90:false};
const MERGE_MORE_V19={};// 다음 판에서 더 합칠 것을 여기에 (없어지는 id → 남는 id)
if(V19_MORE.on)for(const k in MAGE_TRIM_V19)if(!(V19_MORE.keep90&&MAGE_TRIM_KEEP90.includes(k)))MERGE_MORE_V19[k]=MAGE_TRIM_V19[k];
Object.assign(MERGE_V19,MERGE_MORE_V19);

/* ---- 3. 1차에서 빠지고 점수를 모두 돌려받는 것 (2·3차가 가져감). bar: 단축칸·장비 +스킬·옛 판 동료의 시전을 대신할 1차 스킬 ---- */
const RETIRE_V19={
  divinehymn:{bar:'salvation',to2:'archhymn'},stoneguardian:{bar:'quake',to2:'stonetitan'},
  seaofflame:{bar:'dragonbreath',to3:1},tidalwave:{bar:'turncurrent',to3:1},typhoon:{bar:'callstorm',to3:1},wrath:{bar:'greatjudgment',to3:1},
  skyfire:{bar:'meteor',to2:'meteorswarm'},thousandspears:{bar:'godspear',to2:'heavenblades'}};

// 없어진 id → 지금 쓰는 id (합치기가 여러 번 이어져도 끝까지 따라감). 모르면 null
function mergeTo(id){let x=id,n=0;while(x&&!SPELLS[x]&&n++<8)x=MERGE_V19[x]||(RETIRE_V19[x]&&RETIRE_V19[x].bar)||null;return x&&SPELLS[x]?x:null}
const mapGoneV19=x=>x&&!SPELLS[x]?(mergeTo(x)||x):x;
// 없어진 스킬의 이름·직업 (알림·#qa용) — 지우기 전에 적어 둔다
const GONE_V19={};
for(const id of [...Object.keys(MERGE_V19),...Object.keys(RETIRE_V19)]){const s=SPELLS[id];if(s)GONE_V19[id]={n:s.n,cls:s.cls,rank:s.rank};delete SPELLS[id]}

/* ---- 4. 남는 스킬의 바뀐 값 (없어진 스킬의 좋은 점을 가져온다 · 덧셈 규칙 그대로) ---- */
const SPELL_PATCH_V19={
  smite:{rank:1,cost:4,cd:.4,mult:1.3,spd:680,r:6,stun:0,ud:2,lvTier:[8,15],
    desc:'빛을 화살처럼 벼려 내리칩니다. 사제의 기본 공격. 부정한 것(언데드)에게 두 배. 스킬 레벨이 오를수록(8·15레벨) 빛이 굵고 무거워집니다.'},
  hammerofjustice:{mult:1.4,cd:8,stun:1.6,desc:'판결의 망치를 내리쳐 적 하나를 1.6초 동안 꼼짝 못 하게 합니다(스킬 레벨마다 조금씩 길어짐).'},
  chainoflight:{stun:.3,desc:'빛이 적에서 적으로 다섯 번 튀며 맞은 적을 잠깐 멈칫하게 합니다.'},
  pillaroflight:{mult:3.8,rad:100,stun:.4,desc:'한 곳에 빛의 기둥을 떨어뜨려 둘레를 치고 잠깐 멈칫하게 합니다.'},
  godspear:{cd:8,desc:'하늘에서 거대한 빛의 창을 내려 적 하나와 그 곁을 꿰뚫습니다. 사제의 가장 무거운 한 방.'},
  holysun:{slow:1,desc:'작은 해를 띄워 6초 동안 그 아래의 적을 느리게 하고 태웁니다.'},
  turnundead:{rank:2,cost:8,cd:2.5,mult:1,rad:140,ud:3,knock:60,desc:'사방으로 빛을 터뜨려 둘레의 적을 밀어냅니다. 재사용이 짧아 몰려든 적을 자주 칠 수 있습니다. 언데드에게 세 배.'},
  exorcircle:{burn:1,desc:'내 둘레에 원을 그어 5초 동안 안의 적을 태웁니다. 언데드에게 세 배.'},
  healcircle:{mult:.4,ud:3,desc:'8초 동안 나를 따라다니는 치유의 원. 안의 동료가 천천히 낫고, 안에 들어온 적은 타며 언데드는 세 배로 탑니다.'},
  renew:{mana:.08,desc:'12초 동안 상처가 조금씩 아물고 마나도 조금 차오릅니다. 나와 둘레의 동료에게 걸립니다.'},
  wisdom:{regen:3.5,cdr:.03,desc:'마음을 맑게 해 마나 회복이 크게 늘고 재사용 대기가 조금 줄어듭니다. 파티원에게도 걸립니다.'},
  kings:{hp:.14,life:.002,desc:'최대 생명력이 늘고, 받는 피해가 조금 줄고, 피해가 조금 오르며, 생명력이 천천히 찹니다. 파티원에게도 걸립니다.'},
  // 「한 명」 마법(party18.js)이라 피해는 0.25로 정해진다
  impositio:{dur:12,dmg:.22,crit:.03,desc:'손을 얹어 12초 동안 피해와 치명타를 올립니다. 짧은 강화라 싸움이 몰릴 때 맞춰 거세요.'},
  painsup:{desc:'8초 동안 받는 피해가 절반으로 줄어듭니다. 보스의 큰 공격 앞에서 쓰세요.'},
  guardianspirit:{desc:'10초 동안 곁을 지켜 받는 치유가 40% 늘고, 쓰러질 일격을 한 번 막아 생명력 50%로 일으킵니다.'},
  barrier:{rank:3,rad:90,dur:7,drf:.3,block:1,heal:.015,cd:40,role:'wall',desc:'빛의 벽을 세워 7초 동안 날아드는 투사체를 막고, 안에 선 사람이 받는 피해를 30% 줄이며 조금씩 낫게 합니다. 스킬 레벨이 오르면 넓어집니다.'},
  // 마법사
  frostdiver:{desc:'바닥을 타고 달리는 얼음 줄기로 적 하나를 꽁꽁 얼립니다.'},
  splash:{mult:1,knock:40,desc:'물을 세게 끼얹어 적을 밀어내고 느리게 합니다.'},
  lightning:{mult:2.4,len:480,desc:'손끝에서 벼락을 뽑아 멀리까지 일직선의 적을 모두 꿰뚫습니다.'},
  gust:{knock:110,knockLv:4,desc:'바람으로 앞쪽의 적을 밀어냅니다. 스킬 레벨이 오를수록 더 멀리 밀어냅니다.'},
  fissure:{mult:1.8,len:380,desc:'땅을 일직선으로 갈라 위의 적을 쓰러뜨립니다.'},
  firebolt:{cntAt:10,cntMul:.65,desc:'불덩이를 날려 보냅니다. 맞은 적은 3초간 불탑니다. 스킬 레벨 10부터 두 발을 겹쳐 쏩니다(한 발의 힘은 조금 줄어 둘을 합치면 1.3배).'},
  lordvermilion:{desc:'누르고 있는 동안 넓은 땅에 붉은 벼락을 끝없이 내리꽂습니다.'},
  blizzard:{freeze:.6,desc:'누르고 있는 동안 얼음 섞인 바람을 몰아쳐 적을 느리게 하고 이따금 얼립니다.'}};
// v20: 마법사 1차 더 합치기 — 불새 무리·샤드 발리의 「여러 발」은 원래 있던 레벨 규칙(5레벨마다 한 발, eff)으로 이어진다는 것을 설명에 적는다
if(V19_MORE.on)Object.assign(SPELL_PATCH_V19,{
  firebird:{desc:'불의 정령을 새의 모습으로 불러 적을 쫓게 합니다. 스킬 레벨 5마다 한 마리씩 늘어 16레벨부터 여섯 마리가 됩니다.'},
  frostarrow:{desc:'얼음 조각을 부채꼴로 쏘아 맞은 적을 느리게 합니다. 스킬 레벨 5마다 한 조각씩 늘어 16레벨부터 여섯 조각이 됩니다.'}});

/* ---- 5. 한 사람 치유 (v18 「한 명」 대상 지정 그대로) · 기도한 뒤 한 번에 채우는 치유. 시전 시간은 skill19b.js가 CAST_T에 넣는다 ---- */
const HEAL_PATCH_V19={
  minorheal:{cd:2.5,desc:'작은 상처를 곧바로 아물게 합니다. 재사용이 짧은 기본 치유.'},
  closewounds:{desc:'깊은 상처를 곧바로 붙입니다. 생명력이 적을수록 더 많이 낫습니다(빈사일 때 최대 2.5배).'},
  greaterheal:{cd:6,desc:'1.5초 동안 기도한 뒤 생명력을 한 번에 크게 채웁니다.'},
  regeneration:{cd:90,desc:'2초 동안 기도한 뒤 생명력을 모두 채웁니다. 재사용 대기가 길어 정말 위급할 때만.'},
  resurrection:{pct:.3,desc:'3초 동안 기도해 쓰러진 동료를 생명력 30%로 되살립니다. 같이 하기 전용.'}};
const CAST_V19={greaterheal:1.5,regeneration:2,resurrection:3};

/* ---- 6. 3차 전직을 생각한 1차 정리 (너무 센 것 약하게) ---- */
const STRONG_PATCH_V19={
  timestop:{rad:240,freeze:2.5,cd:90,bossFreeze:.5,desc:'둘레의 시간을 몇 호흡 멈춥니다. 주변의 적이 2.5초 동안 멈춥니다(보스는 0.5초).'},
  rewind:{resetcd:0,resetRank:6,desc:'몸의 시간을 몇 호흡 되감아 상처를 되돌리고, 6위계 이하 마법의 재사용 대기를 지웁니다.'},
  returnmiracle:{heal:.4,inv:1.5,cd:300,dur:60,desc:'60초 안에 쓰러지면 생명력 40%로 일어서며 1.5초 동안 어떤 해도 닿지 못합니다.'}};

/* ---- 7. 초반 솔로 광역 (직업마다 5레벨(2위계)까지 하나씩 · 재사용 짧고 피해는 작게). 마법사는 이미 있음 ---- */
const EARLY_AOE_V19={
  crossslash:{rank:2,mult:1.5,cd:2,max:5,desc:'칼을 십자로 휘둘러 앞쪽의 적 다섯까지 벱니다. 재사용이 짧은 초반 광역 기술.'},
  sweep:{cd:2},
  fanshot:{rank:2,mult:.6,cd:2,cost:10,desc:'화살 다섯 대를 부채꼴로 흩뿌립니다. 재사용이 짧은 초반 광역 기술.'}};

/* ---- 8. 전사·궁수: 2·3차와 겹치는 것 ---- */
const CLS_PATCH_V19={
  undying:{heal:.25,inv:.05,taunt:0,desc:'30초 안에 쓰러질 일격을 한 번 버텨 생명력 25%로 일어섭니다. 재사용 3분.'}};
for(const P_ of [SPELL_PATCH_V19,HEAL_PATCH_V19,STRONG_PATCH_V19,EARLY_AOE_V19,CLS_PATCH_V19])for(const id in P_)if(SPELLS[id])Object.assign(SPELLS[id],P_[id]);

/* ---- 9. 화면 이름 (id 그대로) — 2·3차 이름과 겹치는 것 ---- */
const RENAME_V19={
  returnmiracle:{n:'세컨드 던',kn:'두 번째 새벽',en:'Second Dawn',chant:'새벽은 한 번 더 온다'},
  benediction:{n:'래디언트 베네딕션',kn:'찬란한 축복',en:'Radiant Benediction',chant:'빛이여, 모두에게 내리소서'},
  sunsword:{n:'선라이즈',kn:'해돋이',en:'Sunrise',chant:'해여, 떠올라라',desc:'떠오르는 해의 빛을 앞쪽으로 크게 펼쳐 태웁니다.'},
  sacredsword:{n:'헤븐스 레이',kn:'하늘의 빛줄기',en:"Heaven's Ray",chant:'하늘이여, 길을 내소서',desc:'하늘에서 내린 빛줄기가 먼 곳까지 일직선을 가릅니다.'},
  firebird:{n:'파이어버드',kn:'불새',en:'Firebird'},
  firebirdflock:{n:'파이어버드 스웜',kn:'불새 무리',en:'Flock of Firebirds'},
  warlordroar:{n:'배틀 로어',kn:'전장의 포효',en:'Battlefield Roar'},
  hawkeye:{n:'킨 아이',kn:'예리한 눈',en:'Keen Eye'}};
for(const id in RENAME_V19){const s=SPELLS[id];if(s)Object.assign(s,RENAME_V19[id])}
// 사용자 규칙: 설명에 어느 게임에서 가져왔는지 쓰지 않는다 (v18이 지운 뒤에도 한 번 더)
const SRC_GAME_RE_V19=/\s*\((라그나로크|월드 ?오브 ?워크래프트[^)]*|와우|WoW|디아블로 ?2?[^)]*|D&D)\)/g;
for(const id in SPELLS){const s=SPELLS[id];if(s.desc)s.desc=s.desc.replace(SRC_GAME_RE_V19,'').trim()}

/* ---- 10. 칭호: 1차 맨 위는 8위계에서 (대마법사·대주교·성자·기사단장·신궁은 2·3차 몫) ---- */
const GRADE_V19={
  mage:['견습 마법사','견습 마법사','하급 마법사','하급 마법사','중급 마법사','중급 마법사','상급 마법사','고위 마법사'],
  priest:['견습사제','견습사제','사제','사제','고위사제','고위사제','주교','주교'],
  warrior:['훈련병','훈련병','병사','병사','숙련 전사','숙련 전사','기사','기사'],
  archer:['견습 사수','견습 사수','사수','사수','숙련 사수','숙련 사수','명사수','명사수']};
for(const c in GRADE_V19)if(CLASSES[c])CLASSES[c].grade=GRADE_V19[c];
if(CLASSES.priest)CLASSES.priest.start=['smite'];

/* ---- 11. 선행 연결 (b2.js가 LINKS·LINKS_V18 다음에 읽는다). 없어진 id가 든 옛 줄은 b2.js가 저절로 건너뛴다 ---- */
const LINKS_V19=`smite>javelin smite>chainoflight smite>holyfire turnundead>exorcircle exorcircle>holysun turnundead>greatjudgment
minorheal>renew renew>healcircle closewounds>greaterheal
blessing>impositio impositio>benediction wisdom>kings lightward>barrier guardianspirit>painsup
splash>frostdiver frostdiver>frostarrow splash>waterwhip whirlpool>blizzard blizzard>endlesswinter
static>lightning lightning>rendingsky hail>lordvermilion gust>windblade fissure>quake fissure>magmariver
slash>crossslash quickshot>fanshot`;

/* ---- 12. 같은 버프는 더 강한 쪽(시전자의 스킬 레벨이 높은 쪽)이 남는다 · 약한 것은 기다렸다가 이어진다 ---- */
// 같은 레벨이면 남은 시간이 긴 쪽(= 다시 걸면 새로 고침). 대기는 하나만(그중 강한 것)
const buffStronger=(a,b)=>a.L>b.L||(a.L===b.L&&a.t>=b.t);
function putBuffV19(id,nb,by,s){const o=P.buffs[id],col=EL[s.el]||EL.holy;
  if(o&&o.t>0&&(o.L||0)>nb.L){if(!o.wait||buffStronger(nb,o.wait))o.wait=nb;
    msg(`${by}${s.n} ${nb.L}레벨: 더 강한 ${s.n}(${o.L}레벨)이 걸려 있어 그게 끝나면 이어집니다`,'#a39d8f');return false}
  // 새것이 더 강하거나 같음: 지금 것(더 약하면)이나 그 대기 중 강한 쪽을 대기로 둔다
  let w=null;if(o&&o.t>0){if((o.L||0)<nb.L)w=o.wait&&buffStronger(o.wait,o)?o.wait:o;else w=o.wait||null}
  if(w)w.wait=null;nb.wait=w;P.buffs[id]=nb;msg(`${by}${s.n} (${nb.L}레벨)`,col);return true}
// 버프 시간 흐르기 (b3.js update): 대기도 같이 흐르고, 강한 것이 끝나면 대기가 남은 시간만큼 이어진다
function tickBuffsV19(dt){for(const id in P.buffs){const b=P.buffs[id];b.t-=dt;if(b.wait){b.wait.t-=dt;if(b.wait.t<=0)b.wait=null}
  if(b.t<=0){if(b.wait&&!id.startsWith('_')){P.buffs[id]=b.wait;b.wait.wait=null}else delete P.buffs[id];P.hp=Math.min(P.hp,maxHp())}}}
// 지속 치유: 남은 치유량(rate×t)이 큰 쪽이 남는다 (대기 없음)
function putHotV19(nh,by,s){const o=P.hot;if(o&&o.t>0&&o.rate*o.t>nh.rate*nh.t+1e-6){if(s)msg(`${by}${s.n}: 더 큰 지속 치유가 이미 걸려 있습니다`,'#a39d8f');return false}P.hot=nh;return true}
// 가호(쓰러지지 않게): 일으키는 생명력(heal)이 큰 쪽이 남는다 (같으면 새로 고침)
function putWardV19(nw,by,s){const o=P.ward;if(o&&o.t>0&&o.heal>nw.heal+1e-6){msg(`${by}${s.n}: 더 강한 ${o.n}이(가) 이미 걸려 있습니다`,'#a39d8f');return false}P.ward=nw;return true}
