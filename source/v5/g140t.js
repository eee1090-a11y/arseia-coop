/* ---------- v58 후보 · 별의 탑 (다-2) ----------
   사용자 2026-11-08 「고레벨 컨텐츠 다음배치 만들고」 → 제안 다-2 「추천대로」.
   · 입구: 첨탑 광장 바깥 「별의 탑」 문(F) · 140레벨부터 · 난이도 상관없음(레벨 고정). 탑지기 오린이 광장에서 알려 준다.
   · 층 = 둥근 큰 방 하나. 3분 안에 그 층 몬스터를 모두 쓰러뜨리면 위층 문이 열린다. 시간이 다 되거나 (혼자일 때) 쓰러지면 그 층에서 끝(나가는 문으로).
     몬스터 레벨 141 고정(140 넘는 규칙: 한 대 피해 140 값 · 생명력 +3%) · 수 min(12, 6 + 층/10) (같이 하기 +2) · 생명력 ×(1 + 0.05 × (층−1)) · 한 대 피해 ×(1 + min(0.4, 0.005 × (층−1))).
     5층마다 정예 둘 더 · 10층마다 탑의 주인(넷이 돌아가며). 가장 높은 층 100.
   · 발판: 가장 높이 오른 층의 5층 단위 다음 층부터 바로 시작(성장(G) 「별」 칸에서 1층부터로 바꿀 수 있음).
   · 기록: 가장 높이(tb) · 이번 주 가장 높이(wb · 월요일 아침 9시에 새로). 주간 보상은 「별」 칸에서 받기:
     별 조각 floor(wb/5)×2 (최대 40) · 강자의 증표 floor(wb/10)×2 · 재의 결정 wb(최대 60). 받은 뒤 더 오르면 차이만큼 더.
     처음 닿은 5층마다 별 조각 +3 · 10층마다 강자의 증표 +1 · 5층마다 희귀 이상 장비 하나.
   · 같이 하기: 방장(혼자면 나)이 층을 짓고 보낸다(DM21 a21 k:'tw'). 기록 · 보상은 각자 화면.
   · 저장: P.g100.g140.tw {tb, wk, wb, cw(이번 주 받은 층), r5(처음 닿은 보상을 받은 가장 높은 5층), one(1층부터)} — 없으면 기본값. */
const G140W={id:G140.tower,ci:970,lv:141,time:180,maxF:100,cp:5,n0:6,nMax:12,hpF:.05,dmgF:.005,dmgMax:.4,elite5:2,
  bosses:['b_tw2_warden','b_tw2_twin','b_tw2_hunter','b_tw2_void'],pool:['sk2_gull','sk2_ram','sk2_sprite','sk2_knight','sk2_drake','sk2_giant','gr2_moth','gr2_wraith','gr2_golem','gr2_hound','gr2_knight','gr2_eye'],
  shMax:40,ashMax:60,title:'별의 탑 서른 층',titleF:30};
const G140WV={gate:null,sendT:0,qaWk:null};
const g140WD={id:G140W.id,a21:'tw',n:'별의 탑',floor:[44,40,64],wall:['#4a4a6a','#14122a','#c8c0e8'],torch:'#e8e0ff',lvl:G140W.lv,mobs:[],minis:[],boss:null};
if(!DGMAT[g140WD.id])DGMAT[g140WD.id]=wxDgMat(g140WD);DM21_DESC[g140WD.id]=g140WD;
const g140Wk=()=>G140WV.qaWk!=null?G140WV.qaWk:Math.floor((Math.floor(Date.now()/86400000)+3)/7);/* 월요일 00:00 UTC = 한국 아침 9시 */
function g140Tw(){const s=g140S(),t=s.tw;for(const k of ['tb','wk','wb','cw','r5'])t[k]=g140Int(t[k],100000);t.one=t.one?1:0;
  const w=g140Wk();if(t.wk!==w){t.wk=w;t.wb=0;t.cw=0}return t}
const g140TwStart=()=>{const t=g140Tw();return t.one?1:Math.min(G140W.maxF,Math.max(1,Math.floor(t.tb/G140W.cp)*G140W.cp+1))};
/* ===== 층 짓기 ===== */
function g140TwGrid(){const g=new Uint8Array(DN*DN),cx=17.5,cy=12.5,rx=10,ry=9;
  for(let j=1;j<DN-1;j++)for(let i=1;i<DN-1;i++){const dx=(i-cx)/rx,dy=(j-cy)/ry;if(dx*dx+dy*dy<=1)g[tIdx(i,j)]=1}
  for(let j=21;j<=27;j++)for(let i=17;i<=18;i++)g[tIdx(i,j)]=1;for(let j=27;j<=31;j++)for(let i=15;i<=20;i++)g[tIdx(i,j)]=1;
  return{g,rooms:[{i:15,j:27,w:6,h:5,cx:18,cy:29},{i:8,j:4,w:20,h:18,cx:18,cy:12}]}}
