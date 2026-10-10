/* ---------- v22 END2: 엔드컨텐츠 둘째 묶음 (아이템) — A3 룬 홈 · 룬 문장 / A4 각성 유니크 · 직업 엔드 세트 ----------
   설계: rpg/endgame/엔드컨텐츠-설계서.md (1절 규칙 · A3 · A4 · B1 표의 「새로 나오는 것」 · 4~6절), rpg/v21-builds 설계서 「세트냐 핵심이냐」.
   · 룬 홈: 무기·보조(방패·화살통)·갑옷·모자 중 il≥130이거나 어둠 단계 지역에서 나온 장비에 홈 0~2개 (it.so = [룬석 id 또는 null]).
     상점 물건과 예전 장비에는 홈이 생기지 않는다(불러올 때 장비를 바꾸지 않음).
   · 룬석 12종 × 1~3등급: 가방 칸이 아니라 캐릭터의 「룬석 주머니」(P.e22.rs = {id:개수})에 쌓인다. 창고의 「룬석 주머니」로 다른 캐릭터에게 넘길 수 있다.
     대장장이(무기상·방어구상)에서 박기 · 빼기(빼면 룬석은 사라짐, 장비는 무사 — 설계 그대로) · 바꾸기(원래 룬석은 사라짐) · 같은 룬석 3개 → 한 등급 위(재의 결정).
   · 룬 문장 8개: 홈 2개 장비에 정해진 두 룬을 정해진 순서로 박으면 특별한 효과 하나. 처음 맞추거나 「룬 문장 쪽지」를 얻으면 도감에 적힌다.
   · 각성 유니크: 어둠 6단계 이상에서 나온 유니크·상급 유니크·빌드 핵심이 6%(+1%/단계, 10단계 10%) 확률로 각성판 —
     모든 수치가 그 아이템의 최고값 + 능력 한 줄(it.awk=1, it.awx). 이름이 잿빛 금색. 새 아이템이 아니라 기존 유니크의 각성판.
   · 직업 엔드 세트 4개(직업마다 하나, 3차 갈래 둘 다 씀): 2·4·6벌 효과, 6벌은 내 3차 갈래를 밀어 준다. 어둠 4단계 이상 · B4 보스에서만.
     빌드 핵심과 같은 칸을 쓴다(마법사·사제는 칸이 6개라 6벌이면 핵심 칸이 없다) → 「세트냐 핵심이냐」.
   · 드랍: end22Drop(where,tier,x,y,o) — 'dark'는 여기서 rewardKill에 건다. B4(DEEP)는 'b4'/'b4hidden', 미궁 심층은 'deep'.
   · 모든 수치는 덧셈(V20.gsAdd · V20.dmgAdd · V20.healK). 「+모든 스킬」은 어디에도 없다(상한 5 그대로).
   저장: P.e22={rs,rw} (없으면 기본값, 모르는 칸은 그대로), 장비 안의 so/awk/awx/esp는 장비와 함께 그대로 저장된다. */
const E22={ver:1,shop:0,noAwk:0,sel:null,sock:0,raw:false,j3:null,rwT:{},cache:null};
const E22_SOCK_SLOTS=['staff','off','robe','hat'];
const E22_SOCK={p1:.3,p2:.1,p2t:.01,il:130};// 홈 1개 30% · 2개 10%+1%/어둠 단계 (덧셈)
/* ===== 룬석 12종 (값: 1·2·3등급) ===== */
const E22_RUNES={
  ig:{n:'이그',k:'불',c:'#ff7a2e',st:'el_fire',v:[6,10,15]},
  nae:{n:'나에',k:'물',c:'#8fd8ff',st:'el_ice',v:[6,10,15]},
  vel:{n:'벨',k:'바람',c:'#ffe066',st:'el_storm',v:[6,10,15]},
  lum:{n:'루멘',k:'빛',c:'#ffe39a',st:'el_holy',v:[6,10,15]},
  dor:{n:'도르',k:'바위',c:'#c9a46a',st:'dr',v:[2,3,5]},
  heim:{n:'하임',k:'생명',c:'#9fe39a',st:'hp',v:[80,140,220]},
  mar:{n:'마르',k:'마나',c:'#7aa2ff',st:'mp',v:[60,100,160]},
  sera:{n:'세라',k:'샘',c:'#6ad8d0',st:'mcost',v:[2,3,5]},
  kro:{n:'크로',k:'시간',c:'#b9a2ff',st:'cdr',v:[2,3,5]},
  as:{n:'아스',k:'칼날',c:'#e8ecf4',st:'crit',v:[2,3,4]},
  pir:{n:'피르',k:'피',c:'#e0485a',st:'ls',v:[1,1.5,2]},
  sol:{n:'솔',k:'힘',c:'#ffb04a',st:'main',v:[10,18,28]}};
const E22_RIDS=Object.keys(E22_RUNES);
const E22_GN=['','1등급','2등급','3등급'];
const E22_MERGE=[0,3,8];// 3개 → 한 등급 위: 1→2 재의 결정 3, 2→3 재의 결정 8
const e22Main=cls=>cls==='warrior'?'str':cls==='archer'?'dex':'int';
// 룬석 id 'ig2' → {r:'ig', g:2}
function e22Rp(id){if(typeof id!=='string')return null;const m=/^([a-z]+)([123])$/.exec(id);if(!m||!E22_RUNES[m[1]])return null;return{r:m[1],g:+m[2]}}
const e22RId=(r,g)=>r+g;
function e22RStat(id,cls){const p=e22Rp(id);if(!p)return null;const R0=E22_RUNES[p.r];return{k:R0.st==='main'?e22Main(cls||P.cls):R0.st,v:R0.v[p.g-1]}}
function e22RName(id){const p=e22Rp(id);if(!p)return '알 수 없는 룬석';const R0=E22_RUNES[p.r];return `${R0.k}의 룬 「${R0.n}」 ${E22_GN[p.g]}`}
function e22RLine(id,cls){const s=e22RStat(id,cls);return s?statOne(s.k,s.v):''}
/* ===== 룬 문장 8개: 홈 2개 장비에 a → b 순서 ===== */
const E22_RW=[
  {id:'ig_vel',a:'ig',b:'vel',n:'불타는 폭풍',d:'불 마법이 적을 맞히면 그 적 둘레(90)에 작은 회오리: 그 피해의 25%를 번개 피해로 (0.6초에 한 번)'},
  {id:'nae_dor',a:'nae',b:'dor',n:'얼어붙은 땅',d:'냉기 피해를 받은 적이 2초 동안 느려짐 (보스·준보스 0.6초)'},
  {id:'lum_heim',a:'lum',b:'heim',n:'따뜻한 빛',d:'신성·빛 피해를 줄 때 생명력 0.6% 회복 (0.5초에 한 번)'},
  {id:'kro_sera',a:'kro',b:'sera',n:'멈춘 샘',d:'마나가 25% 아래로 떨어지면 마나 20% 회복 (45초에 한 번)'},
  {id:'as_pir',a:'as',b:'pir',n:'피의 칼날',d:'치명타 피해 +20%'},
  {id:'dor_heim',a:'dor',b:'heim',n:'바위 심장',d:'생명력이 절반 아래로 떨어지면 5초 동안 받는 피해 −15% (40초에 한 번)'},
  {id:'mar_vel',a:'mar',b:'vel',n:'번개 샘',d:'번개 피해를 줄 때 마나 0.5% 회복 (0.3초에 한 번)'},
  {id:'sol_as',a:'sol',b:'as',n:'사냥꾼의 숨',d:'적을 쓰러뜨리면 4초 동안 이동 속도 +10%'}];
