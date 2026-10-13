/* ---------- v30: 몹 잡기 말고 다른 의뢰 다섯 가지 · 같은 던전 다시 들어가기 없애기 (사용자 2026-10-13) ----------
   · track 추적: 흔적을 차례로 찾아가면(110 안) 끝에 범인(정예)이 나타난다. 쓰러뜨리면 끝.
   · defend 지키기: 자리에 다가가면(150 안) 시작. 정해진 시간 동안 몰려오는 몬스터에게서 물건(체력)을 지킨다.
       물건이 부서지거나 · 쓰러지거나 · 멀리(800) 떠나면 실패, 다시 다가가면 처음부터.
   · ritual 봉인: 돌(등불·가마)을 정해진 순서대로 밟는다(70 안). 틀리면 모두 꺼지고 힌트 + 몬스터 둘.
   · riddle 수수께끼: 의뢰인 대화 창에서 물음 셋에 답한다. 틀리면 잠깐 뒤 다시.
   · chase 추격: 달아나는 사람을 붙잡는다(62 안). 끝까지 달아나면 처음 자리로 돌아간다.
   · 같이 하기: 몬스터는 방장(혼자)만 부른다. 손님은 범인 대신 마지막 흔적에서 바로 끝으로 친다.
   · 반복 정리: 준보스·보스를 쓰러뜨린 기록(P.mk, 종류마다 최대 9)을 남겨 두고, 50레벨 아래 의뢰를 받을 때 이미 잡은 것은 처치로 친다.
       → 「고분의 왕」을 마친 뒤 「늑대 송곳니」를 받아도 고분에 다시 들어가지 않는다. 처음 불러올 때는 끝낸 의뢰의 목표로 채운다.
     「고분의 속삭임」(입구 살펴보기)을 마치면 마을로 돌아가지 않고 바로 「고분의 왕」을 받는다.
   · 저장: 새 칸 mk 하나(없으면 빈 칸). 지우는 코드 없음. */
const Q30={pos:{},mo:new Map(),run:{},ch:{},on:{},pen:{},foe:{},lock:0,T:new Set(['track','defend','ritual','riddle','chase'])};
for(const q of Q30_SQ)for(const g of q.goals)if(g.type==='ritual'&&!g.n)g.n=g.stones.length;
Object.assign(FLDG,{h30_dock:['sunken2','#6a9a9a',.3],h30_glass:['forge','#c8583a',.35],h30_vein:['roots','#4a9aa8',.35],h30_shrine:['icecave','#cfe8ff',.25],h30_belltower:['tower','#8a8268',.4],h30_seal:['crypt','#5a4a7a',.45,'m']});
// 자리: 그 지역 쉼터(또는 from 마을) 가운데에서 [각도, 거리]. 그 지역에 있을 때 걸을 수 있는 곳으로 맞추고 기억한다
function q30Base(g){if(g.from){const t=ALLTOWNS.find(t=>t.id===g.from);if(t)return t}const L=(g.reg||'home')==='home'?null:RCACHE[g.reg];return L&&L.town||null}
function q30Raw(g,a){const b=q30Base(g);if(!b)return null;const r=a[0]*Math.PI/180;return{x:clamp(b.x+Math.cos(r)*a[1],150,WORLD-150),y:clamp(b.y+Math.sin(r)*a[1],150,WORLD-150)}}
const q30OkAt=(x,y)=>x>120&&y>120&&x<WORLD-120&&y<WORLD-120&&!blockedAt(x,y)&&!inSafe(x,y,-60)&&zoneLevel(x,y)>=1&&!CAVES.some(c=>Math.hypot(c.x-x,c.y-y)<170)&&!(EDGES||[]).some(e=>Math.hypot(e.x-x,e.y-y)<220);
function q30Reach(id){if(id==='home'||typeof terrReach!=='function')return null;const R=Q30.reach||(Q30.reach={});return R[id]||(R[id]=terrReach(id))}
function q30Spot(q,key,g,a){const ck=q.id+'/'+key,c=Q30.pos[ck];if(c)return c;const p=q30Raw(g,a);if(!p)return null;
  if(REG.id!==(g.reg||'home')||DG||IN)return p;const ok=q30Reach(REG.id);/* 물·절벽에 갇힌 곳 말고 마을에서 걸어서 닿는 곳만 */
  for(let r=0;r<1400;r+=40){const n=r?Math.max(6,Math.round(r/20)):1;for(let i=0;i<n;i++){const t=i/n*6.283+r*.01,x=p.x+Math.cos(t)*r,y=p.y+Math.sin(t)*r;if(q30OkAt(x,y)&&(!ok||wxCanReach(ok,x,y)))return Q30.pos[ck]={x,y}}}
  return Q30.pos[ck]=p}
