/* ---------- v20 W1 기록 수집 · 책 30권 (설계: rpg/v20-ideas/code/lore-books.js) ----------
   책은 가방에 들어가지 않고 「읽음」만 남는다 (P.books). 얻는 순간 읽기 쪽지가 뜨고, 도감(J)의 「서고」 칸에서 다시 읽는다.
   얻는 곳: shop(아르덴·브렌힐·헤이븐 잡화점) · dg(그 던전 보스를 쓰러뜨릴 때 하나씩) · boss(처음 쓰러뜨릴 때) · region(그 지역 들판 몬스터 0.4%).
   처음 읽을 때 경험치(지금 레벨 필요 경험치의 1%). 묶음을 다 읽으면 칭호(세력 평판의 칭호 칸과 같이 고른다). */
const BOOKS=[
 {id:'g1',grp:'gods',n:'여명의 아우렐',src:{shop:'arden'},price:200,t:'아우렐은 밤이 가장 깊을 때 뜨는 첫 빛이다. 여명교단의 성표는 여덟 빛살이 뻗은 원이며, 에르난 왕국의 국교다. 교단의 사제는 소리 큰 기도보다 깊은 마음이 먼저 닿는다고 가르친다. 그래서 아우렐의 사제는 지친 사람 곁에서 조용히 기도한다.'},
 {id:'g2',grp:'gods',n:'황혼의 모르딘',src:{dg:'sewer'},t:'모르딘은 하루를 닫는 신, 죽음과 안식을 맡는다. 안식회 사제들은 검은 옷을 입고 장례를 치르며, 떠나지 못한 영혼을 보낸다. 사람들은 그 옷을 꺼리지만 망령이 나오는 밤이면 가장 먼저 그들을 찾는다.'},
 {id:'g3',grp:'gods',n:'대지의 테라미아',src:{region:'plains'},t:'테라미아의 사제는 교회 대신 들판에서 기도한다. 씨를 뿌리는 날과 거두는 날, 그리고 아이가 태어나는 날. 초원의 켄타우로스도 이 신을 섬기며, 그들은 테라미아를 「발굽 아래의 어머니」라 부른다.'},
 {id:'g4',grp:'gods',n:'바다와 운명의 넬라',src:{shop:'haven'},price:200,t:'뱃사람은 출항 전에 넬라에게 동전을 던진다. 동전이 앞면이면 바람이, 뒷면이면 운명이 그들을 데려간다고 한다. 파도 사제들은 바람의 방향과 사람의 앞날이 같은 물결 위에 있다고 믿는다.'},
 {id:'g5',grp:'gods',n:'강철의 발카르',src:{dg:'fort'},t:'발카르는 전쟁과 맹세의 신이다. 동쪽 발케르 제국의 국교이며, 강철 사제단의 사제는 곧 전사다. 그들은 맹세를 어긴 자에게 은총이 끊긴다고 말한다. 맹세를 지키다 쓰러진 자에게는 쇠 종이 한 번 울린다.'},
 {id:'a1',grp:'ash',n:'재의 군주 — 마을 노래',src:{shop:'brenhill'},price:120,t:'「불 없는 밤엔 문을 닫아라, 재가 이름을 부르러 온다.」 브렌힐 아이들이 줄넘기하며 부르는 노래다. 어른들은 사백 년 전 북쪽 왕국 하나가 하룻밤에 재가 되었다는 이야기에서 나온 노래라고만 말한다.'},
 {id:'a2',grp:'ash',n:'침묵의 탑',src:{dg:'sanctum'},t:'서리이빨 산맥 가장 높은 어깨에 검은 탑이 서 있다. 아홉 룬 기둥이 탑 아래의 무언가를 붙들고 있다고 한다. 탑을 세운 사람은 스물일곱이었고, 그중 누구도 늙어서 죽지 않았다.'},
 {id:'a3',grp:'ash',n:'재의 사도에 관한 마법원 보고',src:{boss:'b_morgath'},t:'(왕립 마법원 봉인 기록, 백 년 전) 사도를 자처한 자들이 「군주의 숨」을 다시 부르려 했다. 그들이 쓴 말은 근원어를 거꾸로 읽은 것이었다. 봉인은 유지되었으나, 그들이 어디서 그 말을 배웠는지는 끝내 밝히지 못했다.'},
 {id:'a4',grp:'ash',n:'얕아지는 강 (찢긴 쪽지)',src:{region:'ice'},t:'…옛 기록과 견주어 보니 같은 우물에서 길어 올리는 마나가 해마다 조금씩 얕다. 원로 회의에 올렸으나 「계절의 탓」이라 한다. 계절이 백 년 동안 한쪽으로만 기울 수 있는가… (뒷장은 찢겨 있다)'},
 {id:'a5',grp:'ash',n:'갈라진 문에 대한 엘리안의 메모',src:{boss:'b_elgaros'},t:'문을 연 것은 모르가스였지만, 문이 그토록 쉽게 갈라진 이유는 따로 있다. 문틀이 먼저 말라 있었다. 무엇이 문틀의 힘을 빨아 갔는가. 침묵의 탑 기록을 다시 열어 볼 것.'},
 {id:'r1',grp:'races',n:'숲의 노래, 실바렌',src:{region:'forest'},t:'엘프는 세상에게 명령하지 않고 세상과 함께 흥얼거린다. 그들이 흥얼거리면 강에서 길어 오지 않아도 마나가 스스로 그릇에 흘러든다. 실바렌 숲 안의 하루는 바깥의 이레쯤 된다고 하니, 숲에 들어간 사람은 늘 늦게 돌아온다.'},
 {id:'r2',grp:'races',n:'망치말, 카즈둔의 룬',src:{boss:'b_titanguard'},t:'드워프는 목구멍이 굵어 근원어를 잘 부르지 못한다. 대신 망치로 쇠에 말을 두드린다. 그들의 룬은 새지 않는다. 한 세대에 한둘, 벽의 결을 읽는 「쇠의 귀」가 태어난다.'},
 {id:'r3',grp:'races',n:'물을 읽는 살라크',src:{dg:'sewer'},t:'늪과 강에 사는 도마뱀 종족 살라크는 물을 부르지 않고 듣는다. 물에 남은 목소리로 지난 일과 먼 곳의 일을 안다. 그들은 반딧불 습지를 지날 때 말을 하지 않는다. 물이 듣고 있기 때문이다.'},
 {id:'r4',grp:'races',n:'별을 읽는 초원의 부족',src:{region:'desert'},t:'켄타우로스는 별의 움직임으로 앞날을 짐작한다. 그림자 없는 들판에서 맹세하는 것은, 거짓을 숨길 그림자가 없어서다. 그들은 어느 나라의 지배도 받지 않으며 계절마다 거석 원에 모인다.'},
 {id:'r5',grp:'races',n:'거인의 후예',src:{region:'canyon'},t:'거인의 후예는 근원어 없이 몸으로 땅과 공명한다. 화가 나면 땅이 갈라지고 슬프면 돌이 운다. 스스로도 다스리지 못할 때가 있어, 그들은 마을을 이루지 않고 흩어져 산다. 망각의 협곡의 성문 터는 그들 조상의 것이라 한다.'},
 {id:'r6',grp:'races',n:'붉은 탑의 전투 마법사',src:{shop:'haven'},price:300,t:'동쪽 발케르 제국의 전투 마법사는 열한 살 무렵부터 팔에 룬 문신을 새긴다. 손목을 쥐고 한 음절로 마법을 부르니 빠르기가 세 배다. 대신 살에 새긴 둑이 약해 쓸 때마다 몸이 탄다. 그들 대부분은 마흔을 넘기지 못한다.'},
 {id:'w1',grp:'wonders',n:'오로라 빙원의 밤',src:{region:'ice'},t:'밤마다 하늘빛이 얼음 벌판까지 내려와 낮게 노래한다. 엘프들은 그 노래를 받아 적으러 먼 길을 온다. 얼음 위에 오래 서 있으면 제 그릇이 하늘빛을 따라 흔들린다고 한다.'},
 {id:'w2',grp:'wonders',n:'멈춘 폭포',src:{boss:'r_hrimnir'},t:'서리이빨 산맥 남쪽 벼랑의 폭포는 사백 년 전 어느 날 공중에서 멈췄다. 물은 얼지 않았는데 떨어지지 않는다. 가까이 가면 시간이 느려진다. 폭포 아래에서 누군가 눈을 깜빡이는 것을 보았다는 사냥꾼이 있다.'},
 {id:'w3',grp:'wonders',n:'오르는 비의 계곡',src:{region:'highland'},t:'그 계곡에서는 비가 땅에서 하늘로 내린다. 물과 바람의 흐름이 뒤집힌 곳이라, 물을 부르면 물이 위로 흐르고 바람을 부르면 바람이 땅으로 가라앉는다. 마법사 견습들이 장난삼아 찾아갔다가 젖은 채 하늘을 보며 돌아온다.'},
 {id:'w4',grp:'wonders',n:'그치지 않는 번개 곶',src:{region:'cliffs'},t:'맑은 날에도 번개가 떨어지는 곶이 있다. 번개 맞은 모래가 유리가 되어 해안 전체가 반짝인다. 갈매기 등대 사람들은 올해 번개가 남쪽으로 기울어 떨어진다고 걱정한다.'},
 {id:'w5',grp:'wonders',n:'소금 거울 평원',src:{region:'desert'},t:'얇은 물이 덮인 소금 벌판이 하늘을 그대로 비춘다. 밤에는 별 위를 걷는 것 같다. 가끔 거울 속 별자리만 하늘과 다르다. 대상들은 그런 밤엔 길을 떠나지 않는다.'},
 {id:'w6',grp:'wonders',n:'떠 있는 바위',src:{boss:'b_orde'},t:'큰 바위들이 땅에서 한 길쯤 떠서 천천히 도는 협곡이 있다. 대지와 공간의 결이 어긋난 곳이라고 마법사들은 말한다. 드워프들은 「산이 꿈을 꾸는 곳」이라 부른다.'},
 {id:'w7',grp:'wonders',n:'반딧불 습지',src:{region:'home'},t:'은류강 서쪽 습지에는 겨울에도 반딧불 같은 빛이 떠다닌다. 떠나지 못한 영혼이라고도, 늪의 물이 기억하는 옛 등불이라고도 한다. 윌로벤 뱃사공들은 그 빛을 따라 노를 젓지 않는다.'},
 {id:'w8',grp:'wonders',n:'밤마다 골목이 바뀌는 도시',src:{shop:'arden'},price:400,t:'동쪽 오르타는 공간 학파 마법사들이 세운 연구 도시였다. 골목마다 새긴 짝문 룬이 주인을 잃고 제멋대로 깨어나, 밤마다 거리의 이음새가 바뀐다. 주민들은 아침마다 길을 새로 묻는다. 도시 한가운데 탑에는 아직 아무도 닿지 못했다.'},
 {id:'t1',grp:'towns',n:'브렌힐 방앗간 일지',src:{shop:'brenhill'},price:60,t:'올해 밀은 좋았다. 다만 강물이 예년보다 낮아 물레가 느리다. 바르톨 영감이 「물이 아니라 물 밑의 무언가가 낮아진 것」이라며 웃었다. 영감 말은 늘 반쯤만 알아듣겠다.'},
 {id:'t2',grp:'towns',n:'윌로벤 나루 노래',src:{shop:'haven'},price:60,t:'「은류강 물은 아르덴을 지나, 바다까지 가는 데 사흘. 돌아오는 데는 평생.」 나루터 주점에서 부르는 노래다. 노래가 끝나면 다들 잔을 강 쪽으로 한 번 기울인다.'},
 {id:'t3',grp:'towns',n:'헤이븐 교차로 여관 장부',src:{shop:'haven'},price:80,t:'(장부 여백의 낙서) 동쪽에서 온 손님은 팔에 문신이 있었다. 맥주 대신 물을 시켰고, 손목의 쇠고리를 한 번도 풀지 않았다. 셈은 정확했다. 다음 날 아침엔 아무도 그를 보지 못했다.'},
 {id:'t4',grp:'towns',n:'왕립 마법원 입학 안내',src:{shop:'arden'},price:100,t:'마법원은 일곱 첨탑으로 되어 있으며, 두 위계를 묶어 한 급수로 부른다. 견습은 단어 하나를 온전히 부르는 것부터 배운다. 제 위계를 넘는 마법도 억지로 부를 수는 있으나, 넘은 만큼 몸이 값을 치른다. 마법원은 그 값을 대신 치러 주지 않는다.'},
 {id:'t5',grp:'towns',n:'마지막 등불 순찰 일지',src:{region:'abyss'},t:'균열이 숨을 쉰다. 들이쉴 때 등불이 흔들리고, 내쉴 때 보랏빛 먼지가 쏟아진다. 오늘은 들이쉬는 시간이 어제보다 길었다. 무언가 저 너머에서 이쪽의 마나를 마시고 있다.'},
 {id:'t6',grp:'towns',n:'까마귀샘 선돌 이야기',src:{region:'moor'},t:'까마귀샘 사람들은 선돌이 원래 거인의 손가락이었다고 믿는다. 그래서 선돌 사이로 지나갈 때는 모자를 벗는다. 요즘 선돌 틈에서 보랏빛이 새어 나온 뒤로, 까마귀들이 선돌 위에 앉지 않는다.'}];
