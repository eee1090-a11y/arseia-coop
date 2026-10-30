/* ---------- v50: 의뢰 알림판이 만지지 않아도 아래로 내려가던 것 고침 (사용자 2026-10-30 「의뢰창도 눌러서 옮겨놓으면 … 계속 밑으로 내려오는데」) ----------
   까닭 1) 알림판은 단추만 손가락을 받는다. 길게 누르는 동안 의뢰 글이 바뀌면(잡은 수 · 거리) 알림판을 새로 그려 누르던 단추가 화면에서 빠지고,
      그 손가락의 움직임 · 뗌이 문서까지 오지 않아 「옮기는 중」이 끝나지 않았다. 그 뒤 걷기 조이스틱 손가락이 움직이면 알림판이 그 손가락을 따라
      화면 아래로 내려가 그 자리에 저장됐다(mobile30.js m30QMove · m30QUp).
      → 누른 손가락 번호(identifier)를 기억해 그 손가락만 따른다. 누른 단추에도 직접 귀를 달아 단추가 빠져도 움직임 · 뗌을 받는다.
         다른 손가락이 새로 닿았는데 누르던 손가락이 이미 없으면 옮기기를 그 자리에서 끝낸다.
   까닭 2) 세로 화면에서는 강화 아이콘 줄(작은 지도 아래)이 늘거나 줄 때마다 알림판 위치를 「작은 지도 바로 아래」로 다시 놓았다(mobile18.js MOB.tick).
      옮겨 둔 알림판도 강화가 걸리고 풀릴 때마다 아래로 내려갔다. → 옮겨 둔 알림판(style.left 있음)은 그 높이를 그대로 둔다.
   까닭 3) 옮긴 자리를 기기에 적어 두지만 다시 켤 때 읽는 코드(feedback28.js fb28Clean)가 단축칸 · 기록창 자리만 읽어 알림판 자리를 버렸다.
      → 알림판 자리(L_qhud · P_qhud)도 읽는다(0~1로 맞춤).
   까닭 4) 자리를 「남는 높이(화면 - 알림판 높이)의 몇 %」로 적어서, 다시 놓을 때(다시 켤 때 · 화면 크기가 바뀔 때) 알림판이 그때 짧으면 그만큼 아래에 놓였다.
      → 옮길 때 윗변 자리(화면 높이의 몇 %, t)도 적어 두고, t가 있으면 그 높이에 놓는다(화면 밖으로는 안 나감). t가 없는 예전 자리는 예전대로.
   저장 값은 그대로(arseia-device-v28 pos.L_qhud · P_qhud). 캐릭터 저장과 무관. */
const M50Q={seen:new WeakSet(),tg:null};
function m50QFind(list,id){if(!list)return null;for(let i=0;i<list.length;i++)if(list[i].identifier===id)return list[i];return null}
function m50QOff(){const t=M50Q.tg;M50Q.tg=null;if(t){t.removeEventListener('touchmove',m50QMove);t.removeEventListener('touchend',m50QUp);t.removeEventListener('touchcancel',m50QUp)}}
function m50QEnd(){if(!M30Q.d)return;m30QUp({touches:[],cancelable:false});m50QOff()}// 누르던 손가락을 잃었을 때: 지금 자리에서 끝(옮긴 만큼은 저장)
function m50QDown(e){if(M50Q.seen.has(e))return;M50Q.seen.add(e);
  const d0=M30Q.d;if(d0&&d0.id!=null&&!m50QFind(e.touches,d0.id))m50QEnd();
  m30QDown(e);const d=M30Q.d;if(d&&d!==d0){const t=(e.changedTouches&&e.changedTouches[0])||(e.touches&&e.touches[0]);d.id=t&&t.identifier!=null?t.identifier:null;
    m50QOff();const tg=e.target;if(tg&&tg.addEventListener&&tg!==document){M50Q.tg=tg;tg.addEventListener('touchmove',m50QMove,{passive:false});tg.addEventListener('touchend',m50QUp);tg.addEventListener('touchcancel',m50QUp)}}}
