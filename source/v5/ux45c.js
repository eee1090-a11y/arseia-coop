/* ---------- v45 휴대폰을 PC처럼 쾌적하게 · P1 보기 거리 · P7 게임패드 · P8 태블릿 (사용자 2026-10-24 「모두반영해줘」 · 「휴대폰도 PC처럼 쾌적하게」) ----------
   P1 보기 거리: 설정 ⚙(과 「화면」 창)에 「보기 거리」 아주 가깝게 1.15 · 가깝게 1 · 보통 0.85 · 넓게 0.72. GFX.zoom이 1보다 작아도 된다.
      화면 픽셀 수는 그대로이고(b1 resize: W=cw/CZ) 세계가 더 넓게 보인다. 휴대폰은 예전처럼 여기에 가로 .75 · 세로 .8 · 손가락 벌리기 배율을 곱한다(mobile22 m22Cam).
      고르지 않았으면: 휴대폰 = 보통 0.85, PC · 태블릿 = 1(지금 그대로). 고르면 'arseia-gfx'에 zoom과 zc:1(고른 표시)을 같이 적는다(캐릭터 키는 건드리지 않음).
      예전에 고른 1.15는 고른 값으로 본다. 예전 1은 기본값과 구별할 수 없어 「안 고름」으로 본다.
      조이스틱: 화면 좌표(rel ÷ CZ)라 세계를 넓게 보면 같은 손가락 거리가 더 큰 값이 된다 → 보기 거리 1일 때와 같은 손맛(같은 손가락 거리에서 최고 속도)과 같은 크기로 그린다.
   P7 게임패드(Gamepad API, 표준 배치): 왼쪽 막대 = 이동, 오른쪽 막대 = 겨누는 방향(놓은 뒤 1.2초까지 기억, 그 방향 25° 안의 몬스터가 있으면 그 몬스터),
      A · B · X · Y · LB · RB · LT · RT = 단축칸 좌 · 우 · 1~6(누르고 있으면 키처럼 계속), 십자키 = 쪽 넘기기(휴대폰 가로는 그 쪽의 칸), 시작 = ☰(PC는 설정 ⚙) · 열린 창은 닫기, B = 열린 창 닫기.
      연결되면 한 번 안내. 연결 안 하면(gamepadconnected가 없으면) 아무것도 읽지도 바꾸지도 않는다.
   P8 태블릿(터치 · 높이 500 넘음 · 폭 640 넘음)은 PC 배치. 세로 태블릿(768×1024)에서 PC 단축바 두 줄이 두 구슬과 겹쳐 → PC 배치에서 단축바가 두 구슬 사이에 안 들어가면 들어가게 줄인다(CSS zoom).
   붙는 곳: tap20.js 바로 앞(b5.js는 맨 끝). b5의 let/const(panel · rel)는 함수 안에서만(실행은 시작 뒤) 쓴다. */
