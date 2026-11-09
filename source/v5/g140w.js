/* ---------- v58 후보 · 2차: 다-3 세계 보스 「별을 삼킨 고래」 ----------
   사용자 2026-11-08 「고레벨 컨텐츠 다음배치 만들고」 → 제안 다-3 「추천대로」.
   · 한국 시각 0 · 6 · 12 · 18시마다(하루 넷) 새 땅 여섯(소금 거울 평원 · 검은 기둥 해안 · 푸른 빛 동굴 · 구름 돌기둥 숲 · 부서진 하늘섬 · 별바다 가장자리)
     가운데 한 곳에 20분 동안 나타난다. 누구나 같은 시각 · 같은 땅(실제 시각 + 씨앗). 지옥에서만.
   · 몸: 정예 생명력의 2.5배(떠도는 강자의 1.6배쯤 · 식은 별의 심장의 6배쯤) · 크기 2배 · 레벨 = 그 땅 끝 +4(최대 170) · 140 넘는 규칙(한 대 피해 140 값). 2~3명이 같이 잡기 좋게(파티 생명력은 party18.js 정예 규칙).
     12초마다 「별 숨결」: 곁의 사람마다 빛 고리 넷 → 1.8초 뒤 떨어짐(맞으면 최대 생명력 10%). 생명력 66 · 33%에 그 땅 정예 셋을 부름.
   · 보상(각자 화면 · 20분 칸마다 캐릭터당 한 번): 별 조각 8 · 희귀 이상 장비 둘(30%로 하나는 유니크) · 재의 결정 6 · 하루 한 번(한국 날짜) 큰 상자(어둠 10단계 보스 상자).
   · 저장: P.g100.g140.wb {s 마지막으로 잡은 칸, d 큰 상자 받은 날, n 잡은 수} — 없으면 기본값. */
const G140B={slot:21600,live:1200,hp:2.5,sc:2,add:4,cap:170,brT:12,brWarn:1.8,brR:85,brPct:.1,sh:8,ash:6,uq:.3,cuts:[.66,.33],
  regs:[G100.salt,G100.coast,G100.cave,G100.spire,G140.sky,G140.grave],k:'wb_whale',n:'별을 삼킨 고래',qa:null};
const G140BV={e:null,falls:[],brT:6,said:{}};
{const W=k=>WX_TYPES[k]||TYPES[k],s=W('b_au1_whale')||W('b_amas');TYPES[G140B.k]={...s,n:G140B.n,boss:0,mini:0,summon:null,skills:null,draw:'serpent',alt:'wolf',col:'#1a1a3a',pcol:'#fff6c8',eye:'#fff6a0',aura:'rgba(255,246,190,.45)',reg:1,g140wb:1};
  if(!MON[TYPES[G140B.k].draw])TYPES[G140B.k].draw='wolf';if(typeof WX21_EL==='object'){WX21_EL[G140B.k]='storm';TYPES[G140B.k].el='storm'}}
const g140BNow=()=>Date.now()/1000+9*3600;
const g140BSlot=()=>Math.floor(g140BNow()/G140B.slot);
const g140BLive=()=>G140B.qa?!!G140B.qa.on:(g140BNow()%G140B.slot)<G140B.live;
const g140BLeft=()=>G140B.live-(g140BNow()%G140B.slot);
const g140BNext=()=>G140B.slot-(g140BNow()%G140B.slot);
const g140BReg=s=>{if(G140B.qa&&G140B.qa.reg)return G140B.qa.reg;s=s==null?g140BSlot():s;return G140B.regs[v20Hash('g140wb|'+s)%G140B.regs.length]};
const g140BDay=()=>Math.floor(g140BNow()/86400);
function g140Wb(){const s=g140S(),o=s.wb;for(const k of ['s','d','n'])o[k]=g140Int(o[k],1e9);return o}
const g140BDone=()=>g140Wb().s===g140BSlot()&&g140Wb().n>0;
function g140BLv(r){const D=REGIONS[r];return Math.min(G140B.cap,D?D.base+40+(D.zcap||5)+G140B.add:160)}
function g140BSpot(r){const L=RCACHE[r],s=mulberry(v20Hash('g140wbsp|'+g140BSlot()+r)%1000003),T=L&&L.town;for(let i=0;i<300;i++){const x=900+s()*4200,y=900+s()*4200;
  if(T&&Math.hypot(x-T.x,y-T.y)<SAFE+1200)continue;if(blockedAt(x,y)||blockedAt(x+80,y)||blockedAt(x-80,y))continue;if(L&&L.lq){const pv=LQ;LQ=L.lq;const w=liqAt(x,y)>.1;LQ=pv;if(w)continue}return{x,y}}return{x:WORLD/2,y:WORLD/2}}
