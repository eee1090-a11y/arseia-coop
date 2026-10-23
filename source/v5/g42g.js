/* ---------- v42 동료 짐승 (제안 9) · 탈것 (제안 10) ----------
   · 동료 짐승: 60레벨부터. 70~100레벨 지역(지옥 지역도)에서 몬스터 40마리를 잡으면 짐승들이 따른다 → 늑대 · 매 · 돌 골렘 · 작은 정령 가운데 하나(마을에서 언제든 바꿈).
     늘 곁에서 싸운다(쓰러지면 20초 뒤 다시). 70레벨 단련(+30%) · 80레벨 고유 기술 · 90레벨 깊은 유대(+30%, 기술 더 자주).
   · 탈것: 60레벨부터 말(금화 + 약초 먹이). H 또는 「말」 단추로 타고 내린다. 타면 이동 +35%(80레벨 준마 훈련 뒤 +50%).
     마법을 쓰거나 맞으면 내린다. 던전 · 3막 안에서는 못 탄다.
   · 그림: 늑대는 이미 있는 늑대 그림(0 A.D.), 돌 골렘은 이미 있는 돌 골렘 몬스터 그림, 작은 정령은 서머너 정령 빛, 매와 말은 0 A.D. 모형을 그림으로 옮긴 새 묶음(img/flare-m-hawk.js · flare-m-horse.js, 없으면 예전 매 그림 · 말 없이).
   · 저장: P.g42.pet {tr, k}, P.g42.mt {own, lv, on}. 없으면 없음. */
const G42_PET={
 wolf:{n:'늑대',d:'앞에서 적을 붙잡아 둡니다',hp:.5,dmg:.45,form:'wolf',taunt:1,sk:{n:'울부짖음',d:'둘레 적에게 큰 피해를 주고 붙잡아 둠'}},
 hawk:{n:'매',d:'빠르게 날아 급소를 쪼습니다',hp:.3,dmg:.6,form:'g42hawk',fly:1,sk:{n:'급강하',d:'노린 적에게 네 배 피해'}},
 golem:{n:'돌 골렘',d:'단단한 몸으로 맞아 줍니다',hp:1.1,dmg:.25,form:'g42golem',taunt:1,sk:{n:'돌가죽',d:'나에게 최대 생명력 12%만큼 보호막'}},
 spirit:{n:'작은 정령',d:'싸우는 동안 조금씩 생명력을 채워 줍니다',hp:.35,dmg:.2,form:'g42spirit',fly:1,heal:.02,sk:{n:'치유의 빛',d:'내 생명력 15% 회복'}}};
const G42_PETN=40,G42_PETLV=[60,70,80,90];
const G42G={pet:null,deadT:0,skT:6,healT:5,mtT:0};
function g42Pet(){const g=g42S();if(!v20Obj(g.pet))g.pet={};const p=g.pet;p.tr=Math.min(G42_PETN,Math.max(0,p.tr|0));if(p.k&&!G42_PET[p.k])p.k='';return p}
const g42PetOn=()=>P&&P.lvl>=G42_PETLV[0];
const g42PetMul=()=>1+(P.lvl>=70?.3:0)+(P.lvl>=90?.3:0);
function g42PetMake(){const p=g42Pet(),D=G42_PET[p.k];if(!D)return null;const m=g42PetMul(),hp=Math.round(maxHp()*D.hp*m),pw=power()*D.dmg*m*dmgMul()*(1+P.lvl/20);
  const s={id:'g42pet',n:D.n,cls:'',el:'phys',kind:'summon',form:D.form,taunt:D.taunt||0,dur:1e9,rank:1};
  const a={ally:1,g42pet:p.k,x:P.x+rnd(-50,50),y:P.y+rnd(30,60),hp,max:hp,r:p.k==='golem'?22:p.k==='hawk'?12:p.k==='spirit'?10:18,dmg:pw,t:1e9,s,atkCd:.6,anim:R()*3,fx:1,lunge:0,hurt:0,fly:D.fly?1:0};
  if(DG&&typeof dgLand==='function'){const q=dgLand(P.x,P.y,a.x,a.y);a.x=q.x;a.y=q.y}allies.push(a);rings.push({x:a.x,y:a.y,r:6,max:60,life:.5,col:'#c8e0a0'});return a}
