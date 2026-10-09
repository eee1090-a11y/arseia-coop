
/* ---------- 스킬 트리: 계열과 선행 마법 ---------- */
const TREE={};
(()=>{const m={
  0:'hydra meteor pyroblast spark ember warmth dancingflames smokecall flameshaping firebolt flamelash steamjet firewall flamemantle blazinggust fireburst ringoffire flamelance twinflames firebird firestorm pillar sunflame callmagma dragonbreath firebirdflock heartoffire skyfire sunfall seaofflame',
  1:'frostdiver frozenorb stormgust splash drawwater purifywater waterjet watershaping gatherdew frost waterwhip mire frostarrow iceshield iceblade iceprison shardvolley whirlpool blizzard callwave frostarmor frozenground callrain icecitadel endlesswinter bodyofwater turncurrent glacier tidalwave monsoon',
  2:'lordvermilion gust breeze clearair static windshaping windreading windblade airwall dustdevil shockinggrasp doubledgust windleap lightning whirlwind hail lightspear sandstorm eyeofstorm chainlightning thunderrain vacuumblade callstorm lightningbody thundervoice heavenbolt typhoon rendingsky',
  3:'stoneset crackstone earthshaping sandshaping stonethrow mudgrasp fissure quicksand stonerain obsidian quake stoneguardian crystallance earthquake jaws stonebody magmariver raisemountain splitcanyon',
  4:'arcanemissiles stop light ease hold blink flash shieldcircle heatoflight arcaneheal slowtime lancelight spacetwist lightrain spaceprison dawnblade timestop rewind spacerend starlight'},
  p={0:'holyspark smite holycross lightarrow holyfire hammerofjustice javelin blessedhammer consecration chainoflight avengersshield radiance pillaroflight chastise divinestorm rainoflight fistofheaven hammerofwrath judgment gloriadomini condemn godspear grandcross sacredsword wrath thousandspears apotheosis',
  1:'magnus symbolflash turnundead holyburst holychains waveoflight exorcircle burningsigil thunderprayer holysun greatjudgment sunsword',
  2:'sanctuary minorheal closewounds lingering greaterheal healcircle regeneration renew prayerheal salvation resurrection divinehymn',
  3:'lightward divineshield grace oath inviolable returnmiracle kyrie safetywall barrier guardianspirit painsup aegis',
  4:'blessing faith herobless agiup wisdom impositio kings gloria magnificat fortitude aspersio assumptio benediction'};
  // v17: 속죄(5) 계열은 없어지고 심판(0)으로 합쳐졌다
  for(const [t,ids] of Object.entries(m))ids.split(' ').forEach(id=>TREE[id]=+t);
  for(const [t,ids] of Object.entries(p))ids.split(' ').forEach(id=>TREE[id]=+t);
  if(typeof TREE_V18==='object')for(const c in TREE_V18)for(const [t,ids] of Object.entries(TREE_V18[c]))ids.split(' ').forEach(id=>TREE[id]=+t);// v18 전사·궁수 (cls.js)
})();
// 선행 마법: 이어지는 성격이 뚜렷한 마법끼리만 잇는다. 나머지는 레벨만 되면 바로 찍는다.
const LINKS=`
spark>firebolt firebolt>fireburst fireburst>pyroblast firebolt>twinflames fireburst>firebird firebird>firebirdflock
fireburst>meteor firewall>meteor meteor>skyfire firewall>callmagma
ember>flamelash flamelash>blazinggust blazinggust>dragonbreath
flameshaping>ringoffire ringoffire>firestorm firestorm>seaofflame
flamelance>pillar pillar>sunfall steamjet>sunflame flamemantle>heartoffire
splash>frostdiver waterjet>frost frost>frostarrow frostarrow>shardvolley frostarrow>frozenorb frostdiver>iceprison iceprison>glacier iceprison>frozenground
waterjet>waterwhip waterwhip>iceblade waterwhip>callwave callwave>tidalwave iceblade>turncurrent
mire>whirlpool whirlpool>blizzard blizzard>stormgust stormgust>endlesswinter whirlpool>callrain callrain>monsoon
iceshield>icecitadel icecitadel>bodyofwater
static>lightning lightning>chainlightning lightning>lightspear lightspear>rendingsky chainlightning>callstorm static>shockinggrasp
gust>windblade windblade>vacuumblade gust>doubledgust
dustdevil>whirlwind whirlwind>sandstorm sandstorm>typhoon eyeofstorm>thundervoice
hail>thunderrain thunderrain>heavenbolt thunderrain>lordvermilion
crackstone>stonethrow stonethrow>obsidian obsidian>crystallance stonethrow>stonerain
earthshaping>fissure fissure>quake quake>earthquake earthquake>raisemountain fissure>magmariver magmariver>splitcanyon
sandshaping>mudgrasp mudgrasp>quicksand quicksand>jaws stoneset>stonebody
light>flash light>heatoflight light>lancelight lancelight>dawnblade flash>lightrain lightrain>starlight
stop>hold hold>slowtime slowtime>timestop ease>arcaneheal arcaneheal>rewind
blink>spacetwist spacetwist>spaceprison spaceprison>spacerend
holyspark>lightarrow lightarrow>javelin lightarrow>chainoflight javelin>pillaroflight pillaroflight>rainoflight pillaroflight>judgment rainoflight>wrath javelin>godspear godspear>thousandspears
symbolflash>holychains symbolflash>waveoflight holychains>thunderprayer waveoflight>sunsword turnundead>holyburst holyburst>greatjudgment turnundead>exorcircle exorcircle>burningsigil burningsigil>holysun holysun>magnus
minorheal>closewounds closewounds>greaterheal greaterheal>regeneration closewounds>lingering lingering>healcircle lingering>sanctuary
lightward>divineshield divineshield>inviolable grace>oath oath>returnmiracle
blessing>faith faith>herobless blessing>agiup agiup>gloria faith>impositio impositio>aspersio aspersio>benediction wisdom>magnificat kings>fortitude fortitude>assumptio
lightward>kyrie kyrie>divineshield safetywall>barrier grace>guardianspirit guardianspirit>painsup divineshield>aegis
minorheal>renew renew>lingering minorheal>prayerheal prayerheal>salvation healcircle>divinehymn closewounds>resurrection
smite>holyfire holyfire>chastise chastise>gloriadomini holycross>divinestorm divinestorm>grandcross hammerofjustice>blessedhammer hammerofjustice>hammerofwrath
radiance>sacredsword consecration>condemn pillaroflight>fistofheaven`;
const PRE={},TREEPOS={};
for(const l of (LINKS+(typeof LINKS_V18==='string'?' '+LINKS_V18:'')+(typeof LINKS_V19==='string'?' '+LINKS_V19:'')).trim().split(/\s+/)){const [a,b]=l.split('>').map(x=>typeof MAGE_TRIM_V19==='object'&&V19_MORE.on&&MAGE_TRIM_V19[x]&&!SPELLS[x]?mergeTo(x)||x:x);/* v20: 합쳐진 마법사 스킬의 선행 연결은 남는 스킬로 */if(SPELLS[a]&&SPELLS[b]&&SPELLS[a].rank<SPELLS[b].rank&&TREE[a]===TREE[b]&&!(PRE[b]||[]).includes(a))(PRE[b]=PRE[b]||[]).push(a)}
const preOk=id=>(PRE[id]||[]).every(p=>P.sk[p]>0);
// 칸 배치: 선행 마법이 있으면 그 바로 아래 칸을 먼저 노린다
(()=>{for(const cls in CLASSES)CLASSES[cls].trees.forEach((_,t)=>{
  const list=Object.values(SPELLS).filter(s=>s.cls===cls&&TREE[s.id]===t);
  for(let r=1;r<=9;r++){const row=list.filter(s=>s.rank===r),used=new Set();
    row.sort((a,b)=>(PRE[b.id]?1:0)-(PRE[a.id]?1:0));
    for(const s of row){let want=PRE[s.id]?TREEPOS[PRE[s.id][0]].col:0,c=want;
      for(let d=0;d<8;d++){if(want+d>=0&&!used.has(want+d)){c=want+d;break}if(want-d>=0&&!used.has(want-d)){c=want-d;break}}
      used.add(c);TREEPOS[s.id]={row:r-1,col:c}}}
})})();
const isDmg=s=>(!['heal','hot','shield','buff','ward','invuln','blink','rez','passive'].includes(s.kind)||s.kind==='blink')&&(s.mult||0)>0;

