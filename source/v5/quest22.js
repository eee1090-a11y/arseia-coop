/* ---------- v22: 의뢰 손질 (사용자 06:47) ----------
   「초반에 던전 두 번 들어가야 하는 퀘스트는 한 번만 · 같은 몬스터 N마리 · 그 몬스터 전리품 모으기 같은 겹치는 임무를 줄여 줘」
   · 1막 「고분의 속삭임」은 이제 고분 입구까지만 살펴보고(reach), 다음 「고분의 왕」에서 볼그와 아르실을 한 번에 잡는다.
   · 목표를 바꾼 의뢰(quest.js · sq.js · job2q.js · wx-towns.js)의 옛 진행은 불러올 때 새 모양으로 옮긴다(Q22.MIG).
     저장: 맨 위 qv=22(이 판에서 저장한 것은 다시 옮기지 않음) · 옮긴 기록/새로 받은 기록에는 c.v22=1 (옛 판으로 돌아갔다 와도 두 번 옮기지 않음)
     · qpre: 메인 의뢰를 받기 전에 먼저 쓰러뜨린 그 의뢰의 준보스·보스 (받을 때 처치로 친다). 비면 저장하지 않는다.
   · 새 목표 종류 reach(cave: 그 던전 id) = 그 던전 입구 둘레(220)에 닿거나 그 던전 안에 들어가면 끝. */
const Q22={on:1,t:0,R:220,
  // 옛 목표 모양(n)과 옛 진행 → 새 진행. oc=옛 g0,g1… 수, done=옛 목표를 다 이뤘는지. 돌려주는 값: [새 g0, g1 …] (+ pre: 먼저 잡은 준보스·보스)
  MIG:{
    main:{
      1:{old:[10,1],f:(oc,done)=>({c:[done||oc[1]>=1?1:0],pre:done||oc[1]>=1?{m_bolg:1}:null})},// 늪 슬라임 10 + 볼그 → 고분 입구 (볼그를 잡았다면 입구는 이미 지남)
      2:{old:[1],f:oc=>({c:[1,oc[0]]})},// 아르실 → 볼그 + 아르실 (옛 판에선 앞 의뢰에서 볼그를 이미 잡았다)
      4:{old:[10,6],f:oc=>({c:[Math.min(6,oc[1])]})},// 고블린 10 + 부적 6 → 부적 6
      7:{old:[12,10],f:oc=>({c:[Math.min(15,oc[0]+oc[1])]})},// 재 들개 12 + 잿빛 병사 10 → 둘 합쳐 15
      10:{old:[15,6],f:oc=>({c:[Math.min(6,oc[1])]})},// 망령 15 + 망령의 재 6 → 망령의 재 6
    },
    sq:{
      fang:{old:[6],f:oc=>[oc[0]>=3?1:0]},// 늑대 송곳니 6 → 잿빛 이빨 처치 1 (절반 넘게 모았으면 끝난 것으로)
      ctm1:{old:[5],f:oc=>[Math.floor(oc[0]/5*3)]},// 슬라임 이슬 5 → 은방울풀 3
      ctm2:{old:[6,1],f:oc=>[Math.min(8,Math.floor(oc[0]/6*8)),oc[1]]},// 고블린 부적 6 → 고블린·슬라임 8
      ctm5:{old:[8,10],f:oc=>[Math.min(12,oc[0]+oc[1])]},
      ctm7:{old:[12,6],f:oc=>[Math.min(14,oc[0]+oc[1])]},
      ctp2:{old:[6,1,1],f:oc=>[oc[1],oc[2]]},// 망령 6 빠짐
      ctp4:{old:[6,12],f:oc=>[Math.min(8,oc[0])]},// 잿빛 병사 12 빠짐
      ctp7:{old:[12,6],f:oc=>[Math.min(14,oc[0]+oc[1])]},
      ctw1:{old:[12],f:oc=>[oc[0]>=6?1:0]},// 늑대 12 → 잿빛 이빨 1
      ctw2:{old:[10,1],f:oc=>[Math.min(8,oc[0]),oc[1]]},
      ctw4:{old:[10,1],f:oc=>[oc[1]]},// 잿빛 기사 10 빠짐
      cta2:{old:[10,1],f:oc=>[Math.min(8,oc[0]),oc[1]]},
      j2p2:{old:[15,10],f:oc=>[Math.min(16,oc[0]+oc[1])]},
    }},
  // 대상만 넓힌 의뢰(같은 수): 옮길 것 없음 — wolfd gm5 el1 eh1 gh5 ctp5 ctw5 ctw7
  WIDE:['wolfd','gm5','el1','eh1','gh5','ctp5','ctw5','ctw7','cta5','cta7'],
  log:[]};
