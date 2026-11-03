/* ---------- v53: 스킬 이펙트 그림을 실제 맞는 범위에 맞춤 (fxalign.js · wfx48.js 바로 뒤) ----------
   사용자 요청(2026-11-03): 「스킬 이펙트가 실제 그 범위와 일치하도록 해줘. 세이크리드 선은 해가 비추는 아래 동그란 범위가 스킬 범위와 맞아야 하는데
   타격 범위와 그림을 가운데 맞춤 해 버렸거든. 스킬들을 하나씩 검토해서 이런 불일치가 없도록」.
   · 지금까지는 그림 칸(128)의 가운데(또는 정해 둔 바닥 줄)를 범위 중심에 두고, 그림 전체의 가장 넓은 폭을 범위 지름에 맞췄다.
     그래서 해 · 빛기둥 · 칼 · 종처럼 위로 솟은 그림은 땅에 닿는 빛 원이 범위보다 아래/위로 비켜 나고 작게 보였다.
   · 그림마다 「땅에 닿는 동그란 자리」(칸 안 x, y)와 그 폭을 눈으로 하나씩 재어 표 G에 적었다. 이 자리가 범위 중심에, 이 폭이 범위 지름에 온다.
     부채꼴(C)은 가장 큰 칸의 시작 x · 끝 x를 시전한 사람 · 사거리 끝에 맞춘다. 도는 고리(O)는 고리 폭을 도는 반지름에 맞춘다.
   · 표에 없는 그림은 예전과 똑같이 그린다. 판정 · 피해 · 범위 수치 · 저장은 건드리지 않는다(그림 자리와 크기만). 「예전 그림」 설정이면 아무것도 바뀌지 않는다.
   · 검토 목록 전체와 전후 비교 그림: rpg/fx-align/검토-목록.md */
const FXA={
  // 띠 → [땅 중심 x, 땅 중심 y, 범위 지름에 맞출 폭] (칸 화소, 띠 이름 앞의 'fx_'는 뺌)
  G:{
    '013_1_mage_ice_orbit':[66,65,86],
    '038_1_mage_arcane_strike':[64,89,71],
    '042_1_mage_earth_strike':[64.5,85.5,78],
    '044_1_mage_fire_strike':[64,86.5,85],
    '050_1_mage_light_strike':[64,89.5,85],
    '051_1_mage_ice_strike':[63.5,87.5,100],
    '069_2_mage_arcane_rain':[64,78,99],
    '077_1_priest_holy_strike':[63.5,89.5,68],
    '079_1_priest_holy_orbit':[63.5,64.5,72],
    '082_2_priest_holy_rain':[63.5,79,98],
    '084_2_priest_holy_storm':[63.5,69,94],
    '090_1_priest_holy_brandburst':[64,73.5,101],
    '094_1_priest_holy_miracle':[63.5,70,96],
    '105_2_archer_ice_trap':[63.5,73.5,102],
    '106_1_archer_phys_strike':[63,74,71],
    '108_2_archer_phys_rain':[64,74.5,93],
    '109_1_archer_storm_strike':[64.5,88.5,60],
    '121_3_archer_phys_stickybomb':[62,68.5,93],
    '124_3_archer_phys_skybow':[65,73,103],
    '136_1_warrior_phys_leap':[63.5,84,90],
    '137_1_warrior_phys_strike':[64,87,93],
    '143_1_archer_fire_eruption':[63.5,72,80],
    '145_1_archer_ice_spike':[63.5,85.5,92],
    '201_1_priest_holy_strike':[63.5,104,88],
    '203_1_priest_holy_strike':[55,114,62],
    '206_1_priest_holy_field':[64,70,82],
    '208_1_priest_holy_field':[64,76,83],
    '209_1_priest_holy_field':[63.5,83,78],
    '211_1_priest_holy_field':[63.5,76.5,88],
    '212_1_priest_holy_field':[64,68,85],
    '215_1_priest_holy_field':[63.5,76.5,80],
    '216_1_priest_holy_nova':[63.5,78.5,98],
    '218_1_priest_holy_nova':[64,84,76],
    '219_1_priest_holy_nova':[64,68.5,95],
    '220_2_priest_holy_rain':[64,87.5,71],
    '222_2_priest_holy_rain':[64,99,97],
    '268_1_mage_fire_field':[64,69,88],
    '276_1_mage_arcane_field':[64,80,66],
    '277_1_mage_ice_nova':[65,70,99],
    '280_1_mage_earth_nova':[63,72,87],
    '282_1_mage_arcane_strike':[64,96,89],
    '317_2_archer_phys_trap':[64,84,66],
    '318_2_archer_phys_trap':[63.5,78.5,88],
    '321_2_archer_phys_trap':[65.5,80,78],
    '346_2_archer_fire_bolt':[64,69,77],
    '370_1_archer_storm_hurricane':[63,80,64]},
  // 부채꼴 띠 → [그림 시작 x, 그림 끝 x] (가장 큰 칸)
  C:{
    '003_1_mage_wind_cone':[21,115],
    '019_1_mage_ice_cone':[24,110],
    '043_1_mage_light_cone':[20,111],
    '074_1_priest_holy_cone':[26,109],
    '115_1_archer_phys_scatter':[26,105],
    '228_1_priest_holy_cone':[28,113],
    '286_1_mage_ice_cone':[18,112],
    '287_1_mage_fire_cone':[27,103],
    '288_1_mage_fire_cone':[23,109]},
  O:new Set(['013_1_mage_ice_orbit','079_1_priest_holy_orbit']),
  n:{img:0,fit:0,cone:0,orb:0},_orb:null,
  g(st){return st&&this.G[st.slice(3)]||null},
  // 묶음마다 한 번: 칸 배열 → 표 값 (FX31.img에는 띠 이름이 안 오므로)
  at(PK,f){let m=PK.fxa;if(!m){m=PK.fxa=new Map();const r=PK.meta&&PK.meta.r||{};for(const st in r){const v=this.g(st);if(v)for(const q of r[st])m.set(q,v)}}return m.get(f)||null}};