/* ---------- items ---------- */
const RAR=[{n:'일반',c:'#e8e4d8',a:0},{n:'마법',c:'#7aa2ff',a:1},{n:'희귀',c:'#f2d45c',a:3},{n:'세트',c:'#5ee06a',a:2},{n:'유니크',c:'#c8a060',a:0},{n:'상급 유니크',c:'#ff8a3a',a:0}];
const SLOT={
  staff:{n:'지팡이',base:['참나무 지팡이','물푸레 지팡이','수정 지팡이','룬 지팡이','은룡의 지팡이','용뼈 지팡이','별철 지팡이','근원의 지팡이'],main:'int'},
  robe:{n:'로브',base:['천 로브','누빈 로브','비단 로브','룬을 새긴 로브','성직자의 예복','별무늬 로브','대마법사의 로브','근원의 성의'],main:'hp'},
  ring:{n:'반지',base:['구리 반지','은 반지','사파이어 반지','루비 반지','달빛 반지','별빛 반지','용의 눈 반지','근원의 고리'],main:'mp'},
  amulet:{n:'목걸이',base:['뼈 목걸이','은 목걸이','호박 목걸이','룬 목걸이','성유물 목걸이','별의 목걸이','용심 목걸이','근원의 목걸이'],main:'regen'},
};
const STATN={int:'지능',hp:'생명력',mp:'마나',regen:'마나 회복/초',crit:'치명타 %',cdr:'재사용 대기 감소 %',mcost:'마나 소모 감소 %',all:'모든 마법 레벨',ls:'피해의 % 생명력 흡수',mk:'적 처치 시 마나',ms:'이동 속도 %',dr:'받는 피해 감소 %'};
const PROCN={proc_chain:'연쇄 번개',proc_bird:'불새',proc_frost:'서리 폭발',proc_nova:'빛의 폭발'};
const PREF=['타오르는','현자의','서리 내린','고대의','축복받은','별빛의','심연의','수호자의','폭풍의','안개의','룬이 새겨진','잊힌 왕의'];
const LEG={staff:['불사조의 깃털','천공의 지휘봉'],robe:['대사제의 성의','발케르의 망토'],ring:['시간술사의 고리','서리여왕의 인장'],amulet:['아우렐의 눈물','근원어의 목걸이']};
function statName(k){
  if(k.startsWith('sk_')){const s=SPELLS[k.slice(3)];return s?s.n:k}
  if(k.startsWith('tr_')){const C=CLASSES[P.cls];return `${C.trees[+k.slice(3)]} 계열 마법`}
  if(k.startsWith('el_'))return `${ELN[k.slice(3)]} 피해 %`;
  if(PROCN[k])return `적중 시 % 확률로 ${PROCN[k]}`;
  return STATN[k]||k}
