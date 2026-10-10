/* ---------- v20 (CORE): 3차 전직 퀘스트라인 「재로 쓴 이름」 · 숨은 곳 · 시험의 방 · 갈래 상징 장비 ----------
   설계: rpg/job-advancement-3/3차전직-컨셉.md 6절. 전직관은 2차와 같은 넷(엘리안 · 오벨린 · 브로딘 · 세린).
   단계: 0 재로 쓴 이름(85, 악몽 공허의 옥좌) → 1 옛 대가의 흔적(92, 지옥에서만 열리는 숨은 곳) → 2 이름의 첫 글자(96, 지옥 공허의 옥좌 · 재의 열쇠 = 봉인문)
         → 3 갈래의 시험(100, 재가 내리는 고원의 시험의 방) → 3차 전직(칭호 · 스킬 포인트 4 · 갈래 상징 유니크) → 4 왕도의 문(120) → 5 재의 왕좌(135, 재의 군주 첫 처치 스킬 포인트 2).
   진행은 기존 의뢰 저장(sq)에 쌓이고, 예전 판이 다시 저장해도 되살릴 수 있게 물약 칸(pot._j3.d)에 끝낸 단계를 적어 둔다. 점수는 P.qsp 표로 한 번만. */
const J3_GIVER={mage:'elian',priest:'j2_priest',warrior:'j2_warrior',archer:'j2_archer'};
const J3_TOWN={mage:'arden',priest:'arden',warrior:'arden',archer:'arden'};// v26: 전직관 넷 모두 왕도 전당
const J3_PFX={mage:'m',priest:'p',warrior:'w',archer:'a'};
// 1단계 숨은 곳 (기존 지역의 지옥판에만)
const J3_HIDE={
  mage:{reg:'regx',r:'lava',n:'첫 번째 화로',at:'용암 아래 잠긴 옛 마법원 서고',bk:'g3_mage',theme:'la_heart',relic:'첫 대마법사의 타다 남은 서책'},
  priest:{r:'abyss',n:'꺼지지 않은 제단',at:'균열 가장자리의 무너진 예배소',bk:'g3_priest',theme:'ab_throne',relic:'첫 성자의 성흔 묵주'},
  warrior:{r:'canyon',n:'거인의 성문 안뜰',at:'협곡 벽에 반쯤 묻힌 성문',bk:'g3_warrior',theme:'ca_vault',relic:'첫 군주의 부러진 투구 장식'},
  archer:{r:'cliffs',n:'매가 돌아오지 않는 둥지',at:'절벽 끝 빈 둥지',bk:'g3_archer',theme:'cl_nest',relic:'첫 신궁의 바람 깃'}};
const J3_GUARD={
  g3_mage:{n:'불타지 않는 사서',lvl:95,hp:2300,dmg:30,spd:95,r:26,xp:4200,aggro:700,atk:1.4,col:'#ff9a4a',ranged:true,pcol:'#ffb04a',draw:'wraith',sc:2.2,boss:1,skills:['volley','slam','summon'],summon:'l_imp',aura:'rgba(255,140,60,.35)',note:'불길 속에서도 타지 않는 옛 서고의 사서. 불 임프를 부르며 불덩이를 쏟는다.'},
  g3_priest:{n:'눈먼 순례자',lvl:95,hp:2300,dmg:30,spd:90,r:26,xp:4200,aggro:700,atk:1.5,col:'#e8e0c0',ranged:true,pcol:'#fff2b0',draw:'apostle',sc:2,boss:1,undead:true,skills:['volley','charge','summon'],summon:'wraith',aura:'rgba(255,240,180,.3)',note:'꺼지지 않은 제단을 지키는 눈먼 순례자. 앞을 보지 못해도 기도 소리를 쫓아온다.'},
  g3_warrior:{n:'마지막 문지기 거상',lvl:95,hp:2700,dmg:34,spd:75,r:32,xp:4200,aggro:700,atk:1.7,col:'#9a8a70',draw:'golem',alt:'ogre',sc:2.8,boss:1,skills:['slam','charge'],aura:'rgba(200,170,120,.3)',note:'거인의 성문을 아직도 지키는 돌 거상. 느리지만 한 방이 무겁다.'},
  g3_archer:{n:'폭풍 깃 괴조왕',lvl:95,hp:2100,dmg:30,spd:170,r:28,xp:4200,aggro:760,atk:1.2,col:'#8ab0ff',ranged:true,pcol:'#ffe066',draw:'imp',alt:'elemental',sc:2.2,boss:1,skills:['volley','charge'],aura:'rgba(140,176,255,.35)',keepAway:1,note:'둥지를 빼앗긴 괴조들의 왕. 멀리 떨어져 날며 번개 깃을 쏜다.'}};
// 3단계 갈래의 시험 (혼자도 깨고, 둘·셋이면 기믹이 쉬워진다)
const J3_TRIAL={
  t3_archsorcerer:{n:'금기의 서고지기',lvl:100,hp:3400,dmg:30,spd:90,r:28,xp:9000,aggro:800,atk:1.5,col:'#b9a2ff',ranged:true,pcol:'#d8c8ff',draw:'wraith',sc:2.4,boss:1,skills:['volley','slam'],aura:'rgba(185,162,255,.35)',g:'shield',
    note:'네 원소 방패를 번갈아 두른다. 시전 시간이 있는 마법이나 채널링·모으기를 끝까지 마쳐야 방패가 깨진다. 기둥 뒤에서 외우거나, 동료가 지켜 주면 쉽다.'},
  t3_spiritking:{n:'계약을 깬 정령왕의 그림자',lvl:100,hp:3400,dmg:28,spd:95,r:30,xp:9000,aggro:800,atk:1.5,col:'#8fd8ff',draw:'elemental',sc:2.6,boss:1,skills:['volley','summon'],summon:'i_elem',ranged:true,pcol:'#bfeeff',aura:'rgba(143,216,255,.35)',g:'steal',
    note:'내 소환수를 빼앗아 제 편으로 만든다. 내 소환수가 둘 아래면 그림자 갑옷으로 피해를 거의 받지 않는다. 빼앗긴 것보다 빨리 다시 부르자.'},
  t3_executor:{n:'거짓 성인',lvl:100,hp:2600,dmg:30,spd:105,r:26,xp:9000,aggro:800,atk:1.3,col:'#fff2c0',ranged:true,pcol:'#fff6c8',draw:'apostle',sc:1.9,boss:1,skills:['volley','charge'],aura:'rgba(255,240,190,.35)',g:'clones',
    note:'똑같은 셋 중 하나만 진짜. 낙인(이단 낙인 등)을 맞히면 진짜가 드러나고 가짜는 흩어진다. 드러난 진짜를 집행하라.'},
  t3_saint:{n:'쓰러지는 순례자들',lvl:100,hp:2000,dmg:24,spd:90,r:26,xp:9000,aggro:800,atk:1.5,col:'#c8c8ff',draw:'wraith',sc:2,boss:1,undead:true,skills:['summon'],summon:'t3_wisp',aura:'rgba(200,200,255,.3)',g:'pilgrims',
    note:'순례자 다섯을 3분 동안 지킨다. 저주로 몇 명이 꼭 쓰러지는 순간이 온다. 치유를 모아 일으키거나 부활 기도로 살리자. 끝날 때 셋 이상 서 있으면 통과.'},
  t3_bulwark:{n:'무너진 성벽의 군단장',lvl:100,hp:3200,dmg:32,spd:95,r:28,xp:9000,aggro:800,atk:1.5,col:'#8a8478',draw:'knight',sc:2,boss:1,skills:['slam','charge'],aura:'rgba(200,190,170,.3)',g:'refugees',
    note:'피난민 뒤에서 세 방향 군단을 막는다. 몬스터는 피난민을 노린다. 도발로 붙잡고 길을 나눠 지키자. 군단 셋 뒤에 군단장.'},
  t3_warlord:{n:'환영 기사단장',lvl:100,hp:3000,dmg:32,spd:120,r:26,xp:9000,aggro:800,atk:1.2,col:'#d0d8ff',draw:'knight',sc:1.9,boss:1,skills:['charge','slam'],aura:'rgba(200,210,255,.35)',g:'hundred',
    note:'환영 기사 100을 쓰러뜨리면 기사단장이 결투를 청한다.'},
  t3_divinearcher:{n:'별을 삼킨 괴조',lvl:100,hp:2800,dmg:30,spd:180,r:30,xp:9000,aggro:900,atk:1.2,col:'#ffd76a',ranged:true,pcol:'#fff2a0',draw:'imp',alt:'elemental',sc:2.4,boss:1,skills:['volley','charge'],aura:'rgba(255,215,106,.35)',g:'sky',keepAway:1,
    note:'하늘 높이 멀리서만 난다. 가까이서 쏜 화살은 거의 안 박힌다. 멀리서(420 넘게) 맞히거나, 크게 무너뜨리거나, 내려앉는 순간을 노리자.'},
  t3_shadowhunter:{n:'그림자 없는 짐승',lvl:100,hp:3200,dmg:32,spd:150,r:28,xp:9000,aggro:800,atk:1.2,col:'#3a3448',draw:'wolf',alt:'yeti',sc:2.6,boss:1,skills:['charge','slam'],aura:'rgba(90,70,120,.35)',g:'beast',
    note:'덫을 보는 짐승. 눈이 멀었을 때(연막·밤·묶임)만 덫이 먹히고 제대로 아프다. 가끔 밤이 내린다.'},
  // 시험의 졸개
  t3_wisp:{n:'저주받은 행렬',lvl:98,hp:110,dmg:11,spd:105,r:14,xp:60,aggro:900,atk:1.4,col:'#b0a8ff',undead:true,draw:'wraith',sc:1},
  t3_legion:{n:'성벽 군단병',lvl:98,hp:170,dmg:14,spd:100,r:16,xp:60,aggro:900,atk:1.3,col:'#9a948a',draw:'knight',sc:1},
  t3_phantom:{n:'환영 기사',lvl:98,hp:80,dmg:9,spd:115,r:15,xp:30,aggro:900,atk:1.2,col:'#c8d0ff',draw:'knight',sc:1}};