const BOOK_SETS={gods:{n:'다섯 신의 이야기',badge:'신들의 이름을 아는 자',col:'#ffe39a'},ash:{n:'재와 봉인',badge:'봉인을 읽은 자',col:'#ff9a6a'},races:{n:'아르세이아의 종족들',badge:'여러 말을 아는 자',col:'#9fe39a'},
  wonders:{n:'신비한 땅',badge:'먼 땅의 길손',col:'#9fd8ff'},towns:{n:'마을 이야기',badge:'이야기꾼',col:'#e8c38a'}};
const BOOKBY={};for(const b of BOOKS)BOOKBY[b.id]=b;
const bkHave=id=>!!(P&&Array.isArray(P.books)&&P.books.includes(id));
const bkSetDone=g=>BOOKS.filter(b=>b.grp===g).every(b=>bkHave(b.id));
function bkSrcText(b){const s=b.src;if(s.shop){const t=v20Town(s.shop);return `${t?t.n:''} 잡화점에서 판다 (금화 ${b.price})`}
  if(s.dg){const d=DUNGEONS.find(d=>d.id===s.dg);return `던전 「${d?d.n:s.dg}」의 주인을 쓰러뜨리면 나온다`}
  if(s.boss){const t=TYPES[s.boss];return `${t?t.n:'강한 적'}${v20J(t?t.n:'강한 적','를','을')} 처음 쓰러뜨리면 나온다`}
  if(s.region){const R0=REGIONS[s.region];return `${R0?R0.n:''} 들판의 몬스터가 아주 드물게 떨군다`}return ''}
