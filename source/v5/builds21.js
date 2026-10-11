/* ==========================================================================
   v21 · 빌드 핵심 장비 (thread "v21 직업별 빌드 핵심 유니크")
   설계서: rpg/v21-builds/v21-빌드-핵심장비-설계서.md · 인계: rpg/v21-builds/인계안내-v21.md
   v19 소스(src/v5) 기준으로 만들고 시험했다. v21(BUILDS)에서 v20 코드에 맞춰 고침: 3차 탭 id · 아이템 레벨 140 · 착용 캐시 ·
   v20 상태 이름(freezeT/slowT/rootT) · 기본 사격(궁수 aspd) · 둘레 공격 맞힌 수 세기. 걸어 두는 자리(드랍·퀘스트·툴팁·저장)는 builds21q.js.
   build.sh: act3-21.js 뒤, quest21.js 앞(job2q.js · job3* · 엔드컨텐츠 파일보다 뒤, b5.js 앞).
   b2.js의 공식 다섯 줄(bonusLv · cdOf · costAt · dmgScale · dmgMul)은 인계안내의 「바꿀 줄」대로 바꾼다.
   이 파일의 함수는 그 공식이 부르는 값만 계산한다(core21Cap, core21Dmg, core21Mc, core21Pen).
   모든 수치는 덧셈이다. 저장 형식은 그대로이고, 아이템에 core:'경로 id'만 더 붙는다.
   ========================================================================== */

// 3차 갈래 탭 id — v20 실제 TREE 값('j3_'+3차 갈래, job3.js · JOB3_OF)
const J3TAB21={archmage3:'j3_archsorcerer',summoner3:'j3_spiritking',inquisitor3:'j3_executor',saint3:'j3_saint',
  guardian3:'j3_bulwark',warlord3:'j3_warlord',hawkeye3:'j3_divinearcher',ranger3:'j3_shadowhunter'};

// 대상 스킬 고르기: trees(1차 계열 번호) · tabs(2·3차 탭 id) · el(원소) · kinds(종류) · ids(낱개)
function core21Tag(tag,id){const s=SPELLS[id];if(!s||!tag)return false;const t=TREE[id];
  if(tag.cls&&s.cls!==tag.cls)return false;
  if(tag.el&&s.el===tag.el)return true;
  if(tag.trees&&tag.trees.includes(t))return true;
  if(tag.tabs&&tag.tabs.includes(t))return true;
  if(tag.kinds&&tag.kinds.includes(s.kind))return true;
  if(tag.ids&&tag.ids.includes(id))return true;
  return false}

/* 핵심 장비 16개.
   st: 아이템 수치(int/hp/mp/regen·atk/blk/acc 등은 기존 유니크처럼 기본 굴림의 배수, 나머지는 그대로)
   cdmg: 대상 스킬 피해 %(dmgScale 칸에 덧셈) · cmc: 대상 스킬 마나 소모 % · tpen: 피해 강화 칸 −% (시간의 길)
   path: power | time | well · fx: 특수 효과 id */
