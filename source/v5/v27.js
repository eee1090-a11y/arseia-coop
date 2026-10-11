/* ---------- v27 (사용자 2026-10-10 16:10 목록 1 · 2 · 3 · 4 · 8번) ----------
   1. 「처음에 배우는 기본 스킬은 마나를 소모하지 않도록 하기」 → 직업마다 첫 기술(CLASSES[].start)은 마나 0 (불티 · 성스러운 불티. 베기 · 속사는 원래 0)
   2. 「컴퓨터 환경에서 짝문 이용 시 스크롤 없이 한 창에 모두 보일 수 있도록 크기 조절하기」
      → PC(휴대폰이 아닐 때)에서 짝문 창을 넓히고, 난이도 · 설명은 왼쪽 칸, 지도는 오른쪽에. 지도 칸을 조금 낮추고 창 안에 다 들어오게 줄인다(CSS zoom · 스크롤 없음). 너무 작아지면(0.55배 아래) 0.55배로 두고 밀어 보기.
        휴대폰은 예전 그대로(밀어 보기).
   3. 「스킬 설명은 스킬트리의 아래가 아니라 왼쪽/오른쪽에 나오도록 하기」
      → 스킬 트리 창을 넓히고 설명(.detail)을 트리 오른쪽에. 창이 좁으면(세로 휴대폰) 자리가 모자라 예전처럼 아래로 내려간다.
   4. 「캐릭터의 이름을 지을 수 있게 하기 (특수문자는 불가능하며 한글 또는 영문으로 한글 기준 최대 8글자)」
      → 새 캐릭터를 고르면 이름 짓는 창. 한글(완성된 글자) · 영문만, 띄어쓰기 · 숫자 · 특수문자 안 됨. 한글 1자 = 2칸, 영문 1자 = 1칸, 16칸까지(한글 8 · 영문 16).
        캐릭터 창에서 바꿀 수 있음. 화면 왼쪽 위 · 캐릭터 고르기 카드 · 같이 하기 이름에 쓴다.
        저장: 캐릭터마다 name(선택 필드). 예전 저장은 이름 없이 그대로(직업 칭호로 보임) — 캐릭터 키를 지우거나 비우지 않는다. 잘못된 값은 불러올 때 버린다.
   8. 「친구가 접속하면 알림이 떴으면 좋겠음」 → 같이 하기 서버의 접속자 목록(who)에 새 사람이 생기면 「OO님이 접속했습니다」 (처음 받은 목록은 알리지 않음)
      + 위쪽 쪽지(15초). 내가 혼자이거나 방장이고 친구가 혼자이면 쪽지에 「파티에 초대」 단추.
   9. 「여전히 파티플레이 시 같이 던전에 입장하는 게 안되는 것 같은데」 → 두 브라우저 + 진짜 서버로 모든 지역 던전 입구(방장 F · 참가자 F) · 휴대폰 참가자 · 레벨/난이도 차이 · 건물 안에서
      모두 함께 들어감(재현 안 됨, c-e-dgsweep27 · c-e-real27). 남은 짐작: 연결이 5분 넘게 끊기면(무료 서버가 잠들거나 다시 켜짐) 파티가 저절로 다시 묶이지 않아
      같은 서버에 있어도 파티가 아님 → 다시 묶는 시간 5분 → 30분(coop22.js CO22.RJMS) · 친구 접속 쪽지에 「파티에 초대」. */

/* 1. 첫 기술 마나 0 */
const FREE27=[];
for(const k in CLASSES)for(const id of CLASSES[k].start||[])if(SPELLS[id]){if(SPELLS[id].cost>0)FREE27.push(id);SPELLS[id].cost=0}

/* 4. 캐릭터 이름 */
const N27={MAX:16,pending:null,pass:false,el:null,
  SUG:{mage:['아리엔','세린','루멘','엘다'],priest:['아우렐','미르','라엘','세오'],warrior:['카일','브란','도윤','하르'],archer:['리아','펠린','시온','나루']}};
const n27W=s=>{let w=0;for(const ch of s)w+=/[가-힣]/.test(ch)?2:1;return w};
// 이름이 안 되는 까닭 ('' = 됨)
function n27Why(s){s=typeof s==='string'?s:'';if(!s.length)return '이름을 적어 주세요';
  if(!/^[가-힣a-zA-Z]+$/.test(s))return /\s/.test(s)?'띄어쓰기는 쓸 수 없어요':/[ㄱ-ㅎㅏ-ㅣ]/.test(s)?'다 쓰지 않은 한글 글자가 있어요':'한글이나 영문만 쓸 수 있어요 (숫자 · 특수문자 안 됨)';
  if(n27W(s)>N27.MAX)return '너무 길어요: 한글 8글자, 영문 16글자까지';return ''}
