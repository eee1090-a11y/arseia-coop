/* ---------- v45 성장(30~60) 둘째: 말 40 · 습격/도전 35 · 업적 · 30~60 탐험 기록 · 채집 30 · 1차 기술 변형 ----------
   사용자 2026-10-24 14:37Z 「지금까지 제안된 것 모두 반영해줘」 → 제안 7~12 (1~6은 g45.js).
   · 레벨 문턱은 g42 파일의 값(G42_MT.buy.lv 40 · G42_CHLV 35 · G42_GLV 30)을 바꿨고, 이 파일은 지역 목록에 30~60 지역을 더한다.
   · 지역 목록(G42_EX 탐험 · G42_RD 습격 · G42_GREG 채집)은 const 배열/객체라 push · 키 더하기만 한다(주간 원정 · 「여섯 지역의 기록자」는 g42e의 G42_EX6).
   · 기술 변형: 33 · 42레벨에 1차 기술 하나씩 모양을 바꾼다. 기술 값(cnt · aoe · jumps · rad · mult · cd …)을 읽는 자리에 getter를 걸어
     변형을 고른 캐릭터에게만 바뀐 값을 준다(저장되는 기술 자료는 그대로). 같이 하기에서 동료의 변형은 내 화면에 그림만 다를 수 있다(피해는 시전한 사람이 계산).
   · 저장: P.g45.vr {33:'기술id:a|b', 42:…}(g45Clean이 남김). 없으면 변형 없음. */
const G45B={};
/* ===== 10 탐험 기록 · 8 습격 · 11 채집: 30~60 지역 ===== */
const G45_EX=['desert','highland','ice','jungle','cliffs','lava'];
const G45_EXB={desert:{gs:{ms:1},d:'이동 속도 +1%'},highland:{gs:{mcost:1},d:'마나 소모 −1%'},ice:{gs:{dr:1},d:'받는 피해 −1%'},jungle:{gs:{mk:2},d:'적 처치 시 마나 +2'},cliffs:{gs:{cdr:1},d:'재사용 대기 −1%'},lava:{gs:{crit:1},d:'치명타 +1%'}};
const G45_RD=['desert','highland','ice','canyon','jungle','cliffs','lava','sea'];
const G45_GREG={desert:{herb:.2,ore:.6,cry:.2},highland:{herb:.4,ore:.3,cry:.3},ice:{herb:.2,ore:.2,cry:.6},canyon:{herb:.2,ore:.6,cry:.2},jungle:{herb:.6,ore:.2,cry:.2},
  cliffs:{herb:.3,ore:.3,cry:.4},lava:{herb:.2,ore:.5,cry:.3},sea:{herb:.4,ore:.2,cry:.4},scorch:{herb:.3,ore:.5,cry:.2},abyss:{herb:.2,ore:.3,cry:.5}};
for(const r of G45_EX){if(REGIONS[r]&&!G42_EX.includes(r)){G42_EX.push(r);G42_EXB[r]=G45_EXB[r]}}
for(const r of G45_RD)if(REGIONS[r]&&!G42_RD.includes(r))G42_RD.push(r);
for(const r in G45_GREG)if(REGIONS[r]&&!G42_GREG[r])G42_GREG[r]=G45_GREG[r];
/* ===== 9 30~60 업적 ===== */
const g45CtDone=()=>{if(!P)return 0;const s=sqState();let n=0;for(let i=1;i<=7;i++)if(s.d['ct'+P.cls[0]+i])n++;return n};
const g45Dg3060=()=>{const L=[...DUNGEONS,...(typeof WX_DUNGEONS!=='undefined'?WX_DUNGEONS:[])],by={};for(const d of L)if(d&&d.id!=null)by[d.id]=d;return g42Ac().dg.filter(id=>{const d=by[id];return d&&d.lvl>=30&&d.lvl<60}).length};
const g45Ex100=()=>G45_EX.filter(r=>{const o=P.g42&&P.g42.ex&&P.g42.ex[r];return o&&Array.isArray(o.r)&&o.r.includes(100)}).length;
{const add=(id,n,d,need,cur,grp,pts)=>G42.ach.push({id,n,d,need,cur,grp,pts:pts||10});
  [30,40,50].forEach(L=>add('lv'+L,`${L}레벨`,`${L}레벨 닿기`,L,()=>P.lvl,'성장'));
  add('ct7','위계를 오른 자','1차 위계 시험 일곱 모두 마치기',7,g45CtDone,'성장',20);
  add('job2','두 번째 길','2차 전직 마치기',1,()=>P.job2?1:0,'성장');
  add('tr44','첫 갈림길','1차 숙련 특성 넷 모두 고르기',4,()=>Object.keys(g45S().tr).length,'성장');
  add('br44','갈래의 길','2차 갈래 특성 둘 모두 고르기',2,()=>{const j=P.job2,b=j&&g45S().br[j];return b?Object.keys(b).length:0},'성장');
  add('af44','소속의 이름으로','소속 두 번째 특성 고르기',1,()=>Object.keys(g45S().af).length?1:0,'성장');
  add('vr44','나만의 기술','1차 기술 변형 둘 모두 고르기',2,()=>Object.keys(g45S().vr||{}).length,'성장');
  add('box44','먼 길의 상자','30~55레벨 단계 상자 여섯 모두 받기',6,()=>g42S().box.filter(L=>L<60).length,'성장');
  add('dg45','중간 땅의 정복자','30~59레벨 던전 열 곳의 주인 쓰러뜨리기',10,g45Dg3060,'던전',20);
  add('ex44','여섯 땅의 길잡이','30~60 여섯 지역(사막 · 고원 · 빙원 · 정글 · 절벽 · 용암) 모두 탐험 100%',6,g45Ex100,'세계',30)}
