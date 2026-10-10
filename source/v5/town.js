/* ---------- 마을: 배치 · 마을 사람 · 들어갈 수 있는 건물 ---------- */
// 마을마다 다른 모습: 브렌힐(방앗간 마을) · 윌로벤(나루터) · 헤이븐(여관과 대상 마당) · 아르덴(흰 성벽과 마법원)
const TW={blds:{},folk:[],visB:[],flats:{},water:{},rooms:{},act:null,vis:0};
let IN=null;// 실내에 있으면 {room,town,door,saved}
const twL=id=>id==='home'?HOME:RCACHE[id];
// 건물 하나: 월드 기준 W(x폭) · D(y폭) · ridge('x'|'y'). door.face는 월드 면('y'=화면 왼쪽 아래, 'x'=오른쪽 아래)
function twMkBld(t,o){const flip=o.ridge==='y',W=o.W,D=o.D,x=t.x+o.dx,y=t.y+o.dy,df=o.door||{face:'y',f:.5};
  const b={st:o.st,w:flip?D:W,d:flip?W:D,h:o.h||46,rh:o.rh,v:o.v|0,seed:o.seed||((o.dx*7+o.dy*13)&1023),door:{face:flip?(df.face==='y'?'x':'y'):df.face,f:df.f},lamp:o.lamp,box:o.box,big:o.big,tall:o.tall,chim:o.chim,doorC:o.doorC,cold:o.cold,
    towers:(o.towers||[]).map(q=>({...q,x:flip?q.y:q.x,y:flip?q.x:q.y})),towerC:o.towerC,winY:o.winY,winX:o.winX,stilt:o.stilt};
  const d={x,y,k:'bld',s:1,v:0,town:t,b,flip,W,D,light:o.light!=null?o.light:60,id:o.id,mill:o.mill,label:o.label,signT:o.sign,signC:o.signC};
  d.door=df.face==='y'?{x:x-W/2+df.f*W,y:y+D/2+18}:{x:x+W/2+18,y:y-D/2+df.f*D};
  d.foot=[[x-W/2-3,y-D/2-3,x+W/2+3,y+D/2+3]];for(const q of o.towers||[]){const tx=x+q.x,ty=y+q.y,r=q.sz/2+3;d.foot.push([tx-r,ty-r,tx+r,ty+r])}
  if(o.enter)d.enter=o.enter;return d}
