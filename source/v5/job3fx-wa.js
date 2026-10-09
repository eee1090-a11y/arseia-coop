/* ---------- v20 (WARARC): 3차 전직 실행 — 성벽의 군주 · 전쟁군주 · 신궁 · 그림자 사냥꾼 ----------
   데이터는 job3d-wa.js. build.sh에서 job2q.js 뒤(job3fx-mp.js가 있으면 그 뒤), job3.js 앞.
   · 기존 함수(tryCast · _castRelease · eff · hurtE · hitPlayer · supFx · update · updateAllies · drawAlly · FXP.draw/ground …)를 한 겹씩 감싼다.
   · 새 종류(wall · throw · mleap · sweep · riders · kingdom · swap · counter · gale · harvest · homing · sidestep · scatter · stars · starfall · clones)는
     b3.js switch가 모르는 이름이라 기본 동작이 없고, 여기 jwPost가 시전 뒤에 직접 처리한다(같이 하기 유령 시전은 그림만).
   · 「투혼」(전쟁군주)과 「호흡」(신궁)은 J3W에. 몬스터 위치를 바꾸는 일(벽 · 경계 · 몰이 · 고정)은 방장(혼자면 나)이 한다.
   · 같이 하기 메시지는 CORE의 'j3x'(J3NET) — 키는 모두 'wa'로 시작한다.
   · 그림은 모두 처음 한 번 구워 둔 캔버스(J3B)를 쓴다(매 프레임 그라디언트·그림자·필터 없음). */
Object.assign(CAST_T,CAST_T_J3WA);
// 일격필살: 호흡이 다섯이면 시전 1초
Object.defineProperty(CAST_T,'oneshot',{configurable:true,enumerable:true,get(){return J3W.p===P&&J3W.br>=5?1:2},set(){}});
Object.assign(REC_T,{rampartbash:0,lordstance:0,bewall:0,provokemark:.1,stonerampart:.25,citadelecho:0,lordduel:.15,fortressswap:0,bulwarkcounter:.25,earthanchor:.2,unfallenkingdom:0,
  lordcombo:0,battleblood:0,earthsplit:.2,weaponthrow:.1,executionleap:.25,bloodoath:0,bloodharvest:0,lordgale:.25,wardrum:0,phantomriders:.2,heavenlycharge:.3,
  windpierce:0,breathmastery:0,curvingshot:.15,windstep:0,exposeweak:.1,scattervolley:.15,piercinggaze:0,sevenstars:.3,returnarrow:.15,oneshot:.3,starfallbow:.35,
  shadowarrow:0,darkhunter:0,shadowhide:0,shadowtrap:.1,shadowstep:0,huntground:.2,poisonshade:0,shadowclone:.1,drivehunt:.2,abysstrap:.15,nighthunt:.2});
['wall','throw','mleap','sweep','homing','sidestep','scatter','counter','starfall'].forEach(k=>AIMED.add(k));
const J3W_KN={wall:'지형',throw:'던졌다 되돌아옴',mleap:'연속 도약',sweep:'돌격 행렬',riders:'소환',kingdom:'파티 수호',swap:'자리 바꾸기',counter:'반격',gale:'사방 검기',harvest:'회복',
  homing:'유도 화살',sidestep:'이동 사격',scatter:'부채꼴',stars:'다중 조준',starfall:'별 떨구기',clones:'분신'};
function jwKindN(){try{if(typeof KINDN==='object'&&!KINDN.starfall)Object.assign(KINDN,J3W_KN)}catch(_){}}

/* ===== 상태 ===== */
const J3W={p:null,fz:0,fzT:0,fzD:0,br:0,brT:0,blkNext:0,store:0,kg:null,cl:null,lsB:0,lsT0:-9,drumT:-9,echoT:-9,aoe:0,cx:null,gx:null,lastTg:null,combo:null,sd:1,
  walls:[],thr:[],leaps:[],sweeps:[],hom:[],stars:[],sfall:[],waves:[],drives:[],gfx:[],lords:new Map(),hid:new Map(),fzGot:new WeakSet(),once:new WeakMap()};
const J3WBX=['j3wall','j3echo','j3ls','critDmg','j3drum','j3gaze','j3venom','j3hide'];
const J3W_VEN={id:'j3venom',n:'독',el:'phys',cls:'archer',rank:25,proc:1,kind:'trap'};
function jwReset(){if(GHOST||J3W.p===P)return;J3W.p=P;J3W.fz=0;J3W.fzT=0;J3W.br=0;J3W.brT=0;J3W.blkNext=0;J3W.store=0;J3W.kg=null;J3W.cl=null;J3W.leaps.length=0;J3W.combo=null;J3W.lastTg=null}
const jwHideOn=()=>!GHOST&&!!(P.buffs.shadowhide&&P.buffs.shadowhide.t>0);
const jwHidden=()=>jwHideOn()||(typeof stealthOn==='function'&&stealthOn());
function jwFz(n,quiet){if(GHOST||P.job3!=='warlord')return;const o=J3W.fz;J3W.fz=Math.min(10,J3W.fz+n);J3W.fzT=6;J3W.fzD=0;
  if(J3W.fz>o&&!quiet&&J3W.fz===10)ftext(P.x,P.y-40,'투혼 10','#ff6a4a',true,90)}
function jwOnce(s,e){let m=J3W.once.get(s);if(!m){m=new WeakSet();J3W.once.set(s,m)}if(m.has(e))return false;m.add(e);return true}
function jwShield(a,d){if(P.dead||!(a>0))return false;if(P.shield>a&&P.shieldT>0)return false;P.shield=Math.round(a);P.shieldT=d;P.shieldN=0;P.shieldRef=0;P.shieldS=null;return true}
function jwWeak(e,c,d,send){if(!e||e.dead)return;if(!(e.j3wk>0)||c>=(e.j3wkC||0))e.j3wkC=c;e.j3wk=Math.max(e.j3wk||0,d);if(send&&NET.on&&e.id)j3Send('wamk',{id:e.id,c,d})}
function jwDuelHost(e,k,d){e.j3duel={t:d,by:k};if(typeof PTY==='object'&&PTY.taunt)PTY.taunt(e,k,d);else{e.tauntT=Math.max(e.tauntT||0,d);e.tauntBy=P}}
function jwThrMove(of,to){for(const e of enemies){const T=e.thr;if(!T||e.dead)continue;const v=T.get(of)||0;if(v>0){T.set(of,0);T.set(to,(T.get(to)||0)+v)}}}
function jwInNight(p){if(!p)return false;for(const f of fields)if(f.s.j3night&&dist(p,f)<f.rad)return true;return false}
function j3PlayerAnchored(){return !!(P&&P.j3anc>0)}
const jwOwn=c=>c.G||P;

/* ===== 그림: 처음 한 번 굽기 ===== */
const J3B=new Map();
function jb(k,w,h,f){let c=J3B.get(k);if(c)return c;c=document.createElement('canvas');c.width=w;c.height=h;try{f(c.getContext('2d'),w,h)}catch(_){}J3B.set(k,c);return c}
function jbRad(g,x,y,r,stops){const gr=g.createRadialGradient(x,y,0,x,y,r);for(const [o,c] of stops)gr.addColorStop(o,c);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}
const JS={
  rock(i){return jb('rock'+i,60,52,(g)=>{const sd=i*7+3,rr=k=>{const x=Math.sin(sd*12.9898+k*78.233)*43758.5453;return x-Math.floor(x)};
    g.translate(30,30);const pts=[];for(let k=0;k<9;k++){const a=k/9*6.283-.3,R=(k>2&&k<7?18:24)*(.85+rr(k)*.3);pts.push([Math.cos(a)*R*1.15,Math.sin(a)*R*.9-(k>4?0:6)])}
    const gr=g.createLinearGradient(0,-26,0,22);gr.addColorStop(0,'#b8ac98');gr.addColorStop(.45,'#8a7e6a');gr.addColorStop(1,'#3e362c');g.fillStyle=gr;g.beginPath();pts.forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();
    g.strokeStyle='#2a241c';g.lineWidth=2;g.stroke();g.strokeStyle='rgba(255,246,220,.45)';g.lineWidth=1.4;g.beginPath();g.moveTo(pts[6][0]*.8,pts[6][1]*.8);g.lineTo(-4,-18);g.lineTo(pts[1][0]*.7,pts[1][1]*.8);g.stroke();
    g.strokeStyle='rgba(40,30,20,.55)';g.lineWidth=1;g.beginPath();g.moveTo(-10,-4);g.lineTo(-2,4);g.lineTo(8,0);g.moveTo(4,-12);g.lineTo(10,-6);g.stroke();
    g.fillStyle='rgba(110,140,80,.5)';for(let k=0;k<5;k++){g.beginPath();g.arc(-14+rr(k+20)*28,10+rr(k+30)*8,1.6+rr(k+40)*1.6,0,6.283);g.fill()}})},
  rider(f){return jb('rider'+f,92,84,(g)=>{g.translate(46,70);const lg=(x,d)=>{g.beginPath();g.moveTo(x,-22);g.lineTo(x+d,-6);g.lineTo(x+d*.6,0);g.stroke()};
    g.lineCap='round';g.strokeStyle='rgba(170,200,255,.85)';g.lineWidth=4;lg(-18,f?-8:6);lg(-10,f?8:-6);lg(14,f?6:-8);lg(22,f?-6:8);
    const gr=g.createLinearGradient(0,-50,0,-14);gr.addColorStop(0,'rgba(230,240,255,.95)');gr.addColorStop(1,'rgba(120,150,230,.75)');g.fillStyle=gr;
    g.beginPath();g.ellipse(2,-30,26,11,0,0,6.283);g.fill();g.beginPath();g.moveTo(20,-36);g.quadraticCurveTo(30,-56,38,-52);g.lineTo(42,-44);g.quadraticCurveTo(32,-40,26,-28);g.fill();
    g.beginPath();g.moveTo(-22,-34);g.quadraticCurveTo(-36,-30,-40,-16);g.quadraticCurveTo(-30,-26,-20,-26);g.fill();
    g.fillStyle='rgba(245,250,255,.95)';g.beginPath();g.ellipse(-2,-48,7,10,-.15,0,6.283);g.fill();g.beginPath();g.arc(-1,-62,5.5,0,6.283);g.fill();
    g.fillStyle='#ffd76a';g.beginPath();g.moveTo(-6,-66);g.lineTo(-1,-74);g.lineTo(4,-66);g.fill();
    g.strokeStyle='rgba(255,240,200,.95)';g.lineWidth=2.4;g.beginPath();g.moveTo(-14,-40);g.lineTo(44,-66);g.stroke();g.fillStyle='#fff6d8';g.beginPath();g.moveTo(44,-66);g.lineTo(38,-60);g.lineTo(48,-69);g.fill();
    g.fillStyle='rgba(216,72,58,.85)';g.beginPath();g.moveTo(-8,-46);g.lineTo(-24,-40);g.lineTo(-20,-50);g.fill()})},
  star(){return jb('star',96,96,(g)=>{jbRad(g,48,48,48,[[0,'rgba(255,250,220,1)'],[.18,'rgba(255,226,140,.85)'],[.5,'rgba(255,190,80,.25)'],[1,'rgba(255,160,40,0)']]);
    g.fillStyle='#fffbe8';g.beginPath();for(let k=0;k<8;k++){const a=k/8*6.283-1.571,R=k%2?7:30;g.lineTo(48+Math.cos(a)*R,48+Math.sin(a)*R)}g.closePath();g.fill()})},
  blade(){return jb('blade',48,48,(g)=>{g.translate(24,24);g.rotate(-.8);const gr=g.createLinearGradient(-4,-20,4,10);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#8a92a4');g.fillStyle=gr;
    g.beginPath();g.moveTo(0,-21);g.lineTo(4,-14);g.lineTo(3.4,8);g.lineTo(-3.4,8);g.lineTo(-4,-14);g.closePath();g.fill();g.strokeStyle='#2a2a32';g.lineWidth=1;g.stroke();
    g.fillStyle='#e8c35a';g.fillRect(-9,8,18,3.4);g.fillStyle='#5a3a1c';g.fillRect(-2,11,4,9);g.fillStyle='#e8c35a';g.beginPath();g.arc(0,21,2.6,0,6.283);g.fill()})},
  garrow(col){return jb('ga'+col,64,18,(g)=>{const gr=g.createLinearGradient(0,9,64,9);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.6,col);gr.addColorStop(1,'#ffffff');g.strokeStyle=gr;g.lineWidth=3;g.lineCap='round';
    g.beginPath();g.moveTo(2,9);g.lineTo(54,9);g.stroke();g.fillStyle='#ffffff';g.beginPath();g.moveTo(63,9);g.lineTo(52,4);g.lineTo(55,9);g.lineTo(52,14);g.closePath();g.fill();
    jbRad(g,56,9,9,[[0,'rgba(255,255,255,.9)'],[1,'rgba(255,255,255,0)']])})},
  clone(){return jb('clone',52,80,(g)=>{g.translate(26,76);const gr=g.createLinearGradient(0,-70,0,0);gr.addColorStop(0,'rgba(120,96,190,.95)');gr.addColorStop(1,'rgba(30,20,50,.9)');g.fillStyle=gr;
    g.beginPath();g.moveTo(-12,0);g.lineTo(-9,-30);g.quadraticCurveTo(-14,-52,-6,-60);g.quadraticCurveTo(0,-72,7,-60);g.quadraticCurveTo(14,-50,9,-30);g.lineTo(12,0);g.closePath();g.fill();
    g.strokeStyle='rgba(200,180,255,.8)';g.lineWidth=1.4;g.stroke();g.strokeStyle='rgba(220,200,255,.9)';g.lineWidth=2;g.beginPath();g.arc(14,-38,16,-1.2,1.2);g.stroke();
    g.fillStyle='#e8d8ff';g.beginPath();g.arc(-2,-58,1.4,0,6.283);g.arc(3,-58,1.4,0,6.283);g.fill()})},
  wolf(f){return jb('swolf'+f,72,40,(g)=>{g.translate(36,34);g.fillStyle='rgba(40,30,64,.92)';g.beginPath();g.ellipse(0,-12,20,8,0,0,6.283);g.fill();
    g.beginPath();g.moveTo(16,-16);g.lineTo(30,-24);g.lineTo(34,-16);g.lineTo(22,-8);g.fill();g.beginPath();g.moveTo(24,-22);g.lineTo(25,-30);g.lineTo(29,-23);g.fill();
    g.beginPath();g.moveTo(-18,-14);g.quadraticCurveTo(-30,-20,-34,-10);g.quadraticCurveTo(-26,-12,-18,-8);g.fill();g.strokeStyle='rgba(40,30,64,.92)';g.lineWidth=3.4;g.lineCap='round';
    const L=f?[[-12,-6],[-4,6],[8,-6],[14,6]]:[[-12,6],[-4,-6],[8,6],[14,-6]];for(const [x,d] of L){g.beginPath();g.moveTo(x,-8);g.lineTo(x+d,0);g.stroke()}
    g.strokeStyle='rgba(170,140,255,.7)';g.lineWidth=1;g.beginPath();g.ellipse(0,-12,20,8,0,3.4,6.1);g.stroke();g.fillStyle='#d8ff9a';g.beginPath();g.arc(28,-19,1.5,0,6.283);g.fill()})},
  dark(){return jb('dark',128,128,(g)=>jbRad(g,64,64,64,[[0,'rgba(10,6,24,.62)'],[.75,'rgba(14,8,30,.5)'],[.93,'rgba(40,24,80,.35)'],[1,'rgba(20,10,40,0)']]))},
  zone(k){return jb('zone'+k,128,128,(g)=>{const c=k==='a'?'200,180,130':'120,90,200';jbRad(g,64,64,64,[[0,`rgba(${c},.05)`],[.8,`rgba(${c},.14)`],[.96,`rgba(${c},.3)`],[1,`rgba(${c},0)`]])})},
  dome(){return jb('dome',128,128,(g)=>jbRad(g,64,64,64,[[0,'rgba(255,230,150,.04)'],[.7,'rgba(255,220,130,.1)'],[.92,'rgba(255,236,170,.35)'],[1,'rgba(255,236,170,0)']]))},
  mark(k){return jb('mk'+k,40,40,(g)=>{g.translate(20,20);const col=k==='w'?'#ffcf5a':k==='p'?'#ff6a4a':'#ffe9a8';g.strokeStyle=col;g.lineWidth=2.4;g.lineCap='round';
    if(k==='w'){g.beginPath();g.moveTo(0,-15);g.lineTo(15,0);g.lineTo(0,15);g.lineTo(-15,0);g.closePath();g.stroke();g.beginPath();g.arc(0,0,5,0,6.283);g.stroke();for(const a of [0,1.571,3.142,4.712]){g.beginPath();g.moveTo(Math.cos(a)*9,Math.sin(a)*9);g.lineTo(Math.cos(a)*19,Math.sin(a)*19);g.stroke()}}
    else if(k==='p'){g.beginPath();g.moveTo(0,-16);g.lineTo(0,14);g.stroke();g.fillStyle=col;g.beginPath();g.moveTo(0,-19);g.lineTo(6,-8);g.lineTo(-6,-8);g.closePath();g.fill();g.beginPath();g.moveTo(-8,6);g.lineTo(8,6);g.stroke()}
    else{g.beginPath();g.moveTo(-12,-12);g.lineTo(12,12);g.moveTo(12,-12);g.lineTo(-12,12);g.stroke();g.fillStyle=col;g.beginPath();g.arc(0,0,3.4,0,6.283);g.fill()}})},
  eye(){return jb('eye',40,24,(g)=>{g.translate(20,12);g.fillStyle='rgba(220,240,255,.95)';g.beginPath();g.moveTo(-18,0);g.quadraticCurveTo(0,-14,18,0);g.quadraticCurveTo(0,14,-18,0);g.fill();
    g.fillStyle='#4aa8ff';g.beginPath();g.arc(0,0,6,0,6.283);g.fill();g.fillStyle='#08101c';g.beginPath();g.ellipse(0,0,1.6,5,0,0,6.283);g.fill()})},
  vortex(){return jb('vortex',120,60,(g)=>{g.translate(60,30);g.scale(1,.5);jbRad(g,0,0,58,[[0,'rgba(0,0,0,.95)'],[.6,'rgba(16,6,30,.8)'],[1,'rgba(40,20,80,0)']]);
    g.strokeStyle='rgba(150,110,240,.7)';g.lineWidth=3;for(let k=0;k<3;k++){g.beginPath();for(let i=0;i<40;i++){const a=k*2.09+i*.16,R=6+i*1.2;g.lineTo(Math.cos(a)*R,Math.sin(a)*R)}g.stroke()}})},
  wave(){return jb('wave',72,40,(g)=>{g.translate(36,20);const gr=g.createLinearGradient(-30,0,30,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.7,'rgba(255,220,190,.9)');gr.addColorStop(1,'#ffffff');g.fillStyle=gr;
    g.beginPath();g.moveTo(-30,-16);g.quadraticCurveTo(26,-14,30,0);g.quadraticCurveTo(26,14,-30,16);g.quadraticCurveTo(14,4,14,0);g.quadraticCurveTo(14,-4,-30,-16);g.fill()})},
  snare(on){return jb('snare'+on,84,44,(g)=>{g.translate(42,22);g.scale(1,.5);jbRad(g,0,0,40,[[0,'rgba(30,14,60,.85)'],[.8,'rgba(50,24,90,.6)'],[1,'rgba(80,40,140,0)']]);
    g.strokeStyle=on?'rgba(190,150,255,.95)':'rgba(140,110,200,.6)';g.lineWidth=2.4;g.beginPath();g.arc(0,0,28,0,6.283);g.stroke();
    for(let k=0;k<8;k++){const a=k/8*6.283;g.beginPath();g.moveTo(Math.cos(a)*14,Math.sin(a)*14);g.lineTo(Math.cos(a+.3)*30,Math.sin(a+.3)*30);g.stroke()}
    g.fillStyle=on?'#e8d8ff':'#9a88c8';for(let k=0;k<4;k++){const a=k/4*6.283+.4;g.beginPath();g.arc(Math.cos(a)*22,Math.sin(a)*22,2.6,0,6.283);g.fill()}})},
  pit(on){return jb('pit'+on,96,52,(g)=>{g.translate(48,26);g.scale(1,.5);jbRad(g,0,0,46,[[0,'rgba(0,0,0,1)'],[.55,'rgba(10,4,20,.95)'],[.85,'rgba(60,30,110,.6)'],[1,'rgba(90,50,160,0)']]);
    g.strokeStyle=on?'rgba(200,160,255,.95)':'rgba(140,110,200,.55)';g.lineWidth=3;g.beginPath();g.arc(0,0,34,0,6.283);g.stroke();g.lineWidth=1.6;
    for(let k=0;k<12;k++){const a=k/12*6.283;g.beginPath();g.moveTo(Math.cos(a)*34,Math.sin(a)*34);g.lineTo(Math.cos(a+.15)*42,Math.sin(a+.15)*42);g.stroke()}})},
  drum(){return jb('drum',36,30,(g)=>{g.translate(18,15);g.fillStyle='#8a2a24';g.fillRect(-12,-6,24,14);g.fillStyle='#e8d8b0';g.beginPath();g.ellipse(0,-6,12,4,0,0,6.283);g.fill();g.strokeStyle='#e8c35a';g.lineWidth=1.2;g.beginPath();g.moveTo(-10,-4);g.lineTo(-4,8);g.lineTo(2,-4);g.lineTo(8,8);g.stroke()})}};

