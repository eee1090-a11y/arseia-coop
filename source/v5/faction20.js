/* ---------- v20 W3 세력 평판 (설계: rpg/v20-ideas/code/factions.js) ----------
   세력 6 · 단계 5. 마을 의뢰(그 마을이 속한 세력) · 매일 의뢰 · 현상금 · 세계의 신비로 점수가 오른다.
   하루 상한: 세력마다 600점(매일 · 현상금 · 신비만, 보통 의뢰 보상은 상한 밖). 내 소속(J2)과 이어진 세력은 +25%(덧셈).
   단계마다 세력 상인(그 세력의 대표 마을 사람)에게서 물건 · 편의 · 칭호를 산다. 유니크 · 세트 · +모든 스킬 · 큰 능력치는 팔지 않는다.
   설계와 바꾼 점: 겉모습(망토·투구 등)은 그림 작업 뒤로 미루고 칭호 · 소모품으로, 수리 · 옵션 다시 굴리기 · 룬 새김은 게임에 없어 버프 · 편의로,
                  창고 · 가방 칸 +10은 옛 판으로 되돌렸을 때 물건이 사라질 수 있어 빼고 귀환 두루마리 · 금화 주머니로.
   저장: P.rep={세력id:점수, _own:[산 편의·칭호], _title:달고 있는 칭호} · P.repDay={day,got:{세력id:오늘 얻은 점수}} — 모르는 칸은 그대로 다시 쓴다. */
const REP_TIERS=[{n:'낯섦',at:0},{n:'인정',at:1000},{n:'신뢰',at:3000},{n:'존경',at:6000},{n:'영웅',at:10000}];
const REP_GAIN={townQuest:150,townFinal:400,daily:60,bounty:40,wonder:80};
const REP_CAPPED={daily:1,bounty:1,wonder:1};
const REP_DAY_CAP=600;
const FACTIONS={
  dawn:{n:'여명교단',d:'아우렐을 섬기는 에르난의 국교. 치유와 희망.',col:'#ffe39a',hall:{town:'arden',npc:'priestess'},towns:['brenhill','arden'],aff:['aurel','mordin','nella'],
    sell:[{t:1,id:'dawn_pot',n:'축성된 생명력 물약 5개',d:'상점보다 20% 싸다'},{t:2,id:'tp3',n:'귀환 두루마리 3장',d:'상점보다 20% 싸다'},{t:3,id:'dawn_buff',n:'여명의 가호',d:'30분 동안 받는 피해 5% 감소'},{t:4,id:'title:dawn',n:'칭호 「여명의 벗」'}]},
  academy:{n:'왕립 마법원',d:'일곱 첨탑의 마법원. 위계와 기록.',col:'#9fb8ff',hall:{town:'arden',npc:'oswin'},towns:['arden','haven'],aff:['academy','ceres','redtower'],
    sell:[{t:1,id:'aca_pot',n:'마나 결정 물약 5개',d:'상점보다 20% 싸다'},{t:2,id:'forget',n:'망각의 물약',d:'스킬·능력치 다시 찍기, 30% 싸게'},{t:3,id:'aca_buff',n:'서고의 촛불',d:'30분 동안 재사용 대기 5% 감소'},{t:4,id:'title:academy',n:'칭호 「서고의 손님」'}]},
  knights:{n:'에르난 기사단',d:'에르난 왕국의 기사들. 맹세와 방패.',col:'#8ab0e0',hall:{town:'arden',npc:'j2_warrior'},towns:['haven','arden','goldmere'],aff:['knights','steel','patrol'],
    sell:[{t:1,id:'kn_pot',n:'기사단 물약 꾸러미',d:'생명력 · 마나 물약 3개씩, 20% 싸게'},{t:2,id:'kn_buff',n:'기사단 갑옷 기름',d:'30분 동안 받는 피해 5% 감소'},{t:3,id:'perk:horse',n:'군마 휘파람',d:'마을 밖 들판에서 싸우지 않을 때 이동 속도 +10% (한 번 사면 계속)'},{t:4,id:'title:knights',n:'칭호 「왕국의 방패」'}]},
  kazdun:{n:'카즈둔 드워프',d:'회색 산맥 지하 왕국. 망치말과 룬.',col:'#e0a060',hall:{town:'emberhold',npc:'eh_tilla'},towns:['emberhold','dustgate','windcrag'],aff:['kazdun'],
    sell:[{t:1,id:'kz_whet',n:'룬 숫돌',d:'30분 동안 주는 피해 5% 증가'},{t:2,id:'kz_oil',n:'룬 갑옷 기름',d:'30분 동안 받는 피해 5% 감소'},{t:3,id:'kz_deep',n:'깊은 룬 숫돌',d:'30분 동안 주는 피해 8% 증가'},{t:4,id:'title:kazdun',n:'칭호 「쇠의 귀를 가진 자」'}]},
  steppe:{n:'바람의 초원 부족',d:'켄타우로스 부족들. 별 노래와 맹세.',col:'#e0c070',hall:{town:'sahar',npc:'sh_zarin'},towns:['sahar','rookwell','goldmere'],aff:['steppe','silvaren'],
    sell:[{t:1,id:'perk:star',n:'별 지도',d:'받은 현상금 정예가 1000 걸음 밖에서도 나타난다 (한 번 사면 계속)'},{t:2,id:'st_pot',n:'초원 물주머니',d:'마나 물약 5개, 20% 싸게'},{t:3,id:'perk:hoof',n:'바람 발굽 부적',d:'마을 밖 들판에서 싸우지 않을 때 이동 속도 +8% (한 번 사면 계속)'},{t:4,id:'title:steppe',n:'칭호 「그림자 없는 맹세」'}]},
  coast:{n:'해안 상인 연합',d:'항구 도시들의 연합. 바람과 동전.',col:'#7ad0d0',hall:{town:'pearlport',npc:'pp_dalla'},towns:['pearlport','gullhaven','tamal','lastlight'],aff:[],
    sell:[{t:1,id:'tp5',n:'귀환 두루마리 5장',d:'상점보다 20% 싸다'},{t:2,id:'perk:sell',n:'연합 상인 증서',d:'상점에 팔 때 10% 더 받는다 (한 번 사면 계속)'},{t:3,id:'perk:luck',n:'넬라의 동전 주머니',d:'주운 금화 10% 더 (한 번 사면 계속)'},{t:4,id:'title:coast',n:'칭호 「넬라의 동전」'}]}};
