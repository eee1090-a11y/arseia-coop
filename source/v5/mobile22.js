/* ---------- v22 MOBILE: 휴대폰 화면 (사용자 07:27 · 07:30 · 07:31) ----------
   · 가로 화면이 기본: 휴대폰을 눕히면(높이 500 이하 · 터치) 가로 배치(m22L). 세로(폭 640 이하)는 m22P. PC는 그대로('' → 아무 것도 안 바꿈).
     설치한 게임 창·전체 화면에서는 screen.orientation.lock('landscape')을 부탁하고, 세로이면 「가로로 돌려 주세요」 쪽지(닫을 수 있음).
   · 단축바: 휴대폰에서는 스킬·물약이 든 칸만 HP 구슬과 마나 구슬 사이에 보인다(44px). 넘치면 다음 줄로 이어진다. 저장된 칸(P.bar)은 그대로 — 보이기만 바꾼다.
     스킬 창에서 칸을 고르는 중(bindId)에는 빈 칸도 다 보인다(눌러서 넣을 수 있게).
   · 귀환 두루마리: 휴대폰에서는 물약 옆(단축바)에서 빼서 왼쪽 위 ☰ 옆으로 옮긴다. 던전·보스 싸움 중에는 한 번 더 묻는다(묻는 창은 손가락 자리와 떨어진 곳 · 열린 직후 0.4초는 안 눌림).
   · 카메라: 휴대폰에서 CZ = 화면 설정 배율 × (가로 .75 · 세로 .8) → 캐릭터가 작게, 더 넓게 보인다. 화면 좌표는 다 CZ로 나누므로(rel) 겨누기·클릭은 그대로 맞는다.
   · 확대 잠금: viewport에 maximum-scale=1 · user-scalable=no, 모든 HUD·창에 touch-action:pan-x pan-y(두 번 탭 확대·손가락 벌리기 막음 · 스크롤은 됨),
     iOS gesturestart · dblclick 막기, 터치 기기 입력 칸 16px. 그래도 확대되면 저절로 되돌리고, 안 되면 「화면 원래 크기로」 단추.
   mobile18.js 다음 어딘가(quest21.js 앞). b5.js(buildBar·updateHud·barEl)는 뒤에 붙지만 함수 선언이라 감쌀 수 있고, 실행은 시작 뒤에만 한다. */
const M22={force:null,vpF:null,K:{L:.75,P:.8},last:'',nextT:0,b:-1,qh:-1,zoomed:0,askT:0,hintKey:'arseia-m22hint',
  touch(){try{return navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches}catch(_){return false}},
  vp(){return this.vpF||{w:innerWidth,h:innerHeight}},
  // 'L' 가로 휴대폰 · 'P' 세로(좁은 화면) · '' PC
  mode(){if(this.force!=null)return this.force;const {w,h}=this.vp();if(this.touch()&&w>h&&h<=500&&w<=1000)return 'L';if(w<=640)return 'P';return ''},
  phone(){return !!this.mode()},
  scale(){const m=this.mode();return m?this.K[m]:1}};
const M22_META='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
// v18 MOB(☰ 접기 · 강화 아이콘 · 의뢰 칸 자리)를 가로 휴대폰에서도 켠다
if(typeof MOB==='object')MOB.on=function(){return M22.phone()};

/* 카메라: b1 resize 뒤에 휴대폰 배율을 곱한다 (캔버스 픽셀 수는 그대로) */
function m22Cam(){const k=M22.scale();if(k===1)return;const d0=DPR;
  CZ=GFX.zoom*k;DPR=Math.min(1.5,window.devicePixelRatio||1)*CZ;const cw=cv.clientWidth||innerWidth,ch=cv.clientHeight||innerHeight;
  W=cw/CZ;H=ch/CZ;cv.width=Math.round(cw*DPR/CZ);cv.height=Math.round(ch*DPR/CZ);lc.width=Math.ceil(W/2);lc.height=Math.ceil(H/2);
  if(d0!==DPR)m22Rebake()}
function m22Rebake(){try{if(P&&P.cls&&typeof heroBake==='function'){SC.bakeLeft=99;heroBake(P,Math.max(1,DPR)*HS*PK)}}catch(_){}}
{const _rs=resize;resize=function(){const d0=DPR;_rs.apply(this,arguments);m22Apply();m22Cam();if(M22.scale()===1&&d0!==DPR)m22Rebake()}}
addEventListener('resize',()=>{m22Apply();m22Cam()});

