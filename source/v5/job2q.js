/* ---------- v19 (JOB): 위계 시험 · 2차 전직 퀘스트 · 시련의 문 · 전직관 · 갈래 바꾸기 · 스킬 창 탭 · 저장 ----------
   데이터는 설계안(job-advancement/code/job2-quests.js · v19-ideas/code/class-trials.js)에서 그대로 옮겼다(소속 고르기 · 현상금 · 책 제외).
   위계 시험 3번(16레벨)은 소속 고르기 대신 평범한 목표로 바꿨다. 퀘스트 스킬 포인트: 시험 10(10·23·31·38·45레벨) + 전직 7(2·2·3) — 한 번만. */
const J2_NPC={
  elian:{town:'arden',n:'대마법사 엘리안',role:'마법사 전직관',where:'왕립 마법원 안',lines:['위계의 끝에 닿았다고 마법이 끝나는 건 아닐세.','원소를 섞을 텐가, 정령과 계약할 텐가.']},
  j2_priest:{town:'arden',n:'대성당의 노사제 오벨린',role:'사제 전직관',where:'왕도 대성당 제단 앞',lines:['빛을 칼로 쥘 것인가, 등불로 들 것인가.','성자의 길은 아직 멀단다.']},
  j2_warrior:{town:'haven',n:'기사단 교관 브로딘',role:'전사 전직관',where:'헤이븐 교차로 훈련장',lines:['방패가 되든 칼이 되든, 끝까지 서 있는 놈이 이긴다.','결투장은 늘 열려 있다.']},
  j2_archer:{town:'willowen',n:'순찰대장 세린',role:'궁수 전직관',where:'윌로벤 나루 망루',lines:['멀리서 한 발로 끝낼 텐가, 덫으로 기다릴 텐가.','바람 소리를 먼저 들어.']}};
const J2_SPOTS={
  altar_brenhill:{town:'brenhill',at:'예배당 제단',n:'브렌힐 성소'},altar_willowen:{town:'willowen',at:'나루 사당',n:'윌로벤 성소'},
  altar_haven:{town:'haven',at:'교차로 기도처',n:'헤이븐 성소'},altar_arden:{town:'arden',at:'대성당 제단',n:'아르덴 성소'},
  scout_plains:{region:'plains',at:'평원 북쪽 언덕',n:'황금 평원 정찰 표식'},scout_desert:{region:'desert',at:'사막 바위탑',n:'붉은 사막 정찰 표식'},
  scout_ice:{region:'ice',at:'빙원 얼음 기둥',n:'북부 빙원 정찰 표식'},scout_jungle:{region:'jungle',at:'신전 계단 위',n:'타말 정글 정찰 표식'}};
const J2_TRIAL={
  tb_archmage:{n:'네 원소의 시험관',lvl:52,hp:2050,dmg:38,spd:100,r:28,xp:1400,aggro:600,atk:1.4,col:'#b9a2ff',ranged:true,pcol:'#ffe066',draw:'elemental',sc:2,mini:1,skills:['volley','slam'],aura:'rgba(185,162,255,.3)',shiftEl:1,note:'10초마다 약한 원소가 바뀐다(그 원소로 맞으면 1.5배). 원소를 바꿔 가며 싸우라는 시험.'},
  tb_summoner:{n:'떠도는 정령왕의 그림자',lvl:52,hp:2050,dmg:35,spd:95,r:28,xp:1400,aggro:600,atk:1.5,col:'#8fd8ff',draw:'wraith',sc:2.2,mini:1,skills:['summon','volley'],summon:'i_elem',aura:'rgba(143,216,255,.3)',note:'정령을 계속 불러낸다. 내 소환수로 정령을 막으며 본체를 치는 시험.'},
  tb_inquisitor:{n:'타락한 이단 심문관',lvl:52,hp:2200,dmg:40,spd:105,r:26,xp:1400,aggro:600,atk:1.3,col:'#c0603a',ranged:true,pcol:'#ff5a2a',draw:'apostle',sc:1.8,mini:1,undead:true,skills:['volley','charge'],aura:'rgba(255,90,42,.3)',note:'혼자 싸우는 사제를 위한 시험. 공격 기도만으로 쓰러뜨려야 한다(대심문관 길).'},
  tb_archbishop:{n:'성지를 덮친 망령 군단장',lvl:52,hp:1850,dmg:37,spd:90,r:28,xp:1400,aggro:600,atk:1.5,col:'#9a9aff',draw:'wraith',sc:2,mini:1,undead:true,skills:['summon','slam'],summon:'wraith',aura:'rgba(154,154,255,.3)',escort:{n:'순례자 셋',hp:.6},note:'순례자 셋(NPC)을 지키며 버틴다. 순례자가 한 명이라도 살아 있으면 통과. 치유·보호막으로 지키는 시험(대주교 길).'},
  tb_guardian:{n:'성문 파괴자 고르둔',lvl:52,hp:2550,dmg:45,spd:90,r:30,xp:1400,aggro:600,atk:1.6,col:'#8a8478',draw:'ogre',sc:2.2,mini:1,skills:['slam','charge','summon'],summon:'l_knight',gate:{hp:.8},note:'성문(NPC)을 노린다. 도발로 보스와 졸개를 붙잡아 성문을 지키는 시험(가디언 나이트 길).'},
  tb_berserker:{n:'투기장의 챔피언 라크',lvl:52,hp:2200,dmg:44,spd:130,r:24,xp:1400,aggro:600,atk:1.1,col:'#d8242a',draw:'knight',sc:1.6,mini:1,skills:['charge','slam'],waves:3,note:'투기장 3연승: 졸개 두 무리 다음 챔피언. 쉬지 않고 이어 싸우는 시험(버서커 길).'},
  tb_hawkeye:{n:'바람 위의 괴조',lvl:52,hp:1850,dmg:38,spd:170,r:26,xp:1400,aggro:700,atk:1.2,col:'#ffd76a',ranged:true,pcol:'#ffe066',draw:'imp',alt:'elemental',sc:2,mini:1,skills:['volley','charge'],keepAway:1,note:'멀리 떨어져 날아다닌다. 먼 거리에서 맞혀야 하는 시험(호크아이 길).'},
  tb_ranger:{n:'붉은 사막의 큰 전갈왕',lvl:52,hp:2400,dmg:42,spd:150,r:28,xp:1400,aggro:600,atk:1.3,col:'#ff5a3a',draw:'scorpion',alt:'ogre',sc:2,mini:1,skills:['charge','summon'],summon:'d_scorp',trapWeak:2,note:'덫에 걸리면 2배 피해를 받고 오래 묶인다. 덫으로 사냥하는 시험(레인저 길).'}};
const J2_QUESTS=[
 // 마법사
 {id:'j2m1',cls:'mage',town:'arden',giver:'elian',lvl:50,kind:'전직',t:'위계 너머의 자격',say:'여덟 위계를 다 밟았다니, 이제야 문 앞에 섰군. 그 문을 열려면 순수한 마력이 필요하네. 잿불 용암지대의 화염 정령과 북부 빙원의 얼음 정령에게서 마력 결정을 모아 오게.',done:'맑게 빛나는군. 자네 마나는 이제 위계라는 틀이 좁아진 걸세.',
  goals:[{type:'collect',k:['l_elem','i_elem'],p:.5,n:8,item:'마력 결정',d:'화염 정령·얼음 정령에게서 마력 결정 모으기'}],rw:{xp:2,gold:5000,sp:2}},
 {id:'j2m2',cls:'mage',town:'arden',giver:'elian',req:'j2m1',lvl:50,kind:'전직',t:'불의 군주에게서',say:'용암지대 깊은 곳의 화염 군주 이프리트는 오래전 마법사들이 세운 원소의 문을 지키고 있네. 그를 쓰러뜨리고 문의 열쇠를 가져오게.',done:'이 열쇠면 두 개의 길 가운데 하나를 열 수 있지. 이제 고르게.',
  goals:[{type:'kill',k:['r_ifrit'],n:1,d:'화염 군주 이프리트 처치'}],rw:{xp:2,gold:5000,sp:2}},
 {id:'j2m3a',cls:'mage',town:'arden',giver:'elian',req:'j2m2',pick:'archmage',lvl:50,kind:'전직 · 갈래',t:'원소의 시험 (아크메이지)',say:'네 원소를 다 다룰 줄 알아야 하네. 시련의 문 너머의 시험관은 쉬지 않고 약점을 바꾸지. 원소를 바꿔 가며 쓰러뜨리게.',done:'원소가 자네 손에서 섞이는군. 오늘부터 자네는 아크메이지일세.',
  goals:[{type:'trial',boss:'tb_archmage',d:'시련의 문: 네 원소의 시험관 처치'}],rw:{xp:2,gold:5000,sp:3,job2:1,item:'j2_archmage'}},
 {id:'j2m3b',cls:'mage',town:'arden',giver:'elian',req:'j2m2',pick:'summoner',lvl:50,kind:'전직 · 갈래',t:'정령과의 계약 (서머너)',say:'정령은 힘으로 부리는 게 아니라 계약으로 부르는 걸세. 시련의 문 너머 정령왕의 그림자가 끝없이 정령을 부를 걸세. 그보다 더 잘 부려 보게.',done:'정령들이 자네 이름을 기억했네. 오늘부터 자네는 서머너일세.',
  goals:[{type:'trial',boss:'tb_summoner',d:'시련의 문: 떠도는 정령왕의 그림자 처치'}],rw:{xp:2,gold:5000,sp:3,job2:1,item:'j2_summoner'}},
 // 사제
 {id:'j2p1',cls:'priest',town:'arden',giver:'j2_priest',lvl:50,kind:'전직',t:'네 성소의 순례',say:'은총의 끝에 닿았다 하여 기도가 끝나지는 않는단다. 브렌힐, 윌로벤, 헤이븐, 그리고 이 대성당. 네 성소에서 한 번씩 기도하고 오너라.',done:'걸음마다 빛이 따라왔구나. 이제 네 앞에 길이 둘 있다.',
  goals:[{type:'use',use:'altar_brenhill',d:'브렌힐 성소에서 기도'},{type:'use',use:'altar_willowen',d:'윌로벤 성소에서 기도'},{type:'use',use:'altar_haven',d:'헤이븐 성소에서 기도'},{type:'use',use:'altar_arden',d:'아르덴 대성당에서 기도'}],rw:{xp:2,gold:5000,sp:2}},
 {id:'j2p2',cls:'priest',town:'arden',giver:'j2_priest',req:'j2p1',lvl:50,kind:'전직',t:'얼어붙은 영혼들',say:'북부 빙원의 서리 망령과 산호 군도의 익사자들은 쉬지 못한 영혼이란다. 그들을 보내 주고 오너라.',done:'잘했다. 보내 주는 손도, 지키는 손도 모두 은총이지.',
  goals:[{type:'kill',k:['i_wraith','s_drown'],n:16,d:'서리 망령·익사자 정화'}],rw:{xp:2,gold:5000,sp:2}},
 {id:'j2p3a',cls:'priest',town:'arden',giver:'j2_priest',req:'j2p2',pick:'inquisitor',lvl:50,kind:'전직 · 갈래',t:'이단 심문 (대심문관)',say:'빛을 칼로 쥐겠다면, 혼자서도 어둠을 베어 낼 수 있어야 한다. 시련의 문 너머 타락한 심문관을 심판하거라.',done:'두려움 없는 기도였다. 오늘부터 너는 대심문관이다.',
  goals:[{type:'trial',boss:'tb_inquisitor',d:'시련의 문: 타락한 이단 심문관 처치'}],rw:{xp:2,gold:5000,sp:3,job2:1,item:'j2_inquisitor'}},
 {id:'j2p3b',cls:'priest',town:'arden',giver:'j2_priest',req:'j2p2',pick:'archbishop',lvl:50,kind:'전직 · 갈래',t:'성지 수호 (대주교)',say:'빛을 등불로 들겠다면, 지켜야 할 이를 끝까지 지켜야 한다. 시련의 문 너머 순례자 셋이 망령에게 쫓기고 있다. 그들을 살려 보내거라.',done:'아무도 잃지 않았구나. 오늘부터 너는 대주교다. 성자의 자리는… 아직 조금 더 걸어야 한다.',
  goals:[{type:'trial',boss:'tb_archbishop',d:'시련의 문: 순례자를 지키며 망령 군단장 처치'}],rw:{xp:2,gold:5000,sp:3,job2:1,item:'j2_archbishop'}},
 // 전사
 {id:'j2w1',cls:'warrior',town:'haven',giver:'j2_warrior',lvl:50,kind:'전직',t:'기사의 자격',say:'기사라면 칼만 휘둘러선 안 된다. 서리 기사와 지옥 기사, 무장한 놈들을 상대로 버텨 봐라.',done:'아직 서 있군. 그거면 됐다.',
  goals:[{type:'kill',k:['i_knight'],n:12,d:'서리 기사 처치'},{type:'kill',k:['l_knight'],n:12,d:'지옥 기사 처치'}],rw:{xp:2,gold:5000,sp:2}},
 {id:'j2w2',cls:'warrior',town:'haven',giver:'j2_warrior',req:'j2w1',lvl:50,kind:'전직',t:'빙원의 군주',say:'북부 빙원의 군주 흐림니르. 그놈 앞에서 물러서지 않는다면 다음 단계를 보여 주지.',done:'좋다. 이제 방패가 될 건지 칼이 될 건지 골라라.',
  goals:[{type:'kill',k:['r_hrimnir'],n:1,d:'빙원의 군주 흐림니르 처치'}],rw:{xp:2,gold:5000,sp:2}},
 {id:'j2w3a',cls:'warrior',town:'haven',giver:'j2_warrior',req:'j2w2',pick:'guardian',lvl:50,kind:'전직 · 갈래',t:'성문 지키기 (가디언 나이트)',say:'시련의 문 너머 성문을 고르둔과 그 졸개들이 부수려 한다. 성문이 무너지면 실패다. 모두 네게 붙잡아 둬라.',done:'성문에 금 하나 안 갔군. 오늘부터 너는 가디언 나이트다.',
  goals:[{type:'trial',boss:'tb_guardian',d:'시련의 문: 성문을 지키며 고르둔 처치'}],rw:{xp:2,gold:5000,sp:3,job2:1,item:'j2_guardian'}},
 {id:'j2w3b',cls:'warrior',town:'haven',giver:'j2_warrior',req:'j2w2',pick:'berserker',lvl:50,kind:'전직 · 갈래',t:'투기장 연승 (버서커)',say:'투기장에서 쉬지 않고 세 판을 이겨라. 마지막은 챔피언 라크다.',done:'피가 끓는 게 보이는군. 오늘부터 너는 버서커다.',
  goals:[{type:'trial',boss:'tb_berserker',d:'시련의 문: 투기장 3연승'}],rw:{xp:2,gold:5000,sp:3,job2:1,item:'j2_berserker'}},
 // 궁수
 {id:'j2a1',cls:'archer',town:'willowen',giver:'j2_archer',lvl:50,kind:'전직',t:'먼 땅 정찰',say:'순찰대는 발로 지도를 그린다. 평원, 사막, 빙원, 정글에 정찰 표식을 하나씩 남기고 와.',done:'네 군데 다 다녀왔군. 발이 빠른 건 인정하지.',
  goals:[{type:'use',use:'scout_plains',d:'황금 평원에 표식'},{type:'use',use:'scout_desert',d:'붉은 사막에 표식'},{type:'use',use:'scout_ice',d:'북부 빙원에 표식'},{type:'use',use:'scout_jungle',d:'타말 정글에 표식'}],rw:{xp:2,gold:5000,sp:2}},
 {id:'j2a2',cls:'archer',town:'willowen',giver:'j2_archer',req:'j2a1',lvl:50,kind:'전직',t:'정글의 큰 사냥감',say:'타말 정글의 칼리를 잡아 와. 순찰대장이 되려면 다들 한 번은 거치는 사냥이야.',done:'깨끗하게 잡았네. 이제 네 사냥 방식을 골라.',
  goals:[{type:'kill',k:['r_kali'],n:1,d:'타말 정글의 지역 보스 칼리 처치'}],rw:{xp:2,gold:5000,sp:2}},
 {id:'j2a3a',cls:'archer',town:'willowen',giver:'j2_archer',req:'j2a2',pick:'hawkeye',lvl:50,kind:'전직 · 갈래',t:'명궁 시험 (호크아이)',say:'시련의 문 너머 괴조는 절대 가까이 오지 않아. 멀리서 맞혀 떨어뜨려.',done:'바람을 읽는 눈이야. 오늘부터 넌 호크아이다.',
  goals:[{type:'trial',boss:'tb_hawkeye',d:'시련의 문: 바람 위의 괴조 처치'}],rw:{xp:2,gold:5000,sp:3,job2:1,item:'j2_hawkeye'}},
 {id:'j2a3b',cls:'archer',town:'willowen',giver:'j2_archer',req:'j2a2',pick:'ranger',lvl:50,kind:'전직 · 갈래',t:'덫 사냥 (레인저)',say:'전갈왕은 정면으로 쏴서는 안 죽어. 덫으로 붙잡고 사냥해.',done:'기다릴 줄 아는 사냥꾼이군. 오늘부터 넌 레인저다.',
  goals:[{type:'trial',boss:'tb_ranger',d:'시련의 문: 큰 전갈왕 처치'}],rw:{xp:2,gold:5000,sp:3,job2:1,item:'j2_ranger'}}];