// 읽기 쪽지 (게임을 멈추지 않고 화면 아래에 잠깐)
const BKC=document.createElement('div');BKC.id='bookcard';BKC.hidden=true;document.body.appendChild(BKC);
v20Css('#bookcard{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 150px);transform:translateX(-50%);width:min(440px,calc(100vw - 24px));max-height:min(46vh,340px);overflow:auto;box-sizing:border-box;z-index:7;background:rgba(24,19,12,.95);border:1px solid #c9a24a;border-radius:6px;padding:10px 12px;color:#efe2c0;pointer-events:auto;font-size:13px}'+
  '#bookcard h3{margin:0 0 2px;font-size:15px;color:#ffe39a}#bookcard .bkx{float:right;margin:-4px -4px 0 6px}#bookcard p{margin:6px 0 0;line-height:1.55}');
let bkT=0;
function bookShow(id,first){const b=BOOKBY[id];if(!b)return;const S0=BOOK_SETS[b.grp];BKC.innerHTML=`<button type="button" class="ghost bkx" aria-label="닫기">닫기</button><h3>📖 ${v20Esc(b.n)}</h3><div class="muted" style="font-size:12px">${S0.n}${first?' · 새 책':''} · 도감(J) 「서고」에서 다시 읽기</div><p>${v20Esc(b.t)}</p>`;
  BKC.hidden=false;bkT=22;BKC.querySelector('.bkx').onclick=()=>{BKC.hidden=true}}