/* ===== 시전 앞뒤 ===== */
function jwStepTarget(t){let b=null,bd=1e9;for(const q of traps){if(q.own!==0||q.life<=0||dist(q,P)>SPELLS.shadowstep.range)continue;const d=dist(q,t);if(d<bd){bd=d;b=q}}
  return b?{x:b.x,y:b.y,trap:1}:clampRange(t,SPELLS.shadowstep.j3step||260)}
function jwPre(id,t){const s0=SPELLS[id];if(!s0||!s0.j3wa)return null;jwReset();
  const G=GHOST,CM=CAST_MOD,gx=J3W.gx;
  const c={id,s0,t,cd0:P.cd[id]||0,CM,G,nP:projs.length,nT:traps.length,nF:fields.length,ox:P.x,oy:P.y};
  if(G){c.fz=gx?gx.fz|0:0;c.br=gx?gx.br|0:0;c.cf=gx?clamp(+gx.cf||0,0,1):0}
  else{c.fz=P.job3==='warlord'?J3W.fz:0;c.br=P.job3==='divinearcher'?J3W.br:0;c.cf=CM&&CM.charge!=null?CM.charge:0;
    if(!CM&&id==='bloodharvest'&&J3W.fz<=0&&skLv(id)>0&&!(P.cd[id]>0)){if(P.noMpT<=0){msg(`${s0.n}: 쌓인 투혼이 없습니다`,'#a39d8f');P.noMpT=1.2}return false}
    if(s0.j3at==='me')c.t={x:P.x,y:P.y};
    if(id==='shadowstep'&&!CM)c.t=jwStepTarget(t||aimPoint());
    c.blk=id==='rampartbash'&&J3W.blkNext;c.hid=id==='shadowarrow'&&jwHidden();
    if(id==='lordcombo'){if(CM&&CM.tick&&J3W.combo&&time-J3W.combo.at<1.5){c.tok=J3W.combo.tok;c.last=++J3W.combo.n>=(s0.hits||4)-1}else if(!CM||!CM.tick){J3W.combo={at:time,n:0,tok:{}};c.tok=J3W.combo.tok}}}
  c.tg=c.t||t||(G?{x:P.x+Math.cos(P.face)*120,y:P.y+Math.sin(P.face)*120}:aimPoint());
  J3W.cx=c;return c}
{const _ef=eff;eff=function(id,L){const e=_ef(id,L),c=J3W.cx;if(!c||c.id!==id||!e.j3wa)return e;
  if(e.j3fury&&c.fz>0){const F=e.j3fury;e.len=(e.len||0)+F.len*c.fz;e.mult+=F.mult*c.fz;e.j3fzUsed=c.fz}
  if(e.j3br&&c.br>0){e.mult*=1+.08*c.br;e.j3brUsed=c.br}
  if(e.j3blk&&c.blk){e.mult*=e.j3blk.mul;e.stun=Math.max(e.stun||0,e.j3blk.stun);e.j3blkOn=1}
  if(e.j3hidden&&c.hid)e.mult*=e.j3hidden;
  if(c.tok)e._tok=c.tok;if(c.last&&e.j3fzLast)e.j3fzLastOn=1;
  return e}}
function jwPost(c){J3W.cx=null;if(!c)return;const s0=c.s0,id=c.id,G=c.G;
  const did=c.CM?true:(P.cd[id]||0)>c.cd0+1e-9;if(!did)return;
  const L=Math.max(1,skLv(id));J3W.cx=c;const s=eff(id,L);J3W.cx=null;if(G)s.ghost=1;
  const pw=G?0:physPw(id,L,s)*(c.CM&&c.CM.mul||1),T=c.tg;
  switch(s0.kind){
    case'wall':jwWall(s,pw,T,c);break;
    case'throw':jwThrow(s,pw,T,c);break;
    case'mleap':jwMLeap(s,pw,T,c);break;
    case'sweep':jwSweep(s,pw,T,c);break;
    case'riders':jwRiders(s,pw,c);break;
    case'kingdom':jwKingdom(s,c);break;
    case'swap':jwSwap(s,c);break;
    case'counter':jwCounter(s,pw,T,c);break;
    case'gale':jwGale(s,pw,c);break;
    case'harvest':jwHarvest(s,c);break;
    case'homing':jwHoming(s,pw,T,c);break;
    case'sidestep':jwSidestep(s,pw,T,c);break;
    case'scatter':jwScatter(s,pw,T,c);break;
    case'stars':jwStars(s,pw,T,c);break;
    case'starfall':jwStarfall(s,pw,T,c);break;
    case'clones':jwClones(s,c);break}
  jwAfter(s,c,T);
  if(G)return;
  if(s0.j3fury)J3W.fz=0;
  if(s0.j3br&&P.job3==='divinearcher'){if(J3W.br>0)ftext(P.x,P.y-36,`호흡 ${J3W.br}`,'#bfe6ff',false,80);J3W.br=0;J3W.brT=0}
  if(id==='rampartbash')J3W.blkNext=0;
  // 바람 꿰기: 꿰뚫는 수 (호흡이 있으면 넷)
  if(s0.j3pmax)for(const p of projs.slice(c.nP))if(p.s&&p.s.id===id){p.hit=p.hit||new Set();p.pmax=c.br>0?s.j3pmaxBr:s.j3pmax}
  // 그림자 분신: 사격 · 덫 따라 하기
  const cl=J3W.cl;if(cl&&cl.t>0&&id!=='shadowclone'&&P.cls==='archer')jwCloneCopy(c,cl)}
// 종류와 상관없이 덧붙는 것 (그림 · 메시지)
function jwAfter(s,c,T){const id=c.id,own=jwOwn(c),G=c.G;
  if(id==='earthsplit'){const a=G?Math.atan2(T.y-c.oy,T.x-c.ox):P.face,x2=c.ox+Math.cos(a)*s.len,y2=c.oy+Math.sin(a)*s.len,pts=[];for(let i=0;i<=14;i++){const f=i/14;pts.push({x:c.ox+(x2-c.ox)*f+rnd(-14,14),y:c.oy+(y2-c.oy)*f+rnd(-14,14)})}
    decals.push({crack:pts,life:5,max:5,w:s.w*(1+(s.j3fzUsed||0)*.08)});for(let i=0;i<20;i++){const f=R();parts.push({x:c.ox+(x2-c.ox)*f,y:c.oy+(y2-c.oy)*f,z:0,vx:rnd(-40,40),vy:rnd(-40,40),vz:rnd(140,280),g:1,life:.8,max:.8,col:'#8a7350',sz:rnd(2.5,5.5)})}
    J3W.gfx.push({k:'lane',x1:c.ox,y1:c.oy,x2,y2,w:s.w*1.3,t:.6,max:.6,col:'#ffb070'});if(s.j3fzUsed)ftext(own.x,own.y-40,`투혼 ${s.j3fzUsed}`,'#ff8a5a',true,90);shake=Math.max(shake,6+(s.j3fzUsed||0)*.6);heroAtk(own,'slam',.4)}
  if(id==='bewall'){J3W.gfx.push({k:'aura',own,t:s.dur,max:s.dur,rad:s.j3wall.rad,col:'#d8c8a0'});if(!G&&NET.on)j3Send('wawall',{d:s.dur,sh:s.j3wall.share,rad:s.j3wall.rad})}
  if(id==='citadelecho')J3W.gfx.push({k:'aura',own,t:s.dur,max:s.dur,rad:120,col:'#bfe0ff'});
  if(id==='bloodoath'||id==='wardrum'){J3W.gfx.push({k:'pulse',own,t:1,max:1,rad:s.party,col:id==='wardrum'?'#ff8a4a':'#d8303a'});if(id==='wardrum')J3W.gfx.push({k:'drum',own,t:s.dur,max:s.dur})}
  if(id==='piercinggaze'&&!G)J3W.gfx.push({k:'gaze',own:P,t:s.dur,max:s.dur});
  if(id==='shadowhide'){J3W.gfx.push({k:'smoke',x:own.x,y:own.y,t:.8,max:.8});if(!G){for(const e of enemies){e.aggroed=false;if(e.tauntBy===P)e.tauntT=0}
      if(!NET.on||NET.host){for(const e of enemies)if(e.thr&&e.thr.has(0))e.thr.set(0,0)}else j3Send('wathr0',{},NET.hostId);if(NET.on)j3Send('wahide',{d:s.dur})}}
  if(id==='shadowstep'){J3W.gfx.push({k:'smoke',x:c.ox,y:c.oy,t:.7,max:.7});J3W.gfx.push({k:'smoke',x:own.x,y:own.y,t:.7,max:.7})}
  if(id==='drivehunt'){const p=clampRange(T,560);J3W.drives.push({x:p.x,y:p.y,t:s.j3drive.dur,max:s.j3drive.dur,rad:s.j3drive.rad,spd:s.j3drive.spd,G:!!G})}
  if(id==='nighthunt'){flash={col:'#1a1030',a:.3};if(!G)msg(`${s.n}: 어둠 속의 적은 빗나가고, 내 사냥은 더 아픕니다`,'#c8b0ff')}
  if(id==='earthanchor'){J3W.gfx.push({k:'anchor',x:c.tg.x,y:c.tg.y,t:.8,max:.8});shake=Math.max(shake,5)}
  if(id==='huntground')J3W.gfx.push({k:'pulse',x:c.tg.x,y:c.tg.y,t:.8,max:.8,rad:s.rad,col:'#9a7ae8'});
  if(id==='lordduel'||id==='provokemark'||id==='rampartbash')heroAtk(own,id==='rampartbash'?'bash':'thrust',.3)}
{const _tc=tryCast;tryCast=function(id,t){const s0=SPELLS[id];if(!s0||!s0.j3wa)return _tc(id,t);
  const c=jwPre(id,t);if(c===false)return;let r;try{r=_tc(id,c&&c.t||t)}finally{J3W.cx=null;try{jwPost(c)}catch(err){if(window.__QA)throw err}}return r}}
{const _cr=_castRelease;_castRelease=function(cu){const s0=cu&&SPELLS[cu.id];if(!s0||!s0.j3wa)return _cr(cu);const c=jwPre(cu.id,cu.tg);if(c===false)return;
  try{_cr(cu)}finally{J3W.cx=null;try{jwPost(c)}catch(err){if(window.__QA)throw err}}}}

