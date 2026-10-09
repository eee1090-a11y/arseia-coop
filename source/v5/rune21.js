/* ---------- v21 (GROW): 재의 결정 · 룬 각인 (엔드컨텐츠 A1) ----------
   설계: rpg/endgame/엔드컨텐츠-설계서.md §1 · §A1 · §6. 계약: v21-contract.md GROW.
   · 재의 결정: P.ash (정수, 저장 'ash'). ashGain(n,x,y)는 누구나 부를 수 있다(함수 선언).
   · 140레벨(MAXLV)부터 경험치는 「각인 막대」(P.rune.xp)로 간다. 막대가 차면 각인 점수 1점.
   · 네 판(힘·수호·마력·길잡이)에 점수를 찍는다. 모든 값은 덧셈이고 기존 상한을 그대로 따른다:
     능력치·체력·마나·치명·재사용·마나 소모·이동·받는 피해는 V20.gsAdd(장비 능력치에 더함), 「모든 피해 %」는 V20.dmgAdd(피해 증가 칸).
   · 새김: 그 판에 찍은 점수가 50·100·150·200점이 될 때마다 셋 중 하나를 고른다(그 판의 최대 점수로 닿는 것만).
   · 각인 지우개(P.rune.er): 잡화점에서 금화로 산다. 쓰면 찍은 점수를 모두 돌려받고 새김도 다시 고른다.
   · 저장: 'rune'·'ash' + P.pot._r21 거울(옛 판 v20이 다시 저장해도 pot은 남으므로, 되돌아와도 잃지 않게). 없으면 기본값, 모르는 칸은 그대로 다시 쓴다. */
