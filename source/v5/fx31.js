/* ---------- v31: 스킬 이펙트 그림 (다 그려진 띠만, 마법사 53장부터) ----------
   그림: game.html 옆 img/fx-<직업>-<원소>.js (원소마다 한 묶음, 칸 128 1배, 투명한 가장자리를 잘라 한 장에 모음). 각 파일이 FX_PACK(이름, 정보, 그림)을 부른다.
   · 시작 화면에서는 아무것도 받지 않는다. 게임 중 단축칸에 올린(배운) 스킬의 묶음만, 한가할 때(requestIdleCallback) 하나씩 받는다.
     동료가 쓴 스킬의 묶음이 없으면 그때 줄을 세운다. 묶음이 없거나 못 받으면 v30 그림 그대로.
   · 메모리: PC 32MB · 휴대폰 16MB 상한. 3분 동안 안 쓴 묶음은 내려놓는다(단축칸 스킬 묶음은 남김). 상한을 넘으면 오래 안 쓴 것부터.
   · 새 그림은 같은 역할의 예전 층을 대신한다(덧칠하지 않음): 투사체 몸통·맞힘 빛, 고리, 번개 줄기, 광선, 치유 빛기둥, 보호막 거품. 예전 입자는 절반만 남긴다.
     범위를 알려 주는 선(장판·낙하 테두리)과 상태 표시(발밑 고리)는 그대로 둔다.
   · 프레임은 시간으로 고른다(매 프레임 무작위 아님). 흐림·그림자·필터 없음. 한 번에 drawImage 하나, FXL 예산(lod·spend)을 따른다.
   · 판정·피해·저장은 건드리지 않는다. 「화면」 설정에서 「예전 그림」이면 받지 않는다. */
