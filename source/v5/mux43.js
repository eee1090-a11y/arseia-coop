/* ---------- v43 휴대폰 화면·조작 개선 + 자동 물약 (사용자 2026-10-23 12:47Z 「추천 1~7번」 · 「자동물약까지 넣어도 될 것 같아.」) ----------
   1~5 · 7은 휴대폰(M22.phone())에서만 바뀐다. PC 화면은 그대로(6의 붉은 테두리와 8 자동 물약만 PC에도). 저장 형식 · 게임 수치 · 맞히기 판정은 그대로.
   1 단축바 한 줄 + 쪽 넘기기(가로 휴대폰): 채워진 스킬 칸을 칸 순서대로 8개씩 쪽으로 나눠 한 쪽만 보인다. 옆의 「1/3」 쪽 단추를 누르면 다음 쪽.
     물약은 어느 쪽에서나 보임 · P.bar는 그대로(보이기만) · 칸을 고르는 중(.m22all)에는 다 보임 · side26으로 빠진 칸은 쪽 계산에서 뺌 · 쪽 번호는 이번 접속 동안만.
   2 키보드 글자 숨기기: 단추 글의 「(F)」「(T)」「(L)」… 와 단축칸 왼쪽 위 키(.k · 물약 Q E)를 휴대폰에서 숨긴다. 안내 문장은 「☰ → 스킬 트리에서」처럼.
     글을 바꾸는 단추(#act · ☰ 메뉴 단추 · 도감 열기 · 지도 닫기)는 원래 글을 기억해 두고 보이는 글만 바꾼다(textContent를 읽으면 원래 글).
   3 싸울 때 의뢰 알림판 저절로 접기: 나를 노린 적이 600 안에 있으면 「▸ 의뢰 N」 한 줄로 접고, 싸움이 끝나고 4초 뒤 다시 편다. 접고 펴기는 1초에 한 번까지.
     손으로 접어 둔 알림판(P.sq.hide)은 건드리지 않는다. 저절로 접힌 알림판을 누르면 그 싸움 동안은 펴 둔다. P.sq.hide는 바꾸지 않는다(저장 그대로).
   4 가운데 알림 글자(#log): 가로 휴대폰은 화면 위쪽 가운데(왼쪽 위 이름 칸 · 위 가운데 적 이름 칸 아래)로 · 휴대폰은 한 번에 2줄까지 · 3.5초 뒤 사라짐(PC 5초 그대로).
     기록창을 길게 눌러 옮긴 자리(FB28 pos)는 그대로(그 자리가 이 자리보다 앞선다).
   5 창 머리 얇게(가로 휴대폰): 제목 · 탭 · 작은 ✕(누르는 칸 40px)를 한 줄에. 스킬 트리 위쪽 긴 설명 줄은 접어 두고 「설명 보기」로 편다(이번 접속 동안 기억).
   6 생명 위험 알림: 생명이 최대의 30% 아래면 화면 네 가장자리가 은은하게 붉어진다(맥박처럼 1.6초). 30% 위면 사라짐. 그림 한 겹(투명도만 움직임).
     휴대폰은 내려가는 순간 한 번 25ms 진동(되는 기기만 · 최소 5초 간격) · 설정 ⚙ 「위험 알림 진동」(기기 설정 arseia-device-v28 의 vib, 없으면 켬).
   7 시작 화면: 휴대폰에서는 캐릭터 칸(이어하기 · 새 캐릭터)을 제목 바로 아래로 올리고, 이야기 글은 「이야기 보기」를 눌러야 보인다.
   8 자동 물약(PC · 휴대폰): 설정 ⚙ 「자동 물약」 생명 [끔 · 30% · 50%] · 마나 [끔 · 20% · 40%]. 캐릭터마다 P.apot={hp,mp}(없으면 끔 · 켠 것만 저장).
     고른 % 아래로 내려가면 손으로 누를 때와 같은 길(usePotion → drinkPotion: 가장 좋은 등급 · 재사용 대기 9초/7초 · 3초 지속 회복 · 시험의 방 규칙)로 마신다.
     안 마시는 때: 죽음 · 창 열림(paused) · 그 물약이 회복 중(P.potHot[k]) · 재사용 대기 중 · 마을 안전 지대 · 건물 안 · 시험의 방 마나 물약. 재사용 대기 안내 글은 자동 쪽에서 안 띄운다.
     물약이 없으면 「자동 물약: 생명력 물약이 없습니다」를 한 번만(다시 생길 때까지). 같이 하기에서도 내 캐릭터(P)만.
   붙는 곳: g42*.js 다음, tap20.js · dnd20.js · b5.js 앞. b5.js의 let(panel · pbody · tab · bindId)은 함수 안에서만(실행은 시작 뒤) 쓴다. */
