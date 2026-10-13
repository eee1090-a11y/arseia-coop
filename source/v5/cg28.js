
/* ---------- [v28] 새 그림 (2026-10-12, 「ChatGPT 이미지 요청서」 스레드에서 검수한 그림 묶음) ----------
   - 그림은 game.html 옆 img/ 폴더의 flare-cg-town.js · flare-cg-decor.js · flare-cg-cliff.js · flare-cg-ground.js · flare-cg-dgent.js (Flare 묶음과 같은 모양).
   - 마을: 건물 · 노점 · 짝문 · 창고 · 분수 · 등불 · 우물 · 상징물 · 소품 · 건물 안 가구를 한 번에 그림으로 (그림과 도형을 한 마을에 섞지 않는다).
   - 들판 장식 · 절벽(윗면 마름모 + 옆면을 이어 붙임) · 산봉우리 · 바닥 무늬(색은 지금처럼 지역 색) · 던전 입구(+빛 층).
   - 3막 던전 문(#232)은 다시 받을 때까지 예전 그림. 던전 안 벽 · 지옥 지역 전용 물체는 다음 판.
   - 「화면」 설정 「그림: 예전 그림」이면 예전 그대로. 그림 파일이 없거나 못 읽으면 예전 그림 그대로.
   - 그림만 바뀐다: 크기 · 충돌 · 적중 · 수치 · 저장은 그대로. */
const CG={on:{},house:{},dec:{},cliff:{},peak:{},gtx:{},dg:{},TOWN:'cg-town',DEC:'cg-decor',CLF:'cg-cliff',GRD:'cg-ground',DGE:'cg-dgent'};
// 묶음이 도착하면 이름표를 정리해 둔다
function cgIndex(n,PK){const R=PK.meta.r;
  for(const k in R){let m;
    if(n===CG.TOWN&&(m=/^(\d{3})_house_([a-z]+)_([AB])_(.+)$/.exec(k))){const o=CG.house[m[2]+m[3]]||(CG.house[m[2]+m[3]]={});o[/왼쪽|left/.test(m[4])?'L':'R']=k}
    else if(n===CG.DEC&&(m=/^\d{3}_(?:rd|old)_([a-z]+)_variation_\d$/.exec(k)))(CG.dec[m[1]]||(CG.dec[m[1]]=[])).push(k);
    else if(n===CG.CLF&&(m=/^\d{3}_cliff_([a-z]+)_(top|face)_variation_\d$/.exec(k))){const o=CG.cliff[m[1]]||(CG.cliff[m[1]]={top:[],face:[]});o[m[2]].push(k)}
    else if(n===CG.CLF&&(m=/^\d{3}_peak_([a-z]+)_variation_\d$/.exec(k)))(CG.peak[m[1]]||(CG.peak[m[1]]=[])).push(k);
    else if(n===CG.GRD&&(m=/^\d{3}_gtx_([a-z]+)$/.exec(k)))CG.gtx[m[1]]=k;
    else if(n===CG.DGE&&(m=/^\d{3}_dgent_([a-z0-9]+)_(structure|glow)$/.exec(k))){const o=CG.dg[m[1]]||(CG.dg[m[1]]={});o[m[2]==='glow'?'g':'s']=k}}
  if(n===CG.GRD)Object.assign(CG.gtx,{flag:'200_flagstone_single',water:'201_water_single',lava:'202_lava_single',ice:'203_ice_single'});
  for(const o of [CG.dec,CG.cliff,CG.peak])for(const k in o){const v=o[k];if(Array.isArray(v))v.sort();else{v.top.sort();v.face.sort()}}
  CG.on[n]=1}
function cgPK(n){if(!flWant())return null;const PK=flPack(n);if(!PK){flNeed(n);return null}if(!CG.on[n])cgIndex(n,PK);return PK}
const cgR=(PK,k)=>k&&PK.meta.r[k];
function cgDraw(c,PK,k,x,y,s,fl){const r=PK.meta.r[k];if(!r)return false;s=s||1;
  if(fl){c.save();c.translate(x,y);c.scale(-1,1);c.drawImage(PK.img,r[0],r[1],r[2],r[3],-r[4]*s,-r[5]*s,r[2]*s,r[3]*s);c.restore()}
  else c.drawImage(PK.img,r[0],r[1],r[2],r[3],x-r[4]*s,y-r[5]*s,r[2]*s,r[3]*s);return true}
