/* ---------- v44 추가 스킬 단축바 (사용자 2026-10-24 「스킬이 많아지다보니까 스킬 단축바가 모자라. 선택에 따라서 추가할 수 있는 스킬 단축바를 더 추가해줬으면 좋겠어. 단축키 지정은 나중에 하더라도.」) ----------
   · 설정 ⚙ 「추가 단축바」: 없음(처음) · 1줄 · 2줄. 한 줄에 10칸(칸 이름 +1~+10, +11~+20). 캐릭터마다 저장.
   · PC: 원래 단축바 위에 줄이 생긴다. 휴대폰: 원래 칸 다음 차례로 이어진다(가로 휴대폰은 쪽 넘기기에 함께 들어감). 물약은 늘 끝.
   · 넣기: 스킬 트리 아래 칸 줄(끌어 놓기)과 스킬 설명의 「칸에 넣기」에 추가 칸도 나온다. 기본 키는 없고, 단축키 창에서 원하는 키를 넣을 수 있다.
   · 줄을 줄이면 숨긴 줄의 스킬은 지우지 않고 그대로 둔다(다시 켜면 그대로 보임). 숨긴 칸은 키로도 쓰이지 않는다.
   · 저장: 원래 칸 bar(21칸)는 그대로, 추가 칸은 b44 {n:줄 수, s:[20칸]} (켜 두었거나 하나라도 넣었을 때만). 없으면 줄 0 · 빈 칸. */
B44.N=B44.BASE+B44.ROW*B44.ROWS;
const b44Rows=()=>P&&P.b44n>0?Math.min(B44.ROWS,P.b44n|0):0;
const b44Vis=()=>B44.BASE+b44Rows()*B44.ROW;
const b44Ok=id=>typeof id==='string'&&!!SPELLS[id]&&!!P&&SPELLS[id].cls===P.cls&&SPELLS[id].kind!=='passive';
function b44Fix(){if(!P||!Array.isArray(P.bar))return;while(P.bar.length<B44.N)P.bar.push(null);if(P.bar.length>B44.N)P.bar.length=B44.N}
// buildBar(b5.js)가 원래 두 줄 뒤에 붙인다 · 추가 칸을 한 번도 안 쓴 캐릭터는 P.bar가 원래대로 21칸
function b44Html(){const n=b44Rows();if(n)b44Fix();let h='';for(let r=0;r<n;r++){h+=`<div class="barrow b44row" data-b44="${r+1}">`;for(let i=0;i<B44.ROW;i++)h+=slotBtn(B44.BASE+r*B44.ROW+i);h+='</div>'}return h}
{const _fp=freshPlayer;freshPlayer=function(){const p=_fp.apply(this,arguments);try{if(p)p.b44n=0}catch(e){if(window.__QA)throw e}return p}}
{const _ld=load;load=function(d){const x=d&&d.b44,r=_ld.apply(this,arguments);try{if(r&&P){P.b44n=0;
    if(x&&typeof x==='object'&&!Array.isArray(x)){const n=Math.max(0,Math.min(B44.ROWS,x.n|0)),s=Array.isArray(x.s)?x.s.slice(0,B44.ROW*B44.ROWS):[];
      if(n||s.some(b44Ok)){P.b44n=n;b44Fix();for(let i=0;i<B44.ROW*B44.ROWS;i++)P.bar[B44.BASE+i]=b44Ok(s[i])?s[i]:null;buildBar()}}}}catch(e){if(window.__QA)throw e}return r}}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P&&Array.isArray(P.bar)){const ex=P.bar.slice(B44.BASE,B44.N).map(x=>x||null);
    if(Array.isArray(d.bar)&&d.bar.length>B44.BASE)d.bar=d.bar.slice(0,B44.BASE);
    if((P.b44n|0)>0||ex.some(Boolean))d.b44={n:Math.max(0,Math.min(B44.ROWS,P.b44n|0)),s:ex}}}catch(e){if(window.__QA)throw e}return d}}
