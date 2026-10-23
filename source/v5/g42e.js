/* ---------- v42 지역 탐험 기록 (제안 7) · 주간 원정 계약 (제안 8) ----------
   · 탐험 기록: 70~100레벨 여섯 지역. 숨은 곳 8 · 그 지역 던전 보스 · 쉼터 의뢰 · 현상금 3 · 정예 10 을 채우면 몇 % 인지 보인다.
     25 · 50 · 75 · 100%에 그 레벨 필요 경험치의 30 · 35 · 40 · 50%(주인이 「10% 규칙」을 풀어 줌), 100%에 작은 영구 능력치(더하기).
   · 주간 원정 계약: 월요일마다 서로 다른 계약 셋. 하나마다 금화와 경험치 5%, 셋 다 하면 경험치 45%와 장비(합쳐 한 주에 그 레벨의 60%쯤).
   · 저장: P.g42.ex {지역id:{s:[찾은 숨은 곳], bt, el, r:[받은 %]}}, P.g42.wk {w, L:[계약], c:[센 값], r:[받음], all}. 없으면 비어 있다. */
const G42_EX=['h29_reed','h29_kiln','h29_crystal','h29_snow','h29_bell','h29_veil'];
const G42_EXN=8,G42_EXBT=3,G42_EXEL=10;
const G42_EXR=[{p:25,xp:.30},{p:50,xp:.35},{p:75,xp:.40},{p:100,xp:.50}];
const G42_EXB={h29_reed:{gs:{ms:2},d:'이동 속도 +2%'},h29_kiln:{gs:{crit:1},d:'치명타 +1%'},h29_crystal:{gs:{mcost:2},d:'마나 소모 −2%'},h29_snow:{gs:{dr:1},d:'받는 피해 −1%'},h29_bell:{gs:{cdr:1},d:'재사용 대기 −1%'},h29_veil:{gs:{mk:3},d:'적 처치 시 마나 +3'}};
function g42ExS(reg){const g=g42S();if(!v20Obj(g.ex))g.ex={};let o=g.ex[reg];if(!v20Obj(o))o=g.ex[reg]={};
  if(!Array.isArray(o.s))o.s=[];o.s=[...new Set(o.s.map(v=>v|0).filter(v=>v>=0&&v<G42_EXN))];o.bt=Math.min(G42_EXBT,Math.max(0,o.bt|0));o.el=Math.min(G42_EXEL,Math.max(0,o.el|0));
  if(!Array.isArray(o.r))o.r=[];o.r=o.r.map(v=>v|0).filter(v=>G42_EXR.some(R0=>R0.p===v));return o}
const g42ExDg=reg=>[...DUNGEONS,...(typeof WX_DUNGEONS!=='undefined'?WX_DUNGEONS:[])].filter(d=>d&&(d.reg||d.region)===reg);
const g42ExQ=reg=>SQ.filter(q=>q.town===reg+'_camp');
function g42ExList(reg){const o=g42ExS(reg),a=g42Ac(),s=sqState(),L=[];
  for(let i=0;i<G42_EXN;i++)L.push({n:`숨은 곳 ${i+1}`,ok:o.s.includes(i),grp:'숨은 곳'});
  for(const d of g42ExDg(reg))L.push({n:`던전 「${d.n}」 보스`,ok:a.dg.includes(d.id),grp:'던전'});
  for(const q of g42ExQ(reg))L.push({n:`의뢰 「${q.t}」`,ok:!!s.d[q.id],grp:'의뢰'});
  for(let i=0;i<G42_EXBT;i++)L.push({n:`현상금 몬스터 ${i+1}`,ok:o.bt>i,grp:'현상금'});
  L.push({n:`정예 몬스터 ${G42_EXEL}마리 (${o.el}/${G42_EXEL})`,ok:o.el>=G42_EXEL,grp:'정예'});return L}
