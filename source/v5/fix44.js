/* ---------- v44: 파티 던전 따라 들어가기 (사용자 2026-10-24 「여전히 친구랑 파티 도중에 던전 안들어가져」 「따라오지 못했다는 메시지가 뜨면서 자료를 받는 중이라는 말만 떠」
   「다른 두 곳과 네트워크에서 접속한 사람이 같이 들어갈 수 있도록 해」) ----------
   찾은 것:
   1) 방장이 던전에 들어가면 곧바로 던전 자료를 보내고, 0.5초마다 도는 확인이 「새 던전」을 알아챌 때 그때까지 받은 동료의 실패 이유를 모두 지웠다.
      서로 먼 곳(인터넷 지연 0.05~0.5초)에서는 동료의 「못 들어갔습니다 · 이유」 답이 그 사이에 도착해 지워지고, 5초 뒤 방장 화면에는 늘 「던전 자료를 받는 중입니다」만 떴다.
      → 방장이 던전 자료를 보낸 뒤에 온 실패 이유는 지우지 않는다.
   2) 동료 쪽에서 던전 자료를 받다가 바깥 단계(지역 불러오기 · 던전 찾기)에서 오류가 나면 방장에게 아무 답도 가지 않았다.
      → 받은 던전 자료 처리 전체를 감싸서, 오류든 못 찾음이든 반드시 방장에게 이유를 보내고 동료 화면에도 띄운다(지역 · 던전 · 그 화면의 던전 수까지).
   3) 동료가 한 번 못 들어가면 방장이 5초 뒤 한 번만 다시 보냈다. → 동료 쪽이 받은 자료로 1.5초 간격으로 두 번 더 스스로 들어가 본다(방장이 아직 그 던전에 있을 때만).
   4) 두 사람의 게임 판이 다르면(한쪽이 창을 오래 켜 두어 예전 판) 알 수 없었다. → 판 번호를 주고받고, 다르면 두 화면에 알린다.
   메시지 모양은 그대로(옛 판과도 맞음). 저장은 건드리지 않는다. */
const F44={V:(typeof PATCHES!=='undefined'&&PATCHES[0]&&PATCHES[0].v)|0,dgT:-1e9,hf:new Map(),last:null,lastA:-9,tries:0,tryT:0,RETRYMS:1500,MAXTRY:2,ver:new Map(),told:new Set(),why:'',cap:null,inRetry:0,from:null};
const f44Area=D=>{try{if(!D||D.ci==null)return -2;const rg=REGIONS[D.reg]?D.reg:'home';return D.ci+(rg==='home'?0:100+REG_IDS.indexOf(rg)*4)}catch(_){return -9}};
/* ---- 방장: 던전 자료를 보낸 때를 기억 · 그 뒤에 온 실패 이유는 지우지 않는다 ---- */
{const _ns=netSend;netSend=function(m){if(m&&m.t==='dg'&&NET.host)F44.dgT=co22Now();return _ns.apply(this,arguments)}}
{const _a=V20NET.co22a;V20NET.co22a=function(m){if(NET.host&&m&&m.from!=null){if(m.ok)F44.hf.delete(m.from);else F44.hf.set(m.from,{s:typeof m.s==='string'&&m.s?m.s.slice(0,120):'던전 자료를 읽지 못했습니다',t:co22Now(),c:typeof m.c==='string'?m.c:null})}return _a.apply(this,arguments)}}
{const _t=co22Tick;co22Tick=function(now){const f0=CO22.fol;const r=_t.apply(this,arguments);
  const F=CO22.fol;if(NET.host&&F&&F!==f0)for(const [id,o] of F44.hf)if((o.c?!!(DG&&DG.d&&DG.d.id===o.c):o.t>=F44.dgT)&&!CO22.fail.has(id))CO22.fail.set(id,o.s);
  return r}}
/* ---- 참가자: 받은 던전 자료 처리 전체를 감싼다 · 못 들어가면 반드시 이유를 방장에게 ---- */
function f44Why(D,err){if(err)return '던전 자료 오류: '+String(err&&err.message||err).slice(0,80);
  try{const rg=REGIONS[D&&D.reg]?D.reg:'home',L=rg===REG.id?CAVES:rg==='home'?HOME.caves:(RCACHE[rg]||{}).caves||[];
    const hit=D&&typeof D.cid==='string'?L.findIndex(c=>c.cave&&c.cave.id===D.cid):-1;
    return `던전 자료를 읽지 못했습니다 (지역 ${REGIONS[rg]?REGIONS[rg].n:rg} · 던전 ${D&&D.cid||'?'} ${hit>=0?'있음':'없음'} · 번호 ${D&&D.ci} / ${L.length}) · 두 사람 모두 새로 고침(F5)해 주세요`}
  catch(_){return '던전 자료를 읽지 못했습니다 (판이 다를 수 있음 · 새로 고침)'}}