// 마을 배치표. 좌표는 마을 한가운데에서의 거리
const TWLAY={
 brenhill:{gate:[-60,125],stash:[80,175],npc:[-125,-45],
  shops:[['general',110,-40,'방앗간 잡화점'],['weapon',150,145,'브렌힐 대장간'],['armor',-60,-150,'양털 갑옷집']],
  blds:[{keep:5,st:'bren',W:100,D:78,door:{face:'y',f:.72},lamp:1,box:1,v:1,label:'페이스라인 성형외과'},
   {id:'bren_chapel',enter:'bren_chapel',st:'bren',dx:-255,dy:-150,W:130,D:72,h:52,ridge:'x',door:{face:'x',f:.5},towers:[{x:-78,y:0,sz:26,h:96,rh:40,bell:1,cross:1}],towerC:'#8a6a3a',v:2,lamp:1,label:'브렌힐 예배당'},
   {id:'bren_mill',st:'bren',dx:-310,dy:70,W:64,D:64,h:66,rh:30,ridge:'y',door:{face:'x',f:.5},mill:1,v:0,chim:0,label:'방앗간'},
   {id:'bren_home',enter:'bren_home',st:'bren',dx:205,dy:-135,W:96,D:76,door:{face:'y',f:.4},box:1,v:0,lamp:1,label:'방앗간지기네 집'},
   {id:'bren_smithy',enter:'bren_smithy',st:'bren',dx:225,dy:70,W:90,D:72,ridge:'y',door:{face:'y',f:.5},v:2,label:'대장간',doorC:'#3a2a1a'},
   {st:'bren',dx:-130,dy:255,W:90,D:70,door:{face:'x',f:.5},box:1,v:1},
   {st:'bren',dx:-60,dy:-340,W:96,D:72,door:{face:'y',f:.5},v:0},
   {st:'bren',dx:-400,dy:-70,W:80,D:66,ridge:'y',door:{face:'x',f:.5},v:2}],
  props:[['well',-160,25],['bench',90,-80,0],['bench',-80,70,0,1],['flowerbed',-120,-195],['flowerbed',150,-90],['flowerbed',-175,235,1],
   ['anvil',170,105],['barrel',268,128],['crate',283,112,1],['cart',250,215,0],['sacks',-262,110],['sacks',-275,128],['haystack',-345,215],['haystack',-90,390],
   ['fence',-200,270,0],['fence',-144,270,0],['fence',-200,380,0],['fence',-144,380,0],['fence',-228,298,1],['fence',-228,352,1],['fence',-116,298,1],['fence',-116,352,1],
   ['sheep',-190,310],['sheep',-150,340,1],['sheep',-175,355,2],['sheep',-135,305],
   ['wheat',-330,-230],['wheat',-380,-280],['wheat',-300,-300],['wheat',-420,-220],['wheat',-360,-170],['wheat',-450,-150],['wheat',320,-280],['wheat',380,-230],['wheat',360,-320],
   ['oak',-470,60],['oak',380,190],['oak',140,-360],['lamp',125,135],['lamp',-160,-70],['lamp',-10,-230],['lamp',190,-30],['lamp',-200,160],['signpost',300,-60],['barrel',-235,-95],['crate',-215,-100]],
  folk:[['toby',30,95],['marta',-200,60],['garret',-70,210],['lina',230,250],['bruno',300,-25],['farmer',-360,-240],['shepherd',-250,320],['miller',-250,95],['smith',145,170],['armorer',-75,-170],['grocer',115,-62],['oldman',100,-100],['kid1',-30,70],
   ['hanna',0,0,'bren_home'],['yoan',0,0,'bren_chapel'],['nun',0,0,'bren_chapel'],['appr',0,0,'bren_smithy'],['millwife',0,0,'bren_home']]},
 // v26: 윌로벤은 헤이븐으로 합쳤다 (나루 주점 · 뱃사공 오두막 · 강가 나루는 헤이븐 남쪽 「헤이븐 나루」로)
 haven:{gate:[-60,120],stash:[80,175],npc:[-110,-95],
  river:{x0:-560,x1:600,y0:340,y1:470},docks:[[-175,-125,315,445],[55,105,315,440],[215,280,315,380]],// v26: 넓힌 마을(×1.8)에서 강이 마을 끝(720) 안쪽에 오도록 가깝게
  shops:[['general',110,-40,'교차로 잡화점'],['weapon',-135,40,'용병 무기점'],['armor',40,-135,'대상 갑옷점']],
  blds:[{id:'haven_inn',enter:'haven_inn',st:'haven',dx:-205,dy:-215,W:170,D:100,h:66,tall:1,big:1,door:{face:'y',f:.55},lamp:1,v:0,sign:'황금 마차 여관',label:'황금 마차 여관'},
   {id:'haven_store',enter:'haven_store',st:'haven',dx:235,dy:-160,W:110,D:80,ridge:'y',door:{face:'y',f:.5},v:1,chim:0,label:'대상 창고'},
   {st:'haven',dx:-330,dy:80,W:90,D:72,ridge:'y',door:{face:'x',f:.5},v:2,box:1},
   {st:'haven',dx:60,dy:-340,W:96,D:72,door:{face:'y',f:.5},v:1},
   {st:'haven',dx:-120,dy:300,W:84,D:70,door:{face:'x',f:.5},v:0},
   {id:'will_tavern',enter:'will_tavern',st:'will',dx:-330,dy:285,W:130,D:82,big:1,door:{face:'x',f:.5},lamp:1,v:0,sign:'나루 주점',label:'나루 주점'},
   {id:'will_home',enter:'will_home',st:'will',dx:440,dy:290,W:92,D:70,door:{face:'y',f:.5},v:1,box:1,label:'뱃사공네 오두막'}],
  props:[['wagon',250,120,0],['wagon',345,215,1],['tent',215,285,0],['tent',390,90,2],['campfire',300,170],['kegs',175,215],['crate',210,195],['crate',225,205,2],['sacks',380,170],['barrel',150,240],
   ['trough',-260,150],['fence',170,60,0],['fence',226,60,0],['fence',420,150,1],['fence',420,206,1],['signpost',30,90],['bench',80,-90],
   ['lamp',-120,-120],['lamp',150,-120],['lamp',-200,0],['lamp',130,60],['lamp',-60,200],['flowerbed',-110,-150],['oak',-430,-120],['oak',-470,330],['banner',-80,-150,0],['banner',60,-170,1],
   ['boat',-60,410,0],['boat',175,423,1],['boat',-270,400,2],['boat',345,407,0],['boat',440,445,1],['pier',-150,385],['pier',80,385],['nets',-40,305],['nets',150,297],['lamp',-150,310],['lamp',100,310],['signpost',-230,320]],
  folk:[['kasim',270,180],['guard1',30,140],['guard2',-180,60],['trader',140,90],['traveler',-30,-160],['kid4',-20,60],['weaponer2',-150,22],['armorer2',38,-158],['grocer3',118,-62],['cook',320,190],
   ['toma',0,0,'haven_inn'],['bard2',0,0,'haven_inn'],['patron',0,0,'haven_inn'],['clerk',0,0,'haven_store'],
   ['odric',120,305],['jon',300,315],['nella',-130,300],['ella',30,250],['fisher',-150,420],['sailor',90,360],
   ['bram',0,0,'will_tavern'],['magda',0,0,'will_tavern'],['bard',0,0,'will_tavern'],['elsa',0,0,'will_home']]},
 // v26 왕도 아르덴 (사용자 2026-10-10 「왕도만 있는 맵 … 화려하게 … 각 직업들의 전당 … 주요한 편의기능」): 왕도 지도(REGIONS.royal) 한가운데.
 // 하얀 성벽(가로세로 1520) · 사방 성문 · 가운데 광장(분수 · 짝문 · 창고 · 노점 셋). 북서 왕궁, 북동 왕립 마법원(마법사 전당) · 사냥꾼 회관(궁수 전당) · 빵집,
 // 남서 대성당(사제 전당) · 기사단 전당(전사 전당), 남동 정원. 전직관 넷은 각 전당 안에 있다(job2q.js). fixed: 사람 수로 배치를 넓히지 않는다(wx-base.js).
 arden:{fixed:1,gate:[-170,-150],stash:[-80,-235],npc:[-240,-40],
  shops:[['general',190,-150,'왕도 잡화점'],['weapon',-190,150,'왕실 무기고'],['armor',150,190,'은빛 갑옷점']],
  blds:[{id:'arden_palace',st:'arden',dx:-470,dy:-470,W:320,D:200,h:92,big:1,tall:1,door:{face:'y',f:.5},lamp:1,v:0,cold:1,
     towers:[{x:-160,y:-100,sz:46,h:200,rh:80,cold:1,flag:'#24325c'},{x:160,y:-100,sz:46,h:200,rh:80,cold:1,flag:'#8a2a3a'},{x:-160,y:100,sz:40,h:160,rh:66,cold:1},{x:0,y:-100,sz:60,h:250,rh:96,cold:1,flag:'#d8b860'}],towerC:'#2e3e66',sign:'왕궁',label:'왕궁'},
   {id:'arden_academy',enter:'arden_academy',st:'arden',dx:480,dy:-480,W:220,D:130,h:66,big:1,tall:1,door:{face:'y',f:.4},lamp:1,v:0,cold:1,
     towers:[{x:-130,y:-34,sz:36,h:160,rh:72,cold:1,flag:'#24325c'},{x:30,y:-88,sz:30,h:130,rh:58,cold:1},{x:130,y:-24,sz:32,h:146,rh:64,cold:1,flag:'#5a3a8a'}],towerC:'#2e3e66',sign:'왕립 마법원',label:'왕립 마법원 · 마법사 전당'},
   {id:'arden_bakery',enter:'arden_bakery',st:'arden',dx:200,dy:-340,W:100,D:76,door:{face:'y',f:.45},v:1,lamp:1,sign:'백합 빵집',label:'백합 빵집'},
   {id:'arden_lodge',enter:'arden_lodge',st:'arden',dx:530,dy:-190,W:170,D:96,h:56,door:{face:'y',f:.5},v:2,lamp:1,towers:[{x:70,y:-20,sz:26,h:110,rh:44,flag:'#3e5a2e'}],towerC:'#3e4a2e',sign:'사냥꾼 회관',label:'사냥꾼 회관 · 궁수 전당'},
   {id:'arden_cathedral',enter:'arden_cathedral',st:'arden',dx:-480,dy:480,W:230,D:130,h:72,big:1,tall:1,ridge:'x',door:{face:'y',f:.5},lamp:1,v:0,
     towers:[{x:-125,y:0,sz:38,h:190,rh:72,bell:1,cross:1},{x:125,y:-40,sz:28,h:132,rh:54,cross:1}],towerC:'#6a3a3a',sign:'대성당',label:'대성당 · 사제 전당'},
   {id:'arden_knights',enter:'arden_knights',st:'arden',dx:-190,dy:530,W:190,D:110,h:62,big:1,door:{face:'x',f:.5},lamp:1,v:1,
     towers:[{x:-80,y:-40,sz:30,h:124,rh:50,flag:'#8a2a3a'}],towerC:'#4a3a3a',sign:'기사단 전당',label:'기사단 전당 · 전사 전당'},
   {st:'arden',dx:-580,dy:200,W:100,D:76,ridge:'y',door:{face:'x',f:.5},v:2,tall:1,h:58},
   {st:'arden',dx:340,dy:580,W:110,D:80,door:{face:'y',f:.5},v:1,tall:1,h:58},
   {st:'arden',dx:590,dy:330,W:100,D:76,ridge:'y',door:{face:'x',f:.5},v:0}],
  props:[['statue2',420,420],['well',260,330],['planter',-250,-250],['planter',250,250],['planter',250,-260],['planter',-260,250],
   ['banner',-300,-330,1],['banner',-330,-300,1],['banner',-620,-330,0],['banner',-330,-620,0],['banner',320,-370,1],['banner',-330,370,0],['banner',-90,440,0],
   ['bench',300,140,0],['bench',140,300,0,1],['bench',-300,120,0],['flowerbed',-140,-300],['flowerbed',140,-300],['flowerbed',300,-110],['flowerbed',-310,170],['flowerbed',470,470],['flowerbed',380,520],
   ['oak',620,620],['oak',230,650],['oak',650,200],['oak',-680,-200],['oak',-200,-680],['oak',-660,660],['oak',640,-660],
   ['tent',-420,680,0],['tent',-560,640,2],['campfire',-470,640],['crate',-320,640],['barrel',-300,660],
   ['lamp',-70,-380],['lamp',70,-380],['lamp',-380,-70],['lamp',-380,70],['lamp',-70,380],['lamp',70,380],['lamp',380,-70],['lamp',380,70],['lamp',-70,-560],['lamp',70,-560],['lamp',-560,-70],['lamp',-560,70],['lamp',-70,560],['lamp',70,560],['lamp',560,-70],['lamp',560,70],
   ['cwall',-140,-760,0],['cwall',-140,760,0],['cwall',-760,-140,1],['cwall',760,-140,1],['cwall',140,-760,0],['cwall',140,760,0],['cwall',-760,140,1],['cwall',760,140,1],['cwall',-280,-760,0],['cwall',-280,760,0],['cwall',-760,-280,1],['cwall',760,-280,1],['cwall',280,-760,0],['cwall',280,760,0],['cwall',-760,280,1],['cwall',760,280,1],['cwall',-420,-760,0],['cwall',-420,760,0],['cwall',-760,-420,1],['cwall',760,-420,1],['cwall',420,-760,0],['cwall',420,760,0],['cwall',-760,420,1],['cwall',760,420,1],['cwall',-560,-760,0],['cwall',-560,760,0],['cwall',-760,-560,1],['cwall',760,-560,1],['cwall',560,-760,0],['cwall',560,760,0],['cwall',-760,560,1],['cwall',760,560,1],['cwall',-700,-760,0],['cwall',-700,760,0],['cwall',-760,-700,1],['cwall',760,-700,1],['cwall',700,-760,0],['cwall',700,760,0],['cwall',-760,700,1],['cwall',760,700,1],
   ['gatetower',-760,-760],['gatetower',760,-760],['gatetower',-760,760],['gatetower',760,760],['gatetower',-100,-760],['gatetower',100,-760],['gatetower',-100,760],['gatetower',100,760],['gatetower',-760,-100],['gatetower',-760,100],['gatetower',760,-100],['gatetower',760,100]],
  folk:[['guardA',-60,690],['guardB',260,90],['guardC',690,60],['noble',60,-100],['scholar',-120,0],['priestess',-300,410],['kid5',30,40],['weaponer3',-215,110],['armorer3',110,215],['grocer4',215,-110],
   ['mira',0,0,'arden_academy'],['oswin',0,0,'arden_academy'],['student',0,0,'arden_academy'],['baker',0,0,'arden_bakery']]},
};
// 마을 사람 생김새와 말. role은 이름 앞에 붙는 직업
const TWFOLK={
 toby:{n:'꼬마 토비',role:'아이',L:{child:1,body:'#5a7a3a',legs:'#5a4a3a',hair:'#8a5a2a',hs:0,hat:2,hatC:'#a84a3a'},walk:[[30,95],[70,60],[40,30],[-10,60]],lines:['우리 고양이 보리 못 봤어요?','동상 코가 왜 저렇게 높은지 아세요? 저도 몰라요!']},
 marta:{n:'약초꾼 마르타',role:'약초꾼',L:{body:'#5a6a3e',apron:'#c8b890',hair:'#c8c0b0',hs:2,hat:6,hatC:'#7a5a8a',prop:'basket',dress:1},lines:['은방울풀은 들판 가장자리에 흰 꽃을 피운단다.','약초는 아침 이슬이 마르기 전에 캐야 향이 살아.']},
 garret:{n:'사냥꾼 가렛',role:'사냥꾼',L:{body:'#4a5a3a',legs:'#3a3020',cape:'#3e4a2a',hair:'#3a2a1a',hs:3,hat:3,hatC:'#4a5a3a',prop:'spear'},lines:['늑대들이 요즘 유난히 사나워.','송곳니로 부적을 만들면 액운을 막는다지.']},
 lina:{n:'행상인 리나',role:'떠돌이 상인',L:{body:'#8a4a6a',apron:'#e8d8b0',hair:'#3a2418',hs:4,hat:1,hatC:'#d8b878',prop:'basket',dress:1},lines:['헤이븐까지 짐을 옮겨야 하는데 길이 무서워서요.','브렌힐 양털은 어디서나 비싸게 팔려요.']},
 bruno:{n:'경비대장 브루노',role:'경비대장',L:{armor:1,body:'#8a8a92',legs:'#4a4a52',tabard:'#6a2a2a',hair:'#5a3a2a',hs:3,hat:4,prop:'sword'},walk:[[300,-25],[330,40],[270,60]],lines:['동쪽 길은 내가 지킨다. 늑대 따위는 얼씬도 못 해.','촌장님 말씀은 길어도 틀린 적이 없지.']},
 farmer:{n:'농부 해럴드',role:'농부',L:{body:'#8a6a3a',legs:'#5a4a30',hair:'#6a4a2a',hs:0,hat:1,hatC:'#d8b878',prop:'pitchfork'},walk:[[-360,-240],[-300,-200],[-280,-280],[-380,-300]],lines:['올해 밀은 알이 꽉 찼어.','방앗간 날개가 돌면 마을이 숨을 쉬는 거야.']},
 shepherd:{n:'양치기 소녀 엘리',role:'양치기',L:{child:1,body:'#c8b890',legs:'#5a4a3a',hair:'#d8a860',hs:4,hat:6,hatC:'#c84a4a',dress:1},walk:[[-250,320],[-260,260],[-250,380]],lines:['양들이 오늘은 말을 잘 들어요.','늑대가 오면 가렛 아저씨를 불러요!']},
 miller:{n:'방앗간지기 오토',role:'방앗간지기',L:{body:'#e8e2d2',apron:'#c8b890',legs:'#6a5a4a',hair:'#8a7a6a',hs:3,hat:2,hatC:'#e8e2d2'},lines:['밀가루 냄새 좋지? 우리 집사람 빵은 더 좋아.','바람이 좋은 날엔 하루에 쉰 자루도 빻아.']},
 smith:{n:'대장장이 그롬',role:'대장장이',shopk:'weapon',L:{body:'#5a4a3e',apron:'#3a2a1e',legs:'#3a3030',hair:'#2a1a10',hs:3,prop:'hammer',skin:'#c8946a'},lines:['쇠는 뜨거울 때 두드려야지!']},
 armorer:{n:'갑옷장수 베아',role:'갑옷장수',shopk:'armor',L:{body:'#6a3a5a',apron:'#8a6a4a',hair:'#a85a2a',hs:4,dress:1},lines:['양털 안감을 댄 로브는 겨울에도 따뜻해요.']},
 grocer:{n:'잡화상 피핀',role:'잡화상',shopk:'general',L:{body:'#3a5a6a',apron:'#d8d0b8',hair:'#6a4a2a',hs:0,hat:2,hatC:'#3a5a6a'},lines:['물약은 넉넉히 챙겨 가요.']},
 oldman:{n:'노인 바르톨',role:'마을 어른',L:{body:'#5a4a5a',legs:'#4a3a3a',hair:'#d8d4cc',hs:3,prop:'staff',gem:'#8a6a3a'},lines:['저 동상은 내 할머니의 할머니 때부터 있었지. 코는 나중에 고쳤다더군.','젊을 땐 나도 고분까지 갔었다네.']},
 kid1:{n:'꼬마 미나',role:'아이',L:{child:1,body:'#c84a6a',legs:'#5a4a3a',hair:'#3a2418',hs:4,dress:1},walk:[[-30,70],[60,40],[60,-60],[-50,-50]],spd:70,lines:['술래잡기 할래요?','토비가 또 고양이 잃어버렸대요!']},
 hanna:{n:'빵집 아낙 한나',role:'빵 굽는 이',room:[30,-20],L:{body:'#a85a3a',apron:'#f0e8d8',hair:'#a86a3a',hs:2,hat:6,hatC:'#f0e8d8',dress:1,prop:'bread'},lines:['갓 구운 빵 냄새 맡고 왔구나?','오토가 빻은 밀가루라 고소하단다.']},
 millwife:{n:'꼬마 루크',role:'아이',room:[-60,70],L:{child:1,body:'#4a6a8a',legs:'#5a4a3a',hair:'#d8a860',hs:0},lines:['아빠는 방앗간에 있어요.']},
 yoan:{n:'사제 요안',role:'사제',room:[-90,40],L:{body:'#ece3cc',legs:'#cfc4a8',cape:'#7e2a2c',hair:'#6a5a4a',hs:0,hat:7,hatC:'#ece3cc',prop:'book',dress:1},lines:['빛이 그대와 함께하기를.','종소리가 울리면 들판의 일꾼들이 쉬어 갑니다.']},
 nun:{n:'수녀 클라라',role:'수녀',room:[20,-90],L:{body:'#3a3a4a',hair:'#3a2a1a',hs:1,hat:3,hatC:'#2a2a3a',dress:1,prop:'book'},lines:['고분의 일 이후로 기도하러 오는 이가 늘었어요.']},
 appr:{n:'견습 대장장이 핀',role:'견습생',room:[40,30],L:{body:'#6a5a4a',apron:'#3a2a1e',hair:'#a85a2a',hs:0,prop:'hammer'},lines:['그롬 아저씨는 망치질 소리만 듣고도 잘못을 알아채요.']},
 // 윌로벤
 odric:{n:'뱃사공 오드릭',role:'뱃사공',L:{body:'#3a4a6a',cape:'#2a3a4a',legs:'#3a3a4a',hair:'#d8d4cc',hs:3,hat:6,hatC:'#3a5a6a',prop:'staff',gem:'#8fd8ff'},lines:['강물이 불어 옛 나루가 잠긴 뒤로, 윌로벤 사람들은 다 이 헤이븐 나루로 옮겨 왔지.','은류강 굽이는 내 손금 같다네.']},
 jon:{n:'배목수 욘',role:'배목수',L:{body:'#5a6a7a',apron:'#8a6a4a',legs:'#3a3a4a',hair:'#8a6a4a',hs:3,hat:2,hatC:'#3a4a5a',prop:'hammer'},lines:['좋은 배는 좋은 나무에서 나오지.','강물이 실어 오는 나무도 쓸 만해.']},
 nella:{n:'어부 아내 넬라',role:'어부 아내',L:{body:'#4a6a7a',apron:'#c8c0a8',hair:'#3a2418',hs:2,hat:6,hatC:'#4a7a8a',dress:1,prop:'basket'},walk:[[-130,380],[-80,390],[-160,400]],lines:['슬라임 점액을 배 틈에 바르면 물이 안 새요.','오늘은 은어가 많이 잡혔어요.']},
 ella:{n:'순례자 엘라',role:'순례자',L:{body:'#c8b8a0',cape:'#6a5a4a',hair:'#d8c090',hs:1,hat:3,hatC:'#8a7a6a',prop:'staff',gem:'#ffe39a',dress:1},lines:['브렌힐 예배당까지 순례를 가려는 중이에요.','혼자 길을 나서기엔 늑대 울음이 너무 가까워요.']},
 fisher:{n:'낚시꾼 노아',role:'낚시꾼',L:{body:'#6a5a3a',legs:'#3a3a3a',hair:'#5a4a3a',hs:3,hat:1,hatC:'#a89060',prop:'rod'},lines:['쉿, 물고기 도망가.','강 건너 갈대숲엔 들어가지 마.']},
 sailor:{n:'뱃사람 타릭',role:'뱃사람',L:{body:'#e8e2d2',legs:'#2a3a5a',hair:'#2a1a10',hs:0,hat:6,hatC:'#c83a3a',skin:'#b8845a'},walk:[[90,440],[80,500],[100,420]],lines:['강 하류 옛 나루까지 짐배가 오가지.','오드릭 영감은 강의 모든 굽이를 알아.']},
 kid2:{n:'꼬마 핍',role:'아이',L:{child:1,body:'#3a6a8a',legs:'#5a4a3a',hair:'#8a5a2a',hs:0},walk:[[40,60],[0,100],[-40,40],[20,0]],spd:75,lines:['물수제비 다섯 번 떴어요!']},
 kid3:{n:'꼬마 솔',role:'아이',L:{child:1,body:'#c8a040',legs:'#5a4a3a',hair:'#3a2418',hs:4,dress:1},walk:[[-20,20],[40,-20],[-40,-30]],spd:60,lines:['핍이 거짓말해요. 세 번이었어요.']},
 weaponer:{n:'무기상 도린',role:'무기상',shopk:'weapon',L:{body:'#4a4a5a',apron:'#5a3a22',hair:'#2a1a10',hs:3,prop:'sword'},lines:['강도 떼에겐 긴 지팡이가 제일이야.']},
 tanner:{n:'가죽장이 레아',role:'가죽장이',shopk:'armor',L:{body:'#6a4a2a',apron:'#3a2a1a',hair:'#a85a2a',hs:4,dress:1},lines:['물에 젖어도 끄떡없는 가죽이에요.']},
 grocer2:{n:'잡화상 몰리',role:'잡화상',shopk:'general',L:{body:'#5a7a5a',apron:'#e8e0c8',hair:'#c8a060',hs:2,dress:1},lines:['소금에 절인 생선도 있어요.']},
 bram:{n:'어부 브람',role:'어부',room:[60,30],L:{body:'#5a4a3a',legs:'#3a3a3a',hair:'#8a5a3a',hs:3,hat:6,hatC:'#4a6a7a',prop:'mug'},lines:['한잔 하겠나? 오늘 잡은 놈은 이만했지!','브렌힐 빵이 그립구먼.']},
 magda:{n:'주점 주인 마그다',role:'주점 주인',room:[-50,-135],L:{body:'#8a3a3a',apron:'#e8e0c8',hair:'#3a2418',hs:2,dress:1,prop:'mug'},lines:['나루 주점에 온 걸 환영해!','강바람 맞고 왔으면 따뜻한 수프부터 들어.']},
 bard:{n:'음유시인 핀리',role:'음유시인',room:[130,-60],L:{body:'#3a5a8a',cape:'#8a3a3a',hair:'#d8a860',hs:1,hat:2,hatC:'#8a2a3a',prop:'lute'},lines:['♪ 은류강 물결 위로 달이 뜨면~','고분의 왕을 쓰러뜨린 영웅의 노래를 짓는 중이야.']},
 elsa:{n:'할머니 엘사',role:'뱃사공 어머니',room:[-30,10],L:{body:'#5a4a6a',apron:'#a89878',hair:'#e8e4dc',hs:2,dress:1},lines:['오드릭이 또 강에 나갔구나. 밥은 먹고 다니는지.','차 한 잔 들고 가렴.']},
 // 헤이븐
 kasim:{n:'대상 우두머리 카심',role:'대상 우두머리',L:{body:'#8a5a2a',cape:'#3a5a7a',legs:'#4a3a2a',hair:'#1a1210',hs:3,hat:8,skin:'#a8744a'},lines:['재 들개들이 짐수레를 물어뜯었어. 짐을 찾아 주면 사례하지.','대상은 길이 열려야 산다네.']},
 guard1:{n:'경비병 로웬',role:'경비병',L:{armor:1,body:'#8a8a92',legs:'#4a4a52',tabard:'#2e4a6a',hair:'#3a2a1a',hs:0,hat:4,prop:'spear'},walk:[[30,140],[120,40],[30,-50],[-60,40]],lines:['교차로는 내가 지킨다.','잿빛 병사들이 또 내려오면 종을 쳐야지.']},
 guard2:{n:'경비병 마테오',role:'경비병',L:{armor:1,body:'#8a8a92',legs:'#4a4a52',tabard:'#2e4a6a',hair:'#5a3a2a',hs:3,hat:4,prop:'spear'},lines:['여관 맥주는 근무 끝나고 마시는 거다.']},
 trader:{n:'비단 상인 유진',role:'비단 상인',L:{body:'#6a3a8a',cape:'#c8a040',hair:'#2a1a10',hs:0,hat:2,hatC:'#c8a040',prop:'book'},walk:[[140,90],[200,40],[120,20]],lines:['수도에서는 이 비단이 금값이지.']},
 traveler:{n:'나그네 오렌',role:'나그네',L:{body:'#6a6a5a',cape:'#4a3a2a',hair:'#5a4a3a',hs:3,hat:1,hatC:'#6a5a3a',prop:'staff',gem:'#8a6a3a'},lines:['어디로 가든 이 교차로를 지나게 되지.']},
 kid4:{n:'꼬마 니코',role:'아이',L:{child:1,body:'#8a6a2a',legs:'#4a3a2a',hair:'#2a1a10',hs:0},walk:[[-20,60],[50,30],[0,-30]],spd:80,lines:['마차 바퀴 굴리기 놀이해요!']},
 weaponer2:{n:'용병 무기상 하겐',role:'무기상',shopk:'weapon',L:{body:'#4a3a3a',apron:'#3a2a1a',hair:'#8a3a2a',hs:3,prop:'sword'},lines:['용병들이 쓰던 물건이지만 날은 서 있어.']},
 armorer2:{n:'갑옷장수 이네스',role:'갑옷장수',shopk:'armor',L:{body:'#3a5a6a',apron:'#6a4a2a',hair:'#2a1a10',hs:4,dress:1},lines:['대상 호위들이 입는 튼튼한 옷이에요.']},
 grocer3:{n:'잡화상 보로',role:'잡화상',shopk:'general',L:{body:'#7a5a3a',apron:'#e0d8c0',hair:'#6a5a4a',hs:3},lines:['여행엔 귀환 두루마리가 최고지.']},
 cook:{n:'대상 요리사 사라',role:'요리사',L:{body:'#c8a070',apron:'#f0e8d8',hair:'#3a2418',hs:2,hat:6,hatC:'#c84a3a',dress:1},lines:['모닥불에 끓인 콩죽 한 그릇 할래요?']},
 toma:{n:'여관 일꾼 토마',role:'여관 일꾼',room:[0,-100],L:{body:'#6a5a3a',apron:'#e8e0c8',hair:'#a86a3a',hs:0,prop:'mug'},lines:['맥주통이 떨어지면 리사 아주머니한테 혼나요.','2층 방은 다 찼어요.']},
 bard2:{n:'음유시인 셀린',role:'음유시인',room:[120,60],L:{body:'#8a2a4a',cape:'#2a4a6a',hair:'#d8c090',hs:1,prop:'lute',dress:1},lines:['♪ 교차로의 등불 아래 길손들 모여~','배신자 헤르딘의 노래는 아무도 듣고 싶어 하지 않더라.']},
 patron:{n:'술꾼 고든',role:'단골손님',room:[20,80],L:{body:'#5a3a3a',legs:'#3a3030',hair:'#6a4a3a',hs:3,prop:'mug'},lines:['딸꾹… 내가 왕년에 오우거를…','리사 아주머니 맥주가 제일이야.']},
 clerk:{n:'창고지기 벤',role:'창고지기',room:[0,-40],L:{body:'#5a5a4a',apron:'#8a7a5a',hair:'#8a7a6a',hs:3,prop:'book'},lines:['장부에 없는 짐은 하나도 없어.','카심 씨 짐이 또 사라졌다고?']},
 // 아르덴
 guardA:{n:'왕실 근위병 에반',role:'근위병',L:{armor:1,body:'#c8c8d0',legs:'#5a5a6a',tabard:'#24325c',hair:'#3a2a1a',hs:0,hat:4,prop:'spear'},lines:['왕도에 온 것을 환영한다.']},
 guardB:{n:'왕실 근위병 루카',role:'근위병',L:{armor:1,body:'#c8c8d0',legs:'#5a5a6a',tabard:'#24325c',hair:'#2a1a10',hs:3,hat:4,prop:'spear'},walk:[[260,90],[200,160],[150,60]],lines:['마법원 학생들이 또 불꽃놀이를 했다지.']},
 guardC:{n:'성벽 경비 다리오',role:'성벽 경비',L:{armor:1,body:'#c8c8d0',legs:'#5a5a6a',tabard:'#24325c',hair:'#5a3a2a',hs:3,hat:4,prop:'sword'},lines:['성벽 너머로 망령의 불빛이 보인다.']},
 noble:{n:'귀부인 세라핀',role:'귀족',L:{body:'#5a2a6a',cape:'#c8a040',hair:'#d8c090',hs:2,dress:1,skin:'#f0d0b0'},walk:[[60,-100],[120,-40],[20,-30]],spd:40,lines:['어머, 시골에서 오셨나 봐요?','백합 빵집의 크림빵은 꼭 드셔 보세요.']},
 scholar:{n:'학자 테오',role:'학자',L:{body:'#3a3a6a',cape:'#24325c',hair:'#8a7a6a',hs:3,hat:5,hatC:'#2a2a5a',prop:'book'},walk:[[-120,0],[-60,-60],[-180,-60]],spd:35,lines:['재의 사도에 관한 옛 기록을 찾는 중이라네.','일곱 첨탑은 각각 다른 위계를 가르친다네.']},
 priestess:{n:'사제 아우렐리아',role:'사제',L:{body:'#ece3cc',cape:'#7e2a2c',hair:'#c8a060',hs:1,hat:3,hatC:'#ece3cc',dress:1,prop:'staff',gem:'#ffe39a'},lines:['성 아우렐의 빛이 그대를 지키기를.']},
 kid5:{n:'꼬마 귀족 레오',role:'아이',L:{child:1,body:'#24325c',legs:'#e8e2d2',hair:'#d8c090',hs:0,cape:'#8a2a3a'},walk:[[30,40],[-40,60],[0,-20]],spd:70,lines:['나도 커서 대마법사가 될 거야!']},
 weaponer3:{n:'무기고지기 브란트',role:'무기상',shopk:'weapon',L:{armor:1,body:'#9a9aa2',legs:'#4a4a52',tabard:'#24325c',hair:'#2a1a10',hs:3},lines:['왕실 공방에서 벼린 지팡이다.']},
 armorer3:{n:'재단사 이졸데',role:'재단사',shopk:'armor',L:{body:'#24325c',apron:'#c8b070',hair:'#1a1210',hs:2,dress:1},lines:['마법원 교복도 제가 지었답니다.']},
 grocer4:{n:'잡화상 펠릭스',role:'잡화상',shopk:'general',L:{body:'#5a3a5a',apron:'#e0d8c0',hair:'#8a6a4a',hs:0,hat:2,hatC:'#5a3a5a'},lines:['왕도 물가는 좀 비싸다네.']},
 mira:{n:'마법원 학생 미라',role:'학생',room:[60,-40],L:{body:'#2b3080',cape:'#2a1c4e',hair:'#3a2418',hs:4,hat:5,hatC:'#252a70',prop:'book',dress:1},lines:['시험 기간이라 밖에 나갈 틈이 없어요.','엘리안 선생님은 무섭지만 공정하세요.']},
 oswin:{n:'오스윈 교수',role:'교수',room:[-120,-40],L:{body:'#4a2a6a',cape:'#2a1a3a',hair:'#d8d4cc',hs:3,hat:5,hatC:'#3a1a5a',prop:'staff',gem:'#8fd8ff'},lines:['망령의 정수는 봉인 연구에 꼭 필요하다네.','근원어의 발음은 혀가 아니라 숨으로 하는 것일세.']},
 student:{n:'마법원 학생 칼',role:'학생',room:[120,80],L:{body:'#2b3080',hair:'#a85a2a',hs:0,hat:5,hatC:'#252a70',prop:'staff'},walk:[[120,80],[60,110],[150,20]],spd:40,lines:['어젯밤에 눈썹을 태웠어…','오브 장치는 만지지 마세요!']},
 baker:{n:'제빵사 베네딕트',role:'제빵사',room:[-40,-70],L:{body:'#e8e2d2',apron:'#f4f0e8',hair:'#8a6a4a',hs:3,hat:8,prop:'bread'},lines:['백합 크림빵은 해 뜨기 전에 다 팔려요.']},
 // 전초 마을
 o_guard:{n:'전초 경비병',role:'경비병',L:{armor:1,body:'#8a8a92',legs:'#4a4a52',tabard:'#4a3a2a',hair:'#3a2a1a',hs:3,hat:4,prop:'spear'},lines:['이 너머로는 몬스터가 훨씬 강하다. 조심해.']},
 o_trader:{n:'떠돌이 상인',role:'상인',L:{body:'#6a4a2a',cape:'#4a3a2a',hair:'#2a1a10',hs:0,hat:1,hatC:'#a89060',prop:'basket'},lines:['멀리서 온 물건들이야. 구경하고 가.']},
};
// 지역 전초 마을의 분위기
const TWOUT={plains:{st:'gold',local:['밀밭 농부','#c8a040',1,'폭풍이 오기 전에 밀을 다 거둬야 해.'],props:['haystack','wheat','cart','wheat']},
  forest:{st:'elder',local:['숲지기','#3e5a2e',3,'고목은 천 년을 살아. 함부로 베지 마.'],props:['oak','fern','crate','mushroom']},
  desert:{st:'sahar',local:['물장수','#c8a070',6,'물 한 잔에 금화 한 닢. 사막에선 싼 거야.'],props:['palm','tent','kegs','sandrock']},
  ice:{st:'frost',local:['북방 사냥꾼','#6a5a4a',3,'장작은 아끼지 마. 얼어 죽는 것보다 낫지.'],props:['snowpine','crate','barrel','iceboulder']},
  jungle:{st:'tamal',local:['신전 수호자','#5a6a2e',6,'밤의 북소리는 신전이 깨어 있다는 뜻이야.'],props:['bigleaf','fern','kegs','templestone']},
  lava:{st:'ember',local:['흑요석 석공','#5a3a2a',2,'흑요석 성벽이 무너지면 우리도 끝이야.'],props:['obsidian','crate','barrel','lavarock']},
  sea:{st:'pearl',local:['진주잡이','#3a7a8a',6,'세이렌 노래가 들리면 귀를 막아.'],props:['palm','boat','nets','shell']}};
