/* ---------- v18: 파티 보상 · 위협 · 무너짐 · 협동 보스 · 한 명 지원 마법 (PARTY) ----------
   설계: rpg/v18-design/code/v18-party.js · v18-설계서.md 7절. 계산은 방장(또는 혼자)의 화면이 한다(net.js와 같은 방식).
   · 생명력: 몬스터가 처음 움직일 때 같은 지역 인원 n으로 한 번 정한다 → ×(1+0.9(n-1)), 준보스·보스 ×(1+1.0(n-1)). 몬스터 피해는 그대로(사용자 규칙).
   · 경험치: 처치 경험치 ×(1+0.05(n-1)) — 「파티 보너스」.
   · 위협: 파티(같은 지역에 살아 있는 동료가 있음)면 모든 몬스터가 위협 1위를 노린다(위협이 없으면 가까운 사람). 1위가 지금 대상보다 1.3배 넘게 앞설 때만 바꾼다.
     피해 1 = 위협 1, 전사 ×2.5, 마법의 threat 값(도발 일격 4)은 곱, 치유·보호막·강화는 0.5. 도발(taunt)은 1위의 150% + 그 시간 동안 시전자만 노림. 혼자면 예전처럼 가까운 사람.
   · 무너짐 게이지(보스·준보스): 기절·얼림·밀치기·막기·끊기로 찬다. 가득 차면 5초 무너짐(못 움직이고 받는 피해 +30%).
   · 협동 보스(던전 1막): 아르실 근위병+보호막, 삼키는 자 삼키기, 발드라크 「재의 폭풍」 2초 외우기(끊기·막기), 모르가스 분신(함께 쓰러뜨리기). 혼자면 약하게.
   · 협동 처치: 보스 생명력 5% 이상을 깎았거나 치유·보호막·도발로 도운 사람이 둘 이상이면 그 사람들은 보스 전리품을 한 번 더(10%는 상급 유니크).
   · 쌍둥이 준보스: 던전의 준보스 둘을 10초 안에 함께 쓰러뜨리면 보너스 상자.
   · 사제 지원 마법: 「파티(주변)」(나와 둘레의 동료) · 「한 명」(고른 동료 한 명, 없거나 멀면 나) · 「자신만」.
     파티 창의 동료 칸이나 화면의 동료를 누르면(또는 Tab) 지원 대상으로 고른다. 시전 메시지에 tg(동료 id)를 실어 그 동료만 받는다.
   방장이 보내는 몬스터 줄(snap)에 a[21]을 덧붙여 무너짐·보호막·분신·삼킴·외우기를 참가자 화면에 보여 준다(옛 참가자는 무시). 새 메시지 'pm'도 옛 버전은 무시한다. */
