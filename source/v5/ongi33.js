/* ---------- v33 옹기여신의 설원 전용 그림 (Codex가 그린 33장 · img/flare-cg-ongi.js 한 묶음) ----------
   「지금까지 완료된 작업들을 반영해서 다음 패치」(사용자 2026-10-15): v32의 색만 바꾼 임시 그림을 전용 그림으로.
   · 묶음은 옹기여신의 설원이나 신전 던전에 들어설 때만 받는다(다른 곳에서는 받지 않음). #qa에서는 받지 않는다(flNeed 규칙).
   · 그림이 없거나 「화면 · 그림: 예전 그림」이면 v32 그림 그대로.
   · 바뀌는 것: 보스 옹기돼지 · 가짜코 여신, 들판 몬스터 4 · 준보스 2, 쉼터 사람 3, 옹기여신 동상 · 신전 · 성소(쉼터 집 하나),
     옹기 · 실리콘 투사체, 들판 소품 7가지(통 · 술통 자리는 옹기 항아리), 설원 바닥 무늬, 던전 바닥 · 벽 · 횃불 + 던전 안 장식(가마 · 깨진 옹기 · 바닥 문양 · 입구 계단).
   · 그림만 바뀐다: 크기 · 충돌 · 적중 · 수치 · 저장은 그대로. */
const OG33={pk:'cg-ongi',base:undefined,T:null,san:null,dec:null,
  mon:{og_0:'ongi_mob_pot_ghost',og_1:'ongi_mob_kiln_mud',og_2:'ongi_mob_temple_knight',og_3:'ongi_mob_worshipper',m_og_toh:'ongi_mid_kiln_golem',m_og_priest:'ongi_mid_abyss_priest'},
  hk:{ongi_mob_pot_ghost:1.25,ongi_mob_kiln_mud:1.7,ongi_mob_temple_knight:1.35,ongi_mob_worshipper:1.2,ongi_mid_kiln_golem:1.3,ongi_mid_abyss_priest:1.3,ongi_boss_pig:1.2,ongi_boss_fakenose:1.25},
  folk:{og_mira:'ongi_npc_dodam',og_koko:'ongi_npc_coco',o_local_ongi:'ongi_npc_potter'},
  // 들판 소품: 종류 → [그림, 크기]
  prop:{snowpine:['ongi_prop_snow_pine',1.15],iceboulder:['ongi_prop_ice_rock',1.2],icespike:['ongi_prop_ice_spike',1],templestone:['ongi_prop_temple_stone',1.15],
    ruinpillar:['ongi_prop_ruin_pillar',1.5],frozenbones:['ongi_prop_frozen_bones',1.1],barrel:['ongi_prop_onggi_jar',1.3],kegs:['ongi_prop_onggi_jar',1.3]}};
function og33PK(){if(typeof flPack!=='function')return null;const PK=flPack(OG33.pk);return PK&&PK.meta&&PK.meta.r?PK:null}
const og33Here=()=>DG?!!(DG.d&&DG.d.og):!!(REG&&REG.id===OG32.reg);
function og33Need(){if(og33Here()&&typeof flNeed==='function')flNeed(OG33.pk)}
// 그림 한 장: (x,y) = 기준점(발밑) · k = 크기 · fl = 좌우 뒤집기
function og33Draw(c,key,x,y,k,fl){const PK=og33PK(),r=PK&&PK.meta.r[key];if(!r)return false;
  if(fl){c.save();c.translate(x,y);c.scale(-1,1);FLC.draw(c,PK.img,r[0],r[1],r[2],r[3],-r[4]*k,-r[5]*k,r[2]*k,r[3]*k);c.restore()}
  else FLC.draw(c,PK.img,r[0],r[1],r[2],r[3],x-r[4]*k,y-r[5]*k,r[2]*k,r[3]*k);return true}
{const _fl=flLoad;flLoad=function(){_fl.apply(this,arguments);og33Need();og33Ground()}}
{const _e=enterDungeon;enterDungeon=function(){const r=_e.apply(this,arguments);og33Need();og33DgDecor();og33Ground();return r}}
{const _l=leaveDungeon;leaveDungeon=function(){const r=_l.apply(this,arguments);og33Ground();return r}}
if(typeof netEnterDg==='function'){const _n=netEnterDg;netEnterDg=function(){const r=_n.apply(this,arguments);og33Need();og33DgDecor();return r}}
{const _r=flReady;flReady=function(name){const r=_r.apply(this,arguments);if(name===OG33.pk){OG33.T=null;og33Ground();if(typeof chunkStale==='function')chunkStale();if(typeof WB==='object')WB.dg=null}return r}}

