/* [v21] 무료 그림 Flare (flarerpg.org, CC-BY-SA 3.0)
   - 그림은 game.html 옆 img/ 폴더의 flare-*.js 파일들(WebP 묶음 + 자르는 정보). 각 파일이 FLARE_PACK(이름, 정보, 그림)을 부른다.
   - 묶음: grass(풀·숲 지역 나무·덤불·바위·땅 무늬), snow(눈 지역), m-<몬스터>(몬스터 하나씩). 필요한 묶음만 그때그때 받는다.
   - 「화면」 설정 「그림: 새 그림 / 예전 그림」. 파일이 없거나 못 불러오면 예전 코드 그림 그대로.
   - 그림만 바뀐다: 크기·충돌·적중·수치·저장은 그대로. */
const FL={P:{},want:{},mk:{},gtx0:{},tint:new Map()};
// [f7r] 그림을 미리 풀어 둔 뒤(decode) 쓴다: 처음 그리는 프레임에서 멈칫하지 않게
window.FLARE_PACK=function(name,meta,url){const im=new Image();const ok=()=>{if(FL.P[name])return;FL.P[name]={img:im,meta};flReady(name)};im.onload=()=>{im.decode?im.decode().then(ok,ok):ok()};im.onerror=()=>{FL.want[name]='fail'};im.src=url};
function flWant(){return GFX.art!=='old'}
// 묶음 하나 받기 (한 번만). #qa에서는 받지 않는다.
function flNeed(name){if(FL.want[name]||!flWant()||location.hash==='#qa')return;FL.want[name]=1;const s=document.createElement('script');s.src='img/flare-'+name+'.js';s.onerror=()=>{FL.want[name]='fail'};document.head.appendChild(s)}
function flPack(name){return flWant()&&FL.P[name]||null}
// 지역 → 장식 묶음
const FLTH={moss:'grass',meadow:'grass',lush:'grass',beach:'grass',snow:'snow'};
function flRegPack(){if(DG||!REG)return null;if(REG.id==='home')return 'grass';const R=REGIONS[REG.id],p=R&&R.th&&R.th.paint;return FLTH[p]||null}
function flLoad(){const p=flRegPack();if(p)flNeed(p);flLoadTheme()}
// [f7r] 지역 테마 → 찾을 묶음 차례. 앞 묶음에 있는 종류가 먼저 (들판의 덤불은 금빛 meadow 것)
const FLTH2={moss:'lush',meadow:'meadow',lush:'lush',beach:'beach',sand:'sand',lava:'ember',snow:'snow'};
const FLTP={home:['grass','lush'],meadow:['meadow','grass','snow'],lush:['lush','grass'],beach:['grass','sand'],sand:['sand'],ember:['ember'],snow:['snow','frost']};
// 새 묶음에 든 종류 (묶음을 받기 전에 어느 묶음이 필요한지 알아야 한다)
const FLNEW={meadow:['oak','windtree','wheat','flowers','ruinpillar','bones','searock','hbush'],lush:['oak','jungletree','bigleaf','mushroom','templestone','ruinpillar','tomb','wheat'],
  sand:['sandrock','rock','bones','ruinpillar','obsidian','searock'],ember:['lavarock','obsidian','ashtree','rock','bones','ruinpillar','templestone','sandrock','hbush'],frost:['frozenbones','ruinpillar']};