function rollStat(k,il){
  const m=rnd(.75,1.2);
  if(k.startsWith('sk_'))return ri(1,il>=30?3:2);
  if(k.startsWith('tr_'))return il>=36&&R()<.3?2:1;
  if(k.startsWith('el_'))return ri(5,10)+Math.floor(il/5);
  switch(k){case'int':return 1+Math.round(il*1.3*m);case'hp':return 6+Math.round(il*5*m);case'mp':return 5+Math.round(il*3.5*m);
    case'regen':return Math.round((.3+il*.12*m)*10)/10;case'crit':return ri(2,4)+Math.floor(il/6);
    case'cdr':return Math.min(20,ri(4,7)+Math.floor(il/10));case'mcost':return Math.min(25,ri(4,8)+Math.floor(il/8));case'all':return 1}
}
let uid=1;
function affixPool(il,cls){
  const p=['int','hp','mp','regen','crit','cdr','mcost'];
  const mine=Object.values(SPELLS).filter(s=>s.cls===cls&&s.rank<=rankOf(Math.max(1,il))+1);
  for(let i=0;i<4;i++)p.push('sk_'+pick(mine).id);
  // 계열 마법(+tr_)은 일반 장비에서 드물게만 붙는다: items.js의 TREE_AFX 참고
  const els=[...new Set(mine.filter(isDmg).map(s=>s.el))];if(els.length)p.push('el_'+pick(els));
  return p}