const FX31={P:{},want:{},busy:0,busyT:0,q:[],inst:[],nd:0,t:0,C:128,
  cap:(matchMedia('(pointer:coarse)').matches?16:32)*1048576,idle:180,
  // 띠 번호 · 원소 · 모양 · 스킬 (띠 2번이 있는 모양: bolt=맞힘 · chain=맞힘 · beam=광선 끝 · rain=땅에 맞음)
  T:[['001','fire','bolt','spark firebolt fireburst flamelance firebird pyroblast'],['002','arcane','bolt','stop arcanemissiles spaceprison prismbolt collapse quadorb pactcommand'],
    ['003','wind','cone','gust'],['004','fire','cone','ember flamelash dragonbreath'],['005','ice','bolt','splash frostdiver frostarrow frozenorb'],['006','ice','nova','drawwater frozenground absolutezero'],
    ['007','earth','shield','stoneset'],['008','earth','bolt','crackstone stonethrow obsidian'],['009','light','bolt','light lancelight'],['010','storm','chain','static chainlightning frostchain'],
    ['011','fire','orbit','dancingflames'],['012','fire','nova','flameshaping'],['013','ice','orbit','watershaping'],['014','earth','nova','earthshaping quake raisemountain'],['015','arcane','nova','hold timestop'],
    ['016','wind','bolt','windblade vacuumblade'],['017','arcane','blink','blink swapplace'],['018','fire','beam','steamjet'],['019','ice','cone','waterwhip turncurrent glacier'],['020','wind','shield','airwall'],
    ['021','wind','field','dustdevil whirlwind'],['022','fire','field','firewall firestorm magmafield forbidblaze'],['023','earth','beam','fissure magmariver'],['024','arcane','shield','shieldcircle elembarrier'],
    ['025','fire','armor','flamemantle'],['026','ice','shield','iceshield'],['027','storm','cone','shockinggrasp'],['028','wind','blink','windleap'],['029','earth','field','quicksand earthquake'],
    ['030','storm','beam','lightning rendingsky'],['031','earth','rain','stonerain'],['032','life','heal','arcaneheal'],['033','ice','field','whirlpool blizzard'],['034','storm','rain','hail lordvermilion'],
    ['035','ice','beam','callwave'],['036','ice','armor','frostarmor'],['037','storm','nova','eyeofstorm'],['038','arcane','strike','spacetwist testament'],['039','light','rain','lightrain starlight'],
    ['040','fire','summon','hydra fireelem phoenix'],
    // v33: 마법사 나머지 29가지(041~069) + 궁수 5가지(095~099). [번호, 원소, 그림 모양, 스킬, (그리는 방식 · 없으면 그림 모양과 같음), (직업 · 없으면 마법사)]
    ['041','light','beam','sunflame'],['042','earth','strike','jaws forbidupheave'],['043','light','cone','dawnblade'],['044','fire','strike','meteor'],
    ['045','storm','storm','callstorm','rain'],['046','earth','invuln','stonebody','aura'],['047','ice','invuln','bodyofwater','aura'],['048','arcane','heal','rewind'],
    ['049','storm','strike','heavenbolt'],['050','light','strike','sunfall'],['051','ice','strike','steamburst'],['052','ice','summon','frostgolem'],['053','storm','summon','stormhawk'],
    ['054','earth','summon','stonetitan'],['055','arcane','buff','communion overload manaflux spiritadvent','aura'],['056','fire','detonate','spiritburst','burst'],
    ['057','fire','rain','meteorswarm'],['058','arcane','field','summoncircle elemrelease timerift spiritthrone'],['059','arcane','summon','spiritlegion spiritsovereign'],
    ['060','arcane','fuse','spiritfusion','burst'],['061','life','buff','wardspirit','aura'],['062','ice','wave','forbidtide'],['063','storm','spchain','spiritchain'],
    ['064','fire','buff','spiritfrenzy','aura'],['065','storm','gale','forbidgale'],['066','arcane','ward','pactprice','aura'],['067','arcane','recall','spiritreturn','summon'],
    ['068','arcane','clone','manaclone','summon'],['069','arcane','rain','finalcircle'],
    ['095','phys','bolt','quickshot trackmark fanshot piercearrow fulldraw streamshot weakspot tripleshot snipe splitarrow netshot deathmark windpierce shadowarrow exposeweak oneshot',0,'archer'],
    ['096','phys','buff','hawkeye camouflage huntinghorn deadeye survivor predatoreye imbue traptoss focus beastawaken shadowhide piercinggaze poisonshade','aura','archer'],
    ['097','phys','trap','snaretrap shrapneltrap trapfield beastcage blasttrap thorntrap dominion shadowtrap abysstrap',0,'archer'],
    ['098','fire','bolt','flamearrow burstarrow trinityarrow',0,'archer'],['099','phys','blink','evaderoll backshot shadowstep',0,'archer'],
    // v36: 궁수 22장(100~113). 윈드 애로우(shockarrow)는 바람 화살이 되어 번개 그림(103)을 쓰지 않음 · 애로우 펜스(elemrain) · 보우 오브 헤븐(heavenbow)은 모양이 바뀌어 새로 그리는 중
    ['100','phys','summon','falcon wolfcall',0,'archer'],['101','ice','bolt','icearrow glacialarrow',0,'archer'],['102','fire','trap','firetrap',0,'archer'],
    ['104','phys','field','caltrops smoke lure arrowvortex huntground nighthunt',0,'archer'],['105','ice','trap','frosttrap',0,'archer'],
    ['106','phys','strike','falcondive apexhunt drivehunt',0,'archer'],['107','phys','chain','ricochet',0,'archer'],['108','phys','rain','arrowrain skyvolley',0,'archer'],
    ['109','storm','strike','thunderarrow','zap','archer'],['110','phys','beam','siegeshot wildrun',0,'archer'],['111','phys','detonate','detonate','burst','archer'],
    ['112','phys','nova','earthbind',0,'archer'],['113','phys','homing','curvingshot','bolt','archer'],
    // v39(사용자 요청: 사제 모든 기술에 그림): 사제 30장(070~094) · 92가지. 치유·되살리기·정화는 받는 사람 자리, 강화·수호·무적은 몸 둘레, 잇기(링크·희생·교환)는 두 사람 사이
    ['070','holy','heal','minorheal closewounds prayerheal greaterheal salvation regeneration chainheal sainttouch',0,'priest'],
    ['071','holy','shield','lightward kyrie divineshield aegis inqarmor sanctum',0,'priest'],
    ['072','holy','buff','blessing agiup wisdom impositio kings gloria painsup benediction apotheosis grandblessing lightwings crownofblessing graceaccel atonelight','aura','priest'],
    ['073','holy','bolt','smite holyfire javelin holychains hammerofwrath lightvolley heresybrand purgefire execlance heavenprison',0,'priest'],
    ['074','holy','cone','holycross symbolflash waveoflight sunsword',0,'priest'],['075','holy','nova','turnundead greatjudgment grandcross confessbell grandverdict',0,'priest'],
    ['076','holy','hot','renew','heal','priest'],['077','holy','strike','hammerofjustice pillaroflight judgment godspear finalverdict execution',0,'priest'],
    ['078','holy','field','barrier consecration exorcircle healcircle holysun magnus lifespring archhymn condemnfield saintmarch sanctumfield',0,'priest'],
    ['079','holy','orbit','blessedhammer',0,'priest'],['080','holy','chain','chainoflight judgechain',0,'priest'],['081','holy','beam','radiance sacredsword holyflame judgespear',0,'priest'],
    ['082','holy','rain','rainoflight heavenblades heavenwrath heavengate',0,'priest'],['083','holy','ward','guardianspirit returnmiracle','aura','priest'],
    ['084','holy','storm','thunderprayer','rain','priest'],['085','holy','invuln','inviolable','aura','priest'],['086','holy','rez','resurrection battlerez grandrez','heal','priest'],
    ['087','holy','link','gracelink','link','priest'],['088','holy','cleanse','purifyhand','heal','priest'],['089','holy','martyr','martyrprayer','link','priest'],
    ['090','holy','brandburst','brandspread','burst','priest'],['091','holy','blink','lightpath lightchaser',0,'priest'],['092','holy','consec','consecrate','nova','priest'],
    ['093','holy','lswap','lifeswap','link','priest'],['094','holy','miracle','saintmiracle','burst','priest']],
  TWO:new Set(['bolt','chain','beam','rain']),M:{},n:{draw:0,fall:0,evict:0,load:0},
  init(){for(const [no,el,f,ids,k0,c0] of this.T){const c=c0||'mage',k=k0||f,b=`fx_${no}_1_${c}_${el}_${f}`,i=no>'040'||this.TWO.has(k)?`fx_${no}_2_${c}_${el}_${f}`:null;// 띠 2번이 없으면 그 칸만 그리지 않는다
    for(const id of ids.split(' '))this.M[id]={k,f,c,b,i,pk:c+'-'+el}}
    for(const id of this.OLD)delete this.M[id]},
  // v37(사용자 요청): 마법사 번개 계열 14가지 · 엘리멘탈 쿼텟은 새 그림보다 예전 이펙트가 낫다 → 짝을 빼서 예전 그대로 그림
  OLD:'static chainlightning frostchain lightning rendingsky shockinggrasp hail lordvermilion eyeofstorm callstorm heavenbolt stormhawk spiritchain forbidgale quadorb'.split(' '),
  on(){return typeof GFX==='undefined'||GFX.art!=='old'},
  now(){return performance.now()/1000},
  noLoad(){return location.hash==='#qa'&&!this.qaQ},// #qa에서는 파일을 받지 않는다 (줄 세우기 시험만 qaQ로 켬, 실제 받기는 load가 다시 막음)
  // 쓸 수 있는 그림: 묶음이 들어와 있으면 {m,PK}. 없으면 null (그리고 받을 줄에 세움)
  get(id,ask){const m=id&&this.M[id];if(!m||!this.on())return null;const PK=this.P[m.pk];if(PK){PK.used=this.now();return{m,PK}}if(ask!==false)this.need(m.pk);return null},
  need(pk){if(!this.want[pk]&&!this.q.includes(pk))this.q.push(pk)},
  /* ----- 받기 ----- */
  load(pk){if(location.hash==='#qa'||this.busy!==pk||this.want[pk])return;this.want[pk]=1;this.n.load++;const s=document.createElement('script');s.src='img/fx-'+pk+'.js';
    s.onerror=()=>{this.want[pk]='fail';this.busy=0};s.onload=()=>{s.remove()};document.head.appendChild(s)},
  got(name,meta,url){const im=new Image(),ok=()=>{if(!this.P[name])this.P[name]={img:im,meta,mem:meta.size[0]*meta.size[1]*4,used:this.now()};this.want[name]=2;if(this.busy===name)this.busy=0};
    im.onload=()=>{im.decode?im.decode().then(ok,ok):ok()};im.onerror=()=>{this.want[name]='fail';if(this.busy===name)this.busy=0};im.src=url},
  barPacks(){const s=new Set();if(P&&P.bar)for(const id of P.bar){const m=id&&this.M[id];if(m&&skLv(id)>0)s.add(m.pk)}return s},
  // 게임 중 1.5초마다: 단축칸 스킬 묶음을 줄 세우고 하나씩 받고, 오래 안 쓴 묶음을 내려놓는다
  tick(dt){this.t-=dt;if(this.t>0)return;this.t=1.5;if(!this.on()||!P)return;
    if(this.busy&&this.now()-this.busyT>20){this.want[this.busy]='fail';this.busy=0}
    const bar=this.barPacks();for(const pk of bar)this.need(pk);this.evict(bar);
    this.q=this.q.filter(pk=>!this.want[pk]);if(this.busy||!this.q.length||this.noLoad())return;
    const pk=this.q.shift(),go=()=>this.load(pk);this.busy=pk;this.busyT=this.now();typeof requestIdleCallback==='function'?requestIdleCallback(go,{timeout:1000}):setTimeout(go,200)},
  mem(){let m=0;for(const k in this.P)m+=this.P[k].mem;return m},
  evict(keep){const t=this.now(),drop=k=>{delete this.P[k];this.want[k]=0;this.n.evict++};
    for(const k in this.P)if(!keep.has(k)&&t-this.P[k].used>this.idle)drop(k);
    while(this.mem()>this.cap){let o=null;for(const k in this.P)if(!keep.has(k)&&(!o||this.P[k].used<this.P[o].used))o=k;if(!o)break;drop(o)}},
  /* ----- 그리기 도우미 (화면 좌표, 변환 S()) ----- */
  fr(PK,stem){return PK.meta.r[stem]||null},
  // 칸 k를 (x,y)에 그린다. ax,ay: 칸 안의 기준점(칸 화소). sx,sy: 배율. rot: 화면 각도
  img(c,PK,f,x,y,ax,ay,sx,sy,rot,a){if(!f||a<=0)return;c.globalAlpha=Math.min(1,a);const k=DPR,ox=DPR*shx,oy=DPR*shy;
    if(rot){const co=Math.cos(rot),si=Math.sin(rot);c.setTransform(k*co,k*si,-k*si,k*co,k*x+ox,k*y+oy);c.drawImage(PK.img,f[0],f[1],f[2],f[3],(f[4]-ax)*sx,(f[5]-ay)*sy,f[2]*sx,f[3]*sy);c.setTransform(k,0,0,k,ox,oy)}
    else c.drawImage(PK.img,f[0],f[1],f[2],f[3],x+(f[4]-ax)*sx,y+(f[5]-ay)*sy,f[2]*sx,f[3]*sy);FXL.spend(1);this.n.draw++},
  // 한 번 재생: 나이 a(0..1) → 칸 번호
  kOf(F,a){return Math.max(0,Math.min(F.length-1,(a*F.length)|0))},
  loopK(F,fps,ph){return((time*fps+(ph||0))|0)%F.length},
  // 땅 위 둥근 범위(세계 반지름 r)를 덮는 배율: 고리 그림이 칸 너비의 cov만큼 찬다
  isoK(r,cov){return 2*r*KI*1.4142/(this.C*(cov||.86))},
  // v37: 범위 맞춤 — 땅의 둥근 범위(세계 반지름 r, 화면에선 가로 2·r·KI·√2인 타원)와 그림의 실제 가로 폭(띠에서 가장 넓은 칸)이 같아지는 배율
  // v39: 칸 안에서 그림의 발(가장 아래 칸의 바닥) — 서 있는 빛기둥을 받는 사람 발밑에 맞춤
  foot(PK,stem){const c=PK.ft||(PK.ft={});if(c[stem]==null){const F=this.fr(PK,stem);c[stem]=F?Math.max(64,Math.min(124,Math.max(...F.map(f=>f[5]+f[3]))-4)):108}return c[stem]},
  visW(PK,stem){const c=PK.vw||(PK.vw={});if(c[stem]==null){const F=this.fr(PK,stem);c[stem]=F?Math.max(8,...F.map(f=>f[2])):this.C*.86}return c[stem]},
  fit(PK,stem,r){return Math.max(.2,Math.min(10,2*(r||60)*KI*1.4142/this.visW(PK,stem)))},
  scrAng(a){return Math.atan2((Math.cos(a)+Math.sin(a))*KI/2,(Math.cos(a)-Math.sin(a))*KI)},
  scrLen(a,L){return L*Math.hypot((Math.cos(a)-Math.sin(a))*KI,(Math.cos(a)+Math.sin(a))*KI/2)},
  add(o){o.t0=o.t0!=null?o.t0:time;this.inst.push(o);if(this.inst.length>60)this.inst.shift();return o},
  halve(n0){if(parts.length>n0){const keep=parts.slice(n0).filter((_,i)=>i%2===0);parts.length=n0;for(const p of keep)parts.push(p)}}};