for(const f in FACTIONS)FACTIONS[f].towns=FACTIONS[f].towns.filter(t=>v20Town(t));
const REP_TITLE={dawn:'여명의 벗',academy:'서고의 손님',knights:'왕국의 방패',kazdun:'쇠의 귀를 가진 자',steppe:'그림자 없는 맹세',coast:'넬라의 동전'};
for(const f in REP_TITLE)V20.titles.push({id:'rep_'+f,n:REP_TITLE[f],col:FACTIONS[f].col,src:`${FACTIONS[f].n} 영웅 상인`,have:()=>v20OwnHas('title:'+f)});
/* ===== 저장 값 다듬기 (모르는 칸은 남긴다) ===== */
function repClean(raw){const o=v20Obj(raw)?Object.assign({},raw):{};for(const f in FACTIONS)o[f]=Number.isFinite(+o[f])?Math.max(0,Math.min(1e7,Math.floor(+o[f]))):0;
  o._own=Array.isArray(o._own)?[...new Set(o._own.filter(x=>typeof x==='string'&&x.length<=40))].slice(0,100):[];o._title=typeof o._title==='string'&&o._title.length<=40?o._title:'';return o}
function repDayClean(raw){const o=v20Obj(raw)?Object.assign({},raw):{};o.day=typeof o.day==='string'&&o.day.length<=12?o.day:'';const g={};if(v20Obj(o.got))for(const k in o.got){const v=+o.got[k];if(Number.isFinite(v))g[k]=Math.max(0,Math.floor(v))}o.got=g;return o}
function repSt(){if(!v20Obj(P.rep))P.rep=repClean(null);for(const f in FACTIONS)if(!Number.isFinite(P.rep[f]))P.rep[f]=0;if(!v20Obj(P.repDay))P.repDay=repDayClean(null);const d=v20Day();if(P.repDay.day!==d){P.repDay.day=d;P.repDay.got={}}if(!v20Obj(P.repDay.got))P.repDay.got={};return P.rep}
const repTier=n=>{let t=0;for(let i=0;i<REP_TIERS.length;i++)if(n>=REP_TIERS[i].at)t=i;return t};
const repOf=f=>{repSt();return P.rep[f]|0};
const repAffOf=f=>{const a=typeof affCur==='function'?affCur():null;return !!(a&&FACTIONS[f].aff.includes(a.id))};
// 점수 얻기: townId가 속한 세력 모두. kind: townQuest · townFinal · daily · bounty · wonder
function repGain(townId,kind,amt){if(!P)return 0;repSt();let total=0;
  for(const f in FACTIONS){const F=FACTIONS[f];if(!F.towns.includes(townId))continue;let n=amt!=null?amt:REP_GAIN[kind]||0;if(!n)continue;if(repAffOf(f))n=Math.round(n*1.25);
    if(REP_CAPPED[kind]){const got=P.repDay.got[f]|0,room=Math.max(0,REP_DAY_CAP-got);n=Math.min(n,room);if(n<=0)continue;P.repDay.got[f]=got+n}
    const t0=repTier(P.rep[f]);P.rep[f]=(P.rep[f]|0)+n;total+=n;const t1=repTier(P.rep[f]);
    if(t1>t0){banner={t:`${F.n} · ${REP_TIERS[t1].n}`,sub:`세력 상인 ${TWFOLK[F.hall.npc]?TWFOLK[F.hall.npc].n:''}에게 새 물건이 열렸습니다`,col:F.col,life:3,max:3};rings.push({x:P.x,y:P.y,r:10,max:150,life:.9,col:F.col})}
    msg(`${F.n} 평판 +${n}${repAffOf(f)?' (소속 +25%)':''}`,F.col)}
  return total}
{const _f=sqFinish;sqFinish=function(id){const q=SQBY[id],s=sqState(),n0=s.d[id]|0;_f.apply(this,arguments);if(!q||(s.d[id]|0)<=n0||!q.town)return;
  const kind=q.rep?'daily':(q.req&&!SQ.some(o=>o.req===q.id))?'townFinal':'townQuest';repGain(q.town,kind)}}