// 지금 할 목표 (앞 목표를 다 했을 때만)
function q30Cur(q){if(!q)return -1;for(let j=0;j<q.goals.length;j++){if(sqGoalDone(q,j))continue;return Q30.T.has(q.goals[j].type)?j:-1}return -1}
const q30C=(q,j)=>{const a=sqState().a[q.id];return a?(a.c['g'+j]|0):0};
const q30Host=()=>!(typeof NET==='object'&&NET.guest);
function q30Lvl(k,x,y){const t=TYPES[k];return Math.max(1,Math.max(t.min||1,zoneLevel(x,y))+(DIFF[P.diff]?DIFF[P.diff].add:0))}
function q30Near(x,y,r0,r1){for(let i=0;i<14;i++){const a=R()*6.283,r=rnd(r0,r1),px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(px>60&&py>60&&px<WORLD-60&&py<WORLD-60&&!blockedAt(px,py)&&!inSafe(px,py,0))return{x:px,y:py}}return null}
function q30Mob(k,x,y,o){if(!TYPES[k])return null;const e=dgMob(k,x,y,q30Lvl(k,x,y),o&&o.elite?{elite:1}:null);if(o&&o.agg)e.aggroed=true;rings.push({x,y,r:6,max:70,life:.5,col:'#c8a0ff'});return e}
// 표시물 (decor에 잠깐 넣는다. 맨 앞·맨 뒤를 건드리지 않아 장식 색인을 매번 다시 만들지 않는다)
function q30Mark(key,o){let m=Q30.mo.get(key);if(!m){m={k:'q30',q30:1,walkT:0,s:1,v:0,face:1,moving:false,zl:0};Q30.mo.set(key,m)}Object.assign(m,o);m._w=1;return m}
function q30Sync(){for(const [key,m] of Q30.mo){if(m._w){m._w=0;if(m._reg!==REG||decor.indexOf(m)<0){decor.splice(Math.min(1,decor.length),0,m);m._reg=REG}continue}
  const i=decor.indexOf(m);if(i>=0)decor.splice(i,1);Q30.mo.delete(key)}}
// 한 걸음
function q30Tick(dt){if(!P||!P.sq)return;const s=sqState(),here=!DG&&!IN;
  for(const id in Q30.run){const q=SQBY[id],g=q&&q.goals[q30Cur(q)];if(!q||!s.a[id]||!g||g.type!=='defend'||!here||(g.reg||'home')!==REG.id)q30DefFail(id,'자리를 떠나')}
  for(const id in Q30.ch){const q=SQBY[id],g=q&&q.goals[q30Cur(q)];if(!q||!s.a[id]||!g||g.type!=='chase'||!here||(g.reg||'home')!==REG.id)delete Q30.ch[id]}
  if(here)for(const id in s.a){const q=SQBY[id],j=q30Cur(q);if(j<0)continue;const g=q.goals[j];if((g.reg||'home')!==REG.id)continue;
    try{Q30TICK[g.type]&&Q30TICK[g.type](q,j,g,dt)}catch(err){if(window.__QA)throw err}}
  q30Sync();q30ReachChain()}