const PTY={
  HP:{normal:.9,elite:.9,mini:1,boss:1},XP:.05,SW:1.3,WAR:2.5,HEALT:.5,
  STG:{max:100,stun:12,freeze:10,knock:6,block:4,interrupt:30,dur:5,amp:.3,decay:3},
  RANGE:650,tgt:0,cur:null,xpK:1,xpT:-9,kco:false,ktw:false,ghostTg:null,
  // 「한 명」 마법: 원래 자신만이던 치유·보호막·가호·축복과, 한 사람에게 쓰는 게 자연스러운 수호 천사·고통 억제·임포지티오(대신 한 명에게 더 세게)
  ONE:{minorheal:{},closewounds:{},greaterheal:{},regeneration:{},lightward:{},divineshield:{},grace:{},blessing:{},
    guardianspirit:{healUp:.5,heal:.6,_d:[['40%','50%'],['50%로','60%로']]},painsup:{dur:10,_d:[['8초','10초']]},impositio:{dmg:.25,_d:[['10초 동안 피해를 20%','10초 동안 피해를 25%']]}},
  /* ---- 인원 ---- */
  partyN(){if(!NET.on)return 1;let n=1;for(const r of NET.peers.values()){if(!r.seen&&!r.name)continue;if(DG||netSame(r))n++}return Math.min(n,8)},
  alivePeers(){if(!NET.on)return 0;let n=0;for(const r of NET.peers.values())if(!r.dead&&netSame(r)&&(r.seen||r.name))n++;return n},
  partyMode(){return NET.on&&!NET.guest&&this.alivePeers()>0},
  who(k){return k===0?P:NET.peers.get(k)},
  key(o){return o===P?0:o&&o.remote?o.id:null},
  okTg(p){return !!p&&!p.dead&&!p.swal&&(p===P||(p.remote&&netSame(p)))},
  isWar(k){const p=this.who(k);return !!p&&p.cls==='warrior'},
  netId(k){return k===0?(NET.on?NET.id:0):k},
  /* ---- 생명력 늘리기: 처음 보는 몬스터에 한 번 ---- */
  scale(e){if(e.ps!=null)return;const n=this.partyN();e.ps=n;if(n<=1)return;const t=TYPES[e.k]||{},per=t.boss?this.HP.boss:t.mini?this.HP.mini:e.elite?this.HP.elite:this.HP.normal,m=1+per*(n-1);
    const fr=e.max>0?e.hp/e.max:1;e.max=Math.round(e.max*m);e.hp=Math.max(1,Math.round(e.max*fr))},
  /* ---- 위협 ---- */
  thr(e,k,v){if(!(v>0)||k==null)return;const T=e.thr||(e.thr=new Map());T.set(k,(T.get(k)||0)+v)},
  top(e){let tk=null,tv=-1;if(e.thr)for(const [k,v] of e.thr){if(!this.okTg(this.who(k)))continue;if(v>tv){tv=v;tk=k}}return{k:tk,v:tv}},
  taunt(e,k,dur){if(!e||e.dead||k==null)return;const T=e.thr||(e.thr=new Map());let tv=0;for(const v of T.values())tv=Math.max(tv,v);
    T.set(k,Math.max(T.get(k)||0,tv*1.5,1));e.tnt={k,t:time+(dur||3)};e.ttk=k;e.aggroed=true;if(e.boss)this.help(e,k)},
  tauntAround(k,x,y,rad,dur){for(const e of enemies)if(!e.dead&&!e.down&&Math.hypot(e.x-x,e.y-y)<rad+e.r)this.taunt(e,k,dur)},
  // 치유·보호막·강화: 싸우는 중인 몬스터(위협 표가 있는 몬스터)에게 0.5배 위협, 보스는 협동 기여
  support(k,o,s,pw){if(NET.guest||!o)return;const v=Math.max(10,(pw||100)*Math.max(.5,s&&s.mult||1)*this.HEALT);
    for(const e of enemies){if(e.dead||e.down||!e.aggroed)continue;const d=Math.hypot(e.x-o.x,e.y-o.y);if(d>1400)continue;if(e.thr&&d<900)this.thr(e,k,v);if(e.boss)this.help(e,k)}},
  help(e,k){(e.cs||(e.cs=new Set())).add(k)},
  onDmg(e,k,d,s){const m=(s&&s.threat||1)*(this.isWar(k)?this.WAR:1);this.thr(e,k,d*m);if(TYPES[e.k]&&TYPES[e.k].boss){const C=e.cd||(e.cd=new Map());C.set(k,(C.get(k)||0)+d)}
    const sw=e.swal;if(sw&&sw.k!==k){sw.got+=d;if(sw.got>=sw.need)this.spit(e,true)}},
  dmgMul(e,k){let m=1;if(e.brk>0)m*=1+this.STG.amp;if(e.gsh)m*=.2;if(e.swal&&e.swal.k!==k)m*=1.15;return m},
  /* ---- 무너짐 게이지 ---- */
  stag(e,amt,why){if(!e||e.dead||e.down||!e.boss||!(amt>0))return;if(e.brk>0)return;e.stg=(e.stg||0)+amt;
    if(e.stg>=this.STG.max){e.stg=0;e.brk=this.STG.dur;e.stunT=Math.max(e.stunT||0,this.STG.dur);if(e.bc>0)this.interrupt(e,true);
      rings.push({x:e.x,y:e.y,r:10,max:e.r*4,life:.7,col:'#ffd34d'});burst(e.x,e.y,'#ffd34d',40,220,3,20);shake=Math.max(shake,7);
      msg(`${TYPES[e.k].n}이(가) 무너졌습니다! 5초 동안 받는 피해 +30%`,'#ffd34d');this.pm({k:'fx',x:Math.round(e.x),y:Math.round(e.y),c:'#ffd34d',r:Math.round(e.r*4)})}},
  stagFx(e,s){if(!e.boss)return;const G=this.STG;let a=0;
    if(s.stun)a+=G.stun*clamp(s.stun,.25,1.5);if(s.freeze)a+=G.freeze*clamp(s.freeze,.25,1.5);if(s.knock)a+=G.knock*clamp(s.knock/60,.3,1.5);
    if(e.bc>0&&((s.stun||0)>=.5||(s.knock||0)>0)){this.interrupt(e);return}
    this.stag(e,a)},
  // 전사의 막기(CLS): PTY.block(src) 를 부르면 그 보스의 게이지가 찬다
  block(src){if(src&&src.boss&&!NET.guest)this.stag(src,this.STG.block)},
  /* ---- 1프레임 (방장·혼자) ---- */
  tick(dt){const f=Math.pow(.9,dt),solo=this.partyN()<=1;
    for(const e of enemies){if(e.dead)continue;
      if(e.thr)for(const [k,v] of e.thr){const p=this.who(k);if(!p||p.dead)e.thr.delete(k);else e.thr.set(k,v*f)}
      if(!e.boss)continue;
      if(e.brk>0){e.brk=Math.max(0,e.brk-dt)}else if(e.stg>0)e.stg=Math.max(0,e.stg-this.STG.decay*dt);
      if(e.k==='b_arsil')this.arsil(e,solo);else if(e.k==='b_devourer')this.devourer(e,dt,solo);else if(e.k==='b_baldrak')this.baldrak(e,dt,solo);else if(e.k==='b_morgath'&&!e.clone)this.morgath(e,solo)}
    for(const B of this.sets)this.mgTick(B);if(this.sets.length>4)this.sets=this.sets.filter(B=>!B.done);
    // 삼켜진 동료가 쓰러지거나 떠나면 뱉는다
    for(const e of enemies)if(e.swal){const p=this.who(e.swal.k);if(!p||p.dead||(p!==P&&!netSame(p))||e.dead)this.spit(e,false)}},
  /* 아르실: 60%에서 근위병(파티 4 · 혼자 2) + 보호막(받는 피해 -80%). 근위병이 다 쓰러지면 벗겨진다 */
  arsil(e,solo){
    if(!e.ga&&e.hp<e.max*.6&&e.hp>0){e.ga=1;e.gsh=1;const n=solo?2:4;
      for(let i=0;i<n;i++){const a=i*6.283/n+.4;let x=e.x+Math.cos(a)*110,y=e.y+Math.sin(a)*110;if(DG&&!dgFree(x,y,16)){x=e.x+Math.cos(a)*50;y=e.y+Math.sin(a)*50}
        const g=dgMob('ashknight',x,y,Math.max(1,e.lvl-1));g.guard=e;g.aggroed=true;g.elite=false;rings.push({x,y,r:4,max:50,life:.5,col:'#c6b4ff'})}
      rings.push({x:e.x,y:e.y,r:10,max:e.r*3,life:.8,col:'#c6b4ff'});msg(`${TYPES[e.k].n}이(가) 근위병 ${n}을 일으키고 보호막을 두릅니다 — 근위병을 쓰러뜨리세요`,'#c6b4ff')}
    if(e.gsh&&!enemies.some(o=>o.guard===e&&!o.dead)){e.gsh=0;msg('근위병이 모두 쓰러져 왕의 보호막이 벗겨졌습니다','#ffd34d');burst(e.x,e.y,'#c6b4ff',40,200,3,30);this.stag(e,this.STG.interrupt)}},
  /* 삼키는 자: 파티면 위협 1위를 4초 삼킨다(속에서 조임). 다른 사람이 배를 때리면 15% 더 아프고, 보스 생명력 3%만큼 때리면 뱉는다. 혼자면 크게 들이마시기만 */
  devourer(e,dt,solo){
    if(e.swal){const sw=e.swal;sw.t-=dt;sw.tick-=dt;e.cast=Math.max(e.cast||0,.2);
      if(sw.tick<=0){sw.tick=1;const p=this.who(sw.k);if(p===P)hitPlayer(e.dmg*.6,e);else if(p)netHit(p,e.dmg*.6,e)}
      if(sw.t<=0)this.spit(e,false);return}
    if(!e.aggroed||e.hp<=0)return;e.swT=(e.swT==null?8:e.swT)-dt;if(e.swT>0||e.stunT>0||e.freezeT>0)return;e.swT=14;
    if(!solo&&this.alivePeers()>0){const o=enemyTarget(e),p=o.tg,k=this.key(p);
      if(k!=null&&!p.dead&&o.d<300){e.swal={k,t:4,tick:1,need:Math.max(1,e.max*.03),got:0};e.cast=4;
        if(p===P){P.swal={e,t:4};msg(`${TYPES[e.k].n}에게 삼켜졌습니다! 동료가 배를 때리면 풀려납니다`,'#ff6a5a')}
        else{p.swal={e};this.pm({k:'sw',to:p.id,e:e.id,d:4});msg(`${TYPES[e.k].n}이(가) ${p.name||'동료'}님을 삼켰습니다! 배를 때리세요 (피해 +15%)`,'#ff9a6a')}
        rings.push({x:e.x,y:e.y,r:8,max:120,life:.6,col:'#9ab07a'});shake=Math.max(shake,6);return}}
    // 혼자(또는 대상이 멀 때): 크게 들이마셔 끌어당긴다
    warns.push({x:e.x,y:e.y,rad:260,t:.6,max:.6,dmg:0,col:'#9ab07a'});this.pull={e,t:.7};msg(`${TYPES[e.k].n}이(가) 크게 들이마십니다`,'#9ab07a')},
  spit(e,freed){const sw=e.swal;if(!sw)return;e.swal=null;e.cast=0;const p=this.who(sw.k);
    if(p===P){P.swal=null;const a=R()*6.283;moveBody(P,Math.cos(a)*90,Math.sin(a)*90)}else if(p){p.swal=null;this.pm({k:'sp',to:p.id})}
    burst(e.x,e.y,'#9ab07a',30,200,3,20);if(freed){msg('배를 때려 삼켜진 동료를 꺼냈습니다','#9fe39a');this.stag(e,20)}else msg(`${TYPES[e.k].n}이(가) 삼킨 것을 뱉었습니다`,'#a39d8f')},
  /* 발드라크: 18초(혼자 24초)마다 2초 동안 「재의 폭풍」. 0.5초 이상 기절·밀치기로 끊으면 게이지 +30, 못 끊으면 반경 300에 피해 ×3 (보호막·피해 감소로 받아 냄) */
  baldrak(e,dt,solo){
    if(e.bc>0){e.bc=Math.max(0,e.bc-dt);e.cast=Math.max(e.cast||0,Math.min(.2,e.bc));if(e.bc<=0)e.bcw=null;return}
    if(!e.aggroed||e.hp<=0)return;e.bcT=(e.bcT==null?(solo?12:9):e.bcT)-dt;if(e.bcT>0||e.stunT>0||e.freezeT>0)return;
    e.bcT=solo?24:18;e.bc=2;e.cast=2;const w={x:e.x,y:e.y,rad:300,t:2,max:2,dmg:e.dmg*3,col:'#ff7a3a',src:e};warns.push(w);e.bcw=w;
    msg(`${TYPES[e.k].n}이(가) 「재의 폭풍」을 외웁니다 — 기절·밀치기로 끊거나 피하세요`,'#ff7a3a')},
  interrupt(e,quiet){if(!(e.bc>0))return;e.bc=0;e.cast=0;if(e.bcw){e.bcw.done=1;e.bcw.t=0;e.bcw=null}
    if(!quiet){msg(`${(TYPES[e.k]||{}).bcN||'「재의 폭풍」'}을 끊었습니다!`,'#ffd34d');rings.push({x:e.x,y:e.y,r:10,max:120,life:.5,col:'#ffd34d'});this.stag(e,this.STG.interrupt)}},
  /* 모르가스: 50%에서 분신(파티 2 · 혼자 1). 하나가 쓰러지면 10초(혼자 15초) 안에 셋이 다 쓰러져야 하고, 아니면 쓰러진 것이 생명력 40%로 일어선다 */
  sets:[],
  morgath(e,solo){if(e.mg||e.hp>=e.max*.5||e.hp<=0)return;const n=solo?1:2,B={boss:e,mem:[e],t0:-1,win:solo?15:10,done:0};e.mg=B;
    for(let i=0;i<n;i++){const a=i*3.1416+1.2;let x=e.x+Math.cos(a)*120,y=e.y+Math.sin(a)*120;if(DG&&!dgFree(x,y,20)){x=e.x+Math.cos(a)*40;y=e.y+Math.sin(a)*40}
      const c=dgMob('b_morgath',x,y,e.lvl);c.ps=e.ps;c.clone=1;c.mg=B;c.max=c.hp=Math.max(1,Math.round(e.max*(solo?.25:.3)));c.dmg=e.dmg*.6;c.sc=(TYPES.b_morgath.sc||2.8)*.8;c.big=1;c.rage=1;c.aggroed=true;c.skT=rnd(2.5,4);c.thr=e.thr?new Map(e.thr):null;
      B.mem.push(c);burst(x,y,'#ff4a1a',30,180,3,20)}
    this.sets.push(B);rings.push({x:e.x,y:e.y,r:10,max:200,life:.8,col:'#ff4a1a'});shake=Math.max(shake,6);
    msg(`${TYPES[e.k].n}이(가) 분신 ${n}(으)로 갈라집니다 — ${B.win}초 안에 모두 함께 쓰러뜨리세요`,'#ff6a3a')},
  mgDown(e){const B=e.mg;if(!B||B.done)return false;
    const up=B.mem.filter(o=>o!==e&&!o.down&&!o.dead);
    if(!up.length){B.done=1;for(const o of B.mem)if(o!==B.boss){o.down=0;o.dead=true;o.gone=true;if(o!==e)continue;killFx(o);this.pm({k:'fx',x:Math.round(o.x),y:Math.round(o.y),c:'#ff4a1a',r:80})}
      if(e===B.boss){e.down=0;e.gone=false;return false}
      const b=B.boss;b.down=0;b.gone=false;b.hp=0;if(!enemies.includes(b))enemies.push(b);msg('분신이 모두 쓰러졌습니다','#ffd34d');PTY.preKill(b);PTY._ke(b);return true}
    e.down=1;e.hp=0;e.gone=true;e.burn=null;if(e.swal)this.spit(e,false);burst(e.x,e.y,'#ff4a1a',24,160,3,20);rings.push({x:e.x,y:e.y,r:6,max:80,life:.5,col:'#ff4a1a'});this.pm({k:'fx',x:Math.round(e.x),y:Math.round(e.y),c:'#ff4a1a',r:80});
    if(B.t0<0){B.t0=time;msg(`${e===B.boss?TYPES[e.k].n:'분신'}이(가) 쓰러졌습니다 — ${B.win}초 안에 나머지도!`,'#ff9a6a')}return true},
  mgTick(B){if(B.done||B.t0<0)return;if(!B.mem.some(o=>o.down)){B.t0=-1;return}
    if(time-B.t0<=B.win)return;B.t0=-1;let n=0;
    for(const o of B.mem)if(o.down){o.down=0;o.gone=false;o.hp=Math.round(o.max*.4);o.aggroed=true;if(!enemies.includes(o))enemies.push(o);n++;rings.push({x:o.x,y:o.y,r:6,max:100,life:.6,col:'#ff4a1a'})}
    if(n)msg(`너무 늦었습니다 — 쓰러진 ${n}이(가) 다시 일어섭니다`,'#ff5a3a')},
  /* ---- 처치: 협동 처치 · 쌍둥이 준보스 ---- */
  preKill(e){const t=TYPES[e.k]||{};
    if(t.boss&&!e.clone){const c=new Set(),q=this.cur;if(q&&q.e===e&&q.h0>e.hp){const C=e.cd||(e.cd=new Map());C.set(q.k,(C.get(q.k)||0)+q.h0-Math.max(0,e.hp));q.h0=e.hp}if(e.cd)for(const [k,v] of e.cd)if(v>=e.max*.05)c.add(k);if(e.cs)for(const k of e.cs)c.add(k);
      e.co=c.size>=2?[...c].map(k=>this.netId(k)):null}
    if(t.mini&&DG&&DG.d&&DG.d.minis&&DG.d.minis.includes(e.k)){const T=DG.tw||(DG.tw={});T[e.k]=time;const o=DG.d.minis.find(k=>k!==e.k);if(o&&T[o]!=null&&time-T[o]<=10&&!DG.twDone){DG.twDone=1;e.tw=1}}},
  myCo(e){if(e&&e.co)return e.co.includes(NET.on?NET.id:0);return this.kco},
  /* ---- 메시지 ---- */
  pm(o){if(NET.on&&NET.host)netSend(Object.assign({t:'pm'},o))},
  onPm(m){if(!NET.guest||m.from!==NET.hostId)return;
    if(m.k==='sw'){if(P.dead)return;P.swal={eid:m.e,t:(m.d||4)+1};msg('삼켜졌습니다! 동료가 배를 때리면 풀려납니다','#ff6a5a')}
    else if(m.k==='sp'){if(P.swal){P.swal=null;const a=R()*6.283;moveBody(P,Math.cos(a)*90,Math.sin(a)*90);msg('풀려났습니다','#9fe39a')}}
    else if(m.k==='fx'){rings.push({x:m.x,y:m.y,r:8,max:m.r||100,life:.6,col:m.c||'#ffd34d'});burst(m.x,m.y,m.c||'#ffd34d',24,160,3,20)}},
  snap(e){if(!e.boss)return 0;return[Math.round(e.stg||0),+(e.brk||0).toFixed(1),(e.gsh?1:0)|(e.clone?2:0)|(e.swal?4:0),+(e.bc||0).toFixed(2)]},
  unsnap(e,a){if(Array.isArray(a)){e.aggroed=true;e.stg=a[0]||0;e.brk=a[1]||0;e.gsh=!!(a[2]&1);e.clone=!!(a[2]&2);e.swalF=!!(a[2]&4);e.bc=a[3]||0}else{e.stg=0;e.brk=0;e.gsh=false;e.swalF=false;e.bc=0}},
  /* ---- 한 명 지원 마법: 대상 고르기 ---- */
  valid(r){return !!r&&!r.dead&&netSame(r)},
  sel(id){const r=id?NET.peers.get(id):null;this.tgt=r?id:0;if(r)msg(`지원 대상: ${r.name||'동료'} (「한 명」 마법이 이 동료에게 갑니다 · Tab으로 바꾸기)`,'#9fe0ff');else if(id!==0)msg('지원 대상을 풀었습니다 (「한 명」 마법은 나에게)','#a39d8f');PUI.tick(true)},
  cycle(){if(!NET.on)return;const L=[...NET.peers.values()].filter(r=>this.valid(r)).sort((a,b)=>dist(a,P)-dist(b,P));if(!L.length){this.sel(null);return}
    const i=L.findIndex(r=>r.id===this.tgt);if(i<0)this.sel(L[0].id);else if(i+1<L.length)this.sel(L[i+1].id);else this.sel(null)},
  // 이번 시전이 갈 동료 (없으면 null = 나)
  pick(){if(!NET.on||!this.tgt)return{r:null};const r=NET.peers.get(this.tgt);if(!r){this.tgt=0;return{r:null}}
    if(r.dead)return{r:null,why:`${r.name||'동료'}님이 쓰러져 있어 나에게 걸었습니다`};if(!netSame(r))return{r:null,why:`${r.name||'동료'}님이 다른 곳에 있어 나에게 걸었습니다`};
    if(dist(r,P)>this.RANGE)return{r:null,why:`${r.name||'동료'}님이 멀어(${this.RANGE} 밖) 나에게 걸었습니다`};return{r}},
  castTag(id,o){const s=SPELLS[id];if(!s||!s.one||GHOST)return;const R=this.pick();if(R.r)o.tg=R.r.id},
  // 내가 고른 동료에게 건다 (효과 표시 · 기억 · 위협). 실제 효과는 그 동료의 화면에서(cast 메시지의 tg)
  give(s,id,pwr,r){const col=EL[s.el]||EL.holy;FXB.push(s,r,PUI.has(r,s));PUI.mark(r,s);
    beams.push({x1:P.x,y1:P.y,x2:r.x,y2:r.y,z:30,w:5,life:.3,max:.3,col,el:s.el,rank:1});burst(r.x,r.y,col,16,90,3,20);
    msg(`${s.n} → ${r.name||'동료'}`,col);this.support(0,P,s,pwr)},
};
/* ---- 「한 명」 마법 표시 · 수치 ---- */
for(const id in PTY.ONE){const s=SPELLS[id];if(!s)continue;const o=PTY.ONE[id];for(const k in o)if(k!=='_d')s[k]=o[k];s.one=1;delete s.party;
  let d=String(s.desc||'');for(const [a,b] of o._d||[])d=d.replace(a,b);d=d.replace(/\s*파티원에게도 걸립니다\.?/,'').replace(/\s*나에게만\.?/,'').trim();s.desc=d+' 「한 명」: 고른 동료 한 명에게 겁니다(고르지 않았거나 멀면 나에게).'}
