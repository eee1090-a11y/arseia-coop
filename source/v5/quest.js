/* ---------- 퀘스트라인: 1막 「재의 그림자」 ---------- */
// 마을마다 의뢰인이 있다. 받은 의뢰만 센다. 진행은 캐릭터 저장의 q 필드({i:몇 번째 의뢰, st:0 안 받음/1 진행/2 보고만 남음, c:{목표:수}}).
// 목표 종류: kill(k: 몬스터 종류들, n), get(k: 그 몬스터에게서 p 확률로 얻는 물건, n), talk(town: 그 마을 의뢰인과 이야기), reach(cave: 그 던전 입구에 닿기 · v22 quest22.js)
const QNPC={brenhill:{n:'마렌 촌장',cls:'priest',rar:1,face:.6},willowen:{n:'뱃사공 오드릭',cls:'mage',rar:0,face:.9},haven:{n:'여관 주인 리사',cls:'priest',rar:2,face:.3},arden:{n:'대마법사 엘리안',cls:'mage',rar:4,face:.8}};
const QUESTS=[
 {town:'brenhill',lvl:2,t:'들판의 늑대',say:'어서 오게, 젊은이. 요즘 들판의 회색 늑대들이 양 우리까지 내려온다네. 여덟 마리만 쫓아내 주겠나?',done:'고맙네! 이제 양치기들이 한숨 돌리겠어. 그런데 늑대들이 무언가에 쫓겨 내려온 것 같단 말이지…',
  goals:[{type:'kill',k:['wolf'],n:8,d:'회색 늑대 처치'}],rw:{xp:1,gold:60,pot:3}},
 {town:'brenhill',lvl:5,t:'고분의 속삭임',say:'남서쪽 안개숲의 옛 고분에서 밤마다 뼈 부딪히는 소리가 난다네. 고분 입구까지만 가서 무슨 일인지 살펴봐 주겠나? 안으로 들어가는 건 내 얘기를 듣고 나서 하게.',done:'고분 문이 안쪽에서 열려 있고, 뼈 끌린 자국이 깊은 곳까지 이어졌다고? 고분지기 볼그가 다시 일어난 게 틀림없네… 누군가 죽은 자를 깨우고 있어.',
  goals:[{type:'reach',cave:'barrow',d:'안개숲 옛 고분 입구 살펴보기'}],rw:{xp:1.2,gold:150,item:1}},// v22: 던전은 다음 의뢰에서 한 번만 들어간다 (볼그는 「고분의 왕」으로)
 {town:'brenhill',lvl:7,t:'고분의 왕',say:'볼그가 깨어났다면 고분 가장 깊은 곳에 잠든 옛 왕 아르실도 깨어난 걸세. 그 왕이 일어서면 브렌힐은 끝장이야. 한 번에 들어가서 볼그를 쓰러뜨리고, 그 길로 아르실까지 다시 잠재워 주게.',done:'자네가 마을을 구했네! 이 축복받은 반지를 받게. 그리고… 아르실의 관에서 나온 이 재 묻은 편지를 보게. "은류강의 수로에서 기다린다." 윌로벤으로 가 보게나.',
  goals:[{type:'kill',k:['m_bolg'],n:1,d:'안개숲 고분의 고분지기 볼그 처치'},{type:'kill',k:['b_arsil'],n:1,d:'고분의 왕 아르실 처치'}],rw:{xp:1.6,gold:300,item:2,sp:1}},
 {town:'brenhill',lvl:5,t:'은류강 나루로',say:'편지를 윌로벤의 뱃사공 오드릭에게 보여 주게. 그 친구는 강의 일을 모르는 게 없다네. 동쪽 길을 따라가면 된다네.',done:'(오드릭) 브렌힐 촌장이 보냈다고? 그 편지… 이 재 냄새는 수로 깊은 곳의 것이 맞아.',
  goals:[{type:'talk',town:'willowen',d:'윌로벤의 뱃사공 오드릭과 이야기'}],rw:{xp:.6,gold:80}},
 {town:'willowen',lvl:8,t:'강가의 주술사',say:'요즘 고블린 주술사들이 강가에 이상한 부적을 묻고 다니네. 부적이 묻힌 곳마다 물이 검게 썩어. 놈들을 쓰러뜨리고 부적을 여섯 장 모아 와 주게.',done:'이 부적… 재의 문양이군. 누군가 고블린들을 부리고 있어.',
  goals:[{type:'get',k:['goblin'],p:.5,n:6,item:'재 문양 부적',d:'고블린 주술사를 쓰러뜨려 재 문양 부적 모으기'}],rw:{xp:1.2,gold:220,item:1}},
 {town:'willowen',lvl:11,t:'수로 아래의 것',say:'부적이 흘러가는 곳은 하나뿐이네. 은류강 지하 수로. 그 아래에서 무언가가 물을 삼키며 자라고 있어. 그것을 끝내 주게.',done:'삼키는 자가 쓰러졌다니! 강물이 다시 맑아지고 있어. 그 녀석 뱃속에서 나온 이 지도를 보게. 헤이븐 교차로에 붉은 표시가 있군.',
  goals:[{type:'kill',k:['m_grol','m_drowned'],n:2,d:'늪거인 그롤과 익사한 사제 처치'},{type:'kill',k:['b_devourer'],n:1,d:'삼키는 자 처치'}],rw:{xp:1.6,gold:450,item:2,ap:5}},
 {town:'willowen',lvl:10,t:'교차로의 소문',say:'헤이븐 교차로의 여관 주인 리사는 온갖 소문을 다 듣는 사람이야. 그 지도를 보여 주게. 북동쪽 대로를 따라가면 되네.',done:'(리사) 이 지도라면… 동쪽 잿빛 요새를 가리키고 있어요. 군대가 버리고 떠난 그곳에서 요즘 불빛이 보인다는 소문이 돌아요.',
  goals:[{type:'talk',town:'haven',d:'헤이븐 교차로의 여관 주인 리사와 이야기'}],rw:{xp:.6,gold:120}},
 {town:'haven',lvl:14,t:'잿빛 행군',say:'요새 쪽에서 재 들개와 잿빛 병사들이 대로까지 내려와요. 상인들이 다 끊겼어요. 길을 열어 주세요.',done:'대로가 다시 열렸어요! 그런데 병사들 갑옷에 왕국 기사단 문장이 있었다고요? 설마…',
  goals:[{type:'kill',k:['ashhound','ashsoldier'],n:15,d:'대로의 재 들개·잿빛 병사 처치'}],rw:{xp:1.3,gold:380,item:1}},
 {town:'haven',lvl:18,t:'배신자의 요새',say:'잿빛 요새를 다스리는 건 옛 기사단장 발드라크래요. 부하였던 헤르딘이 그를 배신하고 재의 무리에 넘겼다는군요. 둘 다 쓰러뜨려 주세요.',done:'발드라크의 검에 이런 글이 새겨져 있었어요. "재의 성소에서 사도가 깨어난다." 아르덴의 대마법사님께 알려야 해요.',
  goals:[{type:'kill',k:['m_herdin'],n:1,d:'배신자 헤르딘 처치'},{type:'kill',k:['b_baldrak'],n:1,d:'잿빛 군주 발드라크 처치'}],rw:{xp:1.6,gold:700,item:2,sp:1}},
 {town:'haven',lvl:16,t:'왕도로',say:'북쪽 왕도 아르덴의 왕립 마법원에 대마법사 엘리안님이 계세요. 이 검의 글을 보여 드리세요.',done:'(엘리안) 재의 사도… 백 년 전 봉인했던 이름이로군. 잘 왔네.',
  goals:[{type:'talk',town:'arden',d:'아르덴의 대마법사 엘리안과 이야기'}],rw:{xp:.6,gold:200}},
 {town:'arden',lvl:22,t:'망령의 밤',say:'왕도 둘레에 망령이 들끓네. 사도가 깨어나며 흩어진 영혼들이지. 망령과 그 곁을 지키는 잿빛 기사를 쓰러뜨리고, 그들이 남기는 재를 여섯 줌 모아 오게. 봉인을 다시 세우는 데 쓰겠네.',done:'충분하네. 이 재로 봉인의 원을 그릴 수 있겠어.',
  goals:[{type:'get',k:['wraith','ashknight'],p:.45,n:6,item:'망령의 재',d:'망령·잿빛 기사를 쓰러뜨려 망령의 재 모으기'}],rw:{xp:1.3,gold:600,item:1}},
 {town:'arden',lvl:25,t:'재의 사도',say:'북서쪽 재의 성소. 사도 모르가스가 그곳에서 마지막 문을 열려 하네. 타락한 세렌과 재의 대주교가 그를 지키고 있지. 이 싸움이 끝나면 세상은 자네 이름을 기억할 걸세.',done:'해냈군! 사도의 재가 바람에 흩어졌네. 하지만 그가 연 문틈으로 먼 땅의 기운이 흘러들고 있어… 그 이야기는 다음에 하세. 이 상을 받게.',
  goals:[{type:'kill',k:['m_seren','m_archbishop'],n:2,d:'타락한 세렌과 재의 대주교 처치'},{type:'kill',k:['b_morgath'],n:1,d:'재의 사도 모르가스 처치'}],rw:{xp:2,gold:1500,item:3,sp:1,ap:5}},
];
const qState=()=>{if(!P.q||typeof P.q!=='object')P.q={i:0,st:0,c:{}};if(!P.q.c)P.q.c={};return P.q};
const qCur=()=>QUESTS[qState().i]||null;
const qKey=(g,j)=>'g'+j;
function qGoalDone(q,j){const g=q.goals[j];return g.type==='talk'||g.type==='reach'?!!P.q.c[qKey(g,j)]:(P.q.c[qKey(g,j)]||0)>=g.n}
function qAllDone(q){return q.goals.every((_,j)=>qGoalDone(q,j))}
// 처치 보상 때 불린다 (같이 하기에서도 각자 화면에서 센다)
function questKill(e){const st=qState(),q=qCur();if(!q||st.st!==1)return;let ch=false;
  q.goals.forEach((g,j)=>{if(!g.k||!g.k.includes(e.k)||qGoalDone(q,j))return;
    if(g.type==='kill'){st.c[qKey(g,j)]=(st.c[qKey(g,j)]||0)+1;ch=true}
    else if(g.type==='get'&&R()<g.p){st.c[qKey(g,j)]=(st.c[qKey(g,j)]||0)+1;ch=true;ftext(e.x,e.y,g.item,'#ffd98a',false,e.r*2+30)}});
  if(ch){questHud();if(qAllDone(q)){st.st=2;const tw=ALLTOWNS.find(t=>t.id===qTurnTown(q));msg(`의뢰 「${q.t}」 목표를 모두 이뤘습니다. ${tw?tw.n:''}의 ${QNPC[qTurnTown(q)].n}에게 알리세요`,'#ffd98a');save()}}}
