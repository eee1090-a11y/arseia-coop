/* ---------- v57 후보 · 3차 묶음: 가-6 어둠 맛보기 · 나-7 룬 미리 열기 · 나-6 짐승 · 말 다음 단계 · 나-9 갈래 이야기 의뢰 ----------
   사용자 2026-11-07 「100레벨 이후의 성장 컨텐츠가 부족해」 → 제안 「모두 추천대로」.
   · 가-6: 130레벨이 되면 재의 군주를 쓰러뜨리지 않아도 어둠의 등불 1~3단계가 열린다. 4단계부터는 지금처럼 재의 군주를 쓰러뜨린 뒤
     (군주 전이면 3단계를 깨도 4단계가 안 열리고, 군주를 쓰러뜨리면 3단계를 깬 적이 있을 때 바로 4단계가 열림).
     등불 집에 못 가도 성장 G · 3차 성장에서 단계를 고를 수 있다(130레벨부터 · 지옥 난이도에서만 바뀜은 그대로).
   · 나-7: 101~140레벨 동안 레벨마다 각인 점수 1점을 미리 받는다(모두 40점 · P.rune.pv에 받은 수).
     미리 받은 점수는 각인 막대 값(runeNeed)을 올리지 않는다. 이미 140인 캐릭터도 불러오면 40점을 받는다.
   · 나-6 짐승: 110레벨 둘째 고유 기술(14초마다) · 125레벨 각성(생명력 · 공격 +20%, 조금 크고 빛남).
     말: 120레벨 「바람 갈기 훈련」(금화 300,000 · 광석 40 · 마을 · 쉼터) → 이동 +10% 더(준마 +50% → +60%).
     말 털빛 넷(강자의 증표 10개씩): 내 화면에서만 바뀐다(동료 화면은 예전 말).
   · 나-9: 첨탑 광장 기록관 하엘의 의뢰 24편(g100d.js G100_STQ) · 내 3차 갈래와 다르면 잠김.
     셋째 편을 처음 마치면 유니크 장비 하나와 칭호 「(대가)의 계승자」. 갈래 상징 장비의 새 외형은 그림이 오면 붙인다.
   · 저장: P.g100.pe {mt, hc[], ho, dk} · P.rune.pv (rune21의 모르는 칸 보존으로 남음). 없으면 기본. */
const G100X={darkLv:130,darkTop:3,pvFrom:100,pvMax:40,pet2Lv:110,petAwLv:125,petAwMul:1.2,pet2Cd:14,mtLv:120,mtGold:300000,mtOre:40,mtSpd:.1,hcCost:10,
  hc:{black:{n:'흑마',f:'brightness(.5) saturate(.8)'},white:{n:'백마',f:'grayscale(.7) brightness(1.7)'},red:{n:'적토마',f:'sepia(.6) hue-rotate(-25deg) saturate(2.2)'},ash:{n:'잿빛 말',f:'grayscale(1) brightness(.85)'}},
  pet2:{wolf:{n:'물어뜯기',d:'노린 적에게 세 배 피해 · 2초 느려짐'},hawk:{n:'바람깃',d:'둘레 적 넷에게 1.5배 피해'},golem:{n:'땅 울림',d:'둘레 적에게 1.5배 피해 · 1초 기절'},spirit:{n:'정령의 가호',d:'내 마나 10% 회복 · 생명력 8% 보호막'}},
  qa:false,pT:7,said:{}};
const g100XOn=()=>!window.__QA||G100X.qa;// 시험 중에는 다른 시험(룬 · 등불)의 값이 저절로 바뀌지 않게
const g100Pe=()=>{const s=g100S();if(!g100Obj(s.pe))s.pe={};return s.pe};
const g100Lord=()=>!!(P&&P.w3&&(P.w3.lord|0)>0);

