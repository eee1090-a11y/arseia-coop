/* ---------- v57 후보 · 141~160레벨 새 땅 넷 (자료) · 사용자 2026-11-07 ----------
   「100레벨 이후의 성장 컨텐츠가 부족해. 그리고 140레벨 이상의 사냥터가 없어. 내 캐릭터 레벨은 130 이상이라고 하더라도 더 강한 지역의 몬스터들을 잡을 기회를 줘야 한다고 봐」
   → 제안서(https://claude.ai/artifact/Nfi5RjwVnMArPxkZAiBQnH) 15가지 「모두 추천대로」(14:42Z).
   · 정할 것 셋(추천대로): ① 내 최고 레벨은 140 그대로, 몬스터만 141~162 ② 장비 레벨은 지금 끝(140 · 특별 143) 그대로, 대신 좋은 것이 더 잘 나옴(g100.js)
     ③ 130레벨부터는 나보다 높은 몬스터 경험치가 줄지 않고 1레벨 높을 때마다 +2%(최대 +40%) (g100b.js)
   · 지옥 전용(3차 전직 땅 · 110 땅과 같은 봉인 규칙) + 130레벨부터 들어감(g100.js가 w3BlockReg에 더함). 지옥 +40이 붙어 실제 레벨은 괄호 안.
       대강 밀림 동쪽 → 소금 거울 평원 base 101 (141~146)      대강 밀림 남쪽 → 검은 기둥 해안 105 (145~151)
       검은 기둥 해안 서쪽 → 푸른 빛 동굴 110 (150~155)        구름 첨봉 서쪽 → 구름 돌기둥 숲 114 (154~158)
       던전: 거울 궁전 106(146 · 보스 148) · 썰물 바다 동굴 111(151 · 153) · 가장 깊은 별빛 굴 115(155 · 157) · 하늘 사원 118(158 · 160)
       별이 떨어진 큰 구덩이 120(160 · 끝 보스 「식은 별의 심장」 162 · 2~3명 협동) — 구름 돌기둥 숲 안, 네 던전 보스를 모두 쓰러뜨려야 열림(g100c.js)
   · 세계 지도: 소금 [5,-1] · 해안 [4,0] · 동굴 [3,0] · 돌기둥 [3,-3] (지도 칸 x -2~5 · y -3~3 안 · 넓히지 않음). 지역 번호는 맨 끝에 붙인다.
   · 몬스터 수치는 r110 · 일식 지역 몬스터 것을 빌리고(레벨 따라 커짐), 140 넘는 몬스터의 한 대 피해는 140레벨 것으로 묶는다(g100.js · 들판 한 대 상한 그대로).
     대신 생명력 +3%/레벨(140 넘는 만큼, 덧셈)과 조금 빠른 공격(atk ×0.9)으로 더 단단하고 바쁘다.
   · 그림: 지금은 모두 있는 그림을 빌려 이름 · 색만 새로. 코덱스 그림 70장 목록: rpg/growth-100plus/codex (키 = 아래 id).
   · 저장: 이 파일은 없음. 새 저장 값은 P.g100 하나(g100.js · 없으면 기본값). */
const G100={salt:'g1_salt',coast:'g1_coast',cave:'g1_cave',spire:'g1_spire',crater:'g1_crater',
  ids:['g1_salt','g1_coast','g1_cave','g1_spire'],dgs:['g1_saltdg','g1_coastdg','g1_cavedg','g1_spiredg'],bosses:['b_sm1_queen','b_bc1_serp','b_bl1_drake','b_sp1_king'],
  minLv:130,capLv:140,hpPer:.03,atkMul:.9};
