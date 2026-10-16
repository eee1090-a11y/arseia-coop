/* ---------- v36: 마법 부여 (장비 한 개에 원하는 옵션 한 줄) ----------
   사용자 2026-10-15 「아이템을 저레벨부터 강화할 수 있는 루트가 있었으면 좋겠어 … 내가 원하는 방향(원소라던가, 아니면 궁수의 경우 사격 등)의 옵션을 한 줄 추가 …
   아이템당 하나의 추가 옵션만 … 밸런스를 깨뜨릴 수 있는 모든 스킬 옵션은 제외하되 특정 계열이나 스킬의 레벨을 올릴 수 있는 정도까지는 괜찮아.
   특정 계열의 스킬이 +1이 있으면 특정 개별 스킬은 +3정도」 · 「무기만이 아니라 아이템 부위별로 한줄씩 … 좋고 강력한 옵션일수록 최소한의 레벨 제한」
   · 어디서: 마을 무기상 · 방어구상(둘 다 없는 야영지는 잡화점)의 「마법 부여」 칸. 재련 칸(forge21.js)과 같은 가게.
   · 장비 하나에 한 줄(it.en={k,v}). 모든 부위(무기 · 보조 · 갑옷 · 모자 · 반지 둘 · 목걸이). 다시 부여하면 그 줄을 바꾼다. 원래 옵션은 그대로.
   · 고른 옵션이 정해진 값으로 붙는다(무작위 없음). 값 = 부여할 때 캐릭터 레벨에서 떨어지는 장비 옵션 평균의 약 70%(EN36.K).
   · 금화만 든다(EN36.gold). 개별 스킬 · 계열은 두 배.
   · 넣지 않는 옵션: 모든 마법 레벨(all) · 발동 효과(proc_*) · 피해 흡수(ls) · 처치 시 마나(mk) · 받는 피해 감소(dr) · 3차 기술.
   · 착용한 장비의 부여 값은 V20.gsAdd로 장비 능력치에 더한다(재련과 같은 길). 저장: 장비 안의 en 한 칸. 옛 장비는 부여 없음. */
const EN36={K:.7,sel:null,opt:null,
  gold:(L,big)=>Math.round((40+3*L*L)*(big?2:1)),
  // 개별 스킬: 10레벨 +1 · 35레벨 +2 · 60레벨 +3. 계열(한 갈래 전체) +1은 60레벨
  skT:[[60,3],[35,2],[10,1]],trLv:60};
const enMain=cls=>cls==='warrior'?'str':cls==='archer'?'dex':'int';
// 캐릭터 레벨 L에서 옵션 k의 값
function enVal(k,L){L=Math.max(1,L|0);const K=EN36.K,r=x=>Math.max(1,Math.round(x*K));
  if(k.startsWith('sk_')){for(const [lv,n] of EN36.skT)if(L>=lv)return n;return 0}
  if(k.startsWith('tr_'))return L>=EN36.trLv?1:0;
  if(k.startsWith('el_')||k==='pdmg')return r(7.5+Math.floor(L/5));
  switch(k){case'int':return r(1+L*1.3);case'str':case'dex':return r(1+L*.5);case'hp':return r(6+L*5);case'mp':return r(5+L*3.5);
    case'regen':return Math.max(.1,Math.round((.3+L*.12)*K*10)/10);case'crit':return r(3+Math.floor(L/6));case'ms':return r(3+L/30);
    case'atk':return r(2+L*1.3);case'ias':return r(Math.min(20,7.5+L/12));case'acc':return r(7.5+L*.8);case'eva':return r(Math.min(8,3+L/15));case'blk':return 2;
    case'cdr':return r(Math.min(20,5.5+L/10));case'mcost':return r(Math.min(25,6+L/8))}
  return 0}