/* 몸(body) 표시: m22 · m22L · m22P */
function m22Apply(){const m=M22.mode(),b=document.body;if(!b)return;
  b.classList.toggle('m22',!!m);b.classList.toggle('m22L',m==='L');b.classList.toggle('m22P',m==='P');
  if(m!==M22.last){const was=M22.last;M22.last=m;M22.b=-1;M22.qh=-1;M22.nextT=0;
    if(typeof MOB==='object'){MOB.menu(false);MOB.qTop=-1;if(!m){const q=document.getElementById('qhud');if(q)q.style.top=''}}
    if(was!==''||m)setTimeout(()=>{try{if(P&&P.cls)buildBar()}catch(_){}},0);m22Hint()}
  return m}

/* 단축바: 휴대폰은 든 칸만 (CSS) · 고르는 중이면 다 · 물약 0개는 숨김 */
{const _bb=buildBar;buildBar=function(){_bb.apply(this,arguments);m22Bar()}}
function m22Bar(){const bar=document.getElementById('bar');if(!bar)return;
  bar.classList.toggle('m22all',!!bar.querySelector('.sk.binding'));
  for(const b of bar.querySelectorAll('[data-pot]')){const k=b.dataset.pot;let n=0;try{n=k==='tp'?tpCount():potTotal(k)}catch(_){}b.classList.toggle('m22zero',!(n>0))}}
// 휴대폰에서 보이는 단축칸 (시험·그림용)
function m22Shown(){const bar=document.getElementById('bar');return bar?[...bar.querySelectorAll('button.sk')].filter(b=>b.offsetParent!==null&&getComputedStyle(b).display!=='none'):[]}

/* 귀환 두루마리 단추 (휴대폰: 왼쪽 위 ☰ 옆) + 위험할 때 묻기 */
function m22TpRisky(){if(DG)return 'dg';for(const e of enemies){if(e.dead||!e.aggroed)continue;const t=TYPES[e.k];if(t&&(t.boss||t.mini)&&dist(e,P)<900)return 'boss'}return ''}
function m22TpPress(){if(!P||P.dead)return;if(TPC){msg('귀환 두루마리를 펼치는 중입니다 (움직이면 끊김)','#a39d8f');return}
  if(tpCount()<=0){useScroll();return}
  const r=m22TpRisky();if(r){m22Ask(r);return}useScroll()}
function m22Ask(why){let el=document.getElementById('m22ask');
  if(!el){el=document.createElement('div');el.id='m22ask';el.setAttribute('role','dialog');document.body.appendChild(el);
    el.addEventListener('pointerdown',e=>e.stopPropagation());
    el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(performance.now()-M22.askT<400)return;// 두 번 탭의 둘째 탭은 무시
      m22AskClose();if(b.dataset.go){M22.asked=1;try{useScroll()}finally{M22.asked=0}}})}
  el.innerHTML=`<p>${why==='dg'?'던전에서 나가 마을로 돌아갈까요?':'보스와 싸우는 중이에요. 마을로 돌아갈까요?'}</p><div class="m22a"><button type="button" class="ghost" data-no="1">그만두기</button><button type="button" class="primary" data-go="1">돌아가기</button></div>`;
  const tb=document.getElementById('m22tp'),r=tb&&tb.getBoundingClientRect();
  // 단추 바로 아래가 아니라 오른쪽 아래로 비켜서 연다 (같은 손가락 자리에 「돌아가기」가 오지 않게)
  if(r&&r.width){el.style.left=Math.round(r.right+12)+'px';el.style.top=Math.round(r.bottom+8)+'px'}else{el.style.left='50%';el.style.top='30%'}
  el.hidden=false;M22.askT=performance.now();clearTimeout(M22.askTO);M22.askTO=setTimeout(m22AskClose,8000)}