// 동료는 길들인 짐승이라 맞는 피해를 줄여 준다 (골렘 30% · 늑대 40% · 나머지 50%만 받음)
const G42_PETDR={golem:.3,wolf:.4,hawk:.5,spirit:.5};
{const _h=hurtAlly;hurtAlly=function(a,d){if(a&&a.g42pet)d*=G42_PETDR[a.g42pet]||.5;return _h(a,d)}}
const g42PetLive=()=>allies.find(a=>a.g42pet&&!a.gone&&a.hp>0)||null;
function g42PetTick(dt){if(!P||GHOST)return;const p=g42Pet(),D=G42_PET[p.k];let a=g42PetLive();if(G42G.ref&&G42G.ref!==a){if(G42G.ref.hp<=0)G42G.deadT=20;G42G.ref=null}
  if(!D||!g42PetOn()||P.dead){if(a){a.gone=true}return}
  if(a&&a.g42pet!==p.k){a.gone=true;a=null}
  if(!a){G42G.deadT-=dt;if(G42G.deadT<=0){a=g42PetMake();G42G.ref=a;G42G.deadT=0}return}G42G.ref=a;
  if(a.hp<=0){G42G.deadT=20;return}
  // 늘 곁에: 너무 멀면 곁으로, 싸울 적이 없으면 따라오기를 돕는다
  const d=dist(a,P);if(d>520||DG&&d>420){const q=DG&&typeof dgLand==='function'?dgLand(P.x,P.y,P.x+rnd(-40,40),P.y+rnd(20,50)):{x:P.x+rnd(-40,40),y:P.y+rnd(20,50)};a.x=q.x;a.y=q.y}
  const foe=enemies.some(e=>!e.dead&&dist(e,a)<520);if(!foe&&d>110){const k=Math.min(1,(SPEED*1.1*dt)/d);if(typeof moveBody==='function')moveBody(a,(P.x-a.x)*k*.6,(P.y-a.y)*k*.6);a.hp=Math.min(a.max,a.hp+a.max*.02*dt)}
  // 매 · 정령: 날아다닌다(벽 무시하지 않음)
  if(D.heal&&foe){G42G.healT-=dt;if(G42G.healT<=0){G42G.healT=5;const h=Math.round(maxHp()*D.heal);P.hp=Math.min(maxHp(),P.hp+h);ftext(P.x,P.y-10,'+'+h,'#9fe8a0',false,50)}}
  if(D.form==='g42golem'&&D.taunt)for(const e of enemies)if(!e.dead&&dist(e,a)<a.r+e.r+30){e.tauntT=Math.max(e.tauntT||0,.6);e.tauntBy=a}
  // 80레벨 고유 기술
  if(P.lvl>=80&&foe){G42G.skT-=dt;if(G42G.skT<=0){G42G.skT=P.lvl>=90?8:12;g42PetSkill(a,p.k)}}}