// 내 직업이 고를 수 있는 옵션: {k, lv(최소 레벨), g(묶음)}
function enOpts(cls){cls=cls||P.cls;const o=[],add=(k,lv,g)=>o.push({k,lv,g});const phys=!!PHYS_CLS[cls];
  add(enMain(cls),1,'기본');add('hp',1,'기본');add('mp',1,'기본');add('regen',1,'기본');
  const els=[...new Set(Object.values(SPELLS).filter(s=>s.cls===cls&&isDmg(s)&&s.el&&s.el!=='phys').map(s=>s.el))];
  if(phys)add('pdmg',5,'원소 · 물리');for(const e of els)add('el_'+e,5,'원소 · 물리');
  add('crit',10,'전투');add('ms',10,'전투');
  if(phys){add('atk',20,'전투');add('ias',20,'전투');add('acc',20,'전투');add(cls==='warrior'?'blk':'eva',20,'전투')}
  add('cdr',30,'전투');add('mcost',30,'전투');
  CLASSES[cls].trees.forEach((t,i)=>add('tr_'+i,EN36.trLv,'계열 +1'));
  for(const [id,s] of Object.entries(SPELLS))if(s.cls===cls&&!(typeof isJ3==='function'&&isJ3(id))&&!s.j3)add('sk_'+id,EN36.skT[EN36.skT.length-1][0],'개별 스킬');
  return o}
const enOk=(k,cls)=>enOpts(cls).some(o=>o.k===k);
function enOf(it){const e=it&&it.en;if(!e||typeof e!=='object'||typeof e.k!=='string'||!Number.isFinite(+e.v)||!(+e.v>0))return null;return e}
const enLabel=(k,v)=>statOne(k,v);
// 장비 툴팁: 재련 줄 다음에 부여 줄
{const _rl=rfLine;rfLine=function(it){const h=_rl.apply(this,arguments),e=enOf(it);return e?h+`<div class="en36ln" style="color:#c8a8ff">마법 부여: ${enLabel(e.k,e.v)}</div>`:h}}
// 착용한 장비의 부여 값 → 장비 능력치
V20.gsAdd.push(x=>{if(!P||!P.gear)return;for(const sl in P.gear){const e=enOf(P.gear[sl]);if(!e)continue;x[e.k]=(x[e.k]||0)+(+e.v)}});
// 장비 비교 점수도 부여 값을 본다
{const _is=itemScore;itemScore=function(it){const e=enOf(it);if(!e)return _is.apply(this,arguments);const st=Object.assign({},it.stats);st[e.k]=(st[e.k]||0)+(+e.v);return _is.call(this,Object.assign({},it,{stats:st,en:null}))}}
// 왜 못 하나 ('' = 할 수 있음)
function enWhy(it,k){if(!it)return '장비를 고르세요';if(!k)return '옵션을 고르세요';const o=enOpts().find(o=>o.k===k);if(!o)return '이 직업이 고를 수 없는 옵션입니다';
  if(P.lvl<o.lv)return `${o.lv}레벨부터 붙일 수 있습니다`;const v=enVal(k,P.lvl);if(!(v>0))return '붙일 값이 없습니다';const g=enCost(k);if(P.gold<g)return `금화가 모자랍니다 (${P.gold.toLocaleString()}/${g.toLocaleString()})`;
  const e=enOf(it);if(e&&e.k===k&&+e.v>=v)return '이미 같은 옵션이 붙어 있습니다';return ''}
const enCost=k=>EN36.gold(P.lvl,k.startsWith('sk_')||k.startsWith('tr_'));
function enDo(it,k){if(enWhy(it,k))return false;const v=enVal(k,P.lvl);P.gold-=enCost(k);it.en={k,v};
  rings.push({x:P.x,y:P.y,r:10,max:110,life:.8,col:'#c8a8ff'});burst(P.x,P.y,'#c8a8ff',36,170,3,24);msg(`마법 부여: ${itemName(it)} · ${statName(k)} +${v}`,'#c8a8ff');
  if(typeof v20GsBump==='function')v20GsBump();gsKey='';if(typeof SFX==='object'&&SFX.item)try{SFX.item(3,P)}catch(_){}return true}

/* ===== 가게 칸 ===== */
function enShopOn(){if(!P||!actTown)return false;const types=(actTown.shops||[]).map(s=>s.type);
  return actShop==='weapon'||actShop==='armor'||(actShop==='general'&&!types.includes('weapon')&&!types.includes('armor'))}
function enList(){const out=[],seen=new Set();const sl=typeof gearSlots21==='function'?gearSlots21():Object.keys(P.gear);
  for(const s of sl.concat(Object.keys(P.gear))){const it=P.gear[s];if(it&&!seen.has(it)){seen.add(it);out.push({it,on:1})}}
  for(const it of P.bag)if(it&&it.slot&&!seen.has(it)){seen.add(it);out.push({it,on:0})}return out}