/* ===== 12 1차 기술 변형 (33 · 42레벨, 기술 하나씩 둘 중 하나 모양) =====
   set: 그 값으로 바꿈(0이면 끔) · mul: 원래 값에 곱함(피해 mult · 재사용 cd · 범위 rad 등). 모두 강해지기만 하는 것이 아니라 바꾸는 것(한쪽이 넓으면 약하게). */
const G45_VLV=[33,42];
const G45_VAR={
 mage:{spark:[{n:'세 갈래 불티',d:'불덩이 셋을 부채꼴로 · 하나마다 피해 45%',set:{cnt:3,spread:.22},mul:{mult:.45}},{n:'터지는 불티',d:'맞으면 작게 터짐(둘레 50) · 피해 90%',set:{aoe:50},mul:{mult:.9}}],
  firebolt:[{n:'꿰뚫는 불화살',d:'줄지어 선 적을 꿰뚫음 · 피해 80%',set:{pierce:1},mul:{mult:.8}},{n:'쌍 불화살',d:'둘을 겹쳐 쏨 · 하나마다 피해 60%',set:{cnt:2,spread:.12},mul:{mult:.6}}],
  frostarrow:[{n:'얼음 부채',d:'조각 다섯 · 넓게 · 하나마다 피해 70%',set:{cnt:5,spread:.3},mul:{mult:.7}},{n:'얼음 창',d:'조각 하나로 모아 꿰뚫음 · 피해 220%',set:{cnt:1,spread:0,pierce:1},mul:{mult:2.2}}],
  fireburst:[{n:'큰 폭발',d:'터지는 둘레 130 · 피해 85% · 재사용 1.3배',set:{aoe:130},mul:{mult:.85,cd:1.3}},{n:'빠른 폭발',d:'재사용 0.7배 · 둘레 70 · 피해 85%',set:{aoe:70},mul:{mult:.85,cd:.7}}],
  chainlightning:[{n:'긴 사슬',d:'아홉 번 튐 · 피해 80%',set:{jumps:9},mul:{mult:.8}},{n:'굵은 사슬',d:'네 번만 튐 · 피해 135%',set:{jumps:4},mul:{mult:1.35}}],
  quake:[{n:'넓은 울림',d:'둘레 1.3배 · 피해 85%',mul:{rad:1.3,mult:.85}},{n:'깊은 울림',d:'쓰러뜨림 2.2초 · 피해 90%',set:{stun:2.2},mul:{mult:.9}}]},
 priest:{smite:[{n:'세 줄 심판',d:'빛 셋을 부채꼴로 · 하나마다 피해 45%',set:{cnt:3,spread:.2},mul:{mult:.45}},{n:'꿰뚫는 심판',d:'줄지어 선 적을 꿰뚫음 · 피해 85%',set:{pierce:1},mul:{mult:.85}}],
  javelin:[{n:'쌍 투창',d:'둘을 겹쳐 던짐 · 하나마다 피해 60%',set:{cnt:2,spread:.12},mul:{mult:.6}},{n:'터지는 투창',d:'꿰뚫는 대신 맞은 곳이 터짐(둘레 70) · 피해 90%',set:{pierce:0,aoe:70},mul:{mult:.9}}],
  chainoflight:[{n:'긴 빛 사슬',d:'여덟 번 튐 · 피해 80%',set:{jumps:8},mul:{mult:.8}},{n:'굵은 빛 사슬',d:'세 번만 튐 · 피해 140%',set:{jumps:3},mul:{mult:1.4}}],
  pillaroflight:[{n:'넓은 빛기둥',d:'둘레 150 · 피해 80%',set:{rad:150},mul:{mult:.8}},{n:'좁은 빛기둥',d:'둘레 70 · 피해 130%',set:{rad:70},mul:{mult:1.3}}],
  waveoflight:[{n:'넓은 물결',d:'부채꼴 1.5배 넓게 · 피해 80%',mul:{ang:1.5,mult:.8}},{n:'먼 물결',d:'1.3배 멀리 · 좁게 · 피해 110%',mul:{range:1.3,ang:.7,mult:1.1}}],
  consecration:[{n:'넓은 축성',d:'둘레 140 · 피해 80%',set:{rad:140},mul:{mult:.8}},{n:'긴 축성',d:'7초 동안 · 피해 75%',set:{dur:7},mul:{mult:.75}}]},
 warrior:{slash:[{n:'넓게 베기',d:'앞쪽을 넓게 · 피해 80%',mul:{ang:1.8,mult:.8}},{n:'깊게 베기',d:'좁게 · 피해 125%',mul:{ang:.65,mult:1.25}}],
  thrust:[{n:'두 번 찌르기',d:'두 번 찌름 · 한 번마다 피해 60%',set:{hits:2},mul:{mult:.6}},{n:'멈추는 찌르기',d:'맞은 적 0.5초 멈춤 · 피해 95%',set:{stun:.5},mul:{mult:.95}}],
  doubleslash:[{n:'세 번 베기',d:'세 번 벰 · 한 번마다 피해 70%',set:{hits:3},mul:{mult:.7}},{n:'무거운 두 번',d:'피해 115% · 재사용 1.3배',mul:{mult:1.15,cd:1.3}}],
  sweep:[{n:'밀어내기',d:'더 멀리 밀어냄 · 피해 90%',set:{knock:120},mul:{mult:.9}},{n:'붙잡는 휩쓸기',d:'밀지 않음 · 피해 115%',set:{knock:0},mul:{mult:1.15}}],
  shieldthrow:[{n:'멀리 튀는 방패',d:'다섯 번 튐 · 피해 80%',set:{jumps:5},mul:{mult:.8}},{n:'무거운 방패',d:'두 번만 튐 · 1.2초 멈춤 · 피해 110%',set:{jumps:2,stun:1.2},mul:{mult:1.1}}],
  heavycrash:[{n:'넓은 내려찍기',d:'둘레 160 · 피해 80%',set:{rad:160},mul:{mult:.8}},{n:'한 점 내려찍기',d:'둘레 80 · 피해 130%',set:{rad:80},mul:{mult:1.3}}]},
 archer:{quickshot:[{n:'두 발 쏘기',d:'두 발을 겹쳐 쏨 · 하나마다 피해 60%',set:{cnt:2,spread:.1},mul:{mult:.6}},{n:'꿰뚫는 퀵 샷',d:'줄지어 선 적을 꿰뚫음 · 피해 85%',set:{pierce:1},mul:{mult:.85}}],
  piercearrow:[{n:'세 줄 관통',d:'셋을 부채꼴로 · 하나마다 피해 50%',set:{cnt:3,spread:.15},mul:{mult:.5}},{n:'무거운 관통',d:'피해 130% · 재사용 1.4배',mul:{mult:1.3,cd:1.4}}],
  fanshot:[{n:'넓은 부채',d:'일곱 발 · 넓게 · 하나마다 피해 80%',set:{cnt:7,spread:.26},mul:{mult:.8}},{n:'모은 부채',d:'세 발 · 좁게 · 하나마다 피해 150%',set:{cnt:3,spread:.1},mul:{mult:1.5}}],
  ricochet:[{n:'멀리 튀는 화살',d:'일곱 번 튐 · 피해 80%',set:{jumps:7},mul:{mult:.8}},{n:'무거운 튐',d:'두 번만 튐 · 피해 140%',set:{jumps:2},mul:{mult:1.4}}],
  burstarrow:[{n:'큰 폭발 화살',d:'터지는 둘레 170 · 피해 80%',set:{aoe:170},mul:{mult:.8}},{n:'작은 폭발 화살',d:'둘레 80 · 피해 125%',set:{aoe:80},mul:{mult:1.25}}],
  powershot:[{n:'날려 보내기',d:'더 멀리 밀고 0.8초 멈춤 · 피해 85%',set:{knock:160,stun:.8},mul:{mult:.85}},{n:'꿰뚫는 힘',d:'밀지 않고 꿰뚫음 · 피해 90%',set:{knock:0,stun:0,pierce:1},mul:{mult:.9}}]}};
