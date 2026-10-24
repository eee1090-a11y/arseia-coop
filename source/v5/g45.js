/* ---------- v45 성장(30~60): 1차 숙련 특성 · 2차 갈래 특성 · 30~55 단계 상자 · 소속 두 번째 특성 ----------
   사용자 2026-10-24 「30레벨부터 60레벨까지도 몇 레벨별로 강해질 수 있는 선택지 … 60-100구간과 유사하게」 → 제안 1~6 「모두 반영」.
   설계 문서: https://claude.ai/artifact/TVdjs48SjeEeSfCubtne4f · 수치 기록: rpg/growth-30-60/설정-기록-추가분.md
   · g42c.js(성장 창 · 숙련 특성 · 상자) 뒤에 붙는다. 휴식 · 연속 사냥 30레벨부터는 g42c.js G42_LV, 필요 경험치는 b2.js xpCut45 · xp21.js xpMig45.
   · 저장: P.g45 하나(없으면 기본값 · 모르는 칸은 그대로 다시 쓴다). 저장 키 · 다른 칸은 건드리지 않는다.
   · 특성은 모두 덧셈이고 기존 상한 안에서 센다(g42 숙련 특성과 같은 칸 gs · dmg · heal · hp · mp · regen). */
const G45={qa:{}};
const G45_TRLV=[30,35,40,45];// 1차 숙련 특성(전직 없이)
const G45_BRLV=[50,55];// 2차 갈래 특성(2차 전직 뒤 · 갈래마다 따로 고름)
const G45_AFLV=40;// 소속 두 번째 특성
const G45_BOX=[30,35,40,45,50,55];
const G45_BOXT={40:'먼 길의 견습생',50:'두 번째 길을 연 자'};
/* 상자: g42 상자 목록 앞에 30~55를 더한다(g42Clean이 이 목록으로 거른다 · 금화 레벨×250 · 희귀 장비 · 물약은 그대로) */
for(const L of G45_BOX.slice().reverse())if(!G42_BOX.includes(L))G42_BOX.unshift(L);
for(const L in G45_BOXT){G42_BOXT[L]=G45_BOXT[L];V20.titles.push({id:'g42box'+L,n:G45_BOXT[L],col:'#ffd76a',src:`${L}레벨 단계 상자`,have:()=>!!(P&&g42S().box.includes(+L))})}
{const a=G42.ach.find(x=>x.id==='box9');if(a){a.d='60레벨부터의 레벨 단계 상자 9개 모두 받기';a.cur=()=>g42S().box.filter(L=>L>=60).length}}
/* ===== 저장 칸 ===== */
function g45Clean(raw){const o=v20Obj(raw)?Object.assign({},raw):{};const ab=v=>v==='a'||v==='b';
  const tr={};if(v20Obj(o.tr))for(const k in o.tr){const L=k|0;if(G45_TRLV.includes(L)&&ab(o.tr[k]))tr[L]=o.tr[k]}o.tr=tr;
  const br={};if(v20Obj(o.br))for(const j in o.br){if(!G45_BR[j]||!v20Obj(o.br[j]))continue;const m={};for(const k in o.br[j]){const L=k|0;if(G45_BRLV.includes(L)&&ab(o.br[j][k]))m[L]=o.br[j][k]}br[j]=m}o.br=br;
  const af={};if(v20Obj(o.af))for(const id in o.af)if(G45_AF[id]&&ab(o.af[id]))af[id]=o.af[id];o.af=af;
  o.trN=Number.isFinite(+o.trN)?Math.max(0,+o.trN|0):0;return o}
