/* ---------- v21: 레벨업에 필요한 경험치 늘림(b2.js xpSlow21) · 예전 저장의 경험치 막대 비율 지키기 ----------
   예전(v20 이하) 저장은 xpc가 없다 → 불러온 뒤 경험치를 「그 레벨 안에서 몇 %」 그대로 새 곡선으로 옮긴다. 레벨은 절대 안 내려감.
   저장에 xpc:21을 붙인다(없으면 옛 곡선으로 본다). 지우는 코드 없음. */
function xpMig21(d){if(!d||d.xpc>=21||!P||P.lvl>=MAXLV)return;const o=xpNeedV20(P.lvl),n=xpNeed(P.lvl);if(o<=0||n<=o)return;
  P.xp=clamp(Math.floor((P.xp||0)*n/o),0,Math.max(0,n-1))}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok)try{xpMig21(d)}catch(err){if(window.__QA)throw err}return ok}}
// v24: xpc 21(v21~v23 곡선) 저장은 「그 레벨 안에서 몇 %」를 그대로 새 곡선으로 옮긴다(레벨은 그대로 · 경험치 막대 비율 그대로). v20 이하 저장은 위의 xpMig21이 바로 새 곡선으로 옮긴다
function xpMig24(d){if(!d||(d.xpc|0)<21||d.xpc>=24||!P||P.lvl>=MAXLV)return;const o=xpNeedV23(P.lvl),n=xpNeed(P.lvl);if(o<=0||n<=o)return;
  P.xp=clamp(Math.floor((P.xp||0)*n/o),0,Math.max(0,n-1))}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok)try{xpMig24(d)}catch(err){if(window.__QA)throw err}return ok}}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);if(d)d.xpc=24;return d}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{xpSlow21,xpNeedV20,xpMig21,xpSlow24,xpNeedV23,xpMig24})}catch(_){}},0);