FX31.init();
window.FX_PACK=function(name,meta,url){FX31.got(name,meta,url)};

/* ----- 시전 앞뒤: clsAim(모든 시전이 지나는 곳, 겨눔 직전)에서 개수를 적어 두고, FXP.cast(시전 끝)에서 새로 생긴 예전 층을 바꾼다 ----- */
{const _ca=clsAim;clsAim=function(s,t){if(s&&FX31.M[s.id])FX31.snap={id:s.id,x:P.x,y:P.y,r:rings.length,p:parts.length,b:bolts.length,bm:beams.length,f:fields.length,pd:pend.length,fx:FXB.fx.length,al:allies.length,pl:pillars.length};return _ca.apply(this,arguments)}}
{const _fc=FXP.cast;FXP.cast=function(s,t,actor){const r=_fc.apply(this,arguments);const sn=FX31.snap;FX31.snap=null;
  try{if(s&&sn&&sn.id===s.id)FX31.cast(s,t,actor||P,sn)}catch(err){if(window.__QA)throw err}return r}}
// 같이 하기 유령 시전에서도 이때의 P가 시전한 사람 자리 (net.js가 P를 잠깐 바꿔 둔다)
FX31.cast=function(s,t,_o,sn){const o=P;const g=this.get(s.id);if(!g)return;/* v39: 이번 시전으로 치유·강화를 받은 사람들(예전 시전 빛이 붙은 자리) */const tg=[...new Set(FXB.fx.slice(sn.fx).map(f=>f.o&&f.o.x!=null?f.o:{x:f.x,y:f.y}))];if(FXB.fx.length>sn.fx)FXB.fx.splice(sn.fx);/* v37: 예전 시전 빛(고리·화살표·기둥)은 새 그림이 대신 */const {m,PK}=g,k=m.k,rank=Math.max(1,Math.min(9,s.rank||1));
  const newRings=()=>{if(rings.length>sn.r)rings.splice(sn.r,rings.length-sn.r).filter(r=>r.faint).forEach(r=>rings.push(r))};
  if(k==='cone'){const a=P.face,L=this.scrLen(a,s.range||160);this.add({st:m.b,pk:m.pk,x:o.x,y:o.y,z:16,d:.42,rot:this.scrAng(a),sc:L/(this.C*.82),ax:18,ay:64});this.halve(sn.p)}
  else if(k==='nova'){this.add({st:m.b,pk:m.pk,x:o.x,y:o.y,z:0,d:.55,sc:this.fit(PK,m.b,s.rad||100),ax:64,ay:64});newRings();this.halve(sn.p)}
  else if(k==='blink'){const sc=.62+rank*.03;this.add({st:m.b,pk:m.pk,x:sn.x,y:sn.y,z:0,d:.45,sc,ax:64,ay:104});this.add({st:m.b,pk:m.pk,x:o.x,y:o.y,z:0,d:.45,sc,ax:64,ay:104,t0:time+.06});newRings();this.halve(sn.p)}
  else if(k==='heal'&&m.c==='priest'){const sc=.62+rank*.03,ay=this.foot(PK,m.b),hot=m.f==='hot',to=tg.length?tg.slice(0,6):[o];
    for(const q of to)this.add(hot?{st:m.b,pk:m.pk,who:q,fol:1,loop:1,x:q.x,y:q.y,z:0,d:1.6,sc,ax:64,ay}:{st:m.b,pk:m.pk,who:q,fol:1,x:q.x,y:q.y,z:0,d:m.f==='rez'?1.1:.8,sc:m.f==='rez'?sc*1.15:sc,ax:64,ay});newRings();this.halve(sn.p)}
  else if(k==='heal'){const sc=.7+rank*.03;this.add({st:m.b,pk:m.pk,x:o.x,y:o.y,z:0,d:.8,sc,ax:64,ay:108});if(FXB.fx.length>sn.fx)FXB.fx.splice(sn.fx);newRings();this.halve(sn.p)}
  else if(k==='chain'){for(let i=sn.b;i<bolts.length;i++){const b=bolts[i];b.a31=m;if(m.i)this.add({st:m.i,pk:m.pk,x:b.b.x,y:b.b.y,z:b.b.z||16,d:.3,sc:.42+rank*.03,ax:64,ay:64,t0:time+(b.delay||0)})}newRings();this.halve(sn.p)}
  else if(k==='beam'){for(let i=sn.bm;i<beams.length;i++){const b=beams[i];b.a31=m;if(m.i)this.add({st:m.i,pk:m.pk,x:b.x2,y:b.y2,z:b.z||14,d:.4,sc:.5+rank*.04,ax:64,ay:64})}
    for(let i=sn.b;i<bolts.length;i++)bolts[i].hid31=1;newRings();this.halve(sn.p)}
  else if(k==='field'){for(let i=sn.f;i<fields.length;i++)fields[i].a31=m}
  // v32: 불러낼 때 빛 — 새로 나온 동료(소환수) 발밑에서 한 번 (없으면 시전한 사람 앞)
  else if(k==='summon'){const sc=.85+rank*.03,nw=allies.slice(sn.al||0);let at=nw.filter(a=>a.s&&a.s.id===s.id);if(!at.length&&m.f==='recall')at=nw.filter(a=>a.s);if(!at.length)at.push({x:o.x+Math.cos(P.face)*50,y:o.y+Math.sin(P.face)*50});
    for(const a of at)this.add({st:m.b,pk:m.pk,x:a.x,y:a.y,z:0,d:.75,sc,ax:64,ay:100});newRings();this.halve(sn.p)}
  // v33: 몸 둘레 빛(반복) — 무적(돌의 몸 · 물의 몸)은 무적 동안, 나머지는 시전 뒤 잠깐
  else if(k==='aura'){const inv=m.f==='invuln',to=m.c==='priest'&&tg.length?tg.slice(0,6):[o];for(const q of to)this.add({st:m.b,pk:m.pk,who:q,fol:1,loop:1,inv:inv&&q===P,x:q.x,y:q.y,z:26,d:inv&&q===P?Math.max(.5,P.invT||s.dur||3):2.2,sc:.74,ax:64,ay:64})}
  // v39: 사제 보호막 — 나에게 걸린 건 떠 있는 동안 drawAir가 그리고, 동료에게 걸린 건 거는 순간 한 번
  else if(k==='shield'){for(const q of tg.slice(0,6))if(q!==P)this.add({st:m.b,pk:m.pk,who:q,fol:1,loop:1,x:q.x,y:q.y,z:26,d:1.4,sc:.74,ax:64,ay:64})}
  // v39: 잇기(그레이스 링크 · 마터스 프레이어 · 라이프 익스체인지) — 나와 받는 동료 사이에 늘여 붙임. 받는 동료가 없으면 바라보는 쪽으로 짧게
  else if(k==='link'){let to=tg.filter(q=>q!==P);if(!to.length&&NET.on){const L=P.j2link,r=m.f==='link'&&L?NET.peers.get(L.id):typeof PTY==='object'?PTY.pick().r:null;
      if(r&&!(m.f!=='lswap'&&r.dead))to=[r];if(m.f==='martyr')to=[...NET.peers.values()].filter(r=>!r.dead&&(typeof netSame!=='function'||netSame(r))&&dist(r,o)<=(s.party||550))}
    if(!to.length&&t&&t.x!=null&&dist(t,o)>20)to=[t];if(!to.length)to=[{x:o.x+Math.cos(P.face)*120,y:o.y+Math.sin(P.face)*120}];
    for(const q of to.slice(0,6))this.add({st:m.b,pk:m.pk,ln:1,who:o,who2:q.x!=null&&q.hp!=null?q:null,x:o.x,y:o.y,x2:q.x,y2:q.y,z:0,d:m.f==='link'?1.2:.8,sc:1,ax:0,ay:0});newRings();this.halve(sn.p)}
  // v33: 크게 터짐 — 이번 시전에서 생긴 가장 큰 고리 자리(없으면 시전한 사람 자리)
  else if(k==='burst'){if(m.c==='priest'&&sn.pl!=null&&pillars.length>sn.pl)pillars.splice(sn.pl);/* v39: 브랜드 버스트 · 미라클의 예전 흰 빛기둥은 그림이 대신 */const R=rings.slice(sn.r).filter(r=>!r.faint&&r.max>=40).sort((a,b)=>b.max-a.max).slice(0,2);if(!R.length)R.push({x:o.x,y:o.y,max:110});
    for(const r of R)this.add({st:m.b,pk:m.pk,x:r.x,y:r.y,z:1,d:.7,sc:this.fit(PK,m.b,r.max),ax:64,ay:64});this.halve(sn.p)}
  // v33: 정령 사슬 — 잇는 순간 나와 소환수 자리에서 한 번 (사슬 줄기는 drawBolt가 그림으로)
  else if(k==='spchain'){const pts=[o].concat(allies.filter(a=>a.j2&&!a.gone&&a.s&&a.s.cls==='mage').slice(0,6));for(const q of pts)this.add({st:m.i,pk:m.pk,x:q.x,y:q.y,z:24,d:.4,sc:.55,ax:64,ay:64})}
  else if(k==='strike'){for(let i=sn.pd;i<pend.length;i++){const q=pend[i];if(q.s&&q.s.mini)continue;const dl=Math.max(0,q.t-.45);q.a31=1;this.add({st:m.b,pk:m.pk,x:q.x,y:q.y,z:0,d:.7,sc:this.fit(PK,m.b,q.s.rad||90),ax:64,ay:108,t0:time+dl})}}};