const G100_TYPES={};
{const T=k=>TYPES[k]||WX_TYPES[k],W=k=>WX_TYPES[k]||TYPES[k];
 const mk=(id,stat,draw,o)=>{const s=T(stat);G100_TYPES[id]={...s,draw,alt:o.alt||s.alt||'wolf',...o,atk:(s.atk||1.2)*G100.atkMul,reg:1,g100:1}};
 // 소금 거울 평원 (101~)
 mk('sm1_crane','au1_wolf','imp',{n:'분홍 깃 소금학',min:101,col:'#f0a0b8',eye:'#3a2a2a',alt:'goblin'});
 mk('sm1_hunter','au1_wolf','panther',{n:'거울 속 사냥꾼',min:101,col:'#a8d8f0',eye:'#ffffff',mir:1});
 mk('sm1_golem','ct_dome','golem',{n:'소금 결정 거인',min:102,col:'#eef0f2',eye:'#9fd8ff',alt:'ogre'});
 mk('sm1_spirit','au1_whale','elemental',{n:'하늘 비친 물정령',min:103,col:'#9fd0f8',pcol:'#e8f4ff',eye:'#ffffff',alt:'wraith',ranged:true,undead:false});
 // 검은 기둥 해안 (105~)
 mk('bc1_crab','au1_bear','golem',{n:'현무암 등껍질 큰게',min:105,col:'#3a3a40',eye:'#ff8a5a',alt:'ogre'});
 mk('bc1_bird','au1_whale','imp',{n:'파도깃 바닷새',min:105,col:'#e8eef4',pcol:'#cfefff',alt:'goblin',ranged:true,undead:false});
 mk('bc1_sailor','au1_guard','skeleton',{n:'밀물에 잠긴 뱃사람',min:106,col:'#4a6a6a',eye:'#9affe0',undead:true});
 mk('bc1_giant','au1_bear','yeti',{n:'기둥 바위 거인',min:107,col:'#2e2e34',eye:'#ffb070',alt:'ogre'});
 // 푸른 빛 동굴 (110~)
 mk('bl1_worm','au1_whale','serpent',{n:'푸른 실 굴벌레',min:110,col:'#4a5a7a',pcol:'#7ad8ff',eye:'#9fe8ff',ranged:true,undead:false});
 mk('bl1_bat','au1_wolf','imp',{n:'눈먼 굴박쥐',min:110,col:'#2a2a3a',eye:'#e8e8ff',alt:'goblin'});
 mk('bl1_spider','au1_wolf','panther',{n:'빛 먹는 바위거미',min:111,col:'#22222a',eye:'#7ad8ff'});
 mk('bl1_stal','ct_dome','golem',{n:'종유석 수호상',min:112,col:'#8a94a4',eye:'#7ad8ff',alt:'ogre'});
 // 구름 돌기둥 숲 (114~)
 mk('sp1_monkey','au1_wolf','goblin',{n:'구름 원숭이',min:114,col:'#9a948a',eye:'#ffe8a0',alt:'imp'});
 mk('sp1_crane','au1_whale','imp',{n:'돌기둥 흰 두루미',min:114,col:'#f4f4f0',pcol:'#ffd0c0',eye:'#e04a3a',alt:'goblin',ranged:true,undead:false});
 mk('sp1_tiger','au1_bear','panther',{n:'안개 호랑이',min:115,col:'#a8a8a0',eye:'#ffe066'});
 mk('sp1_warrior','au1_guard','knight',{n:'기둥 위 돌 무사',min:116,col:'#8a8478',eye:'#ffd08a',undead:false});
 // 별이 떨어진 큰 구덩이 (던전 안만)
 mk('cr1_shard','ct_dome','golem',{n:'별 조각 골렘',min:120,col:'#3a3a4a',eye:'#e8e0ff',alt:'ogre'});
 mk('cr1_wisp','au1_whale','wraith',{n:'식은 별빛 망령',min:120,col:'#d8d0ff',pcol:'#f0e8ff',ranged:true,undead:true});
 mk('cr1_ward','au1_guard','knight',{n:'구덩이 파수꾼',min:120,col:'#2a2a3a',eye:'#e8e0ff'});
 // 준보스 · 보스 (r110 · 일식 던전 수치)
 const B=(id,base,o)=>{G100_TYPES[id]={...W(base),...o,reg:1,g100:1}};
 B('m_sm1_maid','m_servan',{n:'거울 시녀 엘라스',col:'#dfe8f0',pcol:'#e8f4ff',summon:'sm1_spirit'});
 B('m_sm1_scorp','m_crystalq',{n:'소금 왕관 전갈',col:'#f0eee8',summon:'sm1_crane'});
 B('b_sm1_queen','b_eldan',{n:'두 하늘의 여왕 미라엔',col:'#eef4fa',pcol:'#cfe8ff',draw:'apostle',alt:'wraith',summon:'sm1_hunter',aura:'rgba(200,230,255,.45)'});
 B('m_bc1_witch','m_har',{n:'조개 등딱지 마녀 해라',col:'#5a6a5a',pcol:'#9affe0',summon:'bc1_bird'});
 B('m_bc1_harp','m_lore',{n:'고래뼈 작살꾼',col:'#c8c0a8',eye:'#9affe0'});
 B('b_bc1_serp','b_raigon',{n:'밀물을 감는 검은 바다뱀 하르크',col:'#2a2e34',pcol:'#e8f4ff',draw:'serpent',alt:'wolf',summon:'bc1_sailor',aura:'rgba(160,220,255,.35)'});
 B('m_bl1_spq','m_crystalq',{n:'굴 여왕 거미 실라',col:'#2a2a3a',pcol:'#7ad8ff',summon:'bl1_bat'});
 B('m_bl1_hermit','m_ogma',{n:'빛 삼킨 은둔자',col:'#1a1a22',pcol:'#7a7aff',summon:'bl1_worm'});
 B('b_bl1_drake','b_amas',{n:'천 개의 빛을 단 동굴 용 루미오르',col:'#3a4a6a',pcol:'#9fe8ff',draw:'serpent',alt:'wolf',summon:'bl1_stal',aura:'rgba(120,210,255,.45)'});
 B('m_sp1_drum','m_kedric',{n:'바람 북 수도사 운',col:'#8a5a3a',pcol:'#e8f0ff',summon:'sp1_crane'});
 B('m_sp1_cap','m_rodstone',{n:'돌 무사 대장 강하',col:'#7a7468',eye:'#ffd08a'});
 B('b_sp1_king','b_bardus',{n:'구름 위 돌기둥 왕 바위결',col:'#9a9488',pcol:'#f0f4ff',summon:'sp1_warrior',aura:'rgba(240,244,255,.4)'});
 B('m_cr1_dust','m_servan',{n:'별먼지 마녀 오루나',col:'#2a2a5a',pcol:'#e8e0ff',summon:'cr1_wisp'});
 B('m_cr1_iron','m_lore',{n:'쇠별 기사',col:'#1e1e2a',eye:'#e8e0ff'});
 B('b_cr1_heart','b_amas',{n:'식은 별의 심장',hp:5200,col:'#d8d0ff',pcol:'#ffffff',draw:'elemental',alt:'wraith',sc:3.2,summon:'cr1_shard',skills:['volley','slam','summon'],aura:'rgba(220,200,255,.5)',heart:1});
}
Object.assign(TYPES,G100_TYPES);
// 속성: 땅마다 다르게(정반대끼리만 ±20% 규칙은 elem21.js 그대로). 신성 몬스터는 두지 않음.
Object.assign(WX21_EL,{sm1_golem:'ice',sm1_spirit:'ice',sm1_hunter:'storm',bc1_crab:'earth',bc1_giant:'earth',bc1_sailor:'ice',bc1_bird:'storm',
  bl1_worm:'storm',bl1_spider:'dark',bl1_stal:'earth',bl1_bat:'dark',sp1_crane:'storm',sp1_tiger:'fire',sp1_warrior:'earth',cr1_shard:'fire',cr1_wisp:'dark',cr1_ward:'dark'});
