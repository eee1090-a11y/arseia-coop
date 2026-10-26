/* ---------- v45 휴대폰 플레이 개선 2 (사용자 2026-10-24 14:37Z 「지금까지 제안된 것 모두 반영해줘. 모바일 최적화는 7, 16, 18 빼고 반영해줘」) ----------
   제안서 「휴대폰 플레이 개선 제안 2」의 1~6 · 8~15 · 17번과 지난번 제안의 8 · 9 · 10번. 저장 형식 · 게임 수치 · 맞히기 판정은 그대로.
   1  저절로 걷기: 의뢰 알림판의 「▶ 가기」, 지역 지도(M)에서 누른 곳 · 의뢰 표시. 길 안내(guide22 qgLocal)가 가리키는 곳으로 길을 찾아(A* 32칸 · 던전은 dg 흐름) 걷는다.
      맵 끝 포탈 · 건물 문 · 던전 나가는 문은 저절로 넘어가고, 사람이면 town22 tw22Do로 말을 건다. 몬스터 목표 · 던전 입구 · 그냥 자리는 다 오면 멈춘다(던전은 스스로 안 들어감).
      멈춤: 조이스틱 · 방향키 · 화면을 누름 · 창이 열림 · 쓰러짐 · 적이 나를 노림(M43 싸움 판정) · 길이 막혀 세 번 다시 찾아도 못 감 · 위 가운데 「멈춤」 단추.
   2  마을 사람 누르기(v22 town22에 이미 있음): 멀면 걷던 것을 1의 길찾기로 바꿈(곧게만 가다 막히면 멈추던 것) · 누른 사람 발밑에 잠깐 고리.
   3  장비 끌려오기: 설정 「장비 줍기」 [전부 · 마법 이상(처음) · 희귀 이상 · 손으로만]. 고른 등급 이상 장비가 금화처럼 110 안에서 끌려와 주워짐. 가방이 가득이면 안 끌려옴.
   4  더 좋은 장비 쪽지: 주운 장비가 입을 수 있고 지금 것보다 좋으면(itemScore · 원래 「지금보다 좋음」과 같은 판단) 「착용 · 닫기」 쪽지. 싸우는 중엔 끝날 때까지 기다림 · 여러 개면 묶음.
   5  땅 마법 끌어 놓기(휴대폰 손가락): 땅에 까는 마법(R22_GND) · 이동 기술(R22_MOVE) · 광선류(R22_LEN) · 그 밖의 겨누는 마법(b3 AIMED: 화살 · 연쇄 · 부채꼴 = mobile-ux-3 HANDOFF-4 P2) 칸을 누른 채 12px 넘게 끌면 땅 · 이동 기술은 사거리 안 고리, 방향 기술은 사거리 끝까지 화살표. 떼면 그곳(그쪽)에 시전.
      화면↔세계 바꾸기는 rel() · W2S · CZ로만(확대 · 축소 0.72~1.15 · 손가락 확대에도 맞음).
      손을 원래 칸 위에서 떼면 취소. 살짝 누르기는 예전 그대로(가장 가까운 적). 사거리는 range22 그대로(넘으면 끝에 놓임).
   6  노릴 적 고정: 적을 톡 누르면 그 적만 노림(aimPoint) · 발밑 붉은 고리 · 위 적 이름 칸에 「고정」. 죽음 · 멀어짐(900) · 지역 바뀜 · 빈 땅 톡 누름이면 풀림.
   8  단추 크기 [작게 38 · 보통 44 · 크게 52] · 싸울 때 단추 비치기 [끔 · 켬] (휴대폰 단축바).
   9  재사용 대기 남은 초를 칸 가운데 숫자로(1초 넘을 때) · 끝나는 순간 칸 테두리 한 번 반짝(물약 칸도).
   10 화면 밖에서 맞으면 그쪽 가장자리에 붉은 부채꼴 1초 · 화면 밖 보스(1500 안)는 붉은 화살표 · 같이 하기 동료(같은 곳)는 파란 화살표와 이름.
   11 같이 하기 빠른 말: 파티 중(대화 서버)일 때 「말」 단추 → 짧은 말 8개. 파티 대화로 보냄(옛 서버면 전체). 머리 위 말풍선은 chat19 그대로.
   12 동료 따라 걷기: 파티 창 동료 칸의 「따라가기」 → 같은 곳에 있는 동안 110 뒤를 따라 걸음. 싸우는 동안은 서서 기다림.
   13 혼자 할 때 다른 앱에 갔다(1.5초 넘게) 돌아오면 「잠깐 멈췄어요 · 눌러서 계속」. 같이 하기 중엔 멈추지 않음.
   14 절전 화면(휴대폰 · 설정에서 끌 수 있음): 안전한 곳(마을 · 건물 안)에서 3분 손을 안 대면 화면을 어둡게 덮고 1초에 5번만 그림. 누르면 바로 돌아옴.
   15 글자 크기 [보통 · 조금 크게 1.12 · 크게 1.25]: 창 내용 · 의뢰 알림판 · 설명 쪽지 · 설정 · 대화 글만(게임 화면 속 글자는 그대로).
   17 단축칸 묶음 1 · 2 · 3: 설정에서 고르면 지금 칸 배치(추가 단축바 포함)를 그 묶음에 두고 고른 묶음을 꺼냄. 싸우는 중엔 못 바꿈. 캐릭터마다 저장(b45, 묶음을 바꾼 적이 있을 때만).
   지난번 8 게임 중 화면 꺼짐 막기(휴대폰 · 설정에서 끌 수 있음 · 절전 화면 10분 뒤엔 놓아 줌) · 9 「이야기 · 짝문 열기」 단추를 가로 휴대폰 오른쪽 아래로 · 10 지역 지도의 ! ? 를 한 곳에 묶어 「! 3」 · 누르면 목록.
   기기 설정은 'arseia-device-v45' 한 키(캐릭터 키와 상관없음). 캐릭터 저장은 b45(묶음) 하나만 덧붙이고 없으면 예전 그대로.
   붙는 곳: bar44.js 다음, b5.js 앞(qa.js보다 앞). b5.js의 let/const(panel · rel · el …)는 함수 안에서만(시작 뒤) 쓴다. */
const M45={key:'arseia-device-v45',dev:{pick:1,bs:1,bo:0,fs:0,ps:1,wl:1},
  PICK:[[-1,'손으로만'],[0,'전부'],[1,'마법 이상'],[2,'희귀 이상']],BS:[38,44,52],FS:[1,1.12,1.25],
  MAG_R:110,AIM_MIN:12,AIM_FULL:110,LOCK_FAR:900,PS_MS:180000,PS_WL_MS:600000,AWAY_MS:1500,
  hits:[],eq:[],eqT:0,lock:null,aim:null,tap:null,awayT:0,psOn:0,psT:0,wl:null,wlBusy:0,cdWas:new WeakMap(),pause:0,
  QC:['도와줘!','물약이 없어','마나가 없어','보스 간다!','잠깐 기다려','여기로 와','고마워','좋아!'],
  wm:null};
const AW={on:null};
try{if(!window.__QA){const o=JSON.parse(localStorage.getItem(M45.key)||'null');if(o&&typeof o==='object')m45DevClean(o)}}catch(_){}
function m45DevClean(o){const d=M45.dev;if(M45.PICK.some(p=>p[0]===o.pick))d.pick=o.pick;for(const k of ['bs','fs'])if([0,1,2].includes(o[k]))d[k]=o[k];for(const k of ['bo','ps','wl'])if(o[k]===0||o[k]===1)d[k]=o[k];return d}
function m45DevSave(){if(window.__QA)return;try{localStorage.setItem(M45.key,JSON.stringify(M45.dev))}catch(_){}}
const m45Phone=()=>typeof M22==='object'&&M22.phone();
const m45InGame=()=>{const it=document.getElementById('intro');return !!(P&&P.cls&&(!it||it.hidden))};

