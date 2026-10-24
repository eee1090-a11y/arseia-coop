/* ---------- v45 휴대폰 화면·조작 개선 3 (사용자 2026-10-24 14:48Z 「14빼고 이번 패치에 반영해줘.」 · 이 파일: 1 · 3 · 4 · 5 · 8 · 9 · 11 · 12 · 13번) ----------
   1 「뒤로」로 창 닫기: 게임이 시작되면(손가락이 처음 닿을 때) 방문 기록에 한 칸(u45)을 쌓아 둔다. 뒤로를 누르면 그 칸이 빠지며(popstate) 가장 위의 창 하나만 닫고 다시 한 칸 쌓는다.
     아무 창도 없으면 「게임을 나갈까요?」(저장하고 나가기 · 계속하기). 이때 먼저 저장해 두고 칸을 다시 쌓지 않으므로 뒤로를 한 번 더 누르면 나간다.
     창 바깥 어두운 곳(같이 하기 · 이름 짓기 창)과 화면 · 소리 설정 쪽창 바깥을 눌러도 닫힌다. PC의 Esc는 그대로(손대지 않음) · PC 브라우저의 뒤로도 같은 길.
   3 빨간 점 길잡이(휴대폰): ☰ → 메뉴 칸(스킬 트리 · 가방 · 성장) → 창 위 탭(스킬 트리 · 캐릭터와 가방) → 나무 탭(화염 · 냉기 …) → 찍을 수 있는 스킬 · 능력치 +1.
     대상: 남은 스킬 점수로 찍을 수 있는 스킬 · 남은 능력치 점수 · 새 장비(가방 물건의 n45 표시가 있으면) · 성장 창의 받을 보상과 할 일(g42Dot).
     그 창을 한 번 보면 바깥 점(☰ · 메뉴 칸 · 창 위 탭)은 사라지고, 점수가 새로 생기거나 새 물건 · 새 보상이 생기면 다시 뜬다(이번 접속 동안만 기억 · 저장 없음).
   4 위쪽 띠 알림(휴대폰): 「중요한 의뢰가 열렸습니다」 창이 들판(안전 지대 밖)에서 열리면 화면 위쪽 얇은 띠(이름 · 받기 · 나중에)로 6초. 띠를 누르면 큰 창. 마을(안전 지대)은 지금처럼 큰 창.
   5 그림 메뉴 막대(휴대폰): ☰를 누르면 그림+짧은 글자 큰 칸 한 줄(가방 · 스킬 트리 · 성장 · 지도 · 의뢰 · 같이 · 대화 · 설정). 캐릭터 선택 · 조작법은 설정 ⚙ 「저장」 탭.
     창(스킬 트리 · 캐릭터와 가방 · 성장 · 의뢰 · 지도)이 열려 있으면 같은 칸들이 창 옆 띠(가로: 오른쪽 · 세로: 아래)에 세로/가로로 남아, 누르면 그 창으로 바로 넘어간다. 지금 창 칸을 누르면 닫힘.
     원래 단추(#treeBtn · #charBtn …)는 그대로 살아 있고 칸이 그 단추를 누른다. 처음 보는 단추가 ☰ 줄에 생기면 글자 칸으로 끝에 붙는다(빠지는 것 없게).
   8 이어하기 한 줄 요약(휴대폰): 이어하기 직후 위쪽에 3초 「지난번: (지역)에서 · 다음 할 일: (알림판 맨 위 의뢰의 첫 남은 단계)」.
   9 설정 묶음 탭(휴대폰): 설정 ⚙ 안을 화면 · 조작 · 소리 · 알림 · 저장 탭으로 나눈다. 모든 항목을 옮기기만 하고 빼지 않는다(#qa에서 단추 목록을 비교).
     다른 파일이 set24Draw를 감싸 붙인 칸도 다 들어간다: 칸(또는 그 안 요소)에 data-tab45="조작"처럼 탭 이름을 달면 그 탭으로, 아니면 제목 글로 고르고, 모르면 「조작」.
     규칙을 더하려면 u45TabRule(/글자/,'화면'). 이 파일보다 뒤에 감싼 것이 붙인 칸도(그리기 끝에 한 번 더 정리) 빠지지 않는다. PC는 예전 목록 그대로.
   11 시계 · 배터리(휴대폰): 오른쪽 위 금화 줄 끝에 작은 시계(24시간), 배터리를 알려 주는 기기(안드로이드)만 %. 20%보다 적고 충전 중이 아니면 「낮음 품질로 바꿀까요?」를 이번 접속에 한 번만.
     설정 ⚙ 화면 탭 「시계 · 배터리」 보이기 · 숨기기.
   12 흔들림 · 번쩍임 줄이기(설정 ⚙ 화면 탭, 기본 끔): 켜면 화면 흔들림 없음, 화면 전체 번쩍임은 35%로(가장 밝아도 0.08). 그림 효과 크기 · 맞히기 판정은 그대로(그리기 직전에만 바꿈).
   13 처음 손가락 안내(휴대폰 · 1레벨 새 캐릭터 · 이 기기에서 처음): 움직이기 → 마법 → 물약 → 의뢰 받기 순서로 누를 곳을 빛내고 손가락 그림. 「건너뛰기」 · 5분이 지나면 저절로 끝.
     한 번 끝나면 다시 안 나옴(설정 ⚙ 조작 탭 「처음 안내 다시 보기」).
   (4차 「모두반영해줘」 15:05Z) P5 창 단추 늘 보이기(휴대폰): ☰ 바로 옆에 작은 그림 단추 줄(스킬 트리 · 캐릭터와 가방 · 성장 · 지도 · 대화) — 5번 그림 · 3번 빨간 점을 같이 쓴다.
     ☰ 안 막대에는 모든 칸이 그대로(의뢰 · 같이 · 설정 · 그 밖). 귀환 두루마리는 그 줄 끝에서 10px 떨어진다.
   P6 위쪽 정보칸 얇게(휴대폰): 왼쪽 위 캐릭터 칸은 레벨 동그라미 + 이름, 경험치는 3px 줄. 위계 · 경험치 글 · 휴식 · 다음 특성 글은 캐릭터 칸을 누르면 펼침(이번 접속 동안).
     의뢰 알림판은 폭 150px(가로) · 136px(세로)로 줄이고 바탕을 더 비치게(55%), 알림판을 누르면 5초 동안 지금처럼 진하게. v43 「싸울 때 저절로 접기」는 그대로.
     자리는 모두 화면(CSS) 픽셀로 잡아 보기 거리(GFX.zoom 0.85 · 0.72)가 바뀌어도 그대로.
   저장: 이 기기 설정 'arseia-ux45-v1' 한 키에만 {calm, clk, guide}(없으면 기본값). 캐릭터 키는 읽기만 하고 지우거나 비우지 않는다. 게임 규칙 · 수치는 그대로.
   붙는 곳: fix44.js 다음, tap20.js · dnd20.js · bar44.js · b5.js 앞. b5.js의 let(panel · pbody · tab · bindId)은 함수 안에서만(시작 뒤) 쓴다. */
const U45={KEY:'arseia-ux45-v1',set:{calm:0,clk:1,guide:0},
  TABS:['화면','조작','소리','알림','저장'],tab:'화면',tabsOff:0,rules:[],
  BAND_MS:6000,SUM_MS:3000,BAT_LOW:.2,GUIDE_S:300,CALM_FLASH:.35,CALM_FLASH_MAX:.08,
  t2:0,t5:0,t10:0,cellsSig:'',seen:null,setT:-1e9,exit:null,left:0,qaHist:0,qaGuide:0,bat:null,batAsked:0,g:null,dots:{}};