const g42ExPct=reg=>{const L=g42ExList(reg);return Math.floor(L.filter(x=>x.ok).length/L.length*100)};
const g42ExOpen=reg=>{const p=g42ExPct(reg),o=g42ExS(reg);return G42_EXR.filter(R0=>p>=R0.p&&!o.r.includes(R0.p))};
// 숨은 곳 자리: 지역마다 정해진 씨앗으로 고른 걸을 수 있는 곳 여덟 (서로 500 넘게 떨어짐)
function g42ExSpots(reg){const ck='g42ex/'+reg;if(Q30.pos[ck])return Q30.pos[ck];if(REG.id!==reg||DG||IN)return null;const ok=q30Reach(reg),rg=v20Rng(v20Hash('g42ex|'+reg)),out=[];
  for(let k=0;k<1500&&out.length<G42_EXN;k++){const x=300+rg()*(WORLD-600),y=300+rg()*(WORLD-600);if(!q30OkAt(x,y)||ok&&!wxCanReach(ok,x,y))continue;if(out.some(p=>Math.hypot(p.x-x,p.y-y)<500))continue;
    const T=RCACHE[reg]&&RCACHE[reg].town;if(T&&Math.hypot(T.x-x,T.y-y)<700)continue;out.push({x:Math.round(x),y:Math.round(y)})}
  return Q30.pos[ck]=out}
function g42ExTick(){if(!P||DG||IN||!G42_EX.includes(REG.id))return;const reg=REG.id,S=g42ExSpots(reg);if(!S)return;const o=g42ExS(reg);
  S.forEach((p,i)=>{if(o.s.includes(i))return;const d=dist(P,p);if(d<420)q30Mark('g42ex/'+reg+i,{kind:'g42ex',x:p.x,y:p.y,f:Math.max(0,1-d/420)});
    if(d<90&&!P.dead){o.s.push(i);const gold=Math.max(1,zoneLevel(p.x,p.y))*60;P.gold+=gold;burst(p.x,p.y,'#9fe8ff',26,140,3,24);rings.push({x:p.x,y:p.y,r:8,max:140,life:.8,col:'#9fe8ff'});
      banner={t:'숨은 곳을 찾았다',sub:`${REGIONS[reg].n} ${o.s.length}/${G42_EXN} · 탐험 ${g42ExPct(reg)}%`,col:'#9fe8ff',life:2.4,max:2.4};msg(`숨은 곳 ${o.s.length}/${G42_EXN}: 금화 ${gold.toLocaleString()} (성장 G → 탐험)`,'#9fe8ff');save()}})}
{const _u=update;update=function(dt){_u(dt);try{g42ExTick()}catch(e){if(window.__QA)throw e}}}
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.k!=='q30'||d.kind!=='g42ex')return _rd(d);const s=d._s;if(!s)return true;const pa=ctx.globalAlpha,pul=.5+.5*Math.sin(time*3+d.x);
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(.15+.35*d.f)*(.6+.4*pul);glow(s.x,s.y-12,22+20*d.f,'#9fe8ff');ctx.globalCompositeOperation='source-over';
  ctx.globalAlpha=.4+.5*d.f;ctx.fillStyle='#dff8ff';for(let k=0;k<3;k++){const a=time*1.6+k*2.1,r=10+6*Math.sin(time*2+k);ctx.fillRect(s.x+Math.cos(a)*r-1,s.y-14+Math.sin(a)*r*.5-1,2,2)}ctx.globalAlpha=pa;return true}}
// 현상금 · 정예 세기 (그 지역 안에서)
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&!GHOST&&e&&!DG&&G42_EX.includes(REG.id)){const o=g42ExS(REG.id);if(e.bty)o.bt=Math.min(G42_EXBT,o.bt+1);if(e.elite)o.el=Math.min(G42_EXEL,o.el+1)}}catch(err){if(window.__QA)throw err}return r}}
V20A.g42exr=a=>{const [reg,p]=String(a).split(':');if(!G42_EX.includes(reg))return;const R0=g42ExOpen(reg).find(x=>x.p===(p|0));if(!R0)return;const o=g42ExS(reg);o.r.push(R0.p);const xp=Math.round(xpNeed(P.lvl)*R0.xp);gainXp(xp);
  if(R0.p===100)v20GsBump();rings.push({x:P.x,y:P.y,r:10,max:160,life:.9,col:'#9fe8ff'});msg(`${REGIONS[reg].n} 탐험 ${R0.p}%: 경험치 ${xp.toLocaleString()}${R0.p===100?` · 영구 「${G42_EXB[reg].d}」`:''}`,'#9fe8ff');save()};
