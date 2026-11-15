/* ---------- v62 의뢰 알림판 스크롤 · 휴대폰 캐릭터 바꾸기 (사용자 2026-11-15 「의뢰창 길어지면 아래 못보는데 스크롤 되게 해줘」
   「모바일에서 캐릭터 바꿀 수 없는 거 같은데 그것도 해결해주고」) ----------
   의뢰 알림판(#qhud, 화면 오른쪽 의뢰 목록)
   · 예전: PC는 높이 제한 없이 화면 아래로 넘쳐 잘렸고, 휴대폰은 높이 제한(세로 34vh · 가로 남은 높이) 안에서 넘친 줄이 잘려 안 보였다.
     세로 휴대폰은 의뢰 두 개만 보이고 나머지는 「그 밖에 N개 (일지)」였다.
   · 이제: 내용이 판보다 길면 판 안에서 위아래로 굴린다(PC 마우스 휠 · 휴대폰 손가락으로 밀기). 넘치지 않으면 예전과 똑같다(판 뒤 게임 화면 누르기 그대로).
     PC 판 높이는 화면 아래(아래쪽 단축칸과 겹치면 그 위)까지. 휴대폰은 예전 높이 그대로.
     세로 휴대폰도 받은 의뢰를 모두 보여 주고 굴려서 본다(「그 밖에 N개」 줄 없음).
     휴대폰에서 판을 0.7초 꾹 눌러 옮기기는 그대로(누른 채 움직이지 않을 때만).
   캐릭터 바꾸기(휴대폰)
   · 예전: 설정 ⚙ → 「저장」 탭 → 「캐릭터 선택 · 조작법」 안에만 있어 찾기 어려웠다.
   · 이제: ☰ 메뉴(그림 칸 줄)와 창 옆 띠에 「캐릭터」 칸을 더한다. 누르면 지금 캐릭터를 저장하고(예전 단추와 같은 save) 첫 화면의 캐릭터 목록을 연다.
     다른 캐릭터의 「이어하기」를 누르면 그 캐릭터로 바뀐다. 다른 칸의 캐릭터 저장은 건드리지 않는다. 설정 「저장」 탭의 단추도 그대로.
   저장 바뀜 없음. */
const UI62={pad:12,min:90,gap:8,t:0};
{const st=document.createElement('style');st.textContent=`#qhud>*{flex-shrink:0}
html body #qhud.q62s{overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;pointer-events:auto;scrollbar-width:thin;scrollbar-color:#6c5634 transparent}
html body #qhud.q62s::-webkit-scrollbar{width:5px}html body #qhud.q62s::-webkit-scrollbar-thumb{background:#6c5634;border-radius:3px}
@media (max-width:640px){html body #qhud .qh-b.more{display:flex}html body #qhud>.qh-w{display:none}}`;document.head.appendChild(st)}
// PC 판의 가장 큰 높이: 화면 아래까지, 아래 단축칸(#bar)과 옆으로 겹치면 그 위까지
function ui62Max(q){const r=q.getBoundingClientRect();let bot=innerHeight-UI62.pad;const b=document.getElementById('bar');
  if(b){const br=b.getBoundingClientRect();if(br.width>0&&br.left<r.right&&br.right>r.left&&br.top>r.top)bot=Math.min(bot,br.top-UI62.gap)}
  const cs=getComputedStyle(q),ex=cs.boxSizing==='border-box'?0:['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth'].reduce((t,k)=>t+(parseFloat(cs[k])||0),0);// max-height는 안쪽 높이
  return Math.max(UI62.min,Math.round(bot-r.top-ex))}
// 넘치면 굴릴 수 있게 (넘치지 않으면 예전과 같음)
function ui62Q(){const q=document.getElementById('qhud');if(!q)return false;if(q.hidden){q.classList.remove('q62s');return false}
  const ph=typeof M22==='object'&&M22.phone();
  if(!ph){const mh=ui62Max(q);if(q._m62!==mh){q._m62=mh;q.style.maxHeight=mh+'px'}}else if(q._m62){q._m62=0;q.style.maxHeight=''}
  const over=q.scrollHeight>q.clientHeight+2;if(q.classList.contains('q62s')!==over)q.classList.toggle('q62s',over);return over}
{const _q=questHud;questHud=function(){const r=_q.apply(this,arguments);try{ui62Q()}catch(e){if(window.__QA)throw e}return r}}
{const _u=updateHud;updateHud=function(){const r=_u.apply(this,arguments);const now=performance.now();if(now-UI62.t>400){UI62.t=now;try{ui62Q()}catch(e){if(window.__QA)throw e}}return r}}
addEventListener('resize',()=>{UI62.t=0;try{ui62Q()}catch(_){}});
// 휠은 판 안에서만 (게임 화면 휠 단축키로 새지 않게)
setTimeout(()=>{const q=document.getElementById('qhud');if(q&&!q._w62){q._w62=1;q.addEventListener('wheel',e=>{if(q.classList.contains('q62s'))e.stopPropagation()},{passive:true})}},0);
// ☰ 메뉴 · 창 옆 띠의 「캐릭터」 칸
U45IC.char='<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.3 2.5-5.6 5.5-5.6s5.5 2.3 5.5 5.6"/><path d="M16 6.5h5M19.5 4.5l2 2-2 2"/><path d="M21 13.5h-5M17.5 11.5l-2 2 2 2"/>';
U45C.push({k:'char',n:'캐릭터',t:'캐릭터 바꾸기 · 새 캐릭터',btn:'helpBtn',open:()=>u45Vis('#intro')});
U45.cellsSig='';
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{UI62,ui62Q})}catch(_){}},0);