// 투사체 몸통: 그림이 있으면 예전 몸통·꼬리·고리 대신 그림 (휘는 빛 꼬리는 그림에 들어 있음)
{const _d=FXR.draw;FXR.draw=function(c,p,s,k,ox,oy,map){const m0=p&&p.s&&FX31.M[p.s.id],g=m0&&(m0.c==='archer'||!p.s.phys)&&FX31.get(p.s.id);if(!g||g.m.k!=='bolt')return _d.apply(this,arguments);
  const F=FX31.fr(g.PK,g.m.b);if(!F)return _d.apply(this,arguments);if(!FXL.lod(s.x,s.y,40))return;
  const r=p.r||6,mm=Math.max(.8,Math.min(1.3,Math.sqrt(r/7))),sc=g.m.c==='archer'?.36*(p.s.mult>=4||p.s.pierce?1.25:1):(.42+.07*(((p.s.rank|0)||1)-1))*mm,ang=p._ang!=null?p._ang:Math.atan2((p.vx+p.vy)*KI/2,(p.vx-p.vy)*KI);
  if(p._fxph==null)p._fxph=(FXR.n=(FXR.n+1)%97)*1.7;const age=(p._a31=(p._a31||0)+1),f=F[age<3?1:2];
  const pul=1+.05*Math.sin(time*18+p._fxph);c.globalCompositeOperation='source-over';const th=g.m.c==='archer'?.4:1;/* v37: 화살은 가늘게(두께 40%, 길이 1.1배) */FX31.img(c,g.PK,f,s.x,s.y,f[4]+f[2]*.72,f[5]+f[3]/2,sc*pul*(th<1?1.1:1),sc*pul*th,ang,1);c.globalCompositeOperation='lighter';c.globalAlpha=1}}