const CORE21=[
  // 마법사
  {id:'c_sunash',n:'재가 된 태양의 홀',slot:'staff',cls:'mage',path:'power',st:{int:1.9,tr_0:2,el_fire:25,crit:6},tag:{cls:'mage',el:'fire'},fx:'ember',
    lore:'해가 지는 것을 본 마지막 마법사가 남긴 재.',src:'3차 지역 던전 보스 · 재의 군주'},
  {id:'c_stillwater',n:'고요한 수면의 홀',slot:'staff',cls:'mage',path:'well',st:{int:1.7,tr_1:2,el_ice:15,mp:1.3},cmc:30,tag:{cls:'mage',el:'ice'},fx:'ripple',
    lore:'물결이 멎은 자리에서만 마나가 고인다.',src:'스승의 마지막 시험 · 어둠 단계 보스'},
  {id:'c_stilltime',n:'멈춘 시간의 겉옷',slot:'robe',cls:'mage',path:'time',st:{hp:1.4,tr_4:2,cdr:15,mp:1},tpen:8,fx:'tick',tag:{cls:'mage'},
    lore:'초침이 없는 옷. 입은 사람만 서두른다.',src:'어둠 단계 4 이상 보스'},
  // 사제
  {id:'c_firstbrand',n:'집행자의 첫 낙인',slot:'staff',cls:'priest',path:'power',st:{int:1.9,tr_0:2,el_holy:15,crit:6},cdmg:25,tag:{cls:'priest',trees:[0],tabs:['j_inquisitor',J3TAB21.inquisitor3]},fx:'pillar',
    lore:'처음 찍힌 낙인은 아직도 식지 않았다.',src:'3차 지역 던전 보스 · 재의 군주'},
  {id:'c_pilgrimlamp',n:'순례자의 등불',slot:'staff',cls:'priest',path:'well',st:{int:1.7,tr_2:2,regen:1.5,mp:1.2},cmc:30,tag:{cls:'priest',trees:[2],kinds:['heal','hot','rez']},fx:'overflow',
    lore:'꺼지지 않는 등불은 기름이 아니라 기도로 탄다.',src:'스승의 마지막 시험 · 어둠 단계 보스'},
  {id:'c_bellmail',n:'종지기의 사슬옷',slot:'robe',cls:'priest',path:'time',st:{hp:1.5,tr_1:2,cdr:15,dr:6},tpen:8,fx:'bell',tag:{cls:'priest',trees:[1]},
    lore:'걸을 때마다 작은 종이 울린다. 망자만 그 소리를 싫어한다.',src:'어둠 단계 4 이상 보스'},
  // 전사
  {id:'c_skyspear',n:'하늘 꿰는 용창',slot:'staff',wt:'polearm',cls:'warrior',path:'power',st:{atk:1.9,tr_1:2,pdmg:15,crit:6},cdmg:25,tag:{cls:'warrior',trees:[1],tabs:[J3TAB21.warlord3]},fx:'sweep',
    lore:'용의 등뼈를 그대로 자루로 썼다.',src:'3차 지역 던전 보스 · 재의 군주'},
  {id:'c_oathtower',n:'맹세를 지킨 탑방패',slot:'off',wt:'shield',cls:'warrior',path:'well',st:{blk:1.4,tr_2:2,dr:10,mp:1.2},cmc:30,tag:{cls:'warrior',trees:[2],tabs:['j_guardian',J3TAB21.guardian3]},fx:'oath',
    lore:'성이 무너진 뒤에도 이 방패 뒤만은 무너지지 않았다.',src:'스승의 마지막 시험 · 어둠 단계 보스'},
  {id:'c_ragemail',n:'식지 않는 분노의 갑주',slot:'robe',wt:'plate',cls:'warrior',path:'time',st:{hp:1.5,tr_3:2,cdr:15,ias:8},tpen:8,fx:'boil',tag:{cls:'warrior',trees:[3],tabs:['j_berserker',J3TAB21.warlord3]},
    lore:'갑옷 안쪽이 늘 뜨겁다.',src:'어둠 단계 4 이상 보스'},
  // 궁수
  {id:'c_huntlord',n:'사냥터 주인의 화살통',slot:'off',wt:'quiver',cls:'archer',path:'power',st:{acc:1.5,tr_2:2,crit:6,eva:5},cdmg:25,tag:{cls:'archer',kinds:['trap','detonate']},fx:'traps',
    lore:'이 화살통 주인의 사냥터에서는 땅도 사냥을 돕는다.',src:'3차 지역 던전 보스 · 재의 군주'},
  {id:'c_threesky',n:'세 하늘의 장궁',slot:'staff',wt:'bow',cls:'archer',path:'well',st:{atk:1.7,tr_1:2,el_fire:10,el_ice:10,el_storm:10},cmc:30,tag:{cls:'archer',trees:[1],ids:['elemrain']},fx:'cycle',
    lore:'불, 얼음, 번개. 세 하늘이 한 활에서 만난다.',src:'스승의 마지막 시험 · 어둠 단계 보스'},
  {id:'c_windcoat',n:'바람을 입은 가죽옷',slot:'robe',wt:'leather',cls:'archer',path:'time',st:{hp:1.4,tr_0:2,cdr:15,ias:8},tpen:8,fx:'reload',tag:{cls:'archer',trees:[0],tabs:['j_hawkeye',J3TAB21.hawkeye3]},
    lore:'바람이 화살을 대신 메겨 준다.',src:'어둠 단계 4 이상 보스'},
  // 공용 장신구 (모든 직업)
  {id:'c_cogring',n:'멈춘 시계탑의 톱니',slot:'ring',path:'time',st:{cdr:10,mp:1.2},lore:'시계탑이 멈춘 날, 톱니 하나가 사라졌다.',src:'전설 현상금 · 메아리 군주'},
  {id:'c_sandglass',n:'거꾸로 흐르는 모래시계',slot:'amulet',path:'time',st:{cdr:10,regen:1.3},lore:'모래가 위로 떨어진다.',src:'메아리 군주 · 어둠 단계 6 이상 보스'},
  {id:'c_wellring',n:'마르지 않는 샘의 반지',slot:'ring',path:'well',st:{mcost:8,mp:1.3},lore:'끼고 있으면 손가락이 늘 촉촉하다.',src:'전설 현상금 · 메아리 군주'},
  {id:'c_laketear',n:'고요한 호수의 눈물',slot:'amulet',path:'well',st:{mcost:6,regen:1.5},lore:'바람 없는 날의 호수를 한 방울에 담았다.',src:'메아리 군주 · 어둠 단계 6 이상 보스'},
];
const CORE21_BY={};for(const c of CORE21)CORE21_BY[c.id]=c;
const PATHN21={power:'힘의 길',time:'시간의 길',well:'샘의 길'};
const FXN21={ember:'잿불',ripple:'잔물결',tick:'째깍임',pillar:'내리꽂는 빛',overflow:'넘치는 등불',bell:'울리는 종',sweep:'휩쓰는 기세',oath:'굳은 맹세',boil:'끓는 피',traps:'겹친 덫',cycle:'원소 순환',reload:'바람 장전'};
const FXD21={
  ember:'불 마법에 맞은 적에게 잿불이 쌓임(최대 5겹, 6초). 겹마다 그 적이 받는 불 피해 +4%',
  ripple:'얼리거나 느리게 한 적을 쓰러뜨리면 마나 3% 회복(1초에 한 번). 냉기 채널링 마나 추가 −20%',
  tick:'재사용 3초 이하 마법을 쓰면 다른 마법(원래 재사용 30초 이하) 남은 대기 −0.15초(1초에 최대 0.6초)',
  pillar:'대상 스킬 치명타 때 그 적 위로 빛기둥(그 피해의 40%, 둘레 100). 0.8초에 한 번',
  overflow:'넘친 치유의 30%가 둘레 450 안 가장 다친 파티원에게. 혼자면 작은 보호막',
  bell:'둘레 공격이 맞힌 적 하나마다 퇴마 기술 남은 대기 −0.1초(한 번에 최대 0.5초)',
  sweep:'창술 기술이 적 셋 이상 맞히면 다음 창술 기술 피해 +20%(4초). 휩쓸기 범위 +15%',
  oath:'막기에 성공하면 마나 2% 회복(1초에 최대 3번). 도발 기술 마나 0',
  boil:'기술이 적을 맞힐 때마다 격노·버서커·전쟁군주 기술 남은 대기 −0.15초(1초에 최대 0.6초)',
  traps:'동시에 깔 수 있는 덫 +1. 덫이 터지면 둘레 적 0.8초 묶음(보스 0.3초, 같은 적 3초에 한 번)',
  cycle:'서로 다른 원소 화살을 이어 맞히면 다음 원소 화살 마나 0(4초 안). 원소 화살로 쓰러뜨리면 마나 2%',
  reload:'기본 사격이 맞을 때마다 사격·호크아이·신궁 기술 남은 대기 −0.1초(1초에 최대 0.6초)'};