const g140TwBoss=f=>f%10===0?G140W.bosses[(f/10-1)%G140W.bosses.length]:null;
const g140TwN=f=>Math.min(G140W.nMax,G140W.n0+Math.floor(f/10));
function g140TwMob(k,x,y,f,o){const e=dgMob(k,x,y,G140W.lv,o);if(!e)return null;const h=1+G140W.hpF*(f-1),d=1+Math.min(G140W.dmgMax,G140W.dmgF*(f-1));
  e.hp=e.max=Math.max(1,Math.round(e.max*h));e.dmg*=d;if(e.dmg2)e.dmg2*=d;e.aggroed=true;e.g140f=f;return e}
function g140TwEnter(f){if(NET.guest)return false;if(!P)return false;if(P.lvl<G140.minLv){msg(`별의 탑은 ${G140.minLv}레벨부터 들어갈 수 있습니다 (지금 Lv${P.lvl})`,'#a39d8f');return false}
  f=clamp((f|0)||g140TwStart(),1,G140W.maxF);const G0=G140WV.gate;if(!G0||!G0.d)return false;
  if(REG.id!==G0.reg){if(DG)leaveDungeon();loadRegion(G0.reg)}if(!panel.hidden)closePanel();return g140TwFloor(f)}
function g140TwFloor(f){const G0=G140WV.gate,rg=mulberry((R()*2147483647)|0),tag=`tw|${f}|${Date.now()%1e7}|${(R()*1e6)|0}`;
  const a21={k:'tw',id:G140W.id,f,left:G140W.time,tag,total:0,alive:0,open:0,fail:0,t:0};
  const order=dm21Make(g140WD,G140W.ci,{x:G0.d.x,y:G0.d.y+80},G140W.lv,g140TwGrid(),rg,a21);DM21.raw=0;
  const ar=order[0]||DG.rooms[1],c=tc(ar.cx,ar.cy),pty=typeof PTY==='object'&&PTY.partyN?PTY.partyN():1;
  const spot=()=>{for(let k=0;k<30;k++){const a=rg()*6.283,d=Math.sqrt(rg())*.8,x=c.x+Math.cos(a)*d*9*TS,y=c.y+Math.sin(a)*d*8*TS;if(dgFree(x,y,16))return{x,y}}return{x:c.x+rnd(-80,80),y:c.y+rnd(-80,80)}};
  let n=g140TwN(f)+(pty>1?2:0);const tagE=e=>{if(e){e.twT=tag;a21.total++}return e};
  for(let i=0;i<n;i++){const p=spot();tagE(g140TwMob(G140W.pool[Math.floor(rg()*G140W.pool.length)],p.x,p.y,f,i===0&&rg()<.3?{elite:1}:null))}
  if(f%5===0)for(let i=0;i<G140W.elite5;i++){const p=spot();tagE(g140TwMob(G140W.pool[Math.floor(rg()*G140W.pool.length)],p.x,p.y,f,{elite:1}))}
  const bk=g140TwBoss(f);if(bk){const e=tagE(g140TwMob(bk,c.x,c.y-40,f));DG.boss=e}
  a21.alive=a21.total;
  banner={t:`별의 탑 ${f}층`,sub:`3분 안에 모두 쓰러뜨리기 · 몬스터 Lv${G140W.lv} · ${a21.total}마리${bk?` · ${TYPES[bk].n}`:''}`,col:'#e8e0ff',life:2.8,max:2.8};
  msg(`별의 탑 ${f}층 · 3분 안에 이 층 몬스터 ${a21.total}마리를 모두 쓰러뜨리면 위층 문이 열립니다`,'#e8e0ff');
  if(NET.on&&NET.host)netSend({t:'dg',d:netDgData()});save();return DG}