const M43={PER:8,per:8,pg:0,pgN:1,
  FIGHT_R:600,UNFOLD:4000,FLIP:1000,qAuto:0,qUser:0,qCalm:-1e9,qLast:-1e9,qT:0,
  LOG_N:2,LOG_MS:3500,LOG_TOP:66,
  LOW:.3,VIB_MS:25,VIB_GAP:5000,low:0,vibT:-1e9,vib:ms=>{try{if(navigator.vibrate)navigator.vibrate(ms)}catch(_){}},
  AP_HP:[0,.3,.5],AP_MP:[0,.2,.4],apOut:{hp:0,mp:0},
  keyEls:new Set(),keyT:0};
if(typeof FB28==='object'&&FB28.vib==null)FB28.vib=1;
try{if(!window.__QA){const o=JSON.parse(localStorage.getItem(FB28.key)||'null');if(o&&o.vib===0)FB28.vib=0}}catch(_){}
// 기기 설정 저장: 예전처럼 zoom · pos를 쓰고 vib만 덧붙인다 (캐릭터 키와 상관없는 기기 키)
{const _s=fb28Save;fb28Save=function(){const r=_s.apply(this,arguments);if(window.__QA)return r;try{const o=JSON.parse(localStorage.getItem(FB28.key)||'null');if(o&&typeof o==='object'){o.vib=FB28.vib===0?0:1;localStorage.setItem(FB28.key,JSON.stringify(o))}}catch(_){}return r}}

/* ===== 1 단축바 쪽 넘기기 ===== */
const m43PageOn=()=>M22.mode()==='L';
function m43Fill(bar){return [...bar.querySelectorAll('button.sk[data-slot]')].filter(b=>!b.classList.contains('empty')&&!b.classList.contains('s26'))}
// 한 쪽 칸 수: 8칸까지, 좁은 휴대폰(가로 667 같은)은 두 구슬 사이에 한 줄로 들어가는 만큼만 (칸 44 + 틈 3 · 쪽 단추 40 · 보이는 물약)
function m43Per(bar){const w=bar.parentNode&&bar.parentNode.clientWidth;if(!w)return M43.PER;const pots=[...bar.querySelectorAll('[data-pot]')].filter(b=>getComputedStyle(b).display!=='none').length;
  return Math.max(3,Math.min(M43.PER,Math.floor((w-10-43-pots*47+3)/47)))}
function m43Page(){const bar=document.getElementById('bar');if(!bar)return;const sk=bar.querySelectorAll('button.sk[data-slot]'),fill=m43Fill(bar),on=m43PageOn(),per=on?m43Per(bar):M43.PER,n=on?Math.max(1,Math.ceil(fill.length/per)):1;
  M43.per=per;M43.pgN=n;if(M43.pg>=n)M43.pg=0;
  for(const b of sk){const i=fill.indexOf(b);b.classList.toggle('m43off',n>1&&i>=0&&Math.floor(i/per)!==M43.pg)}
  let pb=document.getElementById('m43pg');
  if(n>1){if(!pb||!bar.contains(pb)){if(pb)pb.remove();pb=document.createElement('button');pb.type='button';pb.id='m43pg';const sep=bar.querySelector('.sep');(sep?sep.parentNode:bar).insertBefore(pb,sep||null)}
    const t=`${M43.pg+1}/${n}`;if(pb.dataset.t!==t){pb.dataset.t=t;pb.innerHTML=`<b>${t}</b><small>▸</small>`;pb.title=`단축칸 다음 쪽 (지금 ${M43.pg+1}쪽 / 모두 ${n}쪽)`;pb.setAttribute('aria-label',pb.title)}}
  else if(pb)pb.remove()}
