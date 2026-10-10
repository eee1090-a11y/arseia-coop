/* ---------- v21 MAZE: 공통 층 짓기(DM21) · 변하는 미궁 「뒤엉킨 도시 오르타」 ----------
   설계: rpg/v20-ideas/code/maze.js (Q3). 50레벨부터, 층 f의 몬스터 레벨 = 49+f, 최고 층 = MAXLV-49.
   · 입구: 헤이븐 교차로 동쪽 길 끝 「오르타 길잡이 조합」 천막 + 짝문(동굴처럼 F) · 조합장 네라(헤이븐 마을 사람)
   · 층 = 방 3~5개 + 다음 층 짝문(그 층 몬스터 80% 처치 뒤 열림, 보스 층은 보스까지). 5층마다 준보스, 10층마다 보스.
   · 구조 · 몬스터 · 골목 규칙은 그날 날짜 + 층 번호 씨앗(같은 날 같은 층 = 같은 모양). 협동은 방장이 짓고 netDgData로 보낸다.
   · 5층마다 발판(그날 다시 시작) · 날이 바뀌면 (최고 층 − 10, 5 단위 내림)+1층부터.
   · 레벨 고정: 난이도 레벨 덧셈 · 생명력 배수 없음. 몬스터 한 대 피해는 FIELD_BUDGET(필드 15~23% + 레벨당 1%, 준보스 28%, 보스 34%) 안으로 맞춘다.
   · 저장 P.maze={best,day,step,keys,cape,got} (없으면 기본값, 모르는 칸은 그대로 다시 쓴다).
   DM21(공통): 씨앗 방 짓기 dm21Gen · DG 만들기 dm21Make · 레벨 고정 몬스터(dgMob 감싸기) · 다음 층/짝문/쓰는 자리 문(act) · 같이 하기 a21 데이터. 3막(act3-21.js)도 이것을 쓴다. */
const DM21={raw:0};
const MZ={minLv:50,lvAt:f=>49+f,maxFloor:()=>Math.max(1,MAXLV-49),checkpoint:5,clearPct:.8,gate:null,n:0,qaDay:null};
window.__mz=MZ;
/* ===== 1) 데이터 (설계 maze.js 그대로) ===== */
const MAZE_POOL=['wolf','ashhound','goblin','ashsoldier','wraith','ogre','ashknight','p_raider','p_ogre','p_storm','f_were','f_golem','f_dryad','d_scorp','d_mummy','d_sand',
  'i_yeti','i_wraith','i_elem','i_knight','j_lizard','j_panther','j_golem','l_imp','l_golem','l_elem','l_knight','s_crab','s_drown','s_siren',
  'h_cairn','h_keen','h_troll','k_bear','k_harpy','k_shaman','c_bandit','c_automaton','t_harpy','t_drake','t_cultist','v_shade','v_knight','v_seer'].filter(k=>TYPES[k]);
const MAZE_MINIS=['m_bolg','m_wolfking','m_grol','m_drowned','m_herdin','m_packlord','m_seren','m_archbishop'].filter(k=>TYPES[k]);
const MAZE_BOSSES=['b_arsil','b_devourer','b_baldrak','b_morgath','r_grumba','r_eldrak','r_sakra','r_hrimnir','r_kali','r_ifrit','r_merrow'].filter(k=>TYPES[k]);
const MAZE_RULES=[
  {id:'pairdoor',n:'짝문',d:'방 사이에 짝문 둘이 서로 이어져 있다. 들어가면 다른 방으로 순간이동.'},
  {id:'dark',n:'꺼진 등불',d:'시야가 좁아진다(빛 반경 60%). 빛·신성 마법을 쓰면 잠깐 밝아진다.'},
  {id:'swift',n:'급한 골목',d:'몬스터 이동 속도 +25%(피해는 그대로).'},
  {id:'echo',n:'메아리',d:'쓰러진 몬스터 셋 중 하나가 2초 뒤 생명력 30%로 한 번 다시 일어난다.'},
  {id:'drain',n:'마른 우물',d:'마나 회복 −30%. 대신 층 상자 열쇠 +1.'},
  {id:'heavy',n:'무거운 공기',d:'모든 재사용 대기 +15%. 대신 몬스터 생명력 −15%.'},
  {id:'crowd',n:'장날',d:'몬스터 수 +40%, 생명력 −20%. 광역 기술이 빛나는 층.'},
  {id:'lone',n:'외길',d:'방이 한 줄로만 이어진다. 정예가 방마다 하나.'},
  {id:'mirror',n:'비친 골목',d:'방 하나에 내 그림자가 나온다(세계의 신비 「소금 거울」과 같은 규칙).'},
  {id:'rune',n:'깨어난 룬',d:'바닥 룬 위에 서면 피해 +15%(덧셈). 룬은 10초마다 자리를 옮긴다.'},
  {id:'quiet',n:'침묵의 골목',d:'2초 넘는 시전이 20% 빨라진다. 대신 즉시 시전 마나 +20%.'},
  {id:'shift',n:'바뀌는 이음새',d:'30초마다 짝문 연결이 한 번 바뀐다(작은 지도에 표시).'}];
const MZR={};for(const r of MAZE_RULES)MZR[r.id]=r;
const MAZE_SHOP=[
  {id:'reroll',cost:6,n:'옵션 다시 굴리기',d:'가방의 희귀 장비 하나의 옵션 한 줄을 다시 굴린다(+모든 스킬 옵션은 나오지 않음).'},
  {id:'box',cost:12,n:'오르타 장비 상자',d:'내 레벨 장비 하나(정예가 떨구는 것과 같은 표).'},
  {id:'forget',cost:8,n:'망각의 물약',d:'스킬·능력치 다시 찍기.'},
  {id:'pots',cost:3,n:'물약 꾸러미',d:'지금 레벨에 맞는 생명력·마나 물약 5개씩.'},
  {id:'cape',cost:20,n:'길잡이 망토 겉모습',d:'겉모습만(능력치 없음). 내 망토를 길잡이 조합의 남빛 망토로 바꿔 입는다. 한 번 사면 켜고 끌 수 있다.'}];
const mazeStart=best=>Math.max(1,Math.floor(Math.max(0,best-10)/5)*5+1);
// 층 그림: 열 층마다 바뀌는 세 가지 골목 (연구 도시 · 룬 돌길 · 무너진 탑)
const MZ_PAL=[
  {id:'mz_orta0',floor:[52,50,66],wall:['#4e4a66','#24223a','#6a6488'],torch:'#9ab8ff'},
  {id:'mz_orta1',floor:[58,52,48],wall:['#5e5446','#2a241e','#7a6e5c'],torch:'#ffd08a'},
  {id:'mz_orta2',floor:[44,54,56],wall:['#3e5a5e','#1a2a2e','#5a7a7e'],torch:'#8affe0'}];
for(const p of MZ_PAL)if(!DGMAT[p.id])DGMAT[p.id]=wxDgMat(p);
function mzDesc(f){const p=MZ_PAL[Math.floor((f-1)/10)%3];return{id:p.id,a21:'mzf',n:`오르타 ${f}층`,floor:p.floor,wall:p.wall,torch:p.torch,lvl:MZ.lvAt(f),mobs:[],minis:[],boss:null}}