const E22_RWBY={};for(const w of E22_RW)E22_RWBY[w.id]=w;
// 장비 하나의 룬 문장 (홈 2개 · 둘 다 박힘 · 순서대로)
function e22ItemRw(it){const so=it&&it.so;if(!Array.isArray(so)||so.length!==2)return null;const a=e22Rp(so[0]),b=e22Rp(so[1]);if(!a||!b)return null;
  for(const w of E22_RW)if(w.a===a.r&&w.b===b.r)return w;return null}
// 문장 짜임새는 맞는데 빈 칸이 있으면 무엇이 될지 (툴팁 귀띔용)
/* ===== 직업 엔드 세트 (직업마다 하나 · 2/4/6벌) ===== */
const E22_SETS={
  e22_mage:{n:'잿빛 별의 현자',cls:'mage',key:'tr_0',p:{staff:'잿빛 별의 지팡이',robe:'잿빛 별의 로브',hat:'잿빛 별의 고깔',ring:'잿빛 별의 반지',ring2:'잿빛 별의 인장',amulet:'잿빛 별의 목걸이'},
    b:{2:{int:60,mp:200},4:{crit:8,cdr:8}},br:{archsorcerer:{dmg:.25,st:{critd:20},d:'치명타 피해 +20%'},spiritking:{dmg:.25,st:{dr:6},d:'받는 피해 감소 +6%'}}},
  e22_priest:{n:'꺼지지 않는 등불',cls:'priest',key:'tr_0',p:{staff:'등불지기의 홀',robe:'등불지기의 예복',hat:'등불지기의 관',ring:'등불지기의 반지',ring2:'등불지기의 묵주 반지',amulet:'등불지기의 성표'},
    b:{2:{int:60,regen:6},4:{dr:6,cdr:8}},br:{executor:{dmg:.25,st:{crit:6},d:'치명타 +6%'},saint:{dmg:.15,heal:.2,d:'내가 거는 치유 +20%'}}},
  e22_warrior:{n:'재 속의 맹세',cls:'warrior',key:'tr_0',p:{staff:{sword:'재 맹세의 장검',polearm:'재 맹세의 창'},off:'재 맹세의 방패',robe:'재 맹세의 갑주',hat:'재 맹세의 투구',ring:'재 맹세의 반지',ring2:'재 맹세의 인장',amulet:'재 맹세의 훈장'},
    b:{2:{str:40,hp:400},4:{dr:6,ias:8}},br:{bulwark:{dmg:.15,st:{dr:8},d:'받는 피해 감소 +8%'},warlord:{dmg:.25,st:{crit:6},d:'치명타 +6%'}}},
  e22_archer:{n:'별을 쫓는 사냥꾼',cls:'archer',key:'tr_0',p:{staff:{bow:'별사냥꾼의 장궁',xbow:'별사냥꾼의 석궁'},off:'별사냥꾼의 화살통',robe:'별사냥꾼의 가죽옷',hat:'별사냥꾼의 두건',ring:'별사냥꾼의 반지',ring2:'별사냥꾼의 인장',amulet:'별사냥꾼의 깃 목걸이'},
    b:{2:{dex:40,acc:150},4:{crit:8,ias:8}},br:{divinearcher:{dmg:.25,st:{critd:20},d:'치명타 피해 +20%'},shadowhunter:{dmg:.25,st:{ms:8},d:'이동 속도 +8%'}}}};
const E22_SET_N=6;
// 옛 세트 체계(SETS)에 이름만 둔다: 열거되지 않게(일반 세트 드랍 · 도감 · gearStats의 for…in이 건너뛴다). 효과는 아래 V20.gsAdd/dmgAdd/healK
for(const sid in E22_SETS){const S0=E22_SETS[sid],p={};for(const k in S0.p){const v=S0.p[k];p[k]=typeof v==='string'?v:Object.values(v)[0]}
  Object.defineProperty(SETS,sid,{value:{n:S0.n,cls:S0.cls,key:S0.key,p,b:Object.assign({},S0.b,{6:{}}),e22:1},enumerable:false,configurable:true,writable:true})}
const e22IsSet=sid=>typeof sid==='string'&&!!E22_SETS[sid];
const e22SetOf=cls=>'e22_'+cls;
const e22Pieces=cls=>Object.keys(E22_SETS[e22SetOf(cls)].p).filter(k=>k!=='off'||PHYS_CLS[cls]);
const E22_PN={staff:'무기',off:'보조',robe:'갑옷',hat:'모자',ring:'반지',ring2:'반지',amulet:'목걸이'},e22PieceN=(cls,k)=>PHYS_CLS[cls]?(k==='off'?(cls==='warrior'?'방패':'화살통'):E22_PN[k]):(k==='staff'?'지팡이':k==='robe'?'로브':E22_PN[k]);
const e22Branch=()=>P&&(P.job3||(typeof j3Branch==='function'?j3Branch():null))||null;
// 같은 조각 두 개(반지 둘)는 한 조각 — 조각 이름(esp)으로 센다. 최대 6
{const _sc=setCount;setCount=function(sid){if(!e22IsSet(sid))return _sc.apply(this,arguments);const s=new Set(),g=P&&P.gear||{};
  for(const k in g){const it=g[k];if(it&&it.set===sid&&(!it.cls||it.cls===P.cls))s.add(it.esp||it.name)}return Math.min(E22_SET_N,s.size)}}
/* ===== 상태 · 저장 ===== */
function e22Clean(raw){const o=raw&&typeof raw==='object'&&!Array.isArray(raw)?Object.assign({},raw):{};
  const rs={};if(o.rs&&typeof o.rs==='object'&&!Array.isArray(o.rs))for(const id in o.rs){const n=Math.floor(+o.rs[id]);if(e22Rp(id)&&n>0)rs[id]=Math.min(9999,n)}
  o.rs=rs;o.rw=Array.isArray(o.rw)?[...new Set(o.rw.filter(x=>E22_RWBY[x]))]:[];if('nm' in o){const v=Math.floor(+o.nm);if(v>0)o.nm=Math.min(1e6,v);else delete o.nm}return o}
function e22St(){if(!P.e22||typeof P.e22!=='object'||Array.isArray(P.e22))P.e22=e22Clean(null);if(!P.e22.rs)P.e22.rs={};if(!Array.isArray(P.e22.rw))P.e22.rw=[];return P.e22}
const e22Empty=s=>!s||(!Object.keys(s.rs||{}).length&&!(s.rw||[]).length&&Object.keys(s).every(k=>k==='rs'||k==='rw'));
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P&&P.e22){const s=e22Clean(P.e22);if(!e22Empty(s)||E22.raw)d.e22=s}}catch(err){if(window.__QA)throw err}return d}}
{const _ld=load;load=function(d){const ok=_ld.apply(this,arguments);if(ok&&P){E22.raw=!!(d&&d.e22);P.e22=e22Clean(d&&d.e22);E22.cache=null;E22.ver++}return ok}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);if(P){P.e22=e22Clean(null);E22.raw=false;E22.cache=null;E22.ver++}return r}}
// 룬석 주머니
function e22RuneHave(id){const s=P&&P.e22;return s&&s.rs?s.rs[id]|0:0}
function e22RuneAdd(id,n){if(!e22Rp(id))return 0;const s=e22St();const v=Math.max(0,(s.rs[id]|0)+Math.round(n));if(v>0)s.rs[id]=Math.min(9999,v);else delete s.rs[id];return v}
function e22RuneGain(id,n,x,y){if(!P||GHOST||!e22Rp(id))return 0;n=Math.round(+n||1);if(n<=0)return e22RuneHave(id);const v=e22RuneAdd(id,n),p=e22Rp(id),R0=E22_RUNES[p.r];if(E22.quiet)return v;
  ftext(x==null?P.x:x,y==null?P.y:y,`+${n} 룬석 「${R0.n}」${p.g>1?' '+E22_GN[p.g]:''}`,R0.c,p.g>1,60);msg(`룬석을 얻었습니다: ${e22RName(id)}${n>1?' ×'+n:''} (대장장이에서 장비 홈에 박기)`,R0.c);return v}