/* ===== 세력 상인 (대표 마을 사람 창) ===== */
const REP_HALL={};for(const f in FACTIONS)REP_HALL[FACTIONS[f].hall.npc]=f;
const repBuffP=()=>200+P.lvl*20;
const potTierNow=()=>Math.max(0,POT_T.reduce((a,p,i)=>p.lv<=P.lvl?i:a,0));
function repPrice(it){const T=potTierNow();switch(it.id){
  case'dawn_pot':return Math.round(potPriceT('hp',T)*5*.8);case'aca_pot':case'st_pot':return Math.round(potPriceT('mp',T)*5*.8);case'kn_pot':return Math.round((potPriceT('hp',T)+potPriceT('mp',T))*3*.8);
  case'tp3':return Math.round(potPrice(actTown||ALLTOWNS[0])*3*.8);case'tp5':return Math.round(potPrice(actTown||ALLTOWNS[0])*5*.8);case'forget':return Math.round(respecPrice()*.7);
  case'dawn_buff':case'aca_buff':case'kn_buff':case'kz_whet':case'kz_oil':return repBuffP();case'kz_deep':return Math.round(repBuffP()*1.6);
  case'perk:horse':case'perk:hoof':return 6000;case'perk:star':return 2500;case'perk:sell':return 5000;case'perk:luck':return 8000}
  if(it.id.startsWith('title:'))return 3000;return 999999}
