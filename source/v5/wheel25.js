/* ---------- v25 마우스 휠을 단축키로 (사용자 2026-10-10 09:08 「스킬 단축키에 마우스 위로휠과 아래로휠도 선택해서 쓸 수 있게」) ----------
   · 「단축키」 창(keys.js)에서 칸을 누른 뒤 휠을 위나 아래로 한 칸 굴리면 그 칸의 키가 「휠 ↑」 / 「휠 ↓」가 된다.
     Shift · Alt · Ctrl과 같이 굴려도 된다(⇧휠 ↑ …). 물약 · 창 열기 같은 다른 동작에도 넣을 수 있다.
   · 게임 화면(캔버스) 위에서 휠 한 칸 = 그 칸의 마법 한 번. 트랙패드처럼 잘게 오는 휠은 모아서 한 칸(세로 40)으로 치고, 0.12초에 한 번까지.
   · 창(스킬 트리 · 가방 · 상점 · 대화 · 설정 · 단축키 창)이 열려 있거나 화면 글상자 위에서 굴리면 시전하지 않는다(그 창만 스크롤).
   · 휠에 넣은 칸이 없으면 예전처럼 아무 일도 없다(화면 확대는 잠겨 있어 휠을 쓰지 않음).
   · 저장: 예전과 같은 keys 필드에 'WheelUp' · 'S+WheelDown' 같은 글자로. 없으면 기본 배치(휠 안 씀). 휴대폰은 휠이 없어 그대로. */
const WHEEL25={acc:0,last:0,STEP:40,GAP:120,lastDir:0};
{const _kn=kbKeyName;kbKeyName=function(code){return code==='WheelUp'?'휠 ↑':code==='WheelDown'?'휠 ↓':_kn.apply(this,arguments)}}
const wheel25Combo=(e,dir)=>{const m=(e.ctrlKey?'C':'')+(e.altKey?'A':'')+(e.shiftKey?'S':'');const c=dir<0?'WheelUp':'WheelDown';return m?m+'+'+c:c};
// 한 칸으로 칠 만큼 굴렸나 (줄 단위 휠은 바로 한 칸)
function wheel25Notch(e){const dy=e.deltaMode===1?e.deltaY*WHEEL25.STEP:e.deltaMode===2?e.deltaY*WHEEL25.STEP*10:e.deltaY;if(!dy)return 0;
  const dir=Math.sign(dy);if(dir!==WHEEL25.lastDir){WHEEL25.acc=0;WHEEL25.lastDir=dir}WHEEL25.acc+=Math.abs(dy);
  if(WHEEL25.acc<WHEEL25.STEP*.95)return 0;WHEEL25.acc=0;return dir}
const wheel25UiOpen=()=>!!((typeof kbIsOpen==='function'&&kbIsOpen())||(typeof panel!=='undefined'&&!panel.hidden)||($('#intro')&&!$('#intro').hidden)||($('#death')&&!$('#death').hidden)||document.querySelector('#set24:not([hidden]),#gfxPanel:not([hidden]),#auPanel:not([hidden]),#patch:not([hidden])'));
addEventListener('wheel',e=>{
  // 단축키 창에서 칸을 고른 상태: 휠을 그 칸의 키로
  if(typeof kbIsOpen==='function'&&kbIsOpen()&&KB.cap){const dir=wheel25Notch(e);e.preventDefault();e.stopImmediatePropagation();if(!dir)return;
    kbCapture({code:dir<0?'WheelUp':'WheelDown',ctrlKey:e.ctrlKey,altKey:e.altKey,shiftKey:e.shiftKey,metaKey:e.metaKey,preventDefault(){},stopImmediatePropagation(){}});return}
  if(!P||e.target!==cv||wheel25UiOpen())return;if(KB.p!==P)kbSync();
  const up=wheel25Combo(e,-1),dn=wheel25Combo(e,1),bare=['WheelUp','WheelDown'];
  if(!(KB.map[up]||KB.map[dn]||((e.shiftKey||e.altKey)&&!e.ctrlKey&&(KB.map[bare[0]]||KB.map[bare[1]]))))return;// 이 조합의 휠에 넣은 것이 없으면 건드리지 않음(페이지 · 다른 처리 그대로)
  e.preventDefault();const dir=wheel25Notch(e);if(!dir)return;const now=performance.now();if(now-WHEEL25.last<WHEEL25.GAP)return;
  const combo=wheel25Combo(e,dir);let a=KB.map[combo];if(!a&&(e.shiftKey||e.altKey)&&!e.ctrlKey)a=KB.map[dir<0?'WheelUp':'WheelDown'];if(!a)return;WHEEL25.last=now;
  if(a.slot!=null){if(bindId){bindTo(a.slot);return}if(a.slot>=2&&typeof kbPickOn==='function'&&kbPickOn()){bindId=KB.picked;bindTo(a.slot);return}castSlot(a.slot);return}
  kbFire(a.def)},{passive:false,capture:true});
// 단축키 창 안내 글에 휠도 적는다
{const _kr=kbRender;kbRender=function(){const r=_kr.apply(this,arguments);try{const p=KB.win&&KB.win.querySelector('.card > p.muted');if(p&&!p.dataset.w25){p.dataset.w25=1;p.insertAdjacentHTML('beforeend',' 마우스 <b>휠 위 · 휠 아래</b>도 고를 수 있습니다(칸을 누른 뒤 휠을 한 칸 굴리세요 · 게임 화면에서 한 칸 굴릴 때마다 한 번 씁니다).')}
  const n=KB.win&&KB.win.querySelector('.kbnote');if(n&&KB.cap&&!KB.note)n.textContent='바꿀 키를 누르거나 마우스 휠을 한 칸 굴리세요. Shift · Alt · Ctrl과 함께 눌러도 됩니다. Esc: 취소'}catch(_){}return r}}
window.__wheel25={WHEEL25,wheel25Notch,wheel25Combo};