/* ===== 2) DM21 공통: 씨앗 방 짓기 · DG 만들기 ===== */
function dm21Gen(rng,o){const g=new Uint8Array(DN*DN),rooms=[],ri2=(a,b)=>a+Math.floor(rng()*(b-a+1)),want=ri2(o.n[0],o.n[1]);
  for(let tries=0;tries<800&&rooms.length<want;tries++){const w=ri2(o.w[0],o.w[1]),h=ri2(o.w[0],o.w[1]),i=ri2(2,DN-w-3),j=ri2(2,DN-h-3);
    if(rooms.some(r=>i<r.i+r.w+3&&i+w+3>r.i&&j<r.j+r.h+3&&j+h+3>r.j))continue;rooms.push({i,j,w,h,cx:i+(w>>1),cy:j+(h>>1)})}
  for(const r of rooms)for(let y=r.j;y<r.j+r.h;y++)for(let x=r.i;x<r.i+r.w;x++)g[tIdx(x,y)]=1;
  const dig=(x,y)=>{for(let a=0;a<2;a++)for(let b=0;b<2;b++){const X=clamp(x+a,1,DN-2),Y=clamp(y+b,1,DN-2);g[tIdx(X,Y)]=1}};
  const link=(r,q)=>{let x=r.cx,y=r.cy;if(rng()<.5){while(x!==q.cx){dig(x,y);x+=Math.sign(q.cx-x)}while(y!==q.cy){dig(x,y);y+=Math.sign(q.cy-y)}}else{while(y!==q.cy){dig(x,y);y+=Math.sign(q.cy-y)}while(x!==q.cx){dig(x,y);x+=Math.sign(q.cx-x)}}dig(x,y)};
  if(o.lone){// 외길: 가장 가까운 방을 차례로 이어 한 줄로
    const left=rooms.slice(1),line=[rooms[0]];while(left.length){const c=line[line.length-1];let bi=0,bd=1e9;left.forEach((r,i)=>{const d=Math.abs(r.cx-c.cx)+Math.abs(r.cy-c.cy);if(d<bd){bd=d;bi=i}});line.push(left.splice(bi,1)[0])}
    for(let i=1;i<line.length;i++)link(line[i],line[i-1]);rooms.length=0;rooms.push(...line)}
  else{const done=[rooms[0]];while(done.length<rooms.length){let best=null,bd=1e9;for(const r of rooms){if(done.includes(r))continue;for(const q of done){const dd=Math.abs(r.cx-q.cx)+Math.abs(r.cy-q.cy);if(dd<bd){bd=dd;best=[r,q]}}}link(best[0],best[1]);done.push(best[0])}}
  return{g,rooms}}
// DG를 만들고(바닥·벽·횃불·나가는 문) 플레이어를 첫 방에 세운다. 돌려주는 것: 첫 방에서 먼 차례의 방들
function dm21Make(d,ci,ret,lvl,G,rng,a21){const {g,rooms}=G,st=rooms[0],D0=bfs(g,st.cx,st.cy);
  const order=rooms.slice(1).sort((a,b)=>D0[tIdx(b.cx,b.cy)]-D0[tIdx(a.cx,a.cy)]);
  if(IN&&typeof twLeave==='function')try{twLeave(true,true)}catch(_){}
  DG={d,ci,g,rooms,ret,lvl,flow:null,ft:-1,portals:[],walls:[],torches:[],floor:[],bossDead:false,boss:null,start:st,a21};
  for(let j=0;j<DN;j++)for(let i=0;i<DN;i++){if(g[tIdx(i,j)]===1){DG.floor.push([i,j]);continue}
    let adj=false;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(dgFloor(i+a,j+b))adj=true;
    if(adj){const c2=tc(i,j);DG.walls.push({x:c2.x,y:c2.y,i,j,wall:1,h:rng()<.1?150:120});
      if(rng()<.09){const sides=[[1,0],[0,1]].filter(([a,b])=>dgFloor(i+a,j+b));if(sides.length){const [a,b]=sides[0];DG.torches.push({x:c2.x+a*52,y:c2.y+b*52,light:150,torch:1})}}}}
  enemies=[];projs=projs.filter(p=>p.owner==='p'&&p.ghost);projs=[];fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  const p0=tc(st.cx,st.cy);DG.portals.push({x:p0.x+60,y:p0.y+60,exit:1});
  P.x=p0.x;P.y=p0.y;for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}followCam();return order}
// 방 안 빈자리
function dm21Spot(r,rng,pad){pad=pad==null?0:pad;for(let k=0;k<20;k++){const i=r.i+pad+Math.floor(rng()*Math.max(1,r.w-pad*2)),j=r.j+pad+Math.floor(rng()*Math.max(1,r.h-pad*2)),p=tc(i,j);if(dgFree(p.x,p.y,14))return p}return tc(r.cx,r.cy)}
// 몬스터 한 대 피해 상한 (wx-world.js FIELD_BUDGET · qa 「들판 몬스터 한 대 피해」 와 같은 식): 레벨 L에서 실제 dmg 값
function dm21Role(t){return t.boss?'boss':t.mini?'mini':t.ranged?'ranged':t.spd>=150?'fast':(t.spd<=80||t.r>=22)?'heavy':'melee'}
function dm21Cap(k,L,elite){const t=TYPES[k]||{},B=FIELD_BUDGET,hp=40+12*L+4*(10+1.5*(L-1)),g=1+Math.max(0,L-B.growFrom)*B.grow;return B[dm21Role(t)]*hp*g*(elite?1.4:1)}
// 내 던전 안에서 나오는 몬스터는 모두(부하 포함) 레벨 고정 규칙: 난이도 생명력 배수를 빼고, 한 대 피해를 상한 안으로
{const _dm=dgMob;dgMob=function(k,x,y,lvl,extra){const e=_dm.apply(this,arguments);if(e&&DG&&DG.a21&&!DM21.raw)dm21Fix(e);return e}}
function dm21Fix(e){const t=TYPES[e.k];if(!t||e.dm21)return e;e.dm21=1;const Dh=DIFF[P.diff].hp||1;e.hp=e.max=Math.max(1,Math.round(e.max/Dh));
  if(DG.a21.k==='mz'&&!t.boss&&!t.mini&&!t.dmg0){const L=e.lvl,base=clamp(t.hp,220,900);e.hp=e.max=Math.round(base*(1+.34*(L-1))*(e.elite?3:1));e.dmg=dm21Cap(e.k,L,e.elite)*.92}
  else if(DG.a21.k==='mz'){const L=e.lvl,base=clamp(t.hp,t.boss?2400:700,t.boss?3400:1000);e.hp=e.max=Math.round(base*(1+.34*(L-1)));e.dmg=dm21Cap(e.k,L,0)*.9}
  else if(t.dmg>0)e.dmg=Math.min(e.dmg,dm21Cap(e.k,e.lvl,e.elite));
  if(DG.a21.k==='mz'){const R0=DG.a21.rules||[];let m=1;if(R0.includes('heavy'))m-=.15;if(R0.includes('crowd'))m-=.2;if(m!==1){e.hp=e.max=Math.max(1,Math.round(e.max*m))}}
  return e}
// 같이 하기: 방장 DG의 a21 덧붙이기 · 참가자는 그 층 그림과 규칙으로 바꾼다
{const _nd=netDgData;netDgData=function(){const d=_nd();if(DG&&DG.a21){const a=DG.a21,o={};for(const k in a)if(!/^_/.test(k)&&typeof a[k]!=='function')o[k]=a[k];d.a21=o}return d}}
const DM21_DESC={};// 3막 던전 설명 (act3-21.js가 채움)
// 참가자: 내 던전은 동굴 번호가 없으므로(ci 960~) 받은 그대로 짓는다 (net.js netEnterDg와 같은 순서)
function dm21NetEnter(D){const rg=REGIONS[D.reg]?D.reg:'home';if(IN)twLeave(true,true);if(REG.id!==rg)loadRegion(rg);const a=Object.assign({},D.a21,{guest:1,t:0});
  const d=a.k==='mz'?mzDesc(a.f|0||1):DM21_DESC[a.id];if(!d)return false;
  enemies=[];projs=projs.filter(p=>p.owner==='p');fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  DG={d,ci:D.ci,net:1,g:D.g,rooms:D.rooms,ret:D.ret,lvl:D.lvl,flow:null,ft:-1,portals:D.portals,walls:[],torches:[],floor:[],bossDead:!!D.bd,boss:null,start:D.rooms[D.st]||D.rooms[0],a21:a};
  for(let j=0;j<DN;j++)for(let i=0;i<DN;i++)if(D.g[tIdx(i,j)]===1)DG.floor.push([i,j]);
  for(const [i,j,h] of D.walls){const c2=tc(i,j);DG.walls.push({x:c2.x,y:c2.y,i,j,wall:1,h})}
  for(const [x,y] of D.torches)DG.torches.push({x,y,light:150,torch:1});
  const p0=tc(DG.start.cx,DG.start.cy);P.x=p0.x+rnd(-30,30);P.y=p0.y+rnd(-30,30);for(const al of allies){al.x=P.x+rnd(-40,40);al.y=P.y+rnd(-40,40)}followCam();
  if(a.k==='mz'){banner={t:`오르타 ${a.f}층`,sub:`몬스터 레벨 ${DG.lvl} · 골목 규칙: ${(a.rules||[]).map(id=>MZR[id]?MZR[id].n:id).join(' · ')}`,col:'#b9a2ff',life:2.6,max:2.6};mzLocalInit()}
  else{banner={t:d.n,sub:`3막 · 몬스터 레벨 ${DG.lvl} (레벨 고정)`,col:WX_QCOL.main,life:2.4,max:2.4}}
  msg(`${d.n}에 파티와 함께 들어섰습니다`,'#ff9a6a');for(const f of DM21NETIN)try{f(DG)}catch(e){if(window.__QA)throw e}
  if(NET.on)netSendState();return true}
