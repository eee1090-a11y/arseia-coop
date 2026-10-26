/* ---------- v48 휴대폰 손보기 6 (사용자 2026-10-26 「지금까지 업데이트된 그래픽들과 모바일 최적화 방안들을 반영해서 다음 패치로 올려줘」 · 제안 6의 추천 1~6번) ----------
   모두 휴대폰(M22.phone())에서만 바뀐다. PC 화면 · 조작은 그대로. 게임 수치 · 맞히기 판정 · 캐릭터 저장은 그대로.
   1 작은 단추 크게(손가락으로 누르는 높이 40px 이상): 의뢰 알림판 「▾ 의뢰」「일지」(22px) · 「▶ 가기」(30) · 능력치 +1/+5(34×28) · 성장 창 「받기」 같은 단추(25) ·
     지역 지도 위 탭 · 닫기(25) · 스킬 창 아래 단축칸 줄(30×26 → 40×40, 아래 6번에서 한 줄로 밀어 보기).
   2 저장 지키기: 휴대폰 브라우저에서도 브라우저에게 「저장을 함부로 지우지 말아 달라」(navigator.storage.persist)고 한 번 부탁한다(설치한 창은 원래 app21.js가 함).
     그리고 7일에 한 번까지(마을 안 · 5레벨부터 · 게임을 연 지 45초 뒤 · 계정 저장을 안 쓸 때) 위쪽에 「캐릭터 저장 코드를 복사해 두세요」 쪽지.
     「코드 복사하기」를 누르면 원래 있던 길(캐릭터 선택 화면 · 내 캐릭터 카드의 「내보내기」)을 그대로 열어 코드를 보여 주고 복사한다. 「다음에」로 닫힘.
     마지막으로 보여 준 때는 새 키 'arseia-backup48'(숫자 하나)에만 적는다. 캐릭터 키는 읽기만 한다. 설정 ⚙ 저장 탭에도 「저장 코드 복사하기」.
   3 왼손 모드(설정 ⚙ 조작 · 처음은 끔 · 이 기기 설정 'arseia-device-v45'의 lh, 없으면 끔): 걷는 조이스틱은 화면 오른쪽 45%, 화면 누르기 마법은 왼쪽.
     단축바는 왼쪽(HP 구슬 옆)으로 붙이고, 오른쪽에 있던 의뢰 알림판 · 오른쪽 세로 단축창 · 「이야기」 단추 · 더 좋은 장비 쪽지 · 빠른 말 단추 · 대화창 · 동료 칸은 좌우를 바꾼다.
     조이스틱 쪽을 가르는 곳(b5 · town22 · mux45의 「W*.45」)은 모두 m48Joy() 하나로 본다. 손으로 옮겨 둔 자리(길게 눌러 옮기기)는 그대로 둔다.
   4 마을 사람 · 노점 이름표(휴대폰): 화면에서 약 13px(의뢰인 14px) 크기로 그리고 어두운 바탕을 깐다(보기 거리 · 손가락 확대를 바꿔도 같은 크기).
     노점은 간판 위에 같은 이름표. 이름표를 누르면 그 사람을 누른 것과 같다(town22 tw22Pick → 멀면 걸어가서 말 걸기 · 노점이면 상점).
   5 단축바 밀어서 쪽 넘기기(가로 휴대폰 · 쪽이 둘 이상일 때): 단축바 위에서 손가락을 옆으로 빠르게 밀면(0.32초 안에 24px · 옆으로가 위아래의 2배 · 단축바 높이 안)
     왼쪽으로 밀면 다음 쪽, 오른쪽이면 앞 쪽. 밀기로 본 손가락은 마법을 쓰지 않는다: 누르기 시전 취소 · 끌어서 겨누기 취소 ·
     「꾹 = 계속 쓰기」(ux45b Q1)의 첫 시전을 0.09초 늦춰 그 사이에 밀기를 알아본다. ⚙ 칸 바꾸기 · 배치 바꾸기 · 칸 고르는 중 · 단축바 옮기는 중에는 밀기 없음.
   6 스킬 트리(가로 휴대폰): 위계를 왼쪽→오른쪽으로 눕혀(갈래는 위→아래) 모든 위계가 한 화면에 들어오게. 아이콘은 들어가는 만큼(34~48px).
     오른쪽 설명 칸은 260px(v28)이고, 좁은 휴대폰(667×375 같은 것)에서 트리가 다 안 들어가면 설명 칸을 그만큼 좁힌다(가장 좁게 130px · 사용자 「설명칸을 좁혀줘 그럼. 다 보이게」).
     그래도 모자라는 아주 좁은 화면이면 트리 칸 안에서 옆으로 밀어 보고, 「▸」 · 「◂」 표시로 더 있다는 것을 보여 준다.
     설명 칸은 오른쪽에서 따로 위아래로 넘긴다. 3차 · 상위 기술 목록은 작은 칸으로 줄여 한 화면에. 아래 단축칸 줄은 40×40 한 줄(옆으로 밀기 · ◂ ▸ · 끌면 끝에서 저절로 밀림).
   붙는 곳: gear47.js 다음, b5.js 앞. b5.js의 let(panel · pbody · tab · bindId)은 함수 안에서만(시작 뒤) 쓴다. */