/* ===== 1 저절로 걷기 ===== */
// 걸을 수 있는 자리(들판 · 마을): 막힌 땅 · 물 · 건물 발자국이 아니면 (town22 tw22WalkAt)
const m45Free=(x,y)=>tw22WalkAt(x,y);
function m45Los(a,b){const L=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(L/12));for(let i=1;i<=n;i++){const t=i/n;if(!m45Free(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t))return false}return true}
// A*: 32칸 · 시작과 목표를 둘러싼 상자(+600) 안에서 · 4만 칸까지. 못 찾으면 null
function m45Path(x0,y0,x1,y1){const G=32,N=Math.ceil(WORLD/G),M=600;
  const bx0=Math.max(0,Math.floor((Math.min(x0,x1)-M)/G)),by0=Math.max(0,Math.floor((Math.min(y0,y1)-M)/G)),bx1=Math.min(N-1,Math.floor((Math.max(x0,x1)+M)/G)),by1=Math.min(N-1,Math.floor((Math.max(y0,y1)+M)/G));
  const memo=new Map(),free=(i,j)=>{if(i<bx0||j<by0||i>bx1||j>by1)return false;const k=j*N+i;let v=memo.get(k);if(v===undefined){v=m45Free(i*G+G/2,j*G+G/2);memo.set(k,v)}return v};
  const si=Math.floor(x0/G),sj=Math.floor(y0/G);let gi=Math.floor(x1/G),gj=Math.floor(y1/G);
  if(!free(gi,gj)){let b=null,bd=1e9;for(let r=1;r<=6&&!b;r++)for(let i=gi-r;i<=gi+r;i++)for(let j=gj-r;j<=gj+r;j++){if(!free(i,j))continue;const d=Math.hypot(i-gi,j-gj);if(d<bd){bd=d;b=[i,j]}}if(!b)return null;gi=b[0];gj=b[1]}
  const sk=sj*N+si,gk=gj*N+gi;if(sk===gk)return[{x:x1,y:y1}];
  const h=(i,j)=>{const dx=Math.abs(i-gi),dy=Math.abs(j-gj);return Math.max(dx,dy)+.414*Math.min(dx,dy)};
  const gS=new Map([[sk,0]]),came=new Map(),heap=[[h(si,sj),sk]],shut=new Set();let n=0,found=false;
  const push=e=>{heap.push(e);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p][0]<=heap[i][0])break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p}};
  const pop=()=>{const t=heap[0],l=heap.pop();if(heap.length){heap[0]=l;let i=0;for(;;){const a=2*i+1,b=a+1;let m=i;if(a<heap.length&&heap[a][0]<heap[m][0])m=a;if(b<heap.length&&heap[b][0]<heap[m][0])m=b;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];i=m}}return t};
  while(heap.length&&n++<40000){const [,k]=pop();if(shut.has(k))continue;if(k===gk){found=true;break}shut.add(k);const i=k%N,j=(k-i)/N,g0=gS.get(k);
    for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const a=i+di,b=j+dj;if(!free(a,b))continue;if(di&&dj&&(!free(i+di,j)||!free(i,j+dj)))continue;
      const nk=b*N+a,ng=g0+(di&&dj?1.414:1);if(ng<(gS.has(nk)?gS.get(nk):1e9)){gS.set(nk,ng);came.set(nk,k);push([ng+h(a,b),nk])}}}
  if(!found)return null;const cells=[];for(let k=gk;k!=null&&k!==sk;k=came.get(k))cells.push(k);cells.reverse();
  const pts=cells.map(k=>{const i=k%N;return{x:i*G+G/2,y:(k-i)/N*G+G/2}});if(m45Free(x1,y1))pts[pts.length-1]={x:x1,y:y1};
  // 곧게 갈 수 있는 점은 건너뛴다
  const out=[];let cur={x:x0,y:y0},i=0;while(i<pts.length){let j=pts.length-1;while(j>i&&!m45Los(cur,pts[j]))j--;out.push(pts[j]);cur=pts[j];i=j+1}
  return out}
// a: {kind:'quest',id} · {kind:'spot',reg,x,y,label} · {kind:'tw',d} · {kind:'follow',pid}
function m45Walk(a,quiet){m45Stop(true);if(!P||P.dead||!a)return false;if(typeof T22==='object'&&T22.go)tw22Stop();
  AW.on=Object.assign({t:0,best:1e9,stuck:0,fails:0,path:null,pi:0,pk:'',reg:REG.id,dg:!!DG,inn:!!IN,start:performance.now()},a);
  const g=m45Goal(AW.on);if(!g){AW.on=null;if(!quiet)msg('갈 곳을 찾지 못했어요','#a39d8f');return false}
  if(!quiet&&a.kind!=='tw')msg(a.kind==='follow'?`${g.label}님을 따라 걷습니다`:`저절로 걷기: ${g.label}`,'#ffd98a');m45AwEl();return true}
function m45Stop(quiet,why){const was=AW.on;AW.on=null;if(joy&&joy.id==='aw45')joy=null;if(was&&!quiet&&why)msg(why,'#a39d8f');m45AwEl();return !!was}
const m45QuestGoal=id=>{if(!qgValid(id))return null;const l=qgLocal(id);return l?Object.assign({},l,{label:l.label||qgName(id)}):null};
// 지금 갈 자리 {x,y,kind,label}
function m45Goal(a){
  if(a.kind==='quest')return m45QuestGoal(a.id);
  if(a.kind==='spot')return (a.reg===REG.id&&!DG&&!IN)?{x:a.x,y:a.y,kind:'spot',label:a.label||'고른 곳'}:null;
  if(a.kind==='tw'){const d=a.d,L=IN?IN.list:decor;return d&&L.includes(d)?{x:d.x,y:d.y,kind:'tw',label:d.n||'사람'}:null}
  if(a.kind==='follow'){const r=NET.on&&NET.peers.get(a.pid);return r&&!r.dead&&netSame(r)?{x:r.x,y:r.y,kind:'follow',label:r.name||'동료'}:null}
  return null}
// 다 왔을 때 할 일. true면 걷기를 끝낸다
function m45Arrive(a,g,d){
  if(g.kind==='edge'){if(act==='edge'&&actEdge&&(actEdge.to===g.to||Math.hypot(actEdge.x-g.x,actEdge.y-g.y)<60)){a.path=null;a.best=1e9;a.fails=0;doAct();return false}return false}
  if(g.kind==='exit'){if(act==='exit'||act==='tw_leave'){a.path=null;a.best=1e9;doAct();return false}return false}
  if(g.kind==='door'){const o=TW.act,od=o&&(o.door||o);if(act==='tw_enter'&&od&&Math.hypot(od.x-g.x,od.y-g.y)<60){a.path=null;a.best=1e9;doAct();return false}return false}
  if(g.kind==='tw'){if(d<=tw22Reach(a.d)-4){m45Stop(true);tw22Do(a.d);return true}return false}
  if(g.kind==='npc'){if(d>170)return false;const L=IN?IN.list:decor;let b=null,bd=90;for(const o of L){if(o.k!=='tfolk'&&o.k!=='npc')continue;if(!tw22Box(o,true))continue;const dd=Math.hypot(o.x-g.x,o.y-g.y);if(dd<bd){bd=dd;b=o}}
    if(b&&tw22Can()){if(dist(P,b)<=tw22Reach(b)-4){m45Stop(true);tw22Do(b);return true}a.kind='tw';a.d=b;a.path=null;return false}
    if(d<70){m45Stop(true);msg(`${g.label} 앞에 왔어요`,'#ffd98a');return true}return false}
  if(g.kind==='mob'){if(d<300){m45Stop(true);msg(`${g.label} 가까이 왔어요`,'#ffd98a');return true}return false}
  if(g.kind==='cave'){if(act==='dungeon'||d<70){m45Stop(true);msg('던전 입구에 왔어요. 들어가려면 「들어가기」를 누르세요','#ffd98a');return true}return false}
  if(g.kind==='follow')return false;
  if(d<60){m45Stop(true);msg('도착했어요','#ffd98a');return true}return false}
