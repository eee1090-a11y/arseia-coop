/* ---------- v20 (CORE): 3차 전직 · 시스템 ----------
   기본 값은 job3d.js, 스킬 데이터는 job3d-mp.js · job3d-wa.js(다른 작업), 퀘스트 · 시험의 방 · 저장은 job3q.js.
   · P.job3: null | 3차 갈래 id (JOB3_OF[P.job2]). 100레벨에 전직 퀘스트를 마치면 정해진다. job3Ok(id): 그 갈래 스킬만 찍고 쓴다.
   · 3차 스킬은 최대 10점(skMax). 스킬 레벨은 b2.js의 skLv가 「한 점 = 피해 +12%」인 실제 레벨로 바꿔 준다(화면에는 skShow).
   · 공용 장치: 모으기 채널링(charge) · 무너짐 게이지 채우기(breakAdd/onBreak) · 파티 전체 무적·부활·버티기·치유(j3Party*) · 'j3x' 메시지.
   · 최고 레벨 140 · 100레벨부터 레벨마다 스킬 포인트 2점 · 3차 칭호 · 갈래 바꾸기(3차 뒤 20만 + (레벨-100)×5천). */
const J3_SPELLS=[];
const skMax=id=>isJ3(id)?J3_MAXSK:MAXSK;
const job3Ok=id=>{const s=SPELLS[id];return !s||!s.job3||s.job3===P.job3};
const job3Of=br=>{for(const c in JOB3)if(JOB3[c][br])return JOB3[c][br];return null};
const job3SwapPrice=()=>200000+Math.max(0,P.lvl-100)*5000;
// 스킬 손질: 요구 레벨 · 계열(문자열 'j3_갈래') · 칸 자리
for(const id in SPELLS){const s=SPELLS[id];if(!s.job3)continue;if(!JOB2_OF3[s.job3]){delete s.job3;continue}J3_SPELLS.push(id);
  s.upLv=J3_LV[clamp((s.rank|0)-20,0,J3_LV.length-1)];if(!s.kn)s.kn=s.n;TREE[id]='j3_'+s.job3;TREEPOS[id]={row:s.rank-1,col:0};delete s.job2}
J3_SPELLS.sort((a,b)=>SPELLS[a].rank-SPELLS[b].rank);
// 패시브: 지금 3차 갈래의 것만
for(const c in PASSIVES){const d=Object.getOwnPropertyDescriptor(PASSIVES,c),g=d&&d.get,v=d&&d.value;Object.defineProperty(PASSIVES,c,{configurable:true,enumerable:true,get(){const all=g?g():v;return P&&P.cls===c?all.filter(id=>job3Ok(id)):all}})}
// 배우기: 그 3차 갈래로 전직했을 때만, 10점까지
{const _cl=canLearn;canLearn=function(id){if(isJ3(id)&&(!job3Ok(id)||(P.sk[id]||0)>=J3_MAXSK))return false;return _cl(id)}}
// 불러오기: 3차 스킬 점수는 10점까지(넘는 만큼은 돌려받음)
{const _sl=skLoad;skLoad=function(dsk,cls,lvl){const r=_sl(dsk,cls,lvl);for(const k in r.sk)if(isJ3(k)&&r.sk[k]>J3_MAXSK){r.back+=r.sk[k]-J3_MAXSK;r.sk[k]=J3_MAXSK}return r}}
// 장비 「+3차 계열」 이름
{const _sn=statName;statName=function(k){if(typeof k==='string'&&k.startsWith('tr_j3_')){const j=job3Of(k.slice(6));return j?`${j.n} 계열 기술(3차)`:k}return _sn(k)}}
// 칭호: 3차 전직 뒤에는 3차 칭호
{const _jt=job2Title;job2Title=function(){if(P.job3&&JOB3[P.cls]&&JOB3[P.cls][P.job3]&&JOB3_OF[P.job2]===P.job3)return JOB3[P.cls][P.job3].title;return _jt()}}
// 경험치: 100레벨부터 레벨마다 스킬 포인트 한 점 더 · 100레벨 알림
{const _gx=gainXp;gainXp=function(n){const l0=P.lvl;const r=_gx(n);let ex=0;for(let l=l0+1;l<=P.lvl;l++)if(l>J3LV)ex++;
  if(ex){P.sp+=ex;msg(`100레벨 위에서는 레벨마다 스킬 포인트를 2점 받습니다 (+${ex})`,'#ffd76a');save()}
  if(l0<J3LV&&P.lvl>=J3LV&&P.job2&&!P.job3)setTimeout(()=>msg('3차 전직을 할 수 있습니다. 직업 전직관에게 가 보세요 (의뢰 일지 L)','#ffd76a'),400);return r}}

