/* ---------- v18 (SYS): 후딜레이 (마법을 쓴 뒤 잠깐의 회복 시간) ----------
   강한 마법일수록 쓰고 난 뒤 짧게 숨을 고른다. 그동안 움직일 수는 있지만 다른 마법은 시작하지 못하고,
   그 사이에 누른 마법 하나(마지막으로 누른 것)는 기억했다가 후딜레이가 끝나는 순간 나간다.
   · 기본기(마구 쓰는 1~3위계 화살 등) 0~0.1초 · 중간 0.15~0.3초 · 큰 범위·8~9위계·무거운 한 방 0.4~0.8초
   · 시전 시간이 있는 마법은 이미 외우는 시간이 있으니 더 짧게(×0.6), 채널링은 채널링이 끝난 뒤 짧게(0.1~0.25초)
   · 위급할 때 쓰는 치유·보호막·무적·가호·순간이동은 0. 물약·귀환 두루마리는 마법이 아니라 상관없음
   · 전사·궁수 기술도 같은 규칙(위계·종류)으로 자동 적용. 무기 기본 공격(aspd)은 공격 속도를 쓰니 0
   REC_T 표에 있는 id는 그 값을 그대로 쓴다. 표에 없는 id(새 마법)는 recBase 규칙으로 정한다.
   cast.js(시전·채널링) 다음에 와야 한다: tryCast · castOrig · castStop · castReset · update를 한 겹 더 감싼다. */
const REC_T={
  // 마구 쓰는 기본기: 0
  spark:0,splash:0,light:0,holyspark:0,crackstone:0,
  // 위급용이 아닌 큰 보호·의식
  aegis:.3,divinehymn:.25,returnmiracle:.3,
  // 시간·공간을 크게 비트는 마법
  timestop:.6,slowtime:.3,
};
const REC_SAFE=new Set(['heal','shield','invuln','ward','blink','intervene']);
function recBase(s){
  if(!s||s.kind==='passive'||s.aspd)return 0;
  const k=s.kind,r=clamp(s.rank|0,1,9);
  if(REC_SAFE.has(k))return 0;
  if(k==='buff')return s.burst||s.dur<=12?0:r>=8?.3:.2;// 짧은 위급 강화는 0, 오래 가는 축복은 짧게
  if(k==='hot')return .1;
  if(k==='rez')return .3;
  if(k==='summon'||k==='orbit'||k==='armor'||k==='trap')return r>=7?.3:.15;
  let t=[0,0,.05,.1,.15,.2,.25,.3,.45,.6][r];
  if((s.cd||0)<=.6)t=Math.min(t,.1);// 마구 쓰는 기본기
  if((s.mult||0)>=6||(s.rad||0)>=220)t+=.1;// 무거운 한 방 · 넓은 범위
  if((s.cd||0)>=20)t+=.1;// 오래 기다렸다 쓰는 큰 마법
  if(k==='field'&&s.heal)t=Math.min(t,.2);// 치유 지대는 짧게
  return Math.min(.8,t)}
// 마법 하나의 후딜레이(초)
function recOf(id){const s=SPELLS[id];if(!s)return 0;if(id in REC_T)return REC_T[id];let t=recBase(s);
  if(t<=0)return 0;
  if(chanOf(id))t=clamp(t*.5,.1,.25);else if(CAST_T[id])t*=.6;
  return Math.round(t*100)/100}

const REC={t:0,max:0,id:null,q:null,p:null,chId:null,chOther:false,el:'arcane',shown:-1};
function recReset(){REC.t=0;REC.max=0;REC.id=null;REC.q=null;REC.chId=null;REC.chOther=false;REC.p=P;recBar()}
function recStart(id,sec){if(sec==null)sec=recOf(id);if(!(sec>0)||P.dead)return;const s=SPELLS[id];
  REC.t=REC.max=sec;REC.id=id;REC.el=s?s.el:'arcane';REC.p=P;
  if(sec>=.3){const a=HANIM.get(P);if(a)a.castT=time-.15}recBar()}