/* ---------- 착용 상태 ---------- */
// 매 프레임 여러 번 불리므로 글자를 만들지 않고 칸마다 같은 아이템인지만 본다 (v21 BUILDS)
let c21Val=null;const C21_NONE={P:null,list:[],n:{power:0,time:0,well:0},fx:{}};
function core21Worn(){if(!P||!P.gear)return C21_NONE;const g=P.gear,v0=c21Val;
  if(v0&&v0.P===P&&v0.g===g&&v0.cls===P.cls){let i=0,same=true;for(const s in g){if(v0.its[i++]!==g[s]||(g[s]&&g[s].core)!==v0.cores[i-1]){same=false;break}}if(same&&i===v0.its.length)return v0}
  const v={P,g,cls:P.cls,its:[],cores:[],list:[],n:{power:0,time:0,well:0},fx:{}};
  for(const s in g){const it=g[s];v.its.push(it);v.cores.push(it&&it.core);const c=it&&it.core&&CORE21_BY[it.core];if(!c)continue;
    if(c.cls&&c.cls!==P.cls)continue; // 다른 직업 것은 효과 없음(창고에서 옮겨 낀 경우)
    v.list.push(c);v.n[c.path]++;if(c.fx)v.fx[c.fx]=c}
  c21Val=v;return v}