const e22RuneTotal=()=>{const s=P&&P.e22;let n=0;if(s&&s.rs)for(const k in s.rs)n+=s.rs[k]|0;return n};
// 룬 문장 알기
function e22RwLearn(id,quiet){const w=E22_RWBY[id];if(!w)return false;const s=e22St();if(s.rw.includes(id))return false;s.rw.push(id);
  if(!quiet&&!E22.quiet){msg(`룬 문장을 알게 되었습니다: 「${w.n}」 (${E22_RUNES[w.a].n} → ${E22_RUNES[w.b].n}) · 도감에 적혔습니다`,'#d6a8ff');banner={t:`룬 문장 「${w.n}」`,sub:`${E22_RUNES[w.a].k}의 룬 「${E22_RUNES[w.a].n}」 → ${E22_RUNES[w.b].k}의 룬 「${E22_RUNES[w.b].n}」`,col:'#d6a8ff',life:2.4,max:2.4}}return true}
const e22RwKnown=id=>!!(P&&P.e22&&Array.isArray(P.e22.rw)&&P.e22.rw.includes(id));
/* ===== 착용 상태 (캐시: 장비가 바뀌거나 룬을 박을 때만 다시 셈) ===== */
function e22Worn(){const g=P&&P.gear;if(!g)return{rw:{},set:{}};const c=E22.cache;
  if(c&&c.P===P&&c.g===g&&c.ver===E22.ver&&c.cls===P.cls){let i=0,same=true;for(const s in g){if(c.its[i++]!==g[s]){same=false;break}}if(same&&i===c.its.length)return c}
  const v={P,g,ver:E22.ver,cls:P.cls,its:[],rw:{},set:{}};
  for(const s in g){const it=g[s];v.its.push(it);if(!it)continue;const w=e22ItemRw(it);if(w)v.rw[w.id]=w}
  for(const sid in E22_SETS)if(E22_SETS[sid].cls===P.cls){const n=setCount(sid);if(n)v.set[sid]=n}
  E22.cache=v;for(const id in v.rw)if(!e22RwKnown(id))e22RwLearn(id);return v}
const e22Rw=id=>!!e22Worn().rw[id];
const e22Bump=()=>{E22.ver++;E22.cache=null;if(typeof v20GsBump==='function')v20GsBump()};
/* ===== 능력치: 룬석 · 세트 · 룬 문장 (덧셈) ===== */
V20.gsAdd.push(x=>{if(!P||!P.gear)return;const add=(k,n)=>{if(n)x[k]=(x[k]||0)+n};
  for(const sl in P.gear){const it=P.gear[sl];if(!it||!Array.isArray(it.so))continue;for(const id of it.so){const s=e22RStat(id,P.cls);if(s)add(s.k,s.v)}}
  const W=e22Worn();if(W.rw.as_pir)add('critd',20);
  for(const sid in W.set){const S0=E22_SETS[sid],n=W.set[sid];for(const c in S0.b)if(n>=+c)for(const k in S0.b[c])add(k==='main'?e22Main(P.cls):k,S0.b[c][k]);
    if(n>=6){const B=S0.br[e22Branch()];if(B&&B.st)for(const k in B.st)add(k,B.st[k])}}});
// 6벌: 내 3차 갈래(그 2차 갈래 포함) 기술 피해 % — 피해 증가 칸에 더함
function e22BrDmg(id){const W=e22Worn();for(const sid in W.set){if(W.set[sid]<6)continue;const B=E22_SETS[sid].br[e22Branch()];if(!B||!B.dmg)continue;const s=SPELLS[id];if(!s)return 0;
    if((s.job3&&s.job3===P.job3)||(s.job2&&s.job2===P.job2))return B.dmg}return 0}
V20.dmgAdd.push((e,s)=>s&&s.id&&!s.proc?e22BrDmg(s.id):0);
V20.healK.push(()=>{const W=e22Worn();for(const sid in W.set)if(W.set[sid]>=6){const B=E22_SETS[sid].br[e22Branch()];if(B&&B.heal)return B.heal}return 0});
// 비교 점수에 박힌 룬석도
{const _is=itemScore;itemScore=function(it){if(!it||!Array.isArray(it.so)||!it.so.some(Boolean))return _is.apply(this,arguments);const st=Object.assign({},it.stats);
  for(const id of it.so){const s=e22RStat(id,P.cls);if(s)st[s.k]=(st[s.k]||0)+s.v}return _is.call(this,Object.assign({},it,{stats:st}))}}
/* ===== 룬 문장 효과 (내 마법이 맞힐 때 · 쓰러뜨릴 때 · 맞을 때 · 1/4초마다) ===== */
{const _he=hurtE;hurtE=function(e,amt,s){const alive=e&&!e.dead;const r=_he.apply(this,arguments);
  if(alive&&s&&!s.proc&&!s.ghost&&!GHOST&&P&&s.cls===P.cls&&!P.dead){try{e22OnHit(e,amt,s)}catch(err){if(window.__QA)throw err}}return r}}
function e22Cd(k,sec){const t=E22.rwT[k];if(t!=null&&time-t<sec&&time>=t)return false;E22.rwT[k]=time;return true}
function e22OnHit(e,amt,s){const W=e22Worn().rw;if(!W.ig_vel&&!W.nae_dor&&!W.lum_heim&&!W.mar_vel)return;const el=s.el;
  if(W.ig_vel&&el==='fire'&&e22Cd('ig_vel',.6)){const d=Math.max(1,Math.round(amt*.25));rings.push({x:e.x,y:e.y,r:8,max:90,life:.45,col:'#ffe066'});burst(e.x,e.y,'#ffe066',10,120,2.5,20);
    for(const o of enemies.slice())if(!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<=90+(o.r||0))hurtE(o,d,{el:'storm',cls:P.cls,proc:1,e22:1})}
  if(W.nae_dor&&el==='ice'&&!e.dead){const T=TYPES[e.k]||{};e.slowT=Math.max(e.slowT||0,T.boss||T.mini?.6:2)}
  if(W.lum_heim&&(el==='holy'||el==='light')&&e22Cd('lum_heim',.5))healP(maxHp()*.006);
  if(W.mar_vel&&el==='storm'&&e22Cd('mar_vel',.3)){P.mp=Math.min(maxMp(),P.mp+maxMp()*.005)}}
{const _hp=hitPlayer;hitPlayer=function(d,src){const r=_hp.apply(this,arguments);
  try{if(P&&!P.dead&&!GHOST&&e22Worn().rw.dor_heim&&P.hp<maxHp()*.5&&e22Cd('dor_heim',40)){P.buffs._e22rock={t:5,max:5,dr:.15,n:'바위 심장'};rings.push({x:P.x,y:P.y,r:10,max:90,life:.6,col:'#c9a46a'});burst(P.x,P.y,'#c9a46a',20,90,3,20);ftext(P.x,P.y,'바위 심장','#c9a46a',true,70)}}catch(err){if(window.__QA)throw err}
  return r}}