for(const T of [J3_GUARD,J3_TRIAL])for(const k in T){const t=Object.assign({},T[k]);t.min=t.lvl;t.j3t=T===J3_TRIAL?1:2;TYPES[k]=t}
const J3_ROOM_TH={trial:{floor:[56,50,52],wall:['#4a4250','#1c1820','#625868'],torch:'#ffb070'}};
// 갈래 상징 유니크 (3차 계열 +1)
const J3U={
  j3_archsorcerer:{n:'금서의 열쇠 홀',slot:'staff',cls:'mage',st:{int:1.5,tr_j3_archsorcerer:1,crit:6,mcost:1.1},lore:'서고지기가 지키던 금서의 자물쇠를 여는 홀.'},
  j3_spiritking:{n:'네 정령왕의 인장',slot:'ring',cls:'mage',st:{mp:1.4,tr_j3_spiritking:1,dr:8,int:.8},lore:'불·물·바람·땅의 왕이 차례로 눌러 찍은 인장.'},
  j3_executor:{n:'집행자의 빛창 홀',slot:'staff',cls:'priest',st:{int:1.5,tr_j3_executor:1,crit:6,ls:3},lore:'거짓 성인을 꿰뚫은 빛이 굳어 생긴 홀.'},
  j3_saint:{n:'성자의 성흔 영대',slot:'amulet',cls:'priest',st:{mp:1.4,tr_j3_saint:1,regen:1.5,hp:1},lore:'순례자 다섯이 끝까지 걸어 낸 길을 엮은 영대.'},
  j3_bulwark:{n:'성벽 군주의 탑방패',slot:'off',wt:'shield',cls:'warrior',st:{blk:1.4,tr_j3_bulwark:1,hp:1.5},lore:'무너진 성벽의 마지막 돌로 만든 방패.'},
  j3_warlord:{n:'백 기사의 군기 반지',slot:'ring',cls:'warrior',st:{str:40,tr_j3_warlord:1,ias:10},lore:'환영 기사단장이 끼던 반지. 끼면 북소리가 들린다.'},
  j3_divinearcher:{n:'별 떨군 깃 화살통',slot:'off',wt:'quiver',cls:'archer',st:{acc:1.4,tr_j3_divinearcher:1,dex:40},lore:'별을 삼킨 괴조의 깃으로 만든 화살통.'},
  j3_shadowhunter:{n:'그림자 없는 송곳니',slot:'amulet',cls:'archer',st:{dex:35,tr_j3_shadowhunter:1,ms:12},lore:'그림자가 없던 짐승의 송곳니. 쥐면 내 그림자가 짙어진다.'}};

/* ===== 의뢰 데이터 ===== */
const J3_SAY={
 mage:[['엘가로스가 남긴 재 말인가… 그 재에 글자가 있다던데. 악몽의 균열 너머, 공허의 옥좌에서 그를 다시 쓰러뜨리고 「재로 쓴 이름 조각」을 가져와 보게.','이건… 이름일세. 사백 년 전 재의 군주가 빼앗긴 이름의 조각이야. 위계도, 갈래도 넘어서는 길이 있다는 뜻이지. 대마법사의 자리 말일세.'],
  ['첫 대마법사들은 잿불 용암지대 아래 서고에 금서를 두었네. 지옥처럼 짙은 마나 속에서만 그 문이 보이지. 「첫 번째 화로」에 내려가 사서를 쓰러뜨리고 유품을 찾아오게.','타다 남은 서책… 여기 적힌 건 금기의 주문들일세. 자네라면 읽을 수 있겠지.'],
  ['조각을 모으는 사도들보다 먼저 가야 하네. 지옥의 공허의 옥좌에서 엘가로스를 다시 쓰러뜨리면 「재의 열쇠」가 남을 걸세. 그 열쇠로 균열 동쪽 봉인문이 열리지.','열쇠가 뜨겁군. 심연의 균열 동쪽 봉인문이 열렸을 걸세. 그 너머가 「재가 내리는 고원」이야.']],
 priest:[['엘가로스의 재에서 글자가 보였다고? 악몽의 공허의 옥좌에서 그를 다시 쓰러뜨리고 그 「재로 쓴 이름 조각」을 가져오너라.','이름이로구나… 빼앗긴 이름. 빛이 이것을 너에게 보인 데는 뜻이 있을 게다. 은총의 끝 너머, 옛 성자들의 자리가 있단다.'],
  ['심연의 균열 가장자리에 「꺼지지 않은 제단」이 있다. 지옥처럼 깊은 어둠에서만 보이지. 그곳의 눈먼 순례자를 쉬게 하고 첫 성자의 유품을 찾아오너라.','성흔 묵주… 첫 성자께서 마지막까지 쥐고 계셨던 것이다. 이제 네 손에 맡기마.'],
  ['사도들이 이름을 다 모으기 전에, 지옥의 공허의 옥좌에서 엘가로스를 쓰러뜨리고 「재의 열쇠」를 가져오너라. 그 열쇠가 봉인문을 연다.','봉인이 풀렸구나. 균열 동쪽, 재가 내리는 고원으로 가거라. 빛이 함께하길.']],
 warrior:[['엘가로스의 재에 글자가 박혀 있다더군. 악몽의 공허의 옥좌에서 놈을 다시 꺾고 「재로 쓴 이름 조각」을 가져와 봐라.','이름이라… 칼로 지킨 이름이 있었다고 들었다. 기사 위의 자리, 옛 군주들의 자리 얘기다.'],
  ['망각의 협곡 벽에 거인의 성문이 반쯤 묻혀 있다. 지옥만큼 거친 날에만 그 문이 열리지. 안뜰의 마지막 문지기를 쓰러뜨리고 첫 군주의 유품을 가져와라.','부러진 투구 장식… 끝까지 서 있던 자의 것이다. 이제 네가 이어 받아라.'],
  ['지옥의 공허의 옥좌. 엘가로스를 꺾으면 「재의 열쇠」가 떨어진다. 그걸로 균열 동쪽 봉인문을 연다.','열쇠를 쥐었군. 봉인문 너머 고원이다. 거기서 네 갈래의 시험이 기다린다.']],
 archer:[['엘가로스가 남긴 재에서 글자가 보였대. 악몽의 공허의 옥좌에서 다시 잡고 「재로 쓴 이름 조각」을 가져와.','이름이야. 활로 지킨 이름도 있었다던데. 명궁 위의 자리, 옛 신궁들 얘기야.'],
  ['폭풍 절벽 끝에 매가 돌아오지 않는 둥지가 있어. 지옥만큼 바람이 거셀 때만 보이지. 괴조왕을 떨구고 첫 신궁의 깃을 찾아와.','바람 깃이네. 첫 신궁이 마지막으로 쏜 화살에 달려 있던 거야.'],
  ['지옥의 공허의 옥좌에서 엘가로스를 잡으면 「재의 열쇠」가 남아. 그걸로 균열 동쪽 봉인문을 열어.','열렸어. 봉인문 너머 고원으로 가. 거기 시험의 방이 있어.']]};
const J3_SAY3={
  archsorcerer:['고원의 시험의 방에 금기의 서고지기가 있네. 네 원소 방패는 끝까지 외운 금기 마법으로만 깨지지. 혼자라면 기둥 뒤에서, 동료가 있다면 지켜 달라고 하게.','방패가 깨지는 소리를 들었네. 오늘부터 자네는 대마법사일세. 금기는 이제 자네 손에서 질서가 되는 걸세.'],
  spiritking:['시험의 방의 그림자는 계약을 깬 정령왕일세. 자네 소환수를 빼앗을 거야. 빼앗긴 것보다 빨리 다시 부르게.','네 정령왕이 자네 이름으로 다시 계약했네. 오늘부터 자네는 정령왕의 계약자일세.'],
  executor:['시험의 방에 거짓 성인이 셋 있다. 낙인이 진짜를 비출 것이다. 가짜에 흔들리지 말고 진짜를 집행하거라.','심판을 기도하지 않고 집행했구나. 오늘부터 너는 빛의 집행자다.'],
  saint:['시험의 방에서 순례자 다섯이 걷는다. 저주가 몇을 쓰러뜨릴 것이다. 그때 일으켜 세우는 것이 성자의 일이다. 3분을 지키거라.','아무도 길에 남겨 두지 않았구나. 오늘부터 너는 성자다.'],
  bulwark:['피난민 뒤로 세 방향에서 군단이 온다. 한 사람이 아니라 모두의 성벽이 되어 봐라.','피난민 하나 다치지 않았군. 오늘부터 너는 성벽의 군주다.'],
  warlord:['환영 기사 백. 다 쓰러뜨리면 기사단장이 결투를 청한다. 쉬지 말고 휘어잡아라.','백을 넘겼군. 오늘부터 너는 전쟁군주다.'],
  divinearcher:['별을 삼킨 괴조는 절대 가까이 오지 않아. 숨을 고르고 멀리서 떨궈.','별이 떨어지는 소리가 여기까지 들렸어. 오늘부터 넌 신궁이야.'],
  shadowhunter:['그림자 없는 짐승은 덫을 봐. 먼저 눈을 가려. 연막이든 밤이든.','짐승이 덫 앞에서 멈추는 걸 봤어. 오늘부터 넌 그림자 사냥꾼이야.']};