// 같이 하기: 참가자는 받은 층 그대로 (DM21 · 동굴 번호 없음)
{const _ne=netEnterDg;netEnterDg=function(D){if(D&&D.a21&&typeof D.a21==='object'&&D.a21.k==='tw'){const r=dm21NetEnter(D);if(r&&DG&&DG.a21){DG.a21.guest=1;banner={t:`별의 탑 ${DG.a21.f|0}층`,sub:`파티와 함께 · 3분 안에 모두 쓰러뜨리기 · 몬스터 Lv${G140W.lv}`,col:'#e8e0ff',life:2.6,max:2.6}}return r}return _ne.apply(this,arguments)}}
const g140TwA=()=>DG&&DG.a21&&DG.a21.k==='tw'?DG.a21:null;
/* ===== 층 끝 (모든 화면에서 각자 기록) ===== */
function g140TwDoor(a){if(!a.door&&DG){const r=DG.rooms[1]||DG.start,p=tc(r.cx,r.cy);a.door={x:p.x,y:p.y-60}}return a.door}
function g140TwClear(a){if(a._clr)return;a._clr=1;a.open=1;g140TwDoor(a);const f=a.f|0,t=g140Tw();
  const prevTb=t.tb;t.tb=Math.max(t.tb,f);t.wb=Math.max(t.wb,f);let extra=[];
  // 처음 닿은 5층 · 10층
  while(t.r5+G140W.cp<=t.tb){t.r5+=G140W.cp;g140ShAdd(3,P.x,P.y);extra.push(`처음 ${t.r5}층: 별 조각 3`);if(t.r5%10===0&&typeof g100TokAdd==='function'){g100TokAdd(1,P.x,P.y+20);extra.push('강자의 증표 1')}}
  if(f%5===0){let it=null;for(let i=0;i<80&&!(it&&it.rar>=2);i++)it=makeItem(MAXLV,true);if(it&&it.rar<2)it.rar=2;if(it){const p=a.door||P;loot.push({x:p.x+rnd(-40,40),y:p.y+rnd(30,70),kind:'item',item:it,t:0,keep:1})}}
  if(f<G140W.maxF&&a.door)DG.portals.push({x:a.door.x,y:a.door.y,dm21:'g140n',col:'#e8e0ff',lab:`${f+1}층으로 가는 문`});
  if(a.door){rings.push({x:a.door.x,y:a.door.y,r:10,max:160,life:.9,col:'#e8e0ff'});burst(a.door.x,a.door.y,'#e8e0ff',40,180,3,20)}
  banner={t:`별의 탑 ${f}층 돌파`,sub:`남은 시간 ${Math.ceil(a.left)}초 · 가장 높이 ${t.tb}층 · 이번 주 ${t.wb}층${extra.length?' · '+extra.join(' · '):''}`,col:'#e8e0ff',life:3,max:3};
  msg(`별의 탑 ${f}층 돌파!${f<G140W.maxF?` 위층 문이 열렸습니다`:' 꼭대기입니다'}${t.tb>prevTb?` · 새 기록 ${t.tb}층`:''}`,'#e8e0ff');save()}
function g140TwFail(a,why){if(a._fl)return;a._fl=1;a.fail=1;if(DG)DG.boss=null;if(!a.guest&&!NET.guest)for(const e of enemies.slice())if(e.twT===a.tag&&!e.dead){const i=enemies.indexOf(e);if(i>=0)enemies.splice(i,1)}
  banner={t:why||'시간이 다 됐습니다',sub:`별의 탑 ${a.f}층에서 멈춤 · 나가는 문으로 돌아가세요 · 가장 높이 ${g140Tw().tb}층`,col:'#a8a0c0',life:3,max:3};msg('별의 탑: 시간이 다 됐습니다. 이번 오름은 여기까지예요 · 나가는 문(처음 방)으로 나가세요','#a8a0c0')}
function g140TwTick(dt){const a=g140TwA();if(!a)return;a.t+=dt;if(!a.open&&!a.fail)a.left=Math.max(0,a.left-dt);
  g140TwDoor(a);
  if(a.guest||NET.guest)return;let alive=0;for(const e of enemies)if(e.twT===a.tag&&!e.dead&&e.hp>0)alive++;a.alive=alive;
  if(!a.open&&!a.fail){if(alive===0&&a.total>0)g140TwClear(a);else if(a.left<=0)g140TwFail(a);else if(P.dead&&!(NET.on&&PTY.partyN()>1))g140TwFail(a,'쓰러졌습니다')}
  if(NET.on){G140WV.sendT-=dt;if(G140WV.sendT<=0||a._sentO!==a.open||a._sentF!==a.fail){G140WV.sendT=1;a._sentO=a.open;a._sentF=a.fail;v20Send('g140ts',{f:a.f,l:Math.round(a.left),n:a.alive,o:a.open?1:0,x:a.fail?1:0})}}}