// 던전 넷 + 큰 구덩이 (x,y는 지역을 붙일 때)
const G100_DG=[
  {id:'g1_saltdg',reg:G100.salt,at:'near',n:'소금 아래 잠긴 거울 궁전',x:0,y:0,lvl:106,floor:[200,204,210],wall:['#c8ccd4','#5a6070','#f0f4f8'],torch:'#cfe8ff',mobs:['sm1_spirit','sm1_golem','sm1_hunter'],minis:['m_sm1_maid','m_sm1_scorp'],boss:'b_sm1_queen',loot:'냉기 · 마나 · 생명력'},
  {id:'g1_coastdg',reg:G100.coast,at:'near',n:'썰물 바다 동굴',x:0,y:0,lvl:111,floor:[44,52,60],wall:['#2a2e34','#0e1014','#5a6a74'],torch:'#9affe0',mobs:['bc1_crab','bc1_sailor','bc1_giant'],minis:['m_bc1_witch','m_bc1_harp'],boss:'b_bc1_serp',loot:'대지 · 냉기 · 피해 감소'},
  {id:'g1_cavedg',reg:G100.cave,at:'near',n:'가장 깊은 별빛 굴',x:0,y:0,lvl:115,floor:[40,44,58],wall:['#2a3040','#0a0c14','#5a7ab0'],torch:'#7ad8ff',mobs:['bl1_worm','bl1_spider','bl1_stal'],minis:['m_bl1_spq','m_bl1_hermit'],boss:'b_bl1_drake',loot:'폭풍 · 어둠 · 치명타'},
  {id:'g1_spiredg',reg:G100.spire,at:'near',n:'가장 높은 기둥의 하늘 사원',x:0,y:0,lvl:118,floor:[120,96,80],wall:['#8a4a3a','#2a1a14','#e0c8a0'],torch:'#ffe0a0',mobs:['sp1_monkey','sp1_tiger','sp1_warrior'],minis:['m_sp1_drum','m_sp1_cap'],boss:'b_sp1_king',loot:'화염 · 대지 · 스킬 레벨(드묾)'},
  {id:G100.crater,reg:G100.spire,at:'near',n:'별이 떨어진 큰 구덩이',x:0,y:0,lvl:120,floor:[50,46,70],wall:['#3a3450','#100c1a','#b0a0e0'],torch:'#e8e0ff',mobs:['cr1_shard','cr1_wisp','cr1_ward'],minis:['m_cr1_dust','m_cr1_iron'],boss:'b_cr1_heart',loot:'모든 원소 · 상급 유니크(드묾)',crater:1}
];
WX_DUNGEONS.push(...G100_DG);
// 마을 의뢰: 마을마다 넷. 보상 공식은 다른 마을 의뢰와 같음(sqXp · 금화 레벨×8)
const g1q=(id,town,giver,lvl,kind,t,say,done,goals)=>({id,town,giver,lvl,kind,t,say,done,goals,rw:{xp:1,gold:lvl*8,pot:2}});
const G100_SQ=[
 g1q('g100q_salt_1','g1_salt_camp','g1_pacha',130,'처치','하늘을 밟는 학','분홍 깃 소금학이 소금 캐는 자리마다 내려앉아요. 부리로 쪼면 소금 벽돌이 다 깨져요. 몇 마리만 쫓아 주세요.','오늘은 벽돌이 하나도 안 깨졌어요. 고마워요.',[{type:'kill',k:['sm1_crane'],n:8,d:'분홍 깃 소금학 8마리 처치'}]),
 g1q('g100q_salt_2','g1_salt_camp','g1_pacha',132,'수집','물에 비친 사냥꾼','눈으로는 안 보이고 발밑 물에 비친 모습으로만 보이는 사냥꾼이 있어요. 물이 고인 곳에서 비친 그림자를 보고 잡아 주세요. 그놈 눈물 같은 소금 구슬이 필요해요.','이 구슬이면 거울 물이 맑아져요. 다들 길을 안 잃겠어요.',[{type:'collect',k:['sm1_hunter'],p:.55,n:6,item:'거울 소금 구슬',d:'거울 속 사냥꾼에게서 거울 소금 구슬 6개 모으기'}]),
 g1q('g100q_salt_3','g1_salt_camp','g1_pacha',134,'처치','하얀 거인과 물정령','소금 결정 거인이 걸을 때마다 땅이 갈라지고, 그 틈에 물정령이 고여요. 둘 다 조금씩 물러나게 해 주세요.','갈라진 땅이 다시 하얗게 덮였어요.',[{type:'kill',k:['sm1_golem','sm1_spirit'],n:9,d:'소금 결정 거인 · 하늘 비친 물정령 9마리 처치'}]),
 g1q('g100q_salt_4','g1_salt_camp','g1_pacha',136,'던전','두 하늘의 여왕','소금 계단 아래 거울 궁전에 하늘이 둘인 여왕이 산대요. 위의 하늘과 발밑 하늘을 다 가지려 한다나요. 궁전 깊은 곳으로 가 주세요.','오늘 하늘은 하나예요. 물에 비친 하늘도 그냥 비친 것뿐이고요.',[{type:'kill',k:['b_sm1_queen'],n:1,d:'거울 궁전의 미라엔 쓰러뜨리기'}]),
 g1q('g100q_coast_1','g1_coast_camp','g1_gunhild',134,'처치','등껍질이 기둥인 게','현무암 등껍질 큰게가 그물을 다 끊어 놔요. 등껍질이 바위라 칼도 안 들어가요. 그래도 당신이라면 되겠지요.','그물이 오늘은 멀쩡해요. 고기도 가득이고요.',[{type:'kill',k:['bc1_crab'],n:8,d:'현무암 등껍질 큰게 8마리 처치'}]),
 g1q('g100q_coast_2','g1_coast_camp','g1_gunhild',136,'수집','밀물에 잠긴 뱃사람','밀물이 들어올 때마다 옛 뱃사람들이 물에서 걸어 나와요. 그들 품에 집으로 보내지 못한 편지가 있대요. 편지를 찾아 주세요.','이 편지들은 내가 마을 사람들에게 나눠 줄게요. 오래 기다렸을 테니.',[{type:'collect',k:['bc1_sailor'],p:.55,n:6,item:'젖은 편지',d:'밀물에 잠긴 뱃사람에게서 젖은 편지 6통 모으기'}]),
 g1q('g100q_coast_3','g1_coast_camp','g1_gunhild',138,'처치','기둥 위의 바위 거인','검은 기둥 위에 앉아 있던 바위 거인들이 일어나서 물가로 내려와요. 그들이 서 있는 곳은 썰물 때도 지나갈 수가 없어요.','썰물 길이 다시 열렸어요.',[{type:'kill',k:['bc1_giant','bc1_bird'],n:9,d:'기둥 바위 거인 · 파도깃 바닷새 9마리 처치'}]),
 g1q('g100q_coast_4','g1_coast_camp','g1_gunhild',140,'던전','밀물을 감는 바다뱀','썰물 때만 열리는 바다 동굴 안에 검은 바다뱀이 몸을 감고 있대요. 그놈이 몸을 풀면 밀물이 들어온다고 하지요. 썰물 때 들어가 보세요.','오늘 밀물은 아주 얌전해요. 바다뱀이 잠잠하니까요.',[{type:'kill',k:['b_bc1_serp'],n:1,d:'썰물 바다 동굴의 하르크 쓰러뜨리기'}]),
 g1q('g100q_cave_1','g1_cave_camp','g1_moro',138,'처치','눈먼 박쥐 떼','눈먼 굴박쥐들이 등불만 보면 달려들어요. 등불이 꺼지면 이 굴에선 아무것도 안 보여요. 박쥐 떼를 좀 줄여 주세요.','등불이 오늘 하나도 안 꺼졌어요.',[{type:'kill',k:['bl1_bat'],n:8,d:'눈먼 굴박쥐 8마리 처치'}]),
 g1q('g100q_cave_2','g1_cave_camp','g1_moro',139,'수집','푸른 실','굴벌레가 늘어뜨린 푸른 실은 꺼지지 않는 등불 심지가 돼요. 벌레를 잡아 실을 모아 주세요.','이 실이면 굴 끝까지 등불을 이을 수 있어요.',[{type:'collect',k:['bl1_worm'],p:.55,n:6,item:'푸른 빛 실',d:'푸른 실 굴벌레에게서 푸른 빛 실 6타래 모으기'}]),
 g1q('g100q_cave_3','g1_cave_camp','g1_moro',140,'처치','빛을 먹는 것들','빛 먹는 바위거미와 종유석 수호상이 등불 길을 막고 서 있어요. 빛을 지나가게 해 주세요.','등불 길이 한 칸 더 길어졌어요.',[{type:'kill',k:['bl1_spider','bl1_stal'],n:9,d:'빛 먹는 바위거미 · 종유석 수호상 9마리 처치'}]),
 g1q('g100q_cave_4','g1_cave_camp','g1_moro',140,'던전','천 개의 빛을 단 용','가장 깊은 굴에 몸에 빛을 천 개 단 용이 산대요. 그 빛은 다 이 굴에서 훔친 거래요. 돌려받아 주세요.','천장 빛이 다시 별처럼 반짝여요!',[{type:'kill',k:['b_bl1_drake'],n:1,d:'가장 깊은 별빛 굴의 루미오르 쓰러뜨리기'}]),
 g1q('g100q_spire_1','g1_spire_camp','g1_ling',140,'처치','다리 위의 원숭이','구름 원숭이들이 흔들다리 밧줄을 잡아당기며 놀아요. 사람이 건널 때 하면 큰일이죠. 좀 혼내 주세요.','다리가 오늘은 조용히 흔들려요.',[{type:'kill',k:['sp1_monkey'],n:8,d:'구름 원숭이 8마리 처치'}]),
 g1q('g100q_spire_2','g1_spire_camp','g1_ling',140,'수집','두루미 깃털','돌기둥 흰 두루미 깃털을 밧줄에 엮으면 바람이 불 때 미리 떨어서 알려 줘요. 깃털을 모아 주세요.','이제 다리마다 깃털이 달렸어요.',[{type:'collect',k:['sp1_crane'],p:.55,n:6,item:'흰 두루미 깃털',d:'돌기둥 흰 두루미에게서 깃털 6개 모으기'}]),
 g1q('g100q_spire_3','g1_spire_camp','g1_ling',140,'처치','안개 속 호랑이와 돌 무사','안개 호랑이가 다리 끝에서 기다리고, 돌 무사가 기둥 위를 지켜요. 둘 다 이 숲의 주인이 자기라고 생각하지요.','기둥 위 길이 다시 우리 것이 됐어요.',[{type:'kill',k:['sp1_tiger','sp1_warrior'],n:9,d:'안개 호랑이 · 기둥 위 돌 무사 9마리 처치'}]),
 g1q('g100q_spire_4','g1_spire_camp','g1_ling',140,'던전','가장 높은 기둥의 왕','가장 높은 기둥 꼭대기 하늘 사원에 돌기둥 왕이 앉아 있대요. 그 왕이 일어서면 다리가 모두 끊어진대요. 먼저 가 주세요.','다리가 모두 그대로예요. 왕은 다시 앉아 있겠지요.',[{type:'kill',k:['b_sp1_king'],n:1,d:'하늘 사원의 바위결 쓰러뜨리기'}])];