const J3_SAY45=[['고원 깊은 곳, 잿빛 성가대의 무덤에서 노래가 멈추지 않는다는군. 그 무덤의 주인을 쓰러뜨리면 북쪽 「불 꺼진 왕도」로 가는 길이 열릴 걸세.','노래가 멎었군. 왕도로 가는 길이 열렸네.'],
  ['불 꺼진 왕도 끝, 재의 왕좌에서 군주가 이름을 되찾으려 하고 있네. 기둥을 지키고 이름 부르기를 끊어 그를 다시 재로 돌려보내게. 혼자 가도 수호 정령이 돕겠지만, 믿는 동료와 함께 가게.','재의 군주가 이름 없이 흩어졌네. 자네 이름은 오래도록 불릴 걸세.']];
const J3_QUESTS=[];
for(const c of ['mage','priest','warrior','archer']){const p=J3_PFX[c],g=J3_GIVER[c],town=J3_TOWN[c],S=J3_SAY[c],H=J3_HIDE[c],G=J3_GUARD[H.bk];
  const Q=(o)=>J3_QUESTS.push(Object.assign({cls:c,town,giver:g,j3q:1,kind:'3차 전직'},o));
  Q({id:`j3${p}0`,st:0,lvl:85,t:'재로 쓴 이름',say:S[0][0],done:S[0][1],goals:[{type:'kill',k:['b_elgaros'],n:1,dmin:1,item:'재로 쓴 이름 조각',d:'악몽 이상의 「공허의 옥좌」에서 엘가로스 처치'}],rw:{xp:1.2,gold:20000}});
  Q({id:`j3${p}1`,st:1,lvl:92,reqs:[`j3${p}0`],t:'옛 대가의 흔적',say:S[1][0],done:S[1][1],goals:[{type:'j3room',room:c,d:`지옥 「${REGIONS[H.r]?REGIONS[H.r].n:H.r}」의 숨은 곳 「${H.n}」에서 ${G.n} 처치`}],rw:{xp:1.4,gold:30000,relic:H.relic}});
  Q({id:`j3${p}2`,st:2,lvl:96,reqs:[`j3${p}1`],t:'이름의 첫 글자',say:S[2][0],done:S[2][1],goals:[{type:'kill',k:['b_elgaros'],n:1,dmin:2,item:'재의 열쇠',d:'지옥 「공허의 옥좌」에서 엘가로스 처치'}],rw:{xp:1.5,gold:40000,seal:1}});
  JOB3_IDS[c].forEach((b3,i)=>{const T=J3_TRIAL['t3_'+b3];Q({id:`j3${p}3${'ab'[i]}`,st:3,lvl:100,reqs:[`j3${p}2`],pick3:b3,t:`갈래의 시험 (${JOB3[c][b3].n})`,say:J3_SAY3[b3][0],done:J3_SAY3[b3][1],kind:'3차 전직 · 갈래',
    goals:[{type:'j3trial',bk:'t3_'+b3,d:`「재가 내리는 고원」 시험의 방: ${T.n}`}],rw:{xp:2,gold:60000,sp:4,job3:1,uniq:'j3_'+b3}})});
  Q({id:`j3${p}4`,st:4,lvl:120,reqs:[`j3${p}3a`,`j3${p}3b`],t:'왕도의 문',say:J3_SAY45[0][0],done:J3_SAY45[0][1],goals:[{type:'j3hook',hook:'choir',d:'「잿빛 성가대의 무덤」의 주인 처치'}],rw:{xp:2,gold:90000,capital:1}});
  Q({id:`j3${p}5`,st:5,lvl:135,reqs:[`j3${p}4`],t:'재의 왕좌',say:J3_SAY45[1][0],done:J3_SAY45[1][1],goals:[{type:'j3hook',hook:'ash',d:'「재의 왕좌」에서 재의 군주 처치'}],rw:{xp:2.5,gold:150000}})}
SQ.push(...J3_QUESTS);for(const q of J3_QUESTS)SQBY[q.id]=q;
for(const c in J3_GIVER){const F=TWFOLK[J3_GIVER[c]];if(F&&F.lines)F.lines.push(c==='mage'?'재로 쓴 이름… 들어 본 적 있나?':c==='priest'?'빛은 이름을 기억한단다.':c==='warrior'?'군주라는 말, 아직은 무겁지?':'바람이 고원 쪽으로 분다.')}
const j3QOf=(st,c)=>J3_QUESTS.filter(q=>q.cls===(c||P.cls)&&q.st===st);
const j3Done=st=>{const s=sqState();return j3QOf(st).some(q=>s.d[q.id]>0)};

/* ===== 진행 단계 · 바깥(WORLD)에서 부르는 것 ===== */
const J3Q={trialAt:null,hookAt:{},
  stage(){let n=0;for(let st=0;st<=5;st++){if(j3Done(st))n=st+1;else break}if(P.job3&&n<4)n=4;return n},
  sealOpen(){return !!P&&(j3Done(2)||!!P.job3)},
  capitalOpen(){return !!P&&j3Done(4)},
  trialOpen(){return !!j3TrialGoal()},
  enterTrial(){const h=j3TrialGoal();if(!h){msg(P.job3?'이미 갈래의 시험을 마쳤습니다':'지금 받은 「갈래의 시험」 의뢰가 없습니다 (전직관의 의뢰)','#a39d8f');return false}return j3TrialEnter(h)},
  onChoirBossKill(){j3HookGoal('choir')},
  onAshLordKill(){j3HookGoal('ash');const Q=j2Q();if(!Q.j3ash){Q.j3ash=1;P.sp+=2;banner={t:'재의 군주 첫 처치',sub:'스킬 포인트 +2',col:'#ffd76a',life:3,max:3};msg('재의 군주를 처음 쓰러뜨렸습니다: 스킬 포인트 +2 (스킬 트리 T)','#ffd76a');j3Mirror();save();return true}return false}};
function j3HookGoal(hk){const s=sqState();for(const id in s.a){const q=SQBY[id];if(!q||!q.j3q)continue;q.goals.forEach((g,j)=>{if(g.type==='j3hook'&&g.hook===hk&&!sqGoalDone(q,j))sqProgress(q,j,1)})}}
function j3TrialGoal(){const s=sqState();for(const id in s.a){const q=SQBY[id];if(!q||!q.j3q||q.cls!==P.cls)continue;for(let j=0;j<q.goals.length;j++){const g=q.goals[j];if(g.type==='j3trial'&&!sqGoalDone(q,j))return{q,j,g}}}return null}
function j3RoomGoal(c){const s=sqState();for(const id in s.a){const q=SQBY[id];if(!q||!q.j3q)continue;for(let j=0;j<q.goals.length;j++){const g=q.goals[j];if(g.type==='j3room'&&(!c||g.room===c)&&!sqGoalDone(q,j))return{q,j,g}}}return null}

/* ===== 의뢰 창 · 목표 ===== */
{const _a=sqAvail;sqAvail=function(q){if(!q||!q.j3q)return _a(q);if(q.cls!==P.cls||!P.job2)return 'hidden';
  if(q.pick3&&q.pick3!==JOB3_OF[P.job2])return 'hidden';const s=sqState();if(s.a[q.id])return 'active';if(s.d[q.id])return 'done';
  if(q.reqs&&!q.reqs.some(r=>s.d[r]>0))return 'locked';if(P.lvl<q.lvl)return 'low';return 'ok'}}
// 난이도가 붙은 처치 목표: 그 난이도 이상에서만 센다
{const _p=sqProgress;sqProgress=function(q,j,n,silent){const g=q&&q.goals&&q.goals[j];if(g&&g.dmin&&(P.diff|0)<g.dmin){if(!silent||g.k)ftext(P.x,P.y-30,`${DIFF[g.dmin].n} 이상에서만`,'#a39d8f',false,70);return}
  const r=_p(q,j,n,silent);if(g&&g.item&&q.j3q&&sqGoalDone(q,j))msg(`「${g.item}」을(를) 얻었습니다`,'#ffcf7a');return r}}