/* ===== 종류별 ===== */
function jwWall(s,pw,T,c){const p0=clampRange(T,s.range||520),p=c.G?p0:landAt(P.x,P.y,p0.x,p0.y),a=Math.atan2(p.y-c.oy,p.x-c.ox)+1.5708,ux=Math.cos(a),uy=Math.sin(a),h=s.len/2;
  const w={x:p.x,y:p.y,ux,uy,h,th:24,t:s.dur,max:s.dur,g:!!c.G,brk:s.j3brk,age:0,seed:(R()*90)|0};J3W.walls.push(w);if(J3W.walls.length>8)J3W.walls.shift();
  shake=Math.max(shake,7);for(let i=-3;i<=3;i++){const x=p.x+ux*h*i/3,y=p.y+uy*h*i/3;burst(x,y,'#8a7350',7,150,3.5,6)}decal(p.x,p.y,s.len*.3,'earth');heroAtk(jwOwn(c),'slam',.35);
  if(c.G)return;const nx=-uy,ny=ux,sd=((c.ox-p.x)*nx+(c.oy-p.y)*ny)>0?-1:1;
  for(const e of enemies){if(e.dead)continue;const dx=e.x-p.x,dy=e.y-p.y,al=dx*ux+dy*uy,pe=dx*nx+dy*ny;if(Math.abs(al)>h+e.r||Math.abs(pe)>w.th+e.r+34)continue;
    hurtE(e,pw*rnd(.9,1.1),s);if(e.dead)continue;if(e.boss)breakAdd(e,s.j3brk*.25);applyFx(e,{knock:s.knock+Math.max(0,w.th+e.r-pe*sd)},{x:e.x-nx*sd*20,y:e.y-ny*sd*20})}}
function jwWallBreak(w,e){w.t=Math.min(w.t,0);e.stunT=Math.max(e.stunT||0,1);breakAdd(e,w.brk||40);shake=Math.max(shake,8);
  for(let i=-3;i<=3;i++)burst(w.x+w.ux*w.h*i/3,w.y+w.uy*w.h*i/3,'#8a7350',10,180,4,10);msg(`${TYPES[e.k].n}이(가) 바위 성벽을 부쉈습니다 — 잠깐 멈칫합니다`,'#d8c8a0');
  if(NET.on)j3Send('wawbrk',{x:Math.round(w.x),y:Math.round(w.y)})}
function jwWallPre(){if(!J3W.walls.length||NET.guest)return null;const L=[];for(const e of enemies){if(e.dead)continue;for(const w of J3W.walls){if(w.t<=0)continue;const dx=e.x-w.x,dy=e.y-w.y;
  if(Math.abs(dx*w.ux+dy*w.uy)<w.h+e.r+80&&Math.abs(-dx*w.uy+dy*w.ux)<w.th+e.r+90){L.push(e,e.x,e.y);break}}}return L}
function jwWallPost(L){if(L)for(let i=0;i<L.length;i+=3){const e=L[i],ox=L[i+1],oy=L[i+2];if(e.dead)continue;
  for(const w of J3W.walls){if(w.t<=0)continue;const nx=-w.uy,ny=w.ux,R0=w.th+e.r;
    const a0=(ox-w.x)*w.ux+(oy-w.y)*w.uy,p0=(ox-w.x)*nx+(oy-w.y)*ny,a1=(e.x-w.x)*w.ux+(e.y-w.y)*w.uy,p1=(e.x-w.x)*nx+(e.y-w.y)*ny;
    if(Math.abs(a1)>w.h+e.r*.6)continue;const cross=(p0>0)!==(p1>0)&&Math.abs(a0)<=w.h+e.r*.6,inside=Math.abs(p1)<R0;if(!cross&&!inside)continue;
    if(e.boss&&TYPES[e.k]&&(TYPES[e.k].boss||TYPES[e.k].mini)){if(cross||Math.abs(p1)<R0*.6)jwWallBreak(w,e);continue}
    const sd=p0>=0?1:-1;e.x=w.x+w.ux*a1+nx*sd*R0;e.y=w.y+w.uy*a1+ny*sd*R0;if(e.dash>0)e.dash=0}}
  // 날아오는 적의 투사체는 벽에 막힌다
  if(J3W.walls.length)for(const p of projs){if(p.owner==='p'||p.life<=0)continue;for(const w of J3W.walls){if(w.t<=0)continue;
    if(segDist(p.x,p.y,w.x-w.ux*w.h,w.y-w.uy*w.h,w.x+w.ux*w.h,w.y+w.uy*w.h)<w.th+(p.r||4)){p.life=0;burst(p.x,p.y,'#c8b89a',8,90,2.5,p.z||20);break}}}}
function jwThrow(s,pw,T,c){const a=Math.atan2(T.y-c.oy,T.x-c.ox),own=jwOwn(c);
  J3W.thr.push({x:c.ox+Math.cos(a)*18,y:c.oy+Math.sin(a)*18,sx:c.ox,sy:c.oy,a,d:18,range:s.range,spd:s.spd,w:s.w,s,pw,ph:0,h0:new Set(),h1:new Set(),own:c.G||null,fzN:0,arrow:s.cls==='archer',rot:0,life:5});
  heroAtk(own,s.cls==='archer'?'release':'swing',.3)}
function jwMLeap(s,pw,T,c){const o={x:c.ox,y:c.oy};const L=enemies.filter(e=>!e.dead&&dist(e,o)<s.range+80&&dist(e,T)<s.rad*3).sort((a,b)=>dist(a,T)-dist(b,T)).slice(0,s.num);const p=clampRange(T,s.range);
  for(let i=0;i<s.num;i++)J3W.leaps.push({at:time+i*s.iv,e:L.length?L[i%L.length]:null,x:p.x,y:p.y,s,pw,G:c.G||null,p:c.G?null:P})}
function jwSweep(s,pw,T,c){const a=Math.atan2(T.y-c.oy,T.x-c.ox);J3W.sweeps.push({x:c.ox-Math.cos(a)*60,y:c.oy-Math.sin(a)*60,a,ux:Math.cos(a),uy:Math.sin(a),d:0,len:s.len,w:s.w,spd:s.spd,s,pw,hit:new Set(),G:!!c.G});
  flash={col:'#cfe0ff',a:.25};shake=Math.max(shake,10);heroAtk(jwOwn(c),'shout',.5)}
function jwRiders(s,pw,c){const n=c.fz>=10?(s.numFull||6):s.num;if(c.G){J3W.gfx.push({k:'griders',own:c.G,t:s.dur,max:s.dur,n});return}
  for(const a of allies)if(a.j3r)a.gone=true;allies=allies.filter(a=>!a.gone);const hp=Math.round(maxHp()*s.hp*supScale(s.L||1));
  for(let i=0;i<n;i++){const an=i/n*6.283;const q=landAt(P.x,P.y,P.x+Math.cos(an)*80,P.y+Math.sin(an)*80);
    allies.push({ally:1,j3:1,j3r:1,x:q.x,y:q.y,hp,max:hp,r:22,dmg:pw,t:s.dur,s:Object.assign({},s,{kind:'summon',form:'rider',phys:0,j3nofz:1}),atkCd:.25+i*.12,anim:R()*3,fx:1,lunge:0,hurt:0,i,n})}
  rings.push({x:P.x,y:P.y,r:10,max:160,life:.7,col:'#bcd4ff'});burst(P.x,P.y,'#cfe0ff',40,200,3,30);msg(`${s.n}: 환영 기수 ${n}`,'#cfe0ff');heroAtk(P,'shout',.5)}
function jwKingdom(s,c){J3W.gfx.push({k:'dome',own:jwOwn(c),t:s.dur,max:s.dur,rad:s.rad});flash={col:'#ffe39a',a:.22};shake=Math.max(shake,6);heroAtk(jwOwn(c),'shout',.6);if(c.G)return;
  const n=j3PartyFloor(s.dur,s.rad,s.n);J3W.kg={t:s.dur,acc:0,h:s.heal,cap:s.cap,n:s.n};for(const r of j3Peers(s.rad))j3Send('wakg',{d:s.dur,h:s.heal,cap:s.cap,n:s.n},r.id);
  msg(`${s.n}: ${n?`나와 동료 ${n}명이`:'내가'} ${s.dur}초 동안 쓰러지지 않습니다`,'#ffe39a')}
function jwSwap(s,c){if(c.G)return;let r=null;if(NET.on&&typeof PTY==='object'&&PTY.pick){const R0=PTY.pick();if(R0.r&&!R0.r.dead&&netSame(R0.r)&&dist(R0.r,P)<=s.range)r=R0.r}
  if(!r&&NET.on){let lo=2;for(const q of j3Peers(s.range)){const f=(q.hp||0)/(q.max||1);if(f<lo){lo=f;r=q}}}
  const ox=P.x,oy=P.y;
  if(r){const p=landAt(P.x,P.y,r.x,r.y);P.x=p.x;P.y=p.y;P.invT=Math.max(P.invT,.4);followCam();j3Send('waswap',{x:Math.round(ox),y:Math.round(oy)},r.id);
    if(NET.host)jwThrMove(r.id,0);else j3Send('wathr',{of:r.id},NET.hostId);
    for(const e of enemies)if(!e.dead&&dist(e,P)<s.rad+e.r)applyFx(e,{taunt:s.taunt},P);
    J3W.gfx.push({k:'swap',x1:ox,y1:oy,x2:P.x,y2:P.y,t:.7,max:.7});msg(`${s.n}: ${r.name||'동료'}님과 자리를 바꾸고 위협을 넘겨받았습니다`,'#e8e4d8');return}
  const lt=clampRange(c.tg,s.leap),p=landAt(P.x,P.y,lt.x,lt.y);P.x=clamp(p.x,20,WORLD-20);P.y=clamp(p.y,20,WORLD-20);P.invT=Math.max(P.invT,.3);followCam(.05);
  FXP.leapFx(ox,oy,P.x,P.y,s,FXP.wtOf(P));heroAtk(P,'slam',.35);for(const e of enemies)if(!e.dead&&dist(e,P)<s.rad+e.r)applyFx(e,{taunt:s.taunt},P);
  rings.push({x:P.x,y:P.y,r:10,max:s.rad,life:.6,col:'#e8e4d8'});J3W.gfx.push({k:'swap',x1:ox,y1:oy,x2:P.x,y2:P.y,t:.5,max:.5})}
function jwCounter(s,pw,T,c){const a=c.G?Math.atan2(T.y-c.oy,T.x-c.ox):P.face,f=c.cf;
  const add=c.G?0:Math.min((J3W.store||0)*s.j3store.k,physPower()*s.j3store.cap*physBuffMul());J3W.store=0;
  J3W.gfx.push({k:'cone',x:c.ox,y:c.oy,a,rad:s.range*(1+.2*f),ang:s.ang,t:.5,max:.5,col:'#ffe9b0'});shake=Math.max(shake,6+6*f);flash={col:'#ffe9b0',a:.12+.12*f};heroAtk(jwOwn(c),'bash',.4);
  if(add>0)ftext(c.ox,c.oy-44,`되갚음 +${Math.round(add)}`,'#ffe9b0',true,90);if(c.G)return;
  for(const e of enemies){if(e.dead)continue;const d=dist(e,P);if(d<s.range+hR(e)&&angDiff(Math.atan2(e.y-P.y,e.x-P.x),a)<s.ang/2+Math.atan2(hR(e),Math.max(1,d))){hurtE(e,(pw+add)*rnd(.95,1.05),s);applyFx(e,s,P);if(e.boss)breakAdd(e,s.j3brk*(.5+f))}}}
function jwGale(s,pw,c){const f=c.cf,n=Math.round(s.num+(s.numMax-s.num)*f),a0=c.G?0:P.face,hc=new Map();
  for(let i=0;i<n;i++){const a=a0+i/n*6.283;J3W.waves.push({x:c.ox,y:c.oy,a,ux:Math.cos(a),uy:Math.sin(a),d:20,range:s.range,spd:820,s,pw,hc,hit:new Set(),G:!!c.G,w:30+12*f})}
  rings.push({x:c.ox,y:c.oy,r:10,max:s.range*.5,life:.45,col:'#ffd0b0'});shake=Math.max(shake,5+5*f);heroAtk(jwOwn(c),'spin',.45)}
function jwHarvest(s,c){const own=jwOwn(c);J3W.gfx.push({k:'pulse',own,t:.8,max:.8,rad:120,col:'#ff3a4a'});burst(own.x,own.y,'#ff4a5a',30,140,3,30);if(c.G)return;
  const fz=c.fz;if(fz<=0)return;const k=s.pct*(1+.02*((s.L||1)-1));healP(Math.round(maxHp()*k*fz));J3W.fz=0;msg(`${s.n}: 투혼 ${fz}로 생명력 ${Math.round(k*fz*100)}% 회복`,'#ff8a8a')}
function jwHoming(s,pw,T,c){const a=Math.atan2(T.y-c.oy,T.x-c.ox);const tg=r22First(T,220,s);
  J3W.hom.push({x:c.ox+Math.cos(a)*16,y:c.oy+Math.sin(a)*16,a,spd:s.spd,n:s.num,hit:new Set(),tg,life:4.5,s,pw,G:!!c.G,tr:[]});heroAtk(jwOwn(c),'release',.3)}
