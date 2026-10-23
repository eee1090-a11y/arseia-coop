/* ---------- v42 업적과 칭호 (제안 4) ----------
   · 세는 값은 P.g42.ac(없으면 0부터). 다른 칸(레벨 · 책 · 미궁 층 · 숙련 특성 …)은 이미 있는 저장 값을 읽기만 한다.
   · 다 채운 업적 id는 P.g42.achD, 받은 점수 상은 P.g42.achR. 옛 판은 g42를 모르니 그대로 보존한다.
   · 다른 v42 파일은 G42.ach.push({...}) 로 업적을 더한다(같은 꼴). 업적 점수 단계마다 칭호와 금화. */
G42.ach=[];
const G42_ACHR=[{p:100,t:'업적 수집가',gold:20000},{p:250,t:'이름난 모험가',gold:50000},{p:400,t:'전설을 쓰는 자',gold:100000},{p:600,t:'아르세이아의 기록',gold:200000}];
function g42Ac(){const g=g42S();if(!v20Obj(g.ac))g.ac={};const a=g.ac;for(const k of ['kill','elite','dgb','solo','party','bty','stk'])a[k]=Number.isFinite(+a[k])?Math.max(0,+a[k]|0):0;
  if(!v20Obj(a.ty))a.ty={};if(!Array.isArray(a.reg))a.reg=[];if(!Array.isArray(a.dg))a.dg=[];if(!Array.isArray(g.achD))g.achD=[];if(!Array.isArray(g.achR))g.achR=[];return a}
const g42AcN=k=>{const a=g42Ac();return a[k]|0};
const g42Nty=()=>Object.keys(g42Ac().ty).length;
{const add=(id,n,d,need,cur,grp,pts)=>G42.ach.push({id,n,d,need,cur,grp,pts:pts||10});
  [[1000,'사냥꾼'],[10000,'숙련된 사냥꾼'],[50000,'끝없는 사냥'],[100000,'십만의 발자국']].forEach(([N,n],i)=>add('kill'+N,n,`몬스터 ${N.toLocaleString()}마리 쓰러뜨리기`,N,()=>g42AcN('kill'),'사냥',10+i*10));
  [[100,'정예 사냥'],[1000,'정예의 천적']].forEach(([N,n],i)=>add('elite'+N,n,`정예 몬스터 ${N}마리`,N,()=>g42AcN('elite'),'사냥',10+i*10));
  [[50,'여러 짐승을 아는 자'],[100,'괴물 학자'],[150,'살아 있는 도감']].forEach(([N,n],i)=>add('ty'+N,n,`서로 다른 몬스터 ${N}종 쓰러뜨리기`,N,g42Nty,'사냥',10+i*10));
  add('stk30','멈추지 않는 손','연속 사냥 30 이어가기',30,()=>g42AcN('stk'),'사냥');add('stk100','폭풍 같은 사냥','연속 사냥 100 이어가기',100,()=>g42AcN('stk'),'사냥',20);
  [[10,'던전 탐험가'],[25,'던전 정복자'],[40,'모든 문을 연 자']].forEach(([N,n],i)=>add('dg'+N,n,`서로 다른 던전 ${N}곳의 주인 쓰러뜨리기`,N,()=>g42Ac().dg.length,'던전',10+i*10));
  add('solo1','홀로 선 자','던전 보스를 혼자 쓰러뜨리기',1,()=>g42AcN('solo'),'던전');add('solo50','외로운 영웅','던전 보스를 혼자 50번 쓰러뜨리기',50,()=>g42AcN('solo'),'던전',20);
  add('party1','함께라면','던전 보스를 파티로 쓰러뜨리기',1,()=>g42AcN('party'),'던전');add('party30','믿음직한 동료','던전 보스를 파티로 30번 쓰러뜨리기',30,()=>g42AcN('party'),'던전',20);
  [[10,'미궁의 손님'],[25,'미궁을 걷는 자'],[50,'오르타의 길잡이']].forEach(([N,n],i)=>add('maze'+N,n,`미궁 오르타 ${N}층 닿기`,N,()=>P.maze&&P.maze.best|0,'던전',10+i*10));
  [[10,'현상금 사냥꾼'],[100,'이름난 현상금 사냥꾼']].forEach(([N,n],i)=>add('bty'+N,n,`현상금 몬스터 ${N}마리`,N,()=>g42AcN('bty'),'세계',10+i*10));
  [[15,'길손'],[25,'먼 길을 걸은 자'],[30,'세상의 끝을 본 자']].forEach(([N,n],i)=>add('reg'+N,n,`지역 ${N}곳 가 보기`,N,()=>g42Ac().reg.length,'세계',10+i*10));
  add('books','서고지기','책 30권 모두 읽기',30,()=>Array.isArray(P.books)?P.books.length:0,'세계',30);
  [[60,10],[80,20],[100,30],[120,30],[140,40]].forEach(([L,pt])=>add('lv'+L,`${L}레벨`,`${L}레벨 닿기`,L,()=>P.lvl,'성장',pt));
  add('trait8','숙련의 끝','전직 숙련 특성 8개 모두 고르기',8,()=>Object.keys(g42S().tr).length,'성장',20);
  add('box9','상자를 모두 연 자','레벨 단계 상자 9개 모두 받기',9,()=>g42S().box.length,'성장',20)}
