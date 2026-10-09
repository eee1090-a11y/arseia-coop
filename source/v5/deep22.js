/* ---------- v22 DEEP: B3 미궁 심층 (설계: rpg/endgame/엔드컨텐츠-설계서.md B3) ----------
   설계의 「41층부터 끝없이」는 「변하는 미궁」이 1층 50레벨 → 40층 100레벨이던 때의 숫자다. 이 게임의 오르타는 1층 50레벨 → 91층 140레벨(MAXLV−49)이므로
   심층은 「140레벨 꼭대기 바로 다음 층」인 92층부터 끝없이 이어진다(설계의 41층 = 오르타 92층).
   · 92층부터 몬스터 레벨은 140 그대로, 세기는 어둠 단계로 센다: 92~100층 = 어둠 1단계, 101~110층 = 2단계 … 181~190층 = 10단계, 191층부터는 한 층마다 0.05단계씩 더.
     생명력 +40%·단계(덧셈) · 보스·준보스 피해 +6%·단계. 졸개와 정예의 한 대 피해는 오르타 규칙(FIELD_BUDGET 상한) 그대로.
   · 심층은 140레벨부터(방장 기준). 참가자는 방장을 따라간다.
   · 「미궁의 기운」: 주마다(월요일) 둘이 바뀐다. 원소 기운은 한 주에 하나까지. 같은 주는 누구나 같은 기운 (방장 것이 층 데이터 a21.dw로 간다).
   · 기록: P.maze.dp = {s,d,t (혼자 · 2인 · 3인 이상 최고 층), wk, wb (이번 주 최고), sp:[3차 점수 받은 층]} — 없으면 만들지 않는다(저장에 안 씀).
   · 보상(각자 화면, 층을 깰 때): 재의 결정 · 10층마다 END2 「심층」 상자(end22Drop('deep',단계,x,y)) · 101 · 126 · 151층 첫 돌파 때 스킬 포인트 1점(설계 2-덤의 50·75·100층).
   maze21.js 위에 덧씌운다(그 파일은 고치지 않는다): MZ.maxFloor · MZ.lvAt · dm21Make · mzFloor · mzCleared · V20P.maze.html. */
const MZD={from:92,qaWeek:null,build:0};
window.__mzd=MZD;
const mzdTry=f=>{try{return f()}catch(err){if(window.__QA)throw err}};
const MZD_BASE=MZ.maxFloor;// = MAXLV-49 (91)
const mzdOk=()=>!!P&&(NET.guest||P.lvl>=MAXLV);
MZ.maxFloor=()=>mzdOk()?999:MZD_BASE();
MZ.lvAt=f=>Math.min(MAXLV,49+f);
MZD.from=MZD_BASE()+1;
// 층 → 어둠 단계 세기 (91층까지 0)
function mzdTier(f){const n=(f|0)-MZD_BASE();if(n<=0)return 0;if(n<100)return 1+Math.floor(n/10);return Math.round((10+(n-99)*.05)*100)/100}
const mzdRow=t=>({hp:.4*t,dmg:.06*t});
/* ===== 주 · 기운 ===== */
// 주 번호: 월요일에 바뀐다 (그날 문자열에서 → QA의 MZ.qaDay도 따른다)
function mzdWeek(day){if(MZD.qaWeek!=null)return MZD.qaWeek;const s=String(day||mzDay()),m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s);if(!m)return 0;return Math.floor((Date.UTC(+m[1],+m[2]-1,+m[3])/864e5+3)/7)}
const MZD_AFX=[
  {id:'ember',g:'el',n:'불이 약해지는 주',d:'불 피해 −20% · 냉기 피해 +20%',el:{fire:-.2,ice:.2}},
  {id:'thaw',g:'el',n:'얼음이 녹는 주',d:'냉기 피해 −20% · 불 피해 +20%',el:{ice:-.2,fire:.2}},
  {id:'calm',g:'el',n:'번개가 잠든 주',d:'번개 피해 −20% · 대지 피해 +20%',el:{storm:-.2,earth:.2}},
  {id:'pair',n:'정예가 둘씩 다니는 주',d:'정예마다 짝 정예가 하나 더 붙어 다닌다'},
  {id:'swarm',n:'무리가 짙은 주',d:'몬스터 수 +25% · 몬스터 생명력 −10%'},
  {id:'guard',n:'우두머리가 호위를 데리고 다니는 주',d:'준보스 · 보스 곁에 정예 호위 둘'},
  {id:'ash',n:'재가 짙은 주',d:'심층 재의 결정 +50% · 몬스터 생명력 +15%'},
  {id:'haste',n:'골목이 급한 주',d:'몬스터 이동 속도 +15% (피해는 그대로)'}];