// 숨긴 줄의 칸은 키로도 쓰지 않는다
{const _cs=castSlot;castSlot=function(i){if(i>=B44.BASE&&i>=b44Vis())return;return _cs.apply(this,arguments)}}
// 스킬 창: 숨긴 줄의 칸은 칸 줄 · 「칸에 넣기」에서 뺀다
{const _rp=renderPanel;renderPanel=function(){const r=_rp.apply(this,arguments);try{const v=b44Vis();
    if(typeof pbody!=='undefined'&&pbody){pbody.querySelectorAll('[data-dock]').forEach(n=>{if(+n.dataset.dock>=v)n.remove()});pbody.querySelectorAll('[data-assign][data-i]').forEach(n=>{if(+n.dataset.i>=v)n.remove()});
      const f=pbody.querySelector(`.dock20 [data-dock="${B44.BASE}"]`);if(f&&!f.previousElementSibling?.classList.contains('dk44'))f.insertAdjacentHTML('beforebegin','<div class="dk44">추가 단축바</div>')}}catch(e){if(window.__QA)throw e}return r}}
// 단축키 창: 추가 칸 이름 · 숨긴 줄은 목록에서 뺀다 · 키가 없는 추가 칸은 칸 이름(+1 …)을 보인다
for(let i=0;i<B44.ROW*B44.ROWS;i++){const a=KB_BY['s'+(B44.BASE+i)];if(a)a.n=`추가 단축바 ${Math.floor(i/B44.ROW)+1}줄 · 칸 [+${i+1}]`}
{const _kr=kbRow;kbRow=function(a){if(a&&a.slot!=null&&a.slot>=B44.BASE&&a.slot>=b44Vis())return '';return _kr.apply(this,arguments)}}
{const _ks=kbSync;kbSync=function(){const r=_ks.apply(this,arguments);try{for(let i=B44.BASE;i<B44.N;i++){const a=KB_BY['s'+i];if(SLOTS[i]&&!(a&&KB.bind[a.id]))SLOTS[i].k='+'+(i-B44.BASE+1)}}catch(e){if(window.__QA)throw e}return r}}
function b44Set(n){if(!P)return;const was=b44Rows();P.b44n=Math.max(0,Math.min(B44.ROWS,n|0));if(P.b44n||P.bar.length>B44.BASE)b44Fix();buildBar();if(typeof panel!=='undefined'&&!panel.hidden)renderPanel();save();
  const hid=P.bar.slice(b44Vis(),B44.N).filter(Boolean).length;
  msg(P.b44n?`추가 단축바 ${P.b44n}줄을 켰습니다 · 스킬 트리 아래 칸 줄에서 +칸으로 끌어 놓으세요`+(hid?` (숨긴 줄의 스킬 ${hid}개는 그대로 남아 있어요)`:''):(was?`추가 단축바를 껐습니다`+(hid?` · 넣어 둔 스킬 ${hid}개는 그대로 남아 있어 다시 켜면 보여요`:''):'추가 단축바를 껐습니다'),'#d6c7a1')}
/* ===== 설정 ⚙: 추가 단축바 ===== */
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);try{const el=SET24.el;if(!el||el.hidden||!P||!P.cls)return;const sep=el.querySelector('.s24sep'),cur=b44Rows();
  const box=document.createElement('div');box.className='m43set b44set';
  box.innerHTML=`<div class="s24h">추가 스킬 단축바</div><div class="s24row">${[[0,'없음'],[1,'1줄'],[2,'2줄']].map(([v,t])=>`<button type="button" class="s24seg${cur===v?' on':''}" data-b44="${v}" aria-pressed="${cur===v}">${t}</button>`).join('')}</div>
    <div class="s24n">한 줄에 10칸이 더 생겨요(칸 이름 +1~+20). 스킬 트리 아래 칸 줄에서 끌어 놓고, 키는 스킬 트리 창의 「단축키 바꾸기」에서 넣을 수 있어요. 줄을 끄면 넣어 둔 스킬은 그대로 남아요. 캐릭터마다 따로 저장돼요</div>`;
  el.insertBefore(box,sep||null);box.querySelectorAll('[data-b44]').forEach(b=>b.onclick=e=>{e.stopPropagation();b44Set(+b.dataset.b44);set24Draw();set24Place()})}catch(e){if(window.__QA)throw e}}}
{const st=document.createElement('style');st.textContent=`
.bar .b44row{order:-1}
body.m22 #hud .bar .b44row .sk{order:1}
body.m22 #hud .bar [data-pot],body.m22 #hud .bar .sep{order:2}
#panel .dock20 .dks[data-dock] b{white-space:nowrap}
#panel .dock20 .dk44{grid-column:1/-1;font-size:11px;color:#a39d8f;margin:3px 0 0}`;document.head.appendChild(st)}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{B44,b44Set,b44Rows,b44Vis,b44Html})}catch(_){}},0);