/* 세기 */
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&!GHOST&&e){const a=g42Ac(),t=TYPES[e.k]||{};a.kill++;if(e.elite)a.elite++;if(e.k)a.ty[e.k]=(a.ty[e.k]|0)+1;if(e.bty)a.bty++;
  if(G42.stk.n>a.stk)a.stk=G42.stk.n;
  if(DG&&DG.d&&t.boss&&!DG.d.trial){if(DG.d.id&&!a.dg.includes(DG.d.id)&&a.dg.length<400)a.dg.push(DG.d.id);let peers=0;try{if(NET.on)for(const p of NET.peers.values())if(netSame(p))peers++}catch(_){}if(peers)a.party++;else a.solo++}}}catch(err){if(window.__QA)throw err}return r}}
{const _lr=loadRegion;loadRegion=function(id){const r=_lr.apply(this,arguments);try{if(P){const a=g42Ac();if(id&&!a.reg.includes(id)&&a.reg.length<200)a.reg.push(id)}}catch(e){if(window.__QA)throw e}return r}}
/* 다 채웠는지 · 알림 */
const g42AchDone=A=>{try{return (A.cur()|0)>=A.need}catch(_){return false}};
const g42AchPts=()=>{const D=g42S().achD||[];let p=0;for(const A of G42.ach)if(D.includes(A.id))p+=A.pts;return p};
function g42AchCheck(quiet){if(!P)return 0;g42Ac();const g=g42S();let n=0;for(const A of G42.ach){if(g.achD.includes(A.id)||!g42AchDone(A))continue;g.achD.push(A.id);n++;
  if(!quiet){msg(`업적: 「${A.n}」 (${A.d}) · ${A.pts}점`,'#ffe39a');if(n===1){banner={t:`업적 · ${A.n}`,sub:`${A.d} · 업적 점수 ${g42AchPts()}`,col:'#ffe39a',life:2.4,max:2.4}}}}
  return n}
G42.achT=0;V20.slowTick.push(st=>{G42.achT-=st;if(G42.achT>0||!P)return;G42.achT=1;g42AchCheck(false)});
// 불러온 직후: 이미 채운 업적은 조용히 적어 둔다(예전 캐릭터가 알림 폭탄을 맞지 않게)
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok)try{g42AchCheck(true)}catch(e){if(window.__QA)throw e}return ok}}
const g42AchROpen=R0=>g42AchPts()>=R0.p&&!g42S().achR.includes(R0.p);
V20A.g42achr=p=>{const R0=G42_ACHR.find(r=>r.p===(p|0));if(!R0||!g42AchROpen(R0))return;g42S().achR.push(R0.p);P.gold+=R0.gold;msg(`업적 점수 ${R0.p}점 상: 칭호 「${R0.t}」 · 금화 ${R0.gold.toLocaleString()}`,'#ffe39a');save()};
for(const R0 of G42_ACHR)V20.titles.push({id:'g42ach'+R0.p,n:R0.t,col:'#ffe39a',src:`업적 점수 ${R0.p}점`,have:()=>!!(P&&g42S().achR&&g42S().achR.includes(R0.p))});
G42.achG='사냥';
V20A.g42achg=k=>{G42.achG=k};
function g42AchHtml(){g42Ac();const g=g42S(),pts=g42AchPts(),grps=[...new Set(G42.ach.map(A=>A.grp))];if(!grps.includes(G42.achG))G42.achG=grps[0];
  let h=`<div class="v20box"><h3>업적 점수 <b style="color:#ffe39a">${pts}</b> <span class="muted">· 다 채운 업적 ${g.achD.length}/${G42.ach.length} · 칭호는 캐릭터 이름 아래에 달 수 있습니다(평판 칸)</span></h3>`;
  for(const R0 of G42_ACHR){const got=g.achR.includes(R0.p),can=g42AchROpen(R0);h+=`<div class="v20row"><div><b>${R0.p}점</b> <span class="muted">칭호 「${R0.t}」 · 금화 ${R0.gold.toLocaleString()}</span></div><div class="btns">${got?'<button type="button" disabled>받음</button>':v20Btn('g42achr',R0.p,'받기',{dis:!can})}</div></div>`}
  h+=`</div><div class="row" style="flex-wrap:wrap;gap:4px;margin:6px 0">${grps.map(k=>v20Btn('g42achg',k,k,{cls:k===G42.achG?'':'ghost'})).join('')}</div>`;
  for(const A of G42.ach.filter(A=>A.grp===G42.achG)){const done=g.achD.includes(A.id);let c=0;try{c=A.cur()|0}catch(_){}
    h+=`<div class="v20box" style="opacity:${done?1:.85}"><div class="v20row" style="border:0;padding:0"><div><b style="color:${done?'#ffe39a':'#efe2c0'}">${done?'✔ ':''}${A.n}</b> <span class="muted" style="font-size:12px">${A.d}</span></div><div>${A.pts}점</div></div><div class="v20bar"><i style="width:${Math.min(100,c/A.need*100)}%"></i></div><div class="muted" style="font-size:11px;text-align:right">${Math.min(c,A.need).toLocaleString()} / ${A.need.toLocaleString()}</div></div>`}
  return h}
G42.tabs.push({k:'ach',n:'업적',html:g42AchHtml,dot:()=>G42_ACHR.some(g42AchROpen)});
Object.assign(window.__g42,{g42Ac,g42AchCheck,g42AchPts,G42_ACHR});
