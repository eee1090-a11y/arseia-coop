/* ---------- v19 (SKILL): 1차 스킬 정리 — 실행 중 코드 ----------
   데이터는 skill19.js. 여기서는 이미 있는 함수를 한 겹 감싸고 표를 고친다(castmark.js 다음, b5.js 앞).
   · 시전 시간: 그레이터 힐 1.5초 · 풀 리스토어 2초 · 리저렉션 3초. 「한 명」 치유는 외우기 시작할 때 고른 동료가
     다 외웠을 때 멀어졌거나 쓰러졌으면 「대상이 멀어졌습니다」로 끝나고 마나·재사용은 들지 않는다(동료가 움직여도 외우기는 안 끊김).
   · 상위 기술(tab:'adv')은 2차 전직 전에는 쓰지 못한다(동료 화면에서 보이는 시전은 막지 않음).
   · 저장: 단축칸의 없어진 스킬 → 합쳐진 스킬(이미 단축칸에 있으면 비움), 장비 +스킬 옵션(GONE_SK), 옛 판 동료의 시전(netGhostCast).
   · 스킬 수치: 화염 화살 10레벨부터 두 발 · 돌풍은 레벨마다 더 멀리 · 리와인드는 6위계 이하만 · 타임 스톱은 보스 0.5초 · 스마이트 그림은 스킬 레벨로.
   · 아이템(새로 떨어지는 것부터): 일반 유니크의 +모든 마법 레벨 빼기, 상급 유니크·세트의 +2 → +1, 「성녀의 가호」 → 「순례자의 가호」. */

/* ---- 시전 시간 · 채널링 · 후딜레이 표 ---- */
Object.assign(CAST_T,CAST_V19);
for(const id in GONE_V19){delete CAST_T[id];delete CHAN[id];if(typeof REC_T==='object')delete REC_T[id];if(typeof SKILL_LINES==='object')delete SKILL_LINES[id]}
if(typeof REC_T==='object')REC_T.smite=0;// 사제의 기본 공격(옛 홀리 스파크 자리)

/* ---- 장비의 +스킬 옵션: 없어진 스킬 → 남는 스킬 (v17 표도 여러 번 합쳐진 끝까지 따라감) ---- */
for(const k in MERGE_V19)GONE_SK[k]=MERGE_V19[k];
for(const k in RETIRE_V19)GONE_SK[k]=RETIRE_V19[k].bar;
for(const k in GONE_SK){const t=mergeTo(GONE_SK[k]);if(t)GONE_SK[k]=t}

/* ---- 단축칸 i: 없어진 스킬이면 합쳐진 스킬로 (그 스킬이 이미 다른 칸에 있으면 비움) ---- */
function mapBarV19(bar,i){const x=bar&&bar[i];if(!x||typeof x!=='string')return null;if(SPELLS[x])return x;
  const to=mapGoneV19(x);if(!to||!SPELLS[to])return x;
  for(let j=0;j<bar.length;j++){if(j===i)continue;const y=bar[j];if(y===to)return null;if(j<i&&y&&typeof y==='string'&&!SPELLS[y]&&mapGoneV19(y)===to)return null}
  return to}

/* ---- 처음 불러올 때 한 번 알림 ---- */
function skMoveMsgV19(sl){const by={},ret=[];let over=0,mb=0;
  for(const m of sl.moved||[]){const g=GONE_V19[m.from],n=g?g.n:m.from;mb+=m.back;
    if(m.to){if(m.mv>0)(by[m.to]=by[m.to]||[]).push(`${n} ${m.mv}점`);over+=m.back}else ret.push(`${n} ${m.back}점`)}
  for(const to in by)if(SPELLS[to])msg(`스킬 정리: ${SPELLS[to].n}에 ${by[to].join(', ')}을 옮겼습니다`,'#ffd76a');
  if(ret.length)msg(`스킬 정리: 2·3차 전직으로 옮겨 간 ${ret.join(', ')}을 스킬 포인트로 돌려받았습니다`,'#ffd76a');
  if(over)msg(`스킬 정리: 20을 넘거나 레벨이 모자라 옮기지 못한 ${over}점을 스킬 포인트로 돌려받았습니다`,'#ffd76a');
  const gb=(sl.back||0)-mb;if(gb>0)msg(`없어진 마법(${sl.gone.length}개)에 찍은 스킬 포인트 ${gb}점을 돌려받았습니다. 스킬 트리(T)에서 다시 찍으세요`,'#ffd76a');
  else if(sl.back)msg('돌려받은 점수는 스킬 트리(T)에서 다시 찍으세요','#ffd76a')}

/* ---- 시전: 상위 기술 잠금 · 「한 명」 치유 대상 기억 ---- */
{const _tc=tryCast;tryCast=function(id,t){const s0=SPELLS[id];
  if(!GHOST&&!CAST_MOD&&s0&&s0.tab==='adv'&&!advUnlocked(id)){
    if(P.noMpT<=0){msg(P.job2?`${s0.n}: 레벨 ${s0.upLv}부터 쓸 수 있습니다`:`${s0.n}: 상위 기술은 2차 전직 뒤에 쓸 수 있습니다 (찍어 둔 점수는 그대로 남아 있습니다)`,'#a39d8f');P.noMpT=1.5}return}
  const before=CAST.cur,r=_tc.apply(this,arguments);
  if(!GHOST&&s0&&s0.one&&CAST.cur&&CAST.cur!==before&&CAST.cur.id===id&&typeof PTY==='object')CAST.cur.oneTg=PTY.tgt||0;
  return r}}
{const _cr=_castRelease;_castRelease=function(cu){const s=SPELLS[cu.id];
  if(s&&s.one&&cu.oneTg&&NET.on&&typeof PTY==='object'&&PTY.tgt===cu.oneTg){const r=NET.peers.get(cu.oneTg);
    if(!r||r.dead||!netSame(r)||dist(r,P)>PTY.RANGE){msg(`${s.n}: 대상이 멀어졌습니다 (마나와 재사용 대기는 들지 않았습니다)`,'#a39d8f');return}}
  return _cr(cu)}}