/* ===== 쓰기: 갈래 확인 · 모으기 채널링 ===== */
let J3CH=null,J3CH_LAST=null;const J3CHG={};
function j3OnCharge(id,h){J3CHG[id]=Object.assign(J3CHG[id]||{},h)}
function j3Hook(c,k,a){const h=J3CHG[c.id];if(h&&h[k])try{h[k](c,a)}catch(err){if(window.__QA)throw err}}
function j3ChargeStop(){const c=J3CH;if(!c)return;J3CH=null;castBarSet(null);if(NET.on)netSend({t:'chs',sp:c.id})}
function j3ChargeRelease(){const c=J3CH;if(!c)return;j3ChargeStop();if(c.p!==P||P.dead)return;
  j3Hook(c,'end');const f=clamp(c.f,0,1),k=1+(c.mul-1)*f;J3CH_LAST={id:c.id,f,k,L:c.L};
  const col=EL[c.s.el]||'#ffd76a';rings.push({x:P.x,y:P.y,r:10,max:80+160*f,life:.6,col});if(f>=.95){flash={col,a:.18};shake=Math.max(shake,6);ftext(P.x,P.y-30,'최대로 모음!','#ffd76a',true,80)}
  CAST_MOD={free:1,mul:k,share:1,charge:f,tick:0};try{tryCast(c.id,c.tg||undefined)}finally{CAST_MOD=null}
  if(typeof recStart==='function')recStart(c.id)}
function j3ChargePress(id,t,inner){const s0=SPELLS[id],c0=J3CH;
  if(c0&&c0.id===id&&c0.p===P){c0.hold=time;if(t)c0.tg=t;return}
  if(P.dead||paused)return;
  if(typeof REC==='object'&&REC.p===P&&REC.t>0)return inner(id,t);// 후딜레이 중: 끝나면 다시 (recov.js가 기억)
  const L=skLv(id),c=costOf(id);if(L<=0||(P.cd[id]||0)>0||P.mp<c||!job3Ok(id))return inner(id,t);
  const ch=s0.charge;if(P.moving&&!ch.walk){if(P.noMpT<=0){msg(`${s0.n}: 멈춰 서야 모을 수 있습니다`,'#a39d8f');P.noMpT=1.2}return}
  if(castOn())castStop('other');if(c0)j3ChargeStop();
  const s=eff(id,L);P.mp-=c;P.cd[id]=cdOf(id);castFx(s);if(t&&!s.self)P.face=Math.atan2(t.y-P.y,t.x-P.x);
  const mn=clamp(+ch.min||0,0,1);J3CH={id,L,s,t:0,max:Math.max(.3,+ch.max||3),mul:Math.max(1,+ch.mul||2),f:mn,min:mn,k:1+(Math.max(1,+ch.mul||2)-1)*mn,tg:t||null,hold:time,sticky:!CAST.slot,walk:+ch.walk||0,p:P};
  if(NET.on)netSend({t:'cst',sp:id,d:J3CH.max,ch:1});j3Hook(J3CH,'start');j3ChargeBar()}
