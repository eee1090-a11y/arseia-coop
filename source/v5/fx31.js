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
    ['040','fire','summon','hydra fireelem phoenix']],
  TWO:new Set(['bolt','chain','beam','rain']),M:{},n:{draw:0,fall:0,evict:0,load:0},
  init(){for(const [no,el,k,ids] of this.T){const b=`fx_${no}_1_mage_${el}_${k}`,i=this.TWO.has(k)?`fx_${no}_2_mage_${el}_${k}`:null;for(const id of ids.split(' '))this.M[id]={k,b,i,pk:'mage-'+el}}},
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
  scrAng(a){return Math.atan2((Math.cos(a)+Math.sin(a))*KI/2,(Math.cos(a)-Math.sin(a))*KI)},
  scrLen(a,L){return L*Math.hypot((Math.cos(a)-Math.sin(a))*KI,(Math.cos(a)+Math.sin(a))*KI/2)},
  add(o){o.t0=o.t0!=null?o.t0:time;this.inst.push(o);if(this.inst.length>60)this.inst.shift();return o},
  halve(n0){if(parts.length>n0){const keep=parts.slice(n0).filter((_,i)=>i%2===0);parts.length=n0;for(const p of keep)parts.push(p)}}};
FX31.init();
window.FX_PACK=function(name,meta,url){FX31.got(name,meta,url)};

/* ----- 시전 앞뒤: clsAim(모든 시전이 지나는 곳, 겨눔 직전)에서 개수를 적어 두고, FXP.cast(시전 끝)에서 새로 생긴 예전 층을 바꾼다 ----- */
{const _ca=clsAim;clsAim=function(s,t){if(s&&FX31.M[s.id])FX31.snap={id:s.id,x:P.x,y:P.y,r:rings.length,p:parts.length,b:bolts.length,bm:beams.length,f:fields.length,pd:pend.length,fx:FXB.fx.length,al:allies.length};return _ca.apply(this,arguments)}}
{const _fc=FXP.cast;FXP.cast=function(s,t,actor){const r=_fc.apply(this,arguments);const sn=FX31.snap;FX31.snap=null;
  try{if(s&&sn&&sn.id===s.id)FX31.cast(s,t,actor||P,sn)}catch(err){if(window.__QA)throw err}return r}}
// 같이 하기 유령 시전에서도 이때의 P가 시전한 사람 자리 (net.js가 P를 잠깐 바꿔 둔다)
FX31.cast=function(s,t,_o,sn){const o=P;const g=this.get(s.id);if(!g)return;const {m}=g,k=m.k,rank=Math.max(1,Math.min(9,s.rank||1));
  const newRings=()=>{if(rings.length>sn.r)rings.splice(sn.r,rings.length-sn.r).filter(r=>r.faint).forEach(r=>rings.push(r))};
  if(k==='cone'){const a=P.face,L=this.scrLen(a,s.range||160);this.add({st:m.b,pk:m.pk,x:o.x,y:o.y,z:16,d:.42,rot:this.scrAng(a),sc:L/(this.C*.82),ax:18,ay:64});this.halve(sn.p)}
  else if(k==='nova'){this.add({st:m.b,pk:m.pk,x:o.x,y:o.y,z:0,d:.55,sc:this.isoK(s.rad||100),ax:64,ay:64});newRings();this.halve(sn.p)}
  else if(k==='blink'){const sc=.62+rank*.03;this.add({st:m.b,pk:m.pk,x:sn.x,y:sn.y,z:0,d:.45,sc,ax:64,ay:104});this.add({st:m.b,pk:m.pk,x:o.x,y:o.y,z:0,d:.45,sc,ax:64,ay:104,t0:time+.06});newRings();this.halve(sn.p)}
  else if(k==='heal'){const sc=.7+rank*.03;this.add({st:m.b,pk:m.pk,x:o.x,y:o.y,z:0,d:.8,sc,ax:64,ay:108});if(FXB.fx.length>sn.fx)FXB.fx.splice(sn.fx);newRings();this.halve(sn.p)}
  else if(k==='chain'){for(let i=sn.b;i<bolts.length;i++){const b=bolts[i];b.a31=m;if(m.i)this.add({st:m.i,pk:m.pk,x:b.b.x,y:b.b.y,z:b.b.z||16,d:.3,sc:.42+rank*.03,ax:64,ay:64,t0:time+(b.delay||0)})}newRings();this.halve(sn.p)}
  else if(k==='beam'){for(let i=sn.bm;i<beams.length;i++){const b=beams[i];b.a31=m;if(m.i)this.add({st:m.i,pk:m.pk,x:b.x2,y:b.y2,z:b.z||14,d:.4,sc:.5+rank*.04,ax:64,ay:64})}
    for(let i=sn.b;i<bolts.length;i++)bolts[i].hid31=1;newRings();this.halve(sn.p)}
  else if(k==='field'){for(let i=sn.f;i<fields.length;i++)fields[i].a31=m}
  // v32: 불러낼 때 빛 — 새로 나온 동료(소환수) 발밑에서 한 번 (없으면 시전한 사람 앞)
  else if(k==='summon'){const sc=.85+rank*.03,at=allies.slice(sn.al||0).filter(a=>a.s&&a.s.id===s.id);if(!at.length)at.push({x:o.x+Math.cos(P.face)*50,y:o.y+Math.sin(P.face)*50});
    for(const a of at)this.add({st:m.b,pk:m.pk,x:a.x,y:a.y,z:0,d:.75,sc,ax:64,ay:100});newRings();this.halve(sn.p)}
  else if(k==='strike'){for(let i=sn.pd;i<pend.length;i++){const q=pend[i];if(q.s&&q.s.mini)continue;const dl=Math.max(0,q.t-.45);this.add({st:m.b,pk:m.pk,x:q.x,y:q.y,z:0,d:.7,sc:Math.max(.8,Math.min(2.2,(q.s.rad||90)*2.2/this.C)),ax:64,ay:108,t0:time+dl})}}};
