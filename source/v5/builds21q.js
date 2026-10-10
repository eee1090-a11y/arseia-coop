/* ---------- v21 (BUILDS): 빌드 핵심 장비 — 걸어 두는 자리 (사용자가 켜기로 함: 스위치 없이 늘 켜짐) ----------
   데이터·공식·효과는 builds21.js. 여기서는 v20/v21 코드에 연결만 한다.
   · 스킬 수치(eff): 겹친 덫 +1개 · 휩쓰는 기세 범위 +15%      · 샘의 길 3개 마나 회복(V20.tick)
   · 넘치는 등불(healP): 넘친 치유의 30% → 둘레 450 안 가장 다친 파티원(j3 'heal' 메시지), 혼자면 작은 보호막(더 큰 막과 안 겹침)
   · 드랍: 3차 지역 던전 보스 4곳 'j3boss' · 재의 군주 'ashlord' · 어둠 단계 던전 보스 'dark' · 어둠 단계 정예 'darkElite' · 메아리 군주 'echo'
     (HUNT의 darkTier()/ecIsLord(), 없으면 0/거짓)
   · 퀘스트 ① 「스승의 마지막 시험」(직업별 의뢰 q21_mentor_m/p/w/a, 110레벨 · 3차 전직 뒤): 「샘을 흐리는 자」 처치 → 시험의 방 3분(마나 물약 없이) → 샘의 길 핵심
   · 퀘스트 ② 「전설 현상금」: 상급 현상금(잿빛 메아리) 10개마다 하나 → 확정 보상(톱니 → 샘의 반지 → 그 뒤 상급 상자)
   · 툴팁(ITEMTIP_LINES) · 도감(shop.js 상급 유니크 아래) · 캐릭터 창 공명 줄 · 저장(P.bty.leg, 아이템 core)
   저장: 아이템에 core:'c_…'만 더 붙고(gear/bag 그대로 저장됨), P.bty.leg={n,got,on}은 btyClean이 모르는 칸으로 그대로 보존. 지우는 코드 없음. */

/* ===== 1) 스킬 수치 ===== */
{const _ef=eff;eff=function(id,L){const e=_ef.apply(this,arguments);if(GHOST||!P||!e||e.cls!==P.cls)return e;const W=core21Worn();if(!W.list.length)return e;
  if(W.fx.traps&&e.kind==='trap')e.maxN=(e.maxN||2)+1;
  if(W.fx.sweep&&core21Tag(CORE21_BY.c_skyspear.tag,id)){if(e.kind==='melee'&&(e.ang||1)>=1.6)e.range=(e.range||1)*1.15;else if(e.kind==='nova'&&e.rad)e.rad=Math.round(e.rad*1.15);else if(e.kind==='sweep'&&e.w)e.w=Math.round(e.w*1.15)}
  return e}}
V20.tick.push(dt=>{if(!GHOST&&P&&core21N('well')>=3)core21Regen(dt)});

/* ===== 2) 넘치는 등불 ===== */
let c21SpillT=-9;
function c21Spill(give){if(!(give>0)||P.dead)return;const L=typeof j3Peers==='function'?j3Peers(450):[];let best=null,bk=.999;
  for(const r of L){const k=r.max>0?r.hp/r.max:1;if(k<bk){bk=k;best=r}}
  if(best){j3Send('heal',{f:0,a:give,n:'넘치는 등불'},best.id);rings.push({x:best.x,y:best.y,r:6,max:70,life:.6,col:'#ffe39a'});burst(best.x,best.y,'#ffe39a',10,70,2.5,30);return 'peer'}
  const cap=Math.round(maxHp()*.15),on=P.shield>0&&P.shieldT>0;
  if(on&&!(P.shieldS&&P.shieldS.c21))return null;// 더 큰(다른) 보호막이 있으면 그대로
  const cur=on?P.shield:0,amt=Math.min(cap,cur+give);if(amt<=cur)return null;
  P.shield=amt;P.shieldT=Math.max(on?P.shieldT:0,5);P.shieldN=0;P.shieldRef=0;P.shieldS={id:'c21lamp',n:'넘치는 등불',el:'holy',c21:1};
  if(time-c21SpillT>1.2){c21SpillT=time;rings.push({x:P.x,y:P.y,r:8,max:60,life:.5,col:'#ffe39a'});ftext(P.x,P.y,'넘치는 등불','#ffe39a',false,70)}return 'self'}
{const _hl=healP;healP=function(n){if(!(n>0)||!P||P.dead||GHOST||!V20.healMine||!core21Has('overflow'))return _hl.apply(this,arguments);
  const h0=P.hp,r=_hl.apply(this,arguments),over=n-Math.max(0,P.hp-h0),give=core21Overflow(over);if(give>0)c21Spill(give);return r}}

