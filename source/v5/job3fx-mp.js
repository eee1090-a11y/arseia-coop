/* ---------- v20 (MAGEPRI): 3차 전직 마법사·사제 스킬 — 실행 중 효과 · 그림 · 같이 하기 ----------
   데이터는 job3d-mp.js. job2q.js 바로 뒤, job3.js 앞(CORE가 tryCast를 바깥에서 한 번 더 감싸 갈래 확인·모으기 채널링을 먼저 한다).
   · 새 효과는 모두 기존 함수(tryCast · _castRelease · eff · hurtE · applyFx · hitPlayer · supFx · netGhostCast · updateEnemies · updateAllies · update)를 감싸서 넣는다.
   · 피해는 더하는 식: 낙인 피해(집행자의 눈)는 기존 강화 덧셈 칸 안에서 한 번만 곱한다(2차 패시브와 같은 방식).
   · 같이 하기: 동료의 시전(유령 시전)을 받은 화면이 자기 몫(치유·무적·축복의 덤·장판 표시)을 스스로 건다. 피해는 시전한 사람의 화면에서만,
     몬스터를 움직이는 것(끌어당김·느리게·시간의 틈·물벽에 실려 감)은 몬스터를 맡은 화면(혼자 또는 방장)에서만.
     따로 보내는 메시지는 'j3x'(CORE 형식): gale(태풍 모으기 시작) · fin(종언의 원·하늘 문 마지막 한 방) · lswap(생명 교환). 옛 판은 모르는 메시지라 무시.
   · 그림은 모두 처음 한 번 구워 둔 것(SC.get)을 돌리고 늘려 붙인다. 매 프레임 그라디언트·그림자 흐림 없음. 3차 효과는 1·2차보다 크고 금빛 테두리가 붙는다. */
Object.assign(CAST_T,CAST_T_J3MP);Object.assign(CHAN,CHAN_J3MP);
const J3MP_CT0=Object.assign({},CAST_T_J3MP);
const isJ3mp=id=>!!(SPELLS[id]&&SPELLS[id].job3&&J3MP_BR.includes(SPELLS[id].job3));
const MPJ={q:[],grounds:[],waves:[],gales:[],watchF:[],watchP:[],chain:null,clone:null,focus:null,frenzy:null,hist:new Map(),chW:null,fins:[],guards:new Map(),blades:[],spears:[],cages:[],init:false,cloning:0,tk:0,tkF:0,lastHeal:0};
const MPJ_QUAD=[['fire',{burn:1}],['ice',{slow:1,freeze:.25}],['storm',{j2arc:1}],['earth',{stun:.25,knock:24}]];
const MPJ_PRC=(id,n,el,cls)=>({id,n,el,rank:25,proc:1,cls,kind:'strike'});
const MPJ_PRISON=MPJ_PRC('j3prison','감옥 터짐','holy','priest'),MPJ_BOOM=MPJ_PRC('j3boom','낙인 폭발','holy','priest'),MPJ_GUARD=MPJ_PRC('j3guard','정령 반격','life','mage'),MPJ_FRZ=MPJ_PRC('j3frenzy','정령 폭주','fire','mage'),MPJ_CHN=MPJ_PRC('j3chain','정령 사슬','storm','mage');
const mpRise=(x,y,col,z)=>{if(parts.length<Q.pcap)rise(x,y,col,z)};
const mpBig=e=>{const t=TYPES[e.k]||{};return !!(t.boss||t.mini||e.boss)};
const mpBrand=e=>!!e&&e.markT>0&&!e.dead;
const mpAuth=()=>!NET.guest;
const mpDemon=e=>{const t=TYPES[e.k]||{};return !!(t.undead||t.demon||/demon|imp|fiend|devil|abyss|void|hell/i.test(e.k||''))};
const mpPw=(id,L,mult)=>power()*(mult||0)*dmgMul()*dmgScale(id,L);
const mpBrk=(e,a)=>{try{if(typeof breakAdd==='function')return breakAdd(e,a);if(typeof PTY==='object'&&PTY.stag&&!NET.guest)PTY.stag(e,a)}catch(err){if(window.__QA)throw err}return false};
function mpPeersIn(rad,dead){if(!NET.on)return[];const out=[];for(const r of NET.peers.values()){if(!(r.seen||r.name)||!netSame(r))continue;if(!!r.dead!==!!dead)continue;if(dist(r,P)<=rad)out.push(r)}return out}
function mpKindN(){if(typeof KINDN==='object'&&!KINDN.wave)Object.assign(KINDN,{wave:'물벽',gale:'모으기 폭풍',clone:'분신',fuse:'융합',spchain:'사슬',recall:'다시 부르기',brandburst:'낙인 터뜨리기',martyr:'희생 치유',consec:'축성',lswap:'생명 교환',miracle:'기적'})}
// 레벨에 따라 늘리지 않는 지속(설계의 초 그대로)
{const _ef=eff;eff=function(id,L){const e=_ef(id,L),s=SPELLS[id];if(s&&s.j3dur&&s.dur)e.dur=s.dur;return e}}
// 금서의 이해: 금기 마법 시전 시간 (CAST_T를 그때그때 고쳐 둔다 — 시전 표시·castmark도 같은 값)
function mpCastCut(){if(GHOST||!P||P.cls!=='mage')return;const cut=Math.min(.2,passSum('j3castCut')||0);for(const id of J3_FORBID)if(J3MP_CT0[id])CAST_T[id]=Math.round(J3MP_CT0[id]*(1-cut)*100)/100}
// 처음 한 번: CORE의 모으기 채널링 갈고리 · 받는 메시지 (CORE 파일은 이 파일 뒤에 읽히므로 실행 중에 건다)
function mpInit(){if(MPJ.init)return;MPJ.init=true;
  try{if(typeof j3OnCharge==='function')j3OnCharge('forbidgale',{start(st){mpGaleStart(st)},tick(st,dt){const g=MPJ.gales.find(o=>o.mine);if(g){mpGaleTick(g,dt,st.f);if(parts.length>Q.pcap)parts.splice(0,parts.length-Q.pcap)}},end(st){}})}catch(err){MPJ.init=false;if(window.__QA)throw err}
  try{if(typeof J3NET==='object'&&J3NET){J3NET.gale=(m,r)=>mpNetGale(m,r);J3NET.fin=(m,r)=>mpNetFin(m,r);J3NET.lswap=(m,r)=>mpNetSwap(m,r)}}catch(_){}}

/* ===== 시전 앞뒤 ===== */
function mpPre(id,t){const s0=SPELLS[id],G=GHOST,CM=CAST_MOD;
  const c={id,s0,t,G,CM,cd0:P.cd[id]||0,mp0:P.mp,nP:projs.length,nF:fields.length,nR:rains.length,nPd:pend.length,A:new Set(allies),ox:P.x,oy:P.y,rn:J2R.n,rel:J2R.el};
  if(G||CM)return c;
  if(!isJ3mp(id))return c;
  if(P.dead||!(skLv(id)>0)||(P.cd[id]||0)>0||P.mp<costOf(id))return c;// 원래 길(알림)로
  const nope=t=>{if(P.noMpT<=0){msg(`${s0.n}: ${t}`,'#a39d8f');P.noMpT=1.2}return false};
  if(id==='martyrprayer'){if(!mpPeersIn(s0.party).length)return nope('둘레에 치유할 동료가 없습니다 (같이 하기에서 씁니다)');if(P.hp<=Math.round(maxHp()*s0.sac)+1)return nope('바칠 생명력이 모자랍니다')}
  if(id==='lifeswap'){const R0=typeof PTY==='object'?PTY.pick():{r:null};if(!R0.r)return nope(NET.on?'고른 동료가 없습니다 (파티 창이나 이름표를 눌러 고르세요)':'같이 하기에서 동료를 골라 씁니다');
    const their=clamp((R0.r.hp||0)/(R0.r.max||1),0,1),mine=P.hp/maxHp();if(their>=mine-.02)return nope(`${R0.r.name||'동료'}님의 생명력이 나보다 적지 않습니다`);c.swap={r:R0.r,their,mine}}
  if(s0.chase){let b=null,bd=900;for(const e of enemies){if(!mpBrand(e))continue;const d=dist(e,t||P);if(d<bd){bd=d;b=e}}
    if(b){const a=Math.atan2(b.y-P.y,b.x-P.x),d=Math.max(0,dist(b,P)-30);c.t={x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d};c.chased=b}}
  if(s0.pheal&&typeof PTY==='object'){const R0=PTY.pick();if(R0.r){const a=Math.atan2(R0.r.y-P.y,R0.r.x-P.x),d=Math.max(0,dist(R0.r,P)-40);c.t={x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d};c.ally=R0.r}}
  return c}
function mpDid(c){return c.G||c.CM?true:(P.cd[c.id]||0)>c.cd0+1e-9}
function mpPost(c){const id=c.id,s0=c.s0,G=c.G;if(!s0)return;
  const did=mpDid(c);
  // 원소 공명 6중첩 (금서의 이해): 2차 job2Post가 4로 묶은 뒤 이어서 올린다
  if(did&&!G&&!c.CM&&P.cls==='mage'&&isDmg(s0)&&s0.el!=='phys'){const mx=passSum('resonMax')|0;if(mx>0&&c.rn>=4&&c.rel&&c.rel!==s0.el){J2R.n=Math.min(4+mx,c.rn+1);J2R.t=8;ftext(P.x,P.y-34,`원소 공명 ${J2R.n}`,'#d8c8ff',false,70)}}
  if(!did)return;
  // 마력 분신: 내가 쓴 공격 마법을 따라 씀
  if(!G&&!c.CM&&!MPJ.cloning&&MPJ.clone&&!MPJ.clone.gone&&!s0.forbid)mpCloneCast(c);
  if(!G&&s0.kind==='summon'&&s0.cls==='mage')MPJ.hist.set(id,time);
  if(!isJ3mp(id))return;
  const L=Math.max(1,skLv(id)),s=eff(id,L);if(G)s.ghost=1;
  // 마력 역류: 금기 마법 마나 25% 돌려받기
  if(!G&&J3_FORBID.includes(id)){const b=P.buffs.manaflux;if(b&&b.t>0&&b.j3cost){const back=Math.round(costOf(id)*b.j3cost);P.mp=Math.min(maxMp(),P.mp+back);ftext(P.x,P.y-46,`마나 +${back}`,'#8fb0ff',false,80)}}
  const tg=c.t||{x:P.x+Math.cos(P.face)*200,y:P.y+Math.sin(P.face)*200};
  switch(s0.kind){
    case'bolt':{const np=projs.slice(c.nP).filter(p=>p.s&&p.s.id===id);
      if(s0.quad&&np.length)mpQuad(np[0],c,s);
      if(s0.seekBrand&&!G){let b=null,bd=760;for(const e of enemies){if(!mpBrand(e))continue;const d=dist(e,P);if(d<bd){bd=d;b=e}}if(b)for(const p of np){p.j3seek=b;p.life=Math.max(p.life,2)}}
      if(s0.focus&&!G){const e=r22First(tg,220,s0);if(e){MPJ.focus={e,t:s0.focus};rings.push({x:e.x,y:e.y,r:8,max:e.r*2.6,life:.6,col:'#d8c8ff'});ftext(e.x,e.y-30,'집중 공격','#d8c8ff',false,e.r*2+40)}}
      break}
    case'wave':mpWave(c,s,L);break;
    case'gale':mpGaleFire(c,s,L);break;
    case'clone':if(!G)mpCloneMake(s,L);else burst(P.x,P.y,EL.arcane,30,160,3,30);break;
    case'fuse':if(!G)mpFuse(s,L,tg);else rings.push({x:P.x,y:P.y,r:10,max:120,life:.6,col:'#d8c8ff'});break;
    case'spchain':mpChainMake(s,L,tg,G);break;
    case'recall':if(!G)mpRecall(s,L);break;
    case'brandburst':mpBrandBurst(s,L,tg,G);break;
    case'martyr':mpMartyr(c,s,L);break;
    case'consec':if(!G)mpConsec(s,L,null);break;
    case'lswap':if(!G&&c.swap)mpSwap(c,s);break;
    case'miracle':if(!G)mpMiracle(s,L,null);break;
    case'field':{const nf=fields.slice(c.nF).filter(f=>f.s&&f.s.id===id);for(const f of nf){f.j3=1;if(s0.ash)MPJ.watchF.push({f,kind:'ash'})}
      if(nf.length&&(s0.release||s0.rift||s0.throne||s0.condemn||s0.sanct))mpFieldFx(nf[0],s0);break}
    case'strike':{const np=pend.slice(c.nPd).filter(m=>m.s&&m.s.id===id);for(const m of np){m.j3=1;const w={m,id,L,s,ghost:!!G};MPJ.watchP.push(w);if(s0.exec3){w.blade={x:m.x,y:m.y,t:0,max:m.max+.35};MPJ.blades.push(w.blade);w.follow=nearestEnemy(m,160)}}break}
    case'beam':if(s0.brandBoom){const a=P.face;MPJ.spears.push({x:P.x,y:P.y,a,len:s.len,t:0,max:.32,w:s.w})}break;
    case'rain':{const nr=rains.slice(c.nR).filter(r=>r.s&&r.s.id===id);for(const r of nr)r.j3=1;break}
    case'summon':if(s0.form==='sovereign'&&!G)for(const a of allies)if(!c.A.has(a)&&a.s&&a.s.id===id)mpSovSetup(a,s);break;
    case'buff':if(!G){if(s0.boom)MPJ.frenzy={t:s.dur,pw:mpPw(id,L,s0.boom.mult),rad:s0.boom.rad};if(s0.j3cost&&P.buffs[id])P.buffs[id].j3cost=s0.j3cost;
      if(s0.advent){banner={t:s0.n,sub:`${s0.kn} · 20초 동안 네 원소의 정령왕`,col:'#e8d8ff',life:2,max:2};flash={col:'#c8b0ff',a:.3};for(let i=0;i<4;i++)rings.push({x:P.x,y:P.y,r:10,max:120+i*60,life:.5+i*.15,col:EL[MPJ_QUAD[i][0]]})}}break;
    case'blink':if(s0.pheal&&!G){const h=Math.round((maxHp()*s0.pheal.pct+power()*s0.pheal.mult)*supScale(L));healP(h);if(c.ally)beams.push({x1:P.x,y1:P.y,x2:c.ally.x,y2:c.ally.y,z:30,w:6,life:.35,max:.35,col:EL.holy,el:'holy',rank:6});rings.push({x:P.x,y:P.y,r:10,max:90,life:.5,col:'#fff2c0'})}
      if(s0.chase){beams.push({x1:c.ox,y1:c.oy,x2:P.x,y2:P.y,z:24,w:16,life:.4,max:.4,col:EL.holy,el:'holy',rank:9});rings.push({x:P.x,y:P.y,r:10,max:120,life:.45,col:'#fff2c0'})}break;
  }}