function m22AskClose(){const el=document.getElementById('m22ask');if(el)el.hidden=true;clearTimeout(M22.askTO)}
function m22TpBtn(){let b=document.getElementById('m22tp');if(b)return b;const tools=document.querySelector('#hud .tools');if(!tools)return null;
  const row=document.createElement('div');row.id='m22row';tools.parentNode.insertBefore(row,tools);row.appendChild(tools);
  b=document.createElement('button');b.type='button';b.id='m22tp';b.className='stonebox';b.title='귀환 두루마리: 잠시 뒤 가장 가까운 마을로 (던전·보스 싸움 중에는 한 번 더 물어요)';b.setAttribute('aria-label','귀환 두루마리');
  b.innerHTML=`<span class="m22ic"></span><em>0</em>`;row.appendChild(b);
  b.addEventListener('pointerdown',e=>e.stopPropagation());b.addEventListener('click',e=>{e.stopPropagation();m22TpPress()});return b}

/* 확대 잠금 */
function m22Meta(c){let m=document.querySelector('meta[name="viewport"]');if(!m){m=document.createElement('meta');m.name='viewport';(document.head||document.documentElement).appendChild(m)}const w=c||M22_META;if(m.content!==w)m.content=w;return m}
function m22ResetZoom(){const m=m22Meta('width=device-width,initial-scale=1.01,maximum-scale=1,user-scalable=no,viewport-fit=cover');setTimeout(()=>{m22Meta();try{scrollTo(0,0)}catch(_){}},60)}
function m22ZoomCheck(sc){const vv=window.visualViewport,s=sc!=null?sc:vv?vv.scale:1,z=s>1.02;let b=document.getElementById('m22zoom');
  if(z&&!b){b=document.createElement('button');b.type='button';b.id='m22zoom';b.className='primary';b.textContent='화면 원래 크기로';b.addEventListener('click',e=>{e.stopPropagation();m22ResetZoom();setTimeout(()=>m22ZoomCheck(),400)});document.body.appendChild(b)}
  if(b){b.hidden=!z;if(z){const ox=vv?vv.offsetLeft:0,oy=vv?vv.offsetTop:0;b.style.left=Math.round(ox+8)+'px';b.style.top=Math.round(oy+8)+'px';b.style.transform=`scale(${(1/s).toFixed(3)})`}}
  if(z&&!M22.zoomed&&sc==null){M22.zoomed=1;const a=document.activeElement;if(!(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)))m22ResetZoom()}// 한 번은 저절로 되돌린다
  if(!z)M22.zoomed=0;return z}
m22Meta();
try{if(window.visualViewport){visualViewport.addEventListener('resize',()=>m22ZoomCheck());visualViewport.addEventListener('scroll',()=>{if(M22.zoomed)m22ZoomCheck()})}}catch(_){}
for(const t of ['gesturestart','gesturechange'])document.addEventListener(t,e=>{e.preventDefault()},{passive:false});
document.addEventListener('dblclick',e=>{const t=e.target;if(!(t&&t.closest&&t.closest('input,textarea,select')))e.preventDefault()},{passive:false});
document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1){const t=e.target;if(!(t&&t.closest&&t.closest('#game')))e.preventDefault()}},{passive:false});

/* 세로이면 「가로로 돌려 주세요」 · 가로 잠금 */
function m22Lock(){try{const o=screen.orientation;if(!o||!o.lock)return Promise.resolve(false);return o.lock('landscape').then(()=>true,()=>false)}catch(_){return Promise.resolve(false)}}
function m22InApp(){try{return matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true||!!document.fullscreenElement}catch(_){return false}}
function m22Hint(){let el=document.getElementById('m22hint');const want=M22.mode()==='P'&&(M22.touch()||M22.force!=null)&&!M22.hintOff();
  if(!want){if(el)el.hidden=true;return false}
  if(!el){el=document.createElement('div');el.id='m22hint';el.setAttribute('role','status');document.body.appendChild(el);
    const fs=!!(document.documentElement.requestFullscreen&&screen.orientation&&screen.orientation.lock);
    el.innerHTML=`<span>휴대폰을 <b>가로로 돌려 주세요</b>. 화면이 더 넓게 보여요. 세로로도 할 수 있어요.</span>${fs?'<button type="button" class="ghost" data-fs="1">가로 전체 화면</button>':''}<button type="button" class="ghost" data-x="1" aria-label="닫기">✕</button>`;
    el.addEventListener('pointerdown',e=>e.stopPropagation());
    el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();
      if(b.dataset.fs){try{document.documentElement.requestFullscreen({navigationUI:'hide'}).then(m22Lock,()=>{})}catch(_){}}
      M22.hintOff(1);el.hidden=true})}
  el.hidden=false;return true}