// 맞힘: 그림이 있으면 예전 빛 터짐 대신 그림 (땅 자국은 그대로)
{const _h=FXR.hit;FXR.hit=function(p){const g=p&&p.s&&FX31.get(p.s.id,false);if(!g||!g.m.i||!FX31.fr(g.PK,g.m.i))return _h.apply(this,arguments);
  const t=this.tier(p);FX31.add({st:g.m.i,pk:g.m.pk,x:p.x,y:p.y,z:p.z||0,d:[.26,.3,.36,.45,.6][t],sc:p.s.aoe?FX31.fit(g.PK,g.m.i,p.s.aoe):(g.m.c==='archer'?.32:.42)+.06*t,ax:64,ay:64});if(t>=3)decal(p.x,p.y,t>=4?34:22,p.s.el)}}
// 하늘에서 떨어지는 것: 떨어지는 그림이 잠깐 내려오고 땅에 맞는 그림 (예전 번개 줄기·빛기둥·작은 불덩이 대신)
{const _sh=skyHit;skyHit=function(x,y,s,dmg,rad,hitR){const g=s&&FX31.get(s.id);if(!g||(g.m.k!=='rain'&&g.m.k!=='zap'))return _sh.apply(this,arguments);
  const n0={b:bolts.length,pl:pillars.length,pd:pend.length,p:parts.length,r:rings.length},r=_sh.apply(this,arguments);
  // v36: 벼락(zap)은 하늘에서 내려오는 예전 번개 줄기를 남기고, 땅에 맞는 자리에 그림을 더한다
  if(g.m.k!=='zap'){bolts.length>n0.b&&bolts.splice(n0.b);pillars.length>n0.pl&&pillars.splice(n0.pl)}for(let i=pend.length-1;i>=n0.pd;i--)if(pend[i].s&&pend[i].s.mini)pend.splice(i,1);
  for(let i=rings.length-1;i>=n0.r;i--)if(!rings[i].faint)rings.splice(i,1);FX31.halve(n0.p);
  const sc=FX31.fit(g.PK,g.m.i||g.m.b,hitR||rad||40),scF=Math.max(.45,Math.min(1.1,(rad||40)*2.4/FX31.C));// v37: 땅에 맞는 그림은 맞는 범위에 맞춤, 떨어지는 그림은 예전 크기
  // v36: 내리치는 그림 한 장만 있는 것(궁수 썬더스톰 애로우): 떨어지는 칸 없이 그 자리에 벼락 한 번
  if(g.m.k==='zap')FX31.add({st:g.m.b,pk:g.m.pk,x,y,z:0,d:.45,sc:FX31.fit(g.PK,g.m.b,hitR||rad||60),ax:64,ay:108});else FX31.add({st:g.m.b,st2:g.m.i,pk:g.m.pk,x,y,z:0,d:.5,fall:.14,sc,scF,ax:64,ay:64});FX31.n.fall++;return r}}