const MZDA={};for(const a of MZD_AFX)MZDA[a.id]=a;
function mzdAffix(week){if(week==null)week=mzdWeek();const rg=v20Rng(v20Hash('mzdeep|'+week)),o=[];let el=0;
  for(let n=0;n<40&&o.length<2;n++){const a=MZD_AFX[Math.floor(rg()*MZD_AFX.length)];if(o.includes(a.id)||(a.g==='el'&&el))continue;if(a.g==='el')el=1;o.push(a.id)}return o}
// 지금 층의 기운 (심층 아니면 [])
const mzdHere=()=>{const a=DG&&DG.a21;return a&&a.k==='mz'&&(a.f|0)>MZD_BASE()&&Array.isArray(a.dw)?a.dw:[]};
const mzdHas=id=>mzdHere().includes(id);
/* ===== 저장: P.maze.dp ===== */
function mzdClean(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;const o=Object.assign({},raw),n=v=>Number.isFinite(+v)?clamp(Math.floor(+v),0,999):0;
  o.s=n(o.s);o.d=n(o.d);o.t=n(o.t);o.wb=n(o.wb);o.wk=Number.isFinite(+o.wk)?Math.floor(+o.wk):0;o.sp=Array.isArray(o.sp)?[...new Set(o.sp.filter(x=>Number.isFinite(x)&&x>0&&x<1000))].slice(0,10):[];return o}
function mzdSt(){const s=mzS();if(!s.dp||typeof s.dp!=='object'||Array.isArray(s.dp))s.dp=mzdClean({});return s.dp}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok&&P&&P.maze&&'dp' in P.maze){const c=mzdClean(P.maze.dp);if(c)P.maze.dp=c;else delete P.maze.dp}return ok}}
/* ===== 층 짓기: a21에 단계 · 기운 · 몬스터 세기 · 기운 덤 몬스터 ===== */
{const _mk=dm21Make;dm21Make=function(d,ci,ret,lvl,G,rng,a21){if(a21&&a21.k==='mz'&&(a21.f|0)>MZD_BASE()){a21.dt=mzdTier(a21.f);a21.dw=mzdAffix(mzdWeek(a21.day))}return _mk.apply(this,arguments)}}
{const _mf=mzFloor;mzFloor=function(f){const r=_mf.apply(this,arguments);mzdTry(()=>{const a=DG&&DG.a21;if(a&&a.k==='mz'&&a.dt>0&&!a.guest)mzdPost(a)});return r}}
function mzdPost(a){const tg=()=>enemies.filter(e=>e.mzT===a.tag&&!e.dead),aw=a.dw||[],rg=v20Rng(v20Hash(`mzdx|${a.day}|${a.f}`));let add=0;const L=DG.lvl;
  // 자리: 층 씨앗(rg)으로 둘레를 넓혀 가며 찾고, 끝내 없으면 짝의 바로 곁(그 몬스터가 서 있는 빈 땅) — 벽 곁이라고 덤이 빠지지 않게
  const near=(o,k,el)=>{let x=o.x+4,y=o.y+4;for(let i=0;i<18;i++){const r=34+i*6,an=rg()*Math.PI*2,tx=o.x+Math.cos(an)*r,ty=o.y+Math.sin(an)*r;if(dgFree(tx,ty,14)){x=tx;y=ty;break}}
    const e=dgMob(k,x,y,L,el?{elite:1}:null);if(e){e.mzT=a.tag;add++;return e}return null};
  const base=tg(),pool=[...new Set(base.filter(e=>!TYPES[e.k].boss&&!TYPES[e.k].mini&&!e.mirror).map(e=>e.k))];
  if(aw.includes('pair'))for(const e of base)if(e.elite)near(e,e.k,1);
  if(aw.includes('guard')&&pool.length)for(const e of base)if(TYPES[e.k].boss||TYPES[e.k].mini)for(let i=0;i<2;i++)near(e,pool[Math.floor(rg()*pool.length)],1);
  if(aw.includes('swarm')&&pool.length){const ns=base.filter(e=>!TYPES[e.k].boss&&!TYPES[e.k].mini&&!e.mirror),n=Math.round(ns.length*.25);for(let i=0;i<n;i++){const o=ns[Math.floor(rg()*ns.length)];near(o,o.k,0)}}
  const M=mzdRow(a.dt),hk=M.hp+(aw.includes('ash')?.15:0)-(aw.includes('swarm')?.1:0);
  for(const e of tg()){if(e.mzd||e.mirror)continue;e.mzd=1;const T=TYPES[e.k];e.hp=e.max=Math.max(1,Math.round(e.max*(1+hk)));if(T.boss||T.mini)e.dmg*=1+M.dmg}
  a.total+=add;a.need=Math.max(1,Math.ceil(a.total*MZ.clearPct));
  const sub=` · 심층: 어둠 ${Math.floor(a.dt)}단계 세기 · ${aw.map(id=>MZDA[id]?MZDA[id].n:id).join(' · ')}`;if(banner&&banner.t&&String(banner.t).includes(`${a.f}층`))banner.sub+=sub;
  msg(`오르타 심층 ${a.f}층 · 어둠 ${Math.floor(a.dt)}단계 세기 · 이번 주 미궁의 기운: ${aw.map(id=>MZDA[id]?`「${MZDA[id].n}」 ${MZDA[id].d}`:id).join(' / ')}`,'#b48aff');
  if(NET.on&&NET.host)v20Send('mzs',{f:a.f,kc:a.kills|0,n:a.need,o:a.open?1:0})}