function flTheme(){if(DG||!REG)return null;if(REG.id==='home')return 'home';const R=REGIONS[REG.id],p=R&&R.th&&R.th.paint;return FLTH2[p]||null}
const FLKM={};
function flKM(th){let m=FLKM[th];if(m)return m;m=FLKM[th]={};for(const pn of FLTP[th]){if(FLSP[pn]){for(const k in FLSP[pn])if(!(k in m))m[k]=[pn,FLSP[pn][k]]}else for(const k of FLNEW[pn])if(!(k in m))m[k]=[pn,null]}return m}
// 지역에 들어서면 그 지역 장식이 쓰는 묶음을 미리 받는다
function flLoadTheme(){const th=flTheme();if(!th||!flWant())return;const m=flKM(th),need=new Set();for(const d of decor){const e=m[d.k];if(e)need.add(e[0])}for(const pn of need)flNeed(pn)}
function flDraw(c,PK,key,x,y,k){const r=PK.meta.r[key];if(!r)return false;c.drawImage(PK.img,r[0],r[1],r[2],r[3],x-r[4]*k,y-r[5]*k,r[2]*k,r[3]*k);return true}
// 땅 무늬: 색은 지역 색이 입히므로 무늬는 채널마다 평균 128로 맞춘 명암만 쓴다 (gtexPaint와 같은 모양 {rgb,h,cv})
function flTex(PK,name){const r=PK.meta.r['tex/'+name];if(!r)return null;const cv=document.createElement('canvas');cv.width=cv.height=256;const g=cv.getContext('2d');g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,256,256);
  const id=g.getImageData(0,0,256,256).data,n=256*256,rgb=new Uint8Array(n*3),h=new Float32Array(n),m=[0,0,0];for(let i=0;i<n;i++)for(let c=0;c<3;c++)m[c]+=id[i*4+c];for(let c=0;c<3;c++)m[c]/=n;
  for(let i=0;i<n;i++){let l=0;for(let c=0;c<3;c++){const v=Math.max(0,Math.min(255,id[i*4+c]/m[c]*128*.55+128*.45));rgb[i*3+c]=v;l+=v}h[i]=l/765-.5}return{rgb,h,cv}}
const FLTEX={grass:['grass','road'],snow:['snow']};
function flGround(){for(const p in FLTEX)for(const n of FLTEX[p]){if(!(n in FL.gtx0))FL.gtx0[n]=GTX[n]||null;const PK=flPack(p);let t=null;if(PK)t=flTex(PK,n);
    if(t)GTX[n]=t;else if(FL.gtx0[n])GTX[n]=FL.gtx0[n];else delete GTX[n]}
  FL.tint.clear();chunks.clear();GJOBS.length=0}
function flReady(name){const PK=FL.P[name];
  // 몬스터 크기: 서 있는 앞모습 높이를 우리 그림 높이(MON_H)에 맞춘다
  for(const k in PK.meta.mon||{}){const f=PK.meta.mon[k].stance.f[0][6],r=PK.meta.r[f];FL.mk[k]=MON_H[FLMH[k]]*1.3*(FLK[k]||1)/r[5]}
  if(PK.meta.tex&&Object.keys(PK.meta.tex).length)flGround();else if(PK.meta.sp&&!PK.meta.mon)flIsoStale();flCredit()}
function flCredit(){const el=document.getElementById('auCredits');if(!el||el.querySelector('.flcr'))return;const p=document.createElement('p');p.className='muted flcr';p.style.cssText='font-size:12px;margin:4px 0 0';
  p.textContent='모든 바깥 지역의 나무·바위·석상 등 장식(지역 색으로 다시 칠함)·눈 지역·마을 소품·몬스터 일부 그림: Flare (flarerpg.org) — Clint Bellanger, Justin Nichol 외 (CC-BY-SA 3.0) · 늑대·표범·설인 그림과 사막·바다 야자·선인장 자리 덤불·난파선·건초 더미 장식: 0 A.D. (Wildfire Games, wildfiregames.com) 모델·동작·무늬를 그림으로 옮김 (CC-BY-SA 3.0)';el.appendChild(p)}
// 장식: 우리 장식 종류 → [묶음 안 종류, 높이 배율(0이면 고정 높이), 고정 높이]
const FLSP={
  grass:{htree:['htree',1],hbirch:['hbirch',1],hpine:['hpine',1],hdead:['hdead',1],hbush:['hbush',1.05],tree:['htree',1],bush:['hbush',1],
    fern:['fern2',0,22],rock:['rock',0,30],mossrock:['rock',0,34],stump:['stump',0,34]},
  snow:{snowpine:['snowpine',1],hpine:['snowpine',1],htree:['sdead',1],hdead:['sdead',1],tree:['sdead',1],hbush:['hbush',1],bush:['hbush',1],
    iceboulder:['iceboulder',0,40],rock:['rock',0,32],stump:['stump',0,34]}};