const core21Has=fx=>!!core21Worn().fx[fx];
const core21N=path=>core21Worn().n[path];

/* ---------- b2.js 공식이 부르는 값 ---------- */
// 재사용 대기 감소 상한: 기본 .5, 시간의 길 2개 .55, 3개 .60. 원래 재사용 30초 넘는 기술은 늘 .5
function core21Cap(id){const base=SPELLS[id].cd;if(base>30)return .5;const n=core21N('time');return n>=3?C21BAL.timeCap3:n>=2?C21BAL.timeCap2:.5}
// 재사용 3초 이하 기술의 추가 감소(시간의 길 3개)
function core21QuickCdr(id){return core21N('time')>=3&&SPELLS[id].cd<=3?.1:0}
// 대상 스킬 피해 % (dmgScale 칸에 더함, 0.25 = 25%)
function core21Dmg(id){let v=0;for(const c of core21Worn().list)if(c.cdmg&&core21Tag(c.tag,id))v+=c.cdmg/100;return v}
// 대상 스킬 마나 소모 % (기존 mcost에 더함)
function core21Mc(id){let v=0;for(const c of core21Worn().list)if(c.cmc&&core21Tag(c.tag,id))v+=c.cmc/100;
  if(CAST_CH21&&core21Has('ripple')&&SPELLS[id].el==='ice')v+=.2;if(C21BAL.timeMc3&&core21N('time')>=3)v+=C21BAL.timeMc3;return v}
let CAST_CH21=false; // 채널링 틱 비용을 셀 때만 true (cast.js의 tc 계산 둘레에서 켬)
// v21 균형 값(실제 마나·물약으로 140 마법사 50마리 처치 시간을 맞춘 값). 공명 글씨도 여기서 만든다
// v21 균형 2차(실제 마나·물약, 150번 평균): 샘 반지·눈물 마나 소모 15/12 → 8/6, 시간의 길 3개 마나 소모 −10% 추가, 피해 강화 −10 → −8
const C21BAL={mc2:.52,mc3:.65,wellRegen:.01,timeMc3:.1,timeCap2:.55,timeCap3:.6};
const c21Pct=v=>Math.round(v*100);
// 공명 글씨 [2개, 3개]
function c21ResTxt(path){const B=C21BAL;return path==='time'?[`재사용 대기 감소 상한 ${c21Pct(B.timeCap2)}%`,`상한 ${c21Pct(B.timeCap3)}% · 재사용 3초 이하 기술 −10%`+(B.timeMc3?` · 마나 소모 −${c21Pct(B.timeMc3)}%`:'')]:
  [`마나 소모 감소 상한 ${c21Pct(B.mc2)}%`,`상한 ${c21Pct(B.mc3)}% · 마나가 절반 넘으면 초당 ${Math.round(B.wellRegen*1000)/10}% 회복`]}
// 마나 소모 감소 상한: 기본 .4, 샘의 길 2개 C21BAL.mc2, 3개 C21BAL.mc3
function core21McCap(){const n=core21N('well');return n>=3?C21BAL.mc3:n>=2?C21BAL.mc2:.4}
// 시간의 길 피해 강화 칸 −8% (몇 개를 껴도 한 번만). v21 균형(140 마법사 50마리 처치): 설계값 −20%는 시간의 길이 +25% 느려 −10%로, 2차(실제 마나)에서 −8%로 낮춤 → 세 길 ±15% 안
function core21Pen(){let v=0;for(const c of core21Worn().list)if(c.tpen)v=Math.max(v,c.tpen/100);return v}