function e22SlowTick(){if(!P||P.dead||GHOST)return;
  if(P.mp<maxMp()*.25&&e22Worn().rw.kro_sera&&e22Cd('kro_sera',45)){P.mp=Math.min(maxMp(),P.mp+maxMp()*.2);rings.push({x:P.x,y:P.y,r:10,max:80,life:.6,col:'#6ad8d0'});ftext(P.x,P.y,'멈춘 샘','#6ad8d0',true,70)}
  const b=e22Branch();if(b!==E22.j3){E22.j3=b;e22Bump()}}
V20.slowTick.push(e22SlowTick);
/* ===== 장비 만들기: 홈 · 각성 · 세트 조각 ===== */
const e22DarkT=()=>{try{return typeof darkTier==='function'?darkTier()|0:0}catch(_){return 0}};
const e22DarkHere=()=>{try{return typeof darkHere==='function'&&!!darkHere()}catch(_){return false}};
function e22SockN(t){const r=R(),p2=E22_SOCK.p2+E22_SOCK.p2t*clamp(t|0,0,10);return r<p2?2:r<p2+E22_SOCK.p1?1:0}
function e22SockRoll(it,t){if(!it||it.so||!E22_SOCK_SLOTS.includes(it.slot))return it;const n=e22SockN(t);if(n>0)it.so=Array(n).fill(null);return it}
const e22SockOk=it=>!!it&&!E22.shop&&((it.il|0)>=E22_SOCK.il||e22DarkHere());
// 유니크의 정의 찾기 (각성판을 만들 때 그 아이템의 최고값을 알기 위해)
// 숨은 보스 「이름을 되찾은 자」만 떨어뜨리는 목걸이 (상급 유니크 중에서도 가장 드묾 · 설계 B4). 첫 처치에 반드시, 그 뒤 8%
const E22_NAMEU={n:'재로 쓴 이름',slot:'amulet',st:{regen:1.8,all:1,crit:8,critd:25,dr:8,cdr:10},lore:'잃었던 이름을 재 위에 다시 적었다. 다시는 지워지지 않게.'};
const E22_NAMEP={first:1,after:.08};
function e22MakeName(cls,il,t){cls=cls||P.cls;il=clamp(Math.round(il||MAXLV)+3,1,MAXLV+3);const fs=PHYS_CLS[cls]&&typeof fixedStatsV18==='function'?fixedStatsV18(E22_NAMEU.st,il):fixedStats(E22_NAMEU.st,il);
  const it={id:uid++,slot:'amulet',rar:5,name:E22_NAMEU.n,il,stats:fs,cls,lore:E22_NAMEU.lore,nameu:1};if(t>=6&&R()<e22AwkP(t))e22Awaken(it);return it}
function e22Def(it){if(!it)return null;if(it.name===E22_NAMEU.n)return{st:E22_NAMEU.st};if(it.core&&typeof CORE21_BY==='object'&&CORE21_BY[it.core]){const c=CORE21_BY[it.core];return{st:c.st,wt:c.wt}}
  const u=UNIQ.concat(BOSSU).find(x=>x.n===it.name);return u?{st:u.st,wt:u.wt}:null}
const E22_AWX=[['crit',5],['cdr',6],['dr',5],['ls',2],['ms',6],['mk',8]];
// 각성: 모든 수치를 그 아이템의 최고값으로(같은 굴림을 여러 번 해서 칸마다 가장 큰 값) + 능력 한 줄
function e22Awaken(it){if(!it||it.awk||!(it.rar>=4))return it;const D=e22Def(it);if(!D)return it;
  const fn=(it.core||PHYS_CLS[it.cls])&&typeof fixedStatsV18==='function'?(st,il)=>fixedStatsV18(st,il,D.wt):(st,il)=>fixedStats(st,il);const best={};
  for(let i=0;i<48;i++){const o=fn(D.st,it.il);for(const k in o)if(!(k in best)||+o[k]>+best[k])best[k]=o[k]}
  for(const k in best)if(k in it.stats)it.stats[k]=Math.max(+it.stats[k]||0,+best[k]||0);
  const pool=E22_AWX.filter(([k])=>!(k in it.stats)),[k,v]=pool.length?pick(pool):['crit',5];it.stats[k]=Math.round(((+it.stats[k]||0)+v)*10)/10;it.awk=1;it.awx=k;return it}
const e22AwkP=t=>t>=6?.06+.01*(clamp(t,6,10)-6):0;
function e22After(it){if(!it||E22.shop)return it;const sk=!it.so&&E22_SOCK_SLOTS.includes(it.slot);if(!sk&&!(it.rar>=4))return it;const t=e22DarkT();
  if(!E22.shop&&!E22.noAwk&&it.rar>=4&&!it.awk&&t>=6&&R()<e22AwkP(t))e22Awaken(it);
  if(sk&&e22SockOk(it))e22SockRoll(it,t);return it}
{const _mi=makeItem;makeItem=function(){const it=_mi.apply(this,arguments);try{e22After(it)}catch(err){if(window.__QA)throw err}return it}}
if(typeof makeCore21==='function'){const _mc=makeCore21;makeCore21=function(){const it=_mc.apply(this,arguments);try{e22After(it)}catch(err){if(window.__QA)throw err}return it}}
// 상점 물건에는 홈 · 각성이 없다
{const _ss=shopStock;shopStock=function(){E22.shop++;try{return _ss.apply(this,arguments)}finally{E22.shop--}}}
// 세트 조각: 부위 주 능력치 ×1.25 + 무작위 옵션 3개 (+스킬·+모든 스킬 없음)
function e22MakeSet(cls,il,piece){cls=cls||P.cls;const sid=e22SetOf(cls),S0=E22_SETS[sid];if(!S0)return null;il=clamp(Math.round(il||MAXLV),100,MAXLV);
  const pcs=e22Pieces(cls);piece=pcs.includes(piece)?piece:pick(pcs);const slot=piece==='ring2'?'ring':piece,phys=!!PHYS_CLS[cls];
  let wt=phys&&typeof wtFor==='function'?wtFor(slot,cls):undefined;const nm0=S0.p[piece];const name=typeof nm0==='string'?nm0:nm0[wt]||Object.values(nm0)[0];
  const stats={},mains=wt&&typeof MAIN_V18==='object'&&MAIN_V18[wt]?MAIN_V18[wt]:[SLOT[slot].main];
  for(const mk of mains){const v=(phys?rollStat(mk,il,wt):rollStat(mk,il))*1.25;stats[mk]=mk==='regen'?Math.round(v*10)/10:Math.round(v)}
  const pool=(phys?affixPoolV18:affixPool)(il,cls).filter(k=>!(k in stats)&&!k.startsWith('sk_')&&!k.startsWith('tr_')&&k!=='all');
  for(let i=0;i<3&&pool.length;i++){const k=pick(pool);stats[k]=Math.round(((stats[k]||0)+(phys?rollStat(k,il,wt):rollStat(k,il)))*10)/10}
  if(stats.cdr)stats.cdr=Math.min(25,stats.cdr);if(stats.mcost)stats.mcost=Math.min(25,stats.mcost);if(stats.ias)stats.ias=Math.min(20,stats.ias);
  const it={id:uid++,slot,rar:3,name,il,stats,cls,set:sid,esp:piece};if(wt)it.wt=wt;
  if(!E22.shop)e22SockRoll(it,e22DarkT());return it}