G45B.vm={};// 지금 캐릭터에게 걸린 변형 {기술id: 변형}
function g45VrClean(o){const vr={};if(v20Obj(o))for(const k in o){const L=k|0,v=String(o[k]),[id,c]=v.split(':');if(!G45_VLV.includes(L)||(c!=='a'&&c!=='b'))continue;let ok=false;for(const cl in G45_VAR)if(G45_VAR[cl][id])ok=true;if(ok)vr[L]=id+':'+c}return vr}
{const _c=g45Clean;g45Clean=function(raw){const o=_c(raw);o.vr=g45VrClean(o.vr);
  const seen={};for(const L of G45_VLV){const v=o.vr[L];if(!v)continue;const id=v.split(':')[0];if(seen[id])delete o.vr[L];else seen[id]=1}return o}}
function g45VarSync(){const m={};if(P){const vr=g45S().vr||{},T=G45_VAR[P.cls]||{};for(const L of G45_VLV){const v=vr[L];if(!v||P.lvl<L)continue;const [id,c]=v.split(':');if(T[id])m[id]=T[id][c==='a'?0:1]}}G45B.vm=m}
// 기술 값에 getter 걸기 (변형이 건드리는 칸만). 다른 코드가 값을 써도 원래 값(base)에 들어간다
{const keys={};for(const cl in G45_VAR)for(const id in G45_VAR[cl]){if(!SPELLS[id])continue;const K=keys[id]=keys[id]||new Set();for(const V of G45_VAR[cl][id]){for(const k in V.set||{})K.add(k);for(const k in V.mul||{})K.add(k)}}
  for(const id in keys){const s=SPELLS[id];for(const k of keys[id]){const d=Object.getOwnPropertyDescriptor(s,k);if(d&&(d.get||!d.configurable))continue;let base=s[k];
    Object.defineProperty(s,k,{configurable:true,enumerable:true,get(){const V=G45B.vm[id];if(!V)return base;if(V.set&&k in V.set)return V.set[k];if(V.mul&&k in V.mul&&typeof base==='number')return base*V.mul[k];return base},set(v){base=v}})}}
  G45B.keys=keys}
{const _ld=load;load=function(){const ok=_ld.apply(this,arguments);try{g45VarSync()}catch(e){if(window.__QA)throw e}return ok}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{g45VarSync()}catch(e){if(window.__QA)throw e}return r}}
{const _gx=gainXp;gainXp=function(n){const l0=P?P.lvl:0;const r=_gx.apply(this,arguments);if(P&&P.lvl!==l0){g45VarSync();if(G45_VLV.some(b=>b>l0&&b<=P.lvl))setTimeout(()=>msg('1차 기술 하나의 모양을 바꿀 수 있습니다 (성장 G · 기술 변형)','#ffb36a'),800)}return r}}
V20A.g45vr=v=>{if(!P)return;const [lv,id,c]=String(v).split(':'),L=lv|0,T=G45_VAR[P.cls];if(!G45_VLV.includes(L)||P.lvl<L||!T||!T[id]||(c!=='a'&&c!=='b'))return;const g=g45S();if(!v20Obj(g.vr))g.vr={};
  const other=G45_VLV.find(x=>x!==L&&g.vr[x]&&g.vr[x].split(':')[0]===id);if(other){msg(`「${SPELLS[id].n}」은 ${other}레벨 변형에 이미 골랐습니다`,'#ff8a5a');return}
  const nv=id+':'+c;if(g.vr[L]===nv)return;if(g.vr[L]){const pr=g45Price();if(P.gold<pr){msg(`금화가 모자랍니다 (${pr.toLocaleString()})`,'#ff8a5a');return}P.gold-=pr;g.trN++}
  g.vr[L]=nv;g45VarSync();const V=T[id][c==='a'?0:1];msg(`기술 변형 「${SPELLS[id].n}」 → ${V.n}: ${V.d}`,'#ffb36a');rings.push({x:P.x,y:P.y,r:10,max:120,life:.7,col:'#ffb36a'});save()};