/* ---------- 아이템 만들기 ---------- */
const core21Fits=(c,cls)=>!c.cls||c.cls===cls;
function makeCore21(cid,il,cls){const c=CORE21_BY[cid];if(!c)return null;cls=cls||P.cls;il=clamp(Math.round(il||100),100,Math.max(99,MAXLV));
  const st={};for(const [k,v] of Object.entries(c.st))st[k]=v;
  const fs=typeof fixedStatsV18==='function'?fixedStatsV18(st,il,c.wt):fixedStats(st,il); // v20: 아이템 레벨 140까지 굴림
  const it={id:uid++,slot:c.slot,rar:5,name:c.n,il,stats:fs,cls:c.cls||cls,lore:c.lore,core:c.id};if(c.wt)it.wt=c.wt;return it}
// 드랍: 장소마다 확률. where = 'j3boss'(3차 지역 던전 보스) | 'ashlord'(재의 군주) | 'dark'(어둠 단계 던전 보스) | 'darkElite' | 'echo'(메아리 군주)
// dark = 어둠 단계 0~10 (B1). 한 번 처치에 하나까지.
function core21Roll(where,dark,cls){cls=cls||P.cls;dark=dark||0;const pool=[];
  const add=(path,slotKind,p)=>{for(const c of CORE21)if(c.path===path&&core21Fits(c,cls)&&(slotKind==='cls'?!!c.cls:slotKind==='ring'?(!c.cls&&c.slot==='ring'):slotKind==='amulet'?(!c.cls&&c.slot==='amulet'):true))pool.push([c.id,p])};
  if(where==='j3boss')add('power','cls',.015+.0015*dark);
  if(where==='ashlord')add('power','cls',.04+.0015*dark);
  if(where==='dark'){if(dark>=1)add('well','cls',.008);if(dark>=4)add('time','cls',.01);if(dark>=6){add('time','amulet',.012/2);add('well','amulet',.012/2)}}
  if(where==='darkElite'&&dark>=4)add('time','cls',.0003);
  if(where==='echo'){add('time','ring',.005);add('well','ring',.005);add('time','amulet',.005);add('well','amulet',.005)}
  const pn=typeof PTY==='object'&&PTY.partyN?PTY.partyN():1,py=pn>=3?.2:pn===2?.1:0; // 2인 +10%, 3인 +20% (덧셈)
  for(const [cid,p] of pool)if(R()<p*(1+py))return cid;return null}