function m45AwTick(dt){const a=AW.on;if(!a)return;
  const mv=keys.has('KeyW')||keys.has('KeyA')||keys.has('KeyS')||keys.has('KeyD')||keys.has('ArrowUp')||keys.has('ArrowDown')||keys.has('ArrowLeft')||keys.has('ArrowRight');
  if(!P||P.dead||paused||(typeof panel!=='undefined'&&!panel.hidden)||mv||(joy&&joy.id!=='aw45')){m45Stop(true);return}
  if(a.kind==='spot'&&a.reg!==REG.id){m45Stop(true);return}
  const fight=typeof m43Fight==='function'&&m43Fight();
  if(fight&&a.kind!=='follow'){m45Stop(false,'적이 다가와 저절로 걷기를 멈췄어요');return}
  if(REG.id!==a.reg||!!DG!==a.dg||!!IN!==a.inn){a.reg=REG.id;a.dg=!!DG;a.inn=!!IN;a.path=null;a.best=1e9;a.stuck=0;a.fails=0}
  const g=m45Goal(a);if(!g){m45Stop(false,a.kind==='follow'?'따라가던 동료가 다른 곳으로 가서 멈췄어요':a.kind==='quest'?'':'갈 곳이 없어졌어요');return}
  const d=Math.hypot(g.x-P.x,g.y-P.y);
  if(a.kind==='follow'&&(d<110||fight)){if(joy&&joy.id==='aw45')joy=null;a.best=d;a.stuck=0;return}
  if(m45Arrive(a,g,d)||!AW.on)return;
  a.t+=dt;if(d<a.best-4){a.best=d;a.stuck=0}else if((a.stuck+=dt)>2.5){a.stuck=0;a.best=1e9;a.path=null;if(++a.fails>3){m45Stop(false,'길이 막혀 더 가지 못했어요. 조금 움직인 뒤 다시 눌러 보세요');return}}
  let tx=g.x,ty=g.y;
  if(DG){const s=dgStep(P,{x:g.x,y:g.y});if(s){tx=P.x+s.x*60;ty=P.y+s.y*60}}
  else if(!IN){const pk=Math.round(g.x/48)+','+Math.round(g.y/48);if(!a.path||a.pk!==pk){a.pk=pk;a.path=m45Path(P.x,P.y,g.x,g.y)||[{x:g.x,y:g.y}];a.pi=0}
    while(a.pi<a.path.length-1&&Math.hypot(a.path[a.pi].x-P.x,a.path[a.pi].y-P.y)<22)a.pi++;const w=a.path[a.pi];if(w){tx=w.x;ty=w.y}}
  const s1=W2S(tx,ty),s0=W2S(P.x,P.y),vx=s1.x-s0.x,vy=s1.y-s0.y,l=Math.hypot(vx,vy);if(l<1){if(joy&&joy.id==='aw45')joy=null;return}
  joy={id:'aw45',ox:0,oy:0,x:vx/l*44,y:vy/l*44}}
// 위 가운데 「저절로 걷는 중 · 멈춤」
function m45AwEl(){let el=document.getElementById('m45aw');const a=AW.on;
  if(!a){if(el)el.hidden=true;return}
  if(!el){el=document.createElement('div');el.id='m45aw';el.innerHTML='<span></span><button type="button">멈춤</button>';document.body.appendChild(el);
    el.querySelector('button').addEventListener('click',e=>{e.stopPropagation();m45Stop(false,'저절로 걷기를 멈췄어요')});el.addEventListener('pointerdown',e=>e.stopPropagation())}
  const g=m45Goal(a),t=a.kind==='follow'?`${g?g.label:'동료'}님을 따라가는 중`:`저절로 걷는 중 · ${g?String(g.label).slice(0,14):''}`;const sp=el.querySelector('span');if(sp.textContent!==t)sp.textContent=t;el.hidden=!!a.tap}
// 화면을 누르면(조이스틱 · 기술) 멈춘다 · 방금 누른 것으로 시작한 걷기(마을 사람 누르기)는 그대로
cv.addEventListener('pointerdown',()=>{if(AW.on&&performance.now()-AW.on.start>80)m45Stop(true)},true);
{const _u=update;update=function(dt){if(AW.on)try{m45AwTick(dt)}catch(err){m45Stop(true);if(window.__QA)throw err}return _u.apply(this,arguments)}}
// 의뢰 알림판 덩이마다 의뢰 번호를 기억해 「▶ 가기」 단추
{const _qb=qHudBlock;qHudBlock=function(){const b=_qb.apply(this,arguments);if(b)b.qid='main:'+qState().i;return b}}
{const _sb=sqHudBlocks;sqHudBlocks=function(){const L=_sb.apply(this,arguments),s=sqState(),ids=Object.keys(s.a).filter(id=>SQBY[id]);L.forEach((b,i)=>{if(ids[i])b.qid='sq:'+ids[i]});return L}}
function m45QIds(){const out=[],m=qHudBlock();if(m)out.push(m.qid);for(const b of sqHudBlocks())out.push(b.qid);return out}
{const _qh=questHud;questHud=function(){const r=_qh.apply(this,arguments);try{m45QBtns()}catch(err){if(window.__QA)throw err}return r}}
function m45QBtns(){const el=document.getElementById('qhud');if(!el||el.hidden)return;const bs=el.querySelectorAll('.qh-b');if(!bs.length)return;const ids=m45QIds();
  bs.forEach((b,i)=>{const id=ids[i];let btn=b.querySelector('.m45go');if(!id){if(btn)btn.remove();return}
    if(!btn){btn=document.createElement('button');btn.type='button';btn.className='m45go';btn.textContent='▶ 가기';btn.title='이 의뢰가 가리키는 곳으로 저절로 걷기';b.appendChild(btn)}btn.dataset.m45go=id})}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-m45go]');if(!b)return;e.preventDefault();e.stopPropagation();m45GoQuest(b.dataset.m45go)},true);
document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('[data-m45go],.m45fol,#m45qc,#m45qcb,#m45eq'))e.stopPropagation()},false);
function m45GoQuest(id){if(!P||P.dead)return false;if(!qgValid(id)){msg('이 의뢰는 지금 갈 곳이 없어요','#a39d8f');return false}
  if(P.qg!==id)qgSet(id,true);return m45Walk({kind:'quest',id})}
// 2 마을 사람 누르기: 멀면 길을 찾아 걷는다(town22가 곧게만 가던 것)
{const _tc=tw22Click;tw22Click=function(d){if(!d||!tw22Can()){return _tc.apply(this,arguments)}M45.ring={x:d.x,y:d.y,t:.7};
  if(dist(P,d)<=tw22Reach(d)){m45Stop(true);return _tc.apply(this,arguments)}tw22Stop();m45Walk({kind:'tw',d,tap:1},true);return true}}

/* ===== 3 장비 끌려오기 · 4 더 좋은 장비 쪽지 ===== */
function m45Magnet(dt){const k=M45.dev.pick;if(k<0||!P||P.dead||P.bag.length>=BAG_MAX)return;
  for(const l of loot){if(l.kind!=='item'||l.taken||!l.item||(l.item.rar|0)<k)continue;const d=Math.hypot(P.x-l.x,P.y-l.y);if(d<M45.MAG_R&&d>1){const q=Math.min(1,dt*(260/d));l.x+=(P.x-l.x)*q;l.y+=(P.y-l.y)*q}}}
{const _u=update;update=function(dt){try{m45Magnet(dt)}catch(err){if(window.__QA)throw err}return _u.apply(this,arguments)}}
{const _pk=pickup;pickup=function(l){const r=_pk.apply(this,arguments);try{if(l&&l.kind==='item'&&l.taken&&l.item&&P.bag.includes(l.item))m45EqOffer(l.item)}catch(err){if(window.__QA)throw err}return r}}
const m45Better=it=>!!it&&P.bag.includes(it)&&canWear(it)&&itemScore(it)>itemScore(gearCur(it));
function m45EqOffer(it){if(!m45Better(it)||M45.eq.includes(it))return;M45.eq.push(it);m45EqDraw()}
function m45EqDraw(){M45.eq=M45.eq.filter(m45Better);let el=document.getElementById('m45eq');const show=M45.eq.length&&m45InGame()&&!P.dead&&!(typeof m43Fight==='function'&&m43Fight());
  if(!show){if(el)el.hidden=true;return}
  if(!el){el=document.createElement('div');el.id='m45eq';document.body.appendChild(el);
    el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();if(b.dataset.eqon)m45EqWear();else{M45.eq=[];el.hidden=true}})}
  const it=M45.eq[0],n=M45.eq.length,h=`${itemIcon(it)}<div class="m45eqt"><b style="color:${RAR[it.rar].c}">${itemName(it)}</b><small>${n>1?`좋은 장비 ${n}개 · `:''}지금보다 좋음</small></div><button type="button" data-eqon="1">착용</button><button type="button" class="ghost" data-eqx="1">닫기</button>`;
  if(el._h!==h){el._h=h;el.innerHTML=h}if(el.hidden){el.hidden=false;M45.eqT=performance.now()}}