function itemScore(it){if(!it)return 0;let v=0;for(const [k,x] of Object.entries(it.stats)){
  if(k.startsWith('sk_'))v+=x*((P.sk&&P.sk[k.slice(3)])?16:4);else if(k.startsWith('tr_'))v+=x*18;else if(k.startsWith('el_'))v+=x*1.5;
  else v+=x*({int:3,hp:.5,mp:.6,regen:8,crit:3,cdr:2.5,mcost:1.5,all:30,ls:6,mk:2,ms:2,dr:4,proc_chain:3,proc_bird:3,proc_frost:3,proc_nova:3}[k]||1)}if(it.set)v+=25;return v}
const itemPrice=it=>Math.max(1,Math.round(it.il*4*(it.rar+1)));
const statOne=(k,v)=>PROCN[k]?`<b style="color:#ff9a6a">적중 시 ${v}% 확률로 ${PROCN[k]}</b>`:k.startsWith('sk_')||k.startsWith('tr_')||k==='all'?`<b style="color:#ffd76a">+${v} ${statName(k)}</b>`:`+${v} ${statName(k)}`;
const statLine=it=>Object.entries(it.stats).map(([k,v])=>statOne(k,v)).join(' · ')+(it.set?setLine(it):'')+(typeof rfLine==='function'?rfLine(it):'')+(it.lore?`<div class="muted" style="font-style:italic">${it.lore}</div>`:'');

/* ---------- monsters ---------- */
const TYPES={
  slime:{n:'늪 슬라임',min:1,hp:26,dmg:5,spd:65,r:13,xp:7,aggro:260,atk:1.1,col:'#6aa84e',draw:'slime'},
  wolf:{n:'회색 늑대',min:2,hp:38,dmg:8,spd:140,r:15,xp:12,aggro:340,atk:1,col:'#7c7f86',draw:'wolf'},
  ashhound:{n:'재 들개',min:5,hp:44,dmg:10,spd:160,r:15,xp:17,aggro:380,atk:.9,col:'#5f5852',draw:'wolf',undead:true,eye:'#ff6a2a'},
  goblin:{n:'고블린 주술사',min:6,hp:40,dmg:10,spd:80,r:13,xp:18,aggro:380,atk:1.9,col:'#5c8a3a',ranged:true,pcol:'#ff7a3a',draw:'goblin'},
  ashsoldier:{n:'잿빛 병사',min:9,hp:80,dmg:15,spd:92,r:15,xp:28,aggro:340,atk:1.2,col:'#b0a898',undead:true,draw:'skeleton'},
  wraith:{n:'망령',min:12,hp:66,dmg:17,spd:110,r:14,xp:34,aggro:420,atk:1.6,col:'#9f8cff',ranged:true,pcol:'#b49cff',undead:true,draw:'wraith'},
  ogre:{n:'오우거',min:14,hp:220,dmg:28,spd:70,r:22,xp:64,aggro:300,atk:1.6,col:'#7a6a46',draw:'ogre'},
  ashknight:{n:'잿빛 기사',min:18,hp:300,dmg:34,spd:96,r:18,xp:90,aggro:360,atk:1.4,col:'#8a8478',undead:true,draw:'knight'},
  apostle:{n:'재의 사도',min:24,hp:200,dmg:40,spd:85,r:16,xp:110,aggro:460,atk:1.8,col:'#c0603a',ranged:true,pcol:'#ff5a2a',undead:true,draw:'apostle'},
};
const DIFF=[{n:'보통',add:0,hp:1,xp:1,req:1,col:'#d6b262'},{n:'악몽',add:20,hp:1.3,xp:1.4,req:25,col:'#ff8a5a'},{n:'지옥',add:40,hp:1.7,xp:1.9,req:45,col:'#ff4a3a'}];

/* ---------- 단축칸 21개: 좌, 우, 1~0, `, F1~F8 ---------- */
const SLOTS=[{k:'좌'},{k:'우'}];
for(let i=1;i<=10;i++)SLOTS.push({k:String(i%10),code:'Digit'+(i%10)});
SLOTS.push({k:'`',code:'Backquote'});
for(let i=1;i<=8;i++)SLOTS.push({k:'F'+i,code:'F'+i});
const CODE2SLOT={};SLOTS.forEach((s,i)=>{if(s.code)CODE2SLOT[s.code]=i});