// v18 월드 확장: 새 전초 마을 다섯 곳의 모습 · 지역 마을 의뢰 사람들 (wx-base.js · wx-towns.js)
Object.assign(TWOUT,WX_TWOUT);Object.assign(TWPAL,WX_TWPAL);for(const id in WX_FOLK){const {town,at,...F}=WX_FOLK[id];TWFOLK[id]=F}

/* ---------- 배치 만들기 ---------- */
function twFolkObj(id,t,x,y,room){const F=TWFOLK[id];if(!F)return null;const L={...F.L,key:id};
  const d={k:'tfolk',id,n:F.n,role:F.role,L,x,y,hx:x,hy:y,town:t,lines:F.lines||[],li:0,shopk:F.shopk,room:room||null,face:hash(x|0,y|0)<.5?1:-1,walkT:0,moving:false,wi:0,wait:R()*2,spd:F.spd||48,say:null,sayT:0,v:0,s:1};
  if(F.walk)d.path=F.walk.map(p=>({x:t.x+p[0],y:t.y+p[1]}));
  TW.folk.push(d);return d}
function twBuildTown(L,t,lay,style){
  if(lay)lay=wxLayScale(t,lay);// v18: 붐비는 마을은 배치를 넓힌다 (wx-base.js)
  const keep=d=>d.k==='statue'||d.k==='facesign'||d.k==='edgeportal'||d.k==='cave'||d.k==='npc';
  // 옛 마을 장식(집 · 등 · 분수 · 첨탑 · 상점 · 짝문 · 창고 · 의뢰인)을 걷어내고 새로 세운다
  const old=L.decor.filter(d=>d.town===t||(Math.hypot(d.x-t.x,d.y-t.y)<420&&['lamp','fountain','spire','house','mill'].includes(d.k)));
  let keepH=null;
  for(const d of old){if(keep(d))continue;if(lay&&lay.blds[0]&&lay.blds[0].keep!=null&&d.k==='house'&&d.v===lay.blds[0].keep&&d.town===t){keepH=d;continue}
    const i=L.decor.indexOf(d);if(i>=0)L.decor.splice(i,1)}
  const add=d=>{L.decor.push(d);return d};
  const npcD=L.decor.find(d=>d.k==='npc'&&d.town===t);
  if(lay){t.gate={x:t.x+lay.gate[0],y:t.y+lay.gate[1]};t.stash={x:t.x+lay.stash[0],y:t.y+lay.stash[1]};
    if(lay.npc){t.npc={x:t.x+lay.npc[0],y:t.y+lay.npc[1]};if(npcD){npcD.x=t.npc.x;npcD.y=t.npc.y}}}
  if(!L.decor.some(d=>d.k==='statue'&&Math.hypot(d.x-t.x,d.y-t.y)<10))add({x:t.x,y:t.y,k:'fountain',s:1,v:0,light:190});
  add({x:t.gate.x,y:t.gate.y,k:'gate',s:1,v:0,town:t,light:140});add({x:t.stash.x,y:t.stash.y,k:'stash',s:1,v:0,town:t,light:110});
  const blds=TW.blds[L.id]||(TW.blds[L.id]=[]);
  // 상점 셋
  const shops=lay?lay.shops:[['general',110,-40,'잡화점'],['weapon',165,75,'무기상'],['armor',35,-150,'방어구상']];
  t.shops=shops.map(([type,dx,dy,n])=>({type,x:t.x+dx,y:t.y+dy,n}));t.shop={x:t.shops[0].x,y:t.shops[0].y};
  for(const sh of t.shops)add({x:sh.x,y:sh.y,k:'shop',tshop:1,shopType:sh.type,shopN:sh.n,s:1,v:0,town:t,light:120,st:style});
  if(lay){
    for(const o of lay.blds){let d;if(o.keep!=null&&keepH){const dx=keepH.x-t.x,dy=keepH.y-t.y;d=twMkBld(t,{...o,dx,dy});const i=L.decor.indexOf(keepH);if(i>=0)L.decor.splice(i,1)}else if(o.keep!=null)continue;else d=twMkBld(t,o);add(d);blds.push(d)}
    for(const p of lay.props){const [k,dx,dy,pv,fl]=p;const d=add({x:t.x+dx,y:t.y+dy,k,pv:pv|0,v:pv!=null?(pv*.37)%1:hash(dx,dy),fl:fl?1:0,s:k==='wheat'||k==='oak'?1:1,zl:0,tprop:!!TWP[k]});
      if(k==='lamp')d.light=150;if(k==='campfire')d.light=200;if(k==='lamp')d.v=0;
      if(k==='cwall'){const len=140;d.foot=[pv===1?[d.x-14,d.y-len/2,d.x+14,d.y+len/2]:[d.x-len/2,d.y-14,d.x+len/2,d.y+14]];blds.push(d)}
      if(k==='gatetower'||k==='well'||k==='wagon'||k==='statue2'||k==='tent'){const r=k==='gatetower'?22:k==='wagon'?30:k==='tent'?30:20;d.foot=[[d.x-r,d.y-r,d.x+r,d.y+r]];blds.push(d)}}
    for(const [id,dx,dy,room] of lay.folk){const d=twFolkObj(id,t,t.x+dx,t.y+dy,room);if(d&&!room)add(d)}
    if(lay.river){const r=lay.river;TW.water[L.id]=TW.water[L.id]||[];TW.water[L.id].push({x0:t.x+r.x0,x1:t.x+r.x1,y0:t.y+r.y0,y1:t.y+r.y1,docks:lay.docks.map(q=>[t.x+q[0],t.x+q[1],t.y+q[2],t.y+q[3]])})}
  }else{// 전초 마을: 남은 집들을 지역 양식으로
    const O=TWOUT[L.id]||{st:'bren',props:[]};
    for(const d of old){if(d.k!=='house'||L.decor.includes(d))continue;const dx=d.x-t.x,dy=d.y-t.y;
      if(t.shops.some(s=>Math.hypot(s.x-d.x,s.y-d.y)<110)||Math.hypot(t.gate.x-d.x,t.gate.y-d.y)<110)continue;
      const b=add(twMkBld(t,{st:O.st,dx,dy,W:92+((d.v*13)%3)*8,D:72,ridge:d.v%2?'y':'x',door:{face:dx<dy?'x':'y',f:.5},v:d.v,box:d.v%3===0,chim:O.st==='sahar'?1:undefined}));blds.push(b)}
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.2;add({x:t.x+Math.cos(a)*300,y:t.y+Math.sin(a)*300,k:'lamp',s:1,v:0,light:150})}
    O.props.forEach((k,i)=>{for(let j=0;j<2;j++){const a=i*1.3+j*2.9+.7,r=330+j*40;add({x:t.x+Math.cos(a)*r,y:t.y+Math.sin(a)*r,k,pv:j,v:(i*.31+j*.5)%1,s:1,zl:0,tprop:!!TWP[k]})}});
    const loc=O.local||['주민','#6a5a3a',0,'어서 오게.'];TWFOLK['o_local_'+L.id]={n:loc[0],role:loc[0],L:{body:loc[1],hair:'#3a2a1a',hs:3,hat:loc[2],hatC:Kit.lit(loc[1],-.2),prop:'staff',gem:'#c8a060'},lines:[loc[3]]};
    for(const [id,dx,dy] of [['o_guard',-150,60],['o_trader',140,40],['o_local_'+L.id,-40,-140]]){const d=twFolkObj(id,t,t.x+dx,t.y+dy);if(d)add(d)}
    wxPlaceFolk(t,add,blds)}
  L.lights.length=0;for(const d of L.decor)if(d.light)L.lights.push(d);
}
for(const t of HOME.towns)twBuildTown(HOME,t,TWLAY[t.id],{brenhill:'bren',willowen:'will',haven:'haven',arden:'arden'}[t.id]);
for(const id of REG_IDS){const L=RCACHE[id];if(L&&L.town)twBuildTown(L,L.town,TWLAY[L.town.id]||null,TWLAY[L.town.id]?L.town.id:(TWOUT[id]||{}).st)}// v26: 왕도(아르덴)는 배치표대로
// 새 장식과 겹치는 나무 · 바위를 치운다
for(const L of [HOME,...REG_IDS.map(twL)]){if(!L)continue;const B=TW.blds[L.id]||[],Wt=TW.water[L.id]||[];
  for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(d.town||d.tprop||d.k==='bld'||d.k==='tfolk'||d.k==='lamp'||d.k==='wheat'||d.k==='haystack'||d.k==='oak')continue;
    if(B.some(b=>b.foot&&b.foot.some(f=>d.x>f[0]-40&&d.x<f[2]+40&&d.y>f[1]-40&&d.y<f[3]+40))||Wt.some(w=>d.x>w.x0&&d.x<w.x1&&d.y>w.y0-20&&d.y<w.y1+20)){if(['tree','rock','bush','stump','ruin','tomb'].includes(d.k)||RD.D&&RD.D[d.k]&&!d.label)L.decor.splice(i,1)}}}