function flDecor(c,d,x,y,k,t){const th=flTheme();if(!th)return false;const e=flKM(th)[d.k];if(!e)return false;const PK=flPack(e[0]);if(!PK){flNeed(e[0]);return false}
  if(e[1]){const m=e[1],L=PK.meta.sp[m[0]];if(!L)return false;const key=L[Math.floor((d.v||0)*L.length*.999)],r=PK.meta.r[key];
    const df=RD.D[d.k],H=m[2]||(df?df.h*.92*m[1]:60),s=H/r[3]*(d.s||1)*(k||1);return flDraw(c,PK,key,x,y,s)}
  const L=PK.meta.sp[d.k];if(!L)return false;const vi=Math.floor((d.v||0)*L.length*.999),key=L[vi],s=PK.meta.z[d.k]*(d.s||1)*(k||1);
  flDraw(c,PK,key,x,y,s);if(t&&FLFX[d.k]&&!(typeof Q!=="undefined"&&Q.lvl===0))FLFX[d.k](c,d,x,y,s,t);return true}
// [f7r] 매 프레임 덧빛 (가산 합성 한두 장): 버섯·용암 바위·숯 나무는 은은히 빛나고, 바다 바위엔 물거품 고리. 그래픽 품질 「낮음」(Q.lvl===0)이면 생략
const FLFXC=['#7affe8','#c890ff','#7ab8ff'];
const FLFX={
  mushroom(c,d,x,y,s,t){const i=d.v<.34?0:d.v<.67?1:2;c.globalCompositeOperation='lighter';c.globalAlpha=.32+.18*Math.sin(t*1.6+d.v*9);c.drawImage(Kit.glowCv(FLFXC[i]),x-34*s,y-50*s,68*s,52*s);c.globalAlpha=1;c.globalCompositeOperation='source-over'},
  lavarock(c,d,x,y,s,t){c.globalCompositeOperation='lighter';c.globalAlpha=.16+.14*Math.sin(t*2.4+d.v*9);c.drawImage(Kit.glowCv('#ff6a1a'),x-34*s,y-26*s,68*s,34*s);c.globalAlpha=1;c.globalCompositeOperation='source-over'},
  ashtree(c,d,x,y,s,t){c.globalCompositeOperation='lighter';c.globalAlpha=.22+.14*Math.sin(t*2+d.v*9);c.drawImage(Kit.glowCv('#ff5a1a'),x-18*s,y-12*s,36*s,16*s);c.globalAlpha=1;c.globalCompositeOperation='source-over'},
  searock(c,d,x,y,s,t){const p=(t*.4+d.v)%1;c.strokeStyle='rgba(240,250,255,'+(.5*(1-p))+')';c.lineWidth=1.2*s;c.beginPath();c.ellipse(x,y+2*s,(26+p*10)*s,(6+p*3)*s,0,0,6.283);c.stroke()}};
{const _rd=RD.draw;RD.draw=function(c,d,x,y,k,t){if(flWant()&&flDecor(c,d,x,y,k,t))return true;return _rd.apply(this,arguments)}}
{const _dd=drawDecor;drawDecor=function(d){if(flWant()&&!RD.D[d.k]&&flDecor(ctx,d,d._s.x,d._s.y,1,time))return;return _dd.apply(this,arguments)}}
// [f7r] 땅 조각에 함께 구운 낮은 장식(밀·꽃·뼈 …)은 새 묶음이 늦게 도착하면 예전 그림으로 남는다 → 낡았다고 표시해 두고 한 프레임에 두 조각씩만 다시 굽는다(한꺼번에 굽는 멈칫 없이)
FL.ib=0;FL.ibF=-1;
function flIsoStale(){for(const c of chunks.values())if(c.iso)c.iso.stale=1}
{const _ib=isoBlit;isoBlit=function(c,cx,cy){if(c.iso&&c.iso.stale){if(FL.ibF!==frameN){FL.ibF=frameN;FL.ib=typeof Q!=="undefined"&&Q.lvl===0?1:2}if(FL.ib>0){FL.ib--;c.iso=null}}return _ib.apply(this,arguments)}}
// 몬스터: 그림 종류(draw)마다 기본 Flare 몬스터, 몇몇 종류는 따로 (미라·익사자 → 좀비, 비룡 → 와이번, 모래 왕 → 해골 마법사)
// [f8w] 늑대(draw 'wolf', 17종)는 Flare에 없어서 0 A.D. 늑대 3D 모델을 Flare와 같은 각도·빛으로 그려 같은 묶음 모양으로 만든 것 (img/flare-m-wolf.js, 만드는 법 f8w-qa/tools/render0ad.py)
const FLDRAW={goblin:'goblin',skeleton:'skeleton',ogre:'ogre',scorpion:'antlion',wolf:'wolf'};
const FLTYPE={d_mummy:'zombie',s_drown:'zombie',b_mordun:'zombie',b_setra:'skelmage',t_drake:'wyvern',b_sarakus:'wyvern',m_broodguard:'wyvern',b_astrak:'wyvern'};
const FLK={wyvern:1.45}; // 날개 달린 비룡은 키보다 몸이 커 보여야 해서 조금 크게
const FLMH={wolf:'wolf',goblin:'goblin',skeleton:'skeleton',skelmage:'skeleton',zombie:'skeleton',ogre:'ogre',antlion:'scorpion',wyvern:'serpent'};
// 원래 그림 색. 종류 색(col)이 이 색과 다를수록 그 색을 더 입힌다 (재 들개·붉은 전갈 같은 변형 구분)
const FLREF={wolf:'#8a867f',goblin:'#5c8a3a',skeleton:'#b0a898',skelmage:'#b0a898',zombie:'#8a8a5a',ogre:'#7a6a46',antlion:'#9a7a52',wyvern:'#6a6a5a'};
function flTinted(PK,key,col,s){const ck=key+col;let cv=FL.tint.get(ck);if(cv)return cv;if(FL.tint.size>500)FL.tint.clear();
  const r=PK.meta.r[key];cv=document.createElement('canvas');cv.width=r[2];cv.height=r[3];const g=cv.getContext('2d');g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);
  g.globalCompositeOperation='color';g.globalAlpha=s;g.fillStyle=col;g.fillRect(0,0,r[2],r[3]);g.globalAlpha=1;g.globalCompositeOperation='destination-in';g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);
  FL.tint.set(ck,cv);return cv}
