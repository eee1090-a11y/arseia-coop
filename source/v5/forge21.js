/* ---------- v21 (GROW): 장비 재련 (엔드컨텐츠 A2) ----------
   마을 무기상·방어구상(무기상·방어구상이 없는 야영지는 그 가게)의 「재련」 칸. 무기·보조·갑옷·모자를 +1~+10.
   · it.rf (0..10, 단계) · it.rfp (실패가 쌓인 수: 다음 확률 +5%씩). 장비 한 개 안의 값이라 옛 판도 모르는 값으로 보존한다.
   · 1단계마다 그 장비의 주 능력치 +4% (무기: 지능/공격력 = 피해, 방어구: 생명력·받는 피해 감소·막기·회피 = 방어). 덧셈, +10이면 +40%.
     착용한 장비의 재련 값은 V20.gsAdd로 장비 능력치에 더한다.
   · +1~+5는 늘 성공, +6 80% · +7 70% · +8 60% · +9 45% · +10 30%. 실패해도 깨지거나 내려가지 않고 재료만 사라진다.
   · 이름은 itemName(it) = 「이름 +7」 (it.name 자체는 바꾸지 않는다: 아이콘·그림이 이름을 본다). 줄은 rfLine(it), 틀은 rfFrame(it). */
const RF_MAX=10,RF_STEP=.04,RF_PITY=5;
const RF_P=[100,100,100,100,100,80,70,60,45,30];// 다음 단계(1..10)의 기본 성공 확률 %
const RF_ASH=[1,2,3,4,6,8,10,13,16,20];// 재의 결정 (합 83)
const RF_GOLD=[3000,5000,8000,12000,16000,22000,28000,35000,43000,52000];// 금화
const RF_SLOTS=['staff','off','robe','hat'];// 반지·목걸이는 재련하지 않음
function rfOf(it){if(!it)return 0;const v=+it.rf;return Number.isInteger(v)&&v>0?Math.min(RF_MAX,v):0}
const rfPity=it=>{const v=+(it&&it.rfp);return Number.isInteger(v)&&v>0?Math.min(40,v):0};
function rfKeys(it){if(!it||!it.stats)return[];const m=it.wt&&typeof MAIN_V18==='object'&&MAIN_V18[it.wt]?MAIN_V18[it.wt]:SLOT[it.slot]&&SLOT[it.slot].main?[SLOT[it.slot].main]:[];
  return m.filter(k=>Number.isFinite(+it.stats[k])&&+it.stats[k]>0)}
const rfCan=it=>!!it&&RF_SLOTS.includes(it.slot)&&rfKeys(it).length>0;
// 재련 단계 L에서 더해지는 값 {k:v}
function rfAdd(it,L){L=L==null?rfOf(it):L;const o={};if(!(L>0)||!it)return o;for(const k of rfKeys(it))o[k]=Math.round(it.stats[k]*RF_STEP*L*10)/10;return o}
function itemName(it){if(!it)return '';const L=rfOf(it);return L?`${it.name} +${L}`:String(it.name||'')}
const rfV=(k,v)=>(Math.abs(v)>=10?Math.round(v):Math.round(v*10)/10);
function rfLine(it){const L=rfOf(it);if(!L)return '';const a=rfAdd(it,L);const t=Object.entries(a).map(([k,v])=>`${statName(k)} +${rfV(k,v)}`).join(' · ');
  return `<div class="rf21ln" style="color:#ffd9a0">재련 +${L} (+${Math.round(L*RF_STEP*100)}%)${t?': '+t:''}</div>`}
// 틀: 단계마다 조금씩 밝아지고 빛이 번진다 (CSS만, 그림은 그대로)
function rfFrame(it){const L=rfOf(it);if(!L)return '';const c=RAR[clamp(it.rar|0,0,RAR.length-1)].c,b=Kit.mix(c,'#ffffff',Math.min(.55,L*.055));
  return `;border-color:${b};box-shadow:inset 0 0 0 1px rgba(0,0,0,.7),0 0 ${(2+L*.9).toFixed(1)}px ${b}`}
