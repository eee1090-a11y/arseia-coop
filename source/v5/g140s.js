/* ---------- v58 후보 · 2차: 다-4 별빛 강화 · 다-5 짐승 특성 ----------
   사용자 2026-11-08 「고레벨 컨텐츠 다음배치 만들고」 → 제안 「추천대로 다섯 가지 모두」.
   · 다-4 별빛 강화: 140레벨 장비(어느 칸이든 능력치가 있으면)에 별빛 +1~+5. 단계마다 그 장비 능력치 모두 +3%(덧셈 · 재련과 따로 · 재련 값은 안 셈).
     실패 없음. 마을 대장간(재련 칸과 같은 가게 · 140레벨부터). 단계 값 별 조각 5 · 10 · 20 · 35 · 50(모두 120).
     이름 뒤 「★3」 · 설명 줄. 장비 한 개 안의 값 it.g140s(0..5) — 장비를 버리거나 팔면 같이 사라진다(옮기기 없음).
   · 다-5 짐승 특성: 동료 짐승이 있으면 130 · 135 · 140레벨에 셋 중 하나씩. 언제든 어디서든 무료로 바꿈(성장(G) 「동료」 칸).
       130 몸: 질긴 가죽(짐승 생명력 +30%) · 날카로운 이빨(짐승 공격 +25%) · 두꺼운 털(짐승이 받는 피해 −20%)
       135 함께: 무리 사냥(짐승 곁 250 안의 적에게 내 피해 +6%) · 지키는 짐승(짐승이 살아 있으면 내가 받는 피해 −5%) · 생명 나눔(짐승이 살아 있으면 5초마다 내 생명력 2%)
       140 끝: 빠른 부활(쓰러진 짐승이 20초 → 6초 뒤 돌아옴) · 별빛 갈기(짐승 고유 기술 대기 −30%) · 든든한 곁(짐승이 살아 있으면 내 피해 +5%)
   · 저장: 장비 it.g140s · P.g100.g140.pt {a,b,c} (모르는 값은 비움 · 없으면 기본값). 캐릭터 키를 지우거나 비우는 코드 없음. */
const G140S={max:5,step:.03,cost:[5,10,20,35,50]};
const g140sOf=it=>{if(!it)return 0;const v=+it.g140s;return Number.isInteger(v)&&v>0?Math.min(G140S.max,v):0};
const g140sKeys=it=>it&&it.stats?Object.keys(it.stats).filter(k=>Number.isFinite(+it.stats[k])&&+it.stats[k]>0):[];
const g140sCan=it=>!!it&&(it.il|0)>=MAXLV&&!!SLOT[it.slot]&&g140sKeys(it).length>0;
function g140sAdd(it,L){L=L==null?g140sOf(it):L;const o={};if(!(L>0)||!it)return o;for(const k of g140sKeys(it))o[k]=Math.round(+it.stats[k]*G140S.step*L*10)/10;return o}
const g140sCost=it=>{const i=g140sOf(it);return i>=G140S.max?null:G140S.cost[i]};
function g140sWhy(it){if(!it)return '장비를 고르세요';if(!g140sCan(it))return '140레벨 장비만 별빛을 입힙니다';if(g140sOf(it)>=G140S.max)return '이미 ★5입니다';
  const c=g140sCost(it),h=g140S().sh|0;if(h<c)return `별 조각이 모자랍니다 (${h}/${c})`;return ''}
function g140sTry(it){if(!P||g140sWhy(it))return false;const c=g140sCost(it),s=g140S();s.sh=g140Int(s.sh-c);it.g140s=g140sOf(it)+1;
  rings.push({x:P.x,y:P.y,r:10,max:130,life:.8,col:'#fff6a0'});burst(P.x,P.y,'#fff6a0',44,190,3,24);msg(`별빛 강화: ${itemName(it)} (능력치 +${Math.round(it.g140s*G140S.step*100)}%)`,'#fff6a0');
  if(it.g140s>=G140S.max)banner={t:itemName(it),sub:'별빛 ★5',col:'#fff6a0',life:1.8,max:1.8};if(typeof v20GsBump==='function')v20GsBump();save();return true}