// 범위에 맞추는 그림(기준점 x가 64)은 표의 땅 중심을 기준점으로
{const _i=FX31.img;FX31.img=function(c,PK,f,x,y,ax,ay,sx,sy,rot,a){if(ax===64&&f&&PK){const v=FXA.at(PK,f);if(v){ax=v[0];ay=v[1];FXA.n.img++}}return _i.call(this,c,PK,f,x,y,ax,ay,sx,sy,rot,a)}}
// 범위 지름에 맞추는 배율(fit)이 쓰는 폭
{const _v=FX31.visW;FX31.visW=function(PK,st){const v=FXA.g(st);if(v){FXA.n.fit++;return v[2]}return _v.apply(this,arguments)}}
// 부채꼴: 시작점을 그림 시작 x로, 길이를 그림 길이로
{const _a=FX31.add;FX31.add=function(o){const v=o&&o.ax===18&&o.st&&FXA.C[o.st.slice(3)];if(v&&!o.fxa){o.fxa=1;o.sc*=FX31.C*.82/(v[1]-v[0]);o.ax=v[0];FXA.n.cone++}return _a.apply(this,arguments)}}
// 도는 고리: 그림 고리 폭을 도는 반지름에
{const _k=FX31.isoK;FX31.isoK=function(r,cov){const st=FXA._orb;if(cov===.82&&st){const v=FXA.g(st);if(v){FXA.n.orb++;return 2*r*KI*1.4142/v[2]}}return _k.apply(this,arguments)}}
{const _d=FX31.drawAir;FX31.drawAir=function(){const o=P&&P.orbits,m=o&&o.s&&FX31.M[o.s.id];FXA._orb=m&&FXA.O.has(m.b.slice(3))?m.b:null;try{return _d.apply(this,arguments)}finally{FXA._orb=null}}}
// 전사(wfx43 · wfx48): 같은 표로 기준점과 폭
{const _w=WFX.img;WFX.img=function(c,PK,st,f,x,y,ax,ay,sx,sy,rot,a){const v=ax===64&&FXA.g(st);if(v){ax=v[0];ay=v[1];FXA.n.img++}return _w.call(this,c,PK,st,f,x,y,ax,ay,sx,sy,rot,a)}}
{const _b=WFX.bx;WFX.bx=function(PK,st){const b=_b.apply(this,arguments),v=FXA.g(st);if(v&&b&&!b.fxa){b.fxa=1;b.vw=v[2]}return b}}
{const _p=WFX2.pic;WFX2.pic=function(c,PK,st,f,x,y,ax,ay){const v=ax===64&&FXA.g(st);if(v){const A=[...arguments];A[6]=v[0];A[7]=v[1];FXA.n.img++;return _p.apply(this,A)}return _p.apply(this,arguments)}}
window.__fxa=FXA;