const M48={BK_KEY:'arseia-backup48',BK_DAYS:7,BK_LV:5,BK_WAIT:45000,BK_HIDE:20000,bkT0:0,bkOn:0,bkTick:0,qaLast:null,pq:0,
  LBL:13,LBL_BIG:14,hit:[],hitN:0,hitF:-9,
  SW_ON:24,SW_MIN:36,SW_MS:320,SW_BAND:22,GRACE:.09,sw:null,
  TMIN:38,TLOW:34,TMAX:58,NMIN:34,NLOW:30,NMAX:48,ST:26,DW:260,DMIN:130,GAP:8,dsl:0,ds:0,dsT:0,lay:0};
if(typeof M45==='object'&&M45.dev&&M45.dev.lh==null)M45.dev.lh=0;
try{if(!window.__QA){const o=JSON.parse(localStorage.getItem(M45.key)||'null');if(o&&o.lh===1)M45.dev.lh=1}}catch(_){}
const m48Ph=()=>typeof M22==='object'&&M22.phone();
const m48Lh=()=>m48Ph()&&!!(M45&&M45.dev&&M45.dev.lh===1);
// 조이스틱 쪽인가(화면 단위 x): 보통은 왼쪽 45%, 왼손 모드는 오른쪽 45%
function m48Joy(x){return m48Lh()?x>W*.55:x<W*.45}
function m48SetLh(v){M45.dev.lh=v?1:0;m45DevSave();m48Body();try{if(P&&P.cls)buildBar()}catch(_){}}
function m48Body(){const b=document.body,on=m48Lh();if(b.classList.contains('m48lh')!==on){b.classList.toggle('m48lh',on);try{s26Lay()}catch(_){}}
  try{const U=typeof U45G==='object'&&U45G;if(U){U[0].say=on?'화면 오른쪽을 누른 채 손가락을 밀면 걸어요':'화면 왼쪽을 누른 채 손가락을 밀면 걸어요';U[1].say=on?'이 단추를 누르면 마법을 써요 · 화면 왼쪽을 눌러도 돼요':'이 단추를 누르면 마법을 써요 · 화면 오른쪽을 눌러도 돼요'}}catch(_){}}
{const _a=m22Apply;m22Apply=function(){const r=_a.apply(this,arguments);try{m48Body()}catch(_){}return r}}

/* ===== 3 왼손 모드: 자리 바꾸기 ===== */
// 오른쪽 세로 단축창(side26)을 왼쪽 가로 → 손으로 옮긴 자리가 있으면 그대로
{const _sl=s26Lay;s26Lay=function(){const r=_sl.apply(this,arguments);try{m48SideFlip()}catch(err){if(window.__QA)throw err}return r}}
function m48SideFlip(){if(!m48Lh()||M22.mode()!=='L'||(FB28.pos&&FB28.pos[M22.mode()+'_side']))return;const hr=document.querySelector('#hud');if(!hr)return;const h=hr.getBoundingClientRect();
  for(const b of document.querySelectorAll('#bar button.sk.s26')){const l=parseFloat(b.style.left),w=parseFloat(b.style.width);if(!(l>=0)||!(w>0))continue;b.style.left=Math.round(h.left+(h.right-l-w))+'px'}}
// 오른쪽 위 칸(작은 지도) 아래 높이: 왼손 모드에서 동료 칸 · 장비 쪽지를 그 아래로
function m48Lay(){if(!m48Lh()||M22.mode()!=='L')return;const rc=document.querySelector('#hud .rightcol');if(!rc||!rc.offsetParent)return;const t=Math.round(rc.getBoundingClientRect().bottom+6);
  if(t!==M48.lay){M48.lay=t;document.body.style.setProperty('--m48rt',t+'px')}}
// 처음 손가락 안내: 걷기 고리를 오른쪽에
{const _gd=u45GuideDraw;u45GuideDraw=function(){const r=_gd.apply(this,arguments);try{const g=U45.g,el=document.getElementById('u45g');if(g&&el&&m48Lh()&&U45G[g.i].k==='move'){const vw=M22.vp().w;
  for(const e of [el.querySelector('.u45ring'),el.querySelector('.u45f')]){if(!e||e.hidden)continue;const l=parseFloat(e.style.left)||0,w=e.offsetWidth||parseFloat(e.style.width)||0;e.style.left=Math.round(vw-l-w)+'px'}}}catch(err){if(window.__QA)throw err}return r}}

/* ===== 2 저장 지키기 ===== */
function m48Persist(st){st=st||(navigator&&navigator.storage);if(!st||typeof st.persist!=='function')return 0;
  try{Promise.resolve(typeof st.persisted==='function'?st.persisted():false).then(p=>p?true:st.persist()).catch(()=>{})}catch(_){return 0}return 1}
function m48BkLast(){if(window.__QA)return M48.qaLast;try{const v=+localStorage.getItem(M48.BK_KEY);return v>0?v:null}catch(_){return null}}
function m48BkMark(t){t=t||Date.now();if(window.__QA){M48.qaLast=t;return}try{localStorage.setItem(M48.BK_KEY,String(t))}catch(_){}}
function m48BkDue(now){const L=m48BkLast();return L==null||now-L>=M48.BK_DAYS*864e5||now<L}
function m48BkWant(t){if(!m48Ph()||!m45InGame()||paused||P.dead||DG||!panel.hidden)return false;if(typeof ACC!=='undefined'&&ACC)return false;
  if(P.lvl<M48.BK_LV||t-M48.bkT0<M48.BK_WAIT)return false;if(typeof U45==='object'&&U45.g)return false;if(typeof wmapIsOpen==='function'&&wmapIsOpen())return false;
  if(!(typeof safe24Here==='function'?safe24Here():inSafe(P.x,P.y,0)))return false;return m48BkDue(Date.now())}