const n27Clean=v=>typeof v==='string'&&!n27Why(v.trim())?v.trim():'';
const n27Of=d=>d?n27Clean(d.name):'';
// 이름 짓는 창: cb(이름) — 취소면 부르지 않는다
function n27Open(cls,cur,cb){n27Close();const el=document.createElement('div');el.id='n27';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','n27h');
  const C=CLASSES[cls]||CLASSES.mage,sug=(N27.SUG[cls]||N27.SUG.mage)[Math.floor(Math.random()*4)];
  el.innerHTML=`<div class="card"><h2 id="n27h">${cur?'이름 바꾸기':`${C.n}의 이름`}</h2>
    <p class="muted">한글이나 영문으로, 한글 8글자(영문 16글자)까지 지을 수 있어요. 띄어쓰기 · 숫자 · 특수문자는 안 돼요.</p>
    <div class="n27in"><input id="n27v" type="text" maxlength="16" autocomplete="off" spellcheck="false" value="${cur||sug}" aria-describedby="n27m"><span id="n27c" class="muted"></span></div>
    <div id="n27m" class="n27m" role="status"></div>
    <div class="row"><button class="primary" type="button" id="n27ok">${cur?'바꾸기':'이 이름으로 시작'}</button><button class="ghost" type="button" id="n27no">취소</button></div></div>`;
  document.body.appendChild(el);N27.el=el;
  const i=el.querySelector('#n27v'),m=el.querySelector('#n27m'),c=el.querySelector('#n27c'),ok=el.querySelector('#n27ok');
  const chk=()=>{const v=i.value.trim(),w=n27W(v),why=n27Why(v);c.textContent=`${Math.ceil(w/2)}/8`;m.textContent=why;ok.disabled=!!why;return why?null:v};
  const go=()=>{const v=chk();if(!v)return;n27Close();cb(v)};
  i.addEventListener('input',chk);
  el.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape')n27Close();else if(e.key==='Enter'&&!e.isComposing){e.preventDefault();go()}});
  el.addEventListener('pointerdown',e=>e.stopPropagation());
  ok.onclick=go;el.querySelector('#n27no').onclick=()=>n27Close();
  chk();try{i.focus();i.select()}catch(_){}return el}
function n27Close(){if(N27.el){N27.el.remove();N27.el=null}}
// 새 캐릭터 단추를 누르면 먼저 이름을 묻는다 (단추의 원래 동작은 이름을 정한 뒤 그대로)
document.addEventListener('click',e=>{if(N27.pass)return;const b=e.target&&e.target.closest&&e.target.closest('#introBody [data-cls]');if(!b||b.disabled)return;
  e.preventDefault();e.stopImmediatePropagation();
  n27Open(b.dataset.cls,'',v=>{N27.pending=v;N27.pass=true;try{b.click()}finally{N27.pass=false;N27.pending=null}})},true);
{const _ng=newGame;newGame=function(cls,slot){const nm=N27.pending;N27.pending=null;const r=_ng.apply(this,arguments);
  if(nm&&P){P.name=nm;try{updateHud()}catch(_){}save();n27Net()}return r}}
function n27Set(v){v=n27Clean(v);if(!v||!P)return false;P.name=v;try{updateHud()}catch(_){}save();n27Net();return true}
function n27Net(){try{if(typeof NET==='object'){NET.name=netName();if(NET.ws&&NET.ws.readyState===1){NET.meK='';netMe()}}}catch(_){}}
{const _nn=netName;netName=function(){return (P&&n27Clean(P.name))||_nn.apply(this,arguments)}}
// 저장 · 불러오기: name은 선택 필드
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{const n=P&&n27Clean(P.name);if(d&&n)d.name=n}catch(_){}return d}}
{const _ld=load;load=function(d){const n=n27Of(d);const r=_ld.apply(this,arguments);try{if(r&&P)P.name=n;if(r)updateHud()}catch(_){}return r}}
// 화면 왼쪽 위: 이름 + 칭호
{const _uh=updateHud;updateHud=function(){const r=_uh.apply(this,arguments);try{let s=document.getElementById('pn27');const t=el.title;
  if(!s&&t&&t.parentNode){s=document.createElement('span');s.id='pn27';t.parentNode.insertBefore(s,t)}const n=P&&n27Clean(P.name);
  if(s){if(s.textContent!==(n||''))s.textContent=n||'';s.hidden=!n}}catch(err){if(window.__QA)throw err}return r}}