// v18: 마을 사람 자리 다듬기 (겹침 · 건물 · 소품 · 문에서 떼어 놓기, wx-base.js)
{const t0=performance.now();for(const [L,t] of wxTowns())wxTownRelax(L,t);WXT.ms=performance.now()-t0}
if(REG.id==='home'||RCACHE[REG.id]){const L=twL(REG.id);setArr(decor,L.decor);setArr(LIGHTS,L.lights)}

/* ---------- 바닥에 까는 것: 강 · 나루 · 포장 광장 · 밭 (월드 좌표로 그린 그림을 쿼터뷰 변환으로 붙인다) ---------- */
function twFlatRiver(w){const W0=w.x1-w.x0,H0=w.y1-w.y0,k=1;const cv=document.createElement('canvas');cv.width=W0*k;cv.height=(H0+60)*k;const g=cv.getContext('2d');g.scale(k,k);g.translate(0,30);const s=mulberry(91);
  // 물가 진흙 → 물 (끝은 부드럽게 사라진다)
  const grd=g.createLinearGradient(0,-30,0,H0+30);grd.addColorStop(0,'rgba(74,66,48,0)');grd.addColorStop(.12,'rgba(74,66,48,.9)');grd.addColorStop(.2,'#2a4a5a');grd.addColorStop(.5,'#1e3c50');grd.addColorStop(.8,'#2a4a5a');grd.addColorStop(.88,'rgba(74,66,48,.9)');grd.addColorStop(1,'rgba(74,66,48,0)');
  g.fillStyle=grd;g.fillRect(0,-30,W0,H0+60);
  g.globalCompositeOperation='destination-in';const ge=g.createLinearGradient(0,0,W0,0);ge.addColorStop(0,'rgba(0,0,0,0)');ge.addColorStop(.12,'#000');ge.addColorStop(.88,'#000');ge.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=ge;g.fillRect(0,-30,W0,H0+60);g.globalCompositeOperation='source-over';
  for(let i=0;i<220;i++){const x=s()*W0,y=H0*.15+s()*H0*.7;g.strokeStyle=`rgba(${s()<.5?'160,210,230':'20,40,60'},${.08+s()*.12})`;g.lineWidth=.8+s()*1.5;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+8,y-1.5,x+16+s()*20,y);g.stroke()}
  for(let i=0;i<60;i++){const x=s()*W0,top=s()<.5,y=top?H0*.1+s()*12:H0*.9-s()*12;g.fillStyle=`rgba(${60+s()*30|0},${90+s()*30|0},${40},${.6})`;g.beginPath();g.ellipse(x,y,2+s()*4,1+s()*2,0,0,6.283);g.fill()}
  // 나루 널판
  for(const q of w.docks){const x0=q[0]-w.x0,x1=q[1]-w.x0,y0=q[2]-w.y0,y1=q[3]-w.y0;g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x0+3,y0+3,x1-x0,y1-y0);
    for(let y=y0;y<y1;y+=7){g.fillStyle=Kit.lit('#7a5a3a',(s()-.5)*.25);g.fillRect(x0,y,x1-x0,6);g.fillStyle='rgba(30,20,10,.5)';g.fillRect(x0,y+6,x1-x0,1);g.fillStyle='rgba(255,230,190,.12)';g.fillRect(x0,y,x1-x0,1)}
    g.fillStyle='#4a3220';g.fillRect(x0-2,y0,3,y1-y0);g.fillRect(x1-1,y0,3,y1-y0)}
  return{cv,x:w.x0,y:w.y0-30,w:W0,h:H0+60}}
function twFlatDisc(t,r,col,kind){const S=r*2+20,cv=document.createElement('canvas');cv.width=cv.height=S;const g=cv.getContext('2d'),s=mulberry(t.x|0),c=S/2;
  g.save();g.beginPath();g.arc(c,c,r,0,6.283);g.clip();
  if(kind==='flag'){for(let ring=0;ring<r;ring+=14){const n=Math.max(6,Math.round(ring*6.283/18));for(let i=0;i<n;i++){const a0=i/n*6.283,a1=(i+1)/n*6.283;g.fillStyle=Kit.lit(col,(s()-.5)*.18);g.beginPath();g.arc(c,c,ring+13,a0,a1);g.arc(c,c,ring,a1,a0,true);g.closePath();g.fill();g.strokeStyle='rgba(60,56,48,.35)';g.lineWidth=1;g.stroke()}}}
  else{g.fillStyle=col;g.fillRect(0,0,S,S);for(let i=0;i<S*S/40;i++){g.fillStyle=`rgba(${s()<.5?'40,30,20':'200,180,140'},${.08})`;g.fillRect(s()*S,s()*S,2,2)}}
  g.restore();const gr=g.createRadialGradient(c,c,r*.85,c,c,r+6);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(30,24,16,.35)');g.fillStyle=gr;g.beginPath();g.arc(c,c,r+6,0,6.283);g.fill();
  return{cv,x:t.x-S/2,y:t.y-S/2,w:S,h:S}}
function twFlatField(x,y,w,h){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d'),s=mulberry((x|0)+(y|0));
  g.fillStyle='#4a3a26';g.fillRect(0,0,w,h);for(let yy=4;yy<h;yy+=10){g.fillStyle='#3a2c1c';g.fillRect(0,yy,w,3);for(let xx=6;xx<w;xx+=9){g.fillStyle=`rgba(${70+s()*30|0},${110+s()*30|0},${50},.9)`;g.beginPath();g.ellipse(xx+s()*3,yy-1,2.4,2,0,0,6.283);g.fill()}}
  g.strokeStyle='rgba(20,14,8,.5)';g.lineWidth=2;g.strokeRect(1,1,w-2,h-2);return{cv,x,y,w,h}}
