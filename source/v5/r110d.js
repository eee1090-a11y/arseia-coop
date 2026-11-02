/* ---------- v51 110레벨 이후 새 땅 (자료) · 사용자 2026-11-02 ----------
   「110이 넘어가니까 그냥 지루하게 사냥하고 던전깨고 퀘스트깨고 하는 것밖에 없어. 맵도 다 비슷비슷하고.
    각 국가들의 자연환경들 중 유명한 것들에서 영감을 얻어서 새로운 컨셉의 맵 … 바이칼호수와 알혼섬 · 성바실리성당 · 카즈베기 · 아마존 같은 정글 · 오로라가 피는 북극.
    성당같은 건축물은 옹기여신의 신전처럼 하나의 큰 던전 … 기존의 던전맵보다는 성당의 탁트인 내부가 좀 더 잘 구현된 쪽」
   · 이 파일은 자료만. 움직임 · 그림 · 지역 놀이(낚시 · 얇은 얼음 · 정상 오르기 · 뗏목 · 밤 · 오로라 · 추위 · 풍경 기록 · 대성당)는 r110.js.
   · 지옥 전용(3차 전직 땅과 같은 봉인 규칙 · world3.js w3BlockReg). 지옥 +40이 붙어 실제 레벨은 괄호 안.
       첨탑 광장(안전 지대 · 마을 · 대성당 입구) ← 천둥 우는 첨봉 동쪽 포탈
       유리얼음 호수 base 70 (110~118) · 구름 첨봉 76 (116~124) · 대강 밀림 82 (122~130) · 오로라 빙관 88 (128~136)
       아홉 첨탑 대성당 던전 95 (135) · 마지막 보스 100 (140)
   · 세계 지도: 광장 [6,2] · 첨봉 [6,1] · 호수 [7,2] · 밀림 [6,3] · 빙관 [7,1]. 지역 번호는 맨 끝에 붙인다(기존 지역 · 같이 하기 번호 그대로).
   · 몬스터 수치는 같은 레벨대 지옥 지역(천둥 · 뿌리 · 일식) 몬스터 것을 빌린다(들판 한 대 피해 상한 그대로). 모양도 기존 그림을 빌리고 이름 · 색만 새로.
   · 저장: 이 파일은 없음. 새 저장 값은 P.r110 하나(r110.js · 없으면 기본값). */
const R110={sq:'r110_square',lake:'r110_lake',peak:'r110_peak',jungle:'r110_jungle',aurora:'r110_aurora',cath:'r110_cathedral',
  ids:['r110_square','r110_lake','r110_peak','r110_jungle','r110_aurora'],fields:['r110_lake','r110_peak','r110_jungle','r110_aurora']};