// 캐릭터 고르기 카드: 이름
{const _ib=introButtons;introButtons=function(){const r=_ib.apply(this,arguments);try{for(let i=0;i<NSAVE;i++){const d=readSlot(i),n=n27Of(d);if(!n)continue;
    const x=document.querySelector(`#introBody [data-exp="${i}"]`),card=x&&x.closest('.cls'),b=card&&card.querySelector(':scope>b');
    if(b&&!b.querySelector('.n27c')){const s=document.createElement('span');s.className='n27c';s.textContent=n;b.prepend(s)}}}catch(err){if(window.__QA)throw err}return r}}
// 캐릭터 창: 이름 바꾸기
{const _ch=charHtml;charHtml=function(){const h=_ch.apply(this,arguments),n=P&&n27Clean(P.name);
  return `<div class="n27row">이름 <b>${n||'<span class="muted">아직 없음</span>'}</b><button class="ghost sm" type="button" data-n27ren="1">${n?'이름 바꾸기':'이름 짓기'}</button></div>`+h}}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#pbody [data-n27ren]');if(!b)return;
  n27Open(P.cls,n27Clean(P.name)||'',v=>{if(n27Set(v)){msg(`이름을 「${v}」(으)로 정했습니다`,'#d6b262');if(!panel.hidden&&tab==='char')renderPanel()}})});
// 같이 하기 창: 이름이 있으면 그 이름을 쓴다 (바꾸기는 캐릭터 창에서)
{const _nu=netUI;netUI=function(){const r=_nu.apply(this,arguments);try{const i=document.getElementById('coopName'),n=P&&n27Clean(P.name);
  if(i&&n){i.value=n;i.readOnly=true;i.title='캐릭터 이름 (캐릭터 창에서 바꿀 수 있어요)'}}catch(_){}return r}}

/* 8. 친구 접속 알림 */
const F27={seen:null,log:[]};
function f27Who(list){const ids=new Set(),nw=[];for(const o of list||[]){if(!o||o.id==null||o.id===NET.id)continue;ids.add(o.id);if(F27.seen&&!F27.seen.has(o.id))nw.push(o)}
  F27.seen=ids;for(const o of nw){const C=CLASSES[o.c],t=`${o.n||'누군가'}님이 접속했습니다${C?` (${C.n} Lv ${o.l|0})`:''}`;F27.log.push(t);
    msg(t,'#9fe0ff');if(window.COOP_SERVER)try{chatSys(t,'#9fe0ff')}catch(_){}try{if(typeof sfx==='function')sfx('ui')}catch(_){}f27Toast(o,t)}}
// 알림 쪽지: 내가 파티를 열 수 있고(혼자이거나 방장) 친구가 혼자이면 「파티에 초대」 단추 (9번: 같은 서버에 있기만 하고 파티가 아니면 던전에 같이 안 들어감)
const f27CanInv=o=>!!o&&!o.r&&(NET.on?NET.host:!NET.roomHost);
function f27Toast(o,t){let el=document.getElementById('f27t');if(!el){el=document.createElement('div');el.id='f27t';el.setAttribute('role','status');document.body.appendChild(el)}
  clearTimeout(F27.tt);const inv=f27CanInv(o);
  el.innerHTML=`<span></span>${inv?'<button class="primary" type="button" data-f27inv>파티에 초대</button>':''}<button class="ghost" type="button" data-f27x>닫기</button>`;el.querySelector('span').textContent=t;el.hidden=false;
  const b=el.querySelector('[data-f27inv]');if(b)b.onclick=()=>{el.hidden=true;netInvite(o.id)};el.querySelector('[data-f27x]').onclick=()=>{el.hidden=true};
  el.addEventListener('pointerdown',e=>e.stopPropagation());F27.tt=setTimeout(()=>{el.hidden=true},15000);return el}
{const _om=netOnMsg;netOnMsg=function(m){if(m&&m.t==='hello')F27.seen=null;// 새로 이어지면 처음 목록은 알리지 않음
  if(m&&m.t==='who'){try{f27Who(m.list)}catch(err){if(window.__QA)throw err}}return _om.apply(this,arguments)}}

/* 2 · 3. PC 창 배치: 짝문 · 스킬 트리 */
const W27={gate:{CH:100,SY:108},MIN:.55};
const w27Pc=()=>!(typeof M22==='object'&&M22.phone());
{const _gm=gate26Map;gate26Map=function(){if(!w27Pc())return _gm.apply(this,arguments);const o={CH:G26.CH,SY:G26.SY};Object.assign(G26,W27.gate);
  try{return _gm.apply(this,arguments)}finally{Object.assign(G26,o)}}}