/* ===== 가-6 어둠 1~3단계 맛보기 ===== */
function g100DarkTick(){if(!P||GHOST||!g100XOn()||typeof darkSt!=='function')return;const s=darkSt(),pe=g100Pe();
  if(P.lvl>=G100X.darkLv&&s.open<G100X.darkTop){s.open=G100X.darkTop;if(!g100Lord()){msg(`${G100X.darkLv}레벨: 「어둠의 등불」 1~${G100X.darkTop}단계가 열렸습니다 · 지옥 난이도에서 성장(G) → 3차 성장 또는 「꺼진 등대지기의 집」 등불에서 고릅니다 (4단계부터는 재의 군주를 쓰러뜨린 뒤)`,'#c8a0ff');banner={t:'어둠의 등불',sub:`어둠 1~${G100X.darkTop}단계가 열렸습니다`,col:'#b48aff',life:3,max:3}}save()}
  if(!g100Lord()&&s.open>G100X.darkTop){s.open=G100X.darkTop;if(s.cur>s.open)s.cur=s.open;pe.dk=1}
  if(g100Lord()&&pe.dk){delete pe.dk;if((s.top|0)>=s.open&&s.open<DARK_MAX){s.open=Math.min(DARK_MAX,(s.top|0)+1);msg(`어둠 ${s.open}단계가 열렸습니다 (재의 군주를 쓰러뜨림)`,'#c8a0ff')}save()}}
if(typeof darkClear==='function'){const _dc=darkClear;darkClear=function(t){const s=darkSt(),lock=!g100Lord()&&(t|0)>=G100X.darkTop&&s.open<=G100X.darkTop;if(!lock)return _dc.apply(this,arguments);
  const o=s.open;s.open=G100X.darkTop+1;let r;try{r=_dc.apply(this,arguments)}finally{s.open=Math.min(o,G100X.darkTop);if(s.cur>s.open)s.cur=s.open;g100Pe().dk=1}
  msg(`${G100X.darkTop+1}단계부터는 재의 군주를 쓰러뜨린 뒤 열립니다`,'#a39d8f');save();return r}}
V20.slowTick.push(()=>{try{g100DarkTick();g100PvTick()}catch(err){if(window.__QA)throw err}});
function g100DarkHtml(){if(!P||P.lvl<G100X.darkLv||typeof darkSt!=='function')return '';const s=darkSt(),cur=s.cur|0,g=!!NET.guest;
  let h=`<div class="v20box"><h3>어둠 단계 <span class="muted">${G100X.darkLv}레벨부터 1~${G100X.darkTop}단계 · 4단계부터는 재의 군주 뒤 · 지옥 난이도에서만 바뀜</span></h3>`;
  if(s.open<1)return h+'<p class="muted">곧 열립니다.</p></div>';
  h+=`<p class="muted" style="margin:2px 0 6px">지금 ${cur?`어둠 ${cur}단계`:'꺼짐'} · 열린 단계 ${s.open} · 자세한 수치는 「꺼진 등대지기의 집」 등불${g?' · 같이 하기에서는 방장이 고른 단계를 따릅니다':''}</p><div class="btns" style="flex-wrap:wrap">`;
  for(let t=0;t<=s.open;t++)h+=v20Btn('d21set',t,t?`${t}단계`:'끄기',{cls:t===cur?'':'ghost',dis:g||t===cur});return h+'</div></div>'}

/* ===== 나-7 룬 각인 미리 받기 ===== */
const g100PvWant=()=>P?Math.max(0,Math.min(G100X.pvMax,(P.lvl|0)-G100X.pvFrom)):0;
function g100PvTick(){if(!P||GHOST||!g100XOn()||typeof runeSt!=='function')return;const r=runeSt(),pv=Math.max(0,r.pv|0),w=g100PvWant();if(w<=pv)return;
  r.n=(r.n|0)+(w-pv);r.pv=w;if(typeof runeBump==='function')runeBump();
  msg(`각인 점수 ${w-pv}점을 미리 받았습니다 (100~140레벨 동안 레벨마다 1점 · 미리 받은 점수 ${w}/${G100X.pvMax}) — 캐릭터 창 「룬 각인」`,'#6ee0d0');save()}