const RUNE_MAIN={mage:'int',priest:'int',warrior:'str',archer:'dex'};
const runeMainK=()=>RUNE_MAIN[P&&P.cls]||'int';
const runeMainN=()=>(typeof STAT_N==='object'&&STAT_N[runeMainK()])||'지능';
// 칸: per = 1점당 값(RV 단위), cap = 최대 점수(0 = 끝없음), show(v) = 보이는 글
const RUNE_B=[
  {id:'pow',n:'힘의 판',d:'공격',col:'#ff9a6a',s:[
    {k:'st',n:()=>runeMainN(),per:5,cap:0,show:v=>`+${v}`},
    {k:'dmg',n:()=>'모든 피해',per:.005,cap:50,show:v=>`+${r21P(v)}%`},
    {k:'cdm',n:()=>'치명 피해',per:1,cap:30,show:v=>`+${r21R(v)}%`}]},
  {id:'grd',n:'수호의 판',d:'방어',col:'#8fc8ff',s:[
    {k:'hp',n:()=>'생명력',per:.01,cap:50,show:v=>`+${r21P(v)}%`},
    {k:'dr',n:()=>'받는 피해',per:.3,cap:30,show:v=>`−${r21R(v)}%`},
    {k:'res',n:()=>'모든 저항',per:1,cap:30,show:v=>`+${r21R(v)}`}]},
  {id:'mana',n:'마력의 판',d:'자원',col:'#b49cff',s:[
    {k:'mp',n:()=>'마나',per:.01,cap:30,show:v=>`+${r21P(v)}%`},
    {k:'cdr',n:()=>'재사용 대기',per:.3,cap:30,show:v=>`−${r21R(v)}%`},
    {k:'mc',n:()=>'마나 소모',per:.3,cap:30,show:v=>`−${r21R(v)}%`}]},
  {id:'path',n:'길잡이의 판',d:'편의',col:'#9fe0a0',s:[
    {k:'ms',n:()=>'이동 속도',per:.5,cap:20,show:v=>`+${r21R(v)}%`},
    {k:'gold',n:()=>'금화',per:.02,cap:20,show:v=>`+${r21P(v)}%`},
    {k:'find',n:()=>'아이템 찾기',per:.01,cap:20,show:v=>`+${r21P(v)}%`}]},
];
const r21R=v=>Math.round(v*10)/10,r21P=v=>Math.round(v*1000)/10;
const RUNE_SLOT={};for(const B of RUNE_B)for(const s of B.s)RUNE_SLOT[s.k]=Object.assign({b:B.id},s);
const RUNE_KEYS=Object.keys(RUNE_SLOT);
const RUNE_AT=[50,100,150,200];
// 새김: 판마다 이정표(50·100·150·200점)마다 셋. fx는 RV 단위로 더해진다
const RUNE_SV={
  pow:[
    [{n:'무너뜨리는 손',d:'보스에게 주는 무너짐 게이지 +10%',fx:{brk:.1}},{n:'큰 적 사냥',d:'정예·보스에게 주는 피해 +4%',fx:{elite:.04}},{n:'날카로운 눈',d:'치명타 확률 +2%',fx:{crit:2}}],
    [{n:'단련',d:'주 능력치 +40',fx:{st:40}},{n:'불붙는 힘',d:'모든 피해 +3%',fx:{dmg:.03}},{n:'급소',d:'치명 피해 +8%',fx:{cdm:8}}],
    [{n:'끝내기',d:'생명력이 절반 아래인 적에게 피해 +5%',fx:{exec:.05}},{n:'쉬지 않는 손',d:'재사용 대기 −3%',fx:{cdr:3}},{n:'아끼는 손',d:'마나 소모 −3%',fx:{mc:3}}],
    [{n:'큰 단련',d:'주 능력치 +80',fx:{st:80}},{n:'타오르는 힘',d:'모든 피해 +5%',fx:{dmg:.05}},{n:'깊은 급소',d:'치명 피해 +12%',fx:{cdm:12}}]],
  grd:[
    [{n:'약초꾼의 손',d:'물약 효과 +20%',fx:{pot:.2}},{n:'피 마시기',d:'적을 처치하면 생명력 1% 회복',fx:{killHp:.01}},{n:'두꺼운 살갗',d:'받는 피해 −2%',fx:{dr:2}}],
    [{n:'일으키는 손',d:'쓰러진 동료를 일으키는 기도가 30% 빨라짐 (사제 · 파티용)',fx:{rez:.3}},{n:'굳센 몸',d:'생명력 +6%',fx:{hp:.06}},{n:'원소 막이',d:'모든 저항 +10',fx:{res:10}}]],
  mana:[
    [{n:'마나 거두기',d:'적을 처치하면 마나 2% 회복',fx:{killMp:.02}},{n:'샘솟는 마나',d:'마나 회복 +15%',fx:{regen:.15}},{n:'깊은 샘',d:'마나 +6%',fx:{mp:.06}}]],
  path:[
    [{n:'금화 냄새',d:'금화 +10%',fx:{gold:.1}},{n:'보물 냄새',d:'아이템 찾기 +5%',fx:{find:.05}},{n:'가벼운 발',d:'이동 속도 +3%',fx:{ms:3}}]],
};
// 저항: 1점마다 원소·마법 공격에게 받는 피해 −0.5% (최대 −20%)
const RUNE_RES_PT=.005,RUNE_RES_CAP=.2;
// 각인 막대: 1점에 드는 경험치. 140레벨 지옥(불 꺼진 왕도) 혼자 사냥 ≈ 분당 25만 경험치(xprate21.cjs로 잰 값의 가운데) 기준
//   0점 150만(≈6분) → 100점 500만(≈20분) → 300점부터 1200만(≈48분)에서 멈춤. 파티·신비 보너스는 덧셈, 어둠 단계는 HUNT가 처치 경험치에 넣어 준다
const RUNE_XP0=1500000,RUNE_XPN=35000,RUNE_XPCAP=300;
function runeNeed(n){n=n==null?(P&&P.rune?P.rune.n:0):n;return RUNE_XP0+RUNE_XPN*Math.min(RUNE_XPCAP,Math.max(0,n|0))}

/* ===== 상태 · 정리 ===== */
const runeFresh=()=>({xp:0,n:0,a:Object.fromEntries(RUNE_KEYS.map(k=>[k,0])),s:{pow:[],grd:[],mana:[],path:[]},er:0});
let R21V=0;// 찍은 값이 바뀔 때마다 올림 (캐시)
function runeBump(){R21V++;if(typeof v20GsBump==='function')v20GsBump()}
const r21Int=(v,lo,hi)=>{v=Math.floor(+v);return Number.isFinite(v)?Math.max(lo,Math.min(hi,v)):lo};
// 저장된 값 다듬기: 아는 칸만 고치고 모르는 칸은 그대로 둔다
function runeClean(d){const o=runeFresh();if(!d||typeof d!=='object'||Array.isArray(d))return o;
  for(const k in d)if(!(k in o))o[k]=d[k];// 모르는 칸 보존
  o.xp=Number.isFinite(+d.xp)?Math.max(0,Math.floor(+d.xp)):0;o.n=r21Int(d.n,0,1e6);o.er=r21Int(d.er,0,999);
  const a=d.a&&typeof d.a==='object'?d.a:{};for(const k in a)if(!(k in o.a))o.a[k]=a[k];
  for(const k of RUNE_KEYS){const c=RUNE_SLOT[k].cap||1e6;o.a[k]=r21Int(a[k],0,c)}
  let sum=0;for(const k of RUNE_KEYS)sum+=o.a[k];if(sum>o.n){for(const k of RUNE_KEYS)o.a[k]=0}// 망가진 값: 점수를 돌려준다
  const s=d.s&&typeof d.s==='object'?d.s:{};for(const k in s)if(!(k in o.s))o.s[k]=s[k];
  for(const b in RUNE_SV){const arr=Array.isArray(s[b])?s[b]:[];o.s[b]=RUNE_SV[b].map((_,i)=>{const v=arr[i];return Number.isInteger(v)&&v>=0&&v<3?v:null});while(o.s[b].length&&o.s[b][o.s[b].length-1]==null)o.s[b].pop()}
  // 고를 수 없는 새김(그 판 점수가 모자람)은 지운다
  for(const b in RUNE_SV){const sp=r21Spent(o,b);o.s[b]=o.s[b].map((v,i)=>sp>=RUNE_AT[i]?v:null);while(o.s[b].length&&o.s[b][o.s[b].length-1]==null)o.s[b].pop()}
  if(o.xp>=runeNeed(o.n))o.xp=runeNeed(o.n)-1;return o}
