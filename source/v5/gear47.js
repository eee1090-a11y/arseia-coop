/* ---------- v47 단축바 톱니바퀴 (휴대폰으로 주로 하는 플레이어 의견, 사용자 2026-10-25 05:55Z 전달)
   「단축키옆에 톱니바퀴 작게 만들어서 그자리에서 원하는 키 누르고 바로 스킬 선택하게하면 좋을거같아..」 ----------
   · 단축바 끝(물약 앞)에 작은 ⚙ 단추. 누르면 「칸 바꾸기」가 켜져 빈 칸까지 모든 칸이 보이고 ⚙가 ✓로 바뀐다.
   · 칸 바꾸기 중 칸을 누르면(PC는 그 칸의 키를 눌러도) 그 자리에 「스킬 고르기」 창: 배운 스킬(패시브 빼고)을 계열별로 보여 주고,
     누르면 그 칸에 들어간다(다른 칸에 있던 스킬이면 두 칸이 자리를 바꿈). 「이 칸 비우기」 · 「닫기」.
   · 고른 뒤에도 칸 바꾸기는 켜진 채라 다른 칸도 바로 바꿀 수 있다. ✓ · Esc · 뒤로 · 스킬 창 닫기로 끝.
   · 방식: 칸 바꾸기 동안 bindId에 G47.TOK를 넣는다. 그래서 칸을 누르거나 키를 누르면 원래 길(barPress · 키 · 휠 → bindTo)로 와서
     bindTo가 칸 번호를 받으면 이 파일이 넣는 대신 고르기 창을 연다. bindId가 차 있으면 빈 칸이 보이고(mobile22 m22all),
     겨누기 · 꾹 누르기 시전 · 설명 쪽지(mux45 · ux45b)도 원래대로 쉰다.
   · 칸을 누른 손가락을 뗄 때 오는 click이 막 열린 창의 스킬을 누르지 않게, 연 뒤 0.4초 동안의 click은 흘려보낸다.
   · 고르기 창이 열린 동안은 스킬 창처럼 게임이 멈추고, 닫으면 열기 전 상태로 돌아간다.
   · 저장: 새 저장 칸 없음(P.bar · 추가 칸 b44 그대로). 캐릭터 키를 지우거나 비우지 않는다.
   붙는 곳: mux43 · ux45a · bar44 · side26 다음, b5.js 앞 (b5.js의 let bindId · panel은 함수 안에서만 쓴다). */
const G47={TOK:'__g47',el:null,slot:-1,wasP:false,GW:31,t:0,GHOST:400};
const g47On=()=>bindId===G47.TOK;
function g47Toggle(on){if(on==null)on=!g47On();if(!P||!P.cls)return;g47Close();
  if(on){bindId=G47.TOK;msg('칸 바꾸기: 바꿀 칸을 누르세요 · 다 했으면 ✓','#d6c7a1')}else if(g47On())bindId=null;
  if(typeof panel!=='undefined'&&!panel.hidden)renderPanel();buildBar()}
// 고를 수 있는 스킬: 이 직업 · 배움 · 패시브 아님 (끌어 놓기와 같은 기준)
function g47List(){if(!P)return[];const ok=typeof dndOk==='function'?dndOk:(id=>{const s=SPELLS[id];return !!(s&&s.cls===P.cls&&s.kind!=='passive'&&skLv(id)>0)});
  return Object.keys(SPELLS).filter(id=>{try{return ok(id)}catch(_){return false}})}
function g47Groups(){const L=g47List(),cat=typeof s26Cat==='function'?s26Cat:(()=>'etc'),order=typeof s26Cats==='function'?s26Cats():[],m=new Map();
  for(const k of order)m.set(k,[]);for(const id of L){const k=cat(id)||'etc';if(!m.has(k))m.set(k,[]);m.get(k).push(id)}
  return [...m].filter(([,a])=>a.length)}
