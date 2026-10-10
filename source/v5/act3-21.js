/* ---------- v21 MAZE: 3막 「마르는 강」 (설계: rpg/v20-ideas/code/act3.js · 줄거리 v19-ideas/3막-줄거리.md) ----------
   · 2막(공허의 옥좌)을 끝낸 캐릭터만 엘리안에게서 첫 의뢰를 받는다. 이미 2막을 끝낸 저장은 바로 받는다.
   · 메인 줄거리: 주황 「메인」 표 · 주황 ! ? · 알림판 맨 위 (마을 의뢰와 다르게 보인다).
   · 장소 7곳은 모두 「레벨 고정 던전」(난이도 레벨 덧셈 · 생명력 배수 없음). 그 마을 둘레의 「봉인된 문」으로 들어가고, 그 던전이 필요한 첫 의뢰를 받으면 열린다.
     서리 고개 끝(파수꾼) → 멈춘 폭포 아래 · 침묵의 탑 1층(아홉째 기둥) → 위층. 층 짓기는 maze21.js의 DM21을 쓴다.
   · 4장: 엘프 길 / 드워프 길 가운데 먼저 도울 쪽을 고른다(P.sq.ch.a3q10 = 'a'|'b'). 다른 쪽은 그 뒤에 열리고, a3q12는 둘 다 끝나야 끝난다.
   · 마지막 보스 「재의 군주의 그림자」: 2~3인 협동 보스. 30초마다 두 기둥이 빛나고, 6초 동안 두 기둥 곁에 모두 누군가 서 있으면 10초 무방비.
     혼자면 「봉인의 메아리」가 기둥 하나를 대신 지킨다. 실패하면 재로 된 몸 셋이 더 나올 뿐.
   · 3막이 끝나면 이야기로만 3차 전직 의뢰 「재로 쓴 이름」을 가리킨다(3차 전직을 3막 뒤로 막지 않는다). 이미 3차 전직을 했으면 맺음말 한 줄.
   · 저장: 새 칸 없음. 진행은 P.sq(마을 의뢰와 같은 칸) · 고른 길은 P.sq.ch.a3q10. */
const A3={ar:null,zone:null,sendT:0,woke:new Set(),slow:0};window.__a3=A3;
/* ===== 1) 몬스터: 기존 그림을 색 · 눈빛 · 크기로 바꿔 쓴다 (생명력은 2막 · 3차 지역 보스 무게에 맞춰 줄임) ===== */
const A3_TYPES={
  a3_inkwraith:{n:'먹물 망령',min:62,hp:420,dmg:21,spd:105,r:15,xp:190,aggro:480,atk:1.5,col:'#2a2a3a',ranged:true,pcol:'#6a6aff',undead:true,draw:'wraith',eye:'#9ab8ff'},
  a3_bookgolem:{n:'서가 골렘',min:63,hp:620,dmg:27,spd:75,r:21,xp:200,aggro:360,atk:1.6,col:'#6a4a2a',draw:'golem'},
  a3_sealkeeper:{n:'봉인 감시자 인형',min:64,hp:520,dmg:24,spd:95,r:18,xp:205,aggro:420,atk:1.3,col:'#8a8aa8',draw:'knight',eye:'#9ab8ff'},
  a3_frostfang:{n:'서리이빨 늑대',min:66,hp:460,dmg:19,spd:165,r:16,xp:215,aggro:460,atk:1,col:'#d8e8f8',draw:'wolf',eye:'#7ad8ff'},
  a3_stillwraith:{n:'멈춘 시간의 견습생',min:70,hp:480,dmg:22,spd:60,r:15,xp:230,aggro:420,atk:1.8,col:'#a8c8e8',ranged:true,pcol:'#cfeeff',undead:true,draw:'wraith',slowAura:1},
  a3_icegiant:{n:'서리 거인의 후예',min:72,hp:700,dmg:31,spd:70,r:24,xp:250,aggro:380,atk:1.9,col:'#9ab8d8',draw:'ogre',eye:'#cfeeff'},
  a3_runepillar:{n:'깨어난 룬 기둥',min:74,hp:620,dmg:24,spd:0,r:20,xp:240,aggro:600,atk:1.4,col:'#3a3a5a',ranged:true,pcol:'#b07aff',draw:'golem',still:1,eye:'#d8a0ff'},
  a3_ashacolyte:{n:'재의 사도 잔당',min:76,hp:540,dmg:25,spd:105,r:16,xp:255,aggro:480,atk:1.4,col:'#5a3428',ranged:true,pcol:'#ff7a3a',draw:'apostle'},
  a3_towerknight:{n:'침묵의 탑 파수 기사',min:78,hp:680,dmg:29,spd:100,r:19,xp:270,aggro:420,atk:1.3,col:'#2a2a2a',undead:true,draw:'knight',eye:'#ff6a2a'},
  a3_rootbeast:{n:'뿌리 짐승',min:82,hp:700,dmg:30,spd:90,r:22,xp:290,aggro:400,atk:1.7,col:'#4a6a3a',draw:'golem',eye:'#c8ffb0'},
  a3_greysinger:{n:'잿빛이 된 노래꾼',min:84,hp:560,dmg:26,spd:110,r:16,xp:300,aggro:520,atk:1.5,col:'#9a9a8a',ranged:true,pcol:'#d8ffd8',draw:'apostle'},
  a3_runetrap:{n:'깨어난 룬 함정 인형',min:82,hp:620,dmg:28,spd:95,r:18,xp:290,aggro:420,atk:1.3,col:'#7a5a2a',draw:'knight',eye:'#ffd060'},
  a3_deepcrawler:{n:'깊은 길 굴벌레',min:84,hp:720,dmg:31,spd:85,r:22,xp:300,aggro:380,atk:1.8,col:'#5a4a3a',draw:'serpent'},
  a3_ashbody:{n:'재로 된 몸',min:92,hp:620,dmg:30,spd:110,r:18,xp:340,aggro:500,atk:1.3,col:'#3a2a24',undead:true,draw:'skeleton',eye:'#ff8a3a'}};
const A3_MINIS={
  am_archivist:{n:'말을 잃은 서고장',hp:1000,dmg:30,spd:90,r:22,xp:900,aggro:500,atk:1.4,col:'#3a3a5a',ranged:true,pcol:'#9a9aff',draw:'apostle',sc:1.9,mini:1,skills:['volley','summon'],summon:'a3_inkwraith'},
  am_fallward:{n:'폭포를 붙든 파수꾼',hp:1100,dmg:34,spd:80,r:26,xp:1000,aggro:500,atk:1.6,col:'#9ab8d8',draw:'golem',sc:2.1,mini:1,skills:['slam','charge'],eye:'#cfeeff'},
  am_ninth:{n:'아홉째 기둥의 목소리',hp:1150,dmg:33,spd:0,r:28,xp:1100,aggro:600,atk:1.3,col:'#5a3a8a',ranged:true,pcol:'#d8a0ff',draw:'golem',sc:2.3,mini:1,skills:['volley','summon'],summon:'a3_runepillar',still:1,eye:'#e8c0ff'},
  am_rootmother:{n:'노래를 잊은 뿌리 어미',hp:1250,dmg:36,spd:70,r:28,xp:1200,aggro:500,atk:1.7,col:'#3a5a2a',draw:'golem',sc:2.4,mini:1,skills:['slam','summon'],summon:'a3_rootbeast',eye:'#c8ffb0'},
  am_forgeghost:{n:'첫 룬 대장장이의 망령',hp:1250,dmg:37,spd:95,r:24,xp:1200,aggro:500,atk:1.4,col:'#c88a3a',undead:true,draw:'knight',sc:2,mini:1,skills:['charge','slam','volley'],pcol:'#ffb060',eye:'#ffd060'}};
const A3_BOSSES={
  ab_hollowelder:{n:'숨긴 자, 원로 베르탄',hp:2800,dmg:36,spd:95,r:28,xp:2600,aggro:540,atk:1.4,col:'#4a4a7a',ranged:true,pcol:'#b0b0ff',draw:'apostle',sc:2.6,boss:1,skills:['volley','slam','summon'],summon:'a3_sealkeeper',note:'1장 끝. 백 년 동안 기록을 숨겨 온 원로의 환영. 쓰러뜨리면 진실을 털어놓는다.'},
  ab_stillking:{n:'멈춘 폭포의 왕',hp:3200,dmg:40,spd:85,r:32,xp:3200,aggro:540,atk:1.6,col:'#cfeeff',draw:'ogre',sc:3,boss:1,skills:['slam','charge','summon'],summon:'a3_stillwraith',eye:'#7ad8ff',note:'2장 끝. 20초마다 3초 동안 둘레 시간이 느려진다(이동 −40% · 시전 시간 +40%, 고리 밖으로 나가면 풀림).'},
  ab_silencewarden:{n:'침묵의 탑 수문장',hp:3600,dmg:42,spd:100,r:30,xp:3800,aggro:560,atk:1.4,col:'#1a1a2a',undead:true,draw:'knight',sc:2.8,boss:1,skills:['charge','slam','volley','summon'],summon:'a3_towerknight',pcol:'#ff6a2a',eye:'#ff6a2a',gshN:'보호막: 깨어난 룬 기둥 둘을 깨세요',note:'3장 끝. 생명력 50%에서 룬 기둥 둘을 깨워 보호막(받는 피해 −80%). 기둥을 깨야 다시 피해가 들어간다.'},
  ab_greyqueen:{n:'잿빛 잎의 노래지기',hp:4000,dmg:44,spd:105,r:28,xp:4200,aggro:560,atk:1.5,col:'#a8a898',ranged:true,pcol:'#e8ffe8',draw:'apostle',sc:2.6,boss:1,skills:['volley','summon','charge'],summon:'a3_greysinger',note:'4장 엘프 길 끝.'},
  ab_deepwarden:{n:'깊은 길의 맞추는 망치',hp:4000,dmg:46,spd:90,r:30,xp:4200,aggro:560,atk:1.6,col:'#8a6a3a',draw:'golem',sc:2.8,boss:1,skills:['slam','charge','summon'],summon:'a3_runetrap',eye:'#ffd060',note:'4장 드워프 길 끝.'},
  ab_ashname:{n:'재의 군주의 그림자',hp:4800,dmg:48,spd:100,r:38,xp:8000,aggro:600,atk:1.4,col:'#2a1a14',undead:true,ranged:true,pcol:'#ff6a2a',draw:'apostle',sc:3.4,boss:1,skills:['volley','slam','charge','summon'],summon:'a3_ashbody',aura:'rgba(255,90,40,.45)',eye:'#ff8a3a',
    note:'5장 끝 · 2~3인 협동 보스. 30초마다 방 양쪽 기둥 둘이 빛나고, 6초 동안 두 기둥 곁에 모두 누군가 서 있으면 10초 무방비(받는 피해 +50%, 덧셈). 혼자면 「봉인의 메아리」가 기둥 하나를 대신 지킨다. 실패하면 재로 된 몸 셋이 더 나온다.'}};