function runeSt(){if(!P.rune||typeof P.rune!=='object')P.rune=runeFresh();return P.rune}
const r21Spent=(r,b)=>{let n=0;for(const s of RUNE_B.find(B=>B.id===b).s)n+=r.a[s.k]|0;return n};
function runeSpent(b){const r=runeSt();if(b)return r21Spent(r,b);let n=0;for(const k of RUNE_KEYS)n+=r.a[k]|0;return n}
function runeLeft(){const r=runeSt();return Math.max(0,(r.n|0)-runeSpent())}
const runeBoardMax=b=>{const B=RUNE_B.find(x=>x.id===b);return B.s.some(s=>!s.cap)?Infinity:B.s.reduce((a,s)=>a+s.cap,0)};
const runeMiles=b=>RUNE_AT.filter((at,i)=>i<(RUNE_SV[b]||[]).length&&at<=runeBoardMax(b));
// 지금 효과(RV 단위)를 한 번에 모아 둔다
let R21C={v:-1,p:null,o:null};
function runeV(){if(R21C.v===R21V&&R21C.p===P&&R21C.o)return R21C.o;const o={},r=P&&P.rune;
  if(r&&typeof r==='object'){for(const k of RUNE_KEYS)o[k]=(o[k]||0)+(r.a&&r.a[k]|0)*RUNE_SLOT[k].per;
    for(const b in RUNE_SV){const arr=r.s&&r.s[b];if(!Array.isArray(arr))continue;arr.forEach((c,i)=>{const sv=RUNE_SV[b][i]&&RUNE_SV[b][i][c];if(sv)for(const k in sv.fx)o[k]=(o[k]||0)+sv.fx[k]})}}
  R21C={v:R21V,p:P,o};return o}
const runeVal=k=>runeV()[k]||0;

/* ===== 재의 결정 ===== */
function ashGain(n,x,y){if(!P||GHOST)return P?P.ash|0:0;n=Math.round(+n);if(!Number.isFinite(n)||n<=0)return P.ash|0;
  P.ash=Math.max(0,(P.ash|0))+n;ftext(x!=null?x:P.x+14,y!=null?y:P.y,`+${n} 재의 결정`,'#ffb27a',false,64);
  if(time-(ashGain.t||-9)>1.5){ashGain.t=time;rings.push({x:x!=null?x:P.x,y:y!=null?y:P.y,r:4,max:36,life:.35,col:'#ffb27a'})}
  return P.ash}
function ashSpend(n){n=Math.round(+n);if(!P||!(n>=0)||(P.ash|0)<n)return false;P.ash=(P.ash|0)-n;return true}

/* ===== 각인 막대 ===== */
// 어둠 단계 경험치(darkMods().xp)는 HUNT가 rewardKill 안에서 이미 곱해서 넘기므로 여기서 다시 더하지 않는다
function runeXpBonus(){let k=0;if(typeof PTY==='object'&&PTY.xpK>1)k+=PTY.xpK-1;
  if(typeof WON==='object'&&WON.inNow&&WON.w&&WON.w.fx&&WON.w.fx.xp)k+=WON.w.fx.xp;return k}
