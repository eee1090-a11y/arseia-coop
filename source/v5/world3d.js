/* ---------- v20 WORLD: 3차 전직의 땅 (데이터) · 지옥 전용 새 지역 2곳 · 던전 4곳 + 재의 왕좌 · 들판 몬스터 · 3차 전용 상급 유니크 ----------
   설계: rpg/job-advancement-3/3차전직-컨셉.md 6·7절. wx-base.js 바로 뒤, region.js 앞에 붙는다(지역·몬스터를 region.js가 합친다).
   레벨은 다른 지역처럼 「보통」 기준으로 적는다(지옥 +40은 게임이 더한다): 고원 60(→지옥 100~120), 왕도 80(→120~140).
   들판 몬스터 한 대 피해는 같은 레벨 기본 생명력의 17~27%(월드 확장 기준 이하, 100레벨 위로는 비율을 더 올리지 않음). 실행 코드는 world3.js. */
// 1) 지역 두 곳 (REGIONS 끝에 덧붙는다: 옛 12곳의 지역 번호는 그대로). zs = 레벨 1 오르는 거리, zcap = 마을 레벨 위로 최대 몇까지
const W3_REGIONS={
  plateau:{id:'plateau',n:'재가 내리는 고원',base:60,hell:1,zs:170,zcap:20,col:'#f2b48a',entry:'W',edges:{W:'abyss',N:'capital'},seed:127,
    town:{id:'pilgrimtent',n:'순례자의 천막',area:'순례자의 야영지',desc:'재가 눈처럼 내리는 고원 어귀의 작은 야영지. 봉인문을 넘어온 순례자들이 꺼지지 않는 불을 지킵니다.',roof:['#5a4a44','#4a3e3a','#6a5448','#3e3634']},
    th:{pal:[[96,88,84],[78,70,66]],deep:[54,46,44],liq:{col:[214,92,34],th:.83,kind:'lava'},grass:0,flow:0,tile:.1,paint:'lava'},
    mix:[['ashtree',7],['lavarock',10],['obsidian',10],['ruinpillar',5],['bones',5],['vent',2],['rock',8]],
    mobs:['a_hound','a_knight','a_brute','a_cinder'],boss:'r_ashcolossus'},
  capital:{id:'capital',n:'불 꺼진 왕도',base:80,hell:1,zs:170,zcap:20,col:'#e6c87a',entry:'S',edges:{S:'plateau'},seed:131,
    town:{id:'keeperhouse',n:'꺼진 등대지기의 집',area:'왕도 바깥 성벽',desc:'불 꺼진 왕도의 성벽 밖, 옛 등대지기의 집. 성벽 위 등대는 사백 년째 꺼져 있습니다.',roof:['#3e3a4a','#4a4250','#2e2a36','#544a5a']},
    th:{pal:[[74,68,74],[58,54,62]],deep:[36,32,42],liq:{col:[52,40,78],th:.83,kind:'water'},grass:0,flow:0,tile:.12,paint:'lava'},
    mix:[['ruinpillar',14],['templestone',10],['bones',6],['obsidian',6],['ashtree',8],['rock',8],['lavarock',4]],
    mobs:['z_panther','z_guard','z_golem','z_mage'],boss:'r_kingshade'},
};
// 지옥 심연의 균열 동쪽 변 = 봉인문 (wx-world.js의 WX_EDGE_ADD 에 덧붙인다: region.js가 같은 자리에서 합친다)
WX_EDGE_ADD.abyss=Object.assign(WX_EDGE_ADD.abyss||{},{E:'plateau'});
// 세계 지도 자리 · 마을 모습 (wx.js · town.js 가 WX_ 표를 합칠 때 같이 들어간다)
Object.assign(WX_WPOS,{plateau:[4,2],capital:[4,1]});
Object.assign(WX_TWPAL,{
  ashcamp:{wall:'log',wc:'#6a5a50',timber:'#2e2420',base:'#4a4240',roof:'thatch',rc:['#5a4a44','#4a3e3a','#6a5448'],door:'#2e2218',shut:['#6a3a2a','#4a3a3a','#5a4a3a'],trim:'#2e2420',stoneLow:1},
  keeper:{wall:'ashlar',wc:'#6a6474',timber:null,base:'#3e3a46',roof:'slate',rc:['#3e3a4a','#4a4250','#2e2a36'],door:'#2a2232',shut:['#8a6a3a','#3a3a5a','#5a4a3a'],trim:'#c8a050',arch:1}});
