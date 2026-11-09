/* ---------- v57 후보 · 1차 묶음 셋째: 100~140 성장 (나-1 3차 숙련 특성 · 나-2 레벨 단계 상자 · 나-4 100~140 탐험 기록) ----------
   사용자 2026-11-07 「100레벨 이후의 성장 컨텐츠가 부족해」 → 제안 「모두 추천대로」. 60~100에서 하던 「몇 레벨마다 고르고 받는」 재미를 140까지 잇는다.
   · 나-1 3차 숙련 특성: 3차 전직 뒤 105 · 110 · 115 · 120 · 125 · 130 · 135레벨에 둘 중 하나(직업마다 다름). 모두 덧셈 · 기존 상한 안(g42c.js 숙련 특성과 같은 칸).
     바꾸기는 금화 5,000 + (레벨−100)×300.
   · 나-2 레벨 단계 상자: 105~140, 5레벨마다(8번). 희귀 장비 하나 · 금화 레벨×300 · 물약 6개씩 · 재의 결정 레벨÷10. 110 · 120 · 130 · 140에 칭호.
   · 둘 다 성장(G) 창 「3차 성장」 칸. 저장은 P.g100.tr {레벨:'a'|'b'} · P.g100.bx [받은 레벨] (P.g42와 따로 · 옛 판이 g42 칸을 정리해도 안 지워지게).
   · 나-4 탐험 기록: g42e.js 탐험(숨은 곳 8 · 그 땅 던전 보스 · 마을 의뢰 · 현상금 3 · 정예 10)에 100~140 땅 여섯을 더한다
     (재가 내리는 고원 · 불 꺼진 왕도 · 유리얼음 호수 · 구름 첨봉 · 대강 밀림 · 오로라 빙관). 25 · 50 · 75 · 100%에 그 레벨 필요 경험치의 30 · 35 · 40 · 50%(140이면 룬 각인으로),
     100%에 땅마다 작은 영구 능력치. 저장은 g42e.js 그대로 P.g42.ex[땅] (g42Clean이 건드리지 않는 칸). */
