/* ---------- v58 후보 · 별 너머 새 땅 둘 (159~170) · 별의 탑 (자료) · 사용자 2026-11-08 「고레벨 컨텐츠 다음배치 만들고」 ----------
   제안서 https://claude.ai/artifact/71Km6TDdr3RpwpLahqxPKW 다섯 가지 「추천대로 다섯 가지 모두」(00:18Z). 이 파일 = 다-1 땅 자료 · 다-2 탑 자료.
   · 정할 것(추천대로): 캐릭터 최고 레벨 140 그대로 · 몬스터만 159~172 · 떨어지는 장비 레벨 140 그대로(더 강해지는 길은 다-4 별빛 강화).
   · 지옥 전용 · 140레벨부터(g140.js). 지옥 +40이 붙어 실제 레벨은 괄호 안.
       부서진 하늘섬 base 119 (159~164) · 별바다 가장자리 base 125 (165~170)
       던전: 뒤집힌 하늘 신전 124 (164 · 보스 166) · 별 무덤 깊은 곳 129 (169 · 보스 171)
   · 가는 길: 별이 떨어진 큰 구덩이 입구 곁 「하늘 계단」(식은 별의 심장을 한 번 쓰러뜨리면 열림, g140.js). 두 땅은 서로 이어짐. 세계 지도 하늘섬 [-1,-3] · 별바다 [-2,-3](맨 윗줄 빈 칸 · 지도 넓히지 않음)(빈 칸 · 계단은 지도 끝 길이 아니라 길 줄 없음).
   · 140 넘는 몬스터 규칙(한 대 피해 140 값 · 생명력 +3%/레벨)은 g100.js 그대로(G100.all · G100.dgx에 더함).
   · 그림: 지금은 있는 그림을 빌려 이름 · 색만 새로. 코덱스 목록: rpg/growth-140plus/codex (키 = 아래 id).
   · 저장: 이 파일은 없음. */
const G140={sky:'g2_sky',grave:'g2_grave',ids:['g2_sky','g2_grave'],dgs:['g2_skydg','g2_gravedg'],bosses:['b_sk2_king','b_gr2_maw'],tower:'g2_tower',minLv:140,
  stairDx:260,stairDy:-60};