// 시전 시간 마법은 다 외운 순간 cast.js가 안쪽 길로 바로 쓴다 → 같은 앞뒤 처리
{const _cr=_castRelease;_castRelease=function(cu){const s0=SPELLS[cu.id];if(!s0||(!isJ3mp(cu.id)&&!(MPJ.clone&&!MPJ.clone.gone)))return _cr(cu);
  mpInit();const c=mpPre(cu.id,cu.tg);if(c===false)return;_cr(cu);try{mpPost(c)}catch(err){if(window.__QA)throw err}}}
{const _tc=tryCast;tryCast=function(id,t){mpInit();const s0=SPELLS[id];if(!s0)return _tc(id,t);
  if(isJ3mp(id))mpCastCut();
  const c=mpPre(id,t);if(c===false)return;const r=_tc(id,c.t||t);
  if(isJ3mp(id)||(MPJ.clone&&!MPJ.clone.gone)||P.cls==='mage'){try{mpPost(c)}catch(err){if(window.__QA)throw err}}return r}}
// 분신이 따라 쓴 마법은 같이 하기에 다시 보내지 않는다 (동료 화면에서 내 자리에 한 번 더 그려지지 않게)
{const _nc=netCast;netCast=function(){if(MPJ.cloning)return;return _nc.apply(this,arguments)}}
// 성흔: 동료에게 가는 치유의 주문력 (시전 메시지 pw)
{const _ct=PTY.castTag;PTY.castTag=function(id,o){_ct.call(this,id,o);const s=SPELLS[id];if(s&&o&&P.cls==='priest'&&!GHOST&&['heal','hot','blink'].includes(s.kind)){const k=mpStig();if(k>0)o.pw=Math.round((o.pw||power())*(1+k))}}}
const mpStig=()=>{if(GHOST||!P||P.cls!=='priest')return 0;const v=passSum('stigma')||0;return v>0?v*clamp(1-P.hp/maxHp(),0,1):0};

/* ===== 원소 사중탄 ===== */
function mpQuad(p0,c,s){const a=Math.atan2(p0.vy,p0.vx),sp=Math.hypot(p0.vx,p0.vy)||s.spd,ox=c.ox,oy=c.oy,dmg=p0.dmg;
  const mk=(i,x,y)=>{const [el,fx]=MPJ_QUAD[i];return Object.assign({},p0.s,{el,quad:0,j3q:i},fx)};
  p0.s=mk(0);p0.col=EL.fire;p0.r=10;
  for(let i=1;i<4;i++){const ss=mk(i);MPJ.q.push({t:i*.09,fn:()=>{projs.push({x:ox+Math.cos(a)*16,y:oy+Math.sin(a)*16,z:20,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:10,dmg,owner:'p',s:ss,life:1.4,col:EL[ss.el],hit:null});burst(ox,oy,EL[ss.el],5,70,2.5,24)}})}}

/* ===== 금기: 대해일 (물벽) ===== */
function mpWave(c,s,L){const a0=c.t?Math.atan2(c.t.y-c.oy,c.t.x-c.ox):NaN,a=isFinite(a0)&&(c.t.x!==c.ox||c.t.y!==c.oy)?a0:P.face;
  const w={x:c.ox,y:c.oy,a,cx:Math.cos(a),cy:Math.sin(a),len:s.len,w:s.w,spd:s.spd||950,d:0,dmg:c.G?0:mpPw(c.id,L,s.mult),s,hit:new Set(),carry:new Set(),ghost:!!c.G,brk:s.brk||25,t:0};
  MPJ.waves.push(w);shake=Math.max(shake,7);flash={col:'#8fd8ff',a:.18};for(let i=0;i<20;i++)burst(c.ox+w.cx*40+(-w.cy)*(i-10)*36,c.oy+w.cy*40+w.cx*(i-10)*36,'#cfeeff',3,120,3,16)}
function mpWaveTick(w,dt){w.t+=dt;const d0=w.d;w.d+=w.spd*dt;const auth=mpAuth();
  for(const e of enemies){if(e.dead)continue;const rx=e.x-w.x,ry=e.y-w.y,al=rx*w.cx+ry*w.cy,pp=Math.abs(-rx*w.cy+ry*w.cx);
    if(pp>w.w/2+hR(e))continue;
    if(!w.hit.has(e)&&al>=d0-40-hR(e)&&al<=Math.min(w.d,w.len)+hR(e)+10){w.hit.add(e);
      if(!w.ghost){hurtE(e,w.dmg*rnd(.9,1.1),w.s);applyFx(e,{slow:1},{x:e.x-w.cx*10,y:e.y-w.cy*10});if(mpBig(e))mpBrk(e,w.brk)}
      if(auth){if(mpBig(e))e.stunT=Math.max(e.stunT||0,.6);else w.carry.add(e)}
      burst(e.x,e.y,'#cfeeff',8,140,3,20)}
    if(auth&&w.carry.has(e)&&al<w.d-6&&w.d<=w.len){const k=Math.min(w.d-al,w.spd*dt*1.2);moveBody(e,w.cx*k,w.cy*k);e.stunT=Math.max(e.stunT||0,.12)}}
  if(R()<.8){const f=rnd(-.5,.5),x=w.x+w.cx*w.d-w.cy*f*w.w,y=w.y+w.cy*w.d+w.cx*f*w.w;if(parts.length<Q.pcap)parts.push({x,y,z:rnd(20,70),vx:w.cx*rnd(60,160),vy:w.cy*rnd(60,160),vz:rnd(40,160),g:1,life:.6,max:.6,col:'#e8f8ff',sz:rnd(2,4)})}
  return w.d<w.len+60}

/* ===== 금기: 태풍 (모으기) ===== */
function mpMkGale(x,y,s,L,mine,ghost){const g={x,y,s,L,rad:s.rad,rad0:s.rad,radMax:s.radMax||s.rad*1.8,t:0,tick:.3,f:0,mine:!!mine,ghost:!!ghost,id:s.id,dmg:ghost?0:mpPw(s.id,L,s.mult),rot:R()*6.283};MPJ.gales.push(g);return g}
function mpGaleStart(st){const s=eff('forbidgale',st.L||skLv('forbidgale')||1),t=clampRange(st.tg||aimPoint(),520);
  MPJ.gales=MPJ.gales.filter(o=>!o.mine);const g=mpMkGale(t.x,t.y,s,st.L||skLv('forbidgale')||1,true,false);
  rings.push({x:g.x,y:g.y,r:10,max:g.rad,life:.6,col:EL.storm});if(NET.on)j3Send('gale',{x:Math.round(g.x),y:Math.round(g.y),d:5})}
function mpGaleTick(g,dt,f){g.t+=dt;if(f!=null)g.f=clamp(f,0,1);else if(g.auto)g.f=clamp(g.t/g.auto,0,1);g.rad=g.rad0+(g.radMax-g.rad0)*g.f;g.rot+=dt*(2+g.f*3);
  if(mpAuth())for(const e of enemies){if(e.dead)continue;const d=dist(e,g);if(d>14&&d<g.rad+e.r+30){const k=(mpBig(e)?30:150+90*g.f)*dt;moveBody(e,(g.x-e.x)/d*k,(g.y-e.y)/d*k)}}
  g.tick-=dt;if(g.tick<=0){g.tick=.5;if(!g.ghost)for(const e of enemies)if(!e.dead&&dist(e,g)<g.rad+hR(e)){hurtE(e,g.dmg*rnd(.9,1.1),g.s);if(R()<.3)zap({x:g.x+rnd(-40,40),y:g.y+rnd(-40,40),z:260},{x:e.x,y:e.y,z:10},Object.assign({life:.2},stormStyle(9)))}}
  for(let i=0;i<2;i++){const a=R()*6.283,r=Math.sqrt(R())*g.rad;if(parts.length<Q.pcap)parts.push({x:g.x+Math.cos(a)*r,y:g.y+Math.sin(a)*r,z:rnd(10,120),vx:-Math.sin(a)*160,vy:Math.cos(a)*160,vz:rnd(20,80),life:.5,max:.5,col:i?'#cfe0ff':'#8a8a98',sz:rnd(2,4)})}}
function mpGaleFire(c,s,L){const k=c.CM&&c.CM.mul||(c.G?1.6:1),f=c.CM&&c.CM.charge!=null?c.CM.charge:null;
  let g=c.G?null:MPJ.gales.find(o=>o.mine);
  if(c.G){const gi=MPJ.gales.findIndex(o=>o.ghost&&o.by===GHOST.id);if(gi>=0){g=MPJ.gales[gi];MPJ.gales.splice(gi,1)}const p=g||clampRange(c.t||P,520);mpGaleBoom(p.x,p.y,g?g.rad:s.radMax*.8,0,s,1,true);return}
  if(!g&&f==null){// 모으기 장치가 없는 판(또는 손 입력 없는 시전): 겨눈 곳에서 2.5초 동안 저절로 커졌다가 터진다
    const t=clampRange(c.t||aimPoint(),520);g=mpMkGale(t.x,t.y,s,L,true,false);g.auto=2.5;g.autoK=1+(s.charge.mul-1)*.6;return}
  if(!g){const t=clampRange(c.t||aimPoint(),520);g={x:t.x,y:t.y,rad:s.rad+(s.radMax-s.rad)*(f||0)}}
  MPJ.gales=MPJ.gales.filter(o=>o!==g);mpGaleBoom(g.x,g.y,g.rad,mpPw(c.id,L,s.boom.mult)*k,s,k,false)}
function mpGaleBoom(x,y,rad,dmg,s,k,ghost){shake=Math.max(shake,10);flash={col:'#cfe0ff',a:.28};rings.push({x,y,r:10,max:rad*1.15,life:.7,col:EL.storm});rings.push({x,y,r:10,max:rad*.7,life:.5,col:'#ffffff'});arcs.push({x,y,rad,t:1.2,col:'#f6eeff',glow:'#b48cff'});
  for(let i=0;i<6;i++)zap({x:x+rnd(-80,80),y:y+rnd(-80,80),z:520},{x:x+rnd(-rad*.5,rad*.5),y:y+rnd(-rad*.5,rad*.5),z:0},Object.assign({life:.5,seg:14},stormStyle(9)));burst(x,y,'#cfe0ff',80,rad*2.2,5,30);decal(x,y,rad*.6,'storm');
  ftext(x,y-40,`×${(Math.round(k*10)/10)}`,'#fff6b0',true,90);
  if(ghost)return;const ss=Object.assign({},s,{stun:s.boom.stun,kind:'strike'});for(const e of enemies)if(!e.dead&&dist(e,{x,y})<rad+hR(e)){hurtE(e,dmg*rnd(.9,1.1),ss);applyFx(e,{stun:s.boom.stun},{x,y});if(mpBig(e))mpBrk(e,20+20*clamp(k-1,0,1.2))}}

/* ===== 마력 분신 ===== */
function mpCloneMake(s,L){if(MPJ.clone)MPJ.clone.gone=true;allies=allies.filter(a=>a!==MPJ.clone);const a0=P.face+1.571,x=P.x+Math.cos(a0)*70,y=P.y+Math.sin(a0)*70,p=DG?dgLand(P.x,P.y,x,y):{x,y};
  const hp=Math.round(maxHp()*.8);const a={ally:1,j3f:'clone',x:p.x,y:p.y,hp,max:hp,r:13,dmg:0,t:s.dur,k:s.clone.k,face:P.face,s:{id:'manaclone',cls:'mage',el:'arcane',kind:'summon',form:'clone',n:s.n,rank:29},atkCd:0,anim:0,fx:1,lunge:0,hurt:0};
  allies.push(a);MPJ.clone=a;rings.push({x:a.x,y:a.y,r:6,max:90,life:.6,col:'#d8c8ff'});burst(a.x,a.y,'#d8c8ff',40,160,3,30);msg(`${s.n}: 10초 동안 분신이 공격 마법을 따라 씁니다`,EL.arcane)}