function m45EqWear(){const it=M45.eq.shift();if(it&&m45Better(it)){const sl=gearEquip(it);if(sl){msg(`${itemName(it)} 착용`,RAR[it.rar].c);buildBar();if(typeof panel!=='undefined'&&!panel.hidden)renderPanel();save()}}m45EqDraw()}

/* ===== 5 땅 마법 끌어 놓기 (휴대폰 손가락 · 단축칸) ===== */
function m45Aimable(id){const s=SPELLS[id];if(!s||s.kind==='passive')return null;if(R22_GND.has(s.kind)&&!s.self)return'gnd';if(R22_MOVE.has(s.kind))return'move';if(R22_LEN.has(s.kind)||(AIMED.has(s.kind)&&!s.self))return'dir';return null}
function m45AimRange(id){const s=SPELLS[id];return M45.aim&&M45.aim.mode==='gnd'?r22Gnd(s):r22Cap(s)}
// 손가락이 칸에서 끌린 만큼(화면) → 세계 자리: 방향은 화면 그대로, 110px 끌면 사거리 끝
function m45AimPoint(dx,dy,R){const ps=W2S(P.x,P.y),a=S2W(ps.x,ps.y),b=S2W(ps.x+dx/CZ,ps.y+dy/CZ),wx=b.x-a.x,wy=b.y-a.y,l=Math.hypot(wx,wy)||1,k=Math.min(1,Math.hypot(dx,dy)/M45.AIM_FULL)*R;return{x:P.x+wx/l*k,y:P.y+wy/l*k}}
function m45AimDown(e){if(e.pointerType!=='touch'||!m45Phone()||M45.aim||!P||P.dead||paused)return;const b=e.target.closest&&e.target.closest('#bar button.sk[data-slot]');if(!b||bindId)return;
  const i=+b.dataset.slot,id=P.bar[i],m=id&&m45Aimable(id);if(!m)return;M45.aim={pid:e.pointerId,b,i,id,mode:m,x:e.clientX,y:e.clientY,on:false,t:null,over:true}}
function m45AimMove(e){const a=M45.aim;if(!a||a.pid!==e.pointerId)return;if(typeof FB28==='object'&&FB28.drag&&FB28.drag.on){M45.aim=null;return}/* 0.7초 꾹 눌러 단축바 옮기는 중이면 겨누지 않음 */const dx=e.clientX-a.x,dy=e.clientY-a.y;if(!a.on&&Math.hypot(dx,dy)<M45.AIM_MIN)return;a.on=true;
  const r=a.b.getBoundingClientRect();a.over=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;a.t=a.mode==='dir'?m45AimPoint(dx*1e3,dy*1e3,m45AimRange(a.id)):m45AimPoint(dx,dy,m45AimRange(a.id))}
function m45AimUp(e){const a=M45.aim;if(!a||a.pid!==e.pointerId)return;if(a.on&&e.type==='pointerup')m45AimMove(e);M45.aim=null;if(!a.on||e.type!=='pointerup')return;
  if(a.over){msg('겨눈 것을 취소했어요','#a39d8f');return}if(P.bar[a.i]!==a.id)return;castSlot(a.i,{x:a.t.x,y:a.t.y})}
// window 잡기 단계: feedback28(document)보다 먼저 본다(그쪽은 12px 넘게 끌면 누르기를 취소하고 0.7초 꾹 누르기 옮기기도 안 켬)
addEventListener('pointerdown',m45AimDown,true);addEventListener('pointermove',m45AimMove,true);addEventListener('pointerup',m45AimUp,true);addEventListener('pointercancel',m45AimUp,true);

/* ===== 6 노릴 적 고정 ===== */
const m45LockOk=e=>!!e&&!e.dead&&enemies.includes(e)&&dist(e,P)<M45.LOCK_FAR;
function m45Lock(e){M45.lock=e||null;M45.lockReg=REG.id}
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||!P)return;const p=rel(e);M45.tap={id:e.pointerId,x:p.x,y:p.y,t:performance.now()}},true);
addEventListener('pointerup',e=>{const tp=M45.tap;if(!tp||tp.id!==e.pointerId)return;M45.tap=null;if(!P||P.dead||paused)return;const p=rel(e);
  if(Math.hypot(p.x-tp.x,p.y-tp.y)>=12||performance.now()-tp.t>350)return;const en=r22Pick(p.x,p.y);
  if(en){if(M45.lock!==en){m45Lock(en);msg(`노릴 적 고정: ${TYPES[en.k]?TYPES[en.k].n:'적'} (빈 땅을 누르면 풀려요)`,'#ff9a7a')}}
  else if(M45.lock&&!m48Joy(p.x)){m45Lock(null);msg('노릴 적 고정을 풀었어요','#a39d8f')}},true);
{const _ap=aimPoint;aimPoint=function(){if(M45.lock&&!(!touchMode&&mouse.active)){const e=M45.lock;if(m45LockOk(e)&&M45.lockReg===REG.id){const C=r22Cap({cls:P.cls});if(dist(e,P)-hR(e)<=C)return{x:e.x,y:e.y}}}return _ap.apply(this,arguments)}}
function m45LockTick(){const e=M45.lock;if(e&&(!m45LockOk(e)||M45.lockReg!==REG.id))M45.lock=null}

/* ===== 9 남은 초 · 4 쪽지 · 6 고정 이름 · 13 · 14 · 지난번 8 (HUD 갱신마다) ===== */
function m45Cd(){const bar=document.getElementById('bar');if(!bar)return;const now=performance.now();
  for(const b of bar.querySelectorAll('button.sk')){let rem=0;
    if(b.dataset.slot!=null){const id=P.bar[+b.dataset.slot];if(!id)continue;rem=P.cd[id]||0}else if(b.dataset.pot==='hp'||b.dataset.pot==='mp')rem=potCdLeft(b.dataset.pot);else continue;
    let s=b.querySelector('.m45n');const t=rem>=1?(rem>=60?Math.ceil(rem/60)+'분':String(Math.ceil(rem))):'';
    if(t&&!s){s=document.createElement('span');s.className='m45n';b.appendChild(s)}if(s&&s.textContent!==t)s.textContent=t;
    const was=M45.cdWas.get(b)||0;if(was>.3&&rem<=0){b.classList.remove('m45rdy');void b.offsetWidth;b.classList.add('m45rdy');setTimeout(()=>b.classList.remove('m45rdy'),450)}M45.cdWas.set(b,rem)}}
function m45LockHud(){const e=M45.lock;if(!e||!m45LockOk(e))return;const t=TYPES[e.k];if(!t)return;const tg=document.getElementById('target');if(!tg)return;tg.hidden=false;
  document.getElementById('tname').textContent=`고정 · ${e.elite?'정예 ':''}${t.boss?'보스 · ':t.mini?'준보스 · ':''}${t.n}`;document.getElementById('tfill').style.width=clamp(e.hp/e.max*100,0,100)+'%';
  document.getElementById('tsub').textContent=`레벨 ${e.lvl} · 빈 땅을 누르면 풀려요`}
{const _uh=updateHud;updateHud=function(){const r=_uh.apply(this,arguments);try{m45LockTick();m45Cd();m45LockHud();const now=performance.now();
    if(now>=(M45.slowT||0)){M45.slowT=now+500;m45EqDraw();m45PsTick(now);m45WakeTick(now);m45Body();m45QcEl();if(AW.on)m45AwEl()}}catch(err){if(window.__QA)throw err}return r}}

/* ===== 8 단추 크기 · 비치기 · 15 글자 크기 · 지난번 9 (몸 class) ===== */
function m45Body(){const b=document.body,ph=m45Phone();for(let i=0;i<3;i++){b.classList.toggle('m45s'+i,ph&&M45.dev.bs===i);b.classList.toggle('m45f'+i,M45.dev.fs===i)}
  b.classList.toggle('m45fade',ph&&M45.dev.bo===1&&typeof m43Fight==='function'&&m43Fight());
  b.classList.toggle('m45side',!!document.querySelector('#bar .sk.s26'))}