/* ---- 같이 하기: 옛 판 동료가 없어진 스킬을 쓰면 합쳐진 스킬로 보여 준다 ---- */
const mapNetSpV19=sp=>SPELLS[sp]?sp:(mergeTo(sp)||(GONE_SK[sp]&&mergeTo(GONE_SK[sp]))||null);
{const _ng=netGhostCast;netGhostCast=function(m){if(m&&m.sp&&!SPELLS[m.sp]){const to=mapNetSpV19(m.sp);if(!to)return;m=Object.assign({},m,{sp:to})}return _ng(m)}}
{const _cn=castNetMsg;castNetMsg=function(m){if(m&&m.sp&&!SPELLS[m.sp]){const to=mapNetSpV19(m.sp);if(to)m=Object.assign({},m,{sp:to})}return _cn(m)}}

/* ---- 스킬 레벨에 따른 수치 ---- */
{const _ef=eff;eff=function(id,L){const e=_ef(id,L);
  if(e.cntAt&&e.L>=e.cntAt&&!(e.cnt>1)){e.cnt=2;e.spread=e.spread||.14;if(e.cntMul&&e.mult)e.mult*=e.cntMul}// 화염 화살: 10레벨부터 두 발 (한 발은 0.65배 → 합쳐 1.3배)
  if(e.knockLv)e.knock=Math.round((SPELLS[id].knock||0)+e.knockLv*(e.L-1));// 돌풍: 레벨마다 더 멀리
  return e}}
// 리와인드: 6위계 이하 마법의 재사용 대기만 지운다
{const _sf=supFx;supFx=function(s,id,pwr,from){const r=_sf.apply(this,arguments);
  if(s&&s.resetRank&&!from&&!GHOST){for(const k in P.cd)if(k!==id&&SPELLS[k]&&SPELLS[k].rank<=s.resetRank)P.cd[k]=0;
    rings.push({x:P.x,y:P.y,r:10,max:120,life:.7,col:EL[s.el]});msg(`${s.n}: ${s.resetRank}위계 이하 마법의 재사용 대기가 사라졌습니다`,EL[s.el])}
  return r}}
// 타임 스톱: 보스·준보스는 짧게
{const _af=applyFx;applyFx=function(e,s,from){if(s&&s.bossFreeze&&e&&s.freeze>s.bossFreeze){const t=TYPES[e.k]||{};if(e.boss||t.boss||t.mini)s=Object.assign({},s,{freeze:s.bossFreeze})}return _af(e,s,from)}}
// 스마이트 그림: 위계 대신 스킬 레벨로 굵어진다 (1~7 / 8~14 / 15~)
{const _ft=FXR.tier;FXR.tier=function(p){if(p._fxt==null&&p.s&&p.s.lvTier){const L=p.s.L||1,T=p.s.lvTier;return(p._fxt=L>=T[1]?2:L>=T[0]?1:0)}return _ft.call(this,p)}}

/* ---- 버프 아이콘·파티 창: 몇 레벨 · 누가 걸었는지 ---- */
{const _mb=PUI.myBuffs;PUI.myBuffs=function(){const o=_mb.apply(this,arguments);
  for(const e of o){const b=P&&P.buffs&&P.buffs[e[0]];if(b&&b.L){if(e[2]==null)e[2]=0;e[3]=b.L;if(b.by)e[4]=b.by}}return o}}

/* ---- 아이템 (새로 떨어지는 것부터 · 가진 아이템은 그대로) ---- */
{const U=n=>UNIQ.find(u=>u.n===n);let u;
  if((u=U('아우렐의 눈물'))&&u.st.all){delete u.st.all;u.st.tr_2=2}
  if((u=U('근원어의 목걸이'))&&u.st.all){delete u.st.all;u.st.mk=7}
  for(const x of UNIQ)if(x.st.all){delete x.st.all;x.st.tr_0=(x.st.tr_0||0)+1}
  for(const x of BOSSU)if(x.st.all>1)x.st.all=1;
  for(const k in SETS)for(const n in SETS[k].b)if(SETS[k].b[n].all>1)SETS[k].b[n].all=1;
  if(SETS.saint){SETS.saint.n='순례자의 가호';for(const sl in SETS.saint.p)SETS.saint.p[sl]=SETS.saint.p[sl].replace('성녀의','순례자의')}}

/* ---- 점검·도구용 ---- */
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{ADV_IDS,ADV_LV,advUnlocked,isAdv,reqLvOf,MERGE_V19,RETIRE_V19,GONE_V19,mergeTo,mapBarV19,skLoad,putBuffV19,GONE_SK,V19_MORE,MAGE_TRIM_V19})}catch(_){}},0);
