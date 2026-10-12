
/* ---------- v28: 파티 「함께 들어가기」를 눌러도 안 들어가짐 (사용자 2026-10-12 03:22, 참가자 휴대폰 Lv82 · 방장 Lv25 · 재의 성소) ----------
   눌러도 아무 일이 없는 것처럼 보인 까닭: 방장 쪽 답(던전 자료)이 오지 않으면, 5초 뒤 같은 알림이 다시 떠 「답이 없다」는 안내(6초)를 늘 가렸다.
   고침: 1) 누른 뒤에는 답을 기다리는 동안 같은 알림을 다시 띄우지 않고, 6초 안에 답이 없으면 그 사실과 할 일을 알린다.
         2) 2.5초 안에 답이 없으면 같은 요청을 파티 전체로 한 번 더 보낸다(방장 번호가 바뀌었어도 방장이 받는다. 다른 참가자는 무시).
         3) 방장 쪽에서 던전 자료를 만들다 오류가 나면 이유를 참가자에게 보낸다.
         4) 던전 자료에 던전 id(cid)를 함께 실어, 참가자 쪽 던전 순서가 달라도 같은 던전으로 들어간다.
         5) 참가자가 자료를 받고도 못 들어가면 그 자리에서 이유를 화면에 띄운다.
   메시지 모양은 그대로(옛 판과도 맞음). 저장은 건드리지 않는다. */
const P28={BCMS:2500};
{const _go=co22Go;co22Go=function(){const r=_go.apply(this,arguments);const q=CO22.ask;
  if(r&&q){CO22.miss=co22Now()+CO22.ASKMS;// 답을 기다리는 동안 「함께 들어가기」를 다시 띄우지 않는다
    const f=()=>{if(CO22.ask===q&&!DG&&NET.on&&NET.guest){const o=Object.assign({},q.m);delete o.to;netSend(o)}};if(window.__QA)P28.bcF=f;else setTimeout(f,P28.BCMS)}
  return r}}
{const _pr=co22Prompt;co22Prompt=function(o){if(o&&typeof o.t==='string'&&/답하지 않았습니다/.test(o.t))o=Object.assign({},o,{s:'방장 창이 꺼져 있거나 연결이 느립니다. 다시 눌러 보세요 · 계속 안 되면 두 사람 모두 새로 고침(F5)한 뒤 파티를 다시 맺어 주세요'});return _pr(o)}}
{const _h=co22HostReq;co22HostReq=function(m){try{return _h(m)}catch(e){const s='방장 쪽 오류로 던전 자료를 보내지 못했습니다'+(e&&e.message?' · '+String(e.message).slice(0,80):'');co22Tell(m.from,s,'fail');msg(s,'#ffb07a')}}}
{const _nd=netDgData;netDgData=function(){const d=_nd();if(DG&&DG.d&&typeof DG.d.id==='string')d.cid=DG.d.id;return d}}
{const _ne=netEnterDg;netEnterDg=function(D){
  if(D&&typeof D.cid==='string'&&!D.a21&&!D.b4&&!D.j3){const rg=REGIONS[D.reg]?D.reg:'home';if(REG.id!==rg)loadRegion(rg);
    const i=CAVES.findIndex(c=>c.cave&&c.cave.id===D.cid);if(i>=0&&i!==D.ci)D=Object.assign({},D,{ci:i})}
  const r=_ne(D);if(NET.on&&NET.guest&&!DG&&CO22.why){msg(CO22.why,'#ffb07a');chatSys(CO22.why,'#ffb07a')}return r}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{P28,co22Go,co22HostReq,netDgData,netEnterDg})}catch(_){}},0);
