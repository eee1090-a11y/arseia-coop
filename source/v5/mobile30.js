/* ---------- v30 휴대폰 손보기 (사용자 2026-10-13 15:59) ----------
   「모바일에서 줌인줌아웃이 안돼 · 짝문 누르면 너무 작아서 제대로 보이지도 않아 · 스킬트리나 캐릭터 창 등이 떴을 때 바깥을 누르면 닫히게」
   · 두 손가락 확대(v28): 화면 가운데 기록창(#log) 위에 손가락이 닿으면 기록창이 손가락을 가져가서(길게 눌러 옮기기) 확대가 안 됐다.
     → 기록창 위의 손가락도 두 손가락 확대에 넣는다. 두 번째 손가락이 닿으면 기록창 옮기기는 취소. 손가락을 다 떼면 남은 기록을 비운다.
   · 짝문 지도: 휴대폰에서 화면에 다 넣느라 0.3배까지 줄던 것을 처음엔 0.9배(읽을 수 있는 크기)로 열고, 지도 안에서 밀어 본다.
     지도 칸 안에서 두 손가락으로 벌리고 오므리면 0.3~1.3배, 위쪽 ＋ − 단추로도 바꾼다. 지금 있는 지역이 가운데.
   · 창 바깥 누르기: 휴대폰에서 창이 화면을 거의 다 덮어 바깥이 없었다. 창 둘레에 게임 화면이 보이는 띠(가로 화면 양옆 · 세로 화면 위아래)를 남겨
     그곳을 누르면 닫힌다(원래 있던 바깥 누르기 그대로). 세계 지도(M)도 같다.
   · 길게 눌러 옮기기(v28: 단축칸 · 기록창): 2초는 너무 길어 0.7초로. 의뢰 알림판(#qhud)도 길게 눌러 옮긴다(손가락 스크롤 · 단추는 그대로).
     자리는 이 기기에 기록(v28 arseia-device-v28 의 pos.L_qhud / P_qhud), 설정의 「위치 되돌리기」로 모두 처음 자리.
   · 짝문 배율은 이번 접속 동안만 기억. */
const M30={gz:null,gcur:1,gfit:1,gh:0,gp:null};
// 1) 두 손가락 확대: 기록창 위 손가락도 받기
addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||!M22.phone())return;const t=e.target;if(!(t===cv||(t&&t.closest&&t.closest('#log'))))return;
  const pts=FB28.pointers;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size<2)return;
  fb28Cancel();for(const id of pts.keys())try{cv.setPointerCapture(id)}catch(_){}
  if(!FB28.pinch){const [a,b]=[...pts.values()];FB28.pinch={d:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),z:FB28.zoom}}
  joy=null;fireTouch=null;mouse.l=mouse.r=false;try{castStop('move')}catch(_){}e.preventDefault();e.stopImmediatePropagation()},true);
for(const ev of ['pointerup','pointercancel'])addEventListener(ev,e=>{if(e.pointerType==='touch'&&e.target!==cv)FB28.pointers.delete(e.pointerId)},true);
const m30TouchEnd=e=>{if(e.touches&&e.touches.length)return;if(FB28.pointers.size)FB28.pointers.clear();if(FB28.pinch){FB28.pinch=null;m22Rebake();fb28Save()}};
addEventListener('touchend',m30TouchEnd,true);addEventListener('touchcancel',m30TouchEnd,true);
// 1-2) 길게 눌러 옮기기: 0.7초 · 의뢰 알림판
FB28.hold=700;
const M30Q={d:null};
function m30QDown(e){if(!M22.phone()||FB28.drag||M30Q.d||!e.touches||e.touches.length!==1)return;const q=document.getElementById('qhud');if(!q||!q.contains(e.target))return;const t=e.touches[0],r=fb28Rect('qhud');if(!r)return;
  const d=M30Q.d={x:t.clientX,y:t.clientY,r,on:false};d.timer=setTimeout(()=>{if(M30Q.d!==d)return;d.on=true;q.classList.add('fb28moving');try{navigator.vibrate&&navigator.vibrate(15)}catch(_){}},FB28.hold)}