const MPJ_CLONE_K=new Set(['bolt','chain','nova','strike','beam','cone','rain','field','wave']);
function mpCloneCast(c){const id=c.id,s0=c.s0,a=MPJ.clone;if(!a||a.gone||!allies.includes(a)||!isDmg(s0)||s0.forbid||chanOf(id)||s0.charge||!MPJ_CLONE_K.has(s0.kind)||id==='manaclone'||s0.cls!==P.cls)return;
  const keep={x:P.x,y:P.y,face:P.face};MPJ.cloning=1;P.x=a.x;P.y=a.y;const t=c.t||{x:keep.x+Math.cos(keep.face)*200,y:keep.y+Math.sin(keep.face)*200};
  const CM0=CAST_MOD,nP=projs.length;CAST_MOD={free:1,mul:a.k,share:a.k,ov:null,tick:0};
  try{castOrig(id,t);if(s0.quad){const np=projs.slice(nP).filter(p=>p.s&&p.s.id===id);if(np.length)mpQuad(np[0],{ox:a.x,oy:a.y},eff(id,Math.max(1,skLv(id))))}}finally{CAST_MOD=CM0;a.face=Math.atan2(t.y-a.y,t.x-a.x);P.x=keep.x;P.y=keep.y;P.face=keep.face;MPJ.cloning=0}
  heroCast(a.body||(a.body=mpCloneBody()),s0.el);circles.push({x:a.x,y:a.y,r:40,life:.5,max:.5,col:'#d8c8ff',rot:R()*6})}
function mpCloneBody(){const b=Object.create(P);b.moving=false;b.walk=0;return b}

/* ===== 정령왕의 계약자: 융합 · 사슬 · 귀환 · 군주 · 왕좌 ===== */
const mpPets=()=>allies.filter(a=>a.j2&&!a.gone&&!a.wisp&&a.s&&a.s.cls==='mage');
function mpMkSpirit(form,x,y,dmg,hp,t,s){const p=DG?dgLand(P.x,P.y,x,y):{x,y};
  const a={ally:1,j2:1,j3f:form,x:p.x,y:p.y,hp,max:hp,r:form==='sovereign'?34:22,dmg,t,s:Object.assign({},s,{form,dur:t}),atkCd:.3,anim:0,fx:1,lunge:0,hurt:0,tt:1,ei:0};
  a.hs={id:s.id,cls:'mage',el:s.el,kind:'summon',rank:s.rank,job3:s.job3,n:s.n,L:s.L};allies.push(a);return a}
function mpFuse(s,L,tg){const pets=mpPets().filter(a=>a.j3f!=='fusion').sort((a,b)=>dist(a,P)-dist(b,P)).slice(0,2);
  const base=mpPw('spiritfusion',L,s.mult),hp0=Math.round(maxHp()*1.5*supScale(L));
  let dmg=0,hp=0;for(const a of pets){dmg+=a.dmg;hp+=a.max;a.gone=true;burst(a.x,a.y,'#d8c8ff',20,140,3,20);beams.push({x1:a.x,y1:a.y,x2:P.x,y2:P.y,z:30,w:5,life:.4,max:.4,col:'#d8c8ff',el:'arcane',rank:6})}
  allies=allies.filter(a=>!a.gone);const miss=2-pets.length;dmg=(dmg+base*.5*miss)*1.3;hp=Math.round((hp+hp0*.5*miss)*1.3);
  const a0=P.face,x=P.x+Math.cos(a0)*60,y=P.y+Math.sin(a0)*60,a=mpMkSpirit('fusion',x,y,dmg,hp,s.dur,s);
  rings.push({x:a.x,y:a.y,r:10,max:160,life:.7,col:'#d8c8ff'});burst(a.x,a.y,'#ffd27a',50,200,4,30);flash={col:'#c8b0ff',a:.15};
  msg(pets.length>=2?`${s.n}: 두 소환수가 상급 정령이 되었습니다 (25초)`:`${s.n}: 소환수가 모자라 약한 상급 정령이 나왔습니다`,EL.arcane)}
function mpSovSetup(a,s){a.j2=1;a.j3f='sovereign';j2Setup(a,s,0);a.r=34;a.ei=0;a.atkCd=.6;a.hs.job3=s.job3;rings.push({x:a.x,y:a.y,r:10,max:240,life:.9,col:'#e8d8ff'});shake=Math.max(shake,8);flash={col:'#c8b0ff',a:.22};
  for(let i=0;i<4;i++)burst(a.x,a.y,EL[MPJ_QUAD[i][0]],20,220,4,40)}
function mpChainMake(s,L,tg,G){if(G){burst(P.x,P.y,EL.storm,20,140,3,30);return}
  const pets=mpPets().slice(0,6);let nodes=null;
  if(!pets.length){const a=Math.atan2(tg.y-P.y,tg.x-P.x)+1.571;nodes=[{x:tg.x+Math.cos(a)*90,y:tg.y+Math.sin(a)*90,t:s.dur},{x:tg.x-Math.cos(a)*90,y:tg.y-Math.sin(a)*90,t:s.dur}];for(const n of nodes)burst(n.x,n.y,'#fff6b0',16,120,3,30)}
  MPJ.chain={t:s.dur,tick:0,zt:0,dmg:mpPw('spiritchain',L,s.mult)*.25,nodes,s};msg(`${s.n}: ${pets.length?`나와 소환수 ${pets.length}이(가) 이어졌습니다`:'작은 정령 둘을 불러 이었습니다'}`,EL.storm)}
function mpChainPts(){const C=MPJ.chain;if(!C)return[];if(C.nodes)return C.nodes;const pts=[P];for(const a of mpPets().slice(0,6))pts.push(a);
  if(pts.length>2){const c0=pts.slice(1).sort((a,b)=>Math.atan2(a.y-P.y,a.x-P.x)-Math.atan2(b.y-P.y,b.x-P.x));return[P].concat(c0)}return pts}
function mpChainTick(dt){const C=MPJ.chain;if(!C)return;C.t-=dt;if(C.t<=0||P.dead){MPJ.chain=null;return}const pts=mpChainPts();if(pts.length<2)return;
  C.zt-=dt;if(C.zt<=0){C.zt=.11;const st=stormStyle(9);for(let i=0;i+1<pts.length;i++)zap({x:pts[i].x,y:pts[i].y,z:30},{x:pts[i+1].x,y:pts[i+1].y,z:30},Object.assign({},st,{life:.14,w:2.6}));if(pts.length>3)zap({x:pts[pts.length-1].x,y:pts[pts.length-1].y,z:30},{x:pts[1].x,y:pts[1].y,z:30},Object.assign({},st,{life:.14,w:2}))}
  C.tick-=dt;if(C.tick>0)return;C.tick=.25;const segs=[];for(let i=0;i+1<pts.length;i++)segs.push([pts[i],pts[i+1]]);if(pts.length>3)segs.push([pts[pts.length-1],pts[1]]);
  const ss=Object.assign({},C.s,{kind:'chain'});for(const e of enemies){if(e.dead)continue;for(const [a,b] of segs)if(segDist(e.x,e.y,a.x,a.y,b.x,b.y)<26+hR(e)){hurtE(e,C.dmg*rnd(.9,1.1),ss);if(R()<.25)burst(e.x,e.y,EL.storm,6,90,2.5,20);break}}}
function mpRecall(s,L){let n=0;const alive=new Set(allies.filter(a=>!a.gone&&a.s).map(a=>a.s.id));
  for(const [id,t] of MPJ.hist){const s1=SPELLS[id];if(!s1||time-t>120||alive.has(id)||!(skLv(id)>0)||s1.legion||id==='spiritsovereign'||(s1.cd||0)>30)continue;
    P.cd[id]=0;const L1=skLv(id);if(s1.job2)j2Summon(id,L1,{x:P.x+rnd(-60,60),y:P.y+rnd(-60,60)});else{const keep=CAST_MOD;CAST_MOD={free:1,mul:1,share:1,ov:null,tick:0};try{castOrig(id,{x:P.x+rnd(-60,60),y:P.y+rnd(-60,60)})}finally{CAST_MOD=keep}}n++}
  if(!n){P.cd.spiritreturn=0;P.mp=Math.min(maxMp(),P.mp+costOf('spiritreturn'));msg(`${s.n}: 다시 부를 소환수가 없습니다 (최근 2분 안에 부른 것)`,'#a39d8f');return}
  rings.push({x:P.x,y:P.y,r:10,max:200,life:.8,col:'#d8c8ff'});burst(P.x,P.y,'#d8c8ff',50,200,3,30);msg(`${s.n}: 소환수 ${n}을(를) 다시 불렀습니다`,EL.arcane)}
// 소환수 한 마리의 1프레임: 계약자의 명령(집중 공격) · 왕좌 · 3차 소환수(상급 정령 · 원소 군주)
{const _at=j2AllyTick;j2AllyTick=function(a,dt){
  if(a.j3thrT>0){a.j3thrT-=dt;if(a.j3thrT<=0&&a.dmg0){a.dmg=a.dmg0;a.dmg0=0}}
  if(a.j3f)return mpAllyTick(a,dt);
  const F=MPJ.focus;if(F&&F.e&&!F.e.dead&&dist(F.e,a)<900&&enemies.includes(F.e)){const keep=enemies;enemies=[F.e];try{return _at(a,dt)}finally{enemies=keep}}
  return _at(a,dt)}}
function mpAllyTick(a,dt){const s=a.s,sp=1+j2PetSpd();a.t-=dt;a.anim+=dt;a.atkCd-=dt*sp;a.hurt-=dt;a.lunge=Math.max(0,a.lunge-dt);
  if(a.aw){a.aw.t-=dt;if(a.aw.t<=0){if(a.awHp){a.max=Math.round(a.max/a.awHp);a.hp=Math.min(a.hp,a.max);a.awHp=0}a.aw=null}}
  const F=MPJ.focus;let tg=null,bd=640;if(F&&F.e&&!F.e.dead&&dist(F.e,a)<900&&enemies.includes(F.e)){tg=F.e;bd=dist(F.e,a)}else for(const e of enemies){if(e.dead)continue;const d=dist(e,a);if(d<bd){bd=d;tg=e}}
  let mx=0,my=0;const spd=(a.j3f==='sovereign'?100:125)*sp;
  if(tg){a.fx=((tg.x-a.x)-(tg.y-a.y))>=0?1:-1;const d=bd;
    if(a.j3f==='fusion'){if(d>300){mx=(tg.x-a.x)/d;my=(tg.y-a.y)/d}else if(d<120){mx=-(tg.x-a.x)/d;my=-(tg.y-a.y)/d}
      if(d<480&&a.atkCd<=0){a.atkCd=.9;a.lunge=.2;const an=Math.atan2(tg.y-a.y,tg.x-a.x);projs.push({x:a.x,y:a.y,z:40,vx:Math.cos(an)*520,vy:Math.sin(an)*520,r:11,dmg:a.dmg,owner:'p',s:Object.assign({},a.hs,{el:'fire',burn:1,slow:1,j2arc:1}),life:1.3,col:'#ffb070',hit:null})}}
    else{const reach=a.r+tg.r+(s.slam?s.slam.rad*.5:20);if(d>reach){mx=(tg.x-a.x)/d;my=(tg.y-a.y)/d}
      if(d<=reach+30&&a.atkCd<=0){a.atkCd=(s.slam&&s.slam.iv)||1.6;a.lunge=.3;const el=MPJ_QUAD[a.ei++%4][0],fx=MPJ_QUAD[(a.ei+3)%4][1],rad=(s.slam&&s.slam.rad)||170,hs=Object.assign({},a.hs,{el},fx);
        rings.push({x:tg.x,y:tg.y,r:10,max:rad,life:.5,col:EL[el]});burst(tg.x,tg.y,EL[el],34,rad*1.8,4,20);decal(tg.x,tg.y,rad*.5,el);shake=Math.max(shake,4);
        for(const e of enemies)if(!e.dead&&dist(e,tg)<rad+hR(e)){hurtE(e,a.dmg*rnd(.9,1.1),hs);applyFx(e,hs,a)}}}}
  else{const d=dist(a,P);if(d>110){mx=(P.x-a.x)/d;my=(P.y-a.y)/d;a.fx=((P.x-a.x)-(P.y-a.y))>=0?1:-1}}
  moveBody(a,mx*spd*dt,my*spd*dt);
  if(a.hp<=0||a.t<=0){a.gone=true;burst(a.x,a.y,'#d8c8ff',40,180,3.5,30);if(a.j3f==='sovereign')for(let i=0;i<4;i++)burst(a.x,a.y,EL[MPJ_QUAD[i][0]],14,200,3,40)}}
// 분신(소환수 아님): 기존 소환수 처리와 섞이지 않게 따로 돈다
{const _ua=updateAllies;updateAllies=function(dt){const mine=allies.filter(a=>a.j3f==='clone');if(!mine.length)return _ua(dt);allies=allies.filter(a=>a.j3f!=='clone');try{_ua(dt)}finally{
    for(const a of mine){a.t-=dt;a.anim+=dt;a.hurt-=dt;if(a.hp<=0||a.t<=0||P.dead){a.gone=true;burst(a.x,a.y,'#d8c8ff',30,160,3,30);if(MPJ.clone===a)MPJ.clone=null}}
    allies=allies.concat(mine.filter(a=>!a.gone))}}}