G100.all.push(...G140.ids);G100.dgx.push(...G140.dgs,G140.tower);
const G140_TYPES={};
{const T=k=>TYPES[k]||WX_TYPES[k],W=k=>WX_TYPES[k]||TYPES[k];
 const mk=(id,stat,draw,o)=>{const s=T(stat);G140_TYPES[id]={...s,draw,alt:o.alt||s.alt||'wolf',...o,atk:(s.atk||1.2)*G100.atkMul,reg:1,g100:1,g140:1}};
 // 부서진 하늘섬 (119~)
 mk('sk2_gull','au1_whale','imp',{n:'번개깃 하늘매',min:119,col:'#f4f0d0',pcol:'#fff6a0',eye:'#3a2a10',alt:'goblin',ranged:true,undead:false});
 mk('sk2_ram','au1_bear','golem',{n:'떠도는 섬 바위양',min:119,col:'#b8b0a0',eye:'#ffe08a',alt:'ogre'});
 mk('sk2_sprite','au1_whale','elemental',{n:'찢어진 구름 정령',min:120,col:'#e8f0ff',pcol:'#ffffff',eye:'#9fd0ff',alt:'wraith',ranged:true,undead:false});
 mk('sk2_knight','au1_guard','knight',{n:'하늘 성채 망령 기사',min:121,col:'#5a6a8a',eye:'#cfe8ff',undead:true});
 mk('sk2_drake','au1_wolf','serpent',{n:'바람 비늘 새끼용',min:121,col:'#7ab0c8',pcol:'#e8f8ff',eye:'#ffe066'});
 mk('sk2_giant','ct_dome','yeti',{n:'깨진 섬 거인',min:122,col:'#8a8478',eye:'#9fe0ff',alt:'ogre'});
 // 별바다 가장자리 (125~)
 mk('gr2_moth','au1_wolf','imp',{n:'별가루 나방',min:125,col:'#c8b8ff',pcol:'#f0e8ff',eye:'#ffffff',alt:'goblin'});
 mk('gr2_wraith','au1_whale','wraith',{n:'이름 잃은 별지기',min:125,col:'#8a7ab0',pcol:'#d8d0ff',ranged:true,undead:true});
 mk('gr2_golem','ct_dome','golem',{n:'운석 거인',min:126,col:'#4a3a3a',eye:'#ff8a4a',alt:'ogre'});
 mk('gr2_hound','au1_wolf','panther',{n:'검은 별 사냥개',min:126,col:'#1a1a2a',eye:'#b48aff'});
 mk('gr2_knight','au1_guard','knight',{n:'마지막 별의 기사',min:127,col:'#6a4a3a',eye:'#ffd08a',undead:false});
 mk('gr2_eye','au1_whale','elemental',{n:'떨어진 별의 눈',min:128,col:'#9fd8ff',pcol:'#e8f8ff',eye:'#ffffff',alt:'wraith',ranged:true,undead:false});
 // 준보스 · 보스
 const B=(id,base,o)=>{G140_TYPES[id]={...W(base),...o,reg:1,g100:1,g140:1}};
 B('m_sk2_herald','m_servan',{n:'폭풍 전령 아이라',col:'#e8f0ff',pcol:'#fff6a0',summon:'sk2_sprite'});
 B('m_sk2_smith','m_ogma',{n:'하늘 대장장이 굼드',col:'#6a5a4a',pcol:'#ffd08a'});
 B('b_sk2_king','b_raigon',{n:'뒤집힌 하늘의 왕 테미르',col:'#e8f0ff',pcol:'#fff6a0',draw:'apostle',alt:'wraith',summon:'sk2_knight',aura:'rgba(255,246,160,.4)'});
 B('m_gr2_keeper','m_lore',{n:'무덤지기 오스',col:'#3a3448',eye:'#b48aff'});
 B('m_gr2_choir','m_crystalq',{n:'별빛 합창단장 리네',col:'#d8d0ff',pcol:'#ffffff',summon:'gr2_moth'});
 B('b_gr2_maw','b_amas',{n:'별을 삼킨 입 녹타르',col:'#2a2238',pcol:'#b48aff',draw:'serpent',alt:'wolf',summon:'gr2_hound',aura:'rgba(180,138,255,.45)'});
 // 별의 탑 10층마다 탑의 주인(넷이 돌아가며)
 B('b_tw2_warden','b_bardus',{n:'탑의 주인 · 별 문지기',col:'#c8c0e8',pcol:'#ffffff',aura:'rgba(220,210,255,.4)'});
 B('b_tw2_twin','b_eldan',{n:'탑의 주인 · 쌍둥이 별',col:'#f0e0a0',pcol:'#fff6d0',draw:'apostle',alt:'wraith',aura:'rgba(255,240,180,.4)'});
 B('b_tw2_hunter','b_raigon',{n:'탑의 주인 · 별 사냥꾼',col:'#3a3a5a',pcol:'#9fd8ff',aura:'rgba(160,210,255,.4)'});
 B('b_tw2_void','b_amas',{n:'탑의 주인 · 빈 하늘',col:'#1a1428',pcol:'#b48aff',draw:'elemental',alt:'wraith',aura:'rgba(180,138,255,.45)'});
}
Object.assign(TYPES,G140_TYPES);
Object.assign(WX21_EL,{sk2_gull:'storm',sk2_sprite:'storm',sk2_drake:'storm',sk2_ram:'earth',sk2_giant:'earth',sk2_knight:'dark',
  gr2_moth:'storm',gr2_wraith:'dark',gr2_hound:'dark',gr2_golem:'fire',gr2_knight:'fire',gr2_eye:'ice'});
