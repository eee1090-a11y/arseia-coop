/* ---------- v51 휴대폰 손보기 7 (사용자 2026-11-02 「그렇게 해줘」 · 제안 「휴대폰 화면·조작 개선 제안 5」에서 아직 추천한 1 · 4 · 5 · 6 · 8 · 9 · 10번) ----------
   게임 수치(피해 · 값 · 떨어뜨림 · 경험치) · 맞히기 판정 · 저장 형식은 그대로. 캐릭터 키는 읽기만 하고 지우거나 비우지 않는다.
   1  「여기」 표시(같이 하기 파티 중): 지역 지도(M)를 눌러 뜨는 쪽지에 「동료에게 여기 표시」 · 「말」 단추 목록에 「여기!(내 자리)」.
      누르면 파티 모두의 화면(같은 곳에 있는 사람)에 그 자리에 하늘색 표시가 6초 · 화면 밖이면 가장자리 화살표(mux45 m45Arrow) · 대화 한 줄.
      메시지는 'v20x' pg51(서버는 그대로 전달만 · 예전 판은 모르는 메시지라 무시). 1.5초에 한 번까지.
   4  위험한 바닥 더 진하게(휴대폰): 보스 · 몬스터가 땅에 그리는 「곧 터질 자리」(warns)에 검은 테두리 + 굵은 색 테두리를 한 겹 더,
      터지기 0.5초 전부터 하얗게 깜빡. 맞는 범위 · 시간은 그대로(그리기만). PC는 그대로.
   5  조이스틱 크기 · 자리(휴대폰 · 설정 ⚙ 조작): 크기 [작게 36 · 보통 44(지금) · 크게 56], 자리 [누른 곳에(지금) · 같은 자리에 고정].
      크기: 그 거리만큼 밀어야 가장 빠르게 걷고 그 크기로 그린다(보기 거리 보정 ux45c는 그대로 함께). 고정: 왼쪽(왼손 모드면 오른쪽) 아래 구슬 위에
      늘 옅은 고리가 있고, 조이스틱 쪽 어디를 눌러도 그 고리 가운데를 기준으로 걷는다. 이 기기 설정 'arseia-device-v45'의 js51 · jf51(없으면 지금 그대로).
   6  창 안에서 옆으로 밀어 탭 넘기기(휴대폰): 창 본문을 왼쪽으로 밀면 다음 탭, 오른쪽이면 앞 탭. 가장 안쪽 탭 줄(스킬 트리의 화염 · 냉기 … · 성장 창 탭)부터,
      그 줄 끝이면 바깥 탭 줄(스킬 트리 · 캐릭터와 가방 · 평판). 옆으로 넘겨 보는 칸(좁은 화면의 트리 등)은 끝까지 넘긴 다음에만. 잠긴 탭은 건너뜀.
   8  여러 개 골라 한꺼번에(상점 「팔기」 · 창고의 가방 쪽): 「여러 개 고르기」 → 칸마다 고르기 단추 → 아래 띠의 「고른 n개 팔기 · 창고에 넣기」.
      희귀 이상 · 재련 · 마법 부여 · 홈 장비가 들어 있으면 한 번 더 눌러야 판다. 잠긴 장비는 고를 수 없다. 버리기는 만들지 않음(되돌릴 수 없어서).
   9  장비 잠금: 가방 장비 줄마다 「잠그기」(누르면 「잠김」). 잠긴 장비는 판매 · 「지금 장비보다 약한 것 모두 판매」 · 여러 개 팔기에서 빠진다(창고에는 넣을 수 있음).
      잠기지 않은 희귀 이상 · 재련 · 마법 부여 · 홈 장비를 하나씩 팔 때는 「정말 팔까요?」로 한 번 더 누르게 한다(3.5초 안).
      저장: 잠근 장비에만 새 필드 lk51:1(풀면 그 필드를 뺌 · 예전 판은 모르는 필드라 그대로 둠).
   10 「준비됐나요?」(같이 하기): 같이 하기 창 · 「말」 단추 목록의 「준비 확인」 → 파티 모두에게 「준비됨 · 잠깐」 카드. 위쪽 작은 칸에 사람마다 ✓ · ✗ · … 30초.
      모두 준비되면 「모두 준비됐어요!」. 메시지는 'v20x' rc51 · rc51a.
   붙는 곳: hero46.js 다음 · fix50q.js 다음, b5.js 앞(qa.js보다 앞). b5.js의 let/const(panel · pbody · tab …)는 함수 안에서만(시작 뒤) 쓴다. */