const DM21NETIN=[];
{const _ne=netEnterDg;netEnterDg=function(D){if(D&&D.a21&&typeof D.a21==='object'&&(D.a21.k==='mz'||D.a21.k==='a3'))return dm21NetEnter(D);return _ne.apply(this,arguments)}}
// 던전 안 문(act): 다음 층 · 짝문 · 쓰는 자리 → 'dm21:<kind>:<n>'
const DM21ACT={};// kind → {near(p)→label, go(n)}
{const _da=dgAct;dgAct=function(){if(DG&&DG.a21){for(let i=0;i<DG.portals.length;i++){const p=DG.portals[i];if(p.dm21&&dist(P,p)<80)return 'dm21:'+p.dm21+':'+i}
    const sp=DG.a21.spots;if(sp)for(let i=0;i<sp.length;i++){const s=sp[i];if(dist(P,s)<90&&DM21ACT.use&&DM21ACT.use.live(s))return 'dm21:use:'+i}}return _da()}}
const dm21ActOf=a=>{if(typeof a!=='string'||a.slice(0,5)!=='dm21:')return null;const p=a.split(':');return{k:p[1],i:+p[2]}};
{const _tl=twActLabel;twActLabel=function(a){const o=dm21ActOf(a);if(o&&DM21ACT[o.k]){try{return DM21ACT[o.k].label(o.i)||''}catch(_){return ''}}return _tl(a)}}
{const _da=doAct;doAct=function(){const o=dm21ActOf(act);if(o&&DM21ACT[o.k]&&DG){DM21ACT[o.k].go(o.i);return}
  return _da()}}
// 나가는 문 이름표: 내 문(다음 층 · 짝문)은 따로 적는다
{const _dl=drawV5Labels;drawV5Labels=function(){if(!(DG&&DG.a21)){const r=_dl.apply(this,arguments);if(!DG&&!IN)dm21GateLabels();return r}
  const keep=DG.portals,mine=keep.filter(p=>p.dm21);DG.portals=keep.filter(p=>!p.dm21);try{_dl.apply(this,arguments)}finally{DG.portals=keep}
  ctx.textAlign='center';ctx.font='700 13px '+FONT;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';
  for(const p of mine){const s=W2S(p.x,p.y);if(!onScreen(s,60))continue;const t=p.lab||'짝문';ctx.strokeText(t,s.x,s.y-46);ctx.fillStyle=p.col||'#c9b4ff';ctx.fillText(t,s.x,s.y-46)}
  dm21DrawLocks()}}
function dm21GateLabels(){ctx.textAlign='center';ctx.font='700 13px '+FONT;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';
  for(const g of DM21GATES){if(g.reg!==REG.id||!g.d||dist(P,g.d)<260)continue;const s=W2S(g.d.x,g.d.y);if(!onScreen(s,120))continue;let L=null;try{L=g.lab()}catch(e){if(window.__QA)throw e}if(!L)continue;
    const y=s.y-(g.h||150);ctx.strokeText(L.t,s.x,y);ctx.fillStyle=L.col;ctx.fillText(L.t,s.x,y);if(L.s){ctx.font='600 11px '+FONT;ctx.strokeText(L.s,s.x,y+15);ctx.fillStyle='#e8dcc0';ctx.fillText(L.s,s.x,y+15);ctx.font='700 13px '+FONT}}}
// 잠긴 다음 층 짝문 (아직 문이 아니라 표시만)
function dm21DrawLocks(){const a=DG.a21;if(!a||!a.door||a.open)return;const s=W2S(a.door.x,a.door.y);if(!onScreen(s,60))return;
  const t=a.k==='mz'?`잠긴 짝문 · ${Math.min(a.kills|0,a.need|0)}/${a.need|0} 처치${a.bossF&&!DG.bossDead?' · 보스':''}`:'잠긴 문';ctx.strokeText(t,s.x,s.y-46);ctx.fillStyle='#a8a0c0';ctx.fillText(t,s.x,s.y-46)}