// 가로 휴대폰 쪽 넘기기(mux43)의 한 쪽 칸 수: 칸 크기를 따른다
{const _mp=m43Per;m43Per=function(bar){const sz=M45.BS[M45.dev.bs]||44;if(sz===44||!m45Phone())return _mp.apply(this,arguments);const w=bar.parentNode&&bar.parentNode.clientWidth;if(!w)return M43.PER;
  const pots=[...bar.querySelectorAll('[data-pot]')].filter(b=>getComputedStyle(b).display!=='none').length;return Math.max(3,Math.min(M43.PER,Math.floor((w-10-(sz-1)-pots*(sz+3)+3)/(sz+3))))}}
function m45SetDev(k,v){M45.dev[k]=v;m45DevSave();m45Body();if(k==='bs'&&P&&P.cls)buildBar();if(k==='wl')m45WakeTick(performance.now(),true)}

/* ===== 10 화면 밖 방향 · 보스 · 동료 / 5 겨눔 고리 / 6 고정 고리 / 2 누른 사람 고리 ===== */
{const _hp=hitPlayer;hitPlayer=function(d,src){const h0=P.hp,r=_hp.apply(this,arguments);try{if(src&&Number.isFinite(src.x)&&P.hp<h0){const s=W2S(src.x,src.y);if(s.x<0||s.y<0||s.x>W||s.y>H){const p=W2S(P.x,P.y);M45.hits.push({a:Math.atan2(s.y-p.y,s.x-p.x),t:1});if(M45.hits.length>6)M45.hits.shift()}}}catch(err){if(window.__QA)throw err}return r}}
// 플레이어 화면 자리에서 각도 a로 나간 줄이 화면 가장자리(안쪽 m)와 만나는 곳
function m45Edge(a,m){const p=W2S(P.x,P.y),c=Math.cos(a),s=Math.sin(a);let t=1e9;if(c>1e-6)t=Math.min(t,(W-m-p.x)/c);if(c<-1e-6)t=Math.min(t,(m-p.x)/c);if(s>1e-6)t=Math.min(t,(H-m-p.y)/s);if(s<-1e-6)t=Math.min(t,(m-p.y)/s);t=Math.max(0,t);return{x:p.x+c*t,y:p.y+s*t}}
function m45Arrow(x,y,a,col,txt){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=col;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-7,-9);ctx.lineTo(-3,0);ctx.lineTo(-7,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  if(txt){ctx.font=`700 11px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';const ty=y+(y>H/2?-18:18);ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(txt,x,ty);ctx.fillStyle=col;ctx.fillText(txt,x,ty)}}
function m45Draw(){if(!P||!P.cls||!m45InGame())return;ctx.save();S();
  try{const dt=1/30;
    // 6 고정한 적 발밑
    const e=M45.lock;if(e&&m45LockOk(e)){const s=W2S(e.x,e.y),r=hR(e)+6;ctx.strokeStyle='#ff4a3a';ctx.lineWidth=2.5;ctx.globalAlpha=.85;ctx.beginPath();ctx.ellipse(s.x,s.y,r*1.25,r*.62,0,0,6.283);ctx.stroke();
      ctx.globalAlpha=1;ctx.fillStyle='#ff4a3a';const hy=s.y-(e.big?120:78)-Math.sin(time*5)*3;ctx.beginPath();ctx.moveTo(s.x,hy+10);ctx.lineTo(s.x-7,hy);ctx.lineTo(s.x+7,hy);ctx.closePath();ctx.fill()}
    // 2 누른 사람 발밑 고리
    if(M45.ring){const g=M45.ring;g.t-=dt;if(g.t<=0)M45.ring=null;else{const s=W2S(g.x,g.y);ctx.globalAlpha=Math.min(1,g.t*2);ctx.strokeStyle='#ffd98a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x,s.y,30-g.t*10,15-g.t*5,0,0,6.283);ctx.stroke();ctx.globalAlpha=1}}
    // 5 겨눔
    const a=M45.aim;if(a&&a.on&&a.t){const ps=W2S(P.x,P.y),ts=W2S(a.t.x,a.t.y),col=a.over?'#ff7a6a':'#ffd98a';ctx.strokeStyle=col;ctx.lineWidth=2;
      if(a.mode==='dir'){/* 방향 기술: 사거리 끝까지 화살표 */const an=Math.atan2(ts.y-ps.y,ts.x-ps.x);ctx.globalAlpha=.9;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(ps.x,ps.y);ctx.lineTo(ts.x-Math.cos(an)*12,ts.y-Math.sin(an)*12);ctx.stroke();
        ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(ts.x,ts.y);ctx.lineTo(ts.x-Math.cos(an-.45)*18,ts.y-Math.sin(an-.45)*18);ctx.lineTo(ts.x-Math.cos(an+.45)*18,ts.y-Math.sin(an+.45)*18);ctx.closePath();ctx.fill();ctx.globalAlpha=1;ctx.lineWidth=2}
      else{ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(ps.x,ps.y);ctx.lineTo(ts.x,ts.y);ctx.stroke();ctx.setLineDash([]);
      let rad=40;if(a.mode==='gnd'){try{const s=eff(a.id,skLv(a.id));rad=Math.max(30,Math.min(320,(s&&(s.rad||s.aoe))||60))}catch(_){}}ctx.globalAlpha=.9;ctx.beginPath();ctx.ellipse(ts.x,ts.y,rad*KI,rad*KI/2,0,0,6.283);ctx.stroke();
      ctx.globalAlpha=.18;ctx.fillStyle=col;ctx.fill();ctx.globalAlpha=1}
      if(a.over){ctx.font=`700 13px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText('여기서 떼면 취소',ps.x,ps.y-70);ctx.fillStyle=col;ctx.fillText('여기서 떼면 취소',ps.x,ps.y-70)}}
    // 10 화면 밖에서 맞음
    for(const h of M45.hits){h.t-=dt;if(h.t<=0)continue;const p=m45Edge(h.a,6);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(h.a);ctx.globalAlpha=Math.min(1,h.t*1.6)*.85;const g=ctx.createRadialGradient(0,0,2,0,0,46);g.addColorStop(0,'rgba(255,60,40,.95)');g.addColorStop(1,'rgba(255,60,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,46,Math.PI-.7,Math.PI+.7);ctx.closePath();ctx.fill();ctx.restore()}
    M45.hits=M45.hits.filter(h=>h.t>0);
    const off=(x,y)=>{const s=W2S(x,y);return s.x<-10||s.y<-10||s.x>W+10||s.y>H+10};
    // 화면 밖 보스
    for(const b of enemies){if(b.dead)continue;const t=TYPES[b.k];if(!t||!t.boss)continue;if(dist(b,P)>1500||!off(b.x,b.y))continue;const s=W2S(b.x,b.y),p=W2S(P.x,P.y),an=Math.atan2(s.y-p.y,s.x-p.x),q=m45Edge(an,22);m45Arrow(q.x,q.y,an,'#ff5a3a','보스')}
    // 화면 밖 동료
    if(NET.on)for(const r of NET.peers.values()){if(r.dead||!netSame(r)||!Number.isFinite(r.x)||!off(r.x,r.y))continue;const s=W2S(r.x,r.y),p=W2S(P.x,P.y),an=Math.atan2(s.y-p.y,s.x-p.x),q=m45Edge(an,22);m45Arrow(q.x,q.y,an,'#5ad0ff',String(r.name||'동료').slice(0,6))}
  }finally{ctx.restore()}}
{const _r=render;render=function(){const r=_r.apply(this,arguments);try{m45Draw()}catch(err){if(window.__QA)throw err}return r}}

/* ===== 11 같이 하기 빠른 말 ===== */
const m45QcOn=()=>!!(typeof CHAT==='object'&&CHAT.on()&&NET.on&&m45InGame());
function m45QcEl(){let b=document.getElementById('m45qcb');const on=m45QcOn();if(!on){if(b)b.hidden=true;const p=document.getElementById('m45qc');if(p)p.hidden=true;return}
  if(!b){b=document.createElement('button');b.type='button';b.id='m45qcb';b.className='stonebox';b.textContent='말';b.title='짧은 말 보내기 (파티)';b.setAttribute('aria-label',b.title);document.body.appendChild(b);
    b.addEventListener('click',e=>{e.stopPropagation();m45QcOpen()})}
  b.hidden=false}
