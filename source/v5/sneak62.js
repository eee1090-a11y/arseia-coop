/* ---------- v62 몰래 지나가기에서 동료가 들키게 하지 않게 (사용자 2026-11-15 「들키지 않고 지나가기 퀘스트에서 펫이 자동으로 때리면 계속 실패해서 펫을 죽이고 진행할 수밖에 없잖아」) ----------
   몰래 지나가기(g42q.js sneak) 중 아직 들키지 않은 경비 몬스터(e.g42sn)에게는
   · 동료 짐승 · 소환수 · 히드라 같은 내 편(allies)이 먼저 덤비지 않는다(그 경비를 상대로 고르지 않음 · 동료 기술 · 골렘 도발도 안 걸림). 따라오기만.
   · 내 편이 주는 피해는 들어가지 않는다(다른 적을 노린 화살 · 범위가 스쳐도 들키지 않음).
   · 경비는 내 편을 보고 쫓아오지 않는다: 들킴은 나(와 같이 하는 사람)를 볼 때만.
   내가 직접 때리거나 눈(둥근 빛) 안에 들어가면 예전처럼 들킨다. 들킨 뒤(쫓아오는 경비)에는 동료도 예전처럼 싸운다. 저장은 바꾸지 않는다. */
const SN62={};
const sn62Hid=e=>!!(e&&!e.dead&&e.g42sn&&!e.aggroed&&G42Q.run[e.g42sn]);
const sn62Any=()=>enemies.some(sn62Hid);
function sn62Without(fn){if(!sn62Any())return fn();const all=enemies;enemies=all.filter(e=>!sn62Hid(e));try{return fn()}finally{const now=enemies;enemies=all;for(const e of now)if(!all.includes(e))all.push(e)}}
{const _ua=updateAllies;updateAllies=function(){const a=arguments;return sn62Without(()=>_ua.apply(this,a))}}
if(typeof g42PetTick==='function'){const _pt=g42PetTick;g42PetTick=function(){const a=arguments;return sn62Without(()=>_pt.apply(this,a))}}
{const _et=enemyTarget;enemyTarget=function(e){if(!sn62Hid(e)||!allies.length)return _et.apply(this,arguments);const all=allies;allies=[];try{return _et.apply(this,arguments)}finally{allies=all}}}
{const _he=hurtE;hurtE=function(e,amt,s){if(sn62Hid(e)&&s&&allies.some(a=>a&&a.s===s))return 0;return _he.apply(this,arguments)}}
// 골렘 도발 · 동료가 건 도발은 경비에게서 지운다
{const _ue=updateEnemies;updateEnemies=function(){for(const e of enemies)if(sn62Hid(e)&&e.tauntBy&&e.tauntBy!==P&&allies.includes(e.tauntBy)){e.tauntT=0;e.tauntBy=null}return _ue.apply(this,arguments)}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{sn62Hid})}catch(_){}},0);