function m30QMove(e){const d=M30Q.d;if(!d)return;const t=e.touches&&e.touches[0];if(!t)return;const dx=t.clientX-d.x,dy=t.clientY-d.y;
  if(!d.on){if(Math.hypot(dx,dy)>12){clearTimeout(d.timer);M30Q.d=null}return}if(e.cancelable)e.preventDefault();e.stopPropagation();fb28Move('qhud',d.r.x+dx,d.r.y+dy)}
function m30QUp(e){const d=M30Q.d;if(!d)return;clearTimeout(d.timer);M30Q.d=null;const q=document.getElementById('qhud');if(q)q.classList.remove('fb28moving');if(!d.on)return;
  if(e.cancelable)e.preventDefault();FB28.blockedUntil=performance.now()+500;const r=fb28Rect('qhud'),vp=M22.vp();if(r){FB28.pos[M22.mode()+'_qhud']={x:r.x/Math.max(1,vp.w-r.w),y:r.y/Math.max(1,vp.h-r.h)};fb28Save()}}
document.addEventListener('touchstart',m30QDown,{capture:true,passive:true});document.addEventListener('touchmove',m30QMove,{capture:true,passive:false});
document.addEventListener('touchend',m30QUp,true);document.addEventListener('touchcancel',m30QUp,true);
document.addEventListener('click',e=>{if(M22.phone()&&performance.now()<FB28.blockedUntil&&e.target.closest&&e.target.closest('#qhud')){e.preventDefault();e.stopImmediatePropagation()}},true);
{const _m=fb28Move;fb28Move=function(id){if(id==='qhud'){const q=document.getElementById('qhud');if(q&&q.style.boxSizing!=='border-box'){const w=q.getBoundingClientRect().width;q.style.boxSizing='border-box';if(w>0)q.style.width=w+'px'}}return _m.apply(this,arguments)}}// 알림판은 안쪽 여백 때문에 옮길 때마다 넓어지지 않게
{const _r=fb28Restore;fb28Restore=function(){_r.apply(this,arguments);const q=document.getElementById('qhud');if(q)for(const k of ['position','width','maxWidth','left','top','bottom','right','transform','boxSizing'])q.style[k]=''}}
const m30QApply=()=>{const q=document.getElementById('qhud');if(q&&M22.phone()&&FB28.pos[M22.mode()+'_qhud']&&!q.style.left)fb28Apply('qhud')};
{const _qh=questHud;questHud=function(){const r=_qh.apply(this,arguments);try{m30QApply()}catch(_){}return r}}
addEventListener('resize',()=>setTimeout(()=>{const q=document.getElementById('qhud');if(q)q.style.left='';m30QApply()},0));
setTimeout(m30QApply,0);
// 2) 짝문 지도 배율
function m30GateParts(){const w=pbody.querySelector('#g26w'),fit=w&&w.querySelector('.f29mapfit'),m=fit&&fit.querySelector('.g26m');return m?{w,fit,m,mw:parseFloat(m.style.width),mh:parseFloat(m.style.height)}:null}
function m30GateZoom(z,keep){const G=m30GateParts();if(!G)return;const {w,fit,m,mw,mh}=G;z=clamp(z,Math.min(M30.gfit,.3),1.3);
  const oz=M30.gcur||1,cx=(w.scrollLeft+w.clientWidth/2)/oz,cy=(w.scrollTop+w.clientHeight/2)/oz;
  fit.style.width=Math.ceil(mw*z)+'px';fit.style.height=Math.ceil(mh*z)+'px';m.style.transform='scale('+z+')';
  w.style.height=Math.max(60,Math.min(M30.gh,Math.ceil(mh*z)+2))+'px';w.style.overflow='auto';M30.gcur=z;
  if(keep){w.scrollLeft=Math.max(0,cx*z-w.clientWidth/2);w.scrollTop=Math.max(0,cy*z-w.clientHeight/2)}
  else{const c=w.querySelector('.g26c.now')||w.querySelector('[data-greg="home"]');if(c){w.scrollLeft=Math.max(0,(c.offsetLeft+c.offsetWidth/2)*z-w.clientWidth/2);w.scrollTop=Math.max(0,(c.offsetTop+c.offsetHeight/2)*z-w.clientHeight/2)}}
  const lb=pbody.querySelector('.m30zl');if(lb)lb.textContent=Math.round(z*100)+'%'}