const recOn=()=>REC.p===P&&REC.t>0;
{const _tc=tryCast;
tryCast=function(id,target){
  if(GHOST||CAST_MOD)return _tc(id,target);
  if(REC.p!==P)recReset();
  if(REC.t>0){const ch=CAST.ch,cu=CAST.cur;
    if((ch&&ch.id===id)||(cu&&cu.id===id))return _tc(id,target);
    const s=SPELLS[id];// 후딜레이 중: 마지막으로 누른 마법 하나를 기억해 두었다가 끝나면 쓴다
    if(s&&s.cls===P.cls&&s.kind!=='passive'&&!P.dead)REC.q={id,tg:target||null,at:time,slot:CAST.slot};
    return}
  const cd0=P.cd[id]||0,cu0=CAST.cur,ch0=CAST.ch;
  const r=_tc(id,target);
  if(CAST.ch&&CAST.ch!==ch0){REC.chId=CAST.ch.id;REC.chOther=false}// 채널링: 끝난 뒤에
  else if(CAST.cur&&CAST.cur!==cu0){}// 시전 시간: 다 외워서 나갈 때 (castOrig)
  else if(cd0<=0&&(P.cd[id]||0)>0)recStart(id);
  return r}}
{const _co=castOrig;castOrig=function(id,tg){const cd0=P.cd[id]||0;const r=_co(id,tg);if(!GHOST&&!CAST_MOD&&cd0<=0&&(P.cd[id]||0)>0)recStart(id);return r}}
{const _cs=castStop;castStop=function(why){if(CAST.ch&&(why==='other'||!why))REC.chOther=true;return _cs(why)}}
{const _cr=castReset;castReset=function(){_cr();recReset()}}
function recTick(dt){
  if(REC.p!==P)recReset();
  if(REC.chId&&!CAST.ch){const id=REC.chId;REC.chId=null;if(!REC.chOther&&!P.dead&&!(REC.t>0))recStart(id);REC.chOther=false}
  if(REC.t>0){if(P.dead){recReset();return}
    REC.t=Math.max(0,REC.t-dt);
    if(REC.max>=.3&&REC.t>REC.max*.35){const a=HANIM.get(P);if(a)a.castT=time-.15}// 짧게 자세를 유지 (팔·지팡이를 거두는 동작)
    if(REC.t<=0){REC.t=0;const q=REC.q;REC.q=null;
      if(q&&!P.dead&&!paused&&time-q.at<1.2){const sl=CAST.slot;CAST.slot=q.slot||0;try{tryCast(q.id,q.tg||undefined)}finally{CAST.slot=sl}}}}
  recBar()}
{const _u=update;update=function(dt){_u(dt);recTick(dt)}}

/* 단축칸: 후딜레이 동안 마법 칸을 살짝 어둡게 하고, 어둠이 왼쪽으로 걷히며 끝을 보여 준다 (CSS 변수 하나만 바꿈) */
{const st=document.createElement('style');st.textContent=`#bar .sk[data-slot]::after{content:'';position:absolute;inset:0;background:rgba(6,5,8,.5);border-right:2px solid rgba(255,226,150,.85);transform-origin:left center;transform:scaleX(0);opacity:0;pointer-events:none}
#bar.rec .sk[data-slot]::after{opacity:1;transform:scaleX(var(--rf,0))}
.node.lockup{box-shadow:0 0 0 2px #8a5a2a inset}.req .lockup{color:#ffb070}`;document.head.appendChild(st)}
function recBar(){const b=document.getElementById('bar');if(!b)return;const f=REC.p===P&&REC.t>0&&REC.max>0?Math.round(REC.t/REC.max*40)/40:0;
  if(f===REC.shown)return;REC.shown=f;if(f>0){b.style.setProperty('--rf',f);b.classList.add('rec')}else b.classList.remove('rec')}

/* 툴팁 · 스킬 창: 시전 정보 뒤에 「후딜레이 0.4초」 */
{const _ci=castInfo;castInfo=function(id,L){const a=_ci(id,L),r=recOf(id);return r>0?(a?a+' · ':'')+`후딜레이 ${r}초`:a}}