const qTurnTown=q=>{const t=q.goals.find(g=>g.type==='talk');return t?t.town:q.town};
// 의뢰인 위치와 그림
TOWNS.forEach(t=>{t.npc={x:t.x-125,y:t.y-45}});
TOWNS.forEach(t=>{const d={x:t.npc.x,y:t.npc.y,k:'npc',s:1,v:0,town:t,light:120};decor.push(d);LIGHTS.push(d)});
const NPCFIG={};
// 이름 · ! ? · 말풍선은 모든 그림 뒤(어둠 위)에 따로 그린다: 건물에 가리지 않게 (town.js)
const QLBL=[];
function drawNpc(d){const s=d._s,t=d.town,N=QNPC[t.id];if(!N)return;
  const f=NPCFIG[t.id]||(NPCFIG[t.id]={cls:N.cls,gear:{robe:{rar:N.rar},staff:{rar:N.rar}},face:N.face,moving:false,walk:0,hp:1,max:1});
  f.face=N.face+Math.sin(time*.4+t.x)*.25;
  drawFigure(ctx,f,s.x,s.y,1);
  const q=qCur(),st=qState().st;let mark='';
  if(q){if(st===0&&q.town===t.id)mark='!';else if(st===2&&qTurnTown(q)===t.id)mark='?';else if(st===1&&q.goals.some((g,j)=>g.type==='talk'&&g.town===t.id&&!qGoalDone(q,j)))mark='?'}
  QLBL.push({x:s.x,y:s.y-82,n:N.n,mk:mark,c:'#ffe6a8',big:1,main:1})}