function m43PageNext(){M43.pg=(M43.pg+1)%Math.max(1,M43.pgN);m43Page()}
// 옆 단축창(s26Lay)이 칸을 뺀 다음, 옮긴 자리(fb28Apply 'bar')를 재기 전에 쪽을 나눈다
{const _sl=s26Lay;s26Lay=function(){const r=_sl.apply(this,arguments);try{m43Page()}catch(err){if(window.__QA)throw err}return r}}
{const _bp=barPress;barPress=function(b){if(b&&b.id==='m43pg'){m43PageNext();return}return _bp.apply(this,arguments)}}

/* ===== 2 키보드 글자 숨기기 ===== */
const M43_KEYRX=/\s?\((?:[A-Z]|F\d{1,2}|Enter|Esc|Tab)\)/g;
const m43Strip=s=>String(s).replace(M43_KEYRX,'');
// 알림 문장: 휴대폰은 키 대신 ☰ 메뉴 길
function m43MsgTxt(s){return m43Strip(String(s).replace(/(스킬 트리|캐릭터 창|캐릭터)\s?\([TC]\)(에서|와|를|의|에)/g,'☰ → $1$2').replace(/성장\s?\(G\) 창/g,'☰ → 성장 창').replace(/\(성장 G(?=[\s)])/g,'(☰ → 성장').replace(/ · [A-Z]\)/g,')'))}
const M43_TC=Object.getOwnPropertyDescriptor(Node.prototype,'textContent');
// 원래 글은 기억하고 보이는 글만 바꾼다: 게임 코드가 textContent를 읽어 비교해도(#act) 원래 글 그대로라 매번 다시 쓰지 않는다
function m43KeyEl(el){if(!el||M43.keyEls.has(el))return;M43.keyEls.add(el);let raw=M43_TC.get.call(el);
  Object.defineProperty(el,'textContent',{configurable:true,
    get(){const d=M43_TC.get.call(this);if(raw!=null&&(d===raw||d===m43Strip(raw)))return raw;raw=d;return d},
    set(v){raw=v==null?'':String(v);M43_TC.set.call(this,M22.phone()?m43Strip(raw):raw)}});
  if(!el.children.length)el.textContent=raw}
function m43KeyAll(force){for(const el of document.querySelectorAll('#act,#hud .tools button,#codexBtn,#wmap [data-wclose]'))m43KeyEl(el);
  for(const el of M43.keyEls){if(!el.isConnected&&el.id!=='act'){M43.keyEls.delete(el);continue}if(el.children.length)continue;const t=el.textContent,want=M22.phone()?m43Strip(t):t;if(force||M43_TC.get.call(el)!==want)el.textContent=t}}
{const _m=msg;msg=function(t,c){const ph=typeof M22==='object'&&M22.phone();if(ph&&typeof t==='string')t=m43MsgTxt(t);const last=logEl.lastElementChild,r=_m.call(this,t,c);
  if(ph){const d=logEl.lastElementChild;if(d&&d!==last)setTimeout(()=>{d.style.opacity='0';setTimeout(()=>d.remove(),1000)},M43.LOG_MS);while(logEl.children.length>M43.LOG_N)logEl.firstChild.remove()}return r}}
{const _wo=wmapOpen;wmapOpen=function(){const r=_wo.apply(this,arguments);try{m43KeyAll()}catch(_){}return r}}
// 모드가 바뀌면(휴대폰 ↔ PC) 단추 글 · 알림판 · 쪽을 다시
{const _a=m22Apply;m22Apply=function(){const was=M22.last,r=_a.apply(this,arguments);if(M22.last!==was){for(const f of [()=>m43KeyAll(true),m43QRedraw,()=>{if(P&&P.cls)m43Page()},m43Head])try{f()}catch(_){}/* 시작 전(b5.js 앞)에는 조용히 넘어감 */}return r}}