/* ===== 3) 드랍 ===== */
const C21_J3BOSS=new Set(['b_w3warden','b_w3choir','b_w3dean','b_w3regent']);
const c21Dark=()=>{try{return typeof darkTier==='function'?darkTier()|0:0}catch(e){if(window.__QA)throw e;return 0}};
function c21Drop(e,where,t){const cid=core21Roll(where,t);if(!cid)return null;const it=makeCore21(cid,Math.max(100,(e&&e.lvl)||P.lvl));if(!it)return null;
  const x=e&&e.x!=null?e.x:P.x,y=e&&e.y!=null?e.y:P.y;loot.push({x:x+rnd(-30,30),y:y+40,kind:'item',item:it,t:0});
  rings.push({x,y,r:10,max:150,life:1,col:'#d6a8ff'});burst(x,y,'#d6a8ff',40,170,3,30);
  msg(`빌드 핵심 장비 「${it.name}」${v20J(it.name,'가','이')} 떨어졌습니다! (${PATHN21[CORE21_BY[cid].path]})`,'#d6a8ff');return it}
{const _bd=dgBossDrop;dgBossDrop=function(e){const r=_bd.apply(this,arguments);if(!P||GHOST||!e||!DG)return r;
  try{const T=TYPES[e.k]||{};if(T.boss&&!e.qa){const t=c21Dark();let got=null;
    if(C21_J3BOSS.has(e.k))got=c21Drop(e,'j3boss',t);else if(e.k==='b_ashlord')got=c21Drop(e,'ashlord',t);
    if(!got&&t>0)c21Drop(e,'dark',t)}}catch(err){if(window.__QA)throw err}return r}}
{const _rk=rewardKill;rewardKill=function(e){let lord=false,t=0;
  try{if(e&&P&&!GHOST){lord=typeof ecIsLord==='function'&&ecIsLord(e);t=c21Dark()}}catch(err){if(window.__QA)throw err}
  const r=_rk.apply(this,arguments);if(!P||GHOST||!e)return r;
  try{if(e._c21k)core21OnKill(e,e._c21k);const T=TYPES[e.k]||{};
    if(lord)c21Drop(e,'echo',t);else if(e.elite&&!T.boss&&!T.mini&&t>=4)c21Drop(e,'darkElite',t);
    c21LegKill(e)}catch(err){if(window.__QA)throw err}return r}}

/* ===== 4) 이름 붙은 정예 (샘을 흐리는 자 · 전설 현상금 대상): 현상금 정예 규칙(생명력 ×7, 피해 ×1.4) ===== */
const C21N={q21_wellfoul:{base:'a_cinder',n:'샘을 흐리는 자',col:'#4a6a8a',pcol:'#8ac8ff',hpK:7,dmgK:1.4,tint:'#8ac8ff',where:'재가 내리는 고원 (지옥) · 「스승의 마지막 시험」을 받았을 때'},
  q21_leg0:{base:'k_rogue',n:'시계탑을 멈춘 도둑',col:'#6a5a3a',hpK:12,dmgK:1.4,tint:'#ffcf6a',where:'잿빛 메아리 지역 들판 · 전설 현상금'},
  q21_leg1:{base:'s_siren',n:'샘을 훔친 마녀',col:'#3a7a8a',pcol:'#9affff',hpK:12,dmgK:1.4,tint:'#9affff',where:'잿빛 메아리 지역 들판 · 전설 현상금'},
  q21_leg2:{base:'k_rogue',n:'메아리의 전설',col:'#8a8078',hpK:12,dmgK:1.4,tint:'#e8dccc',where:'잿빛 메아리 지역 들판 · 전설 현상금'}};
