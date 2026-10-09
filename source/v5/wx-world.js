/* ==========================================================================
   월드 확장 데이터 · 지역 5곳 추가, 지역 연결 8곳, 지역 던전 24곳, 새 몬스터
   스레드 「월드 확장」이 만든 설계 데이터. rpg/src 는 건드리지 않았다. 붙이는 법은 INTEGRATION.md.
   몬스터 데미지(dmg)는 아래 FIELD_BUDGET 기준으로 계산했다(손으로 적은 값 아님).
   ========================================================================== */
// 들판 몬스터 한 대가 같은 레벨 캐릭터(장비 없음, 활력에 30% 투자) 기본 생명력의 몇 %까지 깎을 수 있나
// fast=빠른 근접, melee=보통 근접, heavy=느리고 무거운 근접, ranged=원거리. dps=초당 피해 상한(생명력 대비)
// 기준 생명력 HP(L)=40+12L+4(10+1.5(L-1)), 레벨 배수 1+.18(L-1) (b3.js spawnEnemy 와 같은 식)
// 깊은 지역 보정: 기준 × (1 + (L-24)×0.01)  (레벨 58이면 ×1.34)
const FIELD_BUDGET={grow:.01,growFrom:24,fast:0.15,melee:0.19,heavy:0.23,ranged:0.17,dps:0.17,mini:0.28,boss:0.34};