const A3_KEYS=[...Object.keys(A3_TYPES),...Object.keys(A3_MINIS),...Object.keys(A3_BOSSES)];
for(const T of [A3_TYPES,A3_MINIS,A3_BOSSES])for(const k in T){const t=Object.assign({},T[k]);t.a3=1;TYPES[k]=t}
// 속성 (지역 쪽 표 WX21_EL에 줄을 더한다: 불↔냉기 · 벼락↔대지 · 신성↔어둠)
const A3_EL={a3_frostfang:'ice',a3_icegiant:'ice',a3_stillwraith:'ice',am_fallward:'ice',ab_stillking:'ice',a3_ashacolyte:'fire',a3_ashbody:'fire',ab_ashname:'fire',am_forgeghost:'fire',a3_rootbeast:'earth',a3_deepcrawler:'earth',am_rootmother:'earth'};
if(typeof WX21_EL!=='undefined')Object.assign(WX21_EL,A3_EL);for(const k in A3_EL)if(TYPES[k])TYPES[k].el=A3_EL[k];

/* ===== 2) 던전 7곳 (+ 침묵의 탑 위층). gate: 그 마을 둘레 「봉인된 문」 · via: 문 없이 다른 던전 끝에서 들어감 ===== */
const A3_DG=[
  {id:'a3_archive',town:'arden',at:'마법원 옆뜰 지하 계단',a0:2.5,n:'봉인 서고',lvl:63,floor:[40,36,50],wall:['#3a3446','#1e1a26','#524a66'],torch:'#9ab8ff',mobs:['a3_inkwraith','a3_bookgolem','a3_sealkeeper'],w:[3,1,1],minis:['am_archivist'],boss:'ab_hollowelder',q:'a3q1'},
  {id:'a3_pass',town:'frostheim',at:'북쪽 얼음 문',a0:-2.2,n:'서리 고개',lvl:68,floor:[200,212,226],wall:['#9ab8d8','#5a7898','#c8d8e8'],torch:'#cfeeff',mobs:['a3_frostfang','a3_icegiant','i_yeti'],w:[4,1,1],minis:['am_fallward'],boss:null,next:'a3_falls',q:'a3q4'},
  {id:'a3_falls',via:'a3_pass',n:'멈춘 폭포 아래',lvl:72,floor:[170,190,210],wall:['#7aa8c8','#3a5878','#a8c8e8'],torch:'#e8f8ff',mobs:['a3_stillwraith','a3_frostfang','a3_icegiant'],w:[3,1,1],minis:[],boss:'ab_stillking',q:'a3q5'},
  {id:'a3_tower',town:'windcrag',at:'북쪽 산길 검은 문',a0:-2.4,n:'침묵의 탑',lvl:78,floor:[30,28,36],wall:['#2a2a32','#121218','#3e3e4a'],torch:'#b07aff',mobs:['a3_runepillar','a3_ashacolyte','a3_towerknight'],w:[1,2,2],minis:['am_ninth'],boss:null,next:'a3_tower2',q:'a3q7'},
  {id:'a3_tower2',via:'a3_tower',n:'침묵의 탑 위층',lvl:80,floor:[34,30,40],wall:['#2e2a36','#141218','#44404e'],torch:'#c890ff',mobs:['a3_towerknight','a3_ashacolyte','a3_runepillar'],w:[3,1,1],minis:[],boss:'ab_silencewarden',q:'a3q8'},
  {id:'a3_roots',town:'elderhold',at:'고목 밑 뿌리 문',a0:1.1,n:'실바렌 뿌리 미궁',lvl:86,floor:[50,70,40],wall:['#4a5a3a','#26301e','#6a7a52'],torch:'#c8ffb0',mobs:['a3_rootbeast','a3_greysinger'],w:[1,1],minis:['am_rootmother'],boss:'ab_greyqueen',q:'a3q11a'},
  {id:'a3_deep',town:'emberhold',at:'대장간 뒤 갱도 문',a0:2.7,n:'카즈둔 깊은 길',lvl:86,floor:[60,50,40],wall:['#5a4a3a','#2a2018','#7a6650'],torch:'#ffb060',mobs:['a3_runetrap','a3_deepcrawler'],w:[1,1],minis:['am_forgeghost'],boss:'ab_deepwarden',q:'a3q11b'},
  {id:'a3_summit',town:'windcrag',at:'북쪽 산길 검은 문 (탑 꼭대기)',a0:-1.0,n:'탑 꼭대기',lvl:96,floor:[36,24,20],wall:['#3a2420','#1a100c','#5a3a30'],torch:'#ff6a2a',mobs:['a3_ashbody'],w:[1],minis:[],boss:'ab_ashname',q:'a3q13',arena:1}];
const A3_DGBY={};A3_DG.forEach((d,i)=>{A3_DGBY[d.id]=d;d.ci=990+i;d.a21='a3';if(!DGMAT[d.id])DGMAT[d.id]=wxDgMat(d);DM21_DESC[d.id]=d});
// 몬스터 → 나오는 던전 (의뢰 목표 자리 · 도감)
const A3_MOBDG={};for(const d of A3_DG)for(const k of [...d.mobs,...d.minis,d.boss].filter(Boolean))if(!A3_MOBDG[k])A3_MOBDG[k]=d;
for(const d of A3_DG){for(const k of d.minis)if(TYPES[k]&&TYPES[k].min==null)TYPES[k].min=d.lvl+1;if(d.boss&&TYPES[d.boss]&&TYPES[d.boss].min==null)TYPES[d.boss].min=d.lvl+2}

