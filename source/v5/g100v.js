/* ---------- v57 후보 · 2차 묶음 둘째: 나-3 3차 기술 변형 ----------
   사용자 2026-11-07 「100레벨 이후의 성장 컨텐츠가 부족해」 → 제안 「모두 추천대로」(나-3).
   · 3차 전직 뒤 112 · 124 · 136레벨에 칸이 하나씩 열린다(모두 셋). 칸마다 내 3차 갈래의 공격 기술 하나(피해가 있는 것)와 모양 하나를 고른다.
     같은 기술은 한 칸에만. 언제든 무료로 바꾸거나 비울 수 있다(성장 G · 3차 성장).
   · 모양(기술마다 같은 셋 · 숫자만 바꾸고 맞는 판정 · 그림은 그 기술 그대로):
       넓게: 범위 ×1.3 · 피해 ×0.85     모아서: 범위 ×0.8 · 피해 ×1.2     빠르게: 재사용 대기 ×0.7 · 피해 ×0.8
     (제안서의 「큰 한 방 → 작은 세 방」처럼 기술마다 다른 모양은 기술 그림 · 판정을 하나씩 손봐야 해서 이번엔 공통 셋으로)
   · 내 화면에서 내가 쓰는 기술에만(eff · cdOf를 감쌈). 동료 화면의 내 기술 그림은 예전대로.
   · 저장: P.g100.sv {112:{id,v}, 124:…, 136:…} (g100.js g100Clean · 없으면 기본 · 모르는 기술/모양은 무시). */
const G100V3={lv:[112,124,136],v:{wide:{n:'넓게',d:'범위 ×1.3 · 피해 ×0.85',r:1.3,m:.85},focus:{n:'모아서',d:'범위 ×0.8 · 피해 ×1.2',r:.8,m:1.2},quick:{n:'빠르게',d:'재사용 대기 ×0.7 · 피해 ×0.8',cd:.7,m:.8}}};
const g100SvOn=()=>!!(P&&P.job3);
const g100SvOk=id=>{const s=SPELLS[id];return !!(s&&s.job3&&P&&s.job3===P.job3&&s.cls===P.cls&&s.kind!=='passive'&&s.mult>0)};
const g100SvList=()=>P?J3_SPELLS.filter(g100SvOk):[];
function g100SvMap(){const o={};if(!g100SvOn())return o;const sv=g100S().sv;for(const L of G100V3.lv){const x=sv[L];if(P.lvl>=L&&g100Obj(x)&&g100SvOk(x.id)&&G100V3.v[x.v]&&!o[x.id])o[x.id]=x.v}return o}
let G100SVC={k:'',m:{}};// 매 시전마다 다시 세지 않게(레벨 · 갈래 · 저장이 바뀌면 다시)
const g100SvOf=id=>{if(GHOST||!P)return null;const k=P.lvl+'|'+P.job3+'|'+JSON.stringify(g100S().sv);if(G100SVC.k!==k)G100SVC={k,m:g100SvMap()};const v=G100SVC.m[id];return v?G100V3.v[v]:null};
{const _ef=eff;eff=function(id,L){const e=_ef.apply(this,arguments);try{if(!e||!P||e.cls!==P.cls)return e;const V=g100SvOf(id);if(!V)return e;
  if(V.r){if(e.r>0)e.r*=V.r;if(e.rh>0)e.rh*=V.r}if(V.m&&e.mult>0)e.mult*=V.m;e.g100sv=1}catch(err){if(window.__QA)throw err}return e}}
{const _cd=cdOf;cdOf=id=>{const c=_cd(id);try{const V=g100SvOf(id);if(V&&V.cd)return Math.max(.15,c*V.cd)}catch(err){if(window.__QA)throw err}return c}}
V20A.g100sv=v=>{const [lv,id,k]=String(v).split(':'),L=lv|0;if(!g100SvOn()||!G100V3.lv.includes(L)||P.lvl<L)return;const sv=g100S().sv;
  if(!id){delete sv[L];msg('기술 변형을 비웠습니다','#c9b4ff');save();return}if(!g100SvOk(id)||!G100V3.v[k])return;
  for(const o of G100V3.lv)if(o!==L&&g100Obj(sv[o])&&sv[o].id===id)delete sv[o];sv[L]={id,v:k};msg(`기술 변형: ${SPELLS[id].n} · ${G100V3.v[k].n} (${G100V3.v[k].d})`,'#c9b4ff');save()};
V20A.g100svpick=v=>{G100V3.pick=String(v)};
function g100SvHtml(){if(!P||P.lvl<100)return '';let h=`<div class="v20box"><h3>3차 기술 변형 <span class="muted">112 · 124 · 136레벨에 한 칸씩 · 언제든 무료로 바꿈</span></h3>`;
  if(!g100SvOn())return h+'<p class="muted">3차 전직을 마치면 고를 수 있습니다.</p></div>';const list=g100SvList(),sv=g100S().sv;
  h+=`<p class="muted" style="margin:2px 0 6px">${Object.values(G100V3.v).map(o=>`<b style="color:#efe2c0">${o.n}</b> ${o.d}`).join(' · ')}</p>`;
  for(const L of G100V3.lv){const x=g100Obj(sv[L])&&g100SvOk(sv[L].id)?sv[L]:null,open=P.lvl>=L,pk=G100V3.pick&&G100V3.pick.startsWith(L+':')?G100V3.pick.split(':')[1]:x&&x.id;
    h+=`<div class="v20row"><div style="flex-basis:100%"><b>${L}레벨 칸</b> ${x?`<span style="color:#c9b4ff">${SPELLS[x.id].n} · ${G100V3.v[x.v].n}</span>`:open?'<span style="color:#ffd76a">비어 있음</span>':`<span class="muted">${L-P.lvl}레벨 남음</span>`}</div>`;
    if(open){h+=`<div class="btns" style="flex-wrap:wrap">${list.map(id=>v20Btn('g100svpick',L+':'+id,SPELLS[id].n,{cls:id===pk?'':'ghost'})).join('')}</div>`;
      if(pk&&g100SvOk(pk))h+=`<div class="btns" style="margin-top:3px">${Object.keys(G100V3.v).map(k=>v20Btn('g100sv',L+':'+pk+':'+k,`${SPELLS[pk].n} · ${G100V3.v[k].n}`,{dis:!!(x&&x.id===pk&&x.v===k)})).join('')}${x?v20Btn('g100sv',L+':','비우기',{cls:'ghost'}):''}</div>`}
    h+='</div>'}return h+'</div>'}
{const T=G42.tabs.find(t=>t.k==='g100');if(T){const _h=T.html;T.html=function(){return _h.apply(this,arguments)+g100SvHtml()}}}
{const _gx=gainXp;gainXp=function(n){const l0=P?P.lvl:0;const r=_gx.apply(this,arguments);if(P&&P.lvl>l0&&g100SvOn()&&G100V3.lv.some(b=>b>l0&&b<=P.lvl))setTimeout(()=>msg('3차 기술 변형 칸이 열렸습니다 (성장 G · 3차 성장)','#c9b4ff'),950);return r}}
window.__g100v={G100V3,g100SvMap,g100SvList,g100SvOf,g100SvOk};