const G100G={trLv:[105,110,115,120,125,130,135],bx:[105,110,115,120,125,130,135,140],bxT:{110:'세 번째 길의 걸음',120:'재 너머의 손님',130:'별 아래 선 자',140:'백마흔 번째 걸음'}};
const G100_TR={
 mage:[[{n:'대마법의 숨',d:'마법 피해 +4%',dmg:.04},{n:'원소의 계약',d:'화염 · 물과 얼음 · 대기 · 벼락 · 대지 피해 +6%',gs:{el_fire:6,el_ice:6,el_wind:6,el_storm:6,el_earth:6}}],
  [{n:'고요한 영창',d:'재사용 대기 −3%',gs:{cdr:3}},{n:'마르지 않는 샘',d:'마나 회복 +10%',regen:.1}],
  [{n:'별을 읽는 눈',d:'치명타 +2%',gs:{crit:2}},{n:'아끼는 마력',d:'마나 소모 −4%',gs:{mcost:4}}],
  [{n:'마력 장막',d:'받는 피해 −3%',gs:{dr:3}},{n:'단련된 몸',d:'기본 생명력 +7%',hp:.07}],
  [{n:'공간을 접는 걸음',d:'이동 속도 +4%',gs:{ms:4}},{n:'되찾는 마나',d:'적 처치 시 마나 +8',gs:{mk:8}}],
  [{n:'봉인과 빛',d:'봉인·공간 · 빛 · 변성 피해 +8%',gs:{el_arcane:8,el_light:8,el_life:8}},{n:'깊은 그릇',d:'기본 마나 +10%',mp:.1}],
  [{n:'대마법사의 경지',d:'마법 피해 +5%',dmg:.05},{n:'시간을 쥔 손',d:'재사용 대기 −4%',gs:{cdr:4}}]],
 priest:[[{n:'집행의 빛',d:'신성 피해 +6%',gs:{el_holy:6}},{n:'성자의 손길',d:'내 치유량 +6%',heal:.06}],
  [{n:'끊이지 않는 기도',d:'재사용 대기 −3%',gs:{cdr:3}},{n:'마르지 않는 샘',d:'마나 회복 +10%',regen:.1}],
  [{n:'밝은 눈',d:'치명타 +2%',gs:{crit:2}},{n:'아끼는 기도',d:'마나 소모 −4%',gs:{mcost:4}}],
  [{n:'믿음의 갑옷',d:'받는 피해 −3%',gs:{dr:3}},{n:'단련된 몸',d:'기본 생명력 +7%',hp:.07}],
  [{n:'빛의 칼날',d:'마법 피해 +4%',dmg:.04},{n:'넘치는 은총',d:'내 치유량 +6%',heal:.06}],
  [{n:'생명의 빛',d:'피해의 1% 생명력 흡수',gs:{ls:1}},{n:'순례의 걸음',d:'이동 속도 +4%',gs:{ms:4}}],
  [{n:'빛의 집행자',d:'마법 피해 +5%',dmg:.05},{n:'성자의 경지',d:'내 치유량 +7%',heal:.07}]],
 warrior:[[{n:'성벽 같은 자세',d:'막기 확률 +3%',gs:{blk:3}},{n:'전쟁의 함성',d:'물리 피해 +6%',gs:{pdmg:6}}],
  [{n:'몸에 밴 기술',d:'재사용 대기 −3%',gs:{cdr:3}},{n:'아끼는 숨',d:'마나 소모 −4%',gs:{mcost:4}}],
  [{n:'급소 찌르기',d:'치명타 +2%',gs:{crit:2}},{n:'빠른 손',d:'공격 속도 +4%',gs:{ias:4}}],
  [{n:'버티는 몸',d:'받는 피해 −3%',gs:{dr:3}},{n:'거인의 몸',d:'기본 생명력 +8%',hp:.08}],
  [{n:'피의 맛',d:'피해의 1% 생명력 흡수',gs:{ls:1}},{n:'몸 비틀기',d:'회피 확률 +2%',gs:{eva:2}}],
  [{n:'진군',d:'이동 속도 +4%',gs:{ms:4}},{n:'되찾는 숨',d:'적 처치 시 마나 +8',gs:{mk:8}}],
  [{n:'성벽의 군주',d:'받는 피해 −4%',gs:{dr:4}},{n:'전쟁군주',d:'물리 피해 +7%',gs:{pdmg:7}}]],
 archer:[[{n:'신궁의 시위',d:'물리 피해 +6%',gs:{pdmg:6}},{n:'원소 화살',d:'화염 · 물과 얼음 · 대기 · 벼락 피해 +6%',gs:{el_fire:6,el_ice:6,el_wind:6,el_storm:6}}],
  [{n:'빠른 장전',d:'재사용 대기 −3%',gs:{cdr:3}},{n:'아끼는 숨',d:'마나 소모 −4%',gs:{mcost:4}}],
  [{n:'매의 눈',d:'치명타 +2%',gs:{crit:2}},{n:'빠른 시위',d:'공격 속도 +4%',gs:{ias:4}}],
  [{n:'그림자 걸음',d:'회피 확률 +2%',gs:{eva:2}},{n:'질긴 몸',d:'기본 생명력 +7%',hp:.07}],
  [{n:'피의 맛',d:'피해의 1% 생명력 흡수',gs:{ls:1}},{n:'가죽 갑옷 다루기',d:'받는 피해 −3%',gs:{dr:3}}],
  [{n:'바람의 걸음',d:'이동 속도 +4%',gs:{ms:4}},{n:'되찾는 숨',d:'적 처치 시 마나 +8',gs:{mk:8}}],
  [{n:'신궁의 경지',d:'물리 피해 +7%',gs:{pdmg:7}},{n:'그림자 사냥꾼',d:'치명타 +3%',gs:{crit:3}}]]};
const g100TrOn=()=>!!(P&&P.job3&&G100_TR[P.cls]);
function g100TrSel(){const s=g100S(),o={};for(const k in s.tr){const L=k|0;if(G100G.trLv.includes(L)&&(s.tr[k]==='a'||s.tr[k]==='b'))o[L]=s.tr[k]}return o}
function g100TrList(){if(!g100TrOn())return [];const sel=g100TrSel(),L=G100_TR[P.cls],out=[];G100G.trLv.forEach((lv,i)=>{const c=sel[lv];if(c&&P.lvl>=lv&&L[i])out.push(L[i][c==='a'?0:1])});return out}
V20.gsAdd.push(x=>{if(!P)return;for(const t of g100TrList()){if(t.gs)for(const k in t.gs)x[k]=(x[k]||0)+t.gs[k];const C=CLASSES[P.cls];
  if(t.hp)x.hp=(x.hp||0)+Math.round((40+P.lvl*12)*C.hp*t.hp);if(t.mp)x.mp=(x.mp||0)+Math.round((20+P.lvl*5)*C.mp*t.mp);if(t.regen)x.regen=(x.regen||0)+Math.round(v20RegenPct(x,t.regen)*10)/10}});