function g42PetSkill(a,k){const col='#c8e0a0';
  if(k==='wolf'){let n=0;for(const e of enemies)if(!e.dead&&dist(e,a)<200){hurtE(e,a.dmg*2,a.s);e.tauntT=Math.max(e.tauntT||0,3);e.tauntBy=a;n++}rings.push({x:a.x,y:a.y,r:10,max:200,life:.6,col});if(n)ftext(a.x,a.y-40,'울부짖음!','#ffe0a0',false,60)}
  else if(k==='hawk'){let tg=null,bd=520;for(const e of enemies){if(e.dead)continue;const d=dist(e,a);if(d<bd){bd=d;tg=e}}if(tg){a.x=tg.x+rnd(-10,10);a.y=tg.y+12;a.lunge=.3;hurtE(tg,a.dmg*4,a.s);burst(tg.x,tg.y,'#ffe0a0',18,140,3,14);ftext(tg.x,tg.y-40,'급강하!','#ffe0a0',false,60)}}
  else if(k==='golem'){const s=Math.round(maxHp()*.12);P.shield=(P.shield||0)+s;rings.push({x:P.x,y:P.y,r:8,max:80,life:.6,col:'#c8b890'});ftext(P.x,P.y-50,`돌가죽 +${s}`,'#d8c8a0',false,60)}
  else if(k==='spirit'){const h=Math.round(maxHp()*.15);P.hp=Math.min(maxHp(),P.hp+h);rings.push({x:P.x,y:P.y,r:8,max:90,life:.6,col:'#9fe8a0'});ftext(P.x,P.y-50,`치유의 빛 +${h}`,'#9fe8a0',false,60)}}
{const _u=update;update=function(dt){_u(dt);try{g42PetTick(dt);g42MtTick(dt)}catch(e){if(window.__QA)throw e}}}
// 길들이기: 70~100레벨 지역(지옥 지역 포함)의 몬스터
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&!GHOST&&e&&g42PetOn()&&!DG&&G42_GREG[REG.id]){const p=g42Pet();if(p.tr<G42_PETN){p.tr++;if(p.tr===G42_PETN)msg('짐승들이 당신을 알아봅니다. 성장(G) → 동료에서 동료 짐승을 고르세요','#c8e0a0')}}}catch(err){if(window.__QA)throw err}return r}}
V20A.g42petk=k=>{const p=g42Pet();if(!G42_PET[k]||p.tr<G42_PETN||!g42PetOn())return;if(p.k&&!g42InTown()){msg('동료를 바꾸는 것은 마을이나 쉼터 안에서만 됩니다','#a39d8f');return}p.k=k;G42G.deadT=0;const a=g42PetLive();if(a)a.gone=true;msg(`${G42_PET[k].n}이(가) 동료가 되었습니다`,'#c8e0a0');save()};
V20A.g42petoff=()=>{const p=g42Pet();p.k='';const a=g42PetLive();if(a)a.gone=true;msg('동료를 쉬게 했습니다','#a39d8f');save()};
// 그리기
const G42_HAWKH=18,G42_HORSEH=88;
function g42PackDraw(id,x,y,dx,dy,moving,t,H,flip){const PK=flPack('m-'+id);if(!PK){flNeed('m-'+id);return false}const M=PK.meta.mon[id];if(!M)return false;
  const sx=dx-dy,sy=(dx+dy)/2,th=Math.atan2(sy,sx),di=(((Math.round((th-Math.PI)/(Math.PI/4)))%8)+8)%8;
  const A=moving&&M.run?M.run:M.stance,n=A.n,fi=moving?Math.floor(t/(A.dur||.5)*n)%n:(()=>{const p=Math.floor(t/((A.dur||1.2)/n)),q=p%(n*2-2||1);return q<n?q:n*2-2-q})();
  const key=A.f[Math.min(fi,n-1)][di],r=PK.meta.r[key];if(!r)return false;const f0=PK.meta.r[M.stance.f[0][6]],k=H/(f0?f0[5]:r[5]);flDraw(ctx,PK,key,x,y,k);return true}
const G42PD=new Map();
{const _da=drawAlly;drawAlly=function(a){if(!a.g42pet)return _da(a);const s=a._s;if(!s||!onScreen(s,90))return;
  const st=G42PD.get(a)||{x:a.x,y:a.y,dx:0,dy:1};const mx=a.x-st.x,my=a.y-st.y;const mv=Math.hypot(mx,my)>.4;if(mv){st.dx=mx;st.dy=my}st.x=a.x;st.y=a.y;G42PD.set(a,st);
  ctx.save();ctx.globalAlpha=.45;ctx.strokeStyle='#c8e0a0';ctx.lineWidth=1.5;ell2(s.x,s.y,a.r+6,(a.r+6)*.4);ctx.restore();
  const f=a.s.form;let top=44;
  if(f==='wolf'||f==='g42golem'){const k=f==='wolf'?'wolf':'j_golem';if(TYPES[k]){const pe=a.pe||(a.pe={k,freezeT:0,stunT:0,slowT:0,elite:false});Object.assign(pe,{x:a.x,y:a.y,fx:a.fx||1,anim:a.anim,lunge:a.lunge,hurt:a.hurt,sc:(TYPES[k].sc||1)*(k==='j_golem'?.8:.9)});drawMon(ctx,pe,s.x,s.y);top=k==='j_golem'?70:52}}
  else if(f==='g42hawk'){const hy=s.y-46+Math.sin(a.anim*2)*4;Kit.shadow(ctx,s.x,s.y,10,4,.6);if(!g42PackDraw('hawk',s.x,hy,st.dx,st.dy,true,a.anim,G42_HAWKH))j2Bird(a,s,'#a07848');top=78}
  else{const y=s.y-24+Math.sin(a.anim*5)*3;ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(160,240,180,.35)';ctx.beginPath();ctx.arc(s.x,y,12,0,6.283);ctx.fill();ctx.fillStyle='#e8ffe8';ctx.beginPath();ctx.arc(s.x,y,5,0,6.283);ctx.fill();ctx.restore();top=44}
  const w=30,y=s.y-top;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,5);ctx.fillStyle='#9ad06a';ctx.fillRect(s.x-w/2,y,w*clamp(a.hp/a.max,0,1),3)}}