function runeXp(n){const r=runeSt();n=Math.max(1,Math.round(n*(1+runeXpBonus())));r.xp=(r.xp||0)+n;
  ftext(P.x+18,P.y,'+'+n.toLocaleString()+' 각인','#6ee0d0',false,58);let got=0;
  while(r.xp>=runeNeed(r.n)){r.xp-=runeNeed(r.n);r.n++;got++}
  if(got){rings.push({x:P.x,y:P.y,r:10,max:110,life:.8,col:'#6ee0d0'});burst(P.x,P.y,'#6ee0d0',36,180,3,20);
    msg(`각인 점수 ${got}점을 얻었습니다 (모은 점수 ${r.n} · 남은 점수 ${runeLeft()}) — 캐릭터 창 「룬 각인」`,'#6ee0d0');r21Tab();save()}
  return got}
{const _gx=gainXp;gainXp=function(n){if(P&&!GHOST&&P.lvl>=MAXLV&&n>0){runeXp(n);return}const l0=P?P.lvl:0;const r=_gx.apply(this,arguments);
  if(P&&l0<MAXLV&&P.lvl>=MAXLV){setTimeout(()=>msg('이제부터 경험치는 「각인 막대」에 쌓입니다. 막대가 차면 각인 점수 1점 — 캐릭터 창 「룬 각인」','#6ee0d0'),400);r21Tab()}return r}}

/* ===== 찍기 · 새김 · 지우개 ===== */
function runeAdd(k,q){const S=RUNE_SLOT[k];if(!S)return 0;const r=runeSt();q=Math.max(0,Math.floor(q||1));const cap=S.cap||Infinity;
  q=Math.min(q,runeLeft(),cap-(r.a[k]|0));if(!(q>0))return 0;const b0=runeSpent(S.b);r.a[k]=(r.a[k]|0)+q;runeBump();
  const b1=runeSpent(S.b);RUNE_AT.forEach((at,i)=>{if(b0<at&&b1>=at&&RUNE_SV[S.b][i])msg(`${RUNE_B.find(B=>B.id===S.b).n} ${at}점: 새김을 하나 고를 수 있습니다`,'#ffe39a')});return q}
function runePick(b,i,c){const r=runeSt(),L=RUNE_SV[b];if(!L||!L[i]||!(c>=0&&c<3))return false;if(runeSpent(b)<RUNE_AT[i])return false;
  const arr=r.s[b]||(r.s[b]=[]);if(arr[i]!=null)return false;while(arr.length<i)arr.push(null);arr[i]=c;runeBump();
  const sv=L[i][c];rings.push({x:P.x,y:P.y,r:8,max:90,life:.6,col:'#ffe39a'});msg(`새김 「${sv.n}」: ${sv.d}`,'#ffe39a');return true}
function runeErase(){const r=runeSt();if((r.er|0)<=0)return false;const back=runeSpent();r.er--;for(const k of RUNE_KEYS)r.a[k]=0;r.s={pow:[],grd:[],mana:[],path:[]};runeBump();
  rings.push({x:P.x,y:P.y,r:10,max:120,life:.8,col:'#c9b4ff'});burst(P.x,P.y,'#c9b4ff',30,160);msg(`각인 지우개: 각인 점수 ${back}점을 돌려받았습니다. 새김도 다시 고릅니다`,'#c9b4ff');return true}
function runeEraserGive(n){const r=runeSt();n=Math.max(0,Math.floor(+n||0));r.er=Math.min(999,(r.er|0)+n);return r.er}
function eraserGain(n){return runeEraserGive(n)}// HUNT(현상금 증표 상점)가 부르는 이름
const runeEraserPrice=()=>20000+200*Math.min(300,runeSpent());

/* ===== 효과 연결 (모두 덧셈 · 기존 상한) ===== */
// 장비 능력치에 더함: 주 능력치 · 치명 피해(critd) · 치명타 · 생명력/마나 %(맨몸+장비 값의 %) · 받는 피해 · 재사용 · 마나 소모 · 이동 · 마나 회복 %
V20.gsAdd.push((x,o)=>{if(!P||!P.rune)return;const v=runeV(),add=(k,n)=>{if(n)x[k]=(x[k]||0)+n};
  add(runeMainK(),v.st);add('critd',v.cdm);add('crit',v.crit);add('dr',v.dr);add('cdr',v.cdr);add('mcost',v.mc);add('ms',v.ms);
  if(v.hp){const C=CLASSES[P.cls];add('hp',v.hp*((40+P.lvl*12+(P.st.vit||0)*4)*C.hp+(o.hp||0)))}
  if(v.mp){const C=CLASSES[P.cls];add('mp',v.mp*((20+P.lvl*5+(P.st.spi||0)*3)*C.mp+(o.mp||0)))}
  if(v.regen&&typeof v20RegenPct==='function')add('regen',v20RegenPct(o,v.regen))});