const CT_GIVER={
  mage:   {early:'oldman', main:'elian',      earlyNote:'노인 바르톨은 은퇴한 왕립 마법원 마법사로 설정(대사만 추가, 그림 그대로).'},
  priest: {early:'yoan',   main:'j2_priest'},
  warrior:{early:'bruno',  main:'j2_warrior'},
  archer: {early:'garret', main:'j2_archer'}};
const CT_TRIAL={
  ct_mage6:{n:'마법원 결투관의 환영',lvl:39,hp:1250,dmg:26,spd:100,r:24,xp:700,aggro:600,atk:1.4,col:'#9ab8ff',ranged:true,pcol:'#cfe0ff',draw:'wraith',sc:1.8,mini:1,skills:['volley','slam'],shiftEl:1,note:'10초마다 약한 원소가 불↔얼음으로 바뀐다(약점으로 맞으면 1.5배). 아크메이지 시험의 쉬운 판.'},
  ct_priest6:{n:'성묘를 덮친 망령 무리',lvl:39,hp:1150,dmg:24,spd:90,r:26,xp:700,aggro:600,atk:1.5,col:'#a0a0ff',draw:'wraith',sc:1.8,mini:1,undead:true,skills:['summon','slam'],summon:'wraith',escort:{n:'순례자 둘',hp:.6},note:'순례자 둘을 지키며 버틴다. 한 명이라도 살면 통과.'},
  ct_war6:{n:'훈련장 포위전',lvl:39,hp:1450,dmg:30,spd:110,r:24,xp:700,aggro:600,atk:1.2,col:'#9a948a',draw:'knight',sc:1.6,mini:1,skills:['charge','slam'],waves:2,note:'졸개 두 무리 뒤 교관 기사. 둘러싸인 채 버티는 시험.'},
  ct_arc6:{n:'바람을 타는 매',lvl:39,hp:950,dmg:24,spd:170,r:20,xp:700,aggro:700,atk:1.1,col:'#c8a86a',ranged:true,pcol:'#ffe066',draw:'imp',sc:1.7,mini:1,skills:['volley','charge'],keepAway:1,note:'멀리 떨어져 날아다닌다. 호크아이 시험의 쉬운 판.'}};