const Q30TICK={
  track(q,j,g,dt){const c=q30C(q,j),L=g.steps.length;
    if(c<L){const sp=q30Spot(q,'s'+c,g,g.steps[c]);q30Mark(q.id+'/clue',{kind:'clue',x:sp.x,y:sp.y,lb:`흔적 ${c+1}/${L}`});
      if(!P.dead&&dist(P,sp)<110){sqProgress(q,j,1,true);burst(sp.x,sp.y,'#9fe0ff',16,90);msg(`흔적 ${c+1}/${L}: ${g.steps[c][2]}`,'#9fe0ff');
        if(c+1===L){if(q30Host())msg(`${g.foeN}이(가) 모습을 드러냅니다!`,'#ffb05a');else{sqProgress(q,j,1,true);msg('함께 하는 동료가 범인을 맡았습니다','#9fe0ff')}}}
      return}
    if(!q30Host()){sqProgress(q,j,1,true);return}
    const sp=q30Spot(q,'s'+(L-1),g,g.steps[L-1]),e=Q30.foe[q.id];
    if(e&&!e.dead&&enemies.includes(e))return;
    if(dist(P,sp)>900)return;const p=q30Near(sp.x,sp.y,90,180)||sp,f=q30Mob(g.foe,p.x,p.y,{elite:1,agg:1});if(!f)return;f.q30=q.id;Q30.foe[q.id]=f;
    burst(p.x,p.y,'#ffb05a',24,120,3,20)},
  defend(q,j,g,dt){const w=q30Spot(q,'w',g,g.at),run=Q30.run[q.id];
    q30Mark(q.id+'/ward',{kind:'ward',x:w.x,y:w.y,lb:run?g.what:`${g.what} · 가까이 가면 시작`,on:!!run,hp:run?run.hp:g.hp,max:g.hp,t:run?run.t:g.secs,hurt:run?run.hurt:0});
    if(!run){if(!P.dead&&dist(P,w)<150){Q30.run[q.id]={t:g.secs,hp:g.hp,wv:1.5,hurt:0};banner={t:`${g.what} 지키기`,sub:`${g.secs}초 동안 버티세요 · 곁을 떠나면 실패`,col:'#9fe0ff',life:2.4,max:2.4};msg(`${g.what}을(를) 지키기 시작했습니다. ${g.secs}초 동안 곁에서 버티세요`,'#9fe0ff')}return}
    run.t-=dt;run.wv-=dt;run.hurt=Math.max(0,run.hurt-dt);
    if(run.wv<=0&&q30Host()){run.wv=3.5;const live=enemies.filter(e=>!e.dead&&e.q30w===q.id).length;
      for(let i=0,n=Math.min(6-live,2+(R()<.5?1:0));i<n;i++){const p=q30Near(w.x,w.y,330,430);if(!p)continue;const e=q30Mob(g.mobs[(R()*g.mobs.length)|0],p.x,p.y);if(e)e.q30w=q.id}}
    for(const e of enemies){if(e.dead)continue;if(e.q30w===q.id&&!e.aggroed){e.wx=w.x;e.wy=w.y;e.wt=5}
      if(Math.hypot(e.x-w.x,e.y-w.y)>e.r*(e.sc||1)+46)continue;e._q30T=(e._q30T==null?.5:e._q30T)-dt;
      if(e._q30T<=0){e._q30T=((TYPES[e.k]&&TYPES[e.k].atk)||1.2)*1.1;const dm=Math.ceil(g.hp*(e.elite||e.boss?.06:.035));run.hp-=dm;run.hurt=.2;ftext(w.x,w.y,'-'+dm,'#ff9a7a',false,60)}}
    if(run.hp<=0)return q30DefFail(q.id,`${g.what}이(가) 부서져`);if(P.dead)return q30DefFail(q.id,'쓰러져');if(dist(P,w)>800)return q30DefFail(q.id,'자리를 떠나');
    if(run.t<=0){delete Q30.run[q.id];sqProgress(q,j,1,true);rings.push({x:w.x,y:w.y,r:10,max:200,life:1,col:'#9fe0ff'});burst(w.x,w.y,'#9fe0ff',30,150,3,30);
      banner={t:'지켜 냈다!',sub:`${g.what}이(가) 무사합니다`,col:'#9fe0ff',life:2.4,max:2.4}}},
  ritual(q,j,g,dt){const c=q30C(q,j),lit=g.order.slice(0,c);let on=-1;
    g.stones.forEach((st,i)=>{const sp=q30Spot(q,'r'+i,g,st);q30Mark(q.id+'/st'+i,{kind:'stone',x:sp.x,y:sp.y,lb:st[2],lit:lit.includes(i)});if(on<0&&!P.dead&&dist(P,sp)<70)on=i});
    const was=Q30.on[q.id];Q30.on[q.id]=on;if(on<0||on===was||lit.includes(on))return;const st=g.stones[on],sp=q30Spot(q,'r'+on,g,st);
    if(g.order[c]===on){sqProgress(q,j,1,true);burst(sp.x,sp.y,'#ffd98a',20,110,3,20);rings.push({x:sp.x,y:sp.y,r:6,max:90,life:.6,col:'#ffd98a'});msg(`${st[2]}에 불이 들어왔습니다 (${c+1}/${g.n})`,'#ffd98a');return}
    const a=sqState().a[q.id];if(a)a.c['g'+j]=0;burst(sp.x,sp.y,'#ff7a5a',20,110);shake=Math.max(shake,3);
    msg(`순서가 틀렸습니다! 불이 모두 꺼졌습니다. 힌트: ${g.hint}`,'#ff9a7a');banner={t:'순서가 틀렸습니다',sub:`힌트: ${g.hint}`,col:'#ff9a7a',life:2.4,max:2.4};
    if(q30Host()&&g.mobs&&time>(Q30.pen[q.id]||0)){Q30.pen[q.id]=time+6;for(let i=0;i<2;i++){const p=q30Near(sp.x,sp.y,120,200);if(p)q30Mob(g.mobs[i%g.mobs.length],p.x,p.y,{agg:1})}}
    questHud();save()},
  riddle(){},
  chase(q,j,g,dt){let C=Q30.ch[q.id];const a0=q30Spot(q,'a',g,g.at);
    if(!C)C=Q30.ch[q.id]={x:a0.x,y:a0.y,i:0,st:'wait',rt:0,pt:0,walkT:0,face:1};
    if(C.st==='wait'){if(!P.dead&&dist(P,C)<260){C.st='run';C.rt=0;msg(`${g.who.n}이(가) 달아납니다! 쫓아가서 붙잡으세요`,'#ffd34d')}}
    else if(C.st==='rest'){C.pt-=dt;if(C.pt<=0){C.st='run';C.rt=0}}
    else{const tg=q30Spot(q,'p'+C.i,g,g.path[C.i]),d=dist(C,tg),sp=SPEED*(g.slow?.6:.88)*dt;
      if(d<=sp+2){C.x=tg.x;C.y=tg.y;C.i++;if(C.i>=g.path.length){Object.assign(C,{x:a0.x,y:a0.y,i:0,st:'wait'});msg(`${g.who.n}을(를) 놓쳤습니다. 처음 자리로 돌아갔어요. 다시 쫓아가세요`,'#ff9a7a')}}
      else{const dx=tg.x-C.x,dy=tg.y-C.y;C.x+=dx/d*sp;C.y+=dy/d*sp;C.walkT+=dt;const sx=dx-dy;if(Math.abs(sx)>.5)C.face=sx>0?1:-1}
      C.rt+=dt;if(C.rt>3&&C.st==='run'){C.st='rest';C.pt=.9}
      if(dist(P,C)>1500)Object.assign(C,{x:a0.x,y:a0.y,i:0,st:'wait'})}
    q30Mark(q.id+'/run',{kind:'runner',x:C.x,y:C.y,L:g.who.L,n:g.who.n,moving:C.st==='run',walkT:C.walkT,face:C.face,say:C.st==='rest'?'헉, 헉…':C.st==='run'?null:'',sayT:time+1});
    if(C.st!=='wait'&&!P.dead&&dist(P,C)<62){delete Q30.ch[q.id];sqProgress(q,j,1,true);burst(C.x,C.y,'#ffd34d',20,110);banner={t:'붙잡았다!',sub:g.who.n,col:'#ffd34d',life:2.2,max:2.2};msg(`${g.who.n}을(를) 붙잡았습니다`,'#ffd34d')}}
};
function q30DefFail(id,why){const run=Q30.run[id];if(!run)return;delete Q30.run[id];const q=SQBY[id],g=q&&q.goals.find(g=>g.type==='defend');
  msg(`${why} 「${q?q.t:''}」 지키기에 실패했습니다. 다시 다가가면 처음부터 시작합니다`,'#ff8a6a');banner={t:'지키기 실패',sub:g?`${g.what} 곁으로 다시 가면 처음부터`:'',col:'#ff8a6a',life:2.4,max:2.4};questHud()}