for(const k in C21N){const D=C21N[k],B=TYPES[D.base];if(!B)continue;const t=Object.assign({},B,{n:D.n,col:D.col,named21:1});if(D.pcol)t.pcol=D.pcol;delete t.el;TYPES[k]=t}
{const _g=cxGroups;cxGroups=function(){const G=_g(),ks=Object.keys(C21N).filter(k=>TYPES[k]);for(const g of G)g[1]=g[1].filter(k=>!C21N[k]);const out=G.filter(g=>g[1].length);out.push(['이름 붙은 정예 (스승의 시험 · 전설 현상금)',ks]);return out}}
{const _mi=monInfo;monInfo=function(k){const m=_mi(k);if(C21N[k]){m.where=[C21N[k].where];m.lv=TYPES[k].min||m.lv}return m}}
const c21Live=k=>enemies.some(e=>e.k===k&&!e.dead&&!e.gone);
function c21SpawnNamed(k){const D=C21N[k],t=TYPES[k];if(!D||!t||DG||IN||NET.guest||c21Live(k))return null;const Dd=DIFF[P.diff];let sp=null;
  for(let i=0;i<60&&!sp;i++){const a=R()*6.283,r=520+R()*360,x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;if(x<200||y<200||x>WORLD-200||y>WORLD-200)continue;if(blockedAt(x,y)||inSafe(x,y,200))continue;sp={x,y}}
  if(!sp)return null;const lvl=Math.max(1,Math.max(t.min||1,zoneLevel(sp.x,sp.y))+Dd.add),hp=Math.round(t.hp*(1+.34*(lvl-1))*D.hpK*Dd.hp);
  const e={k,x:sp.x,y:sp.y,lvl,elite:true,hp,max:hp,dmg:t.dmg*(1+.18*(lvl-1))*D.dmgK,r:t.r*1.45,sc:1.45,atkCd:1,anim:0,wx:sp.x,wy:sp.y,wt:0,hurt:0,fx:1,slowT:0,freezeT:0,stunT:0,burn:null,lunge:0,c21n:1};
  enemies.push(e);rings.push({x:e.x,y:e.y,r:10,max:120,life:.8,col:D.tint});burst(e.x,e.y,D.tint,24,120,3,20);
  const dx=e.x-P.x,dy=e.y-P.y,a=Math.atan2((dx+dy)/2,dx-dy),i=((Math.round(a/(Math.PI/4))%8)+8)%8;
  msg(`이름 붙은 정예 「${D.n}」${v20J(D.n,'가','이')} 나타났습니다! (${typeof QDIR!=='undefined'?QDIR[i]+'쪽':''})`,D.tint);return e}

/* ===== 5) 퀘스트 ① 스승의 마지막 시험 ===== */
const C21M_SAY={mage:'불도 얼음도 끝까지 다뤄 봤겠지. 그런데 마나가 마르면 마법사는 그저 지팡이 든 사람일 뿐이다. 힘만으로는 끝까지 갈 수 없다. 재가 내리는 고원에서 샘을 흐리는 놈을 잡고, 시험의 방에서 마나를 아껴 버텨 보거라.',
  priest:'기도는 한 번 크게 외치는 것보다 오래 이어 가는 것이 어렵단다. 힘만으로는 끝까지 갈 수 없어요. 고원의 흐린 샘을 맑히고, 시험의 방에서 물약 없이 버텨 보세요.',
  warrior:'세게 치는 건 이제 알겠지. 하지만 오래 서 있는 놈이 이긴다. 힘만으로는 끝까지 못 간다. 고원에서 샘을 흐리는 놈을 베고, 시험의 방에서 마나 물약 없이 3분 버텨라.',
  archer:'화살은 많아도 숨이 먼저 차는 법이야. 힘만으로는 끝까지 못 가. 고원의 「샘을 흐리는 자」를 떨구고, 시험의 방에서 마나를 아껴 3분 버텨 봐.'};