function enOptName(o){const v=enVal(o.k,Math.max(P.lvl,o.lv));return `${statName(o.k)} +${v}`}
function enHtml(){const L=enList();let sel=EN36.sel!=null?rfFind(EN36.sel):null;if(!sel){sel=L.length?L[0].it:null;EN36.sel=sel?sel.id:null}
  let h=`<details class="v20box en36" open><summary><b style="color:#c8a8ff">마법 부여</b> <span class="muted">금화 ${P.gold.toLocaleString()}</span></summary>`;
  h+=`<p class="muted" style="font-size:12px;margin:4px 0">장비 하나에 원하는 옵션을 한 줄 붙입니다(모든 부위). 다시 붙이면 그 줄이 바뀌고 원래 옵션은 그대로입니다. 값은 지금 레벨에 맞춰 정해지고, 강한 옵션일수록 붙일 수 있는 레벨이 높습니다.</p>`;
  if(!L.length)return h+'<p class="muted">부여할 장비가 없습니다.</p></details>';
  h+='<div class="rf21list">'+L.map(({it,on})=>`<button type="button" class="rf21pick" data-en36s="${it.id}" aria-pressed="${sel===it}" title="${v20Esc(itemName(it))}${on?' (착용 중)':''}">${itemIcon(it,{sz:36})}${on?'<i>착용</i>':''}${enOf(it)?'<b class="en36dot"></b>':''}</button>`).join('')+'</div>';
  if(sel){const e=enOf(sel),os=enOpts();if(!EN36.opt||!os.some(o=>o.k===EN36.opt))EN36.opt=(os.find(o=>P.lvl>=o.lv&&o.k.startsWith('el_'))||os[0]).k;
    const groups=[...new Set(os.map(o=>o.g))];
    h+=`<div class="rf21sel"><div class="nm" style="color:${RAR[sel.rar].c}">${v20Esc(itemName(sel))} <span class="muted">${RAR[sel.rar].n} ${SLOT[sel.slot]?SLOT[sel.slot].n:''} · Lv${sel.il}</span></div>`;
    h+=`<div>지금 부여: ${e?`<b style="color:#c8a8ff">${enLabel(e.k,e.v)}</b>`:'<span class="muted">없음</span>'}</div>`;
    h+=`<div><select data-en36o>`+groups.map(g=>`<optgroup label="${g}">`+os.filter(o=>o.g===g).map(o=>`<option value="${o.k}"${o.k===EN36.opt?' selected':''}${P.lvl<o.lv?' disabled':''}>${v20Esc(enOptName(o))}${P.lvl<o.lv?` (${o.lv}레벨부터)`:''}</option>`).join('')+'</optgroup>').join('')+`</select></div>`;
    const k=EN36.opt,why=enWhy(sel,k),v=enVal(k,P.lvl);
    h+=`<div>붙일 값: <b style="color:#8cf08a">${v>0?enLabel(k,v):'-'}</b> · 금화 <b>${enCost(k).toLocaleString()}</b></div>`;
    h+=`<div class="row" style="margin-top:6px"><button type="button" class="primary" data-en36go="${sel.id}"${why?' disabled':''}>${e?'바꿔 부여하기':'부여하기'}</button>${why?` <span class="muted">${why}</span>`:''}</div></div>`}
  return h+'</details>'}
v20Css('.en36 select{max-width:100%;margin:4px 0;background:#100d0a;color:#e8dcc4;border:1px solid #3a3226;border-radius:4px;padding:3px}.en36dot{position:absolute;right:2px;top:2px;width:7px;height:7px;border-radius:50%;background:#c8a8ff;box-shadow:0 0 4px #c8a8ff}');
{const _sh=shopHtml;shopHtml=function(){const h=_sh.apply(this,arguments);if(!enShopOn())return h;const i=h.indexOf('</p>');const box=enHtml();return i>=0?h.slice(0,i+4)+box+h.slice(i+4):box+h}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-en36s],[data-en36go]');if(!b||b.disabled||!P)return;
  if(b.dataset.en36s){EN36.sel=+b.dataset.en36s;renderPanel();return}
  const it=rfFind(b.dataset.en36go);if(!it)return;if(!enDo(it,EN36.opt))return;renderPanel();save()});
document.addEventListener('change',e=>{const s=e.target;if(!s||!s.matches||!s.matches('[data-en36o]'))return;EN36.opt=s.value;renderPanel()});
window.__en36={EN36,enVal,enOpts,enOf,enWhy,enDo,enCost,enHtml};