function m45QcOpen(on){let p=document.getElementById('m45qc');if(!p){p=document.createElement('div');p.id='m45qc';p.hidden=true;p.innerHTML=M45.QC.map((t,i)=>`<button type="button" data-qc="${i}">${t}</button>`).join('');document.body.appendChild(p);
    p.addEventListener('click',e=>{const b=e.target.closest('[data-qc]');if(!b)return;e.stopPropagation();m45QcSend(+b.dataset.qc);p.hidden=true})}
  p.hidden=on==null?!p.hidden:!on}
function m45QcText(i){let t=M45.QC[i];if(!t)return null;if(i===5)t+=` (${zoneName(P.x,P.y)})`;return t}
function m45QcSend(i){const t=m45QcText(i);if(!t)return false;const party=NET.on&&CHAT.srv2();return CHAT.send((party?'/p ':'')+t)}
document.addEventListener('pointerdown',e=>{const p=document.getElementById('m45qc');if(p&&!p.hidden&&!e.target.closest('#m45qc,#m45qcb'))p.hidden=true},true);

/* ===== 12 동료 따라 걷기 (파티 창) ===== */
{const _fr=PUI.frames;PUI.frames=function(){let h=_fr.apply(this,arguments);try{if(NET.on)h=h.replace(/<div class="pf([^"]*)" data-pid="([^"]*)"([^>]*)><div class="pn">/g,(m,c,id,rest)=>{const r=[...NET.peers.values()].find(o=>String(o.id)===id);const can=r&&!r.dead&&netSame(r),on=AW.on&&AW.on.kind==='follow'&&String(AW.on.pid)===id;
    return can?`<div class="pf${c}" data-pid="${id}"${rest}><button type="button" class="m45fol${on?' on':''}" data-fol="${id}">${on?'따라가는 중':'따라가기'}</button><div class="pn">`:m})}catch(_){}return h}}
document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('.m45fol');if(!b)return;e.preventDefault();e.stopPropagation();const id=b.dataset.fol,r=[...NET.peers.values()].find(o=>String(o.id)===id);
  if(AW.on&&AW.on.kind==='follow'&&r&&AW.on.pid===r.id){m45Stop(false,'따라가기를 멈췄어요')}else if(r)m45Walk({kind:'follow',pid:r.id});PUI.lastH='';PUI.tick(true)},true);

/* ===== 13 다른 앱에 갔다 오면 잠깐 멈춤 (혼자일 때) ===== */
function m45PauseEl(on){let el=document.getElementById('m45pause');if(!on){if(el)el.hidden=true;return}
  if(!el){el=document.createElement('div');el.id='m45pause';el.innerHTML='<div><b>잠깐 멈췄어요</b><span>눌러서 계속하기</span></div>';document.body.appendChild(el);el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();m45Resume()})}
  el.hidden=false}
function m45AwayBack(ms){if(ms<M45.AWAY_MS||NET.on||!m45InGame()||P.dead||paused||M45.pause)return false;M45.pause=1;paused=true;keys.clear();joy=null;fireTouch=null;m45Stop(true);m45PauseEl(true);return true}
function m45Resume(){if(!M45.pause)return;M45.pause=0;m45PauseEl(false);const it=document.getElementById('intro'),dz=document.getElementById('death');paused=!panel.hidden||!!(it&&!it.hidden)||!!(dz&&!dz.hidden);IDLE.inp=performance.now()}
document.addEventListener('visibilitychange',()=>{if(document.hidden){M45.awayT=performance.now();return}const ms=M45.awayT?performance.now()-M45.awayT:0;M45.awayT=0;m45AwayBack(ms);m45WakeTick(performance.now(),true)});

/* ===== 14 절전 화면 (휴대폰) ===== */
function m45PsWant(now){if(!m45Phone()||!M45.dev.ps||!m45InGame()||P.dead||paused||AW.on)return false;if(DG)return false;if(!IN&&!inSafe(P.x,P.y,0))return false;return now-IDLE.inp>=M45.PS_MS}
function m45PsTick(now){const on=m45PsWant(now);if(on===!!M45.psOn)return;M45.psOn=on?1:0;if(on)M45.psT=now;let el=document.getElementById('m45ps');
  if(!on){if(el)el.hidden=true;return}
  if(!el){el=document.createElement('div');el.id='m45ps';document.body.appendChild(el);el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();IDLE.inp=performance.now();m45PsTick(performance.now())})}
  el.innerHTML=`<div><b>${esc(P.name||'')}</b> <span>Lv ${P.lvl}</span><em>절전 화면 · 눌러서 돌아가기</em>${NET.on?`<small>같이 하기 동료 ${NET.peers.size}명</small>`:''}</div>`;el.hidden=false}
{const _fc=frameCapMs;frameCapMs=function(){if(M45.psOn)return 200;return _fc.apply(this,arguments)}}
addEventListener('pointerdown',()=>{if(M45.psOn){IDLE.inp=performance.now();m45PsTick(performance.now())}},true);

/* ===== 지난번 8 화면 꺼짐 막기 (휴대폰) ===== */
function m45WakeWant(now){if(!m45Phone()||!M45.dev.wl||document.hidden||!m45InGame())return false;if(M45.psOn&&now-M45.psT>M45.PS_WL_MS)return false;return true}
function m45WakeTick(now,force){const want=m45WakeWant(now);const wl=navigator.wakeLock;if(!wl||M45.wlBusy)return;
  if(want&&!M45.wl){M45.wlBusy=1;wl.request('screen').then(l=>{M45.wl=l;l.addEventListener('release',()=>{if(M45.wl===l)M45.wl=null})}).catch(()=>{}).finally(()=>{M45.wlBusy=0})}
  else if(!want&&M45.wl){const l=M45.wl;M45.wl=null;try{l.release().catch(()=>{})}catch(_){}}void force}

/* ===== 17 단축칸 묶음 1 · 2 · 3 ===== */
function m45BarClean(a){if(!Array.isArray(a))return null;const out=a.slice(0,B44.N).map(x=>b44Ok(x)?x:null);while(out.length<B44.BASE)out.push(null);return out}
function m45Sets(){if(!P)return null;if(!P.b45||typeof P.b45!=='object')P.b45={c:0,s:[null,null,null]};return P.b45}
function m45SetPick(n){if(!P||!P.cls||!(n>=0&&n<3))return false;if(typeof m43Fight==='function'&&m43Fight()){msg('싸우는 중에는 단축칸 묶음을 바꿀 수 없어요','#a39d8f');return false}
  const S=m45Sets();if(S.c===n)return true;S.s[S.c]=P.bar.slice(0,Math.max(P.bar.length,B44.BASE));const nx=m45BarClean(S.s[n]);
  if(nx){const keep=P.bar.length;P.bar=nx;if(P.bar.length<keep)while(P.bar.length<keep)P.bar.push(null);if(P.bar.length>B44.BASE)b44Fix()}S.c=n;buildBar();if(typeof panel!=='undefined'&&!panel.hidden)renderPanel();save();
  msg(nx?`단축칸 묶음 ${n+1}번을 꺼냈어요`:`단축칸 묶음 ${n+1}번: 지금 배치를 그대로 옮겨 왔어요 · 바꾸면 이 묶음에 남아요`,'#d6c7a1');return true}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{const S=P&&P.b45;if(d&&S&&(S.c||S.s.some(Boolean)))d.b45={c:S.c|0,s:S.s.map(a=>a?a.slice(0,B44.N).map(x=>x||null):null)}}catch(err){if(window.__QA)throw err}return d}}
{const _ld=load;load=function(d){const x=d&&d.b45,r=_ld.apply(this,arguments);try{if(r&&P){delete P.b45;if(x&&typeof x==='object'&&Array.isArray(x.s)){const c=[0,1,2].includes(x.c)?x.c:0,s=[0,1,2].map(i=>m45BarClean(x.s[i]));if(c||s.some(Boolean))P.b45={c,s}}}}catch(err){if(window.__QA)throw err}return r}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{if(P)delete P.b45;m45Lock(null);m45Stop(true);M45.eq=[]}catch(_){}return r}}
{const _ld=load;load=function(){const r=_ld.apply(this,arguments);try{m45Lock(null);m45Stop(true);M45.eq=[]}catch(_){}return r}}