// 바로 떨어지는 각성 유니크 (B4 · 미궁 심층): 유니크 60% · 상급 유니크 40%
function e22MakeAwk(cls,il){const o=E22.noAwk;E22.noAwk=1;let it;try{it=makeItem(il||MAXLV,true,cls||P.cls,R()<.4?'boss':'uniq')}finally{E22.noAwk=o}return e22Awaken(it)}
/* ===== 드랍 ===== */
// 확률표 (덧셈 · 파티 2인 +10% / 3인 +20%를 곱이 아니라 배율 하나로: 1+py)
const E22_DROP={
  rune:{normal:t=>.004+.001*(t-3),elite:t=>.06+.01*(t-3),mini:t=>.25+.03*(t-3),boss:t=>1},// 3단계부터 (보스는 1개 + 둘째 30%+5%/단계)
  set:{normal:t=>.00003,elite:t=>.003+.0005*(t-4),mini:t=>.015+.002*(t-4),boss:t=>.05+.01*(t-4)},// 4단계부터
  note:{boss:t=>.04}};
function e22RuneGrade(t){const r=R(),g3=t>=8?.01*(t-7):0,g2=.06+.015*Math.max(0,t-3);return r<g3?3:r<g3+g2?2:1}
function e22RuneRoll(t){return e22RId(pick(E22_RIDS),e22RuneGrade(t))}
function e22PartyK(){const pn=typeof PTY==='object'&&PTY.partyN?PTY.partyN():1;return 1+(pn>=3?.2:pn===2?.1:0)}
function e22Note(x,y){const s=e22St(),left=E22_RW.filter(w=>!s.rw.includes(w.id));if(!left.length){if(typeof ashGain==='function')ashGain(3,x,y);return null}const w=pick(left);e22RwLearn(w.id);return w.id}
function e22Loot(it,x,y,keep){loot.push({x:x+rnd(-30,30),y:y+rnd(-30,30),kind:'item',item:it,t:0,keep:keep?1:0})}
function end22Drop(where,tier,x,y,o){const out=[];if(!P||GHOST)return out;if(typeof o==='string')o={kind:o};o=o||{};const t=clamp(Math.floor(+tier)||0,0,10);x=x==null?P.x:x;y=y==null?P.y:y;
  const pk=e22PartyK(),ck=o.chest?2:1,cls=P.cls,il=MAXLV;
  const rune=n=>{for(let i=0;i<n;i++){const id=e22RuneRoll(t);e22RuneGain(id,1,x+rnd(-20,20),y-i*14);out.push({k:'rune',id})}};
  const set=()=>{const it=e22MakeSet(cls,il);if(!it)return;e22Loot(it,x,y);out.push({k:'set',it});if(!E22.quiet){msg(`직업 엔드 세트 조각이 떨어졌습니다: ${it.name}`,RAR[3].c);
    banner={t:it.name,sub:`${E22_SETS[it.set].n} 세트 조각`,col:RAR[3].c,life:2.6,max:2.6}}};
  const awk=()=>{const it=e22MakeAwk(cls,il);if(!it)return;e22Loot(it,x,y);out.push({k:'awk',it});if(!E22.quiet)e22AwkMsg(it)};
  const note=()=>{const id=e22Note(x,y);if(id)out.push({k:'note',id})};
  if(where==='dark'){const kind=E22_DROP.rune[o.kind]?o.kind:'normal';
    if(t>=3){if(kind==='boss')rune(1+(R()<(.3+.05*(t-3))*pk?1:0));else if(R()<E22_DROP.rune[kind](t)*pk)rune(1);
      if(kind==='boss'&&R()<E22_DROP.note.boss(t)*pk)note()}
    if(t>=4&&R()<E22_DROP.set[kind](t)*pk*ck)set()}
  else if(where==='b4'){rune(2+(t>=5?1:0));if(R()<(.12+.01*t)*pk*ck)set();if(R()<(.03+.003*t)*pk*ck)awk();if(R()<.2)note()}
  else if(where==='b4hidden'){const s=e22St(),first=!(s.nm>0);if(first||R()<E22_NAMEP.after*pk*ck){const it=e22MakeName(cls,il,t);s.nm=(s.nm|0)+1;e22Loot(it,x,y,first);out.push({k:'name',it});
      if(!E22.quiet){msg(`「${it.name}」 목걸이가 떨어졌습니다${first?' (첫 처치)':''}`,RAR[5].c);banner={t:it.name,sub:'숨은 보스의 목걸이 · 상급 유니크',col:RAR[5].c,life:3,max:3}}}
    rune(4);if(R()<.35*pk*ck)set();if(R()<.12*pk*ck)awk();note()}
  else if(where==='deep'){if(t>=3)rune(1+(R()<.5?1:0));if(t>=4&&R()<.06*pk*ck)set();if(t>=6&&R()<.015*pk*ck)awk();if(R()<.1)note()}
  return out}
function e22AwkMsg(it){msg(`각성 유니크가 떨어졌습니다: ${it.name} (모든 수치 최고값 + ${statName(it.awx)})`,'#f0d890');banner={t:it.name,sub:'각성 유니크 · 잿빛 금색',col:'#f0d890',life:3,max:3};
  if(typeof flash!=='undefined')flash={col:'#f0d890',a:.18}}
// 어둠 단계 지역에서 쓰러뜨린 몬스터 → 'dark' (각자 화면에서 · rewardKill)
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);
  try{if(e&&P&&!GHOST&&!P.dead&&e22Worn().rw.sol_as){const had=P.buffs._e22hunt&&P.buffs._e22hunt.t>0;P.buffs._e22hunt={t:4,max:4,spd:.1,n:'사냥꾼의 숨'};if(!had){burst(P.x,P.y,'#ffb04a',12,90,2.5,10);ftext(P.x,P.y,'사냥꾼의 숨','#ffb04a',false,70)}}}catch(err){if(window.__QA)throw err}
  try{if(e&&P&&!GHOST){const t=e22DarkT();if(t>=3){const T=TYPES[e.k]||{};const kind=T.boss?'boss':T.mini?'mini':e.elite||e.bty?'elite':'normal';end22Drop('dark',t,e.x,e.y,{kind})}}}catch(err){if(window.__QA)throw err}
  return r}}
// 땅에 떨어진 각성 유니크를 주우면 알림 (각성은 몬스터 굴림 안에서 생기므로 주울 때 한 번 더 알린다)
/* ===== 대장장이: 룬 홈 (박기 · 빼기 · 바꾸기 · 합치기) ===== */
function e22Find(id){id=+id;for(const sl in P.gear){const it=P.gear[sl];if(it&&it.id===id)return it}return P.bag.find(x=>x.id===id)||null}
const e22Equipped=it=>!!it&&Object.values(P.gear).includes(it);
function e22Insert(it,i,rid){if(!it||!Array.isArray(it.so)||!(i>=0&&i<it.so.length)||!e22Rp(rid)||e22RuneHave(rid)<1)return false;const old=it.so[i];
  e22RuneAdd(rid,-1);it.so[i]=rid;e22Bump();const R0=E22_RUNES[e22Rp(rid).r];if(!E22.quiet){burst(P.x,P.y,R0.c,24,120,3,24);msg(`${it.name}에 ${e22RName(rid)}을(를) 박았습니다${old?` (원래 ${e22RName(old)}은(는) 사라짐)`:''}`,R0.c)}
  const w=e22ItemRw(it);if(w&&e22Equipped(it))e22Worn();else if(w&&!E22.quiet)msg(`이 장비를 끼면 룬 문장 「${w.n}」이 켜집니다`,'#d6a8ff');return true}
function e22Remove(it,i){if(!it||!Array.isArray(it.so)||!it.so[i])return false;const old=it.so[i];it.so[i]=null;e22Bump();if(!E22.quiet)msg(`${e22RName(old)}을(를) 뺐습니다 · 룬석은 사라지고 장비는 그대로입니다`,'#c8bfae');return true}
function e22Merge(rid){const p=e22Rp(rid);if(!p||p.g>=3||e22RuneHave(rid)<3)return false;const cost=E22_MERGE[p.g];if(cost&&!(typeof ashSpend==='function'&&ashSpend(cost)))return false;
  e22RuneAdd(rid,-3);const to=e22RId(p.r,p.g+1);e22RuneAdd(to,1);if(!E22.quiet)msg(`룬석 셋을 합쳤습니다: ${e22RName(to)}`,E22_RUNES[p.r].c);return to}