M22.hintOff=function(set){if(set){this.hintGone=1;try{localStorage.setItem(this.hintKey,'1')}catch(_){}return true}if(this.hintGone)return true;try{return localStorage.getItem(this.hintKey)==='1'}catch(_){return false}};
// 설치한 창·전체 화면이면 첫 터치 때 가로로 잠가 달라고 한다 (안 되는 브라우저는 조용히 넘어감)
addEventListener('pointerdown',function f(e){if(e.pointerType!=='touch')return;removeEventListener('pointerdown',f,true);if(M22.phone()&&m22InApp())m22Lock()},true);
try{if(screen.orientation&&screen.orientation.addEventListener)screen.orientation.addEventListener('change',()=>{m22Apply();m22Cam()})}catch(_){}

// 스킬 창 아래 단축칸 줄 접기 · 펴기 (휴대폰만 · 보이기만)
document.addEventListener('click',e=>{const t=e.target;if(!M22.phone()||!(t&&t.closest&&t.closest('#panel .dock20 .dk-t')))return;document.body.classList.toggle('m22dk')});
/* 매 HUD 갱신(초당 15번 중 0.2초마다): 아래 막대 높이 → 대화·말 걸기·알림 자리, 의뢰 칸 높이, 귀환 단추 개수 */
{const _uh=updateHud;updateHud=function(){_uh.apply(this,arguments);m22Tick()}}
function m22Tick(){const m=M22.mode();if(m!==M22.last)m22Apply();if(!m)return;const now=performance.now();if(now<M22.nextT)return;M22.nextT=now+200;
  const tb=m22TpBtn();if(tb){const n=tpCount(),em=tb.querySelector('em');if(em.textContent!==String(n))em.textContent=n;tb.classList.toggle('none',n<=0);
    const ic=tb.querySelector('.m22ic');if(!ic.firstChild)try{ic.innerHTML=miscIcon('tp',24)}catch(_){}}
  m22Bar();const vh=M22.vp().h,bt=document.querySelector('#hud .bottom');if(bt){const b=Math.max(0,Math.round(vh-bt.getBoundingClientRect().top));if(b!==M22.b){M22.b=b;document.body.style.setProperty('--m22b',b+'px')}}
  if(m==='L'){const q=document.getElementById('qhud');if(q&&!q.hidden){const top=q.getBoundingClientRect().top,qh=Math.max(60,Math.round(vh-M22.b-10-top));if(qh!==M22.qh){M22.qh=qh;document.body.style.setProperty('--m22qh',qh+'px')}}}}