// 빛 층(흰 빛 그림)은 색을 곱해 더하기 섞기 (흰색 그대로 더하면 하얗게 날아간다)
function cgGlow(c,PK,k,x,y,col,a,anchor){const r=PK.meta.r[k];if(!r)return;const ax=anchor?anchor[4]:r[4],ay=anchor?anchor[5]:r[5];const tc=typeof flPkTint==='function'?flPkTint(PK,k,col,1,'m'):null;c.globalCompositeOperation='lighter';c.globalAlpha=a;
  if(tc)c.drawImage(tc,0,0,r[2],r[3],x-ax,y-ay,r[2],r[3]);else c.drawImage(PK.img,r[0],r[1],r[2],r[3],x-ax,y-ay,r[2],r[3]);c.globalAlpha=1;c.globalCompositeOperation='source-over'}
const cgLabel=(t,x,y,col,f)=>{ctx.font=(f||'700 13px ')+FONT;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(t,x,y);ctx.fillStyle=col;ctx.fillText(t,x,y)};

/* ===== 마을 건물 ===== */
const CGB={bren_chapel:'050_bren_chapel_불빛없음',bren_mill:'051_bren_mill_본체',bren_home:'052_bren_home',bren_smithy:'053_bren_smithy',haven_inn:'054_haven_inn',haven_store:'055_haven_store',
  will_tavern:'056_will_tavern',will_home:'057_will_home',arden_palace:'058_arden_palace',arden_academy:'059_arden_academy',arden_bakery:'060_arden_bakery',arden_lodge:'061_arden_lodge',
  arden_cathedral:'062_arden_cathedral',arden_knights:'063_arden_knights'};
// 방앗간 날개 축(그림 안 자리, 그림 px)
const CGMILL=[52,40];
function cgBldKey(d){const b=d.b;if(d.id&&CGB[d.id])return CGB[d.id];if(d.label==='페이스라인 성형외과')return '049_bren_clinic';
  const wf=d.flip?(b.door.face==='y'?'x':'y'):b.door.face,side=wf==='y'?'L':'R';// 문이 왼쪽 아래(+y)면 왼쪽아래 그림
  if(b.st==='arden')return '064_arden_townhouse_'+(side==='L'?'왼쪽아래':'오른쪽아래');
  const H=CG.house[b.st+(b.box?'B':'A')]||CG.house[b.st+'A']||CG.house[b.st+'B'];return H?H[side]||H.L||H.R:null}