function e22List(){const out=[];for(const sl in P.gear){const it=P.gear[sl];if(it&&Array.isArray(it.so)&&it.so.length)out.push({it,on:1})}for(const it of P.bag)if(Array.isArray(it.so)&&it.so.length)out.push({it,on:0});return out}
function e22ShopOn(){if(!P||!actTown)return false;const types=(actTown.shops||[]).map(s=>s.type);
  const here=actShop==='weapon'||actShop==='armor'||(actShop==='general'&&!types.includes('weapon')&&!types.includes('armor'));if(!here)return false;
  return P.lvl>=MAXLV||e22RuneTotal()>0||e22List().length>0}
function e22Dots(it,big){const so=it&&it.so;if(!Array.isArray(so)||!so.length)return '';return so.map(id=>{const p=e22Rp(id);return p?`<b style="background:${E22_RUNES[p.r].c}"${big?'':''}></b>`:'<b class="e"></b>'}).join('')}
function e22ShopHtml(){const L=e22List();let sel=E22.sel!=null?e22Find(E22.sel):null;if(!sel||!Array.isArray(sel.so)){sel=L.length?L[0].it:null;E22.sel=sel?sel.id:null;E22.sock=0}
  let h=`<details class="v20box e22box" open><summary><b style="color:#d6a8ff">룬 홈 · 룬석</b> <span class="muted">룬석 ${e22RuneTotal()}개 · 재의 결정 ${(P.ash|0).toLocaleString()}</span></summary>`;
  h+=`<p class="muted" style="font-size:12px;margin:4px 0">140 장비(무기·보조·갑옷·모자)에 홈이 0~2개 붙습니다. 룬석을 박으면 능력이 하나 더해집니다(덧셈). 빼거나 다른 룬석으로 바꾸면 원래 룬석은 사라지고 장비는 그대로입니다. 홈 2개에 정해진 두 룬을 순서대로 박으면 「룬 문장」 효과가 켜집니다.</p>`;
  if(!L.length)h+='<p class="muted" style="margin:4px 0">홈이 있는 장비가 없습니다. 어둠 단계 지역의 140 장비에서 나옵니다.</p>';
  else{h+='<div class="e22list">'+L.map(({it,on})=>`<button type="button" class="e22pick" data-e22s="${it.id}" aria-pressed="${sel===it}" data-tip="${typeof tipReg==='function'?tipReg(it):''}" aria-label="${v20Esc(itemName(it))}${on?' (착용 중)':''}">${itemIcon(it,{sz:36})}${on?'<i>착용</i>':''}</button>`).join('')+'</div>';
    if(sel){const si=clamp(E22.sock|0,0,sel.so.length-1);E22.sock=si;const w=e22ItemRw(sel);
      h+=`<div class="e22sel"><div class="nm" style="color:${sel.awk?'#f0d890':RAR[sel.rar].c}">${v20Esc(itemName(sel))} <span class="muted">${RAR[sel.rar].n} ${SLOT[sel.slot]?SLOT[sel.slot].n:''} · Lv${sel.il}</span></div><div class="e22socks">`;
      sel.so.forEach((id,i)=>{const p=e22Rp(id);h+=`<div class="e22sock${i===si?' on':''}"><button type="button" class="e22sb" data-e22k="${i}" aria-pressed="${i===si}">홈 ${i+1}</button><span>${p?`<b style="color:${E22_RUNES[p.r].c}">${e22RName(id)}</b> <span class="muted">${e22RLine(id)}</span>`:'<span class="muted">비어 있음</span>'}</span>${p?`<button type="button" class="ghost" data-e22rm="${i}">빼기</button>`:''}</div>`});
      h+='</div>';if(w)h+=`<div style="color:#d6a8ff">룬 문장 「${w.n}」: ${w.d}</div>`;
      const cur=sel.so[si],rows=Object.keys(e22St().rs).sort((a,b)=>E22_RIDS.indexOf(e22Rp(a).r)-E22_RIDS.indexOf(e22Rp(b).r)||e22Rp(a).g-e22Rp(b).g);
      h+=`<div class="muted" style="margin-top:6px;font-size:12px">홈 ${si+1}에 박을 룬석${cur?' (바꾸면 지금 룬석은 사라짐)':''}</div>`;
      h+=rows.length?'<div class="e22rows">'+rows.map(id=>`<div class="e22row"><span><b style="color:${E22_RUNES[e22Rp(id).r].c}">${e22RName(id)}</b> ×${e22RuneHave(id)} <span class="muted">${e22RLine(id)}</span></span><button type="button" data-e22in="${id}">${cur?'바꾸기':'박기'}</button></div>`).join('')+'</div>':'<p class="muted" style="margin:4px 0">룬석 주머니가 비어 있습니다. 어둠 3단계 이상에서 나옵니다.</p>';
      h+='</div>'}}
  const mg=Object.keys(e22St().rs).filter(id=>e22Rp(id).g<3&&e22RuneHave(id)>=3);
  if(mg.length)h+=`<div class="e22mg"><div class="muted" style="font-size:12px">같은 룬석 3개 → 한 등급 위 (재의 결정 1→2등급 ${E22_MERGE[1]} · 2→3등급 ${E22_MERGE[2]})</div>`+mg.map(id=>{const p=e22Rp(id),c=E22_MERGE[p.g],ok=(P.ash|0)>=c;
    return `<div class="e22row"><span>${e22RName(id)} ×${e22RuneHave(id)} → <b style="color:${E22_RUNES[p.r].c}">${E22_GN[p.g+1]}</b></span><button type="button" data-e22mg="${id}"${ok?'':' disabled'}>합치기 (재의 결정 ${c})</button></div>`}).join('')+'</div>';
  return h+'</details>'}
v20Css('.e22list{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0}.e22pick{position:relative;padding:2px;line-height:0;background:#100d0a;border:1px solid #3a3226;border-radius:5px}.e22pick[aria-pressed="true"]{border-color:#d6a8ff;box-shadow:0 0 0 1px #d6a8ff}'+
  '.e22pick i{position:absolute;left:2px;bottom:2px;font-size:9px;line-height:1;font-style:normal;background:#000a;color:#ffe39a;padding:1px 2px;border-radius:2px;z-index:2}.e22sel{border-top:1px solid #2e2820;padding-top:6px;line-height:1.55}'+
  '.e22sock,.e22row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:3px 0;border-bottom:1px solid #221d16}.e22sock>span,.e22row>span{flex:1 1 150px;min-width:0;overflow-wrap:anywhere}.e22sock.on{background:#1e1912}.e22sb[aria-pressed="true"]{border-color:#d6a8ff;color:#e8d8ff}'+
  '.e22box button:disabled{opacity:.4;cursor:default}.e22mg{margin-top:6px}'+
  '.iic{position:relative}.e22so{position:absolute;right:2px;bottom:2px;display:flex;gap:2px;pointer-events:none;z-index:1}.e22so b{display:block;width:7px;height:7px;border-radius:50%;border:1px solid #e8dcc0;box-shadow:0 0 2px #000}.e22so b.e{background:#0a0806}'+
  '.iic.e22awk{box-shadow:inset 0 0 0 1px rgba(0,0,0,.7),0 0 7px #f0d890;border-color:#f0d890!important}.e22awkn{color:#f0d890!important;text-shadow:0 0 6px rgba(255,207,106,.55)}');
{const _sh=shopHtml;shopHtml=function(){const h=_sh.apply(this,arguments);if(!e22ShopOn())return h;const box=e22ShopHtml(),i=h.indexOf('</details>',h.indexOf('rf21'));
  if(h.includes('class="v20box rf21"')&&i>=0)return h.slice(0,i+10)+box+h.slice(i+10);const j=h.indexOf('</p>');return j>=0?h.slice(0,j+4)+box+h.slice(j+4):box+h}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-e22s],[data-e22k],[data-e22in],[data-e22rm],[data-e22mg]');if(!b||b.disabled||!P)return;const d=b.dataset;
  if(d.e22s!=null){if(E22.sel!==+d.e22s){E22.sel=+d.e22s;E22.sock=0}renderPanel();return}
  if(d.e22k!=null){E22.sock=+d.e22k;renderPanel();return}
  const it=E22.sel!=null?e22Find(E22.sel):null;
  if(d.e22in!=null){if(it&&e22Insert(it,E22.sock|0,d.e22in))save();renderPanel();return}
  if(d.e22rm!=null){if(it&&e22Remove(it,+d.e22rm))save();renderPanel();return}
  if(d.e22mg!=null){if(e22Merge(d.e22mg))save();renderPanel()}});