function jwSidestep(s,pw,T,c){const own=jwOwn(c);let a=Math.atan2(T.y-c.oy,T.x-c.ox);
  if(!c.G){const sd=(J3W.sd=-J3W.sd),ox=P.x,oy=P.y;let p=landAt(P.x,P.y,P.x+Math.cos(a+sd*1.5708)*s.range,P.y+Math.sin(a+sd*1.5708)*s.range);
    if(Math.hypot(p.x-ox,p.y-oy)<s.range*.4){const q=landAt(P.x,P.y,P.x-Math.cos(a+sd*1.5708)*s.range,P.y-Math.sin(a+sd*1.5708)*s.range);if(Math.hypot(q.x-ox,q.y-oy)>Math.hypot(p.x-ox,p.y-oy))p=q}
    P.x=clamp(p.x,20,WORLD-20);P.y=clamp(p.y,20,WORLD-20);P.invT=Math.max(P.invT,.2);followCam(.1);J3W.gfx.push({k:'dash',x1:ox,y1:oy,x2:P.x,y2:P.y,t:.35,max:.35});a=Math.atan2(T.y-P.y,T.x-P.x);P.face=a}
  const sx=own.x,sy=own.y,ss=Object.assign({},s,{kind:'bolt'});if(c.G)ss.ghost=1;
  for(let i=0;i<s.num;i++){const b=a+(i-(s.num-1)/2)*s.spread;projs.push({x:sx+Math.cos(b)*16,y:sy+Math.sin(b)*16,z:20,vx:Math.cos(b)*s.spd,vy:Math.sin(b)*s.spd,r:6,dmg:pw,owner:'p',s:ss,life:.8,col:'#cfe8ff',hit:null})}
  heroAtk(own,'release',.25)}
function jwScatter(s,pw,T,c){const own=jwOwn(c),a=Math.atan2(T.y-c.oy,T.x-c.ox),vs=Object.assign({},s,{kind:'bolt',ghost:1});
  for(let i=0;i<12;i++){const b=a+(i/11-.5)*s.ang;projs.push({x:c.ox+Math.cos(b)*14,y:c.oy+Math.sin(b)*14,z:20,vx:Math.cos(b)*1300,vy:Math.sin(b)*1300,r:5,dmg:0,owner:'p',s:vs,life:s.range/1300,col:'#e8f0ff',hit:null})}
  J3W.gfx.push({k:'cone',x:c.ox,y:c.oy,a,rad:s.range,ang:s.ang,t:.35,max:.35,col:'#d8ecff'});heroAtk(own,'volley',.3);shake=Math.max(shake,3);if(c.G)return;
  for(const e of enemies){if(e.dead)continue;const d=dist(e,P);if(d<s.range+hR(e)&&angDiff(Math.atan2(e.y-P.y,e.x-P.x),a)<s.ang/2+Math.atan2(hR(e),Math.max(1,d))){hurtE(e,pw*rnd(.9,1.1),s);applyFx(e,s,P)}}}
function jwStars(s,pw,T,c){const o={x:c.ox,y:c.oy},sc=e=>(TYPES[e.k]&&TYPES[e.k].boss?4e9:e.boss?3e9:e.elite?2e9:0)+e.hp;
  const L=enemies.filter(e=>!e.dead&&dist(e,o)<s.range).sort((a,b)=>sc(b)-sc(a)).slice(0,s.num);
  for(let i=0;i<s.num;i++){const e=L.length?L[i%L.length]:null,d=.3+i*.08;J3W.stars.push({e,x:e?e.x:T.x+rnd(-90,90),y:e?e.y:T.y+rnd(-90,90),t:d,max:d,s,pw,G:!!c.G,first:L.length?i<L.length:true})}
  flash={col:'#fff2b0',a:.15};heroAtk(jwOwn(c),'release',.35)}
function jwStarfall(s,pw,T,c){const f=c.cf,p=clampRange(T,s.range),rad=s.rad+(s.radMax-s.rad)*f;
  J3W.sfall.push({x:p.x,y:p.y,t:s.delay,max:s.delay,rad,pw,s,G:!!c.G,brk:s.j3brk+30*f,f});heroAtk(jwOwn(c),'release',.4)}
function jwClones(s,c){J3W.gfx.push({k:'clones',own:jwOwn(c),t:s.dur,max:s.dur});burst(jwOwn(c).x,jwOwn(c).y,'#8a6ad8',30,140,3,30);if(c.G)return;
  J3W.cl={t:s.dur,max:s.dur,shot:s.shotMul,trap:s.trapMul};msg(`${s.n}: 분신 둘이 ${s.dur}초 동안 사격과 덫을 따라 합니다`,'#c8b0ff')}
function jwCloneCopy(c,cl){const a=P.face,np=projs.slice(c.nP).filter(p=>p.owner==='p'&&!p.j3cl&&p.s&&!p.s.ghost),nt=traps.slice(c.nT).filter(q=>q.own===0&&!q.j3cl);
  for(const sd of [-1,1]){const ox=Math.cos(a+sd*1.5708)*55,oy=Math.sin(a+sd*1.5708)*55;
    for(const p of np){const q=Object.assign({},p,{x:p.x+ox,y:p.y+oy,dmg:p.dmg*cl.shot,hit:p.hit?new Set():null,tr:[],j3cl:1});projs.push(q)}
    for(const t of nt){const l=landAt(t.x,t.y,t.x+ox*1.6,t.y+oy*1.6);traps.push(Object.assign({},t,{x:l.x,y:l.y,dmg:t.dmg*cl.trap,id:t.id+'#cl',j3cl:1,age:0}))}}
  if(nt.length){const cls=traps.filter(q=>q.j3cl&&q.own===0);for(let i=0;i<cls.length-6;i++)cls[i].life=0;traps=traps.filter(q=>q.life>0)}
  if(np.length||nt.length)J3W.gfx.push({k:'cflash',own:P,t:.25,max:.25})}

/* ===== 맞힐 때 ===== */
let J3FT=null;
{const _ft=ftext;ftext=function(x,y,t,c,big,z){const q=J3FT;if(q&&!q.done&&typeof t==='number'){q.done=1;if(c==='#ffd34d'&&big){q.crit=1;if(q.cd>0){q.ex=Math.round(t*q.cd/1.75);t+=q.ex}}}return _ft(x,y,t,c,big,z)}}
{const _he=hurtE;hurtE=function(e,amt,s){
  if(!e||e.dead||!s||s.ghost||GHOST)return _he(e,amt,s);
  const own=!!s.cls&&s.cls===P.cls;let k=1,wk=0;
  if(own&&!s.proc){
    if(e.j3nm>0&&P.cls==='archer'){const bd=Math.min(.5,buffSum('dmg'));k*=(1+Math.min(.5,bd+.2))/(1+bd)}
    if(s.j3kill&&e.boss&&isBroken(e))k*=s.j3kill.mul;
    wk=e.j3wk>0?e.j3wkC||0:0}
  if(wk>0)P.buffs._j3wk={t:1,max:1,crit:wk,n:''};
  const cd=own?Math.min(.5,buffSum('critDmg')):0,q=J3FT={cd,done:0,crit:0,ex:0},h0=e.hp;
  try{_he(e,amt*k,s)}finally{J3FT=null;if(wk>0)delete P.buffs._j3wk}
  if(q.ex>0&&!e.dead){e.hp-=q.ex;if(NET.guest&&e.id)netDmg(e,q.ex,s,false);else if(e.hp<=0)killE(e)}
  const dealt=h0-e.hp;if(!(dealt>0)||!own||s.proc)return;
  // 전쟁군주: 투혼
  if(P.job3==='warlord'&&s.cls==='warrior'){if(!s.j3nofz&&!s.j3fzPer){const tok=s._tok||s;if(!J3W.fzGot.has(tok)){J3W.fzGot.add(tok);jwFz(1)}}
    if(s.j3fzLastOn&&!s._fl){s._fl=1;jwFz(s.j3fzLast||2);ftext(P.x,P.y-30,'투혼 +2','#ff8a5a',false,80)}}
  if(!s.j3nofz)J3W.lastTg=e;
  // 피의 맹세: 흡혈 (한 사람 1초에 최대 4%)
  let ls=0;for(const id in P.buffs){const b=P.buffs[id];if(b&&b.t>0&&b.j3ls)ls=Math.max(ls,b.j3ls)}
  if(ls>0&&!P.dead){if(time-J3W.lsT0>=1){J3W.lsT0=time;J3W.lsB=maxHp()*.04}const h=Math.min(dealt*ls,J3W.lsB);if(h>0){J3W.lsB-=h;P.hp=Math.min(maxHp(),P.hp+h)}}
  // 전쟁의 북: 동료가 맞히면 북을 친 전쟁군주의 투혼
  const dr=P.buffs.wardrum;if(dr&&dr.t>0&&dr.fzTo&&time-J3W.drumT>=1){J3W.drumT=time;j3Send('wafz',{},dr.fzTo)}
  // 무너짐 게이지
  if(e.boss&&!e.dead){
    if(s.kind==='trap'&&s.j3brk&&jwOnce(s,e))breakAdd(e,s.j3brk);
    if(s.j3blkOn&&s.j3blk&&jwOnce(s,e))breakAdd(e,s.j3blk.brk);
    if(s.j3fzUsed&&s.j3fury&&jwOnce(s,e))breakAdd(e,s.j3fzUsed*s.j3fury.brk);
    if(s.j3kill&&!isBroken(e)&&jwOnce(s,e))breakAdd(e,s.j3kill.brk)}
  // 표식 · 결투
  if(s.j3weak)jwWeak(e,s.j3weak.crit,s.j3weak.dur,true);
  if(s.j3prov)e.j3pv=Math.max(e.j3pv||0,s.j3prov);
  if(s.j3duel&&!e.dead){if(e.boss){if(NET.guest&&e.id){j3Send('waduel',{id:e.id,d:s.j3duel.dur},NET.hostId);e.j3duel={t:s.j3duel.dur,by:-1}}else jwDuelHost(e,0,s.j3duel.dur);ftext(e.x,e.y-30,'결투!','#ffe9a8',true,e.r*2+50)}}
  // 독 그림자: 덫에 걸린 적에게 독
  if(s.kind==='trap'&&P.cls==='archer'&&!e.dead){const pv=P.buffs.poisonshade;if(pv&&pv.t>0&&pv.j3venom){const V=pv.j3venom;e.j3ven={t:V.dur,iv:1,dps:dealt*V.mult,n:V.n,rad:V.rad}}}
  // 심연 덫: 끌어내리기
  if(s.j3abyss&&!e.dead){const A=s.j3abyss;s._abN=s._abN|0;if(e.boss||s._abN<A.n){if(!e.boss)s._abN++;jwSink(e,amt*A.mult,s)}}}}
function jwSink(e,dmg,s){e.j3sink={t:s.j3abyss.t,max:s.j3abyss.t,dmg,s:Object.assign({},s,{proc:1,j3abyss:0,kind:'trap',id:'abysstrap'})};applyFx(e,{stun:s.j3abyss.t},e);
  if(e.boss)breakAdd(e,s.j3abyss.brk);if(NET.on&&e.id)j3Send('wasink',{id:e.id,d:s.j3abyss.t});burst(e.x,e.y,'#3a2060',24,120,3,6)}
// 꿰뚫는 시선: 빗나가지 않음
{const _hc=hitChance;hitChance=function(e){if(!GHOST&&P&&P.buffs&&P.buffs.piercinggaze&&P.buffs.piercinggaze.t>0)return 1;return _hc(e)}}

/* ===== 맞을 때 ===== */
{const _hp=hitPlayer;hitPlayer=function(d,src,o){
  if(P.dead||P.invT>0||GHOST)return _hp(d,src,o);
  const lnk=!!(o&&o.lnk);
  // 밤의 사냥: 어둠 속의 적은 빗나간다
  if(src&&src.j3nT>0&&!lnk&&R()<(src.boss?SPELLS.nighthunt.j3night.bossMiss:SPELLS.nighthunt.j3night.miss)){ftext(P.x,P.y,'빗나감','#b8a8e8');return}
  // 성벽이 되리라: 범위 공격의 일부를 성벽의 군주가 대신
  if(J3W.aoe&&!lnk&&NET.on&&J3W.lords.size){for(const [id,L] of J3W.lords){if(!(L.t>0))continue;const r=NET.peers.get(id);if(!r||r.dead||!netSame(r)||dist(r,P)>L.rad)continue;
    const part=Math.round(d*L.sh);if(part>0){d-=part;j3Send('wawd',{d:part},id);J3W.gfx.push({k:'tether',a:P,b:r,t:.5,max:.5,col:'#e8d8a8'});ftext(P.x,P.y-20,'성벽이 막음','#e8d8a8',false,70)}break}}
  if(typeof J3CH!=='undefined'&&J3CH&&J3CH.id==='bulwarkcounter'&&J3CH.p===P)J3W.store+=d;
  const kg=J3W.kg;if(kg&&kg.t>0)kg.acc+=d;
  return _hp(d,src,o)}}
// 막을 때: 군주의 자세(마나) · 다음 성벽 강타 · 성채의 메아리
function jwOnBlock(){if(GHOST||P.dead)return;const m=passSum('blkMp');if(m>0)P.mp=Math.min(maxMp(),P.mp+m);
  if(P.job3==='bulwark')J3W.blkNext=1;
  const b=P.buffs.citadelecho;if(b&&b.t>0&&b.j3echo&&time-J3W.echoT>=b.j3echo.iv){J3W.echoT=time;const E=b.j3echo,amt=Math.round((physPower()*E.mult+E.flat)*supScale(b.L||1));
    jwShield(amt,E.dur);let n=0;for(const r of j3Peers(E.rad)){j3Send('waesh',{a:amt,d:E.dur},r.id);n++}rings.push({x:P.x,y:P.y,r:10,max:E.rad,life:.5,col:'#bfe0ff'});
    if(n)ftext(P.x,P.y-40,`메아리 ×${n+1}`,'#bfe0ff',false,80)}}
{const _bl=PTY.block;PTY.block=function(src){const r=_bl.apply(this,arguments);try{jwOnBlock(src)}catch(err){if(window.__QA)throw err}return r}}
// 같이 하기: 범위 공격 표시 (경고 뒤 내려찍기 · 폭발)
{const _uw=updateWarns;updateWarns=function(dt){J3W.aoe=1;try{return _uw(dt)}finally{J3W.aoe=0}}}
{const _ns=netSend;netSend=function(o){if(o){if(o.t==='cast'&&!GHOST&&SPELLS[o.sp]&&SPELLS[o.sp].j3wa){if(P.job3==='warlord'&&J3W.fz)o.fz=J3W.fz;if(P.job3==='divinearcher'&&J3W.br)o.br=J3W.br;if(CAST_MOD&&CAST_MOD.charge!=null)o.cf=Math.round(CAST_MOD.charge*100)/100}
  if(o.t==='hit'&&J3W.aoe)o.ae=1}return _ns(o)}}
{const _nm=netOnMsg;netOnMsg=function(m){if(m&&m.t==='hit'&&m.ae){J3W.aoe=1;try{return _nm(m)}finally{J3W.aoe=0}}return _nm(m)}}
{const _ng=netGhostCast;netGhostCast=function(m){const s0=m&&SPELLS[m.sp];if(!s0||!s0.j3wa)return _ng(m);J3W.gx={fz:m.fz|0,br:m.br|0,cf:+m.cf||0};try{return _ng(m)}finally{J3W.gx=null}}}
// 위협: 밤 속 파티원은 절반 · 숨은 나는 0 / 결투: 무너짐 게이지 +50%, 다른 파티원의 피해도 게이지로
{const _t=PTY.thr;PTY.thr=function(e,k,v){if(v>0&&k!=null){if(k===0&&jwHideOn())v=0;else if(fields.length&&jwInNight(this.who(k)))v*=SPELLS.nighthunt.j3night.thr}return _t.call(this,e,k,v)}}
{const _st=PTY.stag;PTY.stag=function(e,amt,why){if(e&&e.j3duel&&e.j3duel.t>0&&amt>0)amt*=1+SPELLS.lordduel.j3duel.amp;return _st.call(this,e,amt,why)}}
{const _od=PTY.onDmg;PTY.onDmg=function(e,k,d,s){const r=_od.apply(this,arguments);const D=e&&e.j3duel;if(D&&D.t>0&&k!==D.by&&d>0&&e.max>0&&!NET.guest&&!e.dead)this.stag(e,d/e.max*200,'duel');return r}}
// 숨기: 적이 나를 놓친다 (방장은 숨은 동료도)
{const _et=enemyTarget;enemyTarget=function(e){const r=_et(e),tg=r&&r.tg;const hidMe=tg===P&&jwHideOn(),hidR=tg&&tg.remote&&(J3W.hid.get(tg.id)||0)>time;if(!hidMe&&!hidR)return r;
  let b=null,bd=1e9;if(!hidMe&&!P.dead){b=P;bd=dist(e,P)}if(NET.host)for(const q of NET.peers.values()){if(q===tg||q.dead||!netSame(q)||(J3W.hid.get(q.id)||0)>time)continue;const d=dist(e,q);if(d<bd){bd=d;b=q}}
  for(const a of allies){const d=dist(e,a);if(d<bd){bd=d;b=a}}return b?{tg:b,d:bd}:{tg:P,d:1e9}}}
