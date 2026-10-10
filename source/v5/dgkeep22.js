/* ---------- v22: 던전 초기화 주기 (사용자 06:46) ----------
   「던전이 리셋되는 주기를 다른 맵에 다녀올 때로 바꿔줘. 같은 맵에 있을 경우에는 1시간에 한번으로.」
   · 던전에서 나오면 그 던전(동굴 · 난이도 · 어둠 단계별)을 그대로 기억해 둔다: 쓰러뜨린 몬스터 · 보스 · 바닥 전리품 · 나가는 문.
   · 같은 지역에 있는 동안 다시 들어가면 기억한 던전으로(처음 지은 뒤 1시간이 지나면 새로). 다른 지역으로 가면 모두 잊는다.
   · 대상: 보통 던전(동굴로 들어가는 곳). 시험의 방 · 미궁 · 3막 장소 · 투기장 · 같이 하기 손님 쪽은 예전처럼.
   · 저장에 새 값 없음(접속을 끊으면 새로). 같이 하기는 방장의 던전을 그대로 보낸다(netDgData). */
const K22={m:new Map(),off:0,life:3600e3};
const k22Now=()=>Date.now()+K22.off;
function k22Key(c){const t=typeof darkTier==='function'?darkTier():0;return `${CAVES.indexOf(c)}:${P.diff|0}:${t}`}
function k22Ok(){return !!(DG&&DG.k22&&!NET.guest&&DG.d&&!DG.d.arena&&!DG.d.trial&&!DG.j2t&&!DG.j3t&&DG.ci>=0&&DG.ci<900)}
{const _e=enterDungeon;enterDungeon=function(c){
  const key=c&&c.cave&&!NET.guest?k22Key(c):null,k=key&&K22.m.get(key);
  if(k&&k22Now()-k.t0<K22.life&&k.reg===REG.id){DG=k.DG;DG.kept22=1;enemies=k.en.filter(e=>!e.dead);loot=k.loot;projs=[];fields=[];rains=[];pend=[];warns=[];arcs=[];DG.flow=null;DG.ft=-1;DG.fc=null;
    for(const e of enemies){e.aggroed=false;e.cast=0}
    const bR=k22BossReset();
    const p0=tc(DG.start.cx,DG.start.cy);P.x=p0.x;P.y=p0.y;for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}followCam();
    const left=enemies.length,bd=DG.bossDead;msg(`${DG.d.n}에 다시 들어섰습니다 · ${bd?'보스는 이미 쓰러졌습니다':bR?'쓰러뜨린 몬스터는 그대로 · 보스는 힘을 되찾았습니다':'쓰러뜨린 몬스터는 그대로입니다'} (남은 몬스터 ${left})`,'#ff9a6a');
    banner={t:DG.d.n,sub:`던전 · 몬스터 레벨 ${DG.lvl}~${DG.lvl+2} · 다른 지역에 다녀오거나 1시간이 지나면 새로`,col:'#ff9a6a',life:2.2,max:2.2};save();return}
  if(key)K22.m.delete(key);
  const r=_e.apply(this,arguments);if(key&&DG&&DG.d===c.cave){DG.k22=key;DG.k22t=k22Now();if(DG.boss)DG.k22bp={x:DG.boss.x,y:DG.boss.y}}return r}}
function k22Keep(){if(k22Ok())K22.m.set(DG.k22,{DG,en:enemies.filter(e=>!e.dead&&!e.ally),loot:loot.slice(),t0:DG.k22t||k22Now(),reg:REG.id})}
{const _l=leaveDungeon;leaveDungeon=function(){k22Keep();return _l.apply(this,arguments)}}
/* v26: 기억한 던전에 다시 들어가면 살아 있는 보스는 처음 상태로(사용자 13:14 「보스도 전혀 리셋이 안되고」).
   쓰러뜨린 몬스터 · 바닥 전리품은 그대로 두고, 보스만 생명력 가득 · 분노 · 분신 · 근위병 · 막기 게이지 · 시전을 지우고 처음 자리로.
   쓰러져 마을로 돌아갈 때도 나갈 때처럼 기억한다(b5.js 다시 일어나기 → k22Keep). */
function k22BossReset(){const b=DG&&DG.boss;if(!b||b.dead||!(b.hp>0)||DG.bossDead)return false;
  const hurt=b.hp<b.max||b.rage||b.mg||b.down||b.ga||b.gsh||b.swal||b.bc>0||b.stg>0||b.brk>0;
  if(b.mg&&typeof PTY==='object'&&PTY.sets)PTY.sets=PTY.sets.filter(B=>B!==b.mg);
  enemies=enemies.filter(o=>o===b||!((o.clone&&(o.mg===b.mg||o.k===b.k))||o.guard===b));
  Object.assign(b,{hp:b.max,rage:0,mg:null,down:0,gone:false,bc:0,bcw:null,bcT:null,sumT:0,cast:0,dash:0,dashHit:null,burn:null,slowT:0,freezeT:0,stunT:0,
    stg:0,brk:0,swT:0,swal:null,swalF:false,ga:0,gsh:0,cd:null,thr:null,aggroed:false,hurt:0,lunge:0,skT:rnd(1.5,3)});
  const h=DG.k22bp;if(h){b.x=b.wx=h.x;b.y=b.wy=h.y}if(!enemies.includes(b))enemies.push(b);return !!hurt}
// 다른 지역으로 가면 모두 새로 · 캐릭터를 바꿔도 새로
{const _r=loadRegion;loadRegion=function(id){if(REG&&id!==REG.id)K22.m.clear();return _r.apply(this,arguments)}}
setTimeout(()=>{try{const _ld=load;load=function(){K22.m.clear();return _ld.apply(this,arguments)};if(window.__game)Object.assign(window.__game,{K22,k22BossReset})}catch(_){}},0);
