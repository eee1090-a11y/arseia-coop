/* ---------- v17: 시전 시간 · 채널링 ----------
   대부분의 마법(높은 위계 포함)은 그대로 즉시 시전. 아래 표에 있는 마법만 다르게 쓴다. 표에 없는 id(새 마법)는 즉시 시전.
   · CAST_T: 시전 시간(초). 키를 누르면 주문을 외우고(마법진·자세·시전 막대), 다 외우면 그때 마나·재사용이 들고 마법이 나간다.
     움직이거나 다른 마법을 쓰면 끊기고 마나는 들지 않는다. 맞아도 끊기지 않는다.
   · CHAN: 채널링. 누르고 있는 동안(또는 정해진 시간이 끝날 때까지) 틱마다 마나를 조금씩 쓰며 이어진다. 손을 떼거나 움직이면 멈춘다.
     재사용 대기는 시작할 때 걸린다. 다 채우면 피해·마나 합계가 예전 한 번 시전과 같다(초당 피해 그대로).
       mode 'tick': 틱마다 원래 마법을 한 번 더 쓰되 피해를 1/N로 나눈다(빔). ov가 있으면 틱마다 그 값으로 바꿔 쓴다(미사일 1발씩, 피해 그대로).
       mode 'keep': 시작할 때 지대/비를 한 번 깔고, 채널링이 끊기면 그 지대/비도 사라진다.
   CAST_MOD(b3.js)·netCast의 c:1·'cst'/'chs' 메시지(net.js)·castDraw(b4.js)와 함께 쓴다. */
const CAST_T={
  // 마법사: 하늘에서 불러 내리는 큰 범위 · 크게 모으는 한 방
  meteor:1,skyfire:1.2,sunfall:1.5,pyroblast:1.2,raisemountain:1,
  // 사제: 큰 기도 · 의식
  judgment:.8,magnus:1.2,greaterheal:.6,salvation:1,resurrection:1.5,returnmiracle:1};
const CHAN={
  arcanemissiles:{mode:'tick',dur:1,ov:{cnt:1}},// 1초 동안 미사일을 한 발씩
  sunflame:{mode:'tick',dur:1.5,iv:.25},// 햇불 빔
  radiance:{mode:'tick',dur:1.5,iv:.25},// 광휘 빔 (사제)
  blizzard:{mode:'keep'},stormgust:{mode:'keep'},lordvermilion:{mode:'keep'},
  wrath:{mode:'keep'},divinehymn:{mode:'keep'}};
const castTimeOf=id=>{const s=SPELLS[id];if(!s||!CAST_T[id])return 0;if(s.kind==='rez'&&!NET.on)return 0;return CAST_T[id]};
const chanOf=id=>SPELLS[id]&&CHAN[id]&&!CAST_T[id]?CHAN[id]:null;
// v18: 채널링 표에 move:1(또는 walk:속도 배수)이 있으면 걸으면서 이어갈 수 있다 (walk:.5 → 절반 속도). 없으면 예전처럼 움직이면 끊김
const chanMove=id=>{const c=chanOf(id);return c&&(c.move||c.walk)?(+c.walk>0?+c.walk:1):0};
// 채널링 한 번의 틱 수·간격·지속
function chanPlan(id,L){const c=chanOf(id);if(!c)return null;const s=eff(id,Math.max(1,L));
  if(c.mode==='keep'){const dur=s.dur||3,N=Math.max(1,Math.ceil(dur/.5));return{c,s,dur,N,iv:dur/N,mul:1,share:1,ov:null}}
  if(c.ov&&c.ov.cnt){const N=Math.max(1,s.cnt||1);return{c,s,dur:c.dur,N,iv:c.dur/N,mul:1,share:1/N,ov:c.ov}}
  const N=Math.max(1,Math.round(c.dur/(c.iv||.25)));return{c,s,dur:c.dur,N,iv:c.dur/N,mul:1/N,share:1/N,ov:c.ov||null}}
// 툴팁 · 스킬 창 한 줄
function castInfo(id,L){const ct=castTimeOf(id)||CAST_T[id];if(ct)return `시전 ${ct}초`;
  const p=chanPlan(id,L||skLv(id)||1);if(p)return `채널링 ${Math.round(p.dur*10)/10}초 (누르고 있는 동안)`;return ''}
const castGhostMod=sp=>{const c=CHAN[sp];return{free:1,tick:1,ov:c&&c.mode==='tick'?c.ov:null}};