/* ===== 몬스터 · 보스: 그림 한 장 (왼쪽 아래를 본다) → 오른쪽을 보는 우리 기본 모양에 맞춰 뒤집고, 걸음 · 공격 때 살짝 흔든다 ===== */
function og33Mon(g,e,t,st,key,hd){const PK=og33PK(),r=PK&&PK.meta.r[key];if(!r)return false;
  const H=(MON_H[hd]||50)*(OG33.hk[key]||1.15),k=H/r[5],L=Math.max(0,st.lunge||0),bob=Math.abs(Math.sin(st.ph*7))*st.mv*1.6;
  g.save();g.translate(L*4,-bob);g.scale(-1,1);if(L>0)g.scale(1+L*.06,1-L*.05);
  FLC.draw(g,PK.img,r[0],r[1],r[2],r[3],-r[4]*k,-r[5]*k,r[2]*k,r[3]*k);g.restore();st.head={x:0,y:-H};return true}
for(const id in OG33.mon){const t=TYPES[id];if(!t)continue;const hd=t.draw,om=MON[hd],nk='og33_'+id,key=OG33.mon[id];if(!om)continue;
  MON_H[nk]=MON_H[hd];if(typeof R22_HW==='object'&&R22_HW[hd]!=null)R22_HW[nk]=R22_HW[hd];
  MON[nk]=function(g,e,t,st){if(og33Mon(g,e,t,st,key,hd))return;return om.apply(this,arguments)};t.draw=nk}
{const _p=MON.ongipig;MON.ongipig=function(g,e,t,st){if(og33Mon(g,e,t,st,'ongi_boss_pig','ongipig'))return;return _p.apply(this,arguments)}}
{const _g=MON.ongigod;MON.ongigod=function(g,e,t,st){const PK=og33PK(),key='ongi_boss_fakenose',r=PK&&PK.meta.r[key];if(!r)return _g.apply(this,arguments);
  const fl=-3-Math.sin(st.t*2.2+(e.anim||0))*2.4,L=Math.max(0,st.lunge||0),H=MON_H.ongigod*OG33.hk[key],k=H/r[5],po=g.globalCompositeOperation;
  g.globalCompositeOperation='lighter';mGlow(g,0,-2,18,'rgba(255,190,214,.5)',.7);g.globalCompositeOperation=po;
  g.save();g.translate(0,fl);g.scale(-1,1);FLC.draw(g,PK.img,r[0],r[1],r[2],r[3],-r[4]*k,-r[5]*k,r[2]*k,r[3]*k);g.restore();
  const n=(PK.meta.pt&&PK.meta.pt[key]&&PK.meta.pt[key].nose)||[28,27],nx=-(n[0]-r[4])*k,ny=(n[1]-r[5])*k+fl;// 뒤집었으므로 x 부호 반대
  g.globalCompositeOperation='lighter';mGlow(g,nx,ny,3.4+L*5+Math.sin(st.t*6)*.8,'#ffd6e0',.9);if(L>0)mGlow(g,nx+4,ny,8*L,'#ffffff',.8);g.globalCompositeOperation=po;
  st.head={x:0,y:-H+fl}}}