/* ---------- state ---------- */
function freshPlayer(cls){const C=CLASSES[cls],bar=Array(21).fill(null);bar[0]=C.start[0];
  return{cls,x:TOWN.x,y:TOWN.y+110,r:13,towns:['brenhill'],home:'brenhill',hp:100,mp:60,lvl:1,xp:0,gold:0,face:-Math.PI*.75,walk:0,moving:false,diff:0,
  shield:0,shieldT:0,hot:null,storm:null,ward:null,invT:0,buffs:{},hurtT:0,dead:false,noMpT:0,
  sk:{[C.start[0]]:1},sp:0,st:{int:C.st[0],vit:C.st[1],spi:C.st[2]},ap:0,
  gear:{staff:null,robe:null,ring:null,amulet:null},bag:[],pot:{hp:3,mp:3},bar,cd:{},potCd:0}}
let P=freshPlayer('mage');
let decals=[],circles=[],banner=null,flash=null,mmBg=null,act=null,actTown=null,hover=null;const shops={};
let allies=[],enemies=[],projs=[],loot=[],parts=[],texts=[],fields=[],pend=[],bolts=[],rings=[],rains=[],beams=[],pillars=[],arcs=[];
let shake=0,time=0,spawnT=0,paused=true,saveT=0,lastRank=1;
const keys=new Set(),mouse={x:0,y:0,active:false,l:false,r:false};let joy=null,fireTouch=null,touchMode=false;

const stat=k=>gearStats()[k]||0;
// 패시브: 배워 두면 늘 켜져 있는 마법 (스킬 레벨에 따라 커짐)
const PASSIVES={mage:[],priest:[],warrior:[],archer:[]};for(const id in SPELLS)if(SPELLS[id].kind==='passive')PASSIVES[SPELLS[id].cls].push(id);
let passKey='',passVal={},passT=-1,passP=null;
function passSum(k){if(passT===time&&passP===P)return passVal[k]||0;passT=time;passP=P;const ids=PASSIVES[P.cls]||[];let key=P.cls;for(const id of ids)key+=','+skLv(id);
  if(key!==passKey){passKey=key;passVal={};for(const id of ids){const L=skLv(id);if(L<=0)continue;const e=eff(id,L);for(const s in SPELLS[id].pv)passVal[s]=(passVal[s]||0)+e[s]}}
  return passVal[k]||0}
const buffSum=k=>{let v=GHOST?0:passSum(k);for(const id in P.buffs)v+=P.buffs[id][k]||0;return v};
const maxHp=()=>Math.round(((40+P.lvl*12+P.st.vit*4)*CLASSES[P.cls].hp+stat('hp'))*(1+Math.min(.5,buffSum('hp'))));
const maxMp=()=>Math.round((20+P.lvl*5+P.st.spi*3)*CLASSES[P.cls].mp)+Math.round(stat('mp'));
const power=()=>4+P.lvl*1.5+P.st.int+stat('int'),regen=()=>1+P.lvl*.12+P.st.spi*.06+stat('regen')+buffSum('regen'),critC=()=>.05+stat('crit')/100+Math.min(.3,buffSum('crit'));
// 피해 증가 상한: 마법사 +80%, 사제 +60% (사제는 강화를 직접 거니 상한을 낮춘다). 갑옷의 피해 증가도 같은 상한 안에서 센다
const DMGCAP={mage:.8,priest:.6},dmgCap=()=>DMGCAP[P.cls]||.8;
const dmgMul=()=>1+Math.min(dmgCap(),buffSum('dmg')+(P.armor?P.armor.dmgB:0))-core21Pen()/* v21 시간의 길 −20% (builds21.js) */,spdMul=()=>1+Math.min(.6,buffSum('spd'))+Math.min(40,stat('ms'))/100;
// v17: 낮은 레벨일수록 더 많이 (1레벨 4배 → 30레벨 2배로 부드럽게 줄고, 30부터는 2배). 30에서 기울기까지 이어진다
// 저레벨 4배 → 30레벨 2배 → 60레벨 4배 (고레벨 구간도 천천히: 사용자 요청 v17)
const XPM50=2+2*(2/3)*(2/3)*(3-4/3),xpMul=l=>{if(l>=100)return 3.66+(5.2-3.66)*Math.min(1,(l-100)/40);/* v20: 100→140은 60→100의 약 1.5배 사냥 */if(l>=50)return XPM50+(3.66-XPM50)*Math.min(1,(l-50)/50);// v19: 50→100은 1→50의 약 2.5배 사냥
  if(l>=30){const y=Math.min(1,(l-30)/30);return 2+2*y*y*(3-2*y)}const x=(l-1)/29;return 4-2*x*x*(3-2*x)};