function flTintAmt(id,col){if(!col)return 0;const a=Kit.hex(col),b=Kit.hex(FLREF[id]);const d=Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);return d<40?0:Math.min(.55,(d-40)/160)}
const FLM=new WeakMap();
function flMon(id,draw,g,e,t,st){const PK=flPack('m-'+id);if(!PK){flNeed('m-'+id);return false}const M=PK.meta.mon[id];if(!M)return false;
  let s=FLM.get(e);if(!s){s={x:e.x,y:e.y,dx:0,dy:1};FLM.set(e,s)}
  const mx=e.x-s.x,my=e.y-s.y;s.x=e.x;s.y=e.y;
  if(Math.hypot(mx,my)>.3){s.dx=mx;s.dy=my}else if(typeof P!=='undefined'&&P&&Math.hypot(P.x-e.x,P.y-e.y)<600){s.dx=P.x-e.x;s.dy=P.y-e.y}
  const sx=(s.dx-s.dy),sy=(s.dx+s.dy)/2,th=Math.atan2(sy,sx),di=(((Math.round((th-Math.PI)/(Math.PI/4)))%8)+8)%8;
  let an='stance',fi=0;
  if(e.hurt>0&&M.hit){an='hit';fi=0}
  else if(st.lunge>0&&M.swing){an='swing';fi=Math.min(M.swing.n-1,Math.floor((1-st.lunge)*M.swing.n))}
  else if(st.mv>.45){an='run';fi=Math.floor(st.ph*M.run.n*1.4)%M.run.n}
  else{const n=M.stance.n,p=Math.floor(st.t/(M.stance.dur/n));fi=M.stance.type==='back_forth'?(()=>{const q=p%(n*2-2||1);return q<n?q:n*2-2-q})():p%n}
  const A=M[an];const key=A.f[Math.min(fi,A.n-1)][di],r=PK.meta.r[key],k=FL.mk[id];
  const ta=flTintAmt(id,t&&t.col);
  g.save();g.scale(e.fx||1,1);
  if(ta>0){const cv=flTinted(PK,key,t.col,ta);g.drawImage(cv,-r[4]*k,-r[5]*k,r[2]*k,r[3]*k)}else flDraw(g,PK,key,0,0,k);
  g.restore();
  st.head={x:0,y:-MON_H[draw]-4};return true}