function m48BkEl(){let el=document.getElementById('m48bk');if(el)return el;el=document.createElement('div');el.id='m48bk';el.hidden=true;el.setAttribute('role','status');
  el.innerHTML='<span><b>캐릭터 지키기</b> 브라우저 기록을 지우면 캐릭터가 사라질 수 있어요. 가끔 저장 코드를 복사해 메모장 같은 곳에 두세요</span><button type="button" data-m48bk="go">코드 복사하기</button><button type="button" class="ghost" data-m48bk="x">다음에</button>';
  el.addEventListener('pointerdown',e=>e.stopPropagation());el.addEventListener('click',e=>{const b=e.target.closest('[data-m48bk]');if(!b)return;e.stopPropagation();m48BkHide();if(b.dataset.m48bk==='go')m48Export()});
  document.body.appendChild(el);return el}
function m48BkShow(){const el=m48BkEl();el.hidden=false;M48.bkOn=performance.now();m48BkMark();return el}
function m48BkHide(){const el=document.getElementById('m48bk');if(el)el.hidden=true;M48.bkOn=0}
// 원래 있던 내보내기: 캐릭터 선택 화면(☰ 설정 → 캐릭터 선택과 같은 길)을 열고 내 캐릭터 카드의 「내보내기」를 누른다
function m48Export(){try{saveNow()}catch(_){}const hb=document.getElementById('helpBtn');if(hb)hb.click();const b=document.querySelector(`#introBody [data-exp="${curSlot}"]`);if(!b)return false;b.click();
  const box=document.querySelector(`#introBody [data-expbox="${curSlot}"]`);if(box&&box.scrollIntoView)try{box.scrollIntoView({block:'center'})}catch(_){}return true}
function m48BkTick(t){if(!M48.bkT0&&m45InGame())M48.bkT0=t;if(!m45InGame()){M48.bkT0=0;m48BkHide();return}
  if(!M48.pq&&m48Ph()&&!window.__QA){M48.pq=1;m48Persist()}
  if(M48.bkOn){if(t-M48.bkOn>M48.BK_HIDE||!panel.hidden||paused)m48BkHide();return}
  if(!window.__QA&&m48BkWant(t))m48BkShow()}

/* ===== 4 이름표 크게 · 누르면 말 걸기 ===== */
const m48Big=()=>m48Ph()&&!DG;
// 이 그리기에서 생긴 이름표에 그 사람을 붙여 둔다(누를 곳 찾기)
{const _f=twDrawFolk;twDrawFolk=function(d){const n=QLBL.length,r=_f.apply(this,arguments);for(let i=n;i<QLBL.length;i++)if(!QLBL[i].d)QLBL[i].d=d;return r}}
{const _f=drawNpc;drawNpc=function(d){const n=QLBL.length,r=_f.apply(this,arguments);for(let i=n;i<QLBL.length;i++)if(!QLBL[i].d)QLBL[i].d=d;return r}}
// 노점: 간판 위에 같은 크기의 이름표(휴대폰만)
{const _rd=drawRegionDecor;drawRegionDecor=function(d){const r=_rd.apply(this,arguments);if(d&&d.k==='shop'&&d.tshop&&d._s&&m48Big()&&!IN)QLBL.push({x:d._s.x,y:d._s.y-68,n:SHOPN[d.shopType]||'상점',mk:'',c:'#ffd27a',say:'',sa:0,ph:d.x,d,shop:1});return r}}
const m48LblSort=(a,b)=>a._k-b._k;
function m48Hit(x0,y0,x1,y1,d){const o=M48.hit[M48.hitN]||(M48.hit[M48.hitN]={});o.x0=x0;o.y0=y0;o.x1=x1;o.y1=y1;o.d=d;M48.hitN++}
const M48F={};const m48Font=(w,px)=>{const k=w+'|'+px;return M48F[k]||(M48F[k]=`${w} ${px}px ${FONT}`)};
{const _tl=twLabels;twLabels=function(){if(!m48Big())return _tl.apply(this,arguments);M48.hitN=0;M48.hitF=frameN;if(!QLBL.length)return;S();
  const ps=W2S(P.x,P.y),k=1/Math.max(.3,CZ),put=M48.put||(M48.put=[]);let np=0;
  for(const l of QLBL)l._k=Math.hypot(l.x-ps.x,l.y-ps.y);QLBL.sort(m48LblSort);ctx.textAlign='center';
  for(const l of QLBL){const fs=Math.round((l.big?M48.LBL_BIG:M48.LBL)*k),pad=Math.round(4*k);let shown=false;
    if(l.n){const w=l.n.length*fs*.94+pad*2,h=fs+pad*1.6;let hit=false;for(let i=0;i<np;i++){const o=put[i];if(Math.abs(o.x-l.x)<(o.w+w)/2&&Math.abs(o.y-l.y)<(o.h+h)/2){hit=true;break}}
      if(!hit){const o=put[np]||(put[np]={});o.x=l.x;o.y=l.y;o.w=w;o.h=h;np++;shown=true;
        const x0=l.x-w/2,y0=l.y-fs-pad*.5;ctx.fillStyle=l.d?'rgba(12,10,8,.62)':'rgba(12,10,8,.45)';ctx.beginPath();ctx.roundRect?ctx.roundRect(x0,y0,w,h,h/2):ctx.rect(x0,y0,w,h);ctx.fill();
        if(l.d){ctx.strokeStyle=l.shop?'rgba(255,210,122,.55)':'rgba(214,178,98,.4)';ctx.lineWidth=Math.max(1,k);ctx.stroke();m48Hit(x0,y0,x0+w,y0+h,l.d)}
        ctx.font=m48Font(l.big?700:600,fs);ctx.lineWidth=Math.max(2,2.4*k);ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(l.n,l.x,l.y);ctx.fillStyle=l.c;ctx.fillText(l.n,l.x,l.y)}}
    if(l.mk){const y=l.y-(shown||l.n?fs+pad+6:(l.big?22:20))+Math.sin(time*3+(l.ph||0))*3;wxMarkBadge(l,y);ctx.font=`800 ${l.big?26:24}px ${DISPLAY}`;ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(l.mk,l.x,y);ctx.fillStyle=wxMarkCol(l);ctx.fillText(l.mk,l.x,y)}
    if(l.say)twBubble(l.x,l.y-(l.mk?fs+44:fs+pad+4),l.say,l.sa)}
  QLBL.length=0}}