const J3_THRONE=()=>{const L=RCACHE.abyss,c=L&&L.caves?L.caves.find(c=>c.cave&&c.cave.id==='ab_throne'):null;return c?{reg:'abyss',x:c.x,y:c.y,label:`${REGIONS.abyss.n} · 던전 「공허의 옥좌」`}:null};
{const _t=sqTarget;sqTarget=function(q){if(!q||!q.j3q)return _t(q);const a=sqState().a[q.id];if(!a||sqAllDone(q))return _t(q);
  for(let j=0;j<q.goals.length;j++){if(sqGoalDone(q,j))continue;const g=q.goals[j];
    if(g.type==='kill'&&g.k.includes('b_elgaros'))return J3_THRONE();
    if(g.type==='j3room')return J3SPOT[g.room]||null;
    if(g.type==='j3trial')return J3Q.trialAt||(()=>{const t=j2NpcAt(q.giver);return t?Object.assign({},t,{label:`${t.label} · 시험의 방`}):null})();
    if(g.type==='j3hook')return J3Q.hookAt[g.hook]||null;break}
  return _t(q)}}
{const _f=sqFinish;sqFinish=function(id){const q=SQBY[id];if(!q||!q.j3q)return _f(id);const s=sqState(),n0=s.d[id]|0;_f(id);if((s.d[id]|0)<=n0)return;j3Reward(q)}}
function j3Reward(q){const r=q.rw,Q=j2Q(),k='j3_'+J3_PFX[q.cls]+q.st;
  if(r.sp&&!Q[k]){Q[k]=1;P.sp+=r.sp;msg(`의뢰 보상: 스킬 포인트 +${r.sp} (스킬 트리 T)`,'#ffd76a')}
  if(r.relic)msg(`대가의 유품 「${r.relic}」을(를) 전직관에게 맡겼습니다`,'#ffcf7a');
  if(r.seal)msg('「재의 열쇠」로 심연의 균열 동쪽 봉인문이 열렸습니다 (지옥 난이도)','#ffcf7a');
  if(r.capital)msg('「불 꺼진 왕도」로 가는 길이 열렸습니다','#ffcf7a');
  if(r.uniq)j3GiveUniq(r.uniq);
  if(r.job3&&q.pick3&&!P.job3)j3Advance(q.pick3);
  j3Mirror();updateHud();save()}
function j3Advance(br){const J=JOB3[P.cls]&&JOB3[P.cls][br];if(!J||JOB3_OF[P.job2]!==br)return false;P.job3=br;P._job3raw=null;J2UI.tab='j3';passT=-1;
  banner={t:`3차 전직 · ${J.n}`,sub:`스킬 트리(T)에 「${J.tree}」 탭이 열렸습니다 · 칭호 「${J.title}」`,col:'#ffcf7a',life:4,max:4};flash={col:'#ffcf7a',a:.3};shake=Math.max(shake,6);
  for(let i=0;i<3;i++)rings.push({x:P.x,y:P.y,r:10,max:160+i*90,life:.8+i*.25,col:i?'#ffe9b0':'#ffcf7a'});burst(P.x,P.y,'#ffcf7a',90,280,4,30);
  msg(`3차 전직: 이제 ${J.n}입니다. ${J.desc}`,'#ffcf7a');msg('스킬 트리(T)의 3차 탭에서 새 기술을 찍으세요 (3차 기술은 최대 10점)','#ffcf7a');j3Mirror();buildBar();updateHud();return true}
function j3MakeUniq(k){const u=J3U[k];if(!u)return null;const il=100,ph=PHYS_CLS[u.cls];
  const it={id:uid++,slot:u.slot,rar:4,name:u.n,il,stats:ph?fixedStatsV18(u.st,il,u.wt):fixedStats(u.st,il),cls:u.cls,lore:u.lore,j3u:k};if(u.wt)it.wt=u.wt;return it}
function j3GiveUniq(k){const it=j3MakeUniq(k);if(!it)return;if(P.bag.length<sqBagCap()){P.bag.push(it);msg(`보상: ${it.name}`,RAR[4].c)}else{loot.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),kind:'item',item:it,t:0,keep:1});msg(`가방이 가득 차 ${it.name}을(를) 발밑에 두었습니다`,RAR[4].c)}}
{const _r=sqRwHtml;sqRwHtml=function(q){let h=_r(q);if(!q||!q.j3q)return h;const r=q.rw,a=[];const k='j3_'+J3_PFX[q.cls]+q.st;
  if(r.sp)a.push(j2Q()[k]?`<span class="muted">스킬 포인트 +${r.sp} (이미 받음)</span>`:`<b style="color:#ffd76a">스킬 포인트 +${r.sp}</b>`);
  if(r.job3&&q.pick3)a.push(`<b style="color:#ffcf7a">3차 전직 「${JOB3[q.cls][q.pick3].n}」</b>`);if(r.uniq&&J3U[r.uniq])a.push(`<b style="color:${RAR[4].c}">갈래 상징 「${J3U[r.uniq].n}」 (3차 계열 +1)</b>`);
  if(r.seal)a.push('<b style="color:#ffcf7a">봉인문 열림</b>');if(r.capital)a.push('<b style="color:#ffcf7a">왕도로 가는 길</b>');if(q.st===5)a.push(`<span class="muted">재의 군주 첫 처치 스킬 포인트 +2${j2Q().j3ash?' (이미 받음)':''}</span>`);
  return a.length?h.replace(/<\/p>$/,` · ${a.join(' · ')}</p>`):h}}
// 알림판 · 일지: 3차 의뢰는 주황 「3차」 표 (메인 · 마을 의뢰와 다르게)
{const _s=sqHudBlocks;sqHudBlocks=function(){const o=_s(),s=sqState();for(const b of o)for(const id in s.a){const q=SQBY[id];if(q&&q.j3q&&b.t.endsWith(q.t)&&!b.t.includes('qtg j3')){b.t=J3TAG+q.t;b.j3=1;break}}return o}}
{const _l=sqLogHtml;sqLogHtml=function(){let h=_l();for(const q of J3_QUESTS){if(q.cls!==P.cls)continue;h=h.split(`<b>${WXTAG.s}${q.t}</b>`).join(`<b>${J3TAG}${q.t}</b>`).split(`! <b>${q.t}</b>`).join(`! <b>${J3TAG}${q.t}</b>`)}
  if(!P.job2)return h;const s=sqState(),list=J3_QUESTS.filter(q=>q.cls===P.cls&&(!q.pick3||q.pick3===JOB3_OF[P.job2]));
  h+=`<h2>${J3TAG}3차 전직 · 재로 쓴 이름</h2><p class="muted">${P.job3?`3차 전직 「${JOB3[P.cls][P.job3].n}」`:`3차 전직은 레벨 ${J3LV}, 갈래의 시험 뒤`} · 봉인문 ${J3Q.sealOpen()?'열림':'닫힘'} · 왕도 ${J3Q.capitalOpen()?'열림':'닫힘'}</p><ul class="qgoals">`+
    list.map(q=>{const d=s.d[q.id]>0,a=!!s.a[q.id];return `<li class="${d?'ok':''}">${d?'✓':a?'…':'○'} ${q.st}. ${q.t} <span class="muted">레벨 ${q.lvl}${q.rw.sp?` · 스킬 포인트 ${q.rw.sp}`:q.st===5?' · 재의 군주 첫 처치 스킬 포인트 2':''}</span></li>`}).join('')+'</ul>';return h}}
// 전직관: 시험의 방 문(고원 입구가 아직 없을 때만)
{const _nh=sqNpcHtml;sqNpcHtml=function(){let h=_nh();const f=SQV.npc;if(!f||J2_INSTR[f.id]!==P.cls)return h;const g=j3TrialGoal();
  if(g&&!J3Q.trialAt){const t=TYPES[g.g.bk];h+=`<div class="j2swap"><b>시험의 방</b> <span class="muted">· ${t.n} · 레벨 ${t.lvl}</span><p class="muted" style="margin:4px 0">${t.note}${NET.guest?' · 같이 하기에서는 방장이 들어가면 파티가 함께 갑니다':''}</p><div class="row"><button class="primary" type="button" data-j3trial="1">시험의 방으로 들어가기</button></div></div>`}
  return h}}
{const _qc=questClick;questClick=function(b){if(b.dataset.j3trial){J3Q.enterTrial();return true}return _qc(b)}}

/* ===== 숨은 곳 입구 (기존 지역의 지옥판에만 보인다) ===== */
const J3SPOT={};
for(const c in J3_HIDE){const H=J3_HIDE[c],reg=H.r,L=RCACHE[reg];if(!L||!L.town)continue;const T=L.town,lx=L.lair?L.lair.x:T.x+900,ly=L.lair?L.lair.y:T.y+900;
  const ok=L.lq?(L.okT||(L.okT=wxReach(L.lq,T.x,T.y))):null,dx=lx-T.x,dy=ly-T.y,l=Math.hypot(dx,dy)||1;let p=null;
  for(const f of [.62,.58,.66,.54,.7,.5])for(const o of [180,-180,300,-300,90,-90]){if(p)break;const x=T.x+dx*f-dy/l*o,y=T.y+dy*f+dx/l*o;if(x<60||y<60||x>WORLD-60||y>WORLD-60)continue;
    if(!wxLiq(L,x,y)&&(!ok||wxCanReach(ok,x,y))&&!L.decor.some(d=>Math.abs(d.x-x)<50&&Math.abs(d.y-y)<50))p={x,y}}
  if(!p)p={x:T.x+dx*.6,y:T.y+dy*.6};
  L.decor.push({x:p.x,y:p.y,k:'altar',pv:0,use:'j3hide_'+c,qonly:1,tprop:1,s:1,v:0,zl:0});J3SPOT[c]={reg,x:p.x,y:p.y,label:`${REGIONS[reg].n} (지옥) · ${H.at}`};if(REG.id===reg&&!IN&&!DG)setArr(decor,L.decor)}
{const _l=sqUseLive;sqUseLive=function(d){if(!d||typeof d.use!=='string'||!d.use.startsWith('j3hide_'))return _l(d);const c=d.use.slice(7),h=j3RoomGoal(c);if(!h||P.cls!==c||P.diff!==2)return null;
  return{label:`숨은 곳 「${J3_HIDE[c].n}」으로 들어가기`,col:'#ffcf7a',q:1}}}
{const _u=sqUse;sqUse=function(d){if(!d||typeof d.use!=='string'||!d.use.startsWith('j3hide_'))return _u(d);const c=d.use.slice(7),h=j3RoomGoal(c);if(!h||P.cls!==c||P.diff!==2)return;j3HideEnter(c)}}