const C21M_DONE={mage:'버텼구나. 마나는 아끼는 자에게 고인다. 이 홀을 가져가거라. 물결이 멎은 자리에서만 마나가 고인단다.',
  priest:'잘 버텼어요. 꺼지지 않는 등불은 기름이 아니라 기도로 탄답니다. 이 등불을 드릴게요.',
  warrior:'숨이 차도 서 있군. 이 방패는 성이 무너진 뒤에도 무너지지 않았다. 이제 네 것이다.',
  archer:'끝까지 쏘고도 숨이 남았네. 세 하늘이 한 활에서 만나는 걸 보여 줄게. 가져가.'};
const C21MQ={};
for(const cls of ['mage','priest','warrior','archer']){const M=CORE21_QUESTS.mentor,id='q21_mentor_'+({mage:'m',priest:'p',warrior:'w',archer:'a'})[cls];
  const q={id,cls,c21m:1,town:J3_TOWN[cls],giver:J3_GIVER[cls],lvl:M.lvl,kind:'스승의 시험',t:M.n,say:C21M_SAY[cls],done:C21M_DONE[cls],
    goals:[{type:'kill',k:['q21_wellfoul'],n:1,item:'맑은 물방울',d:'재가 내리는 고원(지옥)의 「샘을 흐리는 자」 처치 · 맑은 물방울'},{type:'c21trial',d:'시험의 방에서 마나 물약 없이 3분 버티기 (스승에게 말하면 들어감)'}],rw:{xp:M.reward.xp,gold:M.reward.gold}};
  SQ.push(q);SQBY[id]=q;C21MQ[cls]=q}
{const _a=sqAvail;sqAvail=function(q){if(!q||!q.c21m)return _a.apply(this,arguments);if(!P||q.cls!==P.cls)return 'hidden';const s=sqState();
  if(s.a[q.id])return 'active';if(s.d[q.id])return 'done';if(!P.job3)return 'hidden';if(P.lvl<q.lvl)return 'low';return 'ok'}}
function c21Give(cid,why){const it=makeCore21(cid,Math.max(110,P.lvl));if(!it)return null;if(P.bag.length<sqBagCap())P.bag.push(it);else loot.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),kind:'item',item:it,t:0,keep:1});
  rings.push({x:P.x,y:P.y,r:10,max:160,life:1,col:'#d6a8ff'});burst(P.x,P.y,'#d6a8ff',40,170,3,30);msg(`${why||'보상'}: 빌드 핵심 장비 「${it.name}」 (${PATHN21[CORE21_BY[cid].path]})`,'#d6a8ff');return it}
{const _f=sqFinish;sqFinish=function(id){const q=SQBY[id];if(!q||!q.c21m)return _f.apply(this,arguments);const s=sqState(),n0=s.d[id]|0;const r=_f.apply(this,arguments);
  if((s.d[id]|0)>n0){const cid=CORE21_QUESTS.mentor.reward[q.cls];const it=c21Give(cid,'스승의 마지막 시험');if(it&&banner)banner.sub+=` · 「${it.name}」`;save()}return r}}
{const _r=sqRwHtml;sqRwHtml=function(q){const h=_r.apply(this,arguments);if(!q||!q.c21m)return h;const c=CORE21_BY[CORE21_QUESTS.mentor.reward[q.cls]];
  return c?h.replace(/<\/p>$/,` · <b style="color:#d6a8ff">빌드 핵심 「${c.n}」 (샘의 길)</b></p>`):h}}
{const _t=sqTarget;sqTarget=function(q){if(!q||!q.c21m)return _t.apply(this,arguments);const a=sqState().a[q.id];if(!a||sqAllDone(q))return _t.apply(this,arguments);
  if(!sqGoalDone(q,0)){const L=RCACHE.plateau,T=L&&L.town;return{reg:'plateau',x:T?T.x+700:3000,y:T?T.y-500:3000,label:'재가 내리는 고원 (지옥) · 「샘을 흐리는 자」'}}
  const t=typeof j2NpcAt==='function'?j2NpcAt(q.giver):null;return t?Object.assign({},t,{label:`${t.label} · 시험의 방`}):null}}
