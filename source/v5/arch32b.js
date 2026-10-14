/* ---------- v32: 궁수 새 스킬의 그림 · 동작 (iconsphys.js · cls2.js · feedback28.js 뒤) — 데이터는 arch32.js ---------- */
Object.assign(ICP,{
  homingarrow:c=>ICX.path('M5 25C9 12 22 22 24 9',c.hi,1.3)+ICX.arrow(22,10,-70,.7)+ICX.target(9,8,.38,ICC.red),
  leecharrow:c=>ICX.arrow(15,17,-45,.95)+ICX.drop(23,22,.6,ICC.blood),
  rapidhand:c=>ICX.arrow(14,12,-20,.6)+ICX.arrow(16,18,-20,.6)+ICX.arrow(18,24,-20,.6)+ICX.lines(5,18,-20,.5,c.hi,3),
  shootrhythm:c=>ICX.arrow(16,13,-30,.75)+ICX.path('M4 25h4l2-4 3 7 3-9 3 6h9',c.hi,1.2),
  doublestream:c=>ICX.arrow(15,12,-35,.8)+ICX.arrow(19,19,-35,.8)+ICX.lines(6,24,-35,.6,c.hi,3)});
PVN.ias='공격 속도';if(!TIP24.PCT.ias)TIP24.PCT.ias='공격 속도';
// 래피드 핸드: 패시브 ias 는 buffSum('ias')에 패시브 합이 들어가므로(b2.js) 그대로 atkIv(공격 속도로 쏘는 사격)에만 걸린다. 상한 40%도 그대로
// 슈팅 리듬 · 더블 스트림: 레벨마다 기본 값의 2%씩(최대 +40%) — 다른 강화의 고정 값과 같은 규칙
{const _ef=eff;eff=function(id,L){const e=_ef(id,L),s=SPELLS[id];if(s&&(s.rh||s.ds)){const k=1+Math.min(.4,.02*Math.max(0,(L||1)-1));if(s.rh)e.rh=s.rh*k;if(s.ds)e.ds=s.ds*k}return e}}
const RH32={n:0,t:0};
const ar32Basic=s=>s&&!s.ghost&&s.aspd&&s.cls==='archer'&&P&&P.cls==='archer';
{const _he=hurtE;hurtE=function(e,amt,s){if(!e||e.dead||!ar32Basic(s)||!(amt>0))return _he.apply(this,arguments);const B=P.buffs.shootrhythm;
  if(!B||!(B.t>0)||!B.rh){RH32.n=0;return _he.apply(this,arguments)}
  if(time>RH32.t)RH32.n=0;const h0=e.hp,r=_he(e,amt*(1+RH32.n*B.rh),s);
  if(e.hp<h0||e.dead){RH32.n=Math.min(B.rhMax||10,RH32.n+1);RH32.t=time+(B.rhT||2)}return r}}
{const _tc=tryCast;tryCast=function(id,t){const s=SPELLS[id],B=P&&P.buffs&&P.buffs.doublestream;
  if(GHOST||CAST_MOD||!B||!(B.t>0)||!B.ds||!s||s.kind!=='bolt'||!ar32Basic(s))return _tc.apply(this,arguments);
  const n0=projs.length,r=_tc.apply(this,arguments),add=[];
  for(let i=n0;i<projs.length;i++){const p=projs[i];if(p.owner!=='p'||p.ghost||p.ds32||!p.s||p.s.id!==id)continue;
    const a=Math.atan2(p.vy,p.vx)+.09,sp=Math.hypot(p.vx,p.vy);add.push(Object.assign({},p,{vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,dmg:p.dmg*B.ds,ds32:1,hit:p.hit?new Set():null}))}
  for(const p of add)projs.push(p);return r}}
// 강화 값(rh · rhMax · rhT · ds)을 강화에 옮겨 둔다 (job2.js J2_BX 와 같은 방식)
{const _pb=putBuffV19;putBuffV19=function(id,nb,by,s){const r=_pb.apply(this,arguments);const b=P.buffs[id];if(b&&s&&!GHOST)for(const k of ['rh','rhMax','rhT','ds'])if(s[k]!=null)b[k]=s[k];return r}}
// 사용자 요청: 「궁수 스킬이 캐스팅에 비해 조금 약하다는 피드백이 있었는데 캐스팅이 들어가는 스킬의 위력을 소폭 상향해줘」
// → 시전 시간(CAST_T)이 있는 궁수 공격 스킬 위력 10% 상향 (누르고 있는 채널링은 제외)
const AR32_CAST={up:1.1,ids:[]};
for(const id in SPELLS){const s=SPELLS[id];if(s.cls!=='archer'||!(CAST_T[id]>0)||CHAN[id]||!(s.mult>0))continue;s.mult*=AR32_CAST.up;AR32_CAST.ids.push(id)}
// 점검 도우미(clsSnap): 새 강화 값도 보이게
{const _cs=clsSnap;clsSnap=function(){const o=_cs();if(P&&P.cls==='archer'){o.rh=buffSum('rh');o.ds=buffSum('ds')}return o}}
