/* ---------- v24 퀘스트 대상 몬스터가 자주 나오게 (사용자 2026-10-10 05:33) ----------
   「폭풍 정령의 젠률이 너무 낮아 → 퀘스트에 필요한 몹은 다른 몹 출현률을 내리더라도 더 자주」
   · 지금 하고 있는 의뢰(주 의뢰의 지금 목표 · 받은 마을 의뢰 · 전직 시험 · 부탁)의 아직 못 채운 처치/모으기 목표 몬스터가
     지금 지역의 몬스터 목록에 있으면, 필드에 새로 생기는 몬스터의 40%를 그 몬스터로 바꾼다(다른 몹이 그만큼 덜 나옴).
   · 예전에는 지역 안쪽(몬스터 최소 레벨 이상인 곳)에서만 나오던 대상도, 바꿔 나올 때는 그 자리 레벨로 나온다(입구 근처에서도 찾을 수 있음).
   · 정예 여부 · 레벨은 원래 굴림 그대로. 던전 · 보스 · 같이 하기 참가자 화면(몬스터를 만들지 않음)은 그대로. 저장은 바꾸지 않는다. */
const SPAWN24={P:.4};
function q24Targets(){const out=new Set();if(!P)return out;
  try{const st=qState(),q=qCur();if(q&&st.st===1)q.goals.forEach((g,j)=>{if(g.k&&(g.type==='kill'||g.type==='get'||g.type==='collect')&&!qGoalDone(q,j))g.k.forEach(k=>out.add(k))})}catch(_){}
  try{const a=sqState().a;for(const id in a){const q=SQBY[id];if(!q||!q.goals)continue;q.goals.forEach((g,j)=>{if(g.k&&(g.type==='kill'||g.type==='get'||g.type==='collect')&&!sqGoalDone(q,j))g.k.forEach(k=>out.add(k))})}}catch(_){}
  return out}
function spawn24Pick(){const T=q24Targets();if(!T.size)return null;const here=(REG.mobs||FIELD_TYPES).filter(k=>T.has(k)&&TYPES[k]&&!TYPES[k].boss&&!TYPES[k].mini);return here.length?pick(here):null}
{const _se=spawnEnemy;spawnEnemy=function(){const n=enemies.length,r=_se.apply(this,arguments);
  if(DG||NET.guest||enemies.length<=n||R()>=SPAWN24.P)return r;const k=spawn24Pick();if(!k)return r;const e=enemies[enemies.length-1];if(e.k===k)return r;
  const t=TYPES[k],D=DIFF[P.diff],lvl=e.lvl,elite=e.elite,hp=Math.round(t.hp*(1+.34*(lvl-1))*(elite?3:1)*D.hp);
  Object.assign(e,{k,hp,max:hp,dmg:t.dmg*(1+.18*(lvl-1))*(elite?1.4:1),r:t.r*(elite?1.25:1),q24:1});return r}}
window.__spawn24={SPAWN24,q24Targets,spawn24Pick};