const g45S=()=>{if(!P)return g45Clean(null);if(!v20Obj(P.g45)||!v20Obj(P.g45.tr)||!v20Obj(P.g45.br)||!v20Obj(P.g45.af))P.g45=g45Clean(P.g45);return P.g45};
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P)d.g45=g45Clean(P.g45)}catch(e){if(window.__QA)throw e}return d}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok){try{P.g45=g45Clean(d&&d.g45)}catch(e){if(window.__QA)throw e;P.g45=g45Clean(null)}v20GsBump()}return ok}}
{const _ng=newGame;newGame=function(cls,slot){const r=_ng.apply(this,arguments);if(P)P.g45=g45Clean(null);v20GsBump();return r}}
/* ===== 1 1차 숙련 특성 (30 · 35 · 40 · 45, 60레벨 특성의 절반쯤) ===== */
const G45_TR={
 mage:[[{n:'불씨 다루기',d:'화염 · 대기 · 벼락 피해 +3%',gs:{el_fire:3,el_wind:3,el_storm:3}},{n:'서리 다루기',d:'물과 얼음 · 대지 피해 +3%',gs:{el_ice:3,el_earth:3}}],
  [{n:'가벼운 주문',d:'마나 소모 −2%',gs:{mcost:2}},{n:'고요한 숨',d:'마나 회복 +4%',regen:.04}],
  [{n:'매서운 눈길',d:'치명타 +1%',gs:{crit:1}},{n:'익숙한 손놀림',d:'재사용 대기 −2%',gs:{cdr:2}}],
  [{n:'질긴 견습생',d:'기본 생명력 +4%',hp:.04},{n:'마력 껍질',d:'받는 피해 −2%',gs:{dr:2}}]],
 priest:[[{n:'작은 심판',d:'신성 피해 +3%',gs:{el_holy:3}},{n:'다정한 손',d:'내 치유량 +3%',heal:.03}],
  [{n:'짧은 기도',d:'마나 소모 −2%',gs:{mcost:2}},{n:'고요한 숨',d:'마나 회복 +4%',regen:.04}],
  [{n:'밝아지는 눈',d:'치명타 +1%',gs:{crit:1}},{n:'이어 외우기',d:'재사용 대기 −2%',gs:{cdr:2}}],
  [{n:'질긴 순례자',d:'기본 생명력 +4%',hp:.04},{n:'믿음의 껍질',d:'받는 피해 −2%',gs:{dr:2}}]],
 warrior:[[{n:'힘 싣기',d:'물리 피해 +3%',gs:{pdmg:3}},{n:'방패 익히기',d:'막기 확률 +2%',gs:{blk:2}}],
  [{n:'고른 숨',d:'마나 소모 −2%',gs:{mcost:2}},{n:'굳은살',d:'기본 생명력 +4%',hp:.04}],
  [{n:'빈틈 노리기',d:'치명타 +1%',gs:{crit:1}},{n:'버티기',d:'받는 피해 −2%',gs:{dr:2}}],
  [{n:'빠른 칼',d:'공격 속도 +2%',gs:{ias:2}},{n:'흘려 넘기기',d:'회피 확률 +1%',gs:{eva:1}}]],
 archer:[[{n:'곧은 화살',d:'물리 피해 +3%',gs:{pdmg:3}},{n:'원소 깃',d:'화염 · 물과 얼음 · 대기 · 벼락 피해 +3%',gs:{el_fire:3,el_ice:3,el_wind:3,el_storm:3}}],
  [{n:'고른 숨',d:'마나 소모 −2%',gs:{mcost:2}},{n:'날랜 몸',d:'회피 확률 +1%',gs:{eva:1}}],
  [{n:'과녁 보기',d:'치명타 +1%',gs:{crit:1}},{n:'손에 익은 시위',d:'재사용 대기 −2%',gs:{cdr:2}}],
  [{n:'잰 손',d:'공격 속도 +2%',gs:{ias:2}},{n:'질긴 가죽',d:'기본 생명력 +4%',hp:.04}]]};