// 강화: 3차 칸을 담는다 (내 시전 · 동료의 파티 강화 둘 다)
{const _sf=supFx;supFx=function(s,id,pwr,from){const r=_sf(s,id,pwr,from);if(s&&s.j3wa&&s.kind==='buff'&&P.buffs[id]){const b=P.buffs[id];for(const k of J3WBX)if(s[k]!=null)b[k]=s[k];
  if(s.j3drum)b.fzTo=from&&from.id?from.id:0;b.L=b.L||s.L||1;if(from&&s.party)J3W.gfx.push({k:'pulse',own:P,t:.6,max:.6,rad:70,col:s.j3drum?'#ff8a4a':'#d8303a'})}return r}}
// 표시: 파티(주변) · 한 명 · 자신만
const J3W_RULE={
  bewall:s=>({party:true,mode:'area',how:'cover',r:s.j3wall.rad,short:`파티(주변) · 둘레 ${s.j3wall.rad}`,text:`${s.dur}초 동안 내 둘레 ${s.j3wall.rad} 안의 동료가 받는 범위 공격 피해의 ${Math.round(s.j3wall.share*100)}%를 내가 대신 받습니다`}),
  citadelecho:s=>({party:true,mode:'area',how:'block',r:s.j3echo.rad,short:`파티(주변) · 둘레 ${s.j3echo.rad}`,text:`막을 때마다 나와 둘레 ${s.j3echo.rad} 안의 동료에게 작은 보호막`}),
  unfallenkingdom:s=>({party:true,mode:'area',how:'radius',r:s.rad,short:`파티(주변) · 둘레 ${s.rad}`,text:`나와, 시전할 때 내 둘레 ${s.rad} 안의 동료 모두 ${s.dur}초 동안 쓰러지지 않습니다`}),
  fortressswap:s=>({party:false,one:true,mode:'one',how:'one',r:s.range,short:`한 명 · 고른 동료 (${s.range} 안)`,text:'고른 동료(없으면 생명력이 가장 낮은 동료)와 자리를 바꾸고 위협을 넘겨받습니다. 혼자면 뛰어듭니다'}),
  earthanchor:s=>({party:true,mode:'area',how:'zone',r:s.rad,short:'파티(주변) · 지대 안',text:`내 둘레 반경 ${s.rad}의 지대 안에 있는 동료는 밀려나거나 끌려가지 않습니다`}),
  nighthunt:s=>({party:true,mode:'area',how:'zone',r:s.rad,short:'파티(주변) · 지대 안',text:`밤(반경 ${s.rad}) 안의 적은 공격이 빗나가고, 그 안의 동료는 위협을 절반만 쌓습니다`}),
  exposeweak:s=>({party:true,mode:'area',how:'mark',r:0,short:'파티 공용 표식',text:'표식이 붙은 적에게는 모든 파티원의 치명타 확률이 오릅니다'}),
  bloodharvest:()=>({party:false,mode:'self',how:'self',r:0,short:'자신만',text:'자신에게만 걸립니다 (동료에게는 걸리지 않음)'})};
{const _r=PUI.rule;PUI.rule=function(s){if(s&&s.j3wa&&J3W_RULE[s.id])return J3W_RULE[s.id](s);return _r.call(this,s)}}
// 수치표: 3차 기술 몇 줄
{const _na=numsAt;numsAt=function(id,L){const out=_na(id,L),s0=SPELLS[id];if(!s0||!s0.j3wa)return out;jwKindN();const s=eff(id,L);
  if(s.kind==='wall')out.push(['벽',`길이 ${s.len} · ${s.dur}초`]);if(s.j3fury)out.push(['투혼 하나마다',`길이 +${s.j3fury.len} · 피해 +${s.j3fury.mult}배`]);
  if(s.j3br)out.push(['호흡 하나마다','피해 +8%']);if(s.kind==='kingdom')out.push(['끝날 때 회복',`받은 피해의 ${Math.round(s.heal*100)}% (최대 ${Math.round(s.cap*100)}%)`]);
  if(s.j3store)out.push(['모으는 동안','받는 피해 -50%']);if(s.kind==='riders')out.push(['기수',`${s.num} (투혼 10이면 ${s.numFull})`]);if(s.kind==='stars')out.push(['화살',`${s.num}`]);
  if(s.kind==='harvest')out.push(['투혼 하나마다',`생명력 ${Math.round(s.pct*(1+.02*((s.L||1)-1))*1000)/10}%`]);if(s.j3night)out.push(['빗나감',`${Math.round(s.j3night.miss*100)}% (보스 ${Math.round(s.j3night.bossMiss*100)}%)`]);
  return out}}
{const _dh=detailHtml;detailHtml=function(id){jwKindN();return _dh(id)}}

/* ===== 매 프레임 ===== */
function jwTick(dt){const host=!NET.guest;
  // 투혼 · 호흡
  if(P.job3==='warlord'&&J3W.fz>0&&!P.dead){J3W.fzT-=dt;if(J3W.fzT<=0){J3W.fzD+=dt;if(J3W.fzD>=1){J3W.fzD=0;J3W.fz--}}}
  if(P.job3==='divinearcher'&&!P.dead){if(P.moving){if(J3W.br>0)burst(P.x,P.y,'#bfe6ff',6,60,2,40);J3W.br=0;J3W.brT=0}else{J3W.brT+=dt;while(J3W.brT>=.5){J3W.brT-=.5;if(J3W.br<5){J3W.br++;if(J3W.br===5)rings.push({x:P.x,y:P.y,r:6,max:50,life:.4,col:'#bfe6ff'})}}}
    const bc=passSum('breathCrit')*J3W.br;if(bc>0)P.buffs._j3br={t:.5,max:.5,crit:bc,n:''};else delete P.buffs._j3br}else if(P.buffs._j3br)delete P.buffs._j3br;
  if(P.buffs._j3ctr&&!(typeof J3CH!=='undefined'&&J3CH&&J3CH.id==='bulwarkcounter'&&J3CH.p===P))delete P.buffs._j3ctr;
  // 무너지지 않는 왕국: 끝날 때 회복
  const kg=J3W.kg;if(kg){kg.t-=dt;if(kg.t<=0){J3W.kg=null;if(!P.dead){const h=Math.min(kg.acc*kg.h,maxHp()*kg.cap);if(h>=1){healP(Math.round(h));rings.push({x:P.x,y:P.y,r:10,max:140,life:.8,col:'#ffe39a'});burst(P.x,P.y,'#fff2c0',40,160,3,30);msg(`${kg.n||'왕국'}: 받아 낸 피해로 생명력 ${Math.round(h)} 회복`,'#ffe39a')}}}}
  if(J3W.cl){J3W.cl.t-=dt;if(J3W.cl.t<=0)J3W.cl=null}
  for(const [id,L] of J3W.lords){L.t-=dt;if(L.t<=0)J3W.lords.delete(id)}
  // 처단의 도약
  if(J3W.leaps.length){const due=J3W.leaps.filter(o=>o.at<=time);J3W.leaps=J3W.leaps.filter(o=>o.at>time&&(o.G||o.p===P));for(const o of due)jwLeapLand(o)}
  // 땅의 것들: 벽 · 지대 (경계 · 고정 · 밤) · 몰이
  for(const w of J3W.walls){w.t-=dt;w.age+=dt}if(J3W.walls.length)J3W.walls=J3W.walls.filter(w=>w.t>-.5);
  P.j3anc=Math.max(0,(P.j3anc||0)-dt);
  for(const f of fields){const s=f.s;if(!s.j3wa)continue;
    if(s.j3anchor){if(!P.dead&&dist(P,f)<f.rad){P.j3anc=.25;if(typeof PTY==='object'&&PTY.pull)PTY.pull=null}
      if(host)for(const e of enemies)if(!e.dead&&e.dash>0&&dist(e,f)<f.rad+e.r){e.dash=0;burst(e.x,e.y,'#c8b89a',8,80,2.5,10)}}
    if(s.j3ring&&host)for(const e of enemies){if(e.dead)continue;const d=dist(e,f);if(d<f.rad-e.r){e.j3rf=f;continue}if(e.j3rf!==f||d>f.rad+e.r+200)continue;
      const k=(f.rad-e.r-14)/(d||1);e.x=f.x+(e.x-f.x)*k;e.y=f.y+(e.y-f.y)*k;if(e.dash>0)e.dash=0;
      if(!((e.j3rbT||0)>time)){if(e.boss){e.j3rbT=time+3;breakAdd(e,s.j3brk)}else{e.j3rbT=time+1.2;e.stunT=Math.max(e.stunT||0,1)}rings.push({x:e.x,y:e.y,r:6,max:50,life:.35,col:'#9a7ae8'});burst(e.x,e.y,'#9a7ae8',10,100,2.5,14)}}
    if(s.j3night){const me=!s.ghost;for(const e of enemies){if(e.dead||dist(e,f)>=f.rad+hR(e))continue;e.j3nT=.3;if(me)e.j3nm=.3}
      if(me&&typeof DG==='object'&&DG&&DG.j3t&&DG.j3t.g==='beast')DG.j3t.nightT=Math.max(DG.j3t.nightT||0,.3)}}
  for(const v of J3W.drives){v.t-=dt;if(host)for(const e of enemies){if(e.dead||e.boss||(TYPES[e.k]&&(TYPES[e.k].boss||TYPES[e.k].mini)))continue;const d=dist(e,v);if(d>v.rad||d<46)continue;moveBody(e,(v.x-e.x)/d*v.spd*dt,(v.y-e.y)/d*v.spd*dt);e.aggroed=true}}
  if(J3W.drives.length)J3W.drives=J3W.drives.filter(v=>v.t>0);
  // 던진 무기 · 되돌아오는 화살
  for(const th of J3W.thr){th.life-=dt;th.rot+=dt*18;const px=th.x,py=th.y;
    if(th.ph===0){th.d+=th.spd*dt;th.x=th.sx+Math.cos(th.a)*th.d;th.y=th.sy+Math.sin(th.a)*th.d;if(th.d>=th.range||(DG&&!dgFree(th.x,th.y,2)))th.ph=1}
    else{const o=th.own||P,d=dist(th,o);if(d<34||!o){th.life=0;continue}const v=th.spd*1.15*dt;th.x+=(o.x-th.x)/d*Math.min(v,d);th.y+=(o.y-th.y)/d*Math.min(v,d)}
    const H=th.ph?th.h1:th.h0;for(const e of enemies){if(e.dead||H.has(e))continue;if(segDist(e.x,e.y,px,py,th.x,th.y)<th.w+hR(e)){H.add(e);burst(e.x,e.y,'#fff4d0',8,110,2.5,20);
      if(!th.own){const h0=e.hp;hurtE(e,th.pw*rnd(.9,1.1),th.s);applyFx(e,th.s,{x:px,y:py});if(th.s.j3fzPer&&h0>e.hp&&th.fzN<th.s.j3fzMax){th.fzN++;jwFz(th.s.j3fzPer)}}}}}
  if(J3W.thr.length)J3W.thr=J3W.thr.filter(t=>t.life>0);
  // 천군의 돌격
  for(const w of J3W.sweeps){w.d+=w.spd*dt;const nx=-w.uy,ny=w.ux;
    for(const e of enemies){if(e.dead||w.hit.has(e))continue;const dx=e.x-w.x,dy=e.y-w.y,al=dx*w.ux+dy*w.uy,pe=Math.abs(dx*nx+dy*ny);if(al>w.d||al<w.d-260||al<-30||al>w.len||pe>w.w+hR(e))continue;
      w.hit.add(e);if(w.G)continue;hurtE(e,w.pw*rnd(.95,1.05),w.s);applyFx(e,{knock:w.s.knock},{x:e.x-w.ux*12,y:e.y-w.uy*12});if(e.boss)breakAdd(e,w.s.j3brk);FXP.hitSpark(e.x,e.y,'#e8f0ff',8)}
    if(R()<.6)burst(w.x+w.ux*w.d+nx*rnd(-w.w,w.w),w.y+w.uy*w.d+ny*rnd(-w.w,w.w),'#c8d8ff',3,80,2.5,6)}
  if(J3W.sweeps.length)J3W.sweeps=J3W.sweeps.filter(w=>w.d<w.len+300);
  // 군주의 칼바람: 검기
  for(const v of J3W.waves){const ox=v.x+v.ux*v.d,oy=v.y+v.uy*v.d;v.d+=v.spd*dt;const x=v.x+v.ux*v.d,y=v.y+v.uy*v.d;
    if(!v.G)for(const e of enemies){if(e.dead||v.hit.has(e)||(v.hc.get(e)||0)>=2)continue;if(segDist(e.x,e.y,ox,oy,x,y)<v.w+hR(e)){v.hit.add(e);v.hc.set(e,(v.hc.get(e)||0)+1);hurtE(e,v.pw*rnd(.9,1.1),v.s);applyFx(e,v.s,{x:ox,y:oy});if(e.boss)breakAdd(e,v.s.j3brk)}}}
  if(J3W.waves.length)J3W.waves=J3W.waves.filter(v=>v.d<v.range);
  // 휘는 마탄
  for(const h of J3W.hom){h.life-=dt;if(!h.tg||h.tg.dead){let b=null,bd=h.s.range;for(const e of enemies){if(e.dead||h.hit.has(e))continue;const d=dist(e,h);if(d<bd){bd=d;b=e}}h.tg=b;if(!b&&h.hit.size)h.life=Math.min(h.life,.25)}
    if(h.tg){const want=Math.atan2(h.tg.y-h.y,h.tg.x-h.x);let d=want-h.a;while(d>Math.PI)d-=6.283;while(d<-Math.PI)d+=6.283;const k=dist(h,h.tg)<200?40:9;h.a+=clamp(d,-k*dt,k*dt)}
    h.x+=Math.cos(h.a)*h.spd*dt;h.y+=Math.sin(h.a)*h.spd*dt;h.tr.push(h.x,h.y);if(h.tr.length>24)h.tr.splice(0,2);
    if(h.tg&&dist(h,h.tg)<hR(h.tg)+10){const e=h.tg;h.hit.add(e);h.tg=null;h.n--;burst(e.x,e.y,'#ffe9a8',12,140,3,20);if(!h.G){hurtE(e,h.pw*rnd(.95,1.05),h.s);applyFx(e,h.s,h)}if(h.n<=0)h.life=0}}
  if(J3W.hom.length)J3W.hom=J3W.hom.filter(h=>h.life>0);
  // 일곱 별 · 별 떨구기
  for(const o of J3W.stars){o.t-=dt;if(o.e&&!o.e.dead){o.x=o.e.x;o.y=o.e.y}if(o.t>0)continue;o.done=1;rings.push({x:o.x,y:o.y,r:8,max:90,life:.4,col:'#ffe9a8'});burst(o.x,o.y,'#fff2c0',22,200,3.5,30);
    if(!o.G&&o.e&&!o.e.dead){hurtE(o.e,o.pw*rnd(.95,1.05),o.s);applyFx(o.e,o.s,{x:o.x,y:o.y-1});if(o.e.boss)breakAdd(o.e,o.s.j3brk*(o.first?1:.35))}}
  if(J3W.stars.length)J3W.stars=J3W.stars.filter(o=>!o.done);
  for(const o of J3W.sfall){o.t-=dt;if(o.t>0)continue;o.done=1;shake=reduceMotion?0:Math.min(18,8+o.rad/40);flash={col:'#fff2b0',a:.32};
    for(let i=1;i<=3;i++)rings.push({x:o.x,y:o.y,r:10,max:o.rad*(.45+i*.2),life:.35+i*.15,col:i===3?'#ffe9a8':'#fff6d8'});burst(o.x,o.y,'#fff2c0',70,o.rad*2.2,5,20);burst(o.x,o.y,'#ffb84a',40,o.rad*1.4,4,10);decal(o.x,o.y,o.rad*.7,'holy');
    J3W.gfx.push({k:'crater',x:o.x,y:o.y,rad:o.rad,t:1.2,max:1.2});
    if(!o.G)for(const e of enemies)if(!e.dead&&dist(e,o)<o.rad+hR(e)){hurtE(e,o.pw*rnd(.95,1.05),o.s);applyFx(e,o.s,o);if(e.boss)breakAdd(e,o.brk)}}
  if(J3W.sfall.length)J3W.sfall=J3W.sfall.filter(o=>!o.done);
  // 적 상태: 약점 · 도발 표식 · 결투 · 밤 · 독 · 끌어내리기
  for(const e of enemies){if(e.dead)continue;
    if(e.j3wk>0)e.j3wk-=dt;if(e.j3pv>0)e.j3pv-=dt;if(e.j3nT>0)e.j3nT-=dt;if(e.j3nm>0)e.j3nm-=dt;if(e.j3duel){e.j3duel.t-=dt;if(e.j3duel.t<=0)e.j3duel=null}
    const v=e.j3ven;if(v){v.t-=dt;v.iv-=dt;if(v.iv<=0){v.iv=1;hurtE(e,v.dps,J3W_VEN);rise(e.x,e.y,'#8ad04a',20);let n=0;
        for(const o of enemies){if(o===e||o.dead||o.j3ven||dist(o,e)>v.rad+o.r)continue;o.j3ven={t:Math.max(1,v.t),iv:1,dps:v.dps,n:v.n,rad:v.rad};burst(o.x,o.y,'#8ad04a',6,70,2.5,14);if(++n>=v.n)break}}
      if(v.t<=0||e.dead)e.j3ven=null}
    const k=e.j3sink;if(k){k.t-=dt;if(host)e.stunT=Math.max(e.stunT||0,Math.min(.2,k.t));if(k.t<=0){e.j3sink=null;rings.push({x:e.x,y:e.y,r:8,max:110,life:.45,col:'#9a7ae8'});burst(e.x,e.y,'#b89aff',26,180,3.5,20);shake=Math.max(shake,5);hurtE(e,k.dmg*rnd(.95,1.05),k.s)}}}
  // 숨긴 동료 표 정리
  if(J3W.hid.size)for(const [id,t] of J3W.hid)if(t<time)J3W.hid.delete(id);
  for(const g of J3W.gfx)g.t-=dt;if(J3W.gfx.length)J3W.gfx=J3W.gfx.filter(g=>g.t>0)}