const UX45C={Z:[[1.15,'더 가깝게'],[1,'가깝게'],[.85,'보통'],[.72,'넓게']],PHONE_Z:.85,phoneF:null,autoZ:1,barZ:1,bw:0};
const ux45cZOk=z=>UX45C.Z.some(a=>a[0]===z);
// 진짜 기기가 휴대폰인지: M22.mode()와 같은 계산이지만 시험용 강제(M22.force · vpF)는 보지 않는다 (시험은 phoneF로)
function ux45cPhone(){if(UX45C.phoneF!=null)return !!UX45C.phoneF;const w=innerWidth,h=innerHeight,t=typeof M22==='object'?M22.touch():false;return (t&&w>h&&h<=500&&w<=1000)||w<=640}
function ux45cDefZ(){return ux45cPhone()?UX45C.PHONE_Z:1}
// 고르지 않았으면 기기에 맞는 기본값 (휴대폰 보통 · PC 1)
// 다른 곳(시험 · 개발용 dbgZoom)이 GFX.zoom을 직접 바꿨으면 건드리지 않는다: 마지막으로 기본값으로 넣은 값(autoZ)일 때만 바꾼다
function ux45cAuto(){if(GFX.zc||GFX.zoom!==UX45C.autoZ)return false;const z=ux45cDefZ();if(GFX.zoom===z)return false;GFX.zoom=UX45C.autoZ=z;return true}
// 저장된 값 읽기 (b1은 1.15만 읽으므로 여기서 다시 읽는다)
function ux45cRead(raw){try{const v=JSON.parse(raw||'null');if(v&&typeof v==='object'&&!Array.isArray(v)&&ux45cZOk(v.zoom)&&(v.zc===1||v.zoom===1.15))return v.zoom}catch(_){}return null}
// 시작할 때 한 번: 저장된 값을 읽고 바로 화면에 맞춘다 (b1의 첫 resize는 이미 지나감 · PC는 m22Cam이 다시 안 부르므로 여기서)
function ux45cInit(){let z=null;try{z=ux45cRead(localStorage.getItem('arseia-gfx'))}catch(_){}if(z!=null){GFX.zoom=z;GFX.zc=1}else{GFX.zoom=1;delete GFX.zc}UX45C.autoZ=GFX.zoom;resize()}
ux45cInit();
{const _r=resize;resize=function(){try{ux45cAuto()}catch(e){if(window.__QA)throw e}return _r.apply(this,arguments)}}
// 창 크기가 바뀌면(휴대폰 ↔ PC 폭) b1의 resize · m22Cam보다 먼저 기본값을 다시 고른다
addEventListener('resize',()=>{try{if(ux45cAuto())setTimeout(()=>{try{m22Rebake()}catch(_){}},0)}catch(e){if(window.__QA)throw e}},true);
function ux45cZoom(z){if(!ux45cZOk(z))return;GFX.zoom=z;GFX.zc=1;gfxSave();resize();m22Rebake();try{if(typeof followCam==='function')followCam()}catch(_){}}
// 보기 거리를 「안 고름」으로 되돌리기 (시험용 · 화면에는 없음)
function ux45cZoomReset(){delete GFX.zc;UX45C.autoZ=GFX.zoom;gfxSave();resize();m22Rebake()}
const ux45cZName=z=>(UX45C.Z.find(a=>a[0]===z)||[0,''])[1];
function ux45cZHtml(){const cur=GFX.zoom;return `<div class="s24h">보기 거리</div><div class="s24row ux45z">${UX45C.Z.map(([v,t])=>`<button type="button" class="s24seg${cur===v?' on':''}" data-ux45z="${v}" aria-pressed="${cur===v}">${t}<small>${v}</small></button>`).join('')}</div>
    <div class="s24n">넓을수록 멀리 보이고 캐릭터는 작아져요. 처음에 휴대폰은 보통, PC는 가깝게예요</div>`}
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);try{const el=SET24.el;if(!el||el.hidden)return;const ns=el.querySelectorAll('.s24n'),at=ns[1]||ns[0];if(!at)return;
  const box=document.createElement('div');box.className='ux45zset';box.innerHTML=ux45cZHtml();at.after(box);
  box.querySelectorAll('[data-ux45z]').forEach(b=>b.onclick=e=>{e.stopPropagation();ux45cZoom(+b.dataset.ux45z);set24Draw();set24Place()})}catch(e){if(window.__QA)throw e}}}
// 「화면」 창(설정 ⚙ → 화면)의 카메라 1.0 / 1.15 둘을 보기 거리 넷으로
function ux45cGfxPanel(){const el=document.getElementById('gfxPanel');if(!el)return;const r=el.querySelector('[name="gz"]');if(!r)return;const row=r.closest('div'),hd=row.previousElementSibling,nt=row.nextElementSibling;
  if(hd)hd.textContent='보기 거리';if(nt)nt.textContent='넓을수록 더 멀리 보이고 캐릭터 · 몬스터는 작아져요. 더 가깝게는 크게 보이고 보이는 범위는 좁아져요.';row.style.flexWrap='wrap';row.style.columnGap='12px';
  row.innerHTML=UX45C.Z.map(([v,t])=>`<label><input type="radio" name="gz" data-ux45z="${v}"${GFX.zoom===v?' checked':''}> ${t} (${v})</label>`).join('');
  row.querySelectorAll('[data-ux45z]').forEach(i=>i.onchange=()=>ux45cZoom(+i.dataset.ux45z))}
{const b=document.getElementById('gfxBtn');if(b&&b.onclick){const _o=b.onclick;b.onclick=function(e){const r=_o.apply(this,arguments);try{ux45cGfxPanel()}catch(err){if(window.__QA)throw err}return r}}}

/* 조이스틱: 보기 거리 1일 때와 같은 손맛 · 같은 크기 (손가락 조이스틱만 · 길 찾기(tw22) · 게임패드는 그대로) */
const ux45cJoyK=()=>joy&&typeof joy.id==='number'&&GFX.zoom<1?GFX.zoom:1;
{const _u=update;update=function(dt){const r=ux45cUpd(_u,dt);if(PAD.held.length&&P&&!P.dead&&!paused)try{for(const i of PAD.held)castSlot(i)}catch(e){if(window.__QA)throw e}return r}}
function ux45cUpd(_u,dt){
  const k=ux45cJoyK();if(k===1)return _u(dt);const j=joy,x=j.x,y=j.y;j.x=j.ox+(x-j.ox)*k;j.y=j.oy+(y-j.oy)*k;try{return _u(dt)}finally{j.x=x;j.y=y}}