// 투사체 몸통: 그림이 있으면 예전 몸통·꼬리·고리 대신 그림 (휘는 빛 꼬리는 그림에 들어 있음)
{const _d=FXR.draw;FXR.draw=function(c,p,s,k,ox,oy,map){const g=p&&p.s&&!p.s.phys&&FX31.get(p.s.id);if(!g||g.m.k!=='bolt')return _d.apply(this,arguments);
  const F=FX31.fr(g.PK,g.m.b);if(!F)return _d.apply(this,arguments);if(!FXL.lod(s.x,s.y,40))return;
  const r=p.r||6,mm=Math.max(.8,Math.min(1.3,Math.sqrt(r/7))),sc=(.42+.07*(((p.s.rank|0)||1)-1))*mm,ang=p._ang!=null?p._ang:Math.atan2((p.vx+p.vy)*KI/2,(p.vx-p.vy)*KI);
  if(p._fxph==null)p._fxph=(FXR.n=(FXR.n+1)%97)*1.7;const age=(p._a31=(p._a31||0)+1),f=F[age<3?1:2];
  const pul=1+.05*Math.sin(time*18+p._fxph);c.globalCompositeOperation='source-over';FX31.img(c,g.PK,f,s.x,s.y,f[4]+f[2]*.72,f[5]+f[3]/2,sc*pul,sc*pul,ang,1);c.globalCompositeOperation='lighter';c.globalAlpha=1}}
// 맞힘: 그림이 있으면 예전 빛 터짐 대신 그림 (땅 자국은 그대로)
{const _h=FXR.hit;FXR.hit=function(p){const g=p&&p.s&&FX31.get(p.s.id,false);if(!g||!g.m.i||!FX31.fr(g.PK,g.m.i))return _h.apply(this,arguments);
  const t=this.tier(p);FX31.add({st:g.m.i,pk:g.m.pk,x:p.x,y:p.y,z:p.z||0,d:[.26,.3,.36,.45,.6][t],sc:.42+.06*t+(p.s.aoe?.25:0),ax:64,ay:64});if(t>=3)decal(p.x,p.y,t>=4?34:22,p.s.el)}}