for(const dk of ['goblin','skeleton','ogre','scorpion','serpent','wolf']){const _m=MON[dk];if(!_m)continue;
  MON[dk]=function(g,e,t,st){if(flWant()){const id=FLTYPE[e.k]||FLDRAW[dk];if(id&&flMon(id,dk,g,e,t,st))return}return _m.apply(this,arguments)}}
// 마을 소품: 상자·천막·모닥불·모루·울타리·표지판 (눈 지역은 눈 덮인 것, 수레는 눈 지역만)
const FLTW={crate:'crate',tent:'tent',campfire:'campfire',anvil:'anvil',fence:'fence',signpost:'signpost'},FLTWS={crate:'s_crate',tent:'s_tent',campfire:'s_campfire',anvil:'s_anvil',fence:'s_fence',signpost:'s_signpost',cart:'s_cart'};
function flTown(d){const PK=flPack('town');if(!PK){flNeed('town');return false}const sn=flRegPack()==='snow',kk=(sn?FLTWS:FLTW)[d.k];if(!kk)return false;const L=PK.meta.sp[kk],D=TWP[d.k];if(!L||!D)return false;
  const key=L[(d.pv|0)%L.length],r=PK.meta.r[key],s=D.h*(kk.endsWith('tent')?1:.78)/r[3],sx=d._s.x,sy=d._s.y;
  if(d.fl){ctx.save();ctx.translate(sx,sy);ctx.scale(-1,1);flDraw(ctx,PK,key,0,0,s);ctx.restore()}else flDraw(ctx,PK,key,sx,sy,s);return true}
{const _tp=twDrawProp;twDrawProp=function(d){if(flWant()&&!DG&&flTown(d))return;return _tp.apply(this,arguments)}}
// 산·눈 마을(서리·산채·숲지기 양식)의 평범한 집 → 통나무집 (상점·탑·큰 건물은 그대로, 사용자 06:43 「산·눈 마을만」)
const FLCAB=new Set(['frost','crag','elder']),FLCABS=new Set(['frost','crag']),FLCV=new Map();
function flCabin(b){if(!FLCAB.has(b.st)||(b.towers&&b.towers.length)||b.big||b.tall||b.mill)return null;const PK=flPack('cabin');if(!PK){flNeed('cabin');return null}
  const nm=(b.w>=b.d?'A':'B')+(FLCABS.has(b.st)?'s':''),key='cab/'+nm,r=PK.meta.r[key];if(!r)return null;
  const gw=(b.w+b.d)*KI,k=gw/PK.meta.cab[nm],ck=nm+'/'+Math.round(gw)+'/'+DPR;let e=FLCV.get(ck);
  if(!e){const sc=Math.max(1,DPR),cv=document.createElement('canvas');cv.width=Math.ceil(r[2]*k*sc);cv.height=Math.ceil(r[3]*k*sc);cv.getContext('2d').drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,cv.width,cv.height);
    e={cv,w:r[2]*k,h:r[3]*k,ax:r[4]*k,ay:r[5]*k,win:[],smoke:null,sign:null,flag:null};FLCV.set(ck,e)}
  return e}
{const _bs=twBldSprite;twBldSprite=function(b){if(flWant()){const e=flCabin(b);if(e)return e}return _bs.apply(this,arguments)}}
// [f8w] 쓰러질 때: 묶음에 쓰러지는 그림(die)이 있으면 그 그림을 차례로 보여 주고 흐려진다 (없으면 예전처럼 기울며 흐려짐). 그리기만, 시간·위치는 그대로
function flDie(g,e,x,y,u,ok){const t=TYPES[e.k];if(!t)return false;const id=FLTYPE[e.k]||FLDRAW[t.draw];if(!id)return false;const PK=flPack('m-'+id),M=PK&&PK.meta.mon[id];if(!M||!M.die)return false;
  const s=FLM.get(e)||{dx:0,dy:1},sx=(s.dx-s.dy),sy=(s.dx+s.dy)/2,di=(((Math.round((Math.atan2(sy,sx)-Math.PI)/(Math.PI/4)))%8)+8)%8;
  const fi=Math.min(M.die.n-1,Math.floor(u/.7*M.die.n)),key=M.die.f[fi][di],r=PK.meta.r[key],sc=(e.sc||(e.elite?1.25:1))*(ok||1),k=FL.mk[id]*sc,ta=flTintAmt(id,t.col);
  g.save();g.globalAlpha=u<.7?1:Math.max(0,1-(u-.7)/.3);g.translate(x,y);
  if(ta>0){const cv=flTinted(PK,key,t.col,ta);g.drawImage(cv,-r[4]*k,-r[5]*k,r[2]*k,r[3]*k)}else flDraw(g,PK,key,0,0,k);
  g.restore();return true}
{const _dm=drawMon;drawMon=function(g,e,x,y,o){if(o&&o.die!=null&&flWant()&&flDie(g,e,x,y,o.die,o.k))return;return _dm.apply(this,arguments)}}
// 쓰러진 몸은 새 물체라 바라보던 방향을 넘겨 준다
{const _md=monDie;monDie=function(e){const r=_md.apply(this,arguments),c=corpses[corpses.length-1],s=FLM.get(e);if(c&&s&&c.e.k===e.k)FLM.set(c.e,{x:c.e.x,y:c.e.y,dx:s.dx,dy:s.dy});return r}}
// ── [f9a] 0 A.D.(Wildfire Games, CC-BY-SA 3.0) 그림 묶음 덧붙이기 ─────────────────────────────
// f9b(Flare 기사·사도·망령·NPC 연결)와 합칠 때 겹치지 않도록 새 연결은 모두 이 덩어리 안에서 기존 표에 덧붙인다 (기존 줄은 그대로)
// 표범(draw 'panther', 4종): 0 A.D. 호랑이 모델 + 고양이과 동작을 어둡게 칠해 흑표범으로 (img/flare-m-panther.js)
// 설인(draw 'yeti', 6종): 0 A.D. 북극곰 모델 + 곰 동작 (img/flare-m-yeti.js). 네 발 짐승이지만 덩치 큰 눈 짐승으로 읽힌다
// 만드는 법: f9a-qa/tools/render0ad.py (+ panther0ad.json · yeti0ad.json) → pack0ad.py
Object.assign(FLDRAW,{panther:'panther',yeti:'yeti'});
Object.assign(FLMH,{panther:'panther',yeti:'yeti'});
Object.assign(FLREF,{panther:'#2a2726',yeti:'#dfe6f0'});
Object.assign(FLK,{panther:.9,yeti:.72}); // 길쭉한 고양이·곰은 앞모습 높이를 다 채우면 옆모습이 너무 커서 조금 작게
for(const dk of ['panther','yeti']){const _m=MON[dk];if(!_m)continue;
  MON[dk]=function(g,e,t,st){if(flWant()){const id=FLTYPE[e.k]||FLDRAW[dk];if(id&&flMon(id,dk,g,e,t,st))return}return _m.apply(this,arguments)}}
