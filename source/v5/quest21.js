/* ---------- v21: 중요한 의뢰는 열리는 순간 알림 · 어디서든 받기 (사용자 04:07) ----------
   「2차 전직과 같은 중요한 퀘스트는 바로 알림이 와서 어디서든 수락해서 퀘스트를 시작할 수 있게 … 3차 전직도 마찬가지」
   · 중요한 의뢰 = 내 직업의 위계 시험 · 2차 전직 · 3차 전직(갈래 시험 포함). 받을 수 있게 되면(레벨이 닿고 앞 단계를 마침) 화면 위에 알림 카드가 뜬다.
   · 카드에서 「지금 받기」를 누르면 전직관에게 가지 않아도 바로 시작. 「내용 보기」는 전직관의 말과 보상을 그 자리에서 보여 준다. 「나중에」를 누르면 닫히고,
     알림판과 의뢰 일지(L) 맨 위 「중요한 의뢰」 칸에 남아 언제든 받을 수 있다. 전직관에게 직접 가서 받는 길도 그대로.
   · 고르는 의뢰(갈래 시험 둘)는 카드에 둘 다 보이고 하나를 고르면 다른 하나는 예전처럼 사라진다.
   · 저장에 새 값 없음(알림을 본 것은 이번 접속에서만 기억 → 다시 접속하면 아직 안 받은 중요한 의뢰를 한 번 더 알려 준다). */
const QIMP21=new Set(['위계 시험','전직','3차 전직','3차 전직 · 갈래']);
const QN21={seen:new Set(),t:0,el:null,ids:[],hideT:0,qa:false};
function qImp21(q){return !!(q&&P&&QIMP21.has(q.kind)&&q.cls===P.cls)}
function qImpList21(){if(!P||!P.cls)return[];return SQ.filter(q=>qImp21(q)&&P.lvl>=q.lvl&&sqAvail(q)==='ok').sort((a,b)=>(a.kind==='위계 시험')-(b.kind==='위계 시험')||b.lvl-a.lvl)} // 전직이 위계 시험보다 먼저
function qGiverText21(q){const g=sqFolk(q.giver),tw=ALLTOWNS.find(t=>t.id===q.town);return `${tw?tw.n:''}${g?' · '+g.n:''}${g&&g.room&&TWROOM[g.room]?` (${TWROOM[g.room].n} 안)`:''}`}
function qImpAccept21(id){const q=SQBY[id];if(!qImp21(q)||sqAvail(q)!=='ok'||P.lvl<q.lvl)return false;sqAccept(id);const ok=!!sqState().a[id];
  if(ok){msg(`어디서든 받기: ${q.t} · 끝내면 ${qGiverText21(q)}에게 돌아가세요`,'#ffd34d');qnClose21()}return ok}
function qnClose21(){if(QN21.el){QN21.el.remove();QN21.el=null}QN21.ids=[]}
function qnShow21(list){if(!list.length)return;qnClose21();const qa=window.__QA&&window.__QA.on;if(qa&&!QN21.qa)return;
  const el=document.createElement('div');el.id='qn21';
  const pick=list.length>1&&list.every(q=>q.pick||q.pick3);const more=pick?0:Math.max(0,list.length-2);if(more)list=list.slice().sort((a,b)=>(a.kind==='위계 시험')-(b.kind==='위계 시험')||b.lvl-a.lvl).slice(0,2);// 휴대폰에서도 카드가 길지 않게 두 개까지
  QN21.ids=list.map(q=>q.id);
  el.innerHTML=`<div class="qn-h">${pick?'갈래를 고를 수 있습니다':'중요한 의뢰가 열렸습니다'}</div>`+list.map(q=>`<div class="qn-q"><b>${q.t}</b> <span class="qn-k">${q.kind}</span><div class="qn-w">${qGiverText21(q)}의 의뢰 · 권장 레벨 ${q.lvl}</div>
    <div class="qn-b"><button type="button" data-qn="acc" data-id="${q.id}">${pick?'이 갈래 고르기':'지금 받기'}</button><button type="button" class="ghost" data-qn="see" data-id="${q.id}">내용 보기</button></div></div>`).join('')+
    (more?`<div class="qn-w">그 밖에 받을 수 있는 중요한 의뢰 ${more}개는 의뢰 일지(L) 맨 위에 있어요</div>`:'')+`<div class="qn-f"><span>전직관에게 직접 가서 받아도 됩니다</span><button type="button" class="ghost" data-qn="later">나중에</button></div>`;
  el.addEventListener('pointerdown',e=>e.stopPropagation());el.addEventListener('click',e=>{const b=e.target.closest('[data-qn]');if(!b)return;e.stopPropagation();const k=b.dataset.qn,id=b.dataset.id;
    if(k==='acc')qImpAccept21(id);else if(k==='see'){const q=SQBY[id],f=sqFolk(q.giver);qnClose21();SQV.mode='npc';SQV.npc=f;openPanel('quest')}else qnClose21()});
  document.body.appendChild(el);QN21.el=el;QN21.hideT=40;try{SFX&&SFX.item&&SFX.item(3,P)}catch(_){}}