function jwLeapLand(o){const s=o.s;let x=o.x,y=o.y;const e=o.e&&!o.e.dead?o.e:null;
  if(!o.G){if(P.dead)return;if(e){const a=Math.atan2(e.y-P.y,e.x-P.x),d=e.r+P.r+6;x=e.x-Math.cos(a)*d;y=e.y-Math.sin(a)*d}
    const ox=P.x,oy=P.y,p=landAt(ox,oy,x,y);P.x=clamp(p.x,20,WORLD-20);P.y=clamp(p.y,20,WORLD-20);P.invT=Math.max(P.invT,.3);followCam(.05);if(e)P.face=Math.atan2(e.y-P.y,e.x-P.x);
    FXP.leapFx(ox,oy,P.x,P.y,s,FXP.wtOf(P));heroAtk(P,'slam',.3);x=P.x;y=P.y}
  else if(e){x=e.x;y=e.y}
  decal(x,y,s.rad*.5,'earth');rings.push({x,y,r:10,max:s.rad,life:.4,col:'#ffb070'});burst(x,y,'#c9a46a',24,s.rad*1.6,4,8);shake=Math.max(shake,6);
  if(o.G)return;for(const q of enemies)if(!q.dead&&dist(q,P)<s.rad+q.r){hurtE(q,o.pw*rnd(.9,1.1),s);applyFx(q,s,P);if(q.boss)breakAdd(q,s.j3brk)}}
// 환영 기수
function jwRiderTick(a,dt){a.t-=dt;a.anim+=dt;a.atkCd-=dt;a.hurt-=dt;a.lunge=Math.max(0,a.lunge-dt);
  let tg=J3W.lastTg&&!J3W.lastTg.dead&&dist(J3W.lastTg,P)<760&&enemies.includes(J3W.lastTg)?J3W.lastTg:null;if(!tg){let bd=560;for(const e of enemies){if(e.dead)continue;const d=dist(e,a);if(d<bd){bd=d;tg=e}}}
  let mx=0,my=0;const sp=290;
  if(tg){const d=dist(tg,a)||1,an=a.i/(a.n||4)*6.283+time*.6,gx=tg.x+Math.cos(an)*(tg.r+a.r+10),gy=tg.y+Math.sin(an)*(tg.r+a.r+10),gd=Math.hypot(gx-a.x,gy-a.y);
    if(gd>8){mx=(gx-a.x)/gd;my=(gy-a.y)/gd}a.fx=(tg.x-a.x)-(tg.y-a.y)>=0?1:-1;
    if(d<a.r+tg.r+30&&a.atkCd<=0){a.atkCd=.8;a.lunge=.22;hurtE(tg,a.dmg*rnd(.9,1.1),a.s);applyFx(tg,{knock:12},a);FXP.hitSpark(tg.x,tg.y,'#e8f0ff',6)}}
  else{const an=a.i/(a.n||4)*6.283+time*.8,gx=P.x+Math.cos(an)*90,gy=P.y+Math.sin(an)*90,gd=Math.hypot(gx-a.x,gy-a.y);if(gd>10){mx=(gx-a.x)/gd;my=(gy-a.y)/gd;a.fx=(gx-a.x)-(gy-a.y)>=0?1:-1}}
  const k=Math.min(1,(tg?dist(tg,a):200)/80+.35);a.x+=mx*sp*k*dt;a.y+=my*sp*k*dt;
  if(a.hp<=0||a.t<=0){a.gone=true;burst(a.x,a.y,'#cfe0ff',24,140,3,20)}}
{const _ua=updateAllies;updateAllies=function(dt){if(!allies.some(a=>a.j3r))return _ua(dt);const mine=allies.filter(a=>a.j3r);allies=allies.filter(a=>!a.j3r);
  try{_ua(dt)}finally{for(const a of mine)jwRiderTick(a,dt);allies=allies.concat(mine.filter(a=>!a.gone))}}}
{const _u=update;update=function(dt){jwUnhold();const L=jwWallPre();_u(dt);try{jwWallPost(L);if(!paused)jwTick(dt)}catch(err){if(window.__QA)throw err}}}

/* ===== 그리기 ===== */
// 내 지대(밤 · 고정 · 경계)는 기본 지대 그림(흰 원판 · 빛)을 쓰지 않고 따로 그린다: 그리는 동안만 목록에서 잠깐 빼 두었다가 render가 끝나면 되돌린다
const jwZone=f=>!!(f&&f.s&&f.s.j3wa&&(f.s.j3night||f.s.j3anchor||f.s.j3ring));
function jwHold(){if(J3W.hold)return;if(!fields.some(jwZone))return;J3W.hold=fields.filter(jwZone);fields=fields.filter(f=>!jwZone(f))}
function jwUnhold(){const h=J3W.hold;if(!h)return;J3W.hold=null;fields=h.concat(fields)}
const jwFields=()=>J3W.hold?J3W.hold.concat(fields):fields;
{const _dd=drawDecalsFields;drawDecalsFields=function(){jwHold();return _dd.apply(this,arguments)}}
{const _rn=render;render=function(){try{return _rn.apply(this,arguments)}finally{jwUnhold()}}}
function jwRiderDraw(c,x,y,fx,k,a){const sp=JS.rider(((time*8+(a||0))|0)%2);c.save();c.translate(x,y);c.scale((fx<0?-1:1)*k,k);c.globalCompositeOperation='lighter';c.globalAlpha=.85;c.drawImage(sp,-46,-70);c.restore()}
{const _da=drawAlly;drawAlly=function(a){if(!a.j3r)return _da(a);const s=a._s;if(!s||!onScreen(s,100))return;Kit.shadow(ctx,s.x,s.y,22,7,.5);
  jwRiderDraw(ctx,s.x+(a.lunge>0?a.fx*6:0),s.y,a.fx||1,.95,a.i*3);const w=30,y=s.y-78;ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,5);ctx.fillStyle='#8fb8ff';ctx.fillRect(s.x-w/2,y,w*clamp(a.hp/a.max,0,1),3)}}
{const _de=drawEnemy;drawEnemy=function(e){const k=e.j3sink,v=e.j3sV>time;if(!k&&!v)return _de(e);const f=k?1-Math.abs(k.t/k.max*2-1):clamp((e.j3sV-time)/2,0,1)*.8,s=e._s,y0=s.y;
  const vx=JS.vortex();ctx.save();ctx.globalAlpha=.9;ctx.drawImage(vx,s.x-60*(1+f*.4),s.y-30*(1+f*.4),120*(1+f*.4),60*(1+f*.4));ctx.restore();
  s.y=y0+f*34;ctx.save();ctx.globalAlpha=1-f*.6;try{_de(e)}finally{ctx.restore();s.y=y0}}}
{const _dh=drawHero;drawHero=function(){if(!jwHideOn())return _dh.apply(this,arguments);const a=ctx.globalAlpha;ctx.globalAlpha=a*.4;try{return _dh.apply(this,arguments)}finally{ctx.globalAlpha=a}}}
// 땅(몸보다 먼저, 화면 좌표): 바위 벽 · 밤 · 내 덫
{const _fg=FXP.ground;FXP.ground=function(c,map,now){_fg.call(this,c,map,now);try{jwGround(c,map)}catch(err){if(window.__QA)throw err}}}
function jwGround(c,map){
  for(const f of jwFields()){const S0=f.s;if(!S0.j3wa||!(S0.j3night||S0.j3anchor||S0.j3ring))continue;const s=map(f.x,f.y),fade=Math.min(1,f.t*2,(f.max-f.t)*3),rx=f.rad*KI*1.414,ry=rx/2;c.globalAlpha=fade;c.drawImage(S0.j3night?JS.dark():JS.zone(S0.j3anchor?'a':'r'),s.x-rx,s.y-ry,rx*2,ry*2)}
  for(const w of J3W.walls){const n=Math.max(4,Math.round(w.h*2/46)),up=clamp(w.age/.22,0,1)*clamp((w.t+.5)/.5,0,1),pts=[];
    for(let i=0;i<n;i++){const f=(i+.5)/n*2-1;pts.push([map(w.x+w.ux*w.h*f,w.y+w.uy*w.h*f),i])}pts.sort((a,b)=>a[0].y-b[0].y);
    Kit.shadow(c,(pts[0][0].x+pts[pts.length-1][0].x)/2,(pts[0][0].y+pts[pts.length-1][0].y)/2+4,Math.abs(pts[0][0].x-pts[pts.length-1][0].x)/2+30,Math.abs(pts[0][0].y-pts[pts.length-1][0].y)/2+14,.7*up);
    for(const [p,i] of pts){const k=1.2+((w.seed+i*7)%5)*.06;c.globalAlpha=Math.min(1,up*1.4);c.drawImage(JS.rock((w.seed+i)%5),p.x-30*k,p.y-44*k*up,60*k,52*k*up);
      const k2=k*.8;c.drawImage(JS.rock((w.seed+i+2)%5),p.x-30*k2+((i&1)?6:-6),p.y-(44*k+26*k2)*up,60*k2,52*k2*up)}}
  c.globalAlpha=1}
{const _dt=FXP.drawTrap;FXP.drawTrap=function(c,tr,map,now){const id=tr&&tr.s&&tr.s.id;if(id!=='shadowtrap'&&id!=='abysstrap')return _dt.call(this,c,tr,map,now);
  const on=tr.age!=null?tr.age>=tr.arm:true,p=map(tr.x,tr.y),life=tr.life!=null?tr.life:9,dim=tr.own===0&&!GHOST&&skLv('darkhunter')>0?.45:1,sp=id==='abysstrap'?JS.pit(on?1:0):JS.snare(on?1:0),k=Math.max(1,Math.min(1.8,(tr.s.rad||160)/120))*(tr.j3cl?.85:1);
  c.globalAlpha=Math.min(1,life*2)*dim*(on?1:.6+.2*Math.sin((now||time)*12));c.drawImage(sp,p.x-sp.width/2*k,p.y-sp.height/2*k,sp.width*k,sp.height*k);c.globalAlpha=1}}
{const _tb=FXP.trapBoom;FXP.trapBoom=function(tr){const r=_tb.apply(this,arguments);const id=tr&&tr.s&&tr.s.id;if(id==='shadowtrap'||id==='abysstrap'){const col=id==='abysstrap'?'#6a3ab8':'#9a7ae8';
  rings.push({x:tr.x,y:tr.y,r:8,max:tr.s.rad,life:.5,col});burst(tr.x,tr.y,col,30,tr.s.rad*1.4,3.5,6);if(id==='abysstrap')J3W.gfx.push({k:'crater',x:tr.x,y:tr.y,rad:tr.s.rad,t:2.2,max:2.2,dark:1})}return r}}