// 범인 쓰러뜨림 · 준보스·보스 기록
const q30Mk=()=>{if(!P.mk||typeof P.mk!=='object'||Array.isArray(P.mk))P.mk={};return P.mk};
{const _k=questKill;questKill=function(e){_k.apply(this,arguments);try{if(!e)return;
  if(e.q30){const q=SQBY[e.q30],j=q30Cur(q);if(q&&j>=0&&q.goals[j].type==='track'&&q30C(q,j)===q.goals[j].steps.length){sqProgress(q,j,1,true);msg(`${q.goals[j].foeN}을(를) 쓰러뜨렸습니다`,'#9fe0ff')}return}
  const T=TYPES[e.k];if(T&&(T.mini||T.boss)){const m=q30Mk();m[e.k]=Math.min(9,(m[e.k]|0)+1)}}catch(err){if(window.__QA)throw err}}}
// 받을 때 이미 잡은 준보스·보스를 처치로 친다 (50레벨 아래 · 되풀이 의뢰 제외)
const q30Pre=g=>g.type==='kill'&&Array.isArray(g.k)&&g.k.length&&g.k.every(k=>TYPES[k]&&(TYPES[k].mini||TYPES[k].boss));
function q30Credit(goals,c){const m=q30Mk(),got=[];goals.forEach((g,j)=>{if(!q30Pre(g))return;let n=0;for(const k of g.k)n+=m[k]|0;n=Math.min(n,g.n||1);if(n>(c['g'+j]|0)){c['g'+j]=n;got.push(g.d)}});return got}
{const _a=sqAccept;sqAccept=function(id){const r=_a.apply(this,arguments);try{const q=SQBY[id],a=sqState().a[id];if(q&&a&&q.lvl<50&&!q.rep){const got=q30Credit(q.goals,a.c);
  if(got.length){msg(`이미 해낸 일: ${got.join(' · ')}. 던전에 다시 들어가지 않아도 됩니다`,'#ffd98a');if(sqAllDone(q)){const tf=sqFolk(sqTurn(q));msg(`「${q.t}」 목표를 모두 이뤘습니다. ${tf?tf.n+'에게 알리세요':''}`,'#9fe0ff')}questHud();save()}}}catch(err){if(window.__QA)throw err}return r}}
{const _a=questAccept;questAccept=function(){const st=qState(),i=st.i,s0=st.st;const r=_a.apply(this,arguments);try{const q=qCur();if(s0===0&&st.st===1&&st.i===i&&q&&q.lvl<50){const got=q30Credit(q.goals,st.c);
  if(got.length){msg(`이미 해낸 일: ${got.join(' · ')}`,'#ffd98a');if(qAllDone(q)){st.st=2;msg(`의뢰 「${q.t}」 목표를 모두 이뤘습니다. 의뢰인에게 알리세요`,'#ffd98a')}questHud();save()}}}catch(err){if(window.__QA)throw err}return r}}