const q22Gn=g=>g.type==='talk'||g.type==='reach'||g.type==='use'||g.type==='find'||g.type==='trial'||g.type==='pick'?1:(g.n||1);
const q22Old=(c,n)=>{const oc=[];for(let j=0;j<n;j++)oc.push(Math.max(0,(c&&c['g'+j])|0));return oc};
const q22OldDone=(oc,old)=>old.every((n,j)=>oc[j]>=n);
// 옛 c(g0…) → 새 c. g 칸만 바꾸고 다른 칸(옛 판의 0:3 같은 것)은 그대로 둔다
function q22Apply(c,goals,nc,done){for(const k of Object.keys(c))if(/^g\d+$/.test(k))delete c[k];
  goals.forEach((g,j)=>{const v=done?q22Gn(g):Math.max(0,Math.min(q22Gn(g),nc[j]|0));if(v)c['g'+j]=v});c.v22=1;return c}
// 메인 의뢰(P.q) 옮기기
function q22MigMain(){const st=P&&P.q;if(!st||typeof st!=='object')return;const M=Q22.MIG.main[st.i],q=QUESTS[st.i];if(!M||!q)return;
  if(!st.c||typeof st.c!=='object')st.c={};if(st.c.v22)return;
  if(st.st===0){if(st.i===2){P.qpre=Object.assign(P.qpre||{},{m_bolg:1});Q22.log.push('main2:pre')}return}// 옛 판에서 「고분의 속삭임」을 마쳤다 = 볼그를 이미 잡았다
  const oc=q22Old(st.c,M.old.length),done=st.st===2||q22OldDone(oc,M.old),r=M.f(oc,done);
  q22Apply(st.c,q.goals,r.c,done);if(r.pre)P.qpre=Object.assign(P.qpre||{},r.pre);
  if(st.st===1&&qAllDone(q))st.st=2;Q22.log.push('main'+st.i+':'+JSON.stringify(oc)+'→'+JSON.stringify(st.c))}
// 마을 의뢰(P.sq.a) 옮기기
function q22MigSq(){const s=P&&P.sq&&P.sq.a;if(!s)return;
  for(const id in Q22.MIG.sq){const a=s[id],q=SQBY[id],M=Q22.MIG.sq[id];if(!a||!q||!a.c||typeof a.c!=='object'||a.c.v22)continue;
    const oc=q22Old(a.c,M.old.length),done=q22OldDone(oc,M.old);q22Apply(a.c,q.goals,M.f(oc,done),done);Q22.log.push(id+':'+JSON.stringify(oc)+'→'+JSON.stringify(a.c))}}
function q22Migrate(d){Q22.log=[];if(d&&(d.qv|0)>=22)return;q22MigMain();q22MigSq()}
// 새로 받는 의뢰에 표시 (옛 판으로 돌아갔다 와도 다시 옮기지 않게)
{const _a=sqAccept;sqAccept=function(id){const r=_a.apply(this,arguments);try{const a=sqState().a[id];if(a&&a.c&&Q22.MIG.sq[id])a.c.v22=1}catch(_){}return r}}
// 메인: 받을 때 먼저 잡은 준보스·보스를 처치로 친다
{const _a=questAccept;questAccept=function(){const st=qState(),i=st.i,s0=st.st;const r=_a.apply(this,arguments);
  try{if(s0===0&&st.st===1&&st.i===i){const q=qCur();if(Q22.MIG.main[i])st.c.v22=1;const pre=P.qpre;
    if(q&&pre&&typeof pre==='object'){let got=[];q.goals.forEach((g,j)=>{if(g.type!=='kill'||!g.k)return;let n=0;for(const k of g.k)n+=pre[k]|0;n=Math.min(n,g.n);if(n>0){st.c['g'+j]=n;got.push(g.d)}});
      if(got.length){msg(`이미 해낸 일: ${got.join(' · ')}`,'#ffd98a');if(qAllDone(q)){st.st=2;msg(`의뢰 「${q.t}」 목표를 모두 이뤘습니다. 의뢰인에게 알리세요`,'#ffd98a')}questHud();save()}}
    delete P.qpre}}catch(err){if(window.__QA)throw err}return r}}
// 메인 의뢰의 준보스·보스를 의뢰를 받기 전에 먼저 잡으면 기억해 둔다 (받기 전 · 앞 의뢰를 보고만 남긴 때 · 앞 의뢰 진행 중)
function q22PreTarget(){const st=qState();return st.st===0?QUESTS[st.i]:QUESTS[st.i+1]}
{const _k=questKill;questKill=function(e){const st=qState(),q0=qCur(),c0=q0&&st.st===1&&q0.goals.some((g,j)=>g.k&&g.k.includes(e&&e.k)&&!qGoalDone(q0,j));_k.apply(this,arguments);
  try{const T=e&&TYPES[e.k];if(!T||!(T.mini||T.boss)||c0)return;const nq=q22PreTarget();if(!nq||!nq.goals.some(g=>g.type==='kill'&&g.k&&g.k.includes(e.k)))return;
    const p=P.qpre&&typeof P.qpre==='object'?P.qpre:(P.qpre={});p[e.k]=Math.min(9,(p[e.k]|0)+1);msg(`「${nq.t}」의 ${T.n}을(를) 먼저 쓰러뜨렸습니다. 그 의뢰를 받으면 처치로 칩니다`,'#ffd98a');save()}catch(err){if(window.__QA)throw err}}}
