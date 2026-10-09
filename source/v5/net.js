/* ---------- 같이 하기 (로컬 서버) ---------- */
// 방장의 브라우저가 몬스터를 계산하고, 서버는 메시지만 전달한다.
// 각자 자기 마법은 자기 화면에서 계산하고, 참가자가 몬스터에 준 피해는 방장에게 보낸다.
// 처치 보상(경험치·전리품)은 각자 자기 화면에서 따로 굴린다. 저장은 각자의 브라우저에 그대로.
const NET={on:false,host:false,guest:false,ws:null,id:0,hostId:0,name:'',peers:new Map(),sendT:0,snapT:0,eid:0,area:-1,status:'',uiT:0,lobby:[],roomHost:0,want:null,pendInv:0,meT:0,meK:'',invs:[]};
let GHOST=null;// 다른 사람의 마법을 화면에만 다시 그리는 중이면 그 사람 객체
const netArea=()=>DG?(DG.ci==null?-2:DG.ci+(REG.id==='home'?0:100+REG_IDS.indexOf(REG.id)*4)):regArea();// v18: 지역 던전은 100+지역번호×4+동굴
const netSame=r=>r.area===netArea();
function netSend(o){if(NET.ws&&NET.ws.readyState===1)NET.ws.send(JSON.stringify(o))}
// 서버 주소로 들어오면 바로 접속해 둔다(접속자 목록 · 대화 · 초대). 방에 들어가야 같이 사냥한다.
function netName(){let n='';try{n=localStorage.getItem('arseia-coop-name')||''}catch(_){}return n||NET.name||(ACC&&ACC.name?ACC.name.slice(0,16):'')||(CLASSES[P.cls].n+' '+P.lvl)}
function netMe(){netSend({t:'me',name:netName(),cls:P.cls,lvl:P.lvl,cv:19})}// v19: cv=대화 채널을 아는 게임 (옛 서버는 무시)
function netOpenWs(){if(!window.COOP_SERVER||NET.ws)return;
  let ws;try{ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host)}catch(_){netStatus('서버에 연결할 수 없습니다');return}
  NET.ws=ws;
  ws.onopen=()=>{netMe();if(NET.want!=null){netSend({t:'join',name:netName(),host:NET.want});NET.want=null}};
  ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(_){return}netOnMsg(m)};
  ws.onclose=()=>{if(NET.ws!==ws)return;const was=NET.on;NET.ws=null;netReset();NET.lobby=[];NET.roomHost=0;netUI();
    netStatus(was?'연결이 끊겼습니다. 혼자 하기로 돌아왔습니다':'서버 연결이 끊겼습니다. 다시 연결하는 중…');if(was)msg('같이 하기 연결이 끊겼습니다','#ff9a6a');
    setTimeout(netOpenWs,3000)};
}
function netConnect(asHost,name){
  if(NET.on)return;
  name=(name||'').trim().slice(0,16);if(name){try{localStorage.setItem('arseia-coop-name',name)}catch(_){}}
  NET.name=netName();netStatus('연결하는 중…');
  if(NET.ws&&NET.ws.readyState===1){netMe();netSend({t:'join',name:NET.name,host:asHost})}else{NET.want=asHost;netOpenWs()}
}
function netReset(){const g=NET.guest;NET.on=NET.host=NET.guest=false;NET.peers.clear();NET.hostId=0;
  if(g){enemies=[];projs=projs.filter(p=>p.owner==='p');warns=[];if(DG&&DG.net)leaveDungeon()}netUI()}