// 던전 문 그림: 내 문은 보랏빛 · 잠긴 짝문은 잿빛 고리
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);if(!DG||!DG.a21)return;G();ctx.globalCompositeOperation='lighter';const a=DG.a21;
  for(const p of DG.portals)if(p.dm21){ctx.globalAlpha=.5;ctx.strokeStyle=p.col||'#c9b4ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y,40+Math.sin(time*3)*4,0,6.283);ctx.stroke()}
  if(a.door&&!a.open){ctx.globalAlpha=.35;ctx.strokeStyle='#8a84a0';ctx.lineWidth=4;ctx.beginPath();ctx.arc(a.door.x,a.door.y,38,0,6.283);ctx.stroke();ctx.globalAlpha=.12;ctx.fillStyle='#8a84a0';circ(a.door.x,a.door.y,34)}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';S();for(const f of DM21GLOW)try{f()}catch(e){if(window.__QA)throw e}}}
const DM21GLOW=[];

/* ===== 3) 입구 자리 찾기: 마을 둘레 걸어서 닿는 빈 땅 (건물 · 동굴 · 포탈 · 물에서 떨어진 곳) ===== */
function dm21Layer(reg){return reg==='home'?HOME:RCACHE[reg]}
function dm21FindSpot(reg,t,a0,o){o=o||{};const L=dm21Layer(reg);if(!L||!t)return null;let ok=null;try{ok=TRCH[reg]||(TRCH[reg]=terrReach(reg))}catch(_){ok=null}
  const lq=L.lq&&reg!=='home'?L.lq:null,liq=(x,y)=>{if(!lq)return 0;const keep=LQ;LQ=lq;const v=liqAt(x,y);LQ=keep;return v};
  const far=(x,y)=>{for(const d of L.decor){const k=d.k,dd=Math.hypot(d.x-x,d.y-y);if((k==='cave'||k==='edgeportal')&&dd<360)return false;if(d.use&&dd<220)return false;if((k==='bld'||k==='house'||k==='shop'||k==='gate'||k==='stash'||k==='tfolk'||k==='fountain'||d.foot||d.town)&&dd<200)return false}
    if(L.lair&&Math.hypot(L.lair.x-x,L.lair.y-y)<700)return false;for(const tw of L.towns||[])if(Math.hypot(tw.x-x,tw.y-y)<SAFE+40)return false;return true};
  const r0=o.r0||SAFE+120,r1=o.r1||SAFE+700;
  for(let r=r0;r<=r1;r+=40)for(let k=0;k<24;k++){const a=a0+(k%2?1:-1)*Math.ceil(k/2)*.26,x=t.x+Math.cos(a)*r,y=t.y+Math.sin(a)*r;if(x<300||y<300||x>WORLD-300||y>WORLD-300)continue;
    if(liq(x,y)>.05||liq(x+40,y)>.05||liq(x,y+40)>.05)continue;if(ok&&!ok[terrLQi(x,y)])continue;if(ok&&(!ok[terrLQi(x+50,y)]||!ok[terrLQi(x,y+50)]||!ok[terrLQi(x-50,y)]||!ok[terrLQi(x,y-50)]))continue;if(!far(x,y))continue;return{x:Math.round(x),y:Math.round(y)}}
  return null}
// 입구 하나 붙이기: 동굴(CAVES)이 아니라 「쓰는 물건」(use) 하나 → 옛 동굴 번호 · 동굴 수 · 큰 지도 동굴 목록은 그대로
// g: {id, reg, k(그림 twDef), h(이름표 높이), lab()→{t,s,col}, live()→{label,col}|null, go()}
const DM21GATES=[],DM21G={};
function dm21AddGate(g,x,y){const L=dm21Layer(g.reg);if(!L)return null;for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(!d.town&&!d.foot&&!d.use&&d.k!=='tfolk'&&d.k!=='cave'&&d.k!=='edgeportal'&&d.k!=='house'&&d.k!=='bld'&&Math.hypot(d.x-x,d.y-y)<150)L.decor.splice(i,1)}
  const d={x,y,k:g.k,pv:0,use:'dm21:'+g.id,dm21g:g.id,tprop:1,s:1,v:0,zl:0};L.decor.push(d);const lt={x,y:y-20,light:120,dm21g:g.id};L.lights.push(lt);g.d=d;DM21GATES.push(g);DM21G[g.id]=g;
  if(REG.id===g.reg&&!DG&&!IN){setArr(decor,L.decor);setArr(LIGHTS,L.lights);chunks.clear()}return d}
{const _l=sqUseLive;sqUseLive=function(d){const g=d&&d.dm21g&&DM21G[d.dm21g];if(g){try{return g.live()}catch(e){if(window.__QA)throw e;return null}}return _l.apply(this,arguments)}}
{const _u=sqUse;sqUse=function(d){const g=d&&d.dm21g&&DM21G[d.dm21g];if(g){g.go();return}return _u.apply(this,arguments)}}
// 같은 문으로 같이: 참가자가 문을 쓰면 방장에게 부탁 (방장 쪽 문 규칙으로 들어간다)
V20NET.dmgate=(m,r)=>{if(!NET.host||DG)return;const g=DM21G[m.g];if(!g||!g.hostGo)return;msg(`${r&&r.name||'동료'}님이 「${g.n}」으로 가자고 합니다`,'#ff9a6a');g.hostGo(r)};
// 미니맵: 입구 점
{const _m=sqMarks;sqMarks=function(world){const o=_m(world);if(world||IN||DG||!P)return o;for(const g of DM21GATES)if(g.reg===REG.id&&g.d)o.push({x:g.d.x,y:g.d.y,kind:'dot',col:g.dot||'#c9b4ff'});return o}}
// 입구 빛: 그림 위에 은은한 빛 (구워 둔 그림 + glow 하나)
{const _p=twDrawProp;twDrawProp=function(d){const r=_p.apply(this,arguments);const g=d&&d.dm21g&&DM21G[d.dm21g];if(g&&g.glow&&d._s){try{g.glow(d._s)}catch(e){if(window.__QA)throw e}}return r}}

/* ===== 4) 미궁 입구 · 네라 ===== */
TWFOLK.nera={n:'길잡이 조합장 네라',role:'오르타 길잡이 조합장',L:{body:'#3a3e6a',cape:'#2a2e5a',hair:'#c8b8a0',hs:2,hat:3,hatC:'#3a3a6a',prop:'staff',gem:'#b9a2ff',dress:1},
  lines:['오늘 골목은 어제 골목이 아니야.','길을 잃으면 짝문 소리를 들어. 문은 늘 같은 음으로 울려.','동쪽 길 끝 천막 옆 짝문이 오르타로 이어져. 쉰 레벨부터야.']};
// (그림 · 문 규칙은 아래 mzgate)
// 입구 그림: 천막 + 룬이 새겨진 짝문 (한 번 구워 둔다)
twDef('mzgate',230,210,115,165,(g,v)=>{Kit.shadow(g,10,4,100,26,1);
  // 천막
  const A=isoP(-80,10,0),B=isoP(-20,10,0),C=isoP(-20,-50,0),ap=isoP(-50,-20,58);twFill(g,[A,B,ap],'#4a4e7a');twFill(g,[B,C,ap],'#2e3258');g.strokeStyle='rgba(20,18,40,.6)';g.lineWidth=1;g.beginPath();g.moveTo(ap.x,ap.y);g.lineTo((A.x+B.x)/2,(A.y+B.y)/2);g.stroke();
  const m=isoP(-50,10,0);twFill(g,[{x:m.x-7,y:m.y},{x:m.x+7,y:m.y+1},{x:m.x,y:m.y-22}],'#14122a');g.fillStyle='#c8a050';g.fillRect(ap.x-1,ap.y-14,2,14);g.fillStyle='#b9a2ff';g.fillRect(ap.x+1,ap.y-14,10,5);
  // 짝문: 두 기둥 + 둥근 돌문
  for(const x of [10,60])twBox(g,x,-6,0,14,14,86,'#5a5670',{tex:'stone',texA:.5});twBox(g,35,-6,84,64,18,12,'#6a6684',{tex:'stone',texA:.5});
  const a=isoP(16,-6,4),b=isoP(54,-6,4),c=isoP(54,-6,82),d=isoP(16,-6,82);twFill(g,[a,b,c,d],'#120e24');
  const mm={x:(a.x+c.x)/2,y:(a.y+c.y)/2};g.strokeStyle='#b9a2ff';g.lineWidth=1.6;g.beginPath();g.ellipse(mm.x,mm.y,13,22,0,0,6.283);g.stroke();g.beginPath();g.ellipse(mm.x,mm.y,6,11,0,0,6.283);g.stroke();
  for(const x of [10,60]){const p=isoP(x,-6,50);g.fillStyle='#b9a2ff';g.fillRect(p.x-1.5,p.y-6,3,3);g.fillRect(p.x-1.5,p.y+2,3,3)}});
const MZG={id:'mz',reg:'home',k:'mzgate',n:'오르타',h:150,dot:'#c9b4ff',
  lab:()=>({t:'오르타 짝문 · 변하는 미궁',s:P.lvl<MZ.minLv?`${MZ.minLv}레벨부터`:`오늘 시작 ${mzStartFloor()}층 · 최고 ${mzS().best}층`,col:'#c9b4ff'}),
  live:()=>({label:'오르타 짝문 (길잡이 조합 창)',col:'#c9b4ff',q:0}),go:()=>mzOpen(),
  glow:s=>{ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.45+.15*Math.sin(time*2.6);const p=isoP(35,-6,44);glow(s.x+p.x,s.y+p.y,30,'#b9a2ff');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}};
{const H=HOME.towns.find(t=>t.id==='haven');if(H){const p=dm21FindSpot('home',H,0,{r0:SAFE+260,r1:SAFE+900})||{x:H.x+760,y:H.y+60};MZ.gate=dm21AddGate(MZG,p.x,p.y);
  v20AddFolk('nera','haven',190,40);v20SyncDecor()}}

/* ===== 5) 저장 ===== */
function mzClean(raw){const o=v20Obj(raw)?Object.assign({},raw):{};const n=(v,max)=>Number.isFinite(+v)?clamp(Math.floor(+v),0,max):0;
  o.best=n(o.best,999);o.step=n(o.step,999);o.keys=n(o.keys,99999);o.day=typeof o.day==='string'&&o.day.length<=12?o.day:'';o.cape=o.cape?1:0;
  o.got=Array.isArray(o.got)?[...new Set(o.got.filter(x=>Number.isFinite(x)&&x>0&&x<1000))].slice(0,100):[];if('capeOn' in o)o.capeOn=o.capeOn?1:0;return o}
