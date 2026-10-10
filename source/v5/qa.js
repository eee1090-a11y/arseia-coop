
/* ---------- QA: 자가 점검 모드(#qa) ----------
   게임 IIFE 안, b5.js 바로 앞에 붙는다. location.hash가 '#qa'이고 qa0.js가 준비됐을 때만 동작한다.
   b5.js에서 정의되는 것(bindTo, load, saveNow, introButtons, panel …)은 점검이 돌 때(페이지가 다 읽힌 뒤) 부른다.
   게임 규칙·숫자·저장 로직은 바꾸지 않는다. 허수아비 몬스터 종류(qa_dummy)도 #qa일 때만 실행 중에 더한다. */
if(location.hash==='#qa'&&window.__QA&&window.__QA.on){
const QA=window.__QA;
/* ===== 저장 견본(fixtures): load()가 읽는 모양을 따라 만든 버전별 저장 =====
   v1 옛 키(arseia-apprentice-save-v1)는 v2/v3 모양 한 칸짜리 저장. v<4는 스킬 트리 이전(포인트를 돌려받는 경로).
   v4: sk/sp/st/ap/diff/bar가 생김. v5: reg(지역), q(의뢰), slot, uid가 생김. 계정 칸: arseia-g-<uid>-char-N.
   나중 버전에서도 계속 같은 견본으로 점검한다. */
const QA_ITEM=(id,slot,rar,name,il,stats,extra)=>Object.assign({id,slot,rar,name,il,stats,cls:extra&&extra.cls||'mage'},extra||{});
const QA_FIX={
  v1old:{v:3,cls:'mage',lvl:12,xp:999999,gold:1234,towns:['brenhill','willowen'],home:'willowen',x:3500,y:4560,hp:150,mp:80,pot:{hp:2,mp:5},
    gear:{staff:QA_ITEM(11,'staff',1,'현자의 물푸레 지팡이',11,{int:15,crit:3}),robe:null,ring:QA_ITEM(12,'ring',0,'은 반지',9,{mp:35}),amulet:null},bag:[QA_ITEM(13,'robe',2,'고대의 누빈 로브',10,{hp:60,regen:1.5,cdr:5})],uid:20},
  v2:{v:2,cls:'priest',lvl:7,xp:120,gold:300,towns:['brenhill'],home:'brenhill',x:1500,y:4810,hp:90,mp:40,pot:{hp:3,mp:3},gear:{staff:null,robe:null,ring:null,amulet:null},bag:[],uid:5},
  v4:{v:4,cls:'priest',lvl:30,xp:2000,gold:5000,towns:['brenhill','willowen','haven'],home:'haven',x:4500,y:2760,hp:300,mp:120,pot:{hp:4,mp:2},
    gear:{staff:QA_ITEM(31,'staff',2,'축복받은 룬 지팡이',28,{int:40,tr_0:1,crit:5},{cls:'priest'}),robe:QA_ITEM(32,'robe',3,'성녀의 베일',28,{hp:150,tr_2:1,dr:5},{cls:'priest',set:'saint'}),ring:null,amulet:null},
    bag:[QA_ITEM(33,'amulet',4,'아우렐의 눈물',27,{regen:4.5,tr_2:1,ls:3,all:1},{cls:'priest'})],
    sk:{holyspark:5,lightarrow:3,minorheal:4,blessing:2},sp:4,st:{int:50,vit:40,spi:30},ap:3,diff:1,bar:['holyspark','lightarrow',null,'minorheal','blessing'].concat(Array(16).fill(null)),uid:40},
  v5:{v:5,slot:0,cls:'mage',lvl:41,xp:7777,gold:98765,towns:['brenhill','willowen','haven','arden','goldmere','sahar'],home:'goldmere',x:3000,y:900,reg:'desert',hp:500,mp:300,pot:{hp:9,mp:8},
    gear:{staff:QA_ITEM(51,'staff',5,'아르실의 망령 지팡이',44,{int:90,all:2,crit:8,ls:3,proc_frost:15}),robe:null,ring:QA_ITEM(52,'ring',3,'발케르의 불씨 반지',40,{mp:150,tr_0:1,cdr:6},{set:'valker'}),amulet:QA_ITEM(53,'amulet',1,'별빛의 별의 목걸이',40,{regen:5.2,int:20})},
    bag:[QA_ITEM(54,'staff',0,'용뼈 지팡이',40,{int:50})],sk:{spark:10,firebolt:8,fireburst:5,meteor:3,warmth:4,blink:1},sp:2,st:{int:120,vit:60,spi:50},ap:0,diff:1,
    bar:['firebolt','meteor','blink'].concat(Array(18).fill(null)),q:{i:4,st:1,c:{0:3}},uid:60},
  // 손상 정리: 잘못된 값들이 load()에서 걸러지는지
  v5dirty:{v:5,slot:3,cls:'mage',lvl:99,xp:-5,gold:'12',towns:['brenhill','atlantis'],home:'brenhill',x:-500,y:99999,reg:'atlantis',hp:-1,mp:0,
    gear:{staff:QA_ITEM(71,'staff',3,'세트 표시 없는 지팡이',30,{int:10}),robe:QA_ITEM(72,'robe',9,'너무 높은 등급',30,{hp:10}),ring:{id:73,slot:'boots',rar:1,name:'없는 칸',il:3,stats:{}},amulet:{id:74,slot:'amulet',rar:1,name:'능력치 없음',il:3}},
    bag:Array.from({length:45},(_,i)=>QA_ITEM(100+i,'ring',0,'구리 반지',3,{mp:8})),sk:{spark:35,holyspark:5,nosuch:3,warmth:2},sp:1,st:{int:20},ap:0,diff:5,
    bar:['spark','warmth','holyspark','nosuch'].concat(Array(17).fill(null)),q:{i:999,st:7,c:null},uid:200},
  v6future:{v:6,cls:'mage',lvl:10,gold:1,towns:['brenhill']},
  stash:{v:1,items:[QA_ITEM(301,'staff',2,'창고의 지팡이',20,{int:30}),{id:302,slot:'boots',rar:1,name:'없는 칸',il:3,stats:{}},QA_ITEM(303,'ring',3,'세트 표시 없는 반지',20,{mp:40})]},
};
const QA_OLDKEY='arseia-apprentice-save-v1';
// 시작하자마자(b5.js의 옛 저장 옮기기보다 먼저) 옛 키를 가짜 저장소에 넣어 둔다
try{QA.phase='fixture';localStorage.setItem(QA_OLDKEY,JSON.stringify(QA_FIX.v1old));QA.phase=''}catch(e){QA.fixErr=String(e)}

/* ===== 점검 도구 ===== */
const QT=[];const qT=(group,name,fn)=>QT.push({group,name,fn});
class QAFail extends Error{}
const qOk=(c,why)=>{if(!c)throw new QAFail(why)};
const qNum=v=>typeof v==='number'&&isFinite(v);
const qR=v=>Math.round(v*100)/100;
const QA_SLOT=7,QA_SPOT={x:1500,y:3900};
const qSleep=()=>new Promise(r=>setTimeout(r,0));
function qBad(){const b=[];if(!qNum(P.x)||!qNum(P.y))b.push('P 위치 NaN');if(!qNum(P.hp)||!qNum(P.mp))b.push('P 생명/마나 NaN');
  for(const e of enemies)if(!qNum(e.x)||!qNum(e.y)||!qNum(e.hp)){b.push(`몬스터 ${e.k} NaN`);break}
  for(const p of projs)if(!qNum(p.x)||!qNum(p.y)){b.push('투사체 NaN');break}
  for(const a of allies)if(!qNum(a.x)||!qNum(a.y)||!qNum(a.hp)){b.push('소환수 NaN');break}
  return b}
// n프레임 진행. opt.render: 매 프레임 그리기(기본: 마지막에 한 번), opt.until: 참이면 멈춤, opt.spawn: 자동 생성 허용
function qStep(n,opt){opt=opt||{};const dt=opt.dt||1/60;
  for(let i=0;i<n;i++){if(!opt.spawn)spawnT=1e9;if(opt.each)opt.each(i);update(dt);if(opt.render===true||(opt.render!==false&&opt.renderEvery&&i%opt.renderEvery===0))render();
    const b=qBad();if(b.length)throw new QAFail(b.join(', ')+` (${i}프레임)`);if(opt.until&&opt.until(i))return i+1}
  if(opt.render==null&&!opt.renderEvery)render();return n}
function qClear(){enemies=[];projs=[];fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];allies=[];beams=[];pillars=[];bolts=[];rings=[];parts=[];texts=[];
  P.storm=null;P.orbits=null;P.armor=null;P.hot=null;P.ward=null;P.shield=0;P.shieldT=0;P.buffs={};P.cd={};P.invT=0;castReset()}
function qClosePanels(){try{if(!panel.hidden)closePanel()}catch(_){}bindId=null;const pt=$('#patch');if(pt)pt.hidden=true}
// 새 캐릭터로 깨끗하게 시작 (게임의 newGame 경로)
function qPrep(cls,o){o=o||{};qClosePanels();if(DG)leaveDungeon();if(REG.id!=='home')loadRegion('home');if(typeof K22!=='undefined'){K22.m.clear();K22.off=0}/* v22: 시험마다 던전 기억을 비움 */
  newGame(cls,o.slot!=null?o.slot:QA_SLOT);$('#death').hidden=true;
  P.lvl=o.lvl||60;P.x=(o.at||QA_SPOT).x;P.y=(o.at||QA_SPOT).y;qClear();P.hp=maxHp();P.mp=maxMp();
  keys.clear();mouse.l=mouse.r=false;mouse.active=false;touchMode=false;joy=null;fireTouch=null;paused=false;spawnT=1e9;followCam();return P}
// 움직이지 않고 죽지 않는 허수아비: 위치·생명력이 고정이고, 받은 피해를 taken에 모은다
function qDummy(x,y,o){o=o||{};const e=dgMob('qa_dummy',x,y,o.lvl||10);let taken=0,hits=0;const fx=x,fy=y,HP=1e9;
  Object.defineProperty(e,'x',{configurable:true,enumerable:true,get:()=>fx,set(){}});Object.defineProperty(e,'y',{configurable:true,enumerable:true,get:()=>fy,set(){}});
  Object.defineProperty(e,'hp',{configurable:true,enumerable:true,get:()=>HP,set(v){if(v<HP){taken+=HP-v;hits++}}});
  Object.defineProperty(e,'taken',{get:()=>taken});Object.defineProperty(e,'hits',{get:()=>hits});
  e.max=HP;e.atkCd=o.attack?0:1e9;e.aggroed=!!o.attack;e.qa=1;return e}
const qAt=(a,d,o)=>({x:(o||P).x+Math.cos(a)*d,y:(o||P).y+Math.sin(a)*d});
const qMana=id=>{let n=0;while(maxMp()<costOf(id)&&n++<200)P.st.spi+=10};
// v17: 시전 시간이 있는 마법은 다 외울 때까지 기다리고(멈춰 선 채), 채널링 마법은 정해진 시간 동안 누르고 있는 것으로 친다
// v18: 남은 후딜레이는 다 기다린 것으로 친다 (재사용 대기를 0으로 두는 것과 같은 뜻 · 프레임을 더 돌리지 않아 다른 점검의 흐름이 그대로). 예전 빌드에는 REC가 없음
const qRecWait=()=>{if(typeof REC!=='undefined'&&REC.p===P&&REC.t>0){REC.q=null;REC.t=0}};
const qNoRec=()=>{if(typeof recReset==='function')recReset()};
const qCast=(id,t)=>{qMana(id);P.cd[id]=0;P.mp=maxMp();qRecWait();tryCast(id,t);
  if(CAST.cur&&CAST.cur.id===id)qStep(Math.ceil(CAST.cur.max*60)+3,{render:false,each:()=>{P.mp=Math.max(P.mp,costOf(id));P.invT=Math.max(P.invT,.05)},until:()=>!CAST.cur});
  if(CAST.ch&&CAST.ch.id===id)CAST.ch.sticky=true;
  if(typeof J3CH!=='undefined'&&J3CH&&J3CH.id===id){J3CH.sticky=true;qStep(Math.ceil(J3CH.max*60)+3,{render:false,each:()=>{P.invT=Math.max(P.invT,.05)},until:()=>!J3CH})}// v20: 모으기 채널링은 다 모을 때까지 누른 것으로
  return(P.cd[id]||0)>0||SPELLS[id].kind==='rez'};
// v19 (SKILL): 상위 기술(옛 9위계 · 2차 전직 뒤에 씀)은 점검이 tryCast로 쓸 때 저절로 풀어 준다. 잠금 자체를 보는 점검은 QA_ADV.auto=false
const QA_ADV={auto:true};
const qJob2Id=()=>typeof JOB2_IDS==='object'&&JOB2_IDS&&JOB2_IDS[P.cls]?JOB2_IDS[P.cls][0]:'qa';
const qJob2On=()=>{if(!P.job2)P.job2=qJob2Id();return P.job2};
const qAdvOn=id=>{const s=SPELLS[id];if(s&&s.tab==='adv'){qJob2On();if(P.lvl<s.upLv)P.lvl=s.upLv}};
if(typeof advUnlocked==='function'){const _qtc=tryCast;tryCast=function(id){if(QA_ADV.auto&&!GHOST&&SPELLS[id]&&SPELLS[id].tab==='adv'&&!advUnlocked(id))qAdvOn(id);return _qtc.apply(this,arguments)}}
// v19 (JOB): 2차 전직 기술(SPELLS[id].job2)은 점검이 tryCast로 쓸 때 그 갈래로 저절로 전직한다. 갈래 잠금 자체를 보는 점검은 QA_J2.auto=false
const QA_J2={auto:true};
const qJ2Spec=s=>!!s.job2&&(['link','cleanse','detonate'].includes(s.kind)||s.swap||s.legion||s.spawn||s.rushAlly||s.fear||s.blind||s.lure||s.petDmg||s.blockRanged||s.thorns||s.ccImmune||s.trapThrow||s.spreadOne)||!!s.j3spec;// 새 효과는 '2차 전직 v19' 묶음에서 따로 본다 (v20: 3차 마법사·사제의 새 효과 j3spec은 '3차 전직 v20 (마법사·사제)' 묶음에서)
if(typeof job2Ok==='function'){const _qtc2=tryCast;tryCast=function(id){const s=SPELLS[id];if(QA_J2.auto&&!GHOST&&!CAST_MOD&&s&&s.job2&&s.cls===P.cls&&P.job2!==s.job2)P.job2=s.job2;return _qtc2.apply(this,arguments)}}
// v20 (CORE): 3차 전직 기술(SPELLS[id].job3)은 점검이 tryCast로 쓸 때 그 3차 갈래(와 2차 갈래 · 열리는 레벨)로 저절로 전직한다. 갈래 잠금 자체를 보는 점검은 QA_J3.auto=false
const QA_J3={auto:true};
const qJob3On=br=>{if(typeof JOB2_OF3!=='object'||!JOB2_OF3[br])return null;P.job2=JOB2_OF3[br];P.job3=br;P._job3raw=null;if(P.lvl<J3LV)P.lvl=J3LV;passT=-1;return br};
if(typeof job3Ok==='function'){const _qtc3=tryCast;tryCast=function(id){const s=SPELLS[id];if(QA_J3.auto&&!GHOST&&!CAST_MOD&&s&&s.job3&&s.cls===P.cls){const l0=P.lvl,full=P.mp>=maxMp()-1;if(P.job3!==s.job3)qJob3On(s.job3);if(P.lvl<(s.upLv||0))P.lvl=s.upLv;if(P.lvl!==l0&&full){qMana(id);P.mp=maxMp()}}return _qtc3.apply(this,arguments)}}// 레벨을 올렸으면 마나도 그 레벨 값으로 (점검이 마나를 가득 채워 둔 경우만)
const qKey=(code,type)=>window.dispatchEvent(new KeyboardEvent(type||'keydown',{code,key:code,bubbles:true,cancelable:true}));
function qClick(sel,root){const b=(root||document).querySelector(sel);if(!b)throw new QAFail(`버튼 없음: ${sel}`);if(b.disabled)throw new QAFail(`버튼 비활성: ${sel}`);b.click();return b}
const qSpells=(cls,f)=>Object.values(SPELLS).filter(s=>s.cls===cls&&(!f||f(s)));
function qSnapStats(){return Object.assign({dmg:dmgMul(),spd:spdMul(),hp:maxHp(),regen:regen(),crit:critC(),dr:buffSum('dr'),life:buffSum('life'),cdr:buffSum('cdr')},typeof clsSnap==='function'?clsSnap():{})}
function qActAt(x,y){P.x=x;P.y=y;qStep(1,{render:false});return act}

/* ===== 1. 시작 ===== */
let qaMigr=null;
const QCN={mage:'마법사',priest:'사제',warrior:'전사',archer:'궁수'},QCLS=['mage','priest','warrior','archer'];// v18: 전사·궁수
for(const cls of QCLS)qT('시작',`새 캐릭터(${QCN[cls]}) 만들고 3초 진행`,()=>{
  if(cls!=='mage'){$('#helpBtn').click();qOk(!$('#intro').hidden,'도움말(시작 화면)이 열리지 않음')}
  const b=document.querySelector(`#introBody [data-cls="${cls}"]`);qOk(b,'새 캐릭터 버튼 없음');const slot=+b.dataset.slot;b.click();
  qOk($('#intro').hidden,'시작 화면이 닫히지 않음');qOk(P.cls===cls,`직업이 ${P.cls}`);qOk(curSlot===slot,`저장 칸 ${curSlot}≠${slot}`);qOk(!paused,'일시정지 상태');
  qOk(localStorage.getItem(SLOTKEY(slot)),'새 캐릭터가 저장되지 않음');
  const x0=P.x;keys.add('KeyD');qStep(90,{renderEvery:3,spawn:true});keys.delete('KeyD');qStep(90,{renderEvery:3,spawn:true});
  qOk(P.x!==x0,'이동 키로 움직이지 않음');qOk(!P.dead,'죽음');
  return `칸 ${slot}, 180프레임`});

/* ===== 2. 마법 적중 ===== */
function qPlace(s){const k=s.kind,A=[.3,2.4,4.4];
  const ds=k==='strike'&&s.near?[.3,.6,.9].map(f=>s.near*f):k==='bolt'?[90,220,380]:k==='chain'?[100,250,400]:k==='nova'?[.3,.6,.85].map(f=>s.rad*f):k==='field'?(s.self?[.3,.6,.85].map(f=>s.rad*f):[100,250,400])
    :k==='rain'?[100,250,400]:k==='strike'?[100,250,450]:k==='beam'?[.25,.5,.85].map(f=>s.len*f):k==='cone'?[.3,.6,.85].map(f=>s.range*f):k==='blink'?[.3,.55,.8].map(f=>s.range*f)
    :k==='storm'?[.3,.6,.85].map(f=>s.range*f)
    :k==='melee'?[.4,.7,.95].map(f=>meleeReach(s)*f):k==='leap'?[.3,.6,.85].map(f=>s.range*f):k==='charge'?[.3,.6,.85].map(f=>s.dist*f):k==='trap'?[100,250,360]:k==='orbit'?[s.orad,s.orad,s.orad]:k==='summon'?[80,200,350]:k==='armor'?(s.aura?[s.aura*.5,0,0]:[0,0,0]):[150,150,150];
  return ds.map((d,i)=>({a:A[i],d}))}
const qMaxT=s=>({bolt:2,chain:.5,nova:.3,field:Math.min(4,(s.dur||2)+.6),rain:Math.min(6,(s.dur||3)+1),strike:(s.delay||.5)+.6,beam:.3,cone:.3,blink:.3,storm:Math.min(5,s.dur||4),orbit:3,summon:6,armor:3,melee:.4,leap:.4,charge:.5,trap:(s.arm||.6)+.6}[s.kind]||2);
function qSpellHit(id){const s0=SPELLS[id];P.sk[id]=10;if(typeof clsGearFor==='function')clsGearFor(id);const s=eff(id,10),out=[];let totalDmg=0;
  for(const pl of qPlace(s)){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.hp=maxHp();P.mp=maxMp();followCam();
    let d=pl.d;if(s.kind==='armor'&&!(d>0))d=TYPES.qa_dummy.r+P.r+2;
    const at=qAt(pl.a,d),e=qDummy(at.x,at.y,{attack:s.kind==='armor'});
    if(!qCast(id,{x:e.x,y:e.y})){out.push(`거리 ${Math.round(d)}: 시전 안 됨`);continue}
    const n=Math.ceil(qMaxT(s)*60);let rendered=false;
    qStep(n,{render:false,each:()=>{P.mp=maxMp();P.hp=maxHp();if(!rendered&&e.taken>0){render();rendered=true}},until:()=>e.taken>0});
    // 폭풍(storm)은 둘레의 몬스터를 무작위로 고른다 → 빗나가면 한 번 더 시전. 비(rain)는 v18부터 다시 시전하지 않는다(rainPt: 첫 낙하가 겨눈 곳, 나머지는 칸마다 고르게)
    if(!(e.taken>0)&&s.kind==='storm'){qClear();enemies.push(e);QA.reseed(9001+n);if(qCast(id,{x:e.x,y:e.y}))qStep(n,{render:false,each:()=>{P.mp=maxMp();P.hp=maxHp()},until:()=>e.taken>0})}
    // v18: 물리 기술은 명중 판정이 있다(같은 레벨 80% 안팎) → 빗나가면 다시 시전 (최대 3번)
    for(let k=0;k<3&&!(e.taken>0)&&s.phys;k++){qClear();enemies.push(e);P.x=QA_SPOT.x;P.y=QA_SPOT.y;QA.reseed(7001+k*31+n);if(qCast(id,{x:e.x,y:e.y}))qStep(n,{render:false,each:()=>{P.mp=maxMp();P.hp=maxHp()},until:()=>e.taken>0})}
    if(!rendered)render();
    if(e.taken>0)totalDmg+=e.taken;else out.push(`거리 ${Math.round(d)}·각 ${pl.a}: 피해 0`)}
  qClear();return{out,totalDmg}}
for(const cls of QCLS)qT('마법 적중',`${QCN[cls]}: 준비`,()=>{qPrep(cls);TYPES.qa_dummy=Object.assign({},TYPES.ogre,{n:'QA 허수아비',spd:0,dmg:0,xp:0,aggro:0,atk:1e9,ranged:false,undead:false,boss:0,mini:0});
  const n=qSpells(cls,isDmg).length;qOk(n>0,'공격 마법 없음');return `공격 마법 ${n}개 (isDmg)`});
// 각 공격 마법을 개별 항목으로 (클래스 단위로 이름이 정해지도록 지연 등록)
const qSpellList=cls=>Object.keys(SPELLS).filter(id=>SPELLS[id].cls===cls&&isDmg(SPELLS[id]));
/* v18 회귀: 비 마법(라이트 레인·돌비·빛의 비 …)이 난수에 따라 가끔 허수아비를 한 번도 못 맞히던 문제 (원인: 낙하 자리가 원 안 완전 무작위).
   모든 rain 마법을 씨앗 50개로 시전해 매번 맞아야 한다. 다시 시전(재시도) 없음. */
const qRainIds=()=>Object.keys(SPELLS).filter(id=>SPELLS[id].kind==='rain'&&SPELLS[id].cls);
qT('마법 적중','비 마법(rain) 모두 · 씨앗 50개마다 한 번에 적중 (재시도 없음)',()=>{const ids=qRainIds();qOk(ids.length>=5,`비 마법 ${ids.length}개`);const bad=[];let casts=0;
  for(const id of ids){const s0=SPELLS[id];if(P.cls!==s0.cls)qPrep(s0.cls,{lvl:60});P.sk[id]=10;const s=eff(id,10),n=Math.ceil(qMaxT(s)*60);
    for(let seed=1;seed<=50;seed++){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.hp=maxHp();followCam();const d=[100,250,400][seed%3],at=qAt(seed*.77,d),e=qDummy(at.x,at.y);QA.reseed(seed*7919+13);
      if(!qCast(id,{x:e.x,y:e.y})){bad.push(`${id}#${seed}: 시전 안 됨`);continue}casts++;
      qStep(n,{render:false,each:()=>{P.mp=maxMp();P.hp=maxHp()},until:()=>e.taken>0});if(!(e.taken>0))bad.push(`${id}#${seed}(거리 ${d})`)}}
  qClear();qOk(!bad.length,`빗나감 ${bad.length}/${casts}: ${bad.slice(0,8).join(', ')}`);return `${ids.length}개 × 씨앗 50 = ${casts}번 모두 적중`});
/* v18 비 마법 한 줄기 피해 반지름 (사용자: 래스 오브 헤븐 같은 큰 비 마법이 잘 안 맞는다) */
function qRainRun(id,pts,frames){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.hp=maxHp();followCam();const c=qAt(0,250),es=pts.map(p=>qDummy(c.x+p.x,c.y+p.y));
  if(!qCast(id,{x:c.x,y:c.y}))return null;let k=0;qStep(frames,{render:false,each:i=>{P.mp=maxMp();P.hp=maxHp();k=i}});const t=es.map(e=>e.taken);qClear();return t}
const qDisc=(rad)=>{const a=Math.random()*6.283,d=Math.sqrt(Math.random())*rad;return{x:Math.cos(a)*d,y:Math.sin(a)*d}};
qT('마법 적중','비 마법 한 줄기 피해 반지름 ≥ 원 반지름×0.55 · 원 안 아무 데나 선 몬스터가 첫 1초 안에 맞음(씨앗 50개 중 95% 이상)',()=>{const out=[],bad=[];
  for(const id of qRainIds()){const s0=SPELLS[id];qPrep(s0.cls,{lvl:60});if(typeof clsGearFor==='function')clsGearFor(id);P.sk[id]=10;const s=eff(id,10),sr=rainSR(s,s.rad);
    if(!(sr>=s.rad*.55))bad.push(`${id}: 반지름 ${Math.round(sr)} < ${Math.round(s.rad*.55)}`);
    let hit=0;for(let seed=1;seed<=50;seed++){QA.reseed(seed*104729+7);const p=qDisc(s.rad*.97);QA.reseed(seed*31+5);const t=qRainRun(id,[p],60+(CAST_T[id]?0:0));if(t&&t[0]>0)hit++}
    if(hit<48)bad.push(`${id}: 첫 1초 적중 ${hit}/50`);out.push(`${id} ${Math.round(sr)}/${Math.round(s.rad)} ${hit}/50`)}
  qOk(!bad.length,bad.join(', '));return out.join(' · ')});
qT('마법 적중','비 마법 균형: 넓어진 한 줄기 · 몬스터 5마리 무리가 받는 피해 합은 예전의 1.15~2.7배(목표 약 2배) (같은 위계 단일 대상 마법 비교는 표로 · v20: 끝에 「마지막 한 방」이 있는 3차 채널링 비는 그 한 방이 같아 비율이 묽어지므로 빼고, 3차 묶음에서 한 줄기 넓이를 따로 봄)',()=>{const rows=[],bad=[];
  const one=(id)=>{const s=eff(id,10);let tot=0;for(let k=0;k<2;k++){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();const e=qDummy(P.x+200,P.y+20);QA.reseed(500+k);if(qCast(id,{x:e.x,y:e.y}))qStep(Math.ceil(qMaxT(s)*60),{render:false,each:()=>{P.mp=maxMp();P.hp=maxHp()}});tot+=e.taken}qClear();return tot/2};
  for(const id of qRainIds().filter(id=>!SPELLS[id].final)){const s0=SPELLS[id];qPrep(s0.cls,{lvl:60});if(typeof clsGearFor==='function')clsGearFor(id);P.sk[id]=10;const s=eff(id,10),fr=Math.ceil(((chanOf(id)?chanPlan(id,10).dur:s.dur)+.6)*60);
    /* v22: 몬스터 맞는 크기(hR)가 몸 그림만큼 커져 예전 좁은 한 줄기도 더 잘 맞게 됨 → 이 점검은 비 모양(좁은 한 줄기 ↔ 넓은 한 줄기)만 비교하려고 둘 다 v21 맞는 크기(e.r)로 잰다. 몸 크기 맞히기는 「v22 사거리」에서 따로 */
    /* v24: 좁은 예전 한 줄기는 몇 번 맞느냐에 따라 크게 흔들려(다른 곳의 난수 쓰임만 바뀌어도 2.75배 등) 아주 넓은 3차 비(원 400 이상)는 씨앗 16개로 잰다 */const NS=s.rad>=400?16:8;const pack=(useOld)=>{const keep=rainSR,keepK=rainDK,keepH=hR;if(useOld){rainSR=s=>s.srad;rainDK=()=>1}hR=e=>e.r||0;let sum=0;
      try{for(let seed=1;seed<=NS;seed++){QA.reseed(seed*7717);const pts=[0,1,2,3,4].map(()=>qDisc(s.rad*.6));QA.reseed(seed*13+1);const t=qRainRun(id,pts,fr);sum+=t?t.reduce((a,b)=>a+b,0):0}}finally{rainSR=keep;rainDK=keepK;hR=keepH}return sum/NS};
    let cand=Object.keys(SPELLS).filter(k=>SPELLS[k].cls===s0.cls&&SPELLS[k].rank===s0.rank&&isDmg(SPELLS[k])&&((SPELLS[k].kind==='bolt'&&!SPELLS[k].aoe)||SPELLS[k].kind==='beam'));
    if(!cand.length)cand=Object.keys(SPELLS).filter(k=>SPELLS[k].cls===s0.cls&&Math.abs(SPELLS[k].rank-s0.rank)<=1&&isDmg(SPELLS[k])&&((SPELLS[k].kind==='bolt'&&!SPELLS[k].aoe)||SPELLS[k].kind==='beam'));
    let ref=0,refId='';for(const k of cand){P.sk[k]=10;const v=one(k)/Math.max(cdOf(k),castTimeOf(k)||0,.25)*cdOf(id);if(v>ref){ref=v;refId=k}}
    const nw=pack(false),od=pack(true),ratio=ref>0?nw/ref:0;
    rows.push(`${id}: 무리 피해 ${Math.round(od)} → ${Math.round(nw)} (×${qR(nw/Math.max(1,od))}) · 단일 대상 기준 ${refId} ${Math.round(ref)}의 ${qR(od/Math.max(1,ref))}배 → ${qR(ratio)}배 · 한 줄기 피해 반지름 ${s.srad}→${Math.round(rainSR(s,s.rad))} / 원 ${Math.round(s.rad)} · 한 줄기 피해 ×${qR(rainDK(s,s.rad))}`);
    const g=nw/Math.max(1,od);if(!(g>=1.15&&g<=2.7))bad.push(`${id} 예전의 ${qR(g)}배`)}
  qOk(!bad.length,bad.join(', ')+' || '+rows.join(' | '));return rows.join(' | ')});
/* v18 채널링 균형 (사용자: 눈보라·로드 오브 버밀리온이 헤일스톰·썬더스톰보다 못하다)
   초당 피해 비교: 채널링은 붙잡혀 있는 시간 T(채널링 + 후딜레이) 동안의 초당 피해, 다른 기술은 한 번 쓴 피해 ÷ 재사용 주기(재사용 대기, 또는 시전 시간 + 후딜레이 중 긴 쪽).
   범위 채널링: 몬스터 5마리 무리(겨눈 곳에 모인 무리, 내 둘레의 무리 중 그 마법에 좋은 쪽) · 빔·미사일 채널링: 하나.
   비교 대상: 같은 직업 · 같은 위계 · 채널링이 아닌 공격 기술 중 가장 센 것 (소환·궤도·갑옷·덫·강화 제외). */
const qCHAN_SINGLE=id=>{const s=SPELLS[id];return s.kind==='beam'||s.kind==='bolt'||s.kind==='chain'};
// 치유량: 생명력을 1로 두고 매 프레임 늘어난 만큼 더한다 (적 없음)
function qChanHeal(id){const s=eff(id,10),cp=chanOf(id)?chanPlan(id,10):null,T=Math.min(14,Math.max(cp?cp.dur:0,s.dur||0,castTimeOf(id)||0)+1);let got=0;
  qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.mp=maxMp();followCam();P.hp=1;let last=1;QA.reseed(5);qMana(id);P.cd[id]=0;tryCast(id,{x:P.x+40,y:P.y});if(CAST.ch)CAST.ch.sticky=true;
  qStep(Math.ceil(T*60),{render:false,each:()=>{if(P.hp>last)got+=P.hp-last;P.hp=1;last=1;P.mp=maxMp();P.invT=Math.max(P.invT,.05)}});if(P.hp>last)got+=P.hp-last;P.hp=maxHp();qClear();return got}
function qChanDmg(id,single){if(SPELLS[id].wt&&typeof clsGearFor==='function')clsGearFor(id);const s=eff(id,10),cp=chanOf(id)?chanPlan(id,10):null,T=Math.min(14,Math.max(cp?cp.dur:0,s.dur||0,s.delay||0,castTimeOf(id)||0)+3.5),n=Math.ceil(T*60);
  const lay=single?[[{a:.3,d:60}],[{a:.3,d:220}]]:[[0,1,2,3,4].map(i=>({c:1,a:i*1.2566,d:i?55:0})),[0,1,2,3,4].map(i=>({a:.3+i*1.2566,d:62}))];let best=0;
  for(const L of lay){let tot=0;for(const seed of [11,23,37,51]){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.hp=maxHp();P.mp=maxMp();followCam();const c=qAt(.3,200);
      const es=L.map(o=>{const b=o.c?c:P;return qDummy(b.x+Math.cos(o.a)*o.d,b.y+Math.sin(o.a)*o.d)});const tg=L[0].c?{x:c.x,y:c.y}:{x:es[0].x,y:es[0].y};
      QA.reseed(seed);P.cd={};P.buffs={};if(qCast(id,tg))qStep(n,{render:false,each:()=>{P.mp=maxMp();P.hp=maxHp()}});tot+=es.reduce((a,e)=>a+e.taken,0)}
    best=Math.max(best,tot/4)}
  qClear();return best}
const qCycle=id=>{const cp=chanOf(id)?chanPlan(id,10):null;return Math.max(cdOf(id),(cp?cp.dur:castTimeOf(id)||0)+(typeof recOf==='function'?recOf(id):0),.25)};
/* v22: 몬스터 맞는 크기(hR)가 몸 그림만큼 커짐(허수아비는 오우거 몸 → 33). 이 표는 마법끼리의 세기(배수·시간)를 견주는 것이라 v21 맞는 크기(e.r)로 잰다. 큰 몸 무리에서 한 줄 광선(꿰뚫는 창 등)이 더 많이 맞는 것은 RANGE 보고에 따로 적음 */
function qChanTable(){const keepH=hR;hR=e=>e.r||0;try{return qChanTable0()}finally{hR=keepH}}
function qChanTable0(){const rows=[];const NOALT=new Set(['summon','orbit','armor','trap','passive','buff','storm']);
  for(const id of Object.keys(SPELLS).filter(k=>chanOf(k)&&SPELLS[k].cls)){const s0=SPELLS[id];qPrep(s0.cls,{lvl:60});// 매번 새 캐릭터(앞 점검이 남긴 패시브·장비 영향 없이)
    if(!isDmg(s0)){const T=chanPlan(id,10).dur+(typeof recOf==='function'?recOf(id):0);P.sk[id]=10;const mine=qChanHeal(id)/T;let alt=0,altId='';
      for(const k of Object.keys(SPELLS).filter(k=>SPELLS[k].cls===s0.cls&&SPELLS[k].rank===s0.rank&&k!==id&&!chanOf(k)&&(SPELLS[k].kind==='heal'||SPELLS[k].kind==='hot'||(SPELLS[k].kind==='field'&&SPELLS[k].heal)))){P.sk[k]=10;const v=qChanHeal(k)/qCycle(k);if(v>alt){alt=v;altId=k}}
      rows.push({id,heal:1,mine,alt,altId,ratio:alt>0?mine/alt:99,mult:s0.heal});continue}
    const single=qCHAN_SINGLE(id);P.sk[id]=10;const T=chanPlan(id,10).dur+(typeof recOf==='function'?recOf(id):0),mine=qChanDmg(id,single)/T;let alt=0,altId='';
    for(const k of Object.keys(SPELLS).filter(k=>SPELLS[k].cls===s0.cls&&SPELLS[k].rank===s0.rank&&k!==id&&!chanOf(k)&&isDmg(SPELLS[k])&&!NOALT.has(SPELLS[k].kind)&&!SPELLS[k].aspd)){
      P.sk[k]=10;const v=qChanDmg(k,single)/qCycle(k);if(v>alt){alt=v;altId=k}}
    rows.push({id,single,mine,alt,altId,ratio:alt>0?mine/alt:99,mult:s0.mult})}
  qClear();return rows}
qT('채널링 균형','채널링 마법은 같은 시간 동안 같은 위계·같은 직업의 채널링 아닌 가장 센 공격보다 피해가 1.25배 이상',()=>{const rows=qChanTable();
  const bad=rows.filter(r=>!r.skip&&r.ratio<1.25).map(r=>`${r.id} ${qR(r.ratio)}배`);
  const txt=rows.map(r=>r.skip?`${r.id}: ${r.skip}(따로)`:`${r.id}(${SPELLS[r.id].rank}위계·${r.heal?'치유':r.single?'하나':'무리'}·${r.heal?'heal':'mult'} ${r.mult}) ${Math.round(r.mine)}/초 vs ${r.altId||'-'} ${Math.round(r.alt)}/초 = ${qR(r.ratio)}배`).join(' | ');
  qOk(!bad.length,bad.join(', ')+' || '+txt);return txt});
qT('채널링 균형','걸으며 채널링(move/walk 표시): 움직여도 이어지고 walk 배수만큼 느림 · 표시 없는 채널링은 움직이면 끊김',()=>{qPrep('mage',{lvl:60});const id='blizzard',c=CHAN[id],keep=c.walk;P.sk[id]=10;
  const walk=n=>{const x0=P.x;keys.add('KeyD');qStep(n,{render:false,each:()=>{P.mp=maxMp()}});keys.delete('KeyD');qStep(1,{render:false});return P.x-x0};
  qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;const free=walk(20);
  try{qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;qOk(qCast(id,qAt(0,200))&&CAST.ch,'채널링 시작 안 됨');const d1=walk(1);qOk(!CAST.ch,'표시 없는데 움직여도 이어짐');
    c.walk=.5;qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;qOk(qCast(id,qAt(0,200))&&CAST.ch,'채널링 시작 안 됨(walk)');const k0=CAST.ch.k,d=walk(40);qOk(CAST.ch&&CAST.ch.k>k0,'걸으니 끊김(walk)');
    qOk(Math.abs(d/(free*2)-.5)<.12,`걷는 속도 ${qR(d/(free*2))}배 (0.5여야)`);
    qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;keys.add('KeyD');qStep(2,{render:false});qOk(P.moving,'안 움직임');tryCast(id,qAt(0,200));const ok=!!CAST.ch;keys.delete('KeyD');qOk(ok,'걸으면서 시작 못 함(walk)');
  }finally{if(keep===undefined)delete c.walk;else c.walk=keep;keys.delete('KeyD');qClear()}
  const mv=Object.keys(CHAN).filter(k=>chanMove(k));return `보통 걸음 ${Math.round(free)} · 걸어도 되는 채널링: ${mv.join(', ')||'없음'}`});
qT('마법 적중','비 마법 낙하 자리: 첫 낙하는 겨눈 곳 · 7번마다 같은 넓이 7칸에 하나씩 · 평균 분포는 예전(원 안 고르게)과 같음',()=>{
  qOk(typeof rainPt==='function','rainPt 없음');QA.reseed(4711);const r={x:300,y:-200,rad:150},p0=rainPt(r);qOk(p0.x===300&&p0.y===-200,`첫 낙하 ${qR(p0.x)},${qR(p0.y)}`);
  const N=7000,r0=150/Math.sqrt(7);let d2=0,inC=1,out=0,cyc=0;const cnt=new Map();
  for(let i=1;i<N;i++){const q=rainPt(r),dd=Math.hypot(q.x-300,q.y+200);if(dd>150+1e-6)out++;d2+=(dd/150)**2;if(dd<r0)inC++;
    const a=(Math.atan2(q.y+200,q.x-300)-r.rot+12.566)%6.283,k=dd<r0?0:1+Math.min(5,Math.floor(a/(6.283/6)));cnt.set(k,(cnt.get(k)||0)+1)}
  qOk(!out,`원 밖 ${out}`);qOk(inC===N/7,`가운데 칸 ${inC} ≠ ${N/7}`);for(let k=1;k<=6;k++)qOk(Math.abs((cnt.get(k)||0)-N/7)<=2,`칸 ${k}: ${cnt.get(k)}`);
  const m=d2/(N-1);qOk(Math.abs(m-.5)<.02,`평균 (거리/반지름)² ${qR(m)} (고른 원이면 0.5)`);
  // 낙하 수는 그대로: 지속 × 초당 낙하
  qPrep('mage',{lvl:60});const id='lightrain';P.sk[id]=10;const s=eff(id,10);qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();QA.reseed(99);qCast(id,{x:P.x+200,y:P.y});const rn=rains[0];qOk(rn,'비 없음');
  qStep(Math.ceil((s.dur+.5)*60),{render:false});qOk(Math.abs(rn.n-s.dur*s.rate)<=1.01,`낙하 ${rn.n}번 (지속 ${s.dur}초 × ${s.rate})`);qClear();
  return `가운데 칸 ${inC}/${N} · 평균 (d/r)² ${qR(m)} · 라이트 레인 낙하 ${rn.n}번`});

/* ===== 3. 비공격 마법 · 패시브 ===== */
function qSupport(id){const s0=SPELLS[id];P.sk[id]=10;if(typeof clsGearFor==='function')clsGearFor(id);const s=eff(id,10);qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();P.mp=maxMp();
  switch(s.kind){
    case'heal':{P.hp=Math.round(maxHp()*.3);const h=P.hp;qOk(qCast(id),'시전 안 됨');qOk(P.hp>h,`생명력이 늘지 않음 (${h}→${P.hp})`);return `+${Math.round(P.hp-h)}`}
    case'hot':{P.hp=Math.round(maxHp()*.3);qOk(qCast(id),'시전 안 됨');qOk(P.hot&&P.hot.rate>0,'지속 치유가 걸리지 않음');const h=P.hp;qStep(60,{render:false});
      const nat=(.6+P.lvl*.15)*(P.cls==='priest'?1.5:1);qOk(P.hp-h>nat*1.05,`1초 회복 ${qR(P.hp-h)} ≤ 자연 회복 ${qR(nat)}`);return `1초 +${Math.round(P.hp-h)}`}
    case'shield':{P.hp=maxHp();qOk(qCast(id),'시전 안 됨');qOk(P.shield>0&&P.shieldT>0,'보호막 없음');const sh=P.shield,h=P.hp;hitPlayer(Math.min(10,sh));qOk(P.hp===h,'보호막이 피해를 막지 않음');return `흡수 ${sh}`}
    case'buff':{const b=qSnapStats();qOk(qCast(id),'시전 안 됨');qOk(P.buffs[id]&&P.buffs[id].t>0,'강화가 걸리지 않음');const a=qSnapStats(),ch=Object.keys(a).filter(k=>Math.abs(a[k]-b[k])>1e-9);
      qOk(ch.length,'어떤 능력치도 바뀌지 않음');return ch.map(k=>`${k} ${qR(b[k])}→${qR(a[k])}`).join(', ')+` · ${qR(P.buffs[id].t)}초`}
    case'ward':{qOk(qCast(id),'시전 안 됨');qOk(P.ward,'가호 없음');P.invT=0;P.shield=0;P.hp=5;hitPlayer(1e6);qOk(!P.dead&&P.hp>0,'가호가 있어도 쓰러짐');qOk(!P.ward,'가호가 소모되지 않음');return `되살아난 생명력 ${Math.round(P.hp)}`}
    case'invuln':{qOk(qCast(id),'시전 안 됨');qOk(P.invT>0,'무적 시간 0');const h=P.hp;hitPlayer(500);qOk(P.hp===h,'무적인데 피해를 받음');return `무적 ${qR(P.invT)}초`}
    case'blink':{const x0=P.x,y0=P.y,t=qAt(.7,200);qOk(qCast(id,t),'시전 안 됨');const d=Math.hypot(P.x-x0,P.y-y0);qOk(d>150&&d<=s.range+1,`이동 거리 ${Math.round(d)}`);return `이동 ${Math.round(d)}`}
    case'nova':{const e=qDummy(P.x+40,P.y);qOk(qCast(id,e),'시전 안 됨');if(s.taunt||s.weaken){qOk(!s.taunt||(e.tnt&&e.tnt.t>time)||e.tauntT>0,'도발이 걸리지 않음');qOk(!s.weaken||e.weakT>0,'약화가 걸리지 않음');return `도발 ${s.taunt||0}초 · 약화 ${s.weaken?Math.round(s.weaken.dmg*100)+'%':'-'}`}
      qOk(e.freezeT>0||e.stunT>0||e.slowT>0,'멈춤/느려짐 효과 없음');return `빙결 ${qR(Math.max(0,e.freezeT))} 기절 ${qR(Math.max(0,e.stunT))} 둔화 ${qR(Math.max(0,e.slowT))}`}
    case'field':{P.hp=Math.round(maxHp()*.3);const h=P.hp;qOk(qCast(id,{x:P.x,y:P.y}),'시전 안 됨');qStep(40,{render:false});
      const r=[];if(s.heal){qOk(P.hp>h+1,'치유 지대에서 회복 안 됨');r.push(`회복 ${Math.round(P.hp-h)}`)}
      if(s.drf){qOk(P.buffs['_f_'+id]&&P.buffs['_f_'+id].dr>0,'피해 감소가 걸리지 않음');r.push(`피해 감소 ${qR(P.buffs['_f_'+id].dr)}`)}
      if(s.ally){const b=P.buffs['_f_'+id];qOk(b&&(b.dmg>0||b.ias>0),'깃발 둘레 강화가 걸리지 않음');r.push(`깃발 피해 +${qR(b.dmg)} · 공격 속도 +${qR(b.ias)}`)}
      qOk(r.length,'치유/피해감소가 없는 지대');return r.join(', ')}
    case'intervene':{const mp=P.mp;tryCast(id,null);qOk(P.mp===mp&&!(P.cd[id]>0),'혼자일 때 마나/재사용이 돌려지지 않음');return '혼자: 마나 반환(같이 하기 전용)'}
    case'rez':{const mp=P.mp;tryCast(id,null);qOk(P.mp===mp&&!(P.cd[id]>0),'혼자일 때 마나/재사용이 돌려지지 않음');return '혼자: 마나 반환(같이 하기 전용)'}
  }
  throw new QAFail('알 수 없는 종류 '+s.kind)}
const qSupList=cls=>Object.keys(SPELLS).filter(id=>{const s=SPELLS[id];return s.cls===cls&&!isDmg(s)&&s.kind!=='passive'&&!qJ2Spec(s)});// v19: 2차의 새 효과는 '2차 전직 v19' 묶음에서

for(const cls of QCLS)qT('패시브',`${QCN[cls]}: 패시브는 배우면 능력치가 오르고 시전되지 않음`,()=>{qPrep(cls);P.sp=100;const ids=qSpells(cls,s=>s.kind==='passive'&&!s.job2&&!s.job3).map(s=>s.id);
  qOk(ids.length,'패시브 없음');const r=[];
  for(const id of ids){for(const p of PRE[id]||[])if(!P.sk[p]){P.sk[p]=1}if(typeof clsGearFor==='function')clsGearFor(id);const b=qSnapStats(),bar0=P.bar.slice();qOk(learnPoint(id),`${id}: 배울 수 없음`);
    const a=qSnapStats(),ch=Object.keys(a).filter(k=>a[k]>b[k]+1e-9);qOk(ch.length,`${SPELLS[id].n}: 배워도 능력치 그대로`);
    qOk(P.bar.indexOf(id)<0&&JSON.stringify(P.bar)===JSON.stringify(bar0),`${SPELLS[id].n}: 단축칸에 들어감`);
    const mp=P.mp;P.cd={};tryCast(id,qAt(0,100));qOk(P.mp===mp&&!(P.cd[id]>0),`${SPELLS[id].n}: 시전됨(마나/재사용 변화)`);
    for(let i=0;i<4;i++)learnPoint(id);const c=qSnapStats();qOk(ch.every(k=>c[k]>a[k]+1e-9),`${SPELLS[id].n}: 레벨을 올려도 그대로`);
    r.push(`${SPELLS[id].n}(${ch.join('/')})`)}
  return r.join(', ')});

/* ===== 4. 스킬 트리 ===== */
qT('스킬 트리','포인트 찍기: 성공하면 레벨+1, 포인트-1',()=>{qPrep('mage',{lvl:10});P.sp=3;const b=P.sk.spark;qOk(learnPoint('spark'),'spark 찍기 실패');qOk(P.sk.spark===b+1&&P.sp===2,`sk ${P.sk.spark}, sp ${P.sp}`)});
qT('스킬 트리','포인트 없으면 못 찍음',()=>{qPrep('mage',{lvl:30});P.sp=0;qOk(!learnPoint('spark'),'포인트 0인데 찍힘');qOk(P.sk.spark===1,'레벨이 바뀜')});
qT('스킬 트리','레벨이 모자라면 못 찍음 (위계 요구 레벨)',()=>{qPrep('mage',{lvl:10});P.sp=10;const id=qSpells('mage',s=>s.rank===RANK_LV.length&&!s.tab)[0].id;for(const p of PRE[id]||[])P.sk[p]=1;qOk(!learnPoint(id),`${id}가 레벨 10에 찍힘`);
  P.lvl=RANK_LV[RANK_LV.length-1];qOk(learnPoint(id),`레벨 ${P.lvl}에도 못 찍음`);return id});
qT('스킬 트리','점수마다 요구 레벨 +1 (레벨 5에 spark 최대 5)',()=>{qPrep('mage',{lvl:5});P.sp=20;let n=0;while(learnPoint('spark'))n++;qOk(P.sk.spark===5,`spark ${P.sk.spark}`);return `추가 ${n}점`});
qT('스킬 트리','선행 마법이 없으면 못 찍음',()=>{qPrep('mage',{lvl:60});P.sp=20;const id='pyroblast',pre=PRE[id];qOk(pre&&pre.length,'pyroblast 선행 없음');
  qOk(!learnPoint(id),'선행 없이 찍힘');const chain=[];const need=x=>{for(const p of PRE[x]||[]){need(p);if(!P.sk[p]){qOk(learnPoint(p),`${p} 찍기 실패`);chain.push(p)}}};need(id);qOk(learnPoint(id),'선행을 찍어도 못 찍음');return chain.join('→')+'→'+id});
qT('스킬 트리','최대 20점을 넘지 못함',()=>{qPrep('mage',{lvl:60});P.sp=100;let n=0;for(let i=0;i<30;i++)if(learnPoint('spark'))n++;qOk(P.sk.spark===MAXSK&&MAXSK===20,`spark ${P.sk.spark}`);qOk(P.sp===100-n,'포인트 계산 틀림');qOk(!canLearn('spark'),'20점인데 더 찍을 수 있음');
  // 장비 보너스는 20을 넘어도 됨(찍은 점수만 20 제한)
  return `찍은 점수 ${P.sk.spark}`});
qT('스킬 트리','시너지: 같은 계열에 찍으면 피해가 늘어남 (v17: 점당 +1.5%, 더하기, 최대 +50%)',()=>{qPrep('mage',{lvl:60});TYPES.qa_dummy=TYPES.qa_dummy||Object.assign({},TYPES.ogre,{spd:0,dmg:0,aggro:0,atk:1e9});
  const id='flameshaping';qOk(SPELLS[id]&&SPELLS[id].kind==='nova','flameshaping(화염 nova) 없음');P.sk[id]=5;const other=qSpells('mage',s=>TREE[s.id]===TREE[id]&&s.id!==id&&s.kind!=='passive')[0].id;
  const hit=()=>{qClear();const e=qDummy(P.x+30,P.y);QA.reseed(777);qCast(id,e);return e.taken};
  const d0=hit(),s0=synergy(id),o0=P.sk[other];P.sk[other]=10;const d1=hit(),s1=synergy(id);if(o0)P.sk[other]=o0;else delete P.sk[other];
  const sc=n=>1+LV_PT*lvSteps(skLv(id))+Math.min(SYN_CAP,SYN_PT*n)+stat('el_'+SPELLS[id].el)/100,want=sc(s1)/sc(s0),got=d1/d0;qOk(d0>0,'피해 0');qOk(Math.abs(got-want)<.02,`비율 ${qR(got)} (기대 ${qR(want)})`);
  const other2=qSpells('mage',s=>TREE[s.id]!==TREE[id]&&s.kind!=='passive')[0].id;P.sk[other2]=10;const d2=hit();qOk(Math.abs(d2/d0-1)<.02,`다른 계열(${other2}) 점수에도 바뀜 ${d0}→${d2} ×${qR(d2/d0)} (같은 계열 ${other}: ${d1})`);
  return `피해 ${d0}→${d1} (시너지 ${s0}→${s1}점, ×${qR(got)})`});
qT('스킬 트리','스킬 레벨이 오르면 피해가 늘어남',()=>{qPrep('mage',{lvl:60});const id='flameshaping';const hit=L=>{P.sk[id]=L;qClear();const e=qDummy(P.x+30,P.y);QA.reseed(778);qCast(id,e);return e.taken};
  const a=hit(1),b=hit(11);P.sk[id]=1;const want=qR(dmgScale(id,11)/dmgScale(id,1));qOk(Math.abs(b/a-want)<.03,`${a}→${b} ×${qR(b/a)} (기대 ×${want})`);return `${a}→${b}`});
qT('스킬 트리','화면: 트리 창의 +1 버튼으로 찍기',()=>{qPrep('mage',{lvl:10});P.sp=2;openPanel('tree');treeSel=TREE.spark;nodeSel='spark';renderPanel();
  qClick('#pbody [data-learn="spark"]');qOk(P.sk.spark===2&&P.sp===1,`sk ${P.sk.spark} sp ${P.sp}`);closePanel()});

/* ===== 5. 단축칸 ===== */
qT('단축칸','21칸 모두: 칸에 넣은 마법이 그 키(마우스 좌·우, 1~0, `, F1~F8)로 시전되고 칸에 이름이 보임',()=>{qPrep('mage',{lvl:60});
  const ids=qSpells('mage',s=>isDmg(s)&&!['summon','storm','orbit','armor','blink'].includes(s.kind)).map(s=>s.id).slice(0,21);qOk(ids.length===21,'마법이 21개보다 적음');
  for(const id of ids)P.sk[id]=1;P.bar=Array(21).fill(null);buildBar();const bad=[];
  // 칸에 넣기: 좌·우는 트리 창의 칸 고르기 버튼, 나머지는 "다음에 누르는 키에 넣기" 후 그 키
  for(let i=0;i<21;i++){const id=ids[i];
    if(!SLOTS[i].code){openPanel('tree');treeSel=TREE[id];nodeSel=id;renderPanel();qClick(`#pbody [data-assign="${id}"][data-i="${i}"]`);closePanel()}
    else{bindId=id;qKey(SLOTS[i].code);qKey(SLOTS[i].code,'keyup')}
    if(P.bar[i]!==id)bad.push(`${SLOTS[i].k}: 넣기 실패(${P.bar[i]})`)}
  P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();const e=qDummy(P.x+160,P.y+60);const sp=W2S(e.x,e.y),r=cv.getBoundingClientRect();
  for(let i=0;i<21;i++){const id=ids[i],s=SPELLS[id];P.cd={};P.mp=maxMp();castReset();
    const btn=barEl.querySelector(`[data-slot="${i}"]`),ab=btn&&btn.querySelector('.ab'),w=s.n.split(' '),want=w.length===1?w[0]:w.slice(0,2).join('');
    if(!btn||ab.textContent!==want||!btn.title.startsWith(s.n)||btn.classList.contains('empty'))bad.push(`${SLOTS[i].k}: 칸 표시 "${ab&&ab.textContent}" ≠ "${want}"`);
    if(!SLOTS[i].code){const o={pointerType:'mouse',button:i===0?0:2,buttons:i===0?1:2,clientX:r.left+sp.x,clientY:r.top+sp.y,bubbles:true,pointerId:1};
      cv.dispatchEvent(new PointerEvent('pointerdown',o));qStep(1,{render:false});window.dispatchEvent(new PointerEvent('pointerup',o))}
    else{qKey(SLOTS[i].code);qStep(1,{render:false});qKey(SLOTS[i].code,'keyup')}
    if(!(P.cd[id]>0)&&!(CAST.cur&&CAST.cur.id===id))bad.push(`${SLOTS[i].k}: ${s.n} 시전 안 됨`);
    const other=Object.keys(P.cd).filter(k=>k!==id&&P.cd[k]>0);if(other.length)bad.push(`${SLOTS[i].k}: 다른 마법도 시전(${other})`)}
  mouse.active=false;render();qOk(!bad.length,bad.join('; '));return '21/21'});
qT('단축칸','칸 오른쪽 클릭으로 비우기 · 패시브는 칸에 못 넣음(불러올 때 걸러짐)',()=>{qPrep('mage');P.sk.spark=1;P.bar[5]='spark';buildBar();
  barEl.querySelector('[data-slot="5"]').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true}));qOk(P.bar[5]===null,'오른쪽 클릭으로 비워지지 않음');
  const pid=qSpells('mage',s=>s.kind==='passive')[0].id;P.sk[pid]=1;openPanel('tree');treeSel=TREE[pid];nodeSel=pid;renderPanel();qOk(!pbody.querySelector(`[data-assign="${pid}"]`)&&!pbody.querySelector(`[data-bind="${pid}"]`),'패시브에 칸 넣기 버튼이 있음');closePanel()});

/* ===== 5b. 시전 시간 · 채널링 (v17) ===== */
function qCastPrep(cls,id){qPrep(cls,{lvl:60});P.sk[id]=10;qMana(id);P.mp=maxMp();P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();const e=qDummy(P.x+200,P.y+40);return e}
qT('시전','표: 시전 시간 마법과 채널링 마법이 정해진 만큼만 · 나머지는 즉시',()=>{const mg=id=>!(typeof PHYS_CLS==='object'&&PHYS_CLS[SPELLS[id].cls])&&!SPELLS[id].job2&&!SPELLS[id].job3,ct=Object.keys(SPELLS).filter(id=>mg(id)&&(castTimeOf(id)>0||CAST_T[id])),ch=Object.keys(SPELLS).filter(id=>mg(id)&&chanOf(id));
  // v18: 전사·궁수의 시전·채널링은 설계 표(CAST_T_V18 · CHAN_V18) 그대로
  if(typeof CAST_T_V18==='object'){for(const id in CAST_T_V18)qOk(SPELLS[id]&&PHYS_CLS[SPELLS[id].cls]&&CAST_T[id]===CAST_T_V18[id],`v18 시전 ${id}`);for(const id in CHAN_V18)qOk(SPELLS[id]&&PHYS_CLS[SPELLS[id].cls]&&CHAN[id]===CHAN_V18[id],`v18 채널링 ${id}`)}
  qOk(ct.length>=4&&ct.length<=40,`시전 시간 ${ct.length}개`);qOk(ch.length>=4&&ch.length<=10,`채널링 ${ch.length}개`);// v19: 벼락 비·스톰 거스트·하늘의 노여움 등이 합쳐지거나 3차로 가서 4개 이상
  // v24(사용자 05:13): 캐스팅/채널링은 최대 50% 정도 → 직업마다 1차·상위 기술 공격 기술 중 시전+채널링 ≤ 50%
  for(const c of ['mage','priest','warrior','archer']){const at=Object.keys(SPELLS).filter(id=>{const s=SPELLS[id];return s.cls===c&&!s.job2&&!s.job3&&isDmg(s)&&!['summon','orbit','armor','blink'].includes(s.kind)});
    const nc=at.filter(id=>CAST_T[id]||chanOf(id)||SPELLS[id].charge).length;qOk(nc<=at.length*.5,`${c} 시전·채널링 ${nc}/${at.length}`)}
  qOk(!castTimeOf('qa_new_spell')&&!chanOf('qa_new_spell'),'모르는 id가 즉시가 아님');
  for(const id of ch){const p=chanPlan(id,10),s=eff(id,10);const tot=p.c.mode==='keep'||(p.ov&&p.ov.cnt)?p.mul:p.mul*p.N;qOk(Math.abs(tot-1)<1e-9,`${id}: 틱 피해 합 ×${qR(tot)}`);qOk(p.c.mode!=='keep'&&!(p.ov&&p.ov.cnt)||p.N===(p.ov&&p.ov.cnt?s.cnt:Math.ceil(s.dur/.5)),`${id}: 틱 수 ${p.N}`);qOk(Math.abs(p.iv*p.N-p.dur)<1e-9,`${id}: 틱 간격`);
    if(p.c.mode==='keep')qOk(Math.abs(p.dur-s.dur)<1e-9,`${id}: 채널링 시간 ${p.dur} ≠ 지속 ${s.dur}`)}
  return `시전 ${ct.map(id=>SPELLS[id].n+' '+CAST_T[id]).join(', ')} · 채널링 ${ch.map(id=>SPELLS[id].n).join(', ')}`});
qT('시전','v18 쓰는 방식 표시: 단축칸·스킬 트리 아이콘에 즉시(번개)·시전(모래시계)·채널링(물결)이 서로 다른 표시로 · 패시브는 없음',()=>{qPrep('mage',{lvl:60});
  for(const id of ['meteor','blizzard','spark'])P.sk[id]=10;P.bar=Array(21).fill(null);P.bar[0]='meteor';P.bar[1]='blizzard';P.bar[2]='spark';buildBar();
  const m=i=>{const b=document.querySelector(`#bar [data-slot="${i}"] [data-cm]`);return b&&b.dataset.cm};
  qOk(m(0)==='cast',`메테오 ${m(0)}`);qOk(m(1)==='chan',`블리자드 ${m(1)}`);qOk(m(2)==='inst',`스파크 ${m(2)}`);qOk(!document.querySelector('#bar [data-slot="3"] [data-cm]'),'빈 칸에 표시');
  qOk(/즉시/.test(document.querySelector('#bar [data-slot="2"]').title),'툴팁에 즉시 없음');
  const mk=k=>CMARK.SVG[k];qOk(mk('inst')!==mk('cast')&&mk('cast')!==mk('chan')&&mk('inst')!==mk('chan'),'모양이 같음');
  const pid=qSpells('mage',s=>s.kind==='passive')[0].id;qOk(CMARK.kind(pid)==='','패시브에 표시');
  for(const c of ['mage','priest','warrior','archer'])if(CLASSES[c])for(const sp of qSpells(c,s=>s.kind!=='passive'))qOk(CMARK.kind(sp.id)===(CAST_T[sp.id]?'cast':(chanOf(sp.id)||sp.charge)?'chan':'inst'),`${sp.id} 표시`);
  openPanel('tree');treeSel=TREE.meteor;nodeSel=null;renderPanel();const n=pbody.querySelector('[data-node="meteor"] [data-cm]');qOk(n&&n.dataset.cm==='cast','트리 메테오 표시');qOk(pbody.querySelector('.cmleg'),'트리 범례 없음');closePanel()});
qT('시전','시전 시간: 메테오는 1초 동안 외운 뒤에 나가고, 마나·재사용은 그때 듦 · 시전 막대가 보임',()=>{const e=qCastPrep('mage','meteor');const mp=P.mp,c=costOf('meteor');
  tryCast('meteor',{x:e.x,y:e.y});qOk(CAST.cur&&CAST.cur.id==='meteor','시전이 시작되지 않음');qOk(P.mp===mp&&!(P.cd.meteor>0)&&!pend.length,'외우기 전에 마나/재사용/마법이 나감');
  qStep(30,{render:true});const bar=$('#castbar');qOk(bar&&!bar.hidden&&/메테오/.test(bar.textContent),'시전 막대가 안 보임');qOk(!pend.length&&!(P.cd.meteor>0),'0.5초에 벌써 나감');
  const n=qStep(40,{render:false,until:()=>!CAST.cur});qOk(!CAST.cur&&P.cd.meteor>0&&pend.length===1,`다 외워도 안 나감 (${n}프레임)`);qOk(P.mp<mp-c+5,`마나 ${qR(mp)}→${qR(P.mp)} (값 ${c})`);
  qOk(bar.hidden,'끝났는데 막대가 남음');qStep(90,{render:false,until:()=>e.taken>0});qOk(e.taken>0,'메테오 피해 0');return `${30+n}프레임에 시전 · 피해 ${Math.round(e.taken)}`});
qT('시전','움직이면 시전이 끊기고 마나는 들지 않음 · 다른 마법을 쓰면 끊김 · 맞아도 안 끊김',()=>{const e=qCastPrep('mage','meteor');P.sk.spark=10;const mp=P.mp;
  tryCast('meteor',e);qStep(20,{render:false});keys.add('KeyD');qStep(2,{render:false});keys.delete('KeyD');
  qOk(!CAST.cur&&!(P.cd.meteor>0)&&!pend.length,'움직여도 안 끊김');qOk(P.mp>=mp-1e-6,`마나가 듦 ${qR(mp)}→${qR(P.mp)}`);qStep(80,{render:false});qOk(!pend.length,'끊긴 마법이 나중에 나감');
  tryCast('meteor',e);qStep(10,{render:false});hitPlayer(5);qStep(1,{render:false});qOk(CAST.cur,'맞아서 끊김');
  tryCast('spark',e);qOk(!CAST.cur&&P.cd.spark>0&&!(P.cd.meteor>0),'다른 마법을 써도 안 끊김');
  P.x+=1;keys.add('KeyW');qStep(1,{render:false});tryCast('meteor',e);qOk(!CAST.cur,'움직이는 중에 시전이 시작됨');keys.delete('KeyW');return '끊김 · 마나 그대로'});
qT('시전','채널링(v20): 키를 한 번 누르면 틱마다 마나가 들며 이어지고(떼도 안 멈춤) · 다시 새로 누르면 멈추고 지대도 사라짐 · 누르고 있어도 다시 시작 안 함',()=>{const e=qCastPrep('mage','blizzard');const i=SLOTS.findIndex(s=>s.code);P.bar[i]='blizzard';buildBar();
  const p=chanPlan('blizzard',skLv('blizzard')),c=costOf('blizzard'),tc=c/p.N,mp0=P.mp;mouse.active=false;
  qKey(SLOTS[i].code);qStep(1,{render:false});qOk(CAST.ch&&CAST.ch.id==='blizzard','채널링 시작 안 됨');qOk(fields.length===1,'눈보라가 안 깔림');qOk(P.cd.blizzard>0,'재사용이 안 걸림');
  const rg=regen();qStep(59,{render:true,renderEvery:20});const k=CAST.ch&&CAST.ch.k;qOk(k>=2&&k<p.N,`1초에 틱 ${k}`);
  const spent=mp0+rg*1-P.mp,want=k*tc;qOk(Math.abs(spent-want)<2,`쓴 마나 ${qR(spent)} (기대 ${qR(want)} = 틱 ${k} × ${qR(tc)}, 전체 ${c})`);qOk(spent<c*.8,'처음에 다 씀');
  qKey(SLOTS[i].code,'keyup');qStep(4,{render:false});qOk(CAST.ch&&CAST.ch.id==='blizzard','손을 떼었더니 멈춤 (v20: 한 번 누르면 이어짐)');qOk(fields.length===1,'떼었더니 지대가 사라짐');
  qKey(SLOTS[i].code);qStep(3,{render:false});qOk(!CAST.ch,'다시 눌렀는데 안 멈춤');qOk(!fields.some(f=>f.t>0),'멈췄는데 지대가 남음');qKey(SLOTS[i].code,'keyup');qStep(1,{render:false});qOk(!CAST.ch,'누르고 있던 키로 다시 시작함');
  const mp1=P.mp;qStep(60,{render:false});qOk(P.mp>=mp1,'멈춘 뒤에도 마나가 듦');qOk(e.taken>0,'눈보라 피해 0');
  return `틱 ${k}/${p.N} · 틱당 마나 ${qR(tc)} · 쓴 마나 ${qR(spent)}/${c}`});
qT('시전','채널링을 끝까지 누르면 예전 한 번 시전과 같은 합계 (아케인 미사일 발 수 · 빔 피해 합 · 마나 합)',()=>{const e=qCastPrep('mage','arcanemissiles');const s=eff('arcanemissiles',10),c=costOf('arcanemissiles');
  let shot=0;const mp0=P.mp,rg=regen();tryCast('arcanemissiles',e);CAST.ch.sticky=true;const known=new Set();
  const n=qStep(120,{render:false,each:()=>{for(const q of projs)if(q.owner==='p'&&!known.has(q)){known.add(q);shot++}},until:()=>!CAST.ch});for(const q of projs)if(!known.has(q)&&q.owner==='p')shot++;
  qOk(shot===s.cnt,`미사일 ${shot}발 (예전 ${s.cnt}발)`);qOk(Math.abs(mp0+rg*n/60-P.mp-c)<2,`마나 합 ${qR(mp0+rg*n/60-P.mp)} ≠ ${c}`);
  // 빔: 틱 피해 합 = 예전 한 번 (12번 평균, 씨앗 고정)
  const id='sunflame';P.sk[id]=10;
  const once=()=>{qClear();const d=qDummy(P.x+150,P.y);P.mp=maxMp();castOrig(id,{x:d.x,y:d.y});return d.taken};
  const chan=()=>{qClear();const d=qDummy(P.x+150,P.y);P.mp=maxMp();tryCast(id,{x:d.x,y:d.y});CAST.ch.sticky=true;qStep(120,{render:false,until:()=>!CAST.ch});return d.taken};
  let a=0,b=0;QA.reseed(31);for(let k=0;k<12;k++){a+=once();b+=chan()}qClear();qOk(a>0&&Math.abs(b/a-1)<.15,`빔 합계 ${Math.round(b/12)} vs 예전 ${Math.round(a/12)}`);
  return `미사일 ${shot}발 ${n}프레임 · 햇불 평균 ${Math.round(b/12)} vs ${Math.round(a/12)}`});
qT('시전','단축칸(포인터·터치, v20): 한 번 누르면 채널링이 끝까지 이어지고 손을 떼도 안 멈춤 · 다시 누르면 멈춤 · 움직이면 끊김 · 꾹 눌러도(터치 contextmenu) 칸이 비지 않음 · 마우스 오른쪽 클릭은 비움 · 툴팁/스킬 창 표시',()=>{const e=qCastPrep('mage','meteor');P.sk.lordvermilion=10;qMana('lordvermilion');P.mp=maxMp();P.bar[4]='lordvermilion';buildBar();// v19: 하늘의 노여움(wrath)이 3차로 빠져 같은 「비·누르고 있기」 마법인 로드 오브 버밀리온으로
  const b=barEl.querySelector('[data-slot="4"]'),o={pointerType:'touch',pointerId:7,button:0,buttons:1,bubbles:true,cancelable:true};
  b.dispatchEvent(new PointerEvent('pointerdown',o));qOk(CAST.ch&&CAST.ch.id==='lordvermilion','누르자마자 채널링이 시작되지 않음');qStep(90,{render:false});
  qOk(CAST.ch&&CAST.ch.id==='lordvermilion'&&CAST.ch.k>=3,`누르고 있는데 멈춤 (틱 ${CAST.ch&&CAST.ch.k})`);qOk(rains.length===1,'벼락 비 없음');
  b.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true}));qOk(P.bar[4]==='lordvermilion','터치로 꾹 누르니 칸이 비었음 (v20 버그)');
  window.dispatchEvent(new PointerEvent('pointerup',o));qStep(5,{render:false});qOk(CAST.ch&&CAST.ch.id==='lordvermilion'&&rains.some(r=>r.t>0),'손을 떼었더니 멈춤 (v20: 한 번 누르면 이어짐)');qOk(P.cd.lordvermilion>0,'재사용이 안 걸림');
  b.dispatchEvent(new PointerEvent('pointerdown',o));window.dispatchEvent(new PointerEvent('pointerup',o));qStep(5,{render:false});qOk(!CAST.ch&&!rains.some(r=>r.t>0),'다시 눌렀는데 안 멈춤');
  qStep(5,{render:false});P.cd={};qRecWait();P.mp=maxMp();b.dispatchEvent(new PointerEvent('pointerdown',o));window.dispatchEvent(new PointerEvent('pointerup',o));qStep(10,{render:false});qOk(CAST.ch&&CAST.ch.id==='lordvermilion','짧게 눌렀는데 이어지지 않음');
  keys.add('KeyD');qStep(3,{render:false});keys.delete('KeyD');qOk(!CAST.ch,'움직였는데 안 끊김');qStep(2,{render:false});
  const om={pointerType:'mouse',pointerId:1,button:2,buttons:2,bubbles:true,cancelable:true};b.dispatchEvent(new PointerEvent('pointerdown',om));b.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,button:2}));qOk(P.bar[4]===null,'마우스 오른쪽 클릭으로 안 비워짐');P.bar[4]='lordvermilion';buildBar();const b2=barEl.querySelector('[data-slot="4"]');
  qOk(/채널링/.test(b2.title),'칸 툴팁에 채널링 없음');openPanel('tree');treeSel=TREE.meteor;nodeSel='meteor';renderPanel();qOk(/시전 1초/.test(pbody.textContent),'스킬 창에 시전 시간 없음');
  nodeSel='lordvermilion';treeSel=TREE.lordvermilion;renderPanel();qOk(/채널링/.test(pbody.textContent),'스킬 창에 채널링 없음');closePanel();return '한 번 누르기 · 떼도 이어짐 · 다시 누르면 멈춤 · 움직이면 끊김 · 꾹 눌러도 칸 그대로 · 표시'});
/* ===== 5c. v18 (SYS): 위계 요구 레벨 · 후딜레이 · 단축키 ===== */
qT('위계','v19 요구 레벨 표 1/5/10/16/23/31/38/45 (1차는 8위계까지) · v18에서 한 위계 올린 마법은 8위계 안에서 그대로 (선행 연결 그대로)',()=>{
  qOk(JSON.stringify(RANK_LV)==='[1,5,10,16,23,31,38,45]',`표 ${RANK_LV}`);qOk(rankOf(4)===1&&rankOf(5)===2&&rankOf(44)===7&&rankOf(45)===8&&rankOf(60)===8,'rankOf');
  const v19r=id=>[SPELL_PATCH_V19,HEAL_PATCH_V19,STRONG_PATCH_V19,EARLY_AOE_V19,CLS_PATCH_V19].some(t=>t[id]&&t[id].rank!=null);
  for(const id in RANK_UP_V18)if(SPELLS[id]&&!SPELLS[id].tab&&!v19r(id))qOk(SPELLS[id].rank===Math.min(RANK_LV.length,RANK_UP_V18[id]),`${id}: 위계 ${SPELLS[id].rank}`);
  qOk((PRE.timestop||[]).includes(SPELLS.slowtime?'slowtime':'hold')&&(PRE.inviolable||[]).includes('divineshield')&&(PRE.regeneration||[]).includes('greaterheal')&&(PRE.rewind||[]).includes('arcaneheal')&&(PRE.painsup||[]).includes('guardianspirit'),'선행 연결이 끊김');
  for(const cls of ['mage','priest'])for(const s of qSpells(cls,s=>!s.tab)){const p=TREEPOS[s.id];qOk(p&&p.row===s.rank-1,`${s.id}: 칸 줄 ${p&&p.row}`)}
  return Object.keys(RANK_UP_V18).filter(id=>SPELLS[id]).map(id=>`${SPELLS[id].n} ${RANK_V17[id]}→${SPELLS[id].tab?'상위':SPELLS[id].rank}`).join(', ')});
qT('위계','레벨 20 캐릭터는 5위계(은총 5단계) 이상을 못 찍고, 4위계는 찍음',()=>{const r=[];
  for(const cls of ['mage','priest']){qPrep(cls,{lvl:20});P.sp=50;let hi=0,lo=0;
    for(const s of qSpells(cls,s=>s.rank>=4))for(const p of PRE[s.id]||[])if(!P.sk[p])P.sk[p]=1;
    for(const s of qSpells(cls,s=>s.rank>=5)){const b=P.sk[s.id]||0;qOk(!canLearn(s.id)&&!learnPoint(s.id)&&(P.sk[s.id]||0)===b,`${s.n}(${s.rank}위계)가 레벨 20에 찍힘`);hi++}
    for(const s of qSpells(cls,s=>s.rank===4&&!P.sk[s.id])){qOk(learnPoint(s.id),`${s.n}(4위계)를 레벨 20에 못 찍음`);lo++}
    qOk(hi>0&&lo>0,`${cls}: 확인한 마법 수 ${hi}/${lo}`);r.push(`${cls}: 막힘 ${hi} · 4위계 ${lo}`)}
  return r.join(' / ')});
qT('위계','v19 옛 저장: 9위계였던 마법(상위 기술)의 점수는 그대로 · 2차 전직 전에는 못 쓰고 못 찍음(알림·스킬 창 안내) · 전직 뒤 레벨이 되면 씀 · 3차로 간 마법은 점수를 돌려받음',()=>{qPrep('mage');QA_ADV.auto=false;
  try{const d=JSON.parse(JSON.stringify(QA_FIX.v5));d.lvl=52;d.slot=QA_SLOT;Object.assign(d.sk,{flamelance:1,pillar:1,sunfall:3,flameshaping:1,ringoffire:1,firestorm:1,seaofflame:2});d.bar[3]='sunfall';d.bar[4]='seaofflame';delete d.job2;
    qOk(load(d,QA_SLOT),'불러오기 실패');if(REG.id!=='home')loadRegion('home');
    qOk(P.lvl===52&&P.sk.sunfall===3&&!P.sk.seaofflame&&P.skOld.seaofflame===2&&P.sp===d.sp+2,`sunfall ${P.sk.sunfall} · seaofflame ${P.sk.seaofflame} · sp ${P.sp} (기대 ${d.sp+2})`);
    qOk(P.bar[3]==='sunfall'&&P.bar[4]==='dragonbreath',`단축칸 ${P.bar.slice(0,5)}`);
    const sp=P.sp=5;qOk(!P.job2&&!advUnlocked('sunfall')&&!canLearn('sunfall')&&!learnPoint('sunfall')&&P.sk.sunfall===3&&P.sp===sp,'2차 전직 전에 찍힘');
    qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();const e=qDummy(P.x+150,P.y+20);P.mp=maxMp();P.cd.sunfall=0;P.noMpT=0;qRecWait();tryCast('sunfall',{x:e.x,y:e.y});
    qOk(!CAST.cur&&!(P.cd.sunfall>0)&&P.mp===maxMp(),'2차 전직 전에 쓰임');qOk(/2차 전직/.test($('#log').textContent),'잠김 알림 없음');
    const txt=detailHtml('sunfall');qOk(/상위 기술/.test(txt)&&/2차 전직/.test(txt)&&/3점/.test(txt),'스킬 창에 잠김 안내가 없음');
    openPanel('tree');treeSel=TREE.sunfall;nodeSel=null;renderPanel();qOk(!pbody.querySelector('[data-node="sunfall"]')&&pbody.querySelector('[data-node="flamelance"]'),'1차 나무에 상위 기술 칸이 보임');closePanel();
    qJob2On();P.lvl=49;qOk(!advUnlocked('sunfall'),'레벨 49에 풀림');P.lvl=52;qOk(advUnlocked('sunfall')&&!canLearn('sunfall'),'레벨 52: 쓰기만 되어야 함');
    qOk(qCast('sunfall',{x:e.x,y:e.y}),'전직 뒤에도 못 씀');qStep(90,{render:false,until:()=>e.taken>0});qOk(e.taken>0,'피해 0');
    P.lvl=53;qOk(canLearn('sunfall')&&learnPoint('sunfall')&&P.sk.sunfall===4,'레벨 53에도 못 찍음')}finally{QA_ADV.auto=true}
  return `상위 기술 3점 유지 · 3차로 간 2점 돌려받음 · 전직 뒤 52레벨에 씀 · 53레벨부터 4점째`});
// 후딜레이 시험용 마법사 마법: 썬더 보이스(v20에 아이 오브 스톰으로 합쳐짐)가 없으면 시전 시간 없는 1차 공격 마법 중 후딜레이 0.4초 이상인 것
const qTV=()=>SPELLS.thundervoice?'thundervoice':Object.keys(SPELLS).find(id=>{const s=SPELLS[id];return s.cls==='mage'&&s.tab!=='adv'&&!s.job2&&s.rank<=8&&isDmg(s)&&!CAST_T[id]&&!CHAN[id]&&recOf(id)>=.4})||/* v24: 센 마법사 기술이 모두 시전 시간을 가지면 시전 기술 중에서 */Object.keys(SPELLS).find(id=>{const s=SPELLS[id];return s.cls==='mage'&&!s.job2&&!s.job3&&isDmg(s)&&CAST_T[id]&&!CHAN[id]&&recOf(id)>=.4})||'meteor';
// v24: 시전 시간이 있는 기술이면 다 외울 때까지 진행 (후딜레이는 외운 뒤에 시작)
const qTVCast=(id,t)=>{tryCast(id,t);if(CAST.cur&&CAST.cur.id===id){let n=0;while(CAST.cur&&n++<400)update(1/60)}};
qT('후딜레이','표: 기본기 0~0.1초 · 9위계 > 1위계 · 위급한 치유·보호막·무적·가호·순간이동 0 · 무기 기본 공격 0 · 툴팁에 표시',()=>{const bad=[];
  for(const id of ['spark','splash','light','smite','crackstone','firebolt','ember'])if(SPELLS[id]&&recOf(id)>.1)bad.push(`${id} ${recOf(id)}`);
  for(const id of ['minorheal','closewounds','greaterheal','salvation','regeneration','rewind','gatherdew','arcaneheal','lightward','kyrie','divineshield','iceshield','airwall','stoneset','shieldcircle','inviolable','stonebody','bodyofwater','guardianspirit','painsup','blink','windleap'])if(SPELLS[id]&&recOf(id)!==0)bad.push(`${id} ${recOf(id)}≠0`);
  for(const s of Object.values(SPELLS)){const r=recOf(s.id);if(!(r>=0&&r<=.8))bad.push(`${s.id} 범위 밖 ${r}`);if(s.aspd&&r!==0)bad.push(`${s.id} 기본 공격 ${r}`);if(s.kind==='passive'&&r)bad.push(s.id)}
  qOk(!bad.length,bad.slice(0,6).join(', '));
  const avg=f=>{const a=Object.values(SPELLS).filter(s=>isDmg(s)&&f(s)).map(s=>recOf(s.id));return a.reduce((x,y)=>x+y,0)/Math.max(1,a.length)};
  const a1=avg(s=>s.rank===1),a9=avg(s=>s.rank===9),a5=avg(s=>s.rank===5);qOk(a9>a5&&a5>a1&&a9>=.4,`평균 1위계 ${qR(a1)} 5위계 ${qR(a5)} 9위계 ${qR(a9)}`);
  SPELLS.qa_r9={id:'qa_r9',cls:'warrior',rank:9,kind:'nova',mult:5,rad:240,cd:12};SPELLS.qa_r1={id:'qa_r1',cls:'archer',rank:1,kind:'melee',mult:1,cd:1,aspd:1};
  const g9=recOf('qa_r9'),g1=recOf('qa_r1');delete SPELLS.qa_r9;delete SPELLS.qa_r1;qOk(g9>=.4&&g1===0,`새 직업 규칙: 9위계 ${g9} · 기본 공격 ${g1}`);
  const TV=qTV();qOk(/후딜레이 0\.\d+초/.test(castInfo(TV,10))&&/시전 1초 · 후딜레이/.test(castInfo('meteor',10))&&!/후딜레이/.test(castInfo('minorheal',10)),'툴팁/스킬 창 문구');
  return `평균 1위계 ${qR(a1)} · 5위계 ${qR(a5)} · 9위계 ${qR(a9)} · ${SPELLS[TV].n} ${recOf(TV)}초 · 메테오 ${recOf('meteor')}초`});
qT('후딜레이','쓰고 나면 잠깐 다른 마법이 막히고 그사이 누른 마법은 끝나자마자 나감 · 움직임·물약은 됨 · 단축칸이 어두워짐',()=>{qPrep('mage',{lvl:60});
  const TV=qTV();for(const id of [TV,'spark','firebolt'])P.sk[id]=10;P.bar[2]='spark';buildBar();P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();const e=qDummy(P.x+120,P.y);
  qMana(TV);P.mp=maxMp();qTVCast(TV,e);const r=recOf(TV);qOk(P.cd[TV]>0,'시전 안 됨');qOk(r>=.4&&REC.t>r-.02&&REC.t<=r+1e-9,`후딜레이 ${REC.t} (표 ${r})`);
  tryCast('spark',e);qOk(!(P.cd.spark>0),'후딜레이 중에 다른 마법이 나감');qOk(REC.q&&REC.q.id==='spark','누른 마법을 기억하지 않음');
  render();qOk(barEl.classList.contains('rec'),'단축칸이 어두워지지 않음');
  const x0=P.x;keys.add('KeyD');qStep(6,{render:false});keys.delete('KeyD');qOk(Math.abs(P.x-x0)>1,'후딜레이 중에 못 움직임');qOk(!(P.cd.spark>0),'후딜레이가 끝나기 전에 나감');
  potAdd('hp',POT_DEF,2);P.hp=Math.round(maxHp()*.4);const pn=potTotal('hp');REC.t=Math.max(REC.t,.2);usePotion('hp');qOk(potTotal('hp')===pn-1,'후딜레이 중에 물약을 못 마심');
  const n=qStep(60,{render:false,until:()=>P.cd.spark>0});qOk(P.cd.spark>0,'끝나도 기억한 마법이 안 나감');qOk(REC.t===0&&!barEl.classList.contains('rec'),'끝나도 어두움이 남음');
  qClear();P.mp=maxMp();tryCast('spark',e);qOk(P.cd.spark>0&&REC.t===0,'기본기에 후딜레이');tryCast('firebolt',e);qOk(P.cd.firebolt>0,'기본기 다음 마법이 막힘');
  return `썬더 보이스 후딜레이 ${r}초 · 기억한 스파크가 ${6+n}프레임 뒤 나감`});
qT('후딜레이','시전 시간 마법은 다 외운 뒤에, 채널링은 끝난 뒤에 짧게',()=>{const e=qCastPrep('mage','meteor');tryCast('meteor',{x:e.x,y:e.y});qOk(CAST.cur&&REC.t===0,'외우는 중에 후딜레이');
  qStep(90,{render:false,until:()=>!CAST.cur});qOk(P.cd.meteor>0&&REC.t>0&&REC.t<=recOf('meteor')+1e-9,`다 외운 뒤 후딜레이 ${REC.t}`);
  qClear();P.sk.blizzard=10;qMana('blizzard');P.mp=maxMp();tryCast('blizzard',{x:e.x,y:e.y});qOk(CAST.ch&&REC.t===0,'채널링 중에 후딜레이');CAST.ch.sticky=true;
  qStep(400,{render:false,until:()=>!CAST.ch});qOk(!CAST.ch&&REC.t>0&&REC.t<=.25,`채널링 뒤 후딜레이 ${REC.t}`);return `메테오 ${recOf('meteor')}초 · 눈보라 ${recOf('blizzard')}초`});
qT('단축키','옛 저장(keys 없음)은 기본 배치 그대로 · 바꾸지 않으면 저장에 keys가 생기지 않음',()=>{qPrep('mage');
  qOk(kbBind('s2')==='Digit1'&&kbBind('s11')==='Digit0'&&kbBind('s12')==='Backquote'&&kbBind('s13')==='F1'&&kbBind('s20')==='F8'&&kbBind('hp')==='KeyQ'&&kbBind('map')==='KeyM'&&kbBind('s0')==='','기본 배치가 다름');
  qOk(!('keys' in saveData()),'저장에 keys가 생김');
  const d=JSON.parse(JSON.stringify(QA_FIX.v5));d.slot=QA_SLOT;qOk(load(d,QA_SLOT),'불러오기 실패');qOk(!Object.keys(P.keys||{}).length&&kbBind('s2')==='Digit1'&&CODE2SLOT.Digit1===2&&CODE2SLOT.F8===20&&SLOTS[2].k==='1'&&SLOTS[13].k==='F1'&&SLOTS[0].k==='좌','불러온 뒤 기본 배치가 아님');
  return `칸 ${Object.keys(CODE2SLOT).length}개 키`});
qT('단축키','바꾸기: F1 칸을 Shift+1로 → 칸 글자 ⇧1 · Shift+1이 그 칸을 쓰고 1은 1번 칸 · 비워진 F1은 아무것도 안 함 · Alt+2',()=>{qPrep('mage',{lvl:60});
  for(const id of ['spark','firebolt','splash'])P.sk[id]=10;P.bar[2]='spark';P.bar[13]='firebolt';P.bar[14]='splash';buildBar();P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();qDummy(P.x+150,P.y);mouse.active=false;
  qOk(kbSet('s13','S+Digit1')==='','바꾸기 실패');qOk(SLOTS[13].k==='⇧1'&&barEl.querySelector('[data-slot="13"] .k').textContent==='⇧1','칸 글자가 ⇧1이 아님');
  const kd=(code,o,type)=>{const ev=new KeyboardEvent(type||'keydown',Object.assign({code,bubbles:true,cancelable:true},o));window.dispatchEvent(ev);return ev};
  kd('Digit1',{shiftKey:true});qStep(1,{render:false});kd('Digit1',{shiftKey:true},'keyup');qOk(P.cd.firebolt>0,'Shift+1로 그 칸이 안 나감');qOk(!(P.cd.spark>0),'Shift+1에 1번 칸도 나감');
  qClear();qKey('Digit1');qStep(1,{render:false});qKey('Digit1','keyup');qOk(P.cd.spark>0&&!(P.cd.firebolt>0),'1이 1번 칸을 안 씀');
  qClear();qKey('F1');qStep(1,{render:false});qKey('F1','keyup');qOk(!Object.keys(P.cd).some(k=>P.cd[k]>0),'비워진 F1이 마법을 씀');
  qOk(kbSet('s14','A+Digit2')==='','Alt+2 실패');qClear();const ev=kd('Digit2',{altKey:true});qStep(1,{render:false});kd('Digit2',{altKey:true},'keyup');qOk(P.cd.splash>0,'Alt+2로 안 나감');qOk(ev.defaultPrevented,'Alt 조합의 브라우저 동작을 막지 않음');
  qOk(![...keys].length,'뗀 뒤에도 키가 눌린 채로 남음');kbReset();return 'Shift+1 · Alt+2 · 1 · F1(비움)'});
qT('단축키','겹치면 서로 바꿈 · 브라우저가 쓰는 조합과 이동 키는 막힘 · 모두 기본값으로',()=>{qPrep('mage');
  qOk(kbSet('s2','Digit2')===''&&kbBind('s2')==='Digit2'&&kbBind('s3')==='Digit1'&&CODE2SLOT.Digit2===2&&CODE2SLOT.Digit1===3,'칸끼리 안 바뀜');
  qOk(kbSet('hp','Digit3')===''&&kbBind('hp')==='Digit3'&&kbBind('s4')==='KeyQ'&&CODE2SLOT.KeyQ===4,'물약과 칸이 안 바뀜');
  const blocked=[];for(const c of ['A+F4','C+KeyW','C+KeyT','C+KeyN','C+KeyR','C+KeyL','C+Digit1','F5','F11','F12','KeyW','KeyA','Space','Escape','Tab','ArrowUp','CS+KeyI']){const b=JSON.stringify(KB.bind),why=kbSet('s5',c);qOk(why,`${c}가 들어감`);qOk(JSON.stringify(KB.bind)===b,`${c}: 실패했는데 배치가 바뀜`);blocked.push(c)}
  qOk(kbSet('s5','S+F2')===''&&kbSet('s6','C+F3')==='','Shift/Ctrl 조합이 안 들어감');
  kbReset();qOk(kbBind('s2')==='Digit1'&&kbBind('hp')==='KeyQ'&&kbBind('s5')==='Digit4'&&!Object.keys(P.keys).length,'기본값으로 안 돌아감');return `막힘: ${blocked.join(' ')}`});
qT('단축키','저장 · 불러오기 왕복 (캐릭터마다) · 손상된 keys는 걸러짐',()=>{qPrep('mage');kbSet('s13','A+Digit1');kbSet('map','KeyN');kbSet('s20','');const d=JSON.parse(JSON.stringify(saveData()));
  qOk(d.keys&&d.keys.s13==='A+Digit1'&&d.keys.map==='KeyN'&&d.keys.s20===''&&Object.keys(d.keys).length===3,`저장 ${JSON.stringify(d.keys)}`);
  qPrep('priest');qOk(kbBind('s13')==='F1'&&kbBind('map')==='KeyM','다른 캐릭터에 따라옴');
  qOk(load(d,QA_SLOT),'불러오기 실패');qOk(kbBind('s13')==='A+Digit1'&&kbBind('map')==='KeyN'&&kbBind('s20')===''&&kbBind('s2')==='Digit1'&&SLOTS[13].k==='A1'&&SLOTS[20].k==='–','불러온 배치가 다름');
  const bad=Object.assign({},d,{keys:{s2:'C+KeyW',s3:12,zz:'KeyZ',s4:'S+Digit9',s5:'S+Digit9',hp:'',s6:'<b>',s7:{x:1}}});qOk(load(bad,QA_SLOT),'손상된 keys로 불러오기 실패');
  qOk(kbBind('s2')==='Digit1'&&kbBind('s3')==='Digit2'&&kbBind('s4')==='S+Digit9'&&kbBind('s5')==='Digit4'&&kbBind('hp')===''&&kbBind('s6')==='Digit5'&&kbBind('s7')==='Digit6','손상된 keys가 걸러지지 않음');
  const d2=saveData();qOk(JSON.stringify(d2.keys)==='{"s4":"S+Digit9","hp":""}',`다시 저장 ${JSON.stringify(d2.keys)}`);return JSON.stringify(d.keys)});
qT('단축키','다른 키: 지도 M을 N으로 옮기면 N이 지도를 열고 M은 안 염 · 물약 키 옮기기',()=>{qPrep('mage');kbSet('map','KeyN');
  qKey('KeyN');qOk(wmapIsOpen(),'N으로 지도가 안 열림');wmapClose();qKey('KeyM');qOk(!wmapIsOpen(),'옮긴 뒤에도 M이 지도를 염');
  kbSet('hp','S+KeyQ');potAdd('hp',POT_DEF,3);P.hp=Math.round(maxHp()*.4);let n=potTotal('hp');qKey('KeyQ');qOk(potTotal('hp')===n,'옮긴 뒤에도 Q로 물약을 마심');
  window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyQ',shiftKey:true,bubbles:true,cancelable:true}));qOk(potTotal('hp')===n-1,'Shift+Q로 물약을 못 마심');
  kbReset();qKey('KeyM');qOk(wmapIsOpen(),'기본값으로 돌린 뒤 M이 안 됨');wmapClose();return 'N → 지도 · Shift+Q → 물약'});
qT('단축키','설정 창: 칸 21개 + 물약·창 · 누른 조합으로 바뀌고 저장됨 · 막힌 키는 안내 · Esc 취소/닫기 · 여는 버튼',()=>{qPrep('mage');
  qOk($('#intro [data-kbopen]'),'시작 화면에 단축키 버튼 없음');openPanel('tree');qOk(pbody.querySelector('[data-kbopen]'),'스킬 트리에 단축키 버튼 없음');closePanel();
  kbOpen();const w=$('#kbwin');qOk(w&&!w.hidden&&paused,'창이 안 열림');qOk(w.querySelectorAll('[data-kb]').length===21+KB_EXTRA.length,`줄 ${w.querySelectorAll('[data-kb]').length}`);
  qClick('[data-kb="s14"]',w);qOk(KB.cap==='s14','키 기다리기가 안 됨');window.dispatchEvent(new KeyboardEvent('keydown',{code:'Digit2',altKey:true,bubbles:true,cancelable:true}));
  qOk(kbBind('s14')==='A+Digit2'&&!KB.cap&&/Alt\+2/.test(w.querySelector('[data-kb="s14"]').textContent),'누른 조합으로 안 바뀜');
  const sv=readSlot(curSlot);qOk(sv&&sv.keys&&sv.keys.s14==='A+Digit2','바꾼 키가 저장되지 않음');
  qClick('[data-kb="s15"]',w);qKey('F12');qOk(KB.cap==='s15'&&kbBind('s15')==='F3'&&/브라우저/.test(w.querySelector('.kbnote').textContent),'막힌 키 안내가 없음');
  qKey('Escape');qOk(!KB.cap&&kbBind('s15')==='F3'&&!w.hidden,'Esc가 취소하지 않음');
  qClick('[data-kbreset]',w);qOk(kbBind('s14')==='F2','기본값으로 안 돌아감');qKey('Escape');qOk(w.hidden&&!paused,'Esc로 안 닫힘');return `줄 ${21+KB_EXTRA.length}개`});
qT('스킬 트리','v18: 고른 아이콘 옆 + 로 그 자리에서 1점 · 못 찍을 때는 막히고 까닭(레벨·선행·포인트·최대)을 보여 줌',()=>{qPrep('mage',{lvl:10});P.sp=2;openPanel('tree');treeSel=TREE.spark;renderPanel();
  const plus=id=>pbody.querySelector(`.nodeplus[data-learn="${id}"]`),r=[];
  qClick('#pbody [data-node="spark"]');let b=plus('spark');qOk(b&&b.getAttribute('aria-disabled')==='false','spark 옆 + 가 없거나 막힘');
  const n=P.sk.spark;b.click();qOk(P.sk.spark===n+1&&P.sp===1,`+로 안 찍힘 (${P.sk.spark}, sp ${P.sp})`);qOk(plus('spark'),'찍은 뒤 + 가 사라짐');
  const chk=(id,re,what)=>{qClick(`#pbody [data-node="${id}"]`);const p=plus(id);qOk(p,`${id}: + 없음`);qOk(p.getAttribute('aria-disabled')==='true'&&re.test(p.dataset.why)&&re.test(p.title),`${what}: 막힘/까닭 ${p.dataset.why}`);
    const k=P.sk[id]||0,sp=P.sp;p.click();qOk((P.sk[id]||0)===k&&P.sp===sp,`${what}: 막혔는데 찍힘`);r.push(`${what} 「${p.dataset.why}」`)};
  chk('fireburst',/레벨 23/,'레벨');P.lvl=60;renderPanel();chk('pyroblast',/선행/,'선행');P.sp=0;renderPanel();chk('spark',/포인트/,'포인트');P.sp=5;P.sk.spark=MAXSK;renderPanel();chk('spark',/최대/,'최대');
  closePanel();return r.join(' · ')});
qT('단축칸','v18: 스킬 트리에서 아이콘을 고른 뒤 단축키를 누르면 그 칸에 등록 (3 · Shift+1 조합) · 고르지 않았거나 좌/우 칸이면 등록 안 함',()=>{qPrep('mage',{lvl:60});P.sk.firebolt=5;P.sk.frostdiver=3;P.bar.fill(null);buildBar();
  openPanel('tree');treeSel=TREE.firebolt;renderPanel();qKey('Digit3');qKey('Digit3','keyup');qOk(P.bar[4]==null,'고르지 않았는데 등록됨');
  qClick('#pbody [data-node="firebolt"]');qOk(/단축키를 누르면 이 칸에 등록/.test(pbody.textContent),'안내 줄이 없음');
  qKey('Digit3');qKey('Digit3','keyup');qOk(P.bar[4]==='firebolt'&&P.bar.filter(x=>x==='firebolt').length===1,`3번 칸 ${P.bar[4]}`);qOk(!panel.hidden&&tab==='tree','등록하고 창이 닫힘');
  kbSet('s13','S+Digit1');treeSel=TREE.frostdiver;renderPanel();qClick('#pbody [data-node="frostdiver"]');
  window.dispatchEvent(new KeyboardEvent('keydown',{code:'Digit1',shiftKey:true,bubbles:true,cancelable:true}));window.dispatchEvent(new KeyboardEvent('keyup',{code:'Digit1',shiftKey:true,bubbles:true,cancelable:true}));
  qOk(P.bar[13]==='frostdiver'&&P.bar[2]!=='frostdiver',`Shift+1(F1 칸) ${P.bar[13]}`);
  kbSet('s0','KeyG');qKey('KeyG');qKey('KeyG','keyup');qOk(P.bar[0]==null,'좌 칸(마우스)에 등록됨');
  closePanel();qKey('Digit5');qKey('Digit5','keyup');qOk(P.bar[6]==null,'창을 닫았는데 등록됨');kbReset();return '3 → firebolt · Shift+1 → frostdiver'});
/* ===== 6. 세계 ===== */
qT('세계','고향 마을 4곳 방문 → 짝문 목록에 열림',()=>{qPrep('mage',{lvl:30});const r=[];
  for(const t of TOWNS){P.x=t.x;P.y=t.y+110;qStep(2,{render:false});qOk(P.towns.includes(t.id),`${t.n} 방문 기록 없음`);qOk(P.home===t.id,`${t.n}: 귀환 마을이 ${P.home}`);r.push(t.n)}
  render();return r.join(', ')});
qT('세계','짝문: 안 가 본 마을은 잠김',()=>{qPrep('mage');const t=TOWNS[0];qOk(qActAt(t.gate.x+20,t.gate.y+20)==='gate','짝문 앞인데 act≠gate');doAct();qOk(!panel.hidden&&tab==='gate','짝문 창이 안 열림');
  /* v26: 짝문 = 세계 지도. 안 가 본 마을은 자물쇠 단추(data-travel 없음) */qOk(!pbody.querySelector('[data-travel="arden"]')&&!pbody.querySelector('[data-travel="haven"]'),'안 가 본 아르덴 · 헤이븐 버튼이 열려 있음');
  qOk(pbody.querySelectorAll('.g26t.lock').length>=ALLTOWNS.length-1,'자물쇠 단추가 모자람');closePanel()});
qT('세계','짝문으로 남부 마을 사이 순간이동 (화면 버튼, v26: 브렌힐 · 헤이븐)',()=>{qPrep('mage',{lvl:30});for(const t of TOWNS){P.x=t.x;P.y=t.y+110;qStep(1,{render:false})}
  qOk(TOWNS.length===2,'남부 마을 '+TOWNS.length);const order=[...TOWNS];let cur=TOWNS[TOWNS.length-1];const r=[];
  // 지금은 마지막 마을(헤이븐)에 있음 → 브렌힐 → 헤이븐
  for(const t of order){qOk(qActAt(cur.gate.x+20,cur.gate.y+20)==='gate',`${cur.n} 짝문 act≠gate`);doAct();qClick(`#pbody [data-travel="${t.id}"]`);
    qOk(panel.hidden,'창이 닫히지 않음');qOk(REG.id==='home','지역이 바뀜');qOk(Math.hypot(P.x-t.gate.x,P.y-t.gate.y)<80,`${t.n} 짝문 근처가 아님 (${Math.round(P.x)},${Math.round(P.y)})`);qOk(P.home===t.id,'귀환 마을이 안 바뀜');
    qStep(2,{render:false});r.push(`${cur.n}→${t.n}`);cur=t}
  render();return r.join(', ')});
qT('세계','짝문으로 다른 지역 전초 마을(골드미어)로 가기',()=>{qPrep('mage',{lvl:30});const g=ALLTOWNS.find(t=>t.id==='goldmere');qOk(g,'골드미어 없음');P.towns.push('goldmere');
  const t=TOWNS[0];qActAt(t.gate.x+20,t.gate.y+20);doAct();qClick('#pbody [data-travel="goldmere"]');qOk(REG.id===g.reg,`지역 ${REG.id}`);qOk(Math.hypot(P.x-g.gate.x,P.y-g.gate.y)<80,'짝문 근처가 아님');qStep(5);loadRegion('home')});
qT('세계','던전 4곳: 들어가기(F)와 나가기 — 나오면 입구 앞',()=>{qPrep('mage',{lvl:30});P.invT=1e9;const r=[];qOk(CAVES.length===4,`던전 ${CAVES.length}곳`);
  for(const c of CAVES.slice()){qOk(qActAt(c.x,c.y+40)==='dungeon'&&actCave===c,`${c.cave.n}: 입구 act=${act}`);doAct();qOk(DG&&DG.d.id===c.cave.id,`${c.cave.n}: 던전에 안 들어감`);
    P.invT=1e9;qStep(30,{renderEvery:10});const ex=DG.portals[0];qOk(qActAt(ex.x,ex.y)==='exit','나가는 문 act≠exit');doAct();
    qOk(!DG,'던전에서 안 나옴');qOk(REG.id==='home','지역이 바뀜');qOk(Math.abs(P.x-c.x)<1&&Math.abs(P.y-(c.y+80))<1,`나온 자리 (${Math.round(P.x)},${Math.round(P.y)}) ≠ 입구 앞`);r.push(c.cave.n)}
  return r.join(', ')});
qT('세계','던전 안에서 저장하면 입구 앞·고향 지역으로 저장',()=>{qPrep('mage',{lvl:30});const c=CAVES[1];P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG,'못 들어감');
  const d=saveData();qOk(d.x===c.x&&d.y===c.y+80&&d.reg==='home',`저장 위치 ${d.x},${d.y},${d.reg}`);leaveDungeon()});
for(const id of Object.keys(REGIONS))qT('세계',`지역 ${REGIONS[id].n}(${id}): 불러오기와 끝 포탈`,()=>{qPrep('mage',{lvl:60});P.invT=1e9;const r=[];
  if(id!=='home'){switchRegion(id);qOk(REG.id===id,`REG ${REG.id}`);qOk(TOWNS.length===1&&TOWNS[0].reg===id,'전초 마을 없음');qOk(!blockedAt(P.x,P.y),'도착 자리가 물/용암');qStep(20,{renderEvery:5,spawn:true})}
  else{loadRegion('home');qOk(TOWNS.length===2,'남부 마을 수(v26 브렌힐 · 헤이븐)')}
  const edges=EDGES.slice();qOk(edges.length===Object.keys(REGIONS[id].edges).length,`포탈 ${edges.length}개`);
  for(const ep of edges){if(id==='home')loadRegion('home');else switchRegion(id,null,null,true);qClear();
    const a0=qActAt(ep.x,ep.y);qOk(a0==='edge'&&actEdge&&actEdge.to===ep.to,`${ep.side} 포탈 act=${a0}`);doAct();
    qOk(REG.id===ep.to,`${ep.side} 포탈 → ${REG.id} (기대 ${ep.to})`);const ar=arrivalOf(ep.side,ep.to);qOk(Math.abs(P.x-ar.x)<1&&Math.abs(P.y-ar.y)<1,'도착 위치가 다름');
    const back=EDGES.find(e=>e.side===OPP[ep.side]);qOk(back&&back.to===id,`${ep.to}의 ${OPP[ep.side]} 포탈이 ${back&&back.to} (기대 ${id})`);qOk(dist(P,back)<200,'돌아가는 포탈과 멀리 떨어짐');qOk(!blockedAt(P.x,P.y),'도착 자리가 막힘');
    qStep(3,{render:true});r.push(`${ep.side}→${ep.to}`)}
  loadRegion('home');return r.join(', ')});

/* ===== 7. 보스 ===== */
// 패턴 감지: 내려찍기(slam)=경고 원, 탄막(volley)=한 번에 7발 이상, 부하 부르기(summon)=그 종류가 새로 생김, 돌진(charge)=dash, 분노(rage)=hp 50% 아래
function qFreeAt(x,y,d,a0){for(let k=0;k<24;k++){const a=a0+k*.2618,px=x+Math.cos(a)*d,py=y+Math.sin(a)*d;if(DG?dgFree(px,py,P.r+2):!blockedAt(px,py))return{x:px,y:py}}return null}
function qBossRun(e,secs){const t=TYPES[e.k],seen=new Set(),known=new Set(projs),kE=new Set(enemies),kW=new Set(warns);let dashing=false;
  enemies=enemies.filter(o=>o===e);e.aggroed=true;P.invT=1e9;
  const N=Math.ceil(secs*60);for(let i=0;i<N;i++){if(i%90===0){const p=qFreeAt(e.x,e.y,(i/90)%2?360:170,i*.7);if(p){P.x=p.x;P.y=p.y}}P.hp=maxHp();P.invT=1e9;spawnT=1e9;
    // 다른 몬스터가 많으면 부하 부르기가 막히므로 부하는 정리한다(보스만 남김)
    if(enemies.length>12)enemies=enemies.filter(o=>o===e||!o.aggroed||o.qaKeep);
    update(1/60);if(i%30===0)render();
    let nv=0;for(const p of projs)if(!known.has(p)){known.add(p);if(p.owner==='e')nv++}if(nv>=7)seen.add('volley');
    for(const w of warns)if(!kW.has(w)){kW.add(w);if(w.src===e&&w.dmg>0)seen.add('slam')}
    for(const o of enemies)if(!kE.has(o)){kE.add(o);if(o.k===t.summon)seen.add('summon')}
    if(e.dash>0&&!dashing)seen.add('charge');dashing=e.dash>0;
    const b=qBad();if(b.length)throw new QAFail(b.join(','));
    if(e.dead)break;if(t.skills.every(s=>seen.has(s)))break}
  return seen}
function qEnter(D){qPrep('mage',{lvl:40});const c=CAVES.find(c=>c.cave===D);qOk(c,'입구 없음');P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.d===D,'던전에 못 들어감')}
qT('아이템','v18 드롭 희귀도: 유니크·세트·상급 유니크가 예전보다 드묾 (아이템 2만 개 · 보스 처치 600번 표본)',()=>{qPrep('mage',{lvl:40});QA.reseed(424242);
  const cnt=(el)=>{const c={u:0,s:0};for(let i=0;i<20000;i++){const it=makeItem(30,el);if(it.rar===4)c.u++;else if(it.rar===3)c.s++}return{u:c.u/200,s:c.s/200}};
  const n=cnt(false),e=cnt(true);qOk(n.u<=.6&&n.s<=.9,`일반 몹 유니크 ${n.u}% 세트 ${n.s}%`);qOk(e.u<=2.2&&e.s<=3.2&&e.u>=.8,`정예 유니크 ${e.u}% 세트 ${e.s}%`);
  const D=DUNGEONS[0];qEnter(D);const b=DG.boss,mini=enemies.find(x=>TYPES[x.k].mini);let bu=0,mu=0;const N=600;
  for(let i=0;i<N;i++){loot=[];dgBossDrop(b);if(loot.some(l=>l.kind==='item'&&l.item.rar===5))bu++;loot=[];if(mini){dgBossDrop(mini);if(loot.some(l=>l.kind==='item'&&l.item.rar>=3))mu++}}
  DG.portals.length=0;DG.bossDead=false;loot=[];banner=null;leaveDungeon();
  qOk(bu/N>.22&&bu/N<.45,`상급 유니크 ${Math.round(bu/N*100)}%`);qOk(!mini||mu/N<.4,`준보스 유니크·세트 ${Math.round(mu/N*100)}%`);
  return `일반 유니크 ${n.u}%·세트 ${n.s}% · 정예 ${e.u}%·${e.s}% · 보스 상급 유니크 ${Math.round(bu/N*100)}% · 준보스 유니크/세트 ${Math.round(mu/N*100)}%`});
for(const D of DUNGEONS){
  qT('보스',`${D.n}: 보스 1 · 준보스 2 등장`,()=>{qPrep('mage',{lvl:40});const c=CAVES.find(c=>c.cave===D);P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.d===D,'못 들어감');
    const bs=enemies.filter(e=>TYPES[e.k].boss),ms=enemies.filter(e=>TYPES[e.k].mini);qOk(bs.length===1&&bs[0].k===D.boss,`보스 ${bs.map(e=>e.k)}`);qOk(ms.length===2&&D.minis.every(k=>ms.some(e=>e.k===k)),`준보스 ${ms.map(e=>e.k)}`);
    qOk(DG.boss===bs[0],'DG.boss 불일치');return `${TYPES[D.boss].n} Lv${bs[0].lvl}, ${ms.map(e=>TYPES[e.k].n).join('·')} · 몬스터 ${enemies.length}`});
  for(const k of [...D.minis,D.boss])qT('보스',`${D.n}: ${TYPES[k].n} 패턴 (${TYPES[k].skills.join('·')}${TYPES[k].boss?'·rage':''})`,()=>{
    qEnter(D);
    const e=enemies.find(o=>o.k===k&&!o.dead);qOk(e,'몬스터가 없음');const seen=qBossRun(e,70);if(TYPES[k].skills.some(s=>!seen.has(s))&&!e.dead)for(const s of qBossRun(e,70))seen.add(s);
    if(TYPES[k].boss){e.hp=e.max*.45;qStep(2,{render:false,each:()=>{P.invT=1e9;e.skT=99}});if(e.rage)seen.add('rage')}
    const want=[...TYPES[k].skills,...(TYPES[k].boss?['rage']:[])],miss=want.filter(s=>!seen.has(s));qOk(!miss.length,`안 나온 패턴: ${miss.join(',')} (나온 것 ${[...seen].join(',')||'없음'})`);return [...seen].join(',')});
  qT('보스',`${D.n}: 보스를 쓰러뜨리면 전리품 3개(첫째는 상급 유니크·유니크·세트 중 하나)와 나가는 문`,()=>{qEnter(D);
    const e=DG.boss;qOk(e&&!e.dead,'보스 없음');const n0=DG.portals.length;loot=[];hurtE(e,e.hp+10,{el:'fire'});qOk(e.dead,'안 쓰러짐');
    const its=loot.filter(l=>l.kind==='item').map(l=>l.item);qOk(its.length>=2&&its[0].rar>=3,`전리품 (등급 ${its.map(i=>i.rar)})`);qOk(DG.bossDead,'bossDead 아님');qOk(DG.portals.length===n0+1,'나가는 문이 안 생김');
    qStep(10);const u=its[0];leaveDungeon();return `${u.name} (${RAR[u.rar].n})`});
}
for(const id of REG_IDS.filter(id=>REGIONS[id].boss))qT('보스',`지역 우두머리 ${REGIONS[id].n}: 둥지 근처에서 나타남 · 패턴`,()=>{qPrep('mage',{lvl:60});switchRegion(id);P.invT=1e9;const L=REG.lair;qOk(L,'둥지 없음');
  const p=qFreeAt(L.x,L.y,500,0);P.x=p.x;P.y=p.y;qStep(3,{render:false});const e=REG.bossE;qOk(e&&e.k===REGIONS[id].boss,`우두머리 ${e&&e.k}`);
  const seen=qBossRun(e,70);if(TYPES[e.k].skills.some(s=>!seen.has(s))&&!e.dead)for(const s of qBossRun(e,70))seen.add(s);/* v21: 무작위로 한 패턴이 70초 안에 안 나올 수 있어 한 번 더 */const miss=TYPES[e.k].skills.filter(s=>!seen.has(s));qOk(!miss.length,`안 나온 패턴: ${miss} (나온 것 ${[...seen]})`);
  hurtE(e,e.hp+10,{el:'arcane'});qStep(2,{render:false});qOk(REG.bossDead,'쓰러진 기록 없음');/* v21: 불 몬스터는 불에 덜 맞으므로 속성 없는 피해로 */const r=`${TYPES[e.k].n}: ${[...seen].join(',')}`;loadRegion('home');return r});

/* ===== 8. 아이템 ===== */
qT('아이템','정예 몬스터를 쓰러뜨리면 장비가 떨어지고, 밟으면 줍는다',()=>{qPrep('mage',{lvl:20});let l=null;/* v21 junkKeep이 흔한 장비를 확률로 버리므로 떨어질 때까지 정예를 몇 마리 더(무작위에 흔들리지 않게) */for(let i=0;i<10&&!l;i++){const e=dgMob('wolf',P.x+60,P.y,15,{elite:true});hurtE(e,e.hp+10);qOk(e.dead,'안 쓰러짐');l=loot.find(l=>l.kind==='item')}
  qOk(l,'장비가 안 떨어짐');P.x=l.x;P.y=l.y;const b=P.bag.length;qStep(2,{render:false});qOk(l.taken&&P.bag.length>b&&P.bag.includes(l.item),`못 주움 (가방 ${b}→${P.bag.length}, taken=${l.taken})`);return l.item.name});
qT('아이템','착용(캐릭터 창 버튼)하면 능력치가 바뀜',()=>{qPrep('mage',{lvl:30});let it;for(let i=0;i<50&&!(it&&it.slot==='staff'&&it.stats.int);i++)it=makeItem(30,false);qOk(it&&it.stats.int,'지팡이를 못 만듦');
  it.stats={int:40,hp:100};P.bag=[it];const pw=power(),hp=maxHp();openPanel('char');qClick(`#pbody [data-equip="${it.id}"]`);closePanel();
  qOk(P.gear.staff===it&&!P.bag.length,'착용 안 됨');qOk(power()===pw+40,`주문력 ${pw}→${power()}`);qOk(maxHp()===hp+100,`생명력 ${hp}→${maxHp()}`);return `주문력 +40, 생명력 +100`});
for(const cls of ['mage','priest'])qT('아이템',`세트 효과 2·3·4벌 (${cls==='mage'?'마법사':'사제'})`,()=>{qPrep(cls,{lvl:40});const r=[];
  for(const sid of Object.keys(SETS).filter(k=>SETS[k].cls===cls)){const S=SETS[sid];P.gear={staff:null,robe:null,ring:null,amulet:null};const slots=Object.keys(SLOT);
    for(let n=1;n<=4;n++){const sl=slots[n-1];P.gear[sl]={id:uid++,slot:sl,rar:3,name:S.p[sl],il:30,stats:{},cls,set:sid};const g=gearStats(),want={};
      for(const c in S.b)if(n>=+c)for(const [k,v] of Object.entries(S.b[c]))want[k]=Math.round(((want[k]||0)+v)*10)/10;
      qOk(JSON.stringify(Object.keys(g).sort().map(k=>[k,g[k]]))===JSON.stringify(Object.keys(want).sort().map(k=>[k,want[k]])),`${S.n} ${n}벌: ${JSON.stringify(g)} ≠ ${JSON.stringify(want)}`)}
    r.push(S.n)}
  P.gear={staff:null,robe:null,ring:null,amulet:null};return r.join(', ')});
qT('아이템','상점: 장비 사기 · 팔기 · 물약 사기 (화면 버튼)',()=>{qPrep('mage',{lvl:20});P.gold=1e6;const t=TOWNS[0];qOk(qActAt(t.shop.x,t.shop.y)==='shop','상점 앞 act≠shop');doAct();qOk(!panel.hidden&&tab==='shop','상점 창이 안 열림');
  const st=shopStock(t),it=st.items[0],pr=buyPrice(it),g0=P.gold;qClick(`#pbody [data-buy="${it.id}"]`);qOk(P.bag.includes(it)&&P.gold===g0-pr,`구매: 금화 ${g0}→${P.gold} (가격 ${pr})`);
  const sp=itemPrice(it),g1=P.gold;qClick(`#pbody [data-sell="${it.id}"]`);qOk(!P.bag.includes(it)&&P.gold===g1+sp,`판매: 금화 ${g1}→${P.gold} (값 ${sp})`);
  const hp0=potN('hp',POT_DEF),g2=P.gold,pp=potPriceT('hp',POT_DEF);qClick(`#pbody [data-buypot="hp"][data-tier="${POT_DEF}"][data-q="5"]`);qOk(potN('hp',POT_DEF)===hp0+5&&P.pot.hp===hp0+5&&P.gold===g2-pp*5,'물약 구매 틀림');closePanel();return `구매 ${pr}, 판매 ${sp}, 물약 5개 ${pp*5}`});
qT('아이템','물약 등급: 위 등급일수록 회복량·값이 크고, 몬스터 레벨이 높을수록 좋은 등급이 떨어짐',()=>{qPrep('mage',{lvl:40});const out=[];
  for(const k of ['hp','mp'])for(let T=1;T<POT_T.length;T++){qOk(potAmt(k,T)>potAmt(k,T-1),`${k} ${T}등급 회복량 ${potAmt(k,T)} ≤ ${potAmt(k,T-1)}`);qOk(potPriceT(k,T)>potPriceT(k,T-1),`${k} ${T}등급 값`)}
  qOk(potDropTier(2)===0,'레벨 2 몬스터가 작은 물약보다 좋은 것을 떨어뜨림');let hi=0;for(let i=0;i<40;i++)hi=Math.max(hi,potDropTier(60));qOk(hi===POT_T.length-1,'레벨 60에서 최상급이 안 떨어짐');
  return POT_T.map((p,T)=>`${p.n} ${potAmt('hp',T)}/${potPriceT('hp',T)}`).join(', ')});
qT('아이템','물약: 3초에 걸쳐 회복 · 재사용 대기 중 두 번째는 못 마심 · 생명력/마나 대기 따로 · 좋은 등급부터',()=>{qPrep('mage',{lvl:30});P.x=2600;P.y=4300;qClear();P.pot={hp:2,mp:2,ht:[3,0,1,0,0]};P.potCd=0;P.potCdM=0;
  const m=maxHp();P.hp=10;qOk(usePotion('hp')===true,'첫 물약을 못 마심');qOk(potN('hp',2)===0&&potN('hp',POT_DEF)===2,'가장 좋은 등급(큰)을 먼저 마시지 않음');qOk(P.hp<10+potAmt('hp',2)*.5,'바로 다 차 버림 (지속 회복 아님)');
  const n=potTotal('hp');qOk(usePotion('hp')===false&&potTotal('hp')===n,'재사용 대기 중에 또 마셔짐');P.mp=0;qOk(usePotion('mp')===true,'마나 물약은 생명력 대기와 따로여야 함');
  qStep(Math.round(POT_DUR*60)+6,{render:false});qOk(P.hp>=Math.min(m,10+potAmt('hp',2))-1,`3초 뒤 회복량 부족 (${Math.round(P.hp)})`);qOk(usePotion('hp')===false,'9초가 안 지났는데 마셔짐');
  qStep(Math.round((POT_CD.hp-POT_DUR)*60)+6,{render:false});qOk(usePotion('hp')===true,'재사용 대기가 끝났는데 못 마심');return `회복 ${potAmt('hp',2)} / ${POT_DUR}초, 대기 ${POT_CD.hp}·${POT_CD.mp}초`});
qT('아이템','상점: 마을 레벨로 열린 물약 등급만 팖',()=>{qPrep('mage',{lvl:50});P.gold=1e7;const tiers=(reg,id)=>{if(REG.id!==reg)switchRegion(reg,null,null,true);const t=ALLTOWNS.find(x=>x.id===id),s=t.shops.find(x=>x.type==='general');qActAt(s.x,s.y);doAct();
    const r=[...document.querySelectorAll('#pbody [data-buypot="hp"][data-q="1"]')].map(b=>+b.dataset.tier);closePanel();return r};
  const a=tiers('home','brenhill'),b=tiers('ice','frostheim');loadRegion('home');
  qOk(a.join()==='0,1',`브렌힐 ${a}`);qOk(b.join()==='0,1,2,3,4',`프로스트헤임 ${b}`);return `브렌힐 ${a.length}등급, 프로스트헤임 ${b.length}등급`});
qT('저장','옛 저장 pot:{hp:12,mp:7} → 보통 등급 12·7개, 새 등급 칸은 왕복 유지',()=>{qResetStore();const d=JSON.parse(JSON.stringify(QA_FIX.v5));d.pot={hp:12,mp:7};qPut('arseia-char-0',d);
  qOk(load(readSlot(0),0),'load 실패');qOk(potN('hp',POT_DEF)===12&&potN('mp',POT_DEF)===7&&potTotal('hp')===12&&potTotal('mp')===7,`개수 ${JSON.stringify(P.pot)}`);qOk(JSON.stringify(P.pot)==='{"hp":12,"mp":7}','불러올 때 저장 모양이 바뀜');
  potAdd('hp',4,3);potAdd('mp',0,2);saveNow();const raw=JSON.parse(qRaw('arseia-char-0'));qOk(raw.pot.hp===12&&raw.pot.mp===7,'옛 칸(hp/mp)이 보통 등급 개수가 아님');
  qOk(load(readSlot(0),0),'다시 load 실패');qOk(potN('hp',4)===3&&potN('mp',0)===2&&potN('hp',POT_DEF)===12,`왕복 ${JSON.stringify(P.pot)}`);loadRegion('home')});
qT('아이템','가방 40칸이 차면 줍기·사기가 막히고 오류 없음',()=>{qPrep('mage',{lvl:20});P.gold=1e6;P.bag=[];for(let i=0;i<40;i++)P.bag.push(makeItem(10));
  const it=makeItem(12);loot.push({x:P.x,y:P.y,kind:'item',item:it,t:0});qStep(3,{render:false});qOk(P.bag.length===40&&!P.bag.includes(it),'가득 찼는데 주움');qOk(loot.some(l=>l.item===it&&!l.taken),'땅의 장비가 사라짐');
  const t=TOWNS[0];qActAt(t.shop.x,t.shop.y);doAct();const st=shopStock(t),s0=st.items[0],g=P.gold,n=st.items.length;qClick(`#pbody [data-buy="${s0.id}"]`);
  qOk(P.bag.length===40&&P.gold===g&&st.items.length===n,'가득 찼는데 사짐/금화가 빠짐');closePanel();
  qOk([...$('#log').children].some(d=>/가득/.test(d.textContent)),'가득 찼다는 알림 없음');
  // 창고에서 꺼내기도 막힘
  stashWrite([makeItem(9)]);openPanel('stash');const bt=pbody.querySelector('[data-stout="0"]');qOk(bt&&bt.disabled,'창고 꺼내기 버튼이 열려 있음');stashOut(0);qOk(P.bag.length===40&&stashRead().length===1,'창고에서 꺼내짐');closePanel()});
qT('아이템','가방은 40칸: 39칸이면 줍기·사기·꺼내기가 되고 40칸에서 멈춤',()=>{qPrep('mage',{lvl:20});P.gold=1e6;P.bag=[];for(let i=0;i<38;i++)P.bag.push(makeItem(10));
  qOk(BAG_MAX===40,`BAG_MAX ${BAG_MAX}`);const a=makeItem(12);loot.push({x:P.x,y:P.y,kind:'item',item:a,t:0});qStep(3,{render:false});qOk(P.bag.length===39&&P.bag.includes(a),'39번째를 못 주움');
  const t=TOWNS[0];qActAt(t.shop.x,t.shop.y);doAct();const st=shopStock(t),s0=st.items[0];qClick(`#pbody [data-buy="${s0.id}"]`);qOk(P.bag.length===40&&P.bag.includes(s0),'40번째를 못 삼');closePanel();
  P.bag.pop();stashWrite([makeItem(9)]);stashOut(0);qOk(P.bag.length===40&&stashRead().length===0,'창고에서 40번째를 못 꺼냄');
  stashWrite([makeItem(9)]);stashOut(0);qOk(P.bag.length===40&&stashRead().length===1,'41번째가 꺼내짐')});
qT('저장','옛 저장(가방 20칸 꽉 참)은 그대로 불러오고 더 주울 수 있음',()=>{qResetStore();const F=Object.assign({},QA_FIX.v5,{bag:Array.from({length:20},(_,i)=>QA_ITEM(500+i,['staff','robe','ring','amulet'][i%4],i%3,'옛 물건 '+i,10+i,{int:3}))});
  qPut('arseia-char-0',F);const d=readSlot(0);qOk(d&&load(d,0),'load 실패');qOk(P.bag.length===20,`가방 ${P.bag.length}`);qOk(P.bag.every((it,i)=>it.id===500+i&&it.name==='옛 물건 '+i&&it.rar===i%3),'가방 내용·순서가 바뀜');
  if(REG.id!=='home')loadRegion('home');qClear();const it=makeItem(12);loot.push({x:P.x,y:P.y,kind:'item',item:it,t:0});qStep(3,{render:false});qOk(P.bag.length===21&&P.bag.includes(it),'21번째를 못 주움');
  openPanel('char');qOk(pbody.querySelectorAll('.baggrid .bagc').length===40,'가방 칸이 40개가 아님');qOk(pbody.querySelectorAll('.baggrid .bagc img').length===21,'가방 칸 그림 수');closePanel()});
qT('아이템','아이콘: 모든 바탕·유니크·상급 유니크·세트·소모품에 비지 않은 서로 다른 그림',()=>{const ks=allIconKeys(),bad=[],seen=new Map();
  for(const sl in SLOT)qOk(IBASE[sl]&&IBASE[sl].length===SLOT[sl].base.length,`바탕 설계 빠짐: ${sl}`);
  for(const u of UNIQ.concat(BOSSU))qOk(IUNQ[u.n],`유니크 설계 빠짐: ${u.n}`);for(const sid in SETS)for(const sl in SETS[sid].p)qOk(ISET[sid]&&ISET[sid][sl],`세트 설계 빠짐: ${sid}/${sl}`);
  for(const k of ['hp','mp','tp','respec','gold','quest','junk'])qOk(ks.includes('m/'+k),`소모품 ${k}`);
  for(const k of ks){const cv=iconCanvas(k,0),d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let n=0,sig='';
    for(let i=3;i<d.length;i+=4)if(d[i]>40)n++;
    for(let y=4;y<cv.height;y+=12)for(let x=4;x<cv.width;x+=12){const o=(y*cv.width+x)*4;sig+=(d[o]>>5)+''+(d[o+1]>>5)+(d[o+2]>>5)+(d[o+3]>>6)}
    if(n<cv.width*cv.height*.06)bad.push(`${k}:${n}`);if(seen.has(sig))bad.push(`${k}=${seen.get(sig)}`);seen.set(sig,k);
    const bg=iconCanvas(k,1).getContext('2d').getImageData(48,48,1,1).data;if(bg[3]<250)bad.push(k+' 바탕')}
  qOk(!bad.length,`빈/같은 그림: ${bad.slice(0,6).join(', ')}`);
  // 실제로 떨어지는 장비는 모두 설계된 키로
  const set=new Set(ks),miss=[];for(const f of ['uniq','boss','set',null])for(const c of ['mage','priest'])for(let i=0;i<60;i++){const it=makeItem(1+i*1.6,true,c,f),k=itemIconKey(it);if(!set.has(k))miss.push(it.name+'→'+k)}
  qOk(!miss.length,`설계 없는 키: ${miss.slice(0,4).join(', ')}`);qOk(iconUrl('b/staff/0').startsWith('data:image/png'),'data URL');
  return `아이콘 ${ks.length}종`});
qT('아이템','가방·착용·창고·상점 목록에 아이콘과 희귀도 틀',()=>{qPrep('mage',{lvl:30});P.bag=[];for(let i=0;i<40;i++)P.bag.push(makeItem(5+i,i%2===0,'mage',['uniq','set','boss',null][i%4]));P.gear.staff=makeItem(30,true,'mage','boss');P.gear.ring=null;
  openPanel('char');const g=pbody.querySelectorAll('.baggrid .bagc img');qOk(g.length===40,`가방 칸 그림 ${g.length}`);qOk([...g].every(im=>im.src.startsWith('data:image/png')),'빈 그림');
  const rows=pbody.querySelectorAll('.item.hasic .iic img');qOk(rows.length>=44,`목록 아이콘 ${rows.length}`);qOk(pbody.querySelector('.iic.empty'),'빈 착용 칸 그림 없음');
  const fr=pbody.querySelector(`.item[data-iid="${P.bag[1].id}"] .iic`);qOk(fr&&getComputedStyle(fr).borderTopColor.replace(/\s/g,'')===(()=>{const h=Kit.hex(RAR[P.bag[1].rar].c);return`rgb(${h[0]},${h[1]},${h[2]})`})(),'희귀도 틀 색');
  const gr=pbody.querySelector('.baggrid').getBoundingClientRect(),pr=pbody.getBoundingClientRect();qOk(gr.right<=pr.right+1&&gr.left>=pr.left-1,'가방 칸이 창 밖으로 넘침');
  qClick(`#pbody [data-bagcell="${P.bag[30].id}"]`);closePanel();
  QA.store.setItem('arseia-stash',JSON.stringify({v:1,items:[]}));stashWrite([makeItem(9)]);openPanel('stash');qOk(pbody.querySelectorAll('.item.hasic .iic img').length===41,'창고 아이콘');closePanel();
  P.bag=[];const t=TOWNS[0];qActAt(t.shop.x,t.shop.y);doAct();qOk(pbody.querySelectorAll('.item.hasic .iic img').length>=1,'상점 아이콘');closePanel();
  P.bag=[];loot.push({x:P.x+30,y:P.y,kind:'item',item:makeItem(20,true,'mage','uniq'),t:1});qStep(2,{render:true})});
qT('아이템','창고 골드 (v18): 예전 창고는 0, 맡기기·찾기, 넘치게 못 씀, 장비 보존, 사라지거나 두 배 안 됨',()=>{qPrep('mage',{lvl:20});const it=makeItem(15);
  QA.store.setItem('arseia-stash',JSON.stringify({v:1,items:[it]}));qOk(stashGold()===0,'예전 창고 골드 '+stashGold());
  P.gold=250;qOk(stashGoldMove(1,100),'맡기기 실패');qOk(P.gold===150&&stashGold()===100,`맡긴 뒤 ${P.gold}/${stashGold()}`);qOk(stashRead().length===1,'장비가 사라짐');
  stashGoldMove(1,9999);qOk(P.gold===0&&stashGold()===250,`가진 것보다 많이 맡김 ${P.gold}/${stashGold()}`);qOk(!stashGoldMove(1,5),'0골드인데 맡겨짐');
  stashGoldMove(-1,40);qOk(P.gold===40&&stashGold()===210,`찾기 ${P.gold}/${stashGold()}`);stashGoldMove(-1,'all');qOk(P.gold===250&&stashGold()===0,`모두 찾기 ${P.gold}/${stashGold()}`);
  stashGoldMove(1,'all');const d=JSON.parse(QA.store.getItem(SLOTKEY(curSlot))||'{}');qOk((d.gold|0)===0,'캐릭터 저장에 골드가 남음 '+d.gold);
  qOk(P.gold+stashGold()===250,'합계가 바뀜');stashGoldMove(-1,'all');
  openPanel('stash');const bin=pbody.querySelector('[data-stgin="1"]');qOk(bin,'맡기기 버튼 없음');pbody.querySelector('#stgAmt').value='30';bin.click();qOk(P.gold===220&&stashGold()===30,`버튼 맡기기 ${P.gold}/${stashGold()}`);closePanel();
  QA.store.setItem('arseia-stash',JSON.stringify({v:1,items:[],gold:'abc'}));qOk(stashGold()===0,'잘못된 골드 값');
  return `250 = 가방 ${P.gold} + 창고 ${stashGold()}`});
qT('아이템','창고: 넣기·꺼내기 (화면 버튼)',()=>{qPrep('mage',{lvl:20});QA.store.setItem('arseia-stash',JSON.stringify({v:1,items:[]}));const it=makeItem(15);P.bag=[it];
  const t=TOWNS[0];qOk(qActAt(t.stash.x,t.stash.y)==='stash','창고 앞 act≠stash');doAct();qClick(`#pbody [data-stin="${it.id}"]`);qOk(!P.bag.length&&stashRead().length===1,'창고에 안 들어감');
  qClick('#pbody [data-stout="0"]');qOk(P.bag.length===1&&P.bag[0].name===it.name&&!stashRead().length,'꺼내기 실패');closePanel()});

/* ===== 9. 성장 ===== */
qT('성장','경험치로 레벨업: 스킬 1점·능력치 5점',()=>{qPrep('mage',{lvl:1});P.sp=0;P.ap=0;gainXp(xpNeed(1));qOk(P.lvl===2&&P.sp===1&&P.ap===5,`Lv${P.lvl} sp${P.sp} ap${P.ap}`)});
qT('성장','최고 레벨 140 (v19: 100 · v20: 3차 전직 140, 100 위로 레벨마다 스킬 포인트 2점)',()=>{qPrep('mage',{lvl:1});P.sp=0;P.ap=0;gainXp(1e13);qOk(P.lvl===MAXLV&&MAXLV===140,`Lv${P.lvl}`);qOk(P.xp===0,'최고 레벨 경험치가 0이 아님');qOk(P.sp===99+40*2&&P.ap===139*5,`sp${P.sp} ap${P.ap}`);
  gainXp(1e6);qOk(P.lvl===140&&P.xp===0,'140에서 더 오름');qOk(xpNeed(139)>0,'xpNeed')});
qT('성장','몬스터를 잡으면 경험치',()=>{qPrep('mage',{lvl:5});const x=P.xp,l=P.lvl;const e=dgMob('wolf',P.x+50,P.y,5);hurtE(e,e.hp+5);qOk(P.xp>x||P.lvl>l,'경험치 그대로')});
qT('성장','난이도: 레벨 25에 악몽, 45에 지옥 (짝문 창)',()=>{qPrep('mage',{lvl:24});const t=TOWNS[0],gate=()=>{qClosePanels();qActAt(t.gate.x+20,t.gate.y+20);doAct();qOk(tab==='gate','짝문 창 아님')};
  gate();qOk(pbody.querySelector('[data-diff="1"]').disabled&&pbody.querySelector('[data-diff="2"]').disabled,'레벨 24에 악몽/지옥이 열림');
  P.lvl=25;renderPanel();qClick('#pbody [data-diff="1"]');qOk(P.diff===1,'악몽으로 안 바뀜');qOk(pbody.querySelector('[data-diff="2"]').disabled,'레벨 25에 지옥이 열림');
  closePanel();P.x=QA_SPOT.x;P.y=QA_SPOT.y;enemies=[];spawnEnemy();const zl=zoneLevel(enemies[0].x,enemies[0].y);qOk(enemies[0].lvl>=zl+19,`악몽 몬스터 레벨 ${enemies[0].lvl} (구역 ${zl})`);
  P.lvl=45;gate();qClick('#pbody [data-diff="2"]');qOk(P.diff===2,'지옥으로 안 바뀜');closePanel();
  const c=CAVES[0];P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.lvl===c.cave.lvl+40,`지옥 던전 레벨 ${DG&&DG.lvl}`);leaveDungeon();
  gate();qClick('#pbody [data-diff="0"]');qOk(P.diff===0,'보통으로 안 돌아옴');closePanel();return `악몽 몬스터 Lv${zl+20}±, 지옥 던전 Lv${c.cave.lvl+40}`});

// v17: 경험치 곡선 — 예전(40·L^1.45)보다 낮은 레벨 4배, 30레벨 2배, 그 위로도 2배. 레벨마다 필요한 양은 늘 늘어난다
qT('성장','경험치 곡선 (v17·v19): 2~5레벨 약 4배, 30레벨 2배, 50레벨 3.5배(100레벨까지 3.66배), 계속 늘어남, 30에서 매끄럽게 이어짐',()=>{const old=l=>40*Math.pow(l,1.45),r=l=>xpNeedV20(l)/old(l);// v21: 기본 곡선 모양(늘린 배수 xpSlow21은 「경험치 v21」에서)
  for(const l of [2,3,4,5])qOk(r(l)>=3.8&&r(l)<=4.05,`Lv${l} 비율 ${qR(r(l))}`);qOk(Math.abs(r(30)-2)<.02,`Lv30 비율 ${qR(r(30))}`);qOk(r(40)>=1.98&&r(59)>=1.98,'30 위에서 2배보다 줄어듦');qOk(r(45)>=2.8&&r(50)>=3.3&&r(59)>=3.45,`고레벨도 느리게: Lv45 ×${qR(r(45))} · Lv50 ×${qR(r(50))} · Lv59 ×${qR(r(59))}`);// v19: 50 위는 3.48→3.66 (100레벨)
  for(let l=1;l<MAXLV;l++){qOk(xpNeed(l+1)>xpNeed(l),`Lv${l}→${l+1} 필요 경험치가 줄어듦 ${xpNeed(l)}→${xpNeed(l+1)}`);if(l>1&&l<30)qOk(r(l)<=r(l-1)+1e-9,`Lv${l} 배율이 다시 커짐`)}
  const g1=xpNeedV20(30)/xpNeedV20(29),g2=xpNeedV20(31)/xpNeedV20(30);qOk(Math.abs(g1-g2)<.02,`30 앞뒤 증가율 ${qR(g1)} / ${qR(g2)}`);
  return [1,5,10,20,30,40,50,59].map(l=>`Lv${l} ${xpNeed(l)}(×${qR(r(l))})`).join(' · ')});
// v17: 피해 강화 상한 — 사제 +60%, 마법사 +80%. 피해를 크게 올리는 강화는 짧은 강화(burst), 패시브의 피해 증가는 천천히
qT('강화','피해 강화 상한 (v17): 사제 강화·패시브를 모두 20레벨로 걸어도 +60%, 마법사 +80%',()=>{qPrep('priest',{lvl:60});const r=[];
  const dbuf=qSpells('priest',s=>s.kind==='buff'&&s.dmg>0);for(const s of qSpells('priest',s=>s.kind==='passive'||(s.kind==='buff'&&s.dmg>0)))P.sk[s.id]=20;
  for(const s of dbuf){const e=eff(s.id,20);if(e.dmg>=.15)qOk(s.burst&&e.dur<=30,`${s.n}: 피해 ${qR(e.dmg)}인데 짧은 강화가 아님 (지속 ${e.dur}초)`);else qOk(e.dmg<=.1,`${s.n}: 오래 가는 강화의 피해 ${qR(e.dmg)}`);qOk(qCast(s.id),`${s.n} 시전 안 됨`)}
  for(const s of qSpells('priest',s=>s.kind==='passive'&&s.pv&&s.pv.dmg))qOk(eff(s.id,20).dmg<=.12,`${s.n} 20레벨 패시브 피해 ${qR(eff(s.id,20).dmg)}`);
  qOk(buffSum('dmg')>.6,`강화 합 ${qR(buffSum('dmg'))} — 상한을 못 넘어 점검이 안 됨`);qOk(Math.abs(dmgMul()-1.6)<1e-9,`사제 피해 배율 ${qR(dmgMul())} (상한 1.6)`);r.push(`사제 합 +${Math.round(buffSum('dmg')*100)}% → ×${qR(dmgMul())}`);
  qPrep('mage',{lvl:60});for(const id of ['warmth','windreading','heartoffire'])if(SPELLS[id])P.sk[id]=20;for(const id of ['warmth','windreading'])qOk(eff(id,20).dmg<=.12,`${id} 20레벨 패시브 피해 ${qR(eff(id,20).dmg)}`);
  if(SPELLS.heartoffire)qOk(qCast('heartoffire'),'불의 심장 시전 안 됨');else for(const id of ['warmth','windreading'])P.sk[id]=20;/* v20: 불의 심장은 불의 갑옷에 합쳐짐 — 패시브만으로 배율 확인 */qOk(dmgMul()<=1.8+1e-9&&(SPELLS.heartoffire?dmgMul()>1:dmgMul()>=1),`마법사 피해 배율 ${qR(dmgMul())}`);r.push(`마법사 ×${qR(dmgMul())}`);qClear();return r.join(' · ')});

// v17: 흡수 보호막은 겹치지 않는다 (가장 큰 것 하나만), 내가 보호막을 걸면 다른 보호막은 잠깐 잠김, 은총 1/2/3단계 보호막은 재사용 대기가 뚜렷이 다름
qT('강화','보호막 겹치지 않음 (v17): 빛의 막·키리에·신성 방패를 다 걸어도 흡수량 = 가장 큰 하나',()=>{qPrep('priest',{lvl:60});const ids=['lightward','kyrie','divineshield'];for(const id of ids)P.sk[id]=10;
  const one={};for(const id of ids){qClear();qOk(qCast(id),`${id} 시전 안 됨`);one[id]=P.shield}const mx=Math.max(...ids.map(id=>one[id])),sum=ids.reduce((a,id)=>a+one[id],0);
  for(const order of [ids,ids.slice().reverse()]){qClear();for(const id of order)qCast(id);qOk(P.shield===mx,`${order.join('→')}: 흡수 ${P.shield} (가장 큰 하나 ${mx}, 합 ${sum})`)}
  qClear();qCast('divineshield');supFx(eff('kyrie',10),'kyrie',power(),{name:'동료'});qOk(P.shield===one.divineshield,`동료의 작은 막이 큰 막을 덮어씀 ${P.shield}`);
  qClear();qCast('lightward');supFx(eff('aegis',10),'aegis',power()*3,{name:'동료'});qOk(P.shield>one.lightward,'동료의 더 큰 막이 안 걸림');
  qClear();P.mp=maxMp();tryCast('lightward');qOk(P.cd.divineshield>=SHIELD_LOCK-1e-9&&P.cd.kyrie>=SHIELD_LOCK-1e-9,`잠김 없음 cd ${qR(P.cd.divineshield||0)}`);const sh=P.shield;tryCast('divineshield');qOk(P.shield===sh,'잠긴 보호막이 걸림');
  const cd=ids.map(id=>SPELLS[id].cd);qOk(cd[0]<cd[1]&&cd[1]<cd[2]&&cd[2]>=3*cd[0],`재사용 대기 ${cd.join('/')}`);qClear();
  return `하나씩 ${ids.map(id=>one[id]).join('/')} → 함께 ${mx} (합이면 ${sum}) · 재사용 ${cd.join('/')}초 · 잠김 ${SHIELD_LOCK}초`});
qT('강화','치유·수호 계열 (v17): 같은 종류 마법끼리 역할(role)이 다름 — 위아래로 크기만 다른 마법 없음',()=>{const r=[];
  for(const t of [2,3]){const L=qSpells('priest',s=>TREE[s.id]===t&&s.kind!=='passive');for(const s of L)qOk(s.role,`${s.id}: role 없음`);
    for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const a=L[i],b=L[j];qOk(a.kind!==b.kind||a.role!==b.role,`${a.id}·${b.id}: 같은 종류(${a.kind})·같은 역할(${a.role})`)}r.push(`${CLASSES.priest.trees[t]} ${L.length}개`)}
  return r.join(' · ')});
qT('강화','치유·수호 새 역할 효과 (v17): 빈사 치유·6번 깨지는 막·되돌림·버팀·치유 증가·마나 회복·투사체 막기',()=>{qPrep('priest',{lvl:60});const r=[];
  for(const id of ['closewounds','kyrie','aegis','guardianspirit','renew','barrier','wisdom'])P.sk[id]=10;// v19: 서약·은총 → 수호 천사, 머무는 치유 → 리뉴, 세이프티 월 → 방벽, 찬가(2차로) → 지혜의 축복 마나
  qClear();P.hp=Math.round(maxHp()*.9);let h=P.hp;qCast('closewounds');const hiG=P.hp-h;qClear();P.hp=Math.round(maxHp()*.1);h=P.hp;qCast('closewounds');const loG=P.hp-h;qOk(loG>hiG*1.5||P.hp===maxHp(),`빈사 치유 ${loG} vs ${hiG}`);r.push(`봉합 ${hiG}→${loG}`);
  qClear();qCast('kyrie');for(let i=0;i<6;i++)hitPlayer(1);qOk(P.shield===0,`키리에 6번 맞고도 ${P.shield}`);
  qClear();qCast('aegis');const e=qDummy(P.x+30,P.y);hitPlayer(100,e);qOk(e.taken>0,'아이기스 되돌림 없음');r.push(`되돌림 ${Math.round(e.taken)}`);
  qClear();qCast('guardianspirit');P.hp=10;hitPlayer(1e6);qOk(!P.dead&&P.hp>1,`수호 천사가 쓰러질 일격을 못 막음 hp ${P.hp}`);
  qClear();qCast('guardianspirit');P.hp=1;healP(100);qOk(P.hp>=140,`수호 천사 치유 증가 ${P.hp}`);
  qClear();P.mp=0;qCast('renew');P.mp=0;qStep(60,{render:false});qOk(P.mp>regen()*1.2,`리뉴 마나 ${qR(P.mp)}`);
  qClear();qCast('barrier',{x:P.x,y:P.y});projs.push({x:P.x+30,y:P.y,z:18,vx:-50,vy:0,r:6,dmg:50,owner:'e',life:2,col:'#f00'});const hp0=P.hp;qStep(30,{render:false});qOk(P.hp>=hp0&&!projs.some(p=>p.owner==='e'),`방벽이 투사체를 못 막음 ${hp0}→${P.hp}`);
  qClear();P.mp=0;qStep(31,{render:false});const m1=P.mp;qClear();qCast('wisdom');P.mp=0;qStep(31,{render:false});qOk(P.buffs.wisdom&&P.mp-m1>=1,`지혜의 축복 마나 ${qR(P.mp)} (없을 때 ${qR(m1)})`);qClear();return r.join(' · ')});
qT('스킬 트리','스킬 레벨 피해 (v17): 1→20 꾸준히 조금씩, 시너지 가득해도 20레벨/1레벨 ×3~4, 장비로 20을 넘긴 레벨은 덜 오름',()=>{qPrep('mage',{lvl:60});TYPES.qa_dummy=TYPES.qa_dummy||Object.assign({},TYPES.ogre,{spd:0,dmg:0,aggro:0,atk:1e9});
  const id='flameshaping';for(const s of qSpells('mage',s=>TREE[s.id]===TREE[id]&&s.id!==id))P.sk[s.id]=20;qOk(synBonus(id)===SYN_CAP,`시너지 ${synBonus(id)}`);
  const hit=L=>{P.sk[id]=L;qClear();const e=qDummy(P.x+30,P.y);QA.reseed(4242);qCast(id,e);return e.taken};
  const base=(()=>{const keep={...P.sk};for(const k in P.sk)if(k!==id)delete P.sk[k];const v=dmgScale(id,1);P.sk=keep;return v})();
  const d=[];for(let L=1;L<=20;L++)d.push(dmgScale(id,L));
  for(let i=1;i<20;i++){qOk(d[i]>d[i-1],`L${i}→${i+1} 줄어듦`);qOk(d[i]-d[i-1]<=.12*base+1e-9,`L${i}→${i+1} 한 점에 +${qR((d[i]-d[i-1])/base*100)}% (L1 기준)`)}
  const tot=d[19]/base;qOk(tot>=3&&tot<=4,`20레벨+시너지 / 1레벨 = ×${qR(tot)}`);
  const up20=dmgScale(id,21)-dmgScale(id,20);qOk(up20>0&&up20<d[19]-d[18],`20 넘는 레벨 +${qR(up20)}`);
  const h1=hit(1),h20=hit(20);qOk(h1>0&&h20/h1>2&&h20/h1<3,`실제 피해 L1 ${h1} → L20 ${h20} (×${qR(h20/h1)}, 시너지 가득)`);
  for(const b of ['impositio','benediction','kings','gloria'])qOk(eff(b,20).dmg<=(SPELLS[b].dmg||0)*1.4+1e-9&&eff(b,20).crit<=(SPELLS[b].crit||0)*1.4+1e-9,`${b} 20레벨 강화가 너무 커짐`);
  qClear();return `배율 L1 ${qR(base)} · L1+시너지 ${qR(d[0])} · L10 ${qR(d[9])} · L20 ${qR(d[19])} (×${qR(tot)}) · L21 +${qR(up20)}`});
qT('강화','큰 효과 마법은 재사용 대기가 김 (v17), 작은 기본 마법은 짧음',()=>{const big=[];
  const need=s=>s.kind==='invuln'||s.kind==='ward'||s.kind==='rez'||(s.kind==='armor'&&s.burst)||(s.kind==='heal'&&(s.pct>=.5||s.resetcd))?60:(s.kind==='buff'&&s.burst)||(s.kind==='summon'&&s.form!=='hydra')||(s.kind==='field'&&s.drf>=.3&&s.rad>=120)||(s.kind==='nova'&&s.freeze>=3)?45:
    (s.kind==='shield'&&s.mult>=4)?40:s.kind==='storm'?30:(['field','rain'].includes(s.kind)&&s.rank>=9&&s.dur>=6)?25:0;
  // v18: 전사·궁수는 설계(v18-classes.js)의 재사용 대기를 따른다 — 짧은 방어·속도 강화(burst)는 16~45초, 피해·치명타를 올리는 강화만 60초 이상
  const ph=s=>typeof PHYS_CLS==='object'&&PHYS_CLS[s.cls],needP=s=>s.kind==='buff'&&s.burst&&(s.dmg>0||s.crit>0||s.markDmg>0)?60:(s.kind==='ward'||s.floor)?120:0;
  for(const s of Object.values(SPELLS)){if(s.job2)continue;const n=ph(s)?needP(s):need(s);if(!n)continue;big.push(s.id);qOk(s.cd>=n,`${s.cls} ${s.id}(${s.kind}): 재사용 ${s.cd}초 < ${n}초`)}
  qOk(SPELLS.minorheal.cd<=5&&SPELLS.lightward.cd<=10&&SPELLS.smite.cd<1&&SPELLS.spark.cd<1,'기본 마법의 재사용 대기가 김');return `큰 효과 ${big.length}개 점검`});

/* ===== 10. 저장 ===== */
const qStore=()=>QA.store._m;
const qPut=(k,v)=>localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));
const qRaw=k=>localStorage.getItem(k);
function qResetStore(){qStore().clear()}
// v17: 속죄 계열이 없어지기 전의 사제 저장 — 없어진 마법의 점수는 돌려받고, 단축칸에서 빠지고, 장비 옵션(tr_5, sk_penance)은 옮겨짐
const QA_ATONE={v:5,slot:0,cls:'priest',lvl:35,xp:9000,gold:100,towns:['brenhill'],home:'brenhill',x:1500,y:3900,reg:'home',hp:300,mp:100,pot:{hp:1,mp:1},
  gear:{staff:QA_ITEM(71,'staff',2,'참회의 지팡이',34,{int:30,tr_5:2,sk_penance:2,sk_halo:1},{cls:'priest'}),robe:null,ring:null,amulet:null},bag:[QA_ITEM(72,'ring',1,'속죄의 반지',30,{mp:40,tr_5:1},{cls:'priest'})],
  sk:{holyspark:5,smite:6,holyfire:3,penance:4,holynova:2,divinestar:3,halo:1,grandcross:2,apotheosis:1,blessing:3},sp:1,st:{int:40,vit:30,spi:30},ap:0,diff:0,
  bar:['smite','penance','halo','holynova','divinestar','apotheosis'].concat(Array(15).fill(null)),uid:70,q:{i:0,st:0,c:{}}};
qT('저장','옛 사제 저장(v16, 속죄 계열 점수): 없어진 마법 점수 돌려받기 · 단축칸 정리 · 레벨 유지',()=>{qResetStore();qPut('arseia-char-2',QA_ATONE);const d=readSlot(2);qOk(d,'readSlot 실패(저장을 거부함)');qOk(load(d,2),'load 실패');const F=QA_ATONE;
  const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
  qOk(P.cls==='priest'&&P.lvl===35,`레벨 ${P.lvl}`);qOk(P.xp>=0&&P.xp<xpNeed(P.lvl),`경험치 ${P.xp} / ${xpNeed(P.lvl)}`);
  for(const k of ['penance','holynova','divinestar','halo'])qOk(!SPELLS[k]&&!P.sk[k],`${k}가 남음`);
  qOk(P.sk.smite===11&&P.sk.holyfire===3&&P.sk.grandcross===2&&P.sk.apotheosis===1&&!P.sk.holyspark&&P.skOld.holyspark===5&&P.sk.blessing===3,`남은 스킬 ${JSON.stringify(P.sk)} (v19: 홀리 스파크 5 → 스마이트)`);
  qOk(P.sp===F.sp+10,`돌려받은 점수: sp ${P.sp} (기대 ${F.sp+10})`);qOk(sum(P.sk)+P.sp===sum(F.sk)+F.sp,'전체 스킬 포인트가 줄거나 늘어남');
  qOk(TREE.smite===0&&TREE.grandcross===0&&TREE.apotheosis===0&&CLASSES.priest.trees.length===5,'옮긴 마법이 심판 계열이 아님');
  qOk(P.bar[0]==='smite'&&P.bar.slice(1,5).every(x=>x===null)&&P.bar[5]==='apotheosis',`단축칸 ${P.bar.slice(0,6)}`);
  const st=P.gear.staff.stats;qOk(st.tr_0===2&&!('tr_5' in st)&&st.sk_smite===2&&st.sk_greatjudgment===1&&!st.sk_penance&&st.int===30,`지팡이 옵션 ${JSON.stringify(st)}`);
  qOk(P.bag[0]&&P.bag[0].stats.tr_0===1&&!('tr_5' in P.bag[0].stats),'가방 장비 tr_5');qOk(statLine(P.gear.staff).indexOf('undefined')<0,'옵션 이름에 undefined');
  saveNow();const d2=readSlot(2);qOk(d2&&!d2.sk.penance&&d2.sp===P.sp,'다시 저장한 값');qOk(load(d2,2)&&P.sp===F.sp+10,`다시 불러올 때 또 돌려받음 sp ${P.sp}`);
  openPanel('tree');for(let t=0;t<CLASSES.priest.trees.length;t++){treeSel=t;nodeSel=null;renderPanel()}closePanel();qStep(10);return `돌려받은 점수 10 → sp ${P.sp}`});
qT('저장','사제 스킬 트리 (v17·v19): 모든 마법이 있는 계열에 속하고, 심판은 1~8단계마다 1개 이상 (v19 합치기 뒤 · 상위 기술 빼고)',()=>{const T=CLASSES.priest.trees.length,r=[];
  for(const s of qSpells('priest',s=>!s.job2&&!s.job3))qOk(TREE[s.id]>=0&&TREE[s.id]<T,`${s.id}: 계열 ${TREE[s.id]}`);// v19: 2차 스킬(job2)은 따로 'j_' 나무
  for(let k=1;k<=RANK_LV.length;k++){const n=qSpells('priest',s=>TREE[s.id]===0&&s.rank===k&&!s.tab).length;qOk(n>=1,`심판 ${k}단계 ${n}개`);r.push(n)}
  for(const id in PRE)for(const p of PRE[id])qOk(TREE[p]===TREE[id],`선행 ${p}>${id} 계열이 다름`);return `심판 단계별 ${r.join('/')}`});
qT('저장','옛 키(v1) → 1번 칸으로 옮김, 원본은 남김 (시작할 때)',()=>{qOk(qaMigr,'시작 시 상태를 못 잡음');qOk(qaMigr.slot0===JSON.stringify(QA_FIX.v1old),'arseia-char-0에 옛 저장이 안 옮겨짐');qOk(qaMigr.old===JSON.stringify(QA_FIX.v1old),'옛 키 원본이 바뀌거나 지워짐')});
qT('저장','옛 저장(v3·옛 키) 불러오기: 포인트를 레벨만큼 돌려받음',()=>{qResetStore();qPut('arseia-char-0',QA_FIX.v1old);const d=readSlot(0);qOk(d,'readSlot 실패');qOk(load(d,0),'load 실패');const F=QA_FIX.v1old;
  qOk(P.cls==='mage'&&P.lvl===12&&P.gold===1234,'기본 값');qOk(P.sp===11&&P.ap===55,`sp ${P.sp} ap ${P.ap}`);qOk(P.xp===xpNeed(12)-1,`xp ${P.xp} (상한 ${xpNeed(12)-1})`);
  qOk(P.gear.staff&&P.gear.staff.name===F.gear.staff.name&&P.gear.ring.stats.mp===35,'장비');qOk(P.bag.length===1,'가방');/* v26: 윌로벤 → 헤이븐 나루 */qOk(P.towns.join()==='brenhill,haven'&&P.home==='haven','마을 '+P.towns+' / '+P.home);qOk(REG.id==='home','지역');
  qOk(P.q&&P.q.i===0,'의뢰 기본값');qStep(10)});
qT('저장','v2 저장 불러오기',()=>{qResetStore();qPut('arseia-char-4',QA_FIX.v2);const d=readSlot(4);qOk(d,'readSlot 실패');qOk(load(d,4),'load 실패');qOk(P.cls==='priest'&&P.lvl===7&&P.sp===6&&P.ap===30&&curSlot===4,`cls ${P.cls} lvl ${P.lvl} sp ${P.sp}`);qStep(10)});
qT('저장','v4 저장 불러오기 (스킬·능력치·난이도·단축칸)',()=>{qResetStore();qPut('arseia-char-1',QA_FIX.v4);const d=readSlot(1);qOk(d&&load(d,1),'load 실패');const F=QA_FIX.v4;
  qOk(P.lvl===30&&P.xp===Math.floor(2000*xpNeed(30)/xpNeedV20(30))&&P.gold===5000&&P.sp===4&&P.ap===3,`수치 xp${P.xp}`);// v21: 경험치 막대 비율을 그대로 새 곡선으로qOk(P.sk.smite===8&&!P.sk.holyspark&&!P.sk.lightarrow&&P.skOld.holyspark===5&&P.skOld.lightarrow===3&&P.sk.blessing===2,`스킬 ${JSON.stringify(P.sk)} (v19: 홀리 스파크·빛의 화살 → 스마이트)`);qOk(P.st.int===50&&P.st.vit===40,'능력치');qOk(P.diff===1,`난이도 ${P.diff}`);
  qOk(P.bar[0]==='smite'&&P.bar[1]===null&&P.bar[4]==='blessing'&&P.bar[2]===null,`단축칸 ${P.bar.slice(0,5)}`);qOk(P.gear.robe.set==='saint'&&P.bag[0].rar===4,'장비');qOk(REG.id==='home'&&P.home==='haven','지역');qOk(P.q.i===0,'의뢰');
  qOk(barEl.querySelector('[data-slot="0"] .ab').textContent.length>0,'단축칸 표시');qStep(10)});
qT('저장','레벨이 모자란 난이도(레벨 30에 지옥)는 보통으로',()=>{qResetStore();qPut('arseia-char-1',Object.assign({},QA_FIX.v4,{diff:2}));qOk(load(readSlot(1),1),'load 실패');qOk(P.diff===0,`난이도 ${P.diff}`)});
qT('저장','v5 저장 불러오기 (지역·의뢰·위치)',()=>{qResetStore();qPut('arseia-char-0',QA_FIX.v5);const d=readSlot(0);qOk(d&&load(d,0),'load 실패');
  qOk(REG.id==='desert'&&TOWNS[0].reg==='desert',`지역 ${REG.id}`);qOk(P.x===3000&&P.y===900,'위치');qOk(P.q.i===4&&P.q.st===1&&P.q.c[0]===3,'의뢰');qOk(P.sk.warmth===4&&P.bar.indexOf('warmth')<0,'패시브');
  qOk(P.gear.staff.rar===5&&P.gear.ring.set==='valker','장비');/* v26: 윌로벤은 헤이븐으로 합쳐짐(6 → 5) */qOk(P.towns.length===5&&P.towns.includes('haven')&&!P.towns.includes('willowen'),`마을 ${P.towns}`);qOk(uid>=60,'uid');qStep(20,{renderEvery:10});loadRegion('home')});
qT('저장','손상된 값 정리 (레벨 99, 없는 지역/마을/칸, 다른 직업 스킬, 가방 45칸 → 40 …)',()=>{qResetStore();qPut('arseia-char-3',QA_FIX.v5dirty);const d=readSlot(3);qOk(d&&load(d,3),'load 실패');const r=[];
  qOk(P.lvl===Math.min(99,MAXLV),`레벨 ${P.lvl}`);qOk(REG.id==='home','없는 지역 → 고향');qOk(P.towns.join()==='brenhill','없는 마을 걸러짐');qOk(P.x===20&&P.y===WORLD-20,`위치 ${P.x},${P.y}`);
  qOk(P.gear.staff&&P.gear.staff.rar===4,'세트 표시 없는 rar3 → 4');qOk(P.gear.robe&&P.gear.robe.rar===5,'rar9 → 5');qOk(P.gear.ring===null&&P.gear.amulet===null,'잘못된 장비 걸러짐');
  qOk(P.bag.length===40&&P.bag[0].id===100&&P.bag[39].id===139,`가방 ${P.bag.length}`);qOk(P.sk.spark===MAXSK&&!P.sk.holyspark&&!P.sk.nosuch,`스킬 ${JSON.stringify(P.sk)}`);qOk(P.diff===0,`없는 난이도(5) → ${P.diff}`);
  qOk(P.bar[0]==='spark'&&P.bar[1]===null&&P.bar[2]===null&&P.bar[3]===null,`단축칸 ${P.bar.slice(0,4)}`);qOk(P.q.i===QUESTS.length&&P.q.st===2,`의뢰 ${JSON.stringify(P.q)}`);
  qOk(P.hp>0&&qNum(P.gold),'생명력/금화');qStep(10);return `금화 '${QA_FIX.v5dirty.gold}'→${P.gold}`});
qT('저장','미래 버전(v6) 저장은 읽지 않음 (오류 없음)',()=>{qResetStore();qPut('arseia-char-2',QA_FIX.v6future);qOk(readSlot(2)===null,'v6가 읽힘');introButtons(false);qOk(!$('#introBody [data-play="2"]'),'v6 카드가 보임')});
qT('저장','구글 계정 칸(arseia-g-<uid>-char-N) 불러오기',()=>{qResetStore();qPut('arseia-g-qauid-char-2',QA_FIX.v4);qPut('arseia-char-2',QA_FIX.v2);const keep=ACC;
  try{ACC={uid:'qauid',name:'QA',email:''};qOk(SLOTKEY(2)==='arseia-g-qauid-char-2','SLOTKEY');const d=readSlot(2);qOk(d&&d.lvl===30,'계정 칸이 안 읽힘');qOk(load(d,2),'load 실패');qOk(P.lvl===30,'레벨')}
  finally{ACC=keep}qOk(readSlot(2).lvl===7,'로그인 전 칸이 바뀜')});
qT('저장','창고 견본 읽기 (잘못된 장비 걸러짐)',()=>{qResetStore();qPut('arseia-stash',QA_FIX.stash);const st=stashRead();qOk(st.length===2,`창고 ${st.length}`);qOk(st[1].rar===4,'세트 표시 없는 rar3 → 4')});
qT('저장','저장 → 불러오기 왕복: 값이 같음',()=>{qResetStore();qPrep('priest',{lvl:47,slot:5});P.xp=1234;P.gold=424242;P.sp=7;P.ap=12;P.st={int:99,vit:55,spi:44};P.diff=1;P.pot={hp:11,mp:13};
  P.sk={smite:9,turnundead:4,minorheal:6,faith:3,blessing:2};P.bar=Array(21).fill(null);P.bar[0]='smite';P.bar[1]='minorheal';P.bar[20]='blessing';
  {const a=makeItem(40,true,null,'boss'),b=makeItem(40,true,null,'set');P.gear[b.slot]=b;P.gear[a.slot]=a}P.bag=[makeItem(30),makeItem(31,true,null,'uniq')];
  P.towns=['brenhill','haven','arden','goldmere'];P.q={i:5,st:1,c:{0:2,1:1}};switchRegion('plains',2500,2600,true);P.home='goldmere';P.hp=Math.min(maxHp(),777);P.mp=123;
  const keyF=()=>JSON.stringify({lvl:P.lvl,xp:P.xp,gold:P.gold,sp:P.sp,ap:P.ap,st:P.st,diff:P.diff,pot:P.pot,sk:P.sk,bar:P.bar,gear:P.gear,bag:P.bag,towns:P.towns,home:P.home,q:P.q,reg:REG.id,x:Math.round(P.x),y:Math.round(P.y),cls:P.cls,hp:Math.round(P.hp),mp:Math.round(P.mp)});
  const before=keyF();saveNow();const raw=qRaw(SLOTKEY(5));qOk(raw,'저장 안 됨');
  qPrep('mage',{slot:6});loadRegion('home');qOk(load(readSlot(5),5),'load 실패');const after=keyF();
  if(before!==after){const A=JSON.parse(before),B=JSON.parse(after),df=Object.keys(A).filter(k=>JSON.stringify(A[k])!==JSON.stringify(B[k]));throw new QAFail('다름: '+df.map(k=>`${k} ${JSON.stringify(A[k]).slice(0,60)} → ${JSON.stringify(B[k]).slice(0,60)}`).join('; '))}
  qOk(curSlot===5,'칸');loadRegion('home');return `${raw.length}바이트`});
qT('저장','깨진 JSON 칸이 섞여도 다른 칸은 멀쩡함',()=>{qResetStore();qPut('arseia-char-0',QA_FIX.v4);qPut('arseia-char-1','{"v":5,"cls":"mage",lvl:');qPut('arseia-char-2',QA_FIX.v5);qPut('arseia-char-3',QA_FIX.v6future);
  const raw={};for(let i=0;i<8;i++)raw[i]=qRaw('arseia-char-'+i);introButtons(false);const cards=[...document.querySelectorAll('#introBody [data-play]')].map(b=>+b.dataset.play);
  qOk(cards.join()==='0,2',`카드 ${cards}`);qClick('#introBody [data-play="2"]');qOk(P.lvl===41&&curSlot===2,'2번 칸 불러오기 실패');saveNow();qStep(5);saveNow();
  for(const i of [0,1,3])qOk(qRaw('arseia-char-'+i)===raw[i],`${i}번 칸이 바뀜`);qOk(JSON.parse(qRaw('arseia-char-2')).lvl===41,'2번 칸 저장');loadRegion('home')});
qT('저장','새 캐릭터를 만들 때 읽을 수 없는 칸(깨진 JSON·미래 버전)을 덮어쓰지 않음',()=>{qResetStore();qPut('arseia-char-0',QA_FIX.v4);const bad='{"v":5,"cls":"mage",lvl:';qPut('arseia-char-1',bad);qPut('arseia-char-2',QA_FIX.v6future);
  introButtons(false);const b=document.querySelector('#introBody [data-cls="mage"]');qOk(b,'새 캐릭터 버튼 없음');const slot=+b.dataset.slot;b.click();
  const ok1=qRaw('arseia-char-1')===bad,ok2=qRaw('arseia-char-2')===JSON.stringify(QA_FIX.v6future);qOk(ok1&&ok2,`새 캐릭터가 ${slot}번 칸에 저장되어 ${!ok1?'깨진 JSON(1번)':''}${!ok2?' 미래 버전(2번)':''} 저장을 덮어씀`);return `새 칸 ${slot}`});
qT('저장','8칸이 다 찬 경우',()=>{qResetStore();const F=[QA_FIX.v1old,QA_FIX.v2,QA_FIX.v4,QA_FIX.v5,QA_FIX.v4,QA_FIX.v2,QA_FIX.v5,QA_FIX.v1old];F.forEach((d,i)=>qPut('arseia-char-'+i,Object.assign({},d,{slot:i})));
  introButtons(false);const cards=document.querySelectorAll('#introBody [data-play]').length,nw=document.querySelectorAll('#introBody [data-cls]').length;
  qOk(cards===8,`카드 ${cards}`);qOk(nw===0,'다 찼는데 새 캐릭터 버튼');qOk(/가득/.test($('#introBody').textContent),'가득 찼다는 안내 없음');
  for(let i=0;i<8;i++){const d=readSlot(i);qOk(d&&load(d,i)&&curSlot===i&&P.cls===F[i].cls,`${i}번 칸 불러오기 실패`)}loadRegion('home');return '8/8'});
qT('저장','띄엄띄엄 찬 경우 (0·3·7번) — 새 캐릭터는 1번 칸, 다른 칸은 그대로',()=>{qResetStore();qPut('arseia-char-0',QA_FIX.v4);qPut('arseia-char-3',QA_FIX.v2);qPut('arseia-char-7',QA_FIX.v5);
  const raw=[0,3,7].map(i=>qRaw('arseia-char-'+i));introButtons(false);const cards=[...document.querySelectorAll('#introBody [data-play]')].map(b=>+b.dataset.play);qOk(cards.join()==='0,3,7',`카드 ${cards}`);
  const b=document.querySelector('#introBody [data-cls="priest"]');qOk(b&&b.dataset.slot==='1',`새 칸 ${b&&b.dataset.slot}`);b.click();qOk(curSlot===1&&qRaw('arseia-char-1'),'1번에 저장 안 됨');
  [0,3,7].forEach((i,j)=>qOk(qRaw('arseia-char-'+i)===raw[j],`${i}번 칸이 바뀜`));qStep(5);saveNow();[0,3,7].forEach((i,j)=>qOk(qRaw('arseia-char-'+i)===raw[j],`${i}번 칸이 바뀜(저장 후)`));loadRegion('home')});
qT('저장','저장소가 가득 차서 저장이 실패해도 게임이 멈추지 않음',()=>{qPrep('mage');QA.quota=10;try{saveNow();save();qStep(10);gainXp(xpNeed(P.lvl))}finally{QA.quota=0}});

/* ===== 11. 안정성 · 성능 ===== */
const qaPerf={};
function qPerf(name,frames,each){const ts=[];for(let i=0;i<frames;i++){if(each)each(i);spawnT=1e9;const t0=performance.now();update(1/60);render();ts.push(performance.now()-t0);
  const b=qBad();if(b.length)throw new QAFail(b.join(','))}
  const avg=ts.reduce((a,b)=>a+b,0)/ts.length,s=ts.slice().sort((a,b)=>a-b);qaPerf[name]={frames,avgMs:qR(avg),p95Ms:qR(s[Math.floor(s.length*.95)]),worstMs:qR(s[s.length-1])};return qaPerf[name]}
const qBig=cls=>qSpells(cls,s=>isDmg(s)&&s.rank>=8).map(s=>s.id);
function qHorde(n,lvl){const ks=FIELD_TYPES;for(let i=enemies.filter(e=>!e.dead&&!e.qa).length;i<n;i++){const a=R()*6.283,d=rnd(160,520);const e=dgMob(pick(ks),P.x+Math.cos(a)*d,P.y+Math.sin(a)*d,lvl||20);e.aggroed=true}}
qT('안정성','순간이동으로 몬스터와 정확히 같은 점에 서도 몬스터 위치가 NaN이 되지 않음 (v18: 씨앗 505 안정성 점검에서 번개의 몸으로 재현)',()=>{qPrep('mage',{lvl:60});
  for(const k of ['ogre','wraith']){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;spawnT=1e9;const e=dgMob(k,P.x,P.y,20);e.aggroed=true;enemies.push(e);qStep(10,{render:false,each:()=>{P.hp=maxHp()}});qOk(isFinite(e.x)&&isFinite(e.y),`${k} 위치 NaN`)}
  qClear();return '근접·원거리 모두 정상'});
qT('안정성','몬스터 50마리 + 큰 마법 연속 30초(1800프레임, 그리기는 3프레임마다): 오류·NaN 없음, 입자 상한(900) 지킴',()=>{qPrep('mage',{lvl:60});const big=qBig('mage');for(const id of big)P.sk[id]=20;qOk(Q.pcap===900,`Q.pcap ${Q.pcap}`);
  let maxParts=0,maxRaw=0,casts=0,kills=0,maxE=0,k=0;qHorde(50);
  const ts=[];for(let i=0;i<1800;i++){P.hp=maxHp();P.mp=maxMp();if(P.dead)throw new QAFail('쓰러짐');
    if(i%15===0){const id=big[k++%big.length];P.cd={};const tg=nearestEnemy(P,700)||qAt(i,200);if(qCast(id,{x:tg.x,y:tg.y}))casts++;maxRaw=Math.max(maxRaw,parts.length)}
    const n0=enemies.length;spawnT=1e9;const t0=performance.now();update(1/60);if(i%3===0){render();ts.push(performance.now()-t0)}kills+=Math.max(0,n0-enemies.length);qHorde(50);
    maxParts=Math.max(maxParts,parts.length);maxE=Math.max(maxE,enemies.length);const b=qBad();if(b.length)throw new QAFail(b.join(',')+` (${i}프레임)`);
    if(parts.length>Q.pcap)throw new QAFail(`입자 ${parts.length} > ${Q.pcap}`)}
  const avg=ts.reduce((a,b)=>a+b,0)/ts.length;qaPerf.stress={frames:ts.length,avgMs:qR(avg),p95Ms:qR(ts.slice().sort((a,b)=>a-b)[Math.floor(ts.length*.95)]),worstMs:qR(Math.max(...ts))};
  return `시전 ${casts}회 · 처치 ${kills} · 최대 입자 ${maxParts}/${Q.pcap} (시전 직후 ${maxRaw}) · 최대 몬스터 ${maxE}`});
qT('성능','마을 장면 (update+render, 240프레임)',()=>{qPrep('mage',{lvl:30,at:{x:TOWNS[0].x,y:TOWNS[0].y+110}});for(let i=0;i<5;i++)render();const p=qPerf('town',240);return `평균 ${p.avgMs}ms · 최악 ${p.worstMs}ms`});
qT('성능','마을 장면 · 땅 굽기가 끝난 뒤 (240프레임)',()=>{qPrep('mage',{lvl:30,at:{x:TOWNS[0].x,y:TOWNS[0].y+110}});let w=0;for(;w<900;w++){update(1/60);render();if(typeof GJOBS==='undefined'||(!GJOBS.length&&w>20))break}
  const p=qPerf('townWarm',240);return `평균 ${p.avgMs}ms · 최악 ${p.worstMs}ms · 예열 ${w}프레임`});
qT('성능','몬스터 50마리 전투 (240프레임)',()=>{qPrep('mage',{lvl:30});P.sk.firebolt=10;P.sk.fireburst=5;qHorde(50,25);
  const p=qPerf('fight50',240,i=>{P.hp=maxHp();P.mp=maxMp();qHorde(50,25);const e=nearestEnemy(P,600);if(e){qNoRec();tryCast('firebolt',e);qNoRec();tryCast('fireburst',e)}});return `평균 ${p.avgMs}ms · 최악 ${p.worstMs}ms`});
qT('성능','9위계 마법 연속 (240프레임)',()=>{qPrep('mage',{lvl:60});qJob2On();const r9=qSpells('mage',s=>isDmg(s)&&s.rank===9).map(s=>s.id);for(const id of r9)P.sk[id]=20;
  const ds=[];for(let i=0;i<8;i++){const a=i*.785;ds.push(qDummy(P.x+Math.cos(a)*220,P.y+Math.sin(a)*220))}let k=0;
  const p=qPerf('rank9',240,i=>{P.hp=maxHp();P.mp=maxMp();if(i%6===0){const id=r9[k++%r9.length];P.cd[id]=0;qNoRec();tryCast(id,ds[k%8])}});return `평균 ${p.avgMs}ms · 최악 ${p.worstMs}ms · 마법 ${r9.length}종`});

qT('그래픽','위계별 투사체 그림: 원소×위계 단계마다 굽기가 빈 그림이 아님',()=>{const bad=[];let n=0;const blank=e=>{if(!e||!e.cv||!e.cv.width)return true;const d=e.cv.getContext('2d').getImageData(0,0,e.cv.width,e.cv.height).data;let s=0;for(let i=3;i<d.length;i+=16)s+=d[i];return s<255*4};
  for(const el of Object.keys(EL))for(let t=0;t<5;t++){const col=EL[el];for(let f=0;f<FXR.FR;f++){n++;if(blank(FXR.body(el,col,t,f)))bad.push(`${el}/단계${t}/프레임${f}`)}
    if(t>=3&&blank(t>=4?FXR.sigil(col):FXR.halo(col,t)))bad.push(`${el}/단계${t} 고리`)}
  for(const el of Object.keys(EL)){if(blank(FXR.flare(EL[el])))bad.push(el+' 터짐');if(blank(FXR.ring(EL[el])))bad.push(el+' 충격파')}
  qOk(FXR.tierOf(1)===0&&FXR.tierOf(3)===1&&FXR.tierOf(5)===2&&FXR.tierOf(7)===3&&FXR.tierOf(9)===4,'위계→단계 대응이 다름');
  qOk(!bad.length,'빈 그림: '+bad.slice(0,8).join(', '));return `${Object.keys(EL).length}원소 × 5단계 × ${FXR.FR}프레임 = ${n}장 + 고리·터짐`});

qT('그래픽','치유·강화 마법: 종류마다 시전하면 보이는 시전 효과가 생김',()=>{const out=[],bad=[],seen=new Set();const blank=e=>{if(!e||!e.cv)return true;const d=e.cv.getContext('2d').getImageData(0,0,e.cv.width,e.cv.height).data;let s=0;for(let i=3;i<d.length;i+=8)s+=d[i];return s<255*4};
  for(const cls of ['mage','priest']){qPrep(cls);for(const s0 of qSpells(cls,s=>FXB.isSup(s)&&s.kind!=='rez')){const k=FXB.style(s0);if(seen.has(s0.kind+'/'+k))continue;seen.add(s0.kind+'/'+k);
    P.sk[s0.id]=10;FXB.fx=[];P.hp=Math.round(maxHp()*.5);if(!qCast(s0.id,{x:P.x+40,y:P.y})){bad.push(s0.id+' 시전 안 됨');continue}
    qStep(150,{render:false,until:()=>FXB.fx.length>0});const f=FXB.fx.find(f=>f.k===k);if(!f){bad.push(`${s0.id}(${s0.kind}): 시전 효과 없음`);continue}render();
    if(blank(FXB.ring(f.col))||blank(FXB.column(f.col))||blank(FXB.bubble(f.col))||['ring','halo','glyph'].some(b=>blank(FXB.base(b,f.col))))bad.push(s0.id+' 빈 그림');out.push(s0.kind)}}
  FXB.fx=[];FXB.cast({kind:'rez',el:'holy',rank:9},{x:P.x,y:P.y});qOk(FXB.fx.length===1&&FXB.fx[0].k==='rez','되살리기 효과 없음');render();out.push('rez');
  for(const k of ['heal','hot','shield','buff','ward','invuln','armor'])if(!out.includes(k)&&Object.values(SPELLS).some(s=>s.kind===k))bad.push(k+' 종류 점검 안 됨');
  qClear();qOk(!bad.length,bad.join(', '));return out.join(' · ')});

// 파티 표시: 「파티」/「자신만」 표시가 실제로 동료에게 걸리는지와 같은지, 가짜 동료(qa_peer)가 시전한 것처럼 netGhostCast로 확인한다
function qPeerOn(){NET.on=true;NET.ws=null;NET.peers.clear();const r=netPeer('qa_peer');Object.assign(r,{name:'QA 동료',cls:'priest',lvl:60,hp:500,max:800,mp:300,mmax:600,dead:false,area:netArea(),seen:1});return r}
function qPeerOff(){NET.on=false;NET.peers.clear();qClear()}
qT('그래픽','파티 표시: 「파티」/「자신만」이 실제로 동료에게 걸리는지와 같음 (가짜 동료가 시전)',()=>{const bad=[];let np=0,ns=0;
  try{for(const cls of ['mage','priest']){qPrep(cls);
    for(const s0 of qSpells(cls,s=>PUI.rule(s)&&s.kind!=='rez')){const R0=PUI.rule(s0);
      for(const far of R0.how==='radius'?[0,1]:[0]){qClear();const r=qPeerOn();const d=far?R0.r+90:Math.min(60,(R0.r||400)*.3);r.x=r.tx=P.x+d;r.y=r.ty=P.y;
        P.hp=Math.round(maxHp()*.3);P.mp=Math.round(maxMp()*.3);const hp0=P.hp,mp0=P.mp;
        netGhostCast({from:'qa_peer',sp:s0.id,L:10,x:Math.round(P.x),y:Math.round(P.y),pw:200});qStep(s0.kind==='field'?70:2,{render:false});
        const got=P.hp>hp0+maxHp()*.015||P.mp>mp0+maxMp()*.015||!!P.hot||P.shield>0||!!P.ward||Object.keys(P.buffs).length>0||P.invT>0||!!P.armor;
        const want=R0.party&&!far;if(got!==want)bad.push(`${s0.id}(${s0.kind}${far?' 범위 밖':''}): 표시 ${R0.party?'파티':'자신만'}인데 동료 시전이 ${got?'걸림':'안 걸림'}`);
        if(!far)R0.party?np++:ns++}}}
    const z=PUI.rule({kind:'rez',rad:420});qOk(z&&z.party&&z.how==='downed','되살리기 표시가 파티가 아님');
    qOk(np>0&&ns>0,`파티 ${np}개 · 자신만 ${ns}개`)}finally{qPeerOff()}
  qOk(!bad.length,bad.slice(0,6).join(' / '));return `파티 ${np} · 자신만 ${ns} (범위 밖 시전은 안 걸림까지)`});
qT('그래픽','파티 창: 가짜 동료의 이름·생명력·강화 아이콘이 그려지고, 스킬 트리·단축칸에 파티 표시',()=>{qPrep('priest');try{const r=qPeerOn();r.x=r.tx=P.x+40;r.y=r.ty=P.y;
    const pid=qSpells('priest',s=>PUI.rule(s)&&PUI.rule(s).party&&s.kind==='buff')[0].id,sid=qSpells('priest',s=>PUI.rule(s)&&PUI.rule(s).mode==='self')[0].id;
    r.bf=[[pid,12],['_sh',8,300]];r.bfT=time;P.sk[pid]=10;qCast(pid);PUI.tick(true);const el=$('#pframes');qOk(el&&!el.hidden,'파티 창 없음');
    qOk(el.textContent.includes('QA 동료'),'동료 이름 없음');qOk(el.querySelectorAll('.pf:not(.me) .pbi').length===2,'동료 강화 아이콘 2개가 아님');qOk(el.querySelector('.pf.me .pbi'),'내 강화 아이콘 없음');
    qOk(el.querySelector('.pb.hp i').style.width==='63%',`생명력 막대 ${el.querySelector('.pb.hp i').style.width}`);
    const fx0=FXB.fx.filter(f=>f.o===r).length;qOk(fx0>0,'동료에게 걸리는 순간 효과 없음');P.cd[pid]=0;qCast(pid);qOk(FXB.fx.some(f=>f.o===r&&f.k==='pulse'),'다시 걸 때(갱신) 작은 맥박 없음');
    P.bar[0]=pid;P.bar[1]=sid;buildBar();qOk($('#bar [data-slot="0"] .ptm.p'),'단축칸 파티 표시 없음');qOk($('#bar [data-slot="1"] .ptm.s'),'단축칸 자신만 표시 없음');
    openPanel('tree');const hasP=!!pbody.querySelector('.node .ptb');closePanel();qOk(hasP,'스킬 트리 파티/자신 배지 없음');
    qOk(numsAt(pid,1)[0][0]==='대상','수치표에 대상 줄 없음');return `강화 ${pid} · 자신만 ${sid}`}finally{qPeerOff();PUI.tick(true)}});

/* ===== 11b. 파티 v18 (PARTY): 생명력·경험치·위협·도발·무너짐·협동 보스·한 명 지원 ===== */
// 가짜 동료(qa_peer, qa_peer2)와 가짜 연결(보낸 메시지를 모음)로 방장 화면처럼 점검한다
function qPty(n,o){o=o||{};const r=qPeerOn();r.x=r.tx=P.x+(o.dx||80);r.y=r.ty=P.y;NET.id='qa_me';NET.host=!!o.host;const sent=[];NET.ws={readyState:1,send:x=>sent.push(JSON.parse(x))};
  if(n>=3){const r2=netPeer('qa_peer2');Object.assign(r2,{name:'QA 동료2',cls:'mage',lvl:60,hp:500,max:800,mp:300,mmax:600,dead:false,area:netArea(),seen:1,x:P.x-80,y:P.y,tx:P.x-80,ty:P.y})}
  return{r,sent}}
function qPtyOff(){NET.host=false;NET.guest=false;NET.id=0;NET.ws=null;PTY.tgt=0;PTY.pull=null;GHOST=null;if(P)P.swal=null;qPeerOff()}
const qMob=(k,dx,lvl)=>{const e=dgMob(k,P.x+(dx||300),P.y,lvl||20);e.atkCd=1e9;e.id=++NET.eid;return e};
qT('파티 v18','몬스터 생명력: 같은 지역 인원마다 +90%(준보스·보스 +100%), 혼자·다른 지역 동료는 그대로, 피해는 그대로',()=>{qPrep('mage');P.invT=1e9;const out=[];
  try{const one=k=>{const e=qMob(k);const m0=e.max,d0=e.dmg;qStep(1,{render:false});return{e,m0,d0}};
    let a=one('wolf');qOk(a.e.max===a.m0&&a.e.ps===1,`혼자인데 바뀜 ${a.m0}→${a.e.max}`);qClear();
    const {r}=qPty(2);a=one('wolf');qOk(a.e.max===Math.round(a.m0*1.9),`2명 일반 ${a.m0}→${a.e.max} (×1.9 아님)`);qOk(a.e.dmg===a.d0,'몬스터 피해가 늘어남');out.push(`2명 일반 ×${qR(a.e.max/a.m0)}`);
    let b=one('b_arsil');qOk(b.e.max===Math.round(b.m0*2),`2명 보스 ×${qR(b.e.max/b.m0)}`);b=one('m_bolg');qOk(b.e.max===Math.round(b.m0*2),`2명 준보스 ×${qR(b.e.max/b.m0)}`);
    r.area=-99;a=one('wolf');qOk(a.e.max===a.m0,'다른 지역 동료까지 셈');r.area=netArea();qClear();qPtyOff();
    qPty(3);a=one('wolf');qOk(a.e.max===Math.round(a.m0*2.8),`3명 일반 ×${qR(a.e.max/a.m0)}`);b=one('b_morgath');qOk(b.e.max===Math.round(b.m0*3),`3명 보스 ×${qR(b.e.max/b.m0)}`);
    const m1=a.e.max;qStep(2,{render:false});qOk(a.e.max===m1,'한 번 정한 생명력이 다시 바뀜');out.push(`3명 일반 ×${qR(a.e.max/a.m0)} · 보스 ×${qR(b.e.max/b.m0)}`)}finally{qPtyOff()}
  return out.join(' · ')});
qT('파티 v18','경험치: 인원 한 명마다 +5% 파티 보너스(혼자는 그대로)',()=>{qPrep('mage',{lvl:12});const got=()=>{P.lvl=12;P.xp=0;const g0=gainXp;let c=0;gainXp=function(){if(c++)return;return g0.apply(this,arguments)};try{rewardKill({k:'wolf',x:P.x,y:P.y,lvl:12,elite:false,r:14})}finally{gainXp=g0}return P.xp};/* v26: 처치 경험치 한 번만 잼 — 같은 처치에 따라붙는 의뢰 · 현상금 경험치가 가끔 섞여 2명 값이 두 배로 나오던 것(전체 점검에서만 흔들림) */
  try{const x1=got();qPty(2);const x2=got();qOk(texts.some(t=>/파티 보너스 \+5%/.test(t.t)),'「파티 보너스」 글자 없음');qPtyOff();qPty(3);const x3=got();
    qOk(x1>0&&Math.abs(x2/x1-1.05)<.03&&Math.abs(x3/x1-1.10)<.03,`경험치 ${x1}/${x2}/${x3}`);return `혼자 ${x1} · 2명 ${x2} · 3명 ${x3}`}finally{qPtyOff()}});
qT('파티 v18','위협: 파티면 위협 1위를 노림(1.3배 넘게 앞설 때만 바뀜), 전사 ×2.5, 혼자는 가까운 사람',()=>{qPrep('mage');P.invT=1e9;
  try{const e0=qMob('wolf',150);e0.hp=e0.max=1e6;qOk(enemyTarget(e0).tg===P,'혼자인데 가까운 사람이 아님');e0.thr=new Map([['qa_peer',999]]);qOk(enemyTarget(e0).tg===P,'혼자인데 위협을 따름');qClear();
    const {r}=qPty(2,{host:true,dx:400});const e=qMob('wolf',120);e.hp=e.max=1e6;e.aggroed=true;
    qOk(enemyTarget(e).tg===P,'위협이 없을 때 가까운 사람이 아님');
    netOnMsg({t:'dmg',from:'qa_peer',id:e.id,a:50});qOk(Math.round(e.thr.get('qa_peer'))===50,`동료 위협 ${e.thr.get('qa_peer')}`);qOk(enemyTarget(e).tg===r,'피해를 준 동료를 노리지 않음');
    e.thr.set(0,60);qOk(enemyTarget(e).tg===r,'1.3배 안인데 대상이 바뀜');e.thr.set(0,70);qOk(enemyTarget(e).tg===P,'1.3배를 넘었는데 안 바뀜');
    e.thr.set(0,0);e.thr.set('qa_peer',0);e.ttk=null;r.cls='warrior';netOnMsg({t:'dmg',from:'qa_peer',id:e.id,a:10,th:4});qOk(Math.round(e.thr.get('qa_peer'))===100,`전사 도발 일격 위협 ${e.thr.get('qa_peer')} (10×4×2.5=100)`);
    const h0=e.hp;hurtE(e,40,{el:'fire',cls:'mage'});qOk(Math.abs(e.thr.get(0)-(h0-e.hp))<1e-6,'내 피해가 위협이 안 됨');
    // 실제로 따라감: 위협 1위인 동료 쪽으로 움직인다
    e.thr=new Map([['qa_peer',500]]);e.ttk=null;const d0=dist(e,r);qStep(30,{render:false,each:()=>{P.invT=1e9}});qOk(dist(e,r)<d0-30,`위협 1위 쪽으로 안 감 ${Math.round(d0)}→${Math.round(dist(e,r))}`);
    r.dead=true;qOk(enemyTarget(e).tg===P,'쓰러진 동료를 계속 노림');r.dead=false;
    return `동료 50 → 동료 · 내 70(>65) → 나 · 전사 ×2.5·×4 = ${Math.round(e.thr.get('qa_peer')||0)}`}finally{qPtyOff()}});
qT('파티 v18','도발: 1위의 150% + 그 시간 동안 시전자만 노림 (방장의 도발 · 동료의 도발 둘 다)',()=>{qPrep('mage');P.invT=1e9;
  try{const {r}=qPty(2,{host:true,dx:200});const e=qMob('wolf',100);e.hp=e.max=1e6;e.thr=new Map([['qa_peer',100]]);qOk(enemyTarget(e).tg===r,'준비');
    applyFx(e,{taunt:4},P);qOk(Math.round(e.thr.get(0))===150,`도발 위협 ${e.thr.get(0)}`);qOk(enemyTarget(e).tg===P&&e.tnt&&e.tnt.t>time,'도발해도 나를 안 노림');
    e.thr.set('qa_peer',1000);qOk(enemyTarget(e).tg===P,'도발 시간 안인데 대상이 바뀜');e.tnt.t=time-1;e.tauntT=0;qOk(enemyTarget(e).tg===r,'도발이 끝났는데 계속 나');
    GHOST=r;try{applyFx(e,{taunt:3,ghost:1},P)}finally{GHOST=null}qOk(e.thr.get('qa_peer')>=1000*1.5-1&&e.tnt.k==='qa_peer','동료(다시 그린 시전)의 도발이 안 먹음');
    const b=qMob('m_bolg',80);b.hp=b.max=1e6;applyFx(b,{taunt:2},P);qOk(b.cs&&b.cs.has(0),'준보스 도발이 협동 기여로 안 셈');return `내 도발 150 · 동료 도발 ${Math.round(e.thr.get('qa_peer'))}`}finally{qPtyOff()}});
qT('파티 v18','무너짐 게이지: 기절·얼림·밀치기·막기로 차고, 가득 차면 5초 무너짐(못 움직임 · 받는 피해 +30%)',()=>{qPrep('mage');P.invT=1e9;
  try{const {r}=qPty(2,{host:true});const e=qMob('m_bolg',200);e.hp=e.max=1e6;const n=qMob('wolf',260);
    applyFx(e,{stun:1},P);qOk(Math.round(e.stg)===12,`기절 ${e.stg}`);applyFx(e,{freeze:1},P);qOk(Math.round(e.stg)===22,`얼림 ${e.stg}`);applyFx(e,{knock:60},P);qOk(Math.round(e.stg)===28,`밀치기 ${e.stg}`);PTY.block(e);qOk(Math.round(e.stg)===32,`막기 ${e.stg}`);
    applyFx(n,{stun:1},P);qOk(!n.stg,'일반 몬스터에 게이지가 참');
    for(let i=0;i<8&&!(e.brk>0);i++)applyFx(e,{stun:1},P);qOk(e.brk===5&&e.stunT>=5&&e.stg===0,`무너지지 않음 brk ${e.brk} stun ${e.stunT}`);
    qOk(Math.abs(PTY.dmgMul(e,0)-1.3)<1e-9,'받는 피해 +30% 아님');const h0=e.hp;netOnMsg({t:'dmg',from:'qa_peer',id:e.id,a:100});qOk(h0-e.hp===130,`동료 피해 100 → ${h0-e.hp}`);
    applyFx(e,{stun:1},P);qOk(!e.stg,'무너진 동안 게이지가 참');enemies=[e];const x0=e.x,y0=e.y;e.aggroed=true;qStep(60,{render:false,each:()=>{P.invT=1e9}});qOk(Math.hypot(e.x-x0,e.y-y0)<2,'무너졌는데 움직임');
    qStep(260,{render:false,each:()=>{P.invT=1e9;e.atkCd=1e9}});qOk(!(e.brk>0),'5초가 지나도 무너짐');applyFx(e,{stun:1},P);const s1=e.stg;qStep(60,{render:false,each:()=>{P.invT=1e9}});qOk(e.stg<s1-2,'게이지가 줄지 않음');
    return `기절 12 · 얼림 10 · 밀치기 6 · 막기 4 → 무너짐 5초 · 피해 ×1.3`}finally{qPtyOff()}});
// 협동 보스: 던전 1막 보스마다 하나 (파티 · 혼자)
const qBossAt=(i,party)=>{qEnter(DUNGEONS[i]);const e=DG.boss;P.invT=1e9;const p=qFreeAt(e.x,e.y,110,0);P.x=p.x;P.y=p.y;let pt=null;if(party){pt=qPty(2,{host:true,dx:60})}e.aggroed=true;e.id=e.id||++NET.eid;return{e,pt}};
qT('파티 v18','아르실: 60%에서 근위병(파티 4 · 혼자 2) + 보호막(피해 -80%), 근위병을 다 쓰러뜨리면 벗겨짐',()=>{const out=[];
  try{for(const party of [1,0]){const {e}=qBossAt(0,party);e.hp=Math.round(e.max*.55);qStep(2,{render:false,each:()=>{P.invT=1e9}});
      const gs=enemies.filter(o=>o.guard===e&&!o.dead);qOk(gs.length===(party?4:2),`근위병 ${gs.length}`);qOk(e.gsh&&Math.abs(PTY.dmgMul(e,0)-.2)<1e-9,'보호막 없음');
      const h0=e.hp;hurtE(e,100,{el:'fire'});qOk(h0-e.hp<=100*.2*1.75+1,`보호막인데 피해 ${h0-e.hp}`);
      for(const g of gs)hurtE(g,g.hp+10,{el:'fire'});qStep(1,{render:false});qOk(!e.gsh,'근위병을 다 잡았는데 보호막');qOk(e.stg>=25,'보호막이 벗겨질 때 게이지가 안 참');out.push(`${party?'파티':'혼자'} 근위병 ${gs.length}`);qPtyOff();leaveDungeon()}}finally{qPtyOff();if(DG)leaveDungeon()}
  return out.join(' · ')});
qT('파티 v18','삼키는 자: 파티면 위협 1위를 삼키고 다른 사람이 배를 때리면 뱉음, 혼자면 들이마시기(끌어당김)만',()=>{const out=[];
  try{let {e,pt}=qBossAt(1,1);e.hp=e.max=Math.max(e.max,5000);e.thr=new Map([[0,500],['qa_peer',10]]);e.swT=.01;qStep(2,{render:false,each:()=>{P.invT=1e9}});
    qOk(e.swal&&e.swal.k===0&&P.swal,'위협 1위(나)를 삼키지 않음');qStep(3,{render:false,each:()=>{P.invT=1e9}});qOk(dist(P,e)<5,'삼켜졌는데 보스 밖에 있음');
    const mp0=P.mp;P.sk.spark=1;P.cd={};tryCast('spark',{x:P.x+50,y:P.y});qOk(P.mp===mp0,'삼켜졌는데 마법이 나감');
    const need=e.swal.need;netOnMsg({t:'dmg',from:'qa_peer',id:e.id,a:Math.ceil(need)});qOk(!e.swal&&!P.swal,'배를 때렸는데 안 뱉음');qOk(e.stg>=15,'꺼내 줄 때 게이지가 안 참');out.push(`배 ${Math.ceil(need)} → 뱉음`);
    e.thr=new Map([[0,10],['qa_peer',500]]);e.ttk=null;pt.r.x=pt.r.tx=e.x+60;pt.r.y=pt.r.ty=e.y;e.swT=.01;qStep(2,{render:false,each:()=>{P.invT=1e9}});qOk(e.swal&&e.swal.k==='qa_peer'&&pt.sent.some(m=>m.t==='pm'&&m.k==='sw'&&m.to==='qa_peer'),'동료를 삼킨다는 메시지 없음');
    qOk(enemyTarget(e).tg!==pt.r,'삼켜진 동료를 계속 노림');qStep(Math.ceil(4.2*60),{render:false,each:()=>{P.invT=1e9;e.atkCd=1e9}});qOk(!e.swal&&pt.sent.some(m=>m.t==='pm'&&m.k==='sp'),'4초 뒤 안 뱉음');
    qOk(qNum(PTY.snap(e)[2]),'상태 줄 없음');qPtyOff();leaveDungeon();
    ({e}=qBossAt(1,0));const p0=qFreeAt(e.x,e.y,240,0);P.x=p0.x;P.y=p0.y;const d0=dist(P,e);e.swT=.01;qStep(30,{render:false,each:()=>{P.invT=1e9;e.skT=99;e.atkCd=1e9}});
    qOk(!e.swal&&!P.swal,'혼자인데 삼킴');qOk(dist(P,e)<d0-40,`들이마시기가 안 끌어당김 ${Math.round(d0)}→${Math.round(dist(P,e))}`);out.push(`혼자: 끌어당김 ${Math.round(d0)}→${Math.round(dist(P,e))}`)}finally{qPtyOff();if(DG)leaveDungeon()}
  return out.join(' · ')});
qT('파티 v18','발드라크: 「재의 폭풍」 2초 외우기 — 기절·밀치기로 끊으면 게이지 +30, 못 끊으면 반경 300 큰 피해 (파티 18초 · 혼자 24초마다)',()=>{const out=[];
  try{let {e}=qBossAt(2,1);e.hp=e.max=Math.max(e.max,5000);e.bcT=.01;qStep(2,{render:false,each:()=>{P.invT=1e9}});const w=warns.find(w=>w.src===e&&w.rad===300);
    qOk(e.bc>1.8&&w&&w.dmg>=e.dmg*3-1e-6&&Math.abs(e.bcT-18)<.1,`외우기 없음 bc ${e.bc} 다음 ${qR(e.bcT)}`);qOk(PTY.snap(e)[3]>0,'참가자에게 외우기 막대를 안 보냄');
    applyFx(e,{stun:.6},P);qStep(1,{render:false});qOk(!(e.bc>0)&&!warns.includes(w),'기절로 안 끊김');qOk(e.stg>=29,`끊었는데 게이지 ${e.stg}`);out.push('끊기 +30');
    e.stg=0;e.stunT=0;e.bcT=.01;qStep(2,{render:false,each:()=>{P.invT=1e9}});P.invT=0;P.shield=0;P.hp=maxHp();const h0=P.hp;P.x=e.x+80;P.y=e.y;
    qStep(Math.ceil(2.1*60),{render:false,each:()=>{e.atkCd=1e9;e.skT=99;P.invT=0;P.x=e.x+80;P.y=e.y;projs=projs.filter(p=>p.owner!=='e')}});qOk(P.hp<h0,'못 끊었는데 피해 없음');out.push(`못 끊음 -${Math.round(h0-P.hp)}`);
    qPtyOff();leaveDungeon();({e}=qBossAt(2,0));e.bcT=.01;qStep(2,{render:false,each:()=>{P.invT=1e9}});qOk(e.bc>0&&Math.abs(e.bcT-24)<.1,`혼자 간격 ${qR(e.bcT)}`);out.push('혼자 24초')}finally{qPtyOff();if(DG)leaveDungeon()}
  return out.join(' · ')});
qT('파티 v18','모르가스: 50%에서 분신(파티 2 · 혼자 1), 하나만 쓰러지고 시간이 지나면 되살아나고, 모두 함께 쓰러뜨리면 보스 처치',()=>{const out=[];
  try{let {e}=qBossAt(3,1);e.hp=Math.round(e.max*.45);qStep(1,{render:false,each:()=>{P.invT=1e9}});let B=e.mg,cs=enemies.filter(o=>o.clone&&o.mg===B);
    qOk(B&&cs.length===2&&B.win===10,`분신 ${cs.length} 시간 ${B&&B.win}`);qOk(cs.every(c=>c.max<e.max&&TYPES[c.k].boss&&PTY.snap(c)[2]&2),'분신 모양');
    hurtE(cs[0],cs[0].hp+10,{el:'fire'});qOk(cs[0].down&&!cs[0].dead&&!e.dead&&B.t0>=0,'분신 하나가 그냥 죽음');const nk=loot.length;
    B.t0=time-11;qStep(1,{render:false,each:()=>{P.invT=1e9}});qOk(!cs[0].down&&enemies.includes(cs[0])&&Math.abs(cs[0].hp-cs[0].max*.4)<2,'시간이 지났는데 안 일어섬');out.push('늦으면 되살아남');
    hurtE(cs[0],cs[0].hp+10,{el:'fire'});hurtE(cs[1],cs[1].hp+10,{el:'fire'});qOk(!e.dead,'분신만 잡았는데 보스가 죽음');hurtE(e,e.hp+10,{el:'fire'});
    qOk(e.dead&&DG.bossDead&&loot.length>nk,'셋을 함께 잡았는데 보스가 안 죽음');qOk(cs.every(c=>c.dead),'분신이 남음');out.push('셋 함께 → 처치');qPtyOff();leaveDungeon();
    ({e}=qBossAt(3,0));e.hp=Math.round(e.max*.45);qStep(1,{render:false,each:()=>{P.invT=1e9}});B=e.mg;cs=enemies.filter(o=>o.clone&&o.mg===B);qOk(cs.length===1&&B.win===15,`혼자 분신 ${cs.length} 시간 ${B.win}`);
    hurtE(e,e.hp+10,{el:'fire'});qOk(e.down&&!e.dead,'혼자: 보스가 먼저 쓰러지면 기다려야 함');hurtE(cs[0],cs[0].hp+10,{el:'fire'});qOk(e.dead&&DG.bossDead,'혼자: 분신까지 잡았는데 보스가 안 죽음');out.push('혼자 분신 1 · 15초')}finally{qPtyOff();if(DG)leaveDungeon()}
  return out.join(' · ')});
qT('파티 v18','협동 처치: 5% 이상 깎았거나 도운 사람이 둘이면 각자 전리품 한 번 더(구경만 하면 없음), 참가자는 kill 메시지 co로 받음',()=>{const out=[];const jk21=Object.assign({},JUNK21);JUNK21[0]=JUNK21[1]=1;const d24=DROP24;DROP24=0;/* v24: 덤 한 개(1/5 난수)는 이 점검의 개수와 무관 *//* v21: 잡템 줄이기(난수)는 이 점검의 개수와 무관 */
  try{const items=()=>loot.filter(l=>l.kind==='item').length;
    let {e}=qBossAt(0,0);loot=[];hurtE(e,e.hp+10,{el:'fire'});const solo=items();leaveDungeon();
    let pt;({e,pt}=qBossAt(0,1));loot=[];netOnMsg({t:'dmg',from:'qa_peer',id:e.id,a:Math.ceil(e.max*.06)});hurtE(e,e.hp+10,{el:'fire'});
    const km=pt.sent.find(m=>m.t==='kill'&&m.id===e.id);qOk(km&&km.co&&km.co.includes('qa_me')&&km.co.includes('qa_peer'),`kill 메시지 ${km?'co '+JSON.stringify(km.co):'없음'} · 보낸 ${pt.sent.map(m=>m.t).slice(-6)} · cd ${e.cd?[...e.cd].map(a=>a[0]+':'+Math.round(a[1])):'-'} max ${e.max} co ${JSON.stringify(e.co)} dead ${e.dead}`);qOk(items()===solo+1,`협동 전리품 ${items()} (혼자 ${solo})`);out.push(`혼자 ${solo} → 협동 ${items()}`);qPtyOff();leaveDungeon();
    ({e,pt}=qBossAt(0,1));loot=[];netOnMsg({t:'dmg',from:'qa_peer',id:e.id,a:Math.ceil(e.max*.01)});hurtE(e,e.hp+10,{el:'fire'});qOk(items()===solo&&!(pt.sent.find(m=>m.t==='kill'&&m.id===e.id)||{}).co,'구경만 한 동료로 협동 처치가 됨');qPtyOff();leaveDungeon();
    ({e,pt}=qBossAt(0,1));loot=[];PTY.support('qa_peer',pt.r,SPELLS.minorheal,200);hurtE(e,e.hp+10,{el:'fire'});qOk(items()===solo+1,'치유로 도운 동료가 기여로 안 셈');out.push('치유 기여 인정');qPtyOff();
    // 참가자 쪽: kill 메시지의 co에 내 id가 있으면 한 번 더
    pt=qPty(2);NET.guest=true;loot=[];netOnKill({id:987654,k:DG.d.boss,x:Math.round(P.x),y:Math.round(P.y),l:DG.lvl,el:0,a:netArea(),co:['qa_me','qa_peer']});const g1=items();
    loot=[];netOnKill({id:987655,k:DG.d.boss,x:Math.round(P.x),y:Math.round(P.y),l:DG.lvl,el:0,a:netArea()});const g0=items();qOk(g1===g0+1,`참가자 협동 ${g1} / 보통 ${g0}`);out.push(`참가자 ${g0}→${g1}`)}finally{Object.assign(JUNK21,jk21);DROP24=d24;qPtyOff();if(DG)leaveDungeon()}
  return out.join(' · ')});
qT('파티 v18','쌍둥이 준보스: 둘을 10초 안에 함께 쓰러뜨리면 보너스 상자(늦으면 없음)',()=>{const out=[];const jk21=Object.assign({},JUNK21);JUNK21[0]=JUNK21[1]=1;const d24=DROP24;DROP24=0;/* v24: 덤 한 개(1/5 난수)는 이 점검의 개수와 무관 *//* v21: 잡템 줄이기(난수)와 무관 */
  try{for(const late of [0,1]){qEnter(DUNGEONS[0]);P.invT=1e9;const ms=enemies.filter(o=>TYPES[o.k].mini);qOk(ms.length===2,'준보스 둘이 아님');
      loot=[];hurtE(ms[0],ms[0].hp+10,{el:'fire'});const n1=loot.filter(l=>l.kind==='item').length;if(late)DG.tw[ms[0].k]=time-11;loot=[];hurtE(ms[1],ms[1].hp+10,{el:'fire'});const n2=loot.filter(l=>l.kind==='item').length;
      qOk(late?n2===n1&&!ms[1].tw:n2===n1+2&&ms[1].tw,`${late?'늦게':'함께'}: 아이템 ${n1}→${n2}`);out.push(`${late?'11초 차':'함께'} ${n2}`);leaveDungeon()}}finally{Object.assign(JUNK21,jk21);DROP24=d24;if(DG)leaveDungeon()}
  return out.join(' · ')});
qT('파티 v18','한 명 지원 마법: 고른 동료에게만(시전 메시지 tg), 안 골랐거나 멀면 나에게, 받는 쪽은 tg가 나일 때만',()=>{qPrep('priest');P.invT=1e9;const out=[];
  try{const {r,sent}=qPty(2,{dx:120});const ones=qSpells('priest',s=>s.one&&!s.job2&&!s.job3);qOk(ones.length>=8,`한 명 마법 ${ones.length}개`);for(const s of ones)P.sk[s.id]=10;P.sk.kings=10;
    PTY.sel('qa_peer');qOk(PTY.tgt==='qa_peer','동료를 못 고름');
    P.hp=Math.round(maxHp()*.3);let h0=P.hp;sent.length=0;FXB.fx=[];qCast('minorheal');let m=sent.find(m=>m.t==='cast'&&m.sp==='minorheal');
    qOk(m&&m.tg==='qa_peer','시전 메시지에 tg 없음');qOk(P.hp<h0+5,'동료에게 걸었는데 내가 나음');qOk(FXB.fx.some(f=>f.o===r),'동료에게 걸리는 순간 효과 없음');out.push('동료에게 tg');
    sent.length=0;qCast('greaterheal');m=sent.find(m=>m.t==='cast'&&m.sp==='greaterheal');qOk(m&&m.tg==='qa_peer','시전 시간 마법(대치유)에 tg 없음');
    sent.length=0;qCast('blessing');qOk(!P.buffs.blessing&&PUI.has(r,SPELLS.blessing),'축복이 동료 대신 나에게 / 동료 기록 없음');
    r.x=r.tx=P.x+2000;sent.length=0;P.hp=Math.round(maxHp()*.3);h0=P.hp;qCast('minorheal');m=sent.find(m=>m.t==='cast'&&m.sp==='minorheal');qOk(P.hp>h0&&m&&m.tg==null,'멀면 나에게 걸려야 함');
    qOk(/멀어/.test($('#log').textContent),'멀 때 알림 없음');out.push('멀면 나에게(알림)');r.x=r.tx=P.x+120;
    PTY.sel(null);sent.length=0;P.hp=Math.round(maxHp()*.3);h0=P.hp;qCast('minorheal');m=sent.find(m=>m.t==='cast'&&m.sp==='minorheal');qOk(P.hp>h0&&m&&m.tg==null,'안 골랐는데 나에게 안 걸림');
    PTY.sel('qa_peer');sent.length=0;qCast('kings');m=sent.find(m=>m.t==='cast'&&m.sp==='kings');qOk(m&&m.tg==null&&P.buffs.kings,'파티(주변) 마법이 한 명으로 감');
    // 받는 쪽: 동료가 고른 사람이 나일 때만
    const bad=[];for(const s0 of ones){qClear();P.hp=Math.round(maxHp()*.3);P.mp=Math.round(maxMp()*.3);const hp0=P.hp;const got=()=>P.hp>hp0+maxHp()*.015||!!P.hot||P.shield>0||!!P.ward||Object.keys(P.buffs).length>0;
      netGhostCast({from:'qa_peer',sp:s0.id,L:10,x:Math.round(P.x),y:Math.round(P.y),pw:200,tg:'qa_peer2'});qStep(2,{render:false});if(got())bad.push(s0.id+' 남에게 간 것이 나에게');
      qClear();P.hp=hp0;netGhostCast({from:'qa_peer',sp:s0.id,L:10,x:Math.round(P.x),y:Math.round(P.y),pw:200});qStep(2,{render:false});if(got())bad.push(s0.id+' tg 없는(옛) 시전이 나에게');
      qClear();P.hp=hp0;netGhostCast({from:'qa_peer',sp:s0.id,L:10,x:Math.round(P.x),y:Math.round(P.y),pw:200,tg:'qa_me'});qStep(2,{render:false});if(!got())bad.push(s0.id+' 나에게 온 것이 안 걸림')}
    qOk(!bad.length,bad.slice(0,5).join(' / '));out.push(`받기 ${ones.length}종`);return out.join(' · ')}finally{qPtyOff()}});
qT('파티 v18','표시: 「파티(주변)」·「한 명」·「자신만」 세 가지가 트리·자세히·단축칸·수치표에 맞게',()=>{qPrep('priest');const bad=[];
  const want={kings:'area',renew:'area',prayerheal:'area',salvation:'area',kyrie:'area',aegis:'area',agiup:'area',benediction:'area',barrier:'area',
    minorheal:'one',closewounds:'one',greaterheal:'one',regeneration:'one',lightward:'one',divineshield:'one',guardianspirit:'one',painsup:'one',impositio:'one',blessing:'one',
    inviolable:'self',returnmiracle:'self',wisdom:'area'};
  for(const id in want){const r=PUI.rule(SPELLS[id]);if(!r){bad.push(id+' 표시 없음');continue}if(r.mode!==want[id])bad.push(`${id}: ${r.mode}≠${want[id]}`)}
  for(const t of [2,3,4])for(const s of qSpells('priest',s=>TREE[s.id]===t&&s.kind!=='passive'&&PUI.SUPK.has(s.kind)))if(!PUI.rule(s))bad.push(s.id+' 규칙 없음');
  qOk(!bad.length,bad.join(', '));const L={area:'파티(주변)',one:'한 명',self:'자신만'};
  for(const [id,m] of [['kings','area'],['minorheal','one'],['inviolable','self']]){const b=PUI.badge(SPELLS[id],'ptb');qOk(b.includes('>'+L[m]+'<'),`${id} 배지 ${b.slice(0,80)}`);
    qOk(detailHtml(id).includes('「'+L[m]+'」'),`${id} 자세히 보기에 「${L[m]}」 없음`);qOk(numsAt(id,1)[0][0]==='대상'&&numsAt(id,1)[0][1].startsWith(L[m]==='파티(주변)'?'파티(주변)':L[m]==='한 명'?'한 명':'자신만'),`${id} 수치표 ${numsAt(id,1)[0]}`)}
  qOk(!/파티원에게도 걸립니다/.test(SPELLS.guardianspirit.desc)&&/50%/.test(SPELLS.guardianspirit.desc)&&eff('guardianspirit',1).healUp===.5,'수호 천사 설명·수치');qOk(eff('painsup',1).dur>=10&&SPELLS.impositio.dmg===.25,'고통 억제·임포지티오 수치');
  P.sk.minorheal=1;P.sk.kings=1;P.bar[0]='minorheal';P.bar[1]='kings';buildBar();qOk($('#bar [data-slot="0"] .ptm.o')&&/\[한 명\]/.test($('#bar [data-slot="0"]').title),'단축칸 한 명 표시');qOk($('#bar [data-slot="1"] .ptm.p'),'단축칸 파티 표시');
  openPanel('tree');const txt=[];for(let t=0;t<CLASSES.priest.trees.length;t++){treeSel=t;renderPanel();txt.push(...[...pbody.querySelectorAll('.node .ptb')].map(b=>b.textContent))}closePanel();// v19: 머무는 치유가 리뉴로 합쳐져 치유 나무에는 「자신만」이 없음 → 사제 나무 전체에서qOk(txt.includes('한 명')&&txt.includes('파티(주변)')&&txt.includes('자신만'),`트리 배지 ${[...new Set(txt)]}`);
  return '파티(주변) · 한 명 · 자신만'});
qT('파티 v18','대상 고르기: 파티 창 동료 칸 누르기 · 화면의 동료 누르기(마법 안 나감) · Tab으로 돌아가며, 고른 동료 표시',()=>{qPrep('priest');P.invT=1e9;
  try{const {r}=qPty(3,{dx:140});PUI.tick(true);let f=$('#pframes .pf[data-pid="qa_peer"]');qOk(f,'동료 칸에 data-pid 없음');
    f.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));qOk(PTY.tgt==='qa_peer','동료 칸을 눌러도 안 고름');PUI.tick(true);qOk($('#pframes .pf.sel[data-pid="qa_peer"]'),'고른 칸 표시 없음');
    $('#pframes .pf[data-pid="qa_peer"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));qOk(!PTY.tgt,'다시 눌러도 안 풀림');
    qKey('Tab');const a=PTY.tgt;qKey('Tab');const b=PTY.tgt;qKey('Tab');qOk(a&&b&&a!==b&&!PTY.tgt,`Tab 순환 ${a}→${b}→${PTY.tgt}`);
    render();const s=r._s;qOk(s,'동료가 안 그려짐');const c=cv.getBoundingClientRect();mouse.l=false;
    cv.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:c.left+s.x,clientY:c.top+s.y-40,pointerType:'mouse',button:0}));qOk(PTY.tgt==='qa_peer'&&!mouse.l,`화면의 동료 누르기 tgt ${PTY.tgt} mouse.l ${mouse.l}`);
    render();qOk(qNum(r._s.x),'그리기');return '칸 · 화면 · Tab'}finally{mouse.l=false;qPtyOff();PUI.tick(true)}});
/* ===== 11c. v18 그림 (ART): 전사·궁수 영웅 · 스킬 아이콘 · 무기 아이콘 · 물리 효과 ===== */
const qBlank=(cv,min)=>{const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>16)n++;return n<(min||40)};
qT('v18 그림','전사·궁수 스킬 아이콘: 모든 새 스킬이 자기 그림(ICP)을 가지고 비어 있지 않으며 서로 다름',()=>{const ids=Object.keys(SPELLS).filter(id=>SPELLS[id].cls==='warrior'||SPELLS[id].cls==='archer'),bad=[],seen=new Map();
  for(const id of ids){const s=SPELLS[id];if(!ICP[id]){bad.push(id+': ICP 없음');continue}const svg=spellIcon(s),body=ICP[id]({c:'#e8c8b0',hi:'#fff4e0',r:'#a03028',dk:'#2a1410'});
    if(typeof svg!=='string'||!svg.includes('ip'+id)||!/<(path|circle|ellipse|polygon|rect|line)/.test(body)||body.length<60)bad.push(id+': 빈 그림');
    if(seen.has(body))bad.push(id+'='+seen.get(id));seen.set(body,id)}
  qOk(ids.length>=95,`새 스킬 ${ids.length}개`);qOk(!bad.length,bad.slice(0,6).join(', '));return `${ids.length}개 · 모두 다름`});
qT('v18 그림','전사·궁수 영웅: 두 무기 갈래 × 가만히·걷기·공격 동작 × 8방향을 NaN·오류 없이 그림 · 게임 안 P 그리기',()=>{const cv=document.createElement('canvas');cv.width=120;cv.height=150;const g=cv.getContext('2d'),bad=[];let n=0;
  const V={warrior:[[{staff:{rar:2,wt:'sword'},off:{rar:3,wt:'shield'}},['idle','walk','swing','swing2','slam','bash','guard','spin','shout','cast']],[{staff:{rar:4,wt:'polearm'}},['idle','walk','thrust','sweep','slam','spin','cast']],[{},['idle','swing']]],
    archer:[[{staff:{rar:2,wt:'bow'},off:{rar:2,wt:'quiver'}},['idle','walk','draw','release','volley','shout','cast']],[{staff:{rar:5,wt:'xbow'},off:{rar:1,wt:'quiver'}},['idle','walk','draw','release','volley']],[{},['idle','draw']]]};
  for(const cls in V)for(const [gear,poses] of V[cls])for(const p of poses)for(let d=0;d<8;d++){g.clearRect(0,0,120,150);
    try{const r=drawHeroClass(g,cls,gear,p,60,130,1,.37+d*.2,d);n++;if(!r||!qNum(r.gx)||!qNum(r.gy))bad.push(`${cls}/${p}/${d}: ${r&&r.gx},${r&&r.gy}`);else if(d===2&&qBlank(cv,400))bad.push(`${cls}/${p}: 빈 그림`)}catch(e){bad.push(`${cls}/${p}/${d}: ${e.message}`)}}
  qOk(!bad.length,bad.slice(0,5).join(' | '));
  for(const cls of ['warrior','archer']){qPrep(cls);const e=qDummy(P.x+90,P.y);for(const pose of cls==='warrior'?['swing','thrust','bash']:['release','draw']){heroAtk(P,pose,.3);qStep(6,{render:true});qOk(P._s&&qNum(P._s.x)&&qNum(P._s.y),`${cls} ${pose}: 화면 위치`)}}
  qClear();return `${n}장 · 두 직업 · 게임 안 그리기`});
qT('v18 그림','무기·보조 장비 아이콘: 8종 × 8단계 + v18 고유·세트가 ART 그림으로(임시 그림 아님), 비어 있지 않음, 새 장비는 b/ 키',()=>{const bad=[];let n=0;const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d');
  const paint=(key,want)=>{const sp=iconSpec(key);if(sp.paint==='v18ph'||(want&&sp.paint!==want)){bad.push(key+': '+sp.paint);return}g.clearRect(0,0,64,64);g.save();try{IPAINT[sp.paint](g,sp.o)}catch(e){bad.push(key+': '+e.message)}g.restore();n++;if(qBlank(cv,300))bad.push(key+': 빈 그림')};
  for(const w in BASE_V18)for(let i=0;i<8;i++)paint(`b/${w}/${i}`,w);
  for(const u of UNIQ_V18.concat(BOSSU_V18))paint('u/'+u.n);for(const sid in SETS_V18)for(const sl in SETS_V18[sid].p)paint(`s/${sid}/${sl}`);
  for(const w in BASE_V18){const it=makeBaseV18(w,30,WT[w].cls||null,1);qOk(/^b\//.test(itemIconKey(it)),`${w}: 키 ${itemIconKey(it)}`)}
  qOk(!bad.length,bad.slice(0,6).join(', '));return `${n}개`});
qT('v18 그림','물리 효과: 모든 전사·궁수 기술을 써서 그려도 오류 없음 · 휘두르기 자국·덫·우리·매/늑대 · 임시 그림(clsDraw) 꺼짐 · 입자 한도',()=>{const bad=[];let n=0;
  qOk(typeof PFX==='object'&&!/swings/.test(String(PFX.swing))&&!/arc\(/.test(String(clsDraw)),'PFX·clsDraw가 바뀌지 않음');
  for(const cls of ['warrior','archer']){qPrep(cls);P.invT=1e9;
    for(const id in SPELLS){const s=SPELLS[id];if(s.cls!==cls||s.kind==='passive')continue;qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;const e=qDummy(P.x+120,P.y+20);P.sk[id]=10;if(typeof clsGearFor==='function')clsGearFor(id);P.face=0;
      FXP.fx.length=0;try{qCast(id,{x:e.x,y:e.y});if(s.kind==='melee'&&!FXP.fx.some(f=>/slash|thrust|bash/.test(f.k)))bad.push(id+': 휘두르기 자국 없음');qStep(6,{render:false,renderEvery:2});n++}catch(err){bad.push(id+': '+err.message)}if(parts.length>Q.pcap+40)bad.push(id+`: 입자 ${parts.length}`)}}
  qOk(!bad.length,bad.slice(0,6).join(' | '));
  // 덫: 준비 → 터짐(짐승 우리는 닫힌 우리) · 사냥 동료
  qPrep('archer');P.invT=1e9;for(const id of ['firetrap','beastcage']){qClear();traps.length=0;FXP.fx.length=0;const e=qDummy(P.x+160,P.y);P.sk[id]=10;qCast(id,{x:e.x,y:e.y});
    qOk(traps.length===1&&traps[0].age<traps[0].arm,`${id}: 덫이 안 놓임`);qStep(120,{render:true,until:()=>!traps.length});qStep(2,{render:true});qOk(!traps.length,`${id}: 안 터짐`);
    qOk(id==='beastcage'?FXP.fx.some(f=>f.k==='cagec'):rings.length||FXP.fx.some(f=>f.k==='shout'),`${id}: 터짐 효과 없음`)}
  qClear();P.sk.falcon=10;qCast('falcon',{x:P.x+80,y:P.y});qStep(20,{render:true});const a=allies.find(a=>a.s&&a.s.form==='falcon');qOk(a&&a._s&&FXP.pet(a,a._s)===true,'매 그림');
  // 같이 하기: 동료(전사·궁수)의 유령 시전 · 대신 맞기 끈
  try{let g=0;for(const [cls,gear,ids] of [['warrior',{staff:{rar:2,wt:'sword'},off:{rar:2,wt:'shield'}},['slash','crossslash','shieldcharge','leapsmash','taunt','guardlink']],['archer',{staff:{rar:2,wt:'bow'},off:{rar:1,wt:'quiver'}},['quickshot','fanshot','arrowrain','firetrap','evaderoll']]]){
      qClear();const r=qPeerOn();Object.assign(r,{cls,gear},{x:P.x+80,tx:P.x+80,y:P.y,ty:P.y});const e=qDummy(P.x+260,P.y);
      for(const id of ids){netGhostCast({from:'qa_peer',sp:id,L:10,x:e.x,y:e.y});qStep(4,{render:true});g++}
      r.lk=NET.id;P.lnkOut={id:'qa_peer',t:5,max:5,share:.3};qStep(3,{render:true});P.lnkOut=null}
    n+=g}catch(err){qOk(0,'유령 시전: '+err.message)}finally{P.lnkOut=null;qPeerOff()}
  try{FXP.sheet(1)}catch(err){qOk(0,'효과 견본표: '+err.message)}qClear();return `${n}번 시전(동료 유령 포함) · 덫 · 매`});
/* ===== 11c. v18 월드 확장 (WORLD): 새 지역 5곳 · 지역 던전 24곳 · 새 몬스터 97종 · 2막 · 지역 마을 의뢰 60개 · 마을 사람 자리 ===== */
const qWxReach=id=>{const L=RCACHE[id];return{L,ok:typeof terrReach==='function'?terrReach(id):wxReach(L.lq,L.town.x,L.town.y)}};// v18 OPT: 물 + 절벽(terrWall)
const qWxTo=(id,x,y)=>{if(REG.id!==id)switchRegion(id,null,null,true);if(x!=null){P.x=x;P.y=y;followCam()}};
qT('월드','지역 순서: 옛 7곳 그대로 + 새 5곳 끝에 (같이 하기 지역 번호)',()=>{const old=['plains','forest','desert','ice','jungle','lava','sea'],nw=Object.keys(WX_REGIONS);
  qOk(REG_IDS.slice(0,7).join()===old.join(),`앞 7곳 ${REG_IDS.slice(0,7)}`);qOk(REG_IDS.slice(7,7+nw.length).join()===nw.join(),`뒤 ${REG_IDS.slice(7)}`);
  for(const id of nw){qOk(RCACHE[id]&&RCACHE[id].town,`${id} 땅 없음`);qOk(WPOS[id],`${id} 세계 지도 자리 없음`)}
  for(const a in REGIONS)for(const s in REGIONS[a].edges){const b=REGIONS[a].edges[s];qOk(REGIONS[b]&&REGIONS[b].edges[OPP[s]]===a,`${a}.${s}→${b} 되돌아오는 포탈 없음`)}
  return REG_IDS.map((id,i)=>`${id}:${-(10+i)}`).join(' ')});
for(const id of Object.keys(WX_REGIONS))qT('월드',`새 지역 ${WX_REGIONS[id].n}: 마을 · 들판 몬스터 · 그리기 NaN 없음`,()=>{qPrep('mage',{lvl:60});P.invT=1e9;switchRegion(id);
  qOk(TOWNS[0].id===WX_REGIONS[id].town.id,`마을 ${TOWNS[0].id}`);qOk(CAVES.length===WX_DUNGEONS.filter(d=>d.reg===id).length,`동굴 ${CAVES.length}`);
  const T=TOWNS[0];P.x=T.x;P.y=T.y+120;qStep(30,{renderEvery:6});
  const p=qFreeAt(T.x+(REG.lair.x-T.x)*.45,T.y+(REG.lair.y-T.y)*.45,0,0)||qFreeAt(REG.lair.x,REG.lair.y,500,0);P.x=p.x;P.y=p.y;followCam();
  for(let i=0;i<10;i++)spawnEnemy();qStep(120,{renderEvery:12,each:()=>{P.hp=maxHp();P.invT=1e9}});const ks=[...new Set(enemies.map(e=>e.k))];qOk(ks.length,'몬스터가 안 나옴');
  const bad=ks.filter(k=>!REGIONS[id].mobs.includes(k)&&k!==REGIONS[id].boss&&!(TYPES[REGIONS[id].boss]||{}).summon);qOk(!bad.length,`다른 지역 몬스터 ${bad}`);
  loadRegion('home');return `몬스터 ${ks.map(k=>TYPES[k].n).join('·')}`});
qT('월드','12개 지역: 포탈 · 동굴 · 둥지 · 채집 자리에서 마을까지 걸어서 닿음 (물/용암 + 절벽 격자 BFS)',()=>{const bad=[];let n=0;
  for(const id of REG_IDS){const {L,ok}=qWxReach(id),pts=[...L.edges.map(e=>['포탈 '+e.side,e]),...L.caves.map(c=>['동굴 '+c.cave.n,c]),...(L.lair?[['둥지',L.lair]]:[])/* v26 왕도는 둥지 없음 */,...Object.keys(L.spots||{}).flatMap(s=>L.spots[s].map((p,i)=>[s+'#'+i,p]))];
    for(const [nm,p] of pts){n++;if(!wxCanReach(ok,p.x,p.y))bad.push(`${id} ${nm}`)}}
  qOk(!bad.length,'못 닿음: '+bad.slice(0,8).join(', '));return `${n}곳`});
for(const D of WX_DUNGEONS)qT('월드',`지역 던전 ${D.n} (${REGIONS[D.reg].n}): 들어가기 · 보스 · 처치 · 빛나는 문 → 같은 지역 동굴 앞`,()=>{qPrep('mage',{lvl:Math.max(40,D.lvl)});P.invT=1e9;qWxTo(D.reg);
  const c=CAVES.find(c=>c.cave===D);qOk(c,'동굴 없음');qOk(!blockedAt(c.x,c.y+40),'동굴 앞이 물/용암');
  qOk(qActAt(c.x,c.y+40)==='dungeon'&&actCave===c,`입구 act=${act}`);doAct();qOk(DG&&DG.d===D,'못 들어감');qOk(REG.id===D.reg,'지역이 바뀜');
  const bs=enemies.filter(e=>TYPES[e.k].boss),ms=enemies.filter(e=>TYPES[e.k].mini);qOk(bs.length===1&&bs[0].k===D.boss,`보스 ${bs.map(e=>e.k)}`);qOk(ms.length===2&&D.minis.every(k=>ms.some(e=>e.k===k)),`준보스 ${ms.map(e=>e.k)}`);
  qOk(enemies.filter(e=>!TYPES[e.k].boss&&!TYPES[e.k].mini).every(e=>D.mobs.includes(e.k)),'다른 졸개');P.invT=1e9;qStep(20,{renderEvery:10});
  const e=DG.boss,n0=DG.portals.length;loot=[];hurtE(e,e.hp+10,{el:'arcane'});qOk(e.dead&&DG.bossDead,'보스가 안 쓰러짐');qOk(DG.portals.length===n0+1,'빛나는 문이 안 생김');
  {const its=loot.filter(l=>l.kind==='item');qOk(its.length>=2&&its.length<=3&&its[0].item.rar>=3,`전리품 ${its.map(l=>l.item.rar)} (첫 개는 유니크·세트 이상 · v21: 셋째 덤은 잡템이면 줄 수 있음)`)}const ex=DG.portals[DG.portals.length-1];
  qOk(qActAt(ex.x,ex.y)==='exit',`빛나는 문 act=${act}`);doAct();qOk(!DG,'안 나옴');qOk(REG.id===D.reg,`나온 지역 ${REG.id}`);
  qOk(Math.abs(P.x-c.x)<1&&Math.abs(P.y-(c.y+80))<1,`나온 자리 (${Math.round(P.x)},${Math.round(P.y)})`);qStep(3);loadRegion('home');return `Lv${D.lvl} ${TYPES[D.boss].n}`});
qT('월드','새 몬스터 97종: 그리기 · 이동 · 공격에 NaN 없음',()=>{qPrep('mage',{lvl:60});const ks=Object.keys(WX_TYPES),bad=[];qOk(ks.filter(k=>typeof WX21_TYPES==='undefined'||!WX21_TYPES[k]).length===97,`${ks.length}종`);let hit=false;const keepHit=hitPlayer;
  try{hitPlayer=function(){hit=true};
    for(const k of ks){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();const t=TYPES[k];qOk(MON[t.draw],`${k}: 그림 ${t.draw} 없음`);
      const e=dgMob(k,P.x+(t.ranged?620:240),P.y+40,t.min||40);e.aggroed=true;const x0=e.x,y0=e.y;hit=false;let shot=false,moved=false;
      qStep(480,{render:false,each:i=>{if(projs.some(p=>p.owner==='e')||warns.length)shot=true;if(Math.hypot(e.x-x0,e.y-y0)>4)moved=true;P.hp=maxHp();if(i%60===0)render()},until:()=>(hit||shot)&&moved});
      render();if(!moved&&t.spd>0)bad.push(k+' 안 움직임');if(!hit&&!shot)bad.push(k+' 공격 안 함')}}
  finally{hitPlayer=keepHit}
  qClear();qOk(!bad.length,bad.slice(0,8).join(', '));return `${ks.length}종`});
qT('월드','새 몬스터 97종: 공격 마법이 맞는다 (볼트 전부 + 표본 범위 마법)',()=>{const ks=Object.keys(WX_TYPES),bad=[];let n=0;
  for(const cls of ['mage','priest']){qPrep(cls,{lvl:60});const sp=qSpells(cls,s=>isDmg(s)&&s.kind==='bolt')[0],area=qSpells(cls,s=>isDmg(s)&&['nova','rain','chain','strike'].includes(s.kind));
    for(let i=0;i<ks.length;i++){const k=ks[i],list=[sp,...(i%19===0?area.slice(0,3):[])];
      for(const s0 of list){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.sk[s0.id]=10;followCam();const s=eff(s0.id,10),d=s0.kind==='nova'?s.rad*.5:220;
        const e=dgMob(k,P.x+d,P.y+20,40);e.hp=e.max=1e7;e.stunT=1e9;e.atkCd=1e9;const h0=e.hp;
        if(!qCast(s0.id,{x:e.x,y:e.y})){bad.push(`${cls}/${s0.id}→${k} 시전 안 됨`);continue}
        qStep(Math.ceil(qMaxT(s)*60),{render:false,each:()=>{P.mp=maxMp();P.hp=maxHp()},until:()=>e.hp<h0});n++;if(!(e.hp<h0))bad.push(`${cls}/${s0.id}→${k}`)}}}
  qClear();qOk(!bad.length,'안 맞음: '+bad.slice(0,8).join(', '));return `${n}번 시전`});
qT('월드','2막: 1막을 마친 저장(q.i=12)에서 첫 의뢰 · 저장 → 불러오기 뒤 진행이 같음',()=>{qPrep('mage',{lvl:30});qOk(QUESTS.length===12+WX_ACT2.length&&QUESTS[12]===WX_ACT2[0],`의뢰 ${QUESTS.length}`);
  P.q={i:12,st:0,c:{}};const q=qCur();qOk(q===WX_ACT2[0],'2막 첫 의뢰가 아님');const tg=qMainTargetW(),T0=ALLTOWNS.find(t=>t.id===q.town),np=T0.npc||(typeof tw22MainTarget==='function'?tw22MainTarget(q.town):null);/* v22 TOWN: 아르덴 의뢰인은 마법원 안 엘리안 · v26 왕도 지도 */qOk(tg&&tg.reg===(T0.reg||'home')&&np&&Math.hypot(tg.x-np.x,tg.y-np.y)<1,'첫 목표가 의뢰인이 아님');
  const hb=qHudBlock();qOk(hb&&hb.t.replace(/<[^>]+>[^<]*<\/i>/,'').startsWith('2막'),`알림판 ${hb&&hb.t}`);questTalk(ALLTOWNS.find(t=>t.id===q.town));qOk(pbody.innerHTML.includes('data-qacc'),'의뢰 받기 버튼 없음');qClick('#pbody [data-qacc]');closePanel();
  qOk(P.q.i===12&&P.q.st===1,'받기 실패');questTalk(qTw(q.goals[0].town));closePanel();qOk(P.q.st===2,'베른과 이야기 → 완료 아님');
  const keep=JSON.stringify(P.q),d=JSON.parse(JSON.stringify(saveData()));qPrep('priest',{slot:6});qOk(load(d,QA_SLOT),'load 실패');qOk(JSON.stringify(P.q)===keep,`불러온 진행 ${JSON.stringify(P.q)} ≠ ${keep}`);
  qOk(qCur()===WX_ACT2[0],'불러온 뒤 의뢰가 다름');loadRegion('home');return `${q.t} → 저장 왕복 같음`});
qT('월드','2막 13개를 차례로 끝까지: 목표 자리가 늘 있고 닿으며, 끝나면 일지·의뢰 창 제목이 2막',()=>{qPrep('mage',{lvl:60});P.q={i:12,st:0,c:{}};const r=[];
  const reach=tg=>{if(!tg)return false;if((tg.reg||'home')==='home')return true;const {L,ok}=qWxReach(tg.reg);if(tg.cave!=null&&tg.cave>=0&&!L.caves[tg.cave])return false;return wxCanReach(ok,tg.x,tg.y)};
  for(let i=12;i<QUESTS.length;i++){const q=qCur();qOk(q===QUESTS[i],`${i}번째가 아님`);qOk(reach(qMainTargetW()),`${q.t}: 받을 자리 없음`);
    questTalk(ALLTOWNS.find(t=>t.id===q.town));closePanel();questAccept();qOk(P.q.st===1,`${q.t}: 못 받음`);
    q.goals.forEach((g,j)=>{if(qGoalDone(q,j))return;const tg=qMainTargetW();qOk(reach(tg),`${q.t}: 목표 ${g.d} 자리 없음/못 닿음 ${JSON.stringify(tg)}`);
      if(g.type==='talk'){questTalk(qTw(g.town));closePanel()}
      else for(let k=0;k<5000&&!qGoalDone(q,j);k++)questKill({k:g.k[0],x:P.x,y:P.y,r:20})});
    qOk(P.q.st===2,`${q.t}: 목표를 다 했는데 완료 아님`);qOk(reach(qMainTargetW()),`${q.t}: 보고 자리 없음`);questTalk(ALLTOWNS.find(t=>t.id===qTurnTown(q)));qClick('#pbody [data-qdone]');closePanel();r.push(q.t)}
  qOk(!qCur(),'다 끝났는데 의뢰가 남음');qTown=HOME.towns[0];const h=questHtml();qOk(h.includes('2막 「갈라진 문」까지'),'의뢰 창 끝 글이 1막 그대로');
  qOk(sqLogHtml().includes('2막'),'일지 제목이 2막이 아님');return `${r.length}개`});
qT('월드','지역 의뢰: 선행(req) 전엔 잠김 · 끝나면 열림 · 채집 자리 캐기 → 완료',()=>{qPrep('mage',{lvl:60});const s=sqState(),g1=SQBY.gm1,g2=SQBY.gm2;qOk(g2.req==='gm1','견본 바뀜');
  qOk(sqAvail(g2)==='locked',`gm2 ${sqAvail(g2)}`);sqAccept('gm1');qOk(s.a.gm1,'gm1 못 받음');sqProgress(g1,0,g1.goals[0].n,true);sqFinish('gm1');qOk(s.d.gm1===1,'gm1 안 끝남');
  qOk(sqAvail(g2)==='ok',`gm2 ${sqAvail(g2)}`);sqAccept('gm2');qOk(s.a.gm2,'gm2 못 받음');const tg=sqTarget(g2);qOk(tg&&tg.reg==='plains'&&tg.spots==='gm_reed',`목표 ${JSON.stringify(tg)}`);
  qWxTo('plains');const sp=decor.filter(d=>d.use==='gm_reed');qOk(sp.length>=g2.goals[0].n,`자리 ${sp.length}`);const ok=wxReach(LQ,TOWNS[0].x,TOWNS[0].y);
  for(const d of sp){qOk(wxCanReach(ok,d.x,d.y),'못 닿는 채집 자리');const L=sqUseLive(d);if(sqAllDone(g2))break;qOk(L&&/캐기|줍기/.test(L.label),`라벨 ${L&&L.label}`);P.x=d.x;P.y=d.y+30;qStep(1,{render:false});
    qOk(act==='tw_use'||sqUseLive(d),'채집 자리 act 없음');sqUse(d)}
  qOk(sqAllDone(g2),'채집이 안 끝남');const m=sqMarks(false);qStep(2);loadRegion('home');return `자리 ${sp.length}곳 · 표시 ${m.length}`});
qT('월드','지역 마을 의뢰 60개: 주는 사람 · 받는 사람이 마을에 있고, 목표 자리가 있고 닿음 (던전/둥지/채집)',()=>{qPrep('mage',{lvl:60});qOk(WX_SQ.length===60,`${WX_SQ.length}개`);const bad=[],kinds={};
  for(const q of WX_SQ){const T=ALLTOWNS.find(t=>t.id===q.town);if(!T){bad.push(q.id+' 마을 없음');continue}kinds[q.kind]=(kinds[q.kind]||0)+1;
    {const f=sqFolk(q.giver),g=sqFolk(sqTurn(q));if(!f||f.town!==T)bad.push(`${q.id}: 주는 사람 ${q.giver} 없음`);if(!g||!ALLTOWNS.includes(g.town))bad.push(`${q.id}: 받는 사람 ${sqTurn(q)} 없음`)}
    const s=sqState();if(q.req)s.d[q.req]=1;s.a={};qOk(sqAvail(q)==='ok',`${q.id} ${sqAvail(q)}`);sqAccept(q.id);
    q.goals.forEach((g,j)=>{if(j>0)for(let k=0;k<j;k++)sqProgress(q,k,99,true);const tg=sqTarget(q);if(!tg){bad.push(`${q.id} 목표${j} 자리 없음`);return}
      if(tg.reg&&tg.reg!=='home'){const {L,ok}=qWxReach(tg.reg);if(!wxCanReach(ok,tg.x,tg.y))bad.push(`${q.id} 목표${j} 못 닿음`);if(tg.cave!=null&&!(L.caves[tg.cave]&&[...L.caves[tg.cave].cave.minis,L.caves[tg.cave].cave.boss,...L.caves[tg.cave].cave.mobs].some(k=>(g.k||[]).includes(k))))bad.push(`${q.id} 동굴 표시가 다름`)}
      if(g.type==='gather'&&(SQSPOT[g.use]||[]).length<g.n)bad.push(`${q.id} 채집 자리 ${(SQSPOT[g.use]||[]).length}<${g.n}`)});
    if(q.kind==='던전'&&!q.goals.some(g=>g.k&&WX_DUNGEONS.some(d=>[d.boss,...d.minis].some(k=>g.k.includes(k)))))bad.push(q.id+' 던전 의뢰인데 던전 목표 아님');s.a={};s.d={}}
  qOk(!bad.length,bad.slice(0,8).join(' / '));return Object.entries(kinds).map(([k,n])=>k+n).join(' ')});
qT('월드','의뢰 종류 글자: 「던전」 · 「토벌」 색 표시 (일지)',()=>{qPrep('mage',{lvl:60});const s=sqState();const a=WX_SQ.find(q=>q.kind==='던전'),b=WX_SQ.find(q=>q.kind==='토벌');qOk(a&&b,'견본 없음');
  for(const q of [a,b]){if(q.req)s.d[q.req]=1;sqAccept(q.id)}const h=sqLogHtml();qOk(h.includes(`color:${WX_KIND['던전']}">던전`),'던전 색 없음');qOk(h.includes(`color:${WX_KIND['토벌']}">토벌`),'토벌 색 없음');P.sq={}});
qT('월드','들판 몬스터 한 대 피해: 12개 지역 모두 FIELD_BUDGET 이하',()=>{const B=FIELD_BUDGET,bad=[];let n=0;
  // 데이터의 dmg는 기준값을 정수로 반올림한 것 (기준 = 상한 ÷ 레벨 배수)
  for(const id of REG_IDS)for(const k of REGIONS[id].mobs||[]){const t=TYPES[k],L=t.min||REGIONS[id].base,hp=40+12*L+4*(10+1.5*(L-1)),mul=1+.18*(L-1);
    const role=t.ranged?'ranged':t.spd>=150?'fast':(t.spd<=80||t.r>=22)?'heavy':'melee',cap=B[role]*hp*(1+Math.max(0,L-B.growFrom)*B.grow)/mul;n++;
    if(t.dmg>Math.round(cap))bad.push(`${id}/${k} ${t.dmg}>${Math.round(cap)}(${role} Lv${L})`)}
  qOk(!bad.length,bad.slice(0,8).join(', '));return `${n}종`});
qT('월드','깊은 던전 보스: 상급 유니크 절반은 그 던전 전용 · 직업에 맞는 것만 · 없으면 원래 굴림 (모든 직업)',()=>{const r=[];
  for(const cls of Object.keys(CLASSES)){qPrep(cls,{lvl:60});const D=WX_DUNGEONS.find(d=>d.id==='ab_throne');qWxTo(D.reg);const c=CAVES.find(c=>c.cave===D);P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.d===D,'못 들어감');
    // 상급 유니크는 보스 3마리 중 1마리꼴(dg.js) → 상급 유니크가 나온 처치만 세어, 그중 절반쯤이 이 던전 전용인지 본다
    const own=wxBossPool(D.id).filter(u=>wxFits(u,cls)),names=new Set(own.map(u=>u.n));let hit=0,rare=0,N=160;const e=DG.boss;QA.reseed(4242);
    for(let i=0;i<N;i++){loot=[];dgBossDrop(e);const its=loot.filter(l=>l.kind==='item');qOk(its.length>=2&&its.length<=3&&its[0].item.rar>=3,'첫 전리품이 유니크·세트 아님');const it=its.find(l=>l.item.rar===5);if(!it)continue;rare++;if(names.has(it.item.name))hit++;
      for(const l of loot)if(l.kind==='item'){const u=BOSSU.find(u=>u.n===l.item.name);if(u&&l.item.rar===5)qOk(wxFits(u,cls),`${cls}: 안 맞는 ${u.n}`)}}
    qOk(BOSSU.length>=WX_BOSSU.length+10,'BOSSU가 줄어듦 (바꿔 끼운 뒤 안 돌아옴)');qOk(rare>=25,`${cls}: 상급 유니크 ${rare}/${N}`);
    if(own.length)qOk(hit>=rare*.25&&hit<=rare*.85,`${cls}: 전용 ${hit}/${rare}`);else qOk(hit===0,'맞는 게 없는데 전용이 나옴');
    leaveDungeon();loadRegion('home');r.push(`${cls} 전용 ${hit}/${rare} (처치 ${N})`)}
  return r.join(' · ')});
qT('월드','지역 던전 안에서 저장 → 그 지역 동굴 앞으로 · 없는 지역은 고향으로',()=>{qPrep('mage',{lvl:50});const D=WX_DUNGEONS.find(d=>d.reg==='canyon');qWxTo('canyon');const c=CAVES.find(c=>c.cave===D);
  P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG,'못 들어감');const d=JSON.parse(JSON.stringify(saveData()));qOk(d.reg==='canyon'&&d.x===c.x&&d.y===c.y+80,`저장 ${d.reg} ${d.x},${d.y}`);leaveDungeon();
  qPrep('priest',{slot:6});qOk(load(d,QA_SLOT),'load 실패');qOk(REG.id==='canyon'&&!DG&&P.x===c.x&&P.y===c.y+80,`불러온 자리 ${REG.id} ${P.x},${P.y}`);qStep(5);
  qOk(load(Object.assign({},d,{reg:'nowhere'}),QA_SLOT),'없는 지역 load 실패');qOk(REG.id==='home','없는 지역 → 고향 아님');loadRegion('home')});
qT('월드','불러온 자리가 물 · 용암 · 건물 안이면 가장 가까운 짝문 앞으로',()=>{const r=[];
  for(const id of ['sea','lava','cliffs','abyss']){qPrep('mage',{lvl:50});const L=RCACHE[id];let w=null;for(let i=0;i<L.lq.length&&!w;i+=7)if(L.lq[i]>.9)w={x:(i%LQN)*LQS,y:((i/LQN)|0)*LQS};if(!w)continue;
    qWxTo(id,L.town.x,L.town.y+100);const d=JSON.parse(JSON.stringify(saveData()));d.x=w.x;d.y=w.y;qOk(load(d,QA_SLOT),'load 실패');qOk(!blockedAt(P.x,P.y),`${id}: 물 위에 남음`);
    qOk(Math.hypot(P.x-TOWNS[0].gate.x,P.y-TOWNS[0].gate.y)<120,`${id}: 짝문 앞이 아님`);r.push(id)}
  qPrep('mage',{lvl:50});const B=TW.blds.home.find(b=>b.k==='bld'&&b.town&&b.town.id==='brenhill');const d=JSON.parse(JSON.stringify(saveData()));d.x=B.x;d.y=B.y;qOk(load(d,QA_SLOT),'load 실패');
  qOk(!wxStuck(P.x,P.y)&&Math.hypot(P.x-B.town.gate.x,P.y-B.town.gate.y)<120,`건물 안 → ${Math.round(P.x)},${Math.round(P.y)}`);r.push('건물');loadRegion('home');return r.join(' · ')});
qT('월드','같이 하기: 지역 던전 구역 번호가 겹치지 않고, 다른 지역의 던전 요청은 방장이 그 지역으로 건너가 그 던전에 (v22: 예전엔 말없이 무시)',()=>{qPrep('mage',{lvl:50});const seen=new Map();
  for(const id of ['home',...REG_IDS]){qWxTo(id);for(let i=0;i<CAVES.length;i++){DG={ci:i};const a=netArea();DG=null;qOk(!seen.has(a),`${id} 동굴${i} 번호 ${a} = ${seen.get(a)}`);seen.set(a,id+i)}qOk(!seen.has(regArea()),'지역 번호와 겹침');}
  const keep={host:NET.host,guest:NET.guest};try{qPeerOn();NET.host=true;loadRegion('home');netOnMsg({t:'req',from:'qa_peer',a:'dungeon',c:0,rg:'plains'});qOk(DG&&REG.id==='plains'&&DG.d===RCACHE.plains.caves[0].cave,'다른 지역(평원) 요청: 평원의 그 던전이 아님(고향 던전이거나 안 들어감)');leaveDungeon();loadRegion('home');
    qWxTo('plains');netOnMsg({t:'req',from:'qa_peer',a:'dungeon',c:0,rg:'plains'});qOk(DG&&DG.d===CAVES[0].cave,'같은 지역 요청으로 못 들어감');const dd=netDgData();qOk(dd.reg==='plains','던전 자료에 지역 없음');leaveDungeon()}
  finally{NET.host=keep.host;NET.guest=keep.guest;qPeerOff();loadRegion('home')}return `구역 ${seen.size}개`});
qT('월드','마을 사람 자리: 모든 마을에서 사람 사이 48 이상 · 건물 발자국 · 문 · 소품에서 떨어짐 · 의뢰인까지 걸어서 닿음',()=>{const r=[],bad=[];
  for(const [L,t] of wxTowns()){const a=wxTownAudit(L,t);if(a.bad.length)bad.push(`${t.id}: ${a.bad.slice(0,3).map(b=>b.join(' ')).join('; ')}`);
    const nd=L.decor.find(d=>d.k==='npc'&&d.town===t);if(nd)qOk(t.npc&&t.npc.x===nd.x&&t.npc.y===nd.y,`${t.id}: t.npc ≠ 의뢰인 그림 자리`);
    for(const p of [t.gate,t.stash,...t.shops].filter(Boolean))qOk(Math.hypot(p.x-t.x,p.y-t.y)<600,`${t.id}: 마을 자리 계약이 멀어짐`);
    {const p=wxGateDrop(L,t);qOk(!wxStuckIn(L,p.x,p.y)&&Math.hypot(p.x-t.gate.x,p.y-t.gate.y)<120,`${t.id}: 짝문 앞 빈자리 없음`)}
    for(const f of L.decor)if(f.k==='tfolk'&&f.town===t&&f.path)for(const p of f.path)qOk(Math.hypot(p.x-t.x,p.y-t.y)<Math.max(720,tSafe(t)-20),`${t.id}/${f.id}: 걷는 길이 마을 밖`);// v22: 넓힌 마을은 안전 지대 안까지
    r.push(`${t.id} ${a.n}`)}
  qOk(HOME.decor.some(d=>d.use==='kegpick'),'넓힌 헤이븐에서 맥주통(kegpick) 자리를 못 찾음');for(const u in SQSPOT)qOk(SQSPOT[u].length,`채집 자리 ${u} 없음`);
  qOk(!bad.length,bad.slice(0,4).join(' / '));const k=WXT.k;qOk(Object.values(k).every(v=>v>=1&&v<=1.2),'넓힘 배율이 1~1.2 밖');
  return r.join(' · ')+` · 넓힘 ${Object.entries(k).filter(([,v])=>v>1).map(([i,v])=>i+'×'+v).join(' ')}`});
qT('월드','마을 사람 겹침: 화면에서 이름표 · 대화(F)가 가장 가까운 사람에게 (붐비는 마을 4곳)',()=>{qPrep('mage',{lvl:60});const r=[];
  for(const t of HOME.towns){const fs=decor.filter(d=>d.k==='tfolk'&&d.town===t&&!d.path&&!d.shopk);let ok=0;
    for(const f of fs){P.x=f.x;P.y=f.y+12;qStep(1,{render:false});if(act==='tw_talk'&&TW.act===f)ok++}
    qOk(ok===fs.length,`${t.id}: ${fs.length}명 중 ${ok}명만 바로 대화됨`);r.push(`${t.id} ${ok}`)}render();return r.join(' · ')});
/* ===== 11c. v18 전사 · 궁수 (CLS): 직업 · 능력치 · 명중 · 막기/회피 · 무기 · 보조 칸 · 옛 저장 · 마나 · 피해 계산 · 장비 · 같이 하기 ===== */
const qMsgs=fn=>{const keep=msg;let got=[];msg=function(t,c){got.push(t);return keep(t,c)};try{fn()}finally{msg=keep}return got};
qT('전사·궁수','새 직업: 시작 화면에 4직업 · 시작 장비(검+방패 / 활+화살통) · 능력치 칸 · 나무 이름 · 캐릭터 창의 보조 칸',()=>{const r=[];
  qPrep('mage');$('#helpBtn').click();const bs=[...document.querySelectorAll('#introBody [data-cls]')].map(b=>b.dataset.cls);$('#intro').hidden=true;paused=false;
  qOk(QCLS.every(c=>bs.includes(c)),`직업 단추 ${bs}`);
  for(const [cls,w,o,main] of [['warrior','sword','shield','str'],['archer','bow','quiver','dex']]){qPrep(cls,{lvl:1});
    qOk(P.gear.staff&&P.gear.staff.wt===w&&P.gear.off&&P.gear.off.wt===o,`${cls} 시작 장비 ${JSON.stringify([P.gear.staff&&P.gear.staff.wt,P.gear.off&&P.gear.off.wt])}`);
    qOk(['str','dex','int','vit','spi'].every(k=>typeof P.st[k]==='number')&&P.st.int===0&&P.st[main]===CLASSES[cls].st5[main],`능력치 ${JSON.stringify(P.st)}`);
    qOk(P.sk[CLASSES[cls].start[0]]===1&&P.bar.includes(CLASSES[cls].start[0]),'기본기가 단축칸에 없음');
    openPanel('char');const h=pbody.innerHTML;qOk(h.includes(SLOT_N.off[cls]+':')||pbody.querySelector('.geq [data-geq="off"]')&&h.includes(SLOT_N.off[cls]),'캐릭터 창에 보조 칸 없음');/* v21: 착용 칸 격자 */qOk(h.includes('<b>힘</b>')&&h.includes('<b>민첩</b>')&&!h.includes('<b>지능</b>'),'능력치 칸(힘·민첩, 지능 없음)');
    qOk(h.includes('명중률')&&h.includes('공격력')&&!h.includes('주문력'),'능력 표(공격력·명중률)');
    openPanel('tree');qOk($('#ptitle').textContent===CLASSES[cls].treeN,`나무 이름 ${$('#ptitle').textContent}`);qOk(pbody.querySelectorAll('[data-node],[data-sp],[data-id]').length>0||pbody.innerHTML.length>500,'스킬 트리가 비어 있음');closePanel();
    for(let t=0;t<4;t++){const ids=qSpells(cls,s=>TREE[s.id]===t);qOk(ids.length>=8,`${CLASSES[cls].trees[t]}: ${ids.length}개`)}
    r.push(`${QCN[cls]}: ${P.gear.staff.name}+${P.gear.off.name}`)}
  return r.join(' · ')});
qT('전사·궁수','능력치: 전사 힘 1점 = 공격력 +1·민첩 +0.3, 궁수는 반대 · 민첩 = 명중 +1 · 활력 = 생명력 · 망각의 물약이 힘·민첩도 돌려줌 · 마법사는 그대로',()=>{const r=[];
  for(const cls of ['warrior','archer']){qPrep(cls,{lvl:20});const w=WT[P.gear.staff.wt].mul,a0=physPower(),c0=accRating(),h0=maxHp();
    P.st.str+=10;const a1=physPower();P.st.str-=10;P.st.dex+=10;const a2=physPower(),c2=accRating();P.st.dex-=10;P.st.vit+=10;const h2=maxHp();P.st.vit-=10;
    const ws=cls==='warrior'?1:.3,wd=cls==='warrior'?.3:1;
    qOk(Math.abs(a1-a0-10*ws*w)<1e-6,`힘 10 → +${qR(a1-a0)} (기대 ${qR(10*ws*w)})`);qOk(Math.abs(a2-a0-10*wd*w)<1e-6,`민첩 10 → +${qR(a2-a0)} (기대 ${qR(10*wd*w)})`);
    qOk(c2-c0===10,`민첩 10 → 명중 +${c2-c0}`);qOk(h2>h0,'활력이 생명력을 안 올림');
    const ap=P.ap;P.st.str+=5;P.st.dex+=3;P.ap-=8;respec();qOk(P.ap===ap&&P.st.str===CLASSES[cls].st5.str&&P.st.dex===CLASSES[cls].st5.dex,`되돌리기 ap ${P.ap}/${ap} ${JSON.stringify(P.st)}`);
    r.push(`${QCN[cls]} 힘+10 → +${qR(a1-a0)} · 민첩+10 → +${qR(a2-a0)}`)}
  qPrep('mage',{lvl:20});qOk(!('str' in P.st)&&!('dex' in P.st),'마법사에게 힘·민첩이 생김');const p0=power();P.st.int+=10;qOk(power()>p0,'지능');P.st.int-=10;
  return r.join(' · ')});
qT('전사·궁수','명중률: 65~97% 사이 · 준보스 -3% · 보스 -5% · 기절·묶인 적 +15% · 실제로 그 비율만큼 빗나감',()=>{qPrep('archer',{lvl:30});
  const k=Object.keys(TYPES).find(k=>!TYPES[k].boss&&!TYPES[k].mini&&k!=='qa_dummy'),kb=Object.keys(TYPES).find(k=>TYPES[k].boss),km=Object.keys(TYPES).find(k=>TYPES[k].mini);
  const n0=hitChance({k,lvl:30}),b=hitChance({k:kb,lvl:30}),m=hitChance({k:km,lvl:30}),st=hitChance({k,lvl:30,stunT:1});qOk(n0>=.65&&n0<=.97,`같은 레벨 ${qR(n0)}`);
  qOk(Math.abs(n0-b-.05)<1e-9&&Math.abs(n0-m-.03)<1e-9,`보스 ${qR(b)} · 준보스 ${qR(m)} (보통 ${qR(n0)})`);qOk(Math.abs(st-Math.min(.97,n0+.15))<1e-9,`기절 ${qR(st)}`);
  P.st.dex=1e5;qOk(hitChance({k,lvl:30})===.97,`상한 ${hitChance({k,lvl:30})}`);P.st.dex=0;P.lvl=1;P.gear.off=null;const lo=hitChance({k,lvl:99});qOk(lo===.65,`하한 ${lo}`);
  qClear();const e=qDummy(P.x+200,P.y,{lvl:99}),hc=hitChance(e);QA.reseed(321);let miss=0;const N=400,s=Object.assign({},SPELLS.quickshot,{mhit:0});
  for(let i=0;i<N;i++){const h=e.hits;hurtE(e,10,s);if(e.hits===h)miss++}qClear();const rate=miss/N;
  qOk(Math.abs(rate-(1-hc))<.07,`빗나감 ${qR(rate)} (기대 ${qR(1-hc)})`);
  // 마법(마법사·사제)은 명중 판정이 없다
  qPrep('mage',{lvl:1});const e2=qDummy(P.x+200,P.y,{lvl:99});for(let i=0;i<50;i++)hurtE(e2,10,SPELLS.spark);qOk(e2.hits===50,`마법이 빗나감 ${50-e2.hits}`);qClear();
  return `같은 레벨 ${qR(n0)} · 보스 ${qR(b)} · 기절 ${qR(st)} · 하한 ${lo} · ${N}번 중 빗나감 ${miss} (기대 ${Math.round(N*(1-hc))})`});
qT('전사·궁수','막기·회피: 방패가 있어야 막기(막으면 피해 -60%, 상한 50%) · 회피 상한 25% · 보스의 돌진·큰 기술은 못 피함',()=>{const r=[];
  qPrep('warrior',{lvl:30});const b0=blkC();qOk(b0>0&&b0<=.5,`막기 ${qR(b0)}`);const sh=P.gear.off;P.gear.off=null;qOk(blkC()===0,'방패 없이 막기');P.gear.off=sh;
  sh.stats.blk=500;gsKey='';qOk(blkC()===.5,`막기 상한 ${blkC()}`);const keep=PFX.block;let nb=0,fl=false;PFX.block=function(){nb++;fl=true;return keep.apply(this,arguments)};
  const lb=[],lu=[];QA.reseed(77);
  try{for(let i=0;i<300;i++){P.invT=0;P.shield=0;P.buffs={};P.hp=maxHp();fl=false;const h=P.hp;hitPlayer(100,null);(fl?lb:lu).push(h-P.hp)}}finally{PFX.block=keep}
  const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);qOk(Math.abs(nb/300-.5)<.08,`막은 비율 ${qR(nb/300)}`);qOk(Math.abs(avg(lb)/avg(lu)-.4)<.03,`막은 피해 ${qR(avg(lb))} / 그냥 ${qR(avg(lu))}`);
  r.push(`막기 ${nb}/300 · 막은 피해 ×${qR(avg(lb)/avg(lu))}`);
  qPrep('archer',{lvl:30});qOk(blkC()===0,'궁수가 막음');P.gear.robe=makeBaseV18('leather',30,'archer');P.gear.robe.stats.eva=90;qOk(evaC()===.25,`회피 상한 ${evaC()}`);
  const ke=PFX.evade;let ne=0;PFX.evade=function(){ne++;return ke.apply(this,arguments)};QA.reseed(78);
  const kb=Object.keys(TYPES).find(k=>TYPES[k].boss),boss=qMob(kb,200);let nb2=0;
  try{for(let i=0;i<400;i++){P.invT=0;P.hp=maxHp();hitPlayer(10,null)}boss.dash=1;const n1=ne;for(let i=0;i<100;i++){P.invT=0;P.hp=maxHp();hitPlayer(10,boss)}nb2=ne-n1}finally{PFX.evade=ke;qClear()}
  qOk(Math.abs((ne-nb2)/400-.25)<.06,`피한 비율 ${qR((ne-nb2)/400)}`);qOk(nb2===0,`보스 돌진을 ${nb2}번 피함`);r.push(`회피 ${ne-nb2}/400 · 보스 돌진 0/100`);
  return r.join(' · ')});
qT('전사·궁수','필요한 무기: 창 기술은 창이 있어야 · 방패 기술은 방패가 · 활 기술은 활이 (알림 · 마나·재사용 그대로) · 자세히 창 표시 · 두 손 무기와 방패',()=>{qPrep('warrior',{lvl:30});
  for(const id of ['thrust','shieldbash'])P.sk[id]=1;P.mp=maxMp();const mp=P.mp;
  let got=qMsgs(()=>tryCast('thrust',qAt(0,80)));qOk(P.mp===mp&&!(P.cd.thrust>0),'검으로 찌르기가 나감');qOk(got.some(t=>t.includes('창·폴암을 들어야')),`알림 ${got}`);
  qOk(detailHtml('thrust').includes('필요한 무기: 창·폴암'),'자세히 창에 필요한 무기 없음');qOk(!castReady('thrust'),'castReady');
  clsGearFor('thrust');qOk(P.gear.staff.wt==='polearm'&&!P.gear.off,'창 쥐여 주기');P.noMpT=0;qOk(qCast('thrust',qAt(0,80)),'창으로 찌르기가 안 나감');
  P.noMpT=0;got=qMsgs(()=>tryCast('shieldbash',qAt(0,60)));qOk(!(P.cd.shieldbash>0)&&got.some(t=>t.includes('방패를 들어야')),`방패 없이 방패 치기 ${got}`);
  // 착용: 창을 든 채 방패 못 듦 · 창을 들면 방패를 가방에
  qPrep('warrior',{lvl:30});P.bag=[];const pole=makeBaseV18('polearm',30,'warrior');P.bag.push(pole);openPanel('char');qClick(`#pbody [data-equip="${pole.id}"]`);
  qOk(P.gear.staff===pole&&!P.gear.off&&P.bag.some(x=>x.wt==='shield'),'창을 들어도 방패가 남음');const shd=P.bag.find(x=>x.wt==='shield');renderPanel();
  qOk(qMsgs(()=>qClick(`#pbody [data-equip="${shd.id}"]`)).some(t=>t.includes('방패를 쓸 수 없습니다'))&&!P.gear.off,'창과 방패를 같이 듦');
  // 다른 직업 장비는 못 입음 (마법사에게 검, 전사에게 지팡이)
  qPrep('mage',{lvl:30});const sw=makeBaseV18('sword',30,'warrior');P.bag=[sw];openPanel('char');const st0=P.gear.staff;const b=pbody.querySelector(`[data-equip="${sw.id}"]`);
  qOk(!b||b.disabled,'마법사의 검 착용 단추가 살아 있음');if(b&&!b.disabled)b.click();qOk(P.gear.staff===st0,'마법사가 검을 듦');closePanel();
  qPrep('archer',{lvl:30});P.sk.quickshot=1;P.gear.staff=null;P.mp=maxMp();got=qMsgs(()=>tryCast('quickshot',qAt(0,200)));qOk(!projs.length&&got.some(t=>t.includes('활이나 석궁')),`활 없이 사격 ${got}`);
  return '창·방패·활 요구 · 알림 · 두 손 무기와 방패 · 다른 직업 장비 막기'});
qT('전사·궁수','보조 칸(방패·화살통) 저장·불러오기 · 무기 종류(wt) 유지 · 옛 저장(off 없음)은 off:null',()=>{const r=[];
  for(const cls of ['warrior','archer']){qResetStore();qPrep(cls,{lvl:20,slot:5});const it=P.gear.off,w=P.gear.staff;const extra=makeItem(25,true);P.bag=[extra];saveNow();const d=readSlot(5);
    qOk(d&&d.gear.off&&d.gear.off.wt===it.wt,'저장에 보조 장비 없음');P.gear.off=null;qOk(load(d,5),'load 실패');
    qOk(P.gear.off&&P.gear.off.name===it.name&&P.gear.off.wt===it.wt&&JSON.stringify(P.gear.off.stats)===JSON.stringify(it.stats),'불러온 보조 장비가 다름');
    qOk(P.gear.staff.wt===w.wt&&P.bag[0]&&P.bag[0].wt===extra.wt&&P.bag[0].name===extra.name,'무기 종류가 빠짐');qOk(P.st.str===CLASSES[cls].st5.str&&P.st.dex===CLASSES[cls].st5.dex,`능력치 ${JSON.stringify(P.st)}`);
    r.push(`${QCN[cls]} ${it.name}`)}
  qResetStore();qPut('arseia-char-1',QA_FIX.v4);qOk(load(readSlot(1),1),'v4 load');qOk(P.gear.off===null,`옛 저장 off ${JSON.stringify(P.gear.off)}`);
  qOk(saveData().gear.off===null&&'robe' in saveData().gear,'다시 저장한 장비 칸');qResetStore();return r.join(' · ')+' · 옛 사제 저장 off:null'});
qT('전사·궁수','옛 마법사·사제 저장은 그대로: 능력치 3칸(지능·활력·정신) · 주문력 · 장비 굴림에 보조 칸·무기 종류 없음 · 무기상은 지팡이만',()=>{const r=[];
  qResetStore();qPut('arseia-char-0',QA_FIX.v5);qOk(load(readSlot(0),0),'v5 마법사 load');qOk(Object.keys(P.st).sort().join()==='int,spi,vit'&&P.st.int===120&&P.st.vit===60&&P.st.spi===50,`능력치 ${JSON.stringify(P.st)}`);
  qOk(P.gear.staff.name===QA_FIX.v5.gear.staff.name&&!P.gear.staff.wt&&P.gear.off===null,'장비');const pw=power();qOk(pw>120,`주문력 ${pw}`);r.push(`마법사 주문력 ${Math.round(pw)}`);
  openPanel('char');const h=pbody.innerHTML;qOk(h.includes('주문력')&&!h.includes('명중률')&&!h.includes('보조:')&&!h.includes('방패:'),'마법사 캐릭터 창이 바뀜');closePanel();
  qResetStore();qPut('arseia-char-1',QA_FIX.v4);qOk(load(readSlot(1),1),'v4 사제 load');qOk(Object.keys(P.st).sort().join()==='int,spi,vit','사제 능력치');
  for(const cls of ['mage','priest']){qPrep(cls,{lvl:40});QA.reseed(55);let bad=0;for(let i=0;i<300;i++){const it=makeItem(40,i%3===0,cls,i%25===0?'uniq':i%25===1?'set':i%25===2?'boss':undefined);if(it.slot==='off'||it.wt||(it.stats&&('str' in it.stats||'dex' in it.stats||'atk' in it.stats)))bad++}
    qOk(!bad,`${cls}: 전사·궁수 장비 ${bad}개`);qOk(Object.keys(SLOT).join()==='staff,robe,ring,amulet',`칸 ${Object.keys(SLOT)}`)}
  qPrep('mage',{lvl:30});const t=ALLTOWNS[0],w=shopStock(t,'weapon').items,a=shopStock(t,'armor').items;qOk(w.length&&w.every(it=>it.slot==='staff'&&!it.wt),'마법사 무기상');qOk(a.every(it=>it.slot==='robe'||it.slot==='hat'/* v21 모자 */),'마법사 방어구상');
  qResetStore();return r.join(' · ')});
qT('전사·궁수','기본 공격: 맞히면 마나가 찬다(전사 베기 +2 · 궁수 사격 +1, 한 번 시전에 한 번) · 공격 간격은 무기·공격 속도로',()=>{const r=[];
  for(const [cls,id] of [['warrior','slash'],['archer','quickshot']]){qPrep(cls,{lvl:30});const s=SPELLS[id];let ok=false;
    for(let k=0;k<4&&!ok;k++){qClear();const e=qDummy(P.x+(cls==='warrior'?50:220),P.y);P.cd={};P.mp=0;qRecWait();tryCast(id,{x:e.x,y:e.y});let t=0;
      qStep(90,{render:false,each:()=>{t+=1/60},until:()=>e.taken>0});if(!(e.taken>0))continue;ok=true;const g=P.mp;qOk(g>=s.mhit-1e-9&&g<=s.mhit+regen()*t+.01,`마나 +${qR(g)} (기대 ${s.mhit})`);r.push(`${QCN[cls]} +${qR(g)}`)}
    qOk(ok,`${id} 4번 모두 빗나감`);qOk(Math.abs(cdOf(id)-WT[P.gear.staff.wt].spd*s.cd)<1e-9,`공격 간격 ${cdOf(id)}`);P.buffs.qa={t:9,max:9,ias:.2};qOk(cdOf(id)<WT[P.gear.staff.wt].spd*s.cd,'공격 속도가 간격을 줄이지 않음');delete P.buffs.qa}
  // 둘에 맞아도 한 번만
  qPrep('warrior',{lvl:30});clsGearFor('sweep');P.sk.sweep=1;const s2=Object.assign({},SPELLS.slash,{max:3,ang:3});const es=[qDummy(P.x+50,P.y),qDummy(P.x,P.y+50)];P.mp=0;
  for(const e of es)hurtE(e,10,s2);qOk(P.mp<=2+1e-9,`두 번 찼음 ${P.mp}`);qClear();return r.join(' · ')});
qT('전사·궁수','피해 계산은 더하기: 스킬 레벨(+6%씩)·시너지(최대 +40%)·물리 피해 %(최대 +60%)를 더한 뒤 한 번만 곱함 · 강화는 따로 최대 +50%',()=>{qPrep('warrior',{lvl:60});
  const id='slash';
  P.sk[id]=20;for(const s of qSpells('warrior',s=>TREE[s.id]===TREE[id]&&s.id!==id))P.sk[s.id]=20;P.gear.staff.stats.pdmg=300;gsKey='';
  const L=20,sc=physScale(id,L),want=1+.06*lvSteps(L)+.4+.6;qOk(Math.abs(sc-want)<1e-9,`배율 ${qR(sc)} (기대 ${qR(want)})`);
  const mul=(1+.06*lvSteps(L))*1.4*1.6;qOk(sc<mul-.3,`곱하기처럼 커짐 ${qR(sc)} vs ${qR(mul)}`);
  P.buffs.qa={t:9,max:9,dmg:3};qOk(physBuffMul()===1.5,`강화 상한 ${physBuffMul()}`);const s=eff(id,L);const pw=physPw(id,L,s);qOk(Math.abs(pw-physPower()*s.mult*1.5*sc)<1e-6,`위력 ${qR(pw)}`);
  const row=numsAt(id,L).find(x=>x[0]==='피해');qOk(row&&row[1].startsWith(String(Math.round(pw*.9))),`자세히 창 피해 ${row&&row[1]} vs ${Math.round(pw*.9)}`);delete P.buffs.qa;
  return `${id} L20: ×${qR(sc)} (곱하면 ×${qR(mul)}) · 강화 ×1.5`});
qT('전사·궁수','장비: 직업에 맞는 것만 떨어지고(무기 종류·방패/화살통·판금/가죽) 상점(무기상·방어구상)도 그 직업의 것만 · 유니크·세트도',()=>{const r=[];
  const W={warrior:{staff:['sword','polearm'],off:['shield'],robe:['plate']},archer:{staff:['bow','xbow'],off:['quiver'],robe:['leather']}};
  for(const cls of ['warrior','archer']){qPrep(cls,{lvl:40});QA.reseed(66);const cnt={};let bad=[];
    for(let i=0;i<400;i++){const f=i%20===0?'uniq':i%20===1?'set':i%20===2?'boss':undefined,it=makeItem(40,i%2===0,null,f);cnt[it.wt||it.slot]=(cnt[it.wt||it.slot]||0)+1;
      if(!canWear(it))bad.push(it.name);if(W[cls][it.slot]&&!W[cls][it.slot].includes(it.wt))bad.push(`${it.name}:${it.slot}/${it.wt}`);if(it.cls!==cls)bad.push(it.name+' cls');if(!BASE_V18[it.wt]&&it.slot==='staff')bad.push(it.name+' 지팡이');
      if(!(itemScore(it)>0))bad.push(it.name+' 점수 0');if(statLine(it).includes('undefined'))bad.push(it.name+' 옵션 이름')}
    qOk(!bad.length,`${cls}: ${bad.slice(0,6).join(', ')}`);for(const k of [...W[cls].staff,...W[cls].off,...W[cls].robe,'ring','amulet'])qOk(cnt[k]>0,`${cls}: ${k} 0개`);
    const t=ALLTOWNS[0],ws=shopStock(t,'weapon').items,as=shopStock(t,'armor').items;
    qOk(ws.length&&ws.every(it=>W[cls].staff.includes(it.wt)),`무기상 ${ws.map(it=>it.wt)}`);qOk(as.length&&as.every(it=>it.slot==='hat'/* v21 모자 */||W[cls][it.slot]&&W[cls][it.slot].includes(it.wt)),`방어구상 ${as.map(it=>it.wt)}`);
    actTown=t;actShop='weapon';openPanel('shop');const h=pbody.innerHTML;qOk(h.includes(SLOT_N.staff[cls])&&!h.includes('지팡이 <span'),'무기상 제목');closePanel();
    qOk(itemScore(makeBaseV18(cls==='warrior'?'bow':'sword',40))===0,'다른 직업 무기의 점수가 0이 아님');
    r.push(`${QCN[cls]} ${Object.entries(cnt).map(([k,v])=>k+' '+v).join(', ')}`)}
  return r.join(' | ')});
qT('전사·궁수','같이 하기: 상태 메시지에 무기 종류 · 손님의 표식·약화·묶기·도발이 방장 몬스터에 걸림 · 동료의 근접·화살을 다시 그림',()=>{qPrep('warrior',{lvl:40});const out=[];
  try{const {r,sent}=qPty(2,{host:true,dx:200});netSendState();const st=sent.filter(m=>m.t==='st').pop();qOk(st&&st.gw==='sword'&&st.go==='shield',`상태 ${JSON.stringify(st&&{gw:st.gw,go:st.go})}`);
    const e=qMob('wolf',150);e.hp=e.max=1e6;netOnMsg({t:'fx2',from:'qa_peer',id:e.id,ta:3,mk:[.15,6],wk:[.2,8],rt:1});
    qOk(e.markT>0&&e.markAmp===.15,'표식');qOk(e.weakT>0&&e.dmg<e.dmg0,'약화');qOk(e.rootT>0,'묶기');qOk((e.tnt&&e.tnt.k==='qa_peer')||e.tauntT>0,'도발');
    const h0=e.hp;netOnMsg({t:'dmg',from:'qa_peer',id:e.id,a:100});qOk(h0-e.hp>=114,`표식 피해 증가 ${h0-e.hp}`);out.push('fx2 표식·약화·묶기·도발');
    netOnMsg(Object.assign({},st,{from:'qa_peer',c:'archer',gw:'xbow',go:'quiver',gor:2}));qOk(r.gear.staff&&r.gear.staff.wt==='xbow'&&r.gear.off&&r.gear.off.wt==='quiver',`동료 장비 ${JSON.stringify(r.gear)}`);
    r.x=r.tx=P.x+60;r.y=r.ty=P.y;const np=projs.length;NET.gerr=null;netGhostCast({t:'cast',from:'qa_peer',sp:'quickshot',L:3,x:P.x+400,y:P.y});qOk(projs.length>np&&!NET.gerr,`동료 사격 ${NET.gerr}`);
    netOnMsg(Object.assign({},st,{from:'qa_peer',c:'warrior',gw:'polearm',go:0}));const ksw=PFX.swing;let nsw=0;PFX.swing=function(){nsw++;return ksw.apply(this,arguments)};try{netGhostCast({t:'cast',from:'qa_peer',sp:'slash',L:3,x:P.x+200,y:P.y})}finally{PFX.swing=ksw}qOk(nsw>0&&!NET.gerr,`동료 베기 ${NET.gerr}`);
    out.push('동료 화살·베기 그림');
    // 손님: 표식은 방장에게 fx2로
    NET.host=false;NET.guest=true;NET.hostId='qa_peer';sent.length=0;const e2=qMob('wolf',120);e2.hp=e2.max=1e6;P.mp=maxMp();
    applyFx(e2,Object.assign({},SPELLS.quickshot,{mark:{amp:.1,dur:4}}),P);qOk(sent.some(m=>m.t==='fx2'&&m.id===e2.id&&m.mk),'손님 표식이 방장에게 안 감');out.push('손님 → fx2')}
  finally{qPtyOff()}
  qStep(5,{render:true});return out.join(' · ')});
qT('파티 v18','던전 함께 들어가기: 방장이 들어가고 나오는 순간 dg/dgexit를 바로 보냄(그리기 루프가 멈춰도), 참가자는 들어가면 바로 상태를 보내고 dg를 놓치면 다시 청함',()=>{qPrep('mage');P.invT=1e9;
  try{const {r,sent}=qPty(2,{host:true});netLastArea=-1;enterDungeon(CAVES[0]);const dg=sent.find(m=>m.t==='dg');qOk(dg&&dg.d&&dg.d.ci===DG.ci,'들어가는 순간 dg를 안 보냄');qOk(sent.some(m=>m.t==='st'&&m.a===DG.ci),'방장 상태(지역)를 바로 안 보냄');
    sent.length=0;leaveDungeon();qOk(sent.some(m=>m.t==='dgexit'),'나오는 순간 dgexit를 안 보냄');
    NET.host=false;NET.guest=true;NET.hostId='qa_peer';sent.length=0;PTY.dgAsk=-1e9;netApplySnap({a:dg.d.ci,en:[],pr:[],wr:[]});qOk(sent.some(m=>m.t==='req'&&m.a==='dungeon'&&m.to==='qa_peer'),'방장이 던전에 있는데 참가자가 dg를 다시 안 청함');
    sent.length=0;netEnterDg(dg.d);qOk(DG&&DG.ci===dg.d.ci&&DG.net,'참가자가 못 들어감');qOk(sent.some(m=>m.t==='st'&&m.a===DG.ci),'참가자가 들어간 뒤 상태를 바로 안 보냄');
    sent.length=0;netApplySnap({a:dg.d.ci,en:[],pr:[],wr:[]});qOk(!sent.some(m=>m.t==='req'),'이미 같은 던전인데 또 청함');return '방장 dg/dgexit 즉시 · 참가자 st 즉시 · 놓치면 다시 청함'}finally{if(DG)leaveDungeon();qPtyOff()}});
qT('월드','메인 의뢰와 마을 의뢰 표시 색이 다름: 머리 위 ! ? · 미니맵/지도 고리 · 알림판/일지 「메인」「의뢰」',()=>{qPrep('mage',{lvl:30});const r=[];const B=TOWNS.find(t=>t.id==='brenhill');
  P.q={i:0,st:0,c:{}};sqAccept('wolfd');P.x=B.x;P.y=B.y+60;qStep(1,{render:false});
  const ms=sqMarks(false),mn=ms.find(k=>k.kind==='!'&&Math.hypot(k.x-B.npc.x,k.y-B.npc.y)<1),sd=ms.find(k=>(k.kind==='!'||k.kind==='?')&&!k.mq),mr=ms.find(k=>k.kind==='ring'&&k.main),sr=ms.find(k=>k.kind==='ring'&&!k.main);
  qOk(mn&&mn.col===WX_QCOL.main,`메인 의뢰인 ! 색 ${mn&&mn.col}`);qOk(sd&&sd.col!==mn.col,`마을 의뢰 ! ? 색 ${sd&&sd.col}`);qOk(mr&&sr&&mr.col===WX_QCOL.main&&sr.col!==mr.col,'고리 색이 같음');qOk(/^메인 · 1막/.test(mr.label),`고리 이름 ${mr.label}`);
  const wm=sqMarks(true).find(k=>k.kind==='!'&&k.mq);qOk(wm&&wm.col===WX_QCOL.main,'세계 지도 메인 ! 색');
  const cols=['!','?'].map(mk=>[wxMarkCol({mk,main:1}),wxMarkCol({mk})]);for(const [a,b] of cols)qOk(a!==b,'머리 위 ! ? 색이 같음');qOk(wxMarkCol({mk:'!'})==='#ffd34d'&&wxMarkCol({mk:'?'})==='#9fe0ff','마을 의뢰 색이 바뀜');
  // 머리 위 표시: 그리는 순간의 이름표 목록을 잡아 본다
  const keep=twLabels;let got=[];try{twLabels=function(){got=QLBL.slice();return keep()};P.x=B.npc.x+30;P.y=B.npc.y+30;followCam();qStep(2,{render:true})}finally{twLabels=keep}
  const ln=got.find(l=>l.main&&l.mk==='!');qOk(ln&&wxMarkCol(ln)===WX_QCOL.main,'메인 의뢰인 이름표가 메인 색이 아님');qOk(got.filter(l=>l.mk&&!l.main).every(l=>wxMarkCol(l)!==WX_QCOL.main),'마을 사람 표시가 메인 색');
  questHud();const hud=$('#qhud');qOk(hud.querySelector('.qtg.m')&&hud.querySelector('.qtg.s'),'알림판 「메인」「의뢰」 표 없음');const lg=sqLogHtml();qOk(lg.includes('qtg m">메인')&&lg.includes('qtg s">의뢰'),'일지 표 없음');
  P.sq={};return `메인 ${WX_QCOL.main} · 마을 ! ${wxMarkCol({mk:'!'})} ? ${wxMarkCol({mk:'?'})} · 이름표 ${got.length}`});
/* ===== 11d. v18 최적화 · 지형 1단계 (OPT): 절벽 · 능선 · 새 나무 · 땅 화면 방향 굽기 · HUD 15Hz · FPS 표시기 ===== */
const qTerrHash=w=>{let h=2166136261;for(let i=0;i<w.length;i++)h=Math.imul(h^w[i],16777619);return (h>>>0).toString(16)};
const qTerrIds=()=>['home',...REG_IDS];
// 벽 칸 하나 (사방이 벽인 칸이면 더 좋다): 세계 안쪽에서
function qTerrWallCell(deep){for(let j=2;j<TNC-2;j++)for(let i=2;i<TNC-2;i++){if(!terrWallIJ(i,j))continue;if(deep&&![[1,0],[-1,0],[0,1],[0,-1]].every(([a,b])=>terrWallIJ(i+a,j+b)))continue;return{i,j,x:(i+.5)*TCS,y:(j+.5)*TCS}}return null}
qT('지형','결정성: 지역마다 절벽 격자가 씨앗과 처음 지킬 자리만으로 정해짐 (13개 지역 · 들어간 순서 · 실행 중 생긴 물건과 무관 → 같이 하기에서 모두 같은 절벽)',()=>{qPrep('mage',{lvl:60});const r=[];
  for(const id of [...qTerrIds()].reverse()){qWxTo(id);const T=TERR[id];qOk(T&&TGRID===T,`${id}: 지형 없음`);const h0=qTerrHash(T.w),g1=terrGrid(id);qOk(qTerrHash(g1)===h0,`${id}: 다시 만든 격자가 다름`);
    const L=id==='home'?HOME:RCACHE[id],junk={x:L.towns[0].x+900,y:L.towns[0].y+900,k:'qa_junk',s:1,v:0};L.decor.push(junk);try{qOk(qTerrHash(terrGrid(id))===h0,`${id}: 실행 중 생긴 물건이 절벽을 바꿈`)}finally{L.decor.splice(L.decor.indexOf(junk),1)}
    let n=0;for(let j=0;j<TNC;j++)for(let i=0;i<TNC;i++)if(terrWallIJ(i,j))n++;qOk(n>200&&n<TNC*TNC*.5,`${id}: 절벽 칸 ${n}`);r.push(`${id} ${h0.slice(0,4)}`)}
  {const keep={host:NET.host,guest:NET.guest};try{NET.guest=true;const h=qTerrHash(terrGrid('plains'));NET.guest=false;NET.host=true;qOk(qTerrHash(terrGrid('plains'))===h,'방장/손님 격자가 다름')}finally{NET.host=keep.host;NET.guest=keep.guest}}
  loadRegion('home');return r.join(' · ')});
qT('지형','13개 지역: 마을 · 짝문 · 포탈 · 동굴 앞 · 둥지 · 채집 자리 · 의뢰인이 절벽 밖이고, 마을에서 걸어서 닿음 (물 + 절벽 BFS)',()=>{const bad=[];let n=0;
  for(const id of qTerrIds()){const S=terrSnap(id),ok=terrReach(id);for(const p of S.tg){n++;if(!ok[terrLQi(p.x,p.y)])bad.push(`${id} (${Math.round(p.x)},${Math.round(p.y)})`)}
    const L=S.L;for(const t of L.towns)for(const p of [t,t.gate,t.stash])if(p){const c=TERR[id];if(c.w[terrIdx(Math.floor(p.x/TCS),Math.floor(p.y/TCS))])bad.push(`${id} ${t.id} 마을 칸이 절벽`)}}
  qOk(!bad.length,'못 닿음: '+bad.slice(0,8).join(', '));return `${n}곳`});
qT('지형','몬스터가 절벽 칸에서 나오지 않음: 들판 생성 (13개 지역) · 지역 우두머리 둥지',()=>{qPrep('mage',{lvl:60});P.invT=1e9;let n=0;const bad=[];
  for(const id of qTerrIds()){qWxTo(id);const L=id==='home'?HOME:RCACHE[id],T=L.towns[0];const s=mulberry(77);
    for(let a=0;a<14;a++){let x=0,y=0;for(let k=0;k<40;k++){x=400+s()*(WORLD-800);y=400+s()*(WORLD-800);if(!blockedAt(x,y))break}P.x=x;P.y=y;enemies=[];
      for(let k=0;k<12;k++)spawnEnemy();for(const e of enemies){n++;if(terrWall(e.x,e.y))bad.push(`${id} ${e.k} (${Math.round(e.x)},${Math.round(e.y)})`)}}
    if(REG.boss&&REG.lair){enemies=[];REG.bossE=null;REG.bossDead=false;P.x=REG.lair.x;P.y=REG.lair.y+300;regionTick(1/60);qOk(REG.bossE,`${id}: 우두머리가 안 나옴`);for(const e of enemies){n++;if(terrWall(e.x,e.y))bad.push(`${id} 둥지 ${e.k}`)}}}
  enemies=[];loadRegion('home');qOk(!bad.length,'절벽 안: '+bad.slice(0,6).join(', '));return `${n}마리`});
qT('지형','갇힘 풀기(terrFix): 절벽 칸 안에 놓인 주인공(옛 저장 · 순간이동)은 다음 프레임에 가장 가까운 빈 칸(물 아님)으로 · 던전 안에서는 안 건드림',()=>{const r=[];
  for(const id of ['home','plains','sea','abyss']){qPrep('mage',{lvl:50});qWxTo(id);const c=qTerrWallCell(true)||qTerrWallCell(false);qOk(c,`${id}: 벽 칸 없음`);
    P.x=c.x;P.y=c.y;qStep(1,{render:false});qOk(!terrWall(P.x,P.y),`${id}: 아직 절벽 안 (${Math.round(P.x)},${Math.round(P.y)})`);qOk(!blockedAt(P.x,P.y),`${id}: 물 위로 옮김`);
    const d=Math.hypot(P.x-c.x,P.y-c.y);qOk(d<TCS*12,`${id}: 너무 멀리 옮김 ${Math.round(d)}`);r.push(`${id} ${Math.round(d)}`)}
  // 옛 저장 위치가 절벽 안
  qPrep('mage',{lvl:50});const c=qTerrWallCell(true);const d=JSON.parse(JSON.stringify(saveData()));d.x=c.x;d.y=c.y;qOk(load(d,QA_SLOT),'load 실패');qStep(2,{render:false});qOk(!terrWall(P.x,P.y),'불러온 자리가 절벽 안에 남음');
  // 걸어서는 절벽에 못 들어감 (막힘은 물과 같은 방식) · 던전 안에서는 지형 없음
  {const L=HOME,c2=qTerrWallCell(false);let s=null;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(!terrWallIJ(c2.i+a,c2.j+b)){s={x:(c2.i+a+.5)*TCS,y:(c2.j+b+.5)*TCS};break}
    if(s){P.x=s.x;P.y=s.y;const dx=(c2.x-s.x)/TCS,dy=(c2.y-s.y)/TCS;for(let k=0;k<200;k++)moveBody(P,dx*3,dy*3);qOk(!terrWall(P.x,P.y),'걸어서 절벽 안으로 들어감')}}
  qPrep('mage',{lvl:40});qEnter(DUNGEONS[0]);const px=P.x,py=P.y;qOk(!terrFix(P)&&P.x===px&&P.y===py,'던전 안에서 terrFix가 주인공을 옮김');leaveDungeon();
  loadRegion('home');return r.join(' · ')});
qT('지형','마법·화살은 절벽을 넘어간다 (맞는 규칙 그대로): 절벽 너머 허수아비에 화염구 · 화살',()=>{qPrep('mage',{lvl:60});const r=[];
  // 절벽 띠를 사이에 둔 두 빈 칸 찾기
  let A=null,B=null;for(let j=3;j<TNC-3&&!A;j++)for(let i=3;i<TNC-5&&!A;i++)if(!terrWallIJ(i,j)&&terrWallIJ(i+1,j)&&terrWallIJ(i+2,j)&&!terrWallIJ(i+3,j)){A={x:(i+.5)*TCS,y:(j+.5)*TCS};B={x:(i+3.5)*TCS,y:(j+.5)*TCS}}
  qOk(A,'절벽 띠 없음');for(const [cls,id] of [['mage','firebolt'],['archer',Object.keys(SPELLS).find(k=>SPELLS[k].cls==='archer'&&SPELLS[k].kind==='bolt')]]){if(!id)continue;qPrep(cls,{lvl:60});P.sk[id]=10;
    P.x=A.x;P.y=A.y;followCam();const e=qDummy(B.x,B.y);let got=0;if(typeof clsGearFor==='function')clsGearFor(id);for(let k=0;k<3&&!e.taken;k++){qCast(id,{x:B.x,y:B.y});qStep(120,{render:false,until:()=>e.taken>0})}got=e.taken;qOk(got>0,`${id}: 절벽 너머에 안 맞음`);r.push(`${id} ${Math.round(got)}`)}
  qClear();return r.join(' · ')});
qT('지형','그림: 절벽 칸 그림이 빈 그림이 아님 · 새 나무 5종 · 절벽 곁 화면 · 작은 지도에 절벽',()=>{qPrep('mage',{lvl:60});
  for(const th of Object.keys(TTHEME)){const e=cliffSprite(th,120,1,2);qOk(e&&!qBlank(e.cv),`${th}: 빈 절벽 그림`)}
  for(const k of ['htree','hbirch','hpine','hdead','hbush'])qOk(RD.D[k]&&typeof RD.D[k].p==='function',`${k} 그림 없음`);
  for(const id of ['home','highland','abyss']){qWxTo(id);const vis=TGRID.cells.length;qOk(vis>500,`${id}: 절벽 칸 ${vis}`);qOk(!decor.some(d=>d.cliff),`${id}: 절벽 칸이 장식 목록에 들어감`);{const v=[];terrVis(v);qOk(v.length>0&&v.every(c=>c.cliff&&c._s),`${id}: 화면 절벽 ${v.length}`)}
    const c=qTerrWallCell(false);let s=null;for(const [a,b] of [[-1,0],[0,-1]])if(!terrWallIJ(c.i+a,c.j+b)){s={x:(c.i+a+.5)*TCS,y:(c.j+b+.5)*TCS};break}if(s){P.x=s.x;P.y=s.y;followCam()}render();qOk(!qBlank(cv),`${id}: 화면이 빔`)}
  mmBg=null;drawMinimap();qOk(mmBg&&!qBlank(mmBg),'작은 지도 바탕 없음');loadRegion('home');return `테마 ${Object.keys(TTHEME).length}`});
qT('지형','새 지역 장식 종류가 모두 TSCEN(옮길 수 있는 풍경)에 있음 · 마을 물건 · 채집 자리는 옮기지 않음',()=>{const bad=[];
  for(const id of REG_IDS)for(const [k] of REGIONS[id].mix||[])if(!TSCEN.has(k))bad.push(`${id}:${k}`);qOk(!bad.length,'TSCEN에 없음: '+bad.join(', '));
  for(const id of qTerrIds()){terrEnsure(id);const L=id==='home'?HOME:RCACHE[id];for(const sid in L.spots||{})L.spots[sid].forEach((p,i)=>{const d=L.decor.find(d=>d.use===sid&&d.si===i);if(d&&(d.x!==p.x||d.y!==p.y))bad.push(`${id} ${sid}#${i} 옮겨짐`)})}
  qOk(!bad.length,bad.slice(0,6).join(', '));return `지역 ${REG_IDS.length}곳`});
qT('안정성','쫓는 몬스터가 주인공 쪽을 봄(e.fx) · 마을 한가운데 정확히 선 몬스터도 NaN 없이 마을 밖으로 (v18 OPT: d=0 고침에서 방향 줄이 주석에 묻혔던 것)',()=>{qPrep('mage',{lvl:60});const r=[];
  for(const [dx,want] of [[300,-1],[-300,1]]){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;const e=dgMob('ogre',P.x+dx,P.y-dx,20);e.aggroed=true;e.fx=-want;qStep(3,{render:false,each:()=>{P.hp=maxHp()}});qOk(e.fx===want,`fx ${e.fx} (기대 ${want})`);r.push(e.fx)}
  qClear();const T=TOWNS[0];P.x=T.x+900;P.y=T.y+900;const e=dgMob('wolf',T.x,T.y,5);qStep(2,{render:false});qOk(isFinite(e.x)&&isFinite(e.y),'마을 한가운데 몬스터 NaN');qOk(Math.hypot(e.x-T.x,e.y-T.y)>=SAFE-1,'마을 밖으로 안 밀림');
  qClear();return `fx ${r.join(',')}`});
qT('최적화','산맥 겹쳐 그리기 줄이기: 앞 이웃 절벽에 덮이는 아래쪽을 잘라 그려도 화면이 똑같음 (지도 끝 3곳)',()=>{qPrep('mage',{lvl:60});const r=[];
  const grab=()=>{render();return ctx.getImageData(0,0,cv.width,cv.height).data};
  for(const [id,x,y] of [['forest',450,2000],['highland',5550,3000],['home',3000,5620]]){qWxTo(id,x,y);enemies=[];qClear();for(let i=0;i<40;i++){SC.bakeLeft=99;render()}
    /* v22: 그림이 늘어 바쁜 기계에서는 40장 만에 다 구워지지 않음 → 땅 조각 일이 끝나고 두 장이 같아질 때까지 더 그림(최대 300장) */TCLIP=false;{let p0=grab();for(let k=0;k<300;k++){const p1=grab();let d=0;for(let i=0;i<p1.length;i+=4)if(p1[i]!==p0[i]||p1[i+1]!==p0[i+1]||p1[i+2]!==p0[i+2])d++;if(!d&&!(typeof GJOBS!=='undefined'&&GJOBS.length))break;p0=p1}}
    const a0=grab(),a=grab();TCLIP=true;const b=grab();let n=0,n0=0;for(let i=0;i<a.length;i+=4)if(a0[i]!==a[i]||a0[i+1]!==a[i+1]||a0[i+2]!==a[i+2])n0++;qOk(n0<a.length/4*.001,`${id}: 같은 설정 두 번 그림이 다름 ${n0}`);for(let i=0;i<a.length;i+=4)if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>24)n++;
    qOk(n<a.length/4*.001,`${id}: 다른 화소 ${n}`);r.push(`${id} ${n}`)}
  TCLIP=true;loadRegion('home');return r.join(' · ')});
qT('최적화','땅 조각: 화면 방향으로 한 번 더 구운 그림(isoBlit)을 붙임 · 최대 28장 · 마을/던전 그림 오류 없음',()=>{qPrep('mage',{lvl:30,at:{x:TOWNS[0].x,y:TOWNS[0].y+110}});let w=0;for(;w<240;w++){update(1/60);render();if(!GJOBS.length&&w>20)break}
  let n=0;for(const c of chunks.values())if(c.iso)n++;qOk(n>0,'iso 그림이 없음');qOk(n<=28,`iso ${n}장 > 28`);qOk(!qBlank(cv),'화면이 빔');
  for(let k=0;k<3;k++){P.x+=900;P.y+=300;followCam();for(let f=0;f<15;f++){update(1/60);render()}}n=0;for(const c of chunks.values())if(c.iso)n++;qOk(n<=28,`이동 뒤 iso ${n}장 > 28`);
  qPrep('mage',{lvl:40});qEnter(DUNGEONS[0]);for(let f=0;f<60;f++){update(1/60);render()}qOk(!qBlank(cv),'던전 화면이 빔');leaveDungeon();return `iso ${n}장`});
qT('최적화','HUD는 초당 15번: 루프 frame()이 매 프레임 updateHud를 부르지 않음 · 그래도 0.1초 안에 갱신',()=>{qPrep('mage');let calls=0;const keep=updateHud,keepR=requestAnimationFrame;
  try{updateHud=function(){calls++;return keep.apply(this,arguments)};window.requestAnimationFrame=()=>0;let t=last;for(let i=0;i<60;i++){t+=1000/60;frame(t)}}finally{updateHud=keep;window.requestAnimationFrame=keepR;last=performance.now()}
  qOk(calls>=12&&calls<=17,`60프레임(1초)에 updateHud ${calls}번`);return `1초에 ${calls}번`});
qT('최적화','FPS 표시기: Ctrl+Shift+F로 켜고 끔 · 화면 위 가운데 · 저장/설정에 아무것도 안 씀',()=>{qPrep('mage');const w0=QA.storeLog.length,ra=QA.realAccess,keys0=JSON.stringify([...qStore().keys()].sort());const on0=FPSM.on;
  const kd=()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyF',key:'F',ctrlKey:true,shiftKey:true,bubbles:true,cancelable:true}));
  kd();qOk(FPSM.on!==on0&&FPSM.el,'켜지지 않음');const el=FPSM.el;qOk(!el.hidden&&document.body.contains(el),'표시기가 안 보임');
  let t=performance.now();fpsTick(t);for(let i=0;i<40;i++){t+=16.7;fpsTick(t)}qOk(/^FPS \d+/.test(el.textContent)&&/품질/.test(el.textContent),`글자 ${el.textContent}`);
  const cs=getComputedStyle(el);qOk(cs.position==='fixed'&&cs.pointerEvents==='none','위치/클릭 막음');
  kd();qOk(FPSM.on===on0&&el.hidden,'꺼지지 않음');
  qOk(QA.storeLog.length===w0,`저장소 쓰기 ${QA.storeLog.length-w0}번`);qOk(QA.realAccess===ra,'진짜 localStorage 접근');qOk(JSON.stringify([...qStore().keys()].sort())===keys0,'저장소 키가 바뀜');
  return el.textContent});
/* ===== v18: 다른 게임 이름(출처) 표시 없음 ===== */
const QA_SRC_RE=/(월드\s*오브\s*워크래프트|워크래프트|와우|\bWoW\b|디아블로|Diablo|라그나로크|Ragnarok|테일즈\s*위버|Tales\s*Weaver|드래곤\s*라자|엘더\s*스크롤|스카이림|Skyrim|메이플|리니지|파이널\s*판타지|에서\s*(따온|빌려\s*온|가져온))/i;
function qSrcScan(o,path,out,seen){if(o==null)return;if(typeof o==='string'){if(QA_SRC_RE.test(o))out.push(path+': '+o.slice(0,60));return}
  if(typeof o!=='object'||seen.has(o)||out.length>40)return;seen.add(o);for(const k in o){if(typeof o[k]==='function')continue;qSrcScan(o[k],path+'.'+k,out,seen)}}
qT('설명','v18: 스킬·아이템·칭호·몬스터·의뢰·패치노트·도감 어디에도 다른 게임 이름(가져온 곳) 표시가 없음',()=>{const out=[],seen=new Set();
  const T={SPELLS,UNIQ,BOSSU,SETS,PASSIVES,QUESTS,TYPES,CLASSES,PATCHES,QNPC,TWFOLK,SAYS,LINES,SKILL_LINES,PROCN,STAT_N,STATN,KINDN,SHOPN};
  for(const k of ['SQ','WX_SQ','WX_ACT2','WX_FOLK','WX_QNPC','WX_DUNGEONS','WX_REGIONS','REGIONS','DUNGEONS','UNIQ_V18','SETS_V18','BOSSU_V18','TITLES','TITLE'])try{const v=eval(k);if(v)T[k]=v}catch(_){}
  for(const k in T)qSrcScan(T[k],k,out,seen);
  for(const c of Object.keys(CLASSES)){qPrep(c,{lvl:60});for(const id in SPELLS)if(SPELLS[id].cls===c){const h=detailHtml(id);if(QA_SRC_RE.test(h))out.push('detail '+id)}
    openPanel('tree');renderPanel();if(QA_SRC_RE.test(pbody.textContent))out.push('tree '+c);closePanel()}
  try{const h=codexHtml();if(QA_SRC_RE.test(h.replace(/<[^>]+>/g,'')))out.push('codex')}catch(_){}
  qOk(!out.length,out.slice(0,8).join(' | '));return `표 ${Object.keys(T).length}개 · 직업 ${Object.keys(CLASSES).length}개 스킬 설명 확인`});
qT('휴대폰','v18 휴대폰 정리: ☰ 메뉴가 버튼들을 접고 펴고(버튼을 누르면 닫힘), 강화 아이콘 칸·단축칸 3줄 규칙이 들어 있음 · PC 폭에서는 ☰이 안 보임',()=>{qPrep('priest',{lvl:30});
  const t=document.querySelector('#hud .tools'),mb=document.querySelector('#menuBtn');qOk(mb&&t.firstChild===mb,'☰ 버튼 없음');
  MOB.menu(true);qOk(t.classList.contains('open'),'안 열림');MOB.menu(false);qOk(!t.classList.contains('open'),'안 닫힘');
  if(!MOB.on())qOk(getComputedStyle(mb).display==='none','PC 폭에서 ☰이 보임');
  const css=[...document.querySelectorAll('style')].map(x=>x.textContent).join('');qOk(/\.tools:not\(\.open\) button:not\(#menuBtn\)/.test(css)&&/#mbuffs/.test(css)&&/\.bar \.barrow\{display:contents\}/.test(css),'휴대폰 CSS 빠짐');
  P.buffs.qa_t={n:'시험',t:30};const h=PUI.chips(PUI.myBuffs());delete P.buffs.qa_t;qOk(/pbi/.test(h),'강화 아이콘이 안 만들어짐');
  return MOB.on()?'휴대폰 폭':'PC 폭'});
qT('전사·궁수','v19 고친 문제: 도약(leap)을 몬스터 자체에 겨눠도 위치가 NaN이 되지 않음',()=>{const id=SPELLS.leapsmash?'leapsmash':Object.keys(SPELLS).find(k=>SPELLS[k].kind==='leap');qOk(id,'도약 스킬 없음');qPrep(SPELLS[id].cls,{lvl:45});P.sk[id]=5;P.mp=1e5;P.cd[id]=0;P.x=QA_SPOT.x;P.y=QA_SPOT.y;
  const e=qDummy(P.x+150,P.y+30);qCast(id,e);qStep(30,{render:false});qOk(isFinite(P.x)&&isFinite(P.y),`위치 ${P.x},${P.y}`);qOk((P.cd[id]||0)>0&&Math.hypot(P.x-QA_SPOT.x,P.y-QA_SPOT.y)>20,'도약이 안 나감');return `${SPELLS[id].n} → ${Math.round(P.x-QA_SPOT.x)},${Math.round(P.y-QA_SPOT.y)}`});
/* ===== 12. 마무리 ===== */
/* ===== v18 소리 (audio.js · lines.js · music-index.js) ===== */
qT('소리','고위 스킬 대사에 없는 스킬 id 없음 · 모든 지역·마을·던전·보스에 곡이 있음 · 곡 10개 모두 옆 파일 audio/music/*.mp3 (v20: 게임 파일 안에 넣지 않음)',()=>{const bad=AUDIO_QA();qOk(!bad.length,bad.slice(0,6).join(', '));
  const slots=Object.keys(MUSIC_INDEX);qOk(slots.length===10,`곡 ${slots.length}개`);for(const k of slots){const m=MUSIC_INDEX[k];qOk(!m.data&&/^music\/[a-z]+\.mp3$/.test(m.file||''),`${k}: 옆 파일 아님 ${m.file}`);qOk(/^audio\/music\/[a-z]+\.mp3$/.test(bgmStreamUrl(k)||''),`${k}: 주소 ${bgmStreamUrl(k)}`)}
  for(const id of REG_IDS.concat(['home']))qOk(MUSIC_INDEX[BGM_REG[id]||'field'],`지역 ${id} 곡 없음`);
  const miss=AUDIO_QA_MISSING();return `대사 ${Object.keys(SKILL_LINES).length}개 · 대사 없는 5위계 이상 ${miss.length}개(말풍선 없이 지나감)`});
qT('소리','#qa는 조용함: 키·클릭에도 AudioContext를 만들지 않고, 소리 함수는 오류 없이 아무것도 안 함',()=>{qPrep('mage',{lvl:60});
  qKey('KeyX');qKey('KeyX','keyup');window.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));qOk(!AU.ctx&&!AU.on,'#qa에서 AudioContext가 생김');
  const e=qDummy(P.x+60,P.y);for(const k in SFX){try{SFX[k]('fire',e,true,true)}catch(err){qOk(0,`SFX.${k}: ${err.message}`)}}
  BGM.play(BGM.pick());qOk(BGM.cur===null,'소리 없이 곡이 재생 상태');qClear();return `효과음 ${Object.keys(SFX).length}가지 호출 · 오류 0`});
qT('소리','대사: 말풍선만 (기계 음성 speechSynthesis.speak 0회) · 없는 id는 건너뜀 · 끄면 안 뜸',()=>{qPrep('mage',{lvl:60});const sy=window.speechSynthesis;let spoke=0;const SU=window.SpeechSynthesisUtterance;
  const o=sy&&sy.speak;if(sy)try{sy.speak=function(){spoke++}}catch(_){}try{window.SpeechSynthesisUtterance=function(){spoke++}}catch(_){}
  try{qOk(LINES.say({id:'qa_no_such_skill',rank:9,cls:'warrior',cd:30})===false,'없는 id에 말풍선');qOk(LINES.say(null)===false,'null');
    const ids=Object.keys(SKILL_LINES).filter(id=>SPELLS[id]&&SPELLS[id].cls==='mage'&&SPELLS[id].rank>=7&&isDmg(SPELLS[id])).slice(0,4);qOk(ids.length>=3,'7위계 이상 마법사 대사');let shown=0;
    for(const id of ids){qClear();LINES.lastAll=-99;LINES.lastBy.clear();SAYS.length=0;P.sk[id]=10;qCast(id,qDummy(P.x+200,P.y));qStep(20,{render:true});if(SAYS.some(b=>b.o===P))shown++}
    qOk(shown===ids.length,`말풍선 ${shown}/${ids.length}`);
    AU.set.lines=false;LINES.lastAll=-99;LINES.lastBy.clear();SAYS.length=0;qClear();const id=ids[0];qCast(id,qDummy(P.x+200,P.y));qStep(5,{render:false});qOk(!SAYS.length,'꺼도 말풍선');
  }finally{AU.set.lines=true;if(sy&&o)try{sy.speak=o}catch(_){}try{window.SpeechSynthesisUtterance=SU}catch(_){}SAYS.length=0;qClear()}
  qOk(spoke===0,`기계 음성 ${spoke}회`);return '말풍선만 · 음성 0회'});
qT('소리','설정 창: 배경음악·효과음 음량 + 대사 말풍선 켜기/끄기 · 음악 출처(CC-BY-SA 포함) · arseia-audio 한 키에만 저장',()=>{qPrep('mage');const s0=Object.assign({},AU.set),n0=QA.storeLog.length;
  qOk($('#auBtn'),'소리 버튼 없음');$('#auBtn').click();const el=$('#auPanel');qOk(el&&!el.hidden,'설정 창이 안 열림');
  const r=el.querySelectorAll('input[type=range]'),c=el.querySelectorAll('input[type=checkbox]');qOk(r.length===2&&c.length===1,`음량 ${r.length}·체크 ${c.length}`);
  qOk([...r].map(i=>i.dataset.k).join()==='music,sfx'&&c[0].dataset.c==='lines','설정 항목');qOk(!/목소리|음성으로/.test(el.textContent),'목소리 설정이 남음');
  const li=el.querySelectorAll('li');qOk(li.length===10,`출처 ${li.length}줄`);qOk(/CC-BY-SA/.test(el.textContent)&&/Wildfire/.test(el.textContent),'CC-BY-SA 출처 없음');
  r[0].value='0';r[0].dispatchEvent(new Event('input'));qOk(AU.set.music===0,'음악 0');qOk(/끔/.test(el.textContent),'0일 때 끔 표시');
  c[0].checked=false;c[0].dispatchEvent(new Event('change'));qOk(AU.set.lines===false,'말풍선 끄기');
  const saved=JSON.parse(localStorage.getItem('arseia-audio')||'{}');qOk(saved.music===0&&saved.lines===false,'저장 안 됨');
  const keys=[...new Set(QA.storeLog.slice(n0).map(o=>o.op+':'+o.k))];qOk(keys.every(k=>k==='set:arseia-audio'),`다른 키: ${keys}`);
  el.querySelector('#auClose').click();qOk(el.hidden,'닫기');Object.assign(AU.set,s0);auSave();el.remove();
  const h=$('#auCredits');qOk(h&&h.querySelectorAll('li').length===10&&/CC-BY-SA/.test(h.textContent),'도움말에 음악 출처 없음');return `출처 10곡 · 저장 키 ${keys.join(',')}`});
qT('소리','진짜 소리 기계(__QA_AUDIO): 효과음 16가지 오류 0 · 곡은 옆 파일에서 흘려 들음(풀어 두지 않음) · 끝나면 다시 조용히',async()=>{qPrep('mage');window.__QA_AUDIO=1;const errs=[];let dec=null,st='';
  try{auInit();qOk(AU.ctx,'AudioContext 없음(브라우저)');try{await Promise.race([AU.ctx.resume(),new Promise(r=>setTimeout(r,500))])}catch(_){}st=AU.ctx.state;
    const e=qDummy(P.x+60,P.y),A={hit:['fire',e,true,true],thud:[e],die:[TYPES.ogre,e],hurt:[.2],cast:[SPELLS.meteor,e],charge:[SPELLS.meteor,1],gold:[e],item:[3,e],roar:[e]};let n=0;
    for(const el of Object.keys(EL))try{SFX.hit(el,e,false,false);AU.last.clear()}catch(err){errs.push('hit '+el+': '+err.message)}
    for(const k in SFX){try{const r=SFX[k](...(A[k]||[]));n++;if(typeof r==='function')r(true)}catch(err){errs.push(k+': '+err.message)}}
    AU.on=true;BGM.want='title';BGM.cur=null;BGM.apply();const el=BGMS.el;dec=el?el.src.split('/').slice(-3).join('/'):(st==='running'?'없음':'소리 기계 '+st);
    if(st==='running')qOk(el&&/audio\/music\/title\.mp3$/.test(el.src),`title 흘려 듣기: ${dec}`);
    await new Promise(r=>setTimeout(r,700));qOk(BGM.buf.size===0,`풀어 둔 곡 ${BGM.buf.size}개 (흘려 들으므로 0)`)
    if(st==='running'){/* 못 여는 곡 파일(러너가 qanone.mp3에 가짜 내용을 줌): 한 번 요청한 뒤 miss에 들어가고 다시 요청하지 않음 */MUSIC_INDEX.qa_none={file:'music/qanone.mp3'};try{if(BGMS.el){BGMS.el.pause();BGMS.el=null}BGM.want='qa_none';BGM.cur=null;BGM.apply();
      for(let i=0;i<40&&!BGM.miss.has(bgmStreamUrl('qa_none'));i++)await new Promise(r=>setTimeout(r,100));qOk(BGM.miss.has(bgmStreamUrl('qa_none')),'없는 곡이 miss에 안 들어감');
      BGM.want='qa_none';BGM.cur=null;BGM.apply();qOk(!BGMS.el||!/qanone\.mp3$/.test(BGMS.el.src),'없는 곡을 다시 요청함')/* 기다리는 동안 게임이 지역 곡을 틀 수 있음 → 그 곡이면 괜찮음 */}finally{delete MUSIC_INDEX.qa_none}}}
  finally{window.__QA_AUDIO=0;try{if(BGMS.el){BGMS.el.pause();BGMS.el.removeAttribute('src');BGMS.el=null}}catch(_){}try{AU.ctx&&AU.ctx.close()}catch(_){}AU.ctx=null;AU.on=false;AU.bus={};BGM.cur=null;BGM.src=null;BGM.gain=null;BGM.buf.clear();qClear()}
  qOk(!errs.length,errs.join('; '));qOk(!AU.ctx&&!AU.on,'끝난 뒤에도 소리 기계가 남음');return `소리 기계 ${st} · 효과음 ${Object.keys(SFX).length}가지 · 원소 ${Object.keys(EL).length}개 타격음 · 곡 ${dec}`});
/* ===== v19 대화 (chat19.js): #qa는 서버 없이 돈다 → 숨김·무시 + 읽기·글자로·5초 5번·숨기기 ===== */
qT('대화 v19','서버 없이: 대화 버튼 숨김 · Enter/chatOpen 무시 · 보내지 않음 · 모르는 메시지 무시 · 오류 없음',()=>{qOk(!window.COOP_SERVER,'COOP_SERVER가 켜져 있음');qOk($('#chatBtn').hidden,'대화 버튼이 보임');
  chatOpen();let el=document.getElementById('chat');qOk(!el||!el.classList.contains('open'),'chatOpen이 대화창을 엶');
  dispatchEvent(new KeyboardEvent('keydown',{code:'Enter',key:'Enter',bubbles:true,cancelable:true}));el=document.getElementById('chat');qOk(!el||!el.classList.contains('open'),'Enter가 대화창을 엶');
  qOk(CHAT.send('안녕')===false&&CHAT.send('/w 별빛 안녕')===false,'서버 없이 보냄');chatSys('점검 알림');CHAT.sys('점검 알림 2');
  qOk(!document.getElementById('chat'),'서버 없이 대화창 DOM이 생김');
  const id0=NET.id,c0=NET.chat2;for(const m of [{t:'nosuch'},{t:'csys'},{t:'chist',list:'bad'},{t:'chist'},{t:'hello',id:id0,host:0}])netOnMsg(m);qOk(NET.chat2===false,'f 없는 hello인데 chat2');
  netOnMsg({t:'hello',id:id0,host:0,f:['chat2']});const on=NET.chat2;NET.id=id0;NET.chat2=c0;qOk(on===true,'f:[chat2] hello를 못 읽음');
  return '버튼 숨김 · 열리지 않음 · 보내기 0'});
qT('대화 v19','명령 읽기: 일반 · /w(빈칸 든 이름은 긴 것부터) · /r · /p · /a · /mute · 모르는 명령 · 120자',()=>{const ch0=CHAT.ch,w0=[CHAT.wTo,CHAT.wName,CHAT.lastW];
  const L=[{id:2,n:'별빛'},{id:3,n:'달 빛'},{id:4,n:'달'}],p=s=>CHAT.parse(s,L),J=JSON.stringify,bad=[];
  try{CHAT.ch='all';CHAT.lastW=null;const want=[['  안녕   친구 ',{ch:'all',x:'안녕 친구'}],['/w 별빛 비밀 얘기',{ch:'w',to:2,tn:'별빛',x:'비밀 얘기'}],['/w 달 빛 안녕',{ch:'w',to:3,tn:'달 빛',x:'안녕'}],['/w 달 안녕',{ch:'w',to:4,tn:'달',x:'안녕'}],
      ['/귓 모르는이 하이',{ch:'w',to:0,tn:'모르는이',x:'하이'}],['/W 별빛',{cmd:'wset',to:2,tn:'별빛'}],['/p 모여',{ch:'party',x:'모여'}],['/파티',{cmd:'ch',ch:'party'}],['/전체 다들 안녕',{ch:'all',x:'다들 안녕'}],
      ['/mute 나쁜 이',{cmd:'mute',tn:'나쁜 이'}],['/숨김해제 나쁜이',{cmd:'unmute',tn:'나쁜이'}],['/도움',{cmd:'help'}]];
    for(const [s,o] of want){const r=p(s);if(J(r)!==J(o))bad.push(`${s} → ${J(r)}`)}
    for(const s of ['/w','/r 안녕','/zz 뭐지','/unmute'])if(!(p(s)||{}).err)bad.push(s+' 오류 없음');
    qOk(p('')===null&&p('   ')===null,'빈 입력');qOk(p('가'.repeat(300)).x.length===120&&p('/w 별빛 '+'나'.repeat(300)).x.length===120,'120자 자르기');
    CHAT.lastW={id:2,n:'별빛'};const r=p('/답 응');if(!(r.ch==='w'&&r.to===2&&r.x==='응'))bad.push('/답 '+J(r));
    CHAT.ch='w';CHAT.wTo=3;CHAT.wName='달 빛';const r2=p('그냥 말');if(!(r2.ch==='w'&&r2.to===3&&r2.tn==='달 빛'))bad.push('귓속말 채널 '+J(r2));
  }finally{CHAT.ch=ch0;[CHAT.wTo,CHAT.wName,CHAT.lastW]=w0}
  qOk(!bad.length,bad.join(' | '));return '명령 '+18+'가지'});
qT('대화 v19','글자로 그리기: 이름·글의 HTML은 그대로 글자(태그 0) · 채널 표시와 색 · 옛 서버 메시지(ch 없음)는 [전체]',()=>{const d=document.createElement('div');
  const evil='<img src=x onerror="window.__qaXss=1"><script>window.__qaXss=2<\/script>';
  d.innerHTML=CHAT.fmt({from:5,n:'<b onclick=1>악당</b>',x:evil+' & " \'',ch:'all'},1)+CHAT.fmt({from:1,n:'나',to:5,tn:'<i>너</i>',x:'<u>귓</u>',ch:'w'},1)+CHAT.fmt({from:5,n:'옛',x:'<s>a</s>'},1)+CHAT.fmt({from:5,n:'파',x:'p',ch:'party'},1)+CHAT.fmt({from:5,n:'x',x:'y',ch:'<zz>'},1);
  qOk(!d.querySelector('img,script,u,s,i,b:not(.cn)'),'태그가 살아남음: '+d.innerHTML.slice(0,120));qOk(!window.__qaXss,'스크립트가 돎');
  const t=d.textContent;qOk(t.includes('<img src=x')&&t.includes('<script>')&&t.includes('<b onclick=1>악당</b>')&&t.includes('<i>너</i>'),'글자가 사라짐: '+t.slice(0,80));
  const tags=[...d.querySelectorAll('.ctag')].map(e=>e.textContent);qOk(tags.join()==='[전체],[귓속말],[전체],[파티],[전체]','채널 표시 '+tags);
  qOk(d.querySelectorAll('.ctag')[1].style.color!==d.querySelectorAll('.ctag')[0].style.color&&d.querySelectorAll('.ctag')[3].style.color!==d.querySelectorAll('.ctag')[0].style.color,'채널 색이 같음');
  qOk(t.includes('→ <i>너</i>'),'보낸 귓속말 표시');qOk(CHAT.fmt({from:5,n:'a',x:'b'.repeat(500)},1).length<900,'긴 글 자르기');return t.slice(0,60)});
qT('대화 v19','5초에 5번: 6번째 막힘 · 5초 지나면 다시',()=>{const q0=CHAT.rl;CHAT.rl=[];const r=[];try{for(const t of [0,100,200,300,400,500,4999,5000,5050,5101,5200])r.push(CHAT.rlOk(t)?1:0)}finally{CHAT.rl=q0}
  qOk(r.join('')==='11111001011','결과 '+r.join(''));return r.join('')});
qT('대화 v19','숨기기(/mute): 이름 빈칸·대소문자 무시 · 숨긴 사람 글만 거름 · 풀기 · arseia-chat-mute 한 키만',()=>{const k0=CHAT.mutes;const before=QA.storeLog.length;
  try{CHAT.mutes=new Set();qOk(CHAT.setMute('나쁜  Ab',true),'숨기기 실패');qOk(CHAT.muted('나쁜 ab')&&!CHAT.muted('착한이'),'숨김 판정');
    qOk(CHAT.accept({from:NET.id+77,n:'나쁜 AB',x:'a'})===false&&CHAT.accept({from:NET.id+77,n:'착한이',x:'a'})===true,'거르기');
    CHAT.setMute('나쁜 ab',false);qOk(CHAT.accept({from:NET.id+77,n:'나쁜 Ab',x:'a'}),'풀기')}finally{CHAT.mutes=k0}
  const keys=[...new Set(QA.storeLog.slice(before).map(o=>o.k))];qOk(keys.every(k=>k==='arseia-chat-mute'),'다른 키 '+keys);return keys.join()});
qT('저장','실행 중 캐릭터 키에 removeItem/clear를 부른 곳 없음',()=>{const bad=QA.storeLog.filter(o=>(o.op==='remove'||o.op==='clear')&&(o.k==='*'||/char|apprentice/.test(o.k)));
  qOk(!bad.length,bad.map(o=>`${o.op}(${o.k}) @${o.t}: ${o.stack}`).join(' / '));return `저장소 쓰기 ${QA.storeLog.filter(o=>o.op==='set').length}회, 지우기 0`});
qT('저장','진짜 localStorage 접근 0회',()=>{qOk(QA.swapped,'가짜 저장소로 바꾸지 못함 '+(QA.swapError||''));qOk(QA.realAccess===0,`${QA.realAccess}회: ${QA.realLog.join(', ')}`);return '0회'});

/* ===== v19 (JOB): 2차 전직 · 위계 시험 · 퀘스트 스킬 포인트 · 최고 레벨 100 ===== */
const qJ2Off=f=>{const a=QA_J2.auto,b=QA_ADV.auto;QA_J2.auto=false;QA_ADV.auto=false;try{return f()}finally{QA_J2.auto=a;QA_ADV.auto=b;J2UI.tab=null}};// 나무 창은 1차 탭으로 돌려 둔다
const qJ2Br=()=>{const o=[];for(const c in JOB2_IDS)for(const br of JOB2_IDS[c])o.push([c,br]);return o};
const QA_J2HIT={id:'qa_j2',n:'점검',cls:'',el:'arcane',rank:1,proc:1};
const qJ2Fill=id=>{const q=SQBY[id],s=sqState();if(!s.a[id])s.a[id]={c:{},got:[]};q.goals.forEach((g,j)=>s.a[id].c['g'+j]=g.n||1)};
qT('2차 전직 v19','데이터: 8갈래 × 12기술 · 위계 10~19 · 요구 레벨 50~92 · 갈래 계열(j_) · 이름·설명·아이콘 · 시전 시간 표 · 선행은 같은 갈래',()=>{const bad=[];let n=0;j2KindN();
  for(const [c,br] of qJ2Br()){const L=J2_SPELLS.filter(id=>SPELLS[id].job2===br);if(L.length!==12)bad.push(`${br} ${L.length}개`);
    for(const id of L){const s=SPELLS[id];n++;if(s.cls!==c)bad.push(id+' 직업');if(s.rank<10||s.rank>19)bad.push(id+' 위계');if(s.upLv!==RANK_LV_J2[s.rank-10]||reqLvOf(id)!==s.upLv)bad.push(id+' 요구 레벨');
      if(TREE[id]!=='j_'+br)bad.push(id+' 계열');if(!s.n||!s.desc||/[a-z]{3}/i.test(s.n))bad.push(id+' 이름 '+s.n);if(!/<(path|circle|g|rect)/.test(spellSvg(s).replace(/<rect x="\.5"[^>]*>/,'')))bad.push(id+' 아이콘');
      if(!TREEPOS[id]||TREEPOS[id].row!==s.rank-1)bad.push(id+' 칸');for(const p of PRE[id]||[])if(SPELLS[p].job2!==br)bad.push(`${id} 선행 ${p}`);if(!KINDN[s.kind])bad.push(id+' 종류 이름')}}
  for(const id in CAST_T_J2)if(CAST_T[id]!==CAST_T_J2[id])bad.push(id+' 시전 시간 표');for(const id in CHAN_J2)if(!CHAN[id])bad.push(id+' 채널링 표');
  const strip=h=>h.replace(/id="[^"]*"|url\(#[^)]*\)/g,''),ph=J2_SPELLS.filter(id=>PHYS_CLS[SPELLS[id].cls]),icons=new Set(ph.map(id=>strip(spellSvg(SPELLS[id]))));qOk(icons.size===ph.length,`전사·궁수 아이콘 겹침 ${ph.length-icons.size}`);
  qOk(!bad.length,bad.slice(0,8).join(', '));return `${n}개 기술 · 시전 시간 ${Object.keys(CAST_T_J2).length} · 채널링 ${Object.keys(CHAN_J2).length}`});
for(const [c,br] of qJ2Br())qT('2차 전직 v19',`${JOB2[c][br].n}: 전직 의뢰(50레벨) → 갈래 탭 → 배우기 → 쓰기 · 전직 전·다른 갈래는 못 배우고 못 씀 · 7점`,()=>qJ2Off(()=>{qPrep(c,{lvl:60});P.gold=0;P.invT=1e9;const J=JOB2[c][br],L=J2_SPELLS.filter(id=>SPELLS[id].job2===br);
  const atk=L.find(id=>SPELLS[id].rank===10&&isDmg(SPELLS[id]))||L.find(id=>SPELLS[id].rank===10&&SPELLS[id].kind!=='passive');
  P.sp=5;qOk(!canLearn(atk),'전직 전에 2차 기술을 배움');P.sk[atk]=1;P.cd={};qRecWait();tryCast(atk,{x:P.x+150,y:P.y});qOk(!(P.cd[atk]>0)&&!(CAST.cur&&CAST.cur.id===atk),'전직 전에 2차 기술을 씀');delete P.sk[atk];castReset();
  openPanel('tree');qOk(pbody.querySelector('[data-j2tab="adv"]'),'상위 기술 탭 없음');qOk(!pbody.querySelector('[data-j2tab="j2"]'),'전직 전에 갈래 탭');closePanel();
  const ids=J2_QUESTS.filter(q=>q.cls===c&&(!q.pick||q.pick===br)).map(q=>q.id),sp0=P.sp,lv0=P.lvl;
  for(const id of ids){qOk(sqAvail(SQBY[id])==='ok',`${id}: ${sqAvail(SQBY[id])}`);sqAccept(id);qOk(sqState().a[id],id+' 못 받음');qJ2Fill(id);sqFinish(id);qOk(sqState().d[id]>0,id+' 못 끝냄')}
  qOk(P.job2===br,`전직 안 됨 ${P.job2}`);qOk(P.sp-(P.lvl-lv0)===sp0+7,`스킬 포인트 +${P.sp-sp0-(P.lvl-lv0)} (7이어야 · 레벨 오름 빼고)`);qOk(P.bag.some(it=>it.j2u==='j2_'+br),'갈래 장비 없음');
  const other=JOB2_IDS[c].find(b=>b!==br),oq=J2_QUESTS.find(q=>q.pick===other);qOk(sqAvail(oq)==='hidden','다른 갈래 시험이 열려 있음');
  qOk(job2Title()===J.n,'칭호 '+job2Title());updateHud();qOk(el.title.textContent.includes(J.n),'HUD 칭호 '+el.title.textContent);
  openPanel('tree');qClick('#pbody [data-j2tab="j2"]');qOk(J2UI.tab==='j2','갈래 탭 안 열림');qOk(L.every(id=>pbody.querySelector(`[data-node="${id}"]`)),'갈래 나무에 없는 기술');qOk(L.every(id=>SPELLS[id].kind==='passive'||pbody.querySelector(`[data-node="${id}"] .cmk`)),'갈래 나무에 쓰는 방식 표시(즉시·시전·채널링) 없음');qOk(L.some(id=>pbody.querySelector(`[data-node="${id}"] .ptb`)),'갈래 나무에 파티/자신 표시 없음');
  qClick(`#pbody [data-node="${atk}"]`);const n0=P.sk[atk]|0;qClick(`#pbody [data-learn="${atk}"]`);qOk((P.sk[atk]|0)===n0+1,'갈래 탭에서 못 찍음');
  qClick('#pbody [data-tree="0"]');qOk(J2UI.tab===null&&!pbody.querySelector(`[data-node="${atk}"]`),'1차 탭으로 못 돌아감');
  const ob=J2_SPELLS.find(id=>SPELLS[id].job2===other&&SPELLS[id].kind!=='passive');qOk(!canLearn(ob),'다른 갈래 기술을 배움');closePanel();
  P.sk[atk]=10;const e=qDummy(P.x+160,P.y+20),s=SPELLS[atk];if(typeof clsGearFor==='function')clsGearFor(atk);if(PHYS_CLS[c])P.st.dex=Math.max(P.st.dex|0,600);P.cd={};qCast(atk,e);qStep(240,{render:false,until:()=>e.taken>0});
  /* v25: 물리 기술은 적중 판정이 있어 드물게 빗나감(전체 점검에서 그랜드 챌린지가 가끔 안 맞음) → 두 번까지 다시 */for(let k=0;k<2&&isDmg(s)&&!(e.taken>0);k++){P.cd={};P.mp=maxMp();qRecWait();castReset();qCast(atk,e);qStep(240,{render:false,until:()=>e.taken>0})}
  if(isDmg(s))qOk(e.taken>0,`${s.n} 안 맞음`);else qOk(P.cd[atk]>0||P.buffs[atk],`${s.n} 안 써짐`);
  P.sk[ob]=1;P.cd={};qRecWait();castReset();tryCast(ob,e);qOk(!(P.cd[ob]>0)&&!(CAST.cur&&CAST.cur.id===ob),'다른 갈래 기술을 씀');
  return `${s.n} ${isDmg(s)?Math.round(e.taken)+' 피해':'씀'} · 스킬 포인트 +7 · ${P.bag.find(it=>it.j2u).name}`}));
qT('2차 전직 v19','퀘스트 스킬 포인트: 위계 시험 10(10·23·31·38·45레벨) + 전직 7 = 17, 한 번만 · 일지·알림판에 「시험」「전직」 표시',()=>{const r=[];
  for(const c of ['mage','priest','warrior','archer']){qOk(J2_SP_ALL[c]===17,`${c} 합 ${J2_SP_ALL[c]}`);const sp=CT_QUESTS.filter(q=>q.cls===c).map(q=>[q.lvl,q.rw.sp|0]);qOk(JSON.stringify(sp)==='[[5,0],[10,1],[16,0],[23,1],[31,1],[38,3],[45,4]]',c+' '+JSON.stringify(sp));
    qOk(CT_QUESTS.filter(q=>q.cls===c).every(q=>q.goals.every(g=>g.type!=='pick')),'소속 고르기 목표가 남음')}
  qPrep('archer',{lvl:60});const s=sqState(),sp0=P.sp-P.lvl;/* 의뢰 경험치로 레벨이 오르는 점수는 뺌 */sqAccept('cta1');qOk(s.a.cta1,'cta1 못 받음');qOk(sqAvail(SQBY.cta2)==='locked','cta2가 먼저 열림');
  sqOpenLog();qOk(pbody.innerHTML.includes('qtg t'),'일지에 시험 표시 없음');qOk(pbody.innerHTML.includes('위계 시험'),'일지 요약 없음');closePanel();qOk(sqHudBlocks().some(b=>b.t.includes('qtg t')),'알림판 시험 표시 없음 '+sqHudBlocks().map(b=>b.t).join('|'));
  for(const id of ['cta1','cta2','cta3','cta4','cta5','cta6','cta7']){if(!s.a[id])sqAccept(id);qOk(s.a[id],id+' 못 받음');qJ2Fill(id);sqFinish(id);qOk(s.d[id]>0,id+' 못 끝냄')}
  qOk(P.sp-P.lvl===sp0+10,`시험 점수 ${P.sp-P.lvl-sp0}`);qOk(P.trial===7,'인증 단계 '+P.trial);r.push('시험 +10');
  s.a.cta7={c:{},got:[]};qJ2Fill('cta7');sqFinish('cta7');qOk(P.sp-P.lvl===sp0+10,'같은 의뢰로 두 번 받음');
  sqAccept('j2a1');qOk(sqHudBlocks().some(b=>b.t.includes('qtg j')),'알림판 전직 표시 없음');for(const id of ['j2a1','j2a2','j2a3b']){if(!s.a[id])sqAccept(id);qJ2Fill(id);sqFinish(id)}
  qOk(P.sp-P.lvl===sp0+17&&P.job2==='ranger',`전직 뒤 ${P.sp-P.lvl-sp0}점 · ${P.job2}`);r.push('전직 +7');
  s.a.j2a3a={c:{},got:[]};qJ2Fill('j2a3a');sqFinish('j2a3a');qOk(P.sp-P.lvl===sp0+17&&P.job2==='ranger','다른 갈래 시험으로 또 받음');
  P.gold=1e6;job2Swap('hawkeye');qOk(P.sp-P.lvl===sp0+17,'갈래를 바꾸며 의뢰 점수가 바뀜');r.push('다시 끝내기·갈래 바꾸기 0');
  qOk(Object.keys(P.qsp).length===8,'받은 기록 '+Object.keys(P.qsp).join());J2UI.tab=null;return r.join(' · ')});
qT('2차 전직 v19','갈래 바꾸기: 금화가 모자라면 안 됨 · 값 40,000+(레벨−50)×2,200 · 2차 점수만 돌려받음 · 단축칸 비움 · 다른 갈래 패시브는 꺼짐 · 전직관 단추',()=>{qPrep('warrior',{lvl:75});P.job2='guardian';
  const a=J2_SPELLS.filter(id=>SPELLS[id].job2==='guardian'&&SPELLS[id].kind!=='passive').slice(0,3);a.forEach((id,i)=>P.sk[id]=i+2);P.sk.slash=5;P.bar[0]=a[0];P.bar[1]='slash';P.sp=4;const st=JSON.stringify(P.st);
  const pid=J2_SPELLS.find(i=>SPELLS[i].job2==='berserker'&&SPELLS[i].kind==='passive'&&SPELLS[i].pv),pk=Object.keys(SPELLS[pid].pv)[0];passT=-1;const pv0=passSum(pk);
  qOk(job2SwapPrice()===40000+25*2200,'값 '+job2SwapPrice());P.gold=job2SwapPrice()-1;qOk(!job2Swap('berserker')&&P.job2==='guardian','금화가 모자란데 바뀜');
  SQV.mode='npc';SQV.npc=sqFolk('j2_warrior');openPanel('quest');qOk(pbody.querySelector('[data-j2swap="berserker"]'),'갈래 바꾸기 단추 없음');qClick('#pbody [data-j2swap="berserker"]');qOk(pbody.querySelector('[data-j2swapok="berserker"]').disabled,'금화가 모자란데 확인 단추가 켜짐');closePanel();
  P.gold=job2SwapPrice()+7;qOk(job2Swap('berserker'),'못 바꿈');qOk(P.job2==='berserker'&&P.job2n===1,'갈래');qOk(P.gold===7,'금화 '+P.gold);qOk(P.sp===4+2+3+4,'돌려받은 점수 '+(P.sp-4));
  qOk(P.sk.slash===5&&JSON.stringify(P.st)===st,'1차 점수·능력치가 바뀜');qOk(P.bar[0]===null&&P.bar[1]==='slash','단축칸');qOk(a.every(id=>!P.sk[id]),'예전 갈래 점수 남음');
  P.sk[pid]=5;passT=-1;const pv1=passSum(pk);P.job2='guardian';passT=-1;const pv2=passSum(pk);qOk(pv1>pv0&&pv2===pv0,`다른 갈래 패시브 ${pk}: ${qR(pv0)}→${qR(pv1)}→${qR(pv2)}`);
  return `레벨 75 값 ${job2SwapPrice().toLocaleString()} · 9점 돌려받음`});
qT('2차 전직 v19','경험치: 50→100은 1→50의 약 2.5배 사냥(같은 레벨 몬스터) · 50 위로 늘기만 함 · 레벨 50에 전직 알림 (v20: 최고 레벨은 140, 100 위는 3차 전직 묶음)',()=>{const kx=l=>1+.35*(l-1);let a=0,b=0;for(let l=1;l<50;l++)a+=xpNeedV20(l)/kx(l);for(let l=50;l<100;l++)b+=xpNeedV20(l)/kx(l);const r=b/a;/* v21: 기본 곡선 기준 */
  qOk(MAXLV>=100,'MAXLV '+MAXLV);qOk(r>2.35&&r<2.65,`배율 ${qR(r)}`);for(let l=50;l<MAXLV-1;l++)qOk(xpNeed(l+1)>xpNeed(l),`Lv${l}`);
  qPrep('mage',{lvl:49});P.xp=0;const n0=$('#log').textContent.length;gainXp(xpNeed(49));qOk(P.lvl===50,'50 안 됨');return new Promise(ok=>setTimeout(()=>{qOk(/2차 전직/.test($('#log').textContent.slice(Math.max(0,n0-200))),'전직 알림 없음');ok(`×${qR(r)} · Lv50 ${xpNeed(50).toLocaleString()} · Lv99 ${xpNeed(99).toLocaleString()}`)},400))});
qT('2차 전직 v19','v18 저장(레벨 55·60, 새 칸 없음): 그대로 불러오고 2차 전직 의뢰와 위계 시험 1번을 바로 받음 · 49레벨은 못 받음',()=>{const r=[];
  for(const [cls,lv] of [['mage',55],['priest',60],['warrior',60],['archer',55]]){qPrep(cls,{lvl:10});
    const d={v:5,slot:QA_SLOT,cls,lvl:lv,xp:0,gold:900,towns:['brenhill','arden','haven','willowen'],home:'brenhill',x:1500,y:3900,reg:'home',hp:100,mp:100,pot:{hp:2,mp:2},gear:{staff:null,robe:null,ring:null,amulet:null},bag:[],sk:{},sp:3,st:{},ap:0,diff:0,bar:Array(21).fill(null),uid:500,q:{i:0,st:0,c:{}},sq:{a:{},d:{},cd:{}}};
    qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT),'load 실패');qOk(P.lvl===lv&&P.job2===null&&P.trial===0&&!Object.keys(P.qsp).length&&P.sp===3,`${cls} 값 ${P.lvl}/${P.job2}/${P.trial}/${P.sp}`);qOk(!P.pot._j2,'새 칸이 없는데 사본이 생김');
    const j1=J2_QUESTS.find(q=>q.cls===cls&&!q.req),c1=CT_QUESTS.find(q=>q.cls===cls&&q.step===1);qOk(sqAvail(j1)==='ok',`${j1.id} ${sqAvail(j1)}`);qOk(sqAvail(c1)==='ok',`${c1.id} ${sqAvail(c1)}`);
    const g=sqFolk(j1.giver);qOk(g&&sqMark(g)==='!','전직관 ! 표시 없음');qOk(sqTalk(g)&&!panel.hidden&&pbody.querySelector(`[data-sqacc="${j1.id}"]`),'전직관 창에 의뢰 없음');qClick(`#pbody [data-sqacc="${j1.id}"]`);closePanel();
    qOk(sqState().a[j1.id],'전직 의뢰 못 받음');qOk(sqTarget(j1),'목표 자리 없음');r.push(`${cls} Lv${lv}`)}
  qPrep('mage',{lvl:49});qOk(sqAvail(SQBY.j2m1)==='low','49레벨에 전직 의뢰가 열림');qOk(sqAvail(SQBY.ctm1)==='ok'&&sqAvail(SQBY.ctp1)==='hidden','위계 시험 직업 구분');return r.join(' · ')});
qT('2차 전직 v19','「상위 기술」 탭: 전직 전 잠김(점수는 남음) · 전직 뒤 그 레벨이 되면 열림',()=>qJ2Off(()=>{const r=[];for(const c of ['mage','warrior']){qPrep(c,{lvl:60});const ids=ADV_IDS[c],id=ids[0],last=ids[ids.length-1];P.sp=5;P.sk[last]=2;
  openPanel('tree');qClick('#pbody [data-j2tab="adv"]');qOk(J2UI.tab==='adv','탭');const b=pbody.querySelector(`[data-node="${id}"]`);qOk(b&&b.classList.contains('lk'),'전직 전 잠김 표시 없음');qOk(!canLearn(id),'전직 전 찍힘');qOk(pbody.textContent.includes('2차 전직'),'안내 없음');qOk(P.sk[last]===2,'점수 사라짐');
  P.job2=JOB2_IDS[c][0];const s=SPELLS[last];P.lvl=s.upLv-1;renderPanel();qOk(!canLearn(last),'레벨 전에 찍힘');P.lvl=s.upLv;renderPanel();qOk(advUnlocked(last),'레벨이 돼도 안 열림');for(const i of ids)for(const p of PRE[i]||[])P.sk[p]=P.sk[p]||1;P.lvl=ptNeed(last);renderPanel();qOk(canLearn(last),`점수 레벨(${ptNeed(last)})이 돼도 못 찍음`);qOk(canLearn(id),`첫 상위 기술 ${id} ${reqLvOf(id)} ${advUnlocked(id)} ${PRE[id]}`);
  qClick(`#pbody [data-node="${last}"]`);qOk(J2UI.tab==='adv','기술을 고르니 탭이 바뀜');qClick(`#pbody [data-learn="${last}"]`);qOk(P.sk[last]===3,'못 찍음');closePanel();r.push(`${c} ${ids.length}개`)}return r.join(' · ')}));
qT('2차 전직 v19','저장: job2·job2n·qsp·trial 왕복 · 망가진 job2 → 전직 안 함(원래 값은 그대로 다시 저장) · 예전 판이 지운 칸을 물약 칸 사본에서 되살림(점수 두 번 안 줌) · v17 저장 기본값',()=>{qResetStore();qPrep('priest',{lvl:70,slot:QA_SLOT});
  P.job2='archbishop';P.job2n=2;P.qsp={ctp2:1,j2p1:1};P.trial=4;sqState().d.ctp1=1;save();const d=readSlot(QA_SLOT);
  qOk(d.job2==='archbishop'&&d.job2n===2&&d.qsp.ctp2===1&&d.trial===4,'저장 칸');qOk(d.pot._j2&&d.pot._j2.j==='archbishop','사본');
  qOk(load(d,QA_SLOT),'load');qOk(P.job2==='archbishop'&&P.job2n===2&&P.qsp.j2p1&&P.trial===4,'왕복');
  const bad=JSON.parse(JSON.stringify(d));bad.job2='zzz';bad.pot._j2.j='zzz';qOk(load(bad,QA_SLOT),'망가진 값 load');qOk(P.job2===null&&P.lvl===70&&P.trial===4,'망가진 job2');qOk(saveData().job2==='zzz','원래 값을 다시 저장 안 함');
  const v18=JSON.parse(JSON.stringify(d));delete v18.job2;delete v18.job2n;delete v18.qsp;delete v18.trial;v18.sq={a:{},d:{},cd:{}};qOk(load(v18,QA_SLOT),'v18 load');
  qOk(P.job2==='archbishop'&&P.trial===4&&P.qsp.ctp2&&P.job2n===2,'사본에서 못 되살림');const s=sqState();qOk(s.d.ctp4>0&&!s.d.ctp5&&s.d.j2p3b>0&&!s.d.j2p3a&&s.d.j2p1>0,'의뢰 기록 되살림');
  const sp=P.sp;s.a.ctp2={c:{},got:[]};qJ2Fill('ctp2');sqFinish('ctp2');qOk(P.sp===sp,'되살린 뒤 점수를 또 줌');
  const v17=JSON.parse(JSON.stringify(v18));v17.v=4;delete v17.pot._j2;delete v17.sq;qOk(load(v17,QA_SLOT),'v17');qOk(P.job2===null&&P.trial===0&&!Object.keys(P.qsp).length,'v17 기본값');
  qPrep('mage',{lvl:30,slot:QA_SLOT});save();qOk(!readSlot(QA_SLOT).pot._j2,'새 캐릭터에 사본이 생김');qResetStore();return 'job2·qsp·trial 왕복 · zzz 보존 · 사본 복구'});
qT('2차 전직 v19','시련의 문: 방 하나 · 보스 레벨 고정·생명력×0.85·피해×0.87 · 이기면 목표 완료·나가는 문 · 순례자·성문 실패 · 나가면 정리 · 같이 하기 중엔 못 들어감',()=>{const r=[];
  for(const [cls,qid] of [['mage','j2m3a'],['mage','j2m3b'],['priest','j2p3a'],['priest','j2p3b'],['warrior','j2w3a'],['warrior','j2w3b'],['archer','j2a3a'],['archer','j2a3b'],['mage','ctm6'],['priest','ctp6'],['warrior','ctw6'],['archer','cta6']]){
    qPrep(cls,{lvl:60});P.invT=1e9;const q=SQBY[qid];sqState().a[qid]={c:{},got:[]};const g=j2TrialGoal(qid);qOk(g,qid+' 시험 목표 없음');const T=TYPES[g.g.boss],D0=J2_TRIAL[g.g.boss]||CT_TRIAL[g.g.boss];
    qOk(T.hp===Math.round(D0.hp*.85)&&Math.abs(T.dmg-D0.dmg*.87)<.06,'생명력·피해 배율');qOk(j2TrialEnter(qid),qid+' 못 들어감');qOk(DG&&DG.j2t&&DG.rooms.length===1&&DG.portals.length===1,'방');
    for(let w=0;w<3&&DG.j2t.ph>0&&DG.j2t.ph<99;w++){for(const e of enemies)if(!e.dead)hurtE(e,e.hp+10,QA_J2HIT);qStep(3,{render:false})}
    const e=DG.j2t.e;qOk(e&&e.k===g.g.boss,qid+' 보스 없음');qOk(e.lvl===T.lvl,'레벨 '+e.lvl);
    if(T.escort)qOk(allies.filter(a=>a.pil).length===T.escort.cnt,'순례자 수');if(T.gate)qOk(allies.some(a=>a.gate),'성문 없음');if(T.trapWeak)qOk(e.trapWeak===T.trapWeak,'덫 약점');
    qStep(40,{render:true});if(T.shiftEl)qOk(e.weakEl,'약점 원소 없음');hurtE(e,e.hp+10,QA_J2HIT);qStep(3,{render:false});qOk(DG.j2t.res===1,qid+' 이겨도 통과 안 됨');qOk(sqGoalDone(q,g.j),'목표 안 채워짐');qOk(DG.portals.length>=2,'나가는 문');
    leaveDungeon();qOk(!DG&&!allies.some(a=>a.pil||a.gate),'정리 안 됨');r.push(T.n)}
  qPrep('priest',{lvl:60});P.invT=1e9;sqState().a.j2p3b={c:{},got:[]};j2TrialEnter('j2p3b');const pl=allies.filter(a=>a.pil);P.hp=maxHp()*.5;const h0=pl[0].hp=pl[0].max*.3;healP(maxHp()*.2);qOk(pl[0].hp>h0,'내 치유가 순례자에게 안 닿음');
  for(const a of pl)a.hp=0;qStep(3,{render:false});qOk(DG.j2t.res===-1,'순례자 모두 쓰러져도 실패 아님');qOk(!sqGoalDone(SQBY.j2p3b,0),'실패인데 목표 완료');leaveDungeon();
  qPrep('warrior',{lvl:60});P.invT=1e9;sqState().a.j2w3a={c:{},got:[]};j2TrialEnter('j2w3a');const gt=allies.find(a=>a.gate);const m=enemies[0];qOk(enemyTarget(m).tg===gt,'몬스터가 성문을 안 노림');clsFx(m,{taunt:5},P,P);if(typeof PTY==='object'&&PTY.taunt)PTY.taunt(m,0,5);qOk(enemyTarget(m).tg!==gt,'도발해도 성문을 노림');
  gt.hp=0;qStep(2,{render:false});qOk(DG.j2t.res===-1,'성문이 무너져도 실패 아님');leaveDungeon();
  qPrep('mage',{lvl:60});sqState().a.j2m3a={c:{},got:[]};try{qPeerOn();qOk(!j2TrialEnter('j2m3a')&&!DG,'같이 하기 중에 들어감')}finally{qPeerOff()}
  return r.join(' · ')});
qT('2차 전직 v19','모든 2차 공격 기술이 몬스터에게 맞음 (터뜨리기는 터뜨릴 것이 없어도 · 물러나며 쏘기 · 소환진 · 소환수 포함)',()=>{const bad=[],r=[];
  for(const c of QCLS){const L=qSpellList(c);for(const id of J2_SPELLS)if(SPELLS[id].cls===c&&isDmg(SPELLS[id])&&!L.includes(id))bad.push(id+' 적중 점검 목록에 없음')}r.push(J2_SPELLS.filter(id=>isDmg(SPELLS[id])).length+'개는 마법 적중 묶음(3곳)에서');// 공격 기술은 '마법 적중' 묶음이 하나씩 본다 · 여기서는 그 밖의 것만
  for(const id of J2_SPELLS){const s0=SPELLS[id];if(s0.swap||isDmg(s0)||!(s0.kind==='detonate'||s0.shot||(s0.kind==='field'&&s0.spawn)||(s0.kind==='summon'&&(s0.mult>0||s0.legion))))continue;
    const e=qCastPrep(s0.cls,id);P.job2=s0.job2;P.lvl=Math.max(P.lvl,s0.upLv);if(typeof clsGearFor==='function')clsGearFor(id);if(PHYS_CLS[s0.cls])P.st.dex=Math.max(P.st.dex|0,600);P.invT=1e9;
    qCast(id,{x:e.x,y:e.y});qOk(isFinite(P.x)&&isFinite(P.y),`${id}: 내 위치가 NaN`);qStep(s0.kind==='summon'||s0.spawn?480:240,{render:false,until:()=>e.taken>0});
    /* v25: 물리 기술은 적중 판정이 있어 드물게 빗나감(리트리팅 샷이 가끔 안 맞음) → 두 번까지 다시 */for(let k=0;k<2&&PHYS_CLS[s0.cls]&&!(e.taken>0);k++){P.cd={};P.mp=maxMp();qRecWait();castReset();qCast(id,{x:e.x,y:e.y});qStep(240,{render:false,until:()=>e.taken>0})}
    if(!(e.taken>0))bad.push(s0.n+'('+id+')');else r.push(id)}
  qOk(!bad.length,'안 맞음: '+bad.join(', '));return `${r[0]} · 그 밖 ${r.length-1}개 맞음`});
qT('2차 전직 v19','같이 하기: 동료의 2차 기술 유령 시전(8갈래)이 오류 없이 보이고 내 쪽 피해는 없음 · 정화는 나를 고른 시전만 · 모르는 기술 id는 무시',()=>{qPrep('mage',{lvl:60});P.invT=1e9;let n=0;
  try{for(const [c,br] of qJ2Br()){qClear();const r=qPeerOn();Object.assign(r,{cls:c,x:P.x+80,tx:P.x+80,y:P.y,ty:P.y});const e=qDummy(P.x+260,P.y);
      for(const id of J2_SPELLS.filter(id=>SPELLS[id].job2===br&&SPELLS[id].kind!=='passive')){netGhostCast({from:'qa_peer',sp:id,L:10,x:e.x,y:e.y,pw:200});qStep(3,{render:true});n++}
      qStep(30,{render:true});qOk(e.taken===0,`${br}: 유령 시전이 내 쪽에서 피해를 줌 ${Math.round(e.taken)}`);qOk(!allies.some(a=>a.j2),`${br}: 유령 시전이 내 소환수를 만듦`)}
    qClear();qPeerOn();P.j2imm=0;netGhostCast({from:'qa_peer',sp:'purifyhand',L:10,x:P.x,y:P.y,tg:'someone'});qStep(1,{render:false});qOk(!(P.j2imm>0),'남을 고른 정화가 나에게');
    netGhostCast({from:'qa_peer',sp:'purifyhand',L:10,x:P.x,y:P.y,tg:NET.id});qStep(1,{render:false});qOk(P.j2imm>0,'나를 고른 정화가 안 걸림');
    netGhostCast({from:'qa_peer',sp:'zz_v20_skill',L:10,x:P.x,y:P.y});netOnMsg({t:'j2x',k:'zz',from:'qa_peer'});qStep(2,{render:false})}finally{qPeerOff()}
  return `유령 시전 ${n}번`});
qT('2차 전직 v19','전직관 넷 · 기도처 · 정찰 표식: 자리 있음 · 의뢰 목표가 그곳을 가리킴 · 쓰면 목표 채워짐 · 시련 목표는 전직관',()=>{const r=[];
  for(const id in J2_INSTR){const f=sqFolk(id);qOk(f,id+' 없음');r.push(f.n)}qOk(sqFolk('elian').room==='arden_academy','엘리안은 마법원 안');
  qPrep('priest',{lvl:60});sqAccept('j2p1');const q=SQBY.j2p1;
  for(let j=0;j<q.goals.length;j++){const g=q.goals[j],t=sqTarget(q),sp=J2SPOT[g.use];qOk(sp&&t&&Math.hypot(t.x-sp.x,t.y-sp.y)<1,`${g.use} 목표 자리`);
    const d=sp.room?{x:sp.x,y:sp.y,use:g.use}:HOME.decor.find(d=>d.use===g.use);qOk(d&&sqUseLive(d),`${g.use} 쓸 수 없음`);sqUse(d);qOk(sqGoalDone(q,j),g.use+' 안 채워짐')}
  qOk(TWROOM.bren_chapel.items.some(i=>i[5]==='altar_brenhill'),'예배당 제단');
  qPrep('archer',{lvl:60});sqAccept('j2a1');const qa=SQBY.j2a1;for(let j=0;j<4;j++){const g=qa.goals[j],sp=J2SPOT[g.use];qOk(sp&&sp.reg===J2_SPOTS[g.use].region,'지역');const L=RCACHE[sp.reg],d=L.decor.find(d=>d.use===g.use);qOk(d,'표식 없음');
    qOk(!wxLiq(L,d.x,d.y),g.use+' 물 위');qOk(sqUseLive(d),'못 씀');sqUse(d);qOk(sqGoalDone(qa,j),'안 채워짐')}
  sqState().a.j2a3a={c:{},got:[]};const t=sqTarget(SQBY.j2a3a);qOk(t&&/시련의 문/.test(t.label),'시련 목표 자리');
  SQV.mode='npc';SQV.npc=sqFolk('j2_archer');openPanel('quest');qOk(pbody.querySelector('[data-j2trial="j2a3a"]'),'시련의 문 단추 없음');closePanel();return r.join(', ')});
qT('2차 전직 v19','칭호 · 갈래 장비: 1차는 8위계까지 · 시험 인증이 칭호 옆에 · 전직하면 2차 칭호 · 갈래 장비 8개(+1 갈래 기술이 기술 레벨에 더해짐)',()=>{qPrep('warrior',{lvl:60});P.trial=3;updateHud();qOk(el.title.textContent.includes(TRIAL_BADGE.warrior[3]),'인증 표시 '+el.title.textContent);qOk(rankOf(100)===8,'위계 '+rankOf(100));
  P.job2='berserker';updateHud();qOk(el.title.textContent===JOB2.warrior.berserker.n,'2차 칭호 '+el.title.textContent);const r=[];
  for(const k in J2U){const u=J2U[k],br=k.slice(3);qPrep(u.cls,{lvl:60});P.job2=br;const it=j2MakeUniq(k);qOk(it&&it.rar===4&&it.stats['tr_j_'+br]===1&&it.cls===u.cls,k);
    const id=J2_SPELLS.find(i=>SPELLS[i].job2===br&&SPELLS[i].kind!=='passive');P.sk[id]=3;const l0=skLv(id);P.gear[it.slot]=it;qOk(typeof canWear!=='function'||canWear(it,u.cls),k+' 못 입음');qOk(skLv(id)===l0+1,`${k}: 기술 레벨 ${l0}→${skLv(id)}`);qOk(statLine(it).includes(JOB2[u.cls][br].n),'옵션 이름');r.push(it.name)}
  return r.join(', ')});
qT('2차 전직 v19','2차 비공격 기술: 모두 써지고(재사용 대기) 강화는 표시가 남음 · 새 효과(정령 교감·소환진·자리 바꾸기·정령 군단·은총 전이·정화·왕관·방패 성벽·수호 돌진·반격·굳건함·공포·덫 던지기·연막·유인)가 실제로 걸림',()=>qJ2Off(()=>{const bad=[],r=[];
  const prep=id=>{const s=SPELLS[id];qPrep(s.cls,{lvl:Math.max(60,s.upLv)});P.job2=s.job2;P.sk[id]=10;if(typeof clsGearFor==='function')clsGearFor(id);P.invT=1e9;P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();return s};
  const mob=(dx,dy)=>{const e=dgMob('qa_dummy',P.x+dx,P.y+(dy||0),10);e.atkCd=1e9;e.aggroed=false;return e};
  for(const id of J2_SPELLS){const s0=SPELLS[id];if(s0.kind==='passive'||isDmg(s0)||s0.kind==='detonate'||s0.shot)continue;prep(id);
    if(s0.swap){P.sk.fireelem=5;qCast('fireelem',qAt(0,80))}if(s0.kind==='link'||s0.kind==='rez')continue;
    const ok=qCast(id,qAt(0,120));if(!ok)bad.push(s0.n+' 안 써짐');else if(s0.kind==='buff'&&!P.buffs[id])bad.push(s0.n+' 강화 표시 없음');else if(s0.kind==='buff')for(const k of J2_BX)if(s0[k]&&P.buffs[id][k]!==eff(id,10)[k])bad.push(`${s0.n} ${k}`)}
  qOk(!bad.length,bad.slice(0,6).join(', '));
  // 정령 교감: 소환수 강화 · 소환진: 정령이 나옴 · 자리 바꾸기 · 정령 군단 3종
  prep('communion');P.sk.fireelem=5;qCast('fireelem',qAt(0,80));const pet=allies.find(a=>a.j2&&a.s.id==='fireelem');qOk(pet,'불꽃 정령 없음');qCast('communion');qOk(pet.aw&&P.buffs.communion.petDmg>0,'교감이 소환수에 안 걸림');r.push('교감');
  prep('summoncircle');qCast('summoncircle',qAt(0,100));qStep(200,{render:false,each:()=>{P.invT=1e9}});qOk(allies.some(a=>a.wisp),'소환진에서 정령이 안 나옴');r.push('소환진');
  prep('swapplace');P.cd={};qRecWait();tryCast('swapplace',qAt(0,200));qOk(!(P.cd.swapplace>0),'소환수 없이 자리 바꾸기');P.sk.fireelem=5;qCast('fireelem',qAt(0,80));const fe=allies.find(a=>a.j2&&a.s.id==='fireelem');fe.x=P.x+300;fe.y=P.y;const ox=P.x;qCast('swapplace',{x:fe.x,y:fe.y});qOk(Math.abs(P.x-(ox+300))<2&&Math.abs(fe.x-ox)<2,`자리 안 바뀜 ${Math.round(P.x-ox)}`);r.push('자리 바꾸기');
  prep('spiritlegion');qCast('spiritlegion');qOk(allies.filter(a=>a.legion).length===3,'군단 '+allies.filter(a=>a.legion).length);r.push('군단');
  // 은총 전이 · 정화의 손
  prep('gracelink');P.cd={};qRecWait();tryCast('gracelink');qOk(!(P.cd.gracelink>0)&&!P.j2link,'혼자인데 은총 전이가 걸림');
  try{const {sent}=qPty(2,{dx:120});PTY.sel('qa_peer');qCast('gracelink');qOk(P.j2link&&P.j2link.id==='qa_peer','동료와 안 이어짐');P.hp=Math.round(maxHp()*.3);sent.length=0;healP(200);qOk(sent.some(m=>m.t==='j2x'&&m.k==='h'&&m.to==='qa_peer'&&m.a>0),'내 치유가 동료에게 안 감');
    sent.length=0;P.cd.purifyhand=0;qCast('purifyhand');qOk(!(P.j2imm>0),'동료를 골랐는데 나에게 정화')}finally{qPtyOff()}r.push('은총 전이');
  prep('purifyhand');PTY.pull={x:0,y:0,t:2};qCast('purifyhand');qOk(P.j2imm>0&&!PTY.pull,'정화가 안 걸림');r.push('정화');
  // 방패 성벽: 앞에서 오는 투사체 막음 · 반격 오라 · 굳건함 · 수호 돌진(혼자면 보호막+도발)
  prep('shieldwall');qCast('shieldwall');P.face=0;const pj={x:P.x+50,y:P.y,z:20,vx:-300,vy:0,r:6,dmg:10,owner:'e',life:1,col:'#fff'};projs.push(pj);j2Tick(.016);qOk(pj.life===0,'방패 성벽이 투사체를 못 막음');projs.length=0;r.push('성벽');
  prep('retaliation');qCast('retaliation');const ra=qDummy(P.x+60,P.y);P.invT=0;hitPlayer(20,ra);P.invT=1e9;qOk(ra.taken>0,'반격 없음');r.push('반격');
  prep('steadfast');qCast('steadfast');PTY.pull={x:0,y:0,t:2};j2Tick(.016);qOk(!PTY.pull,'굳건함인데 끌려감');r.push('굳건함');
  prep('guardrush');const gm=mob(100);qCast('guardrush',qAt(0,200));qOk(P.shield>0,'수호 돌진 보호막 없음');qOk(gm.tauntT>0||gm.tnt,'수호 돌진 도발 없음');r.push('수호 돌진');
  // 공포 · 덫 던지기 · 연막 · 유인
  prep('terrorroar');const fm=mob(100);qCast('terrorroar');qOk(fm.fearT>0,'공포 안 걸림');const fx0=fm.x;qStep(30,{render:false,each:()=>{P.invT=1e9}});qOk(fm.x>fx0+5,'겁먹고 안 달아남');r.push('공포');
  prep('traptoss');P.sk.blasttrap=5;qCast('traptoss');const nT=traps.length;qCast('blasttrap',qAt(0,450));const tp=traps[nT];qOk(tp&&Math.hypot(tp.x-P.x,tp.y-P.y)>250,'덫이 안 던져짐');r.push('덫 던지기');
  prep('smoke');const sm=mob(150);qCast('smoke',{x:sm.x,y:sm.y});qStep(3,{render:false});qOk(sm.blindT>0,'연막 안 걸림');r.push('연막');
  prep('lure');const lm=mob(260);qCast('lure',{x:P.x,y:P.y});const d0=Math.hypot(lm.x-P.x,lm.y-P.y);qStep(40,{render:false,each:()=>{P.invT=1e9}});qOk(Math.hypot(lm.x-P.x,lm.y-P.y)<d0-30,'유인 안 됨');r.push('유인');
  prep('crownofblessing');qCast('crownofblessing');qOk(P.buffs.crownofblessing&&P.buffs.crownofblessing.spreadOne,'왕관 표시');r.push('왕관');
  qClear();return r.join(' · ')}));
qT('2차 전직 v19','2차 패시브: 그 갈래로 전직해야 배움 · 배우면 그 능력치가 오름 · 단축칸에 안 들어가고 시전되지 않음 · 다른 갈래는 못 배움',()=>qJ2Off(()=>{const r=[];
  for(const id of J2_SPELLS){const s=SPELLS[id];if(s.kind!=='passive')continue;qPrep(s.cls,{lvl:95});P.sp=30;const other=JOB2_IDS[s.cls].find(b=>b!==s.job2);
    P.job2=other;qOk(!canLearn(id),`${s.n}: 다른 갈래인데 배움`);P.job2=null;qOk(!canLearn(id),`${s.n}: 전직 전에 배움`);P.job2=s.job2;
    const ks=Object.keys(s.pv);passT=-1;const b=ks.map(k=>passSum(k)),bar0=JSON.stringify(P.bar);qOk(learnPoint(id),`${s.n}: 못 배움`);passT=-1;
    for(let i=0;i<ks.length;i++)if(s.pv[ks[i]][0]>0)qOk(passSum(ks[i])>b[i],`${s.n}: ${ks[i]} 그대로`);qOk(JSON.stringify(P.bar)===bar0,`${s.n}: 단축칸에 들어감`);
    const mp=P.mp;P.cd={};tryCast(id,qAt(0,100));qOk(P.mp===mp&&!(P.cd[id]>0),`${s.n}: 시전됨`);r.push(s.n)}
  return `${r.length}개`}));
/* ===== v20 WORLD: 지옥 전용 두 지역 · 봉인문 · 야영지 · 던전 넷 · 재의 왕좌 (world3d.js · world3.js) ===== */
// 봉인 점검은 W3.qaOpen을 끄고, J3Q의 봉인 · 왕도 함수를 잠깐 바꿔 끼워 본다
const qW3Gate=(seal,cap,f)=>{const J=J3Q,a=J.sealOpen,b=J.capitalOpen,q=W3.qaOpen;W3.qaOpen=false;J.sealOpen=()=>seal;J.capitalOpen=()=>cap;try{return f()}finally{J.sealOpen=a;J.capitalOpen=b;W3.qaOpen=q}};
const qW3Edge=(id,to)=>RCACHE[id].edges.find(e=>e.to===to);
const qW3Use=(id,to)=>{qWxTo(id);const e=qW3Edge(id,to),iv=INW[e.side];P.x=e.x+iv[0]*50;P.y=e.y+iv[1]*50;qStep(1,{render:false});qOk(act==='edge'&&actEdge===e,`포탈 act=${act}`);return qMsgs(()=>doAct())};
const qW3Prep=(cls,lvl)=>{qPrep(cls||'mage',{lvl:lvl||120});P.diff=2;P.invT=1e9;return P};
function qW3Enter(id){const D=W3_DUNGEONS.find(d=>d.id===id);qWxTo(D.reg);const c=CAVES.find(c=>c.cave===D);qOk(c,'동굴 없음');qOk(qActAt(c.x,c.y+40)==='dungeon'&&actCave===c,`입구 act=${act}`);doAct();qOk(DG&&DG.d===D,'못 들어감');return{D,c}}
qT('v20 월드','지옥 전용 두 지역: REGIONS 끝에 고원 · 왕도 (옛 12곳 번호 그대로) · 지옥 레벨 100~120 · 120~140 · 몬스터 표',()=>{
  qOk(REG_IDS.slice(12,14).join()==='plateau,capital',`13·14번 ${REG_IDS.slice(12,14)}`);qOk(REG_IDS.indexOf('abyss')===11,'옛 지역 번호가 바뀜');
  for(const id of ['plateau','capital']){const D=REGIONS[id];qOk(D.hell&&D.mobs.length===4&&TYPES[D.boss],`${id} 자료`);for(const k of D.mobs)qOk(TYPES[k]&&TYPES[k].reg&&MON[TYPES[k].draw],`${k} 그림/표`)}
  qOk(REGIONS.abyss.edges.E==='plateau'&&REGIONS.plateau.edges.N==='capital'&&REGIONS.capital.edges.S==='plateau','길 연결');
  qW3Prep();qWxTo('plateau');const T=TOWNS[0];qOk(T.id==='pilgrimtent','고원 야영지');const l0=levelAt(T.x,T.y+SAFE+20)+DIFF[2].add,L=RCACHE.plateau,lN=levelAt(L.edges.find(e=>e.to==='capital').x,130)+DIFF[2].add;
  qOk(l0>=99&&l0<=102,`고원 마을 앞 Lv${qR(l0)}`);qOk(lN>=114&&lN<=120.01,`고원 북쪽 끝 Lv${qR(lN)}`);
  qWxTo('capital');const T2=TOWNS[0],c0=levelAt(T2.x+SAFE+30,T2.y)+DIFF[2].add,cl=levelAt(REG.lair.x,REG.lair.y)+DIFF[2].add;qOk(T2.id==='keeperhouse','왕도 야영지');
  qOk(c0>=119&&c0<=122,`왕도 마을 앞 Lv${qR(c0)}`);qOk(cl>=136&&cl<=140.01,`왕도 깊은 곳 Lv${qR(cl)}`);loadRegion('home');
  return `고원 ${qR(l0)}~${qR(lN)} · 왕도 ${qR(c0)}~${qR(cl)}`});
qT('v20 월드','들판 몬스터 100~140: 한 대 피해 = 같은 레벨 기본 생명력의 15~30% (지옥 레벨에서) · 경험치는 레벨 흐름대로 · 그리기 · 이동 NaN 없음',()=>{const out=[];
  for(const id of ['plateau','capital'])for(const k of REGIONS[id].mobs){const t=TYPES[k],L=t.min+40,hp=40+12*L+4*(10+1.5*(L-1)),pct=t.dmg*(1+.18*(L-1))/hp;
    qOk(pct>=.14&&pct<=.30,`${k} 한 대 ${Math.round(pct*100)}% (Lv${L})`);qOk(t.xp>=t.min*2.6&&t.xp<=t.min*3.6,`${k} 경험치 ${t.xp}`);out.push(`${t.n} ${Math.round(pct*100)}%`)}
  qW3Prep();for(const id of ['plateau','capital']){qWxTo(id);const T=TOWNS[0];P.x=T.x+SAFE+400;P.y=T.y+200;terrFix(P);followCam();qClear();P.invT=1e9;
    for(const k of REGIONS[id].mobs){const e=dgMob(k,P.x+rnd(-200,200),P.y+rnd(-200,200),110);e.aggroed=true}
    qStep(240,{renderEvery:20,each:()=>{P.hp=maxHp();P.invT=1e9}});qOk(enemies.every(e=>qNum(e.x)&&qNum(e.y)&&qNum(e.hp)),'NaN')}
  loadRegion('home');return out.join(' · ')});
qT('v20 월드','봉인문(심연의 균열 동쪽): 보통 · 악몽은 「지옥 난이도에서만 열리는 봉인」, 지옥은 재의 열쇠 전까지 닫힘, 열쇠 뒤 고원으로 · 포탈 이름 · 짝문 · 같이 하기 요청',()=>{qW3Prep();const out=[];
  qW3Gate(false,false,()=>{for(const df of [0,1]){P.diff=df;const m=qW3Use('abyss','plateau');qOk(REG.id==='abyss','닫혔는데 넘어감');qOk(m.some(t=>t.includes('지옥 난이도에서만 열리는 봉인')),`${DIFF[df].n} 메시지 ${m}`);
      qStep(16,{render:false});qOk(qW3Edge('abyss','plateau').label.includes('닫힘'),'닫힌 포탈 이름');out.push(DIFF[df].n+' 닫힘')}
    P.diff=2;const m=qW3Use('abyss','plateau');qOk(REG.id==='abyss','열쇠 없이 넘어감');qOk(m.some(t=>t.includes('재의 열쇠')),`지옥 메시지 ${m}`);out.push('지옥(열쇠 없음) 닫힘');
    // 짝문: 가 본 적 있어도 닫혀 있으면 건너갈 수 없음 · 창에 「봉인됨」
    P.towns.push('pilgrimtent');const T=RCACHE.plateau.town;qOk(travelTown(T)===true&&REG.id==='abyss','짝문으로 넘어감');actTown=TOWNS[0];qOk(gateHtml().includes('봉인됨'),'짝문 창에 봉인 표시 없음');
    // 같이 하기: 참가자의 요청도 방장 쪽 봉인을 따른다
    try{const {sent}=qPty(2,{host:true});netOnMsg({t:'req',from:'qa_peer',a:'reg',id:'plateau',x:200,y:3000});qOk(REG.id==='abyss','요청으로 넘어감');qOk(sent.some(m=>m.t==='j3x'&&m.k==='w3m'),'참가자에게 이유를 안 보냄')}finally{qPtyOff()}});
  qW3Gate(true,false,()=>{P.diff=2;qStep(16,{render:false});const e=qW3Edge('abyss','plateau');qOk(e.label.includes('Lv100'),`열린 포탈 이름 ${e.label}`);qW3Use('abyss','plateau');qOk(REG.id==='plateau','열렸는데 못 넘어감');out.push('지옥(열쇠) → 고원');
    loadRegion('abyss');qOk(travelTown(RCACHE.plateau.town)===true&&REG.id==='plateau','열렸는데 짝문이 막힘')});
  loadRegion('home');return out.join(' · ')});
qT('v20 월드','고원 → 왕도 길: 「잿빛 성가대의 무덤」 전에는 재의 장막, 뒤에는 열림 · 지옥이 아니면 고원에서 심연의 균열로 돌려보냄 · 지옥 전용 지역에서 난이도 못 바꿈',()=>{qW3Prep();const out=[];
  qW3Gate(true,false,()=>{const m=qW3Use('plateau','capital');qOk(REG.id==='plateau','장막인데 넘어감');qOk(m.some(t=>t.includes('재의 장막')),`메시지 ${m}`);out.push('장막 닫힘');
    actTown=TOWNS[0];const h=gateHtml();qOk(/data-diff="0" disabled/.test(h)&&/data-diff="1" disabled/.test(h)&&!/data-diff="2" disabled/.test(h),'난이도 단추가 안 막힘');
    P.diff=0;qStep(20,{render:false});qOk(REG.id==='abyss','보통인데 고원에 남음');out.push('보통 → 심연의 균열');P.diff=2});
  qW3Gate(true,true,()=>{qW3Use('plateau','capital');qOk(REG.id==='capital','열렸는데 못 넘어감');out.push('왕도 열림');qStep(10,{renderEvery:5})});
  // 불러오기: 지옥 전용 지역에 보통으로 저장된 경우 → 심연의 균열 마을
  qW3Gate(true,true,()=>{qWxTo('plateau');const d=JSON.parse(JSON.stringify(saveData()));qOk(d.reg==='plateau','저장 지역');d.diff=0;qOk(load(d,QA_SLOT),'load 실패');qOk(REG.id==='abyss'&&!blockedAt(P.x,P.y),`불러온 지역 ${REG.id}`);out.push('불러오기 안전')});
  loadRegion('home');return out.join(' · ')});
qT('v20 월드','야영지: 순례자의 천막(짝문 · 상점 하나 · 창고 · 천막) · 꺼진 등대지기의 집(짝문 · 상점 하나 · 창고 없음) · F 동작 · 사람 겹침 없음',()=>{qW3Prep();const out=[];
  for(const id of ['plateau','capital']){qWxTo(id);const t=TOWNS[0],L=RCACHE[id];qOk(t.shops.length===1&&t.shop.x===t.shops[0].x,`${t.id} 상점 ${t.shops.length}`);
    qOk(L.decor.filter(d=>d.k==='shop'&&d.town===t).length===1,'상점 그림 수');qOk(qActAt(t.gate.x+30,t.gate.y)==='gate','짝문 act');qOk(qActAt(t.shops[0].x,t.shops[0].y+30)==='shop','상점 act');
    if(id==='plateau'){qOk(t.stash&&qActAt(t.stash.x,t.stash.y+20)==='stash','창고 act');const n=L.decor.filter(d=>d.k==='w3tent').length;qOk(n>=6,`천막 ${n}`);qOk(!L.decor.some(d=>d.k==='bld'&&d.town===t),'집이 남음');out.push(`천막 ${n}`)}
    else{qOk(t.stash===null&&!L.decor.some(d=>d.k==='stash'&&d.town===t),'창고가 있음');const b=L.decor.filter(d=>d.k==='bld'&&d.town===t);qOk(b.length===1&&TW.blds[id].includes(b[0]),`집 ${b.length}`);
      qOk(qActAt(t.x+75,t.y+175)!=='stash','창고 act');out.push('창고 없음')}
    const a=wxTownAudit(L,t);qOk(!a.bad.length,`${t.id}: ${a.bad.slice(0,3).map(b=>b.join(' ')).join('; ')}`);
    const fk=L.decor.filter(d=>d.k==='tfolk'&&d.town===t);for(const f of fk)qOk(!TW.blds[id].some(b=>b.foot&&b.foot.some(q=>f.x>q[0]-8&&f.x<q[2]+8&&f.y>q[1]-8&&f.y<q[3]+8)),`${f.n}이(가) 천막/집 안`);
    qStep(30,{renderEvery:5});out.push(`${t.n} 사람 ${fk.length}`)}
  loadRegion('home');return out.join(' · ')});
qT('v20 월드','걸어서 닿음: 두 지역의 짝문 · 상점 · 창고 · 포탈 · 동굴 5곳 · 둥지, 그리고 W3.where 목표 자리 (물/용암 + 절벽)',()=>{let n=0;const bad=[];
  for(const id of ['plateau','capital']){const {L,ok}=qWxReach(id),t=L.town,pts=[['짝문',t.gate],['상점',t.shop],['창고',t.stash],...L.edges.map(e=>['포탈 '+e.side,{x:e.x+INW[e.side][0]*170,y:e.y+INW[e.side][1]*170}]),...L.caves.map(c=>['동굴 '+c.cave.n,{x:c.x,y:c.y+40}]),['둥지',L.lair]];
    for(const [nm,p] of pts){if(!p)continue;n++;if(!wxCanReach(ok,p.x,p.y))bad.push(`${id} ${nm}`)}}
  {const {ok}=qWxReach('abyss'),e=qW3Edge('abyss','plateau');n++;if(!wxCanReach(ok,e.x-170,e.y))bad.push('심연의 균열 봉인문')}
  for(const k of ['seal','trial','capitalGate','throne',...W3_DUNGEONS.map(d=>d.id)]){const w=W3.where(k);qOk(w&&w.reg&&qNum(w.x)&&w.label,`where(${k})`)}
  qOk(!bad.length,'못 닿음: '+bad.join(', '));return `${n}곳`});
qT('v20 월드','의뢰 표시: J3Q.trialAt · hookAt(성가대 · 군주) = W3.where · 고향에서 고원/왕도 목표로 가는 다음 포탈 · 작은 지도 그리기',()=>{qW3Prep();const J=J3Q;
  qOk(J.trialAt&&J.trialAt.reg==='plateau'&&J.trialAt.cave===W3.where('trial').cave,'trialAt');qOk(J.hookAt.choir&&J.hookAt.choir.reg==='plateau'&&J.hookAt.ash&&J.hookAt.ash.reg==='capital','hookAt');
  loadRegion('home');const r=qRoute(W3.where('throne'));qOk(r&&r.k==='edgeportal','고향에서 다음 포탈 없음');qWxTo('abyss');const r2=qRoute(W3.where('pt_choir'));qOk(r2&&r2.to==='plateau','심연의 균열에서 봉인문으로 안 감');
  qWxTo('plateau');const r3=qRoute(W3.where('throne'));qOk(r3&&r3.to==='capital','고원에서 왕도 길로 안 감');const tg=W3.where('pt_corridor');qOk(qRoute(tg)===tg,'같은 지역 목표');
  for(const id of ['plateau','capital']){qWxTo(id);mmBg=null;drawMinimap();qOk(!qBad().length,'NaN')}
  const z=wxKillTarget(['b_w3dean'],'keeperhouse');qOk(z&&z.reg==='capital'&&/지옥 Lv128$/.test(z.label),`토벌 목표 ${z&&z.label}`);
  const f=wxRegZone('capital','z_golem');qOk(f&&qNum(f.x),'들판 자리');loadRegion('home');return `trial ${J.trialAt.label} · ${z.label}`});
qT('v20 월드','시험의 방 입구: F → J3Q.enterTrial() (던전을 만들지 않음) · 참가자는 방장에게 함께 들어가자고 청함 (v22)',()=>{qW3Prep();const J=J3Q,keep=J.enterTrial;let n=0;J.enterTrial=()=>{n++;return false};
  try{const D=W3_DUNGEONS.find(d=>d.id==='pt_trials');qWxTo('plateau');const c=CAVES.find(c=>c.cave===D);qOk(qActAt(c.x,c.y+40)==='dungeon'&&actCave===c,`act=${act}`);
    doAct();qOk(n===1&&!DG,'F로 안 부름');enterDungeon(c);qOk(n===2&&!DG,'enterDungeon 경로');
    const {sent}=qPty(2);NET.guest=true;NET.hostId='qa_peer';qActAt(c.x,c.y+40);doAct();qOk(n===2&&sent.some(m=>m.t==='req'&&m.a==='dungeon'&&m.cid==='pt_trials'&&m.rg==='plateau'),'참가자가 방장에게 시험의 방 요청을 안 보냄')}
  finally{J.enterTrial=keep;qPtyOff()}loadRegion('home');return '2번 부름 · 참가자는 방장에게 청함'});
for(const D of W3_DUNGEONS.filter(d=>!d.w3k))qT('v20 월드',`던전 ${D.n} (지옥 ${D.lvl+40}): 들어가기 · 보스 · 준보스 · 처치 · 빛나는 문 → 동굴 앞`,()=>{qW3Prep('mage',110);const {c}=qW3Enter(D.id);
  const bs=enemies.filter(e=>TYPES[e.k].boss),ms=enemies.filter(e=>TYPES[e.k].mini);qOk(bs.length===1&&bs[0].k===D.boss&&bs[0].lvl===D.lvl+42,`보스 ${bs.map(e=>e.k+e.lvl)}`);qOk(ms.length===2&&D.minis.every(k=>ms.some(e=>e.k===k)),`준보스 ${ms.map(e=>e.k)}`);
  qOk(enemies.filter(e=>!TYPES[e.k].boss&&!TYPES[e.k].mini).every(e=>D.mobs.includes(e.k)),'다른 졸개');qStep(20,{renderEvery:10});
  const e=DG.boss,n0=DG.portals.length;loot=[];hurtE(e,e.hp+10,{el:'fire'});qOk(e.dead&&DG.bossDead&&DG.portals.length===n0+1,'처치 · 빛나는 문');
  const ex=DG.portals[DG.portals.length-1];qOk(qActAt(ex.x,ex.y)==='exit','빛나는 문 act');doAct();qOk(!DG&&REG.id===D.reg&&Math.hypot(P.x-c.x,P.y-c.y-80)<2,`나온 자리 ${REG.id}`);loadRegion('home');return `${TYPES[D.boss].n} Lv${e.lvl}`});
qT('v20 월드','던전 보스 장치: 카델 봉인석 보호막(혼자 2 · 파티 3) · 모르디스 「재의 성가」 끊기/회복 · 이그나시우스 룬 비 · 바르테인 죽음의 표식(따라감) · 근위병',()=>{const out=[];
  try{for(const party of [0,1]){qW3Prep('mage',110);qW3Enter('pt_corridor');const e=DG.boss;if(party)qPty(2,{host:true,dx:60});e.aggroed=true;e.hp=Math.round(e.max*.55);qStep(2,{render:false});
      const ss=enemies.filter(o=>o.guard===e&&!o.dead);qOk(ss.length===(party?3:2)&&ss.every(o=>o.k==='w3_sealstone'),`봉인석 ${ss.length}`);qOk(e.gsh&&PTY.dmgMul(e,0)<=.21,'보호막');
      for(const o of ss)hurtE(o,o.hp+10,{el:'fire'});qStep(2,{render:false});qOk(!e.gsh&&e.stg>=25,'봉인석을 다 부쉈는데 보호막');out.push(`카델 ${party?'파티':'혼자'} ${ss.length}`);qPtyOff();leaveDungeon()}
    qW3Prep('mage',110);qW3Enter('pt_choir');let e=DG.boss;e.aggroed=true;P.x=e.x+200;P.y=e.y;e.bcT=0;qStep(1,{render:false});qOk(e.bc>0&&e.w3bc&&warns.some(w=>w.src===e&&w.rad===320),'성가 시작');
    const m=qMsgs(()=>PTY.stagFx(e,{stun:1}));qOk(!(e.bc>0)&&m.some(t=>t.includes('「재의 성가」을 끊었습니다')),`끊기 ${m}`);qStep(2,{render:false});
    e.hp=Math.round(e.max*.5);e.bcT=0;e.stunT=0;e.brk=0;qStep(1,{render:false});const h0=e.hp;qStep(170,{render:false,each:()=>{P.hp=maxHp();P.invT=1e9}});qOk(e.hp>=h0+e.max*.05,'끝까지 울렸는데 회복 안 함');out.push('모르디스 끊기 · 회복');
    const ex=DG.portals.find(p=>p.exit);leaveDungeon();
    qW3Prep('mage',110);qW3Enter('cp_academy');e=DG.boss;e.aggroed=true;P.x=e.x+150;P.y=e.y;e.w3rT=0;const w0=warns.length;qStep(1,{render:false});const rw=warns.filter(w=>w.src===e&&w.rad===120);qOk(rw.length>=1&&rw.some(w=>Math.hypot(w.x-P.x,w.y-P.y)<40),`룬 비 ${rw.length}`);/* v21: 주변 두 곳은 벽이면 빠지므로 발밑 하나만 꼭 */out.push('이그나시우스 룬 비');leaveDungeon();
    qW3Prep('mage',110);qW3Enter('cp_ossuary');e=DG.boss;e.aggroed=true;P.x=e.x+150;P.y=e.y;e.hp=Math.round(e.max*.45);e.w3mT=0;qStep(1,{render:false});
    qOk(enemies.filter(o=>o.k==='z_guard'&&o.aggroed).length>=2,'근위병');const w=warns.find(w=>w.src===e&&w.rad===180);qOk(w&&W3.fol.some(f=>f.w===w),'죽음의 표식');
    const d0=Math.hypot(w.x-P.x,w.y-P.y);P.x+=160;qStep(30,{render:false,each:()=>{P.invT=1e9}});qOk(Math.hypot(w.x-P.x,w.y-P.y)<d0+40,'표식이 안 따라옴');out.push('바르테인 표식 · 근위병');leaveDungeon();void ex;void w0}
  finally{qPtyOff();if(DG)leaveDungeon();loadRegion('home')}return out.join(' · ')});
qT('v20 월드','재의 왕좌: 정해진 둥근 방 · 기둥 셋(벽 칸) · 재의 군주 Lv140 하나 · 나가는 문 · 같이 하기 자료에 같은 격자',()=>{qW3Prep('mage',130);const {D}=qW3Enter('cp_throne');
  qOk(DG.rooms.length===2&&enemies.length===1&&DG.boss.k==='b_ashlord'&&DG.boss.lvl===140,`방 ${DG.rooms.length} · 몬스터 ${enemies.map(e=>e.k+e.lvl)}`);
  for(const [i,j] of W3A.pil){qOk(!dgFloor(i,j)&&dgFloor(i+1,j)&&dgFloor(i-1,j)&&DG.walls.some(w=>w.i===i&&w.j===j),`기둥 ${i},${j}`)}
  qOk(W3.ar&&W3.ar.pil.length===3,'기둥 상태');const dd=netDgData();qOk(dd.g.length===DN*DN&&dd.rooms.length===2,'같이 하기 자료');
  const st=bfs(DG.g,DG.start.cx,DG.start.cy),bt=dgTile(DG.boss.x,DG.boss.y);qOk(st[tIdx(bt.i,bt.j)]>0,'군주까지 못 걸어감');for(const p of W3.ar.pil){const q=qFreeAt(p.x,p.y,110,0);qOk(q,'기둥 곁 자리 없음')}
  qStep(30,{renderEvery:5});leaveDungeon();loadRegion('home');return `${D.n} · 기둥 ${W3A.pil.map(p=>p.join(',')).join(' / ')}`});
// 기둥 곁에 세운다 (방 가운데 쪽)
const qW3Hold=(o,p)=>{const a=Math.atan2(2350-p.y,2850-p.x),q=qFreeAt(p.x,p.y,105,a);o.x=q.x;o.y=q.y;if(o.tx!=null){o.tx=q.x;o.ty=q.y}};
qT('v20 월드','재의 군주 혼자: 수호 정령 둘 · 「이름 부르기」 동안 남은 기둥에 서면 불 → 무너짐(breakAdd)으로 끊김 · 못 지키면 모두 피해 + 군주 회복 · 이름 불린 사람을 따라가는 원',()=>{qW3Prep('mage',130);qW3Enter('cp_throne');
  const e=DG.boss,A=W3.ar,hits=[],keep=hitPlayer;e.aggroed=true;e.id=e.id||++NET.eid;
  hitPlayer=function(d,src){if(src===e)hits.push(d);return keep.apply(this,arguments)};
  try{const inv={each:()=>{P.hp=maxHp();P.invT=1e9}};qStep(2,{render:false,...inv});qOk(A.pil.map(p=>p.sp).join()==='0,1,1',`정령 ${A.pil.map(p=>p.sp)}`);
    e.w3cT=.01;qStep(2,{render:false,...inv});qOk(e.w3c>15&&e.w3c<=16,`외우기 ${e.w3c}`);qOk(enemies.some(o=>o.k==='w3_shade'),'그림자 없음');
    qW3Hold(P,A.pil[0]);let br=-1;qStep(16*60,{renderEvery:30,...inv,until:i=>{if(e.brk>0){br=i;return true}return false}});
    qOk(br>0&&!(e.w3c>0),`무너지지 않음 (게이지 ${qR(e.stg||0)} · 불 ${A.pil.map(p=>qR(p.lit))})`);qOk(A.pil.every(p=>p.lit===0),'끝난 뒤 불이 남음');const tb=qR(br/60);
    // 못 지킴: 기둥에서 떨어져 있으면 정령 둘만 → 꺼진 기둥 1 → 피해 ×1.75 + 3% 회복
    qStep(6*60,{render:false,...inv});enemies=enemies.filter(o=>o===e);e.brk=0;e.stunT=0;e.stg=0;e.hp=Math.round(e.max*.5);P.x=2850;P.y=2700;qStep(1,{render:false,...inv});
    e.w3cT=.01;e.w3nT=99;qStep(2,{render:false,...inv});const h0=e.hp,n0=hits.length;qStep(17*60,{render:false,...inv,until:()=>!(e.w3c>0)});
    const big=hits.slice(n0).filter(d=>d>=e.dmg*1.7);qOk(big.length>=1,`실패 피해 없음 ${hits.slice(n0).map(Math.round)} · 외우기 ${qR(e.w3c||0)}/${qR(e.w3cT||0)} 무너짐 ${qR(e.brk||0)} 게이지 ${qR(e.stg||0)} 불 ${A.pil.map(p=>qR(p.lit))} P ${Math.round(P.x)},${Math.round(P.y)}`);qOk(e.hp>h0+e.max*.02,'군주가 회복 안 함');
    // 이름 부르기: 나를 따라오는 원, 굳으면 그 자리
    e.w3cT=99;e.w3nT=.01;qStep(1,{render:false,...inv});const w=warns.find(w=>w.src===e&&w.rad===150);qOk(w&&W3.fol.some(f=>f.w===w),'이름 부르기 원');
    P.x+=180;const d0=Math.hypot(w.x-P.x,w.y-P.y);qStep(40,{render:false,...inv});qOk(Math.hypot(w.x-P.x,w.y-P.y)<d0*.5,'원이 안 따라옴');
    return `무너짐 ${tb}초 · 실패 피해 ${Math.round(big[0])} (군주 dmg ${Math.round(e.dmg)})`}
  finally{hitPlayer=keep;if(DG)leaveDungeon();loadRegion('home')}});
qT('v20 월드','재의 군주 파티(가짜 동료 1): 정령 하나 · 나와 동료가 기둥 둘을 지키면 무너짐 · 참가자에게 기둥 상태(w3a) · 메시지(w3m) 보냄 · 참가자 화면이 받아 그림',()=>{qW3Prep('warrior',130);qW3Enter('cp_throne');
  const e=DG.boss,A=W3.ar;e.aggroed=true;e.id=e.id||++NET.eid;try{const {r,sent}=qPty(2,{host:true});const inv={each:()=>{P.hp=maxHp();P.invT=1e9;r.hp=r.max}};qStep(2,{render:false,...inv});
    qOk(A.pil.map(p=>p.sp).join()==='0,0,1',`정령 ${A.pil.map(p=>p.sp)}`);e.w3cT=.01;qStep(2,{render:false,...inv});qOk(e.w3c>11&&e.w3c<=12,`파티 외우기 ${e.w3c}`);
    qW3Hold(P,A.pil[0]);qW3Hold(r,A.pil[1]);let br=-1;qStep(12*60,{renderEvery:30,...inv,until:i=>{if(e.brk>0){br=i;return true}return false}});qOk(br>0,`무너지지 않음 (게이지 ${qR(e.stg||0)} · 불 ${A.pil.map(p=>qR(p.lit))})`);
    const a=sent.filter(m=>m.t==='j3x'&&m.k==='w3a');qOk(a.length>=5&&a[0].l.length===3,'기둥 상태를 안 보냄');qOk(sent.some(m=>m.t==='j3x'&&m.k==='w3m'),'메시지를 안 보냄');
    // 참가자 화면: 받은 상태를 그대로 그림
    const last=a[a.length-1];NET.host=false;NET.guest=true;NET.hostId='qa_peer';J3NET.w3a({l:[100,50,0],s:[0,0,1],h:[1,1,1],c:55,m:100});qOk(A.pil[0].lit===1&&A.pil[1].lit===.5&&A.c===5.5,'참가자 기둥 상태');
    render();qOk(!qBad().length,'참가자 그리기');void last;return `무너짐 ${qR(br/60)}초 · 보낸 상태 ${a.length}번`}
  finally{qPtyOff();if(DG)leaveDungeon();loadRegion('home')}});
qT('v20 월드','재의 군주 전리품: 직업마다 3차 전용 상급 유니크(첫 처치 확정) · J3Q.onAshLordKill · 3차 전직 전엔 못 낌 · 아이콘 · 저장(w3) · 성가대장 → J3Q.onChoirBossKill',()=>{const out=[],J=J3Q,k1=J.onAshLordKill,k2=J.onChoirBossKill;let na=0,nc=0;
  J.onAshLordKill=function(e){na++;return k1.apply(this,arguments)};J.onChoirBossKill=function(e){nc++;return k2.apply(this,arguments)};
  try{for(const cls of ['mage','priest','warrior','archer']){qW3Prep(cls,130);qW3Enter('cp_throne');const e=DG.boss;loot=[];const a0=na;hurtE(e,e.hp+10,{el:'fire'});qOk(e.dead&&DG.bossDead,'안 쓰러짐');
      const u=W3_UNIQ.find(x=>x.cls===cls),it=loot.map(l=>l.item).find(i=>i&&i.w3u);qOk(it&&it.name===u.n&&it.rar===5&&it.il===102&&it.cls===cls,`${cls} 유니크 ${it&&it.name}`);qOk(na===a0+1,'onAshLordKill 안 부름');qOk(P.w3.lord===1,'처치 수');
      qOk(!canWear(it)&&itemRow(it,'<button type="button" data-equip="1">착용</button>').includes('3차 전직 뒤에'),'3차 전 착용 제한');P.job3='qa3';qOk(canWear(it),'3차 뒤에도 못 낌');P.job3=null;
      const sp=iconSpec(itemIconKey(it));qOk(sp&&sp.o===IUNQ[u.n]&&sp.paint===(IPAINT[u.wt||u.slot]?u.wt||u.slot:'generic'),'아이콘');iconCanvas(itemIconKey(it),1);
      for(const k of Object.keys(it.stats))qOk(qNum(it.stats[k]),`${k} NaN`);
      const d=JSON.parse(JSON.stringify(saveData()));qOk(d.w3&&d.w3.lord===1,'저장에 w3 없음');leaveDungeon();qPrep(cls,{slot:6});qOk(load(d,QA_SLOT)&&P.w3.lord===1,'불러온 w3');
      const d2=Object.assign({},d);delete d2.w3;qOk(load(d2,QA_SLOT)&&P.w3.lord===0,'w3 없는 옛 저장');out.push(`${cls} ${it.name}`)}
    // 두 번째 처치부터는 40%쯤
    qW3Prep('mage',130);P.w3={lord:3};qW3Enter('cp_throne');const e=DG.boss;let got=0;QA.reseed(777);for(let i=0;i<200;i++){loot=[];dgBossDrop(e);if(loot.some(l=>l.item&&l.item.w3u))got++}qOk(got>50&&got<110,`두 번째부터 ${got}/200`);leaveDungeon();
    qW3Prep('mage',110);qW3Enter('pt_choir');hurtE(DG.boss,DG.boss.hp+10,{el:'fire'});qOk(nc===1,'onChoirBossKill 안 부름');leaveDungeon();out.push(`재처치 ${got}/200`)}
  finally{J.onAshLordKill=k1;J.onChoirBossKill=k2;if(DG)leaveDungeon();loadRegion('home')}return out.join(' · ')});
qT('v20 월드','그리기: 고원 · 왕도 야영지 · 봉인문(닫힘/열림) · 장막 · 시험의 방 · 왕좌 문 · 왕좌 기둥 · 재 내림 — 구운 그림이 생기고 NaN · 오류 없음',()=>{qW3Prep();const out=[];
  qW3Gate(false,false,()=>{qWxTo('abyss');const e=qW3Edge('abyss','plateau');P.x=e.x-160;P.y=e.y;followCam();qStep(24,{renderEvery:2});qOk(SC.map.has('w3/seal'),'봉인 그림')});
  qWxTo('plateau');const L=RCACHE.plateau;P.x=L.town.x;P.y=L.town.y+60;followCam();qStep(24,{renderEvery:2});qOk(SC.map.has('twp/w3tent/0')||SC.map.has('twp/w3tent/1'),'천막 그림');
  const tc0=L.caves.find(c=>c.cave.w3k==='trial');P.x=tc0.x;P.y=tc0.y+120;followCam();qStep(24,{renderEvery:2});qOk(SC.map.has('w3/trial'),'시험의 방 그림');
  qW3Gate(true,false,()=>{const e=qW3Edge('plateau','capital');P.x=e.x;P.y=e.y+160;followCam();qStep(24,{renderEvery:2});qOk(SC.map.has('w3/veil'),'장막 그림')});
  qWxTo('capital');const L2=RCACHE.capital,th=L2.caves.find(c=>c.cave.w3k==='throne');P.x=th.x;P.y=th.y+120;followCam();qStep(24,{renderEvery:2});qOk(SC.map.has('w3/throne'),'왕좌 문 그림');
  P.x=L2.town.x;P.y=L2.town.y+60;followCam();qStep(24,{renderEvery:2});
  qW3Enter('cp_throne');P.invT=1e9;const p=W3.ar.pil[0];qW3Hold(P,p);followCam();DG.boss.aggroed=true;DG.boss.w3cT=.01;qStep(90,{renderEvery:2,each:()=>{P.hp=maxHp();P.invT=1e9}});qOk(SC.map.has('w3/pillar'),'기둥 그림');
  qOk(W3.ar.pil[0].lit>0,'기둥 불');leaveDungeon();loadRegion('home');return 'seal · tent · trial · veil · throne · pillar'});
/* ===== 실행 · 결과 표 ===== */
/* ===== v19 (SKILL): 1차 스킬 정리 — 합치기·옮기기 저장 · 같은 버프 우선 · 한 명 치유 시전 · 1차 8위계 · 상위 기술 잠금 · 초반 광역 · 3차 대비 조정 ===== */
// v18 사제 저장(레벨 47): 합쳐지는 스킬·3차/2차로 빠지는 스킬·상위 기술·장비 +스킬 옵션이 모두 들어 있다
const QA_V18SK={v:5,slot:0,cls:'priest',lvl:47,xp:100,gold:4321,towns:['brenhill','willowen'],home:'brenhill',x:1500,y:3900,reg:'home',hp:400,mp:200,pot:{hp:3,mp:3},
  gear:{staff:QA_ITEM(81,'staff',2,'심판의 지팡이',45,{int:40,sk_holyspark:2,sk_wrath:1,sk_divinehymn:1},{cls:'priest'}),robe:null,ring:null,amulet:null},bag:[QA_ITEM(82,'amulet',4,'아우렐의 눈물',40,{regen:4.5,tr_2:1,ls:3,all:1},{cls:'priest'})],
  sk:{holyspark:8,lightarrow:6,smite:3,minorheal:5,gloriadomini:6,divinehymn:7,wrath:4,aegis:2,herobless:10,aspersio:10,impositio:4,blessing:1},sp:2,st:{int:60,vit:40,spi:40},ap:0,diff:0,
  bar:['holyspark','lightarrow','wrath','divinehymn','aegis','minorheal'].concat(Array(15).fill(null)),uid:80,q:{i:0,st:0,c:{}}};
qT('스킬 정리 v19','합치기 표: 없어진 스킬은 SPELLS에 없고 같은 직업의 남는 스킬로 이어짐 · 단축칸·장비 옵션·옛 판 동료 시전의 대신 스킬',()=>{const bad=[];
  for(const k in MERGE_V19){const to=mergeTo(k),g=GONE_V19[k];if(SPELLS[k])bad.push(k+' 남아 있음');if(!g)bad.push(k+' 원래 없던 id');else if(!to||SPELLS[to].cls!==g.cls)bad.push(`${k}→${to} 직업 다름`)}
  for(const k in RETIRE_V19){const b=mergeTo(k),g=GONE_V19[k];if(SPELLS[k])bad.push(k+' 남아 있음');if(!g||!b||SPELLS[b].cls!==g.cls)bad.push(`${k} 대신 ${b}`)}
  for(const k in GONE_SK)if(!SPELLS[GONE_SK[k]])bad.push(`장비 옵션 ${k}→${GONE_SK[k]} 없음`);
  const want={holyspark:'smite',lightarrow:'smite',wrath:'greatjudgment',typhoon:'callstorm',seaofflame:'dragonbreath',tidalwave:'turncurrent',divinehymn:'salvation',stoneguardian:'quake',skyfire:'meteor',thousandspears:'godspear',splitcanyon:'rendingsky',spacerend:'rendingsky',monsoon:'starlight',frost:'frostdiver',oath:'guardianspirit'};
  qOk(SPELLS[GONE_SK.penance],'v17 속죄 장비 옵션');for(const k in want)if(mapGoneV19(k)!==want[k])bad.push(`${k}→${mapGoneV19(k)} (기대 ${want[k]})`);
  for(const id in SPELLS){const s=SPELLS[id];for(const p of PRE[id]||[])if(!SPELLS[p])bad.push(`선행 ${p}>${id} 없는 id`)}
  qOk(!bad.length,bad.slice(0,8).join(', '));const n=c=>qSpells(c,s=>!s.tab&&!s.job2).length;
  return `합침 ${Object.keys(MERGE_V19).length} · 2·3차로 ${Object.keys(RETIRE_V19).length} · 1차 마법사 ${n('mage')} · 사제 ${n('priest')} · 전사 ${n('warrior')} · 궁수 ${n('archer')} (더 합치기 ${V19_MORE.on?'켬':'끔'})`});
qT('스킬 정리 v19','저장 점수 옮기기(skLoad): 합친 점수는 남는 스킬로(20·레벨 한도), 넘치거나 2·3차로 간 점수는 돌려받음 · 점수 합은 그대로 · 원래 점수는 skOld',()=>{const out=[];
  const T=(name,dsk,cls,lvl,f)=>{const r=skLoad(dsk,cls,lvl),inn=Object.entries(dsk).filter(([k])=>!(GONE_V19[k]&&GONE_V19[k].cls!==cls)&&!(SPELLS[k]&&SPELLS[k].cls!==cls)).reduce((a,[k,v])=>a+clamp(v|0,0,MAXSK),0),got=Object.values(r.sk).reduce((a,b)=>a+b,0)+r.back;
    qOk(inn===got,`${name}: 점수 합 ${inn} → ${got}`);const why=f(r);qOk(!why,`${name}: ${why} ${JSON.stringify({sk:r.sk,back:r.back})}`);out.push(`${name} ↩${r.back}`)};
  T('셋 → 스마이트',{holyspark:8,lightarrow:6,smite:3,minorheal:5},'priest',30,r=>r.sk.smite===17&&r.back===0&&r.skOld.holyspark===8&&r.skOld.lightarrow===6&&!r.sk.holyspark?'':'스마이트 17');
  T('3 → 1 (작은 점수)',{lightarrow:3},'priest',10,r=>r.sk.smite===3&&r.back===0?'':'스마이트 3');
  T('20 넘침',{holyspark:20,smite:15},'priest',60,r=>r.sk.smite===20&&r.back===15?'':'20까지 · 15 돌려받음');
  T('이미 20',{lightspear:3,lightning:20},'mage',30,r=>r.sk.lightning===20&&r.back===3?'':'20 유지 · 3 돌려받음');
  T('레벨 모자람(40)',{gloriadomini:5},'priest',40,r=>!r.sk.godspear&&r.back===5?'':'8위계(45)를 못 찍어 5 돌려받음');
  T('레벨 조금 모자람(47)',{gloriadomini:6},'priest',47,r=>r.sk.godspear===3&&r.back===3?'':'3점까지 · 3 돌려받음');
  T('셋이 하나로',{herobless:10,aspersio:10,impositio:4},'priest',60,r=>r.sk.impositio===20&&r.back===4?'':'20 · 4 돌려받음');
  T('망가진 값',{holyspark:'x',smite:-4,lightarrow:99},'priest',60,r=>r.sk.smite===20&&r.back===0?'':'99 → 20');
  T('2차로 간 찬가',{divinehymn:7,salvation:3},'priest',60,r=>r.back===7&&r.sk.salvation===3&&r.skOld.divinehymn===7&&!r.sk.divinehymn?'':'7 돌려받음');
  T('3차로 간 금기 마법',{seaofflame:9,typhoon:2,meteor:5},'mage',60,r=>r.back===11&&r.sk.meteor===5?'':'11 돌려받음');
  T('하늘의 노여움',{wrath:6},'priest',60,r=>r.back===6?'':'6 돌려받음');
  T('2차가 가져간 9위계(마법사)',{skyfire:8},'mage',60,r=>r.back===8?'':'8 돌려받음');T('2차가 가져간 9위계(사제)',{thousandspears:2,godspear:1},'priest',60,r=>r.back===2&&r.sk.godspear===1?'':'2 돌려받음');
  T('돌 수호자',{stoneguardian:4},'mage',40,r=>r.back===4?'':'4 돌려받음');
  T('상위 기술로 합치기(58레벨 기술 · 60레벨)',{splitcanyon:6,spacerend:4,rendingsky:2},'mage',60,r=>SPELLS.rendingsky.upLv===58&&r.sk.rendingsky===3&&r.back===9?'':'3점까지 · 9 돌려받음');
  T('v17 속죄(예전 규칙)',{penance:4,smite:2},'priest',20,r=>r.back===4&&r.sk.smite===2?'':'4 돌려받음');
  {const r=skLoad({holyspark:5,wrath:3,spark:3},'mage',20);qOk(r.sk.spark===3&&r.back===0&&!r.sk.smite&&!Object.keys(r.skOld).length,'다른 직업 키는 무시(공짜 점수 없음) '+JSON.stringify(r));out.push('다른 직업 키 무시')}
  return out.join(' · ')});
qT('스킬 정리 v19','v18 저장(사제 47레벨) 불러오기: 정확히 옮기고 돌려받음 · skOld 보관 · 단축칸·장비 옵션 바뀜 · 가진 아이템 그대로 · 다시 저장 → 불러오기 같음',()=>{qResetStore();qPut('arseia-char-2',QA_V18SK);const d=readSlot(2);qOk(d,'readSlot 실패');qOk(load(d,2),'load 실패');const F=QA_V18SK;
  const sk=P.sk;qOk(sk.smite===17&&sk.impositio===20&&sk.godspear===3&&sk.aegis===2&&sk.minorheal===5&&sk.blessing===1,`스킬 ${JSON.stringify(sk)}`);
  for(const k of ['holyspark','lightarrow','gloriadomini','divinehymn','wrath','herobless','aspersio'])qOk(!(k in sk)&&P.skOld[k]===F.sk[k],`${k}: sk ${sk[k]} · skOld ${P.skOld[k]}`);
  qOk(P.sp===F.sp+4+3+7+4,`sp ${P.sp} (기대 ${F.sp+18}: 임포지티오 넘침 4 · 갓 스피어 레벨 3 · 찬가 7 · 노여움 4)`);
  qOk(JSON.stringify(P.bar.slice(0,6))===JSON.stringify(['smite',null,'greatjudgment','salvation','aegis','minorheal']),`단축칸 ${P.bar.slice(0,6)}`);
  const st=P.gear.staff.stats;qOk(st.sk_smite===2&&st.sk_greatjudgment===1&&st.sk_salvation===1&&!st.sk_holyspark&&!st.sk_wrath&&!st.sk_divinehymn&&st.int===40,`지팡이 옵션 ${JSON.stringify(st)}`);
  qOk(P.bag[0].stats.all===1&&P.bag[0].stats.tr_2===1,'가진 아이템이 바뀜');
  const keyF=()=>JSON.stringify({lvl:P.lvl,sp:P.sp,sk:P.sk,skOld:P.skOld,bar:P.bar,gear:P.gear,bag:P.bag,job2:P.job2||null});const before=keyF();
  saveNow();const raw=JSON.parse(qRaw(SLOTKEY(2)));qOk(raw.skOld&&raw.skOld.holyspark===8&&raw.skOld.wrath===4&&!raw.sk.holyspark,`저장된 skOld ${JSON.stringify(raw.skOld)}`);
  for(const k in F)if(!(k in raw))qOk(false,`옛 저장 칸 ${k}가 저장에서 빠짐`);
  qPrep('mage',{slot:6});loadRegion('home');qOk(load(readSlot(2),2),'다시 불러오기 실패');const after=keyF();
  if(before!==after){const A=JSON.parse(before),B=JSON.parse(after),df=Object.keys(A).filter(k=>JSON.stringify(A[k])!==JSON.stringify(B[k]));throw new QAFail('다름: '+df.map(k=>`${k} ${JSON.stringify(A[k]).slice(0,60)} → ${JSON.stringify(B[k]).slice(0,60)}`).join('; '))}
  qOk(P.sp===F.sp+18,'다시 불러올 때 또 돌려받음');qStep(5);return `스마이트 17 · 임포지티오 20 · 갓 스피어 3 · sp ${F.sp}→${P.sp} · skOld ${Object.keys(P.skOld).length}개`});
/* ---- v20: 마법사 1차 더 합치기 (사용자 22:32 「75개쯤」 → 105 → 80개) ---- */
qT('스킬 정리 v20','마법사 1차 80개 · 합친 25개는 SPELLS에 없고 정한 스킬로 이어짐 · 선행 연결은 남는 스킬로 · 없는 id를 가리키는 연결 없음',()=>{const bad=[];
  qOk(V19_MORE.on&&!V19_MORE.keep90,'더 합치기가 꺼져 있음');
  for(const k in MAGE_TRIM_V19){if(SPELLS[k])bad.push(`${k} 남아 있음`);if(mapGoneV19(k)!==MAGE_TRIM_V19[k])bad.push(`${k}→${mapGoneV19(k)}`);if(!SPELLS[MAGE_TRIM_V19[k]]||SPELLS[MAGE_TRIM_V19[k]].cls!=='mage')bad.push(`${k} 대상 없음`);if(GONE_SK[k]!==MAGE_TRIM_V19[k])bad.push(`장비 옵션 ${k}→${GONE_SK[k]}`)}
  for(const id in SPELLS)for(const p of PRE[id]||[])if(!SPELLS[p])bad.push(`선행 ${p}>${id}`);
  qOk((PRE.timestop||[]).includes('hold')&&(PRE.lightrain||[]).includes('hold'),`선행: 타임 스톱 ${PRE.timestop} · 라이트 레인 ${PRE.lightrain}`);
  qOk(!bad.length,bad.slice(0,8).join(', '));const n=qSpells('mage',s=>!s.tab&&!s.job2&&!s.job3).length;qOk(n===80,`마법사 1차 ${n}개 (기대 80)`);
  qOk(/여섯 마리/.test(SPELLS.firebird.desc)&&eff('firebird',16).cnt===6&&eff('frostarrow',16).cnt===6,'불새·아이스 니들 16레벨 여섯 발');
  return `마법사 1차 ${n}개 · 합침 ${Object.keys(MAGE_TRIM_V19).length}개`});
const QA_V19MG={v:5,slot:0,cls:'mage',lvl:60,xp:100,gold:9876,towns:['brenhill','willowen'],home:'brenhill',x:1500,y:3900,reg:'home',hp:400,mp:300,pot:{hp:3,mp:3},
  gear:{staff:QA_ITEM(91,'staff',2,'불꽃의 지팡이',55,{int:40,sk_pillar:2,sk_heartoffire:1,sk_meteor:1},{cls:'mage'}),robe:null,ring:null,amulet:null},bag:[QA_ITEM(92,'amulet',4,'얼음 눈물',50,{regen:4.5,sk_shardvolley:1,all:1},{cls:'mage'})],
  sk:{spark:5,flamelash:3,blazinggust:5,meteor:10,pillar:4,callmagma:4,hold:1,slowtime:2,flash:3,flamemantle:2,heartoffire:6,frostarrow:2,shardvolley:20,frostdiver:4},skOld:{frost:4},sp:3,st:{int:80,vit:40,spi:40},ap:0,diff:0,
  bar:['pillar','meteor','heartoffire','shardvolley','frostarrow','slowtime'].concat(Array(15).fill(null)),uid:90,q:{i:0,st:0,c:{}}};
qT('스킬 정리 v20','v19 저장(마법사 60레벨) 불러오기: 합친 점수 옮기기(20 한도) · 넘친 2점 돌려받음 · skOld에 원래 점수(v19 것도 그대로) · 단축칸·장비 옵션 · 다시 저장 → 불러오기 같음',()=>{qResetStore();qPut('arseia-char-3',QA_V19MG);const d=readSlot(3);qOk(d,'readSlot 실패');qOk(load(d,3),'load 실패');const F=QA_V19MG,sk=P.sk;
  qOk(sk.flamelash===8&&sk.meteor===18&&sk.hold===6&&sk.flamemantle===8&&sk.frostarrow===20&&sk.frostdiver===4&&sk.spark===5,`스킬 ${JSON.stringify(sk)}`);
  for(const k of ['blazinggust','pillar','callmagma','slowtime','flash','heartoffire','shardvolley'])qOk(!(k in sk)&&P.skOld[k]===F.sk[k],`${k}: sk ${sk[k]} · skOld ${P.skOld[k]}`);
  qOk(P.skOld.frost===4,'v19 때 보관한 skOld가 사라짐');qOk(P.sp===F.sp+2,`sp ${P.sp} (기대 ${F.sp+2}: 아이스 니들 20 넘침 2)`);
  qOk(JSON.stringify(P.bar.slice(0,6))===JSON.stringify([null,'meteor','flamemantle',null,'frostarrow','hold']),`단축칸 ${P.bar.slice(0,6)}`);
  const st=P.gear.staff.stats;qOk(st.sk_meteor===3&&st.sk_flamemantle===1&&!st.sk_pillar&&!st.sk_heartoffire&&st.int===40,`지팡이 옵션 ${JSON.stringify(st)}`);
  const keyF=()=>JSON.stringify({lvl:P.lvl,sp:P.sp,sk:P.sk,skOld:P.skOld,bar:P.bar,gear:P.gear,bag:P.bag});const before=keyF();
  saveNow();const raw=JSON.parse(qRaw(SLOTKEY(3)));qOk(raw.skOld&&raw.skOld.pillar===4&&raw.skOld.frost===4&&!raw.sk.pillar,`저장된 skOld ${JSON.stringify(raw.skOld)}`);
  for(const k in F)if(!(k in raw))qOk(false,`옛 저장 칸 ${k}가 저장에서 빠짐`);
  qPrep('priest',{slot:6});loadRegion('home');qOk(load(readSlot(3),3),'다시 불러오기 실패');const after=keyF();qOk(before===after,'다시 불러오면 달라짐');
  qOk(P.sp===F.sp+2,'다시 불러올 때 또 돌려받음');qStep(5);return `불꽃 채찍 8 · 메테오 18 · 붙들기 6 · 불의 갑옷 8 · 아이스 니들 20 · sp ${F.sp}→${P.sp}`});
qT('스킬 정리 v20','v20: 100레벨 넘는 아이템도 그 레벨로 나옴(예전 99에서 멈춤) · 상급 유니크는 +3 · 140이 끝',()=>{const out=[];
  for(const cls of ['mage','warrior']){qPrep(cls,{lvl:130});const a=makeItem(130,true,cls),b=makeItem(130,true,cls,'boss'),c=makeItem(500,false,cls);
    qOk(a.il===130&&b.il===133&&c.il===MAXLV,`${cls} il ${a.il}/${b.il}/${c.il}`);out.push(`${cls} ${a.il}·${b.il}·${c.il}`)}qClear();return out.join(' · ')});
qT('끌어다 놓기 v20','스킬 창에 단축칸 21개가 붙어 있음 · 배운 스킬을 칸에 놓으면 들어감(이미 다른 칸에 있으면 자리 바꿈) · 칸끼리 바꾸기 · 칸을 밖으로 끌면 비움 · 안 배운 스킬·패시브는 안 됨 · 저장됨',()=>{qPrep('mage',{lvl:30});const out=[];
  for(const id of ['spark','firebolt','frostdiver','warmth'])P.sk[id]=3;P.bar=Array(21).fill(null);P.bar[2]='spark';buildBar();
  openPanel('tree');const dk=pbody.querySelectorAll('.dock20 [data-dock]');qOk(dk.length===SLOTS.length,`칸 ${dk.length}개`);
  qOk(dndDrop('firebolt',-1,5)&&P.bar[5]==='firebolt','트리 → 칸');out.push('트리→칸');
  qOk(dndDrop('spark',-1,5)&&P.bar[5]==='spark'&&P.bar[2]==='firebolt','이미 있던 스킬은 자리를 바꿈 '+P.bar.slice(0,6));
  qOk(dndDrop('spark',5,9)&&P.bar[9]==='spark'&&P.bar[5]===null,'칸끼리 옮기기 '+P.bar.slice(0,10));
  qOk(dndDrop('firebolt',2,9)&&P.bar[9]==='firebolt'&&P.bar[2]==='spark','칸끼리 바꾸기');out.push('칸↔칸');
  qOk(dndDrop('spark',2,-1)&&P.bar[2]===null,'밖으로 끌면 비움');out.push('비우기');
  qOk(!dndDrop('warmth',-1,3)&&P.bar[3]===null,'패시브가 들어감');qOk(!dndDrop('meteor',-1,3)&&P.bar[3]===null,'안 배운 스킬이 들어감');out.push('패시브·안 배운 것 거절');
  qOk(pbody.querySelector('[data-dock="9"] svg'),'칸 그림이 바로 바뀌지 않음');
  qOk(JSON.stringify(saveData().bar)===JSON.stringify(P.bar),'저장 단축칸이 다름');closePanel();qClear();return out.join(' · ')});
qT('스킬 정리 v19','같은 버프 우선: 강한 레벨이 남고 약한 것은 기다렸다가 남은 시간만큼 이어짐 · 약→강은 바로 강 · 같은 레벨은 새로 고침 · 지속 치유·가호는 양이 큰 쪽',()=>{qPrep('priest');const out=[];
  const s=SPELLS.wisdom,nb=(L,t)=>({t,max:t,regen:L,L,n:s.n}),B=()=>P.buffs.wisdom;
  P.buffs={};putBuffV19('wisdom',nb(7,100),'',s);putBuffV19('wisdom',nb(3,200),'',s);qOk(B().L===7&&B().wait&&B().wait.L===3,'7레벨이 안 남음');
  tickBuffsV19(101);qOk(B()&&B().L===3&&Math.round(B().t)===99,`7이 끝나고 3이 99초 남아야 함 ${JSON.stringify(B())}`);out.push('강 → 약 대기');
  P.buffs={};putBuffV19('wisdom',nb(3,100),'',s);putBuffV19('wisdom',nb(7,50),'',s);qOk(B().L===7,'약 → 강인데 강이 아님');tickBuffsV19(51);qOk(B()&&B().L===3&&Math.round(B().t)===49,`강이 끝나고 약이 이어지지 않음 ${JSON.stringify(B())}`);out.push('약 → 강 → 약');
  P.buffs={};putBuffV19('wisdom',nb(5,30),'',s);putBuffV19('wisdom',nb(5,90),'',s);qOk(B().t===90&&!B().wait,'같은 레벨이 새로 고쳐지지 않음');tickBuffsV19(91);qOk(!B(),'끝난 버프가 남음');
  // 실제로 걸기: 7레벨 → 3레벨, 버프 칸에 레벨이 보임
  P.buffs={};P.sk.wisdom=7;qCast('wisdom');qOk(B()&&B().L===7,'7레벨 지혜의 축복이 안 걸림');P.sk.wisdom=3;qCast('wisdom');qOk(B().L===7&&B().wait&&B().wait.L===3,'3레벨이 7레벨을 덮음');
  qOk(/더 강한/.test($('#log').textContent),'약한 것을 걸 때 알림 없음');const e=PUI.myBuffs().find(e=>e[0]==='wisdom');qOk(e&&e[3]===7,`버프 칸 레벨 ${e&&e[3]}`);
  qOk(maxMp()>0&&!qBad().length,'수치 이상');out.push('실제 시전 7 유지 · 3 대기');
  P.hot={t:10,max:10,rate:20};qOk(!putHotV19({t:10,max:10,rate:5},'',null)&&P.hot.rate===20,'작은 지속 치유가 큰 것을 덮음');qOk(putHotV19({t:10,max:10,rate:30},'',null)&&P.hot.rate===30,'큰 지속 치유가 안 걸림');
  P.ward={t:10,heal:.5,n:'수호 천사'};qOk(!putWardV19({t:30,heal:.25,n:'x'},'',SPELLS.guardianspirit)&&P.ward.heal===.5,'약한 가호가 강한 것을 덮음');qOk(putWardV19({t:30,heal:.5,n:'y'},'',SPELLS.guardianspirit)&&P.ward.n==='y','같은 가호가 새로 고쳐지지 않음');
  qClear();return out.join(' · ')+' · 지속 치유·가호 양 비교'});
qT('스킬 정리 v19','한 명 치유: 그레이터 힐 1.5초 · 리제너레이션 2초 · 부활 3초(30%) · 고른 동료가 다 외울 때 멀거나 쓰러졌으면 「대상이 멀어졌습니다」(마나·재사용 안 듦) · 가까우면 그 동료에게',()=>{qPrep('priest');P.invT=1e9;const out=[];
  qOk(castTimeOf('greaterheal')===1.5&&castTimeOf('regeneration')===2&&CAST_T.resurrection===3,`시전 ${castTimeOf('greaterheal')}/${castTimeOf('regeneration')}/${CAST_T.resurrection}`);
  qOk(SPELLS.resurrection.pct===.3&&/30%/.test(SPELLS.resurrection.desc),'부활 30%');qOk(/시전 1\.5초/.test(castInfo('greaterheal',10)),`툴팁 ${castInfo('greaterheal',10)}`);
  try{const {r,sent}=qPty(2,{dx:120});P.sk.greaterheal=10;P.sk.regeneration=10;PTY.sel('qa_peer');
    const start=id=>{qMana(id);P.mp=maxMp();P.cd[id]=0;qRecWait();P.noMpT=0;tryCast(id);qOk(CAST.cur&&CAST.cur.id===id&&CAST.cur.oneTg==='qa_peer',`${id}: 외우기 시작 안 됨 / 대상 기억 없음`)};
    const finish=()=>qStep(240,{render:false,until:()=>!CAST.cur});
    for(const how of ['far','dead']){start('greaterheal');const mp0=P.mp;if(how==='far')r.x=r.tx=P.x+2000;else r.dead=true;sent.length=0;$('#log').textContent='';finish();
      qOk(!(P.cd.greaterheal>0)&&P.mp>=mp0-1,`${how}: 마나 ${qR(mp0)}→${qR(P.mp)} · 재사용 ${P.cd.greaterheal}`);qOk(/대상이 멀어졌습니다/.test($('#log').textContent),`${how}: 알림 없음`);
      qOk(!sent.some(m=>m.t==='cast'&&m.sp==='greaterheal'),`${how}: 시전이 나감`);r.x=r.tx=P.x+120;r.dead=false;out.push(how==='far'?'멀면 취소':'쓰러지면 취소')}
    start('regeneration');sent.length=0;finish();const m=sent.find(m=>m.t==='cast'&&m.sp==='regeneration');qOk(m&&m.tg==='qa_peer'&&P.cd.regeneration>0,'가까운 동료에게 안 감');out.push('가까우면 그 동료')}finally{qPtyOff()}
  return out.join(' · ')});
qT('스킬 정리 v19','1차는 8위계(1/5/10/16/23/31/38/45) · 직업 칭호 8단계 · 상위 기술(옛 9위계)은 1차 나무에 없고 2차 전직·레벨이 되어야 풀림',()=>{const out=[];
  qOk(RANK_LV.length===8&&RANK_LV[7]===45,`표 ${RANK_LV}`);
  for(const c of ['mage','priest','warrior','archer']){qOk(CLASSES[c].grade.length===8,`${c} 칭호 ${CLASSES[c].grade.length}단계`);
    qOk(!qSpells(c,s=>!s.tab&&!s.job2&&!s.job3&&(s.rank<1||s.rank>8)).length,`${c}: 1차에 9위계가 남음 ${qSpells(c,s=>!s.tab&&!s.job2&&!s.job3&&(s.rank<1||s.rank>8)).map(s=>s.id)}`);const A=ADV_IDS[c];qOk(A&&A.length>=4,`${c} 상위 기술 ${A&&A.length}`);
    A.forEach((id,i)=>{const s=SPELLS[id];qOk(s&&s.cls===c&&s.tab==='adv'&&s.upLv===ADV_LV[i]&&reqLvOf(id)===ADV_LV[i],`${id}: ${s&&s.tab} ${s&&s.upLv}`)});
    qOk(!qSpells(c,s=>s.tab==='adv'&&!A.includes(s.id)).length,`${c}: 목록 밖 상위 기술`);out.push(`${c} ${CLASSES[c].grade[7]} · 상위 ${A.length}`)}
  qOk(CLASSES.mage.grade[7]==='고위 마법사'&&CLASSES.priest.grade[7]==='주교'&&CLASSES.warrior.grade[7]==='기사'&&CLASSES.archer.grade[7]==='명사수','맨 위 칭호');
  qPrep('mage',{lvl:60});const id=ADV_IDS.mage[4];P.sk[id]=1;for(const p of PRE[id]||[])P.sk[p]=1;P.sp=5;
  qOk(!advUnlocked(id)&&!canLearn(id)&&/상위 기술/.test(kbLearnWhy(id)||''),'2차 전직 전에 풀림');qJob2On();P.lvl=SPELLS[id].upLv-1;qOk(!advUnlocked(id),'레벨 전에 풀림');
  P.lvl=SPELLS[id].upLv;qOk(advUnlocked(id)&&!canLearn(id),'레벨이 되면 쓰기는 되고 더 찍기는 한 레벨 뒤');P.lvl++;qOk(canLearn(id),'한 레벨 뒤에도 못 찍음');
  qOk(advUnlocked('spark')&&reqLvOf('spark')===1,'1차 스킬이 잠김');
  for(const c of ['mage','priest','warrior','archer']){qPrep(c,{lvl:60});openPanel('tree');const T=CLASSES[c].trees.length;
    for(let t=0;t<T;t++){treeSel=t;nodeSel=null;renderPanel();const ns=[...pbody.querySelectorAll('[data-node]')].map(n=>n.dataset.node);qOk(ns.length&&!ns.some(n=>SPELLS[n]&&SPELLS[n].tab),`${c} ${t}번 나무에 상위 기술 ${ns.filter(n=>SPELLS[n]&&SPELLS[n].tab)}`)}closePanel()}
  return out.join(' · ')});
qT('스킬 정리 v19','초반 광역: 직업마다 2위계(5레벨)까지 여러 적을 맞히는 기술 · 전사 크로스 컷·궁수 팬 샷은 실제로 셋 중 둘 이상',()=>{const out=[];
  const aoe=s=>s.rank<=2&&isDmg(s)&&(s.kind==='nova'||s.kind==='cone'||s.max>=3||s.cnt>=3||s.rad>=100);
  for(const c of ['mage','priest','warrior','archer']){const L=qSpells(c,aoe);qOk(L.length,`${c}: 2위계까지 광역 없음`);out.push(`${QCN[c]} ${L.map(s=>s.n).join('/')}`)}
  qOk(SPELLS.crossslash.rank===2&&SPELLS.crossslash.cd<=2&&SPELLS.fanshot.rank===2&&SPELLS.fanshot.cd<=2&&SPELLS.sweep.cd<=2,'크로스 컷·팬 샷·와이드 스윕 위계/재사용');
  for(const [c,id,d] of [['warrior','crossslash',55],['archer','fanshot',230]]){qCastPrep(c,id);if(typeof clsGearFor==='function')clsGearFor(id);qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;followCam();
    const es=[-.22,0,.22].map(a=>qDummy(P.x+Math.cos(a)*d,P.y+Math.sin(a)*d));qCast(id,es[1]);qStep(60,{render:false});const n=es.filter(e=>e.taken>0).length;qOk(n>=2,`${SPELLS[id].n}: 셋 중 ${n}`);out.push(`${SPELLS[id].n} ${n}/3`)}
  qClear();return out.join(' · ')});
qT('스킬 정리 v19','3차 대비 조정: 화염 화살 10레벨부터 두 발 · 돌풍 레벨마다 멀리 · 리와인드 6위계 이하만 · 타임 스톱 보스 0.5초 · 불사 25% · 이름 바꿈 · +모든 스킬 레벨 최대 5(v21: 3→5) · 아이템 · 세트 이름',()=>{qPrep('mage',{lvl:60});const out=[];
  qOk(eff('firebolt',10).cnt===2&&!(eff('firebolt',9).cnt>1)&&Math.abs(eff('firebolt',10).mult-SPELLS.firebolt.mult*.65)<1e-9,`화염 화살 ${eff('firebolt',9).cnt}/${eff('firebolt',10).cnt}`);qOk(eff('gust',10).knock>eff('gust',1).knock,'돌풍 밀치기');
  const lo=qSpells('mage',s=>s.rank===3&&s.cd>=3&&!s.tab)[0].id,hi=qSpells('mage',s=>s.rank===7&&s.cd>=3&&!s.tab)[0].id;P.sk.rewind=10;P.cd[lo]=9;P.cd[hi]=9;qCast('rewind');
  qOk(!(P.cd[lo]>0)&&P.cd[hi]>8,`리와인드: ${lo}(3위계) ${P.cd[lo]} · ${hi}(7위계) ${P.cd[hi]}`);out.push('리와인드 6위계 이하');
  const ts=eff('timestop',10),b=dgMob('b_arsil',P.x+100,P.y,40),w=dgMob('wolf',P.x-100,P.y,40);applyFx(b,ts);applyFx(w,ts);qOk(b.freezeT<=.5+1e-9&&w.freezeT>=2,`타임 스톱 보스 ${b.freezeT} · 늑대 ${w.freezeT}`);qClear();
  qOk(SPELLS.undying.heal===.25&&SPELLS.smite.lvTier&&SPELLS.barrier.rank===3,'불사·스마이트·방벽 수치');
  const N={returnmiracle:'세컨드 던',benediction:'래디언트 베네딕션',sunsword:'선라이즈',sacredsword:'헤븐스 레이',firebird:'파이어버드',warlordroar:'배틀 로어',hawkeye:'킨 아이'};
  for(const id in N)qOk(SPELLS[id]&&SPELLS[id].n===N[id],`${id}: ${SPELLS[id]&&SPELLS[id].n}`);
  const base=bonusLv('spark');P.gear.amulet=QA_ITEM(990,'amulet',4,'시험 목걸이',40,{all:6});qOk(bonusLv('spark')-base===5,`+모든 스킬 6 → +${bonusLv('spark')-base} (v21 상한 5)`);P.gear.amulet=null;
  qOk(!UNIQ.some(u=>u.st.all)&&BOSSU.every(u=>!(u.st.all>1)),'유니크 +모든 스킬');for(const k in SETS)for(const n in SETS[k].b)qOk(!(SETS[k].b[n].all>1),`세트 ${k} +모든 스킬`);
  qOk(SETS.saint&&SETS.saint.n==='순례자의 가호'&&!Object.values(SETS.saint.p).some(n=>/성녀/.test(n)),'세트 이름');
  for(const c of ['mage','priest','warrior','archer'])for(let k=0;k<3;k++){const it=makeItem(40,true,null,['uniq','boss','set'][k]);if(it&&it.stats&&it.stats.all>1)qOk(false,`새 아이템 +모든 스킬 ${it.stats.all}`)}
  return out.join(' · ')+` · 이름 ${Object.keys(N).length}개`});
/* ===== v20 IDEAS: 소속 · 책 · 현상금 · 고르는 의뢰 · 연계 · 세계의 신비 · 세력 평판 (aff20 … faction20.js) ===== */
const qV20Talk=id=>{const f=sqFolk(id);qOk(f,`${id} 마을 사람이 없음`);sqTalk(f);qClosePanels();return f};
const qV20Spell=(cls,f)=>Object.keys(SPELLS).find(id=>{const s=SPELLS[id];return s.cls===cls&&!s.job2&&!s.job3&&f(s)});
qT('소속 v20','셋째 위계 시험 뒤 소속 의뢰: 대표 셋과 이야기해야 고르기 단추가 생김 · 고르면 P.aff · 의뢰 완료 · 다른 직업 의뢰 안 보임 · 대표 8명이 마을에 서 있음',()=>{qPrep('mage',{lvl:20});loadRegion('home');const s=sqState(),q=SQBY.affm;
  for(const id in AFF20_FOLK){const f=TW.folk.find(f=>f.id===id);qOk(f,`대표 ${id}가 마을에 없음`);qOk(f.town&&f.town.id===AFF20_FOLK[id].town,`${id} 마을 ${f.town&&f.town.id}`)}
  qOk(sqAvail(q)==='locked',`셋째 시험 전 ${sqAvail(q)}`);qOk(sqAvail(SQBY.affp)==='hidden'&&sqAvail(SQBY.affw)==='hidden','다른 직업 소속 의뢰가 보임');s.d.ctm3=1;qOk(sqAvail(q)==='ok',`셋째 시험 뒤 ${sqAvail(q)}`);
  sqAccept('affm');qOk(s.a.affm,'받지 못함');V20A.affpick('ceres');qOk(!P.aff,'대표를 만나기 전에 골라짐');
  SQV.mode='npc';SQV.npc=sqFolk('elian');let h=sqNpcHtml();qOk((h.match(/data-v20a="aff(pick|go)"/g)||[]).length===3,'스승 창에 소속 단추 셋이 없음');qOk(!/data-v20a="affpick"/.test(h)&&(h.match(/data-v20a="affgo"/g)||[]).length===3,'만나기 전에는 「대표 찾아가기」 셋');
  const t0=sqTarget(q);qOk(t0&&/이델|오스윈|카델/.test(TWFOLK[AFF20.mage.find(a=>!affMet(q,a.id)).npc].n),'목표 표시 없음');
  for(const a of AFF20.mage)qV20Talk(a.npc);qOk(AFF20.mage.every(a=>affMet(q,a.id)),'대표와 이야기해도 만남이 안 남음');qOk(/만난 대표 3\/3/.test(sqGoalText(q,0)),sqGoalText(q,0));
  SQV.mode='npc';SQV.npc=sqFolk('elian');h=sqNpcHtml();qOk((h.match(/data-v20a="affpick"/g)||[]).length===3&&!/data-v20a="affpick"[^>]*disabled/.test(h),'만난 뒤에도 단추가 꺼져 있음');
  const c0=stat('cdr');V20A.affpick('ceres');qOk(P.aff==='ceres','고르지 못함');qOk(!s.a.affm&&s.d.affm===1,'의뢰가 끝나지 않음');qOk(Math.abs(stat('cdr')-c0-6)<.01,`재사용 대기 ${c0}→${stat('cdr')}`);
  qOk(sqAvail(q)==='done','끝난 의뢰가 다시 열림');qOk(/소속 · 세레스의 탑/.test(charHtml()),'캐릭터 창에 소속 줄 없음');qClosePanels();return `세레스의 탑 · 재사용 대기 +6`});
qT('소속 v20','특성 12개는 덧셈(기존 상한 그대로): 마나 소모 · 재사용 · 시전 시간+생명력 · 치유 · 언데드 · 이동+축복 · 막기 · 낮은 생명력 · 물리 · 명중(97%) · 채널링 걷기 · 마나 회복',()=>{const out=[];
  const pick=(cls,id)=>{qPrep(cls,{lvl:60});P.aff=null;v20GsBump();const b={mcost:stat('mcost'),cdr:stat('cdr'),ms:stat('ms'),blk:stat('blk'),pdmg:stat('pdmg'),regen:stat('regen')};const base=gearStats();qOk(affSet(id,'시험'),id+' 못 고름');return{b,base}};
  {const {b}=pick('mage','academy');qOk(stat('mcost')-b.mcost===8,'마나 소모 '+(stat('mcost')-b.mcost))}
  {pick('mage','redtower');const id=Object.keys(CAST_T).find(k=>SPELLS[k]&&SPELLS[k].cls==='mage'&&!SPELLS[k].job2&&!SPELLS[k].job3&&SPELLS[k].cost>0);qOk(id,'시전 시간 마법 없음');P.sk[id]=1;qMana(id);P.mp=maxMp();const e=qDummy(P.x+150,P.y);
    const ct=castTimeOf(id);tryCast(id,e);qOk(CAST.cur&&CAST.cur.id===id,'시전 시작 안 됨');qOk(Math.abs(CAST.cur.max-ct*.9)<.02,`시전 ${CAST.cur.max} / ${ct}`);
    P.hp=maxHp();const h0=P.hp;qStep(Math.ceil(ct*60)+10,{until:()=>!CAST.cur});qOk(!CAST.cur,'시전이 끝나지 않음');qOk(Math.abs(h0-P.hp-maxHp()*.01)<1.5,`생명력 ${h0}→${P.hp}`);
    P.hp=maxHp()*.05;const h1=P.hp;P.cd={};P.mp=maxMp();tryCast(id,e);qStep(Math.ceil(ct*60)+10,{until:()=>!CAST.cur});qOk(P.hp>=h1-.01,'생명력 10% 아래인데 깎임');out.push(`붉은 탑 ${ct}→${qR(ct*.9)}초`)}
  {pick('priest','aurel');P.hp=1;V20.healMine=true;healP(100);V20.healMine=false;qOk(Math.abs(P.hp-1-106)<.6,`치유 ${P.hp-1}`)}
  {pick('priest','mordin');const s0={cls:'priest',el:'holy'};let x=0;for(const f of V20.dmgAdd)x+=f({k:'wraith'},s0)||0;qOk(TYPES.wraith.undead&&Math.abs(x-.12)<1e-9,'언데드 '+x);x=0;for(const f of V20.dmgAdd)x+=f({k:'wolf'},s0)||0;qOk(x===0,'언데드 아님인데 '+x)}
  {const {b}=pick('priest','nella');qOk(stat('ms')-b.ms===5,'이동 '+(stat('ms')-b.ms));const id=qV20Spell('priest',s=>s.kind==='buff'&&s.dur>0);qOk(id,'사제 축복 없음');P.sk[id]=1;const s=eff(id,1);V20.healMine=true;supFx(Object.assign({},s,{id}),id,power(),null);V20.healMine=false;
    qOk(P.buffs[id]&&Math.abs(P.buffs[id].t-s.dur*1.1)<.05,`축복 지속 ${P.buffs[id]&&P.buffs[id].t} / ${s.dur}`)}
  {const {b}=pick('warrior','knights');qOk(stat('blk')-b.blk===5,'막기 '+(stat('blk')-b.blk))}
  {pick('warrior','steel');P.hp=maxHp();let x=0;for(const f of V20.dmgAdd)x+=f({k:'wolf'},{cls:'warrior'})||0;qOk(x===0,'생명력 가득인데 '+x);P.hp=maxHp()*.4;x=0;for(const f of V20.dmgAdd)x+=f({k:'wolf'},{cls:'warrior'})||0;qOk(Math.abs(x-.08)<1e-9,'낮은 생명력 '+x)}
  {const {b}=pick('warrior','kazdun');qOk(stat('pdmg')-b.pdmg===5,'물리 '+(stat('pdmg')-b.pdmg))}
  {pick('archer','patrol');const e=dgMob('wolf',P.x+100,P.y,1);const h=hitChance(e);P.aff=null;const h0=hitChance(e);P.aff='patrol';qOk(Math.abs(h-Math.min(.97,h0+.05))<1e-9,`명중 ${h0}→${h}`);e.dead=true}
  {const {b,base}=pick('archer','silvaren');qOk(Math.abs(stat('regen')-b.regen-v20RegenPct(base,.10))<.11,`마나 회복 ${b.regen}→${stat('regen')}`)}
  {pick('archer','steppe');const id=Object.keys(CHAN).find(k=>SPELLS[k]&&SPELLS[k].cls==='archer'&&!CAST_T[k]&&!(CHAN[k].move||CHAN[k].walk));
    if(id){P.sk[id]=1;qMana(id);P.mp=maxMp();P.moving=true;tryCast(id,qAt(0,200));qOk(CAST.ch&&CAST.ch.id===id&&CAST.ch.walk===1,'걸으며 채널링 시작 못 함');qOk(!CHAN[id].move,'채널링 표가 바뀐 채 남음');P.moving=false;castStop();out.push('초원 채널링 '+id)}else out.push('궁수 채널링 없음(건너뜀)')}
  qClosePanels();return out.join(' · ')});
qT('소속 v20','바꾸기: 스승에게 금화(2000+레벨×150) · 금화 모자라면 안 됨 · P.affN+1 · 저장 왕복 · 다른 직업의 소속 값은 그대로 다시 씀',()=>{qPrep('warrior',{lvl:40});const s=sqState();s.d.ctw3=1;s.d.affw=1;affSet('steel','시험');const pr=AFF_CHANGE_GOLD(40);qOk(pr===8000,'값 '+pr);
  SQV.mode='npc';SQV.npc=sqFolk('j2_warrior');const h=sqNpcHtml();qOk(/data-v20a="affchg"/.test(h),'스승 창에 바꾸기 단추 없음');
  P.gold=pr-1;V20A.affchg('kazdun');qOk(P.aff==='steel','금화 모자란데 바뀜');P.gold=pr+5;V20A.affchg('kazdun');qOk(P.aff==='kazdun'&&P.affN===1&&P.gold===5,`바꾸기 ${P.aff} ${P.affN} ${P.gold}`);
  V20A.affchg('academy');qOk(P.aff==='kazdun','다른 직업 소속으로 바뀜');saveNow();const raw=JSON.parse(qRaw(SLOTKEY(QA_SLOT)));qOk(raw.aff==='kazdun'&&raw.affN===1,`저장 ${raw.aff} ${raw.affN}`);
  raw.aff='futureaff';qPut(SLOTKEY(QA_SLOT),raw);qOk(load(readSlot(QA_SLOT),QA_SLOT),'불러오기 실패');qOk(P.aff===null&&P._affRaw==='futureaff','모르는 소속 처리 '+P.aff);qOk(saveData().aff==='futureaff','모르는 소속 값이 다시 저장되지 않음');
  raw.aff='academy';qPut(SLOTKEY(QA_SLOT),raw);load(readSlot(QA_SLOT),QA_SLOT);qOk(!affCur()&&saveData().aff==='academy','다른 직업 소속이 켜짐');qClosePanels();return '금화 8000 · 바꾼 횟수 1'});
qT('책 v20','책 30권 · 묶음 5 · 얻는 곳이 모두 게임에 있음 · 처음 읽을 때만 경험치 1% · 같은 책 두 번 안 됨 · 묶음 다 읽으면 칭호 · 도감 「서고」 칸',()=>{qPrep('mage',{lvl:30});qOk(BOOKS.length===30&&Object.keys(BOOK_SETS).length===5,`책 ${BOOKS.length}`);
  for(const b of BOOKS){const s=b.src;qOk(BOOK_SETS[b.grp],b.id+' 묶음');if(s.shop)qOk(v20Town(s.shop)&&b.price>0,b.id+' 상점');if(s.dg)qOk(DUNGEONS.some(d=>d.id===s.dg),b.id+' 던전');if(s.boss)qOk(TYPES[s.boss],b.id+' 보스');if(s.region)qOk(REGIONS[s.region],b.id+' 지역')}
  P.xp=0;const need=xpNeed(P.lvl);qOk(bookGain('t1','시험'),'못 얻음');qOk(P.books.includes('t1'),'읽음 표시 없음');qOk(Math.abs(P.xp-Math.round(need*.01))<=1,`경험치 ${P.xp} / ${need}`);qOk(!BKC.hidden,'읽기 쪽지가 안 뜸');
  const x1=P.xp;qOk(!bookGain('t1'),'같은 책을 또 얻음');qOk(P.xp===x1,'두 번째에 경험치');for(const b of BOOKS)if(b.grp==='towns')bookGain(b.id);qOk(bkSetDone('towns'),'묶음 완성 안 됨');
  qOk(v20TitlesHave().some(t=>t.id==='book_towns'),'칭호 없음');V20A.title('book_towns');qOk(v20TitleCur()&&v20TitleCur().n==='이야기꾼','칭호 달기 실패');
  cxSub='books';const h=codexHtml();cxSub='items';qOk(h.includes('읽은 책 6/30')&&h.includes('브렌힐 방앗간 일지')&&h.includes('???'),'서고 칸 내용');qOk(/data-cx="books"/.test(codexHtml()),'도감에 서고 탭 없음');BKC.hidden=true;return '6/30 · 칭호 이야기꾼'});
qT('책 v20','얻는 곳: 아르덴 잡화점(책 칸 · 금화) · 던전 주인(은류강 지하 수로 → 둘) · 첫 보스(모르가스) · 저장 왕복',()=>{qPrep('priest',{lvl:30});const T=ALLTOWNS.find(t=>t.id==='arden'),a0=actTown,s0=actShop;actTown=T;actShop='general';
  const h=shopHtml();qOk(h.includes('<h2>책')&&/data-v20a="bookbuy" data-v20b="g1"/.test(h),'잡화점에 책 칸 없음');qOk(h.indexOf('<h2>책')<h2i(h),'책 칸 자리');P.gold=1000;V20A.bookbuy('g1');qOk(bkHave('g1')&&P.gold===800,`사기 ${P.gold}`);V20A.bookbuy('g4');qOk(!bkHave('g4'),'다른 마을 책이 팔림');
  actTown=a0;actShop=s0;const D0=DG;try{DG={d:{id:'sewer',n:'은류강 지하 수로'},portals:[],ci:-5};const bs=()=>({k:'b_devourer',x:P.x+50,y:P.y,lvl:12,r:30});rewardKill(bs());qOk(bkHave('g2'),'던전 첫 책');rewardKill(bs());qOk(bkHave('r3'),'던전 둘째 책');DG={d:{id:'qa_none',n:'QA'},portals:[],ci:-5};rewardKill({k:'b_morgath',x:P.x,y:P.y,lvl:25,r:30})}finally{DG=D0}
  qOk(bkHave('a3'),'모르가스 책');loot=[];saveNow();const raw=JSON.parse(qRaw(SLOTKEY(QA_SLOT)));qOk(['g1','g2','r3','a3'].every(id=>raw.books.includes(id)),'저장 '+raw.books);
  qPrep('mage',{slot:6});qOk(P.books.length===0,'새 캐릭터 책');load(readSlot(QA_SLOT),QA_SLOT);qOk(P.books.length===4,'불러오기 '+P.books);BKC.hidden=true;return '잡화점 · 던전 2 · 보스'});
const h2i=h=>{const i=h.indexOf('<h2>반지와 목걸이');return i<0?1e9:i};
qT('책 v20','읽기 쪽지 · 서고 창이 휴대폰 폭(390)에 맞음 · 게임을 멈추지 않음',()=>{qPrep('mage',{lvl:10});bookGain('w8');const r=BKC.getBoundingClientRect(),cs=getComputedStyle(BKC);qOk(!BKC.hidden&&r.width<=Math.min(440,innerWidth-24)+1,`쪽지 폭 ${r.width}`);qOk(cs.position==='fixed'&&cs.overflowY==='auto','쪽지 스크롤');
  qOk(!paused,'쪽지가 게임을 멈춤');bkT=.05;qStep(6);qOk(BKC.hidden,'쪽지가 저절로 닫히지 않음');openCodex();cxSub='books';renderPanel();qOk(pbody.innerHTML.includes('밤마다 골목이 바뀌는 도시'),'서고에 읽은 책 없음');cxSub='items';qClosePanels();return '440px 이하 · 22초 뒤 닫힘'});
qT('현상금 v20','게시판 13곳(헤이븐 + 지역 12) · 걸어서 닿고 마을 사람과 안 겹침 · 날짜+게시판이 같으면 같은 현상금 · 셋 모두 다른 몬스터',()=>{qPrep('archer',{lvl:40});const ids=Object.keys(BTY_BOARDS);qOk(ids.length===13,'게시판 '+ids.length);
  for(const id of ids){const d=BTY_PROP[id];qOk(d,id+' 게시판 없음');const t=v20Town(id),L=v20L(t.reg||'home');qOk(L.decor.includes(d),id+' 장식에 없음');const Pt=wxTownParts(L,t);
    for(const f of Pt.folk)qOk(Math.hypot(f.hx-d.x,f.hy-d.y)>=WXT.npc,`${id} 게시판이 ${f.n}와 겹침`);if(L.lq){const ok=L.okT||(L.okT=wxReach(L.lq,t.x,t.y));qOk(wxCanReach(ok,d.x,d.y),id+' 게시판에 못 닿음')}
    qOk(sqUseLive(d)&&/현상금 게시판/.test(sqUseLive(d).label),id+' 라벨');const a=btyToday('2026-10-08',id),b=btyToday('2026-10-08',id),c=btyToday('2026-10-09',id);
    qOk(JSON.stringify(a)===JSON.stringify(b),id+' 같은 날 다름');qOk(a.length===3&&new Set(a.map(x=>x.k)).size===3,id+' 셋');qOk(JSON.stringify(a)!==JSON.stringify(c),id+' 날이 바뀌어도 같음');for(const x of a)qOk(TYPES[x.k],x.k)}
  sqUse(BTY_PROP.haven);qOk(!panel.hidden&&tab==='quest'&&pbody.innerHTML.includes('오늘의 현상금')&&(pbody.innerHTML.match(/data-v20a="btytake"/g)||[]).length===3,'게시판 창');qClosePanels();return '13곳'});
qT('현상금 v20','받기 → 지도 고리 · 가까이 가면 나타남(생명력 ×7 · 피해 ×1.4 · 크기 ×1.45 · 들판 기준) · 잡으면 증표 +1 · 알림판 · 일지',()=>{qPrep('archer',{lvl:20});loadRegion('home');const s=btyState(),b=btyToday(s.day,'haven')[0];
  V20A.btytake(b.id);qOk(btyActive().length===1,'받지 못함');qOk(sqMarks(false).some(m=>m.col==='#ffb05a'&&m.kind==='ring'),'지도 고리 없음');qOk(sqHudBlocks().some(x=>x.t.includes('현상금')),'알림판 없음');qOk(sqLogHtml().includes(btyName(b)),'일지 없음');
  const sp=btySpot(b);qOk(sp&&!sp.rough&&!blockedAt(sp.x,sp.y),'자리 없음');{let f=null;for(let a=0;a<6.283&&!f;a+=.3){const x=sp.x+Math.cos(a)*800,y=sp.y+Math.sin(a)*800;if(!blockedAt(x,y)&&!blockedAt(x+30,y)&&!blockedAt(x-30,y))f={x,y}}qOk(f,'먼 자리 없음');P.x=f.x;P.y=f.y}qStep(20);qOk(!btyLive(b.id),`멀리서 나타남 ${Math.round(Math.hypot(P.x-sp.x,P.y-sp.y))} ${REG.id}/${sp.reg} ${btyLive(b.id)&&Math.round(Math.hypot(btyLive(b.id).x-sp.x,btyLive(b.id).y-sp.y))}`);P.x=sp.x+100;P.y=sp.y;qStep(20);const e=btyLive(b.id);qOk(e,'가까이 가도 안 나타남');
  const t=TYPES[b.k],D=DIFF[P.diff];qOk(e.max===Math.round(t.hp*(1+.34*(e.lvl-1))*7*D.hp),`생명력 ${e.max}`);qOk(Math.abs(e.dmg-t.dmg*(1+.18*(e.lvl-1))*1.4)<1e-6,`피해 ${e.dmg}`);qOk(Math.abs(e.r-t.r*1.45)<1e-6&&e.sc===1.45,'크기');
  render();qOk(e.hp>0,'');const tok0=s.tok;e.hp=1;hurtE(e,50,{cls:P.cls,el:'phys',proc:1});qOk(e.dead,'죽지 않음');qOk(s.tok===tok0+1&&s.n===1&&s.done.includes(b.id),`증표 ${s.tok}`);qOk(!btyActive().length,'잡은 뒤에도 진행 중');loot=[];return `${btyName(b)} Lv${e.lvl}`});
qT('현상금 v20','동시에 3개 · 하루 증표 9개 · 날 바뀌면 받은 것만 비우고 증표는 남음 · 증표 바꾸기 · 저장 값 다듬기(모르는 칸 보존)',()=>{qPrep('mage',{lvl:30});const day='2026-10-08';V20.qaNow=new Date(2026,9,8,12).getTime();try{const s=btyState();qOk(s.day===day,'날짜 '+s.day);
  const L=[...btyToday(day,'haven'),...btyToday(day,'goldmere')];for(const b of L.slice(0,4))V20A.btytake(b.id);qOk(btyActive().length===3,'동시 '+btyActive().length);
  const all=Object.keys(BTY_BOARDS).flatMap(k=>btyToday(day,k));s.took=all.map(b=>b.id);for(let i=0;i<10;i++)btyCredit(all[i].id,null);qOk(s.n===9&&s.tok===9,`하루 ${s.n} · 증표 ${s.tok}`);
  V20A.btybuy('tp');qOk(s.tok===7&&tpCount()>=3,'두루마리');V20A.btybuy('title');qOk(v20OwnHas('title:bounty')&&s.tok===1,'칭호');V20A.btybuy('box');qOk(s.tok===1,'증표 모자란데 바뀜');
  V20.qaNow+=86400e3;const s2=btyState();qOk(s2.day==='2026-10-09'&&!s2.took.length&&!s2.done.length&&s2.n===0&&s2.tok===1,'날 바뀜 '+JSON.stringify(s2));
  const c=btyClean({day:'x',took:['a',5,'a'],done:null,tok:'3',n:-2,zz:{q:1}});qOk(c.took.length===1&&c.done.length===0&&c.tok===3&&c.n===0&&c.zz&&c.zz.q===1,'다듬기 '+JSON.stringify(c))}finally{V20.qaNow=null}return '3 · 9 · 증표 남음'});
qT('고르는 의뢰 v20','먼지문 「도둑맞은 발굴 도구」: 받을 때 두 갈래 단추 · b 고르면 목표·보상이 바뀜 · 바위틈 자리(걸어서 닿음) · 끝내면 b 보상 · P.sq.ch 저장 왕복 · 포기하면 다시 고름',()=>{qPrep('warrior',{lvl:45});const q=SQBY.dg1,s=sqState();qOk(q.choice&&CHOICE.dg1,'고르는 의뢰 아님');
  SQV.mode='npc';SQV.npc=sqFolk(q.giver);const h=sqNpcHtml();qOk((h.match(/data-v20a="chpick"/g)||[]).length===2&&!h.includes(`data-sqacc="dg1"`),'두 갈래 단추 없음');qOk(q.say.includes(CHOICE.dg1.ask),'고르기 전 말에 물음 없음');
  qOk(chAccept('dg1','b'),'받지 못함');qOk(s.ch.dg1==='b'&&q.goals.length===2&&q.goals[1].use==='dg_kidcamp',`갈래 ${s.ch.dg1} 목표 ${q.goals.length}`);sqAbandon('dg1');qOk(!s.ch.dg1,'포기해도 갈래가 남음');
  qOk(chAccept('dg1','b'),'다시 받지 못함');const sp=CH_SPOT.dg_kidcamp,L=RCACHE.canyon;qOk(sp&&!wxLiq(L,sp.x,sp.y),'자리 물 위');const ok=L.okT||(L.okT=wxReach(L.lq,L.town.x,L.town.y));qOk(wxCanReach(ok,sp.x,sp.y),'자리에 못 닿음');
  for(let i=0;i<6;i++)questKill({k:'c_bandit',x:P.x,y:P.y,lvl:40});qOk(sqGoalDone(q,0),'처치');const t=sqTarget(q);qOk(t&&t.reg==='canyon'&&Math.hypot(t.x-sp.x,t.y-sp.y)<1,'목표 자리 '+JSON.stringify(t));
  loadRegion('canyon');const d=decor.find(d=>d.use==='dg_kidcamp');qOk(d&&sqUseLive(d),'자리를 쓸 수 없음');sqUse(d);qOk(sqAllDone(q),'끝나지 않음');loadRegion('home');
  const raw=saveData();qOk(raw.sq.ch&&raw.sq.ch.dg1==='b','저장에 갈래 없음');qOk(sqClean(raw.sq).ch.dg1==='b','다듬기에서 갈래 사라짐');const g0=P.gold,gw=q.rw.gold;sqFinish('dg1');qOk(P.gold===g0+gw&&gw===CHOICE.dg1.b.rw.gold,`보상 ${P.gold-g0} / ${gw}`);
  qOk(s.ch.dg1==='b'&&q.done.includes('레트'),'끝낸 뒤 갈래 · 끝말');qClosePanels();return `b 갈래 금화 ${gw}`});
qT('고르는 의뢰 v20','echo: 고른 갈래에 따라 나중 의뢰 말 한 줄 · 덤(바람목 장비 하나 더 · 니크사르 생명력 −10% · 칼리 10% 느림)',()=>{qPrep('archer',{lvl:60});const s=sqState();s.ch=s.ch||{};s.ch.rw1='a';qOk(!SQBY.rw5.done.includes('(오스크)'),'a 갈래인데 echo');s.ch.rw1='b';qOk(SQBY.rw5.done.includes('(오스크)'),'b 갈래 echo 없음');
  s.ch.gh2='b';qOk(SQBY.ll4.say.includes('(미로) 오르뎀'),'ll4 말 echo');s.a.ll4={c:{},got:[]};const e=dgMob('r_nyxar',P.x+300,P.y,60),m0=e.max;qStep(2);qOk(e.max===Math.round(m0*.9),`니크사르 ${m0}→${e.max}`);e.dead=true;delete s.a.ll4;
  s.ch.wc1='b';const q=SQBY.wc4;s.a.wc4={c:{},got:[]};q.goals.forEach((g,j)=>s.a.wc4.c['g'+j]=g.n||1);const n0=P.bag.length;sqFinish('wc4');const add=P.bag.length-n0;qOk(add===(q.rw.item?(typeof q.rw.item==='number'?q.rw.item:1):0)+1||add>=1,'덤 장비 없음 '+add);
  s.ch.tm1='b';s.a.tm4={c:{},got:[]};const k=dgMob('r_kali',P.x+400,P.y,50);k.aggroed=true;const x0=k.x;qStep(30,{each:()=>{}});qOk(chBonus('tm4')&&chBonus('tm4').bossSlow===.1,'칼리 덤');k.dead=true;delete s.a.tm4;loot=[];return '말 · 장비 · 보스'});
const qV20Cb=()=>{qPrep('mage',{lvl:60});P.x=QA_SPOT.x;P.y=QA_SPOT.y;CB.mkT=0;return el=>({cls:'mage',el,n:'시험 '+el})};
qT('연계 v20','깨뜨리기: 얼어 있는 허수아비를 대지 · 물리로 치면 그 한 대의 40%를 한 번 더(두 번에 나뉘어) · 얼음 풀림',()=>{const sp=qV20Cb();const e=qDummy(P.x+120,P.y);e.freezeT=3;const s=sp('earth');const n0=CB.n.shatter;hurtE(e,200,Object.assign({},s,{burn:0,slow:0,freeze:0}));
  qOk(CB.n.shatter===n0+1,'연계가 안 터짐');qOk(e.freezeT===0,'얼음이 안 풀림');qOk(e.hits===2,'나뉘어 들어가지 않음 '+e.hits);const T=e.taken;let ok=false;for(let F=Math.floor(T/1.4)-3;F<=Math.ceil(T/1.4)+3;F++)if(F>0&&F+Math.max(1,Math.round(F*.4))===T)ok=true;qOk(ok,'피해 '+T);
  const e2=qDummy(P.x+160,P.y+60);hurtE(e2,200,Object.assign({},s,{burn:0,slow:0,freeze:0}));qOk(e2.hits===1,'얼지 않았는데 연계');return `합 ${T}`});
qT('연계 v20','감전 퍼짐: 느려진 적을 번개로 치면 120 안의 다른 적 둘에게 30% · 같은 적에서는 1초에 한 번',()=>{const sp=qV20Cb();const a=qDummy(P.x+150,P.y),b=qDummy(P.x+150,P.y+60),c=qDummy(P.x+210,P.y),d=qDummy(P.x+150,P.y+90),far=qDummy(P.x+150,P.y+400);a.slowT=3;
  const s=Object.assign({},sp('storm'),{slow:0,freeze:0,burn:0,chain:0});hurtE(a,300,s);const hit=[b,c,d].filter(o=>o.taken>0).length;qOk(hit===2,'튄 적 '+hit);qOk(far.taken===0,'멀리 있는 적이 맞음');
  const t1=b.taken+c.taken+d.taken;hurtE(a,300,s);qOk(b.taken+c.taken+d.taken===t1,'1초 안에 또 튐');return '둘에게 튐'});
qT('연계 v20','불길 번짐: 불타는 적을 바람으로 치면 100 안의 적에게 같은 화상(3초)이 옮겨 붙음',()=>{const sp=qV20Cb();const a=dgMob('wolf',P.x+150,P.y,30),b=dgMob('wolf',P.x+150,P.y+50,30),c=dgMob('wolf',P.x+150,P.y+400,30);for(const o of [a,b,c]){o.hp=o.max=1e6;o.atkCd=1e9}
  a.burn={t:3,dps:12};const s=Object.assign({},sp('wind'),{burn:0,slow:0,freeze:0,knock:0});hurtE(a,50,s);qOk(b.burn&&b.burn.dps===12&&b.burn.t===3,'옮겨 붙지 않음 '+JSON.stringify(b.burn));qOk(!c.burn,'멀리 있는 적에 붙음');for(const o of [a,b,c])o.dead=true;return '화상 12/초'});
qT('연계 v20','표식 마무리: 내가 표식을 붙인 적이 쓰러지면 최대 마나 3% (1초에 한 번) · 글씨 끄기 설정',()=>{qPrep('archer',{lvl:40});CB.mkT=0;const e=dgMob('wolf',P.x+150,P.y,30);applyFx(e,{cls:'archer',mark:{amp:.1,dur:6}},P);qOk(e.markT>0&&e._mkT>time,'표식 없음');
  P.mp=0;killE(e);qOk(Math.abs(P.mp-maxMp()*.03)<.6,`마나 ${P.mp} / ${maxMp()*.03}`);const e2=dgMob('wolf',P.x+150,P.y,30);killE(e2);qOk(Math.abs(P.mp-maxMp()*.03)<.6,'표식 없는데 마나');
  const on=cbTxtOn();V20A.cbtxt();qOk(cbTxtOn()===!on,'글씨 설정');V20A.cbtxt();cxSub='combos';qOk(codexHtml().includes('감전 퍼짐'),'도감 연계 칸');cxSub='items';loot=[];return '마나 3%'});
const qV20Won=(id,reg)=>{const ms=wonFind(id);qOk(ms,id+' 시각 없음');V20.qaNow=ms;loadRegion(reg);const T=RCACHE[reg].town;let p=null;for(let r=700;r<2000&&!p;r+=100)for(let a=0;a<6.283&&!p;a+=.4){const x=T.x+Math.cos(a)*r,y=T.y+Math.sin(a)*r;if(x>200&&y>200&&x<WORLD-200&&y<WORLD-200&&!blockedAt(x,y)&&!inSafe(x,y,100))p={x,y}}
  qOk(p,'들판 자리 없음');P.x=p.x;P.y=p.y;followCam();wonSlow();return p};
qT('신비 v20','같은 시각이면 같은 신비 · 12가지 모두 일어남 · 25분마다 5분 · 1분 전 알림 · 지도 고리 · 알림판',()=>{qPrep('mage',{lvl:50});qOk(WONDERS.length===12,'신비 '+WONDERS.length);const t=Date.UTC(2026,9,8,3,0,0);qOk(wonderAt(t).w.id===wonderAt(t).w.id&&wonderAt(t+1000).w===wonderAt(t).w,'같은 시각 다름');
  for(const w of WONDERS){const ms=wonFind(w.id,t);qOk(ms&&wonderAt(ms).w.id===w.id&&wonderAt(ms).active,w.id)}const a=wonderAt(t);qOk(wonderAt(t+300e3+1000).active===false||a.left<300,'5분 뒤에도 계속');
  try{const ms=wonFind('aurora',t),st=ms-10e3;V20.qaNow=st-70e3;WON.warnK=-1;wonSlow();qOk(WON.warnK===-1,'70초 전에 알림');V20.qaNow=st-50e3;wonSlow();const a2=wonderAt(ms);qOk(WON.warnK===a2.k,'1분 전 알림 없음');
    V20.qaNow=ms;loadRegion('home');wonSlow();qOk(sqMarks(true).some(m=>m.col==='#c9a6ff'),'지도 고리');qOk(sqHudBlocks().some(b=>b.t.includes('신비')),'알림판')}finally{V20.qaNow=null;loadRegion('home')}return `${WONDERS.length}가지`});
qT('신비 v20','그 지역 들판에서만 효과: 다른 지역 · 마을 안은 없음 · 이동 +10은 장비 능력치 칸에 덧셈',()=>{qPrep('archer',{lvl:50});try{const b=stat('ms');const ms=wonFind('whalesong');V20.qaNow=ms;loadRegion('home');P.x=QA_SPOT.x;P.y=QA_SPOT.y;wonSlow();qOk(!wonIn()&&stat('ms')===b,'다른 지역에서 효과');
    loadRegion('sea');const T=RCACHE.sea.town;P.x=T.x;P.y=T.y;wonSlow();qOk(!wonIn()&&stat('ms')===b,'마을 안에서 효과');qV20Won('whalesong','sea');qOk(wonIn(),'들판인데 효과 없음');qOk(stat('ms')===b+10,`이동 ${b}→${stat('ms')}`);
    V20.qaNow=ms+400e3;wonSlow();qOk(!wonIn()&&stat('ms')===b,'끝난 뒤에도 효과')}finally{V20.qaNow=null;enemies=[];loadRegion('home')}return '이동 +10'});
qT('신비 v20','효과 수치: 오로라 마나 회복 +50%(덧셈) · 번개 곶 번개 피해 +15% · 메아리 재사용 −10% · 오르는 비 밀쳐내기 → 띄우기',()=>{qPrep('mage',{lvl:50});try{V20.qaNow=null;wonSlow();const b=stat('regen'),base=gearStats(),c0=stat('cdr');
    qV20Won('aurora','ice');qOk(Math.abs(stat('regen')-b-v20RegenPct(base,.5))<.11,`마나 회복 ${b}→${stat('regen')}`);enemies=[];
    qV20Won('stormcape','cliffs');let x=0;for(const f of V20.dmgAdd)x+=f({k:'wolf'},{el:'storm',cls:'mage'})||0;qOk(Math.abs(x-.15)<1e-9,'번개 '+x);x=0;for(const f of V20.dmgAdd)x+=f({k:'wolf'},{el:'fire',cls:'mage'})||0;qOk(x===0,'불 '+x);enemies=[];
    qV20Won('drumecho','jungle');qOk(Math.abs(stat('cdr')-c0-10)<.01,`재사용 ${c0}→${stat('cdr')} · ${wonIn()} ${WON.w&&WON.w.id} ${REG.id} ${WON.inNow}`);enemies=[];
    qV20Won('risingrain','highland');const e=dgMob('k_harpy',P.x+100,P.y,40);e.atkCd=1e9;const x0=e.x,y0=e.y;applyFx(e,{knock:80,cls:'mage'},P);qOk(e.x===x0&&e.y===y0&&e.rootT>=.8,'띄우기 아님');e.dead=true}finally{V20.qaNow=null;enemies=[];loadRegion('home')}return '덧셈'});
qT('신비 v20','소금 거울: 내 그림자가 내 최대 생명력 60%로 나옴 · 내 모습으로 그려짐 · 이기면 신비의 상자 · 무리 이름표',()=>{qPrep('priest',{lvl:50});try{qV20Won('saltmirror','desert');const m=enemies.find(e=>e.mirror);qOk(m,'그림자 없음');qOk(m.max===Math.round(maxHp()*.6)&&m.hp===m.max,`생명력 ${m.max} / ${maxHp()}`);
    qOk(m.mirEl.length>=1&&m.mirEl.length<=3,'마법 셋');m._s=W2S(m.x,m.y);render();qStep(30,{render:true});const l0=loot.length;m.hp=1;hurtE(m,99,{cls:P.cls,el:'holy',proc:1});qOk(m.dead,'안 죽음');qOk(WON.chestK===WON.k&&loot.length>l0+1,'상자 없음');
    enemies=[];qV20Won('noshadow','plains');WON.spK=-1;wonSlow();const L=enemies.filter(e=>e.won==='noshadow');qOk(L.length>=4&&L.every(e=>e.v20n==='숨어 있던 약탈 기사'&&e.elite),'약탈 기사 '+L.length);const t=TYPES.p_raider;qOk(L.every(e=>e.max===Math.round(t.hp*(1+.34*(e.lvl-1))*3*DIFF[P.diff].hp)),'정예 세기');render()}finally{V20.qaNow=null;enemies=[];loot=[];loadRegion('home')}return '60% · 상자'});
qT('신비 v20','저장: P.won 기본값 {seen:[]} · 본 신비가 남음 · 모르는 칸 보존 · 도감 「신비」 칸',()=>{qPrep('mage',{lvl:50});qOk(P.won&&Array.isArray(P.won.seen)&&!P.won.seen.length,'기본값 '+JSON.stringify(P.won));try{qV20Won('fireflies','moor');qOk(P.won.seen.includes('fireflies'),'본 신비 없음');qOk(WON.wisps.length>=6,'빛 '+WON.wisps.length);
    const w0=WON.wisps[0];P.hp=maxHp()*.5;const h0=P.hp;P.x=w0.x;P.y=w0.y;qStep(2);qOk(P.hp>h0,'빛을 지나도 회복 없음')}finally{V20.qaNow=null;enemies=[];loadRegion('home')}
  P.won.zz=7;saveNow();const raw=JSON.parse(qRaw(SLOTKEY(QA_SLOT)));qOk(raw.won.seen.includes('fireflies')&&raw.won.zz===7,'저장 '+JSON.stringify(raw.won));qPrep('archer',{slot:6});load(readSlot(QA_SLOT),QA_SLOT);qOk(P.won.seen.includes('fireflies')&&P.won.zz===7,'불러오기');
  cxSub='wonders';const h=codexHtml();cxSub='items';qOk(h.includes('떠나지 못한 등불')&&h.includes('언제 어디서'),'도감 신비 칸');return '본 신비 1'});
qT('평판 v20','마을 의뢰를 끝내면 그 마을의 세력 점수(+150, 연속 의뢰 끝 +400) · 다른 세력은 그대로 · 게시판 현상금 → 그 마을 세력',()=>{qPrep('mage',{lvl:20});const s=sqState();sqAccept('cat');const q=SQBY.cat;sqProgress(q,0,1,true);sqFinish('cat');qOk(P.rep.dawn===150,'여명교단 '+P.rep.dawn);qOk(P.rep.knights===0&&P.rep.academy===0,'다른 세력');
  const fin=SQ.find(o=>o.req&&!o.rep&&o.town==='rookwell'&&!SQ.some(x=>x.req===o.id));qOk(fin,'연속 의뢰 끝 없음');s.a[fin.id]={c:{},got:[]};fin.goals.forEach((g,j)=>s.a[fin.id].c['g'+j]=g.n||1);const r0=P.rep.steppe;sqFinish(fin.id);qOk(P.rep.steppe===r0+400,`초원 ${r0}→${P.rep.steppe}`);
  const b=btyToday(btyState().day,'goldmere')[0];btyState().took.push(b.id);const k0=P.rep.knights,st0=P.rep.steppe;btyCredit(b.id,null);qOk(P.rep.knights===k0+40&&P.rep.steppe===st0+40,'현상금 평판');loot=[];return `여명 ${P.rep.dawn} · 초원 ${P.rep.steppe}`});
qT('평판 v20','하루 상한 600(매일 · 현상금 · 신비) · 보통 의뢰 보상은 상한 밖 · 날 바뀌면 다시',()=>{qPrep('warrior',{lvl:30});V20.qaNow=new Date(2026,9,8,12).getTime();try{for(let i=0;i<30;i++)repGain('haven','bounty');qOk(P.rep.knights===600,'상한 '+P.rep.knights);repGain('haven','wonder');qOk(P.rep.knights===600,'신비도 상한');
    repGain('haven','townQuest');qOk(P.rep.knights===750,'보통 의뢰가 막힘 '+P.rep.knights);V20.qaNow+=86400e3;repGain('haven','daily');qOk(P.rep.knights===810,'날 바뀐 뒤 '+P.rep.knights)}finally{V20.qaNow=null}return '600'});
qT('평판 v20','소속과 이어진 세력은 +25%(덧셈) · 이어지지 않은 세력은 그대로',()=>{qPrep('priest',{lvl:30});affSet('aurel','시험');repGain('arden','townQuest');qOk(P.rep.dawn===188,'여명교단 '+P.rep.dawn);qOk(P.rep.academy===150,'마법원 '+P.rep.academy);
  qPrep('archer',{lvl:30});affSet('steppe','시험');repGain('goldmere','bounty');qOk(P.rep.steppe===50&&P.rep.knights===40,`초원 ${P.rep.steppe} 기사단 ${P.rep.knights}`);return '150→188'});
qT('평판 v20','세력 상인: 단계에 맞는 물건만 열림 · 편의(군마 휘파람: 들판에서 싸우지 않을 때 이동 +10) · 판매가 +10% · 「평판」 탭(휴대폰은 접힘)',()=>{qPrep('warrior',{lvl:30});loadRegion('home');
  for(const f in FACTIONS){const F=FACTIONS[f];qOk(TWFOLK[F.hall.npc],f+' 상인 없음');qOk(F.sell.length>=4&&F.sell.every(it=>it.t>=1&&it.t<=4),f+' 목록')}
  const f=sqFolk('j2_warrior');SQV.mode='npc';SQV.npc=f;let h=sqNpcHtml();qOk(h.includes('에르난 기사단 상인')&&!/data-v20a="repbuy"/.test(h),'낯섦인데 살 수 있음');
  P.rep.knights=3000;h=sqNpcHtml();qOk((h.match(/data-v20a="repbuy"/g)||[]).length===2&&h.includes('존경 필요'),'신뢰 단계 목록');P.rep.knights=6000;P.gold=1e6;V20A.repbuy('knights|perk:horse');qOk(v20OwnHas('perk:horse'),'군마 휘파람');
  const b=stat('ms');P.x=QA_SPOT.x+900;P.y=QA_SPOT.y;let p=null;for(let r=600;r<1800&&!p;r+=100)for(let a=0;a<6.283&&!p;a+=.5){const x=QA_SPOT.x+Math.cos(a)*r,y=QA_SPOT.y+Math.sin(a)*r;if(!blockedAt(x,y)&&!inSafe(x,y,-60))p={x,y}}P.x=p.x;P.y=p.y;enemies=[];P.hurtT=0;qStep(20);qOk(stat('ms')===b+10||V20.perkMove===1&&stat('ms')>=b+10||b>=40,`이동 ${b}→${stat('ms')}`);
  P.hurtT=1;qStep(16);qOk(V20.perkMove===0,'싸우는 중에도 켜짐');V20A.repbuy('knights|kn_buff');qOk(P.buffs._v20kn_buff&&P.buffs._v20kn_buff.dr===.05,'기름 버프');
  tab='rep';panel.hidden=false;renderPanel();qOk(pbody.innerHTML.includes('에르난 기사단')&&pbody.innerHTML.includes('칭호')&&!document.querySelector('.tabs').hidden,'평판 탭');qOk(v20Mob()||/<details class="v20box" open/.test(pbody.innerHTML),'펼침');qClosePanels();return '신뢰 2개 · 군마'});
qT('평판 v20','저장 왕복: P.rep(점수 · 산 편의 · 칭호) · P.repDay · 모르는 세력 칸 보존 · 잘못된 값 다듬기',()=>{qPrep('archer',{lvl:30});P.rep.coast=1234;v20OwnAdd('perk:luck');v20OwnAdd('title:coast');P.rep._title='rep_coast';P.rep.zz=5;repGain('pearlport','wonder');
  saveNow();const raw=JSON.parse(qRaw(SLOTKEY(QA_SLOT)));qOk(raw.rep.coast===1234+80&&raw.rep._own.includes('perk:luck')&&raw.rep._title==='rep_coast'&&raw.rep.zz===5,'저장 '+JSON.stringify(raw.rep));qOk(raw.repDay&&raw.repDay.got.coast===80,'하루 '+JSON.stringify(raw.repDay));
  qPrep('mage',{slot:6});load(readSlot(QA_SLOT),QA_SLOT);qOk(P.rep.coast===1314&&v20TitleCur()&&v20TitleCur().n==='넬라의 동전'&&P.rep.zz===5,'불러오기');const c=repClean({dawn:'50',academy:-3,_own:[1,'a','a'],_title:5});qOk(c.dawn===50&&c.academy===0&&c._own.length===1&&c._title==='','다듬기 '+JSON.stringify(c));
  const l={kind:'gold',amt:100,x:P.x,y:P.y,t:0};const g0=P.gold;pickup(l);qOk(P.gold-g0===110,'금화 주머니 '+(P.gold-g0));return '1314'});
qT('저장 v20','v19 저장 불러오기: 새 칸(aff · affN · books · bty · sq.ch · won · rep · repDay) 기본값 · 모르는 의뢰 id(더 새 판)는 버리지 않고 다시 저장 · 다시 저장 → 불러오기 같음',()=>{qResetStore();
  const v19=Object.assign(JSON.parse(JSON.stringify(QA_V19MG)),{sq:{a:{zz_new:{c:{g0:2},got:[]},cat:{c:{g0:1},got:[0]}},d:{zz_old:3,bread:1},cd:{zz_day:9e12},hide:1}});qPut('arseia-char-3',v19);qOk(load(readSlot(3),3),'불러오기 실패');
  qOk(P.aff===null&&P.affN===0&&Array.isArray(P.books)&&!P.books.length,'소속·책 기본값');qOk(P.bty&&P.bty.tok===0&&Array.isArray(P.bty.took),'현상금 기본값');qOk(P.sq.ch&&!Object.keys(P.sq.ch).length,'갈래 기본값');
  qOk(P.won&&Array.isArray(P.won.seen),'신비 기본값');qOk(P.rep&&P.rep.dawn===0&&Array.isArray(P.rep._own),'평판 기본값');qOk(P.repDay&&typeof P.repDay.got==='object','하루 상한 기본값');
  qOk(!P.sq.a.zz_new&&P.sq.a.cat&&P.sq.d.bread===1,'알려진 의뢰');saveNow();const raw=JSON.parse(qRaw(SLOTKEY(3)));
  for(const k of ['aff','affN','books','bty','won','rep','repDay'])qOk(k in raw,`저장에 ${k} 없음`);qOk(raw.sq.ch&&typeof raw.sq.ch==='object','저장에 sq.ch 없음');
  qOk(raw.sq.a.zz_new&&raw.sq.a.zz_new.c.g0===2&&raw.sq.d.zz_old===3&&raw.sq.cd.zz_day===9e12,'모르는 의뢰 id가 저장에서 사라짐 '+JSON.stringify(raw.sq));for(const k in v19)qOk(k in raw,`옛 칸 ${k}가 빠짐`);
  const key=()=>JSON.stringify({sq:saveData().sq,aff:P.aff,books:P.books,bty:P.bty,won:P.won,rep:P.rep,lvl:P.lvl,sk:P.sk});const a=key();qPrep('priest',{slot:6});load(readSlot(3),3);qOk(key()===a,'다시 불러오면 달라짐');return '새 칸 8 · 모르는 의뢰 3개 보존'});
qT('드랍 v21','잡템 줄이기(사용자 03:17): 몬스터가 떨어뜨린 장비 중 일반은 절반·마법은 70%만 남김 · 희귀·세트·유니크·상급 유니크는 늘 남김 · 처치·던전 보스 덤에 적용, 의뢰 보상은 그대로',()=>{qPrep('mage',{lvl:50});const n=[0,0,0,0,0,0],k=[0,0,0,0,0,0];
  for(let i=0;i<20000;i++){const it=makeItem(50,i%5===0);n[it.rar]++;if(junkKeep(it))k[it.rar]++}
  for(const r of [2,3,4])qOk(k[r]===n[r],`${RAR[r].n} ${k[r]}/${n[r]}`);qOk(Math.abs(k[0]/n[0]-.5)<.03,`일반 ${qR(k[0]/n[0])}`);qOk(Math.abs(k[1]/n[1]-.7)<.03,`마법 ${qR(k[1]/n[1])}`);
  let it=0;const N=20000;for(let i=0;i<N;i++){loot.length=0;const e=qDummy(P.x+100,P.y);e.lvl=50;e.elite=false;rewardKill(e);it+=loot.filter(l=>l.kind==='item').length}loot.length=0;qClear();const pr=it/N;qOk(pr>.045*DROP24&&pr<.08*DROP24,`일반 몬스터 한 마리당 장비 ${qR(pr*100)}% (예전 10% · v24 ×${DROP24})`);qOk(!junkKeep(null),'빈 값');
  const all=n.reduce((a,b)=>a+b,0),kept=k.reduce((a,b)=>a+b,0);return `남김 ${Math.round(kept/all*100)}% · 일반 ${qR(k[0]/n[0])} · 마법 ${qR(k[1]/n[1])} · 희귀 이상 100%`});
/* ===== v21 지역 (REGION): 속성 사냥터 6곳 · 몬스터 속성표 · 지옥 봉인 · 던전 6곳 · 같이 하기 · 저장 (wx21-world.js · wx21.js) ===== */
const Q21_NEW=['mistlake','scorch','starsea','thunder','roots','eclipse'],Q21_HELL=['starsea','thunder','roots','eclipse'];
const q21Prep=(id,cls)=>{const D=REGIONS[id];if(D.hell)return qW3Prep(cls||'mage',Math.min(MAXLV,D.base+45));qPrep(cls||'mage',{lvl:D.base+5});P.invT=1e9;return P};
const q21HP=L=>40+12*L+4*(10+1.5*(L-1)),q21MUL=L=>1+.18*(L-1);
qT('v21 지역','자료: 새 지역 6곳은 REGIONS 맨 끝(옛 14곳 번호 그대로) · 몬스터 속성 TYPES[k].el = WX21_EL (82종 이상) · 새 어둠 몬스터는 언데드 아님(옛 심연의 그림자 · 기사는 언데드라 신성 ×2만, GEAR) · Lv24 미만 · 아르세이아 남부는 속성 없음 · 지도 자리 · 곡',()=>{
  qOk(REG_IDS.slice(14,20).join()===Q21_NEW.join()&&REG_IDS[20]==='royal'&&REG_IDS.length===21,`뒤 ${REG_IDS.slice(14)}`);/* v26: 왕도는 그 뒤(같이 하기 지역 번호를 그대로 두려고) */qOk(REG_IDS.indexOf('abyss')===11&&REG_IDS.indexOf('plateau')===12&&REG_IDS.indexOf('capital')===13,'옛 번호가 바뀜');
  qOk(!Q21_NEW.some(id=>id in WX_REGIONS),'WX_REGIONS에 섞임 (옛 v18 점검이 새 지역을 옛 5곳으로 셈)');
  let n=0;for(const k in WX21_EL){qOk(TYPES[k],`표에 없는 몬스터 ${k}`);qOk(TYPES[k].el===WX21_EL[k],`${k}.el ${TYPES[k].el}≠${WX21_EL[k]}`);qOk(WX21_ELN[TYPES[k].el]&&WX21_ELCOL[TYPES[k].el],`${k} 속성 값`);n++}qOk(n>=82,`속성 ${n}종`);
  const bad=[];for(const k in TYPES){const t=TYPES[k];if(!t.el)continue;if(t.el==='dark'&&t.undead&&WX21_TYPES[k])bad.push('어둠+언데드 '+k);if(t.min&&t.min<24)bad.push('저레벨 '+k);if(t.el==='holy')bad.push('신성 몬스터 '+k)}
  for(const k of [...(REGIONS.home.mobs||[]),...Object.keys(TYPES).filter(k=>TYPES[k].min&&TYPES[k].min<24)])if(TYPES[k]&&TYPES[k].el)bad.push('남부 '+k);qOk(!bad.length,bad.slice(0,6).join(', '));
  qOk(WX21_AMP===.2&&WX21_OPP.fire==='ice'&&WX21_OPP.storm==='earth'&&WX21_OPP.holy==='dark'&&WX21_ATK.wind==='storm'&&WX21_ATK.light==='holy'&&!WX21_ATK.arcane&&!WX21_ATK.phys,'상성표');
  for(const id of Q21_NEW){const D=REGIONS[id];qOk(WX21_REGEL[id]&&WPOS[id]&&RCACHE[id]&&RCACHE[id].town&&ALLTOWNS.includes(RCACHE[id].town),`${id} 대표 속성/지도/마을`);
    qOk(MUSIC_INDEX[BGM_REG[id]]&&BGM_REG[id]!=='field',`${id} 곡 ${BGM_REG[id]}`);qOk(!!D.hell===Q21_HELL.includes(id),`${id} 지옥 표시`);
    const els=D.mobs.map(k=>TYPES[k].el);qOk(els.filter(e=>e===WX21_REGEL[id]).length>=3&&els.filter(e=>!e).length===1,`${id} 몬스터 속성 ${els}`);qOk(TYPES[D.boss].el===WX21_REGEL[id],`${id} 우두머리 속성`);
    for(const k of [...D.mobs,D.boss])qOk(TYPES[k].reg&&MON[TYPES[k].draw],`${k} 표/그림`)}
  return `속성 ${n}종 · ${Q21_NEW.map(id=>`${id}:${-(10+REG_IDS.indexOf(id))}`).join(' ')}`});
for(const id of Q21_NEW)qT('v21 지역',`새 지역 ${REGIONS[id].n}${REGIONS[id].hell?' (지옥 전용)':''}: 들어가기 · 마을(짝문 · 상점 · 창고) · 레벨대 · 들판 몬스터 · 우두머리 · 그리기 NaN 없음`,()=>{const D=REGIONS[id],add=D.hell?40:0;q21Prep(id);switchRegion(id);
  qOk(REG.id===id,'못 들어감');const T=TOWNS[0];qOk(T.id===D.town.id,`마을 ${T.id}`);qOk(CAVES.length===WX21_DUNGEONS.filter(d=>d.reg===id).length,`동굴 ${CAVES.length}`);
  qOk(qActAt(T.gate.x+30,T.gate.y)==='gate','짝문 act');{const sh=(T.shops&&T.shops[0])||T.shop;qOk(qActAt(sh.x,sh.y+30)==='shop','상점 act')}qOk(T.stash&&qActAt(T.stash.x,T.stash.y+20)==='stash','창고 act');
  const a=wxTownAudit(RCACHE[id],T);qOk(!a.bad.length,`마을 사람: ${a.bad.slice(0,3).map(b=>b.join(' ')).join('; ')}`);
  const l0=levelAt(T.x,T.y+SAFE+20)+DIFF[P.diff].add,lz=levelAt(REG.lair.x,REG.lair.y)+DIFF[P.diff].add;qOk(Math.abs(l0-(D.base+add))<=2.01,`마을 앞 Lv${qR(l0)}`);qOk(lz<=D.base+add+(D.zcap||99)+.01&&lz<=MAXLV+.01,`깊은 곳 Lv${qR(lz)}`);
  P.x=T.x;P.y=T.y+120;followCam();qStep(20,{renderEvery:5});
  const p=qFreeAt(T.x+(REG.lair.x-T.x)*.45,T.y+(REG.lair.y-T.y)*.45,0,0)||qFreeAt(REG.lair.x,REG.lair.y,500,0);P.x=p.x;P.y=p.y;followCam();
  for(let i=0;i<10;i++)spawnEnemy();qStep(120,{renderEvery:12,each:()=>{P.hp=maxHp();P.invT=1e9}});const ks=[...new Set(enemies.map(e=>e.k))];qOk(ks.length,'몬스터가 안 나옴');
  qOk(ks.every(k=>D.mobs.includes(k)||k===D.boss||k===(TYPES[D.boss]||{}).summon),`다른 지역 몬스터 ${ks}`);
  const lv=enemies.map(e=>e.lvl);qOk(lv.every(v=>v>=D.base+add-1&&v<=MAXLV+3),`몬스터 레벨 ${lv}`);
  qClear();P.x=REG.lair.x+120;P.y=REG.lair.y+60;terrFix(P);followCam();regionTick(1/60);qOk(REG.bossE&&REG.bossE.k===D.boss,'우두머리가 안 나옴');qStep(30,{renderEvery:6,each:()=>{P.hp=maxHp();P.invT=1e9}});
  const b=REG.bossE;hurtE(b,b.hp+10,{el:'arcane'});qStep(2,{render:false});qOk(REG.bossDead,'우두머리가 안 쓰러짐');
  mmBg=null;drawMinimap();qOk(!qBad().length,'NaN');loadRegion('home');return `마을 ${T.n} · Lv${qR(l0)}~${qR(lz)} · ${ks.map(k=>TYPES[k].n).join('·')}`});
qT('v21 지역','걸어서 닿음: 새 6곳의 짝문 · 상점 · 창고 · 포탈(도착 자리) · 동굴 앞 · 둥지 · 채집 자리, 그리고 새 포탈이 생긴 옛 5곳의 새 포탈 (물/용암 + 절벽 BFS)',()=>{let n=0;const bad=[];
  const pts=(id,only)=>{const {L,ok}=qWxReach(id),t=L.town,o=only?L.edges.filter(e=>only.includes(e.to)).map(e=>['포탈 '+e.side,{x:e.x+INW[e.side][0]*170,y:e.y+INW[e.side][1]*170}]):[['짝문',t.gate],['상점',t.shop],['창고',t.stash],
    ...L.edges.map(e=>['포탈 '+e.side,{x:e.x+INW[e.side][0]*170,y:e.y+INW[e.side][1]*170}]),...L.caves.map(c=>['동굴 '+c.cave.n,{x:c.x,y:c.y+40}]),['둥지',L.lair],...Object.keys(L.spots||{}).flatMap(s=>L.spots[s].map((p,i)=>[s+'#'+i,p]))];
    for(const [nm,p] of o){if(!p)continue;n++;if(!wxCanReach(ok,p.x,p.y)||blockedAt(p.x,p.y)&&false)bad.push(`${id} ${nm}`)}};
  for(const id of Q21_NEW)pts(id);for(const id in WX21_EDGE_ADD)pts(id,Object.values(WX21_EDGE_ADD[id]));
  // 포탈을 넘으면 맞은편 포탈 옆 빈 땅에 선다
  for(const id of Q21_NEW)for(const e of RCACHE[id].edges){const a=arrivalOf(e.side),L=RCACHE[e.to];n++;if(wxLqAt(L.lq,a.x,a.y)>.5)bad.push(`${id}→${e.to} 도착 자리가 물`)}
  qOk(!bad.length,'못 닿음: '+bad.slice(0,8).join(', '));return `${n}곳`});
for(const D of WX21_DUNGEONS.filter(d=>REGIONS[d.reg].hell))qT('v21 지역',`지옥 던전 ${D.n} (지옥 ${D.lvl+40}): 들어가기 · 보스 Lv · 준보스 · 처치 · 빛나는 문 → 동굴 앞`,()=>{qW3Prep('mage',Math.min(MAXLV,D.lvl+45));qWxTo(D.reg);
  const c=CAVES.find(c=>c.cave===D);qOk(c,'동굴 없음');qOk(!blockedAt(c.x,c.y+40),'동굴 앞이 물');qOk(qActAt(c.x,c.y+40)==='dungeon'&&actCave===c,`입구 act=${act}`);doAct();qOk(DG&&DG.d===D,'못 들어감');
  const bs=enemies.filter(e=>TYPES[e.k].boss),ms=enemies.filter(e=>TYPES[e.k].mini);qOk(bs.length===1&&bs[0].k===D.boss,`보스 ${bs.map(e=>e.k)}`);qOk(ms.length===2&&D.minis.every(k=>ms.some(e=>e.k===k)),`준보스 ${ms.map(e=>e.k)}`);
  qOk(bs[0].lvl===D.lvl+40+2,`보스 Lv${bs[0].lvl}`);qOk(enemies.filter(e=>!TYPES[e.k].boss&&!TYPES[e.k].mini).every(e=>D.mobs.includes(e.k)&&e.lvl>=D.lvl+40-1),'졸개');
  P.invT=1e9;qStep(20,{renderEvery:10});const e=DG.boss,n0=DG.portals.length;loot=[];hurtE(e,e.hp+10,{el:'arcane'});qOk(e.dead&&DG.bossDead,'보스가 안 쓰러짐');qOk(DG.portals.length===n0+1,'빛나는 문');
  const ex=DG.portals[DG.portals.length-1];qOk(qActAt(ex.x,ex.y)==='exit','빛나는 문 act');doAct();qOk(!DG&&REG.id===D.reg&&Math.hypot(P.x-c.x,P.y-c.y)<200,`나온 자리 ${REG.id}`);loadRegion('home');return `${TYPES[D.boss].n} Lv${bs[0].lvl}`});
qT('v21 지역','봉인: 보통 · 악몽은 새 지옥 4곳(포탈 · 짝문) 못 감 · 지옥도 재의 열쇠 전엔 닫힘 · 열쇠 뒤 바다 · 첨봉은 열림, 뿌리 · 성역은 왕도 길이 열려야 · 짝문 창 「봉인됨」 · 같이 하기 요청 · 지옥이 아니면 심연의 균열로',()=>{qW3Prep();const out=[];
  const edgeTry=(from,to)=>{loadRegion(from);const e=qW3Edge(from,to);qOk(e,`${from}→${to} 포탈 없음`);const m=qMsgs(()=>useEdge(e));return{m,ok:REG.id===to}};
  qW3Gate(false,false,()=>{for(const df of [0,1]){P.diff=df;for(const id of Q21_HELL){qOk(w3BlockReg(id).includes('지옥 난이도에서만'),`${id} ${DIFF[df].n}`);loadRegion('home');P.towns.push(RCACHE[id].town.id);qOk(travelTown(RCACHE[id].town)===true&&REG.id==='home',`${id} 짝문으로 넘어감`)}
      const r=edgeTry('plateau','starsea');qOk(!r.ok&&r.m.some(t=>t.includes('지옥 난이도')),`포탈 ${r.m}`)}out.push('보통·악몽 닫힘');
    P.diff=2;for(const id of Q21_HELL)qOk(w3BlockReg(id).includes('재의 열쇠'),`${id} 열쇠 없음`);out.push('열쇠 없음 닫힘')});
  qW3Gate(true,false,()=>{P.diff=2;for(const id of ['starsea','thunder']){const r=edgeTry('plateau',id);qOk(r.ok,`고원→${id} 막힘 ${r.m}`)}
    for(const id of ['roots','eclipse']){qOk(w3BlockReg(id).includes('재의 장막'),`${id} 왕도 길`);loadRegion('plateau');qOk(travelTown(RCACHE[id].town)===true&&REG.id==='plateau',`${id} 짝문으로 넘어감`)}
    loadRegion('plateau');actTown=TOWNS[0];const h=gateHtml();for(const id of ['roots','eclipse'])qOk(!new RegExp(`data-travel="${RCACHE[id].town.id}"`).test(h),`${id} 짝문 창 열림`);qOk((h.match(/봉인됨/g)||[]).length>=2,'봉인됨 표시 (뿌리 · 성역)');qOk(new RegExp(`data-travel="${RCACHE.starsea.town.id}"`).test(h),'열린 별이 언 바다 짝문이 막힘');
    try{const {sent}=qPty(2,{host:true});netOnMsg({t:'req',from:'qa_peer',a:'reg',id:'roots',x:200,y:3000});qOk(REG.id==='plateau','요청으로 뿌리에 넘어감');qOk(sent.some(m=>m.t==='j3x'&&m.k==='w3m'),'참가자에게 이유를 안 보냄')}finally{qPtyOff()}
    out.push('바다·첨봉 열림 · 뿌리·성역 닫힘')});
  qW3Gate(true,true,()=>{P.diff=2;let r=edgeTry('capital','roots');qOk(r.ok,`왕도→뿌리 ${r.m}`);r=edgeTry('roots','eclipse');qOk(r.ok,`뿌리→성역 ${r.m}`);loadRegion('home');qOk(travelTown(RCACHE.eclipse.town)===true&&REG.id==='eclipse','짝문 → 성역');out.push('왕도 길 뒤 뿌리·성역 열림');
    P.diff=0;qStep(20,{render:false});qOk(REG.id==='abyss','보통인데 성역에 남음');out.push('보통 → 심연의 균열')});
  loadRegion('home');return out.join(' · ')});
qT('v21 지역','같이 하기: 새 지역 번호(regArea · regOf) · 방장이 참가자 요청으로 새 지역에 넘어가며 reg를 보냄 · 참가자는 방장의 reg로 따라감(지옥 지역 포함) · 던전 구역 번호',()=>{const out=[];
  for(const id of Q21_NEW){qWxTo(id);const a=regArea();qOk(a===-(10+REG_IDS.indexOf(id))&&regOf(a)===id,`${id} 번호 ${a}`);DG={ci:0};const da=netArea();DG=null;qOk(da===100+REG_IDS.indexOf(id)*4,`${id} 던전 구역 ${da}`)}
  try{qPrep('mage',{lvl:40});const {sent}=qPty(2,{host:true});netOnMsg({t:'req',from:'qa_peer',a:'reg',id:'mistlake',x:5600,y:3000});qOk(REG.id==='mistlake','방장이 안 넘어감');
    qOk(sent.some(m=>m.t==='reg'&&m.id==='mistlake'),'reg를 안 보냄');out.push('방장 → 은안개 호수')}finally{qPtyOff()}
  try{qW3Prep('mage',130);qPty(2);NET.guest=true;NET.hostId='qa_peer';const L=RCACHE.eclipse,t=L.town;netOnMsg({t:'reg',from:'qa_peer',id:'eclipse',x:t.gate.x+40,y:t.gate.y+40});
    qOk(REG.id==='eclipse'&&!blockedAt(P.x,P.y),`참가자 ${REG.id}`);qStep(10,{renderEvery:5});out.push('참가자 → 빛이 꺼진 성역')}finally{qPtyOff()}
  loadRegion('home');return out.join(' · ')});
qT('v21 지역','저장: 새 지역에서 저장 → 그 자리 · 지역 던전 안 → 동굴 앞 · 지역을 모르는 빌드(v20)처럼 읽으면 아르세이아 남부의 안전한 자리 · 옛 저장(새 칸 없음)도 됨',()=>{const out=[];
  for(const id of Q21_NEW){q21Prep(id);qWxTo(id);const T=TOWNS[0];{const p=qFreeAt(T.x+60,T.y+SAFE+60,0,0)||{x:T.gate.x+40,y:T.gate.y+40};P.x=p.x;P.y=p.y}const x=P.x,y=P.y;const d=JSON.parse(JSON.stringify(saveData()));qOk(d.reg===id,`저장 지역 ${d.reg}`);
    qPrep('priest');qOk(load(d,QA_SLOT),'load 실패');qOk(REG.id===id&&Math.hypot(P.x-x,P.y-y)<2,`${id} 불러온 자리 ${REG.id}`);qStep(3,{render:false});
    // v20은 이 지역을 모른다 → REGIONS[d.reg]가 없을 때의 길(b5 load)과 같다: 아르세이아 남부, 같은 x·y. 물 · 건물 · 절벽이면 옮겨짐
    const d0=Object.assign({},d,{reg:'v21_'+id,towns:d.towns.filter(t=>t!==T.id),home:'brenhill'});qOk(load(d0,QA_SLOT),'v20식 load 실패');qOk(REG.id==='home','아르세이아 남부가 아님');qStep(3,{render:false});
    qOk(!blockedAt(P.x,P.y)&&!wxStuck(P.x,P.y)&&!terrWall(P.x,P.y),`${id} → 남부 ${Math.round(P.x)},${Math.round(P.y)} 갇힘`);out.push(id)}
  {const D=WX21_DUNGEONS.find(d=>d.reg==='scorch');q21Prep('scorch');qWxTo('scorch');const c=CAVES.find(c=>c.cave===D);P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.d===D,'못 들어감');
    const d=JSON.parse(JSON.stringify(saveData()));leaveDungeon();qPrep('mage');qOk(load(d,QA_SLOT)&&REG.id==='scorch'&&!DG&&Math.hypot(P.x-c.x,P.y-c.y)<100,`던전 저장 → ${REG.id}`);out.push('던전 안 저장')}
  {qPrep('mage',{lvl:30});const d=JSON.parse(JSON.stringify(saveData()));for(const k of Object.keys(d))if(!['v','slot','towns','home','cls','lvl','xp','gold','gear','bag','pot','bar','sk','sp','st','ap','diff','x','y','reg','hp','mp','uid','q','skOld'].includes(k))delete d[k];
    for(const sl of ['hat','ring2'])if(d.gear)delete d.gear[sl];d.reg='forest';const L=RCACHE.forest;d.x=L.town.x;d.y=L.town.y+150;qOk(load(d,QA_SLOT),'옛 저장 load 실패');qOk(REG.id==='forest','옛 저장 지역');qStep(5,{render:false});out.push('옛 저장')}
  loadRegion('home');return out.join(' · ')});
qT('v21 지역','새 포탈이 생긴 옛 5곳(숲 · 평원 · 정글 · 고원 · 왕도): 아무 옛 자리로 불러와도 물 · 용암 · 건물 · 절벽 밖 (wxGateDrop · terrFix)',()=>{const out=[];
  for(const id of Object.keys(WX21_EDGE_ADD)){const hell=REGIONS[id].hell;hell?qW3Prep('mage',110):qPrep('mage',{lvl:40});qWxTo(id);const L=RCACHE[id],base=JSON.parse(JSON.stringify(saveData())),s=mulberry(77+id.length);let n=0,wet=0;
    for(let i=0;i<24;i++){let x=200+s()*5600,y=200+s()*5600;if(i<8){for(let k=0;k<L.lq.length;k+=37)if(L.lq[(k+i*977)%L.lq.length]>.9){const j=(k+i*977)%L.lq.length;x=(j%LQN)*LQS;y=((j/LQN)|0)*LQS;break}}
      if(wxLqAt(L.lq,x,y)>.5)wet++;const d=Object.assign({},base,{x,y});qOk(load(d,QA_SLOT),'load 실패');qStep(2,{render:false});n++;
      qOk(REG.id===id&&!blockedAt(P.x,P.y)&&!wxStuck(P.x,P.y)&&!terrWall(P.x,P.y),`${id} (${Math.round(x)},${Math.round(y)}) → (${Math.round(P.x)},${Math.round(P.y)}) 갇힘`)}
    out.push(`${id} ${n}(물 ${wet})`)}
  loadRegion('home');return out.join(' · ')});
qT('v21 지역','새 몬스터 48종: 들판 한 대 = 같은 레벨 기본 생명력의 15~30% (지옥 지역은 지옥 레벨 · 실제 dgMob 피해) · 준보스 28 · 보스 34 이하 · 경험치 흐름 · 맞히면 생명력이 줆 · NaN 없음',()=>{const out=[];let mx=0;
  for(const id of Q21_NEW){const D=REGIONS[id];for(const k of D.mobs){const t=TYPES[k],L=t.min+(D.hell?40:0);P.diff=D.hell?2:0;const e=dgMob(k,0,0,L);enemies.pop();const pct=e.dmg/q21HP(L);mx=Math.max(mx,pct);
      qOk(pct>=.14&&pct<=.30,`${k} 한 대 ${Math.round(pct*100)}% (Lv${L})`);qOk(t.xp>=t.min*1.4&&t.xp<=t.min*3.6,`${k} 경험치 ${t.xp}`)}}
  for(const k in WX21_TYPES){const t=TYPES[k];if(t.mini)qOk(t.dmg<=34,`${k} dmg ${t.dmg}`);if(t.boss)qOk(t.dmg<=34,`${k} dmg ${t.dmg}`)}
  qPrep('mage',{lvl:100});P.invT=1e9;for(const k in WX21_TYPES){const e=dgMob(k,P.x+200,P.y,100);const h0=e.hp;hurtE(e,50,{el:'fire'});qOk(e.hp<h0&&qNum(e.hp),`${k} 안 맞음`)}
  qStep(30,{renderEvery:6,each:()=>{P.hp=maxHp();P.invT=1e9}});qOk(!qBad().length,'NaN');qClear();return `들판 최대 ${Math.round(mx*1000)/10}%`});
qT('v21 지역','포탈 글자 · 큰 지도: 새 지역으로 가는 포탈 끝에 대표 속성(「· 냉기」) · 여러 번 고쳐 써도 한 번만 · 세계 지도 · 지역 지도 그리기 오류 없음',()=>{qPrep('mage',{lvl:40});const out=[];
  for(const id in WX21_EDGE_ADD)for(const to of Object.values(WX21_EDGE_ADD[id])){const e=qW3Edge(id,to),x=wx21ElTag(to);qOk(x&&e.label.endsWith(x.t),`${id}→${to} 「${e.label}」`)}
  qOk(qW3Edge('forest','mistlake').label.endsWith(' · 냉기')&&qW3Edge('roots','eclipse').label.endsWith(' · 어둠'),'냉기 · 어둠 글자');
  for(let i=0;i<3;i++)w3Labels();for(const [a,b] of [['plateau','starsea'],['capital','roots'],['forest','mistlake']]){const e=qW3Edge(a,b),t=wx21ElTag(b).t;qOk(e.label.split(t).length===2,`글자가 겹침 ${e.label}`)}
  for(const id of ['home','mistlake','roots']){qWxTo(id);for(const t of ['world','reg']){WMAP.tab=t;wmapOpen();wmapDraw();wmapClose()}}out.push(qW3Edge('plateau','starsea').label);
  loadRegion('home');return out.join(' · ')});
/* ===== v21 GEAR: 반지 두 개 · 모자 · 장비 툴팁 · 몬스터 속성 ===== */
const qG21Fix=()=>{const W=(id,slot,rar,name,il,stats,x)=>QA_ITEM(id,slot,rar,name,il,stats,Object.assign({cls:'warrior'},x||{}));
  return{
    v17:{v:5,slot:0,cls:'priest',lvl:44,xp:100,gold:4321,towns:['brenhill','willowen'],home:'brenhill',x:1500,y:4810,reg:'home',hp:300,mp:200,pot:{hp:5,mp:5},
      gear:{staff:QA_ITEM(801,'staff',2,'축복받은 룬 지팡이',40,{int:60,crit:4},{cls:'priest'}),robe:null,ring:QA_ITEM(802,'ring',1,'별빛의 은 반지',38,{mp:120},{cls:'priest'}),amulet:null},bag:[QA_ITEM(803,'ring',0,'구리 반지',30,{mp:60},{cls:'priest'})],
      sk:{holyspark:5},sp:3,st:{int:50,vit:40,spi:30},ap:0,diff:0,bar:['holyspark'].concat(Array(20).fill(null)),q:{i:4,st:1,c:{}},uid:900},
    v18:{v:5,slot:0,cls:'warrior',lvl:55,xp:100,gold:777,towns:['brenhill'],home:'brenhill',x:1500,y:4810,reg:'home',hp:400,mp:100,pot:{hp:3,mp:3},
      gear:{staff:W(811,'staff',1,'철 장검',50,{atk:70},{wt:'sword'}),off:W(812,'off',0,'철 원방패',50,{blk:20,dr:5},{wt:'shield'}),robe:W(813,'robe',2,'수호자의 판금 흉갑',50,{hp:300,dr:8},{wt:'plate'}),ring:W(814,'ring',3,'수비대 인장',50,{mp:100,tr_2:1},{set:'bulwark'}),amulet:null},
      bag:[W(815,'amulet',1,'호박 목걸이',45,{regen:4})],sk:{},sp:10,st:{str:60,dex:20,int:0,vit:40,spi:20},ap:0,diff:1,bar:Array(21).fill(null),q:{i:4,st:1,c:{}},uid:900},
    v20:{v:5,slot:0,cls:'archer',lvl:120,xp:100,gold:99999,towns:['brenhill'],home:'brenhill',x:1500,y:4810,reg:'home',hp:900,mp:300,pot:{hp:3,mp:3},job2:'ranger',job3:'shadowhunter',w3:{lord:1},
      gear:{staff:W(821,'staff',4,'바람길 장궁',110,{atk:200,tr_0:2,ias:10,acc:20},{wt:'bow',cls:'archer'}),off:W(822,'off',1,'룬 화살통',110,{acc:90},{wt:'quiver',cls:'archer'}),robe:null,ring:null,amulet:W(823,'amulet',5,'그림자 없는 송곳니',110,{dex:35,ms:12},{cls:'archer'})},
      bag:[],sk:{},sp:0,st:{str:20,dex:200,int:0,vit:80,spi:40},ap:0,diff:2,bar:Array(21).fill(null),q:{i:4,st:1,c:{}},uid:900}}};
const qG21Sum=()=>JSON.stringify([Object.keys(P.gear).sort().map(k=>k+':'+(P.gear[k]?P.gear[k].name:'-')),P.bag.map(x=>x.name).sort()]);
qT('장비 v21','옛 저장(v1·v2·v4·v5 · v17·v18·v20 모양)을 불러오면 모자·반지 2 칸은 비어 있고 다른 장비·가방은 그대로 · 다시 저장 → 불러오기 같음',()=>{const out=[];
  const F=Object.assign({},{v1old:QA_FIX.v1old,v2:QA_FIX.v2,v4:QA_FIX.v4,v5:QA_FIX.v5},qG21Fix());
  for(const [n,f] of Object.entries(F)){qResetStore();const d=JSON.parse(JSON.stringify(f));qPut('arseia-char-0',d);const r=readSlot(0);qOk(r,n+' readSlot');qOk(load(r,0),n+' load');
    qOk('hat' in P.gear&&P.gear.hat===null&&'ring2' in P.gear&&P.gear.ring2===null,`${n}: 새 칸 기본값 ${JSON.stringify([P.gear.hat,P.gear.ring2])}`);
    for(const k in d.gear){const a=d.gear[k];if(a&&SLOT[a.slot]&&a.stats)qOk(P.gear[k]&&P.gear[k].name===a.name,`${n}: ${k} 잃음`)}
    qOk(P.bag.length===Math.min((d.bag||[]).length,BAG_MAX),`${n}: 가방 ${P.bag.length}`);
    const s1=JSON.stringify(saveData()),sum=qG21Sum();qPut('arseia-char-1',s1);qOk(load(readSlot(1),1),n+' 다시 불러오기');qOk(qG21Sum()===sum,`${n}: 왕복 장비 다름`);
    const g1=JSON.parse(s1).gear;qOk('hat' in g1&&'ring2' in g1,`${n}: 저장에 새 칸 없음`);out.push(n)}
  qResetStore();return out.join(' · ')});
qT('장비 v21','저장: 모자·반지 2 왕복 · 다른 칸에 잘못 들어간 장비는 가방으로(잃지 않음) · 모르는 칸(나중 판)은 그대로 다시 저장',()=>{qPrep('mage',{lvl:40});
  P.gear.hat=makeHat(40,true,'mage');P.gear.ring=makeBaseRing21(40,'은 반지',{mp:90});P.gear.ring2=makeBaseRing21(40,'루비 반지',{mp:70,crit:4});
  const hn=P.gear.hat.name,s=JSON.stringify(saveData());qPut(SLOTKEY(QA_SLOT),s);qOk(load(readSlot(QA_SLOT),QA_SLOT),'load');
  qOk(P.gear.hat&&P.gear.hat.name===hn&&P.gear.ring2&&P.gear.ring2.name==='루비 반지'&&P.gear.ring.name==='은 반지','왕복');
  const d=JSON.parse(s);d.gear.boots={id:999,slot:'boots',rar:1,name:'나중 판 장화',il:40,stats:{ms:5}};const wrong=d.gear.ring2;d.gear.ring2=JSON.parse(JSON.stringify(d.gear.hat));d.gear.hat=wrong;
  const nb=d.bag.length;qPut(SLOTKEY(QA_SLOT),d);qOk(load(readSlot(QA_SLOT),QA_SLOT),'load 2');
  qOk(!P.gear.hat&&!P.gear.ring2,'잘못 들어간 장비가 그대로 낌');qOk(P.bag.length===nb+2&&P.bag.some(x=>x.name===hn)&&P.bag.some(x=>x.name==='루비 반지'),'가방으로 옮기지 않음');
  const d2=saveData();qOk(d2.gear.boots&&d2.gear.boots.name==='나중 판 장화','모르는 칸을 버림');qOk(!('boots' in P.gear),'모르는 칸이 능력치에 끼어듦');
  return '왕복 · 2개 가방으로 · boots 보존'});
function makeBaseRing21(il,name,stats){return{id:uid++,slot:'ring',rar:1,name,il,stats:Object.assign({},stats),cls:P.cls}}
qT('장비 v21','반지 두 개가 모두 능력치에 들어감 · 모자 능력치도 · 같은 세트 반지 둘은 한 조각 · 착용: 빈 칸 먼저 → 둘 다 차면 약한 쪽 · 반지 1/2 단추로 고르기',()=>{qPrep('mage',{lvl:40});
  for(const k in P.gear)P.gear[k]=null;const mp0=stat('mp'),hp0=maxHp();
  const a=makeBaseRing21(40,'은 반지',{mp:100}),b=makeBaseRing21(40,'루비 반지',{mp:40}),c=makeBaseRing21(40,'달빛 반지',{mp:70});P.bag=[a,b,c];
  qOk(gearEquip(a)==='ring'&&gearEquip(b)==='ring2','빈 칸 먼저');qOk(stat('mp')===mp0+140,`두 반지 합 ${stat('mp')}`);
  qOk(gearDest(c)==='ring2'&&gearCur(c)===b,'약한 쪽과 비교');gearEquip(c);qOk(P.gear.ring2===c&&P.bag.includes(b),'약한 반지와 바뀜');qOk(stat('mp')===mp0+170,'바꾼 뒤 합');
  const ht={id:uid++,slot:'hat',rar:1,name:'펠트 뾰족 모자',il:40,stats:{hp:200,crit:3},cls:'mage'};P.bag.push(ht);gearEquip(ht);qOk(P.gear.hat===ht&&maxHp()>hp0+150&&stat('crit')>=3,`모자 능력치 hp ${maxHp()-hp0}`);
  const s1={id:uid++,slot:'ring',rar:3,name:'발케르의 불씨 반지',il:40,stats:{mp:50,tr_0:1},cls:'mage',set:'valker'},s2=Object.assign({},s1,{id:uid++});P.gear.ring=s1;P.gear.ring2=s2;
  qOk(setCount('valker')===1,`세트 반지 둘 = ${setCount('valker')}조각`);P.gear.staff={id:uid++,slot:'staff',rar:3,name:'발케르의 횃불',il:40,stats:{int:40,tr_0:1},cls:'mage',set:'valker'};qOk(setCount('valker')===2,'세트 둘');
  // 창에서: 반지가 둘 다 차 있으면 「반지 1에」「반지 2에」 단추
  P.bag=[b];openPanel('char');qOk(pbody.querySelector(`button[data-equip="${b.id}"][data-eqsl="ring"]`)&&pbody.querySelector(`button[data-equip="${b.id}"][data-eqsl="ring2"]`),'반지 단추 둘');
  qClick(`#pbody button[data-equip="${b.id}"][data-eqsl="ring"]`);qOk(P.gear.ring===b&&P.bag.includes(s1)&&P.gear.ring2===s2,'반지 1 자리에 낌');
  const g=pbody.querySelectorAll('.geq [data-geq]');qOk(g.length===gearSlots21().length&&pbody.querySelector('.geq [data-geq="hat"]')&&pbody.querySelector('.geq [data-geq="ring2"]'),'착용 칸 격자');closePanel();
  return `반지 합 · 모자 · 세트 1조각 · 단추`});
qT('장비 v21','모자 굴림: 네 직업 모두 떨어짐(약 1/5~1/6) · 그 직업 이름 · 착용 가능 · 아이콘 설계 · 유니크 모자 4개(직업마다 1 · +모든 마법/계열 없음) · 방어구상에서 팜 · 전사·궁수 모자 그림이 머리에 보임',()=>{const out=[];const ks=new Set(allIconKeys());
  for(const cls of ['mage','priest','warrior','archer']){qPrep(cls,{lvl:60});QA.reseed(2101);let n=0;const bad=[];
    for(let i=0;i<600;i++){const it=makeItem(10+i%120,i%3===0);if(it.slot!=='hat')continue;n++;if(!canWear(it))bad.push(it.name+' 못 낌');if(!(it.stats.hp>0))bad.push(it.name+' 생명력 없음');
      if(it.rar<4&&!HAT_BASE[cls].some(b=>it.name.endsWith(b)))bad.push(it.name+' 이름');if(!ks.has(itemIconKey(it)))bad.push(it.name+' 아이콘 '+itemIconKey(it));if(statLine(it).includes('undefined'))bad.push(it.name+' 옵션')}
    qOk(!bad.length,`${cls}: ${bad.slice(0,4).join(', ')}`);qOk(n>60&&n<160,`${cls}: 모자 ${n}/600`);
    const u=HAT_UNIQ.filter(x=>x.cls===cls);qOk(u.length===1&&!('all' in u[0].st)&&!Object.keys(u[0].st).some(k=>k.startsWith('tr_')),`${cls}: 유니크 모자`);
    QA.reseed(7);let uq=null;for(let i=0;i<4000&&!uq;i++){const it=makeHat(60,true,cls);if(it.rar===4)uq=it}qOk(uq&&uq.name===u[0].n&&itemScore(uq)>0&&ks.has(itemIconKey(uq)),`${cls}: 유니크 모자 안 나옴`);
    const t=ALLTOWNS[0];let found=false;for(let k=0;k<12&&!found;k++){const st=shopStock(t,'armor');if(st.items.some(x=>x.slot==='hat'))found=true;else st.lvl=-1}qOk(found,`${cls}: 방어구상에 모자 없음`);
    out.push(`${cls} ${n}`)}
  for(const cls of ['warrior','archer','mage','priest']){const cv=document.createElement('canvas');cv.width=120;cv.height=150;const g=cv.getContext('2d');
    const pix=gear=>{g.clearRect(0,0,120,150);if(PHYS_CLS[cls])drawHeroClass(g,cls,gear,'idle',60,130,1,.37,2);else drawFigure(g,{cls,gear,face:heroFace(2),moving:false,walk:0},60,130,1,{t:.37});return g.getImageData(20,0,80,80).data.join(',')};
    const base={staff:null,robe:null},hatG=Object.assign({},base,{hat:{id:1,slot:'hat',rar:2,name:'룬 두건',il:44,stats:{hp:10},cls}});
    qOk(pix(base)!==pix(hatG),`${cls}: 모자를 써도 머리 그림이 같음`)}
  return out.join(' · ')});
qT('장비 v21','툴팁: 가방 칸 · 착용 칸 · 가방 목록 · 창고 · 상점 모두 마우스를 올리면 뜸 · 이름·옵션·비교 · 화면 밖으로 안 나감 · 휴대폰(누르기·길게 누르기)',()=>{qPrep('mage',{lvl:40});
  P.bag=[];for(let i=0;i<12;i++)P.bag.push(makeItem(30+i,true,'mage'));P.gear.staff=makeItem(30,true,'mage','boss');P.gear.hat=makeHat(30,false,'mage');
  const ov=(el,type)=>el.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:type||'mouse'}));const tip=()=>document.getElementById('itip');
  const onScr=()=>{const r=tip().getBoundingClientRect();return r.left>=7&&r.top>=7&&r.right<=innerWidth-7&&r.bottom<=innerHeight-7};
  const chk=(sel,what,needName)=>{const el=pbody.querySelector(sel);qOk(el,what+' 칸 없음');tipHide();ov(el);const t=tip();qOk(t&&!t.hidden,what+': 툴팁 안 뜸');
    qOk(!needName||t.innerHTML.includes(needName),what+': 이름 없음');qOk(onScr(),what+': 화면 밖 '+JSON.stringify(t.getBoundingClientRect()));return t};
  openPanel('char');let t=chk(`[data-bagcell="${P.bag[3].id}"]`,'가방 칸',P.bag[3].name);qOk(t.innerHTML.includes('착용 중인')||t.innerHTML.includes('비어 있습니다'),'비교 없음');
  t=chk('.geq [data-geq="staff"]','착용 칸',P.gear.staff.name);qOk(t.innerHTML.includes('착용 중')&&!t.innerHTML.includes('착용 중인'),'착용 칸 표시');
  chk('.geq [data-geq="hat"]','모자 칸',P.gear.hat.name);chk(`.item[data-iid="${P.bag[5].id}"] .iic[data-tip]`,'가방 목록',P.bag[5].name);
  qOk(!pbody.querySelector('.geq [data-geq="ring2"]').dataset.tip,'빈 칸에 툴팁');
  // 마우스가 나가면 닫힘
  const el=pbody.querySelector(`[data-bagcell="${P.bag[3].id}"]`);ov(el);el.dispatchEvent(new PointerEvent('pointerout',{bubbles:true,pointerType:'mouse',relatedTarget:document.body}));qOk(tip().hidden,'안 닫힘');
  // 휴대폰: 누르면 뜨고, 가방 칸은 한 번 더 누르면 닫히고 원래대로 목록으로
  tipHide();el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));el.click();qOk(!tip().hidden&&tip().innerHTML.includes(P.bag[3].name),'누르기: 안 뜸');
  el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));el.click();qOk(tip().hidden,'두 번째 누르기: 안 닫힘');
  TIP.pt='mouse';closePanel();qOk(tip().hidden,'창을 닫아도 남음');
  QA.store.setItem('arseia-stash',JSON.stringify({v:1,items:[]}));const sti=makeItem(20,true,'mage');stashWrite([sti]);openPanel('stash');chk('.item .iic[data-tip]','창고',sti.name);closePanel();
  const t0=TOWNS[0];qActAt(t0.shop.x,t0.shop.y);doAct();const si=shopStock(actTown,actShop).items[0];qOk(si,'상점 물건 없음');chk(`.item[data-iid="${si.id}"] .iic[data-tip]`,'상점',si.name);closePanel();
  // 390 폭 휴대폰: 어느 자리에서든 화면 안
  const bad=[];for(let i=0;i<200;i++){const x=(i*37)%380,y=(i*53)%830,r={left:x,right:x+40,top:y,bottom:y+40},w=60+(i*29)%240,h=80+(i*41)%300,p=tipPlace(r,w,h,390,844);
    if(p.x<8||p.y<8||p.x+w>382||p.y+h>836)bad.push(JSON.stringify([r.left,r.top,w,h,p]))}qOk(!bad.length,'390 폭 밖: '+bad.slice(0,2).join(' '));
  qOk(itemTip(P.bag[0]).includes(String(statLine(P.bag[0])).split(' · ')[0]),'statLine 줄이 없음');ITEMTIP_LINES.push(it=>it===P.bag[0]?'<div class="qa21">QA 줄</div>':'');qOk(itemTip(P.bag[0]).includes('QA 줄'),'덧붙인 줄');ITEMTIP_LINES.pop();
  return '가방 칸 · 착용 칸 · 목록 · 창고 · 상점 · 누르기'});
qT('몬스터 속성 v21','배율: 정반대 ×1.2 · 같은 속성 ×0.8 · 나머지 ×1 (불↔냉기 · 벼락↔대지 · 신성↔어둠, 바람=벼락 · 빛=신성 · 봉인·변성·물리 없음) · 언데드+신성은 두 배만',()=>{
  const W={fire:{ice:1.2,fire:.8},ice:{fire:1.2,ice:.8},storm:{earth:1.2,storm:.8,wind:.8},earth:{storm:1.2,wind:1.2,earth:.8},dark:{holy:1.2,light:1.2}},bad=[];
  for(const mon of ['fire','ice','storm','earth','dark',null])for(const atk of ['fire','ice','storm','wind','earth','holy','light','arcane','life','phys']){const want=mon&&W[mon][atk]||1,got=elemMul(atk,mon,false);if(Math.abs(got-want)>1e-9)bad.push(`${atk}→${mon}: ${got}≠${want}`)}
  qOk(!bad.length,bad.slice(0,5).join(', '));qOk(elemMul('holy','dark',true)===1&&elemMul('light','dark',true)===1&&elemMul('ice','fire',true)===1.2,'언데드 규칙');
  // 실제 피해 (같은 난수로 견줌)
  qPrep('mage',{lvl:40});const e=qDummy(P.x+80,P.y),T0=TYPES.qa_dummy,el0=T0.el,hit=el=>{const t0=e.taken;QA.reseed(31);hurtE(e,1000,{el,proc:1,n:'점검'});return e.taken-t0};
  const r=[];try{for(const [mel,atk,want] of [['fire','ice',1.2],['fire','fire',.8],['fire','storm',1],['earth','wind',1.2],['storm','earth',1.2],['ice','fire',1.2],['dark','holy',1.2],['dark','light',1.2],['ice','arcane',1],['fire','phys',1]]){
    T0.el=null;const a=hit(atk);T0.el=mel;const b=hit(atk);qOk(Math.abs(b/a-want)<.002,`${atk}→${mel}: ×${qR(b/a)} (원함 ${want})`);r.push(`${atk}→${mel} ×${qR(b/a)}`)}}finally{T0.el=el0}
  qClear();return r.slice(0,4).join(' · ')});
qT('몬스터 속성 v21','표: WX21_EL에 있는 몬스터만 속성 · 아르세이아 남부·Lv24 미만·속성 없는 지역 몬스터는 없음 · 어둠 몬스터 신성 두 배 겹치지 않음 · 대상 칸 점·글 · 머리 위 점 · 도감',()=>{
  const has=Object.keys(TYPES).filter(k=>monElK(k));qOk(typeof WX21_EL==='object','WX21_EL 없음');qOk(has.every(k=>WX21_EL[k]),'표에 없는 몬스터에 속성: '+has.filter(k=>!WX21_EL[k]).slice(0,4));
  qOk(has.length>=30,`속성 몬스터 ${has.length}`);const low=has.filter(k=>TYPES[k].min&&TYPES[k].min<24||FIELD_TYPES.includes(k)&&!TYPES[k].reg);qOk(!low.length,'낮은 레벨 몬스터에 속성: '+low.join(','));
  for(const k of ['slime','wolf','ashsoldier','apostle','p_wolf','j_panther','b_arsil','b_morgath'])qOk(!monElK(k),k+'에 속성');
  for(const [k,el] of [['l_imp','fire'],['i_elem','ice'],['p_storm','storm'],['c_dust','earth'],['v_maw','dark']])qOk(monElK(k)===el,`${k}=${monElK(k)}`);
  qPrep('mage',{lvl:50});const e=dgMob('l_imp',P.x+60,P.y,50);e.big=1;e.aggroed=true;enemies.push(e);updateHud();const box=document.getElementById('target');
  qOk(box.classList.contains('el21')&&document.getElementById('tsub').textContent.includes('불 속성')&&document.getElementById('tsub').textContent.includes('냉기 피해 +20%'),'대상 칸 속성 글: '+document.getElementById('tsub').textContent);
  const n0=EL21.cnt.up;render();qOk(EL21.f===1,'배율이 남음');const m=monInfo('l_imp');qOk(m.traits.some(x=>x.includes('불 속성')),'도감에 속성 없음');qOk(!monInfo('slime').traits.some(x=>x.includes('속성 ·')),'슬라임 도감');
  hover=null;qClear();return `${has.length}종 · 대상 칸 · 도감`});
qT('몬스터 속성 v21','연계(combo20)와 겹치지 않음: 얼어 있는 벼락 몬스터를 대지로 → 그 한 대만 ×1.2, 깨뜨리기 추가 피해는 속성 전 피해의 40%',()=>{qPrep('mage',{lvl:40});const e=qDummy(P.x+80,P.y),T0=TYPES.qa_dummy,el0=T0.el;
  const run=mel=>{T0.el=mel;e.freezeT=2;const t0=e.taken,n0=CB.n.shatter;QA.reseed(41);hurtE(e,1000,{el:'earth',cls:P.cls,n:'점검'});qOk(CB.n.shatter===n0+1,'깨뜨리기 안 됨');return e.taken-t0};
  let a,b;try{a=run(null);b=run('storm')}finally{T0.el=el0}const k=b/a;qOk(Math.abs(k-1.6/1.4)<.01,`합 비율 ×${qR(k)} (겹치면 ×1.2, 맞으면 ×${qR(1.6/1.4)})`);qClear();return `×${k.toFixed(3)}`});
qT('장비 v21','같이 하기: 모자 겉모습이 상태 코드(lk)에 실리고 동료 그림에 보임 · 예전 판 5칸 코드도 그대로 읽음',()=>{qPrep('warrior',{lvl:40});P.gear.hat=makeHat(50,true,'warrior');
  const lk=netLook(),o=netLookParse(lk);qOk(LK_SLOTS[LK_SLOTS.length-1]==='hat'&&lk.split('|').length===LK_SLOTS.length,'lk 칸');qOk(o.hat&&o.hat.il===P.gear.hat.il&&o.hat.rar===P.gear.hat.rar,'모자 읽기 '+JSON.stringify(o.hat));
  const old=lk.split('|').slice(0,5).join('|'),o2=netLookParse(old);qOk(!o2.hat&&o2.staff,'예전 코드');
  const L1=heroLook18({cls:'warrior',gear:o}),L0=heroLook18({cls:'warrior',gear:o2});qOk(L1.hrt>=1&&L1.key!==L0.key,'동료 모자 그림 키');
  const L2=heroLook({cls:'mage',gear:{hat:{il:60,rar:2,h:5}}});qOk(L2.hrt===7&&L2.htc===RAR[2].c,'마법사 모자');
  return `lk ${LK_SLOTS.length}칸 · 단계 ${L1.hrt}`});
/* ===== v21 GROW: 룬 각인 · 재의 결정 · 장비 재련 (rune21.js · forge21.js) ===== */
const qG21=(cls,lvl,slot)=>{qPrep(cls,{lvl:lvl||140,slot});P.rune=runeFresh();P.ash=0;runeBump();P.buffs={};return P};
const qG21Ring=st=>{P.gear.ring=QA_ITEM(uid++,'ring',0,'시험 반지',10,st);runeBump()};
qT('룬 각인 v21','각인 막대: 140 전에는 레벨 경험치 · 140부터 경험치가 각인 막대로 · 막대가 차면 1점 · 비용 0점 150만 · 100점 500만 · 300점부터 1200만 · 보너스(파티 등)는 덧셈 · HUD에 「각인」',()=>{
  qG21('mage',139);P.xp=0;gainXp(1000);qOk(P.xp>=1000&&runeSt().xp===0,'139레벨 경험치 '+P.xp);
  P.lvl=140;P.xp=0;gainXp(1000);qOk(P.lvl===140&&P.xp===0&&runeSt().xp>=1000,'140: 각인 '+runeSt().xp);
  qOk(runeNeed(0)===1500000&&runeNeed(100)===5000000&&runeNeed(300)===12000000&&runeNeed(900)===12000000,'비용 '+[runeNeed(0),runeNeed(100),runeNeed(300)]);
  P.rune.xp=0;const b0=runeXpBonus();runeXp(runeNeed(0)/(1+b0));qOk(P.rune.n===1&&runeLeft()===1,'1점 '+P.rune.n);
  PTY.xpK=1.1;const b1=runeXpBonus();PTY.xpK=1;qOk(Math.abs(b1-b0-.1)<1e-9,'파티 보너스 덧셈 '+qR(b1-b0));
  P.rune.xp=0;PTY.xpK=1.1;gainXp(1000);PTY.xpK=1;qOk(P.rune.xp===Math.round(1000*(1+b1)),'파티 1000 → '+P.rune.xp);
  updateHud();qOk($('#xptext').textContent.includes('각인')&&document.querySelector('#hud .xpbar').classList.contains('r21'),'HUD '+$('#xptext').textContent);
  P.lvl=100;updateHud();qOk(!document.querySelector('#hud .xpbar').classList.contains('r21')&&!$('#xptext').textContent.includes('각인'),'100레벨 HUD');
  return `1점 ${runeNeed(0).toLocaleString()} · 100점 ${runeNeed(100).toLocaleString()}`});
qT('룬 각인 v21','칸 상한(설계 표 그대로) · 남은 점수보다 많이 못 찍음 · 주 능력치는 끝없음 · 판 최대 점수와 새김 이정표',()=>{qG21('mage');P.rune.n=400;
  const caps={dmg:50,cdm:30,hp:50,dr:30,res:30,mp:30,cdr:30,mc:30,ms:20,gold:20,find:20};let sum=0;
  for(const k in caps){qOk(runeAdd(k,999)===caps[k],k+' 상한');qOk(runeAdd(k,1)===0,k+' 넘침');sum+=caps[k]}
  qOk(sum===340&&runeAdd('st',999)===60&&runeLeft()===0&&runeAdd('st',1)===0,'주 능력치 '+P.rune.a.st);
  qOk(runeBoardMax('pow')===Infinity&&runeBoardMax('grd')===110&&runeBoardMax('mana')===90&&runeBoardMax('path')===60,'판 최대');
  qOk(runeMiles('pow').length===4&&runeMiles('grd').length===2&&runeMiles('mana').length===1&&runeMiles('path').length===1,'이정표 '+['pow','grd','mana','path'].map(b=>runeMiles(b).length));
  for(const b in RUNE_SV)for(const L of RUNE_SV[b])qOk(L.length===3&&L.every(x=>x.n&&x.d&&x.fx),b+' 새김 셋');
  const v=runeV();qOk(qR(v.dmg)===.25&&v.cdm===30&&qR(v.hp)===.5&&qR(v.dr)===9&&v.res===30&&qR(v.mp)===.3&&qR(v.cdr)===9&&qR(v.mc)===9&&v.ms===10&&qR(v.gold)===.4&&qR(v.find)===.2,'최대 값 '+JSON.stringify(v));
  return '340점이면 상한 칸이 다 참 · 나머지 60점은 주 능력치'});
qT('룬 각인 v21','덧셈: 주 능력치(직업마다) · 생명력/마나 %(맨몸+장비의 %) · 활력을 올리면 바로 다시 셈 · 받는 피해·재사용·마나 소모·이동은 장비와 합쳐 기존 상한',()=>{
  for(const cls of ['mage','priest','warrior','archer']){qG21(cls);P.rune.n=10;const k=RUNE_MAIN[cls],s0=stat(k);runeAdd('st',10);qOk(stat(k)===s0+50,`${cls} ${k} ${s0}→${stat(k)}`)}
  qG21('mage');P.rune.n=400;const h0=maxHp(),m0=maxMp();runeAdd('hp',50);runeAdd('mp',30);qOk(Math.abs(maxHp()-h0*1.5)<=2,`생명력 ${h0}→${maxHp()}`);qOk(Math.abs(maxMp()-m0*1.3)<=2,`마나 ${m0}→${maxMp()}`);
  P.st.vit+=20;const C=CLASSES[P.cls],base=(40+P.lvl*12+P.st.vit*4)*C.hp;qOk(Math.abs(maxHp()-base*1.5)<=2,`활력 뒤 ${maxHp()} vs ${Math.round(base*1.5)}`);
  qG21Ring({dr:48,cdr:45,mcost:35,ms:35});runeAdd('dr',30);runeAdd('cdr',30);runeAdd('mc',30);runeAdd('ms',20);
  qOk(qR(stat('dr'))===57&&qR(stat('cdr'))===54&&qR(stat('mcost'))===44&&qR(stat('ms'))===45,'장비+각인 '+[stat('dr'),stat('cdr'),stat('mcost'),stat('ms')]);
  P.hp=maxHp();P.invT=0;P.shield=0;const hp=P.hp;hitPlayer(100,null);qOk(hp-P.hp===50,'받는 피해 상한 50% → '+(hp-P.hp));
  const id='firebolt';qOk(Math.abs(cdOf(id)-Math.max(.15,SPELLS[id].cd*.5))<1e-9,'재사용 상한 50%');qOk(spdMul()<=1.4+Math.min(.6,buffSum('spd'))+1e-9,'이동 상한 40');
  return `생명력 +50% · 마나 +30% · 받는 피해 57→50% 상한`});
qT('룬 각인 v21','치명 피해 +1%/점(1.75배에 덧셈) · 모든 피해 %는 강화와 같은 「피해 증가」 칸(상한 안) · 저항은 원소·마법 공격만 줄임',()=>{qG21('mage');P.rune.n=400;const e=qDummy(P.x+200,P.y);
  qG21Ring({crit:400});let t0=e.taken;hurtE(e,1000,null);qOk(e.taken-t0===1750,'치명 '+(e.taken-t0));runeAdd('cdm',30);t0=e.taken;hurtE(e,1000,null);qOk(e.taken-t0===2050,'치명 피해 +30% → '+(e.taken-t0));
  qG21Ring({crit:-400});const s={cls:P.cls,el:'arcane'};t0=e.taken;hurtE(e,1000,s);const a=e.taken-t0;runeAdd('dmg',50);t0=e.taken;hurtE(e,1000,s);const b=e.taken-t0;qOk(Math.abs(b/a-1.25)<.01,`모든 피해 +25%: ${a}→${b}`);
  P.buffs.qg={t:99,max:99,dmg:.7};t0=e.taken;hurtE(e,1000,s);const c=e.taken-t0;qOk(Math.abs(c/a-1.8/1.7)<.012,`강화 70% + 각인 25% → 상한 80%: ${a}→${c}`);delete P.buffs.qg;
  runeAdd('res',30);P.invT=0;P.shield=0;P.hp=maxHp();let h=P.hp;hitPlayer(100,null);const mag=h-P.hp;h=P.hp;const w=qDummy(P.x+50,P.y);hitPlayer(100,w);const mel=h-P.hp;
  qOk(mag===85&&mel===100,`저항 30: 마법 ${mag} · 근접 ${mel}`);const ek=typeof monElK==='function'?Object.keys(TYPES).find(k=>monElK(k)):null;const k0=w.k;if(ek)w.k=ek;else w.mel='fire';h=P.hp;try{hitPlayer(100,w)}finally{w.k=k0}qOk(h-P.hp===85,'원소 몬스터 '+(h-P.hp)+' '+ek);
  return `치명 ×2.05 · 피해 ×${qR(b/a)} · 저항 −15%`});
qT('룬 각인 v21','새김: 그 판 점수 50·100·150·200에서 셋 중 하나 · 고르면 지우개 전에는 안 바뀜 · 처치 마나 2% · 물약 +20% · 무너짐 +10% · 부활 기도 30% 빨라짐',()=>{qG21('priest');P.rune.n=600;
  qOk(!runePick('mana',0,0),'점수 없이 고름');runeAdd('mp',30);runeAdd('cdr',20);qOk(runePick('mana',0,0)&&!runePick('mana',0,1)&&P.rune.s.mana[0]===0,'마나 50점 새김');qOk(runeVal('killMp')===.02,'처치 마나');
  const e=qDummy(P.x+200,P.y);P.mp=0;rewardKill(e);qOk(P.mp>=maxMp()*.02-1,'처치 뒤 마나 '+Math.round(P.mp));
  runeAdd('hp',50);qOk(runePick('grd',0,0),'수호 50점');P.pot={hp:5,mp:5};P.potCd=0;P.hp=1;const T=potBest('hp');qOk(drinkPotion('hp'),'물약');qOk(Math.abs(P.potHot.hp.rate-potAmt('hp',T)/POT_DUR*1.2)<1e-6,'물약 +20%');
  runeAdd('dmg',50);qOk(runePick('pow',0,0)&&runeVal('brk')===.1,'무너짐 새김');const b=qDummy(P.x+300,P.y);b.boss=1;b.stg=0;breakAdd(b,10);qOk(Math.abs(b.stg-11)<1e-9,'breakAdd 10 → '+b.stg);
  b.stg=0;PTY.stagFx(b,{stun:1});qOk(Math.abs(b.stg-PTY.STG.stun*1.1)<1e-9,'기절 게이지 '+b.stg);
  runeAdd('dr',30);runeAdd('res',30);qOk(runePick('grd',1,0)&&runeVal('rez')===.3,'부활 새김');
  P.sk.resurrection=1;P.cd={};P.mp=maxMp();const on=NET.on;NET.on=true;try{castReset();tryCast('resurrection');qOk(CAST.cur&&CAST.cur.id==='resurrection'&&Math.abs(CAST.cur.max-CAST_T.resurrection/1.3)<1e-9,'부활 시전 '+(CAST.cur&&CAST.cur.max))}finally{castStop();NET.on=on;castReset()}
  qOk(runePick('pow',1,1)===false,'100점 전');return '새김 4개 고름'});
qT('룬 각인 v21','아이템 찾기(각인+새김+어둠 단계+파티 2인 10%·3인 20%, 덧셈) → 더 굴림 · 금화 % 는 주운 값에 더함',()=>{qG21('mage');P.rune.n=100;runeAdd('find',20);qOk(Math.abs(runeFind()-.2)<1e-9,'찾기 '+runeFind());
  const pn=PTY.partyN;try{PTY.partyN=()=>2;qOk(Math.abs(runeFind()-.3)<1e-9,'2인');PTY.partyN=()=>3;qOk(Math.abs(runeFind()-.4)<1e-9,'3인')}finally{PTY.partyN=pn}
  let n=0,ne=0;const N=20000;for(let i=0;i<N;i++){loot.length=0;if(runeFindRoll({k:'wolf',lvl:60,x:P.x,y:P.y}))n++;if(runeFindRoll({k:'wolf',lvl:60,x:P.x,y:P.y,elite:true}))ne++}loot.length=0;
  qOk(n/N>.006&&n/N<.022,'일반 '+qR(n/N*100)+'%');qOk(ne/N>.05&&ne/N<.105,'정예 '+qR(ne/N*100)+'%');qOk(!runeFindRoll({k:'wolf',lvl:60,x:0,y:0,qa:1}),'허수아비');
  runeAdd('gold',20);const g0=P.gold;pickup({kind:'gold',amt:100,x:P.x,y:P.y,t:0});const own=v20OwnHas('perk:luck');qOk(P.gold-g0===(own?150:140),'금화 +40% → '+(P.gold-g0));
  return `찾기 20% → 일반 ${qR(n/N*100)}% · 정예 ${qR(ne/N*100)}%`});
qT('룬 각인 v21','각인 지우개: 140부터 잡화점에서 금화로 · 쓰면 점수를 모두 돌려받고 새김도 비움 · 하나 씀 · 다른 데서 주기(runeEraserGive)',()=>{qG21('mage',100);actTown=ALLTOWNS.find(t=>(t.shops||[]).some(s=>s.type==='general'))||ALLTOWNS[0];actShop='general';
  qOk(!shopHtml().includes('각인 지우개'),'100레벨에 보임');P.lvl=140;P.rune.n=80;runeAdd('dmg',50);runePick('pow',0,1);P.gold=1e6;const pr=runeEraserPrice();qOk(pr===30000,'값 '+pr);
  tab='shop';panel.hidden=false;renderPanel();const b=pbody.querySelector('[data-r21="buyer"]');qOk(b,'사기 단추');b.click();qOk(P.gold===1e6-pr&&P.rune.er===1,'샀음 '+P.gold);qClosePanels();
  qOk(runeErase()&&runeLeft()===80&&!P.rune.s.pow.length&&P.rune.er===0&&runeVal('dmg')===0,'지우기');qOk(!runeErase(),'없는데 지움');qOk(runeEraserGive(2)===2,'주기');return '값 '+pr.toLocaleString()});
qT('룬 각인 v21','저장 왕복(rune · ash · 모르는 칸 보존) · 망가진 값 다듬기 · v20 저장은 기본값 · 옛 판이 다시 저장해 rune이 빠져도 pot 거울에서 되살림',()=>{qResetStore();qG21('archer');P.rune.n=120;runeAdd('ms',20);runeAdd('gold',20);runeAdd('find',20);runePick('path',0,1);
  P.rune.zz=7;P.rune.a.zz=3;P.rune.xp=12345;P.rune.er=2;P.ash=77;saveNow();const raw=JSON.parse(qRaw(SLOTKEY(QA_SLOT)));
  qOk(raw.rune.n===120&&raw.ash===77&&raw.pot._r21&&raw.pot._r21.a===77&&raw.rune.zz===7,'저장 '+JSON.stringify(raw.rune).slice(0,80));qOk(!P.pot._r21,'P.pot 오염');
  qG21('mage',140,6);qOk(load(readSlot(QA_SLOT),QA_SLOT),'불러오기');qOk(P.rune.n===120&&P.rune.a.find===20&&P.rune.s.path[0]===1&&P.rune.xp===12345&&P.rune.er===2&&P.ash===77,'값 '+JSON.stringify(P.rune).slice(0,90));
  qOk(P.rune.zz===7&&P.rune.a.zz===3,'모르는 칸');qOk(Math.abs(runeFind()-.25)<1e-9,'효과 '+runeFind());saveNow();qOk(JSON.parse(qRaw(SLOTKEY(QA_SLOT))).rune.zz===7,'다시 저장');
  const old=JSON.parse(qRaw(SLOTKEY(QA_SLOT)));delete old.rune;delete old.ash;qPut(SLOTKEY(QA_SLOT),old);qG21('mage',140,6);load(readSlot(QA_SLOT),QA_SLOT);qOk(P.rune.n===120&&P.ash===77&&P.rune.a.gold===20,'거울에서 되살림');
  const c=runeClean({n:5,a:{st:9,dmg:-3,hp:'x'},s:{pow:[2,7],grd:'x'},xp:-9,er:'a'});qOk(c.a.st===0&&c.xp===0&&c.er===0&&!c.s.pow.length,'망가진 값 '+JSON.stringify(c).slice(0,80));
  const c2=runeClean({n:400,a:{dmg:80,st:10},s:{pow:[1]},xp:9e15});qOk(c2.a.dmg===50&&c2.a.st===10&&c2.s.pow[0]===1&&c2.xp<runeNeed(400),'상한 다듬기');
  qPut('arseia-char-3',JSON.parse(JSON.stringify(QA_V19MG)));qOk(load(readSlot(3),3),'v19/v20 저장');qOk(P.rune.n===0&&P.ash===0&&runeLeft()===0,'기본값');saveNow();const r3=JSON.parse(qRaw(SLOTKEY(3)));qOk('rune' in r3&&r3.ash===0&&!r3.pot._r21,'새 칸 저장');
  return '120점 · 재의 결정 77 · 모르는 칸 2개 보존'});
qT('룬 각인 v21','「룬 각인」 탭: 140 전에는 숨김 · 140에 보임 · 점수·칸·새김 표시 · 단추로 찍기 · 휴대폰 폭 390에 맞음',()=>{qG21('mage',100);openPanel('char');qOk($('#tabRune').hidden,'100레벨에 보임');
  P.lvl=140;P.rune.n=60;P.ash=9;renderPanel();qOk(!$('#tabRune').hidden,'140인데 숨김');qOk(/재의 결정 <b>9<\/b>/.test(charHtml()),'가방 칸 재의 결정');$('#tabRune').click();qOk(tab==='rune','탭');const h=pbody.innerHTML;
  for(const w of ['힘의 판','수호의 판','마력의 판','길잡이의 판','새김 50점','재의 결정','각인 막대'])qOk(h.includes(w),w+' 없음');
  pbody.querySelector('[data-r21="add"][data-r21b="dmg|5"]').click();qOk(P.rune.a.dmg===5,'+5 단추');for(let i=0;i<9;i++)pbody.querySelector('[data-r21="add"][data-r21b="dmg|5"]').click();
  qOk(P.rune.a.dmg===50&&pbody.innerHTML.includes('하나를 고르세요'),'새김 고르기 표시');pbody.querySelector('[data-r21="pick"][data-r21b="pow|0|2"]').click();qOk(P.rune.s.pow[0]===2&&qR(stat('crit'))===2,'새김 단추');
  const card=panel.querySelector('.card'),sw=card.style.width,sm=card.style.maxWidth;card.style.width='358px';card.style.maxWidth='358px';
  try{renderPanel();const cr=card.getBoundingClientRect();qOk(pbody.scrollWidth<=pbody.clientWidth+2,`가로 넘침 ${pbody.scrollWidth}/${pbody.clientWidth}`);
    const bad=[...pbody.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&(r.right>cr.right+1||r.left<cr.left-1)});qOk(!bad.length,'밖으로 나간 단추 '+bad.length)}
  finally{card.style.width=sw;card.style.maxWidth=sm;qClosePanels()}return '390 폭 확인'});
qT('재련 v21','확률(+1~+5 100% · 80/70/60/45/30%) · 비용 표 · 실패해도 안 깨지고 안 내려감 · 실패마다 +5% (아주 운이 나빠도 결국 됨) · 재료 모자라면 아무것도 안 씀',()=>{qG21('mage');
  const it=QA_ITEM(uid++,'staff',2,'시험 지팡이',140,{int:200,crit:5});P.gear.staff=it;P.ash=1000;P.gold=1e7;
  qOk(RF_P.join()==='100,100,100,100,100,80,70,60,45,30'&&RF_ASH.length===10&&RF_GOLD.length===10,'표');
  for(let i=0;i<5;i++)qOk(rfChance(it)===100&&rfTry(it,99.99)===true,'+'+(i+1));qOk(it.rf===5&&P.ash===1000-(1+2+3+4+6),'+5 · 재의 결정 '+P.ash);
  qOk(rfChance(it)===80&&rfTry(it,85)===false&&it.rf===5&&it.rfp===1&&rfChance(it)===85,'실패 뒤 '+rfChance(it));qOk(P.gear.staff===it,'장비가 사라짐');
  qOk(rfTry(it,84)===true&&it.rf===6&&it.rfp===0,'+6');it.rf=9;let n=0;while(it.rf<10&&n<40){rfTry(it,99.99);n++}qOk(it.rf===10&&n===15,`+10까지 최악의 운 ${n}번`);
  qOk(rfWhy(it).includes('+10')&&rfTry(it,0)===null,'+10 넘음');const it2=QA_ITEM(uid++,'robe',0,'시험 로브',140,{hp:500});P.bag.push(it2);P.ash=0;const g=P.gold;qOk(rfTry(it2,0)===null&&P.gold===g&&!rfOf(it2),'재료 없음');
  qOk(!rfCan(QA_ITEM(uid++,'ring',0,'반지',140,{mp:50}))&&!rfCan(QA_ITEM(uid++,'amulet',0,'목걸이',140,{regen:5})),'반지·목걸이');return '+10까지 최악 15번'});
qT('재련 v21','+4%씩 덧셈: 착용한 무기의 주 능력치(피해) · 방어구(생명력·받는 피해 감소) · 벗으면 사라지고 다른 장비로 옮겨지지 않음 · 비교 점수에 반영',()=>{qG21('mage');
  const st=QA_ITEM(uid++,'staff',2,'시험 지팡이',140,{int:200});P.gear.staff=st;runeBump();const i0=stat('int');st.rf=5;v20GsBump();qOk(stat('int')===i0+40,`지능 ${i0}→${stat('int')}`);
  const s0=itemScore(Object.assign({},st,{rf:0}));qOk(itemScore(st)>s0,'점수');P.gear.staff=null;P.bag.push(st);qOk(stat('int')===i0-200,'벗음');
  const st2=QA_ITEM(uid++,'staff',2,'다른 지팡이',140,{int:200});P.gear.staff=st2;qOk(stat('int')===i0,'옮겨짐');
  const weak=QA_ITEM(uid++,'staff',0,'약한 지팡이',10,{int:5},{rf:1});P.bag.push(weak,QA_ITEM(uid++,'staff',0,'약한 지팡이2',10,{int:5}));tab='char';panel.hidden=false;renderPanel();const sb=pbody.querySelector('[data-sellweak]');if(sb){sb.click();qOk(P.bag.includes(weak)&&!P.bag.some(x=>x.name==='약한 지팡이2'),'한꺼번에 팔기가 재련 장비를 팜')}qClosePanels();
  qG21('warrior');const pl=QA_ITEM(uid++,'robe',1,'시험 판금',140,{hp:500,dr:10},{cls:'warrior',wt:'plate'});P.gear.robe=pl;runeBump();const h0=stat('hp'),d0=stat('dr');pl.rf=10;v20GsBump();
  qOk(stat('hp')===h0+200&&qR(stat('dr'))===qR(d0+4),`판금 +10: 생명력 ${h0}→${stat('hp')} · 받는 피해 ${d0}→${stat('dr')}`);
  const sw=P.gear.staff;if(sw){const k=rfKeys(sw);qOk(k.includes('atk'),'무기 키 '+k)}return '지능 +20% · 판금 +40%'});
qT('재련 v21','이름 「+7」(itemName · it.name은 그대로) · 틀이 밝아짐 · 능력치 줄 · 착용 칸/가방/상점 목록에 같은 이름',()=>{qG21('mage');const it=QA_ITEM(uid++,'staff',2,'시험 지팡이',140,{int:200});it.rf=7;P.gear.staff=it;
  qOk(itemName(it)==='시험 지팡이 +7'&&it.name==='시험 지팡이','이름');qOk(/box-shadow/.test(itemIcon(it))&&!/box-shadow/.test(itemIcon(Object.assign({},it,{rf:0}))),'틀');qOk(statLine(it).includes('재련 +7'),'줄');
  qOk(charHtml().includes('시험 지팡이 +7'),'캐릭터 창');const b=Object.assign({},it,{id:uid++});P.bag.push(b);qOk(itemRow(b,'').includes('시험 지팡이 +7'),'가방 목록');
  if(typeof itemTip==='function')qOk(itemTip(it).includes('+7')&&itemTip(it).includes('재련'),'툴팁');return itemName(it)});
qT('재련 v21','대장장이 칸: 140에 무기상·방어구상 · 고르기 → 비용·확률·결과 → 「재련하기」 단추 · 잡화점에는 없음 · 가게가 하나인 야영지는 그 가게에 · 휴대폰 폭 390',()=>{qG21('mage');P.ash=50;P.gold=1e6;
  const it=QA_ITEM(uid++,'robe',1,'시험 로브',140,{hp:500});P.bag.push(it);const t=ALLTOWNS.find(t=>(t.shops||[]).some(s=>s.type==='weapon'));actTown=t;actShop='general';qOk(!shopHtml().includes('재련 · 대장장이'),'잡화점에 보임');
  actShop='weapon';tab='shop';panel.hidden=false;renderPanel();qOk(pbody.innerHTML.includes('재련 · 대장장이'),'무기상');pbody.querySelector(`[data-rf21s="${it.id}"]`).click();const h=pbody.innerHTML;
  qOk(h.includes('성공 확률 <b>100%</b>')&&h.includes('재의 결정 <b class="r21cnt">1</b>')&&h.includes('500 → '),'고른 장비 '+h.slice(h.indexOf('rf21sel'),h.indexOf('rf21sel')+200));
  pbody.querySelector(`[data-rf21go="${it.id}"]`).click();qOk(it.rf===1&&P.ash===49&&P.gold===1e6-RF_GOLD[0],'재련 단추');qOk(pbody.innerHTML.includes('시험 로브 +1'),'이름 갱신');
  const card=panel.querySelector('.card'),sw=card.style.width,sm=card.style.maxWidth;card.style.width='358px';card.style.maxWidth='358px';
  try{renderPanel();const cr=card.getBoundingClientRect();qOk(pbody.scrollWidth<=pbody.clientWidth+2,`가로 넘침 ${pbody.scrollWidth}/${pbody.clientWidth}`);const bad=[...pbody.querySelectorAll('.rf21 button')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&r.right>cr.right+1});qOk(!bad.length,'밖 단추 '+bad.length)}
  finally{card.style.width=sw;card.style.maxWidth=sm;qClosePanels()}
  const camp=ALLTOWNS.find(t=>t.id==='keeperhouse'||t.id==='pilgrimtent');if(camp){actTown=camp;actShop=(camp.shops&&camp.shops[0]&&camp.shops[0].type)||'general';qOk(shopHtml().includes('재련 · 대장장이'),'야영지 '+camp.id)}
  qG21('mage',100);actTown=t;actShop='weapon';qOk(!shopHtml().includes('재련 · 대장장이'),'100레벨에 보임');return '무기상 · 야영지'});
qT('재련 v21','저장 왕복: 착용·가방 장비의 rf · rfp 그대로 · 잘못된 값은 0으로 읽고(최대 10) 원래 값은 보존',()=>{qResetStore();qG21('mage');const a=QA_ITEM(uid++,'staff',2,'시험 지팡이',140,{int:200},{rf:7,rfp:2}),b=QA_ITEM(uid++,'robe',0,'시험 로브',140,{hp:300},{rf:'x'}),c=QA_ITEM(uid++,'robe',0,'큰 로브',140,{hp:300},{rf:99});
  P.gear.staff=a;P.bag.push(b,c);saveNow();qG21('priest',140,6);qOk(load(readSlot(QA_SLOT),QA_SLOT),'불러오기');const A=P.gear.staff,B=P.bag.find(x=>x.name==='시험 로브'),C=P.bag.find(x=>x.name==='큰 로브');
  qOk(A.rf===7&&A.rfp===2&&rfOf(A)===7,'착용');qOk(rfOf(B)===0&&B.rf==='x'&&rfOf(C)===10&&C.rf===99,'잘못된 값');saveNow();const raw=JSON.parse(qRaw(SLOTKEY(QA_SLOT)));qOk(raw.gear.staff.rf===7&&raw.bag.some(x=>x.rf==='x'),'다시 저장');return '+7 · 실패 2'});
/* ===== v21 HUNT: 어둠 단계 1~10 · 잿빛 메아리 · 상급 현상금 (dark21.js · echo21.js) ===== */
const qD21Prep=(cls,lvl)=>{qPrep(cls||'mage',{lvl:lvl||140});qPtyOff();P.diff=2;P.invT=1e9;P.w3={lord:1};P.dark=darkClean({open:10,cur:0});D21.h=null;D21.key='';return P};
const qD21HP=L=>40+12*L+4*(10+1.5*(L-1));
const qEchoDay=reg=>{for(let i=0;i<14;i++){const ms=new Date(2026,9,9+i,12).getTime(),d=v20Day(ms);if(echoToday(d).includes(reg))return{ms,d}}return null};
function qD21Dg(id){const D=WX_DUNGEONS.find(d=>d.id===id)||W3_DUNGEONS.find(d=>d.id===id);qWxTo(D.reg);const c=CAVES.find(c=>c.cave===D);qOk(c,'동굴 없음 '+id);qOk(qActAt(c.x,c.y+40)==='dungeon'&&actCave===c,`입구 act=${act}`);doAct();qOk(DG&&DG.d===D,'못 들어감');return{D,c}}
const qD21Hover=e=>{const s=W2S(e.x,e.y),sc=e.sc||(e.elite?1.25:1);mouse.active=true;mouse.x=s.x;mouse.y=s.y-TYPES[e.k].r*sc;try{updateHud()}finally{mouse.active=false}};
const qD21End=()=>{mouse.active=false;V20.qaNow=null;D21.h=null;qPtyOff();if(DG)leaveDungeon();loadRegion('home');qClosePanels()};
qT('v21 어둠 단계','표: 단계 t마다 생명력 +40% · 보스·정예 피해 +6% · 경험치 +15% · 아이템 찾기 +10% · 무리 +5% (덧셈 · 1~10단계) · 등불 창 열 줄 · 열린 단계만 고르기',()=>{
  for(let t=0;t<=10;t++){const M=darkMods(t);qOk(Math.abs(M.hp-.4*t)<1e-9&&Math.abs(M.dmg-.06*t)<1e-9&&Math.abs(M.xp-.15*t)<1e-9&&Math.abs(M.find-.1*t)<1e-9&&Math.abs(M.pack-.05*t)<1e-9,`${t}단계 ${JSON.stringify(M)}`)}
  const T=darkMods(10);qOk(qR(T.hp)===4&&qR(T.dmg)===.6&&qR(T.xp)===1.5&&qR(T.find)===1&&qR(T.pack)===.5,'10단계');qOk(darkMods(99).hp===4&&darkMods(-3).hp===0,'범위 밖');
  qD21Prep();P.dark.open=3;v20Open('d21');const h=pbody.innerHTML;qOk(!panel.hidden&&(h.match(/어둠 \d+단계<\/b>/g)||[]).length===10,'열 줄');qOk((h.match(/data-v20a="d21set"/g)||[]).length===3&&(h.match(/>잠김</g)||[]).length===7,'고르기 3 · 잠김 7');
  qOk(h.includes('+400%')&&h.includes('+60%')&&h.includes('+150%')&&h.includes('+100%'),'10단계 숫자');qClosePanels();return '10단계 표'});
qT('v21 어둠 단계','열림: 재의 군주 첫 처치 전엔 등불이 안 보임 → P.w3.lord>0이면 1단계가 열리고 꺼진 등대지기의 집에 등불 (걸어서 닿음 · F로 창) · 열리지 않은 단계는 못 고름',()=>{
  qPrep('warrior',{lvl:140});P.diff=2;P.invT=1e9;qOk(P.dark&&P.dark.open===0&&P.dark.cur===0,'새 캐릭터 '+JSON.stringify(P.dark));const d=D21.lamp;qOk(d&&RCACHE.capital.decor.includes(d),'등불 없음');
  const T=RCACHE.capital.town;qOk(T&&T.id==='keeperhouse'&&Math.hypot(d.x-T.x,d.y-T.y)<520,'등대지기의 집 곁 아님');qOk(!sqUseLive(d),'잠긴 등불이 보임');
  P.w3={lord:1};const m=qMsgs(()=>qStep(20,{render:false}));qOk(P.dark.open===1&&m.some(t=>t.includes('어둠의 등불')),'안 열림 '+m.join('/'));
  qWxTo('capital');const a=qActAt(d.x+30,d.y+30);qOk(a==='tw_use'&&TW.act===d,`act=${a}`);render();doAct();qOk(!panel.hidden&&pbody.innerHTML.includes('어둠 1단계'),'창 안 열림');
  V20A.d21set(2);qOk(P.dark.cur===0,'안 열린 단계를 고름');V20A.d21set(1);qOk(P.dark.cur===1,'못 고름');qClosePanels();
  {const x=saveData();x.dark=undefined;x.w3={lord:3};qOk(load(JSON.parse(JSON.stringify(x)),QA_SLOT),'load');qOk(P.dark.open===1,'옛 저장(군주 처치)에서 안 열림')}
  qD21End();return `등불 ${Math.round(Math.hypot(d.x-T.x,d.y-T.y))}`});
qT('v21 어둠 단계','어디서 바뀌나: 지옥 고원·왕도 들판과 그 던전(재의 왕좌 포함)만 · 고향 · 다른 지역 · 악몽 · 시험 방(DG.ci≥900)은 0',()=>{const out=[];
  try{qD21Prep();P.dark.cur=4;loadRegion('home');qOk(darkTier()===0,'고향');qWxTo('plateau');qOk(darkTier()===4,'고원 '+darkTier());P.diff=1;qOk(darkTier()===0,'악몽');P.diff=2;
    qWxTo('capital');qOk(darkTier()===4,'왕도');const other=ECHO_REGS.find(r=>!echoList().includes(r));qWxTo(other);qOk(darkTier()===0,'옛 지역 '+other);
    qD21Dg('pt_corridor');qOk(darkTier()===4,'고원 던전');const ci=DG.ci;DG.ci=900;qOk(darkTier()===0,'시험 방');DG.ci=ci;leaveDungeon();
    out.push(other)}finally{qD21End()}return '0 · 4 · '+out});
qT('v21 어둠 단계','몬스터 세기: 생명력 +40%·t (모두) · 피해는 보스·준보스 어디서나와 던전 정예만 +6%·t · 들판 몬스터와 들판 정예 피해는 그대로 · 한 번만 키움',()=>{const out=[];
  try{qD21Prep();qWxTo('plateau');const T=TOWNS[0],x=T.gate.x+40,y=T.gate.y+40;const mk=(k,el,t)=>{P.dark.cur=t;enemies=[];const e=dgMob(k,x,y,110,el?{elite:true}:null);if(el)e.afx='x';qStep(1,{render:false});return e};
    const a0=mk('a_knight',0,0),a6=mk('a_knight',0,6),e0=mk('a_knight',1,0),e6=mk('a_knight',1,6),b0=mk('r_ashcolossus',0,0),b6=mk('r_ashcolossus',0,6);
    qOk(Math.abs(a6.max/a0.max-3.4)<.01&&a6.dmg===a0.dmg,`들판 ${a6.max}/${a0.max} · ${a6.dmg}/${a0.dmg}`);qOk(Math.abs(e6.max/e0.max-3.4)<.01&&e6.dmg===e0.dmg,'들판 정예 피해가 오름');
    qOk(Math.abs(b6.max/b0.max-3.4)<.01&&Math.abs(b6.dmg/b0.dmg-1.36)<1e-6,'우두머리');const m=b6.max;qStep(3,{render:false});qOk(b6.max===m,'두 번 키움');out.push('들판 ×3.4');
    P.dark.cur=3;qD21Dg('pt_corridor');qStep(1,{render:false});
    for(const e of enemies){const t=TYPES[e.k],up=t.boss||t.mini||e.elite,hp0=Math.round(t.hp*(1+.34*(e.lvl-1))*DIFF[2].hp*(e.elite?3:1)),dm0=t.dmg*(1+.18*(e.lvl-1))*(e.elite?1.4:1);
      if(e.afx)continue;/* v24: 던전 보스는 v24 보스 세기(B24)가 더 곱해짐 */const bm=e._b24?(e._b24==='dg'?B24.dgHp(e.lvl):B24.fdHp(e.lvl)):1,bd=e._b24?B24.dmg(e.lvl):1;qOk(Math.abs(e.max-Math.round(hp0*2.2*bm))<=1+e.max*1e-6,`${e.k} 생명력 ${e.max}/${hp0} ×${qR(bm)}`);qOk(Math.abs(e.dmg-dm0*bd*(up?1.18:1))<1e-6*Math.max(1,e.dmg),`${e.k} 피해 ${e.dmg}/${dm0}`)}out.push(`던전 ${enemies.length}마리`)}
  finally{qD21End()}return out.join(' · ')});
qT('v21 어둠 단계','10단계에서도 들판 한 대 상한: 고원·왕도·메아리 12곳 들판 몬스터 한 대가 같은 레벨 맨몸 기본 생명력의 28% 이하(가장 센 굴림 ×1.15도 32% 이하) · 0단계와 같음',()=>{let worst=0,wk='',n=0;
  try{qD21Prep();const chk=(reg,day)=>{if(day)V20.qaNow=day.ms;qWxTo(reg);const T=TOWNS[0];for(const k of REGIONS[reg].mobs){let d0=0;for(const t of [0,10]){P.dark.cur=t;enemies=[];const e=dgMob(k,T.gate.x+40,T.gate.y+40,140);qStep(1,{render:false});
      const f=e.dmg/qD21HP(140);if(f>worst){worst=f;wk=k}qOk(f<=.28&&f*1.15<=.32,`${reg} ${k} 한 대 ${(f*100).toFixed(1)}% (단계 ${t})`);if(t===0){d0=e.dmg;n++}else qOk(Math.abs(e.dmg-d0)<1e-6&&e.d21t===10,`${k} 단계로 피해가 바뀜`)}}};
    chk('plateau');chk('capital');for(const r of ECHO_REGS){const d=qEchoDay(r);qOk(d,'메아리 날 없음 '+r);chk(r,d);qOk(echoHere(),'메아리 아님 '+r)}}finally{qD21End()}return `가장 센 ${wk} ${(worst*100).toFixed(1)}% · ${n}종`});
qT('v21 어둠 단계','무리 +5%·t: 들판 생성 목표 ×(1+무리) (10단계 18 → 27) · 던전은 방마다 졸개를 더 (≈ +50%)',()=>{const out=[];
  try{qD21Prep();qWxTo('plateau');const c=CAVES.find(c=>c.cave&&c.cave.id==='pt_corridor');let sp=null;for(let a=0;a<6.283&&!sp;a+=.4){const x=c.x+Math.cos(a)*260,y=c.y+Math.sin(a)*260;if(!blockedAt(x,y)&&zoneLevel(x,y)>=21)sp={x,y}}qOk(sp,'자리');
    for(const t of [0,10]){P.dark.cur=t;P.x=sp.x;P.y=sp.y;enemies=[];for(let i=0;i<18;i++){const e=dgMob('a_hound',sp.x+Math.cos(i)*300,sp.y+Math.sin(i)*300,100);e.atkCd=1e9}qStep(1,{render:false});spawnT=0;let made=0;
      for(let i=0;i<40;i++){spawnT=0;const n0=enemies.length;qStep(1,{render:false,spawn:true});if(enemies.length>n0)made++}
      if(t===0)qOk(enemies.length<=18,'0단계에 목표 넘음 '+enemies.length);else qOk(enemies.length>=24&&enemies.length<=27,'10단계 '+enemies.length);out.push(`${t}단계 ${enemies.length}`)}
    P.dark.cur=10;qD21Dg('pt_corridor');const base=enemies.filter(e=>!TYPES[e.k].boss&&!TYPES[e.k].mini).length-DG.d21x;qOk(DG.d21x>=Math.round(base*.5)-3&&DG.d21x<=Math.round(base*.5),`던전 더 ${DG.d21x}/${base}`);out.push(`던전 +${DG.d21x}/${base}`)}
  finally{qD21End()}return out.join(' · ')});
qT('v21 어둠 단계','정예 수식어 (5단계부터, 4단계엔 없음): 쇠 같은 피부 생명력 +60% · 얼음 숨결 서리 원 · 피를 마시는 회복 · 불씨를 품은 죽은 자리 불씨 원 · 되살아나는 회복 · 이름 앞 · 대상 칸 · 그리기',()=>{const got=new Set();
  try{qD21Prep();qWxTo('plateau');const T=TOWNS[0],x=T.gate.x+260,y=T.gate.y+260;
    P.dark.cur=4;enemies=[];const e4=dgMob('a_knight',x,y,110,{elite:true});qStep(1,{render:false});qOk(!e4.afx,'4단계 수식어');
    P.dark.cur=5;let iron=null;for(let i=0;i<80&&!(iron&&got.size>=5);i++){enemies=[];const e=dgMob('a_knight',x,y,110,{elite:true});qStep(1,{render:false});qOk(DARK_AFX[e.afx],'수식어 없음');got.add(e.afx);if(e.afx==='iron')iron=e}
    qOk(got.size===5,'수식어 종류 '+[...got]);const hp0=Math.round(TYPES.a_knight.hp*(1+.34*109)*DIFF[2].hp*3);qOk(Math.abs(iron.max-Math.round(hp0*3.6))<=1,`쇠 피부 ${iron.max}/${hp0}`);
    const mk=a=>{enemies=[];const e=dgMob('a_knight',P.x+60,P.y,110,{elite:true});e.afx=a;e.d21=1;e.aggroed=true;return e};
    let e=mk('frost');e.afT=0;qStep(1,{render:false});qOk(warns.some(w=>w.src===e&&w.rad===130&&w.col==='#9fe0ff'),'서리 원');warns=[];
    e=mk('vamp');e.hp=Math.round(e.max*.5);P.invT=0;P.hp=maxHp();hitPlayer(10,e);qOk(e.hp>e.max*.53,'흡혈');P.invT=1e9;
    e=mk('ember');killE(e);qOk(warns.some(w=>w.src===e&&w.col==='#ff8a3a'&&w.rad===120),'불씨 원');warns=[];loot=[];
    e=mk('regen');e.atkCd=1e9;e.hp=Math.round(e.max*.5);e.hurt=0;qStep(420,{render:false});qOk(e.hp>e.max*.54,'되살아남 '+(e.hp/e.max).toFixed(2));
    qD21Hover(e);qOk($('#tname').textContent.includes('되살아나는 '+TYPES.a_knight.n),'대상 칸 '+$('#tname').textContent);render();hover=null;
    qOk(!sqUseLive({use:'x'}),'')}finally{hover=null;qD21End()}return [...got].join(' · ')});
qT('v21 어둠 단계','단계 깨기: 그 단계에서 140 던전 보스 처치 → 깬 단계 · 다음 단계 열림 (자기 열린 단계가 그 단계 이상일 때만) · 10이 끝 · 지옥 밖/옛 던전은 안 셈 · 재의 결정',()=>{const out=[];
  try{const ash0=()=>typeof P.ash==='number'?P.ash:0;
    qD21Prep();P.dark=darkClean({open:1,cur:1});qD21Dg('pt_corridor');let a=ash0();hurtE(DG.boss,DG.boss.hp+10,{el:'fire'});qOk(P.dark.top===1&&P.dark.open===2,'1단계 '+JSON.stringify(P.dark));
    if(typeof ashGain==='function')qOk(ash0()-a>=15+3+1,'재의 결정 '+(ash0()-a));leaveDungeon();out.push('1→2');
    P.dark=darkClean({open:5,cur:2,top:4});qD21Dg('cp_academy');hurtE(DG.boss,DG.boss.hp+10,{el:'fire'});qOk(P.dark.open===5&&P.dark.top===4,'낮은 단계 '+JSON.stringify(P.dark));leaveDungeon();
    P.dark=darkClean({open:10,cur:10,top:9});qD21Dg('cp_ossuary');hurtE(DG.boss,DG.boss.hp+10,{el:'fire'});qOk(P.dark.open===10&&P.dark.top===10,'10단계 '+JSON.stringify(P.dark));leaveDungeon();out.push('10 끝');
    P.dark=darkClean({open:3,cur:3,top:2});P.diff=1;qD21Dg('pt_choir');hurtE(DG.boss,DG.boss.hp+10,{el:'fire'});qOk(P.dark.top===2&&P.dark.open===3,'악몽에서 셈');leaveDungeon();P.diff=2;
    const other=ECHO_REGS.find(r=>!echoList().includes(r)),d=WX_DUNGEONS.find(x=>x.reg===other);qD21Dg(d.id);hurtE(DG.boss,DG.boss.hp+10,{el:'fire'});qOk(P.dark.top===2,'옛 던전에서 셈');out.push('지옥 밖 · 옛 던전 0')}
  finally{qD21End()}return out.join(' · ')});
qT('v21 어둠 단계','경험치 +15%·t: 4단계 처치 경험치 = 0단계 ×1.6 (rewardKill 한 번) · 단계 밖에선 그대로',()=>{let r=0;
  try{qD21Prep('mage',120);qWxTo('plateau');const e={k:'a_knight',x:P.x,y:P.y,lvl:118,elite:false,r:19};const xp=t=>{P.dark.cur=t;P.lvl=120;P.xp=0;rewardKill(e);loot=[];return P.xp};
    xp(0);const x0=xp(0),x4=xp(4);r=x4/x0;qOk(x0>0&&Math.abs(r-1.6)<.02,`${x4}/${x0}`);loadRegion('home');P.dark.cur=4;xp(0);const h0=xp(0),h=xp(4);qOk(Math.abs(h-h0)<=1,`고향에서 오름 ${h}/${h0} ${REG.id} ${darkHere()}`)}finally{qD21End()}return `×${r.toFixed(3)}`});
qT('v21 잿빛 메아리','고르기: 날짜가 같으면 늘 같은 둘 · 6일 한 바퀴에 12곳 모두 한 번씩 · 날짜마다 다름 · 지옥 + 140레벨에게만 · 참가자는 방장 목록',()=>{
  const a=echoToday('2026-10-09'),b=echoToday('2026-10-09');qOk(a.join()===b.join()&&a.length===2&&a[0]!==a[1]&&a.every(x=>ECHO_REGS.includes(x)),'같은 날 '+a+'/'+b);
  let st=null;for(let i=0;i<6;i++){const ms=new Date(2026,9,1+i,12).getTime();if(echoDayNum(v20Day(ms))%6===0){st=ms;break}}qOk(st,'바퀴 시작');
  const seen=[];for(let i=0;i<6;i++)seen.push(...echoToday(v20Day(st+i*864e5)));qOk(new Set(seen).size===12,'한 바퀴 '+seen);
  const keys=new Set();let same=0,prev='';for(let i=0;i<60;i++){const k=echoToday(v20Day(st+i*864e5)).slice().sort().join();keys.add(k);if(k===prev)same++;prev=k}qOk(keys.size>=30&&same===0,`60일 ${keys.size}가지 · 이틀 연속 같음 ${same}`);
  try{const day=v20Day(st);V20.qaNow=st+3600e3;qD21Prep('archer',140);qOk(echoList().join()===echoToday(day).join(),'목록 '+echoList());P.diff=1;qOk(!echoList().length,'악몽');P.diff=2;P.lvl=139;qOk(!echoList().length,'139레벨');P.lvl=140;
    NET.guest=true;D21.h={t:0,dh:0,a:-1,ec:['ice','sea'],at:time};qOk(echoList().join()==='ice,sea','참가자 목록');D21.h.at=time-9;qOk(!echoList().length,'오래된 목록');NET.guest=false}finally{qD21End()}return `${a.join(' · ')} · 60일 ${keys.size}가지`});
qT('v21 잿빛 메아리','메아리 지역: 들판 Lv136~140 · 세기는 왕도에 맞춤(종류 키 그대로) · 재 빛 그리기(TYPES 그대로) · 메아리 군주 Lv142 + 「잿빛 메아리」 · 던전 둘 136/138(보스 +2) · 포탈 이름 · 큰 지도 · 미니맵 · 지옥에서만',()=>{const out=[];
  try{const reg='jungle',day=qEchoDay(reg);V20.qaNow=day.ms;qD21Prep('mage',140);qWxTo(reg);qOk(echoHere(),'메아리 아님');const T=TOWNS[0];
    qOk(zoneLevel(T.x+tSafe(T)+30,T.y)>=96&&levelAt(T.x+3000,T.y+3000)<=100,'레벨 '+zoneLevel(T.x+tSafe(T)+30,T.y));// v22: 마을마다 안전 지대(tSafe)
    let e=null;for(let i=0;i<30&&!e;i++){spawnT=0;qStep(1,{render:false,spawn:true});e=enemies.find(o=>o.ec)}qOk(e&&e.lvl>=135&&e.lvl<=140&&REGIONS[reg].mobs.includes(e.k),`생성 ${e&&e.k+e.lvl}`);
    const f=ecK(e.k,reg),hp0=Math.round(TYPES[e.k].hp*(1+.34*(e.lvl-1))*DIFF[2].hp*(e.elite?3:1));qOk(Math.abs(e.max-Math.round(hp0*f.hp))<=1,'생명력 맞춤');
    const t0=TYPES[e.k];qStep(2);render();qOk(TYPES[e.k]===t0&&EC.on&&ecTintT(e.k).col!==t0.col,'색 바꾸기');out.push(`${e.k} Lv${e.lvl}`);
    P.x=REG.lair.x+300;P.y=REG.lair.y;let bn=null;for(let i=0;i<3&&!REG.bossE;i++){qStep(1,{render:false});if(REG.bossE)bn=banner&&banner.t}qStep(2,{render:false});const L=REG.bossE;qOk(L&&L.ecl&&L.k===REGIONS[reg].boss&&L.lvl===142,`군주 ${L&&L.k+L.lvl}`);qOk(bn&&bn.includes('메아리 군주'),'군주 알림 '+bn);
    const B=ecBase();qOk(Math.abs(L.max-Math.round(Math.round(TYPES[L.k].hp*(1+.34*141)*DIFF[2].hp)*B.lord.hp/TYPES[L.k].hp))<=2,'군주 생명력 '+L.max);
    L.aggroed=true;L.ecT=0;const m=qMsgs(()=>qStep(1,{render:false}));qOk(warns.filter(w=>w.src===L&&w.col==='#d8c8b8').length>=2&&m.some(t=>t.includes('잿빛 메아리')),'군주 장치');
    qD21Hover(L);qOk($('#tname').textContent.includes('메아리 군주'),'대상 칸 '+$('#tname').textContent);hover=null;warns=[];enemies=[];REG.bossE=null;out.push('군주 Lv142');
    for(const D of WX_DUNGEONS.filter(d=>d.reg===reg)){const l0=D.lvl;qD21Dg(D.id);qOk(DG.lvl===(D.at==='deep'?138:136)&&DG.boss.lvl===DG.lvl+2&&D.lvl===l0,`${D.n} ${DG.lvl}`);qStep(1);qOk(DG.boss.ec===1&&echoHere(),'던전 맞춤');
      const dd=netDgData();qOk(dd.lvl===DG.lvl,'같이 하기 자료');leaveDungeon();out.push(`${D.n} ${D.at==='deep'?138:136}`)}
    qStep(16,{render:false});const nb=REGIONS[reg].edges&&Object.values(REGIONS[reg].edges)[0];qWxTo(nb);qStep(16,{render:false});const ed=EDGES.find(x=>x.to===reg);qOk(ed&&ed.label.includes('잿빛 메아리'),'포탈 이름 '+(ed&&ed.label));
    wmapOpen();WMAP.tab='world';wmapDraw();qOk($('#wmapLeg').innerHTML.includes('잿빛 메아리'),'큰 지도');WMAP.tab='reg';wmapDraw();wmapClose();mmBg=null;drawMinimap();
    P.diff=1;qWxTo(reg);qOk(!echoHere()&&zoneLevel(T.x+tSafe(T)+30,T.y)<90,'악몽에서 메아리');P.diff=2;qWxTo(nb);qStep(16,{render:false});P.diff=1;qStep(16,{render:false});qOk(!EDGES.find(x=>x.to===reg).label.includes('잿빛'),'이름이 안 돌아옴')}
  finally{hover=null;qD21End()}return out.join(' · ')});
qT('v21 잿빛 메아리','상급 현상금: 메아리 지역 둘에 하루 셋 · 게시판 창(140레벨만 받기) · 메아리일 때만 나타남 · 잡으면 증표 +3 (하루 9개 한도 밖) · 날 바뀌면 바뀜 · 증표로 재의 결정·각인 지우개',()=>{const out=[];
  try{const reg='desert',day=qEchoDay(reg);V20.qaNow=day.ms;qD21Prep('archer',140);const s=btyState(),L=ecBtyToday(s.day),E=echoToday(s.day);
    qOk(L.length===3&&L.every((b,i)=>b.id===`echo:${s.day}:${i}`&&E.includes(BTY_BOARDS[b.board].reg)&&btyById(b.id)===b),'셋 '+L.map(b=>b.id));qOk(new Set(L.map(b=>btyName(b))).size===3,'이름 겹침');
    sqUse(BTY_PROP.haven);const h=pbody.innerHTML;qOk(h.includes('상급 현상금')&&(h.match(/data-v20a="btytake"/g)||[]).length===6,'게시판 창');qClosePanels();
    P.lvl=139;V20A.btytake(L[0].id);qOk(!btyActive().length,'139레벨이 받음');sqUse(BTY_PROP.haven);qOk((pbody.innerHTML.match(/data-v20a="btytake"/g)||[]).length===3,'139레벨 단추');qClosePanels();P.lvl=140;
    const b=L.find(x=>BTY_BOARDS[x.board].reg===reg)||L[0],rg=BTY_BOARDS[b.board].reg;V20A.btytake(b.id);qOk(btyActive().some(x=>x.id===b.id),'못 받음');
    P.diff=1;qWxTo(rg);qOk(!btySpawn(b),'메아리 아닐 때 나타남');P.diff=2;qWxTo(rg);const sp=btySpot(b);qOk(sp&&!sp.rough,'자리');P.x=sp.x+100;P.y=sp.y;qStep(20,{render:false});const e=btyLive(b.id);
    qOk(e&&e.lvl>=135&&e.ec===1,`안 나타남 ${e&&e.lvl}`);const tok=s.tok,n=s.n;e.hp=1;hurtE(e,50,{cls:P.cls,el:'phys',proc:1});qOk(e.dead&&s.tok===tok+3&&s.n===n&&s.done.includes(b.id),`증표 ${s.tok-tok} · 오늘 ${s.n}`);loot=[];out.push(btyName(b));
    const nx=ecBtyToday(v20Day(day.ms+864e5));qOk(nx.every(x=>!L.some(y=>y.id===x.id)),'다음 날 같음');
    if(typeof ashGain==='function'){qOk(BTY_SHOP.some(x=>x.id==='ash'),'재의 결정 상품');s.tok=10;const a=P.ash||0;V20A.btybuy('ash');qOk(P.ash===a+5&&s.tok===7,'재의 결정 사기');out.push('재의 결정 상품')}
    if(typeof eraserGain==='function'){qOk(BTY_SHOP.some(x=>x.id==='eraser'),'지우개 상품');out.push('지우개 상품')}}
  finally{qD21End()}return out.join(' · ')});
qT('v21 어둠 단계','저장: P.dark {open,cur,top} 왕복 · 모르는 칸 보존 · 없는 옛 저장은 기본값(저장에 안 씀) · 엉터리 값 다듬기',()=>{
  qD21Prep();P.dark={open:4,cur:2,top:3,zz:{a:1}};let d=saveData();qOk(d.dark&&d.dark.open===4&&d.dark.cur===2&&d.dark.top===3&&d.dark.zz.a===1,'저장 '+JSON.stringify(d.dark));
  qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT),'load');qOk(P.dark.open===4&&P.dark.cur===2&&P.dark.top===3&&P.dark.zz.a===1,'불러오기 '+JSON.stringify(P.dark));
  d=saveData();delete d.dark;delete d.w3;qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT),'load2');qOk(P.dark.open===0&&P.dark.cur===0&&P.dark.top===0,'기본값');qOk(!('dark' in saveData()),'빈 값을 씀');
  const c=darkClean({open:'x',cur:99,top:-3});qOk(c.open===0&&c.cur===0&&c.top===0,'다듬기 '+JSON.stringify(c));const c2=darkClean({open:7,cur:9,top:12});qOk(c2.cur===7&&c2.top===10,'다듬기2');qD21End();return '왕복'});
qT('v21 어둠 단계','같이 하기: 방장이 h21(단계 · 메아리 · 수식어)을 보냄 · 참가자는 방장 단계/메아리를 쓰고 몬스터를 키우지 않음 · 수식어 이름이 참가자에게도',()=>{const out=[];
  try{qD21Prep();P.dark.cur=5;qWxTo('plateau');const {sent}=qPty(2,{host:true,dx:60});enemies=[];const e=dgMob('a_knight',P.x+200,P.y,110,{elite:true});qStep(90,{render:false});
    const m=sent.filter(x=>x.t==='v20x'&&x.k==='h21').pop();qOk(m&&m.dt===5&&m.dh===1&&m.a===netArea()&&Array.isArray(m.ec),'보낸 것 '+JSON.stringify(m));qOk(e.afx&&e.id&&m.af.some(a=>a[0]===e.id&&a[1]===e.afx),'수식어 안 보냄');out.push('방장 보냄');qPtyOff();
    qPty(2);NET.guest=true;NET.hostId='qa_peer';P.dark.cur=0;enemies=[];const g={id:77,k:'a_knight',x:P.x+100,y:P.y,hp:500,max:500,lvl:110,elite:true,r:19,net:1,anim:0,hurt:0,fx:1,lunge:0,freezeT:0,stunT:0,slowT:0};enemies.push(g);
    netOnMsg({t:'v20x',k:'h21',from:'qa_peer',dt:4,dh:1,a:netArea(),ec:['ice','sea','zz'],af:[[77,'frost'],[78,'nope']]});qOk(darkTier()===4&&darkHere(),'참가자 단계 '+darkTier());qOk(echoList().join()==='ice,sea','참가자 메아리');qOk(g.afx==='frost','참가자 수식어');
    qStep(5,{render:false});qOk(g.max===500,'참가자가 키움');qD21Hover(g);qOk($('#tname').textContent.includes('얼음 숨결의'),'참가자 이름');hover=null;
    netOnMsg({t:'v20x',k:'h21',from:'qa_peer',dt:4,dh:1,a:netArea()+7,ec:[],af:[]});qOk(darkTier()===0,'다른 곳인데 단계');out.push('참가자 받음')}
  finally{hover=null;qD21End()}return out.join(' · ')});
qT('의뢰 v21','중요한 의뢰 알림(사용자 04:07): 50레벨이 되면 2차 전직 의뢰 카드가 뜨고 「지금 받기」로 어디서든 시작 · 49레벨엔 안 뜸 · 알림판 맨 위와 의뢰 일지 「중요한 의뢰」 칸에 받기 단추 · 85레벨 2차 전직 뒤엔 3차 전직 의뢰 · 점검 중엔 다른 시험을 가리지 않음',()=>{
  const tick=()=>{QN21.t=0;qnTick21(.016)};QN21.qa=true;try{
  qPrep('mage',{lvl:49});P.job2=null;QN21.seen.clear();qnClose21();tick();qOk(!QN21.ids.includes('j2m1')&&!qImpList21().some(q=>q.id==='j2m1'),`49레벨에 2차 카드 ${QN21.ids}`);qnClose21();
  P.lvl=50;tick();const el=$('#qn21');qOk(el&&/위계 너머의 자격/.test(el.textContent),'50레벨 카드 없음');qOk(QN21.ids.includes('j2m1'),`카드 의뢰 ${QN21.ids}`);
  qOk(sqHudBlocks()[0].t.includes('위계 너머의 자격'),'알림판 맨 위 아님');SQV.mode='log';const lh=sqLogHtml();qOk(/중요한 의뢰/.test(lh)&&/data-sqacc="j2m1"/.test(lh),'의뢰 일지에 받기 없음');
  const w=el.getBoundingClientRect().width;qOk(w<=innerWidth-20,`카드 너비 ${Math.round(w)}`);
  el.querySelector('[data-qn="acc"][data-id="j2m1"]').click();qOk(sqState().a.j2m1,'받기를 눌러도 안 받아짐');qOk(!$('#qn21'),'받은 뒤에도 카드');tick();qOk(!$('#qn21'),'다시 뜸');
  qOk(!qImpList21().some(q=>q.id==='j2m1'),'받은 뒤에도 목록');
  qPrep('mage',{lvl:85});P.job2='archmage';QN21.seen.clear();qnClose21();tick();qOk($('#qn21')&&QN21.ids.includes('j3m0'),`85레벨 3차 카드 ${QN21.ids}`);
  $('#qn21 [data-qn="later"]').click();qOk(!$('#qn21'),'나중에');tick();qOk(!$('#qn21'),'나중에 뒤 바로 다시 뜸');qOk(qImpList21().some(q=>q.id==='j3m0'),'나중에 뒤 목록에서 사라짐');
  qPrep('mage',{lvl:50});P.job2=null;QN21.seen.clear();qnClose21();{const L=SQ.filter(q=>qImp21(q)&&!q.pick&&!q.pick3).slice(0,5);qnShow21(L);qOk(L.length===5&&QN21.ids.length===2&&!QN21.ids.some(id=>SQBY[id].kind==='위계 시험'&&L.some(q=>q.kind!=='위계 시험'&&!QN21.ids.includes(q.id)))&&/그 밖에 받을 수 있는 중요한 의뢰 3개/.test($('#qn21').textContent),`여러 개면 두 개만 ${L.length}/${QN21.ids}`)}
  qnClose21();QN21.seen.clear();const dg0=DG;DG={id:1,ret:{x:P.x,y:P.y}};try{tick();qOk(!$('#qn21'),'던전 안에서 카드')}finally{DG=dg0}tick();qOk($('#qn21'),'던전에서 나온 뒤 카드 없음');qnClose21();
  QN21.qa=false;QN21.seen.clear();tick();qOk(!$('#qn21'),'점검 중 다른 시험에 카드가 뜸')}finally{QN21.qa=false;qnClose21();SQV.mode=null}
  return '50 → 2차 카드 · 받기 · 85 → 3차 카드 · 나중에'});
qT('성장','경험치 v21(사용자 04:10): 1~10레벨은 그대로 · 10 뒤로 필요한 경험치가 늘고 40레벨부터는 2.2배 · 몬스터 경험치는 그대로 · 예전 저장은 레벨이 안 내려가고 막대 비율이 그대로 · 저장에 xpc',()=>{
  for(let l=1;l<=10;l++)qOk(xpNeed(l)===xpNeedV20(l),'1~10 바뀜 '+l);
  for(const l of [15,20,25,30])qOk(xpNeed(l)>xpNeedV20(l)*1.1,'느려지지 않음 '+l);
  for(const l of [40,45,49,50,99,100,139])qOk(Math.abs(xpNeedV23(l)/xpNeedV20(l)-2.2)<.01,`${l}레벨 배수 ${(xpNeedV23(l)/xpNeedV20(l)).toFixed(2)}`);// v24: 그 위에 xpSlow24가 더 곱해짐(「보스 v24」 점검)
  for(let l=11;l<139;l++)qOk(xpSlow21(l+1)>=xpSlow21(l),'갑자기 줄어듦 '+l);
  qPrep('mage',{lvl:45});const d=saveData();qOk(d.xpc>=21,'저장에 xpc 없음');
  const old=Object.assign({},d);delete old.xpc;old.lvl=45;old.xp=Math.floor(xpNeedV20(45)*.6);load(old,0);qOk(P.lvl===45,'레벨 바뀜 '+P.lvl);
  const pc=P.xp/xpNeed(45);qOk(Math.abs(pc-.6)<.01,`막대 비율 ${pc.toFixed(3)}`);
  const nw=Object.assign({},d,{xp:1234});load(nw,0);qOk(P.xp===1234,'새 저장의 경험치가 또 바뀜 '+P.xp);
  const top=Object.assign({},d);delete top.xpc;top.lvl=45;top.xp=xpNeedV20(45)*5;load(top,0);qOk(P.lvl===45&&P.xp<xpNeed(45),'넘친 경험치 '+P.lvl+' '+P.xp);
  return `15:${xpSlow21(15).toFixed(2)} 20:${xpSlow21(20).toFixed(2)} 30:${xpSlow21(30)} 40+:${xpSlow21(40)}`});
/* ===== v21 MAZE: 변하는 미궁 「뒤엉킨 도시 오르타」 · 3막 「마르는 강」 (maze21.js · act3-21.js) ===== */
const QMZ='미궁·3막 v21';
const qMzPrep=(cls,lvl)=>{qPrep(cls||'mage',{lvl:lvl||140});P.invT=1e9;P.diff=0;MZ.qaDay='2026-10-09';P.maze=mzClean(null);P.q={i:QUESTS.length,st:0,c:{}};A3.woke.clear();return P};
const qMzEnd=()=>{MZ.qaDay=null;if(DG)leaveDungeon();if(REG.id!=='home')loadRegion('home');qClosePanels()};
const qKillE=e=>{for(let i=0;i<40&&!e.dead;i++)hurtE(e,e.max+10,{cls:P.cls,el:'arcane',proc:1})};
const qMzTagged=()=>enemies.filter(e=>e.mzT===DG.a21.tag&&!e.dead);
const qMzRuleFloor=(id,fmax)=>{for(let d=0;d<120;d++){const day=v20Day(Date.UTC(2026,0,1)+d*864e5);for(let f=1;f<=(fmax||9);f++){if(f%5===0)continue;if(mzRules(day,f).includes(id))return{day,f}}}return null};
const qA3State=(upto)=>{const s=sqState();s.a={};s.d={};s.ch={};for(const id of A3_ORDER){if(!upto||id===upto)break;s.d[id]=1}return s};
const qA3Cap=e=>{const t=TYPES[e.k],B=FIELD_BUDGET,L=e.lvl,hp=40+12*L+4*(10+1.5*(L-1)),role=t.boss?'boss':t.mini?'mini':t.ranged?'ranged':t.spd>=150?'fast':(t.spd<=80||t.r>=22)?'heavy':'melee';return B[role]*hp*(1+Math.max(0,L-B.growFrom)*B.grow)*(e.elite?1.4:1)};
qT(QMZ,'오르타 ① 같은 날 · 같은 층은 같은 모양(방 · 골목 규칙 · 몬스터) · 층이나 날이 바뀌면 다름',()=>{qMzPrep();
  try{const sig=()=>[Array.from(DG.g).join(''),JSON.stringify(DG.rooms),DG.a21.rules.join(),qMzTagged().map(e=>e.k).sort().join()].join('|');
    mzFloor(7);const a=sig();leaveDungeon();mzFloor(7);const b=sig();leaveDungeon();qOk(a===b,'같은 날 같은 층인데 다름');
    mzFloor(8);const c=sig();leaveDungeon();qOk(c!==a,'다른 층인데 같음');MZ.qaDay='2026-10-10';mzFloor(7);const d=sig();leaveDungeon();qOk(d!==a,'다른 날인데 같음');
    qOk(mzRules('2026-10-09',10).length===2&&mzRules('2026-10-09',7).length===1,'10층마다 규칙 둘');return '씨앗 같음/다름'}finally{qMzEnd()}});
qT(QMZ,'오르타 ② 층 레벨 = 49+층 · 난이도와 상관없이 고정(레벨 덧셈 · 생명력 배수 없음) · 3막 던전 7곳도 고정',()=>{const out=[];
  try{for(const f of [1,30,91]){const mx=[];for(const diff of [0,2]){qMzPrep();P.diff=diff;mzFloor(f);qOk(DG.lvl===49+f,`${f}층 레벨 ${DG.lvl}`);const T0=qMzTagged();qOk(T0.length>0,'몬스터 없음');
        qOk(T0.every(e=>e.lvl>=49+f&&e.lvl<=51+f),`${f}층 몬스터 레벨 ${T0.map(e=>e.lvl)}`);mx.push(T0.map(e=>e.max).sort((a,b)=>a-b).join());leaveDungeon()}
      qOk(mx[0]===mx[1],`${f}층 난이도에 따라 생명력이 다름`);out.push(`${f}층 Lv${49+f}`)}
    for(const D of A3_DG){const bm=[];for(const diff of [0,2]){qMzPrep('mage',100);qA3State('a3q15');sqState().a.a3q15={c:{},got:[]};P.diff=diff;QA.reseed(77);qOk(a3Enter(D.id),D.id+' 못 들어감');qOk(DG.lvl===D.lvl,`${D.id} 레벨 ${DG.lvl}`);
        const b=DG.boss||enemies.find(e=>TYPES[e.k].mini);qOk(b&&b.lvl<=D.lvl+2&&b.lvl>=D.lvl+1,`${D.id} 보스 레벨`);bm.push(b.max);leaveDungeon()}
      qOk(bm[0]===bm[1],`${D.id} 난이도에 따라 보스 생명력 ${bm}`)}out.push('3막 7곳+위층')}finally{qMzEnd()}return out.join(' · ')});
qT(QMZ,'오르타 ③ 80% 처치 전에는 다음 층 짝문 잠김 → 열리면 F로 다음 층 · 층 상자 · 열쇠',()=>{qMzPrep();
  try{mzFloor(3);const a=DG.a21,keys=P.maze.keys;qOk(a.need===Math.ceil(a.total*.8),`필요 ${a.need}/${a.total}`);let L=qMzTagged();
    while(a.total-qMzTagged().length<a.need-1){killE(qMzTagged()[0]);qStep(1,{render:false})}qStep(3,{render:false});qOk(!a.open&&!DG.portals.some(p=>p.dm21==='mzn'),'80% 전에 열림');
    qOk(!String(qActAt(a.door.x,a.door.y)).startsWith('dm21:mzn'),'잠긴 문에 act');render();
    killE(qMzTagged()[0]);qStep(3,{render:false});qOk(a.open,'80%인데 안 열림');const pi=DG.portals.findIndex(p=>p.dm21==='mzn');qOk(pi>=0,'짝문 없음');
    qOk(P.maze.keys>keys&&P.maze.best===3,`열쇠 ${P.maze.keys} 최고 ${P.maze.best}`);qOk(loot.some(l=>l.kind==='item'),'층 상자 없음');
    const p=DG.portals[pi];qOk(qActAt(p.x,p.y)===`dm21:mzn:${pi}`,'짝문 act '+act);qOk(twActLabel(act).includes('4층'),'라벨 '+twActLabel(act));doAct();qOk(DG&&DG.a21.f===4&&DG.lvl===53,'다음 층 아님');void L;return `${a.need}/${a.total} → 4층`}finally{qMzEnd()}});
qT(QMZ,'오르타 ④ 5층마다 발판: 5층을 깨면 오늘은 6층부터 · ⑤ 날이 바뀌면 (최고−10) 5단위 내림 +1층부터',()=>{qMzPrep();
  try{mzFloor(5);const a=DG.a21;qOk(a.bossF===1&&qMzTagged().some(e=>TYPES[e.k].mini),'5층 준보스 없음');for(const e of qMzTagged())killE(e);qStep(3,{render:false});qOk(a.open,'안 열림');
    qOk(P.maze.step===6&&P.maze.day===MZ.qaDay&&mzStartFloor()===6,`발판 ${P.maze.step} 시작 ${mzStartFloor()}`);qOk(mzStartList().includes(6)&&mzStartList().includes(1),'입장 목록 '+mzStartList());leaveDungeon();
    qOk(mzEnter(6)&&DG.a21.f===6,'6층으로 못 들어감');leaveDungeon();qOk(!mzEnter(11)&&!DG,'11층으로 들어감');
    P.maze=mzClean({best:37,day:'2026-10-09',step:36});qOk(mzStartFloor()===36,'같은 날 발판 '+mzStartFloor());MZ.qaDay='2026-10-10';qOk(mzStartFloor()===26,'다음 날 '+mzStartFloor());
    qOk(mazeStart(0)===1&&mazeStart(12)===1&&mazeStart(15)===6&&mazeStart(91)===81,'mazeStart');P.lvl=49;qOk(!mzEnter(1),'49레벨 입장');return '발판 6 · 다음 날 26'}finally{qMzEnd()}});
qT(QMZ,'오르타 ⑥ 저장: P.maze 기본값(없는 옛 저장 · 저장에 안 씀) · 왕복 · 모르는 칸 보존 · 엉터리 값 다듬기 · 망토 겉모습',()=>{qMzPrep();
  try{let d=saveData();qOk(!('maze' in d),'빈 값을 씀');P.maze={best:23,day:'2026-10-09',step:21,keys:40,cape:1,capeOn:1,got:[10,20],zz:{k:1}};d=saveData();qOk(d.maze&&d.maze.best===23&&d.maze.zz.k===1,'저장 '+JSON.stringify(d.maze));
    qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT),'load');qOk(P.maze.best===23&&P.maze.keys===40&&P.maze.got.join()==='10,20'&&P.maze.zz.k===1&&P.maze.capeOn===1,'불러오기 '+JSON.stringify(P.maze));
    qOk(heroLook(P).key.includes('mzc'),'망토 겉모습 안 바뀜');P.maze.capeOn=0;qOk(!heroLook(P).key.includes('mzc'),'벗어도 그대로');
    d=saveData();delete d.maze;qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT),'load2');qOk(P.maze.best===0&&P.maze.keys===0&&Array.isArray(P.maze.got)&&!P.maze.cape,'기본값 '+JSON.stringify(P.maze));
    const c=mzClean({best:'x',keys:-5,step:1e9,got:[10,'a',-1,10,2000],day:{}});qOk(c.best===0&&c.keys===0&&c.step===999&&c.got.join()==='10'&&c.day==='','다듬기 '+JSON.stringify(c));return '왕복 · 기본값'}finally{qMzEnd()}});
qT(QMZ,'오르타 ⑦ 10층 보스: 보스가 살아 있으면 잠김 · 쓰러지면 짝문 + 상자 + 열쇠 +3 + 첫 칭호 · 나가는 문으로 나오면 짝문 앞',()=>{qMzPrep();
  try{mzFloor(10);const a=DG.a21,b=qMzTagged().find(e=>TYPES[e.k].boss||TYPES[e.k].mini);qOk(b&&MAZE_BOSSES.includes(b.k),'보스 없음');const k0=P.maze.keys;
    for(const e of qMzTagged())if(e!==b)killE(e);qStep(3,{render:false});qOk(a.kills>=a.need&&!a.open,'보스가 살아 있는데 열림');
    qKillE(b);qStep(3,{render:false});qOk(b.dead,'보스가 안 쓰러짐');qOk(a.open&&DG.portals.some(p=>p.dm21==='mzn'),'안 열림');
    qOk(P.maze.keys-k0>=3,'열쇠 '+(P.maze.keys-k0));qOk(P.maze.got.includes(10)&&V20.titles.find(t=>t.id==='mz10').have(),'첫 칭호');qOk(loot.filter(l=>l.kind==='item').length>=2,'상자');
    const ex=DG.portals.find(p=>p.exit);qOk(qActAt(ex.x,ex.y)==='exit','나가는 문 act '+act);doAct();qOk(!DG&&REG.id==='home'&&Math.hypot(P.x-MZ.gate.x,P.y-MZ.gate.y)<120,'나온 자리');return TYPES[b.k].n}finally{qMzEnd()}});
qT(QMZ,'오르타 골목 규칙 12가지: 짝문 이동 · 바뀌는 이음새 · 메아리 · 마른 우물 · 무거운 공기 · 장날 · 외길 · 비친 골목 · 깨어난 룬 · 침묵의 골목 · 급한 골목 · 꺼진 등불(그리기)',()=>{const out=[];
  try{const go=id=>{qMzPrep();const h=qMzRuleFloor(id);qOk(h,id+' 날 없음');MZ.qaDay=h.day;mzFloor(h.f);qOk(DG.a21.rules.includes(id),id+' 규칙');return DG.a21};
    {const a=go('pairdoor');const ps=DG.portals.filter(p=>p.dm21==='pair');qOk(ps.length>=2,'짝문 '+ps.length);const i=DG.portals.indexOf(ps[0]);qOk(qActAt(ps[0].x,ps[0].y)===`dm21:pair:${i}`,'짝문 act');doAct();const to=ps.find(p=>p.pn===mzPairTo(0));qOk(Math.hypot(P.x-to.x,P.y-to.y)<120,'짝문 이동');out.push('짝문');void a}
    {const a=go('shift');const j0=mzPairTo(0);qStep(31*60,{render:false,each:()=>{P.hp=maxHp()}});qOk(a._sh===1&&mzPairTo(0)!==j0,'30초 뒤 이음새');out.push('이음새')}
    {const a=go('echo');QA.reseed(5);for(const e of qMzTagged())killE(e);qOk(a._echo.length>0,'메아리 예약 없음');qStep(150,{render:false});const r=enemies.filter(e=>e.mzEc&&!e.dead);qOk(r.length>0&&r.every(e=>e.hp<=Math.ceil(e.max*.3)+1),'메아리 '+r.length);out.push('메아리')}
    {go('drain');qStep(2,{render:false});qOk(P.buffs._mz&&P.buffs._mz.regen<0,'마른 우물');out.push('마른 우물')}
    {const a=go('heavy');qStep(2,{render:false});qOk(P.buffs._mz&&P.buffs._mz.cdr===-.15,'무거운 공기 재사용');const e=qMzTagged().find(e=>!e.elite&&!e.mirror&&!TYPES[e.k].boss&&!TYPES[e.k].mini);const base=clamp(TYPES[e.k].hp,220,900)*(1+.34*(e.lvl-1));qOk(Math.abs(e.max-Math.round(Math.round(base)*.85))<=2,'생명력 −15% '+e.max);void a;out.push('무거운 공기')}
    {const a=go('crowd');qOk(a.total>=8,'장날 수 '+a.total);out.push('장날 '+a.total)}
    {go('lone');qOk(qMzTagged().filter(e=>e.elite).length>=DG.rooms.length-1,'외길 정예');out.push('외길')}
    {go('mirror');const m=enemies.find(e=>e.mirror);qOk(m&&m.v20n.includes('거울'),'비친 골목');out.push('비친 골목')}
    {const a=go('rune');qStep(2,{render:false});qOk(a.runes&&a.runes.length===3,'룬 '+(a.runes&&a.runes.length));const r=a.runes[0];P.x=r.x;P.y=r.y;qOk(mzOnRune(),'룬 위');const r0=JSON.stringify(a.runes);qStep(11*60,{render:false,each:()=>{P.hp=maxHp()}});qOk(JSON.stringify(a.runes)!==r0,'10초 뒤 안 옮김');out.push('룬')}
    {go('quiet');const id=Object.keys(SPELLS).find(k=>castTimeOf(k)>2&&(!SPELLS[k].cls||SPELLS[k].cls===P.cls)&&!(typeof CHAN==='object'&&CHAN[k]));if(id){qClear();P.sk[id]=Math.max(1,P.sk[id]|0);qMana(id);P.cd[id]=0;P.mp=maxMp();qRecWait();const ct=castTimeOf(id);tryCast(id,{x:P.x+200,y:P.y});qOk(CAST.cur&&CAST.cur.id===id&&Math.abs(CAST.cur.max-Math.round(ct*.8*100)/100)<.02,`시전 −20% ${id} ${CAST.cur&&CAST.cur.max}/${ct}`);castReset()}out.push('침묵'+(id?'':' (긴 시전 없음)'))}
    {go('swift');qStep(30,{render:false,each:()=>{P.hp=maxHp()}});out.push('급한 골목')}
    {go('dark');qStep(2,{render:true});qOk(SC.map.has('mz/dark'),'어둠 그림');out.push('꺼진 등불')}}finally{castReset();qMzEnd()}return out.join(' · ')});
qT(QMZ,'오르타 입구 · 네라 · 열쇠 상점: F로 길잡이 조합 창 · 다시 굴리기(한 줄만 · +모든 스킬 없음) · 상자 · 망각 · 물약 · 망토 · 휴대폰 폭 390',()=>{qMzPrep();
  try{qOk(MZ.gate&&decor.includes(MZ.gate),'입구 없음');const ok=TRCH.home||(TRCH.home=terrReach('home'));qOk(wxCanReach(ok,MZ.gate.x,MZ.gate.y),'입구에 못 닿음');
    qOk(TW.folk.some(f=>f.id==='nera'),'네라 없음');const ne=TW.folk.find(f=>f.id==='nera');qOk(!TW.folk.some(f=>f!==ne&&f.town===ne.town&&Math.hypot(f.hx-ne.hx,f.hy-ne.hy)<30),'네라가 다른 사람과 겹침');
    P.x=MZ.gate.x;P.y=MZ.gate.y+30;qStep(2,{render:false});qOk(act==='tw_use'&&TW.act===MZ.gate,'입구 act '+act);doAct();qOk(!panel.hidden&&$('#ptitle').textContent.includes('길잡이'),'창 안 열림');
    P.maze.keys=200;const it={id:uid++,slot:'robe',rar:2,name:'시험 옷',il:100,stats:{int:10,hp:50,all:1,tr_fire:1}};P.bag.push(it);V20A.mzbuy('reroll');renderPanel();qOk(pbody.innerHTML.includes('다시 굴릴 희귀 장비'),'고르기 칸');
    const before=JSON.stringify(it.stats);qClick(`#pbody [data-v20a="mzroll"][data-v20b="${it.id}"]`);const af=it.stats;qOk(JSON.stringify(af)!==before&&af.all===1&&af.tr_fire===1&&Object.keys(af).length===4,'다시 굴리기 '+JSON.stringify(af));qOk(P.maze.keys===194,'열쇠 '+P.maze.keys);
    const nb=P.bag.length;V20A.mzbuy('box');qOk(P.bag.length===nb+1,'상자');V20A.mzbuy('pots');V20A.mzbuy('cape');qOk(P.maze.cape&&heroLook(P).key.includes('mzc'),'망토');P.sp=0;P.sk.firebolt=3;V20A.mzbuy('forget');qOk(P.maze.keys===200-6-12-3-20-8,'열쇠 계산 '+P.maze.keys);
    renderPanel();const card=panel.querySelector('.card'),sw=card.style.width,sm=card.style.maxWidth;card.style.width='358px';card.style.maxWidth='358px';
    try{renderPanel();const cr=card.getBoundingClientRect();qOk(pbody.scrollWidth<=pbody.clientWidth+2,`가로 넘침 ${pbody.scrollWidth}/${pbody.clientWidth}`);const bad=[...pbody.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&(r.right>cr.right+1||r.left<cr.left-1)});qOk(!bad.length,'밖 단추 '+bad.length)}
    finally{card.style.width=sw;card.style.maxWidth=sm}qClosePanels();P.lvl=60;V20A.mzgo('1');qOk(DG&&DG.a21.f===1,'창에서 1층');return '창 · 상점 · 390'}finally{qMzEnd()}});
qT(QMZ,'3막 ① 2막을 끝낸 저장은 엘리안에게 바로 「문틀이 마른 까닭」(주황 ! · 메인 표) · 2막 전에는 숨김 · 레벨 부족은 낮음',()=>{qMzPrep('priest',62);
  try{P.q={i:QUESTS.length-1,st:0,c:{}};qA3State();const q=SQBY.a3q1,el=sqFolk('elian');qOk(el,'엘리안 없음');qOk(sqAvail(q)==='hidden','2막 전에 보임 '+sqAvail(q));qOk(!a3MarkOf(el),'2막 전 표시');
    P.q={i:QUESTS.length,st:0,c:{}};qOk(sqAvail(q)==='ok','2막 뒤 '+sqAvail(q));qOk(a3MarkOf(el)==='!'&&sqMark(el)==='!','! 표시');P.lvl=50;qOk(sqAvail(q)==='low','낮은 레벨 '+sqAvail(q));P.lvl=62;
    qOk(sqTalk(el),'대화 창 없음');qOk(pbody.innerHTML.includes(WXTAG.m+q.t)&&pbody.innerHTML.includes('data-sqacc="a3q1"'),'의뢰 창 메인 표');qClick('#pbody [data-sqacc="a3q1"]');qClosePanels();
    const hb=sqHudBlocks().filter(b=>!(b.side&&b.t.startsWith('! ')));qOk(hb[0]&&hb[0].t.includes(WXTAG.m)&&hb[0].t.includes(q.t)&&hb[0].main,'알림판 맨 위 메인 '+(hb[0]&&hb[0].t));qOk(sqLogHtml().includes('3막 「마르는 강」'),'일지');
    const tg=sqTarget(q);qOk(tg&&tg.label.includes('오스윈'),'첫 목표 오스윈 '+JSON.stringify(tg));qOk(!a3Open('a3_archive'),'열쇠 전에 열림');sqTalk(sqFolk('oswin'));qClosePanels();qOk(sqGoalDone(q,0)&&a3Open('a3_archive'),'열쇠 뒤 안 열림');
    const t2=sqTarget(q),g=DM21G.a3_archive;qOk(t2&&t2.x===g.d.x&&t2.y===g.d.y&&t2.reg==='royal'/* v26 왕도 성안 */,'서고 문 목표 '+JSON.stringify(t2));
    const mk=sqMarks(false).find(k=>k.kind==='ring'&&k.label&&k.label.includes(q.t));qOk(mk&&mk.col===WX_QCOL.main,'미니맵 고리 주황');return '받음 · 메인 표 · 서고 열림'}finally{qMzEnd()}});
qT(QMZ,'3막 봉인된 문 6곳: 마을 둘레 · 걸어서 닿음 · 물 · 건물 · 동굴 · 포탈과 떨어짐 · F로 열림(닫히면 안내만) · 나오면 문 앞',()=>{const out=[];
  try{for(const D of A3_DG){if(D.via){qOk(!DM21G[D.id],D.id+' 문이 있음');continue}const g=DM21G[D.id];qOk(g&&g.d,D.id+' 문 없음');const T=ALLTOWNS.find(t=>t.id===D.town);qOk(T&&(T.reg||'home')===g.reg,D.id+' 지역');
      qMzPrep('mage',100);qA3State();if(g.reg==='home')loadRegion('home');else qWxTo(g.reg);const ok=TRCH[g.reg]||(TRCH[g.reg]=terrReach(g.reg));qOk(wxCanReach(ok,g.d.x,g.d.y),D.id+' 못 닿음');
      const dd=Math.hypot(T.x-g.d.x,T.y-g.d.y);qOk(dd>SAFE&&dd<SAFE+1500,`${D.id} 마을과 거리 ${Math.round(dd)}`);
      qOk(!decor.some(o=>o!==g.d&&(o.k==='cave'||o.k==='edgeportal'||(o.use&&o.dm21g))&&Math.hypot(o.x-g.d.x,o.y-g.d.y)<300),D.id+' 다른 입구와 가까움');qOk(!(liqAt(g.d.x,g.d.y)>.05),D.id+' 물 위');
      P.x=g.d.x;P.y=g.d.y+30;qStep(2,{render:false});qOk(act==='tw_use'&&TW.act===g.d,D.id+' act '+act);qOk(twActLabel(act).includes('봉인된 문'),'닫힌 라벨 '+twActLabel(act));doAct();qOk(!DG,D.id+' 닫혔는데 들어감');
      const s=sqState();s.a[D.q]={c:{g0:1},got:[]};qStep(1,{render:false});qOk(a3Open(D.id)&&twActLabel(act).includes(D.n),'열린 라벨 '+twActLabel(act));doAct();qOk(DG&&DG.a21&&DG.a21.id===D.id,D.id+' 못 들어감');render();
      const ex=DG.portals.find(p=>p.exit);qOk(qActAt(ex.x,ex.y)==='exit','나가는 문');doAct();qOk(!DG&&Math.hypot(P.x-g.d.x,P.y-g.d.y-80)<5,D.id+' 나온 자리');out.push(D.n)}}finally{qMzEnd()}return out.join(' · ')});
qT(QMZ,'3막 ③ 멈춘 폭포 아래는 서리 고개 끝(파수꾼)에서만 · 침묵의 탑 위층은 1층 끝(아홉째 기둥)에서만 · 견습생 셋 깨우기',()=>{qMzPrep('archer',80);const out=[];
  try{qA3State('a3q5');sqState().a.a3q5={c:{},got:[]};for(const [id,to] of [['a3_pass','a3_falls'],['a3_tower','a3_tower2']]){if(DG)leaveDungeon();qOk(a3Enter(id),id);const a=DG.a21,m=a._nextE;qOk(m&&TYPES[m.k].mini,'끝 준보스');
      qStep(2,{render:false});qOk(!DG.portals.some(p=>p.dm21==='a3n'),'준보스 전에 길');qKillE(m);qStep(2,{render:false});const pi=DG.portals.findIndex(p=>p.dm21==='a3n');qOk(pi>=0,'길 안 열림');
      const p=DG.portals[pi],ret=Object.assign({},DG.ret);qOk(qActAt(p.x,p.y)===`dm21:a3n:${pi}`,'act '+act);doAct();qOk(DG.a21.id===to&&DG.ret.x===ret.x&&DG.ret.y===ret.y,to+' 아님');out.push(`${A3_DGBY[id].n}→${A3_DGBY[to].n}`)}
    leaveDungeon();a3Enter('a3_falls');const sp=DG.a21.spots;qOk(sp&&sp.length===3,'견습생 자리');const q=SQBY.a3q5;
    sp.forEach((s,i)=>{P.x=s.x+20;P.y=s.y+20;qStep(1,{render:false});qOk(act===`dm21:use:${i}`,'견습생 act '+act);qOk(twActLabel(act).includes('깨우기'),'라벨');doAct();qOk(sqGoalDone(q,i),`${i+1}째 안 셈`)});render();
    P.x=sp[0].x;P.y=sp[0].y;qStep(1,{render:false});qOk(act!=='dm21:use:0','깨운 뒤에도 act');out.push('견습생 셋');return out.join(' · ')}finally{qMzEnd()}});
qT(QMZ,'3막 의뢰 16개 처음부터 끝까지 (4장 엘프 먼저 · 드워프 먼저 둘 다): 대화 · 처치 · 깨우기 · 고르기 단추 · a3q12는 두 길 모두 · 목표 자리가 늘 있음 · 끝말이 3차 전직으로 이어짐',()=>{const out=[];
  try{for(const first of ['a','b']){qMzPrep('warrior',96);qA3State();P.job3=null;const ap0=P.ap|0,s=sqState();let n=0;
      const finish=q=>{const tf=sqFolk(sqTurn(q));qOk(tf,q.id+' 받는 사람');qOk(sqTalk(tf),q.id+' 보고 창 없음');if(q.id==='a3q10'){qOk(!pbody.innerHTML.includes('data-sqdone="a3q10"')&&pbody.querySelectorAll('[data-v20a="a3pick"]').length===2,'고르기 단추');qClick(`#pbody [data-v20a="a3pick"][data-v20b="${first}"]`)}else qClick(`#pbody [data-sqdone="${q.id}"]`);qClosePanels();qOk(s.d[q.id]>0,q.id+' 안 끝남')};
      for(let step=0;step<40&&!(s.d.a3q15>0);step++){const q=sqAvail(SQBY.a3q12)==='ok'?SQBY.a3q12:A3_QUESTS.find(o=>sqAvail(o)==='ok');qOk(q,'받을 의뢰 없음 '+JSON.stringify(s.d));
        if(q.id==='a3q11a'||q.id==='a3q11b')qOk(q.pick===(s.d.a3q11a||s.d.a3q11b?(first==='a'?'b':'a'):first),`${first} 먼저인데 ${q.id}`);
        const gv=sqFolk(q.giver);qOk(sqTalk(gv)&&pbody.innerHTML.includes(`data-sqacc="${q.id}"`),q.id+' 받기 단추');qClick(`#pbody [data-sqacc="${q.id}"]`);qClosePanels();qOk(s.a[q.id],q.id+' 못 받음');
        if(q.id==='a3q12'){qOk(!sqAllDone(q),'한 길만 했는데 a3q12 끝');const o=A3_QUESTS.find(x=>(x.id==='a3q11a'||x.id==='a3q11b')&&sqAvail(x)==='ok');qOk(o,'다른 길 안 열림');
          qOk(sqTarget(q)&&sqTarget(q).label.includes(sqFolk(o.giver).n),'a3q12 목표 '+JSON.stringify(sqTarget(q)));sqTalk(sqFolk(o.giver));qClick(`#pbody [data-sqacc="${o.id}"]`);qClosePanels();
          o.goals.forEach((g,j)=>{for(let k=0;k<200&&!sqGoalDone(o,j);k++)questKill({k:g.k[0],x:P.x,y:P.y,r:20})});finish(o);qOk(sqAllDone(q),'두 길 다 했는데 a3q12 안 끝남');finish(q);n+=2;continue}
        q.goals.forEach((g,j)=>{if(sqGoalDone(q,j))return;const tg=sqTarget(q);qOk(tg&&tg.reg&&qNum(tg.x),`${q.id} 목표${j} 자리 없음`);
          if(g.type==='talk'){sqTalk(sqFolk(g.npc));qClosePanels()}
          else if(g.type==='kill'){const D=A3_MOBDG[g.k[0]],G=D&&DM21G[(D.via||D.id)];qOk(G&&tg.x===G.d.x,`${q.id} 문 목표 아님`);qOk(a3Open(D.via||D.id),`${q.id} 문이 닫힘 ${D.id}`);for(let k=0;k<200&&!sqGoalDone(q,j);k++)questKill({k:g.k[0],x:P.x,y:P.y,r:20})}
          else if(g.type==='use'){if(!DG||DG.a21.id!=='a3_falls')a3Enter('a3_falls');const i=DG.a21.spots.findIndex(x=>x.use===g.use);DM21ACT.use.go(i)}
          qOk(sqGoalDone(q,j),`${q.id} 목표${j} 못 함`)});if(DG)leaveDungeon();finish(q);n++}
      qOk(s.d.a3q15>0&&s.ch.a3q10===first,'끝까지 못 감');qOk(P.ap-ap0>=5,'능력치 점수');qOk(V20.titles.find(t=>t.id==='a3ash').have(),'칭호');qOk(SQBY.a3q15.done.includes('재로 쓴 이름'),'3차 전직 이어 주기');
      P.job3='x';qOk(!SQBY.a3q15.done.includes('85레벨')&&SQBY.a3q15.done.includes('이미'),'3차 뒤 맺음말');P.job3=null;qOk(!A3_QUESTS.some(o=>sqAvail(o)==='ok'),'끝난 뒤 남은 의뢰');out.push(`${first} 먼저 ${n}개`)}}finally{qMzEnd()}return out.join(' · ')});
qT(QMZ,'3막 ④ 4장: 고른 길이 먼저 열리고 다른 길은 그 뒤 · a3q12는 어느 쪽이 먼저든 둘 다 요구 · 고른 길은 P.sq.ch에 남고 sqClean이 지킴',()=>{qMzPrep('mage',90);
  try{for(const c of ['a','b']){const s=qA3State('a3q11a');s.ch={a3q10:c};const mine=c==='a'?'a3q11a':'a3q11b',other=c==='a'?'a3q11b':'a3q11a';qOk(sqAvail(SQBY[mine])==='ok'&&sqAvail(SQBY[other])==='locked',`${c}: ${sqAvail(SQBY[mine])}/${sqAvail(SQBY[other])}`);
      qOk(sqAvail(SQBY.a3q12)==='locked','a3q12 먼저 열림');s.d[mine]=1;qOk(sqAvail(SQBY[other])==='ok'&&sqAvail(SQBY.a3q12)==='ok','첫 길 뒤');sqAccept('a3q12');qOk(!sqAllDone(SQBY.a3q12),'한 길로 끝남');
      s.a[other]={c:{g0:1,g1:1},got:[]};sqFinish(other);qOk(sqAllDone(SQBY.a3q12),'두 길 뒤에도 안 끝남');
      const c2=sqClean(JSON.parse(JSON.stringify(P.sq)));qOk(c2.ch.a3q10===c&&c2.d[mine]===1,'sqClean ch '+JSON.stringify(c2.ch))}
    const d=saveData();qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT)&&P.sq.ch.a3q10==='b','저장 왕복 ch');return 'a · b'}finally{qMzEnd()}});
qT(QMZ,'3막 저장: 진행(P.sq) · 고른 길 왕복 · 3막 칸이 없는 옛(v20) 저장도 그대로 열림 · 2막을 끝낸 옛 저장은 바로 3막',()=>{qMzPrep('archer',70);
  try{const s=qA3State('a3q5');s.ch.a3q10='b';s.a.a3q5={c:{g0:1,g3:4},got:[]};const d=JSON.parse(JSON.stringify(saveData()));qOk(load(d,QA_SLOT),'load');const t=sqState();
    qOk(t.d.a3q4===1&&t.a.a3q5&&t.a.a3q5.c.g3===4&&t.ch.a3q10==='b','왕복 '+JSON.stringify(t));
    const old=JSON.parse(JSON.stringify(d));old.sq={a:{},d:{rw1:1},cd:{},hide:0};delete old.maze;old.q={i:QUESTS.length,st:0,c:{}};qOk(load(old,QA_SLOT),'옛 저장');qOk(sqAvail(SQBY.a3q1)==='ok'&&P.maze&&P.maze.best===0,'옛 저장에서 3막 '+sqAvail(SQBY.a3q1));
    old.q={i:3,st:1,c:{}};qOk(load(JSON.parse(JSON.stringify(old)),QA_SLOT)&&sqAvail(SQBY.a3q1)==='hidden','1막 저장에 3막');return '왕복 · 옛 저장'}finally{qMzEnd()}});
qT(QMZ,'3막 ⑤ 혼자 「재의 군주의 그림자」: 봉인의 메아리가 기둥 하나를 지켜 6초 서 있으면 10초 무방비(피해 +50%) · 놓치면 재로 된 몸 셋',()=>{qMzPrep('mage',96);
  try{qA3State('a3q15');sqState().a.a3q15={c:{},got:[]};qOk(a3Enter('a3_summit'),'못 들어감');const e=DG.boss;qOk(e&&e.k==='ab_ashname'&&DG.a21.pil,'보스 · 기둥');e.aggroed=true;e.atkCd=1e9;
    qStep(2,{render:false});const A=A3.ar;qOk(A&&A.echo===1,'혼자인데 메아리 없음');A.next=A.t;qStep(2,{render:false});qOk(A.lit,'기둥이 안 빛남');const p1=A.pil[1];
    qStep(7*60,{render:false,each:()=>{P.x=p1.x+60;P.y=p1.y+60;P.hp=maxHp();e.atkCd=1e9}});qOk(e.brk>0&&!A.lit,'무방비 안 걸림 '+e.brk);render();
    const k=V20.dmgAdd.reduce((s,f)=>s+(f(e,{cls:P.cls})||0),0);qOk(k>=.2-1e-9&&PTY.dmgMul(e,0)>1,'무방비 피해 '+k);
    qStep(31*60,{render:false,each:()=>{P.x=p1.x+60;P.y=p1.y+60;P.hp=maxHp();e.atkCd=1e9}});qOk(A.lit||A.t>=A.next,'다음 빛');const n0=enemies.filter(o=>o.k==='a3_ashbody'&&!o.dead).length;A.lit=1;A.win=.01;A.hold=0;
    qStep(6,{render:false,each:()=>{P.x=p1.x+600;P.y=p1.y+400;P.hp=maxHp()}});qOk(enemies.filter(o=>o.k==='a3_ashbody'&&!o.dead).length>n0,'놓쳐도 재로 된 몸이 안 나옴');return '메아리 · 무방비 · 놓침'}finally{qMzEnd()}});
qT(QMZ,'3막 ⑥ 같이 하기 「재의 군주의 그림자」: 3명이면 생명력 = 기본 ×(1+1.0×2) · 메아리 없음 · 둘이 두 기둥을 지키면 무방비 · 참가자는 a21 층을 받아 같은 모양 · a3a 상태',()=>{const out=[];
  try{qMzPrep('mage',96);qA3State('a3q15');sqState().a.a3q15={c:{},got:[]};a3Enter('a3_summit');qStep(1,{render:false});const solo=DG.boss.max;leaveDungeon();
    const {r,sent}=qPty(3,{host:true});a3Enter('a3_summit');for(const p of NET.peers.values()){p.area=netArea();p.seen=1}const e=DG.boss;qStep(1,{render:false});qOk(Math.abs(e.max-solo*3)<=3,`생명력 ${e.max} ≠ ${solo}×3`);out.push('×3');
    const dg=sent.filter(m=>m.t==='dg').pop();qOk(dg&&dg.d.a21&&dg.d.a21.k==='a3'&&dg.d.a21.pil&&!('_nextE' in dg.d.a21),'dg에 a21 없음');
    e.aggroed=true;e.atkCd=1e9;qStep(2,{render:false});const A=A3.ar;qOk(A&&A.echo===0,'파티인데 메아리');A.next=A.t;qStep(2,{render:false});const [p0,p1]=A.pil;
    qStep(7*60,{render:false,each:()=>{P.x=p1.x+50;P.y=p1.y+50;r.x=r.tx=p0.x+50;r.y=r.ty=p0.y+50;r.dead=false;r.area=netArea();P.hp=maxHp();e.atkCd=1e9}});qOk(e.brk>0,'둘이 지켰는데 무방비 아님');
    qOk(sent.some(m=>m.t==='v20x'&&m.k==='a3a'&&Array.isArray(m.h)),'a3a 안 보냄');out.push('두 기둥');
    // 참가자: 같은 dg를 받으면 같은 모양 · 기둥 상태 받기
    const g0=Array.from(DG.g).join(''),D=JSON.parse(JSON.stringify(dg.d));qPtyOff();qMzPrep('priest',96);qPty(2);NET.guest=true;NET.hostId='qa_peer';netEnterDg(D);qOk(DG&&DG.a21&&DG.a21.guest&&DG.a21.k==='a3'&&Array.from(DG.g).join('')===g0&&DG.ci===D.ci,'참가자 층');
    netOnMsg({t:'v20x',k:'a3a',from:'qa_peer',l:1,h:[1,0],hd:20,w:50,e:0});qOk(A3.ar&&A3.ar.lit===1&&A3.ar.pil[0].held===1&&A3.ar.hold===2,'참가자 기둥 상태');render();out.push('참가자');
    // 오르타도: 참가자는 그 층 · 규칙 그대로, 방장의 열림 알림으로 짝문
    qPtyOff();qMzPrep();const {sent:s2}=qPty(2,{host:true});mzFloor(12);const d2=s2.filter(m=>m.t==='dg').pop();qOk(d2&&d2.d.a21.k==='mz'&&d2.d.a21.f===12,'오르타 dg');const sig=Array.from(DG.g).join('');qPtyOff();
    qMzPrep();qPty(2);NET.guest=true;NET.hostId='qa_peer';netEnterDg(JSON.parse(JSON.stringify(d2.d)));qOk(DG&&DG.a21.f===12&&Array.from(DG.g).join('')===sig&&DG.d.n.includes('12층'),'참가자 오르타 층');
    netOnMsg({t:'v20x',k:'mzs',from:'qa_peer',f:12,kc:0,n:5,o:1});qOk(DG.a21.open&&DG.portals.some(p=>p.dm21==='mzn'),'참가자 짝문');const sent3=[];NET.ws={readyState:1,send:x=>sent3.push(JSON.parse(x))};
    const pi=DG.portals.findIndex(p=>p.dm21==='mzn');qActAt(DG.portals[pi].x,DG.portals[pi].y);doAct();qOk(sent3.some(m=>m.t==='v20x'&&m.k==='mzgo'&&m.f===12),'다음 층 부탁 안 보냄');out.push('오르타 참가자');return out.join(' · ')}finally{qPtyOff();qMzEnd()}});
qT(QMZ,'3막 ⑦ · 오르타: 모든 3막 몬스터와 오르타 몬스터의 한 대 피해 ≤ FIELD_BUDGET(+레벨당 1%, 준보스 28% · 보스 34%) · 생명력 숫자',()=>{const bad=[];let n=0;
  try{for(const D of A3_DG){qMzPrep('mage',100);a3Enter(D.id);for(const k of [...D.mobs,...D.minis,D.boss].filter(Boolean)){for(const el of [0,1]){const t=TYPES[k];if(el&&(t.boss||t.mini))continue;const L=t.boss?D.lvl+2:t.mini?D.lvl+1:D.lvl,e=dgMob(k,P.x+300,P.y,L,el?{elite:1}:null);n++;
        if(!(e.dmg<=qA3Cap(e)+1e-6))bad.push(`${D.id}/${k}${el?'(정예)':''} ${Math.round(e.dmg)}>${Math.round(qA3Cap(e))}`);if(!(e.max>0&&qNum(e.max)))bad.push(k+' 생명력')}}
      for(const e of enemies)if(e.dmg>qA3Cap(e)+1e-6)bad.push(`${D.id} 소환 ${e.k}`);leaveDungeon()}
    for(const f of [1,10,25,50,75,91]){qMzPrep();mzFloor(f);for(const e of enemies){n++;if(!(e.dmg<=qA3Cap(e)+1e-6)&&!e.mirror)bad.push(`${f}층 ${e.k} ${Math.round(e.dmg)}>${Math.round(qA3Cap(e))}`)}leaveDungeon()}
    for(const k of A3_KEYS){const t=TYPES[k];if(!(t.hp>0&&t.dmg>0&&MON[t.draw]))bad.push(k+' 그림/숫자');if(/[A-Za-z]{3,}/.test(t.n))bad.push(k+' 이름')}
    qOk(TYPES.ab_ashname.hp<=5000&&TYPES.ab_ashname.hp>=TYPES.b_elgaros.hp,'마지막 보스 생명력 '+TYPES.ab_ashname.hp);qOk(!bad.length,bad.slice(0,8).join(', '));return `${n}마리`}finally{qMzEnd()}});
qT(QMZ,'3막 보스 6마리: 혼자 쓰러뜨릴 수 있음(피해가 들어가고 쓰러짐) → 나가는 문 · 멈춘 폭포의 왕 느린 고리(이동 −40%) · 수문장 50% 보호막과 룬 기둥 · 원소 속성',()=>{const out=[];
  try{for(const D of A3_DG){if(!D.boss)continue;qMzPrep('mage',100);qA3State('a3q15');sqState().a.a3q15={c:{},got:[]};a3Enter(D.id);const e=DG.boss;qOk(e&&e.k===D.boss,D.id+' 보스 없음');e.aggroed=true;
      if(D.boss==='ab_stillking'){e.a3zT=0;P.x=e.x+100;P.y=e.y;qStep(40,{render:false,each:()=>{if(A3.zone){P.x=A3.zone.x+50;P.y=A3.zone.y}P.hp=maxHp()}});qOk(A3.zone&&P.buffs._a3&&P.buffs._a3.spd===-.4,'느린 고리 '+JSON.stringify(P.buffs._a3));qOk(spdMul()<1,'이동 안 느려짐');render();
        P.x=e.x+900;P.y=e.y;const z=A3.zone;P.x=z.x+z.r+200;P.y=z.y;qStep(2,{render:false});qOk(!P.buffs._a3||P.buffs._a3.spd>-.4,'밖에서도 느림')}
      if(D.boss==='ab_silencewarden'){e.hp=Math.floor(e.max*.45);qStep(2,{render:false});const g=enemies.filter(o=>o.guard===e&&!o.dead);qOk(e.gsh&&g.length===2,'보호막/기둥 '+g.length);for(const o of g)killE(o);qStep(2,{render:false});qOk(!e.gsh,'기둥을 깨도 보호막')}
      const h0=e.hp;hurtE(e,1000,{cls:P.cls,el:'arcane',proc:1});qOk(e.hp<h0,'피해가 안 들어감');qKillE(e);qStep(3,{render:false});qOk(e.dead&&DG.bossDead,D.id+' 안 쓰러짐');
      const ex=DG.portals.filter(p=>p.exit).pop();qOk(ex&&Math.hypot(ex.x-e.x,ex.y-e.y)<200,'보스 자리 나가는 문');qOk(qActAt(ex.x,ex.y)==='exit','act');doAct();qOk(!DG,'못 나감');out.push(TYPES[D.boss].n)}
    qOk(TYPES.ab_stillking.el==='ice'&&TYPES.ab_ashname.el==='fire'&&TYPES.am_rootmother.el==='earth','속성');if(typeof WX21_EL!=='undefined')qOk(WX21_EL.a3_frostfang==='ice','WX21_EL 줄');
    return out.join(' · ')}finally{qMzEnd()}});
qT(QMZ,'도감: 3막 몬스터 한 무리 · 나오는 던전 · 3막 그리기(봉인된 문 · 기둥 · 견습생 · 오르타 입구)가 구워 둔 그림',()=>{qMzPrep('mage',100);
  try{const G=cxGroups(),g=G.find(x=>x[0].includes('3막'));qOk(g&&A3_KEYS.every(k=>g[1].includes(k)),'도감 무리');qOk(G.filter(x=>x[1].includes('ab_ashname')).length===1,'두 번 나옴');
    const m=monInfo('a3_frostfang');qOk(m.where.some(w=>w.includes('서리 고개')),'나오는 곳 '+m.where);qOk(monInfo('ab_ashname').where.some(w=>w.includes('탑 꼭대기')),'보스 나오는 곳');
    if(REG.id!=='home')loadRegion('home');P.x=MZ.gate.x;P.y=MZ.gate.y+150;followCam();qStep(40,{render:true});qOk(SC.map.has('twp/mzgate/0'),'오르타 입구 그림');const g2=DM21G.a3_archive;qWxTo(g2.reg,g2.d.x,g2.d.y+150);qStep(40,{render:true});qOk([...SC.map.keys()].some(k=>k.startsWith('twp/a3gate/')),'봉인된 문 그림');
    qA3State('a3q15');sqState().a.a3q15={c:{},got:[]};a3Enter('a3_summit');const c=tc(A3_PIL[0][0],A3_PIL[0][1]);P.x=c.x+150;P.y=c.y+150;followCam();qStep(3,{render:true});qOk(SC.map.has('a3/pillar'),'기둥 그림');leaveDungeon();
    sqState().a.a3q5={c:{},got:[]};a3Enter('a3_falls');const s=DG.a21.spots[0];P.x=s.x+60;P.y=s.y+60;followCam();qStep(3,{render:true});qOk(SC.map.has('a3/ice'),'얼음 그림');return '도감 · 그림'}finally{qMzEnd()}});
/* ===== v21 BUILDS: 빌드 핵심 장비 (builds21.js · builds21q.js) — check-v21-builds.cjs 16가지 + 연결 자리 ===== */
const QB21='v21 빌드 핵심';
const qC21=(id,cls)=>makeCore21(id,120,cls);
function qC21Clear(){for(const s in P.gear)P.gear[s]=null;P.cd={};P.buffs={};C21.cycle={last:null,free:0};C21.sweepT=0;C21.aoe={id:null,t:-9,n:0}}
const qNear=(a,b)=>Math.abs(a-b)<1e-6;
qT(QB21,'+모든 스킬 상한 5 · 시간의 길 재사용 상한 .5/.5/.55/.6 · 원래 30초 넘는 기술은 .5 · 80% 장비여도 60%까지 · 3개면 3초 이하 기술 −10% · 3개면 마나 소모 −10% · 피해 강화 −8%(한 번만, v21 균형으로 −20→−8)',()=>{qPrep('mage',{lvl:120});
  P.sk.spark=10;const b0=bonusLv('spark');P.gear.amulet=QA_ITEM(990,'amulet',4,'시험',40,{all:7});qOk(bonusLv('spark')-b0===5,'+모든 스킬 7 → +'+(bonusLv('spark')-b0));qC21Clear();
  P.sk.meteor=10;P.sk.timestop=5;const cap=n=>{qC21Clear();for(const [s,id] of [['robe','c_stilltime'],['ring','c_cogring'],['amulet','c_sandglass']].slice(0,n))P.gear[s]=qC21(id);return core21Cap('meteor')};
  qOk(qNear(cap(0),.5)&&qNear(cap(1),.5)&&qNear(cap(2),.55)&&qNear(cap(3),.6),`상한 ${[0,1,2,3].map(cap)}`);qOk(qNear(core21Cap('timestop'),.5),'타임 스톱 상한');
  P.gear.staff=QA_ITEM(991,'staff',2,'시험 지팡이',40,{cdr:80});const cd=cdOf('meteor'),base=SPELLS.meteor.cd;qOk(qNear(cd,Math.max(.15,base*.4)),`메테오 ${base} → ${cd}`);qOk(qNear(cdOf('timestop'),SPELLS.timestop.cd*.5),'타임 스톱 50%까지만');
  P.gear.staff=null;const g=SPELLS.gust.cd,cq=cdOf('gust');qOk(qNear(cq,Math.max(.15,g*(1-Math.min(.6,.35+.1)))),`3초 이하 −10%: ${g} → ${cq}`);
  P.sk.meteor=10;const mc3=core21Mc('meteor'),c3=costAt('meteor',10);P.gear.robe=null;const mc2=core21Mc('meteor'),c2=costAt('meteor',10);qOk(qNear(mc3,.1)&&qNear(mc2,0)&&c3<c2,`시간 3개 마나 −10%: ${c2} → ${c3}`);P.gear.robe=qC21('c_stilltime');
  qOk(qNear(dmgMul(),.92),'피해 강화 '+dmgMul());qC21Clear();qOk(qNear(dmgMul(),1),'벗으면 그대로');return `상한 .5/.55/.6 · 메테오 ${cd.toFixed(2)}초 · 윈드 해머 ${cq.toFixed(2)}초`});
qT(QB21,'샘의 길 마나 소모 상한 40/52/65% · 고요한 수면의 홀은 냉기만 −30% · 집행자의 첫 낙인: 심판만 +25% · 다른 직업 핵심은 효과 없음',()=>{qPrep('mage',{lvl:120});qC21Clear();P.sk.blizzard=10;P.sk.firebolt=10;
  const full=costAt('blizzard',10),red=n=>{qC21Clear();P.gear.robe=QA_ITEM(992,'robe',2,'시험',40,{mcost:90});for(const [s,id] of [['ring','c_wellring'],['amulet','c_laketear'],['staff','c_stillwater']].slice(0,n))P.gear[s]=qC21(id);return costAt('blizzard',10)};
  const r0=red(0),r2=red(2),r3=red(3);qOk(Math.abs(r0/full-.6)<.03&&Math.abs(r2/full-.48)<.03&&Math.abs(r3/full-.35)<.03,`${full} → ${r0} · ${r2} · ${r3}`);
  qC21Clear();const fb0=costAt('firebolt',10),bz0=costAt('blizzard',10);P.gear.staff=qC21('c_stillwater');qOk(costAt('firebolt',10)===fb0&&costAt('blizzard',10)<bz0,'냉기만');
  qPrep('priest',{lvl:120});qC21Clear();P.sk.smite=10;P.sk.turnundead=10;const d0=dmgScale('smite',10),t0=dmgScale('turnundead',10);P.gear.staff=qC21('c_firstbrand');
  qOk(qNear(dmgScale('smite',10)-d0,.4)&&qNear(dmgScale('turnundead',10)-t0,.15),`심판 +${(dmgScale('smite',10)-d0).toFixed(2)} · 퇴마 +${(dmgScale('turnundead',10)-t0).toFixed(2)}`);
  qC21Clear();P.gear.robe=qC21('c_stilltime','mage');qOk(core21Worn().list.length===0&&qNear(dmgMul(),1),'사제가 마법사 겉옷');qC21Clear();return `마나 ${full} → ${r0}/${r2}/${r3}`});
qT(QB21,'핵심 장비 16개(직업마다 3 · 공용 4) · 「+모든 스킬」 없음 · 아이템 레벨 140까지 굴림 · 일반·보스 드랍(makeItem)에서는 절대 안 나옴 · 드랍 확률(3차 던전 보스 1.5%, 어둠 0이면 샘·시간 없음)',()=>{
  qOk(CORE21.length===16&&CORE21.every(c=>!('all' in c.st)),'16개 · +모든 스킬');for(const cls of ['mage','priest','warrior','archer'])qOk(CORE21.filter(c=>c.cls===cls).length===3,cls);
  qPrep('mage',{lvl:140});QA.reseed(2100);const a=makeCore21('c_stillwater',100);QA.reseed(2100);const b=makeCore21('c_stillwater',140);qOk(b.il===140&&b.stats.int>a.stats.int,`il ${a.il}/${b.il} 지능 ${a.stats.int}/${b.stats.int}`);
  let n=0;QA.reseed(2101);for(const cls of ['mage','priest','warrior','archer']){qPrep(cls,{lvl:130});for(let i=0;i<10000;i++){const it=makeItem(i%2?99:140,i%2===0,cls,i%3===0?'boss':i%3===1?'uniq':null);if(it&&(it.core||CORE21.some(c=>c.n===it.name)))n++}}qOk(n===0,'makeItem에서 핵심 '+n);
  qPrep('mage',{lvl:130});QA.reseed(2102);let hit=0;for(let i=0;i<100000;i++)if(core21Roll('j3boss',0))hit++;qOk(Math.abs(hit/1e5-.015)<.002,'3차 던전 보스 '+hit/1000+'%');const j3p=hit/1000;
  hit=0;for(let i=0;i<20000;i++)if(core21Roll('dark',0))hit++;qOk(hit===0,'어둠 0');hit=0;for(let i=0;i<20000;i++){const c=core21Roll('dark',6);if(c&&CORE21_BY[c].cls&&CORE21_BY[c].cls!=='mage')hit++}qOk(hit===0,'다른 직업 핵심');
  return `makeItem 4만 번 0개 · 3차 던전 보스 ${j3p.toFixed(2)}%`});
qT(QB21,'특수 효과: 째깍임 1초에 0.6초까지 · 30초 넘는 기술 그대로 · 잿불 5겹 +20%(불만) · 저장→불러오기 core 보존 · 전설 현상금 10/20개 순서 · 툴팁 공명 줄 · 도감 칸',()=>{qPrep('mage',{lvl:120});qC21Clear();
  P.gear.robe=qC21('c_stilltime');P.cd={meteor:5,blizzard:8,timestop:50};const t=time;for(let i=0;i<10;i++)core21OnCast('spark');qOk(qNear(P.cd.meteor,4.4)&&qNear(P.cd.blizzard,7.4)&&P.cd.timestop===50,`메테오 ${P.cd.meteor} 블리자드 ${P.cd.blizzard}`);
  time=t+1.01;core21OnCast('spark');qOk(qNear(P.cd.meteor,4.25),'1초 뒤 '+P.cd.meteor);
  qC21Clear();P.gear.staff=qC21('c_sunash');const e={x:0,y:0,k:'wolf'};for(let i=0;i<8;i++)core21OnHit(e,'firebolt',10,false);qOk(qNear(core21TakeMul(e,{el:'fire'}),1.2)&&core21TakeMul(e,{el:'ice'})===1,'잿불 '+core21TakeMul(e,{el:'fire'}));
  const sd=JSON.parse(JSON.stringify(saveData()));qOk(load(sd,QA_SLOT)&&P.gear.staff&&P.gear.staff.core==='c_sunash','core 보존');
  P.bty={};const L=core21LegState();L.n=9;qOk(core21LegNext()===null,'9개');L.n=10;qOk(core21LegNext().reward==='c_cogring','10개');L.got.push(0);qOk(core21LegNext()===null,'받은 뒤');L.n=20;qOk(core21LegNext().reward==='c_wellring','20개');
  const tip=itemTip(qC21('c_cogring'));qOk(tip.includes('공명')&&tip.includes('빌드 핵심'),'툴팁');qOk(core21Codex().includes('빌드 핵심')&&cxItemsHtmlC21().includes('빌드 핵심'),'도감');qC21Clear();return '째깍임 · 잿불 · 저장 · 전설 · 글씨'});
const cxItemsHtmlC21=()=>cxItems();
qT(QB21,'연결: 진짜 시전(tryCast)으로 째깍임 · hurtE로 잿불이 쌓임 · 전사 창 +25%(physScale) · 시간의 길 갑옷 강화 −8%(physBuffMul) · 덫 +1개 · 휩쓸기 범위 +15% · 막기 마나 · 냉기 채널링 마나 −20%',()=>{const out=[];
  qPrep('mage',{lvl:120});qC21Clear();P.sk.spark=10;P.sk.meteor=10;P.gear.robe=qC21('c_stilltime');P.cd={meteor:5};const d=qDummy(P.x+150,P.y);qCast('spark',{x:d.x,y:d.y});qOk(P.cd.meteor<5-.1,'tryCast 째깍임 '+P.cd.meteor);
  qClear();qC21Clear();P.sk.firebolt=10;P.gear.staff=qC21('c_sunash');const e=qDummy(P.x+150,P.y);for(let i=0;i<6;i++){P.cd.firebolt=0;qCast('firebolt',{x:e.x,y:e.y});qStep(40,{render:false})}const m=C21.ember.get(e);qOk(m&&m.n>=3,'잿불 겹 '+(m&&m.n)+' 맞음 '+e.hits);out.push('잿불 '+m.n+'겹');
  qPrep('warrior',{lvl:120});qC21Clear();P.sk.sweep=10;P.sk.polecircle=10;const ps=physScale('sweep',10);P.gear.staff=qC21('c_skyspear');qOk(Math.abs(physScale('sweep',10)-ps-.4)<1e-6,'창 +'+(physScale('sweep',10)-ps)+' (대상 +25% · 물리 피해 15%)');
  qOk(eff('polecircle',1).rad===Math.round(SPELLS.polecircle.rad*1.15)&&eff('sweep',1).range>1.1,'휩쓸기 범위');
  const pb=physBuffMul();P.gear.robe=qC21('c_ragemail');qOk(qNear(pb-physBuffMul(),.08),'강화 −8%');
  qC21Clear();P.gear.off=qC21('c_oathtower');P.mp=0;const t0=time;core21OnBlock();qOk(P.mp>0,'막기 마나');P.sk.taunt=5;qOk(costOf('taunt')===0,'도발 마나 0');
  qPrep('archer',{lvl:120});qC21Clear();P.sk.snaretrap=5;const n0=eff('snaretrap',5).maxN;P.gear.off=qC21('c_huntlord');qOk(eff('snaretrap',5).maxN===n0+1,'덫 '+n0+'→'+eff('snaretrap',5).maxN);
  qPrep('mage',{lvl:120});qC21Clear();P.sk.blizzard=10;const c0=c21ChCost('blizzard',10);P.gear.staff=qC21('c_stillwater');const c1=costOf('blizzard')/10,c2=c21ChCost('blizzard',10);qOk(c2<c1&&c1<c0,`채널 틱 ${c0} → ${c1} → ${c2}`);qC21Clear();void t0;
  return out.concat(['창 +25%','덫 +1','채널 −20%']).join(' · ')});
qT(QB21,'넘치는 등불: 혼자면 넘친 치유의 30% 작은 보호막(최대 생명력 15%, 더 큰 보호막은 그대로) · 샘의 길 3개: 마나 절반 넘으면 초당 1%',()=>{qPrep('priest',{lvl:120});qC21Clear();P.gear.staff=qC21('c_pilgrimlamp');P.hp=maxHp();P.shield=0;P.shieldT=0;
  V20.healMine=true;try{healP(1000)}finally{V20.healMine=false}qOk(P.shield===Math.min(300,Math.round(maxHp()*.15))&&P.shieldS&&P.shieldS.c21,'보호막 '+P.shield);
  P.shield=5000;P.shieldT=10;P.shieldS={n:'큰 막'};V20.healMine=true;try{healP(1000)}finally{V20.healMine=false}qOk(P.shield===5000,'큰 보호막 그대로');P.shield=0;P.shieldT=0;
  qPrep('mage',{lvl:120});qC21Clear();P.gear.staff=qC21('c_stillwater');P.gear.ring=qC21('c_wellring');P.gear.amulet=qC21('c_laketear');qOk(core21N('well')===3,'샘 3');P.mp=Math.round(maxMp()*.6);const m0=P.mp;core21Regen(1);qOk(P.mp>m0,'회복');P.mp=Math.round(maxMp()*.4);const m1=P.mp;core21Regen(1);qOk(P.mp===m1,'절반 아래는 없음');qC21Clear();return '보호막 · 샘 회복'});
qT(QB21,'드랍: 3차 지역 던전 보스 · 재의 군주 · 어둠 단계 보스(샘 1+) · 어둠 단계 정예(4+) · 메아리 군주 — 나오면 상급 유니크 rar 5 · core · 자기 직업',()=>{const out=[];const dt0=darkTier;
  try{qW3Prep('mage',120);qW3Enter('pt_choir');const e=DG.boss;let got=0,bad=0;QA.reseed(2111);for(let i=0;i<400;i++){loot=[];dgBossDrop(e);const it=loot.map(l=>l.item).find(i=>i&&i.core);if(it){got++;if(it.rar!==5||CORE21_BY[it.core].path!=='power'||CORE21_BY[it.core].cls!=='mage')bad++}}
    qOk(got>0&&got<30&&!bad,`3차 던전 보스 400번에 ${got}`);out.push('3차 보스 '+got+'/400');
    darkTier=()=>5;got=0;QA.reseed(2112);for(let i=0;i<600;i++){loot=[];dgBossDrop(e);if(loot.some(l=>l.item&&l.item.core))got++}qOk(got>8,'어둠 5 보스 '+got);out.push('어둠 5 '+got+'/600');
    const el=dgMob('a_knight',e.x+50,e.y,130,{elite:true});got=0;QA.reseed(2113);for(let i=0;i<3000;i++){loot=[];c21Drop(el,'darkElite',5)&&got++}out.push('정예 '+got+'/3000');leaveDungeon();
    darkTier=dt0;loadRegion('home');qPrep('mage',{lvl:140});let lg=0;QA.reseed(2114);for(let i=0;i<4000;i++){if(core21Roll('echo',0))lg++}qOk(lg>40&&lg<130,'메아리 군주 '+lg);out.push('메아리 '+lg+'/4000');
  }finally{darkTier=dt0;if(DG)leaveDungeon();loadRegion('home')}return out.join(' · ')});
qT(QB21,'스승의 마지막 시험: 3차 전직 전·110 아래·다른 직업에겐 안 보임 → 받기 → 「샘을 흐리는 자」(이름 붙은 정예, 생명력 ×7) 처치 → 시험의 방(마나 물약 못 씀 · 샘물로 마나) 3분 → 보상 「고요한 수면의 홀」 한 번',()=>{qPrep('mage',{lvl:112});const q=C21MQ.mage;
  try{P.job3=null;qOk(sqAvail(q)==='hidden','3차 전 '+sqAvail(q));P.job3='archsorcerer';P.lvl=105;qOk(sqAvail(q)==='low','레벨');P.lvl=112;qOk(sqAvail(q)==='ok','받을 수 있음');qOk(sqAvail(C21MQ.priest)==='hidden','다른 직업');
    qOk(sqFolk(q.giver)&&ALLTOWNS.some(t=>t.id===q.town),'스승');sqAccept(q.id);qOk(sqState().a[q.id],'못 받음');qOk(sqTarget(q)&&sqTarget(q).reg==='plateau','목표 자리');
    P.diff=2;qWxTo('plateau',P.x,P.y);const L=RCACHE.plateau;if(L&&L.town){P.x=L.town.x+700;P.y=L.town.y+500}followCam();const e=c21SpawnNamed('q21_wellfoul');qOk(e&&e.elite&&TYPES[e.k].n==='샘을 흐리는 자','안 나옴');
    const t=TYPES.a_cinder;qOk(e.max>=Math.round(t.hp*(1+.34*(e.lvl-1))*7*DIFF[2].hp)-1,'생명력 ×7');qOk(!c21SpawnNamed('q21_wellfoul'),'둘째');
    hurtE(e,e.hp+10,{el:'fire',cls:'mage',proc:1});qStep(2,{render:false});qOk(sqGoalDone(q,0),'처치 목표');loadRegion('home');
    qOk(c21TrialEnter(q.id)&&DG&&DG.c21t,'시험의 방');P.pot={hp:3,mp:5};P.potCd=0;const n=JSON.stringify(P.pot);qOk(usePotion('mp')===false&&JSON.stringify(P.pot)===n,'마나 물약');
    const s=DG.c21t.sp[0];P.x=s.x;P.y=s.y;P.mp=0;P.invT=1e9;qStep(150,{render:false,each:()=>{P.hp=maxHp()}});render();qOk(P.mp>0,'샘물 마나');qOk(enemies.length>0,'무리');DG.c21t.t=C21T_SEC-.05;qStep(10,{render:false});qOk(DG.c21t.res===1&&sqGoalDone(q,1),'통과');leaveDungeon();
    const nb=P.bag.length;sqFinish(q.id);qOk(P.bag.length===nb+1&&P.bag[nb].core==='c_stillwater','보상 '+(P.bag[nb]&&P.bag[nb].name));qOk(sqAvail(q)==='done','한 번만')}finally{if(DG)leaveDungeon();loadRegion('home');P.invT=0}
  return '받기 → 정예 → 시험의 방 → 고요한 수면의 홀'});
qT(QB21,'전설 현상금: 상급 현상금(잿빛 메아리)을 잡으면 셈 · 10개면 게시판에 붙음 · 받기 → 처치 → 「멈춘 시계탑의 톱니」 확정 · 저장에 P.bty.leg(없으면 기본값)',()=>{qPrep('archer',{lvl:140});
  const s=btyState(),id='echo:'+s.day+':0';const _c0=ecBtyCredit;let ok=0;
  try{ecBtyCredit=()=>true;btyCredit(id,null);ok=core21LegState().n}finally{ecBtyCredit=_c0}qOk(ok===1,'셈 '+ok);
  const L=core21LegState();L.n=10;const h=V20P.bty.html(Object.keys(BTY_BOARDS)[0]);qOk(h.includes('전설 현상금')&&h.includes('data-c21leg'),'게시판');qOk(c21LegTake()&&L.on===0,'받기');
  const e=dgMob('q21_leg0',P.x+80,P.y,140);e.elite=true;const nb=P.bag.length;rewardKill(e);qOk(P.bag.length===nb+1&&P.bag[nb].core==='c_cogring'&&L.got[0]===0&&L.on==null,'보상');
  const d=JSON.parse(JSON.stringify(saveData()));qOk(d.bty&&d.bty.leg&&d.bty.leg.n===10,'저장');delete d.bty.leg;qOk(load(d,QA_SLOT)&&core21LegState().n===0&&Array.isArray(P.bty.leg.got),'옛 저장 기본값');
  const d2=JSON.parse(JSON.stringify(saveData()));delete d2.bty;qOk(load(d2,QA_SLOT)&&core21LegState().n===0,'bty 없는 저장');return '셈 · 게시판 · 톱니 · 저장'});
qT(QB21,'캐릭터 창 「빌드 핵심」 공명 줄 · 도감 「이름 붙은 정예」 묶음 · 이름 붙은 정예에 속성 없음 · 글씨에 영어 이름 없음',()=>{qPrep('mage',{lvl:130});qC21Clear();P.gear.robe=qC21('c_stilltime');P.gear.ring=qC21('c_cogring');
  qOk(charHtml().includes('시간의 길 공명 (2/3)'),'캐릭터 창');const G=cxGroups();qOk(G.some(g=>g[0].includes('이름 붙은 정예')&&g[1].includes('q21_wellfoul')),'도감');
  for(const k in C21N)qOk(TYPES[k]&&!TYPES[k].el&&monInfo(k).where.length,k);
  const txt=CORE21.map(c=>c.n+c.lore+c.src).join('')+Object.values(FXD21).join('')+Object.values(C21M_SAY).join('');qOk(!/[A-Za-z]{3,}/.test(txt),'영어');qC21Clear();return '공명 · 도감'});
qT('성장','경험치 v21 레벨 차이(사용자 04:34): 몬스터가 20레벨 넘게 높으면 줄어 50레벨 위부터 10% · 20까지는 그대로 · 내가 높을 때는 예전 규칙(5레벨 넘게 높으면 줄어 최소 5%)',()=>{
  qOk(xpUp21(0)===1&&xpUp21(20)===1&&xpUp21(-30)===1,'20까지 바뀜');qOk(Math.abs(xpUp21(35)-.55)<1e-9,'35 '+xpUp21(35));qOk(xpUp21(50)===.1&&xpUp21(80)===.1,'50 위 '+xpUp21(50));
  qPrep('mage',{lvl:30});const g=lv=>{const e=qMob('wolf',60,lv);e.lvl=lv;e.elite=false;P.xp=0;P.lvl=30;const x0=P.xp;rewardKill(e);e.dead=true;return P.lvl>30?Infinity:P.xp-x0};
  const kx=l=>1+.35*(l-1),a=g(50),b=g(65),c=g(90);
  qOk(Math.abs(a/kx(50)-b/kx(65)/.55)/(a/kx(50))<.05,`35레벨 위 ${b} / 20레벨 위 ${a}`);qOk(Math.abs(c/kx(90)/(a/kx(50))-.1)<.02,`60레벨 위 ${c}`);
  return `+20 ${a} · +35 ${b} · +60 ${c}`});
qT('보스','아르실 부하 부르기 v22(사용자 06:25): 처음은 20초 뒤 · 그 뒤로 30초에 한 번보다 자주 부르지 않음(분노해도) · 다른 보스는 그대로',()=>{
  const D=DUNGEONS.find(d=>d.boss==='b_arsil');qOk(D,'아르실 던전 없음');qEnter(D);const e=enemies.find(o=>o.k==='b_arsil'&&!o.dead);qOk(e,'아르실 없음');
  enemies=enemies.filter(o=>o===e);e.aggroed=true;P.invT=1e9;const times=[];let known=new Set(enemies);
  for(let i=0;i<150*60;i++){if(i%90===0){const p=qFreeAt(e.x,e.y,200,i*.7);if(p){P.x=p.x;P.y=p.y}}P.hp=maxHp();P.invT=1e9;spawnT=1e9;if(i===75*60)e.hp=e.max*.4;else if(e.hp<e.max*.3)e.hp=e.max*.4;
    update(1/60);let nw=0;for(const o of enemies)if(!known.has(o)){known.add(o);if(o.k===TYPES.b_arsil.summon)nw++}if(nw)times.push(i/60);enemies=enemies.filter(o=>o===e);known=new Set(enemies)}
  qOk(times.length>=3,`부르기 ${times.map(t=>t.toFixed(1))}`);qOk(times[0]>=19.5,`처음 ${times[0]}`);for(let i=1;i<times.length;i++)qOk(times[i]-times[i-1]>=29.5,`간격 ${(times[i]-times[i-1]).toFixed(1)}`);qOk(e.rage,'분노 안 함');
  qOk(!TYPES.b_devourer.sumCd&&!TYPES.b_baldrak.sumCd,'다른 보스도 바뀜');return `부르기 ${times.map(t=>t.toFixed(0)+'초').join(' · ')}`});
/* ===== v22 사거리 · 보스 맞는 크기 (사용자 06:12) ===== */
const QR22='v22 사거리';
const QR22_GND=new Set(['field','rain','strike','gale','starfall','wall','trap','spchain','brandburst','detonate']),QR22_MOVE=new Set(['blink','leap','charge','mleap','sidestep','swap']),
  QR22_PET=new Set(['summon','riders','fuse','clone','clones','recall','kingdom','harvest']),QR22_FAR=new Set(['bolt','chain','beam','homing','throw','wave','sweep','stars']);
// 한 공격 마법을 허수아비 하나(거리 d, 각 a)에 겨눠 쓰고 받은 피해. 물리 기술은 빗나감이 있어 tries번까지
let qR22By=null;
// 앞 시전이 남긴 덫·별·물벽·태풍 같은 것까지 지운다 (다음 시전의 결과만 보려고)
function qR22Clear(){qClear();traps=[];clsLater=[];if(typeof J3W==='object'&&J3W)for(const k of ['walls','thr','sweeps','waves','hom','stars','sfall','drives','leaps','gfx'])if(Array.isArray(J3W[k]))J3W[k]=[];
  if(typeof MPJ==='object'&&MPJ){for(const k of ['q','grounds','waves','gales','fins','blades','spears'])if(Array.isArray(MPJ[k]))MPJ[k]=[];MPJ.chain=null;MPJ.focus=null}}
function qR22Shot(id,d,a,tries){const s0=SPELLS[id];let got=0;qR22By=new Set();const _he=hurtE;hurtE=function(e,amt,s){if(e&&e.qa&&s&&amt>0)qR22By.add(s.id||s.n||s.kind);return _he.apply(this,arguments)};try{
  for(let k=0;k<(tries||1)&&!got;k++){qR22Clear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.hp=maxHp();P.sk[id]=10;if(typeof clsGearFor==='function'){clsGearFor(id);if(P.st.dex!=null)P.st.dex=Math.max(P.st.dex,600)}qAdvOn(id);
    const at=qAt(a,d),e=qDummy(at.x,at.y);P.face=a;followCam();QA.reseed(2200+k*17+Math.round(d));
    if(!qCast(id,{x:e.x,y:e.y}))continue;const n=Math.ceil((s0.charge?s0.charge.max+1:0)*60+Math.max(200,((s0.delay||0)+3.2)*60));
    qStep(n,{render:false,each:()=>{P.mp=maxMp();P.hp=maxHp();P.x=QA_SPOT.x;P.y=QA_SPOT.y},until:()=>e.taken>0});got=e.taken}
  }finally{hurtE=_he}qR22Clear();return got}
/* 보스 자리 고정(첫 프레임에 지형이 밀어내는 것 막기): 겨눈 자리와 실제 자리가 같게 */const qR22Pin=(e,x,y)=>{Object.defineProperty(e,'x',{configurable:true,enumerable:true,get:()=>x,set(){}});Object.defineProperty(e,'y',{configurable:true,enumerable:true,get:()=>y,set(){}});return e};
const qR22Who=()=>qR22By&&qR22By.size?'('+[...qR22By].join('/')+')':'';
qT(QR22,'사거리 표: 마법 480 · 궁수 화살 540×1.5=810(+먼 시야 더하기 최대 +120도 ×1.5, v26) · 꿰뚫는 화살 ×2 · 땅 범위 가운데 560(궁수 840) · 마법 사거리는 PC 화면 절반(가로 603·세로 754)보다 짧고 들판 몬스터가 알아차리는 거리(중간값)보다 김',()=>{
  qOk(R22.cap===480&&R22.arc===540&&R22.gnd===560&&R22.ak===1.5&&R22.apk===2,'값');qPrep('archer',{lvl:60});qOk(r22Cap(SPELLS.quickshot)===810,'궁수 '+r22Cap(SPELLS.quickshot));qOk(r22Cap(SPELLS.piercearrow)===1080,'꿰뚫는 화살 '+r22Cap(SPELLS.piercearrow));
  P.job2=SPELLS.farsight.job2;P.lvl=140;P.sk.farsight=10;passT=-1;const c=r22Cap(SPELLS.quickshot),rg=passSum('range');qOk(c===Math.round((540+Math.min(120,Math.round(400*rg)))*1.5)&&c>810,'먼 시야 '+c);qOk(r22Cap(SPELLS.spark)===480,'마법');
  const half=640/(KI*Math.SQRT2);qOk(R22.cap<half,'PC 화면 절반 '+Math.round(half));
  const ag=Object.values(TYPES).filter(t=>!t.boss&&!t.mini&&t.aggro>100).map(t=>t.aggro).sort((a,b)=>a-b),med=ag[ag.length>>1];qOk(R22.cap>=med,'알아차리는 거리 '+med);
  return `마법 ${R22.cap} · 궁수 ${R22.arc}(먼 시야 10레벨 ${c}) · 화면 절반 ${Math.round(half)} · 알아차림 중간 ${med}`});
for(const cls of QCLS)qT(QR22,`${QCN[cls]}: 모든 공격 마법이 사거리(+맞는 크기) 밖은 못 맞힘 · 땅 범위는 가운데가 560 안 · 사거리 90%의 적은 맞힘`,()=>{qPrep(cls,{lvl:140});
  TYPES.qa_dummy=TYPES.qa_dummy||Object.assign({},TYPES.ogre,{n:'QA 허수아비',spd:0,dmg:0,xp:0,aggro:0,atk:1e9,ranged:false,undead:false,boss:0,mini:0});
  const ids=Object.keys(SPELLS).filter(id=>SPELLS[id].cls===cls&&isDmg(SPELLS[id])&&!SPELLS[id].proc),bad=[];let nFar=0,nIn=0,nG=0;
  for(const id of ids){const s0=SPELLS[id],k=s0.kind;if(QR22_MOVE.has(k)||QR22_PET.has(k))continue;const C=r22Cap(s0),hr=Math.max(TYPES.qa_dummy.r,R22_HW.ogre);
    if(QR22_GND.has(k)){// 땅 범위: 아주 먼 곳을 겨눠도 지대·비·낙하의 가운데는 560(또는 그 마법의 원래 사거리) 안
      qR22Clear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.sk[id]=10;if(typeof clsGearFor==='function')clsGearFor(id);qAdvOn(id);const nF=fields.length,nR=rains.length,nP=pend.length;
      qCast(id,qAt(.3,1500));const lim=Math.max(r22Gnd(s0),s0.range||0,k==='trap'?TRAP_RANGE:0)+1;
      for(const o of fields.slice(nF).concat(rains.slice(nR),pend.slice(nP)))if(!o.s||!o.s.self&&!o.s.mini)if(dist(o,P)>lim)bad.push(`${id} 가운데 ${Math.round(dist(o,P))}`);nG++;qR22Clear();continue}
    const far=C+hr+70+(k==='beam'||k==='sweep'?(eff(id,10).w||0):0);/* 광선은 길이가 사거리, 굵기만큼 끝이 둥글다 *//* 화면 가로 방향(월드 -45°)으로 잰다: 화면 세로로 쏘면 그림 몸(키)만큼 앞에서 겹쳐 맞는 것은 v22 몸 상자 규칙(일반 몬스터 점검)대로 */if(qR22Shot(id,far,-.785,1)>0)bad.push(`${id} ${Math.round(far)}에서 맞음${qR22Who()}`);nFar++;
    if(QR22_FAR.has(k)){const s=eff(id,10),nom=k==='bolt'?(s.spd||0)*(s.homing?3:1.4):k==='beam'||k==='wave'||k==='sweep'?s.len:k==='chain'?1e9:(s.range||0);
      if(nom>=C*.9){if(!(qR22Shot(id,C*.9,2.4,3)>0))bad.push(`${id} 사거리 90%(${Math.round(C*.9)}) 못 맞힘`);nIn++}}}
  qOk(!bad.length,bad.join(', '));return `먼 곳 ${nFar}개 못 맞힘 · 90% ${nIn}개 맞힘 · 땅 범위 ${nG}개 가운데 확인`});
qT(QR22,'자동 겨누기·연쇄 번개: 사거리 밖의 적만 있으면 고르지 않음 · 안에 들어오면 고름 · 연쇄의 첫 대상은 사거리 안',()=>{qPrep('mage',{lvl:60});
  TYPES.qa_dummy=TYPES.qa_dummy||Object.assign({},TYPES.ogre,{n:'QA 허수아비',spd:0,dmg:0,xp:0,aggro:0,atk:1e9,ranged:false,undead:false,boss:0,mini:0});
  touchMode=true;mouse.active=false;let e=qDummy(P.x+R22.cap+hR({k:'qa_dummy',r:22})+40,P.y);let t=aimPoint();qOk(Math.hypot(t.x-e.x,t.y-e.y)>5,'사거리 밖을 고름');
  qClear();e=qDummy(P.x+R22.cap*.9,P.y);t=aimPoint();qOk(Math.hypot(t.x-e.x,t.y-e.y)<1,'사거리 안을 못 고름');
  qClear();e=qDummy(P.x+700,P.y);qOk(!r22First({x:e.x,y:e.y},240,SPELLS.chainlightning),'연쇄 첫 대상이 700');
  qOk(qR22Shot('chainlightning',700,0,1)===0,'체인 라이트닝이 700에 닿음');qOk(qR22Shot('chainlightning',R22.cap*.9,0,1)>0,'90%');
  touchMode=false;return '자동 겨누기 · 연쇄 첫 대상'});
// 보스 몸 가장자리를 겨눈 투사체: 땅 쪽 가장자리(맞는 크기)와 몸 위쪽 가장자리(몸을 누르면 그 보스를 겨눔) 둘 다 맞아야 한다
qT(QR22,'보스·준보스 맞는 크기 = 보이는 몸: 큰 보스 넷(삼키는 자 · 보물고 수호 거상 · 멈춘 폭포의 왕 · 고분의 왕 아르실)의 몸 가장자리를 겨눈 투사체가 맞음 · e.r(움직임·몬스터 공격 거리)은 그대로',()=>{
  qPrep('mage',{lvl:60});const out=[],art0=GFX.art;GFX.art='old';
  try{for(const k of ['b_devourer','b_titanguard','ab_stillking','b_arsil']){const t=TYPES[k];qOk(t,k);
      for(const side of [1,-1])for(const mode of ['feet','body']){qClear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.sk.spark=10;followCam();
        const e=qR22Pin(dgMob(k,P.x+260,P.y+260,40),P.x+260,P.y+260);e.atkCd=1e9;e.skT=1e9;e.hp=e.max=1e9;const ex=e.x,ey=e.y;
        const hr=hR(e),sc=e.sc||1;qOk(e.r===t.r,'e.r 바뀜');qOk(hr>=Math.round(R22_HW[t.draw]*sc)-1&&hr>e.r,`${k} 맞는 크기 ${hr} (e.r ${e.r})`);
        const s=W2S(ex,ey),H=MON_H[t.draw]*sc*1.25,sx=s.x+side*(hr*1.06-6),sy=mode==='feet'?s.y:s.y-H*.55;
        const aim=mode==='feet'?S2W(sx,sy):aimAt(sx,sy);if(mode==='body')qOk(aim.snap===e,`${k} 몸 위를 눌렀는데 보스를 안 겨눔`);
        const h0=e.hp;qCast('spark',aim);qStep(90,{render:false,each:()=>{e.x=ex;e.y=ey;P.hp=maxHp()},until:()=>e.hp<h0});
        qOk(e.hp<h0,`${k} ${mode==='feet'?'발밑':'몸'} ${side>0?'오른쪽':'왼쪽'} 가장자리를 못 맞힘 (맞는 크기 ${hr})`)}
      out.push(`${t.n} ${t.r}→${hR(dgMob(k,P.x,P.y,40))}`)}
    // 몬스터 쪽 수치는 그대로: 들판 몬스터 한 방 상한 · 알아차리는 거리 · 움직임 반지름
    qOk(TYPES.wolf.r===15&&TYPES.wolf.aggro===340&&TYPES.b_arsil.r===30,'몬스터 수치');
  }finally{GFX.art=art0;qClear()}return out.join(' · ')});
qT(QR22,'몸 위를 눌러 겨눔: 이동 기술(순간 이동)은 누른 자리 그대로 · 땅 범위 마법은 그 몬스터 발밑',()=>{qPrep('mage',{lvl:60});
  const e=dgMob('b_devourer',P.x+200,P.y+200,40);e.atkCd=1e9;e.skT=1e9;const s=W2S(e.x,e.y),a=aimAt(s.x,s.y-40);qOk(a.snap===e&&a.raw&&dist(a.raw,e)>20,'겨눔');
  const t1=clsAim(SPELLS.blink,a),t2=clsAim(SPELLS.meteor,a);qOk(Math.abs(t1.x-a.raw.x)<1e-6&&Math.abs(t2.x-e.x)<1e-6,'이동/범위');qClear();return '이동은 누른 곳 · 범위는 발밑'});
qT('던전','던전 기억 v22(사용자 06:46): 준보스를 잡고 나왔다 다시 들어가도 그대로(보스만 남음) · 1시간 지나면 새로 · 다른 지역에 다녀오면 새로 · 나가는 문 위치 그대로',()=>{
  const D=DUNGEONS[0],c=CAVES.find(c=>c.cave===D);const go=()=>{P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.d===D,'못 들어감')};
  try{qEnter(D);const g0=DG,mini=enemies.find(e=>TYPES[e.k].mini);qOk(mini,'준보스 없음');hurtE(mini,mini.hp+10,{el:'arcane'});qStep(2,{render:false});const n0=enemies.filter(e=>!e.dead).length;
    leaveDungeon();qOk(!DG,'못 나옴');go();qOk(DG===g0&&DG.kept22,'다시 들어가니 새 던전');qOk(!enemies.includes(mini)&&enemies.some(e=>e.k===D.boss),'준보스가 살아났거나 보스가 없음');qOk(Math.abs(enemies.length-n0)<=0,`몬스터 수 ${enemies.length}/${n0}`);
    qOk(DG.portals.some(p=>p.exit)&&dgFree(P.x,P.y,P.r),'나가는 문 · 선 자리');
    leaveDungeon();K22.off+=3601e3;go();qOk(DG!==g0&&!DG.kept22&&enemies.filter(e=>TYPES[e.k].mini).length===2,'1시간 뒤에도 그대로');
    const g1=DG;leaveDungeon();const other=REG_IDS.find(id=>id!==REG.id);switchRegion(other);switchRegion(D.reg||'home');go();qOk(DG!==g1&&!DG.kept22,'다른 지역에 다녀와도 그대로');
    const g2=DG;leaveDungeon();P.diff=1;go();qOk(DG!==g2,'난이도를 바꿔도 그대로');leaveDungeon();P.diff=0}
  finally{K22.off=0;K22.m.clear();if(DG)leaveDungeon();loadRegion('home')}
  return '준보스 처치 → 나갔다 들어와도 보스만 · 1시간 · 다른 지역 · 난이도마다 새로'});
/* ---- v22 GFX: 세계 지도 읽기 (wmap22.js) ---- */
// 지도 창을 주어진 크기의 화면처럼 만들고 그 안에서 fillText(글자 · 글자 크기 · 폭)를 모은다
function qWm22(w,h,tab,fn){const T=[],fT=CanvasRenderingContext2D.prototype.fillText;wmapOpen();const el=$('#wmap'),st=el.getAttribute('style');
  if(w){el.style.right='auto';el.style.bottom='auto';el.style.width=w+'px';el.style.height=h+'px'}
  CanvasRenderingContext2D.prototype.fillText=function(t,x,y){if(this.canvas&&this.canvas.id==='wmapCv'){const px=+(/(\d+(?:\.\d+)?)px/.exec(this.font)||[0,0])[1];T.push({t:String(t),x,y,px,w:this.measureText(t).width,al:this.textAlign})}return fT.apply(this,arguments)};
  try{WMAP.tab=tab;WMAP.cen=1;wmapDraw();return fn(el,T)}finally{CanvasRenderingContext2D.prototype.fillText=fT;if(st==null)el.removeAttribute('style');else el.setAttribute('style',st);wmapClose();WMAP.tab='reg'}}
const qWmBoxes=G=>Object.keys(REGIONS).filter(id=>WPOS[id]).map(id=>{const p=G.pos(id);return{id,l:p.x-G.w/2,r:p.x+G.w/2,t:p.y-G.h/2,b:p.y+G.h/2}});
qT('지도 v22','PC 1280: 세계 지도 칸 20곳이 겹치지 않고 캔버스 안 · 칸마다 지역 이름 · Lv · 마을 이름(바람목 산채 · 얼음 등대 야영지 · 뇌운 수도원 등) · 글자가 칸 폭 안 · 글자 12px 이상',()=>{qPrep('mage',{lvl:40});
  return qWm22(0,0,'world',(el,T)=>{const G=WMAP.geo,cv=$('#wmapCv'),cr=cv.getBoundingClientRect();qOk(innerWidth<700||G&&!G.fix&&G.lines===3&&G.fs>=12,`PC 칸 ${G&&G.fs}px ${G&&G.lines}줄`);
    const B=qWmBoxes(G);qOk(B.length===Object.keys(WPOS).length&&B.length>=20,'칸 수 '+B.length);
    for(const a of B){qOk(a.l>=0&&a.t>=0&&a.r<=G.Wd&&a.b<=G.Hd,`${a.id} 캔버스 밖`);for(const b of B)if(a!==b)qOk(a.r<=b.l||b.r<=a.l||a.b<=b.t||b.b<=a.t,`${a.id}·${b.id} 겹침`)}
    const txt=T.map(o=>o.t).join('|');for(const t of ALLTOWNS){if(t.reg==='home'||!WPOS[t.reg])continue;qOk(txt.includes(t.n)||T.some(o=>o.t.endsWith('…')&&t.n.startsWith(o.t.slice(0,-1))),`마을 이름 없음: ${t.n}`)}
    for(const id of ['highland','thunder','starsea'])qOk(txt.includes(REGIONS[id].n)||txt.includes(REGIONS[id].n+' ?'),REGIONS[id].n);
    const inBox=T.filter(o=>o.al==='center'&&o.t!=='북 ↑'&&!o.t.startsWith('◎')&&!o.t.startsWith('◈'));qOk(inBox.length>=40,'칸 글자 '+inBox.length);
    for(const o of inBox)qOk(o.w<=G.w-4&&o.px>=(innerWidth<700?10:11),`「${o.t}」 ${Math.round(o.w)}px/${Math.round(G.w)} ${o.px}px`);
    qOk(cr.right<=innerWidth+1&&cr.bottom<=innerHeight+1,`캔버스가 화면 밖 ${Math.round(cr.right)},${Math.round(cr.bottom)}`);
    return `칸 ${Math.round(G.w)}×${Math.round(G.h)} · ${G.fs}px · 마을 이름 ${T.filter(o=>ALLTOWNS.some(t=>t.n===o.t)).length}개`})});
qT('지도 v22','휴대폰 390×844: 세계 지도는 칸 크기 고정(글자 13px · 둘째 줄 11px) + 손가락으로 미는 스크롤 칸 · 지금 지역이 보이는 자리 · 단추 40px 이상 화면 안 · 창 · 안내 글 화면 안 · 잿빛 메아리 표시도 같은 자리',()=>{qPrep('mage',{lvl:40});qWxTo('ice');
  try{return qWm22(390,844,'world',(el,T)=>{const G=WMAP.geo,scr=$('#wmapScr'),cv=$('#wmapCv'),er=el.getBoundingClientRect(),sr=scr.getBoundingClientRect(),card=el.querySelector('.card').getBoundingClientRect();
    qOk(G&&G.fix&&G.fs>=13&&G.lines===3,`휴대폰 칸 ${G&&G.fs}px`);qOk(el.classList.contains('w22phone'),'휴대폰 모양 아님');
    qOk(cv.getBoundingClientRect().width>sr.width+50&&getComputedStyle(scr).overflowX==='auto'&&/pan-x/.test(getComputedStyle(scr).touchAction),'스크롤 칸 아님');
    qOk(scr.scrollWidth>scr.clientWidth,'가로로 밀 수 없음');
    qOk(card.left>=er.left-1&&card.right<=er.left+390+1&&card.top>=er.top-1&&card.bottom<=er.top+844+1,`창이 화면 밖 ${JSON.stringify([card.left,card.right,card.bottom])}`);
    qOk(sr.right<=er.left+390+1&&sr.bottom<=er.top+844+1,'지도 칸 화면 밖');
    for(const b of el.querySelectorAll('.wtop button')){const r=b.getBoundingClientRect();qOk(r.height>=40&&r.width>=44,`단추 작음 ${b.textContent} ${r.width}×${r.height}`);qOk(r.left>=er.left&&r.right<=er.left+390+1&&r.top>=er.top&&r.bottom<=er.top+844,`단추 화면 밖 ${b.textContent}`)}
    const lg=$('#wmapLeg').getBoundingClientRect();qOk(lg.bottom<=er.top+844+1&&$('#wmapLeg').innerHTML.includes('손가락으로 밀면'),'안내 글');
    const p=G.pos('ice'),vx=p.x-scr.scrollLeft,vy=p.y-scr.scrollTop;qOk(vx-G.w/2>=-1&&vx+G.w/2<=scr.clientWidth+1&&vy-G.h/2>=-1&&vy+G.h/2<=scr.clientHeight+1,`지금 지역(북부 빙원)이 안 보임 ${Math.round(vx)},${Math.round(vy)}`);
    const inBox=T.filter(o=>o.al==='center'&&o.t!=='북 ↑'&&!o.t.startsWith('◎')&&!o.t.startsWith('◈'));for(const o of inBox)qOk(o.w<=G.w-4&&o.px>=11,`「${o.t}」 ${Math.round(o.w)}/${Math.round(G.w)} ${o.px}px`);
    // 잿빛 메아리 표시(echo21)도 같은 칸 자리: WMAP.geo를 그대로 씀
    const L0=echoList;echoList=()=>['ice'];const T2=[],fT=CanvasRenderingContext2D.prototype.fillText;try{CanvasRenderingContext2D.prototype.fillText=function(t,x,y){if(String(t).startsWith('◈'))T2.push({x,y});return fT.apply(this,arguments)};wmapDraw()}finally{echoList=L0;CanvasRenderingContext2D.prototype.fillText=fT}
    qOk(T2.length&&Math.abs(T2[0].x-p.x)<1&&Math.abs(T2[0].y-(p.y-G.h/2-6))<1,'메아리 표시 자리 '+JSON.stringify(T2[0]));
    return `칸 ${Math.round(G.w)}×${Math.round(G.h)} · ${G.fs}px · 지도 폭 ${Math.round(G.Wd)} / 보이는 폭 ${scr.clientWidth}`})}finally{loadRegion('home')}});
qT('지도 v22','휴대폰 390: 지역 지도도 크게(폭 720) 그리고 밀어서 보기 · 열 때 내 자리가 보임 · PC 1280은 예전 크기(스크롤 없음) · 세계 지도 → 지역 탭 오가도 오류 없음',()=>{qPrep('mage',{lvl:40});P.x=QA_SPOT.x;P.y=QA_SPOT.y;
  const ph=qWm22(390,844,'reg',(el)=>{const scr=$('#wmapScr'),cv=$('#wmapCv');qOk(cv.getBoundingClientRect().width>=700&&scr.scrollWidth>scr.clientWidth,'지역 지도가 작음');
    const Wd=parseFloat(cv.style.width),Hd=parseFloat(cv.style.height),m=Math.min((Wd-30)/(WORLD*2*KI),(Hd-30)/(WORLD*KI)),x=Wd/2+(P.x-P.y)*KI*m-scr.scrollLeft;qOk(x>=0&&x<=scr.clientWidth,'내 자리가 안 보임 '+Math.round(x));
    $('#wmap [data-wt="world"]').click();qOk(WMAP.tab==='world'&&WMAP.geo.fix,'세계 탭');$('#wmap [data-wt="reg"]').click();qOk(WMAP.tab==='reg'&&!$('#wmapLeg').innerHTML.includes('가운데가 처음'),'지역 탭');return Math.round(Wd)});
  const pc=qWm22(0,0,'reg',(el)=>{const scr=$('#wmapScr'),cv=$('#wmapCv');qOk(innerWidth<700||scr.scrollWidth<=scr.clientWidth+1&&scr.scrollHeight<=scr.clientHeight+1,'PC에서 스크롤 생김');qOk(!el.classList.contains('w22phone')||innerWidth<700,'PC인데 휴대폰 모양');qOk(!$('#wmapLeg').innerHTML.includes('손가락'),'PC 안내 글');return Math.round(cv.getBoundingClientRect().width)});
  qOk(!$('#wmap').classList.contains('w22world')||WMAP.tab==='world','탭 표시');
  return `휴대폰 지역 지도 폭 ${ph} · PC ${pc}`});
/* ===== v22 배경음 겹침 (사용자 06:49): 곡을 바꾸는 2초 안에 또 바뀌면 줄어들던 곡이 멈추지 않고 계속 울렸음 → 가짜 <audio>로 확인 ===== */
qT('소리','배경음 겹침 v22: 지역을 빠르게 바꿔도 동시에 울리는 곡은 많아야 2개(바뀌는 중) · 끝나면 1개 · 마을 경계에서 곡이 번갈아 바뀌지 않음',async()=>{qPrep('mage');
  const A0=window.Audio,c0=AU.ctx,on0=AU.on,pk0=BGM.pick,els=[];let slot='field',maxP=0,fin='',flips=0;
  function FA(){this.paused=true;this.volume=1;this.src='';els.push(this)}
  FA.prototype.play=function(){this.paused=false;return Promise.resolve()};FA.prototype.pause=function(){this.paused=true};FA.prototype.removeAttribute=function(k){if(k==='src')this.src=''};FA.prototype.load=function(){};
  const on=()=>els.filter(e=>!e.paused&&e.src);const W=ms=>new Promise(r=>setTimeout(r,ms));
  try{window.Audio=FA;AU.ctx={state:'running',createGain(){throw 0},createMediaElementSource(){throw 0}};AU.on=true;BGM.pick=()=>slot;BGM.cur=null;BGMS.el=null;BGMS.old=null;
    BGM.want='field';BGM.apply();qOk(on().length===1,'첫 곡이 안 울림');
    for(const s of ['town','field','town','forest','snow']){slot=s;BGM.want=s;BGM.apply();await W(300);maxP=Math.max(maxP,on().length)}
    await W(2700);fin=on().map(e=>e.src.split('/').pop()).join('+');
    qOk(maxP<=2,`바뀌는 중에 ${maxP}곡이 함께 울림`);qOk(on().length===1&&/snow\.mp3$/.test(fin),`끝난 뒤 울리는 곡: ${fin}`);
    /* 마을 경계 왕복: 0.5초마다 마을/들판이 번갈아 골라져도 곡을 바꾸지 않음 */
    const e0=BGMS.el;let fl=false;BGM.pick=()=>(fl=!fl)?'town':'snow';for(let i=0;i<12;i++){await W(250);if(BGMS.el!==e0)flips++}BGM.pick=()=>slot
    qOk(flips===0,`경계에서 곡이 ${flips}번 바뀜`);slot='town';await W(1600);qOk(BGM.cur==='town','계속 마을이면 마을 곡으로 안 바뀜');
    return `바뀌는 중 최대 ${maxP}곡 · 끝나면 ${fin} 1곡 · 경계 왕복 바뀜 0번`}
  finally{BGM.pick=pk0;clearInterval(BGMS.fade);for(const e of els)e.pause();BGMS.all.clear();BGMS.el=null;BGMS.old=null;window.Audio=A0;AU.ctx=c0;AU.on=on0;BGM.cur=null;qClear()}});
// v22 (사용자 06:54): 일반 몬스터 — 화살·투사체가 그림의 몸과 겹쳐 지나가면 맞고, 머리 위·발 아래로 확실히 비켜 가면 빗나감
qT(QR22,'일반 몬스터 맞는 크기: 화살(퀵 샷)·투사체(스파크)가 몸통 높이를 지나가면 맞음 · 머리 위·발 아래로 비켜 가면 빗나감 · 여러 크기(고블린·늑대·망령·사도·오우거) + 새 그림(Flare) 고블린·오우거',()=>{
  const out=[],fl0=Object.assign({},FL.P),art0=GFX.art;
  const one=(k,id,mode,flare)=>{let got=0;for(let tr=0;tr<3&&!got;tr++){qR22Clear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.hp=maxHp();P.sk[id]=10;if(typeof clsGearFor==='function'){clsGearFor(id);if(P.st.dex!=null)P.st.dex=Math.max(P.st.dex,600)}followCam();
      const e=dgMob(k,P.x+190,P.y-190,20);e.atkCd=1e9;e.hp=e.max=1e9;const ex=e.x,ey=e.y,t=TYPES[k],sc=e.sc||1,H=MON_H[t.draw]*sc*1.25,s=W2S(ex,ey),hr=hR(e);
      const sy=mode==='body'?s.y-H*.35:mode==='above'?s.y-H*.9-60:s.y+hr*.53+50;QA.reseed(5400+tr);
      qCast(id,S2W(s.x,sy));qStep(80,{render:false,each:()=>{e.x=ex;e.y=ey;e.aggroed=false;P.hp=maxHp()},until:()=>e.hp<1e9});got=e.hp<1e9?1:0;if(mode!=='body')break}
    qR22Clear();return got};
  try{for(const [cls,id] of [['archer','quickshot'],['mage','spark']]){qPrep(cls,{lvl:60});
      for(const [k,flare] of [['goblin',0],['wolf',0],['wraith',0],['apostle',0],['ogre',0],['goblin',1],['ogre',1]]){
        if(flare){GFX.art=undefined;FL.P['m-'+FLDRAW[TYPES[k].draw]]={}}else{GFX.art='old'}
        const tag=`${id} ${TYPES[k].n}${flare?'(새 그림)':''}`;
        qOk(one(k,id,'body',flare),`${tag}: 몸통을 지나가는데 빗나감`);qOk(!one(k,id,'above',flare),`${tag}: 머리 위로 지나가는데 맞음`);qOk(!one(k,id,'below',flare),`${tag}: 발 아래로 지나가는데 맞음`);
        const e=dgMob(k,P.x,P.y,20);if(cls==='mage')out.push(`${TYPES[k].n}${flare?'(새 그림)':''} ${TYPES[k].r}→${hR(e)}`);e.dead=true;enemies=enemies.filter(o=>o!==e);
        for(const n in FL.P)if(!(n in fl0))delete FL.P[n]}}
  }finally{GFX.art=art0;for(const n in FL.P)if(!(n in fl0))delete FL.P[n];R22.gen++;qR22Clear()}
  return out.join(' · ')});
/* ===== v22 END2: 룬 홈 · 룬 문장 · 각성 유니크 · 직업 엔드 세트 (end22.js) ===== */
const QE2='v22 엔드 둘째';
const qE2It=(slot,so,st)=>QA_ITEM(uid++,slot,2,'시험 '+slot,140,st||{int:100},{so});
qT(QE2,'룬 홈 굴림: il≥130 무기·보조·갑옷·모자에 0~2개(1개 30% · 2개 10%+1%/어둠 단계) · 처음엔 빈 홈 · 반지·목걸이 · il 100 · 상점 물건 · 예전 장비(불러오기)에는 홈이 생기지 않음',()=>{qPrep('mage',{lvl:140});
  let n=0,bad=0;const c=[0,0,0];for(let i=0;i<5000;i++){const it=makeItem(140,false);if(E22_SOCK_SLOTS.includes(it.slot)){n++;c[it.so?it.so.length:0]++;if(it.so&&!it.so.every(x=>x===null))bad++}else if(it.so)bad++}
  qOk(!bad,'반지·목걸이에 홈 또는 처음부터 박힘 '+bad);const p1=c[1]/n,p2=c[2]/n;qOk(Math.abs(p1-.3)<.045&&Math.abs(p2-.1)<.03,`1개 ${p1.toFixed(3)} · 2개 ${p2.toFixed(3)} (n ${n})`);
  let low=0;for(let i=0;i<1500;i++)if(makeItem(100,false).so)low++;qOk(!low,'il 100에 홈 '+low);
  const t=ALLTOWNS.find(t=>(t.shops||[]).some(s=>s.type==='weapon'));let sh=0,tot=0;for(let i=0;i<15;i++){delete shops[t.id+':weapon'];const st=shopStock(t,'weapon');tot+=st.items.length;sh+=st.items.filter(x=>x.so||x.awk).length}
  qOk(tot>0&&!sh,`상점 물건 ${sh}/${tot}`);
  const d=JSON.parse(JSON.stringify(QA_FIX.v5));d.gear.staff.il=140;d.bag[0].il=140;qOk(load(d,QA_SLOT),'load');
  qOk(![...Object.values(P.gear),...P.bag].some(x=>x&&('so' in x||'awk' in x||'esp' in x)),'불러올 때 장비가 바뀜');
  return `홈 1개 ${(p1*100).toFixed(1)}% · 2개 ${(p2*100).toFixed(1)}% (어둠 밖)`});
qT(QE2,'룬석 박기 · 빼기 · 바꾸기 · 합치기: 주머니에서 1개 빠짐 · 착용 중이면 능력치에 더함(덧셈) · 빼면 룬석은 사라지고 장비는 그대로 · 바꾸면 원래 룬석은 사라짐 · 같은 룬석 3개 → 한 등급 위(재의 결정 3/8)',()=>{qPrep('mage',{lvl:140});E22.quiet=1;try{
  const it=qE2It('staff',[null,null]);P.gear.staff=it;const f0=stat('el_fire'),c0=stat('crit');
  qOk(!e22Insert(it,0,'ig1'),'없는 룬석을 박음');e22RuneAdd('ig1',2);e22RuneAdd('as2',1);
  qOk(e22Insert(it,0,'ig1')&&e22RuneHave('ig1')===1&&it.so[0]==='ig1','박기');qOk(stat('el_fire')-f0===6,'불 피해 +6: '+(stat('el_fire')-f0));
  qOk(e22Insert(it,0,'as2')&&it.so[0]==='as2'&&e22RuneHave('as2')===0&&e22RuneHave('ig1')===1,'바꾸기');qOk(stat('el_fire')===f0&&stat('crit')-c0===3,'바꾼 뒤 치명 '+(stat('crit')-c0));
  qOk(e22Remove(it,0)&&it.so[0]===null&&it.so.length===2&&e22RuneHave('as2')===0,'빼기: 룬석 사라짐');qOk(stat('crit')===c0&&it.stats.int===100,'뺀 뒤 장비 그대로');
  qOk(!e22Insert(it,2,'ig1')&&!e22Insert(QA_ITEM(uid++,'ring',2,'반지',140,{mp:10}),0,'ig1'),'없는 홈');
  e22RuneAdd('nae1',5);P.ash=2;qOk(!e22Merge('nae1')&&e22RuneHave('nae1')===5,'재의 결정 모자람');P.ash=10;qOk(e22Merge('nae1')==='nae2'&&e22RuneHave('nae1')===2&&e22RuneHave('nae2')===1&&P.ash===7,'합치기');
  qOk(!e22Merge('nae2'),'2개뿐');e22RuneAdd('nae3',3);qOk(!e22Merge('nae3'),'3등급 위');
  const bg=qE2It('robe',[null],{hp:100});P.bag.push(bg);const h0=stat('hp');e22RuneAdd('heim3',1);qOk(e22Insert(bg,0,'heim3')&&stat('hp')===h0,'가방 장비는 안 셈');gearEquip(bg);qOk(stat('hp')-h0===320,'끼면 +100 +220: '+(stat('hp')-h0));
  P.gear.ring=QA_ITEM(uid++,'ring',2,'x',140,{mp:10});const sol=qE2It('hat',['sol3']);P.gear.hat=sol;const i0=P.gear.hat?stat('int'):0;P.gear.hat=null;qOk(i0-stat('int')===128,'솔 3등급 = 주 능력치 +28 (+모자 100): '+(i0-stat('int')));
  }finally{E22.quiet=0}return '박기 · 바꾸기 · 빼기 · 합치기'});
qT(QE2,'룬 문장: 홈 2개에 정해진 두 룬을 순서대로(거꾸로 · 빈 칸 · 홈 1개는 안 켜짐) · 끼면 켜지고 알게 됨 · 피의 칼날 치명 피해 +20% · 불타는 폭풍 둘레 번개(0.6초에 한 번) · 얼어붙은 땅 · 바위 심장 · 멈춘 샘(45초에 한 번) · 사냥꾼의 숨 · 번개 샘 · 따뜻한 빛',()=>{qPrep('mage',{lvl:140});E22.quiet=1;try{
  const mk=so=>qE2It('staff',so);qOk(e22ItemRw(mk(['ig1','vel2'])).id==='ig_vel','이그→벨');qOk(!e22ItemRw(mk(['vel1','ig1'])),'거꾸로');qOk(!e22ItemRw(mk(['ig1',null])),'빈 칸');qOk(!e22ItemRw(qE2It('robe',['ig1'])),'홈 1개');
  qOk(E22_RW.length===8&&new Set(E22_RW.map(w=>w.a+w.b)).size===8,'문장 8개');
  qOk(!e22RwKnown('as_pir'),'처음엔 모름');const k0=stat('critd');P.gear.staff=mk(['as1','pir1']);qOk(e22Worn().rw.as_pir&&e22RwKnown('as_pir'),'켜짐 · 앎');qOk(stat('critd')-k0===20,'치명 피해 +20: '+(stat('critd')-k0));
  qOk(Math.abs(critDmgK()-(1.75+stat('critd')/100))<1e-9,'critDmgK');P.gear.staff=null;qOk(!e22Worn().rw.as_pir&&e22RwKnown('as_pir'),'벗으면 꺼짐(앎은 남음)');
  TYPES.qa_dummy=TYPES.qa_dummy||Object.assign({},TYPES.ogre,{n:'QA 허수아비',spd:0,dmg:0,xp:0,aggro:0,atk:1e9,ranged:false,undead:false,boss:0,mini:0});
  qClear();P.gear.staff=mk(['ig1','vel1']);const a=qDummy(P.x+200,P.y),b=qDummy(P.x+260,P.y),far=qDummy(P.x+520,P.y);E22.rwT={};
  hurtE(a,1000,{el:'fire',cls:'mage',id:'firebolt'});qOk(b.hits>=1&&far.hits===0&&a.hits>=2,`회오리 a${a.hits} b${b.hits} 먼 적 ${far.hits}`);const bh=b.hits;
  hurtE(a,1000,{el:'fire',cls:'mage',id:'firebolt'});qOk(b.hits===bh,'0.6초에 한 번');time+=.7;hurtE(a,1000,{el:'ice',cls:'mage',id:'frost'});qOk(b.hits===bh,'불 마법만');
  P.gear.staff=mk(['nae1','dor1']);a.slowT=0;hurtE(a,10,{el:'ice',cls:'mage',id:'frost'});qOk(a.slowT>=1.9,'얼어붙은 땅 '+a.slowT);
  P.gear.staff=mk(['dor1','heim1']);delete P.buffs._e22rock;E22.rwT={};P.invT=0;P.shield=0;P.armor=null;P.hp=maxHp()*.55;hitPlayer(maxHp()*.1,null);qOk(P.buffs._e22rock&&P.buffs._e22rock.dr===.15,'바위 심장');
  P.hp=maxHp();P.gear.staff=mk(['kro1','sera1']);P.mp=maxMp()*.1;E22.rwT={};e22SlowTick();qOk(P.mp>maxMp()*.25,'멈춘 샘 '+Math.round(P.mp));P.mp=maxMp()*.1;e22SlowTick();qOk(P.mp<maxMp()*.15,'45초에 한 번');
  P.gear.staff=mk(['sol1','as1']);delete P.buffs._e22hunt;const sp0=spdMul();rewardKill({k:'qa_dummy',x:P.x,y:P.y,lvl:1,r:10});qOk(P.buffs._e22hunt&&Math.abs(spdMul()-sp0-.1)<1e-9,'사냥꾼의 숨 '+(spdMul()-sp0));
  P.gear.staff=mk(['mar1','vel1']);P.mp=100;E22.rwT={};hurtE(a,10,{el:'storm',cls:'mage',id:'lightning'});qOk(P.mp>100,'번개 샘');
  P.gear.staff=mk(['lum1','heim1']);P.hp=maxHp()*.5;const h1=P.hp;E22.rwT={};hurtE(a,10,{el:'holy',cls:'mage',id:'firebolt'});qOk(P.hp>h1,'따뜻한 빛');
  }finally{E22.quiet=0;qClear()}return '8개 효과 모두 확인'});
qT(QE2,'드랍(어둠 단계 · 혼자): 룬석 3단계부터 · 직업 세트 4단계부터 · 각성 6단계부터 · 일반 몬스터 룬석 .4% · 보스 세트 5%~11% · 정예·일반은 아주 드묾 · 6단계 유니크의 6%가 각성(5단계 0) · 일반 굴림에 엔드 세트 0 · B4/숨은 보스(「재로 쓴 이름」 첫 처치 반드시 · 그 뒤 8%)/미궁 심층 API',()=>{qD21Prep('mage');E22.quiet=1;const out=[];try{
  const cnt=(where,t,kind,N,o)=>{const c={rune:0,set:0,awk:0,note:0};for(let i=0;i<N;i++)for(const r of end22Drop(where,t,P.x,P.y,Object.assign({kind},o||{})))c[r.k]++;loot.length=0;P.e22.rs={};return c};
  for(const t of [0,1,2]){const c=cnt('dark',t,'boss',300);qOk(!c.rune&&!c.set&&!c.awk,`${t}단계 ${JSON.stringify(c)}`)}
  const c3=cnt('dark',3,'boss',600);qOk(c3.rune>=600&&!c3.set&&!c3.awk,'3단계 보스 '+JSON.stringify(c3));
  const n3=cnt('dark',3,'normal',30000).rune/30000;qOk(n3>.0025&&n3<.0058,'3단계 일반 룬석 '+n3);out.push(`일반 룬석 ${(n3*100).toFixed(2)}%`);
  const s4=cnt('dark',4,'boss',6000).set/6000;qOk(s4>.038&&s4<.064,'4단계 보스 세트 '+s4);
  const s10=cnt('dark',10,'boss',4000).set/4000;qOk(s10>.085&&s10<.135,'10단계 보스 세트 '+s10);out.push(`보스 세트 ${(s4*100).toFixed(1)}~${(s10*100).toFixed(1)}%`);
  const e10=cnt('dark',10,'elite',20000).set/20000;qOk(e10<.0075,'정예 세트 '+e10);const nm=cnt('dark',10,'normal',20000);qOk(nm.set<=4&&!nm.awk,'일반 몬스터 '+JSON.stringify(nm));
  const ch=cnt('dark',10,'boss',3000,{chest:1}).set/3000;qOk(ch>s10*1.4,'상자 ×2 '+ch);
  const b4=cnt('b4',8,null,3000);qOk(b4.rune===3000*3&&b4.set/3000>.15&&b4.set/3000<.25&&b4.awk/3000>.03&&b4.awk/3000<.08,'B4 '+JSON.stringify(b4));
  P.e22=e22Clean(null);const nf=end22Drop('b4hidden',10,P.x,P.y).find(r=>r.k==='name');qOk(nf&&nf.it.name==='재로 쓴 이름'&&nf.it.slot==='amulet'&&nf.it.rar===5&&nf.it.stats.critd===25&&nf.it.stats.all===1&&loot.some(l=>l.item===nf.it)&&P.e22.nm===1,'숨은 보스 첫 처치 「재로 쓴 이름」 '+JSON.stringify(nf&&nf.it.stats));
  loot.length=0;qOk(!end22Drop('b4',10,P.x,P.y).some(r=>r.k==='name'),'B4 보스에선 안 나옴');let nn=0;for(let i=0;i<3000;i++)if(end22Drop('b4hidden',10,P.x,P.y).some(r=>r.k==='name'))nn++;loot.length=0;qOk(nn/3000>.05&&nn/3000<.11,'그 뒤 '+nn/3000);
  qOk(JSON.parse(JSON.stringify(saveData())).e22.nm===P.e22.nm&&e22Clean({nm:-3}).nm===undefined,'nm 저장');out.push(`목걸이 첫 처치 100% · 그 뒤 ${(nn/30).toFixed(1)}%`);
  const bh=cnt('b4hidden',10,null,1000);qOk(bh.rune===4000&&bh.set>280&&bh.set<420&&bh.awk>80&&bh.awk<165,'숨은 보스 '+JSON.stringify(bh));
  const dp=cnt('deep',2,null,1000);qOk(!dp.rune&&!dp.set&&!dp.awk,'심층 2단계 '+JSON.stringify(dp));const dp6=cnt('deep',6,null,3000);qOk(dp6.rune>=3000&&dp6.set>100&&dp6.set<270&&dp6.awk>12&&dp6.awk<90,'심층 6단계 '+JSON.stringify(dp6));
  const sp=end22Drop('b4',8,P.x,P.y).filter(r=>r.k==='set'||r.k==='awk');for(const r of sp)qOk(r.it.cls==='mage'&&loot.some(l=>l.item===r.it),'바닥에 · 내 직업');loot.length=0;
  loadRegion('capital');P.dark.cur=6;qOk(darkTier()===6,'단계 '+darkTier());let a6=0;for(let i=0;i<3000;i++)if(makeItem(140,true,null,'uniq').awk)a6++;qOk(a6/3000>.035&&a6/3000<.09,'6단계 각성 '+a6/3000);
  P.dark.cur=5;let a5=0;for(let i=0;i<1500;i++)if(makeItem(140,true,null,'uniq').awk)a5++;qOk(!a5,'5단계 각성 '+a5);out.push(`각성 6단계 ${(a6/30).toFixed(1)}%`);
  P.dark.cur=10;let es=0,nt=0,nu=0;for(let i=0;i<20000;i++){const it=makeItem(140,R()<.3);if(it.set&&e22IsSet(it.set))es++;if(it.rar>=4)nu++;if(it.awk)nt++}qOk(!es,'일반 굴림 엔드 세트 '+es);qOk(nt<=Math.max(3,nu*.16)&&nu<20000*.03,`일반 굴림 각성 ${nt}/유니크 ${nu}`);out.push(`10단계 일반 굴림 유니크 ${nu}/20000 중 각성 ${nt}`);
  qOk(Object.keys(SETS).every(k=>!e22IsSet(k))&&SETS.e22_mage&&SETS.e22_mage.n,'SETS: 이름은 있고 목록엔 없음');
  }finally{E22.quiet=0;qD21End()}return out.join(' · ')});
qT(QE2,'직업 엔드 세트: 직업마다 6조각(전사·궁수는 방패/화살통 포함 7종 중 6) · 같은 조각 둘은 하나 · 2/4/6벌(덧셈) · 6벌은 내 3차 갈래만 · 빌드 핵심과 같은 칸 · +모든 스킬 없음(상한 5 그대로) · 각성판은 최고값 + 한 줄',()=>{qPrep('mage',{lvl:140});P.job2='archmage';P.job3='archsorcerer';e22SlowTick();
  const pcs=e22Pieces('mage');qOk(pcs.length===6&&e22Pieces('warrior').length===7&&e22Pieces('archer').length===7,'조각 수');for(const s in P.gear)P.gear[s]=null;
  const sp={};for(const k of pcs){sp[k]=e22MakeSet('mage',140,k);qOk(sp[k].set==='e22_mage'&&sp[k].esp===k&&sp[k].rar===3&&!('all' in sp[k].stats)&&!Object.keys(sp[k].stats).some(x=>x.startsWith('sk_')||x.startsWith('tr_')),'조각 '+k)}
  qOk(sp.ring2.slot==='ring','두 번째 반지 조각도 반지 칸');
  const d=(k,f)=>{const a=stat(k);f();return stat(k)-a};
  P.gear.staff=sp.staff;qOk(setCount('e22_mage')===1,'1');qOk(Math.abs(d('int',()=>{P.gear.robe=sp.robe})-(sp.robe.stats.int||0)-60)<.01,'2벌 지능 +60');
  P.gear.ring=sp.ring;P.gear.ring2=Object.assign({},sp.ring,{id:uid++});qOk(setCount('e22_mage')===3,'같은 반지 둘 = 하나 '+setCount('e22_mage'));
  qOk(Math.abs(d('crit',()=>{P.gear.ring2=sp.ring2})-(sp.ring2.stats.crit||0)+(sp.ring.stats.crit||0)-8)<.01,'4벌 치명 +8');
  P.gear.hat=sp.hat;qOk(setCount('e22_mage')===5,'5');qOk(d('critd',()=>{P.gear.amulet=sp.amulet})===20,'6벌 대마법사 치명 피해 +20');qOk(setCount('e22_mage')===6,'6');
  const j3=Object.keys(SPELLS).find(id=>SPELLS[id].job3==='archsorcerer'),j2=Object.keys(SPELLS).find(id=>SPELLS[id].job2==='archmage'),j3o=Object.keys(SPELLS).find(id=>SPELLS[id].job3==='spiritking');
  qOk(e22BrDmg(j3)===.25&&e22BrDmg(j2)===.25&&e22BrDmg(j3o)===0&&e22BrDmg('firebolt')===0,'갈래 기술 피해');
  P.job2='summoner';P.job3='spiritking';e22SlowTick();qOk(stat('critd')===0||stat('critd')<20,'다른 갈래면 치명 피해 없음');qOk(e22BrDmg(j3o)===.25&&e22BrDmg(j3)===0,'정령왕');P.job2='archmage';P.job3='archsorcerer';e22SlowTick();
  P.gear.staff=makeCore21('c_sunash',140,'mage');qOk(setCount('e22_mage')===5&&core21Worn().list.length===1&&e22BrDmg(j3)===0,'핵심을 끼면 5벌 · 6벌 효과 꺼짐');
  P.sk.spark=10;P.gear.staff=sp.staff;const b0=bonusLv('spark');qOk(!stat('all')&&b0===bonusLv('spark'),'+모든 스킬 없음');P.gear.ring=QA_ITEM(uid++,'ring',5,'시험',140,{all:9});qOk(bonusLv('spark')-b0===5,'상한 5 '+(bonusLv('spark')-b0));P.gear.ring=sp.ring;
  qOk(!JSON.stringify(E22_SETS).includes('"all"')&&!Object.values(E22_RUNES).some(r=>r.st==='all'),'세트 · 룬석에 all 없음');
  qPrep('warrior',{lvl:140});P.job2='berserker';P.job3='warlord';for(const s in P.gear)P.gear[s]=null;const w=k=>e22MakeSet('warrior',140,k);
  let st=w('staff');for(let i=0;i<40&&st.wt!=='polearm';i++)st=w('staff');qOk(st.wt==='polearm'&&/창$/.test(st.name),'창 '+st.name);for(const [s,k] of [['robe','robe'],['hat','hat'],['ring','ring'],['ring2','ring2'],['amulet','amulet']])P.gear[s]=w(k);P.gear.staff=st;
  qOk(setCount('e22_warrior')===6,'창 전사 6벌(방패 없이) '+setCount('e22_warrior'));qOk(w('off').wt==='shield'&&w('robe').wt==='plate','방패 · 판금');
  qPrep('mage',{lvl:140});const u=makeItem(140,true,null,'uniq');const u0=JSON.parse(JSON.stringify(u.stats));e22Awaken(u);qOk(u.awk===1&&u.awx&&u.stats[u.awx]>0,'각성 표시');
  for(const k in u0)qOk(+u.stats[k]>=+u0[k],'최고값 '+k);qOk(u.stats.all===u0.all,'+모든 스킬 그대로');const D=UNIQ.concat(BOSSU).find(x=>x.n===u.name);
  for(let i=0;i<30;i++){const o=fixedStats(D.st,u.il);for(const k in o)if(k!==u.awx)qOk(+u.stats[k]>=+o[k]*.99,`각성 ${k} ${u.stats[k]} < 굴림 ${o[k]}`)}
  return `6벌 · 핵심과 같은 칸 · 각성 ${u.name}`});
qT(QE2,'저장: P.e22(룬석 주머니 · 아는 룬 문장) 왕복 · 장비 안의 so/awk/awx/esp 그대로 · 모르는 칸 보존 · 없는 저장은 기본값(빈 값을 안 씀) · 예전 저장(v5 견본) 장비는 그대로 · 엉터리 값 다듬기 · 창고 룬석 주머니 왕복',()=>{qPrep('mage',{lvl:140});E22.quiet=1;const sk=STASHKEY();let raw0=null;try{raw0=localStorage.getItem(sk)}catch(_){}try{
  P.e22={rs:{ig1:3,vel2:1},rw:['ig_vel'],zz:{a:1}};const it=e22MakeSet('mage',140,'staff');it.so=['ig1',null];P.gear.staff=it;const aw=e22Awaken(makeItem(140,true,null,'uniq'));P.bag.push(aw);
  let d=JSON.parse(JSON.stringify(saveData()));qOk(d.e22&&d.e22.rs.ig1===3&&d.e22.rw[0]==='ig_vel'&&d.e22.zz.a===1,'저장 '+JSON.stringify(d.e22));
  qOk(load(d,QA_SLOT),'load');qOk(P.e22.rs.ig1===3&&P.e22.rs.vel2===1&&P.e22.rw.includes('ig_vel')&&P.e22.zz.a===1,'불러오기 '+JSON.stringify(P.e22));
  qOk(P.gear.staff.so[0]==='ig1'&&P.gear.staff.so[1]===null&&P.gear.staff.set==='e22_mage'&&P.gear.staff.esp==='staff'&&setCount('e22_mage')===1,'세트 장비');const aw2=P.bag.find(x=>x.awk);qOk(aw2&&aw2.awx&&aw2.stats[aw2.awx]>0,'각성 장비');
  d=JSON.parse(JSON.stringify(saveData()));delete d.e22;qOk(load(d,QA_SLOT),'load2');qOk(e22RuneTotal()===0&&P.e22.rw.length===0&&!('e22' in saveData()),'없으면 기본값 · 빈 값을 안 씀');
  for(const k of ['v5','v4','v1old']){const o=JSON.parse(JSON.stringify(QA_FIX[k]));const its=JSON.stringify([...Object.values(o.gear||{}),...(o.bag||[])].filter(Boolean).map(x=>[x.name,x.stats]));qOk(load(o,QA_SLOT),'load '+k);
    const now=[...Object.values(P.gear),...P.bag].filter(Boolean);qOk(!now.some(x=>'so' in x||'awk' in x||'esp' in x)&&JSON.stringify(now.map(x=>[x.name,x.stats])).length>=2,'예전 저장 '+k);qOk(e22RuneTotal()===0&&!('e22' in saveData()),'기본값 '+k);void its}
  const c=e22Clean({rs:{ig1:'3',zz9:4,vel4:2,nae1:-2,as2:1e9},rw:['ig_vel','nope','ig_vel',3]});qOk(JSON.stringify(c.rs)==='{"ig1":3,"as2":9999}'&&c.rw.length===1,'다듬기 '+JSON.stringify(c));
  qPrep('mage',{lvl:140});localStorage.setItem(sk,JSON.stringify({v:1,items:[QA_ITEM(901,'staff',2,'창고 지팡이',20,{int:30})],gold:7}));e22RuneAdd('ig1',2);e22RuneAdd('kro3',1);
  qOk(e22StashMove(1)===3&&e22RuneTotal()===0,'맡기기');let s=JSON.parse(localStorage.getItem(sk));qOk(s.rs.ig1===2&&s.rs.kro3===1&&s.items.length===1&&s.gold===7,'창고 기록 '+JSON.stringify(s.rs));
  stashWrite(stashRead());s=JSON.parse(localStorage.getItem(sk));qOk(s.rs&&s.rs.ig1===2,'다른 창고 쓰기에도 남음');qPrep('warrior',{lvl:140});qOk(e22StashMove(-1)===3&&e22RuneHave('ig1')===2&&e22RuneHave('kro3')===1,'다른 캐릭터가 찾기');
  s=JSON.parse(localStorage.getItem(sk));qOk(!s.rs&&s.items.length===1,'창고 비움 '+JSON.stringify(s));qOk(saveData().e22.rs.ig1===2,'캐릭터 저장');
  }finally{E22.quiet=0;try{if(raw0==null)localStorage.removeItem(sk);else localStorage.setItem(sk,raw0)}catch(_){}}return '왕복 · 예전 저장 · 창고'});
qT(QE2,'툴팁 · 목록 · 아이콘 · 도감: 홈(박힌 룬석 이름 · 능력 · 빈 홈) · 룬 문장 · 각성 줄과 잿빛 금색 이름 · 엔드 세트 n/6 · 2/4/6벌 · 갈래 · 「세트냐 핵심이냐」(핵심 장비에도) · 아이콘 홈 점 · 각성 빛 · 도감 넷',()=>{qPrep('mage',{lvl:140});
  const it=qE2It('staff',['ig2',null]);let h=itemTip(it);qOk(h.includes('룬 홈 2개')&&h.includes('불의 룬 「이그」 2등급')&&h.includes('빈 홈 2'),'홈 줄');
  it.so[1]='vel1';h=itemTip(it);qOk(h.includes('룬 문장 「불타는 폭풍」'),'문장');
  const aw=e22Awaken(makeItem(140,true,null,'uniq'));h=itemTip(aw);qOk(h.includes('각성 · 모든 수치가')&&h.includes('e22awkn'),'각성');
  const sp=e22MakeSet('mage',140,'robe');h=itemTip(sp);qOk(h.includes('잿빛 별의 현자 직업 엔드 세트 (0/6 착용)')&&h.includes('6벌 (대마법사)')&&h.includes('6벌 (정령왕의 계약자)')&&h.includes('세트냐 핵심이냐'),'세트 '+h.slice(0,300));
  qOk(itemTip(makeCore21('c_sunash',140,'mage')).includes('세트냐 핵심이냐'),'핵심 장비 줄');
  const ic=itemIcon(it);qOk(ic.includes('e22so')&&(ic.match(/<b /g)||[]).length===2,'아이콘 점');qOk(itemIcon(qE2It('robe',[null])).includes('<b class="e">'),'빈 홈 점');qOk(itemIcon(aw).includes('e22awk'),'각성 아이콘');
  const row=itemRow(it,'');qOk(row.includes('룬 홈: ')&&row.includes('「불타는 폭풍」'),'목록 줄');qOk(itemRow(aw,'').includes('e22awkn'),'목록 이름 색');
  P.gear.staff=it;P.gear.robe=sp;const sh=setsHtml();qOk(sh.includes('잿빛 별의 현자')&&sh.includes('불타는 폭풍'),'캐릭터 창 세트 효과');
  const cx=cxItems();qOk(cx.includes('직업 엔드 세트')&&cx.includes('각성 유니크')&&cx.includes('룬 문장')&&cx.includes('별을 쫓는 사냥꾼')&&cx.includes('「솔」'),'도감');
  return '툴팁 · 목록 · 아이콘 · 도감'});
qT(QE2,'대장장이 「룬 홈 · 룬석」 칸: 140에 무기상(잡화점 X) · 장비 고르기 → 홈 고르기 → 박기/바꾸기 · 빼기 · 합치기 단추 · 휴대폰 폭 390에 맞음 · 툴팁 폭 · 창고 룬석 주머니 단추',()=>{qPrep('mage',{lvl:140});E22.quiet=1;
  P.ash=50;const it=qE2It('staff',[null,null]);P.bag.push(it);e22RuneAdd('ig1',4);e22RuneAdd('vel1',1);const t=ALLTOWNS.find(t=>(t.shops||[]).some(s=>s.type==='weapon'));actTown=t;actShop='general';
  try{qOk(!shopHtml().includes('룬 홈 · 룬석'),'잡화점에 보임');actShop='weapon';tab='shop';panel.hidden=false;renderPanel();qOk(pbody.innerHTML.includes('룬 홈 · 룬석'),'무기상');
  pbody.querySelector(`[data-e22s="${it.id}"]`).click();pbody.querySelector('[data-e22in="ig1"]').click();qOk(it.so[0]==='ig1'&&e22RuneHave('ig1')===3,'박기 단추');
  pbody.querySelector('[data-e22k="1"]').click();pbody.querySelector('[data-e22in="vel1"]').click();qOk(it.so[1]==='vel1'&&pbody.innerHTML.includes('룬 문장 「불타는 폭풍」'),'홈 2 · 문장');
  pbody.querySelector('[data-e22mg="ig1"]').click();qOk(e22RuneHave('ig2')===1&&e22RuneHave('ig1')===0&&P.ash===47,'합치기 단추');pbody.querySelector('[data-e22rm="0"]').click();qOk(it.so[0]===null,'빼기 단추');
  const card=panel.querySelector('.card'),sw=card.style.width,sm=card.style.maxWidth;card.style.width='358px';card.style.maxWidth='358px';
  try{renderPanel();const cr=card.getBoundingClientRect();qOk(pbody.scrollWidth<=pbody.clientWidth+2,`가로 넘침 ${pbody.scrollWidth}/${pbody.clientWidth}`);
    const bad=[...pbody.querySelectorAll('.e22box button,.e22box .e22row span')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&r.right>cr.right+1});qOk(!bad.length,'밖으로 나간 칸 '+bad.length);
    const cell=pbody.querySelector('.e22pick[data-tip]');qOk(cell&&tipShowFor(cell),'툴팁');const tw=document.getElementById('itip').offsetWidth;qOk(tw<=300,'툴팁 폭 '+tw);tipHide();
    tab='stash';e22RuneAdd('ig1',1);renderPanel();qOk(pbody.innerHTML.includes('룬석 주머니')&&pbody.querySelector('[data-e22st="1"]'),'창고 칸');qOk(pbody.scrollWidth<=pbody.clientWidth+2,'창고 넘침')}
  finally{card.style.width=sw;card.style.maxWidth=sm}}finally{E22.quiet=0;qClosePanels()}return '무기상 · 390'});
/* ===== v22 DEEP: 미궁 심층 · 군주의 메아리 (deep22.js · lord22.js) ===== */
const QDP='심층·군주 v22';
const qDpPrep=(cls,lvl)=>{qMzPrep(cls||'mage',lvl||140);MZD.qaWeek=null;B4.qaWeek=null;P.b4=b4Clean(null);P.w3={lord:1};P.dark=darkClean({open:10,cur:0,top:9});P.ash=0;return P};
const qDpEnd=()=>{MZD.qaWeek=null;B4.qaWeek=null;qPtyOff();qMzEnd()};
const qDpWk=(id,avoid)=>{for(let w=2900;w<3600;w++){const a=mzdAffix(w);if((id==null||a.includes(id))&&!(avoid||[]).some(x=>a.includes(x)))return w}return null};
const qDpExp=(e,a)=>{const t=TYPES[e.k],L=e.lvl,R0=a.rules,m=1-(R0.includes('heavy')?.15:0)-(R0.includes('crowd')?.2:0);let v=Math.round(clamp(t.hp,220,900)*(1+.34*(L-1))*(e.elite?3:1));if(m!==1)v=Math.max(1,Math.round(v*m));
  return Math.max(1,Math.round(v*(1+.4*a.dt+(a.dw.includes('ash')?.15:0)-(a.dw.includes('swarm')?.1:0))))};
const qB4Kill=e=>{const k=o=>{for(let i=0;i<60&&!o.dead&&!o.down;i++)hurtE(o,o.max+10,{cls:P.cls,el:'arcane',proc:1})};if(e.mg){const [a,b]=e.mg.mem;k(b);k(a)}else k(e)};
const qB4Party=n=>{const o=qPty(n,{host:true});return o};
const qB4In=()=>{for(const p of NET.peers.values()){p.area=netArea();p.seen=1;p.dead=false;p.x=p.tx=P.x+60;p.y=p.ty=P.y}};
qT(QDP,'미궁 심층 ① 92층부터 끝없이(140레벨): 층 레벨 140 고정 · 어둠 단계 세기 92~100=1 · 101=2 · 190=10 · 191↑ 조금씩 · 생명력 +40%·단계(덧셈) · 졸개 · 정예 한 대 피해는 오르타 상한 그대로 · 139레벨은 91층까지',()=>{const out=[];
  try{qDpPrep();qOk(MZ.maxFloor()>=999&&MZD.from===92,'최고 층 '+MZ.maxFloor());
    qOk([91,92,100,101,110,111,190].map(mzdTier).join()==='0,1,1,2,2,3,10'&&mzdTier(191)>10&&mzdTier(260)>mzdTier(191)&&mzdTier(260)<20,'단계 '+[91,92,100,101,190,191,260].map(mzdTier));
    for(const f of [92,150,205]){mzFloor(f);const a=DG.a21;qOk(DG.lvl===140&&a.dt===mzdTier(f)&&a.dw.length===2&&a.dw.join()===mzdAffix(mzdWeek()).join(),`${f}층 ${DG.lvl} ${a.dt} ${a.dw}`);
      const T0=qMzTagged();qOk(T0.length>=4&&T0.every(e=>(e.mzd||e.mirror)&&e.lvl>=140&&e.lvl<=142),f+'층 몬스터');const bad=[];
      for(const e of T0){const t=TYPES[e.k];if(e.mirror)continue;if(!t.boss&&!t.mini){if(!(e.dmg<=qA3Cap(e)+1e-6))bad.push(`${e.k} 피해 ${Math.round(e.dmg)}>${Math.round(qA3Cap(e))}`);if(e.max!==qDpExp(e,a))bad.push(`${e.k} 생명력 ${e.max}≠${qDpExp(e,a)}`)}
        else if(!(Math.abs(e.dmg-dm21Cap(e.k,e.lvl,0)*.9*(1+.06*a.dt))<1e-6))bad.push(`${e.k} 보스 피해 ${Math.round(e.dmg)}`)}
      qOk(!bad.length,f+'층 '+bad.slice(0,4).join(' / '));qOk(a.need===Math.ceil(a.total*.8)&&a.total===T0.length,`${f}층 필요 ${a.need}/${a.total}/${T0.length}`);out.push(`${f}층 어둠 ${a.dt}`);leaveDungeon()}
    P.maze=mzClean({best:100,day:MZ.qaDay,step:96});qOk(mzStartFloor()===96&&mzEnter(96)&&DG.a21.f===96,'96층으로 못 들어감 '+mzStartFloor());leaveDungeon();
    mzFloor(91);const a91=DG.a21;qOk(!('dt' in a91)&&!('dw' in a91)&&qMzTagged().every(e=>!e.mzd),'91층에 심층');for(const e of qMzTagged())killE(e);qStep(3,{render:false});qOk(a91.open&&DG.portals.some(p=>p.dm21==='mzn'),'91층 다음 짝문 없음');leaveDungeon();
    P.lvl=139;qOk(MZ.maxFloor()===91&&mzStartFloor()===91,'139레벨 '+MZ.maxFloor());mzEnter(96);qOk(DG&&DG.a21.f===91,'139레벨 '+(DG&&DG.a21.f));for(const e of qMzTagged())killE(e);qStep(3,{render:false});qOk(DG.a21.open&&!DG.portals.some(p=>p.dm21==='mzn'),'139레벨인데 92층 짝문');
    return out.join(' · ')}finally{qDpEnd()}});
qT(QDP,'미궁 심층 ② 미궁의 기운: 주마다(월요일) 둘 · 원소 기운은 하나까지 · 같은 주는 같음 · 정예 둘씩 · 호위 · 무리 · 원소 피해 ±20% · 재 · 급한 주',()=>{const out=[];
  try{qDpPrep();const seen=new Set(),sets=new Set();for(let w=2900;w<2960;w++){const a=mzdAffix(w);qOk(a.length===2&&a[0]!==a[1]&&a.filter(id=>MZDA[id].g==='el').length<=1&&a.join()===mzdAffix(w).join(),'주 '+w+' '+a);a.forEach(id=>seen.add(id));sets.add(a.slice().sort().join())}
    qOk(seen.size===MZD_AFX.length&&sets.size>=8,`기운 ${seen.size} · 조합 ${sets.size}`);
    qOk(mzdWeek('2026-10-12')===mzdWeek('2026-10-11')+1&&mzdWeek('2026-10-09')===mzdWeek('2026-10-11')&&mzdWeek('2026-10-05')===mzdWeek('2026-10-11'),'월요일에 바뀜');
    const CNT=['pair','guard','swarm'];
    const at=(w,f)=>{MZD.qaWeek=w;if(typeof K22==='object'&&K22.m)K22.m.clear();QA.reseed(7);mzFloor(f);const a=DG.a21,T0=qMzTagged();return{a,n:T0.length,el:T0.filter(e=>e.elite).length,nb:T0.filter(e=>!TYPES[e.k].boss&&!TYPES[e.k].mini&&!e.mirror).length}};
    const w0=qDpWk(null,CNT);qOk(w0!=null,'기운 없는 주');
    {const w=qDpWk('pair',['guard','swarm']);let f=92,p0=null;for(;f<140;f++){if(f%5===0)continue;p0=at(w0,f);leaveDungeon();if(p0.el>0)break}
      const p1=at(w,f);qOk(p1.el>p0.el&&p1.el>=p0.el*2-1,`정예 ${p0.el}→${p1.el}`);out.push(`정예 ${p0.el}→${p1.el}`);leaveDungeon()}
    {const w=qDpWk('guard',['pair','swarm']);const p0=at(w0,95);leaveDungeon();const p1=at(w,95);qOk(p1.el>=p0.el+2&&qMzTagged().some(e=>TYPES[e.k].mini),`호위 ${p0.el}→${p1.el}`);out.push('호위');leaveDungeon()}
    {const w=qDpWk('swarm',['pair','guard']);const p0=at(w0,93);leaveDungeon();const p1=at(w,93);qOk(p1.n>=p0.n+Math.round(p0.nb*.25)-1,`무리 ${p0.n}→${p1.n}`);out.push(`무리 ${p0.n}→${p1.n}`);leaveDungeon()}
    {const w=qDpWk('ember');const p1=at(w,93),e0=qMzTagged().find(o=>!TYPES[o.k].boss&&!TYPES[o.k].mini&&!o.mirror);qOk(mzdHas('ember'),'불 기운');
      const hit=(el,on)=>{const o=dgMob(e0.k,P.x+300,P.y,140);o.hp=o.max=1e8;o.atkCd=1e9;const keep=DG.a21.dw;if(!on)DG.a21.dw=[];QA.reseed(31);const h=o.hp;try{hurtE(o,1000,{cls:P.cls,el,proc:1})}finally{DG.a21.dw=keep}o.dead=true;return h-o.hp};
      const f1=hit('fire',1),f0=hit('fire',0),i1=hit('ice',1),i0=hit('ice',0),a1=hit('arcane',1),a0=hit('arcane',0);
      qOk(f0>0&&Math.abs(f1/f0-.8)<.02&&Math.abs(i1/i0-1.2)<.02&&Math.abs(a1/a0-1)<.02,`불 ${f1}/${f0} · 냉기 ${i1}/${i0} · 비전 ${a1}/${a0}`);out.push('불 −20% · 냉기 +20%');void p1;leaveDungeon()}
    {qOk(mzdAshN(100,1,['ash'])===Math.round(mzdAshN(100,1,[])*1.5)&&mzdAshN(100,1,[])===1+0+2+0+5+1&&mzdAshN(93,3,[])===2,'재 '+[mzdAshN(100,1,[]),mzdAshN(93,3,[])]);out.push('재')}
    {const w=qDpWk('haste');const p1=at(w,93),e=qMzTagged().find(o=>!TYPES[o.k].boss&&!TYPES[o.k].mini&&!o.mirror&&TYPES[o.k].spd>=80&&!TYPES[o.k].ranged);void p1;
      if(e){const r=DG.rooms.find(rm=>rm!==DG.start)||DG.rooms[0],c=tc(r.cx,r.cy);const run=on=>{const keep=DG.a21.dw;if(!on)DG.a21.dw=[];for(const o of enemies)if(o!==e){o.atkCd=1e9;o.aggroed=false;o.x=o.wx=c.x+2000}
          e.x=c.x-150;e.y=c.y;e.aggroed=true;e.atkCd=1e9;e.slowT=0;e.freezeT=0;e.stunT=0;P.x=c.x+150;P.y=c.y;try{qStep(12,{render:false,each:()=>{P.x=c.x+150;P.y=c.y}})}finally{DG.a21.dw=keep}return Math.hypot(e.x-(c.x-150),e.y-c.y)};
        const d1=run(1),d0=run(0);qOk(d0>5&&d1>d0*1.08,`급한 주 ${Math.round(d1)}/${Math.round(d0)}`);out.push('급한 주')}
      leaveDungeon()}
    return out.join(' · ')}finally{qDpEnd()}});
qT(QDP,'미궁 심층 ③ 기록 · 보상: 혼자 · 2인 · 3인 최고 층과 이번 주 최고 · 층마다 재의 결정 · 10층마다 심층 상자(end22Drop deep) · 101 · 126 · 151층 첫 돌파 스킬 포인트 +1(한 번만) · 91층까지는 예전 그대로',()=>{const out=[],calls=[];let keep=null;
  try{qDpPrep();if(typeof end22Drop==='function'){keep=end22Drop;end22Drop=function(){calls.push([...arguments]);return []}}
    const clear=f=>{mzFloor(f);const a=DG.a21;for(const e of qMzTagged())killE(e);qStep(3,{render:false});qOk(a.open,f+'층 안 열림');return a};
    let ash=P.ash|0;const a100=clear(100);qOk(P.maze.dp&&P.maze.dp.s===100&&P.maze.dp.wb===100&&P.maze.dp.wk===mzdWeek(),'기록 '+JSON.stringify(P.maze.dp));const n100=mzdAshN(100,a100.dt,a100.dw);qOk((P.ash|0)-ash===n100,`재 ${P.ash-ash}/${n100}`);
    qOk(!P.maze.got.includes(100),'심층 10층이 칭호 목록에');
    if(keep)qOk(calls.length===1&&calls[0][0]==='deep'&&calls[0][1]===1&&calls[0][4]&&calls[0][4].chest===1,'심층 상자 '+JSON.stringify(calls));else qOk(loot.filter(l=>l.kind==='item').length>=2,'상자 없음');out.push(`100층 재 +${n100}`);leaveDungeon();
    const sp=P.sp|0;clear(101);qOk((P.sp|0)===sp+1&&P.maze.dp.sp.includes(101),'101층 스킬 포인트');leaveDungeon();clear(101);qOk((P.sp|0)===sp+1,'두 번 받음');leaveDungeon();
    qOk(P.maze.dp.s===101&&P.maze.best===101,'혼자 기록');const c0=calls.length;clear(99);qOk(calls.length===c0,'10층이 아닌데 상자');leaveDungeon();
    qB4Party(2);clear(103);qOk(P.maze.dp.d===103&&P.maze.dp.s===101,'2인 기록 '+JSON.stringify(P.maze.dp));leaveDungeon();qPtyOff();
    qB4Party(3);clear(104);qOk(P.maze.dp.t===104,'3인 기록');leaveDungeon();qPtyOff();out.push('혼자 101 · 2인 103 · 3인 104');
    MZD.qaWeek=mzdWeek()+1;clear(95);qOk(P.maze.dp.wb===95&&P.maze.dp.wk===mzdWeek(),'새 주 '+JSON.stringify(P.maze.dp));leaveDungeon();MZD.qaWeek=null;
    qDpPrep();ash=P.ash|0;clear(90);qOk(!('dp' in P.maze)&&(P.ash|0)===ash&&P.maze.got.includes(90),'90층 '+JSON.stringify(P.maze));out.push('90층 그대로');
    leaveDungeon();qDpPrep();P.maze.dp={s:120,d:0,t:0,wk:mzdWeek(),wb:120,sp:[]};v20Open('maze');const h=pbody.innerHTML;qOk(h.includes('미궁 심층')&&h.includes('이번 주 미궁의 기운')&&h.includes('혼자 <b>120</b>')&&mzdAffix(mzdWeek()).every(id=>h.includes(MZDA[id].n)),'미궁 창');
    const card=panel.querySelector('.card'),sw=card.style.width,sm=card.style.maxWidth;card.style.width='358px';card.style.maxWidth='358px';
    try{renderPanel();qOk(pbody.scrollWidth<=pbody.clientWidth+2,`390 가로 넘침 ${pbody.scrollWidth}/${pbody.clientWidth}`)}finally{card.style.width=sw;card.style.maxWidth=sm;closePanel()}out.push('미궁 창 · 390');
    return out.join(' · ')}finally{if(keep)end22Drop=keep;qDpEnd()}});
qT(QDP,'미궁 심층 ④ 저장 · 같이 하기: 기록 기본값(없으면 안 씀) · 왕복 · 모르는 칸 보존 · 엉터리 값 다듬기 · 참가자는 방장의 단계 · 기운을 층 데이터로 받음',()=>{
  try{qDpPrep();let d=saveData();qOk(!('maze' in d),'빈 미궁 저장');P.maze.dp={s:120,d:130,t:140,wk:2950,wb:118,sp:[101],zz:1};d=saveData();qOk(d.maze&&d.maze.dp&&d.maze.dp.t===140&&d.maze.dp.zz===1,'저장');
    qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT)&&P.maze.dp.s===120&&P.maze.dp.sp.join()==='101'&&P.maze.dp.zz===1,'불러오기 '+JSON.stringify(P.maze.dp));
    d.maze.dp={s:'x',d:-3,t:5000,sp:[101,101,'a',-1],wk:'q'};qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT),'load2');const c=P.maze.dp;qOk(c.s===0&&c.d===0&&c.t===999&&c.sp.join()==='101'&&c.wk===0,'다듬기 '+JSON.stringify(c));
    d.maze.dp=[1,2];qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT)&&!('dp' in P.maze),'배열 dp');
    const w=qDpWk('thaw');qDpPrep();MZD.qaWeek=w;const {sent}=qB4Party(2);mzFloor(96);const dg=sent.filter(m=>m.t==='dg').pop();qOk(dg&&dg.d.a21.dt===1&&dg.d.a21.dw.join()===mzdAffix(w).join(),'dg에 기운 없음');
    const D=JSON.parse(JSON.stringify(dg.d));qPtyOff();qDpPrep('priest',140);MZD.qaWeek=w+1;qPty(2);NET.guest=true;NET.hostId='qa_peer';netEnterDg(D);
    qOk(DG&&DG.a21.f===96&&DG.a21.dw.join()===mzdAffix(w).join()&&mzdHas('thaw'),'참가자 기운 '+(DG&&DG.a21.dw));qOk(banner&&banner.sub.includes('심층'),'참가자 이름표');render();return '왕복 · 참가자'}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ① 메아리의 거울: 등대지기의 집(등불과 떨어져) · 재의 군주 전엔 어둠 · F로 창 · 다섯 보스 + 숨은 보스(잠김) · 이번 주의 메아리 · 휴대폰 폭 390 · 창에서 들어가기',()=>{
  try{qDpPrep('warrior',140);P.diff=2;const d=B4.mirror;qOk(d&&RCACHE.capital.decor.includes(d),'거울 없음');const T=RCACHE.capital.town;qOk(T&&T.id==='keeperhouse'&&Math.hypot(d.x-T.x,d.y-T.y)<560,'등대지기의 집 곁 아님');
    qOk(!D21.lamp||Math.hypot(D21.lamp.x-d.x,D21.lamp.y-d.y)>80,'등불과 겹침');P.w3={lord:0};qOk(!sqUseLive(d),'어두운데 보임');qOk(!b4Enter('elgaros')&&!DG,'어두운데 들어감');P.w3={lord:1};qOk(sqUseLive(d),'안 보임');
    qWxTo('capital');const a=qActAt(d.x+30,d.y+30);qOk(a==='tw_use'&&TW.act===d,'act '+a);render();doAct();qOk(!panel.hidden&&$('#ptitle').textContent.includes('메아리의 거울'),'창');
    const h=pbody.innerHTML;qOk(B4_LIST.every(b=>h.includes(b.n))&&h.includes('이번 주의 메아리')&&h.includes(B4_BY[b4Feat()].n),'다섯 · 이번 주');qOk(!pbody.querySelector('[data-v20a="b4go"][data-v20b="named"]')&&h.includes('어둠 10단계에서 재의 군주'),'숨은 보스 잠김');
    B4.qaWeek=5;const f5=b4Feat();B4.qaWeek=6;qOk(b4Feat()!==f5,'이번 주의 메아리가 안 바뀜');B4.qaWeek=null;
    const card=panel.querySelector('.card'),sw=card.style.width,sm=card.style.maxWidth;card.style.width='358px';card.style.maxWidth='358px';
    try{renderPanel();const cr=card.getBoundingClientRect();qOk(pbody.scrollWidth<=pbody.clientWidth+2,`가로 넘침 ${pbody.scrollWidth}/${pbody.clientWidth}`);const bad=[...pbody.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&(r.right>cr.right+1||r.left<cr.left-1)});qOk(!bad.length,'밖 단추 '+bad.length)}
    finally{card.style.width=sw;card.style.maxWidth=sm}
    P.lvl=139;renderPanel();qOk(pbody.querySelector('[data-v20a="b4go"][data-v20b="choir"]').disabled&&!b4Enter('choir'),'139레벨 입장');P.lvl=140;renderPanel();
    qClick('#pbody [data-v20a="b4go"][data-v20b="choir"]');qOk(DG&&DG.b4&&DG.b4.id==='choir'&&DG.boss&&DG.boss.k==='b4_choir'&&panel.hidden,'창에서 들어가기');render();
    const cx=cxGroups();qOk(cx.filter(g=>B4_KEYS.some(k=>g[1].includes(k))).length===1&&monInfo('b4_named').lv===MAXLV,'도감');
    return '거울 · 창 · 390'}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ② 다섯 보스 혼자: 140레벨 · 생명력(지옥 기준 + 어둠 단계 덧셈) · 맞는 크기(hR) · 기믹이 실제로 돈다 · 혼자 쓰러뜨림 · 재의 결정 · 상급 상자 · 첫 처치 스킬 포인트',()=>{const out=[];
  try{for(const b of B4_LIST){qDpPrep('mage',140);P.dark.cur=3;const sp=P.sp|0,ash=P.ash|0;qOk(b4Enter(b.id),b.id+' 못 들어감');const e=DG.boss,t=TYPES[b.k];
      qOk(e&&e.k===b.k&&e.lvl===140&&DG.b4.tier===3,b.id+' 보스');const hp=Math.round(t.hp*(1+.34*139)*DIFF[2].hp*(1+.4*3));qOk(Math.abs(e.max-hp)<=1&&Math.abs(e.dmg-t.dmg*(1+.18*139)*1.18)<1e-6,`${b.id} 생명력 ${e.max}/${hp}`);
      qOk(hR(e)>=e.r&&hR(e)>=Math.round(16*t.sc)-1,'맞는 크기 '+hR(e));
      e.aggroed=true;if(e.mg)e.mg.mem[1].aggroed=true;P.x=e.x+220;P.y=e.y+120;const seen=new Set(),A=B4.ar;if(b.id==='morgath')e.hp=Math.round(e.max*.6);
      qStep(42*60,{render:false,each:()=>{P.hp=maxHp();P.mp=maxMp();if(A.orbs.length)seen.add('orb');if(A.br.length)seen.add('brand');if(A.ch)seen.add('sing');if(A.cn)seen.add('chant'+A.cn);if(enemies.some(o=>o.gsh&&o.b4&&!o.dead))seen.add('shell')}});
      const want={morgath:['shell'],elgaros:['orb'],ashname:['brand'],choir:['sing'],ashlord:['chant1','chant2']}[b.id];qOk(want.every(k=>seen.has(k)),`${b.id} 기믹 ${[...seen]}`);render();
      qB4Kill(e);qStep(2,{render:false});qOk(e.dead&&DG.bossDead,b.id+' 안 쓰러짐');qOk(P.b4.got.includes(b.id)&&P.b4.first.includes(b.id)&&(P.sp|0)===sp+1&&(P.ash|0)>ash,`${b.id} 보상 sp ${P.sp-sp} 재 ${P.ash-ash}`);
      out.push(`${b.id} ${Math.round(e.max/1000)}k`);qMzEnd()}
    return out.join(' · ')}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ③ 모르가스: 두 몸 차이가 벌어지면 더 깎인 몸에 재의 껍질(받는 피해 −80%) · 덜 깎인 몸 피해 +25% · 한 몸이 쓰러지면 혼자 15초(파티 10초) 안에 다른 몸도 · 늦으면 40%로 일어섬',()=>{
  try{qDpPrep();b4Enter('morgath');const e=DG.boss,B=e.mg,tw=B&&B.mem[1];qOk(tw&&tw.k==='b4_morgath2'&&tw.clone&&B.win===15,'두 몸');e.aggroed=tw.aggroed=true;const keep=()=>{e.atkCd=tw.atkCd=1e9;e.skT=tw.skT=1e9;P.hp=maxHp()};
    e.hp=e.max*.6;qStep(2,{render:false,each:keep});qOk(e.gsh&&!tw.gsh&&tw.b4rg&&Math.abs(tw.dmg-tw.b4d0*1.25)<1e-6&&PTY.dmgMul(e,0)<=.2+1e-9,'껍질');
    e.hp=e.max*.75;qStep(2,{render:false,each:keep});qOk(e.gsh,'반쯤 좁혀도 그대로');tw.hp=tw.max*.8;qStep(2,{render:false,each:keep});qOk(!e.gsh&&!tw.gsh&&Math.abs(tw.dmg-tw.b4d0)<1e-6,'벗겨짐');
    const k=o=>{for(let i=0;i<60&&!o.dead&&!o.down;i++)hurtE(o,o.max+10,{cls:P.cls,el:'arcane',proc:1})};k(tw);qOk(tw.down&&!tw.dead&&B.t0>0,'안 쓰러짐');qStep(2,{render:false,each:keep});qOk(!e.gsh,'한 몸만 남았는데 껍질');
    qStep(16*60,{render:false,each:keep});qOk(!tw.down&&Math.abs(tw.hp-Math.round(tw.max*.4))<=2,'안 일어섬 '+tw.hp);
    k(tw);k(e);qStep(2,{render:false});qOk(e.dead&&tw.dead&&DG.bossDead,'함께 쓰러뜨렸는데');qOk(P.b4.got.includes('morgath')&&P.b4.kc.morgath===1,'보상 한 번 '+JSON.stringify(P.b4));
    qMzEnd();qDpPrep();qB4Party(2);b4Enter('morgath');qB4In();qStep(1,{render:false});qOk(DG.boss.mg.win===10,'파티 10초');const e2=DG.boss,t2=e2.mg.mem[1];e2.hp=e2.max*.8;t2.hp=t2.max*.95;qStep(2,{render:false});qOk(e2.gsh,'파티는 0.12에서 껍질');
    return '껍질 · 15초 · 일어섬 · 파티 10초'}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ④ 엘가로스: 공허 구슬이 위협 1위를 쫓음 · 위협 1위가 바뀌면 방향을 바꿈 · 닿으면 터짐(곁의 동료도) · 9초면 그 자리에서 터짐 · 혼자는 드물고 약함',()=>{
  try{qDpPrep();const {r,sent}=qB4Party(3);b4Enter('elgaros');qB4In();const e=DG.boss,A=B4.ar;e.aggroed=true;const ex=e.x,ey=e.y,keep=()=>{e.atkCd=1e9;e.skT=1e9;P.hp=maxHp();e.x=ex;e.y=ey};
    r.x=r.tx=e.x+400;r.y=r.ty=e.y;P.x=e.x-400;P.y=e.y;const r2=NET.peers.get('qa_peer2');r2.x=r2.tx=e.x;r2.y=r2.ty=e.y+400;PTY.thr(e,r.id,1e7);
    qStep(1,{render:false,each:keep});e.b4oT=0;qStep(2,{render:false,each:keep});qOk(A.orbs.length===1,'구슬 없음');const o=A.orbs[0];
    qStep(150,{render:false,each:()=>{keep();r.x=r.tx=e.x+400;r.y=r.ty=e.y;r2.x=r2.tx=e.x;r2.y=r2.ty=e.y+400}});qOk(o.tk===r.id&&o.x>e.x+80,'동료를 안 쫓음 '+o.tk+' '+Math.round(o.x-e.x));
    PTY.thr(e,0,1e10);const m=qMsgs(()=>qStep(3,{render:false,each:keep}));qOk(o.tk===0&&m.some(t=>t.includes('방향을 바꿉니다')),'방향 안 바뀜 '+o.tk);
    P.invT=0;const h0=P.hp=maxHp();P.x=o.x;P.y=o.y;r2.x=r2.tx=o.x+60;r2.y=r2.ty=o.y;const ns=sent.length;qStep(1,{render:false,each:()=>{e.atkCd=1e9;e.skT=1e9}});
    qOk(o.done&&!A.orbs.includes(o),'안 터짐');qOk(P.hp<h0,'나 안 맞음');qOk(sent.slice(ns).some(x=>x.t==='hit'&&x.to==='qa_peer2'),'곁의 동료 안 맞음');P.invT=1e9;
    e.b4oT=0;qStep(2,{render:false,each:keep});const o2=A.orbs[0];qOk(o2&&o2!==o,'둘째 구슬');qOk(e.b4oT>13&&e.b4oT<=14,'파티 간격 '+e.b4oT);qStep(11*60,{render:false,each:()=>{keep();P.x=o2.x+700;P.y=o2.y}});qOk(o2.done,'9초에 안 터짐');
    qOk(sent.some(x=>x.t==='v20x'&&x.k==='b4s'&&Array.isArray(x.o)),'b4s 안 보냄');
    qPtyOff();qMzEnd();qDpPrep();b4Enter('elgaros');const e3=DG.boss;e3.aggroed=true;e3.b4oT=0;qStep(2,{render:false,each:()=>{e3.atkCd=1e9;e3.skT=1e9}});const o3=B4.ar.orbs[0];qOk(o3&&o3.solo&&e3.b4oT>19,'혼자 간격 '+e3.b4oT);
    P.invT=0;P.hp=maxHp();const hp1=P.hp;o3.t=0;P.x=o3.x;P.y=o3.y;qStep(1,{render:false,each:()=>{e3.atkCd=1e9;e3.skT=1e9}});const lost=hp1-P.hp;qOk(o3.done&&lost>0&&lost<e3.dmg*2.4*.6+1,'혼자 터짐 '+Math.round(lost));
    return '쫓기 · 바꾸기 · 터짐 · 9초'}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ⑤ 재의 군주의 그림자: 재의 낙인(매초 생명력 · 90% 위로 채우면 씻김 · 10초면 둘레에 번짐) · 잿불 숨결 · 혼자는 약하고 수호 정령이 치유',()=>{
  try{qDpPrep('priest',140);b4Enter('ashname');const e=DG.boss,A=B4.ar;e.aggroed=true;const keep=()=>{e.atkCd=1e9;e.skT=1e9;e.b4pT=99};P.invT=0;P.x=e.x+200;P.y=e.y;
    e.b4bT=0;qStep(1,{render:false,each:keep});qOk(A.br.length===1&&A.br[0].p===P,'혼자 낙인');P.hp=maxHp()*.5;
    const m=qMsgs(()=>qStep(65,{render:false,each:keep}));qOk(A.br.length===1&&P.hp>0,'50%에서 씻김');void m;
    P.hp=maxHp();qStep(40,{render:false,each:keep});qOk(!A.br.length,'꽉 채웠는데 안 씻김');qOk(e.b4bT>19,'혼자 간격 '+e.b4bT);
    qMzEnd();qDpPrep('priest',140);const {r,sent}=qB4Party(3);b4Enter('ashname');qB4In();const e2=DG.boss,A2=B4.ar;e2.aggroed=true;const k2=()=>{e2.atkCd=1e9;e2.skT=1e9;e2.b4bT=99;e2.b4pT=99;P.hp=maxHp()};
    const r2=NET.peers.get('qa_peer2');r.hp=r.max*.5;r.x=r.tx=P.x+300;r.y=r.ty=P.y;r2.x=r2.tx=r.x+80;r2.y=r2.ty=r.y;A2.br=[{p:r,t:0,max:10,e:e2,k:1}];const ns=sent.length;
    qStep(Math.round(10.3*60),{render:false,each:()=>{k2();r.hp=r.max*.5;r.x=r.tx=P.x+300;r.y=r.ty=P.y;r2.x=r2.tx=r.x+80;r2.y=r2.ty=r.y}});const S1=sent.slice(ns);
    const ticks=S1.filter(x=>x.t==='hit'&&x.to==='qa_peer'&&Math.abs(x.d-Math.round(r.max*.04))<=1).length;qOk(ticks>=9,'낙인 피해 '+ticks);qOk(S1.some(x=>x.t==='hit'&&x.to==='qa_peer2'),'번지지 않음');qOk(!A2.br.length,'10초 뒤에도 낙인');
    A2.br=[{p:r,t:0,max:10,e:e2,k:1}];qStep(120,{render:false,each:()=>{k2();r.hp=r.max}});qOk(!A2.br.length,'동료가 채웠는데 안 씻김');
    e2.b4bT=0;qStep(1,{render:false,each:()=>{e2.atkCd=1e9;e2.skT=1e9;e2.b4pT=99}});qOk(A2.br.length===2,'파티 낙인 둘 '+A2.br.length);
    const n2=sent.length;e2.b4pT=0;qStep(1,{render:false,each:()=>{e2.atkCd=1e9;e2.skT=1e9;e2.b4bT=99}});qOk(sent.slice(n2).filter(x=>x.t==='hit').length>=2&&e2.b4pT>7,'잿불 숨결');
    return '낙인 · 씻김 · 번짐 · 숨결'}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ⑥ 잿빛 성가대장: 성가대 넷(혼자 둘)이 노래 · 기절 · 얼림 · 밀치기로 끊김 · 다 끊으면 무너짐 게이지 · 끝까지 부르면 남은 수만큼 아프고 생명력을 되찾음 · 혼자는 수호 정령이 하나를 끊음',()=>{
  try{qDpPrep();const {sent}=qB4Party(3);b4Enter('choir');qB4In();const e=DG.boss,A=B4.ar;e.aggroed=true;const keep=()=>{e.atkCd=1e9;e.skT=1e9;P.hp=maxHp()};e.b4cT=0;qStep(1,{render:false,each:keep});
    let S0=enemies.filter(s=>s.b4sg===1&&!s.dead);qOk(S0.length===4&&A.ch&&A.ch.max===9,'성가대 넷 '+S0.length);qOk(S0.every(s=>s.k==='b4_singer'&&s.max>0),'성가대');
    applyFx(S0[0],{stun:1},P);applyFx(S0[1],{knock:60},P);applyFx(S0[2],{slow:1},P);qStep(1,{render:false,each:keep});qOk(S0[0].dead&&S0[1].dead&&!S0[2].dead&&!S0[3].dead,'끊기 '+S0.map(s=>s.dead));
    e.hp=Math.round(e.max*.5);const h0=e.hp,ns=sent.length;qStep(9*60,{render:false,each:keep});qOk(!A.ch&&S0[2].dead&&S0[3].dead,'노래가 안 끝남');qOk(e.hp>=h0+e.max*.08-2,'생명력 '+(e.hp-h0)/e.max);
    qOk(sent.slice(ns).filter(x=>x.t==='hit').length>=2,'모두 아프지 않음');
    e.b4cT=0;qStep(1,{render:false,each:keep});S0=enemies.filter(s=>s.b4sg===1&&!s.dead);qOk(S0.length===4,'다시 넷');const g0=e.stg||0;for(const s of S0)applyFx(s,{freeze:1},P);qStep(1,{render:false,each:keep});
    qOk(!A.ch&&((e.stg||0)>=g0+50||e.brk>0),'다 끊었는데 무너짐 게이지 '+e.stg);
    qPtyOff();qMzEnd();qDpPrep();b4Enter('choir');const e2=DG.boss,A2=B4.ar;e2.aggroed=true;e2.b4cT=0;qStep(1,{render:false,each:()=>{e2.atkCd=1e9;e2.skT=1e9}});qOk(enemies.filter(s=>s.b4sg===1&&!s.dead).length===2&&A2.ch.max===12,'혼자 둘');
    const m=qMsgs(()=>qStep(Math.round(3.3*60),{render:false,each:()=>{e2.atkCd=1e9;e2.skT=1e9;P.hp=maxHp()}}));qOk(enemies.filter(s=>s.b4sg===1&&!s.dead).length===1&&m.some(t=>t.includes('수호 정령')),'수호 정령');
    return '끊기 · 끝까지 · 다 끊음 · 혼자'}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ⑦ 재의 군주 · 어둠판: 「이름 부르기」 두 번 연달아(둘째는 다른 기둥) · 둘이 기둥 둘 + 수호 정령 하나 → 무너짐 · 혼자는 정령 둘 · 못 지키면 꺼진 기둥만큼 아픔 · 사이사이 이름 불린 사람',()=>{
  try{qDpPrep();const {r,sent}=qB4Party(2);b4Enter('ashlord');qB4In();const e=DG.boss,A=B4.ar;e.aggroed=true;const keep=()=>{e.atkCd=1e9;e.skT=1e9;P.hp=maxHp()};
    e.b4cT=0;qStep(1,{render:false,each:keep});qOk(A.cn===1&&A.ps===0&&A.sp.join()==='0,0,1'&&A.cm===12,`첫째 ${A.cn} ${A.sp} ${A.cm}`);const [p0,p1]=A.PIL[0];
    const hold=Q=>()=>{keep();P.x=Q[0].x+40;P.y=Q[0].y+40;r.x=r.tx=Q[1].x+40;r.y=r.ty=Q[1].y+40;r.dead=false;r.area=netArea()};
    qStep(11*60,{render:false,each:hold([p0,p1])});qOk(e.brk>0&&A.cn===0&&A.next2>0,'둘이 지켰는데 안 무너짐 '+e.brk+' '+A.cn);
    qStep(Math.round((e.brk+3.5)*60),{render:false,each:keep});qOk(A.cn===2&&A.ps===1&&A.cm===10,'둘째 '+A.cn+' '+A.ps);
    const ns=sent.length,m=qMsgs(()=>qStep(Math.round(10.5*60),{render:false,each:()=>{keep();P.x=e.x+600;P.y=e.y;r.x=r.tx=e.x-600;r.y=r.ty=e.y}}));
    qOk(A.cn===0&&m.some(t=>t.includes('이름이 불렸습니다'))&&sent.slice(ns).some(x=>x.t==='hit'&&x.to==='qa_peer'),'못 지켰는데');qOk(e.b4cT>40,'다음 간격 '+e.b4cT);
    e.b4nT=0;e.b4cT=30;const nw=warns.length;qStep(1,{render:false,each:keep});qOk(warns.length>nw&&A.fol.length>=1,'이름 불린 사람');
    qPtyOff();qMzEnd();qDpPrep();b4Enter('ashlord');const e2=DG.boss;e2.aggroed=true;e2.b4cT=0;qStep(1,{render:false,each:()=>{e2.atkCd=1e9;e2.skT=1e9}});qOk(B4.ar.sp.join()==='0,1,1'&&B4.ar.cm===16,'혼자 '+B4.ar.sp);
    const q0=B4.ar.PIL[0][0];qStep(14*60,{render:false,each:()=>{e2.atkCd=1e9;e2.skT=1e9;P.hp=maxHp();P.x=q0.x+30;P.y=q0.y+30}});qOk(e2.brk>0||B4.ar.next2>0,'혼자 정령 둘과 무너뜨림');
    return '두 번 · 기둥 · 정령'}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ⑧ 숨은 보스: 어둠 10단계 재의 군주(거울 어둠판 · 재의 왕좌)로 열림 · 9단계는 안 됨 · 이름의 무게 · 위협 1위가 바뀌면 분노(덧셈) · 60% 구슬 · 30% 이름 부르기 · 혼자/파티 쓰러뜨림 · 첫 처치 칭호',()=>{const out=[];
  try{qDpPrep();qOk(!b4Enter('named')&&!DG,'잠겼는데 들어감');P.dark.cur=9;b4Enter('ashlord');qB4Kill(DG.boss);qStep(1,{render:false});qOk(!P.b4.hid,'9단계에 열림');qMzEnd();
    P.dark.cur=10;b4Enter('ashlord');const m=qMsgs(()=>{qB4Kill(DG.boss);qStep(1,{render:false})});qOk(P.b4.hid===1&&m.some(t=>t.includes('이름을 되찾은 자')),'10단계 어둠판으로 안 열림');qMzEnd();out.push('어둠판');
    P.b4.hid=0;P.dark.cur=0;b4Enter('choir');const keepT=darkTier;darkTier=()=>10;try{const w=qMob('b_ashlord',300,140);qKillE(w);qStep(1,{render:false})}finally{darkTier=keepT}qOk(P.b4.hid===1,'왕좌 재의 군주 10단계로 안 열림');qMzEnd();out.push('왕좌');
    // 혼자 쓰러뜨림 + 칭호
    qDpPrep();P.b4.hid=1;qOk(b4Enter('named'),'못 들어감');const e=DG.boss;e.aggroed=true;P.x=e.x+200;P.y=e.y;const A=B4.ar;e.b4wT=0;qStep(2,{render:false,each:()=>{e.atkCd=1e9;e.skT=1e9}});qOk(A.fol.length===1&&Math.abs(A.fol[0].w.dmg-e.dmg*2.4*.6)<1e-6,'혼자 무게');
    e.hp=e.max*.5;e.b4oT=0;qStep(2,{render:false,each:()=>{e.atkCd=1e9;e.skT=1e9}});qOk(A.orbs.length===1,'60% 구슬');e.hp=e.max*.25;qStep(4*60,{render:false,each:()=>{e.atkCd=1e9;e.skT=1e9;P.hp=maxHp()}});qOk(A.cn===3||A.c>0||e.brk>0,'30% 이름 부르기 '+A.cn);
    qB4Kill(e);qStep(2,{render:false});qOk(e.dead&&P.b4.first.includes('named')&&V20.titles.find(t=>t.id==='b4named').have(),'칭호');qMzEnd();out.push('혼자');
    // 파티: 위협 1위가 바뀌면 분노
    qDpPrep();P.b4.hid=1;const {r}=qB4Party(3);b4Enter('named');qB4In();const e2=DG.boss;e2.aggroed=true;const k2=()=>{e2.atkCd=1e9;e2.skT=1e9;e2.b4wT=99;P.hp=maxHp()};PTY.thr(e2,r.id,1e7);qStep(2,{render:false,each:k2});const st0=e2.b4st|0;
    PTY.thr(e2,0,1e10);qStep(2,{render:false,each:k2});qOk((e2.b4st|0)===st0+1&&Math.abs(e2.dmg-e2.b4d0*(1+.12*e2.b4st))<1e-6,'분노 '+e2.b4st);
    e2.b4wT=0;qStep(1,{render:false,each:()=>{e2.atkCd=1e9;e2.skT=1e9}});const f=B4.ar.fol[B4.ar.fol.length-1];qOk(f&&f.tg===P&&Math.abs(f.w.dmg-e2.dmg*2.4)<1e-6,'파티 무게');
    qB4Kill(e2);qStep(2,{render:false});qOk(e2.dead&&P.b4.kc.named===1,'파티 쓰러뜨림');out.push('파티 분노');return out.join(' · ')}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ⑨ 같이 하기(가짜 동료 셋): 생명력 ×3(보스 +100%/명 덧셈) · 피해 그대로 · 여섯 보스 모두 파티로 쓰러뜨림 · dg에 b4 · 참가자는 같은 방 · b4s 상태 · b4req',()=>{const out=[];let D=null;
  try{for(const b of B4_ALL){qDpPrep();P.b4.hid=1;b4Enter(b.id);qStep(1,{render:false});const solo=DG.boss.max,sd=DG.boss.dmg;qMzEnd();
      qDpPrep();P.b4.hid=1;const {sent}=qB4Party(3);b4Enter(b.id);qB4In();const e=DG.boss;qStep(1,{render:false});qOk(Math.abs(e.max-solo*3)<=3&&Math.abs(e.dmg-sd)<1e-6,`${b.id} 생명력 ${e.max}≠${solo}×3`);
      if(e.mg)qOk(Math.abs(e.mg.mem[1].max-solo*3)<=3,'불의 몸 ×3');const dg=sent.filter(m=>m.t==='dg').pop();qOk(dg&&dg.d.b4&&dg.d.b4.id===b.id,'dg에 b4 없음');if(b.id==='ashlord')D=JSON.parse(JSON.stringify(dg.d));
      e.aggroed=true;qStep(60,{render:false,each:()=>{P.hp=maxHp()}});qB4Kill(e);qStep(2,{render:false});qOk(e.dead&&P.b4.got.includes(b.id),b.id+' 파티로 안 쓰러짐');qOk(sent.some(m=>m.t==='kill'),b.id+' 처치 알림 없음');out.push(b.id);qPtyOff();qMzEnd()}
    qDpPrep('priest',140);qPty(2);NET.guest=true;NET.hostId='qa_peer';netEnterDg(D);qOk(DG&&DG.b4&&DG.b4.id==='ashlord'&&Array.from(DG.g).join('')===D.g.join('')&&DG.ci===D.ci&&B4.ar&&B4.ar.guest,'참가자 방');
    netOnMsg({t:'v20x',k:'b4s',from:'qa_peer',id:'ashlord',o:[[P.x+100,P.y]],ps:1,l:[100,50,0],s:[0,0,1],h:[1,0,1],c:50,cm:100,cn:2,br:['qa_me'],ch:[50,90],so:0});
    const V=b4View();qOk(V&&V.ps===1&&V.l[0]===1&&V.br[0]===P&&V.o.length===1&&V.cn===2,'b4s 상태');render();
    const s2=[];NET.ws={readyState:1,send:x=>s2.push(JSON.parse(x))};leaveDungeon();V20A.b4go('choir');qOk(s2.some(m=>m.t==='v20x'&&m.k==='b4req'&&m.id==='choir')&&!DG,'참가자 b4req');qPtyOff();
    qDpPrep();qB4Party(2);netOnMsg({t:'v20x',k:'b4req',from:'qa_peer',id:'elgaros'});qOk(DG&&DG.b4&&DG.b4.id==='elgaros','방장이 b4req로 안 들어감');out.push('참가자 · b4req');return out.join(' · ')}finally{qDpEnd()}});
qT(QDP,'군주의 메아리 ⑩ 주간 보상 · 저장: 같은 주 두 번째는 상급 상자 없음 · 다음 주에 다시 · 이번 주의 메아리는 재의 결정 두 배 · end22Drop b4(상급 chest) · b4hidden · 저장 왕복 · 없으면 안 씀 · 엉터리 값 · 모르는 칸 보존',()=>{const calls=[];let keep=null;
  try{qDpPrep();if(typeof end22Drop==='function'){keep=end22Drop;end22Drop=function(){calls.push([...arguments]);return []}}
    const W=[0,1,2,3,4,5,6].find(w=>B4_LIST[w%5].id!=='elgaros');B4.qaWeek=W;qOk(b4Feat()!=='elgaros','이번 주');
    const kill=id=>{b4Enter(id);const e=DG.boss;const a=P.ash|0,s=P.sp|0,c=calls.length;qB4Kill(e);qStep(1,{render:false});const o={ash:(P.ash|0)-a,sp:(P.sp|0)-s,c:calls.slice(c)};qMzEnd();return o};
    let k=kill('elgaros');qOk(k.ash===15&&k.sp===1,'첫 처치 '+JSON.stringify(k));if(keep)qOk(k.c.length===1&&k.c[0][0]==='b4'&&k.c[0][1]===0&&k.c[0][4]&&k.c[0][4].chest===1,'상급 상자 '+JSON.stringify(k.c));
    k=kill('elgaros');qOk(k.ash===4&&k.sp===0,'두 번째 '+JSON.stringify(k));if(keep)qOk(k.c.length===1&&!k.c[0][4],'두 번째 상자 '+JSON.stringify(k.c));
    B4.qaWeek=B4_LIST.findIndex(b=>b.id==='elgaros')+5*600;qOk(b4Feat()==='elgaros','이번 주의 메아리');k=kill('elgaros');qOk(k.ash===30&&P.b4.got.join()==='elgaros','새 주 · 두 배 '+JSON.stringify(k));
    P.dark.cur=4;k=kill('choir');qOk(k.ash===(15+8)*(b4Feat()==='choir'?2:1),'단계 4 '+JSON.stringify(k));if(keep)qOk(k.c[0][1]===4,'단계 4 상자');
    P.b4.hid=1;k=kill('named');qOk(k.ash===30+12&&k.sp===0,'숨은 보스 '+JSON.stringify(k));if(keep)qOk(k.c.length===1&&k.c[0][0]==='b4hidden'&&k.c[0][4]&&k.c[0][4].chest===1,'숨은 보스 상자 '+JSON.stringify(k.c));
    if(keep){end22Drop=keep;keep=null}
    let d=saveData();qOk(d.b4&&d.b4.first.includes('named')&&d.b4.kc.elgaros===3,'저장 '+JSON.stringify(d.b4));P.b4.zz={q:1};d=saveData();qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT)&&P.b4.hid===1&&P.b4.zz.q===1&&P.b4.first.length===3,'불러오기 '+JSON.stringify(P.b4));
    qDpPrep();d=saveData();qOk(!('b4' in d),'빈 값을 씀');delete d.b4;qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT)&&P.b4.got.length===0&&!P.b4.hid,'기본값');
    const c=b4Clean({got:['x','elgaros','elgaros'],first:5,hid:'y',kc:{a:'5',b:-1},wk:'z',zz:1});qOk(c.got.join()==='elgaros'&&!c.first.length&&c.hid===1&&c.kc.a===5&&c.kc.b===0&&c.wk===0&&c.zz===1,'다듬기 '+JSON.stringify(c));
    return '주간 · 두 배 · 저장'}finally{if(keep)end22Drop=keep;qDpEnd()}});
/* ---------- v22 QUEST: 첫 던전 한 번만 · 겹치는 임무 줄이기 · 옛 진행 옮기기 (quest22.js) ---------- */
const QQ22='의뢰 v22';
const qQ22Cave=()=>{const ci=HOME.caves.findIndex(c=>c.cave&&c.cave.id==='barrow');return{ci,c:HOME.caves[ci]}};
qT(QQ22,'1막 첫 던전은 한 번만 들어감: 「고분의 속삭임」은 입구만 살펴보고, 「고분의 왕」에서 볼그와 아르실을 한 번에 · 스킬 포인트 +1',()=>{qPrep('mage',{lvl:10});
  const {ci,c}=qQ22Cave();qOk(c,'안개숲 고분 없음');const _e=enterDungeon;let trips=0;enterDungeon=function(){trips++;return _e.apply(this,arguments)};
  try{P.q={i:1,st:0,c:{}};questAccept();const q1=qCur();qOk(P.q.st===1&&q1.t==='고분의 속삭임','못 받음');qOk(q1.goals.length===1&&q1.goals[0].type==='reach','입구 목표 아님');
    let tg=qMainTargetW();qOk(tg&&tg.cave===ci&&tg.label.includes('입구'),'입구 목표 자리 '+JSON.stringify(tg));qOk(/안개숲 옛 고분 입구/.test(qHudBlock().g[0].s)&&!/\d\/\d/.test(qHudBlock().g[0].s),'알림판 글 '+qHudBlock().g[0].s);
    P.x=c.x+60;P.y=c.y+90;qStep(20,{render:false});qOk(P.q.st===2&&!DG&&trips===0,`입구에 닿아도 안 끝남 st${P.q.st} trips${trips}`);questFinish();
    const q2=qCur();qOk(q2.t==='고분의 왕'&&q2.goals.some(g=>g.k&&g.k.includes('m_bolg'))&&q2.goals.some(g=>g.k&&g.k.includes('b_arsil')),'고분의 왕 목표');questAccept();
    tg=qMainTargetW();qOk(tg&&tg.cave===ci,'던전 목표 '+JSON.stringify(tg));const sp0=P.sp;
    P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.ci===ci&&trips===1,'던전에 못 들어감');
    for(const k of ['m_bolg','b_arsil']){const e=enemies.find(o=>o.k===k&&!o.dead);qOk(e,k+' 없음');killE(e)}
    qOk(P.q.st===2&&qAllDone(q2),'한 번 들어가서 끝나지 않음 '+JSON.stringify(P.q));leaveDungeon();questTalk(ALLTOWNS.find(t=>t.id===qTurnTown(q2)));qClick('#pbody [data-qdone]');qClosePanels();
    qOk(P.q.i===3&&P.sp===sp0+1&&trips===1,`끝 i${P.q.i} sp+${P.sp-sp0} 들어간 횟수 ${trips}`);return `던전 ${trips}번 · 스킬 포인트 +1`}
  finally{enterDungeon=_e;if(DG)leaveDungeon();qClosePanels()}});
qT(QQ22,'메인 의뢰를 받기 전에 그 의뢰의 준보스·보스를 먼저 잡으면 받을 때 처치로 침 (첫 의뢰 중 고분에 들어가 다 잡아도 다시 안 들어감) · 저장 왕복',()=>{qPrep('mage',{lvl:10});
  const {ci,c}=qQ22Cave();try{P.q={i:1,st:0,c:{}};questAccept();P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.ci===ci,'던전');qStep(20,{render:false});qOk(P.q.st===2,'던전 안에서 입구 목표 안 끝남');
    for(const k of ['m_bolg','b_arsil']){const e=enemies.find(o=>o.k===k&&!o.dead);qOk(e,k+' 없음');killE(e)}qOk(P.qpre&&P.qpre.m_bolg===1&&P.qpre.b_arsil===1,'먼저 잡은 것 기억 '+JSON.stringify(P.qpre));
    leaveDungeon();const d=JSON.parse(JSON.stringify(saveData()));qOk(d.qv===22&&d.qpre&&d.qpre.b_arsil===1,'저장 '+JSON.stringify(d.qpre));qOk(load(d,QA_SLOT),'load');qOk(P.qpre&&P.qpre.m_bolg===1,'불러온 뒤');
    questFinish();questAccept();qOk(P.q.i===2&&P.q.st===2&&!P.qpre,'받자마자 끝나야 함 '+JSON.stringify(P.q));
    P.q={i:3,st:0,c:{}};const d2=JSON.parse(JSON.stringify(saveData()));qOk(!('qpre' in d2),'빈 qpre가 저장됨');return '먼저 잡은 볼그·아르실 → 받자마자 보고'}
  finally{if(DG)leaveDungeon();qClosePanels()}});
qT(QQ22,'1막 12개를 차례로 끝까지: 목표 자리가 늘 있고(입구 목표 포함), 끝남',()=>{qPrep('mage',{lvl:30});P.q={i:0,st:0,c:{}};const r=[];
  try{for(let i=0;i<12;i++){const q=qCur();qOk(q===QUESTS[i],i+'번째');qOk(qMainTargetW(),q.t+' 받을 자리');questAccept();qOk(P.q.st===1,q.t+' 못 받음');
    q.goals.forEach((g,j)=>{if(qGoalDone(q,j))return;const tg=qMainTargetW();qOk(tg&&['home','royal'].includes(tg.reg||'home')&&qNum(tg.x),`${q.t}: ${g.d} 자리 ${JSON.stringify(tg)}`);/* v26: 아르덴 의뢰인은 왕도 지도 */
      if(g.type==='talk'){questTalk(qTw(g.town));qClosePanels()}
      else if(g.type==='reach'){P.x=tg.x;P.y=tg.y+70;q22ReachTick()}
      else for(let k=0;k<5000&&!qGoalDone(q,j);k++)questKill({k:g.k[k%g.k.length],x:P.x,y:P.y,r:20})});
    qOk(P.q.st===2,q.t+' 완료 아님');questFinish();r.push(q.t)}qOk(P.q.i===12,'1막 끝 아님');return r.length+'개'}finally{qClosePanels()}});
qT(QQ22,'겹치는 반복 목표(같은 들판 몬스터 N마리 · 그 몬스터 전리품) 줄임: 직업마다 앞 → 뒤',()=>{qPrep('mage',{lvl:30});
  const B={mage:{grind:51,pair:2,dup:12},priest:{grind:52,pair:2,dup:14},warrior:{grind:52,pair:2,dup:11},archer:{grind:52,pair:2,dup:12}},r=[];let b0=0,a0=0;
  for(const c in B){const a=q22Rep(c),b=B[c];b0+=b.grind;a0+=a.grind;qOk(a.pair===0,`${c} 잡고 또 그 전리품 ${a.pair}`);qOk(a.dup<=2,`${c} 겹침 ${a.dup} ${a.dl.join(' ')}`);qOk(a.grind<=b.grind-8&&a.grind>=Math.round(a.vis*.15),`${c} 반복 목표 의뢰 ${b.grind}→${a.grind}`);
    r.push(`${c} 반복 ${b.grind}→${a.grind}/${a.vis} · 겹침 ${b.dup}→${a.dup} · 잡고+전리품 ${b.pair}→${a.pair}`)}
  return r.join(' | ')+` · 합 ${b0}→${a0} (${Math.round((1-a0/b0)*100)}% 줄임)`});
qT(QQ22,'의뢰 스킬 포인트 합은 그대로 (메인 6 · 직업마다 마을/시험/전직 28) · 바꾼 의뢰의 보상 그대로',()=>{qPrep('mage',{lvl:30});const m=QUESTS.reduce((a,q)=>a+(q.rw.sp|0),0);qOk(m===6,'메인 '+m);
  for(const c of ['mage','priest','warrior','archer']){const n=SQ.filter(q=>q.cls===c).reduce((a,q)=>a+(q.rw&&q.rw.sp|0),0);qOk(n===28,c+' '+n)}qOk(SQ.filter(q=>!q.cls).every(q=>!(q.rw&&q.rw.sp)),'공통 의뢰 sp');
  const RW={1:'{"xp":1.2,"gold":150,"item":1}',2:'{"xp":1.6,"gold":300,"item":2,"sp":1}',4:'{"xp":1.2,"gold":220,"item":1}',7:'{"xp":1.3,"gold":380,"item":1}',10:'{"xp":1.3,"gold":600,"item":1}'};
  for(const i in RW)qOk(JSON.stringify(QUESTS[i].rw)===RW[i],'보상 바뀜 '+QUESTS[i].t);
  const SRW={fang:'{"xp":1,"gold":80,"item":1}',wolfd:'{"xp":0.8,"gold":70,"pot":2}',ctm1:'{"xp":0.8,"gold":80,"item":1,"badge":1}',ctm2:'{"xp":1,"gold":150,"sp":1,"badge":2}',ctm7:'{"xp":2.5,"gold":2500,"sp":4,"badge":7}',ctp2:'{"xp":1,"gold":150,"sp":1,"badge":2}',ctw4:'{"xp":1.2,"gold":500,"sp":1,"badge":4}',j2p2:'{"xp":2,"gold":5000,"sp":2}',gh5:'{"xp":0.8,"gold":460,"pot":2}'};
  for(const id in SRW)qOk(JSON.stringify(SQBY[id].rw)===SRW[id],'보상 바뀜 '+id+' '+JSON.stringify(SQBY[id].rw));return '메인 6 · 직업마다 28'});
// 옛 진행: 바뀐 의뢰마다 (진행 중 · 다 함) → 새 모양
const QQ22_OLD={main:{1:[[4,0],[10,1]],2:[[0],[1]],4:[[10,3],[7,6]],7:[[12,5],[3,2]],10:[[15,2],[5,0]]},
  sq:{fang:[[2],[6]],ctm1:[[3],[5]],ctm2:[[3,0],[6,1]],ctm5:[[8,2],[8,10]],ctm7:[[12,1],[12,6]],ctp2:[[6,1,0],[6,1,1]],ctp4:[[5,4],[6,12]],ctp7:[[3,3],[12,6]],ctw1:[[7],[12]],ctw2:[[10,0],[10,1]],ctw4:[[10,0],[10,1]],cta2:[[4,0],[10,1]],j2p2:[[15,3],[15,10]]}};
const QQ22_NEW={main:{1:[[0],[1]],2:[[1,0],[1,1]],4:[[3],[6]],7:[[15],[5]],10:[[2],[0]]},
  sq:{fang:[[0],[1]],ctm1:[[1],[3]],ctm2:[[4,0],[8,1]],ctm5:[[10],[12]],ctm7:[[13],[14]],ctp2:[[1,0],[1,1]],ctp4:[[5],[8]],ctp7:[[6],[14]],ctw1:[[1],[1]],ctw2:[[8,0],[8,1]],ctw4:[[0],[1]],cta2:[[4,0],[8,1]],j2p2:[[16],[16]]}};
const qQ22Save=(o)=>{const d=JSON.parse(JSON.stringify(QA_FIX.v5));d.slot=QA_SLOT;d.reg='home';d.x=1500;d.y=3900;delete d.qv;Object.assign(d,o);return d};
const qQ22C=a=>{const c={};a.forEach((v,j)=>{if(v)c['g'+j]=v});return c};
qT(QQ22,'옛 저장 옮기기 · 메인: 바뀐 1막 의뢰 5개마다 진행 중/보고만 남은 저장 → 새 목표 (수 옮김 · 끝난 건 끝 · 막히지 않음) · 다시 불러와도 그대로',()=>{qPrep('mage',{lvl:30});const r=[];
  for(const i in QQ22_OLD.main){const q=QUESTS[i];QQ22_OLD.main[i].forEach((oc,v)=>{const old=Q22.MIG.main[i].old,done=oc.every((n,j)=>n>=old[j]);
    const d=qQ22Save({q:{i:+i,st:done?2:1,c:Object.assign({0:3},qQ22C(oc))}});qOk(load(d,QA_SLOT),'load');const want=QQ22_NEW.main[i][v];
    want.forEach((n,j)=>qOk((P.q.c['g'+j]|0)===n,`${q.t} ${JSON.stringify(oc)} → g${j}=${P.q.c['g'+j]|0} (기대 ${n})`));qOk(P.q.c[0]===3&&P.q.c.v22===1,'다른 칸');
    qOk(P.q.st===(qAllDone(q)?2:1),`${q.t} 상태 ${P.q.st}`);if(done)qOk(P.q.st===2,q.t+' 보고만 남았는데 안 끝남');
    q.goals.forEach((g,j)=>qOk((P.q.c['g'+j]|0)<=(g.n||1),'넘침'));if(+i===1&&oc[1]>=1)qOk(P.qpre&&P.qpre.m_bolg===1,'볼그 기억');
    const c1=JSON.stringify(P.q.c),d2=JSON.parse(JSON.stringify(saveData()));qOk(d2.qv===22,'qv');qOk(load(d2,QA_SLOT)&&JSON.stringify(P.q.c)===c1,'다시 불러오면 바뀜');
    delete d2.qv;qOk(load(d2,QA_SLOT)&&JSON.stringify(P.q.c)===c1,'옛 판에서 다시 저장한 것(qv 없음)도 두 번 옮기지 않음');r.push(`${i}:${JSON.stringify(oc)}→${JSON.stringify(want)}`)})}
  const d=qQ22Save({q:{i:2,st:0,c:{}}});qOk(load(d,QA_SLOT)&&P.qpre&&P.qpre.m_bolg===1,'고분의 왕을 받기 전 옛 저장: 볼그는 이미 잡은 것으로');questAccept();qOk(qGoalDone(qCur(),0)&&!qGoalDone(qCur(),1),'받으면 볼그 끝 · 아르실 남음');
  return r.join(' ')});
qT(QQ22,'옛 저장 옮기기 · 마을 의뢰·위계 시험·전직: 바뀐 13개마다 진행 중/다 한 저장 → 새 목표 · 대상만 넓힌 의뢰는 그대로 · 왕복',()=>{qPrep('mage',{lvl:30});const r=[];
  for(const id in QQ22_OLD.sq){const q=SQBY[id];QQ22_OLD.sq[id].forEach((oc,v)=>{const old=Q22.MIG.sq[id].old,done=oc.every((n,j)=>n>=old[j]);
    const d=qQ22Save({cls:q.cls||'mage',sq:{a:{[id]:{c:qQ22C(oc),got:[]},wolfd:{c:{g0:7},got:[]}},d:{},cd:{}}});qOk(load(d,QA_SLOT),'load');const a=sqState().a[id],want=QQ22_NEW.sq[id][v];qOk(a,id+' 사라짐');
    want.forEach((n,j)=>qOk((a.c['g'+j]|0)===n,`${id} ${JSON.stringify(oc)} → g${j}=${a.c['g'+j]|0} (기대 ${n})`));qOk(a.c.v22===1,'표시');if(done)qOk(sqAllDone(q),id+' 다 했는데 안 끝남');
    q.goals.forEach((g,j)=>qOk((a.c['g'+j]|0)<=sqGoalN(g),'넘침'));qOk(sqState().a.wolfd.c.g0===7,'대상만 넓힌 의뢰 수가 바뀜');
    const c1=JSON.stringify(a.c),d2=JSON.parse(JSON.stringify(saveData()));delete d2.qv;qOk(load(d2,QA_SLOT)&&JSON.stringify(sqState().a[id].c)===c1,id+' 두 번 옮김');r.push(id)})}
  sqState().a={};sqAccept('fang');qOk(sqState().a.fang.c.v22===1,'새로 받은 의뢰 표시');return `의뢰 ${Object.keys(QQ22_OLD.sq).length}개 × (진행 중 · 다 함)`});
qT(QQ22,'바뀐 의뢰 목표: 자리가 있고, 섞인 몬스터 아무나 잡아도 셈 · 잿빛 이빨은 고분 던전 · 은방울풀 채집',()=>{const r=[];
  for(const cls of ['mage','priest','warrior','archer']){qPrep(cls,{lvl:60});const s=sqState();for(const id of [...Object.keys(Q22.MIG.sq),...Q22.WIDE]){const q=SQBY[id];if(q.cls&&q.cls!==cls)continue;s.a={};s.a[id]={c:{},got:[]};
    const tg=sqTarget(q);qOk(tg&&qNum(tg.x),`${id} 자리 없음`);const g=q.goals[0];
    if(g.k&&g.k.includes('m_wolfking'))qOk(tg.cave===qQ22Cave().ci,id+' 고분 아님');if(g.type==='gather')qOk(tg.spots==='herb','채집 자리');
    if(g.type==='kill'&&g.k.length>1){for(const k of g.k)questKill({k,x:P.x,y:P.y,r:20});qOk((s.a[id].c.g0|0)===g.k.length,`${id} 섞인 몬스터 ${s.a[id].c.g0}`)}r.push(id)}}
  return `직업 넷 · 의뢰 ${r.length}번 확인`});
qT(QR22,'몸 상자는 몸 뒤로 멀리 지나가는 투사체를 막지 않음: 큰 보스(삼키는 자) 그림 뒤쪽 화면 위를 지나가는 스파크는 보스를 안 맞히고 앞의 적까지 감',()=>{qPrep('mage',{lvl:60});const art0=GFX.art;GFX.art='old';
  try{qR22Clear();P.x=QA_SPOT.x;P.y=QA_SPOT.y;P.sk.spark=10;followCam();const b=qR22Pin(dgMob('b_devourer',P.x+200,P.y+200,40),P.x+200,P.y+200);b.atkCd=1e9;b.skT=1e9;b.hp=b.max=1e9;const bx=b.x,by=b.y,d=qDummy(P.x+400,P.y);
    let dbg='';const _he=hurtE;hurtE=function(e,amt,s){if(e===b&&!dbg)dbg=`${s&&(s.id||s.kind)} b(${Math.round(b.x-P.x)},${Math.round(b.y-P.y)}) hr${hR(b)} `+projs.filter(q=>q.owner==='p').map(q=>`p(${Math.round(q.x-P.x)},${Math.round(q.y-P.y)},z${q.z},r${q.r})`).join(' ');return _he.apply(this,arguments)};try{qCast('spark',{x:d.x,y:d.y});qStep(60,{render:false,each:()=>{b.x=bx;b.y=by;P.hp=maxHp()},until:()=>d.taken>0})}finally{hurtE=_he}qOk(b.hp===1e9,'보스 뒤로 지나가는데 보스가 맞음 '+dbg);qOk(d.taken>0,'앞의 적까지 못 감')}
  finally{GFX.art=art0;qR22Clear()}return '보스 뒤 통과'});
/* ===== v22 COOP: 파티 던전 함께 들어가기 (사용자 07:13) — 메시지 단위 점검 (가짜 동료 · 가짜 연결) ===== */
const qCo22Msgs=f=>{const k=CO22.cap;CO22.cap=[];try{f()}finally{const g=CO22.cap;CO22.cap=k;return g}};
const qCo22V=(sent,k,to)=>sent.filter(m=>m.t==='v20x'&&m.k===k&&(to==null||m.to===to));
qT('파티 v22','방장: 참가자의 던전 요청 — 다른 지역이면 그 지역으로 건너가 그 던전에(던전 id로 찾음) · 쓰러짐 · 봉인 · 이미 던전 안이면 이유를 참가자에게',()=>{qPrep('mage',{lvl:60});const out=[];
  try{const {sent}=qPty(2,{host:true});const pc=RCACHE.plains.caves[1];
    netOnMsg({t:'req',from:'qa_peer',a:'dungeon',c:0,rg:'plains',cid:pc.cave.id});qOk(REG.id==='plains'&&DG&&DG.d===pc.cave,`평원 ${pc.cave.n}에 안 들어감 (${REG.id}, ${DG&&DG.d.n})`);
    qOk(sent.some(m=>m.t==='reg'&&m.id==='plains')&&sent.some(m=>m.t==='dg'&&m.d.reg==='plains'&&m.d.ci===DG.ci),'참가자에게 지역·던전 자료를 안 보냄');out.push('다른 지역 → '+pc.cave.n);
    // 이미 던전 안: 다른 동굴을 청하면 방장의 던전 자료 + 안내
    sent.length=0;netOnMsg({t:'req',from:'qa_peer',a:'dungeon',c:0,rg:'plains',cid:RCACHE.plains.caves[0].cave.id});qOk(DG.d===pc.cave&&sent.some(m=>m.t==='dg'&&m.to==='qa_peer'),'이미 던전 안인데 자료를 안 보냄');
    qOk(qCo22V(sent,'co22n','qa_peer').some(m=>m.s.includes('이미')),'이미 던전 안이라는 안내 없음');leaveDungeon();loadRegion('home');
    // 방장이 쓰러짐
    sent.length=0;P.dead=true;netOnMsg({t:'req',from:'qa_peer',a:'dungeon',c:0,rg:'home',cid:CAVES[0].cave.id});P.dead=false;qOk(!DG&&qCo22V(sent,'co22n','qa_peer').some(m=>m.kd==='fail'&&m.s.includes('쓰러져')),'쓰러진 방장: 이유를 안 보냄');out.push('쓰러짐');
    // 지옥 전용 지역 봉인 (보통 난이도)
    sent.length=0;const q0=W3.qaOpen;W3.qaOpen=false;P.diff=0;try{netOnMsg({t:'req',from:'qa_peer',a:'dungeon',c:0,rg:'plateau',cid:'pt_corridor'})}finally{W3.qaOpen=q0}
    qOk(!DG&&REG.id==='home'&&qCo22V(sent,'co22n','qa_peer').some(m=>m.kd==='fail'&&m.s.includes('봉인')),'봉인 지역: 이유를 안 보냄');out.push('봉인');
    // 모르는 던전(판이 다름)
    sent.length=0;netOnMsg({t:'req',from:'qa_peer',a:'dungeon',c:99,rg:'home',cid:'no_such'});qOk(!DG&&qCo22V(sent,'co22n','qa_peer').some(m=>m.kd==='fail'&&m.s.includes('새로 고침')),'모르는 던전: 안내 없음');
    // 오르타: 레벨이 모자람 → 이유 전달
    sent.length=0;P.lvl=20;netOnMsg({t:'v20x',k:'mzreq',from:'qa_peer',f:1});qOk(!DG&&qCo22V(sent,'co22n','qa_peer').some(m=>m.kd==='fail'&&m.s.includes('레벨')),'오르타 요청 실패 이유 없음');out.push('오르타 레벨')}
  finally{if(DG)leaveDungeon();qPtyOff();loadRegion('home')}return out.join(' · ')});
qT('파티 v22','참가자: 동굴 F → 방장에게 (던전 id · 지역) · 6초 안에 답이 없으면 「다시」 알림 · 방장이 던전에 있는데 못 따라가면 「함께 들어가기」 알림 → 한 번 누르면 청함 · 들어가면 알림이 닫히고 방장에게 알림(co22a)',()=>{qPrep('priest',{lvl:30});const out=[];
  try{const {sent}=qPty(2);NET.guest=true;NET.hostId='qa_peer';const c=CAVES[1];qActAt(c.x,c.y+40);qOk(act==='dungeon','동굴 앞 act 아님');sent.length=0;doAct();
    const q=sent.find(m=>m.t==='req'&&m.a==='dungeon');qOk(q&&q.cid===c.cave.id&&q.rg==='home'&&q.c===1&&q.to==='qa_peer'&&!DG,'요청 모양');
    const t0=performance.now();co22Tick(t0+CO22.ASKMS+50);qOk(CO22.pr&&CO22.pr.m&&$('#co22p')&&!$('#co22p').hidden,'답이 없을 때 알림 없음');sent.length=0;$('#co22go').click();qOk(sent.some(m=>m.t==='req'&&m.cid===c.cave.id),'다시 누르면 같은 요청이 아님');out.push('답 없음 → 다시');
    // 방장이 던전에 있다는 몬스터 줄(a>=0)을 받는데 들어가지 못함
    CO22.hostDg={n:'안개숲 고분',a:0};netApplySnap({a:0,en:[],pr:[],wr:[]});const n0=performance.now();CO22.ask=null;CO22.prMute=-1e9;co22Prompt(null);CO22.miss=0;co22Tick(n0);CO22.hAt=performance.now()+CO22.FOLMS;co22Tick(n0+CO22.FOLMS+100);
    qOk(CO22.pr&&/QA 동료님이 「안개숲 고분」에 들어갔어요/.test($('#co22p').textContent)&&/함께 들어가기/.test($('#co22p').textContent),`알림 글 ${$('#co22p')&&$('#co22p').textContent}`);
    sent.length=0;$('#co22go').click();qOk(sent.some(m=>m.t==='req'&&m.a==='dungeon'&&m.to==='qa_peer')&&!CO22.pr,'함께 들어가기 단추가 청하지 않음');out.push('함께 들어가기');
    // 방장의 던전 자료가 오면 들어가고, 받았다고 알림
    NET.guest=false;enterDungeon(CAVES[0]);const D=JSON.parse(JSON.stringify(netDgData()));leaveDungeon();NET.guest=true;co22Prompt({t:'x',n:'x'});sent.length=0;netEnterDg(D);
    qOk(DG&&DG.net&&!CO22.pr&&qCo22V(sent,'co22a','qa_peer').some(m=>m.ok===1&&m.a===0),'들어간 뒤 co22a/알림 닫기');
    // 자료가 망가졌으면(못 들어감) 이유를 방장에게
    leaveDungeon();sent.length=0;netEnterDg(Object.assign({},D,{ci:77}));qOk(!DG&&qCo22V(sent,'co22a','qa_peer').some(m=>m.ok===0&&m.s),'못 들어갔는데 방장에게 안 알림');out.push('co22a')}
  finally{co22Prompt(null);CO22.ask=null;CO22.hA=-9;if(DG)leaveDungeon();qPtyOff()}return out.join(' · ')});
qT('파티 v22','방장: 들어간 뒤 5초 안에 안 따라온 동료를 이유와 함께 알림 · 던전 자료를 다시 보냄 · 들어오면 알림 · 판 번호(co22v)가 없는 동료는 옛 판 안내 한 번',()=>{qPrep('mage',{lvl:30});const out=[];
  try{const {r,sent}=qPty(2,{host:true});r.area=-1;CO22.lastA=-9;CO22.peerAt.clear();CO22.stAt.set('qa_peer',performance.now());CO22.ver.set('qa_peer',22);enterDungeon(CAVES[0]);const t0=performance.now();sent.length=0;
    let M=qCo22Msgs(()=>co22Tick(t0));qOk(qCo22V(sent,'co22in').some(m=>m.a===DG.ci&&m.n===DG.d.n),'co22in 없음');qOk(!M.some(t=>t.includes('따라오지')),'너무 일찍 알림');
    netOnMsg({t:'v20x',k:'co22a',from:'qa_peer',ok:0,s:'던전 자료 오류: 시험'});sent.length=0;
    M=qCo22Msgs(()=>co22Tick(t0+CO22.FOLMS+100));qOk(M.some(t=>t.includes('QA 동료님이 아직')&&t.includes('따라오지 못했')&&t.includes('시험')),`알림 ${M.join('/')}`);qOk(sent.some(m=>m.t==='dg'&&m.to==='qa_peer'),'던전 자료를 다시 안 보냄');
    M=qCo22Msgs(()=>co22Tick(t0+CO22.FOLMS+700));qOk(!M.some(t=>t.includes('따라오지')),'같은 동료를 또 알림');
    r.area=DG.ci;M=qCo22Msgs(()=>netOnMsg({t:'v20x',k:'co22a',from:'qa_peer',ok:1,a:DG.ci}));qOk(M.some(t=>t.includes('들어왔습니다')),'들어왔다는 알림 없음');out.push('못 따라옴 → 이유 · 다시 보냄 · 들어옴');
    // 옛 판 동료
    CO22.ver.delete('qa_peer');CO22.oldTold.clear();CO22.peerAt.set('qa_peer',t0);M=qCo22Msgs(()=>co22Tick(t0+9000));qOk(M.some(t=>t.includes('예전 판')),'옛 판 안내 없음');
    M=qCo22Msgs(()=>co22Tick(t0+9600));qOk(!M.some(t=>t.includes('예전 판')),'옛 판 안내를 또 함');out.push('옛 판')}
  finally{if(DG)leaveDungeon();CO22.fol=null;CO22.lastA=-9;CO22.ver.clear();CO22.oldTold.clear();CO22.peerAt.clear();CO22.fail.clear();qPtyOff()}return out.join(' · ')});
qT('파티 v22','연결이 끊긴 뒤 다시 잇기: 참가자는 같은 방장의 방에 다시 참가 · 방장은 방이 없으면 다시 염 · 다른 방장 · 5분 지남 · 일부러 나가기는 다시 잇지 않음',()=>{qPrep('mage');const out=[];const it=$('#intro'),h0=it&&it.hidden;if(it)it.hidden=true;
  const keep={lobby:NET.lobby,rh:NET.roomHost,rj:CO22.rj};
  try{let sent=[];const ws=()=>{sent=[];NET.ws={readyState:1,send:x=>sent.push(JSON.parse(x))}};
    // 파티 중 연결이 끊김(netReset) → 기억
    const {r}=qPty(2);NET.guest=true;NET.hostId='qa_peer';CO22.rj={host:false,hid:'qa_peer',hn:'QA 방장',t:Date.now()-60000};netReset();qOk(CO22.rj&&CO22.rj.drop===1&&Date.now()-CO22.rj.t<2000,'끊길 때 기억 안 함');void r;
    ws();NET.on=false;NET.lobby=[{id:42,n:'QA 방장',r:1}];NET.roomHost=42;CO22.rjT=-1e9;co22Rejoin(performance.now());qOk(sent.some(m=>m.t==='join'&&!m.host),'같은 방장 방에 다시 참가 안 함');out.push('참가자 다시 참가');
    ws();NET.lobby=[{id:43,n:'모르는 사람',r:1}];NET.roomHost=43;CO22.rjT=-1e9;co22Rejoin(performance.now());qOk(!sent.some(m=>m.t==='join'),'다른 사람 방에 들어감');
    ws();CO22.rj={host:true,hn:'나',t:Date.now(),drop:1};NET.roomHost=0;NET.lobby=[];CO22.rjT=-1e9;co22Rejoin(performance.now());qOk(sent.some(m=>m.t==='join'&&m.host),'방장이 방을 다시 안 엶');out.push('방장 다시 염');
    ws();CO22.rj={host:true,hn:'나',t:Date.now(),drop:1};NET.roomHost=7;CO22.rjT=-1e9;co22Rejoin(performance.now());qOk(!sent.some(m=>m.t==='join'),'다른 방이 있는데 방을 엶');
    ws();CO22.rj={host:false,hid:42,hn:'QA 방장',t:Date.now()-CO22.RJMS-1000};NET.lobby=[{id:42,n:'QA 방장',r:1}];NET.roomHost=42;co22Rejoin(performance.now());qOk(!sent.some(m=>m.t==='join')&&CO22.rj===null,'5분 지났는데 다시 이음');out.push('5분');
    // 일부러 나가기
    qPty(2);NET.guest=true;NET.hostId='qa_peer';CO22.rj={host:false,hid:'qa_peer',hn:'QA 방장',t:Date.now()};netLeave(true);qOk(CO22.rj===null,'일부러 나갔는데 기억이 남음');
    // 다시 참가하면(joined) 기억을 새로 · 판 번호를 알림
    ws();NET.lobby=[{id:42,n:'QA 방장',r:1}];CO22.rj={host:false,hid:42,hn:'QA 방장',t:Date.now(),drop:1};const M=qCo22Msgs(()=>netOnMsg({t:'joined',id:9,host:42}));
    qOk(CO22.rj&&CO22.rj.hid===42&&CO22.rj.hn==='QA 방장'&&!CO22.rj.drop,'joined 뒤 기억');qOk(qCo22V(sent,'co22v').some(m=>m.v===22),'판 번호 안 보냄');qOk(M.some(t=>t.includes('파티로 돌아왔습니다')),'돌아왔다는 안내 없음');out.push('일부러 나가기 · joined')}
  finally{NET.lobby=keep.lobby;NET.roomHost=keep.rh;CO22.rj=null;qPtyOff();NET.ws=null;if(it)it.hidden=h0}return out.join(' · ')});
/* ===== v22 TOWN: 마을 넓히기 · 겹침 없음 · 누른 NPC와 이야기 · 같은 사람 한 명 · 건물이 간판/문을 가리지 않음 (town22.js) ===== */
// v21 마을 크기 (game-v21.html에서 잰 값): 마을 건물 · 노점 · 짝문 · 창고 · 의뢰인 · 마을 사람 자리의 한가운데까지 거리 90번째 백분위
const Q22_V21={brenhill:466,willowen:346,haven:371,arden:372,goldmere:247,elderhold:262,sahar:246,frostheim:268,tamal:250,emberhold:268,pearlport:250,rookwell:275,windcrag:268,dustgate:301,gullhaven:250,lastlight:250,pilgrimtent:190,keeperhouse:217,mistford:215,charkiln:215,frostlamp:215,stormcloister:215,rootwatch:215,lastvigil:215};
const q22To=t=>{const r=t.reg||'home';if(REG.id!==r){if(r==='home')loadRegion('home');else qWxTo(r)}return twL(r)};
// 마을 물건 발자국 반지름 (그림 크기 기준, 납작한 바닥 그림은 0)
const Q22_R={well:20,wagon:30,tent:30,w3tent:30,cart:24,boat:30,haystack:18,oak:16,bench:14,flowerbed:16,planter:12,statue2:20,trough:16,campfire:12,barrel:8,crate:8,kegs:12,sacks:9,anvil:14,nets:14,drift:12,sheep:9,bboard:14,altar:12,cat:6,edrum:10,d21lamp:6,fountain:66,statue:36,facesign:20,shop:40,gate:26,stash:20,signpost:5,banner:5,lamp:4,a3gate:30,mzgate:30};
function q22Objs(L,t){const ext=Math.max(...L.decor.filter(d=>d.town===t&&!d.room).map(d=>Math.hypot(d.x-t.x,d.y-t.y)))+60;
  return L.decor.filter(d=>!d.room&&Math.hypot(d.x-t.x,d.y-t.y)<ext&&(d.town===t||d.tprop||d.k==='fountain'||d.k==='statue'||d.k==='facesign'||d.zl===0&&d.pv!=null)&&!(d.town&&d.town!==t))}
qT('v22 마을','마을 넓이: 모든 마을이 v21보다 20~50% 넓어짐 (붐비던 마을일수록 더) · 안전 지대도 같이',()=>{const r=[];
  for(const [L,t] of wxTowns()){const v=Q22_V21[t.id];if(!v||t.id==='arden'||t.id==='haven')continue;/* v26: 왕도는 새로 그림, 헤이븐은 윌로벤 나루를 합쳐 따로 잼 */const s=tw22Stat(L,t),k=s.p90/v,want=TK22[t.id];
    qOk(k>=1.18&&k<=1.55,`${t.id}: ${v} → ${s.p90} (×${qR(k)})`);qOk(Math.abs(k-want)<.1,`${t.id}: 배율 ×${qR(k)} ≠ 표 ×${want}`);
    qOk(t.safe>=SAFE&&t.safe>=s.max+40,`${t.id}: 안전 지대 ${t.safe} < 마을 끝 ${s.max}+40`);r.push(`${t.id}×${qR(k)}`)}
  qOk(TK22.haven>=TK22.brenhill&&TK22.willowen>=TK22.windcrag,'붐비던 마을이 덜 넓어짐');/* v26: 왕도 아르덴은 새로 넓게 그려 배율 1 */
  qOk(T22.ms<1500,`넓히기 계산 ${T22.ms}ms`);return r.join(' ')+` · ${T22.ms}ms`});
qT('v22 마을','겹침 없음: 건물끼리 · 소품과 건물 · 소품끼리 · 마을 사람 (모든 마을)',()=>{const bad=[];let n=0;
  for(const [L,t] of wxTowns()){const O=q22Objs(L,t),B=O.filter(d=>d.foot&&(d.k==='bld'||d.k==='cwall'||d.k==='gatetower'||d.k==='well'||d.k==='wagon'||d.k==='tent'||d.k==='statue2')),C=O.filter(d=>!d.foot&&d.k!=='tfolk'&&d.k!=='npc'&&Q22_R[d.k]);
    const rg=(a,b)=>Math.max(a[0]-b[2],b[0]-a[2],a[1]-b[3],b[1]-a[3]),wall=d=>d.k==='cwall'||d.k==='gatetower';
    for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++){if(wall(B[i])&&wall(B[j]))continue;for(const f of B[i].foot)for(const g of B[j].foot)if(rg(f,g)<2)bad.push(`${t.id}: ${B[i].label||B[i].k}↔${B[j].label||B[j].k}`)}
    for(const c of C){const r=Q22_R[c.k];for(const b of B)for(const f of b.foot)if(wxRD(c.x,c.y,f)<-r*.3)bad.push(`${t.id}: ${c.k} 이 ${b.label||b.k} 안`);
      for(const e of C){if(e===c||e.x+e.y<c.x+c.y||c.k==='fence'||e.k==='fence')continue;if(c.k==='sheep'&&e.k==='sheep')continue;const d=Math.hypot(c.x-e.x,c.y-e.y);if(d<(r+Q22_R[e.k])*.6)bad.push(`${t.id}: ${c.k}↔${e.k} ${Math.round(d)}`)}n++}
    const a=wxTownAudit(L,t);for(const b of a.bad)bad.push(`${t.id}: ${b.join(' ')}`)}
  qOk(!bad.length,bad.slice(0,6).join(' / '));return `소품 ${n}개`});
qT('v22 마을','누르는 상자: 사람 · 의뢰인 · 노점 · 짝문 · 창고 · 의뢰 물건의 보이는 몸 상자가 서로 안 겹침 (모든 마을)',()=>{const bad=[];let n=0;
  for(const [L,t] of wxTowns()){const O=L.decor.filter(d=>!d.room&&Math.hypot(d.x-t.x,d.y-t.y)<900&&(d.town===t||!d.town)&&tw22Box(d,false)).map(d=>{const x=d.k==='tfolk'?d.hx:d.x,y=d.k==='tfolk'?d.hy:d.y;return{d,r:tw22Abs(d,x,y,tw22Box(d,false))}});
    for(let i=0;i<O.length;i++)for(let j=i+1;j<O.length;j++)if(!tw22Same(O[i].d,O[j].d)&&tw22Hit(O[i].r,O[j].r,0))bad.push(`${t.id}: ${O[i].d.n||O[i].d.k}↔${O[j].d.n||O[j].d.k}`);n+=O.length}
  qOk(!bad.length,bad.slice(0,6).join(' / '));return `상자 ${n}개`});
// 누르기: 그 사람의 보이는 몸 가운데 · 네 귀퉁이 안쪽을 눌러 고른다 (PC 마우스 · 휴대폰 손가락 여유)
qT('v22 마을','누르면 그 사람: 모든 마을의 모든 사람 · 의뢰인 · 노점 · 짝문 · 창고를 몸 위에서 누르면 바로 그것이 골라짐 (PC · 휴대폰)',()=>{qPrep('mage');const bad=[];let n=0;
  for(const [L0,t] of wxTowns()){const L=q22To(t);/* 걷는 사람은 모두 제자리에서 (앞 시험에서 걷다 노점 앞에 선 사람 때문에 흔들림) */for(const f of L.decor)if(f.k==='tfolk'&&f.hx!=null){f.x=f.hx;f.y=f.hy}for(const d of L.decor){if(d.room||Math.hypot(d.x-t.x,d.y-t.y)>900||!(d.town===t||!d.town)||!tw22Box(d,true))continue;
      if(d.k==='tfolk'){d.x=d.hx;d.y=d.hy}P.x=d.x+30;P.y=d.y+40;followCam();const b=tw22Box(d,true),s=W2S(d.x,d.y);
      for(const [u,v] of [[.5,.5],[.15,.15],[.85,.15],[.15,.85],[.85,.85]]){const px=s.x+b[0]+(b[2]-b[0])*u,py=s.y+b[1]+(b[3]-b[1])*v;
        for(const touch of [false,true]){const g=tw22Pick(px,py,touch);if(g!==d&&!(g&&tw22Same(d,g)))bad.push(`${t.id}: ${d.n||d.k} (${u},${v}${touch?' 휴대폰':''}) → ${g?g.n||g.k:'없음'}`)}}n++}}
  loadRegion('home');qOk(!bad.length,bad.slice(0,6).join(' / '));return `${n}개`});
// 진짜 누르기: 캔버스에 포인터 이벤트를 보내 doAct가 무엇을 하는지 본다 (브렌힐 · 헤이븐 · 아르덴 · 윌로벤 가장 붐비는 곳 포함)
qT('v22 마을','진짜 누르기: 마우스 클릭 · 휴대폰 탭(오른쪽 · 조이스틱 자리) · 멀면 걸어가서 말 걸기 · 가까운 다른 사람이 아니라 누른 사람',()=>{qPrep('mage');const got=[],keep=doAct;const out=[];
  doAct=function(){got.push({act,o:act==='tw_talk'||act==='tw_use'?TW.act:null,town:actTown,shop:actShop});qClosePanels()};
  const fire=(type,px,py,pt,id)=>{const r=cv.getBoundingClientRect();const e=new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id||1,pointerType:pt,button:0,isPrimary:true,clientX:r.left+px*CZ,clientY:r.top+py*CZ});(type==='pointerup'?window:cv).dispatchEvent(e)};
  const ok=(d,g)=>g&&(d.k==='tfolk'?(d.shopk?g.act==='shop'&&g.shop===d.shopk:g.act==='tw_talk'&&g.o===d):d.k==='npc'?g.act==='quest'&&g.town===d.town:d.k==='shop'?g.act==='shop'&&g.shop===d.shopType:g.act===d.k);
  try{for(const tid of ['brenhill','haven','arden']){/* v26: 윌로벤 → 헤이븐 나루 */const t=ALLTOWNS.find(x=>x.id===tid),L=q22To(t);
      // 가장 붐비는 곳: 서로 가장 가까운 사람 둘
      const F=L.decor.filter(d=>d.k==='tfolk'&&d.town===t&&!d.room);let best=null,bd=1e9;for(const a of F)for(const b of F)if(a!==b){const q=Math.hypot(a.hx-b.hx,a.hy-b.hy);if(q<bd){bd=q;best=[a,b]}}
      const list=[...best,...L.decor.filter(d=>d.town===t&&(d.k==='npc'||d.k==='gate'||d.k==='stash'||d.k==='shop'&&d.tshop))];
      for(const d of list){for(const [pt,side] of [['mouse',0],['touch',1],['touch',-1]]){qClosePanels();got.length=0;if(d.k==='tfolk'){d.x=d.hx;d.y=d.hy;d.path=null}
          const o=best.find(x=>x!==d)||d;P.x=(d.x+o.x)/2+(side<0?-20:20);P.y=(d.y+o.y)/2+30;if(dist(P,d)>50){P.x=d.x+25;P.y=d.y+30}followCam();
          // 휴대폰 조이스틱 자리(왼쪽) 시험: 카메라를 옮겨 대상이 왼쪽에 오게
          if(side<0){camX+=W*.3}else if(side>0){camX-=W*.25}
          const b=tw22Box(d,true),s=W2S(d.x,d.y),px=s.x+(b[0]+b[2])/2,py=s.y+(b[1]+b[3])/2;
          if(pt==='touch'&&side<0&&!(px<W*.45))continue;if(pt==='touch'&&side>0&&px<W*.45)continue;
          fire('pointerdown',px,py,pt,7);if(pt==='touch')fire('pointerup',px,py,pt,7);qStep(1,{render:false});
          if(!ok(d,got[0]))out.push(`${tid}: ${d.n||d.k} ${pt}${side<0?'(왼쪽)':''} → ${got[0]?got[0].act+(got[0].o?':'+got[0].o.n:''):'없음'}`);
          if(mouse.l||fireTouch)out.push(`${tid}: ${d.n||d.k} 누르기가 마법을 쏨`);mouse.l=false;fireTouch=null;joy=null}}
      // 멀리 있는 사람: 걸어가서 말 걸기
      {const f=best[0];f.path=null;f.x=f.hx;f.y=f.hy;got.length=0;qClosePanels();const a=Math.atan2(t.y-f.y,t.x-f.x);let p=null;
        for(const r of [220,180,140]){const x=f.x+Math.cos(a)*r,y=f.y+Math.sin(a)*r;if(tw22FreeAt(x,y)){p={x,y};break}}
        if(p){P.x=p.x;P.y=p.y;followCam();tw22Click(f);qStep(600,{render:false,until:()=>got.length>0});if(!ok(f,got[0]))out.push(`${tid}: ${f.n}에게 걸어가서 말 걸기 실패 (${Math.round(dist(P,f))} 남음)`)}}}}
  finally{doAct=keep;loadRegion('home');joy=null}
  qOk(!out.length,out.slice(0,5).join(' / '));return '마우스 · 탭 · 걸어가기'});
qT('v22 마을','PC: 마우스를 올린 사람을 F가 먼저 고름 · 이름이 보임 · 패널이 열려 있으면 누르기를 가로채지 않음',()=>{qPrep('mage');const t=TOWNS[0],F=decor.filter(d=>d.k==='tfolk'&&d.town===t&&!d.shopk);
  let a=null,b=null,bd=1e9;for(const x of F)for(const y of F)if(x!==y){const q=Math.hypot(x.hx-y.hx,x.hy-y.hy);if(q<bd){bd=q;a=x;b=y}}a.path=b.path=null;a.x=a.hx;a.y=a.hy;b.x=b.hx;b.y=b.hy;
  P.x=(a.x+b.x)/2;P.y=(a.y+b.y)/2+10;followCam();mouse.active=true;touchMode=false;T22.hov=a;qStep(1,{render:false});const r1=act==='tw_talk'&&TW.act===a;T22.hov=b;qStep(1,{render:false});const r2=act==='tw_talk'&&TW.act===b;
  T22.hov=null;mouse.active=false;qOk(r1&&r2,`마우스 올린 사람 우선 아님 (${a.n}/${b.n})`);
  openPanel('char');const s=W2S(a.x,a.y),bx=tw22Box(a,true),r=cv.getBoundingClientRect();let ate=false;const h=e=>{ate=!e.defaultPrevented};cv.addEventListener('pointerdown',h);
  cv.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'mouse',button:0,clientX:r.left+(s.x+(bx[0]+bx[2])/2)*CZ,clientY:r.top+(s.y-30)*CZ}));cv.removeEventListener('pointerdown',h);mouse.l=false;
  qOk(tab==='char'&&!panel.hidden,'패널이 바뀜');closePanel();return `${a.n} · ${b.n} 사이 ${Math.round(bd)}`});
// 옛 저장: v21 마을 한가운데 · 사람 · 노점 · 건물 자리에 서 있던 저장을 불러오면 걸을 수 있는 빈자리
qT('v22 마을','옛 v21 저장: 옛 마을 한가운데 · 옛 사람/노점/건물 자리에서 불러와도 건물 위 · 물속이 아닌 걸을 수 있는 자리 · 원래 걸을 수 있던 자리면 그대로 (고향 · 지역 마을)',()=>{qPrep('mage');const bad=[];let n=0;
  for(const [L0,t] of wxTowns()){if(!['brenhill','willowen','haven','arden','goldmere','pearlport','tamal','mistford'].includes(t.id))continue;const reg=t.reg||'home',M=T22.map[reg];
    const old=[[t.x,t.y],[t.x,t.y+110]];for(const k of M.keys()){const [x,y]=k.split(',').map(Number);if(Math.hypot(x-t.x,y-t.y)<700)old.push([x,y])}
    for(const [x,y] of old.slice(0,90)){const d=JSON.parse(JSON.stringify(saveData()));d.reg=reg;d.x=x;d.y=y;load(d,QA_SLOT);n++;
      if(!tw22WalkAt(P.x,P.y))bad.push(`${t.id}: (${x},${y}) → (${Math.round(P.x)},${Math.round(P.y)}) 걸을 수 없는 자리`);else if(tw22WalkAt(x,y)&&(P.x!==x||P.y!==y))bad.push(`${t.id}: (${x},${y}) 걸을 수 있던 자리인데 옮김`);else if(!q22Reach(t,P.x,P.y))bad.push(`${t.id}: (${x},${y}) → 마을에서 못 닿음`)}}
  qPrep('mage');qOk(!bad.length,bad.slice(0,5).join(' / '));return `${n}번 불러옴`});
// 마을 짝문 앞(도착 자리)에서 걸어서 닿는지: 12px 격자 (건물 발자국 · 물 · 막힌 땅 · 성벽)
function q22Grid(t){const L=twL(REG.id),S=12,N=Math.ceil(2000/S),x0=t.x-1000,y0=t.y-1000,blk=new Uint8Array(N*N),seen=new Uint8Array(N*N),B=(TW.blds[L.id]||[]).filter(b=>Math.hypot(b.x-t.x,b.y-t.y)<1300);
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=x0+i*S,y=y0+j*S;if(B.some(b=>b.foot.some(f=>x>f[0]-10&&x<f[2]+10&&y>f[1]-10&&y<f[3]+10))||twWet(L.id,x,y)||blockedAt(x,y))blk[j*N+i]=1}
  const st=[[t.x,t.y+110],[t.gate.x+20,t.gate.y+20]].map(([x,y])=>Math.round((y-y0)/S)*N+Math.round((x-x0)/S)).filter(k=>!blk[k]);const q=[...st];for(const k of q)seen[k]=1;
  for(let h=0;h<q.length;h++){const k=q[h],i=k%N,j=(k/N)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=i+a,Y=j+b;if(X<0||Y<0||X>=N||Y>=N)continue;const m=Y*N+X;if(seen[m]||blk[m])continue;seen[m]=1;q.push(m)}}
  return (x,y,r)=>{r=r||40;for(let j=Math.floor((y-y0-r)/S);j<=Math.ceil((y-y0+r)/S);j++)for(let i=Math.floor((x-x0-r)/S);i<=Math.ceil((x-x0+r)/S);i++){if(i<0||j<0||i>=N||j>=N)continue;if(seen[j*N+i]&&Math.hypot(x0+i*S-x,y0+j*S-y)<r)return true}return false}}
const Q22G=new Map();function q22Reach(t,x,y,r){const k=t.id+'/'+REG.id;let g=Q22G.get(k);if(!g){g=q22Grid(t);Q22G.set(k,g)}return g(x,y,r)}
qT('v22 마을','길: 마을 도착 자리에서 창고 · 짝문 · 노점 셋 · 의뢰인 · 모든 마을 사람 · 들어가는 문 · 의뢰 물건까지 걸어서 닿음 (모든 마을)',()=>{qPrep('mage');Q22G.clear();const bad=[];let n=0;
  for(const [L0,t] of wxTowns()){const L=q22To(t);const tg=[['창고',t.stash],['짝문',t.gate],...(t.shops||[]).map(s=>['노점 '+s.type,s]),...(t.npc?[['의뢰인',t.npc]]:[])];
    for(const d of L.decor){if(d.room||!(d.town===t||!d.town)||Math.hypot(d.x-t.x,d.y-t.y)>900)continue;if(d.k==='tfolk')tg.push([d.n,{x:d.hx,y:d.hy}]);else if(d.k==='bld'&&d.enter&&d.town===t)tg.push([d.label+' 문',d.door]);else if(d.use&&d.si==null&&d.k!=='a3gate'&&d.k!=='mzgate')tg.push([d.k,d])}
    for(const [nm,p] of tg){if(!p)continue;n++;if(!q22Reach(t,p.x,p.y,56))bad.push(`${t.id}: ${nm}`)}}
  loadRegion('home');qOk(!bad.length,'못 닿음: '+bad.slice(0,6).join(', '));return `${n}곳`});
qT('v22 마을','안전 지대: 마을 끝 사람까지 안전 · 마을 음악 · 몬스터는 넓어진 안전 지대 밖으로 밀림',()=>{qPrep('mage');const bad=[];
  for(const t of HOME.towns){for(const d of HOME.decor){if(d.town!==t||d.room)continue;const x=d.k==='tfolk'?d.hx:d.x,y=d.k==='tfolk'?d.hy:d.y;if(!inSafe(x,y,20))bad.push(`${t.id}: ${d.n||d.label||d.k} 안전 지대 밖`)}
    const a=.7;P.x=t.x+Math.cos(a)*(t.safe-200);P.y=t.y+Math.sin(a)*(t.safe-200);const e=dgMob('wolf',t.x+Math.cos(a)*(t.safe-60),t.y+Math.sin(a)*(t.safe-60),5);qStep(2,{render:false});if(Math.hypot(e.x-t.x,e.y-t.y)<t.safe-1)bad.push(`${t.id}: 몬스터가 안에 있음`);qClear();
    P.x=t.x+Math.cos(a)*(t.safe-30);P.y=t.y+Math.sin(a)*(t.safe-30);if(zoneLevel(P.x,P.y)!==0||zoneName(P.x,P.y)!==t.n)bad.push(`${t.id}: 가장자리 이름/레벨 ${zoneName(P.x,P.y)}`)}
  for(const id of REG_IDS){const L=RCACHE[id];if(!L||!L.town)continue;const t=L.town;for(const d of L.decor)if(d.town===t&&!d.room&&Math.hypot((d.k==='tfolk'?d.hx:d.x)-t.x,(d.k==='tfolk'?d.hy:d.y)-t.y)>t.safe-20)bad.push(`${t.id}: ${d.n||d.k} 안전 지대 밖`)}
  qOk(!bad.length,bad.slice(0,5).join(' / '));return HOME.towns.map(t=>t.id+' '+t.safe).join(' · ')});
qT('v22 마을','같은 사람은 한 곳에만: 이름 붙은 사람이 두 곳에 없음 · 이름(마지막 낱말)도 겹치지 않음 · 엘리안은 마법원 안 한 명',()=>{qPrep('mage');const d=tw22DupList();qOk(!d.length,'두 곳: '+d.map(x=>x[0]+' '+x[1].join('/')).join(', '));
  const names=[];for(const [L,t] of wxTowns())for(const f of L.decor)if(f.k==='tfolk'&&!f.room&&!/^o_/.test(f.id))names.push(f.n);for(const f of TW.folk)if(f.room)names.push(f.n);
  for(const t of ALLTOWNS)if(QNPC[t.id]&&t.npc)names.push(QNPC[t.id].n);const tok={};for(const n of new Set(names)){const w=n.split(' ');if(w.length<2)continue;const k=w[w.length-1];(tok[k]=tok[k]||[]).push(n)}
  const dup=Object.entries(tok).filter(([k,a])=>a.length>1);qOk(!dup.length,'같은 이름: '+dup.map(([k,a])=>a.join('·')).join(', '));
  const A=ALLTOWNS.find(t=>t.id==='arden'),AL=twL(A.reg||'home'),el=sqFolk('elian');qOk(el&&el.room==='arden_academy','엘리안이 마법원 안에 없음');qOk(!AL.decor.some(x=>x.k==='npc'&&x.town===A)&&!A.npc,'아르덴 바깥 의뢰인 그림이 남음');
  qOk(!AL.decor.includes(el)&&!HOME.decor.includes(el),'엘리안이 바깥에도 있음');qOk(QNPC.lastlight.n!=='감시자 세린'&&!WX_ACT2.some(q=>/감시자 세린/.test(q.say+q.goals.map(g=>g.d).join(''))),'감시자 이름이 그대로');
  return T22.dups.concat(T22.ren).join(' / ')});
qT('v22 마을','전직관 넷: 한 명씩 · 중요한 의뢰 카드/일지가 가리키는 자리가 그 사람 자리 · 메인 의뢰(아르덴)도 마법원 안 엘리안',()=>{qPrep('mage',{lvl:30});const r=[];
  for(const id in J2_INSTR){const n=TW.folk.filter(f=>f.id===id).length;qOk(n===1,`${id} ${n}명`);const f=sqFolk(id);const q=SQ.find(q=>q.giver===id&&(q.kind==='전직'||q.kind==='위계 시험'));if(!q)continue;
    const g=qGiverText21(q);qOk(g.includes(f.n)&&(!f.room||g.includes(TWROOM[f.room].n)),`${id}: 카드 글 ${g}`);
    const tq=SQ.find(q=>q.goals.some(x=>x.type==='talk'&&x.npc===id));if(tq){const s=sqState();s.a[tq.id]={c:{},got:[]};const tg=sqTarget(tq);delete s.a[tq.id];
      if(tg&&tq.goals.findIndex(x=>x.type==='talk'&&x.npc===id)===0)qOk(f.room?tg.room===f.room:Math.hypot(tg.x-f.hx,tg.y-f.hy)<1,`${id}: 일지 목표 자리 ≠ 사람 자리`)}r.push(f.n+(f.room?'('+TWROOM[f.room].n+')':''))}
  // 2막 첫 의뢰(아르덴): 목표 · 표시 · 이야기 · 받기
  P.q={i:12,st:0,c:{}};const tg=qMainTargetW();qOk(tg&&tg.room==='arden_academy'&&/엘리안/.test(tg.label),`메인 목표 ${tg&&tg.label}`);qOk(sqMark(sqFolk('elian'))==='!','엘리안 머리 위 ! 없음');
  loadRegion('royal');/* v26: 마법원은 왕도 지도 */const ms=sqMarks(false),b=TW.blds.royal.find(b=>b.enter==='arden_academy');qOk(b,'마법원 없음');qOk(ms.some(k=>k.kind==='!'&&k.mq&&Math.abs(k.x-b.door.x)<1&&Math.abs(k.y-b.door.y)<1),'마법원 문에 메인 ! 없음');
  sqTalk(sqFolk('elian'));qOk(!panel.hidden&&pbody.innerHTML.includes('data-qacc'),'엘리안에게서 메인 의뢰 받기 버튼 없음');qClick('#pbody [data-qacc]');qOk(P.q.st===1,'받기 실패');closePanel();
  P.q={i:12,st:2,c:{}};const t2=qMainTargetW(),q=qCur();if(qTurnTown(q)==='arden')qOk(t2&&t2.room==='arden_academy','돌아갈 곳이 마법원이 아님');
  // 마법사 위계 시험(엘리안)도 그대로
  P.q={i:0,st:0,c:{}};sqTalk(sqFolk('elian'));qOk(SQV.mode==='npc'||panel.hidden,'엘리안 대화 창');closePanel();loadRegion('home');return r.join(' · ')});
qT('v22 마을','건물이 간판 · 들어갈 문 · 노점을 가리지 않음 (모든 마을 · 그리는 순서와 무관) · 페이스라인 간판은 집 옆에 또렷이',()=>{const bad=[];let n=0;
  for(const [L,t] of wxTowns()){const h=tw22Hidden(L,t,.12);for(const v of h)bad.push(`${t.id}: ${v.kind} ${v.label} ${Math.round(v.frac*100)}%`);n+=tw22Marks(L,t).length}
  const sg=HOME.decor.find(d=>d.k==='facesign'),hs=HOME.decor.find(d=>d.k==='bld'&&d.label==='페이스라인 성형외과');qOk(sg&&hs&&Math.hypot(sg.x-hs.x,sg.y-hs.y)<270,'간판이 성형외과에서 멀어짐');
  const r=[(sg.x-sg.y)*KI-44,(sg.x+sg.y)*KI/2-104,(sg.x-sg.y)*KI+60,(sg.x+sg.y)*KI/2-58];for(const b of TW.blds.home)if(b.k==='bld'){const f=tw22Cover(r,tw22Hull(b));if(f>.04)bad.push(`간판이 ${b.label||'집'}에 ${Math.round(f*100)}% 가림`)}
  qOk(HOME.decor.some(d=>d.k==='statue'&&d.x===TOWNS[0].x&&d.y===TOWNS[0].y),'가짜코 동상이 한가운데가 아님');
  qOk(!bad.length,bad.slice(0,6).join(' / '));return `${n}곳`});
// 왕도 성벽 밖(등대지기의 집): 메아리의 거울(lord22) · 어둠의 등불(dark21)은 의뢰 물건이라 빈자리 · 안 겹침 · 건물에 안 가림 · 누르면 그것 (DEEP 요청)
qT('v22 마을','등대지기의 집 거울 · 등불: 걸을 수 있는 빈자리 · 다른 누르는 상자와 안 겹침 · 건물에 안 가림 · 몸을 누르면 그것이 골라짐 (PC · 휴대폰)',()=>{qPrep('mage');const bad=[],r=[];
  const t=ALLTOWNS.find(x=>x.id==='keeperhouse'),L=q22To(t);Q22G.clear();const keep=sqUseLive;
  sqUseLive=function(d){return d&&(d.use==='b4:mirror'||d.use==='d21:lamp')?{label:d.use,col:'#fff',q:0}:keep.apply(this,arguments)};
  try{for(const [nm,d] of [['메아리의 거울',B4.mirror],['어둠의 등불',D21.lamp]]){if(!d){bad.push(nm+' 없음');continue}
      qOk(L.decor.includes(d),nm+' 지역에 없음');const b=tw22Box(d,false);if(!b){bad.push(nm+' 누르는 상자 없음');continue}const R=tw22Abs(d,d.x,d.y,b);
      for(const o of L.decor){if(o===d||o.room||Math.hypot(o.x-d.x,o.y-d.y)>700||!tw22Box(o,false))continue;const x=o.k==='tfolk'?o.hx:o.x,y=o.k==='tfolk'?o.hy:o.y;if(tw22Hit(R,tw22Abs(o,x,y,tw22Box(o,false)),0))bad.push(`${nm}↔${o.n||o.k}`)}
      for(const B of TW.blds[L.id]||[])if(B.k==='bld'){const f=tw22Cover(R,tw22Hull(B));if(f>.12)bad.push(`${nm}이 ${B.label||'집'}에 ${Math.round(f*100)}% 가림`)}
      for(const B of TW.blds[L.id]||[])for(const f of B.foot||[])if(d.x>f[0]-20&&d.x<f[2]+20&&d.y>f[1]-20&&d.y<f[3]+20)bad.push(nm+' 건물 위');
      if(!q22Reach(t,d.x,d.y,56))bad.push(nm+' 걸어서 못 닿음');
      P.x=d.x+30;P.y=d.y+40;followCam();const s=W2S(d.x,d.y);
      for(const [u,v] of [[.5,.5],[.2,.2],[.8,.2],[.2,.8],[.8,.8]])for(const touch of [false,true]){const g=tw22Pick(s.x+b[0]+(b[2]-b[0])*u,s.y+b[1]+(b[3]-b[1])*v,touch);if(g!==d)bad.push(`${nm} (${u},${v}${touch?' 휴대폰':''}) → ${g?g.n||g.k:'없음'}`)}
      r.push(`${nm} 마을 가운데서 ${Math.round(Math.hypot(d.x-t.x,d.y-t.y))}`)}}
  finally{sqUseLive=keep;loadRegion('home')}
  qOk(!bad.length,bad.slice(0,6).join(' / '));return r.join(' · ')});
qT('v22 마을','같이 하기: 넓힌 마을 자리는 계산만으로 정해짐 (두 번 지어도 같은 자리) · 저장 형식 그대로',()=>{const sig=()=>wxTowns().map(([L,t])=>t.id+':'+[t.gate&&t.gate.x,t.gate&&t.gate.y,t.stash&&t.stash.x,t.stash&&t.stash.y,t.safe].map(v=>v==null?-1:v).map(Math.round).join(',')+':'+L.decor.filter(d=>d.town===t&&!d.room).map(d=>Math.round(d.k==='tfolk'?d.hx:d.x)+','+Math.round(d.k==='tfolk'?d.hy:d.y)).join(';')).join('|');
  const a=sig();let h=0;for(let i=0;i<a.length;i++)h=(h*31+a.charCodeAt(i))|0;qOk(T22.sig==null||T22.sig===h,'자리가 바뀜');T22.sig=h;
  qPrep('mage');const d=saveData();qOk(!('safe' in d)&&!('t22' in d)&&d.v===5,'저장에 새 칸');return '자리 지문 '+(h>>>0).toString(16)});
qT(QR22,'맞는 크기는 그림 설정과 상관없음: 새 그림(Flare) 켜고 묶음 받음 / 예전 그림에서 hR이 같음 (같이 하기에서 설정이 달라도 같은 판정) · 비룡 보스는 날개가 아닌 몸통 폭',()=>{qPrep('mage',{lvl:60});const art0=GFX.art,fl0=Object.assign({},FL.P),bad=[];
  try{const ks=['goblin','wolf','ogre','d_scorp','t_drake','b_sarakus','b_devourer','b_setra','d_mummy','ashsoldier','b_arsil'].filter(k=>TYPES[k]);const val=()=>ks.map(k=>{const e=dgMob(k,P.x+100,P.y,30);R22.gen++;const h=hR(e);e.dead=true;enemies=enemies.filter(o=>o!==e);return h});
    GFX.art='old';const a=val();GFX.art=undefined;for(const id of ['goblin','skeleton','ogre','antlion','zombie','wyvern','skelmage'])FL.P['m-'+id]=FL.P['m-'+id]||{};const b=val();
    ks.forEach((k,i)=>{if(a[i]!==b[i])bad.push(`${k} ${a[i]}/${b[i]}`)});qOk(!bad.length,bad.join(', '));
    const w=hR(dgMob('b_sarakus',P.x,P.y,30));qOk(w>=70&&w<=85,'비룡 보스 '+w);return ks.map((k,i)=>k+' '+a[i]).join(' · ')}
  finally{GFX.art=art0;for(const n in FL.P)if(!(n in fl0))delete FL.P[n];R22.gen++;qR22Clear()}});
/* ---- v22 GFX: 2차 · 3차 전직 기술 표시 (tier22.js) ---- */
const qT22exp=id=>{const s=SPELLS[id];return s.job3?3:s.job2||s.tab==='adv'?2:0};
const qT22parse=h=>{const d=document.createElement('div');d.innerHTML=h;return d};
// 한 직업 · 3차 갈래의 스킬 창 탭 전부(1차 나무 · 상위 기술 · 2차 갈래 · 3차 갈래)를 그려서 [data-node] 를 모은다
function qT22tabs(){const out=[],C=CLASSES[P.cls];
  for(let t=0;t<C.trees.length;t++){J2UI.tab=null;treeSel=t;nodeSel=null;out.push(['t'+t,qT22parse(treeHtml())])}
  for(const tb of ['adv','j2','j3']){J2UI.tab=tb;nodeSel=null;out.push([tb,qT22parse(treeHtml())])}J2UI.tab=null;treeSel=0;nodeSel=null;return out}
qT('전직 표시 v22','네 직업 · 3차 갈래 둘씩: 스킬 창의 모든 2차(갈래 · 상위 기술) 기술은 Ⅱ 테두리 · 3차 기술은 Ⅲ · 1차 기술은 표시 없음 · 빠진 기술 없음',()=>{const out=[];
  try{for(const cls of ['mage','priest','warrior','archer'])for(const br of Object.keys(JOB3[cls])){qPrep(cls,{lvl:140});qOk(qJob3On(br),`${cls} ${br} 3차`);
    const seen=new Map();let n1=0;
    for(const [tb,d] of qT22tabs())for(const el of d.querySelectorAll('[data-node]')){const id=el.dataset.node,e=qT22exp(id),m=el.querySelector(':scope > .t22m'),cl=[2,3].filter(t=>el.classList.contains('t22-'+t));
      qOk(TIER22.of(id)===e,`${id} 단계 ${TIER22.of(id)}≠${e}`);
      if(e){qOk(cl.length===1&&cl[0]===e&&m&&+m.dataset.t22===e&&m.querySelector('svg'),`${cls}/${tb} ${SPELLS[id].n}: 표시 ${cl} ${m&&m.dataset.t22}`);qOk((el.title||'').includes(TIER22.LBL[e]),`${SPELLS[id].n} 말풍선`)}
      else{n1++;qOk(!cl.length&&!el.querySelector('.t22m'),`1차 ${SPELLS[id].n}에 표시`)}seen.set(id,e)}
    const want=[...J2_SPELLS.filter(id=>SPELLS[id].job2===P.job2),...(ADV_IDS[cls]||[]).filter(id=>SPELLS[id]),...J3_SPELLS.filter(id=>SPELLS[id].job3===br)];
    const miss=want.filter(id=>!seen.has(id));qOk(!miss.length,`${cls} ${br} 빠짐: ${miss.slice(0,4).join(',')}`);
    out.push(`${cls}/${br} Ⅱ${[...seen.values()].filter(v=>v===2).length} Ⅲ${[...seen.values()].filter(v=>v===3).length} 1차${n1}`)}}
  finally{J2UI.tab=null;treeSel=0;nodeSel=null;qClosePanels()}return out.join(' · ')});
qT('전직 표시 v22','설명: 자세히 칸 · 단축칸 말풍선 · 스킬 창 아래 단축칸 줄에 「2차 전직 기술」 / 「3차 전직 기술」 줄 · 1차는 없음 · 단축칸에 레벨 글자 없음',()=>{qPrep('archer',{lvl:140});const br=Object.keys(JOB3.archer)[1];qJob3On(br);
  const a1=Object.values(SPELLS).find(s=>s.cls==='archer'&&!qT22exp(s.id)&&s.kind!=='passive').id,a2=J2_SPELLS.find(id=>SPELLS[id].job2===P.job2&&SPELLS[id].kind!=='passive'),aa=ADV_IDS.archer[0],a3=J3_SPELLS.find(id=>SPELLS[id].job3===br&&SPELLS[id].kind!=='passive');
  for(const id of [a1,a2,aa,a3])P.sk[id]=Math.max(1,P.sk[id]|0);
  try{for(const [id,e] of [[a1,0],[a2,2],[aa,2],[a3,3]]){const dh=detailHtml(id);
      if(e){qOk(dh.includes(`<b>${TIER22.LBL[e]}</b>`)&&dh.split('class="t22l').length===2,`${SPELLS[id].n} 자세히 칸`)}else qOk(!dh.includes('전직 기술')||!dh.includes('class="t22l'),'1차 자세히 칸에 줄')}
    P.bar[0]=a1;P.bar[1]=a2;P.bar[2]=aa;P.bar[3]=a3;
    const sb=i=>qT22parse(slotBtn(i)).firstElementChild;
    qOk(!sb(0).classList.contains('t22')&&!sb(0).title.includes('전직 기술'),'1차 단축칸');
    for(const [i,e] of [[1,2],[2,2],[3,3]]){const b=sb(i);qOk(b.classList.contains('t22-'+e)&&b.querySelector('.t22s')&&b.title.split('\n')[1]===TIER22.LBL[e],`단축칸 ${i} 「${b.title.split('\n')[1]}」`)}
    const dk=qT22parse(dockHtml());qOk(dk.querySelector('[data-dock="3"]').title.includes('3차 전직 기술')&&dk.querySelector('[data-dock="1"] .t22d')&&!dk.querySelector('[data-dock="0"] .t22d'),'아래 단축칸 줄');
    buildBar();const lv=[...document.querySelectorAll('#bar .sk[data-slot] .lvb')].filter(e=>e.getBoundingClientRect().width>0);qOk(!lv.length,'단축칸에 레벨 보임 '+lv.length);
    return [a2,aa,a3].map(id=>SPELLS[id].n).join(' · ')}finally{P.bar[0]=P.bar[1]=P.bar[2]=P.bar[3]=null;buildBar()}});
qT('전직 표시 v22','겹침: Ⅱ · Ⅲ 문양이 쓰는 방식 표시(즉시 · 시전 · 채널링) · 단축키 글자 · 파티 표시 · 레벨 숫자와 겹치지 않음 (단축칸 · 나무 · 상위 기술 · 3차 줄 · 아래 단축칸 줄)',()=>{qPrep('priest',{lvl:140});const br=Object.keys(JOB3.priest)[0];qJob3On(br);
  const ids=[...J2_SPELLS.filter(id=>SPELLS[id].job2===P.job2),...ADV_IDS.priest,...J3_SPELLS.filter(id=>SPELLS[id].job3===br)].filter(id=>SPELLS[id]&&SPELLS[id].kind!=='passive');for(const id of ids)P.sk[id]=Math.max(1,P.sk[id]|0);
  const ov=(a,b)=>{const r=a.getBoundingClientRect(),q=b.getBoundingClientRect();return r.width>0&&q.width>0&&r.left<q.right-.5&&q.left<r.right-.5&&r.top<q.bottom-.5&&q.top<r.bottom-.5};
  const chk=(root,what)=>{let n=0;for(const m of root.querySelectorAll('.t22n,.t22r,.t22s,.t22d')){const host=m.parentElement;n++;const r=m.getBoundingClientRect(),hr=host.getBoundingClientRect();qOk(r.width>=10&&r.left>=hr.left-.5&&r.right<=hr.right+.5&&r.top>=hr.top-.5&&r.bottom<=hr.bottom+.5,`${what} ${host.className}: 문양이 칸 밖 ${[r.left,r.top,r.width,hr.left,hr.top,hr.width].map(Math.round)}`);
      for(const o of host.querySelectorAll('.cmk,.k,.ptm,.ptb,.nl,.lvb,.cnt'))qOk(!ov(m,o),`${what} ${host.dataset.node||host.dataset.slot||host.dataset.dock}: 문양이 ${o.className}와 겹침`)}return n};
  const old=P.bar.slice();try{ids.slice(0,21).forEach((id,i)=>{P.bar[i]=id});buildBar();const nb=chk(document.querySelector('#bar'),'단축칸');qOk(nb>=10,'단축칸 문양 '+nb);
    openPanel('tree');let nt=0;for(const tb of ['j2','adv','j3']){J2UI.tab=tb;nodeSel=null;renderPanel();nt+=chk(pbody,tb)}
    const nd=chk(pbody.querySelector('.dock20')||pbody,'아래 단축칸 줄');qOk(nt>=20&&nd>=10,`창 문양 ${nt} · ${nd}`);return `단축칸 ${nb} · 창 ${nt} · 아래 줄 ${nd}`}
  finally{P.bar=old;J2UI.tab=null;buildBar();qClosePanels()}});
/* ===== v22 MOBILE: 휴대폰 가로 화면 · 단축바 · 귀환 버튼 · 카메라 · 확대 잠금 ===== */
const QM22='휴대폰 v22';
// 몸(body)을 w×h 화면처럼 만든다: transform이 있으면 fixed 요소도 몸 안에서 자리 잡는다. 미디어 쿼리 대신 M22.force로 휴대폰 배치.
function qM22(mode,w,h,fn){const b=document.body,h0=document.documentElement,bs=b.getAttribute('style'),hs=h0.getAttribute('style');
  const ov=document.getElementById('qaOverlay'),ovh=ov&&ov.style.display;if(ov)ov.style.display='none';
  M22.force=mode;M22.vpF=w?{w,h}:null;if(w){h0.style.height='auto';b.style.width=w+'px';b.style.height=h+'px';b.style.overflow='hidden';b.style.transform='translateZ(0)';b.style.position='relative'}
  const done=()=>{M22.force=null;M22.vpF=null;if(bs==null)b.removeAttribute('style');else b.setAttribute('style',bs);if(hs==null)h0.removeAttribute('style');else h0.setAttribute('style',hs);
    if(ov)ov.style.display=ovh||'';m22AskClose();resize();buildBar();M22.nextT=0;MOB.nextT=0;updateHud()};
  try{resize();buildBar();MOB.nextT=0;MOB.qTop=-1;M22.nextT=0;updateHud();MOB.nextT=0;M22.nextT=0;updateHud();return fn()}finally{done()}}
const qmR=e=>e.getBoundingClientRect();
const qmOv=(a,b)=>a.width>0&&b.width>0&&a.left<b.right-.5&&b.left<a.right-.5&&a.top<b.bottom-.5&&b.top<a.bottom-.5;
const qmGap=(a,b)=>Math.hypot(Math.max(0,b.left-a.right,a.left-b.right),Math.max(0,b.top-a.bottom,a.top-b.bottom));
function qM22Bar(n){const ids=Object.keys(SPELLS).filter(id=>SPELLS[id].cls===P.cls&&SPELLS[id].kind!=='passive').slice(0,n);P.bar=Array(21).fill(null);
  const at=[0,2,5,13,20,1,3,4,6,7,8,9,10,11,12,14,15,16,17,18,19];ids.forEach((id,i)=>{P.sk[id]=Math.max(1,P.sk[id]|0);P.bar[at[i]]=id});return ids}
qT(QM22,'휴대폰 단축바: 스킬·물약이 든 칸만 보임(빈 칸 · 0개 물약 · 귀환 두루마리 숨김) · 칸 순서와 저장(P.bar)은 그대로 · 칸 44px · 칸을 고르는 중(스킬 창)에는 빈 칸도 보임',()=>{qPrep('mage',{lvl:40});
  qM22Bar(5);P.pot.hp=2;P.pot.mp=0;P.pot.tp=3;for(const k in P.pot)if(/^(hp|mp)\d/.test(k))P.pot[k]=0;const bar0=JSON.stringify(P.bar);
  return qM22('L',844,390,()=>{const sh=m22Shown(),slots=sh.filter(b=>b.dataset.slot!=null).map(b=>+b.dataset.slot),pots=sh.filter(b=>b.dataset.pot).map(b=>b.dataset.pot);
    const want=P.bar.map((x,i)=>x?i:-1).filter(i=>i>=0);qOk(JSON.stringify(slots)===JSON.stringify(want),`보이는 칸 ${slots} / 든 칸 ${want}`);
    qOk(pots.includes('hp')===(potTotal('hp')>0)&&!pots.includes('mp')&&!pots.includes('tp'),'물약 칸 '+pots);
    for(const b of sh){const r=qmR(b);qOk(r.width>=40&&r.height>=40,`칸 작음 ${r.width}×${r.height}`)}
    qOk(JSON.stringify(P.bar)===bar0,'저장된 단축칸이 바뀜');
    bindId=P.bar[0];buildBar();const all=m22Shown().filter(b=>b.dataset.slot!=null).length;bindId=null;buildBar();qOk(all===21,'고르는 중 빈 칸이 안 보임 '+all);
    qM22Bar(21);P.pot.mp=1;buildBar();const s2=m22Shown(),rows=new Set(s2.map(b=>Math.round(qmR(b).top)));qOk(s2.length===23&&rows.size<=2,`21칸+물약 2: ${s2.length}칸 ${rows.size}줄`);
    for(const b of s2){const r=qmR(b);qOk(r.left>=0&&r.right<=844&&r.top>=0&&r.bottom<=390,'칸이 화면 밖')}
    return `보임 ${sh.length}칸 · 21칸이면 ${rows.size}줄`})});
qT(QM22,'단축바는 HP 구슬과 마나 구슬 사이: 가로 844×390 · 세로 390×844 (칸 9개 + 물약) · 화면 안',()=>{qPrep('mage',{lvl:40});qM22Bar(9);P.pot.hp=3;P.pot.mp=3;const out=[];
  for(const [m,w,h] of [['L',844,390],['P',390,844]])qM22(m,w,h,()=>{const hp=qmR(document.querySelector('.orb.hp')),mp=qmR(document.querySelector('.orb.mp')),bar=qmR($('#bar'));
    qOk(bar.left>=hp.right-.5&&bar.right<=mp.left+.5,`${m}: 막대 ${Math.round(bar.left)}~${Math.round(bar.right)} / 구슬 ${Math.round(hp.right)} · ${Math.round(mp.left)}`);
    for(const r of [hp,mp,bar])qOk(r.left>=0&&r.right<=w+.5&&r.top>=0&&r.bottom<=h+.5,`${m}: 화면 밖`);
    qOk(bar.bottom>=hp.top&&bar.top<=hp.bottom,`${m}: 막대가 구슬 높이와 안 맞음`);
    const rows=new Set(m22Shown().map(b=>Math.round(qmR(b).top))).size;qOk(m==='L'?rows===1:rows<=3,`${m}: ${rows}줄`);out.push(`${m} ${Math.round(bar.width)}px ${rows}줄`)});
  return out.join(' · ')});
qT(QM22,'귀환 두루마리: 휴대폰에서는 단축바(물약 옆)에서 빠지고 왼쪽 위 ☰ 옆 단추로 · 모든 물약·단축칸·구슬에서 120px 이상 떨어짐 · 던전에서는 한 번 더 물음(바로 누른 둘째 탭은 무시) · 「돌아가기」는 단추 자리와 겹치지 않음 · 들판은 묻지 않음',()=>{qPrep('mage',{lvl:40});qM22Bar(9);P.pot.hp=3;P.pot.mp=3;P.pot.tp=4;const out=[];
  for(const [m,w,h] of [['L',844,390],['P',390,844]])qM22(m,w,h,()=>{const tb=$('#m22tp');qOk(tb&&getComputedStyle(tb).display!=='none','귀환 단추 없음');const tr=qmR(tb);
    qOk(tr.width>=44&&tr.height>=40&&tr.left>=0&&tr.top>=0&&tr.right<=w&&tr.bottom<=h,`${m}: 단추 크기·자리 ${Math.round(tr.width)}×${Math.round(tr.height)}`);
    let mn=1e9;for(const b of [...m22Shown(),...document.querySelectorAll('.orb')])mn=Math.min(mn,qmGap(tr,qmR(b)));qOk(mn>=120,`${m}: 단축칸·물약과 ${Math.round(mn)}px`);
    qOk(!m22Shown().some(b=>b.dataset.pot==='tp'),'단축바에 귀환이 남음');out.push(`${m} ${Math.round(mn)}px`);
    if(m==='L'){enterDungeon(CAVES[0]);qOk(DG,'던전 못 들어감');updateHud();const n0=tpCount();m22TpPress();const ask=$('#m22ask');
      qOk(ask&&!ask.hidden&&!TPC,'던전에서 묻지 않음');const go=ask.querySelector('[data-go]');qOk(!qmOv(qmR(go),tr),'돌아가기가 단추 위');
      go.click();qOk(!TPC&&!ask.hidden,'바로 누른 둘째 탭이 먹힘');M22.askT-=1000;ask.querySelector('[data-no]').click();qOk(ask.hidden&&!TPC&&DG,'그만두기 안 됨');
      m22TpPress();M22.askT-=1000;ask.querySelector('[data-go]').click();qOk(TPC&&ask.hidden,'돌아가기 눌러도 안 펼침');P.x+=40;tpTick(.016);qOk(!TPC&&DG&&tpCount()===n0,'움직였는데 귀환');leaveDungeon()}});
  qPrep('mage',{lvl:40});qOk(m22TpRisky()==='','들판에서 위험으로 봄');const e=qDummy(P.x+200,P.y);e.aggroed=true;const k0=e.k;TYPES.qa_dummy.boss=1;try{qOk(m22TpRisky()==='boss','보스 싸움을 모름')}finally{delete TYPES.qa_dummy.boss}
  qM22('',0,0,()=>{qOk(getComputedStyle($('#m22tp')).display==='none','PC에 귀환 단추');const t=document.querySelector('#bar [data-pot="tp"]');qOk(t&&qmR(t).width>0,'PC 단축바 귀환 칸 없음')});
  return out.join(' · ')});
qT(QM22,'카메라: 휴대폰 가로 ×0.75 · 세로 ×0.8(화면 설정 배율에 곱함) → 보이는 세계가 넓어짐 · 화면 좌표(rel ÷ CZ)로 몬스터 겨누기 · 마을 NPC 고르기 · 땅 범위 자리가 맞음 · PC는 그대로',()=>{qPrep('mage',{lvl:40});const z=GFX.zoom,out=[];
  qOk(Math.abs(CZ-z)<1e-9,'PC 배율 '+CZ);
  for(const [m,w,h,k] of [['L',844,390,.75],['P',390,844,.8]])qM22(m,w,h,()=>{qOk(Math.abs(CZ-z*k)<1e-6,`${m} 배율 ${CZ}`);qOk(Math.abs(W-w/CZ)<1&&Math.abs(H-h/CZ)<1,`${m} 세계 크기 ${W}×${H}`);
    qOk(Math.abs(cv.width-Math.round(w*Math.min(1.5,devicePixelRatio||1)))<=1,'캔버스 픽셀 수가 바뀜 '+cv.width);
    followCam();const e=qDummy(P.x+120,P.y-40);const s=W2S(e.x,e.y),c=qmR(cv),ev={clientX:c.left+s.x*CZ,clientY:c.top+(s.y-TYPES[e.k].r)*CZ};const p=rel(ev);
    qOk(Math.abs(p.x-s.x)<.5&&Math.abs(p.y-(s.y-TYPES[e.k].r))<.5,`${m} rel ${p.x},${p.y}`);const a=aimAt(p.x,p.y);qOk(a&&a.snap===e,`${m} 몬스터 겨누기 안 됨`);
    const g=S2W(s.x,s.y);qOk(Math.hypot(g.x-e.x,g.y-e.y)<1,`${m} 땅 자리 어긋남`);e.dead=true;
    if(typeof tw22Targets==='function'){const T=tw22Targets().filter(d=>{const q=W2S(d.x,d.y);return q.x>40&&q.x<W-40&&q.y>60&&q.y<H-20});if(T.length){const d=T[0],b=tw22Box(d,true),q=W2S(d.x,d.y),
      pr=rel({clientX:c.left+(q.x+(b[0]+b[2])/2)*CZ,clientY:c.top+(q.y+(b[1]+b[3])/2)*CZ}),hit=tw22Pick(pr.x,pr.y,true);qOk(hit&&hit.x===d.x&&hit.y===d.y,`${m} NPC 고르기 어긋남`)}}
    out.push(`${m} ${CZ.toFixed(2)} → ${Math.round(W)}×${Math.round(H)}`)});
  qOk(Math.abs(CZ-z)<1e-9&&Math.abs(W-innerWidth/z)<1,'PC로 안 돌아옴');return out.join(' · ')});
qT(QM22,'가로 844×390: ☰·귀환 · 캐릭터 칸 · 지역·미니맵 · 의뢰 칸 · 대화 · 두 구슬 · 단축바 · 말 걸기 단추가 겹치지 않고 화면 안 (칸 21개여도) · 세로 390×844도 단축바·구슬·귀환·의뢰·대화가 겹치지 않음',()=>{qPrep('mage',{lvl:40});P.pot.hp=3;P.pot.mp=3;P.pot.tp=2;questHud();
  const had=!!$('#chat'),ch=chatBox(),wasOpen=ch.classList.contains('open');ch.classList.remove('open');/* 열린 대화 칸은 잠깐 덮는 입력 창이라 닫힌 모습으로 잰다 */const lg=ch.querySelector('#chatLog'),lg0=lg.innerHTML;lg.innerHTML='<div>[전체] 시험: 안녕하세요</div><div>[전체] 시험2: 같이 가요</div>';const out=[];
  try{for(const [m,w,h,n] of [['L',844,390,9],['L',844,390,21],['P',390,844,9]])qM22(m,w,h,()=>{qM22Bar(n);buildBar();actBtn.textContent='꼬마 미나와 이야기 (F)';actBtn.hidden=false;M22.nextT=0;updateHud();actBtn.textContent='꼬마 미나와 이야기 (F)';actBtn.hidden=false;
      const q=$('#qhud'),E={who:document.querySelector('#hud .who'),row:$('#m22row'),right:document.querySelector('#hud .rightcol'),quest:q&&!q.hidden?q:null,chat:$('#chat'),hp:document.querySelector('.orb.hp'),mp:document.querySelector('.orb.mp'),bar:$('#bar'),act:actBtn};
      const R={};for(const k in E)if(E[k])R[k]=qmR(E[k]);const ks=Object.keys(R),bad=[];
      for(const k of ks){const r=R[k];if(!(r.width>0))bad.push(k+' 안 보임');else if(r.left<-.5||r.top<-.5||r.right>w+.5||r.bottom>h+.5)bad.push(`${k} 화면 밖 ${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}`)}
      for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){if(m==='P'&&[ks[i],ks[j]].every(k=>['who','row','right','quest'].includes(k)))continue;if(qmOv(R[ks[i]],R[ks[j]])){const f=r=>[r.left,r.top,r.right,r.bottom].map(Math.round).join(',');bad.push(ks[i]+'↔'+ks[j]+` [${f(R[ks[i]])}] [${f(R[ks[j]])}]`)}}
      qOk(!bad.length,`${m}(${n}칸): ${bad.join(' · ')}${bad.length&&q?' · 의뢰 칸 「'+q.textContent.replace(/\s+/g,' ').slice(0,160)+'」':''}`);out.push(`${m}${n} ${ks.length}개`)})}
  finally{actBtn.hidden=true;actBtn.textContent='';if(!had)ch.remove();else{lg.innerHTML=lg0;if(wasOpen)ch.classList.add('open')}}
  return out.join(' · ')});
qT(QM22,'PC 1280은 그대로: 휴대폰 표시 없음 · 단축칸 21 + 물약 3 다 보임(빈 칸 포함) · 칸 53px · 버튼 줄이 접히지 않음 · 귀환 단추·가로 안내 없음 · 카메라 배율 = 화면 설정',()=>{qPrep('mage',{lvl:40});qM22Bar(3);
  if(M22.mode())return '휴대폰 폭에서 돌림(건너뜀)';buildBar();updateHud();const b=document.body;qOk(!b.classList.contains('m22')&&!b.classList.contains('m22L')&&!b.classList.contains('m22P'),'PC에 휴대폰 표시');
  const vis=[...document.querySelectorAll('#bar button.sk')].filter(x=>qmR(x).width>0);qOk(vis.length===24,'PC 단축칸 '+vis.length);qOk(Math.round(qmR(vis[0]).width)===53,'칸 크기 '+qmR(vis[0]).width);
  qOk(qmR($('#treeBtn')).width>0&&getComputedStyle($('#menuBtn')).display==='none','PC 버튼 줄이 접힘');qOk(getComputedStyle($('#m22tp')||document.body).display==='none'||!$('#m22tp'),'귀환 단추 보임');
  const hn=$('#m22hint');qOk(!hn||hn.hidden||getComputedStyle(hn).display==='none','가로 안내 보임');qOk(Math.abs(CZ-GFX.zoom)<1e-9,'배율 '+CZ);
  qOk(getComputedStyle($('#m22row')).display==='contents','PC 버튼 줄 모양이 바뀜');return `칸 ${vis.length}`});
qT(QM22,'확대 잠금: viewport maximum-scale=1 · user-scalable=no · HUD·단축칸·창은 touch-action pan-x pan-y(두 번 탭·벌리기 확대 막음, 스크롤은 됨) · 게임 화면 none · gesturestart·dblclick 막음(입력 칸 제외) · 확대되면 「화면 원래 크기로」 단추 · 터치 기기 입력 칸 16px',()=>{qPrep('mage',{lvl:40});
  const m=document.querySelector('meta[name="viewport"]');qOk(m&&/maximum-scale=1\b/.test(m.content)&&/user-scalable=no/.test(m.content)&&/width=device-width/.test(m.content),'viewport '+(m&&m.content));
  const sk=document.querySelector('#bar button.sk');qOk(getComputedStyle(sk).touchAction==='pan-x pan-y','단축칸 '+getComputedStyle(sk).touchAction);qOk(getComputedStyle(cv).touchAction==='none','게임 화면 '+getComputedStyle(cv).touchAction);
  openPanel('tree');const card=panel.querySelector('.card');qOk(getComputedStyle(card).touchAction==='pan-x pan-y','창 '+getComputedStyle(card).touchAction);closePanel();const sk2=document.querySelector('#bar button.sk');
  const g=new Event('gesturestart',{cancelable:true,bubbles:true});sk2.dispatchEvent(g);qOk(g.defaultPrevented,'gesturestart');
  const d=new MouseEvent('dblclick',{cancelable:true,bubbles:true});sk2.dispatchEvent(d);qOk(d.defaultPrevented,'dblclick');
  const i=document.createElement('input');document.body.appendChild(i);const d2=new MouseEvent('dblclick',{cancelable:true,bubbles:true});i.dispatchEvent(d2);qOk(!d2.defaultPrevented,'입력 칸 dblclick 막힘');
  qM22('L',844,390,()=>{qOk(parseFloat(getComputedStyle(i).fontSize)>=16,'휴대폰 입력 칸 '+getComputedStyle(i).fontSize)});i.remove();
  try{qOk(m22ZoomCheck(2)===true,'확대 감지');const zb=$('#m22zoom');qOk(zb&&!zb.hidden&&/원래 크기/.test(zb.textContent),'되돌리기 단추');qOk(m22ZoomCheck(1)===false&&zb.hidden,'단추가 안 사라짐')}finally{m22ZoomCheck(1)}
  const css=[...document.querySelectorAll('style')].map(x=>x.textContent).join('');qOk(/@media \(pointer:coarse\)\{input,textarea,select\{font-size:16px/.test(css),'터치 입력 칸 16px 규칙');
  return m.content});
qT(QM22,'가로가 기본: 세로 휴대폰이면 「가로로 돌려 주세요」 안내(닫기 가능 · 세로로도 계속) · 가로면 안 보임 · 가로 잠금 부탁은 안 되는 곳에서도 오류 없음',async()=>{qPrep('mage',{lvl:40});const off=M22.hintOff;let closed=0;M22.hintOff=function(s){if(s)closed++;return false};
  try{qM22('P',390,844,()=>{m22Hint();const el=$('#m22hint');qOk(el&&!el.hidden&&getComputedStyle(el).display!=='none'&&/가로로 돌려/.test(el.textContent),'세로 안내 없음');const r=qmR(el);qOk(r.left>=0&&r.right<=390,'안내 화면 밖');
      el.querySelector('[data-x]').click();qOk(el.hidden&&closed===1,'닫기 안 됨');m22Hint();el.querySelector('[data-x]').click()});
    qM22('L',844,390,()=>{m22Hint();const el=$('#m22hint');qOk(!el||el.hidden||getComputedStyle(el).display==='none','가로인데 안내')});
    const r=await m22Lock();qOk(r===false||r===true,'잠금 결과 '+r)}finally{M22.hintOff=off;const el=$('#m22hint');if(el)el.hidden=true}
  return '안내 · 잠금 부탁'});
/* ---------- v22 QUEST: 의뢰 길 안내 (guide22.js) ---------- */
const QG22='길 안내 v22';
const qG22Off=()=>{if(P)delete P.qg;QG.cur=null;QG.last={}};
const qG22Edge=to=>{const h=regHop(REG.id,to);return EDGES.find(e=>e.to===h)};
const qG22Far=()=>{const s=sqState();for(const q of SQ){if(q.cls&&q.cls!==P.cls)continue;const keep=s.a;s.a={[q.id]:{c:{},got:[]}};const t=sqTarget(q);s.a=keep;if(t&&t.reg&&t.reg!=='home'&&REGIONS[t.reg])return{q,t}}return null};
qT(QG22,'의뢰 일지(L)에 「길 안내」 단추: 메인 · 진행 중 마을 의뢰 · 받을 수 있는 의뢰 · 중요한 의뢰 칸 · 한 번에 하나만(다른 것을 누르면 바뀌고, 같은 것을 다시 누르면 꺼짐)',()=>{qPrep('mage',{lvl:10});qG22Off();
  try{P.q={i:1,st:1,c:{}};sqAccept('wolfd');qOk(sqState().a.wolfd,'동쪽 길 순찰 못 받음');const h=sqLogHtml();
    qOk(h.includes('data-qg="main:1"'),'메인 단추 없음');qOk(h.includes('data-qg="sq:wolfd"'),'진행 중 의뢰 단추 없음');
    qOk(SQ.some(q=>!sqState().a[q.id]&&sqAvail(q)==='ok'&&h.includes(`data-qg="sq:${q.id}"`)),'받을 수 있는 의뢰 단추 없음');
    const acc=[...h.matchAll(/data-sqacc="([^"]+)"/g)].map(m=>m[1]);for(const id of acc)if(SQBY[id])qOk(h.includes(`data-qg="sq:${id}"`),'중요한 의뢰 칸 단추 없음 '+id);
    qClick('#qhud [data-sqlog]');qOk(!panel.hidden&&$('#pbody [data-qg="main:1"]'),'일지가 안 열림');
    qClick('#pbody [data-qg="main:1"]');qOk(P.qg==='main:1','메인 켜기 '+P.qg);qOk(/안내 끄기/.test($('#pbody [data-qg="main:1"]').textContent),'켠 단추 글');
    qClick('#pbody [data-qg="sq:wolfd"]');qOk(P.qg==='sq:wolfd','다른 의뢰로 바뀌지 않음 '+P.qg);qOk(/길 안내/.test($('#pbody [data-qg="main:1"]').textContent),'앞의 단추가 그대로 켜짐');
    qClick('#pbody [data-qg="sq:wolfd"]');qOk(!P.qg,'같은 단추로 안 꺼짐 '+P.qg);
    qOk(!qgSet('sq:없는의뢰')&&!P.qg,'없는 의뢰를 켬');qOk(!qgSet('main:5')&&!P.qg,'지금 아닌 메인을 켬');return `중요한 의뢰 칸 ${acc.length}개 포함`}
  finally{qClosePanels();qG22Off()}});
qT(QG22,'목표 자리: 사람(의뢰인 · 지금 서 있는 자리를 따라감) · 사냥터(가까운 목표 몬스터) · 던전 입구 → 맞는 던전 안에서는 준보스·보스 · 다른 던전/건물이면 나가는 문 · 입구 살펴보기(reach) · 다른 지역은 맵 끝 포탈 「○○로 가는 길」',()=>{qPrep('mage',{lvl:30});qG22Off();const r=[];
  try{const s=sqState();
    // 사람: 받을 수 있는 의뢰 → 바깥에 선 의뢰인
    const nq=SQ.find(q=>!q.cls&&sqAvail(q)==='ok'&&(()=>{const t=j2NpcAt(q.giver);return t&&!t.room&&(t.reg||'home')==='home'})());qOk(nq,'바깥 의뢰인 의뢰 없음');
    qOk(qgSet('sq:'+nq.id,true)&&P.qg==='sq:'+nq.id,'켜기');const t0=j2NpcAt(nq.giver);let tg=qgTargetW(P.qg),L=qgLocal(P.qg);
    qOk(tg&&tg.x===t0.x&&tg.y===t0.y&&tg.label.includes('의뢰인'),'의뢰인 자리 '+JSON.stringify(tg));qOk(L&&L.kind==='npc'&&Math.hypot(L.x-t0.x,L.y-t0.y)<200,'사람 '+JSON.stringify(L));
    const f=decor.find(d=>d.x===L.x&&d.y===L.y&&(d.k==='tfolk'||d.k==='npc'));qOk(f,'서 있는 사람 없음');const fx=f.x,fy=f.y;f.x=tg.x+6;f.y=tg.y-4;
    try{L=qgLocal(P.qg);qOk(L.x===f.x&&L.y===f.y,'자리를 옮긴 사람을 안 따라감')}finally{f.x=fx;f.y=fy}r.push('사람');
    // 메인을 받기 전: 그 의뢰인(건물 안이면 문)
    P.q={i:1,st:0,c:{}};qgSet('main:1',true);tg=qgTargetW('main:1');L=qgLocal('main:1');qOk(tg&&(tg.reg||'home')==='home'&&L&&(L.kind==='npc'&&Math.hypot(L.x-tg.x,L.y-tg.y)<200||L.kind==='door'&&L.x===tg.door.x),'메인 의뢰인 '+JSON.stringify(L));r.push('메인 의뢰인 '+L.kind);
    // 사냥터: 동쪽 길 순찰(늑대 · 재 들개)
    sqAccept('wolfd');qgSet('sq:wolfd',true);enemies=[];tg=qgTargetW('sq:wolfd');L=qgLocal('sq:wolfd');qOk(tg&&L.kind==='spot'&&L.x===tg.x&&L.y===tg.y,'사냥터 '+JSON.stringify(L));
    const w=dgMob('wolf',P.x+120,P.y+60,5);L=qgLocal('sq:wolfd');qOk(L.kind==='mob'&&L.x===w.x&&L.y===w.y,'가까운 늑대 '+JSON.stringify(L));
    const sk=dgMob('skeleton'in TYPES?'skeleton':'goblin',P.x+40,P.y+20,5);L=qgLocal('sq:wolfd');qOk(L.x===w.x,'목표가 아닌 몬스터를 가리킴');w.dead=true;sk.dead=true;L=qgLocal('sq:wolfd');qOk(L.kind==='spot','죽은 늑대');enemies=[];r.push('사냥터');
    // 입구 살펴보기(reach)
    const {ci,c}=qQ22Cave();P.q={i:1,st:1,c:{}};qgSet('main:1',true);tg=qgTargetW('main:1');L=qgLocal('main:1');qOk(tg.cave===ci&&L.kind==='cave'&&L.x===tg.x&&L.y===tg.y&&L.label.includes('입구'),'입구 '+JSON.stringify(L));r.push('입구');
    // 던전: 고분의 왕 → 입구 → 안에서는 볼그, 볼그를 잡으면 아르실
    P.q={i:2,st:1,c:{}};qgSet('main:2',true);P.x=c.x+260;P.y=c.y+220;tg=qgTargetW('main:2');L=qgLocal('main:2');qOk(tg.cave===ci&&L.kind==='cave'&&L.x===tg.x,'던전 입구 '+JSON.stringify(L));
    P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.ci===ci,'고분에 못 들어감');
    L=qgLocal('main:2');let e=enemies.find(o=>!o.dead&&o.x===L.x&&o.y===L.y);qOk(L.kind==='mob'&&e&&e.k==='m_bolg','던전 안 볼그 '+JSON.stringify(L));killE(e);
    L=qgLocal('main:2');e=enemies.find(o=>!o.dead&&o.x===L.x&&o.y===L.y);qOk(L.kind==='mob'&&e&&e.k==='b_arsil','다음은 아르실 '+JSON.stringify(L));leaveDungeon();r.push('던전 안 보스');
    // 다른 던전 안: 나가는 문
    const c2i=HOME.caves.findIndex((o,i)=>i!==ci&&o.cave);const c2=HOME.caves[c2i];P.q={i:2,st:1,c:{}};P.x=c2.x;P.y=c2.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.ci===c2i,'다른 던전 못 들어감');
    L=qgLocal('main:2');const ex=qRoute(qgTargetW('main:2'));qOk(L.kind==='exit'&&L.label==='던전 밖으로'&&ex&&L.x===ex.x&&L.y===ex.y,'다른 던전 안 '+JSON.stringify(L));leaveDungeon();r.push('던전 밖으로');
    // 건물: 의뢰인이 건물 안이면 바깥에서는 문, 그 건물 안에서는 그 사람, 다른 건물 안에서는 나가는 문
    const rq=SQ.find(q=>!q.cls&&sqAvail(q)==='ok'&&(()=>{const t=j2NpcAt(q.giver);return t&&t.room&&t.door})());
    if(rq){s.a={};qgSet('sq:'+rq.id,true);tg=qgTargetW('sq:'+rq.id);L=qgLocal('sq:'+rq.id);qOk(L.kind==='door'&&L.x===tg.door.x&&L.y===tg.door.y&&L.label.includes('건물 안'),'건물 문 '+JSON.stringify(L));
      const b=TW.blds.home.find(b=>b.enter===tg.room);twEnter(b);try{L=qgLocal('sq:'+rq.id);const fk=IN.list.find(o=>o.k==='tfolk'&&o.id===rq.giver);qOk(L.kind==='npc'&&fk&&L.x===fk.x&&L.y===fk.y,'건물 안 의뢰인 '+JSON.stringify(L))}finally{twLeave(true)}
      const b2=TW.blds.home.find(o=>o.enter&&o.enter!==tg.room);if(b2){twEnter(b2);try{L=qgLocal('sq:'+rq.id);qOk(L.kind==='exit'&&L.x===IN.exit.x&&L.y===IN.exit.y&&L.label==='건물 밖으로','다른 건물 안 '+JSON.stringify(L))}finally{twLeave(true)}}r.push('건물 문 · 안')}
    // 다른 지역: 맵 끝 포탈
    const far=qG22Far();qOk(far,'다른 지역 의뢰 없음');s.a={[far.q.id]:{c:{},got:[]}};qOk(qgSet('sq:'+far.q.id,true),'다른 지역 의뢰 켜기');L=qgLocal('sq:'+far.q.id);const ed=qG22Edge(far.t.reg),nm=REGIONS[far.t.reg].n;
    qOk(L.kind==='edge'&&L.to===far.t.reg&&ed&&L.x===ed.x&&L.y===ed.y,'포탈 '+JSON.stringify(L));qOk(L.label===qgRo(nm)+' 가는 길'&&/(으)?로 가는 길$/.test(L.label),'이름 '+L.label);
    qOk(qgRo('황금 평원')==='황금 평원으로'&&qgRo('브렌힐')==='브렌힐로'&&qgRo('바다')==='바다로','로/으로');r.push(L.label);
    return r.join(' · ')}
  finally{if(typeof IN!=='undefined'&&IN)twLeave(true);if(DG)leaveDungeon();qG22Off()}});
qT(QG22,'화살표가 목표 쪽을 가리킴: 동서남북 네 자리에서 화살표 각도 = 화면 위 목표 방향 · 화살표가 캐릭터 둘레(반지름 72px, 휴대폰은 54px)에 · 큰 지도를 열면 숨김',()=>{qPrep('mage',{lvl:30});qG22Off();const r=[];
  try{P.q={i:1,st:1,c:{}};qgSet('main:1',true);qStep(2,{render:false});qgTick(true);/* 마을 사람이 자리 잡은 뒤의 목표 */const tg=qgTargetW('main:1'),el=QG.el||qgEl();
    for(const [dx,dy,nm] of [[600,0,'동'],[-450,0,'서'],[0,600,'남'],[0,-450,'북'],[420,420,'남동']]){P.x=tg.x+dx;P.y=tg.y+dy;followCam();qStep(2,{render:false});qgTick(true);qStep(1,{render:false});qgTick(true);qgDraw();/* v25: 화살표 각도도 방금 고른 목표로 다시 그림(움직이는 마을 사람 목표면 qgTick 뒤 한 틈 어긋남 · 전체 점검에서 가끔 0.02 차이) */ /* v24: 마지막 한 프레임에 목표가 바뀌었으면(입구 근처 도착 등) 화살표도 그 목표로 다시 맞춘 뒤 잼 */
      const c=QG.cur,tgN=qgTargetW('main:1');qOk(c&&tgN&&Math.hypot(c.x-tgN.x,c.y-tgN.y)<=200&&c.label&&tgN.label.includes(c.label.split(' · ').pop()),`${nm} 목표 (지금 목표 ${tgN&&Math.round(tgN.x)},${tgN&&Math.round(tgN.y)} ${tgN&&tgN.label}) ${JSON.stringify(c)} · 나 ${Math.round(P.x)},${Math.round(P.y)} · ${REG.id}${DG?' 던전':''}${IN?' 건물':''}`);const a=W2S(P.x,P.y),b=W2S(c.x,c.y),want=Math.atan2((b.y-20)-(a.y-30),b.x-a.x);
      const iso=Math.atan2((c.x-P.x+c.y-P.y)/2,(c.x-P.x)-(c.y-P.y)),da=x=>Math.abs(Math.atan2(Math.sin(x),Math.cos(x)));
      qOk(da(QG.ang-want)<.01,`${nm} 각도 ${QG.ang.toFixed(3)} (기대 ${want.toFixed(3)})`);qOk(da(QG.ang-iso)<.12,`${nm} 쿼터뷰 방향과 다름 ${QG.ang.toFixed(2)} vs ${iso.toFixed(2)}`);
      qOk(!el.hidden,nm+' 숨음');const A=el.children[0].getBoundingClientRect(),cr=cv.getBoundingClientRect(),k=cr.width/W,px=cr.left+a.x*k,py=cr.top+(a.y-30)*k,ax=A.left+A.width/2,ay=A.top+A.height/2;
      const R=QG.ph?QG.Rm:QG.R;qOk(da(Math.atan2(ay-py,ax-px)-want)<.06&&Math.abs(Math.hypot(ax-px,ay-py)-R)<3,`${nm} 화살표 자리 (${Math.round(ax-px)},${Math.round(ay-py)})`);
      qOk(el.children[1].textContent.includes(`${Math.max(1,Math.round(Math.hypot(c.x-P.x,c.y-P.y)/10))}m`),nm+' 거리 글');r.push(`${nm} ${Math.round(QG.ang*57.3)}°`)}
    qOk(QG.Rm<QG.R&&QG.Rm<=56,'휴대폰 반지름');wmapOpen();try{qStep(1,{render:false});qOk(el.hidden,'큰 지도 위에 화살표')}finally{wmapClose()}
    qgSet('main:1',true);qStep(1,{render:false});qOk(el.hidden&&!P.qg,'끄면 안 숨음');return r.join(' · ')}
  finally{qG22Off();qStep(1,{render:false})}});
qT(QG22,'지도 표시 자리: 미니맵(가까우면 그 자리 · 멀면 가장자리 같은 방향 · 금색) · 큰 지도 지역 칸(던전 표시 · 맵 끝 포탈 표시와 같은 자리) · 세계 칸(목표 지역 칸)',()=>{qPrep('mage',{lvl:30});qG22Off();const r=[];
  try{P.q={i:1,st:1,c:{}};qgSet('main:1',true);const tg=qgTargetW('main:1'),{c}=qQ22Cave();
    // 미니맵
    P.x=tg.x+150;P.y=tg.y+120;followCam();qgTick(true);drawMinimap();let m=QG.last.mm;const S0=mm.width,mk=S0/2600,ex=S0/2+mk*((tg.x-tg.y)-(P.x-P.y))*KI,ey=S0/2+mk*((tg.x+tg.y)-(P.x+P.y))*KI/2;
    qOk(m&&!m.out&&Math.abs(m.x-ex)<.5&&Math.abs(m.y-ey)<.5,`미니맵 가까이 ${JSON.stringify(m)} 기대 ${ex.toFixed(1)},${ey.toFixed(1)}`);
    const px=mctx.getImageData(Math.round(m.x),Math.round(m.y),1,1).data;qOk(px[0]>140&&px[0]>px[2]+50,'미니맵 금색 아님 '+[...px].join());
    P.x=tg.x+2400;P.y=tg.y-300;followCam();qgTick(true);drawMinimap();m=QG.last.mm;const fx=(tg.x-tg.y)-(P.x-P.y),fy=((tg.x+tg.y)-(P.x+P.y))/2;
    qOk(m&&m.out&&Math.abs(Math.hypot(m.x-S0/2,m.y-S0/2)-(S0/2-8))<.5&&Math.abs(Math.atan2(m.y-S0/2,m.x-S0/2)-Math.atan2(fy,fx))<.01,'미니맵 멀리 '+JSON.stringify(m));r.push('미니맵');
    // 큰 지도 · 지역 칸: 같은 지역 → 던전 표시 자리
    P.x=QA_SPOT.x;P.y=QA_SPOT.y;qgTick(true);
    qWm22(0,0,'reg',(el,T)=>{const g=QG.last.reg,cl=T.find(t=>t.t.startsWith(c.cave.n+' · Lv'));qOk(g&&cl&&Math.abs(g.x-cl.x)<.5&&Math.abs(g.y-(cl.y+10))<.5,`지역 칸 던전 ${JSON.stringify(g)} vs ${cl&&cl.x},${cl&&cl.y}`);
      qOk(T.some(t=>t.t.startsWith('길 안내 · ')),'지역 칸 이름표')});
    // 다른 지역 → 그쪽 맵 끝 포탈 표시 자리 · 세계 칸
    const far=qG22Far(),s=sqState();s.a={[far.q.id]:{c:{},got:[]}};qgSet('sq:'+far.q.id,true);const ed=qG22Edge(far.t.reg),nm=REGIONS[ed.to].n;
    qWm22(0,0,'reg',(el,T)=>{const g=QG.last.reg,el2=T.find(t=>t.t.startsWith('→ '+nm));qOk(g&&el2&&Math.abs(g.x-el2.x)<.5&&Math.abs(g.y-(el2.y+11))<.5,`지역 칸 포탈 ${JSON.stringify(g)} vs ${el2&&el2.x},${el2&&el2.y}`);
      qOk(T.some(t=>t.t===`길 안내 · ${qgRo(REGIONS[far.t.reg].n)} 가는 길`),'포탈 이름표')});
    qWm22(0,0,'world',(el,T)=>{const w=QG.last.world,G=WMAP.geo,p=G.pos(far.t.reg),nt=T.find(t=>t.t.startsWith(REGIONS[far.t.reg].n)&&!t.t.startsWith('◆'));
      qOk(w&&w.id===far.t.reg&&Math.abs(w.x-p.x)<.5&&Math.abs(w.y-p.y)<.5,'세계 칸 '+JSON.stringify(w));qOk(nt&&Math.abs(nt.x-w.x)<G.w/2,'세계 칸 지역 이름과 다른 칸');
      qOk(T.some(t=>t.t===`◆ 길 안내 · ${REGIONS[far.t.reg].n}`),'세계 칸 글')});
    r.push('지역 칸 · 세계 칸 '+far.t.reg);qgSet(null,true);drawMinimap();qOk(!QG.last.mm,'끄고도 미니맵 표시');return r.join(' · ')}
  finally{qClosePanels();qG22Off()}});
qT(QG22,'저장 · 불러오기: 따라가는 의뢰가 남음 · 저장 칸이 없으면 꺼짐 · 이상한 값/끝난 의뢰는 지움 · 안 켰으면 저장 칸 없음',()=>{qPrep('mage',{lvl:10});qG22Off();
  try{P.q={i:1,st:1,c:{}};sqAccept('wolfd');let d=JSON.parse(JSON.stringify(saveData()));qOk(!('qg' in d),'끈 상태가 저장됨');
    qgSet('sq:wolfd',true);d=JSON.parse(JSON.stringify(saveData()));qOk(d.qg==='sq:wolfd','저장 '+d.qg);P.qg='main:1';qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT)&&P.qg==='sq:wolfd','불러오기 '+P.qg);
    qgSet('main:1',true);d=JSON.parse(JSON.stringify(saveData()));qOk(d.qg==='main:1'&&load(d,QA_SLOT)&&P.qg==='main:1','메인 왕복');
    const bad=['sq:없는의뢰','main:7','<b>x</b>','main:1;x',5,{a:1},'sq:'+'x'.repeat(40)];for(const v of bad){const d2=JSON.parse(JSON.stringify(d));d2.qg=v;qOk(load(d2,QA_SLOT)&&!('qg' in P),'이상한 값 '+JSON.stringify(v))}
    const d3=JSON.parse(JSON.stringify(d));delete d3.qg;qOk(load(d3,QA_SLOT)&&!('qg' in P),'칸 없음 → 꺼짐');qOk(P.q.i===1&&sqState().a.wolfd,'다른 진행이 바뀜');
    const d4=JSON.parse(JSON.stringify(d));d4.qg='sq:wolfd';delete d4.sq.a.wolfd;qOk(load(d4,QA_SLOT),'load');const v=sqAvail(SQBY.wolfd);qOk(v==='ok'||v==='low'?P.qg==='sq:wolfd':!P.qg,`받지 않은 의뢰: 받을 수 있으면 의뢰인 안내(${v} → ${P.qg})`);return '왕복 · 칸 없음 · 이상한 값 '+bad.length+'개'}
  finally{qG22Off()}});
qT(QG22,'의뢰를 끝내면 안내가 꺼지고, 단계가 남은 동안은 다음 목표로: 메인(의뢰인 → 고분 입구 → 보고) · 마을 의뢰(사냥 → 보고 → 끝) · 목표가 둘인 의뢰',()=>{qPrep('mage',{lvl:30});qG22Off();const r=[];
  try{P.q={i:1,st:0,c:{}};qgSet('main:1',true);const q1=QUESTS[1];const lab=()=>(qgTick(true),QG.cur&&QG.cur.label);const l0=lab();
    questAccept();qOk(P.qg==='main:1','받자 꺼짐');const tg=qgTargetW('main:1'),l1=lab();qOk(tg.cave!=null&&/입구/.test(l1)&&l1!==l0,`다음 목표 ${l0} → ${l1}`);
    P.x=tg.x;P.y=tg.y+70;q22ReachTick();qOk(P.q.st===2,'입구');const l2=lab();qOk(P.qg==='main:1'&&l2&&l2!==l1,`보고하러 ${l2}`);r.push([l0,l1,l2].join(' → '));
    questFinish();qOk(!P.qg&&!QG.cur,'메인 끝났는데 안 꺼짐 '+P.qg);qOk(P.q.i===2,'다음 의뢰');
    sqAccept('wolfd');qgSet('sq:wolfd',true);const w0=lab(),g=SQBY.wolfd.goals[0];for(let i=0;i<sqGoalN(g);i++)questKill({k:g.k[i%g.k.length],x:P.x,y:P.y,r:20});
    qOk(sqAllDone(SQBY.wolfd)&&P.qg==='sq:wolfd','사냥 끝나자 꺼짐');const w1=lab();qOk(w1&&w1!==w0,`보고하러 ${w0} → ${w1}`);sqFinish('wolfd');qStep(1,{render:false});qOk(!P.qg,'마을 의뢰 끝났는데 안 꺼짐');r.push('동쪽 길 순찰');
    qgSet('main:2',true);sqAccept('wolfd');qOk(P.qg==='main:2','다른 의뢰를 받아도 그대로');
    // 목표가 둘인 의뢰: 첫 목표를 끝내면 자리가 바뀜
    const s=sqState();let two=null;for(const q of SQ){if(q.cls&&q.cls!=='mage'||q.goals.length<2||q.goals[0].type!=='kill')continue;s.a={[q.id]:{c:{},got:[]}};P.qg='sq:'+q.id;const a=JSON.stringify(qgTargetW(P.qg));
      s.a[q.id].c.g0=sqGoalN(q.goals[0]);const b=JSON.stringify(qgTargetW(P.qg));if(a!==b&&!sqAllDone(q)){two=q;break}}
    qOk(two,'목표가 둘이고 자리가 다른 의뢰 없음');qgTick(true);qOk(P.qg==='sq:'+two.id&&QG.cur,'다음 목표로 안 넘어감');r.push('두 목표 '+two.id);
    sqAbandon(two.id);qOk(!P.qg,'포기한 의뢰 안내가 남음 '+P.qg);return r.join(' | ')}
  finally{qClosePanels();qG22Off()}});
qT(QM22,'가로 휴대폰 스킬 창: 아래 단축칸 줄(끌어 놓기)은 한 줄 21칸으로 얇게(창 높이의 30% 이하) · 글줄을 누르면 접고 펴짐 · 휴대폰 단축바의 2차·3차 문양(왼쪽 위)은 칸 안에서 키 글자와 겹치지 않음',()=>{qPrep('mage',{lvl:140});
  const ids=Object.keys(SPELLS).filter(id=>{const s=SPELLS[id];return s.cls==='mage'&&s.kind!=='passive'&&TIER22.of(id)}).slice(0,4),old=P.bar.slice();ids.forEach((id,i)=>{P.sk[id]=1;P.bar[i]=id});
  try{return qM22('L',844,390,()=>{buildBar();let n=0;for(const b of m22Shown()){const m=b.querySelector('.t22s'),k=b.querySelector('.k');if(!m)continue;n++;const r=qmR(m),br=qmR(b);
      qOk(r.width>0&&r.left>=br.left-.5&&r.top>=br.top-.5&&r.right<=br.right+.5&&r.bottom<=br.bottom+.5,'문양이 칸 밖');qOk(!k||!qmOv(r,qmR(k)),'문양이 키 글자와 겹침')}qOk(n>=Math.min(2,ids.length),'문양 칸 '+n);
    openPanel('tree');try{const d=pbody.querySelector('.dock20'),card=panel.querySelector('.card'),dr=qmR(d),cr=qmR(card),rows=new Set([...d.querySelectorAll('.dks')].map(x=>Math.round(qmR(x).top))).size;
      qOk(rows===1,'단축칸 줄 '+rows+'줄');qOk(dr.height<=cr.height*.3,`단축칸 줄 높이 ${Math.round(dr.height)} / 창 ${Math.round(cr.height)}`);qOk(cr.bottom<=390.5&&cr.right<=844.5,'창이 화면 밖');
      d.querySelector('.dk-t').click();const d2=pbody.querySelector('.dock20');qOk(getComputedStyle(d2.querySelector('.dk-g')).display==='none','접히지 않음');d2.querySelector('.dk-t').click();qOk(getComputedStyle(pbody.querySelector('.dock20 .dk-g')).display!=='none','펴지지 않음');
      return `문양 ${n}칸 · 아래 줄 ${Math.round(dr.height)}px / 창 ${Math.round(cr.height)}px`}finally{document.body.classList.remove('m22dk');closePanel()}})}
  finally{P.bar=old;buildBar()}});
/* ===== v22.1 휴대폰에서 소속을 못 고름: 잠긴 단추가 켜진 것처럼 보이고 이유(마우스 툴팁)가 안 보였다 ===== */
qT('소속 휴대폰 v22.1','4직업 소속 창을 휴대폰 가로 화면에서 손가락으로: 안 만난 대표는 「대표 찾아가기」(누르면 누구 · 어디 안내 + 길 안내 켜짐 + 창 닫힘, 고르지는 않음) · 마을에서 대표를 눌러 이야기하면 만남 · 그 뒤 「이 소속 고르기」로 골라짐 · 꺼진 v20 단추는 흐리게 + 이유 글',()=>{const out=[];
  const tap=sel=>{const el=pbody.querySelector(sel);qOk(el,`단추 없음: ${sel}`);if(!el)return null;const o={pointerType:'touch',pointerId:9,button:0,buttons:1,bubbles:true,cancelable:true};
    el.dispatchEvent(new PointerEvent('pointerdown',o));el.dispatchEvent(new PointerEvent('pointerup',Object.assign({},o,{buttons:0})));el.click();return el};
  const logT=()=>logEl.lastElementChild?logEl.lastElementChild.textContent:'';
  for(const cls of ['mage','priest','warrior','archer']){qPrep(cls,{lvl:20});loadRegion('home');const q=affQ(),s=sqState(),reps=affMine();qOk(q&&reps.length===3,cls+' 소속 의뢰');
    s.d[q.req]=1;sqAccept(q.id);qOk(s.a[q.id],cls+' 의뢰를 못 받음');delete P.qg;
    qM22('L',844,390,()=>{SQV.mode='npc';SQV.npc=sqFolk(q.giver);openPanel('quest');
      qOk(pbody.querySelectorAll('[data-v20a="affgo"]').length===3&&!pbody.querySelector('[data-v20a="affpick"]'),cls+': 만나기 전 「대표 찾아가기」 셋');
      qOk(!pbody.querySelector('[data-v20a^="aff"]:disabled'),cls+': 꺼진 소속 단추가 있음');qOk(/먼저 이야기해야/.test(pbody.textContent),cls+': 안내 글');
      const a=reps[2],nm=TWFOLK[a.npc].n,sel=`[data-v20a="affgo"][data-v20b="${a.id}"]`,r0=pbody.querySelector(sel)&&pbody.querySelector(sel).getBoundingClientRect();
      qOk(r0&&r0.width>=44&&r0.height>=28,`${cls}: 단추가 너무 작음 ${r0&&Math.round(r0.width)}x${r0&&Math.round(r0.height)}`);tap(sel);
      qOk(!P.aff,cls+': 안 만났는데 골라짐');qOk(panel.hidden,cls+': 창이 안 닫힘');qOk(logT().includes(nm)&&logT().includes(a.n),`${cls}: 안내 글 「${logT()}」`);
      qOk(P.qg==='sq:'+q.id,cls+': 길 안내가 안 켜짐 '+P.qg);const t=sqTarget(q);qOk(t&&t.label.includes(a.n),`${cls}: 길 안내가 고른 대표를 안 가리킴 ${t&&t.label}`)});
    for(const r of reps){const f=TW.folk.find(f=>f.id===r.npc);qOk(f,r.npc+' 없음');if(!f)continue;closePanel();TW.act=f;act='tw_talk';doAct();qClosePanels();qOk(affMet(q,r.id),`${cls}: ${f.n}와 이야기해도 만남이 안 남음`)}
    qM22('L',844,390,()=>{SQV.mode='npc';SQV.npc=sqFolk(q.giver);openPanel('quest');qOk(pbody.querySelectorAll('[data-v20a="affpick"]').length===3,cls+': 만난 뒤 고르기 셋');
      tap(`[data-v20a="affpick"][data-v20b="${reps[1].id}"]`);qOk(P.aff===reps[1].id,`${cls}: 손가락으로 못 고름 ${P.aff}`);qOk(s.d[q.id]===1&&!s.a[q.id],cls+': 의뢰가 안 끝남')});
    qClosePanels();out.push(`${cls} ${reps[1].n}`)}
  // 꺼진 v20 단추(금화 모자람 등)는 흐리게 보이고, 이유가 있으면 글로 보인다
  {const d=document.createElement('div');d.className='v20box';d.innerHTML=`<div class="v20row"><div>x</div><div class="btns">${v20Btn('qa_x',1,'받기',{cls:'primary',dis:1,title:'동시에 3개까지'})}</div></div>`;document.body.appendChild(d);
   const bt=d.querySelector('button');qOk(+getComputedStyle(bt).opacity<.6,'꺼진 단추가 흐리지 않음 '+getComputedStyle(bt).opacity);qOk(d.querySelector('.v20why')&&d.querySelector('.v20why').textContent==='동시에 3개까지','이유 글이 안 보임');d.remove()}
  return out.join(' · ')});
/* ===== v23 스킬 창: 모든 탭의 「+」 · 설명 띄우기 (사용자 15:09 「+를 넣으랬는데 왜 반영이 안됐어」 — v18 「+」가 1차 트리에만 있었음) ===== */
const qSk23Tabs=()=>['',  'adv','j2','j3'];
const qSk23Open=t=>{J2UI.tab=t||null;if(!t)treeSel=0;openPanel('tree');renderPanel();return J2UI.tab===(t||null)};
const qSk23Plus=id=>pbody.querySelector(`.nodeplus[data-learn="${id}"]`);
const qSk23Vis=b=>{b.scrollIntoView({block:'center'});const ov=document.getElementById('qaOverlay'),od=ov&&ov.style.display;if(ov)ov.style.display='none';try{return qSk23Vis0(b)}finally{if(ov)ov.style.display=od||''}};
const qSk23Vis0=b=>{const r=b.getBoundingClientRect();if(r.width<20||r.height<20)return false;const e=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return e===b||b.contains(e)};
qT('스킬 창 v23','4직업 · 1차 트리 · 상위 기술 · 2차 · 3차 탭 모두: 아이콘을 누르면 옆에 「+」(보이고 눌림) · 찍을 수 있으면 1점 오름 · 못 찍으면(레벨 · 선행 · 포인트 · 최대 · 전직 전) 막히고 눌러도 안 오르며 까닭을 알려 줌',()=>{const out=[];
  for(const cls of ['mage','priest','warrior','archer']){qPrep(cls,{lvl:140});const br=Object.keys(JOB2[cls])[0];P.job2=br;P.job3=JOB3_OF[br];P.sp=60;const seen={};
    for(const t of qSk23Tabs()){qOk(qSk23Open(t),`${cls} ${t||'1차'} 탭 못 엶`);const ids=[...pbody.querySelectorAll('[data-node]')].map(b=>b.dataset.node);qOk(ids.length>=4,`${cls} ${t||'1차'} 아이콘 ${ids.length}`);
      let up=0,lock=0;
      for(const id of ids.slice(0,6)){qClick(`#pbody [data-node="${id}"]`);const b=qSk23Plus(id);qOk(b,`${cls} ${t||'1차'} ${id}: + 없음`);if(!b)continue;qOk(qSk23Vis(b),`${cls} ${t||'1차'} ${id}: + 가 가려지거나 너무 작음`);
        const ok=canLearn(id),k=P.sk[id]||0,sp=P.sp;qOk((b.getAttribute('aria-disabled')==='true')===!ok,`${cls} ${id}: 막힘 표시 ${b.getAttribute('aria-disabled')} · 찍기 ${ok}`);
        b.click();if(ok){qOk((P.sk[id]||0)===k+1&&P.sp<sp,`${cls} ${id}: + 로 안 오름 ${k}→${P.sk[id]} sp ${sp}→${P.sp}`);up++}else{qOk((P.sk[id]||0)===k&&P.sp===sp,`${cls} ${id}: 막혔는데 오름`);qOk(/\S/.test(b.dataset.why||''),`${cls} ${id}: 까닭 없음`);lock++}}
      seen[t||'1차']=`${up}/${lock}`}
    // 3차 탭: 레벨이 모자란 스킬은 막힘
    qSk23Open('j3');const j3=[...pbody.querySelectorAll('[data-node]')].map(b=>b.dataset.node);P.lvl=100;renderPanel();const hi=j3.find(id=>!P.sk[id]&&!canLearn(id));qOk(hi,cls+': 레벨 100에 막힌 3차 스킬 없음');
    if(hi){qClick(`#pbody [data-node="${hi}"]`);const b=qSk23Plus(hi),k=P.sk[hi]||0;qOk(b&&b.getAttribute('aria-disabled')==='true',cls+': 막힌 3차 스킬 + 가 켜짐');b.click();qOk((P.sk[hi]||0)===k,cls+': 막힌 3차 스킬이 오름');const lt=logEl.lastElementChild&&logEl.lastElementChild.textContent;qOk(lt&&lt===b.dataset.why,`${cls}: 까닭 글 「${lt}」 · 「${b.dataset.why}」`)}
    // 최대 · 포인트 없음
    P.lvl=140;qSk23Open('');const f=[...pbody.querySelectorAll('[data-node]')].map(b=>b.dataset.node)[0];P.sk[f]=MAXSK;renderPanel();qClick(`#pbody [data-node="${f}"]`);qOk(/최대/.test(qSk23Plus(f).dataset.why),cls+': 최대 까닭');
    P.sp=0;qSk23Open('j2');const g=pbody.querySelector('[data-node]').dataset.node;qClick(`#pbody [data-node="${g}"]`);qOk(/포인트/.test(qSk23Plus(g).dataset.why),`${cls}: 포인트 까닭 「${qSk23Plus(g).dataset.why}」`);
    // 2차 전직 전에는 상위 기술이 막힘
    P.sp=5;P.job2=null;P.job3=null;qSk23Open('adv');const a=pbody.querySelector('[data-node]');if(a){qClick(`#pbody [data-node="${a.dataset.node}"]`);const b=qSk23Plus(a.dataset.node);qOk(b&&b.getAttribute('aria-disabled')==='true',cls+': 전직 전 상위 기술 + 가 켜짐');const k=P.sk[a.dataset.node]||0;b.click();qOk((P.sk[a.dataset.node]||0)===k,cls+': 전직 전 상위 기술이 오름')}
    qClosePanels();J2UI.tab=null;out.push(`${cls} ${Object.entries(seen).map(([k,v])=>k+' '+v).join(',')}`)}
  return out.join(' · ')});
qT('스킬 창 v23','설명 상자: 마우스를 아이콘 · 아래 단축칸에 올리면 이름 · 설명 · 레벨 · 수치가 뜨고 벗어나면 닫힘 · 휴대폰은 누르면 뜨고(고르기도 됨) 「+」를 가리지 않음 · 4초 뒤 닫힘 · 창 닫으면 닫힘',()=>{
  qPrep('mage',{lvl:30});P.sp=5;P.sk.firebolt=3;P.bar[0]='firebolt';const tip=()=>document.getElementById('sktip');qSk23Open('');
  const over=(el,pt)=>el.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:pt||'mouse'}));
  let n=pbody.querySelector('[data-node="firebolt"]');over(n);qOk(tip()&&!tip().hidden,'마우스: 안 뜸');const s=SPELLS.firebolt;
  qOk(tip().textContent.includes(s.n)&&tip().textContent.includes(s.desc.slice(0,12))&&/스킬 레벨 3/.test(tip().textContent),'내용 '+tip().textContent.slice(0,80));
  qOk(getComputedStyle(tip()).pointerEvents==='none','설명 상자가 누르기를 막음');
  const r=tip().getBoundingClientRect();qOk(r.left>=0&&r.top>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,'화면 밖');
  over(pbody.querySelector('.detail'));qOk(tip().hidden,'벗어나도 안 닫힘');
  const d=pbody.querySelector('[data-dock="0"]');qOk(d,'단축칸 없음');over(d);qOk(!tip().hidden&&tip().textContent.includes(s.n),'단축칸: 안 뜸');over(pbody.querySelector('[data-dock="5"]'));qOk(tip().hidden,'빈 칸인데 뜸');
  // 휴대폰: 누르면 고르고 설명도 뜨며 「+」는 그대로 눌림
  qM22('L',844,390,()=>{qSk23Open('');const id='spark';n=pbody.querySelector(`[data-node="${id}"]`);const o={pointerType:'touch',pointerId:5,bubbles:true,cancelable:true};
    n.dispatchEvent(new PointerEvent('pointerdown',o));n.dispatchEvent(new PointerEvent('pointerup',o));n.click();
    qOk(nodeSel===id,'누르기: 안 골라짐');qOk(!tip().hidden&&tip().textContent.includes(SPELLS[id].n),'누르기: 설명 안 뜸');const b=qSk23Plus(id);qOk(b&&qSk23Vis(b),'설명이 + 를 가림 '+(b&&(()=>{const r=b.getBoundingClientRect(),e=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)} → ${e&&(e.id||e.className||e.tagName)}`})()));
    const k=P.sk[id]||0;b.dispatchEvent(new PointerEvent('pointerdown',o));b.click();qOk((P.sk[id]||0)===k+1,'설명이 뜬 채로 + 가 안 눌림');qOk(tip().hidden,'다른 곳을 눌러도 안 닫힘');
    n=pbody.querySelector(`[data-node="${id}"]`);n.dispatchEvent(new PointerEvent('pointerdown',o));n.click();qOk(!tip().hidden,'다시 누르기');SK23.hideT&&clearTimeout(SK23.hideT);
    closePanel();qOk(tip().hidden,'창 닫아도 남음')});
  SK23.pt='mouse';qClosePanels();return '마우스 · 단축칸 · 휴대폰'});
/* ===== v24 보스 세기 · 보스방 · 필요 경험치 (사용자 2026-10-10 05:06 · 05:07) ===== */
qT('보스 v24','필요 경험치: 10레벨까지 v23과 같음 · 20레벨 ×2 · 40레벨 ×5 · 100레벨 ×8 · 140레벨 ×10 · 레벨마다 늘어남 · 57레벨은 v23의 5배 넘게',()=>{const r=[];
  for(let l=1;l<=10;l++)qOk(xpNeed(l)===xpNeedV23(l),`${l}레벨 바뀜`);
  for(const [l,k] of [[20,2],[40,5],[100,8],[140,10]]){const f=xpNeed(l)/xpNeedV23(l);qOk(Math.abs(f-k)<.02,`${l}레벨 ×${f.toFixed(2)}`);r.push(`${l} ×${f.toFixed(1)}`)}
  for(let l=2;l<MAXLV;l++)qOk(xpNeed(l)>xpNeed(l-1),`${l}레벨 필요 경험치가 줄어듦`);for(let l=11;l<MAXLV;l++)qOk(xpNeed(l)/xpNeedV23(l)>=xpNeed(l-1)/xpNeedV23(l-1)-1e-9,`${l} 배수가 줄어듦`);
  const f57=xpNeed(57)/xpNeedV23(57);qOk(f57>=5,'57레벨 ×'+f57.toFixed(2));return r.join(' · ')+` · 57 ×${f57.toFixed(1)}`});
qT('보스 v24','저장 안전: v23 저장(xpc 21)은 레벨 그대로 · 경험치 막대 비율 그대로 새 곡선으로 · v20 저장도 비율 그대로 · 새 저장은 xpc 24 · 다시 불러도 그대로 · 10레벨 이하는 그대로',()=>{const r=[];
  for(const [lv,fr,xpc] of [[57,.5,21],[120,.9,21],[30,.25,undefined],[8,.4,21],[139,.99,21]]){qPrep('mage',{lvl:lv});const old=xpc===21?xpNeedV23(lv):xpNeedV20(lv);P.xp=Math.floor(old*fr);const d=saveData();d.xpc=xpc;if(xpc==null)delete d.xpc;
    qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT),'불러오기 실패');qOk(P.lvl===lv,`${lv}레벨 → ${P.lvl}`);const f=P.xp/xpNeed(lv);qOk(Math.abs(f-fr)<.01,`${lv}레벨 막대 ${fr} → ${f.toFixed(3)}`);
    const d2=saveData();qOk(d2.xpc===24,'xpc '+d2.xpc);const x2=P.xp;qOk(load(JSON.parse(JSON.stringify(d2)),QA_SLOT)&&P.xp===x2&&P.lvl===lv,'다시 불러오니 바뀜');r.push(`${lv} ${Math.round(f*100)}%`)}
  return r.join(' · ')});
qT('보스 v24','던전 보스: 생명력 ×(10레벨 3 · 30레벨 5 · 60레벨 8 · 140레벨 10) · 공격력 ×1.15~1.35 · 준보스·졸개는 그대로 · 잿불 용암지대 57레벨 던전 보스는 예전보다 7.5배 넘게(10초 → 1분 넘게)',()=>{const r=[];
  qPrep('mage',{lvl:57});P.invT=1e9;loadRegion('lava');qOk(CAVES.length>0,'용암지대 던전 없음');
  for(const c of CAVES){if(DG)leaveDungeon();enterDungeon(c);qOk(DG&&DG.boss,c.cave.n+' 보스 없음');if(!DG||!DG.boss)continue;const b=DG.boss,t=TYPES[b.k],L=b.lvl;
    const hp0=Math.round(t.hp*(1+.34*(L-1))*DIFF[P.diff].hp);qOk(b._b24==='dg','표시 없음');qOk(Math.abs(b.max/hp0-B24.dgHp(L))<.01,`${t.n} Lv${L} 생명력 ×${(b.max/hp0).toFixed(2)}`);
    const d0=t.dmg*(1+.18*(L-1));qOk(Math.abs(b.dmg/d0-B24.dmg(L))<.01,`공격력 ×${(b.dmg/d0).toFixed(2)}`);
    for(const e of enemies)if(e!==b&&!e.dead){qOk(!e._b24,`${TYPES[e.k].n} 도 바뀜`);const t2=TYPES[e.k],h2=Math.round(t2.hp*(1+.34*(e.lvl-1))*DIFF[P.diff].hp*(e.elite?3:1));if(!e.k.startsWith('qa'))qOk(e.max<=h2*1.0001||e._d21||e._k22,`${t2.n} 생명력 ${e.max}/${h2}`);break}
    qOk(B24.dgHp(L)>=7.5||L<55,`Lv${L} ×${B24.dgHp(L)}`);r.push(`${c.cave.n} Lv${L} ×${B24.dgHp(L).toFixed(1)}`)}
  leaveDungeon();loadRegion('home');qOk(Math.abs(B24.dgHp(10)-3)<1e-9&&Math.abs(B24.dgHp(30)-5)<1e-9&&Math.abs(B24.dgHp(60)-8)<1e-9&&Math.abs(B24.dgHp(140)-10)<1e-9,'배수 표');return r.join(' · ')});
qT('보스 v24','보스방: 모든 지역의 모든 동굴 던전에서 보스방(가장 깊은 방)이 원래 방의 2배 넘게 넓고 · 보스가 그 방 가운데 · 다른 방과 한 칸 넘게 떨어짐 · 걸을 수 있음',()=>{let n=0,mn=9;const bad=[];qPrep('mage',{lvl:60});P.invT=1e9;
  for(const id of Object.keys(REGIONS)){loadRegion(id);for(const c of CAVES.slice()){if(!c.cave||c.cave.trial||c.cave.arena||c.cave.w3k==='trial')continue;if(DG)leaveDungeon();enterDungeon(c);if(!DG||!DG.boss){bad.push(c.cave.n+' 못 들어감');continue}
    const br=DG.rooms.find(r=>r.b24);if(!br){bad.push(c.cave.n+' 넓힌 방 없음');continue}const k=br.w*br.h/br.b24;mn=Math.min(mn,k);if(k<2)bad.push(`${c.cave.n} ×${k.toFixed(2)}`);
    const b=DG.boss,bi=Math.floor((b.x-OX)/TS),bj=Math.floor((b.y-OY)/TS);if(!(bi>=br.i&&bi<br.i+br.w&&bj>=br.j&&bj<br.j+br.h))bad.push(c.cave.n+' 보스가 방 밖');
    for(const o of DG.rooms)if(o!==br&&br.i<=o.i+o.w&&br.i+br.w>=o.i&&br.j<=o.j+o.h&&br.j+br.h>=o.j)bad.push(c.cave.n+' 다른 방과 붙음');
    for(let y=br.j;y<br.j+br.h;y++)for(let x=br.i;x<br.i+br.w;x++)if(!dgFloor(x,y)){bad.push(c.cave.n+' 막힌 칸');y=1e9;break}
    const D=bfs(DG.g,DG.start.cx,DG.start.cy);if(D[tIdx(bi,bj)]<0)bad.push(c.cave.n+' 보스에게 못 감');n++}}
  if(DG)leaveDungeon();loadRegion('home');qOk(!bad.length,bad.slice(0,6).join(' / '));qOk(n>=20,'던전 '+n);return `던전 ${n}곳 · 가장 작은 보스방 ×${mn.toFixed(2)}`});
qT('보스 v24','필드 보스: 생명력 ×(10레벨까지 1.5 · 30레벨 3 · 60레벨 6 · 140레벨 10) · 공격력도 · 30레벨 아래는 3배 안 · 보스 한 대는 최대 생명력 60%까지(한 방에 안 죽음) · 파티 보스 생명력 ×(1+0.7(n−1)) (v24로 맞춘 보스만 · 따로 맞춘 끝 콘텐츠 보스는 예전 ×(1+1.0(n−1)))',()=>{const r=[];
  for(const id of ['plains','lava','abyss']){if(!REGIONS[id])continue;qPrep('mage',{lvl:60});P.invT=1e9;loadRegion(id);if(!REG.lair||!REG.boss)continue;P.x=REG.lair.x+200;P.y=REG.lair.y;REG.bossDead=false;REG.bossE=null;for(let i=0;i<6&&!REG.bossE;i++)qStep(1,{render:false});
    const e=REG.bossE;qOk(e,id+' 우두머리 없음');if(!e)continue;const t=TYPES[e.k],L=e.lvl,hp0=Math.round(t.hp*(1+.34*(L-1))*DIFF[P.diff].hp);qOk(e._b24==='fd'&&Math.abs(e.max/hp0-B24.fdHp(L))<.02,`${id} Lv${L} ×${(e.max/hp0).toFixed(2)} (${e._b24})`);r.push(`${REGIONS[id].n} Lv${L} ×${B24.fdHp(L).toFixed(1)}`)}
  loadRegion('home');qOk(B24.fdHp(29)<3&&B24.fdHp(10)<=1.5&&Math.abs(B24.fdHp(30)-3)<1e-9&&Math.abs(B24.fdHp(140)-10)<1e-9,'배수 표');
  qPrep('warrior',{lvl:60});const b=dgMob('b_baldrak',P.x+60,P.y,60);const h0=P.hp=maxHp();hitPlayer(h0*3,b);qOk(!P.dead&&P.hp>=h0*.4-1,`한 방 ${h0}→${P.hp}`);P.hp=maxHp();hitPlayer(10,b);qOk(P.hp<maxHp(),'작은 피해가 막힘');qClear();
  {const bk=Object.keys(TYPES).find(k=>TYPES[k].boss),pn=PTY.partyN;try{PTY.partyN=()=>2;const a={k:bk,max:1000,hp:1000,_b24:'fd'},b={k:bk,max:1000,hp:1000};PTY.scale(a);PTY.scale(b);
    qOk(a.max===1700&&b.max===2000&&PTY.HP.boss===1&&PTY.HP.mini===1&&PTY.HP.normal===.9,`파티 배수 v24 보스 ${a.max} · 따로 맞춘 보스 ${b.max}`)}finally{PTY.partyN=pn}}return r.join(' · ')+' · 한 방 60%'});
qT('시전 v24','시전 시간 나누기: 새 시전 기술은 0.5~2초 · 위력이 큰 쪽이 더 김 · 단순 투사체 기본기(관통 없음 · 재사용 1.2초 이하)는 즉시 · 직업마다 1차·상위 기술 공격의 25~50%가 시전/채널링 · 새 시전 기술 배율 ×(1+0.15×초) · 즉시 장판 공격 ×0.85',()=>{const bad=[],out=[];
  for(const id in CAST_T_V24){const s=SPELLS[id];if(!s){bad.push(id+' 없음');continue}const ct=CAST_T[id];if(!(ct>=.5&&ct<=2))bad.push(`${id} ${ct}초`);
    const m=CAST24_MULT[id];if(!m||Math.abs(m[1]-Math.round(m[0]*(1+.15*ct)*1000)/1000)>1e-9||s.mult!==m[1])bad.push(id+' 배율 '+(m&&m.join('→')))}
  for(const c of ['mage','priest','warrior','archer']){const at=Object.keys(SPELLS).filter(id=>{const s=SPELLS[id];return s.cls===c&&!s.job2&&!s.job3&&isDmg(s)&&!['summon','orbit','armor','blink'].includes(s.kind)});
    const nc=at.filter(id=>CAST_T[id]||chanOf(id)||SPELLS[id].charge).length,r=nc/at.length;if(!(r>=.25&&r<=.5))bad.push(`${c} ${nc}/${at.length}`);out.push(`${c} ${nc}/${at.length}(${Math.round(r*100)}%)`);
    const basic=at.filter(id=>{const s=SPELLS[id];return s.kind==='bolt'&&!s.pierce&&(s.cd||0)<=1.2});for(const id of basic)if(CAST_T[id])bad.push(id+' 기본 투사체에 시전');
    // 위력이 큰 쪽이 더 김: 새 시전 기술을 v23 배율로 줄 세우면 위 절반의 평균 시전이 아래 절반보다 김
    const nw=Object.keys(CAST_T_V24).filter(id=>SPELLS[id]&&SPELLS[id].cls===c&&CAST24_MULT[id]).sort((a,b)=>CAST24_MULT[a][0]-CAST24_MULT[b][0]);
    if(nw.length>=4){const h=nw.length>>1,av=a=>a.reduce((x,id)=>x+CAST_T[id],0)/a.length;if(!(av(nw.slice(-h))>av(nw.slice(0,h))))bad.push(c+' 센 기술이 더 짧음')}}
  let ng=0;for(const id in SPELLS){const s=SPELLS[id];if(!s.cls||s.job3||!['field','rain','storm'].includes(s.kind)||!isDmg(s)||s.heal||id==='healcircle'||CAST_T[id]||chanOf(id)||s.charge)continue;ng++;
    const m=CAST24_MULT[id];if(!m||Math.abs(m[1]-Math.round(m[0]*.85*1000)/1000)>1e-9||s.mult!==m[1])bad.push(id+' 즉시 장판 배율 '+(m&&m.join('→')))}
  // 실제로: 플레임 랜스는 0.6초 외운 뒤에 나가고 맞음
  const e=qCastPrep('mage','flamelance');tryCast('flamelance',{x:e.x,y:e.y});if(!(CAST.cur&&CAST.cur.id==='flamelance'&&Math.abs(CAST.cur.max-.6)<1e-9))bad.push('플레임 랜스 시전 시작 안 됨');
  qStep(20,{render:false});if(P.cd.flamelance>0)bad.push('0.33초에 벌써 나감');qStep(120,{render:false,until:()=>e.taken>0});if(!(e.taken>0))bad.push('플레임 랜스 안 맞음');castReset();
  qOk(!bad.length,bad.join(', '));return out.join(' · ')+` · 새 시전 ${Object.keys(CAST_T_V24).length}개 · 즉시 장판 약화 ${ng}개`});
qT('재사용 v24','강한 공격 기술 재사용 +20~50%(4초 +20% → 20초 이상 +50%) · 재사용 4초 이하 보통 기술 · 도움 기술 · 소환 · 3차 기술은 그대로',()=>{const bad=[];let n=0;
  for(const id in CD24){const [o,v]=CD24[id],inc=v/o-1;n++;if(!(inc>=.19&&inc<=.51))bad.push(`${id} ${o}→${v}`);if(SPELLS[id].cd!==v)bad.push(id+' 값');if(!isDmg(SPELLS[id]))bad.push(id+' 피해 없음');
    const exp=Math.min(.5,.2+.3*(o-4)/16);if(Math.abs(v-Math.round(o*(1+exp)*10)/10)>1e-9)bad.push(`${id} 늘림 ${qR(inc)}≠${qR(exp)}`)}
  for(const id of ['spark','smite','quickshot','slash','flameshaping','turnundead','divinestorm','firebolt','fireburst'])if(SPELLS[id]&&CD24[id])bad.push(id+' 기본기가 늘어남');
  for(const id of ['meteor','sunfall','godspear','heavenpiercer','apexhunt','testament'])if(SPELLS[id]&&!CD24[id])bad.push(id+' 강한 기술이 그대로');for(const id in CD24)if(SPELLS[id].job3)bad.push(id+' 3차가 늘어남');
  if(SPELLS.sunfall&&CD24.sunfall&&!(CD24.sunfall[1]/CD24.sunfall[0]>CD24.meteor[1]/CD24.meteor[0]))bad.push('긴 기술이 덜 늘어남');
  for(const id of ['healcircle','grandtaunt','hold'])if(CD24[id])bad.push(id+' 도움 기술이 늘어남');
  qPrep('mage',{lvl:60});P.sk.meteor=1;qOk(Math.abs(cdOf('meteor')-CD24.meteor[1]*cdOf('meteor')/SPELLS.meteor.cd)<1e-9&&SPELLS.meteor.cd===CD24.meteor[1],'메테오 재사용 '+cdOf('meteor'));
  qOk(!bad.length,bad.join(', '));return `${n}개 · 메테오 ${CD24.meteor.join('→')}초 · 선 폴 ${CD24.sunfall.join('→')}초`});
qT('마을 v24','마을 안(안전 구역 · 건물 안)에서는 공격 기술이 안 나감(알림) · 치유 · 강화 · 순간이동은 됨 · 마을 밖과 던전은 그대로 · 전사 · 궁수 기본 공격도 막힘',()=>{const bad=[];
  const tryAt=(cls,id,x,y)=>{qPrep(cls,{lvl:60});P.sk[id]=10;qMana(id);P.mp=maxMp();P.cd={};qRecWait();castReset();P.x=x;P.y=y;followCam();if(typeof clsGearFor==='function'&&SPELLS[id].wt)clsGearFor(id);
    const nb=bolts.length,nf=fields.length,nr=rains.length,np=pend.length,lg=logEl.lastElementChild&&logEl.lastElementChild.textContent;tryCast(id,{x:x+200,y:y});
    const went=(P.cd[id]||0)>0||!!CAST.cur||!!CAST.ch||bolts.length>nb||fields.length>nf||rains.length>nr||pend.length>np;castReset();qRecWait();return{went,lg2:logEl.lastElementChild&&logEl.lastElementChild.textContent,lg}};
  const T=TOWNS[0],inT={x:T.x,y:T.y},out={x:QA_SPOT.x,y:QA_SPOT.y};qOk(inSafe(inT.x,inT.y,0)&&!inSafe(out.x,out.y,0),'자리');
  for(const [c,id] of [['mage','spark'],['mage','meteor'],['mage','firewall'],['priest','smite'],['warrior','slash'],['archer','quickshot'],['archer','firetrap'],['mage','hydra']]){if(!SPELLS[id])continue;
    SAFE24.msgT=-99;const a=tryAt(c,id,inT.x,inT.y);if(a.went)bad.push(id+' 마을 안에서 나감');if(!/마을 안에서는 공격 기술/.test(a.lg2||''))bad.push(id+' 알림 없음');
    const b=tryAt(c,id,out.x,out.y);if(!b.went)bad.push(id+' 마을 밖에서 안 나감')}
  for(const [c,id] of [['priest','minorheal'],['priest','blessing'],['mage','blink'],['mage','shieldcircle']]){if(!SPELLS[id])continue;const a=tryAt(c,id,inT.x,inT.y);if(!a.went)bad.push(id+' 마을 안에서 안 됨')}
  qOk(!bad.length,bad.join(', '));return '공격 8가지 막힘 · 치유 · 강화 · 순간이동 · 보호막 됨'});
qT('드랍 v24','장비 드롭 1/5: 일반 몬스터 10%→2% · 정예 1.5개→0.3개 · 던전 보스는 보장 2개 그대로(덤만 1/5) · 파티 보너스 그대로 · 아이템 하나의 등급 확률 그대로',()=>{qPrep('mage',{lvl:50});const jk=junkKeep;junkKeep=it=>!!it;let a=0,b=0,bo=[];
  try{QA.reseed(2424);const N=20000;for(let i=0;i<N;i++){loot.length=0;const e=qDummy(P.x+100,P.y);e.lvl=50;e.elite=false;rewardKill(e);a+=loot.filter(l=>l.kind==='item').length}
    const M=4000;for(let i=0;i<M;i++){loot.length=0;const e=qDummy(P.x+100,P.y);e.lvl=50;e.elite=true;rewardKill(e);b+=loot.filter(l=>l.kind==='item').length}
    const D0=DG;DG={d:{id:'qa_none',n:'Q'},portals:[],ci:-5};try{const bk=Object.keys(TYPES).find(k=>TYPES[k].boss&&!TYPES[k].mini);for(let i=0;i<600;i++){loot=[];dgBossDrop({k:bk,x:P.x,y:P.y,lvl:50,r:30});bo.push(loot.filter(l=>l.kind==='item').length)}}finally{DG=D0}
    loot.length=0;qClear();qOk(Math.abs(a/N-.02)<.004,`일반 ${qR(a/N*100)}%`);qOk(Math.abs(b/M-.3)<.04,`정예 ${qR(b/M)}개`);
    qOk(bo.every(n=>n>=2),'보스 보장 2개가 빠짐');const ex=bo.reduce((x,n)=>x+n-2,0)/bo.length;qOk(ex<.3,`보스 덤 ${qR(ex)}개`)}finally{junkKeep=jk;loot=[]}
  return `일반 ${qR(a/20000*100)}% · 정예 ${qR(b/4000)}개 · 보스 ${qR(bo.reduce((x,n)=>x+n,0)/bo.length)}개`});
qT('스킬 창 v24','아래 단축칸(화면 아래)에 마우스를 올려도 스킬 트리와 같은 설명 상자 · 빈 칸이면 안 뜸 · 다시 그려도 같은 칸에 붙음 · 휴대폰 손가락은 안 띄움(바로 시전)',()=>{qPrep('mage',{lvl:30});P.sk.firebolt=3;P.bar=Array(21).fill(null);P.bar[2]='firebolt';buildBar();
  const tip=()=>document.getElementById('sktip'),over=(el,pt)=>el.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:pt||'mouse'}));
  const b=document.querySelector('#bar button[data-slot="2"]');over(b);qOk(tip()&&!tip().hidden&&tip().textContent.includes(SPELLS.firebolt.n)&&/스킬 레벨 3/.test(tip().textContent),'안 뜸');
  const html=window.__sk23.sk23TipHtml('firebolt');qOk(tip().innerHTML===html,'트리 설명과 다름');const r=tip().getBoundingClientRect();qOk(r.top>=0&&r.bottom<=innerHeight+1&&r.right<=innerWidth+1,'화면 밖');
  buildBar();qOk(!tip().hidden&&window.__sk23.SK23.cur&&window.__sk23.SK23.cur.isConnected,'다시 그리면 사라짐');
  over(document.querySelector('#bar button[data-slot="7"]'));qOk(tip().hidden,'빈 칸인데 뜸');over(document.body);sk23Hide();
  over(b,'touch');qOk(tip().hidden,'손가락에 뜸');P.bar=Array(21).fill(null);buildBar()});
qT('이동 속도 v24','새 장비에 「이동 속도 %」 옵션이 가끔(마법 · 희귀 · 세트) · 마법 · 희귀 값 2~6%(두 번 뽑혀도 그 레벨 최대값까지) · 네 직업 모두 · 강화+장비 합계 최대 +50%',()=>{const out=[],bad=[];
  for(const c of ['mage','priest','warrior','archer']){qPrep(c,{lvl:60});QA.reseed(2400+c.length);let n=0,got=0,lo=99,hi=0;
    for(let i=0;i<4000;i++){const it=makeItem(i%2?30:100,i%3===0);if(it.rar<1||it.rar>2)continue;n++;const v=it.stats.ms;if(v){got++;lo=Math.min(lo,v);hi=Math.max(hi,v)}}
    const pr=got/n;if(!(pr>.05&&pr<.4))bad.push(`${c} ${qR(pr*100)}%`);if(got&&!(lo>=2&&hi<=6))bad.push(`${c} 값 ${lo}~${hi}`);out.push(`${c} ${Math.round(pr*100)}% (${lo}~${hi}%)`)}
  qPrep('mage',{lvl:60});const g0=P.gear.amulet;try{P.gear.amulet={id:9e6,slot:'amulet',rar:2,name:'qa',il:60,stats:{ms:5,regen:1},cls:'mage'};qOk(Math.abs(spdMul()-1.05)<1e-9,'장비 5% → '+spdMul());
    P.gear.amulet={...P.gear.amulet,id:9e6+1,stats:{ms:40}};P.buffs={qa:{t:99,spd:.6}};qOk(Math.abs(spdMul()-1.5)<1e-9,'상한 '+spdMul())}finally{P.gear.amulet=g0;P.buffs={}}
  qOk(STATN.ms&&/이동/.test(STATN.ms),'이름');qOk(!bad.length,bad.join(', '));return out.join(' · ')});
qT('퀘스트 몹 v24','하고 있는 의뢰의 처치 · 모으기 대상이 지금 지역 몬스터면 새로 생기는 몬스터의 40% 넘게가 그 몬스터(황금 평원 폭풍 정령 · 입구 근처에서도) · 의뢰가 없거나 다 채우면 예전대로',()=>{qPrep('mage',{lvl:35});qWxTo('plains');
  const T=TOWNS[0],run=N=>{const c={};for(let i=0;i<N;i++){enemies.length=0;P.x=T.x+700;P.y=T.y;spawnEnemy();const e=enemies[0];if(e)c[e.k]=(c[e.k]||0)+1}enemies.length=0;return c};
  const s=sqState(),had=s.a.ctm5;QA.reseed(2433);const c0=run(600);let c1,c2;
  try{s.a.ctm5={c:{},got:[]};qOk(q24Targets().has('p_storm'),'대상 목록');QA.reseed(2433);c1=run(600);s.a.ctm5={c:{g0:99},got:[]};QA.reseed(2433);c2=run(600)}finally{if(had)s.a.ctm5=had;else delete s.a.ctm5}
  const n=c=>Object.values(c).reduce((a,b)=>a+b,0),r=c=>(c.p_storm||0)/Math.max(1,n(c));
  qOk(n(c1)>300,'생김 '+n(c1));qOk(r(c1)>=.4,`의뢰 중 폭풍 정령 ${qR(r(c1)*100)}%`);qOk(r(c1)>r(c0)+.25,'늘지 않음');qOk(Math.abs(r(c2)-r(c0))<.05,`다 채운 뒤 ${qR(r(c2)*100)}% vs ${qR(r(c0)*100)}%`);
  const st=enemies.length;qOk(st===0,'정리');loadRegion('home');return `폭풍 정령: 의뢰 없을 때 ${Math.round(r(c0)*100)}% → 의뢰 중 ${Math.round(r(c1)*100)}%`});
qT('설정 v24','위 단추 줄: 스킬 트리 · 캐릭터 · 지도는 그대로, 「설정 ⚙」 하나 안에 그래픽 품질 · 프레임 상한 · 화면 · 소리 · 패치노트 (예전 단추는 줄에서 숨김 · 목록에서 열림) · 품질 낮음=효과 단계 0 · 화소 비율 1 · 보통은 1까지 · 30프레임에서 일부러 쉰 시간은 느림으로 안 침 · arseia-gfx 한 키에만',()=>{qPrep('mage');const bad=[],g0={...GFX},l0=Q.lvl;
  try{const vis=id=>{const e=document.getElementById(id);return !!(e&&getComputedStyle(e).display!=='none')};
    for(const id of ['treeBtn','charBtn','mapBtn','setBtn'])if(!vis(id))bad.push(id+' 안 보임');for(const id of ['gfxBtn','auBtn','patchBtn'])if(vis(id))bad.push(id+' 줄에 남음');
    $('#setBtn').click();const el=$('#set24');if(!el||el.hidden)bad.push('목록이 안 열림');else{for(const k of ['auto','high','mid','low'])if(!el.querySelector(`[data-s24q="${k}"]`))bad.push('품질 '+k);for(const k of ['30','60'])if(!el.querySelector(`[data-s24f="${k}"]`))bad.push('프레임 '+k);
      const r=el.getBoundingClientRect();if(r.left<0||r.right>innerWidth+1||r.bottom>innerHeight+1)bad.push('화면 밖')}
    el.querySelector('[data-s24go="auBtn"]').click();if(!el.hidden||!$('#auPanel')||$('#auPanel').hidden)bad.push('소리 창');$('#auPanel').hidden=true;
    $('#setBtn').click();el.querySelector('[data-s24go="gfxBtn"]').click();if(!$('#gfxPanel')||$('#gfxPanel').hidden)bad.push('화면 창');else $('#gfxPanel').hidden=true;
    $('#setBtn').click();el.querySelector('[data-s24q="low"]').click();if(GFX.q!=='low'||Q.lvl!==0||gfxDprCap()!==1)bad.push(`낮음 ${GFX.q} ${Q.lvl} ${gfxDprCap()}`);for(let i=0;i<600;i++)Q.tick(8);if(Q.lvl!==0)bad.push('낮음인데 올라감');
    {const gs=localStorage.getItem('arseia-gfx')||'';if(!/"q":"low"/.test(gs))bad.push('저장 '+gs)}
    el.querySelector('[data-s24q="mid"]').click();for(let i=0;i<1200;i++)Q.tick(8);if(Q.lvl!==1||gfxDprCap()!==1.25)bad.push(`보통 ${Q.lvl}`);
    el.querySelector('[data-s24q="auto"]').click();el.querySelector('[data-s24f="30"]').click();if(GFX.fps!==30||frameCapMs()<33)bad.push('프레임');Q.lvl=2;Q.ema=16.7;for(let i=0;i<300;i++)Q.tick(qTickMs(33.4));if(Q.lvl!==2)bad.push('30프레임을 느림으로 침 '+Q.lvl);
    document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));if(!el.hidden)bad.push('바깥을 눌러도 안 닫힘')}
  finally{Object.assign(GFX,g0);gfxSave();Q.lvl=l0;Q.apply();resize();set24Open(false)}
  qOk(!bad.length,bad.join(', '));return '설정 목록 · 품질 4단계 · 프레임 60/30'});
qT('소리 v24','연달아 쓴 마법 효과음이 안 씹힘: 체인 라이트닝 → 스파크 체인을 몬스터 무리 속(맞는 소리 · 쓰러지는 소리 가득)에서 0.1초 간격으로 10번 번갈아 써도 시전 소리가 모두 남 · 많이 겹치는 소리는 20개까지 · 끝난 소리는 수에서 빠짐(onended를 못 받아도)',()=>{
  const k0={on:AU.on,ctx:AU.ctx,ends:AU.ends.slice(),last:new Map(AU.last)};const bad=[];let cast=0,want=0,low=0;
  try{const C={state:'running',currentTime:100};AU.ctx=C;AU.on=true;AU.ends.length=0;AU.last.clear();
    for(let i=0;i<20;i++){C.currentTime=100+i*.1;
      for(let h=0;h<12;h++){const k=['hitstorm','hitfire','die','thud','gold'][h%5];AU.last.delete(k);if(auGo(k,.045)){low++;AU.ends.push(C.currentTime+.6)}}// 무리 속: 맞는 소리 · 쓰러짐이 계속 쌓임
      const id=i%2?'static':'chainlightning';want++;if(auGo('cast'+id,.06)){cast++;for(let n=0;n<6;n++)AU.ends.push(C.currentTime+.5)}else bad.push(`${i}번째 ${id} 씹힘(울리는 소리 ${auBusy(C.currentTime)})`)}
    if(!(auBusy(C.currentTime)<=60))bad.push('너무 많이 겹침 '+auBusy(C.currentTime));
    // 끝난 소리는 수에서 빠짐: 1초 뒤에는 모두 끝남
    C.currentTime+=5;if(auBusy(C.currentTime)!==0)bad.push('끝난 소리가 남음 '+auBusy(C.currentTime));
    // 같은 마법을 같은 순간 두 번은 한 번만(겹침 방지 그대로)
    AU.last.clear();if(!auGo('castspark',.06)||auGo('castspark',.06))bad.push('같은 순간 같은 소리');
    if(!SPELLS.chainlightning||!SPELLS.static)bad.push('체인 라이트닝 · 스파크 체인 없음')}
  finally{AU.on=k0.on;AU.ctx=k0.ctx;AU.ends.length=0;AU.ends.push(...k0.ends);AU.last=k0.last}
  qOk(!bad.length,bad.slice(0,5).join(', '));return `시전 소리 ${cast}/${want} · 많이 겹치는 소리 ${low}개 울림(나머지는 묶임)`});
qT('경험치 v24','의뢰 보상 경험치: 적정 레벨 50 이상인 모든 의뢰(주 의뢰 · 마을 의뢰 · 시험 · 3막 덤 포함)는 그 레벨 필요 경험치의 10% 미만 · 49레벨 이하는 예전 그대로 · 예: 60레벨 의뢰가 예전 약 70% → 10% 미만',()=>{const bad=[];let n=0,worst=0,wq='';
  for(const q of QUESTS){if(!q.rw||!q.lvl)continue;const f=qXp(q)/xpNeed(q.lvl);if(q.lvl>=50){n++;if(!(f<.1))bad.push(`주 의뢰 ${q.t} ${qR(f*100)}%`);if(f>worst){worst=f;wq=q.t}}else if(qXp(q)!==Math.round(xpNeed(q.lvl)*.45*q.rw.xp))bad.push('49 이하 바뀜 '+q.t)}
  for(const q of SQ){if(!q.rw||!q.lvl)continue;const f=sqXp(q)*(q.a3?1.5:1)/xpNeed(q.lvl);if(q.lvl>=50){n++;if(!(f<.1))bad.push(`${q.t} ${qR(f*100)}%`);if(f>worst){worst=f;wq=q.t}}else if(sqXp(q)!==Math.round(xpNeed(q.lvl)*.3*q.rw.xp))bad.push('49 이하 바뀜 '+q.t)}
  // 실제로 받기: 60레벨 마을 의뢰 하나를 마치면 막대가 10% 미만 오름
  const q=SQ.find(q=>q.lvl>=58&&q.lvl<=62&&q.rw&&!q.a3&&!q.cls);qPrep('mage',{lvl:q.lvl});P.xp=0;const s=sqState();s.a[q.id]={c:{},got:[]};q.goals.forEach((g,j)=>{s.a[q.id].c['g'+j]=99;if(g.type==='talk'||g.type==='reach')s.a[q.id].c['g'+j]=1});
  const ok=typeof sqAllDone==='function'?sqAllDone(q):true;if(ok){sqFinish(q.id);const f=P.xp/xpNeed(q.lvl);if(!(P.lvl===q.lvl&&f>0&&f<.1))bad.push(`받기 ${q.t}: Lv${P.lvl} ${qR(f*100)}%`)}
  qOk(n>20,'50 이상 의뢰 '+n);qOk(!bad.length,bad.slice(0,6).join(', '));return `50 이상 ${n}개 · 가장 큰 「${wq}」 ${qR(worst*100)}%`});
/* ===== v24 밀림(「게임 최적화 방안」 스레드): 느린 프레임에서도 게임 시간이 실제 시간만큼 흐른다 (예전에는 한 프레임 0.05초까지만 → 슬로 모션) · 프레임 상한 ===== */
qT('성능','v24 느린 프레임(0.2초)에도 게임 시간이 0.2초 흐름 · 0.05초 조각 4번 · 0.25초 넘는 멈춤은 잘라 냄 · 절전 30fps 상한 · 낮음은 빛과 안개 끔',()=>{qPrep('mage');const pv=paused;paused=false;
  try{const t0=time,n=stepSim(.2),d1=time-t0;qOk(Math.abs(d1-.2)<1e-6,`0.2초 프레임에 게임 시간 ${d1.toFixed(3)}초`);qOk(n===4,`update ${n}번 (4번이어야)`);
    const t1=time,n2=stepSim(.016);qOk(n2===1&&Math.abs(time-t1-.016)<1e-6,'보통 프레임은 update 한 번');
    const f0=GFX.fps;GFX.fps=30;const c30=frameCapMs();GFX.fps=0;const c0=frameCapMs();GFX.fps=f0;qOk(c30>33&&c0<17,`상한 ${c30}/${c0}ms`);
    {const q0=GFX.q,f0=GFX.fog;try{GFX.fog=true;GFX.q='low';const lo=fogOn();GFX.q='auto';const au=fogOn();qOk(!lo&&au,`빛과 안개 낮음 ${lo} · 자동 ${au}`)}finally{GFX.q=q0;GFX.fog=f0}}
    return `0.2초 → ${d1.toFixed(3)}초 · update ${n}번 · 상한 60/30`}finally{paused=pv;qClear()}});
/* ===== v24 스킬 설명 점검 (사용자 06:47 「패시브에 재사용이 붙어 있음 · 앰플리파이드 그레이스는 레벨마다 얼마나 오르는지 안 나옴」) ===== */
qT('스킬 설명 v24','4직업 모든 스킬의 스킬 창 설명 · 설명 상자: 패시브에는 재사용 · 마나가 없음 · 패시브 값마다 이름 · 단위가 있는 줄(영어 이름 없음)이고 지금 값이 실제 값과 같음 · 「레벨마다(3차는 1점마다)」 줄이 실제로 오르는 양과 같음 · 다른 스킬은 재사용 · 시전 시간이 이번 판 실제 값과 같음',()=>{
  const bad=[],num=t=>{const m=String(t).match(/-?[\d.]+/);return m?+m[0]:NaN},near=(a,b)=>Math.abs(a-b)<=(Math.abs(b)<1?.006:.051)/* 화면은 1보다 작으면 소수 두 자리, 그 밖은 한 자리 */;let np=0,na=0;
  const val=(k,v)=>TIP24.FLAT[k]?v:(k==='j3castCut'?-v*100:v*100);
  for(const cls of ['mage','priest','warrior','archer']){qPrep(cls,{lvl:140});
    for(const id in SPELLS){const s=SPELLS[id];if(s.cls!==cls||s.hidden)continue;const L=s.job3?6:5;P.sk[id]=L;nodeSel=id;
      const dh=detailHtml(id),tip=sk23TipHtml(id),sub=(dh.match(/<div class="sub">([\s\S]*?)<\/div>/)||[])[1]||'',tsub=(tip.match(/<div class="st-s">([\s\S]*?)<\/div>/)||[])[1]||'',rows=numsAt(id,skLv(id)),tag=`${s.n}(${id})`;
      if(s.kind==='passive'){np++;if(/재사용/.test(sub)||/재사용/.test(tsub))bad.push(tag+' 재사용 표시');if(rows.some(r=>r[0]==='마나'))bad.push(tag+' 마나 줄');
        const e=eff(id,skLv(id));for(const k in s.pv||{}){const r=rows.find(r=>r[0]===tip24Row(cls,k,e[k])[0]);if(!r||r[0]===k){bad.push(`${tag} ${k} 줄 없음`);continue}if(!near(num(r[1]),val(k,e[k])))bad.push(`${tag} ${k} ${r[1]}≠${val(k,e[k])}`)}
        const e2=eff(id,skLv(id)+tip24Step(id)),steps=Object.keys(s.pv||{}).filter(k=>e2[k]-e[k]>1e-9),pr=rows.find(r=>r[0]==='레벨마다'||r[0]==='1점마다');
        if(steps.length&&!pr)bad.push(tag+' 레벨마다 줄 없음');else if(steps.length===1&&!near(num(pr[1]),val(steps[0],e2[steps[0]]-e[steps[0]])))bad.push(`${tag} 레벨마다 ${pr[1]}`);
        if(id==='graceamp'&&!(pr&&/0\.6%/.test(pr[1])))bad.push('앰플리파이드 그레이스 레벨마다 '+(pr&&pr[1]));}
      else{na++;const cd=Math.round(cdOf(id)*100)/100,m=sub.match(/재사용 ([\d.]+)초/),m2=tsub.match(/재사용 ([\d.]+)초/);if(!m||+m[1]!==cd||!m2||+m2[1]!==cd)bad.push(`${tag} 재사용 ${m&&m[1]}/${m2&&m2[1]}≠${cd}`);
        const ct=typeof castTimeOf==='function'?castTimeOf(id):0;if(ct>0&&!s.charge&&(!sub.includes(`시전 ${ct}초`)||!tsub.includes(`시전 ${ct}초`)))bad.push(`${tag} 시전 ${ct}초 안 보임`)}}}
  qOk(np>=40&&na>200,`패시브 ${np} · 그 밖 ${na}`);qOk(!bad.length,bad.slice(0,12).join(' / ')+(bad.length>12?` 외 ${bad.length-12}개`:''));return `패시브 ${np}개 · 그 밖 ${na}개 모두 맞음`});
/* ===== v25 방어 기술 설명 (사용자 08:53 「갑옷류 스킬의 흡수 · 감소 수치가 툴팁에 제대로 안 나온 것」) · 탭 차수 ===== */
qT('스킬 설명 v25','4직업 방어 기술(갑옷 · 보호막 · 무적 · 가호 · 받는 피해 강화)을 실제로 써 보고, 스킬 창 설명의 받는 피해 감소 · 흡수량 · 지속 · 되살아날 때 생명력 · 반격 피해가 실제 걸린 값과 같음 · 받는 피해가 느는 강화는 「증가」로',()=>{
  const bad=[],num=t=>{const m=String(t).match(/-?[\d.]+/);return m?+m[0]:NaN},row=(rows,k)=>{const r=rows.find(r=>r[0]===k);return r?r[1]:null};let n=0;
  const close=(a,b,tol)=>Math.abs(a-b)<=(tol||Math.max(.06,Math.abs(b)*.02));
  for(const cls of ['mage','priest','warrior','archer'])for(const id in SPELLS){const s=SPELLS[id];if(s.cls!==cls||s.hidden||!['armor','shield','invuln','ward','buff'].includes(s.kind))continue;
    if(s.kind==='buff'&&!s.dr)continue;qPrep(cls,{lvl:140});if(s.job3)qJob3On(Object.keys(JOB3[cls]).find(b=>b===s.job3)||s.job3);else if(s.job2)P.job2=s.job2;passT=-1;
    if(typeof clsGearFor==='function')clsGearFor(id);P.sk[id]=s.job3?6:5;const rows=numsAt(id,skLv(id)),tag=`${s.n}(${id})`;nodeSel=id;const tip=sk23TipHtml(id);
    P.shield=0;P.shieldT=0;P.ward=null;P.armor=null;P.invT=0;P.buffs={};for(const k in P.cd)P.cd[k]=0;qCast(id,{x:P.x+40,y:P.y});n++;
    if(s.kind==='armor'){const a=P.armor;if(!a){bad.push(tag+' 안 걸림');continue}
      const r=row(rows,'받는 피해 감소');if(!r||!close(num(r)/100,a.red,.002))bad.push(`${tag} 감소 ${r}≠${a.red}`);
      const h=row(rows,'나를 때린 적에게 (맞을 때마다)');if(!h||!close(num(h),a.dmg*.6,Math.max(2,a.dmg*.6*.03)))bad.push(`${tag} 반격 ${h}≠${Math.round(a.dmg*.6)}`);
      if(row(rows,'피해'))bad.push(tag+' 「피해」 줄이 남음');const d=row(rows,'지속');if(!d||!close(num(d),a.max,.3))bad.push(`${tag} 지속 ${d}≠${a.max}`);
      if(!/받는 피해 감소/.test(tip))bad.push(tag+' 설명 상자에 감소 없음')}
    else if(s.kind==='shield'){if(!(P.shield>0)){bad.push(tag+' 안 걸림');continue}
      const r=row(rows,'흡수');if(!r||!close(num(r),P.shield,2))bad.push(`${tag} 흡수 ${r}≠${P.shield}`);const d=row(rows,'지속');if(!d||!close(num(d),P.shieldT,.3))bad.push(`${tag} 지속 ${d}≠${P.shieldT}`);
      if(!/흡수/.test(tip)||!/지속/.test(tip))bad.push(tag+' 설명 상자에 흡수 · 지속 없음')}
    else if(s.kind==='invuln'){if(!(P.invT>0)){bad.push(tag+' 안 걸림');continue}const d=row(rows,'지속');if(!d||!close(num(d),P.invT,.3))bad.push(`${tag} 지속 ${d}≠${P.invT}`);
      if(row(rows,'받는 피해')!=='없음 (무적)')bad.push(tag+' 무적 줄 없음');if(s.heal&&!row(rows,'생명력 회복'))bad.push(tag+' 회복 줄 없음')}
    else if(s.kind==='ward'){if(!P.ward){bad.push(tag+' 안 걸림');continue}const r=row(rows,'되살아날 때 생명력');if(!r||!close(num(r)/100,P.ward.heal,.006))bad.push(`${tag} 생명력 ${r}≠${P.ward.heal}`);
      const d=row(rows,'지속');if(!d||!close(num(d),P.ward.t,.3))bad.push(`${tag} 지속 ${d}≠${P.ward.t}`)}
    else{const b=P.buffs[id];if(!b){bad.push(tag+' 안 걸림');continue}const k=b.dr<0?'받는 피해 증가':'받는 피해 감소',r=row(rows,k);
      if(!r||!close(Math.abs(num(r))/100,Math.abs(b.dr),.006))bad.push(`${tag} ${k} ${r}≠${b.dr}`);if(b.dr<0&&row(rows,'받는 피해 감소'))bad.push(tag+' 증가인데 감소로 보임');
      if(s.ls&&!row(rows,'준 피해의 생명력 흡수'))bad.push(tag+' 흡수 줄 없음')}}
  qClear();qOk(n>=36,`방어 기술 ${n}개`);qOk(!bad.length,bad.slice(0,12).join(' / ')+(bad.length>12?` 외 ${bad.length-12}개`:''));return `방어 기술 ${n}개 모두 맞음`});
qT('스킬 창 v25','스킬 창 탭 이름에 차수: 상위 기술 · 2차 갈래 탭은 [2차], 3차 갈래 탭은 [3차] (4직업 · 2차 전 · 3차 뒤) · 1차 갈래 탭은 그대로',()=>{const bad=[];
  try{for(const cls of ['mage','priest','warrior','archer']){for(const st of [0,2,3]){qPrep(cls,{lvl:st===3?120:st===2?60:40});if(st===2)P.job2=Object.keys(JOB2[cls])[0];if(st===3)qJob3On(Object.keys(JOB3[cls])[0]);passT=-1;
      openPanel('tree');renderPanel();const tabs=[...pbody.querySelectorAll('button[data-j2tab]')].map(b=>[b.dataset.j2tab,b.textContent]);
      const adv=tabs.find(t=>t[0]==='adv');if(!adv||!/\[2차\]/.test(adv[1]))bad.push(`${cls}/${st} 상위 기술 ${adv&&adv[1]}`);
      if(st>=2){const j2=tabs.find(t=>t[0]==='j2');if(!j2||!/\[2차\]/.test(j2[1]))bad.push(`${cls}/${st} 2차 ${j2&&j2[1]}`)}
      if(st===3){const j3=tabs.find(t=>t[0]==='j3');if(!j3||!/\[3차\]/.test(j3[1]))bad.push(`${cls} 3차 ${j3&&j3[1]}`)}
      if([...pbody.querySelectorAll('button[data-tree]')].some(b=>/\[\d차\]/.test(b.textContent)))bad.push(cls+' 1차 탭에 차수');
      renderPanel();if(pbody.querySelectorAll('button[data-j2tab] .tier25').length!==tabs.filter(t=>t[0]!=='j3'||st===3).length)bad.push(cls+' 다시 그리면 겹침');closePanel()}}}
  finally{closePanel()}qOk(!bad.length,bad.join(' / '));return '4직업 × 2차 전 · 2차 · 3차'});
/* ===== v25 물약 (사용자 09:05 「단계는 그대로, 단계 사이 회복량 차이를 크게」) ===== */
qT('물약 v25','물약 단계 수는 5개 그대로 · 단계마다 최대 생명력/마나 비례 몫이 커짐(3·5·8·15·30%) · 높은 레벨에서 위 단계일수록 차이가 커짐(최상급 ≥ 고급×1.6) · 140레벨 최상급은 기본 최대 생명력의 40% 넘게 · 작은 · 보통은 낮은 레벨에서 예전과 거의 같음 · 가방 속 물약(등급 번호)이 새 양으로 마셔짐',()=>{const bad=[];
  qOk(POT_T.length===5,'단계 수 '+POT_T.length);const pc=POT_T.map(p=>p.pct);for(let T=1;T<5;T++)if(!(pc[T]>pc[T-1]))bad.push('비례 몫 순서 '+pc.join(','));
  for(const cls of ['mage','priest','warrior','archer']){qPrep(cls,{lvl:140});const a=POT_T.map((p,T)=>potAmt('hp',T)),b=POT_T.map((p,T)=>potAmt('mp',T));
    if(!(a[4]>=maxHp()*.4))bad.push(`${cls} 140 최상급 ${a[4]}/${maxHp()}`);if(!(a[4]>=a[3]*1.6&&a[3]>=a[2]*1.4))bad.push(`${cls} 140 차이 ${a.join('/')}`);if(!(b[4]>=b[3]*1.4))bad.push(`${cls} 140 마나 ${b.join('/')}`);
    qPrep(cls,{lvl:5});const old=(k,T)=>Math.round(POT_T[T][k]+(k==='hp'?maxHp():maxMp())*.03);for(const T of [0,1])for(const k of ['hp','mp'])if(Math.abs(potAmt(k,T)-old(k,T))>Math.max(6,old(k,T)*.06))bad.push(`${cls} 5레벨 ${k} ${T}단계 ${potAmt(k,T)}≠예전 ${old(k,T)}`)}
  qPrep('warrior',{lvl:100});P.pot={hp:0,mp:0,ht:[0,0,0,0,2],mt:[0,0,0,0,1]};P.potCd=0;P.potCdM=0;P.hp=1;const want=potAmt('hp',4);qOk(drinkPotion('hp'),'최상급을 못 마심');
  qOk(Math.abs(P.potHot.hp.rate*POT_DUR-want)<1,'새 양으로 안 마셔짐 '+P.potHot.hp.rate*POT_DUR+'≠'+want);qOk(potN('hp',4)===1,'개수');
  qOk(!bad.length,bad.join(' / '));qPrep('mage',{lvl:140});return '140레벨 마법사 생명력 물약 '+POT_T.map((p,T)=>potAmt('hp',T)).join(' · ')+` (최대 ${maxHp()})`});
/* ===== v25 마우스 휠 단축키 (사용자 09:08) ===== */
qT('단축키 v25','단축키 창에서 칸을 고르고 휠을 굴리면 그 칸이 「휠 ↑/↓」 · 게임 화면에서 휠 한 칸 = 한 번 시전 · 잘게 오는 휠은 모아서 한 칸 · 창이 열려 있으면 시전 안 함 · 휠에 넣은 것이 없으면 휠을 막지 않음 · 저장 keys에 남고 다시 읽힘',()=>{qPrep('mage');const bad=[];
  const W=(dy,o)=>{const ev=new WheelEvent('wheel',Object.assign({deltaY:dy,deltaMode:0,bubbles:true,cancelable:true},o||{}));cv.dispatchEvent(ev);return ev};
  try{P.sk.spark=1;P.bar[2]='spark';buildBar();kbReset();
    let ev=W(-120);if(ev.defaultPrevented)bad.push('넣은 것 없는데 휠을 막음');
    kbOpen();KB.cap='s2';const we=new WheelEvent('wheel',{deltaY:-120,bubbles:true,cancelable:true});window.dispatchEvent(we);
    if(KB.bind.s2!=='WheelUp')bad.push('잡기 '+KB.bind.s2);if(!/휠 ↑/.test(SLOTS[2].k))bad.push('칸 글자 '+SLOTS[2].k);
    KB.cap='s3';window.dispatchEvent(new WheelEvent('wheel',{deltaY:100,shiftKey:true,bubbles:true,cancelable:true}));if(KB.bind.s3!=='S+WheelDown')bad.push('Shift 잡기 '+KB.bind.s3);kbClose();
    const cast=()=>{const m=P.mp;P.cd={};WHEEL25.last=0;return ()=>P.mp<m};
    let c=cast();ev=W(-120);if(!c())bad.push('휠 위로 시전 안 됨');if(!ev.defaultPrevented)bad.push('넣었는데 페이지가 스크롤됨');
    c=cast();W(-15);W(-15);const mid=c();W(-15);if(mid||!c())bad.push(`잘게 오는 휠: 중간 ${mid} · 끝 ${c()}`);
    c=cast();P.cd={};W(-120);const t2=c();P.cd={};P.mp=maxMp();const m2=P.mp;W(-120);if(P.mp<m2)bad.push('0.12초 안에 두 번');
    c=cast();openPanel('tree');W(-120);if(c())bad.push('창이 열렸는데 시전');closePanel();
    c=cast();W(120);if(c())bad.push('Shift 없이 휠 아래로 시전됨(넣지 않음)');
    const d=saveData();if(!d.keys||d.keys.s2!=='WheelUp'||d.keys.s3!=='S+WheelDown')bad.push('저장 '+JSON.stringify(d.keys));const k=kbClean(d.keys);if(k.s2!=='WheelUp'||k.s3!=='S+WheelDown')bad.push('읽기 '+JSON.stringify(k))}
  finally{kbClose();kbReset();qClear()}
  qOk(!bad.length,bad.join(' / '));return '휠 ↑ · ⇧휠 ↓ 잡기 · 시전 · 모으기 · 창 · 저장'});
qT('아이템','v25 바닥 물건: 90초 뒤 사라지고 마지막 5초 깜빡임 · 가방이 차서 놓인 보상은 남음',()=>{qPrep('mage',{lvl:60});if(REG.id!=='home')loadRegion('home');qClear();
  qOk(LOOT25.life===90&&LOOT25.blink===5,`시간 ${LOOT25.life}/${LOOT25.blink}`);const X=P.x+600,Y=P.y;
  const g={x:X,y:Y,kind:'gold',amt:5,t:88},h={x:X+40,y:Y,kind:'hp',tier:0,t:88},tp={x:X+80,y:Y,kind:'tp',t:88},it={x:X,y:Y+40,kind:'item',item:makeItem(20),t:88},young={x:X+40,y:Y+40,kind:'item',item:makeItem(20),t:10},kp={x:X+80,y:Y+40,kind:'item',item:makeItem(20),t:500,keep:1};
  loot.push(g,h,tp,it,young,kp);qStep(20,{dt:.05,render:false});/* 1초 → 89초: 아직 있음 */
  qOk([g,h,tp,it].every(l=>loot.includes(l)),'90초 전에 사라짐');qStep(30,{dt:.05,render:true});/* 1.5초 더 → 90.5초 */
  qOk(![g,h,tp,it].some(l=>loot.includes(l)),`90초가 지났는데 남음 ${[g,h,tp,it].filter(l=>loot.includes(l)).map(l=>l.kind)}`);qOk(loot.includes(young)&&loot.includes(kp),'젊은 것 · 보상이 사라짐');
  /* 깜빡임: 85초 전엔 늘 보이고, 마지막 5초엔 보였다 안 보였다, 보상은 늘 보임 */
  let early=0,on=0,off=0,keepHid=0;for(let t=0;t<85;t+=.05)if(loot25Hide({t}))early++;for(let t=85.01;t<90;t+=.01)loot25Hide({t})?off++:on++;for(let t=85;t<200;t+=.1)if(loot25Hide({t,keep:1}))keepHid++;
  qOk(!early&&on>100&&off>100&&!keepHid,`깜빡임 ${early}/${on}/${off}/${keepHid}`);
  let drew=0;const dl=window.__loot25&&drawLoot;qOk(typeof dl==='function','drawLoot 없음');
  /* 가방이 가득 찰 때 받은 2차 유니크 보상은 바닥에 keep으로 */
  P.bag=[];while(P.bag.length<sqBagCap())P.bag.push(makeItem(20));const k=Object.keys(J2U)[0],n0=loot.length;j2GiveUniq(k);const r=loot.slice(n0).find(l=>l.kind==='item');
  qOk(r&&r.keep===1,'가방이 찬 보상에 keep 없음');if(r){r.t=200;qStep(3,{dt:.05,render:false});qOk(loot.includes(r),'보상이 사라짐')}
  for(const f of [a3Reward,c21Give,j3GiveUniq])qOk(/keep:1/.test(String(f))||/keep:1/.test(String(f.__orig||'')),'keep 빠짐: '+f.name);
  qClear();P.bag=[];return 'gold/hp/tp/장비 90초 · 깜빡임 · 보상 keep'});
qT('지도','v25 성벽 · 성탑 · 울타리가 건물 · 던전 문 · 입구 · 노점 · 창고와 겹치지 않음 (봉인 서고 문이 아르덴 성벽 위에 있던 것)',()=>{qPrep('mage',{lvl:60});const bad=[],regs=[...new Set(ALLTOWNS.map(t=>t.reg||'home'))];let nW=0;
  for(const reg of regs){loadRegion(reg);const L=dm21Layer(reg);qOk(L,'층 없음 '+reg);const W=L.decor.filter(d=>WALL25.K.has(d.k)&&d.foot);nW+=W.length;
    const O=L.decor.filter(d=>!WALL25.K.has(d.k)&&(d.foot||d.use||d.dm21g||d.k==='cave'||d.k==='edgeportal'||d.k==='gate'||d.k==='stash'||d.k==='shop'||d.k==='npc'||d.k==='statue'||d.k==='fountain'));
    for(const w of W)for(const f of w.foot)for(const o of O){const p=o.foot?0:o.dm21g||o.use||o.k==='cave'||o.k==='edgeportal'?60:24;
      const hit=o.foot?o.foot.some(g=>g[0]<f[2]&&g[2]>f[0]&&g[1]<f[3]&&g[3]>f[1]):o.x>f[0]-p&&o.x<f[2]+p&&o.y>f[1]-p&&o.y<f[3]+p;if(hit)bad.push(`${reg} ${w.k}(${Math.round(w.x)},${Math.round(w.y)})×${o.dm21g||o.use||o.k}`)}}
  loadRegion('home');qOk(nW>=15,`성벽 조각이 너무 적음 ${nW}`);qOk(!bad.length,'겹침: '+bad.slice(0,6).join(' / '));
  /* v26: 왕도가 따로 된 지도로 옮겨 가며 봉인 서고 문은 왕도 성안 마법원 옆뜰(성벽 안쪽, 건물 · 성벽과 안 겹침) */
  const g=DM21G.a3_archive,L=RCACHE.royal,A=L&&L.town;qOk(g&&g.d&&A&&g.reg==='royal','봉인 서고 문 없음');const dx=g.d.x-A.x,dy=g.d.y-A.y;
  qOk(Math.abs(dx)<700&&Math.abs(dy)<700,`문이 성벽 밖 ${Math.round(dx)},${Math.round(dy)}`);qOk(!wall25Hit(L,g.d),'문이 성벽에 걸침');
  qOk(!(TW.blds.royal||[]).some(b=>b.foot&&(Array.isArray(b.foot[0])?b.foot:[b.foot]).some(f=>g.d.x>f[0]-40&&g.d.x<f[2]+40&&g.d.y>f[1]-40&&g.d.y<f[3]+40)),'문이 건물에 걸침');

  return `성벽 · 울타리 ${nW}조각 겹침 0 · 봉인 서고 문 왕도 ${Math.round(dx)},${Math.round(dy)}`});
/* ===== v26 왕도 새 지도 · 남부 마을 둘 · 짝문 지도 · 선공/비선공 (사용자 2026-10-10 12:05 · 12:18 · 12:35) ===== */
qT('지도','v26 왕도 아르덴: 따로 된 지도(남부 북쪽) · 네 방향 포탈 · 세계 지도 자리 · 몬스터 없음',()=>{qPrep('mage',{lvl:60});
  const D=REGIONS.royal;qOk(D,'왕도 지역 없음');qOk(JSON.stringify(D.edges)===JSON.stringify({S:'home',N:'ice',W:'highland',E:'canyon'}),'왕도 이음 '+JSON.stringify(D.edges));
  qOk(REGIONS.home.edges.N==='royal'&&REGIONS.ice.edges.S==='royal'&&REGIONS.highland.edges.E==='royal'&&REGIONS.canyon.edges.W==='royal','반대쪽 이음이 왕도가 아님');
  qOk(!REGIONS.ice.edges.E&&!REGIONS.ice.edges.W,'빙원 동서 이음이 남음');
  qOk(String(WPOS.royal)==='0,-1'&&String(WPOS.ice)==='0,-2'&&String(WPOS.lava)==='0,-3','세계 지도 자리 '+[WPOS.royal,WPOS.ice,WPOS.lava].join(' / '));
  const L=RCACHE.royal,A=L.town;qOk(A&&A.id==='arden'&&A.reg==='royal','아르덴이 왕도 지도에 없음');qOk(!TOWNS.some(t=>t.id==='arden'||t.id==='willowen'),'남부 마을 목록에 아르덴 · 윌로벤이 남음');
  qOk(TOWNS.map(t=>t.id).join()==='brenhill,haven','남부 마을 '+TOWNS.map(t=>t.id).join());
  qOk(['N','S','W','E'].every(s=>L.edges.some(e=>e.side===s)),'왕도 포탈이 넷이 아님 '+L.edges.map(e=>e.side).join());
  // 옛 마을 자리 들판 레벨은 그대로 (TOWN0 유령 기준점)
  qOk(Math.floor(levelAt(2500,1300))===16&&Math.floor(levelAt(3500,4450))===5,`옛 자리 레벨 ${levelAt(2500,1300)} · ${levelAt(3500,4450)}`);
  loadRegion('royal');P.x=A.x;P.y=A.y+1500;spawnT=0;for(let i=0;i<40;i++)spawnEnemy();qOk(!enemies.length,'왕도에 몬스터 '+enemies.length);
  P.x=A.x+1700;P.y=A.y-1700;for(let i=0;i<40;i++)spawnEnemy();qOk(!enemies.length,'왕도 모서리에 몬스터 '+enemies.length);
  qStep(120,{spawn:true,dt:.05,render:false});qOk(!enemies.length,'왕도에서 저절로 몬스터 '+enemies.length);
  const s=L.edges.find(e=>e.side==='N');useEdge(s);qOk(REG.id==='ice','북쪽 포탈이 빙원이 아님 '+REG.id);
  const b=EDGES.find(e=>e.side==='S');qOk(b&&b.to==='royal','빙원 남쪽 포탈이 왕도가 아님');useEdge(b);qOk(REG.id==='royal'&&Math.hypot(P.x-L.edges.find(e=>e.side==='N').x,P.y-L.edges.find(e=>e.side==='N').y)<500,'왕도 북쪽 포탈 옆으로 오지 않음');
  loadRegion('home');qClear();return `포탈 ${L.edges.length} · 남부 ${TOWNS.length}곳 · 몬스터 0`});
qT('마을','v26 왕도 직업 전당 넷 · 전직관은 전당 안에 하나씩 · 윌로벤 사람은 헤이븐 나루에 하나씩',()=>{qPrep('mage',{lvl:60});
  const B=TW.blds.royal||[];for(const r of ['arden_academy','arden_cathedral','arden_knights','arden_lodge'])qOk(B.some(b=>b.enter===r)&&TWROOM[r],'전당 없음 '+r);
  const c={};for(const f of TW.folk)c[f.id]=(c[f.id]||0)+1;const dup=Object.keys(c).filter(k=>c[k]>1&&!/^o_/.test(k));qOk(!dup.length,'두 번 있는 사람 '+dup.join());
  const R={elian:'arden_academy',j2_priest:'arden_cathedral',j2_warrior:'arden_knights',j2_archer:'arden_lodge'};
  for(const id in R){const f=TW.folk.find(f=>f.id===id);qOk(f&&f.room===R[id]&&f.town&&f.town.id==='arden'&&f.town.reg==='royal',`${id} 자리 ${f&&f.room}/${f&&f.town&&f.town.reg}`)}
  for(const id of ['bram','magda','bard','elsa','odric','nella','ella']){const f=TW.folk.find(f=>f.id===id);qOk(f&&f.town&&f.town.id==='haven',`${id}이(가) 헤이븐에 없음`)}
  qOk(!TWLAY.willowen,'윌로벤 배치가 남음');qOk(qTw('willowen')&&qTw('willowen').post==='haven','윌로벤 의뢰 자리가 헤이븐이 아님');
  // 2차 전직 의뢰는 모두 왕도 전당에서
  for(const id in J2_NPC)qOk(J2_NPC[id].town==='arden'&&/왕도/.test(J2_NPC[id].where),'전직관 마을 '+id);
  // 전당 안으로 들어가 보기
  loadRegion('royal');const b=B.find(b=>b.enter==='arden_knights');twEnter(b);qOk(IN&&TW.folk.some(f=>f.id==='j2_warrior'&&f.room==='arden_knights'),'기사단 전당 안 전직관 없음');
  qClosePanels();loadRegion('home');return '전당 4 · 전직관 4 · 나루 사람 7'});
qT('저장','v26 옛 저장 옮기기: 옛 아르덴 자리 → 왕도 짝문 앞, 옛 윌로벤 자리 → 헤이븐, 가 본 마을 윌로벤 → 헤이븐 (레벨 · 경험치 · 짐 그대로)',()=>{qPrep('mage',{lvl:60});
  const mk=(x,y,tw,home)=>({reg:'home',x,y,towns:tw,home,lvl:37,xp:12345,bag:[{id:1}],gold:777});
  const a=mk(2500,1300,['brenhill','willowen','arden'],'arden');qOk(royalMigrate(a)==='arden','옛 아르덴 자리 안 옮김');qOk(a.reg==='royal'&&a.towns.includes('arden')&&a.towns.includes('haven')&&!a.towns.includes('willowen')&&a.home==='arden','왕도 저장 '+JSON.stringify([a.reg,a.towns,a.home]));
  const A=RCACHE.royal.town;qOk(Math.hypot(a.x-A.gate.x,a.y-A.gate.y)<120,'왕도 짝문 앞이 아님');
  const w=mk(3500,4450,['brenhill','willowen'],'willowen');qOk(royalMigrate(w)==='willowen','옛 윌로벤 자리 안 옮김');const H=TOWNS.find(t=>t.id==='haven');
  qOk(w.reg==='home'&&Math.hypot(w.x-H.gate.x,w.y-H.gate.y)<120&&w.home==='haven'&&w.towns.join()==='brenhill,haven','헤이븐 저장 '+JSON.stringify([w.x,w.y,w.towns,w.home]));
  const f=mk(1200,3000,['brenhill'],'brenhill');qOk(royalMigrate(f)===null&&f.x===1200&&f.y===3000&&f.reg==='home','들판 저장이 움직임');
  const g=mk(500,500,['brenhill'],'brenhill');g.reg='forest';qOk(royalMigrate(g)===null&&g.reg==='forest','다른 지역 저장이 움직임');
  for(const d of [a,w,f])qOk(d.lvl===37&&d.xp===12345&&d.gold===777&&d.bag.length===1,'레벨 · 경험치 · 짐이 바뀜');
  qOk(!/removeItem|localStorage/.test(String(royalMigrate)),'저장 지우는 코드');
  // 실제 불러오기: 새 저장 형식에서 위치 · 지역이 들어감
  const d=JSON.parse(JSON.stringify(saveData()));d.reg='home';d.x=2500;d.y=1300;d.towns=['brenhill','willowen'];d.home='brenhill';load(d,QA_SLOT);
  qOk(REG.id==='royal'&&P.towns.includes('arden')&&P.towns.includes('haven')&&!P.towns.includes('willowen'),'불러온 뒤 '+REG.id+' '+P.towns.join());
  loadRegion('home');return '옮김 2 · 그대로 2'});
qT('화면','v26 짝문 = 세계 지도: 지역 칸이 지도 자리대로, 가 본 마을만 눌림, 휴대폰 단추 40px 이상, 누르면 그 마을로',async()=>{qPrep('mage',{lvl:60});
  P.towns=['brenhill'];P.x=TOWNS[0].gate.x;P.y=TOWNS[0].gate.y+30;update(1/60);openPanel('gate');await qSleep();
  const cells=[...pbody.querySelectorAll('.g26c')],ids=cells.map(c=>c.dataset.greg);const want=Object.keys(REGIONS).filter(id=>WPOS[id]&&ALLTOWNS.some(t=>t.reg===id));
  qOk(cells.length===want.length,`칸 ${cells.length}/${want.length}`);qOk(!pbody.querySelector('[data-travel]'),'가 본 적 없는 마을이 눌림');
  qOk(pbody.querySelectorAll('.g26t.lock').length>=ALLTOWNS.length-2,'자물쇠가 모자람');qOk(pbody.querySelector('.g26t.here'),'「지금 여기」 없음');
  const cl=id=>cells[ids.indexOf(id)],top=id=>parseFloat(cl(id).style.top),left=id=>parseFloat(cl(id).style.left);
  qOk(top('royal')<top('home')&&top('ice')<top('royal')&&left('royal')===left('home'),'왕도가 남부 바로 위가 아님');qOk(left('highland')<left('royal')&&left('canyon')>left('royal')&&top('highland')===top('royal'),'고원 · 협곡이 왕도 양옆이 아님');
  // 칸이 서로 겹치지 않음
  for(let i=0;i<cells.length;i++)for(let j=i+1;j<cells.length;j++){const a=cells[i].getBoundingClientRect(),b=cells[j].getBoundingClientRect();qOk(!(a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1),'칸 겹침 '+ids[i]+'/'+ids[j])}
  P.towns.push('haven','arden');renderPanel();const tr=[...pbody.querySelectorAll('[data-travel]')].map(b=>b.dataset.travel).sort().join();qOk(tr==='arden,haven','눌리는 마을 '+tr);
  for(const b of pbody.querySelectorAll('.g26t'))qOk(b.getBoundingClientRect().height>=40,'단추가 40px보다 낮음');
  pbody.querySelector('[data-travel="arden"]').click();await qSleep();qOk(REG.id==='royal'&&nearestTown(P.x,P.y).t.id==='arden','짝문으로 왕도에 가지 않음 '+REG.id);
  qClosePanels();loadRegion('home');return `칸 ${cells.length}`});
qT('전투','v26 선공 · 비선공: 비선공은 맞기 전까지 안 옴, 선공은 예전 거리의 70%, 보스 · 정예 · 던전은 그대로, 지역마다 섞임',()=>{qPrep('warrior',{lvl:60});const T=TOWNS[0];P.x=T.x+1500;P.y=T.y;P.invT=1e9;
  const mk=(k,dx,o)=>{const t=TYPES[k];const e={k,x:P.x+dx,y:P.y,lvl:3,elite:false,hp:5e4,max:5e4,dmg:0,r:t.r,atkCd:1e9,anim:0,wx:P.x+dx,wy:P.y,wt:0,hurt:0,fx:1,slowT:0,freezeT:0,stunT:0,burn:null,lunge:0,...(o||{})};enemies.push(e);return e};
  const ak='wraith',ag=TYPES[ak].aggro;qOk(ag26Kind({k:'slime'})==='P'&&ag26Kind({k:ak})==='A'&&ag26Kind({k:ak,elite:true})==='X'&&ag26Kind({k:ak,boss:1})==='X','종류 판정');
  qOk(aggroOf({k:'slime'},TYPES.slime)===0&&Math.abs(aggroOf({k:ak},TYPES[ak])-ag*.7)<1e-6,'알아채는 거리');
  const p=mk('slime',90),a=mk(ak,-ag*.6),a2=mk(ak,ag*.85,{y:P.y+5}),el=mk(ak,0,{elite:true,x:P.x,y:P.y+ag*.85});
  qStep(30,{dt:1/60,render:false});qOk(!p.aggroed,'비선공이 먼저 쫓아옴');qOk(a.aggroed,'선공(가까이)이 안 쫓아옴');qOk(!a2.aggroed,'선공이 예전 거리에서 쫓아옴');qOk(el.aggroed,'정예가 예전 거리에서 안 쫓아옴');
  hurtE(p,1,null);qStep(20,{render:false});qOk(p.aggroed,'때린 비선공이 안 쫓아옴');
  qOk(ag26Tag(p).includes('비선공')&&ag26Tag(a).includes('선공'),'이름 창 표시');
  // 남부는 대부분 비선공, 다른 들판 지역은 선공 · 비선공이 섞임
  const home=FIELD_TYPES.filter(k=>TYPES[k]&&!TYPES[k].boss);qOk(home.filter(k=>AG26.P.has(k)).length*2>home.length,'남부 비선공이 절반 이하');
  const bad=[];for(const id of REG_IDS){const m=(REGIONS[id].mobs||[]).filter(k=>TYPES[k]&&!TYPES[k].boss&&!TYPES[k].mini);if(m.length<2)continue;const np=m.filter(k=>AG26.P.has(k)).length;if(!np||np===m.length)bad.push(id+' '+np+'/'+m.length)}
  qOk(!bad.length,'안 섞인 지역 '+bad.join());render();qClear();return `남부 비선공 ${home.filter(k=>AG26.P.has(k)).length}/${home.length}`});
qT('전투','v26 궁수 사거리 1.5배 · 꿰뚫는 기술 2배: 퀵 샷 760 · 피어싱 샷 · 시즈 샷 1000에서 맞음, 그 너머는 못 맞힘, 마법사 · 덫 · 스캐터 발리는 그대로',()=>{qPrep('archer',{lvl:140});
  TYPES.qa_dummy=TYPES.qa_dummy||Object.assign({},TYPES.ogre,{n:'QA 허수아비',spd:0,dmg:0,xp:0,aggro:0,atk:1e9,ranged:false,undead:false,boss:0,mini:0});const hr=Math.max(TYPES.qa_dummy.r,R22_HW.ogre),out=[];
  for(const [id,d] of [['quickshot',760],['piercearrow',1000],['fulldraw',1000],['siegeshot',1000],['pierceblow',1000]]){if(!SPELLS[id])continue;qOk(qR22Shot(id,d,2.4,3)>0,`${id} ${d}에서 못 맞힘`);
    const far=r22Cap(SPELLS[id])+hr+70+(SPELLS[id].kind==='beam'?(eff(id,10).w||0):0);qOk(!(qR22Shot(id,far,-.785,1)>0),`${id} ${Math.round(far)}에서 맞음`);out.push(id+' '+r22Cap(SPELLS[id]))}
  qOk(eff('wildrun',10).len===750&&eff('curvingshot',10).range===780,'길이 · 거리 1.5배 '+eff('wildrun',10).len+'/'+eff('curvingshot',10).range);
  qOk(eff('scattervolley',10).range===300&&TRAP_RANGE===380,'스캐터 · 덫이 바뀜');qOk(r22Cap(SPELLS.spark)===480&&r22Cap(SPELLS[Object.keys(SPELLS).find(id=>SPELLS[id].cls==='priest'&&SPELLS[id].kind==='bolt')])===480,'다른 직업 사거리가 바뀜');
  qOk(r22Gnd(SPELLS.arrowrain)===840&&r22Gnd(SPELLS.meteor||{cls:'mage'})===560,'땅 범위 가운데');
  // 자동 겨누기도 810까지
  touchMode=true;mouse.active=false;let e=qDummy(P.x+780,P.y);let t=aimPoint();qOk(Math.hypot(t.x-e.x,t.y-e.y)<1,'자동 겨누기가 780을 못 고름');qClear();touchMode=false;
  return out.join(' · ')});
qT('보스 v26','모르가스 쉽게: 부하(재의 사도)는 30초에 둘(처음 20초 뒤) · 분신은 부하를 안 부르고 화살 부채 5 · 보스 부채 8(분노 10) · 군주의 메아리 쌍둥이 · 다른 보스는 그대로',()=>{const out=[];
  try{const T=TYPES.b_morgath;qOk(T.sumCd===30&&T.sumN===2&&String(T.vol)==='8,10','값');qOk(!TYPES.b_arsil.vol&&!TYPES.b4_morgath2.vol&&TYPES.b_arsil.sumN==null,'다른 보스도 바뀜');
    let {e}=qBossAt(3,0);qOk(e.k==='b_morgath','4번째 던전 보스가 모르가스가 아님 '+e.k);enemies=[e];const sum=[],vol=[];let nA=0;
    const watch=i=>{P.invT=1e9;P.hp=maxHp();const a=enemies.filter(o=>o.k==='apostle'&&!o._s26);for(const o of a)o._s26=1;if(a.length){sum.push([i/30,a.length]);nA+=a.length}
      const ps=projs.filter(p=>p.owner==='e'&&!p._s26);for(const p of ps)p._s26=1;if(ps.length)vol.push(ps.length);for(const o of enemies)if(o.k==='apostle'){o.hp=0;o.dead=true}};
    qStep(30*120,{dt:1/30,render:false,each:watch});
    qOk(sum.length>=2,'부하를 안 부름 '+sum.length);qOk(sum[0][0]>=19.5,'처음 부름 '+sum[0][0]);for(let i=1;i<sum.length;i++)qOk(sum[i][0]-sum[i-1][0]>=29.5,'부르는 간격 '+(sum[i][0]-sum[i-1][0]).toFixed(1));
    qOk(sum.every(x=>x[1]<=2),'한 번에 '+sum.map(x=>x[1]));qOk(vol.length&&Math.max(...vol)<=8,'부채 '+Math.max(...vol));out.push(`120초 부름 ${sum.length}번 · 부채 ${Math.max(...vol)}`);
    // 50%: 분신 하나. 분신은 부하를 부르지 않고 부채 5 · 보스는 분노 부채 10
    e.hp=Math.round(e.max*.45);qStep(1,{render:false,each:()=>{P.invT=1e9}});const c=enemies.find(o=>o.clone&&o.mg===e.mg);qOk(c,'분신 없음');e.sumT=1e9;sum.length=0;vol.length=0;
    qStep(30*60,{dt:1/30,render:false,each:i=>{watch(i);e.hp=Math.max(e.hp,1);c.hp=Math.max(c.hp,1)}});qOk(!sum.length,'분신이 부하를 부름 '+sum.length);
    qOk(vol.length&&Math.max(...vol)<=10&&vol.includes(5),'분노 · 분신 부채 '+[...new Set(vol)]);out.push('분신 부채 '+[...new Set(vol)].sort((a,b)=>a-b).join('/'))}finally{if(DG)leaveDungeon()}
  return out.join(' · ')});
qT('보스 v26','보스방 3배: 모든 지역의 모든 동굴 던전에서 보스방이 v24 넓이(원래 방의 2.25배 · 큰 보스 2.6배)의 3배 이상 · 보스가 가운데 · 남은 방과 떨어짐 · 걸어서 감 · 방 8개 이상',()=>{let n=0,mn=99,eat=0;const bad=[];qPrep('mage',{lvl:60});P.invT=1e9;
  for(const id of Object.keys(REGIONS)){if(DG)leaveDungeon();loadRegion(id);for(const c of CAVES.slice()){if(!c.cave||c.cave.trial||c.cave.arena||c.cave.w3k==='trial')continue;if(DG)leaveDungeon();K22.m.clear();enterDungeon(c);qOk(!DG||DG.d===c.cave,'다른 던전이 열림 '+c.cave.n);if(!DG||!DG.boss){bad.push(c.cave.n+' 못 들어감');continue}
    const br=DG.rooms.find(r=>r.b24);if(!br){bad.push(c.cave.n+' 넓힌 방 없음');continue}const t=TYPES[c.cave.boss]||{},need=((t.sc||2)>=2.7?2.6:2.25)*3,k=br.w*br.h/br.b24;mn=Math.min(mn,k/need*3);if(k<need-1e-9)bad.push(`${c.cave.n} ×${k.toFixed(2)}<${need.toFixed(2)}`);eat+=br.b26||0;
    const b=DG.boss,bi=Math.floor((b.x-OX)/TS),bj=Math.floor((b.y-OY)/TS);if(!(bi>=br.i&&bi<br.i+br.w&&bj>=br.j&&bj<br.j+br.h))bad.push(c.cave.n+' 보스가 방 밖');
    for(const o of DG.rooms)if(o!==br&&br.i<=o.i+o.w&&br.i+br.w>=o.i&&br.j<=o.j+o.h&&br.j+br.h>=o.j)bad.push(c.cave.n+' 다른 방과 붙음');if(DG.rooms.length<8)bad.push(c.cave.n+' 방 '+DG.rooms.length);
    for(let y=br.j;y<br.j+br.h;y++)for(let x=br.i;x<br.i+br.w;x++)if(!dgFloor(x,y)){bad.push(c.cave.n+' 막힌 칸');y=1e9;break}
    const D=bfs(DG.g,DG.start.cx,DG.start.cy);if(D[tIdx(bi,bj)]<0)bad.push(c.cave.n+' 보스에게 못 감');for(const r of DG.rooms)if(D[tIdx(r.cx,r.cy)]<0)bad.push(c.cave.n+' 못 가는 방');n++}}
  if(DG)leaveDungeon();loadRegion('home');qOk(!bad.length,bad.slice(0,6).join(' / '));qOk(n>=20,'던전 '+n);return `던전 ${n}곳 · v24 보스방보다 가장 작게 ×${mn.toFixed(2)} · 합친 방 ${eat}`});
function qaOverlay(res,sum,done){let el=document.getElementById('qaOverlay');
  if(!el){el=document.createElement('div');el.id='qaOverlay';el.setAttribute('role','region');el.setAttribute('aria-label','자가 점검 결과');document.body.appendChild(el);
    const st=document.createElement('style');st.textContent=`#qaOverlay{position:fixed;inset:12px;z-index:99999;background:rgba(10,9,8,.96);border:1px solid #5c4a2e;border-radius:6px;color:#ece4d0;font:12px/1.35 "Gowun Dodum",sans-serif;overflow:auto;padding:10px 14px;box-shadow:0 8px 40px #000}
#qaOverlay h1{font:800 18px "Nanum Myeongjo",serif;margin:0 0 4px;color:#d6b262}#qaOverlay .sum{font-size:14px;margin:2px 0 8px}#qaOverlay .sum b.p{color:#8cf08a}#qaOverlay .sum b.f{color:#ff7a6a}
#qaOverlay table{border-collapse:collapse;width:100%;margin:4px 0 10px}#qaOverlay th,#qaOverlay td{border-bottom:1px solid #2e2820;padding:2px 6px;text-align:left;vertical-align:top}#qaOverlay th{color:#9d9584;font-weight:normal;position:sticky;top:-10px;background:#0e0c0a}
#qaOverlay td.r{white-space:nowrap;font-weight:bold}#qaOverlay tr.ok td.r{color:#8cf08a}#qaOverlay tr.no td.r{color:#ff7a6a}#qaOverlay tr.no{background:rgba(255,80,60,.08)}#qaOverlay td.why{color:#b8b0a0;max-width:640px;word-break:break-all}
#qaOverlay .cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}#qaOverlay h2{font-size:13px;color:#d6b262;margin:8px 0 2px}#qaOverlay .ms{color:#7d7568;white-space:nowrap}`;document.head.appendChild(st)}
  const fails=res.filter(r=>!r.pass),groups=[...new Set(res.map(r=>r.group))];const esc=s=>String(s==null?'':s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const row=r=>`<tr class="${r.pass?'ok':'no'}"><td>${esc(r.group)}</td><td>${esc(r.name)}</td><td class="r">${r.pass?'통과':'실패'}</td><td class="why">${esc(r.reason)}</td><td class="ms">${r.ms}ms</td></tr>`;
  const head='<tr><th>그룹</th><th>항목</th><th>결과</th><th>이유 · 결과값</th><th>시간</th></tr>';
  let h=`<h1>아르세이아의 견습생 · 자가 점검 (#qa)</h1><div class="sum">${done?'완료':'진행 중…'} · 항목 ${res.length}${done?'':'/'+sum.total} · <b class="p">통과 ${res.length-fails.length}</b> · <b class="f">실패 ${fails.length}</b> · ${(sum.ms/1000).toFixed(1)}초 · 진짜 저장소 접근 <b class="${QA.realAccess?'f':'p'}">${QA.realAccess}회</b></div>`;
  h+='<div class="cols"><div><h2>그룹별</h2><table><tr><th>그룹</th><th>통과</th><th>실패</th></tr>'+groups.map(g=>{const a=res.filter(r=>r.group===g);const f=a.filter(r=>!r.pass).length;return `<tr class="${f?'no':'ok'}"><td>${esc(g)}</td><td>${a.length-f}</td><td class="r">${f}</td></tr>`}).join('')+'</table></div>';
  h+='<div><h2>성능 (update+render 한 프레임, ms)</h2><table><tr><th>장면</th><th>평균</th><th>p95</th><th>최악</th><th>프레임</th></tr>'+Object.entries(qaPerf).map(([k,p])=>`<tr><td>${{town:'마을',fight50:'몬스터 50마리 전투',rank9:'9위계 마법 연속',stress:'안정성(50마리+큰 마법 30초)'}[k]||k}</td><td>${p.avgMs}</td><td>${p.p95Ms}</td><td>${p.worstMs}</td><td>${p.frames}</td></tr>`).join('')+'</table></div></div>';
  if(fails.length)h+=`<h2>실패한 항목 ${fails.length}</h2><table>${head}${fails.map(row).join('')}</table>`;
  h+=`<h2>모든 항목</h2><table>${head}${res.map(row).join('')}</table>`;el.innerHTML=h}
/* ===== v20 (CORE): 3차 전직 · 최고 레벨 140 · 모으기 채널링 · 무너짐 게이지 · 파티 장치 · 의뢰 「재로 쓴 이름」 · 숨은 곳 · 시험의 방 · 저장 ===== */
// 점검용 3차 기술: 그 직업 1위계 공격 기술을 본떠 잠깐 만든다(다른 작업의 기술 데이터와 상관없이 CORE 장치만 본다). qJ3Off가 끝나면 지운다
function qJ3Fake(cls,br,o){const base=Object.values(SPELLS).find(s=>s.cls===cls&&s.rank===1&&s.mult>0&&!s.job2&&!s.job3&&!s.tab&&s.kind!=='passive');
  const id='qa3_'+br+((o&&o.tag)||'');SPELLS[id]=Object.assign({},base,{id,n:'점검 3차 기술',kn:'점검 3차 기술',rank:20,job3:br,upLv:J3_LV[0],cd:1,cost:1},o||{});delete SPELLS[id].job2;delete SPELLS[id].tab;delete SPELLS[id].tag;
  TREE[id]='j3_'+br;TREEPOS[id]={row:19,col:0};PRE[id]=[];if(!J3_SPELLS.includes(id))J3_SPELLS.unshift(id);return id}
function qJ3Drop(){for(const id of Object.keys(SPELLS)){if(!id.startsWith('qa3_'))continue;delete SPELLS[id];delete TREE[id];delete TREEPOS[id];delete PRE[id];delete J3CHG[id];if(P&&P.sk)delete P.sk[id];const i=J3_SPELLS.indexOf(id);if(i>=0)J3_SPELLS.splice(i,1)}
  if(P&&P.bar)P.bar=P.bar.map(x=>typeof x==='string'&&x.startsWith('qa3_')?null:x);if(J3CH&&!SPELLS[J3CH.id])J3CH=null;passT=-1}
const qJ3Off=f=>{const a=QA_J3.auto;QA_J3.auto=false;try{return f()}finally{QA_J3.auto=a;J2UI.tab=null;try{if(!panel.hidden)closePanel()}catch(_){}qJ3Drop()}};
const qSpLv=(l0,l1)=>{let n=0;for(let l=l0+1;l<=l1;l++)n+=l>J3LV?2:1;return n};
// 시험의 방 이기기: 기믹을 풀면서(방패 깨기 · 낙인 · 내려앉기 · 밤 · 순례자 일으키기) 몬스터를 쓰러뜨린다
function qJ3Win(){const T=DG&&DG.j3t;if(!T)return 0;
  if(T.g==='pilgrims'){for(const t of [60.5,120.5]){T.t=t;qStep(1,{render:false});for(const a of T.npcs)if(a.down){a.x=P.x+20;a.y=P.y}healP(maxHp()*.7)}T.t=T.end;qStep(2,{render:false});return T.res}
  for(let n=0;n<400&&!T.res;n++){for(const e of enemies.slice()){if(e.dead||e.hp<=0)continue;if(T.g==='shield'&&e.j3sh)j3Event('cast');if(T.g==='clones'&&e.j3cl===2)j3Mark(T,e);if(T.g==='sky')e.j3gnd=3;if(T.g==='beast')T.nightT=6;
      hurtE(e,e.hp/(j3DmgK(e,QA_J2HIT,P)||1)+50,QA_J2HIT)}if(T.g==='hundred')T.wt=0;qStep(2,{render:false})}
  return T.res}
qT('3차 전직 v20','기본 값: 최고 레벨 140 · 3차 갈래 8개(2차 갈래마다 하나) · 칭호 8개 · 3차 기술 최대 10점 · 열리는 레벨 100~130 · 계열 j3_ · 3차 칭호',()=>{
  qOk(MAXLV===140,'MAXLV '+MAXLV);qOk(J3LV===100&&J3_MAXSK===10,'값');
  const T={archsorcerer:'대마법사',spiritking:'정령왕의 계약자',executor:'빛의 집행자',saint:'성자',bulwark:'성벽의 군주',warlord:'전쟁군주',divinearcher:'신궁',shadowhunter:'그림자 사냥꾼'};let n=0;
  for(const c in JOB2)for(const b2 in JOB2[c]){const b3=JOB3_OF[b2];qOk(b3&&JOB3[c][b3]&&JOB3[c][b3].from===b2&&JOB2_OF3[b3]===b2&&JOB3_IDS[c].includes(b3),`${b2} → ${b3}`);qOk(JOB3[c][b3].title===T[b3]&&JOB3[c][b3].n===T[b3],`${b3} 칭호 ${JOB3[c][b3].title}`);n++}
  qOk(n===8,'갈래 '+n);qOk(J3_LV.length===11&&J3_LV[0]===100&&J3_LV[10]===130&&J3_LV.every((v,i)=>!i||v>=J3_LV[i-1]),'열리는 레벨 '+J3_LV);
  for(const id of J3_SPELLS){const s=SPELLS[id];qOk(s.job3&&JOB2_OF3[s.job3]&&JOB3[s.cls]&&JOB3[s.cls][s.job3],`${id}: 갈래 ${s.job3}`);qOk(TREE[id]==='j3_'+s.job3&&s.upLv>=100&&s.upLv<=130&&!s.job2&&skMax(id)===10&&isJ3(id),`${id}: 계열/레벨 ${TREE[id]} ${s.upLv}`)}
  qOk(skMax('spark')===MAXSK&&!isJ3('spark'),'1차 최대 점수');
  qPrep('mage',{lvl:100});P.job2='archmage';const t2=job2Title();qOk(t2!=='대마법사','전직 전 3차 칭호');P.job3='archsorcerer';qOk(job2Title()==='대마법사','3차 칭호 '+job2Title());P.job3='spiritking';qOk(job2Title()!=='정령왕의 계약자'||JOB3_OF[P.job2]==='spiritking','맞지 않는 갈래의 칭호');
  return `3차 기술 ${J3_SPELLS.length}개 · ${Object.values(T).join(' / ')}`});
qT('3차 전직 v20','레벨 100→140: 100→140은 60→100의 약 1.5배(v24부터 약 1.9배) 사냥(같은 레벨 몬스터) · 필요 경험치는 늘기만 함 · 100 위로 레벨마다 스킬 포인트 2점 · 140에서 멈춤 · 100레벨에 3차 전직 알림',()=>{const kx=l=>1+.35*(l-1);let a=0,b=0;
  for(let l=60;l<100;l++)a+=xpNeed(l)/kx(l);for(let l=100;l<MAXLV;l++)b+=xpNeed(l)/kx(l);const r=b/a;qOk(r>1.4&&r<2.1,`배율 ${qR(r)}`);/* v24(사용자 05:06): 높은 레벨일수록 필요 경험치를 더 늘림(100레벨 ×8 → 140레벨 ×10) → 예전 1.5배에서 약 1.9배 */for(let l=99;l<MAXLV-1;l++)qOk(xpNeed(l+1)>xpNeed(l),`Lv${l}→${l+1}`);
  qPrep('mage',{lvl:99});P.job2='archmage';P.sp=0;P.ap=0;P.xp=0;gainXp(xpNeed(99));qOk(P.lvl===100&&P.sp===1&&P.ap===5,`99→100: sp${P.sp} ap${P.ap}`);gainXp(xpNeed(100));qOk(P.lvl===101&&P.sp===3&&P.ap===10,`100→101: sp${P.sp} ap${P.ap}`);
  gainXp(1e13);qOk(P.lvl===140&&P.xp===0&&P.sp===3+39*2,`140: Lv${P.lvl} sp${P.sp} xp${P.xp}`);gainXp(1e9);qOk(P.lvl===140&&P.xp===0,'140에서 더 오름');
  qPrep('mage',{lvl:99});P.job2='archmage';P.xp=0;const n0=$('#log').textContent.length;gainXp(xpNeed(99));
  return new Promise(ok=>setTimeout(()=>{qOk(/3차 전직/.test($('#log').textContent.slice(Math.max(0,n0-200))),'전직 알림 없음');ok(`×${qR(r)} · Lv100 ${xpNeed(100).toLocaleString()} · Lv139 ${xpNeed(139).toLocaleString()}`)},450))});
qT('3차 전직 v20','3차 기술: 그 3차 갈래로 전직해야 배우고 씀 · 최대 10점 · 한 점마다 피해 +12%(마법 1.2레벨 · 물리 2레벨, 더하는 식) · 「모든 스킬 +」 안 붙고 「3차 계열 +」만 · 화면엔 찍은 레벨 · 불러올 때 10점 넘는 만큼 돌려받음',()=>qJ3Off(()=>{const r=[];
  for(const c of QCLS){const br3=JOB3_IDS[c][0];qPrep(c,{lvl:140});P.invT=1e9;const id=qJ3Fake(c,br3);if(typeof clsGearFor==='function')clsGearFor(id);P.sp=30;P.job2=JOB2_OF3[br3];
    qOk(!canLearn(id),'3차 전에 배움');P.sk[id]=1;P.noMpT=0;P.mp=maxMp();tryCast(id,qAt(0,100));qOk(!(P.cd[id]>0),'3차 전에 써짐');delete P.sk[id];
    P.job3=JOB3_IDS[c][1];qOk(!canLearn(id),'다른 3차 갈래가 배움');P.job3=br3;qOk(canLearn(id),'전직 뒤 못 배움');
    for(let i=0;i<12;i++)learnPoint(id);qOk(P.sk[id]===10&&!canLearn(id),'점수 '+P.sk[id]);const k=J3K(c);
    qOk(Math.abs(skLv(id)-(1+9*k))<1e-9&&skShow(id)===10,`레벨 ${skLv(id)} · 보이는 레벨 ${skShow(id)}`);
    const sc=L=>PHYS_CLS[c]?PSCALE.perL*lvSteps(L):LV_PT*lvSteps(L);qOk(Math.abs(sc(skLv(id))-sc(1)-1.08)<1e-6,`10점 피해 +${qR((sc(skLv(id))-sc(1))*100)}%`);
    const L0=skLv(id);P.gear.amulet=QA_ITEM(991,'amulet',4,'시험 목걸이',100,{all:3},{cls:c});qOk(skLv(id)===L0&&skShow(id)===10,'모든 스킬 +이 붙음');
    P.gear.amulet=QA_ITEM(992,'amulet',4,'시험 목걸이',100,{['tr_j3_'+br3]:1},{cls:c});qOk(skShow(id)===11&&Math.abs(skLv(id)-(1+10*k))<1e-9,'3차 계열 +1이 안 붙음 '+skShow(id));qOk(/3차/.test(statName('tr_j3_'+br3)),'옵션 이름 '+statName('tr_j3_'+br3));P.gear.amulet=null;
    P.mp=maxMp();P.cd={};P.noMpT=0;qRecWait();tryCast(id,qAt(0,100));qOk(P.cd[id]>0,'전직 뒤 못 씀');
    openPanel('tree');J2UI.tab='j3';nodeSel=id;renderPanel();qOk(/10<\/b> \/ 10/.test(pbody.innerHTML)&&pbody.querySelector(`.detail [data-learn="${id}"]`).disabled,'자세히: 10 / 10');closePanel();
    const ld=skLoad({[id]:14},c,140);qOk(ld.sk[id]===10&&ld.back>=4,`불러오기 ${ld.sk[id]} · 돌려받음 ${ld.back}`);r.push(`${QCN[c]} 한 점 ${J3K(c)}레벨`)}
  return r.join(' · ')}));
qT('3차 전직 v20','모으기 채널링(charge): 누를 때 마나·재사용 한 번 · 모을수록 ×1→×mul · 새로 다시 누르면 모은 만큼 쏨(v20: 손을 떼도 계속 모음) · 다 차면 저절로 · 움직이면 쏨 · 다른 기술을 누르면 쏨 · 채널링 무늬·한 줄 설명 · 시작/모으는 중/끝 갈고리 · 그림',()=>qJ3Off(()=>{
  qPrep('mage',{lvl:120});P.invT=1e9;P.job2='archmage';P.job3='archsorcerer';const id=qJ3Fake('mage','archsorcerer',{charge:{max:1,mul:3},cd:6,cost:20});P.sk[id]=1;P.sk.spark=1;
  const h={s:0,t:0,e:0};j3OnCharge(id,{start:()=>h.s++,tick:()=>h.t++,end:()=>h.e++});const e=qDummy(P.x+200,P.y);
  qOk(CMARK.kind(id)==='chan'&&/모으기 채널링 최대 1초/.test(castInfo(id,1))&&/×3/.test(castInfo(id,1)),'표시 '+castInfo(id,1));
  P.mp=maxMp();const mp0=P.mp;tryCast(id,e);qOk(J3CH&&J3CH.id===id,'모으기가 안 시작됨');qOk(P.mp===mp0-costOf(id)&&P.cd[id]>0,'마나·재사용');qStep(20,{render:true});qOk(P.mp>=mp0-costOf(id)-1&&J3CH&&J3CH.f>.2&&J3CH.f<.5,'모으는 중 '+(J3CH&&J3CH.f));
  qStep(60,{render:false,until:()=>!J3CH});qOk(!J3CH&&J3CH_LAST&&J3CH_LAST.f===1&&J3CH_LAST.k===3,'다 차도 저절로 안 쏨 '+JSON.stringify(J3CH_LAST));qStep(40,{render:false});const full=e.taken;qOk(full>0,'다 모은 공격이 안 맞음');qOk(h.s===1&&h.t>10&&h.e===1,'갈고리 '+JSON.stringify(h));
  // 손으로 누르고 있다가 뗌(castSlot이 매 프레임 부르는 것과 같게)
  P.cd={};qRecWait();P.mp=maxMp();P.bar[5]=id;castSlot(5,e);qOk(J3CH&&J3CH.sticky,'손으로 누른 모으기');qStep(30,{render:false});qOk(J3CH,'손을 떼었더니 쏨 (v20: 이어서 모음)');castSlot(5,e);
  qOk(!J3CH&&J3CH_LAST.f>.3&&J3CH_LAST.f<.8&&J3CH_LAST.k>1.5&&J3CH_LAST.k<2.7,'다시 누르면 모은 만큼 '+JSON.stringify(J3CH_LAST));const t0=e.taken;qStep(40,{render:false});const half=e.taken-t0;qOk(half>0,'반쯤 모은 공격이 안 맞음');
  P.cd={};qRecWait();tryCast(id,e);keys.add('KeyD');qStep(3,{render:false});keys.delete('KeyD');qOk(!J3CH&&J3CH_LAST.f<.3,'움직여도 안 쏨');
  qStep(2,{render:false});P.cd={};qRecWait();tryCast(id,e);qOk(J3CH,'멈춰 섰는데 안 모음');const last=J3CH_LAST;qStep(10,{render:false});P.mp=maxMp();tryCast('spark',e);qOk(!J3CH&&J3CH_LAST!==last&&J3CH_LAST.f>0,'다른 기술을 눌러도 안 쏨');
  P.cd={};qRecWait();tryCast(id,e);P.hp=0;P.dead=true;qStep(1,{render:false});qOk(!J3CH,'쓰러져도 계속 모음');P.dead=false;P.hp=maxHp();
  return `다 모음 ${Math.round(full)} · 반쯤 ${Math.round(half)} (×${qR(J3CH_LAST.k)})`}));
qT('3차 전직 v20','무너짐 게이지: breakAdd(보스·준보스만) · 100이 차면 무너짐(onBreak 갈고리 · 시전 끊김) · 무너진 동안 더 안 참 · 같이 하기 참가자는 방장에게 보내고 방장이 받아 채움 · 금빛 게이지',()=>{
  qPrep('mage',{lvl:100});P.invT=1e9;const b=qMob('b_elgaros',200,100),m=qMob('wolf',-200,100);let hit=0;const fn=e=>{if(e===b)hit++};onBreak(fn);
  try{qOk(!breakAdd(m,50)&&!(m.stg>0),'일반 몬스터에 참');qOk(breakAdd(b,60)&&b.stg>=60&&!isBroken(b),'60 → '+b.stg);b.cast=1;breakAdd(b,50);qOk(isBroken(b)&&hit===1&&!b.cast,`무너짐 ${b.brk} 갈고리 ${hit} 시전 ${b.cast}`);
    qOk(!breakAdd(b,50)&&hit===1,'무너진 동안 또 참');qStep(2,{render:true});
    const {r,sent}=qPty(2,{});NET.guest=true;NET.hostId=r.id;const b2=qMob('b_elgaros',250,100);sent.length=0;qOk(breakAdd(b2,40)&&!(b2.stg>0),'참가자가 직접 채움');
    const m2=sent.find(x=>x.t==='j3x'&&x.k==='brk');qOk(m2&&m2.to===r.id&&m2.id===b2.id&&m2.a===40,'보낸 메시지 '+JSON.stringify(m2));
    NET.guest=false;NET.host=true;netOnMsg({t:'j3x',k:'brk',id:b2.id,a:40,from:r.id});qOk(b2.stg>=40,'방장이 받아도 안 참 '+b2.stg);
    NET.host=false;netOnMsg({t:'j3x',k:'brk',id:b2.id,a:40,from:r.id});qOk(b2.stg<80,'방장이 아닌데 받아서 참')}
  finally{qPtyOff();const i=J3BRK.indexOf(fn);if(i>=0)J3BRK.splice(i,1)}return '보스 100 → 무너짐 · 참가자 → 방장'});
qT('3차 전직 v20','파티 장치: 무적·부활·버티기·치유를 나와 반경 안 동료에게(먼 동료 빼고) · 부활은 쓰러진 동료만(rez) · 받는 쪽은 나에게 온 j3x만 · 무적 6초 상한 · 버티기 동안 생명력 1 아래로 안 떨어짐',()=>{
  qPrep('priest',{lvl:120});try{const {r,sent}=qPty(3,{dx:120});const r2=NET.peers.get('qa_peer2');r2.x=r2.tx=P.x+3000;
    sent.length=0;qOk(j3PartyInvuln(3,500,'시험')===1&&P.invT>=3,'무적');const mi=sent.filter(m=>m.t==='j3x'&&m.k==='inv');qOk(mi.length===1&&mi[0].to===r.id&&mi[0].d===3,'무적 메시지 '+JSON.stringify(mi));
    sent.length=0;qOk(j3PartyRevive(.5,500,'시험')===0&&!sent.some(m=>m.t==='rez'),'산 동료를 부활');r.dead=true;qOk(j3PartyRevive(.5,500,'시험')===1&&sent.some(m=>m.t==='rez'&&m.to===r.id&&m.p===.5),'쓰러진 동료 부활 메시지');r.dead=false;
    sent.length=0;P.hp=1;qOk(j3PartyHeal(.3,0,500)===1&&P.hp>1&&sent.some(m=>m.k==='heal'&&m.to===r.id),'치유');
    sent.length=0;P.invT=0;qOk(j3PartyFloor(5,500,'시험')===1&&P.buffs.j3floor&&sent.some(m=>m.k==='floor'&&m.to===r.id),'버티기');P.hp=30;hitPlayer(99999,null);qOk(P.hp===1&&!P.dead,'버티기인데 쓰러짐 '+P.hp);delete P.buffs.j3floor;P.hp=maxHp();
    P.invT=0;netOnMsg({t:'j3x',k:'inv',d:2,to:'someone',from:r.id});qOk(!(P.invT>0),'남에게 온 메시지를 받음');netOnMsg({t:'j3x',k:'inv',d:2,to:NET.id,from:r.id});qOk(P.invT>=2,'받은 무적');
    netOnMsg({t:'j3x',k:'inv',d:99,to:NET.id,from:r.id});qOk(P.invT<=6,'무적 상한 '+P.invT);P.hp=10;netOnMsg({t:'j3x',k:'heal',f:.5,a:0,to:NET.id,from:r.id});qOk(P.hp>10,'받은 치유');
    netOnMsg({t:'j3x',k:'floor',d:4,to:NET.id,from:r.id});qOk(P.buffs.j3floor&&P.buffs.j3floor.t===4,'받은 버티기');netOnMsg({t:'j3x',k:'nosuch',to:NET.id,from:r.id});netOnMsg({t:'j3x',from:r.id})}
  finally{qPtyOff();P.buffs={}}return '무적 · 부활 · 버티기 · 치유'});
qT('3차 전직 v20','스킬 창: 2차 전직 뒤 「3차」 탭(전직 전 잠김 · 배울 기술은 보임) · 3차 전직 뒤 갈래 이름 탭 · 칸에 점수/10 · 자세히에서 찍기 · 휴대폰 폭에 맞는 칸(auto-fill)',()=>qJ3Off(()=>{const r=[];
  for(const c of QCLS){const br3=JOB3_IDS[c][1];qPrep(c,{lvl:105});const id=qJ3Fake(c,br3);P.sp=5;openPanel('tree');qOk(!pbody.querySelector('[data-j2tab="j3"]'),'2차 전에 3차 탭');closePanel();P.job2=JOB2_OF3[br3];
    openPanel('tree');let b=pbody.querySelector('[data-j2tab="j3"]');qOk(b&&b.classList.contains('lk'),'잠긴 3차 탭 없음');b.click();qOk(J2UI.tab==='j3','탭');qOk(pbody.querySelector(`[data-node="${id}"]`),'기술 칸 없음');qOk(/3차 전직\(레벨 100/.test(pbody.textContent),'잠김 안내');
    qOk(pbody.querySelector(`.detail [data-learn="${id}"]`).disabled,'전직 전 찍힘');P.job3=br3;renderPanel();b=pbody.querySelector('[data-j2tab="j3"]');qOk(b&&!b.classList.contains('lk')&&b.textContent.includes(JOB3[c][br3].tree),'탭 이름 '+(b&&b.textContent));
    qClick(`#pbody [data-node="${id}"]`);qClick(`#pbody [data-learn="${id}"]`);qOk(P.sk[id]===1&&J2UI.tab==='j3','못 찍음');qOk(/1\/10/.test(pbody.querySelector(`[data-node="${id}"]`).textContent),'점수/10');
    qOk(getComputedStyle(pbody.querySelector('.j3rows')).gridTemplateColumns.split(' ').length>=1,'칸 배치');closePanel();qJ3Drop();r.push(JOB3[c][br3].tree)}
  const css=[...document.querySelectorAll('style')].map(x=>x.textContent).join('');qOk(/\.j3rows\{grid-template-columns:repeat\(auto-fill/.test(css),'휴대폰 폭 칸 CSS');return r.join(' · ')}));
qT('3차 전직 v20','갈래 바꾸기(3차 뒤): 값 200,000+(레벨−100)×5,000 · 금화가 모자라면 안 됨 · 2·3차 점수를 함께 돌려받음 · 3차 갈래도 함께 바뀜 · 1차 점수는 그대로 · 전직관 글',()=>qJ3Off(()=>{
  qPrep('warrior',{lvl:120});P.job2='guardian';P.job3='bulwark';const a=qJ3Fake('warrior','bulwark'),j2=J2_SPELLS.find(id=>SPELLS[id].job2==='guardian'&&SPELLS[id].kind!=='passive');P.sk[a]=6;P.sk[j2]=4;P.sk.slash=5;P.bar[0]=a;P.bar[1]='slash';P.sp=2;
  qOk(job3SwapPrice()===200000+20*5000,'값 '+job3SwapPrice());P.gold=job3SwapPrice()-1;qOk(!job2Swap('berserker')&&P.job2==='guardian'&&P.job3==='bulwark','금화가 모자란데 바뀜');
  SQV.mode='npc';SQV.npc=sqFolk('j2_warrior');openPanel('quest');qOk(/3차 갈래도 함께/.test(pbody.textContent)&&pbody.textContent.includes(job3SwapPrice().toLocaleString()),'전직관 글');closePanel();
  P.gold=job3SwapPrice()+9;qOk(job2Swap('berserker'),'못 바꿈');qOk(P.job2==='berserker'&&P.job3==='warlord','갈래 '+P.job2+'/'+P.job3);qOk(P.gold===9,'금화 '+P.gold);qOk(P.sp===2+6+4,'돌려받은 점수 '+(P.sp-2));qOk(P.sk.slash===5&&!P.sk[a]&&!P.sk[j2],'점수');qOk(P.bar[0]===null&&P.bar[1]==='slash','단축칸');
  qOk(job2Title()===JOB3.warrior.warlord.title,'칭호 '+job2Title());return `레벨 120 값 ${job3SwapPrice().toLocaleString()} · 10점 돌려받음`}));
qT('3차 전직 v20','갈래 상징 유니크 8개: 전설 · 레벨 100 · 그 직업 · 「3차 계열 +1」(그 갈래 기술 레벨 +1) · 이름·이야기',()=>qJ3Off(()=>{const r=[];
  for(const k in J3U){const u=J3U[k],br=k.slice(3);qOk(JOB3[u.cls][br],k+' 갈래');qPrep(u.cls,{lvl:100});const it=j3MakeUniq(k);qOk(it&&it.rar===4&&it.il===100&&it.cls===u.cls&&it.stats['tr_j3_'+br]===1&&it.j3u===k,k+' '+JSON.stringify(it&&it.stats));
    qOk(it.name===u.n&&u.lore&&Object.keys(it.stats).length>=3,'이름·옵션');P.job2=JOB2_OF3[br];P.job3=br;const id=qJ3Fake(u.cls,br);P.sk[id]=3;const s0=skShow(id);P.gear[it.slot]=it;qOk(skShow(id)===s0+1,`${it.name}: +1 안 붙음 (${s0}→${skShow(id)})`);P.gear[it.slot]=null;qJ3Drop();r.push(it.name)}
  return r.join(' · ')}));
qT('3차 전직 v20','의뢰 「재로 쓴 이름」(4직업): 85레벨 악몽 이상 엘가로스 → 92 지옥에서만 열리는 숨은 곳(수호자) → 96 지옥 엘가로스(재의 열쇠 · 봉인문) → 100 내 갈래의 시험만 → 3차 전직 · 스킬 포인트 4(한 번) · 갈래 상징 → 120 왕도 → 135 재의 군주 첫 처치 +2(한 번) · 「3차」 표',()=>{const r=[];
  QCLS.forEach((c,ci)=>{const p=J3_PFX[c],br2=JOB2_IDS[c][ci%2],br3=JOB3_OF[br2];qPrep(c,{lvl:84});P.invT=1e9;P.diff=0;const S=()=>sqState();
    const q0=SQBY[`j3${p}0`];qOk(q0&&sqAvail(q0)==='hidden','2차 전에 보임');P.job2=br2;qOk(sqAvail(q0)==='low','84레벨 '+sqAvail(q0));P.lvl=85;qOk(sqAvail(q0)==='ok','85레벨에 안 열림 '+sqAvail(q0));
    const g=sqFolk(J3_GIVER[c]);qOk(g&&sqMark(g)==='!','전직관 ! 없음');sqAccept(q0.id);qOk(S().a[q0.id]&&sqTarget(q0),'못 받음 / 목표 자리 없음');
    qOk(sqHudBlocks().some(b=>b.j3&&/qtg j3/.test(b.t)),'알림판 3차 표');
    const kill=()=>{const e=dgMob('b_elgaros',P.x+120,P.y,90);e.dead=true;questKill(e);qStep(2,{render:false})};// 엘가로스는 던전 보스라 바깥에서는 처치 기록(questKill)만 부른다
    kill();qOk(!sqGoalDone(q0,0),'보통에서 셈');P.diff=1;kill();qOk(sqGoalDone(q0,0),'악몽에서 안 셈');sqFinish(q0.id);qOk(S().d[q0.id],'0단계 못 끝냄');
    const q1=SQBY[`j3${p}1`];P.lvl=92;sqAccept(q1.id);qOk(S().a[q1.id],'1단계 못 받음');const sp=J3SPOT[c];qOk(sp&&sqTarget(q1)&&sqTarget(q1).reg===sp.reg,'숨은 곳 목표');
    const dec=RCACHE[sp.reg].decor.find(d=>d.use==='j3hide_'+c);qOk(dec&&dec.qonly,'입구 없음');qOk(!sqUseLive(dec),'악몽에서 입구가 열림');P.diff=2;qOk(sqUseLive(dec),'지옥에서 입구가 안 열림');
    sqUse(dec);qOk(DG&&DG.j3t&&DG.j3t.hide===c&&DG.ci>=900,'숨은 곳에 못 들어감');const e1=DG.j3t.e;qOk(e1&&e1.k===J3_HIDE[c].bk&&e1.lvl===95,'수호자');qStep(30,{render:true});hurtE(e1,e1.hp+10,QA_J2HIT);qStep(3,{render:false});
    qOk(DG.j3t.res===1&&sqGoalDone(q1,0)&&DG.portals.length>=2,'수호자를 쓰러뜨려도 안 채워짐');leaveDungeon();sqFinish(q1.id);qOk(S().d[q1.id],'1단계 못 끝냄');
    const q2=SQBY[`j3${p}2`];P.lvl=96;sqAccept(q2.id);P.diff=1;kill();qOk(!sqGoalDone(q2,0),'악몽에서 열쇠');qOk(!J3Q.sealOpen(),'봉인문이 먼저 열림');P.diff=2;kill();sqFinish(q2.id);qOk(J3Q.sealOpen()&&J3Q.stage()===3,'봉인문 안 열림 '+J3Q.stage());
    const qa=J3_QUESTS.find(q=>q.cls===c&&q.st===3&&q.pick3===br3),qb=J3_QUESTS.find(q=>q.cls===c&&q.st===3&&q.pick3!==br3);qOk(sqAvail(qb)==='hidden','다른 갈래 시험이 보임');qOk(sqAvail(qa)==='low','96레벨에 시험 '+sqAvail(qa));
    P.lvl=100;sqAccept(qa.id);qOk(J3Q.trialOpen()&&sqTarget(qa),'시험 목표 없음');SQV.mode='npc';SQV.npc=g;openPanel('quest');const tb=pbody.querySelector('[data-j3trial]');qOk(J3Q.trialAt||tb,'전직관에 시험의 방 단추 없음');if(tb&&!J3Q.trialAt)tb.click();else{closePanel();J3Q.enterTrial()}
    qOk(DG&&DG.j3t&&DG.j3t.bk==='t3_'+br3,'시험의 방에 못 들어감');qOk(qJ3Win()===1,'시험을 못 이김');leaveDungeon();const sp0=P.sp,l0=P.lvl,bag0=P.bag.length;sqFinish(qa.id);
    qOk(P.job3===br3,'3차 전직 안 됨');qOk(P.sp-sp0===4+qSpLv(l0,P.lvl),`스킬 포인트 +${P.sp-sp0} (레벨 ${l0}→${P.lvl})`);qOk(P.bag.length===bag0+1&&P.bag.some(it=>it.j3u==='j3_'+br3),'갈래 상징 없음');qOk(job2Title()===JOB3[c][br3].title,'칭호');
    delete S().d[qa.id];S().a[qa.id]={c:{g0:1},got:[]};const sp1=P.sp,l1=P.lvl;sqFinish(qa.id);qOk(P.sp-sp1===qSpLv(l1,P.lvl),'점수를 두 번 받음');qOk(J3Q.stage()===4,'단계 '+J3Q.stage());
    const q4=SQBY[`j3${p}4`];P.lvl=119;qOk(sqAvail(q4)==='low','119에 왕도');P.lvl=120;sqAccept(q4.id);qOk(!J3Q.capitalOpen(),'왕도가 먼저 열림');J3Q.onChoirBossKill({});qOk(sqGoalDone(q4,0),'성가대 무덤 주인 처치가 안 셈');sqFinish(q4.id);qOk(J3Q.capitalOpen()&&J3Q.stage()===5,'왕도 안 열림');
    const q5=SQBY[`j3${p}5`];P.lvl=135;sqAccept(q5.id);const sp2=P.sp;qOk(J3Q.onAshLordKill({})===true&&P.sp===sp2+2,'재의 군주 첫 처치 +2');qOk(sqGoalDone(q5,0),'재의 군주 목표');qOk(!J3Q.onAshLordKill({})&&P.sp===sp2+2,'+2를 두 번 받음');
    sqFinish(q5.id);qOk(J3Q.stage()===6,'끝 단계 '+J3Q.stage());openPanel('quest');closePanel();r.push(`${QCN[c]} ${JOB3[c][br3].n}`)});
  return r.join(' · ')+' · 퀘스트 스킬 포인트 4+2'});
qT('3차 전직 v20','시험의 방 8개: 혼자 깰 수 있음(기믹을 풀면 쓰러짐) · 방패(끝까지 외운 마법으로 깨짐) · 소환수 빼앗기 · 가짜 셋(낙인) · 순례자 3분(저주 · 치유로 일으키기) · 피난민(몹이 노림 · 도발) · 환영 기사 100 · 하늘(멀리서) · 짐승(눈 가리기) · 이기면 목표·문 · 나가면 정리',()=>{const r=[];
  for(const c of QCLS)for(const br3 of JOB3_IDS[c]){qPrep(c,{lvl:100});P.invT=1e9;P.job2=JOB2_OF3[br3];const p=J3_PFX[c],q=J3_QUESTS.find(q=>q.cls===c&&q.pick3===br3);sqState().d[`j3${p}2`]=1;sqAccept(q.id);qOk(sqState().a[q.id],'의뢰 못 받음 '+q.id);
    qOk(J3Q.enterTrial(),br3+' 못 들어감');const T=DG.j3t,G=T.g,e=T.e,t=TYPES['t3_'+br3];qOk(G===t.g&&DG.rooms.length===1&&DG.portals.length===1&&DG.ci>=900,'방');qOk(!e||e.lvl===100,'보스 레벨');qStep(20,{render:true});
    if(G==='shield'){qOk(e.j3sh&&j3DmgK(e,QA_J2HIT,P)===.12,'방패 배율');const cid=qSpells(c,s=>castTimeOf(s.id)>0&&s.mult>0&&!s.job2&&!s.job3&&!s.tab)[0].id;P.sk[cid]=10;qCast(cid,e);
      qOk(!e.j3sh&&j3DmgK(e,QA_J2HIT,P)===1.15&&e.stg>0,`${SPELLS[cid].n}을 끝까지 외워도 방패가 안 깨짐`);T.shT=0;qStep(1,{render:false});qOk(e.j3sh,'방패가 다시 안 생김')}
    if(G==='steal'){qOk(j3DmgK(e,QA_J2HIT,P)===.3,'그림자 갑옷');const sid=qSpells(c,s=>s.kind==='summon'&&!s.job2&&!s.job3&&!s.tab)[0].id;P.sk[sid]=10;qCast(sid,qAt(0,60));P.cd[sid]=0;qCast(sid,qAt(0,80));const n=j3MySummons();qOk(n>=1,'소환수 없음');
      if(n>=2)qOk(j3DmgK(e,QA_J2HIT,P)===1,'소환수 둘인데 갑옷');T.stl=0;qStep(1,{render:false});qOk(j3MySummons()===n-1&&enemies.some(o=>o.j3stl),'빼앗기 안 됨')}
    if(G==='clones'){qOk(T.cl.length===3&&T.cl.filter(o=>o.j3cl===2).length===1&&T.cl.includes(e),'셋 중 진짜 하나');qOk(j3DmgK(e,QA_J2HIT,P)===.25,'숨은 진짜 배율');const f=T.cl.find(o=>o.j3cl===1);hurtE(f,1,Object.assign({},QA_J2HIT,{mark:1}));qOk(f.dead,'낙인 맞은 가짜가 안 흩어짐');
      hurtE(e,1,Object.assign({},QA_J2HIT,{mark:1}));qOk(e.j3rev>0&&j3DmgK(e,QA_J2HIT,P)===1.2,'낙인이 진짜를 안 비춤');
      const f2=T.cl.find(o=>o.j3cl===1&&!o.dead);if(f2){loot=[];const xp0=P.xp,l0=P.lvl;hurtE(f2,f2.hp*2+10,QA_J2HIT);qOk(f2.dead&&!loot.some(l=>l.kind==='item')&&P.xp===xp0&&P.lvl===l0,'가짜가 전리품·경험치를 줌')}}
    if(G==='pilgrims'){qOk(T.npcs.length===5&&T.npcs.every(a=>a.j3pil&&!a.down)&&T.npcs.every(a=>allies.includes(a)),'순례자 다섯');const m=j3Mob('t3_wisp',P.x+200,P.y);qOk(T.npcs.includes(enemyTarget(m).tg),'몹이 순례자를 안 노림');
      T.t=60.5;qStep(1,{render:false});qOk(T.npcs.filter(a=>a.down).length===2,'저주에 둘이 안 쓰러짐');qStep(2,{render:true});for(const a of T.npcs)if(a.down){a.x=P.x+20;a.y=P.y}healP(maxHp()*.7);qOk(T.npcs.every(a=>!a.down),'치유로 안 일어남')}
    if(G==='refugees'){const ref=T.npcs[0];qOk(ref&&ref.ref,'피난민');const m=enemies.find(o=>o.j3m);qOk(m&&enemyTarget(m).tg===ref,'군단이 피난민을 안 노림');clsFx(m,{taunt:5},P,P);if(typeof PTY==='object'&&PTY.taunt)PTY.taunt(m,0,5);qOk(enemyTarget(m).tg!==ref,'도발해도 피난민을 노림')}
    if(G==='hundred')qOk(T.need===100&&!T.e,'환영 기사 100');
    if(G==='sky'){qOk(j3DmgK(e,QA_J2HIT,{x:e.x+500,y:e.y})===1&&j3DmgK(e,QA_J2HIT,{x:e.x+100,y:e.y})===.3,'거리 배율');T.swoop=0;qStep(1,{render:false});qOk(e.j3gnd>0&&j3DmgK(e,QA_J2HIT,P)===1.4,'내려앉기')}
    if(G==='beast'){const trap=Object.assign({},QA_J2HIT,{kind:'trap'});qOk(j3DmgK(e,trap,P)===.1&&j3DmgK(e,QA_J2HIT,P)===.35,'눈뜬 짐승');T.nightT=6;qOk(j3DmgK(e,trap,P)===1.25,'밤에 덫');T.nightT=0;e.blindT=2;qOk(j3DmgK(e,trap,P)===1.25,'눈먼 짐승');e.blindT=0;T.night=0;qStep(1,{render:false});qOk(T.nightT>0,'밤이 안 옴')}
    qOk(qJ3Win()===1,t.n+': 못 이김');if(G==='hundred')qOk(T.k>=100,'환영 기사 '+T.k);qOk(sqGoalDone(q,0),'목표 안 채워짐');qOk(DG.portals.length>=2,'나가는 문');qStep(2,{render:true});leaveDungeon();qOk(!DG&&!allies.some(a=>a.j3n),'정리 안 됨');r.push(t.n)}
  // 실패: 순례자 모두 · 피난민
  qPrep('priest',{lvl:100});P.invT=1e9;P.job2='archbishop';sqState().d.j3p2=1;const qs=J3_QUESTS.find(q=>q.pick3==='saint');sqAccept(qs.id);J3Q.enterTrial();for(const a of DG.j3t.npcs)a.hp=0;qStep(3,{render:false});qOk(DG.j3t.res===-1&&!sqGoalDone(qs,0),'순례자 모두 쓰러져도 실패 아님');leaveDungeon();
  qPrep('warrior',{lvl:100});P.invT=1e9;P.job2='guardian';sqState().d.j3w2=1;const qw=J3_QUESTS.find(q=>q.pick3==='bulwark');sqAccept(qw.id);J3Q.enterTrial();DG.j3t.npcs[0].hp=0;qStep(3,{render:false});qOk(DG.j3t.res===-1,'피난민이 무너져도 실패 아님');leaveDungeon();
  qPrep('mage',{lvl:99});P.job2='archmage';sqState().d.j3m2=1;const qm=J3_QUESTS.find(q=>q.pick3==='archsorcerer');P.lvl=100;sqAccept(qm.id);P.lvl=99;qOk(!J3Q.enterTrial()&&!DG,'99레벨에 들어감');P.lvl=100;NET.guest=true;try{qOk(!J3Q.enterTrial()&&!DG,'참가자가 혼자 들어감')}finally{NET.guest=false}
  return r.join(' · ')});
qT('3차 전직 v20','같이 하기: 방장의 시험의 방을 참가자도 같은 모양으로(netDgData → netEnterDg) · 순례자 위치를 보냄(j3x tn) · 통과하면 같은 시험 의뢰를 가진 참가자도 통과(trw) · 참가자 피해(dmg)에 기믹 배율',()=>{
  qPrep('priest',{lvl:100});P.invT=1e9;P.job2='archbishop';sqState().d.j3p2=1;const q=J3_QUESTS.find(q=>q.pick3==='saint');
  try{const {r,sent}=qPty(2,{host:true});sqAccept(q.id);qOk(J3Q.enterTrial(),'방장이 못 들어감');const D=JSON.parse(JSON.stringify(netDgData()));qOk(D.j3&&D.j3.bk==='t3_saint','방 정보 없음');const g1=DG.g.join(','),n1=DG.walls.length;
    sent.length=0;qStep(15,{render:false});const tn=sent.find(m=>m.t==='j3x'&&m.k==='tn');qOk(tn&&tn.a.length===5,'순례자 위치를 안 보냄');leaveDungeon();
    NET.host=false;NET.guest=true;NET.hostId=r.id;netEnterDg(D);qOk(DG&&DG.j3t&&DG.j3t.guest&&DG.g.join(',')===g1&&DG.walls.length===n1,'참가자 방 모양이 다름');
    netOnMsg(Object.assign({},tn,{from:r.id}));qOk(DG.j3t.npcs.length===5,'참가자 화면 순례자');qStep(3,{render:true});
    netOnMsg({t:'j3x',k:'trw',bk:'t3_saint',from:r.id});qOk(sqGoalDone(q,0),'파티 통과가 참가자 의뢰에 안 들어감');leaveDungeon();qPtyOff();
    qPrep('mage',{lvl:100});P.invT=1e9;P.job2='archmage';sqState().d.j3m2=1;const qm=J3_QUESTS.find(q=>q.pick3==='archsorcerer');const p2=qPty(2,{host:true});sqAccept(qm.id);J3Q.enterTrial();const e=DG.j3t.e;e.id=e.id||++NET.eid;const h0=e.hp;
    netOnMsg({t:'dmg',id:e.id,a:1000,from:p2.r.id});qOk(Math.abs((h0-e.hp)-120)<=2,'참가자 피해에 방패 배율이 없음 '+(h0-e.hp));leaveDungeon()}
  finally{qPtyOff()}return '방 모양 · 순례자 · 통과 · 피해 배율'});
qT('3차 전직 v20','저장: job3 왕복 · v19 저장(2차 100레벨, job3 칸 없음) → job3 null · 그대로 3차 의뢰 · 망가진/맞지 않는 job3 → 전직 안 함(원래 값은 다시 저장) · 물약 칸 거울 pot._j3(레벨·경험치·갈래·3차 점수·끝낸 단계)로 예전 판(v19)이 자른 레벨을 되살림',()=>qJ3Off(()=>{qResetStore();
  qPrep('warrior',{lvl:120,slot:QA_SLOT});P.job2='guardian';P.job3='bulwark';P.xp=777;const id=qJ3Fake('warrior','bulwark');P.sk[id]=6;P.sp=3;sqState().d.j3w0=1;sqState().d.j3w1=1;save();const d=readSlot(QA_SLOT);
  qOk(d.job3==='bulwark'&&d.lvl===120,'저장 '+d.job3+d.lvl);const M=d.pot._j3;qOk(M&&M.l===120&&M.j==='bulwark'&&M.x===777&&M.s&&M.s[id]===6&&M.d&&M.d.includes('j3w1'),'거울 '+JSON.stringify(M));
  qPrep('mage',{lvl:10});qOk(load(JSON.parse(JSON.stringify(d)),QA_SLOT),'load');qOk(P.lvl===120&&P.job3==='bulwark'&&P.job2==='guardian'&&P.xp===777&&P.sk[id]===6&&P.sp===3,'왕복 '+[P.lvl,P.job3,P.xp,P.sk[id],P.sp]);
  const s1=JSON.stringify(saveData());load(JSON.parse(s1),QA_SLOT);qOk(JSON.stringify(saveData())===s1,'두 번째 왕복이 다름');
  // 예전 판(v19)이 불러와 다시 저장한 모양: 레벨 100으로 자름 · job3 칸 없음 · 모르는 3차 기술 점수는 스킬 포인트로 돌려줌 · 의뢰 기록에서 3차 의뢰를 버림 · 물약 칸은 그대로
  const old=JSON.parse(JSON.stringify(d));old.lvl=100;old.xp=0;delete old.job3;delete old.sk[id];old.sp=3+6;if(old.sq&&old.sq.d){delete old.sq.d.j3w0;delete old.sq.d.j3w1}
  qPrep('mage',{lvl:10});qOk(load(old,QA_SLOT),'load v19');qOk(P.lvl===120&&P.xp===777&&P.job3==='bulwark'&&P.job2==='guardian','레벨/갈래를 못 되살림 '+[P.lvl,P.xp,P.job3]);qOk(P.sk[id]===6&&P.sp===3,`3차 점수 ${P.sk[id]} · sp ${P.sp}`);qOk(sqState().d.j3w0&&sqState().d.j3w1&&sqState().d.j3w3a,'끝낸 단계');
  const bad=JSON.parse(JSON.stringify(old));bad.lvl=80;qPrep('mage',{lvl:10});load(bad,QA_SLOT);qOk(P.lvl===80&&P.job3===null,'100이 아닌 저장에 거울을 씀 '+P.lvl);
  const bad2=JSON.parse(JSON.stringify(old));bad2.pot._j3.l=999;qPrep('mage',{lvl:10});load(bad2,QA_SLOT);qOk(P.lvl===100,'말이 안 되는 거울 레벨 '+P.lvl);
  // v19 2차 저장
  const v19=Object.assign(JSON.parse(JSON.stringify(QA_V19MG)),{lvl:100,xp:5,job2:'summoner',job2n:1,trial:7,qsp:{j2m1:1},sk:{spark:5},sp:4,pot:{hp:3,mp:3,_j2:{q:['j2m1'],j:'summoner',n:1,t:7}},sq:{a:{},d:{j2m1:1},cd:{}}});delete v19.skOld;
  qPut('arseia-char-3',v19);const d3=readSlot(3);qOk(load(d3,3),'v19 load');qOk(P.lvl===100&&P.job2==='summoner'&&P.job3===null&&P.sp===4&&P.sk.spark===5,'v19 값 '+[P.lvl,P.job2,P.job3,P.sp]);qOk(!P.pot._j3&&saveData().job3===null,'새 칸');qOk(sqAvail(SQBY.j3m0)==='ok','3차 의뢰를 못 받음 '+sqAvail(SQBY.j3m0));
  // 망가진 · 맞지 않는 job3
  for(const [j2,j3,lv] of [['archmage','nosuch',120],['archmage','spiritking',120],['archmage','archsorcerer',90],[null,'archsorcerer',120]]){const x=JSON.parse(JSON.stringify(v19));x.job2=j2;x.job3=j3;x.lvl=lv;x.pot={hp:1,mp:1};qPrep('priest',{lvl:10});qOk(load(x,3),'load');
    qOk(P.job3===null&&saveData().job3===j3,`${j2}/${j3}/${lv}: ${P.job3} · 다시 저장 ${saveData().job3}`)}
  return 'Lv120 → (v19 100) → Lv120 · 3차 점수·단계 되살림'}));
qT('3차 전직 v20','마나: 3차 기술 마나는 찍은 점수로 셈(1점마다 +5%, 피해처럼 ×1.2·×2로 커지지 않음) · 130레벨에서 채널링이 아닌 3차 기술은 같은 직업 2차 기술(20점) 가장 비싼 것보다 비싸지 않음',()=>{const r=[];
  for(const c of QCLS){qPrep(c,{lvl:130});let j2=0;
    for(const br of JOB2_IDS[c]){P.job2=br;for(const id in SPELLS){const s=SPELLS[id];if(s.cls!==c||s.job2!==br||!(s.cost>0))continue;const o=P.sk[id];P.sk[id]=20;j2=Math.max(j2,costOf(id));P.sk[id]=o}}
    let n=0,top=0,topId='';const mc=1-Math.min(.4,stat('mcost')/100);
    for(const br3 of JOB3_IDS[c]){qJob3On(br3);for(const id in SPELLS){const s=SPELLS[id];if(s.cls!==c||s.job3!==br3||!(s.cost>0))continue;const o=P.sk[id];P.sk[id]=10;const k=costOf(id);P.sk[id]=o;n++;
      const want=Math.max(1,Math.round(s.cost*(1+130*.05)*(1+.05*9)*mc));qOk(Math.abs(k-want)<=1,`${s.n} 마나 ${k} (찍은 10점이면 ${want})`);
      if(!chanOf(id)){qOk(k<=j2,`${s.n} 마나 ${k} > 2차 가장 비싼 ${j2}`);if(k>top){top=k;topId=s.n}}}}
    qOk(n>=20,`${c} 3차 기술 ${n}개`);r.push(`${c} 3차 최고 ${top}(${topId}) ≤ 2차 ${j2}`)}
  return r.join(' · ')});
qT('3차 전직 v20','J3Q (WORLD가 부름): stage · sealOpen · capitalOpen · trialOpen · enterTrial · onChoirBossKill · onAshLordKill(첫 처치 +2 한 번) · trialAt · 의뢰 없을 때 안내 · 도감에 숨은 곳·시험의 방',()=>{
  qPrep('archer',{lvl:100});for(const k of ['stage','sealOpen','capitalOpen','trialOpen','enterTrial','onChoirBossKill','onAshLordKill'])qOk(typeof J3Q[k]==='function',k);qOk(window.J3Q===J3Q,'window.J3Q');
  qOk(J3Q.stage()===0&&!J3Q.sealOpen()&&!J3Q.capitalOpen()&&!J3Q.trialOpen(),'처음 값');qOk(!J3Q.enterTrial()&&!DG,'의뢰 없이 들어감');P.job2='hawkeye';P.job3='divinearcher';qOk(J3Q.stage()===4&&J3Q.sealOpen(),'3차 뒤 단계 '+J3Q.stage());
  const sp=P.sp;qOk(J3Q.onAshLordKill({})&&P.sp===sp+2&&!J3Q.onAshLordKill({})&&P.sp===sp+2,'첫 처치 +2 한 번');J3Q.onChoirBossKill({});
  const G=cxGroups();qOk(G.some(g=>/숨은 곳/.test(g[0])&&g[1].length===4)&&G.some(g=>/시험의 방/.test(g[0])&&g[1].length>=8),'도감 묶음');qOk(monInfo('t3_saint').lv===100,'도감 정보');return 'API 7개'});
/* ===== v20 (MAGEPRI): 3차 전직 마법사·사제 스킬 (대마법사 · 정령왕의 계약자 · 빛의 집행자 · 성자) — 새 효과마다 ===== */
const QMP='3차 전직 v20 (마법사·사제)',QMP_SPOT={x:1500,y:3500};// 둘레 600이 탁 트인 곳 (QA_SPOT 동쪽에는 바위가 있어 밀고 당기는 점검이 막힌다)
// 그 기술의 3차 갈래로 전직한 130레벨 캐릭터 (점수 10 = 실제 레벨 11.8)
function qMPOn(id,pts){const s=SPELLS[id];if(!s||!s.job3)return;P.job2=JOB2_OF3[s.job3];P.job3=s.job3;if(P.lvl<s.upLv)P.lvl=s.upLv;P.sk[id]=pts||10;qMana(id);P.mp=maxMp()}
function qMPPrep(cls,ids,o){o=o||{};qPrep(cls,{lvl:130});P.st.spi+=400;for(const id of [].concat(ids||[]))qMPOn(id,o.pts);P.hp=maxHp();P.mp=maxMp();P.invT=o.hurt?0:1e9;P.x=QMP_SPOT.x;P.y=QMP_SPOT.y;followCam();return P}
const qMPMob=(k,x,y,o)=>{o=o||{};const e=dgMob(k,x,y,o.lvl||120);e.hp=e.max=o.hp||1e7;e.atkCd=1e9;e.skT=1e9;e.dmg=0;e.id=++NET.eid;if(o.aggro)e.aggroed=true;return e};
const qMPBoss=(x,y)=>{const e=qMPMob('b_arsil',x,y);e.spd0=e.spd;return e};
// 피해를 엿본다: fn(e,amt,s)
function qMPSpy(fn,body){const keep=hurtE;hurtE=function(e,a,s){try{fn(e,a,s)}catch(_){}return keep.apply(this,arguments)};try{return body()}finally{hurtE=keep}}
const qMPstep=(n,o)=>qStep(n,Object.assign({render:false,each:()=>{P.mp=maxMp()}},o||{}));

qT(QMP,'44개: 갈래마다 11개(20~30위계) · 패시브는 갈래마다 1개(20% 미만) · 한국어 이름·설정 이름·대사 · 금빛 테두리 아이콘 · 쓰는 방식 표시 · 3차 계열 · 열리는 레벨',()=>{const bad=[];let pas=0;
  qOk(J3MP_SPELLS.length===44,'개수 '+J3MP_SPELLS.length);
  for(const br of J3MP_BR){const ids=J3MP_SPELLS.filter(id=>SPELLS[id].job3===br);if(ids.length!==11)bad.push(br+' '+ids.length+'개');
    const rk=ids.map(id=>SPELLS[id].rank).sort((a,b)=>a-b).join(',');if(rk!=='20,21,22,23,24,25,26,27,28,29,30')bad.push(br+' 위계 '+rk);
    for(const id of ids){const s=SPELLS[id];if(TREE[id]!=='j3_'+br)bad.push(id+' 계열 '+TREE[id]);if(!(s.upLv>=100))bad.push(id+' 열리는 레벨 '+s.upLv);if(s.job2)bad.push(id+' job2');
      if(!/[가-힣]/.test(s.n)||!/[가-힣]/.test(s.kn||'')||!/[가-힣]/.test(s.desc||''))bad.push(id+' 한국어 이름·설명');
      const svg=spellSvg(s);if(!/#e8c35a/.test(svg))bad.push(id+' 금빛 테두리');
      if(s.kind==='passive'){pas++;if(CMARK.kind(id)!=='')bad.push(id+' 패시브 표시');continue}
      if(!SKILL_LINES[id])bad.push(id+' 대사');
      const want=CAST_T[id]?'cast':(chanOf(id)||s.charge)?'chan':'inst';if(CMARK.kind(id)!==want)bad.push(id+` 표시 ${CMARK.kind(id)}≠${want}`)}}
  qOk(pas/J3MP_SPELLS.length<.2,`패시브 ${pas}개`);qOk(!bad.length,bad.slice(0,10).join(', '));
  const ids=new Set(Object.keys(SPELLS));qOk(ids.size===Object.keys(SPELLS).length,'id 겹침');
  return `44개 · 패시브 ${pas}개(${Math.round(pas/44*100)}%) · 시전 ${J3MP_SPELLS.filter(id=>CAST_T[id]).length} · 채널링 ${J3MP_SPELLS.filter(id=>chanOf(id)).length} · 모으기 ${J3MP_SPELLS.filter(id=>SPELLS[id].charge).length}`});
qT(QMP,'대상 표시: 파티(주변)/한 명/자신만이 붙음 · 지원 기술은 모두 표시가 있음',()=>{const bad=[],out={area:0,one:0,self:0};
  for(const id of J3MP_SPELLS){const s=SPELLS[id];if(s.kind==='passive')continue;const r=PUI.rule(s);
    if(s.j3t){const want=s.j3t;if(!r||r.mode!==want)bad.push(`${id}: ${r?r.mode:'없음'}≠${want}`);else out[want]++;continue}
    if(['heal','hot','shield','buff','ward','rez'].includes(s.kind)||(s.kind==='field'&&s.heal)){if(!r)bad.push(id+': 표시 없음');else out[r.mode]=(out[r.mode]||0)+1}}
  for(const id of ['manaflux','wardspirit','atonelight','consecrate','martyrprayer','saintmiracle','saintmarch','sanctumfield','elemrelease','condemnfield','grandrez'])if(!PUI.rule(SPELLS[id])||!PUI.rule(SPELLS[id]).party)bad.push(id+' 파티 아님');
  for(const id of ['sainttouch','lightpath','graceaccel','lifeswap'])if(!PUI.rule(SPELLS[id])||PUI.rule(SPELLS[id]).mode!=='one')bad.push(id+' 한 명 아님');
  qOk(!bad.length,bad.join(', '));return `파티 ${out.area} · 한 명 ${out.one} · 자신만 ${out.self}`});

/* --- 대마법사 --- */
qT(QMP,'원소 사중탄: 구슬 넷이 불·얼음·번개·대지 차례로 맞음 (느려짐까지)',()=>{qMPPrep('mage','quadorb');const e=qDummy(P.x+220,P.y);const els=[];
  qMPSpy((o,a,s)=>{if(o===e&&s&&s.id==='quadorb')els.push(s.el)},()=>{qOk(qCast('quadorb',{x:e.x,y:e.y}),'시전 안 됨');qMPstep(90)});
  const u=[...new Set(els)];qOk(['fire','ice','storm','earth'].every(k=>u.includes(k)),'맞은 원소 '+els.join(','));qOk(e.slowT>0||e.freezeT>0,'얼음 구슬 느려짐 없음');qClear();return els.join('→')});
qT(QMP,'금서의 이해: 금기 마법 시전 시간 -20%(10점) · 원소 공명 6중첩까지',()=>{qMPPrep('mage',['forbidblaze','quadorb']);const t0=castTimeOf('forbidblaze');
  qMPOn('forbiddenlore');passT=-1;P.cd={};tryCast('forbidblaze',qAt(0,200));const t1=CAST.cur?CAST.cur.max:castTimeOf('forbidblaze');castStop();
  qOk(Math.abs(t0-1.5)<1e-6&&Math.abs(t1-1.2)<.011,`시전 ${t0}→${t1} (1.5→1.2)`);
  const e=qDummy(P.x+200,P.y);const go=el=>{J2R.el=el;J2R.t=8;qCast('quadorb',{x:e.x,y:e.y});return J2R.n};J2R.n=4;const a=go('ice'),b=go('ice'),c=go('ice');
  P.sk.forbiddenlore=0;passT=-1;J2R.n=4;const d=go('ice');P.sk.forbiddenlore=10;passT=-1;
  qOk(a===5&&b===6&&c===6,`공명 ${a}/${b}/${c}`);qOk(d===4,`패시브 없이 ${d}`);J2R.n=0;qClear();return `시전 ${t0}→${t1}초 · 공명 4→${a}→${b}(최대) · 패시브 없으면 4`});
qT(QMP,'금기: 불바다 — 반경 380 불길 10초 → 다 탄 자리는 잿더미(8초, 위의 적이 느려짐)',()=>{qMPPrep('mage','forbidblaze');const e=qDummy(P.x+250,P.y);
  qOk(qCast('forbidblaze',{x:e.x,y:e.y}),'시전 안 됨');const f=fields.find(f=>f.s&&f.s.id==='forbidblaze');qOk(f&&Math.round(f.rad)>=380,'불길 반경 '+(f&&f.rad));
  qMPstep(Math.ceil(f.max*60)+10);qOk(e.taken>0,'피해 0');const g=MPJ.grounds.find(g=>g.kind==='ash');qOk(g&&g.t>6,'잿더미 없음');
  const w=qMPMob('wolf',g.x+20,g.y);w.slowT=0;let sl=0;qMPstep(60,{each:()=>{P.mp=maxMp();sl=Math.max(sl,w.slowT||0)}});qOk(sl>0,'잿더미 위 적이 안 느려짐');/* v21: 느려짐은 확률로 걸리므로 1초 동안 한 번이라도 */render();qClear();MPJ.grounds.length=0;return `피해 ${Math.round(e.taken)} · 잿더미 반경 ${Math.round(g.rad)}`});
qT(QMP,'원소 해방: 장판(450) 안의 적은 표식(받는 피해 +)과 원소 약점 · 장판 안의 나에게 「원소 해방」 표시',()=>{qMPPrep('mage','elemrelease');const e=qDummy(P.x+200,P.y);
  qOk(qCast('elemrelease',{x:P.x+100,y:P.y}),'시전 안 됨');qMPstep(40);qOk(e.markT>0&&e.markAmp>0,'표식 없음');qOk(e.j3nores>0,'약점 없음');qOk(P.buffs._j3er,'내 표시 없음');
  const f=fields.find(f=>f.s&&f.s.id==='elemrelease');qOk(f&&f.rad>=450,'반경');qClear();return `표식 +${Math.round(e.markAmp*100)}% · 반경 ${Math.round(f.rad)}`});
qT(QMP,'금기: 대해일 — 일반 몬스터는 물벽에 실려 물벽 끝(v22: 사거리 480)까지 밀림 · 보스는 멈칫하고 무너짐 게이지가 참',()=>{qMPPrep('mage','forbidtide');const w=qMPMob('wolf',P.x+150,P.y),b=qMPBoss(P.x+260,P.y-120);
  const x0=w.x;qOk(qCast('forbidtide',{x:P.x+600,y:P.y}),'시전 안 됨');qMPstep(90);qOk(w.x-x0>250&&w.x-P.x<=R22.cap+60,`밀린 거리 ${Math.round(w.x-x0)} (끝 ${Math.round(w.x-P.x)})`);/* v22: 물벽 길이 1100 → 사거리 480 */qOk((b.stg||0)>0||b.brk>0,'보스 게이지 그대로');qOk(b.hp<b.max&&w.hp<w.max,'피해 0');
  qClear();return `늑대 ${Math.round(w.x-x0)} 밀림 · 보스 게이지 ${Math.round(b.stg||100)}`});
qT(QMP,'마력 역류: 마나 회복이 크게 늚(파티) · 그동안 금기 마법 마나의 25%를 돌려받음',()=>{qMPPrep('mage',['manaflux','forbidtide']);const r0=regen();qOk(qCast('manaflux'),'시전 안 됨');qOk(regen()>r0+10,`회복 ${qR(r0)}→${qR(regen())}`);const lg=$('#log').textContent;qOk(/마나 리플럭스 \(10레벨\)/.test(lg)&&!/\d\.\d+레벨/.test(lg),'알림의 레벨이 찍은 점수(10)가 아님');
  const c=costOf('forbidtide');P.mp=maxMp();const m0=P.mp;tryCast('forbidtide',{x:P.x+300,y:P.y});qMPstep(Math.ceil(castTimeOf('forbidtide')*60)+3,{each:()=>{}});const used=m0-P.mp;
  qOk(Math.abs(used-c*.75)<c*.08+regen()*2,`쓴 마나 ${Math.round(used)} (값 ${c}의 75%여야)`);qClear();return `회복 +${qR(regen()-r0)}/초 · 금기 ${c} → ${Math.round(used)}`});
qT(QMP,'금기: 태풍(모으기): 누르는 동안 커지며 끌어당기고 · 떼면 터짐 · 오래 모을수록 세게(최대 2.2배)',()=>{qMPPrep('mage','forbidgale');const out=[];let k1=0,k2=0,d1=0,d2=0;
  for(const hold of [1,5]){qClear();P.x=QMP_SPOT.x;P.y=QMP_SPOT.y;P.cd={};P.mp=maxMp();const c=qAt(0,300),e=qDummy(c.x,c.y),w=qMPMob('wolf',c.x+200,c.y);
    tryCast('forbidgale',{x:c.x,y:c.y});qOk(J3CH&&J3CH.id==='forbidgale','모으기 시작 안 됨');const g=MPJ.gales.find(g=>g.mine);qOk(g,'태풍 없음');const r0=g.rad,dw=dist(w,g);
    let boom=0;qMPSpy((o,a,s)=>{if(o===e&&s&&s.kind==='strike'&&s.id==='forbidgale')boom+=a},()=>{qMPstep(Math.round(hold*60)-2);qOk(g.rad>r0,'안 커짐');qOk(dist(w,g)<dw-40,`안 끌려옴 ${Math.round(dw)}→${Math.round(dist(w,g))} 반경 ${Math.round(g.rad)} 주인 ${mpAuth()} 죽음 ${w.dead} ${enemies.includes(w)} ${Math.round(w.x-g.x)},${Math.round(w.y-g.y)}`);j3ChargeRelease();qMPstep(3)});
    qOk(boom>0,'터짐 피해 0');if(hold===1){k1=J3CH_LAST.k;d1=boom}else{k2=J3CH_LAST.k;d2=boom}out.push(`${hold}초 반경 ${Math.round(r0)}→${Math.round(g.rad)} ×${qR(J3CH_LAST.k)} 터짐 ${Math.round(boom)}`)}
  qOk(k2>2.1&&k1<1.4,`배수 ${qR(k1)}/${qR(k2)}`);qOk(d2/d1>1.4,`오래 모은 터짐 ${qR(d2/d1)}배`);qClear();return out.join(' · ')});
qT(QMP,'시간의 틈: 안의 몬스터가 50% 느리게 움직임(보스 25%)',()=>{qMPPrep('mage','timerift');const run=rift=>{qClear();P.x=QMP_SPOT.x;P.y=QMP_SPOT.y;P.cd={};const w=qMPMob('wolf',P.x+300,P.y,{aggro:true});w.atkCd=1e9;
    if(rift)qOk(qCast('timerift',{x:w.x,y:w.y}),'시전 안 됨');const x0=w.x;qMPstep(40);return x0-w.x};
  const a=run(false),b=run(true);qOk(a>40&&b<a*.65,`움직인 거리 ${Math.round(a)} → ${Math.round(b)}`);qClear();return `${Math.round(a)} → ${Math.round(b)} (×${qR(b/a)})`});
qT(QMP,'금기: 대지 뒤집기 — 큰 피해 · 일반은 2초 기절(보스는 0.5초 + 무너짐 게이지 크게) · 뒤집힌 땅(8초 느려짐)',()=>{qMPPrep('mage','forbidupheave');const w=qMPMob('wolf',P.x+280,P.y),b=qMPBoss(P.x+300,P.y+60);
  qOk(qCast('forbidupheave',{x:P.x+290,y:P.y+20}),'시전 안 됨');qMPstep(40);qOk(w.stunT>1.4,'일반 기절 '+qR(w.stunT));qOk(b.stunT<=.5+1e-6,'보스 기절 '+qR(b.stunT));qOk((b.stg||0)>=40||b.brk>0,'보스 게이지 '+b.stg);
  qOk(MPJ.grounds.some(g=>g.kind==='rubble'),'뒤집힌 땅 없음');render();qClear();MPJ.grounds.length=0;return `기절 ${qR(w.stunT)} · 보스 ${qR(b.stunT)} · 게이지 ${Math.round(b.brk>0?100:b.stg)}`});
qT(QMP,'마력 분신: 분신이 공격 마법을 따라 씀(피해 절반) · 금기 마법은 따라 하지 않음 · 같이 하기로 두 번 보내지 않음',()=>{qMPPrep('mage',['manaclone','quadorb','forbidtide']);P.face=0;/* 치명타(기본 5%)는 끔: 분신 구슬이 난수를 끼워 쓰면 내 구슬의 치명 굴림이 밀려 a·b가 우연히 갈림(한 번 터지면 1.87배). 분신 몫 절반만 재려고 */const hit=()=>{qClear2();QA.reseed(11);const e=qDummy(P.x+260,P.y);P.buffs._qanc={t:99,max:99,crit:-1};try{qCast('quadorb',{x:e.x,y:e.y});qMPstep(80)}finally{delete P.buffs._qanc}return e.taken};
  const qClear2=()=>{projs.length=0;enemies.length=0};const a=hit();qOk(qCast('manaclone'),'시전 안 됨');qOk(MPJ.clone&&allies.includes(MPJ.clone),'분신 없음');const b=hit();
  qOk(b/a>1.35&&b/a<1.65,`분신 있을 때 ${qR(b/a)}배 (1.5배여야)`);const n0=projs.length;P.cd={};tryCast('forbidtide',{x:P.x+300,y:P.y});qMPstep(100);qOk(MPJ.waves.length<=1,'금기를 따라 함');
  render();qMPstep(Math.ceil(10*60));qOk(!MPJ.clone,'10초 뒤에도 남음');void n0;qClear();return `피해 ×${qR(b/a)}`});
qT(QMP,'종언의 원: 6초 채널링 · 네 원소가 차례로 · 끝까지 버티면 마지막 한 방 · 중간에 끊으면 없음',()=>{qMPPrep('mage','finalcircle');const run=cut=>{qClear();P.x=QMP_SPOT.x;P.y=QMP_SPOT.y;P.cd={};const e=qDummy(P.x+260,P.y);let fin=0;const els=new Set();
    qMPSpy((o,a,s)=>{if(o!==e||!s||s.id!=='finalcircle')return;if(s.kind==='strike')fin+=a;else els.add(s.el)},()=>{qCast('finalcircle',{x:e.x,y:e.y});qMPstep(cut?120:Math.ceil(6.3*60),{each:i=>{P.mp=maxMp();if(cut&&i===110)castStop()}})});return{fin,els,t:e.taken}};
  const a=run(false),b=run(true);qOk(a.fin>0,'마지막 한 방 없음');qOk(['fire','ice','storm','earth'].every(k=>a.els.has(k)),'원소 '+[...a.els]);qOk(b.fin===0,'끊었는데 마지막 한 방');qOk(a.fin>a.t*.15,`마지막 한 방 비중 ${qR(a.fin/a.t)}`);const sw=eff('finalcircle',10);qOk(rainSR(sw,sw.rad)>=sw.rad*.55&&rainDK(sw,sw.rad)<1,'한 줄기가 안 넓어짐');
  qClear();return `합 ${Math.round(a.t)} · 마지막 ${Math.round(a.fin)} (${Math.round(a.fin/a.t*100)}%)`});
/* --- 정령왕의 계약자 --- */
const qMPPets=ids=>{for(const id of ids){P.sk[id]=10;qMana(id);P.cd[id]=0;P.mp=maxMp();qCast(id,qAt(0,80))}qStep(1,{render:false});return mpPets()};
qT(QMP,'계약자의 명령: 4초 동안 모든 소환수가 가리킨 적을 함께 공격',()=>{qMPPrep('mage','pactcommand');P.job2='summoner';const pets=qMPPets(['fireelem','frostgolem']);qOk(pets.length>=2,'소환수 '+pets.length);
  const near=qDummy(P.x+90,P.y+60),far=qDummy(P.x+380,P.y-160);let pd=0;
  qMPSpy((o,a,s)=>{if(o===far&&s&&s.id!=='pactcommand')pd+=a},()=>{qOk(qCast('pactcommand',{x:far.x,y:far.y}),'시전 안 됨');qOk(MPJ.focus&&MPJ.focus.e===far,'집중 대상');qMPstep(200)});
  qOk(pd>0,'소환수가 가리킨 적을 안 때림');qClear();return `소환수 피해 ${Math.round(pd)}`});
qT(QMP,'왕의 계약: 소환수 종류 4 → 5 · 소환수 피해·생명력 +24%(10점)',()=>{const ids=['fireelem','frostgolem','stormhawk','stonetitan','phoenix'];
  const kinds=on=>{qMPPrep('mage');P.job2='summoner';P.job3='spiritking';if(on){P.sk.kingspact=10;passT=-1}qMPPets(ids);return new Set(mpPets().map(a=>a.s.id)).size};
  const a=kinds(false),b=kinds(true);qOk(a===4&&b===5,`종류 ${a} → ${b}`);qOk(Math.abs(passSum('petDmg')-.24)<.01,'소환수 피해 '+qR(passSum('petDmg')));qClear();return `${a} → ${b}종 · 피해 +${Math.round(passSum('petDmg')*100)}%`});
qT(QMP,'정령 융합: 소환수 둘 → 상급 정령 하나(둘의 힘 ×1.3, 25초) · 불덩이로 공격',()=>{qMPPrep('mage','spiritfusion');P.job2='summoner';const pets=qMPPets(['fireelem','frostgolem']);const sum=pets.slice(0,2).reduce((a,p)=>a+p.dmg,0);
  const e=qDummy(P.x+260,P.y);qOk(qCast('spiritfusion',{x:e.x,y:e.y}),'시전 안 됨');const f=allies.find(a=>a.j3f==='fusion');qOk(f,'상급 정령 없음');qOk(mpPets().filter(a=>a.j3f!=='fusion').length===pets.length-2,'둘이 안 사라짐');
  qOk(Math.abs(f.dmg/sum-1.3)<.05,`힘 ×${qR(f.dmg/sum)}`);qMPstep(120,{renderEvery:30});qOk(e.taken>0,'상급 정령 공격 0');qClear();return `힘 ×${qR(f.dmg/sum)} · 2초 피해 ${Math.round(e.taken)}`});
qT(QMP,'수호 정령(파티): 때린 적에게 반격 · 10초마다 한 번 피해를 통째로 막음 · 받는 피해 감소',()=>{qMPPrep('mage','wardspirit',{hurt:1});qOk(qCast('wardspirit'),'시전 안 됨');const b=P.buffs.wardspirit;qOk(b&&b.g&&b.dr>0,'정령 없음');
  const w=qMPMob('wolf',P.x+40,P.y);const h=P.hp;hitPlayer(200,w);qOk(P.hp===h,'첫 피해를 못 막음');qOk(w.hp<w.max,'반격 없음');P.invT=0;hitPlayer(200,w);qOk(P.hp<h,'두 번째도 막음');
  qOk(b.t>=30,'지속 '+b.t);qClear();return `지속 ${Math.round(b.t)}초 · 반격 ${Math.round(w.max-w.hp)}`});
qT(QMP,'정령 사슬: 나와 소환수가 번개 사슬로 이어져 사이를 지나는 적이 감전 · 소환수가 없으면 작은 정령 둘',()=>{qMPPrep('mage','spiritchain');const e=qDummy(P.x+260,P.y);qOk(qCast('spiritchain',{x:e.x,y:e.y}),'시전 안 됨');
  qOk(MPJ.chain&&MPJ.chain.nodes&&MPJ.chain.nodes.length===2,'작은 정령 둘 없음');qMPstep(60,{renderEvery:20});qOk(e.taken>0,'감전 피해 0');const a=e.taken;
  qClear();MPJ.chain=null;P.job2='summoner';qMPPets(['fireelem']);const e2=qDummy(P.x+50,P.y+60);const pet=mpPets()[0];pet.x=P.x+100;pet.y=P.y+120;P.cd={};qOk(qCast('spiritchain',{x:e2.x,y:e2.y}),'시전 안 됨(소환수)');
  qOk(MPJ.chain&&!MPJ.chain.nodes,'소환수와 안 이어짐');qMPstep(30,{each:()=>{pet.x=P.x+100;pet.y=P.y+120;P.mp=maxMp()}});qOk(e2.taken>0,'사슬 사이 적 피해 0');MPJ.chain=null;qClear();return `작은 정령 ${Math.round(a)} · 소환수 ${Math.round(e2.taken)}`});
qT(QMP,'정령 폭주: 8초 동안 소환수 빠르기 +40% · 끝날 때 소환수마다 작은 폭발',()=>{qMPPrep('mage','spiritfrenzy');P.job2='summoner';qMPPets(['fireelem']);const pet=mpPets()[0];const e=qDummy(P.x+150,P.y);
  const s0=j2PetSpd();qOk(qCast('spiritfrenzy'),'시전 안 됨');qOk(j2PetSpd()>=s0+.39,`빠르기 ${qR(s0)}→${qR(j2PetSpd())}`);let boom=0;
  qMPSpy((o,a,s)=>{if(o===e&&s&&s.id==='j3frenzy')boom+=a},()=>qMPstep(Math.ceil(8.2*60),{each:()=>{pet.x=e.x-60;pet.y=e.y;P.mp=maxMp()}}));qOk(boom>0,'끝 폭발 없음');qOk(allies.includes(pet),'소환수가 사라짐');qClear();return `폭발 ${Math.round(boom)}`});
qT(QMP,'계약의 대가: 쓰러질 피해 → 가장 가까운 소환수가 대신 사라지고 30%로 버팀 · 소환수가 없으면 듣지 않음',()=>{qMPPrep('mage','pactprice',{hurt:1});P.job2='summoner';qMPPets(['fireelem']);qOk(qCast('pactprice'),'시전 안 됨');qOk(P.ward,'계약 없음');
  P.invT=0;P.shield=0;hitPlayer(1e7);qOk(!P.dead&&P.hp>0,'쓰러짐');qOk(!mpPets().length,'소환수가 안 사라짐');const hp=Math.round(P.hp/maxHp()*100);
  qMPPrep('mage','pactprice',{hurt:1});qOk(qCast('pactprice'),'시전 안 됨(2)');P.invT=0;P.shield=0;hitPlayer(1e7);const died=P.dead;P.dead=false;P.hp=maxHp();$('#death').hidden=true;qOk(died,'소환수 없이 버팀');qClear();return `버틴 생명력 ${hp}%`});
qT(QMP,'정령 귀환: 쓰러진 소환수를 대기 없이 한꺼번에 다시 부름 · 부를 것이 없으면 마나·재사용이 들지 않음',()=>{qMPPrep('mage','spiritreturn');P.job2='summoner';qMPPets(['fireelem','frostgolem']);qOk(mpPets().length>=2,'소환수');
  for(const a of allies)a.gone=true;allies=[];P.cd.fireelem=9;P.cd.frostgolem=9;qOk(qCast('spiritreturn'),'시전 안 됨');qOk(new Set(mpPets().map(a=>a.s.id)).size===2,'다시 안 옴 '+mpPets().length);
  P.cd={};const mp=P.mp;tryCast('spiritreturn');qOk(!(P.cd.spiritreturn>0)&&Math.abs(P.mp-mp)<1,'부를 것이 없는데 마나·재사용');qClear();return '2종 다시 부름'});
qT(QMP,'원소 군주 소환: 거대한 군주(30초)가 네 원소로 돌아가며 내려찍음',()=>{qMPPrep('mage','spiritsovereign');const e=qDummy(P.x+200,P.y);const els=new Set();
  qMPSpy((o,a,s)=>{if(o===e&&s&&s.id==='spiritsovereign')els.add(s.el)},()=>{qOk(qCast('spiritsovereign',{x:e.x,y:e.y}),'시전 안 됨');const a=allies.find(a=>a.j3f==='sovereign');qOk(a&&a.r>=30,'군주 없음');qMPstep(480,{renderEvery:40})});
  qOk(els.size>=3,'원소 '+[...els]);qClear();return `원소 ${[...els].join(',')} · 피해 ${Math.round(e.taken)}`});
qT(QMP,'정령 왕좌: 안의 소환수 피해 +20% · 생명력 회복 · 안의 적 느려짐',()=>{qMPPrep('mage','spiritthrone');P.job2='summoner';qMPPets(['frostgolem']);const pet=mpPets()[0],d0=pet.dmg;pet.hp=pet.max*.5;const w=qMPMob('wolf',P.x+150,P.y);
  qOk(qCast('spiritthrone',{x:pet.x,y:pet.y}),'시전 안 됨');qMPstep(60,{each:()=>{pet.x=P.x+40;pet.y=P.y;w.x=P.x+150;w.y=P.y;P.mp=maxMp()}});
  qOk(Math.abs(pet.dmg/d0-1.2)<.02,`피해 ×${qR(pet.dmg/d0)}`);qOk(pet.hp>pet.max*.5,'회복 없음');qOk(w.slowT>0,'적 안 느려짐');qClear();return `×${qR(pet.dmg/d0)} · 생명력 ${Math.round(pet.hp/pet.max*100)}%`});
qT(QMP,'정령왕 강림: 20초 · 내 피해 +15% · 마법이 태우고 느리게 · 소환수 커지고 피해 +30%',()=>{qMPPrep('mage',['spiritadvent','pactcommand']);P.job2='summoner';qMPPets(['fireelem']);const d0=dmgMul();
  qOk(qCast('spiritadvent'),'시전 안 됨');qOk(P.buffs.spiritadvent&&P.buffs.spiritadvent.t>=19,'강화 없음');qOk(dmgMul()>d0,'피해 그대로');const e=qMPMob('ogre',P.x+200,P.y);qCast('pactcommand',{x:e.x,y:e.y});qMPstep(40,{render:true});
  qOk(e.burn&&e.slowT>0,'태움·느리게 없음');qClear();return `피해 ×${qR(dmgMul()/d0)}`});
/* --- 빛의 집행자 --- */
const qMPBrand=e=>{e.markT=10;e.markAmp=.12};
qT(QMP,'집행의 창: 낙인 찍힌 적이 둘레에 있으면 창 셋이 그쪽으로 쫓아감',()=>{qMPPrep('priest','execlance');const e=qDummy(P.x+20,P.y+300);qMPBrand(e);
  qOk(qCast('execlance',{x:P.x+300,y:P.y}),'시전 안 됨');qMPstep(90);qOk(e.hits>=2,'쫓아가 맞은 창 '+e.hits);qClear();return `${e.hits}발 맞음`});
qT(QMP,'집행자의 눈: 낙인 찍힌 적에게 피해 +20%(10점, 덧셈) · 낙인 +5.6초',()=>{qMPPrep('priest','execlance');const hit=on=>{P.sk.execeye=on?10:0;passT=-1;qClear();P.x=QMP_SPOT.x;P.y=QMP_SPOT.y;const e=qDummy(P.x+200,P.y);qMPBrand(e);QA.reseed(31);hurtE(e,1000,{id:'execlance',cls:'priest',el:'holy',kind:'bolt',rank:20});return e.taken};
  P.job3='executor';const a=hit(false),b=hit(true);qOk(Math.abs(b/a-1.2)<.04,`×${qR(b/a)} (1.2)`);const e=qDummy(P.x+100,P.y);e.markT=0;applyFx(e,{mark:{amp:.1,dur:6},cls:'priest'},P);qOk(e.markT>=6+5.5,'낙인 '+qR(e.markT));qClear();return `×${qR(b/a)} · 낙인 ${qR(e.markT)}초`});
qT(QMP,'하늘의 노여움: 반경 400 빛의 비 · 낙인 찍힌 적에게 빛줄기가 몰림',()=>{qMPPrep('priest','heavenwrath');const c=qAt(0,250),a=qDummy(c.x+250,c.y),b=qDummy(c.x-250,c.y);qMPBrand(a);
  QA.reseed(5);qOk(qCast('heavenwrath',{x:c.x,y:c.y}),'시전 안 됨');qMPstep(Math.ceil(6.3*60));qOk(a.hits>b.hits*1.5,`낙인 ${a.hits}번 · 보통 ${b.hits}번`);qClear();return `낙인 ${a.hits} · 보통 ${b.hits}`});
qT(QMP,'낙인 전파: 낙인 찍힌 적을 터뜨려 둘레 적 모두에게 낙인을 옮김',()=>{qMPPrep('priest','brandspread');const a=qDummy(P.x+200,P.y),b=qDummy(P.x+300,P.y+40),c=qDummy(P.x+900,P.y);qMPBrand(a);b.markT=0;c.markT=0;
  qOk(qCast('brandspread',{x:a.x,y:a.y}),'시전 안 됨');qMPstep(3);qOk(b.markT>0&&b.taken>0,'옆 적에게 안 옮겨짐');qOk(!(c.markT>0),'먼 적까지');qClear();return '옮김'});
qT(QMP,'빛의 추적자: 낙인 찍힌 적 곁으로 날아가며 지나는 적을 벰',()=>{qMPPrep('priest','lightchaser');const a=qDummy(P.x,P.y-420);qMPBrand(a);const mid=qDummy(P.x,P.y-200);
  qOk(qCast('lightchaser',{x:P.x+300,y:P.y}),'시전 안 됨');qMPstep(3);qOk(dist(P,a)<90,'낙인 곁이 아님 '+Math.round(dist(P,a)));qOk(mid.taken>0,'지나는 길 피해 0');qClear();return `거리 ${Math.round(dist(P,a))}`});
qT(QMP,'정죄의 결계: 안의 적은 회복 못 함 · 안에서 때리는 사람(나·동료)은 생명력이 참 · 안의 나에게 표시',()=>{qMPPrep('priest',['condemnfield','execlance'],{hurt:1});const e=qDummy(P.x+150,P.y);
  qOk(qCast('condemnfield',{x:P.x+60,y:P.y}),'시전 안 됨');qMPstep(40);qOk(e.j3noheal>0,'회복 막기 없음');qOk(P.buffs._j3cf,'내 표시 없음');P.hp=Math.round(maxHp()*.4);const h=P.hp;qCast('execlance',{x:e.x,y:e.y});qMPstep(40);
  qOk(P.hp>h,'때려도 생명력 그대로');qClear();return `+${Math.round(P.hp-h)}`});
qT(QMP,'천상의 감옥: 3초 가둠(보스 1.5초 + 무너짐 게이지) · 풀릴 때 갇힌 동안 받은 피해의 30%가 한 번 더 터짐',()=>{qMPPrep('priest',['heavenprison','execlance']);const w=qMPMob('wolf',P.x+200,P.y),b=qMPBoss(P.x+200,P.y+200);
  qOk(qCast('heavenprison',{x:w.x,y:w.y}),'시전 안 됨');qMPstep(30);qOk(w.j3pr&&w.stunT>2.3,'안 갇힘');let br=0;qMPSpy((o,a,s)=>{if(o===w&&s&&s.id==='j3prison')br+=a},()=>{P.cd={};qCast('execlance',{x:w.x,y:w.y});qMPstep(200)});
  qOk(br>0,'풀릴 때 안 터짐');P.cd={};qCast('heavenprison',{x:b.x,y:b.y});qMPstep(30);qOk(b.j3pr&&b.stunT<=1.5+1e-6,'보스 '+qR(b.stunT));qOk((b.stg||0)>=35||b.brk>0,'보스 게이지 '+b.stg);render();qClear();return `터짐 ${Math.round(br)}`});
qT(QMP,'속죄의 빛(파티): 그동안 낙인 찍힌 적이 둘레에서 쓰러지면 생명력 4%+ 회복',()=>{qMPPrep('priest','atonelight',{hurt:1});qOk(qCast('atonelight'),'시전 안 됨');qOk(P.buffs.atonelight&&P.buffs.atonelight.a3>0,'빛 없음');
  P.hp=Math.round(maxHp()*.5);const h=P.hp;const w=qMPMob('wolf',P.x+120,P.y,{hp:10});qMPBrand(w);hurtE(w,1e6,{id:'x',cls:'priest',el:'holy',kind:'bolt'});qMPstep(2);qOk(w.dead,'안 쓰러짐');qOk(P.hp>h,'회복 없음');
  const h2=P.hp;const v=qMPMob('wolf',P.x+120,P.y,{hp:10});hurtE(v,1e6,{id:'x',cls:'priest',el:'holy',kind:'bolt'});qMPstep(2);qOk(P.hp<=h2+2,'낙인 없는 적에도 회복');qClear();return `+${Math.round((P.hp-h)/maxHp()*100)}%`});
qT(QMP,'심판의 대창: 사거리 끝(v22: 480, 예전 1150)까지 꿰뚫음 · 그 너머는 안 맞음 · 낙인 찍힌 적에 닿으면 그 자리에서 한 번 더 터짐',()=>{qMPPrep('priest','judgespear');const far=qDummy(P.x+R22.cap*.9,P.y),beyond=qDummy(P.x+R22.cap+SPELLS.judgespear.w+hR({k:'qa_dummy',r:22})+40,P.y-1),a=qMPMob('ogre',P.x+400,P.y),side=qDummy(P.x+400,P.y+110);qMPBrand(a);
  qOk(qCast('judgespear',{x:P.x+600,y:P.y}),'시전 안 됨');qMPstep(30,{renderEvery:5});qOk(far.taken>0,'사거리 90% 안 맞음');qOk(beyond.taken===0,'사거리 밖이 맞음');qOk(side.taken>0,'낙인 폭발이 옆 적에 안 닿음');qClear();return `옆 ${Math.round(side.taken)}`});
qT(QMP,'집행: 생명력 20% 아래 낙인 찍힌 적은 바로 쓰러짐 · 낙인 없으면 아님 · 보스는 3배 피해',()=>{qMPPrep('priest','execution');const ex=(brand,boss)=>{qClear();P.x=QMP_SPOT.x;P.y=QMP_SPOT.y;P.cd={};const e=boss?qMPBoss(P.x+200,P.y):qMPMob('wolf',P.x+200,P.y);e.hp=e.max*.15;if(brand)qMPBrand(e);const h=e.hp;
    QA.reseed(3);qCast('execution',{x:e.x,y:e.y});qMPstep(40);return{dead:e.dead,dmg:h-Math.max(0,e.hp),e}};
  const a=ex(true,false),b=ex(false,false);qOk(a.dead,'낙인 + 20% 아래인데 안 쓰러짐');qOk(!b.dead,'낙인 없이 쓰러짐');
  const c=ex(true,true),d=ex(false,true);qOk(!c.e.dead,'보스가 바로 쓰러짐');qOk(c.dmg/d.dmg>2.4,`보스 ×${qR(c.dmg/d.dmg)}`);qClear();return `보스 ×${qR(c.dmg/d.dmg)} (낙인 증폭 포함)`});
qT(QMP,'하늘 문이 열리는 날: 5초 채널링 · 언데드·악마 3배 · 끝까지 버티면 가장 큰 빛기둥',()=>{qMPPrep('priest','heavengate');const e=qDummy(P.x+260,P.y);let fin=0;
  qMPSpy((o,a,s)=>{if(o===e&&s&&s.id==='heavengate'&&s.kind==='strike')fin+=a},()=>{qCast('heavengate',{x:e.x,y:e.y});qMPstep(Math.ceil(5.3*60))});
  qOk(fin>0,'마지막 빛기둥 없음');qOk(SPELLS.heavengate.ud===3,'언데드 배수');const sw=eff('heavengate',10);qOk(rainSR(sw,sw.rad)>=sw.rad*.55&&rainDK(sw,sw.rad)<1,'한 줄기가 안 넓어짐');qClear();return `합 ${Math.round(e.taken)} · 마지막 ${Math.round(fin)}`});
/* --- 성자 --- */
qT(QMP,'성자의 손길: 크게 치유 · 넘친 치유의 절반은 8초 보호막(최대 생명력 20%까지)',()=>{qMPPrep('priest','sainttouch');P.hp=maxHp()-5;P.shield=0;qOk(qCast('sainttouch'),'시전 안 됨');qOk(P.shield>0&&P.shieldT>7,'보호막 없음');qOk(P.shield<=maxHp()*.2+1,'상한 넘음 '+P.shield);
  const sh=P.shield;P.shield=0;P.hp=Math.round(maxHp()*.2);const h=P.hp;P.cd={};qCast('sainttouch');qOk(P.hp-h>maxHp()*.3,'치유 '+(P.hp-h));qClear();return `보호막 ${sh} (생명력의 ${Math.round(sh/maxHp()*100)}%)`});
qT(QMP,'성흔: 내 생명력이 낮을수록 내 치유 +(바닥일 때 10점에 +20%)',()=>{qMPPrep('priest','sainttouch');const heal=(on,frac)=>{P.sk.stigmata=on?10:0;passT=-1;P.hp=Math.max(1,Math.round(maxHp()*frac));P.cd={};P.shield=0;let got=0;const keep=healP;healP=function(n){got+=n;return keep.apply(this,arguments)};try{qCast('sainttouch')}finally{healP=keep}return got};
  P.job3='saint';const a=heal(false,.05),b=heal(true,.05),c=heal(true,.6),d=heal(false,.6);qOk(b/a>1.15&&b/a<1.22,`바닥 ×${qR(b/a)}`);qOk(c/d<b/a,'생명력이 높아도 같음');qClear();return `5%일 때 ×${qR(b/a)}`});
qT(QMP,'순교의 기도: 혼자면 바치지 않음 · 동료가 있으면 내 생명력 25%를 바치고 동료가 받는 치유 = 바친 양×3 + 주문력',()=>{qMPPrep('priest','martyrprayer',{hurt:1});const mp=P.mp,h=P.hp;tryCast('martyrprayer');qOk(P.hp===h&&!(P.cd.martyrprayer>0)&&P.mp===mp,'혼자인데 바침');
  try{qPty(2);const h0=P.hp;qOk(qCast('martyrprayer'),'동료가 있는데 안 됨');qOk(Math.abs((h0-P.hp)-Math.round(maxHp()*.25))<=1,`바친 생명력 ${h0-P.hp}`);qPtyOff();
    qPeerOn().x=P.x+100;NET.peers.get('qa_peer').y=P.y;P.hp=Math.round(maxHp()*.2);const g=P.hp;netGhostCast({from:'qa_peer',sp:'martyrprayer',L:10,x:P.x+100,y:P.y,pw:300});qOk(P.hp>g+maxHp()*.3,`받은 치유 ${P.hp-g}`);return `받은 치유 ${P.hp-g}`}finally{qPtyOff()}});
qT(QMP,'빛의 길(한 명): 고른 동료 곁으로 순간이동하며 둘 다 치유 · 받은 동료 화면에서도 치유',()=>{qMPPrep('priest','lightpath',{hurt:1});try{const {r,sent}=qPty(2,{dx:500});r.y=r.ty=P.y+40;PTY.tgt='qa_peer';P.hp=Math.round(maxHp()*.5);const h=P.hp;
    qOk(qCast('lightpath',{x:P.x-300,y:P.y}),'시전 안 됨');qOk(dist(P,r)<120,'동료 곁이 아님 '+Math.round(dist(P,r)));qOk(P.hp>h,'나 치유 없음');const m=sent.find(m=>m.t==='cast'&&m.sp==='lightpath');qOk(m&&m.tg==='qa_peer','대상 없는 시전 메시지');
    P.hp=Math.round(maxHp()*.5);const g=P.hp;netGhostCast({from:'qa_peer',sp:'lightpath',L:10,x:P.x,y:P.y,pw:300,tg:NET.id});qOk(P.hp>g,'받은 쪽 치유 없음');return `받은 쪽 +${P.hp-g}`}finally{qPtyOff()}});
qT(QMP,'축성(파티): 내가(동료가) 건 축복의 시간을 처음으로 · 해로운 효과 하나 지움 · 조금 치유',()=>{qMPPrep('priest','consecrate',{hurt:1});P.buffs.graceaccel={t:2,max:15,cdr:.2,n:'x',L:1,by:''};P.slowT=3;P.hp=Math.round(maxHp()*.5);const h=P.hp;
  qOk(qCast('consecrate'),'시전 안 됨');qOk(P.buffs.graceaccel.t===15,'축복 시간 '+P.buffs.graceaccel.t);qOk(P.hp>h,'치유 없음');
  try{const r=qPeerOn();r.x=P.x+100;r.y=P.y;P.buffs.graceaccel={t:2,max:15,cdr:.2,n:'x',L:1,by:'QA 동료'};P.buffs.blessing2={t:2,max:30,n:'y',L:1,by:'남'};netGhostCast({from:'qa_peer',sp:'consecrate',L:10,x:r.x,y:r.y});
    qOk(P.buffs.graceaccel.t===15,'동료가 건 축복이 안 새로워짐');qOk(P.buffs.blessing2.t===2,'다른 사람 축복까지')}finally{qPeerOff()}return '새로 + 지움'});
qT(QMP,'은총의 가속(한 명): 15초 재사용 대기 -20% · 마나 회복',()=>{qMPPrep('priest','graceaccel');const c0=buffSum('cdr'),r0=regen();qOk(qCast('graceaccel'),'시전 안 됨');qOk(buffSum('cdr')>=c0+.19&&regen()>r0,'효과 없음');qOk(P.buffs.graceaccel.t===15,'지속');qClear();return 'cdr +20%'});
qT(QMP,'생명 교환(한 명): 혼자면 안 됨 · 고른 동료와 생명력 비율을 맞바꿈 · 받은 쪽은 j3x lswap으로',()=>{qMPPrep('priest','lifeswap',{hurt:1});const mp=P.mp;tryCast('lifeswap');qOk(!(P.cd.lifeswap>0)&&P.mp===mp,'혼자인데 씀');
  try{const {r,sent}=qPty(2);r.hp=160;r.max=800;PTY.tgt='qa_peer';P.hp=Math.round(maxHp()*.9);qOk(qCast('lifeswap'),'시전 안 됨');qOk(Math.abs(P.hp/maxHp()-.2)<.02,'내 생명력 '+qR(P.hp/maxHp()));
    const m=sent.find(m=>m.t==='j3x'&&m.k==='lswap');qOk(m&&m.to==='qa_peer'&&Math.abs(m.ratio-.9)<.02,'교환 메시지');
    P.hp=Math.round(maxHp()*.1);netOnMsg({t:'j3x',k:'lswap',from:'qa_peer',to:NET.id,ratio:.85,n:'생명 교환'});qOk(Math.abs(P.hp/maxHp()-.85)<.02,'받은 쪽 '+qR(P.hp/maxHp()));return '20% ↔ 90%'}finally{qPtyOff()}});
qT(QMP,'성자의 행진: 걸으며 채널링(빛이 따라옴) · 안의 파티원 매초 회복 · 받는 피해 감소',()=>{qMPPrep('priest','saintmarch',{hurt:1});P.hp=Math.round(maxHp()*.3);const h=P.hp,x0=P.x;qOk(qCast('saintmarch'),'시전 안 됨');qOk(CAST.ch&&CAST.ch.id==='saintmarch','채널링 아님');
  keys.add('KeyD');qMPstep(60);keys.delete('KeyD');qOk(CAST.ch,'걸으니 끊김');qOk(P.x-x0>40,'못 걸음');const f=fields.find(f=>f.s&&f.s.id==='saintmarch');qOk(f&&dist(f,P)<30,'빛이 안 따라옴');qOk(P.hp>h,'회복 없음');
  qOk(P.buffs._f_saintmarch&&P.buffs._f_saintmarch.dr>0,'피해 감소 없음');castStop();qClear();return `걸음 ${Math.round(P.x-x0)}`});
qT(QMP,'성소 펼치기: 안의 파티원은 기절·묶임·공포·끌려감에 안 걸림 · 표시',()=>{qMPPrep('priest','sanctumfield');qOk(qCast('sanctumfield',{x:P.x+50,y:P.y}),'시전 안 됨');P.stunT=2;qMPstep(10);qOk(!(P.stunT>0),'기절이 남음');qOk(P.buffs._j3sa&&P.j2imm>0,'표시·면역 없음');
  P.x+=600;qMPstep(40);P.stunT=2;qMPstep(2);qOk(P.stunT>0,'밖에서도 막음');P.stunT=0;qClear();return '막음'});
qT(QMP,'대부활: 쓰러진 파티원 모두를 60%로 일으킴(반경 1600) · 쓰러진 동료가 없으면 마나·재사용 없음',()=>{qMPPrep('priest','grandrez');const mp=P.mp;tryCast('grandrez');qMPstep(130);qOk(!(P.cd.grandrez>0)&&Math.abs(P.mp-mp)<5,'혼자인데 마나/재사용');
  try{const {r,sent}=qPty(2,{dx:1200});r.dead=true;P.cd={};qCast('grandrez');qMPstep(3);const m=sent.find(m=>m.t==='rez'&&m.to==='qa_peer');qOk(m,'부활 메시지 없음');qOk(Math.abs(m.p-.6)<.01||Math.abs((m.pct||m.p)-.6)<.01,'60% 아님 '+JSON.stringify(m));return '1200 떨어진 동료 부활'}finally{qPtyOff()}});
qT(QMP,'기적(파티): 나와 둘레(700) 동료 모두 생명력 가득 + 4초 무적 · 범위 밖은 안 걸림',()=>{qMPPrep('priest','saintmiracle',{hurt:1});P.hp=Math.round(maxHp()*.2);qOk(qCast('saintmiracle'),'시전 안 됨');qOk(P.hp===maxHp()&&P.invT>=3.9,'나에게 안 걸림');
  try{const r=qPeerOn();r.x=P.x+500;r.y=P.y;P.hp=10;P.invT=0;netGhostCast({from:'qa_peer',sp:'saintmiracle',L:10,x:r.x,y:r.y});qOk(P.hp===maxHp()&&P.invT>=3.9,'동료 기적이 안 걸림');
    P.hp=10;P.invT=0;r.x=P.x+900;netGhostCast({from:'qa_peer',sp:'saintmiracle',L:10,x:r.x,y:r.y});qOk(P.hp===10&&!(P.invT>0),'범위 밖인데 걸림')}finally{qPeerOff()}return '나 + 동료'});
/* --- 같이 하기 · 위계 --- */
qT(QMP,'같이 하기: 동료의 태풍 모으기(j3x gale)는 내 화면에서 소용돌이만 · 마지막 한 방(fin) 그림 · 옛 판 메시지 모양',()=>{qMPPrep('mage');MPJ.gales.length=0;try{const r=qPeerOn();r.x=r.tx=P.x+200;r.y=r.ty=P.y;
    netOnMsg({t:'j3x',k:'gale',from:'qa_peer',x:P.x+300,y:P.y,d:3});const g=MPJ.gales.find(g=>g.ghost);qOk(g&&g.dmg===0,'동료 태풍 없음/피해가 있음');const e=qDummy(P.x+300,P.y);qMPstep(60,{renderEvery:20});qOk(e.taken===0,'동료 화면에서 피해');
    netGhostCast({from:'qa_peer',sp:'forbidgale',L:10,x:P.x+300,y:P.y});qOk(!MPJ.gales.some(g=>g.ghost),'터진 뒤에도 남음');
    netOnMsg({t:'j3x',k:'fin',from:'qa_peer',sp:'heavengate',x:P.x,y:P.y,r:500});qOk(MPJ.fins.some(f=>!f.small),'마지막 한 방 그림 없음');qMPstep(10,{render:true});return '소용돌이 · 그림'}finally{qPeerOff()}});
qT(QMP,'위계: 3차 공격은 10점에 같은 직업 2차(20점)보다 셈 · 범위 마법은 반경 380 이상 · 1점일 때도 2차 만렙 평균에 가까움',()=>{const out=[],bad=[];
  for(const cls of ['mage','priest']){qMPPrep(cls);const pack=(id,L)=>{qClear();P.x=QMP_SPOT.x;P.y=QMP_SPOT.y;P.cd={};P.buffs={};const c=qAt(0,240),es=[0,1,2,3,4].map(i=>qDummy(c.x+Math.cos(i*1.257)*(i?70:0),c.y+Math.sin(i*1.257)*(i?70:0)));
      P.sk[id]=L;const s0=SPELLS[id];if(s0.job2)P.job2=s0.job2;if(s0.job3){P.job3=s0.job3;P.job2=JOB2_OF3[s0.job3]}QA.reseed(77);if(!qCast(id,{x:c.x,y:c.y}))return 0;if(J3CH)j3ChargeRelease();
      const s=eff(id,skLv(id)),T=Math.min(12,Math.max(s.dur||0,(chanOf(id)?chanPlan(id,skLv(id)).dur:0),s.delay||0)+2.5);qMPstep(Math.ceil(T*60),{each:()=>{P.mp=maxMp();P.hp=maxHp()}});return es.reduce((a,e)=>a+e.taken,0)/Math.max(qCycle(id),1)};
    const A=['bolt','nova','chain','field','rain','strike','beam','cone','wave','gale','brandburst'],j2=Object.keys(SPELLS).filter(id=>SPELLS[id].cls===cls&&SPELLS[id].job2&&isDmg(SPELLS[id])&&A.includes(SPELLS[id].kind)),
      j3=J3MP_SPELLS.filter(id=>SPELLS[id].cls===cls&&isDmg(SPELLS[id])&&A.includes(SPELLS[id].kind));
    const avg=(ids,L)=>ids.reduce((a,id)=>a+pack(id,L),0)/ids.length;const a2=avg(j2,20),a3=avg(j3,10),a31=avg(j3,1);
    out.push(`${QCN[cls]} 2차 20점 ${Math.round(a2)}/초 · 3차 1점 ${Math.round(a31)} (×${qR(a31/a2)}) · 10점 ${Math.round(a3)} (×${qR(a3/a2)})`);if(!(a3>a2*1.6))bad.push(cls+' 10점 ×'+qR(a3/a2));if(!(a31>a2*.7))bad.push(cls+' 1점 ×'+qR(a31/a2))}
  for(const id of J3MP_SPELLS){const s=SPELLS[id];if(['field','rain'].includes(s.kind)&&isDmg(s)&&!(s.rad>=380))bad.push(id+' 반경 '+s.rad)}
  qClear();qOk(!bad.length,bad.join(', ')+' || '+out.join(' | '));return out.join(' | ')});
/* ===== 3차 전직 v20 (전사·궁수 · WARARC): 성벽의 군주 · 전쟁군주 · 신궁 · 그림자 사냥꾼 (job3d-wa.js · job3fx-wa.js) ===== */
const QWA='3차 전직 v20 (전사·궁수)',QWA_SPOT={x:1500,y:3500};// 둘레 600이 탁 트인 곳
function qWAClr(){J3W.p=null;J3W.cx=null;J3W.gx=null;J3W.kg=null;J3W.cl=null;J3W.aoe=0;J3W.fz=0;J3W.br=0;J3W.blkNext=0;J3W.store=0;if(J3W.hold)jwUnhold();
  for(const k of ['walls','thr','leaps','sweeps','hom','stars','sfall','waves','drives','gfx'])J3W[k].length=0;J3W.lords.clear();J3W.hid.clear();traps.length=0}
// 그 기술의 3차 갈래로 전직한 130레벨 캐릭터 (점수 10 = 스킬 레벨 19)
function qWAPrep(cls,ids,o){o=o||{};qPrep(cls,{lvl:130});qWAClr();
  for(const id of [].concat(ids||[])){const s=SPELLS[id];qJob3On(s.job3);if(P.lvl<s.upLv)P.lvl=s.upLv;P.sk[id]=o.pts||10;if(typeof clsGearFor==='function')clsGearFor(id);qMana(id)}
  passT=-1;jwReset();P.hp=maxHp();P.mp=maxMp();P.invT=o.hurt?0:1e9;P.x=QWA_SPOT.x;P.y=QWA_SPOT.y;P.face=0;followCam();return P}
// 점검 몬스터·허수아비는 늘 맞음(qwa) — 빗나감은 따로(꿰뚫는 시선) 본다
{const _qh=hitChance;hitChance=function(e){return e&&e.qwa?1:_qh.apply(this,arguments)}}
const qWADum=(x,y,o)=>{const d=qDummy(x,y,o);d.qwa=1;return d};
const qWAMob=(k,x,y,o)=>{o=o||{};const e=dgMob(k,x,y,o.lvl||120);e.qwa=!o.real;e.hp=e.max=o.hp||1e7;e.atkCd=1e9;e.skT=1e9;e.dmg=o.dmg||0;e.id=++NET.eid;if(o.aggro)e.aggroed=true;return e};
const qWABoss=(x,y,o)=>qWAMob('b_arsil',x,y,o);
const qWAst=(n,o)=>qStep(n,Object.assign({render:false,each:()=>{P.mp=maxMp()}},o||{}));
const qWAx=(sent,k)=>sent.filter(m=>m.t==='j3x'&&m.k===k);
const qWAhit=(es)=>es.filter(e=>e.taken>0||e.hp<e.max).length;

qT(QWA,'44개: 갈래마다 11개(20~29위계) · 패시브는 갈래마다 1개(20% 미만) · 한국어 이름·설명 · 금빛 겹테 아이콘 · 쓰는 방식 표시 · 후딜 · 종류 이름 · 3차 계열 · 열리는 레벨 · 센 기술은 시전/모으기',()=>{const bad=[];let pas=0;
  qOk(J3WA_IDS.length===44,'개수 '+J3WA_IDS.length);jwKindN();
  const CL={bulwark:'warrior',warlord:'warrior',divinearcher:'archer',shadowhunter:'archer'};
  for(const br in CL){const ids=J3WA_IDS.filter(id=>SPELLS[id].job3===br);if(ids.length!==11)bad.push(br+' '+ids.length+'개');
    const rk=ids.map(id=>SPELLS[id].rank).sort((a,b)=>a-b).join(',');if(rk!=='20,20,21,22,23,24,25,26,27,28,29')bad.push(br+' 위계 '+rk);
    if(JOB2_OF3[br]==null)bad.push(br+' 2차 갈래 없음');
    for(const id of ids){const s=SPELLS[id];if(s.cls!==CL[br])bad.push(id+' 직업 '+s.cls);if(TREE[id]!=='j3_'+br)bad.push(id+' 계열 '+TREE[id]);if(!(s.upLv>=100))bad.push(id+' 열리는 레벨 '+s.upLv);if(s.job2)bad.push(id+' job2');
      if(!s.n||!/[가-힣]/.test(s.kn||'')||!/[가-힣]/.test(s.desc||''))bad.push(id+' 한국어 이름·설명');
      const svg=spellSvg(s);if(!/#e8b04a/.test(svg)||!svg.includes('ip'+id))bad.push(id+' 아이콘');
      if(!KINDN[s.kind])bad.push(id+' 종류 이름 '+s.kind);
      if(s.kind==='passive'){pas++;if(CMARK.kind(id)!=='')bad.push(id+' 패시브 표시');continue}
      if(REC_T[id]==null)bad.push(id+' 후딜 표 없음');
      const want=CAST_T[id]?'cast':(chanOf(id)||s.charge)?'chan':'inst';if(CMARK.kind(id)!==want)bad.push(id+` 표시 ${CMARK.kind(id)}≠${want}`)}}
  for(const id of ['heavenlycharge','sevenstars','oneshot'])if(!(castTimeOf(id)>0))bad.push(id+' 시전 시간 없음');
  for(const id of ['bulwarkcounter','lordgale','starfallbow'])if(!SPELLS[id].charge)bad.push(id+' 모으기 아님');
  qOk(pas===4&&pas/44<.2,`패시브 ${pas}개`);qOk(!bad.length,bad.slice(0,10).join(', '));
  return `44개 · 패시브 ${pas}개(${Math.round(pas/44*100)}%) · 시전 ${J3WA_IDS.filter(id=>CAST_T[id]).length} · 모으기 ${J3WA_IDS.filter(id=>SPELLS[id].charge).length}`});
qT(QWA,'대상 표시: 파티(주변)/한 명/자신만이 붙음 · 파티 강화는 동료가 써도 내게 걸리고(유령 시전) 자신만 기술은 안 걸림',()=>{const bad=[];
  const want={bewall:'area',citadelecho:'area',unfallenkingdom:'area',earthanchor:'area',nighthunt:'area',exposeweak:'area',bloodoath:'area',wardrum:'area',fortressswap:'one',bloodharvest:'self',shadowhide:'self',poisonshade:'self',piercinggaze:'self'};
  for(const id in want){const r=PUI.rule(SPELLS[id]);if(!r||r.mode!==want[id])bad.push(`${id}: ${r?r.mode:'없음'}≠${want[id]}`);else if(!!r.party!==(want[id]==='area'))bad.push(id+' party 값')}
  qOk(!bad.length,bad.join(', '));
  qWAPrep('warrior');try{const r=qPeerOn();r.x=r.tx=P.x+120;r.y=r.ty=P.y;
    for(const [id,on] of [['bloodoath',1],['wardrum',1],['piercinggaze',0],['shadowhide',0],['poisonshade',0]]){P.buffs={};netGhostCast({from:'qa_peer',sp:id,L:19,x:Math.round(P.x),y:Math.round(P.y)});
      const b=P.buffs[id];if(!!b!==!!on)bad.push(`${id}: 동료 시전이 ${b?'걸림':'안 걸림'}`)}
    P.buffs={};netGhostCast({from:'qa_peer',sp:'bloodoath',L:19,x:P.x,y:P.y});qOk(P.buffs.bloodoath&&P.buffs.bloodoath.j3ls>0,'피의 맹세 흡혈 칸이 동료에게 안 옴');
    P.buffs={};netGhostCast({from:'qa_peer',sp:'wardrum',L:19,x:P.x,y:P.y});qOk(P.buffs.wardrum&&P.buffs.wardrum.critDmg>0&&P.buffs.wardrum.fzTo==='qa_peer','전쟁의 북 칸');
    qOk(!(NET.gerr||[]).length,'유령 시전 오류 '+(NET.gerr||[]).join(';'))}finally{qPeerOff()}
  qOk(!bad.length,bad.join(', '));return Object.keys(want).length+'개 표시 · 동료 시전 확인'});

/* --- 전쟁군주: 투혼 --- */
qT(QWA,'투혼(전쟁군주): 한 번 쓸 때 맞으면 1 · 연격의 마지막 일격 +2 · 최대 10 · 6초 뒤 1초에 1씩 줄어듦 · 대지 가르기가 모두 써서 길어지고 세짐',()=>{qWAPrep('warrior',['lordcombo','earthsplit']);
  const w=qWAMob('wolf',P.x+50,P.y);qCast('lordcombo',w);qWAst(70);qOk(J3W.fz===3,'연격 한 번 뒤 투혼 '+J3W.fz+' (1+2 기대)');
  jwFz(20);qOk(J3W.fz===10,'최대 '+J3W.fz);J3W.fzT=.05;qWAst(70);qOk(J3W.fz===9,'6초 뒤 줄어듦 '+J3W.fz);
  const run=fz=>{qClear();qWAClr();P.x=QWA_SPOT.x;P.y=QWA_SPOT.y;P.cd={};J3W.p=P;J3W.fz=fz;J3W.fzT=6;const n=qWADum(P.x+200,P.y),f=qWADum(P.x+R22.cap*.9,P.y);/* v22: 투혼 10이면 길이 480(사거리) — 예전 920 */QA.reseed(31);qCast('earthsplit',{x:P.x+300,y:P.y});qWAst(30);return{n:n.taken,f:f.taken,left:J3W.fz}};
  const a=run(0),b=run(10);qOk(a.n>0&&a.f===0,`투혼 0: 가까이 ${Math.round(a.n)} · 멀리(${Math.round(R22.cap*.9)}) ${Math.round(a.f)}`);qOk(b.f>0,`투혼 10인데 ${Math.round(R22.cap*.9)}까지 안 닿음`);qOk(b.n>a.n*2,`투혼 10 피해 ×${qR(b.n/a.n)}`);qOk(b.left===0,'투혼이 남음 '+b.left);
  qClear();return `연격 → 3 · 대지 가르기 ×${qR(b.n/a.n)} · 길이 320→480`});
qT(QWA,'피의 갈무리(자신만): 투혼이 없으면 안 씀(마나·재사용 그대로) · 투혼 하나마다 생명력 회복 · 투혼을 모두 씀',()=>{qWAPrep('warrior',['bloodharvest']);P.invT=0;
  P.hp=Math.round(maxHp()*.3);const mp=P.mp;tryCast('bloodharvest');qOk(P.mp===mp&&!(P.cd.bloodharvest>0),'투혼 없이 씀');
  J3W.fz=10;const h=P.hp;qOk(qCast('bloodharvest'),'시전 안 됨');qOk(J3W.fz===0,'투혼이 남음');const got=(P.hp-h)/maxHp();qOk(got>.3&&got<.5,'회복 '+qR(got));return `투혼 10 → ${Math.round(got*100)}%`});
qT(QWA,'전장의 피 · 전쟁의 북: 치명타 피해 + (더하는 식 · 모두 합쳐 +50%까지) · 북을 친 동료에게 투혼(wafz)',()=>{qWAPrep('warrior',['lordcombo']);const s=eff('lordcombo',19);
  const run=(bb,drum)=>{P.sk.battleblood=bb?10:0;passT=-1;qClear();P.buffs={_qc:{t:99,max:99,crit:.3,n:''}};if(drum)P.buffs.qa_cd={t:99,max:99,critDmg:5,n:''};QA.reseed(17);const e=qWADum(P.x+60,P.y);
    for(let i=0;i<80;i++)hurtE(e,1000,Object.assign({},s));return e.taken};
  const a=run(0),b=run(1),c=run(1,1);qOk(b>a*1.01,`전장의 피 10점 ×${qR(b/a)}`);qOk(c>b&&c<a*(1+.5/1.75*.5),'상한(+50%) ×'+qR(c/a));
  qWAPrep('warrior',['wardrum']);try{const {sent}=qPty(2);P.buffs.wardrum={t:9,max:9,critDmg:.1,fzTo:'qa_peer',n:'x'};J3W.drumT=-9;const e=qWAMob('wolf',P.x+60,P.y);hurtE(e,100,eff('lordcombo',19));
    qOk(qWAx(sent,'wafz').some(m=>m.to==='qa_peer'),'북 친 동료에게 투혼 안 보냄');J3W.fz=0;P.job3='warlord';netOnMsg({t:'j3x',k:'wafz',from:'qa_peer',to:NET.id});qOk(J3W.fz===1,'받은 투혼 '+J3W.fz)}finally{qPtyOff()}
  return `치명타 피해 ×${qR(b/a)} · 상한 ×${qR(c/a)}`});
qT(QWA,'무기 투척: 일직선을 꿰뚫고 되돌아오며 한 번 더 · 맞힌 적마다 투혼 1(최대 3)',()=>{qWAPrep('warrior',['weaponthrow']);const w=qWAMob('wolf',P.x+300,P.y);
  qCast('weaponthrow',{x:P.x+300,y:P.y});qWAst(90);qOk(w.max-w.hp>0,'안 맞음');qOk(J3W.fz===2,'가고 오며 투혼 '+J3W.fz);
  qClear();qWAClr();J3W.p=P;P.cd={};const ws=[150,250,350,450].map(dx=>qWAMob('wolf',P.x+dx,P.y));qCast('weaponthrow',{x:P.x+300,y:P.y});qWAst(90);qOk(J3W.fz===3,'최대 3이 아님 '+J3W.fz);qOk(qWAhit(ws)===4,'줄 위의 넷을 다 못 맞힘');
  qClear();return '되돌아옴 · 투혼 3'});
qT(QWA,'처단의 도약: 세 번 연달아 · 둘레의 적이 여럿이면 셋을 차례로 · 도약 사이 무적이 잠깐',()=>{qWAPrep('warrior',['executionleap']);const c={x:P.x+260,y:P.y},ds=[0,1,2].map(i=>qWADum(c.x+Math.cos(i*2.1)*110,c.y+Math.sin(i*2.1)*110));
  qCast('executionleap',c);qOk(J3W.leaps.length===3,'도약 '+J3W.leaps.length);qWAst(80);qOk(ds.every(d=>d.taken>0),'셋을 다 못 맞힘 '+ds.map(d=>d.hits).join('/'));qOk(dist(P,c)<250,'도약 안 함');qClear();return '3번 · 3마리'});
qT(QWA,'군주의 칼바람(모으기): 사방 검기 6줄 → 다 모으면 16줄 · 한 적은 한 번에 2번까지',()=>{qWAPrep('warrior',['lordgale']);
  tryCast('lordgale');qOk(J3CH&&J3CH.id==='lordgale','모으기 안 됨');j3ChargeRelease();const n0=J3W.waves.length;qWAClr();J3W.p=P;qWAst(10);
  P.cd={};const e=qWADum(P.x+120,P.y);qCast('lordgale');const n1=J3W.waves.length;qWAst(60);qOk(n0===6&&n1===16,`검기 ${n0} → ${n1}`);qOk(e.hits>=1&&e.hits<=2,'맞은 수 '+e.hits);qClear();return `${n0}줄 → ${n1}줄 · 한 적 ${e.hits}번`});
qT(QWA,'환영 기수: 기수 넷(투혼 10이면 여섯) · 내가 노리는 적을 함께 공격 · 15초 뒤 사라짐 · 다시 부르면 바뀜',()=>{qWAPrep('warrior',['phantomriders']);const e=qWADum(P.x+200,P.y);
  qCast('phantomriders');qOk(allies.filter(a=>a.j3r).length===4,'기수 '+allies.filter(a=>a.j3r).length);qWAst(150);qOk(e.taken>0,'기수가 안 때림');
  J3W.fz=10;qCast('phantomriders');qOk(allies.filter(a=>a.j3r).length===6,'투혼 10 기수 '+allies.filter(a=>a.j3r).length);
  for(const a of allies)if(a.j3r)a.t=.01;qWAst(3);qOk(!allies.some(a=>a.j3r),'안 사라짐');qClear();return '4 → 6 · 공격'});
qT(QWA,'천군의 돌격: 시전 1초 · 앞쪽 길이 480(v22 사거리, 예전 1100) 줄의 적을 모두 쓸고(옆·사거리 밖은 아님) 밀침 · 보스 무너짐 게이지 +45',()=>{qWAPrep('warrior',['heavenlycharge']);qOk(castTimeOf('heavenlycharge')===1,'시전 '+castTimeOf('heavenlycharge'));
  const far=qWADum(P.x+R22.cap*.9,P.y),beyond=qWADum(P.x+R22.cap+hR({k:'qa_dummy',r:22})+60,P.y),side=qWADum(P.x+400,P.y+330),b=qWABoss(P.x+500,P.y+40);qCast('heavenlycharge',{x:P.x+600,y:P.y});qWAst(90);
  qOk(far.taken>0,'멀리(사거리 90%) 안 맞음');qOk(beyond.taken===0,'사거리 밖이 맞음');qOk(side.taken===0,'옆(330)이 맞음');qOk((b.stg||0)>=45||b.brk>0,'무너짐 '+b.stg);qClear();return `무너짐 ${Math.round(b.stg||100)}`});

/* --- 성벽의 군주 --- */
qT(QWA,'군주의 자세 · 성벽 강타: 막을 때마다 마나 · 막은 뒤 다음 성벽 강타는 1.6배 + 기절 · 쓰면 풀림',()=>{qWAPrep('warrior',['rampartbash','lordstance']);
  P.mp=10;PTY.block(null);qOk(P.mp>20,'막기 마나 '+qR(P.mp));qOk(J3W.blkNext===1,'다음 강타 표시 없음');
  const run=blk=>{qClear();J3W.blkNext=blk;P.cd={};const e=qWADum(P.x+60,P.y),w=qWAMob('wolf',P.x+60,P.y+40);QA.reseed(5);qCast('rampartbash',{x:P.x+60,y:P.y});const st=w.stunT;return{d:e.taken,st}};
  const a=run(0),b=run(1);qOk(b.d>a.d*1.4,`막은 뒤 ×${qR(b.d/a.d)}`);qOk(b.st>0&&!(a.st>0),'기절');qOk(J3W.blkNext===0,'쓴 뒤에도 남음');
  qWAPrep('warrior',['lordstance'],{hurt:1});P.buffs.qa_b={t:99,max:99,blk:1,n:''};let n=0;for(let i=0;i<40&&!J3W.blkNext;i++){P.hp=maxHp();hitPlayer(20,null);n++}qOk(J3W.blkNext===1,'실제 막기로 안 켜짐');
  qClear();return `×${qR(b.d/a.d)} · 기절`});
qT(QWA,'바위 성벽: 몬스터가 지나가지 못함 · 몬스터의 투사체를 막음 · 보스·준보스는 부수고 멈칫(무너짐 게이지)',()=>{qWAPrep('warrior',['stonerampart']);
  qCast('stonerampart',{x:P.x+200,y:P.y});qOk(J3W.walls.length===1,'벽 없음');const w=qWAMob('wolf',P.x+420,P.y,{aggro:true});const x0=w.x;qWAst(150);
  qOk(w.x<x0-60,'늑대가 안 다가옴');qOk(w.x>P.x+200,`늑대가 벽을 지남 (${Math.round(w.x-P.x)})`);
  const p={x:P.x+320,y:P.y,z:18,vx:-500,vy:0,r:6,dmg:5,owner:'e',life:2,col:'#fff'};projs.push(p);qWAst(25);qOk(p.life<=0&&p.x>P.x+150,'투사체가 벽을 지남');
  qClear();qWAClr();J3W.p=P;P.cd={};qCast('stonerampart',{x:P.x+200,y:P.y});const b=qWABoss(P.x+300,P.y);qWAst(2);qOk(J3W.walls[0].t>0,'보스가 닿기 전에 부서짐');const L=jwWallPre();b.x=P.x+150;jwWallPost(L);
  qOk(J3W.walls[0].t<=0,'보스가 지나가는데 벽이 그대로');qOk(b.stunT>=.9,'멈칫 없음');qOk((b.stg||0)>=39||b.brk>0,'무너짐 '+b.stg);qClear();return `늑대 막힘 · 투사체 막힘 · 보스가 부숨(무너짐 ${Math.round(b.stg||100)})`});
qT(QWA,'무너지지 않는 왕국(파티): 나와 둘레 동료가 쓰러지지 않음(floor) · 끝날 때 받은 피해의 20%(최대 50%) 회복 · 동료에게 wakg',()=>{qWAPrep('warrior',['unfallenkingdom'],{hurt:1});
  try{const {sent}=qPty(2,{dx:200,host:true});qOk(qCast('unfallenkingdom'),'시전 안 됨');qOk(qWAx(sent,'floor').some(m=>m.to==='qa_peer')&&qWAx(sent,'wakg').some(m=>m.to==='qa_peer'),'동료에게 안 보냄');
    hitPlayer(maxHp()*3,null);qOk(!P.dead&&P.hp>=1,'쓰러짐');qOk(J3W.kg&&J3W.kg.acc>0,'받은 피해를 안 셈');const h=P.hp;J3W.kg.t=.02;qWAst(3);const got=(P.hp-h)/maxHp();qOk(got>.45&&got<=.51,'끝 회복 '+qR(got));
    J3W.kg=null;netOnMsg({t:'j3x',k:'wakg',from:'qa_peer',to:NET.id,d:12,h:.2,cap:.5,n:'왕국'});qOk(J3W.kg&&J3W.kg.t===12,'받는 쪽 왕국 없음');return `끝 회복 ${Math.round(got*100)}%`}finally{qPtyOff();J3W.kg=null}});
qT(QWA,'성벽이 되리라(파티): 둘레 동료가 받는 범위 공격(경고 뒤)의 60%를 성벽의 군주가 대신(wawd) · 범위 밖·일반 공격은 아님',()=>{qWAPrep('warrior',['bewall'],{hurt:1});
  try{const {r,sent}=qPty(2,{dx:150});qOk(qCast('bewall'),'시전 안 됨');qOk(qWAx(sent,'wawall').length===1,'성벽 알림 없음');
    netOnMsg({t:'j3x',k:'wawall',from:'qa_peer',to:NET.id,d:8,sh:.6,rad:350});qOk(J3W.lords.has('qa_peer'),'성벽 표 없음');P.buffs={};
    const hit=aoe=>{sent.length=0;P.hp=maxHp();J3W.aoe=aoe;try{hitPlayer(100,null)}finally{J3W.aoe=0}return qWAx(sent,'wawd')};
    let m=hit(1);qOk(m.length===1&&m[0].d===60&&m[0].to==='qa_peer','대신 받기 '+JSON.stringify(m));qOk(!hit(0).length,'일반 공격까지');r.x=P.x+500;qOk(!hit(1).length,'범위 밖까지');r.x=P.x+150;
    const h=P.hp;netOnMsg({t:'j3x',k:'wawd',from:'qa_peer',to:NET.id,d:50});qOk(P.hp<h,'대신 받은 피해가 안 들어옴');
    J3W.aoe=0;sent.length=0;updateWarns(0);qOk(J3W.aoe===0,'범위 표시가 남음');return '60% 대신'}finally{qPtyOff()}});
qT(QWA,'성채의 메아리(파티): 막을 때마다(0.6초에 한 번) 나와 둘레 동료에게 보호막(waesh)',()=>{qWAPrep('warrior',['citadelecho']);
  try{const {sent}=qPty(2,{dx:150});qOk(qCast('citadelecho'),'시전 안 됨');P.shield=0;J3W.echoT=-9;PTY.block(null);qOk(P.shield>0,'내 보호막 없음');qOk(qWAx(sent,'waesh').length===1,'동료에게 안 보냄');
    PTY.block(null);qOk(qWAx(sent,'waesh').length===1,'0.6초 안에 또 보냄');P.shield=0;netOnMsg({t:'j3x',k:'waesh',from:'qa_peer',to:NET.id,a:300,d:5});qOk(P.shield===300,'받은 보호막 '+P.shield);return '보호막'}finally{qPtyOff()}});
qT(QWA,'군주의 결투: 보스는 12초 동안 나만 노리고 무너짐 게이지 1.5배 · 다른 파티원의 피해도 게이지로 · 일반 몬스터는 결투 없음',()=>{qWAPrep('warrior',['lordduel']);
  try{qPty(2,{host:true});const b=qWABoss(P.x+250,P.y),w=qWAMob('wolf',P.x+250,P.y+200);qCast('lordduel',b);qWAst(40,{until:()=>b.j3duel});qOk(b.j3duel&&b.j3duel.t>10&&b.j3duel.by===0,'결투 없음');
    b.stg=0;PTY.stag(b,10,'qa');qOk(Math.abs(b.stg-15)<.01,'게이지 '+b.stg);const g=b.stg;PTY.onDmg(b,'qa_peer',b.max*.05,null);qOk(b.stg>g+5,'동료 피해가 게이지로 안 감');
    P.cd={};qCast('lordduel',w);qWAst(40);qOk(!w.j3duel,'일반 몬스터에 결투');return '결투 · 게이지'}finally{qPtyOff()}});
qT(QWA,'역습(모으기): 모으는 동안 받는 피해 -50% · 받은 피해를 모아 되갚음(더 세짐) · 놓으면 쏨',()=>{qWAPrep('warrior',['bulwarkcounter'],{hurt:1});
  const run=hit=>{qClear();P.cd={};P.hp=maxHp();P.face=0;const e=qWADum(P.x+150,P.y);QA.reseed(8);tryCast('bulwarkcounter',{x:e.x,y:e.y});qOk(J3CH&&J3CH.id==='bulwarkcounter','모으기 안 됨');
    qOk(P.buffs._j3ctr&&P.buffs._j3ctr.dr===.5,'피해 감소 없음');if(hit){P.invT=0;hitPlayer(400,null)}const st=J3W.store;qWAst(20);P.face=0;QA.reseed(9);j3ChargeRelease();qWAst(5);qOk(!P.buffs._j3ctr,'감소가 남음');return{d:e.taken,st}};
  const a=run(0),b=run(1);qOk(b.st>0,'받은 피해를 안 모음');qOk(a.d>0&&b.d>a.d,`되갚음 ${Math.round(a.d)} → ${Math.round(b.d)}`);qClear();return `모은 ${Math.round(b.st)} · ${Math.round(a.d)} → ${Math.round(b.d)}`});
qT(QWA,'대지 고정(파티 · 지대 안): 안의 나는 끌려가지 않음(j3PlayerAnchored) · 안의 적은 돌진이 끊김 · 동료가 깐 고정도',()=>{qWAPrep('warrior',['earthanchor']);const w=qWAMob('wolf',P.x+200,P.y);
  qCast('earthanchor');qWAst(2);qOk(j3PlayerAnchored(),'고정 안 됨');PTY.pull={e:w,t:2};qWAst(1);qOk(!PTY.pull,'끌려감이 남음');w.dash=.5;w.dvx=1;w.dvy=0;qWAst(1);qOk(!(w.dash>0),'돌진이 남음');
  P.x+=800;qWAst(20);qOk(!j3PlayerAnchored(),'밖에서도 고정');
  qWAPrep('warrior');try{const r=qPeerOn();r.x=r.tx=P.x+100;r.y=r.ty=P.y;netGhostCast({from:'qa_peer',sp:'earthanchor',L:19,x:Math.round(P.x),y:Math.round(P.y)});qWAst(2);qOk(j3PlayerAnchored(),'동료 고정이 안 걸림')}finally{qPeerOff()}
  return '고정'});
qT(QWA,'요새 이동(한 명): 혼자면 400 뛰어들어 둘레 도발 · 동료가 있으면 고른(없으면 생명력 낮은) 동료와 자리를 바꾸고 위협을 넘겨받음',()=>{qWAPrep('warrior',['fortressswap']);
  const w=qWAMob('wolf',P.x+390,P.y);const x0=P.x;qCast('fortressswap',{x:P.x+600,y:P.y});const d=P.x-x0;qOk(d>350&&d<=401,'뛴 거리 '+Math.round(d));qOk(w.tauntT>0||(w.thr&&w.thr.get(0)>0),'도발 안 됨');
  qWAPrep('warrior',['fortressswap']);try{const {r,sent}=qPty(2,{dx:350,host:true});r.hp=100;r.max=800;const e=qWAMob('wolf',r.x+60,r.y);e.thr=new Map([['qa_peer',500]]);const rx=r.x;
    qCast('fortressswap',{x:P.x,y:P.y});qOk(Math.abs(P.x-rx)<40,'자리를 안 바꿈 '+Math.round(P.x-rx));qOk(qWAx(sent,'waswap').some(m=>m.to==='qa_peer'),'동료에게 안 보냄');
    qOk(e.thr.get('qa_peer')===0&&e.thr.get(0)>=500,'위협 '+JSON.stringify([...e.thr]));
    const tx=P.x-200;netOnMsg({t:'j3x',k:'waswap',from:'qa_peer',to:NET.id,x:tx,y:P.y});qOk(Math.abs(P.x-tx)<30,'받는 쪽이 안 옮겨짐');return '혼자 400 · 동료와 자리 바꿈'}finally{qPtyOff()}});

/* --- 신궁: 호흡 --- */
qT(QWA,'호흡(신궁): 서 있으면 0.5초마다 1(최대 5) · 움직이면 0 · 호흡마다 치명타 확률 · 일격필살 시전 2초 → 호흡 5면 1초 · 쓰는 기술이 호흡을 써서 세짐',()=>{qWAPrep('archer',['breathmastery','oneshot','returnarrow']);
  J3W.br=0;J3W.brT=0;qOk(castTimeOf('oneshot')===2,'시전 '+castTimeOf('oneshot'));qWAst(190);qOk(J3W.br===5,'호흡 '+J3W.br);qOk(P.buffs._j3br&&P.buffs._j3br.crit>0,'치명타 없음');qOk(castTimeOf('oneshot')===1,'호흡 5 시전 '+castTimeOf('oneshot'));
  keys.add('KeyD');qWAst(3);keys.delete('KeyD');qWAst(1);qOk(J3W.br===0,'움직였는데 '+J3W.br);
  J3W.cx={id:'returnarrow',br:0};const m0=eff('returnarrow',19).mult;J3W.cx={id:'returnarrow',br:5};const m5=eff('returnarrow',19).mult;J3W.cx=null;qOk(Math.abs(m5/m0-1.4)<.01,'호흡 5 배율 ×'+qR(m5/m0));
  J3W.br=5;qCast('returnarrow',{x:P.x+300,y:P.y});qOk(J3W.br===0,'쓴 뒤 호흡 '+J3W.br);qClear();return '5 · 시전 1초 · ×1.4'});
qT(QWA,'바람 꿰기 · 바람 걸음: 적 둘을 꿰뚫음(호흡이 있으면 넷) · 바람 걸음은 옆으로 비켜 세 발 · 호흡을 잃지 않음',()=>{qWAPrep('archer',['windpierce','windstep']);
  const run=br=>{qClear();P.cd={};P.x=QWA_SPOT.x;P.y=QWA_SPOT.y;J3W.br=br;J3W.p=P;const ds=[150,260,370,480,590].map(dx=>qWADum(P.x+dx,P.y));qCast('windpierce',{x:P.x+300,y:P.y});qWAst(50);return ds.filter(d=>d.taken>0).length};
  const a=run(0),b=run(3);qOk(a===2,'호흡 없이 꿰뚫은 수 '+a);qOk(b===4,'호흡 있을 때 '+b);
  qClear();P.cd={};J3W.br=4;const x0=P.x,y0=P.y,n0=projs.length;qCast('windstep',{x:P.x+300,y:P.y});const d=Math.hypot(P.x-x0,P.y-y0);qOk(d>150,'비킨 거리 '+Math.round(d));qOk(projs.length-n0===3,'화살 '+(projs.length-n0));qOk(J3W.br>=4,'호흡 잃음 '+J3W.br);
  qClear();return `꿰뚫음 ${a} → ${b} · 비킴 ${Math.round(d)}`});
qT(QWA,'휘는 마탄: 적 다섯을 차례로 쫓아 맞힘',()=>{qWAPrep('archer',['curvingshot']);const c={x:P.x+280,y:P.y};const ds=[0,1,2,3,4,5].map(i=>qWADum(c.x+Math.cos(i*1.05)*150,c.y+Math.sin(i*1.05)*150));
  qCast('curvingshot',c);qWAst(300,{until:()=>!J3W.hom.length});const n=ds.filter(d=>d.taken>0).length;qOk(n===5,'맞힌 적 '+n);qClear();return '5마리'});
qT(QWA,'산탄 일제 사격: 앞쪽 넓은 부채꼴(300)만 맞고 뒤로 밀림',()=>{qWAPrep('archer',['scattervolley']);const f=qWAMob('wolf',P.x+150,P.y+40),b=qWAMob('wolf',P.x-150,P.y);const fx=f.x;
  qCast('scattervolley',{x:P.x+300,y:P.y});qWAst(10);qOk(f.hp<f.max,'앞이 안 맞음');qOk(f.x>fx+20,'안 밀림');qOk(b.hp===b.max,'뒤가 맞음');qClear();return '밀침 '+Math.round(f.x-fx)});
qT(QWA,'약점 공개(파티 공용 표식): 맞은 적은 12초 동안 모든 파티원의 치명타 확률 +15% · 동료에게 wamk · 받은 표식도',()=>{qWAPrep('archer',['exposeweak']);
  try{const {sent}=qPty(2);const e=qWAMob('wolf',P.x+300,P.y);qCast('exposeweak',e);qWAst(30,{until:()=>e.j3wk>0});qOk(e.j3wk>10&&Math.abs(e.j3wkC-.15)<.001,'표식 '+e.j3wk);
    qOk(qWAx(sent,'wamk').some(m=>m.id===e.id),'동료에게 안 보냄');
    const s=eff('windpierce',1),run=mk=>{qClear();const d=qWADum(P.x+80,P.y);if(mk){d.j3wk=12;d.j3wkC=.15}P.buffs={};QA.reseed(44);for(let i=0;i<120;i++)hurtE(d,1000,Object.assign({},s));return d.taken};
    const a=run(0),b=run(1);qOk(b>a*1.02,`표식 피해 ×${qR(b/a)}`);
    const e2=qWAMob('wolf',P.x+300,P.y+100);netOnMsg({t:'j3x',k:'wamk',from:'qa_peer',to:NET.id,id:e2.id,c:.15,d:12});qOk(e2.j3wk===12,'받은 표식 없음');return `×${qR(b/a)}`}finally{qPtyOff()}});
qT(QWA,'꿰뚫는 시선(자신만): 화살이 빗나가지 않음(보스도) · 피해 +',()=>{qWAPrep('archer',['piercinggaze']);const b=qWABoss(P.x+300,P.y,{real:1});const h0=hitChance(b),d0=dmgMul();
  qOk(h0<1,'원래 명중 '+h0);qOk(qCast('piercinggaze'),'시전 안 됨');qOk(hitChance(b)===1,'명중 '+hitChance(b));qOk(dmgMul()>d0,'피해 그대로');qClear();return `명중 ${qR(h0)} → 1`});
qT(QWA,'일곱 별의 화살: 시전 0.8초 · 보스·준보스를 먼저 노림 · 일곱 발 · 보스 무너짐 게이지(첫 발 12)',()=>{qWAPrep('archer',['sevenstars']);
  const ws=[0,1,2].map(i=>qWAMob('wolf',P.x+200+i*90,P.y+120)),b=qWABoss(P.x+450,P.y-60);qCast('sevenstars',{x:P.x+300,y:P.y});qOk(J3W.stars.length===7,'별 '+J3W.stars.length);qOk(J3W.stars[0].e===b,'보스를 먼저 안 노림');
  qWAst(60,{until:()=>b.stg>0||b.brk>0});qOk((b.stg||0)>=11||b.brk>0,'첫 발 무너짐 '+b.stg);qWAst(60);qOk(ws.every(w=>w.hp<w.max),'다른 적');qClear();return `무너짐 ${qR(b.stg||100)}`});
qT(QWA,'일격필살: 무너진 보스에게 2배 · 안 무너진 보스는 무너짐 게이지 +45',()=>{qWAPrep('archer',['oneshot']);const s=eff('oneshot',19);
  const run=(brk,k)=>{qClear();const b=qWABoss(P.x+300,P.y);if(brk)b.brk=5;QA.reseed(12);hurtE(b,1000,Object.assign({},s,k?{j3kill:null}:{}));return b.max-b.hp};
  const r=(run(1)/run(1,1))/(run(0)/run(0,1));qOk(Math.abs(r-2)<.05,'무너진 보스 배율 ×'+qR(r));
  qClear();const b=qWABoss(P.x+300,P.y);qCast('oneshot',b);qWAst(40,{until:()=>b.stg>0||b.brk>0});qOk((b.stg||0)>=42||b.brk>0,'무너짐 '+b.stg);qClear();return `×${qR(r)} · 무너짐 +45`});
qT(QWA,'별 떨구는 활(모으기): 모을수록 범위 300(스킬 레벨만큼)→500 · 무너짐 더 · 떨어진 자리 둘레를 모두 맞힘',()=>{qWAPrep('archer',['starfallbow']);const T={x:P.x+300,y:P.y};
  tryCast('starfallbow',T);j3ChargeRelease();const r0=J3W.sfall.length?J3W.sfall[0].rad:0;qWAClr();J3W.p=P;qWAst(60);P.cd={};
  const near=qWADum(T.x+100,T.y),far=qWADum(T.x+450,T.y);qCast('starfallbow',T);const r1=J3W.sfall.length?J3W.sfall[0].rad:0;qWAst(80);
  qOk(r0>=300&&r1>=490&&r1>r0+100,`범위 ${Math.round(r0)} → ${Math.round(r1)}`);qOk(near.taken>0&&far.taken>0,'다 모은 별이 둘레를 다 못 맞힘');qClear();return `${Math.round(r0)} → ${Math.round(r1)}`});

/* --- 그림자 사냥꾼 --- */
qT(QWA,'그림자 덫: 밟은 적과 둘레가 4초 묶임 · 보스 무너짐 게이지 +30',()=>{qWAPrep('archer',['shadowtrap']);const w=qWAMob('wolf',P.x+250,P.y),b=qWABoss(P.x+250,P.y+150);
  qCast('shadowtrap',{x:w.x,y:w.y});qWAst(60,{until:()=>b.stg>0||b.brk>0});qOk((b.stg||0)>=28||b.brk>0,'무너짐 '+b.stg);qWAst(30);qOk(w.hp<w.max&&w.rootT>2,'묶임 '+qR(w.rootT||0));qClear();return `묶임 ${qR(w.rootT)}초`});
qT(QWA,'심연 덫: 걸린 적(보스도)을 2초 끌어내려 멈추고 떨어뜨리며 큰 피해 · 보스 무너짐 +50',()=>{qWAPrep('archer',['abysstrap']);const b=qWABoss(P.x+250,P.y);
  qCast('abysstrap',{x:b.x,y:b.y});qWAst(60,{until:()=>b.j3sink});qOk(b.j3sink,'안 끌려감');qOk(b.stunT>0,'안 멈춤');qOk((b.stg||0)>=50||b.brk>0,'무너짐 '+b.stg);const h=b.hp;
  qWAst(150,{until:()=>!b.j3sink});qWAst(2);qOk(!b.j3sink&&b.hp<h,'떨어질 때 피해 없음');qClear();return '끌어내림 · 떨어짐'});
qT(QWA,'독 그림자: 덫에 걸린 적이 독(1초마다) · 독이 둘레 적에게 옮음',()=>{qWAPrep('archer',['poisonshade','shadowtrap']);qOk(qCast('poisonshade'),'시전 안 됨');
  const c=qWAMob('wolf',P.x+250,P.y),a=qWAMob('wolf',P.x+390,P.y),b=qWAMob('wolf',P.x+560,P.y);qCast('shadowtrap',{x:c.x,y:c.y});qWAst(40);qOk(c.j3ven||a.j3ven,'독 없음');
  /* 셋째 늑대가 돌아다니다 170 밖으로 가면 안 옮는 게 맞음 → 독 걸린 적 옆 120에 세워 둠(v20 통합: 난수 순서가 바뀌어 깜빡였음) */const s=c.j3ven?c:a;b.x=s.x+120;b.y=s.y;b.stunT=99;
  const h=b.hp;qWAst(150);qOk(b.hp<h,'옮지 않음');qClear();return '독 · 옮음'});
qT(QWA,'사냥터 봉쇄: 경계 밖으로 나가려는 적은 튕겨 돌아오고 1초 기절(보스는 무너짐 게이지)',()=>{qWAPrep('archer',['huntground']);const T={x:P.x+300,y:P.y};const w=qWAMob('wolf',T.x+150,T.y),b=qWABoss(T.x-150,T.y);
  qCast('huntground',T);const f=fields.find(f=>f.s.id==='huntground');qOk(f,'경계 없음');qWAst(2);w.x=f.x+f.rad+40;b.x=f.x-f.rad-40;w.stunT=0;qWAst(1);
  qOk(dist(w,f)<f.rad,'안 튕김 '+Math.round(dist(w,f)));qOk(w.stunT>.5,'기절 없음');qOk(dist(b,f)<f.rad&&((b.stg||0)>=20||b.brk>0),'보스 '+b.stg);qClear();return '튕김 · 기절'});
qT(QWA,'몰이 사냥: 넓은 범위(650)의 일반 몬스터를 한곳으로 몰고 내려침 · 보스는 안 끌림',()=>{qWAPrep('archer',['drivehunt']);const T={x:P.x+300,y:P.y};const w=qWAMob('wolf',T.x+450,T.y),b=qWABoss(T.x-450,T.y);const d0=dist(w,T),bx=b.x;
  qCast('drivehunt',T);qWAst(80);qOk(dist(w,T)<d0-150,'안 몰림 '+Math.round(dist(w,T)));qOk(Math.abs(b.x-bx)<2,'보스가 끌림');qWAst(120);qOk(w.hp<w.max,'내려침 피해 없음');qClear();return `${Math.round(d0)} → ${Math.round(dist(w,T))}`});
qT(QWA,'그림자 분신: 10초 동안 내 사격(60%)과 덫(50%)을 둘이 따라 함',()=>{qWAPrep('archer',['shadowclone','shadowarrow','shadowtrap']);qOk(qCast('shadowclone'),'시전 안 됨');qOk(J3W.cl,'분신 없음');
  const n0=projs.length;qCast('shadowarrow',{x:P.x+300,y:P.y});const np=projs.slice(n0),own=np.find(p=>!p.j3cl),cl=np.filter(p=>p.j3cl);qOk(own&&cl.length===2,'화살 '+np.length);qOk(Math.abs(cl[0].dmg/own.dmg-.6)<.01,'분신 화살 피해 '+qR(cl[0].dmg/own.dmg));
  const t0=traps.length;qCast('shadowtrap',{x:P.x+300,y:P.y});const nt=traps.slice(t0),tc=nt.filter(t=>t.j3cl);qOk(tc.length===2&&Math.abs(tc[0].dmg/nt.find(t=>!t.j3cl).dmg-.5)<.01,'덫 '+nt.length);
  J3W.cl.t=.01;qWAst(2);qOk(!J3W.cl,'안 사라짐');qClear();return '화살 1+2 · 덫 1+2'});
qT(QWA,'밤의 사냥(파티 · 지대 안): 밤 속 적의 공격은 25%(보스 10%) 빗나감 · 밤 속 동료 위협 절반 · 궁수 피해 +20%',()=>{qWAPrep('archer',['nighthunt'],{hurt:1});
  try{qPty(2,{host:true});const w=qWAMob('wolf',P.x+150,P.y,{dmg:5}),fr=qWAMob('wolf',P.x+1200,P.y,{dmg:5});qOk(qCast('nighthunt'),'시전 안 됨');qWAst(2);qOk(w.j3nT>0&&w.j3nm>0&&!(fr.j3nT>0),'밤 표시');
    const miss=src=>{let n=0;for(let i=0;i<400;i++){P.hp=maxHp();P.invT=0;const t0=texts.length;hitPlayer(5,src);if(texts.slice(t0).some(t=>t.t==='빗나감'&&t.c==='#b8a8e8'))n++}return n};
    const m=miss(w);qOk(m>60&&m<145,'빗나감 '+m+'/400');qOk(miss(fr)===0,'밤 밖에서도 빗나감');
    w.thr=new Map();PTY.thr(w,0,100);qOk(w.thr.get(0)===50,'위협 '+w.thr.get(0));P.x+=900;PTY.thr(w,0,100);qOk(w.thr.get(0)===150,'밖에서도 절반');P.x-=900;
    const s=eff('windpierce',1),dm=e=>{const h=e.hp;QA.reseed(3);P.buffs={};hurtE(e,1000,Object.assign({},s));return h-e.hp};const a=dm(w),b=dm(fr);qOk(Math.abs(a/b-1.2)<.03,'밤 피해 ×'+qR(a/b));
    return `빗나감 ${m}/400 · ×${qR(a/b)}`}finally{qPtyOff()}});
qT(QWA,'그림자 숨기(자신만): 적이 나를 놓침 · 내 위협 0(숨은 동안 안 쌓임) · 같이 하기에서 방장이 숨은 동료도 놓침(wahide)',()=>{qWAPrep('archer',['shadowhide']);
  try{const {sent}=qPty(2,{host:true,dx:200});const w=qWAMob('wolf',P.x+60,P.y,{aggro:true});PTY.thr(w,0,500);qCast('shadowhide');
    qOk(w.thr.get(0)===0,'위협 '+w.thr.get(0));PTY.thr(w,0,100);qOk(w.thr.get(0)===0,'숨은 동안 쌓임');qOk(enemyTarget(w).tg!==P,'아직 나를 노림');qOk(qWAx(sent,'wahide').length===1,'숨기 알림 없음');
    P.buffs={};netOnMsg({t:'j3x',k:'wahide',from:'qa_peer',to:NET.id,d:4});const t=enemyTarget(w).tg;qOk(t===P,'숨은 동료를 노림');return '놓침'}finally{qPtyOff()}});

/* --- 같이 하기 · 위계 · 그림 --- */
qT(QWA,'같이 하기: 동료의 3차 기술 44개(유령 시전)는 내 화면에서 그림만(피해·소환·위치 그대로, 오류 없음) · 시전 메시지에 투혼/호흡/모은 정도',()=>{const bad=[];
  for(const cls of ['warrior','archer']){qWAPrep(cls);try{const r=qPeerOn();r.x=r.tx=P.x-60;r.y=r.ty=P.y;r.cls=cls;NET.gerr=[];
    for(const id of J3WA_IDS){const s=SPELLS[id];if(s.cls!==cls||s.kind==='passive')continue;qClear();const d=qWADum(P.x+200,P.y),x=P.x,y=P.y,na=allies.length;
      const who=[],keep=hurtE;hurtE=function(e,a,s){if(e===d)who.push((s&&s.id)+(s&&s.ghost?'(유령)':'')+(GHOST?'G':''));return keep.apply(this,arguments)};
      try{netGhostCast({from:'qa_peer',sp:id,L:19,x:Math.round(d.x),y:Math.round(d.y),fz:5,br:3,cf:.5});qWAst(70,{renderEvery:35})}finally{hurtE=keep}
      if(d.taken>0)bad.push(id+' 피해 '+Math.round(d.taken)+' '+who.slice(0,3).join('/'));if(Math.hypot(P.x-x,P.y-y)>1)bad.push(id+' 내가 움직임');if(allies.length>na)bad.push(id+' 소환');if(P.cd[id]>0)bad.push(id+' 내 재사용')}
    if(NET.gerr.length)bad.push(...NET.gerr)}finally{qPeerOff()}}
  qWAPrep('warrior',['earthsplit']);try{const {sent}=qPty(2);J3W.fz=5;qCast('earthsplit',{x:P.x+200,y:P.y});const m=sent.find(m=>m.t==='cast'&&m.sp==='earthsplit');qOk(m&&m.fz===5,'투혼이 안 실림 '+JSON.stringify(m))}finally{qPtyOff()}
  qWAPrep('archer',['starfallbow']);try{const {sent}=qPty(2);qCast('starfallbow',{x:P.x+200,y:P.y});const m=sent.find(m=>m.t==='cast'&&m.sp==='starfallbow');qOk(m&&m.cf>=.9,'모은 정도가 안 실림 '+JSON.stringify(m))}finally{qPtyOff()}
  qOk(!bad.length,bad.slice(0,8).join(', '));return '40개 유령 시전 · fz · cf'});
qT(QWA,'그림: 밤·고정·경계 지대는 흰 원판 대신 따로 그림(그리는 동안만 목록에서 빼고 끝나면 되돌림) · 바위 성벽·별·기수·분신 등 그려도 오류 없음 · 입자 한도',()=>{qWAPrep('archer',['nighthunt','huntground','shadowclone','starfallbow','sevenstars']);
  qCast('nighthunt');qCast('huntground',{x:P.x+200,y:P.y});qCast('shadowclone');qWADum(P.x+250,P.y);qCast('sevenstars',{x:P.x+250,y:P.y});tryCast('starfallbow',{x:P.x+200,y:P.y});qWAst(20,{render:true});if(J3CH)j3ChargeRelease();
  const n=fields.length;qWAst(30,{render:true});qOk(fields.length===n&&fields.filter(jwZone).length===2,'지대가 사라짐 '+fields.length);qOk(!J3W.hold,'빼 둔 목록이 남음');
  qWAPrep('warrior',['stonerampart','phantomriders','earthanchor','unfallenkingdom','heavenlycharge']);qWADum(P.x+300,P.y);qCast('stonerampart',{x:P.x+200,y:P.y});qCast('phantomriders');qCast('earthanchor');qCast('unfallenkingdom');qCast('heavenlycharge',{x:P.x+400,y:P.y});
  qWAst(40,{render:true});qOk(parts.length<=900,'입자 '+parts.length);qOk(J3B.size>=10,'구운 그림 '+J3B.size);qClear();return `구운 그림 ${J3B.size}장`});
qT(QWA,'위계: 3차 공격 기술(10점)은 같은 직업 2차 공격 기술(20점)보다 셈(1초당 · 적 다섯 무리 ×1.3 · 한 마리 ×1.2)',()=>{const out=[],bad=[];
  for(const cls of ['warrior','archer']){qWAPrep(cls);const pack=(id,L)=>{qClear();qWAClr();J3W.p=P;P.x=QWA_SPOT.x;P.y=QWA_SPOT.y;P.cd={};P.buffs={};P.face=0;const c=qAt(0,['melee','nova','cone','counter','scatter','gale'].includes(SPELLS[id].kind)?80:200),es=[0,1,2,3,4].slice(0,N).map(i=>qWADum(c.x+Math.cos(i*1.257)*(i?60:0),c.y+Math.sin(i*1.257)*(i?60:0)));
      P.sk[id]=L;const s0=SPELLS[id];if(s0.job2){P.job3=null;P.job2=s0.job2}if(s0.job3)qJob3On(s0.job3);if(typeof clsGearFor==='function')clsGearFor(id);QA.reseed(77);if(!qCast(id,{x:c.x,y:c.y}))return 0;if(J3CH)j3ChargeRelease();
      const s=eff(id,skLv(id)),T=Math.min(10,Math.max(s.dur||0,s.delay||0,1)+2);qWAst(Math.ceil(T*60),{each:()=>{P.mp=maxMp();P.hp=maxHp()}});return es.reduce((a,e)=>a+e.taken,0)/Math.max(qCycle(id),1)};
    const j2=Object.keys(SPELLS).filter(id=>SPELLS[id].cls===cls&&SPELLS[id].job2&&isDmg(SPELLS[id])&&SPELLS[id].kind!=='trap'),j3=J3WA_IDS.filter(id=>SPELLS[id].cls===cls&&isDmg(SPELLS[id])&&!['trap','riders'].includes(SPELLS[id].kind));
    let N=5;const avg=(ids,L)=>ids.reduce((a,id)=>{const v=pack(id,L);if(window.__QWA_DBG)out.push(id+':'+Math.round(v));return a+v},0)/ids.length;const a2=avg(j2,20),a3=avg(j3,10);N=1;const b2=avg(j2,20),b3=avg(j3,10);
    out.push(`${QCN[cls]} 다섯 무리 2차 20점 ${Math.round(a2)}/초 · 3차 10점 ${Math.round(a3)}/초 (×${qR(a3/a2)}) · 한 마리 ×${qR(b3/b2)}`);if(!(a3>a2*1.3))bad.push(cls+' 무리 ×'+qR(a3/a2));if(!(b3>b2*1.2))bad.push(cls+' 한 마리 ×'+qR(b3/b2))}
  qClear();qOk(!bad.length,bad.join(', ')+' || '+out.join(' | '));return out.join(' | ')});
const QIC25T={p:'<'+'path',u:'<'+'use'};/* 태그 모양 글자를 그대로 적으면 게임 링크 올리기 도구가 이 페이지를 다른 종류(검토 페이지)로 오해해 그림 파일을 못 올린다 */
/* ---------- v25 아이콘 (icons25.js): 마법사·사제 스킬마다 다른 그림 · 사제 계열 색 (사용자 2026-10-10) ---------- */
qT('아이콘 v25','마법사·사제: 같은 직업 안에서 같은 그림 0 · 사제 계열 색(심판 금·퇴마 보라·치유 초록·수호 파랑·축복 분홍), 1차는 탭 = 계열 · 치유 탭은 모두 초록 · 패시브 점선 고리 · 3차 금빛 테두리 · 예전 그림(파티 표시)도 그려짐 · 출처 한 줄',()=>{const bad=[];let n=0;
  for(const c of ['mage','priest']){const ids=Object.keys(SPELLS).filter(id=>SPELLS[id].cls===c&&TREE[id]!=null),seen=new Map(),svgs=new Set();
    for(const id of ids){const s=SPELLS[id],svg=spellSvg(s);n++;if(!IC25.has(s)){bad.push(id+' 새 그림 없음');continue}
      const k=IC25.MAP[id];if(seen.has(k))bad.push(`${id}·${seen.get(k)} 같은 그림`);seen.set(k,id);svgs.add(IC25.P[k]);
      {const d=IC25.P[IC25.MAP[id]],T=QIC25T;if(!d||svg.split(T.p+' d="'+d+'"').length!==3||svg.includes(T.u))bad.push(id+' 모양')}/* v25 메인: 그림자 + 본 모양 두 번(use href 없이 · 게임 링크 올리기 검사) */
      if(s.kind==='passive'&&!svg.includes('stroke-dasharray="2.5 2.5"'))bad.push(id+' 패시브 고리');
      if(s.job3&&!svg.includes('#e8c35a'))bad.push(id+' 3차 금빛 테두리');
      if(c==='priest'){const f=IC25.fam(s);if(!IC25.FAM[f])bad.push(id+' 계열 없음');else if(!svg.includes(IC25.FAM[f][0]))bad.push(id+' 계열 색');
        const t=String(TREE[id]);if(/^[0-4]$/.test(t)&&f!==IC25.PTAB[+t])bad.push(id+' 탭과 계열 다름');if(t==='2'&&f!=='heal')bad.push(id+' 치유인데 초록 아님')}}
    if(svgs.size!==ids.length)bad.push(`${c} 모양 겹침 ${ids.length-svgs.size}`)}
  if(IC25.has({id:'qa_no_such_skill',kind:'ward'}))bad.push('표에 없는 기술도 새 그림');/* 표에 없는 것(파티 표시 등)은 예전 그림으로 */
  const cr=document.getElementById('auCredits');if(cr&&!cr.querySelector('.ic25cr'))bad.push('출처 줄 없음');
  qOk(!bad.length,bad.slice(0,8).join(', '));return `마법사·사제 ${n}개 모두 다른 그림 · 사제 5계열 색`});
async function qaRun(){
  const t0=performance.now();qaMigr={slot0:qRaw('arseia-char-0'),old:qRaw(QA_OLDKEY)};const pt=$('#patch');if(pt)pt.hidden=true;
  // 마법 적중 · 비공격 마법: 직업별로 항목을 펼친다 (준비 항목 뒤)
  const list=[];for(const t of QT){list.push(t);const m=/^(마법사|사제|전사|궁수): 준비$/.exec(t.name);if(t.group==='마법 적중'&&m){const cls=Object.keys(QCN).find(k=>QCN[k]===m[1]);
      for(const id of qSpellList(cls))list.push({group:'마법 적중',name:`${m[1]} ${SPELLS[id].n} (${id}·${SPELLS[id].kind}·${SPELLS[id].rank}위계)`,fn:()=>{if(P.cls!==cls)qPrep(cls);const r=qSpellHit(id);qOk(!r.out.length,r.out.join('; '));return `피해 합 ${Math.round(r.totalDmg)} (3곳)`}});
      for(const id of qSupList(cls))list.push({group:'비공격 마법',name:`${m[1]} ${SPELLS[id].n} (${id}·${SPELLS[id].kind})`,fn:()=>{if(P.cls!==cls)qPrep(cls);return qSupport(id)}})}}
  if(window.__QA_ONLY){const re=new RegExp(window.__QA_ONLY);for(let i=list.length-1;i>=0;i--)if(!re.test(list[i].group+' '+list[i].name)&&!/준비$/.test(list[i].name))list.splice(i,1)}
  const sum={total:list.length,pass:0,fail:0,ms:0},res=[];qaOverlay(res,sum,false);
  for(const t of list){QA.phase=t.name;const e0=QA.errors.length,s=performance.now();let pass=true,reason='';
    try{const r=await t.fn();if(typeof r==='string')reason=r}catch(err){pass=false;reason=(err instanceof QAFail?'':'예외: ')+(err&&err.message||String(err))+(err instanceof QAFail?'':' | '+String(err&&err.stack||'').split('\n').slice(1,3).join(' ').trim())}
    const ne=QA.errors.slice(e0);if(ne.length){pass=false;reason=(reason?reason+' | ':'')+'페이지 오류: '+ne.join('; ')}
    const b=qBad();if(b.length&&pass){pass=false;reason=b.join(',')}
    res.push({group:t.group,name:t.name,pass,reason,ms:Math.round(performance.now()-s)});pass?sum.pass++:sum.fail++;sum.ms=Math.round(performance.now()-t0);
    if(res.length%6===0)qaOverlay(res,sum,false);await qSleep()}
  QA.phase='done';qClosePanels();sum.ms=Math.round(performance.now()-t0);
  // 게임을 조용한 상태로 두고 루프를 풀어 준다
  try{qPrep('mage');qClear();paused=true}catch(_){}
  const out={version:typeof PATCHES!=='undefined'?PATCHES[0].v:null,results:res,summary:{total:res.length,pass:sum.pass,fail:sum.fail,ms:sum.ms},perf:qaPerf,realStorageAccess:QA.realAccess,realStorageLog:QA.realLog,
    sessionStorageAccess:QA.sessionAccess,pageErrors:QA.errors.slice(),storeWrites:QA.storeLog.filter(o=>o.op==='set').length,storeRemoves:QA.storeLog.filter(o=>o.op!=='set').map(o=>o.op+':'+o.k),pcap:Q.pcap};
  qaOverlay(res,sum,true);window.__QA_RESULT=JSON.parse(JSON.stringify(out));QA.release()}
/* ===== v25 최적화: 격자 밀어내기 · 쉬는 화면 30 · 자동 해상도 ===== */
qT('성능','v25 몬스터끼리 밀어내기(격자): 겹친 몬스터는 떨어지고, 먼 몬스터는 안 움직임',()=>{qPrep('mage');
  try{const k=Object.keys(TYPES).find(k=>!TYPES[k].boss&&!TYPES[k].mini);const x=P.x+400,y=P.y;const a=dgMob(k,x,y,10),b=dgMob(k,x+2,y,10),c=dgMob(k,x+600,y,10);for(const e of [a,b,c]){e.atkCd=99;e.spd=0}
    const cx=c.x;updateEnemies(.001);const d=Math.hypot(a.x-b.x,a.y-b.y);qOk(d>2.5,`겹친 둘 거리 ${d.toFixed(1)}`);qOk(Math.abs(c.x-cx)<5,'떨어진 몬스터는 밀리지 않음');return `겹친 둘 ${d.toFixed(1)}만큼 떨어짐`}finally{qClear()}});
qT('성능','v25 쉬는 화면 자동 절전: 2초 동안 움직임 없으면 30 · 움직이면 60 · 절전(30) 설정은 늘 30',()=>{const f0=GFX.fps,t0=IDLE.t;
  try{GFX.fps=60;IDLE.t=0;const busy=frameCapMs();IDLE.t=3;const idle=frameCapMs();GFX.fps=30;IDLE.t=0;const s30=frameCapMs();
    qOk(busy<17||!document.hasFocus(),`움직일 때 ${busy}`);qOk(idle>33,`쉴 때 ${idle}`);qOk(s30>33,'절전 설정');return `움직임 ${busy} · 쉼 ${idle} · 절전 ${s30}ms`}finally{GFX.fps=f0;IDLE.t=t0}});
qT('성능','v25 자동 해상도: 「자동」에서만 쓰고, 높음·보통·낮음은 고른 값 그대로',()=>{const q0=GFX.q,c0=AUTOR.cap;
  try{GFX.q='auto';AUTOR.cap=1.25;const a=gfxDprCap();GFX.q='high';const h=gfxDprCap();GFX.q='mid';const m=gfxDprCap();GFX.q='low';const l=gfxDprCap();
    qOk(a===1.25&&h===1.5&&m===1.25&&l===1,`자동 ${a} 높음 ${h} 보통 ${m} 낮음 ${l}`);return `자동 ${a} · 높음 ${h} · 보통 ${m} · 낮음 ${l}`}finally{GFX.q=q0;AUTOR.cap=c0;resize()}});
qT('성능','v26 던전 벽 묶어 그리기: 묶어 그린 화면이 벽마다 그린 화면과 같음 (방 4곳 · 벽 앞뒤 몬스터 포함)',()=>{qPrep('mage');
  try{enterDungeon(CAVES[0]);qOk(DG,'던전 못 들어감');const k=Object.keys(TYPES).find(k=>!TYPES[k].boss&&!TYPES[k].mini);let worst=0,early=0,n=0;
    const shot=()=>{render();return ctx.getImageData(0,0,cv.width,cv.height).data};
    for(const r of DG.rooms.slice(0,4)){qClear();const c=tc(r.cx,r.cy);P.x=c.x;P.y=c.y;
      // 방 가장자리(벽 바로 앞)와 가운데에 몬스터
      for(const [i,j] of [[r.i,r.j],[r.i+r.w-1,r.j],[r.i,r.j+r.h-1],[r.i+r.w-1,r.j+r.h-1],[r.cx+1,r.cy]]){const q=tc(i,j);const e=dgMob(k,q.x,q.y,10);if(e){e.atkCd=99;e.spd=0}}
      for(let f=0;f<3;f++)render();window.__WBOFF=1;const a=shot();window.__WBOFF=0;const e0=WB.stat.early;for(let f=0;f<60;f++)render();const b=shot();early+=WB.stat.early-e0;
      let bad=0;for(let p=0;p<a.length;p+=4)if(Math.abs(a[p]-b[p])>24||Math.abs(a[p+1]-b[p+1])>24||Math.abs(a[p+2]-b[p+2])>24)bad++;worst=Math.max(worst,bad/(a.length/4));n++}
    qOk(early>0,'묶음을 한 번도 안 씀');qOk(worst<.002,`다른 점 ${(worst*100).toFixed(2)}%`);return `방 ${n}곳 · 묶어 그린 횟수 ${early} · 가장 많이 다른 점 ${(worst*100).toFixed(3)}%`}finally{window.__WBOFF=0;qClear();if(DG)leaveDungeon()}});
qT('성능','v26 땅 무늬 그림이 새로 와도 다 구운 땅을 지우지 않고, 새로 다 구우면 바꿔 끼움',()=>{qPrep('mage');
  try{for(let f=0;f<400;f++){render();runChunkJobs(50);if(chunks.size&&[...chunks.values()].every(c=>c.ready))break}const rd=[...chunks.values()].filter(c=>c.ready);qOk(rd.length>0,'구운 조각 없음');const cv0=new Map(rd.map(c=>[c,c.cv]));
    chunkStale();qOk(rd.every(c=>chunks.get(c.cx*1000+c.cy)===c&&c.ready&&c.stale),'다 구운 조각이 지워짐(흐린 미리보기로 돌아감)');
    for(let f=0;f<600&&rd.some(c=>c.stale&&c.used>=frameN-2);f++){render();runChunkJobs(50)}const vis=rd.filter(c=>c.used>=frameN-2);
    qOk(vis.length&&vis.every(c=>!c.stale&&c.cv!==cv0.get(c)&&c.ready),'보이는 조각을 새로 굽지 않음');return `조각 ${rd.length}개 유지 · 보이는 ${vis.length}개 새로 구움`}finally{qClear()}});
qT('던전','v26 던전에서 쓰러지면(사용자 13:14): 혼자 · 같이 하기 방에 혼자 → 마을에서 일어남 · 다시 들어가면 보스 생명력 가득(분노 · 분신 없음) · 같은 던전에 살아 있는 동료가 있을 때만 던전 입구에서',()=>{
  const D=DUNGEONS.find(d=>d.id==='sanctum'),c=CAVES.find(c=>c.cave===D);const out=[];
  const home=ALLTOWNS.find(t=>t.reg===(D.reg||'home'));
  const go=()=>{if(REG.id!==(D.reg||'home'))switchRegion(D.reg||'home');P.x=c.x;P.y=c.y+40;qStep(1,{render:false});doAct();qOk(DG&&DG.d===D,'못 들어감')};
  const die=()=>{P.hp=0;P.dead=true;$('#death').hidden=false;$('#respawn').onclick()};
  const hurtBoss=()=>{const b=DG.boss;qOk(b&&!b.dead,'보스 없음');b.aggroed=true;b.hp=Math.round(b.max*.42);P.x=b.x-160;P.y=b.y;qStep(40,{render:false,each:()=>{P.hp=maxHp();P.dead=false}});return b};
  try{qEnter(D);P.home=home.id;const g0=DG;
    // 1) 혼자: 보스를 반 넘게 깎아 분노 · 분신까지 나온 뒤 쓰러짐
    let b=hurtBoss();qOk(b.rage,'분노 안 함');const cl=enemies.filter(e=>e.clone&&!e.dead).length;
    die();qOk(!DG&&!P.dead&&$('#death').hidden,'던전 안에서 일어남(혼자)');qOk(dist(P,home)<260,`${home.n} 근처가 아님`);
    go();qOk(DG===g0&&DG.kept22,'기억한 던전이 아님');b=DG.boss;qOk(enemies.includes(b)&&b.hp===b.max&&!b.rage&&!b.mg,`보스 생명력 ${b.hp}/${b.max} · 분노 ${b.rage}`);
    qOk(!enemies.some(e=>e.clone&&!e.dead),'분신이 남음');out.push(`혼자: 마을 · 보스 가득(분신 ${cl} → 0)`);
    hurtBoss();leaveDungeon();go();qOk(DG===g0&&DG.boss.hp===DG.boss.max&&!DG.boss.rage,'걸어 나왔다 들어가도 보스가 그대로');out.push('걸어 나와도 보스 가득');
    // 2) 같이 하기 방에 혼자(동료 없음)
    NET.on=true;NET.ws=null;NET.peers.clear();hurtBoss();die();qOk(!DG,'방에 혼자인데 던전 안에서 일어남');go();qOk(DG.boss.hp===DG.boss.max,'방에 혼자: 보스가 그대로');out.push('방에 혼자: 마을');
    // 3) 같은 던전에 살아 있는 동료 → 던전 입구 방, 동료가 쓰러졌거나 다른 곳 → 마을
    const r=qPeerOn();r.area=netArea();die();qOk(DG===g0&&!P.dead,'동료가 있는데 마을로 감');const p0=tc(DG.start.cx,DG.start.cy);qOk(dist(P,p0)<80,'입구 방이 아님');
    r.dead=true;die();qOk(!DG,'동료가 쓰러졌는데 던전 안에서 일어남');go();r.dead=false;r.area=-1;die();qOk(!DG,'동료가 다른 곳인데 던전 안에서 일어남');out.push('동료 있음: 입구 · 동료 쓰러짐/다른 곳: 마을');
    qPeerOff()}
  finally{NET.on=false;NET.peers.clear();K22.m.clear();if(DG)leaveDungeon();if(REG.id!=='home')loadRegion('home');$('#death').hidden=true;P.dead=false;paused=false}
  return out.join(' · ')});
qT(QM22,'v26 휴대폰 오른쪽 세로 단축창(사용자 13:17): 고른 계열 스킬만 오른쪽 가에 세로로 · 작은 지도와 마나 구슬 사이 · 서로 안 겹침 · 눌러서 시전 · 아래 단축바는 구슬 사이 그대로 · PC는 그대로 · 저장 왕복',()=>{qPrep('mage',{lvl:40});
  const ids=qM22Bar(12);P.pot.hp=3;P.pot.mp=3;const out=[];const cats=[...new Set(ids.map(s26Cat))];const pick=cats.slice(0,2),want=ids.filter(id=>pick.includes(s26Cat(id)));
  qOk(want.length>=2,'고를 스킬이 적음 '+want.length);const bar0=JSON.stringify(P.bar);
  try{P.side26=pick.slice();
    for(const [m,w,h] of [['L',844,390],['P',390,844]])qM22(m,w,h,()=>{const side=[...document.querySelectorAll('#bar .sk.s26')];
      qOk(side.length===want.length&&side.every(b=>pick.includes(s26Cat(P.bar[+b.dataset.slot]))),`${m}: 세로 칸 ${side.length}/${want.length}`);
      const rc=qmR(document.querySelector('#hud .rightcol')),mp=qmR(document.querySelector('.orb.mp')),rs=side.map(qmR);
      for(const r of rs){qOk(r.right<=w+.5&&r.right>=w-120&&r.left>=0,`${m}: 오른쪽 가가 아님 ${Math.round(r.left)}~${Math.round(r.right)}`);qOk(r.top>=rc.bottom-.5&&r.bottom<=mp.top+.5,`${m}: 작은 지도/마나 구슬과 겹침 ${Math.round(r.top)}~${Math.round(r.bottom)}`);qOk(r.width>=36,`${m}: 칸 작음`)}
      for(let i=0;i<rs.length;i++)for(let j=i+1;j<rs.length;j++)qOk(!qmOv(rs[i],rs[j]),`${m}: 세로 칸끼리 겹침`);
      const hp=qmR(document.querySelector('.orb.hp')),rest=m22Shown().filter(b=>!b.classList.contains('s26')).map(qmR);
      for(const r of rest)qOk(r.left>=hp.right-.5&&r.right<=mp.left+.5,`${m}: 아래 단축바가 구슬 밖`);
      const q=document.getElementById('qhud');if(q&&q.offsetParent!==null){const qr=qmR(q);for(const r of rs)qOk(!qmOv(qr,r),`${m}: 의뢰 칸과 겹침`)}
      // 눌러서 시전: 세로 칸도 단축바처럼
      const b=side[0],id=P.bar[+b.dataset.slot];P.cd={};P.mp=maxMp();castReset();b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));
      const ok=(CAST.cur&&CAST.cur.id===id)||(P.cd[id]>0);qOk(ok,`${m}: 세로 칸을 눌러도 ${SPELLS[id].n}이(가) 안 나감`);castReset();P.cd={};
      out.push(`${m} ${side.length}칸 ${Math.round(rs[0].width)}px`)});
    qOk(JSON.stringify(P.bar)===bar0,'단축칸(P.bar)이 바뀜');
    buildBar();qOk(!document.querySelector('#bar .sk.s26')&&!document.body.classList.contains('s26on'),'PC 화면에도 세로 칸');
    const d=JSON.parse(JSON.stringify(saveData()));qOk(JSON.stringify(d.side26)===JSON.stringify(pick),'저장 '+JSON.stringify(d.side26));
    qPrep('priest');qOk(!P.side26||!P.side26.length,'다른 캐릭터에 따라옴');
    qOk(load(d,QA_SLOT),'불러오기 실패');qOk(JSON.stringify(P.side26)===JSON.stringify(pick),'불러온 값 '+JSON.stringify(P.side26));
    const old=Object.assign({},d);delete old.side26;qOk(load(old,QA_SLOT),'예전 저장 불러오기 실패');qOk(Array.isArray(P.side26)&&!P.side26.length&&!('side26' in saveData()),'예전 저장에 세로 칸이 생김');
    const bad=Object.assign({},d,{side26:['t1','<b>',3,'t1','j2']});load(bad,QA_SLOT);qOk(JSON.stringify(P.side26)==='["t1","j2"]','손상된 값 '+JSON.stringify(P.side26));
    // 설정 ⚙ 목록: 휴대폰에서만 계열 단추
    qM22('L',844,390,()=>{set24Open(true);const n=SET24.el.querySelectorAll('[data-s26]').length;set24Open(false);qOk(n>=CLASSES[P.cls].trees.length,'설정에 계열 단추 '+n)});
    set24Open(true);const n0=SET24.el.querySelectorAll('[data-s26]').length;set24Open(false);qOk(n0===0,'PC 설정에도 계열 단추')}
  finally{P.side26=[];buildBar()}
  return out.join(' · ')});
qT('던전','v26 던전 바닥에 들판 장식이 겹쳐 보이지 않음(사용자 13:25 폭풍 첨탑 · 재의 성소): 들판에서 들어가 바닥을 다 구워도 들판의 밀 · 꽃 · 덤불을 그리지 않음 (남부 · 황금 평원 동굴 모두)',()=>{qPrep('mage',{lvl:40});
  const d0=RD.draw;let bad=0,seen=0,n=0;const out=[];const p0=paused;
  try{for(const rg of ['home','plains']){if(DG)leaveDungeon();if(REG.id!==rg)switchRegion(rg);
      for(const c of CAVES.filter(c=>c.cave&&!c.cave.trial&&!c.cave.arena&&c.cave.w3k!=='trial')){if(DG)leaveDungeon();K22.m.clear();
        P.x=c.x;P.y=c.y+40;followCam();paused=true;for(let f=0;f<6;f++){render();runChunkJobs(40)}decoIdx();
        enterDungeon(c);if(!DG||DG.d!==c.cave)continue;n++;const fd=new Set(decor);
        RD.draw=function(g,d){if(fd.has(d))bad++;return d0.apply(this,arguments)};
        for(const r of [DG.rooms[0],DG.rooms[DG.rooms.length>>1],DG.rooms[DG.rooms.length-1]]){const q=tc(r.cx,r.cy);P.x=q.x;P.y=q.y;followCam();
          for(let f=0;f<40;f++){render();runChunkJobs(60);if([...chunks.values()].every(k=>k.ready&&k.iso))break}
          for(const k of chunks.values())if(DFLAT.get(k.cx*1000+k.cy))seen++}
        RD.draw=d0;if(bad){out.push(`${c.cave.n} ${bad}`);bad=0}}}
    qOk(n>=4,'들어간 던전 '+n);qOk(seen>0,'같은 자리에 들판 장식이 있는 조각이 없음(시험이 겨누지 못함)');qOk(!out.length,'던전 바닥에 들판 장식: '+out.join(' · '))}
  finally{RD.draw=d0;paused=p0;if(DG)leaveDungeon();K22.m.clear();if(REG.id!=='home')loadRegion('home')}
  return `던전 ${n}곳 · 들판 장식과 겹치는 조각 ${seen}개 · 그려진 들판 장식 0`});
window.__QA_RUN=qaRun;
setTimeout(()=>{qaRun().catch(e=>{window.__QA_RESULT={fatal:String(e&&e.stack||e),results:[],summary:{total:0,pass:0,fail:1}}})},120);
}