function netLeave(silent){netSend({t:'part'});netReset();if(!silent){netStatus('혼자 하기로 돌아왔습니다');msg('파티에서 나왔습니다','#d6b262')}}
function netStatus(t){NET.status=t;netUI()}
function netPeer(id){let r=NET.peers.get(id);if(!r){r={id,remote:true,name:'',cls:'mage',x:0,y:0,tx:0,ty:0,face:0,moving:false,walk:0,hp:1,max:1,mp:0,mmax:1,lvl:1,gear:{},hurtT:0,dead:false,area:-9,r:12,seen:0};NET.peers.set(id,r)}return r}
function netOnMsg(m){
  switch(m.t){
  case'hello':NET.id=m.id;break;
  case'err':netStatus(m.msg);NET.pendInv=0;msg(m.msg,'#ff9a6a');break;
  case'who':NET.lobby=m.list||[];NET.roomHost=m.host;netUI();break;
  case'chat':chatAdd(m);break;
  case'inv':netInvGot(m);break;
  case'invr':chatSys(m.ok?`${m.n}님이 초대를 수락했습니다`:`${m.n}님이 초대를 거절했습니다`,m.ok?'#9fe0ff':'#a39d8f');break;
  case'joined':NET.on=true;NET.id=m.id;NET.hostId=m.host;NET.host=m.host===m.id;NET.guest=!NET.host;
    if(NET.guest){enemies=[];projs=projs.filter(p=>p.owner==='p');if(DG)leaveDungeon()}
    netStatus(NET.host?'방을 만들었습니다. 친구들이 참가하기를 누르면 들어옵니다':'방에 들어왔습니다');
    msg(NET.host?'파티를 만들었습니다':'파티에 들어왔습니다','#9fe0ff');netSendState();
    if(NET.pendInv){const o=NET.lobby.find(x=>x.id===NET.pendInv);netSend({t:'inv',to:NET.pendInv});chatSys(`${o?o.n+'님에게 ':''}파티 초대를 보냈습니다`,'#9fe0ff');NET.pendInv=0}NET.invs=[];invUI();break;
  case'peer':{const r=netPeer(m.id);r.name=m.name;chatSys(`${m.name}님이 파티에 들어왔습니다`,'#9fe0ff');netSendState();
    if(NET.host&&DG)netSend({t:'dg',to:m.id,d:netDgData()});netUI();break}
  case'leave':{const r=NET.peers.get(m.id);if(r)chatSys(`${r.name||'동료'}님이 파티에서 나갔습니다`,'#a39d8f');NET.peers.delete(m.id);netUI();break}
  case'hostgone':msg('방장이 나가서 혼자 하기로 돌아왔습니다','#ff9a6a');netReset();netStatus('방장이 나갔습니다');break;
  case'st':{const r=netPeer(m.from);const first=!r.seen;if(typeof m.lk==='string')r.lkGear=netLookParse(m.lk);Object.assign(r,{name:m.n,cls:m.c,tx:m.x,ty:m.y,face:m.f,moving:!!m.mv,hp:m.hp,max:m.mh,mp:m.mp,mmax:m.mm,lvl:m.l,dead:!!m.d,area:m.a,gear:r.lkGear||{robe:m.gr>=0?{rar:m.gr}:null,staff:m.gs>=0?{rar:m.gs}:null}});if(Array.isArray(m.bf)){r.bf=m.bf;r.bfT=time}
    if(m.h)r.hurtT=.25;if(first||Math.hypot(r.x-r.tx,r.y-r.ty)>300){r.x=r.tx;r.y=r.ty}r.seen=time;break}
  case'snap':if(NET.guest)netApplySnap(m);break;
  case'dmg':if(NET.host){const e=enemies.find(o=>o.id===m.id);if(e&&!e.dead){e.hp-=m.a;e.hurt=.12;e.aggroed=true;if(m.b)e.burn={t:3,dps:Math.max(1,m.a*.18)};
    ftext(e.x,e.y,m.a,m.c?'#ffd34d':'#d8e6ff',false,e.r*2+16);if(e.hp<=0)killE(e)}}break;
  case'fx':if(NET.host){const e=enemies.find(o=>o.id===m.id);if(e)applyFx(e,{slow:m.sl,freeze:m.fz,stun:m.sn,knock:m.k},m.fx!=null?{x:m.fx,y:m.fy}:null)}break;
  case'rez':if(m.to===NET.id&&P.dead){const r=NET.peers.get(m.from);P.dead=false;FXB.cast({kind:'rez',el:'holy',rank:9},P);P.hp=Math.max(1,Math.round(maxHp()*(m.p||.5)));P.mp=Math.max(P.mp,maxMp()*.3);P.invT=2;$('#death').hidden=true;
    rings.push({x:P.x,y:P.y,r:6,max:110,life:.9,col:'#ffe39a'});burst(P.x,P.y,'#fff2c0',50,180,3,30);msg(`${r?r.name:'동료'}님이 나를 되살렸습니다`,'#ffe39a')}break;
  case'hit':if(m.to===NET.id&&!P.dead){const src=enemies.find(o=>o.id===m.s);hitPlayer(m.d,src&&!src.dead?src:null)}break;
  case'kill':if(NET.guest)netOnKill(m);break;
  case'cast':netGhostCast(m);break;
  case'cst':case'chs':castNetMsg(m);break;// v17 시전·채널링 시작/끝 (옛 버전은 모르는 메시지라 무시)
  case'dg':if(NET.guest){netEnterDg(m.d)}break;
  case'reg':if(NET.guest&&m.from===NET.hostId)netFollowReg(m.id==='home'?-1:-(10+REG_IDS.indexOf(m.id)),m.x+rnd(-40,40),m.y+rnd(-40,40));break;
  case'dgexit':if(NET.guest&&DG){leaveDungeon();msg('파티가 던전을 나왔습니다','#d6b262')}break;
  case'req':if(NET.host){const r=NET.peers.get(m.from);
    if(m.a==='dungeon'){if(DG)netSend({t:'dg',to:m.from,d:netDgData()});else{const c=(m.rg||'home')===REG.id?CAVES[m.c]:null;if(c){msg(`${r?r.name:'동료'}님이 던전으로 이끕니다`,'#ff9a6a');enterDungeon(c)}}}
    else if(m.a==='reg'&&REGIONS[m.id]){msg(`${r?r.name:'동료'}님이 ${REGIONS[m.id].n}(으)로 이끕니다`,REGIONS[m.id].col);switchRegion(m.id,m.x,m.y)}
    else if(m.a==='exit'&&DG){msg(`${r?r.name:'동료'}님이 나가는 문을 열었습니다`,'#d6b262');leaveDungeon()}}break;
  }}