function w27Gate(card){const w=pbody.querySelector('#g26w'),m=w&&w.querySelector('.g26m');if(!w||!m)return;
  const row=document.createElement('div');row.className='g27row';const side=document.createElement('div');side.className='g27side';const box=document.createElement('div');box.className='g27map';
  for(const c of [...pbody.children])if(c!==w)side.appendChild(c);box.appendChild(w);row.append(side,box);pbody.appendChild(row);
  const Wd=parseFloat(m.style.width),Hd=parseFloat(m.style.height),cs=getComputedStyle(panel),pi=panel.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom),
    cc=getComputedStyle(card),top=row.getBoundingClientRect().top-card.getBoundingClientRect().top,
    aH=pi-top-parseFloat(cc.paddingBottom)-parseFloat(cc.borderBottomWidth)-4,aW=box.clientWidth-2;
  let s=Math.min(1,aW/Wd,aH/Hd);const fit=s>=W27.MIN;if(!fit)s=W27.MIN;s=Math.floor(s*1000)/1000;
  m.style.zoom=s<1?String(s):'';
  w.style.width=Math.ceil(Wd*s)+2+'px';w.style.height=fit?Math.ceil(Hd*s)+2+'px':'';w.style.maxHeight=fit?'none':Math.max(160,aH)+'px';w.style.overflow=fit?'hidden':'auto';
  W27.s=s;W27.fit=fit}
function w27Tree(){const ts=pbody.querySelector(':scope>.treescroll'),dt=pbody.querySelector(':scope>.detail');if(!ts||!dt)return;
  const row=document.createElement('div');row.className='t27row';const l=document.createElement('div');l.className='t27l';const r=document.createElement('div');r.className='t27r';
  ts.before(row);l.appendChild(ts);const kb=pbody.querySelector(':scope>.kbhint');if(kb)r.appendChild(kb);r.appendChild(dt);row.append(l,r)}
{const _rp=renderPanel;renderPanel=function(){const card=panel.querySelector('.card'),pc=w27Pc();
  if(card){card.classList.toggle('g27',tab==='gate'&&pc);card.classList.toggle('t27',tab==='tree')}
  const r=_rp.apply(this,arguments);
  try{if(tab==='gate'&&pc&&card)w27Gate(card);if(tab==='tree')w27Tree()}catch(err){if(window.__QA)throw err}return r}}
addEventListener('resize',()=>{try{if(!panel.hidden&&(tab==='gate'||tab==='tree'))renderPanel()}catch(_){}});

{const st=document.createElement('style');st.textContent=`
#n27{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.6)}
#n27 .card{width:min(420px,100%)}#n27 h2{margin-top:0}
.n27in{display:flex;align-items:center;gap:8px;margin:10px 0 4px}.n27in input{flex:1;min-width:0;font-size:18px;padding:8px 10px;background:#0e0c0a;color:#f0e2bc;border:1px solid var(--line);border-radius:3px}
.n27m{min-height:18px;font-size:13px;color:#ff9a7a;margin-bottom:8px}
#f27t{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 84px);transform:translateX(-50%);z-index:31;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;max-width:calc(100% - 32px);box-sizing:border-box;background:rgba(14,12,10,.94);border:1px solid #9fe0ff;border-radius:4px;padding:8px 12px;color:#e8e2d2;box-shadow:0 4px 14px rgba(0,0,0,.5)}#f27t[hidden]{display:none}#f27t button{min-height:34px}
#pn27{color:#ffe6a8;margin-right:6px}#pn27[hidden]{display:none}
#introBody .n27c{color:#ffe6a8;margin-right:6px}#introBody .n27c::after{content:' ·';color:var(--muted)}
.n27row{display:flex;align-items:center;gap:10px;margin:0 0 10px;font-size:14px}.n27row b{color:#ffe6a8;font-size:16px}
#panel .card.g27{width:min(1240px,100%)}body.m22L #panel .card.g27{width:min(1240px,100%)}
.g27row{display:flex;gap:16px;align-items:flex-start}.g27side{flex:0 0 250px;min-width:0}.g27side .diffs{flex-wrap:wrap}.g27map{flex:1;min-width:0;display:flex;justify-content:center}
.g27map .g26w{margin:0}.g27 .g26t{min-height:30px}
#panel .card.t27{width:min(1040px,100%)}body.m22L #panel .card.t27{width:min(1040px,100%)}
.t27row{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start}.t27l{flex:0 1 auto;min-width:0;max-width:100%}
.t27r{flex:1 1 280px;min-width:280px;position:sticky;top:0}.t27r .detail{margin-top:0}
@media (max-width:640px){.t27r{min-width:0;flex-basis:100%}}`;document.head.appendChild(st)}
if(window.__game)Object.assign(window.__game,{FREE27,N27,n27Why,n27W,n27Clean,n27Open,n27Set,F27,f27Who,W27,w27Gate,w27Tree});