/* ===== 투사체: 옹기(4칸 빙글) · 실리콘 화살 ===== */
{const _d=drawEProj;drawEProj=function(p,s){const PK=(p.col===OG_JAR||p.col===OG_SIL)?og33PK():null;if(!PK)return _d.apply(this,arguments);
  const po=ctx.globalCompositeOperation;
  if(p.col===OG_JAR){const f=reduceMotion?0:Math.floor(time*12+p.x*.01)&3;if(!og33Draw(ctx,'ongi_proj_pot_'+f,s.x,s.y,p.r/11*.8))return _d.apply(this,arguments);
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4;glow(s.x,s.y,p.r*2,'#ffb070');ctx.globalAlpha=1;ctx.globalCompositeOperation=po;return}
  const r=PK.meta.r.ongi_proj_silicone;if(!r)return _d.apply(this,arguments);const ang=Math.atan2((p.vx+p.vy)*KI/2,(p.vx-p.vy)*KI),k=p.r/6*1.35;
  ctx.save();ctx.translate(s.x,s.y);ctx.rotate(ang);FLC.draw(ctx,PK.img,r[0],r[1],r[2],r[3],-r[4]*k,-r[5]*k,r[2]*k,r[3]*k);ctx.restore();
  ctx.globalCompositeOperation='lighter';glow(s.x,s.y,p.r*2.6,'#ffd6e0');ctx.globalCompositeOperation=po}}

/* ===== 쉼터 사람 셋 ===== */
{const _f=twDrawFolk;twDrawFolk=function(d){const key=d.L&&OG33.folk[d.L.key],PK=key&&og33PK(),r=PK&&PK.meta.r[key];if(!r)return _f.apply(this,arguments);
  const s=d._s,bob=d.moving?-Math.abs(Math.sin(d.walkT*14))*1.6:0,k=66/r[5];
  og33Draw(ctx,key,s.x,s.y+bob,k,d.face>0);// 그림은 왼쪽을 본다
  const top=s.y-74,near=dist(P,d)<140,mk=typeof sqMark==='function'?sqMark(d):'';
  if(near||mk||(d.say&&time<d.sayT))QLBL.push({x:s.x,y:top,n:near||mk?d.n:'',mk,c:d.shopk?'#ffd27a':mk?'#ffe6a8':'#e8e2d2',say:d.say&&time<d.sayT?d.say:'',sa:clamp((d.sayT-time)*2,0,1),ph:d.x})}}

