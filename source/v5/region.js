
/* ---------- 지역: 맵 끝 포탈로 이어지는 넓은 땅 ---------- */
// 맵 네 변의 포탈 자리. 넘어가면 맞은편 변 포탈 옆에 선다
const SIDE={W:{x:130,y:3000},E:{x:5870,y:3000},N:{x:3000,y:130},S:{x:3000,y:5870}};
const OPP={W:'E',E:'W',N:'S',S:'N'},INW={W:[1,0],E:[-1,0],N:[0,1],S:[0,-1]};
const SIDEN={W:'서쪽',E:'동쪽',N:'북쪽',S:'남쪽'};
function vnoise(x,y,sd){const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  const a=hash(i+sd,j),b=hash(i+1+sd,j),c=hash(i+sd,j+1),d=hash(i+1+sd,j+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const fbm=(x,y,sd)=>vnoise(x,y,sd)*.65+vnoise(x*2.3,y*2.3,sd+71)*.35;
const REGIONS={
  home:{id:'home',n:'아르세이아 남부',base:1,col:'#d6b262',edges:{E:'plains',W:'forest',N:'royal'}},
  plains:{id:'plains',n:'황금 평원',base:24,col:'#ffd76a',entry:'W',edges:{W:'home',S:'desert'},seed:11,
    town:{id:'goldmere',n:'골드미어',area:'황금 밀밭',desc:'끝없는 밀밭 사이의 풍차 마을. 들판 너머 폭풍이 자주 몰려옵니다.',roof:['#7a5a22','#6a3a22','#5a5a2a','#7a4a2a']},
    th:{pal:[[92,88,40],[74,72,34]],deep:[70,60,40],liq:{col:[40,70,96],th:.79,kind:'water'},grass:340,gm:[1.45,1.4,.8],flow:1,fcol:['#e8c04a','#e86a4a','#f0e0a0','#a8c0e8'],tile:.45,paint:'meadow'},
    mix:[['wheat',22],['haystack',4],['flowers',10],['windtree',8],['oak',8],['rock',6],['bush',8]],
    mobs:['p_wolf','p_raider','p_ogre','p_storm'],boss:'r_grumba'},
  forest:{id:'forest',n:'고목의 숲',base:26,col:'#8ae06a',entry:'E',edges:{E:'home'},seed:23,
    town:{id:'elderhold',n:'엘드홀트',area:'고목 야영지',desc:'천 년 묵은 나무들 아래 숨은 사냥꾼들의 야영지.',roof:['#3e4a26','#2e3e22','#4a3a22','#3a3a2a']},
    th:{pal:[[38,56,28],[30,46,26]],deep:[24,32,24],liq:{col:[30,52,50],th:.8,kind:'water'},grass:380,gm:[1.3,1.6,1.1],flow:1,fcol:['#c8a0e0','#e0e0c0','#a0c8ff','#e07a8a'],tile:.55,paint:'lush'},
    mix:[['oak',26],['tree',18],['mushroom',8],['fern',12],['mossrock',8],['bush',8],['stump',4]],
    mobs:['f_slime','f_were','f_golem','f_dryad'],boss:'r_eldrak'},
  desert:{id:'desert',n:'붉은 사막',base:32,col:'#ff9a5a',entry:'N',edges:{N:'plains',E:'jungle'},seed:37,
    town:{id:'sahar',n:'사하르 오아시스',area:'오아시스 시장',desc:'붉은 모래 바다 한가운데의 오아시스. 대상들이 물과 소문을 나눕니다.',roof:['#9a6a3a','#8a4a2a','#a07a4a','#7a5a3a']},
    th:{pal:[[150,104,62],[128,84,50]],deep:[110,62,40],liq:{col:[40,96,104],th:.86,kind:'water'},grass:0,flow:0,tile:.12,paint:'sand'},
    mix:[['cactus',12],['bones',8],['sandrock',14],['ruinpillar',5],['palm',3]],
    mobs:['d_scorp','d_mummy','d_sand','d_viper'],boss:'r_sakra'},
  ice:{id:'ice',n:'북부 빙원',base:36,col:'#9fe0ff',entry:'S',edges:{S:'royal',N:'lava'},seed:41,
    town:{id:'frostheim',n:'프로스트헤임',area:'얼어붙은 항구',desc:'눈보라를 견디는 북방인의 성채 마을. 늘 장작 냄새가 납니다.',roof:['#2a405a','#3a4a5a','#4a3a3a','#2a3a4a']},
    th:{pal:[[176,184,196],[150,160,178]],deep:[110,120,146],liq:{col:[40,66,96],th:.8,kind:'ice'},grass:40,gm:[.9,.95,1.05],flow:0,tile:.1,paint:'snow'},
    mix:[['snowpine',24],['icespike',8],['iceboulder',10],['frozenbones',4],['rock',4]],
    mobs:['i_yeti','i_wraith','i_elem','i_knight'],boss:'r_hrimnir'},
  jungle:{id:'jungle',n:'타말 정글',base:40,col:'#5ae0a0',entry:'W',edges:{W:'desert',S:'sea'},seed:53,
    town:{id:'tamal',n:'타말 신전촌',area:'잊힌 신전 터',desc:'덩굴에 묻힌 옛 신전 곁의 마을. 밤이면 북소리가 들립니다.',roof:['#3a5a2a','#5a4a2a','#2a4a3a','#4a3a22']},
    th:{pal:[[34,66,30],[26,52,28]],deep:[20,40,26],liq:{col:[34,60,44],th:.74,kind:'water'},grass:420,gm:[1.2,1.7,1.1],flow:1,fcol:['#ff5a8a','#ffb03a','#c05aff','#ffffff'],tile:.55,paint:'lush'},
    mix:[['jungletree',26],['bigleaf',16],['fern',14],['templestone',6],['mossrock',6]],
    mobs:['j_lizard','j_panther','j_viper','j_golem'],boss:'r_kali'},
  lava:{id:'lava',n:'잿불 용암지대',base:46,col:'#ff6a3a',entry:'S',edges:{S:'ice'},seed:67,
    town:{id:'emberhold',n:'엠버홀드',area:'흑요석 요새',desc:'흑요석 성벽으로 용암을 막아 선 마지막 요새.',roof:['#4a2a22','#3a2222','#5a3a2a','#2a2222']},
    th:{pal:[[56,42,38],[44,32,30]],deep:[36,22,20],liq:{col:[220,90,30],th:.73,kind:'lava'},grass:0,flow:0,tile:.08,paint:'lava'},
    mix:[['lavarock',16],['obsidian',10],['ashtree',10],['vent',6],['bones',3]],
    mobs:['l_imp','l_golem','l_elem','l_knight'],boss:'r_ifrit'},
  sea:{id:'sea',n:'산호 군도',base:52,col:'#5ac8ff',entry:'N',edges:{N:'jungle'},seed:79,
    town:{id:'pearlport',n:'펄 하버',area:'산호 항구',desc:'산호초 위에 세운 항구. 바다 저편의 노래가 뱃사람을 홀립니다.',roof:['#2a4e6a','#5a3a2a','#2a5a5a','#6a5a3a']},
    th:{pal:[[160,140,96],[140,122,84]],deep:[120,104,74],liq:{col:[30,90,130],th:.56,kind:'water'},grass:60,gm:[1.1,1.25,.9],flow:0,tile:.15,paint:'beach'},
    mix:[['palm',14],['coral',10],['shell',8],['searock',14],['wreck',3]],
    mobs:['s_crab','s_drown','s_serp','s_siren'],boss:'r_merrow'},
};
// v18 월드 확장: 새 지역은 끝에 덧붙인다(순서를 바꾸면 같이 하기의 지역 번호 regArea가 어긋난다) · 기존 지역 새 포탈 · 2막 의뢰인
Object.assign(REGIONS,WX_REGIONS,W3_REGIONS,WX21_REGIONS);for(const id in WX_EDGE_ADD)Object.assign(REGIONS[id].edges,WX_EDGE_ADD[id]);Object.assign(QNPC,WX_QNPC);
// v26 왕도 (사용자 2026-10-10): 남부 바로 북쪽의 작은 지도. 하얀 성벽 도시 하나가 한가운데 있고, 사방 고갯길 끝 포탈이 남부 · 빙원 · 고원 · 협곡으로 이어진다.
// 몬스터는 나오지 않는다(왕도 전체가 안전 지대 · royal26.js). 같이 하기 지역 번호가 밀리지 않게 맨 뒤에 붙인다.
// side: 이 지도만 포탈이 맵 끝이 아니라 한가운데에서 1750 떨어진 곳에 선다 (작은 지도). at: 마을 자리. clear: 자연 장식을 두지 않는 성안.
REGIONS.royal={id:'royal',n:'왕도 아르덴',base:16,col:'#f0e2b0',entry:'S',edges:{S:'home',N:'ice',W:'highland',E:'canyon'},seed:131,royal:1,
  at:[3000,3000],straight:1,noLair:1,side:{W:{x:1250,y:3000},E:{x:4750,y:3000},N:{x:3000,y:1250},S:{x:3000,y:4750}},
  town:{id:'arden',n:'아르덴',area:'왕도',desc:'하얀 성벽의 왕도. 왕궁과 네 직업의 전당(왕립 마법원 · 대성당 · 기사단 전당 · 사냥꾼 회관)이 있습니다.',roof:['#24325c','#32244e','#24404e','#40325c'],white:true},
  th:{pal:[[92,118,62],[80,100,56]],deep:[70,88,52],liq:{col:[50,80,100],th:9,kind:'water'},grass:150,gm:[1,1.06,1],flow:1,fcol:['#f4f0e4','#b0a0f0','#ffd76a','#e07a96'],tile:.3,paint:'royal'},
  mix:[['oak',12],['windtree',3],['bush',6],['mossrock',2],['rock',1]],
  clear:(x,y)=>Math.max(Math.abs(x-3000),Math.abs(y-3000))<1000};
const REG_IDS=Object.keys(REGIONS).filter(k=>k!=='home');
const sideOf=(id,sd)=>((REGIONS[id]&&REGIONS[id].side)||SIDE)[sd];
// 지역 몬스터: 들판 몬스터보다 단단하고 아프다
const RTYPES={
  p_wolf:{n:'초원 늑대 우두머리',min:24,hp:70,dmg:12,spd:170,r:16,xp:40,aggro:380,atk:.9,col:'#a8946a',draw:'wolf',eye:'#ffcc4a'},
  p_raider:{n:'평원 약탈 기사',min:25,hp:150,dmg:16,spd:110,r:17,xp:50,aggro:360,atk:1.2,col:'#a08a5a',draw:'knight'},
  p_ogre:{n:'바위 오우거',min:27,hp:280,dmg:22,spd:78,r:23,xp:70,aggro:320,atk:1.5,col:'#8a7a4e',draw:'ogre'},
  p_storm:{n:'폭풍 정령',min:30,hp:120,dmg:18,spd:105,r:16,xp:60,aggro:460,atk:1.6,col:'#ffe066',ranged:true,pcol:'#ffe066',draw:'elemental',alt:'wraith'},
  f_slime:{n:'독 포자 덩어리',min:26,hp:110,dmg:13,spd:80,r:16,xp:42,aggro:300,atk:1.1,col:'#8a6ac0',draw:'slime'},
  f_were:{n:'늑대인간',min:27,hp:170,dmg:19,spd:165,r:18,xp:56,aggro:420,atk:.9,col:'#4a3e34',draw:'wolf',eye:'#ff3a2a'},
  f_golem:{n:'이끼 골렘',min:29,hp:340,dmg:24,spd:62,r:24,xp:76,aggro:300,atk:1.6,col:'#5a7a3e',draw:'golem',alt:'ogre'},
  f_dryad:{n:'타락한 숲 정령',min:32,hp:130,dmg:20,spd:100,r:15,xp:64,aggro:480,atk:1.6,col:'#6ac07a',ranged:true,pcol:'#9aff8a',draw:'wraith'},
  d_scorp:{n:'붉은 전갈',min:32,hp:160,dmg:20,spd:130,r:18,xp:60,aggro:360,atk:1,col:'#b04a2a',draw:'scorpion',alt:'wolf'},
  d_mummy:{n:'모래 미라',min:33,hp:220,dmg:22,spd:80,r:16,xp:66,aggro:340,atk:1.3,col:'#c8b088',undead:true,draw:'skeleton'},
  d_sand:{n:'모래 정령',min:35,hp:180,dmg:22,spd:110,r:18,xp:72,aggro:460,atk:1.7,col:'#d8a060',ranged:true,pcol:'#ffc070',draw:'elemental',alt:'wraith'},
  d_viper:{n:'사막 독사',min:38,hp:200,dmg:26,spd:140,r:16,xp:80,aggro:400,atk:1.1,col:'#c0a040',draw:'serpent',alt:'wolf',eye:'#9aff3a'},
  i_yeti:{n:'설인',min:36,hp:360,dmg:28,spd:100,r:22,xp:88,aggro:360,atk:1.4,col:'#dfe6f0',draw:'yeti',alt:'ogre'},
  i_wraith:{n:'서리 망령',min:37,hp:180,dmg:24,spd:115,r:15,xp:80,aggro:480,atk:1.6,col:'#8ad8ff',ranged:true,pcol:'#bff0ff',undead:true,draw:'wraith'},
  i_elem:{n:'얼음 정령',min:39,hp:240,dmg:26,spd:95,r:18,xp:86,aggro:460,atk:1.7,col:'#9fe0ff',ranged:true,pcol:'#cff4ff',draw:'elemental',alt:'wraith'},
  i_knight:{n:'서리 기사',min:42,hp:420,dmg:32,spd:100,r:19,xp:104,aggro:380,atk:1.3,col:'#9ab0c8',undead:true,draw:'knight',eye:'#8ae8ff'},
  j_lizard:{n:'도마뱀 주술사',min:40,hp:200,dmg:26,spd:100,r:15,xp:90,aggro:440,atk:1.6,col:'#4a9a5a',ranged:true,pcol:'#7aff6a',draw:'goblin'},
  j_panther:{n:'그림자 표범',min:41,hp:260,dmg:30,spd:190,r:18,xp:96,aggro:440,atk:.85,col:'#2a2a3a',draw:'panther',alt:'wolf',eye:'#ffe04a'},
  j_viper:{n:'거대 비단뱀',min:43,hp:380,dmg:32,spd:120,r:20,xp:104,aggro:380,atk:1.2,col:'#5a8a3a',draw:'serpent',alt:'slime'},
  j_golem:{n:'신전 수호석상',min:46,hp:560,dmg:38,spd:70,r:24,xp:124,aggro:320,atk:1.6,col:'#8a8a6a',draw:'golem',alt:'ogre',eye:'#5affc0'},
  l_imp:{n:'불 임프',min:46,hp:220,dmg:30,spd:150,r:14,xp:110,aggro:480,atk:1.4,col:'#d04a2a',ranged:true,pcol:'#ff7a2a',draw:'imp',alt:'goblin'},
  l_golem:{n:'용암 골렘',min:47,hp:620,dmg:40,spd:66,r:25,xp:130,aggro:320,atk:1.6,col:'#6a3a2a',draw:'golem',alt:'ogre',eye:'#ffb03a'},
  l_elem:{n:'화염 정령',min:49,hp:320,dmg:36,spd:110,r:18,xp:124,aggro:480,atk:1.6,col:'#ff7a2e',ranged:true,pcol:'#ffb04a',draw:'elemental',alt:'wraith'},
  l_knight:{n:'지옥 기사',min:52,hp:560,dmg:44,spd:105,r:19,xp:144,aggro:400,atk:1.3,col:'#8a3a2a',undead:true,draw:'knight',eye:'#ff4a1a'},
  s_crab:{n:'산호 게',min:52,hp:520,dmg:40,spd:90,r:20,xp:140,aggro:340,atk:1.3,col:'#e06a4a',draw:'crab',alt:'slime'},
  s_drown:{n:'익사자',min:53,hp:440,dmg:42,spd:95,r:16,xp:144,aggro:380,atk:1.2,col:'#6aa8a0',undead:true,draw:'skeleton'},
  s_serp:{n:'바다뱀',min:55,hp:560,dmg:46,spd:140,r:20,xp:156,aggro:420,atk:1.1,col:'#3a7ab0',draw:'serpent',alt:'wolf',eye:'#ffe04a'},
  s_siren:{n:'세이렌',min:58,hp:400,dmg:48,spd:110,r:16,xp:170,aggro:520,atk:1.5,col:'#5ae0d0',ranged:true,pcol:'#9affff',draw:'wraith'},
  // 지역 우두머리: 지역 깊은 곳 둥지에 산다
  r_grumba:{n:'폭풍들판의 왕 그룸바',hp:900,dmg:30,spd:90,r:30,xp:600,aggro:440,atk:1.4,col:'#9a8a50',draw:'ogre',sc:2,mini:1,skills:['slam','charge','summon'],summon:'p_wolf',aura:'rgba(255,220,100,.28)'},
  r_eldrak:{n:'고목 수호자 엘드락',hp:1100,dmg:32,spd:70,r:30,xp:680,aggro:420,atk:1.6,col:'#4a6a2e',draw:'golem',alt:'ogre',sc:2,mini:1,skills:['slam','summon'],summon:'f_slime',eye:'#9aff6a',aura:'rgba(140,255,120,.25)'},
  r_sakra:{n:'모래 여왕 사크라',hp:1100,dmg:34,spd:130,r:28,xp:760,aggro:440,atk:1,col:'#c04a2a',draw:'scorpion',alt:'wolf',sc:2,mini:1,skills:['charge','summon','slam'],summon:'d_scorp',aura:'rgba(255,150,80,.28)'},
  r_hrimnir:{n:'빙원의 군주 흐림니르',hp:1400,dmg:38,spd:95,r:30,xp:860,aggro:460,atk:1.4,col:'#e8f0ff',draw:'yeti',alt:'ogre',sc:2,mini:1,skills:['slam','volley','charge'],pcol:'#cff4ff',aura:'rgba(160,220,255,.3)'},
  r_kali:{n:'밀림의 그림자 칼리',hp:1400,dmg:42,spd:190,r:26,xp:960,aggro:480,atk:.8,col:'#1e1e2e',draw:'panther',alt:'wolf',sc:2,mini:1,skills:['charge','summon'],summon:'j_panther',eye:'#ffe04a',aura:'rgba(200,120,255,.28)'},
  r_ifrit:{n:'화염 군주 이프리트',hp:1700,dmg:46,spd:110,r:28,xp:1100,aggro:500,atk:1.4,col:'#ff6a2a',ranged:true,pcol:'#ffb04a',draw:'elemental',alt:'apostle',sc:2.2,mini:1,skills:['volley','slam','summon'],summon:'l_imp',aura:'rgba(255,120,40,.32)'},
  r_merrow:{n:'심해의 여왕 메로우',hp:1900,dmg:50,spd:130,r:28,xp:1260,aggro:520,atk:1.3,col:'#3a8ac0',ranged:true,pcol:'#9affff',draw:'serpent',alt:'wraith',sc:2.1,mini:1,skills:['volley','summon','charge'],summon:'s_crab',aura:'rgba(90,200,255,.3)'},
};
for(const k in RTYPES){const t=RTYPES[k];t.reg=1;if(!MON[t.draw])t.draw=t.alt||'wolf'}
Object.assign(TYPES,RTYPES);
// v18 월드 확장: 새 몬스터 97종 (들판·둥지 몬스터는 reg) · 기존 지역 들판 몬스터 피해 조정(사용자 결정) · 구별용 색 · 상급 유니크 · 2막
for(const k in WX_TYPES){const t=WX_TYPES[k];if(t.min||k.startsWith('r_'))t.reg=1;if(!MON[t.draw])t.draw=t.alt||'wolf';if(WX_TINT[k])Object.assign(t,WX_TINT[k])}
Object.assign(TYPES,WX_TYPES);for(const k in WX_RETUNE)TYPES[k].dmg=WX_RETUNE[k];Object.assign(MON_V,WX_MONV);BOSSU.push(...WX_BOSSU);QUESTS.push(...WX_ACT2);

// 지금 지역의 땅 정보
let EDGES=[],LQ=null,actEdge=null;const LQN=121,LQS=50;
function liqAt(x,y){if(!LQ)return 0;const fx=clamp(x/LQS,0,LQN-1.001),fy=clamp(y/LQS,0,LQN-1.001),i=fx|0,j=fy|0,u=fx-i,v=fy-j,k=j*LQN+i;
  return LQ[k]*(1-u)*(1-v)+LQ[k+1]*u*(1-v)+LQ[k+LQN]*(1-u)*v+LQ[k+LQN+1]*u*v}
const blockedAt=(x,y)=>(LQ!==null&&liqAt(x,y)>.5)||terrWall(x,y);
const HOME={id:'home',towns:[...TOWNS],roads:ROADS.map(r=>r),decor:[...decor],lights:[...LIGHTS],caves:[...CAVES]};
const ALLTOWNS=[...TOWNS];TOWNS.forEach(t=>t.reg='home');
const RCACHE={};
function edgeDecor(side,to,from){const p=sideOf(from||'home',side),R2=REGIONS[to],lv=R2.base;
  return{x:p.x,y:p.y,k:'edgeportal',s:1,v:0,light:170,side,to,col:R2.col,label:to==='home'?`${R2.n}로 (${SIDEN[side]})`:`${R2.n}로 · 몬스터 Lv${lv}~`}}
// 지역 땅 만들기 (같은 씨앗이면 늘 같은 땅)
function buildRegion(id){
  const D=REGIONS[id],s=mulberry(D.seed*9973),th=D.th;
  const ent=sideOf(id,D.entry),iv=INW[D.entry],T={...D.town,x:D.at?D.at[0]:ent.x+iv[0]*820,y:D.at?D.at[1]:ent.y+iv[1]*820,base:D.base,reg:id};
  T.shop={x:T.x+110,y:T.y-40};T.gate={x:T.x-60,y:T.y+120};T.stash={x:T.x+75,y:T.y+175};
  if(!ALLTOWNS.includes(T))ALLTOWNS.push(T);
  // 길: 모든 포탈에서 전초 마을까지
  const roads=[];
  for(const sd in D.edges){const A=sideOf(id,sd),B=T,mx=(A.x+B.x)/2,my=(A.y+B.y)/2,dx=B.x-A.x,dy=B.y-A.y,l=Math.hypot(dx,dy)||1,r0=s(),off=D.straight?0:(r0-.5)*l*.3,cx=mx-dy/l*off,cy=my+dx/l*off,pts=[];
    for(let i=0;i<=40;i++){const u=i/40;pts.push({x:(1-u)*(1-u)*A.x+2*(1-u)*u*cx+u*u*B.x,y:(1-u)*(1-u)*A.y+2*(1-u)*u*cy+u*u*B.y})}roads.push(pts)}
  // v18 지역 던전: 마을에서 동굴마다 길을 하나씩
  const caves=wxCaves(id).concat(w3Caves(id));for(const c of caves)roads.push(wxRoad(T,c,s));
  // 우두머리 둥지: 들어온 쪽에서 가장 먼 구석
  const pv=[-iv[1],iv[0]],lair=D.noLair?{x:-9e3,y:-9e3}:{x:3000+iv[0]*1750+pv[0]*1350,y:3000+iv[1]*1750+pv[1]*1350};
  const edges=Object.keys(D.edges).map(sd=>edgeDecor(sd,D.edges[sd],id));
  // 물/용암 격자
  // rd(x,y,cap): 길까지 거리 (cap보다 먼 길은 상자 검사로 건너뛰고 cap을 돌려준다 — cap 안쪽 결과는 같다)
  const rbb=roads.map(r=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const p of r){a=Math.min(a,p.x);b=Math.min(b,p.y);c=Math.max(c,p.x);d=Math.max(d,p.y)}return[a,b,c,d]});
  const lq=new Float32Array(LQN*LQN),rd=(x,y,cap)=>{let m=cap||1e9;for(let k=0;k<roads.length;k++){const r=roads[k],B=rbb[k];if(x<B[0]-m||x>B[2]+m||y<B[1]-m||y>B[3]+m)continue;for(let i=1;i<r.length;i++){const d=segDist(x,y,r[i-1].x,r[i-1].y,r[i].x,r[i].y);if(d<m)m=d}}return m};
  for(let j=0;j<LQN;j++)for(let i=0;i<LQN;i++){const x=i*LQS,y=j*LQS;let n=fbm(x/620,y/620,D.seed*31);
    let a=clamp((n-th.liq.th)/.05+.5,0,1);// 물이 아닌 칸은 길·마을 거리 계산을 건너뛴다 (결과는 같고 시작이 빨라진다)
    if(a>0){const keep=Math.min((Math.hypot(x-T.x,y-T.y)-SAFE-120)/200,(rd(x,y,160)-70)/90,(Math.hypot(x-lair.x,y-lair.y)-300)/150,...edges.map(e=>(Math.hypot(x-e.x,y-e.y)-240)/120),...caves.map(c=>(Math.hypot(x-c.x,y-c.y)-260)/120));if(keep<1)a*=clamp(keep,0,1)}lq[j*LQN+i]=a}
  const prevLQ=LQ;LQ=lq;
  const dec=[];
  const tot=D.mix.reduce((a,b)=>a+b[1],0);
  for(let i=0;i<1900;i++){const x=s()*WORLD,y=s()*WORLD,t=s()*tot,sc=.75+s()*.6,v=s();
    let k=D.mix[0][0],acc=0;for(const [kk,w] of D.mix){acc+=w;if(t<acc){k=kk;break}}
    const wet=k==='coral'||k==='wreck'||k==='searock'||k==='shell',lv=liqAt(x,y);
    if(wet?lv>.92:lv>.15)continue;if(!wet&&k==='palm'&&id==='desert'&&s()<.5)continue;
    if(D.clear&&D.clear(x,y)||Math.hypot(x-T.x,y-T.y)<TOWN_R+90||rd(x,y,52)<52||Math.hypot(x-lair.x,y-lair.y)<180||edges.some(e=>Math.hypot(x-e.x,y-e.y)<200)||caves.some(c=>Math.hypot(x-c.x,y-c.y)<160))continue;
    const d={x,y,k,s:sc,v,zl:0};if(k==='vent')d.light=90;dec.push(d)}
  // 둥지 둘레의 옛 기둥
  if(!D.noLair)for(let i=0;i<8;i++){const a=i/8*6.283;dec.push({x:lair.x+Math.cos(a)*240,y:lair.y+Math.sin(a)*170,k:'ruinpillar',s:1.1,v:i/8,zl:0,light:i%2?0:80})}
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2+.4;const hx=T.x+Math.cos(a)*215,hy=T.y+Math.sin(a)*205;
    if(Math.hypot(hx-T.shop.x,hy-T.shop.y)<175||Math.hypot(hx-T.gate.x,hy-T.gate.y)<175)continue;dec.push({x:hx,y:hy,k:'house',v:i,s:1,town:T,light:70})}
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.2;dec.push({x:T.x+Math.cos(a)*285,y:T.y+Math.sin(a)*285,k:'lamp',s:1,v:0,light:170})}
  dec.push({x:T.x,y:T.y,k:'fountain',s:1,v:0,light:190},{x:T.shop.x,y:T.shop.y,k:'shop',s:1,v:0,town:T,light:150},{x:T.gate.x,y:T.gate.y,k:'gate',s:1,v:0,town:T,light:140},{x:T.stash.x,y:T.stash.y,k:'stash',s:1,v:0,town:T,light:110});
  dec.push(...edges);dec.push(...caves);const spots=wxRegionExtras(id,T,dec,lair,caves,edges,lq);
  LQ=prevLQ;
  return{id,towns:[T],roads,decor:dec,lights:dec.filter(d=>d.light),caves,edges,lq,lair:D.noLair?null:lair,town:T,spots}}