/* ---------- 특수 효과 (combat에서 부를 자리: 인계안내 3절) ---------- */
const C21={ember:new WeakMap(),pillarT:0,tickT:0,tickN:0,boilT:0,boilN:0,reloadT:0,reloadN:0,rippleT:0,oathT:0,oathN:0,sweepT:0,sweepNow:-1,sweepId:null,cycle:{last:null,free:0},trapRoot:new WeakMap(),aoe:{id:null,t:-9,n:0}};
// 둘레·부채꼴로 여럿을 맞히는 종류 (울리는 종 · 휩쓰는 기세가 맞힌 수를 센다)
const C21_AOE=new Set(['nova','cone','melee','sweep','consec','wave','gale','field','rain','storm','beam']);
const c21Basic=s=>!!(s&&s.cls==='archer'&&s.aspd&&s.kind==='bolt'); // v20 궁수 기본 사격(퀵 샷 · 연속 사격 · 3차 기본 사격)
// 남은 대기를 줄임: 원래 재사용 30초 이하만, ids 거르기
function c21CutCd(sec,pred){for(const k in P.cd){if(!(P.cd[k]>0))continue;const s=SPELLS[k];if(!s||s.cd>30)continue;if(pred&&!pred(k))continue;P.cd[k]=Math.max(0,P.cd[k]-sec)}}
// 1초 창 안에서 최대 cap초까지만 줄이기
function c21Budget(key,sec,cap){const t=time;if(t-C21[key+'T']>=1){C21[key+'T']=t;C21[key+'N']=0}const left=cap-C21[key+'N'];const d=Math.max(0,Math.min(sec,left));C21[key+'N']+=d;return d}
// 적이 받는 피해 배율(잿불): hurtE 맨 앞에서 amt에 곱하기 전에 부름. 디버프 칸(원소 해방 표식과 같은 칸)이라 성장 덧셈 규칙과 따로 셈
function core21TakeMul(e,s){if(!s||s.el!=='fire'||!core21Has('ember'))return 1;const m=C21.ember.get(e);if(!m||m.t<time)return 1;return 1+.04*m.n}
// 스킬이 적을 맞힌 뒤(hurtE 끝, 내 마법일 때): id = 스킬 id, crit = 치명타였는지, amt = 실제 피해
function core21OnHit(e,id,amt,crit,hs){if(!id||!SPELLS[id]||!e)return;e._c21k=id;if(!core21Worn().list.length)return;const s=SPELLS[id],sel=hs&&hs.el||s.el;
  if(core21Has('ember')&&sel==='fire'&&s.cls==='mage'){const m=C21.ember.get(e);const n=m&&m.t>=time?Math.min(5,m.n+1):1;C21.ember.set(e,{n,t:time+6})}
  if(core21Has('pillar')&&crit&&core21Tag(CORE21_BY.c_firstbrand.tag,id)&&time-C21.pillarT>=.8){C21.pillarT=time;
    const d=Math.round(amt*.4);for(const o of enemies)if(!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<=100)hurtE(o,d,{el:'holy',cls:'priest',proc:1});
    if(typeof rings!=='undefined')rings.push({x:e.x,y:e.y,r:6,max:100,life:.45,col:'#ffe9a8'})}
  if(core21Has('boil')&&core21Tag(CORE21_BY.c_ragemail.tag,id)){const d=c21Budget('boil',.15,.6);if(d)c21CutCd(d,k=>k!==id&&core21Tag(CORE21_BY.c_ragemail.tag,k))}
  if(core21Has('reload')&&c21Basic(s)){const d=c21Budget('reload',.1,.6);if(d)c21CutCd(d,k=>k!==id&&core21Tag(CORE21_BY.c_windcoat.tag,k))}
  if(core21Has('cycle')&&core21Tag(CORE21_BY.c_threesky.tag,id)&&['fire','ice','storm','wind'].includes(sel)){const c=C21.cycle;if(c.last&&c.last!==sel)c.free=time+4;c.last=sel}
  // 겹친 덫: 덫이 터져 맞은 적을 묶음(같은 적은 3초에 한 번)
  if(core21Has('traps')&&core21Tag(CORE21_BY.c_huntlord.tag,id)&&!e.dead)c21Root(e);
  // 이번 시전이 맞힌 수 (울리는 종 · 휩쓰는 기세): 시전 뒤 1.5초 안의 같은 기술
  const A=C21.aoe;if(A.id===id&&time-A.t<1.5&&C21_AOE.has(s.kind)){A.n++;core21OnAoe(id,A.n)}}
// 둘레 공격 한 번이 끝난 뒤 맞힌 수(울리는 종 · 휩쓰는 기세)
// v21: 맞힐 때마다 부른다(hitN = 이번 시전에서 지금까지 맞힌 수) — 늦게 맞는 휘두르기·장판도 센다
function core21OnAoe(id,hitN){if(!SPELLS[id]||!hitN)return;const s=SPELLS[id];
  if(core21Has('bell')&&hitN<=5&&(s.kind==='nova'||s.kind==='cone'||s.kind==='consec')&&core21Tag(CORE21_BY.c_bellmail.tag,id))c21CutCd(.1,k=>k!==id&&TREE[k]===1&&SPELLS[k].cls==='priest');
  if(core21Has('sweep')&&hitN===3&&core21Tag(CORE21_BY.c_skyspear.tag,id))C21.sweepT=time+4}
// 휩쓰는 기세 다음 기술 +20%: dmgScale 칸에 더함(core21Dmg와 같이). 쓰면 꺼짐
function core21SweepDmg(id){if(!core21Has('sweep')||!core21Tag(CORE21_BY.c_skyspear.tag,id))return 0;return C21.sweepT>=time||(C21.sweepNow===time&&C21.sweepId===id)?.2:0}
// 기술을 쓴 직후(tryCast에서 P.cd[id]를 정한 다음)
function core21OnCast(id){const s=SPELLS[id];if(!s||!core21Worn().list.length)return;
  if(core21Has('tick')&&s.cls==='mage'&&s.cd<=3){const d=c21Budget('tick',.15,.6);if(d)c21CutCd(d,k=>k!==id)}
  if(core21Has('sweep')&&C21.sweepT>=time&&core21Tag(CORE21_BY.c_skyspear.tag,id)){C21.sweepT=0;C21.sweepNow=time;C21.sweepId=id} // 이번 시전의 피해 계산(같은 프레임)까지는 남김
  if(C21_AOE.has(s.kind))C21.aoe={id,t:time,n:0};
  if(core21Has('cycle')&&C21.cycle.free>=time&&core21Tag(CORE21_BY.c_threesky.tag,id))C21.cycle.free=0}