V20.tick.push(dt=>{if(bkT>0){bkT-=dt;if(bkT<=0)BKC.hidden=true}});
function bookGain(id,how){const b=BOOKBY[id];if(!b||!P)return false;if(!Array.isArray(P.books))P.books=[];if(P.books.includes(id))return false;P.books.push(id);
  const xp=Math.max(1,Math.round(xpNeed(P.lvl)*.01));gainXp(xp);burst(P.x,P.y,'#ffe39a',20,100,3,30);msg(`책을 얻었습니다: 「${b.n}」${how?` (${how})`:''} · 경험치 ${xp}`,'#ffe39a');
  if(bkSetDone(b.grp)){const S0=BOOK_SETS[b.grp];banner={t:`묶음 완성 · ${S0.n}`,sub:`칭호 「${S0.badge}」${v20J(S0.badge,'를','을')} 얻었습니다 (평판 칸에서 고르기)`,col:'#ffe39a',life:3,max:3};rings.push({x:P.x,y:P.y,r:10,max:160,life:.9,col:'#ffe39a'})}
  if(typeof repOnBook==='function')repOnBook(b);bookShow(id,true);save();return true}
// 얻는 곳: 던전 주인 · 첫 보스 · 들판 몬스터
{const _rk=rewardKill;rewardKill=function(e){_rk.apply(this,arguments);if(!P||GHOST)return;const t=TYPES[e.k]||{};
  if(DG&&DG.d&&(t.boss)&&!DG.d.trial){const b=BOOKS.find(b=>b.src.dg===DG.d.id&&!bkHave(b.id));if(b)bookGain(b.id,DG.d.n)}
  {const b=BOOKS.find(b=>b.src.boss===e.k&&!bkHave(b.id));if(b)bookGain(b.id,t.n)}
  if(!DG&&!IN&&!t.boss&&!t.mini&&R()<.004){const c=BOOKS.filter(b=>b.src.region===REG.id&&!bkHave(b.id));if(c.length)bookGain(pick(c).id,REGIONS[REG.id].n)}}}