/* ===== 방 하나짜리 던전 (숨은 곳 · 시험의 방): 같은 모양을 참가자도 만든다 ===== */
const J3_ROOM_ORDER=['t3_archsorcerer','t3_spiritking','t3_executor','t3_saint','t3_bulwark','t3_warlord','t3_divinearcher','t3_shadowhunter','g3_mage','g3_priest','g3_warrior','g3_archer'];
function j3RoomSpec(bk){const t=TYPES[bk],g=t.g,trial=t.j3t===1,big=g==='refugees'||g==='hundred'||g==='pilgrims';
  return{bk,lvl:t.lvl,w:big?18:15,h:big?18:15,pil:g==='shield'||g==='sky'?1:0,theme:trial?'trial':J3_HIDE[Object.keys(J3_HIDE).find(c=>J3_HIDE[c].bk===bk)].theme,n:trial?'시험의 방':J3_HIDE[Object.keys(J3_HIDE).find(c=>J3_HIDE[c].bk===bk)].n}}
function j3BuildRoom(sp){const R0={i:Math.floor((DN-sp.w)/2),j:Math.floor((DN-sp.h)/2),w:sp.w,h:sp.h},g=new Uint8Array(DN*DN);R0.cx=R0.i+(R0.w>>1);R0.cy=R0.j+(R0.h>>1);
  for(let y=R0.j;y<R0.j+R0.h;y++)for(let x=R0.i;x<R0.i+R0.w;x++)g[tIdx(x,y)]=1;
  if(sp.pil)for(const [a,b] of [[.3,.35],[.7,.35],[.3,.65],[.7,.65]])g[tIdx(R0.i+Math.round(R0.w*a),R0.j+Math.round(R0.h*b))]=0;
  const th=sp.theme==='trial'?J3_ROOM_TH.trial:(WX_DUNGEONS.find(d=>d.id===sp.theme)||J3_ROOM_TH.trial),base=DUNGEONS.find(d=>d.id==='sanctum')||DUNGEONS[0];
  const ci=900+Math.max(0,J3_ROOM_ORDER.indexOf(sp.bk));
  const D={d:Object.assign({},base,{n:sp.n,mobs:[],minis:[],boss:sp.bk,trial:1,floor:th.floor,wall:th.wall,torch:th.torch,j3:1}),ci,g,rooms:[R0],ret:{x:P.x,y:P.y},lvl:sp.lvl,flow:null,ft:-1,portals:[],walls:[],torches:[],floor:[],bossDead:false,boss:null,start:R0};
  for(let j=0;j<DN;j++)for(let i=0;i<DN;i++){if(g[tIdx(i,j)]===1){D.floor.push([i,j]);continue}
    let adj=false;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<DN&&y<DN&&g[tIdx(x,y)]===1)adj=true}
    if(adj){const c2=tc(i,j);D.walls.push({x:c2.x,y:c2.y,i,j,wall:1,h:120});if((i+j)%5===0){const sides=[[1,0],[0,1],[-1,0],[0,-1]].filter(([a,b])=>g[tIdx(i+a,j+b)]===1);if(sides.length){const [a,b]=sides[0];D.torches.push({x:c2.x+a*52,y:c2.y+b*52,light:150,torch:1})}}}}
  const st=tc(R0.i+2,R0.j+R0.h-3);D.portals.push({x:st.x-60,y:st.y+70,exit:1});D.st=st;return D}
function j3RoomGo(sp,qinfo){if(DG||P.dead)return false;if(NET.guest){msg('같이 하기에서는 방장이 들어가면 파티가 함께 들어갑니다','#a39d8f');return false}
  if(!panel.hidden)closePanel();if(IN)twLeave(true);if(J3CH)j3ChargeStop();
  DG=j3BuildRoom(sp);const st=DG.st,t=TYPES[sp.bk];
  enemies=[];projs=[];fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];P.x=st.x;P.y=st.y;for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}
  DG.j3t=Object.assign({spec:sp,bk:sp.bk,g:t.g||'guard',t:0,res:0,npcs:[],e:null,k:0,ph:0,wt:0,ev:0,shT:0},qinfo||{});
  j3Setup(DG.j3t);followCam();banner={t:`${sp.n} · ${t.n}`,sub:t.note,col:'#ffcf7a',life:3.4,max:3.4};msg(`${sp.n}: ${t.note}`,'#ffcf7a');save();return true}
function j3TrialEnter(h){if(!h)return false;if(P.lvl<J3LV){msg(`레벨 ${J3LV}부터 들어갈 수 있습니다`,'#a39d8f');return false}return j3RoomGo(j3RoomSpec(h.g.bk),{q:h.q.id,j:h.j})}
function j3HideEnter(c){const h=j3RoomGoal(c);if(!h)return false;return j3RoomGo(j3RoomSpec(J3_HIDE[c].bk),{q:h.q.id,j:h.j,hide:c})}
// 같이 하기: 방장의 방을 참가자도 같은 모양으로 만든다
{const _nd=netDgData;netDgData=function(){const d=_nd();if(DG&&DG.j3t)d.j3=DG.j3t.spec;return d}}
{const _ne=netEnterDg;netEnterDg=function(D){if(!D||!D.j3||!TYPES[D.j3.bk])return _ne(D);const rg=REGIONS[D.reg]?D.reg:'home';if(REG.id!==rg)loadRegion(rg);
  enemies=[];projs=projs.filter(p=>p.owner==='p');fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  DG=j3BuildRoom(D.j3);DG.net=1;DG.ret=D.ret||DG.ret;DG.bossDead=!!D.bd;DG.j3t={spec:D.j3,bk:D.j3.bk,g:TYPES[D.j3.bk].g||'guard',guest:1,npcs:[],t:0,res:0};const st=DG.st;P.x=st.x;P.y=st.y;followCam();
  banner={t:`${D.j3.n} · ${TYPES[D.j3.bk].n}`,sub:TYPES[D.j3.bk].note,col:'#ffcf7a',life:3,max:3};msg(`${D.j3.n}: ${TYPES[D.j3.bk].note}`,'#ffcf7a')}}

/* ===== 방 안의 규칙 (방장 · 혼자) ===== */
const J3_NPC_L={pil:J2_PIL_L,ref:{key:'j3ref',body:'#8a7a6a',cape:'#5a4a3a',hair:'#3a2a1a',hs:4,hat:0,prop:'',dress:1}};
const j3Tc=(T,fx,fy)=>{const R0=DG.rooms[0];return tc(R0.i+Math.round((R0.w-1)*fx),R0.j+Math.round((R0.h-1)*fy))};
function j3Npc(T,o){const a=Object.assign({ally:1,j3n:1,max:o.hp,dmg:0,t:1e9,atkCd:9,anim:R()*3,fx:1,lunge:0,hurt:0,walkT:0,moving:false,face:1,rv:0,down:0,s:{id:'j3npc',n:o.n,kind:'escort',el:'holy',cls:''}},o);T.npcs.push(a);allies.push(a);return a}
function j3Boss(T,k,fx,fy){const p=j3Tc(T,fx==null?.8:fx,fy==null?.2:fy),e=dgMob(k,p.x,p.y,DG.lvl);if(TYPES[k].j3t===1){e.hp=e.max=Math.round(e.max/(DIFF[P.diff].hp||1))}e.aggroed=true;e.j3=1;
  rings.push({x:e.x,y:e.y,r:10,max:160,life:.8,col:TYPES[k].col});return e}
function j3Mob(k,x,y,lvl){const m=dgMob(k,x+rnd(-20,20),y+rnd(-20,20),lvl||DG.lvl-2);m.hp=m.max=Math.round(m.max/(DIFF[P.diff].hp||1));m.aggroed=true;m.j3m=1;return m}
function j3Setup(T){const t=TYPES[T.bk];
  if(T.g==='pilgrims'){const hp=Math.round(maxHp()*.7);for(let i=0;i<5;i++){const p=j3Tc(T,.2+i*.07,.75-i*.04);j3Npc(T,{j3pil:1,x:p.x,y:p.y,hp,r:13,n:'순례자'})}T.end=180;T.curse=[60,120];T.wt=3;msg('순례자 다섯이 나를 따라 걷습니다. 끝날 때 셋 이상 서 있어야 합니다','#9fe0ff');return}
  if(T.g==='refugees'){const p=j3Tc(T,.5,.85);j3Npc(T,{ref:1,x:p.x,y:p.y,hp:Math.round(maxHp()*5),r:30,n:'피난민'});T.ph=1;T.nw=3;j3Lanes(T,1);msg('군단은 피난민을 노립니다. 도발로 붙잡으세요','#9fe0ff');return}
  if(T.g==='hundred'){T.k=0;T.need=100;T.ph=1;return}
  if(T.g==='clones'){const real=ri(0,2);T.cl=[];for(let i=0;i<3;i++){const e=j3Boss(T,T.bk,.25+i*.25,.25);e.j3cl=i===real?2:1;if(i!==real){e.max=e.hp=Math.round(e.max*.35);e.xpNo=1}T.cl.push(e);if(i===real){T.e=e;DG.boss=e}}T.shuf=20;T.flick=30;return}
  T.e=j3Boss(T,T.bk);DG.boss=T.e;
  if(T.g==='shield'){T.els=['fire','ice','storm','earth'];T.ei=0;j3ShieldOn(T)}
  if(T.g==='steal')T.stl=9;if(T.g==='sky')T.swoop=14;if(T.g==='beast')T.night=22}