V20.gsAdd.push(x=>{if(!P)return;const g=P.g42;if(!g||!v20Obj(g.ex))return;for(const reg of G42_EX){const o=g.ex[reg];if(o&&Array.isArray(o.r)&&o.r.includes(100))for(const k in G42_EXB[reg].gs)x[k]=(x[k]||0)+G42_EXB[reg].gs[k]}});
G42.exR=G42_EX[0];V20A.g42exg=k=>{if(G42_EX.includes(k))G42.exR=k};
function g42ExHtml(){let h=`<div class="v20box"><h3>지역 탐험 기록 <span class="muted">· 숨은 곳은 가까이 가면 반짝입니다</span></h3><div class="row" style="flex-wrap:wrap;gap:4px">${G42_EX.map(r=>v20Btn('g42exg',r,`${REGIONS[r].n} ${g42ExPct(r)}%${g42ExOpen(r).length?' ●':''}`,{cls:r===G42.exR?'':'ghost'})).join('')}</div></div>`;
  const reg=G42.exR,L=g42ExList(reg),p=g42ExPct(reg),o=g42ExS(reg);
  h+=`<div class="v20box"><h3>${REGIONS[reg].n} <b style="color:#9fe8ff">${p}%</b> <span class="muted">· ${REGIONS[reg].base}레벨 지역</span></h3><div class="v20bar"><i style="width:${p}%"></i></div>`;
  for(const R0 of G42_EXR){const got=o.r.includes(R0.p),can=p>=R0.p&&!got;h+=`<div class="v20row"><div><b>${R0.p}%</b> <span class="muted">경험치 그 레벨의 ${Math.round(R0.xp*100)}%${R0.p===100?` · 영구 ${G42_EXB[reg].d}`:''}</span></div><div class="btns">${got?'<button type="button" disabled>받음</button>':v20Btn('g42exr',reg+':'+R0.p,'받기',{dis:!can})}</div></div>`}
  h+='</div>';const grps=[...new Set(L.map(x=>x.grp))];
  for(const gp of grps){const xs=L.filter(x=>x.grp===gp);h+=`<div class="v20box"><b>${gp}</b> <span class="muted">${xs.filter(x=>x.ok).length}/${xs.length}</span><div style="font-size:12px;margin-top:4px">${xs.map(x=>`<div style="color:${x.ok?'#9fe8ff':'#a39d8f'}">${x.ok?'✔':'·'} ${v20Esc(gp==='숨은 곳'&&!x.ok?'아직 못 찾은 곳':x.n)}</div>`).join('')}</div></div>`}
  return h}
G42.tabs.push({k:'ex',n:'탐험',html:g42ExHtml,dot:()=>G42_EX.some(r=>g42ExOpen(r).length)});

/* ===== 8 주간 원정 계약 ===== */
const G42_WKT={
 kill:{n:(a,N)=>`「${REGIONS[a].n}」 몬스터 ${N}마리`,N:300},
 elite:{n:(a,N)=>`정예 몬스터 ${N}마리 (어디서나)`,N:40},
 bty:{n:(a,N)=>`현상금 몬스터 ${N}마리`,N:5},
 dg:{n:(a,N)=>`던전 「${(g42ExDg(a)[0]||{}).n||'?'}」 보스 ${N}번`,N:3},
 raid:{n:(a,N)=>`쉼터 습격 ${N}번 막기`,N:2},
 ch:{n:(a,N)=>`도전 던전 ${N}번 (아무 등급)`,N:3},
 ex:{n:(a,N)=>`숨은 곳 ${N}곳 새로 찾기`,N:4}};
