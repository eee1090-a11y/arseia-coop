/* ---------- v22 COOP: 파티 던전 함께 들어가기 (사용자 07:13 「파티원이 던전에 들어가면 나만 들어가지고 파티원은 못 들어가」) ----------
   v18은 「창이 뒤로 가서 그리기 루프가 멈춘 경우」만 고쳤다. 남은 원인과 고침:
   1) 연결이 잠깐 끊기면(휴대폰에서 다른 앱으로 갔다 오기 · 화면 꺼짐 · 와이파이↔데이터 · 새로 고침) 참가자는 혼자 하기로 돌아가고,
      다시 연결돼도 파티에 들어가지 않았다(안내는 대화창 한 줄뿐). 그 뒤 방장이 던전에 들어가면 참가자는 따라오지 않았다.
      → 끊기기 전 파티를 기억해(창 안 sessionStorage 'arseia-coop-rj', 5분) 다시 연결되면 저절로 같은 파티로 돌아간다(방장이 끊겼으면 방장이 방을 다시 연다).
        돌아오면 방장이 던전 자료를 보내 던전 안으로 바로 들어온다(net.js 'peer').
   2) 참가자의 「들어가자」 요청을 방장이 못 들어줄 때(방장이 다른 지역 · 쓰러짐 · 봉인 · 레벨 · 3막 문 · 미궁 · 메아리 거울) 아무 말 없이 버렸다.
      → 다른 지역이면 방장이 그 지역으로 건너가 함께 들어가고, 못 들어가면 이유를 참가자에게 보낸다(co22n).
   3) 참가자가 따라오지 못하면(자료를 못 읽음 · 창이 멈춤 · 옛 판 게임) 둘 다 몰랐다.
      → 참가자는 받았는지 알리고(co22a), 방장은 5초 안에 안 들어온 동료와 이유를 화면에 띄운다.
        참가자 화면에는 「○○님이 ○○에 들어갔어요 · 함께 들어가기」 알림(한 번 누르면 들어감).
   4) 옛 판 게임(새로 고침 안 한 창)과는 던전 자료가 맞지 않을 수 있다 → 판 번호를 주고받아(co22v) 알려 준다.
   메시지는 모두 'v20x'(옛 판은 모르는 k를 무시) + 기존 'req'·'dg'. 서버는 그대로. 저장 형식 그대로(캐릭터 저장소는 건드리지 않음). */
const CO22={V:22,RJ:'arseia-coop-rj',RJMS:5*60e3,rj:null,rjT:-1e9,rjSaveT:0,ver:new Map(),stAt:new Map(),peerAt:new Map(),fail:new Map(),bye:new Set(),oldTold:new Set(),
  fol:null,hostDg:null,hA:-9,hAt:-1e9,miss:0,ask:null,why:'',pr:null,prMute:-1e9,cap:null,qa:false,lastA:-9,FOLMS:5000,ASKMS:6000};
const co22Now=()=>performance.now();
function co22Store(){if(window.__QA)return;try{sessionStorage.setItem(CO22.RJ,JSON.stringify(CO22.rj||{}))}catch(_){}}
if(!window.__QA){try{const o=JSON.parse(sessionStorage.getItem(CO22.RJ)||'{}');if(o&&o.t&&Date.now()-o.t<CO22.RJMS)CO22.rj=o}catch(_){}}
const co22Who=id=>{const r=NET.peers.get(id);return r&&r.name||'동료'};
// 방장이 한 동료에게만 알림 (옛 판은 무시)
function co22Tell(to,s,k){v20Send('co22n',{s:String(s).slice(0,180),kd:k||''},to)}
V20NET.co22n=m=>{if(typeof m.s!=='string'||!m.s)return;const s=m.s.slice(0,180);const f=m.kd==='fail';msg(s,f?'#ffb07a':'#9fe0ff');chatSys(s,f?'#ffb07a':'#9fe0ff');if(f){CO22.ask=null;CO22.why=s}};
V20NET.co22v=m=>{CO22.ver.set(m.from,m.v|0)};
V20NET.co22in=m=>{if(m.from===NET.hostId&&typeof m.n==='string')CO22.hostDg={n:m.n.slice(0,40),a:m.a|0}};
V20NET.co22bye=m=>{CO22.bye.add(m.from);if(NET.guest&&m.from===NET.hostId){CO22.rj=null;co22Store()}};
V20NET.co22a=m=>{if(!NET.host)return;const id=m.from;if(m.ok){CO22.fail.delete(id);const F=CO22.fol;if(F&&F.told.has(id)&&(m.a|0)===F.a){F.told.delete(id);msg(`${co22Who(id)}님이 던전에 들어왔습니다`,'#9fe0ff')}return}
  const s=typeof m.s==='string'&&m.s?m.s.slice(0,120):'던전 자료를 읽지 못했습니다';CO22.fail.set(id,s);msg(`${co22Who(id)}님이 던전에 들어오지 못했습니다 · ${s}`,'#ffb07a')};