function j3Lanes(T,n){const lanes=[[.06,.5],[.5,.06],[.94,.5]];for(const [fx,fy] of lanes){const p=j3Tc(T,fx,fy);for(let i=0;i<4;i++)j3Mob('t3_legion',p.x,p.y).j3w=n}banner={t:`${n}번째 군단`,sub:'세 방향에서 옵니다',col:'#ff9a6a',life:1.8,max:1.8}}
function j3ShieldOn(T){const e=T.e;if(!e||e.dead)return;const el=T.els[T.ei++%T.els.length];e.j3sh=el;T.shT=0;ftext(e.x,e.y,`${ELN[el]} 방패`,EL[el],true,90);rings.push({x:e.x,y:e.y,r:10,max:140,life:.6,col:EL[el]})}
function j3Event(k){const T=DG&&DG.j3t;if(!T||T.res||T.guest)return;if(T.g==='shield'&&T.e&&T.e.j3sh&&(k==='cast'||k==='chan'||k==='charge')){const e=T.e;rings.push({x:e.x,y:e.y,r:10,max:200,life:.7,col:'#fff2c0'});burst(e.x,e.y,EL[e.j3sh]||'#fff',50,240,3.5,30);shake=Math.max(shake,6);
  msg('금기 마법을 끝까지 외워 방패를 깨뜨렸습니다! 7초','#ffd76a');e.j3sh=null;T.shT=7;breakAdd(e,25)}}
// 받는 피해: 방패 · 그림자 갑옷 · 진짜/가짜 · 하늘 · 시야
function j3DmgK(e,s,from){const T=DG&&DG.j3t;if(!T||!e||!e.j3)return 1;const g=T.g;
  if(g==='shield')return e.j3sh?.12:1.15;
  if(g==='steal')return j3MySummons()<2&&!(e.brk>0)?.3:1;
  if(g==='clones'){if(e.j3cl===1)return .6;return e.j3rev>0?1.2:.25}
  if(g==='sky'){if(e.j3gnd>0||e.brk>0)return 1.4;return from&&dist(from,e)>=420?1:.3}
  if(g==='beast'){const blind=e.blindT>0||e.rootT>0||e.stunT>0||e.freezeT>0||T.nightT>0||e.brk>0;if(s&&s.kind==='trap'&&!blind){return .1}return blind?1.25:.35}
  return 1}
const j3MySummons=()=>allies.filter(a=>!a.gone&&!a.j3n&&a.s&&a.s.kind==='summon'&&a.hp>0).length;
{const _he=hurtE;hurtE=function(e,amt,s){const T=DG&&DG.j3t;if(T&&e&&!e.dead&&e.j3&&s&&!s.ghost&&!T.guest){const h0=e.hp;
    if(T.g==='clones'&&(s.mark||s.id==='heresybrand'||s.job3==='executor'))j3Mark(T,e);
    if(T.g==='beast'&&s.kind==='trap'&&!(e.blindT>0||e.rootT>0||e.stunT>0||T.nightT>0)){ftext(e.x,e.y,'덫을 피함','#c8b0ff',false,e.r*2+30)}
    if(T.g==='sky'&&(s.mult||0)>=5)breakAdd(e,20);
    const r=_he(e,amt*j3DmgK(e,s,P),s);void h0;return r}
  return _he(e,amt,s)}}
{const _nm=netOnMsg;netOnMsg=function(m){if(m&&m.t==='dmg'&&NET.host&&DG&&DG.j3t){const e=enemies.find(o=>o.id===m.id);if(e&&e.j3)m=Object.assign({},m,{a:Math.max(1,Math.round((+m.a||0)*j3DmgK(e,null,NET.peers.get(m.from)||null)))})}return _nm(m)}}
function j3Mark(T,e){if(e.j3cl===2){if(!(e.j3rev>0))msg('낙인이 진짜를 비췄습니다! 지금 집행하세요','#fff2a0');e.j3rev=10;rings.push({x:e.x,y:e.y,r:10,max:120,life:.6,col:'#fff2a0'})}
  else if(e.j3cl===1&&!e.dead){burst(e.x,e.y,'#fff2c0',40,200,3,30);msg('가짜였습니다 — 빛 속으로 흩어집니다','#c8c0a0');e.dead=true;e.gone=true;killFx(e);T.back=(T.back||[]).concat([{t:12,i:T.cl.indexOf(e)}])}}
// 시전이 끝나는 순간 (금기 마법 · 채널링 · 모으기)
{const _cr=_castRelease;_castRelease=function(cu){const r=_cr(cu);if(cu&&!GHOST)j3Event('cast');return r}}
let j3ChPrev=null,j3ChLast=null;
function j3RoomTick(dt){const T=DG&&DG.j3t;if(!T){if(allies.some(a=>a.j3n))allies=allies.filter(a=>!a.j3n);return}
  T.t+=dt;if(T.guest){j3GuestTick(T,dt);return}
  const ch=CAST.ch;if(j3ChPrev&&ch!==j3ChPrev&&j3ChPrev.t>=j3ChPrev.dur-1e-3)j3Event('chan');j3ChPrev=ch;
  if(J3CH_LAST&&J3CH_LAST!==j3ChLast){j3ChLast=J3CH_LAST;if(J3CH_LAST.f>=.8)j3Event('charge')}
  if(NET.host){T.ns=(T.ns||0)-dt;if(T.ns<=0){T.ns=.2;j3Send('tn',{a:T.npcs.map(a=>[Math.round(a.x),Math.round(a.y),Math.round(a.hp),Math.round(a.max),a.down?1:0,a.ref?1:0,+(a.face||1)])})}}
  if(T.res)return;const e=T.e,t=TYPES[T.bk];
  for(const o of enemies){if(o.j3rev>0)o.j3rev-=dt;if(o.j3gnd>0)o.j3gnd-=dt}
  if(T.nightT>0)T.nightT-=dt;
  // 졸개 무리
  if(T.g==='refugees'&&T.ph>0&&T.ph<=T.nw&&!enemies.some(o=>!o.dead&&o.j3w===T.ph)){T.ph++;if(T.ph<=T.nw)j3Lanes(T,T.ph);else{T.ph=99;T.e=j3Boss(T,T.bk,.5,.1);DG.boss=T.e;msg(`${t.n}이(가) 나타났습니다`,t.col)}}
  if(T.g==='hundred'&&T.ph===1){const alive=enemies.filter(o=>!o.dead&&o.j3m).length,left=T.need-T.k-alive;if(alive<14&&left>0){T.wt-=dt;if(T.wt<=0){T.wt=.5;const p=j3Tc(T,rnd(.1,.9),rnd(.05,.4));const n=Math.min(left,ri(2,4));for(let i=0;i<n;i++)j3Mob('t3_phantom',p.x,p.y)}}
    if(T.k>=T.need&&!alive){T.ph=2;T.e=j3Boss(T,T.bk,.5,.2);DG.boss=T.e;banner={t:'환영 기사단장',sub:'결투를 청합니다',col:t.col,life:2.4,max:2.4};msg('환영 기사 100을 넘었습니다. 기사단장이 결투를 청합니다','#ffd76a')}}
  if(T.g==='pilgrims'){T.wt-=dt;if(T.wt<=0&&T.t<T.end){T.wt=11;const p=j3Tc(T,rnd(.1,.9),.05);for(let i=0;i<4;i++)j3Mob('t3_wisp',p.x,p.y)}
    for(const c of T.curse)if(T.t>=c&&!(T['c'+c])){T['c'+c]=1;const up=T.npcs.filter(a=>!a.down);for(let i=0;i<2&&up.length;i++){const a=up.splice(ri(0,up.length-1),1)[0];a.hp=0}msg('저주의 종소리 — 순례자 둘이 쓰러졌습니다! 치유를 모아 일으키세요','#ff9a6a');banner={t:'저주의 종소리',sub:'쓰러진 순례자를 치유로 일으키세요',col:'#c8c8ff',life:2.2,max:2.2}}
    if(T.t>=T.end){const up=T.npcs.filter(a=>!a.down).length;return j3End(up>=3,`순례자가 ${up}명만 서 있습니다 (셋 이상 필요)`)}}
  // 보스 기믹
  if(e&&!e.dead&&e.hp>0){
    if(T.g==='shield'&&!e.j3sh){T.shT-=dt;if(T.shT<=0)j3ShieldOn(T)}
    if(T.g==='steal'){T.stl-=dt;if(T.stl<=0){T.stl=9;const mine=allies.filter(a=>!a.gone&&!a.j3n&&a.s&&a.s.kind==='summon');if(mine.length){let b=mine[0],bd=1e9;for(const a of mine){const d=dist(a,e);if(d<bd){bd=d;b=a}}b.gone=true;allies=allies.filter(a=>!a.gone);j3Mob('i_elem',b.x,b.y,DG.lvl-4).j3stl=1;zap({x:e.x,y:e.y,z:40},{x:b.x,y:b.y,z:20},{life:.4,w:3,col:'#bfeeff',glow:'#8fd8ff'});msg(`${t.n}이(가) 내 소환수를 빼앗았습니다 — 다시 부르세요`,'#8fd8ff')}}}
    if(T.g==='sky'&&!(e.freezeT>0||e.stunT>0||e.rootT>0||e.brk>0||e.j3gnd>0)){T.swoop-=dt;const d=dist(e,P);
      if(T.swoop<=0){T.swoop=14;e.j3gnd=3.5;e.x=P.x+rnd(-90,90);e.y=P.y+rnd(-90,90);const l=DG?dgLand(P.x,P.y,e.x,e.y):e;e.x=l.x;e.y=l.y;rings.push({x:e.x,y:e.y,r:10,max:160,life:.6,col:t.col});shake=Math.max(shake,6);msg(`${t.n}이(가) 내려앉았습니다! 지금!`,'#ffd76a')}
      else if(d<500&&d>0){const sp=t.spd*(e.slowT>0?.45:1)*dt;moveBody(e,(e.x-P.x)/d*sp,(e.y-P.y)/d*sp)}}
    if(T.g==='beast'){T.night-=dt;if(T.night<=0){T.night=24;T.nightT=6;flash={col:'#1a1428',a:.35};msg('밤이 내립니다 — 짐승이 덫을 보지 못합니다 (6초)','#c8b0ff')}}
    if(T.g==='clones'){T.shuf-=dt;T.flick-=dt;if(T.back)for(const b of T.back.slice()){b.t-=dt;if(b.t<=0){T.back.splice(T.back.indexOf(b),1);const n=j3Boss(T,T.bk,.25+b.i*.25,.25);n.j3cl=1;n.max=n.hp=Math.round(n.max*.35);n.xpNo=1;T.cl[b.i]=n;msg('흩어진 가짜가 다시 모습을 드러냅니다','#c8c0a0')}}
      if(T.shuf<=0){T.shuf=20;const L=T.cl.filter(o=>!o.dead);const pos=L.map(o=>({x:o.x,y:o.y})).sort(()=>R()-.5);L.forEach((o,i)=>{o.x=pos[i].x;o.y=pos[i].y;o.j3rev=0;burst(o.x,o.y,'#fff2c0',20,140,3,30)});msg('성인들이 자리를 바꿨습니다','#c8c0a0')}
      if(T.flick<=0){T.flick=30;e.j3rev=Math.max(e.j3rev||0,3);rings.push({x:e.x,y:e.y,r:10,max:100,life:.5,col:'#fff2a0'})}}
    if(t.keepAway&&T.g!=='sky'&&!(e.freezeT>0||e.stunT>0||e.rootT>0)){const d=dist(e,P);if(d<320&&d>0){const sp=t.spd*(e.slowT>0?.45:1)*dt*.8;moveBody(e,(e.x-P.x)/d*sp,(e.y-P.y)/d*sp)}}}
  // 엔피시
  for(const a of T.npcs){if(a.hp<=0&&!a.down){a.down=1;a.hp=0;a.rv=0;burst(a.x,a.y,'#c8c8ff',20,120,3,20);if(a.j3pil)msg('순례자가 쓰러졌습니다','#ff9a6a')}if(!a.down&&a.j3pil)a.hp=Math.min(a.max,a.hp+a.max*.008*dt)}
  if(T.npcs.length&&T.g==='pilgrims'&&T.npcs.every(a=>a.down))return j3End(false,'순례자가 모두 쓰러졌습니다');
  if(T.g==='refugees'&&T.npcs[0]&&T.npcs[0].down)return j3End(false,'피난민이 무너졌습니다');
  if(T.g!=='pilgrims'&&e&&(e.dead||e.hp<=0||!enemies.includes(e))&&T.ph!==1)j3End(true)}
