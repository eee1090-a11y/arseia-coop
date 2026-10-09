/* ==========================================================================
   v21 속성 사냥터 확장 (데이터) · 스레드 「월드 확장」
   몬스터 속성(불↔냉기 · 벼락↔대지 · 신성↔어둠, 정반대 +20% / 같은 속성 −20%)이 생기면서,
   같은 레벨대에서 자기 속성에 불리하지 않은 사냥터를 고를 수 있게 빈 곳을 채운다.
   새 지역 6곳(보통 2 · 지옥 전용 4), 새 몬스터, 던전 6곳, 그리고 기존 몬스터 속성표.
   world3d.js 바로 뒤, region.js 앞에 붙는다(world3d.js 와 같은 방식으로 WX_ 표에 덧붙임). 붙이는 법: INTEGRATION-v21.md
   dmg 는 생성기(tools/gen21.cjs)가 한 대 세기 규칙으로 계산했다(손으로 적은 값 아님).
   ========================================================================== */
// 0) 몬스터 속성표 (TYPES[k].el 로 넣는다). 기존 몬스터 + 이 파일의 새 몬스터. 여기 없는 몬스터는 속성 없음
const WX21_EL={p_storm:'storm',f_golem:'earth',f_dryad:'earth',r_eldrak:'earth',d_sand:'earth',i_yeti:'ice',i_wraith:'ice',i_elem:'ice',i_knight:'ice',r_hrimnir:'ice',j_golem:'earth',l_imp:'fire',l_golem:'fire',l_elem:'fire',l_knight:'fire',r_ifrit:'fire',s_serp:'ice',s_siren:'ice',r_merrow:'ice',k_harpy:'storm',k_shaman:'ice',r_skarn:'storm',c_dust:'earth',c_scorp:'earth',c_automaton:'earth',r_vorn:'earth',t_harpy:'storm',t_drake:'storm',t_cultist:'storm',t_sentinel:'storm',r_volrak:'storm',v_shade:'dark',v_maw:'dark',v_knight:'dark',v_seer:'dark',r_nyxar:'dark',a_hound:'fire',a_brute:'fire',a_cinder:'fire',r_ashcolossus:'fire',z_golem:'fire',z_mage:'fire',lk_toad:'ice',lk_nixie:'ice',lk_elem:'ice',sc_salamander:'fire',sc_imp:'fire',sc_golem:'fire',ss_wolf:'ice',ss_wight:'ice',ss_giant:'ice',th_roc:'storm',th_wyvern:'storm',th_cloud:'storm',rt_beetle:'earth',rt_shaman:'earth',rt_golem:'earth',ec_paladin:'dark',ec_maw:'dark',ec_shade:'dark',r_nellus:'ice',r_bark:'fire',r_nivas:'ice',r_arcus:'storm',r_gorba:'earth',r_noxia:'dark',m_irma:'ice',b_orben:'ice',m_emberhound:'fire',b_igro:'fire',m_har:'ice',m_icewyrm:'ice',b_eldan:'ice',m_kedric:'storm',m_rodstone:'storm',b_raigon:'storm',m_crystalq:'earth',m_ogma:'earth',b_bardus:'earth',m_servan:'dark',m_lore:'dark',b_amas:'dark'};
// 속성 상성: 정반대면 +20%, 같으면 −20%, 나머지는 그대로. 공격 쪽 원소 묶음(바람은 벼락 쪽, 빛은 신성 쪽, 봉인·변성·물리는 속성 없음)
const WX21_OPP={fire:'ice',ice:'fire',storm:'earth',earth:'storm',holy:'dark',dark:'holy'};
const WX21_ATK={fire:'fire',ice:'ice',storm:'storm',wind:'storm',earth:'earth',holy:'holy',light:'holy'};
const WX21_ELN={fire:'불',ice:'냉기',storm:'벼락',earth:'대지',holy:'신성',dark:'어둠'};
const WX21_ELCOL={fire:'#ff7a2e',ice:'#8fd8ff',storm:'#ffe066',earth:'#c9a46a',holy:'#ffe39a',dark:'#b07aff'};
const WX21_AMP=.2;
// 1) 지역 6곳 (region.js 가 REGIONS 맨 끝, 고원·왕도 뒤에 합친다 → 옛 지역 번호는 그대로). hell:1 = 지옥 전용(레벨은 보통 기준, 게임이 +40)
const WX21_REGIONS={
  mistlake:{id:'mistlake',n:'은안개 호수',base:27,col:'#9ad0e8',entry:'E',edges:{E:'forest'},seed:137,town:{id:'mistford',n:'물안개 나루',area:'갈대 나루터',desc:'안개가 걷히지 않는 호숫가 나루. 어부들은 물속에서 들리는 종소리를 믿습니다.',roof:['#3a5a6a','#4a5a5a','#2a4a5a','#5a5a4a']},th:{pal:[[70,96,86],[56,78,72]],deep:[36,52,56],liq:{col:[50,90,110],th:0.66,kind:'water'},grass:340,gm:[1.05,1.15,1.15],flow:1,fcol:['#e0f0ff','#a8c8ff','#ffffff'],tile:0.45,paint:'lush'},mix:[['tree',12],['fern',12],['mossrock',10],['bush',10],['stump',4],['mushroom',4],['oak',6]],mobs:['lk_crab','lk_toad','lk_nixie','lk_elem'],boss:'r_nellus'},
  scorch:{id:'scorch',n:'그을린 언덕',base:33,col:'#ff8a4a',entry:'W',edges:{W:'plains',S:'jungle'},seed:139,town:{id:'charkiln',n:'숯가마 마을',area:'숯가마 언덕',desc:'땅 밑 불길로 숯을 굽는 언덕 마을. 바람이 불면 온 마을에 불티가 날립니다.',roof:['#5a3a2a','#4a3a32','#6a4a3a','#3a2e2a']},th:{pal:[[96,70,52],[78,56,44]],deep:[52,34,28],liq:{col:[220,90,30],th:0.86,kind:'lava'},grass:60,gm:[1.2,0.9,0.7],flow:0,tile:0.2,paint:'lava'},mix:[['lavarock',10],['ashtree',10],['rock',10],['vent',4],['bush',4],['sandrock',6]],mobs:['sc_kobold','sc_salamander','sc_imp','sc_golem'],boss:'r_bark'},
  starsea:{id:'starsea',n:'별이 언 바다',base:60,hell:1,zs:170,zcap:20,col:'#a8d8ff',entry:'N',edges:{N:'plateau'},seed:149,town:{id:'frostlamp',n:'얼음 등대 야영지',area:'얼어붙은 해안',desc:'바다가 별빛째 얼어붙은 해안의 야영지. 얼음 밑에서 별이 깜빡입니다.',roof:['#2a405a','#3a4a5a','#4a4a5a','#2a3a4a']},th:{pal:[[170,184,204],[146,160,184]],deep:[96,110,140],liq:{col:[30,50,90],th:0.78,kind:'ice'},grass:0,flow:0,tile:0.1,paint:'snow'},mix:[['icespike',12],['iceboulder',12],['frozenbones',6],['snowpine',8],['rock',4],['wreck',2]],mobs:['ss_wolf','ss_crab','ss_wight','ss_giant'],boss:'r_nivas'},
  thunder:{id:'thunder',n:'천둥 우는 첨봉',base:70,hell:1,zs:170,zcap:20,col:'#ffe066',entry:'W',edges:{W:'plateau'},seed:151,town:{id:'stormcloister',n:'뇌운 수도원',area:'첨봉 수도원 마당',desc:'번개를 맞으며 수행하는 수도승들의 산꼭대기 수도원. 종 대신 천둥이 시간을 알립니다.',roof:['#3e4a5a','#4a4a5a','#2e3a4a','#5a5a6a']},th:{pal:[[96,100,108],[78,82,92]],deep:[50,54,64],liq:{col:[40,60,100],th:0.84,kind:'water'},grass:120,gm:[0.95,1,1.1],flow:1,fcol:['#ffe066','#e0e8ff'],tile:0.3,paint:'meadow'},mix:[['rock',16],['windtree',10],['mossrock',8],['ruinpillar',6],['iceboulder',4]],mobs:['th_roc','th_monk','th_wyvern','th_cloud'],boss:'r_arcus'},
  roots:{id:'roots',n:'대지의 뿌리',base:80,hell:1,zs:170,zcap:20,col:'#c9a46a',entry:'W',edges:{W:'capital',N:'eclipse'},seed:157,town:{id:'rootwatch',n:'뿌리 파수막',area:'거대 뿌리 아래',desc:'세상을 받치는 거대한 뿌리 아래 파수막. 뿌리가 꿈틀대면 땅이 웁니다.',roof:['#4a3e2a','#3e4a2e','#5a4a32','#3a3a2a']},th:{pal:[[92,80,58],[74,64,48]],deep:[48,40,30],liq:{col:[60,50,40],th:0.86,kind:'water'},grass:200,gm:[1.1,1.05,0.85],flow:1,fcol:['#c8a060','#9aff8a'],tile:0.5,paint:'lush'},mix:[['oak',14],['stump',8],['mossrock',12],['mushroom',8],['rock',8],['templestone',4]],mobs:['rt_beetle','rt_pilgrim','rt_shaman','rt_golem'],boss:'r_gorba'},
  eclipse:{id:'eclipse',n:'빛이 꺼진 성역',base:88,hell:1,zs:170,zcap:12,col:'#9a7aff',entry:'S',edges:{S:'roots'},seed:163,town:{id:'lastvigil',n:'마지막 철야',area:'꺼진 성당 앞뜰',desc:'빛이 꺼진 대성당 앞에서 밤새 기도하는 이들의 천막. 기도가 멎으면 어둠이 한 걸음 다가옵니다.',roof:['#3a2a4a','#2e2a3a','#4a3a5a','#2a2232']},th:{pal:[[58,52,70],[44,40,56]],deep:[24,20,34],liq:{col:[60,30,100],th:0.8,kind:'water'},grass:0,flow:0,tile:0.1,paint:'lava'},mix:[['ruinpillar',12],['templestone',12],['obsidian',8],['bones',6],['ashtree',6]],mobs:['ec_hound','ec_paladin','ec_maw','ec_shade'],boss:'r_noxia'}
};
// 지역 대표 속성 (큰 지도 · 포탈 글자에 표시)
const WX21_REGEL={mistlake:'ice',scorch:'fire',starsea:'ice',thunder:'storm',roots:'earth',eclipse:'dark'};
// (v21 합칠 때) WX_REGIONS 에 넣지 않는다: region.js 가 REGIONS 끝(고원·왕도 뒤)에 WX21_REGIONS 를 따로 합쳐 같이 하기 지역 번호가 그대로다
const WX21_EDGE_ADD={forest:{W:'mistlake'},plains:{E:'scorch'},jungle:{N:'scorch'},plateau:{S:'starsea',E:'thunder'},capital:{E:'roots'}};
for(const id in WX21_EDGE_ADD)WX_EDGE_ADD[id]=Object.assign(WX_EDGE_ADD[id]||{},WX21_EDGE_ADD[id]);
Object.assign(WX_WPOS,{mistlake:[-2,0],scorch:[2,0],starsea:[4,3],thunder:[5,2],roots:[5,1],eclipse:[5,0]});
Object.assign(WX_TWPAL,{mist:{wall:'plaster',wc:'#c8d4d4',timber:'#3a4a4a',base:'#5a6a6a',roof:'thatch',rc:['#4a5a5a','#3e4e52','#5a5e4a'],door:'#2e3a3a',shut:['#3a6a7a','#4a5a3a','#5a4a3a'],trim:'#3a4a4a',moss:1},kiln:{wall:'adobe',wc:'#8a6a52',timber:'#3a2218',base:'#5a3e30',roof:'tile',rc:['#5a3a2a','#4a3a32','#6a4a3a'],door:'#2e1e14',shut:['#7a3a1a','#4a3a2a','#6a5a3a'],trim:'#3a2218',stoneLow:1},frostcamp:{wall:'log',wc:'#7a8494',timber:'#2e3440',base:'#6a7484',roof:'slate',rc:['#2a405a','#3a4a5a','#4a4a5a'],door:'#2a2e3a',shut:['#3a5a7a','#5a6a7a','#2e4a6a'],trim:'#2e3440',snow:1,stoneLow:1},cloister:{wall:'stone',wc:'#8a8c94',timber:'#2e3036',base:'#5a5c64',roof:'slate',rc:['#3e4a5a','#4a4a5a','#2e3a4a'],door:'#2a2a32',shut:['#c8a040','#3a4a6a','#5a5a6a'],trim:'#c8a040'},rootcamp:{wall:'log',wc:'#6a5a40',timber:'#2e2618',base:'#4a4230',roof:'thatch',rc:['#4a3e2a','#3e4a2e','#5a4a32'],door:'#2a2214',shut:['#5a6a3a','#6a4a2a','#4a4a3a'],trim:'#2e2618',moss:1,stoneLow:1},vigil:{wall:'ashlar',wc:'#544a64',timber:null,base:'#2e2a3a',roof:'iron',rc:['#3a2a4a','#2e2a3a','#4a3a5a'],door:'#1e1628',shut:['#6a4a9a','#3a2a5a','#5a4a7a'],trim:'#b07aff',arch:1}});
Object.assign(WX_TWOUT,{mistlake:{st:'mist',local:['나루 어부','#4a6a6a',3,'안개 낀 날 물속에서 종이 울리면 그물을 걷어. 그날은 물이 사람을 데려가.'],props:['nets','barrel','crate','fence']},scorch:{st:'kiln',local:['숯쟁이','#5a3a2a',3,'숯은 불을 가두는 거야. 잘못 가두면 불이 화를 내지.'],props:['lavarock','sacks','cart','barrel']},starsea:{st:'frostcamp',local:['얼음 낚시꾼','#5a6a7a',6,'얼음 밑 별을 낚으면 소원을 들어준대. 아직 아무도 못 낚았지만.'],props:['iceboulder','crate','nets','banner']},thunder:{st:'cloister',local:['수행 수도승','#8a6a4a',0,'번개를 두려워하면 번개가 너를 찾는다. 받아들이면 그냥 지나가지.'],props:['ruinpillar','banner','crate','windtree']},roots:{st:'rootcamp',local:['뿌리 파수꾼','#4a5a3a',3,'뿌리가 움직이면 귀를 땅에 대. 어디로 가는지 알려 줄 거야.'],props:['fern','crate','sacks','mushroom']},eclipse:{st:'vigil',local:['철야 기도자','#4a3a5a',5,'기도를 멈추지 마. 멈추는 순간 그림자가 이름을 불러.'],props:['templestone','banner','ruinpillar','bones']}});
// 2) 새 몬스터: 들판 24 · 우두머리 6 · 던전 준보스 12 · 보스 6. 그림은 기존 16종
const WX21_TYPES={
  lk_crab:{n:'호수 집게',min:27,hp:150,spd:95,r:17,xp:46,aggro:340,atk:1.2,col:'#6a8a8a',draw:'crab',alt:'slime',dmg:19},
  lk_toad:{n:'안개 두꺼비',min:28,hp:210,spd:80,r:19,xp:52,aggro:320,atk:1.3,col:'#5a8a7a',draw:'slime',dmg:19},
  lk_nixie:{n:'물안개 요정',min:30,hp:120,spd:120,r:14,xp:56,aggro:460,atk:1.5,col:'#a8e0f0',ranged:true,pcol:'#cff4ff',draw:'wraith',dmg:18},
  lk_elem:{n:'호수 물 정령',min:32,hp:300,spd:85,r:22,xp:66,aggro:340,atk:1.5,col:'#6ab8e0',draw:'elemental',alt:'wraith',dmg:25},
  sc_kobold:{n:'숯 캐는 코볼트',min:33,hp:200,spd:115,r:15,xp:62,aggro:380,atk:1,col:'#6a4a3a',draw:'goblin',dmg:18},
  sc_salamander:{n:'불도마뱀',min:34,hp:240,spd:150,r:17,xp:68,aggro:400,atk:0.9,col:'#e05a2a',draw:'serpent',alt:'wolf',eye:'#ffe04a',dmg:16},
  sc_imp:{n:'불똥 요정',min:35,hp:150,spd:140,r:13,xp:66,aggro:470,atk:1.4,col:'#ff7a2a',ranged:true,pcol:'#ffb04a',draw:'imp',alt:'goblin',dmg:19},
  sc_golem:{n:'달군 바위 골렘',min:37,hp:420,spd:66,r:23,xp:82,aggro:320,atk:1.6,col:'#7a4a3a',draw:'golem',alt:'ogre',eye:'#ff9a3a',dmg:26},
  ss_wolf:{n:'서리 갈기 늑대',min:60,hp:440,spd:170,r:16,xp:188,aggro:420,atk:0.9,col:'#c8dcf0',draw:'wolf',eye:'#8ae8ff',dmg:17},
  ss_crab:{n:'빙해 껍질 거북',min:62,hp:700,spd:85,r:20,xp:198,aggro:360,atk:1.3,col:'#7a90a8',draw:'crab',alt:'slime',dmg:21},
  ss_wight:{n:'별빛 얼음 망령',min:64,hp:480,spd:110,r:15,xp:206,aggro:480,atk:1.6,col:'#bfe0ff',ranged:true,pcol:'#e8f8ff',undead:true,draw:'wraith',dmg:19},
  ss_giant:{n:'얼음 바다 거인',min:66,hp:940,spd:76,r:24,xp:214,aggro:320,atk:1.5,col:'#dfe8f4',draw:'yeti',alt:'ogre',eye:'#8ae8ff',dmg:26},
  th_roc:{n:'천둥새',min:70,hp:500,spd:150,r:15,xp:226,aggro:480,atk:1.4,col:'#8a8ab0',ranged:true,pcol:'#ffe066',draw:'imp',alt:'goblin',dmg:19},
  th_monk:{n:'첨봉 수도승',min:72,hp:720,spd:110,r:18,xp:234,aggro:380,atk:1.1,col:'#8a6a4a',draw:'knight',dmg:21},
  th_wyvern:{n:'번개 비룡',min:74,hp:760,spd:140,r:20,xp:240,aggro:420,atk:1.2,col:'#4a5a9a',draw:'serpent',alt:'wolf',eye:'#ffe066',dmg:21},
  th_cloud:{n:'뇌운 정령',min:76,hp:1040,spd:70,r:24,xp:250,aggro:330,atk:1.6,col:'#6a7aa0',draw:'elemental',alt:'wraith',eye:'#ffe066',dmg:26},
  rt_beetle:{n:'수정 등딱지 벌레',min:80,hp:800,spd:120,r:19,xp:250,aggro:380,atk:1.1,col:'#8a7a5a',draw:'scorpion',alt:'wolf',eye:'#9affd0',dmg:22},
  rt_pilgrim:{n:'뿌리에 묶인 순례자',min:82,hp:760,spd:95,r:17,xp:256,aggro:380,atk:1.2,col:'#8a8a6a',undead:true,draw:'skeleton',dmg:22},
  rt_shaman:{n:'땅울림 무당',min:84,hp:580,spd:95,r:15,xp:262,aggro:480,atk:1.7,col:'#7a6a3a',ranged:true,pcol:'#c9a46a',draw:'goblin',dmg:20},
  rt_golem:{n:'뿌리 감긴 거상',min:86,hp:1160,spd:62,r:25,xp:272,aggro:320,atk:1.6,col:'#6a5a3a',draw:'golem',alt:'ogre',eye:'#9aff8a',dmg:27},
  ec_hound:{n:'눈먼 사냥개',min:88,hp:600,spd:175,r:16,xp:276,aggro:440,atk:0.85,col:'#4a4450',draw:'wolf',eye:'#e8e0ff',dmg:18},
  ec_paladin:{n:'맹세 잃은 성기사',min:89,hp:860,spd:105,r:19,xp:282,aggro:400,atk:1.2,col:'#3a3448',draw:'knight',eye:'#b07aff',dmg:22},
  ec_maw:{n:'빛 삼키는 아가리',min:91,hp:1180,spd:75,r:23,xp:290,aggro:330,atk:1.5,col:'#1a1428',draw:'slime',dmg:27},
  ec_shade:{n:'빛 먹는 그림자',min:93,hp:620,spd:115,r:15,xp:296,aggro:500,atk:1.6,col:'#3a2a5a',ranged:true,pcol:'#b07aff',draw:'wraith',dmg:20},
  r_nellus:{n:'안개 호수의 주인 넬루스',hp:1050,spd:110,r:28,xp:700,aggro:440,atk:1.3,col:'#5a9ac0',ranged:true,pcol:'#cff4ff',draw:'serpent',alt:'wolf',sc:2,mini:1,skills:['volley','charge','summon'],summon:'lk_toad',aura:'rgba(150,210,255,.3)',dmg:34},
  r_bark:{n:'그을음 아가리 바르크',hp:1200,spd:80,r:30,xp:780,aggro:440,atk:1.5,col:'#6a3a2a',draw:'ogre',sc:2,mini:1,skills:['slam','charge','summon'],summon:'sc_imp',eye:'#ffb03a',aura:'rgba(255,140,60,.3)',dmg:34},
  r_nivas:{n:'별을 얼린 자 니바스',hp:2400,spd:95,r:30,xp:1240,aggro:480,atk:1.4,col:'#cfe8ff',ranged:true,pcol:'#e8f8ff',draw:'elemental',alt:'wraith',sc:2.2,mini:1,skills:['volley','slam','summon'],summon:'ss_wight',aura:'rgba(170,220,255,.34)',dmg:34},
  r_arcus:{n:'천둥 왕관의 아르쿠스',hp:2500,spd:115,r:30,xp:1320,aggro:480,atk:1.3,col:'#ffe066',ranged:true,pcol:'#ffe066',draw:'elemental',alt:'wraith',sc:2.2,mini:1,skills:['volley','charge','summon'],summon:'th_roc',aura:'rgba(255,230,120,.34)',dmg:34},
  r_gorba:{n:'세계뿌리의 심장 고르바',hp:2700,spd:70,r:32,xp:1420,aggro:460,atk:1.6,col:'#6a5a3a',draw:'golem',alt:'ogre',sc:2.3,mini:1,skills:['slam','charge','summon'],summon:'rt_golem',eye:'#9aff8a',aura:'rgba(200,170,110,.34)',dmg:34},
  r_noxia:{n:'일식의 사도 녹시아',hp:2800,spd:100,r:28,xp:1500,aggro:520,atk:1.4,col:'#3a2a5a',ranged:true,pcol:'#b07aff',draw:'apostle',sc:2.3,mini:1,skills:['volley','slam','summon'],summon:'ec_shade',aura:'rgba(170,120,255,.38)',dmg:34},
  m_bellringer:{n:'물에 잠긴 종지기',hp:360,spd:85,r:22,atk:1.4,col:'#7a9a9a',undead:true,draw:'skeleton',sc:1.9,skills:['slam','summon'],summon:'ashsoldier',dmg:28,xp:223,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_irma:{n:'안개 마녀 이르마',hp:300,spd:100,r:20,atk:1.6,col:'#a8d8e8',ranged:true,pcol:'#cff4ff',draw:'wraith',sc:1.8,skills:['volley','summon'],summon:'lk_nixie',dmg:28,xp:223,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_orben:{n:'잠긴 수도원장 오르벤',hp:1300,spd:90,r:30,atk:1.5,col:'#6a8aa0',ranged:true,pcol:'#cff4ff',undead:true,draw:'apostle',sc:2.6,skills:['volley','slam','summon'],summon:'lk_toad',dmg:34,xp:610,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_gor:{n:'숯가마 우두머리 고르',hp:460,spd:85,r:24,atk:1.5,col:'#5a3a2a',draw:'ogre',sc:1.9,skills:['slam','charge'],dmg:28,xp:241,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_emberhound:{n:'불씨 사냥개',hp:340,spd:170,r:20,atk:0.9,col:'#c04a1a',draw:'wolf',sc:1.7,skills:['charge','summon'],summon:'sc_salamander',eye:'#ffe04a',dmg:28,xp:241,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_igro:{n:'숯가마의 심장 이그로',hp:1450,spd:85,r:30,atk:1.5,col:'#ff6a2a',ranged:true,pcol:'#ffb04a',draw:'elemental',alt:'wraith',sc:2.6,skills:['volley','slam','summon'],summon:'sc_imp',dmg:34,xp:670,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_har:{n:'별지기 하르',hp:620,spd:95,r:20,atk:1.6,col:'#bfe0ff',ranged:true,pcol:'#e8f8ff',draw:'apostle',sc:1.9,skills:['volley','summon'],summon:'ss_wight',dmg:28,xp:510,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_icewyrm:{n:'빙해 비룡 새끼',hp:820,spd:130,r:24,atk:1.2,col:'#9fd0f0',draw:'serpent',alt:'wolf',sc:2,skills:['charge'],eye:'#8ae8ff',dmg:28,xp:510,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_eldan:{n:'떨어진 별의 파수꾼 엘단',hp:3000,spd:75,r:36,atk:1.6,col:'#dfe8f8',ranged:true,pcol:'#e8f8ff',draw:'golem',alt:'ogre',sc:2.8,skills:['slam','charge','volley','summon'],summon:'ss_giant',eye:'#8ae8ff',dmg:34,xp:1080,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_kedric:{n:'뇌운 원장 케드릭',hp:640,spd:95,r:20,atk:1.6,col:'#8a7a5a',ranged:true,pcol:'#ffe066',draw:'apostle',sc:1.9,skills:['volley','summon'],summon:'th_monk',dmg:28,xp:540,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_rodstone:{n:'피뢰 석상',hp:940,spd:64,r:26,atk:1.6,col:'#8a94a8',draw:'golem',alt:'ogre',sc:2.1,skills:['slam'],eye:'#ffe066',dmg:28,xp:540,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_raigon:{n:'하늘을 찢는 자 라이곤',hp:3200,spd:125,r:34,atk:1.3,col:'#4a5aa0',ranged:true,pcol:'#ffe066',draw:'serpent',alt:'wolf',sc:3,skills:['charge','volley','summon'],summon:'th_wyvern',eye:'#ffe066',dmg:34,xp:1120,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_crystalq:{n:'수정 여왕벌레',hp:880,spd:120,r:24,atk:1.1,col:'#9a8a6a',draw:'scorpion',alt:'wolf',sc:2,skills:['charge','summon'],summon:'rt_beetle',eye:'#9affd0',dmg:28,xp:570,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_ogma:{n:'뿌리 예언자 오그마',hp:660,spd:90,r:20,atk:1.6,col:'#7a6a3a',ranged:true,pcol:'#c9a46a',draw:'apostle',sc:1.9,skills:['volley','summon'],summon:'rt_shaman',dmg:28,xp:570,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_bardus:{n:'가장 깊은 뿌리 바르두스',hp:3400,spd:90,r:36,atk:1.5,col:'#5a4a2a',draw:'serpent',alt:'wolf',sc:3,skills:['slam','charge','summon'],summon:'rt_golem',eye:'#9aff8a',dmg:34,xp:1160,aggro:540,boss:1,aura:'rgba(255,90,60,.3)'},
  m_servan:{n:'빈 주교 세르반',hp:700,spd:90,r:20,atk:1.6,col:'#4a3a6a',ranged:true,pcol:'#b07aff',draw:'apostle',sc:1.9,skills:['volley','summon'],summon:'ec_shade',dmg:28,xp:588,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  m_lore:{n:'일식 기사 로어',hp:960,spd:105,r:22,atk:1.2,col:'#2a2238',draw:'knight',sc:1.9,skills:['charge','slam'],eye:'#b07aff',dmg:28,xp:588,aggro:460,mini:1,aura:'rgba(255,170,80,.25)'},
  b_amas:{n:'검은 태양 아마스',hp:3600,spd:95,r:34,atk:1.4,col:'#1a1028',ranged:true,pcol:'#c8a0ff',draw:'elemental',alt:'wraith',sc:3,skills:['volley','slam','charge','summon'],summon:'ec_paladin',aura:'rgba(160,110,255,.42)',dmg:34,xp:1184,aggro:540,boss:1}
};
// (v21 합칠 때) 호수 물 정령 r 21→22: 생성기의 「무거움」 역할을 게임의 역할 판정(r≥22)과 맞춤 (dmg 그대로)
Object.assign(WX_TYPES,WX21_TYPES);
// 3) 던전 6곳 (WX_DUNGEONS 에 덧붙인다. 지옥 전용 지역 던전은 lvl 이 보통 기준: 게임이 +40)
const WX21_DUNGEONS=[
  {id:'lk_abbey',reg:'mistlake',at:'near',n:'가라앉은 종탑 수도원',x:3700,y:1700,lvl:31,floor:[52,64,66],wall:['#4a5e62','#1e2c30','#66808a'],torch:'#9fe0ff',mobs:['lk_toad','lk_nixie','ashsoldier'],minis:['m_bellringer','m_irma'],boss:'b_orben',loot:'냉기·마나·마나 회복'},
  {id:'sc_kiln',reg:'scorch',at:'near',n:'꺼지지 않는 숯가마',x:2300,y:4300,lvl:37,floor:[70,48,38],wall:['#5a3a2a','#2a1a12','#7a5240'],torch:'#ff8a3a',mobs:['sc_imp','sc_golem','sc_kobold'],minis:['m_gor','m_emberhound'],boss:'b_igro',loot:'화염·피해 감소·생명력'},
  {id:'ss_grotto',reg:'starsea',at:'near',n:'별이 잠든 빙굴',x:1700,y:2300,lvl:70,floor:[74,86,104],wall:['#8094ac','#3a4a5e','#a8bcd4'],torch:'#cff4ff',mobs:['ss_wight','ss_giant','ss_wolf'],minis:['m_har','m_icewyrm'],boss:'b_eldan',loot:'냉기·피해 감소·마나'},
  {id:'th_bell',reg:'thunder',at:'near',n:'번개 맞은 종루',x:2300,y:4300,lvl:80,floor:[64,66,74],wall:['#5a5e6a','#262830','#767a88'],torch:'#ffe066',mobs:['th_roc','th_monk','th_cloud'],minis:['m_kedric','m_rodstone'],boss:'b_raigon',loot:'폭풍·재사용 대기 감소·치명타'},
  {id:'rt_cavern',reg:'roots',at:'near',n:'수정 뿌리 동굴',x:2300,y:4300,lvl:90,floor:[70,62,48],wall:['#6a5a40','#2e2618','#867258'],torch:'#9affd0',mobs:['rt_beetle','rt_golem','rt_shaman'],minis:['m_crystalq','m_ogma'],boss:'b_bardus',loot:'대지·생명력·피해 감소'},
  {id:'ec_cathedral',reg:'eclipse',at:'near',n:'꺼진 대성당',x:4300,y:3700,lvl:96,floor:[46,40,58],wall:['#40364e','#16121e','#5a4c6c'],torch:'#b07aff',mobs:['ec_paladin','ec_shade','ec_maw'],minis:['m_servan','m_lore'],boss:'b_amas',loot:'신성·마나·스킬 레벨(드묾)'}
];
WX_DUNGEONS.push(...WX21_DUNGEONS);