/* ===== 보이기: 아이콘(홈 점 · 각성 빛) · 툴팁 · 목록 · 이름 색 ===== */
{const _ii=itemIcon;itemIcon=function(it,o){let h=_ii.apply(this,arguments);if(!it)return h;
  if(it.awk)h=h.replace('class="iic ','class="iic e22awk ');
  if(Array.isArray(it.so)&&it.so.length){const i=h.lastIndexOf('</span>');if(i>=0)h=h.slice(0,i)+`<i class="e22so" aria-hidden="true">${e22Dots(it)}</i>`+h.slice(i)}return h}}
function e22TipLine(it){if(!it)return '';let h='';
  if(it.awk)h+=`<div style="color:#f0d890;margin-top:3px">각성 · 모든 수치가 이 아이템의 최고값${it.awx?`, 더해진 능력: ${statOne(it.awx,it.stats[it.awx])}`:''}</div>`;
  if(Array.isArray(it.so)&&it.so.length){h+=`<div style="margin-top:3px;color:#d6a8ff">룬 홈 ${it.so.length}개</div>`;
    it.so.forEach((id,i)=>{const p=e22Rp(id);h+=p?`<div>◆ <b style="color:${E22_RUNES[p.r].c}">${e22RName(id)}</b>: ${e22RLine(id)}</div>`:`<div class="muted">◇ 빈 홈 ${i+1} (대장장이에서 룬석 박기)</div>`});
    const w=e22ItemRw(it);if(w)h+=`<div style="color:#d6a8ff">룬 문장 「${w.n}」: ${w.d}</div>`}
  if(it.core&&typeof CORE21_BY==='object'&&CORE21_BY[it.core]&&CORE21_BY[it.core].cls&&E22_SETS[e22SetOf(CORE21_BY[it.core].cls)])h+=`<div class="muted" style="font-size:11.5px">세트냐 핵심이냐: 이 칸은 직업 엔드 세트 「${E22_SETS[e22SetOf(CORE21_BY[it.core].cls)].n}」 조각과 같은 칸입니다</div>`;
  return h}
ITEMTIP_LINES.push(e22TipLine);
// 툴팁 · 목록의 이름 색: 각성은 잿빛 금색
{const _it=itemTip;itemTip=function(it){let h=_it.apply(this,arguments);if(it&&it.awk)h=h.replace('class="tt-n"','class="tt-n e22awkn"');return h}}
{const _ir=itemRow;itemRow=function(it,btns){let h=_ir.apply(this,arguments);if(!it)return h;if(it.awk)h=h.replace('<div class="nm"','<div class="nm e22awkn"');
  if(Array.isArray(it.so)&&it.so.length){const ln=`<div class="st" style="color:#d6a8ff">룬 홈: ${it.so.map(id=>{const p=e22Rp(id);return p?`<span style="color:${E22_RUNES[p.r].c}">${E22_RUNES[p.r].n}</span>`:'<span class="muted">빈 홈</span>'}).join(' → ')}${e22ItemRw(it)?` · 「${e22ItemRw(it).n}」`:''}</div>`;
    const i=h.indexOf('<div class="cmp"');if(i>=0)h=h.slice(0,i)+ln+h.slice(i)}return h}}
// 세트 줄: 엔드 세트는 n/6 · 2/4/6벌 · 6벌 갈래 효과 · 세트냐 핵심이냐
function e22SetLine(it){const S0=E22_SETS[it.set];if(!S0)return '';const n=P&&P.cls===S0.cls?setCount(it.set):0,b=e22Branch(),J=typeof JOB3==='object'&&JOB3[S0.cls]||{};
  let h=`<div style="color:${RAR[3].c};margin-top:3px">${S0.n} 직업 엔드 세트 (${n}/${E22_SET_N} 착용)`;
  for(const c in S0.b)h+=`<div style="opacity:${n>=+c?1:.45}">${c}벌: ${Object.entries(S0.b[c]).map(([k,v])=>statOne(k,v)).join(', ')}</div>`;
  for(const br in S0.br){const B=S0.br[br],on=n>=6&&b===br;h+=`<div style="opacity:${on?1:.45}">6벌 (${J[br]?J[br].n:br}): 그 갈래 기술 피해 +${Math.round(B.dmg*100)}%, ${B.d}</div>`}
  return h+`<div class="muted" style="font-size:11.5px">빌드 핵심과 같은 칸을 씁니다(세트냐 핵심이냐)</div></div>`}
{const _sl=setLine;setLine=function(it){if(it&&e22IsSet(it.set))return e22SetLine(it);return _sl.apply(this,arguments)}}
// 캐릭터 창 「세트 효과」: 엔드 세트 · 켜진 룬 문장
{const _sh=setsHtml;setsHtml=function(){let h=_sh.apply(this,arguments);if(!P)return h;const W=e22Worn();
  for(const sid in W.set){const S0=E22_SETS[sid],n=W.set[sid],B=S0.br[e22Branch()];
    h+=`<div class="item"><div><div class="nm" style="color:${RAR[3].c}">${S0.n} <span class="muted">${n}/${E22_SET_N} · 직업 엔드 세트</span></div>`+Object.entries(S0.b).map(([c,bb])=>`<div class="st" style="opacity:${n>=+c?1:.45}">${c}벌: ${Object.entries(bb).map(([k,v])=>statOne(k,v)).join(', ')}</div>`).join('')+
      `<div class="st" style="opacity:${n>=6&&B?1:.45}">6벌: ${B?`내 갈래 기술 피해 +${Math.round(B.dmg*100)}%, ${B.d}`:'3차 전직 뒤 갈래마다 다른 효과'}</div></div></div>`}
  for(const id in W.rw){const w=W.rw[id];h+=`<div class="item"><div><div class="nm" style="color:#d6a8ff">룬 문장 「${w.n}」 <span class="muted">${E22_RUNES[w.a].n} → ${E22_RUNES[w.b].n}</span></div><div class="st">${w.d}</div></div></div>`}
  return h}}