/* ===== 3 싸울 때 의뢰 알림판 저절로 접기 ===== */
function m43Fight(){if(!P||P.dead)return false;const r2=M43.FIGHT_R*M43.FIGHT_R;for(const e of enemies){if(e.dead||!e.aggroed)continue;const dx=e.x-P.x,dy=e.y-P.y;if(dx*dx+dy*dy<r2)return true}return false}
function m43QRedraw(){const q=document.getElementById('qhud');if(q)q._h='';if(typeof P!=='undefined'&&P&&P.cls)questHud()}
function m43QTick(now){if(now==null)now=performance.now();const on=M22.phone()&&!!P&&!!P.cls;
  if(!on){M43.qUser=0;if(M43.qAuto){M43.qAuto=0;M43.qLast=now;m43QRedraw()}return M43.qAuto}
  const f=m43Fight(),man=!!(P.sq&&P.sq.hide);if(f)M43.qCalm=now;
  let want=M43.qAuto;if(f){if(!M43.qUser&&!man)want=1}else if(now-M43.qCalm>=M43.UNFOLD){want=0;M43.qUser=0}
  if(want!==M43.qAuto&&now-M43.qLast>=M43.FLIP){M43.qAuto=want;M43.qLast=now;m43QRedraw()}return M43.qAuto}
{const _qh=questHud;questHud=function(){const s=typeof P!=='undefined'&&P&&P.sq;let r;
  if(M43.qAuto&&s&&!s.hide){const h0=s.hide;s.hide=1;try{r=_qh.apply(this,arguments)}finally{if(h0===undefined)delete s.hide;else s.hide=h0}}else r=_qh.apply(this,arguments);
  try{const q=document.getElementById('qhud');if(q){q.classList.toggle('m43auto',!!M43.qAuto);if(M22.phone()&&q._m43!==q._h){q._m43=q._h;m43StripIn(q)}}}catch(_){}return r}}