// 환영 기사 세기
{const _k=killE;killE=function(e){const T=DG&&DG.j3t;if(T&&!T.guest&&e&&e.k==='t3_phantom'&&!e.dead){T.k++;if(T.k%10===0||T.k>=T.need)ftext(P.x,P.y-40,`환영 기사 ${Math.min(T.k,T.need)}/${T.need}`,'#c8d0ff',true,90)}return _k(e)}}
// 가짜 성인은 쓰러뜨려도 경험치 · 전리품이 없다
{const _rk=rewardKill;rewardKill=function(e){if(e&&e.j3&&e.xpNo){questKill(e);return}return _rk(e)}}
// 몬스터는 순례자 · 피난민을 노린다 (도발되면 도발한 사람)
{const _et=enemyTarget;enemyTarget=function(e){const o=_et(e),T=DG&&DG.j3t;if(!T||T.res||T.guest||!(T.g==='pilgrims'||T.g==='refugees')||!e.j3m)return o;
  if((e.tnt&&e.tnt.t>time)||e.tauntT>0)return o;let b=null,bd=1e9;for(const a of T.npcs){if(a.down)continue;const d=dist(e,a);if(d<bd){bd=d;b=a}}return b&&(T.g==='refugees'||bd<o.d+260)?{tg:b,d:bd}:o}}
// 치유가 순례자에게도 (쓰러진 순례자는 치유를 모아 일으킨다)
{const _hl=healP;healP=function(n){_hl(n);const T=DG&&DG.j3t;if(!T||T.guest||!T.npcs.length||!(n>0)||T.res)return;const k=n/Math.max(1,maxHp());
  for(const a of T.npcs){if(dist(a,P)>460)continue;if(a.down){a.rv+=k;ftext(a.x,a.y,`일으키는 중 ${Math.min(100,Math.round(a.rv/.6*100))}%`,'#ffe39a',false,40);if(a.rv>=.6)j3Raise(a,.5)}else{const g=Math.round(a.max*k);if(g>0)a.hp=Math.min(a.max,a.hp+g)}}}}
function j3Raise(a,pct){a.down=0;a.rv=0;a.hp=Math.round(a.max*pct);if(!allies.includes(a))allies.push(a);rings.push({x:a.x,y:a.y,r:6,max:90,life:.8,col:'#ffe39a'});burst(a.x,a.y,'#fff2c0',30,140,3,30);msg(`${a.n}을(를) 일으켰습니다`,'#ffe39a')}
// 부활 기도 · 파티 부활: 쓰러진 순례자도
{const _pr=j3PartyRevive;j3PartyRevive=function(pct,rad,name){const n=_pr(pct,rad,name),T=DG&&DG.j3t;let m=0;if(T&&!T.guest&&!GHOST)for(const a of T.npcs)if(a.down&&dist(a,P)<=rad){j3Raise(a,clamp(pct,.2,1));m++}return n+m}}
{const _tc=tryCast;tryCast=function(id,t){const s0=SPELLS[id],T=DG&&DG.j3t;if(T&&!T.guest&&!GHOST&&!CAST_MOD&&s0&&s0.kind==='rez'&&s0.cls===P.cls&&skLv(id)>0&&!(P.cd[id]>0)&&P.mp>=costOf(id)){const s=eff(id,skLv(id)),dn=T.npcs.filter(a=>a.down&&dist(a,P)<(s.rad||300));
    if(dn.length){P.mp-=costOf(id);P.cd[id]=cdOf(id);castFx(s);for(const a of dn)j3Raise(a,s.pct||.5);return}}return _tc(id,t)}}
// 엔피시 움직임 · 그림
{const _ua=updateAllies;updateAllies=function(dt){if(!allies.some(a=>a.j3n))return _ua(dt);const keep=allies.filter(a=>a.j3n);allies=allies.filter(a=>!a.j3n);_ua(dt);
  keep.forEach((a,i)=>{a.hurt-=dt;a.anim+=dt;a.moving=false;if(a.j3pil&&!a.down&&!P.dead){const tx=P.x-60+(i%3)*50,ty=P.y+60+(i%2)*26,d=Math.hypot(tx-a.x,ty-a.y);if(d>30){const sp=Math.min(160,d*2)*dt;moveBody(a,(tx-a.x)/d*sp,(ty-a.y)/d*sp);a.moving=true;a.walkT+=dt;a.face=((tx-a.x)-(ty-a.y))>=0?1:-1}}});
  allies=allies.concat(keep.filter(a=>!a.down&&a.hp>0))}}