/* ===== 빛의 집행자: 낙인 터뜨리기 ===== */
function mpBrandBurst(s,L,tg,G){const pw=G?0:mpPw('brandspread',L,s.mult),ss=Object.assign({},s,{kind:'nova'}),br={mark:s.brand};
  const blast=(x,y,rad,dmg)=>{rings.push({x,y,r:10,max:rad,life:.55,col:'#ffe39a'});rings.push({x,y,r:6,max:rad*.55,life:.35,col:'#ffffff'});pillars.push({x,y,w:rad*.45,life:.45,max:.45,col:EL.holy});burst(x,y,'#ffe39a',40,rad*1.8,4,30);decal(x,y,rad*.5,'holy');
    if(G)return;for(const o of enemies)if(!o.dead&&dist(o,{x,y})<rad+hR(o)){hurtE(o,dmg*rnd(.9,1.1),ss);applyFx(o,br,{x,y})}};
  const marked=G?[]:enemies.filter(e=>mpBrand(e)&&dist(e,P)<600);
  if(marked.length){shake=Math.max(shake,6);for(const e of marked)blast(e.x,e.y,s.rad,pw);msg(`${s.n}: 낙인 ${marked.length}개를 터뜨렸습니다`,EL.holy);return}
  const e=r22First(tg,220,s);const p=e?{x:e.x,y:e.y}:clampRange(tg,R22.cap);blast(p.x,p.y,s.rad*.7,pw*.5)}

/* ===== 성자: 순교 · 축성 · 교환 · 기적 ===== */
function mpMartyr(c,s,L){if(c.G)return;const sac=Math.round(maxHp()*s.sac);P.hp=Math.max(1,P.hp-sac);ftext(P.x,P.y,'-'+sac,'#ff9a8a');P.hurtT=.25;
  const peers=mpPeersIn(s.party);for(const r of peers){beams.push({x1:P.x,y1:P.y,x2:r.x,y2:r.y,z:30,w:7,life:.5,max:.5,col:'#ff8a8a',el:'holy',rank:9});burst(r.x,r.y,'#ffd0c0',26,120,3,30)}
  rings.push({x:P.x,y:P.y,r:10,max:s.party*.6,life:.8,col:'#ffb0a0'});burst(P.x,P.y,'#ff6a6a',30,140,3,30);msg(`${s.n}: 생명력 ${sac}을(를) 바쳐 동료 ${peers.length}명을 치유합니다`,'#ffb0a0')}
function mpMartyrAmt(maxH,pw,s,L){return Math.round(maxH*s.sac*s.hmul+pw*s.hpw*supScale(L))}
function mpCleanseOne(){let did='';if(typeof PTY==='object'&&PTY.pull){PTY.pull=null;did='끌려감'}
  else for(const k of ['j3deb','j2deb','poisonT','fearT','rootT','stunT','slowT','silenceT'])if(P[k]>0){P[k]=0;did=k;break}
  if(did)burst(P.x,P.y,'#fff2c0',14,90,2.5,24);return did}
function mpConsec(s,L,from){const who=from?from.name||'동료':'';let n=0;
  for(const id in P.buffs){const b=P.buffs[id];if(!b||id.startsWith('_')||!SPELLS[id]||SPELLS[id].cls!=='priest')continue;if((b.by||'')===who&&b.max>0){b.t=b.max;n++}}
  const cl=mpCleanseOne();healP(Math.round(maxHp()*(s.heal||.06)*supScale(L)));rings.push({x:P.x,y:P.y,r:8,max:80,life:.6,col:'#fff2c0'});burst(P.x,P.y,'#fff2c0',24,110,3,40);
  if(!from)rings.push({x:P.x,y:P.y,r:10,max:s.party*.7,life:.8,col:'#ffe39a'});
  msg(`${from?`${who}님의 `:''}${s.n}: 축복 ${n}개 새로${cl?' · 해로운 효과 하나 지움':''}`,EL.holy)}
function mpSwap(c,s){const r=c.swap.r,their=c.swap.their,mine=P.hp/maxHp();P.hp=Math.max(1,Math.round(maxHp()*their));P.hurtT=.25;
  j3Send('lswap',{ratio:Math.round(mine*1000)/1000,n:s.n},r.id);beams.push({x1:P.x,y1:P.y,x2:r.x,y2:r.y,z:30,w:8,life:.6,max:.6,col:'#ffb0a0',el:'holy',rank:9});burst(r.x,r.y,'#9fe39a',24,120,3,30);
  msg(`${s.n}: ${r.name||'동료'}님과 생명력을 바꿨습니다 (${Math.round(mine*100)}% ↔ ${Math.round(their*100)}%)`,EL.holy)}
function mpNetSwap(m,r){if(P.dead||!r||(m.to&&m.to!==NET.id))return;const k=clamp(+m.ratio||0,0,1);if(k<=P.hp/maxHp())return;P.hp=Math.max(1,Math.round(maxHp()*k));burst(P.x,P.y,'#9fe39a',30,120,3,30);rings.push({x:P.x,y:P.y,r:8,max:70,life:.6,col:'#9fe39a'});msg(`${r.name||'동료'}님의 ${m.n||'생명 교환'}: 생명력 ${Math.round(k*100)}%`,EL.holy)}
function mpMiracle(s,L,from){P.hp=maxHp();P.invT=Math.max(P.invT,s.inv||4);MPJ.mir={t:Math.max(1.5,s.inv||4),max:Math.max(1.5,s.inv||4)};
  rings.push({x:P.x,y:P.y,r:10,max:160,life:.9,col:'#ffe39a'});burst(P.x,P.y,'#fff6d0',60,220,4,60);pillars.push({x:P.x,y:P.y,w:70,life:1,max:1,col:'#fff2c0'});
  if(!from){flash={col:'#fff2c0',a:.3};banner={t:s.n,sub:`${s.kn} · 파티 전원 회복 · ${s.inv}초 무적`,col:'#ffe39a',life:2,max:2}}
  msg(`${from?`${from.name||'동료'}님의 `:''}${s.n}: 생명력 가득 · ${s.inv}초 동안 어떤 피해도 받지 않음`,'#ffe39a')}

/* ===== 장판 효과 (원소 해방 · 시간의 틈 · 정령 왕좌 · 정죄의 결계 · 성소) ===== */
function mpFieldFx(f,s0){f.j3=1;rings.push({x:f.x,y:f.y,r:10,max:f.rad,life:.7,col:s0.sanct?'#fff2c0':s0.throne?'#e8d8ff':EL[s0.el]});if(s0.rift)flash={col:'#b9a2ff',a:.12}}
function mpFieldTick(dt){MPJ.tkF-=dt;const slow=MPJ.tkF<=0;if(slow)MPJ.tkF=.25;const auth=mpAuth();
  for(const f of fields){const s=f.s;if(!s||!s.job3||f.t<=0)continue;const inP=!P.dead&&dist(P,f)<f.rad;
    if(s.release){if(inP)P.buffs._j3er={t:.6,max:.6,n:'원소 해방 (장판 안의 적이 받는 피해 +15%)'};
      if(slow&&!s.ghost){f.mk=(f.mk||0)-.25;const mark=f.mk<=0;if(mark)f.mk=1;for(const e of enemies)if(!e.dead&&dist(e,f)<f.rad+hR(e)){e.j3nores=1.6;if(mark)applyFx(e,{mark:{amp:s.release.amp,dur:1.6}},f)}}}
    if(s.rift&&auth)for(const e of enemies)if(!e.dead&&dist(e,f)<f.rad+hR(e))e.j3rift={k:mpBig(e)?s.rift.boss:s.rift.k,t:.2};
    if(s.throne){if(slow&&auth)for(const e of enemies)if(!e.dead&&dist(e,f)<f.rad+hR(e))e.slowT=Math.max(e.slowT,.6);
      if(!s.ghost)for(const a of mpPets())if(dist(a,f)<f.rad){a.hp=Math.min(a.max,a.hp+a.max*s.throne.heal*dt);if(!a.dmg0){a.dmg0=a.dmg;a.dmg=a.dmg*(1+s.throne.amp)}a.j3thrT=.3;if(R()<dt*4)mpRise(a.x+rnd(-10,10),a.y+rnd(-10,10),'#e8d8ff',30)}}
    if(s.condemn){if(inP)P.buffs._j3cf={t:.6,max:.6,n:'정죄의 결계 (때리면 생명력이 참)'};if(slow&&auth)for(const e of enemies)if(!e.dead&&dist(e,f)<f.rad+hR(e)){e.j3noheal=.6;if(mpDemon(e))e.slowT=Math.max(e.slowT,.6)}}
    if(s.sanct&&inP){P.buffs._j3sa={t:.6,max:.6,n:'성소 (해로운 효과 막음)'};P.j2imm=Math.max(P.j2imm||0,.4);if(typeof PTY==='object'&&PTY.pull)PTY.pull=null;for(const k of ['j3deb','poisonT','fearT','rootT','stunT','silenceT'])if(P[k]>0)P[k]=0}}}
// 시간의 틈: 안의 몬스터는 그 프레임에 움직인 거리 · 공격 대기 · 외우기가 k만큼 덜 흐른다
{const _ue=updateEnemies;updateEnemies=function(dt){const R0=[];for(const e of enemies)if(e.j3rift&&e.j3rift.t>0&&!e.dead){e.j3rift.t-=dt;R0.push([e,e.x,e.y,e.atkCd,e.bc,e.cast,e.j3rift.k])}
  _ue(dt);for(const [e,x,y,ac,bc,ca,k] of R0){if(e.dead)continue;if(Math.hypot(e.x-x,e.y-y)<200){e.x=x+(e.x-x)*(1-k);e.y=y+(e.y-y)*(1-k)}
    if(e.atkCd<ac)e.atkCd+=Math.min(ac-e.atkCd,dt)*k;if(bc>0&&e.bc>0&&e.bc<bc)e.bc+=(bc-e.bc)*k;if(ca>0&&e.cast>0&&e.cast<ca)e.cast+=(ca-e.cast)*k}}}

/* ===== 맞힐 때 ===== */
{const _he=hurtE;hurtE=function(e,amt,s){if(!e||e.dead||!s||s.ghost)return _he(e,amt,s);
  const mine=s.cls&&s.cls===P.cls&&!GHOST;let k=1;
  if(mine&&!s.proc&&mpBrand(e)&&P.cls==='priest'){const x=passSum('brandDmg')||0;if(x>0){const bd=Math.min(dmgCap(),buffSum('dmg')+(P.armor?P.armor.dmgB:0));k*=(1+Math.min(dmgCap(),bd+x))/(1+bd)}}
  if(e.weakEl&&s.el!==e.weakEl&&(e.j3nores>0||(mine&&P.cls==='mage'&&P.buffs.spiritadvent&&P.buffs.spiritadvent.t>0&&s.kind!=='summon')))k*=1.5;
  if(s.udx&&mpDemon(e)&&!(TYPES[e.k]||{}).undead)k*=s.ud||3;
  if(s.exec3&&mpBrand(e)&&e.max&&e.hp/e.max<s.exec3.hp){if(mpBig(e))k*=s.exec3.boss;else{amt=Math.max(amt,e.hp+1);k=Math.max(k,1);ftext(e.x,e.y-30,'집행','#fff2c0',true,e.r*2+50)}}
  const h0=e.hp;_he(e,amt*k,s);const dealt=Math.max(0,h0-e.hp);
  if(e.j3pr&&dealt>0)e.j3pr.acc+=dealt;
  if(s.proc)return;
  if(s.prison&&!e.dead&&!e.j3pr){const big=mpBig(e),d=big?s.prison.boss:s.prison.dur;e.j3pr={t:d,max:d,acc:0,k:s.prison.burst,mine:!!mine};applyFx(e,{stun:d},P);if(big)mpBrk(e,s.prison.brk);
    MPJ.cages.push(e);ftext(e.x,e.y-36,'빛의 감옥','#fff2c0',true,e.r*2+60)}
  if(s.brandBoom&&mpBrand(e)&&dealt>0){const B=s.brandBoom,x=e.x,y=e.y;rings.push({x,y,r:10,max:B.rad,life:.5,col:'#ffe39a'});pillars.push({x,y,w:B.rad*.5,life:.5,max:.5,col:EL.holy});burst(x,y,'#fff2c0',30,B.rad*1.8,4,30);
    for(const o of enemies)if(!o.dead&&o!==e&&dist(o,{x,y})<B.rad+hR(o))_he(o,amt*k*B.k,MPJ_BOOM);if(!e.dead)_he(e,amt*k*B.k,MPJ_BOOM)}
  if(mine&&P.cls==='mage'&&P.buffs.spiritadvent&&P.buffs.spiritadvent.t>0&&dealt>0&&s.kind!=='summon'&&!e.dead){if(!e.burn)e.burn={t:3,dps:Math.max(1,dealt*.12)};e.slowT=Math.max(e.slowT||0,1.2);if(!s._adv){s._adv=1;applyFx(e,{stun:.2},P);const o=nearestEnemy(e,200,new Set([e]));if(o){zap({x:e.x,y:e.y,z:16},{x:o.x,y:o.y,z:16},Object.assign({life:.2},stormStyle(9)));_he(o,dealt*.3,MPJ_CHN)}}}
  if(mine&&dealt>0&&!P.dead&&time-MPJ.lastHeal>.25){for(const f of fields)if(f.s&&f.s.condemn&&dist(P,f)<f.rad){MPJ.lastHeal=time;healP(Math.max(1,Math.round(maxHp()*f.s.condemn.heal)));break}}}}
{const _af=applyFx;applyFx=function(e,s,from){_af(e,s,from);if(!e||e===P||e.dead||!s||s.ghost||e.ally)return;
  if(s.bossStun&&mpBig(e)&&e.stunT>s.bossStun)e.stunT=s.bossStun;
  if(s.mark&&!GHOST&&P.cls==='priest'&&s.cls===P.cls&&!s.j3bd){const b=passSum('brandDur')||0;if(b>0&&e.markT>0)e.markT+=b}}}