function m50QMove(e){if(M50Q.seen.has(e))return;M50Q.seen.add(e);const d=M30Q.d;if(!d)return;
  if(d.id==null)return m30QMove(e);const t=m50QFind(e.touches,d.id);if(!t)return;// 다른 손가락(걷기 · 마법)은 알림판과 무관
  m30QMove({touches:[t],cancelable:e.cancelable,preventDefault:()=>e.preventDefault(),stopPropagation:()=>e.stopPropagation()})}
function m50QUp(e){if(M50Q.seen.has(e))return;M50Q.seen.add(e);const d=M30Q.d;if(!d){m50QOff();return}
  if(d.id!=null&&m50QFind(e.touches,d.id))return;// 다른 손가락을 뗌: 누르던 손가락은 아직 화면 위
  m30QUp(e);m50QOff()}
document.removeEventListener('touchstart',m30QDown,{capture:true});document.removeEventListener('touchmove',m30QMove,{capture:true});
document.removeEventListener('touchend',m30QUp,true);document.removeEventListener('touchcancel',m30QUp,true);
document.addEventListener('touchstart',m50QDown,{capture:true,passive:true});document.addEventListener('touchmove',m50QMove,{capture:true,passive:false});
document.addEventListener('touchend',m50QUp,true);document.addEventListener('touchcancel',m50QUp,true);
{const _t=MOB.tick;MOB.tick=function(){const q=document.getElementById('qhud'),moved=!!(q&&q.style.left),top=moved?q.style.top:null;const r=_t.apply(this,arguments);
  if(moved){if(q.style.top!==top)q.style.top=top;this.qTop=-1}return r}}// 옮겨 둔 알림판은 그 자리 · 되돌리면 다음 갱신에 다시 작은 지도 아래
{const _c=fb28Clean;fb28Clean=function(v){const o=_c.apply(this,arguments);for(const m of ['L','P']){const p=v&&typeof v==='object'&&v.pos&&v.pos[m+'_qhud'];if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))o.pos[m+'_qhud']={x:clamp(p.x,0,1),y:clamp(p.y,0,1)}}return o}}
{const _u=m30QUp;m30QUp=function(e){const d=M30Q.d,on=!!(d&&d.on);const r=_u.apply(this,arguments);if(on)try{const p=FB28.pos[M22.mode()+'_qhud'],q=fb28Rect('qhud'),vp=M22.vp();if(p&&q){p.t=clamp(q.y/Math.max(1,vp.h),0,1);fb28Save()}}catch(err){if(window.__QA)throw err}return r}}
{const _a=fb28Apply;fb28Apply=function(id){if(id==='qhud'&&M22.phone()){const p=FB28.pos[M22.mode()+'_qhud'],r=fb28Rect('qhud');if(p&&r&&Number.isFinite(p.t)){const vp=M22.vp();fb28Move('qhud',p.x*Math.max(0,vp.w-r.w),p.t*vp.h);return}}return _a.apply(this,arguments)}}
{const _c=fb28Clean;fb28Clean=function(v){const o=_c.apply(this,arguments);for(const m of ['L','P']){const p=v&&typeof v==='object'&&v.pos&&v.pos[m+'_qhud'];if(o.pos[m+'_qhud']&&p&&Number.isFinite(p.t))o.pos[m+'_qhud'].t=clamp(p.t,0,1)}return o}}
try{if(!window.__QA){const o=fb28Clean(JSON.parse(localStorage.getItem(FB28.key)||'null'));for(const m of ['L','P'])if(o.pos[m+'_qhud']&&!FB28.pos[m+'_qhud'])FB28.pos[m+'_qhud']=o.pos[m+'_qhud']}}catch(_){}// 이미 읽은 기기 설정에 알림판 자리만 더한다