// 번개 줄기(연쇄): 그림 줄기를 두 점 사이에 늘여 붙인다. 광선과 같이 생긴 예전 번개는 숨긴다
{const _db=drawBolt;drawBolt=function(b){if(b.hid31&&FX31.on())return;const m=b.a31,PK=m&&FX31.P[m.pk];if(!m||!PK||!FX31.on())return _db.apply(this,arguments);if(b.delay>0)return;
  const F=FX31.fr(PK,m.b);if(!F)return _db.apply(this,arguments);const A=P3(b.a),B=P3(b.b),L=Math.hypot(B.x-A.x,B.y-A.y);if(L<2)return;
  if(!FXL.lod((A.x+B.x)/2,(A.y+B.y)/2,L/2+20))return;PK.used=FX31.now();const f=F[1+FX31.loopK([0,0],16,b.gen*7)],a=clamp(b.life/b.max*1.8,0,1),sx=L/(f[2]*.96),sy=Math.max(.45,Math.min(1.3,sx*.6))*(b.w>=3?1.2:1);
  ctx.globalCompositeOperation='source-over';FX31.img(ctx,PK,f,A.x,A.y,f[4],f[5]+f[3]/2,sx,sy,Math.atan2(B.y-A.y,B.x-A.x),a);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1}}
// 광선: 몸통 그림을 이어 붙인다
{const _dm=drawBeam;drawBeam=function(b){const m=b.a31,PK=m&&FX31.P[m.pk];if(!m||!PK||!FX31.on())return _dm.apply(this,arguments);const F=FX31.fr(PK,m.b);if(!F)return _dm.apply(this,arguments);
  const a=clamp(b.life/b.max*2,0,1),A=P3({x:b.x1,y:b.y1,z:b.z}),B=P3({x:b.x2,y:b.y2,z:b.z-4}),L=Math.hypot(B.x-A.x,B.y-A.y);if(L<2)return;
  const lod=FXL.lod((A.x+B.x)/2,(A.y+B.y)/2,L/2+30);if(!lod)return;PK.used=FX31.now();
  const f0=F[0],th=Math.max(18,b.w*1.8)*(b.rank>=6?1.15:1),sy=th/f0[3],seg=FX31.C*sy*(lod<2?2:1),n=Math.max(1,Math.ceil(L/seg)),sx=L/(n*FX31.C),ang=Math.atan2(B.y-A.y,B.x-A.x),co=Math.cos(ang),si=Math.sin(ang);
  ctx.globalCompositeOperation='source-over';for(let i=0;i<n;i++){const f=F[FX31.loopK(F,14,i*1.7)],d=i*FX31.C*sx;FX31.img(ctx,PK,f,A.x+co*d,A.y+si*d,0,f[5]+f[3]/2,sx,sy,ang,a)}
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1}}
// 보호막 거품: 그림이 있는 보호막이면 예전 거품 대신 그림 (FXB.draw 동안만 흡수량을 0으로 보여 줌. 규칙은 그대로)
{const _fd=FXB.draw;FXB.draw=function(c,map){let sv=null;try{FX31.drawAir(c,map);if(P&&!P.dead&&P.shield>0&&P.shieldS&&FX31.get(P.shieldS.id,false)){sv=P.shield;P.shield=0}}catch(err){if(window.__QA)throw err}
  try{return _fd.apply(this,arguments)}finally{if(sv!=null)P.shield=sv}}}
// 몸 둘레 얇은 보호막 선(b4.js drawHero)도 그림이 있으면 그림이 대신한다 (무적 표시는 그대로)
{const _dh=drawHero;drawHero=function(){let sv=null;try{if(P&&P.shield>0&&!(P.invT>0)&&P.shieldS&&FX31.get(P.shieldS.id,false)){sv=P.shield;P.shield=0}}catch(_){}try{return _dh.apply(this,arguments)}finally{if(sv!=null)P.shield=sv}}}
// 땅에 깔리는 것(장판·고리): 시전 표시 바로 다음, 장판 테두리 아래
{const _cd=castDraw;castDraw=function(){_cd.apply(this,arguments);if(!FX31.on())return;try{S();FX31.drawGround(ctx,W2S)}catch(err){if(window.__QA)throw err}finally{G();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1}}}
FX31.drawGround=function(c,map){c.globalCompositeOperation='source-over';
  // v36: 3차 궁수 경계(헌팅 그라운드 · 나이트 헌트)는 따로 그리는 동안 fields에서 잠깐 빠지고(jwFields) 시전 앞뒤를 거치지 않아, 여기서 짝을 붙인다
  for(const f of (typeof jwFields==='function'?jwFields():fields)){if(!f.a31&&f.s&&f.s.j3wa){const g=this.get(f.s.id);if(g&&g.m.k==='field')f.a31=g.m}const m=f.a31,PK=m&&this.P[m.pk];if(!PK)continue;const F=this.fr(PK,m.b);if(!F)continue;const s=map(f.x,f.y),sc=this.fit(PK,m.b,f.rad);if(!FXL.lod(s.x,s.y,f.rad*1.2))continue;PK.used=this.now();
    const fade=Math.min(1,f.t*2,(f.max-f.t)*4);this.img(c,PK,F[this.loopK(F,7,f.x*.01)],s.x,s.y,64,64,sc,sc,0,.95*fade*Math.max(.45,Math.min(1,260/(f.rad||100))))}// v33: 아주 넓은 장판은 옅게
  for(const o of this.inst)if(o.z===0&&!o.fall&&o.ay===64)this.one(c,o,map);c.globalAlpha=1};