const c21MentorQ=()=>{const q=P&&C21MQ[P.cls];return q&&sqState().a[q.id]?q:null};
{const _nh=sqNpcHtml;sqNpcHtml=function(){let h=_nh.apply(this,arguments);const f=SQV.npc,q=c21MentorQ();if(!f||!q||q.giver!==f.id||!sqGoalDone(q,0)||sqGoalDone(q,1))return h;
  h+=`<div class="j2swap"><b>시험의 방</b> <span class="muted">· 마나 물약 없이 3분</span><p class="muted" style="margin:4px 0">몰려오는 무리를 3분 동안 버팁니다. 마나 물약은 쓸 수 없고, 방 안 샘물 셋 위에 서 있으면 마나가 차오릅니다. 혼자 들어가는 곳입니다${NET.on?' · 같이 하기 중에는 들어갈 수 없습니다':''}.</p><div class="row"><button class="primary" type="button" data-c21trial="${q.id}">시험의 방으로 들어가기</button></div></div>`;return h}}
{const _qc=questClick;questClick=function(b){const d=b.dataset;if(d.c21trial){c21TrialEnter(d.c21trial);return true}if(d.c21leg!=null){c21LegTake();renderPanel();return true}return _qc(b)}}
// 시험의 방: 마나 물약 없이 3분 · 샘물 셋
const C21T_SEC=180,C21T_MOBS=['a_hound','a_knight','a_brute','a_cinder'];
function c21TrialEnter(qid){const q=SQBY[qid],a=sqState().a[qid];if(!q||!q.c21m||!a||!sqGoalDone(q,0)||sqGoalDone(q,1))return false;
  if(NET.on){msg('시험의 방은 혼자 들어가는 곳입니다. 같이 하기를 끝내고 들어오세요','#a39d8f');return false}if(DG||P.dead)return false;
  if(!panel.hidden)closePanel();if(IN)twLeave(true);
  const R0={i:10,j:10,w:16,h:16,cx:18,cy:18},g=new Uint8Array(DN*DN);for(let y=R0.j;y<R0.j+R0.h;y++)for(let x=R0.i;x<R0.i+R0.w;x++)g[tIdx(x,y)]=1;
  const base=DUNGEONS.find(d=>d.id==='sanctum')||DUNGEONS[0],lvl=clamp(P.lvl,100,MAXLV);
  DG={d:Object.assign({},base,{n:'시험의 방',mobs:[],minis:[],boss:null,trial:1}),ci:-21,g,rooms:[R0],ret:{x:P.x,y:P.y},lvl,flow:null,ft:-1,portals:[],walls:[],torches:[],floor:[],bossDead:false,boss:null,start:R0,
    c21t:{q:qid,j:1,t:0,res:0,wave:2,sp:[],potT:0}};
  for(let j=0;j<DN;j++)for(let i=0;i<DN;i++){if(g[tIdx(i,j)]===1){DG.floor.push([i,j]);continue}let adj=false;for(let a2=-1;a2<=1;a2++)for(let b=-1;b<=1;b++)if(dgFloor(i+a2,j+b))adj=true;
    if(adj){const c2=tc(i,j);DG.walls.push({x:c2.x,y:c2.y,i,j,wall:1,h:120});if((i+j)%5===0){const sides=[[1,0],[0,1]].filter(([a2,b])=>dgFloor(i+a2,j+b));if(sides.length){const [a2,b]=sides[0];DG.torches.push({x:c2.x+a2*52,y:c2.y+b*52,light:150,torch:1})}}}}
  enemies=[];projs=[];fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  const st=tc(R0.i+R0.w/2,R0.j+R0.h/2),T=DG.c21t;P.x=st.x;P.y=st.y;DG.portals.push({x:st.x-80,y:st.y+90,exit:1});
  for(const [di,dj] of [[4,4],[R0.w-5,5],[R0.w/2,R0.h-4]]){const c=tc(R0.i+di,R0.j+dj);T.sp.push({x:c.x,y:c.y,pulse:0})}
  for(const al of allies){al.x=P.x+rnd(-40,40);al.y=P.y+rnd(-40,40)}
  followCam();banner={t:'시험의 방 · 마르지 않는 마음',sub:'마나 물약 없이 3분 버티기 · 파란 샘물 위에 서면 마나가 차오릅니다',col:'#8ac8ff',life:3.4,max:3.4};
  msg('시험의 방: 3분 동안 버티세요. 마나 물약은 쓸 수 없고, 파란 샘물 위에 서 있으면 마나가 차오릅니다','#8ac8ff');save();return true}
