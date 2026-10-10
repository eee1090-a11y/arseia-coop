/* ---------- v20 (IDEAS) 공통: 소속 · 책 · 현상금 · 고르는 의뢰 · 원소 연계 · 세계의 신비 · 세력 평판 ----------
   설계: rpg/v20-ideas/code (사용자 2026-10-08 22:34 「남은 것들을 V20에」). 변하는 미궁(Q3)·3막(Q4)은 v21로 미룸.
   파일: v20c.js(공통) aff20.js books20.js bounty20.js choice20.js combo20.js wonder20.js faction20.js — job3q.js·world3.js 뒤, music-index.js 앞.
   새 저장 값(모두 「없으면 기본값」, 예전 값은 지우지 않고, 모르는 값은 그대로 다시 씀):
     P.aff(소속 id) · P.affN(바꾼 횟수) · P.books(읽은 책 id) · P.bty(현상금) · P.sq.ch(sq.js, 고른 갈래) · P.won(본 신비) · P.rep(세력 점수) · P.repDay(하루 상한) */
const V20={panel:null,opt:null,qaNow:null,npcBox:[],onTalk:[],gsAdd:[],gsVer:0,dmgAdd:[],healK:[],tick:[],slowTick:[],slowT:0};
// 기기 설정(캐릭터 저장과 따로, 이 기기에만): 연계 글씨 끄기 등
const V20OPT='arseia-v20opt';
function v20Opt(k,v){let o=V20.opt;if(!o){o={};try{const s=localStorage.getItem(V20OPT);const j=s?JSON.parse(s):null;if(j&&typeof j==='object')o=j}catch(_){}V20.opt=o}
  if(v===undefined)return o[k];o[k]=v;try{localStorage.setItem(V20OPT,JSON.stringify(o))}catch(_){}return v}