const CT_QUESTS=[
 // ===== 마법사 =====
 {id:'ctm1',cls:'mage',step:1,town:'brenhill',giver:'oldman',lvl:5,kind:'위계 시험',t:'첫 번째 말',say:'마나를 느낀다고? 허허, 나도 한때는 왕립 마법원에 있었지. 들판 가장자리에 피는 은방울풀은 새벽이슬에 마나를 잘 머금는다네. 이슬 맺힌 것으로 세 포기만 캐 오면 첫 말을 제대로 가르쳐 주지.',done:'좋아, 이슬이 자네 손에서 떨리는군. 마나가 자네를 알아본 거야.',
  goals:[{type:'gather',use:'herb',n:3,item:'이슬 맺힌 은방울풀',d:'들판 가장자리에서 이슬 맺힌 은방울풀 캐기'}],rw:{xp:.8,gold:80,item:1,badge:1}},
 {id:'ctm2',cls:'mage',step:2,town:'brenhill',giver:'oldman',req:'ctm1',lvl:10,kind:'위계 시험',t:'그릇 비우기',say:'그릇은 바닥까지 비었다가 다시 찰 때 자란다네. 은류강 둘레의 고블린 주술사와 늪 슬라임을 상대로 마나가 바닥날 때까지 싸워 보게. 그리고 아르덴의 엘리안에게 내 편지를 전하게.',done:'(엘리안) 바르톨 선생의 편지로군. 이제부터는 내가 보겠네.',
  goals:[{type:'kill',k:['goblin','slime'],n:8,d:'은류강 둘레의 고블린 주술사·늪 슬라임 처치'},{type:'talk',town:'arden',npc:'elian',item:'바르톨의 편지',d:'아르덴의 대마법사 엘리안에게 편지 전하기'}],rw:{xp:1,gold:150,sp:1,badge:2}},
 {id:'ctm3',cls:'mage',step:3,town:'arden',giver:'elian',req:'ctm2',lvl:16,kind:'위계 시험 · 소속',t:'어느 탑에 설 것인가',say:'마법사는 저마다 설 자리가 있네. 이 마법원, 서쪽 곶의 세레스, 그리고… 발케르의 붉은 탑을 떠나온 자도 있지. 세 사람을 만나 보고 고르게. 나중에 바꿀 수도 있으니 너무 겁내지 말고.',done:'좋은 선택이네. 그 망토가 잘 어울리는군.',
  goals:[{type:'pick',grp:'aff',d:'소속 대표 셋과 이야기하고 하나 고르기'}],rw:{xp:1,gold:300,badge:3}},
 {id:'ctm4',cls:'mage',step:4,town:'arden',giver:'elian',req:'ctm3',lvl:23,kind:'위계 시험',t:'잿빛 기사의 룬',say:'잿빛 기사들의 갑옷에는 대가의 술법 룬이 새겨져 있네. 거꾸로 읽은 근원어지. 그 조각을 모아 오면, 어떻게 뒤집혔는지 함께 읽어 보세.',done:'역시 거꾸로 읽은 말이군. 이걸 읽어 낸 자는 넷째 위계에 설 자격이 있네.',
  goals:[{type:'collect',k:['ashknight'],p:.4,n:6,item:'뒤집힌 룬 조각',d:'잿빛 기사에게서 룬 조각 모으기'}],rw:{xp:1.2,gold:500,sp:1,badge:4}},
 {id:'ctm5',cls:'mage',step:5,town:'arden',giver:'elian',req:'ctm4',lvl:31,kind:'위계 시험',t:'바람과 모래의 정령',say:'정령은 원소가 스스로 모습을 얻은 것이네. 평원의 폭풍 정령이든 사막의 모래 정령이든, 열두 번 맞서 보면 원소가 어떻게 숨 쉬는지 알게 될 걸세.',done:'다섯째 위계의 눈이 뜨였군.',
  goals:[{type:'kill',k:['p_storm','d_sand'],n:12,d:'폭풍 정령·모래 정령 처치'}],rw:{xp:1.5,gold:900,sp:1,badge:5}},
 {id:'ctm6',cls:'mage',step:6,town:'arden',giver:'elian',req:'ctm5',lvl:38,kind:'위계 시험',t:'두 원소의 결투',say:'여섯째 위계부터는 한 원소만으로 버티기 어렵네. 시련의 문 너머 결투관의 환영은 불과 얼음 사이를 오가지. 약한 쪽을 찾아 바꿔 가며 치게.',done:'바꾸는 손이 빨라졌군. 그게 위계일세.',
  goals:[{type:'trial',boss:'ct_mage6',d:'시련의 문: 마법원 결투관의 환영 처치'}],rw:{xp:2,gold:1500,sp:3,badge:6}},
 {id:'ctm7',cls:'mage',step:7,town:'arden',giver:'elian',req:'ctm6',lvl:45,kind:'위계 시험',t:'불 속의 영창',say:'용암지대에서 불 임프와 용암 골렘에 둘러싸여도 목소리가 흔들리지 않아야 하네. 일곱째 위계는 소란 속에서 부르는 법일세.',done:'흔들림이 없군. 여덟째 위계를 인정하네. 위계 너머의 일은… 쉰 살쯤 된 마법사에게나 할 이야기지. 자네 레벨이 쉰이 되면 다시 오게.',
  goals:[{type:'kill',k:['l_imp','l_golem'],n:14,d:'잿불 용암지대의 불 임프·용암 골렘 처치'}],rw:{xp:2.5,gold:2500,sp:4,badge:7}},

 // ===== 사제 =====
 {id:'ctp1',cls:'priest',step:1,town:'brenhill',giver:'yoan',lvl:5,kind:'위계 시험',t:'첫 기도',say:'은총은 소리 큰 기도보다 깊은 마음에 응답한단다. 동쪽 들판의 재 들개는 부정한 것이니 물리치고, 예배당 제단에서 조용히 기도하고 오너라.',done:'빛이 네 손바닥에 고였구나. 첫 기도가 닿았다.',
  goals:[{type:'kill',k:['ashhound'],n:6,d:'재 들개 물리치기'},{type:'use',use:'altar_brenhill',d:'브렌힐 예배당 제단에서 기도'}],rw:{xp:.8,gold:80,item:1,badge:1}},
 {id:'ctp2',cls:'priest',step:2,town:'brenhill',giver:'yoan',req:'ctp1',lvl:10,kind:'위계 시험',t:'물 밑의 사제',say:'은류강 수로 깊은 곳에 익사한 사제가 떠돈다는구나. 그도 한때는 우리 형제였다. 수로 깊이 내려가 그를 쉬게 해 다오. 그다음엔 아르덴 대성당의 오벨린 님께 가거라.',done:'(오벨린) 요안이 보낸 아이로구나. 이제 내가 너를 보마.',
  goals:[{type:'kill',k:['m_drowned'],n:1,d:'익사한 사제를 쉬게 하기'},{type:'talk',town:'arden',npc:'j2_priest',d:'아르덴 대성당의 노사제 오벨린 찾아가기'}],rw:{xp:1,gold:150,sp:1,badge:2}},
 {id:'ctp3',cls:'priest',step:3,town:'arden',giver:'j2_priest',req:'ctp2',lvl:16,kind:'위계 시험 · 소속',t:'어느 신의 등불을 들 것인가',say:'사제는 한 신만을 섬긴다. 여명의 아우렐, 안식의 모르딘, 바다와 운명의 넬라. 세 분을 섬기는 이들을 만나 보고 마음이 가는 곳을 고르거라.',done:'서품을 받았구나. 네 성표에 은총이 깃들었다.',
  goals:[{type:'pick',grp:'aff',d:'세 교단의 사제와 이야기하고 하나 고르기'}],rw:{xp:1,gold:300,badge:3}},
 {id:'ctp4',cls:'priest',step:4,town:'arden',giver:'j2_priest',req:'ctp3',lvl:23,kind:'위계 시험',t:'재의 행렬',say:'재의 성소 둘레에 재의 사도를 흉내 내는 자들이 무리를 지었다. 넷째 단계는 여러 기도를 겹쳐 올리는 법이다. 그 무리 여덟을 정화하고 오너라.',done:'기도가 겹쳐 울리는구나. 은총 넷째 단계다.',
  goals:[{type:'kill',k:['apostle'],n:8,d:'재의 사도 무리 정화'}],rw:{xp:1.2,gold:500,sp:1,badge:4}},
 {id:'ctp5',cls:'priest',step:5,town:'arden',giver:'j2_priest',req:'ctp4',lvl:31,kind:'위계 시험',t:'모래 속의 잠',say:'붉은 사막의 모래 미라와 무덤가를 떠도는 잿빛 병사들은 장례를 받지 못한 자들이다. 다섯째 단계는 여럿의 믿음을 모으는 성가다. 그들을 보내며 불러 보거라.',done:'성가가 사막까지 닿았구나.',
  goals:[{type:'kill',k:['d_mummy','ashsoldier'],n:12,d:'모래 미라·잿빛 병사에게 안식 주기'}],rw:{xp:1.5,gold:900,sp:1,badge:5}},
 {id:'ctp6',cls:'priest',step:6,town:'arden',giver:'j2_priest',req:'ctp5',lvl:38,kind:'위계 시험',t:'성묘 지키기',say:'여섯째 단계는 여러 사람, 넓은 자리를 위한 기도다. 시련의 문 너머 순례자 둘이 망령에게 쫓기고 있다. 지키며 버티거라.',done:'아무도 놓지 않았구나. 여섯째 단계다.',
  goals:[{type:'trial',boss:'ct_priest6',d:'시련의 문: 순례자 둘을 지키며 망령 무리 물리치기'}],rw:{xp:2,gold:1500,sp:3,badge:6}},
 {id:'ctp7',cls:'priest',step:7,town:'arden',giver:'j2_priest',req:'ctp6',lvl:45,kind:'위계 시험',t:'신전의 저주',say:'타말 정글의 옛 신전에 저주가 고였다. 도마뱀 주술사들이 그 저주로 석상을 깨운다. 일곱째 단계는 한 지방을 위한 기적이다. 그 땅을 정화하고 오너라.',done:'저주가 걷혔구나. 은총 여덟째 단계까지 왔다. 이제 오벨린이 마지막 길을 알려 줄 것이다.',
  goals:[{type:'kill',k:['j_lizard','j_golem'],n:14,d:'도마뱀 주술사·저주받은 신전 수호석상 정화'}],rw:{xp:2.5,gold:2500,sp:4,badge:7}},

 // ===== 전사 =====
 {id:'ctw1',cls:'warrior',step:1,town:'brenhill',giver:'bruno',lvl:5,kind:'위계 시험',t:'첫 방패',say:'칼을 휘두르는 건 누구나 한다. 오래 서 있는 게 어렵지. 안개숲 고분의 늑대 우두머리 잿빛 이빨은 새끼들을 불러 둘러싼다. 쓰러지지 말고 그놈을 꺾어 봐라.',done:'끝까지 서 있었군. 좋아, 첫 방패다.',
  goals:[{type:'kill',k:['m_wolfking'],n:1,d:'안개숲 고분의 늑대 우두머리 잿빛 이빨 처치'}],rw:{xp:.8,gold:80,item:1,badge:1}},
 {id:'ctw2',cls:'warrior',step:2,town:'brenhill',giver:'bruno',req:'ctw1',lvl:10,kind:'위계 시험',t:'훈련장 입문',say:'수로 길목을 고블린과 늪 슬라임이 막는다더군. 여덟 놈만 쫓아내고, 헤이븐 교차로 훈련장의 브로딘 교관을 찾아가라. 내 이름을 대면 받아 줄 거다.',done:'(브로딘) 브루노가 보냈다고? 그 녀석 눈은 믿을 만하지. 들어와라.',
  goals:[{type:'kill',k:['goblin','slime'],n:8,d:'수로 길목의 고블린 주술사·늪 슬라임 쫓아내기'},{type:'talk',town:'haven',npc:'j2_warrior',d:'헤이븐 훈련장의 교관 브로딘 찾아가기'}],rw:{xp:1,gold:150,sp:1,badge:2}},
 {id:'ctw3',cls:'warrior',step:3,town:'haven',giver:'j2_warrior',req:'ctw2',lvl:16,kind:'위계 시험 · 소속',t:'누구의 깃발 아래',say:'싸우는 자는 깃발이 있어야 한다. 에르난 기사단, 발카르의 강철 사제단, 카즈둔 드워프 대장간. 셋 다 만나 보고 골라라.',done:'좋아, 이제 종자다. 그 색을 부끄럽게 하지 마라.',
  goals:[{type:'pick',grp:'aff',d:'세 깃발의 대표와 이야기하고 하나 고르기'}],rw:{xp:1,gold:300,badge:3}},
 {id:'ctw4',cls:'warrior',step:4,town:'haven',giver:'j2_warrior',req:'ctw3',lvl:23,kind:'위계 시험',t:'배신자의 칼',say:'잿빛 요새의 헤르딘은 원래 우리 기사단이었다. 요새 안에서 그 녀석과 맞서 봐라. 정식 병사가 되려면 배신자의 칼 정도는 받아 내야 한다.',done:'헤르딘의 칼을 받아 냈군. 정식 병사다.',
  goals:[{type:'kill',k:['m_herdin'],n:1,d:'잿빛 요새의 배신자 헤르딘 처치'}],rw:{xp:1.2,gold:500,sp:1,badge:4}},
 {id:'ctw5',cls:'warrior',step:5,town:'haven',giver:'j2_warrior',req:'ctw4',lvl:31,kind:'위계 시험',t:'사막의 집게',say:'붉은 전갈 집게는 방패도 찢고, 모래 미라는 한번 붙잡으면 놓지 않는다. 합쳐서 열다섯. 막을 건 막고, 피할 건 피해라.',done:'방패에 흠집은 났어도 구멍은 없군. 고참이다.',
  goals:[{type:'kill',k:['d_scorp','d_mummy'],n:15,d:'붉은 전갈·모래 미라 처치'}],rw:{xp:1.5,gold:900,sp:1,badge:5}},
 {id:'ctw6',cls:'warrior',step:6,town:'haven',giver:'j2_warrior',req:'ctw5',lvl:38,kind:'위계 시험',t:'포위전',say:'부대장은 둘러싸여도 무너지지 않아야 한다. 시련의 문 너머에서 졸개 두 무리와 교관 기사가 한꺼번에 덤빈다. 버텨라.',done:'부대장이다. 네 뒤에 선 놈들은 안심하겠군.',
  goals:[{type:'trial',boss:'ct_war6',d:'시련의 문: 훈련장 포위전 버티기'}],rw:{xp:2,gold:1500,sp:3,badge:6}},
 {id:'ctw7',cls:'warrior',step:7,town:'haven',giver:'j2_warrior',req:'ctw6',lvl:45,kind:'위계 시험',t:'바위를 부수는 팔',say:'용암 골렘은 칼로 베는 게 아니라 부수는 거다. 불 임프는 그 틈을 노리지. 합쳐서 열두 놈. 기사 후보라면 그 정도 팔심은 있어야지.',done:'팔이 아직 붙어 있군. 기사 후보다. 서임은 쉰 레벨이 되면, 방패가 될지 칼이 될지 정할 때 하자.',
  goals:[{type:'kill',k:['l_golem','l_imp'],n:12,d:'용암 골렘·불 임프 부수기'}],rw:{xp:2.5,gold:2500,sp:4,badge:7}},

 // ===== 궁수 =====
 {id:'cta1',cls:'archer',step:1,town:'brenhill',giver:'garret',lvl:5,kind:'위계 시험',t:'첫 사냥',say:'좋은 사냥꾼은 가죽을 망치지 않지. 늑대 가죽 여섯 장, 흠 없는 걸로. 몸통 말고 눈을 노려 봐.',done:'깨끗하군. 이 정도면 첫 사냥으로 쳐 주지.',
  goals:[{type:'collect',k:['wolf'],p:.5,n:6,item:'흠 없는 늑대 가죽',d:'회색 늑대에게서 가죽 모으기'}],rw:{xp:.8,gold:80,item:1,badge:1}},
 {id:'cta2',cls:'archer',step:2,town:'brenhill',giver:'garret',req:'cta1',lvl:10,kind:'위계 시험',t:'망루의 눈',say:'수로 쪽 고블린 주술사와 늪 슬라임이 몰려다닌다더군. 여덟을 멀리서 떨구고, 윌로벤 망루의 세린 대장에게 보고해. 순찰대가 쓸 만한 눈을 찾고 있거든.',done:'(세린) 가렛이 보낸 몰이꾼이군. 눈이 좋다고 들었어.',
  goals:[{type:'kill',k:['goblin','slime'],n:8,d:'고블린 주술사·늪 슬라임 처치'},{type:'talk',town:'willowen',npc:'j2_archer',d:'윌로벤 망루의 순찰대장 세린에게 보고'}],rw:{xp:1,gold:150,sp:1,badge:2}},
 {id:'cta3',cls:'archer',step:3,town:'willowen',giver:'j2_archer',req:'cta2',lvl:16,kind:'위계 시험 · 소속',t:'누구와 함께 쏠 것인가',say:'활 쏘는 법은 하나가 아니야. 우리 순찰대, 초원의 켄타우로스, 숲의 엘프 노래꾼. 셋 다 만나 보고 골라.',done:'정찰병이 됐군. 그 색 망토는 멀리서도 알아보겠어.',
  goals:[{type:'pick',grp:'aff',d:'세 무리의 대표와 이야기하고 하나 고르기'}],rw:{xp:1,gold:300,badge:3}},
 {id:'cta4',cls:'archer',step:4,town:'willowen',giver:'j2_archer',req:'cta3',lvl:23,kind:'위계 시험',t:'평원의 우두머리',say:'황금 평원의 초원 늑대 우두머리들은 무리를 이끌고 다니지. 우두머리 열 마리를 무리에 들키기 전에 떨궈.',done:'무리가 흩어졌군. 사수다.',
  goals:[{type:'kill',k:['p_wolf'],n:10,d:'초원 늑대 우두머리 처치'}],rw:{xp:1.2,gold:500,sp:1,badge:4}},
 {id:'cta5',cls:'archer',step:5,town:'willowen',giver:'j2_archer',req:'cta4',lvl:31,kind:'위계 시험',t:'고목 숲의 늑대인간',say:'고목의 숲 늑대인간은 나무 사이로 빠르게 다가오고, 타락한 숲 정령은 나무인 척 서 있어. 다가오기 전에 맞혀야 해. 합쳐서 열.',done:'숲에서 길을 잃지 않았군. 숙련 사수다.',
  goals:[{type:'kill',k:['f_were','f_dryad'],n:10,d:'늑대인간·타락한 숲 정령 처치'}],rw:{xp:1.5,gold:900,sp:1,badge:5}},
 {id:'cta6',cls:'archer',step:6,town:'willowen',giver:'j2_archer',req:'cta5',lvl:38,kind:'위계 시험',t:'바람 위의 표적',say:'추적자는 보이지 않는 걸 쫓아. 정글의 그림자 표범 열두 마리를 잡고, 시련의 문 너머 바람을 타는 매를 떨궈.',done:'바람까지 읽었군. 추적자다.',
  goals:[{type:'kill',k:['j_panther'],n:12,d:'그림자 표범 처치'},{type:'trial',boss:'ct_arc6',d:'시련의 문: 바람을 타는 매 떨구기'}],rw:{xp:2,gold:1500,sp:3,badge:6}},
 {id:'cta7',cls:'archer',step:7,town:'willowen',giver:'j2_archer',req:'cta6',lvl:45,kind:'위계 시험',t:'불씨 떨구기',say:'불 임프는 작고 빠르고, 용암 골렘은 단단해. 둘 다 합쳐 열다섯. 화살 낭비하지 말고.',done:'화살통이 덜 비었군. 명궁 후보다. 쉰 레벨이 되면 멀리 쏠지 덫을 놓을지 정하러 와.',
  goals:[{type:'kill',k:['l_imp','l_golem'],n:15,d:'불 임프·용암 골렘 떨구기'}],rw:{xp:2.5,gold:2500,sp:4,badge:7}},
];