function j3ChargeBar(){const c=J3CH;if(!c)return;castBarSet({id:c.id,t:c.f*c.max,max:c.max});if(castBarEl){const tx=`${SPELLS[c.id].n} · 모으는 중 ×${c.k.toFixed(2)}`;if(castBarEl.lastChild.textContent!==tx)castBarEl.lastChild.textContent=tx;castBarEl.classList.add('ch')}}
function j3ChargeTick(dt){const c=J3CH;if(!c)return;if(c.p!==P||P.dead){j3ChargeStop();return}
  if(CAST.barHold!=null&&P.bar[CAST.barHold]===c.id)c.hold=time;
  if(P.moving&&!c.walk){j3ChargeRelease();return}
  c.t+=dt;c.f=clamp(c.min+(1-c.min)*c.t/c.max,0,1);c.k=1+(c.mul-1)*c.f;castPose(P,c.s.el);j3Hook(c,'tick',dt);
  if(J3CH!==c)return;
  if(c.f>=1||(!c.sticky&&time-c.hold>.06)){j3ChargeRelease();return}
  j3ChargeBar()}
{const _tc=tryCast;tryCast=function(id,t){const s0=SPELLS[id];if(!s0)return _tc(id,t);
  if(s0.job3&&!GHOST&&!CAST_MOD&&s0.cls===P.cls&&s0.job3!==P.job3){if(P.noMpT<=0){const j=job3Of(s0.job3);msg(`${s0.n}: 3차 전직 「${j?j.n:s0.job3}」 갈래의 기술입니다`,'#a39d8f');P.noMpT=1.5}return}
  if(s0.charge&&!GHOST&&!CAST_MOD&&s0.cls===P.cls)return j3ChargePress(id,t,_tc);
  if(J3CH&&!GHOST&&!CAST_MOD&&s0.cls===P.cls&&s0.kind!=='passive'&&skLv(id)>0&&!(P.cd[id]>0))j3ChargeRelease();// 다른 기술을 누르면 모은 만큼 쏜다
  return _tc(id,t)}}
{const _cr=castReset;castReset=function(){_cr();J3CH=null}}
// 표시: 쓰는 방식(채널링 무늬) · 한 줄 설명
{const _k=CMARK.kind;CMARK.kind=function(id){const s=SPELLS[id];if(s&&s.charge&&s.kind!=='passive')return 'chan';return _k.call(this,id)}}
{const _ci=castInfo;castInfo=function(id,L){const s=SPELLS[id];if(s&&s.charge)return `모으기 채널링 최대 ${s.charge.max}초 (오래 누를수록 최대 ×${s.charge.mul})`;return _ci(id,L)}}
// 발밑 마법진: 모을수록 커진다
{const _cd=castDraw;castDraw=function(){_cd();const c=J3CH;if(!c||P.dead||c.p!==P)return;const col=EL[c.s.el]||'#ffd76a',r=(40+Math.min(30,c.s.rank||20)*3)*(.45+.75*c.f);
  castGlyphAt(P.x,P.y,col,r,c.f,1.2+c.f*2);ctx.globalAlpha=.5+.4*c.f;ctx.strokeStyle=c.f>=.95?'#fff6d8':col;ctx.lineWidth=2+c.f*3;ctx.beginPath();ctx.arc(P.x,P.y,r*.98,-1.571,-1.571+6.283*c.f);ctx.stroke();ctx.globalAlpha=1}}

/* ===== 무너짐 게이지 (party18.js의 PTY.STG를 그대로 쓴다) ===== */
const J3BRK=[];
function onBreak(fn){if(typeof fn==='function')J3BRK.push(fn)}
const isBroken=e=>!!(e&&e.brk>0);
function breakAdd(e,amt){if(GHOST||!e||e.dead||e.down||!e.boss||!(amt>0)||e.brk>0)return false;amt=Math.min(100,amt);
  if(NET.guest){if(!e.id)return false;netSend({t:'j3x',k:'brk',to:NET.hostId,id:e.id,a:Math.round(amt)});rings.push({x:e.x,y:e.y,r:8,max:e.r*2.5,life:.4,col:'#ffd34d'});return true}
  PTY.stag(e,amt,'j3');if(!(e.brk>0))ftext(e.x,e.y-10,'무너짐 +'+Math.round(amt),'#ffd34d',false,e.r*2+40);return true}
{const _st=PTY.stag;PTY.stag=function(e,amt,why){const was=!!(e&&e.brk>0);const r=_st.call(this,e,amt,why);if(e&&!was&&e.brk>0){e.cast=0;for(const f of J3BRK)try{f(e)}catch(err){if(window.__QA)throw err}}return r}}
// 보스 이름 아래 가는 금빛 게이지 (월드)
{const _pd=PTY.draw;PTY.draw=function(){_pd.call(this);for(const e of enemies){if(!e.boss||e.dead||!e._s||!(e.stg>0||e.brk>0))continue;const s=e._s;if(!onScreen(s,120))continue;
  const sc=e.sc||1,y=s.y-(TYPES[e.k]?TYPES[e.k].r:20)*sc*2.4-6,w=64,k=e.brk>0?1:clamp(e.stg/100,0,1);ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,5);ctx.fillStyle=e.brk>0?'#ffe066':'#d8a830';ctx.fillRect(s.x-w/2,y,w*k,3)}}}