const CAST={cur:null,ch:null,p:null,barHold:null,rem:new Map(),slot:0};
const castOn=()=>!!(CAST.cur||CAST.ch);
function castReady(id,ch){if(P.dead||paused)return false;const s=SPELLS[id];if(!s||s.cls!==P.cls||s.kind==='passive')return false;const L=skLv(id);if(L<=0)return false;
  if((P.cd[id]||0)>0)return false;const c=costOf(id);return P.mp>=(ch?c/chanPlan(id,L).N:c)}
function castStop(why){const k=CAST.cur||CAST.ch;if(!k)return;const s=SPELLS[k.id];
  if(CAST.ch){for(const o of CAST.ch.objs)o.t=0}
  CAST.cur=null;CAST.ch=null;if(NET.on)netSend({t:'chs',sp:k.id});
  if(why==='move'&&s)msg(`움직여서 ${s.n}이(가) 끊겼습니다`,'#a39d8f');
  else if(why==='mana'&&s)msg(`마나가 다해 ${s.n} 채널링이 멈췄습니다`,'#8fb0ff');
  castBarSet(null)}
function castReset(){CAST.cur=null;CAST.ch=null;CAST.barHold=null;CAST.rem.clear();CAST.p=P;castBarSet(null)}
function castPose(h,el){heroCast(h,el);const a=HANIM.get(h);if(a)a.castT=time-.15}
let castOrig=null;
{const _try=tryCast;castOrig=_try;
tryCast=function(id,target){
  if(GHOST||CAST_MOD)return _try(id,target);
  if(CAST.p!==P)castReset();
  const ch=CAST.ch,cu=CAST.cur;
  if(ch&&ch.id===id){ch.hold=time;if(target)ch.tg=target;return}
  if(cu&&cu.id===id){if(target)cu.tg=target;return}
  const ct=castTimeOf(id),cp=chanOf(id);
  if(!ct&&!cp){if(castOn()&&castReady(id))castStop('other');return _try(id,target)}
  if(!castReady(id,!!cp))return _try(id,target);// 배우지 않음·재사용·마나 부족: 원래 길로 (알림도 거기서)
  if(P.moving&&!(cp&&chanMove(id))){if(P.noMpT<=0){msg(`${SPELLS[id].n}: 멈춰 서야 ${ct?'외울':'이어갈'} 수 있습니다`,'#a39d8f');P.noMpT=1.2}return}
  castStop('other');const s=SPELLS[id],L=skLv(id);
  if(target&&AIMED.has(s.kind)&&!s.self)P.face=Math.atan2(target.y-P.y,target.x-P.x);
  if(ct){CAST.cur={id,t:0,max:ct,tg:target||null,el:s.el};castPose(P,s.el);
    if(NET.on)netSend({t:'cst',sp:id,d:ct});castBarSet(CAST.cur);return}
  const p=chanPlan(id,L);
  CAST.ch={id,L,t:0,k:0,N:p.N,iv:p.iv,dur:p.dur,tc:c21ChCost(id,p.N)/* v21 잔물결: 냉기 채널링 마나 추가 −20% */,mode:p.c.mode,mul:p.mul,share:p.share,ov:p.ov,tg:target||null,hold:time,sticky:!CAST.slot,objs:[],el:s.el,walk:chanMove(id)};
  P.cd[id]=cdOf(id);core21OnCast(id);castFx(eff(id,L));if(NET.on)netSend({t:'cst',sp:id,d:p.dur,ch:1});
  chanTick();castBarSet(CAST.ch)}}
// 채널링 한 틱: 마나를 쓰고, tick이면 마법을 1/N로 한 번, keep이면 처음에만 깐다
function chanTick(){const ch=CAST.ch;if(!ch)return;
  if(P.mp<ch.tc-1e-6){castStop('mana');return}
  P.mp=Math.max(0,P.mp-ch.tc);
  if(ch.mode==='keep'&&ch.k>0){ch.k++;return}
  const nF=fields.length,nR=rains.length,sh=shake;
  CAST_MOD={free:1,tick:ch.mode==='tick'?1:0,mul:ch.mul,share:ch.share,ov:ch.ov};
  try{tryCast(ch.id,ch.tg||undefined)}finally{CAST_MOD=null}
  if(ch.mode==='keep'){for(let i=nF;i<fields.length;i++)ch.objs.push(fields[i]);for(let i=nR;i<rains.length;i++)ch.objs.push(rains[i])}
  else shake=Math.min(shake,Math.max(sh,2.5));
  ch.k++}