/* ===== 설정 ⚙: 휴대폰 편의 ===== */
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);const el=SET24.el;if(!el||el.hidden)return;const sep=el.querySelector('.s24sep'),ph=m45Phone(),D=M45.dev;
  const seg=(k,v,lab,cur)=>`<button type="button" class="s24seg${cur===v?' on':''}" data-m45${k}="${v}" aria-pressed="${cur===v}">${lab}</button>`;
  const box=document.createElement('div');box.className='m45set';let h='';
  if(P&&P.cls){const S=m45Sets();h+=`<div class="s24h">단축칸 묶음</div><div class="s24row">${[0,1,2].map(i=>seg('set',i,'묶음 '+(i+1),S.c)).join('')}</div><div class="s24n">혼자 사냥 · 보스 · 파티처럼 칸 배치를 세 가지로 두고 바꿔 써요. 고르면 지금 배치는 원래 묶음에 남아요. 캐릭터마다 저장돼요</div>`}
  h+=`<div class="s24h">장비 줍기</div><div class="s24row">${M45.PICK.map(p=>seg('pick',p[0],p[1],D.pick)).join('')}</div><div class="s24n">고른 등급 이상 장비는 금화처럼 가까이 가면 끌려와 주워져요. 이 기기에 저장돼요</div>`;
  h+=`<div class="s24h">글자 크기</div><div class="s24row">${['보통','조금 크게','크게'].map((t,i)=>seg('fs',i,t,D.fs)).join('')}</div><div class="s24n">창 · 의뢰 알림판 · 설명 쪽지의 글자를 키워요(게임 화면 속 글자는 그대로)</div>`;
  if(ph){h+=`<div class="s24h">단추 크기</div><div class="s24row">${['작게','보통','크게'].map((t,i)=>seg('bs',i,t,D.bs)).join('')}</div>`;
    h+=`<div class="s24h">싸울 때 단추 비치기</div><div class="s24row">${seg('bo',0,'끔',D.bo)}${seg('bo',1,'켬',D.bo)}</div><div class="s24n">켜면 싸우는 동안 단축바가 반쯤 비쳐 뒤의 몬스터가 보여요</div>`;
    h+=`<div class="s24h">절전 화면</div><div class="s24row">${seg('ps',1,'켬',D.ps)}${seg('ps',0,'끔',D.ps)}</div><div class="s24n">마을이나 건물 안에서 3분 동안 손을 안 대면 화면을 어둡게 하고 덜 그려요. 누르면 바로 돌아와요</div>`;
    h+=`<div class="s24h">게임 중 화면 꺼짐 막기</div><div class="s24row">${seg('wl',1,'켬',D.wl)}${seg('wl',0,'끔',D.wl)}</div><div class="s24n">게임하는 동안 휴대폰 화면이 저절로 꺼지지 않게 해요(되는 휴대폰만). 절전 화면이 10분 넘으면 다시 꺼질 수 있어요</div>`}
  box.innerHTML=h;el.insertBefore(box,sep||null);
  box.querySelectorAll('button[class~="s24seg"]').forEach(b=>b.onclick=e=>{e.stopPropagation();const k=Object.keys(b.dataset).find(x=>x.startsWith('m45'));if(!k)return;const key=k.slice(3),v=+b.dataset[k];
    if(key==='set')m45SetPick(v);else m45SetDev(key,v);set24Draw();set24Place()})}}

/* ===== 지난번 10 지역 지도: ! ? 묶기 · 누른 곳 목록 · 걸어가기 ===== */
function m45WmS(Wd,Hd){const m=Math.min((Wd-30)/(WORLD*2*KI),(Hd-30)/(WORLD*KI)),ox=Wd/2,oy=Hd/2-WORLD*KI/2*m;return{m,ox,oy,S:(x,y)=>({x:ox+(x-y)*KI*m,y:oy+(x+y)*KI/2*m}),W:(sx,sy)=>{const X=(sx-ox)/(KI*m),Y=(sy-oy)*2/(KI*m);return{x:(X+Y)/2,y:(Y-X)/2}}}}
// 지도 표시 자리의 사람(말 걸 수 있으면 d) · 이름
function m45MarkWho(k){const L=IN?IN.list:decor;let d=null;for(const f of L)if((f.k==='tfolk'||f.k==='npc')&&!f.esc&&Math.hypot(f.x-k.x,f.y-k.y)<4){d=f;break}
  for(const t of TOWNS)if(t.npc&&Math.hypot(t.npc.x-k.x,t.npc.y-k.y)<4&&QNPC[t.id])return{n:QNPC[t.id].n,d};if(d)return{n:d.n||'사람',d};
  for(const b of TW.blds[REG.id]||[])if(b.door&&b.door.x===k.x&&b.door.y===k.y)return{n:(b.label||'건물')+' 안',d:null};return{n:'의뢰',d:null}}
{const _sm=sqMarks;sqMarks=function(world){const out=_sm.apply(this,arguments);const W0=M45.wm;if(!world||!W0||!W0.drawing)return out;
  const keep=[],groups=[];for(const k of out){if(k.kind!=='!'&&k.kind!=='?'){keep.push(k);continue}const s=W0.S(k.x,k.y);let g=groups.find(o=>Math.hypot(o.sx-s.x,o.sy-s.y)<22);
    const w=m45MarkWho(k),it={kind:k.kind,who:w.n,d:w.d,x:k.x,y:k.y};if(g){g.list.push(it);if(k.kind==='!'){g.k.kind='!';g.k.col='#ffd34d'}}else{g={sx:s.x,sy:s.y,k:Object.assign({},k),list:[it]};groups.push(g)}}
  for(const g of groups){keep.push(g.k)}W0.groups=groups;return keep}}
{const _wr=wmapRegion;wmapRegion=function(g,Wd,Hd){const o=m45WmS(Wd,Hd);M45.wm={Wd,Hd,S:o.S,W:o.W,drawing:1,groups:[]};let r;try{r=_wr.apply(this,arguments)}finally{M45.wm.drawing=0}
  try{for(const G of M45.wm.groups){if(G.list.length<2)continue;g.font=`800 11px ${FONT}`;g.textAlign='left';g.lineWidth=3;g.strokeStyle='#000';const t=String(G.list.length);g.strokeText(t,G.sx+6,G.sy-2);g.fillStyle='#fff';g.fillText(t,G.sx+6,G.sy-2)}}catch(_){}
  return r}}
{const _wd=wmapDraw;wmapDraw=function(){if(M45.wm&&WMAP.tab!=='reg')M45.wm.groups=[];return _wd.apply(this,arguments)}}
function m45WmTap(cx,cy){const w=M45.wm;if(!w||WMAP.tab!=='reg'||DG)return null;
  const G=w.groups.find(o=>Math.hypot(o.sx-cx,o.sy-cy)<20);const p=G?{x:G.list[0].x,y:G.list[0].y}:w.W(cx,cy);
  if(!(p.x>=20&&p.y>=20&&p.x<=WORLD-20&&p.y<=WORLD-20))return null;return{p,list:G?G.list:null}}
// 누른 곳 쪽지: 사람마다 한 줄(누르면 그 사람에게 걸어가 말 걸기) · 빈 곳이면 「여기로 걸어가기」
function m45WmGo(o){wmapClose();if(o.d&&!IN&&decor.includes(o.d))return m45Walk({kind:'tw',d:o.d});return m45Walk({kind:'spot',reg:REG.id,x:o.x,y:o.y,label:o.who||'지도에서 고른 곳'})}
function m45WmPop(t,cx,cy){const card=document.querySelector('#wmap .card');if(!card)return;let el=document.getElementById('m45wp');if(!el){el=document.createElement('div');el.id='m45wp';card.appendChild(el);
    el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();const q=M45.wpT;el.hidden=true;if(!q||b.dataset.wx)return;
      if(b.dataset.wi!=null){const o=q.list&&q.list[+b.dataset.wi];if(o)m45WmGo(o)}else m45WmGo({x:q.p.x,y:q.p.y,who:'지도에서 고른 곳'})})}
  M45.wpT=t;const L=t.list?t.list.map((o,i)=>`<button type="button" class="m45wpi" data-wi="${i}"><b style="color:${o.kind==='!'?'#ffd34d':'#9fe0ff'}">${o.kind}</b> ${esc(o.who)} <small>${o.kind==='!'?'의뢰 받기':'보고하기'}</small></button>`).join(''):'';
  el.innerHTML=`${t.list?`<div class="m45wph">누르면 걸어가요</div>${L}`:''}<div class="m45wpb">${t.list?'':'<button type="button" data-wgo="1">여기로 걸어가기</button>'}<button type="button" class="ghost" data-wx="1">닫기</button></div>`;el.hidden=false;
  const cr=card.getBoundingClientRect(),cv2=document.getElementById('wmapCv').getBoundingClientRect(),k=cv2.width/Math.max(1,M45.wm.Wd),h=el.offsetHeight,px=cv2.left-cr.left+cx*k,py=cv2.top-cr.top+cy*k;
  el.style.left=clamp(px-105,6,Math.max(6,cr.width-222))+'px';el.style.top=Math.round(py+12+h>cr.height-6?Math.max(6,py-12-h):py+12)+'px'}
