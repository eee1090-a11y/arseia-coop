/* ---------- v42 채집과 제작 (제안 11) · 거점 키우기 (제안 14) ----------
   · 채집: 70~100레벨 여섯 지역과 지옥 지역에 약초 · 광석 · 수정 자리 12곳씩. 곁에 1.2초 서 있으면 캔다(8분 뒤 다시 남).
   · 제작: 「성장 → 제작」, 마을 안에서만. 최상급 물약 · 영약(30분, 하나만, 능력치 더하기) · 마법 부여 촉매(다음 부여 금화 절반).
   · 거점: 여섯 쉼터 가운데 하나를 고른다. 대장간(부여 금화 −10%씩) · 약초밭(한 시간마다 약초) · 훈련 허수아비(거점에서 휴식 기운 +50%씩) · 휴식 침대(꺼 둔 동안 휴식 기운 +15%씩), 각 3단계.
     건물 그림은 이미 쓰는 소품 그림(모루 · 무기 걸이 · 화분 · 약초 · 갑옷 받침 · 천막 · 침대)을 쓴다.
   · 저장: P.g42.mat {herb,ore,cry}, P.g42.elx {k,t}, P.g42.cat, P.g42.bs {reg,b:{smith,herb,dummy,bed},ht}. 없으면 0 · 비어 있음. */
const G42_MAT={herb:{n:'약초',col:'#8ae07a'},ore:{n:'광석',col:'#d8b890'},cry:{n:'수정',col:'#9fd8ff'}};
const G42_GREG={h29_reed:{herb:.6,ore:.2,cry:.2},h29_kiln:{herb:.2,ore:.6,cry:.2},h29_crystal:{herb:.2,ore:.2,cry:.6},h29_snow:{herb:.4,ore:.2,cry:.4},h29_bell:{herb:.2,ore:.5,cry:.3},h29_veil:{herb:.3,ore:.2,cry:.5},
  plateau:{herb:.3,ore:.5,cry:.2},starsea:{herb:.2,ore:.2,cry:.6},thunder:{herb:.3,ore:.4,cry:.3},roots:{herb:.6,ore:.2,cry:.2},capital:{herb:.3,ore:.4,cry:.3},eclipse:{herb:.2,ore:.3,cry:.5}};
const G42_GN=12,G42_GRESP=480;
const G42F={cut:{},gt:0,gk:null};
function g42Mat(){const g=g42S();if(!v20Obj(g.mat))g.mat={};for(const k in G42_MAT)g.mat[k]=Math.min(9999,Math.max(0,g.mat[k]|0));return g.mat}
function g42GSpots(reg){const ck='g42g/'+reg;if(Q30.pos[ck])return Q30.pos[ck];if(REG.id!==reg||DG||IN)return null;const W=G42_GREG[reg],ok=q30Reach(reg),rg=v20Rng(v20Hash('g42g|'+reg)),out=[],T=RCACHE[reg]&&RCACHE[reg].town;
  for(let k=0;k<2000&&out.length<G42_GN;k++){const x=300+rg()*(WORLD-600),y=300+rg()*(WORLD-600),r=rg();if(!q30OkAt(x,y)||ok&&!wxCanReach(ok,x,y))continue;if(out.some(p=>Math.hypot(p.x-x,p.y-y)<380))continue;if(T&&Math.hypot(T.x-x,T.y-y)<600)continue;
    const m=r<W.herb?'herb':r<W.herb+W.ore?'ore':'cry';out.push({x:Math.round(x),y:Math.round(y),m})}
  return Q30.pos[ck]=out}