// 홈의 포탈
HOME.edges=Object.keys(REGIONS.home.edges).map(sd=>edgeDecor(sd,REGIONS.home.edges[sd],'home'));
for(let i=HOME.decor.length-1;i>=0;i--)if(HOME.edges.some(e=>Math.hypot(HOME.decor[i].x-e.x,HOME.decor[i].y-e.y)<200))HOME.decor.splice(i,1);
HOME.decor.push(...HOME.edges);HOME.lights.push(...HOME.edges);
const setArr=(a,b)=>{a.length=0;a.push(...b)};
function loadRegion(id){
  if(!REGIONS[id])id='home';
  let L;if(id==='home')L=HOME;else L=RCACHE[id]||(RCACHE[id]=buildRegion(id));
  const D=REGIONS[id];
  REG={id,n:D.n,seed:D.seed|0,th:D.th||null,zs:id==='home'?0:(D.zs||360),zc:D.zcap||0,mobs:D.mobs||null,boss:D.boss||null,lair:L.lair||null,bossE:null,bossDead:false,col:D.col};
  setArr(TOWNS,L.towns);setArr(ROADS,L.roads);setArr(decor,L.decor);setArr(LIGHTS,L.lights);setArr(CAVES,L.caves);EDGES=L.edges;LQ=id==='home'?null:L.lq;
  chunks.clear();mmBg=null;terrApply(id)}