// 처음 불러올 때(mk 없음): 이미 끝낸 의뢰의 준보스·보스를 잡은 것으로 채운다
function q30Seed(){const m=q30Mk(),add=gs=>{for(const g of gs||[])if(q30Pre(g))for(const k of g.k)m[k]=Math.max(m[k]|0,1)};
  const st=qState();for(let i=0;i<Math.min(st.i,QUESTS.length);i++)add(QUESTS[i].goals);if(st.st===2&&QUESTS[st.i])add(QUESTS[st.i].goals);
  const s=sqState();for(const id in s.d)if(SQBY[id]&&s.d[id]>0)add(SQBY[id].goals);return m}
const q30MkClean=v=>{const o={};if(v&&typeof v==='object'&&!Array.isArray(v))for(const k in v){const n=v[k]|0;if(n>0&&k.length<=40)o[k]=Math.min(9,n)}return o};
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P)d.mk=q30MkClean(P.mk)}catch(err){if(window.__QA)throw err}return d}}
{const _ld=load;load=function(d,slot){Q30.run={};Q30.ch={};Q30.pos={};const ok=_ld.apply(this,arguments);if(ok&&P)try{P.mk=q30MkClean(d&&d.mk);if(!(d&&d.mk&&typeof d.mk==='object'))q30Seed()}catch(err){if(window.__QA)throw err}return ok}}
{const _ng=newGame;newGame=function(){Q30.run={};Q30.ch={};Q30.pos={};const r=_ng.apply(this,arguments);if(P)P.mk={};return r}}
// 「고분의 속삭임」처럼 던전 입구만 살펴보는 의뢰를 마치면 마을에 돌아가지 않고 바로 그 던전 의뢰를 받는다
function q30ReachChain(){const st=qState(),q=qCur();if(!q||st.st!==2||!q.goals.length||!q.goals.every(g=>g.type==='reach'))return;const nq=QUESTS[st.i+1];if(!nq)return;
  const D=DUNGEONS.find(d=>q.goals.some(g=>g.cave===d.id));if(!D)return;const ks=[...D.minis,D.boss];if(!nq.goals.some(g=>g.type==='kill'&&g.k&&g.k.some(k=>ks.includes(k))))return;
  const t0=q.t;questFinish();if(qState().st===0&&qCur()===nq){questAccept();msg(`「${t0}」을(를) 마치고 바로 다음 의뢰 「${nq.t}」을(를) 받았습니다. 마을에 돌아가지 않고 이대로 「${D.n}」에 들어가면 됩니다`,'#ffd98a')}}
{const _u=update;update=function(dt){_u(dt);try{q30Tick(dt)}catch(err){if(window.__QA)throw err}}}
// 그리기
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.k!=='q30')return _rd(d);const s=d._s;if(!s)return true;const pa=ctx.globalAlpha;
  if(d.kind==='runner'){twDrawFolk(d);return true}
  const pul=.5+.5*Math.sin(time*4+d.x*.01),ell=(r,col,w,a)=>{ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.ellipse(s.x,s.y,r,r/2,0,0,6.283);ctx.stroke();ctx.globalAlpha=pa};
  const lbl=(t,c,dy)=>QLBL.push({x:s.x,y:s.y-(dy||40),n:t,mk:'',c,say:'',sa:0,ph:d.x});
  if(d.kind==='clue'){ctx.globalCompositeOperation='lighter';glow(s.x,s.y-6,46+pul*10,'#7fd8ff');ctx.globalCompositeOperation='source-over';ell(26+pul*6,'#9fe0ff',2,.9);
    ctx.fillStyle='rgba(20,40,50,.85)';for(const [ox,oy] of [[-8,4],[6,-3]]){ctx.beginPath();ctx.ellipse(s.x+ox,s.y+oy,4,2.4,.4,0,6.283);ctx.fill()}lbl(d.lb,'#9fe0ff',30);return true}
  if(d.kind==='stone'){const c=d.lit?'#ffd98a':'#8a8aa0';ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(s.x+4,s.y+2,20,9,0,0,6.283);ctx.fill();
    ctx.fillStyle=d.lit?'#6a5a3a':'#4a4a56';ctx.beginPath();ctx.moveTo(s.x-12,s.y);ctx.lineTo(s.x-9,s.y-34);ctx.lineTo(s.x,s.y-40);ctx.lineTo(s.x+9,s.y-34);ctx.lineTo(s.x+12,s.y);ctx.closePath();ctx.fill();
    ctx.fillStyle=d.lit?'#fff0c0':'#9a9ab8';ctx.fillRect(s.x-2,s.y-30,4,14);
    if(d.lit){ctx.globalCompositeOperation='lighter';glow(s.x,s.y-24,40+pul*8,'#ffd98a');ctx.globalCompositeOperation='source-over'}else ell(24+pul*4,c,1.5,.6);
    lbl(d.lb,d.lit?'#ffd98a':'#c8c8d8',52);return true}
  if(d.kind==='ward'){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(s.x+4,s.y+2,18,8,0,0,6.283);ctx.fill();ctx.fillStyle='#4a3a2a';ctx.fillRect(s.x-3,s.y-46,6,46);ctx.fillStyle='#2a2018';ctx.fillRect(s.x-9,s.y-52,18,8);
    ctx.globalCompositeOperation='lighter';glow(s.x,s.y-58,d.on?44+pul*10:30,'#ffd98a');ctx.globalCompositeOperation='source-over';ctx.fillStyle='#fff0c0';ctx.beginPath();ctx.arc(s.x,s.y-58,5,0,6.283);ctx.fill();
    if(d.hurt>0)hurtFlash(s.x,s.y-40,26,.5);if(!d.on)ell(70+pul*8,'#9fe0ff',2,.7);else ell(150,'rgba(159,224,255,.5)',1.5,.5);
    if(d.on){const y=s.y-86,f=clamp(d.hp/d.max,0,1);ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(s.x-30,y,60,6);ctx.fillStyle=f<.3?'#ff5a4a':'#9fe0ff';ctx.fillRect(s.x-30,y,60*f,6);
      ctx.font='700 13px '+FONT;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const tx=`${Math.max(0,Math.ceil(d.t))}초`;ctx.strokeText(tx,s.x,y-6);ctx.fillStyle='#fff0c0';ctx.fillText(tx,s.x,y-6)}
    lbl(d.lb,'#9fe0ff',d.on?110:70);return true}
  return true}}