const u45$=s=>document.querySelector(s);
const u45Vis=s=>{const e=u45$(s);return !!e&&!e.hidden};
function u45Load(){try{const o=JSON.parse(localStorage.getItem(U45.KEY)||'null');if(o&&typeof o==='object'){U45.set.calm=o.calm===1?1:0;U45.set.clk=o.clk===0?0:1;U45.set.guide=o.guide===1?1:0}}catch(_){}}
function u45Save(){try{localStorage.setItem(U45.KEY,JSON.stringify({calm:U45.set.calm,clk:U45.set.clk,guide:U45.set.guide}))}catch(_){}}
if(!window.__QA)u45Load();
const u45Ph=()=>typeof M22==='object'&&M22.phone();
const u45Game=()=>typeof P!=='undefined'&&!!P&&!!P.cls;

/* ===== 1 「뒤로」로 창 닫기 ===== */
// 위에 뜨는 것부터: [이름, 열렸나, 닫기]
const U45W=[
  ['ask',()=>u45Vis('#m22ask'),()=>m22AskClose()],
  ['bat',()=>u45Vis('#u45bat'),()=>u45BatClose()],
  ['name',()=>!!(typeof N27==='object'&&N27.el),()=>n27Close()],
  ['kb',()=>typeof kbIsOpen==='function'&&kbIsOpen(),()=>kbClose()],
  ['patch',()=>u45Vis('#patch'),()=>patchClose()],
  ['menu',()=>{const t=u45$('#hud .tools');return !!t&&t.classList.contains('open')},()=>MOB.menu(false)],
  ['set',()=>!!SET24.el&&!SET24.el.hidden,()=>set24Open(false)],
  ['gfx',()=>u45Vis('#gfxPanel'),()=>{u45$('#gfxPanel').hidden=true}],
  ['au',()=>u45Vis('#auPanel'),()=>{u45$('#auPanel').hidden=true}],
  ['qn',()=>!!(typeof QN21==='object'&&QN21.el),()=>qnClose21()],
  ['coop',()=>u45Vis('#coop'),()=>{u45$('#coop').hidden=true}],
  ['map',()=>wmapIsOpen(),()=>wmapClose()],
  ['bind',()=>!!bindId,()=>{bindId=null;if(!panel.hidden)renderPanel();buildBar()}],
  ['panel',()=>!panel.hidden,()=>closePanel()],
  ['chat',()=>{const c=u45$('#chat');return !!c&&c.classList.contains('open')},()=>chatClose()],
  ['book',()=>u45Vis('#bookcard'),()=>{const x=u45$('#bookcard .bkx');if(x)x.click();else u45$('#bookcard').hidden=true}],
  ['intro',()=>u45Vis('#intro')&&!!introButtons.last&&u45Game()&&!!u45$('#go'),()=>u45$('#go').click()]];
// 뒤로 한 번: 가장 위 창 하나를 닫고 그 이름을, 없으면 나가기 묻기('exit')
function u45Back(){if(u45ExitOpen())return 'exit';for(const w of U45W){let o=false;try{o=w[1]()}catch(_){}if(o){w[2]();u45Sync();return w[0]}}
  return u45Game()?u45ExitAsk():''}
function u45Guard(){if(window.__QA&&!U45.qaHist)return false;if(!u45Game()||U45.left||u45ExitOpen())return false;
  try{if(history.state&&history.state.u45)return false;history.pushState({u45:1},'');return true}catch(_){return false}}
addEventListener('popstate',()=>{try{if(history.state&&history.state.u45)return;if(window.__QA&&!U45.qaHist)return;if(!u45Game()||U45.left)return;
  if(u45Back()!=='exit')u45Guard()}catch(e){if(window.__QA)throw e}});