// 함수가 띄운 안내를 모아 둔다 (방장이 못 들어간 이유를 참가자에게 그대로 전하려고)
{const _m=msg;msg=function(t,c){if(CO22.cap)CO22.cap.push(String(t));return _m.apply(this,arguments)}}
function co22Try(f){const keep=CO22.cap;CO22.cap=[];const dg0=DG;let err=null;try{f()}catch(e){err=e;if(window.__QA)throw e}const got=CO22.cap;CO22.cap=keep;
  const ok=!!DG&&DG!==dg0,why=err?err.message:(got.filter(t=>!/이끕니다|가자고/.test(t)).pop()||'');return{ok,why}}
// 요청한 동굴 찾기: 지역 + 던전 id(있으면) 또는 번호
function co22Cave(m){const rg=REGIONS[m.rg]?m.rg:'home',L=rg===REG.id?CAVES:rg==='home'?HOME.caves:(RCACHE[rg]||{}).caves;if(!L)return null;
  if(typeof m.cid==='string'){const c=L.find(o=>o.cave&&o.cave.id===m.cid);if(c)return c}return Number.isInteger(m.c)?L[m.c]||null:null}
/* ---- 방장: 참가자의 「던전에 들어가자」 ---- */
function co22HostReq(m){const who=co22Who(m.from);
  if(DG){netSend({t:'dg',to:m.from,d:netDgData()});const w=m.c!=null?co22Cave(m):null;if(w&&w.cave!==DG.d)co22Tell(m.from,`방장이 이미 「${DG.d.n}」 안에 있어 그곳으로 함께 들어갑니다`);return}
  const c=co22Cave(m);
  if(!c){if(m.c!=null||m.cid!=null)co22Tell(m.from,'방장 화면에서 그 던전을 찾지 못했습니다 · 두 사람 모두 새로 고침(F5)해 같은 판인지 확인해 주세요','fail');return}// 동굴 없는 요청(자동 다시 청하기)은 방장이 막 나왔을 때도 오므로 조용히
  if(P.dead){co22Tell(m.from,'방장이 쓰러져 있어 지금은 들어갈 수 없습니다 · 방장이 일어선 뒤 다시 눌러 주세요','fail');msg(`${who}님이 「${c.cave.n}」에 가자고 합니다 · 일어선 뒤 함께 들어가세요`,'#ffb07a');return}
  const rg=REGIONS[m.rg]?m.rg:'home';
  if(rg!==REG.id&&typeof w3Hell==='function'&&w3Hell(rg)){const b=w3BlockReg(rg);if(b){co22Tell(m.from,'방장 쪽 봉인: '+b,'fail');msg(`${who}님이 ${REGIONS[rg].n}의 던전으로 가자고 했지만 닫혀 있습니다 · ${b}`,'#ffb07a');return}}
  msg(`${who}님이 「${c.cave.n}」(으)로 이끕니다`,'#ff9a6a');
  const T=co22Try(()=>{if(rg!==REG.id)switchRegion(rg,c.x,c.y+80,true);enterDungeon(c)});
  if(!T.ok&&!DG)co22Tell(m.from,`방장이 「${c.cave.n}」에 들어가지 못했습니다${T.why?' · '+T.why:''}`,'fail')}