function f44Fail(s,quiet,D){CO22.why=s;const same=s===F44.why;F44.why=s;if(quiet&&same)return;
  if(NET.on&&NET.guest){const o=Object.assign({ok:0,s},D&&typeof D.cid==='string'?{c:D.cid}:{});v20Send('co22a',o,NET.hostId);if(F44.from!=null&&F44.from!==NET.hostId)v20Send('co22a',o,F44.from)}
  msg(s,'#ffb07a');chatSys(s,'#ffb07a');
  // 친구 화면: 「함께 들어가기」를 눌러도 아무 일도 없는 것처럼 보이지 않게, 이유를 알림 창에 그대로 띄운다(다시 누를 수 있음)
  if(NET.on&&NET.guest&&!DG)co22Prompt({t:'방장의 던전에 함께 들어가지 못했습니다',s:s+' · 아래 단추로 다시 해 보세요',n:D&&D.cid||'던전'})}
// 안쪽(coop22)이 보내는 짧은 실패 답은 잠시 붙잡았다가 자세한 이유 하나로 바꿔 보낸다(방장 화면에 두 줄이 뜨지 않게)
{const _vs=v20Send;v20Send=function(k,o,to){if(F44.cap&&k==='co22a'&&o&&!o.ok){F44.cap.push(o);return}return _vs.apply(this,arguments)}}
{const _ne=netEnterDg;netEnterDg=function(D){const guest=NET.on&&NET.guest;if(!guest)return _ne.apply(this,arguments);let r,err=null;const retry=F44.inRetry;
  if(D&&typeof D==='object'){if(D!==F44.last){F44.last=D;F44.tries=0;F44.why=''}F44.lastA=f44Area(D);F44.tryT=co22Now()}
  const keep=F44.cap;F44.cap=[];try{r=_ne.apply(this,arguments)}catch(e){err=e}finally{F44.cap=keep}
  if(NET.on&&NET.guest){if(DG){F44.why='';F44.tries=F44.MAXTRY}else f44Fail(f44Why(D,err),retry,D)}
  if(err&&window.__QA&&!F44.qa)throw err;return r}}
{const _om=netOnMsg;netOnMsg=function(m){if(!(m&&m.t==='dg'&&NET.guest))return _om.apply(this,arguments);F44.from=m.from;
  try{return _om.apply(this,arguments)}catch(e){if(window.__QA)throw e;if(!DG)f44Fail(f44Why(m.d,e),false,m.d)}}}
/* ---- 참가자: 방장이 아직 그 던전에 있으면 받은 자료로 두 번 더 들어가 본다 ---- */
function f44Retry(now){if(!NET.on||!NET.guest||DG||!F44.last||F44.tries>=F44.MAXTRY||!P||P.dead)return false;
  if(now-F44.tryT<F44.RETRYMS)return false;const fresh=now-CO22.hAt<2500;if(!fresh||CO22.hA<0||CO22.hA!==F44.lastA)return false;
  F44.tries++;const D=F44.last;F44.tryT=now;F44.inRetry=1;try{netEnterDg(D)}catch(e){if(window.__QA)throw e}finally{F44.inRetry=0}return !!DG}
// 「함께 들어가기」를 누르면 스스로 다시 들어가기도 처음부터(방장에게 청하는 것과 함께)
{const _go=co22Go;co22Go=function(){const r=_go.apply(this,arguments);if(r){F44.tries=0;F44.why='';F44.tryT=-1e9}return r}}
/* ---- 판 번호: 다르면 두 화면에 알린다 ---- */
V20NET.f44v=m=>{const v=m.v|0;if(!v)return;F44.ver.set(m.from,v);if(v!==F44.V&&!F44.told.has(m.from)){F44.told.add(m.from);const r=NET.peers.get(m.from);
  const s=`${r&&r.name||'동료'}님의 게임은 v${v}, 내 게임은 v${F44.V}입니다 · 판이 다르면 던전에 함께 들어가기가 안 될 수 있으니 예전 판인 쪽이 새로 고침(F5)해 주세요`;msg(s,'#ffb07a');chatSys(s,'#ffb07a')}};
{const _om=netOnMsg;netOnMsg=function(m){const r=_om.apply(this,arguments);try{if(m&&NET.on&&(m.t==='joined'||m.t==='peer'))v20Send('f44v',{v:F44.V},m.t==='peer'?m.id:undefined)}catch(e){if(window.__QA)throw e}return r}}
setInterval(()=>{if(window.__QA&&!F44.qa)return;try{f44Retry(co22Now())}catch(e){if(window.__QA)throw e}},500);
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{F44,f44Retry,f44Why,netEnterDg,netOnMsg,co22Tick})}catch(_){}},0);