// 이번 시전 마나가 0인지(원소 순환, 굳은 맹세 도발): costAt 결과에 곱함
function core21Free(id){const s=SPELLS[id];if(!s)return false;
  if(core21Has('cycle')&&C21.cycle.free>=time&&core21Tag(CORE21_BY.c_threesky.tag,id))return true;
  if(core21Has('oath')&&(id==='taunt'||id==='grandtaunt'||id==='gathercry'))return true;return false}
// 적을 쓰러뜨렸을 때(내 마법으로)
function core21OnKill(e,id){const s=SPELLS[id];if(!s)return;
  if(core21Has('ripple')&&s.el==='ice'&&(e.freezeT>0||e.slowT>0||e.rootT>0)&&time-C21.rippleT>=1){C21.rippleT=time;P.mp=Math.min(maxMp(),P.mp+maxMp()*.03)}
  if(core21Has('cycle')&&core21Tag(CORE21_BY.c_threesky.tag,id))P.mp=Math.min(maxMp(),P.mp+maxMp()*.02)}
// 막기 성공(cls2.js 막기 줄)
function core21OnBlock(){if(!core21Has('oath'))return;const d=c21Budget('oath',1,3);if(d)P.mp=Math.min(maxMp(),P.mp+maxMp()*.02)}
// 넘친 치유(healP·파티 치유에서 넘친 양): 가장 다친 파티원에게 30%, 혼자면 작은 보호막
function core21Overflow(over){if(!core21Has('overflow')||!(over>0))return null;return Math.round(over*.3)}
// 덫: 동시에 깔 수 있는 수 +1, 터질 때 묶음
const core21TrapMax=()=>core21Has('traps')?1:0;
function c21Root(o){const last=C21.trapRoot.get(o);if(last!=null&&time-last<3)return;C21.trapRoot.set(o,time);const T=TYPES[o.k]||{};o.rootT=Math.max(o.rootT||0,T.boss||T.mini?.3:.8)}
function core21TrapPop(x,y){if(!core21Has('traps'))return;for(const o of enemies){if(o.dead||Math.hypot(o.x-x,o.y-y)>120)continue;c21Root(o)}}
// 샘의 길 3개: 마나 절반 넘게 남으면 1초마다 마나 C21BAL.wellRegen (V20.tick에서)
function core21Regen(dt){if(core21N('well')<3||P.dead)return;if(P.mp>maxMp()*.5)P.mp=Math.min(maxMp(),P.mp+maxMp()*C21BAL.wellRegen*dt)}

/* ---------- 글씨 (툴팁 · 장비 창 · 도감) ---------- */
function core21Line(it){const c=it&&it.core&&CORE21_BY[it.core];if(!c)return'';const n=core21N(c.path),need=3;
  let h=`<div style="color:#d6a8ff;margin-top:3px">빌드 핵심 · ${PATHN21[c.path]}</div>`;
  if(c.cdmg)h+=`<div>대상 스킬 피해 +${c.cdmg}%</div>`;if(c.cmc)h+=`<div>대상 스킬 마나 소모 −${c.cmc}%</div>`;if(c.tpen)h+=`<div style="color:#ff9a8a">피해 강화 −${c.tpen}%</div>`;
  if(c.fx)h+=`<div style="color:#ffd76a">${FXN21[c.fx]}: ${FXD21[c.fx]}</div>`;
  if(c.path!=='power')h+=`<div style="opacity:${n>=2?1:.5}">${PATHN21[c.path]} 공명 (${n}/${need}) · 2개: ${c21ResTxt(c.path)[0]} · 3개: ${c21ResTxt(c.path)[1]}</div>`;
  return h}