const g47Key=i=>SLOTS[i]?SLOTS[i].k:'';
const g47KeyShow=()=>!(typeof M22==='object'&&M22.mode());
function g47Open(i){if(!P||!P.bar||i<0||i>=SLOTS.length)return;g47Close();G47.slot=i;G47.wasP=paused;paused=true;
  const cur=P.bar[i],cs=cur&&SPELLS[cur],box=document.createElement('div');box.id='g47pick';box.setAttribute('role','dialog');
  const where=g47KeyShow()?`[${g47Key(i)}] 칸`:'이 칸',gs=g47Groups();
  let h=`<div class="g47h"><b>${where}에 넣을 스킬</b><span>${cs?`지금: ${cs.n}`:'지금: 빈 칸'}</span></div><div class="g47body">`;
  if(!gs.length)h+='<p class="g47none">아직 넣을 수 있는 스킬이 없어요. 스킬 트리(T)에서 1점을 먼저 찍어 주세요</p>';
  for(const [k,a] of gs){h+=`<div class="g47g">${typeof s26Name==='function'?s26Name(k):k}</div><div class="g47row">`;
    for(const id of a){const s=SPELLS[id],at=P.bar.indexOf(id),me=at===i;
      h+=`<button type="button" class="g47sk${me?' on':''}" data-g47="${id}">${spellSvg(s)}<span class="g47n">${s.n}</span><span class="g47l">Lv${skLv(id)}${me?' · 이 칸':at>=0?' · 다른 칸':''}</span></button>`}
    h+='</div>'}
  h+=`</div><div class="g47foot"><button type="button" data-g47c="clear"${cur?'':' disabled'}>이 칸 비우기</button><button type="button" data-g47c="close">닫기</button></div>`;
  box.innerHTML=h;document.body.appendChild(box);G47.el=box;G47.t=performance.now();
  box.addEventListener('pointerdown',e=>e.stopPropagation());
  // 칸을 누른 손가락이 떨어질 때 따라오는 click(창이 손가락 밑에 막 열림)은 흘려보낸다
  box.addEventListener('click',e=>{e.stopPropagation();if(performance.now()-G47.t<G47.GHOST)return;const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.g47)g47Put(G47.slot,b.dataset.g47);else if(b.dataset.g47c==='clear')g47Put(G47.slot,null);else g47Close()})}
function g47Close(){if(!G47.el)return;G47.el.remove();G47.el=null;G47.slot=-1;paused=G47.wasP}
// 넣기: 원래 bindTo(자리 바꾸기 · 알림 · 저장)를 그대로 쓰고 칸 바꾸기는 켠 채로
function g47Put(i,id){g47Close();if(!P||i<0)return;
  if(id){if(!SPELLS[id])return;bindId=id;_g47bt(i)}else{const s=P.bar[i]&&SPELLS[P.bar[i]];P.bar[i]=null;if(s)msg(`${s.n}: 칸에서 뺐어요`,'#a39d8f');save()}
  bindId=G47.TOK;buildBar();if(typeof panel!=='undefined'&&!panel.hidden)renderPanel()}
const _g47bt=bindTo;
bindTo=function(i){if(bindId===G47.TOK){if(i!=null&&i>=0)g47Open(+i);return}return _g47bt.apply(this,arguments)};
// 단축바에 ⚙ 단추 (물약 앞) · 칸 바꾸기 중이면 ✓
function g47Btn(){const bar=document.getElementById('bar');if(!bar||!P||!P.cls)return;let b=document.getElementById('g47btn');
  if(!b||!bar.contains(b)){if(b)b.remove();b=document.createElement('button');b.type='button';b.id='g47btn';const sep=bar.querySelector('.sep');(sep?sep.parentNode:bar).insertBefore(b,sep||null)}
  const on=g47On(),t=on?'칸 바꾸기 끝':'칸 바꾸기: 칸을 누르고 넣을 스킬 고르기';b.classList.toggle('on',on);b.textContent=on?'✓':'⚙';b.title=t;b.setAttribute('aria-label',t);b.setAttribute('aria-pressed',on)}
{const _bb=buildBar;buildBar=function(){const r=_bb.apply(this,arguments);try{g47Btn();if(!g47On()&&G47.el)g47Close()}catch(e){if(window.__QA)throw e}return r}}
{const _bp=barPress;barPress=function(b){if(b&&b.id==='g47btn'){g47Toggle();return}return _bp.apply(this,arguments)}}
// 가로 휴대폰 쪽 넘기기: ⚙ 자리만큼 한 쪽 칸 수를 줄인다 (mux43 m43Per와 같은 셈 + ⚙)
if(typeof m43Per==='function'){const _mp=m43Per;m43Per=function(bar){const w=bar&&bar.parentNode&&bar.parentNode.clientWidth,g=document.getElementById('g47btn');
  if(!w||!g||!bar.contains(g))return _mp.apply(this,arguments);const pots=[...bar.querySelectorAll('[data-pot]')].filter(b=>getComputedStyle(b).display!=='none').length;
  return Math.max(3,Math.min(M43.PER,Math.floor((w-10-43-G47.GW-pots*47+3)/47)))}}