const G42_GART={herb:{k:'herb',s:1},ore:{k:'rock',s:.75},cry:{k:'icespike',s:.6}};
function g42GTick(dt){if(!P||DG||IN||!G42_GREG[REG.id]||P.lvl<60)return;const reg=REG.id,S=g42GSpots(reg);if(!S)return;let near=null;
  S.forEach((p,i)=>{const key=reg+i,ready=!(G42F.cut[key]>G42.clock);if(!ready)return;const d=dist(P,p);if(d<900)q30Mark('g42g/'+key,{kind:'g42node',x:p.x,y:p.y,m:p.m,f:G42F.gk===key?Math.min(1,G42F.gt/1.2):0,near:d<160});if(d<60&&!P.dead)near={key,p}});
  if(!near||P.moving||CAST.cur){if(!near||G42F.gk!==(near&&near.key))G42F.gt=0;G42F.gk=near?near.key:null;return}
  if(G42F.gk!==near.key){G42F.gk=near.key;G42F.gt=0}G42F.gt+=dt;if(G42F.gt<1.2)return;G42F.gt=0;G42F.gk=null;
  const M=g42Mat(),n=1+(R()<.4?1:0)+(P.lvl>=90&&R()<.3?1:0);M[near.p.m]=Math.min(9999,M[near.p.m]+n);G42F.cut[near.key]=G42.clock+G42_GRESP;
  burst(near.p.x,near.p.y,G42_MAT[near.p.m].col,16,100,3,16);ftext(near.p.x,near.p.y-30,`${G42_MAT[near.p.m].n} +${n}`,G42_MAT[near.p.m].col,false,80)}
{const _u=update;update=function(dt){_u(dt);try{g42GTick(dt)}catch(e){if(window.__QA)throw e}}}
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.k!=='q30'||d.kind!=='g42node')return _rd(d);const s=d._s;if(!s)return true;const A=G42_GART[d.m],pa=ctx.globalAlpha;
  _rd({k:A.k,x:d.x,y:d.y,s:A.s,v:.35,zl:0,_s:s,pv:0,tprop:A.k==='herb'?1:0});
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(d.near?.35:.18)+.12*Math.sin(time*3+d.x);glow(s.x,s.y-14,d.near?34:24,G42_MAT[d.m].col);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=pa;
  if(d.f>0){ctx.strokeStyle=G42_MAT[d.m].col;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(s.x,s.y,26,13,0,-1.57,-1.57+6.283*d.f);ctx.stroke()}
  if(d.near)QLBL.push({x:s.x,y:s.y-44,n:`${G42_MAT[d.m].n} · 곁에 서 있으면 캠`,mk:'',c:G42_MAT[d.m].col,say:'',sa:0,ph:d.x});return true}}
/* 제작 */
const G42_ELX={
 pow:{n:'힘의 영약',d:'내 피해 +6%',cost:{ore:3,herb:2},dmg:.06},
 rock:{n:'바위 영약',d:'받는 피해 −4%',cost:{ore:4,cry:1},gs:{dr:4}},
 mind:{n:'맑은 정신 영약',d:'마나 소모 −6% · 재사용 대기 −2%',cost:{cry:3,herb:2},gs:{mcost:6,cdr:2}},
 eye:{n:'날카로운 영약',d:'치명타 +3%',cost:{cry:2,ore:2,herb:1},gs:{crit:3}}};
const G42_ELXT=1800;
const G42_CRAFT=[
 {id:'hp',n:'최상급 생명력 물약 3개',cost:{herb:3},give:()=>{potAdd('hp',POT_T.length-1,3)}},
 {id:'mp',n:'최상급 마나 물약 3개',cost:{herb:2,cry:1},give:()=>{potAdd('mp',POT_T.length-1,3)}},
 ...Object.keys(G42_ELX).map(k=>({id:'elx_'+k,n:`${G42_ELX[k].n} (30분 · ${G42_ELX[k].d})`,cost:G42_ELX[k].cost,give:()=>{g42S().elx={k,t:G42_ELXT};v20GsBump()}})),
 {id:'cat',n:'마법 부여 촉매 (다음 마법 부여 금화 절반)',cost:{ore:2,cry:3},give:()=>{const g=g42S();g.cat=Math.min(99,(g.cat|0)+1)}}];