// 낙인 찍힌 적이 쓰러짐 → 속죄의 빛을 받은 사람이 회복 (방장·참가자 화면 모두 killFx를 지난다)
{const _kf=killFx;killFx=function(e){const br=e&&e.markT>0;_kf(e);const b=P&&P.buffs&&P.buffs.atonelight;
  if(br&&b&&b.t>0&&!P.dead&&dist(e,P)<550){const h=Math.round(maxHp()*(b.a3||.04));healP(h);beams.push({x1:e.x,y1:e.y,x2:P.x,y2:P.y,z:30,w:4,life:.35,max:.35,col:'#fff2c0',el:'holy',rank:6})}}}

/* ===== 맞을 때: 수호 정령 · 계약의 대가 ===== */
{const _hp=hitPlayer;hitPlayer=function(d,src,o){if(P.dead||P.invT>0)return _hp(d,src,o);
  const g=P.buffs.wardspirit&&P.buffs.wardspirit.t>0?P.buffs.wardspirit.g:null;
  if(g&&src&&!src.dead&&src.hp!=null&&TYPES[src.k]){if(time-(g.ct||-9)>.4){g.ct=time;hurtE(src,g.pw,Object.assign({},MPJ_GUARD,{cls:P.cls}));zap({x:P.x,y:P.y,z:40},{x:src.x,y:src.y,z:20},{w:1.6,br:1,depth:1,life:.2,col:'#efffe8',glow:'#9fe39a'})}
    if((g.cd||0)<=time&&!(P.shield>0&&P.shieldT>0)){g.cd=time+g.iv;ftext(P.x,P.y,'정령이 막음','#9fe39a');burst(P.x,P.y,'#9fe39a',20,120,3,30);rings.push({x:P.x,y:P.y,r:8,max:50,life:.4,col:'#9fe39a'});return}}
  const pact=P.ward&&SPELLS.pactprice&&P.ward.n===SPELLS.pactprice.n;let stash=null;
  if(pact&&!mpPets().length){stash=P.ward;P.ward=null}
  const r=_hp(d,src,o);
  if(stash&&!P.dead&&!P.ward)P.ward=stash;
  if(pact&&!stash&&!P.ward&&!P.dead){const pets=mpPets().sort((a,b)=>dist(a,P)-dist(b,P));const a=pets[0];if(a){a.gone=true;allies=allies.filter(x=>x!==a);beams.push({x1:a.x,y1:a.y,x2:P.x,y2:P.y,z:30,w:8,life:.5,max:.5,col:'#d8c8ff',el:'arcane',rank:9});burst(a.x,a.y,'#d8c8ff',40,180,3,30);msg(`계약의 대가: ${a.s.n||'소환수'}이(가) 대신 사라졌습니다`,'#d8c8ff')}}
  return r}}

/* ===== 축복·치유 받을 때 (나에게, 또는 동료가 건 것) ===== */
{const _sf=supFx;supFx=function(s,id,pwr,from){if(!s||GHOST)return _sf(s,id,pwr,from);
  // 성흔: 내가 거는 치유
  const st=!from&&P.cls==='priest'?mpStig():0;let rv=null;
  const hp0=P.hp,mh=maxHp();
  if(st>0&&(s.kind==='heal'||s.kind==='hot')){const keep=healP;healP=function(n){return keep(n*(1+st))};try{rv=_sf(s,id,pwr,from)}finally{healP=keep}}else rv=_sf(s,id,pwr,from);
  if(s.overShield&&s.kind==='heal'){const O=s.overShield,want=(mh*s.pct+pwr*s.mult)*supScale(s.L||1)*(1+st),over=want-(mh-hp0);
    if(over>1&&!(P.shield>0&&P.shieldT>0)){P.shield=Math.round(Math.min(over*O.k,mh*O.cap));P.shieldT=O.dur;P.shieldN=0;P.shieldRef=0;P.shieldS=s;ftext(P.x,P.y-20,`보호막 ${P.shield}`,'#8fd8ff',false,60)}}
  if(s.pheal&&from){healP(Math.round((maxHp()*s.pheal.pct+pwr*s.pheal.mult)*supScale(s.L||1)));rings.push({x:P.x,y:P.y,r:6,max:60,life:.45,col:'#fff2c0'})}
  const b=P.buffs[id];
  if(s.guard&&b){b.g={pw:(pwr||power())*s.guard.mult*supScale(s.L||1),iv:s.guard.iv,cd:0,ct:-9};if(from)MPJ.guards.set(from.id,time+s.dur)}
  if(s.atone3&&b)b.a3=s.atone3.heal*supScale(s.L||1);
  return rv}}

// 3차 축복의 알림 글자: 실제 레벨(11.8 같은 소수) 대신 찍은 점수(1~10)로 보인다 (동료가 건 것도)
const mpShowL=(cls,L)=>{const k=typeof J3K==='function'?J3K(cls):1.2;return Math.max(1,Math.round(1+((+L||1)-1)/(k||1)))};
{const _pb=putBuffV19;putBuffV19=function(id,nb,by,s){const s0=SPELLS[id];if(!s0||!s0.job3||!nb)return _pb.apply(this,arguments);const keep=msg,o=P.buffs[id];
  msg=function(t,c){let x=String(t).split(`${nb.L}레벨`).join(`${mpShowL(s0.cls,nb.L)}레벨`);if(o&&o.L!=null)x=x.split(`${o.L}레벨`).join(`${mpShowL(s0.cls,o.L)}레벨`);return keep(x,c)};
  try{return _pb.apply(this,arguments)}finally{msg=keep}}}
/* ===== 같이 하기: 동료의 3차 시전을 받은 화면 ===== */
{const _ng=netGhostCast;netGhostCast=function(m){const n0=fields.length;_ng(m);if(!m||!isJ3mp(m.sp))return;const s0=SPELLS[m.sp],r=NET.peers.get(m.from);if(!r||!netSame(r)||r.dead)return;
  for(let i=n0;i<fields.length;i++)if(fields[i].s&&fields[i].s.id===m.sp)fields[i].j3=1;
  if(P.dead)return;const d=dist(r,P),L=clamp(m.L|0,1,40),s=eff(m.sp,L);
  if(m.sp==='martyrprayer'&&d<=s0.party){const h=mpMartyrAmt(+r.max||maxHp(),+m.pw||power(),s,L);healP(h);burst(P.x,P.y,'#ffd0c0',26,120,3,30);beams.push({x1:r.x,y1:r.y,x2:P.x,y2:P.y,z:30,w:7,life:.5,max:.5,col:'#ff8a8a',el:'holy',rank:9});msg(`${r.name||'동료'}님의 ${s0.n}: +${h}`,'#ffb0a0')}
  else if(m.sp==='consecrate'&&d<=s0.party)mpConsec(s,L,r);
  else if(m.sp==='saintmiracle'&&d<=s0.party)mpMiracle(s,L,r);}}
// 받는 메시지 (CORE의 J3NET이 없으면 여기서): j3x gale · fin · lswap
{const _nm=netOnMsg;netOnMsg=function(m){if(m&&m.t==='j3x'&&['gale','fin','lswap'].includes(m.k)){if(m.to&&m.to!==NET.id)return;const r=NET.peers.get(m.from);
    if(m.k==='gale')mpNetGale(m,r);else if(m.k==='fin')mpNetFin(m,r);else mpNetSwap(m,r);return}return _nm(m)}}
function mpNetGale(m,r){if(!r||!netSame(r))return;const s=eff('forbidgale',1);const g=mpMkGale(+m.x||r.x,+m.y||r.y,s,1,false,true);g.by=r.id;g.auto=clamp(+m.d||5,.5,6);g.life=g.auto+1}
function mpNetFin(m,r){if(!r||!netSame(r)||!SPELLS[m.sp])return;mpFinFx(+m.x,+m.y,SPELLS[m.sp],+m.r||SPELLS[m.sp].rad)}

/* ===== 채널링 끝까지 버티면: 마지막 한 방 (종언의 원 · 하늘 문이 열리는 날) ===== */
function mpFinFx(x,y,s0,rad){const holy=s0.el==='holy';shake=Math.max(shake,14);flash={col:holy?'#fff2c0':'#e8d8ff',a:.38};
  if(holy){pillars.push({x,y,w:rad*.55,life:1.1,max:1.1,col:'#fff6d0'});for(let i=0;i<8;i++){const a=i*.785;pillars.push({x:x+Math.cos(a)*rad*.6,y:y+Math.sin(a)*rad*.6,w:60,life:.8,max:.8,col:EL.holy})}}
  else for(let i=0;i<4;i++){const el=MPJ_QUAD[i][0],a=i*1.571+.785;rings.push({x,y,r:10,max:rad*(.55+i*.15),life:.7+i*.1,col:EL[el]});burst(x+Math.cos(a)*rad*.3,y+Math.sin(a)*rad*.3,EL[el],50,rad*1.6,5,30)}
  rings.push({x,y,r:10,max:rad*1.1,life:.9,col:'#ffffff'});burst(x,y,'#ffffff',60,rad*2,5,40);decal(x,y,rad*.7,holy?'holy':'fire');MPJ.fins.push({x,y,rad,t:0,max:1.2,holy})}
function mpFin(ch){const s0=SPELLS[ch.id];if(!s0||!s0.final||P.dead)return;const L=ch.L||skLv(ch.id)||1,s=eff(ch.id,L);const o=(ch.objs||[]).find(q=>q&&q.rad)||clampRange(ch.tg||P,520);
  const x=o.x,y=o.y,rad=s.rad;mpFinFx(x,y,s0,rad);if(NET.on)j3Send('fin',{sp:ch.id,x:Math.round(x),y:Math.round(y),r:Math.round(rad)});
  const F=s0.final,ss=Object.assign({},s,{kind:'strike',stun:F.stun||0,freeze:F.freeze||0,burn:s0.el==='arcane'?1:0,final:0,quad:0});const pw=mpPw(ch.id,L,F.mult);
  banner={t:s0.n,sub:'끝까지 버텼습니다 — 마지막 한 방',col:s0.el==='holy'?'#ffe39a':'#e8d8ff',life:1.6,max:1.6};
  for(const e of enemies)if(!e.dead&&dist(e,{x,y})<rad+hR(e)){hurtE(e,pw*rnd(.95,1.05),ss);applyFx(e,{stun:F.stun||0,freeze:F.freeze||0},{x,y});if(mpBig(e))mpBrk(e,35)}}
// 비 마법 한 줄기: 종언의 원은 불 → 얼음 → 번개 → 대지 차례로 · 하늘의 노여움은 낙인 찍힌 적에게 몰림
{const _sh=skyHit;skyHit=function(x,y,s,dmg,rad,hitR){if(s&&s.quad&&s.kind==='rain'){const i=(s._qi=((s._qi|0)+1)%4),v=(s._qv||(s._qv=[]));s=v[i]||(v[i]=Object.assign({},s,{el:MPJ_QUAD[i][0],quad:0},MPJ_QUAD[i][1],{knock:0}));
    MPJ.fins.push({x,y,rad:(hitR||rad)*.9,t:0,max:.45,el:s.el,small:1})}
  else if(s&&s.job3&&s.el==='holy'&&s.kind==='rain')MPJ.fins.push({x,y,rad:(hitR||rad)*.8,t:0,max:.4,holy:1,small:1});
  return _sh(x,y,s,dmg,rad,hitR)}}
{const _rp=rainPt;rainPt=function(r){const q=_rp(r),s=r&&r.s;if(s&&s.brandAim&&r.n>1&&R()<s.brandAim){const L=enemies.filter(e=>mpBrand(e)&&dist(e,r)<r.rad+hR(e));if(L.length){const e=L[(R()*L.length)|0];return{x:e.x+rnd(-8,8),y:e.y+rnd(-8,8)}}}return q}}