// 내 상태를 모두에게 (초당 15번)
// 장비 겉모습 코드(그림 전용): 바뀌었을 때와 2초마다만 보낸다. 예전 판은 이 칸을 무시한다.
const LK_SLOTS=['robe','staff','amulet','ring','off'];
function netLook(){const g=P.gear||{};return LK_SLOTS.map(k=>{const it=g[k];return it?[it.il|0,it.rar|0,it.set||'',it.wt||'',lookHash(it)].join('.'):''}).join('|')}
function netLookParse(s){const o={};s.split('|').slice(0,LK_SLOTS.length).forEach((v,i)=>{if(!v)return;const a=v.split('.');const r=Math.max(0,Math.min(5,+a[1]|0));o[LK_SLOTS[i]]={il:+a[0]|0,rar:r,set:a[2]||null,wt:a[3]||null,h:+a[4]|0}});return o}
let netLkLast='',netLkT=0;
function netSendState(){const g=P.gear||{};let lk;netLkT-=1;const cur=netLook();if(cur!==netLkLast||netLkT<=0){lk=netLkLast=cur;netLkT=30}netSend({t:'st',n:NET.name,c:P.cls,x:Math.round(P.x),y:Math.round(P.y),f:+P.face.toFixed(2),mv:P.moving?1:0,hp:Math.round(P.hp),mh:Math.round(maxHp()),mp:Math.round(P.mp),mm:Math.round(maxMp()),l:P.lvl,d:P.dead?1:0,a:netArea(),gr:g.robe?g.robe.rar:-1,gs:g.staff?g.staff.rar:-1,lk,h:P.hurtT>.2?1:0,bf:PUI.myBuffs()})}
// 방장: 몬스터 · 몬스터 투사체 · 경고 장판을 보낸다
function netSnap(){
  const en=[];for(const e of enemies){if(e.dead)continue;if(!e.id)e.id=++NET.eid;
    en.push([e.id,e.k,Math.round(e.x),Math.round(e.y),Math.round(e.hp),Math.round(e.max),e.lvl,e.elite?1:0,+e.r.toFixed(1),e.sc||0,e.boss||0,e.big||0,e.fx,
      +Math.max(0,e.freezeT).toFixed(2),+Math.max(0,e.stunT).toFixed(2),e.slowT>0?1:0,+e.lunge.toFixed(2),+(e.cast||0).toFixed(2),+(e.dash||0).toFixed(2),e.rage?1:0,e.burn?1:0,PTY.snap(e)])}
  const pr=projs.filter(p=>p.owner==='e').map(p=>[Math.round(p.x),Math.round(p.y),Math.round(p.vx),Math.round(p.vy),p.r,p.col,p.z|0,+p.life.toFixed(2)]);
  const wr=warns.filter(w=>!w.done).map(w=>[Math.round(w.x),Math.round(w.y),w.rad,+w.t.toFixed(2),w.max,w.col]);
  netSend({t:'snap',a:netArea(),en,pr,wr,bd:DG&&DG.bossDead?1:0});
}
function netApplySnap(m){
  if(m.a!==netArea()){
    if(m.a<0&&m.a!==-2&&!(m.a===-1&&DG)&&netFollowReg(m.a))return;
    if(m.a===-1&&DG){leaveDungeon();msg('파티가 던전을 나왔습니다','#d6b262');return}
    enemies=[];warns=[];projs=projs.filter(p=>p.owner==='p');
    if(m.a>=0&&!DG&&time-(NET.dgHint||-99)>20){NET.dgHint=time;msg(`방장이 ${((m.a<100?HOME:RCACHE[REG_IDS[(m.a-100)>>2]]||{caves:[]}).caves[m.a<100?m.a:(m.a-100)&3]||{cave:{n:'던전'}}).cave.n}에 있습니다. 그 동굴 입구에서 F를 누르면 합류합니다`,'#ff9a6a')}
    return}
  const by=new Map();for(const e of enemies)by.set(e.id,e);const out=[];
  for(const a of m.en){let e=by.get(a[0]);
    if(!e){e={id:a[0],k:a[1],x:a[2],y:a[3],anim:R()*10,hurt:0,net:1,wx:a[2],wy:a[3],dmg:0,atkCd:9,wt:0,burn:null}}
    Object.assign(e,{k:a[1],tx:a[2],ty:a[3],hp:a[4],max:a[5],lvl:a[6],elite:!!a[7],r:a[8],sc:a[9]||undefined,boss:a[10],big:a[11],fx:a[12],freezeT:a[13],stunT:a[14],slowT:a[15]?1:0,lunge:a[16],cast:a[17],dash:a[18],rage:a[19],burn:a[20]?{t:1,dps:0}:null,dead:false});PTY.unsnap(e,a[21]);
    if(Math.hypot(e.x-e.tx,e.y-e.ty)>220){e.x=e.tx;e.y=e.ty}
    if(DG&&e.big===2)DG.boss=e;out.push(e)}
  enemies=out;
  projs=projs.filter(p=>p.owner==='p').concat(m.pr.map(a=>({x:a[0],y:a[1],vx:a[2],vy:a[3],r:a[4],col:a[5],z:a[6],life:a[7],owner:'e',ghost:1,dmg:0})));
  warns=m.wr.map(a=>({x:a[0],y:a[1],rad:a[2],t:a[3],max:a[4],col:a[5],dmg:0}));
  if(DG&&m.bd)DG.bossDead=true;
}
// 참가자: 몬스터는 받은 위치로 부드럽게 따라간다
function netGuestEnemies(dt){for(const e of enemies){e.anim+=dt;e.hurt-=dt;if(e.tx!=null){const k=Math.min(1,dt*12);e.x+=(e.tx-e.x)*k;e.y+=(e.ty-e.y)*k}}}
function netDmg(e,amt,s,crit){const o={t:'dmg',to:NET.hostId,id:e.id,a:amt,c:crit?1:0,b:s&&s.burn?1:0};if(s&&s.threat)o.th=s.threat;netSend(o)}
function netFx(e,s,from){if(!(s.slow||s.freeze||s.stun||s.knock))return;netSend({t:'fx',to:NET.hostId,id:e.id,sl:s.slow?1:0,fz:s.freeze||0,sn:s.stun||0,k:s.knock||0,fx:from?Math.round(from.x):null,fy:from?Math.round(from.y):null})}
// 방장: 몬스터가 참가자를 때림
function netHit(r,d,src){netSend({t:'hit',to:r.id,d:Math.round(d),s:src&&src.id||0});r.hurtT=.25}
function netKill(e){if(!e.id)e.id=++NET.eid;const o={t:'kill',id:e.id,k:e.k,x:Math.round(e.x),y:Math.round(e.y),l:e.lvl,el:e.elite?1:0,a:netArea()};if(e.co)o.co=e.co;if(e.tw)o.tw=1;netSend(o)}
function netNear(o){return dist(P,o)<1400}
function netOnKill(m){const e=enemies.find(o=>o.id===m.id);
  if(e){e.dead=true;killFx(e);enemies=enemies.filter(o=>o!==e)}
  if(m.a===netArea()&&(TYPES[m.k].boss||TYPES[m.k].mini||!P.dead&&netNear(m)))rewardKill({k:m.k,x:m.x,y:m.y,lvl:m.l,elite:!!m.el,r:TYPES[m.k].r})}
