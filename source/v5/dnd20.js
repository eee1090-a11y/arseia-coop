/* ---------- v20: 스킬 트리에서 단축칸으로 끌어다 놓기 (사용자 22:39) ----------
   b5.js 바로 앞에 붙는다(b5.js가 IIFE를 닫음). 스킬 창(T)이 열려 있으면 화면 아래 단축칸이 가려지므로, 스킬 창 맨 아래에 단축칸 21개를 똑같이 붙여 둔다(늘 보이게 붙어 있음).
   · 컴퓨터: 스킬을 마우스로 끌어 아래 칸에 놓기. 칸끼리 끌면 서로 바뀌고, 칸에서 창 밖(칸 아닌 곳)으로 끌어 놓으면 그 칸이 빈다.
   · 휴대폰: 스킬을 꾹 누르고(0.3초) 그대로 끌어 칸에 놓기. 그냥 밀면 지금처럼 창이 스크롤된다.
   · 배운 스킬(1점 이상)만, 패시브는 넣을 수 없다. 그냥 누르면 지금처럼 스킬을 고른다(끌다 놓은 뒤의 클릭은 막음). */
const DND={on:false,id:null,from:-1,x:0,y:0,ghost:null,over:-1,timer:0,touch:false,eatClick:false};
function dndOk(id){const s=SPELLS[id];return !!(s&&s.cls===P.cls&&s.kind!=='passive'&&skLv(id)>0)}
// 놓기: to = 단축칸 번호(없으면 -1). from = 끌어 온 칸(스킬 트리에서 왔으면 -1)
function dndDrop(id,from,to){
  if(to>=0&&to<SLOTS.length){
    if(from>=0){if(from===to)return false;const a=P.bar[from];P.bar[from]=P.bar[to];P.bar[to]=a;msg(`[${SLOTS[from].k}] ↔ [${SLOTS[to].k}]`,'#d6c7a1')}
    else{if(!dndOk(id))return false;bindId=id;bindTo(to);return true}
  }else if(from>=0&&P.bar[from]){msg(`[${SLOTS[from].k}] 칸을 비웠습니다`,'#a39d8f');P.bar[from]=null}
  else return false;
  buildBar();if(!panel.hidden)renderPanel();save();return true}
function dockHtml(){let h='<div class="dock20"><div class="dk-t">스킬을 끌어 아래 칸에 놓으세요<span class="dk-m"> · 휴대폰은 꾹 누른 채 끌기</span> · 칸끼리 끌면 서로 바뀌고, 칸을 밖으로 끌면 비웁니다</div><div class="dk-g">';
  SLOTS.forEach((sl,i)=>{const id=P.bar[i],s=id&&SPELLS[id];h+=`<div class="dks${s?'':' empty'}" data-dock="${i}" title="${sl.k} 칸${s?' · '+s.n:''}">${s?spellSvg(s):''}<b>${sl.k}</b></div>`});
  return h+'</div></div>'}
{const _rp=renderPanel;renderPanel=function(){_rp.apply(this,arguments);if(tab==='tree'&&P)pbody.insertAdjacentHTML('beforeend',dockHtml())}}
setTimeout(()=>{const st=document.createElement('style');st.textContent=`
#panel .dock20{position:sticky;bottom:-16px;z-index:3;margin:10px -4px -6px;padding:6px 6px 8px;background:rgba(18,15,12,.97);border-top:1px solid #6a5634;box-shadow:0 -6px 12px rgba(0,0,0,.45),0 24px 0 rgba(18,15,12,.97)}
#panel .dock20 .dk-t{font-size:11px;color:#a39d8f;margin:0 0 5px;line-height:1.35}
#panel .dock20 .dk-g{display:grid;grid-template-columns:repeat(11,1fr);gap:3px}
#panel .dock20 .dks{position:relative;aspect-ratio:1;max-height:44px;border:1px solid #4a3d2a;border-radius:5px;background:#16120e;display:grid;place-items:center;touch-action:none;cursor:grab;overflow:hidden}
#panel .dock20 .dks svg{width:84%;height:84%;pointer-events:none}
#panel .dock20 .dks.empty{cursor:default;background:#100d0a}
#panel .dock20 .dks b{position:absolute;left:2px;bottom:0;font-size:9px;color:#d6c7a1;text-shadow:0 0 2px #000,0 0 2px #000;pointer-events:none}
#panel .dock20 .dks.over{border-color:#ffd76a;box-shadow:0 0 0 2px rgba(255,215,106,.55) inset}
#bar button{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}
#panel .node,#panel .j2row{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}
.dnd20g{position:fixed;z-index:50;width:46px;height:46px;margin:-23px 0 0 -23px;pointer-events:none;border:1px solid #ffd76a;border-radius:6px;background:rgba(22,18,14,.9);display:grid;place-items:center;opacity:.92}
.dnd20g svg{width:40px;height:40px}
body.dnd20 *{cursor:grabbing!important}
@media (max-width:600px){#panel .dock20 .dk-g{gap:2px}#panel .dock20{bottom:-12px;padding:5px 4px 6px}#panel .dock20 .dks b{font-size:8px}}
@media (min-width:601px){#panel .dock20 .dk-m{display:none}}`;document.head.appendChild(st)},0);
function dndSlotAt(x,y){const el=document.elementFromPoint(x,y),d=el&&el.closest&&el.closest('[data-dock]');return d?+d.dataset.dock:-1}
function dndStart(){const id=DND.id,s=SPELLS[id];if(!s)return dndReset();
  if(DND.from<0&&!dndOk(id)){msg(s.kind==='passive'?`${s.n}: 패시브는 단축칸에 넣지 않아도 늘 켜져 있습니다`:`${s.n}: 먼저 1점을 찍어야 단축칸에 넣을 수 있습니다`,'#a39d8f');DND.eatClick=true;return dndReset()}
  DND.on=true;DND.eatClick=true;const g=document.createElement('div');g.className='dnd20g';g.innerHTML=spellSvg(s);document.body.appendChild(g);DND.ghost=g;document.body.classList.add('dnd20');dndMove(DND.x,DND.y)}