/* ===== 동상 · 신전 · 성소 ===== */
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(!(d.og&&d.k==='statue')||DG)return _rd.apply(this,arguments);const PK=og33PK(),r=PK&&PK.meta.r.ongi_statue;if(!r)return _rd.apply(this,arguments);
  const s=d._s,k=d.s||1;og33Draw(ctx,'ongi_statue',s.x,s.y,k);const top=r[5]*k+8;
  if(dist(P,d)<380){ctx.font=`600 13px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText('옹기여신 동상',s.x,s.y-top);ctx.fillStyle='#f3d2b0';ctx.fillText('옹기여신 동상',s.x,s.y-top)}
  return true}}
// 건물 그림 한 장을 바닥 칸(foot)에 맞춰: 그림 가로 = 바닥 마름모 가로 × w · 그림 맨 아래 = 바닥 앞 모서리
function og33Bld(d,key,w){const PK=og33PK(),r=PK&&PK.meta.r[key];if(!r||!d._s)return false;const F=d.foot[0],c=W2S((F[0]+F[2])/2,(F[1]+F[3])/2),fr=W2S(F[2],F[3]),gw=(F[2]-F[0]+F[3]-F[1])*KI,k=clamp(gw*w/r[2],.6,1.6);
  const x0=c.x-r[4]*k,y0=fr.y-r[5]*k,W=r[2]*k,H=r[3]*k;let a=1;
  if(!P.dead&&P._s){const ps=P._s,front=P.x>F[2]||P.y>F[3];if(!front&&dist(P,d)<420&&ps.x>x0+12&&ps.x<x0+W-12&&ps.y>y0+10&&ps.y<fr.y-10)a=.42}
  ctx.globalAlpha=a;FLC.draw(ctx,PK.img,r[0],r[1],r[2],r[3],x0,y0,W,H);ctx.globalAlpha=1;d._cg=1;d._cgDoor=W2S(d.door.x,d.door.y);if(TW.vis!==frameN){TW.vis=frameN;TW.visB.length=0}TW.visB.push(d);return true}
// 성소: 쉼터 집 둘 중 큰 것
{const L=RCACHE[OG32.reg],B=L&&(TW.blds[L.id]||[]).filter(b=>b.id!=='og_temple');if(B&&B.length){B.sort((a,b)=>b.W*b.D-a.W*a.D);OG33.san=B[0];B[0].og33san=1}}
if(typeof cgBld==='function'){const _cb=cgBld;cgBld=function(d){if(d.id==='og_temple'&&og33Bld(d,'ongi_temple',1.02))return true;if(d.og33san&&og33Bld(d,'ongi_sanctuary',1.08))return true;return _cb.apply(this,arguments)}}
// 그림 묶음(cg-town)을 아직 못 받았을 때도 신전 · 성소는 새 그림으로 (건물 그리기 입구에서 cgBld를 먼저 부르는 자리)
{const _db=typeof drawBld==='function'?drawBld:null;if(_db)drawBld=function(d){if((d.id==='og_temple'&&og33Bld(d,'ongi_temple',1.02))||(d.og33san&&og33Bld(d,'ongi_sanctuary',1.08)))return;return _db.apply(this,arguments)}}

/* ===== 들판 소품 · 바닥 ===== */
{const _dd=drawDecor;drawDecor=function(d){
  if(d.og33p)return og33DrawDgDecor(d);
  const m=!DG&&REG.id===OG32.reg&&OG33.prop[d.k];if(m&&d._s){const PK=og33PK();if(PK){const h=hash(Math.round(d.x),Math.round(d.y)),k=m[1]*(d.s||1)*(.88+h*.24);
      if(d.k==='kegs'){og33Draw(ctx,m[0],d._s.x-9,d._s.y-3,k,h>.5);og33Draw(ctx,m[0],d._s.x+8,d._s.y-2,k*.9,h<.5);og33Draw(ctx,m[0],d._s.x,d._s.y+4,k*1.05,false);return}
      if(og33Draw(ctx,m[0],d._s.x,d._s.y,k,h>.5))return}}
  return _dd.apply(this,arguments)}}
// 설원 바닥 무늬: 이 지역에 있는 동안만 눈 무늬(GTX.snow)를 옹기여신 설원 무늬로 (색은 지역 색 그대로)
function og33Tex(n){const PK=og33PK();if(!PK||typeof flTex!=='function')return null;const C=OG33.tx||(OG33.tx={});return C[n]||(C[n]=flTex(PK,n))}
function og33Ground(){const want=!DG&&REG&&REG.id===OG32.reg?og33Tex('ogsnow'):null;
  if(want){if(GTX.snow!==want){OG33.base=GTX.snow;GTX.snow=want;OG33.T=want;if(typeof chunkStale==='function')chunkStale()}}
  else if(OG33.T&&GTX.snow===OG33.T){if(OG33.base)GTX.snow=OG33.base;else delete GTX.snow;OG33.T=null;if(typeof chunkStale==='function')chunkStale()}}
if(typeof flGround==='function'){const _g=flGround;flGround=function(){if(OG33.T&&GTX.snow===OG33.T){if(OG33.base)GTX.snow=OG33.base;else delete GTX.snow;OG33.T=null}const r=_g.apply(this,arguments);og33Ground();return r}}
{const _lr=loadRegion;loadRegion=function(){const r=_lr.apply(this,arguments);og33Need();og33Ground();return r}}

/* ===== 던전: 바닥 · 벽 · 횃불 · 장식 ===== */
{const _p=dgPat;dgPat=function(g,name,col){const T=DG&&DG.d&&DG.d.og?og33Tex('ogfloor'):null;if(!T)return _p.apply(this,arguments);
  const key='og33'+name+col.join(',');let cv=DGTX[key];
  if(!cv){const n=T.cv.width;cv=document.createElement('canvas');cv.width=cv.height=n;const c2=cv.getContext('2d'),id=c2.createImageData(n,n);
    for(let i=0;i<n*n;i++){id.data[i*4]=T.rgb[i*3]*col[0]/128;id.data[i*4+1]=T.rgb[i*3+1]*col[1]/128;id.data[i*4+2]=T.rgb[i*3+2]*col[2]/128;id.data[i*4+3]=255}c2.putImageData(id,0,0);DGTX[key]=cv}
  const p=g.createPattern(cv,'repeat');p.setTransform(new DOMMatrix(ISOM.concat([0,0])));return p}}
// 벽 면: 그림의 돌벽 줄(윗단 아래 벽돌)을 면 무늬로 · 윗면 · 모서리는 v32와 같은 모양
function og33WallTex(){const PK=og33PK(),r=PK&&PK.meta.r.ongi_dun_wall;if(!r)return null;if(OG33.wt)return OG33.wt;
  const cv=document.createElement('canvas');cv.width=128;cv.height=44;cv.getContext('2d').drawImage(PK.img,r[0],r[1]+78,128,44,0,0,128,44);return OG33.wt=cv}
{const _w=wallSprite;wallSprite=function(d,h,v,pil){const T=d&&d.og?og33WallTex():null;if(!T)return _w.apply(this,arguments);const M=DGMAT[d.id]||DGMAT.barrow;
  return SC.get(`og33wall/${h}/${v}/${pil}`,176,h+100,88,h+52,g=>{g.translate(88,h+52);const A=[0,-37.5],B=[75,0],C=[0,37.5],D=[-75,0],rc=(c,k,a)=>`rgba(${Math.min(255,c[0]*k)|0},${Math.min(255,c[1]*k)|0},${Math.min(255,c[2]*k)|0},${a==null?1:a})`;
    const face=(o,dx,dy,dark)=>{g.save();g.transform(dx,dy,0,-1,o[0],o[1]);const s=100/128;
      for(let y=0,row=0;y<h;y+=44*s,row++){g.save();g.translate(0,y+44*s);g.scale(s,-s);for(let x=-((row*37+v*23)%128);x<128/s;x+=128)g.drawImage(T,x,0);g.restore()}
      g.fillStyle=`rgba(0,0,0,${dark})`;g.fillRect(0,0,100,h);
      const gr=g.createLinearGradient(0,0,0,46);gr.addColorStop(0,`rgba(${M.soot},.8)`);gr.addColorStop(1,`rgba(${M.soot},0)`);g.fillStyle=gr;g.fillRect(0,0,100,46);g.restore()};
    face(D,.75,.375,.05);face(B,-.75,.375,.36);
    const U=[A,B,C,D].map(p=>[p[0],p[1]-h]);g.beginPath();U.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=rc(M.top,1.05);g.fill();
    g.lineWidth=2;g.strokeStyle=rc(M.topDust,1.25,.55);g.beginPath();g.moveTo(U[3][0],U[3][1]);g.lineTo(U[2][0],U[2][1]);g.stroke();g.strokeStyle=rc(M.topDust,1,.3);g.beginPath();g.moveTo(U[2][0],U[2][1]);g.lineTo(U[1][0],U[1][1]);g.stroke();
    if(pil){const x0=-10,yb=C[1]+3,yt=C[1]-h-8;g.fillStyle=rc(M.brick,.95);g.fillRect(x0,yt,10,yb-yt);g.fillStyle=rc(M.brick,.62);g.fillRect(0,yt,10,yb-yt);g.fillStyle=rc(M.top,1.1);g.fillRect(x0-3,yt-5,26,7)}
    g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1;g.beginPath();g.moveTo(D[0],D[1]);g.lineTo(C[0],C[1]);g.lineTo(B[0],B[1]);g.stroke()},{force:1})}}
// 횃불: 분홍 불꽃까지 그려진 벽걸이 횃불 그림 (코드 불꽃은 그리지 않음 · 빛은 그대로)
{const _t=torchSprite;torchSprite=function(){const PK=DG&&DG.d&&DG.d.og?og33PK():null,r=PK&&PK.meta.r.ongi_dun_torch;if(!r)return _t.apply(this,arguments);
  return SC.get('dg/og33torch',r[2]+4,r[3]+4,r[4]+2,r[5]-4,g=>{g.drawImage(PK.img,r[0],r[1],r[2],r[3],2,2,r[2],r[3])},{force:1,pin:1})}}
{const _f=drawTorchFlame;drawTorchFlame=function(){if(DG&&DG.d&&DG.d.og&&og33PK()&&og33PK().meta.r.ongi_dun_torch)return;return _f.apply(this,arguments)}}
// 던전 안 장식 (그림 전용 · 충돌 없음): 입구 계단(나가는 문 뒤) · 보스 방 바닥 문양 · 준보스 방 가마 · 방마다 깨진 옹기
function og33DgDecor(){if(!(DG&&DG.d&&DG.d.og)){return}const s=mulberry(DG.rooms.length*977+DG.rooms[0].cx*31+DG.rooms[0].cy),L=[],ok=(x,y)=>dgFree(x,y,34);
  const ex=DG.portals[0];if(ex){const x=ex.x-120,y=ex.y-120;if(ok(x,y))L.push({x,y,key:'ongi_dun_entrance',k:1.1})}
  if(DG.boss){L.push({x:DG.boss.x,y:DG.boss.y,key:'ongi_dun_rune_floor',k:1.6,flat:1})}
  for(const r of DG.rooms.slice(1)){const c=tc(r.cx,r.cy);
    if(s()<.45){for(let n=0;n<6;n++){const x=c.x+(s()-.5)*r.w*TS*.7,y=c.y+(s()-.5)*r.h*TS*.7;if(ok(x,y)&&Math.hypot(x-c.x,y-c.y)>90){L.push({x,y,key:'ongi_dun_kiln',k:1});break}}}
    const n=1+(s()*2|0);for(let q=0;q<n;q++)for(let t=0;t<6;t++){const x=c.x+(s()-.5)*r.w*TS*.8,y=c.y+(s()-.5)*r.h*TS*.8;if(ok(x,y)){L.push({x,y,key:'ongi_dun_broken_pots',k:.9+s()*.4,fl:s()<.5});break}}}
  DG.og33=L.map(o=>Object.assign(o,{og33p:1}))}
function og33DrawDgDecor(d){if(d.flat)return true;return og33Draw(ctx,d.key,d._s.x,d._s.y,d.k,d.fl)}
if(typeof wbDraw==='function'){const _w=wbDraw;wbDraw=function(vis,ents){const r=_w.apply(this,arguments);if(DG&&DG.og33&&og33PK())for(const o of DG.og33){const s=W2S(o.x,o.y);if(!onScreen(s,160))continue;o._s=s;if(o.flat)continue;vis.push(o)}return r}}
// 바닥 문양: 땅 바로 위 (모든 물체 아래) · 은은히 숨 쉬는 보라 빛
{const _df=drawDungeonFloor;drawDungeonFloor=function(){const r=_df.apply(this,arguments);if(DG&&DG.og33&&og33PK())for(const o of DG.og33){if(!o.flat)continue;const s=W2S(o.x,o.y);if(!onScreen(s,200))continue;
    ctx.save();S();ctx.globalAlpha=.75+.2*Math.sin(time*1.6);og33Draw(ctx,o.key,s.x,s.y+64*o.k,o.k);ctx.restore()}return r}}