// 방장이 아닌 사람 기준 위치: 월드에 있는 모든 플레이어
function netPlayers(){const a=[];if(!P.dead)a.push(P);if(NET.on)for(const r of NET.peers.values())if(!r.dead&&netSame(r))a.push(r);return a}
function netAnchor(){if(!NET.on)return P;const a=netPlayers().filter(o=>DG||!inSafe(o.x,o.y,10));return a.length?pick(a):P}
function netFar(e){if(!NET.on)return dist(e,P)>1500;for(const o of netPlayers())if(dist(e,o)<=1500)return false;return dist(e,P)>1500}
// 마법 시전 알리기 + 다른 사람의 마법을 화면에만 다시 그리기 (피해 없음)
function netCast(id,L,t,CM){const o={t:'cast',sp:id,L,x:Math.round(t.x),y:Math.round(t.y),pw:Math.round(power())};if(CM&&CM.tick)o.c=1;PTY.castTag(id,o);netSend(o)}
function netGhostCast(m){const r=NET.peers.get(m.from);if(!r||!netSame(r)||r.dead||paused)return;if(dist(r,P)>1600)return;
  const s0=SPELLS[m.sp];if(!s0)return;
  const px=r.proxy&&r.proxy.cls===s0.cls?r.proxy:(r.proxy=freshPlayer(s0.cls));
  px.x=r.x;px.y=r.y;px.face=r.face;px.lvl=r.lvl;px.sk={[m.sp]:m.L};px.mp=1e9;px.cd={};px.dead=false;px.gear={};
  const keep=P,nA=allies.length,nF=fields.length,nR=rains.length;GHOST=r;P=px;
  try{if(m.c)CAST_MOD=castGhostMod(m.sp,m.L);tryCast(m.sp,{x:m.x,y:m.y})}catch(err){NET.gerr=(NET.gerr||[]).concat(m.sp+': '+err.message).slice(-5)}finally{P=keep;GHOST=null;CAST_MOD=null}
  allies.length=Math.min(allies.length,nA);for(let i=nF;i<fields.length;i++){if(fields[i].s.self)fields[i].own=r;fields[i].by=r.id}castGhostTag(r,nR);
  r.face=px.face;
  // 파티 기도: 시전자 둘레에 있으면 나에게도 걸린다
  if(!P.dead){const d=dist(r,P);
    if(s0.party&&d<=s0.party&&['heal','hot','shield','buff','ward'].includes(s0.kind)){const s=eff(m.sp,m.L);supFx(s,m.sp,m.pw||power(),r);burst(P.x,P.y,EL[s0.el],14,80,3,30)}
    if(s0.atone&&d<=400)healP(Math.round(maxHp()*s0.atone*.5))}}