/* ===== 창고: 룬석 주머니 (모든 캐릭터가 함께) ===== */
function e22StashRs(){try{const s=localStorage.getItem(STASHKEY());const d=s?JSON.parse(s):null;return e22Clean({rs:d&&d.rs}).rs}catch(_){return{}}}
// 창고 기록에 rs를 같이 쓴다 (stash.js stashWrite와 같은 모양 + rs). E22.stRs가 있으면 그 값으로
{const _sw=stashWrite;stashWrite=function(items,gold){const rs=E22.stRs||e22StashRs();if(!Object.keys(rs).length&&!E22.stRs)return _sw.apply(this,arguments);
  if(gold==null)gold=stashGold();try{const o={v:1,items,gold:Math.max(0,Math.floor(gold))};if(Object.keys(rs).length)o.rs=rs;localStorage.setItem(STASHKEY(),JSON.stringify(o));if(ACC)cloudSaved('s');return true}catch(_){msg('창고에 저장하지 못했습니다','#ff9a6a');return false}}}
// dir>0: 주머니 → 창고 (받는 쪽 먼저 저장)
function e22StashMove(dir){const st=e22StashRs(),me=e22St().rs,from=dir>0?me:st,to=dir>0?st:me;let n=0;for(const id in from){const v=from[id]|0;if(v>0){to[id]=Math.min(9999,(to[id]|0)+v);n+=v}}if(!n)return 0;
  if(dir>0){E22.stRs=to;try{if(!stashWrite(stashRead()))return 0}finally{E22.stRs=null}P.e22.rs={};saveNow()}
  else{P.e22.rs=to;saveNow();E22.stRs={};try{stashWrite(stashRead())}finally{E22.stRs=null}}
  E22.cache=null;msg(dir>0?`룬석 ${n}개를 창고에 맡겼습니다`:`룬석 ${n}개를 찾았습니다`,'#d6a8ff');return n}
{const _sh=stashHtml;stashHtml=function(){const h=_sh.apply(this,arguments),st=e22StashRs(),a=e22RuneTotal();let b=0;for(const k in st)b+=st[k]|0;if(!a&&!b)return h;
  const box=`<h2>룬석 주머니 <span class="muted">가진 것 ${a} · 창고 ${b}</span></h2><div class="row" style="margin:0 0 10px;gap:6px;flex-wrap:wrap"><button type="button" data-e22st="1"${a?'':' disabled'}>모두 맡기기</button><button type="button" data-e22st="-1"${b?'':' disabled'}>모두 찾기</button></div>`;
  const i=h.indexOf('<h2>창고 <span');return i>=0?h.slice(0,i)+box+h.slice(i):h+box}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-e22st]');if(!b||b.disabled||!P)return;e22StashMove(+b.dataset.e22st);renderPanel()});
/* ===== 도감: 각성 유니크 · 직업 엔드 세트 · 룬석 · 룬 문장 ===== */
function e22Codex(){const pc=v=>`${Math.round(v*1000)/10}%`;let h=`<h2>각성 유니크 <span class="muted">어둠 6단계 이상 · 아주 드묾</span></h2>`;
  h+=`<div class="item cx"><div><div class="nm e22awkn">각성판</div><div class="st">어둠 6단계 이상에서 유니크·상급 유니크·빌드 핵심이 나올 때 ${pc(e22AwkP(6))}(10단계 ${pc(e22AwkP(10))}) 확률로 각성판이 됩니다. 모든 수치가 그 아이템의 최고값이고 능력 한 줄(치명타·재사용 대기·받는 피해·흡수·이동 속도·처치 마나 중 하나)이 더 붙습니다. 군주의 메아리 보스와 숨은 보스에서도 나옵니다.</div></div></div>`;
  h+=`<div class="item cx"><div><div class="nm" style="color:${RAR[5].c}">${E22_NAMEU.n} <span class="muted">상급 유니크 목걸이 · 모든 직업 · 숨은 보스 「이름을 되찾은 자」 첫 처치에 반드시, 그 뒤 ${Math.round(E22_NAMEP.after*100)}%</span></div><div class="st">${cxFixed(E22_NAMEU.st,null)}</div><div class="muted" style="font-style:italic">${E22_NAMEU.lore}</div></div></div>`;
  h+=`<h2>직업 엔드 세트 <span class="muted">4종 · 직업마다 하나 · 어둠 4단계 이상 · 군주의 메아리 보스</span></h2>`;
  for(const sid in E22_SETS){const S0=E22_SETS[sid],J=typeof JOB3==='object'&&JOB3[S0.cls]||{};
    h+=`<div class="item cx"><div><div class="nm" style="color:${RAR[3].c}">${S0.n} <span class="muted">${CLASSES[S0.cls].n} 전용 · 3차 갈래 둘 다</span></div>`;
    h+='<div class="st">'+e22Pieces(S0.cls).map(k=>{const v=S0.p[k];return `<span class="muted">${e22PieceN(S0.cls,k)}</span> ${typeof v==='string'?v:Object.values(v).join(' 또는 ')}`}).join(' · ')+'</div>';
    h+='<div class="st">'+Object.entries(S0.b).map(([c,b])=>`<div><b style="color:${RAR[3].c}">${c}벌</b>: ${Object.entries(b).map(([k,v])=>statOne(k,v)).join(', ')}</div>`).join('')+
      Object.entries(S0.br).map(([br,B])=>`<div><b style="color:${RAR[3].c}">6벌 · ${J[br]?J[br].n:br}</b>: 그 갈래 기술 피해 +${Math.round(B.dmg*100)}%, ${B.d}</div>`).join('')+'</div>';
    h+=`<div class="st muted">조각마다 부위 기본 옵션 보통의 1.25배 + 무작위 옵션 3개. 빌드 핵심과 같은 칸을 써서 「세트냐 핵심이냐」를 고릅니다(마법사·사제는 6칸이 모두 세트).</div></div></div>`}
  h+=`<h2>룬석 <span class="muted">12종 · 어둠 3단계 이상 · 같은 룬석 3개 → 한 등급 위</span></h2><div class="item cx"><div><div class="st">`+E22_RIDS.map(r=>{const R0=E22_RUNES[r];return `<div><b style="color:${R0.c}">${R0.k}의 룬 「${R0.n}」</b>: ${statName(R0.st==='main'?e22Main(P.cls):R0.st)} +${R0.v.join(' / +')}</div>`}).join('')+'</div></div></div>';
  const s=P&&P.e22?P.e22:{rw:[]};h+=`<h2>룬 문장 <span class="muted">${(s.rw||[]).length}/${E22_RW.length} 앎 · 홈 2개에 두 룬을 순서대로</span></h2>`;
  for(const w of E22_RW){const k=(s.rw||[]).includes(w.id);h+=`<div class="item cx"><div><div class="nm" style="color:#d6a8ff">「${w.n}」 <span class="muted">${k?`${E22_RUNES[w.a].k}「${E22_RUNES[w.a].n}」 → ${E22_RUNES[w.b].k}「${E22_RUNES[w.b].n}」`:'짜임새를 아직 모름 · 직접 맞추거나 룬 문장 쪽지로'}</span></div><div class="st">${w.d}</div></div></div>`}
  return h}
{const _cx=cxItems;cxItems=function(){return _cx.apply(this,arguments)+e22Codex()}}
setTimeout(()=>{try{const o={E22,E22_RUNES,E22_RW,E22_SETS,E22_DROP,E22_SOCK,end22Drop,e22Awaken,e22MakeSet,e22MakeAwk,e22SockRoll,e22Insert,e22Remove,e22Merge,e22RuneGain,e22RuneHave,e22Worn,e22ItemRw,e22TipLine,e22Codex,e22ShopHtml,e22StashMove,e22Clean,e22AwkP,e22SlowTick,e22RuneAdd,e22Pieces,E22_NAMEU,e22MakeName,itemIcon:(it,o)=>itemIcon(it,o)};window.__e22=o;if(window.__game)Object.assign(window.__game,o)}catch(_){}},0);