FX31.drawAir=function(c,map){c.globalCompositeOperation='source-over';
  const s=P&&P._s;if(s&&!P.dead){
    const lp=(id,cx,cy,sc,a)=>{const g=this.get(id,false);if(!g)return;const F=this.fr(g.PK,g.m.b);if(!F)return;this.img(c,g.PK,F[this.loopK(F,7)],cx,cy,64,64,sc,sc,0,a)};
    if(P.shield>0&&(P.shieldT==null||P.shieldT>0)&&P.shieldS)lp(P.shieldS.id,s.x,s.y-26,.74,.92);
    if(P.armor&&P.armor.t>0&&P.armor.s)lp(P.armor.s.id,s.x,s.y-24,.72,.85*Math.min(1,P.armor.t*2));
    if(P.orbits&&P.orbits.s){const o=P.orbits,g=this.get(o.s.id,false),F=g&&this.fr(g.PK,g.m.b);if(F){const el=o.max-o.t,k=g.m.c==='priest'?this.loopK(F,8):el<.3?Math.min(2,(el/.3*3)|0):o.t<.25?3:2,sc=this.isoK(o.rad,.82);/* v39: 사제 망치는 4칸이 도는 그림이라 계속 돌림 */
      this.img(c,g.PK,F[k],s.x,s.y-20,64,64,sc,sc,0,.75+.15*Math.sin(time*4))}}}
  let dead=0;for(const o of this.inst){if(time-o.t0>=o.d){dead++;continue}if(o.z===0&&!o.fall&&o.ay===64)continue;this.one(c,o,map)}
  if(dead)this.inst=this.inst.filter(o=>time-o.t0<o.d);c.globalCompositeOperation='lighter';c.globalAlpha=1};
// 한 번 재생되는 그림 하나
FX31.one=function(c,o,map){const a=(time-o.t0)/o.d;if(a<0||a>=1)return;const PK=this.P[o.pk];if(!PK)return;
  if(o.fol){const h=o.who||P;if(h.dead||(o.inv&&!(h.invT>0))){o.d=0;return}o.x=h.x;o.y=h.y}
  if(o.ln){if(o.who){o.x=o.who.x;o.y=o.who.y}if(o.who2&&!o.who2.dead){o.x2=o.who2.x;o.y2=o.who2.y}const F=this.fr(PK,o.st);if(!F)return;const A=map(o.x,o.y),B=map(o.x2,o.y2);A.y-=24;B.y-=24;const L=Math.hypot(B.x-A.x,B.y-A.y);if(L<4)return;
    if(!FXL.lod((A.x+B.x)/2,(A.y+B.y)/2,L/2+30))return;const f=F[this.kOf(F,a)],sx=L/Math.max(8,f[2]),sy=Math.max(.5,Math.min(1.4,sx*.7));this.img(c,PK,f,A.x,A.y,f[4],f[5]+f[3]/2,sx,sy,Math.atan2(B.y-A.y,B.x-A.x),Math.min(1,(1-a)*4));return}
  if(o.loop){const F=this.fr(PK,o.st),el=time-o.t0;if(!F)return;const s=map(o.x,o.y);this.img(c,PK,F[this.loopK(F,8,o.x*.01)],s.x,s.y-o.z,o.ax,o.ay,o.sc,o.sc,0,.92*Math.min(1,el*5,(o.d-el)*3));return}
  const s=map(o.x,o.y);if(!FXL.lod(s.x,s.y-o.z,90*o.sc))return;
  if(o.fall){const fa=(time-o.t0)/o.fall;if(fa<1){const F=this.fr(PK,o.st);if(F)this.img(c,PK,F[Math.min(2,1+(fa*2|0))],s.x,s.y-200*(1-fa),64,64,o.scF||o.sc,o.scF||o.sc,0,1);return}
    const F=this.fr(PK,o.st2);if(F)this.img(c,PK,F[this.kOf(F,(time-o.t0-o.fall)/(o.d-o.fall))],s.x,s.y,64,64,o.sc,o.sc,0,1);return}
  const F=this.fr(PK,o.st);if(!F)return;this.img(c,PK,F[this.kOf(F,a)],s.x,s.y-o.z,o.ax,o.ay,o.sc,o.sc,o.rot||0,1)};
{const _u=update;update=function(dt){/* v39: 그림이 있는 내리꽂기(라이트 필라 · 저지먼트 · 솔라 폴 …)가 땅에 닿을 때 예전 흰 빛기둥을 겹쳐 그리지 않음 */
  const L=FX31.on()?pend.filter(m=>m.a31&&m.t-dt<=0):null;_u.apply(this,arguments);if(L&&L.length)pillars=pillars.filter(b=>!L.some(m=>m.x===b.x&&m.y===b.y));
  try{FX31.tick(dt)}catch(err){if(window.__QA)throw err}}}
/* ----- v33: 금기 대해일(물벽이 나아가는 앞) · 금기 태풍(모이는 소용돌이) · 정령 사슬(번개 줄기) · 궁수 덫(놓인 덫 · 터짐) ----- */
FX31.drawMP=function(c,map){if(typeof MPJ==='undefined')return;
  for(const w of MPJ.waves){const g=w.s&&this.get(w.s.id);if(!g)continue;const F=this.fr(g.PK,g.m.b);if(!F)continue;const d=Math.min(w.d,w.len),s=map(w.x,w.y);if(d<20)continue;
    const L=this.scrLen(w.a,d),sc=L/(this.C*.82),fade=Math.min(1,(w.len+60-w.d)/120);this.img(c,g.PK,F[this.kOf(F,Math.min(.99,w.d/w.len))],s.x,s.y-10,18,64,sc,Math.min(sc,2.4),this.scrAng(w.a),.9*fade)}
  for(const q of MPJ.gales){const g=this.get(q.id||(q.s&&q.s.id));if(!g)continue;const F=this.fr(g.PK,g.m.b);if(!F)continue;const s=map(q.x,q.y),sc=this.scrLen(0,q.rad)/(this.C*.82);if(!FXL.lod(s.x,s.y,q.rad))continue;
    for(let j=0;j<2;j++)this.img(c,g.PK,F[this.loopK(F,10,j*2)],s.x,s.y-12,18,64,sc,sc*.55,q.rot+j*Math.PI,.55+.3*(q.f||0))}};
{const _a=FX31.drawAir;FX31.drawAir=function(c,map){try{this.drawMP(c,map)}catch(err){if(window.__QA)throw err}return _a.apply(this,arguments)}}
if(typeof mpChainTick==='function'){const _t=mpChainTick;mpChainTick=function(dt){const n0=bolts.length,C=MPJ.chain,r=_t.apply(this,arguments);const m=C&&FX31.M.spiritchain;
  if(m&&bolts.length>n0&&FX31.get('spiritchain'))for(let i=n0;i<bolts.length;i++)bolts[i].a31=m;return r}}
{const _dt=FXP.drawTrap;FXP.drawTrap=function(c,tr,map,now){const id=tr&&tr.s&&tr.s.id,g=id&&FX31.get(id),F=g&&g.m.k==='trap'&&FX31.fr(g.PK,g.m.b);if(!F)return _dt.apply(this,arguments);
  now=now==null?time:now;const s=tr.s,on=tr.age!=null?tr.age>=tr.arm:(tr.arm!=null?tr.arm:tr.armT||0)<=0,p=map(tr.x,tr.y),life=tr.t!=null?tr.t:tr.life!=null?tr.life:9;
  const kk=id==='beastcage'?Math.max(1,Math.min(1.6,(s.rad||220)/180)):Math.max(1,Math.min(1.8,(s.rad||70)/55));
  FX31.img(c,g.PK,F[0],p.x,p.y,64,74,.5*kk,.5*kk,0,Math.min(1,life*2)*(on?1:.6+.2*Math.sin(now*12)));c.globalAlpha=1}}