/* ===== 매 프레임 ===== */
function mpTick(dt){
  for(const q of MPJ.q)q.t-=dt;const due=MPJ.q.filter(q=>q.t<=0);if(due.length){MPJ.q=MPJ.q.filter(q=>q.t>0);for(const q of due)q.fn()}
  if(MPJ.focus){MPJ.focus.t-=dt;if(MPJ.focus.t<=0||!MPJ.focus.e||MPJ.focus.e.dead||!enemies.includes(MPJ.focus.e))MPJ.focus=null}
  if(MPJ.clone&&!allies.includes(MPJ.clone))MPJ.clone=null;// 소환수 목록에서 빠진(지워진) 분신은 더 따라 하지 않는다
  MPJ.waves=MPJ.waves.filter(w=>mpWaveTick(w,dt));
  for(const g of MPJ.gales){if(g.auto&&!g.ghost){mpGaleTick(g,dt,null);if(g.t>=g.auto){g.done=1;mpGaleBoom(g.x,g.y,g.rad,mpPw('forbidgale',g.L,g.s.boom.mult)*(g.autoK||1),g.s,g.autoK||1,false)}}
    else if(g.ghost){mpGaleTick(g,dt,null);if(g.t>g.life)g.done=1}}
  MPJ.gales=MPJ.gales.filter(g=>!g.done);
  // 잿더미 · 뒤집힌 땅
  for(const w of MPJ.watchF)if(w.f.t<=0&&!w.done){w.done=1;const f=w.f,A=f.s.ash;MPJ.grounds.push({x:f.x,y:f.y,rad:f.rad*(A.k||.9),t:A.dur,max:A.dur,kind:'ash',v:R()*6})}
  MPJ.watchF=MPJ.watchF.filter(w=>!w.done);
  for(const w of MPJ.watchP)if(w.m.t<=0&&!w.done){w.done=1;const m=w.m,s=w.s;
    if(s.rubble){MPJ.grounds.push({x:m.x,y:m.y,rad:s.rad*s.rubble.k,t:s.rubble.dur,max:s.rubble.dur,kind:'rubble',v:R()*6});for(let i=0;i<40;i++){const a=R()*6.283,d=Math.sqrt(R())*s.rad;if(parts.length<Q.pcap)parts.push({x:m.x+Math.cos(a)*d,y:m.y+Math.sin(a)*d,z:0,vx:Math.cos(a)*60,vy:Math.sin(a)*60,vz:rnd(160,340),g:1,life:1,max:1,col:i%3?'#8a7350':'#5a4630',sz:rnd(3,6)})}shake=Math.max(shake,14);flash={col:'#c9a46a',a:.25}}
    if(!w.ghost&&s.brk)for(const e of enemies)if(!e.dead&&mpBig(e)&&dist(e,m)<s.rad+hR(e))mpBrk(e,s.brk)}
  MPJ.watchP=MPJ.watchP.filter(w=>!w.done);
  const auth=mpAuth();for(const g of MPJ.grounds){g.t-=dt;if(auth&&R()<dt*8)for(const e of enemies)if(!e.dead&&dist(e,g)<g.rad+hR(e))e.slowT=Math.max(e.slowT,.5);if(g.kind==='ash'&&R()<dt*10){const a=R()*6.283,r=Math.sqrt(R())*g.rad;mpRise(g.x+Math.cos(a)*r,g.y+Math.sin(a)*r,'#ff7a2e',4)}}
  MPJ.grounds=MPJ.grounds.filter(g=>g.t>0);
  mpFieldTick(dt);mpChainTick(dt);
  // 정령 폭주가 끝날 때: 소환수마다 작은 폭발
  if(MPJ.frenzy){MPJ.frenzy.t-=dt;if(MPJ.frenzy.t<=0){const F=MPJ.frenzy;MPJ.frenzy=null;for(const a of mpPets()){rings.push({x:a.x,y:a.y,r:8,max:F.rad,life:.45,col:EL.fire});burst(a.x,a.y,EL.fire,24,F.rad*1.6,3.5,20);for(const e of enemies)if(!e.dead&&dist(e,a)<F.rad+hR(e)){hurtE(e,F.pw*rnd(.9,1.1),Object.assign({},MPJ_FRZ,{burn:1}))}}}}
  // 천상의 감옥 · 집행자의 창(낙인 쫓기)
  for(const e of MPJ.cages){const p=e.j3pr;if(!p)continue;p.t-=dt;if(p.t<=0||e.dead){e.j3pr=null;if(!e.dead&&p.acc>0&&p.mine){const a=Math.round(p.acc*p.k);hurtE(e,a,MPJ_PRISON);ftext(e.x,e.y-40,`감옥이 깨짐 +${a}`,'#fff2c0',true,e.r*2+70)}burst(e.x,e.y,'#fff2c0',40,200,4,40);rings.push({x:e.x,y:e.y,r:8,max:e.r*4,life:.5,col:'#fff2c0'})}}
  MPJ.cages=MPJ.cages.filter(e=>e.j3pr);
  for(const p of projs){const e=p.j3seek;if(!e||p.life<=0)continue;if(e.dead){p.j3seek=null;continue}const a=Math.atan2(e.y-p.y,e.x-p.x),b=Math.atan2(p.vy,p.vx);let d=a-b;while(d>Math.PI)d-=6.283;while(d<-Math.PI)d+=6.283;const nb=b+clamp(d,-7*dt,7*dt),sp=Math.hypot(p.vx,p.vy);p.vx=Math.cos(nb)*sp;p.vy=Math.sin(nb)*sp}
  for(const e of enemies){if(e.j3nores>0)e.j3nores-=dt;if(e.j3noheal>0)e.j3noheal-=dt}
  for(const f of MPJ.fins)f.t+=dt;MPJ.fins=MPJ.fins.filter(f=>f.t<f.max);
  for(const b of MPJ.blades)b.t+=dt;MPJ.blades=MPJ.blades.filter(b=>b.t<b.max);for(const b of MPJ.spears)b.t+=dt;MPJ.spears=MPJ.spears.filter(b=>b.t<b.max);
  if(MPJ.mir){MPJ.mir.t-=dt;if(MPJ.mir.t<=0)MPJ.mir=null}
  for(const [k,t] of MPJ.guards)if(t<time)MPJ.guards.delete(k)}
{const _u=update;update=function(dt){mpInit();for(const w of MPJ.watchP)if(w.follow&&!w.follow.dead&&w.m.t>0){w.m.x=w.follow.x;w.m.y=w.follow.y;if(w.blade){w.blade.x=w.m.x;w.blade.y=w.m.y}}// 집행: 칼날이 고른 적을 따라 떨어진다
  const ch0=CAST.ch,fin=ch0&&SPELLS[ch0.id]&&SPELLS[ch0.id].final&&!GHOST;_u(dt);if(paused)return;
  if(fin&&CAST.ch!==ch0&&ch0.t>=ch0.dur-1e-6)try{mpFin(ch0)}catch(err){if(window.__QA)throw err}
  mpTick(dt);
  // b3의 정리(updateFx)는 이미 지났다: 내 틱·마지막 한 방이 hurtE(맞을 때 입자 4개)로 늘린 입자를 b3와 같은 규칙(오래된 것부터)으로 상한에 맞춘다
  if(parts.length>Q.pcap)parts.splice(0,parts.length-Q.pcap)}}

// 새 캐릭터 · 지역을 옮기면 떠 있던 3차 효과(물벽 · 태풍 · 땅 · 사슬 · 분신 · 감옥 …)를 비운다
function mpReset(){for(const k of ['q','grounds','waves','gales','watchF','watchP','fins','blades','spears','cages'])MPJ[k].length=0;MPJ.chain=null;MPJ.clone=null;MPJ.focus=null;MPJ.frenzy=null;MPJ.mir=null;MPJ.cloning=0;MPJ.guards.clear()}
{const _ng=newGame;newGame=function(){mpReset();return _ng.apply(this,arguments)}}
{const _lr=loadRegion;loadRegion=function(){mpReset();return _lr.apply(this,arguments)}}
{const _ed=enterDungeon;enterDungeon=function(){mpReset();return _ed.apply(this,arguments)}}
{const _ld=leaveDungeon;leaveDungeon=function(){mpReset();return _ld.apply(this,arguments)}}
/* ===== 그림: 처음 한 번 구워 둔 그림만 돌리고 늘려 붙인다 ===== */
const MPJ_G={
  // 3차 장판의 큰 문양 (원소색 + 금빛 테두리, 겹친 두 고리와 룬)
  sigil(col){return SC.get('j3/sig/'+col,256,256,128,128,g=>{const c=Kit.hex(col);g.translate(128,128);g.lineCap='round';
    const gr=g.createRadialGradient(0,0,40,0,0,126);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.8,Kit.rgb(c,.18));gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(0,0,126,0,6.283);g.fill();
    g.strokeStyle='#e8c35a';g.globalAlpha=.85;g.lineWidth=3;g.beginPath();g.arc(0,0,122,0,6.283);g.stroke();g.strokeStyle=col;g.lineWidth=5;g.beginPath();g.arc(0,0,114,0,6.283);g.stroke();
    g.lineWidth=2;g.beginPath();g.arc(0,0,92,0,6.283);g.stroke();g.beginPath();g.arc(0,0,48,0,6.283);g.stroke();
    g.globalAlpha=.75;g.beginPath();for(let i=0;i<8;i++){const a=i*.785,b=(i+3)*.785;g.moveTo(Math.cos(a)*92,Math.sin(a)*92);g.lineTo(Math.cos(b)*92,Math.sin(b)*92)}g.stroke();
    g.fillStyle=col;for(let i=0;i<32;i++){g.save();g.rotate(i/32*6.283);g.fillRect(-2,-110,4,i%4?6:12);g.restore()}
    g.fillStyle='#fff6d8';g.globalAlpha=.9;for(let i=0;i<8;i++){const a=i*.785;g.beginPath();g.arc(Math.cos(a)*114,Math.sin(a)*114,4.5,0,6.283);g.fill()}},{force:1})},
  // 잿더미 · 뒤집힌 땅 (땅 위에 깔리는 무늬)
  ground(kind,v){return SC.get('j3/gr/'+kind+v,256,256,128,128,g=>{const s=mulberry(77+v*131+(kind==='ash'?0:999));g.translate(128,128);
    if(kind==='ash'){for(let i=0;i<60;i++){const a=s()*6.283,d=Math.sqrt(s())*110,r=10+s()*26;g.fillStyle=`rgba(${30+s()*30|0},${26+s()*22|0},${24+s()*20|0},${.25+s()*.3})`;g.beginPath();g.ellipse(Math.cos(a)*d,Math.sin(a)*d,r,r*(.5+s()*.5),s()*3,0,6.283);g.fill()}
      for(let i=0;i<40;i++){const a=s()*6.283,d=Math.sqrt(s())*100;g.fillStyle=`rgba(255,${110+s()*80|0},40,${.35+s()*.4})`;g.beginPath();g.arc(Math.cos(a)*d,Math.sin(a)*d,1+s()*2.4,0,6.283);g.fill()}}
    else{for(let i=0;i<26;i++){const a=s()*6.283,d=Math.sqrt(s())*104,w=14+s()*26,h=8+s()*16,r=s()*3;g.save();g.translate(Math.cos(a)*d,Math.sin(a)*d);g.rotate(r);
        g.fillStyle=`rgba(${70+s()*40|0},${54+s()*30|0},${34+s()*20|0},.85)`;g.beginPath();g.moveTo(-w/2,-h/2);g.lineTo(w/2,-h/2+s()*4);g.lineTo(w/2-s()*5,h/2);g.lineTo(-w/2+s()*4,h/2);g.closePath();g.fill();
        g.strokeStyle='rgba(20,14,8,.7)';g.lineWidth=1.4;g.stroke();g.fillStyle='rgba(200,170,120,.35)';g.fillRect(-w/2+2,-h/2+1,w-6,2);g.restore()}
      g.strokeStyle='rgba(16,10,6,.8)';g.lineWidth=2.4;for(let i=0;i<9;i++){let a=s()*6.283,d=10;g.beginPath();g.moveTo(Math.cos(a)*d,Math.sin(a)*d);for(let k=0;k<5;k++){d+=18+s()*10;a+=s()*.5-.25;g.lineTo(Math.cos(a)*d,Math.sin(a)*d)}g.stroke()}}},{force:1})},
  // 소용돌이 (태풍 · 시간의 틈)
  swirl(col){return SC.get('j3/sw/'+col,256,256,128,128,g=>{g.translate(128,128);g.lineCap='round';for(let k=0;k<5;k++){g.strokeStyle=k%2?'#ffffff':col;g.globalAlpha=.25+.12*k;g.lineWidth=7-k;g.beginPath();
      for(let i=0;i<=60;i++){const a=i/60*5+k*1.257,r=12+i*1.85;i?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r)}g.stroke()}},{force:1})},
  // 물벽 한 조각 (세로로 선 물마루)
  crest(){return SC.get('j3/crest',96,140,48,128,g=>{const gr=g.createLinearGradient(0,10,0,130);gr.addColorStop(0,'rgba(240,252,255,.95)');gr.addColorStop(.35,'rgba(143,216,255,.85)');gr.addColorStop(1,'rgba(20,70,120,.15)');
    g.fillStyle=gr;g.beginPath();g.moveTo(4,130);g.bezierCurveTo(0,70,20,24,58,12);g.bezierCurveTo(80,6,94,22,86,40);g.bezierCurveTo(70,30,56,40,60,62);g.bezierCurveTo(64,90,80,110,92,130);g.closePath();g.fill();
    g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=3;g.beginPath();g.moveTo(20,60);g.bezierCurveTo(26,30,50,14,74,16);g.stroke();g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<8;i++){g.beginPath();g.arc(60+Math.cos(i)*18,20+Math.sin(i*1.7)*8,2.5,0,6.283);g.fill()}},{force:1})},
  // 빛의 감옥 (세로 창살)
  cage(){return SC.get('j3/cage',96,150,48,140,g=>{g.lineCap='round';for(let i=0;i<7;i++){const x=10+i*12.6,w=i%3?2.4:4;g.strokeStyle=i%3?'rgba(255,242,192,.85)':'#ffffff';g.lineWidth=w;g.beginPath();g.moveTo(x,140-Math.abs(i-3)*4);g.lineTo(x,14+Math.abs(i-3)*5);g.stroke()}
    g.strokeStyle='#ffe39a';g.lineWidth=4;g.beginPath();g.ellipse(48,140,42,9,0,0,6.283);g.stroke();g.beginPath();g.ellipse(48,14,38,8,0,0,6.283);g.stroke();
    g.fillStyle='#fff6d8';g.beginPath();g.moveTo(48,0);g.lineTo(54,10);g.lineTo(48,20);g.lineTo(42,10);g.closePath();g.fill()},{force:1})},
  // 빛의 대창 · 집행의 칼날
  spear(){return SC.get('j3/spear',240,40,120,20,g=>{const gr=g.createLinearGradient(0,0,240,0);gr.addColorStop(0,'rgba(255,227,154,0)');gr.addColorStop(.6,'rgba(255,227,154,.8)');gr.addColorStop(1,'#ffffff');g.fillStyle=gr;
    g.beginPath();g.moveTo(0,17);g.lineTo(190,15);g.lineTo(240,20);g.lineTo(190,25);g.lineTo(0,23);g.closePath();g.fill();g.fillStyle='#ffffff';g.beginPath();g.moveTo(180,8);g.lineTo(240,20);g.lineTo(180,32);g.lineTo(196,20);g.closePath();g.fill()},{force:1})},
  blade(){return SC.get('j3/blade',60,200,30,196,g=>{const gr=g.createLinearGradient(0,0,0,200);gr.addColorStop(0,'rgba(255,242,192,0)');gr.addColorStop(.5,'rgba(255,242,192,.9)');gr.addColorStop(1,'#ffffff');g.fillStyle=gr;
    g.beginPath();g.moveTo(22,0);g.lineTo(38,0);g.lineTo(40,170);g.lineTo(30,198);g.lineTo(20,170);g.closePath();g.fill();g.fillStyle='#ffe39a';g.fillRect(6,30,48,8);g.fillStyle='#fff';g.fillRect(28,4,4,160)},{force:1})},
  // 왕좌 (정령 왕좌)
  throne(){return SC.get('j3/throne',120,150,60,140,g=>{const c='#b9a2ff';Kit.solid(g,q=>{q.moveTo(22,140);q.lineTo(22,52);q.lineTo(34,20);q.lineTo(46,40);q.lineTo(60,6);q.lineTo(74,40);q.lineTo(86,20);q.lineTo(98,52);q.lineTo(98,140);q.closePath()},22,6,98,140,'#5a4a8a');
    Kit.solid(g,q=>{q.rect(14,96,92,18)},14,96,106,114,'#6a5aa0');g.fillStyle=c;for(const [x,y] of [[34,24],[60,10],[86,24]]){g.beginPath();g.arc(x,y,5,0,6.283);g.fill()}
    for(let i=0;i<4;i++){g.fillStyle=EL[MPJ_QUAD[i][0]];g.beginPath();g.arc(36+i*16,70,5,0,6.283);g.fill()}},{force:1})},
  // 정령왕의 관 (네 원소 구슬이 도는 머리 위 관)
  crown(){return SC.get('j3/crown',64,40,32,30,g=>{g.fillStyle='#e8c35a';g.beginPath();g.moveTo(6,34);g.lineTo(10,12);g.lineTo(20,24);g.lineTo(32,4);g.lineTo(44,24);g.lineTo(54,12);g.lineTo(58,34);g.closePath();g.fill();g.strokeStyle='#6a4a10';g.lineWidth=1.5;g.stroke();
    for(let i=0;i<4;i++){g.fillStyle=EL[MPJ_QUAD[i][0]];g.beginPath();g.arc(14+i*12,30,3.4,0,6.283);g.fill()}},{force:1})},
  img(c,e,x,y,w,h,a){if(!e)return;c.globalAlpha=a;c.drawImage(e.cv,x-w/2,y-h/2,w,h)}};