const G42_WKRW={xp:.05,all:.45};
function g42WkKey(ms){const d=new Date(ms==null?v20Now():ms);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return v20Day(d.getTime())}// 그 주 월요일
function g42WkRegs(){const rs=G42_EX.filter(r=>REGIONS[r].base<=Math.max(70,P.lvl+5));return rs.length?rs:[G42_EX[0]]}
function g42WkPick(key){const rg=v20Rng(v20Hash('g42wk|'+key+'|'+(P&&P.cls))),ty=Object.keys(G42_WKT),out=[],regs=g42WkRegs();
  while(out.length<3&&ty.length){const t=ty.splice(Math.floor(rg()*ty.length),1)[0];const a=regs[Math.floor(rg()*regs.length)];out.push({t,a,N:G42_WKT[t].N})}return out}
function g42Wk(){const g=g42S();const key=g42WkKey();let w=g.wk;if(!v20Obj(w)||w.w!==key||!Array.isArray(w.L)||w.L.length!==3||!w.L.every(x=>x&&G42_WKT[x.t]&&REGIONS[x.a])){w=g.wk={w:key,L:g42WkPick(key),c:[0,0,0],r:[0,0,0],all:0}}
  if(!Array.isArray(w.c)||w.c.length!==3)w.c=[0,0,0];if(!Array.isArray(w.r)||w.r.length!==3)w.r=[0,0,0];w.c=w.c.map((v,i)=>Math.min(w.L[i].N,Math.max(0,v|0)));w.r=w.r.map(v=>v?1:0);w.all=w.all?1:0;return w}
const g42WkOn=()=>P&&P.lvl>=60;
function g42WkAdd(t,a,n){if(!g42WkOn())return;const w=g42Wk();w.L.forEach((x,i)=>{if(x.t!==t||w.c[i]>=x.N)return;if((t==='kill'||t==='dg')&&x.a!==a)return;w.c[i]=Math.min(x.N,w.c[i]+(n||1));if(w.c[i]>=x.N)msg(`주간 원정 계약 「${G42_WKT[t].n(x.a,x.N)}」 다 했습니다 (성장 G → 원정)`,'#ffcf8a')})}
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&!GHOST&&e){const t=TYPES[e.k]||{};if(!DG)g42WkAdd('kill',REG.id);if(e.elite)g42WkAdd('elite');if(e.bty)g42WkAdd('bty');
  if(DG&&DG.d&&t.boss)for(const reg of G42_EX)if(g42ExDg(reg).some(d=>d.id===DG.d.id))g42WkAdd('dg',reg)}}catch(err){if(window.__QA)throw err}return r}}
{const _r=g42RdReward;g42RdReward=function(){const r=_r.apply(this,arguments);try{g42WkAdd('raid')}catch(e){if(window.__QA)throw e}return r}}
{const _r=g42ChReward;g42ChReward=function(){const r=_r.apply(this,arguments);try{if(r)g42WkAdd('ch')}catch(e){if(window.__QA)throw e}return r}}
{const _t=g42ExTick;g42ExTick=function(){const reg=G42_EX.includes(REG.id)?REG.id:null,n0=reg&&P&&P.g42&&P.g42.ex&&P.g42.ex[reg]&&Array.isArray(P.g42.ex[reg].s)?P.g42.ex[reg].s.length:-1;_t();if(reg&&n0>=0){const n1=g42ExS(reg).s.length;if(n1>n0)g42WkAdd('ex',null,n1-n0)}}}
V20A.g42wkr=i=>{const w=g42Wk();i=i|0;const x=w.L[i];if(!x||w.r[i]||w.c[i]<x.N)return;w.r[i]=1;const xp=Math.round(xpNeed(P.lvl)*G42_WKRW.xp),gold=P.lvl*400;gainXp(xp);P.gold+=gold;msg(`계약 보상: 경험치 ${xp.toLocaleString()} · 금화 ${gold.toLocaleString()}`,'#ffcf8a');save()};
V20A.g42wka=()=>{const w=g42Wk();if(w.all||!w.r.every(Boolean))return;w.all=1;const xp=Math.round(xpNeed(P.lvl)*G42_WKRW.all);gainXp(xp);let it=makeItem(P.lvl,true,null,R()<.5?'set':'uniq');if(it&&it.rar<2)it.rar=2;
  if(P.bag.length<BAG_MAX)P.bag.push(it);else loot.push({x:P.x,y:P.y,kind:'item',item:it,t:0});try{const a=g42Ac();a.wk=(a.wk|0)+1}catch(_){}
  rings.push({x:P.x,y:P.y,r:10,max:180,life:1,col:'#ffcf8a'});burst(P.x,P.y,'#ffcf8a',40,200,3,24);banner={t:'이번 주 원정 완료',sub:itemName(it),col:'#ffcf8a',life:2.8,max:2.8};msg(`주간 원정 완료: 경험치 ${xp.toLocaleString()} · ${itemName(it)}`,'#ffcf8a');save()};