// v21(사용자 04:10): 10레벨까지는 그대로, 그 뒤로 필요한 경험치를 늘린다. 10→30에서 부드럽게 ×2, 30→40에서 ×2.2, 40부터 끝까지 ×2.2 (곱 한 번, 몬스터 경험치는 그대로)
const xpSlow21=l=>{if(l<=10)return 1;if(l<30){const x=(l-10)/20;return 1+x*x*(3-2*x)}return Math.min(2.2,2+.02*(l-30))};
const xpNeedV20=l=>Math.floor(40*Math.pow(l,1.45)*xpMul(l));// 옛 곡선(저장 옮기기용)
const xpNeed=l=>Math.floor(40*Math.pow(l,1.45)*xpMul(l)*xpSlow21(l));
// 스킬 레벨: 찍은 점수 + 장비 보너스(1점 이상 찍은 마법에만)
// v19: 장비로 얻는 「+모든 마법 레벨」은 합쳐서 최대 +3 (2차 스킬에도 붙으므로)
// v20: 3차 스킬(job3)은 「3차 계열 +1」(tr_j3_갈래)만 받고, 한 점이 J3K(직업)레벨만큼(피해 +12%) 오른다. 화면에 보이는 레벨은 skShow
const isJ3=id=>!!(SPELLS[id]&&SPELLS[id].job3);
// v21: 「+모든 마법 레벨」 상한 3 → 5 (사용자 요청 · 빌드 핵심 장비 설계서 5절). 3차 스킬은 그대로 안 붙음
const bonusLv=id=>isJ3(id)?stat('tr_'+TREE[id]):Math.min(5,stat('all'))+stat('tr_'+TREE[id])+stat('sk_'+id);
const skLv=id=>P.sk[id]?(isJ3(id)&&!GHOST?1+J3K(SPELLS[id].cls)*(P.sk[id]+bonusLv(id)-1):P.sk[id]+bonusLv(id)):0;
const skShow=id=>P.sk[id]&&isJ3(id)&&!GHOST?P.sk[id]+bonusLv(id):skLv(id);
function synergy(id){const t=TREE[id];let n=0;for(const k in P.sk)if(k!==id&&TREE[k]===t)n+=P.sk[k];return n}
// v17: 피해는 곱하지 않고 더한다 — 1 + 스킬 레벨(점당 10%) + 시너지(점당 1.5%, 최대 50%) + 장비 원소 %. 버프(dmgMul)만 따로 곱하고 상한이 있다
// 스킬 레벨은 20까지 1단계씩, 장비로 20을 넘긴 레벨은 반 단계씩만 센다
const lvSteps=L=>Math.max(0,Math.min(L,20)-1)+Math.max(0,L-20)*.5;
const SYN_PT=.015,SYN_CAP=.5,LV_PT=.1;
const synBonus=id=>Math.min(SYN_CAP,SYN_PT*synergy(id));
const dmgScale=(id,L)=>1+LV_PT*lvSteps(L)+synBonus(id)+stat('el_'+SPELLS[id].el)/100+core21Dmg(id)+core21SweepDmg(id);/* v21 빌드 핵심: 대상 스킬 피해 % (덧셈) */
const supScale=L=>1+.08*lvSteps(L);
const cdOf=id=>SPELLS[id].aspd?atkIv(SPELLS[id]):Math.max(.15,SPELLS[id].cd*(1-Math.min(core21Cap(id),stat('cdr')/100+buffSum('cdr')+core21QuickCdr(id))))*(SPELLS[id].cd<.15?1:1);/* v21 시간의 길 공명: 상한 50→55/60% */
/* v20: 3차 기술은 skLv가 1점마다 ×1.2(J3K)로 커지므로, 마나는 찍은 점수(+스킬 보너스) 그대로로 센다 — 피해만 세지고 마나가 두 번 비싸지지 않게 */
const costLv=(id,L)=>typeof isJ3==='function'&&isJ3(id)?1+(Math.max(1,L)-1)/J3K(SPELLS[id].cls):L;
const costAt=(id,L)=>SPELLS[id].cost<=0||core21Free(id)?0:Math.max(1,Math.round(SPELLS[id].cost*(1+P.lvl*.05)*(1+.05*(Math.max(1,costLv(id,L))-1))*(1-Math.min(core21McCap(),stat('mcost')/100+core21Mc(id)))));/* v21 샘의 길: 대상 스킬 마나 % · 상한 40→52/65% */
const costOf=id=>costAt(id,skLv(id));
const SPEED=185;
// 스킬 레벨이 반영된 마법 수치
function eff(id,L){const s=SPELLS[id],e=Object.assign({},s);L=Math.max(1,L);
  if(e.rad)e.rad=Math.round(s.rad*(1+.015*(L-1)));
  if(e.jumps)e.jumps=s.jumps+Math.floor((L-1)/4);
  if(e.cnt>1)e.cnt=s.cnt+Math.floor((L-1)/5);
  // 강화·갑옷: 스킬 레벨마다 30초씩 (최대 300초). 위급할 때 쓰는 짧은 강화(burst)는 조금만
  if(e.dur&&(s.kind==='buff'||s.kind==='armor'))e.dur=s.burst?Math.round(s.dur*(1+.04*(L-1))*10)/10:Math.min(300,s.dur+30*(L-1));
  else if(e.dur&&['field','rain','storm'].includes(s.kind))e.dur=Math.round(s.dur*(1+.05*(L-1))*10)/10;
  else if(e.dur&&['hot','orbit','summon'].includes(s.kind))e.dur=Math.round(s.dur*(1+.03*(L-1))*10)/10;
  if(s.pv)for(const k in s.pv)e[k]=Math.round((s.pv[k][0]+s.pv[k][1]*lvSteps(L))*1000)/1000;
  if(e.freeze)e.freeze=Math.round(s.freeze*(1+.03*(L-1))*10)/10;
  if(e.stun)e.stun=Math.round(s.stun*(1+.03*(L-1))*10)/10;
  if(s.kind==='blink')e.range=s.range+8*(L-1);
  if(s.kind==='invuln')e.dur=Math.round((s.dur+.1*(L-1))*10)/10;
  // v17: 피해·치명타·마나 회복 강화는 스킬 레벨마다 천천히 (예전 6%·3%·8% → 2%·2%·5%)
  if(s.kind==='buff'){const n=lvSteps(L);e.dmg=(s.dmg||0)*(1+.02*n);e.spd=Math.min(.6,(s.spd||0)*(1+.04*n));e.regen=(s.regen||0)*(1+.05*n);
    e.dr=Math.min(.6,(s.dr||0)*(1+.02*n));e.crit=(s.crit||0)*(1+.02*n);e.cdr=Math.min(.4,(s.cdr||0)*(1+.02*n));e.hp=(s.hp||0)*(1+.03*n);e.life=(s.life||0)*(1+.05*n)}
  if(s.drf)e.drf=Math.min(.7,s.drf*(1+.015*(L-1)));if(s.atone)e.atone=s.atone*(1+.03*(L-1));
  if(s.kind==='ward')e.heal=Math.min(1,s.heal*(1+.04*lvSteps(L)));
  e.L=L;return e}