let G100PVC=null;// runeClean 중에는 아직 P.rune이 옛 값이라 다듬는 저장의 pv를 쓴다
if(typeof runeClean==='function'){const _rc=runeClean;runeClean=function(d){const o=G100PVC;G100PVC=d&&typeof d==='object'?Math.max(0,d.pv|0):0;try{const r=_rc.apply(this,arguments);if(r)r.pv=Math.min(G100X.pvMax,G100PVC);return r}finally{G100PVC=o}}}
if(typeof runeNeed==='function'){const _rn=runeNeed;runeNeed=function(n){const r=P&&P.rune;n=n==null?(r?r.n:0):n;const pv=G100PVC!=null?G100PVC:r?Math.max(0,r.pv|0):0;return _rn(Math.max(0,(n|0)-pv))}}
if(typeof runeTabHtml==='function'){const _th=runeTabHtml;runeTabHtml=function(){const h=_th.apply(this,arguments);const r=P&&P.rune;if(!r||!(r.pv>0))return h;
  return `<p class="muted" style="margin:0 0 6px">미리 받은 각인 점수 <b style="color:#6ee0d0">${r.pv}</b> / ${G100X.pvMax} (101~140레벨 동안 레벨마다 1점 · 각인 막대 값은 그대로)</p>`+h}}

/* ===== 나-6 동료 짐승: 둘째 기술 · 각성 ===== */
if(typeof g42PetMake==='function'){const _pm=g42PetMake;g42PetMake=function(){const a=_pm.apply(this,arguments);try{if(a&&P&&P.lvl>=G100X.petAwLv){const m=G100X.petAwMul;a.max=a.hp=Math.round(a.max*m);a.dmg*=m;a.r=Math.round(a.r*1.1);a.g100aw=1}}catch(err){if(window.__QA)throw err}return a}}
function g100PetSkill2(a,k){const col='#ffe08a';
  if(k==='wolf'){let tg=null,bd=360;for(const e of enemies){if(e.dead)continue;const d=dist(e,a);if(d<bd){bd=d;tg=e}}if(!tg)return 0;a.x=tg.x+rnd(-14,14);a.y=tg.y+14;a.lunge=.3;hurtE(tg,a.dmg*3,a.s);tg.slowT=Math.max(tg.slowT||0,2);burst(tg.x,tg.y,'#ff8a6a',16,120,3,14);ftext(tg.x,tg.y-40,'물어뜯기!',col,false,60);return 1}
  if(k==='hawk'){const fs=enemies.filter(e=>!e.dead&&dist(e,a)<220).sort((x,y)=>dist(x,a)-dist(y,a)).slice(0,4);for(const e of fs){hurtE(e,a.dmg*1.5,a.s);burst(e.x,e.y,'#dff4ff',8,110,2,10)}if(fs.length){rings.push({x:a.x,y:a.y,r:10,max:220,life:.5,col:'#dff4ff'});ftext(a.x,a.y-60,'바람깃!',col,false,60)}return fs.length}
  if(k==='golem'){let n=0;for(const e of enemies)if(!e.dead&&dist(e,a)<180){hurtE(e,a.dmg*1.5,a.s);if(!e.big)e.stunT=Math.max(e.stunT||0,1);n++}rings.push({x:a.x,y:a.y,r:10,max:180,life:.6,col:'#c8b890'});if(n)ftext(a.x,a.y-60,'땅 울림!',col,false,60);return n}
  if(k==='spirit'){const m=Math.round(maxMp()*.1),s=Math.round(maxHp()*.08);P.mp=Math.min(maxMp(),P.mp+m);P.shield=(P.shield||0)+s;rings.push({x:P.x,y:P.y,r:8,max:90,life:.6,col:'#bff0ff'});ftext(P.x,P.y-50,`정령의 가호 +${s}`,'#bff0ff',false,60);return 1}
  return 0}
{const _u=update;update=function(dt){_u(dt);try{if(!P||GHOST||P.dead||P.lvl<G100X.pet2Lv)return;const a=typeof g42PetLive==='function'&&g42PetLive();if(!a||a.hp<=0||a.gone)return;
  if(!enemies.some(e=>!e.dead&&dist(e,a)<520))return;G100X.pT-=dt;if(G100X.pT<=0){G100X.pT=G100X.pet2Cd;g100PetSkill2(a,a.g42pet)}}catch(err){if(window.__QA)throw err}}}