function g42WkHtml(){if(!g42WkOn())return '<p class="muted">60레벨부터 주간 원정 계약을 받을 수 있습니다.</p>';const w=g42Wk(),done=w.r.every(Boolean);
  let h=`<div class="v20box"><h3>주간 원정 계약 <span class="muted">· ${w.w} 주 · 월요일마다 새 계약 셋</span></h3><p class="muted" style="margin:4px 0">하나마다 경험치 그 레벨의 ${Math.round(G42_WKRW.xp*100)}%와 금화, 셋 다 하면 경험치 ${Math.round(G42_WKRW.all*100)}%와 세트나 유니크 장비 하나.</p>`;
  w.L.forEach((x,i)=>{const c=w.c[i],ok=c>=x.N;h+=`<div class="v20box"><div class="v20row" style="border:0;padding:0"><div><b style="color:${ok?'#ffcf8a':'#efe2c0'}">${ok?'✔ ':''}${v20Esc(G42_WKT[x.t].n(x.a,x.N))}</b></div><div class="btns">${w.r[i]?'<button type="button" disabled>받음</button>':v20Btn('g42wkr',i,'받기',{dis:!ok})}</div></div><div class="v20bar"><i style="width:${Math.min(100,c/x.N*100)}%"></i></div><div class="muted" style="font-size:11px;text-align:right">${c} / ${x.N}</div></div>`});
  h+=`<div class="btns">${w.all?'<button type="button" disabled>이번 주 원정 상자 받음</button>':v20Btn('g42wka',1,'원정 상자 받기',{dis:!done})}</div></div>`;return h}
G42.tabs.push({k:'wk',n:'원정',html:g42WkHtml,dot:()=>{if(!g42WkOn())return false;const w=g42Wk();return w.L.some((x,i)=>!w.r[i]&&w.c[i]>=x.N)||!w.all&&w.r.every(Boolean)}});
G42.ach.push({id:'ex100',n:'지도를 채운 자',d:'지역 하나 탐험 100%',need:1,cur:()=>G42_EX.filter(r=>{const o=P.g42&&P.g42.ex&&P.g42.ex[r];return o&&Array.isArray(o.r)&&o.r.includes(100)}).length,grp:'세계',pts:20},
  {id:'ex600',n:'여섯 지역의 기록자',d:'여섯 지역 모두 탐험 100%',need:6,cur:()=>G42_EX.filter(r=>{const o=P.g42&&P.g42.ex&&P.g42.ex[r];return o&&Array.isArray(o.r)&&o.r.includes(100)}).length,grp:'세계',pts:40},
  {id:'wk1',n:'원정대원',d:'주간 원정 계약 셋 모두 마치기',need:1,cur:()=>g42AcN('wk'),grp:'성장',pts:10},{id:'wk10',n:'원정대장',d:'주간 원정 10주 마치기',need:10,cur:()=>g42AcN('wk'),grp:'성장',pts:30});
Object.assign(window.__g42,{G42_EX,G42_EXR,G42_EXB,G42_WKT,g42ExS,g42ExList,g42ExPct,g42ExSpots,g42Wk,g42WkKey,g42WkPick,g42WkAdd});