// 땅 단계(드는 빛 아래): 잿더미 · 뒤집힌 땅 · 3차 장판 문양
{const _dd=drawDecalsFields;drawDecalsFields=function(){_dd();if(!MPJ.grounds.length&&!fields.some(f=>f.j3))return;const pa=ctx.globalAlpha,po=ctx.globalCompositeOperation;
  for(const g of MPJ.grounds){const a=clamp(Math.min(g.t,(g.max-g.t)*4,1),0,1),e=MPJ_G.ground(g.kind,(g.v|0)%3);if(!e)continue;ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.v);MPJ_G.img(ctx,e,0,0,g.rad*2.2,g.rad*2.2,(g.kind==='ash'?.85:.95)*a);ctx.restore()}
  for(const f of fields){if(!f.j3||!f.s)continue;const s=f.s,col=s.heal?'#9fe39a':s.sanct?'#fff2c0':EL[s.el]||'#d8c8ff',fade=clamp(Math.min(f.t*2,(f.max-f.t)*4,1),0,1);
    if(s.ash){const e=MPJ_G.ground('ash',1);ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.t*.05);MPJ_G.img(ctx,e,0,0,f.rad*2,f.rad*2,.6*fade);ctx.restore()}}
  ctx.globalAlpha=pa;ctx.globalCompositeOperation=po}}
// 빛나는 단계(땅 좌표, lighter): 장판 문양 · 소용돌이 · 물벽 아래 물보라 · 마지막 한 방 · 3차 시전 마법진
{const _cd=castDraw;castDraw=function(){_cd();const pa=ctx.globalAlpha;
  for(const f of fields){if(!f.j3||!f.s)continue;const s=f.s,col=s.heal?'#9fe39a':s.sanct?'#fff2c0':EL[s.el]||'#d8c8ff',fade=clamp(Math.min(f.t*2,(f.max-f.t)*4,1),0,1);
    ctx.save();ctx.translate(f.x,f.y);ctx.rotate((s.rift?-1.2:.25)*time);MPJ_G.img(ctx,MPJ_G.sigil(col),0,0,f.rad*2.15,f.rad*2.15,.75*fade);ctx.restore();
    if(s.rift){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(time*1.6);MPJ_G.img(ctx,MPJ_G.swirl('#b9a2ff'),0,0,f.rad*1.7,f.rad*1.7,.5*fade);ctx.restore()}
    if(s.ash&&R()<.5)glow(f.x+rnd(-f.rad,f.rad)*.7,f.y+rnd(-f.rad,f.rad)*.7,rnd(30,70),'#ff7a2e')}
  for(const g of MPJ.gales){ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.rot);MPJ_G.img(ctx,MPJ_G.swirl('#cfe0ff'),0,0,g.rad*2.2,g.rad*2.2,.6+.3*g.f);ctx.rotate(-g.rot*1.7);MPJ_G.img(ctx,MPJ_G.sigil(EL.storm),0,0,g.rad*2,g.rad*2,.35+.3*g.f);ctx.restore()}
  for(const w of MPJ.waves){const x=w.x+w.cx*w.d,y=w.y+w.cy*w.d;ctx.globalAlpha=.35;ctx.strokeStyle='#cfeeff';ctx.lineWidth=40;ctx.beginPath();ctx.moveTo(x-w.cy*w.w/2,y+w.cx*w.w/2);ctx.lineTo(x+w.cy*w.w/2,y-w.cx*w.w/2);ctx.stroke()}
  for(const f of MPJ.fins){const k=f.t/f.max,a=1-k;if(f.small){glow(f.x,f.y,f.rad*(.6+k),f.holy?'#fff2c0':EL[f.el]||'#ffffff');continue}
    ctx.save();ctx.translate(f.x,f.y);ctx.rotate(k*2);MPJ_G.img(ctx,MPJ_G.sigil(f.holy?'#ffe39a':'#e8d8ff'),0,0,f.rad*2*(.7+k*.6),f.rad*2*(.7+k*.6),a);ctx.restore()}
  if(MPJ.chain&&MPJ.chain.nodes)for(const n of MPJ.chain.nodes)glow(n.x,n.y,26+4*Math.sin(time*9),'#fff6b0');
  const k=CAST.cur||CAST.ch,ch=typeof J3CH!=='undefined'&&J3CH?J3CH:null,id=k?k.id:ch?ch.id:null;
  if(id&&isJ3mp(id)&&!P.dead){const s0=SPELLS[id],f=k?(k===CAST.ch?1:clamp(k.t/k.max,0,1)):clamp(ch.f||0,0,1);ctx.save();ctx.translate(P.x,P.y);ctx.rotate(-time*.8);MPJ_G.img(ctx,MPJ_G.sigil(EL[s0.el]||'#d8c8ff'),0,0,(170+110*f),(170+110*f),.45+.4*f);ctx.restore()}
  ctx.globalAlpha=pa}}