// 의뢰 창
let qTown=null;
function questHtml(){const t=qTown,N=QNPC[t.id],q=qCur(),st=qState();
  let h=`<p class="qsay"><b>${N.n}</b></p>`;
  if(!q){h+='<p class="qsay">「재의 사도가 쓰러진 뒤로 세상이 조금 조용해졌네. 다음 이야기는 먼 땅에서 들려올 걸세.」</p><p class="muted">1막의 의뢰를 모두 마쳤습니다.</p>';return h}
  if(st.st===0&&q.town===t.id){h+=`<h2>${q.t} <span class="muted">권장 레벨 ${q.lvl}</span></h2><p class="qsay">「${q.say}」</p>${qGoalsHtml(q)}${qRewardHtml(q)}<div class="row"><button class="primary" type="button" data-qacc="1">의뢰 받기</button></div>`}
  else if(st.st===2&&qTurnTown(q)===t.id){h+=`<h2>${q.t}</h2><p class="qsay">「${q.done}」</p>${qRewardHtml(q)}<div class="row"><button class="primary" type="button" data-qdone="1">보상 받기</button></div>`}
  else if(st.st===0){const tw=ALLTOWNS.find(x=>x.id===q.town);h+=`<p class="qsay">「지금은 부탁할 일이 없다네. ${tw.n}의 ${QNPC[q.town].n}에게 가 보게.」</p>`}
  else{h+=`<h2>${q.t} <span class="muted">진행 중</span></h2><p class="qsay">「아직 할 일이 남았네. 힘내게.」</p>${qGoalsHtml(q)}`}
  return h}