function c21TrialWave(){const T=DG.c21t,R0=DG.rooms[0],alive=enemies.filter(e=>!e.dead).length;if(alive>=10)return;
  for(let i=0;i<3+Math.min(2,Math.floor(T.t/60));i++){const side=Math.floor(R()*4),u=1+R()*(R0.w-3),c=side===0?tc(R0.i+u,R0.j+1):side===1?tc(R0.i+u,R0.j+R0.h-2):side===2?tc(R0.i+1,R0.j+u):tc(R0.i+R0.w-2,R0.j+u);
    const m=dgMob(C21T_MOBS[Math.floor(R()*C21T_MOBS.length)],c.x,c.y,DG.lvl-2);m.aggroed=true;m.c21w=1}}
function c21TrialEnd(win,why){const T=DG&&DG.c21t;if(!T||T.res)return;T.res=win?1:-1;const q=SQBY[T.q];
  if(win){for(const e of enemies)if(!e.dead){e.dead=true;killFx(e)}if(q&&sqState().a[q.id])sqProgress(q,T.j,1,true);DG.bossDead=true;DG.portals.push({x:P.x,y:P.y+90,exit:1});flash={col:'#8ac8ff',a:.25};
    const f=sqFolk(q&&q.giver);banner={t:'시험 통과',sub:`3분을 버텼습니다 · 빛나는 문으로 나가 ${f?f.n:'스승'}에게 알리세요`,col:'#8ac8ff',life:3.4,max:3.4};msg(`시험 통과! ${f?f.n:'스승'}에게 돌아가세요`,'#8ac8ff')}
  else{banner={t:'시험 실패',sub:`${why} · 스승에게 다시 말을 걸면 다시 도전할 수 있습니다`,col:'#ff8a6a',life:3.4,max:3.4};msg(`시험 실패: ${why}. 다시 도전할 수 있습니다`,'#ff8a6a')}
  save()}
function c21TrialTick(dt){const T=DG&&DG.c21t;if(!T||T.res)return;T.t+=dt;
  if(P.dead)return c21TrialEnd(false,'쓰러졌습니다');
  for(const s of T.sp){if(!decals.some(d=>d.c21sp===s))decals.push({x:s.x,y:s.y,r:46,col:'#3a8ad8',life:9,max:9,c21sp:s});else for(const d of decals)if(d.c21sp===s)d.life=9;
    s.pulse-=dt;if(s.pulse<=0){s.pulse=1.4;rings.push({x:s.x,y:s.y,r:8,max:60,life:.9,col:'#8ac8ff'})}
    if(Math.hypot(P.x-s.x,P.y-s.y)<70&&!P.dead){P.mp=Math.min(maxMp(),P.mp+maxMp()*.06*dt);if(R()<dt*8&&parts.length<800)parts.push({x:P.x+rnd(-14,14),y:P.y+rnd(-14,14),z:4,vx:0,vy:0,vz:rnd(40,90),life:.6,max:.6,col:'#8ac8ff',sz:2})}}
  T.wave-=dt;if(T.wave<=0){T.wave=9;c21TrialWave()}
  const left=C21T_SEC-T.t,k=Math.ceil(left/30);if(k!==T.k&&left>0){if(T.k!=null)msg(`시험의 방: ${Math.floor(left/60)}분 ${Math.round(left%60)}초 남음`,'#8ac8ff');T.k=k}
  if(left<=0)c21TrialEnd(true)}