/* ===== 1) 데이터 손질: 전직관 · 시련 보스 · 의뢰 ===== */
const J2_INSTR={elian:'mage',j2_priest:'priest',j2_warrior:'warrior',j2_archer:'archer'};
const J2_FOLK_L={
  elian:{body:'#3a2a6a',cape:'#1e1440',hair:'#e8e4dc',hs:3,hat:5,hatC:'#2a1a5a',prop:'staff',gem:'#d8c8ff'},
  j2_priest:{body:'#f0ead8',legs:'#d8ccb0',cape:'#c8a040',hair:'#e8e4dc',hs:0,hat:7,hatC:'#f0ead8',prop:'book',dress:1},
  j2_warrior:{armor:1,body:'#9a9aa4',legs:'#4a4a52',tabard:'#2a3a6a',hair:'#3a2a1a',hs:3,hat:4,prop:'sword'},
  j2_archer:{body:'#3e5a32',legs:'#3a3020',cape:'#2e4a26',hair:'#c86a3a',hs:4,hat:3,hatC:'#3e5a32',prop:'spear'}};
for(const id in J2_NPC){const N=J2_NPC[id];TWFOLK[id]={n:N.n,role:N.role,L:J2_FOLK_L[id],lines:N.lines.slice()};if(id==='elian')TWFOLK[id].room=[-170,110]}
// 시련 보스: 생명력 ×0.85 · 피해 ×0.87 (혼자서도 깰 수 있게), 레벨은 고정(52 · 위계 시험 39)
for(const T of [J2_TRIAL,CT_TRIAL])for(const k in T){const t=Object.assign({},T[k]);t.hp=Math.round(t.hp*.85);t.dmg=Math.round(t.dmg*.87*10)/10;t.min=t.lvl;t.trial=1;TYPES[k]=t}
TYPES.tb_archbishop.escort.cnt=3;TYPES.ct_priest6.escort.cnt=2;
// 위계 시험 3번(16레벨): 소속 고르기 대신 평범한 목표
const J2_STEP3={
  ctm3:{t:'그을린 주문서',say:'잿빛 병사들이 품에 지닌 주문서 조각은 대가의 술법을 흉내 낸 것이네. 여섯 장 모아 마법원의 오스윈 교수에게 먼저 보여 주게. 셋째 위계는 남의 주문을 읽어 내는 눈에서 시작하지.',done:'오스윈이 자네 눈이 좋다더군. 셋째 위계를 인정하네.',
    goals:[{type:'collect',k:['ashsoldier'],p:.4,n:6,item:'그을린 주문서 조각',d:'잿빛 병사에게서 그을린 주문서 조각 모으기'},{type:'talk',town:'arden',npc:'oswin',item:'그을린 주문서 조각',d:'마법원의 오스윈 교수에게 조각 보여 주기'}]},
  ctp3:{t:'잿빛 병사의 안식',say:'잿빛 요새의 병사들은 죽어서도 갑옷을 벗지 못했다. 열을 쉬게 하고, 이 도시의 성소에서 그들을 위해 기도하거라.',done:'기도가 닿았구나. 은총 셋째 단계, 서품을 받거라.',
    goals:[{type:'kill',k:['ashsoldier'],n:10,d:'잿빛 병사 정화'},{type:'use',use:'altar_arden',d:'아르덴 성소에서 기도'}]},
  ctw3:{t:'잿빛 기사와의 대련',say:'종자는 칼보다 버티는 법을 먼저 배운다. 잿빛 기사 여섯을 상대하고 돌아와라. 넘어져도 다시 일어서면 된다.',done:'숨이 차도 서 있군. 좋아, 이제 종자다.',
    goals:[{type:'kill',k:['ashknight'],n:6,d:'잿빛 기사 처치'}]},
  cta3:{t:'요새 정찰',say:'정찰병은 적의 수를 세고 돌아오는 사람이야. 잿빛 요새 둘레의 잿빛 병사 열둘을 소리 없이 떨궈.',done:'다 세고 돌아왔군. 정찰병이다.',
    goals:[{type:'kill',k:['ashsoldier'],n:12,d:'잿빛 병사 처치'}]}};
const J2_TALKITEM={ctp2:'요안의 소개 편지',ctw2:'브루노의 추천장',cta2:'가렛의 쪽지'};
for(const q of CT_QUESTS){const r=J2_STEP3[q.id];if(r)Object.assign(q,r,{kind:'위계 시험'});
  if(q.step===2){q.turn=CT_GIVER[q.cls].main;for(const g of q.goals)if(g.type==='talk'&&!g.item)g.item=J2_TALKITEM[q.id]||'소개 편지'}}
for(const q of J2_QUESTS){q.j2q=1;if(typeof q.rw.item==='string'){q.rw.uniq=q.rw.item;delete q.rw.item}}
SQ.push(...CT_QUESTS,...J2_QUESTS);for(const q of [...CT_QUESTS,...J2_QUESTS])SQBY[q.id]=q;
const j2IsMine=q=>!!(q&&(q.step||q.j2q));
const j2PickKey=q=>q.pick?q.id.replace(/[ab]$/,''):q.id;// 갈래 시험(a/b)은 점수를 한 번만
const J2_SP_ALL=(()=>{const o={};for(const c of ['mage','priest','warrior','archer']){let n=0;const seen=new Set();for(const q of [...CT_QUESTS,...J2_QUESTS]){if(q.cls!==c||!q.rw.sp)continue;const k=j2PickKey(q);if(seen.has(k))continue;seen.add(k);n+=q.rw.sp}o[c]=n}return o})();

/* ===== 2) 마을에 세우기: 전직관 넷 · 기도처 · 정찰 표식 ===== */
const J2SPOT={};
function j2FindSpot(L,t,x0,y0,maxR){const Pt=wxTownParts(L,t),others=[...Pt.folk.map(f=>({x:f.hx,y:f.hy})),...(Pt.npcD?[{x:Pt.npcD.x,y:Pt.npcD.y}]:[])];
  const lim={bld:WXT.bld+10,door:WXT.door+10,prop:1,npc:WXT.npc+14},Q={...Pt,props:Pt.props.map(p=>p)};
  const good=(x,y)=>Math.hypot(x-t.x,y-t.y)<540&&wxSpotOk(Q,x,y,null,others,lim)&&Q.props.every(p=>Math.hypot(p.x-x,p.y-y)>=44);
  if(good(x0,y0))return{x:x0,y:y0};
  for(let r=12;r<=maxR;r+=12){const n=Math.max(8,Math.round(r*6.283/16));for(let i=0;i<n;i++){const a=i/n*6.283,x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r;if(good(x,y))return{x,y}}}return null}
{const T=id=>HOME.towns.find(t=>t.id===id);
  const PLACE={j2_priest:['arden',-170,-250],j2_warrior:['haven',-250,-140],j2_archer:['willowen',250,-60]};
  for(const id in PLACE){const [tid,dx,dy]=PLACE[id],t=T(tid);if(!t)continue;const p=j2FindSpot(HOME,t,t.x+dx,t.y+dy,320)||{x:t.x+dx,y:t.y+dy};const d=twFolkObj(id,t,p.x,p.y);if(d)HOME.decor.push(d)}
  {const t=T('arden');if(t)twFolkObj('elian',t,t.x,t.y,'arden_academy')}
  // 기도처 (의뢰 중일 때만 보이는 제단)
  const ALT={altar_willowen:['willowen',-120,-230],altar_haven:['haven',-60,-260],altar_arden:['arden',-260,-170]};
  for(const id in ALT){const [tid,dx,dy]=ALT[id],t=T(tid);if(!t)continue;const p=j2FindSpot(HOME,t,t.x+dx,t.y+dy,320)||{x:t.x+dx,y:t.y+dy};
    HOME.decor.push({x:p.x,y:p.y,k:'altar',pv:0,use:id,qonly:1,tprop:1,s:1,v:0,zl:0});J2SPOT[id]={reg:'home',x:p.x,y:p.y,label:`${t.n} · ${J2_SPOTS[id].at}`}}
  // 브렌힐 예배당 안 제단
  {const B=T('brenhill'),it=TWROOM.bren_chapel.items.find(i=>i[0]==='altar');if(B&&it){it[3]=it[3]|0;it[4]=it[4]|0;it[5]='altar_brenhill';const b=(TW.blds.home||[]).find(b=>b.enter==='bren_chapel');
    J2SPOT.altar_brenhill={reg:'home',x:B.x+it[1],y:B.y+it[2],room:'bren_chapel',door:b?b.door:null,label:'브렌힐 예배당 안 · 제단'}}}
  if(REG.id==='home'&&!IN)setArr(decor,HOME.decor)}
// 정찰 표식: 지역 마을과 지역 보스 둥지 사이, 걸어서 닿는 마른 땅
for(const id of ['scout_plains','scout_desert','scout_ice','scout_jungle']){const reg=J2_SPOTS[id].region,L=RCACHE[reg];if(!L||!L.town)continue;const T=L.town,lx=L.lair?L.lair.x:T.x+900,ly=L.lair?L.lair.y:T.y+900;
  const ok=L.lq?(L.okT||(L.okT=wxReach(L.lq,T.x,T.y))):null,dx=lx-T.x,dy=ly-T.y,l=Math.hypot(dx,dy)||1;let p=null;
  for(const f of [.4,.35,.45,.3,.5,.25,.55])for(const o of [0,120,-120,240,-240]){if(p)break;const x=T.x+dx*f-dy/l*o,y=T.y+dy*f+dx/l*o;if(x<60||y<60||x>WORLD-60||y>WORLD-60)continue;
    if(!wxLiq(L,x,y)&&(!ok||wxCanReach(ok,x,y))&&!L.decor.some(d=>Math.abs(d.x-x)<46&&Math.abs(d.y-y)<46))p={x,y}}
  if(!p)p={x:T.x+dx*.3,y:T.y+dy*.3};
  L.decor.push({x:p.x,y:p.y,k:'banner',pv:0,use:id,qonly:1,tprop:1,s:1,v:0,zl:0});J2SPOT[id]={reg,x:p.x,y:p.y,label:`${REGIONS[reg].n} · ${J2_SPOTS[id].at}`};if(REG.id===reg&&!IN&&!DG)setArr(decor,L.decor)}

/* ===== 3) 의뢰 창 · 일지 · 목표 표시 ===== */
const j2Q=()=>P.qsp&&typeof P.qsp==='object'&&!Array.isArray(P.qsp)?P.qsp:(P.qsp={});
{const _a=sqAvail;sqAvail=function(q){if(!j2IsMine(q))return _a(q);if(q.cls!==P.cls)return 'hidden';const s=sqState();
  if(q.j2q&&P.job2&&!s.a[q.id]&&!s.d[q.id])return 'hidden';
  if(q.pick&&!s.a[q.id]&&!s.d[q.id]&&SQ.some(o=>o.pick&&o!==q&&o.cls===q.cls&&o.req===q.req&&(s.a[o.id]||s.d[o.id])))return 'hidden';// 갈래 시험은 둘 중 하나만
  const v=_a(q);if(v==='ok'&&P.lvl<q.lvl)return 'low';return v}}