/* ---- 기존 함수에 덧붙이기 ---- */
{const _sc=updateEnemies;updateEnemies=function(dt){for(const e of enemies)if(e.ps==null)PTY.scale(e);_sc(dt);PTY.tick(dt)};
 const _et=enemyTarget;enemyTarget=function(e){const o=_et(e);if(NET.guest)return o;let want=null;
   const tn=e.tnt;if(tn&&tn.t>time){const p=PTY.who(tn.k);if(PTY.okTg(p))want=p}
   if(!want&&PTY.partyMode()&&e.thr&&e.thr.size){const T=PTY.top(e);if(T.k!=null){const cur=e.ttk,cv=cur!=null&&e.thr.has(cur)&&PTY.okTg(PTY.who(cur))?e.thr.get(cur):-1;
     const k=cv>=0&&T.v<=cv*PTY.SW?cur:T.k;want=PTY.who(k);e.ttk=k}}
   if(!want){if(o.tg&&o.tg.swal){let b=null,bd=1e9;for(const p of netPlayers()){if(p.swal)continue;const d=dist(e,p);if(d<bd){bd=d;b=p}}return b?{tg:b,d:bd}:{tg:o.tg,d:1e9}}return o}
   if(o.tg&&o.tg.ally&&o.d<160&&o.d<dist(e,want)-30)return o;return{tg:want,d:dist(e,want)}};
 const _he=hurtE;hurtE=function(e,amt,s){if(!e||e.dead||(s&&s.ghost))return _he(e,amt,s);if(e.down)return;
   if(NET.guest)return _he(e,amt,s);const h0=e.hp,q0=PTY.cur;PTY.cur={e,k:0,h0};try{_he(e,amt*PTY.dmgMul(e,0),s)}finally{PTY.cur=q0}const d=h0-e.hp;if(d>0&&!e.qa)PTY.onDmg(e,0,d,s)};
 const _af=applyFx;applyFx=function(e,s,from){if(e&&!e.dead&&!e.down&&s&&!NET.guest){if(s.taunt)PTY.taunt(e,GHOST?GHOST.id:0,s.taunt);if(!s.ghost)PTY.stagFx(e,s)}return _af(e,s,from)};
 const _ke=killE;PTY._ke=_ke;killE=function(e){if(e.dead)return;if(!NET.guest){if(PTY.mgDown(e))return;PTY.preKill(e)}return _ke(e)};
 const _rk=rewardKill;rewardKill=function(e){const n=PTY.partyN();PTY.xpK=n>1?1+PTY.XP*(n-1):1;try{return _rk(e)}finally{PTY.xpK=1}};
 const _gx=gainXp;gainXp=function(n){if(PTY.xpK>1&&P.lvl<MAXLV){n=Math.max(1,Math.round(n*PTY.xpK));if(time-PTY.xpT>4){PTY.xpT=time;ftext(P.x-18,P.y,`파티 보너스 +${Math.round((PTY.xpK-1)*100)}%`,'#9fe0ff',false,74)}}return _gx(n)};
 const _bd=dgBossDrop;dgBossDrop=function(e){_bd(e);const t=TYPES[e.k]||{},L=e.lvl||1,drop=it=>loot.push({x:e.x+rnd(-50,50),y:e.y+rnd(-50,50),kind:'item',item:it,t:0});
   if(t.boss&&PTY.myCo(e)){drop(makeItem(L,true,null,R()<.1?'boss':R()<.2?'uniq':R()<.25?'set':null));msg('협동 처치! 전리품을 한 번 더 굴렸습니다','#9fe0ff')}
   if(t.mini&&(e.tw||PTY.ktw)){loot.push({x:e.x,y:e.y+30,kind:'gold',amt:L*40,t:0});drop(makeItem(L+1,true,null,R()<.15?'uniq':R()<.2?'set':null));drop(makeItem(L+1,true));
     rings.push({x:e.x,y:e.y,r:10,max:140,life:.9,col:'#ffd76a'});burst(e.x,e.y,'#ffd76a',50,220,3,20);banner={t:'쌍둥이 준보스 협동 보너스',sub:'10초 안에 둘을 함께 쓰러뜨려 보너스 상자가 열렸습니다',col:'#ffd76a',life:2.6,max:2.6};msg('보너스 상자: 준보스 둘을 함께 쓰러뜨렸습니다','#ffd76a')}};
 const _ok=netOnKill;netOnKill=function(m){PTY.kco=!!(m.co&&m.co.includes(NET.id));PTY.ktw=!!m.tw;try{return _ok(m)}finally{PTY.kco=false;PTY.ktw=false}};
 const _om=netOnMsg;netOnMsg=function(m){if(!m)return;
   if(m.t==='pm'){PTY.onPm(m);return}
   if(m.t==='dmg'&&NET.host){const e=enemies.find(o=>o.id===m.id);if(e&&!e.dead){if(e.down)return;m.a=Math.round(m.a*PTY.dmgMul(e,m.from));const h0=e.hp,q0=PTY.cur;PTY.cur={e,k:m.from,h0};try{_om(m)}finally{PTY.cur=q0}const d=h0-e.hp;if(d>0)PTY.onDmg(e,m.from,d,{threat:m.th||1});return}}
   return _om(m)};
 const _sf=supFx;supFx=function(s,id,pwr,from){
   if(GHOST){if(s&&s.one&&PTY.ghostTg!=null)return;return _sf(s,id,pwr,from)}
   if(!from&&s){if(s.taunt&&!NET.guest)PTY.tauntAround(0,P.x,P.y,260,s.taunt);
     if(s.one){const T=PTY.pick();if(T.r){PTY.give(s,id,pwr,T.r);return}if(T.why)msg(T.why,'#a39d8f')}
     PTY.support(0,P,s,pwr)}
   return _sf(s,id,pwr,from)};
 const _ng=netGhostCast;netGhostCast=function(m){const s0=SPELLS[m.sp],r=NET.peers.get(m.from);PTY.ghostTg=s0&&s0.one&&m.tg!=null?m.tg:null;
   try{_ng(m)}finally{PTY.ghostTg=null}
   if(!s0||!r||!netSame(r)||r.dead)return;
   if(s0.one&&m.tg!=null){const col=EL[s0.el]||EL.holy;
     if(m.tg===NET.id){if(!P.dead&&dist(r,P)<=PTY.RANGE+200){const s=eff(m.sp,m.L||1);supFx(s,m.sp,m.pw||power(),r);burst(P.x,P.y,col,14,80,3,30);beams.push({x1:r.x,y1:r.y,x2:P.x,y2:P.y,z:30,w:5,life:.3,max:.3,col,el:s0.el,rank:1})}}
     else{const o=NET.peers.get(m.tg);if(o&&netSame(o)&&!o.dead){FXB.push(s0,o,PUI.has(o,s0));beams.push({x1:r.x,y1:r.y,x2:o.x,y2:o.y,z:30,w:5,life:.3,max:.3,col,el:s0.el,rank:1})}}}
   if(NET.host&&(PUI.SUPK.has(s0.kind)||s0.one))PTY.support(r.id,r,s0,m.pw);
   if(NET.host&&s0.taunt&&!['nova','melee','cone','leap','charge'].includes(s0.kind))PTY.tauntAround(r.id,r.x,r.y,260,s0.taunt)};
 // 삼켜진 동안: 보스 배 속에 붙어 있고 마법을 못 쓴다
 const _tc=tryCast;tryCast=function(id,t){if(P.swal&&!GHOST){if(P.noMpT<=0){msg('삼켜져서 마법을 쓸 수 없습니다','#ff6a5a');P.noMpT=1}return}return _tc(id,t)};
 const _up=update;update=function(dt){_up(dt);
   if(P.swal){const sw=P.swal,e=sw.e||enemies.find(o=>o.id===sw.eid);if(sw.t!=null)sw.t-=dt;if(!e||e.dead||P.dead||(sw.t!=null&&sw.t<-1)){P.swal=null}else{P.x=e.x;P.y=e.y+2}}
   const pl=PTY.pull;if(pl){pl.t-=dt;const e=pl.e,d=dist(P,e);if(pl.t<=0||e.dead||d<e.r+P.r+24)PTY.pull=null;else moveBody(P,(e.x-P.x)/d*260*dt,(e.y-P.y)/d*260*dt)}};
 // HUD: 대상 칸 아래 무너짐 게이지와 상태
 const _uh=updateHud;updateHud=function(){_uh();PTY.hud()};
 const _dl=drawV5Labels;drawV5Labels=function(){_dl();PTY.draw()};
}
PTY.hud=function(){const box=document.getElementById('target');if(!box||box.hidden)return;
  let hv=hover;if(!hv){let bd=760;for(const e of enemies)if(e.big&&e.aggroed&&!e.dead){const d=dist(e,P);if(d<bd){bd=d;hv=e}}}
  let g=this.hudEl;if(!g||!g.isConnected){g=this.hudEl=document.createElement('div');g.className='stgb';g.innerHTML='<i></i>';box.appendChild(g)}
  if(!hv||!hv.boss){g.hidden=true;return}g.hidden=false;const brk=hv.brk>0,w=brk?100:clamp(hv.stg||0,0,100);g.firstChild.style.width=w.toFixed(0)+'%';g.classList.toggle('brk',brk);
  const tags=[];if(brk)tags.push(`무너짐 ${Math.ceil(hv.brk)}초 · 받는 피해 +30%`);const T0=TYPES[hv.k]||{};if(hv.gsh)tags.push(T0.gshN||'보호막: 근위병을 쓰러뜨리세요');if(hv.bc>0)tags.push(`${T0.bcN||'「재의 폭풍」'} 외우는 중 — 끊으세요`);if(hv.swal||hv.swalF)tags.push('삼킴: 배를 때리세요');
  if(hv.clone)document.getElementById('tname').textContent+=' 분신';
  const ts=document.getElementById('tsub');if(ts&&tags.length)ts.textContent+=' · '+tags.join(' · ')};