// 잡화점에서 사기
const BK_SHOP=['arden','brenhill','haven'];
{const _sh=shopHtml;shopHtml=function(){let h=_sh();const t=actTown;if(!t||!BK_SHOP.includes(t.id)||(SHOP_SLOTS[actShop]?actShop:'general')!=='general')return h;
  const L=BOOKS.filter(b=>b.src.shop===t.id);if(!L.length)return h;const rows=L.map(b=>{const have=bkHave(b.id);return `<div class="shoprow"><div>📖 ${b.n} <span class="muted">· ${BOOK_SETS[b.grp].n}${have?' · 읽음':''}</span></div><div class="btns">${have?'<button type="button" disabled>읽음</button>':v20Btn('bookbuy',b.id,`사기 ${b.price}`,{dis:P.gold<b.price})}</div></div>`}).join('');
  const sec=`<h2>책 <span class="muted">가방을 차지하지 않음 · 처음 읽으면 경험치</span></h2>${rows}`;const i=h.indexOf('<h2>반지와 목걸이');return i>=0?h.slice(0,i)+sec+h.slice(i):h+sec}}
V20A.bookbuy=id=>{const b=BOOKBY[id];if(!b||!b.src.shop||bkHave(id)||P.gold<b.price||!actTown||actTown.id!==b.src.shop)return;P.gold-=b.price;bookGain(id,'잡화점')};
/* ===== 도감 칸 늘리기 (서고 · 그리고 다른 v20 칸: 연계 · 신비) ===== */
V20.cx=[];
{const _ch=codexHtml;codexHtml=function(){const mine=V20.cx.find(c=>c.k===cxSub);const sv=cxSub;if(mine)cxSub='items';let h=_ch();cxSub=sv;
  const i=h.indexOf('</div>');if(i<0)return h;const tabs=h.slice(0,i).replace(/aria-selected="true"/g,mine?'aria-selected="false"':'aria-selected="true"')+V20.cx.map(c=>`<button type="button" role="tab" data-cx="${c.k}" aria-selected="${cxSub===c.k}">${c.n}</button>`).join('')+'</div>';
  if(!mine)return tabs+h.slice(i+6);return tabs+mine.html()}}
V20.cx.push({k:'books',n:'서고',html(){const n=BOOKS.filter(b=>bkHave(b.id)).length;let h=`<p class="muted" style="margin-top:0">읽은 책 ${n}/${BOOKS.length} · 책은 가방을 차지하지 않습니다. 묶음을 다 읽으면 칭호를 얻습니다.</p>`;
  for(const g in BOOK_SETS){const S0=BOOK_SETS[g],L=BOOKS.filter(b=>b.grp===g),k=L.filter(b=>bkHave(b.id)).length,done=k===L.length;
    h+=`<h2 style="color:${S0.col}">${S0.n} <span class="muted">${k}/${L.length}${done?` · 칭호 「${S0.badge}」`:''}</span></h2><div class="v20bar"><i style="width:${k/L.length*100}%"></i></div>`;
    for(const b of L){if(bkHave(b.id))h+=`<details class="v20box"><summary><b>📖 ${b.n}</b></summary><div class="v20txt" style="margin-top:4px">${v20Esc(b.t)}</div></details>`;
      else h+=`<div class="v20box" style="opacity:.75"><b>??? </b><span class="muted" style="font-size:12px">${bkSrcText(b)}</span></div>`}}
  return h}});
window.__v20=window.__v20||{};Object.assign(window.__v20,{BOOKS,BOOK_SETS,BOOKBY,bookGain,bookShow,bkHave,bkSetDone,bkSrcText});
for(const g in BOOK_SETS){const S0=BOOK_SETS[g];V20.titles.push({id:'book_'+g,n:S0.badge,col:S0.col,src:`책 묶음 「${S0.n}」`,have:()=>bkSetDone(g)})}