/* ---- 방장: 오르타 · 3막 문 · 메아리 거울 요청도 못 들어주면 이유를 보낸다 ---- */
for(const k of ['mzreq','dmgate','b4req']){const f=V20NET[k];if(typeof f!=='function')continue;
  V20NET[k]=(m,r)=>{if(!NET.host)return f(m,r);if(DG){netSend({t:'dg',to:m.from,d:netDgData()});co22Tell(m.from,`방장이 이미 「${DG.d.n}」 안에 있어 그곳으로 함께 들어갑니다`);return}
    const T=co22Try(()=>f(m,r));if(!T.ok&&!DG)co22Tell(m.from,`방장이 들어가지 못했습니다${T.why?' · '+T.why:''}`,'fail')}}
/* ---- 참가자: 동굴 앞 F → 방장에게 (시험의 방 포함 · 던전 id를 같이 보낸다) ---- */
{const _da=doAct;doAct=function(){if(NET.on&&NET.guest&&act==='dungeon'&&actCave&&actCave.cave){const c=actCave,o={t:'req',to:NET.hostId,a:'dungeon',c:CAVES.indexOf(c),rg:REG.id,cid:c.cave.id};
    netSend(o);CO22.ask={t:co22Now(),n:c.cave.n,m:o};CO22.why='';msg(`방장에게 「${c.cave.n}」에 함께 들어가자고 했습니다`,'#9fe0ff');return}
  return _da()}}
// 3막 봉인된 문: 참가자 쪽 의뢰로는 닫혀 있어도 방장 쪽 의뢰로 열리면 들어간다(방장이 판단)
setTimeout(()=>{try{for(const g of DM21GATES){if(!g.D||g.co22)continue;const _go=g.go;g.co22=1;g.go=function(){if(NET.on&&NET.guest){v20Send('dmgate',{g:g.id});msg('방장에게 같이 들어가자고 했습니다','#9fe0ff');return}return _go.apply(this,arguments)}}}catch(_){}},0);
/* ---- 참가자: 받은 던전 자료로 들어갔는지 방장에게 알림 · 못 들어가면 알림 창 ---- */
{const _ne=netEnterDg;netEnterDg=function(D){let err=null,r;try{r=_ne.apply(this,arguments)}catch(e){err=e;if(window.__QA)throw e}
  if(NET.on&&NET.guest){if(DG){CO22.ask=null;CO22.why='';CO22.miss=0;co22Prompt(null);v20Send('co22a',{ok:1,a:netArea()},NET.hostId)}
    else{const s=err?'던전 자료 오류: '+String(err.message).slice(0,80):'던전 자료를 읽지 못했습니다 (판이 다를 수 있음 · 새로 고침)';CO22.why=s;v20Send('co22a',{ok:0,s},NET.hostId)}}
  return r}}
{const _as=netApplySnap;netApplySnap=function(m){if(NET.guest&&m&&typeof m.a==='number'){CO22.hA=m.a;CO22.hAt=co22Now()}return _as.apply(this,arguments)}}
/* ---- 메시지: 연결 · 파티 드나듦 ---- */
{const _om=netOnMsg;netOnMsg=function(m){if(!m)return _om(m);
  if(m.t==='req'&&NET.host&&m.a==='dungeon'){co22HostReq(m);return}
  if(m.t==='st'&&m.from!=null)CO22.stAt.set(m.from,co22Now());
  const leaveName=m.t==='leave'&&NET.peers.has(m.id)?co22Who(m.id):null,wasOn=NET.on;
  const r=_om(m);
  if(m.t==='joined'&&NET.on)co22Joined();
  else if(m.t==='peer'&&NET.on){CO22.peerAt.set(m.id,co22Now());v20Send('co22v',{v:CO22.V},m.id)}
  else if(leaveName){msg(CO22.bye.has(m.id)?`${leaveName}님이 파티에서 나갔습니다`:`${leaveName}님의 연결이 끊겼습니다 · 다시 이어지면 저절로 파티로 돌아옵니다`,'#ffb07a');CO22.bye.delete(m.id);CO22.ver.delete(m.id)}
  else if(m.t==='hostgone'&&wasOn&&CO22.rj)msg('방장의 연결이 끊겼습니다 · 방장이 다시 들어오면 저절로 파티로 돌아갑니다','#ffb07a');
  return r}}