function qGoalsHtml(q){return '<ul class="qgoals">'+q.goals.map((g,j)=>{const ok=qGoalDone(q,j),c=P.q.c[qKey(g,j)]||0;
  return `<li class="${ok?'ok':''}">${ok?'✓':'○'} ${g.d}${g.type==='talk'||g.type==='reach'?'':` <b>${Math.min(c,g.n)}/${g.n}</b>`}</li>`}).join('')+'</ul>'}
function qRewardHtml(q){const r=q.rw,a=[`경험치 ${qXp(q).toLocaleString()}`,`금화 ${r.gold}`];
  if(r.item)a.push(r.item>=2?'유니크·세트 장비':'좋은 장비');if(r.item>=3)a.push('상급 유니크');if(r.pot)a.push(`물약 ${r.pot}개씩`);if(r.sp)a.push(`<b style="color:#ffd76a">스킬 포인트 +${r.sp}</b>`);if(r.ap)a.push(`<b style="color:#ffd76a">능력치 포인트 +${r.ap}</b>`);
  return `<p class="muted">보상: ${a.join(' · ')}</p>`}
/* v24(사용자 2026-10-10 06:06 「50레벨 이상에서 퀘스트 보상 경험치는 적정 레벨 필요 경험치의 최대 10% 미만」):
   적정 레벨(q.lvl) 50 이상 의뢰는 보상 경험치 = 그 레벨 필요 경험치(v24 곡선) × 비율, 비율은 rw.xp에 비례하되 9.5%를 넘지 않음.
   주 의뢰 4.5%×rw.xp · 마을 의뢰 · 시험 3.5%×rw.xp · 3막 의뢰는 덤(+50%)까지 합쳐 9.5% 아래. 49레벨 이하는 예전 그대로. 진행 중 의뢰도 받을 때 이 값으로 계산(저장에 값 없음) */