function j2NpcAt(id){const f=sqFolk(id);if(!f)return null;
  if(f.room){const b=(TW.blds.home||[]).find(b=>b.enter===f.room),o=TWFOLK[id].room||[0,0];return{reg:'home',x:f.town.x+o[0],y:f.town.y+o[1],room:f.room,door:b?b.door:null,label:`${f.town.n} ${TWROOM[f.room].n} 안 · ${f.n}`}}
  return{reg:f.town.reg||'home',x:f.hx,y:f.hy,label:`${f.town.n} · ${f.n}`}}
{const _t=sqTarget;sqTarget=function(q){if(!j2IsMine(q))return _t(q);const a=sqState().a[q.id];if(!a||sqAllDone(q))return _t(q);
  for(let j=0;j<q.goals.length;j++){if(sqGoalDone(q,j))continue;const g=q.goals[j];
    if(g.type==='trial'){const t=j2NpcAt(q.giver);return t?Object.assign({},t,{label:`${t.label} · 시련의 문`}):null}
    if(g.type==='use'&&J2SPOT[g.use])return J2SPOT[g.use];break}
  return _t(q)}}
{const _l=sqUseLive;sqUseLive=function(d){if(!d||!J2_SPOTS[d.use])return _l(d);const h=sqUseQ(d.use);if(!h)return null;const sc=d.use.startsWith('scout');
  return{label:sc?`${J2_SPOTS[d.use].n} 남기기`:`${J2_SPOTS[d.use].n}에서 기도하기`,col:sc?'#9fe39a':'#ffe39a',q:1}}}
{const _u=sqUse;sqUse=function(d){if(!d||!J2_SPOTS[d.use])return _u(d);const h=sqUseQ(d.use);if(!h)return;const sc=d.use.startsWith('scout');
  rings.push({x:d.x,y:d.y,r:8,max:sc?90:140,life:.8,col:sc?'#9fe39a':'#ffe39a'});burst(d.x,d.y,sc?'#9fe39a':'#ffe39a',18,100,3,30);
  msg(sc?`${J2_SPOTS[d.use].n}을(를) 남겼습니다`:`${J2_SPOTS[d.use].n}에서 기도했습니다`,'#9fe0ff');sqProgress(h.q,h.j,1,true)}}
// 보상: 스킬 점수(한 번만) · 인증 · 2차 전직 · 갈래 장비
{const _r=sqRwHtml;sqRwHtml=function(q){let h=_r(q);if(!j2IsMine(q))return h;const r=q.rw,a=[];
  if(r.sp)a.push(j2Q()[j2PickKey(q)]?`<span class="muted">스킬 포인트 +${r.sp} (이미 받음)</span>`:`<b style="color:#ffd76a">스킬 포인트 +${r.sp}</b>`);
  if(r.badge&&TRIAL_BADGE[q.cls])a.push(`<b style="color:#c9b4ff">인증 「${TRIAL_BADGE[q.cls][r.badge]}」</b>`);
  if(r.job2&&q.pick)a.push(`<b style="color:#ffd76a">2차 전직 「${JOB2[q.cls][q.pick].n}」</b>`);
  if(r.uniq&&J2U[r.uniq])a.push(`<b style="color:${RAR[4].c}">갈래 장비 「${J2U[r.uniq].n}」</b>`);
  return a.length?h.replace(/<\/p>$/,` · ${a.join(' · ')}</p>`):h}}
{const _f=sqFinish;sqFinish=function(id){const q=SQBY[id];if(!j2IsMine(q))return _f(id);const s=sqState(),n0=s.d[id]|0;_f(id);if((s.d[id]|0)<=n0)return;j2Reward(q)}}
function j2Reward(q){const r=q.rw,Q=j2Q(),ex=[];
  if(r.sp){const k=j2PickKey(q);if(!Q[k]){Q[k]=1;P.sp+=r.sp;ex.push(`스킬 포인트 +${r.sp}`);msg(`의뢰 보상: 스킬 포인트 +${r.sp} (스킬 트리 T)`,'#ffd76a')}}
  if(q.step){const b0=P.trial|0;P.trial=Math.max(b0,q.step);if(P.trial>b0&&TRIAL_BADGE[P.cls]){const b=TRIAL_BADGE[P.cls][P.trial];if(b){ex.push(`인증 「${b}」`);msg(`위계 시험 통과: ${b}`,'#c9b4ff')}}}
  if(r.uniq)j2GiveUniq(r.uniq);
  if(r.job2&&q.pick&&!P.job2)j2Advance(q.pick);
  else if(banner&&ex.length)banner.sub+=' · '+ex.join(' · ');
  j2Mirror();updateHud();save()}
function j2Advance(br){const J=JOB2[P.cls]&&JOB2[P.cls][br];if(!J)return;P.job2=br;P._job2raw=null;J2UI.tab='j2';
  banner={t:`2차 전직 · ${J.n}`,sub:`스킬 트리(T)에 「${J.tree}」 갈래와 「상위 기술」이 열렸습니다`,col:'#ffd76a',life:3.6,max:3.6};flash={col:'#ffd76a',a:.25};
  rings.push({x:P.x,y:P.y,r:10,max:220,life:1,col:'#ffd76a'});rings.push({x:P.x,y:P.y,r:10,max:140,life:.8,col:'#fff2c0'});burst(P.x,P.y,'#ffd76a',60,220,3.5,30);
  msg(`2차 전직: 이제 ${J.n}입니다. ${J.desc}`,'#ffd76a');msg('스킬 트리(T)의 갈래 탭에서 새 기술을 찍으세요 (레벨 50부터)','#ffd76a');buildBar()}
// 이름표 · 일지: 위계 시험 · 전직 의뢰는 따로 표시 (메인은 주황 그대로)
const J2TAG={t:'<i class="qtg t">시험</i>',j:'<i class="qtg j">전직</i>'};
{const st=document.createElement('style');st.textContent='.qtg.t{background:#8a6aff;color:#fff}.qtg.j{background:#e0508a;color:#fff}'+
  '.j2adv{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;margin:6px 0 10px}.j2row{display:flex;align-items:center;gap:8px;padding:4px 6px;border:1px solid #3a3226;border-radius:6px;background:#15120e;color:inherit;text-align:left;font:inherit;cursor:pointer;min-width:0;position:relative}'+
  '.j2row svg{width:34px;height:34px;flex:none}.j2row[aria-pressed="true"]{border-color:#c9a24a;background:#221b12}.j2row.can{border-color:#6a9a4a}.j2row.lk{opacity:.55}.j2row .nl{position:absolute;left:30px;top:26px;font-size:10px;background:#000a;color:#ffd76a;border-radius:3px;padding:0 3px}.j2row b{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.j2row small{display:block;color:#a39d8f;font-size:10px}.j2row .ptb{display:inline-block;font-size:9px;line-height:1;padding:1px 3px;border-radius:3px;border:1px solid #5a4a36;background:#262019;color:#c8b88a}.j2row .ptb.p{background:#14301c;color:#9fe39a;border-color:#3f7a46}.j2row .ptb.o{background:#2c2410;color:#ffd76a;border-color:#8a7030}'+
  '.treetabs button.j2t{border-color:#8a6a2a}.treetabs button.j2t.lk{opacity:.6}.treetabs button.j2b{border-color:#c9a24a;color:#ffd76a}.j2note{margin:4px 0}.j2swap{border:1px solid #4a3e2a;border-radius:6px;padding:6px 8px;margin:8px 0}';document.head.appendChild(st)}
const j2Tag=q=>q.j2q?J2TAG.j:J2TAG.t;
{const _s=sqHudBlocks;sqHudBlocks=function(){const o=_s(),s=sqState();for(const b of o)for(const id in s.a){const q=SQBY[id];if(j2IsMine(q)&&b.t===WXTAG.s+q.t){b.t=j2Tag(q)+q.t;break}}return o}}
{const _l=sqLogHtml;sqLogHtml=function(){let h=_l();for(const q of SQ){if(!j2IsMine(q)||q.cls!==P.cls)continue;h=h.split(`<b>${WXTAG.s}${q.t}</b>`).join(`<b>${j2Tag(q)}${q.t}</b>`).split(`! <b>${q.t}</b>`).join(`! <b>${j2Tag(q)}${q.t}</b>`)}
  const s=sqState(),Q=j2Q(),C=CLASSES[P.cls],tr=CT_QUESTS.filter(q=>q.cls===P.cls);let got=0;for(const k in Q){const q=SQBY[k]||SQBY[k+'a'];if(q&&q.cls===P.cls&&q.rw.sp)got+=q.rw.sp}
  h+=`<h2>${J2TAG.t}위계 시험 · ${J2TAG.j}2차 전직</h2><p class="muted">인증 ${P.trial|0}/7${trialBadge()?` · 「${trialBadge()}」`:''} · 의뢰로 받은 스킬 포인트 ${got}/${J2_SP_ALL[P.cls]||0} (1막·2막 몫은 따로)${P.job2?` · 2차 전직 「${JOB2[P.cls][P.job2].n}」`:` · 2차 전직은 레벨 ${J2LV}부터`}</p><ul class="qgoals">`+
    tr.map(q=>{const d=s.d[q.id]>0,a=!!s.a[q.id],g=sqFolk(q.giver);return `<li class="${d?'ok':''}">${d?'✓':a?'…':'○'} ${q.step}. ${q.t} <span class="muted">레벨 ${q.lvl} · ${g?g.n:''}${q.rw.sp?` · 스킬 포인트 ${q.rw.sp}`:''}</span></li>`}).join('')+'</ul>';void C;return h}}
// 전직관: 시련의 문 · 갈래 바꾸기
{const _st=sqTalk;sqTalk=function(f){const r=_st(f);if(r||!f||J2_INSTR[f.id]!==P.cls||!P.job2)return r;SQV.mode='npc';SQV.npc=f;qTown=f.town||qTown;openPanel('quest');return true}}
{const _nh=sqNpcHtml;sqNpcHtml=function(){let h=_nh();const f=SQV.npc;if(!f||J2_INSTR[f.id]!==P.cls)return h;const s=sqState();
  for(const id in s.a){const q=SQBY[id];if(!q||q.giver!==f.id)continue;const g=j2TrialGoal(id);if(!g)continue;const t=TYPES[g.g.boss];
    h+=`<div class="j2swap"><b>시련의 문</b> <span class="muted">· ${t.n} · 레벨 ${t.lvl}</span><p class="muted" style="margin:4px 0">${t.note}${NET.on?' · 같이 하기 중에는 들어갈 수 없습니다':''}</p><div class="row"><button class="primary" type="button" data-j2trial="${id}">시련의 문으로 들어가기</button></div></div>`}
  if(P.job2&&JOB2[P.cls]){const J=JOB2[P.cls],cur=J[P.job2],price=job2SwapPrice();
    h+=`<div class="j2swap"><b>지금 갈래: ${cur.n}</b> <span class="muted">(${cur.tree})</span><p class="muted" style="margin:4px 0">갈래를 바꾸면 2차 전직 기술에 찍은 점수를 모두 돌려받습니다. 금화 ${price.toLocaleString()}</p><div class="row">`;
    for(const br in J){if(br===P.job2)continue;const ask=J2UI.swapAsk===br;h+=ask?`<button class="primary" type="button" data-j2swapok="${br}" ${P.gold<price?'disabled':''}>정말 「${J[br].n}」(으)로 바꾸기</button><button class="ghost" type="button" data-j2swap="">그만두기</button>`:`<button class="ghost" type="button" data-j2swap="${br}">「${J[br].n}」(으)로 바꾸기</button>`}
    h+='</div></div>'}
  return h}}
{const _qc=questClick;questClick=function(b){const d=b.dataset;
  if(d.j2trial){j2TrialEnter(d.j2trial);return true}
  if(d.j2swap!=null){J2UI.swapAsk=d.j2swap||null;renderPanel();return true}
  if(d.j2swapok){job2Swap(d.j2swapok);J2UI.swapAsk=null;renderPanel();return true}
  if(d.j2tab){J2UI.tab=d.j2tab==='x'?null:d.j2tab;nodeSel=null;renderPanel();return true}
  if(d.tree)J2UI.tab=null;
  return _qc(b)}}