// 빛나는 땅 무늬 (castDraw: 월드 좌표, 더하기 합성)
{const _cd=castDraw;castDraw=function(){_cd();try{jwGlowGround()}catch(err){if(window.__QA)throw err}}}
function jwGlowGround(){const c=ctx;
  for(const f of jwFields()){const s=f.s;if(!s.j3wa)continue;const fade=Math.min(1,f.t*2,(f.max-f.t)*4);
    if(s.j3ring){c.globalAlpha=.75*fade;c.strokeStyle='#9a7ae8';c.lineWidth=5;c.setLineDash([22,12]);c.lineDashOffset=-time*40;c.beginPath();c.arc(f.x,f.y,f.rad,0,6.283);c.stroke();c.setLineDash([]);
      c.lineWidth=2;c.globalAlpha=.5*fade;for(let i=0;i<24;i++){const a=i/24*6.283+time*.2;c.beginPath();c.moveTo(f.x+Math.cos(a)*f.rad,f.y+Math.sin(a)*f.rad);c.lineTo(f.x+Math.cos(a)*(f.rad-26),f.y+Math.sin(a)*(f.rad-26));c.stroke()}}
    if(s.j3anchor){c.globalAlpha=.6*fade;c.strokeStyle='#d8c8a0';c.lineWidth=4;c.beginPath();c.arc(f.x,f.y,f.rad*.9,0,6.283);c.stroke();c.lineWidth=2;c.globalAlpha=.35*fade;
      for(let i=0;i<8;i++){const a=i/8*6.283+.39;c.beginPath();c.moveTo(f.x+Math.cos(a)*f.rad*.9,f.y+Math.sin(a)*f.rad*.9);c.lineTo(f.x+Math.cos(a)*f.rad*.7,f.y+Math.sin(a)*f.rad*.7);c.stroke();c.beginPath();c.arc(f.x+Math.cos(a)*f.rad*.66,f.y+Math.sin(a)*f.rad*.66,9,0,6.283);c.stroke()}}
    if(s.j3night){c.globalAlpha=.55*fade;c.strokeStyle='#6a4ab8';c.lineWidth=3;c.beginPath();c.arc(f.x,f.y,f.rad,0,6.283);c.stroke();
      for(let i=0;i<14;i++){const a=i*2.4+f.x*.01,r=f.rad*Math.sqrt((i*37%14)/14+.02),tw=.5+.5*Math.sin(time*3+i);c.globalAlpha=.6*fade*tw;c.fillStyle='#e8e0ff';c.fillRect(f.x+Math.cos(a)*r-1.5,f.y+Math.sin(a)*r-1.5,3,3)}}}
  // 별 떨구기: 모으는 동안 · 떨어지기 전 과녁
  const ch=typeof J3CH!=='undefined'?J3CH:null;if(ch&&ch.p===P&&ch.id==='starfallbow'){const s0=SPELLS.starfallbow,t=ch.tg||aimPoint(),p=clampRange(t,s0.range),r=s0.rad+(s0.radMax-s0.rad)*ch.f;
    c.globalAlpha=.35+.35*ch.f;c.strokeStyle='#ffe9a8';c.lineWidth=3;c.setLineDash([16,10]);c.lineDashOffset=time*30;c.beginPath();c.arc(p.x,p.y,r,0,6.283);c.stroke();c.setLineDash([])}
  for(const o of J3W.sfall){const k=1-o.t/o.max;c.globalAlpha=.4+.5*k;c.strokeStyle='#ffe9a8';c.lineWidth=4;c.beginPath();c.arc(o.x,o.y,o.rad,0,6.283);c.stroke();c.globalAlpha=.12+.2*k;c.fillStyle='#ffe9a8';c.beginPath();c.arc(o.x,o.y,o.rad*k,0,6.283);c.fill()}
  for(const v of J3W.drives){const k=v.t/v.max;c.globalAlpha=.4*k+.1;c.strokeStyle='#8a6ad8';c.lineWidth=3;c.beginPath();c.arc(v.x,v.y,v.rad*(.3+.7*k),0,6.283);c.stroke()}
  for(const w of J3W.sweeps){if(w.G&&!onScreen(W2S(w.x,w.y),900))continue;const L=Math.min(w.d,w.len),nx=-w.uy,ny=w.ux;c.globalAlpha=.22;c.fillStyle='#cfe0ff';c.beginPath();
    c.moveTo(w.x+nx*w.w,w.y+ny*w.w);c.lineTo(w.x+w.ux*L+nx*w.w,w.y+w.uy*L+ny*w.w);c.lineTo(w.x+w.ux*L-nx*w.w,w.y+w.uy*L-ny*w.w);c.lineTo(w.x-nx*w.w,w.y-ny*w.w);c.closePath();c.fill()}
  for(const g of J3W.gfx){const u=g.t/g.max;
    if(g.k==='lane'){const nx=-(g.y2-g.y1),ny=g.x2-g.x1,l=Math.hypot(nx,ny)||1,wx=nx/l*g.w,wy=ny/l*g.w;c.globalAlpha=.4*u;c.fillStyle=g.col;c.beginPath();c.moveTo(g.x1+wx,g.y1+wy);c.lineTo(g.x2+wx*.4,g.y2+wy*.4);c.lineTo(g.x2-wx*.4,g.y2-wy*.4);c.lineTo(g.x1-wx,g.y1-wy);c.closePath();c.fill()}
    else if(g.k==='cone'){c.globalAlpha=.45*u;c.fillStyle=g.col;c.beginPath();c.moveTo(g.x,g.y);c.arc(g.x,g.y,g.rad*(1.1-u*.3),g.a-g.ang/2,g.a+g.ang/2);c.closePath();c.fill()}
    else if(g.k==='pulse'){const o=g.own||g;c.globalAlpha=.6*u;c.strokeStyle=g.col;c.lineWidth=4;c.beginPath();c.arc(o.x,o.y,g.rad*(1-u)+20,0,6.283);c.stroke()}
    else if(g.k==='aura'){const o=g.own;if(!o||o.dead)continue;c.globalAlpha=.35*Math.min(1,g.t);c.strokeStyle=g.col;c.lineWidth=3;c.setLineDash([10,8]);c.lineDashOffset=time*20;c.beginPath();c.arc(o.x,o.y,g.rad,0,6.283);c.stroke();c.setLineDash([])}
    else if(g.k==='dome'){const o=g.own;if(!o)continue;const f=Math.min(1,g.t,(g.max-g.t)*3);c.globalAlpha=.55*f;c.strokeStyle='#ffe39a';c.lineWidth=5;c.beginPath();c.arc(o.x,o.y,g.rad,0,6.283);c.stroke();
      c.lineWidth=2;c.globalAlpha=.4*f;for(let i=0;i<12;i++){const a=i/12*6.283+time*.3;c.beginPath();c.arc(o.x+Math.cos(a)*g.rad*.9,o.y+Math.sin(a)*g.rad*.9,10,0,6.283);c.stroke()}}
    else if(g.k==='anchor'){c.globalAlpha=.8*u;c.strokeStyle='#e8d8a8';c.lineWidth=6;c.beginPath();c.arc(g.x,g.y,60+(1-u)*340,0,6.283);c.stroke()}
    else if(g.k==='crater'){c.globalAlpha=.5*u;c.strokeStyle=g.dark?'#6a3ab8':'#ffd890';c.lineWidth=3;c.beginPath();c.arc(g.x,g.y,g.rad*(.9+.1*(1-u)),0,6.283);c.stroke()}}
  c.globalAlpha=1}
// 서 있는 효과 (FXP.draw: 화면 좌표)
{const _fd=FXP.draw;FXP.draw=function(c,map,now){_fd.call(this,c,map,now);try{jwUpright(c,map)}catch(err){if(window.__QA)throw err}c.globalAlpha=1;c.globalCompositeOperation='lighter'}}
function jwUpright(c,map){const P3=(x,y,z)=>{const s=map(x,y);return{x:s.x,y:s.y-(z||0)}};
  c.globalCompositeOperation='lighter';
  // 던진 무기 · 되돌아오는 화살
  for(const th of J3W.thr){const p=P3(th.x,th.y,34);if(th.arrow){const sp=JS.garrow('#ffe9a8'),a=th.ph?Math.atan2(((th.own||P).y-th.y)*.5+((th.own||P).x-th.x)*.5,((th.own||P).x-th.x)-((th.own||P).y-th.y)):Math.atan2((Math.sin(th.a)+Math.cos(th.a))*.5,Math.cos(th.a)-Math.sin(th.a));
      c.save();c.translate(p.x,p.y);c.rotate(a);c.globalAlpha=1;c.drawImage(sp,-50,-9);c.restore()}
    else{const sp=JS.blade();c.save();c.translate(p.x,p.y);c.rotate(th.rot);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.drawImage(sp,-24,-24);c.restore();c.globalCompositeOperation='lighter';c.globalAlpha=.5;c.drawImage(Kit.glowCv('#ffe0b0'),p.x-26,p.y-26,52,52)}}
  // 휘는 마탄 꼬리
  for(const h of J3W.hom){c.globalAlpha=.8;c.strokeStyle='#ffe9a8';c.lineWidth=3;c.beginPath();for(let i=0;i<h.tr.length;i+=2){const p=P3(h.tr[i],h.tr[i+1],22);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y)}c.stroke();
    const p=P3(h.x,h.y,22);c.drawImage(Kit.glowCv('#ffe9a8'),p.x-18,p.y-18,36,36)}
  // 검기
  const wv=JS.wave();for(const v of J3W.waves){const x=v.x+v.ux*v.d,y=v.y+v.uy*v.d,p=P3(x,y,20),q=map(x+v.ux,y+v.uy),s0=map(x,y),a=Math.atan2(q.y-s0.y,q.x-s0.x),k=v.w/30;c.globalAlpha=Math.min(1,(v.range-v.d)/120);c.save();c.translate(p.x,p.y);c.rotate(a);c.drawImage(wv,-36*k,-20*k,72*k,40*k);c.restore()}
  // 천군의 돌격: 환영 기병대
  for(const w of J3W.sweeps){const nx=-w.uy,ny=w.ux,d=Math.min(w.d,w.len+200),fx=(w.ux-w.uy)>=0?1:-1;c.globalAlpha=Math.min(1,(w.len+300-w.d)/200);
    for(let r=0;r<2;r++)for(let i=-2;i<=2;i++){const off=i/2*w.w*.9,back=r*90+Math.abs(i)*20,x=w.x+w.ux*(d-back)+nx*off,y=w.y+w.uy*(d-back)+ny*off;if(d-back<0)continue;const p=map(x,y);jwRiderDraw(c,p.x,p.y,fx,1.15,i+r*5)}}
  // 일곱 별 · 별 떨구기
  const st=JS.star();for(const o of J3W.stars){const k=o.t/o.max,p=P3(o.x-k*120,o.y-k*120,20+k*420);c.globalAlpha=1;c.drawImage(st,p.x-34,p.y-34,68,68);c.globalAlpha=.6;c.strokeStyle='#fff2c0';c.lineWidth=3;const q=P3(o.x-(k+.25)*120,o.y-(k+.25)*120,20+(k+.25)*420);c.beginPath();c.moveTo(q.x,q.y);c.lineTo(p.x,p.y);c.stroke()}
  for(const o of J3W.sfall){const k=o.t/o.max,p=P3(o.x-k*200,o.y-k*200,30+k*700),sz=120+o.rad*.5;c.globalAlpha=1;c.drawImage(st,p.x-sz/2,p.y-sz/2,sz,sz)}
  // 몰이: 그림자 늑대
  for(const v of J3W.drives){const k=v.t/v.max;for(let i=0;i<6;i++){const a=i/6*6.283+time*1.6,r=v.rad*(.25+.75*k)*(.85+.15*Math.sin(i*2)),p=map(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r),sp=JS.wolf(((time*10+i)|0)%2);
    c.globalCompositeOperation='source-over';c.globalAlpha=.85;c.save();c.translate(p.x,p.y);if(Math.sin(a)>0)c.scale(-1,1);c.drawImage(sp,-36,-34);c.restore()}c.globalCompositeOperation='lighter'}
  // 효과 목록
  for(const g of J3W.gfx){const u=g.t/g.max;
    if(g.k==='clones'||g.k==='cflash'){const o=g.own;if(!o||o.dead)continue;if(g.k==='cflash'){for(const sd of [-1,1]){const p=P3(o.x+Math.cos((o.face||0)+sd*1.5708)*55,o.y+Math.sin((o.face||0)+sd*1.5708)*55,30);c.globalAlpha=u;c.drawImage(Kit.glowCv('#b89aff'),p.x-22,p.y-22,44,44)}continue}
      const f=o.face||0,sp=JS.clone();c.globalCompositeOperation='source-over';for(const sd of [-1,1]){const p=map(o.x+Math.cos(f+sd*1.5708)*55,o.y+Math.sin(f+sd*1.5708)*55);c.globalAlpha=.75*Math.min(1,g.t*2,(g.max-g.t)*4);c.drawImage(sp,p.x-26,p.y-76+Math.sin(time*3+sd)*2)}c.globalCompositeOperation='lighter'}
    else if(g.k==='griders'){const o=g.own;if(!o||o.dead)continue;for(let i=0;i<g.n;i++){const a=i/g.n*6.283+time*.9,p=map(o.x+Math.cos(a)*110,o.y+Math.sin(a)*110);jwRiderDraw(c,p.x,p.y,Math.sin(a)>0?-1:1,.9,i)}}
    else if(g.k==='swap'||g.k==='dash'){const a=P3(g.x1,g.y1,30),b=P3(g.x2,g.y2,30);c.globalAlpha=.7*u;c.strokeStyle=g.k==='swap'?'#e8d8a8':'#cfe8ff';c.lineWidth=g.k==='swap'?6:4;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()}
    else if(g.k==='tether'){const a=P3(g.a.x,g.a.y,30),b=P3(g.b.x,g.b.y,30);c.globalAlpha=.8*u;c.strokeStyle=g.col;c.lineWidth=4;c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2-30,b.x,b.y);c.stroke()}
    else if(g.k==='smoke'){const p=P3(g.x,g.y,24),r=30+(1-u)*40;c.globalCompositeOperation='source-over';c.globalAlpha=.55*u;c.fillStyle='#1a1428';for(let i=0;i<5;i++){const a=i*1.26+g.x;c.beginPath();c.arc(p.x+Math.cos(a)*r*.5,p.y+Math.sin(a)*r*.25,r*.45,0,6.283);c.fill()}c.globalCompositeOperation='lighter'}
    else if(g.k==='gaze'){const o=g.own;if(!o||o.dead)continue;const p=P3(o.x,o.y,96+Math.sin(time*3)*3);c.globalAlpha=Math.min(1,g.t*2)*.95;c.drawImage(JS.eye(),p.x-20,p.y-12)}
    else if(g.k==='drum'){const o=g.own;if(!o||o.dead)continue;const b=Math.abs(Math.sin(time*7)),p=P3(o.x-30,o.y+10,60+b*6);c.globalCompositeOperation='source-over';c.globalAlpha=Math.min(1,g.t*2);c.drawImage(JS.drum(),p.x-18,p.y-15);c.globalCompositeOperation='lighter';if(b>.95){c.globalAlpha=.5;c.drawImage(Kit.glowCv('#ff8a4a'),p.x-24,p.y-24,48,48)}}}
  // 적 머리 위 표식: 약점(파티 공용) · 결투 · 도발 표식
  c.globalCompositeOperation='source-over';
  for(const e of enemies){if(e.dead||!e._s||!(e.j3wk>0||e.j3duel||e.j3pv>0||e.j3ven))continue;const sc=e.sc||(e.elite?1.25:1),s=e._s,top=s.y-e.r*sc*2.4-34;let x=s.x-(e.j3wk>0&&e.j3duel?12:0);
    if(e.j3wk>0){const r=15+Math.sin(time*5)*2;c.globalAlpha=.95;c.save();c.translate(x,top);c.rotate(time*.8);c.drawImage(JS.mark('w'),-r,-r,r*2,r*2);c.restore();x+=24}
    if(e.j3duel){c.globalAlpha=1;c.drawImage(JS.mark('d'),x-14,top-14,28,28);x+=24}
    if(e.j3pv>0&&!e.j3duel){c.globalAlpha=.95;c.drawImage(JS.mark('p'),x-14,top-14,28,28)}
    if(e.j3ven&&R()<.08)rise(e.x,e.y,'#8ad04a',30)}
  // 투혼 · 호흡 (머리 위 작은 눈금)
  if(!P.dead&&P._s&&(P.job3==='warlord'&&J3W.fz>0||P.job3==='divinearcher'&&J3W.br>0)){const s=P._s,wl=P.job3==='warlord',n=wl?10:5,v=wl?J3W.fz:J3W.br,w=wl?7:10,x0=s.x-n*w/2,y=s.y-98;
    for(let i=0;i<n;i++){c.globalAlpha=i<v?1:.35;c.fillStyle=i<v?(wl?'#ff5a3a':'#bfe6ff'):'#2a2430';c.beginPath();if(wl){c.moveTo(x0+i*w+w/2,y-4);c.lineTo(x0+i*w+w-1,y);c.lineTo(x0+i*w+w/2,y+4);c.lineTo(x0+i*w+1,y)}else c.arc(x0+i*w+w/2,y,3.4,0,6.283);c.fill()}}
  c.globalAlpha=1}