/* ===== 3) 의뢰 16개 (설계 그대로 · 마을 의뢰 칸 P.sq) ===== */
const A3_QUESTS=[
 {id:'a3q1',town:'arden',giver:'elian',lvl:60,seq:1,t:'문틀이 마른 까닭',say:'엘가로스는 쓰러졌네. 그런데 하나가 걸려. 문이 그렇게 쉽게 갈라질 리 없었어. 문틀이 먼저 말라 있었던 걸세. 마법원 지하 봉인 서고에 백 년 전 기록이 있을 거야. 원로 회의가 「계절 탓」이라 덮어 둔 기록 말일세.',done:'…마나가 해마다 얕아진다. 백 년 전에 이미 알았군. 그걸 숨긴 이가 누군지도 보이네.',
  goals:[{type:'talk',town:'arden',npc:'oswin',item:'봉인 서고 열쇠',d:'서고장 오스윈에게 봉인 서고 열쇠 받기'},{type:'kill',k:['a3_inkwraith'],n:12,d:'봉인 서고의 먹물 망령 처치'}],rw:{xp:1.2,gold:3000}},
 {id:'a3q2',town:'arden',giver:'elian',req:'a3q1',lvl:62,t:'숨긴 자',say:'서고 가장 깊은 곳에 원로 베르탄의 환영이 기록을 지키고 있다네. 말을 잃은 서고장도 그 곁에 있지. 둘을 지나 기록을 가져오게.',done:'베르탄이 털어놓았군. 봉인이… 세상의 마나를 마신다고. 사백 년 전 재의 군주를 가둔 그 봉인이.',
  goals:[{type:'kill',k:['am_archivist'],n:1,d:'말을 잃은 서고장 처치'},{type:'kill',k:['ab_hollowelder'],n:1,d:'숨긴 자, 원로 베르탄 처치'}],rw:{xp:1.6,gold:5000,item:2,book:'a4'}},
 {id:'a3q3',town:'arden',giver:'elian',turn:'fh_oddvar',req:'a3q2',lvl:64,t:'북쪽으로',say:'봉인을 직접 봐야 하네. 서리이빨 산맥 너머 침묵의 탑. 프로스트헤임의 북쪽 얼음 문이 서리 고개로 이어진다네. 오드바르에게 길을 물어보게.',done:'(오드바르) 서리 고개라고? 거긴 사냥꾼도 안 가. 그래도 간다면… 이 털옷을 입게.',
  goals:[{type:'talk',town:'frostheim',npc:'fh_oddvar',item:'엘리안의 편지',d:'프로스트헤임의 오드바르에게 길 묻기'}],rw:{xp:.8,gold:1500}},
 {id:'a3q4',town:'frostheim',giver:'fh_oddvar',req:'a3q3',lvl:66,t:'서리 고개',say:'서리이빨 늑대가 고개를 지켜. 거인의 후예도 산다던데, 그놈들은 화가 나면 땅이 갈라진다더군. 고개 끝에 폭포를 붙든 파수꾼이 있다는 소문도 있어. 북쪽 얼음 문을 열어 두지.',done:'살아 돌아왔군! 폭포 아래로 가는 길이 열렸다고? 거긴… 시간이 멈춘 곳이야.',
  goals:[{type:'kill',k:['a3_frostfang'],n:15,d:'서리이빨 늑대 처치'},{type:'kill',k:['am_fallward'],n:1,d:'폭포를 붙든 파수꾼 처치'}],rw:{xp:1.6,gold:5000,item:1}},
 {id:'a3q5',town:'frostheim',giver:'fh_oddvar',req:'a3q4',lvl:70,t:'눈을 깜빡이는 사람들',say:'폭포 아래에서 사람 그림자가 눈을 깜빡였다는 사냥꾼 얘기, 정말이었나 봐. 백 년 전 봉인을 살피러 갔다가 돌아오지 않은 견습생 셋이 있었대. 서리 고개 끝의 길로 내려가 봐.',done:'(견습생의 목소리) …얼마나 지났죠? 탑의 기둥이… 마시고 있어요. 세상을요.',
  goals:[{type:'use',use:'a3_novice1',d:'멈춘 견습생 첫째 깨우기'},{type:'use',use:'a3_novice2',d:'멈춘 견습생 둘째 깨우기'},{type:'use',use:'a3_novice3',d:'멈춘 견습생 셋째 깨우기'},{type:'kill',k:['a3_stillwraith'],n:10,d:'멈춘 시간의 견습생(망령) 쉬게 하기'}],rw:{xp:1.4,gold:4000}},
 {id:'a3q6',town:'frostheim',giver:'fh_oddvar',req:'a3q5',lvl:72,t:'멈춘 폭포의 왕',say:'폭포 가장 안쪽에 시간을 쥔 놈이 있어. 그놈을 쓰러뜨려야 견습생들이 흘러간 시간을 되찾고 쉴 수 있대.',done:'폭포가… 다시 떨어진다! 사백 년 만에. 산 전체가 울렸어.',
  goals:[{type:'kill',k:['ab_stillking'],n:1,d:'멈춘 폭포의 왕 처치'}],rw:{xp:2,gold:7000,item:2,book:'w2'}},
 {id:'a3q7',town:'windcrag',giver:'wc_dalmo',req:'a3q6',lvl:74,t:'검은 탑의 문',say:'폭포 소리가 여기까지 들렸네. 산채 북쪽 산길 끝에 검은 문이 있어. 우리 할아버지 때부터 열린 적 없는 문이지. 어젯밤 열렸네.',done:'안에 들어갔다 나온 사람은 자네가 처음이야.',
  goals:[{type:'kill',k:['a3_runepillar'],n:6,d:'침묵의 탑 깨어난 룬 기둥 깨기'},{type:'kill',k:['a3_ashacolyte'],n:12,d:'재의 사도 잔당 처치'}],rw:{xp:1.6,gold:6000}},
 {id:'a3q8',town:'windcrag',giver:'wc_dalmo',req:'a3q7',lvl:78,t:'아홉째 기둥',say:'잔당들이 떠들더군. 재의 사도는 봉인을 풀려던 게 아니라, 봉인이 세상을 말리는 걸 알고 미쳐 버린 사람들이었다고. 탑 1층 끝 아홉째 기둥이 그걸 말해 준다는군.',done:'(기둥의 목소리) 우리를 세운 스물일곱은 다 떠났다. 셋째 백 년에 우리를 고친 자들이 우리에게 세상을 마시라 했다.',
  goals:[{type:'kill',k:['a3_towerknight'],n:10,d:'파수 기사 처치'},{type:'kill',k:['am_ninth'],n:1,d:'아홉째 기둥의 목소리 잠재우기'}],rw:{xp:1.8,gold:7000,item:1}},
 {id:'a3q9',town:'windcrag',giver:'wc_dalmo',req:'a3q8',lvl:80,t:'침묵의 탑 수문장',say:'기둥이 잠들자 수문장이 깨어났네. 탑 위층에서 꼭대기로 가는 길을 막고 있어.',done:'수문장이 쓰러졌는데 꼭대기 문은 열리지 않았어. 무언가 더 필요하대. 엘프와 드워프가 각자 답을 안다더군.',
  goals:[{type:'kill',k:['ab_silencewarden'],n:1,d:'침묵의 탑 수문장 처치'}],rw:{xp:2.2,gold:9000,item:2}},
 {id:'a3q10',town:'arden',giver:'elian',req:'a3q9',lvl:82,t:'두 개의 답',say:'엘프는 「봉인을 지키며 천천히 마르자」 하고, 드워프는 「봉인을 고쳐 다른 곳에서 마나를 끌자」 하네. 둘 다 꼭대기 문을 여는 열쇠 반쪽을 가졌어. 어느 쪽을 먼저 돕겠나? 다른 쪽은 나중에 도와도 되네.',done:'좋아. 어느 쪽이든 열쇠 반쪽은 얻게 될 걸세. 어느 쪽을 먼저 돕겠나?',
  goals:[{type:'talk',town:'arden',npc:'elian',d:'엘리안과 이야기하고 먼저 도울 쪽 고르기'}],rw:{xp:.6,gold:1000}},
 {id:'a3q11a',town:'elderhold',giver:'el_orein',req:'a3q10',pick:'a',lvl:84,t:'잊은 노래',say:'숲이 한 해에 한 번씩 숨을 덜 쉬어. 뿌리 미궁에 묻은 노래들이 잿빛이 되고 있지. 노래를 잊은 뿌리 어미와 잿빛 잎의 노래지기를 쉬게 해 줘. 그러면 열쇠 반쪽, 「흥얼거리는 잎」을 줄게.',done:'노래가 돌아왔어. 이 잎을 가져가. 숲은 천천히 마르는 쪽을 택했지만, 마르는 동안 노래는 이어질 거야.',
  goals:[{type:'kill',k:['am_rootmother'],n:1,d:'노래를 잊은 뿌리 어미 처치'},{type:'kill',k:['ab_greyqueen'],n:1,d:'잿빛 잎의 노래지기 처치'}],rw:{xp:2.6,gold:10000,item:2,rep:{dawn:300,steppe:300}}},
 {id:'a3q11b',town:'emberhold',giver:'eh_tilla',req:'a3q10',pick:'b',lvl:84,t:'맞추는 망치',say:'카즈둔 깊은 길 끝에 첫 룬 대장장이의 대장간이 있어. 봉인을 고칠 「맞추는 망치」가 거기 잠들어 있지. 망치를 지키는 놈들이 깨어났대. 가져오면 열쇠 반쪽, 「쐐기 조각」을 줄게.',done:'이게 맞추는 망치야. 봉인을 고쳐 다른 데서 마나를 끌면 세상은 덜 마르지. 대신 그 다른 데가 어디냐가 문제지만.',
  goals:[{type:'kill',k:['am_forgeghost'],n:1,d:'첫 룬 대장장이의 망령 처치'},{type:'kill',k:['ab_deepwarden'],n:1,d:'깊은 길의 맞추는 망치 처치'}],rw:{xp:2.6,gold:10000,item:2,rep:{kazdun:300,academy:300}}},
 {id:'a3q12',town:'arden',giver:'elian',req:'a3q10',reqAny:['a3q11a','a3q11b'],lvl:88,t:'반쪽 열쇠, 반쪽 답',say:'열쇠 반쪽을 가져왔군. 나머지 반쪽은 다른 쪽에 있네. 이번엔 그쪽을 도와주게. 두 답을 다 들어야 꼭대기에서 무엇을 할지 정할 수 있을 걸세.',done:'두 반쪽이 맞물렸어. 이상하지, 엘프의 잎과 드워프의 쐐기가 한 열쇠였다니.',
  goals:[{type:'questDone',any:['a3q11a','a3q11b'],both:1,d:'엘프의 길과 드워프의 길을 모두 마치기'}],rw:{xp:1.4,gold:6000}},
 {id:'a3q13',town:'windcrag',giver:'wc_dalmo',req:'a3q12',lvl:92,t:'탑 꼭대기로',say:'열쇠가 맞았네. 꼭대기 문이 열렸어. 그런데 거기서 나오는 재가 사람 모양을 하고 걸어 다녀.',done:'재로 된 몸들이 줄었어. 이제 꼭대기에 무엇이 기다리는지 보러 가야지.',
  goals:[{type:'kill',k:['a3_ashbody'],n:20,d:'재로 된 몸 처치'}],rw:{xp:2,gold:9000}},
 {id:'a3q14',town:'windcrag',giver:'wc_dalmo',req:'a3q13',lvl:94,t:'모두 모여',say:'꼭대기 기둥은 둘이야. 혼자서도 해 볼 수는 있지만, 동료가 있으면 훨씬 낫다더군. 혼자면 기둥 하나는 「봉인의 메아리」가 대신 지킨다네. 준비가 되면 말해. (파티를 꾸리면 같이 들어가게.)',done:'좋아, 문 앞에 섰군. 꼭대기 기둥 사이에 그림자가 서 있을 걸세.',
  goals:[{type:'talk',town:'windcrag',npc:'wc_dalmo',d:'준비되면 달모에게 말하기 (파티 권장)'}],rw:{xp:.4,gold:0}},
 {id:'a3q15',town:'windcrag',giver:'wc_dalmo',turn:'elian',req:'a3q14',lvl:96,t:'재의 이름',say:'가세. 사백 년 동안 이 탑이 붙들고 있던 것을 만나러. 끝나면 엘리안에게 알려 주게.',done:'',
  goals:[{type:'kill',k:['ab_ashname'],n:1,d:'재의 군주의 그림자 처치 (협동 권장)'}],rw:{xp:4,gold:20000,item:3,ap:5,badge:'재를 본 자'}}];