function g42PetHtml(){if(!g42PetOn())return `<p class="muted">${G42_PETLV[0]}레벨부터 동료 짐승을 들일 수 있습니다.</p>`;const p=g42Pet();
  let h=`<div class="v20box"><h3>동료 짐승 ${p.k?`<b style="color:#c8e0a0">${G42_PET[p.k].n}</b>`:''}</h3>`;
  if(p.tr<G42_PETN)h+=`<p class="muted" style="margin:4px 0">70~100레벨 지역(지옥 지역도)에서 몬스터를 잡으면 짐승들이 당신을 알아봅니다.</p><div class="v20bar"><i style="width:${p.tr/G42_PETN*100}%"></i></div><div class="muted" style="font-size:11px;text-align:right">${p.tr} / ${G42_PETN}</div>`;
  else h+=`<p class="muted" style="margin:4px 0">늘 곁에서 함께 싸웁니다. 쓰러지면 20초 뒤 다시 옵니다. 바꾸기는 마을 · 쉼터 안에서.</p>${p.k?v20Btn('g42petoff',1,'쉬게 하기',{cls:'ghost'}):''}`;
  h+=`<p class="muted" style="font-size:12px;margin:4px 0">70레벨 단련 (힘 · 몸 +30%) ${P.lvl>=70?'✔':''} · 80레벨 고유 기술 ${P.lvl>=80?'✔':''} · 90레벨 깊은 유대 (+30% · 기술 더 자주) ${P.lvl>=90?'✔':''}</p></div>`;
  for(const k in G42_PET){const D=G42_PET[k];h+=`<div class="v20row"><div><b>${D.n}</b> <span class="muted" style="font-size:12px">${D.d} · 80레벨 「${D.sk.n}」 ${D.sk.d}</span></div><div class="btns">${p.k===k?'<button type="button" disabled>함께하는 중</button>':v20Btn('g42petk',k,'고르기',{dis:p.tr<G42_PETN})}</div></div>`}
  return h}
G42.tabs.push({k:'pet',n:'동료',html:g42PetHtml,dot:()=>{const p=P&&P.g42&&P.g42.pet;return !!(g42PetOn()&&p&&(p.tr|0)>=G42_PETN&&!p.k)}});

/* ===== 10 탈것 ===== */
const G42_MT={buy:{gold:30000,herb:10},up:{gold:100000,ore:20,lv:80},spd:[0,.35,.5]};
function g42Mt(){const g=g42S();if(!v20Obj(g.mt))g.mt={};const m=g.mt;m.own=m.own?1:0;m.lv=Math.min(2,Math.max(m.own,m.lv|0));m.on=m.on&&m.own?1:0;return m}
const g42MtOk=()=>P&&!DG&&!IN&&!P.dead&&!GHOST;
function g42MtSet(on,why){const m=g42Mt();if(!m.own)return;const was=!!m.on;on=!!on&&g42MtOk();if(was===on)return;m.on=on?1:0;G42G.mtT=on?.6:0;
  if(on){rings.push({x:P.x,y:P.y,r:6,max:70,life:.5,col:'#d8b890'});msg('말에 올랐습니다 (H로 내리기)','#d8b890')}else if(why)msg(`말에서 내렸습니다 (${why})`,'#a39d8f');v20Send('g42mt',{on:m.on});g42MtBtn()}