function dndMove(x,y){DND.x=x;DND.y=y;if(!DND.on)return;DND.ghost.style.left=x+'px';DND.ghost.style.top=y+'px';
  const i=dndSlotAt(x,y);if(i!==DND.over){pbody.querySelectorAll('.dks.over').forEach(e=>e.classList.remove('over'));if(i>=0){const e=pbody.querySelector(`[data-dock="${i}"]`);if(e)e.classList.add('over')}DND.over=i}}
function dndEnd(x,y){const was=DND.on,id=DND.id,from=DND.from;if(was){setTimeout(()=>{DND.eatClick=false},400);DND.ghost&&DND.ghost.remove();document.body.classList.remove('dnd20');dndDrop(id,from,dndSlotAt(x,y))}dndReset();return was}
function dndReset(){clearTimeout(DND.timer);DND.on=false;DND.id=null;DND.from=-1;DND.over=-1;DND.ghost=null;DND.touch=false}
function dndSrc(t){const n=t.closest&&t.closest('[data-node],[data-dock]');if(!n||!pbody.contains(n))return null;
  if(n.dataset.dock!=null){const i=+n.dataset.dock;return P.bar[i]?{id:P.bar[i],from:i}:null}return{id:n.dataset.node,from:-1}}
// b5.js(pbody·panel·tab)보다 앞에 붙으므로 이벤트는 다 읽힌 뒤에 단다
setTimeout(()=>{
// 마우스·펜: 6px 넘게 움직이면 끌기 시작
pbody.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0||tab!=='tree')return;const s=dndSrc(e.target);if(!s)return;
  dndReset();DND.id=s.id;DND.from=s.from;DND.sx=e.clientX;DND.sy=e.clientY;DND.x=e.clientX;DND.y=e.clientY;DND.eatClick=false;
  if(s.from>=0)e.preventDefault()});
addEventListener('pointermove',e=>{if(e.pointerType==='touch'||!DND.id)return;if(!DND.on&&Math.hypot(e.clientX-DND.sx,e.clientY-DND.sy)>6)dndStart();dndMove(e.clientX,e.clientY)});
addEventListener('pointerup',e=>{if(e.pointerType==='touch'||!DND.id)return;dndEnd(e.clientX,e.clientY)});
// 터치: 꾹 누르면(0.3초) 끌기. 그 전에 10px 넘게 움직이면 그냥 스크롤
pbody.addEventListener('touchstart',e=>{if(tab!=='tree'||e.touches.length!==1)return;const s=dndSrc(e.target);if(!s){dndReset();return}const t=e.touches[0];
  dndReset();DND.id=s.id;DND.from=s.from;DND.touch=true;DND.sx=DND.x=t.clientX;DND.sy=DND.y=t.clientY;DND.eatClick=false;
  DND.timer=setTimeout(()=>{if(DND.id&&DND.touch)dndStart()},s.from>=0?120:300)},{passive:true});
addEventListener('touchmove',e=>{if(!DND.touch||!DND.id)return;const t=e.touches[0];
  if(!DND.on){if(Math.hypot(t.clientX-DND.sx,t.clientY-DND.sy)>10)dndReset();return}
  e.preventDefault();dndMove(t.clientX,t.clientY)},{passive:false});
addEventListener('touchend',e=>{if(!DND.touch||!DND.id)return;if(DND.on){e.preventDefault();const t=e.changedTouches[0];dndEnd(t.clientX,t.clientY)}else dndReset()},{passive:false});
addEventListener('touchcancel',()=>{if(DND.on){DND.ghost&&DND.ghost.remove();document.body.classList.remove('dnd20')}dndReset()});
// 끌어 놓은 뒤 따라오는 클릭은 먹는다 (스킬 고르기·칸 누르기가 같이 일어나지 않게)
pbody.addEventListener('click',e=>{if(DND.eatClick){DND.eatClick=false;e.stopImmediatePropagation();e.preventDefault()}},true);
pbody.addEventListener('contextmenu',e=>{if(DND.touch||DND.on)e.preventDefault()});
pbody.addEventListener('dragstart',e=>{if(e.target.closest&&e.target.closest('[data-node],[data-dock]'))e.preventDefault()});
},0);
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{DND,dndDrop,dndOk,dockHtml})}catch(_){}},0);