function co22Joined(){const re=!!(CO22.rj&&CO22.rj.drop);const H=NET.lobby.find(o=>o.id===NET.hostId);
  CO22.rj={host:NET.host,hid:NET.hostId,hn:NET.host?netName():(H?H.n:(CO22.rj&&CO22.rj.hn)||''),t:Date.now()};co22Store();
  CO22.ver.clear();CO22.fail.clear();CO22.bye.clear();CO22.oldTold.clear();CO22.peerAt.clear();CO22.lastA=-9;CO22.fol=null;
  v20Send('co22v',{v:CO22.V});if(re)msg(NET.host?'연결이 다시 이어져 파티를 다시 열었습니다':'연결이 다시 이어져 파티로 돌아왔습니다','#9fe0ff')}
// 일부러 나가면 다시 잇지 않는다 · 끊겨서 혼자가 되면 기억해 둔다
{const _nl=netLeave;netLeave=function(){if(NET.on)v20Send('co22bye',{});CO22.rj=null;co22Store();co22Prompt(null);return _nl.apply(this,arguments)}}
{const _nr=netReset;netReset=function(){if(NET.on&&CO22.rj){CO22.rj.t=Date.now();CO22.rj.drop=1;co22Store()}co22Prompt(null);CO22.ask=null;CO22.hA=-9;return _nr.apply(this,arguments)}}
/* ---- 알림 창: 「○○님이 ○○에 들어갔어요 · 함께 들어가기」 ---- */
function co22Prompt(o){let el=document.getElementById('co22p');if(!o){if(el)el.hidden=true;CO22.pr=null;return}
  if(!el){el=document.createElement('div');el.id='co22p';document.body.appendChild(el)}
  CO22.pr=o;el.hidden=false;el.innerHTML=`<p><b>${esc(o.t)}</b></p>${o.s?`<p class="co22s">${esc(o.s)}</p>`:''}<div class="row"><button class="primary" type="button" id="co22go">함께 들어가기</button><button class="ghost" type="button" id="co22x">닫기</button></div>`;
  el.querySelector('#co22go').onclick=()=>co22Go();el.querySelector('#co22x').onclick=()=>{CO22.prMute=co22Now();co22Prompt(null)}}