for(const ev of ['pointerdown','keydown'])addEventListener(ev,()=>{u45Guard()},{capture:true,passive:true});
const u45ExitOpen=()=>u45Vis('#u45exit');
function u45ExitAsk(){let el=u45$('#u45exit');
  if(!el){el=document.createElement('div');el.id='u45exit';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
    el.innerHTML='<div class="card"><h2>게임을 나갈까요?</h2><p class="muted">지금까지 한 것은 저장했어요.</p><div class="row"><button type="button" class="ghost" data-u45x="stay">계속하기</button><button type="button" class="primary" data-u45x="go">저장하고 나가기</button></div></div>';
    el.addEventListener('pointerdown',e=>{e.stopPropagation();if(e.target===el)u45ExitClose(true)});
    el.addEventListener('click',e=>{const b=e.target.closest('[data-u45x]');if(!b)return;e.stopPropagation();if(b.dataset.u45x==='go')u45Leave();else u45ExitClose(true)});
    el.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape')u45ExitClose(true)});document.body.appendChild(el)}
  try{saveNow()}catch(_){}el.hidden=false;return 'exit'}
function u45ExitClose(again){const el=u45$('#u45exit');if(el)el.hidden=true;if(again)u45Guard()}
// 저장하고 나가기: 이 페이지 앞으로 돌아간다(앞이 없으면 설치한 앱은 창을 닫아 본다) · 시험에서는 U45.goAway를 바꿔 끼운다
U45.goAway=()=>{try{history.back()}catch(_){}setTimeout(()=>{try{window.close()}catch(_){}try{msg('저장했어요. 휴대폰의 뒤로 단추를 한 번 더 누르면 게임을 나가요','#d6b262')}catch(_){}},500)};
function u45Leave(){try{saveNow()}catch(_){}U45.left=1;u45ExitClose(false);U45.goAway()}
// 창 바깥 어두운 곳 · 쪽창 바깥 누르기
addEventListener('pointerdown',e=>{try{const t=e.target;
  const co=u45$('#coop');if(co&&!co.hidden&&t===co)co.hidden=true;
  const nm=u45$('#n27');if(nm&&t===nm)n27Close();
  for(const id of ['gfxPanel','auPanel']){const p=document.getElementById(id);if(p&&!p.hidden&&!(t&&t.closest&&(t.closest('#'+id)||t.closest('#set24,#gfxBtn,#auBtn,#auIntroBtn'))))p.hidden=true}}catch(err){if(window.__QA)throw err}},true);

/* ===== 5 그림 메뉴 막대 + 창 옆 띠 ===== */
const U45IC={
  bag:'<path d="M8 8V6a4 4 0 0 1 8 0v2"/><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 12h6"/>',
  tree:'<path d="M12 3c1 4 4.5 5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-2.2 1-3.4 2.2-4.4 0 2 1 3.2 2.3 3.4C11.4 8.6 11 6 12 3z"/>',
  g42:'<path d="M12 21v-9"/><path d="M12 12c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 14.5c0-3-2.2-5-6.5-5 0 3 2.2 5 6.5 5z"/>',
  map:'<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
  quest:'<path d="M7 4h11v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1h11"/><path d="M7 4a2 2 0 0 0-2 2v10"/><path d="M10 8h5M10 11.5h5"/>',
  coop:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-4 2.7-6 6-6s6 2 6 6"/><path d="M15.5 14.6c3 0 5.5 1.6 5.5 5.4"/>',
  chat:'<path d="M4 5h16v11H9.5L4 20z"/><path d="M8 9.5h8M8 12.5h5"/>',
  set:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  mount:'<path d="M7 20v-9a5 5 0 0 1 10 0v9"/><path d="M5 20h4M15 20h4"/>',
  other:'<circle cx="12" cy="12" r="7"/><path d="M12 9v6M9 12h6"/>'};
const u45Svg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${U45IC[k]||U45IC.other}</svg>`;
// 칸: 원래 단추(btn)를 누른다 · panel: 큰 창 안에서 바뀌는 것 · open: 지금 그 창이 열려 있나
const U45C=[
  {k:'bag',n:'가방',t:'캐릭터와 가방',btn:'charBtn',panel:1,open:()=>!panel.hidden&&tab==='char'},
  {k:'tree',n:'스킬 트리',btn:'treeBtn',panel:1,open:()=>!panel.hidden&&tab==='tree'},
  {k:'g42',n:'성장',btn:'g42Btn',panel:1,open:()=>typeof g42IsOpen==='function'&&g42IsOpen()},
  {k:'map',n:'지도',t:'세계 지도',btn:'mapBtn',open:()=>wmapIsOpen()},
  {k:'quest',n:'의뢰',t:'의뢰 일지',go:()=>sqOpenLog(),panel:1,open:()=>!panel.hidden&&tab==='quest'&&SQV.mode==='log'},
  {k:'coop',n:'같이',t:'같이 하기',btn:'coopBtn',open:()=>u45Vis('#coop')},
  {k:'chat',n:'대화',btn:'chatBtn',open:()=>{const c=u45$('#chat');return !!c&&c.classList.contains('open')}},
  {k:'set',n:'설정',btn:'setBtn',open:()=>!!SET24.el&&!SET24.el.hidden}];
const U45Q=['tree','bag','g42','map','chat'];// P5 ☰ 옆에 늘 보이는 칸
const U45_SKIP=new Set(['menuBtn','helpBtn','gfxBtn','auBtn','patchBtn']);// 캐릭터 선택 · 조작법은 설정 ⚙ 「저장」 탭, 화면 · 소리 · 패치노트는 설정 안
function u45Cells(){const out=[],known=new Set();
  for(const c of U45C){if(c.btn){known.add(c.btn);const b=document.getElementById(c.btn);if(!b||b.hidden)continue}out.push(c)}
  const t=u45$('#hud .tools');if(t)for(const b of t.querySelectorAll(':scope>button')){if(!b.id||known.has(b.id)||U45_SKIP.has(b.id)||b.hidden)continue;
    const n=(typeof m43Strip==='function'?m43Strip(b.textContent):b.textContent).replace(/[●⚙♪]/g,'').trim();out.push({k:'x_'+b.id,n:n||'?',btn:b.id,ic:b.id==='g42Mt'?'mount':'other',open:()=>false})}
  return out}
function u45CellHtml(c){return `<button type="button" class="u45c" data-u45c="${c.k}" title="${c.t||c.n}" aria-label="${c.t||c.n}">${u45Svg(c.ic||c.k)}<span>${c.n}</span></button>`}
function u45Build(){u45Vp();const cells=u45Cells(),sig=cells.map(c=>c.k+':'+c.n).join('|');if(sig===U45.cellsSig&&u45$('#u45bar')&&u45$('#u45rail'))return cells;U45.cellsSig=sig;
  const h=cells.map(u45CellHtml).join('');let bar=u45$('#u45bar');const t=u45$('#hud .tools');
  if(!bar&&t){bar=document.createElement('div');bar.id='u45bar';bar.setAttribute('role','menu');t.appendChild(bar)}if(bar)bar.innerHTML=h;
  let rail=u45$('#u45rail');if(!rail){rail=document.createElement('div');rail.id='u45rail';rail.setAttribute('role','toolbar');rail.setAttribute('aria-label','창 바로 가기');document.body.appendChild(rail)}
  rail.innerHTML=h;rail.style.setProperty('--u45n',cells.length);
  let q=u45$('#u45quick');const row=u45$('#m22row');if(!q&&row){q=document.createElement('div');q.id='u45quick';q.setAttribute('role','toolbar');q.setAttribute('aria-label','창 바로 가기');const tp=u45$('#m22tp');row.insertBefore(q,tp&&tp.parentNode===row?tp:null)}
  if(q)q.innerHTML=U45Q.map(k=>cells.find(c=>c.k===k)).filter(Boolean).map(c=>u45CellHtml(c).replace('class="u45c"','class="u45c u45q"')).join('');U45.dotSig='';return cells}
function u45CloseAll(keep){for(const w of U45W){if(w[0]===keep||/^(ask|bat|name|intro|menu|book|qn)$/.test(w[0]))continue;if(keep==='panel'&&w[0]==='bind')continue;let o=false;try{o=w[1]()}catch(_){}if(o)try{w[2]()}catch(_){}}}
function u45Go(k){const c=u45Cells().find(c=>c.k===k);if(!c)return false;try{MOB.menu(false)}catch(_){}
  let was=false;try{was=!!c.open()}catch(_){}
  if(k==='set'&&!was&&performance.now()-U45.setT<450)was=true;// 바깥 누르기로 방금 닫힌 설정 칸을 다시 누르면 닫힌 채로
  if(was){u45CloseAll('');u45Sync();return 'closed'}
  u45CloseAll(c.panel?'panel':k);
  if(c.go)c.go();else{const b=document.getElementById(c.btn);if(b)b.click()}u45Sync();return 'opened'}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-u45c]');if(!b)return;e.preventDefault();e.stopPropagation();u45Go(b.dataset.u45c)},true);
{const _o=set24Open;set24Open=function(on){const was=!!SET24.el&&!SET24.el.hidden,r=_o.apply(this,arguments);if(was&&SET24.el&&SET24.el.hidden)U45.setT=performance.now();return r}}
// 창 옆 띠: 큰 창 · 지도가 열린 동안(휴대폰)
function u45RailOn(){return u45Ph()&&u45Game()&&!u45Vis('#intro')&&(!panel.hidden||wmapIsOpen())}
function u45Sync(){try{if(!document.body)return;const on=u45RailOn();if(on)u45Build();document.body.classList.toggle('u45rail',on);if(on||u45$('#hud .tools.open'))u45Marks()}catch(e){if(window.__QA)throw e}}
function u45Marks(){const cells=u45Cells(),D=U45.dots;for(const el of document.querySelectorAll('[data-u45c]')){const c=cells.find(x=>x.k===el.dataset.u45c);if(!c)continue;let o=false;try{o=!!c.open()}catch(_){}
  el.classList.toggle('on',o);el.setAttribute('aria-pressed',String(o));el.classList.toggle('u45d',!!D[c.k])}}
{const _rp=renderPanel;renderPanel=function(){const r=_rp.apply(this,arguments);try{u45PanelDots();u45Sync()}catch(e){if(window.__QA)throw e}return r}}
{const _cp=closePanel;closePanel=function(){const r=_cp.apply(this,arguments);u45Sync();return r}}
{const _wo=wmapOpen;wmapOpen=function(){const r=_wo.apply(this,arguments);u45Sync();return r}}
{const _wc=wmapClose;wmapClose=function(){const r=_wc.apply(this,arguments);u45Sync();return r}}
{const _m=MOB.menu;MOB.menu=function(open){const r=_m.apply(this,arguments);try{if(u45Ph()&&u45$('#hud .tools.open')){/* v45 고침: 열린 대화 창(z 29)이 ☰ 칸을 덮어 누를 수 없던 것 → ☰를 열면 대화 창을 닫음(쓰던 글은 남음) */const ch=u45$('#chat.open');if(ch&&typeof chatClose==='function')chatClose();u45Build();u45Marks()}}catch(e){if(window.__QA)throw e}return r}}

/* ===== 3 빨간 점 길잡이 ===== */
function u45SeenReset(){U45.seen={sp:0,ap:0,nw:new Set(),g42:'',tree:{}};U45.dots={};U45.dotSig=''}
u45SeenReset();
// 찍을 수 있는 스킬 수: 나무(TREE)마다 · 상위 기술(tab)은 'adv'
function u45Learn(){const out={},C=P&&CLASSES[P.cls];if(!C||!(P.sp>0))return out;for(const id in SPELLS){const s=SPELLS[id];if(s.cls!==P.cls)continue;let ok=false;try{ok=canLearn(id)}catch(_){}if(ok){const t=s.tab?'adv':TREE[id];out[t]=(out[t]||0)+1}}return out}
const u45New=()=>P&&Array.isArray(P.bag)?P.bag.filter(it=>it&&it.n45).map(it=>it.id):[];
function u45G42(){try{if(typeof g42Dot!=='function'||!g42Dot())return '';return G42.tabs.filter(t=>{try{return t.dot&&t.dot()}catch(_){return false}}).map(t=>t.k).join(',')||'box'}catch(_){return ''}}
// 지금 열린 창을 본 것으로 · 바깥 점 계산
function u45DotTick(){if(!u45Game())return;const S=U45.seen,L=u45Learn(),nL=Object.keys(L).length,nw=u45New(),g=u45G42(),po=!panel.hidden;
  if(po&&tab==='tree'){S.sp=P.sp;if(L[treeSel])S.tree[treeSel]=P.sp}
  if(po&&tab==='char'){S.ap=P.ap;for(const id of nw)S.nw.add(id)}
  if(typeof g42IsOpen==='function'&&g42IsOpen())S.g42=g;
  if(P.sp<S.sp)S.sp=P.sp;if(P.ap<S.ap)S.ap=P.ap;
  const D={tree:nL>0&&P.sp>S.sp,bag:P.ap>S.ap||nw.some(id=>!S.nw.has(id)),g42:!!g&&g!==S.g42};D.menu=D.tree||D.bag||D.g42;D.L=L;
  const sig=JSON.stringify([D.tree,D.bag,D.g42,L,P.sp,P.ap,po&&tab]);U45.dots=D;if(sig===U45.dotSig)return;U45.dotSig=sig;
  const mb=u45$('#menuBtn');if(mb)mb.classList.toggle('u45d',D.menu);u45Marks();if(po)u45PanelDots()}
// 창 안: 창 위 탭 · 나무 탭 · 찍을 수 있는 스킬 · 능력치 +1 (휴대폰만)
function u45PanelDots(){if(panel.hidden)return;const ph=u45Ph()&&u45Game(),D=U45.dots||{},L=ph?(D.L||u45Learn()):{};
  const tt=u45$('#tabTree'),tc=u45$('#tabChar');if(tt)tt.classList.toggle('u45d',ph&&tab!=='tree'&&!!D.tree);if(tc)tc.classList.toggle('u45d',ph&&tab!=='char'&&!!D.bag);
  if(tab==='tree')for(const b of pbody.querySelectorAll('.treetabs [data-tree]')){const t=+b.dataset.tree;b.classList.toggle('u45d',ph&&!!L[t]&&t!==treeSel&&P.sp>(U45.seen.tree[t]||0))}
  if(tab==='tree')for(const b of pbody.querySelectorAll('.node.can'))b.classList.toggle('u45d',ph&&P.sp>0);
  if(tab==='char')for(const b of pbody.querySelectorAll('[data-stat][data-q="1"]'))b.classList.toggle('u45d',ph&&P.ap>0)}

/* ===== 4 위쪽 띠 알림 ===== */
{const _qs=qnShow21;qnShow21=function(list){const r=_qs.apply(this,arguments);try{u45Band()}catch(e){if(window.__QA)throw e}return r}}
// 띠 자리(CSS 픽셀): 가로는 캐릭터 칸 오른쪽 ~ 오른쪽 위 지역 이름 앞, 좁으면(또 세로는) 위쪽 칸들 아래 한 줄
function u45TopArea(){u45Vp();const vp=M22.vp(),R=s=>{const e=u45$(s);if(!e)return null;const r=e.getBoundingClientRect();return r.width>0?r:null};
  const who=R('#hud .who'),row=R('#m22row'),rc=R('#hud .rightcol'),mm=R('#minimap'),m=8,P_=M22.mode()==='P';let left=m,top=null,w;
  const rgt=rc?rc.left-m:vp.w-m;
  if(!P_&&who){left=who.right+m;w=Math.min(560,rgt-left)}
  if(w==null||w<260){left=m;top=Math.max(who?who.bottom:0,row?row.bottom:0,P_&&mm?mm.bottom:0)+6;w=Math.min(560,(P_?vp.w-m:rgt)-left)}
  return {left:Math.round(left),top:top==null?null:Math.round(top),w:Math.round(w)}}
function u45BandPlace(el){const a=u45TopArea();el.style.left=a.left+'px';el.style.width=a.w+'px';el.style.transform='none';if(a.top!=null)el.style.top=a.top+'px'}
function u45Band(){const el=QN21.el;if(!el||!u45Ph()||!u45Game())return false;if(typeof safe24Here==='function'?safe24Here():(!DG&&inSafe(P.x,P.y,0)))return false;
  const ids=QN21.ids.slice(),q=SQBY[ids[0]];if(!q)return false;const one=ids.length===1&&!(q.pick||q.pick3);
  const bh=document.createElement('div');bh.className='u45bh';
  bh.innerHTML=`<button type="button" class="u45bt" data-u45b="open"><b>중요한 의뢰</b> · ${q.t}${ids.length>1?` 외 ${ids.length-1}개`:''}</button><button type="button" class="u45bk" data-u45b="${one?'acc':'open'}">${one?'받기':'보기'}</button><button type="button" class="ghost u45bk" data-u45b="later">나중에</button>`;
  el.insertBefore(bh,el.firstChild);el.classList.add('u45band');u45BandPlace(el);
  bh.addEventListener('click',e=>{const b=e.target.closest('[data-u45b]');if(!b)return;e.stopPropagation();const k=b.dataset.u45b;clearTimeout(U45.bandT);
    if(k==='acc')qImpAccept21(ids[0]);else if(k==='later')qnClose21();else{el.classList.remove('u45band');bh.remove();for(const k of ['left','width','transform','top'])el.style[k]=''}});
  clearTimeout(U45.bandT);U45.bandT=setTimeout(()=>{if(QN21.el===el&&el.classList.contains('u45band'))qnClose21()},U45.BAND_MS);return true}

/* ===== 8 이어하기 한 줄 요약 ===== */
function u45SumText(){if(!u45Game())return '';const strip=s=>(typeof m43Strip==='function'?m43Strip:x=>x)(String(s||'').replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim();
  let place='';try{place=DG?DG.d.n:zoneName(P.x,P.y)}catch(_){}let bl=[];try{const m=qHudBlock();if(m)bl.push(m);bl.push(...sqHudBlocks())}catch(_){}
  const b=bl.find(x=>x&&x.g&&x.g.length),g=b&&(b.g.find(x=>!x.ok)||b.g[0]);
  return `지난번: ${strip(place)||'아르세이아'}에서`+(g?` · 다음 할 일: ${strip(g.s)}`:'')}
function u45Sum(){if(!u45Ph()||!u45Game()||!u45$('#intro').hidden)return '';const t=u45SumText();let el=u45$('#u45sum');
  if(!el){el=document.createElement('div');el.id='u45sum';el.setAttribute('role','status');document.body.appendChild(el)}
  el.textContent=t;el.hidden=false;el.classList.remove('off');{const a=u45TopArea();el.style.left=Math.round(a.left+a.w/2)+'px';el.style.maxWidth=a.w+'px';el.style.top=a.top!=null?a.top+'px':''}clearTimeout(U45.sumT);U45.sumT=setTimeout(()=>{el.classList.add('off');U45.sumT=setTimeout(()=>{el.hidden=true},400)},U45.SUM_MS);return t}
document.addEventListener('click',e=>{if(e.target&&e.target.closest&&e.target.closest('#introBody [data-play]'))setTimeout(()=>{try{u45Sum();u45GuideMaybe()}catch(err){if(window.__QA)throw err}},0)});

/* ===== 11 시계 · 배터리 ===== */
function u45ClkText(d){d=d||new Date();const p=n=>String(n).padStart(2,'0'),b=U45.bat;
  return `${p(d.getHours())}:${p(d.getMinutes())}`+(b&&typeof b.level==='number'?` · ${Math.round(b.level*100)}%`:'')}
function u45Clock(){const g=u45$('#hud .gold');if(!g)return;let el=u45$('#u45clk');const on=u45Ph()&&U45.set.clk;
  if(!el){if(!on)return;el=document.createElement('span');el.id='u45clk';el.setAttribute('aria-label','지금 시각');g.appendChild(el)}
  el.hidden=!on;if(!on)return;const t=u45ClkText(),b=U45.bat,low=!!(b&&b.level<U45.BAT_LOW&&!b.charging);if(el._t!==t+low){el._t=t+low;el.textContent=t;el.classList.toggle('low',low)}u45BatAsk()}
try{if(navigator.getBattery)navigator.getBattery().then(b=>{U45.bat=b;const f=()=>{try{u45Clock()}catch(_){}};b.addEventListener('levelchange',f);b.addEventListener('chargingchange',f)},()=>{})}catch(_){}
function u45BatAsk(){const b=U45.bat;if(U45.batAsked||!b||!(b.level<U45.BAT_LOW)||b.charging||!u45Ph()||!u45Game()||GFX.q==='low'||!u45$('#intro').hidden)return false;U45.batAsked=1;
  let el=u45$('#u45bat');if(!el){el=document.createElement('div');el.id='u45bat';el.setAttribute('role','dialog');document.body.appendChild(el);el.addEventListener('pointerdown',e=>e.stopPropagation());
    el.addEventListener('click',e=>{const x=e.target.closest('[data-u45bat]');if(!x)return;e.stopPropagation();if(x.dataset.u45bat==='low'){set24Q('low');msg('그래픽 품질을 「낮음」으로 바꿨어요 · 설정 ⚙에서 되돌릴 수 있어요','#d6b262')}u45BatClose()})}
  el.innerHTML=`<p>배터리가 ${Math.round(b.level*100)}%예요. 그래픽 품질을 「낮음」으로 바꿀까요? 배터리를 아끼고 열이 덜 나요.</p><div class="row"><button type="button" class="ghost" data-u45bat="no">그대로 두기</button><button type="button" class="primary" data-u45bat="low">낮음으로 바꾸기</button></div>`;
  el.hidden=false;return true}
function u45BatClose(){const el=u45$('#u45bat');if(el)el.hidden=true}

/* ===== 12 흔들림 · 번쩍임 줄이기 (그리기 직전에만) ===== */
{const _r=render;render=function(){if(!U45.set.calm)return _r.apply(this,arguments);shake=0;const f=flash,a=f&&f.a;if(f&&a>0)f.a=Math.min(a*U45.CALM_FLASH,U45.CALM_FLASH_MAX);
  try{return _r.apply(this,arguments)}finally{if(f&&flash===f)f.a=a}}}
function u45SetCalm(v){U45.set.calm=v?1:0;u45Save()}

/* ===== 13 처음 손가락 안내 ===== */
const U45G=[
  {k:'move',say:'화면 왼쪽을 누른 채 손가락을 밀면 걸어요'},
  {k:'cast',say:'이 단추를 누르면 마법을 써요 · 화면 오른쪽을 눌러도 돼요'},
  {k:'pot',say:'생명이 줄면 이 물약을 눌러 마셔요'},
  {k:'quest',say:'머리 위에 ! 가 있는 사람에게 가서 의뢰를 받아요 · 알림판의 📍가 갈 곳이에요'}];
const U45_FINGER='<svg viewBox="0 0 48 64" aria-hidden="true"><path d="M20 4c2.5 0 4 1.8 4 4.5V28l2-.4V24c0-2.4 1.6-4 3.8-4s3.6 1.6 3.6 4v4.6l1.6-.2c.4-2 1.8-3.2 3.6-3.2 2.2 0 3.6 1.6 3.6 4v14c0 9-6 16-15 16h-3c-6 0-10-3-13-8l-6-10c-1.2-2-.4-4.2 1.6-5 1.8-.8 3.6 0 4.8 1.6L16 40V8.5C16 5.8 17.5 4 20 4z" fill="#fff6e0" stroke="#3a2a12" stroke-width="2" stroke-linejoin="round"/></svg>';
function u45GuideMaybe(){if(U45.g||U45.set.guide||!u45Ph()||!u45Game()||P.lvl!==1)return false;if(window.__QA&&!U45.qaGuide)return false;return u45GuideStart()}
function u45GuideStart(){if(!u45Game())return false;let el=u45$('#u45g');
  if(!el){el=document.createElement('div');el.id='u45g';el.innerHTML=`<div class="u45ring"></div><div class="u45f">${U45_FINGER}</div><div class="u45say"><span></span><button type="button" class="ghost" data-u45g="skip">건너뛰기</button></div>`;
    el.querySelector('[data-u45g]').addEventListener('click',e=>{e.stopPropagation();u45GuideEnd(true)});el.querySelector('.u45say').addEventListener('pointerdown',e=>e.stopPropagation());document.body.appendChild(el)}
  U45.g={i:0,t:0,last:performance.now(),x:P.x,y:P.y,hit:0,q0:u45QuestN()};el.hidden=false;u45GuideDraw();return true}
const u45QuestN=()=>{try{return (P.q&&(P.q.i>0||P.q.st>0)?1:0)+Object.keys(sqState().a||{}).length}catch(_){return 0}};
function u45GuideNext(){const g=U45.g;if(!g)return;g.i++;g.hit=0;if(g.i>=U45G.length){u45GuideEnd(false);return}g.x=P.x;g.y=P.y;g.q0=u45QuestN();u45GuideDraw()}
function u45GuideEnd(skip){if(!U45.g)return;U45.g=null;const el=u45$('#u45g');if(el)el.hidden=true;U45.set.guide=1;u45Save();
  try{msg(skip?'안내를 건너뛰었어요 · 설정 ⚙ → 조작에서 다시 볼 수 있어요':'손가락 안내를 마쳤어요 · 즐거운 모험 되세요!','#d6b262')}catch(_){}}
function u45GuideEl(k){const sel=k==='cast'?'#bar .sk[data-slot]:not(.empty):not(.m43off):not(.s26)':k==='pot'?'#bar [data-pot="hp"]':null;
  if(k==='quest'){const a=u45$('#act');if(a&&!a.hidden&&a.offsetParent)return a;return u45$('#qhud:not([hidden])')}
  if(!sel)return null;for(const b of document.querySelectorAll(sel))if(b.offsetParent&&getComputedStyle(b).display!=='none')return b;return null}
function u45GuideTick(now){const g=U45.g,el=u45$('#u45g');if(!g||!el)return;const dt=Math.min(.5,Math.max(0,(now-g.last)/1000));g.last=now;
  const hold=paused||P.dead||!u45$('#intro').hidden||!u45Ph();el.classList.toggle('hold',!!hold);if(hold)return;g.t+=dt;if(g.t>U45.GUIDE_S){u45GuideEnd(false);return}
  const k=U45G[g.i].k;
  if(k==='move'&&Math.hypot(P.x-g.x,P.y-g.y)>120)return u45GuideNext();
  if((k==='cast'||k==='pot')&&g.hit)return u45GuideNext();
  if(k==='pot'&&!u45GuideEl('pot'))return u45GuideNext();// 물약이 없으면 넘어감
  if(k==='quest'&&u45QuestN()>g.q0)return u45GuideNext();
  u45GuideDraw()}
function u45GuideDraw(){const g=U45.g,el=u45$('#u45g');if(!g||!el)return;const st=U45G[g.i],vp=M22.vp();let r;
  if(st.k==='move'){const c=cv.getBoundingClientRect();r={left:c.left+c.width*.2-30,top:c.top+c.height*.58-30,width:60,height:60}}
  else{const t=u45GuideEl(st.k);r=t?t.getBoundingClientRect():null}
  const say=el.querySelector('.u45say span'),txt=st.k==='quest'&&r&&u45$('#act')&&!u45$('#act').hidden?'이 단추를 눌러 이야기하고 의뢰를 받아요':st.say;if(say.textContent!==txt)say.textContent=txt;
  el.dataset.k=st.k;const ring=el.querySelector('.u45ring'),f=el.querySelector('.u45f');ring.hidden=f.hidden=!r;if(!r)return;
  const cx=r.left+r.width/2,cy=r.top+r.height/2,down=cy>vp.h*.55;
  ring.style.cssText=`left:${Math.round(r.left-6)}px;top:${Math.round(r.top-6)}px;width:${Math.round(r.width+12)}px;height:${Math.round(r.height+12)}px`;
  f.classList.toggle('down',down);f.style.left=Math.round(cx-17)+'px';f.style.top=Math.round(down?r.top-58:r.bottom+2)+'px'}
{const _cs=castSlot;castSlot=function(){if(U45.g&&U45G[U45.g.i].k==='cast')U45.g.hit=1;return _cs.apply(this,arguments)}}
{const _up=usePotion;usePotion=function(){if(U45.g&&U45G[U45.g.i].k==='pot')U45.g.hit=1;return _up.apply(this,arguments)}}

/* ===== 불러오기 · 새 캐릭터: 점 기억 비우기 · 안내 ===== */
{const _ld=load;load=function(){const r=_ld.apply(this,arguments);try{u45SeenReset();if(U45.g)u45GuideEnd0()}catch(e){if(window.__QA)throw e}return r}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{u45SeenReset();if(U45.g)u45GuideEnd0();setTimeout(()=>{try{u45GuideMaybe()}catch(_){}},0)}catch(e){if(window.__QA)throw e}return r}}
function u45GuideEnd0(){U45.g=null;const el=u45$('#u45g');if(el)el.hidden=true}// 캐릭터를 바꾸면 안내는 조용히 멈춤(끝난 것으로 치지 않음)

/* ===== 9 설정 묶음 탭 + 이 파일의 설정 ===== */
function u45TabRule(re,t){if(U45.TABS.includes(t))U45.rules.unshift([re,t])}
const U45_RULES=[[/그래픽|프레임|화면|흔들림|번쩍|시계|배터리|글자|단추 크기|비치|절전|밝기/,'화면'],[/소리|음악|효과음|음량/,'소리'],[/진동|알림|패치노트|소식/,'알림'],[/저장|캐릭터 선택|조작법|내보내기/,'저장'],[/단축|물약|위치|조작|배치|안내|줍기|묶음/,'조작']];
function u45TabOf(sec){for(const n of sec){const d=n.dataset&&n.dataset.tab45||n.querySelector&&n.querySelector('[data-tab45]')&&n.querySelector('[data-tab45]').dataset.tab45;if(d&&U45.TABS.includes(d))return d}
  const h=sec.find(n=>n.classList&&n.classList.contains('s24h'))||sec[0].querySelector&&sec[0].querySelector('.s24h'),txt=((h||sec[0]).textContent||'')+' '+(sec[0].id||'')+' '+(sec[0].dataset&&sec[0].dataset.s24go||'');
  const go=sec[0].dataset&&sec[0].dataset.s24go;if(go==='gfxBtn')return '화면';if(go==='auBtn')return '소리';if(go==='patchBtn')return '알림';if(sec[0].id==='fb28reset')return '조작';
  for(const [re,t] of U45.rules.concat(U45_RULES))if(re.test(txt))return t;return '조작'}
// 탭 없이 쌓인 칸들을 묶음(제목 + 줄 + 설명 / 상자 하나 / 단추 하나)으로 나눈다
function u45Sections(el){const secs=[];let cur=null;
  for(const n of [...el.children]){if(n.classList.contains('u45tabs')||n.classList.contains('u45pane'))continue;
    if(n.classList.contains('s24sep')){cur=null;continue}
    if(n.classList.contains('s24h')){cur=[n];secs.push(cur);continue}
    if(cur&&(n.classList.contains('s24row')||n.classList.contains('s24n'))&&cur[0].classList.contains('s24h')){cur.push(n);continue}
    cur=null;secs.push([n])}return secs}
function u45Tabify(){const el=SET24.el;if(!el||el.hidden||U45.tabsOff||!u45Ph())return false;const secs=u45Sections(el);
  let bar=el.querySelector(':scope>.u45tabs');if(!bar&&!secs.length)return false;
  if(!bar){bar=document.createElement('div');bar.className='u45tabs';bar.setAttribute('role','tablist');bar.innerHTML=U45.TABS.map(t=>`<button type="button" class="u45tab" role="tab" data-u45tab="${t}">${t}</button>`).join('');el.insertBefore(bar,el.firstChild);
    for(const t of U45.TABS){const p=document.createElement('div');p.className='u45pane';p.dataset.tab=t;p.setAttribute('role','tabpanel');el.appendChild(p)}
    bar.addEventListener('click',e=>{const b=e.target.closest('[data-u45tab]');if(!b)return;e.stopPropagation();U45.tab=b.dataset.u45tab;u45TabShow();try{set24Place()}catch(_){}})}
  for(const s of secs){const t=u45TabOf(s),p=el.querySelector(`:scope>.u45pane[data-tab="${t}"]`);for(const n of s)p.appendChild(n)}
  let sep=el.querySelector(':scope>.s24sep');if(!sep){sep=document.createElement('div');sep.className='s24sep';el.appendChild(sep)}else el.appendChild(sep);sep.hidden=true;// 뒤에 감싼 것이 이 앞에 끼워도 정리되게
  el.classList.add('u45t');u45TabShow();return true}
function u45TabShow(){const el=SET24.el;if(!el)return;if(!U45.TABS.includes(U45.tab))U45.tab=U45.TABS[0];
  for(const b of el.querySelectorAll('.u45tab')){const on=b.dataset.u45tab===U45.tab;b.classList.toggle('on',on);b.setAttribute('aria-selected',String(on))}
  for(const p of el.querySelectorAll(':scope>.u45pane'))p.hidden=p.dataset.tab!==U45.tab}
// 이 파일의 설정 칸 (휴대폰) — 다른 파일처럼 구분선 앞에 끼운다
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);try{const el=SET24.el;if(!el||el.hidden||!u45Ph())return;const sep=el.querySelector('.s24sep');
  const seg=(k,v,lab,cur)=>`<button type="button" class="s24seg${cur===v?' on':''}" data-u45s="${k}" data-v="${v}" aria-pressed="${cur===v}">${lab}</button>`;
  const box=(tab,h)=>{const b=document.createElement('div');b.className='m43set u45set';b.dataset.tab45=tab;b.innerHTML=h;el.insertBefore(b,sep||null);return b};
  box('화면',`<div class="s24h">흔들림 · 번쩍임 줄이기</div><div class="s24row">${seg('calm',1,'켬',U45.set.calm)}${seg('calm',0,'끔',U45.set.calm)}</div><div class="s24n">켜면 큰 마법을 써도 화면이 흔들리지 않고, 화면 전체가 번쩍이는 빛이 약해져요. 마법이 맞는 범위는 그대로예요. 이 기기에 저장돼요</div>`);
  box('화면',`<div class="s24h">시계 · 배터리</div><div class="s24row">${seg('clk',1,'보이기',U45.set.clk)}${seg('clk',0,'숨기기',U45.set.clk)}</div><div class="s24n">오른쪽 위 금화 옆에 지금 시각을, 알려 주는 휴대폰은 배터리도 보여요. 배터리가 20%보다 적으면 한 번 「낮음」 품질을 권해요</div>`);
  box('조작',`<div class="s24h">처음 손가락 안내</div><button type="button" class="s24item" data-u45s="guide" data-v="1">처음 안내 다시 보기 <small>움직이기 · 마법 · 물약 · 의뢰 받기</small></button>`);
  const it=(k,h)=>{const b=document.createElement('button');b.type='button';b.className='s24item';b.dataset.u45s=k;b.dataset.v='1';b.dataset.tab45='저장';b.innerHTML=h;el.appendChild(b)};
  it('save','지금 저장 <small>캐릭터는 저절로도 저장돼요</small>');it('help','캐릭터 선택 · 조작법 <small>다른 캐릭터 · 새 캐릭터</small>');
  el.querySelectorAll('[data-u45s]').forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.u45s,v=+b.dataset.v;
    if(k==='calm')u45SetCalm(v);else if(k==='clk'){U45.set.clk=v?1:0;u45Save();u45Clock()}
    else if(k==='guide'){set24Open(false);U45.set.guide=0;u45Save();u45GuideStart();return}
    else if(k==='save'){try{saveNow();msg('저장했어요','#d6b262')}catch(_){}}
    else if(k==='help'){set24Open(false);const h=document.getElementById('helpBtn');if(h)h.click();return}
    set24Draw();set24Place()})}catch(e){if(window.__QA)throw e}}}
// 휴대폰: 설정 칸은 ☰ 아래(창이 열려 있으면 옆 띠 곁)에
{const _pl=set24Place;set24Place=function(){const r=_pl.apply(this,arguments);try{if(u45Ph())u45SetPlace()}catch(e){if(window.__QA)throw e}return r}}
function u45SetPlace(){u45Vp();const el=SET24.el;if(!el||el.hidden)return;const w=el.offsetWidth,h=el.offsetHeight,m=8,vp=M22.vp();let x,y;const rail=document.body.classList.contains('u45rail')&&u45$('#u45rail');
  if(rail){const r=rail.getBoundingClientRect();if(M22.mode()==='L'){x=r.left-6-w;y=(vp.h-h)/2}else{x=(vp.w-w)/2;y=r.top-6-h}}
  else{const mb=u45$('#menuBtn'),r=mb?mb.getBoundingClientRect():{left:m,bottom:m};x=r.left;y=r.bottom+6}
  x=Math.min(Math.max(m,x),vp.w-m-w);y=Math.max(m,Math.min(y,vp.h-m-h));el.style.left=Math.round(x)+'px';el.style.top=Math.round(y)+'px'}
// 모든 파일이 set24Draw를 감싼 뒤(시작 직후) 바깥에서 한 번 더 감싼다 → 그리기가 다 끝나면 탭으로 나눔. 이보다 뒤에 감싼 것은 끝에 한 번 더(마이크로태스크)
U45.wrapDraw=()=>{const _d=set24Draw;set24Draw=function(){const r=_d.apply(this,arguments);try{u45Tabify();queueMicrotask(()=>{try{u45Tabify()}catch(_){}})}catch(e){if(window.__QA)throw e}return r}};
setTimeout(U45.wrapDraw,0);

/* ===== P6 위쪽 정보칸: 캐릭터 칸 누르면 펼침 · 알림판 누르면 5초 진하게 ===== */
document.addEventListener('click',e=>{if(!u45Ph())return;const w=e.target&&e.target.closest&&e.target.closest('#hud .who');if(!w)return;document.body.classList.toggle('u45who')});
addEventListener('pointerdown',e=>{if(!u45Ph())return;const q=e.target&&e.target.closest&&e.target.closest('#qhud');if(!q)return;q.classList.add('u45solid');clearTimeout(U45.solidT);U45.solidT=setTimeout(()=>q.classList.remove('u45solid'),5000)},true);

/* ===== HUD 갱신마다(초당 15번): 0.2초 띠 · 안내 / 0.5초 점 · 칸 / 1초 시계 ===== */
// 화면 크기(CSS 픽셀)를 --u45vw/--u45vh로: 휴대폰 칸 크기 계산이 실제 보이는 화면(M22.vp)을 따르게
function u45Vp(){const b=document.body;if(!b||typeof M22==='undefined')return;const v=M22.vp(),w=v.w+'px',h=v.h+'px';if(b.style.getPropertyValue('--u45vw')!==w)b.style.setProperty('--u45vw',w);if(b.style.getPropertyValue('--u45vh')!==h)b.style.setProperty('--u45vh',h)}
function u45Tick(now){if(now==null)now=performance.now();const ph=u45Ph();u45Vp();
  if(now>=U45.t2){U45.t2=now+200;u45Sync();if(U45.g)u45GuideTick(now)}
  if(!ph){if(now>=U45.t10){U45.t10=now+1000;const c=u45$('#u45clk');if(c&&!c.hidden)c.hidden=true;const mb=u45$('#menuBtn');if(mb&&mb.classList.contains('u45d'))mb.classList.remove('u45d')}return}
  if(now>=U45.t5){U45.t5=now+500;u45Build();u45DotTick();u45Marks()}
  if(now>=U45.t10){U45.t10=now+1000;u45Clock()}}
{const _uh=updateHud;updateHud=function(){const r=_uh.apply(this,arguments);try{u45Tick()}catch(e){if(window.__QA)throw e}return r}}

{const st=document.createElement('style');st.textContent=`
#u45bar,#u45rail,#u45clk{display:none}
/* 5 ☰ 메뉴 막대 */
body.m22 #hud .tools.open{background:none!important;border:none!important;padding:0!important;width:auto!important;flex-direction:column!important}
body.m22 #hud .tools.open>button:not(#menuBtn){display:none!important}
body.m22 #hud .tools.open #u45bar{display:flex;position:absolute;left:0;top:calc(100% + 6px);gap:4px;padding:5px;background:rgba(14,12,10,.95);border:1px solid #6a5636;border-radius:7px;pointer-events:auto;z-index:31;width:max-content;max-width:calc(var(--u45vw,100vw) - 24px);flex-wrap:wrap;box-shadow:0 6px 18px rgba(0,0,0,.55)}
body.m22P:has(#hud .tools.open) #qhud{visibility:hidden}/* 세로: 펼친 막대가 의뢰 알림판 밑에 깔리지 않게 */
body.m22P #hud .tools.open #u45bar{width:calc(var(--u45vw,100vw) - 30px);box-sizing:border-box}body.m22P #u45bar .u45c{flex:1 0 calc(25% - 4px)}
.u45c{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;width:60px;height:54px;padding:2px;box-sizing:border-box;border:1px solid #6a5636;border-radius:6px;background:linear-gradient(180deg,#2e2416,#17120c);color:#f0dfb4;font:inherit;font-size:11.5px;line-height:1.1;cursor:pointer;touch-action:manipulation}
.u45c svg{width:24px;height:24px;flex:0 0 auto;color:#e4c47a}.u45c span{white-space:nowrap}
.u45c.on{border-color:#e0bb62;background:linear-gradient(180deg,#5a4418,#2a1f0e);color:#fff}.u45c.on svg{color:#fff1c4}
/* 창 옆 띠 (가로: 오른쪽 · 세로: 아래) */
body.m22.u45rail #u45rail{display:flex;position:fixed;z-index:56;pointer-events:none;gap:3px}
body.m22L.u45rail #u45rail{right:calc(env(safe-area-inset-right,0px) + 1px);top:50%;transform:translateY(-50%);flex-direction:column}
body.m22P.u45rail #u45rail{bottom:calc(env(safe-area-inset-bottom,0px) + 1px);left:50%;transform:translateX(-50%);flex-direction:row}
#u45rail .u45c{pointer-events:auto;width:44px;height:min(42px,calc((var(--u45vh,100vh) - 12px) / var(--u45n,8) - 3px));font-size:9.5px;gap:1px;box-shadow:0 2px 6px rgba(0,0,0,.6)}
body.m22P #u45rail .u45c{height:36px;width:min(44px,calc((var(--u45vw,100vw) - 12px) / var(--u45n,8) - 3px))}
#u45rail .u45c svg{width:19px;height:19px}
/* P5 ☰ 옆 그림 단추 */
#u45quick{display:none}
body.m22 #u45quick{display:flex;gap:4px;pointer-events:auto;align-items:flex-start}
body.m22 #u45quick .u45q{width:40px;height:42px;padding:0}body.m22 #u45quick .u45q span{display:none}body.m22 #u45quick .u45q svg{width:22px;height:22px}
body.m22P #u45quick{gap:3px}body.m22P #u45quick .u45q{width:38px}
body.m22 #m22row #m22tp{margin-left:10px}
/* P6 위쪽 정보칸 */
body.m22 #hud .who{padding:3px 9px 3px 3px;gap:6px;pointer-events:auto;cursor:pointer}
body.m22 #hud .who .lv{width:30px;height:30px;font-size:13px}body.m22 #hud .who .lv small{font-size:7px}
body.m22 #hud .who .xpbar{height:3px;margin-top:3px;border:none;box-shadow:0 0 0 1px #3a3020}
body.m22:not(.u45who) #hud .who .rank,body.m22:not(.u45who) #hud .who .xptext,body.m22:not(.u45who) #g42hud{display:none!important}
body.m22.u45who #hud .who .xptext{display:block}
body.m22L #qhud{width:150px;box-sizing:border-box}body.m22P #qhud{width:140px;box-sizing:border-box}
body.m22 #qhud{background:rgba(14,12,10,.55);border-color:rgba(92,74,46,.7);text-shadow:0 1px 2px #000,0 0 3px #000}
body.m22 #qhud.u45solid{background:rgba(14,12,10,.88);border-color:#5c4a2e}
/* 3 빨간 점 */
.u45d:not(.node){position:relative}
.u45d::after{content:'';position:absolute;top:2px;right:2px;width:9px;height:9px;border-radius:50%;background:#ff3b30;box-shadow:0 0 0 1.5px #1a120a,0 0 6px rgba(255,60,40,.85);pointer-events:none;z-index:2}
body.m22 .tools:not(.open) #menuBtn:not(.u45d)::after{display:none!important}
body.m22 .tools:not(.open) #menuBtn.u45d::after{display:block!important;content:'';position:absolute;top:3px;right:3px;width:9px;height:9px;border-radius:50%;background:#ff3b30;box-shadow:0 0 0 1.5px #1a120a,0 0 6px rgba(255,60,40,.85)}
#panel .node.u45d::after{top:-3px;right:-3px}
/* 1 나가기 묻기 */
#u45exit{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.6);pointer-events:auto}#u45exit[hidden]{display:none}
#u45exit .card{max-width:340px;width:100%}#u45exit h2{margin:0 0 6px}#u45exit .row{display:flex;gap:10px;justify-content:space-between;margin-top:12px}#u45exit button{min-height:44px;flex:1}
/* 4 위쪽 띠 */
#qn21.u45band{top:calc(env(safe-area-inset-top,0px) + 4px);width:min(560px,calc(var(--u45vw,100vw) - 16px));padding:4px 6px;display:flex;align-items:center;gap:6px;border-radius:6px}
#qn21.u45band>:not(.u45bh){display:none}#qn21 .u45bh{display:none}#qn21.u45band .u45bh{display:flex;align-items:center;gap:6px;width:100%}
#qn21 .u45bt{flex:1 1 auto;min-width:0;text-align:left;background:none;border:none;color:#efe2c0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:6px 4px;min-height:36px}
#qn21 .u45bt b{color:#ffd34d}#qn21 .u45bk{flex:0 0 auto;min-height:36px;padding:4px 12px}
/* 8 이어하기 요약 */
#u45sum{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translateX(-50%);z-index:44;max-width:min(560px,calc(var(--u45vw,100vw) - 24px));box-sizing:border-box;padding:7px 14px;border:1px solid #c8a050;border-radius:18px;background:rgba(20,16,10,.93);color:#efe2c0;font-size:13px;line-height:1.35;text-align:center;pointer-events:none;transition:opacity .4s}
#u45sum.off{opacity:0}#u45sum[hidden]{display:none}
/* 11 시계 */
body.m22 #u45clk{display:inline;margin-left:6px;color:#cfc6b2;font-size:11px;white-space:nowrap}body.m22P #u45clk{display:block;margin-left:0}body.m22 #u45clk[hidden]{display:none}body.m22 #u45clk.low{color:#ff8a6a}
#u45bat{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 112px);transform:translateX(-50%);z-index:46;width:min(360px,calc(var(--u45vw,100vw) - 24px));box-sizing:border-box;padding:10px 12px;background:rgba(24,18,10,.97);border:1px solid #c8a050;border-radius:8px;color:#efe2c0;font-size:13px;line-height:1.45;pointer-events:auto}
#u45bat[hidden]{display:none}#u45bat p{margin:0 0 8px}#u45bat .row{display:flex;gap:8px;justify-content:space-between}#u45bat button{min-height:40px;flex:1}
/* 13 손가락 안내 */
#u45g{position:fixed;inset:0;z-index:40;pointer-events:none}#u45g[hidden],#u45g.hold{display:none}
#u45g .u45ring{position:fixed;border:2px solid #ffe08a;border-radius:12px;box-shadow:0 0 0 3px rgba(255,210,110,.35),0 0 18px 4px rgba(255,214,120,.65);animation:u45pulse 1.1s ease-in-out infinite alternate}
#u45g .u45f{position:fixed;width:34px;height:46px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.7));animation:u45tap 1.1s ease-in-out infinite}
#u45g .u45f.down{transform:rotate(180deg);animation-name:u45tapd}#u45g .u45f svg{width:100%;height:100%}
#u45g[data-k="move"] .u45f{animation-name:u45drag}
#u45g .u45say{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 112px);transform:translateX(-50%);width:max-content;max-width:min(440px,calc(var(--u45vw,100vw) - 24px));display:flex;align-items:center;gap:10px;padding:8px 8px 8px 14px;background:rgba(24,18,10,.95);border:1px solid #e0bb62;border-radius:10px;color:#fff1c4;font-size:14px;line-height:1.4;pointer-events:auto}
#u45g .u45say button{flex:0 0 auto;min-height:38px;padding:4px 10px;font-size:13px}
body.m22P #u45g .u45say,body.m22P #u45bat{top:calc(env(safe-area-inset-top,0px) + 120px)}
@keyframes u45pulse{from{opacity:.55}to{opacity:1}}
@keyframes u45tap{0%,100%{translate:0 0}50%{translate:0 7px}}@keyframes u45tapd{0%,100%{translate:0 0}50%{translate:0 -7px}}
@keyframes u45drag{0%{translate:0 0}60%{translate:46px -10px}100%{translate:0 0}}
@media (prefers-reduced-motion:reduce){#u45g .u45ring,#u45g .u45f{animation:none}}
/* 9 설정 탭 */
body.m22 #set24{max-height:calc(var(--u45vh,100vh) - 16px)}body.m22 #set24.u45t{width:min(360px,calc(var(--u45vw,100vw) - 16px))}
#set24 .u45tabs{display:flex;gap:3px;position:sticky;top:-10px;z-index:1;margin:-10px -12px 8px;padding:8px 8px 6px;background:rgba(20,16,10,.99);border-bottom:1px solid #4a3e2c}
#set24 .u45tab{flex:1 1 0;min-height:38px;padding:4px 2px;border:1px solid #5a4a36;background:#1e1a14;color:#cfc6b2;border-radius:6px;font-size:13.5px;cursor:pointer}
#set24 .u45tab.on{background:#5a4418;border-color:#d6b262;color:#fff}
#set24 .u45pane>.m43set+.m43set,#set24 .u45pane>*+.m43set{margin-top:6px}#set24 .u45pane[hidden]{display:none}
`;document.head.appendChild(st)}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{U45,U45W,U45C,u45Back,u45Guard,u45ExitAsk,u45ExitClose,u45Leave,u45Cells,u45Build,u45Go,u45Sync,u45RailOn,u45Marks,u45DotTick,u45PanelDots,u45SeenReset,u45Learn,
  u45Band,u45SumText,u45Sum,u45ClkText,u45Clock,u45BatAsk,u45BatClose,u45SetCalm,u45GuideMaybe,u45GuideStart,u45GuideEnd,u45GuideTick,u45GuideEl,U45G,u45Tabify,u45Sections,u45TabOf,u45TabRule,u45SetPlace,u45Tick})}catch(_){}},0);
window.u45TabRule=u45TabRule;