const rfChance=it=>Math.min(100,RF_P[rfOf(it)]+RF_PITY*rfPity(it));
const rfCost=it=>{const i=rfOf(it);return i>=RF_MAX?null:{ash:RF_ASH[i],gold:RF_GOLD[i]}};
// 내 장비(착용 + 가방)에서 id로 찾기
function rfFind(id){id=+id;for(const sl in P.gear){const it=P.gear[sl];if(it&&it.id===id)return it}return P.bag.find(x=>x.id===id)||null}
function rfWhy(it){if(!it)return '장비를 고르세요';if(!rfCan(it))return '무기·보조·갑옷·모자만 재련합니다';if(rfOf(it)>=RF_MAX)return '이미 +10입니다';const c=rfCost(it);
  if((P.ash|0)<c.ash)return `재의 결정이 모자랍니다 (${P.ash|0}/${c.ash})`;if(P.gold<c.gold)return `금화가 모자랍니다 (${P.gold.toLocaleString()}/${c.gold.toLocaleString()})`;return ''}
// 한 번 시도. roll(0~100)을 넘기면 그 값으로 (점검용)
function rfTry(it,roll){if(rfWhy(it))return null;const c=rfCost(it),p=rfChance(it);ashSpend(c.ash);P.gold-=c.gold;
  const ok=(roll!=null?+roll:R()*100)<p;
  if(ok){it.rf=rfOf(it)+1;it.rfp=0;rings.push({x:P.x,y:P.y,r:10,max:120,life:.8,col:'#ffd9a0'});burst(P.x,P.y,'#ffd9a0',40,180,3,24);
    msg(`재련 성공: ${itemName(it)}`,'#ffd9a0');if(it.rf>=6)banner={t:`${itemName(it)}`,sub:'재련 성공',col:'#ffd9a0',life:1.6,max:1.6}}
  else{it.rfp=rfPity(it)+1;burst(P.x,P.y,'#8a8478',18,90,2.5,24);msg(`재련 실패: 장비는 그대로입니다 (+${rfOf(it)}) · 다음 확률 ${rfChance(it)}%`,'#c8bfae')}
  if(typeof v20GsBump==='function')v20GsBump();if(typeof SFX==='object'&&SFX.item)try{SFX.item(ok?3:0,P)}catch(_){}return ok}
// 착용한 장비의 재련 값 → 장비 능력치
V20.gsAdd.push(x=>{if(!P||!P.gear)return;for(const sl in P.gear){const it=P.gear[sl];if(!rfOf(it))continue;const a=rfAdd(it);for(const k in a)x[k]=(x[k]||0)+a[k]}});
// 장비 비교 점수도 재련 값을 본다
{const _is=itemScore;itemScore=function(it){if(!it||!rfOf(it))return _is.apply(this,arguments);const a=rfAdd(it),st=Object.assign({},it.stats);for(const k in a)st[k]=(st[k]||0)+a[k];return _is.call(this,Object.assign({},it,{stats:st}))}}

/* ===== 대장장이 칸 (상점 창) ===== */
const RF21={sel:null};
function rfShopOn(){if(!P||!actTown)return false;const types=(actTown.shops||[]).map(s=>s.type);
  const here=actShop==='weapon'||actShop==='armor'||(actShop==='general'&&!types.includes('weapon')&&!types.includes('armor'));if(!here)return false;
  return P.lvl>=MAXLV||(P.ash|0)>0||Object.values(P.gear).some(rfOf)||P.bag.some(rfOf)}
function rfList(){const out=[];for(const sl of (typeof gearSlots==='function'?gearSlots():Object.keys(P.gear)))if(P.gear[sl]&&rfCan(P.gear[sl]))out.push({it:P.gear[sl],on:1});
  for(const sl in P.gear)if(P.gear[sl]&&rfCan(P.gear[sl])&&!out.some(o=>o.it===P.gear[sl]))out.push({it:P.gear[sl],on:1});
  for(const it of P.bag)if(rfCan(it))out.push({it,on:0});return out}