for(const id of REG_IDS)RCACHE[id]=buildRegion(id); // 짝문 목록에 모든 전초 마을을 올려 둔다
const regOf=a=>a===-1?'home':a<=-10?REG_IDS[-a-10]:null;
const regArea=()=>REG.id==='home'?-1:-(10+REG_IDS.indexOf(REG.id));
const nearEdge=()=>DG?null:EDGES.find(e=>dist(P,e)<95);
function arrivalOf(side,to){const p=sideOf(to||'home',OPP[side]),iv=INW[OPP[side]];return{x:p.x+iv[0]*170,y:p.y+iv[1]*170}}
// 다른 지역으로 건너가기 (방장/혼자일 때). x,y가 없으면 그 지역 마을 짝문 앞
function switchRegion(id,x,y,quiet){
  if(DG)leaveDungeon();
  loadRegion(id);
  if(x==null){const t=TOWNS[0];x=t.gate.x+40;y=t.gate.y+40}
  P.x=clamp(x,20,WORLD-20);P.y=clamp(y,20,WORLD-20);
  enemies=[];projs=[];fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];decals=[];
  for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}
  followCam();
  if(!quiet){const D=REGIONS[id];burst(P.x,P.y,D.col,40,180);rings.push({x:P.x,y:P.y,r:10,max:110,life:.7,col:D.col});
    banner={t:D.n,sub:id==='home'?'익숙한 땅으로 돌아왔습니다':`몬스터 레벨 ${D.base+DIFF[P.diff].add}부터 · 깊이 들어갈수록 강해집니다`,col:D.col,life:2.6,max:2.6};flash={col:D.col,a:.25}}
  if(NET.host)netSend({t:'reg',id,x:Math.round(P.x),y:Math.round(P.y)});
  save()}
