/* ---------- v35: 시전 중에 누른 기술은 기다렸다가 쓴다 (사용자 2026-10-15 「캐스팅하다가 다른 스킬 누르면 캐스팅을 끝내고 다른 스킬을 쓰게 해줘.
   캐스팅을 끊을 수 있는 건 이동하거나 귀환하는 명령어야.」)
   · 시전(CAST.cur) · 채널링(CAST.ch) 중에 다른 기술을 누르면 끊지 않고 CAST.q에 기억(마지막에 누른 것 하나). 시전 · 채널링이 끝나면 바로 그 기술을 쓴다.
   · 끊는 것: 움직이기(castStop 'move') · 귀환 두루마리(useScroll). 이때 기다리던 기술도 버린다. 죽어도 버린다.
   · 같은 기술을 다시 누르면 예전처럼 겨눌 곳만 바꾼다. 마나가 다해 채널링이 멈추면 기다리던 기술은 그대로 쓴다.
   · 모아 쏘기(3차 charge)는 예전처럼 다른 기술을 누르면 모은 만큼 쏘고 그 기술을 쓴다(job3.js). */
{const _tc=tryCast;tryCast=function(id,t){
  if(!GHOST&&!CAST_MOD&&CAST.p===P){const k=CAST.cur||CAST.ch,s=SPELLS[id];
    if(k&&k.id!==id&&s&&s.cls===P.cls&&s.kind!=='passive'&&skLv(id)>0){CAST.q={id,t:t?{x:t.x,y:t.y}:null};castBarSet(k);return}}
  return _tc.apply(this,arguments)}}
{const _st=castStop;castStop=function(why){if(why==='move'||why==='recall'||P.dead)CAST.q=null;return _st.apply(this,arguments)}}
{const _rs=castReset;castReset=function(){CAST.q=null;return _rs.apply(this,arguments)}}
{const _tk=castTick;castTick=function(dt){_tk(dt);const q=CAST.q;if(!q||castOn())return;CAST.q=null;if(P.dead||paused)return;
  tryCast(q.id,q.t||undefined)}}
{const _us=useScroll;useScroll=function(){if(castOn()&&!P.dead&&!paused&&tpCount()>0){const k=CAST.cur||CAST.ch,s=k&&SPELLS[k.id];castStop('recall');if(s)msg(`귀환하려고 ${s.n}을(를) 멈췄습니다`,'#a39d8f')}
  return _us.apply(this,arguments)}}
// 시전 막대에 다음 기술 이름
{const _cb=castBarSet;castBarSet=function(k){_cb(k);if(k&&CAST.q&&castBarEl&&!castBarEl.hidden){const s=SPELLS[CAST.q.id];if(s){const sp=castBarEl.lastChild;if(!sp.textContent.includes(' → '))sp.textContent+=` → ${s.n}`}}}}