// 의뢰 창: 수수께끼 물음 · 목표 글 · 목표 자리
{const _h=sqNpcHtml;sqNpcHtml=function(){let h=_h.apply(this,arguments);try{const f=SQV.npc;if(!f)return h;const s=sqState();
  for(const id in s.a){const q=SQBY[id],j=q30Cur(q);if(j<0)continue;const g=q.goals[j];if(g.type!=='riddle'||g.npc!==f.id)continue;const c=q30C(q,j),Q=g.qs[c];if(!Q)continue;
    h+=`<div class="qlog q30rid"><b>${q.t} · 물음 ${c+1}/${g.qs.length}</b><p class="qsay">「${Q[0]}」</p><div class="row">${Q[1].map((ch,i)=>`<button class="ghost" type="button" data-q30q="${q.id}" data-q30a="${i}">${ch}</button>`).join('')}</div></div>`}}catch(err){if(window.__QA)throw err}return h}}
function q30Answer(id,i){const q=SQBY[id],j=q30Cur(q);if(j<0)return;const g=q.goals[j];if(g.type!=='riddle')return;
  if(time<Q30.lock){msg('잠깐 생각을 가다듬고 다시 답해 보세요','#a39d8f');return}const Q=g.qs[q30C(q,j)];if(!Q)return;
  if(Q[2]===i){sqProgress(q,j,1,true);msg(`맞았습니다! 「${Q[1][i]}」 (${q30C(q,j)}/${g.qs.length})`,'#9fe0ff')}
  else{Q30.lock=time+2;msg(`「${Q[1][i]}」… 아닌 것 같아요. 다시 생각해 보세요`,'#ff9a7a')}}
{const _qc=questClick;questClick=function(b){const d=b&&b.dataset;if(d&&d.q30q){q30Answer(d.q30q,+d.q30a);renderPanel();return true}return _qc(b)}}
{const _g=sqGoalText;sqGoalText=function(q,j){const g=q.goals[j];if(!g||!Q30.T.has(g.type))return _g(q,j);const c=q30C(q,j),done=sqGoalDone(q,j);if(done)return g.d;
  if(g.type==='track'){const L=g.steps.length;return c<L?`${g.d} · 흔적 ${c}/${L}`:`${g.d} · ${g.foeN} 쓰러뜨리기`}
  if(g.type==='defend'){const run=Q30.run[q.id];return run?`${g.d} · 남은 시간 ${Math.max(0,Math.ceil(run.t))}초 · ${g.what} ${Math.max(0,Math.round(run.hp/g.hp*100))}%`:g.d}
  if(g.type==='ritual')return `${g.d} ${c}/${g.n}`;if(g.type==='riddle')return `${g.d} ${c}/${g.qs.length}`;
  if(g.type==='chase'){const C=Q30.ch[q.id];return C&&C.st!=='wait'?`${g.d} · 쫓는 중`:g.d}return g.d}}
{const _t=sqTarget;sqTarget=function(q){try{const j=q30Cur(q);if(j>=0&&sqState().a[q.id]){const g=q.goals[j],reg=g.reg||'home',rn=reg==='home'?'':REGIONS[reg].n+' · ';
  if(g.type==='riddle'){const f=sqFolk(g.npc);if(f)return{reg:f.town&&f.town.reg||'home',x:f.hx,y:f.hy,label:`${f.town?f.town.n:''} · ${f.n}`}}
  if(g.type==='track'){const c=Math.min(q30C(q,j),g.steps.length-1),p=q30Spot(q,'s'+c,g,g.steps[c]);if(p)return{reg,x:p.x,y:p.y,label:`${rn}흔적 ${c+1}`}}
  if(g.type==='defend'){const p=q30Spot(q,'w',g,g.at);if(p)return{reg,x:p.x,y:p.y,label:`${rn}${g.what}`}}
  if(g.type==='ritual'){let x=0,y=0;g.stones.forEach((st,i)=>{const p=q30Spot(q,'r'+i,g,st);x+=p.x;y+=p.y});const n=g.stones.length;return{reg,x:x/n,y:y/n,label:`${rn}${g.stones.length}개의 돌이 있는 곳`}}
  if(g.type==='chase'){const C=Q30.ch[q.id],p=C||q30Spot(q,'a',g,g.at);if(p)return{reg,x:p.x,y:p.y,label:`${rn}${g.who.n}`}}}}catch(err){if(window.__QA)throw err}return _t(q)}}