PTY.draw=function(){S();ctx.textAlign='center';
  for(const e of enemies){if(!e.boss||e.dead||!e._s)continue;const s=e._s;if(!onScreen(s,120))continue;const sc=e.sc||1,top=s.y-(TYPES[e.k]?TYPES[e.k].r:20)*sc*2.4-14;
    if(e.gsh){ctx.globalCompositeOperation='lighter';FXB.img(ctx,FXB.bubble('#c6b4ff'),s.x,s.y-e.r*sc*.9,e.r*sc*3.2,e.r*sc*3.2,.55+.1*Math.sin(time*4));ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}
    if(e.bc>0){const T0=TYPES[e.k]||{},bn=T0.bcN||'「재의 폭풍」',w=90,k=clamp(1-e.bc/(T0.bcM||2),0,1);ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(s.x-w/2-1,top-1,w+2,8);ctx.fillStyle='#ff7a3a';ctx.fillRect(s.x-w/2,top,w*k,6);
      ctx.font=`700 13px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(bn,s.x,top-6);ctx.fillStyle='#ffb07a';ctx.fillText(bn,s.x,top-6)}
    else if(e.brk>0){ctx.font=`800 15px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('무너짐!',s.x,top);ctx.fillStyle='#ffd34d';ctx.fillText('무너짐!',s.x,top)}
    else if(e.swal||e.swalF){ctx.font=`700 13px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('삼킴 — 배를 때리세요',s.x,top);ctx.fillStyle='#c8f08a';ctx.fillText('삼킴 — 배를 때리세요',s.x,top)}}
  // 지원 대상으로 고른 동료: 발밑 금빛 고리 + 머리 위 표식
  if(NET.on&&this.tgt){const r=NET.peers.get(this.tgt);if(r&&r._s&&!r.dead&&netSame(r)){const s=r._s,far=dist(r,P)>this.RANGE;ctx.globalAlpha=far?.5:1;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.6)';ctx.beginPath();ctx.ellipse(s.x,s.y,25,11,0,0,6.283);ctx.stroke();
    ctx.lineWidth=2;ctx.strokeStyle='#ffd76a';ctx.beginPath();ctx.ellipse(s.x,s.y,25,11,0,0,6.283);ctx.stroke();
    const y=s.y-98+2*Math.sin(time*4);ctx.fillStyle='#ffd76a';ctx.beginPath();ctx.moveTo(s.x-7,y-8);ctx.lineTo(s.x+7,y-8);ctx.lineTo(s.x,y);ctx.closePath();ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle='rgba(0,0,0,.7)';ctx.stroke();ctx.globalAlpha=1}}
  if(P.swal&&!P.dead&&P._s){const s=P._s;ctx.font=`700 13px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('삼켜짐!',s.x,s.y-90);ctx.fillStyle='#ff6a5a';ctx.fillText('삼켜짐!',s.x,s.y-90)}};
/* 화면의 동료를 누르면 지원 대상으로 고른다 (마법은 나가지 않음) · Tab으로 돌아가며 고르기 */
cv.addEventListener('pointerdown',e=>{if(!NET.on||!NET.peers.size)return;const b=cv.getBoundingClientRect(),x=(e.clientX-b.left)/CZ,y=(e.clientY-b.top)/CZ;
  for(const r of NET.peers.values()){if(!r._s||r.dead||!netSame(r))continue;const s=r._s;if(Math.abs(x-s.x)<24&&y>s.y-92&&y<s.y+8){e.stopImmediatePropagation();e.preventDefault();PTY.sel(PTY.tgt===r.id?null:r.id);return}}},{capture:true});
addEventListener('keydown',e=>{if(e.code!=='Tab'||e.altKey||e.ctrlKey||e.metaKey)return;if(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName))return;const it=document.getElementById('intro');if(it&&!it.hidden)return;
  e.preventDefault();if(e.shiftKey)PTY.sel(null);else PTY.cycle()});
{const st=document.createElement('style');st.textContent=`#target .stgb{height:4px;margin:2px auto 0;background:#241c0c;border:1px solid #6a5020;overflow:hidden}#target .stgb i{display:block;height:100%;background:#d8a830}#target .stgb.brk i{background:#ffe066}
#pframes .pf[data-pid]{cursor:pointer}#pframes .pf.sel{border-color:#ffd76a;box-shadow:0 0 0 1px #ffd76a inset}#pframes .pf .ptg{color:#ffd76a;font-size:10px;margin-left:auto}`;document.head.appendChild(st)}
/* 같이 하기 · 던전 함께 들어가기 (v18 고침): 예전에는 방장의 'dg'(던전 자료)·'dgexit'와 참가자의 상태(st)를 그리기 루프(netTick)에서만 보냈다.
   창이 뒤로 가거나 가려지면(requestAnimationFrame 멈춤) 방장은 던전에 들어갔는데 참가자는 'dg'를 못 받아 밖에 남고,
   참가자는 들어갔는데 방장 화면에는 옛 지역으로 남아 보이지 않았다. → 들어가고 나오는 순간 바로 보내고, 참가자는 방장이 던전에 있다는 몬스터 줄을 받으면 스스로 던전 자료를 다시 청한다. */