// 게임패드는 그리기마다 읽는다(창이 열려 멈춘 동안에도 시작 · B로 닫을 수 있게)
{const _rn=render;render=function(){if(PAD.on){const t=performance.now();try{padTick(Math.min(.25,Math.max(0,(t-(PAD.lastT||t))/1000)))}catch(e){if(window.__QA)throw e}PAD.lastT=t}const k=ux45cJoyK();if(k===1)return _rn.apply(this,arguments);const j=joy;joy=null;let r;try{r=_rn.apply(this,arguments)}finally{joy=j}
  try{const R=44/k,dx=j.x-j.ox,dy=j.y-j.oy,l=Math.hypot(dx,dy),f=l>R?R/l:1;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=1;ctx.strokeStyle='rgba(236,230,214,.35)';ctx.lineWidth=2/k;ctx.beginPath();ctx.arc(j.ox,j.oy,R,0,6.283);ctx.stroke();
    ctx.fillStyle='rgba(236,230,214,.35)';circ(j.ox+dx*f,j.oy+dy*f,18/k)}catch(e){if(window.__QA)throw e}return r}}

/* ===== P7 게임패드 ===== */
const PAD={on:false,pg:0,aim:null,aimT:0,prev:[],told:false,DEAD:.25,AIM_KEEP:1.2,AIM_CONE:25*Math.PI/180,AIM_MAX:650,AIM_MIN:140,AIM_LEN:340,
  LBL:['A','B','X','Y','LB','RB','LT','RT'],badgeT:0,used:false,held:[]};
function padList(){try{return navigator.getGamepads?[...navigator.getGamepads()].filter(g=>g&&g.connected!==false):[]}catch(_){return []}}
function padTell(){if(PAD.told)return;PAD.told=true;const t='게임패드가 연결됐어요 · 왼쪽 막대 이동 · 오른쪽 막대 겨누기 · A B X Y LB RB LT RT = 단축칸 좌 우 1~6 · 십자키 = 쪽 넘기기 · 시작 = 메뉴';
  let el=document.getElementById('ux45pad');if(!el){el=document.createElement('div');el.id='ux45pad';el.setAttribute('role','status');document.body.appendChild(el)}
  el.textContent=t;el.hidden=false;clearTimeout(PAD.tt);PAD.tt=setTimeout(()=>{el.hidden=true},7000)}
addEventListener('gamepadconnected',()=>{PAD.on=true;PAD.prev=[];padTell()});
addEventListener('gamepaddisconnected',()=>{if(!padList().length)padOff()});
function padOff(){PAD.on=false;PAD.aim=null;PAD.prev=[];PAD.held=[];if(joy&&joy.id==='pad')joy=null;padBadges(true)}
const padUi=()=>{try{return typeof wheel25UiOpen==='function'?wheel25UiOpen():!panel.hidden}catch(_){return false}};
// 단축칸 8개: 휴대폰 가로 쪽 넘기기 중이면 지금 쪽에 보이는 칸, 아니면 0~7 · 8~15 · 16~ (추가 단축바 포함) 묶음
function padSlots(){try{if(typeof m43PageOn==='function'&&m43PageOn()&&M43.pgN>1){const bar=document.getElementById('bar');
    return [...bar.querySelectorAll('button.sk[data-slot]')].filter(b=>!b.classList.contains('m43off')&&!b.classList.contains('empty')&&b.offsetParent!==null).map(b=>+b.dataset.slot).slice(0,8)}}catch(_){}
  const n=typeof b44Vis==='function'?b44Vis():21,pgN=Math.max(1,Math.ceil(n/8));if(PAD.pg>=pgN)PAD.pg=0;const a=[];for(let i=PAD.pg*8;i<Math.min(n,PAD.pg*8+8);i++)a.push(i);return a}
function padPage(d){try{if(typeof m43PageOn==='function'&&m43PageOn()&&M43.pgN>1){M43.pg=(M43.pg+d+M43.pgN)%M43.pgN;m43Page()}else{const n=typeof b44Vis==='function'?b44Vis():21,pgN=Math.max(1,Math.ceil(n/8));PAD.pg=(PAD.pg+d+pgN)%pgN}}catch(e){if(window.__QA)throw e}
  const s=padSlots();if(s.length)try{msg(`게임패드 단추: 단축칸 ${s.map(i=>SLOTS[i]?SLOTS[i].k:'+'+(i-20)).join(' ')}`,'#a39d8f')}catch(_){}padBadges()}