V20A.g45vrsel=v=>{G45B.sel=String(v)};
function g45VrHtml(){const T=G45_VAR[P.cls];if(!T)return '<p class="muted">이 직업은 기술 변형이 없습니다.</p>';const g=g45S(),vr=g.vr||{},pr=g45Price();
  let h=`<div class="v20box"><h3>1차 기술 변형 <span class="muted">33 · 42레벨에 1차 기술 하나씩 · 둘 중 한 모양 · 같은 기술은 한 번만</span></h3><p class="muted" style="margin:2px 0">한쪽이 넓어지면 하나하나는 약해지는 식으로, 기술의 쓰임새를 바꿉니다. 처음은 공짜, 바꾸면 금화 ${pr.toLocaleString()}.</p>`;
  for(const L of G45_VLV){const cur=vr[L],open=P.lvl>=L,[cid,cc]=cur?cur.split(':'):[];
    h+=`<div class="v20row"><div style="flex-basis:100%"><b>${L}레벨</b>${cur?` <span style="color:#ffb36a">「${v20Esc(SPELLS[cid]?SPELLS[cid].n:cid)}」 → ${v20Esc(T[cid][cc==='a'?0:1].n)}</span>`:open?' <span style="color:#ffd76a">고르기</span>':` <span class="muted">${L-P.lvl}레벨 남음</span>`}</div></div>`;
    for(const id in T){const s=SPELLS[id];if(!s)continue;const used=G45_VLV.find(x=>x!==L&&vr[x]&&vr[x].split(':')[0]===id);
      h+=`<div class="v20row" style="opacity:${open&&!used?1:.5}"><div style="flex-basis:100%;font-size:12px"><b>${v20Esc(s.n)}</b>${used?` <span class="muted">(${used}레벨에 고름)</span>`:''}${(P.sk[id]|0)?'':' <span class="muted">· 아직 안 배움</span>'}</div>`;
      T[id].forEach((V,ix)=>{const k=ix?'b':'a',on=cur===id+':'+k;h+=`<div style="flex:1 1 200px"><b style="color:${on?'#ffb36a':'#efe2c0'}">${on?'✔ ':''}${v20Esc(V.n)}</b> <span class="muted" style="font-size:12px">${v20Esc(V.d)}</span><div class="btns" style="margin-top:3px">${on?'<button type="button" disabled>고름</button>':v20Btn('g45vr',`${L}:${id}:${k}`,cur?`바꾸기 (금화 ${pr.toLocaleString()})`:'고르기',{dis:!open||!!used})}</div></div>`});
      h+='</div>'}}
  return h+'</div>'}