// 미니맵: 봉인 돌 자리 점 (켜진 돌 금색 · 안 켜진 돌 하늘색) · 추격 중인 사람 점
{const _m=sqMarks;sqMarks=function(world){const out=_m.apply(this,arguments);try{if(DG||IN)return out;const s=sqState();
  for(const id in s.a){const q=SQBY[id],j=q30Cur(q);if(j<0)continue;const g=q.goals[j];if((g.reg||'home')!==REG.id)continue;
    if(g.type==='ritual'){const lit=g.order.slice(0,q30C(q,j));g.stones.forEach((st,i)=>{const p=q30Spot(q,'r'+i,g,st);out.push({x:p.x,y:p.y,kind:'dot',col:lit.includes(i)?'#ffd98a':'#9fe0ff'})})}
    if(g.type==='chase'&&Q30.ch[id])out.push({x:Q30.ch[id].x,y:Q30.ch[id].y,kind:'dot',col:'#ffd34d'})}}catch(err){if(window.__QA)throw err}return out}}
window.__q30={Q30,Q30_SQ,Q30_DG,Q30_DGT,q30Spot,q30Cur,q30Tick,q30Answer,q30Credit,q30Seed,q30Mk,q30MkClean,q30ReachChain,q30Base,q30OkAt,TICK:Q30TICK};