// 1) 새 지역 다섯 곳. region.js REGIONS 끝에 "덧붙인다"(순서를 바꾸면 같이 하기의 지역 번호가 어긋난다)
const WX_REGIONS={
  moor:{id:'moor',n:'바람의 황야',base:29,col:'#b89ad8',entry:'N',edges:{N:'home',E:'desert'},seed:89,town:{id:'rookwell',n:'까마귀샘',area:'선돌 샘터',desc:'선돌이 줄지어 선 황야의 샘터 마을. 까마귀가 사람보다 많습니다.',roof:['#4a3e52','#3e3a3a','#5a4a3a','#3a3a4a']},th:{pal:[[86,74,84],[70,62,64]],deep:[50,44,48],liq:{col:[40,52,70],th:0.82,kind:'water'},grass:300,gm:[1.1,0.95,1.15],flow:1,fcol:['#b48ae0','#e0d0f0','#8a6ac0','#f0e0a0'],tile:0.4,paint:'meadow'},mix:[['flowers',14],['rock',12],['mossrock',10],['bush',10],['ruinpillar',4],['stump',4],['bones',3],['oak',4]],mobs:['h_hound','h_cairn','h_keen','h_troll'],boss:'r_crombal'},
  highland:{id:'highland',n:'서리바람 고원',base:34,col:'#c8d8e8',entry:'S',edges:{S:'forest',E:'ice'},seed:97,town:{id:'windcrag',n:'바람목 산채',area:'산마루 장터',desc:'구름 위 능선에 매달린 산사람들의 산채. 염소젖 치즈와 독한 술이 명물입니다.',roof:['#5a4a3a','#4a3a2e','#3e4a52','#6a5a4a']},th:{pal:[[120,124,104],[96,100,86]],deep:[70,74,70],liq:{col:[50,80,100],th:0.84,kind:'water'},grass:160,gm:[1,1.05,1.05],flow:1,fcol:['#ffffff','#a8c8ff','#f0e080'],tile:0.3,paint:'meadow'},mix:[['snowpine',18],['rock',14],['iceboulder',6],['mossrock',8],['bush',6],['tree',6]],mobs:['k_bear','k_harpy','k_rogue','k_shaman'],boss:'r_skarn'},
  canyon:{id:'canyon',n:'망각의 협곡',base:38,col:'#e0a070',entry:'S',edges:{S:'plains',W:'ice'},seed:103,town:{id:'dustgate',n:'먼지문',area:'협곡 발굴지',desc:'거인들이 남긴 성문 터에 자리 잡은 발굴꾼 마을. 땅을 파면 옛 기계가 나옵니다.',roof:['#8a5a3a','#6a4a3a','#9a7a5a','#5a4a3a']},th:{pal:[[132,96,70],[110,78,58]],deep:[80,54,42],liq:{col:[50,80,90],th:0.9,kind:'water'},grass:0,flow:0,tile:0.2,paint:'sand'},mix:[['sandrock',18],['rock',12],['ruinpillar',8],['bones',4],['cactus',3],['obsidian',3]],mobs:['c_dust','c_bandit','c_scorp','c_automaton'],boss:'r_vorn'},
  cliffs:{id:'cliffs',n:'폭풍 절벽',base:44,col:'#8ab0ff',entry:'W',edges:{W:'jungle',S:'abyss'},seed:109,town:{id:'gullhaven',n:'갈매기 등대',area:'벼랑 등대',desc:'번개가 끊이지 않는 벼랑 끝 등대 마을. 등대지기들이 폭풍을 읽습니다.',roof:['#3a4a6a','#4a4a5a','#2a3a5a','#5a5a6a']},th:{pal:[[84,96,90],[66,76,74]],deep:[40,48,56],liq:{col:[30,60,100],th:0.7,kind:'water'},grass:260,gm:[0.95,1.05,1.1],flow:1,fcol:['#e0e8ff','#ffe066'],tile:0.35,paint:'meadow'},mix:[['rock',16],['searock',10],['windtree',8],['bush',8],['mossrock',8],['wreck',2]],mobs:['t_harpy','t_drake','t_cultist','t_sentinel'],boss:'r_volrak'},
  abyss:{id:'abyss',n:'심연의 균열',base:54,col:'#b07aff',entry:'N',edges:{N:'cliffs',W:'sea'},seed:113,town:{id:'lastlight',n:'마지막 등불',area:'균열 감시 초소',desc:'균열 가장자리에 세운 감시 초소. 꺼지지 않는 등불이 공허를 막고 있습니다.',roof:['#3a2a4a','#2a2a3a','#4a3a5a','#2a2232']},th:{pal:[[60,52,72],[46,40,58]],deep:[26,20,36],liq:{col:[70,30,110],th:0.76,kind:'water'},grass:0,flow:0,tile:0.1,paint:'lava'},mix:[['obsidian',14],['lavarock',8],['ruinpillar',6],['bones',4],['icespike',4],['ashtree',6]],mobs:['v_shade','v_maw','v_knight','v_seer'],boss:'r_nyxar'}
};
// 2) 기존 지역에 새로 여는 포탈 (비어 있던 변만 쓴다). REGIONS[id].edges 에 합친다
const WX_EDGE_ADD={home:{S:'moor'},plains:{N:'canyon'},forest:{N:'highland'},desert:{W:'moor'},ice:{E:'canyon',W:'highland'},jungle:{E:'cliffs'},sea:{E:'abyss'}};
// 3) 세계 지도(M) 자리 (worldmap.js WPOS 에 합친다)
const WX_WPOS={moor:[0,1],highland:[-1,-1],canyon:[1,-1],cliffs:[3,1],abyss:[3,2]};
// 4) 새 몬스터: 새 지역 들판 20종 · 새 지역 우두머리 5 · 던전 준보스 48 · 던전 보스 24 (TYPES 에 합친다)
//    그림(draw)은 이미 있는 16종만 쓴다. 색·눈빛·크기(sc)·기운(aura)으로 구별한다
const WX_TYPES={
  h_hound:{n:'황야 들개',min:29,hp:90,spd:165,r:15,xp:50,aggro:400,atk:0.9,col:'#6a5a6a',draw:'wolf',eye:'#c88aff',dmg:16},
  h_cairn:{n:'돌무덤 전사',min:30,hp:190,spd:90,r:16,xp:58,aggro:340,atk:1.2,col:'#a8a090',undead:true,draw:'skeleton',dmg:20},
  h_keen:{n:'곡하는 망령',min:31,hp:120,spd:110,r:15,xp:60,aggro:460,atk:1.6,col:'#c8b0f0',ranged:true,pcol:'#e0c8ff',undead:true,draw:'wraith',dmg:18},
  h_troll:{n:'이끼 트롤',min:33,hp:320,spd:75,r:23,xp:76,aggro:320,atk:1.5,col:'#6a7a5a',draw:'ogre',dmg:25},
  k_bear:{n:'잿빛 고원곰',min:34,hp:330,spd:105,r:22,xp:80,aggro:340,atk:1.4,col:'#8a7a6a',draw:'yeti',alt:'ogre',dmg:25},
  k_harpy:{n:'산바람 하피',min:35,hp:160,spd:150,r:14,xp:74,aggro:480,atk:1.4,col:'#b8a88a',ranged:true,pcol:'#e8f0ff',draw:'imp',alt:'goblin',dmg:19},
  k_rogue:{n:'변절한 산사람',min:36,hp:250,spd:110,r:17,xp:84,aggro:380,atk:1.1,col:'#7a6a5a',draw:'knight',dmg:21},
  k_shaman:{n:'눈보라 무당',min:38,hp:190,spd:95,r:15,xp:86,aggro:460,atk:1.7,col:'#9ab0c8',ranged:true,pcol:'#d8f0ff',draw:'goblin',dmg:19},
  c_dust:{n:'먼지 회오리',min:38,hp:210,spd:115,r:18,xp:84,aggro:460,atk:1.6,col:'#c8a078',ranged:true,pcol:'#e8c8a0',draw:'elemental',alt:'wraith',dmg:19},
  c_bandit:{n:'협곡 도적',min:39,hp:240,spd:120,r:16,xp:88,aggro:400,atk:1,col:'#8a5a3a',draw:'goblin',dmg:19},
  c_scorp:{n:'바위 갈퀴벌레',min:40,hp:300,spd:120,r:19,xp:94,aggro:360,atk:1.1,col:'#7a6a5a',draw:'scorpion',alt:'wolf',dmg:21},
  c_automaton:{n:'고대 파수 인형',min:41,hp:520,spd:68,r:23,xp:110,aggro:320,atk:1.6,col:'#a08a6a',draw:'golem',alt:'ogre',eye:'#7affff',dmg:27},
  t_harpy:{n:'폭풍 하피',min:44,hp:240,spd:150,r:15,xp:108,aggro:480,atk:1.4,col:'#6a7ab0',ranged:true,pcol:'#c8d8ff',draw:'imp',alt:'goblin',dmg:20},
  t_drake:{n:'절벽 비룡',min:45,hp:420,spd:135,r:20,xp:120,aggro:420,atk:1.2,col:'#4a6a8a',draw:'serpent',alt:'wolf',eye:'#ffe04a',dmg:23},
  t_cultist:{n:'폭풍 숭배자',min:46,hp:300,spd:95,r:16,xp:118,aggro:470,atk:1.7,col:'#3a4a7a',ranged:true,pcol:'#ffe066',draw:'apostle',dmg:21},
  t_sentinel:{n:'번개 수호석',min:48,hp:600,spd:64,r:24,xp:136,aggro:320,atk:1.6,col:'#7a8aa0',draw:'golem',alt:'ogre',eye:'#ffe066',dmg:28},
  v_shade:{n:'심연의 그림자',min:54,hp:380,spd:120,r:15,xp:160,aggro:500,atk:1.5,col:'#4a3a6a',ranged:true,pcol:'#b07aff',undead:true,draw:'wraith',dmg:22},
  v_maw:{n:'삼키는 공허',min:55,hp:560,spd:80,r:21,xp:166,aggro:340,atk:1.4,col:'#2a1a3a',draw:'slime',dmg:30},
  v_knight:{n:'공허 기사',min:56,hp:560,spd:105,r:19,xp:176,aggro:400,atk:1.2,col:'#3a2a4a',undead:true,draw:'knight',eye:'#c88aff',dmg:25},
  v_seer:{n:'균열 예언자',min:58,hp:420,spd:95,r:16,xp:184,aggro:520,atk:1.7,col:'#6a3a8a',ranged:true,pcol:'#d8a0ff',draw:'apostle',dmg:23},
  r_crombal:{n:'돌무덤 거인 크롬발',hp:1150,spd:70,r:30,xp:720,aggro:440,atk:1.6,col:'#8a8478',draw:'golem',alt:'ogre',sc:2,mini:1,skills:['slam','summon'],summon:'h_cairn',eye:'#c88aff',aura:'rgba(190,150,255,.28)',dmg:34},
  r_skarn:{n:'천둥뿔 스카른',hp:1250,spd:110,r:30,xp:820,aggro:460,atk:1.3,col:'#5a4a3a',draw:'yeti',alt:'ogre',sc:2,mini:1,skills:['charge','slam'],aura:'rgba(200,220,255,.28)',dmg:34},
  r_vorn:{n:'거인의 파수꾼 보른',hp:1500,spd:70,r:30,xp:920,aggro:440,atk:1.6,col:'#b0946a',draw:'golem',alt:'ogre',sc:2.2,mini:1,skills:['slam','volley','charge'],pcol:'#7affff',eye:'#7affff',aura:'rgba(255,190,120,.28)',dmg:34},
  r_volrak:{n:'폭풍의 화신 볼라크',hp:1650,spd:115,r:28,xp:1080,aggro:500,atk:1.4,col:'#8ab0ff',ranged:true,pcol:'#ffe066',draw:'elemental',alt:'wraith',sc:2.2,mini:1,skills:['volley','summon','charge'],summon:'t_harpy',aura:'rgba(140,180,255,.32)',dmg:34},
  r_nyxar:{n:'균열의 눈 니크사르',hp:1950,spd:95,r:28,xp:1320,aggro:540,atk:1.4,col:'#7a4aaa',ranged:true,pcol:'#d8a0ff',draw:'apostle',sc:2.3,mini:1,skills:['volley','slam','summon'],summon:'v_shade',aura:'rgba(176,122,255,.34)',dmg:34},
  m_quik:{n:'곡물굴 쥐왕 퀴크',hp:300,spd:160,r:20,atk:0.9,col:'#8a6a4a',draw:'wolf',sc:1.6,skills:['charge','summon'],summon:'p_wolf',eye:'#ffcc4a',dmg:28,xp:214,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_scarecrow:{n:'허수아비 주술사',hp:280,spd:85,r:20,atk:1.6,col:'#c8a860',ranged:true,pcol:'#ffb04a',draw:'goblin',sc:1.9,skills:['volley','summon'],summon:'goblin',dmg:28,xp:214,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_mordun:{n:'썩은 수확자 모르둔',hp:1200,spd:95,r:30,atk:1.4,col:'#8a8a5a',undead:true,draw:'skeleton',sc:2.6,skills:['slam','charge','summon'],summon:'ashsoldier',eye:'#c8ff6a',dmg:34,xp:580,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_rowen:{n:'첨탑 근위기사 로웬',hp:420,spd:105,r:22,atk:1.2,col:'#8a94b0',draw:'knight',sc:1.8,skills:['charge','slam'],dmg:28,xp:229,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_isa:{n:'번개 마녀 이자',hp:340,spd:100,r:20,atk:1.5,col:'#e8e080',ranged:true,pcol:'#ffe066',draw:'wraith',sc:1.8,skills:['volley','summon'],summon:'p_storm',dmg:28,xp:229,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_karven:{n:'폭풍 마도사 카르벤',hp:1350,spd:90,r:30,atk:1.5,col:'#6a7ac8',ranged:true,pcol:'#ffe066',draw:'apostle',sc:2.6,skills:['volley','slam','summon'],summon:'p_storm',dmg:34,xp:630,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_sporemom:{n:'포자 어미',hp:420,spd:60,r:26,atk:1.5,col:'#8a6ac0',draw:'slime',sc:2.4,skills:['slam','summon'],summon:'f_slime',dmg:28,xp:220,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_thornhound:{n:'가시 사냥개 왕',hp:320,spd:165,r:22,atk:0.9,col:'#4a5a2a',draw:'wolf',sc:1.8,skills:['charge','summon'],summon:'f_were',eye:'#9aff3a',dmg:28,xp:220,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_gulrak:{n:'뿌리 썩은 왕 굴락',hp:1300,spd:65,r:34,atk:1.6,col:'#5a4a2a',draw:'golem',alt:'ogre',sc:2.6,skills:['slam','summon','charge'],summon:'f_slime',eye:'#c8ff4a',dmg:34,xp:600,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_fenrick:{n:'은달 늑대인간 펜릭',hp:380,spd:170,r:22,atk:0.9,col:'#c8c8d8',draw:'wolf',sc:1.9,skills:['charge','summon'],summon:'f_were',eye:'#c8e8ff',dmg:28,xp:235,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_sylva:{n:'저주의 숲 정령 실바',hp:340,spd:100,r:20,atk:1.6,col:'#6ac0a0',ranged:true,pcol:'#9affd0',draw:'wraith',sc:1.8,skills:['volley','summon'],summon:'f_dryad',dmg:28,xp:235,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_elamur:{n:'달의 고목 엘라무르',hp:1450,spd:60,r:34,atk:1.6,col:'#8aa0c8',ranged:true,pcol:'#c8e0ff',draw:'golem',alt:'ogre',sc:2.7,skills:['volley','slam','summon'],summon:'f_dryad',eye:'#e0f0ff',dmg:34,xp:650,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_nefer:{n:'방부술사 네페르',hp:360,spd:85,r:20,atk:1.6,col:'#c8a868',ranged:true,pcol:'#ffd080',undead:true,draw:'apostle',sc:1.8,skills:['volley','summon'],summon:'d_mummy',dmg:28,xp:238,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_aken:{n:'무덤 수문장 아켄',hp:460,spd:95,r:22,atk:1.3,col:'#b09060',undead:true,draw:'knight',sc:1.9,skills:['slam','charge'],dmg:28,xp:238,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_setra:{n:'모래 왕 세트라',hp:1450,spd:85,r:32,atk:1.5,col:'#d8b070',undead:true,ranged:true,pcol:'#ffd080',draw:'skeleton',sc:2.6,skills:['volley','slam','summon'],summon:'d_mummy',eye:'#ffd040',dmg:34,xp:660,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_stinger:{n:'독침 경비병',hp:440,spd:140,r:22,atk:1,col:'#c0502a',draw:'scorpion',alt:'wolf',sc:1.8,skills:['charge'],dmg:28,xp:253,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_drun:{n:'모래 벌레 드룬',hp:520,spd:120,r:26,atk:1.3,col:'#c09060',draw:'serpent',alt:'wolf',sc:2.2,skills:['charge','slam'],dmg:28,xp:253,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_krisha:{n:'둥지 어미 크리샤',hp:1600,spd:110,r:32,atk:1.2,col:'#a03a22',ranged:true,pcol:'#9aff3a',draw:'scorpion',alt:'wolf',sc:2.8,skills:['charge','volley','summon'],summon:'d_scorp',dmg:34,xp:710,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_frostfang:{n:'서리송곳니',hp:380,spd:170,r:22,atk:0.9,col:'#dfe8f0',draw:'wolf',sc:1.9,skills:['charge','summon'],summon:'i_yeti',eye:'#8ae8ff',dmg:28,xp:250,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_svea:{n:'얼음 마녀 스베아',hp:360,spd:100,r:20,atk:1.6,col:'#9fd0ff',ranged:true,pcol:'#cff4ff',draw:'wraith',sc:1.8,skills:['volley','summon'],summon:'i_elem',dmg:28,xp:250,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_glacius:{n:'빙하 거인 글라키우스',hp:1600,spd:85,r:34,atk:1.5,col:'#c8e0f8',draw:'yeti',alt:'ogre',sc:2.7,skills:['slam','charge','summon'],summon:'i_elem',dmg:34,xp:700,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_hagen:{n:'서리 전령 하겐',hp:480,spd:110,r:22,atk:1.2,col:'#9ab0c8',undead:true,draw:'knight',sc:1.9,skills:['charge','slam'],eye:'#8ae8ff',dmg:28,xp:265,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_ulva:{n:'서리 예언자 울바',hp:400,spd:90,r:20,atk:1.6,col:'#bfe0ff',ranged:true,pcol:'#cff4ff',undead:true,draw:'apostle',sc:1.8,skills:['volley','summon'],summon:'i_wraith',dmg:28,xp:265,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_harald:{n:'얼어붙은 왕 하랄드',hp:1750,spd:95,r:32,atk:1.4,col:'#a8c8e8',undead:true,ranged:true,pcol:'#cff4ff',draw:'knight',sc:2.6,skills:['slam','charge','volley','summon'],summon:'i_knight',eye:'#8ae8ff',dmg:34,xp:750,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_kuru:{n:'도마뱀 족장 쿠루',hp:420,spd:105,r:20,atk:1.5,col:'#3a8a4a',ranged:true,pcol:'#7aff6a',draw:'goblin',sc:2,skills:['volley','summon'],summon:'j_lizard',dmg:28,xp:262,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_vinestone:{n:'덩굴 감긴 석상',hp:560,spd:60,r:26,atk:1.6,col:'#6a7a4a',draw:'golem',alt:'ogre',sc:2,skills:['slam'],eye:'#7aff6a',dmg:28,xp:262,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_itzma:{n:'뱀 대사제 이츠마',hp:1700,spd:110,r:30,atk:1.4,col:'#2a7a5a',ranged:true,pcol:'#9aff3a',draw:'serpent',alt:'wraith',sc:2.6,skills:['volley','charge','summon'],summon:'j_viper',eye:'#ffe04a',dmg:34,xp:740,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_rasha:{n:'밤사냥꾼 라샤',hp:440,spd:195,r:22,atk:0.85,col:'#2a2a3a',draw:'panther',alt:'wolf',sc:1.8,skills:['charge'],eye:'#c05aff',dmg:28,xp:277,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_oko:{n:'독안개 무당 오코',hp:420,spd:95,r:20,atk:1.6,col:'#6a8a3a',ranged:true,pcol:'#c05aff',draw:'goblin',sc:2,skills:['volley','summon'],summon:'j_lizard',dmg:28,xp:277,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_umu:{n:'구덩이의 신 우무',hp:1850,spd:60,r:36,atk:1.6,col:'#4a4a3a',draw:'golem',alt:'ogre',sc:2.8,skills:['slam','charge','summon'],summon:'j_golem',eye:'#c05aff',dmg:34,xp:790,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_durg:{n:'대장장이 두르그',hp:560,spd:80,r:26,atk:1.5,col:'#6a4a3a',draw:'ogre',sc:2,skills:['slam','charge'],dmg:28,xp:280,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_slag:{n:'쇳물 짐승',hp:500,spd:70,r:26,atk:1.5,col:'#ff7a2a',draw:'slime',sc:2.4,skills:['slam','summon'],summon:'l_imp',dmg:28,xp:280,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_bargum:{n:'대장간 군주 바르굼',hp:1900,spd:70,r:36,atk:1.6,col:'#5a3a2a',ranged:true,pcol:'#ffb03a',draw:'golem',alt:'ogre',sc:2.7,skills:['slam','charge','volley','summon'],summon:'l_golem',eye:'#ffb03a',dmg:34,xp:800,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_igna:{n:'불꽃 파수꾼 이그나',hp:460,spd:105,r:22,atk:1.5,col:'#ff8a3a',ranged:true,pcol:'#ffb04a',draw:'elemental',alt:'wraith',sc:1.9,skills:['volley','summon'],summon:'l_elem',dmg:28,xp:295,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_rokan:{n:'잿불 기사단장 로칸',hp:560,spd:110,r:22,atk:1.2,col:'#8a3a2a',undead:true,draw:'knight',sc:1.9,skills:['charge','slam'],eye:'#ff4a1a',dmg:28,xp:295,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_sarakus:{n:'용암 비룡 사라쿠스',hp:2050,spd:120,r:34,atk:1.4,col:'#c04a1a',ranged:true,pcol:'#ff8a2a',draw:'serpent',alt:'wolf',sc:3,skills:['volley','charge','summon'],summon:'l_elem',eye:'#ffe04a',dmg:34,xp:850,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_morten:{n:'유령 선장 모르텐',hp:500,spd:110,r:22,atk:1.2,col:'#7ab0a8',undead:true,draw:'skeleton',sc:1.9,skills:['charge','summon'],summon:'s_drown',dmg:28,xp:298,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_bosun:{n:'물에 잠긴 갑판장',hp:600,spd:75,r:26,atk:1.5,col:'#5a7a6a',undead:true,draw:'ogre',sc:2,skills:['slam'],dmg:28,xp:298,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_kragul:{n:'심해 촉수 크라굴',hp:2100,spd:80,r:38,atk:1.5,col:'#3a5a7a',ranged:true,pcol:'#9affff',draw:'slime',sc:3,skills:['slam','volley','summon'],summon:'s_crab',dmg:34,xp:860,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_isra:{n:'조수 여사제 이스라',hp:460,spd:100,r:20,atk:1.6,col:'#5ae0d0',ranged:true,pcol:'#9affff',draw:'wraith',sc:1.9,skills:['volley','summon'],summon:'s_siren',dmg:28,xp:310,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_teslon:{n:'산호 기사 테슬론',hp:600,spd:105,r:22,atk:1.2,col:'#e06a5a',draw:'knight',sc:1.9,skills:['charge','slam'],dmg:28,xp:310,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_oseros:{n:'조수의 왕 오세로스',hp:2200,spd:95,r:32,atk:1.4,col:'#2a7ab0',ranged:true,pcol:'#9affff',draw:'apostle',sc:2.7,skills:['volley','slam','charge','summon'],summon:'s_siren',dmg:34,xp:900,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_bran:{n:'무덤 영주 브란',hp:400,spd:90,r:22,atk:1.3,col:'#a8a090',undead:true,draw:'skeleton',sc:1.9,skills:['slam','summon'],summon:'h_cairn',dmg:28,xp:229,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_crowmother:{n:'까마귀 어미',hp:320,spd:130,r:20,atk:1.4,col:'#2a2a32',ranged:true,pcol:'#8a6ac0',draw:'imp',alt:'goblin',sc:1.9,skills:['volley','summon'],summon:'h_hound',dmg:28,xp:229,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_morwen:{n:'안개 왕비 모르웬',hp:1350,spd:95,r:30,atk:1.5,col:'#c8b0f0',ranged:true,pcol:'#e0c8ff',undead:true,draw:'wraith',sc:2.7,skills:['volley','slam','summon'],summon:'h_keen',dmg:34,xp:630,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_gur:{n:'트롤 족장 구르',hp:520,spd:80,r:26,atk:1.5,col:'#5a6a4a',draw:'ogre',sc:2,skills:['slam','charge'],dmg:28,xp:244,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_grizel:{n:'늪 노파 그리젤',hp:360,spd:85,r:20,atk:1.6,col:'#7a8a5a',ranged:true,pcol:'#9aff8a',draw:'goblin',sc:2,skills:['volley','summon'],summon:'h_hound',dmg:28,xp:244,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_kaila:{n:'돌원의 마녀 카일라',hp:1500,spd:90,r:30,atk:1.5,col:'#6a8a6a',ranged:true,pcol:'#9aff8a',draw:'apostle',sc:2.6,skills:['volley','slam','summon'],summon:'h_troll',dmg:34,xp:680,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_volk:{n:'광산 감독 볼크',hp:520,spd:85,r:26,atk:1.5,col:'#7a6a5a',draw:'ogre',sc:2,skills:['slam','charge'],dmg:28,xp:244,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_shaftghost:{n:'갱도 망령',hp:360,spd:110,r:20,atk:1.6,col:'#c8d0e0',ranged:true,pcol:'#e8f0ff',undead:true,draw:'wraith',sc:1.8,skills:['volley','summon'],summon:'k_rogue',dmg:28,xp:244,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_grak:{n:'깊은 굴 벌레 그라크',hp:1600,spd:105,r:34,atk:1.4,col:'#8a7a6a',draw:'serpent',alt:'wolf',sc:2.8,skills:['charge','slam','summon'],summon:'k_bear',eye:'#ffd080',dmg:34,xp:680,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_tarkun:{n:'바람 무당 타르쿤',hp:400,spd:95,r:20,atk:1.6,col:'#9ab0c8',ranged:true,pcol:'#e8f0ff',draw:'goblin',sc:2,skills:['volley','summon'],summon:'k_shaman',dmg:28,xp:259,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_org:{n:'변절 족장 오르그',hp:540,spd:110,r:22,atk:1.2,col:'#6a5a4a',draw:'knight',sc:1.9,skills:['charge','slam'],dmg:28,xp:259,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_seles:{n:'하피 여왕 셀레스',hp:1650,spd:140,r:30,atk:1.3,col:'#d8c8a8',ranged:true,pcol:'#e8f0ff',draw:'imp',alt:'goblin',sc:2.6,skills:['volley','charge','summon'],summon:'k_harpy',dmg:34,xp:730,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_keymaster:{n:'열쇠지기 인형',hp:560,spd:70,r:26,atk:1.6,col:'#b0946a',draw:'golem',alt:'ogre',sc:2,skills:['slam'],eye:'#7affff',dmg:28,xp:256,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_sarkan:{n:'도적왕 사르칸',hp:460,spd:130,r:22,atk:1,col:'#8a4a2a',draw:'knight',sc:1.9,skills:['charge','summon'],summon:'c_bandit',dmg:28,xp:256,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_titanguard:{n:'보물고 수호 거상',hp:1800,spd:65,r:38,atk:1.7,col:'#c0a070',ranged:true,pcol:'#7affff',draw:'golem',alt:'ogre',sc:3,skills:['slam','charge','volley'],eye:'#7affff',dmg:34,xp:720,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_steamhammer:{n:'증기 망치 인형',hp:580,spd:80,r:26,atk:1.5,col:'#9a8a7a',draw:'golem',alt:'ogre',sc:2.1,skills:['slam','charge'],eye:'#ffb060',dmg:28,xp:271,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_sahab:{n:'먼지 군주 사하브',hp:440,spd:115,r:22,atk:1.6,col:'#d8b088',ranged:true,pcol:'#e8c8a0',draw:'elemental',alt:'wraith',sc:2,skills:['volley','summon'],summon:'c_dust',dmg:28,xp:271,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_orde:{n:'만든 이의 망령 오르데',hp:1900,spd:90,r:30,atk:1.5,col:'#c8a878',ranged:true,pcol:'#7affff',undead:true,draw:'apostle',sc:2.7,skills:['volley','slam','summon'],summon:'c_automaton',dmg:34,xp:770,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_holn:{n:'미친 등대지기 홀른',hp:440,spd:95,r:20,atk:1.6,col:'#8a8a6a',ranged:true,pcol:'#ffe066',draw:'apostle',sc:1.8,skills:['volley','summon'],summon:'t_cultist',dmg:28,xp:274,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_gale:{n:'돌풍 하피',hp:420,spd:160,r:20,atk:1.1,col:'#7a8ac8',draw:'imp',alt:'goblin',sc:1.9,skills:['charge','summon'],summon:'t_harpy',dmg:28,xp:274,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_serak:{n:'폭풍 전령 세라크',hp:1900,spd:110,r:32,atk:1.3,col:'#5a6ab0',ranged:true,pcol:'#ffe066',draw:'knight',sc:2.6,skills:['charge','volley','slam','summon'],summon:'t_cultist',eye:'#ffe066',dmg:34,xp:780,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_broodguard:{n:'둥지 파수 비룡',hp:560,spd:140,r:24,atk:1.2,col:'#4a6a9a',draw:'serpent',alt:'wolf',sc:2,skills:['charge'],dmg:28,xp:289,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_thunderstone:{n:'천둥 바위 거인',hp:640,spd:62,r:28,atk:1.6,col:'#8a94a8',draw:'golem',alt:'ogre',sc:2.1,skills:['slam'],eye:'#ffe066',dmg:28,xp:289,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_astrak:{n:'하늘 비룡 아스트락',hp:2050,spd:130,r:34,atk:1.3,col:'#5a7ab0',ranged:true,pcol:'#ffe066',draw:'serpent',alt:'wolf',sc:3,skills:['charge','volley','summon'],summon:'t_drake',eye:'#ffe066',dmg:34,xp:830,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_erebo:{n:'공허 기사단장 에레보',hp:600,spd:110,r:22,atk:1.2,col:'#3a2a4a',undead:true,draw:'knight',sc:1.9,skills:['charge','slam'],eye:'#c88aff',dmg:28,xp:304,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_weaver:{n:'그림자 직조자',hp:480,spd:100,r:20,atk:1.6,col:'#4a3a6a',ranged:true,pcol:'#b07aff',undead:true,draw:'wraith',sc:1.9,skills:['volley','summon'],summon:'v_shade',dmg:28,xp:304,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_azar:{n:'텅 빈 왕 아자르',hp:2200,spd:95,r:32,atk:1.4,col:'#2a1a3a',undead:true,ranged:true,pcol:'#b07aff',draw:'knight',sc:2.7,skills:['slam','charge','volley','summon'],summon:'v_knight',eye:'#c88aff',dmg:34,xp:880,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_riftmother:{n:'균열의 대모',hp:500,spd:95,r:22,atk:1.6,col:'#6a3a8a',ranged:true,pcol:'#d8a0ff',draw:'apostle',sc:2,skills:['volley','summon'],summon:'v_seer',dmg:28,xp:310,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_voidmaw:{n:'공허의 아가리',hp:680,spd:70,r:30,atk:1.5,col:'#1a0a2a',draw:'slime',sc:2.6,skills:['slam','summon'],summon:'v_maw',dmg:28,xp:310,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_elgaros:{n:'문 너머의 군주 엘가로스',hp:2600,spd:100,r:36,atk:1.4,col:'#3a1a5a',ranged:true,pcol:'#e0b0ff',draw:'apostle',sc:3,skills:['volley','slam','charge','summon'],summon:'v_shade',aura:'rgba(200,120,255,.4)',dmg:34,xp:900,aggro:540,boss:1}
};
// 5) 지역 던전 24곳: dg.js DUNGEONS 와 같은 모양 + reg(어느 지역) + at(near=마을 쪽 얕은 던전, deep=둥지 맞은편 깊은 던전) + loot(보스 전리품 성향)
//    x,y 는 그 지역 땅(6000×6000) 기준. 마을에서 900 이상, 둥지에서 900 이상, 포탈에서 700 이상 떨어지게 계산함
const WX_DUNGEONS=[
  {id:'pl_cellar',reg:'plains',at:'near',n:'풍차 아래 곡물굴',x:2300,y:4300,lvl:28,floor:[70,58,40],wall:['#6a5434','#3e301e','#806a46'],torch:'#ffc060',mobs:['p_wolf','p_raider','goblin'],minis:['m_quik','m_scarecrow'],boss:'b_mordun',loot:'이동 속도·생명력 흡수·생명력'},
  {id:'pl_spire',reg:'plains',at:'deep',n:'폭풍 첨탑',x:4750,y:1650,lvl:33,floor:[50,56,70],wall:['#4a5468','#262c3a','#64708a'],torch:'#ffe066',mobs:['p_storm','p_raider','p_ogre'],minis:['m_rowen','m_isa'],boss:'b_karven',loot:'폭풍 원소·재사용 대기 감소'},
  {id:'fo_hollow',reg:'forest',at:'near',n:'썩은 뿌리 굴',x:3700,y:1700,lvl:30,floor:[44,52,34],wall:['#3e4a2a','#1e2614','#566a3a'],torch:'#9aff6a',mobs:['f_slime','f_were','slime'],minis:['m_sporemom','m_thornhound'],boss:'b_gulrak',loot:'대지·생명력·피해 감소'},
  {id:'fo_grove',reg:'forest',at:'deep',n:'달그림자 성역',x:1250,y:4350,lvl:35,floor:[40,48,56],wall:['#3a4a52','#1a2228','#52687a'],torch:'#c8d8ff',mobs:['f_dryad','f_were','f_golem'],minis:['m_fenrick','m_sylva'],boss:'b_elamur',loot:'냉기·마나·치유'},
  {id:'de_tomb',reg:'desert',at:'near',n:'모래 왕의 무덤',x:1700,y:2300,lvl:36,floor:[96,76,50],wall:['#8a6a42','#4a3420','#a8865a'],torch:'#ffb060',mobs:['d_mummy','d_scorp','ashsoldier'],minis:['m_nefer','m_aken'],boss:'b_setra',loot:'신성·마나·치명타'},
  {id:'de_hive',reg:'desert',at:'deep',n:'붉은 둥지',x:4350,y:4750,lvl:41,floor:[90,50,36],wall:['#7a3a22','#3a1a10','#9a5236'],torch:'#ff7a3a',mobs:['d_scorp','d_viper','d_sand'],minis:['m_stinger','m_drun'],boss:'b_krisha',loot:'대지·치명타·생명력 흡수'},
  {id:'ic_cave',reg:'ice',at:'near',n:'울부짖는 얼음굴',x:4300,y:3700,lvl:40,floor:[70,84,100],wall:['#7a90a8','#3a4a5a','#a0b8d0'],torch:'#9fe0ff',mobs:['i_yeti','i_wraith','i_elem'],minis:['m_frostfang','m_svea'],boss:'b_glacius',loot:'냉기·피해 감소'},
  {id:'ic_hall',reg:'ice',at:'deep',n:'서리 왕의 전당',x:1650,y:1250,lvl:45,floor:[60,70,88],wall:['#5a6a88','#2a3448','#7a8ca8'],torch:'#8ae8ff',mobs:['i_knight','i_wraith','i_elem'],minis:['m_hagen','m_ulva'],boss:'b_harald',loot:'냉기·마나·스킬 레벨(드묾)'},
  {id:'ju_temple',reg:'jungle',at:'near',n:'덩굴 삼킨 신전',x:2300,y:4300,lvl:44,floor:[56,66,46],wall:['#5a6a4a','#2a3420','#7a8a62'],torch:'#7aff6a',mobs:['j_lizard','j_viper','j_golem'],minis:['m_kuru','m_vinestone'],boss:'b_itzma',loot:'대지·생명력·마나 회복'},
  {id:'ju_pit',reg:'jungle',at:'deep',n:'그림자 구덩이',x:4750,y:1650,lvl:49,floor:[34,40,34],wall:['#3a443a','#141a14','#4e5a4e'],torch:'#c05aff',mobs:['j_panther','j_viper','j_golem'],minis:['m_rasha','m_oko'],boss:'b_umu',loot:'이동 속도·치명타·처치 시 마나'},
  {id:'la_forge',reg:'lava',at:'near',n:'흑요석 대장간',x:4300,y:3700,lvl:50,floor:[58,42,38],wall:['#4a3430','#221614','#6a4a40'],torch:'#ff8a3a',mobs:['l_golem','l_imp','l_knight'],minis:['m_durg','m_slag'],boss:'b_bargum',loot:'화염·피해 감소·생명력'},
  {id:'la_heart',reg:'lava',at:'deep',n:'화산의 심장',x:1650,y:1250,lvl:55,floor:[70,34,24],wall:['#5a2a1a','#2a100a','#7a3a22'],torch:'#ff5a1a',mobs:['l_elem','l_imp','l_knight'],minis:['m_igna','m_rokan'],boss:'b_sarakus',loot:'화염·스킬 레벨(드묾)·생명력'},
  {id:'se_wreck',reg:'sea',at:'near',n:'난파선 무덤',x:1700,y:2300,lvl:56,floor:[60,56,46],wall:['#5a4a36','#2a2218','#76644a'],torch:'#7affd0',mobs:['s_drown','s_crab','s_serp'],minis:['m_morten','m_bosun'],boss:'b_kragul',loot:'냉기·생명력 흡수·마나'},
  {id:'se_palace',reg:'sea',at:'deep',n:'가라앉은 궁전',x:4350,y:4750,lvl:60,floor:[40,64,74],wall:['#3a6a7a','#16303a','#5a8a9a'],torch:'#9affff',mobs:['s_siren','s_serp','s_drown'],minis:['m_isra','m_teslon'],boss:'b_oseros',loot:'냉기·마나·재사용 대기 감소'},
  {id:'mo_barrow',reg:'moor',at:'near',n:'선돌 아래 무덤',x:1700,y:2300,lvl:33,floor:[56,52,58],wall:['#5a5462','#2a2630','#746e7e'],torch:'#c88aff',mobs:['h_cairn','h_keen','h_hound'],minis:['m_bran','m_crowmother'],boss:'b_morwen',loot:'신성·마나·마나 회복'},
  {id:'mo_circle',reg:'moor',at:'deep',n:'마녀의 돌원',x:4350,y:4750,lvl:38,floor:[48,54,44],wall:['#545e48','#262c20','#6e7a60'],torch:'#9aff8a',mobs:['h_troll','h_keen','h_hound'],minis:['m_gur','m_grizel'],boss:'b_kaila',loot:'대지·마나 소모 감소·피해 감소'},
  {id:'hi_mine',reg:'highland',at:'near',n:'버려진 은광',x:4300,y:3700,lvl:38,floor:[62,60,58],wall:['#5e5a56','#2c2a28','#7a7672'],torch:'#ffd080',mobs:['k_rogue','k_bear','ashsoldier'],minis:['m_volk','m_shaftghost'],boss:'b_grak',loot:'피해 감소·생명력·치명타'},
  {id:'hi_eyrie',reg:'highland',at:'deep',n:'하피 둥지 봉우리',x:1650,y:1250,lvl:43,floor:[78,80,84],wall:['#6a6e76','#33363c','#8a8e98'],torch:'#e8f0ff',mobs:['k_harpy','k_shaman','k_rogue'],minis:['m_tarkun','m_org'],boss:'b_seles',loot:'폭풍·이동 속도·재사용 대기 감소'},
  {id:'ca_vault',reg:'canyon',at:'near',n:'거인의 보물고',x:4300,y:3700,lvl:42,floor:[84,70,56],wall:['#7a6450','#3a2e24','#967c64'],torch:'#7affff',mobs:['c_automaton','c_dust','c_bandit'],minis:['m_keymaster','m_sarkan'],boss:'b_titanguard',loot:'대지·피해 감소·마나 소모 감소'},
  {id:'ca_foundry',reg:'canyon',at:'deep',n:'잊힌 거인 공방',x:1650,y:1250,lvl:47,floor:[70,58,50],wall:['#6a5446','#30241c','#86705e'],torch:'#ffb060',mobs:['c_automaton','c_scorp','c_dust'],minis:['m_steamhammer','m_sahab'],boss:'b_orde',loot:'대지·스킬 레벨(드묾)·재사용 대기 감소'},
  {id:'cl_lighthouse',reg:'cliffs',at:'near',n:'꺼진 등대',x:2300,y:4300,lvl:48,floor:[60,62,70],wall:['#5a5e6a','#262830','#767a88'],torch:'#ffe066',mobs:['t_cultist','t_harpy','s_drown'],minis:['m_holn','m_gale'],boss:'b_serak',loot:'폭풍·마나·마나 회복'},
  {id:'cl_nest',reg:'cliffs',at:'deep',n:'비룡 둥지',x:4750,y:1650,lvl:53,floor:[72,66,60],wall:['#6a5e54','#302822','#867a6e'],torch:'#ffd080',mobs:['t_drake','t_sentinel','t_harpy'],minis:['m_broodguard','m_thunderstone'],boss:'b_astrak',loot:'폭풍·이동 속도·치명타'},
  {id:'ab_rift',reg:'abyss',at:'near',n:'균열 아래 회랑',x:1700,y:2300,lvl:58,floor:[44,36,56],wall:['#3e3250','#1a1424','#56486c'],torch:'#b07aff',mobs:['v_shade','v_maw','v_knight'],minis:['m_erebo','m_weaver'],boss:'b_azar',loot:'모든 원소·생명력·마나'},
  {id:'ab_throne',reg:'abyss',at:'deep',n:'공허의 옥좌',x:4350,y:4750,lvl:60,floor:[36,28,48],wall:['#34284a','#120c1c','#4c3c66'],torch:'#d8a0ff',mobs:['v_seer','v_knight','v_maw','v_shade'],minis:['m_riftmother','m_voidmaw'],boss:'b_elgaros',loot:'2막 마지막 보상·스킬 레벨(드묾)'}
];
// 6) 기존 지역 들판 몬스터 데미지 조정안 (같은 기준을 넘는 것만). 사용자 결정에 따라 적용
const WX_RETUNE={f_were:15,f_dryad:18,d_scorp:18,d_mummy:20,d_sand:19,d_viper:21,i_yeti:25,i_wraith:19,i_elem:19,i_knight:22,j_lizard:20,j_panther:17,j_viper:22,j_golem:28,l_imp:21,l_golem:28,l_elem:21,l_knight:24,s_crab:24,s_drown:24,s_serp:24,s_siren:23};