// 하늘에서 떨어지는 것: 떨어지는 그림이 잠깐 내려오고 땅에 맞는 그림 (예전 번개 줄기·빛기둥·작은 불덩이 대신)
{const _sh=skyHit;skyHit=function(x,y,s,dmg,rad,hitR){const g=s&&FX31.get(s.id);if(!g||g.m.k!=='rain')return _sh.apply(this,arguments);
  const n0={b:bolts.length,pl:pillars.length,pd:pend.length,p:parts.length,r:rings.length},r=_sh.apply(this,arguments);
  bolts.length>n0.b&&bolts.splice(n0.b);pillars.length>n0.pl&&pillars.splice(n0.pl);for(let i=pend.length-1;i>=n0.pd;i--)if(pend[i].s&&pend[i].s.mini)pend.splice(i,1);
  for(let i=rings.length-1;i>=n0.r;i--)if(!rings[i].faint)rings.splice(i,1);FX31.halve(n0.p);
  const sc=Math.max(.45,Math.min(1.1,(rad||40)*2.4/FX31.C));FX31.add({st:g.m.b,st2:g.m.i,pk:g.m.pk,x,y,z:0,d:.5,fall:.14,sc,ax:64,ay:64});FX31.n.fall++;return r}}
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
  for(const f of fields){const m=f.a31,PK=m&&this.P[m.pk];if(!PK)continue;const F=this.fr(PK,m.b);if(!F)continue;const s=map(f.x,f.y),sc=this.isoK(f.rad,.93);if(!FXL.lod(s.x,s.y,f.rad*1.2))continue;PK.used=this.now();
    const fade=Math.min(1,f.t*2,(f.max-f.t)*4);this.img(c,PK,F[this.loopK(F,7,f.x*.01)],s.x,s.y,64,64,sc,sc,0,.95*fade)}
  for(const o of this.inst)if(o.z===0&&!o.fall&&o.ay===64)this.one(c,o,map);c.globalAlpha=1};
FX31.drawAir=function(c,map){c.globalCompositeOperation='source-over';
  const s=P&&P._s;if(s&&!P.dead){
    const lp=(id,cx,cy,sc,a)=>{const g=this.get(id,false);if(!g)return;const F=this.fr(g.PK,g.m.b);if(!F)return;this.img(c,g.PK,F[this.loopK(F,7)],cx,cy,64,64,sc,sc,0,a)};
    if(P.shield>0&&(P.shieldT==null||P.shieldT>0)&&P.shieldS)lp(P.shieldS.id,s.x,s.y-26,.74,.92);
    if(P.armor&&P.armor.t>0&&P.armor.s)lp(P.armor.s.id,s.x,s.y-24,.72,.85*Math.min(1,P.armor.t*2));
    if(P.orbits&&P.orbits.s){const o=P.orbits,g=this.get(o.s.id,false),F=g&&this.fr(g.PK,g.m.b);if(F){const el=o.max-o.t,k=el<.3?Math.min(2,(el/.3*3)|0):o.t<.25?3:2,sc=this.isoK(o.rad,.82);
      this.img(c,g.PK,F[k],s.x,s.y-20,64,64,sc,sc,0,.75+.15*Math.sin(time*4))}}}
  let dead=0;for(const o of this.inst){if(time-o.t0>=o.d){dead++;continue}if(o.z===0&&!o.fall&&o.ay===64)continue;this.one(c,o,map)}
  if(dead)this.inst=this.inst.filter(o=>time-o.t0<o.d);c.globalCompositeOperation='lighter';c.globalAlpha=1};
// 한 번 재생되는 그림 하나
FX31.one=function(c,o,map){const a=(time-o.t0)/o.d;if(a<0||a>=1)return;const PK=this.P[o.pk];if(!PK)return;const s=map(o.x,o.y);if(!FXL.lod(s.x,s.y-o.z,90*o.sc))return;
  if(o.fall){const fa=(time-o.t0)/o.fall;if(fa<1){const F=this.fr(PK,o.st);if(F)this.img(c,PK,F[Math.min(2,1+(fa*2|0))],s.x,s.y-200*(1-fa),64,64,o.sc,o.sc,0,1);return}
    const F=this.fr(PK,o.st2);if(F)this.img(c,PK,F[this.kOf(F,(time-o.t0-o.fall)/(o.d-o.fall))],s.x,s.y,64,64,o.sc,o.sc,0,1);return}
  const F=this.fr(PK,o.st);if(!F)return;this.img(c,PK,F[this.kOf(F,a)],s.x,s.y-o.z,o.ax,o.ay,o.sc,o.sc,o.rot||0,1)};
{const _u=update;update=function(dt){_u.apply(this,arguments);try{FX31.tick(dt)}catch(err){if(window.__QA)throw err}}}
window.__fx31=FX31;