V20.gsAdd.push(x=>{if(!P||!P.gear)return;for(const sl in P.gear){const it=P.gear[sl];if(!g140sOf(it))continue;const a=g140sAdd(it);for(const k in a)x[k]=(x[k]||0)+a[k]}});
{const _is=itemScore;itemScore=function(it){if(!it||!g140sOf(it))return _is.apply(this,arguments);const a=g140sAdd(it),st=Object.assign({},it.stats);for(const k in a)st[k]=(st[k]||0)+a[k];return _is.call(this,Object.assign({},it,{stats:st}))}}
{const _nm=itemName;itemName=function(it){const n=_nm.apply(this,arguments),L=g140sOf(it);return L?`${n} ★${L}`:n}}
{const _rl=rfLine;rfLine=function(it){const h=_rl.apply(this,arguments),L=g140sOf(it);if(!L)return h;const a=g140sAdd(it);
  return h+`<div class="rf21ln" style="color:#fff6a0">별빛 ★${L} (+${Math.round(L*G140S.step*100)}%): ${Object.entries(a).map(([k,v])=>`${statName(k)} +${rfV(k,v)}`).join(' · ')}</div>`}}
// 대장간 칸 (재련 칸 아래)
const G140SV={sel:null};
function g140sList(){const out=[];for(const sl in P.gear){const it=P.gear[sl];if(g140sCan(it))out.push({it,on:1})}for(const it of P.bag)if(g140sCan(it))out.push({it,on:0});return out}
function g140sFind(id){id=+id;for(const sl in P.gear){const it=P.gear[sl];if(it&&it.id===id)return it}return P.bag.find(x=>x.id===id)||null}
function g140sShopOn(){if(!P||!actTown||P.lvl<MAXLV)return false;const types=(actTown.shops||[]).map(s=>s.type);return actShop==='weapon'||actShop==='armor'||(actShop==='general'&&!types.includes('weapon')&&!types.includes('armor'))}
function g140sHtml(){const L=g140sList();let sel=G140SV.sel!=null?g140sFind(G140SV.sel):null;if(!sel||!g140sCan(sel)){sel=L.length?L[0].it:null;G140SV.sel=sel?sel.id:null}
  let h=`<details class="v20box rf21" open><summary><b style="color:#fff6a0">별빛 강화</b> <span class="muted">별 조각 ${g140S().sh|0}</span></summary>`;
  h+=`<p class="muted" style="font-size:12px;margin:4px 0">140레벨 장비에 별빛 ★1~★5. 단계마다 그 장비 능력치 모두 +3% (덧셈 · 재련과 따로). 실패 없음. 별 조각은 부서진 하늘섬 · 별바다 가장자리 · 별의 탑에서 나옵니다.</p>`;
  if(!L.length)return h+'<p class="muted">140레벨 장비가 없습니다.</p></details>';
  h+='<div class="rf21list">'+L.map(({it,on})=>`<button type="button" class="rf21pick" data-g140ss="${it.id}" aria-pressed="${sel===it}" title="${v20Esc(itemName(it))}${on?' (착용 중)':''}">${itemIcon(it,{sz:36})}${on?'<i>착용</i>':''}</button>`).join('')+'</div>';
  if(sel){const k=g140sOf(sel),c=g140sCost(sel),why=g140sWhy(sel);h+=`<div class="rf21sel"><div class="nm" style="color:${RAR[sel.rar].c}">${v20Esc(itemName(sel))} <span class="muted">${RAR[sel.rar].n} ${SLOT[sel.slot].n} · Lv${sel.il}</span></div>`;
    if(c){const a0=g140sAdd(sel,k),a1=g140sAdd(sel,k+1);h+=`<div>★${k} → <b style="color:#fff6a0">★${k+1}</b> · 비용: 별 조각 <b>${c}</b> · 실패 없음</div>`;
      h+=`<div>결과: ${g140sKeys(sel).map(x=>`${statName(x)} ${rfV(x,+sel.stats[x]+(a0[x]||0)).toLocaleString()} → <b style="color:#8cf08a">${rfV(x,+sel.stats[x]+(a1[x]||0)).toLocaleString()}</b>`).join(' · ')}</div>`;
      h+=`<div class="row" style="margin-top:6px"><button type="button" class="primary" data-g140sgo="${sel.id}"${why?' disabled':''}>별빛 입히기</button>${why?` <span class="muted">${why}</span>`:''}</div>`}
    else h+='<div class="muted">가장 높은 단계(★5)입니다.</div>';h+='</div>'}
  return h+'</details>'}
{const _sh=shopHtml;shopHtml=function(){const h=_sh.apply(this,arguments);if(!g140sShopOn())return h;const box=g140sHtml(),i=h.lastIndexOf('</details>');return i>=0&&h.indexOf('rf21')>=0?h.slice(0,i+10)+box+h.slice(i+10):box+h}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-g140ss],[data-g140sgo]');if(!b||b.disabled||!P)return;
  if(b.dataset.g140ss){G140SV.sel=+b.dataset.g140ss;renderPanel();return}const it=g140sFind(b.dataset.g140sgo);if(it&&g140sTry(it))renderPanel()});