Object.assign(WX_TWOUT,{
  plateau:{st:'ashcamp',local:['재 순례자','#6a5a50',5,'재가 내리는 날엔 이름을 크게 부르지 마. 재가 듣는대.'],props:['ruinpillar','crate','banner','obsidian']},
  capital:{st:'keeper',local:['늙은 등대지기','#4a4256',3,'등대에 다시 불이 들어오는 날, 왕도도 잠에서 깰 거라네.'],props:['ruinpillar','barrel','banner','templestone']}});
// 2) 몬스터: 그림(draw)은 이미 있는 16종 · 재와 잿불 색으로 바꿔 구별한다
const W3_TYPES={
  // 재가 내리는 고원 (지옥 100~120)
  a_hound:{n:'잿불 사냥개',min:60,hp:430,dmg:17,spd:165,r:16,xp:186,aggro:420,atk:.9,col:'#5a4a44',draw:'wolf',eye:'#ff8a2a'},
  a_knight:{n:'재 맹세 기사',min:62,hp:660,dmg:21,spd:105,r:19,xp:196,aggro:380,atk:1.2,col:'#6a605a',undead:true,draw:'knight',eye:'#ffb04a'},
  a_brute:{n:'잿더미 거인',min:64,hp:920,dmg:26,spd:74,r:24,xp:212,aggro:320,atk:1.5,col:'#5e5650',draw:'ogre',eye:'#ff7a2a'},
  a_cinder:{n:'불씨 망령',min:66,hp:470,dmg:19,spd:110,r:15,xp:204,aggro:480,atk:1.6,col:'#9a7462',ranged:true,pcol:'#ffa04a',undead:true,draw:'wraith'},
  r_ashcolossus:{n:'재를 두른 거상 그라무스',hp:2300,dmg:34,spd:72,r:30,xp:1200,aggro:460,atk:1.6,col:'#6a625c',draw:'golem',alt:'ogre',sc:2.2,mini:1,skills:['slam','charge','summon'],summon:'a_brute',eye:'#ff8a2a',aura:'rgba(255,150,80,.3)'},
  // 불 꺼진 왕도 (지옥 120~140)
  z_panther:{n:'왕도의 잿빛 표범',min:80,hp:520,dmg:18,spd:185,r:18,xp:246,aggro:440,atk:.85,col:'#4a4450',draw:'panther',alt:'wolf',eye:'#ffcf6a'},
  z_guard:{n:'불 꺼진 근위병',min:82,hp:780,dmg:22,spd:100,r:19,xp:256,aggro:380,atk:1.2,col:'#5a5664',undead:true,draw:'knight',eye:'#ffcf6a'},
  z_golem:{n:'잿불 석상',min:84,hp:1120,dmg:27,spd:66,r:24,xp:270,aggro:320,atk:1.6,col:'#6a6070',draw:'golem',alt:'ogre',eye:'#ffb03a'},
  z_mage:{n:'재가 된 궁정 마법사',min:86,hp:560,dmg:20,spd:95,r:16,xp:262,aggro:500,atk:1.7,col:'#6a5a7a',ranged:true,pcol:'#ffcf6a',undead:true,draw:'apostle'},
  r_kingshade:{n:'왕도의 그림자 기사단장',hp:2600,dmg:34,spd:105,r:30,xp:1400,aggro:480,atk:1.3,col:'#3e3a4a',undead:true,draw:'knight',sc:2.2,mini:1,skills:['charge','slam','summon'],summon:'z_guard',eye:'#ffcf6a',aura:'rgba(255,210,120,.3)'},
  // 던전 준보스 · 보스
  m_w3orden:{n:'봉인 파수 기사 오르덴',hp:760,dmg:28,spd:105,r:22,xp:330,aggro:460,atk:1.2,col:'#7a6a5a',undead:true,draw:'knight',sc:1.9,mini:1,skills:['charge','slam'],eye:'#ffd76a',aura:'rgba(255,170,80,.25)'},
  m_w3sila:{n:'재 맹세 사제 실라',hp:580,dmg:28,spd:95,r:20,xp:330,aggro:460,atk:1.6,col:'#8a6a5a',ranged:true,pcol:'#ffb04a',draw:'apostle',sc:1.9,mini:1,skills:['volley','summon'],summon:'a_cinder',aura:'rgba(255,170,80,.25)'},
  b_w3warden:{n:'봉인 수호자 카델',gshN:'봉인: 봉인석을 부수세요',hp:2800,dmg:34,spd:80,r:34,xp:960,aggro:540,atk:1.6,col:'#7a7068',ranged:true,pcol:'#ffd76a',draw:'golem',alt:'ogre',sc:2.8,boss:1,skills:['slam','charge','volley','summon'],summon:'a_knight',eye:'#ffd76a',aura:'rgba(255,200,110,.32)'},
  m_w3cantor:{n:'잿빛 선창자',hp:620,dmg:28,spd:100,r:20,xp:350,aggro:460,atk:1.6,col:'#a89a90',ranged:true,pcol:'#e8d8c8',undead:true,draw:'wraith',sc:1.9,mini:1,skills:['volley','summon'],summon:'a_cinder',aura:'rgba(255,170,80,.25)'},
  m_w3bram:{n:'종지기 브람',hp:820,dmg:28,spd:80,r:24,xp:350,aggro:460,atk:1.5,col:'#b0a490',undead:true,draw:'skeleton',sc:2.1,mini:1,skills:['slam','charge'],aura:'rgba(255,170,80,.25)'},
  b_w3choir:{n:'잿빛 성가대장 모르디스',hp:3000,dmg:34,spd:90,r:30,xp:1020,aggro:540,atk:1.5,col:'#8a7a70',ranged:true,pcol:'#ffe0b0',undead:true,draw:'apostle',sc:2.7,boss:1,skills:['volley','slam','summon'],summon:'a_cinder',aura:'rgba(255,220,160,.32)',bcN:'「재의 성가」',bcM:2.5},
  m_w3scribe:{n:'불탄 서기관',hp:660,dmg:28,spd:95,r:20,xp:370,aggro:460,atk:1.6,col:'#7a5a4a',ranged:true,pcol:'#ffb04a',draw:'goblin',sc:2,mini:1,skills:['volley','summon'],summon:'z_mage',aura:'rgba(255,170,80,.25)'},
  m_w3doll:{n:'마법원 수호 인형',hp:900,dmg:28,spd:70,r:26,xp:370,aggro:460,atk:1.6,col:'#8a8094',draw:'golem',alt:'ogre',sc:2,mini:1,skills:['slam'],eye:'#9ad8ff',aura:'rgba(255,170,80,.25)'},
  b_w3dean:{n:'마지막 학장 이그나시우스',hp:3200,dmg:34,spd:90,r:30,xp:1080,aggro:540,atk:1.4,col:'#5a4a6a',ranged:true,pcol:'#c8a0ff',draw:'apostle',sc:2.7,boss:1,skills:['volley','slam','summon'],summon:'z_mage',eye:'#c8a0ff',aura:'rgba(200,150,255,.34)'},
  m_w3gate:{n:'납골당 문지기',hp:960,dmg:28,spd:72,r:26,xp:390,aggro:460,atk:1.6,col:'#a49a88',undead:true,draw:'golem',alt:'ogre',sc:2.1,mini:1,skills:['slam','charge'],eye:'#ffcf6a',aura:'rgba(255,170,80,.25)'},
  m_w3widow:{n:'상복 입은 그림자',hp:700,dmg:28,spd:105,r:20,xp:390,aggro:460,atk:1.6,col:'#2e2a36',ranged:true,pcol:'#c8b0e0',undead:true,draw:'wraith',sc:1.9,mini:1,skills:['volley','summon'],summon:'z_guard',aura:'rgba(255,170,80,.25)'},
  b_w3regent:{n:'뼈 왕관의 섭정 바르테인',hp:3400,dmg:34,spd:100,r:32,xp:1150,aggro:540,atk:1.3,col:'#c8bca8',undead:true,draw:'knight',sc:2.8,boss:1,skills:['slam','charge','summon'],summon:'z_guard',eye:'#ffcf6a',aura:'rgba(255,200,120,.34)'},
  // 재의 왕좌: 마지막 협동 보스 · 「이름 부르기」 동안 나오는 그림자
  b_ashlord:{n:'재의 군주',hp:4400,dmg:34,spd:95,r:36,xp:1600,aggro:900,atk:1.4,col:'#3a302c',ranged:true,pcol:'#ff9a4a',draw:'apostle',sc:3.2,boss:1,skills:['slam','volley','charge','summon'],summon:'w3_shade',eye:'#ffb03a',aura:'rgba(255,120,40,.42)'},
  w3_shade:{n:'재의 그림자',hp:380,dmg:20,spd:120,r:15,xp:60,aggro:700,atk:1.4,col:'#4a3e3a',ranged:true,pcol:'#ff9a4a',undead:true,draw:'wraith'},
  w3_sealstone:{n:'봉인석',hp:900,dmg:0,spd:0,r:22,xp:40,aggro:1,atk:99,col:'#8a8070',draw:'golem',alt:'ogre',sc:1.2,eye:'#ffd76a'},
};
const W3_MONV={b_w3warden:'broken',m_w3orden:'broken',b_w3choir:'mitre',m_w3cantor:'halo',b_w3dean:'flamecrown',m_w3scribe:'mitre',b_w3regent:'kingcrown',m_w3gate:'bonearmor',m_w3widow:'weed',b_ashlord:'flamecrown',r_kingshade:'warlord',r_ashcolossus:'moss'};
// 3) 던전 (dg.js DUNGEONS 와 같은 모양 · reg/at/loot은 wx 던전과 같은 뜻). trial = 시험의 방 입구(들어가면 J3Q.enterTrial), arena = 재의 왕좌(정해진 큰 방)
const W3_DUNGEONS=[
  {id:'pt_corridor',reg:'plateau',at:'near',n:'봉인 수호자의 회랑',x:1900,y:3900,lvl:68,floor:[66,58,54],wall:['#5e5450','#2a2422','#786c66'],torch:'#ffb060',mobs:['a_knight','a_cinder','a_hound'],minis:['m_w3orden','m_w3sila'],boss:'b_w3warden',loot:'피해 감소·생명력·재사용 대기 감소'},
  {id:'pt_choir',reg:'plateau',at:'deep',n:'잿빛 성가대의 무덤',x:4750,y:1500,lvl:78,floor:[58,54,52],wall:['#6a625c','#2a2624','#8a8078'],torch:'#ffe0b0',mobs:['a_cinder','a_knight','a_brute'],minis:['m_w3cantor','m_w3bram'],boss:'b_w3choir',loot:'신성·마나·스킬 레벨(드묾)'},
  {id:'pt_trials',reg:'plateau',at:'trial',w3k:'trial',n:'시험의 방',x:1600,y:2250,lvl:60,floor:[60,56,52],wall:['#5a5450','#262220','#76706a'],torch:'#ffd76a',mobs:[],minis:[],boss:null},
  {id:'cp_academy',reg:'capital',at:'near',n:'무너진 왕립 마법원',x:1900,y:4300,lvl:88,floor:[52,48,62],wall:['#544c66','#221e2c','#6e6484'],torch:'#c8a0ff',mobs:['z_mage','z_guard','z_golem'],minis:['m_w3scribe','m_w3doll'],boss:'b_w3dean',loot:'모든 원소·마나·마나 회복'},
  {id:'cp_ossuary',reg:'capital',at:'deep',n:'왕의 지하 납골당',x:1300,y:3100,lvl:96,floor:[56,52,48],wall:['#605848','#26221c','#7c7260'],torch:'#ffcf6a',mobs:['z_guard','z_panther','z_mage'],minis:['m_w3gate','m_w3widow'],boss:'b_w3regent',loot:'생명력 흡수·치명타·피해 감소'},
  {id:'cp_throne',reg:'capital',at:'throne',w3k:'throne',arena:1,n:'재의 왕좌',x:2600,y:900,lvl:98,floor:[48,40,38],wall:['#4a3e3a','#1a1412','#6a5650'],torch:'#ff9a4a',mobs:['w3_shade'],minis:[],boss:'b_ashlord',loot:'3차 전용 상급 유니크'},
];
const w3Caves=id=>W3_DUNGEONS.filter(d=>d.reg===id).map(d=>({x:d.x,y:d.y,k:'cave',cave:d,s:1,v:0,light:120}));
// 4) 재의 군주가 떨어뜨리는 3차 전용 상급 유니크 (직업마다 하나 · 3차 전직을 해야 낄 수 있다)
const W3_UNIQ=[
  {cls:'mage',n:'이름 없는 군주의 홀',slot:'staff',st:{int:2,all:2,el_fire:35,cdr:12,proc_bird:20},lore:'재가 된 이름을 불러도 대답하지 않는 홀.'},
  {cls:'priest',n:'재로 쓴 기도의 지팡이',slot:'staff',st:{int:2,all:2,el_holy:35,regen:1.5,proc_nova:20},lore:'잿가루로 쓴 기도문이 손잡이를 따라 감겨 있다.'},
  {cls:'warrior',n:'왕좌를 지킨 마지막 검',slot:'staff',wt:'sword',st:{atk:2,all:2,pdmg:35,dr:8,ls:4},lore:'군주가 쓰러지던 날까지 왕좌 곁에 꽂혀 있던 검.'},
  {cls:'archer',n:'불 꺼진 등대의 활',slot:'staff',wt:'bow',st:{atk:2,all:2,crit:10,ias:12,proc_chain:20},lore:'등대지기가 마지막 불씨를 활시위에 묶어 두었다.'},
];
Object.assign(IUNQ,{
  '이름 없는 군주의 홀':{mat:'bone',sh:'#3a302c',head:'ember',gem:'#ffb03a',glow:IEL.fire},
  '재로 쓴 기도의 지팡이':{mat:'gold',sh:'#5a4a44',head:'scepter',gem:'#ffe0b0',glow:IEL.holy},
  '왕좌를 지킨 마지막 검':Object.assign({},IW.sword[6],{m:'#4a4044',d:'#ffb03a',gem:'#ff7a2a',glow:IEL.fire,ember:1}),
  '불 꺼진 등대의 활':Object.assign({},IW.bow[6],{m:'#4a4456',gem:'#ffcf6a',glow:'#ffcf6a',ember:1})});
// 5) 지역 · 몬스터를 게임 표에 넣기 (region.js 가 REGIONS 에 W3_REGIONS 를 합친다)
for(const k in W3_TYPES){const t=W3_TYPES[k];if(t.min||k.startsWith('r_'))t.reg=1;if(!MON[t.draw])t.draw=t.alt||'wolf'}
Object.assign(TYPES,W3_TYPES);Object.assign(WX_MONV,W3_MONV);
// 화면 글자: 지옥 전용 지역은 어느 난이도에서 보든 지옥 레벨로
const w3Add=D=>D&&D.hell?40:DIFF[P.diff].add;
function w3LvOf(regId){const D=REGIONS[regId];return D?D.base+w3Add(D):0}
