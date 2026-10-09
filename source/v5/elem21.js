/* ---------- v21 GEAR: 몬스터 속성 (사용자 03:05 · MAIN 03:55 결정) ----------
   · 어느 몬스터가 어떤 속성인지는 지역 쪽 표(WX21_EL → TYPES[k].el, wx21-world.js · wx21.js)를 그대로 읽는다. 여기에는 표를 두지 않는다.
     (MAZE 등이 나중에 WX21_EL에 줄을 더해도 그대로 센다: monEl이 그때그때 찾는다)
   · 상성: 불↔냉기 · 벼락↔대지 · 신성↔어둠. 공격 원소는 WX21_ATK로 묶는다(바람=벼락 쪽, 빛=신성 쪽, 봉인·변성·물리는 속성 없음).
     정반대면 ×1.2, 같으면 ×0.8, 나머지는 ×1 (WX21_AMP=.2). 내 공격(마법·화살·소환수·발동 효과)이 몬스터를 때릴 때만, hurtE에서 한 번만 곱한다.
   · 겹치지 않게: 연계(combo20 cbHit) 추가 피해는 그 한 대의 속성 배율을 덜어 낸 값에서 계산한다. 언데드의 신성·빛 두 배(b3.js)가 있으면 속성 배율은 더하지 않는다.
   · 보이기: 대상 칸 이름 앞 속성 점과 「불 속성 · 냉기 +20% · 불 −20%」, 머리 위 작은 점, 도감 몬스터 칸. */
const EL21_FB={opp:{fire:'ice',ice:'fire',storm:'earth',earth:'storm',holy:'dark',dark:'holy'},atk:{fire:'fire',ice:'ice',storm:'storm',wind:'storm',earth:'earth',holy:'holy',light:'holy'},
  n:{fire:'불',ice:'냉기',storm:'벼락',earth:'대지',holy:'신성',dark:'어둠'},col:{fire:'#ff7a2e',ice:'#8fd8ff',storm:'#ffe066',earth:'#c9a46a',holy:'#ffe39a',dark:'#b07aff'},amp:.2};
const EL21={get opp(){return typeof WX21_OPP!=='undefined'?WX21_OPP:EL21_FB.opp},get atk(){return typeof WX21_ATK!=='undefined'?WX21_ATK:EL21_FB.atk},get amp(){return typeof WX21_AMP!=='undefined'?WX21_AMP:EL21_FB.amp},
  get n(){return typeof WX21_ELN!=='undefined'?WX21_ELN:EL21_FB.n},get col(){return typeof WX21_ELCOL!=='undefined'?WX21_ELCOL:EL21_FB.col},f:1,cnt:{up:0,down:0}};
const EL21_ATKN={fire:'불',ice:'냉기',storm:'벼락·바람',earth:'대지',holy:'신성·빛',dark:'어둠'};
function monElK(k){const t=TYPES[k];const v=(t&&t.el)||(typeof WX21_EL!=='undefined'&&WX21_EL[k])||null;return v&&EL21.col[v]?v:null}
function monEl(e){return e&&e.k?monElK(e.k):null}
// 배율: 공격 원소 → 묶음, 몬스터 속성과 정반대 +amp, 같으면 −amp. 언데드 + 신성·빛은 기존 두 배만
function elemMul(atk,mon,undead){const fam=EL21.atk[atk];if(!fam||!mon)return 1;if(undead&&fam==='holy')return 1;const a=EL21.amp;return EL21.opp[fam]===mon?1+a:fam===mon?1-a:1}
{const _he=hurtE;hurtE=function(e,amt,s){if(!e||e.dead||!s||s.ghost||GHOST||!(s.cls||s.proc))return _he.apply(this,arguments);// 내 마법·소환수(cls) · 발동 효과(proc)만
  const me=s.el?monEl(e):null,m=me?elemMul(s.el,me,(TYPES[e.k]||{}).undead):1,f0=EL21.f;EL21.f=m;
  if(m>1)EL21.cnt.up++;else if(m<1)EL21.cnt.down++;
  try{return m===1?_he.apply(this,arguments):_he.call(this,e,amt*m,s)}finally{EL21.f=f0}}}
// 연계 추가 피해: 그 한 대에 곱한 속성 배율을 덜어 낸다 (속성이 두 번 붙지 않게)
if(typeof cbHit==='function'){const _cb=cbHit;cbHit=function(e,amt,col){return _cb.call(this,e,amt/(EL21.f||1),col)}}
function elInfo(el){if(!el)return'';const n=EL21.n,o=EL21.opp[el],pc=Math.round(EL21.amp*100);
  return `${n[el]} 속성 · ${EL21_ATKN[o]||n[o]} 피해 +${pc}%`+(el==='dark'?'':` · ${EL21_ATKN[el]} 피해 −${pc}%`)}
// 대상 칸: 이름 앞 점 + 아래 줄에 속성 글
{const _uh=updateHud;updateHud=function(){_uh.apply(this,arguments);const box=document.getElementById('target');if(!box)return;
  let hv=null;if(!box.hidden){hv=hover;if(!hv){let bd=760;for(const e of enemies)if(e.big&&e.aggroed&&!e.dead){const d=dist(e,P);if(d<bd){bd=d;hv=e}}}}
  const el=hv?monEl(hv):null;if(box.dataset.el21!==(el||'')){box.dataset.el21=el||'';box.classList.toggle('el21',!!el);if(el)box.style.setProperty('--el21',EL21.col[el])}
  if(el){const ts=document.getElementById('tsub');if(ts)ts.textContent+=' · '+elInfo(el)}}}
// 머리 위 작은 속성 점 (보스·준보스는 대상 칸에서)
{const _dl=drawV5Labels;drawV5Labels=function(){_dl.apply(this,arguments);let n=0;
  for(const e of enemies){if(e.dead||e.big||!e._s)continue;const el=monEl(e);if(!el)continue;const s=e._s;if(!onScreen(s,60))continue;const sc=e.sc||(e.elite?1.25:1),x=s.x-15*sc-6,y=s.y-e.r*sc*2.4-8.5;
    ctx.fillStyle='rgba(0,0,0,.75)';ctx.beginPath();ctx.arc(x,y,4.2,0,6.283);ctx.fill();ctx.fillStyle=EL21.col[el];ctx.beginPath();ctx.arc(x,y,3,0,6.283);ctx.fill();if(++n>120)break}}}
// 도감
{const _mi=monInfo;monInfo=function(k){const m=_mi.apply(this,arguments);const el=monElK(k);if(m&&el)m.traits.push(`<span style="color:${EL21.col[el]}">● ${elInfo(el)}</span>`);return m}}
(()=>{const st=document.createElement('style');st.textContent=`#target.el21 #tname::before{content:'';display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--el21,#fff);margin-right:6px;vertical-align:1px;box-shadow:0 0 0 1.5px rgba(0,0,0,.8),0 0 5px var(--el21,#fff)}`;document.head.appendChild(st)})();
setTimeout(()=>{try{window.__elem21={EL21,monEl,monElK,elemMul,elInfo}}catch(_){}},0);