/* ===== 다-5 짐승 특성 ===== */
const G140P={lv:{a:130,b:135,c:140},
  a:[{k:'hide',n:'질긴 가죽',d:'짐승 생명력 +30%'},{k:'fang',n:'날카로운 이빨',d:'짐승 공격 +25%'},{k:'fur',n:'두꺼운 털',d:'짐승이 받는 피해 −20%'}],
  b:[{k:'pack',n:'무리 사냥',d:'짐승 곁(250 안)의 적에게 내 피해 +6%'},{k:'guard',n:'지키는 짐승',d:'짐승이 살아 있으면 내가 받는 피해 −5%'},{k:'share',n:'생명 나눔',d:'짐승이 살아 있으면 5초마다 내 생명력 2% 회복'}],
  c:[{k:'revive',n:'빠른 부활',d:'쓰러진 짐승이 20초가 아니라 6초 뒤 돌아옴'},{k:'mane',n:'별빛 갈기',d:'짐승 고유 기술 대기 시간 −30%'},{k:'side',n:'든든한 곁',d:'짐승이 살아 있으면 내 피해 +5%'}],
  hp:.3,dmg:.25,fur:.8,pack:.06,packR:250,guard:.05,share:.02,shareT:5,revive:6,mane:.7,side:.05};
const G140PV={shT:5};
function g140Pt(){const s=g140S();if(!g100Obj(s.pt))s.pt={};const o=s.pt;for(const t of ['a','b','c'])if(o[t]&&!G140P[t].some(x=>x.k===o[t]))delete o[t];return o}
const g140PtOn=(t,k)=>{if(!P)return false;const o=g140Pt();return P.lvl>=G140P.lv[t]&&o[t]===k};
const g140PetHas=()=>!!(typeof g42Pet==='function'&&g42Pet().k);
{const _pm=g42PetMake;g42PetMake=function(){const a=_pm.apply(this,arguments);try{if(a){if(g140PtOn('a','hide')){a.max=a.hp=Math.round(a.max*(1+G140P.hp))}if(g140PtOn('a','fang'))a.dmg*=1+G140P.dmg;a.g140pt=1}}catch(e){if(window.__QA)throw e}return a}}
{const _h=hurtAlly;hurtAlly=function(a,d){if(a&&a.g42pet&&d>0&&g140PtOn('a','fur'))d*=G140P.fur;return _h.call(this,a,d)}}
V20.dmgAdd.push(e=>{if(!P||!e)return 0;let x=0;const a=(g140PtOn('b','pack')||g140PtOn('c','side'))&&g42PetLive();if(!a)return 0;if(g140PtOn('c','side'))x+=G140P.side;if(g140PtOn('b','pack')&&dist(a,e)<G140P.packR)x+=G140P.pack;return x});
function g140PtTick(dt){if(!P||P.dead)return;const a=g42PetLive();
  if(a&&g140PtOn('b','guard'))P.buffs._g140pt={t:.5,max:.5,dr:G140P.guard};else if(P.buffs._g140pt)delete P.buffs._g140pt;
  if(a&&g140PtOn('b','share')){G140PV.shT-=dt;if(G140PV.shT<=0){G140PV.shT=G140P.shareT;if(P.hp<maxHp()){const h=Math.round(maxHp()*G140P.share);P.hp=Math.min(maxHp(),P.hp+h);ftext(P.x,P.y-10,'+'+h,'#c8e0a0',false,40)}}}else G140PV.shT=G140P.shareT;
  if(g140PtOn('c','revive')&&G42G.deadT>G140P.revive)G42G.deadT=G140P.revive;
  if(g140PtOn('c','mane')){const base=P.lvl>=90?8:12;if(G42G.skT>base*G140P.mane)G42G.skT=base*G140P.mane}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(!P||paused)return r;try{g140PtTick(dt)}catch(e){if(window.__QA)throw e}return r}}