// v20 캐시는 레벨·정신만 본다: 활력이 바뀌면(생명력 %) 다시 계산하게
{const _g=gearStats;let gv=null,gp=null;gearStats=function(){if(P!==gp||P.st.vit!==gv){gp=P;gv=P.st.vit;V20.gsVer++}return _g()}}
// 모든 피해 % · 정예/보스 · 끝내기: 피해 증가 칸(dmgCap 안)
V20.dmgAdd.push((e,s)=>{if(!P||!P.rune)return 0;const v=runeV();let x=v.dmg||0;const t=TYPES[e.k]||{};
  if(v.elite&&(e.elite||t.boss||t.mini))x+=v.elite;if(v.exec&&e.max>0&&e.hp<e.max*.5)x+=v.exec;return x});
// 치명 피해: hurtE의 1.75배에 덧셈 (b3.js가 이 함수를 부른다)
function critDmgK(){return 1.75+Math.max(0,stat('critd'))/100}
STATN.critd='치명 피해 %';
// 저항: 원소 몬스터(GEAR monEl(e))·마법(투사체/원거리 몬스터)에게 받는 피해
const runeResK=()=>Math.min(RUNE_RES_CAP,runeVal('res')*RUNE_RES_PT);
{const _hp=hitPlayer;hitPlayer=function(d,src,o){if(P&&P.rune&&d>0&&!P.dead){const k=runeResK();if(k>0){const t=src&&TYPES[src.k],me=src&&(typeof monEl==='function'?monEl(src):src.mel);if(!src||me||(t&&t.ranged))d*=1-k}}return _hp.call(this,d,src,o)}}
// 아이템 찾기: 각인 + 새김 + 어둠 단계(darkMods().find) + 파티(2인 +10% · 3인 이상 +20%, 설계 §1)
function runeFind(){let f=runeVal('find');if(typeof darkMods==='function'){try{const m=darkMods();if(m&&Number.isFinite(+m.find))f+=+m.find}catch(e){if(window.__QA)throw e}}
  if(typeof PTY==='object'&&PTY.partyN){const n=PTY.partyN();f+=n>=3?.2:n===2?.1:0}return f}
function runeFindRoll(e){const t=TYPES[e.k]||{};if(t.boss||t.mini||e.qa)return null;const f=runeFind();if(!(f>0))return null;
  if(R()>=(e.elite?.5:.1)*f)return null;const it=makeItem(e.lvl||1,!!e.elite);if(typeof junkKeep==='function'&&!junkKeep(it))return null;
  loot.push({x:e.x+rnd(-16,16),y:e.y+rnd(-16,16),kind:'item',item:it,t:0});return it}
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);if(!P||GHOST||!e)return r;try{runeFindRoll(e);
  const v=runeV();if(!P.dead){if(v.killMp)P.mp=Math.min(maxMp(),P.mp+maxMp()*v.killMp);if(v.killHp)P.hp=Math.min(maxHp(),P.hp+maxHp()*v.killHp)}}catch(err){if(window.__QA)throw err}return r}}
// 금화: 주운 금화의 값(다른 보너스 전 값)에 % 를 더한다
{const _pk=pickup;pickup=function(l){const g=l&&l.kind==='gold'&&!l.taken&&P?runeVal('gold'):0,a0=l&&l.amt;const r=_pk.apply(this,arguments);
  if(g>0&&l.taken&&a0>0){const x=Math.round(a0*g);if(x>0)P.gold+=x}return r}}
// 물약 효과
{const _dp=drinkPotion;drinkPotion=function(k){const r=_dp.apply(this,arguments);const v=runeVal('pot');if(r&&v>0){const h=P.potHot&&P.potHot[k];if(h&&!h._r21){h._r21=1;h.rate*=1+v}}return r}}
// 부활 기도가 빨라짐 (시전 시간 ÷ 1.3)
{const _tc=tryCast;tryCast=function(id,tg){const r=_tc.apply(this,arguments);if(!GHOST&&typeof CAST==='object'){const c=CAST.cur,v=runeVal('rez');if(v>0&&c&&c.id===id&&!c._r21&&SPELLS[id]&&SPELLS[id].kind==='rez'){c._r21=1;c.max=c.max/(1+v)}}return r}}
// 무너짐 게이지: 내 기술(3차 breakAdd · 기절/빙결 등 PTY.stagFx)
{const _ba=breakAdd;breakAdd=function(e,amt){const v=!GHOST?runeVal('brk'):0;return _ba.call(this,e,v>0&&amt>0?amt*(1+v):amt)}}
if(typeof PTY==='object'){let k=0;const _sx=PTY.stagFx,_st=PTY.stag;
  PTY.stagFx=function(e,s){const v=!GHOST&&!(s&&s.ghost)?runeVal('brk'):0;if(!(v>0))return _sx.call(this,e,s);const k0=k;k=v;try{return _sx.call(this,e,s)}finally{k=k0}};
  PTY.stag=function(e,amt,why){return _st.call(this,e,k>0&&amt>0?amt*(1+k):amt,why)}}