V20.dmgAdd.push(()=>{let v=0;for(const t of g100TrList())if(t.dmg)v+=t.dmg;return v});
V20.healK.push(()=>{let v=0;for(const t of g100TrList())if(t.heal)v+=t.heal;return v});
const g100TrPrice=()=>5000+Math.max(0,P.lvl-100)*300;
V20A.g100tr=v=>{const [lv,c]=String(v).split(':'),L=lv|0;if(!g100TrOn()||!G100G.trLv.includes(L)||P.lvl<L||(c!=='a'&&c!=='b'))return;const s=g100S();
  if(s.tr[L]===c)return;if(s.tr[L]){const pr=g100TrPrice();if(P.gold<pr){msg(`금화가 모자랍니다 (${pr.toLocaleString()})`,'#ff8a5a');return}P.gold-=pr}
  s.tr[L]=c;v20GsBump();const t=G100_TR[P.cls][G100G.trLv.indexOf(L)][c==='a'?0:1];msg(`3차 숙련 특성 「${t.n}」: ${t.d}`,'#c9b4ff');rings.push({x:P.x,y:P.y,r:10,max:120,life:.7,col:'#c9b4ff'});save()};
// 나-2 단계 상자
const g100BxOpen=L=>!!(P&&P.lvl>=L&&G100G.bx.includes(L)&&!g100S().bx.includes(L));
function g100BxGive(L){if(!g100BxOpen(L))return false;const s=g100S();s.bx.push(L);
  let it=null;for(let i=0;i<80&&!it;i++){const x=makeItem(P.lvl,true);if(x&&x.rar===2)it=x}if(!it)it=makeItem(P.lvl,true);if(it.rar>=3)it.rar=2;
  if(P.bag.length<BAG_MAX)P.bag.push(it);else loot.push({x:P.x+rnd(-16,16),y:P.y+rnd(-16,16),kind:'item',item:it,t:0});
  const gold=L*300,ash=Math.round(L/10);P.gold+=gold;P.pot.hp=(P.pot.hp|0)+6;P.pot.mp=(P.pot.mp|0)+6;if(typeof ashGain==='function')ashGain(ash,P.x,P.y);
  rings.push({x:P.x,y:P.y,r:10,max:150,life:.9,col:'#ffd76a'});burst(P.x,P.y,'#ffd76a',40,180,3,20);
  msg(`${L}레벨 단계 상자: ${itemName(it)} · 금화 ${gold.toLocaleString()} · 물약 6개씩 · 재의 결정 ${ash}${G100G.bxT[L]?` · 칭호 「${G100G.bxT[L]}」`:''}`,'#ffd76a');save();return true}