queueMicrotask(()=>{const _da=drawAlly;drawAlly=function(a){if(!a||!a.g100aw||!a._s)return _da.apply(this,arguments);const s=a._s;// 동료 그림(kart48 · fxphys)도 microtask에서 감싸므로 그 뒤에 감싼다
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.32+.12*Math.sin(time*3);glow(s.x,s.y-18,a.r+26,'#ffe08a');ctx.restore();
  ctx.save();ctx.translate(s.x,s.y);ctx.scale(1.15,1.15);ctx.translate(-s.x,-s.y);try{return _da.apply(this,arguments)}finally{ctx.restore()}}});
function g100PetHtml(){if(!P||P.lvl<100)return '';const p=P.g42&&P.g42.pet,k=p&&p.k,D=k&&G100X.pet2[k];
  return `<div class="v20box"><h3>짐승의 다음 단계 <span class="muted">110 · 125레벨</span></h3><p class="muted" style="margin:4px 0">${G100X.pet2Lv}레벨: 둘째 고유 기술(${G100X.pet2Cd}초마다) · ${G100X.petAwLv}레벨: 각성(생명력 · 공격 +20%, 조금 커지고 빛남)</p>`+
    Object.keys(G100X.pet2).map(x=>`<div class="muted" style="font-size:12px"><b style="color:${x===k?'#ffe08a':'#efe2c0'}">${G42_PET[x].n}</b> 「${G100X.pet2[x].n}」 ${G100X.pet2[x].d}</div>`).join('')+
    `<p style="margin:6px 0 0">${D?`지금: ${P.lvl>=G100X.pet2Lv?`「${D.n}」 씀`:`「${D.n}」 ${G100X.pet2Lv-P.lvl}레벨 남음`} · ${P.lvl>=G100X.petAwLv?'각성함':`각성 ${G100X.petAwLv-P.lvl}레벨 남음`}`:'<span class="muted">동료 짐승을 들이면 씁니다.</span>'}</p></div>`}

/* ===== 나-6 말: 바람 갈기 훈련 · 털빛 ===== */
const g100MtX=()=>!!(g100Pe().mt);
V20A.g100mtup=()=>{if(!P)return;const m=g42Mt(),M=g42Mat(),pe=g100Pe();if(pe.mt||!m.own||m.lv<2||P.lvl<G100X.mtLv||P.gold<G100X.mtGold||(M.ore|0)<G100X.mtOre||!g42InTown())return;
  P.gold-=G100X.mtGold;M.ore-=G100X.mtOre;pe.mt=1;msg(`바람 갈기 훈련을 마쳤습니다: 이동 +${Math.round((G42_MT.spd[2]+G100X.mtSpd)*100)}%`,'#d8b890');save()};
{const _u=update;update=function(dt){const m=P&&P.g42&&P.g42.mt,on=!!(m&&m.on&&m.lv>=2&&!DG&&!IN&&P&&!GHOST&&g100MtX()),x0=P&&P.x,y0=P&&P.y;_u(dt);if(!on||!P||!P.moving||P.dead||G42G.mtT>0)return;
  const dx=P.x-x0,dy=P.y-y0,d=Math.hypot(dx,dy),k0=G42_MT.spd[2];if(d<.01||d>SPEED*1.2*(1+k0)*dt)return;const k=G100X.mtSpd/(1+k0);moveBody(P,dx*k,dy*k);P.x=clamp(P.x,20,WORLD-20);P.y=clamp(P.y,20,WORLD-20)}}
const g100Hc=()=>{const pe=g100Pe();return Array.isArray(pe.hc)?pe.hc.filter(k=>G100X.hc[k]):[]};
V20A.g100hc=k=>{if(!P)return;const pe=g100Pe(),own=g100Hc();k=String(k||'');if(!k){delete pe.ho;msg('말 털빛을 처음대로 돌렸습니다','#d8b890');save();return}if(!G100X.hc[k])return;
  if(!own.includes(k)){const s=g100S();if(!g42InTown()||s.tok<G100X.hcCost)return;s.tok-=G100X.hcCost;pe.hc=[...own,k];msg(`말 털빛 「${G100X.hc[k].n}」을(를) 들였습니다 (강자의 증표 ${G100X.hcCost}개)`,'#d8b890')}
  pe.ho=k;save()};
{const _hr=g42Horse;g42Horse=function(o,s,st){const pe=P&&o===P&&P.g100&&P.g100.pe,H=pe&&pe.ho&&G100X.hc[pe.ho];if(!H||!Array.isArray(pe.hc)||!pe.hc.includes(pe.ho))return _hr.apply(this,arguments);
  const f0=ctx.filter;ctx.filter=H.f;try{return _hr.apply(this,arguments)}finally{ctx.filter=f0}}}