function core21Codex(){let h=`<h2>빌드 핵심 <span class="muted">${CORE21.length}종 · 100레벨 이후 · 같은 길 2·3개면 공명</span></h2>`;
  for(const c of CORE21){const cn=c.cls?CLASSES[c.cls].n:'모든 직업';
    h+=`<div class="item cx"><div><div class="nm" style="color:#ff8a3a">${c.n} <span class="muted">${cn} · ${PATHN21[c.path]}</span></div><div class="st">${c.fx?FXN21[c.fx]+': '+FXD21[c.fx]:'공명용 장신구'}</div><div class="st muted">얻는 곳: ${c.src}</div></div></div>`}
  return h}

/* ---------- 퀘스트 데이터 (quest.js/job2q.js 형식에 맞춰 메인 스레드가 연결) ---------- */
const CORE21_QUESTS={
  // ① 스승의 마지막 시험: 110레벨, 3차 전직 뒤. 직업별 스승 = 1차 위계 시험 스승
  mentor:{id:'q21_mentor',n:'스승의 마지막 시험',lvl:110,needJob3:true,main:false,
    npc:{mage:{town:'arden',npc:'elian'},priest:{town:'arden',npc:'j2_priest'},warrior:{town:'arden',npc:'j2_warrior'},archer:{town:'arden',npc:'j2_archer'}},
    steps:[{type:'talk',d:'스승과 이야기하기'},
      {type:'kill',k:['q21_wellfoul'],n:1,reg:'ashplateau',d:'재가 내리는 고원의 「샘을 흐리는 자」 처치',item:'맑은 물방울'},
      {type:'trial',room:'ashplateau_trial',sec:180,noMpPot:true,springs:3,d:'시험의 방에서 마나 물약 없이 3분 버티기'},
      {type:'talk',d:'스승에게 돌아가기'}],
    reward:{mage:'c_stillwater',priest:'c_pilgrimlamp',warrior:'c_oathtower',archer:'c_threesky',xp:1,gold:30000}},
  // ② 전설 현상금: 140레벨, 잿빛 메아리 상급 현상금 10개마다 하나
  legend:{id:'q21_legend',n:'전설 현상금',lvl:140,every:10,
    targets:[{n:'시계탑을 멈춘 도둑',base:'k_rogue',reward:'c_cogring'},{n:'샘을 훔친 마녀',base:'s_siren',reward:'c_wellring'}],
    after:'상급 상자'}};
// 전설 현상금 진행: P.bty.leg = {n: 잡은 상급 현상금 수, got:[받은 전설 순번]} (없으면 기본값)
function core21LegState(){P.bty=P.bty||{};const L=P.bty.leg||(P.bty.leg={n:0,got:[]});if(!Array.isArray(L.got))L.got=[];if(!(L.n>=0))L.n=0;return L}
function core21LegNext(){const L=core21LegState(),i=L.got.length;if(L.n<(i+1)*CORE21_QUESTS.legend.every)return null;return CORE21_QUESTS.legend.targets[i]||{n:'메아리의 전설',reward:null}}

/* #qa에 넣을 시험 (check-v21-builds.cjs와 같은 내용)
   1 +모든 스킬 6 → +5만 적용 · 2 시간의 길 1/2/3개 재사용 상한 .5/.55/.6, 원래 재사용 31초 기술은 .5
   3 샘의 길 상한 .4/.52/.65 · 4 대상 스킬 피해·마나만 바뀌고 다른 스킬은 그대로 · 5 시간의 길 피해 강화 −20%(두 개여도 −20%; v21 균형으로 지금은 −8%)
   6 다른 직업 핵심은 효과 없음 · 7 핵심 장비 저장→불러오기 core 값 보존 · 8 일반 드랍(makeItem)에서 핵심 장비 0개(10만 번)
   9 핵심 장비에 「+모든 스킬」 없음 · 10 째깍임: 1초에 0.6초 넘게 줄지 않음 · 11 전설 현상금 10/20개에서 확정 보상 순서 */
// 채널링 한 틱의 마나(cast.js): 그동안만 CAST_CH21을 켜서 잔물결 −20%가 더해지게
function c21ChCost(id,N){CAST_CH21=true;try{return costOf(id)/N}finally{CAST_CH21=false}}