const M51={pings:[],pingT:-1e9,PING_MS:6000,arrN:0,wN:0,JS:[36,44,56],jsN:0,sel:null,selTab:'',arm:null,rc:null,RC_MS:30000,sw:null,hold:null};
const m51Ph=()=>!!(typeof M22==='object'&&M22.phone());
const m51Err=e=>{if(window.__QA)throw e};
const m51Now=()=>performance.now();

/* ===== 1 「여기」 표시 ===== */
function m51PingSend(x,y){if(!NET.on){msg('같이 하기 파티에 있을 때 쓸 수 있어요','#a39d8f');return false}
  const t=m51Now();if(t-M51.pingT<1500)return false;M51.pingT=t;
  const o={r:REG.id,a:netArea(),x:Math.round(x),y:Math.round(y),n:String(netName()).slice(0,16)};
  v20Send('pg51',o);m51PingAdd(o,true);return true}
function m51PingAdd(m,me){const x=+m.x,y=+m.y;if(!Number.isFinite(x)||!Number.isFinite(y))return false;const n=String(m.n||'동료').slice(0,16);
  if(m.a!==netArea()){if(!me)chatSys(`${n}: 여기! (다른 곳)`,'#5ad0ff');return false}
  M51.pings=M51.pings.filter(p=>p.n!==n);M51.pings.push({x,y,n,me:!!me,t0:m51Now(),a:m.a});
  if(me)msg('동료에게 여기를 표시했어요','#5ad0ff');else{chatSys(`${n}: 여기!${typeof zoneName==='function'?` (${zoneName(x,y)})`:''}`,'#5ad0ff');try{if(m51Ph()&&navigator.vibrate)navigator.vibrate(25)}catch(_){}}
  return true}