function g100MtHtml(){if(!P||P.lvl<100)return '';const m=g42Mt(),M=g42Mat(),tw=g42InTown(),pe=g100Pe(),own=g100Hc(),tok=g100S().tok|0;
  let h=`<div class="v20box"><h3>바람 갈기 훈련 <span class="muted">· ${G100X.mtLv}레벨 · 준마 다음 · 이동 +${Math.round((G42_MT.spd[2]+G100X.mtSpd)*100)}%</span></h3>`;
  h+=pe.mt?'<p>마쳤습니다.</p>':`${v20Btn('g100mtup',1,`훈련 · 금화 ${G100X.mtGold.toLocaleString()} · 광석 ${G100X.mtOre}`,{dis:!m.own||m.lv<2||P.lvl<G100X.mtLv||P.gold<G100X.mtGold||(M.ore|0)<G100X.mtOre||!tw})}${m.lv<2?'<p class="muted">준마 훈련을 먼저 마쳐야 합니다.</p>':''}${tw?'':'<p class="muted">마을 · 쉼터 안에서</p>'}`;
  h+=`</div><div class="v20box"><h3>말 털빛 <span class="muted">· 강자의 증표 ${G100X.hcCost}개씩 (가진 증표 ${tok}) · 내 화면에서만 바뀜</span></h3><div class="btns" style="flex-wrap:wrap">`;
  h+=v20Btn('g100hc','','처음 털빛',{cls:pe.ho?'ghost':'',dis:!pe.ho});
  for(const k in G100X.hc){const o=own.includes(k);h+=v20Btn('g100hc',k,o?G100X.hc[k].n:`${G100X.hc[k].n} · 증표 ${G100X.hcCost}`,{cls:pe.ho===k?'':'ghost',dis:pe.ho===k||!m.own||!o&&(!tw||tok<G100X.hcCost)})}
  return h+'</div></div>'}
for(const [k,f] of [['pet',g100PetHtml],['mt',g100MtHtml],['g100',g100DarkHtml]]){const T=G42.tabs.find(t=>t.k===k);if(T){const _h=T.html;T.html=function(){return _h.apply(this,arguments)+f()}}}

/* ===== 나-9 갈래 이야기 의뢰 ===== */
{const _a=sqAvail;sqAvail=function(q){const v=_a(q);if(q&&q.j3&&v!=='active'&&v!=='done'&&!(P&&P.job3===q.j3))return 'locked';return v}}
function g100StUniq(){let it=makeItem(Math.min(P.lvl,MAXLV),true,P.cls,'uniq');if(!it||it.rar<4){for(let i=0;i<80&&!(it&&it.rar>=4);i++)it=makeItem(Math.min(P.lvl,MAXLV),true,P.cls,'uniq')}if(!it)return null;
  if(P.bag.length<sqBagCap())P.bag.push(it);else loot.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),kind:'item',item:it,t:0,keep:1});msg(`보상: ${it.name}`,RAR[it.rar].c);return it}
{const _f=sqFinish;sqFinish=function(id){const q=SQBY[id],first=!!(q&&q.g100tt&&P&&!(sqState().d[id]>0));const r=_f.apply(this,arguments);
  try{if(first&&sqState().d[id]>0){g100StUniq();msg(`칭호 「${q.g100tt}」를 얻었습니다 (캐릭터 창 칭호)`,'#ffe39a');save()}}catch(err){if(window.__QA)throw err}return r}}
if(typeof V20==='object'&&V20.titles)for(const q of G100_STQ)if(q.g100tt)V20.titles.push({id:'g100st_'+q.j3,n:q.g100tt,col:'#ffe39a',src:`갈래 이야기 의뢰 「${q.t}」`,have:()=>!!(P&&sqState().d[q.id]>0)});
window.__g100xb={G100X,g100DarkTick,g100PvTick,g100PvWant,g100PetSkill2,g100Pe,g100Hc};