V20.tick.push(dt=>{try{g140TwTick(dt)}catch(e){if(window.__QA)throw e}});
V20NET.g140ts=m=>{const a=g140TwA();if(!NET.guest||!a||(a.f|0)!==(m.f|0))return;a.left=+m.l||0;a.alive=m.n|0;if(m.o&&!a.open)g140TwClear(a);if(m.x&&!a.fail)g140TwFail(a)};
V20NET.g140go=(m,r)=>{const a=g140TwA();if(!NET.host||!a||(a.f|0)!==(m.f|0)||!a.open)return;msg(`${r&&r.name||'동료'}님이 위층으로 이끕니다`,'#e8e0ff');g140TwNext()};
function g140TwNext(){const a=g140TwA();if(!a)return;if(!a.open){msg('위층 문이 아직 잠겨 있습니다','#a39d8f');return}if(a.f>=G140W.maxF){msg('여기가 별의 탑 꼭대기입니다','#e8e0ff');return}
  if(NET.guest){v20Send('g140go',{f:a.f});msg('방장에게 위층으로 가자고 했습니다','#9fe0ff');return}g140TwFloor(a.f+1)}
// 화면 위: 층 · 남은 시간 · 남은 몬스터
DM21GLOW.push(()=>{const a=g140TwA();if(!a)return;ctx.font=`700 15px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';
  const m=Math.floor(a.left/60),s=Math.floor(a.left%60),txt=`별의 탑 ${a.f}층 · ${a.open?'돌파!':a.fail?'시간 끝':`${m}:${String(s).padStart(2,'0')} · 남은 몬스터 ${a.alive|0}`}`;
  ctx.strokeText(txt,W/2,96);ctx.fillStyle=a.fail?'#a8a0c0':a.left<30&&!a.open?'#ffb07a':'#e8e0ff';ctx.fillText(txt,W/2,96)});
DM21ACT.g140n={label:()=>{const a=g140TwA();return a?`${(a.f|0)+1}층으로 (F)${NET.guest?' · 방장에게 부탁':''}`:''},go:()=>g140TwNext()};
/* ===== 주간 보상 ===== */
const g140TwRw=f=>({sh:Math.min(G140W.shMax,Math.floor(f/5)*2),tok:Math.floor(f/10)*2,ash:Math.min(G140W.ashMax,f)});
function g140TwClaim(){if(!P)return false;const t=g140Tw();if(t.wb<=t.cw){msg('받을 주간 보상이 없습니다 · 이번 주에 더 높이 올라 보세요','#a39d8f');return false}
  const A=g140TwRw(t.wb),B=g140TwRw(t.cw),d={sh:A.sh-B.sh,tok:A.tok-B.tok,ash:A.ash-B.ash};t.cw=t.wb;
  if(d.sh>0)g140ShAdd(d.sh,P.x,P.y);if(d.tok>0&&typeof g100TokAdd==='function')g100TokAdd(d.tok,P.x,P.y+20);if(d.ash>0&&typeof ashGain==='function')ashGain(d.ash,P.x,P.y);
  msg(`별의 탑 주간 보상 (이번 주 ${t.wb}층): 별 조각 ${d.sh} · 강자의 증표 ${d.tok} · 재의 결정 ${d.ash}`,'#ffd76a');save();return true}
V20A.g140tw=k=>{if(k==='claim')g140TwClaim();else if(k==='one'){const t=g140Tw();t.one=t.one?0:1;save()}};
if(typeof V20==='object'&&V20.titles)V20.titles.push({id:'g140tw30',n:G140W.title,col:'#e8e0ff',src:'별의 탑 30층 오르기',have:()=>!!(P&&g140Tw().tb>=G140W.titleF)});
/* ===== 입구 ===== */
const G140WG={id:'g140tw',reg:R110.sq,k:'g140tower',n:'별의 탑',h:330,dot:'#e8e0ff',
  lab:()=>({t:'별의 탑',s:P.lvl<G140.minLv?`${G140.minLv}레벨부터`:`가장 높이 ${g140Tw().tb}층 · 이번 주 ${g140Tw().wb}층 · ${g140TwStart()}층부터`,col:'#e8e0ff'}),
  live:()=>({label:`별의 탑 오르기 · ${g140TwStart()}층부터`,col:'#e8e0ff',q:0}),
  go:()=>{if(NET.guest){v20Send('dmgate',{g:'g140tw'});msg('방장에게 별의 탑으로 가자고 했습니다','#9fe0ff');return}g140TwEnter()},hostGo:()=>g140TwEnter(),
  glow:s=>{ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.45+.15*Math.sin(time*2.2);glow(s.x,s.y-300,34,'#fff6d0');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}};
{const L=RCACHE[R110.sq],T=L&&L.town;if(T){const p=dm21FindSpot(R110.sq,T,-Math.PI*.5,{r0:SAFE+120,r1:SAFE+700})||{x:T.x,y:T.y-SAFE-200};dm21AddGate(G140WG,p.x,p.y);G140WV.gate=G140WG}}
/* ===== 업적 · 성장(G) 「별」 칸 ===== */
if(typeof G42==='object'&&Array.isArray(G42.ach)){const add=(id,n,d,need,cur,pts)=>G42.ach.push({id,n,d,need,cur,grp:'140레벨 이후',pts:pts||10});
  add('g140tw10','별의 탑 10층','별의 탑 10층 오르기',10,()=>Math.min(10,g140Tw().tb),10);
  add('g140tw30','별의 탑 30층','별의 탑 30층 오르기',30,()=>Math.min(30,g140Tw().tb),20);
  add('g140tw60','별의 탑 60층','별의 탑 60층 오르기',60,()=>Math.min(60,g140Tw().tb),30)}
function g140StarHtml(){const s=g140S(),t=g140Tw(),rw=g140TwRw(t.wb),got=g140TwRw(t.cw),can=t.wb>t.cw;
  let h=`<div class="v20box"><h3>별 조각 <span class="muted">가진 것 ${s.sh|0}개 · 모은 것 ${s.got|0}개</span></h3><p class="muted" style="margin:2px 0">부서진 하늘섬 · 별바다 가장자리 · 두 던전 · 별의 탑에서 나옵니다(보통 몬스터 가끔 · 정예 더 잘 · 준보스 1 · 보스 3). 140레벨 장비를 더 세게 만드는 「별빛 강화」에 씁니다(곧 마을 대장간에서).</p>`;
  h+=`<p style="margin:4px 0">하늘 계단: ${g140Open()?'<span style="color:#fff6a0">열림</span> (구름 돌기둥 숲 큰 구덩이 곁)':'잠김 · 「식은 별의 심장」을 한 번 쓰러뜨리면 열림'} · 별 너머 땅의 주인 ${G140.bosses.filter(k=>s.bk[k]).length}/2</p></div>`;
  h+=`<div class="v20box"><h3>별의 탑 <span class="muted">가장 높이 ${t.tb}층 · 이번 주 ${t.wb}층</span></h3><p class="muted" style="margin:2px 0">첨탑 광장 바깥 탑 문 · 140레벨부터. 한 층 3분 · 다 쓰러뜨리면 위층. 10층마다 탑의 주인. 이번 주 기록은 월요일 아침 9시에 새로 셉니다.</p>`;
  h+=`<div class="v20row"><div><b>이번 주 보상</b> <span class="muted">${t.wb}층 몫: 별 조각 ${rw.sh} · 강자의 증표 ${rw.tok} · 재의 결정 ${rw.ash}${t.cw?` (받은 것 ${t.cw}층 몫)`:''}</span></div><div class="btns">${v20Btn('g140tw','claim',can?'받기':'받음',{dis:!can,title:can?'':'이번 주에 더 높이 오르면 차이만큼 더 받습니다'})}</div></div>`;
  h+=`<div class="v20row"><div><b>시작 층</b> <span class="muted">${t.one?'늘 1층부터':`가장 높이 오른 층의 5층 단위 다음 층(지금 ${g140TwStart()}층)부터`}</span></div><div class="btns">${v20Btn('g140tw','one',t.one?'발판에서 시작':'1층부터 시작')}</div></div></div>`;return h}
G42.tabs.push({k:'g140star',n:'별',html:g140StarHtml,dot:()=>!!P&&P.lvl>=G140.minLv&&g140Tw().wb>g140Tw().cw});
window.__g140t={G140W,G140WV,G140WG,g140Tw,g140TwStart,g140TwEnter,g140TwFloor,g140TwClear,g140TwFail,g140TwNext,g140TwClaim,g140TwRw,g140TwGrid,g140Wk};