/* ===== 같이 하기 메시지 (CORE의 J3NET — job3.js가 실린 뒤에 등록) ===== */
queueMicrotask(()=>{try{
  Object.assign(J3NET,{
    wawall:(m,r)=>{if(r)J3W.lords.set(r.id,{t:clamp(+m.d||0,0,20),sh:clamp(+m.sh||0,0,.8),rad:clamp(+m.rad||0,0,600)})},
    wawd:(m,r)=>{if(P.dead)return;const d=clamp(+m.d||0,0,maxHp()*2);if(d>0){hitPlayer(d,null,{lnk:1});if(r)J3W.gfx.push({k:'tether',a:r,b:P,t:.5,max:.5,col:'#e8d8a8'})}},
    waesh:(m,r)=>{const a=clamp(+m.a||0,0,maxHp()*2);if(jwShield(a,clamp(+m.d||5,0,10))){burst(P.x,P.y,'#bfe0ff',14,90,3,30);msg(`${r&&r.name||'동료'}님의 성채의 메아리 (${Math.round(a)} 흡수)`,'#bfe0ff')}},
    wakg:(m)=>{J3W.kg={t:clamp(+m.d||0,0,15),acc:0,h:clamp(+m.h||0,0,.5),cap:clamp(+m.cap||0,0,.6),n:String(m.n||'').slice(0,20)}},
    waswap:(m,r)=>{if(P.dead||!r||!netSame(r))return;const x=+m.x,y=+m.y;if(!(Math.hypot(x-P.x,y-P.y)<900))return;const p=landAt(P.x,P.y,x,y);P.x=p.x;P.y=p.y;followCam();
      J3W.gfx.push({k:'swap',x1:r.x,y1:r.y,x2:P.x,y2:P.y,t:.6,max:.6});msg(`${r.name||'동료'}님이 자리를 바꾸어 앞을 막았습니다`,'#e8e4d8')},
    wathr:(m,r)=>{if(!NET.host||!r)return;jwThrMove(m.of===NET.id?0:m.of,r.id)},
    wathr0:(m,r)=>{if(!NET.host||!r)return;for(const e of enemies){if(e.thr&&e.thr.has(r.id))e.thr.set(r.id,0);if(e.tauntBy===r)e.tauntT=0}},
    wahide:(m,r)=>{if(r)J3W.hid.set(r.id,time+clamp(+m.d||0,0,10))},
    wamk:(m)=>{const e=enemies.find(o=>o.id===m.id);if(e)jwWeak(e,clamp(+m.c||0,0,.3),clamp(+m.d||0,0,15),false)},
    waduel:(m,r)=>{if(!NET.host||!r)return;const e=enemies.find(o=>o.id===m.id);if(e&&!e.dead)jwDuelHost(e,r.id,clamp(+m.d||0,0,15))},
    wafz:()=>{if(P.job3==='warlord'&&!P.dead)jwFz(1,1)},
    wawbrk:(m)=>{for(const w of J3W.walls)if(Math.hypot(w.x-m.x,w.y-m.y)<40)w.t=Math.min(w.t,0)},
    wasink:(m)=>{const e=enemies.find(o=>o.id===m.id);if(e)e.j3sV=time+clamp(+m.d||0,0,3)}});
  j3OnCharge('bulwarkcounter',{start(){J3W.store=0;P.buffs._j3ctr={t:9,max:9,dr:SPELLS.bulwarkcounter.j3store.dr,n:''};rings.push({x:P.x,y:P.y,r:10,max:70,life:.4,col:'#ffe9b0'})},
    tick(c){if(R()<.3)burst(P.x+Math.cos(P.face)*30,P.y+Math.sin(P.face)*30,'#ffe9b0',2,40,2,30);void c},end(){delete P.buffs._j3ctr}});
  j3OnCharge('lordgale',{tick(c){if(R()<.5){const a=time*14;burst(P.x+Math.cos(a)*50,P.y+Math.sin(a)*50,'#ffd0b0',2,60,2.5,20)}heroAtk(P,'spin',.2);void c}});
  j3OnCharge('starfallbow',{tick(c){if(R()<.4)rise(P.x+rnd(-10,10),P.y+rnd(-10,10),'#fff2c0',60+c.f*40)}});
  jwKindN()}catch(err){if(window.__QA)throw err}});

/* ===== 아이콘 (32×32 물리 문양) ===== */
Object.assign(ICP,{
  rampartbash:c=>ICX.shield(13,17,.95,c.r)+ICX.arc(21,11,20,.8,c.hi)+ICX.burst(25,23,.4,ICC.gold),
  lordstance:c=>ICX.shield(16,17,1,c.r)+ICX.crown(16,5,.5),
  bewall:c=>ICX.bricks(16,24,.9)+ICX.figure(8,12,.5,c.hi)+ICX.figure(24,12,.5,c.hi)+ICX.shield(16,11,.6,c.r),
  provokemark:c=>ICX.spear(16,16,45,.85)+ICX.target(16,16,.55,ICC.red),
  stonerampart:c=>ICX.bricks(16,19,1.1)+ICX.up(16,5,.6,c.hi),
  citadelecho:c=>ICX.tower(16,18,.8)+ICX.waves(16,15,-90,.9,c.hi,3),
  lordduel:c=>ICX.sword(11,17,-30,.8)+ICX.sword(21,17,30,.8)+ICX.crown(16,5,.45),
  fortressswap:c=>ICX.path('M6 22Q16 4 26 22',c.hi,1.6)+ICX.path('M26 10Q16 28 6 10',ICC.gold,1.4)+ICX.shield(16,16,.5,c.r),
  bulwarkcounter:c=>ICX.shield(13,16,.9,c.r)+ICX.burst(24,11,.55,ICC.gold)+ICX.lines(27,22,0,.6,c.hi,3),
  earthanchor:c=>ICX.chain(16,10,90,.9)+ICX.crack(16,25,1,ICC.gold)+ICX.ring(16,25,.8,c.hi),
  unfallenkingdom:c=>ICX.tower(9,19,.6)+ICX.tower(23,19,.6)+ICX.crown(16,9,.7)+ICX.ring(16,26,1,ICC.gold),
  lordcombo:c=>ICX.arc(12,12,-20,.8,c.hi)+ICX.arc(20,20,160,.8,c.hi)+ICX.sword(16,16,45,.8),
  battleblood:c=>ICX.burst(16,16,.95,ICC.blood)+ICX.sword(16,16,30,.7),
  earthsplit:c=>ICX.crack(16,23,1.2,ICC.gold)+ICX.sword(16,11,180,.75),
  weaponthrow:c=>ICX.sword(17,16,90,.8)+ICX.spiral(17,16,.6,c.hi)+ICX.lines(6,16,0,.6,c.hi,3),
  executionleap:c=>ICX.path('M3 26Q8 4 14 20Q19 6 24 20',c.hi,1.4)+ICX.burst(25,24,.4,ICC.gold)+ICX.sword(26,11,200,.5),
  bloodoath:c=>ICX.drop(12,15,.8)+ICX.drop(20,15,.8)+ICX.laurel(16,16,1.05,ICC.blood),
  bloodharvest:c=>ICX.heart(16,16,.9,ICC.blood)+ICX.inward(16,16,1.05,c.hi),
  lordgale:c=>ICX.spiral(16,16,1,c.hi)+ICX.arc(16,16,0,.6,c.hi)+ICX.arc(16,16,180,.6,c.hi),
  wardrum:c=>ICX.g(16,18,0,1,'<ellipse rx="9" ry="3.4" fill="#e8d8b0" stroke="#5a3a1c" stroke-width=".7"/><path d="M-9 0v8a9 3.4 0 0 0 18 0V0" fill="#8a2a24" stroke="#5a3a1c" stroke-width=".7"/><path d="M-6 2l4 7M0 3.4v6M6 2l-4 7" stroke="#e8c35a" stroke-width=".8"/>')+ICX.waves(16,7,-90,.6,c.hi,2),
  phantomriders:c=>ICX.banner(9,16,.8,c.r)+ICX.figure(20,18,.7,'#bcd4ff')+ICX.figure(26,20,.55,'#bcd4ff'),
  heavenlycharge:c=>ICX.spear(13,17,70,.8)+ICX.spear(20,21,70,.7)+ICX.lines(8,25,0,.7,c.hi,4)+ICX.wings(16,8,.5),
  windpierce:c=>ICX.arrow(17,15,-30,1.05)+ICX.lines(8,21,-30,.7,c.hi,3),
  breathmastery:c=>ICX.eye(16,15,.85,ICC.gold)+ICX.waves(16,25,90,.5,c.hi,2),
  curvingshot:c=>ICX.path('M4 26C4 8 28 26 26 6',c.hi,1.5)+ICX.arrow(24,8,-80,.6),
  windstep:c=>ICX.boot(12,18,0,.8)+ICX.arrow(22,12,-20,.6)+ICX.lines(6,22,0,.6,c.hi,3),
  exposeweak:c=>ICX.target(16,16,1,ICC.red)+ICX.eye(16,16,.4,ICC.gold),
  scattervolley:c=>ICX.arrow(16,17,-60,.65)+ICX.arrow(16,17,-30,.65)+ICX.arrow(16,17,0,.65)+ICX.arrow(16,17,30,.65),
  piercinggaze:c=>ICX.eye(15,16,1.05,'#6ac8ff',1)+ICX.lines(27,16,0,.6,c.hi,3),
  sevenstars:c=>[[8,7],[16,4],[24,7],[6,15],[26,15],[11,23],[21,23]].map(([x,y])=>ICX.burst(x,y,.32,ICC.gold)).join('')+ICX.bow(16,18,-90,.6,.5),
  returnarrow:c=>ICX.arrow(16,10,0,.8)+ICX.arrow(16,22,180,.8)+ICX.path('M27 10Q31 16 27 22',c.hi,1.2),
  oneshot:c=>ICX.arrow(15,17,-45,1.1,'#ffd76a')+ICX.target(22,10,.45,ICC.red)+ICX.burst(24,8,.3,'#fff'),
  starfallbow:c=>ICX.burst(19,9,.8,ICC.gold)+ICX.bow(11,21,-60,.7,.8)+ICX.path('M19 9L25 26',c.hi,1),
  shadowarrow:c=>ICX.arrow(16,15,-45,1,'#8a6ad8')+ICX.cloud(10,24,.5,'#2a2440'),
  darkhunter:c=>ICX.wolf(16,15,.8,'#3a3448')+ICX.trap(16,26,.5,'#6a5a90'),
  shadowhide:c=>ICX.figure(16,16,.9,'#4a4060')+ICX.cloud(16,23,.8,'#2a2440')+ICX.cloud(16,9,.6,'#3a3050'),
  shadowtrap:c=>ICX.trap(16,19,.95,'#8a6ad8')+ICX.chain(16,8,0,.6,'#8a6ad8'),
  shadowstep:c=>ICX.figure(8,18,.6,'#3a3050')+ICX.path('M11 14Q16 6 22 14',c.hi,1.2)+ICX.figure(24,18,.6,'#8a6ad8'),
  huntground:c=>ICX.ring(16,18,1.15,'#8a6ad8',1)+ICX.paw(16,15,.6),
  poisonshade:c=>ICX.drop(16,13,.9,'#7ad04a')+ICX.trap(16,25,.55,'#6a5a90'),
  shadowclone:c=>ICX.figure(9,17,.7,'#4a4060')+ICX.figure(16,16,.8,c.hi)+ICX.figure(23,17,.7,'#4a4060'),
  drivehunt:c=>ICX.wolf(10,21,.6,'#3a3448')+ICX.falcon(22,9,0,.55)+ICX.inward(19,21,.6,c.hi),
  abysstrap:c=>ICX.g(16,21,0,1,'<ellipse rx="11" ry="4.4" fill="#0a0810" stroke="#8a6ad8" stroke-width="1.4"/><ellipse rx="6" ry="2.2" fill="#1a1028"/>')+ICX.spiral(16,11,.55,'#8a6ad8'),
  nighthunt:c=>ICX.g(12,11,0,1,'<path d="M4-7a8 8 0 1 0 0 14 6 6 0 1 1 0-14z" fill="#e8e0ff"/>')+ICX.eye(21,22,.5,'#8a6ad8',1)+ICX.dots([[25,6],[28,12],[6,25]],'#fff',.8)});
// 3차 기술 아이콘: 금빛 겹테
{const _pi=physIcon;physIcon=function(s){const h=_pi(s);if(!s||!s.job3)return h;
  return h.replace(/<\/svg>$/,'<rect x="1.6" y="1.6" width="28.8" height="28.8" rx="2.4" fill="none" stroke="#e8b04a" stroke-width="1.1" opacity=".9"/><path d="M1.5 6.5V1.5h5M25.5 1.5h5v5M30.5 25.5v5h-5M6.5 30.5h-5v-5" stroke="#ffe08a" stroke-width="1.4" fill="none"/></svg>')}}
window.__j3wa={J3W,JS,jwPre,jwPost,jwTick,jwKindN,j3PlayerAnchored,J3W_RULE,hit:(d,src)=>hitPlayer(d,src),get fields(){return fields},get traps(){return traps}};// 같이 하기 점검(e-j3wa.cjs)용