function useEdge(ep){const a=arrivalOf(ep.side,ep.to);
  if(NET.guest){netSend({t:'req',to:NET.hostId,a:'reg',id:ep.to,x:a.x,y:a.y});msg('파티와 함께 넘어가는 중입니다','#9fe0ff');return}
  switchRegion(ep.to,a.x,a.y)}
// 짝문으로 다른 지역 마을에 가기
function travelTown(t){
  if(t.reg!==REG.id){if(NET.guest){netSend({t:'req',to:NET.hostId,a:'reg',id:t.reg,x:t.gate.x+40,y:t.gate.y+40});closePanel();msg('파티와 함께 넘어가는 중입니다','#9fe0ff');return true}
    P.home=t.id;switchRegion(t.reg,t.gate.x+40,t.gate.y+40,true);closePanel();burst(P.x,P.y,'#b9a2ff',40,180);msg(`짝문을 지나 ${t.n}에 도착했습니다`,'#c9b4ff');
    const D=REGIONS[t.reg];banner={t:D.n,sub:t.n,col:D.col,life:2.2,max:2.2};return true}
  return false}
// 같이 하기: 방장이 넘어가면 따라간다
function netFollowReg(a,x,y){const id=regOf(a);if(!id||id===REG.id&&!DG)return false;
  if(x==null){const h=NET.peers.get(NET.hostId);if(h&&h.area===a){x=h.tx+rnd(-40,40);y=h.ty+rnd(-40,40)}}
  if(x!=null&&(blockedAt(x,y)&&id===REG.id))x=null;
  if(DG)leaveDungeon();loadRegion(id);
  if(x==null){const t=TOWNS[0];x=t.gate.x+40;y=t.gate.y+40}
  P.x=clamp(x,20,WORLD-20);P.y=clamp(y,20,WORLD-20);enemies=[];projs=projs.filter(p=>p.owner==='p');fields=[];loot=[];warns=[];followCam();
  const D=REGIONS[id];banner={t:D.n,sub:'파티와 함께 넘어왔습니다',col:D.col,life:2.2,max:2.2};msg(`파티와 함께 ${D.n}에 들어섰습니다`,D.col);save();return true}