V20A.g42mtbuy=()=>{const m=g42Mt(),M=g42Mat();if(m.own||P.lvl<60||P.gold<G42_MT.buy.gold||M.herb<G42_MT.buy.herb||!g42InTown())return;P.gold-=G42_MT.buy.gold;M.herb-=G42_MT.buy.herb;m.own=1;m.lv=1;msg('말을 얻었습니다! H(또는 「말」 단추)로 타고 내립니다','#d8b890');g42MtBtn();save()};
V20A.g42mtup=()=>{const m=g42Mt(),M=g42Mat();if(!m.own||m.lv>=2||P.lvl<G42_MT.up.lv||P.gold<G42_MT.up.gold||M.ore<G42_MT.up.ore||!g42InTown())return;P.gold-=G42_MT.up.gold;M.ore-=G42_MT.up.ore;m.lv=2;msg('준마 훈련을 마쳤습니다: 이동 +50%','#d8b890');save()};
V20A.g42mton=()=>{const m=g42Mt();g42MtSet(!m.on)};
function g42MtTick(dt){if(!P)return;const m=g42Mt();if(!m.on)return;if(!g42MtOk()){g42MtSet(false,DG?'던전 안':'');return}if(G42G.mtT>0)G42G.mtT-=dt}
// 빠르기: 이번 걸음에 움직인 만큼 더 간다(순간이동 · 밀림은 빼고)
{const _u=update;update=function(dt){const m=P&&P.g42&&P.g42.mt,on=!!(m&&m.on&&!DG&&!IN),x0=P&&P.x,y0=P&&P.y;_u(dt);if(!on||!P||!P.moving||P.dead||G42G.mtT>0)return;
  const dx=P.x-x0,dy=P.y-y0,d=Math.hypot(dx,dy);if(d<.01||d>SPEED*1.2*dt)return;const k=G42_MT.spd[Math.min(2,m.lv|0)]||0;moveBody(P,dx*k,dy*k);P.x=clamp(P.x,20,WORLD-20);P.y=clamp(P.y,20,WORLD-20)}}
// 마법을 쓰거나 맞으면 내린다
{const _tc=tryCast;tryCast=function(){const m=P&&P.g42&&P.g42.mt;if(m&&m.on)g42MtSet(false,'마법');return _tc.apply(this,arguments)}}
{const _hp=hitPlayer;hitPlayer=function(d){const m=P&&P.g42&&P.g42.mt,h0=P&&P.hp;const r=_hp.apply(this,arguments);try{if(m&&m.on&&P.hp<h0)g42MtSet(false,'맞음')}catch(e){if(window.__QA)throw e}return r}}
// 그리기: 말을 먼저 그리고 사람은 조금 위에
const G42MD={st:{dx:0,dy:1,x:0,y:0}};
function g42Horse(o,s,st){const mv=Math.hypot(o.x-st.x,o.y-st.y)>.4;if(mv){st.dx=o.x-st.x;st.dy=o.y-st.y}st.x=o.x;st.y=o.y;st.t=(st.t||0)+(mv?1/30:1/60);
  Kit.shadow(ctx,s.x,s.y+2,30,10,.5);return g42PackDraw('horse',s.x,s.y+6,st.dx,st.dy,mv,st.t,G42_HORSEH)}
{const _dh=drawHero;drawHero=function(){const m=P&&P.g42&&P.g42.mt;if(!m||!m.on||!P._s)return _dh.apply(this,arguments);const s=P._s,sy=s.y;const ok=g42Horse(P,s,G42MD.st);if(ok)s.y=sy-24*PK;try{return _dh.apply(this,arguments)}finally{s.y=sy}}}
V20NET.g42mt=(m,r)=>{if(r)r.g42mt=m.on?1:0};
{const _dr=drawRemote;drawRemote=function(o){if(!o||!o.g42mt||!o._s||DG)return _dr.apply(this,arguments);const s=o._s,sy=s.y,st=o._g42mt||(o._g42mt={dx:0,dy:1,x:o.x,y:o.y});const ok=g42Horse(o,s,st);if(ok)s.y=sy-24*PK;try{return _dr.apply(this,arguments)}finally{s.y=sy}}}
// 단추 · 단축키
function g42MtBtn(){const tools=document.querySelector('#hud .tools');if(!tools)return;let b=$('#g42Mt');const m=P&&g42Mt();if(!m||!m.own){if(b)b.remove();return}
  if(!b){b=document.createElement('button');b.className='stonebox';b.id='g42Mt';b.type='button';b.addEventListener('click',()=>{V20A.g42mton()});const g=$('#g42Btn');if(g&&g.nextSibling)tools.insertBefore(b,g.nextSibling);else tools.appendChild(b)}
  const t=m.on?'말 내리기 (H)':'말 (H)';if(b.textContent!==t)b.textContent=t}