function m30Gate(prev){const G=m30GateParts();if(!G)return;const {w,m}=G,mt=/scale\(([\d.]+)\)/.exec(m.style.transform);M30.gfit=mt?+mt[1]:1;
  const card=panel.querySelector('.card'),cr=card.getBoundingClientRect(),cs=getComputedStyle(card),r=w.getBoundingClientRect();
  M30.gh=Math.max(60,Math.min(innerHeight-8,cr.bottom)-r.top-parseFloat(cs.paddingBottom||0)-6);M30.gcur=M30.gfit;
  const head=pbody.querySelector('.f29gatehead');if(head&&!head.querySelector('.m30z')){const box=document.createElement('span');box.className='m30z';
    box.innerHTML='<button type="button" class="ghost" data-m30z="-1" aria-label="지도 작게">−</button><b class="m30zl"></b><button type="button" class="ghost" data-m30z="1" aria-label="지도 크게">＋</button>';
    for(const b of box.querySelectorAll('button'))b.addEventListener('click',e=>{e.stopPropagation();const z=M30.gcur*(b.dataset.m30z>0?1.2:1/1.2);m30GateZoom(z,true);M30.gz=M30.gcur});head.appendChild(box)}
  const z=M30.gz!=null?M30.gz:Math.max(M30.gfit,.9);m30GateZoom(z,false);if(prev&&prev.z===M30.gcur){w.scrollLeft=prev.sl;w.scrollTop=prev.st}
  w.addEventListener('touchstart',e=>{if(e.touches.length===2){const [a,b]=e.touches;M30.gp={d:Math.max(1,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)),z:M30.gcur};e.preventDefault()}},{passive:false});
  w.addEventListener('touchmove',e=>{if(e.touches.length===2&&M30.gp){const [a,b]=e.touches;m30GateZoom(M30.gp.z*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/M30.gp.d,true);e.preventDefault()}},{passive:false});
  const end=e=>{if(e.touches.length<2&&M30.gp){M30.gp=null;M30.gz=M30.gcur}};w.addEventListener('touchend',end);w.addEventListener('touchcancel',end)}
{const _rp=renderPanel;renderPanel=function(){const g=tab==='gate'&&M22.phone()?m30GateParts():null,prev=g?{z:M30.gcur,sl:g.w.scrollLeft,st:g.w.scrollTop}:null;const r=_rp.apply(this,arguments);
  try{if(tab==='gate'&&M22.phone())m30Gate(prev)}catch(err){if(window.__QA)throw err}return r}}
{const st=document.createElement('style');st.textContent=`
body.m22L #panel .card,body.m22L #wmap .card{max-width:calc(100% - 92px)!important}
body.m22P #panel .card,body.m22P #wmap .card{max-height:calc(100% - 76px)!important}
.f29gatehead .m30z{display:inline-flex;align-items:center;gap:6px;margin-left:auto}
.f29gatehead .m30z button{min-width:40px;min-height:30px;padding:0 10px;font-size:18px;line-height:1}
.f29gatehead .m30zl{min-width:44px;text-align:center;font-size:13px;color:#d6b262}`;document.head.appendChild(st)}
setTimeout(()=>{if(window.__game)Object.assign(window.__game,{M30Q,m30QDown,m30QMove,m30QUp,M30,m30Gate,m30GateZoom,m30GateParts})},0);