V20.tick.push(dt=>{if(DG&&DG.c21t)c21TrialTick(dt)});
{const _u=usePotion;usePotion=function(k){const T=DG&&DG.c21t;if(T&&!T.res&&k==='mp'){if(time-T.potT>1){T.potT=time;msg('시험의 방에서는 마나 물약을 쓸 수 없습니다 · 파란 샘물을 쓰세요','#8ac8ff')}return false}return _u.apply(this,arguments)}}

/* ===== 6) 퀘스트 ② 전설 현상금 (상급 현상금 10개마다) ===== */
const c21LegK=i=>'q21_leg'+Math.min(2,i|0);
{const _c=btyCredit;btyCredit=function(id){const r=_c.apply(this,arguments);if(r&&typeof id==='string'&&id.startsWith('echo:')&&P&&!GHOST){const L=core21LegState();L.n++;const nx=core21LegNext();
  if(nx&&L.on==null)msg(`전설 현상금 「${nx.n}」${v20J(nx.n,'가','이')} 현상금 게시판에 붙었습니다`,'#ff8a3a');else if(!nx)msg(`전설 현상금까지 상급 현상금 ${CORE21_QUESTS.legend.every*(L.got.length+1)-L.n}개`,'#e0d0c0');save()}return r}}
function c21LegTake(){const L=core21LegState(),nx=core21LegNext();if(!nx||L.on!=null||P.lvl<MAXLV)return false;L.on=L.got.length;msg(`전설 현상금을 받았습니다: 「${nx.n}」 · 오늘의 잿빛 메아리 지역 들판에 나타납니다`,'#ff8a3a');questHud();save();return true}
function c21LegKill(e){const L0=P.bty&&P.bty.leg;if(!L0||L0.on==null||!C21N[e.k])return false;const L=core21LegState();if(e.k!==c21LegK(L.on))return false;const i=L.on,tg=CORE21_QUESTS.legend.targets[i];
  if(tg&&tg.reward)c21Give(tg.reward,'전설 현상금');else{const it=makeItem(Math.max(100,e.lvl||P.lvl),true,null,'boss');loot.push({x:e.x+rnd(-20,20),y:e.y+rnd(-20,20),kind:'item',item:it,t:0});msg('전설 현상금: 상급 상자','#ff8a3a')}
  if(typeof ashGain==='function')ashGain(10,e.x,e.y);L.got.push(i);L.on=null;
  banner={t:`전설 현상금 · ${tg?tg.n:'메아리의 전설'}`,sub:tg&&tg.reward?`빌드 핵심 「${CORE21_BY[tg.reward].n}」 확정`:'상급 상자 · 재의 결정 10',col:'#ff8a3a',life:3.2,max:3.2};questHud();save();return true}