function cgBld(d){const PK=cgPK(CG.TOWN);if(!PK)return false;const key=cgBldKey(d),r=cgR(PK,key);if(!r)return false;
  const s=d._s,W=d.W,D=d.D,gw=(W+D)*KI,k=Math.max(.8,Math.min(1.3,gw*1.05/r[2])),cx=s.x+(W-D)/2*KI,cy=s.y+(W+D)/4*KI,x0=cx-r[4]*k,y0=cy-r[5]*k,w=r[2]*k,h=r[3]*k;
  // 플레이어를 가리면 반투명 (예전과 같은 조건)
  let a=1;if(!P.dead&&P._s){const ps=P._s,front=P.x>d.foot[0][2]||P.y>d.foot[0][3];if(!front&&dist(P,d)<380&&ps.x>x0+12&&ps.x<x0+w-12&&ps.y>y0+10&&ps.y<cy+6)a=.42}
  ctx.globalAlpha=a;ctx.drawImage(PK.img,r[0],r[1],r[2],r[3],x0,y0,w,h);
  if(d.mill){const bl=cgR(PK,'065_tw_blade');if(bl){ctx.save();ctx.translate(x0+CGMILL[0]*k,y0+CGMILL[1]*k);ctx.rotate(reduceMotion?0:time*.7);ctx.drawImage(PK.img,bl[0],bl[1],bl[2],bl[3],-bl[2]/2*k*.9,-bl[3]/2*k*.9,bl[2]*k*.9,bl[3]*k*.9);ctx.restore()}}
  const dp=W2S(d.door.x,d.door.y);d._cgDoor=dp;
  if(d.signT){const sg=cgR(PK,'066_tw_sign');if(sg){const clinic=d.signT==='페이스라인성형외과',sx=dp.x-(clinic?20:0),sy=dp.y-(clinic?70:62);ctx.drawImage(PK.img,sg[0],sg[1],sg[2],sg[3],sx-sg[2]/2,sy-sg[3]/2,sg[2],sg[3]);
    ctx.font=`700 11px ${DISPLAY}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffe6a8';ctx.fillText(d.signT,sx,sy+1,sg[2]-16);ctx.textBaseline='alphabetic'}}
  ctx.globalAlpha=1;d._cg=1;
  if(TW.vis!==frameN){TW.vis=frameN;TW.visB.length=0}TW.visB.push(d);
  if(d.enter&&dist(P,d.door)<130)cgLabel(`${d.label} · 들어가기`,dp.x,dp.y-48-(d.signT?30:0),'#ffe6a8','600 12px ');
  return true}
{const _db=twDrawBld;twDrawBld=function(d){d._cg=0;if(!DG&&cgBld(d))return;return _db.apply(this,arguments)}}
// 밤: 그림 건물은 문 위 등불 빛 하나 (그림은 낮 그림이라 불빛이 없다)
{const _g=drawV5Glow;drawV5Glow=function(){_g();if(TW.vis!==frameN||IN)return;S();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5;
  for(const d of TW.visB)if(d._cg&&d._cgDoor)glow(d._cgDoor.x,d._cgDoor.y-34,16,'rgba(255,180,90,.9)');
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}

/* ===== 노점 (판매대 그림 + 간판 글씨) ===== */
const CGSTALL={weapon:'068_stall_weapon_바닥없음',armor:'069_stall_armor_single',general:'070_stall_general_single'};
{const _ts=twStall;twStall=function(type,st){const PK=DG?null:cgPK(CG.TOWN),key=CGSTALL[type],r=PK&&cgR(PK,key);if(!r)return _ts.apply(this,arguments);
  return SC.get('cgstall/'+type,120,130,r[4],r[5]+20,g=>{g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,20,r[2],r[3]);
    g.font=`700 11px ${DISPLAY}`;const lb=SHOPN[type]||'상점',tw2=g.measureText(lb).width+12,cx=r[4];
    Kit.solid(g,q=>{q.roundRect?q.roundRect(cx-tw2/2,2,tw2,15,3):q.rect(cx-tw2/2,2,tw2,15)},cx-tw2/2,2,cx+tw2/2,17,'#5a3a22',{tex:'wood',texA:.5,rim:'rgba(255,230,180,.6)'});
    g.fillStyle='#ffe6a8';g.textAlign='center';g.textBaseline='middle';g.fillText(lb,cx,9.6)},{scale:Math.max(1.25,DPR)})}}

/* ===== 마을 지형지물 (분수 · 등불 · 짝문 · 창고) ===== */
const CGL={fountain:[CG.DEC,'071_twl_fountain'],lamp:[CG.DEC,'072_twl_lamp'],gate:[CG.TOWN,'074_gate_body'],stash:[CG.TOWN,'073_stash_single']};
function cgLand(d){const L=CGL[d.k];if(!L)return false;const PK=cgPK(L[0]),T=cgPK(CG.TOWN);if(!PK||!T||!cgR(PK,L[1]))return false;const s=d._s,k=d.s||1,t=reduceMotion?0:time;
  cgDraw(ctx,PK,L[1],s.x,s.y,k);ctx.save();ctx.translate(s.x,s.y);ctx.scale(k,k);ctx.globalCompositeOperation='lighter';
  if(d.k==='lamp'){const f=reduceMotion?1:.92+.08*Math.sin(t*7+d.x);ctx.globalAlpha=.55*f;ctx.drawImage(Kit.glowCv('#ffd27a'),-22,-92,44,44)}
  else if(d.k==='gate'){cgGlow(ctx,T,'074_gate_glow',0,0,'#b9a2ff',.5+.25*Math.sin(t*2.2),T.meta.r['074_gate_body']);ctx.globalCompositeOperation='lighter'}
  else if(d.k==='fountain'){ctx.globalAlpha=.16+.06*Math.sin(t*2);ctx.drawImage(Kit.glowCv('#aae6ff'),-60,-60,120,56)}
  else if(d.k==='stash'){ctx.fillStyle=`rgba(255,210,120,${.16+.08*Math.sin(t*2.4)})`;circ(-4,-20,10)}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
  if(d.k==='stash')cgLabel('창고',2,-76,'#ffd27a');else if(d.k==='gate')cgLabel('짝문',0,-88,'#c9b4ff');
  ctx.restore();return true}
{const _tl=twLandDraw;twLandDraw=function(d){if(!DG&&cgLand(d))return true;return _tl.apply(this,arguments)}}

/* ===== 마을 소품 · 건물 안 가구 ===== */
const CGP={cart:'081_handcart_single',wagon:'082_wagon_single',crate:'083_crate_single',barrel:'084_barrel_single',sacks:'085_sacks_single',signpost:'088_signpost_single',tent:'089_tent_single',
  boat:'090_boat_single',nets:'091_net_rack_single',banner:'092_banner_single',campfire:'093_campfire_unlit_single',planter:'094_planter_single',gatetower:'096_castle_tower_single',trough:'097_trough_single',
  anvil:'098_anvil_single',herb:'099_herb_single',drift:'100_driftwood_single',kegs:'101_kegs_single',flowerbed:'102_flowerbed_single',pier:'103_pier_axis_y',sheep:'104_sheep_single',cat:'105_cat_single',
  table:'106_table_single',stool:'107_wood_chair_single',bed:'108_bed_single',shelf:'109_bookshelf_single',hearth:'110_hearth_unlit_single',counter:'111_counter_single',pew:'112_chapel_pew_single',
  altar:'113_altar_single',bellrope:'114_bell_rope_single',cauldron:'115_cauldron_single',orrery:'116_orrery_single',lectern:'117_lectern_single',candle:'118_candle_unlit_single',desk:'119_desk_single',
  rack:'120_weapon_rack_single',mannequin:'121_armor_mannequin_single',statue2:'078_royal_statue_single',bboard:'075_notice_board_single',edrum:'123_echo_drum_single',w3tent:'089_tent_single'};
const CGPX={mzgate:[CG.DGE,'231_mzgate_single']};// 다른 묶음에 든 소품
function cgPropKey(d){if(d.k==='fence')return d.pv&1?'086_fence_axis_y':'086_fence_axis_x';if(d.k==='cwall')return d.pv&1?'095_castle_wall_axis_y':'095_castle_wall_axis_x';
  if(d.k==='bench')return d.fl?'087_bench_front_right':'087_bench_front_left';return CGP[d.k]}
function cgProp(d){if(d.k==='well'){const PK=cgPK(CG.DEC);return PK?cgDraw(ctx,PK,'080_twp_well',d._s.x,d._s.y,1,d.fl):false}
  const X=CGPX[d.k],key=X?X[1]:cgPropKey(d);if(!key)return false;const PK=cgPK(X?X[0]:CG.TOWN);if(!PK||!cgR(PK,key))return false;const s=d._s;let y=s.y;
  if(d.k==='boat')y+=Math.sin(time*1.6+d.x)*1.6;if(d.k==='sheep'&&!reduceMotion)y-=Math.max(0,Math.sin(time*2+d.x))*.8;
  cgDraw(ctx,PK,key,s.x,y,1,d.fl&&d.k!=='bench');
  // 불 · 촛불 · 가마솥 김은 예전처럼 덧그림 (그림은 불 꺼진 그림)
  if(d.k==='campfire'||d.k==='hearth'){const f=Math.floor(time*12+d.x*.1)%4,yo=d.k==='hearth'?-30:-8;ctx.globalAlpha=.95;ctx.drawImage(flameCv('#ff9a40',f),s.x-12,s.y+yo-30,24,36);ctx.globalAlpha=1}
  if(d.k==='candle'||d.k==='altar'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6+.15*Math.sin(time*9+d.x);for(const ox of d.k==='candle'?[0]:[-12,12])glow(s.x+ox,s.y-(d.k==='candle'?62:70),6,'#ffcf7a');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  if(d.k==='cauldron'&&!reduceMotion){for(let i=0;i<3;i++){const k=(time*.6+i/3)%1;ctx.globalAlpha=(1-k)*.5;ctx.fillStyle='#8aff9a';circ(s.x+Math.sin(time*2+i)*4,s.y-34-k*26,2+k*3)}ctx.globalAlpha=1}
  if(d.use){const on=sqUseLive(d);if(on){const p=on.col||'#ffd34d',r=PK.meta.r[key];ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+.2*Math.sin(time*4);glow(s.x,s.y-12,26,p);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(dist(P,d)<260)cgLabel(on.label,s.x,s.y-(r[5]+6),p,'600 12px ')}}
  return true}
{const _tp=twDrawProp;twDrawProp=function(d){if(!DG&&cgProp(d))return;return _tp.apply(this,arguments)}}
// 우물(well)은 TWP 소품이 아닐 때도 있다: 지역 장식으로 그려지는 경우
const CGRD={statue:[CG.TOWN,'076_statue_false_nose_single'],facesign:[CG.TOWN,'077_faceline_sign_single'],well:[CG.DEC,'080_twp_well']};

/* ===== 들판 장식 ===== */
// 우리 장식 종류 → 그림 종류 (같은 이름은 그대로). 눈 지역 나무는 눈 덮인 소나무 · 죽은 나무
const CGDA={tree:'htree',bush:'hbush'},CGDS={htree:'hdead',tree:'hdead',hbirch:'hdead',hpine:'snowpine',pine:'snowpine'};
function cgDecKey(d){let k=CGDA[d.k]||d.k;if(flTheme&&flTheme()==='snow'&&CGDS[d.k])k=CGDS[d.k];const L=CG.dec[k];if(!L||!L.length)return null;return L[Math.floor((d.v||0)*L.length*.999)]}
function cgDec(c,d,x,y,k){if(DG)return false;const R=CGRD[d.k];if(R){const PK=cgPK(R[0]);if(PK&&d.k==='statue')return f29Statue(c,PK,d,x,y,(d.s||1)*(k||1));if(d.k==='facesign'&&d.f29host)return true;return PK?cgDraw(c,PK,R[1],x,y,(d.s||1)*(k||1)):false}
  const PK=cgPK(CG.DEC);if(!PK)return false;const key=cgDecKey(d);if(!key)return false;return cgDraw(c,PK,key,x,y,(d.s||1)*(k||1))}
{const _rd=RD.draw;RD.draw=function(c,d,x,y,k,t){if(d&&d.k!=='edgeportal'&&cgDec(c,d,x,y,k))return true;return _rd.apply(this,arguments)}}
{const _dd=drawDecor;drawDecor=function(d){if(!RD.D[d.k]&&d._s&&cgDec(ctx,d,d._s.x,d._s.y,1))return;return _dd.apply(this,arguments)}}

/* ===== 지역 문 (지역 경계 포탈) ===== */
function cgPortal(c,d,x,y,k,t){const PK=cgPK(CG.TOWN);if(!PK||!cgR(PK,'079_region_portal_structure'))return false;const col=d.col||'#9ad8ff',s=(d.s||1)*(k||1);
  c.save();c.translate(x,y);c.scale(s,s);cgDraw(c,PK,'079_region_portal_structure',0,0,1);
  cgGlow(c,PK,'079_region_portal_glow',0,0,col,(typeof flLo==='function'&&flLo())?.5:.42+.2*Math.sin((reduceMotion?0:t)*2.2),PK.meta.r['079_region_portal_structure']);
  if(d.label){c.font='700 13px '+FONT;c.textAlign='center';c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.85)';c.strokeText(d.label,0,-150);c.fillStyle=col;c.fillText(d.label,0,-150)}
  c.restore();return true}
{const _rd=RD.draw;RD.draw=function(c,d,x,y,k,t){if(d&&d.k==='edgeportal'&&!DG&&cgPortal(c,d,x,y,k,t))return true;return _rd.apply(this,arguments)}}

/* ===== 던전 입구 (+빛 층은 더하기 섞기) ===== */
function cgDgEnt(d){const c=d.cave;if(!c||c.w3k||typeof FLDG!=='object')return false;const A=FLDG[c.id]||['cave'],o=CG.dg[A[0]];const PK=cgPK(CG.DGE);if(!PK)return false;const O=CG.dg[A[0]];if(!O||!O.s)return false;
  const s=d._s,x=s.x,y=s.y,t=reduceMotion?0:time;cgDraw(ctx,PK,O.s,x,y,1);void o;
  if(O.g)cgGlow(ctx,PK,O.g,x,y,c.torch||'#ff9a40',(typeof flLo==='function'&&flLo())?.45:.38+.18*Math.sin(t*3));
  return true}
{const _dc=drawCave;drawCave=function(d){if(!DG&&cgDgEnt(d))return;return _dc.apply(this,arguments)}}

/* ===== 절벽 · 산봉우리 (예전과 같은 크기 · 기준점의 그림 한 장으로 구워 drawCliff는 그대로) ===== */
const CGFACE=79;// 옆면 그림 한 장이 덮는 벽 높이
function cgDark(g,w,h,F){if(F>=1)return;g.globalCompositeOperation='source-atop';g.fillStyle=`rgba(0,0,0,${(1-F).toFixed(2)})`;g.fillRect(-w,-h,w*3,h*3);g.globalCompositeOperation='source-over'}
{const _cs=cliffSprite;cliffSprite=function(th,h,v,dk,m){const PK=cgPK(CG.CLF),C=PK&&CG.cliff[th];if(!C||!C.top.length||!C.face.length)return _cs.apply(this,arguments);
  dk=dk||1;const F=[1,1,.8,.62,.48][dk],fk=C.face[(v|0)%C.face.length],tk=C.top[((v|0)>>1)%C.top.length],fr=PK.meta.r[fk],tr=PK.meta.r[tk];
  return SC.get(`cgcliff/${th}/${h}/${v}/${dk}`,176,h+120,88,h+60,g=>{g.translate(88,h+60);
    g.save();g.beginPath();g.moveTo(-75,0);g.lineTo(0,37.5);g.lineTo(75,0);g.lineTo(75,-h);g.lineTo(0,37.5-h);g.lineTo(-75,-h);g.closePath();g.clip();
    for(let y=-h;y<0;y+=CGFACE)g.drawImage(PK.img,fr[0],fr[1],fr[2],fr[3],-fr[4],y,fr[2],fr[3]);
    g.restore();g.drawImage(PK.img,tr[0],tr[1],tr[2],tr[3],-tr[4],37.5-h-tr[5],tr[2],tr[3]);cgDark(g,176,h+120,F)})}}
{const _ps=peakSprite;peakSprite=function(th,h,v,dk){const PK=cgPK(CG.CLF),L=PK&&CG.peak[th];if(!L||!L.length)return _ps.apply(this,arguments);
  dk=dk||1;const F=[1,1,.82,.66,.52][dk],key=L[(v|0)%L.length],r=PK.meta.r[key],k=Math.max(.6,Math.min(1.6,(h*.8+70)/r[3]));
  return SC.get(`cgpeak/${th}/${h}/${v}/${dk}`,220,h+150,110,h+70,g=>{g.translate(110,h+70);g.drawImage(PK.img,r[0],r[1],r[2],r[3],-r[4]*k,30-r[5]*k,r[2]*k,r[3]*k);cgDark(g,220,h+150,F)})}}

/* ===== 바닥 무늬 (색은 지역 색이 입힌다: 채널마다 평균 128로 맞춘 명암만) ===== */
function cgTex(PK,key){const r=PK.meta.r[key];if(!r)return null;const cv=document.createElement('canvas');cv.width=cv.height=256;const g=cv.getContext('2d');g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,256,256);
  const id=g.getImageData(0,0,256,256).data,n=256*256,rgb=new Uint8Array(n*3),h=new Float32Array(n),m=[0,0,0];for(let i=0;i<n;i++)for(let c=0;c<3;c++)m[c]+=id[i*4+c];for(let c=0;c<3;c++)m[c]/=n;
  for(let i=0;i<n;i++){let l=0;for(let c=0;c<3;c++){const v=Math.max(0,Math.min(255,id[i*4+c]/m[c]*128*.55+128*.45));rgb[i*3+c]=v;l+=v}h[i]=l/765-.5}return{rgb,h,cv}}
function cgGround(){const PK=flWant()&&flPack(CG.GRD);if(!PK)return false;if(!CG.on[CG.GRD])cgIndex(CG.GRD,PK);if(!CG.tex){CG.tex={};for(const n in CG.gtx){const t=cgTex(PK,CG.gtx[n]);if(t)CG.tex[n]=t}}
  Object.assign(GTX,CG.tex);FL.tint.clear();chunkStale();return true}
{const _fg=flGround;flGround=function(){_fg.apply(this,arguments);if(CG.tex&&flWant())Object.assign(GTX,CG.tex)}}

/* ===== 불러오기 ===== */
{const _rdy=flReady;flReady=function(name){_rdy.apply(this,arguments);if(name===CG.GRD)cgGround();else if(name===CG.TOWN||name===CG.DEC||name===CG.CLF)flIsoStale()}}
{const _fl=flLoad;flLoad=function(){_fl.apply(this,arguments);if(!flWant()||DG)return;for(const n of [CG.TOWN,CG.DEC,CG.CLF,CG.GRD])flNeed(n);if(decor.some(d=>d.k==='cave'))flNeed(CG.DGE)}}
{const _fc=flCredit;flCredit=function(){_fc();const p=document.querySelector('#auCredits .flcr');if(p&&!p.dataset.cg28){p.dataset.cg28=1;p.textContent+=' · v28 마을 건물·소품·가구·들판 장식·절벽·바닥 무늬·던전 입구: ChatGPT 이미지로 만든 그림(주인 제작)'}}}
setTimeout(()=>{try{if(window.__game)window.__game.CG=CG;window.__cg={CG,cgBldKey,cgPropKey,cgDecKey,cgGround}}catch(_){}},0);