const QXP24_LV=50,QXP24_MAX=.095;
const qxp24=(q,per)=>{const L=Math.max(1,q.lvl);if(L<QXP24_LV)return null;const top=q.a3?QXP24_MAX/1.5:QXP24_MAX;return Math.round(xpNeed(L)*Math.min(top,per*(q.rw.xp||1)*(q.a3?1/1.5:1)))};
const qXp=q=>{const v=qxp24(q,.045);return v!=null?v:Math.round(xpNeed(Math.max(1,q.lvl))*.45*q.rw.xp)};
function questAccept(){const st=qState(),q=qCur();if(!q||st.st!==0)return;st.st=1;st.c={};msg(`의뢰를 받았습니다: ${q.t}`,'#ffd98a');questHud();save()}
function questFinish(){const st=qState(),q=qCur();if(!q)return;const r=q.rw;
  gainXp(qXp(q));P.gold+=r.gold;if(r.pot){P.pot.hp+=r.pot;P.pot.mp+=r.pot}if(r.sp)P.sp+=r.sp;if(r.ap)P.ap+=r.ap;
  const L=Math.max(q.lvl,P.lvl-2),give=it=>{if(P.bag.length<BAG_MAX){P.bag.push(it);msg(`보상: ${it.name}`,RAR[it.rar].c)}else loot.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),kind:'item',item:it,t:0,keep:1})};
  if(r.item===1)give(makeItem(L,true));if(r.item>=2)give(makeItem(L,true,null,R()<.5?'uniq':'set'));if(r.item>=3)give(makeItem(L+2,true,null,'boss'));
  banner={t:`의뢰 완료 · ${q.t}`,sub:`경험치 ${qXp(q).toLocaleString()} · 금화 ${r.gold}${r.sp?` · 스킬 포인트 +${r.sp}`:''}`,col:'#ffd98a',life:2.6,max:2.6};
  burst(P.x,P.y,'#ffd98a',40,160,3,30);st.i++;st.st=0;st.c={};
  // 바로 이어지는 의뢰가 같은 마을이면 이어서 보여 준다
  questHud();save()}
// 오른쪽 위 의뢰 알림판: 1막 + 마을 의뢰. 제목 줄 단추로 접고 펼친다 (P.sq.hide), 일지(L) 단추
{const st=document.createElement('style');st.textContent=`#qhud .qh-top{display:flex;gap:4px;justify-content:space-between;align-items:center;margin-bottom:1px}#qhud button{pointer-events:auto;font:inherit;font-size:11px;color:#ffd98a;background:rgba(40,32,22,.9);border:1px solid #6c5634;border-radius:3px;padding:2px 6px;cursor:pointer;min-height:22px}#qhud .qh-b{border-top:1px solid rgba(92,74,46,.6);padding-top:3px;display:flex;flex-direction:column;gap:1px}#qhud .qh-b.side b{color:#9fe0ff}#qhud .qh-w{color:#b8ad94;font-size:11px}#qhud.fold{width:auto}.qlog{border:1px solid #4a3c26;border-radius:3px;padding:6px 9px;margin:6px 0;background:rgba(30,24,16,.5)}.qlog .row{margin-top:4px}
@media (max-width:640px){#qhud{max-height:34vh;overflow:hidden}#qhud .qh-w{font-size:10px}#qhud .qh-b.more{display:none}}`;document.head.appendChild(st)}
function questHud(){let el=document.getElementById('qhud');
  if(!el){el=document.createElement('div');el.id='qhud';document.body.appendChild(el);
    el.addEventListener('pointerdown',e=>{if(e.target.closest('button'))e.stopPropagation()});
    el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();
      if(b.dataset.sqtrack){const s=sqState();s.hide=s.hide?0:1;questHud();if(!panel.hidden&&tab==='quest')renderPanel();save()}else if(b.dataset.sqlog)sqOpenLog()})}
  if(!P||!P.q){el.hidden=true;return}
  const bl=[],m=qHudBlock();if(m)bl.push(m);bl.push(...sqHudBlocks());
  if(!bl.length){el.hidden=true;return}el.hidden=false;const hide=!!(P.sq&&P.sq.hide),mob=innerWidth<=640;
  let h=`<div class="qh-top"><button type="button" data-sqtrack="1" title="알림판 접기/펼치기">${hide?'▸':'▾'} 의뢰 ${bl.length}</button><button type="button" data-sqlog="1" title="의뢰 일지">일지 (L)</button></div>`;
  if(!hide)h+=bl.map((b,i)=>`<div class="qh-b${b.side?' side':''}${mob&&i>=2?' more':''}"><b>${b.t}</b>${b.w?`<span class="qh-w">📍 ${b.w}</span>`:''}${b.g.map(x=>`<span class="${x.ok?'ok':''}">${x.ok?'✓':'·'} ${x.s}</span>`).join('')}</div>`).join('')+(mob&&bl.length>2?`<span class="qh-w">… 그 밖에 ${bl.length-2}개 (일지)</span>`:'');
  el.classList.toggle('fold',hide);if(el._h!==h){el._h=h;el.innerHTML=h}}