const g42InTown=()=>!!(P&&!DG&&!IN&&inSafe(P.x,P.y,0));
const g42Can=cost=>{const M=g42Mat();return Object.keys(cost).every(k=>M[k]>=cost[k])};
const g42CostTxt=cost=>Object.keys(cost).map(k=>`${G42_MAT[k].n} ${cost[k]}`).join(' · ');
function g42Elx(){const g=g42S();const e=g.elx;if(!v20Obj(e)||!G42_ELX[e.k]||!(e.t>0)){if(e)g.elx=null;return null}return e}
V20.tick.push(dt=>{if(!P||paused)return;const e=g42Elx();if(!e)return;e.t-=dt;if(e.t<=0){P.g42.elx=null;v20GsBump();msg(`${G42_ELX[e.k].n}의 힘이 다했습니다`,'#a39d8f')}});
V20.gsAdd.push(x=>{if(!P||!P.g42)return;const e=P.g42.elx;if(!e||!(e.t>0)||!G42_ELX[e.k]||!G42_ELX[e.k].gs)return;const G=G42_ELX[e.k].gs;for(const k in G)x[k]=(x[k]||0)+G[k]});
V20.dmgAdd.push(()=>{const e=P&&P.g42&&P.g42.elx;return e&&e.t>0&&G42_ELX[e.k]&&G42_ELX[e.k].dmg||0});
V20A.g42craft=id=>{const C=G42_CRAFT.find(c=>c.id===id);if(!C||!g42InTown()||!g42Can(C.cost))return;const swap=id.startsWith('elx_')&&g42Elx();
  const M=g42Mat();for(const k in C.cost)M[k]-=C.cost[k];C.give();try{const a=g42Ac();a.craft=(a.craft|0)+1}catch(_){}msg(`만들었습니다: ${C.n.split(' (')[0]}${swap?' (먼저 마신 영약은 새 영약으로 바뀜)':''}`,'#ffd98a');save()};
// 촉매 · 대장간: 마법 부여 금화
const g42CatOn=()=>!!(P&&P.g42&&(P.g42.cat|0)>0);
{const _g=EN36.gold;EN36.gold=(L,big)=>{let v=_g(L,big);const sm=g42Bs().b.smith|0;if(sm)v=Math.round(v*(1-.1*sm));if(g42CatOn())v=Math.round(v*.5);return v}}
{const _e=enDo;enDo=function(it,k){const had=g42CatOn(),ok=_e.apply(this,arguments);try{if(ok&&had){P.g42.cat--;msg(`마법 부여 촉매를 썼습니다 (남은 촉매 ${P.g42.cat})`,'#9fd8ff')}}catch(e){if(window.__QA)throw e}return ok}}
function g42CraftHtml(){const M=g42Mat(),tw=g42InTown(),e=g42Elx(),g=g42S();
  let h=`<div class="v20box"><h3>재료 ${Object.keys(G42_MAT).map(k=>`<b style="color:${G42_MAT[k].col}">${G42_MAT[k].n} ${M[k]}</b>`).join(' · ')}</h3><p class="muted" style="margin:4px 0">60레벨부터 70~100레벨 지역(지옥 지역도)의 빛나는 약초 · 바위 · 수정 곁에 잠깐 서 있으면 캡니다. 캔 자리는 8분 뒤 다시 납니다.${(g.cat|0)?` · 마법 부여 촉매 ${g.cat}개`:''}</p>
    ${e?`<p style="color:#ffd98a">마시는 중: ${G42_ELX[e.k].n} · ${G42_ELX[e.k].d} · ${Math.ceil(e.t/60)}분 남음</p>`:''}${tw?'':'<p style="color:#ff9a7a">마을이나 쉼터 안에서만 만들 수 있습니다.</p>'}</div>`;
  for(const C of G42_CRAFT)h+=`<div class="v20row"><div><b>${C.n}</b><br><span class="muted" style="font-size:12px">${g42CostTxt(C.cost)}</span></div><div class="btns">${v20Btn('g42craft',C.id,'만들기',{dis:!tw||!g42Can(C.cost)})}</div></div>`;
  return h}
G42.tabs.push({k:'craft',n:'제작',html:g42CraftHtml,dot:()=>false});

/* ===== 14 거점 키우기 ===== */
const G42_BSREG=['h29_reed','h29_kiln','h29_crystal','h29_snow','h29_bell','h29_veil'];
const G42_BSB={
 smith:{n:'대장간',d:L=>`마법 부여 금화 −${L*10}%`,mat:'ore',art:[['anvil',0,0],['rack',46,-10],['campfire',-40,14]]},
 herb:{n:'약초밭',d:L=>`한 시간마다 약초 ${L*2}${L>=3?' · 수정 1':''} (최대 하루치, 거점에 오면 거둠)`,mat:'herb',art:[['planter',0,0],['herb',36,8],['herb',-30,10],['flowerbed',0,30]]},
 dummy:{n:'훈련 허수아비',d:L=>`거점 안에서 휴식 기운이 ${L*50}% 더 빨리 쌓임`,mat:'ore',art:[['mannequin',0,0],['mannequin',40,12]]},
 bed:{n:'휴식 침대',d:L=>`게임을 끈 동안 휴식 기운 +${L*15}%`,mat:'cry',art:[['tent',0,0],['bed',48,20]]}};