function netAreaNow(){if(!NET.on||!NET.host)return;const a=netArea();if(a!==netLastArea){if(a>=0)netSend({t:'dg',d:netDgData()});else if(netLastArea>=0)netSend({t:'dgexit'});netLastArea=a;netSendState()}}
{const _ed=enterDungeon;enterDungeon=function(c){const r=_ed(c);netAreaNow();return r};
 const _ld=leaveDungeon;leaveDungeon=function(){const r=_ld();if(NET.on){if(NET.host)netAreaNow();else netSendState()}return r};
 const _ne=netEnterDg;netEnterDg=function(D){const r=_ne(D);if(NET.on&&DG)netSendState();return r};
 const _fr=netFollowReg;netFollowReg=function(a,x,y){const r=_fr(a,x,y);if(r&&NET.on)netSendState();return r};
 const _rs=netReset;netReset=function(){netLastArea=-99;return _rs()};
 const _as=netApplySnap;netApplySnap=function(m){if(NET.guest&&m&&m.a>=0&&(!DG||netArea()!==m.a)&&performance.now()-(PTY.dgAsk||-1e9)>1500){PTY.dgAsk=performance.now();netSend({t:'req',to:NET.hostId,a:'dungeon'})}return _as(m)}}
window.__pty=PTY;