// 알림판 한 덩이: {t: 제목, w: 어디로, g:[{s: 할 일, ok}]}
function qHudBlock(){const q=qCur(),st=qState();if(!q)return null;const w=qWhereText(qMainTargetW());
  if(st.st===0)return{t:`1막 · ${q.t}`,w,g:[{s:`${QNPC[q.town].n}에게 의뢰 받기 (!)`,ok:false}]};
  if(st.st===2)return{t:`1막 · ${q.t}`,w,g:[{s:`${QNPC[qTurnTown(q)].n}에게 돌아가기`,ok:true}]};
  return{t:`1막 · ${q.t}`,w,g:q.goals.map((g,j)=>{const ok=qGoalDone(q,j),c=P.q.c[qKey(g,j)]||0;return{s:g.d+(g.type==='talk'||g.type==='reach'?'':` ${Math.min(c,g.n)}/${g.n}`),ok}})}}
// 대화 목표: 그 마을 의뢰인 앞에서 F → 대화 완료 (목표가 대화 하나뿐이면 바로 보상)
function questTalk(t){qTown=t;const st=qState(),q=qCur();
  if(q&&st.st===1)q.goals.forEach((g,j)=>{if(g.type==='talk'&&g.town===t.id&&!qGoalDone(q,j)){st.c[qKey(g,j)]=1;if(qAllDone(q))st.st=2;save()}});
  openPanel('quest');questHud()}
function questClick(b){if(b.dataset.qacc){questAccept();renderPanel();return true}if(b.dataset.qdone){questFinish();renderPanel();return true}return false}
// 목표 자리 (월드 기준 {reg,x,y,room?,door?,cave?,label}) 와 지금 있는 곳에서 그리로 가는 길
// 다른 지역이면 REGIONS 연결을 따라 다음 지역으로 가는 맵 끝 포탈, 던전 안이면 나가는 문, 건물 안이면 문
function regHop(a,b){if(a===b)return b;const prev={[a]:null},Q=[a];
  while(Q.length){const c=Q.shift();const E=REGIONS[c]&&REGIONS[c].edges;if(!E)continue;for(const sd in E){const n=E[sd];if(n in prev)continue;prev[n]=c;if(n===b){let x=n;while(prev[x]!==a)x=prev[x];return x}Q.push(n)}}return null}
function regPath(a,b){const out=[a];let c=a,g=0;while(c!==b&&g++<12){c=regHop(c,b);if(!c)break;out.push(c)}return out}
function qRoute(tg){if(!tg)return null;
  if(DG){if(tg.cave!=null&&tg.cave===DG.ci)return null;return DG.portals.find(p=>p.exit)||null}
  if(IN){if(tg.room===IN.rid&&(tg.reg||'home')===REG.id)return{x:tg.x,y:tg.y};return IN.exit}
  if((tg.reg||'home')!==REG.id){const h=regHop(REG.id,tg.reg||'home');return EDGES.find(e=>e.to===h)||EDGES[0]||null}
  if(tg.room&&tg.door)return tg.door;return tg}