function co22Go(){if(!NET.on||!NET.guest){co22Prompt(null);return false}const o=CO22.pr&&CO22.pr.m||{t:'req',to:NET.hostId,a:'dungeon'};o.to=NET.hostId;netSend(o);
  CO22.ask={t:co22Now(),n:CO22.pr&&CO22.pr.n||'던전',m:o};CO22.miss=co22Now();if(typeof PTY==='object')PTY.dgAsk=co22Now();co22Prompt(null);msg('방장의 던전으로 함께 들어가는 중…','#9fe0ff');return true}
{const st=document.createElement('style');st.textContent=`#co22p{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 132px);transform:translateX(-50%);width:max-content;max-width:calc(100% - 32px);box-sizing:border-box;background:rgba(14,12,10,.94);border:1px solid #ff9a6a;border-radius:4px;padding:10px 14px;z-index:31;pointer-events:auto;color:#e8e2d2;text-align:center;box-shadow:0 4px 18px rgba(0,0,0,.6)}
#co22p p{margin:0 0 6px}#co22p .co22s{color:#c9c1ad;font-size:12px}#co22p .row{justify-content:center;gap:8px}#co22p button{min-height:36px}`;document.head.appendChild(st)}
const co22InGame=()=>{const it=document.getElementById('intro');return !!P&&(!it||it.hidden)};
const co22DgName=a=>CO22.hostDg&&CO22.hostDg.a===a?CO22.hostDg.n:'던전';
/* ---- 0.5초마다: 방장(따라왔는지) · 참가자(알림 창) · 끊긴 뒤 다시 잇기 ---- */
function co22Tick(now){
  if(!NET.on){co22Rejoin(now);return}
  if(CO22.rj&&now-CO22.rjSaveT>5000){CO22.rjSaveT=now;CO22.rj.t=Date.now();co22Store()}
  // 옛 판 동료 알림 (8초 안에 판 번호가 안 오면 한 번)
  for(const r of NET.peers.values()){const t0=CO22.peerAt.get(r.id)||(CO22.peerAt.set(r.id,now),now);
    if(!CO22.ver.has(r.id)&&now-t0>8000&&!CO22.oldTold.has(r.id)){CO22.oldTold.add(r.id);const s=`${r.name||'동료'}님의 게임이 예전 판입니다 · 새로 고침(F5)해야 던전에 함께 들어가기가 잘 됩니다`;msg(s,'#ffb07a');chatSys(s,'#ffb07a')}}
  if(NET.host){const a=netArea();
    if(a!==CO22.lastA){CO22.lastA=a;CO22.fol=a>=0&&DG?{a,t:now,told:new Set(),n:DG.d.n}:null;if(CO22.fol){CO22.fail.clear();v20Send('co22in',{n:DG.d.n,a})}}
    const F=CO22.fol;if(F&&now-F.t>CO22.FOLMS){for(const r of NET.peers.values()){if(!r.name&&!r.seen)continue;if(r.area===F.a||F.told.has(r.id)||now-(CO22.peerAt.get(r.id)||-1e9)<CO22.FOLMS)continue;F.told.add(r.id);
      const st=CO22.stAt.get(r.id),why=CO22.fail.get(r.id)||(st==null||now-st>3000?'창이 꺼져 있거나 연결이 멈춘 것 같습니다 (그 화면을 다시 켜면 저절로 들어옵니다)':!CO22.ver.has(r.id)?'예전 판 게임입니다 (새로 고침 필요)':'던전 자료를 받는 중입니다');
      const s=`${r.name||'동료'}님이 아직 「${F.n}」에 따라오지 못했습니다 · ${why}`;msg(s,'#ffb07a');chatSys(s,'#ffb07a');netSend({t:'dg',to:r.id,d:netDgData()})}}}
  else if(NET.guest){const hA=CO22.hA,fresh=now-CO22.hAt<2500,me=netArea();
    if(fresh&&hA>=0&&me!==hA&&!P.dead){if(!CO22.miss)CO22.miss=now;
      if(now-CO22.miss>CO22.FOLMS&&!CO22.pr&&now-CO22.prMute>20000){const n=co22DgName(hA);co22Prompt({t:`${co22Who(NET.hostId)}님이 「${n}」에 들어갔어요`,s:CO22.why||'저절로 따라가지 못했습니다. 아래 단추를 누르면 함께 들어갑니다',n})}}
    else{CO22.miss=0;if(CO22.pr&&!CO22.pr.m&&(me===hA||hA<0))co22Prompt(null)}
    const q=CO22.ask;if(q&&!DG&&now-q.t>CO22.ASKMS){CO22.ask=null;if(!CO22.pr)co22Prompt({t:`방장이 「${q.n}」 요청에 아직 답하지 않았습니다`,s:'방장 창이 꺼져 있거나 연결이 느립니다. 다시 눌러 보세요',n:q.n,m:q.m})}
    if(DG&&CO22.pr)co22Prompt(null)}}
// 끊겼다가 다시 연결되면 같은 파티로 (참가자: 같은 방장의 방이 있으면 참가 · 방장: 방이 없으면 다시 열기)
function co22Rejoin(now){const R=CO22.rj;if(!R||!R.t)return;if(Date.now()-R.t>CO22.RJMS){CO22.rj=null;co22Store();return}
  if(!NET.ws||NET.ws.readyState!==1||NET.pendInv||now-CO22.rjT<4000||!co22InGame())return;
  if(R.host){if(NET.roomHost)return;CO22.rjT=now;R.drop=1;netConnect(true);return}
  const H=NET.lobby.find(o=>o.id===NET.roomHost);if(!H||!(H.id===R.hid||(R.hn&&H.n===R.hn)))return;CO22.rjT=now;R.drop=1;msg(`연결이 다시 이어졌습니다 · ${H.n}님의 파티로 돌아갑니다`,'#9fe0ff');netConnect(false)}
setInterval(()=>{if(window.__QA&&!CO22.qa)return;try{co22Tick(co22Now())}catch(e){if(window.__QA)throw e}},500);
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{CO22,co22Tick,co22Go,co22Prompt,co22HostReq,co22Cave,co22Rejoin})}catch(_){}},0);