document.addEventListener('click',e=>{const c=e.target;if(!c||c.id!=='wmapCv')return;const r=c.getBoundingClientRect(),w=M45.wm;if(!w)return;const cx=(e.clientX-r.left)*w.Wd/r.width,cy=(e.clientY-r.top)*w.Hd/r.height,t=m45WmTap(cx,cy);
  if(t)m45WmPop(t,cx,cy)},true);
{const _wc=wmapClose;wmapClose=function(){const p=document.getElementById('m45wp');if(p)p.hidden=true;return _wc.apply(this,arguments)}}

{const st=document.createElement('style');st.textContent=`
#m45aw{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 54px);transform:translateX(-50%);z-index:6;display:flex;align-items:center;gap:8px;background:rgba(14,12,10,.84);border:1px solid #8a7346;border-radius:16px;padding:3px 4px 3px 12px;font-size:12px;color:#ffe6a8;pointer-events:auto;white-space:nowrap}
#m45aw[hidden]{display:none}#m45aw button{min-height:30px;padding:2px 12px;font-size:12px;border-radius:13px}
#qhud .m45go{display:inline-block;width:auto;align-self:flex-start;margin:3px 0 1px;min-height:26px;padding:1px 9px;font-size:11.5px;pointer-events:auto}
body.m22 #qhud .m45go{min-height:30px;min-width:56px}
#m45eq{position:fixed;left:calc(env(safe-area-inset-left,0px) + 10px);top:calc(env(safe-area-inset-top,0px) + 118px);z-index:6;display:flex;align-items:center;gap:6px;max-width:min(360px,calc(100vw - 20px));background:rgba(16,13,10,.92);border:1px solid #8a7346;border-radius:6px;padding:5px 6px;pointer-events:auto;box-shadow:0 4px 14px rgba(0,0,0,.6)}
#m45eq[hidden]{display:none}#m45eq svg,#m45eq img,#m45eq canvas{width:32px;height:32px;flex:none}#m45eq .m45eqt{display:flex;flex-direction:column;min-width:0;font-size:12px}#m45eq .m45eqt b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#m45eq .m45eqt small{color:#8cf08a;font-size:11px}
#m45eq button{min-height:36px;padding:2px 10px;font-size:12.5px;flex:none}
#hud .bar .sk .m45n{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font:800 15px/1 var(--body,sans-serif);color:#fff;text-shadow:0 0 3px #000,0 1px 2px #000;pointer-events:none;z-index:3}
#hud .bar .sk.m45rdy{animation:m45rdy .45s ease-out}@keyframes m45rdy{0%{box-shadow:inset 0 0 0 2px #ffe39a,0 0 10px #ffe39a}100%{box-shadow:inset 0 0 6px #000}}
body.m22.m45s0 #hud .bar .sk:not(.s26){width:38px;height:38px}body.m22.m45s2 #hud .bar .sk:not(.s26){width:52px;height:52px}
body.m22.m45s0 #m43pg{width:38px;height:38px}body.m22.m45s2 #m43pg{width:52px;height:52px}
body.m22.m45fade #hud .bar{background:transparent!important;border-color:transparent!important;box-shadow:none!important}body.m22.m45fade #hud .bar .sk{opacity:.62}
body.m45f1 #pbody,body.m45f1 #qhud>*,body.m45f1 #itip>*,body.m45f1 #sktip>*,body.m45f1 #set24>*,body.m45f1 #chatLog,body.m45f1 #m45eq .m45eqt{zoom:1.12}
body.m45f2 #pbody,body.m45f2 #qhud>*,body.m45f2 #itip>*,body.m45f2 #sktip>*,body.m45f2 #set24>*,body.m45f2 #chatLog,body.m45f2 #m45eq .m45eqt{zoom:1.25}
body.m22L #act{left:auto;right:calc(env(safe-area-inset-right,0px) + 202px);transform:none;bottom:calc(var(--m22b,70px) + 10px);padding:9px 14px;font-size:13px;max-width:44vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.m22L.m45side #act{right:calc(env(safe-area-inset-right,0px) + 250px)}
#m45qcb{position:fixed;z-index:5;left:calc(env(safe-area-inset-left,0px) + 10px);bottom:calc(env(safe-area-inset-bottom,0px) + 150px);width:44px;height:44px;border-radius:50%;padding:0;font-weight:800;font-size:14px;pointer-events:auto}
#m45qcb[hidden],#m45qc[hidden]{display:none}
body.m22L #m45qcb{bottom:calc(env(safe-area-inset-bottom,0px) + 96px)}
#m45qc{position:fixed;z-index:7;left:calc(env(safe-area-inset-left,0px) + 60px);bottom:calc(env(safe-area-inset-bottom,0px) + 96px);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;width:min(260px,calc(100vw - 80px));background:rgba(16,13,10,.94);border:1px solid #8a7346;border-radius:6px;padding:6px;pointer-events:auto}
#m45qc button{min-height:38px;font-size:12.5px;padding:2px 6px}
#pframes .m45fol{float:right;min-height:26px;padding:0 7px;font-size:10.5px;margin:-1px 0 2px 4px}#pframes .m45fol.on{background:linear-gradient(#7a5a1d,#4c3510);border-color:var(--gold)}
#m45pause,#m45ps{position:fixed;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;pointer-events:auto;touch-action:none}
#m45pause[hidden],#m45ps[hidden]{display:none}
#m45pause{background:rgba(5,4,3,.55)}#m45pause>div{display:flex;flex-direction:column;align-items:center;gap:6px;background:rgba(16,13,10,.94);border:1px solid #8a7346;border-radius:8px;padding:16px 26px}#m45pause b{font-size:18px;color:#ffe6a8}#m45pause span{font-size:13px;color:#d6c7a1}
#m45ps{background:rgba(0,0,0,.9)}#m45ps>div{display:flex;flex-direction:column;align-items:center;gap:6px;color:#a39d8f;font-size:13px}#m45ps b{color:#d6c7a1;font-size:16px}#m45ps em{font-style:normal;margin-top:8px}#m45ps small{color:#7fd4ff}
#m45wp{position:absolute;z-index:3;width:216px;max-height:calc(100% - 12px);overflow-y:auto;background:rgba(16,13,10,.96);border:1px solid #8a7346;border-radius:6px;padding:6px 8px;font-size:12px;line-height:1.5;color:#e8e0cc}
#m45wp[hidden]{display:none}#m45wp .m45wpb{display:flex;gap:4px;margin-top:5px}#m45wp button{min-height:34px;font-size:12px;padding:2px 8px;flex:1;white-space:nowrap}#m45wp .m45wph{color:#a39d8f;font-size:11px;margin-bottom:3px}#m45wp .m45wpi{display:block;width:100%;text-align:left;margin:0 0 3px;min-height:32px;overflow:hidden;text-overflow:ellipsis}#m45wp .m45wpi small{color:#a39d8f}
.m45set .s24row{flex-wrap:wrap}#set24{max-height:calc(100vh - 16px);overflow-y:auto}`;document.head.appendChild(st)}
window.__m45={scr:(x,y)=>{const s=W2S(x,y),r=cv.getBoundingClientRect();return{x:r.left+s.x*CZ,y:r.top+s.y*CZ}},M45,AW,m45Walk,m45Stop,m45Path,m45GoQuest,m45Lock,m45SetPick,m45SetDev,m45AwayBack,m45Resume,m45PsTick,m45QcSend,m45WmTap,m45EqOffer,m45AimPoint,idle:()=>IDLE,fcap:()=>frameCapMs(),set24Open,wmapOpen};