const REP_BUFF={dawn_buff:{n:'여명의 가호',dr:.05,col:'#ffe39a'},aca_buff:{n:'서고의 촛불',cdr:.05,col:'#9fb8ff'},kn_buff:{n:'기사단 갑옷 기름',dr:.05,col:'#8ab0e0'},kz_whet:{n:'룬 숫돌',dmg:.05,col:'#e0a060'},kz_oil:{n:'룬 갑옷 기름',dr:.05,col:'#e0a060'},kz_deep:{n:'깊은 룬 숫돌',dmg:.08,col:'#ff9a4a'}};
function repSellHtml(f){const F=FACTIONS[f],n=repOf(f),t=repTier(n);let h='';
  for(const it of F.sell){const own=(it.id.startsWith('perk:')||it.id.startsWith('title:'))&&v20OwnHas(it.id),lock=t<it.t,pr=repPrice(it);
    h+=`<div class="v20row"><div><b>${it.n}</b> <i class="v20tag" style="background:#2a241c;color:${lock?'#a39d8f':F.col}">${REP_TIERS[it.t].n}</i><div class="muted" style="font-size:12px">${it.d||''}</div></div><div class="btns">${own?'<button type="button" disabled>가짐</button>':lock?`<button type="button" disabled>${REP_TIERS[it.t].n} 필요</button>`:v20Btn('repbuy',f+'|'+it.id,`금화 ${pr.toLocaleString()}`,{dis:P.gold<pr})}</div></div>`}return h}
V20.npcBox.push(f=>{const k=REP_HALL[f.id];if(!k||!P)return '';const F=FACTIONS[k],n=repOf(k),t=repTier(n);
  return `<div class="v20box"><h3 style="color:${F.col}">${F.n} 상인 · ${REP_TIERS[t].n} <span class="muted" style="font-weight:400">평판 ${n.toLocaleString()}</span></h3>${repSellHtml(k)}</div>`});
V20A.repbuy=v=>{const [f,id]=String(v).split('|'),F=FACTIONS[f];if(!F)return;const it=F.sell.find(x=>x.id===id);if(!it||repTier(repOf(f))<it.t)return;const pr=repPrice(it);if(P.gold<pr)return;
  const T=potTierNow();
  if(id==='dawn_pot')potAdd('hp',T,5);else if(id==='aca_pot'||id==='st_pot')potAdd('mp',T,5);else if(id==='kn_pot'){potAdd('hp',T,3);potAdd('mp',T,3)}
  else if(id==='tp3'||id==='tp5')P.pot.tp=tpCount()+(id==='tp3'?3:5);
  else if(id==='forget')respec();
  else if(REP_BUFF[id]){const B=REP_BUFF[id];P.buffs['_v20'+id]={t:1800,max:1800,n:B.n,dmg:B.dmg||0,dr:B.dr||0,cdr:B.cdr||0};rings.push({x:P.x,y:P.y,r:8,max:90,life:.7,col:B.col});burst(P.x,P.y,B.col,24,110,3,20)}
  else if(id.startsWith('perk:')||id.startsWith('title:')){if(v20OwnHas(id))return;v20OwnAdd(id);v20GsBump()}
  else return;
  P.gold-=pr;msg(`${F.n} 상인: ${it.n}`,F.col);save()};