// 지금 단추에 맞은 칸에 작은 글자(A · B …)
function padBadges(off){for(const b of document.querySelectorAll('#bar button.sk[data-ux45p]'))b.removeAttribute('data-ux45p');if(off||!PAD.on)return;const s=padSlots();
  s.forEach((i,k)=>{const b=document.querySelector(`#bar button.sk[data-slot="${i}"]`);if(b)b.setAttribute('data-ux45p',PAD.LBL[k])})}
function padMenu(){try{const it=document.getElementById('intro');if(it&&!it.hidden)return;// 시작 화면에서는 아무것도 안 함
  if(typeof SET24==='object'&&SET24.el&&!SET24.el.hidden){set24Open(false);return}if(!panel.hidden){closePanel();return}
  if(M22.phone()){const m=document.getElementById('menuBtn');if(m)m.click()}else if(typeof set24Open==='function')set24Open(true)}catch(e){if(window.__QA)throw e}}
function padAimPt(){const a=PAD.aim;if(!a||!P)return null;const d=scrDir(a.sx,a.sy),ang=Math.atan2(d.y,d.x);let best=null,bs=1e9;
  for(const e of enemies){if(e.dead)continue;const dx=e.x-P.x,dy=e.y-P.y,L=Math.hypot(dx,dy);if(L>PAD.AIM_MAX||L<1)continue;let da=Math.abs(Math.atan2(dy,dx)-ang);if(da>Math.PI)da=2*Math.PI-da;if(da>PAD.AIM_CONE)continue;const sc=da*400+L*.3;if(sc<bs){bs=sc;best=e}}
  if(best)return{x:best.x,y:best.y};const L=PAD.AIM_MIN+PAD.AIM_LEN*a.m;return{x:P.x+d.x*L,y:P.y+d.y*L}}
{const _ap=aimPoint;aimPoint=function(){if(PAD.on&&PAD.aim){const t=padAimPt();if(t)return t}return _ap.apply(this,arguments)}}
function padTick(dt){if(!PAD.on)return;const g=padList()[0];if(!g){padOff();return}
  const ax=g.axes||[],bt=g.buttons||[],dn=i=>{const b=bt[i];return !!b&&(typeof b==='object'?!!(b.pressed||b.value>.5):b>.5)},now=[];for(let i=0;i<17;i++)now[i]=dn(i);const pv=PAD.prev,ed=i=>now[i]&&!pv[i];PAD.prev=now;
  const DZ=PAD.DEAD,st=(x,y)=>{x=+x||0;y=+y||0;const l=Math.hypot(x,y);return l>DZ?{x,y,l,m:Math.min(1,(l-DZ)/(1-DZ))}:null},ls=st(ax[0],ax[1]),rs=st(ax[2],ax[3]);
  if(ls||rs||now.some(Boolean)){PAD.used=true;if(mouse.active&&!mouse.l&&!mouse.r)mouse.active=false}
  if(ed(9)){PAD.held=[];padMenu();return}const ui=padUi();if(ui){PAD.held=[];if(ed(1))padMenu();if(joy&&joy.id==='pad')joy=null;return}
  if(ed(14)||ed(12))padPage(-1);if(ed(15)||ed(13))padPage(1);
  if(ls&&P&&!P.dead){const r=Math.max(9,44*ls.m);if(!joy||joy.id==='pad')joy={id:'pad',ox:0,oy:0,x:ls.x/ls.l*r,y:ls.y/ls.l*r}}else if(joy&&joy.id==='pad')joy=null;
  if(rs){PAD.aim={sx:rs.x,sy:rs.y,m:rs.m};PAD.aimT=PAD.AIM_KEEP;if(P&&!P.dead&&!ls){const d=scrDir(rs.x,rs.y);P.face=Math.atan2(d.y,d.x)}}else if(PAD.aim&&(PAD.aimT-=dt)<=0)PAD.aim=null;
  // 누르고 있는 단추의 칸: 키처럼 update마다 castSlot (tap20의 「누르고 있음」 판단과 맞게 update 안에서)
  const s=padSlots(),h=[];for(let k=0;k<8;k++)if(now[k]&&s[k]!=null)h.push(s[k]);PAD.held=h;
  if((PAD.badgeT-=dt)<=0){PAD.badgeT=.5;padBadges()}}