{const st=document.createElement('style');st.textContent=`
#m22row{display:contents}#m22tp,#m22hint,#m22ask{display:none}
#m22zoom{position:fixed;z-index:9998;transform-origin:0 0;padding:10px 16px;font-size:15px;pointer-events:auto}
#m22zoom[hidden]{display:none}
@media (pointer:coarse){input,textarea,select{font-size:16px!important}}
body.m22 input,body.m22 textarea,body.m22 select{font-size:16px!important}
body #hud,body #hud *,body #panel *,body #intro *,body #death *,body #chat *,body #qhud,body #qhud *,body #wmap *,body #kbwin *,body #patch *{touch-action:pan-x pan-y}
body #game{touch-action:none}
body.m22 #m22row{display:flex;gap:6px;align-items:flex-start;pointer-events:none}
body.m22 #m22tp{display:inline-flex;align-items:center;gap:3px;min-width:52px;height:42px;padding:0 7px;border-radius:4px;pointer-events:auto;position:relative}
body.m22 #m22tp .m22ic{display:inline-flex;width:24px;height:24px}body.m22 #m22tp .m22ic img{width:24px!important;height:24px!important}
body.m22 #m22tp em{font-style:normal;font-size:13px;color:#cfe6ff;font-variant-numeric:tabular-nums}
body.m22 #m22tp.none{opacity:.45}
#m22ask{position:fixed;z-index:61;background:rgba(18,14,10,.97);border:1px solid #d6b262;border-radius:6px;padding:10px 12px;box-shadow:0 6px 20px rgba(0,0,0,.7);width:max-content;max-width:min(300px,calc(100vw - 24px));pointer-events:auto;color:#ece4d0}
body #m22ask:not([hidden]){display:block}#m22ask p{margin:0 0 8px;font-size:14px;line-height:1.45}
#m22ask .m22a{display:flex;gap:10px;justify-content:space-between}#m22ask .m22a button{min-height:42px;min-width:92px;font-size:14px}
#m22hint{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translateX(-50%);z-index:44;width:min(360px,calc(100% - 24px));box-sizing:border-box;background:rgba(20,16,10,.95);border:1px solid #c8a050;border-radius:6px;padding:8px 10px;font-size:13px;line-height:1.45;color:#efe2c0;pointer-events:auto;align-items:center;gap:8px;flex-wrap:wrap}
body.m22P #m22hint:not([hidden]){display:flex}#m22hint span{flex:1 1 180px}#m22hint b{color:#ffd76a}#m22hint button{min-height:40px;padding:4px 10px;font-size:13px}
/* 휴대폰 공통 (가로·세로) — 미디어 쿼리 대신 몸 표시로: 가로 휴대폰은 폭이 640을 넘어서 */
body.m22 #menuBtn{display:inline-block;font-size:17px;line-height:1;padding:6px 11px;position:relative;min-width:44px;min-height:42px}
body.m22 #hud .tools{flex-direction:column;align-items:stretch;gap:4px}
body.m22 #hud .tools:not(.open) button:not(#menuBtn){display:none!important}
body.m22 #hud .tools.open{background:rgba(14,12,10,.92);border:1px solid #5c4a2e;border-radius:4px;padding:5px;z-index:30;position:relative;pointer-events:auto}
body.m22 .tools.open #menuBtn{align-self:flex-start}
body.m22 .tools:has(.lvup):not(.open) #menuBtn::after{content:'';position:absolute;top:3px;right:3px;width:8px;height:8px;border-radius:50%;background:#ffd76a;box-shadow:0 0 6px #ffb84a}
body.m22 #buffs{display:none!important}
body.m22 #pframes .pf.me{display:none}
body.m22 #hud .zone small{display:none}
body.m22 #mbuffs{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:3px;max-width:150px;pointer-events:auto}
body.m22 #mbuffs .pbi{position:relative;width:20px;height:20px;border:1px solid #6a5a30;border-radius:3px;background:rgba(16,13,10,.85);display:inline-flex;align-items:center;justify-content:center}
body.m22 #mbuffs .pbi svg{width:15px;height:15px}
body.m22 .orb{width:58px;height:58px}
body.m22 #minimap{width:88px;height:88px}
body.m22 .xpbar{width:110px}
body.m22 .who{padding:6px 10px 6px 6px}
body.m22 #hud .bottom{display:flex;flex-wrap:nowrap;justify-content:space-between;align-items:flex-end;gap:8px}
body.m22 #hud .barwrap{order:0;flex:1 1 0;min-width:0;overflow:visible;justify-content:center;flex-basis:0}
body.m22 #hud .bar{display:flex;flex-direction:row;flex-wrap:wrap;gap:3px;justify-content:center;padding:3px;width:auto;max-width:100%;box-sizing:border-box}
body.m22 #hud .bar .barrow{display:contents}
body.m22 #hud .bar .sep{display:none}
body.m22 #hud .bar .sk{width:44px;height:44px}
body.m22 #hud .bar .sk svg{width:20px;height:20px}
body.m22 #hud .bar .sk .ab{display:none}
body.m22 #hud .bar .sk.empty{display:none}
body.m22 #hud .bar.m22all .sk.empty{display:flex}
body.m22 #hud .bar [data-pot="tp"],body.m22 #hud .bar .m22zero{display:none!important}
/* 가로 휴대폰 844×390 */
body.m22L #hud{padding:calc(env(safe-area-inset-top,0px) + 8px) calc(env(safe-area-inset-right,0px) + 10px) calc(env(safe-area-inset-bottom,0px) + 6px) calc(env(safe-area-inset-left,0px) + 10px)}
body.m22L .leftcol{gap:5px}
body.m22L .who{padding:4px 9px 4px 4px;gap:7px}
body.m22L .lv{width:34px;height:34px;font-size:14px}body.m22L .lv small{font-size:8px}
body.m22L .name{font-size:12.5px}body.m22L .rank{font-size:11px}
body.m22L .xpbar{width:100px;margin-top:3px}body.m22L .xptext{display:none}
body.m22L .rightcol{gap:3px}body.m22L .zone{font-size:13px}body.m22L .gold{font-size:11px}
body.m22L #minimap{width:76px;height:76px}
body.m22L #hud .tools.open{flex-direction:row;flex-wrap:wrap;width:min(420px,calc(100vw - 140px))}
body.m22L #qhud{right:calc(env(safe-area-inset-right,0px) + 8px);width:172px;font-size:11px;padding:4px 7px;max-height:var(--m22qh,120px);overflow:hidden}body.m22L #qhud b{font-size:12px}
body.m22L #act{bottom:calc(var(--m22b,70px) + 10px)}
body.m22L #log{bottom:calc(var(--m22b,70px) + 58px);width:min(400px,calc(100% - 450px))}
body.m22L #target{top:calc(env(safe-area-inset-top,0px) + 8px);bottom:auto;min-width:200px}
body.m22L #chat{left:calc(env(safe-area-inset-left,0px) + 8px);bottom:calc(var(--m22b,70px) + 8px);width:210px;font-size:12px}
body.m22L #chatLog{max-height:52px}
body.m22L #chat.open{top:calc(env(safe-area-inset-top,0px) + 8px);bottom:auto;width:min(440px,calc(100% - 200px));z-index:29}
body.m22L #chat.open #chatLog{max-height:150px}
body.m22L #party{top:calc(env(safe-area-inset-top,0px) + 110px)}
/* 가로 휴대폰: 스킬 창 아래 단축칸 줄(dnd20)은 한 줄 21칸으로 얇게 · 글줄을 누르면 접고 편다 */
body.m22L #panel{padding:6px}body.m22L #panel .card{width:min(860px,100%);padding:10px 14px}body.m22L #panel .phead{margin-bottom:4px}body.m22L #panel .phead h1{font-size:18px}
body.m22L #panel .dock20{margin-top:6px;padding:4px 5px 5px}
body.m22L #panel .dock20 .dk-g{grid-template-columns:repeat(21,minmax(0,1fr));gap:2px}
body.m22L #panel .dock20 .dks{max-height:40px}body.m22L #panel .dock20 .dks b{font-size:8px}
body.m22 #panel .dock20 .dk-t{cursor:pointer;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:44px;position:relative;min-height:22px;line-height:22px}
body.m22 #panel .dock20 .dk-t::after{content:'▾ 접기';position:absolute;right:0;top:0;color:#ffd76a;font-size:11px}
body.m22.m22dk #panel .dock20 .dk-t::after{content:'▸ 펴기'}
body.m22.m22dk #panel .dock20 .dk-g{display:none}
body.m22 .sk .t22s{width:11px;height:11px}body.m22 .sk .t22s svg{width:9px;height:9px}body.m22 .sk.t22 .k{left:14px}
/* 세로 휴대폰 390×844 */
body.m22P #hud{padding-left:calc(env(safe-area-inset-left,0px) + 8px);padding-right:calc(env(safe-area-inset-right,0px) + 8px)}
body.m22P .orb{width:54px;height:54px}body.m22P #hud .bottom{gap:6px}
body.m22P #act{bottom:calc(var(--m22b,70px) + 12px)}
body.m22P #target{top:auto;bottom:calc(var(--m22b,70px) + 60px);min-width:180px}
body.m22P #log{bottom:calc(var(--m22b,70px) + 124px)}
body.m22P #chat{left:8px;bottom:calc(var(--m22b,70px) + 250px);width:min(300px,calc(100% - 178px));font-size:12px}
body.m22P #chatLog{max-height:90px}
body.m22P #chat.open{top:calc(env(safe-area-inset-top,0px) + 130px);bottom:auto;left:8px;width:calc(100% - 16px);z-index:29;font-size:13px}body.m22P #chat.open #chatLog{max-height:28vh}
body.m22P #qhud{right:8px;width:150px;font-size:11px;padding:4px 7px;max-height:34vh;overflow:hidden}
`;document.head.appendChild(st)}
m22Apply();m22Cam();m22TpBtn();
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{M22,m22Apply,m22Cam,m22Bar,m22Shown,m22TpPress,m22TpRisky,m22Ask,m22AskClose,m22ZoomCheck,m22ResetZoom,m22Meta,m22Hint,m22Lock,M22_META,buildBar});for(const k of ['CZ','W','H','DPR'])Object.defineProperty(window.__game,k,{configurable:true,get:()=>({CZ,W,H,DPR})[k]})}catch(_){}},0);