/* ===== 편의: 말 · 발굽 (들판에서 싸우지 않을 때 이동 속도) · 판매가 · 금화 주머니 ===== */
V20.perkMove=0;
V20.slowTick.push(()=>{if(!P)return;const on=(v20OwnHas('perk:horse')||v20OwnHas('perk:hoof'))&&v20Field()&&!v20Fight()?1:0;if(on!==V20.perkMove){V20.perkMove=on;v20GsBump()}});
V20.gsAdd.push(x=>{if(!V20.perkMove)return;const a=(v20OwnHas('perk:horse')?10:0)+(v20OwnHas('perk:hoof')?8:0);if(a)x.ms=(x.ms||0)+a});
setTimeout(()=>pbody.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b||b.disabled||!(b.dataset.sell||b.dataset.sellweak))return;if(!v20OwnHas('perk:sell'))return;
  const g0=P.gold;setTimeout(()=>{const d=P.gold-g0;if(d>0){const x=Math.round(d*.1);P.gold+=x;msg(`연합 상인 증서: 금화 ${x} 더`,'#7ad0d0');if(!panel.hidden)renderPanel();save()}},0)},true),0);
{const _pk=pickup;pickup=function(l){if(l&&l.kind==='gold'&&!l.taken&&!l._v20&&P&&v20OwnHas('perk:luck')){l._v20=1;l.amt=Math.max(l.amt+1,Math.round(l.amt*1.1))}return _pk.apply(this,arguments)}}
/* ===== 「평판」 탭 (캐릭터 창) · 휴대폰은 세력마다 접힘 ===== */
{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.id='tabRep';b.setAttribute('aria-selected','false');b.textContent='평판';const c=$('#tabChar');if(c)c.insertAdjacentElement('afterend',b);b.onclick=()=>{tab='rep';renderPanel()}}
function repTabHtml(){repSt();const mob=v20Mob();let h=`<p class="muted" style="margin-top:0">마을 의뢰 · 매일 의뢰 · 현상금 · 세계의 신비로 세력 평판이 오릅니다. 매일 · 현상금 · 신비는 세력마다 하루 ${REP_DAY_CAP}점까지 (보통 의뢰는 상한 없음). 내 소속과 이어진 세력은 +25%.</p>`;
  const a=typeof affCur==='function'?affCur():null;if(a)h+=`<div class="v20box"><span class="v20chip" style="background:${a.cloak}"></span><b>소속 · ${a.n}</b> <span class="muted" style="font-size:12px">${a.fx}</span></div>`;
  for(const f in FACTIONS){const F=FACTIONS[f],n=P.rep[f]|0,t=repTier(n),nx=REP_TIERS[t+1],got=P.repDay.got[f]|0,np=TWFOLK[F.hall.npc],T=v20Town(F.hall.town);
    const pct=nx?Math.min(100,(n-REP_TIERS[t].at)/(nx.at-REP_TIERS[t].at)*100):100;
    h+=`<details class="v20box"${mob?'':' open'}><summary><b style="color:${F.col}">${F.n}</b> · ${REP_TIERS[t].n} <span class="muted">${n.toLocaleString()}${nx?` / ${nx.at.toLocaleString()}`:''}${repAffOf(f)?' · 소속 +25%':''}</span></summary>
      <div class="v20bar"><i style="width:${pct}%;background:${F.col}"></i></div><div class="muted" style="font-size:12px;margin-top:3px">${F.d} · 마을: ${F.towns.map(t=>v20Town(t).n).join(', ')}</div>
      <div class="muted" style="font-size:12px">상인: ${np?np.n:''} (${T?T.n:''}) · 오늘 ${got}/${REP_DAY_CAP}</div>${repSellHtml(f).replace(/<div class="btns">[\s\S]*?<\/div><\/div>/g,'</div>')}</details>`}
  h+='<h2>칭호</h2>'+v20TitleHtml();return h}
{const _rp=renderPanel;renderPanel=function(){_rp.apply(this,arguments);const b=$('#tabRep');if(b)b.setAttribute('aria-selected',tab==='rep');if(tab!=='rep'||!P)return;
  const ps=pbody.parentElement.scrollTop;document.querySelector('.tabs').hidden=false;$('#ptitle').textContent='세력 평판과 칭호';pbody.innerHTML=repTabHtml();pbody.parentElement.scrollTop=ps}}
// 캐릭터 창: 칭호 한 줄
{const _c=charHtml;charHtml=function(){const h=_c();if(!P)return h;const t=v20TitleCur();if(!t)return h;const line=`<p style="margin:2px 0 6px">칭호 <b style="color:${t.col||'#ffe39a'}">「${t.n}」</b> <span class="muted" style="font-size:12px">(평판 탭에서 바꾸기)</span></p>`;const i=h.indexOf('<h2>능력</h2>');return i>=0?h.slice(0,i)+line+h.slice(i):line+h}}
window.__v20=window.__v20||{};Object.assign(window.__v20,{FACTIONS,REP_TIERS,REP_GAIN,REP_DAY_CAP,REP_HALL,repClean,repDayClean,repGain,repTier,repOf,repSt,repPrice,repTabHtml,repSellHtml});