// 휴대폰: 알림판 안 글자의 키 표시(일지 (L) · 의뢰 일지(L)에서 …)를 지운다. 알림판은 글이 바뀔 때만 새로 쓰므로 그때 한 번
function m43StripIn(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const v=n.nodeValue;if(v&&v.indexOf('(')>=0){const t=m43Strip(v);if(t!==v)n.nodeValue=t}}}
// 저절로 접힌 알림판을 누르면: 손으로 접은 것으로 바꾸지 않고, 이 싸움 동안 펴 둔다
document.addEventListener('click',e=>{if(!M43.qAuto)return;const b=e.target&&e.target.closest&&e.target.closest('#qhud [data-sqtrack]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
  M43.qAuto=0;M43.qUser=1;M43.qLast=performance.now();m43QRedraw()},true);

/* ===== 5 창 머리 얇게 ===== */
function m43Head(){const card=document.querySelector('#panel .card'),ph=card&&card.querySelector('.phead'),tb=card&&card.querySelector('.tabs'),L=M22.mode()==='L';if(!ph||!tb)return;
  if(L&&tb.parentNode!==ph)ph.insertBefore(tb,ph.querySelector('#pclose'));else if(!L&&tb.parentNode===ph)ph.after(tb);
  // 스킬 트리: 「남은 스킬 포인트 N」과 「설명」 단추를 머리 줄로 올리고, 긴 설명 줄(.pts)은 「설명」을 눌러야 보인다
  const tree=L&&!panel.hidden&&tab==='tree'&&P&&P.cls,pts=tree?pbody.querySelector('.pts'):null;let hb=ph.querySelector('.m43ph');
  if(!pts){if(hb)hb.remove();return}pts.classList.add('m43pts');
  if(!hb){hb=document.createElement('span');hb.className='m43ph';hb.innerHTML='<span class="m43pt"></span><button type="button" class="ghost m43more" aria-expanded="false"></button>';ph.insertBefore(hb,ph.querySelector('#pclose'))}
  const on=document.body.classList.contains('m43pts'),pt=hb.querySelector('.m43pt'),mb=hb.querySelector('.m43more'),ph1=`남은 스킬 포인트 <b>${P.sp|0}</b>`,t=on?'설명 ▴':'설명 ▾';
  if(pt.innerHTML!==ph1)pt.innerHTML=ph1;if(mb.textContent!==t){mb.textContent=t;mb.setAttribute('aria-expanded',String(on));mb.title=on?'스킬 트리 설명 접기':'스킬 트리 설명 보기'}}
{const _rp=renderPanel;renderPanel=function(){const r=_rp.apply(this,arguments);try{m43Head()}catch(err){if(window.__QA)throw err}return r}}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#panel .m43more');if(!b)return;e.stopPropagation();document.body.classList.toggle('m43pts');m43Head()},true);

/* ===== 6 생명 위험 알림 ===== */
function m43LowEl(){let el=document.getElementById('m43low');if(!el){el=document.createElement('div');el.id='m43low';el.setAttribute('aria-hidden','true');const g=document.getElementById('game');if(g)g.after(el);else document.body.appendChild(el)}return el}
function m43Low(now){if(now==null)now=performance.now();const it=document.getElementById('intro');
  const on=!!(P&&P.cls&&!P.dead&&(!it||it.hidden)&&P.hp<maxHp()*M43.LOW);
  if(on&&!M43.low&&M22.phone()&&FB28.vib!==0&&now-M43.vibT>=M43.VIB_GAP){M43.vibT=now;M43.vib(M43.VIB_MS)}
  if(on!==!!M43.low){M43.low=on?1:0;m43LowEl().classList.toggle('on',on)}return on}

/* ===== HUD 갱신마다(초당 15번): 위험 알림 · 0.2초마다 알림판 · 1초마다 단추 글 ===== */
{const _uh=updateHud;updateHud=function(){const r=_uh.apply(this,arguments);try{const now=performance.now();m43Low(now);
  if(now>=M43.qT){M43.qT=now+200;m43QTick(now)}if(now>=M43.keyT){M43.keyT=now+1000;m43KeyAll()}}catch(err){if(window.__QA)throw err}return r}}

/* ===== 7 시작 화면 ===== */
function m43Intro(){const card=document.querySelector('#intro .card');if(!card||card.querySelector('.m43sb'))return;const p=card.querySelector(':scope>h1+p');if(!p)return;
  p.classList.add('m43story');const b=document.createElement('button');b.type='button';b.className='ghost m43sb';b.textContent='이야기 보기 ▾';b.setAttribute('aria-expanded','false');
  b.onclick=e=>{e.stopPropagation();const on=document.body.classList.toggle('m43st');b.textContent=on?'이야기 접기 ▴':'이야기 보기 ▾';b.setAttribute('aria-expanded',String(on))};card.insertBefore(b,p)}
m43Intro();

/* ===== 8 자동 물약 ===== */
function m43ApClean(v){const o={hp:0,mp:0};if(v&&typeof v==='object'){const h=+v.hp,m=+v.mp;if(M43.AP_HP.includes(h))o.hp=h;if(M43.AP_MP.includes(m))o.mp=m}return o}
function m43Ap(){if(!P)return {hp:0,mp:0};if(!P.apot||typeof P.apot!=='object')P.apot={hp:0,mp:0};return P.apot}
function m43ApSet(k,v){const a=m43Ap(),L=k==='hp'?M43.AP_HP:M43.AP_MP;v=+v;if(!L.includes(v))return;a[k]=v;M43.apOut[k]=0;save()}
function m43ApTick(){if(!P||!P.cls||P.dead||paused||GHOST)return;const a=P.apot;if(!a||!(a.hp||a.mp))return;
  for(const k of ['hp','mp']){const th=a[k];if(!th)continue;const n=potTotal(k);if(n>0)M43.apOut[k]=0;
    if(!((k==='hp'?P.hp/maxHp():P.mp/maxMp())<th))continue;
    if(typeof safe24Here==='function'?safe24Here():(!DG&&inSafe(P.x,P.y,0)))return;
    if(P.potHot&&P.potHot[k])continue;if(potCdLeft(k)>0)continue;
    if(k==='mp'&&DG&&DG.c21t&&!DG.c21t.res)continue;// 시험의 방: 마나 물약 금지(손으로 누를 때 알림이 뜨는 규칙)
    if(n<=0){if(!M43.apOut[k]){M43.apOut[k]=1;msg(`자동 물약: ${POTN[k]}이 없습니다`,'#a39d8f')}continue}
    usePotion(k)}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{m43ApTick()}catch(err){if(window.__QA)throw err}return r}}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{const a=P&&P.apot;if(d&&a&&(a.hp||a.mp))d.apot={hp:a.hp,mp:a.mp}}catch(_){}return d}}
{const _ld=load;load=function(d){const a=m43ApClean(d&&d.apot),r=_ld.apply(this,arguments);try{if(r&&P){P.apot=a;M43.apOut={hp:0,mp:0}}}catch(_){}return r}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{if(P)P.apot={hp:0,mp:0};M43.apOut={hp:0,mp:0}}catch(_){}return r}}