const R110_TYPES={};
{const T=k=>WX_TYPES[k];
 // mk(새 id, 수치를 빌릴 몬스터, 모양, 덧붙일 것)
 const mk=(id,stat,draw,o)=>{const s=T(stat);R110_TYPES[id]={...s,draw,alt:o.alt||s.alt||'wolf',...o,reg:1}};
 // 유리얼음 호수 (70~) — 천둥 첨봉 수치
 mk('lk1_wolf','th_wyvern','wolf',{n:'은빛 갈기 호수늑대',min:70,col:'#c8d8e8',eye:'#9fe8ff'});
 mk('lk1_mist','th_roc','wraith',{n:'얼음 숨결 혼령',min:71,col:'#a8e0f0',pcol:'#e0fbff',ranged:true});
 mk('lk1_ward','th_monk','knight',{n:'바위섬 무당 파수꾼',min:72,col:'#6a5a4a',eye:'#9fe8ff'});
 mk('lk1_giant','th_cloud','yeti',{n:'유리얼음 거인',min:74,col:'#d8eaf4',eye:'#7ad8ff',alt:'ogre'});
 // 구름 첨봉 (76~) — 첨봉 · 뿌리 수치
 mk('pk1_ram','th_wyvern','ogre',{n:'구름뿔 큰산양',min:76,col:'#b0a48a',eye:'#ffe8a0'});
 mk('pk1_eagle','th_roc','imp',{n:'바람칼 독수리',min:77,col:'#7a6a5a',pcol:'#e8f0ff',ranged:true,alt:'goblin'});
 mk('pk1_monk','rt_pilgrim','skeleton',{n:'돌탑 수도승 망령',min:78,col:'#a8a090',undead:true,eye:'#c8e8ff'});
 mk('pk1_golem','rt_golem','golem',{n:'빙하 거석 골렘',min:80,col:'#9aa8b4',eye:'#bfe8ff',alt:'ogre'});
 // 대강 밀림 (82~) — 뿌리 수치 · 밤에만 나오는 둘
 mk('jg1_snake','rt_beetle','serpent',{n:'흙탕강 큰뱀',min:82,col:'#6a6a3a',eye:'#ffe066'});
 mk('jg1_jaguar','ec_hound','panther',{n:'점박이 밀림 재규어',min:83,col:'#c89a4a',eye:'#9aff6a'});
 mk('jg1_frog','rt_shaman','slime',{n:'독화살 개구리',min:84,col:'#3ac0a0',pcol:'#9aff6a',ranged:true});
 mk('jg1_idol','rt_golem','golem',{n:'덩굴 감긴 황금 석상',min:86,col:'#a88a3a',eye:'#ffe066',alt:'ogre'});
 mk('jg1_firefly','ec_shade','wraith',{n:'반딧불 혼령',min:82,col:'#c8ff6a',pcol:'#f0ffa0',ranged:true,night:1});
 mk('jg1_bat','ec_hound','imp',{n:'밤그늘 박쥐왕',min:84,col:'#3a2a3a',eye:'#ff6a6a',alt:'goblin',night:1});
 // 오로라 빙관 (88~) — 일식 수치
 mk('au1_bear','ec_maw','yeti',{n:'극야 흰곰',min:88,col:'#eef2f6',eye:'#3a3a4a',alt:'ogre'});
 mk('au1_wolf','ec_hound','wolf',{n:'극야 늑대',min:89,col:'#5a6478',eye:'#9affd0'});
 mk('au1_whale','ec_shade','wraith',{n:'얼음 고래 망령',min:90,col:'#7ab8d0',pcol:'#c8fff0',ranged:true,undead:true});
 mk('au1_guard','ec_paladin','knight',{n:'빙관 파수병',min:92,col:'#8a9ab4',eye:'#9affd0',undead:true});
 // 오로라가 필 때만: 싸우지 않는 빛의 정령 (잡으면 오로라 조각)
 mk('au1_spirit','ec_shade','elemental',{n:'오로라 정령',min:88,col:'#7affc8',pcol:'#c8a0ff',eye:'#ffffff',alt:'wraith',ranged:false,aggro:0,dmg:1,xp:300,aur:1});
 // 지역 던전 준보스 · 보스 (일식 · 뿌리 던전 수치)
 const W=k=>WX_TYPES[k];
 Object.assign(R110_TYPES,{
  m_lk1_shaman:{...W('m_har'),n:'얼음 북 무당 아이랑',col:'#8a6a4a',pcol:'#cff4ff',summon:'lk1_mist'},
  m_lk1_pike:{...W('m_icewyrm'),n:'천 년 묵은 얼음 강꼬치',col:'#9ab8c8'},
  b_lk1_seal:{...W('b_eldan'),n:'호수 밑 물범 신령 누르간',col:'#cfe0ec',draw:'yeti',alt:'ogre',summon:'lk1_giant',pcol:'#e8f8ff'},
  m_pk1_herder:{...W('m_kedric'),n:'구름 양치기 바흐탄',col:'#8a6a4a',pcol:'#e8f0ff',summon:'pk1_eagle'},
  m_pk1_cairn:{...W('m_rodstone'),n:'눈사태 돌무덤',col:'#c8ccd4'},
  b_pk1_roc:{...W('b_raigon'),n:'봉우리를 감은 바람뱀 카즈라',col:'#8a94b0',pcol:'#e8f0ff',summon:'pk1_golem'},
  m_jg1_queen:{...W('m_crystalq'),n:'황금 신전 개미여왕',col:'#c8a03a',summon:'jg1_snake'},
  m_jg1_priest:{...W('m_ogma'),n:'비를 부르는 신관 타후',col:'#5a7a3a',pcol:'#9aff6a',summon:'jg1_frog'},
  b_jg1_croc:{...W('b_bardus'),n:'흙탕강의 왕 카이만 우루',col:'#5a6a3a',summon:'jg1_idol'},
  m_au1_keeper:{...W('m_servan'),n:'얼음 고래 무덤지기',col:'#6a8aa0',pcol:'#c8fff0',summon:'au1_whale'},
  m_au1_knight:{...W('m_lore'),n:'극야 기사 시베르',col:'#4a5a74',eye:'#9affd0'},
  b_au1_whale:{...W('b_amas'),n:'하늘을 헤엄치는 고래 오로르',col:'#9affe0',pcol:'#c8a0ff',draw:'serpent',alt:'wolf',summon:'au1_guard',aura:'rgba(120,255,200,.4)'},
  // 아홉 첨탑 대성당: 예배당 여덟의 지기 · 마지막 보스 (그림 · 기믹은 r110.js)
  m_ct_bell:{...W('m_lore'),n:'종지기',col:'#c8a060',eye:'#ffe8a0',draw:'knight'},
  m_ct_glass:{...W('m_servan'),n:'색유리 수녀',col:'#7a5ac0',pcol:'#ffd0f0',draw:'apostle',summon:'ct_choir'},
  b_ct_tsar:{...W('b_amas'),n:'첨탑의 주인 바실리온',hp:4400,col:'#d8a040',pcol:'#ffe8a0',draw:'apostle',alt:'wraith',sc:3.2,summon:'ct_icon',skills:['volley','slam','summon'],aura:'rgba(255,210,120,.45)',ct:1}
 });
 // 대성당 안 몬스터 (일식 수치)
 mk('ct_choir','ec_shade','wraith',{n:'노래하는 성가 망령',min:95,col:'#f0d8a0',pcol:'#ffe8a0',ranged:true,undead:true});
 mk('ct_icon','ec_paladin','knight',{n:'금박 성화 기사',min:95,col:'#d8b050',eye:'#fff0c0'});
 mk('ct_dome','ec_maw','golem',{n:'양파 지붕 석상',min:95,col:'#c85a4a',eye:'#ffe066',alt:'ogre'});
 // 예배당마다 색 (종 · 예배당 지기 이름 · 빛) — 순서 문제는 r110.js
 R110.chap=[['붉은','#e0503a'],['푸른','#3a7ae0'],['초록','#3ab070'],['금빛','#e0b030'],['보랏빛','#9a5ae0'],['흰','#e8e8e8'],['주황','#e8883a'],['하늘빛','#6ad0f0']];
}
Object.assign(TYPES,R110_TYPES);
// 속성: 지역마다 대표 속성이 다르다(신성 몬스터는 두지 않는 규칙). j=1(파수꾼 · 독수리 · 재규어 · 늑대)은 속성 없음
Object.assign(WX21_EL,{lk1_wolf:'ice',lk1_mist:'ice',lk1_giant:'ice',pk1_ram:'storm',pk1_monk:'earth',pk1_golem:'earth',jg1_snake:'earth',jg1_frog:'earth',jg1_idol:'fire',jg1_firefly:'fire',
  au1_bear:'ice',au1_whale:'dark',au1_guard:'dark',au1_spirit:'storm',ct_choir:'dark',ct_icon:'fire',ct_dome:'earth'});