/* ===== 파티 전체: 무적 · 부활 · 버티기 · 치유 · 'j3x' 메시지 ===== */
const J3NET={};
function j3Peers(rad,o){if(!NET.on)return[];const out=[],dead=!!(o&&o.dead);for(const r of NET.peers.values()){if(!netSame(r)||(!r.seen&&!r.name))continue;if(!!r.dead!==dead)continue;if(dist(r,P)<=rad)out.push(r)}return out}
function j3Send(k,o,to){if(!NET.on)return;const m=Object.assign({t:'j3x'},o||{},{k});if(to)m.to=to;netSend(m)}
function j3Ring(col,max){rings.push({x:P.x,y:P.y,r:10,max:max||120,life:.8,col});burst(P.x,P.y,col,30,160,3,30)}
function j3PartyInvuln(sec,rad,name){if(GHOST)return 0;if(!P.dead){P.invT=Math.max(P.invT,sec);j3Ring('#ffe39a',140)}const L=j3Peers(rad);for(const r of L)j3Send('inv',{d:sec,n:name||''},r.id);return L.length}
function j3PartyRevive(pct,rad,name){if(GHOST)return 0;const L=j3Peers(rad,{dead:true});for(const r of L){netSend({t:'rez',to:r.id,p:clamp(pct,.05,1)});rings.push({x:r.x,y:r.y,r:6,max:110,life:.9,col:'#ffe39a'});burst(r.x,r.y,'#fff2c0',40,160,3,30)}
  if(L.length)msg(`${name||'부활'}: 동료 ${L.length}명을 일으켰습니다`,'#ffe39a');return L.length}
function j3Floor(sec,name){if(P.dead)return;const b=P.buffs.j3floor;P.buffs.j3floor={t:Math.max(sec,b?b.t:0),max:Math.max(sec,b?b.max:0),floor:1,n:name||'버티기'};j3Ring('#e8e4d8',120)}
function j3PartyFloor(sec,rad,name){if(GHOST)return 0;j3Floor(sec,name);const L=j3Peers(rad);for(const r of L)j3Send('floor',{d:sec,n:name||''},r.id);return L.length}
function j3PartyHeal(frac,flat,rad,name){if(GHOST)return 0;if(!P.dead){healP(Math.round(maxHp()*(frac||0)+(flat||0)));j3Ring('#9fe39a',100)}const L=j3Peers(rad);for(const r of L)j3Send('heal',{f:frac||0,a:Math.round(flat||0),n:name||''},r.id);return L.length}
J3NET.inv=(m,r)=>{if(P.dead)return;const d=clamp(+m.d||0,0,6);if(!(d>0))return;P.invT=Math.max(P.invT,d);j3Ring('#ffe39a',140);msg(`${r&&r.name||'동료'}님의 ${m.n||'보호'}: ${d}초 무적`,'#ffe39a')};
J3NET.floor=(m,r)=>{const d=clamp(+m.d||0,0,15);if(d>0){j3Floor(d,m.n);msg(`${r&&r.name||'동료'}님의 ${m.n||'버티기'}: 생명력이 1 아래로 떨어지지 않습니다`,'#e8e4d8')}};
J3NET.heal=(m,r)=>{if(P.dead)return;const n=clamp(maxHp()*clamp(+m.f||0,0,1)+clamp(+m.a||0,0,maxHp()),0,maxHp());if(n>0){healP(Math.round(n));burst(P.x,P.y,'#9fe39a',16,80,3,30)}void r};
J3NET.brk=m=>{if(!NET.host)return;const e=enemies.find(o=>o.id===m.id);if(e)breakAdd(e,clamp(+m.a||0,0,100))};
{const _nm=netOnMsg;netOnMsg=function(m){if(m&&m.t==='j3x'){if(m.to&&m.to!==NET.id)return;const f=J3NET[m.k];if(f)try{f(m,NET.peers.get(m.from)||null)}catch(err){if(window.__QA)throw err}return}return _nm(m)}}