V20.slowTick.push(()=>{try{g42MtBtn()}catch(_){}});
addEventListener('keydown',e=>{if(e.code!=='KeyH'||e.ctrlKey||e.altKey||e.metaKey||e.repeat)return;const t=e.target;if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;if(!P||!g42Mt().own)return;V20A.g42mton()});
{const _ld=load;load=function(){const ok=_ld.apply(this,arguments);try{if(ok&&P){const m=g42Mt();m.on=0;G42G.deadT=0}}catch(e){if(window.__QA)throw e}return ok}}
function g42MtHtml(){const m=g42Mt(),M=g42Mat(),tw=g42InTown();
  if(!m.own)return `<div class="v20box"><h3>말</h3><p class="muted" style="margin:4px 0">60레벨부터. 마을 · 쉼터에서 금화 ${G42_MT.buy.gold.toLocaleString()}와 말 먹이로 약초 ${G42_MT.buy.herb}개(채집)를 내면 말을 얻습니다. 타면 이동 +35%. 마법을 쓰거나 맞으면 내립니다. 던전 안에서는 못 탑니다.</p>${v20Btn('g42mtbuy',1,'말 얻기',{dis:P.lvl<60||P.gold<G42_MT.buy.gold||M.herb<G42_MT.buy.herb||!tw})}${tw?'':'<p class="muted">마을 · 쉼터 안에서</p>'}</div>`;
  return `<div class="v20box"><h3>말 <span class="muted">· 이동 +${Math.round(G42_MT.spd[m.lv]*100)}%</span></h3><p class="muted" style="margin:4px 0">H 또는 「말」 단추로 타고 내립니다. 마법을 쓰거나 맞으면 내립니다.</p>${v20Btn('g42mton',1,m.on?'내리기':'타기',{dis:!g42MtOk()})}</div>
    <div class="v20box"><h3>준마 훈련 <span class="muted">· ${G42_MT.up.lv}레벨 · 이동 +50%</span></h3>${m.lv>=2?'<p>마쳤습니다.</p>':v20Btn('g42mtup',1,`훈련 · 금화 ${G42_MT.up.gold.toLocaleString()} · 광석 ${G42_MT.up.ore}`,{dis:P.lvl<G42_MT.up.lv||P.gold<G42_MT.up.gold||M.ore<G42_MT.up.ore||!tw})}</div>`}
G42.tabs.push({k:'mt',n:'말',html:g42MtHtml,dot:()=>false});
G42.ach.push({id:'pet1',n:'첫 동료',d:'동료 짐승 들이기',need:1,cur:()=>P.g42&&P.g42.pet&&P.g42.pet.k?1:0,grp:'성장',pts:10},{id:'mt1',n:'바람을 가르는 자',d:'말 얻기',need:1,cur:()=>P.g42&&P.g42.mt&&P.g42.mt.own?1:0,grp:'성장',pts:10});
Object.assign(window.__g42,{G42G,G42_PET,G42_MT,g42Pet,g42PetLive,g42PetMake,g42PetSkill,g42Mt,g42MtSet});
// 그림 출처: 말 · 매 (0 A.D.)
V20.slowTick.push(()=>{const p=document.querySelector('#auCredits .flcr');if(p&&!p.dataset.g42){p.dataset.g42=1;p.textContent+=' · 말 · 매 그림: 0 A.D. (Wildfire Games) 모델 · 동작 · 무늬를 그림으로 옮김 (CC-BY-SA 3.0)'}});