/* ===== 2 2차 갈래 특성 (50 · 55, 갈래마다 다름 · 60레벨 특성과 비슷한 크기) ===== */
const G45_BR={
 archmage:[[{n:'원소 조율',d:'화염 · 물과 얼음 · 벼락 피해 +4%',gs:{el_fire:4,el_ice:4,el_storm:4}},{n:'넓은 마력',d:'기본 마나 +5%',mp:.05}],
  [{n:'마력 집중',d:'마법 피해 +3%',dmg:.03},{n:'서두르는 영창',d:'재사용 대기 −2%',gs:{cdr:2}}]],
 summoner:[[{n:'봉인의 결',d:'봉인 · 공간 피해 +4%',gs:{el_arcane:4}},{n:'질긴 계약자',d:'기본 생명력 +5%',hp:.05}],
  [{n:'계약의 힘',d:'마법 피해 +3%',dmg:.03},{n:'되찾는 마나',d:'적 처치 시 마나 +4',gs:{mk:4}}]],
 inquisitor:[[{n:'심문의 빛',d:'신성 피해 +4%',gs:{el_holy:4}},{n:'꿰뚫는 판결',d:'치명타 +2%',gs:{crit:2}}],
  [{n:'단죄',d:'마법 피해 +3%',dmg:.03},{n:'쉬지 않는 심문',d:'재사용 대기 −2%',gs:{cdr:2}}]],
 archbishop:[[{n:'축복의 손',d:'내 치유량 +4%',heal:.04},{n:'넓은 샘',d:'기본 마나 +5%',mp:.05}],
  [{n:'은총의 물결',d:'마나 회복 +6%',regen:.06},{n:'수호의 기도',d:'받는 피해 −2%',gs:{dr:2}}]],
 guardian:[[{n:'방패벽',d:'막기 확률 +2%',gs:{blk:2}},{n:'두꺼운 갑옷',d:'받는 피해 −3%',gs:{dr:3}}],
  [{n:'성채',d:'기본 생명력 +5%',hp:.05},{n:'반격의 힘',d:'물리 피해 +3%',gs:{pdmg:3}}]],
 berserker:[[{n:'광포',d:'물리 피해 +4%',gs:{pdmg:4}},{n:'피 맛보기',d:'피해의 1% 생명력 흡수',gs:{ls:1}}],
  [{n:'몰아치기',d:'공격 속도 +3%',gs:{ias:3}},{n:'급소 베기',d:'치명타 +2%',gs:{crit:2}}]],
 hawkeye:[[{n:'매의 집중',d:'물리 피해 +4%',gs:{pdmg:4}},{n:'먼 과녁',d:'치명타 +2%',gs:{crit:2}}],
  [{n:'잇는 시위',d:'공격 속도 +3%',gs:{ias:3}},{n:'장전 다듬기',d:'재사용 대기 −2%',gs:{cdr:2}}]],
 ranger:[[{n:'숲의 화살',d:'화염 · 물과 얼음 · 대기 · 벼락 피해 +4%',gs:{el_fire:4,el_ice:4,el_wind:4,el_storm:4}},{n:'날랜 발',d:'이동 속도 +3%',gs:{ms:3}}],
  [{n:'덫꾼의 손',d:'마나 소모 −3%',gs:{mcost:3}},{n:'질긴 몸',d:'기본 생명력 +5%',hp:.05}]]};