// 던전 맞추기
function netDgData(){return{reg:REG.id,ci:DG.ci,g:Array.from(DG.g),rooms:DG.rooms,ret:DG.ret,lvl:DG.lvl,portals:DG.portals,walls:DG.walls.map(w=>[w.i,w.j,w.h]),torches:DG.torches.map(t=>[t.x,t.y]),st:DG.rooms.indexOf(DG.start),bd:DG.bossDead?1:0}}
function netEnterDg(D){const rg=REGIONS[D.reg]?D.reg:'home';if(REG.id!==rg)loadRegion(rg);const c=CAVES[D.ci];if(!c)return;
  enemies=[];projs=projs.filter(p=>p.owner==='p');fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  DG={d:c.cave,ci:D.ci,net:1,g:D.g,rooms:D.rooms,ret:D.ret,lvl:D.lvl,flow:null,ft:-1,portals:D.portals,walls:[],torches:[],floor:[],bossDead:!!D.bd,boss:null,start:D.rooms[D.st]||D.rooms[0]};
  for(let j=0;j<DN;j++)for(let i=0;i<DN;i++)if(D.g[tIdx(i,j)]===1)DG.floor.push([i,j]);
  for(const [i,j,h] of D.walls){const c2=tc(i,j);DG.walls.push({x:c2.x,y:c2.y,i,j,wall:1,h})}
  for(const [x,y] of D.torches)DG.torches.push({x,y,light:150,torch:1});
  const p0=tc(DG.start.cx,DG.start.cy);P.x=p0.x+rnd(-30,30);P.y=p0.y+rnd(-30,30);for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}
  followCam();msg(`${c.cave.n}에 파티와 함께 들어섰습니다`,'#ff9a6a');banner={t:c.cave.n,sub:`던전 · 몬스터 레벨 ${D.lvl}~${D.lvl+2}`,col:'#ff9a6a',life:2.2,max:2.2}}