function mzS(){if(!P)return mzClean(null);if(!v20Obj(P.maze)||!Array.isArray(P.maze.got))P.maze=mzClean(P.maze);return P.maze}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P){const m=mzClean(P.maze);if(m.best>0||m.keys>0||m.cape||Object.keys(m).some(k=>!['best','step','keys','day','cape','got'].includes(k)))d.maze=m}}catch(e){if(window.__QA)throw e}return d}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok)P.maze=mzClean(d&&d.maze);return ok}}
{const _ng=newGame;newGame=function(cls,slot){const r=_ng.apply(this,arguments);if(P)P.maze=mzClean(null);return r}}
const mzDay=()=>MZ.qaDay||v20Day();
// 오늘 시작할 수 있는 가장 높은 층: 그날 발판(step) · 날이 바뀌면 (최고 − 10) 5 단위 내림 + 1
function mzStartFloor(){const s=mzS(),st=s.day===mzDay()?s.step:0;return clamp(Math.max(mazeStart(s.best),st||1),1,MZ.maxFloor())}
function mzStartList(){const top=mzStartFloor(),o=[1];for(let f=6;f<=top;f+=5)o.push(f);if(!o.includes(top))o.push(top);return o.slice(-6).concat(o.length>6?[]:[]).filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b)}

/* ===== 6) 층 규칙 · 몬스터 무리 (그날 + 층 씨앗) ===== */
const mzSeed=(day,f,k)=>v20Hash(`orta|${day}|${f}|${k||''}`);
function mzRules(day,f){const rg=v20Rng(mzSeed(day,f,'r')),ids=MAZE_RULES.map(r=>r.id),n=f%10===0?2:1,o=[];while(o.length<n){const id=ids[Math.floor(rg()*ids.length)];if(!o.includes(id))o.push(id)}return o}
function mzPool(day,f){const rg=v20Rng(mzSeed(day,f,'p')),n=2+Math.floor(rg()*2),pool=MAZE_POOL.slice(),o=[];while(o.length<n&&pool.length)o.push(pool.splice(Math.floor(rg()*pool.length),1)[0]);return o}
function mzBossOf(day,f){const rg=v20Rng(mzSeed(day,f,'b'));return f%10===0?MAZE_BOSSES[Math.floor(rg()*MAZE_BOSSES.length)]:f%5===0?MAZE_MINIS[Math.floor(rg()*MAZE_MINIS.length)]:null}

/* ===== 7) 층 짓기 (방장 · 혼자) ===== */
function mzEnter(f){if(NET.guest)return false;f=clamp(f|0,1,MZ.maxFloor());if(P.lvl<MZ.minLv){msg(`오르타는 ${MZ.minLv}레벨부터 들어갈 수 있습니다`,'#a39d8f');return false}
  if(f>mzStartFloor()){msg(`오늘은 ${mzStartFloor()}층까지만 바로 갈 수 있습니다`,'#a39d8f');return false}
  if(REG.id!=='home'){loadRegion('home')}if(!panel.hidden)closePanel();mzFloor(f);return true}
function mzFloor(f){const day=mzDay(),rules=mzRules(day,f),rg=v20Rng(mzSeed(day,f,'g')),lone=rules.includes('lone'),G=dm21Gen(rg,{n:[4,6],w:[4,6],lone});
  const c=MZ.gate,ci=960+f%20,lvl=MZ.lvAt(f),tag=`${day}|${f}|${++MZ.n}`;
  const a21={k:'mz',f,day,rules,tag,kills:0,need:0,total:0,open:0,bossF:f%5===0?1:0,pairs:[],runes:[],t:0};
  const order=dm21Make(mzDesc(f),ci,{x:c.x,y:c.y+80},lvl,G,rg,a21);DM21.raw=0;
  const pool=mzPool(day,f),boss=mzBossOf(day,f),mul=rules.includes('crowd')?1.4:1;let total=0;const tagE=e=>{e.mzT=tag;total++;return e};
  if(boss){const r=order[0],p=tc(r.cx,r.cy),e=tagE(dgMob(boss,p.x,p.y,lvl+(f%10===0?2:1)));e.aggroed=false;if(f%10===0)DG.boss=e;for(let n=0;n<2;n++){const q=dm21Spot(r,rg,1);tagE(dgMob(pool[n%pool.length],q.x,q.y,lvl))}}
  const rooms=boss?order.slice(1):order;
  for(const r of rooms){const n=Math.round((4+Math.floor(rg()*3))*mul);for(let k=0;k<n;k++){const q=dm21Spot(r,rg,0),el=lone?k===0:k===0&&rg()<.35;tagE(dgMob(pool[Math.floor(rg()*pool.length)],q.x+rnd(-20,20),q.y+rnd(-20,20),lvl,el?{elite:1}:null))}}
  if(rules.includes('mirror')){const r=order[order.length-1]||order[0],q=dm21Spot(r,rg,1);const e=mzMirror(q.x,q.y,lvl);if(e)tagE(e)}
  // 다음 층 짝문 자리: 가장 먼 방
  {const r=order[0],p=tc(r.cx,r.cy);a21.door={x:p.x+70,y:p.y-60};if(!dgFree(a21.door.x,a21.door.y,10))a21.door={x:p.x,y:p.y}}
  // 짝문 (짝문 · 바뀌는 이음새)
  if(rules.includes('pairdoor')||rules.includes('shift')){const rs=[DG.start,...order],pts=[];const nP=rules.includes('shift')?4:Math.min(4,rs.length>=4?4:2);
    for(let i=0;i<nP;i++){const r=rs[i%rs.length],q=dm21Spot(r,rg,1);pts.push({x:q.x-50,y:q.y+40})}
    for(let i=0;i<pts.length;i++){const p=pts[i];if(!dgFree(p.x,p.y,10)){const q=tc(rs[i%rs.length].cx,rs[i%rs.length].cy);p.x=q.x;p.y=q.y+70}DG.portals.push({x:p.x,y:p.y,dm21:'pair',pn:i,col:'#e0b0ff',lab:'짝문'})}a21.pairs=pts.map(p=>[Math.round(p.x),Math.round(p.y)])}
  if(rules.includes('rune')){a21.runeR=DG.rooms.map(r=>[r.i,r.j,r.w,r.h])}
  a21.total=total;a21.need=Math.max(1,Math.ceil(total*MZ.clearPct));
  mzLocalInit();
  msg(`오르타 ${f}층 · 골목 규칙: ${rules.map(id=>`「${MZR[id].n}」 ${MZR[id].d}`).join(' / ')}`,'#c9b4ff');
  banner={t:`오르타 ${f}층`,sub:`몬스터 레벨 ${lvl} · ${rules.map(id=>MZR[id].n).join(' · ')}${boss?` · ${TYPES[boss].boss?'보스':'준보스'} ${TYPES[boss].n}`:''}`,col:'#b9a2ff',life:2.8,max:2.8};
  if(NET.on&&NET.host)netSend({t:'dg',d:netDgData()});save();return DG}
// 비친 골목: 내 그림자 (그림은 wonder20.js 의 거울 그림자 그리기)
function mzMirror(x,y,lvl){const want=!PHYS_CLS[P.cls]||P.cls==='archer',k=MAZE_POOL.find(k=>!!TYPES[k].ranged===want)||MAZE_POOL[0];const e=dgMob(k,x,y,lvl);if(!e)return null;
  const hp=Math.round(maxHp()*.6);e.hp=e.max=hp;e.dmg=maxHp()*.1;e.r=16;e.mirror=1;e.sc=1;e.v20n=`거울 속 ${CLASSES[P.cls].n||'그림자'}`;e.v20c='#cfe8ff';return e}