const G42_BSC=[{gold:15000,m:8},{gold:50000,m:25},{gold:120000,m:50}];
const G42_BSMOVE=20000;
function g42Bs(){const g=g42S();if(!v20Obj(g.bs))g.bs={};const b=g.bs;if(!G42_BSREG.includes(b.reg))b.reg='';if(!v20Obj(b.b))b.b={};for(const k in G42_BSB)b.b[k]=Math.min(3,Math.max(0,b.b[k]|0));b.ht=Number.isFinite(+b.ht)?+b.ht:0;return b}
const g42BsHere=()=>{const b=g42Bs();return !!(b.reg&&REG.id===b.reg&&!DG&&!IN)};
const g42BsInCamp=()=>g42BsHere()&&inSafe(P.x,P.y,0);
V20A.g42bsset=()=>{const b=g42Bs(),reg=REG.id;if(!G42_BSREG.includes(reg)||!g42InTown()||b.reg===reg)return;if(b.reg){if(P.gold<G42_BSMOVE)return;P.gold-=G42_BSMOVE}b.reg=reg;b.ht=v20Now();g42BsProps();msg(`${RCACHE[reg].town.n||REGIONS[reg].n}을(를) 거점으로 삼았습니다`,'#ffd98a');save()};
V20A.g42bsup=k=>{const b=g42Bs(),B=G42_BSB[k];if(!B||!g42BsInCamp())return;const L=b.b[k];if(L>=3)return;const C=G42_BSC[L],M=g42Mat();if(P.gold<C.gold||M[B.mat]<C.m)return;
  P.gold-=C.gold;M[B.mat]-=C.m;b.b[k]=L+1;g42BsProps();v20GsBump();try{const a=g42Ac();a.bsup=(a.bsup|0)+1}catch(_){}
  rings.push({x:P.x,y:P.y,r:10,max:160,life:.9,col:'#ffd98a'});msg(`${B.n} ${L+1}단계: ${B.d(L+1)}`,'#ffd98a');save()};
// 약초밭 거두기 (거점 지역에 있을 때)
function g42BsHarvest(){const b=g42Bs(),L=b.b.herb|0;if(!L||!g42BsHere())return 0;const now=v20Now();if(!(b.ht>0)){b.ht=now;return 0}const h=Math.min(24,(now-b.ht)/36e5),n=Math.floor(h*L*2);if(n<1)return 0;
  const M=g42Mat();M.herb=Math.min(9999,M.herb+n);if(L>=3)M.cry=Math.min(9999,M.cry+Math.floor(h));b.ht=now;msg(`약초밭에서 약초 ${n}${L>=3&&Math.floor(h)?` · 수정 ${Math.floor(h)}`:''}을(를) 거뒀습니다`,'#8ae07a');return n}