// 1초마다 새로 열린 중요한 의뢰를 찾는다
function qnTick21(dt){if(!P||!P.cls||P.dead)return;if(typeof DG!=='undefined'&&DG){if(QN21.el)qnClose21();return}// 던전 · 미궁 · 보스방 안에선 알리지 않고 나온 뒤에 알림if(QN21.el&&(QN21.hideT-=dt)<=0)qnClose21();if((QN21.t-=dt)>0)return;QN21.t=1;
  const L=qImpList21(),fresh=L.filter(q=>!QN21.seen.has(q.id));for(const q of fresh)QN21.seen.add(q.id);
  if(QN21.el&&QN21.ids.some(id=>!L.find(q=>q.id===id)))qnClose21();
  if(fresh.length){const grp=fresh[0].pick||fresh[0].pick3?L.filter(q=>(q.pick||q.pick3)&&(q.req===fresh[0].req||String(q.reqs)===String(fresh[0].reqs))):fresh;qnShow21(grp)}}
{const _u=update;update=function(dt){const r=_u(dt);try{qnTick21(dt)}catch(_){}return r}}
// 캐릭터를 바꾸면 다시 알려 줌
{const _l=load;if(typeof _l==='function')load=function(){QN21.seen.clear();qnClose21();return _l.apply(this,arguments)}}
// 알림판: 아직 안 받은 중요한 의뢰를 맨 위에
{const _s=sqHudBlocks;sqHudBlocks=function(){const o=_s();const L=qImpList21();if(L.length)o.unshift({t:`! ${L.length>1&&L.every(q=>q.pick||q.pick3)?'갈래 시험 고르기':L[0].t}${L.length>1&&!L.every(q=>q.pick||q.pick3)?` 외 ${L.length-1}개`:''}`,w:qGiverText21(L[0]),g:[{s:'중요한 의뢰 · 의뢰 일지(L)에서 어디서든 받기',ok:false}],side:1});return o}}
// 의뢰 일지: 「중요한 의뢰」 칸 (받기 단추는 기존 data-sqacc 그대로)
{const _h=sqLogHtml;sqLogHtml=function(){const L=qImpList21();let h='';
  if(L.length)h=`<h2 style="color:#ffd34d">중요한 의뢰 · 어디서든 받기</h2>`+L.map(q=>`<div class="qlog"><b>${q.t}</b> <span class="muted">${q.kind} · ${qGiverText21(q)}</span><div class="muted">「${q.say}」</div>${sqGoalsHtml(q)}<div class="muted">보상: ${sqRwHtml(q)}</div><div class="row"><button type="button" data-sqacc="${q.id}">${q.pick||q.pick3?'이 갈래 고르기':'지금 받기'}</button></div></div>`).join('');
  return h+_h()}}
setTimeout(()=>{const st=document.createElement('style');st.textContent=`
#qn21{position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:45;width:min(380px,calc(100vw - 24px));box-sizing:border-box;padding:10px 12px;background:rgba(24,18,10,.96);border:1px solid #c8a050;border-radius:8px;color:#efe2c0;font-size:13px;line-height:1.4;box-shadow:0 6px 18px rgba(0,0,0,.5)}
#qn21 .qn-h{color:#ffd34d;font-weight:bold;margin-bottom:6px}
#qn21 .qn-q{padding:6px 0;border-top:1px solid #4a3d2a}
#qn21 .qn-k{color:#ffb04a;font-size:12px}
#qn21 .qn-w{color:#a39d8f;font-size:12px;margin:2px 0 6px}
#qn21 .qn-b{display:flex;gap:6px;flex-wrap:wrap}
#qn21 .qn-f{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px;color:#a39d8f;font-size:12px}
#qn21 button{font-size:13px;padding:5px 10px}`;document.head.appendChild(st)},0);
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{QN21,qImpList21,qImpAccept21})}catch(_){}},0);