// 지역 던전 넷 + 대성당 (x,y는 지역을 붙일 때 정한다)
const R110_DG=[
  {id:'r110_lkcave',reg:R110.lake,at:'near',n:'얼음 밑 무당 동굴',x:0,y:0,lvl:76,floor:[70,90,108],wall:['#6a8094','#22303e','#9ab4c8'],torch:'#9fe8ff',mobs:['lk1_mist','lk1_ward','lk1_giant'],minis:['m_lk1_shaman','m_lk1_pike'],boss:'b_lk1_seal',loot:'냉기 · 마나 · 피해 감소'},
  {id:'r110_pkcave',reg:R110.peak,at:'near',n:'낙석 협곡 굴',x:0,y:0,lvl:82,floor:[78,74,70],wall:['#6e6a64','#26241f','#9a948a'],torch:'#ffe8a0',mobs:['pk1_ram','pk1_monk','pk1_golem'],minis:['m_pk1_herder','m_pk1_cairn'],boss:'b_pk1_roc',loot:'폭풍 · 대지 · 생명력'},
  {id:'r110_jgtemple',reg:R110.jungle,at:'near',n:'덩굴에 삼켜진 황금 신전',x:0,y:0,lvl:88,floor:[66,70,44],wall:['#6a6a3a','#22281a','#a8984a'],torch:'#ffe066',mobs:['jg1_snake','jg1_frog','jg1_idol'],minis:['m_jg1_queen','m_jg1_priest'],boss:'b_jg1_croc',loot:'대지 · 화염 · 치명타'},
  {id:'r110_aucrypt',reg:R110.aurora,at:'near',n:'얼음 고래의 무덤',x:0,y:0,lvl:94,floor:[64,84,96],wall:['#4a6070','#141e28','#8ab0c0'],torch:'#9affd0',mobs:['au1_bear','au1_whale','au1_guard'],minis:['m_au1_keeper','m_au1_knight'],boss:'b_au1_whale',loot:'어둠 · 냉기 · 스킬 레벨(드묾)'},
  {id:R110.cath,reg:R110.sq,at:'near',n:'아홉 첨탑 대성당',x:3000,y:2300,lvl:95,floor:[92,72,56],wall:['#a85a40','#3a1a14','#e0b080'],torch:'#ffe0a0',mobs:['ct_choir','ct_icon','ct_dome'],minis:['m_ct_bell','m_ct_glass'],boss:'b_ct_tsar',loot:'모든 원소 · 상급 유니크(드묾)',cath:1}
];
WX_DUNGEONS.push(...R110_DG);
// 마을 사람 (지역 놀이를 알려 준다 · 이름은 마을 전체에서 하나뿐)
Object.assign(WX_FOLK,{
 r110_ulgen:{town:'r110_lake_camp',at:[-170,-140],n:'얼음 낚시꾼 울겐',role:'낚시꾼',L:{body:'#5a4a3a',cape:'#8a6a4a',hair:'#2a1a10',hs:0,hat:1,hatC:'#6a5a4a',prop:'staff'},
  lines:['호수 위 동그란 얼음 구멍 곁에서 F를 누르면 낚싯줄을 내려. 찌가 출렁이고 「입질!」이 뜨면 바로 한 번 더 F!','검푸르게 금 간 얼음 위에는 오래 서 있지 마. 쩍 갈라지면 얼음물에 빠져.','호수 가운데 바위섬에는 무당들이 천을 묶는 기둥이 있어. 하루에 한 번 소원을 빌 수 있지.']},
 r110_dato:{town:'r110_peak_camp',at:[-170,-140],n:'산길 안내인 다토',role:'안내인',L:{body:'#4a5a3a',cape:'#7a5a3a',hair:'#3a2a1a',hs:1,hat:1,hatC:'#8a2a2a',prop:'staff'},
  lines:['정상은 북쪽 끝이야. 돌무덤 셋을 지나 꼭대기 깃발에 닿으면 하루에 한 번 등반 보상을 줘.','윗길에서는 바람이 갑자기 옆으로 밀어. 하얀 줄무늬가 보이면 바람이 오는 거야. 머리 위 동그란 그림자는 굴러오는 돌이고!','언덕 위 돌 예배당은 구름보다 높아서, 종을 치면 산의 축복을 받는대.']},
 r110_ikaru:{town:'r110_jungle_camp',at:[-170,-140],n:'뗏목꾼 이카루',role:'뗏목꾼',L:{body:'#6a4a2a',cape:'#3a6a3a',hair:'#1a1008',hs:2,prop:'basket'},
  lines:['강가 나루마다 뗏목이 있어. 나루에서 F를 누르면 강을 따라 다른 나루까지 금방 가.','밤이 되면 숲이 바뀌어. 반딧불 혼령이랑 박쥐왕이 나오고, 낮 짐승은 숨어 버려.','초록 안개 낀 늪은 숨이 막혀. 오래 있지 마.']},
 r110_sanna:{town:'r110_aurora_camp',at:[-170,-140],n:'오로라 지기 산나',role:'별지기',L:{body:'#3a4a6a',cape:'#6ad0b0',hair:'#e8e0d0',hs:3,dress:1,prop:'staff',gem:'#9affd0'},
  lines:['몇 분마다 하늘에 오로라가 피어. 그때만 빛의 정령이 내려오고, 사냥 경험치도 더 많이 나와.','여긴 너무 추워. 모닥불 곁을 벗어나면 몸이 얼어 가니까, 파란 추위 막대가 차기 전에 불 곁에서 녹여.','오로라 정령은 싸우지 않아. 잡으면 오로라 조각이 남는데, 모으면 좋은 걸 줄게.']},
 r110_iliya:{town:'r110_square_camp',at:[-180,150],n:'대성당 문지기 일리야',role:'문지기',L:{body:'#6a2a2a',cape:'#d8a040',hair:'#c8c0b0',hs:1,prop:'staff',gem:'#ffe8a0'},
  lines:['아홉 첨탑 대성당이에요. 가운데 큰 첨탑 홀을 여덟 예배당이 꽃잎처럼 둘러싸고 있지요.','예배당마다 종이 하나씩 있어요. 지키는 것들을 물리치고 여덟 종을 모두 울리면 가운데 홀 색유리가 빛나요.','색유리가 빛난 네 가지 색 순서대로 종을 다시 치면 첨탑의 주인이 홀 가운데로 내려온대요.','순서를 틀리면 종소리가 흩어져요. 크게 다치지는 않으니 다시 해 보세요.']}
});
// 마을 모습(전초 마을 꾸미기)
Object.assign(WX_TWOUT,{
 [R110.lake]:{st:'frost',local:['호숫가 어부','#5a6a7a',3,'얼음이 맑은 날엔 발밑으로 물고기가 지나가는 게 보여.'],props:['nets','barrel','crate','snowpine']},
 [R110.peak]:{st:'storm',local:['양치기','#6a5a3a',3,'구름이 발밑에 깔리는 날이면 정상에서 세상 끝까지 보여.'],props:['haystack','crate','fence','rock']},
 [R110.jungle]:{st:'tamal',local:['강가 상인','#3a6a3a',6,'강은 길이자 시장이야. 뗏목 없이는 아무 데도 못 가.'],props:['bigleaf','boat','nets','kegs']},
 [R110.aurora]:{st:'frostcamp',local:['얼음 집 짓는 이','#4a5a6a',3,'하늘이 초록으로 일렁이면 모두 밖으로 나와. 그건 축제야.'],props:['iceboulder','barrel','crate','snowpine']},
 [R110.sq]:{st:'vigil',local:['순례자','#6a3a2a',2,'첨탑이 아홉 개래. 세어 보면 늘 하나가 모자라.'],props:['banner','crate','kegs','barrel']}
});
// 지역 붙이기 (region.js가 h29Install()을 부를 때 · 옹기여신 뒤)
function r110Install(){const IC=REGIONS.ice.th,JG=REGIONS.jungle.th;
  const reg=(id,o)=>{REGIONS[id]={id,hell:1,zs:300,zcap:8,noLair:1,straight:1,...o}};
  reg(R110.sq,{n:'첨탑 광장',base:70,zcap:1,col:'#ffcf8a',entry:'W',edges:{W:'thunder',N:R110.peak,E:R110.lake,S:R110.jungle},seed:229,royal:0,
    at:[3000,3200],side:{W:{x:1250,y:3200},E:{x:4750,y:3200},N:{x:3000,y:1250},S:{x:3000,y:4750}},
    town:{id:'r110_square_camp',n:'첨탑 광장',area:'대성당 앞 광장',desc:'알록달록한 양파 모양 첨탑 아홉 개가 솟은 대성당 앞 광장. 순례자들이 첨탑을 세며 길을 묻습니다.',roof:['#a83a2a','#2a6a4a','#c88a2a','#2a4a8a']},
    th:{pal:[[150,146,140],[132,128,124]],deep:[120,116,112],liq:{col:[50,80,100],th:9,kind:'water'},grass:60,gm:[1,1,1],flow:0,fcol:['#f4f0e4','#ffd76a'],tile:.25,paint:'snow'},
    mix:[['snowpine',8],['rock',2],['bush',3]],mobs:null,clear:(x,y)=>Math.max(Math.abs(x-3000),Math.abs(y-2900))<1250});
  reg(R110.lake,{n:'유리얼음 호수',base:70,col:'#9fe8ff',entry:'W',edges:{W:R110.sq,N:R110.aurora},seed:233,
    town:{id:'r110_lake_camp',n:'은물결 나루',area:'호숫가 얼음 나루',desc:'세상에서 가장 맑은 얼음 호수 곁의 나루. 발밑 얼음 아래로 물고기 떼가 지나가는 것이 보입니다.',roof:['#3a5a7a','#5a4a3a','#2a4a6a','#4a5a6a']},
    th:{...IC,pal:[[196,206,214],[170,182,194]],deep:[140,156,172],liq:{...IC.liq,th:.93}},
    mix:[['snowpine',16],['iceboulder',12],['rock',8],['frozenbones',2],['icespike',4]],mobs:['lk1_wolf','lk1_mist','lk1_ward','lk1_giant']});
  reg(R110.peak,{n:'구름 첨봉',base:76,col:'#d8e0c8',entry:'S',edges:{S:R110.sq,E:R110.aurora},seed:239,
    town:{id:'r110_peak_camp',n:'구름목 마을',area:'첨봉 아랫마을',desc:'초록 골짜기 끝, 눈 덮인 큰 봉우리를 올려다보는 돌집 마을. 언덕 위 작은 돌 예배당이 구름에 걸려 있습니다.',roof:['#5a4a3a','#6a5a4a','#4a3a2a','#7a6a5a']},
    th:{pal:[[104,124,80],[88,104,70]],deep:[176,184,196],liq:{col:[70,110,140],th:.9,kind:'water'},grass:300,gm:[1.2,1.4,1],flow:1,fcol:['#f4f0e4','#c8a0ff','#ffd76a'],tile:.4,paint:'meadow'},
    mix:[['rock',16],['mossrock',12],['snowpine',10],['windtree',6],['bush',8],['flowers',6]],mobs:['pk1_ram','pk1_eagle','pk1_monk','pk1_golem']});
  reg(R110.jungle,{n:'대강 밀림',base:82,col:'#7ae06a',entry:'N',edges:{N:R110.sq},seed:241,
    town:{id:'r110_jungle_camp',n:'물기둥 수상촌',area:'흙탕 강 나루',desc:'바다처럼 넓은 흙탕 강가, 기둥 위에 지은 집들의 마을. 하루 종일 새소리와 빗소리가 섞여 들립니다.',roof:['#4a5a2a','#6a4a22','#3a5a3a','#5a4a2a']},
    th:{...JG,pal:[[30,70,32],[24,58,28]],liq:{col:[110,90,56],th:.88,kind:'water'}},
    mix:[['jungletree',30],['bigleaf',18],['fern',14],['templestone',4],['mossrock',6]],mobs:['jg1_snake','jg1_jaguar','jg1_frog','jg1_idol']});
  reg(R110.aurora,{n:'오로라 빙관',base:88,col:'#9affd0',entry:'W',edges:{W:R110.peak,S:R110.lake},seed:251,
    town:{id:'r110_aurora_camp',n:'극야 파수막',area:'얼음 바다 끝',desc:'해가 뜨지 않는 얼음 바다 끝의 파수막. 하늘이 초록과 보랏빛으로 일렁이는 날이면 모두가 밖으로 나옵니다.',roof:['#2a3a5a','#3a4a5a','#2a4a4a','#3a3a5a']},
    th:{...IC,pal:[[150,166,186],[128,144,168]],deep:[90,104,132],liq:{...IC.liq,th:.86}},
    mix:[['iceboulder',14],['icespike',12],['snowpine',6],['frozenbones',4]],mobs:['au1_bear','au1_wolf','au1_whale','au1_guard']});
  Object.assign(WX_WPOS,{[R110.sq]:[6,2],[R110.peak]:[6,1],[R110.lake]:[7,2],[R110.jungle]:[6,3],[R110.aurora]:[7,1]});
  REGIONS.thunder.edges.E=R110.sq;
  for(const k in R110_TYPES){const t=R110_TYPES[k];if(!MON[t.draw])t.draw=t.alt||'wolf'}
  // 던전 자리: 마을에서 떨어진 곳 (대성당은 광장 북쪽 대성당 건물 문 · r110.js가 건물을 세운다)
  const at={r110_lkcave:[3730,3110],r110_pkcave:[4300,1900],r110_jgtemple:[1700,4100],r110_aucrypt:[4300,1700]};
  for(const d of R110_DG)if(at[d.id]){d.x=at[d.id][0];d.y=at[d.id][1]}}
{const _h=h29Install;h29Install=function(){const r=_h.apply(this,arguments);r110Install();return r}}