const G45_BRN={archmage:'아크메이지',summoner:'서머너',inquisitor:'대심문관',archbishop:'대주교',guardian:'가디언 나이트',berserker:'버서커',hawkeye:'호크아이',ranger:'레인저'};
/* ===== 5 소속 두 번째 특성 (40레벨, 16레벨에 고른 소속마다 둘 중 하나) ===== */
const G45_AF={
 academy:[{n:'마법원의 서고',d:'마법 피해 +3%',dmg:.03},{n:'버티는 마력',d:'기본 마나 +5%',mp:.05}],
 ceres:[{n:'바람의 탑',d:'이동 속도 +3%',gs:{ms:3}},{n:'빠른 손끝',d:'재사용 대기 −2%',gs:{cdr:2}}],
 redtower:[{n:'피의 영창',d:'치명타 +2%',gs:{crit:2}},{n:'붉은 피부',d:'기본 생명력 +5%',hp:.05}],
 aurel:[{n:'여명의 손길',d:'내 치유량 +3%',heal:.03},{n:'새벽 샘',d:'마나 회복 +6%',regen:.06}],
 mordin:[{n:'안식의 빛',d:'신성 피해 +4%',gs:{el_holy:4}},{n:'무덤지기의 옷',d:'받는 피해 −2%',gs:{dr:2}}],
 nella:[{n:'물결 걸음',d:'이동 속도 +3%',gs:{ms:3}},{n:'밀물 기도',d:'재사용 대기 −2%',gs:{cdr:2}}],
 knights:[{n:'기사의 맹세',d:'받는 피해 −2%',gs:{dr:2}},{n:'기사의 몸',d:'기본 생명력 +5%',hp:.05}],
 steel:[{n:'강철 주먹',d:'물리 피해 +3%',gs:{pdmg:3}},{n:'강철 살갗',d:'받는 피해 −2%',gs:{dr:2}}],
 kazdun:[{n:'룬 날',d:'치명타 +2%',gs:{crit:2}},{n:'가벼운 손잡이',d:'공격 속도 +3%',gs:{ias:3}}],
 patrol:[{n:'순찰대의 눈',d:'치명타 +2%',gs:{crit:2}},{n:'순찰대의 화살',d:'물리 피해 +3%',gs:{pdmg:3}}],
 steppe:[{n:'초원의 바람',d:'이동 속도 +3%',gs:{ms:3}},{n:'말 등의 몸놀림',d:'회피 확률 +2%',gs:{eva:2}}],
 silvaren:[{n:'노래하는 숨',d:'마나 소모 −3%',gs:{mcost:3}},{n:'노래꾼의 깃',d:'화염 · 물과 얼음 · 대기 · 벼락 피해 +4%',gs:{el_fire:4,el_ice:4,el_wind:4,el_storm:4}}]};
/* ===== 고른 특성 모으기 · 능력치에 더하기 ===== */
const g45Pick=(o,c)=>o&&o[c==='a'?0:1];
const g45Br=()=>P&&P.job2&&G45_BR[P.job2]?P.job2:null;
const g45Aff=()=>{const a=typeof affCur==='function'?affCur():null;return a&&G45_AF[a.id]?a:null};
function g45List(){if(!P)return [];const g=g45S(),out=[],T=G45_TR[P.cls];
  if(T)G45_TRLV.forEach((L,i)=>{const c=g.tr[L];if(c&&P.lvl>=L&&T[i])out.push(g45Pick(T[i],c))});
  const j=g45Br();if(j&&g.br[j])G45_BRLV.forEach((L,i)=>{const c=g.br[j][L];if(c&&P.lvl>=L)out.push(g45Pick(G45_BR[j][i],c))});
  const a=g45Aff();if(a&&P.lvl>=G45_AFLV&&g.af[a.id])out.push(g45Pick(G45_AF[a.id],g.af[a.id]));
  return out.filter(Boolean)}
V20.gsAdd.push(x=>{for(const t of g45List()){if(t.gs)for(const k in t.gs)x[k]=(x[k]||0)+t.gs[k];const C=CLASSES[P.cls];
  if(t.hp)x.hp=(x.hp||0)+Math.round((40+P.lvl*12)*C.hp*t.hp);if(t.mp)x.mp=(x.mp||0)+Math.round((20+P.lvl*5)*C.mp*t.mp);if(t.regen)x.regen=(x.regen||0)+Math.round(v20RegenPct(x,t.regen)*10)/10}});
V20.dmgAdd.push(()=>{let v=0;for(const t of g45List())if(t.dmg)v+=t.dmg;return v});
V20.healK.push(()=>{let v=0;for(const t of g45List())if(t.heal)v+=t.heal;return v});
/* ===== 고르기 · 바꾸기 (처음은 공짜 · 바꾸면 금화 1,000 + 레벨×50) ===== */
const g45Price=()=>1000+P.lvl*50;
function g45Set(box,key,c,t){if(box[key]===c)return false;if(box[key]){const pr=g45Price();if(P.gold<pr){msg(`금화가 모자랍니다 (${pr.toLocaleString()})`,'#ff8a5a');return false}P.gold-=pr;g45S().trN++}
  box[key]=c;v20GsBump();msg(`특성 「${t.n}」: ${t.d}`,'#c9b4ff');rings.push({x:P.x,y:P.y,r:10,max:120,life:.7,col:'#c9b4ff'});save();return true}