for(const q of A3_QUESTS){q.a3=1;q.kind='3막'}
// 끝맺음: 3차 전직 의뢰로 이어 준다 (이미 3차 전직을 했으면 맺음말)
Object.defineProperty(SQBY.a3q15||A3_QUESTS[A3_QUESTS.length-1],'done',{configurable:true,enumerable:true,get(){const base='(엘리안) 그림자는 사라졌네. 그런데 들리나? 재 속에서 누가 제 이름을 부르고 있어. 아직 끝난 게 아니야.';
  return P&&P.job3?base+' …아니, 자네는 이미 그 이름을 찾아 더 높이 올랐지. 오늘은 강이 다시 흐르는 소리나 들어 보세.':base+' …자네가 더 높이 오를 때, 그 이름을 찾게 될 걸세. (3차 전직 의뢰 「재로 쓴 이름」은 85레벨부터 2차 전직관에게서 받습니다)'},set(){}});
SQ.push(...A3_QUESTS);for(const q of A3_QUESTS)SQBY[q.id]=q;
const A3_ORDER=A3_QUESTS.map(q=>q.id);
const A3_FOLK=new Set(A3_QUESTS.flatMap(q=>[q.giver,sqTurn(q),...q.goals.filter(g=>g.npc).map(g=>g.npc)]));
const a3Act2Done=()=>{try{return !!P&&qState().i>=QUESTS.length}catch(_){return false}};
const a3Pick=()=>{const s=P&&P.sq;const c=s&&s.ch&&typeof s.ch==='object'?s.ch.a3q10:null;return c==='b'?'b':c==='a'?'a':null};

/* ===== 4) 의뢰 규칙: 열림 · 받기 · 끝내기 ===== */
{const _a=sqAvail;sqAvail=function(q){if(!q||!q.a3)return _a.apply(this,arguments);if(!P||!a3Act2Done())return 'hidden';const s=sqState();
  if(s.a[q.id])return 'active';if(s.d[q.id])return 'done';if(q.req&&!(s.d[q.req]>0))return 'locked';if(q.reqAny&&!q.reqAny.some(r=>s.d[r]>0))return 'locked';
  if(q.pick&&q.pick!==(a3Pick()||'a')){const other=q.pick==='a'?'a3q11b':'a3q11a';if(!(s.d[other]>0))return 'locked'}
  if(P.lvl<q.lvl-3)return 'low';return 'ok'}}
function a3Q12Check(){const s=sqState(),q=SQBY.a3q12;if(s.a.a3q12&&s.d.a3q11a>0&&s.d.a3q11b>0&&!sqGoalDone(q,0))sqProgress(q,0,1,true)}
{const _acc=sqAccept;sqAccept=function(id){const r=_acc.apply(this,arguments);const q=SQBY[id],s=sqState();if(q&&q.a3&&s.a[id]){
    if(id==='a3q10'||id==='a3q14')sqProgress(q,0,1,true);if(id==='a3q12')a3Q12Check();
    const g=a3GateOf(id);if(g&&a3Open(g.id))msg(`「${g.n}」으로 가는 봉인된 문이 열렸습니다 · ${a3GateWhere(g)}`,WX_QCOL.main)}return r}}
{const _f=sqFinish;sqFinish=function(id){const q=SQBY[id];if(!q||!q.a3)return _f.apply(this,arguments);const s=sqState(),n0=s.d[id]|0;
  if(id==='a3q10'&&s.a[id]&&!a3Pick()){if(!v20Obj(s.ch))s.ch={};s.ch.a3q10='a'}
  _f.apply(this,arguments);if((s.d[id]|0)<=n0)return;try{a3Reward(q)}catch(e){if(window.__QA)throw e}a3Q12Check()}}
function a3Reward(q){const r=q.rw,L=Math.max(q.lvl,P.lvl-2),give=it=>{if(!it)return;if(P.bag.length<sqBagCap()){P.bag.push(it);msg(`보상: ${it.name}`,RAR[it.rar].c)}else{loot.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),kind:'item',item:it,t:0,keep:1});msg(`가방이 가득 차 ${it.name}을(를) 발밑에 두었습니다`,RAR[it.rar].c)}};
  // 메인 줄거리 덤: 경험치 +50% (마을 의뢰보다 크게)
  const xx=Math.round(sqXp(q)*.5);if(xx>0)gainXp(xx);
  if(r.item>=2)give(makeItem(L,true,null,R()<.5?'uniq':'set'));if(r.item>=3)give(makeItem(L+2,true,null,'boss'));
  if(r.ap){P.ap=(P.ap|0)+r.ap;msg(`의뢰 보상: 능력치 점수 +${r.ap} (캐릭터 C)`,'#ffd76a')}
  if(r.book&&typeof bookGain==='function')bookGain(r.book,'3막');
  if(r.rep&&typeof repSt==='function'){const R0=repSt();for(const f in r.rep)if(f in R0){R0[f]=(R0[f]|0)+r.rep[f];msg(`${FACTIONS[f].n} 평판 +${r.rep[f]}`,FACTIONS[f].col)}}
  if(r.badge)msg(`칭호 「${r.badge}」을(를) 얻었습니다 (평판 칸에서 달기)`,'#ffd76a');
  const nx=A3_QUESTS.find(o=>sqAvail(o)==='ok'&&o.req===q.id||o.reqAny&&o.reqAny.includes(q.id)&&sqAvail(o)==='ok');
  if(q.id==='a3q15'){banner={t:'3막 「마르는 강」 끝',sub:P.job3?'재 속의 이름은 이미 자네가 찾았네':'3차 전직 의뢰 「재로 쓴 이름」으로 이어집니다 (85레벨 · 2차 전직관)',col:WX_QCOL.main,life:4,max:4};
    if(!P.job3)msg(P.job2?'다음 이야기: 2차 전직관에게서 3차 전직 의뢰 「재로 쓴 이름」을 받을 수 있습니다 (85레벨부터)':'다음 이야기: 2차 전직을 마치면 3차 전직 의뢰 「재로 쓴 이름」이 이어집니다',WX_QCOL.main)}
  else if(nx){const g=sqFolk(nx.giver);msg(`3막 다음 의뢰: 「${nx.t}」 · ${g?g.n:''}${g&&g.town?` (${g.town.n})`:''}`,WX_QCOL.main)}
  questHud();save()}
// 보상 글: 메인 덤 표시
{const _r=sqRwHtml;sqRwHtml=function(q){let h=_r(q);if(!q||!q.a3)return h;const r=q.rw,a=['<b style="color:#ffb05a">3막 덤 경험치 +50%</b>'];
  if(r.item>=2)a.push(`<b style="color:${RAR[4]?RAR[4].c:'#ffb05a'}">유니크 · 세트 하나 더</b>`);if(r.item>=3)a.push('<b style="color:#ff8a3a">상급 유니크</b>');if(r.ap)a.push(`<b style="color:#ffd76a">능력치 점수 +${r.ap}</b>`);
  if(r.book&&typeof BOOKBY!=='undefined'&&BOOKBY[r.book])a.push(`책 「${BOOKBY[r.book].n}」`);if(r.rep)a.push(Object.keys(r.rep).filter(f=>typeof FACTIONS!=='undefined'&&FACTIONS[f]).map(f=>`${FACTIONS[f].n} 평판 +${r.rep[f]}`).join(' · '));if(r.badge)a.push(`<b style="color:#ffd76a">칭호 「${r.badge}」</b>`);
  return h.replace(/<\/p>$/,` · ${a.join(' · ')}</p>`)}}
V20.titles.push({id:'a3ash',n:'재를 본 자',col:WX_QCOL.main,src:'3막 「마르는 강」',have:()=>!!(P&&P.sq&&P.sq.d&&P.sq.d.a3q15>0)});

/* ===== 5) 의뢰 창 · 알림판 · 일지 · 표시: 메인(주황) ===== */
// 4장 고르기: 「보상 받기」 대신 두 갈래 단추
{const _n=sqNpcHtml;sqNpcHtml=function(){let h=_n();const f=SQV.npc;if(!f||!A3_FOLK.has(f.id))return h;
  for(const q of A3_QUESTS)h=h.split(`<h2>${q.t} <span class="muted">`).join(`<h2>${WXTAG.m}${q.t} <span class="muted">`);
  const key='<div class="row"><button class="primary" type="button" data-sqdone="a3q10">보상 받기</button></div>';
  if(h.includes(key))h=h.replace(key,`<div class="v20box"><h3>어느 쪽을 먼저 도울까요? <span class="muted" style="font-weight:400">다른 쪽은 그 뒤에 열립니다 · 꼭대기로 가려면 둘 다 필요</span></h3>`+
    [['a','엘프의 길 (실바렌)','엘더홀드의 사냥대장 오레인 · 실바렌 뿌리 미궁 (Lv86)','여명교단 · 바람의 초원 부족 평판'],['b','드워프의 길 (카즈둔)','엠버홀드의 대장장이 틸라 · 카즈둔 깊은 길 (Lv86)','카즈둔 드워프 · 왕립 마법원 평판']].map(([c,b,d,rp])=>
      `<div class="v20row"><div><b>${b}</b><div class="muted" style="font-size:12px">${d}</div><div class="muted" style="font-size:12px">먼저 고른 쪽 보상: ${rp}</div></div><div class="btns">${v20Btn('a3pick',c,'이쪽 먼저',{cls:c==='a'?'primary':''})}</div></div>`).join('')+'</div>');
  return h}}