// 이름표를 누르면 그 사람(노점)을 고른다: 이름표가 몸보다 먼저(위에 그려지므로)
function m48LblPick(sx,sy){if(frameN-M48.hitF>3)return null;const sl=4;for(let i=M48.hitN-1;i>=0;i--){const o=M48.hit[i];if(sx>=o.x0-sl&&sx<=o.x1+sl&&sy>=o.y0-sl&&sy<=o.y1+sl&&tw22Box(o.d,true)&&(IN?IN.list.includes(o.d):decor.includes(o.d)))return o.d}return null}
{const _p=tw22Pick;tw22Pick=function(sx,sy,touch){if(touch&&m48Big()){const d=m48LblPick(sx,sy);if(d)return d}return _p.apply(this,arguments)}}

/* ===== 5 단축바 밀어서 쪽 넘기기 ===== */
function m48SwOk(){if(!m43PageOn()||M43.pgN<2||!P||!P.cls)return false;const bar=document.getElementById('bar');if(!bar||bar.classList.contains('m22all'))return false;
  if(bindId||(typeof UXB==='object'&&UXB.edit)||(FB28.drag&&FB28.drag.on))return false;return true}
function m48Page(d){const n=Math.max(1,M43.pgN);M43.pg=((M43.pg+(d>0?1:-1))%n+n)%n;m43Page();const bar=document.getElementById('bar');if(bar){bar.classList.remove('m48sl','m48sr');void bar.offsetWidth;bar.classList.add(d>0?'m48sl':'m48sr');clearTimeout(M48.swT);M48.swT=setTimeout(()=>bar.classList.remove('m48sl','m48sr'),220)}return M43.pg}
addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||!m48Ph()||!e.target||!e.target.closest||!e.target.closest('#bar')){return}if(M48.sw&&performance.now()-M48.sw.t<1500||!m48SwOk())return;
  const r=document.getElementById('bar').getBoundingClientRect();M48.sw={pid:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),on:false,top:r.top,bot:r.bottom}},true);
// 꾹 = 계속 쓰기(ux45b): 밀기일 수 있는 동안 첫 시전을 조금 늦춘다(기다림 → 0.09초 뒤 계속 쓰기)
document.addEventListener('pointerdown',e=>{const w=M48.sw;if(!w||w.pid!==e.pointerId||typeof UXB!=='object')return;const s=UXB.bars.get(e.pointerId);if(s&&s.hold==='on'){s.hold='wait';s.w=UXB.HOLD_AIM-M48.GRACE}},true);
function m48SwCancel(pid){if(typeof M45==='object'&&M45.aim&&M45.aim.pid===pid)M45.aim=null;const s=typeof UXB==='object'&&UXB.bars.get(pid);if(s){s.cancel=true;s.hold=null;clearTimeout(s.timer)}}
addEventListener('pointermove',e=>{const w=M48.sw;if(!w||w.pid!==e.pointerId)return;const dx=e.clientX-w.x,dy=e.clientY-w.y,ax=Math.abs(dx),ay=Math.abs(dy),dt=performance.now()-w.t;
  if(w.on)return;if(e.clientY<w.top-M48.SW_BAND||e.clientY>w.bot+M48.SW_BAND||ay>ax&&ay>12||dt>M48.SW_MS){M48.sw=null;return}
  if(ax>=M48.SW_ON&&ax>=ay*2){w.on=true;m48SwCancel(w.pid)}},true);
function m48SwUp(e){const w=M48.sw;if(!w||w.pid!==e.pointerId)return;M48.sw=null;if(!w.on||e.type!=='pointerup')return;const dx=e.clientX-w.x;if(Math.abs(dx)>=M48.SW_MIN&&m48SwOk())m48Page(dx<0?1:-1)}
addEventListener('pointerup',m48SwUp,true);addEventListener('pointercancel',m48SwUp,true);