V20A.g140pt=v=>{const [t,k]=String(v).split(':');if(!G140P[t]||!Array.isArray(G140P[t])||!P)return;if(P.lvl<G140P.lv[t]){msg(`${G140P.lv[t]}레벨부터 고를 수 있습니다`,'#a39d8f');return}
  const o=g140Pt();if(k&&!G140P[t].some(x=>x.k===k))return;if(k)o[t]=k;else delete o[t];
  if(t==='a'){const a=g42PetLive();if(a){a.gone=true;G42G.deadT=0}}const n=k&&G140P[t].find(x=>x.k===k);msg(n?`짐승 특성: 「${n.n}」`:'짐승 특성을 비웠습니다','#c8e0a0');save()};
function g140PtHtml(){if(!P||P.lvl<125)return '';const o=g140Pt(),has=g140PetHas();let h=`<div class="v20box"><h3>짐승 특성 <span class="muted">130 · 135 · 140레벨 · 언제든 무료로 바꿈</span></h3>`;
  if(!has)h+='<p class="muted" style="margin:2px 0">동료 짐승을 들이면 특성이 붙습니다(골라 둘 수는 있음).</p>';
  for(const t of ['a','b','c']){const L=G140P.lv[t],open=P.lvl>=L;h+=`<p style="margin:6px 0 2px"><b>${L}레벨</b>${open?'':` <span class="muted">(${L-P.lvl}레벨 남음)</span>`}</p>`;
    for(const x of G140P[t]){const on=o[t]===x.k;h+=`<div class="v20row"><div><b>${x.n}</b> <span class="muted" style="font-size:12px">${x.d}</span></div><div class="btns">${on?v20Btn('g140pt',t+':','고른 것 · 비우기',{cls:'ghost'}):v20Btn('g140pt',t+':'+x.k,'고르기',{dis:!open,title:open?'':`${L}레벨부터`})}</div></div>`}}
  return h+'</div>'}
{const T=G42.tabs.find(t=>t.k==='pet');if(T){const _h=T.html;T.html=function(){return _h.apply(this,arguments)+g140PtHtml()};const _d=T.dot;T.dot=function(){if(_d&&_d.apply(this,arguments))return true;if(!P||!g140PetHas())return false;const o=g140Pt();return ['a','b','c'].some(t=>P.lvl>=G140P.lv[t]&&!o[t])}}}
window.__g140s={G140S,G140SV,G140P,G140PV,g140sOf,g140sAdd,g140sCan,g140sCost,g140sWhy,g140sTry,g140sHtml,g140sShopOn,g140Pt,g140PtOn,g140PtHtml};