// 한 마법에 점수를 더 찍으려면: 그 위계의 요구 레벨 + 이미 찍은 점수 (디아블로 2 방식)
// v19: 요구 레벨은 reqLvOf(상위 기술은 upLv) · 상위 기술은 2차 전직 뒤에만 (skill19.js)
function ptNeed(id){return reqLvOf(id)+(P.sk[id]||0)}
function canLearn(id){return P.sp>0&&(P.sk[id]||0)<MAXSK&&P.lvl>=ptNeed(id)&&preOk(id)&&advUnlocked(id)}
// v17: 없어진 마법(속죄 계열 일부). 저장을 불러올 때 찍은 점수는 돌려주고, 장비의 '+스킬' 옵션은 비슷한 마법으로 옮긴다
const GONE_SK={penance:'smite',holynova:'holyburst',divinestar:'javelin',halo:'greatjudgment'};
// 저장된 sk에서 이 직업 마법만 남기고, 아예 없어진 마법의 점수는 back으로 모은다 (지우거나 거부하지 않음)
// v19: 합쳐진 스킬(MERGE_V19)의 점수는 남는 스킬로 옮긴다 — 최대 20, 지금 레벨로 찍을 수 있는 만큼(요구 레벨 + 찍은 점수 규칙)까지만.
//      넘는 만큼과 1차에서 빠진 스킬(RETIRE_V19)의 점수는 back으로 돌려준다. 이미 찍힌 점수는 줄이지 않는다. 원래 점수는 skOld로 (P.skOld에 보관)
//      다른 직업의 키는 무시(공짜 점수 없음). 상위 기술 탭 id는 SPELLS에 그대로 있으니 그 직업 스킬로 남는다
function skLoad(dsk,cls,lvl){const sk={},pend={},skOld={};let back=0;const gone=[],moved=[];lvl=lvl==null?MAXLV:lvl|0;
  for(const k in dsk||{}){const v=clamp(dsk[k]|0,0,MAXSK);
    if(SPELLS[k]){if(SPELLS[k].cls===cls)sk[k]=v;continue}
    const g=GONE_V19[k];
    if(g&&MERGE_V19[k]){const to=mergeTo(k);if(g.cls!==cls||!to)continue;skOld[k]=v;if(v>0)(pend[to]=pend[to]||[]).push([k,v]);continue}
    if(g&&RETIRE_V19[k]){if(g.cls!==cls)continue;skOld[k]=v;if(v>0){back+=v;moved.push({from:k,to:null,mv:0,back:v})}continue}
    if(v>0){back+=v;gone.push(k)}}
  for(const to in pend){const cap=Math.min(MAXSK,Math.max(0,lvl-reqLvOf(to)+1));
    for(const [k,v] of pend[to]){const room=Math.max(0,cap-(sk[to]||0)),mv=Math.min(v,room);if(mv>0)sk[to]=(sk[to]||0)+mv;back+=v-mv;moved.push({from:k,to,mv,back:v-mv})}}
  return{sk,back,gone,moved,skOld}}