V20A.g45tr=v=>{if(!P)return;const [lv,c]=String(v).split(':'),L=lv|0,i=G45_TRLV.indexOf(L),T=G45_TR[P.cls];if(i<0||!T||P.lvl<L||(c!=='a'&&c!=='b'))return;g45Set(g45S().tr,L,c,g45Pick(T[i],c))};
V20A.g45br=v=>{const j=g45Br();if(!j)return;const [lv,c]=String(v).split(':'),L=lv|0,i=G45_BRLV.indexOf(L);if(i<0||P.lvl<L||(c!=='a'&&c!=='b'))return;const g=g45S();if(!v20Obj(g.br[j]))g.br[j]={};g45Set(g.br[j],L,c,g45Pick(G45_BR[j][i],c))};
V20A.g45af=c=>{const a=g45Aff();if(!a||P.lvl<G45_AFLV||(c!=='a'&&c!=='b'))return;g45Set(g45S().af,a.id,c,g45Pick(G45_AF[a.id],c))};
/* 아직 고르지 않은 것 (성장 창 점 · 레벨업 알림) */
function g45Pend(){if(!P)return 0;const g=g45S();let n=0;if(G45_TR[P.cls])n+=G45_TRLV.filter(L=>P.lvl>=L&&!g.tr[L]).length;
  const j=g45Br();if(j)n+=G45_BRLV.filter(L=>P.lvl>=L&&!(g.br[j]&&g.br[j][L])).length;const a=g45Aff();if(a&&P.lvl>=G45_AFLV&&!g.af[a.id])n++;return n}
/* ===== 「숙련 특성」 칸: 30~55 특성을 60~95 특성 위에 ===== */
function g45Row(lv,opts,cur,act,open,price){let h=`<div class="v20row"><div style="flex-basis:100%"><b>${lv}레벨</b>${cur?'':open?' <span style="color:#ffd76a">고르기</span>':` <span class="muted">${Math.max(0,lv-P.lvl)}레벨 남음</span>`}</div>`;
  ['a','b'].forEach((k,ix)=>{const t=opts[ix],on=cur===k;h+=`<div style="flex:1 1 200px;opacity:${open?1:.55}"><b style="color:${on?'#c9b4ff':'#efe2c0'}">${on?'✔ ':''}${v20Esc(t.n)}</b> <span class="muted" style="font-size:12px">${v20Esc(t.d)}</span><div class="btns" style="margin-top:3px">${on?'<button type="button" disabled>고름</button>':v20Btn(act.a,act.v(k),cur?`바꾸기 (금화 ${price.toLocaleString()})`:'고르기',{dis:!open})}</div></div>`});
  return h+'</div>'}