V20.slowTick.push(st=>{if(!P||P.dead||!g42BsHere())return;g42BsHarvest();const L=g42Bs().b.dummy|0;if(L&&inSafe(P.x,P.y,0)&&typeof g42RestOn==='function'&&g42RestOn())g42RestAdd(st/3600*.5*L)});
{const _o=g42RestOffline;g42RestOffline=function(){const g=g42S(),ts=g.ts,now=v20Now(),L=(g42Bs().b.bed|0);const r=_o.apply(this,arguments);try{if(L&&ts>0&&now-ts>=6e4)g42RestAdd(Math.min(48,(now-ts)/36e5)*.15*L)}catch(e){if(window.__QA)throw e}return r}}
// 건물 소품: 거점 쉼터 안쪽 둘레에 (이미 쓰는 소품 그림)
function g42BsProps(){for(let i=decor.length-1;i>=0;i--)if(decor[i].g42bs)decor.splice(i,1);const b=g42Bs();if(!g42BsHere())return;const T=RCACHE[REG.id]&&RCACHE[REG.id].town;if(!T)return;
  const R0=tSafe(T)*.62,keys=Object.keys(G42_BSB);let a=v20Hash(REG.id)%628/100;
  for(const k of keys){const L=b.b[k]|0;if(!L)continue;const B=G42_BSB[k];let at=null;
    for(let t=0;t<40&&!at;t++){const aa=a+t*.16,x=T.x+Math.cos(aa)*R0,y=T.y+Math.sin(aa)*R0;if(!blockedAt(x,y)&&!blockedAt(x+50,y+30)&&!blockedAt(x-50,y+30)&&!decor.some(d=>(d.k==='bld'||d.k==='shop'||d.k==='stash'||d.k==='fountain'||d.k==='gate'||d.g42bs)&&Math.hypot(d.x-x,d.y-y)<110)){at={x,y};a=aa+.7}}
    if(!at)continue;B.art.slice(0,1+L).forEach(([pk,dx,dy],i)=>decor.push({k:pk,x:at.x+dx,y:at.y+dy,s:1,v:0,zl:0,g42bs:1,tprop:1,pv:i}))}}
{const _lr=loadRegion;loadRegion=function(){const r=_lr.apply(this,arguments);try{if(P)g42BsProps()}catch(e){if(window.__QA)throw e}return r}}
{const _ld=load;load=function(){const ok=_ld.apply(this,arguments);try{if(ok&&P)g42BsProps()}catch(e){if(window.__QA)throw e}return ok}}
function g42BsHtml(){const b=g42Bs(),M=g42Mat(),reg=REG.id,inCamp=G42_BSREG.includes(reg)&&g42InTown();
  let h=`<div class="v20box"><h3>거점 ${b.reg?`<b style="color:#ffd98a">${v20Esc(RCACHE[b.reg]&&RCACHE[b.reg].town?RCACHE[b.reg].town.n:REGIONS[b.reg].n)}</b> <span class="muted">· ${REGIONS[b.reg].n}</span>`:'<span class="muted">없음</span>'}</h3>
    <p class="muted" style="margin:4px 0">70~100레벨 여섯 쉼터 가운데 하나를 거점으로 삼고 건물을 올립니다. 건물은 거점 쉼터 안에서 올립니다(금화와 재료).${b.reg?` 거점을 옮기면 금화 ${G42_BSMOVE.toLocaleString()} (건물 단계는 그대로).`:''}</p>
    ${inCamp&&b.reg!==reg?v20Btn('g42bsset',1,b.reg?`이 쉼터로 거점 옮기기 (금화 ${G42_BSMOVE.toLocaleString()})`:'이 쉼터를 거점으로',{dis:!!b.reg&&P.gold<G42_BSMOVE}):''}</div>`;
  if(!b.reg)return h;const here=g42BsInCamp();
  for(const k in G42_BSB){const B=G42_BSB[k],L=b.b[k],C=G42_BSC[L];h+=`<div class="v20box"><div class="v20row" style="border:0;padding:0"><div><b>${B.n}</b> <span style="color:#ffd98a">${L}/3단계</span><br><span class="muted" style="font-size:12px">${L?'지금: '+B.d(L):'아직 없음'}${L<3?` · 다음: ${B.d(L+1)}`:''}</span></div>
    <div class="btns">${L>=3?'<button type="button" disabled>다 올림</button>':v20Btn('g42bsup',k,`올리기 · 금화 ${C.gold.toLocaleString()} · ${G42_MAT[B.mat].n} ${C.m}`,{dis:!here||P.gold<C.gold||M[B.mat]<C.m,title:here?'':'거점 쉼터 안에서'})}</div></div></div>`}
  return h}
G42.tabs.push({k:'bs',n:'거점',html:g42BsHtml,dot:()=>false});
G42.ach.push({id:'craft20',n:'솜씨 좋은 손',d:'물건 20개 만들기',need:20,cur:()=>g42AcN('craft'),grp:'성장',pts:10},{id:'bs12',n:'거점의 주인',d:'거점 건물 넷 모두 3단계',need:12,cur:()=>{const b=P.g42&&P.g42.bs&&P.g42.bs.b;if(!b)return 0;let n=0;for(const k in G42_BSB)n+=Math.min(3,b[k]|0);return n},grp:'성장',pts:30});
Object.assign(window.__g42,{g42RestOffline,G42F,G42_GREG,G42_ELX,G42_CRAFT,G42_BSB,G42_BSC,g42Mat,g42GSpots,g42Elx,g42Bs,g42BsProps,g42BsHarvest});