const g45VrPend=()=>!!(P&&G45_VAR[P.cls]&&G45_VLV.some(L=>P.lvl>=L&&!(g45S().vr||{})[L]));
{const i=G42.tabs.findIndex(t=>t.k==='trait');G42.tabs.splice(i+1,0,{k:'var',n:'기술 변형',html:()=>g45VrHtml(),dot:g45VrPend})}
// 기술 설명 창(itemTip/skill tip)에서 변형을 알 수 있게: 이름 옆에 붙임
G45B.label=id=>{const V=G45B.vm[id];return V?V.n:''};
{const _n=g45NextLv;g45NextLv=function(){const m=_n();const v=G45_VLV.find(L=>L>P.lvl);if(v&&G45_VAR[P.cls]&&(!m||v<m[0]))return [v,`${v}레벨 기술 변형`];return m}}
Object.assign(window.__g45,{G45B,G45_VAR,G45_VLV,G45_EX,G45_RD,G45_GREG,g45VarSync,g45VrHtml,g45CtDone,g45Dg3060});
/* 스킬 배우는 레벨 5단위(사용자): b1 RANK_LV · job2d RANK_LV_J2 · skill19 ADV_LV(상위 기술 50 · 55가 마지막) 표를 바꿨다. 「기술 v45」 시험. */