/* ===== 저장 · 불러오기 ===== */
function runeOut(){const r=runeSt();return JSON.parse(JSON.stringify(r))}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P){const r=runeOut(),a=Math.max(0,P.ash|0);d.ash=a;d.rune=r;
  if(d.pot&&typeof d.pot==='object'){const p=Object.assign({},d.pot);if(a||r.n||r.xp)p._r21={a,r};else delete p._r21;d.pot=p}}}catch(e){if(window.__QA)throw e}return d}}
function runeLoadFrom(d){d=d&&typeof d==='object'?d:{};const m=d.pot&&typeof d.pot==='object'&&d.pot._r21&&typeof d.pot._r21==='object'?d.pot._r21:null;
  const src=d.rune&&typeof d.rune==='object'?d.rune:m&&m.r;P.rune=runeClean(src);
  const a=Number.isFinite(+d.ash)&&d.ash!=null?+d.ash:m&&Number.isFinite(+m.a)?+m.a:0;P.ash=Math.max(0,Math.floor(a));
  if(P.pot&&P.pot._r21){P.pot=Object.assign({},P.pot);delete P.pot._r21}runeBump()}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok)try{runeLoadFrom(d)}catch(e){if(window.__QA)throw e;runeLoadFrom(null)}return ok}}
{const _ng=newGame;newGame=function(cls,slot){const r=_ng.apply(this,arguments);runeLoadFrom(null);return r}}

/* ===== 화면: 경험치 막대 → 각인 막대 · 재의 결정 칸 ===== */
let r21HudK='';
v20Css('.xpbar.r21 i{background:linear-gradient(90deg,#1a5a5a,#5ee0d0)}.xptext.r21{color:#8fe8dc}#ash21{color:#ffb27a;margin-left:6px}#ash21[hidden]{display:none}'+
  '.r21top{display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center;margin:0 0 6px}.r21top b{color:#6ee0d0}.r21cnt{color:#ffb27a}.r21sv{display:flex;flex-direction:column;gap:4px;margin-top:4px}'+
  '.r21sv button{text-align:left;white-space:normal;line-height:1.35}.r21sv .got{color:#ffe39a}.r21slot b.v{min-width:58px;display:inline-block;text-align:right}.r21slot .cap{font-size:12px}'+
  '.r21slot button:disabled,.r21top button:disabled{opacity:.35;cursor:default}#tabRune .dot{display:inline-block;width:7px;height:7px;border-radius:4px;background:#6ee0d0;margin-left:4px;vertical-align:1px}');
{const g=document.querySelector('#hud .gold');if(g&&!document.getElementById('ash21')){const s=document.createElement('span');s.id='ash21';s.hidden=true;s.innerHTML='재의 결정 <b>0</b>';g.appendChild(s)}}
{const _uh=updateHud;let top0=null,ws='',ts='',ak=-1;updateHud=function(){_uh.apply(this,arguments);if(!P)return;const top=P.lvl>=MAXLV;
  if(top!==top0){top0=top;const bar=document.querySelector('#hud .xpbar'),t=document.getElementById('xptext');if(bar)bar.classList.toggle('r21',top);if(t)t.classList.toggle('r21',top);r21HudK=''}
  if(top){const r=runeSt(),left=runeLeft(),k=r.xp+'|'+r.n+'|'+left;if(k!==r21HudK){r21HudK=k;const need=runeNeed(r.n);ws=Math.min(100,r.xp/need*100).toFixed(1)+'%';ts=`각인 ${Math.floor(r.xp).toLocaleString()} / ${need.toLocaleString()}${left?` · 남은 점수 ${left}`:''}`}
    const f=document.getElementById('xpfill'),t=document.getElementById('xptext');if(f&&f.style.width!==ws)f.style.width=ws;if(t&&t.textContent!==ts)t.textContent=ts}
  const a=P.ash|0,kk=top?a:a>0?a:-2;if(kk!==ak){ak=kk;const el=document.getElementById('ash21');if(el){const show=top||a>0;el.hidden=!show;if(show)el.querySelector('b').textContent=a.toLocaleString()}}}}

/* ===== 「룬 각인」 탭 (캐릭터 창) ===== */
{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.id='tabRune';b.setAttribute('aria-selected','false');b.hidden=true;b.textContent='룬 각인';
  const c=document.getElementById('tabRep')||document.getElementById('tabChar');if(c)c.insertAdjacentElement('afterend',b);b.onclick=()=>{tab='rune';renderPanel()}}