function castTick(dt){
  if(CAST.p!==P)castReset();
  if(CAST.barHold!=null&&!paused){const id=P.bar[CAST.barHold];if(id&&chanOf(id))castSlot(CAST.barHold)}
  const cu=CAST.cur,ch=CAST.ch;
  if(cu){if(P.dead){castStop();return}
    if(P.moving){castStop('move');return}
    cu.t+=dt;castPose(P,cu.el);
    if(cu.t>=cu.max){CAST.cur=null;castBarSet(null);_castRelease(cu)}else castBarSet(cu)}
  else if(ch){if(P.dead){castStop();return}
    if(P.moving&&!ch.walk){castStop('move');return}
    if(!ch.sticky&&time-ch.hold>.02){castStop('release');return}
    ch.t+=dt;castPose(P,ch.el);
    while(CAST.ch===ch&&ch.k<ch.N&&ch.k*ch.iv<=ch.t+1e-6)chanTick();
    if(CAST.ch===ch&&ch.t>=ch.dur-1e-6){CAST.ch=null;castBarSet(null);if(NET.on)netSend({t:'chs',sp:ch.id})}
    else if(CAST.ch===ch)castBarSet(ch)}
  for(const [rid,o] of CAST.rem){o.t+=dt;const r=NET.peers.get(rid);if(!r||r.dead||o.t>o.max+.3){CAST.rem.delete(rid);continue}castPose(r,o.el)}}
// 손으로 누른 입력(키·마우스·터치·단축칸)은 castSlot을 거친다: 그때만 '누르고 있는 동안'으로 따지고,
// 코드에서 바로 부른 tryCast(점검·도구)는 손 입력이 없으니 채널링을 정해진 시간 끝까지 이어간다
{const _cs=castSlot;castSlot=function(i,target){CAST.slot=1;try{_cs(i,target)}finally{CAST.slot=0}}}
// 다 외웠을 때: 원래 tryCast로 — 이때 마나·재사용이 들고, 같이 하기에는 이때 'cast'가 간다
function _castRelease(cu){castOrig(cu.id,cu.tg||undefined)}
{const _u=update;update=function(dt){_u(dt);castTick(dt)}}

/* 같이 하기: 동료의 시전·채널링 표시와 끝내기 */
function castNetMsg(m){const r=NET.peers.get(m.from);if(!r)return;const s0=SPELLS[m.sp];
  if(m.t==='cst'){if(!s0)return;CAST.rem.set(m.from,{sp:m.sp,el:s0.el,t:0,max:Math.min(12,+m.d||1),ch:!!m.ch});return}
  CAST.rem.delete(m.from);
  for(const f of fields)if(f.by===m.from&&f.s&&f.s.id===m.sp)f.t=0;
  for(const q of rains)if(q.by===m.from&&q.s&&q.s.id===m.sp)q.t=0}
function castGhostTag(r,nR){for(let i=nR;i<rains.length;i++)rains[i].by=r.id;const o=CAST.rem.get(r.id);if(o&&!o.ch)CAST.rem.delete(r.id)}

/* 단축칸 누르고 있기 (터치·마우스): 채널링 마법은 손을 뗄 때까지 이어진다 */
{const bar=document.getElementById('bar');
  if(bar)bar.addEventListener('pointerdown',e=>{if(e.button===2)return;const b=e.target.closest('button[data-slot]');if(!b)return;CAST.barHold=+b.dataset.slot;CAST.barPid=e.pointerId});
  const up=e=>{if(CAST.barHold!=null&&(CAST.barPid==null||e.pointerId===CAST.barPid))CAST.barHold=null};
  addEventListener('pointerup',up);addEventListener('pointercancel',up);addEventListener('blur',()=>{CAST.barHold=null})}

/* 시전 막대 (HUD) */
let castBarEl=null,castBarK='';
{const st=document.createElement('style');st.textContent=`#castbar{position:fixed;left:50%;top:calc(50% + 40px);transform:translateX(-50%);width:min(230px,58vw);height:16px;background:rgba(12,10,8,.88);border:1px solid #7a6440;border-radius:3px;box-shadow:0 2px 8px rgba(0,0,0,.7);pointer-events:none;overflow:hidden;z-index:3}
#castbar[hidden]{display:none}#castbar i{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--cc,#d6b262);opacity:.85}
#castbar span{position:absolute;inset:0;font-size:11px;line-height:16px;text-align:center;color:#fff8e6;text-shadow:0 1px 2px #000,0 0 3px #000;white-space:nowrap;font-variant-numeric:tabular-nums}
#castbar.ch i{background:linear-gradient(90deg,var(--cc,#d6b262),#fff4d0)}
.sub b.cinfo{color:#ffd76a;font-weight:700}`;document.head.appendChild(st)}
function castBarSet(k){
  if(!castBarEl){const hud=document.getElementById('hud')||document.body;castBarEl=document.createElement('div');castBarEl.id='castbar';castBarEl.hidden=true;
    castBarEl.innerHTML='<i></i><span></span>';hud.appendChild(castBarEl);
  }
  if(!k){if(!castBarEl.hidden){castBarEl.hidden=true;castBarK=''}return}
  const s=SPELLS[k.id],ch=k===CAST.ch,f=ch?1-k.t/k.dur:k.t/k.max,left=Math.max(0,(ch?k.dur:k.max)-k.t);
  const key=k.id+(ch?'c':'t');if(castBarK!==key){castBarK=key;castBarEl.className=ch?'ch':'';castBarEl.style.setProperty('--cc',EL[s.el]||'#d6b262')}
  castBarEl.firstChild.style.width=(clamp(f,0,1)*100).toFixed(1)+'%';
  const txt=`${s.n} · ${ch?'채널링':'시전'} ${left.toFixed(1)}초`;if(castBarEl.lastChild.textContent!==txt)castBarEl.lastChild.textContent=txt;
  castBarEl.hidden=false}