// 흰 곰은 'color' 칠로는 갈색 곰(잿빛 고원곰·천둥뿔 스카른)이 나오지 않아 곱하기로 칠한다: 원래 색(FLREF)이면 그대로, 어두운 색일수록 그 색으로 어둡게
const FLMUL={yeti:1};
{const _ft=flTinted;flTinted=function(PK,key,col,s){const id=key.slice(0,key.indexOf('/'));if(!FLMUL[id]||!FLREF[id])return _ft.apply(this,arguments);
  const ck=key+col+'*';let cv=FL.tint.get(ck);if(cv)return cv;if(FL.tint.size>500)FL.tint.clear();
  const r=PK.meta.r[key],a=Kit.hex(col),b=Kit.hex(FLREF[id]),m=[0,1,2].map(i=>Math.min(255,Math.round(a[i]/Math.max(1,b[i])*255)));
  cv=document.createElement('canvas');cv.width=r[2];cv.height=r[3];const g=cv.getContext('2d');g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);
  g.globalCompositeOperation='multiply';g.fillStyle='rgb('+m.join(',')+')';g.fillRect(0,0,r[2],r[3]);
  g.globalCompositeOperation='destination-in';g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);FL.tint.set(ck,cv);return cv}}
// 장식: 사막 대추야자·선인장 자리(0 A.D.엔 선인장이 없어 가시 많은 다육 덤불·아카시아 가시덤불), 바다 열대 야자·난파선, 들판 건초 더미
// f7r 장식 짜임(FLTP 지역 테마 → 묶음 차례, FLNEW 새 묶음 종류)에 묶음만 뒤에 덧붙인다: 앞 묶음(Flare)에 없는 종류만 여기서 찾는다. 묶음이 없으면 예전 코드 그림
// 산호·조개·용암 분기공·얼음 첨탑(coral·shell·vent·icespike)은 0 A.D.에 맞는 모델이 없어 코드 그림 그대로 (빙산·뾰족 바위로 만든 얼음 첨탑은 비닐 덩어리처럼 보여 뺐다). 만드는 법: f9a-qa/tools/render0ad_static.py (+ flora0ad.json) → pack0ad_flora.py
Object.assign(FLNEW,{'flora0ad-sand':['palm','cactus'],'flora0ad-sea':['palm','wreck'],'flora0ad-misc':['haystack']});
for(const th in FLTP)FLTP[th].push(...(th==='sand'?['flora0ad-sand','flora0ad-sea']:['flora0ad-sea','flora0ad-sand']),'flora0ad-misc');
// ── [f9a] 끝 ──────────────────────────────────────────────────────────────────────────────
window.__fl={FL,FLM,MON,MON_H,flGround,flRegPack,flTheme,flKM,drawMon:(...a)=>drawMon(...a)};
// [f7r] 지역을 옮기면 그 지역 묶음을 바로 받기 시작한다 (그리기 전에 도착하도록)
{const _lr=loadRegion;loadRegion=function(){const r=_lr.apply(this,arguments);if(flWant()&&location.hash!=='#qa')flLoad();return r}}
setTimeout(flLoad,0);
/* ===== [f9b] 기사·사도·망령 몬스터 + 마을 사람 그림 (이 덩어리만 f9b에서 더함, 다른 곳은 그대로) =====
   - 그림: Flare fantasycore 주인공 겹그림(images/avatar, 판갑·마법사 옷 등)을 한 장으로 합친 것 → img/flare-m-knight.js · m-apostle.js · m-wraith.js
           마을 사람: Flare fantasycore images/npcs(기사·조합원·농부 둘·농사꾼 여인 둘·떠돌이 상인) 숨쉬기 그림 + 걷기는 주인공 겹그림 → img/flare-folk.js
     모두 Clint Bellanger, Justin Nichol 외 (CC-BY-SA 3.0). 만드는 법: f9b-qa/tools/f9b-mon.py · f9b-npc.py
   - 망령: 색을 빼고 옷자락 아래를 투명하게 한 그림. 떠다니고(위아래로 흔들림) 품질 0이 아니면 반투명 + 빛.
   - 그림만 바뀐다: 크기(MON_H)·머리 위치·충돌·수치·저장·이름표·클릭 범위 그대로. 묶음이 없거나 「예전 그림」이면 코드 그림. */