/* ===== 6 스킬 트리: 위계를 옆으로 눕혀 한 화면에 ===== */
const m48TreeOn=()=>M22.mode()==='L'&&typeof panel!=='undefined'&&!panel.hidden&&tab==='tree'&&!!P&&!!P.cls;
const m48Clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// 설명 칸 폭: v28 그대로 260px(세부 설정). 좁은 가로 휴대폰에서 트리가 다 안 들어가면 그만큼만 좁힌다(사용자 2026-10-26 「설명칸을 좁혀줘 그럼. 다 보이게」 · 가장 좁게 130px)
// 위계 수 × 38px(아이콘 34px) + 왼쪽 갈래 이름 칸이 들어갈 만큼. 844×390은 언제나 260px
const m48Hdr=tr=>[...tr.children].filter(e=>e.tagName==='DIV'&&!e.classList.contains('rl')&&!e.classList.contains('node')&&!e.classList.contains('nodeplus'));
function m48DescW(tr){const nt=tr?tr.querySelectorAll(':scope>.rl').length:0;if(!nt)return M48.DW;const cw=pbody.clientWidth||600,need=(m48Hdr(tr).length?46:0)+nt*M48.TMIN+2;return m48Clamp(cw-M48.GAP-need,M48.DMIN,M48.DW)}
function m48Tree(){const card=panel.querySelector('.card');const on=m48TreeOn();if(card)card.classList.toggle('m48t',on);if(!on)return;
  // 3차 · 상위 기술 목록: 설명과 함께 한 칸에서 넘긴다
  const lst=pbody.querySelector(':scope>.j2adv');if(lst){const sc=document.createElement('div');sc.className='m48sc';const mv=[...pbody.querySelectorAll(':scope>.j2note,:scope>.j3note')].concat([lst],[...pbody.querySelectorAll(':scope>.detail')]);
    pbody.insertBefore(sc,mv[0]);for(const e of mv)sc.appendChild(e)}
  const tr=pbody.querySelector('.t27l .tree');if(card)card.style.setProperty('--m48dw',m48DescW(tr)+'px');if(tr)m48Flip(tr);m48Dock()}