/* ===== 갈래 바꾸기 (3차 뒤): 2·3차 점수를 함께 돌려받고 3차 갈래도 함께 바뀐다 ===== */
{const _sw=job2Swap;job2Swap=function(br){if(!P.job3)return _sw(br);const J=JOB2[P.cls];if(!J||!J[br]||br===P.job2||!JOB3_OF[br])return false;const price=job3SwapPrice();
  if(P.gold<price){msg(`금화가 모자랍니다 (${price.toLocaleString()} 필요)`,'#ff8a6a');return false}
  P.gold-=price;let pts=0;for(const id of Object.keys(P.sk)){const s=SPELLS[id];if(s&&(s.job2||s.job3)){pts+=P.sk[id];delete P.sk[id]}}P.sp+=pts;
  P.bar=P.bar.map(x=>x&&SPELLS[x]&&(SPELLS[x].job2||SPELLS[x].job3)?null:x);for(const a of allies)if(a.j2||a.j3)a.gone=true;allies=allies.filter(a=>!a.gone);
  for(const id in P.buffs)if(SPELLS[id]&&(SPELLS[id].job2||SPELLS[id].job3))delete P.buffs[id];P.j2link=null;J3CH=null;
  P.job2=br;P.job3=JOB3_OF[br];P.job2n=(P.job2n|0)+1;passT=-1;J2UI.tab='j3';buildBar();
  const J3=JOB3[P.cls][P.job3];banner={t:`갈래 바꾸기 · ${J[br].n} · ${J3.n}`,sub:`스킬 포인트 ${pts}점을 돌려받았습니다 · 금화 ${price.toLocaleString()}`,col:'#ffd76a',life:3,max:3};
  msg(`갈래를 「${J[br].n}」 · 3차 「${J3.n}」(으)로 바꾸었습니다. 2·3차 스킬 포인트 ${pts}점을 돌려받았습니다`,'#ffd76a');if(typeof j2Mirror==='function')j2Mirror();j3Mirror();updateHud();save();return true}}
{const _nh=sqNpcHtml;sqNpcHtml=function(){let h=_nh();const f=SQV.npc;if(!P.job3||!f||J2_INSTR[f.id]!==P.cls)return h;
  return h.replace(/갈래를 바꾸면 2차 전직 기술에 찍은 점수를 모두 돌려받습니다\. 금화 [\d,]+/,`갈래를 바꾸면 3차 갈래도 함께 바뀌고, 2·3차 기술에 찍은 점수를 모두 돌려받습니다. 시험은 다시 보지 않습니다. 금화 ${job3SwapPrice().toLocaleString()}`)
    .replace(/data-j2swapok="([a-z]+)" disabled/g,'data-j2swapok="$1"'+(P.gold<job3SwapPrice()?' disabled':'')).replace(/data-j2swapok="([a-z]+)"(?! disabled)/g,(m,b)=>P.gold<job3SwapPrice()?m+' disabled':m)}}