/* ===== 4) 시련의 문: 방 하나 + 보스 (혼자) ===== */
function j2TrialGoal(qid){const q=SQBY[qid];if(!q||!sqState().a[qid])return null;for(let j=0;j<q.goals.length;j++){const g=q.goals[j];if(g.type==='trial'&&!sqGoalDone(q,j))return{q,j,g}}return null}
const J2_PIL_L={key:'j2pil',body:'#c8b8a0',cape:'#6a5a4a',hair:'#d8c090',hs:1,hat:3,hatC:'#8a7a6a',prop:'staff',gem:'#ffe39a',dress:1};
function j2TrialEnter(qid){const h=j2TrialGoal(qid);if(!h)return false;
  if(NET.on){msg('시련의 문은 혼자 들어가는 곳입니다. 같이 하기를 끝내고 들어오세요','#a39d8f');return false}
  if(DG||P.dead)return false;
  if(!panel.hidden)closePanel();if(IN)twLeave(true);
  const bk=h.g.boss,t=TYPES[bk],lvl=t.lvl||52,R0={i:12,j:12,w:12,h:12,cx:18,cy:18},g=new Uint8Array(DN*DN);
  for(let y=R0.j;y<R0.j+R0.h;y++)for(let x=R0.i;x<R0.i+R0.w;x++)g[tIdx(x,y)]=1;
  const base=DUNGEONS.find(d=>d.id==='sanctum')||DUNGEONS[0];
  DG={d:Object.assign({},base,{n:'시련의 문',mobs:[],minis:[],boss:bk,trial:1}),ci:-9,g,rooms:[R0],ret:{x:P.x,y:P.y},lvl,flow:null,ft:-1,portals:[],walls:[],torches:[],floor:[],bossDead:false,boss:null,start:R0,
    j2t:{q:qid,j:h.j,bk,t:0,res:0,ph:0,nw:t.waves?2:0,st:0,ei:0,pils:[],gate:null,e:null}};
  for(let j=0;j<DN;j++)for(let i=0;i<DN;i++){if(g[tIdx(i,j)]===1){DG.floor.push([i,j]);continue}
    let adj=false;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(dgFloor(i+a,j+b))adj=true;
    if(adj){const c2=tc(i,j);DG.walls.push({x:c2.x,y:c2.y,i,j,wall:1,h:120});if((i+j)%5===0){const sides=[[1,0],[0,1]].filter(([a,b])=>dgFloor(i+a,j+b));if(sides.length){const [a,b]=sides[0];DG.torches.push({x:c2.x+a*52,y:c2.y+b*52,light:150,torch:1})}}}}
  enemies=[];projs=[];fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  const st=tc(R0.i+2,R0.j+R0.h-3),T2=DG.j2t;P.x=st.x;P.y=st.y;DG.portals.push({x:st.x-60,y:st.y+70,exit:1});
  for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}
  if(t.escort){const n=t.escort.cnt||3,hp=Math.round(maxHp()*t.escort.hp);for(let i=0;i<n;i++)T2.pils.push(j2Ally({pil:1,x:st.x+40+i*36,y:st.y-30-i*20,hp,r:13,n:'순례자'}))}
  if(t.gate){const p=tc(R0.i+3,R0.j+R0.h-5);T2.gate=j2Ally({gate:1,x:p.x,y:p.y,hp:Math.round(maxHp()*t.gate.hp*5),r:30,n:'성문'})}
  if(T2.nw){T2.ph=1;j2Wave(1)}else j2TrialBoss();
  followCam();banner={t:`시련의 문 · ${t.n}`,sub:t.note,col:'#ffd76a',life:3.2,max:3.2};msg(`시련의 문: ${t.note}`,'#ffd76a');
  if(t.escort)msg(`${t.escort.cnt||3}명의 순례자 중 한 명이라도 살아 있어야 합니다. 내 치유는 가까운 순례자에게도 닿습니다`,'#9fe0ff');
  if(t.gate)msg('몬스터는 성문을 노립니다. 도발로 붙잡아 성문을 지키세요','#9fe0ff');
  save();return true}
function j2Ally(o){const a=Object.assign({ally:1,max:o.hp,dmg:0,t:1e9,atkCd:9,anim:R()*3,fx:1,lunge:0,hurt:0,walkT:0,moving:false,face:1,ox:o.x,oy:o.y,
  s:{id:o.gate?'j2gate':'j2pil',n:o.n,kind:'escort',el:'holy',cls:''}},o);allies.push(a);return a}
function j2TrialBoss(){const T2=DG.j2t,t=TYPES[T2.bk],R0=DG.rooms[0],p=tc(R0.i+R0.w-3,R0.j+2),e=dgMob(T2.bk,p.x,p.y,DG.lvl);
  e.hp=e.max=Math.round(e.max/(DIFF[P.diff].hp||1));e.aggroed=true;e.j2tb=1;DG.boss=e;T2.e=e;
  if(t.shiftEl){T2.els=T2.bk==='ct_mage6'?['fire','ice']:['fire','ice','storm','earth'];T2.st=0}
  if(t.trapWeak)e.trapWeak=t.trapWeak;rings.push({x:e.x,y:e.y,r:10,max:160,life:.8,col:t.col});msg(`${t.n}이(가) 나타났습니다`,t.col)}
function j2Wave(n){const T2=DG.j2t,R0=DG.rooms[0],k=DG.lvl>45?'l_knight':'ashknight';for(let i=0;i<4;i++){const p=tc(R0.i+R0.w-3-(i%2)*2,R0.j+2+(i>>1)*2),m=dgMob(k,p.x+rnd(-20,20),p.y+rnd(-20,20),DG.lvl-2);m.aggroed=true;m.j2w=n}
  banner={t:`${n}번째 무리`,sub:'쉬지 말고 이어 싸우세요',col:'#ff9a6a',life:1.6,max:1.6};void T2}
function j2TrialEnd(win,why){const T2=DG&&DG.j2t;if(!T2||T2.res)return;T2.res=win?1:-1;
  if(win){const q=SQBY[T2.q];for(const e of enemies)if(!e.dead&&!e.j2tb){e.dead=true;killFx(e)}if(q&&sqState().a[q.id])sqProgress(q,T2.j,1,true);DG.bossDead=true;
    const e=T2.e;DG.portals.push({x:e?e.x:P.x,y:(e?e.y:P.y)+80,exit:1});flash={col:'#ffd76a',a:.25};
    banner={t:'시험 통과',sub:`${q?q.t:''} · 빛나는 문으로 나가 ${(sqFolk(q&&q.giver)||{}).n||'전직관'}에게 알리세요`,col:'#ffd76a',life:3.4,max:3.4};msg('시험 통과! 빛나는 문으로 나가 전직관에게 알리세요','#ffd76a')}
  else{banner={t:'시험 실패',sub:`${why} · 빛나는 문으로 나가 전직관에게 다시 말을 걸면 다시 도전할 수 있습니다`,col:'#ff8a6a',life:3.4,max:3.4};msg(`시험 실패: ${why}. 다시 도전할 수 있습니다`,'#ff8a6a')}
  save()}
function j2TrialTick(dt){const T2=DG&&DG.j2t;if(!T2){if(allies.some(a=>a.pil||a.gate))allies=allies.filter(a=>!(a.pil||a.gate));return}
  T2.t+=dt;if(T2.res)return;const t=TYPES[T2.bk];
  if(T2.ph>0&&T2.ph<=T2.nw&&!enemies.some(e=>!e.dead&&e.j2w===T2.ph)){T2.ph++;if(T2.ph<=T2.nw)j2Wave(T2.ph);else{T2.ph=99;j2TrialBoss()}}
  const e=T2.e;
  if(e&&!e.dead&&e.hp>0){
    if(T2.els){T2.st-=dt;if(T2.st<=0){T2.st=10;const el=T2.els[T2.ei++%T2.els.length];e.weakEl=el;ftext(e.x,e.y,`약점: ${ELN[el]}`,EL[el],true,90);rings.push({x:e.x,y:e.y,r:10,max:120,life:.6,col:EL[el]})}}
    if(t.keepAway&&!(e.freezeT>0||e.stunT>0||e.rootT>0)&&!(e.dash>0)){const d=dist(e,P);if(d<340&&d>0){const sp=t.spd*(e.slowT>0?.45:1)*dt;moveBody(e,(e.x-P.x)/d*sp,(e.y-P.y)/d*sp)}}}
  for(const a of T2.pils)if(a.hp>0){a.hp=Math.min(a.max,a.hp+a.max*.01*dt)}
  if(T2.pils.length&&T2.pils.every(a=>a.hp<=0))return j2TrialEnd(false,'순례자가 모두 쓰러졌습니다');
  if(T2.gate&&T2.gate.hp<=0)return j2TrialEnd(false,'성문이 무너졌습니다');
  if(e&&(e.dead||e.hp<=0||!enemies.includes(e)))j2TrialEnd(true)}
// 성문: 도발되지 않은 몬스터는 성문을 노린다
{const _et=enemyTarget;enemyTarget=function(e){const o=_et(e),T2=DG&&DG.j2t;if(!T2||!T2.gate||T2.gate.hp<=0||T2.res)return o;
  if((e.tnt&&e.tnt.t>time)||e.tauntT>0)return o;return{tg:T2.gate,d:dist(e,T2.gate)}}}
// 순례자 · 성문: 소환수 AI 대신 따로 (순례자는 나를 따라오고, 성문은 제자리)
{const _ua=updateAllies;updateAllies=function(dt){if(!allies.some(a=>a.pil||a.gate))return _ua(dt);const keep=allies.filter(a=>a.pil||a.gate);allies=allies.filter(a=>!(a.pil||a.gate));_ua(dt);
  keep.forEach((a,i)=>{a.hurt-=dt;a.anim+=dt;a.moving=false;if(a.pil&&a.hp>0&&!P.dead){const tx=P.x-40+(i%3)*40,ty=P.y+50+(i%2)*20,d=Math.hypot(tx-a.x,ty-a.y);if(d>30){const sp=Math.min(160,d*2)*dt;moveBody(a,(tx-a.x)/d*sp,(ty-a.y)/d*sp);a.moving=true;a.walkT+=dt;a.face=((tx-a.x)-(ty-a.y))>=0?1:-1}}});
  allies=allies.concat(keep.filter(a=>a.hp>0))}}
{const _hl=healP;healP=function(n){_hl(n);const T2=DG&&DG.j2t;if(!T2||!T2.pils.length||!(n>0))return;const k=n/Math.max(1,maxHp());for(const a of T2.pils)if(a.hp>0&&dist(a,P)<450){const g=Math.round(a.max*k);if(g>0){a.hp=Math.min(a.max,a.hp+g);ftext(a.x,a.y,'+'+g,'#8cf08a',false,40)}}}}
{const _da=drawAlly;drawAlly=function(a){if(!a.pil&&!a.gate)return _da(a);const s=a._s;if(!s||!onScreen(s,80))return;
  if(a.pil){const f=a.moving?[1,0,2,0][Math.floor(a.walkT*7)%4]:0,sp=twFolkSprite(J2_PIL_L,f);if(sp){if(a.face<0){ctx.save();ctx.translate(s.x,s.y);ctx.scale(-1,1);ctx.drawImage(sp.cv,-sp.ax,-sp.ay,sp.w,sp.h);ctx.restore()}else SC.draw(ctx,sp,s.x,s.y)}if(a.hurt>0)hurtFlash(s.x,s.y-30,22,.5)}
  else{const sp=twProp({k:'gatetower',pv:0});if(sp)SC.draw(ctx,sp,s.x,s.y);if(a.hurt>0)hurtFlash(s.x,s.y-40,30,.5)}
  const w=40,y=s.y-(a.gate?110:88);ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,6);ctx.fillStyle=a.hp/a.max<.3?'#ff5a4a':'#9fe0ff';ctx.fillRect(s.x-w/2,y,w*clamp(a.hp/a.max,0,1),4)}}
{const _lv=leaveDungeon;leaveDungeon=function(){const tr=DG&&DG.j2t;_lv();if(tr)allies=allies.filter(a=>!(a.pil||a.gate))}}
// 덫에 약한 보스(전갈왕): 덫에 걸리면 오래 묶인다
{const _af=applyFx;applyFx=function(e,s,from){_af(e,s,from);if(e&&e.trapWeak&&s&&s.kind==='trap'&&!s.ghost&&!e.dead){e.rootT=Math.max(e.rootT||0,2.5);e.slowT=Math.max(e.slowT||0,3)}}}
// 도감: 시련 보스는 따로 묶는다
{const _g=cxGroups;cxGroups=function(){const G=_g(),ks=Object.keys(TYPES).filter(k=>TYPES[k].trial);for(const g of G)g[1]=g[1].filter(k=>!TYPES[k].trial);const out=G.filter(g=>g[1].length);out.push(['시련의 문 (전직관의 시험)',ks]);return out}}
{const _mi=monInfo;monInfo=function(k){const m=_mi(k),t=TYPES[k];if(t&&t.trial){m.where=['시련의 문 (전직관 옆)'];m.lv=t.lvl}return m}}