const v20Now=()=>V20.qaNow!=null?V20.qaNow:Date.now();
// 그날(사용자 컴퓨터 날짜)
function v20Day(ms){const d=new Date(ms==null?v20Now():ms);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function v20Hash(s){let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function v20Rng(seed){let s=seed>>>0;return()=>((s=Math.imul(s^(s>>>15),2246822507)>>>0)/4294967296)}
const v20Esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const v20Town=id=>ALLTOWNS.find(t=>t.id===id)||null;
const v20L=reg=>reg==='home'?HOME:(RCACHE[reg]||null);
const v20Mob=()=>innerWidth<=640;
// 들판(마을 안전 지대·실내·던전 밖)인지
const v20Field=()=>!DG&&!IN&&!inSafe(P.x,P.y,0);
// 싸우는 중: 방금 맞았거나 가까이에 쫓아오는 몬스터
function v20Fight(){if(P.hurtT>0)return true;for(const e of enemies)if(!e.dead&&e.aggroed&&Math.abs(e.x-P.x)<600&&Math.abs(e.y-P.y)<600)return true;return false}

/* ===== 마을에 세우기: 사람·게시판 자리 (겹치지 않게 · 걸어서 닿게 · 건물·문·소품에서 떼어) ===== */
function v20FindSpot(L,t,x0,y0,maxR,o){o=o||{};const Pt=wxTownParts(L,t),others=[...Pt.folk.map(f=>({x:f.hx,y:f.hy})),...(Pt.npcD?[{x:Pt.npcD.x,y:Pt.npcD.y}]:[])];
  const lim={bld:WXT.bld+10,door:WXT.door+10,prop:1,npc:WXT.npc+14},ok=Pt.lq?(L.okT||(L.okT=wxReach(Pt.lq,t.x,t.y))):null,R0=o.maxD||520;
  const good=(x,y)=>{const d=Math.hypot(x-t.x,y-t.y);return d<R0&&d>(o.minD||0)&&wxSpotOk(Pt,x,y,null,others,lim)&&Pt.props.every(p=>Math.hypot(p.x-x,p.y-y)>=(o.prop||44))&&(!ok||wxCanReach(ok,x,y))};
  if(good(x0,y0))return{x:x0,y:y0};
  for(let r=12;r<=maxR;r+=12){const n=Math.max(8,Math.round(r*6.283/16));for(let i=0;i<n;i++){const a=i/n*6.283,x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r;if(good(x,y))return{x,y}}}return null}
// 마을 사람 하나 더 세우기 (TWFOLK에 모양·말을 먼저 넣어 둔다)
function v20AddFolk(id,townId,dx,dy){const t=v20Town(townId);if(!t||!TWFOLK[id])return null;const L=v20L(t.reg||'home');if(!L)return null;const k=t.reg&&t.reg!=='home'?1:wxTk(t);
  const p=v20FindSpot(L,t,t.x+dx*k,t.y+dy*k,360);if(!p)return null;const d=twFolkObj(id,t,p.x,p.y);if(d)L.decor.push(d);return d}
// 소품 하나 세우기 (게시판 등)
function v20AddProp(townId,dx,dy,o){const t=v20Town(townId);if(!t)return null;const L=v20L(t.reg||'home');if(!L)return null;const k=t.reg&&t.reg!=='home'?1:wxTk(t);
  const p=v20FindSpot(L,t,t.x+dx*k,t.y+dy*k,360,{prop:56});if(!p)return null;const d=Object.assign({x:p.x,y:p.y,s:1,v:0,zl:0,tprop:1},o);L.decor.push(d);return d}
function v20SyncDecor(){if(IN||DG)return;const L=v20L(REG.id);if(L)setArr(decor,L.decor)}

/* ===== 창: 의뢰 창(quest)을 빌려 쓴다 (SQV.mode='v20') ===== */
const V20P={},V20A={};
function v20Open(kind,arg){V20.panel={kind,arg};SQV.mode='v20';SQV.npc=null;pbody.parentElement.scrollTop=0;openPanel('quest')}
{const _qh=questHtml;questHtml=function(){if(SQV.mode==='v20'&&V20.panel&&V20P[V20.panel.kind])return V20P[V20.panel.kind].html(V20.panel.arg);return _qh()}}
{const _qc=questClick;questClick=function(b){const d=b.dataset;if(d.v20a&&V20A[d.v20a]){V20A[d.v20a](d.v20b,b);if(!panel.hidden)renderPanel();return true}return _qc(b)}}
{const _rp=renderPanel;renderPanel=function(){_rp();if(tab==='quest'&&SQV.mode==='v20'&&V20.panel&&V20P[V20.panel.kind]){const t=$('#ptitle');if(t)t.textContent=V20P[V20.panel.kind].title(V20.panel.arg)}}}
const v20Btn=(a,b,label,o)=>`<button type="button" class="${o&&o.cls||''}" data-v20a="${a}" data-v20b="${v20Esc(b==null?'':b)}"${o&&o.dis?' disabled':''}${o&&o.title?` title="${v20Esc(o.title)}"`:''}>${label}</button>${o&&o.dis&&o.title?`<small class="v20why">${v20Esc(o.title)}</small>`:''}`;
// 마을 사람 창에 덧붙이는 칸 (소속 대표 · 세력 상인 …): fn(f) → html 또는 ''
{const _nh=sqNpcHtml;sqNpcHtml=function(){let h=_nh();const f=SQV.npc;if(!f)return h;let add='';for(const fn of V20.npcBox){try{add+=fn(f)||''}catch(e){if(window.__QA)throw e}}
  if(!add)return h;const i=h.indexOf('</p>');return i>=0?h.slice(0,i+4)+add+h.slice(i+4):add+h}}
{const _st=sqTalk;sqTalk=function(f){for(const fn of V20.onTalk){try{fn(f)}catch(e){if(window.__QA)throw e}}const r=_st(f);if(r||!f)return r;
  if(V20.npcBox.some(fn=>{try{return !!fn(f)}catch(_){return false}})){SQV.mode='npc';SQV.npc=f;qTown=f.town||qTown;openPanel('quest');return true}return r}}
const v20Css=css=>{const st=document.createElement('style');st.textContent=css;document.head.appendChild(st)};
v20Css('.v20box button:disabled,.v20row button:disabled{opacity:.4;filter:grayscale(.7);cursor:default}.v20why{flex-basis:100%;text-align:right;font-size:11px;color:#c9b07a}.v20box{border:1px solid #4a3e2a;border-radius:6px;padding:6px 8px;margin:8px 0;background:#15120e}.v20box h3{margin:0 0 4px;font-size:14px;color:#f0dca8}.v20box .row{margin-top:6px;flex-wrap:wrap;gap:6px}'+
  '.v20row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid #2e2820;flex-wrap:wrap}.v20row>div:first-child{min-width:0;flex:1 1 180px}.v20row .btns{display:flex;gap:4px;flex-wrap:wrap}'+
  '.v20chip{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px;border:1px solid #0008}.v20tag{display:inline-block;font-size:11px;padding:0 5px;border-radius:3px;margin-right:4px;font-style:normal}'+
  '.v20bar{height:6px;background:#2a241c;border-radius:3px;overflow:hidden;margin-top:3px}.v20bar i{display:block;height:100%;background:#c9a24a}.v20txt{white-space:pre-wrap;line-height:1.55;font-size:13px}');

/* ===== 같이 하기: 'v20x' 메시지 (옛 판은 모르는 메시지라 무시) ===== */
const V20NET={};
function v20Send(k,o,to){if(!NET.on)return;const m=Object.assign({t:'v20x',k},o||{});if(to)m.to=to;netSend(m)}
{const _nm=netOnMsg;netOnMsg=function(m){if(m&&m.t==='v20x'){if(m.to&&m.to!==NET.id)return;const f=V20NET[m.k];if(f)try{f(m,NET.peers.get(m.from)||null)}catch(e){if(window.__QA)throw e}return}return _nm(m)}}

/* ===== 능력치 덧셈: 장비 능력치(gearStats)에 더해 넣는다 (덧셈 · 기존 상한 그대로) =====
   V20.gsAdd: fn(out, base) — out에 더함. 입력이 바뀌면 V20.gsVer를 올린다(캐시). */
{const _g=gearStats;let cIn=null,cOut=null,cV=-1,cP=null,cL=-1,cS=-1;
  gearStats=function(){const o=_g();if(o===cIn&&V20.gsVer===cV&&P===cP&&P.lvl===cL&&P.st.spi===cS)return cOut;cIn=o;cV=V20.gsVer;cP=P;cL=P.lvl;cS=P.st.spi;
    let r=o;if(V20.gsAdd.length){const x={};for(const f of V20.gsAdd)f(x,o);if(Object.keys(x).length){r=Object.assign({},o);for(const k in x)r[k]=Math.round(((r[k]||0)+x[k])*10)/10}}cOut=r;return r}}
const v20GsBump=()=>{V20.gsVer++};
// 마나 회복 % → 지금 기본 회복량의 몇 %를 장비 회복 칸에 더한다
const v20RegenPct=(o,pct)=>pct*(1+P.lvl*.12+P.st.spi*.06+(o.regen||0));
/* ===== 피해 덧셈: 내 마법 피해 %를 「피해 증가」 칸에 더해 한 번만 곱한다 (V20.dmgAdd: fn(e,s) → 0.12 같은 값) ===== */
{const _he=hurtE;hurtE=function(e,amt,s){if(!e||e.dead||!s||s.ghost||GHOST||!V20.dmgAdd.length||!(s.cls===P.cls||s.v20))return _he.apply(this,arguments);
  let x=0;for(const f of V20.dmgAdd)x+=f(e,s)||0;if(x>0){const cap=dmgCap(),bd=Math.min(cap,buffSum('dmg')+(P.armor?P.armor.dmgB:0));amt*=(1+Math.min(cap,bd+x))/(1+bd)}
  return _he.call(this,e,amt,s)}}
/* ===== 치유량 % (내가 건 치유만): V20.healK: fn() → 0.06 같은 값 ===== */
V20.healMine=false;
{const _sf=supFx;supFx=function(s,id,pwr,from){const m=V20.healMine;V20.healMine=!from&&!GHOST;try{return _sf.apply(this,arguments)}finally{V20.healMine=m}}}
{const _hl=healP;healP=function(n){if(V20.healMine&&V20.healK.length&&n>0){let x=0;for(const f of V20.healK)x+=f()||0;if(x>0)n*=1+x}return _hl(n)}}
/* ===== 매 프레임 / 4번에 한 번 도는 일 ===== */
{const _u=update;update=function(dt){_u(dt);if(!P)return;for(const f of V20.tick)f(dt);V20.slowT-=dt;if(V20.slowT<=0){const st=.25;V20.slowT=st;for(const f of V20.slowTick)f(st)}}}

/* ===== 저장 · 불러오기 (모두 이 파일에서: 새 값 · 기본값 · 모르는 값 보존) ===== */
const v20Obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const v20StrArr=(a,max)=>Array.isArray(a)?[...new Set(a.filter(x=>typeof x==='string'&&x.length&&x.length<=40))].slice(0,max||400):[];
function v20LoadFrom(d){d=d&&typeof d==='object'?d:{};
  // 소속: 이 직업의 소속 id만 쓰고, 모르는 값은 _affRaw로 남겨 다시 저장할 때 그대로 쓴다
  const A=(typeof AFF20==='object'&&AFF20[P.cls])||[];P.aff=null;P._affRaw=null;
  if(typeof d.aff==='string'&&d.aff){if(A.some(a=>a.id===d.aff))P.aff=d.aff;else if(d.aff.length<=40)P._affRaw=d.aff}
  P.affN=Number.isFinite(+d.affN)?Math.max(0,Math.floor(+d.affN)):0;
  P.books=v20StrArr(d.books,200);
  P.bty=typeof btyClean==='function'?btyClean(d.bty):{};
  P.won=v20Obj(d.won)?Object.assign({},d.won,{seen:v20StrArr(d.won.seen,100)}):{seen:[]};
  P.rep=typeof repClean==='function'?repClean(d.rep):{};
  P.repDay=typeof repDayClean==='function'?repDayClean(d.repDay):{day:'',got:{}};
  v20GsBump()}
function v20SaveInto(d){d.aff=P.aff||P._affRaw||null;d.affN=P.affN|0;d.books=Array.isArray(P.books)?P.books.slice():[];
  d.bty=typeof btyClean==='function'?btyClean(P.bty):{};d.won=v20Obj(P.won)?Object.assign({},P.won,{seen:v20StrArr(P.won.seen,100)}):{seen:[]};
  d.rep=typeof repClean==='function'?repClean(P.rep):{};d.repDay=typeof repDayClean==='function'?repDayClean(P.repDay):{day:'',got:{}};return d}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P)v20SaveInto(d)}catch(e){if(window.__QA)throw e}return d}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok)try{v20LoadFrom(d)}catch(e){if(window.__QA)throw e;v20LoadFrom(null)}return ok}}
{const _ng=newGame;newGame=function(cls,slot){const r=_ng.apply(this,arguments);v20LoadFrom(null);return r}}
/* ===== 칭호 (책 묶음 · 현상금 · 세력): 가진 것 중 하나를 골라 캐릭터 창에 보인다. 고른 것은 P.rep._title, 산 것은 P.rep._own ===== */
V20.titles=[];// {id,n,col,src,have()}
const v20Own=()=>{if(!P.rep||typeof P.rep!=='object')P.rep={};if(!Array.isArray(P.rep._own))P.rep._own=[];return P.rep._own};
const v20OwnHas=k=>!!(P&&P.rep&&Array.isArray(P.rep._own)&&P.rep._own.includes(k));
function v20OwnAdd(k){const o=v20Own();if(!o.includes(k))o.push(k)}
const v20TitlesHave=()=>P?V20.titles.filter(t=>{try{return t.have()}catch(_){return false}}):[];
function v20TitleCur(){const id=P&&P.rep&&P.rep._title;if(!id)return null;return v20TitlesHave().find(t=>t.id===id)||null}
V20A.title=id=>{if(!id){P.rep._title='';save();return}if(!v20TitlesHave().some(t=>t.id===id))return;v20Own();P.rep._title=id;const t=V20.titles.find(t=>t.id===id);msg(`칭호: 「${t.n}」`,t.col||'#ffe39a');save()};
function v20TitleHtml(){const L=v20TitlesHave(),cur=v20TitleCur();if(!L.length)return '<p class="muted">아직 칭호가 없습니다. 책 묶음을 다 읽거나 · 현상금 증표 · 세력 평판으로 얻습니다.</p>';
  return `<div class="v20box"><h3>칭호 ${cur?`· 「${cur.n}」`:''}</h3>${L.map(t=>`<div class="v20row"><div><b style="color:${t.col||'#efe2c0'}">${t.n}</b> <span class="muted" style="font-size:12px">${t.src||''}</span></div><div class="btns">${cur&&cur.id===t.id?v20Btn('title','','떼기',{cls:'ghost'}):v20Btn('title',t.id,'달기')}</div></div>`).join('')}</div>`}
window.__v20=window.__v20||{};Object.assign(window.__v20,{V20,V20A,v20Open,openCodex,openPanel,codexClick,renderPanel})
v20Css('#pclose{white-space:nowrap;flex-shrink:0}');
const v20J=(n,a,b)=>{n=String(n||'');const c=n.charCodeAt(n.length-1);return (c>=0xac00&&c<=0xd7a3&&(c-0xac00)%28)?b:a};