// 참가자: 받은 층에 심층 이름표
DM21NETIN.push(D=>{const a=D&&D.a21;if(a&&a.k==='mz'&&a.dt>0&&banner)banner.sub+=` · 심층 어둠 ${Math.floor(a.dt)}단계 세기 · ${(a.dw||[]).map(id=>MZDA[id]?MZDA[id].n:id).join(' · ')}`});
/* ===== 기운 효과 ===== */
// 원소 기운: 내 마법(과 동료 화면의 그 동료 마법) 피해 — 원소 상성(elem21)과 같은 자리의 곱 한 번
{const _he=hurtE;hurtE=function(e,amt,s,...r){const aw=e&&s&&!s.ghost&&!GHOST&&(s.cls||s.proc)&&s.el?mzdHere():null;
  if(aw&&aw.length){const fam=typeof WX21_ATK==='object'?WX21_ATK[s.el]:s.el;let x=0;for(const id of aw){const A=MZDA[id];if(A&&A.el&&fam&&A.el[fam])x+=A.el[fam]}if(x)return _he.call(this,e,amt*(1+x),s,...r)}
  return _he.apply(this,arguments)}}
// 골목이 급한 주: 이동 +15%
{const _ue=updateEnemies;updateEnemies=function(dt){if(NET.guest||!mzdHas('haste'))return _ue.apply(this,arguments);
  const pos=new Map();for(const e of enemies)if(!e.dead)pos.set(e,[e.x,e.y]);const r=_ue.apply(this,arguments);
  for(const [e,[x,y]] of pos){if(e.dead)continue;const nx=e.x+(e.x-x)*.15,ny=e.y+(e.y-y)*.15;if(dgFree(nx,ny,Math.min(14,e.r||14))){e.x=nx;e.y=ny}}return r}}
/* ===== 층을 깼을 때: 기록 · 재의 결정 · 상자 · 3차 점수 (모든 화면에서 각자) ===== */
const MZD_SP=[101,126,151];
function mzdAshN(f,t,aw){let n=1+Math.floor(t/2);if(f%5===0)n+=2+Math.floor(t/2);if(f%10===0)n+=5+Math.floor(t);if(aw.includes('ash'))n=Math.round(n*1.5);return n}
{const _mc=mzCleared;mzCleared=function(a){if(!a||!(a.dt>0)||(a.f|0)<=MZD_BASE())return _mc.apply(this,arguments);
  const s=mzS(),had=s.got.includes(a.f);if(!had)s.got.push(a.f);// 10층 칭호 · 금화 줄은 91층까지만 (심층은 아래에서 따로)
  try{_mc.apply(this,arguments)}finally{if(!had)s.got=s.got.filter(x=>x!==a.f)}
  mzdTry(()=>mzdReward(a))}}