/* ===== 저장 · 불러오기 (새 칸: job3. 없으면 null) ===== */
// 예전 판(v19)은 레벨을 100으로 자르고 모르는 칸(job3)을 버리므로, 물약 칸(pot._j3)에 레벨 · 경험치 · 3차 갈래를 적어 둔다 → v20에서 다시 열면 되살린다
function j3Mirror(){try{if(!P||!P.pot||typeof P.pot!=='object')return;const j=P.job3||P._job3raw||0;if(j||P.lvl>J3LV){const o={j,l:P.lvl|0,x:Math.max(0,Math.round(P.xp||0))},sk={};let n=0;for(const k in P.sk)if(isJ3(k)&&P.sk[k]>0){sk[k]=P.sk[k];n++}if(n)o.s=sk;P.pot._j3=o}else delete P.pot._j3}catch(_){}}
{const _sd=saveData;saveData=function(){j3Mirror();const d=_sd();d.job3=P.job3||P._job3raw||null;return d}}
function j3LoadFix(d){const m=d&&d.pot&&d.pot._j3&&typeof d.pot._j3==='object'?d.pot._j3:{};
  // 예전 판에서 레벨이 잘린 저장: 거울 칸의 레벨이 더 높고 그 판의 최고 레벨(100)에 멈춰 있으면 되살린다
  const ml=m.l|0;if(ml>P.lvl&&ml<=MAXLV&&(d.lvl|0)>=J3LV&&(d.lvl|0)<=J3LV){P.lvl=ml;P.xp=clamp(m.x|0,0,Math.max(0,xpNeed(P.lvl)-1));lastRank=rankOf(P.lvl);P.hp=maxHp();P.mp=maxMp()}
  const raw=d.job3!=null?d.job3:(m.j||null),okB=typeof raw==='string'&&JOB3[P.cls]&&JOB3[P.cls][raw],ok=okB&&P.job2&&JOB3_OF[P.job2]===raw&&P.lvl>=J3LV;
  P.job3=ok?raw:null;P._job3raw=ok?null:(typeof raw==='string'&&raw.length<24?raw:null);
  // 예전 판이 3차 스킬 점수를 모르는 기술로 보고 스킬 포인트로 돌려준 경우: 거울 칸의 점수를 다시 찍어 둔다(남은 포인트에서 빼므로 두 번 받지 않음)
  if(P.job3&&m.s&&typeof m.s==='object'&&!Object.keys(P.sk).some(k=>isJ3(k)&&P.sk[k]>0)){const add={};let n=0;for(const k in m.s){const v=m.s[k]|0;if(SPELLS[k]&&SPELLS[k].job3===P.job3&&v>0){add[k]=Math.min(J3_MAXSK,v);n+=add[k]}}
    if(n&&P.sp>=n){for(const k in add)P.sk[k]=add[k];P.sp-=n;passT=-1}}
  if(J2UI.tab==='j3')J2UI.tab=null;j3Mirror()}
{const _ld=load;load=function(d,slot){J3CH=null;const ok=_ld(d,slot);if(ok)try{j3LoadFix(d);buildBar();updateHud()}catch(err){if(window.__QA)throw err}return ok}}
{const _ng=newGame;newGame=function(cls,slot){J3CH=null;P.job3=null;P._job3raw=null;const r=_ng(cls,slot);P.job3=null;P._job3raw=null;return r}}

/* ===== 스킬 창: 3차 탭 ===== */
const J3TAG='<i class="qtg j3">3차</i>';
{const st=document.createElement('style');st.textContent='.qtg.j3{background:#d8902a;color:#fff}.treetabs button.j3b{border-color:#e0a040;color:#ffcf7a}.treetabs button.j3b.lk{opacity:.6}.j3note{margin:4px 0}.j3row .pts3{font-size:10px;color:#ffcf7a}.j3rows{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}.j2row .cmk svg{width:10px;height:10px}';document.head.appendChild(st)}
const j3Branch=()=>P.job3||(P.job2&&JOB3_OF[P.job2])||null;
{const _t=j2TabsHtml;j2TabsHtml=function(){let h=_t();const br=j3Branch();if(!P.job2||!br||!JOB3[P.cls]||!JOB3[P.cls][br])return h;let pt=0;for(const k in P.sk)if(TREE[k]==='j3_'+br)pt+=P.sk[k];
  return h+`<button type="button" data-j2tab="j3" class="j2t j3b${P.job3?'':' lk'}" aria-selected="${J2UI.tab==='j3'}">${P.job3?JOB3[P.cls][br].tree:'3차 전직'} <span class="muted">${P.job3?pt:'잠김'}</span></button>`}}