/* 시전자 발밑 마법진: 색마다 한 번 구운 그림을 돌려 붙인다 (매 프레임 그라디언트·그림자 없음) */
const CAST_GLYPH=new Map();
function castGlyph(col){let cv=CAST_GLYPH.get(col);if(cv)return cv;cv=document.createElement('canvas');cv.width=cv.height=160;const g=cv.getContext('2d');g.translate(80,80);
  const gr=g.createRadialGradient(0,0,10,0,0,78);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.75,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=.22;g.fillStyle=gr;g.beginPath();g.arc(0,0,78,0,6.283);g.fill();
  g.globalAlpha=1;g.strokeStyle=col;g.fillStyle=col;g.lineWidth=3;g.beginPath();g.arc(0,0,70,0,6.283);g.stroke();g.lineWidth=1.6;g.beginPath();g.arc(0,0,60,0,6.283);g.stroke();g.beginPath();g.arc(0,0,30,0,6.283);g.stroke();
  g.beginPath();for(let i=0;i<5;i++){const a=i*2.513-1.571,b=(i+2)*2.513-1.571;g.moveTo(Math.cos(a)*58,Math.sin(a)*58);g.lineTo(Math.cos(b)*58,Math.sin(b)*58)}g.stroke();
  for(let i=0;i<24;i++){const a=i/24*6.283;g.save();g.rotate(a);g.fillRect(-1.5,-67,3,i%3?4:7);g.restore()}
  g.globalAlpha=.9;g.fillStyle='#fff';for(let i=0;i<5;i++){const a=i*1.2566-1.571;g.beginPath();g.arc(Math.cos(a)*58,Math.sin(a)*58,3,0,6.283);g.fill()}
  CAST_GLYPH.set(col,cv);return cv}
function castGlyphAt(x,y,col,r,k,spin){const cv=castGlyph(col);ctx.save();ctx.translate(x,y);ctx.rotate(time*spin);ctx.globalAlpha=.55+.4*k;ctx.drawImage(cv,-r,-r,r*2,r*2);ctx.restore()}
// render()의 빛나는 효과 단계(G 좌표, lighter)에서 부른다
function castDraw(){const k=CAST.cur||CAST.ch;
  if(k&&!P.dead){const ch=k===CAST.ch,s=SPELLS[k.id],col=EL[s.el]||'#d6b262',f=ch?1:clamp(k.t/k.max,0,1),r=(22+s.rank*5)*(ch?1.05:.55+.45*f);
    castGlyphAt(P.x,P.y,col,r,f,ch?1.6:.9);
    if(!ch){ctx.globalAlpha=.9;ctx.strokeStyle='#fff6d8';ctx.lineWidth=3;ctx.beginPath();ctx.arc(P.x,P.y,r*.98,-1.571,-1.571+6.283*f);ctx.stroke()}
    else{ctx.globalAlpha=.5+.3*Math.sin(time*10);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(P.x,P.y,r*(.6+.4*((time*1.5)%1)),0,6.283);ctx.stroke()}
    ctx.globalAlpha=1}
  if(NET.on)for(const [rid,o] of CAST.rem){const r=NET.peers.get(rid);if(!r||r.dead||!netSame(r))continue;const s=SPELLS[o.sp];if(!s)continue;
    const f=o.ch?1:clamp(o.t/o.max,0,1);castGlyphAt(r.x,r.y,EL[s.el]||'#d6b262',(22+s.rank*5)*(o.ch?1:.55+.45*f),f,o.ch?1.6:.9)}
  ctx.globalAlpha=1}