function runeTabOn(){return !!P&&(P.lvl>=MAXLV||(P.rune&&(P.rune.n>0||P.rune.er>0)))}
function runePending(){const r=runeSt();let n=0;for(const b in RUNE_SV)runeMiles(b).forEach((at,i)=>{if(runeSpent(b)>=at&&(r.s[b]||[])[i]==null)n++});return n}
function r21Tab(){const b=document.getElementById('tabRune');if(!b)return;const on=runeTabOn();b.hidden=!on;if(!on)return;const dot=runeLeft()>0||runePending()>0;
  const h='룬 각인'+(dot?'<span class="dot" aria-label="쓸 점수 있음"></span>':'');if(b.innerHTML!==h)b.innerHTML=h}
const r21Btn=(act,arg,label,dis,cls)=>`<button type="button"${cls?` class="${cls}"`:''} data-r21="${act}" data-r21b="${arg}"${dis?' disabled':''}>${label}</button>`;
function runeTabHtml(){const r=runeSt(),left=runeLeft(),need=runeNeed(r.n),mob=typeof v20Mob==='function'&&v20Mob();
  let h=`<div class="r21top"><span>남은 각인 점수 <b>${left}</b> <span class="muted">/ 모은 점수 ${r.n}</span></span><span class="r21cnt">재의 결정 ${(P.ash|0).toLocaleString()}</span><span>각인 지우개 ${r.er|0}개 ${r21Btn('erase','',`쓰기`,!(r.er>0)||!runeSpent(),'ghost')}</span></div>`;
  h+=`<div class="v20bar" title="각인 막대"><i style="width:${Math.min(100,r.xp/need*100).toFixed(1)}%;background:#5ee0d0"></i></div><p class="muted" style="font-size:12px;margin:3px 0 8px">각인 막대 ${Math.floor(r.xp).toLocaleString()} / ${need.toLocaleString()}${P.lvl<MAXLV?` · ${MAXLV}레벨이 되면 경험치가 여기에 쌓입니다`:''}. 막대가 차면 1점. 모든 값은 장비의 같은 능력에 더해집니다(곱하지 않음). 각인 지우개는 잡화점에서 삽니다.</p>`;
  for(const B of RUNE_B){const sp=runeSpent(B.id),mx=runeBoardMax(B.id);
    h+=`<details class="v20box"${mob&&!sp?'':' open'}><summary><b style="color:${B.col}">${B.n}</b> <span class="muted">· ${B.d} · 찍은 점수 ${sp}${mx<Infinity?` / ${mx}`:''}</span></summary>`;
    for(const s of B.s){const n=r.a[s.k]|0,full=s.cap&&n>=s.cap;
      h+=`<div class="v20row r21slot"><div>${s.n()} <b class="v" style="color:${B.col}">${n?s.show(n*s.per):s.show(0).replace(/^[+−]/,'')}</b> <span class="muted cap">${s.cap?`${n}/${s.cap}점 · 최대 ${s.show(s.cap*s.per)}`:`${n}점 · 1점마다 ${s.show(s.per)} · 끝없음`}</span></div><div class="btns">${r21Btn('add',s.k+'|1','+1',!left||full)}${r21Btn('add',s.k+'|5','+5',left<1||full)}</div></div>`}
    const miles=runeMiles(B.id);if(miles.length){h+='<div class="r21sv">';
      miles.forEach((at,i)=>{const ch=(r.s[B.id]||[])[i],L=RUNE_SV[B.id][i];
        if(ch!=null){h+=`<div class="got">새김 ${at}점 · 「${L[ch].n}」 <span class="muted">${L[ch].d}</span></div>`;return}
        if(sp<at){h+=`<div class="muted" style="font-size:12px">새김 ${at}점 (${sp}/${at}) · ${L.map(x=>x.n).join(' / ')}</div>`;return}
        h+=`<div><b style="color:#ffe39a">새김 ${at}점 · 하나를 고르세요</b> <span class="muted" style="font-size:12px">(각인 지우개를 쓰기 전에는 바꿀 수 없음)</span></div>`+L.map((x,c)=>r21Btn('pick',`${B.id}|${i}|${c}`,`<b>${x.n}</b> · ${x.d}`)).join('')});
      h+='</div>'}
    h+='</details>'}
  const v=runeV(),tot=[];if(v.st)tot.push(`${runeMainN()} +${v.st}`);if(v.dmg)tot.push(`모든 피해 +${r21P(v.dmg)}%`);if(v.cdm)tot.push(`치명 피해 +${r21R(v.cdm)}%`);if(v.hp)tot.push(`생명력 +${r21P(v.hp)}%`);if(v.dr)tot.push(`받는 피해 −${r21R(v.dr)}%`);
  if(v.res)tot.push(`모든 저항 +${r21R(v.res)} (원소·마법 공격 −${r21P(runeResK())}%)`);if(v.mp)tot.push(`마나 +${r21P(v.mp)}%`);if(v.cdr)tot.push(`재사용 대기 −${r21R(v.cdr)}%`);if(v.mc)tot.push(`마나 소모 −${r21R(v.mc)}%`);if(v.ms)tot.push(`이동 속도 +${r21R(v.ms)}%`);
  if(v.gold)tot.push(`금화 +${r21P(v.gold)}%`);const f=runeFind();if(f)tot.push(`아이템 찾기 +${r21P(f)}%${f!==runeVal('find')?' (어둠 단계·파티 포함)':''}`);
  h+=`<h2>지금 각인 효과</h2><p class="muted" style="margin-top:0">${tot.length?tot.join(' · '):'아직 찍은 점수가 없습니다.'}</p><p class="muted" style="font-size:12px">재사용 대기·마나 소모·받는 피해·이동 속도는 장비와 합쳐 원래 상한(재사용 50% · 마나 소모 40% · 받는 피해 50% · 이동 40%) 안에서 셉니다. 모든 피해 %는 강화와 같은 「피해 증가」 칸에 더해집니다.</p>`;
  return h}
{const _rp=renderPanel;renderPanel=function(){_rp.apply(this,arguments);if(!P)return;r21Tab();const b=document.getElementById('tabRune');if(b)b.setAttribute('aria-selected',tab==='rune');if(tab!=='rune')return;
  const ps=pbody.parentElement.scrollTop;document.querySelector('.tabs').hidden=false;$('#ptitle').textContent='룬 각인';pbody.innerHTML=runeTabHtml();pbody.parentElement.scrollTop=ps}}