/* ===== 설정 ⚙: 자동 물약(PC · 휴대폰) · 위험 알림 진동(휴대폰) ===== */
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);const el=SET24.el;if(!el||el.hidden)return;const sep=el.querySelector('.s24sep');
  const seg=(k,v,lab,cur)=>`<button type="button" class="s24seg${cur===v?' on':''}" data-m43${k}="${v}" aria-pressed="${cur===v}">${lab}</button>`;
  if(typeof P!=='undefined'&&P&&P.cls){const a=m43Ap(),box=document.createElement('div');box.className='m43set';
    box.innerHTML=`<div class="s24h">자동 물약</div><div class="s24row"><span class="m43l">생명</span>${M43.AP_HP.map(v=>seg('hp',v,v?Math.round(v*100)+'%':'끔',a.hp)).join('')}</div>
      <div class="s24row" style="margin-top:4px"><span class="m43l">마나</span>${M43.AP_MP.map(v=>seg('mp',v,v?Math.round(v*100)+'%':'끔',a.mp)).join('')}</div>
      <div class="s24n">생명이나 마나가 고른 만큼 아래로 내려가면 가진 것 중 가장 좋은 물약을 저절로 마셔요. 재사용 대기는 손으로 마실 때와 같고, 마을 안에서는 마시지 않아요. 캐릭터마다 따로 저장돼요</div>`;
    el.insertBefore(box,sep||null);
    box.querySelectorAll('[data-m43hp],[data-m43mp]').forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.m43hp!=null?'hp':'mp';m43ApSet(k,b.dataset['m43'+k]);set24Draw();set24Place()})}
  if(M22.phone()){const box=document.createElement('div');box.className='m43set';const v=FB28.vib===0?0:1;
    box.innerHTML=`<div class="s24h">위험 알림 진동</div><div class="s24row">${seg('vib',1,'켬',v)}${seg('vib',0,'끔',v)}</div>
      <div class="s24n">생명이 30% 아래로 내려가면 화면 가장자리가 붉어지고 휴대폰이 짧게 한 번 떨려요(되는 휴대폰만). 이 기기에 저장돼요</div>`;
    el.insertBefore(box,sep||null);
    box.querySelectorAll('[data-m43vib]').forEach(b=>b.onclick=e=>{e.stopPropagation();FB28.vib=+b.dataset.m43vib?1:0;fb28Save();set24Draw();set24Place()})}}}