V20A.a3pick=c=>{if(c!=='a'&&c!=='b')return;const s=sqState(),q=SQBY.a3q10;if(!s.a.a3q10||!sqAllDone(q))return;if(!v20Obj(s.ch))s.ch={};s.ch.a3q10=c;sqFinish('a3q10');
  msg(c==='a'?'엘프의 길을 먼저 돕기로 했습니다 · 엘더홀드의 오레인에게 가세요':'드워프의 길을 먼저 돕기로 했습니다 · 엠버홀드의 틸라에게 가세요',WX_QCOL.main)};
// 알림판: 3막은 「메인」 표 + 맨 위
{const _s=sqHudBlocks;sqHudBlocks=function(){const o=_s(),s=sqState(),top=[];for(let i=o.length-1;i>=0;i--){const b=o[i];if(!b||typeof b.t!=='string'||b.a3)continue;
    for(const id in s.a){const q=SQBY[id];if(q&&q.a3&&b.t.endsWith(q.t)){b.t=`${WXTAG.m}3막 · ${q.t}`;b.main=1;b.side=0;b.a3=1;top.unshift(o.splice(i,1)[0]);break}}}return top.concat(o)}}
// 일지: 3막 갈래 + 진행 목록
{const _l=sqLogHtml;sqLogHtml=function(){let h=_l();for(const q of A3_QUESTS)h=h.split(`<b>${WXTAG.s}${q.t}</b>`).join(`<b>${WXTAG.m}${q.t}</b>`).split(`! <b>${q.t}</b>`).join(`! <b>${WXTAG.m}${q.t}</b>`);
  if(!a3Act2Done())return h;const s=sqState(),c=a3Pick();
  h+=`<h2>${WXTAG.m}3막 「마르는 강」</h2><p class="muted">레벨 고정 던전 7곳 · 봉인된 문은 그 던전이 필요한 의뢰를 받으면 열립니다${c?` · 먼저 고른 길: ${c==='a'?'엘프':'드워프'}`:''}</p><ul class="qgoals">`+
    A3_QUESTS.map((q,i)=>{const d=s.d[q.id]>0,a=!!s.a[q.id];return `<li class="${d?'ok':''}">${d?'✓':a?'…':'○'} ${q.t} <span class="muted">레벨 ${q.lvl}</span></li>`}).join('')+'</ul>';return h}}
// 머리 위 ! ? : 3막 의뢰면 주황 · 크게
function a3MarkOf(f){if(!f||!A3_FOLK.has(f.id)||!P)return '';const s=sqState();
  for(const id in s.a){const q=SQBY[id];if(!q||!q.a3)continue;if(sqTurn(q)===f.id&&sqAllDone(q))return '?';if(q.goals.some((g,j)=>g.type==='talk'&&g.npc===f.id&&!sqGoalDone(q,j)&&(!q.seq||j===0||sqGoalDone(q,j-1))))return '?'}
  for(const q of A3_QUESTS)if(q.giver===f.id&&sqAvail(q)==='ok')return '!';return ''}
{const _d=twDrawFolk;twDrawFolk=function(d){const n=QLBL.length,r=_d.apply(this,arguments);if(QLBL.length>n&&d&&A3_FOLK.has(d.id)){const m=a3MarkOf(d);if(m){const l=QLBL[QLBL.length-1];l.mk=m;l.main=1;l.big=1;l.c='#ffe6a8';if(!l.n)l.n=d.n}}return r}}
{const _m=sqMarks;sqMarks=function(world){const o=_m(world);if(!P)return o;const s=sqState(),tl=[];for(const id in s.a){const q=SQBY[id];if(q&&q.a3)tl.push(q.t)}
  for(const k of o){if(k.kind==='ring'&&k.label&&tl.some(t=>k.label===t||k.label.startsWith(t+' → '))){k.col=WX_QCOL.main;k.label='메인 · 3막 · '+k.label}}
  const fl=IN?IN.list:decor;for(const f of fl){if(f.k!=='tfolk'||!A3_FOLK.has(f.id))continue;const m=a3MarkOf(f);if(!m)continue;for(const k of o)if((k.kind==='!'||k.kind==='?')&&Math.abs(k.x-f.x)<1&&Math.abs(k.y-f.y)<1){k.kind=m;k.col=WX_QCOL.main;k.mq=1}}
  return o}}
// 목표 자리: 처치 · 깨우기 → 그 던전의 봉인된 문 / 두 길 → 아직 안 한 쪽 의뢰인
function a3GateOf(qid){const d=A3_DG.find(d=>d.q===qid);if(!d)return null;const g=d.via?A3_DGBY[d.via]:d;return DM21G[g.id]||null}
function a3GateWhere(g){const T=ALLTOWNS.find(t=>t.id===g.town);return `${REGIONS[g.reg]?REGIONS[g.reg].n:''} · ${T?T.n:''} 둘레 「봉인된 문」`}
function a3GateTarget(D){if(!D)return null;const gd=D.via?A3_DGBY[D.via]:D,G=DM21G[gd.id];if(!G||!G.d)return null;const T=ALLTOWNS.find(t=>t.id===G.town);return{reg:G.reg,x:G.d.x,y:G.d.y,cave:D.ci,label:`${T?T.n:''} ${G.reg==='royal'?'마법원 옆뜰':'둘레'} 「봉인된 문」 → ${D.n} (Lv${D.lvl})`}}
function a3NpcAt(id){const f=sqFolk(id);if(!f||!f.town)return null;return{reg:f.town.reg||'home',x:f.hx!=null?f.hx:f.x,y:f.hy!=null?f.hy:f.y,label:`${f.town.n} · ${f.n}`}}
{const _t=sqTarget;sqTarget=function(q){if(!q||!q.a3)return _t.apply(this,arguments);const s=sqState(),a=s.a[q.id];if(!a)return null;if(sqAllDone(q))return _t.apply(this,arguments);
  for(let j=0;j<q.goals.length;j++){if(sqGoalDone(q,j))continue;const g=q.goals[j];if(g.type==='talk')return _t.apply(this,arguments);
    if(g.type==='kill')return a3GateTarget(A3_MOBDG[g.k[0]]);if(g.type==='use')return a3GateTarget(A3_DGBY.a3_falls);
    if(g.type==='questDone')return a3NpcAt(!(s.d.a3q11a>0)?'el_orein':'eh_tilla');break}
  return _t.apply(this,arguments)}}

/* ===== 6) 봉인된 문 (마을 둘레 · 「쓰는 물건」) ===== */
twDef('a3gate',176,214,88,182,(g,v)=>{Kit.shadow(g,8,4,78,24,1);
  for(const x of [-34,34])twBox(g,x,0,0,18,18,96,'#4e4842',{tex:'stone',texA:.55});twBox(g,0,0,94,92,22,16,'#5a524a',{tex:'stone',texA:.5});twBox(g,0,0,110,40,16,10,'#463e38',{tex:'stone',texA:.5});
  const a=isoP(-25,0,2),b=isoP(25,0,2),c=isoP(25,0,92),d=isoP(-25,0,92);twFill(g,[a,b,c,d],v?'#2a120a':'#16120e');
  const mm={x:(a.x+c.x)/2,y:(a.y+c.y)/2};
  if(v){g.globalAlpha=.85;g.fillStyle='#ff8a2e';g.beginPath();g.ellipse(mm.x,mm.y+6,12,30,0,0,6.283);g.fill();g.globalAlpha=.6;g.fillStyle='#ffd08a';g.beginPath();g.ellipse(mm.x,mm.y+10,5,18,0,0,6.283);g.fill();g.globalAlpha=1}
  else{g.strokeStyle='#5a3a24';g.lineWidth=3;g.beginPath();g.moveTo(a.x+2,a.y-8);g.lineTo(c.x-2,c.y+8);g.moveTo(b.x-2,b.y-8);g.lineTo(d.x+2,d.y+8);g.stroke();
    g.fillStyle='#3a2a20';g.beginPath();g.arc(mm.x,mm.y,11,0,6.283);g.fill();g.strokeStyle='#a0603a';g.lineWidth=1.5;g.beginPath();g.arc(mm.x,mm.y,8,0,6.283);g.stroke();g.beginPath();g.moveTo(mm.x-5,mm.y);g.lineTo(mm.x+5,mm.y);g.moveTo(mm.x,mm.y-5);g.lineTo(mm.x,mm.y+5);g.stroke()}
  g.fillStyle=v?'#ffb05a':'#7a5a40';for(const x of [-34,34])for(const z of [30,52,74]){const p=isoP(x,9,z);g.fillRect(p.x-1.5,p.y-2,3,4)}});
function a3Open(id){if(!P)return false;const D=A3_DGBY[id];if(!D)return false;const s=sqState(),q=D.q,i=A3_ORDER.indexOf(q);if(s.d[q]>0)return true;
  if(s.a[q])return q==='a3q1'?sqGoalDone(SQBY.a3q1,0):true;for(let k=i+1;k<A3_ORDER.length;k++){const o=A3_ORDER[k];if(o==='a3q11a'||o==='a3q11b')continue;if(s.d[o]>0)return true}return false}