V20NET.pg51=(m,peer)=>{m51PingAdd({x:m.x,y:m.y,a:m.a,n:m.n||(peer&&peer.name)},false)};
function m51PingDraw(){M51.arrN=0;if(!M51.pings.length)return;const now=m51Now(),ar=netArea();M51.pings=M51.pings.filter(p=>now-p.t0<M51.PING_MS&&p.a===ar);if(!M51.pings.length||!P)return;
  ctx.save();S();
  try{for(const p of M51.pings){const s=W2S(p.x,p.y),k=(now-p.t0)/1000,fade=Math.min(1,(M51.PING_MS/1000-k)*1.5);
    if(s.x>=-10&&s.y>=-10&&s.x<=W+10&&s.y<=H+10){ctx.globalAlpha=.9*fade;ctx.strokeStyle='#5ad0ff';ctx.lineWidth=3;
      for(let i=0;i<2;i++){const q=((k*1.4+i*.5)%1);ctx.globalAlpha=(1-q)*.9*fade;ctx.beginPath();ctx.ellipse(s.x,s.y,10+q*46,(10+q*46)/2,0,0,6.283);ctx.stroke()}
      ctx.globalAlpha=fade;ctx.fillStyle='#5ad0ff';ctx.strokeStyle='rgba(0,0,0,.85)';ctx.lineWidth=2;const by=s.y-34-Math.abs(Math.sin(k*5))*6;
      ctx.beginPath();ctx.moveTo(s.x,s.y-6);ctx.lineTo(s.x-10,by+6);ctx.arc(s.x,by,11,Math.PI*.8,Math.PI*.2);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#08202a';ctx.font=`800 13px ${FONT}`;ctx.textAlign='center';ctx.fillText('!',s.x,by+5);
      ctx.font=`700 12px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='#000';const lb=p.me?'여기':p.n.slice(0,8);ctx.strokeText(lb,s.x,by-16);ctx.fillStyle='#bfefff';ctx.fillText(lb,s.x,by-16)}
    else if(typeof m45Edge==='function'&&typeof m45Arrow==='function'){const q0=W2S(P.x,P.y),an=Math.atan2(s.y-q0.y,s.x-q0.x),q=m45Edge(an,22);ctx.globalAlpha=fade;m45Arrow(q.x,q.y,an,'#5ad0ff','여기 '+p.n.slice(0,5));M51.arrN++}}}
  finally{ctx.globalAlpha=1;ctx.restore()}}
// 지역 지도 쪽지에 「동료에게 여기 표시」
{const _wp=m45WmPop;m45WmPop=function(t){const r=_wp.apply(this,arguments);try{const el=document.getElementById('m45wp');if(el&&NET.on){const bx=el.querySelector('.m45wpb');
    if(bx&&!bx.querySelector('[data-pg51w]'))bx.insertAdjacentHTML('afterbegin','<button type="button" data-pg51w="1">동료에게 여기 표시</button>')}}catch(e){m51Err(e)}return r}}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-pg51w]');if(!b)return;e.stopPropagation();e.preventDefault();
  const q=M45.wpT,el=document.getElementById('m45wp');if(el)el.hidden=true;if(!q)return;const p=q.list&&q.list[0]?q.list[0]:q.p;if(p&&m51PingSend(p.x,p.y))wmapClose()},true);
// 「말」 단추 목록에 「여기!」 · 「준비 확인」
{const _qo=m45QcOpen;m45QcOpen=function(){const r=_qo.apply(this,arguments);try{const p=document.getElementById('m45qc');if(p&&!p.querySelector('[data-m51q]')){
    p.insertAdjacentHTML('beforeend','<button type="button" class="m51q" data-m51q="pg">여기! (내 자리 표시)</button><button type="button" class="m51q" data-m51q="rc">준비 확인</button>');
    p.querySelectorAll('[data-m51q]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();p.hidden=true;if(b.dataset.m51q==='pg')m51PingSend(P.x,P.y);else m51RcStart()}))}}catch(e){m51Err(e)}return r}}

/* ===== 4 위험한 바닥 더 진하게 (휴대폰) ===== */
function m51Warn(){M51.wN=0;if(!m51Ph()||!warns.length)return;G();ctx.globalCompositeOperation='source-over';
  try{for(const w of warns){if(w.done||!(w.t>0)||!(w.rad>0))continue;M51.wN++;
    ctx.globalAlpha=.6;ctx.strokeStyle='#000';ctx.lineWidth=10;ctx.beginPath();ctx.arc(w.x,w.y,w.rad,0,6.283);ctx.stroke();
    ctx.globalAlpha=.95;ctx.strokeStyle=w.col||'#ff5a3a';ctx.lineWidth=6;ctx.stroke();
    if(w.t<.5&&w.dmg>0){const f=.5+.5*Math.sin(time*36);ctx.globalAlpha=.12+.2*f;ctx.fillStyle='#fff';circ(w.x,w.y,w.rad);ctx.globalAlpha=.55+.45*f;ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(w.x,w.y,w.rad,0,6.283);ctx.stroke()}}}
  finally{ctx.globalAlpha=1;S()}}
{const _g=drawV5Glow;drawV5Glow=function(){const r=_g.apply(this,arguments);try{m51Warn()}catch(e){m51Err(e)}return r}}

/* ===== 5 조이스틱 크기 · 자리 고정 (휴대폰) ===== */
const m51JsI=()=>{const v=M45.dev.js51;return v===0||v===2?v:1};
const m51JR=()=>m51Ph()?M51.JS[m51JsI()]:44;
const m51Fix=()=>m51Ph()&&M45.dev.jf51===1;
const m51Finger=()=>!!(joy&&typeof joy.id==='number');
// 고정 자리(화면 좌표 → 세계 화면 좌표 rel과 같은 단위): 구슬 위 · 왼손 모드면 오른쪽
function m51FixC(){const cw=cv.clientWidth||innerWidth,ch=cv.clientHeight||innerHeight,R=m51JR()*.75,x=Math.max(R+16,120),y=Math.max(R+20,ch-150);
  return{x:(typeof m48Lh==='function'&&m48Lh()?cw-x:x)/CZ,y:y/CZ}}
{const _u=update;update=function(dt){const R=m51JR();if(R===44||!m51Finger())return _u(dt);const j=joy,x=j.x,y=j.y,k=44/R;j.x=j.ox+(x-j.ox)*k;j.y=j.oy+(y-j.oy)*k;try{return _u(dt)}finally{j.x=x;j.y=y}}}
// 캔버스의 pointerdown(b5 · 이 파일보다 뒤에 붙음)이 joy를 만든 다음 → document에서(거품 단계) 가운데를 고정 자리로
document.addEventListener('pointerdown',e=>{if(e.target!==cv||e.pointerType==='mouse'||!m51Fix()||!joy||joy.id!==e.pointerId)return;const c=m51FixC();joy.ox=c.x;joy.oy=c.y});
const m51JsOwn=()=>m51Ph()&&(m51JR()!==44||m51Fix());
const m51InPlay=()=>!!(P&&P.cls&&!P.dead&&!paused&&$('#intro').hidden&&panel.hidden);
{const _rn=render;render=function(){if(!m51JsOwn())return _rn.apply(this,arguments);
  const fin=m51Finger(),kz=GFX.zoom<1?GFX.zoom:1,j=fin?joy:null;if(fin)joy=null;let r;try{r=_rn.apply(this,arguments)}finally{if(fin)joy=j}
  try{const R=m51JR()/kz;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(j){const dx=j.x-j.ox,dy=j.y-j.oy,l=Math.hypot(dx,dy),f=l>R?R/l:1;ctx.strokeStyle='rgba(236,230,214,.38)';ctx.lineWidth=2/kz;ctx.beginPath();ctx.arc(j.ox,j.oy,R,0,6.283);ctx.stroke();
      ctx.fillStyle='rgba(236,230,214,.38)';circ(j.ox+dx*f,j.oy+dy*f,R*.41)}
    else if(m51Fix()&&m51InPlay()){const c=m51FixC();ctx.strokeStyle='rgba(236,230,214,.16)';ctx.lineWidth=2/kz;ctx.beginPath();ctx.arc(c.x,c.y,R,0,6.283);ctx.stroke();ctx.fillStyle='rgba(236,230,214,.1)';circ(c.x,c.y,R*.41)}
    M51.jsN++}catch(e){m51Err(e)}return r}}
function m51SetJs(k,v){M45.dev[k]=v;m45DevSave()}

/* ===== 6 창 안에서 옆으로 밀어 탭 넘기기 (휴대폰) ===== */
// 탭 줄: 단추 둘 이상이 aria-selected를 가진 줄. 가장 안쪽(뒤에 나오는) 줄부터, 그 줄 끝이면 바깥 줄로
function m51TabRows(){if(panel.hidden)return[];const out=[];for(const row of panel.querySelectorAll('[role=tablist],.treetabs')){if(!row.offsetParent)continue;
    const bs=[...row.children].filter(b=>b.tagName==='BUTTON'&&b.hasAttribute('aria-selected')&&!b.hidden&&!b.disabled&&b.offsetParent);if(bs.length>=2)out.push(bs)}
  return out}
function m51Flip(dir){const rows=m51TabRows();for(let i=rows.length-1;i>=0;i--){const bs=rows[i],cur=bs.findIndex(b=>b.getAttribute('aria-selected')==='true');if(cur<0)continue;
    let j=cur+dir;while(j>=0&&j<bs.length&&bs[j].classList.contains('lk'))j+=dir;if(j<0||j>=bs.length)continue;bs[j].click();return bs[j]}
  return null}
// 손가락 아래에 아직 옆으로 넘길 수 있는 칸이 있으면 그 칸이 먼저
function m51CanScroll(el,dir){for(let n=el;n&&n!==pbody.parentElement&&n!==document.body;n=n.parentElement){if(n.scrollWidth<=n.clientWidth+2)continue;const ox=getComputedStyle(n).overflowX;if(ox!=='auto'&&ox!=='scroll')continue;
    if(dir>0?n.scrollLeft+n.clientWidth<n.scrollWidth-2:n.scrollLeft>2)return true}return false}
document.addEventListener('touchstart',e=>{M51.sw=null;if(!m51Ph()||panel.hidden||e.touches.length!==1)return;const t=e.touches[0],tg=e.target;
  if(!tg||!tg.closest||!tg.closest('#pbody')||tg.closest('input,select,textarea'))return;M51.sw={x:t.clientX,y:t.clientY,t:m51Now(),tg}},{capture:true,passive:true});
document.addEventListener('touchend',e=>{const s=M51.sw;M51.sw=null;if(!s||panel.hidden||!m51Ph())return;const t=e.changedTouches&&e.changedTouches[0];if(!t)return;
  const dx=t.clientX-s.x,dy=t.clientY-s.y;if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*2||m51Now()-s.t>650)return;if(typeof DND==='object'&&DND.on)return;
  const dir=dx<0?1:-1;if(m51CanScroll(s.tg,dir))return;if(m51Flip(dir))M51.flipN=(M51.flipN||0)+1},{capture:true,passive:true});
document.addEventListener('touchcancel',()=>{M51.sw=null},{capture:true,passive:true});

/* ===== 9 장비 잠금 + 한 번 더 묻기 ===== */
const m51Lk=it=>!!(it&&it.lk51);
const m51Dear=it=>!!(it&&(it.rar>=2||(typeof rfOf==='function'&&rfOf(it))||it.en||(Array.isArray(it.so)&&it.so.length)));
const m51BagIt=id=>P&&Array.isArray(P.bag)?P.bag.find(x=>x&&x.id===id):null;
function m51SetLk(id,on){const it=m51BagIt(id);if(!it)return false;if(on)it.lk51=1;else delete it.lk51;save();return true}
{const _ir=itemRow;itemRow=function(it,btns){if(!it||typeof btns!=='string'||!P||!Array.isArray(P.bag)||!P.bag.includes(it)||!/data-(sell|equip|stin)=/.test(btns))return _ir.apply(this,arguments);
  const on=m51Lk(it),pick=M51.sel&&M51.selTab===tab;
  const ck=pick&&!on?`<button type="button" class="m51ck${M51.sel.has(it.id)?' on':''}" data-ck51="${it.id}" aria-pressed="${M51.sel.has(it.id)}">${M51.sel.has(it.id)?'✓ 고름':'고르기'}</button>`:'';
  const lk=`<button type="button" class="m51lk${on?' on':''}" data-lk51="${it.id}" aria-pressed="${on}" title="잠그면 팔리지 않아요">${on?'잠김':'잠그기'}</button>`;
  let h=_ir.call(this,it,ck+btns+lk);if(on)h=h.replace('class="item hasic"','class="item hasic m51locked"');return h}}
// 판매 막기 · 한 번 더 묻기 (b5 pbody 클릭보다 먼저)
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#pbody button');if(!b||b.disabled)return;
  try{if(b.dataset.lk51){e.stopPropagation();const id=+b.dataset.lk51,it=m51BagIt(id);if(it){m51SetLk(id,!m51Lk(it));msg(m51Lk(it)?`${itemName(it)} 잠금 · 팔리지 않아요`:`${itemName(it)} 잠금을 풀었어요`,'#d6b262');if(M51.sel)M51.sel.delete(id);renderPanel()}return}
    if(b.dataset.sell){const it=m51BagIt(+b.dataset.sell);if(!it)return;
      if(m51Lk(it)){e.stopPropagation();msg('잠긴 장비는 팔 수 없어요 · 「잠김」을 눌러 풀어요','#ff9a6a');return}
      if(m51Dear(it)){const a=M51.arm,now=m51Now();if(a&&a.k==='one'&&a.id===it.id&&now-a.t<3500){M51.arm=null;return}
        e.stopPropagation();M51.arm={k:'one',id:it.id,t:now};b.textContent='정말 팔까요? 한 번 더';b.classList.add('m51arm');msg(`${itemName(it)}: ${RAR[it.rar].n}${typeof rfOf==='function'&&rfOf(it)?' · 재련':''} 장비예요. 한 번 더 누르면 팔아요`,'#ffd98a');
        setTimeout(()=>{if(M51.arm&&M51.arm.id===it.id&&b.isConnected){b.textContent=`판매 ${itemPrice(it)}`;b.classList.remove('m51arm')}},3600);return}}
    if(b.dataset.sellweak&&P.bag.some(m51Lk)&&typeof rfOf==='function'&&!M51.hold){const _rf=rfOf;M51.hold=_rf;rfOf=function(it){return m51Lk(it)||_rf.apply(this,arguments)};setTimeout(m51Unhold,0)}}
  catch(err){m51Err(err)}},true);
// 「모두 판매」가 끝나면(같은 클릭의 맨 끝) 재련 판단을 원래대로
function m51Unhold(){if(M51.hold){rfOf=M51.hold;M51.hold=null}}
document.addEventListener('click',m51Unhold);

/* ===== 8 여러 개 골라 한꺼번에 (상점 팔기 · 창고의 가방 쪽) ===== */
const m51SelOk=()=>!panel.hidden&&(tab==='shop'||tab==='stash')&&P&&P.bag.length>0;
function m51SelSum(){let n=0,g=0,dear=0;if(!M51.sel)return{n,g,dear};for(const id of M51.sel){const it=m51BagIt(id);if(!it||m51Lk(it))continue;n++;g+=itemPrice(it);if(m51Dear(it))dear++}return{n,g,dear}}
function m51SelDo(){const S0=m51SelSum();if(!S0.n)return 0;const ids=[...M51.sel].filter(id=>{const it=m51BagIt(id);return it&&!m51Lk(it)});
  if(tab==='stash'){const before=P.bag.length;stashIn(ids);const n=before-P.bag.length;M51.sel=null;renderPanel();return n}
  let g=0,n=0;P.bag=P.bag.filter(it=>{if(ids.includes(it.id)&&!m51Lk(it)){g+=itemPrice(it);n++;return false}return true});P.gold+=g;msg(`장비 ${n}개 판매 · 금화 ${g.toLocaleString()} 획득`,'#e8c35a');M51.sel=null;M51.arm=null;renderPanel();save();return n}
function m51SelBar(){const pb=pbody;if(!pb)return;const old=pb.querySelector('.m51bar');if(old)old.remove();
  if(!m51SelOk()){M51.sel=null;return}
  const anchor=pb.querySelector(tab==='shop'?'[data-sellweak]':'[data-stall]');const row=anchor&&anchor.closest('.row');
  if(row&&P.bag.length>1&&!row.querySelector('[data-m51sel]'))row.insertAdjacentHTML('beforeend',`<button class="ghost" type="button" data-m51sel="1">${M51.sel?'고르기 그만':'여러 개 고르기'}</button>`);
  if(!M51.sel)return;const S0=m51SelSum(),stash=tab==='stash',arm=M51.arm&&M51.arm.k==='many';
  const go=stash?`고른 ${S0.n}개 창고에 넣기`:arm?`희귀 이상 ${S0.dear}개 포함 · 정말 팔까요?`:`고른 ${S0.n}개 팔기 · 금화 ${S0.g.toLocaleString()}`;
  pb.insertAdjacentHTML('beforeend',`<div class="m51bar" role="toolbar" aria-label="고른 장비"><button type="button" class="primary${arm?' m51arm':''}" data-m51do="1" ${S0.n?'':'disabled'}>${go}</button><button type="button" class="ghost" data-m51all="1">모두 고르기</button><button type="button" class="ghost" data-m51x="1">그만</button></div>`)}
{const _rp=renderPanel;renderPanel=function(){if(M51.sel&&(panel.hidden||tab!==M51.selTab)){M51.sel=null;M51.arm=null}const r=_rp.apply(this,arguments);try{m51SelBar();m51LkMarks()}catch(e){m51Err(e)}return r}}
{const _cp=closePanel;closePanel=function(){M51.sel=null;M51.arm=null;return _cp.apply(this,arguments)}}
document.addEventListener('click',e=>{const t=e.target;if(!t||!t.closest||!t.closest('#pbody'))return;const b=t.closest('button');
  try{if(b&&b.dataset.m51sel){e.stopPropagation();M51.sel=M51.sel?null:new Set();M51.selTab=tab;M51.arm=null;renderPanel();return}
    if(!M51.sel)return;
    if(b&&b.dataset.m51x){e.stopPropagation();M51.sel=null;M51.arm=null;renderPanel();return}
    if(b&&b.dataset.m51all){e.stopPropagation();for(const it of P.bag)if(!m51Lk(it))M51.sel.add(it.id);M51.arm=null;renderPanel();return}
    if(b&&b.dataset.m51do){e.stopPropagation();const S0=m51SelSum();if(tab==='shop'&&S0.dear&&!(M51.arm&&M51.arm.k==='many'&&m51Now()-M51.arm.t<3500)){M51.arm={k:'many',t:m51Now()};renderPanel();return}M51.arm=null;m51SelDo();return}
    // 고르기 단추 · 줄의 빈 곳을 누르면 고름/뺌
    let id=null;if(b&&b.dataset.ck51)id=+b.dataset.ck51;else if(!b){const row=t.closest('.item[data-iid]');if(row&&row.querySelector('[data-ck51]'))id=+row.querySelector('[data-ck51]').dataset.ck51}
    if(id!=null){e.stopPropagation();const it=m51BagIt(id);if(!it||m51Lk(it))return;if(M51.sel.has(id))M51.sel.delete(id);else M51.sel.add(id);M51.arm=null;renderPanel()}}
  catch(err){m51Err(err)}},true);
// 가방 칸(그림)에도 잠김 표시
function m51LkMarks(){if(panel.hidden||!P||!Array.isArray(P.bag))return;for(const it of P.bag){if(!m51Lk(it))continue;const c=pbody.querySelector(`.bagc[data-bagcell="${it.id}"]`);if(c&&!c.querySelector('.m51lkb'))c.insertAdjacentHTML('beforeend','<span class="m51lkb" aria-label="잠김">잠김</span>')}}

/* ===== 10 「준비됐나요?」 ===== */
function m51RcPeers(){const m=new Map();for(const r of NET.peers.values())if(r&&r.id!=null)m.set(r.id,{n:String(r.name||'동료').slice(0,16),ok:null});return m}
function m51RcStart(){if(!NET.on){msg('같이 하기 파티에 있을 때 쓸 수 있어요','#a39d8f');return false}if(!NET.peers.size){msg('파티에 다른 사람이 없어요','#a39d8f');return false}
  const s=(Date.now()%1e9)|0,st=m51RcPeers();st.set(NET.id,{n:String(netName()).slice(0,16),ok:1,me:1});
  M51.rc={s,by:NET.id,byN:String(netName()).slice(0,16),t0:m51Now(),st,done:0};v20Send('rc51',{s,n:M51.rc.byN});chatSys('준비 확인을 보냈어요','#9fe0ff');m51RcUI();return true}
V20NET.rc51=(m,peer)=>{const st=m51RcPeers();if(m.from!=null)st.set(m.from,{n:String(m.n||(peer&&peer.name)||'동료').slice(0,16),ok:1});st.set(NET.id,{n:String(netName()).slice(0,16),ok:null,me:1});
  M51.rc={s:m.s,by:m.from,byN:String(m.n||(peer&&peer.name)||'동료').slice(0,16),t0:m51Now(),st,done:0};try{if(m51Ph()&&navigator.vibrate)navigator.vibrate([30,60,30])}catch(_){}m51RcUI()};
V20NET.rc51a=(m,peer)=>{const R=M51.rc;if(!R||m.s!==R.s||m.from==null)return;const o=R.st.get(m.from)||{n:String((peer&&peer.name)||'동료').slice(0,16)};o.ok=m.ok?1:0;R.st.set(m.from,o);m51RcUI()};
function m51RcAns(ok){const R=M51.rc;if(!R)return false;const me=R.st.get(NET.id);if(me)me.ok=ok?1:0;v20Send('rc51a',{s:R.s,ok:ok?1:0});m51RcUI();return true}
function m51RcAll(){const R=M51.rc;return !!R&&[...R.st.values()].every(o=>o.ok===1)}
function m51RcUI(){let el=document.getElementById('m51rc');const R=M51.rc;
  if(!R||!NET.on||m51Now()-R.t0>M51.RC_MS+4000){if(el)el.hidden=true;M51.rc=R&&NET.on&&m51Now()-R.t0<=M51.RC_MS+4000?R:null;return}
  if(!el){el=document.createElement('div');el.id='m51rc';el.setAttribute('role','status');document.body.appendChild(el);
    el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();if(b.dataset.rc==='x'){M51.rc=null;el.hidden=true;return}m51RcAns(b.dataset.rc==='1')})}
  const over=m51Now()-R.t0>M51.RC_MS,me=R.st.get(NET.id),all=m51RcAll();
  if(all&&!R.done){R.done=1;msg('모두 준비됐어요!','#8cf08a');chatSys('모두 준비됐어요!','#8cf08a');setTimeout(()=>{if(M51.rc===R){M51.rc=null;m51RcUI()}},3500)}
  const L=[...R.st.values()].map(o=>`<span class="${o.ok===1?'ok':o.ok===0?'no':'wait'}">${o.ok===1?'✓':o.ok===0?'✗':'…'} ${esc(o.n)}${o.ok===0?' 잠깐':o.ok==null&&over?' 대답 없음':''}</span>`).join('');
  el.innerHTML=`<div class="m51rch">${all?'모두 준비됐어요!':R.by===NET.id?'준비 확인':`${esc(R.byN)}님: 준비됐나요?`}<button type="button" class="m51rcx" data-rc="x" aria-label="닫기">✕</button></div><div class="m51rcl">${L}</div>`+
    (me&&me.ok==null&&!over?'<div class="m51rcb"><button type="button" class="primary" data-rc="1">준비됨</button><button type="button" class="ghost" data-rc="0">잠깐</button></div>':'');
  el.hidden=false;clearTimeout(m51RcUI.tm);m51RcUI.tm=setTimeout(m51RcUI,over?4100:1000)}
// 같이 하기 창에 「준비 확인」
{const _nu=netUI;netUI=function(){const r=_nu.apply(this,arguments);try{const box=document.getElementById('coopBody');const lv=box&&box.querySelector('#coopLeave');
    if(lv&&NET.on&&!box.querySelector('[data-m51rc]')){lv.insertAdjacentHTML('beforebegin','<button class="primary" type="button" data-m51rc="1">준비 확인 (보스 앞)</button>');box.querySelector('[data-m51rc]').onclick=e=>{e.stopPropagation();m51RcStart()}}}catch(e){m51Err(e)}return r}}

/* ===== 그리기 · 설정 ===== */
{const _r=render;render=function(){const r=_r.apply(this,arguments);try{m51PingDraw()}catch(e){m51Err(e)}return r}}
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);try{const el=SET24.el;if(!el||el.hidden||!m51Ph())return;const sep=el.querySelector('.s24sep'),js=m51JsI(),jf=M45.dev.jf51===1?1:0;
  const seg=(k,v,lab,cur)=>`<button type="button" class="s24seg${cur===v?' on':''}" data-m51="${k}" data-v="${v}" aria-pressed="${cur===v}">${lab}</button>`;
  const box=document.createElement('div');box.className='m43set m51set';box.dataset.tab45='조작';
  box.innerHTML=`<div class="s24h">조이스틱</div><div class="s24row"><span class="m43l">크기</span>${seg('js51',0,'작게',js)}${seg('js51',1,'보통',js)}${seg('js51',2,'크게',js)}</div>`+
    `<div class="s24row"><span class="m43l">자리</span>${seg('jf51',0,'누른 곳에',jf)}${seg('jf51',1,'같은 자리에 고정',jf)}</div><div class="s24n">크게 하면 더 멀리 밀어야 가장 빠르게 걸어요. 고정하면 구슬 위에 옅은 고리가 늘 있고, 왼쪽 어디를 눌러도 그 고리를 기준으로 걸어요. 이 기기에 저장돼요</div>`;
  el.insertBefore(box,sep||null);box.querySelectorAll('[data-m51]').forEach(b=>b.onclick=e=>{e.stopPropagation();m51SetJs(b.dataset.m51,+b.dataset.v);set24Draw();set24Place()})}catch(err){m51Err(err)}}}

{const st=document.createElement('style');st.textContent=`
#pbody .m51lk{min-width:44px}#pbody .m51lk.on{border-color:#d6b262;color:#ffd98a;background:rgba(214,178,98,.14)}
#pbody .item.m51locked .nm::after{content:" · 잠김";color:#d6b262;font-size:12px;font-weight:600}
#pbody .bagc{position:relative}#pbody .m51lkb{position:absolute;left:1px;bottom:1px;font-size:9.5px;line-height:1;padding:1px 2px;border-radius:2px;background:rgba(0,0,0,.75);color:#ffd98a;pointer-events:none}
#pbody .m51ck{min-width:60px}#pbody .m51ck.on{border-color:#8cf08a;color:#bff7bd;background:rgba(80,160,80,.18)}
#pbody .m51arm{border-color:#ff9a6a!important;color:#ffd0b8!important;background:rgba(255,120,80,.16)!important}
#pbody .m51bar{position:sticky;bottom:0;z-index:2;display:flex;gap:6px;flex-wrap:wrap;padding:8px 0 4px;margin-top:8px;background:linear-gradient(rgba(20,16,12,0),rgba(20,16,12,.96) 30%)}
#pbody .m51bar .primary{flex:1 1 200px}
body.m22L #pbody .m51lk,body.m22L #pbody .m51ck,body.m22P #pbody .m51lk,body.m22P #pbody .m51ck,body.m22L #pbody .m51bar button,body.m22P #pbody .m51bar button,body.m22L #pbody [data-m51sel],body.m22P #pbody [data-m51sel]{min-height:40px}
#m45qc .m51q{border-color:#5ad0ff}
#m51rc{position:fixed;z-index:60;left:50%;top:max(8px,env(safe-area-inset-top));transform:translateX(-50%);max-width:min(420px,calc(100vw - 24px));background:rgba(18,14,10,.95);border:1px solid #5ad0ff;border-radius:8px;padding:8px 10px;color:#ece6d6;font-size:13px;box-shadow:0 4px 16px rgba(0,0,0,.6)}
#m51rc[hidden]{display:none}#m51rc .m51rch{display:flex;align-items:center;gap:8px;font-weight:700;color:#bfefff}#m51rc .m51rcx{margin-left:auto;min-width:40px;min-height:36px;padding:0 8px}
#m51rc .m51rcl{display:flex;flex-wrap:wrap;gap:4px 10px;margin-top:4px}#m51rc .ok{color:#8cf08a}#m51rc .no{color:#ff9a6a}#m51rc .wait{color:#a39d8f}
#m51rc .m51rcb{display:flex;gap:8px;margin-top:6px}#m51rc .m51rcb button{flex:1;min-height:44px}
#set24 .m51set .s24row{align-items:center}`;document.head.appendChild(st)}

setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{M51,m51PingSend,m51PingAdd,m51Flip,m51SetLk,m51SelDo,m51RcStart,m51RcAns,m51RcUI,m51JR,m51FixC,m51SetJs,m51Warn})}catch(_){}},0);