// 위계(줄) ↔ 갈래(칸)를 바꾼다: 아이콘 · 선 · 이름표 자리만(누르기 · 끌기 · 「+」는 그대로 같은 단추)
function m48Flip(tr){if(tr.dataset.m48)return;const nodes=[...tr.querySelectorAll(':scope>.node')],rls=[...tr.querySelectorAll(':scope>.rl')];if(!nodes.length||!rls.length)return;
  const sc=tr.parentNode,aw=sc.clientWidth,ah=sc.clientHeight;if(!aw||!ah)return;tr.dataset.m48='1';
  const px=v=>parseFloat(v)||0,T=rls.map(e=>px(e.style.top)).sort((a,b)=>a-b),RH=T.length>1?T[1]-T[0]:58,T0=T[0];
  const X=[...new Set(nodes.map(n=>px(n.style.left)+25))].sort((a,b)=>a-b);let CW=0;for(let i=1;i<X.length;i++){const g=X[i]-X[i-1];if(g>1&&(!CW||g<CW))CW=g}if(!CW)CW=60;
  const hdr=m48Hdr(tr);
  const nt=T.length,nb=Math.round((X[X.length-1]-X[0])/CW)+1,LW=hdr.length?46:0,ST=M48.ST;
  // 설명 칸을 가장 좁게 해도 모자라면(아주 좁은 휴대폰) 칸 34px · 아이콘 30px까지
  const TW=m48Clamp(Math.floor((aw-LW-2)/nt),M48.TLOW,M48.TMAX),BH=m48Clamp(Math.floor((ah-ST-2)/nb),M48.TLOW,62),N=m48Clamp(Math.min(TW-4,BH-6),TW<M48.TMIN||BH<M48.TMIN?M48.NLOW:M48.NMIN,M48.NMAX);
  const nx=y=>LW+(y-(T0+25))*TW/RH+TW/2,ny=x=>ST+(x-X[0])*BH/CW+BH/2,Wn=LW+nt*TW,Hn=ST+nb*BH;
  for(const n of nodes){const cx=px(n.style.left)+25,cy=px(n.style.top)+25;n.style.left=Math.round(nx(cy)-N/2)+'px';n.style.top=Math.round(ny(cx)-N/2)+'px';n.style.width=n.style.height=N+'px'}
  rls.forEach(e=>{const r=Math.round((px(e.style.top)-T0)/RH);e.style.left=(LW+r*TW)+'px';e.style.top='0px';e.style.width=TW+'px';e.style.height=ST+'px';
    const b=e.querySelector('b');if(b){const m=/(\d+)\s*(위계|단계|단)/.exec(b.textContent);if(m)b.textContent=m[1]+m[2]}
    for(const t of e.childNodes)if(t.nodeType===3)t.nodeValue=t.nodeValue.replace(/레벨\s*/,'Lv')});
  for(const e of hdr){const l=px(e.style.left),w=e.offsetWidth||CW;e.style.left='0px';e.style.width=LW+'px';e.style.top=Math.round(ny(l+w/2)-BH/2)+'px';e.style.height=BH+'px';e.classList.add('m48h')}
  const svg=tr.querySelector(':scope>svg.lines');if(svg){svg.setAttribute('width',Wn);svg.setAttribute('height',Hn);
    for(const p of svg.querySelectorAll('path')){const d=p.getAttribute('d')||'';let o='';const re=/([MLVH])\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?/g;let m;
      while((m=re.exec(d))){const c=m[1],a=+m[2];if(c==='M'||c==='L'){const b=+m[3];o+=`${c}${Math.round(nx(b)*10)/10} ${Math.round(ny(a)*10)/10}`}else if(c==='V')o+=`H${Math.round(nx(a)*10)/10}`;else o+=`V${Math.round(ny(a)*10)/10}`}
      p.setAttribute('d',o)}}
  tr.style.width=Wn+'px';tr.style.height=Hn+'px';tr.classList.add('m48f');
  // 「+」를 고른 아이콘 오른쪽 위로 다시
  for(const b of tr.querySelectorAll(':scope>.nodeplus')){const n=tr.querySelector(`:scope>[data-node="${b.dataset.learn}"]`);if(!n)continue;const sz=b.offsetWidth||32;
    b.style.left=Math.round(px(n.style.left)+N-sz/2-2)+'px';b.style.top=Math.round(Math.max(0,px(n.style.top)-9))+'px'}
  // 다 안 들어가면 옆으로 밀기 + 표시
  const l=sc.parentNode;for(const c of l.querySelectorAll(':scope>.m48cue'))c.remove();
  if(Wn>aw+1||Hn>ah+1){for(const k of ['l','r']){const c=document.createElement('button');c.type='button';c.className='m48cue m48c'+k;c.innerHTML=`<svg viewBox="0 0 12 20" width="12" height="20" aria-hidden="true"><path d="M${k==='l'?'9 3 3 10l6 7':'3 3l6 7-6 7'}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;c.setAttribute('aria-label',k==='l'?'트리 앞쪽 보기':'트리 뒤쪽 보기');
      c.addEventListener('click',e=>{e.stopPropagation();sc.scrollBy({left:(k==='l'?-1:1)*aw*.7,behavior:'smooth'})});l.appendChild(c)}
    const upd=()=>{const L=l.querySelector('.m48cl'),R=l.querySelector('.m48cr');if(L)L.hidden=sc.scrollLeft<4;if(R)R.hidden=sc.scrollLeft+sc.clientWidth>=sc.scrollWidth-4};
    sc.addEventListener('scroll',upd,{passive:true});
    const s0=pbody.querySelector(`.tree [data-node="${nodeSel}"]`);if(s0){const x=px(s0.style.left);if(x+N>aw)sc.scrollLeft=x-aw/2}upd()}
  return {TW,BH,N,nt,nb,Wn,Hn,aw,ah}}
// 아래 단축칸 줄: 40×40 한 줄, 옆으로 밀기 · ◂ ▸ · 다시 그려도 밀어 둔 자리 그대로
function m48Dock(){const g=pbody.querySelector('.dock20 .dk-g');if(!g)return;const w=document.createElement('div');w.className='m48dw';g.before(w);w.appendChild(g);
  for(const k of ['l','r']){const c=document.createElement('button');c.type='button';c.className='m48dc m48d'+k;c.innerHTML=`<svg viewBox="0 0 12 20" width="12" height="20" aria-hidden="true"><path d="M${k==='l'?'9 3 3 10l6 7':'3 3l6 7-6 7'}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;c.setAttribute('aria-label',k==='l'?'앞 칸 보기':'뒤 칸 보기');
    c.addEventListener('click',e=>{e.stopPropagation();g.scrollBy({left:(k==='l'?-1:1)*g.clientWidth*.7,behavior:'smooth'})});w.appendChild(c)}
  const upd=()=>{M48.dsl=g.scrollLeft;w.querySelector('.m48dl').hidden=g.scrollLeft<4;w.querySelector('.m48dr').hidden=g.scrollLeft+g.clientWidth>=g.scrollWidth-4};
  g.scrollLeft=M48.dsl;g.addEventListener('scroll',upd,{passive:true});upd()}
// 끌어 놓는 중 줄 끝에 가면 저절로 민다
{const _m=dndMove;dndMove=function(x,y){const r=_m.apply(this,arguments);try{m48DockEdge(x,y)}catch(_){}return r}}
function m48DockEdge(x,y){const g=DND.on&&m48TreeOn()&&pbody.querySelector('.m48dw .dk-g');if(!g){M48.ds=0;return}const r=g.getBoundingClientRect();
  M48.ds=y>=r.top-28&&y<=r.bottom+28?(x<r.left+36?-1:x>r.right-36?1:0):0;
  if(M48.ds&&!M48.dsT)M48.dsT=setInterval(()=>{const g=DND.on&&pbody.querySelector('.m48dw .dk-g');if(!g||!M48.ds){clearInterval(M48.dsT);M48.dsT=0;return}g.scrollLeft+=M48.ds*14;M48.dsl=g.scrollLeft;_dndOver()},50)}
function _dndOver(){try{const i=dndSlotAt(DND.x,DND.y);if(i!==DND.over){pbody.querySelectorAll('.dks.over').forEach(e=>e.classList.remove('over'));if(i>=0){const e=pbody.querySelector(`[data-dock="${i}"]`);if(e)e.classList.add('over')}DND.over=i}}catch(_){}}
{const _rp=renderPanel;renderPanel=function(){const r=_rp.apply(this,arguments);try{m48Tree()}catch(err){if(window.__QA)throw err}return r}}
{const _cp=closePanel;closePanel=function(){const r=_cp.apply(this,arguments);try{const c=panel.querySelector('.card');if(c)c.classList.remove('m48t')}catch(_){}return r}}

/* ===== HUD 갱신마다(초당 15번): 1초에 한 번 왼손 자리 · 저장 쪽지 ===== */
{const _uh=updateHud;updateHud=function(){const r=_uh.apply(this,arguments);try{const t=performance.now();if(t>=M48.bkTick){M48.bkTick=t+1000;m48Body();m48Lay();m48BkTick(t)}}catch(err){if(window.__QA)throw err}return r}}

/* ===== 설정 ⚙: 왼손 모드(조작) · 저장 코드 복사하기(저장) — 휴대폰만 ===== */
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);try{const el=SET24.el;if(!el||el.hidden||!m48Ph())return;const sep=el.querySelector('.s24sep'),v=M45.dev.lh===1?1:0;
  const seg=(x,lab)=>`<button type="button" class="s24seg${v===x?' on':''}" data-m48lh="${x}" aria-pressed="${v===x}">${lab}</button>`;
  const box=document.createElement('div');box.className='m43set m48set';box.dataset.tab45='조작';
  box.innerHTML=`<div class="s24h">왼손 모드</div><div class="s24row">${seg(0,'끔')}${seg(1,'켬')}</div><div class="s24n">켜면 걷는 조이스틱이 화면 오른쪽, 마법 단축바와 화면 누르기 마법이 왼쪽으로 가요. 의뢰 알림판 · 이야기 단추도 왼쪽으로 옮겨요. 이 기기에 저장돼요</div>`;
  el.insertBefore(box,sep||null);box.querySelectorAll('[data-m48lh]').forEach(b=>b.onclick=e=>{e.stopPropagation();m48SetLh(+b.dataset.m48lh);set24Draw();set24Place()});
  if(P&&P.cls&&curSlot>=0){const it=document.createElement('button');it.type='button';it.className='s24item';it.dataset.tab45='저장';it.dataset.m48exp='1';it.innerHTML='저장 코드 복사하기 <small>캐릭터를 다른 곳에 옮기거나 지켜 둘 때</small>';el.appendChild(it);
    it.onclick=e=>{e.stopPropagation();set24Open(false);m48BkMark();m48Export()}}}catch(err){if(window.__QA)throw err}}}