const G140_DG=[
  {id:'g2_skydg',reg:G140.sky,at:'near',n:'뒤집힌 하늘 신전',x:0,y:0,lvl:124,floor:[150,160,190],wall:['#c8d0e8','#4a5070','#fff6d0'],torch:'#fff6a0',mobs:['sk2_sprite','sk2_knight','sk2_giant'],minis:['m_sk2_herald','m_sk2_smith'],boss:'b_sk2_king',loot:'폭풍 · 대지 · 별 조각'},
  {id:'g2_gravedg',reg:G140.grave,at:'near',n:'별 무덤 깊은 곳',x:0,y:0,lvl:129,floor:[36,30,48],wall:['#3a3048','#0c0a14','#8a7ab0'],torch:'#b48aff',mobs:['gr2_wraith','gr2_golem','gr2_knight'],minis:['m_gr2_keeper','m_gr2_choir'],boss:'b_gr2_maw',loot:'어둠 · 화염 · 별 조각'}];
WX_DUNGEONS.push(...G140_DG);
// 마을 의뢰: 땅마다 넷(잡기 · 모으기는 두 종류씩 · 마지막은 던전 보스)
const G140_SQ=[
 g1q('g140q_sky_1','g2_sky_camp','g2_odd',140,'사냥','끊어진 닻줄','섬과 섬을 잇던 닻줄이 끊겼어. 번개깃 하늘매랑 바람 비늘 새끼용이 줄을 쪼아 대거든. 여덟 마리만 쫓아내 줘.','줄을 다시 매는 동안 조용했어. 고마워.',[{type:'kill',k:['sk2_gull','sk2_drake'],n:8,d:'번개깃 하늘매 · 바람 비늘 새끼용 8마리 쓰러뜨리기'}]),
 g1q('g140q_sky_2','g2_sky_camp','g2_odd',140,'수집','하늘 성채의 쇠붙이','옛 하늘 성채의 쇠붙이로 닻을 만들면 절대 안 끊어진대. 성채 망령 기사랑 깨진 섬 거인이 몸에 박고 다녀. 여섯 개 모아 줘.','이걸로 새 닻을 벼려야겠어.',[{type:'collect',k:['sk2_knight','sk2_giant'],p:.5,n:6,item:'하늘 성채 쇠붙이',d:'하늘 성채 망령 기사 · 깨진 섬 거인에게서 쇠붙이 6개 모으기'}]),
 g1q('g140q_sky_4','g2_sky_camp','g2_odd',141,'사냥','떠도는 섬의 길','바위양이 섬 조각을 들이받으면 닻줄 다리가 흔들려. 찢어진 구름 정령은 그 틈에 번개를 뿌리고. 여덟 마리만 떼어 놔 줘.','다리가 덜 흔들려. 이제 짐을 건널 수 있겠어.',[{type:'kill',k:['sk2_ram','sk2_sprite'],n:8,d:'떠도는 섬 바위양 · 찢어진 구름 정령 8마리 쓰러뜨리기'}]),
 g1q('g140q_sky_3','g2_sky_camp','g2_odd',141,'던전','뒤집힌 하늘의 왕','섬 아래쪽에 하늘이 뒤집힌 신전이 매달려 있어. 거기 왕이 깨어나면 섬들이 흔들려. 먼저 가서 재워 줘.','섬이 덜 흔들려. 이제 좀 자겠다.',[{type:'kill',k:['b_sk2_king'],n:1,d:'뒤집힌 하늘 신전의 테미르 쓰러뜨리기'}]),
 g1q('g140q_grave_1','g2_grave_camp','g2_vela',141,'사냥','무덤을 지키는 밤','별 무덤엔 밤마다 검은 별 사냥개랑 별가루 나방이 몰려와. 초소까지 오기 전에 여덟 마리만 잡아 줘.','오늘 밤은 초소 등불이 안 꺼지겠네.',[{type:'kill',k:['gr2_hound','gr2_moth'],n:8,d:'검은 별 사냥개 · 별가루 나방 8마리 쓰러뜨리기'}]),
 g1q('g140q_grave_2','g2_grave_camp','g2_vela',142,'수집','식은 별의 심지','운석 거인이랑 마지막 별의 기사는 몸속에 식은 별의 심지를 품고 있어. 그걸로 초소 등불을 켜면 무덤의 혼들이 가까이 못 와.','심지가 아직 따뜻해. 신기하지.',[{type:'collect',k:['gr2_golem','gr2_knight'],p:.5,n:6,item:'식은 별의 심지',d:'운석 거인 · 마지막 별의 기사에게서 심지 6개 모으기'}]),
 g1q('g140q_grave_4','g2_grave_camp','g2_vela',142,'사냥','빛을 먹는 눈','이름 잃은 별지기랑 떨어진 별의 눈은 별빛 돌의 빛을 빨아 먹어. 돌이 꺼지기 전에 여덟만 쫓아 줘.','돌빛이 다시 차오르고 있어. 고마워.',[{type:'kill',k:['gr2_wraith','gr2_eye'],n:8,d:'이름 잃은 별지기 · 떨어진 별의 눈 8마리 쓰러뜨리기'}]),
 g1q('g140q_grave_3','g2_grave_camp','g2_vela',143,'던전','별을 삼킨 입','무덤 가장 깊은 곳에 별을 삼키는 게 있어. 녹타르. 그게 배가 고파지면 하늘의 별이 하나씩 사라진대.','오늘 밤 별을 세어 봤어. 하나도 안 줄었어.',[{type:'kill',k:['b_gr2_maw'],n:1,d:'별 무덤 깊은 곳의 녹타르 쓰러뜨리기'}])];