/* ===== 5) 갈래 장비 · 갈래 바꾸기 ===== */
const J2U={
  j2_archmage:{n:'네 원소의 홀',slot:'staff',cls:'mage',st:{int:1.3,tr_j_archmage:1,crit:4},lore:'시험관이 남긴 홀. 쥘 때마다 다른 색으로 빛난다.'},
  j2_summoner:{n:'정령 계약서',slot:'amulet',cls:'mage',st:{mp:1.2,tr_j_summoner:1,dr:6},lore:'정령왕의 그림자가 서명한 계약서. 목에 거는 두루마리.'},
  j2_inquisitor:{n:'심문관의 낙인 홀',slot:'staff',cls:'priest',st:{int:1.3,tr_j_inquisitor:1,ls:2},lore:'이단을 가려내던 홀.'},
  j2_archbishop:{n:'대주교의 영대',slot:'amulet',cls:'priest',st:{mp:1.2,tr_j_archbishop:1,regen:1.2},lore:'순례자들이 감사의 표로 엮어 준 영대.'},
  j2_guardian:{n:'성문 수호자의 방패',slot:'off',wt:'shield',cls:'warrior',st:{blk:1.2,tr_j_guardian:1,hp:1.2},lore:'고르둔의 망치를 받아 낸 방패.'},
  j2_berserker:{n:'챔피언의 피 묻은 반지',slot:'ring',cls:'warrior',st:{str:30,tr_j_berserker:1,ias:8},lore:'라크가 투기장에서 끼던 반지.'},
  j2_hawkeye:{n:'괴조 깃 화살통',slot:'off',wt:'quiver',cls:'archer',st:{acc:1.2,tr_j_hawkeye:1,dex:30},lore:'괴조의 깃으로 만든 화살통.'},
  j2_ranger:{n:'전갈왕 집게 부적',slot:'amulet',cls:'archer',st:{dex:25,tr_j_ranger:1,ms:10},lore:'전갈왕의 집게를 깎아 만든 부적.'}};
function j2MakeUniq(k){const u=J2U[k];if(!u)return null;const il=50,ph=PHYS_CLS[u.cls];
  const it={id:uid++,slot:u.slot,rar:4,name:u.n,il,stats:ph?fixedStatsV18(u.st,il,u.wt):fixedStats(u.st,il),cls:u.cls,lore:u.lore,j2u:k};if(u.wt)it.wt=u.wt;return it}
function j2GiveUniq(k){const it=j2MakeUniq(k);if(!it)return;if(P.bag.length<sqBagCap()){P.bag.push(it);msg(`보상: ${it.name}`,RAR[4].c)}else{loot.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),kind:'item',item:it,t:0,keep:1});msg(`가방이 가득 차 ${it.name}을(를) 발밑에 두었습니다`,RAR[4].c)}}
function job2Swap(br){const J=JOB2[P.cls];if(!P.job2||!J||!J[br]||br===P.job2)return false;const price=job2SwapPrice();
  if(P.gold<price){msg(`금화가 모자랍니다 (${price.toLocaleString()} 필요)`,'#ff8a6a');return false}
  P.gold-=price;let pts=0;for(const id of Object.keys(P.sk)){const s=SPELLS[id];if(s&&s.job2){pts+=P.sk[id];delete P.sk[id]}}P.sp+=pts;
  P.bar=P.bar.map(x=>x&&SPELLS[x]&&SPELLS[x].job2?null:x);for(const a of allies)if(a.j2)a.gone=true;allies=allies.filter(a=>!a.gone);
  for(const id in P.buffs)if(SPELLS[id]&&SPELLS[id].job2)delete P.buffs[id];P.j2link=null;
  P.job2=br;P.job2n=(P.job2n|0)+1;passT=-1;J2UI.tab='j2';buildBar();
  banner={t:`갈래 바꾸기 · ${J[br].n}`,sub:`스킬 포인트 ${pts}점을 돌려받았습니다 · 금화 ${price.toLocaleString()}`,col:'#ffd76a',life:3,max:3};
  msg(`갈래를 「${J[br].n}」(으)로 바꾸었습니다. 스킬 포인트 ${pts}점을 돌려받았습니다`,'#ffd76a');j2Mirror();updateHud();save();return true}

/* ===== 6) 저장 · 불러오기 (새 칸: job2 · job2n · qsp · trial. 없으면 기본값) ===== */
// 예전 판(v18)이 이 저장을 다시 쓰면 모르는 칸을 버리므로, 같은 값을 물약 칸(pot._j2)에도 적어 둔다 → 다시 v19에서 열면 되살아난다(점수 두 번 받지 않음)
function j2Mirror(){try{if(!P||!P.pot||typeof P.pot!=='object')return;const q=Object.keys(j2Q());if(q.length||P.job2||P.trial||P.job2n)P.pot._j2={q,j:P.job2||P._job2raw||0,n:P.job2n|0,t:P.trial|0};else delete P.pot._j2}catch(_){}}
{const _sd=saveData;saveData=function(){j2Mirror();const d=_sd();d.job2=P.job2||P._job2raw||null;d.job2n=P.job2n|0;d.qsp=Object.assign({},j2Q());d.trial=P.trial|0;return d}}
function j2LoadFix(d){const m=d&&d.pot&&d.pot._j2&&typeof d.pot._j2==='object'?d.pot._j2:{};
  const raw=d.job2!=null?d.job2:(m.j||null),ok=typeof raw==='string'&&JOB2[P.cls]&&JOB2[P.cls][raw];P.job2=ok?raw:null;P._job2raw=ok?null:(typeof raw==='string'&&raw.length<24?raw:null);
  P.job2n=Math.max(0,Math.max(d.job2n|0,m.n|0));
  const q={},add=k=>{if(typeof k==='string'&&k.length<24)q[k]=1};if(d.qsp&&typeof d.qsp==='object'&&!Array.isArray(d.qsp))for(const k in d.qsp)if(d.qsp[k])add(k);if(Array.isArray(m.q))m.q.forEach(add);P.qsp=q;
  P.trial=clamp(Math.max(d.trial|0,m.t|0),0,7);
  // 기록이 지워진 의뢰(예전 판에서 다시 저장)는 남은 값으로 끝낸 것으로 친다 — 점수는 qsp로만 주므로 두 번 받지 않는다
  const s=sqState();for(const x of CT_QUESTS)if(x.cls===P.cls&&x.step<=P.trial&&!s.a[x.id]&&!s.d[x.id])s.d[x.id]=1;
  if(P.job2)for(const x of J2_QUESTS)if(x.cls===P.cls&&(!x.pick||x.pick===P.job2)&&!s.d[x.id]){delete s.a[x.id];s.d[x.id]=1}
  J2UI.tab=null;J2UI.swapAsk=null;j2Mirror()}
{const _ld=load;load=function(d,slot){const ok=_ld(d,slot);if(ok)try{j2LoadFix(d)}catch(err){if(window.__QA)throw err}return ok}}
{const _ng=newGame;newGame=function(cls,slot){const r=_ng(cls,slot);P.job2=null;P._job2raw=null;P.job2n=0;P.qsp={};P.trial=0;J2UI.tab=null;return r}}

/* ===== 7) 스킬 창: 「상위 기술」 · 갈래 탭 ===== */
const J2UI={tab:null,swapAsk:null};
function j2TabsHtml(){const adv=(typeof ADV_IDS==='object'&&ADV_IDS[P.cls])||[];let pa=0;for(const id of adv)pa+=P.sk[id]||0;
  let h=`<button type="button" data-j2tab="adv" class="j2t${P.job2?'':' lk'}" aria-selected="${J2UI.tab==='adv'}">상위 기술 <span class="muted">${P.job2?pa:'잠김'}</span></button>`;
  if(P.job2&&JOB2[P.cls]&&JOB2[P.cls][P.job2]){let pj=0;for(const k in P.sk)if(TREE[k]==='j_'+P.job2)pj+=P.sk[k];h+=`<button type="button" data-j2tab="j2" class="j2t j2b" aria-selected="${J2UI.tab==='j2'}">${JOB2[P.cls][P.job2].tree} <span class="muted">${pj}</span></button>`}
  return h}
// 쓰는 방식 표시(castmark.js): 즉시 · 시전 · 채널링 — 2차 갈래·상위 기술 화면에도
const j2CM=(id,c)=>typeof CMARK==='object'?CMARK.html(id,c):'';
// 파티에 쓰는지 · 나만 쓰는지 표시(partyui.js) — 이것도 기본 나무 화면만 감싸므로 여기서 붙인다
const j2PT=id=>typeof PUI==='object'&&PUI.badge?PUI.badge(SPELLS[id],'ptb'):'';
function j2AdvHtml(){const ids=((typeof ADV_IDS==='object'&&ADV_IDS[P.cls])||[]).filter(id=>SPELLS[id]);if(!ids.length)return '<p class="muted">상위 기술이 없습니다.</p>';
  if(!nodeSel||!ids.includes(nodeSel))nodeSel=ids.find(id=>P.sk[id])||ids[0];
  let h=`<p class="muted j2note">${P.job2?'2차 전직으로 열린 기술입니다. 레벨이 되면 찍고 쓸 수 있습니다.':`<span class="lockup">2차 전직(레벨 ${J2LV}, 전직관의 의뢰) 뒤에 열립니다.</span> 미리 찍어 둔 점수는 그대로 남아 있습니다.`}</p><div class="j2adv">`;
  for(const id of ids){const s=SPELLS[id],L=skLv(id),need=reqLvOf(id),open=advUnlocked(id),c=canLearn(id)?'can':open?'':'lk';
    h+=`<button class="j2row ${c}" type="button" data-node="${id}" aria-pressed="${nodeSel===id}" title="${s.n}">${spellSvg(s)}${L?`<span class="nl">${L}</span>`:''}<span style="min-width:0">${j2CM(id,'cmk')}<b>${s.n}</b><small>레벨 ${need}${open?'':' · 잠김'} ${j2PT(id)}</small></span></button>`}
  return h+'</div>'+detailHtml(nodeSel)}
function j2BranchHtml(){const br=P.job2,J=JOB2[P.cls][br],list=J2_SPELLS.map(id=>SPELLS[id]).filter(s=>s.job2===br);
  const cols=Math.max(...list.map(s=>TREEPOS[s.id].col))+1,CW=60,RH=58,LW=70,width=LW+cols*CW,height=RANK_LV_J2.length*RH;
  if(!nodeSel||!list.some(s=>s.id===nodeSel))nodeSel=(list.find(s=>P.sk[s.id])||list[0]).id;
  const pos=id=>{const p=TREEPOS[id];return{x:LW+p.col*CW+25,y:(p.row-9)*RH+25}};let lines='',nodes='',labels='';
  for(let r=0;r<RANK_LV_J2.length;r++)labels+=`<div class="rl" style="top:${r*RH}px"><b>${r+1}단</b>레벨 ${RANK_LV_J2[r]}</div>`;
  for(const s of list){const p=pos(s.id);for(const pr of PRE[s.id]||[]){if(!TREEPOS[pr]||!SPELLS[pr]||SPELLS[pr].job2!==br)continue;const q=pos(pr),on=P.sk[pr]>0,adj=p.y-q.y<=RH+1&&q.x===p.x,gx=q.x+(p.x>=q.x?30:-30),d=adj?`M${q.x} ${q.y+25}V${p.y-25}`:`M${q.x} ${q.y+25}V${q.y+29}H${gx}V${p.y-29}H${p.x}V${p.y-25}`;
      lines+=`<path d="${d}" fill="none" stroke="${on?'#c9a24a':'#5a4a36'}" stroke-width="2" stroke-linejoin="round"/>`}
    const L=skLv(s.id),c=L?(P.lvl<reqLvOf(s.id)?'has lockup':'has'):canLearn(s.id)?'can':P.lvl<reqLvOf(s.id)||!preOk(s.id)?'locked':'';
    nodes+=`<button class="node ${c}${s.kind==='passive'?' passive':''}" type="button" data-node="${s.id}" aria-pressed="${nodeSel===s.id}" title="${s.n}${s.kind==='passive'?' (패시브)':''}" style="left:${p.x-25}px;top:${p.y-25}px">${j2PT(s.id)}${j2CM(s.id,'cmk cmn')}${spellSvg(s)}${s.kind==='passive'?'<span class="pv">패시브</span>':''}${L?`<span class="nl">${L}</span>`:''}</button>`}
  return `<p class="muted j2note"><b style="color:#ffd76a">${J.n}</b> · ${J.desc}</p><div class="treescroll"><div class="tree" style="width:${width}px;height:${height}px"><svg class="lines" width="${width}" height="${height}">${lines}</svg>${labels}${nodes}</div></div>`+detailHtml(nodeSel)}
{const _th=treeHtml;treeHtml=function(){j2KindN();if(J2UI.tab==='j2'&&!P.job2)J2UI.tab=null;
  if(!J2UI.tab)return _th().replace(/(<div class="treetabs">[\s\S]*?)(<\/div>)/,(m,a,b)=>a+j2TabsHtml()+b);
  const C=CLASSES[P.cls];let h=`<div class="pts">남은 스킬 포인트 <b>${P.sp}</b> <span class="muted">· 한 기술에 최대 ${MAXSK}점 · 선으로 이어진 기술만 위의 기술에 1점이 필요합니다</span>${typeof CMARK==='object'?CMARK.legend():''}</div><div class="treetabs">`;
  C.trees.forEach((n,t)=>{let pts=0;for(const k in P.sk)if(TREE[k]===t)pts+=P.sk[k];h+=`<button type="button" data-tree="${t}" aria-selected="false">${n} <span class="muted">${pts}</span></button>`});
  h+=j2TabsHtml()+'</div>';return h+(J2UI.tab==='adv'?j2AdvHtml():j2BranchHtml())}}
{const _dh=detailHtml;detailHtml=function(id){const s=SPELLS[id];if(!s||!s.job2)return _dh(id);j2KindN();const C=CLASSES[P.cls],J=job2Of(s.job2);let h=_dh(id);
  h=h.replace(` · ${C.rankN(s.rank)} · `,` · ${J?J.n:''} ${s.rank-9}단 · `).split('같은 undefined 계열').join(`같은 ${J?J.tree:''} 갈래`);
  if(s.job2!==P.job2)h=h.replace('<div class="acts">',`<div class="req"><span class="lockup">2차 전직 「${J?J.n:s.job2}」 갈래 전용 기술입니다${P.job2?'':' (레벨 50, 전직관의 의뢰)'}</span></div><div class="acts">`);
  return h}}