{const st=document.createElement('style');st.textContent=`
/* 1 단추 크게 */
body.m22 #qhud .qh-top button{min-height:40px;padding:0 10px}
body.m22 #qhud .m45go{min-height:40px;min-width:64px;padding:0 12px}
body.m22 #pbody .attr .btns button{width:40px;height:40px}
body.m22 #pbody .v20row .btns button,body.m22 #pbody .v20box .btns button,body.m22 #pbody .g42tabs button{min-height:40px}
body.m22 #wmap .wtop button{min-height:40px;min-width:44px;padding:0 12px}
/* 2 저장 쪽지 */
#m48bk{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translateX(-50%);z-index:45;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;width:max-content;max-width:min(520px,calc(100vw - 24px));box-sizing:border-box;padding:6px 10px;background:rgba(18,14,10,.95);border:1px solid #c8a050;border-radius:8px;color:#e8e2d2;font-size:12.5px;line-height:1.4;box-shadow:0 4px 14px rgba(0,0,0,.5);pointer-events:auto}
#m48bk[hidden]{display:none}#m48bk span{flex:1 1 240px;min-width:0}#m48bk b{color:#ffd76a;margin-right:4px}#m48bk button{min-height:40px;padding:0 12px;font-size:13px}
/* 3 왼손 모드 */
body.m22L.m48lh #hud .barwrap{justify-content:flex-start}
body.m22L.m48lh #qhud{right:auto;left:calc(env(safe-area-inset-left,0px) + 8px)}
body.m22L.m48lh.s26on #qhud{left:var(--s26w,8px)}
body.m22L.m48lh #act{right:auto;left:calc(env(safe-area-inset-left,0px) + 202px)}
body.m22L.m48lh.m45side #act{left:calc(env(safe-area-inset-left,0px) + 250px)}
body.m22L.m48lh #chat{left:auto;right:calc(env(safe-area-inset-right,0px) + 8px)}
body.m22L.m48lh #pframes{position:fixed;left:auto;right:calc(env(safe-area-inset-right,0px) + 8px);top:var(--m48rt,140px);z-index:5}
body.m22L.m48lh #m45eq{left:auto;right:calc(env(safe-area-inset-right,0px) + 10px);top:var(--m48rt,140px)}
body.m22L.m48lh #m45qcb{left:auto;right:calc(env(safe-area-inset-right,0px) + 10px)}
body.m22L.m48lh #m45qc{left:auto;right:calc(env(safe-area-inset-right,0px) + 60px)}
/* 5 쪽 넘김 손맛 */
@keyframes m48sl{from{transform:translateX(14px);opacity:.6}to{transform:none;opacity:1}}@keyframes m48sr{from{transform:translateX(-14px);opacity:.6}to{transform:none;opacity:1}}
body.m22L #bar.m48sl .sk:not(.m43off){animation:m48sl .18s ease-out}body.m22L #bar.m48sr .sk:not(.m43off){animation:m48sr .18s ease-out}
@media (prefers-reduced-motion:reduce){body.m22L #bar.m48sl .sk,body.m22L #bar.m48sr .sk{animation:none}}
/* 6 스킬 트리 (가로 휴대폰) */
body.m22L #panel .card.m48t{display:flex;flex-direction:column;overflow:hidden;height:100%;min-height:0;box-sizing:border-box}
body.m22L #panel .card.m48t>.phead{flex:0 0 auto}
body.m22L #panel .card.m48t #pbody{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;overflow:hidden}
body.m22L #panel .card.m48t #pbody>*{flex:0 0 auto}
body.m22L #panel .card.m48t #pbody>.t27row,body.m22L #panel .card.m48t #pbody>.m48sc{flex:1 1 auto;min-height:0}
body.m22L #panel .card.m48t .t27row{flex-wrap:nowrap;align-items:stretch;gap:8px;margin:0}
body.m22L #panel .card.m48t .t27l{flex:1 1 auto;min-width:0;max-width:none;display:flex;flex-direction:column;position:relative}
body.m22L #panel .card.m48t .t27l .treescroll{flex:1 1 auto;min-height:0;overflow:auto;margin:0;padding:0;overscroll-behavior:contain;scrollbar-width:thin}
body.m22L #panel .card.m48t .t27r{flex:0 0 var(--m48dw,260px);min-width:0;max-width:var(--m48dw,260px);position:static;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
body.m22L #panel .card.m48t .t27r .detail{padding:8px 10px}
body.m22L #panel .card.m48t .m48sc{overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
body.m22L:not(.m43pts) #panel .card.m48t .j2note,body.m22L:not(.m43pts) #panel .card.m48t .j3note{display:none}
body.m22L #panel .card.m48t .treetabs{margin-bottom:4px}
#panel .tree.m48f{margin:0}
#panel .tree.m48f .rl{flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;font-size:10px;line-height:1.15;white-space:nowrap;overflow:hidden;padding-top:1px}
#panel .tree.m48f .rl b{font-size:10.5px}
#panel .tree.m48f .m48h{position:absolute;display:flex;align-items:center;justify-content:center;font-size:11px;text-align:center;line-height:1.1}
#panel .tree.m48f .node svg{width:24px;height:24px}
#panel .t27l .m48cue{position:absolute;top:0;bottom:0;width:30px;z-index:4;padding:0;border:0;border-radius:0;color:#ffd76a;min-height:0;display:flex;align-items:center;justify-content:center}
#panel .t27l .m48cue[hidden]{display:none}
#panel .t27l .m48cl{left:0;background:linear-gradient(90deg,rgba(18,15,12,.95),rgba(18,15,12,0))}
#panel .t27l .m48cr{right:0;background:linear-gradient(270deg,rgba(18,15,12,.95),rgba(18,15,12,0))}
body.m22L #panel .card.m48t .j2adv{grid-template-columns:repeat(auto-fill,minmax(124px,1fr));gap:4px;margin:4px 0 6px}
body.m22L #panel .card.m48t .j2row{min-height:40px;padding:2px 5px;gap:5px}
body.m22L #panel .card.m48t .j2row svg{width:30px;height:30px}
body.m22L #panel .card.m48t .j2row .nl{left:24px;top:22px}
body.m22L #panel .card.m48t .j2row small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.m22L #panel .card.m48t .j2row .cmk{position:absolute;left:3px;bottom:3px;margin:0;line-height:0;z-index:2}body.m22L #panel .card.m48t .j2row .cmk svg{width:12px;height:12px}
body.m22L #panel .card.m48t .j2row .t22r{transform:scale(.6);transform-origin:0 0}
body.m22L #panel .card.m48t .dock20{position:relative;bottom:auto;margin:6px -4px 0;box-shadow:none;padding:3px 5px 4px}
body.m22L #panel .card.m48t .dock20 .dk-t{min-height:18px;line-height:18px;margin-bottom:2px}
body.m22L #panel .card.m48t .m48dw{position:relative}
body.m22L #panel .card.m48t .dock20 .dk-g{display:flex;gap:3px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;overscroll-behavior:contain}
body.m22L #panel .card.m48t .dock20 .dk-g::-webkit-scrollbar{display:none}
body.m22.m22dk #panel .card.m48t .dock20 .dk-g,body.m22.m22dk #panel .card.m48t .m48dc{display:none}
body.m22L #panel .card.m48t .dock20 .dks{flex:0 0 40px;width:40px;height:40px;max-height:none;aspect-ratio:auto;touch-action:pan-x}
body.m22L #panel .card.m48t .dock20 .dks b{font-size:9px}
body.m22L #panel .card.m48t .dock20 .dk44{flex:0 0 auto;align-self:center;margin:0 2px;padding:0 4px;font-size:10px;line-height:1.2;max-width:40px;white-space:normal;text-align:center;border-left:1px solid #6a5634}
body.m22L #panel .card.m48t .m48dc{position:absolute;top:0;bottom:0;width:34px;z-index:4;padding:0;border:0;border-radius:0;color:#ffd76a;min-height:0;display:flex;align-items:center;justify-content:center}
body.m22L #panel .card.m48t .m48dc[hidden]{display:none}
body.dnd20 #panel .m48dc,body.dnd20 #panel .m48cue{pointer-events:none}
body.m22L #panel .card.m48t .m48dl{left:0;background:linear-gradient(90deg,rgba(18,15,12,.97) 30%,rgba(18,15,12,0))}
body.m22L #panel .card.m48t .m48dr{right:0;background:linear-gradient(270deg,rgba(18,15,12,.97) 30%,rgba(18,15,12,0))}
`;document.head.appendChild(st)}
setTimeout(()=>{try{m48Body();if(window.__game)Object.assign(window.__game,{M48,m48Joy,m48Lh,m48SetLh,m48Persist,m48BkWant,m48BkShow,m48BkHide,m48BkDue,m48Export,m48Page,m48SwOk,m48Flip,m48Tree,m48LblPick})}catch(_){}},0);