function twFlats(id){if(TW.flats[id])return TW.flats[id];const out=[];
  for(const w of TW.water[id]||[])out.push(twFlatRiver(w));
  if(id==='royal'){const A=RCACHE.royal&&RCACHE.royal.town;if(A)out.push(twFlatDisc(A,250,'#c8c2b4','flag'))}// v26: 왕도 광장
  if(id==='home'){const H=HOME.towns.find(t=>t.id==='haven'),B=HOME.towns.find(t=>t.id==='brenhill');
    const kh=wxTk(H),kb=wxTk(B);// v18: 넓힌 마을에 맞춘다
    out.push(twFlatDisc({x:H.x+290*kh,y:H.y+180*kh},Math.round(150*kh),'#7a6448','dirt'));
    out.push(twFlatField(B.x+150*kb,B.y-300*kb,110,70));out.push(twFlatField(B.x-470*kb,B.y+60*kb,80,90));}
  return TW.flats[id]=out}
{const _ddf=drawDecalsFields;drawDecalsFields=function(){if(!IN&&!DG){for(const f of twFlats(REG.id)){const s=W2S(f.x+f.w/2,f.y+f.h/2);if(!onScreen(s,Math.max(f.w,f.h)))continue;ctx.drawImage(f.cv,f.x,f.y,f.w,f.h)}
    // 물결 반짝임
    for(const w of TW.water[REG.id]||[]){const sp=W2S((w.x0+w.x1)/2,(w.y0+w.y1)/2);if(!onScreen(sp,900))continue;ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(170,220,240,.18)';ctx.lineWidth=2;
      for(let i=0;i<14;i++){const u=((time*18+i*97)%(w.x1-w.x0)),v=w.y0+30+((i*53)%(w.y1-w.y0-60));ctx.globalAlpha=.4+.4*Math.sin(time*2+i);ctx.beginPath();ctx.moveTo(w.x0+u,v);ctx.lineTo(w.x0+u+24,v);ctx.stroke()}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}
  _ddf()}}

/* ---------- 그리기: 건물 · 소품 · 마을 사람 · 상점 노점 ---------- */
// 상점 노점: 무기(지팡이 걸이 · 칼 통 · 방패), 방어구(걸린 로브 · 투구), 잡화(유리 물약 · 사과 상자 · 두루마리). 모두 구워 둔다
// [v22] 주름진 천 차양(가운데가 처지고 줄마다 불룩) · 물결 단 · 앞치마 천 · 널빤지 판매대
function twStall(type,st){const key='stall/'+type+'/'+st;return SC.get(key,120,110,60,86,g=>twBake(g,120,110,60,86,g=>{
  const s=mulberry(type.length*97+st.length*13),M=TWPAL[st]||TWPAL.bren,aw=type==='weapon'?['#2a3a6a','#c8c0b0']:type==='armor'?['#2e5a32','#d8d0b0']:['#8a2a22','#d8d0c0'],wd='#4a3220';void M;
  Kit.shadow(g,10,4,48,13,.9);
  for(const [x,y] of [[-30,-14],[30,-14]])twBoxR(g,x,y,0,3,3,44,wd,'vplank',s,{pw:1.5,ao:5});
  twBoxR(g,0,8,0,60,14,16,'#6a4628','plank',s,{pw:4,nails:1});twBoxR(g,0,8,16,64,16,2,'#8a6038','plank',s,{pw:4,ao:0});
  // 판매대 앞 천: 차양과 같은 색, 아래가 물결
  twFace(g,[-30,15.1,0],[1,0,0],[0,0,1],()=>{const c=aw[0];g.beginPath();g.moveTo(0,15.5);g.lineTo(60,15.5);g.lineTo(60,7);for(let i=6;i>0;i--){const u=i*10;g.quadraticCurveTo(u-5,2.6,u-10,7)}g.closePath();
    const gr=g.createLinearGradient(0,16,0,3);gr.addColorStop(0,Kit.lit(c,.1));gr.addColorStop(1,Kit.lit(c,-.28));g.fillStyle=gr;g.fill();
    g.save();g.clip();g.globalAlpha=.4;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'cloth');g.fillRect(0,0,60,16);g.restore();
    for(let i=1;i<6;i++){mFold(g,[[i*10,15],[i*10+1,10,i*10,4]],c,.9)}g.fillStyle=aw[1];g.fillRect(0,13,60,1.4);g.fillStyle='rgba(255,240,200,.3)';g.fillRect(0,14.4,60,.6)});
  // 차양: 뒤(높음) → 앞(낮음), 가운데가 살짝 처지고 줄마다 불룩
  const N=8,Pp=(u,w)=>isoP(-34+68*u,-18+40*w,46-10*w-2.6*Math.sin(Math.PI*w)*(1-.5*Math.abs(u-.5)*2)),SEG=6;
  for(let i=0;i<N;i++){const c=aw[i%2],u0=i/N,u1=(i+1)/N,pts=[];for(let k=0;k<=SEG;k++)pts.push(Pp(u0,k/SEG));for(let k=SEG;k>=0;k--)pts.push(Pp(u1,k/SEG));
    const a=Pp(u0,.5),b=Pp(u1,.5),gr=g.createLinearGradient(a.x,a.y,b.x,b.y);gr.addColorStop(0,Kit.lit(c,-.12));gr.addColorStop(.4,Kit.lit(c,.12));gr.addColorStop(1,Kit.lit(c,-.2));g.fillStyle=gr;twPoly(g,pts);g.fill();
    const f=Pp(u0,0),bk=Pp(u0,1),gr2=g.createLinearGradient(f.x,f.y,bk.x,bk.y);gr2.addColorStop(0,'rgba(20,10,20,.18)');gr2.addColorStop(.5,'rgba(255,240,210,.06)');gr2.addColorStop(1,'rgba(20,10,20,.14)');g.fillStyle=gr2;twPoly(g,pts);g.fill();
    g.save();twPoly(g,pts);g.clip();g.globalAlpha=.4;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'cloth');g.fillRect(-60,-80,120,80);g.restore();
    if(i){const q=[];for(let k=0;k<=SEG;k++){const p=Pp(u0,k/SEG);q.push([p.x,p.y])}mFold(g,q,c,.7)}}
  // 앞 물결 단 + 금색 테
  for(let i=0;i<N;i++){const c=aw[i%2],p=Pp(i/N,1),q=Pp((i+1)/N,1),m={x:(p.x+q.x)/2,y:(p.y+q.y)/2};g.fillStyle=Kit.lit(c,-.1);g.beginPath();g.moveTo(p.x,p.y-.5);g.lineTo(q.x,q.y-.5);g.quadraticCurveTo(m.x+1,m.y+6,p.x,p.y-.5);g.fill();
    g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.moveTo(m.x,m.y+3);g.quadraticCurveTo(m.x+2.5,m.y+3.5,q.x,q.y);g.quadraticCurveTo(m.x+1,m.y+5.4,m.x,m.y+2.4);g.fill()}
  {g.strokeStyle='#c8a050';g.lineWidth=1;g.beginPath();for(let k=0;k<=16;k++){const p=Pp(k/16,1);k?g.lineTo(p.x,p.y+1):g.moveTo(p.x,p.y+1)}g.stroke()}
  // 오른쪽 옆 단 (그늘)
  for(let k=0;k<4;k++){const p=Pp(1,k/4),q=Pp(1,(k+1)/4),c=aw[k%2];g.fillStyle=Kit.lit(c,-.45);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.quadraticCurveTo((p.x+q.x)/2+1,(p.y+q.y)/2+7,p.x,p.y);g.fill()}
  {const p=Pp(0,0),q=Pp(0,1);g.strokeStyle='rgba(255,240,214,.5)';g.lineWidth=1;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}
  for(const [x,y] of [[-30,14],[30,14]])twBoxR(g,x,y,0,3,3,40,wd,'vplank',s,{pw:1.5,ao:5});
  // 물건 (차양 위에 그려 잘 보이게: 예전과 같은 순서)
  if(type==='weapon'){for(let i=0;i<5;i++){const p=isoP(-22+i*10,10,18),gc=['#ff7a2e','#8fd8ff','#ffe066','#b9a2ff','#9fe39a'][i];twRod(g,{x:p.x,y:p.y},{x:p.x,y:p.y-26},1.8,'#5a3a1e');
      g.strokeStyle='#c8a050';g.lineWidth=.8;g.beginPath();g.moveTo(p.x-2,p.y-25);g.quadraticCurveTo(p.x,p.y-31,p.x+2,p.y-25);g.stroke();
      const gr=g.createRadialGradient(p.x-1,p.y-29.2,0,p.x,p.y-28,3.4);gr.addColorStop(0,'#fff');gr.addColorStop(.35,gc);gr.addColorStop(1,Kit.lit(gc,-.5));g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y-28,3,0,6.283);g.fill()}
    const b=twCylR(g,24,2,18,4.2,7,'#6a4628','stave',s,{n:5,bands:[.2,.8],bandW:.9,top:'#2a1a10'});for(let i=0;i<3;i++){const x=b.t.x-2.4+i*2.4,len=13+i*2;g.fillStyle='#d8dce4';g.beginPath();g.moveTo(x-.9,b.t.y);g.lineTo(x-.9,b.t.y-len);g.lineTo(x,b.t.y-len-2);g.lineTo(x+.9,b.t.y-len);g.lineTo(x+.9,b.t.y);g.closePath();g.fill();g.fillStyle='#8a8a96';g.fillRect(x,b.t.y-len,.9,len);g.fillStyle='#c8a050';g.fillRect(x-2.2,b.t.y-1,4.4,1.3)}
    const sp=isoP(-20,16,4);const sh=q=>q.ellipse(sp.x,sp.y-6,6.4,7.6,0,0,6.283);Kit.solid(g,sh,sp.x-6.4,sp.y-13.6,sp.x+6.4,sp.y+1.6,'#7a2a22',{tex:'wood',texA:.5,rim:'rgba(255,220,190,.7)',lineW:.6});
    g.strokeStyle='#8a8478';g.lineWidth=1.2;g.beginPath();g.ellipse(sp.x,sp.y-6,6.4,7.6,0,0,6.283);g.stroke();Kit.solid(g,q=>q.arc(sp.x,sp.y-6,2,0,6.283),sp.x-2,sp.y-8,sp.x+2,sp.y-4,'#b8b8c0',{rim:'rgba(255,255,255,.9)',lineW:.5})}
  else if(type==='armor'){const a=isoP(-30,-14,40),b=isoP(30,-14,40);twRod(g,a,b,1.8,'#3a2a1a');
    for(const [x,c] of [[-18,'#7a2a3a'],[0,'#2a4a7a'],[18,'#4a5a3a']]){const p=isoP(x,-14,40),rb=q=>{q.moveTo(p.x-4,p.y);q.lineTo(p.x+4,p.y);q.quadraticCurveTo(p.x+6,p.y+12,p.x+7.5,p.y+23);q.lineTo(p.x-7.5,p.y+23);q.quadraticCurveTo(p.x-6,p.y+12,p.x-4,p.y);q.closePath()};
      Kit.solid(g,rb,p.x-7.5,p.y,p.x+7.5,p.y+23,c,{tex:'cloth',texA:.55,rim:'rgba(255,230,200,.6)',lineW:.6});mForm(g,rb,p.x-7.5,p.y,p.x+7.5,p.y+23,.9);
      mFold(g,[[p.x-1.5,p.y+3],[p.x-2.6,p.y+13,p.x-3.6,p.y+22]],c,.9);mFold(g,[[p.x+2,p.y+4],[p.x+3,p.y+14,p.x+3.4,p.y+22]],c,.8);g.fillStyle='#c8a050';g.fillRect(p.x-7.5,p.y+21.4,15,1.2);
      g.strokeStyle='#2e2a28';g.lineWidth=.9;g.beginPath();g.arc(p.x,p.y-1,1.8,Math.PI,0);g.stroke()}
    const hp=isoP(10,8,18);const hm=q=>{q.moveTo(hp.x-7,hp.y);q.quadraticCurveTo(hp.x-7,hp.y-10,hp.x,hp.y-10.5);q.quadraticCurveTo(hp.x+7,hp.y-10,hp.x+7,hp.y);q.closePath()};Kit.solid(g,hm,hp.x-7,hp.y-10.5,hp.x+7,hp.y,'#9a9aa6',{tex:'metal',texA:.6,rim:'rgba(240,244,255,.95)',lineW:.6});
    g.fillStyle='#2a2830';g.fillRect(hp.x-5,hp.y-5,10,1.6);g.fillRect(hp.x-.7,hp.y-5,1.4,4.4);g.fillStyle='#c84a3a';g.beginPath();g.moveTo(hp.x,hp.y-10.5);g.quadraticCurveTo(hp.x+5,hp.y-15,hp.x+9,hp.y-11);g.quadraticCurveTo(hp.x+4,hp.y-12,hp.x,hp.y-10.5);g.fill();
    const bp=isoP(-14,9,18);for(const dx of [0,4.6]){Kit.solid(g,q=>{q.moveTo(bp.x+dx-1.6,bp.y-8);q.lineTo(bp.x+dx+1.6,bp.y-8);q.lineTo(bp.x+dx+1.8,bp.y-2);q.lineTo(bp.x+dx+4.2,bp.y-1.4);q.lineTo(bp.x+dx+4.2,bp.y);q.lineTo(bp.x+dx-1.8,bp.y);q.closePath()},bp.x+dx-1.8,bp.y-8,bp.x+dx+4.2,bp.y,'#6a4a2a',{tex:'leather',texA:.5,lineW:.5})}}
  else{const sh=isoP(0,-6,30),sh2=isoP(0,-6,18);
    for(let i=0;i<6;i++){const p=isoP(-24+i*9,8,18),c=['#e0443a','#4a7af0','#e0443a','#4a7af0','#e8c35a','#9fe39a'][i],bt=q=>{q.moveTo(p.x-1.2,p.y-8.6);q.lineTo(p.x+1.2,p.y-8.6);q.lineTo(p.x+1.2,p.y-6.8);q.bezierCurveTo(p.x+4.6,p.y-6,p.x+4.6,p.y,p.x,p.y);q.bezierCurveTo(p.x-4.6,p.y,p.x-4.6,p.y-6,p.x-1.2,p.y-6.8);q.closePath()};
      Kit.solid(g,bt,p.x-4,p.y-9,p.x+4,p.y,c,{rim:'rgba(255,255,255,.95)',lineW:.5});g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.ellipse(p.x-1.4,p.y-3.6,.8,1.6,.3,0,6.283);g.fill();g.fillStyle='#a8784a';g.fillRect(p.x-1,p.y-10.4,2,2)}
    void sh;void sh2;
    const cr=twBoxR(g,20,10,18,10,8,6,'#9a7a4a','vplank',s,{pw:2.5,ao:0,topC:'#3a2a1a'});const t=isoP(20,10,24);for(let i=0;i<6;i++){const x=t.x-5+(i%3)*4+(i>2?2:0),y=t.y-1-(i>2?2.4:0),gr=g.createRadialGradient(x-.8,y-.9,0,x,y,2.6);gr.addColorStop(0,'#ffb8a0');gr.addColorStop(.5,'#c83a2a');gr.addColorStop(1,'#6a1a10');g.fillStyle=gr;g.beginPath();g.arc(x,y,2.3,0,6.283);g.fill()}void cr;
    const sc=isoP(-8,-2,18);for(let i=0;i<2;i++){const x=sc.x+i*5,y=sc.y-i*1.5;Kit.solid(g,q=>q.rect(x-6,y-3,12,3.2),x-6,y-3,x+6,y+.2,'#e8dcc0',{lineW:.5});g.fillStyle='#c84a3a';g.fillRect(x-.6,y-3,1.2,3.2)}}
  // 간판
  g.font=`700 11px ${DISPLAY}`;const lb=SHOPN[type]||'상점',tw2=g.measureText(lb).width+12;g.strokeStyle='#2a2018';g.lineWidth=1;g.beginPath();g.moveTo(-tw2/2+4,-65);g.lineTo(-tw2/2+6,-58);g.moveTo(tw2/2-4,-65);g.lineTo(tw2/2-6,-58);g.stroke();
  Kit.solid(g,q=>{q.roundRect?q.roundRect(-tw2/2,-80,tw2,15,3):q.rect(-tw2/2,-80,tw2,15)},-tw2/2,-80,tw2/2,-65,'#5a3a22',{tex:'wood',texA:.5,rim:'rgba(255,230,180,.6)'});
  g.strokeStyle='rgba(200,160,80,.6)';g.lineWidth=.6;g.strokeRect(-tw2/2+1.5,-78.5,tw2-3,12);
  g.fillStyle='#ffe6a8';g.textAlign='center';g.textBaseline='middle';g.fillText(lb,0,-72.4)},{ao:6}),{scale:Math.max(1.25,DPR)})}