// 캐릭터 창(가방): 재의 결정 · 각인 지우개 한 줄
{const _c=charHtml;charHtml=function(){const h=_c.apply(this,arguments);if(!P||!(runeTabOn()||(P.ash|0)>0))return h;const r=runeSt();
  const line=`<p class="r21inv" style="margin:4px 0 8px"><span class="r21cnt">재의 결정 <b>${(P.ash|0).toLocaleString()}</b></span> <span class="muted">· 장비 재련 재료 (마을 대장간)</span> · 각인 지우개 <b>${r.er|0}</b>${runeTabOn()?` · 남은 각인 점수 <b style="color:#6ee0d0">${runeLeft()}</b>`:''}</p>`;
  const i=h.indexOf('<h2>착용');return i>=0?h.slice(0,i)+line+h.slice(i):h+line}}
// 잡화점: 각인 지우개 (140레벨부터 · 망각의 물약 아래)
{const _sh=shopHtml;shopHtml=function(){let h=_sh.apply(this,arguments);if(!P||!runeTabOn()||actShop!=='general'&&SHOP_SLOTS[actShop])return h;
  const pr=runeEraserPrice(),row=`<div class="shoprow" data-r21row="er"><div>${miscIcon('respec',26)}각인 지우개 <span class="muted">· 찍은 각인 점수를 모두 돌려받고 새김도 다시 고릅니다 · 가진 것 ${runeSt().er|0}개</span></div><div class="btns">${r21Btn('buyer','',`사기 ${pr.toLocaleString()}`,P.gold<pr)}</div></div>`;
  const i=h.indexOf('data-respec="1"');if(i>=0){const j=h.indexOf('</div></div>',i);if(j>=0)return h.slice(0,j+12)+row+h.slice(j+12)}
  const k=h.indexOf('</p>');return k>=0?h.slice(0,k+4)+row+h.slice(k+4):row+h}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-r21]');if(!b||b.disabled||!P)return;const a=b.dataset.r21,v=String(b.dataset.r21b||'').split('|');
  if(a==='add'){if(!runeAdd(v[0],+v[1]||1))return}else if(a==='pick'){if(!runePick(v[0],+v[1],+v[2]))return}else if(a==='erase'){if(!runeErase())return}
  else if(a==='buyer'){const pr=runeEraserPrice();if(P.gold<pr)return;P.gold-=pr;runeEraserGive(1);msg(`각인 지우개를 샀습니다 (가진 것 ${runeSt().er}개)`,'#c9b4ff')}else return;
  if(!panel.hidden)renderPanel();save()});
window.__r21={RUNE_B,RUNE_SV,RUNE_SLOT,RUNE_AT,runeNeed,runeV,runeVal,runeAdd,runePick,runeErase,runeEraserGive,runeEraserPrice,runeLeft,runeSpent,runeFind,runeClean,ashGain,ashSpend,runeXp};