function g140BTick(dt){const e0=G140BV.e;if(e0&&(e0.dead||!enemies.includes(e0)||e0.slot!==g140BSlot()||!g140BLive()||DG||IN||REG.id!==e0.reg)){if(!e0.dead&&enemies.includes(e0)&&(!g140BLive()||e0.slot!==g140BSlot())){const i=enemies.indexOf(e0);if(i>=0)enemies.splice(i,1)}G140BV.e=null;G140BV.falls=[]}
  if(!P||P.lvl<130)return;const live=g140BLive(),r=g140BReg(),sl=g140BSlot();
  if(live&&!G140BV.said['a'+sl]){G140BV.said['a'+sl]=1;const t=`세계 보스 「${G140B.n}」가 ${REGIONS[r].n}에 나타났습니다 · 20분 · 지옥`;msg(t,'#fff6a0');if(typeof chatSys==='function')try{chatSys(t,'#fff6a0')}catch(_){}}
  if(DG||IN||P.diff!==2||!live||REG.id!==r)return;
  if(!G140BV.said['b'+sl]&&!g140BDone()){G140BV.said['b'+sl]=1;banner={t:`세계 보스 · ${G140B.n}`,sub:`이 땅 어딘가 · 남은 시간 ${Math.ceil(g140BLeft()/60)}분 · 화면 가장자리 화살표를 따라가세요`,col:'#fff6a0',life:3,max:3}}
  if(NET.guest||G140BV.e||g140BDone())return;
  const p=g140BSpot(r),lv=g140BLv(r),e=dgMob(G140B.k,p.x,p.y,lv,{elite:true});e.hp=e.max=Math.round(e.hp*G140B.hp);e.sc=G140B.sc;e.r*=1.6;e.g140wb=1;e.slot=sl;e.reg=r;e.wx=p.x;e.wy=p.y;e.cut=0;
  if(typeof g100Fix==='function')g100Fix(e);G140BV.e=e}
// 별 숨결 · 부름 (별 숨결은 각자 화면 · 부름은 방장)
function g140BFight(dt){const e=G140BV.e;if(!e||e.dead||!e.aggroed||P.dead||dist(P,e)>1100){G140BV.falls=G140BV.falls.filter(f=>!f.done&&f.t>0);return}
  G140BV.brT-=dt;if(G140BV.brT<=0){G140BV.brT=G140B.brT;for(let i=0;i<4;i++){const a=R()*6.283,d=i?rnd(80,240):rnd(0,40);G140BV.falls.push({x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d,t:G140B.brWarn})}ftext(e.x,e.y-90,'별 숨결!','#fff6a0',true,70)}
  for(const f of G140BV.falls){f.t-=dt;if(f.t<=0&&!f.done){f.done=1;rings.push({x:f.x,y:f.y,r:10,max:G140B.brR+30,life:.5,col:'#fff6a0'});if(!P.dead&&Math.hypot(P.x-f.x,P.y-f.y)<G140B.brR+P.r)hitPlayer(maxHp()*G140B.brPct,null)}}
  G140BV.falls=G140BV.falls.filter(f=>f.t>-.3);
  if(!NET.guest){const hr=e.hp/e.max,mobs=(REGIONS[e.reg].mobs||[]).filter(k=>TYPES[k]&&!TYPES[k].boss&&!TYPES[k].mini);while(e.cut<G140B.cuts.length&&hr<=G140B.cuts[e.cut]){e.cut++;
    for(let i=0;i<3&&mobs.length;i++){const a=R()*6.283,m=dgMob(pick(mobs),e.x+Math.cos(a)*200,e.y+Math.sin(a)*160,e.lvl-4,{elite:true});m.aggroed=true;if(typeof g100Fix==='function')g100Fix(m)}
    banner={t:'고래가 별바다 짐승을 불렀습니다',sub:'정예 셋',col:'#fff6a0',life:2,max:2}}}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(!P||paused)return r;try{G140BV.t=(G140BV.t||0)-dt;if(G140BV.t<=0){G140BV.t=.5;g140BTick(.5)}if(!DG&&!IN)g140BFight(dt)}catch(e){if(window.__QA)throw e}return r}}
// 보상 (각자 화면)
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&e&&e.g140wb&&!e.g140got){e.g140got=1;const o=g140Wb(),sl=e.slot||g140BSlot();if(o.s===sl&&o.n>0)return r;
  o.s=sl;o.n=g140Int(o.n+1);g140ShAdd(G140B.sh,e.x,e.y);
  for(let i=0;i<2;i++){let it=null;if(i===0&&R()<G140B.uq){it=makeItem(MAXLV,true,P.cls,'uniq')}if(!it||(it.rar|0)<2)for(let k=0;k<80&&!(it&&it.rar>=2);k++)it=makeItem(MAXLV,true);if(it&&it.rar<2)it.rar=2;if(it)loot.push({x:e.x+rnd(-40,40),y:e.y+rnd(-40,40),kind:'item',item:it,t:0,keep:1})}
  if(typeof ashGain==='function')ashGain(G140B.ash,e.x,e.y);let big='';const day=g140BDay();if(o.d!==day){o.d=day;if(typeof end22Drop==='function'){end22Drop('dark',10,e.x,e.y+40,{kind:'boss',chest:1});big=' · 오늘의 큰 상자'}}
  banner={t:`${G140B.n}을(를) 쓰러뜨렸습니다`,sub:`세계 보스 · 별 조각 ${G140B.sh} · 희귀 이상 장비 둘 · 재의 결정 ${G140B.ash}${big}`,col:'#ffd76a',life:3.2,max:3.2};save()}}catch(err){if(window.__QA)throw err}return r}}