function twDrawBld(d){const s=d._s,e=twBldSprite(d.b);if(!e){drawHouse({...d,town:d.town,v:d.b.v,x:d.x,y:d.y});return}
  // 플레이어를 가리면 반투명
  let a=1;if(!P.dead&&P._s){const ps=P._s,front=P.x>d.foot[0][2]||P.y>d.foot[0][3];if(!front&&dist(P,d)<380){const x0=d.flip?s.x-(e.w-e.ax):s.x-e.ax,x1=x0+e.w;if(ps.x>x0+12&&ps.x<x1-30&&ps.y>s.y-e.ay+10&&ps.y<s.y+18)a=.42}}
  ctx.globalAlpha=a;
  if(d.flip){ctx.save();ctx.translate(s.x,s.y);ctx.scale(-1,1);ctx.drawImage(e.cv,-e.ax,-e.ay,e.w,e.h);ctx.restore()}else SC.draw(ctx,e,s.x,s.y);
  const fx=d.flip?-1:1;
  if(d.mill){const b=d.b,rh=b.rh||Math.min(48,b.d*.5),hub=isoP(b.w/2+6,0,b.h+rh*.42),bl=twBlade();ctx.save();ctx.translate(s.x+hub.x*fx,s.y+hub.y);ctx.scale(fx*.55,1);ctx.rotate(time*.7);ctx.drawImage(bl.cv,-60,-60,120,120);ctx.restore()}
  if(e.smoke&&!reduceMotion){const pf=twPuff();for(let i=0;i<4;i++){const k=((time*.35+i/4)%1);ctx.globalAlpha=a*(1-k)*.55;const r=6+k*16;ctx.drawImage(pf.cv,s.x+fx*e.smoke[0]+k*14-r,s.y+e.smoke[1]-k*46-r,r*2,r*2)}}
  ctx.globalAlpha=a;
  if(e.flag){const [fx0,fy0,c]=e.flag,w=Math.sin(time*3+d.x)*2;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(s.x+fx*fx0,s.y+fy0);ctx.lineTo(s.x+fx*(fx0+14),s.y+fy0+3+w);ctx.lineTo(s.x+fx*fx0,s.y+fy0+8);ctx.closePath();ctx.fill()}
  if(d.signT&&e.sign){const sg=twSign(d.signT,d.signC);if(sg)SC.draw(ctx,sg,s.x+fx*e.sign[0],s.y+e.sign[1]+14)}
  ctx.globalAlpha=1;
  if(TW.vis!==frameN){TW.vis=frameN;TW.visB.length=0}TW.visB.push(d);
  // 문 표시: 들어갈 수 있는 건물이면 문 앞 이름
  if(d.enter&&dist(P,d.door)<130){const p=W2S(d.door.x,d.door.y);ctx.font=`600 12px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const t=`${d.label} · 들어가기`;ctx.strokeText(t,p.x,p.y-48);ctx.fillStyle='#ffe6a8';ctx.fillText(t,p.x,p.y-48)}}
function twDrawProp(d){const e=twProp(d);if(!e)return;const s=d._s;let y=s.y;if(d.k==='boat')y+=Math.sin(time*1.6+d.x)*1.6;
  if(d.k==='sheep'&&!reduceMotion)y-=Math.max(0,Math.sin(time*2+d.x))*.8;
  if(d.fl){ctx.save();ctx.translate(s.x,y);ctx.scale(-1,1);ctx.drawImage(e.cv,-e.ax,-e.ay,e.w,e.h);ctx.restore()}else SC.draw(ctx,e,s.x,y);
  if(d.k==='campfire'||d.k==='hearth'){const f=Math.floor(time*12+d.x*.1)%4,yo=d.k==='hearth'?-12:-4,xo=d.k==='hearth'?(d.fl?14:-14)+3:0;ctx.globalAlpha=.95;ctx.drawImage(flameCv('#ff9a40',f),s.x+xo-12,s.y+yo-36,24,40);ctx.globalAlpha=1}
  if(d.k==='candle'||d.k==='altar'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6+.15*Math.sin(time*9+d.x);for(const ox of d.k==='candle'?[-4,0,4]:[-10.5,10.5])glow(s.x+ox,s.y-(d.k==='candle'?50:29)-(d.k==='altar'?Math.abs(ox)*0:0),6,'#ffcf7a');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  if(d.k==='cauldron'&&!reduceMotion){for(let i=0;i<3;i++){const k=(time*.6+i/3)%1;ctx.globalAlpha=(1-k)*.5;ctx.fillStyle='#8aff9a';circ(s.x+Math.sin(time*2+i)*4,s.y-20-k*26,2+k*3)}ctx.globalAlpha=1}
  if(d.use){const on=sqUseLive(d);if(on){const p=on.col||'#ffd34d';ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+.2*Math.sin(time*4);glow(s.x,s.y-12,26,p);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(dist(P,d)<260){ctx.font=`600 12px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(on.label,s.x,s.y-(e.ay+6));ctx.fillStyle=p;ctx.fillText(on.label,s.x,s.y-(e.ay+6))}}}}
// 서 있을 때: 숨쉬기 (0 → 3 들이쉼 → 0 → 4 내쉬며 살짝 기울임). 사람마다 박자가 다르다. 아직 안 구운 그림이면 서기 그림으로
function twDrawFolk(d){const s=d._s,f=d.moving?[1,0,2,0][Math.floor(d.walkT*7)%4]:reduceMotion?0:[0,3,0,4][Math.floor(time*1.5+(d.x*.37+d.y*.11)%4)&3],e=twFolkSprite(d.L,f)||(f>2?twFolkSprite(d.L,0):null);if(!e)return;
  const bob=d.moving?-Math.abs(Math.sin(d.walkT*14))*1.2:0;
  if(d.face<0){ctx.save();ctx.translate(s.x,s.y+bob);ctx.scale(-1,1);ctx.drawImage(e.cv,-e.ax,-e.ay,e.w,e.h);ctx.restore()}else SC.draw(ctx,e,s.x,s.y+bob);
  const top=s.y-(d.L.child?52:72),near=dist(P,d)<140,mk=typeof sqMark==='function'?sqMark(d):'';
  if(near||mk||(d.say&&time<d.sayT))QLBL.push({x:s.x,y:top,n:near||mk?d.n:'',mk,c:d.shopk?'#ffd27a':mk?'#ffe6a8':'#e8e2d2',say:d.say&&time<d.sayT?d.say:'',sa:clamp((d.sayT-time)*2,0,1),ph:d.x})}