function a3GateHint(D){const q=SQBY[D.q];if(!a3Act2Done())return '굳게 닫혀 있다';if(D.id==='a3_archive'&&sqState().a.a3q1)return '서고장 오스윈에게 열쇠를 받으면 열립니다';return `3막 「${q.t}」을(를) 받으면 열립니다`}
for(const D of A3_DG){if(D.via)continue;const T=ALLTOWNS.find(t=>t.id===D.town);if(!T)continue;const reg=T.reg||'home';
  const g={id:D.id,reg,town:D.town,k:'a3gate',n:D.n,h:170,dot:WX_QCOL.main,D,
    lab:()=>a3Open(D.id)?{t:`봉인된 문 · ${D.n}`,s:`3막 · Lv${D.lvl} (레벨 고정)`,col:WX_QCOL.main}:{t:'봉인된 문',s:a3GateHint(D),col:'#b8a894'},
    live:()=>a3Open(D.id)?{label:`「${D.n}」으로 들어가기`,col:WX_QCOL.main,q:0}:{label:'봉인된 문 살피기',col:'#b8a894',q:0},
    go:()=>{if(!a3Open(D.id)){msg(`봉인된 문: ${a3GateHint(D)}`,'#b8a894');return}if(NET.guest){v20Send('dmgate',{g:D.id});msg('방장에게 같이 들어가자고 했습니다','#9fe0ff');return}a3Enter(D.id)},
    hostGo:()=>{if(!a3Open(D.id)){msg(`동료가 「${D.n}」으로 가자고 하지만, 내 의뢰로는 아직 문이 닫혀 있습니다`,'#a39d8f');return}a3Enter(D.id)},
    glow:s=>{if(!a3Open(D.id))return;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4+.15*Math.sin(time*2.4);const p=isoP(0,0,46);glow(s.x+p.x,s.y+p.y,34,'#ff8a2e');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}};
  const L=dm21Layer(reg),used=DM21GATES.filter(o=>o.reg===reg&&o.d);let p=null;
  if(D.id==='a3_archive'&&reg==='royal')p={x:T.x+610,y:T.y-330};// v26: 왕도 성안, 왕립 마법원과 사냥꾼 회관 사이 뜰
  else for(const r1 of [SAFE+700,SAFE+1000,SAFE+1400]){p=dm21FindSpot(reg,T,D.a0,{r0:SAFE+220,r1});if(p&&used.every(o=>Math.hypot(o.d.x-p.x,o.d.y-p.y)>360))break;p=null}
  if(!p)p={x:Math.round(T.x+Math.cos(D.a0)*(SAFE+300)),y:Math.round(T.y+Math.sin(D.a0)*(SAFE+300))};dm21AddGate(g,p.x,p.y);void L}
// 문 그림: 열렸는지에 따라 (0.5초마다)
let a3PvT=0;V20.tick.push(dt=>{if((a3PvT-=dt)>0||!P)return;a3PvT=.5;for(const g of DM21GATES)if(g.D&&g.d){const v=a3Open(g.id)?1:0;if(g.d.pv!==v)g.d.pv=v}});

/* ===== 7) 던전 짓기 (방장 · 혼자) ===== */
// 꼭대기: 들어가는 방 · 사이 방 둘 · 넓은 기둥 방 (기둥 두 칸은 벽)
const A3_PIL=[[24,15],[31,15]],A3_HOLD=170;
function a3SummitGrid(){const g=new Uint8Array(DN*DN),rooms=[];const room=(i,j,w,h)=>{const r={i,j,w,h,cx:i+(w>>1),cy:j+(h>>1)};rooms.push(r);for(let y=j;y<j+h;y++)for(let x=i;x<i+w;x++)g[tIdx(x,y)]=1;return r};
  const dig=(x,y)=>{for(let a=0;a<2;a++)for(let b=0;b<2;b++)g[tIdx(clamp(x+a,1,DN-2),clamp(y+b,1,DN-2))]=1};
  const link=(r,q)=>{let x=r.cx,y=r.cy;while(x!==q.cx){dig(x,y);x+=Math.sign(q.cx-x)}while(y!==q.cy){dig(x,y);y+=Math.sign(q.cy-y)}dig(x,y)};
  const st=room(3,15,5,5),m1=room(11,5,6,6),m2=room(11,24,6,6),ar=room(21,10,14,12);link(st,m1);link(st,m2);link(m1,{cx:ar.i+2,cy:m1.cy});link(m2,{cx:ar.i+2,cy:m2.cy});
  for(let y=m1.cy;y<=m2.cy;y++)dig(ar.i+1,y);for(const [i,j] of A3_PIL)g[tIdx(i,j)]=0;return{g,rooms,arena:ar}}
function a3Weighted(D,rg){const w=D.w||D.mobs.map(()=>1),T=w.reduce((a,b)=>a+b,0);let x=rg()*T;for(let i=0;i<D.mobs.length;i++){x-=w[i];if(x<=0)return D.mobs[i]}return D.mobs[0]}
const a3BossQ=()=>{const s=sqState();return !!(s.a.a3q15||s.d.a3q15>0||s.d.a3q14>0)};
function a3Enter(id){const D=A3_DGBY[id];if(!D||NET.guest)return false;const gd=D.via?A3_DGBY[D.via]:D,G=DM21G[gd.id];if(!G||!G.d)return false;
  if(REG.id!==G.reg){if(DG)leaveDungeon();loadRegion(G.reg)}if(!panel.hidden)closePanel();
  const rg=mulberry((R()*2147483647)|0),L=D.lvl,a21={k:'a3',id:D.id,t:0};let G0;
  if(D.arena){G0=a3SummitGrid();a21.pil=A3_PIL.map(p=>p.slice())}else{for(let k=0;k<8;k++){G0=dm21Gen(rg,{n:[6,8],w:[4,6]});if(G0.rooms.length>=6)break}}
  const order=dm21Make(D,D.ci,{x:G.d.x,y:G.d.y+80},L,G0,rg,a21);DM21.raw=0;A3.ar=null;A3.zone=null;
  const add=(k,x,y,l,ex)=>{const e=dgMob(k,x,y,l,ex);return e};let ri=0;
  if(D.arena){const ar=G0.rooms.find(r=>r===G0.arena)||order[0],c=tc(ar.cx,ar.cy+2);
    if(a3BossQ()){DG.boss=add(D.boss,c.x,c.y,L+2);DG.boss.aggroed=false;a21.boss=1}else{for(let n=0;n<6;n++){const q=dm21Spot(ar,rg,1);add('a3_ashbody',q.x,q.y,L,n===0?{elite:1}:null)}a21.sealed=1}
    for(const r of G0.rooms){if(r===ar||r===G0.rooms[0])continue;const n=6+Math.floor(rg()*2);for(let k=0;k<n;k++){const q=dm21Spot(r,rg,0);add('a3_ashbody',q.x+rnd(-20,20),q.y+rnd(-20,20),L,k===0&&rg()<.4?{elite:1}:null)}}}
  else{if(D.boss){const r=order[ri++],p=tc(r.cx,r.cy);DG.boss=add(D.boss,p.x,p.y,L+2);for(let n=0;n<2;n++){const q=dm21Spot(r,rg,1);add(a3Weighted(D,rg),q.x,q.y,L)}}
    for(const mk of D.minis){const r=order[ri++]||order[order.length-1],p=tc(r.cx,r.cy),e=add(mk,p.x,p.y,L+1);if(D.next)a21._nextE=e;for(let n=0;n<3;n++){const q=dm21Spot(r,rg,1);add(a3Weighted(D,rg),q.x,q.y,L)}}
    for(const r of order.slice(ri)){const n=4+Math.floor(rg()*3);for(let k=0;k<n;k++){const q=dm21Spot(r,rg,0);add(a3Weighted(D,rg),q.x+rnd(-20,20),q.y+rnd(-20,20),L,k===0&&rg()<.35?{elite:1}:null)}}}
  if(D.id==='a3_falls'){const rs=[DG.start,order[Math.floor(order.length/2)]||order[0],order[1]||order[0]];a21.spots=rs.map((r,i)=>{const q=dm21Spot(r,rg,1);return{x:Math.round(q.x),y:Math.round(q.y),use:'a3_novice'+(i+1),n:'멈춘 견습생'}})}
  const who=D.boss&&!(D.arena&&!a21.boss)?TYPES[D.boss].n:D.minis.length?TYPES[D.minis[0]].n:'';
  msg(`${D.n}에 들어섰습니다 · 3막 레벨 고정 던전 (몬스터 레벨 ${L})${who?` · 가장 깊은 방에 ${who}`:''}${a21.sealed?' · 꼭대기 기둥 사이가 비어 있습니다 (달모의 「모두 모여」 뒤에 그림자가 섭니다)':''}`,WX_QCOL.main);
  banner={t:D.n,sub:`3막 「마르는 강」 · 몬스터 레벨 ${L} (레벨 고정)${D.arena&&a21.boss?' · 협동 보스':''}`,col:WX_QCOL.main,life:2.6,max:2.6};
  if(NET.on&&NET.host)netSend({t:'dg',d:netDgData()});save();return true}
// 다음 층 문 (서리 고개 끝 → 폭포 아래 · 탑 1층 끝 → 위층)
function a3NextDoor(a,x,y,to){if(!DG||DG.portals.some(p=>p.dm21==='a3n'))return;const D=A3_DGBY[to];if(!D)return;a.nOpen=1;
  let px=x,py=y+80;if(!dgFree(px,py,10)){px=x;py=y}DG.portals.push({x:Math.round(px),y:Math.round(py),dm21:'a3n',to,col:WX_QCOL.main,lab:`${D.n}(으)로 가는 길`});
  rings.push({x:px,y:py,r:10,max:160,life:.9,col:WX_QCOL.main});burst(px,py,'#ffb05a',40,180,3,20);msg(`${D.n}(으)로 가는 길이 열렸습니다`,WX_QCOL.main)}
DM21ACT.a3n={label:i=>{const p=DG.portals[i],D=p&&A3_DGBY[p.to];return `${D?D.n:'다음 층'}(으)로 (F)${NET.guest?' · 방장에게 부탁':''}`},
  go:i=>{const p=DG.portals[i];if(!p)return;if(NET.guest){v20Send('a3go',{to:p.to});msg('방장에게 다음 층으로 가자고 했습니다','#9fe0ff');return}a3Enter(p.to)}};