// 장비 옵션 정리: 없어진 계열(tr_5 = 옛 속죄)은 심판(tr_0)으로, 없어진 마법의 +스킬은 GONE_SK로
function fixStats(st){if(!st||typeof st!=='object')return st;
  for(const k of Object.keys(st)){let to=null;
    if(/^tr_\d+$/.test(k)&&+k.slice(3)>=5)to='tr_0';else if(k.startsWith('sk_')&&!SPELLS[k.slice(3)]&&GONE_SK[k.slice(3)])to='sk_'+GONE_SK[k.slice(3)];
    if(to===null)continue;const v=st[k];delete st[k];st[to]=(st[to]||0)+v}
  return st}

/* ---------- messages ---------- */
const logEl=$('#log');
function msg(t,c){if(GHOST)return;const d=document.createElement('div');d.textContent=t;d.style.color=c||'#ece6d6';logEl.appendChild(d);
  while(logEl.children.length>5)logEl.firstChild.remove();
  setTimeout(()=>{d.style.opacity='0';setTimeout(()=>d.remove(),1100)},5000)}
function ftext(x,y,t,c,big,z){texts.push({x:x+rnd(-6,6),y,z:z||40,t,c,life:1,big})}
function burst(x,y,col,n,sp,size,z){z=z==null?12:z;n=Math.ceil(n*Q.burstK);for(let i=0;i<n&&parts.length<Q.pcap;i++){const a=R()*6.283,s=rnd(.2,1)*sp;parts.push({x,y,z,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(-.3,.6)*s*.6,life:rnd(.35,.8),max:.8,col,sz:rnd(1.5,size||3.5)})}}
function rise(x,y,col,z){parts.push({x,y,z:z||0,vx:rnd(-10,10),vy:rnd(-10,10),vz:rnd(30,60),life:.7,max:.7,col,sz:2})}