function rfHtml(){const L=rfList();let sel=RF21.sel!=null?rfFind(RF21.sel):null;if(!sel||!rfCan(sel)){sel=L.length?L[0].it:null;RF21.sel=sel?sel.id:null}
  let h=`<details class="v20box rf21" open><summary><b style="color:#ffd9a0">재련 · 대장장이</b> <span class="muted">재의 결정 ${(P.ash|0).toLocaleString()} · 금화 ${P.gold.toLocaleString()}</span></summary>`;
  h+=`<p class="muted" style="font-size:12px;margin:4px 0">무기·보조·갑옷·모자를 +1~+10까지. 1단계마다 그 장비의 주 능력치 +4% (무기는 피해, 방어구는 방어 · 덧셈). 실패해도 장비가 깨지거나 단계가 내려가지 않습니다 — 재료만 사라지고 다음 시도 확률이 +5%씩 쌓입니다. 재련 단계는 다른 장비로 옮길 수 없습니다.</p>`;
  if(!L.length)return h+'<p class="muted">재련할 장비가 없습니다.</p></details>';
  h+='<div class="rf21list">'+L.map(({it,on})=>`<button type="button" class="rf21pick" data-rf21s="${it.id}" aria-pressed="${sel===it}" title="${v20Esc(itemName(it))}${on?' (착용 중)':''}">${itemIcon(it,{sz:36})}${on?'<i>착용</i>':''}</button>`).join('')+'</div>';
  if(sel){const k=rfOf(sel),c=rfCost(sel),why=rfWhy(sel);h+=`<div class="rf21sel"><div class="nm" style="color:${RAR[sel.rar].c}">${v20Esc(itemName(sel))} <span class="muted">${RAR[sel.rar].n} ${SLOT[sel.slot]?SLOT[sel.slot].n:''} · Lv${sel.il}</span></div>`;
    if(c){const a0=rfAdd(sel,k),a1=rfAdd(sel,k+1),pt=rfPity(sel);
      h+=`<div>+${k} → <b style="color:#ffd9a0">+${k+1}</b> · 성공 확률 <b>${rfChance(sel)}%</b>${pt?` <span class="muted">(실패 ${pt}번 · +${pt*RF_PITY}%)</span>`:''}</div>`;
      h+=`<div>비용: 재의 결정 <b class="r21cnt">${c.ash}</b> · 금화 <b>${c.gold.toLocaleString()}</b></div>`;
      h+=`<div>결과: ${rfKeys(sel).map(x=>`${statName(x)} ${rfV(x,+sel.stats[x]+(a0[x]||0)).toLocaleString()} → <b style="color:#8cf08a">${rfV(x,+sel.stats[x]+(a1[x]||0)).toLocaleString()}</b>`).join(' · ')}</div>`;
      h+=`<div class="row" style="margin-top:6px"><button type="button" class="primary" data-rf21go="${sel.id}"${why?' disabled':''}>재련하기</button>${why?` <span class="muted">${why}</span>`:''}</div>`}
    else h+='<div class="muted">가장 높은 단계(+10)입니다.</div>';h+='</div>'}
  return h+'</details>'}
v20Css('.rf21list{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0}.rf21pick{position:relative;padding:2px;line-height:0;background:#100d0a;border:1px solid #3a3226;border-radius:5px}.rf21pick[aria-pressed="true"]{border-color:#ffd9a0;box-shadow:0 0 0 1px #ffd9a0}'+
  '.rf21pick i{position:absolute;left:2px;bottom:2px;font-size:9px;line-height:1;font-style:normal;background:#000a;color:#ffe39a;padding:1px 2px;border-radius:2px}.rf21sel{border-top:1px solid #2e2820;padding-top:6px;line-height:1.6}.rf21sel .row button{min-width:110px}.rf21sel button:disabled{opacity:.4;cursor:default}');
{const _sh=shopHtml;shopHtml=function(){const h=_sh.apply(this,arguments);if(!rfShopOn())return h;const i=h.indexOf('</p>');const box=rfHtml();return i>=0?h.slice(0,i+4)+box+h.slice(i+4):box+h}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-rf21s],[data-rf21go]');if(!b||b.disabled||!P)return;
  if(b.dataset.rf21s){RF21.sel=+b.dataset.rf21s;renderPanel();return}
  const it=rfFind(b.dataset.rf21go);if(!it)return;if(rfTry(it)==null)return;renderPanel();save()});
window.__rf21={RF_P,RF_ASH,RF_GOLD,RF_SLOTS,rfOf,rfAdd,rfKeys,rfCan,rfChance,rfCost,rfTry,rfWhy,rfLine,rfFrame,itemName,rfHtml,RF21};