// 그림: 고리 · 화살표 · 빛
{const _ddf=drawDecalsFields;drawDecalsFields=function(){_ddf.apply(this,arguments);if(DG||IN)return;try{for(const f of G140BV.falls){if(f.done)continue;const u=1-f.t/G140B.brWarn;
  ctx.globalAlpha=.2+.3*u;ctx.fillStyle='#3a3420';ctx.beginPath();ctx.arc(f.x,f.y,G140B.brR*(.3+.7*u),0,6.283);ctx.fill();ctx.globalAlpha=.85;ctx.strokeStyle='#fff6a0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,G140B.brR,0,6.283);ctx.stroke();ctx.globalAlpha=1}}catch(e){if(window.__QA)throw e}}}
{const _de=drawEnemy;drawEnemy=function(e){const r=_de.apply(this,arguments);try{if(e&&e.g140wb&&e._s){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.25+.1*Math.sin(time*2);glow(e._s.x,e._s.y-70,150,'#fff6c8');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}catch(err){if(window.__QA)throw err}return r}}
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);try{const e=G140BV.e;if(DG||IN||!e||e.dead||!e._s)return;const s=e._s;S();
  ctx.font=`700 14px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';const m=Math.max(0,Math.floor(g140BLeft()/60)),t0=`세계 보스 ${G140B.n} · ${Math.round(e.hp/e.max*100)}% · ${m}분 남음`;ctx.strokeText(t0,W/2,118);ctx.fillStyle='#fff6a0';ctx.fillText(t0,W/2,118);
  if(s.x>40&&s.y>40&&s.x<W-40&&s.y<H-40)return;const cx=W/2,cy=H/2,a=Math.atan2(s.y-cy,s.x-cx),mm=Math.min((W/2-50)/Math.abs(Math.cos(a)||1e-6),(H/2-60)/Math.abs(Math.sin(a)||1e-6)),x=cx+Math.cos(a)*mm,y=cy+Math.sin(a)*mm,d=Math.round(dist(P,e)/10);
  ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#fff6a0';ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-8,-11);ctx.lineTo(-3,0);ctx.lineTo(-8,11);ctx.closePath();ctx.fill();ctx.restore();
  ctx.font=`600 12px ${FONT}`;const t=`세계 보스 ${d}m`;ctx.strokeText(t,x-Math.cos(a)*30,y-Math.sin(a)*22);ctx.fillStyle='#fff6c8';ctx.fillText(t,x-Math.cos(a)*30,y-Math.sin(a)*22)}catch(err){if(window.__QA)throw err}}}
// 세계 지도: 지금 나온 땅에 ✦
{const _w=wmapWorld22;wmapWorld22=function(g,Wd,Hd){const r=_w.apply(this,arguments);try{const G=WMAP.geo;if(!G||!P||!g140BLive())return r;const id=g140BReg();if(!WPOS[id])return r;const p=G.pos(id),L=p.x-G.w/2,T=p.y-G.h/2;
  g.font=`700 ${G.fs+2}px ${FONT}`;g.textAlign='left';g.fillStyle=g140BDone()?'#7a7468':'#fff6a0';g.fillText('✦',L+4,T+G.h-4)}catch(e){if(window.__QA)throw e}return r}}
// 성장(G) 「별」 칸에 시간표
{const T=G42.tabs.find(t=>t.k==='g140star');if(T){const _h=T.html;T.html=function(){const live=g140BLive(),o=g140Wb(),r=g140BReg(),nr=g140BReg(g140BSlot()+1);
  return _h.apply(this,arguments)+`<div class="v20box"><h3>세계 보스 · ${G140B.n} <span class="muted">잡은 수 ${o.n} · 한국 0 · 6 · 12 · 18시 · 20분 · 지옥</span></h3>`+
    `<p style="margin:2px 0">${live?`<span style="color:#fff6a0">지금 ${REGIONS[r].n}에 있음</span> · ${Math.ceil(g140BLeft()/60)}분 남음${g140BDone()?' (이번에 잡음)':''}`:`다음: ${Math.floor(g140BNext()/3600)}시간 ${Math.ceil((g140BNext()%3600)/60)}분 뒤 ${REGIONS[nr].n}`}</p>`+
    `<p class="muted" style="margin:2px 0">보상(나올 때마다 한 번): 별 조각 ${G140B.sh} · 희귀 이상 장비 둘(가끔 유니크) · 재의 결정 ${G140B.ash} · 하루 한 번 큰 상자${o.d===g140BDay()?' (오늘 받음)':''}. 2~3명이 같이 잡으면 좋아요.</p></div>`}}}
window.__g140w={G140B,G140BV,g140BSlot,g140BLive,g140BReg,g140BLv,g140BTick,g140Wb,g140BDone};