{const st=document.createElement('style');st.textContent=`
#m43pg,.m43sb,#pbody .m43more{display:none}
/* 1 쪽 넘기기 */
body.m22L #hud .bar:not(.m22all) .sk.m43off{display:none!important}
body.m22L #hud .bar #m43pg{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:0;width:40px;height:44px;flex:0 0 40px;padding:0;margin:0;border:1px solid #8a7346;border-radius:4px;background:linear-gradient(180deg,#3a2e1c,#1a150e);color:#ffe2a0;font:inherit;line-height:1.05;pointer-events:auto;cursor:pointer}
body.m22L #hud .bar #m43pg b{font-size:12px;font-variant-numeric:tabular-nums}body.m22L #hud .bar #m43pg small{font-size:12px;color:#d6b262}
body.m22L #hud .bar.m22all #m43pg{display:none}
/* 2 키 표시 */
body.m22 #hud .bar .sk .k{display:none}
/* 3 저절로 접힌 알림판 */
body.m22 #qhud.m43auto{opacity:.88}
/* 4 알림 글자 */
body.m22L #log{top:calc(env(safe-area-inset-top,0px) + 8px);bottom:auto;width:min(400px,calc(100% - 524px))}
body.m22L #target:not([hidden])~#log{top:calc(env(safe-area-inset-top,0px) + ${M43.LOG_TOP}px)}
@media (max-width:759px){body.m22L #log,body.m22L #target:not([hidden])~#log{top:calc(env(safe-area-inset-top,0px) + ${M43.LOG_TOP}px);width:min(400px,calc(100% - 340px))}}
body.m22 #log div{font-size:12.5px;line-height:1.3;max-width:100%;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}
/* 5 창 머리 */
body.m22L #panel .phead{margin-bottom:6px;gap:6px;min-height:40px;flex-wrap:nowrap}
body.m22L #panel .phead h1{font-size:16px;white-space:nowrap;flex:0 0 auto;max-width:34%;overflow:hidden;text-overflow:ellipsis}
body.m22L #panel .phead .tabs{margin:0;border-bottom:none;flex:1 1 auto;min-width:0;flex-wrap:nowrap;overflow-x:auto;gap:2px;align-self:stretch;align-items:stretch}
body.m22L #panel .phead .tabs button{padding:4px 8px;font-size:13px;min-height:40px;white-space:nowrap;flex:0 0 auto}
body.m22L #pclose{font-size:0;width:40px;height:40px;min-width:40px;min-height:40px;padding:0;flex:0 0 40px;display:inline-flex;align-items:center;justify-content:center}
body.m22L #pclose::before{content:'✕';font-size:18px;line-height:1}
body.m22L #panel .card{padding:8px 12px}
#panel .m43ph{display:none}
body.m22L #panel .phead .m43ph{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;margin-left:auto;font-size:13px;color:var(--muted);white-space:nowrap}
body.m22L #panel .m43ph b{color:#ffd76a;font-size:15px}
body.m22L #panel .m43ph .m43more{min-height:40px;min-width:56px;padding:0 10px;font-size:13px}
body.m22L:not(.m43pts) #pbody .pts.m43pts{display:none}
body.m22L #pbody .pts.m43pts{font-size:12px;margin:0 0 6px}
body.m22 #pbody .pts .kbbtn{display:none}
body.m22L #pbody .treetabs{margin-bottom:6px}
/* 6 생명 위험 */
#m43low{position:fixed;inset:0;pointer-events:none;opacity:0;background:radial-gradient(ellipse at center,rgba(150,0,0,0) 62%,rgba(170,10,10,.26) 84%,rgba(190,0,0,.5) 100%);transition:opacity .4s}
#m43low.on{opacity:1;animation:m43pulse 1.6s ease-in-out infinite alternate;will-change:opacity}
@keyframes m43pulse{from{opacity:.5}to{opacity:1}}
@media (prefers-reduced-motion:reduce){#m43low.on{animation:none;opacity:.8}}
/* 7 시작 화면 */
body.m22 #intro .card{display:flex;flex-direction:column;position:relative}
body.m22 #intro .card>*{order:3;flex-shrink:0}
body.m22 #intro .card>h1{order:0;padding-right:120px}body.m22 #intro .card>.m43story{order:1}body.m22 #intro .card>#introBody{order:2}
body.m22 #intro .card>.m43sb{display:block;position:absolute;top:14px;right:14px;min-height:40px;padding:0 12px;font-size:13px;z-index:1}
body.m22:not(.m43st) #intro .card>.m43story{display:none}
/* 8 · 설정 */
#set24 .m43set .s24row{align-items:center}#set24 .m43l{flex:0 0 34px;color:#d8c9a6;font-size:12.5px}
`;document.head.appendChild(st)}
setTimeout(()=>{try{m43LowEl();m43KeyAll(true);if(window.__game)Object.assign(window.__game,{M43,m43Page,m43PageNext,m43Strip,m43MsgTxt,m43KeyAll,m43QTick,m43Fight,m43Low,m43Head,m43ApTick,m43ApSet,m43ApClean,m43Ap})}catch(_){}},0);