// reach: 던전 입구에 닿기
function q22Cave(g){return HOME.caves.findIndex(c=>c.cave&&c.cave.id===g.cave)}
function q22ReachTick(){if(!P||!P.q)return;const st=qState(),q=qCur();if(!q||st.st!==1||REG.id!=='home')return;
  q.goals.forEach((g,j)=>{if(g.type!=='reach'||qGoalDone(q,j))return;const ci=q22Cave(g),c=HOME.caves[ci];if(!c)return;
    const ok=DG?DG.ci===ci:!IN&&Math.hypot(P.x-c.x,P.y-c.y)<Q22.R;if(!ok)return;st.c['g'+j]=1;burst(P.x,P.y,'#ffd98a',18,100,3,30);msg(`${g.d}: 끝`,'#ffd98a');
    if(qAllDone(q)){st.st=2;const tw=ALLTOWNS.find(t=>t.id===qTurnTown(q));msg(`의뢰 「${q.t}」 목표를 모두 이뤘습니다. ${tw?tw.n:''}의 ${QNPC[qTurnTown(q)].n}에게 알리세요`,'#ffd98a')}questHud();save()})}
{const _u=update;update=function(dt){const r=_u(dt);try{if((Q22.t-=dt)<=0){Q22.t=.25;q22ReachTick()}}catch(err){if(window.__QA)throw err}return r}}
{const _mt=qMainTargetW;qMainTargetW=function(){const q=qCur(),st=qState();
  if(q&&st.st===1)for(let j=0;j<q.goals.length;j++){if(qGoalDone(q,j))continue;const g=q.goals[j];if(g.type!=='reach')break;const ci=q22Cave(g),c=HOME.caves[ci];
    if(c)return{reg:'home',x:c.x,y:c.y,cave:ci,label:`${qPlace(c.x,c.y)} · 「${c.cave.n}」 입구`};break}
  return _mt.apply(this,arguments)}}
// 저장 · 불러오기
const q22PreClean=v=>{const o={};if(v&&typeof v==='object'&&!Array.isArray(v))for(const k in v)if(TYPES[k]&&(TYPES[k].mini||TYPES[k].boss)&&(v[k]|0)>0)o[k]=Math.min(9,v[k]|0);return Object.keys(o).length?o:null};
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d){d.qv=22;const p=P&&q22PreClean(P.qpre);if(p)d.qpre=p}}catch(err){if(window.__QA)throw err}return d}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok&&P)try{P.qpre=q22PreClean(d&&d.qpre)||undefined;if(!P.qpre)delete P.qpre;q22Migrate(d);questHud()}catch(err){if(window.__QA)throw err}return ok}}
// #qa 도움: 겹치는 임무 세기 (직업마다 보이는 의뢰: 메인 + 마을 의뢰 + 그 직업의 시험·전직)
// 「반복 목표」 = 들판 몬스터 한 종류만 5마리 이상 잡거나 그 몬스터의 전리품을 모으는 목표.
// 겹침 = 같은 몬스터가 두 의뢰 이상의 반복 목표에 나옴(두 번째부터 셈) · 한 의뢰 안에서 같은 몬스터를 잡고 또 그 전리품을 모음
function q22Rep(cls){const field=k=>TYPES[k]&&!TYPES[k].mini&&!TYPES[k].boss,one=g=>g.k&&(g.type==='kill'||g.type==='get'||g.type==='collect')&&(g.n||1)>=5&&g.k.filter(field).length===1&&g.k.every(field);
  const vis=[...QUESTS.map((q,i)=>({id:'Q'+i,q})),...SQ.map(q=>({id:q.id,q}))].filter(a=>!a.q.cls||a.q.cls===cls);
  const by={};let grind=0,pair=0;for(const a of vis){const G=a.q.goals||[];if(G.some(one))grind++;const ks=new Set();
    for(const g of G){const any=g.k&&(g.type==='kill'||g.type==='get'||g.type==='collect')&&(g.n||1)>=5;if(!any)continue;for(const k of g.k.filter(field)){if(ks.has(k))pair++;ks.add(k)}}
    for(const g of G)if(one(g))(by[g.k[0]]=by[g.k[0]]||new Set()).add(a.id)}
  let dup=0;const dl=[];for(const k in by)if(by[k].size>1){dup+=by[k].size-1;dl.push(k+':'+[...by[k]].join('/'))}
  return{vis:vis.length,grind,pair,dup,dl}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{Q22,q22Migrate,q22Rep,q22ReachTick})}catch(_){}},0);