Object.assign(FLDRAW,{knight:'knight',apostle:'apostle',wraith:'wraith'});
Object.assign(FLMH,{knight:'knight',apostle:'apostle',wraith:'wraith'});
Object.assign(FLREF,{knight:'#8a8a8e',apostle:'#7a5634',wraith:'#c4c4c4'});
// 크기: 이 묶음들은 무기(칼·지팡이)를 뺀 몸 높이(h)로 맞춘다 (서기 첫 장 꼭대기가 지팡이 끝일 때 작아지지 않게)
{const _fr=flReady;flReady=function(name){_fr(name);const PK=FL.P[name];for(const k in PK.meta.mon||{}){const M=PK.meta.mon[k];if(M.h)FL.mk[k]=MON_H[FLMH[k]]*1.3*(FLK[k]||1)/M.h}}}
for(const dk of ['knight','apostle','wraith']){const _m=MON[dk];if(!_m)continue;
  MON[dk]=function(g,e,t,st){if(flWant()){const id=FLTYPE[e.k]||FLDRAW[dk];
      if(dk!=='wraith'){if(flMon(id,dk,g,e,t,st))return}
      else{const lo=Q.lvl===0;g.save();g.translate(0,-5+Math.sin(st.t*2.2+(e.anim||0))*3);if(!lo)g.globalAlpha*=.8;const ok=flMon(id,dk,g,e,t,st);g.restore();
        if(ok){if(!lo){const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';mGlow(g,0,-MON_H.wraith*.62,MON_H.wraith*.62,Kit.rgb(Kit.hex(t.col||'#b49cff'),.5),.55);g.globalCompositeOperation=po}return}}}
    return _m.apply(this,arguments)}}
// 마을 사람: 모습(L)마다 가장 가까운 Flare 사람을 고르고, 윗옷·아래옷 색을 그 사람 색(L.body·L.legs·L.tabard)으로 입힌다
function flFolkHash(s){let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)/4294967296}
function flFolkArch(L){const h=flFolkHash(L.key),p=L.prop||'';
  if(L.armor)return 'guard';
  if(L.child)return L.dress?'woman2':'man2';
  if(L.dress)return L.skin?(Kit.hex(L.skin)[0]<190?'woman2':'woman1'):p==='staff'||p==='book'||p==='rod'||h<.4?'woman1':'woman2';
  if(p==='staff'||p==='pitchfork'||p==='rod')return 'man1';
  if(L.cape)return h<.5?'trader':'guild';
  if(L.apron||p==='hammer')return 'man2';
  return ['man1','man2','guild'][Math.floor(h*3)]}
const FLFW=new Map();// 최근 걷기 그림(f 1·2)을 부른 때 → 걷는 중인지 (부르는 곳이 여러 군데라 여기서 판단)
function flFolkSprite(L,f){const PK=flPack('folk');if(!PK){flNeed('folk');return undefined}const A=PK.meta.folk[flFolkArch(L)];if(!A)return undefined;
  const key=L.key||'x';if(f===1||f===2)FLFW.set(key,time);const mv=f===1||f===2||(f===0&&time-(FLFW.get(key)||-9)<.3);
  const ph=flFolkHash(key+'w'),fr=mv?A.w[Math.floor((time+ph)*10)%A.w.length]:A.s[f>=3?f-2:0],r=PK.meta.r[fr];if(!r)return undefined;
  const Ht=L.child?44:60,k=Ht/(mv?A.hw:A.hs);
  const c1=L.armor?(L.tabard||L.body):L.body,c2=L.dress?(L.body||L.legs):L.legs;
  return SC.get('flfolk/'+key+'/'+fr+'/'+c1+'/'+c2,r[2]*k,r[3]*k,r[4]*k,r[5]*k,(g,w,h)=>{g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,w,h);
    const s=g.getTransform().a,W=Math.max(1,Math.ceil(w*s)),H=Math.max(1,Math.ceil(h*s));
    for(const [mk,col] of [['/m1',c1],['/m2',c2]]){const m=PK.meta.r[fr+mk];if(!m||!col)continue;
      const t=document.createElement('canvas');t.width=W;t.height=H;const q=t.getContext('2d');q.drawImage(PK.img,m[0],m[1],m[2],m[3],0,0,W,H);q.globalCompositeOperation='source-in';q.fillStyle=col;q.fillRect(0,0,W,H);
      g.save();g.globalCompositeOperation='color';g.globalAlpha=.62;g.drawImage(t,0,0,w,h);g.restore()}
    g.save();g.globalCompositeOperation='destination-in';g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,w,h);g.restore()},{scale:Math.max(1.25,DPR)})}
// 묶음이 있으면 Flare 그림만 쓴다 (굽기 차례가 밀려 null이면 그 프레임은 비워 둔다: 코드 그림과 번갈아 깜빡이지 않게)
{const _fs=twFolkSprite;twFolkSprite=function(L,f){if(flWant()&&L){const e=flFolkSprite(L,f);if(e!==undefined)return e}return _fs.apply(this,arguments)}}
{const _fc=flCredit;flCredit=function(){_fc();const p=document.querySelector('#auCredits .flcr');if(p&&!p.dataset.f9b){p.dataset.f9b=1;p.textContent+=' · 기사·사도·망령·마을 사람 그림: Flare 주인공 겹그림·마을 사람 그림 (Clint Bellanger, Justin Nichol 외, CC-BY-SA 3.0)'}}}
window.__fl.twFolkSprite=(...a)=>twFolkSprite(...a);window.__fl.flFolkArch=flFolkArch;// 확인용 (window.__town의 것은 감싸기 전 함수)
/* ===== [f9b] 끝 ===== */