// 지역 우두머리: 둥지 가까이 가면 나타난다
function regionTick(dt){
  if(!DG)terrFix(P);
  if(DG||!REG.boss||REG.bossDead||NET.guest)return;
  const e=REG.bossE;if(e){if(e.dead){REG.bossDead=true;REG.bossE=null;msg('이 지역의 우두머리가 쓰러졌습니다. 다시 들어오면 되살아납니다','#ffd98a')}else if(e.gone||!enemies.includes(e))REG.bossE=null;return}
  for(const o of netPlayers())if(dist(o,REG.lair)<950){const L=Math.max(1,Math.floor(levelAt(REG.lair.x,REG.lair.y))+2+DIFF[P.diff].add);
    const b=dgMob(REG.boss,REG.lair.x,REG.lair.y,L);REG.bossE=b;b.aggroed=true;
    for(let i=0;i<3;i++)dgMob(pick(REG.mobs),REG.lair.x+rnd(-140,140),REG.lair.y+rnd(-140,140),L-2);
    banner={t:TYPES[REG.boss].n,sub:`${REG.n}의 우두머리 · Lv${L}`,col:'#ff8a3a',life:2.6,max:2.6};shake=Math.max(shake,8);return}}
// 지역 땅 색과 질감 → ground.js (REGION_GROUND 표)
loadRegion('home');