// 세로로 서는 것(화면 좌표, lighter): 물벽 · 감옥 · 대창 · 칼날 · 정령왕의 관 · 수호 정령 · 기적의 빛
{const _dl=drawV5Labels;drawV5Labels=function(){const po=ctx.globalCompositeOperation,pa=ctx.globalAlpha;ctx.globalCompositeOperation='lighter';
  try{for(const w of MPJ.waves){const n=Math.max(4,Math.round(w.w/70)),fade=clamp((w.len+60-w.d)/120,0,1)*clamp(w.t*6,0,1);for(let i=0;i<=n;i++){const f=i/n-.5,x=w.x+w.cx*w.d-w.cy*f*w.w,y=w.y+w.cy*w.d+w.cx*f*w.w,s=W2S(x,y);if(!onScreen(s,140))continue;
        const e=MPJ_G.crest();if(e){ctx.globalAlpha=.85*fade;ctx.save();ctx.translate(s.x,s.y);ctx.scale(((w.cx-w.cy)>=0?1:-1)*(1.1+.15*Math.sin(time*7+i)),1.15+.1*Math.sin(time*5+i*2));ctx.drawImage(e.cv,-e.ax,-e.ay,e.w,e.h);ctx.restore()}}}
    for(const e of MPJ.cages){if(!e.j3pr||!e._s)continue;const s=e._s,sc=(e.sc||1)*Math.max(1,e.r/16),a=clamp(e.j3pr.t*3,0,1);MPJ_G.img(ctx,MPJ_G.cage(),s.x,s.y-50*sc,80*sc,130*sc,.9*a)}
    for(const b of MPJ.spears){const k=b.t/b.max,x=b.x+Math.cos(b.a)*b.len*k,y=b.y+Math.sin(b.a)*b.len*k,s=W2S(x,y),s2=W2S(x+Math.cos(b.a)*10,y+Math.sin(b.a)*10),an=Math.atan2(s2.y-s.y,s2.x-s.x),e=MPJ_G.spear();
      if(e){ctx.globalAlpha=1-k*.4;ctx.save();ctx.translate(s.x,s.y-26);ctx.rotate(an);ctx.drawImage(e.cv,-e.ax*1.6,-e.ay*1.6,e.w*1.6,e.h*1.6);ctx.restore()}}
    for(const b of MPJ.blades){const k=clamp(b.t/(b.max-.3),0,1),s=W2S(b.x,b.y),e=MPJ_G.blade();if(e){const y=s.y-260*(1-k*k);ctx.globalAlpha=b.t>b.max-.3?(b.max-b.t)/.3:1;ctx.drawImage(e.cv,s.x-e.ax*1.3,y-e.ay*1.3,e.w*1.3,e.h*1.3)}}
    if(!P.dead&&P._s){const s=P._s,ad=P.buffs.spiritadvent;
      if(ad&&ad.t>0){const a=clamp(ad.t,0,1);MPJ_G.img(ctx,MPJ_G.crown(),s.x,s.y-92+2*Math.sin(time*3),44,28,.95*a);for(let i=0;i<4;i++){const an=time*2.4+i*1.571,x=s.x+Math.cos(an)*36,y=s.y-40+Math.sin(an)*14;ctx.globalAlpha=.9*a;glow(x,y,14,EL[MPJ_QUAD[i][0]])}ctx.globalAlpha=.25*a;glow(s.x,s.y-40,80,'#d8c8ff')}
      const gw=P.buffs.wardspirit;if(gw&&gw.t>0){const an=time*3,x=s.x+Math.cos(an)*26,y=s.y-56+Math.sin(an)*10;ctx.globalAlpha=gw.g&&gw.g.cd>time?.45:.95;glow(x,y,12,'#9fe39a');ctx.globalAlpha=1;ctx.fillStyle='#efffe8';circ(x,y,2.6)}
      if(MPJ.mir){const a=clamp(MPJ.mir.t/MPJ.mir.max,0,1);ctx.globalAlpha=.35*a;glow(s.x,s.y-50,110,'#fff2c0');ctx.globalAlpha=.8*a;ctx.strokeStyle='#ffe39a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x,s.y-96,18,5,0,0,6.283);ctx.stroke()}}
    if(NET.on)for(const [id,t] of MPJ.guards){const r=NET.peers.get(id);if(!r||!r._s||r.dead||!netSame(r))continue;const s=r._s,an=time*3+1;ctx.globalAlpha=.8;glow(s.x+Math.cos(an)*24,s.y-56+Math.sin(an)*9,11,'#9fe39a')}
    for(const a of allies){if(!a.j3thrT||!a._s)continue;ctx.globalAlpha=.4;glow(a._s.x,a._s.y-30,40,'#e8d8ff')}
    for(const f of fields){if(!f.j3||!f.s||!f.s.throne)continue;const s=W2S(f.x,f.y);if(!onScreen(s,160))continue;const fade=clamp(Math.min(f.t*2,(f.max-f.t)*4,1),0,1);ctx.globalCompositeOperation='source-over';MPJ_G.img(ctx,MPJ_G.throne(),s.x,s.y-60,96,120,.92*fade);ctx.globalCompositeOperation='lighter'}
  }finally{ctx.globalAlpha=pa;ctx.globalCompositeOperation=po}
  _dl()}}
// 3차 소환수 · 분신 그림
{const _da=drawAlly;drawAlly=function(a){if(!a.j3f)return _da(a);const s=a._s;if(!s||!onScreen(s,120))return;
  if(a.j3f==='clone'){const b=a.body||(a.body=mpCloneBody());b.x=a.x;b.y=a.y;b.face=a.face;ctx.save();ctx.globalAlpha=.55+.1*Math.sin(time*6);try{drawFigure(ctx,b,s.x,s.y,1)}catch(_){glow(s.x,s.y-30,30,'#b9a2ff')}ctx.restore();
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35;glow(s.x,s.y-30,46,'#b9a2ff');ctx.restore();return}
  const sov=a.j3f==='sovereign',k=(a.aw?a.aw.size:1)*(sov?1:1);
  ctx.save();ctx.globalAlpha=.55;ctx.strokeStyle='#e8c35a';ctx.lineWidth=2;ell2(s.x,s.y,a.r+8,(a.r+8)*.4);ctx.restore();
  const pe=a.pe||(a.pe={k:sov?'j_golem':'l_elem',freezeT:0,stunT:0,slowT:0,elite:false});Object.assign(pe,{x:a.x,y:a.y,fx:a.fx||1,anim:a.anim,lunge:a.lunge,hurt:a.hurt,sc:((TYPES[pe.k]||{}).sc||1)*(sov?1.9:1.45)*k});
  try{drawMon(ctx,pe,s.x,s.y)}catch(_){}
  ctx.save();ctx.globalCompositeOperation='lighter';
  if(sov){for(let i=0;i<4;i++){const an=time*1.8+i*1.571;glow(s.x+Math.cos(an)*a.r*1.6,s.y-a.r*2.6+Math.sin(an)*a.r*.5,16,EL[MPJ_QUAD[i][0]])}MPJ_G.img(ctx,MPJ_G.crown(),s.x,s.y-a.r*4.2,52,32,.9)}
  else{ctx.globalAlpha=.4+.15*Math.sin(time*5);glow(s.x,s.y-34,52,'#ffb070');ctx.globalAlpha=.8;glow(s.x+Math.cos(time*4)*24,s.y-44+Math.sin(time*4)*8,10,'#cfe0ff')}
  ctx.restore();const w=sov?44:34,y=s.y-(sov?a.r*3.4:70);ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,5);ctx.fillStyle='#e8c35a';ctx.fillRect(s.x-w/2,y,w*clamp(a.hp/a.max,0,1),3)}}

/* ===== 아이콘: 새 종류 · 3차는 금빛 테두리와 작은 관 ===== */
const MPJ_FRAME='<rect x="1.4" y="1.4" width="29.2" height="29.2" rx="2.6" fill="none" stroke="#e8c35a" stroke-width="1.3"/><path d="M11 1.6l2.2 2.6L16 .8l2.8 3.4L21 1.6" stroke="#ffe7a0" stroke-width="1.1" fill="none"/>';
{const _ib=iconBody;iconBody=function(s,c,hi){if(!s||!isJ3mp(s.id))return _ib(s,c,hi);return mpIconBody(s,c,hi,_ib)+MPJ_FRAME}}
function mpIconBody(s,c,hi,_ib){if(s.kind==='passive')return _ib(s,c,hi);const st=w=>`stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  switch(s.kind){
    case'wave':return `<path d="M3 26c3-10 9-17 18-18 5 0 8 3 7 7-3-3-7-2-8 2-1 5 3 8 8 9H3z" fill="${c}"/><path d="M8 20c3-6 7-9 12-10" stroke="${hi}" stroke-width="1.4" fill="none"/><path d="M3 29h26" ${st(1.6)}/>`;
    case'gale':return `<path d="M16 16m-2 0a2 2 0 1 0 4 0a5 5 0 1 0-10 0a8 8 0 1 0 16 0a11 11 0 1 0-22 0" ${st(2)}/><path d="M17 6l-3 6h4l-3 6" stroke="${hi}" stroke-width="1.6" fill="none"/>`;
    case'clone':return `<circle cx="11" cy="9" r="3.5" fill="${c}"/><path d="M5 27l2-11h8l2 11z" fill="${c}"/><circle cx="21" cy="9" r="3.5" ${st(1.4)} stroke-dasharray="2 1.5"/><path d="M15 27l2-11h8l2 11z" ${st(1.4)} stroke-dasharray="2 1.5"/>`;
    case'fuse':return `<circle cx="10" cy="18" r="5" fill="${c}" opacity=".8"/><circle cx="22" cy="18" r="5" fill="${hi}" opacity=".8"/><circle cx="16" cy="11" r="6" ${st(2)}/><path d="M12 15l4-3 4 3" stroke="${hi}" stroke-width="1.4" fill="none"/>`;
    case'spchain':return `<circle cx="6" cy="24" r="3" fill="${c}"/><circle cx="16" cy="8" r="3" fill="${c}"/><circle cx="26" cy="22" r="3" fill="${c}"/><path d="M6 24l4-7 2 3 4-12M16 8l3 6 2-2 5 10" stroke="${hi}" stroke-width="1.5" fill="none"/>`;
    case'recall':return `<path d="M24 10a10 10 0 1 0 2 9" ${st(2.2)}/><path d="M26 4v7h-7" ${st(2)}/><circle cx="16" cy="16" r="3.5" fill="${hi}"/>`;
    case'brandburst':return `<path d="M16 4l3 7 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z" ${st(1.8)}/><circle cx="16" cy="15" r="3.5" fill="${hi}"/><path d="M3 6l3 3M29 6l-3 3M3 27l3-3M29 27l-3-3" stroke="${hi}" stroke-width="1.4"/>`;
    case'martyr':return `<path d="M16 27s-10-6-10-13a5.5 5.5 0 0 1 10-3.2A5.5 5.5 0 0 1 26 14c0 7-10 13-10 13z" fill="#e05a5a"/><path d="M16 8v-5M12 5h8" stroke="${hi}" stroke-width="1.6"/><path d="M11 16h10" stroke="${hi}" stroke-width="1.6"/>`;
    case'consec':return `<circle cx="16" cy="16" r="10" ${st(2)}/><path d="M16 9v14M10 15h12" stroke="${hi}" stroke-width="2"/><path d="M24 5l2 4 4 1" ${st(1.6)}/>`;
    case'lswap':return `<path d="M5 11h18l-4-4M27 21H9l4 4" ${st(2.2)}/><circle cx="6" cy="21" r="2.5" fill="${hi}"/><circle cx="26" cy="11" r="2.5" fill="#e05a5a"/>`;
    case'miracle':return `<path d="M16 3l2.6 9.4L28 15l-9.4 2.6L16 27l-2.6-9.4L4 15l9.4-2.6z" fill="${c}"/><circle cx="16" cy="15" r="3" fill="${hi}"/><path d="M4 26c3-3 6-4 9-4M28 26c-3-3-6-4-9-4" ${st(1.4)}/>`;
  }
  if(s.form==='sovereign')return `<path d="M8 28l2-10-4-4 4-6h12l4 6-4 4 2 10z" fill="${c}"/><circle cx="16" cy="6" r="3" fill="${hi}"/>`+MPJ_QUAD.map((q,i)=>`<circle cx="${7+i*6}" cy="13" r="1.8" fill="${EL[q[0]]}"/>`).join('');
  if(s.advent)return `<path d="M6 20l3-12 4 6 3-9 3 9 4-6 3 12z" fill="${c}"/>`+MPJ_QUAD.map((q,i)=>`<circle cx="${8+i*5.3}" cy="25" r="2.2" fill="${EL[q[0]]}"/>`).join('');
  if(s.quad)return MPJ_QUAD.map((q,i)=>`<circle cx="${7+i*6}" cy="${24-i*5}" r="${3+i*.4}" fill="${EL[q[0]]}"/>`).join('')+`<path d="M4 28l20-20" ${st(1)} opacity=".5"/>`;
  return _ib(s,c,hi)}

/* ===== 스킬 창 · 표시 ===== */
// 「파티(주변)」/「한 명」/「자신만」: 새 종류와 장판도 실제로 걸리는 대로
{const _ru=PUI.rule;PUI.rule=function(s){if(s&&isJ3mp(s.id)&&s.j3t&&s.kind!=='passive'){
    if(s.j3t==='one')return _ru.call(this,s);
    if(s.j3t==='self')return{party:false,mode:'self',how:'self',r:0,short:'자신만',text:'자신에게만 걸립니다 (동료에게는 걸리지 않음)'};
    if(s.kind==='field')return{party:true,mode:'area',how:'zone',r:s.rad,short:'파티(주변) · 장판 안',text:`땅에 깐 장판(반경 ${s.rad}) 안에 있는 동료 모두에게 듣습니다`};
    return{party:true,mode:'area',how:'radius',r:s.party||550,short:`파티(주변) · 둘레 ${s.party||550}`,text:`나와, 시전할 때 내 둘레 ${s.party||550} 안에 있는 동료 모두에게 걸립니다${s.kind==='martyr'?' (나는 치유받지 않음)':''}`}}
  return _ru.call(this,s)}}
{const _dh=detailHtml;detailHtml=function(id){mpKindN();return _dh(id)}}
{const _na=numsAt;numsAt=function(id,L){const o=_na(id,L),s=SPELLS[id];if(!s||!isJ3mp(id))return o;const e=eff(id,Math.max(1,L||1));
  if(s.forbid)o.push(['금기 마법','금서의 이해 · 마력 역류가 듣습니다']);if(s.charge)o.push(['모으기',`최대 ${s.charge.max}초 · ${s.charge.mul}배까지`]);
  if(s.final)o.push(['마지막 한 방',`끝까지 버티면 배율 ${s.final.mult}`]);if(s.brk)o.push(['무너짐 게이지',`보스 +${s.brk}`]);if(s.prison)o.push(['감옥',`${s.prison.dur}초 (보스 ${s.prison.boss}초) · 터짐 ${Math.round(s.prison.burst*100)}%`]);
  if(s.exec3)o.push(['집행',`낙인 · 생명력 ${Math.round(s.exec3.hp*100)}% 아래: 바로 쓰러뜨림 (보스 ${s.exec3.boss}배)`]);if(s.sac)o.push(['바치는 생명력',`${Math.round(s.sac*100)}% → 그 ${s.hmul}배 치유`]);
  if(s.guard)o.push(['수호 정령',`반격 · ${s.guard.iv}초마다 한 번 막음`]);if(s.clone)o.push(['분신',`피해 ${Math.round(s.clone.k*100)}%`]);return o}}
// 대사 (lines.js의 말풍선 글자로만 보인다)
Object.assign(SKILL_LINES,{
  quadorb:'네 원소여, 차례로 날아라',forbidblaze:'봉인된 불이여, 이 땅을 덮어라 / 남는 것은 재뿐이리라',elemrelease:'원소의 껍질이여, 벗겨져라',
  forbidtide:'바다의 벽이여, 일어서라 / 앞을 모두 쓸어 가라',manaflux:'마나의 강이여, 거꾸로 흘러라',forbidgale:'하늘의 소용돌이여, 모여라 / 더 크게, 더 크게',
  timerift:'시간의 실이여, 이곳에서 늘어져라',forbidupheave:'잠든 대지여, 뒤집혀라 / 하늘과 땅을 바꾸어라',manaclone:'나를 닮은 마나여, 곁에 서라',
  finalcircle:'불, 얼음, 번개, 대지여 / 이 원 안에서 끝을 맺어라',pactcommand:'계약에 따라, 저것을 쳐라',spiritfusion:'둘이 하나 되어 더 큰 정령이 되어라',
  wardspirit:'작은 정령들이여, 내 동료를 지켜라',spiritchain:'정령들이여, 번개로 이어져라',spiritfrenzy:'정령들이여, 마음껏 날뛰어라',
  pactprice:'계약의 대가를 치르리라',spiritreturn:'흩어진 정령들이여, 돌아오라',spiritsovereign:'네 정령왕의 이름으로 / 군주여, 이 땅에 내려서라',
  spiritthrone:'정령들이여, 왕좌 곁에 모여라',spiritadvent:'네 정령왕과 맺은 계약을 열어 / 이제 내가 왕이 되리라',
  execlance:'죄인을 쫓는 창이여, 날아가라',heavenwrath:'오랫동안 참아 온 하늘이여 / 이제 그 노여움을 쏟으소서',brandspread:'한 죄가 모든 죄를 부르리라',
  lightchaser:'빛보다 먼저 닿으리라',condemnfield:'이 결계 안에서는 / 어떤 죄도 낫지 못하리라',heavenprison:'빛의 창살이여, 저 죄인을 가두라',
  atonelight:'죄가 스러질 때마다 / 우리 상처가 아물게 하소서',judgespear:'하늘의 대장간에서 벼린 창이여 / 끝까지 꿰뚫으라',execution:'판결은 끝났다 / 이제 집행한다',
  heavengate:'닫혀 있던 하늘 문이여 / 오늘 활짝 열리소서',sainttouch:'성자의 손이 그대에게 닿으리라',martyrprayer:'내 생명을 바치니 / 그들을 살리소서',
  lightpath:'빛의 길을 따라 그대에게 가리라',consecrate:'처음의 은총이 / 다시 새롭게 하소서',graceaccel:'은총이 그대의 걸음을 서두르게 하소서',
  lifeswap:'그대의 상처를 / 내가 대신 지리라',saintmarch:'함께 걸으라 / 빛이 앞서 가리니',sanctumfield:'이 땅을 거룩하게 하소서 / 어떤 저주도 닿지 못하게',
  grandrez:'쓰러진 모두여 / 아직 끝이 아니다, 일어나라',saintmiracle:'하늘이여, 단 한 번 / 우리 모두에게 기적을 내리소서'});
setTimeout(()=>{try{mpInit()}catch(err){if(window.__QA)throw err}},0);
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{MPJ,J3MP_SPELLS,isJ3mp,mpFin,mpGaleBoom})}catch(_){}},0);
window.__j3mp={mpReset,MPJ,MPJ_G,J3MP_SPELLS,J3_FORBID,isJ3mp,mpPre,mpPost,mpFin,mpWave,mpFuse,mpRecall,mpBrandBurst,mpConsec,mpMiracle,mpNetSwap,mpNetGale,mpNetFin,mpMartyrAmt,mpStig,mpCastCut,mpPeersIn,mpKindN,get fields(){return fields},get enemies(){return enemies},get allies(){return allies}};