V20A.g100bx=L=>{g100BxGive(L|0)};
for(const L in G100G.bxT)V20.titles.push({id:'g100box'+L,n:G100G.bxT[L],col:'#ffd76a',src:`${L}레벨 단계 상자`,have:()=>!!(P&&g100S().bx.includes(+L))});
function g100GrowHtml(){let h='';
  if(P.lvl<100)h+='<div class="v20box"><p class="muted">100레벨부터 열립니다. 3차 숙련 특성은 3차 전직 뒤 105레벨부터, 단계 상자는 105레벨부터 받습니다.</p></div>';
  h+=`<div class="v20box"><h3>레벨 단계 상자 <span class="muted">105~140레벨, 5레벨마다 · 희귀 장비 1개 · 금화 · 물약 · 재의 결정</span></h3>`;
  for(const L of G100G.bx){const got=g100S().bx.includes(L),can=g100BxOpen(L);
    h+=`<div class="v20row"><div><b>${L}레벨</b> <span class="muted">희귀 장비 · 금화 ${(L*300).toLocaleString()} · 물약 6개씩 · 재의 결정 ${Math.round(L/10)}${G100G.bxT[L]?` · 칭호 「${G100G.bxT[L]}」`:''}</span></div><div class="btns">${got?'<button type="button" disabled>받음</button>':v20Btn('g100bx',L,'받기',{dis:!can,title:can?'':`${L}레벨부터`})}</div></div>`}
  h+='</div>';const TL=G100_TR[P.cls];if(!TL)return h;const sel=g100TrSel();
  h+=`<div class="v20box"><h3>3차 숙련 특성 <span class="muted">105~135레벨, 5레벨마다 둘 중 하나 · 모두 덧셈</span></h3>`;
  if(!P.job3)return h+'<p class="muted">3차 전직을 마치면 고를 수 있습니다.</p></div>';
  const pend=G100G.trLv.filter(lv=>P.lvl>=lv&&!sel[lv]).length;if(pend)h+=`<p style="color:#ffd76a;margin:2px 0">고르지 않은 특성 ${pend}개</p>`;
  G100G.trLv.forEach((lv,i)=>{const c=sel[lv],open=P.lvl>=lv;h+=`<div class="v20row"><div style="flex-basis:100%"><b>${lv}레벨</b>${c?'':open?' <span style="color:#ffd76a">고르기</span>':` <span class="muted">${lv-P.lvl}레벨 남음</span>`}</div>`;
    for(const k of ['a','b']){const t=TL[i][k==='a'?0:1],on=c===k;h+=`<div style="flex:1 1 200px;opacity:${open?1:.55}"><b style="color:${on?'#c9b4ff':'#efe2c0'}">${on?'✔ ':''}${t.n}</b> <span class="muted" style="font-size:12px">${t.d}</span><div class="btns" style="margin-top:3px">${on?'<button type="button" disabled>고름</button>':v20Btn('g100tr',lv+':'+k,c?`바꾸기 (금화 ${g100TrPrice().toLocaleString()})`:'고르기',{dis:!open})}</div></div>`}
    h+='</div>'});return h+'</div>'}
G42.tabs.push({k:'g100',n:'3차 성장',html:g100GrowHtml,dot:()=>!!P&&(G100G.bx.some(g100BxOpen)||g100TrOn()&&G100G.trLv.some(lv=>P.lvl>=lv&&!g100TrSel()[lv]))});
// 레벨업 알림
{const _gx=gainXp;gainXp=function(n){const l0=P?P.lvl:0;const r=_gx.apply(this,arguments);if(P&&P.lvl>l0){const L=P.lvl;
  if(G100G.bx.some(b=>b>l0&&b<=L))setTimeout(()=>msg('레벨 단계 상자가 생겼습니다. 성장(G) 창 「3차 성장」에서 받으세요','#ffd76a'),550);
  if(g100TrOn()&&G100G.trLv.some(b=>b>l0&&b<=L))setTimeout(()=>msg('새 3차 숙련 특성을 고를 수 있습니다 (성장 G · 3차 성장)','#c9b4ff'),750)}return r}}
// 성장 길잡이 · 다음 줄: 100 넘어서도 특성 · 상자가 보이게
{const _n=g42Next;g42Next=function(){const a=_n.apply(this,arguments);if(!P||P.lvl<100||P.lvl>=MAXLV)return a;const tl=g100TrOn()?G100G.trLv.find(L=>L>P.lvl):null,bx=G100G.bx.find(L=>L>P.lvl);
  const c=[];if(tl)c.push([tl,`${tl}레벨 3차 숙련 특성`]);if(bx)c.push([bx,`${bx}레벨 단계 상자`]);c.sort((x,y)=>x[0]-y[0]);if(!c.length)return a;const m=/^(\d+)레벨/.exec(a||'');return !a||m&&+m[1]>c[0][0]?c[0][1]:a}}
// 나-4 100~140 탐험 기록
{const ADD=['plateau','capital','r110_lake','r110_peak','r110_jungle','r110_aurora'];
 if(typeof G42_EX==='object'&&typeof G42_EXB==='object'){for(const r of ADD)if(REGIONS[r]&&!G42_EX.includes(r))G42_EX.push(r);
  Object.assign(G42_EXB,{plateau:{gs:{dr:1},d:'받는 피해 −1%'},capital:{gs:{crit:1},d:'치명타 +1%'},r110_lake:{gs:{mcost:2},d:'마나 소모 −2%'},r110_peak:{gs:{ms:2},d:'이동 속도 +2%'},r110_jungle:{gs:{cdr:1},d:'재사용 대기 −1%'},r110_aurora:{gs:{mk:3},d:'적 처치 시 마나 +3'}})}}
window.__g100g={G100G,G100_TR,g100TrList,g100BxGive,g100BxOpen,g100TrSel};