// 이 화면에서만 쓰는 층 상태 (룬 자리 · 짝문 차례 · 메아리)
function mzLocalInit(){const a=DG&&DG.a21;if(!a)return;a._echo=[];a.t=0;a._ri=-1;a._sh=0;a._cleared=a._cleared||0;a._lit=0}
// 다음 층으로 (방장 · 혼자)
function mzNext(){const a=DG&&DG.a21;if(!a||a.k!=='mz')return;if(!a.open){msg('짝문이 아직 잠겨 있습니다','#a39d8f');return}
  if(a.f>=MZ.maxFloor()){msg(`여기가 오르타의 가장 깊은 골목(${a.f}층)입니다. 나가는 문으로 돌아가세요`,'#c9b4ff');return}
  if(NET.guest){v20Send('mzgo',{f:a.f});msg('방장에게 다음 층으로 가자고 했습니다','#9fe0ff');return}mzFloor(a.f+1)}
V20NET.mzgo=(m,r)=>{if(!NET.host||!DG||!DG.a21||DG.a21.k!=='mz'||DG.a21.f!==(m.f|0))return;msg(`${r&&r.name||'동료'}님이 다음 층으로 이끕니다`,'#c9b4ff');mzNext()};
V20NET.mzreq=(m,r)=>{if(!NET.host||DG)return;const f=clamp(m.f|0,1,mzStartFloor());msg(`${r&&r.name||'동료'}님이 오르타 ${f}층으로 가자고 합니다`,'#c9b4ff');mzEnter(f)};
V20NET.mzs=m=>{if(!NET.guest||!DG||!DG.a21||DG.a21.k!=='mz'||DG.a21.f!==(m.f|0))return;const a=DG.a21;a.kills=m.kc|0;a.need=m.n|0;if(m.o&&!a.open){a.open=1;mzOpenDoor(a)}};
// 문 열기: 다음 층 짝문 + 층 상자 (모든 화면에서 각자)
function mzOpenDoor(a){if(a._cleared)return;a._cleared=1;a.open=1;
  if(a.f<MZ.maxFloor())DG.portals.push({x:a.door.x,y:a.door.y,dm21:'mzn',col:'#c9b4ff',lab:`${a.f+1}층으로 가는 짝문`});
  rings.push({x:a.door.x,y:a.door.y,r:10,max:160,life:.9,col:'#c9b4ff'});burst(a.door.x,a.door.y,'#c9b4ff',40,180,3,20);mzCleared(a)}
function mzCleared(a){const s=mzS(),f=a.f,day=a.day,party=PTY.partyN()>1;s.best=Math.max(s.best,f);if(s.day!==mzDay()){s.day=mzDay();s.step=0}
  if(f%MZ.checkpoint===0&&day===s.day)s.step=Math.max(s.step,Math.min(MZ.maxFloor(),f+1));
  let keys=1+(f%5===0?2:0)+(a.rules.includes('drain')?1:0);s.keys+=keys;
  const L=MZ.lvAt(f),n=1+(party?1:0);for(let i=0;i<n;i++){const it=makeItem(L,true);loot.push({x:a.door.x+rnd(-50,50),y:a.door.y+rnd(30,80),kind:'item',item:it,t:0})}
  loot.push({x:a.door.x+rnd(-30,30),y:a.door.y+60,kind:'gold',amt:L*25,t:0});
  let extra='';if(f%10===0&&!s.got.includes(f)){s.got.push(f);const g=L*400;P.gold+=g;extra=` · 처음 ${f}층: 칭호 「오르타 ${f}층」 · 금화 ${g.toLocaleString()}`;msg(`오르타 ${f}층에 처음 닿았습니다: 칭호 「오르타 ${f}층」 (평판 칸에서 달기) · 금화 ${g.toLocaleString()}`,'#ffd76a')}
  banner={t:`오르타 ${f}층 돌파`,sub:`층 상자 · 짝문 열쇠 +${keys}${f%5===0?` · 발판: 오늘 ${Math.min(MZ.maxFloor(),f+1)}층부터 다시 시작`:''}${extra}`,col:'#c9b4ff',life:3,max:3};
  msg(`오르타 ${f}층: 짝문이 열렸습니다 · 짝문 열쇠 +${keys} (가진 열쇠 ${s.keys})${party?' · 파티 덤: 상자 하나 더':''}`,'#c9b4ff');save()}
// 매 프레임 (방장 · 혼자: 처치 수 · 문 열기 · 메아리 / 모두: 규칙 효과)
function mzTick(dt){const a=DG&&DG.a21;if(!a||a.k!=='mz'){if(P&&P.buffs&&P.buffs._mz)delete P.buffs._mz;return}a.t+=dt;
  if(!a.guest&&!NET.guest){let alive=0;for(const e of enemies)if(e.mzT===a.tag&&!e.dead&&e.hp>0)alive++;const k=a.total-alive;
    if(k!==a.kills){a.kills=k;if(NET.on)v20Send('mzs',{f:a.f,kc:k,n:a.need,o:a.open?1:0})}
    if(!a.open&&a.kills>=a.need&&(!a.bossF||!enemies.some(e=>e.mzT===a.tag&&(TYPES[e.k].mini||TYPES[e.k].boss)&&!e.dead&&e.hp>0))){mzOpenDoor(a);if(NET.on)v20Send('mzs',{f:a.f,kc:a.kills,n:a.need,o:1})}
    if(a.rules.includes('echo')){for(const o of a._echo){o.t-=dt;if(o.t<=0&&!o.done){o.done=1;const e=dgMob(o.k,o.x,o.y,o.l);if(e){e.hp=Math.max(1,Math.round(e.max*.3));e.mzEc=1;e.aggroed=true;rings.push({x:o.x,y:o.y,r:4,max:60,life:.6,col:'#c9b4ff'});ftext(o.x,o.y,'메아리','#c9b4ff',false,60)}}}
      a._echo=a._echo.filter(o=>!o.done)}}
  // 마른 우물 · 무거운 공기: 숨은 버프(_mz, 화면에 안 보임)
  const dr=a.rules.includes('drain'),hv=a.rules.includes('heavy');
  if(dr||hv){const base=1+P.lvl*.12+P.st.spi*.06+stat('regen');P.buffs._mz={t:1,max:1,regen:dr?-base*.3:0,cdr:hv?-.15:0}}else if(P.buffs._mz)delete P.buffs._mz;
  // 바뀌는 이음새: 30초마다 짝 바꾸기
  if(a.rules.includes('shift')){const k=Math.floor(a.t/30)%3;if(k!==a._sh){a._sh=k;msg('골목의 이음새가 바뀌었습니다 · 짝문이 다른 방으로 이어집니다','#e0b0ff');for(const p of DG.portals)if(p.dm21==='pair')rings.push({x:p.x,y:p.y,r:6,max:70,life:.6,col:'#e0b0ff'})}}
  // 깨어난 룬: 10초마다 자리 옮김 (씨앗 = 층 + 차례 → 모든 화면에서 같은 자리)
  if(a.runeR){const k=Math.floor(a.t/10);if(k!==a._ri){a._ri=k;const rg=v20Rng(mzSeed(a.day,a.f,'rune'+k));a.runes=[];for(let n=0;n<3;n++){const r=a.runeR[Math.floor(rg()*a.runeR.length)],i=r[0]+1+Math.floor(rg()*Math.max(1,r[2]-2)),j=r[1]+1+Math.floor(rg()*Math.max(1,r[3]-2));a.runes.push(tc(i,j))}}}
  if(a._lit>0)a._lit-=dt}