// 이름표 그리기: 모든 그림 뒤에 한 번에 (가까운 순으로, 겹치면 이름은 건너뛰고 ! ? 는 늘 그린다)
function twLabels(){if(!QLBL.length)return;S();const ps=W2S(P.x,P.y),L=QLBL.sort((a,b)=>Math.hypot(a.x-ps.x,a.y-ps.y)-Math.hypot(b.x-ps.x,b.y-ps.y)),put=[];ctx.textAlign='center';
  for(const l of L){if(l.n){const w=l.n.length*11+6;if(!put.some(o=>Math.abs(o.x-l.x)<(o.w+w)/2&&Math.abs(o.y-l.y)<14)){put.push({x:l.x,y:l.y,w});ctx.font=`600 ${l.big?12:11}px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(l.n,l.x,l.y);ctx.fillStyle=l.c;ctx.fillText(l.n,l.x,l.y)}}
    if(l.mk){const y=l.y-(l.big?22:20)+Math.sin(time*3+(l.ph||0))*3;wxMarkBadge(l,y);ctx.font=`800 ${l.big?26:24}px ${DISPLAY}`;ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(l.mk,l.x,y);ctx.fillStyle=wxMarkCol(l);ctx.fillText(l.mk,l.x,y)}
    if(l.say)twBubble(l.x,l.y-(l.mk?40:14),l.say,l.sa)}
  QLBL.length=0}
function twBubble(x,y,t,a){ctx.font=`13px ${FONT}`;const lines=[];let cur='';for(const w of t.split(' ')){const n=cur?cur+' '+w:w;if(ctx.measureText(n).width>220&&cur){lines.push(cur);cur=w}else cur=n}lines.push(cur);
  const w=Math.min(240,Math.max(...lines.map(l=>ctx.measureText(l).width))+18),h=lines.length*17+10;ctx.globalAlpha=a;
  ctx.fillStyle='rgba(20,16,12,.88)';ctx.strokeStyle='#8a7346';ctx.lineWidth=1.2;ctx.beginPath();ctx.roundRect?ctx.roundRect(x-w/2,y-h,w,h,6):ctx.rect(x-w/2,y-h,w,h);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x,y+7);ctx.lineTo(x+6,y);ctx.fill();ctx.fillStyle='#f0e6cc';ctx.textAlign='center';ctx.textBaseline='alphabetic';lines.forEach((l,i)=>ctx.fillText(l,x,y-h+19+i*17));ctx.globalAlpha=1}
{const _rd=drawRegionDecor;drawRegionDecor=function(d){
  if(d.k==='bld'){twDrawBld(d);return true}
  if(d.k==='tfolk'){twDrawFolk(d);return true}
  if(d.k==='shop'&&d.tshop){const e=twStall(d.shopType,d.st||'bren');if(e)SC.draw(ctx,e,d._s.x,d._s.y);return true}
  if(d.tprop||TWP[d.k]){twDrawProp(d);return true}
  return _rd(d)}}
// 창문 불빛: 어둠 위에 덧그린다 (구운 빛 한 장씩)
{const _g=drawV5Glow;drawV5Glow=function(){_g();if(TW.vis!==frameN||IN)return;S();ctx.globalCompositeOperation='lighter';
  for(const d of TW.visB){const e=SC.map.get(twBldKey(d));if(!e||!e.win)continue;const s=d._s,fx=d.flip?-1:1;ctx.globalAlpha=.42;for(const w of e.win)glow(s.x+fx*w.x,s.y+w.y,11,'rgba(255,180,90,.9)')}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}
const twBldKey=d=>d._k||(d._k=(()=>{const b=d.b;return `bld/${b.st}/${b.w}x${b.d}x${b.h}/${b.rh||0}/${b.v|0}/${b.door?b.door.face+b.door.f:''}/${b.extra||''}/${b.seed||0}/${b.chim===0?0:1}${b.tall?'t':''}${b.big?'b':''}`})());

/* ---------- 실내: 마을 한가운데 좌표에 작은 방을 펼친다 (몬스터는 안전 지대 밖이라 들어오지 못한다) ---------- */
// 방 안 물건: [종류, x, y, 변형, 반전, 쓰임]. 좌표는 방 한가운데 기준. 앞쪽 벽(y=+h/2)에 나가는 문
const TWROOM={
 bren_chapel:{n:'브렌힐 예배당',w:380,h:260,floor:'stone',wall:'#b8ae98',wallK:'stone',ex:90,deco:'chapel',
  items:[['altar',-150,0],['candle',-160,-80],['candle',-160,80],['lectern',-105,45],['bellrope',-120,-105,0,0,'bell'],['pew',-50,-55,0,1],['pew',-50,55,0,1],['pew',20,-55,0,1],['pew',20,55,0,1],['pew',90,-55,0,1],['pew',90,55,0,1],['candle',150,-110],['flowerbed',-175,-30,1,1]]},
 bren_home:{n:'방앗간지기네 집',w:330,h:250,floor:'wood',wall:'#d9c9a2',wallK:'plaster',ex:-70,deco:'home',
  items:[['hearth',-30,-112],['table',30,10],['stool',-5,30],['stool',60,-10],['stool',40,45],['bed',120,-80,0],['shelf',-140,-110],['sacks',-140,80],['barrel',-150,30],['crate',140,80,2],['kegs',150,20]]},
 bren_smithy:{n:'대장간',w:300,h:230,floor:'stone',wall:'#7a6e62',wallK:'stone',ex:60,deco:'smithy',
  items:[['anvil',0,-20],['rack',-90,-100],['rack',30,-100,1],['barrel',100,-60],['crate',-120,60],['crate',-105,80,1],['mannequin',110,50]]},
 will_tavern:{n:'나루 주점',w:400,h:290,floor:'wood',wall:'#8a6c4e',wallK:'plank',ex:120,deco:'tavern',
  items:[['counter',-60,-118],['kegs',-170,-115],['hearth',-182,30,0,1],['table',60,30,0],['table',150,-50,1],['table',-60,70,0],['stool',30,60],['stool',90,0],['stool',120,-80],['stool',180,-20],['stool',-90,100],['stool',-30,100],['barrel',170,110],['nets',100,-130]]},
 will_home:{n:'뱃사공네 오두막',w:290,h:220,floor:'wood',wall:'#8a6c4e',wallK:'plank',ex:40,deco:'home',
  items:[['hearth',-30,-97],['table',10,30,1],['stool',-20,50],['stool',40,0],['bed',100,-60,1],['nets',-110,-90],['shelf',-125,60,0,1],['barrel',110,70]]},
 haven_inn:{n:'황금 마차 여관',w:460,h:320,floor:'wood',wall:'#cdb48e',wallK:'plaster',ex:150,deco:'tavern',
  items:[['counter',-90,-133],['kegs',-205,-130],['hearth',-212,60,0,1],['table',40,-30,0],['table',150,40,1],['table',-60,90,0],['table',140,-110,1],['stool',10,0],['stool',70,-60],['stool',120,70],['stool',180,10],['stool',-90,120],['stool',-30,120],['stool',110,-140],['barrel',200,120],['shelf',60,-140,1]]},
 haven_store:{n:'대상 창고',w:320,h:240,floor:'stone',wall:'#a89070',wallK:'plank',ex:-60,deco:'store',
  items:[['crate',-120,-90],['crate',-100,-100,2],['crate',-80,-80,1],['sacks',-130,40],['sacks',-110,70],['kegs',100,-90],['barrel',130,-40],['barrel',140,-20,1],['desk',20,-60],['crate',120,60,2],['crate',100,80]]},
 arden_academy:{n:'왕립 마법원 강당',w:480,h:340,floor:'marble',wall:'#e6e1d6',wallK:'ashlar',ex:140,deco:'academy',
  items:[['orrery',0,-10],['shelf',-180,-150,1],['shelf',-110,-150,1],['shelf',110,-150,1],['shelf',180,-150,1],['shelf',-225,-60,1,1],['shelf',-225,40,1,1],['lectern',-120,30],['lectern',-60,80],['desk',100,60],['desk',170,-20],['cauldron',-150,-60],['candle',60,-120],['candle',-60,-120],['candle',200,110]]},
 // v26 왕도 전당 셋 (전직관은 job2q.js에서 TWFOLK[id].room 자리에 선다)
 arden_cathedral:{n:'왕도 대성당',w:460,h:310,floor:'marble',wall:'#e6e1d6',wallK:'ashlar',ex:150,deco:'chapel',
  items:[['altar',-180,0,0,0,'altar_arden'],['candle',-190,-90],['candle',-190,90],['lectern',-130,50],['pew',-60,-60,0,1],['pew',-60,60,0,1],['pew',20,-60,0,1],['pew',20,60,0,1],['pew',100,-60,0,1],['pew',100,60,0,1],['candle',180,-120],['candle',180,120],['flowerbed',-205,-40,1,1],['flowerbed',-205,40,1,1]]},
 arden_knights:{n:'기사단 전당',w:440,h:300,floor:'stone',wall:'#cfc8b8',wallK:'ashlar',ex:-140,deco:'smithy',
  items:[['rack',-120,-125],['rack',0,-125,1],['rack',120,-125],['mannequin',190,-60],['mannequin',190,40],['table',-20,20,0],['stool',-60,40],['stool',20,50],['stool',-30,-15],['anvil',-170,40],['barrel',180,110],['crate',150,120,1],['crate',-190,-60]]},
 arden_lodge:{n:'사냥꾼 회관',w:400,h:280,floor:'wood',wall:'#8a6c4e',wallK:'plank',ex:120,deco:'tavern',
  items:[['hearth',-178,20,0,1],['table',30,10,1],['stool',0,40],['stool',60,-20],['stool',70,40],['rack',-60,-118],['rack',80,-118,1],['nets',170,-110],['barrel',170,100],['crate',-150,100],['sacks',-120,110],['kegs',150,40]]},
 arden_bakery:{n:'백합 빵집',w:300,h:230,floor:'marble',wall:'#e6e1d6',wallK:'ashlar',ex:50,deco:'bakery',
  items:[['counter',-20,-90],['hearth',-130,-20,0,1],['shelf',80,-102],['table',60,40,1],['stool',30,60],['stool',90,20],['sacks',-120,80],['barrel',120,80]]},
};
// 가구 발판(반 너비). 반전하면 x·y가 바뀐다
const TWFOOT={table:[22,14],bed:[26,14],shelf:[20,7],hearth:[22,9],counter:[46,10],pew:[26,6],altar:[20,9],cauldron:[12,12],orrery:[11,11],lectern:[6,6],desk:[24,12],rack:[23,6],barrel:[9,9],crate:[9,9],kegs:[14,14],sacks:[10,10],anvil:[20,12],nets:[24,4],flowerbed:[20,7]};
const TWLIGHT={hearth:240,candle:130,altar:170,orrery:160,cauldron:110,counter:120,kegs:0};
function twRoomFloor(R){const k=1.5,cv=document.createElement('canvas');cv.width=R.w*k;cv.height=R.h*k;const g=cv.getContext('2d'),s=mulberry(R.w*7+R.h);g.scale(k,k);
  if(R.floor==='wood'){for(let y=0;y<R.h;y+=11){let x=-s()*40;while(x<R.w){const l=50+s()*70;g.fillStyle=Kit.lit('#6a4a2e',(s()-.5)*.3);g.fillRect(x,y,l,10.4);g.fillStyle='rgba(20,12,6,.55)';g.fillRect(x+l-1,y,1,10.4);x+=l}g.fillStyle='rgba(20,12,6,.5)';g.fillRect(0,y+10.4,R.w,.6)}
    g.save();g.globalAlpha=.3;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'wood');g.fillRect(0,0,R.w,R.h);g.restore()}
  else if(R.floor==='stone'){for(let y=0;y<R.h;y+=24)for(let x=(y/24%2)*14;x<R.w;x+=28){g.fillStyle=Kit.lit('#6e665a',(s()-.5)*.3);g.fillRect(x+1,y+1,26,22);g.fillStyle='rgba(255,240,220,.08)';g.fillRect(x+1,y+1,26,2)}
    g.save();g.globalAlpha=.4;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'stone');g.fillRect(0,0,R.w,R.h);g.restore()}
  else{for(let y=0;y<R.h;y+=30)for(let x=0;x<R.w;x+=30){g.fillStyle=((x+y)/30)%2?'#d8d2c6':'#5a5a6a';g.fillRect(x,y,30,30);g.fillStyle='rgba(255,255,255,.07)';g.fillRect(x,y,30,3)}
    g.strokeStyle='rgba(200,170,90,.5)';g.lineWidth=2;g.strokeRect(20,20,R.w-40,R.h-40)}
  // 깔개
  const rug=(x,y,w,h,c1,c2)=>{g.fillStyle=c1;g.fillRect(x,y,w,h);g.strokeStyle=c2;g.lineWidth=4;g.strokeRect(x+6,y+6,w-12,h-12);g.lineWidth=1.5;g.strokeRect(x+12,y+12,w-24,h-24);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x,y+h-3,w,3)};
  if(R.deco==='chapel')rug(R.w/2-170,R.h/2-22,300,44,'#7a2a2a','#d8b860');
  if(R.deco==='home'||R.deco==='tavern')rug(R.w/2-40,R.h/2-20,120,90,'#6a3a2a','#c8a060');
  if(R.deco==='academy'){rug(R.w/2-90,R.h/2-70,180,140,'#24325c','#d8b860');g.strokeStyle='rgba(185,162,255,.5)';g.lineWidth=2;g.beginPath();g.arc(R.w/2,R.h/2,60,0,6.283);g.stroke()}
  // 벽 쪽 그늘
  const sh=(x0,y0,x1,y1)=>{const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,'rgba(0,0,0,.5)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(Math.min(x0,x1),Math.min(y0,y1),Math.abs(x1-x0)||R.w,Math.abs(y1-y0)||R.h)};
  sh(0,0,0,40);sh(0,0,40,0);
  // 나가는 문 앞 깔개
  g.fillStyle='#4a3a22';g.fillRect(R.w/2+R.ex-26,R.h-26,52,26);g.fillStyle='rgba(255,220,150,.25)';g.fillRect(R.w/2+R.ex-22,R.h-8,44,8);
  return cv}
// 뒷벽 두 면 (그림 한 장): 창문 · 선반 · 걸개
function twRoomWalls(R){const H=118,M={...TWPAL.bren,wall:R.wallK,wc:R.wall,timber:R.wallK==='plaster'?'#4a3220':null,base:'#6a6258',arch:R.deco==='chapel'||R.deco==='academy'},w=R.w,h=R.h;
  const pts=[isoP(-w/2,h/2,0),isoP(-w/2,-h/2,H+12),isoP(w/2,-h/2,0),isoP(w/2,h/2,0)];const x0=Math.min(...pts.map(p=>p.x))-10,x1=Math.max(...pts.map(p=>p.x))+10,y0=Math.min(...pts.map(p=>p.y))-10,y1=Math.max(...pts.map(p=>p.y))+14;
  return SC.get('room/'+R.id,x1-x0,y1-y0,-x0,-y0,g=>{g.translate(-x0,-y0);const s=mulberry(R.w);
    const wins=(L)=>{const a=[];const n=Math.max(1,Math.round(L/120));for(let i=0;i<n;i++)a.push({u:(i+.5)/n*L-7,v:46,ww:14,wh:R.deco==='chapel'||R.deco==='academy'?34:20,cold:1,arch:M.arch});return a};
    // 왼쪽 뒷벽 (x=-w/2, 안쪽 면이 +x를 본다): y=+h/2 → -h/2
    g.save();faceT(g,[-w/2,h/2,0],[0,-1,0],[0,0,1]);twWall(g,h,H,M,.78,s,{win:wins(h),noBrace:R.wallK!=='plaster',baseH:10});twRoomDeco(g,R,'L',h,H,s);g.restore();
    g.save();faceT(g,[-w/2,-h/2,0],[1,0,0],[0,0,1]);twWall(g,w,H,M,.95,s,{win:wins(w),noBrace:R.wallK!=='plaster',baseH:10});twRoomDeco(g,R,'R',w,H,s);g.restore();
    // 벽 위 두께
    twFill(g,[isoP(-w/2-10,h/2,H),isoP(-w/2-10,-h/2-10,H),isoP(w/2,-h/2-10,H),isoP(w/2,-h/2,H),isoP(-w/2,-h/2,H),isoP(-w/2,h/2,H)],'#3a3028');
    g.strokeStyle='rgba(255,240,214,.3)';g.lineWidth=1;const a=isoP(-w/2,h/2,H),b=isoP(-w/2,-h/2,H),c=isoP(w/2,-h/2,H);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.lineTo(c.x,c.y);g.stroke();
    // 앞쪽 낮은 턱 (문 자리는 비운다)
    const ex=R.ex;for(const [A,B] of [[[-w/2,h/2],[ex-34,h/2]],[[ex+34,h/2],[w/2,h/2]],[[w/2,h/2],[w/2,-h/2]]]){const p1=isoP(A[0],A[1],0),p2=isoP(B[0],B[1],0),p3=isoP(B[0],B[1],10),p4=isoP(A[0],A[1],10);twFill(g,[p1,p2,p3,p4],'#4a3e32');g.strokeStyle='rgba(255,240,214,.25)';g.beginPath();g.moveTo(p4.x,p4.y);g.lineTo(p3.x,p3.y);g.stroke()}
    // 문틀
    for(const dx of [-34,34])twBox(g,ex+dx,h/2,0,6,6,70,'#5a3a22');twBox(g,ex,h/2,70,74,8,6,'#5a3a22');
  },{scale:Math.max(1,DPR)})}
function twRoomDeco(g,R,side,L,H,s){const d=R.deco;
  const frame=(u,v,w2,h2,c)=>{g.fillStyle='#5a3a22';g.fillRect(u-2,v-2,w2+4,h2+4);g.fillStyle=c;g.fillRect(u,v,w2,h2)};
  if(d==='chapel'&&side==='L'){g.fillStyle='#8a2a2a';g.fillRect(L/2-14,40,28,60);g.fillStyle='#d8b860';g.fillRect(L/2-1.5,52,3,36);g.fillRect(L/2-10,74,20,3)}
  if(d==='home'||d==='tavern'){frame(L*.3,58,26,18,'#6a7a5a');g.fillStyle='rgba(255,240,200,.25)';g.fillRect(L*.3+3,68,20,6);for(let i=0;i<5;i++){g.fillStyle=['#c8a060','#8a6a3a','#d8d0c0'][i%3];g.fillRect(L*.7+i*6,72,4,6)}g.fillStyle='#5a3a22';g.fillRect(L*.7-4,70,36,2)}
  if(d==='tavern'&&side==='R'){g.fillStyle='#3a2a1a';g.fillRect(L*.15,80,40,3);for(let i=0;i<6;i++){g.fillStyle='#a87a4a';g.fillRect(L*.15+2+i*6.4,83,4,6)}}
  if(d==='academy'){for(let i=0;i<3;i++){const u=L*(.2+i*.3);g.fillStyle=['#24325c','#5a3a8a','#2e5a6a'][i];g.fillRect(u,50,22,46);g.fillStyle='#d8b860';g.beginPath();g.arc(u+11,80,6,0,6.283);g.fill()}}
  if(d==='smithy'){for(let i=0;i<4;i++){g.fillStyle='#8a8a92';g.fillRect(L*.2+i*14,62,2,24);g.fillStyle='#4a3220';g.fillRect(L*.2+i*14-1,84,4,6)}g.fillStyle='#4a4a52';g.beginPath();g.arc(L*.7,72,10,0,6.283);g.fill()}
  if(d==='store'||d==='bakery'){g.fillStyle='#5a3a22';g.fillRect(L*.55,74,50,2.4);for(let i=0;i<6;i++){g.fillStyle=d==='bakery'?'#c8904a':'#c8b08a';g.beginPath();g.ellipse(L*.55+5+i*8,79,3.4,2.4,0,0,6.283);g.fill()}}}
function twRoomBuild(id,t){const R=TWROOM[id];R.id=id;const rc={x:t.x,y:t.y};
  if(!R.floorCv)R.floorCv=twRoomFloor(R);
  const list=[],lights=[];
  for(const [k,dx,dy,pv,fl,use] of R.items){const d={x:rc.x+dx,y:rc.y+dy,k,pv:pv|0,fl:fl?1:0,s:1,v:0,zl:0,tprop:1,room:id};if(use)d.use=use;
    const L0=TWLIGHT[k];if(L0){d.light=L0;lights.push(d)}
    const f=TWFOOT[k];if(f){const [a,b]=fl?[f[1],f[0]]:f;d.foot=[d.x-a,d.y-b,d.x+a,d.y+b]}list.push(d)}
  // 문 앞 등불
  lights.push({x:rc.x+R.ex,y:rc.y+R.h/2-20,light:110});lights.push({x:rc.x,y:rc.y,light:180});
  for(const f of TW.folk)if(f.room===id){const F=TWFOLK[f.id],o=F.room||[0,0];f.x=f.hx=rc.x+o[0];f.y=f.hy=rc.y+o[1];if(F.walk)f.path=F.walk.map(p=>({x:rc.x+p[0],y:rc.y+p[1]}));f.town=t;list.push(f)}
  return{R,rc,list,lights}}
function twEnter(b){const t=b.town,B=twRoomBuild(b.enter,t),R=B.R;
  IN={rid:b.enter,R,town:t,bld:b,door:{x:b.door.x,y:b.door.y},rc:B.rc,list:B.list,exit:{x:B.rc.x+R.ex,y:B.rc.y+R.h/2-22}};
  setArr(decor,B.list);setArr(LIGHTS,B.lights);
  P.x=IN.exit.x;P.y=IN.exit.y-30;P.face=-Math.PI*.75;for(const a of allies){a.x=P.x+rnd(-30,30);a.y=P.y-rnd(10,40)}
  projs=projs.filter(p=>p.owner==='p');followCam();burst(P.x,P.y,'#ffd98a',14,90);
  banner={t:R.n,sub:`${t.n} · 문 앞에서 F를 누르면 밖으로 나갑니다`,col:'#ffd98a',life:1.8,max:1.8};
  if(typeof sqOnEnter==='function')sqOnEnter(b.enter);questHud();save()}
function twLeave(silent,keepPos){if(!IN)return;const door=IN.door,L=twL(REG.id);IN=null;
  if(L){setArr(decor,L.decor);setArr(LIGHTS,L.lights)}
  if(!keepPos){P.x=door.x;P.y=door.y+(silent?0:6);for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(10,40)}followCam()}
  if(!silent){msg('밖으로 나왔습니다','#e8dcc0');burst(P.x,P.y,'#ffd98a',10,80);questHud();save()}}
// 바닥 · 뒷벽 그리기
{const _dg=drawGround;drawGround=function(a,b,c,d){if(!IN)return _dg(a,b,c,d);const R=IN.R,rc=IN.rc;
  ctx.drawImage(R.floorCv,rc.x-R.w/2,rc.y-R.h/2,R.w,R.h);
  S();const e=twRoomWalls(R);if(e){const s=W2S(rc.x,rc.y);SC.draw(ctx,e,s.x,s.y)}G()}}
// 실내에서는 바깥 몬스터 · 전리품을 그리지 않는다 (같이 하기에서도 나만 안에 있다)
{const _r=render;render=function(){if(!IN)return _r();const e=enemies,l=loot;enemies=[];loot=[];try{_r()}finally{enemies=e;loot=l}}}
{const _z=zoneName;zoneName=function(x,y){if(IN&&x===P.x&&y===P.y)return `${IN.town.n} · ${IN.R.n}`;return _z(x,y)}}
{const _lr=loadRegion;loadRegion=function(id){if(IN)twLeave(true,true);return _lr(id)}}
{const _ed=enterDungeon;enterDungeon=function(c){if(IN)twLeave(true);return _ed(c)}}
{const _ne=netEnterDg;netEnterDg=function(D){if(IN)twLeave(true,true);return _ne(D)}}
// 저장: 실내면 바깥 문 앞 자리
{const _sd=saveData;saveData=function(){const d=_sd();if(IN&&!DG){d.x=Math.round(IN.door.x);d.y=Math.round(IN.door.y)}return d}}
// 같이 하기: 다른 사람에게는 문 앞에 서 있는 것으로 보낸다
{const _ns=netSendState;netSendState=function(){if(!IN)return _ns();const x=P.x,y=P.y;P.x=IN.door.x;P.y=IN.door.y;try{_ns()}finally{P.x=x;P.y=y}}}
// 미니맵: 실내면 방 그림
{const _dm=drawMinimap;drawMinimap=function(){if(!IN)return _dm();const S0=mm.width,R=IN.R,k=S0*.8/Math.max(R.w*1.4,R.h*1.4);mctx.setTransform(1,0,0,1,0,0);mctx.fillStyle='#0c0d0c';mctx.fillRect(0,0,S0,S0);
  const T=(x,y)=>({x:S0/2+((x-IN.rc.x)-(y-IN.rc.y))*KI*k*1.3,y:S0/2+((x-IN.rc.x)+(y-IN.rc.y))*KI/2*k*1.3});
  const c=[T(IN.rc.x-R.w/2,IN.rc.y-R.h/2),T(IN.rc.x+R.w/2,IN.rc.y-R.h/2),T(IN.rc.x+R.w/2,IN.rc.y+R.h/2),T(IN.rc.x-R.w/2,IN.rc.y+R.h/2)];mctx.fillStyle='#5a4a36';mctx.beginPath();c.forEach((p,i)=>i?mctx.lineTo(p.x,p.y):mctx.moveTo(p.x,p.y));mctx.fill();
  const ex=T(IN.exit.x,IN.exit.y+20);mctx.fillStyle='#9fe0ff';mctx.beginPath();mctx.arc(ex.x,ex.y,5,0,6.283);mctx.fill();
  for(const f of IN.list)if(f.k==='tfolk'){const p=T(f.x,f.y);mctx.fillStyle=typeof sqMark==='function'&&sqMark(f)?'#ffd34d':'#e8dcc0';mctx.fillRect(p.x-2,p.y-2,4,4)}
  const me=T(P.x,P.y);mctx.fillStyle='#fff';mctx.beginPath();mctx.arc(me.x,me.y,4,0,6.283);mctx.fill()}}
// 어둠 위: 나가는 문 빛과 이름
{const _g=drawV5Glow;drawV5Glow=function(){_g();if(!IN)return;S();const s=W2S(IN.exit.x,IN.exit.y+18);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4+.15*Math.sin(time*3);glow(s.x,s.y-30,40,'rgba(255,210,140,.8)');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  ctx.font=`600 12px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('나가는 문',s.x,s.y-78);ctx.fillStyle='#ffe6a8';ctx.fillText('나가는 문',s.x,s.y-78)}}

/* ---------- 매 프레임: 마을 사람 걷기 · 벽과 물 막기 · 가까운 것 찾기 ---------- */
function twPush(o,f,r){if(o.x>f[0]-r&&o.x<f[2]+r&&o.y>f[1]-r&&o.y<f[3]+r){const a=o.x-(f[0]-r),b=(f[2]+r)-o.x,c=o.y-(f[1]-r),d=(f[3]+r)-o.y,m=Math.min(a,b,c,d);if(m===a)o.x=f[0]-r;else if(m===b)o.x=f[2]+r;else if(m===c)o.y=f[1]-r;else o.y=f[3]+r;return true}return false}
function twWet(id,x,y){for(const w of TW.water[id]||[]){if(x>w.x0+90&&x<w.x1-90&&y>w.y0+24&&y<w.y1-24&&!w.docks.some(q=>x>q[0]-4&&x<q[1]+4&&y>q[2]-6&&y<q[3]+4))return true}return false}
function twFolkTick(f,dt){const dp=dist(P,f);f.moving=false;
  if(dp<80&&!P.dead){const sx=(P.x-f.x)-(P.y-f.y);if(Math.abs(sx)>4)f.face=sx>0?1:-1;return}
  if(!f.path)return;if(f.wait>0){f.wait-=dt;return}
  const tg=f.path[f.wi],dx=tg.x-f.x,dy=tg.y-f.y,l=Math.hypot(dx,dy);
  if(l<6){f.wi=(f.wi+1)%f.path.length;f.wait=1.2+R()*2.4;return}
  const sp=f.spd*dt;f.x+=dx/l*Math.min(sp,l);f.y+=dy/l*Math.min(sp,l);f.moving=true;f.walkT+=dt;const sx=dx-dy;if(Math.abs(sx)>.5)f.face=sx>0?1:-1}
const josa=(n,a,b)=>{const c=n.charCodeAt(n.length-1);return n+((c>=0xac00&&c<=0xd7a3&&(c-0xac00)%28)?b:a)};
function twActLabel(a){if(typeof a!=='string'||a.slice(0,3)!=='tw_')return '';const o=TW.act;
  if(a==='tw_leave')return `${IN?IN.R.n:''} 밖으로 나가기 (F)`;if(!o)return '';
  if(a==='tw_talk')return `${josa(o.n,'와','과')} 이야기 (F)`;if(a==='tw_enter')return `${o.label||'건물'} 들어가기 (F)`;
  if(a==='tw_use'){const u=sqUseLive(o);return u?`${u.label} (F)`:''}return ''}
function twTalk(f){if(typeof sqTalk==='function'&&sqTalk(f))return;const line=f.lines.length?f.lines[f.li%f.lines.length]:'…';f.li++;f.say=line;f.sayT=time+4.5;msg(`${f.n}: 「${line}」`,'#e8dcc0');
  const sx=(P.x-f.x)-(P.y-f.y);f.face=sx>0?1:-1}
{const _da=doAct;doAct=function(){const a=act;
  if(a==='tw_leave'){twLeave(false);return}
  if(a==='tw_enter'&&TW.act){twEnter(TW.act);return}
  if(a==='tw_talk'&&TW.act){twTalk(TW.act);return}
  if(a==='tw_use'&&TW.act){sqUse(TW.act);return}
  return _da()}}
function twTick(dt,ox,oy){
  if(DG){if(IN)twLeave(true,true);return}
  if(IN){// 순간이동(귀환 두루마리 등)으로 방을 벗어났으면 조용히 바깥으로
    const R=IN.R;if(Math.abs(P.x-IN.rc.x)>R.w||Math.abs(P.y-IN.rc.y)>R.h){twLeave(true,true);return}
    P.x=clamp(P.x,IN.rc.x-R.w/2+16,IN.rc.x+R.w/2-14);P.y=clamp(P.y,IN.rc.y-R.h/2+16,IN.rc.y+R.h/2-14);
    for(const d of IN.list)if(d.foot)twPush(P,d.foot,P.r*.8);
    for(const a of allies){a.x=clamp(a.x,IN.rc.x-R.w/2+16,IN.rc.x+R.w/2-14);a.y=clamp(a.y,IN.rc.y-R.h/2+16,IN.rc.y+R.h/2-14)}
    for(const f of IN.list)if(f.k==='tfolk')twFolkTick(f,dt);
    act=null;TW.act=null;if(P.dead)return;let bd=1e9;
    if(dist(P,IN.exit)<62){act='tw_leave';bd=dist(P,IN.exit)}
    for(const f of IN.list){const d=dist(P,f);if(f.k==='tfolk'&&d<64&&d<bd){bd=d;act='tw_talk';TW.act=f}else if(f.use&&d<70&&d-20<bd&&sqUseLive(f)){bd=d-20;act='tw_use';TW.act=f}}
    return}
  // 바깥: 건물 · 성벽 · 물
  const B=TW.blds[REG.id]||[];
  for(const b of B){const near=Math.abs(P.x-b.x)<320&&Math.abs(P.y-b.y)<320;if(!near){b.zk=undefined;continue}
    for(const f of b.foot)twPush(P,f,P.r);
    if(b.k==='bld'){const f=b.foot[0],front=P.x>f[2]||P.y>f[3];b.zk=front?P.x+P.y-.5:P.x+P.y+.5}}
  if(twWet(REG.id,P.x,P.y)){if(!twWet(REG.id,P.x,oy))P.y=oy;else if(!twWet(REG.id,ox,P.y))P.x=ox;else{P.x=ox;P.y=oy}}
  const nt=nearestTown(P.x,P.y);
  for(const f of decor)if(f.k==='tfolk'&&Math.abs(f.x-P.x)<1200&&Math.abs(f.y-P.y)<1200)twFolkTick(f,dt);
  // 마을 사람 · 의뢰 물건 · 문은 의뢰인 · 창고 · 짝문 · 상점보다 더 가까울 때 그쪽이 먼저
  const fac={quest:nt.t.npc,stash:nt.t.stash,gate:nt.t.gate}[act];
  if(!P.dead&&nt.d<SAFE+400&&(act==null||act==='quest'||act==='stash'||act==='gate'||act==='shop')){let bd=act==null?1e9:fac?dist(P,fac)-(act==='quest'?22:10):30,best=null,ka=null;
    for(const f of decor){if(Math.abs(f.x-P.x)>90||Math.abs(f.y-P.y)>90)continue;const d=dist(P,f);
      if(f.k==='tfolk'&&!f.shopk&&d<62&&d<bd){bd=d;best=f;ka='tw_talk'}
      else if(f.use&&d<60&&d-20<bd&&sqUseLive(f)){bd=d-20;best=f;ka='tw_use'}}
    for(const b of B)if(b.enter&&dist(P,b.door)<50){const d=dist(P,b.door);if(d<bd){bd=d;best=b;ka='tw_enter'}}
    if(ka){act=ka;TW.act=best}}
  else if(!act&&!P.dead){for(const f of decor){if(f.use&&Math.abs(f.x-P.x)<70&&Math.abs(f.y-P.y)<70&&dist(P,f)<60&&sqUseLive(f)){act='tw_use';TW.act=f;break}}}
}
{const _u=update;update=function(dt){const ox=P.x,oy=P.y;_u(dt);twTick(dt,ox,oy)}}
window.__town={twBldSprite,SC,TWPAL,twBlade,TWLAY,TWFOLK,TWROOM,TW,get IN(){return IN},twEnter,twLeave,twFolkSprite,TWP,twProp};

// 이름표는 맨 마지막에 (어둠 · 빛 위)
{const _g=drawV5Glow;drawV5Glow=function(){_g();if(DG){QLBL.length=0;return}twLabels()}}