/* ===== P8 태블릿 · PC 배치: 단축바가 두 구슬 사이에 안 들어가면 들어가게 줄이기 ===== */
// 두 구슬 사이에 안 들어가면: ① 예전 좁은 화면처럼 단축바를 구슬 위 한 줄 전체로 올리고(.ux45bw) ② 그래도 넘치면 줄인다(CSS zoom, 0.55배까지)
function ux45cBarNeed(bar){let l=1e9,r=-1e9;for(const b of bar.querySelectorAll('button')){const q=b.getBoundingClientRect();if(q.width>0){l=Math.min(l,q.left);r=Math.max(r,q.right)}}// 줄 안 칸이 가운데 정렬로 양쪽으로 넘치므로 칸 끝에서 끝까지 잰다
  const cs=getComputedStyle(bar);return r>l?r-l+parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight)+parseFloat(cs.borderLeftWidth)+parseFloat(cs.borderRightWidth)+1:0}
function ux45cBarFit(){const bar=document.getElementById('bar');if(!bar)return;const wrap=bar.parentElement,B=document.body;
  const off=()=>{bar.style.zoom='';B.classList.remove('ux45bw');UX45C.barZ=1;UX45C.bw=0};
  if(!wrap||M22.phone()){if(bar.style.zoom||B.classList.contains('ux45bw'))off();return}
  // 쓸 수 있는 폭 = 아래 줄(.bottom) 폭 − 구슬들 − 틈 (wrap 폭은 칸이 들어가면 칸만큼으로 줄어 있어 못 쓴다)
  const bot=wrap.parentElement,room=all=>{const cs=getComputedStyle(bot),g=parseFloat(cs.columnGap)||0;let w=bot.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
    if(!all)for(const c of bot.children)if(c!==wrap&&c.offsetWidth>0)w-=c.offsetWidth+g;return w};
  off();let need=ux45cBarNeed(bar);if(!(need>room(false)+.5))return;
  B.classList.add('ux45bw');UX45C.bw=1;need=ux45cBarNeed(bar);const av=room(true);if(need>av+1&&av>0){const z=Math.max(.55,Math.floor(av/need*1000)/1000);UX45C.barZ=z;bar.style.zoom=String(z)}
  const t=bar.getBoundingClientRect().top;if(t>0)B.style.setProperty('--ux45act',Math.round(innerHeight-t+10)+'px')}
{const _bb=buildBar;buildBar=function(){const r=_bb.apply(this,arguments);try{ux45cBarFit();if(PAD.on)padBadges()}catch(e){if(window.__QA)throw e}return r}}
addEventListener('resize',()=>{setTimeout(()=>{try{ux45cBarFit()}catch(_){}},0)});

{const st=document.createElement('style');st.textContent=`
#set24 .ux45z .s24seg{white-space:nowrap;font-size:12.5px;letter-spacing:-.2px;display:flex;flex-direction:column;align-items:center;line-height:1.15}#set24 .ux45z .s24seg small{font-size:10.5px;color:#a39d8f}#set24 .ux45z .s24seg.on small{color:#e8d8b0}
#set24{max-height:calc(100vh - 16px);overflow-y:auto}/* v45: 보기 거리 줄이 생겨 PC에서도 화면보다 길어질 수 있음 */
#ux45pad{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:80;max-width:min(560px,calc(100vw - 24px));box-sizing:border-box;padding:8px 12px;background:rgba(20,16,10,.94);border:1px solid #8a7346;border-radius:8px;color:#ffe6a8;font-size:13px;line-height:1.45;text-align:center;pointer-events:none}
#ux45pad[hidden]{display:none}
body.ux45bw #hud .bottom{justify-content:space-between;flex-wrap:wrap}body.ux45bw #hud .barwrap{order:-1;flex-basis:100%}body.ux45bw #act{bottom:var(--ux45act,250px)}
#bar button.sk[data-ux45p]{position:relative}
#bar button.sk[data-ux45p]::before{content:attr(data-ux45p);position:absolute;right:1px;bottom:1px;z-index:2;min-width:13px;padding:0 2px;border-radius:3px;background:rgba(10,8,4,.85);border:1px solid #d6b262;color:#ffe2a0;font:700 9px/12px sans-serif;text-align:center;pointer-events:none}`;document.head.appendChild(st)}
setTimeout(()=>{try{ux45cBarFit();if(window.__game)Object.assign(window.__game,{UX45C,PAD,ux45cPhone,ux45cDefZ,ux45cAuto,ux45cZoom,ux45cZoomReset,ux45cZName,ux45cBarFit,ux45cRead,ux45cInit,padTick,padSlots,padUi,padPage,padOff,padAimPt,padMenu,GFX})}catch(_){}},0);