queueMicrotask(()=>{if(typeof PFX==='undefined')return;const _t=PFX.trap;PFX.trap=function(tr,ev){const r=_t.apply(this,arguments);
  if(ev==='boom'&&tr&&tr.s){const g=FX31.get(tr.s.id,false);if(g&&g.m.k==='trap'&&FX31.fr(g.PK,g.m.i))FX31.add({st:g.m.i,pk:g.m.pk,x:tr.x,y:tr.y,z:1,d:.5,sc:FX31.fit(g.PK,g.m.i,tr.s.rad||70),ax:64,ay:64})}return r}});
// v36: 3차 궁수 「시킹 샤프트」(휘는 마탄)는 투사체가 아니라 J3W.hom — 머리에 화살 그림 (꼬리 선은 그대로)
if(typeof jwUpright==='function'){const _ju=jwUpright;jwUpright=function(c,map){const r=_ju.apply(this,arguments);try{if(J3W.hom.length&&FX31.on()){const g=FX31.get('curvingshot'),F=g&&FX31.fr(g.PK,g.m.b);
  if(F){c.globalCompositeOperation='source-over';for(const h of J3W.hom){const s=map(h.x,h.y);if(!FXL.lod(s.x,s.y-22,40))continue;const f=F[h.life>4.3?1:2],sc=.45;FX31.img(c,g.PK,f,s.x,s.y-22,f[4]+f[2]*.72,f[5]+f[3]/2,sc*1.1,sc*.4,FX31.scrAng(h.a),1)}c.globalCompositeOperation='lighter';c.globalAlpha=1}}}catch(err){if(window.__QA)throw err}return r}}
// v37: 엘리멘탈 쿼텟의 동그란 구슬(예전 그림)을 절반 크기로. 맞는 범위(p.r)는 그대로, 그림만 머리 자리를 중심으로 줄이고 꼬리 길이는 그대로
{const _d=FXR.draw;FXR.draw=function(c,p,s,k,ox,oy,map){if(!(p&&p.s&&p.s.j3q!=null))return _d.apply(this,arguments);const h=.5,z=p.z||0;
  const map2=(x,y)=>{const b=map(x,y);return{x:s.x+(b.x-s.x)/h,y:s.y+(b.y-s.y)/h-z*(1/h-1)}};
  c.setTransform(k*h,0,0,k*h,ox+k*s.x*(1-h),oy+k*s.y*(1-h));try{return _d.call(this,c,p,s,k*h,ox+k*s.x*(1-h),oy+k*s.y*(1-h),map2)}finally{c.setTransform(k,0,0,k,ox,oy)}}}
/* ----- v37(사용자 요청): 새 그림이 있는 기술은 예전 그림을 겹쳐 그리지 않는다 -----
   궁수 예전 효과(FXP): 시전 때 생긴 효과에 기술 이름(sid)을 붙여 두고, 그 기술 그림이 있으면 그리지 않는다.
   쏟아지는 화살(화살비) · 내려찍기 별빛과 고리 · 짐승 떼/거대 화살 · 구르기 고리 · 소환/강화 외침 고리 · 덫 터짐 고리.
   상태 표시(덫에 묶인 우리 · 올가미)와 튕기는 화살(리코셰, 새 그림은 맞는 자리에만 있음)은 그대로 둔다. */
{const _c=FXP.cast;FXP.cast=function(s){const p=this._sid;this._sid=s&&s.id;try{return _c.apply(this,arguments)}finally{this._sid=p}}}
{const _a=FXP.add;FXP.add=function(o){if(o&&this._sid&&!o.sid)o.sid=this._sid;return _a.apply(this,arguments)}}
FX31.KEEPFXP=new Set(['cagec','snarec','toss']);
{const _o=FXP.drawOne;FXP.drawOne=function(c,f){if(f&&f.sid&&!FX31.KEEPFXP.has(f.k)&&FX31.on()&&FX31.get(f.sid,false))return;return _o.apply(this,arguments)}}
{const _dr=FXP.draw;FXP.draw=function(){const sw=[];if(FX31.on())for(const r of rains)if(r.s&&FX31.get(r.s.id,false)){sw.push([r,r.s]);r.s={id:r.s.id}}
  try{return _dr.apply(this,arguments)}finally{for(const [r,s0] of sw)r.s=s0}}}
{const _tb=FXP.trapBoom;FXP.trapBoom=function(tr){const id=tr&&tr.s&&tr.s.id,art=id&&FX31.on()&&FX31.get(id,false),n0=rings.length,p=this._sid;this._sid=id;
  try{return _tb.apply(this,arguments)}finally{this._sid=p;if(art&&rings.length>n0)rings.splice(n0)}}}
// v39: 미라클은 시전이 끝난 뒤(mpPost) 예전 흰 빛기둥을 세움 — 그림이 있으면 그 빛기둥은 빼고 그림(크게 터짐)만
if(typeof mpMiracle==='function'){const _m=mpMiracle;mpMiracle=function(){const n0=pillars.length,r=_m.apply(this,arguments);try{if(FX31.on()&&FX31.get('saintmiracle',false)&&pillars.length>n0)pillars.splice(n0)}catch(err){if(window.__QA)throw err}return r}}
window.__fx31=FX31;