function j3TreeHtml(){const br=j3Branch(),J=JOB3[P.cls][br],ids=J3_SPELLS.filter(id=>SPELLS[id].job3===br);
  let h=`<p class="muted j3note"><b style="color:#ffcf7a">${J.n}</b> · ${J.desc}</p><p class="muted j3note">${P.job3?`3차 스킬은 한 기술에 최대 ${J3_MAXSK}점 · 한 점마다 피해 +12% (더하는 식) · 장비의 「모든 스킬 +」은 붙지 않고 「${J.n} 계열 +」만 붙습니다 · 100레벨부터 레벨마다 2점`:`<span class="lockup">3차 전직(레벨 ${J3LV}, 전직관의 의뢰) 뒤에 열립니다.</span> 아래는 「${J.n}」이(가) 되면 배울 기술입니다.`}</p>`;
  if(!ids.length)return h+'<p class="muted">이 갈래의 기술은 아직 준비 중입니다.</p>';
  if(!nodeSel||!ids.includes(nodeSel))nodeSel=ids.find(id=>P.sk[id])||ids[0];
  h+='<div class="j2adv j3rows">';
  for(const id of ids){const s=SPELLS[id],L=skShow(id),need=reqLvOf(id),c=canLearn(id)?'can':P.job3?'':'lk';
    h+=`<button class="j2row j3row ${c}" type="button" data-node="${id}" aria-pressed="${nodeSel===id}" title="${s.n}${s.kind==='passive'?' (패시브)':''}">${spellSvg(s)}${L?`<span class="nl">${L}</span>`:''}<span style="min-width:0">${j2CM(id,'cmk')}<b>${s.n}</b><small>레벨 ${need}${s.kind==='passive'?' · 패시브':''} <span class="pts3">${P.sk[id]||0}/${J3_MAXSK}</span> ${j2PT(id)}</small></span></button>`}
  return h+'</div>'+detailHtml(nodeSel)}
{const _th=treeHtml;treeHtml=function(){if(J2UI.tab==='j3'&&!(P.job2&&j3Branch()))J2UI.tab=null;if(J2UI.tab!=='j3')return _th();j2KindN();
  const C=CLASSES[P.cls];let h=`<div class="pts">남은 스킬 포인트 <b>${P.sp}</b> <span class="muted">· 3차 기술은 최대 ${J3_MAXSK}점</span>${typeof CMARK==='object'?CMARK.legend():''}</div><div class="treetabs">`;
  C.trees.forEach((n,t)=>{let pts=0;for(const k in P.sk)if(TREE[k]===t)pts+=P.sk[k];h+=`<button type="button" data-tree="${t}" aria-selected="false">${n} <span class="muted">${pts}</span></button>`});
  return h+j2TabsHtml()+'</div>'+j3TreeHtml()}}
{const _dh=detailHtml;detailHtml=function(id){const s=SPELLS[id];if(!s||!s.job3)return _dh(id);j2KindN();
  const base=P.sk[id]||0,L=skLv(id),show=skShow(id),bon=base?bonusLv(id):0,need=reqLvOf(id),J=job3Of(s.job3),k=J3K(s.cls),cinfo=castInfo(id,L);
  let h=`<div class="detail"><div class="t">${s.n}<i>${s.en}</i></div><div class="sub">${s.kn} · ${J?J.n:''} 3차 ${s.rank-19}번째 · ${ELN[s.el]||''} · ${KINDN[s.kind]||s.kind} · 재사용 ${Math.round(cdOf(id)*100)/100}초${cinfo?` · <b class="cinfo">${cinfo}</b>`:''}</div><div class="d">${s.desc}${s.chant?` <span class="muted">영창 「${s.chant}」</span>`:''}</div>`;
  h+=`<div>스킬 레벨 <b style="color:#ffd76a">${show}</b> / ${J3_MAXSK}${bon?` <span class="muted">(찍은 점수 ${base} + 장비 ${bon})</span>`:''} <span class="muted">· 한 점마다 피해 +12%</span></div>`;
  const cur=numsAt(id,Math.max(1,L)),nx=base<J3_MAXSK?numsAt(id,L?L+k:1+k):null;
  h+='<div class="nums"><span></span><span class="muted">'+(L?'지금':'1레벨')+'</span><span class="muted">'+(nx&&L?'다음 레벨':'')+'</span>';
  cur.forEach(([kk,v],i)=>{h+=`<span>${kk}</span><b>${v}</b><b class="nx">${nx&&L&&nx[i]&&nx[i][1]!==v?nx[i][1]:''}</b>`});h+='</div>';
  const reqs=[];if(s.job3!==P.job3)reqs.push(`<span class="lockup">3차 전직 「${J?J.n:s.job3}」 갈래 전용 기술입니다${P.job3?'':` (레벨 ${J3LV}, 전직관의 의뢰)`}</span>`);
  else if(P.lvl<need)reqs.push(base?`<span class="lockup">더 찍으려면 레벨 ${ptNeed(id)}부터</span>`:`레벨 ${need} 필요`);else if(base<J3_MAXSK&&P.lvl<ptNeed(id))reqs.push(`다음 점수는 레벨 ${ptNeed(id)}부터 (점수를 찍을 때마다 요구 레벨 +1)`);
  else if(base>=J3_MAXSK)reqs.push('최고 레벨입니다');
  h+=reqs.length?`<div class="req">${reqs.join(' · ')}</div>`:'<div class="req ok">레벨만 되면 바로 찍을 수 있습니다</div>';
  h+=`<div class="acts"><button type="button" data-learn="${id}" ${canLearn(id)?'':'disabled'}>+1 포인트 ${P.sp?`(남은 ${P.sp})`:''}</button>`;
  if(L&&s.kind!=='passive')h+=`<button type="button" data-bind="${id}">${bindId===id?'누를 키를 기다리는 중… (Esc 취소)':'다음에 누르는 키에 넣기'}</button>`;h+='</div>';
  if(L&&s.kind!=='passive'){h+='<div class="slotpick">';SLOTS.forEach((sl,i)=>{h+=`<button type="button" data-assign="${id}" data-i="${i}" aria-pressed="${P.bar[i]===id}" title="${sl.k} 칸에 넣기">${sl.k}</button>`});h+='</div>'}
  return h+'</div>'}}