WX_SQ.push(...G100_SQ);
// 마을 사람 (지역 놀이를 알려 준다 · 이름은 마을 전체에서 하나뿐)
Object.assign(WX_FOLK,{
 g1_pacha:{town:'g1_salt_camp',at:[-170,-140],n:'소금 캐는 이 파차',role:'소금꾼',L:{body:'#8a3a4a',cape:'#e0a040',hair:'#1a1008',hs:2,hat:1,hatC:'#4a3a2a',prop:'staff'},
  lines:['얕은 물이 고인 곳은 거울처럼 하늘이 비쳐. 거기선 눈에 안 보이던 「거울 속 사냥꾼」이 물에 비친 모습으로 보여.','물 밖에서는 그놈이 바로 곁에 와야 겨우 흐릿하게 보이지. 물가에서 싸우는 게 좋아.','여기 몬스터는 다 140레벨이 넘어. 한 대 맞는 아픔은 140짜리랑 같은데, 훨씬 단단하고 빨라.']},
 g1_gunhild:{town:'g1_coast_camp',at:[-170,-140],n:'검은 모래 어부 군힐',role:'어부',L:{body:'#3a4a5a',cape:'#6a5a4a',hair:'#d8d0c0',hs:3,dress:1,prop:'basket'},
  lines:['여긴 몇 분마다 밀물이 들어와. 바다 쪽 아래 모래밭이 물에 잠기면 걸음이 아주 느려지니까 기둥 위나 마을 쪽으로 올라가.','바다 동굴 입구는 썰물 때만 열려. 밀물 때는 들어갈 수 없어. 화면 위 「밀물 · 썰물」 시계를 봐.','검은 기둥은 위가 평평해서 밟고 걸을 수 있어.']},
 g1_moro:{town:'g1_cave_camp',at:[-170,-140],n:'등불장이 모로',role:'굴 지기',L:{body:'#4a3a2a',cape:'#2a3a5a',hair:'#3a2a1a',hs:1,hat:1,hatC:'#2a2a3a',prop:'staff',gem:'#ffb060'},
  lines:['이 굴은 캄캄해. 내 등불 둘레만 보이지. 길가 등불 걸이 곁에 가면 환해지고, 빛 버섯을 건드리면 한동안 등불이 커져.','눈먼 굴박쥐는 빛을 보고 와. 등불이 큰 동안엔 박쥐가 더 멀리서 알아챈다는 걸 잊지 마.','천장의 푸른 빛은 굴벌레 실이야. 별처럼 예쁘지만 그 밑엔 굴벌레가 있어.']},
 g1_ling:{town:'g1_spire_camp',at:[-170,-140],n:'흔들다리 지기 링',role:'다리 지기',L:{body:'#5a6a4a',cape:'#a83a2a',hair:'#1a1008',hs:0,prop:'staff'},
  lines:['기둥과 기둥 사이는 구름 바다야. 흔들다리로만 건널 수 있어.','다리 위에서는 옆바람이 불어. 하얀 줄무늬가 보이면 곧 바람이 와. 다리 한가운데에 서 있지 말고 어서 건너.','숲 깊은 곳에 별이 떨어진 큰 구덩이가 있어. 네 땅의 주인을 모두 이긴 사람만 내려갈 수 있대.']},
 g1_baren:{town:'r110_square_camp',at:[190,-150],n:'증표 상인 바렌',role:'증표 상인',L:{body:'#5a3a2a',cape:'#c8a040',hair:'#2a1a10',hs:1,prop:'staff',gem:'#ffd76a'},
  lines:['나보다 높은 몬스터를 잡으면 가끔 「강자의 증표」가 나와. 나한테 가져오면 좋은 걸로 바꿔 주지.','증표는 성장(G) 창 「강자」 칸에서 바꿀 수 있어. 마을 안에서만.','떠도는 강자나 틈의 수호자를 잡으면 증표가 꼭 나와.']}
});
// 마을 모습
Object.assign(WX_TWOUT,{
 [G100.salt]:{st:'frost',local:['소금 벽돌 쌓는 이','#c8a080',3,'비 온 다음 날엔 하늘이 발밑에도 있어. 어지러우니 천천히 걸어.'],props:['crate','barrel','haystack','fence']},
 [G100.coast]:{st:'pearl',local:['그물 깁는 이','#4a5a6a',3,'밀물이 들어오는 소리가 나면 다들 기둥 위로 올라가.'],props:['nets','boat','barrel','kegs']},
 [G100.cave]:{st:'frostcamp',local:['등불 심지 꼬는 이','#5a4a3a',3,'여기선 낮도 밤도 없어. 등불이 꺼지면 그게 밤이야.'],props:['crate','barrel','kegs','fence']},
 [G100.spire]:{st:'crag',local:['밧줄 꼬는 이','#6a5a3a',3,'구름 아래로 떨어진 사람은 아무도 없어. 다리가 튼튼하니까. 아마도.'],props:['haystack','crate','fence','rock']}
});
// 지역 붙이기 (r110Install 뒤)
function g100Install(){const IC=REGIONS.ice.th,SE=REGIONS.sea.th,LV=REGIONS.lava.th;
  const reg=(id,o)=>{REGIONS[id]={id,hell:1,zs:340,noLair:1,straight:1,...o}};
  reg(G100.salt,{n:'소금 거울 평원',base:101,zcap:5,col:'#e8f4ff',entry:'W',edges:{W:R110.jungle},seed:263,
    town:{id:'g1_salt_camp',n:'소금꽃 야영지',area:'소금 사막 가장자리',desc:'끝없이 하얀 소금 사막의 가장자리. 비가 얇게 고인 날이면 하늘이 땅에도 하나 더 생깁니다.',roof:['#e8e0d0','#c8a080','#d8c8b0','#a88a6a']},
    th:{...IC,pal:[[224,226,228],[208,212,218]],deep:[180,196,214],liq:{col:[150,196,236],th:.95,kind:'water'},grass:0,flow:0,tile:.1,paint:'snow'},
    mix:[['iceboulder',10],['icespike',10],['rock',4],['frozenbones',2]],mobs:['sm1_crane','sm1_hunter','sm1_golem','sm1_spirit']});
  reg(G100.coast,{n:'검은 기둥 해안',base:105,zcap:6,col:'#8ab0c8',entry:'N',edges:{N:R110.jungle,W:G100.cave},seed:269,
    town:{id:'g1_coast_camp',n:'검은 모래 어촌',area:'현무암 절벽 아래',desc:'검은 모래 해변과 육각형 돌기둥 절벽 사이의 작은 어촌. 몇 분마다 밀물이 모래밭을 덮습니다.',roof:['#3a4a5a','#5a3a2a','#2a3a4a','#4a4a4a']},
    th:{...SE,pal:[[58,58,62],[44,44,50]],deep:[30,30,36],liq:{col:[40,70,96],th:.6,kind:'water'},grass:20,gm:[1,1.1,1],flow:0,tile:.12,paint:'beach'},
    mix:[['obsidian',16],['lavarock',10],['rock',8],['mossrock',6]],mobs:['bc1_crab','bc1_bird','bc1_sailor','bc1_giant']});
  reg(G100.cave,{n:'푸른 빛 동굴',base:110,zcap:5,col:'#7ad8ff',entry:'E',edges:{E:G100.coast},seed:271,
    town:{id:'g1_cave_camp',n:'반딧불 굴 쉼터',area:'땅속 큰 굴',desc:'천장에 푸른 빛이 별처럼 박힌 땅속 큰 굴. 등불장이들이 등불을 이어 길을 냅니다.',roof:['#2a3a5a','#3a3a4a','#4a3a2a','#2a2a3a']},
    th:{...LV,pal:[[50,54,64],[40,44,54]],deep:[24,28,40],liq:{col:[20,40,70],th:.82,kind:'water'},grass:0,flow:0,tile:.1,paint:'lava'},
    mix:[['obsidian',10],['rock',14],['icespike',12],['mossrock',8]],mobs:['bl1_worm','bl1_bat','bl1_spider','bl1_stal']});
  reg(G100.spire,{n:'구름 돌기둥 숲',base:114,zcap:4,col:'#f0f4ff',entry:'E',edges:{E:R110.peak},seed:277,
    town:{id:'g1_spire_camp',n:'흔들다리 마을',area:'구름 위 돌기둥 사이',desc:'구름 위로 솟은 돌기둥 사이를 흔들다리로 이은 마을. 발밑은 끝없는 구름 바다입니다.',roof:['#a83a2a','#6a4a2a','#8a2a2a','#5a4a3a']},
    th:{pal:[[100,108,88],[84,92,76]],deep:[200,206,214],liq:{col:[226,232,240],th:.95,kind:'water'},grass:240,gm:[1.1,1.3,1],flow:1,fcol:['#f4f0e4','#ffd76a','#ffb0c0'],tile:.35,paint:'meadow'},
    mix:[['rock',18],['mossrock',14],['snowpine',10],['windtree',8],['bush',6],['fern',6]],mobs:['sp1_monkey','sp1_crane','sp1_tiger','sp1_warrior']});
  Object.assign(WX_WPOS,{[G100.salt]:[5,-1],[G100.coast]:[4,0],[G100.cave]:[3,0],[G100.spire]:[3,-3]});/* 지도 칸(x -2~5 · y -3~3)을 넓히지 않게 · 돌기둥 숲은 구름 첨봉 서쪽 빈 칸([2,1]은 대강 아닌 옛 밀림 자리라 겹침) */
  REGIONS[R110.jungle].edges.E=G100.salt;REGIONS[R110.peak].edges.W=G100.spire;REGIONS[R110.jungle].edges.S=G100.coast;
  for(const k in G100_TYPES){const t=G100_TYPES[k];if(!MON[t.draw])t.draw=t.alt||'wolf'}
  const at={g1_saltdg:[4300,3600],g1_coastdg:[3000,4420],g1_cavedg:[4400,1800],g1_spiredg:[4300,1500],g1_crater:[1700,4300]};
  for(const d of G100_DG)if(at[d.id]){d.x=at[d.id][0];d.y=at[d.id][1]}}
{const _h=h29Install;h29Install=function(){const r=_h.apply(this,arguments);g100Install();return r}}
