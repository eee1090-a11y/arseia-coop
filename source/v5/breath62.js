/* ---------- v62 신궁 「호흡」 쌓는 법 바꿈 (사용자 2026-11-15 「궁수 3차에서 가만히 있어야 호흡이 쌓인다고 했는데 계속 미사일 피하면서
   돌아다녀야되는 궁수 특성 상 … 좀 불합리한 거 같은데 다른 방법 없니」 → 「4로 해줘 그럼」 = 맞히기 + 피하기 섞기) ----------
   예전: 움직이지 않으면 0.5초마다 1(최대 5), 움직이면 0.
   이제(신궁만, 최대 5 그대로):
   · 내 화살(궁수 기술)이 적에게 맞으면 +1. 0.4초에 한 번까지(여러 발 · 꿰뚫기는 한 번으로). 빗나가면 안 쌓임.
   · 공격을 피하면 +3:
     - 회피(「피함」 글자가 뜨는 것)로 피했을 때. 0.8초에 한 번까지.
     - 구르기 · 비켜 걷기(뒤로 구르기 · 물러나며 쏘기 · 그림자 이동 · 바람 걸음)를 위험할 때 써서 0.5초 동안 한 대도 안 맞았을 때.
       위험 = 내가 들어 있는 몬스터 기술 예고 원, 220 안에서 나를 향해 날아오는 몬스터 화살 · 마법, 나를 노리고 곧 칠 몬스터가 바로 곁.
   · 서 있어도 움직여도 줄지 않는다. 큰 기술은 예전처럼 쌓인 호흡을 모두 쓴다(호흡마다 피해 +8% · 치명타 · 일격필살 1초 그대로).
   빈도: 쉬지 않고 맞히면 예전(서 있으면 2.5초에 5)과 비슷하게 2초 남짓에 5, 한 번 잘 피하면 바로 3.
   저장 바뀜 없음(호흡은 저장하지 않음). 같이 하기: 각자 자기 화면에서 쌓는다(동료 유령 시전 · 동료 짐승의 공격은 안 셈). */
const BR62={hit:1,dodge:3,max:5,hitGap:.4,evaGap:.8,win:.5,projR:220,meleeX:40,tHit:-9,tEva:-9,w:null,hurtT:-9,hurtN:0};
const br62On=()=>!!(P&&P.job3==='divinearcher'&&!P.dead&&!GHOST);
function br62Add(n,why){if(!br62On())return 0;const b0=J3W.br;J3W.br=Math.min(BR62.max,J3W.br+n);const g=J3W.br-b0;
  if(g>0){ftext(P.x,P.y-40,`호흡 +${g}`,'#bfe6ff',false,60);if(J3W.br===BR62.max&&b0<BR62.max)rings.push({x:P.x,y:P.y,r:6,max:50,life:.4,col:'#bfe6ff'})}return g}
// 내 궁수 기술인가 (동료 짐승 · 다른 직업 효과는 아님)
function br62Mine(s){if(!s||!s.phys)return false;const c=s.cls||(s.id&&SPELLS[s.id]&&SPELLS[s.id].cls);if(c!=='archer')return false;
  for(const a of allies)if(a&&(a.s===s||a.hs===s))return false;return true}
{const _he=hurtE;hurtE=function(e,amt,s){if(!br62On()||!e||e.dead||!br62Mine(s))return _he.apply(this,arguments);
  e._miss=null;const r=_he.apply(this,arguments);if(e._miss!==s&&time-BR62.tHit>=BR62.hitGap){BR62.tHit=time;br62Add(BR62.hit,'hit')}return r}}
// 회피로 피함 (fxphys.js가 queueMicrotask에서 PFX를 바꿔 끼우므로 그 뒤에 감싼다)
queueMicrotask(()=>{const _ev=PFX.evade;PFX.evade=function(h){const r=_ev.apply(this,arguments);if(h===P&&time-BR62.tEva>=BR62.evaGap){BR62.tEva=time;br62Add(BR62.dodge,'eva')}return r}});
// 맞으면(생명력이 줄면) 구르기 피하기는 실패
{const _hp=hitPlayer;hitPlayer=function(){const h0=P&&P.hp,s0=P&&P.shield;const r=_hp.apply(this,arguments);if(P&&(P.hp<h0-.01||(P.shield||0)<(s0||0)-.01)){BR62.hurtT=time;BR62.hurtN++}return r}}
// 지금 나를 노리는 위험이 있나
function br62Threat(){if(!P)return false;
  for(const w of warns)if(!w.done&&w.t>0&&w.dmg>0&&w.rad>0&&Math.hypot(P.x-w.x,P.y-w.y)<w.rad+P.r)return true;
  for(const p of projs){if(p.owner==='p'||p.ghost||!(p.life>0))continue;const dx=P.x-p.x,dy=P.y-p.y,d=Math.hypot(dx,dy);if(d<BR62.projR&&(p.vx*dx+p.vy*dy)>0)return true}
  for(const e of enemies){if(e.dead||e.hp<=0||e.stunT>0||e.freezeT>0||!TYPES[e.k])continue;if(e.dash>0&&Math.hypot(P.x-e.x,P.y-e.y)<260)return true;
    if(Math.hypot(P.x-e.x,P.y-e.y)<hR(e)+P.r+BR62.meleeX&&(e.atkCd||0)<=.6){const t=enemyTarget(e);if(t&&t.tg===P)return true}}
  return false}
const BR62_MOVE=s=>!!s&&s.cls==='archer'&&(s.kind==='blink'||s.kind==='sidestep');
{const _tc=tryCast;tryCast=function(id){const s=SPELLS[id];if(!br62On()||!BR62_MOVE(s))return _tc.apply(this,arguments);
  const cd0=P.cd[id]||0,th=br62Threat();const r=_tc.apply(this,arguments);if(th&&cd0<=0&&(P.cd[id]||0)>0)BR62.w={t:BR62.win,at:time,n:BR62.hurtN};return r}}
function br62Tick(dt){const w=BR62.w;if(!w)return;if(!br62On()){BR62.w=null;return}if(BR62.hurtN!==w.n){BR62.w=null;return}w.t-=dt;if(w.t<=0){BR62.w=null;br62Add(BR62.dodge,'roll')}}
{const _t=jwTick;jwTick=function(dt){const r=_t.apply(this,arguments);try{br62Tick(dt)}catch(e){if(window.__QA)throw e}return r}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{BR62,br62Add,br62Threat,br62Tick})}catch(_){}},0);