// 매 프레임
let netLastArea=-1;
function netTick(dt){
  NET.meT-=dt;if(NET.meT<=0){NET.meT=2;const k=P.cls+P.lvl+netName();if(k!==NET.meK){NET.meK=k;netMe()}}
  if(!NET.on)return;
  for(const r of NET.peers.values()){const k=Math.min(1,dt*12),dx=r.tx-r.x,dy=r.ty-r.y;r.x+=dx*k;r.y+=dy*k;if(Math.hypot(dx,dy)>1){r.walk+=dt*Math.min(1.6,Math.hypot(dx,dy)*.05+.6)}r.hurtT=Math.max(0,r.hurtT-dt)}
  NET.sendT-=dt;if(NET.sendT<=0){NET.sendT=1/15;netSendState()}
  if(NET.host){const a=netArea();if(a!==netLastArea){if(a>=0)netSend({t:'dg',d:netDgData()});else if(netLastArea>=0)netSend({t:'dgexit'});netLastArea=a}
    NET.snapT-=dt;if(NET.snapT<=0){NET.snapT=1/15;netSnap()}}
  NET.uiT-=dt;if(NET.uiT<=0){NET.uiT=.25;netParty()}}
// 다른 플레이어 그리기
function drawRemote(r){const s=r._s;if(!onScreen(s,120))return;
  drawFigure(ctx,r,s.x,s.y,PK,{bs:Math.max(1,DPR)*HS*PK});
  ctx.font='600 12px var(--body,sans-serif)';ctx.textAlign='center';const y=s.y-78*PK;
  ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(s.x-26,y+4,52,5);ctx.fillStyle=r.hp/r.max<.3?'#ff5a4a':'#5ee06a';ctx.fillRect(s.x-26,y+4,52*clamp(r.hp/r.max,0,1),5);
  ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.7)';ctx.strokeText(r.name,s.x,y);ctx.fillStyle='#9fe0ff';ctx.fillText(r.name,s.x,y)}