function j3DrawNpc(a,s){if(a.ref){const sp=twProp({k:'tent',pv:0})||twProp({k:'altar',pv:0});for(let i=-1;i<=1;i++){const f=twFolkSprite(J3_NPC_L.ref,0);if(f)SC.draw(ctx,f,s.x+i*22,s.y+(i?6:-4))}if(a.hurt>0)hurtFlash(s.x,s.y-30,30,.5);void sp}
  else{const f=a.moving?[1,0,2,0][Math.floor(a.walkT*7)%4]:0,sp=twFolkSprite(J3_NPC_L.pil,f);if(sp){ctx.save();if(a.down)ctx.globalAlpha=.45;if(a.face<0){ctx.translate(s.x,s.y);ctx.scale(-1,1);ctx.drawImage(sp.cv,-sp.ax,-sp.ay,sp.w,sp.h)}else SC.draw(ctx,sp,s.x,s.y);ctx.restore()}if(a.hurt>0&&!a.down)hurtFlash(s.x,s.y-30,22,.5)}
  const w=40,y=s.y-(a.ref?96:88);ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,6);ctx.fillStyle=a.down?'#ffe39a':a.hp/a.max<.3?'#ff5a4a':'#9fe0ff';ctx.fillRect(s.x-w/2,y,w*clamp(a.down?a.rv/.6:a.hp/a.max,0,1),4);
  if(a.down){ctx.font=`700 12px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('쓰러짐 — 치유로 일으키기',s.x,y-6);ctx.fillStyle='#ffe39a';ctx.fillText('쓰러짐 — 치유로 일으키기',s.x,y-6)}}
{const _da=drawAlly;drawAlly=function(a){if(!a.j3n)return _da(a);const s=a._s;if(!s||!onScreen(s,80))return;j3DrawNpc(a,s)}}
// 쓰러진 순례자(allies 밖) · 방패 · 밤
{const _dl=drawV5Labels;drawV5Labels=function(){_dl();const T=DG&&DG.j3t;if(!T)return;
  for(const a of T.npcs)if(a.down||T.guest){const s=W2S(a.x,a.y);if(onScreen(s,80))j3DrawNpc(a,s)}
  for(const e of enemies){if(e.dead||!e._s||!onScreen(e._s,120))continue;const s=e._s,sc=e.sc||1;
    if(e.j3sh){ctx.globalCompositeOperation='lighter';FXB.img(ctx,FXB.bubble(EL[e.j3sh]||'#fff'),s.x,s.y-e.r*sc*.9,e.r*sc*3.2,e.r*sc*3.2,.6+.1*Math.sin(time*4));ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}
    if(e.j3rev>0){ctx.globalAlpha=.6;ctx.strokeStyle='#fff2a0';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(s.x,s.y,e.r*sc*1.4,e.r*sc*.6,0,0,6.283);ctx.stroke();ctx.globalAlpha=1}}
  if(T.g==='hundred'&&T.ph===1){ctx.font=`800 16px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const tx=`환영 기사 ${Math.min(T.k|0,100)}/100`;ctx.strokeText(tx,W/2,92);ctx.fillStyle='#c8d0ff';ctx.fillText(tx,W/2,92)}
  if(T.g==='pilgrims'&&!T.res){ctx.font=`800 16px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const up=T.npcs.filter(a=>!a.down).length,tx=`순례자 ${up}/5 · 남은 시간 ${Math.max(0,Math.ceil((T.end||180)-T.t))}초`;ctx.strokeText(tx,W/2,92);ctx.fillStyle='#ffe39a';ctx.fillText(tx,W/2,92)}
  if(T.nightT>0){ctx.fillStyle=`rgba(10,6,20,${.35*clamp(T.nightT,0,1)})`;ctx.fillRect(0,0,W,H)}}}
// 대상 칸: 기믹 안내
{const _uh=updateHud;updateHud=function(){_uh();const T=DG&&DG.j3t;if(!T||T.guest)return;const ts=document.getElementById('tsub'),box=document.getElementById('target');if(!ts||!box||box.hidden)return;const tg=[];const e=T.e;
  if(T.g==='shield'&&e&&e.j3sh)tg.push(`${ELN[e.j3sh]} 방패: 금기 마법을 끝까지`);if(T.g==='steal'&&j3MySummons()<2)tg.push('그림자 갑옷: 소환수를 둘 이상');if(T.g==='clones'&&e&&!(e.j3rev>0))tg.push('진짜를 낙인으로 찾으세요');
  if(T.g==='sky'&&e&&!(e.j3gnd>0||e.brk>0))tg.push('하늘 높이: 멀리서 쏘세요');if(T.g==='beast'&&e&&!(e.blindT>0||e.rootT>0||T.nightT>0))tg.push('덫을 봅니다: 눈을 가리세요');
  if(tg.length&&!ts.textContent.includes(tg[0]))ts.textContent+=' · '+tg.join(' · ')}}
function j3End(win,why){const T=DG&&DG.j3t;if(!T||T.res)return;T.res=win?1:-1;
  if(win){const q=SQBY[T.q];for(const e of enemies)if(!e.dead&&e!==T.e){e.dead=true;killFx(e)}if(q&&sqState().a[q.id]&&!sqGoalDone(q,T.j))sqProgress(q,T.j,1,true);DG.bossDead=true;
    if(NET.on)j3Send('trw',{bk:T.bk});const e=T.e;DG.portals.push({x:e?e.x:P.x,y:(e?e.y:P.y)+80,exit:1});flash={col:'#ffcf7a',a:.25};
    const gv=sqFolk(q&&q.giver);banner={t:T.hide?'숨은 곳의 수호자를 쓰러뜨렸습니다':'시험 통과',sub:`${q?q.t:''} · 빛나는 문으로 나가 ${(gv||{}).n||'전직관'}에게 알리세요`,col:'#ffcf7a',life:3.4,max:3.4};msg(T.hide?`대가의 유품을 찾았습니다. 전직관에게 가져가세요`:'시험 통과! 빛나는 문으로 나가 전직관에게 알리세요','#ffcf7a')}
  else{banner={t:'시험 실패',sub:`${why} · 빛나는 문으로 나가 다시 도전할 수 있습니다`,col:'#ff8a6a',life:3.4,max:3.4};msg(`시험 실패: ${why}. 다시 도전할 수 있습니다`,'#ff8a6a')}
  save()}
// 참가자 화면: 방장이 보낸 엔피시를 그리고, 통과하면 같은 의뢰를 가진 사람도 통과
function j3GuestTick(T,dt){void dt}
J3NET.tn=(m,r)=>{const T=DG&&DG.j3t;if(!T||!T.guest||!r||r.id!==NET.hostId||!Array.isArray(m.a))return;T.npcs=m.a.slice(0,8).map((v,i)=>{const o=T.npcs[i]||{j3n:1,anim:0,walkT:0,max:1,hp:1,n:v[5]?'피난민':'순례자',rv:0};o.moving=Math.hypot(o.x-v[0],o.y-v[1])>2;if(o.moving)o.walkT+=.2;o.x=v[0];o.y=v[1];o.hp=v[2];o.max=Math.max(1,v[3]);o.down=v[4];o.ref=v[5];o.j3pil=!v[5];o.face=v[6]||1;return o})};
J3NET.trw=(m,r)=>{if(!r||!DG||!DG.j3t)return;const g=j3TrialGoal()||j3RoomGoal(P.cls);if(g&&(g.g.bk===m.bk||(J3_HIDE[g.g.room]&&J3_HIDE[g.g.room].bk===m.bk))){sqProgress(g.q,g.j,1,true);msg('파티가 시험을 통과했습니다. 전직관에게 알리세요','#ffcf7a')}};
{const _lv=leaveDungeon;leaveDungeon=function(){const tr=DG&&DG.j3t;_lv();if(tr)allies=allies.filter(a=>!a.j3n)}}
// 도감
{const _g=cxGroups;cxGroups=function(){const G=_g(),ks=Object.keys(TYPES).filter(k=>TYPES[k].j3t);for(const g of G)g[1]=g[1].filter(k=>!TYPES[k].j3t);const out=G.filter(g=>g[1].length);
  out.push(['숨은 곳 (3차 전직 · 지옥)',ks.filter(k=>TYPES[k].j3t===2)]);out.push(['시험의 방 (3차 전직)',ks.filter(k=>TYPES[k].j3t===1)]);return out}}
{const _mi=monInfo;monInfo=function(k){const m=_mi(k),t=TYPES[k];if(t&&t.j3t){m.where=[t.j3t===2?'지옥 난이도의 숨은 곳 (3차 전직 의뢰)':'재가 내리는 고원 · 시험의 방'];m.lv=t.lvl}return m}}

/* ===== 저장: 끝낸 단계를 물약 칸에도 (예전 판이 의뢰 기록을 버려도 되살린다) ===== */
{const _m=j3Mirror;j3Mirror=function(){_m();try{if(!P||!P.pot||typeof P.pot!=='object')return;const s=sqState(),dn=J3_QUESTS.filter(q=>s.d[q.id]>0).map(q=>q.id);if(dn.length){const o=P.pot._j3||(P.pot._j3={j:P.job3||P._job3raw||0,l:P.lvl|0,x:Math.round(P.xp||0)});o.d=dn}}catch(_){}}}
{const _lf=j3LoadFix;j3LoadFix=function(d){const m=d&&d.pot&&d.pot._j3&&typeof d.pot._j3==='object'?d.pot._j3:{};const s=sqState();
  if(Array.isArray(m.d))for(const id of m.d)if(SQBY[id]&&SQBY[id].j3q&&SQBY[id].cls===P.cls&&!s.d[id]){delete s.a[id];s.d[id]=1}
  _lf(d);
  // 3차로 전직했는데 기록이 없는 단계는 끝낸 것으로 (점수는 qsp로만 주므로 두 번 받지 않음)
  if(P.job3)for(const q of J3_QUESTS)if(q.cls===P.cls&&q.st<=3&&(!q.pick3||q.pick3===P.job3)&&!s.d[q.id]){delete s.a[q.id];s.d[q.id]=1}
  j3Mirror()}}

/* ===== 매 프레임 ===== */
{const _u=update;update=function(dt){_u(dt);if(!paused||NET.on)j3RoomTick(dt)}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{J3Q,J3_QUESTS,J3U,J3SPOT,J3_TRIAL,J3_GUARD})}catch(_){}},0);
Object.assign(window.__j3,{J3Q,J3_QUESTS,J3U,J3SPOT,J3_HIDE,J3_TRIAL,J3_GUARD,J3_GIVER,J3_PFX,j3Reward,j3Advance,j3MakeUniq,j3GiveUniq,j3TrialGoal,j3RoomGoal,j3TrialEnter,j3HideEnter,j3RoomSpec,j3BuildRoom,j3RoomGo,j3End,j3Event,j3DmgK,j3MySummons,j3Raise});Object.defineProperty(window.__j3,'DG',{configurable:true,get:()=>DG});
window.J3Q=J3Q;