WX_SQ.push(...G140_SQ);
Object.assign(WX_FOLK,{
 g2_odd:{town:'g2_sky_camp',at:[-170,-140],n:'닻지기 오드',role:'닻지기',L:{body:'#4a5a6a',cape:'#c8a040',hair:'#d8d0c0',hs:1,hat:1,hatC:'#3a4a5a',prop:'staff'},
  lines:['여긴 하늘에 뜬 섬 조각이야. 섬과 섬은 닻줄 다리로 이었지.','하늘에서 별똥이 떨어지는 곳엔 땅에 금빛 고리가 먼저 생겨. 고리가 보이면 비켜. 대신 떨어진 자리엔 가끔 별 조각이 남아.','여기 몬스터는 160레벨 가까이 돼. 한 대 아픔은 140짜리랑 같지만 아주 단단해.']},
 g2_vela:{town:'g2_grave_camp',at:[-170,-140],n:'별지기 벨라',role:'별지기',L:{body:'#3a3048',cape:'#8a7ab0',hair:'#e8e0f0',hs:2,dress:1,prop:'book'},
  lines:['여긴 하늘의 별바다가 땅에 닿는 가장자리야. 떨어진 별들이 식어서 여기저기 박혀 있지.','푸르게 빛나는 별빛 돌을 건드리면 잠깐 별빛이 몸에 깃들어. 그동안은 더 세게 때릴 수 있어.','별빛 돌은 한 번 빛을 주면 한참 쉬어야 다시 빛나.']},
 g2_tower:{town:'r110_square_camp',at:[-30,250],n:'탑지기 오린',role:'별의 탑 문지기',L:{body:'#2a2a4a',cape:'#c8c0e8',hair:'#f0f0f0',hs:3,dress:1,prop:'staff',gem:'#e8e0ff'},
  lines:['광장 바깥, 별이 꼭대기에 달린 탑 문이 별의 탑으로 가는 문이야. 140레벨부터 들어갈 수 있어.','한 층마다 3분. 그 안에 다 쓰러뜨리면 위층으로. 10층마다 탑의 주인이 있어.','이번 주 가장 높이 올라간 층은 월요일 아침 9시에 새로 세. 보상은 성장(G) 「별」 칸에서 받아.']}
});
Object.assign(WX_TWOUT,{
 [G140.sky]:{st:'crag',local:['닻줄 꼬는 이','#5a6a7a',3,'바람이 세게 불면 섬이 조금 기울어. 그럴 땐 가운데로 걸어.'],props:['crate','barrel','fence','rock']},
 [G140.grave]:{st:'frostcamp',local:['등불 심지 지키는 이','#4a3a5a',3,'별이 떨어지는 소리를 들어 본 적 있어? 생각보다 조용해.'],props:['crate','kegs','fence','rock']}
});
function g140Install(){const LV=REGIONS.lava.th;
  const reg=(id,o)=>{REGIONS[id]={id,hell:1,zs:340,noLair:1,straight:1,...o}};
  reg(G140.sky,{n:'부서진 하늘섬',base:119,zcap:5,col:'#fff6c8',entry:'W',edges:{W:G140.grave},seed:281,
    town:{id:'g2_sky_camp',n:'구름 닻 정박지',area:'가장 큰 섬 조각 위',desc:'하늘에 뜬 섬 조각들을 닻줄로 이은 정박지. 발밑 구름 사이로 아주 먼 땅이 보입니다.',roof:['#c8a040','#5a6a7a','#e8e0d0','#8a6a4a']},
    th:{pal:[[132,140,110],[116,124,98]],deep:[210,220,236],liq:{col:[232,238,248],th:.92,kind:'water'},grass:200,gm:[1.1,1.2,1],flow:1,fcol:['#fff6c8','#ffffff','#cfe8ff'],tile:.32,paint:'meadow'},
    mix:[['rock',16],['mossrock',12],['windtree',10],['bush',6],['iceboulder',4]],mobs:['sk2_gull','sk2_ram','sk2_sprite','sk2_knight','sk2_drake','sk2_giant']});
  reg(G140.grave,{n:'별바다 가장자리',base:125,zcap:5,col:'#b48aff',entry:'E',edges:{E:G140.sky},seed:283,
    town:{id:'g2_grave_camp',n:'별지기 초소',area:'별바다 들판 가장자리',desc:'별바다가 땅에 닿는 검보랏빛 들판 가장자리의 작은 초소. 식은 별들이 가라앉아 밤마다 별빛 돌이 푸르게 빛납니다.',roof:['#3a3048','#5a4a6a','#2a2238','#4a4a5a']},
    th:{...LV,pal:[[44,38,58],[36,30,48]],deep:[20,16,30],liq:{col:[60,40,100],th:.8,kind:'water'},grass:0,flow:0,tile:.1,paint:'lava'},
    mix:[['obsidian',14],['rock',10],['frozenbones',6],['icespike',8],['lavarock',6]],mobs:['gr2_moth','gr2_wraith','gr2_golem','gr2_hound','gr2_knight','gr2_eye']});
  Object.assign(WX_WPOS,{[G140.sky]:[-1,-3],[G140.grave]:[-2,-3]});/* 지도 맨 윗줄 빈 칸 둘(지도 범위 가로 -2~5 · 세로 -3~3 그대로) · 별바다는 하늘섬 서쪽 */
  for(const k in G140_TYPES){const t=G140_TYPES[k];if(!MON[t.draw])t.draw=t.alt||'wolf'}
  const at={g2_skydg:[4400,1500],g2_gravedg:[1600,4300]};
  for(const d of G140_DG)if(at[d.id]){d.x=at[d.id][0];d.y=at[d.id][1]}}
{const _h=h29Install;h29Install=function(){const r=_h.apply(this,arguments);g140Install();return r}}