// 남부(홈) 땅의 몬스터 레벨 (지금 어느 지역에 있든 홈 마을 기준)
function qHomeLvl(x,y){let l=99,n=null,nd=1e9;for(const t of HOME.towns){const d=Math.hypot(x-t.x,y-t.y);if(d<nd){nd=d;n=t}l=Math.min(l,t.base+Math.max(0,d-SAFE)/ZSTEP)}return{l,n,nd}}
function qHomeZone(h){const l=h.l,t=h.n;if(l<t.base+3)return t.area;return l>=30?'재의 심연':l>=24?'재의 황야':l>=18?'노르반 폐허':l>=12?'잿빛 폐허':l>=7?'속삭이는 갈대 늪':l>=4?'안개숲':t.area}
const QDIR=['동','남동','남','남서','서','북서','북','북동'];
function qPlace(x,y){const h=qHomeLvl(x,y),t=h.n;if(h.nd<SAFE)return t.n;const dx=x-t.x,dy=y-t.y,a=Math.atan2((dx+dy)/2,dx-dy),i=((Math.round(a/(Math.PI/4))%8)+8)%8;return `${t.n} ${QDIR[i]}쪽 ${qHomeZone(h)}`}
// 그 몬스터가 나오는 들판 자리: 의뢰 마을에서 가장 가까운, 레벨이 맞는 곳 (한 번 구해 두고 쓴다)
const QZC={};
function qZone(kinds,townId){const k=(kinds||[]).find(k=>TYPES[k]&&!TYPES[k].mini&&!TYPES[k].boss);const T=k&&TYPES[k];if(!T)return null;const key=k+'/'+townId;if(QZC[key])return QZC[key];
  const L=T.min+1,t0=HOME.towns.find(t=>t.id===townId)||HOME.towns[0];let best=null,bs=1e9;
  for(let a=0;a<48;a++){const an=a/48*6.283;for(let d=SAFE+80;d<3000;d+=60){const x=t0.x+Math.cos(an)*d,y=t0.y+Math.sin(an)*d;if(x<250||y<250||x>WORLD-250||y>WORLD-250)break;const h=qHomeLvl(x,y);if(h.nd<tSafe(h.n)+60)continue;
    if(h.l>=L){const sc=d+300*Math.max(0,h.l-(L+2));if(sc<bs){bs=sc;best={x,y}}break}}}
  if(!best)return null;return QZC[key]={x:best.x,y:best.y,label:`${qPlace(best.x,best.y)} · ${T.n} 출몰`,zone:1}}
function qWhereText(tg){if(!tg)return '';const path=regPath(REG.id,tg.reg||'home').map(id=>REGIONS[id].n);let pre='';
  if(DG&&!(tg.cave!=null&&tg.cave===DG.ci))pre=`${DG.d.n} 밖 → `;if(IN&&tg.room!==IN.rid)pre=`${IN.R.n} 밖 → `;
  return pre+path.join(' → ')+' · '+(tg.label||qPlace(tg.x,tg.y))}
function qMainTargetW(){const q=qCur(),st=qState();if(!q)return null;const npc=id=>{const t=HOME.towns.find(t=>t.id===id);return t&&t.npc?{reg:'home',x:t.npc.x,y:t.npc.y,label:`${t.n} · ${QNPC[id].n}`}:null};
  if(st.st===0)return npc(q.town);if(st.st===2)return npc(qTurnTown(q));
  for(let j=0;j<q.goals.length;j++){if(qGoalDone(q,j))continue;const g=q.goals[j];
    if(g.type==='talk')return npc(g.town);
    const ci=HOME.caves.findIndex(c=>[...c.cave.minis,c.cave.boss].some(k=>g.k.includes(k)));
    if(ci>=0){const c=HOME.caves[ci];return{reg:'home',x:c.x,y:c.y,cave:ci,label:`${qPlace(c.x,c.y)} · 던전 「${c.cave.n}」`}}
    const z=qZone(g.k,q.town);if(z)return{reg:'home',...z}}
  return null}
// 미니맵 표시: 지금 가야 할 곳 (지금 보고 있는 맵 기준 좌표)
function questTarget(){return qRoute(qMainTargetW())}