/* ===== 8) 아이콘: 전사·궁수 2차 기술(문양 조합) · 마법사·사제의 새 종류와 소환수 ===== */
Object.assign(ICP,{
  ironflesh:c=>ICX.plate(16,16,1.1)+ICX.laurel(16,16,1.15),grandtaunt:c=>ICX.horn(15,16,-20,1)+ICX.waves(23,14,0,.9,c.hi,3),
  chainpull:c=>ICX.chain(16,16,-45,1.1,ICC.steel)+ICX.inward(9,23,.6,c.hi),shieldwall:c=>ICX.bricks(16,24,.8)+ICX.shield(16,13,.9,c.r),
  guardrush:c=>ICX.lines(8,16,0,1,c.hi,4)+ICX.shield(19,16,.9,c.r)+ICX.figure(26,22,.45,c.hi),guardianoath:c=>ICX.laurel(16,16,1.1)+ICX.shield(16,17,.7,c.r)+ICX.crown(16,6,.4),
  retaliation:c=>ICX.ring(16,16,1.05,c.hi,1)+ICX.sword(16,16,0,.7)+ICX.burst(16,16,.5,ICC.gold),steadfast:c=>ICX.boot(16,17,0,1.05)+ICX.bricks(16,27,.6),
  commandshout:c=>ICX.banner(13,16,1,c.r)+ICX.waves(24,10,0,.7,c.hi,2),bulwark:c=>ICX.tower(16,15,1.05)+ICX.ring(16,24,.8,c.hi,1),
  citadel:c=>ICX.tower(10,17,.75)+ICX.tower(22,17,.75)+ICX.shield(16,21,.55,c.r),lastbastion:c=>ICX.shield(16,16,1.05,c.r)+ICX.heart(16,13,.45,ICC.blood),
  crushcombo:c=>ICX.fist(12,18,0,.9)+ICX.burst(22,11,.6,c.hi)+ICX.crack(22,24,.6,c.hi),bloodlust:c=>ICX.laurel(16,16,1.1)+ICX.drop(16,16,.8,ICC.blood),
  whirlslash:c=>ICX.spiral(16,16,1.05,c.hi)+ICX.sword(16,16,30,.7),thunderdrop:c=>ICX.zap(16,10,0,.8,'#fff6b0')+ICX.crack(16,24,.9,c.hi),
  bloodfrenzy:c=>ICX.drop(10,11,.7,ICC.blood)+ICX.sword(18,17,35,.85)+ICX.up(25,24,.45,c.hi),weaponmastery:c=>ICX.laurel(16,16,1.15)+ICX.sword(12,16,-25,.7)+ICX.spear(20,16,25,.6),
  rend:c=>ICX.claw(16,15,0,1.05,ICC.blood)+ICX.drop(24,24,.45,ICC.blood),terrorroar:c=>ICX.skull(16,15,.95,c.hi)+ICX.waves(16,16,0,1,c.r,3),
  execute:c=>ICX.sword(16,15,0,1.05,ICC.steel)+ICX.skull(24,24,.45,c.hi),battletrance:c=>ICX.eye(16,15,.9,ICC.blood,1)+ICX.ring(16,16,1,c.hi,1),
  myriadslash:c=>ICX.arc(17,10,-10,.8,c.hi)+ICX.arc(17,17,-10,.8,c.hi)+ICX.arc(17,24,-10,.8,c.hi)+ICX.sword(8,16,40,.6),avatarofwar:c=>ICX.figure(16,19,1.05,c.hi)+ICX.flame(16,8,.55,ICC.red)+ICX.crown(16,4,.35),
  tripleshot:c=>ICX.arrow(16,9,0,.8)+ICX.arrow(16,16,0,.8)+ICX.arrow(16,23,0,.8),farsight:c=>ICX.laurel(16,16,1.1)+ICX.eye(16,16,.8,c.hi),
  pierceblow:c=>ICX.lines(8,16,0,1,c.hi,3)+ICX.arrow(18,16,0,1.15),snipe:c=>ICX.target(16,16,1,c.r)+ICX.arrow(16,16,-45,.7),
  splitarrow:c=>ICX.arrow(10,16,0,.7)+ICX.arrow(23,10,-30,.55)+ICX.arrow(23,22,30,.55),weakpoint:c=>ICX.laurel(16,16,1.1)+ICX.target(16,16,.7,c.r),
  elemrain:c=>ICX.cloud(16,8,.8,'#9fc0ff')+ICX.arrow(10,22,90,.5,'#ff7a2e')+ICX.arrow(16,24,90,.5,'#8fd8ff')+ICX.arrow(22,22,90,.5,'#fff6b0'),focus:c=>ICX.eye(16,16,1,c.hi,1)+ICX.ring(16,16,1.05,c.hi,1),
  backshot:c=>ICX.boot(9,21,0,.7)+ICX.lines(16,21,180,.6,c.hi,3)+ICX.bow(22,12,0,.7),deathmark:c=>ICX.skull(16,16,.85,c.hi)+ICX.target(16,16,1.1,c.r),
  arrowvortex:c=>ICX.spiral(16,16,1.05,c.hi)+ICX.arrow(16,16,-45,.6),heavenbow:c=>ICX.wings(16,13,1,ICC.feather)+ICX.bow(16,18,0,.85),
  blasttrap:c=>ICX.trap(16,21,1)+ICX.burst(16,10,.7,'#ff7a2e'),trapmaster:c=>ICX.laurel(16,16,1.1)+ICX.trap(16,18,.75),
  thorntrap:c=>ICX.trap(16,21,.95)+ICX.caltrop(10,9,.5)+ICX.caltrop(22,9,.5),traptoss:c=>ICX.path('M5 25Q14 2 26 16',c.hi,1.4)+ICX.trap(23,23,.6),
  smoke:c=>ICX.cloud(16,13,1.1,'#c8c8d0')+ICX.cloud(10,22,.6,'#a0a0a8'),wildsense:c=>ICX.laurel(16,16,1.1)+ICX.paw(16,16,.8,c.hi),
  netshot:c=>ICX.cage(16,17,1)+ICX.arrow(8,8,45,.5),beastawaken:c=>ICX.wolf(16,18,.95)+ICX.up(25,8,.45,c.hi),
  detonate:c=>ICX.trap(10,23,.55)+ICX.trap(22,23,.55)+ICX.burst(16,10,.8,'#ff7a2e'),lure:c=>ICX.noose(16,14,1)+ICX.inward(16,23,.7,c.hi),
  dominion:c=>ICX.banner(10,16,.8,c.r)+ICX.trap(22,22,.6)+ICX.crown(22,8,.4),earthbind:c=>ICX.crack(16,21,1.1,c.hi)+ICX.chain(16,11,0,.8,ICC.steel)});
{const _ib=iconBody;iconBody=function(s,c,hi){if(!s||!s.job2||s.kind==='passive')return _ib(s,c,hi);const st=w=>`stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  if(s.kind==='detonate'){let g=`<circle cx="16" cy="18" r="6" fill="${c}"/><circle cx="16" cy="18" r="2.6" fill="${hi}"/>`;for(let i=0;i<8;i++){const a=i/8*6.283;g+=`<path d="M${16+Math.cos(a)*9} ${18+Math.sin(a)*9}L${16+Math.cos(a)*13} ${18+Math.sin(a)*13}" ${st(1.8)}/>`}return g+`<path d="M12 5l2 3M20 5l-2 3" ${st(1.4)}/>`}
  if(s.kind==='link')return `<circle cx="9" cy="16" r="5" ${st(2)}/><circle cx="23" cy="16" r="5" ${st(2)}/><path d="M14 16h4" stroke="${hi}" stroke-width="2.4"/><path d="M16 6v4M14 8h4" stroke="${hi}" stroke-width="1.4"/>`;
  if(s.kind==='cleanse')return `<path d="M16 4c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z" ${st(2)}/><path d="M12 19l3 3 6-7" stroke="${hi}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  if(s.kind==='summon'){const f=s.legion?'legion':s.form;
    if(f==='fireelem')return `<path d="M16 4c4 5 8 8 8 14a8 8 0 0 1-16 0c0-6 4-9 8-14z" fill="${c}"/><circle cx="13.5" cy="17" r="1.3" fill="${hi}"/><circle cx="18.5" cy="17" r="1.3" fill="${hi}"/>`;
    if(f==='golem')return `<path d="M8 12h16v10h-4v6h-3v-6h-2v6h-3v-6H8z" fill="${c}"/><rect x="11.5" y="4" width="9" height="8" rx="1.5" fill="${c}"/><circle cx="14.3" cy="8" r="1" fill="${hi}"/><circle cx="17.7" cy="8" r="1" fill="${hi}"/>`+(s.tint==='stone'?`<path d="M12 14l3 4-2 3M20 14l-2 5" stroke="${hi}" stroke-width="1" fill="none"/>`:'');
    if(f==='falcon'||f==='firebird')return `<path d="M16 15C11 9 6 9 3 11c4 1 6 3 8 6-2 1-3 3-3 5 3-2 6-3 8-3s5 1 8 3c0-2-1-4-3-5 2-3 4-5 8-6-3-2-8-2-13 4z" fill="${c}"/><circle cx="16" cy="13" r="2" fill="${hi}"/>`+(f==='firebird'?`<path d="M13 23c1 3 2 5 3 6 1-1 2-3 3-6" ${st(1.4)}/>`:'');
    if(f==='legion')return `<circle cx="16" cy="9" r="4" fill="${c}"/><circle cx="8" cy="19" r="3.4" fill="${c}"/><circle cx="24" cy="19" r="3.4" fill="${c}"/><path d="M12 28c0-5 2-8 4-8s4 3 4 8M4 28c0-4 2-6 4-6s4 2 4 6M20 28c0-4 2-6 4-6s4 2 4 6" fill="${c}" opacity=".85"/><circle cx="16" cy="9" r="1.4" fill="${hi}"/>`}
  return _ib(s,c,hi)}}

/* ===== 9) 매 프레임 · 시험용 ===== */
{const _u=update;update=function(dt){_u(dt);if(!paused)j2TrialTick(dt)}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{JOB2,JOB2_IDS,J2_SPELLS,RANK_LV_J2,job2Ok,job2Swap,job2SwapPrice,job2Title,J2UI,CT_QUESTS,J2_QUESTS,J2U,J2SPOT,j2TrialEnter,j2Reward,j2LoadFix})}catch(_){}},0);
window.__j2={JOB2,JOB2_IDS,J2_SPELLS,RANK_LV_J2,TRIAL_BADGE,CT_QUESTS,J2_QUESTS,J2U,J2SPOT,J2_SP_ALL,J2UI,J2R,
  job2Ok,job2Of,job2Swap,job2SwapPrice,job2Title,trialBadge,j2TrialEnter,j2TrialGoal,j2TrialEnd,j2Reward,j2Advance,j2MakeUniq,j2LoadFix,j2Mirror,j2Q,j2NpcAt,j2TabsHtml,
  j2Summon,j2Detonate,j2Link,j2Cleanse,j2Mine,j2BS,j2KindN,get DG(){return DG}};