function c21LegHtml(){if(!P||P.lvl<MAXLV)return '';const L=core21LegState(),nx=core21LegNext(),ev=CORE21_QUESTS.legend.every,need=ev*(L.got.length+1);
  let h=`<h2>전설 현상금 <span class="muted">· 상급 현상금 ${ev}개마다 하나</span></h2><p class="muted" style="font-size:12px;margin:2px 0 6px">잡은 상급 현상금 ${L.n}개 · 받은 전설 현상금 ${L.got.length}개. 첫째 「시계탑을 멈춘 도둑」은 멈춘 시계탑의 톱니, 둘째 「샘을 훔친 마녀」는 마르지 않는 샘의 반지를 반드시 줍니다.</p>`;
  if(L.on!=null){const D=C21N[c21LegK(L.on)];return h+`<div class="v20row"><div><span class="v20chip" style="background:${D.tint}"></span><b>${D.n}</b> <span class="muted">· 진행 중</span><div class="muted" style="font-size:12px">오늘의 잿빛 메아리 지역 들판(지옥)에 나타납니다</div></div></div>`}
  if(!nx)return h+`<p class="muted">다음 전설 현상금까지 상급 현상금 ${Math.max(0,need-L.n)}개</p>`;
  const rw=nx.reward?`빌드 핵심 「${CORE21_BY[nx.reward].n}」 확정`:'상급 상자';
  return h+`<div class="v20row"><div><span class="v20chip" style="background:#ff8a3a"></span><b>${nx.n}</b><div class="muted" style="font-size:12px">보상: ${rw} · 재의 결정 10</div></div><div class="btns"><button type="button" class="primary" data-c21leg="1">받기</button></div></div>`}
{const _h=V20P.bty.html;V20P.bty.html=function(board){const h=_h.apply(this,arguments);let x='';try{x=c21LegHtml()}catch(e){if(window.__QA)throw e}if(!x)return h;const i=h.indexOf('<h2>증표 바꾸기');return i>=0?h.slice(0,i)+x+h.slice(i):h+x}}
// 이름 붙은 정예 내보내기 (혼자 · 파티장): 고원(스승의 시험) · 잿빛 메아리 들판(전설 현상금)
let c21SpT=0;V20.slowTick.push(st=>{if(!P||P.dead||DG||IN||NET.guest)return;c21SpT-=st;if(c21SpT>0)return;c21SpT=2;
  try{const q=c21MentorQ();if(q&&!sqGoalDone(q,0)&&REG.id==='plateau')c21SpawnNamed('q21_wellfoul');
    const L=P.bty&&P.bty.leg;if(L&&L.on!=null&&P.lvl>=MAXLV&&typeof echoHere==='function'&&echoHere())c21SpawnNamed(c21LegK(L.on))}catch(e){if(window.__QA)throw e}});

/* ===== 7) 글씨: 툴팁 · 도감 · 캐릭터 창 공명 ===== */
ITEMTIP_LINES.push(it=>core21Line(it));
function c21ResHtml(){const W=core21Worn();if(!W.list.length)return '';const row=(p,n2,n3)=>{const n=W.n[p];if(!n)return '';return `<div class="item"><div><div class="nm" style="color:#d6a8ff">${PATHN21[p]} 공명 (${n}/3)</div><div class="st"><span style="opacity:${n>=2?1:.5}">2개: ${n2}</span> · <span style="opacity:${n>=3?1:.5}">3개: ${n3}</span></div></div></div>`};
  return '<h2>빌드 핵심</h2>'+W.list.map(c=>`<div class="muted" style="font-size:12px">${c.n} · ${PATHN21[c.path]}${c.fx?' · '+FXN21[c.fx]:''}</div>`).join('')+
    row('time',...c21ResTxt('time'))+row('well',...c21ResTxt('well'))}
{const _c=charHtml;charHtml=function(){const h=_c.apply(this,arguments);if(!P)return h;let x='';try{x=c21ResHtml()}catch(e){if(window.__QA)throw e}if(!x)return h;const i=h.indexOf('<h2>세트 효과</h2>');return i>=0?h.slice(0,i)+x+h.slice(i):h+x}}

/* ===== 8) 저장: P.bty.leg 기본값 (없으면 {n:0,got:[]}) ===== */
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok&&P){try{const L=core21LegState();if(L.on!=null&&!(Number.isInteger(L.on)&&L.on>=0&&L.on<=99))L.on=null;L.got=L.got.filter(x=>Number.isInteger(x)&&x>=0).slice(0,99)}catch(e){if(window.__QA)throw e}}return ok}}

setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{CORE21,CORE21_BY,CORE21_QUESTS,C21,C21N,C21MQ,core21Worn,C21BAL,core21Cap,core21Mc,core21McCap,core21Dmg,core21Pen,core21Roll,makeCore21,core21Line,core21Codex,core21LegState,core21LegNext,core21OnCast,core21OnHit,core21TakeMul,c21Drop,c21Spill,c21SpawnNamed,c21TrialEnter,c21LegTake,c21LegKill,bonusLv,cdOf,costAt,costOf,dmgScale})}catch(_){}},0);