// 뒤로(휴대폰): 고르기 창을 먼저 닫는다
if(typeof U45W!=='undefined'&&Array.isArray(U45W))U45W.unshift(['g47',()=>!!G47.el,()=>g47Close()]);
// Esc: 고르기 창만 닫는다(한 번 더 누르면 b5.js가 칸 바꾸기를 끝냄)
addEventListener('keydown',e=>{if(e.code==='Escape'&&G47.el){e.stopImmediatePropagation();e.preventDefault();g47Close()}},true);
// 캐릭터를 바꾸거나 새로 하면 끝
{const _ld=load;load=function(){g47Close();if(g47On())bindId=null;return _ld.apply(this,arguments)}}
{const st=document.createElement('style');st.textContent=`
#hud .bar #g47btn{display:inline-flex;align-items:center;justify-content:center;width:28px;flex:0 0 28px;align-self:stretch;min-height:36px;padding:0;margin:0;border:1px solid #6a5838;border-radius:4px;background:linear-gradient(180deg,#2c2418,#15110b);color:#d6b262;font:700 16px/1 sans-serif;cursor:pointer;pointer-events:auto;opacity:.85}
#hud .bar #g47btn.on{color:#1a150e;background:linear-gradient(180deg,#ffe39a,#d6a640);border-color:#ffe39a;opacity:1}
#hud .bar .sk.binding{outline:1px dashed #d6b26299;outline-offset:-3px}
#hud .bar .sk.binding.empty::after{content:'+';position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font:700 18px/1 sans-serif;color:#d6b26288}
#g47pick{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:60;width:min(560px,calc(100vw - 24px));max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);display:flex;flex-direction:column;background:#17130d;border:1px solid #8a7346;border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.7);color:#e8dcc2;font-size:14px}
#g47pick .g47h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:10px 12px 6px;border-bottom:1px solid #3a3024}
#g47pick .g47h b{color:#ffe2a0;font-size:15px}#g47pick .g47h span{color:#a39d8f;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#g47pick .g47body{overflow-y:auto;padding:4px 10px 8px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
#g47pick .g47g{color:#d6b262;font-size:12px;margin:8px 0 4px}
#g47pick .g47row{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px}
#g47pick .g47sk{display:grid;grid-template-columns:34px 1fr;grid-template-rows:auto auto;column-gap:7px;align-items:center;text-align:left;min-height:44px;padding:4px 6px;border:1px solid #4a3d2c;border-radius:5px;background:#211b13;color:#e8dcc2;cursor:pointer}
#g47pick .g47sk svg{grid-row:1/3;width:34px;height:34px}#g47pick .g47sk.on{border-color:#ffe39a;background:#3a2e1c}
#g47pick .g47n{font-size:13px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#g47pick .g47l{font-size:11px;color:#a39d8f}
#g47pick .g47none{color:#a39d8f;margin:12px 2px}
#g47pick .g47foot{display:flex;gap:6px;padding:8px 10px;border-top:1px solid #3a3024}
#g47pick .g47foot button{flex:1 1 0;min-height:40px;border:1px solid #5a4a36;border-radius:5px;background:#1e1a14;color:#cfc6b2;font-size:14px;cursor:pointer}
#g47pick .g47foot button:disabled{opacity:.4;cursor:default}`;document.head.appendChild(st)}
setTimeout(()=>{if(window.__game)Object.assign(window.__game,{G47,g47On,g47Toggle,g47Open,g47Close,g47Put,g47List,g47Groups})},0);