function g45TrHtml(){if(!P)return '';const g=g45S(),T=G45_TR[P.cls],pr=g45Price();let h='';
  if(T){h+=`<div class="v20box"><h3>1차 숙련 특성 <span class="muted">30 · 35 · 40 · 45레벨, 둘 중 하나 · 모두 덧셈</span></h3>`;
    G45_TRLV.forEach((L,i)=>{h+=g45Row(L,T[i],g.tr[L],{a:'g45tr',v:k=>L+':'+k},P.lvl>=L,pr)});h+='</div>'}
  const j=g45Br();h+=`<div class="v20box"><h3>2차 갈래 특성 <span class="muted">50 · 55레벨, 갈래마다 둘 중 하나</span></h3>`;
  if(!j)h+='<p class="muted">2차 전직을 마치면 고를 수 있습니다. 갈래를 바꾸면 새 갈래의 특성을 처음부터(공짜로) 고릅니다.</p>';
  else{h+=`<p class="muted" style="margin:2px 0">${v20Esc(G45_BRN[j]||'')}</p>`;G45_BRLV.forEach((L,i)=>{h+=g45Row(L,G45_BR[j][i],g.br[j]&&g.br[j][L],{a:'g45br',v:k=>L+':'+k},P.lvl>=L,pr)})}
  h+='</div>';const a=g45Aff();h+=`<div class="v20box"><h3>소속 두 번째 특성 <span class="muted">${G45_AFLV}레벨, 내 소속에서 둘 중 하나</span></h3>`;
  if(!a)h+=`<p class="muted">16레벨부터 스승에게 받는 소속 의뢰로 소속을 고르면, ${G45_AFLV}레벨에 그 소속의 두 번째 특성을 고를 수 있습니다.</p>`;
  else{h+=`<p class="muted" style="margin:2px 0">${v20Esc(a.n)} · 첫 특성: ${v20Esc(a.fx)}</p>`+g45Row(G45_AFLV,G45_AF[a.id],g.af[a.id],{a:'g45af',v:k=>k},P.lvl>=G45_AFLV,pr)}
  const pend=g45Pend();return (pend?`<p style="color:#ffd76a;margin:2px 0">30~55레벨에서 고르지 않은 특성 ${pend}개</p>`:'')+h+'</div>'}
{const _h=g42TrHtml;g42TrHtml=function(){let a='';try{a=g45TrHtml()}catch(e){if(window.__QA)throw e}return a+(_h()||'')}}
{const t=G42.tabs.find(x=>x.k==='trait');if(t){const _d=t.dot;t.html=()=>g42TrHtml()||'<p class="muted">이 직업은 숙련 특성이 없습니다.</p>';t.dot=()=>g45Pend()>0||!!(_d&&_d())}}
{const _b=g42BoxHtml;g42BoxHtml=function(){return _b().replace('60레벨부터 5레벨마다','30레벨부터 5레벨마다')}}
/* ===== 다음 성장 길잡이: 55레벨 아래에서도 특성 · 상자를 알려 준다 ===== */
function g45NextLv(){if(!P)return null;const c=[];const t=G45_TRLV.find(L=>L>P.lvl);if(t&&G45_TR[P.cls])c.push([t,`${t}레벨 숙련 특성`]);
  if(P.lvl<G45_AFLV&&P.aff)c.push([G45_AFLV,`${G45_AFLV}레벨 소속 두 번째 특성`]);const b=G45_BRLV.find(L=>L>P.lvl);if(b&&P.lvl>=J2LV-5)c.push([b,`${b}레벨 갈래 특성`]);
  const x=G42_BOX.find(L=>L>P.lvl&&L<60);if(x)c.push([x,`${x}레벨 단계 상자`]);c.sort((a,b2)=>a[0]-b2[0]);return c[0]||null}
{const _n=g42Next;g42Next=function(){const s=_n();if(!P||P.lvl>=55)return s;const m=g45NextLv();if(!m)return s;const L=+(String(s).match(/^(\d+)레벨/)||[])[1];return !s||!(L<=m[0])?m[1]:s}}
/* 레벨업 알림 (55 아래 · g42는 55부터 알림) */
{const _gx=gainXp;gainXp=function(n){const l0=P?P.lvl:0;const r=_gx.apply(this,arguments);if(P&&P.lvl>l0){const L=P.lvl,hit=a=>a.some(b=>b>l0&&b<=L);
  if((G45_TR[P.cls]&&hit(G45_TRLV))||(g45Br()&&hit(G45_BRLV))||(g45Aff()&&hit([G45_AFLV])))setTimeout(()=>msg('새 특성을 고를 수 있습니다 (성장 G · 숙련 특성)','#c9b4ff'),700);
  if(L<55){const nx=g42Next();if(nx)setTimeout(()=>msg(`다음: ${nx}`,'#d6b262'),900)}}return r}}
window.__g45=Object.assign(window.__g45||{},{G45,g45S,g45Clean,g45List,g45Pend,g45Price,g45TrHtml,g45NextLv,G45_TR,G45_BR,G45_AF,G45_TRLV,G45_BRLV,G45_AFLV,G45_BOX});