function mzdReward(a){const f=a.f|0,t=a.dt,aw=a.dw||[],dp=mzdSt(),n=clamp(PTY.partyN(),1,3),key=n>=3?'t':n===2?'d':'s',wk=mzdWeek(a.day);
  const rec=f>(dp[key]|0);dp[key]=Math.max(dp[key]|0,f);if(dp.wk!==wk){dp.wk=wk;dp.wb=0}dp.wb=Math.max(dp.wb|0,f);
  const x=a.door?a.door.x:P.x,y=a.door?a.door.y+40:P.y,ash=mzdAshN(f,t,aw);if(typeof ashGain==='function')ashGain(ash,x,y);
  let box='';if(f%10===0){const ti=clamp(Math.floor(t),1,10);if(typeof end22Drop==='function'){try{end22Drop('deep',ti,x,y+30,{chest:1});box=' · 심층 상자'}catch(e){if(window.__QA)throw e}}
    if(!box){const it=makeItem(MZ.lvAt(f),true);loot.push({x:x+rnd(-40,40),y:y+60,kind:'item',item:it,t:0});box=' · 심층 상자'}}
  let sp='';if(MZD_SP.includes(f)&&!dp.sp.includes(f)){dp.sp.push(f);P.sp=(P.sp|0)+1;sp=` · 처음 ${f}층: 스킬 포인트 +1`;msg(`오르타 심층 ${f}층을 처음 깼습니다: 스킬 포인트 +1 (3차 기술에 더 찍을 수 있습니다)`,'#ffd76a')}
  const who=key==='s'?'혼자':key==='d'?'2인':'3인';
  msg(`심층 ${f}층 돌파 · 재의 결정 +${ash}${box}${rec?` · 새 기록(${who}) ${f}층`:''}${sp}`,'#b48aff');
  if(banner&&banner.t&&String(banner.t).includes('돌파'))banner.sub+=` · 재의 결정 +${ash}${box}${rec?` · ${who} 새 기록`:''}${sp}`;save()}
/* ===== 창: 길잡이 조합에 「미궁 심층」 칸 ===== */
{const _h=V20P.maze.html;V20P.maze.html=function(){let h=_h.apply(this,arguments);try{h=h.replace(/가장 깊은 곳은 \d+층/,`140레벨 꼭대기는 ${MZD_BASE()}층, 그 뒤 ${MZD.from}층부터는 끝없는 「미궁 심층」`);const i=h.indexOf('<div class="v20box"><h3>들어가기');const box=mzdBox();h=i>=0?h.slice(0,i)+box+h.slice(i):h+box}catch(e){if(window.__QA)throw e}return h}}
function mzdBox(){const dp=mzS().dp||{},wk=mzdWeek(),aw=mzdAffix(wk),wb=dp.wk===wk?dp.wb|0:0,ok=P.lvl>=MAXLV;
  let h=`<div class="v20box"><h3>미궁 심층 · ${MZD.from}층부터 끝없이</h3><p class="muted" style="margin:0;font-size:12px">${MZD.from}~100층은 어둠 1단계 세기, 그 뒤 10층마다 한 단계씩 (191층부터는 조금씩 더). 몬스터 레벨은 140 그대로이고 생명력이 늘며, 피해가 오르는 것은 준보스 · 보스뿐입니다. ${ok?'':`<b>${MAXLV}레벨부터</b> 들어갈 수 있습니다(파티면 방장 기준). `}층을 깰 때마다 재의 결정, 10층마다 심층 상자, ${MZD_SP.join(' · ')}층을 처음 깨면 스킬 포인트 1점.</p>`;
  h+=`<div class="v20row"><div><b>이번 주 미궁의 기운</b> <span class="muted" style="font-size:12px">(월요일에 바뀝니다)</span><div style="font-size:12px">${aw.map(id=>`<span style="color:#c8a0ff">「${MZDA[id].n}」</span> <span class="muted">${MZDA[id].d}</span>`).join('<br>')}</div></div></div>`;
  h+=`<div class="v20row"><div><b>내 최고 층</b> <span class="muted" style="font-size:12px">혼자 <b>${dp.s|0}</b> · 2인 <b>${dp.d|0}</b> · 3인 <b>${dp.t|0}</b> · 이번 주 <b>${wb}</b></span></div></div></div>`;return h}
setTimeout(()=>{try{Object.assign(MZD,{MZD_AFX,MZDA,MZD_SP,mzdTier,mzdWeek,mzdAffix,mzdHere,mzdClean,mzdSt,mzdPost,mzdReward,mzdAshN,mzdBox,MZD_BASE});if(window.__game)window.__game.MZD=MZD}catch(_){}},0);