// 단축칸 · 큰 알림: 3차 스킬은 찍은 레벨(1~10)로 보인다
{const _sb=slotBtn;slotBtn=function(i){const h=_sb.apply(this,arguments),id=P.bar[i];if(!id||!isJ3(id)||!P.sk[id])return h;const L=skLv(id),S=skShow(id);return h.split(`스킬 레벨 ${L}`).join(`스킬 레벨 ${S}`).split(`>Lv${L}<`).join(`>Lv${S}<`)}}
{const _cf=castFx;castFx=function(s){const r=_cf(s);if(s&&s.job3&&!GHOST&&banner&&banner.t===s.n&&SPELLS[s.id])banner.sub=banner.sub.split(`스킬 레벨 ${s.L}`).join(`스킬 레벨 ${skShow(s.id)}`);return r}}

/* ===== 매 프레임 ===== */
{const _u=update;update=function(dt){_u(dt);if(!paused||NET.on)j3ChargeTick(dt)}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{JOB3,JOB3_OF,JOB3_IDS,J3_SPELLS,J3_LV,job3Ok,skMax,skShow,breakAdd,onBreak})}catch(_){}},0);
window.__j3=Object.assign(window.__j3||{},{JOB3,JOB3_OF,JOB2_OF3,JOB3_IDS,J3_SPELLS,J3_LV,J3LV,J3_MAXSK,J3KC,J3NET,job3Ok,job3Of,isJ3,skMax,skShow,job3SwapPrice,j3Mirror,j3LoadFix,
  j3ChargePress,j3ChargeRelease,j3ChargeStop,j3OnCharge,breakAdd,onBreak,isBroken,j3Peers,j3Send,j3PartyInvuln,j3PartyRevive,j3PartyFloor,j3PartyHeal,j3TreeHtml});
Object.defineProperties(window.__j3,{CH:{configurable:true,get:()=>J3CH},CH_LAST:{configurable:true,get:()=>J3CH_LAST}});