// 파티 창 + 같이 하기 창
function netParty(){let el=document.getElementById('party');
  if(!NET.on){if(el)el.remove();return}
  if(!el){el=document.createElement('div');el.id='party';document.body.appendChild(el)}
  let h='';for(const r of NET.peers.values()){const k=clamp(r.hp/r.max,0,1),away=!netSame(r);
    h+=`<div class="pm${r.dead?' dead':''}"><b>${esc(r.name||'동료')}</b><span>${CLASSES[r.cls]?CLASSES[r.cls].n:''} · Lv ${r.lvl}${r.id===NET.hostId?' · 방장':''}${away?' · 다른 곳':''}${r.dead?' · 쓰러짐':''}</span><i><u style="width:${k*100}%"></u></i></div>`}
  el.innerHTML=h||'<div class="pm"><span>아직 아무도 없습니다</span></div>'}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function netUI(){const box=document.getElementById('coopBody');if(!box)return;
  const st=`<p class="muted" id="coopSt">${esc(NET.status||'')}</p>`,others=NET.lobby.filter(o=>o.id!==NET.id),room=!!NET.roomHost;
  // 접속자 목록: 파티 중이면 표시, 초대할 수 있으면 초대 버튼
  const canInv=NET.on||!room;
  let lob='';for(const o of others){const inP=o.r,tag=inP?(o.id===NET.roomHost?'파티장':'파티 중'):'혼자';
    lob+=`<li><span>${esc(o.n)} · ${CLASSES[o.c]?CLASSES[o.c].n:''} Lv ${o.l} <em class="muted">${tag}</em></span>${!inP&&canInv?`<button class="ghost sm" type="button" data-inv="${o.id}">초대</button>`:''}</li>`}
  const lobby=`<h3>지금 접속한 사람 ${others.length?`(${others.length})`:''}</h3><ul class="lob">${lob||'<li class="muted">아직 아무도 없습니다. 친구에게 서버 주소를 보내 주세요.</li>'}</ul>`;
  if(NET.on){
    box.innerHTML=`<p>${NET.host?'내가 <b>파티장</b>입니다. 이 창을 닫아도 되지만 게임 창은 닫지 마세요. 몬스터 계산을 내 컴퓨터가 합니다.':'파티에 참가했습니다.'}</p>${lobby}${st}<div class="row"><button class="ghost" type="button" id="coopLeave">파티 나가기 (혼자 하기)</button></div>`;
    box.querySelector('#coopLeave').onclick=()=>netLeave()}
  else{box.innerHTML=`<p>같은 서버 주소로 들어온 친구와 함께 사냥합니다. 친구를 <b>초대</b>하면 내가 파티장이 됩니다.${room?' 이미 만들어진 파티가 있으니 <b>참가하기</b>를 누르세요.':''}</p>
    <label class="muted">내 이름 <input id="coopName" maxlength="16" value="${esc(netName())}" style="margin-left:6px"></label>${lobby}
    <div class="row" style="margin-top:10px">${room?'':'<button class="primary" type="button" id="coopHost">혼자 파티 만들기</button>'}${room?'<button class="primary" type="button" id="coopJoin">참가하기</button>':''}</div>${st}
    <p class="muted" style="font-size:12px">경험치와 전리품은 각자 따로 받고, 캐릭터는 각자의 브라우저에 저장됩니다. 던전은 파티가 함께 들어가고 함께 나옵니다. Enter 키로 대화합니다.</p>`;
    const nmI=box.querySelector('#coopName');nmI.onchange=()=>{const v=nmI.value.trim().slice(0,16);if(v){try{localStorage.setItem('arseia-coop-name',v)}catch(_){}NET.meK='';netMe()}};
    const h=box.querySelector('#coopHost');if(h)h.onclick=()=>netConnect(true,nmI.value);const j=box.querySelector('#coopJoin');if(j)j.onclick=()=>netConnect(false,nmI.value)}
  for(const b of box.querySelectorAll('[data-inv]'))b.onclick=()=>netInvite(+b.dataset.inv)}
// 파티 초대
function netInvite(id){const o=NET.lobby.find(x=>x.id===id);if(!o)return;
  if(NET.on){netSend({t:'inv',to:id});chatSys(`${o.n}님에게 파티 초대를 보냈습니다`,'#9fe0ff')}
  else if(!NET.roomHost){NET.pendInv=id;const i=document.getElementById('coopName');netConnect(true,i?i.value:'')}
  else netStatus('이미 다른 파티가 있습니다. 참가하기를 누르세요')}
function netInvGot(m){if(NET.on){netSend({t:'invr',to:m.from,ok:0});return}
  NET.invs=NET.invs.filter(v=>v.from!==m.from);NET.invs.push({from:m.from,n:m.n,t:performance.now()});chatSys(`${m.n}님이 파티에 초대했습니다`,'#ffd98a');invUI()}
function invUI(){let el=document.getElementById('invite');const now=performance.now();NET.invs=NET.invs.filter(v=>now-v.t<60000);
  if(!NET.invs.length||NET.on){if(el)el.remove();return}
  if(!el){el=document.createElement('div');el.id='invite';document.body.appendChild(el)}
  const v=NET.invs[NET.invs.length-1];
  el.innerHTML=`<p><b>${esc(v.n)}</b>님이 파티에 초대했습니다</p><div class="row"><button class="primary" type="button" id="invOk">수락</button><button class="ghost" type="button" id="invNo">거절</button></div>`;
  el.querySelector('#invOk').onclick=()=>{netSend({t:'invr',to:v.from,ok:1});NET.invs=[];invUI();netConnect(false)};
  el.querySelector('#invNo').onclick=()=>{netSend({t:'invr',to:v.from,ok:0});NET.invs=NET.invs.filter(x=>x!==v);invUI()};
  clearTimeout(invUI.tm);invUI.tm=setTimeout(invUI,60500)}