V20.tick.push(dt=>{try{mzTick(dt)}catch(e){if(window.__QA)throw e}});
// 메아리: 쓰러진 몬스터 셋 중 하나 (방장 · 혼자, 처치 순간에 정한다)
{const _k=killE;killE=function(e){const r=_k.apply(this,arguments);try{const a=DG&&DG.a21;if(a&&a.k==='mz'&&!a.guest&&!NET.guest&&a._echo&&a.rules.includes('echo')&&e&&e.mzT===a.tag&&!e.mzEc&&!e.mirror){const t=TYPES[e.k];e.mzEc=1;if(t&&!t.boss&&!t.mini&&R()<1/3)a._echo.push({k:e.k,x:e.x,y:e.y,l:e.lvl,t:2})}}catch(err){if(window.__QA)throw err}return r}}
// 짝문 짝: 0↔1 2↔3 → 바뀌면 0↔2 1↔3 → 0↔3 1↔2
const MZ_PAIR=[[1,0,3,2],[2,3,0,1],[3,2,1,0]];
function mzPairTo(i){const a=DG.a21,n=(a.pairs||[]).length;if(n<2)return -1;if(n<4)return i===0?1:0;return MZ_PAIR[a.rules.includes('shift')?a._sh:0][i]}
DM21ACT.pair={label:()=>'짝문 건너기 (F)',go:i=>{const p=DG.portals[i];if(!p)return;const j=mzPairTo(p.pn),to=DG.portals.find(q=>q.dm21==='pair'&&q.pn===j);if(!to)return;
  burst(P.x,P.y,'#e0b0ff',24,140);P.x=to.x+40;P.y=to.y+50;if(!dgFree(P.x,P.y,P.r)){P.x=to.x;P.y=to.y}for(const al of allies){al.x=P.x+rnd(-30,30);al.y=P.y+rnd(-30,30)}followCam();rings.push({x:P.x,y:P.y,r:6,max:90,life:.6,col:'#e0b0ff'});msg('짝문을 건넜습니다','#e0b0ff')}};
DM21ACT.mzn={label:()=>{const a=DG.a21;return `${a.f+1}층으로 (F)${NET.guest?' · 방장에게 부탁':''}`},go:()=>mzNext()};
// 깨어난 룬 위: 피해 +15% (덧셈, 내 마법 피해 칸)
const mzOnRune=()=>{const a=DG&&DG.a21;if(!a||a.k!=='mz'||!a.runes)return false;return a.runes.some(r=>Math.hypot(P.x-r.x,P.y-r.y)<70)};
V20.dmgAdd.push(()=>mzOnRune()?.15:0);
// 급한 골목: 이동 속도 +25% (방장 · 혼자가 몬스터를 움직인다)
{const _ue=updateEnemies;updateEnemies=function(dt){const a=DG&&DG.a21;if(!a||a.k!=='mz'||!a.rules.includes('swift'))return _ue.apply(this,arguments);
  const pos=new Map();for(const e of enemies)if(!e.dead)pos.set(e,[e.x,e.y]);const r=_ue.apply(this,arguments);
  for(const [e,[x,y]] of pos){if(e.dead)continue;const nx=e.x+(e.x-x)*.25,ny=e.y+(e.y-y)*.25;if(dgFree(nx,ny,Math.min(14,e.r||14))){e.x=nx;e.y=ny}}return r}}
// 침묵의 골목: 2초 넘는 시전 −20% · 즉시 시전 마나 +20%  /  꺼진 등불: 빛·신성 마법은 잠깐 밝힌다  /  무거운 공기: 재사용 +15%(숨은 버프 cdr)
{const _tc=tryCast;tryCast=function(id,target){const a=DG&&DG.a21;if(!a||a.k!=='mz'||GHOST||CAST_MOD)return _tc.apply(this,arguments);const mp0=P.mp,cu0=CAST.cur,s=SPELLS[id],r=_tc.apply(this,arguments);
  if(s&&a.rules.includes('quiet')){if(CAST.cur&&CAST.cur!==cu0&&CAST.cur.id===id){if(CAST.cur.max>2){CAST.cur.max=Math.round(CAST.cur.max*.8*100)/100;castBarSet(CAST.cur)}}
    else if(!castTimeOf(id)&&!(typeof CHAN==='object'&&CHAN[id])&&!s.charge){const sp=mp0-P.mp;if(sp>0)P.mp=Math.max(0,P.mp-sp*.2)}}
  if(s&&a.rules.includes('dark')&&(s.el==='holy'||s.el==='light')&&mp0>P.mp)a._lit=3;return r}}