V20NET.a3go=(m,r)=>{if(!NET.host||!DG||!DG.a21||DG.a21.k!=='a3')return;if(!DG.portals.some(p=>p.dm21==='a3n'&&p.to===m.to))return;msg(`${r&&r.name||'동료'}님이 다음 층으로 이끕니다`,WX_QCOL.main);a3Enter(m.to)};
V20NET.a3n=m=>{if(!NET.guest||!DG||!DG.a21||DG.a21.k!=='a3'||DG.a21.id!==m.id)return;a3NextDoor(DG.a21,+m.x||0,+m.y||0,m.to)};
// 멈춘 견습생 깨우기 (폭포 아래 · 각자 자기 의뢰)
DM21ACT.use={live:s=>!!(s&&s.use&&sqUseQ(s.use)),label:()=>'멈춘 견습생 깨우기 (F)',
  go:i=>{const s=DG.a21.spots&&DG.a21.spots[i];if(!s)return;const h=sqUseQ(s.use);if(!h)return;A3.woke.add(s.use);rings.push({x:s.x,y:s.y,r:8,max:120,life:.8,col:'#cfeeff'});burst(s.x,s.y,'#cfeeff',30,140,3,24);
    const L0=['…얼마나 지났죠?','탑의 기둥이… 마시고 있어요.','세상을요. 사백 년 동안.'];const n=+s.use.slice(-1)||1;msg(`멈춘 견습생: 「${L0[n-1]}」`,'#cfeeff');sqProgress(h.q,h.j,1,true)}};

/* ===== 8) 보스 규칙 (방장 · 혼자가 정하고 v20x a3a로 보낸다) ===== */
const a3Holders=()=>{const o=[];if(!P.dead)o.push(P);if(NET.on)for(const r of NET.peers.values())if(!r.dead&&netSame(r))o.push(r);return o};
function a3ArInit(){const a=DG.a21;A3.ar={pil:a.pil.map(([i,j])=>{const c=tc(i,j);return{x:c.x,y:c.y,held:0}}),lit:0,win:0,hold:0,next:12,t:0,echo:0,sendT:0};return A3.ar}
function a3Tick(dt){const a=DG&&DG.a21;if(!a||a.k!=='a3'){if(P&&P.buffs&&P.buffs._a3)delete P.buffs._a3;A3.ar=null;A3.zone=null;return}a.t+=dt;
  const host=!a.guest&&!NET.guest;
  if(host){// 다음 층 문
    if(a._nextE&&a._nextE.dead&&!a.nOpen){const e=a._nextE,D=A3_DGBY[a.id];a3NextDoor(a,e.x,e.y,D.next);if(NET.on)v20Send('a3n',{id:a.id,x:Math.round(e.x),y:Math.round(e.y),to:D.next})}
    for(const e of enemies){if(e.dead)continue;
      if(e.k==='ab_stillking'&&e.aggroed){e.a3zT=(e.a3zT==null?8:e.a3zT)-dt;if(e.a3zT<=0){e.a3zT=20;A3.zone={x:e.x,y:e.y,t:3.6,r:280};msg('멈춘 폭포의 왕이 둘레의 시간을 멈춥니다 — 고리 밖으로!','#cfeeff');if(NET.on)v20Send('a3a',{z:[Math.round(e.x),Math.round(e.y)]})}}
      else if(e.k==='ab_silencewarden'){if(!e.a3g&&e.hp<e.max*.5&&e.hp>0){e.a3g=1;e.gsh=1;for(let i=0;i<2;i++){const an=i*Math.PI+.6;let x=e.x+Math.cos(an)*160,y=e.y+Math.sin(an)*160;if(!dgFree(x,y,18)){x=e.x+Math.cos(an)*70;y=e.y+Math.sin(an)*70}
            const g=dgMob('a3_runepillar',x,y,Math.max(1,e.lvl-1));g.guard=e;g.aggroed=true;rings.push({x,y,r:4,max:60,life:.5,col:'#b07aff'})}
          rings.push({x:e.x,y:e.y,r:10,max:e.r*3,life:.8,col:'#b07aff'});msg('침묵의 탑 수문장이 룬 기둥 둘을 깨워 보호막을 두릅니다 — 기둥을 깨세요','#c8a0ff')}
        if(e.gsh&&e.a3g===1&&!enemies.some(o=>o.guard===e&&!o.dead)){e.gsh=0;e.a3g=2;msg('룬 기둥이 모두 깨져 수문장의 보호막이 벗겨졌습니다','#ffd34d');burst(e.x,e.y,'#b07aff',40,200,3,30);PTY.stag(e,PTY.STG.interrupt||40)}}
      else if(e.k==='ab_ashname'&&a.pil)a3Pillars(e,dt)}}
  // 느린 시간 고리 · 멈춘 견습생(망령) 둘레: 숨은 버프(_a3, 화면에 안 보임)
  let sp=0;const z=A3.zone;if(z){z.t-=dt;if(z.t<=0)A3.zone=null;else if(z.t<3&&Math.hypot(P.x-z.x,P.y-z.y)<z.r)sp=-.4}
  if(!sp)for(const e of enemies)if(e.k==='a3_stillwraith'&&!e.dead&&Math.hypot(P.x-e.x,P.y-e.y)<150){sp=-.15;break}
  A3.slow=sp;if(sp)P.buffs._a3={t:.3,max:.3,spd:sp};else if(P.buffs._a3)delete P.buffs._a3;
  if(A3.ar&&NET.on&&NET.host&&(A3.ar.sendT-=dt)<=0){const A=A3.ar;A.sendT=.25;v20Send('a3a',{l:A.lit,h:A.pil.map(p=>p.held),hd:Math.round(A.hold*10),w:Math.round(A.win*10),e:A.echo})}}
V20.tick.push(dt=>{try{a3Tick(dt)}catch(e){if(window.__QA)throw e}});
// 마지막 보스: 두 기둥 (혼자면 기둥 하나는 「봉인의 메아리」)
function a3Pillars(e,dt){if(!e.aggroed)return;const A=A3.ar||a3ArInit();A.t+=dt;A.echo=PTY.partyN()<=1?1:0;const pl=a3Holders();
  for(let k=0;k<A.pil.length;k++){const p=A.pil[k];p.held=(k===0&&A.echo)||pl.some(o=>Math.hypot(o.x-p.x,o.y-p.y)<A3_HOLD)?1:0}
  if(!A.lit){if(A.t>=A.next){A.lit=1;A.win=10;A.hold=0;msg(`두 기둥이 빛납니다 — 6초 동안 두 기둥 곁에 모두 서세요${A.echo?' (기둥 하나는 봉인의 메아리가 지킵니다)':''}`,'#ffb04a');for(const p of A.pil)rings.push({x:p.x,y:p.y,r:10,max:A3_HOLD,life:.8,col:'#ffb04a'})}return}
  A.win-=dt;if(A.pil.every(p=>p.held))A.hold+=dt;
  if(A.hold>=6){A.lit=0;A.next=A.t+30;A.hold=0;e.brk=10;e.stunT=Math.max(e.stunT||0,4);e.cast=0;rings.push({x:e.x,y:e.y,r:10,max:e.r*5,life:.9,col:'#ffd34d'});burst(e.x,e.y,'#ffd34d',50,240,3,20);shake=Math.max(shake,8);
    msg('봉인이 그림자를 붙들었습니다! 10초 동안 무방비 · 받는 피해 +50%','#ffd34d');banner={t:'무방비',sub:'10초 동안 받는 피해 +50%',col:'#ffd34d',life:1.8,max:1.8};if(NET.on)PTY.pm&&PTY.pm({k:'fx',x:Math.round(e.x),y:Math.round(e.y),c:'#ffd34d',r:Math.round(e.r*4)})}
  else if(A.win<=0){A.lit=0;A.next=A.t+30;A.hold=0;for(let i=0;i<3;i++){const p=A.pil[i%2];let x=0,y=0,ok=0;for(let t=0;t<8&&!ok;t++){const an=R()*6.283,d=90+t*12;x=p.x+Math.cos(an)*d;y=p.y+Math.sin(an)*d;ok=dgFree(x,y,14)}if(!ok)continue;const s=dgMob('a3_ashbody',x,y,Math.max(1,e.lvl-2));s.aggroed=true;rings.push({x,y,r:4,max:50,life:.5,col:'#ff8a3a'})}
    msg('기둥의 빛이 꺼졌습니다 · 재로 된 몸이 더 일어납니다','#ff8a6a')}}
V20NET.a3a=m=>{if(!NET.guest||!DG||!DG.a21||DG.a21.k!=='a3')return;
  if(Array.isArray(m.z)){A3.zone={x:+m.z[0]||0,y:+m.z[1]||0,t:3.6,r:280};msg('멈춘 폭포의 왕이 둘레의 시간을 멈춥니다 — 고리 밖으로!','#cfeeff')}
  if(Array.isArray(m.h)&&DG.a21.pil){const A=A3.ar||a3ArInit();A.lit=m.l?1:0;A.pil.forEach((p,i)=>p.held=m.h[i]?1:0);A.hold=clamp((+m.hd||0)/10,0,6);A.win=clamp((+m.w||0)/10,0,10);A.echo=m.e?1:0}};