// 대화
const SAY=new Map();// 머리 위 말풍선 (그리기 전용, 저장 안 함)
function chatBox(){let el=document.getElementById('chat');if(el)return el;
  el=document.createElement('div');el.id='chat';el.innerHTML='<div id="chatLog"></div><input id="chatIn" maxlength="120" placeholder="Enter로 보내기 · Esc로 닫기" autocomplete="off" hidden>';document.body.appendChild(el);
  const i=el.querySelector('#chatIn');
  i.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&!e.isComposing){const x=i.value.trim();if(x){if(NET.ws&&NET.ws.readyState===1)netSend({t:'chat',x});else chatSys('서버에 연결되어 있지 않습니다','#ff9a6a')}i.value='';chatClose()}else if(e.key==='Escape')chatClose()});
  i.addEventListener('blur',()=>setTimeout(()=>{if(document.activeElement!==i&&!i.value)chatClose()},0));
  return el}
function chatOpen(){if(!window.COOP_SERVER)return;const el=chatBox(),i=el.querySelector('#chatIn');el.classList.add('open');i.hidden=false;keys.clear();mouse.l=mouse.r=false;i.focus()}
function chatClose(){const el=document.getElementById('chat');if(!el)return;const i=el.querySelector('#chatIn');el.classList.remove('open');i.hidden=true;i.blur()}
function chatLine(html){const log=chatBox().querySelector('#chatLog'),d=document.createElement('div');d.innerHTML=html;log.appendChild(d);
  while(log.children.length>40)log.firstChild.remove();log.scrollTop=log.scrollHeight;setTimeout(()=>d.classList.add('old'),12000)}
function chatAdd(m){const mine=m.from===NET.id;chatLine(`<b style="color:${mine?'#ffd98a':m.p?'#9fe0ff':'#c9c1ad'}">${esc(m.n)}</b> ${esc(m.x)}`);SAY.set(mine?0:m.from,{x:m.x,t:time})}
function chatSys(t,col){if(!window.COOP_SERVER){msg(t,col);return}chatLine(`<i style="color:${col||'#a39d8f'}">${esc(t)}</i>`)}
// 머리 위 말풍선
function drawSays(){if(!SAY.size)return;S();ctx.font='600 13px var(--body,sans-serif)';ctx.textAlign='center';ctx.textBaseline='middle';const put=[];
  for(const [id,v] of SAY){const age=time-v.t;if(age>5){SAY.delete(id);continue}
    const o=id===0?P:NET.peers.get(id);if(!o||o.dead||(o!==P&&!netSame(o)))continue;const s=o._s||W2S(o.x,o.y);
    let x=v.x.length>28?v.x.slice(0,27)+'…':v.x;const w=Math.min(260,ctx.measureText(x).width+16);let y=s.y-(o===P?96:100);for(let k=0;k<6&&put.some(q=>Math.abs(q[0]-s.x)<(q[2]+w)/2&&Math.abs(q[1]-y)<26);k++)y-=28;put.push([s.x,y,w]);
    ctx.globalAlpha=clamp((5-age)*2,0,1);ctx.fillStyle='rgba(14,12,10,.86)';ctx.strokeStyle='#8a7346';ctx.lineWidth=1;
    ctx.beginPath();ctx.roundRect?ctx.roundRect(s.x-w/2,y-12,w,24,5):ctx.rect(s.x-w/2,y-12,w,24);ctx.moveTo(s.x-5,y+12);ctx.lineTo(s.x,y+18);ctx.lineTo(s.x+5,y+12);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f0e6cc';ctx.fillText(x,s.x,y)}
  ctx.globalAlpha=1;ctx.textBaseline='alphabetic'}
function netOpen(){let m=document.getElementById('coop');
  if(!m){m=document.createElement('div');m.id='coop';m.innerHTML='<div class="card"><h2>친구와 같이 하기</h2><div id="coopBody"></div><div class="row" style="margin-top:8px"><button class="ghost" type="button" id="coopClose">닫기</button></div></div>';document.body.appendChild(m);
    m.querySelector('#coopClose').onclick=()=>{m.hidden=true}}
  m.hidden=false;netUI()}
// 캐릭터 내보내기 · 가져오기 (주소가 바뀌면 저장소도 바뀌므로, 글자 코드로 옮긴다)
function charCode(d){return 'ARSEIA1:'+btoa(unescape(encodeURIComponent(JSON.stringify(d))))}
function charDecode(s){s=String(s||'').trim();if(!s.startsWith('ARSEIA1:'))return null;try{return JSON.parse(decodeURIComponent(escape(atob(s.slice(8)))))}catch(_){return null}}