// 꺼진 등불: 내 둘레 빛을 60%로 (구워 둔 어둠 고리 한 장)
const mzDarkSpr=()=>SC.get('mz/dark',256,256,128,128,g=>{const gr=g.createRadialGradient(128,128,0,128,128,128);gr.addColorStop(0,'rgba(2,2,8,0)');gr.addColorStop(.42,'rgba(2,2,8,0)');gr.addColorStop(.7,'rgba(2,2,8,.62)');gr.addColorStop(1,'rgba(2,2,8,.86)');g.fillStyle=gr;g.fillRect(0,0,256,256)},{scale:1});
DM21GLOW.push(()=>{const a=DG.a21;if(a.k!=='mz')return;
  if(a.runes&&a.runes.length){G();ctx.globalCompositeOperation='lighter';for(const r of a.runes){const on=Math.hypot(P.x-r.x,P.y-r.y)<70;ctx.globalAlpha=on?.8:.45;ctx.strokeStyle='#ffd76a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(r.x,r.y,70,0,6.283);ctx.stroke();
      ctx.globalAlpha=.25;ctx.beginPath();ctx.moveTo(r.x-40,r.y);ctx.lineTo(r.x+40,r.y);ctx.moveTo(r.x,r.y-40);ctx.lineTo(r.x,r.y+40);ctx.stroke()}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';S()}
  if(a.rules.includes('dark')&&!(a._lit>0)&&P._s){const e=mzDarkSpr();if(!e)return;const r=Math.max(W,H)*.62*1.6,s=P._s;ctx.drawImage(e.cv,s.x-r,s.y-20-r*.62,r*2,r*1.24);
    ctx.fillStyle='rgba(2,2,8,.86)';const x0=s.x-r,x1=s.x+r,y0=s.y-20-r*.62,y1=s.y-20+r*.62;if(x0>0)ctx.fillRect(0,0,x0+1,H);if(x1<W)ctx.fillRect(x1-1,0,W-x1+1,H);if(y0>0)ctx.fillRect(0,0,W,y0+1);if(y1<H)ctx.fillRect(0,y1-1,W,H-y1+1)}});
// 쓰러지면 (혼자) 미궁 밖 천막 앞으로
setTimeout(()=>{const b=document.getElementById('respawn');if(!b||!b.onclick)return;const _o=b.onclick;b.onclick=function(){const inMz=DG&&DG.a21&&DG.a21.k==='mz'&&!dgPartyHere();const r=_o.apply(this,arguments);
  if(inMz&&MZ.gate){if(REG.id!=='home')loadRegion('home');P.x=MZ.gate.x;P.y=MZ.gate.y+90;followCam();msg('오르타 짝문 밖에서 다시 일어섰습니다','#a39d8f');save()}return r}},0);

/* ===== 8) 창: 길잡이 조합 (입장 · 오늘의 규칙 · 열쇠 상점) ===== */
function mzOpen(){v20Open('maze')}
{const _st=sqTalk;sqTalk=function(f){if(f&&f.id==='nera'){mzOpen();return true}return _st.apply(this,arguments)}}
V20P.maze={title:()=>'오르타 길잡이 조합',html:()=>{const s=mzS(),top=mzStartFloor(),day=mzDay(),lowLv=P.lvl<MZ.minLv;
  let h=`<p class="qsay"><b>길잡이 조합장 네라</b> <span class="muted">오르타 길잡이 조합</span></p><p class="qsay">「${TWFOLK.nera.lines[Math.floor(time/6)%2]}」</p>`;
  h+=`<div class="v20box"><h3>뒤엉킨 도시 오르타</h3><p class="muted" style="margin:0">공간 학파 마법사들이 세운 연구 도시. 골목마다 새긴 짝문 룬이 주인을 잃고 깨어나 날마다 이음새가 바뀝니다. 층 n의 몬스터 레벨은 ${MZ.lvAt(1)-1}+n, 가장 깊은 곳은 ${MZ.maxFloor()}층. 그 층 몬스터를 80% 잡으면 다음 층 짝문이 열립니다. 5층마다 준보스 · 발판, 10층마다 보스.</p>
    <p style="margin:6px 0 0">최고 층 <b>${s.best}</b> · 짝문 열쇠 <b style="color:#c9b4ff">${s.keys}</b> · 오늘 바로 갈 수 있는 층 <b>${top}</b>${s.day===day&&s.step?` (오늘 발판 ${s.step}층)`:''}</p></div>`;
  h+='<div class="v20box"><h3>들어가기</h3>';if(lowLv)h+=`<p class="muted">${MZ.minLv}레벨부터 들어갈 수 있습니다.</p>`;
  else{for(const f of mzStartList()){const R0=mzRules(day,f);h+=`<div class="v20row"><div><b>${f}층</b> <span class="muted">· Lv${MZ.lvAt(f)} · ${R0.map(id=>MZR[id].n).join(' · ')}</span></div><div class="btns">${v20Btn('mzgo',f,NET.guest?'방장과 가기':'들어가기',{cls:'primary'})}</div></div>`}
    h+=`<p class="muted" style="margin:4px 0 0">파티(2~3명)는 함께 들어갑니다(방장이 층을 짓습니다). 파티면 층 상자에서 장비 하나 더.</p>`}
  h+='</div><div class="v20box"><h3>오늘의 골목 규칙</h3>';for(let f=top;f<Math.min(top+5,MZ.maxFloor()+1);f++)h+=`<div class="v20row"><div><b>${f}층</b> ${mzRules(day,f).map(id=>`<span class="muted">「${MZR[id].n}」 ${MZR[id].d}</span>`).join('<br>')}</div></div>`;
  h+='</div><div class="v20box"><h3>짝문 열쇠 상점</h3>';
  for(const it of MAZE_SHOP){let btn;if(it.id==='cape'&&s.cape)btn=v20Btn('mzcape','',s.capeOn===0?'입기':'벗기',{cls:'ghost'});else btn=v20Btn('mzbuy',it.id,`열쇠 ${it.cost}`,{dis:s.keys<it.cost});
    h+=`<div class="v20row"><div><b>${it.n}</b> <span class="muted" style="font-size:12px">${it.d}</span></div><div class="btns">${btn}</div></div>`}
  if(MZ.pick){const L=P.bag.filter(x=>x&&x.rar===2&&x.stats);h+=`<div class="v20box"><h3>다시 굴릴 희귀 장비 고르기</h3>${L.length?L.map(x=>`<div class="v20row"><div><b style="color:${RAR[2].c}">${v20Esc(x.name)}</b></div><div class="btns">${v20Btn('mzroll',x.id,'굴리기')}</div></div>`).join(''):'<p class="muted">가방에 희귀 장비가 없습니다.</p>'}${v20Btn('mzroll','','그만두기',{cls:'ghost'})}</div>`}
  return h+'</div>'}};
V20A.mzgo=v=>{const f=+v|0;if(NET.guest){v20Send('mzreq',{f});closePanel();msg('방장에게 오르타로 가자고 했습니다','#9fe0ff');return}mzEnter(f)};
V20A.mzcape=()=>{const s=mzS();if(!s.cape)return;s.capeOn=s.capeOn===0?1:0;msg(s.capeOn?'길잡이 망토를 입었습니다':'길잡이 망토를 벗었습니다','#c9b4ff');save()};
V20A.mzbuy=id=>{const s=mzS(),it=MAZE_SHOP.find(x=>x.id===id);if(!it||s.keys<it.cost)return;
  if(id==='reroll'){MZ.pick=1;return}
  if(id==='box'){if(P.bag.length>=BAG_MAX){msg('가방이 가득 찼습니다','#a39d8f');return}const x=makeItem(P.lvl,true);P.bag.push(x);msg(`오르타 장비 상자: ${x.name}`,RAR[x.rar].c)}
  else if(id==='forget')respec();
  else if(id==='pots'){const T=Math.max(0,POT_T.reduce((a,p,i)=>p.lv<=P.lvl?i:a,0));potAdd('hp',T,5);potAdd('mp',T,5);msg(`${potName('hp',T)} · ${potName('mp',T)} 5개씩`,'#e8c35a')}
  else if(id==='cape'){if(s.cape)return;s.cape=1;s.capeOn=1;msg('길잡이 망토 겉모습을 얻었습니다 (이 창에서 입고 벗기)','#c9b4ff')}
  s.keys-=it.cost;burst(P.x,P.y,'#c9b4ff',16,90,3,24);save()};
// 옵션 한 줄 다시 굴리기: 같은 칸 · 같은 레벨 장비에서 새 옵션 하나를 가져온다 (+모든 스킬 · 계열 +1은 빼고)
const MZ_NOROLL=k=>k==='all'||/^tr_/.test(k)||/^sk_/.test(k);
function mzReroll(it){if(!it||it.rar!==2||!it.stats)return false;const ks=Object.keys(it.stats).filter(k=>!MZ_NOROLL(k));if(!ks.length)return false;const old=ks[Math.floor(R()*ks.length)];
  for(let n=0;n<120;n++){const x=makeItem(it.il||P.lvl,true,it.cls||null);if(!x||x.slot!==it.slot||!x.stats)continue;const c=Object.keys(x.stats).filter(k=>!MZ_NOROLL(k)&&!(k in it.stats));if(!c.length)continue;
    const nk=c[Math.floor(R()*c.length)];const st={};for(const k in it.stats){if(k===old)st[nk]=x.stats[nk];else st[k]=it.stats[k]}it.stats=st;return{old,nk}}
  return false}
V20A.mzroll=v=>{MZ.pick=0;if(!v)return;const s=mzS(),it=P.bag.find(x=>x&&String(x.id)===String(v));if(!it||s.keys<6)return;const r=mzReroll(it);if(!r){msg('이 장비는 다시 굴릴 옵션이 없습니다','#a39d8f');return}
  s.keys-=6;if(typeof v20GsBump==='function')v20GsBump();msg(`「${it.name}」 옵션 한 줄을 다시 굴렸습니다`,RAR[2].c);burst(P.x,P.y,'#f2d45c',16,90,3,24);save()};
// 길잡이 망토 겉모습 (내 캐릭터만 · 그림 열쇠에 섞어 한 번 굽는다)
const MZ_CAPE=['#2e3a6a','#c8a050'];
const mzCapeOn=h=>h===P&&P&&P.maze&&P.maze.cape&&P.maze.capeOn!==0;
{const _hl=heroLook;heroLook=function(h){const L=_hl.apply(this,arguments);if(mzCapeOn(h)&&L&&L.pal){L.pal=Object.assign({},L.pal,{cloak:MZ_CAPE[0],lining:MZ_CAPE[1]});L.key+=',mzc'}return L}}
if(typeof heroLook18==='function'){const _hl=heroLook18;heroLook18=function(h){const L=_hl.apply(this,arguments);if(mzCapeOn(h)&&L&&L.pal){L.pal=Object.assign({},L.pal,{cloak:MZ_CAPE[0],lining:Kit.lit(MZ_CAPE[0],-.4)});L.key+=',mzc'}return L}}
// 칭호: 처음 닿은 열 층마다
for(let f=10;f<=90;f+=10)V20.titles.push({id:'mz'+f,n:`오르타 ${f}층`,col:'#c9b4ff',src:'변하는 미궁',have:()=>!!(P&&P.maze&&Array.isArray(P.maze.got)&&P.maze.got.includes(f))});
v20Css('.v20box .v20row b+.muted{font-size:12px}');
setTimeout(()=>{try{Object.assign(MZ,{MAZE_POOL,MAZE_MINIS,MAZE_BOSSES,MAZE_RULES,MAZE_SHOP,mazeStart,mzRules,mzPool,mzBossOf,mzFloor,mzEnter,mzNext,mzStartFloor,mzStartList,mzS,mzClean,mzReroll,mzOpenDoor,dm21Gen,dm21Cap,dm21Role,mzDesc,mzPairTo,mzOnRune,mzDarkSpr});if(window.__game)window.__game.MZ=MZ}catch(_){}},0);
