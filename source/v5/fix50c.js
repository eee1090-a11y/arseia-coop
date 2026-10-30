/* ---------- v50 같이 하기: 방장 화면이 멈춰도 파티가 멈추지 않게 ----------
   사용자 2026-10-30 「친구랑 둘이 하려고 했더니 여전히 던전은 같이 들어가지지도 않고 파티하면 필드에 몹이 없어」
   원인: 몬스터와 던전은 방장 화면 하나가 계산한다. 방장 화면이 멈추면(휴대폰에서 다른 앱으로 · 화면 꺼짐 · PC 창 내림)
   참가자에게는 몬스터 소식도, 던전 열기 대답도 오지 않는다. 연결이 죽은 채 남은 창이 방장 자리를 잡고 있으면
   새로 「방 만들기」도 안 되어 둘 다 그 멈춘 방의 참가자가 된다(둘 다 몬스터 없음 · 던전 못 들어감).
   고침(server.js v50과 짝): 서버가 20초 멈춘 방장 자리를 움직이는 동료에게 넘기고(t:'host'), 말 없는 방장 자리는 「방 만들기」가 이어받는다.
   게임은 5초마다 살아 있음(hb)을 보내고, 판 번호 cv 50으로 「방장 넘기기를 안다」고 알린다.
   참가자는 방장 소식이 5초 끊기면 그 까닭을 알려 주고, 방장이 아닌 사람이 보낸 몬스터 · 던전 소식은 받지 않는다. 저장 값은 바꾸지 않는다. */
const F50={snapAt:0,told:0,joinAt:0,HB:5000,QUIET:5000};
function netMe(){netSend({t:'me',name:netName(),cls:P.cls,lvl:P.lvl,cv:50})}// v50: cv 50 = 방장 넘기기(t:'host')를 아는 게임
const f50Who=id=>{const r=NET.peers.get(id);if(r&&r.name)return r.name;const o=NET.lobby.find(x=>x.id===id);return o&&o.n||'동료'};
function f50Clear(){enemies=[];projs=projs.filter(p=>p.owner==='p');warns=[]}
function f50Host(m){if(!NET.on||m.id==null)return;const was=NET.host,me=m.id===NET.id,n=me?netName():(m.n||f50Who(m.id));
  NET.hostId=m.id;NET.host=me;NET.guest=!me;F50.snapAt=performance.now();F50.told=0;
  if(me&&!was){f50Clear();let s='방장 화면이 멈춰 내가 방장이 되었습니다 · 이제 내 화면이 몬스터를 움직입니다';
    if(DG&&DG.net){leaveDungeon();s+=' · 방장 던전은 닫혀 밖으로 나왔습니다'}netLastArea=-99;msg(s,'#9fe0ff');chatSys(s,'#9fe0ff')}
  else if(!me&&was){f50Clear();if(DG)leaveDungeon();const s=`자리를 비운 사이 ${n}님이 방장이 되었습니다 · 이제 ${n}님 화면이 몬스터를 움직입니다`;msg(s,'#9fe0ff');chatSys(s,'#9fe0ff')}
  else if(!me)chatSys(`${n}님이 방장이 되었습니다`,'#9fe0ff');
  try{CO22.hA=-9;if(CO22.rj){Object.assign(CO22.rj,{host:me,hid:m.id,hn:n,t:Date.now()});co22Store()}}catch(_){}
  netUI()}
{const _om=netOnMsg;netOnMsg=function(m){if(m&&m.t==='host'){f50Host(m);return}
  // 방장이 아닌 사람이 보낸 몬스터 · 던전 소식은 받지 않는다(멈췄다 돌아온 예전 방장 화면이 잠깐 보내는 것)
  if(m&&NET.guest&&NET.hostId&&m.from&&m.from!==NET.hostId&&(m.t==='snap'||m.t==='dg'||m.t==='dgexit'||m.t==='kill'))return;
  if(m&&m.t==='joined')F50.joinAt=performance.now();
  return _om.apply(this,arguments)}}
{const _as=netApplySnap;netApplySnap=function(){F50.snapAt=performance.now();if(F50.told){F50.told=0;msg('방장 화면에서 다시 소식이 옵니다','#9fe0ff')}return _as.apply(this,arguments)}}
// 참가자: 방장 소식이 끊기면 까닭을 알려 준다 (내 화면이 돌고 있을 때만)
function f50Quiet(now){if(!NET.on||!NET.guest)return;const t0=F50.joinAt?Math.max(F50.snapAt,F50.joinAt):F50.snapAt;
  if(!F50.snapAt&&!F50.joinAt||now-t0<F50.QUIET||F50.told)return;F50.told=1;
  const s=`방장 ${f50Who(NET.hostId)}님의 화면이 멈춘 것 같아요(휴대폰에서 다른 앱으로 넘어갔거나 화면이 꺼짐) · 그래서 몬스터가 안 보이고 던전이 안 열립니다. 20초 안에 돌아오지 않으면 내가 방장을 이어받아 몬스터가 다시 나옵니다`;
  msg(s,'#ffb07a');chatSys(s,'#ffb07a')}
// 끊겼다 다시 이어졌는데 그사이 같은 파티의 동료가 방장이 됐으면 그 파티로
{const _rj=co22Rejoin;co22Rejoin=function(now){const R=CO22.rj;
  if(R&&R.t&&R.host&&Array.isArray(R.pn)&&!NET.on&&NET.ws&&NET.ws.readyState===1&&!NET.pendInv&&now-CO22.rjT>=4000&&Date.now()-R.t<=CO22.RJMS&&co22InGame()){
    const H=NET.lobby.find(o=>o.id!==NET.id&&('h' in o?o.h:o.id===NET.roomHost)&&R.pn.includes(o.n));if(H){CO22.rjT=now;R.drop=1;R.host=false;R.hid=H.id;R.hn=H.n;msg(`연결이 다시 이어졌습니다 · 그사이 ${H.n}님이 방장이 되어 그 파티로 들어갑니다`,'#9fe0ff');netConnect(false,'',H.id);return}}
  return _rj.apply(this,arguments)}}
setInterval(()=>{try{if(NET.ws&&NET.ws.readyState===1)netSend({t:'hb'});
  if(NET.on&&CO22.rj){const pn=[...NET.peers.values()].map(r=>r.name).filter(Boolean).slice(0,8);if(pn.length)CO22.rj.pn=pn}}catch(e){if(window.__QA)throw e}},F50.HB);
setInterval(()=>{try{f50Quiet(performance.now())}catch(e){if(window.__QA)throw e}},500);
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{F50,f50Host,f50Quiet,zoneLevel,followCam,netLeave,netConnect,netMe,netOnMsg:m=>netOnMsg(m)})}catch(_){}},0);