// 무방비 동안 내 피해 +20% (무너짐 +30%와 더해 +50%)
V20.dmgAdd.push(e=>e&&e.k==='ab_ashname'&&e.brk>0?.2:0);
// 느린 시간 고리 안: 시전 시간 +40%
{const _tc=tryCast;tryCast=function(id,target){if(!(A3.slow<=-.4)||GHOST||CAST_MOD)return _tc.apply(this,arguments);const cu0=CAST.cur,r=_tc.apply(this,arguments);
  if(CAST.cur&&CAST.cur!==cu0&&CAST.cur.id===id){CAST.cur.max=Math.round(CAST.cur.max*1.4*100)/100;castBarSet(CAST.cur)}return r}}

/* ===== 9) 그림: 꼭대기 기둥 · 기둥 고리 · 메아리 · 멈춘 견습생 · 느린 고리 ===== */
const a3PilSpr=()=>SC.get('a3/pillar',110,250,55,215,g=>{g.translate(55,215);Kit.shadow(g,6,4,46,15,1);
  twBox(g,0,0,0,62,62,16,'#3a2c28',{tex:'stone',texA:.55});twCyl(g,0,0,16,20,140,'#4e423e',{bands:[.2,.5,.8],bandC:'rgba(255,120,50,.35)'});
  const s=mulberry(7);g.strokeStyle='rgba(255,170,90,.6)';g.lineWidth=1.3;for(let i=0;i<6;i++){const p=isoP(0,0,34+i*20);g.beginPath();g.moveTo(p.x-5+s()*4,p.y);g.lineTo(p.x+s()*5-2,p.y-7);g.lineTo(p.x+4,p.y-2);g.stroke()}
  twBox(g,0,0,156,50,50,10,'#46383a',{tex:'stone',texA:.5});twCyl(g,0,0,166,22,8,'#2a1e1c',{top:'#120a08'})},{scale:Math.max(1.25,DPR)});
const a3PilAt=(i,j)=>{const a=DG&&DG.a21;return !!(a&&a.k==='a3'&&a.pil&&a.pil.some(p=>p[0]===i&&p[1]===j))};
{const _dw=drawWall;drawWall=function(w){if(!a3PilAt(w.i,w.j))return _dw.apply(this,arguments);const e=a3PilSpr();if(!e)return _dw.apply(this,arguments);
  const s=w._s,ps=P._s||W2S(P.x,P.y),front=w.x+w.y>P.x+P.y&&Math.abs(s.x-ps.x)<90&&s.y-ps.y>-30&&s.y-ps.y<220;ctx.globalAlpha=front?.5:1;SC.draw(ctx,e,s.x,s.y);ctx.globalAlpha=1}}
const a3NovL={key:'a3nov',body:'#5a6a8a',legs:'#3a4458',cape:'#34405a',hair:'#c8d8e8',hs:1,hat:0,dress:1};
const a3IceSpr=()=>SC.get('a3/ice',70,120,35,108,g=>{g.translate(35,108);g.globalAlpha=.42;g.fillStyle='#bfe8ff';g.beginPath();g.moveTo(-24,0);g.lineTo(-28,-70);g.lineTo(-8,-100);g.lineTo(16,-94);g.lineTo(27,-60);g.lineTo(22,0);g.closePath();g.fill();
  g.globalAlpha=.7;g.strokeStyle='#eaf8ff';g.lineWidth=1.4;g.stroke();g.beginPath();g.moveTo(-14,-80);g.lineTo(-6,-30);g.moveTo(10,-86);g.lineTo(14,-50);g.stroke();g.globalAlpha=1},{scale:Math.max(1.25,DPR)});
DM21GLOW.push(()=>{const a=DG.a21;if(a.k!=='a3')return;
  // 멈춘 견습생
  if(a.spots){for(const s of a.spots){const sc=W2S(s.x,s.y);if(!onScreen(sc,120))continue;const on=!!sqUseQ(s.use),woke=A3.woke.has(s.use)||!on&&sqState().d.a3q5>0;
    const e=twFolkSprite(a3NovL,0),fr=P.x+P.y>s.x+s.y&&Math.hypot(P.x-s.x,P.y-s.y)<120;if(e){ctx.globalAlpha=woke||fr?.5:1;SC.draw(ctx,e,sc.x,sc.y);ctx.globalAlpha=1}if(!woke){const ic=a3IceSpr();if(ic){ctx.globalAlpha=fr?.5:1;SC.draw(ctx,ic,sc.x,sc.y);ctx.globalAlpha=1}}
    if(on){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+.2*Math.sin(time*4);glow(sc.x,sc.y-40,34,'#cfeeff');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
      ctx.font=`600 12px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('멈춘 견습생',sc.x,sc.y-112);ctx.fillStyle='#cfeeff';ctx.fillText('멈춘 견습생',sc.x,sc.y-112)}}}
  // 느린 시간 고리
  const z=A3.zone;if(z){G();const pre=z.t>3;ctx.globalAlpha=pre?.35:.5+.15*Math.sin(time*6);ctx.strokeStyle='#cfeeff';ctx.lineWidth=pre?4:8;ctx.beginPath();ctx.arc(z.x,z.y,pre?z.r*(1-(z.t-3)/.6*.5):z.r,0,6.283);ctx.stroke();
    if(!pre){ctx.globalAlpha=.1;ctx.fillStyle='#cfeeff';circ(z.x,z.y,z.r)}ctx.globalAlpha=1;S()}
  // 꼭대기 기둥
  if(a.pil){const A=A3.ar;G();a.pil.forEach(([i,j],k)=>{const c=tc(i,j),p=A&&A.pil[k],lit=A&&A.lit,held=p&&p.held;ctx.globalAlpha=lit?.6:.22;ctx.strokeStyle=lit?(held?'#ffd34d':'#ffb04a'):'#8a6a5a';ctx.lineWidth=lit?10:5;ctx.beginPath();ctx.arc(c.x,c.y,A3_HOLD,0,6.283);ctx.stroke();
      if(lit&&A.hold>0){ctx.globalAlpha=.9;ctx.strokeStyle='#ffe9a0';ctx.lineWidth=16;ctx.beginPath();ctx.arc(c.x,c.y,A3_HOLD,-1.571,-1.571+6.283*clamp(A.hold/6,0,1));ctx.stroke()}});ctx.globalAlpha=1;
    S();ctx.globalCompositeOperation='lighter';a.pil.forEach(([i,j],k)=>{const c=tc(i,j),s=W2S(c.x,c.y);if(!onScreen(s,240))return;const lit=A&&A.lit;ctx.globalAlpha=lit?.85:.25;glow(s.x,s.y-182,lit?52:18,lit?'#ff9a40':'#8a6a50');
      if(k===0&&A&&A.echo){const x=s.x+Math.cos(time*1.4)*40,y=s.y-60+Math.sin(time*2.1)*8;ctx.globalAlpha=.75;glow(x,y,28,'#9fe0ff');ctx.globalAlpha=1;glow(x,y,9,'#ffffff')}});ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(A&&A.echo){const c=tc(a.pil[0][0],a.pil[0][1]),s=W2S(c.x,c.y);if(onScreen(s,240)){ctx.font=`600 12px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('봉인의 메아리',s.x,s.y-96);ctx.fillStyle='#9fe0ff';ctx.fillText('봉인의 메아리',s.x,s.y-96)}}
    const e=enemies.find(o=>o.k==='ab_ashname'&&!o.dead);if(e&&e._s&&A&&A.lit){const s=e._s,top=s.y-(TYPES.ab_ashname.r)*(e.sc||3.4)*2.4-34,w=120,k=clamp(A.hold/6,0,1);
      ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(s.x-w/2-1,top-1,w+2,8);ctx.fillStyle='#ffd34d';ctx.fillRect(s.x-w/2,top,w*k,6);
      ctx.font=`700 13px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const t1=`두 기둥 지키기 ${A.hold.toFixed(1)}/6초 · 남은 ${Math.max(0,A.win).toFixed(0)}초`;ctx.strokeText(t1,s.x,top-8);ctx.fillStyle='#ffe9a0';ctx.fillText(t1,s.x,top-8)}}});
// 같이 하기: 참가자는 받은 층에서 기둥 상태를 새로 만든다
DM21NETIN.push(()=>{A3.ar=null;A3.zone=null});

/* ===== 10) 도감 ===== */
{const _g=cxGroups;cxGroups=function(){const G=_g(),set=new Set(A3_KEYS);for(const g of G)g[1]=g[1].filter(k=>!set.has(k));const out=G.filter(g=>g[1].length);
  const o2=out.length&&out[out.length-1][0]==='그 밖의 몬스터'?out.pop():null;out.push(['3막 「마르는 강」 · 레벨 고정 던전',A3_KEYS.filter(k=>TYPES[k])]);if(o2)out.push(o2);return out}}
{const _mi=monInfo;monInfo=function(k){const m=_mi(k);if(!A3_KEYS.includes(k))return m;const w=[];let lv=99;
  for(const d of A3_DG){if(d.mobs.includes(k)){w.push(`3막 던전 ${d.n}`);lv=Math.min(lv,d.lvl)}if(d.minis.includes(k)){w.push(`3막 던전 ${d.n}의 준보스`);lv=Math.min(lv,d.lvl+1)}if(d.boss===k){w.push(`3막 던전 ${d.n}의 마지막 보스`);lv=Math.min(lv,d.lvl+2)}}
  m.where=w;if(lv<99)m.lv=lv;return m}}
setTimeout(()=>{try{Object.assign(A3,{A3_TYPES,A3_MINIS,A3_BOSSES,A3_DG,A3_DGBY,A3_QUESTS,A3_KEYS,A3_EL,A3_PIL,A3_HOLD,a3Enter,a3Open,a3Act2Done,a3Pick,a3MarkOf,a3Pillars,a3ArInit,a3Holders,a3Tick,a3GateOf,a3GateTarget,a3SummitGrid});if(window.__game)window.__game.A3=A3}catch(_){}},0);
