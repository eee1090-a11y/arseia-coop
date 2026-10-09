/* ---------- 그래픽 4단계: 땅 · 길 · 물 · 던전 바닥과 벽 ---------- */
// 텍스처는 "화면 좌표"로 붓질해 두고, 월드 → 화면 투영으로 읽는다. 그래서 붓질이 화면에서 눕지 않고 그대로 보인다.
const GT=256;
const ISOM=[1/(2*KI),-1/(2*KI),1/KI,1/KI]; // 화면 단위 → 월드 (setTransform a,b,c,d)
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
const GTX={};
// 재질 텍스처 붓질. 128 = 중간값. 결과 = 지역 색 × 텍스처/128 이고, 밝기는 높이(섞일 때 위로 솟는 정도)로도 쓴다.
function gtexPaint(name){
  const cv=document.createElement('canvas');cv.width=cv.height=GT;const g=cv.getContext('2d');let sd=7;for(const ch of name)sd=sd*31+ch.charCodeAt(0)|0;const s=mulberry(sd);
  const rc=(r,gg,b,a)=>`rgba(${r|0},${gg|0},${b|0},${a})`;
  const wrap=(x,y,r,f)=>{for(const dx of [-GT,0,GT])for(const dy of [-GT,0,GT]){const X=x+dx,Y=y+dy;if(X+r<0||X-r>GT||Y+r<0||Y-r>GT)continue;f(X,Y)}};
  const dab=(x,y,rx,ry,rot,col)=>wrap(x,y,Math.max(rx,ry)+1,(X,Y)=>{g.fillStyle=col;g.beginPath();g.ellipse(X,Y,rx,ry,rot,0,6.283);g.fill()});
  const crv=(x,y,cx,cy,ex,ey,w,col)=>wrap(x,y,Math.max(Math.abs(ex),Math.abs(ey),Math.abs(cx),Math.abs(cy))+w,(X,Y)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(X,Y);g.quadraticCurveTo(X+cx,Y+cy,X+ex,Y+ey);g.stroke()});
  const walk=(x,y,n,step,w,col,col2)=>{const pts=[[0,0]];let a=s()*6.283,px=0,py=0;for(let k=0;k<n;k++){a+=(s()-.5)*1.3;px+=Math.cos(a)*step;py+=Math.sin(a)*step*.55;pts.push([px,py])}
    wrap(x,y,n*step+2,(X,Y)=>{for(const [ww,cc,o] of col2?[[w*.7,col2,-.9],[w,col,0]]:[[w,col,0]]){g.strokeStyle=cc;g.lineWidth=ww;g.beginPath();pts.forEach((p,k)=>k?g.lineTo(X+p[0]+o,Y+p[1]+o):g.moveTo(X+p[0]+o,Y+p[1]+o));g.stroke()}})};
  const low=(n,r0,r1,a,cols)=>{for(let i=0;i<n;i++){const r=r0+s()*(r1-r0),c=cols[i%cols.length];dab(s()*GT,s()*GT,r,r*(.42+s()*.2),(s()-.5)*.5,rc(c[0],c[1],c[2],a))}};
  const pebbles=(n,r0,r1,tone,ta)=>{for(let i=0;i<n;i++){const x=s()*GT,y=s()*GT,r=r0+s()*(r1-r0),v=tone+(s()-.5)*ta,ry=r*(.5+s()*.15),ro=(s()-.5)*.6;
      dab(x+r*.35,y+r*.3,r*1.05,ry*1.05,ro,'rgba(40,36,32,.45)');dab(x,y,r,ry,ro,rc(v,v*.97,v*.92,.95));dab(x-r*.3,y-ry*.35,r*.5,ry*.4,ro,rc(v*1.3+20,v*1.28+20,v*1.2+18,.55))}};
  const specks=(n,a)=>{for(let i=0;i<n;i++){const v=s()<.5?60:200;g.fillStyle=rc(v,v,v,a*s());g.fillRect(s()*GT,s()*GT,1+s(),1)}};
  const fill=c=>{g.fillStyle=rc(c[0],c[1],c[2],1);g.fillRect(0,0,GT,GT)};
  g.lineCap='round';g.lineJoin='round';
  if(name==='grass'){fill([122,128,114]);low(60,18,48,.22,[[96,110,96],[150,150,112],[110,124,100],[140,136,104]]);
    for(let i=0;i<520;i++){const r=3+s()*6,c=s()<.5?[86,104,96]:[146,144,104];dab(s()*GT,s()*GT,r,r*.5,(s()-.5)*.4,rc(c[0],c[1],c[2],.32))}
    for(let i=0;i<2600;i++){const x=s()*GT,y=s()*GT,h=4+s()*8,l=(s()-.5)*6;
      crv(x,y,l*.2,-h*.55,l,-h,1+s()*.7,rc(64+s()*20,82+s()*20,76,.55));
      if(s()<.6)crv(x-.3,y-h*.35,l*.2,-h*.35,l*.9,-h*.62,.8+s()*.5,rc(150+s()*45,152+s()*35,100+s()*16,.6))}}
  else if(name==='dirt'||name==='road'){const rd=name==='road';fill(rd?[132,126,116]:[128,123,116]);low(55,16,46,.25,[[146,132,112],[104,100,98],[136,124,108],[112,106,100]]);
    for(let i=0;i<(rd?420:260);i++){const x=s()*GT,y=s()*GT,l=10+s()*(rd?40:24),v=s()<.5?96:162;crv(x,y,l*.5,(s()-.5)*3,l,(s()-.5)*3,1.5+s()*3.5,rc(v,v*.95,v*.88,.16))}
    pebbles(rd?240:150,1.1,rd?3.2:2.6,150,60);if(rd)pebbles(18,3.5,6,140,40);
    for(let i=0;i<(rd?6:14);i++)walk(s()*GT,s()*GT,6,5,.9,'rgba(56,50,44,.38)','rgba(190,180,160,.18)');specks(900,.3)}
  else if(name==='flag'){fill([58,54,50]);const rows=[];let y=0;while(y<GT){let hh=18+((s()*4)|0)*3;if(GT-y<36)hh=GT-y;rows.push([y,hh]);y+=hh}
    for(const [y0,chh] of rows){let x=-s()*20;const xs=[];while(x<GT-14){const w=18+s()*22;xs.push([x,w]);x+=w}xs.push([x,GT+xs[0][0]-x]);
      for(const [x0,cw] of xs){const j=()=>(s()-.5)*3,v=100+s()*60,hu=(s()-.5)*16;
      const pts=[[x0+1.8+j(),y0+1.8+j()],[x0+cw-1.8+j(),y0+1.8+j()],[x0+cw-1.8+j(),y0+chh-1.8+j()],[x0+1.8+j(),y0+chh-1.8+j()]];
      wrap(x0+cw/2,y0+chh/2,cw,(X,Y)=>{const dx=X-(x0+cw/2),dy=Y-(y0+chh/2),P=pts.map(p=>[p[0]+dx,p[1]+dy]);const path=()=>{g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()};
        path();g.fillStyle=rc(v+hu,v,v-hu*.6-6,1);g.fill();
        g.save();path();g.clip();for(let k=0;k<7;k++){const vv=s()<.5?v*.8:v*1.15;g.fillStyle=rc(vv,vv,vv*.95,.35);g.beginPath();g.ellipse(P[0][0]+s()*cw,P[0][1]+s()*chh,3+s()*7,3+s()*5,s()*3,0,6.283);g.fill()}
        if(s()<.25){g.strokeStyle='rgba(40,36,32,.5)';g.lineWidth=.8;g.beginPath();g.moveTo(P[0][0]+s()*cw,P[0][1]);g.lineTo(P[0][0]+s()*cw,P[0][1]+chh*s());g.stroke()}
        g.strokeStyle='rgba(30,26,22,.6)';g.lineWidth=2.6;g.beginPath();g.moveTo(P[1][0],P[1][1]);g.lineTo(P[2][0],P[2][1]);g.lineTo(P[3][0],P[3][1]);g.stroke();
        g.strokeStyle=rc(v*1.5,v*1.45,v*1.35,.55);g.lineWidth=1.8;g.beginPath();g.moveTo(P[3][0],P[3][1]);g.lineTo(P[0][0],P[0][1]);g.lineTo(P[1][0],P[1][1]);g.stroke();g.restore()})}}
    specks(700,.25)}
  else if(name==='sand'){fill([130,126,120]);low(50,20,50,.22,[[146,136,118],[112,108,104],[138,128,112]]);
    for(let i=0;i<26;i++){const x=s()*GT,y=s()*GT,l=60+s()*120,c=s()<.5;crv(x,y,l*.5,-10-s()*10,l,(s()-.5)*10,12+s()*16,c?'rgba(160,148,128,.14)':'rgba(96,86,80,.14)')}
    for(let i=0;i<110;i++){const x=s()*GT,y=s()*GT,l=40+s()*90,a=(s()-.5)*6;crv(x,y,l*.5,a-4,l,a,1.3,'rgba(170,160,140,.32)');crv(x,y+2.2,l*.5,a-2,l,a+2.2,1.4,'rgba(92,84,78,.26)')}
    pebbles(30,1,2.2,150,50);specks(2200,.32)}
  else if(name==='mud'){fill([118,116,112]);low(60,10,36,.32,[[88,86,84],[140,136,126],[104,100,94]]);
    for(let i=0;i<90;i++){const x=s()*GT,y=s()*GT,r=4+s()*10;dab(x,y,r,r*.42,0,'rgba(72,74,80,.5)');crv(x-r*.7,y-r*.25,r*.6,-r*.25,r*1.3,-r*.1,1,'rgba(200,205,210,.32)')}
    for(let i=0;i<160;i++){const x=s()*GT,y=s()*GT,l=8+s()*20;crv(x,y,l*.5,-1,l,0,.9,'rgba(190,190,180,.18)')}specks(600,.3)}
  else if(name==='leaf'){fill([108,110,100]);low(50,14,40,.3,[[96,122,86],[124,110,90],[86,92,84]]);
    for(let i=0;i<220;i++){const r=3+s()*8;dab(s()*GT,s()*GT,r,r*.5,0,rc(92+s()*20,128+s()*24,84,.4))}
    const LC=[[176,116,70],[150,100,70],[136,128,82],[172,150,86],[112,92,72],[122,132,86],[160,84,60]];
    for(let i=0;i<1100;i++){const x=s()*GT,y=s()*GT,rx=2.4+s()*2.6,ro=s()*6.283,c=LC[(s()*LC.length)|0];
      wrap(x,y,rx+2,(X,Y)=>{g.save();g.translate(X,Y);g.scale(1,.55);g.rotate(ro);g.fillStyle='rgba(40,34,28,.4)';g.beginPath();g.ellipse(.8,1.2,rx,rx*.42,0,0,6.283);g.fill();
        g.fillStyle=rc(c[0],c[1],c[2],.92);g.beginPath();g.moveTo(-rx,0);g.quadraticCurveTo(0,-rx*.6,rx,0);g.quadraticCurveTo(0,rx*.6,-rx,0);g.fill();
        g.strokeStyle=rc(c[0]*.7,c[1]*.7,c[2]*.7,.6);g.lineWidth=.5;g.beginPath();g.moveTo(-rx,0);g.lineTo(rx,0);g.stroke();g.restore()})}
    for(let i=0;i<40;i++){const x=s()*GT,y=s()*GT,l=8+s()*14;crv(x,y,l*.4,(s()-.5)*4,l,(s()-.5)*5,1,'rgba(60,46,36,.6)')}specks(500,.25)}
  else if(name==='ash'){fill([126,124,122]);low(55,14,44,.28,[[146,142,138],[100,96,94],[120,110,104]]);
    for(let i=0;i<420;i++){const r=.8+s()*2.4;dab(s()*GT,s()*GT,r,r*.6,s()*3,'rgba(46,42,40,.5)')}
    for(let i=0;i<90;i++){const r=4+s()*9;dab(s()*GT,s()*GT,r,r*.4,0,'rgba(178,174,168,.2)')}
    for(let i=0;i<30;i++)walk(s()*GT,s()*GT,7,5,1,'rgba(44,40,38,.5)','rgba(190,186,180,.2)');specks(900,.3)}
  else if(name==='snow'){fill([128,128,130]);low(60,16,46,.24,[[108,114,138],[150,150,152],[120,124,140]]);
    for(let i=0;i<140;i++){const x=s()*GT,y=s()*GT,l=20+s()*50;crv(x,y,l*.5,-2,l,0,2+s()*3,'rgba(160,160,164,.2)');crv(x,y+3,l*.5,1,l,3,1.2,'rgba(100,106,130,.18)')}
    for(let i=0;i<500;i++){g.fillStyle=`rgba(210,214,224,${.3+s()*.6})`;g.fillRect(s()*GT,s()*GT,1.2,1)}}
  else if(name==='rock'){fill([124,122,120]);low(60,12,40,.28,[[146,142,138],[100,98,98],[132,124,116]]);
    for(let i=0;i<46;i++)walk(s()*GT,s()*GT,8,6,1.4,'rgba(46,42,40,.6)','rgba(186,180,172,.3)');pebbles(60,1.2,3,140,50);specks(800,.3)}
  else if(name==='water'){fill([128,128,128]);low(50,20,50,.2,[[112,114,118],[144,144,140]]);
    for(let i=0;i<300;i++){const x=s()*GT,y=s()*GT,l=8+s()*22;crv(x,y,l*.5,-2.4,l,0,1,'rgba(184,190,196,.4)');crv(x,y+1.6,l*.5,-.6,l,1.6,1.2,'rgba(88,94,104,.3)')}}
  else if(name==='lava'){fill([84,84,84]);low(26,30,70,.3,[[130,130,130],[50,50,50]]);
    for(let i=0;i<30;i++){const x=s()*GT,y=s()*GT,l=40+s()*70;crv(x,y,l*.5,(s()-.5)*14,l,(s()-.5)*10,10+s()*10,'rgba(170,170,170,.22)')}
    for(let i=0;i<22;i++){const x=s()*GT,y=s()*GT;walk(x,y,10,8,9,'rgba(180,180,180,.22)');walk(x,y,10,8,3.2,'rgba(235,235,235,.7)')}
    low(30,26,60,.25,[[150,150,150]])}
  else if(name==='ice'){fill([132,132,134]);low(50,20,50,.22,[[150,152,156],[112,116,128]]);
    for(let i=0;i<40;i++){const x=s()*GT,y=s()*GT,l=30+s()*60,a=(s()-.5)*30;crv(x,y,l*.5,a*.5,l,a,1,'rgba(220,226,236,.45)');crv(x+1,y+1,l*.5,a*.5,l,a,1,'rgba(80,90,110,.3)')}
    for(let i=0;i<120;i++){const x=s()*GT,y=s()*GT,l=10+s()*30;crv(x,y,l*.5,-1,l,0,2,'rgba(190,196,206,.18)')}}
  const id=g.getImageData(0,0,GT,GT).data,n=GT*GT,rgb=new Uint8Array(n*3),h=new Float32Array(n);
  for(let i=0;i<n;i++){const r=id[i*4],gg=id[i*4+1],b=id[i*4+2];rgb[i*3]=r;rgb[i*3+1]=gg;rgb[i*3+2]=b;h[i]=(r*.3+gg*.5+b*.2)/255-.5}
  return GTX[name]={rgb,h,cv}}
const gtex=n=>GTX[n]||gtexPaint(n);
// 경계 흔들림용 반복 노이즈
const GNZ=(()=>{const a=new Float32Array(GT*GT),P=16,f=(x,y,p,sd)=>{const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),H=(a,b)=>hash(((a%p)+p)%p+sd,((b%p)+p)%p);
  const A=H(i,j),B=H(i+1,j),C=H(i,j+1),D=H(i+1,j+1);return A+(B-A)*u+(C-A)*v+(A-B-C+D)*u*v};
  for(let y=0;y<GT;y++)for(let x=0;x<GT;x++)a[y*GT+x]=f(x/GT*P,y/GT*P,P,101)*.55+f(x/GT*P*2,y/GT*P*2,P*2,202)*.3+f(x/GT*P*4,y/GT*P*4,P*4,303)*.15;return a})();

/* ---------- 지역 재질 표: 지역 → 재질별 [덮는 정도, 색] ---------- */
// 재질 칸: 여기에 없는 재질은 그 지역에 나오지 않는다. 덮는 정도가 높을수록 넓게 덮는다.
const GMAT=['grass','dirt','sand','mud','leaf','ash','snow','rock','road','flag'];
const GHK={grass:.55,dirt:.4,sand:.3,mud:.35,leaf:.5,ash:.4,snow:.35,rock:.5,road:.6,flag:.8}; // 텍스처 높이로 섞이는 세기
const GK=GMAT.length,GI={};GMAT.forEach((m,i)=>GI[m]=i);
const AREAS={
  // 홈: 마을 둘레
  brenhill:{m:{grass:[1,[86,108,50]],dirt:[.2,[108,88,60]],leaf:[-.1,[96,84,52]]},road:[116,98,68],plaza:[124,114,98],flowers:['#e07a96','#8aa8e8','#f0d870','#f4f0e4'],tuft:1,flower:1},
  willowen:{m:{grass:[1,[80,108,62]],sand:[.3,[136,120,90]],mud:[.15,[74,70,56]]},road:[118,102,76],plaza:[118,114,104],flowers:['#a8c8f0','#f4f0e4','#e8a0c0'],tuft:1,flower:.8},
  haven:{m:{grass:[.75,[104,104,54]],dirt:[.62,[128,104,70]]},road:[138,116,80],roadW:56,plaza:[128,114,94],flowers:['#f0c060','#d8a0d8'],tuft:.6,flower:.4},
  arden:{m:{grass:[.95,[78,98,56]],rock:[.15,[112,110,106]]},road:[150,146,136],roadFlag:1,plaza:[160,156,146],flowers:['#f4f0e4','#b0a0f0'],tuft:.7,flower:.5},
  // 홈: 바깥 (레벨 띠: 들판 → 안개숲 → 갈대 늪 → 잿빛 폐허 → 재의 황야)
  field:{m:{grass:[1,[80,98,46]],dirt:[.25,[100,84,58]],leaf:[.05,[90,80,50]]},road:[110,94,66],flowers:['#d8708a','#8aa8e0','#e8d070'],tuft:1,flower:.6},
  forest:{m:{leaf:[1,[78,72,46]],grass:[.75,[58,78,44]],mud:[.1,[56,52,40]]},road:[96,82,60],flowers:['#c8a0e0','#e0e0c0'],tuft:.7,flower:.2},
  swamp:{m:{mud:[.9,[56,58,42]],grass:[.85,[62,74,44]],leaf:[.2,[66,62,44]]},road:[90,80,62],tuft:.8,flower:.1},
  ruins:{m:{dirt:[.85,[78,70,58]],ash:[.55,[72,68,64]],grass:[.45,[64,68,48]],rock:[.3,[80,78,74]]},road:[92,84,72],tuft:.35},
  waste:{m:{ash:[1,[62,56,52]],rock:[.5,[58,52,50]],dirt:[.2,[64,54,46]]},road:[78,70,64],tuft:.05},
  // 던전 입구 둘레: 칙칙하고 어둡게
  barrow:{m:{leaf:[.7,[58,56,40]],mud:[.6,[48,46,36]],rock:[.4,[64,64,58]]},road:[78,70,56],tuft:.5,dark:.2},
  sewer:{m:{mud:[1,[46,52,46]],sand:[.3,[78,76,64]],grass:[.5,[50,64,46]]},road:[76,74,62],tuft:.5,dark:.2},
  fort:{m:{ash:[1,[54,52,52]],rock:[.75,[50,48,48]]},road:[70,66,62],tuft:.1,dark:.25},
  sanctum:{m:{ash:[1,[70,50,44]],rock:[.6,[60,42,38]]},road:[80,60,52],tuft:.05,dark:.25},
};
// 새 지역 7곳: 기존 테마(th.pal, deep, paint)를 같은 표에 옮긴다. near = 마을 쪽, far = 깊은 곳(th.deep 쪽으로 어둡게)
const mulc=(c,k)=>[c[0]*k[0],c[1]*k[1],c[2]*k[2]];
const REGION_GROUND={
  meadow:th=>({m:{grass:[1,mulc(th.pal[0],[1.05,1.12,1.1])],dirt:[.3,mulc(th.pal[1],[1.25,1.05,1.1])],sand:[.05,mulc(th.pal[0],[1.4,1.3,1.4])]},road:mulc(th.pal[0],[1.45,1.3,1.5]),flowers:th.fcol,tuft:1.1,flower:1}),
  lush:th=>({m:{grass:[1,mulc(th.pal[0],[1.25,1.25,1.2])],leaf:[.6,mulc(th.pal[1],[2,1.45,1.4])],mud:[.2,mulc(th.pal[1],[1.5,1.15,1])]},road:mulc(th.pal[1],[2.6,1.8,1.6]),flowers:th.fcol,tuft:1,flower:.5}),
  sand:th=>({m:{sand:[1,th.pal[0]],rock:[.3,mulc(th.pal[1],[.92,.9,.92])],dirt:[.1,th.pal[1]]},road:mulc(th.pal[0],[1.08,1.05,1.04]),tuft:.08}),
  snow:th=>({m:{snow:[1,th.pal[0]],rock:[.18,mulc(th.pal[1],[.62,.66,.7])]},road:mulc(th.pal[1],[.92,.92,.95]),tuft:.15}),
  lava:th=>({m:{rock:[1,th.pal[0]],ash:[.6,mulc(th.pal[1],[1.25,1.25,1.25])]},road:mulc(th.pal[0],[1.3,1.25,1.2]),tuft:0}),
  beach:th=>({m:{sand:[1,th.pal[0]],grass:[.35,[78,104,58]],rock:[.08,[110,104,92]]},road:mulc(th.pal[0],[1.06,1.02,.98]),flowers:['#f4f0e4','#ff8aa0'],tuft:.5,flower:.3}),
};
const RGCACHE={};
function regionAreas(){const id=REG.id;if(RGCACHE[id])return RGCACHE[id];const th=REG.th,near=REGION_GROUND[th.paint](th),far=JSON.parse(JSON.stringify(near));
  const k=[th.deep[0]/th.pal[0][0],th.deep[1]/th.pal[0][1],th.deep[2]/th.pal[0][2]].map(v=>clamp(v,.5,1));
  for(const m in far.m)if(far.m[m])far.m[m][1]=mulc(far.m[m][1],k);far.dark=.05;
  return RGCACHE[id]={near,far}}
// 한 점의 재질 점수(s), 재질 색(t), 물(L), 밝기 변화를 구한다
const GF={s:new Float32Array(GK),t:new Float32Array(GK*3),L:0},GAW=[];
const BANDC=[2,6,10.5,17,27],BANDS=['field','forest','swamp','ruins','waste'];
function areaWeights(x,y){GAW.length=0;
  if(REG.th){const A=regionAreas(),t0=TOWNS[0],dp=t0?clamp((Math.hypot(x-t0.x,y-t0.y)-SAFE)/4200,0,1)*.6:0;GAW.push([A.near,1-dp],[A.far,dp]);return dp}
  let T=0;const tw=[];for(const t of TOWNS){const d=Math.hypot(x-t.x,y-t.y);let w=clamp(1-(d-380)/900,0,1);w=w*w*(3-2*w);if(w>0){tw.push([AREAS[t.id]||AREAS.brenhill,w]);T+=w}}
  const sc=T>1?1/T:1;let rest=1;for(const [a,w] of tw){GAW.push([a,w*sc]);rest-=w*sc}
  const l=levelAt(x,y);
  if(rest>.001){let p=0;while(p<BANDC.length-1&&l>BANDC[p+1])p++;const f=p>=BANDC.length-1?0:clamp((l-BANDC[p])/(BANDC[p+1]-BANDC[p]),0,1);
    GAW.push([AREAS[BANDS[p]],rest*(1-f)]);if(f>0)GAW.push([AREAS[BANDS[p+1]],rest*f])}
  let cw=0,ca=null;for(const c of CAVES){if(!c.cave)continue;const d=Math.hypot(x-c.x,y-c.y);let w=clamp(1-(d-140)/620,0,1);w=w*w*(3-2*w);if(w>cw){cw=w;ca=AREAS[c.cave.id]}}
  if(cw>0&&ca){for(const e of GAW)e[1]*=1-cw;GAW.push([ca,cw])}
  return clamp((l-4)/26,0,1)}
const GSEED=[11,23,37,41,53,67,79,83,97,101],GTW=new Float32Array(GK);
function fieldAt(x,y,segs,F){const far=areaWeights(x,y),s=F.s,t=F.t;
  for(let k=0;k<GK;k++){s[k]=0;t[k*3]=t[k*3+1]=t[k*3+2]=0}
  const tw=GTW;tw.fill(0);let dark=0,roadC=[0,0,0],roadF=0,plazaC=[0,0,0],tuft=0,roadW=0;
  for(const [a,w] of GAW){if(w<=0)continue;for(let k=0;k<GK;k++){const e=a.m[GMAT[k]];if(e){s[k]+=w*e[0];t[k*3]+=w*e[1][0];t[k*3+1]+=w*e[1][1];t[k*3+2]+=w*e[1][2];tw[k]+=w}else s[k]-=w*2.2}
    dark+=w*(a.dark||0);const rc=a.road||[110,94,66];roadC[0]+=rc[0]*w;roadC[1]+=rc[1]*w;roadC[2]+=rc[2]*w;roadF+=w*(a.roadFlag||0);roadW+=w*(a.roadW||44);
    const pc=a.plaza||a.road||[120,110,96];plazaC[0]+=pc[0]*w;plazaC[1]+=pc[1]*w;plazaC[2]+=pc[2]*w;tuft+=w*(a.tuft||0)}
  for(let k=0;k<8;k++){if(tw[k]>0){t[k*3]/=tw[k];t[k*3+1]/=tw[k];t[k*3+2]/=tw[k]}else{t[k*3]=90;t[k*3+1]=86;t[k*3+2]=70}
    if(s[k]>-1.6)s[k]+=(fbm(x/230,y/230,GSEED[k])-.5)*1.5+(k&&tw[k]>0?(fbm(x/90,y/90,GSEED[k]+200)-.5)*1.2:0)}
  // [그래픽 v20] 절벽 발치: 굴러 내려온 자갈·바위 부스러기 띠 (그림만, 막히는 칸은 그대로)
  if(!DG&&typeof TGRID!=='undefined'&&TGRID&&TGRID.w){const ci=Math.floor(x/100),cj=Math.floor(y/100);let dm=1e9;
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!terrWallIJ(ci+di,cj+dj))continue;const x0=(ci+di)*100,y0=(cj+dj)*100,dx=Math.max(x0-x,0,x-x0-100),dy=Math.max(y0-y,0,y-y0-100),d=Math.hypot(dx,dy);if(d<dm)dm=d}
    if(dm<60){const R=GI.rock,f=(1-dm/60)*(.4+fbm(x/36,y/36,141)*1.1);s[R]=Math.max(s[R],-.9+f*3);
      if(tw[R]<=0){const c=TTHEME[terrTheme(REG.id,x,y)].rock;t[R*3]=c[0]*.72;t[R*3+1]=c[1]*.72;t[R*3+2]=c[2]*.72}}}
  t[24]=roadC[0];t[25]=roadC[1];t[26]=roadC[2];t[27]=plazaC[0];t[28]=plazaC[1];t[29]=plazaC[2];s[8]=s[9]=-5;
  F.tuft=tuft;
  if(segs){// 길: 가장자리를 노이즈로 흔들어 풀과 섞는다
    let d=1e9;for(const q of segs){const v=segDist(x,y,q[0],q[1],q[2],q[3]);if(v<d)d=v}
    if(d<90){const hw=roadW/2+(fbm(x/60,y/60,5)-.5)*16,rs=.95+(hw-d)/20;if(roadF>.5)s[9]=Math.max(s[9],rs);else s[8]=rs;F.rd=d}else F.rd=1e9;
    for(const tn of TOWNS){const d2=Math.hypot(x-tn.x,y-tn.y),R0=TOWN_R+70;if(d2<R0+60){s[9]=Math.max(s[9],1+(R0-d2+(fbm(x/50,y/50,9)-.5)*50)/28)}}}
  // 넓은 밝기 얼룩 + 먼 곳/던전 둘레는 어둡고 탁하게
  const dune=REG.th&&(REG.th.paint==='sand')?1+Math.sin((x*.55+y)/46+fbm(x/400,y/400,88)*7)*.07*smooth(-.5,.6,s[GI.sand]):1;// [그래픽 v20] 모래 물결
  const lum=dune*(1+(fbm(x/520,y/520,77)-.5)*.32)*(1-far*.3-dark),ds=far*.45+dark,hv=(fbm(x/380,y/380,61)-.5)*.5;
  for(let k=0;k<GK;k++){let r=t[k*3],g=t[k*3+1],b=t[k*3+2];const gy=(r+g+b)/3;r+=(gy-r)*ds;g+=(gy-g)*ds;b+=(gy-b)*ds;t[k*3]=r*lum*(1+hv*.35);t[k*3+1]=g*lum*(1+hv*.1);t[k*3+2]=b*lum*(1-hv*.4)}
  F.L=LQ?liqAt(x,y):0;return F}
// 미니맵 · 아직 안 구운 조각용 평균 색 (길 제외)
function groundRGB(x,y){const F=fieldAt(x,y,null,GF),s=F.s;let best=-1e9;for(let k=0;k<GK;k++)if(s[k]>best)best=s[k];
  let r=0,g=0,b=0,ws=0;for(let k=0;k<GK;k++){const w=Math.max(0,1-(best-s[k])*2.5);if(w<=0)continue;ws+=w;r+=F.t[k*3]*w;g+=F.t[k*3+1]*w;b+=F.t[k*3+2]*w}r/=ws;g/=ws;b/=ws;
  if(F.L>.3&&REG.th){const lc=REG.th.liq.col,a=smooth(.35,.6,F.L);r+=(lc[0]-r)*a;g+=(lc[1]-g)*a;b+=(lc[2]-b)*a}
  return[r*.75,g*.75,b*.75]}
const regionRGB=groundRGB;
// 용암 색 (열 → 색)
const LAVA_LUT=(()=>{const a=new Uint8Array(256*3),st=[[0,[24,12,10]],[.3,[60,18,10]],[.5,[170,40,12]],[.7,[240,110,30]],[.86,[255,190,70]],[1,[255,236,160]]];
  for(let i=0;i<256;i++){const v=i/255;let k=0;while(k<st.length-2&&v>st[k+1][0])k++;const [a0,c0]=st[k],[a1,c1]=st[k+1],f=clamp((v-a0)/(a1-a0),0,1);for(let c=0;c<3;c++)a[i*3+c]=c0[c]+(c1[c]-c0[c])*f}return a})();

/* ---------- 조각 굽기 ---------- */
const GG=16,GMG=2,GNG=CH/GG+GMG*2+1;
const GSC={};// 흩뿌림 스프라이트 캐시
function gSpr(kind,v,col){const q=c=>Math.round(c/10)*10,key=kind+v+(col?q(col[0])+','+q(col[1])+','+q(col[2]):'');let e=GSC[key];if(e)return e;
  if(Object.keys(GSC).length>320)for(const k in GSC)delete GSC[k];
  const S2=2,w=kind==='tuft'||kind==='reed'?24:16,h=kind==='tuft'?18:kind==='reed'?26:12,cv=document.createElement('canvas');cv.width=w*S2;cv.height=h*S2;const g=cv.getContext('2d');g.scale(S2,S2);
  const s=mulberry(v*131+kind.length*7),c=col?[q(col[0]),q(col[1]),q(col[2])]:[120,110,90],R2=(k,a)=>`rgba(${Math.min(255,c[0]*k)|0},${Math.min(255,c[1]*k)|0},${Math.min(255,c[2]*k)|0},${a})`;
  g.lineCap='round';const bx=w/2,by=h-3;
  if(kind==='tuft'||kind==='reed'){const n=kind==='reed'?6:6+v%4,H=kind==='reed'?20:10;g.fillStyle='rgba(0,0,0,.14)';g.beginPath();g.ellipse(bx+2,by+.5,6,1.8,0,0,6.283);g.fill();
    for(let i=0;i<n;i++){const ox=(s()-.5)*8,hh=H*(.55+s()*.6),l=(s()-.5)*7+ox*.4;
      g.strokeStyle=R2(.68,.75);g.lineWidth=1.4;g.beginPath();g.moveTo(bx+ox,by);g.quadraticCurveTo(bx+ox+l*.2,by-hh*.6,bx+ox+l,by-hh);g.stroke();
      g.strokeStyle=R2(1.35,.85);g.lineWidth=.9;g.beginPath();g.moveTo(bx+ox+l*.1,by-hh*.35);g.quadraticCurveTo(bx+ox+l*.3,by-hh*.7,bx+ox+l,by-hh);g.stroke()}
    if(kind==='reed'){g.fillStyle='#4a3a26';for(let i=0;i<2;i++){g.beginPath();g.ellipse(bx+(i?3:-2),by-17+i*2,1.4,3.2,0,0,6.283);g.fill()}}}
  else if(kind==='flower'){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(bx+1.5,by,5,1.6,0,0,6.283);g.fill();
    for(let i=0;i<3;i++){g.strokeStyle='rgba(50,78,40,.9)';g.lineWidth=.9;const ox=(i-1)*2.6;g.beginPath();g.moveTo(bx+ox*.4,by);g.quadraticCurveTo(bx+ox,by-3,bx+ox,by-5-i%2*1.5);g.stroke()}
    const fc=col?`rgb(${c[0]},${c[1]},${c[2]})`:'#e080a0';for(let i=0;i<3;i++){const fx=bx+(i-1)*2.6,fy=by-5.6-i%2*1.5;g.fillStyle=fc;for(let p=0;p<5;p++){const a=p*1.2566;g.beginPath();g.ellipse(fx+Math.cos(a)*1.3,fy+Math.sin(a)*.8,1.1,.8,a,0,6.283);g.fill()}
      g.fillStyle='rgba(255,240,170,.95)';g.beginPath();g.arc(fx,fy,.7,0,6.283);g.fill()}}
  else if(kind==='pebble'){const r=2.4+v%3*.9,ry=r*.55;g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(bx+1,by+.6,r+.6,ry+.4,0,0,6.283);g.fill();
    g.fillStyle=R2(1,1);g.beginPath();g.ellipse(bx,by-ry*.5,r,ry*1.1,(s()-.5)*.5,0,6.283);g.fill();g.fillStyle=R2(1.45,.7);g.beginPath();g.ellipse(bx-r*.35,by-ry*1.05,r*.45,ry*.38,0,0,6.283);g.fill()}
  else if(kind==='leaf'){g.save();g.translate(bx,by-2);g.scale(1,.55);g.rotate(s()*6.283);g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(.8,1.4,4,1.8,0,0,6.283);g.fill();
    g.fillStyle=R2(1,1);g.beginPath();g.moveTo(-4,0);g.quadraticCurveTo(0,-2.6,4,0);g.quadraticCurveTo(0,2.6,-4,0);g.fill();g.strokeStyle=R2(.65,.8);g.lineWidth=.5;g.beginPath();g.moveTo(-4,0);g.lineTo(4,0);g.stroke();g.restore()}
  else if(kind==='twig'){g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1.6;g.beginPath();g.moveTo(2,by+1);g.lineTo(w-2,by-2);g.stroke();g.strokeStyle=R2(1,1);g.lineWidth=1.1;g.beginPath();g.moveTo(2,by);g.lineTo(w-3,by-3);g.moveTo(w*.55,by-1.6);g.lineTo(w*.7,by-5);g.stroke()}
  else if(kind==='bone'){g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(bx+1,by+.5,6,1.8,0,0,6.283);g.fill();g.save();g.translate(bx,by-1.5);g.rotate((s()-.5)*.8);
    g.strokeStyle='#cfc4aa';g.lineWidth=1.8;g.beginPath();g.moveTo(-4.5,0);g.lineTo(4.5,0);g.stroke();g.fillStyle='#ddd2b8';for(const x of [-4.5,4.5])for(const y of [-.9,.9]){g.beginPath();g.arc(x,y,1.1,0,6.283);g.fill()}g.restore();
    if(v%3===0){g.fillStyle='#d8ccb0';g.beginPath();g.ellipse(bx+4,by-3.4,2.6,2.2,0,0,6.283);g.fill();g.fillStyle='#2a2420';g.fillRect(bx+3,by-3.8,1,1);g.fillRect(bx+4.8,by-3.8,1,1)}}
  return GSC[key]={cv,w,h,ax:bx,ay:by}}
// 조각 안에 화면 방향 스프라이트를 놓는다 (월드 좌표 x,y)
function gPut(g,sc,ox,oy,e,x,y,k){k=k||1;g.setTransform(sc*ISOM[0]*k,sc*ISOM[1]*k,sc*ISOM[2]*k,sc*ISOM[3]*k,sc*(x-ox),sc*(y-oy));g.drawImage(e.cv,-e.ax,-e.ay,e.w,e.h)}
const gBuf={};
function gArr(n,len){return new Float32Array(len)} // 일감마다 따로 (나눠 굽는 동안 섞이지 않게)
const GSTAT={n:0,ms:0,last:0,sl:[]};
// 한 조각 굽기는 여러 프레임에 나눠 한다 (yield 마다 쉬어 갈 수 있음)
function* paintChunkG(g,ox,oy){const sc=g.getTransform().a;let fx=null;
  if(DG)paintDungeonChunk(g,ox,oy,sc);else fx=yield* paintGround(g,ox,oy,sc);
  g.setTransform(sc,0,0,sc,0,0);return fx}
function paintChunk(g,ox,oy){const t0=performance.now(),it=paintChunkG(g,ox,oy);let r;while(!(r=it.next()).done);const dt=performance.now()-t0;GSTAT.n++;GSTAT.ms+=dt;return r.value}
function* paintGround(g,ox,oy,sc){
  const N=Math.round(CH*sc),inv=CH/N,NG=GNG,gx0=ox-GMG*GG,gy0=oy-GMG*GG;
  // 이 조각 둘레의 길 조각만 골라 둔다
  const segs=[];for(const r of ROADS)for(let i=1;i<r.length;i++){const a=r[i-1],b=r[i];if(Math.max(a.x,b.x)<ox-150||Math.min(a.x,b.x)>ox+CH+150||Math.max(a.y,b.y)<oy-150||Math.min(a.y,b.y)>oy+CH+150)continue;segs.push([a.x,a.y,b.x,b.y])}
  const S=[],T=[],F={s:new Float32Array(GK),t:new Float32Array(GK*3),L:0};for(let k=0;k<GK;k++){S.push(gArr('s'+k,NG*NG));T.push(gArr('t'+k,NG*NG*3))}
  const LG=gArr('L',NG*NG),TU=gArr('tu',NG*NG),MX=gArr('mx',NG*NG),RD=gArr('rd',NG*NG);let hasL=false;const act=new Uint8Array(GK);
  for(let j=0;j<NG;j++)for(let i=0;i<NG;i++){if(i===0&&j%10===9)yield;const x=gx0+i*GG,y=gy0+j*GG,q=j*NG+i;F.rd=1e9;fieldAt(x,y,segs,F);let best=-1e9;
    for(let k=0;k<GK;k++){S[k][q]=F.s[k];T[k][q*3]=F.t[k*3];T[k][q*3+1]=F.t[k*3+1];T[k][q*3+2]=F.t[k*3+2];if(F.s[k]>best)best=F.s[k]}
    for(let k=0;k<GK;k++)if(F.s[k]>best-.75)act[k]=1;
    LG[q]=F.L;if(F.L>.3)hasL=true;TU[q]=F.tuft;MX[q]=vnoise(x/300,y/300,55);RD[q]=F.rd}
  yield;const AK=[];for(let k=0;k<GK;k++)if(act[k])AK.push(k);const M=AK.length;
  const TX=AK.map(k=>gtex(GMAT[k])),HK=AK.map(k=>GHK[GMAT[k]]*1.4),WSA=AK.map(k=>GMAT[k]==='flag'?1:0);
  const kind=hasL?REG.th.liq.kind:null,LT=hasL?gtex(kind==='lava'?'lava':kind==='ice'?'ice':'water'):null,lc=hasL?REG.th.liq.col:null;
  const img=g.createImageData(N,N),D=img.data;
  const rs=AK.map(()=>new Float32Array(NG)),rt=AK.map(()=>new Float32Array(NG*3)),rl=new Float32Array(NG),rm=new Float32Array(NG),sv=new Float32Array(M),SH=4.2;
  for(let py=0;py<N;py++){if(py%40===39)yield;const wy=oy+(py+.5)*inv,gyf=(wy-gy0)/GG,j=gyf|0,fy=gyf-j,q0=j*NG,q1=q0+NG;
    for(let a=0;a<M;a++){const Sk=S[AK[a]],Tk=T[AK[a]],r=rs[a],t=rt[a];for(let i=0;i<NG;i++){r[i]=Sk[q0+i]+(Sk[q1+i]-Sk[q0+i])*fy;for(let c=0;c<3;c++)t[i*3+c]=Tk[(q0+i)*3+c]+(Tk[(q1+i)*3+c]-Tk[(q0+i)*3+c])*fy}}
    for(let i=0;i<NG;i++){rm[i]=MX[q0+i]+(MX[q1+i]-MX[q0+i])*fy;if(hasL)rl[i]=LG[q0+i]+(LG[q1+i]-LG[q0+i])*fy}
    let o=py*N*4;
    for(let px=0;px<N;px++,o+=4){const wx=ox+(px+.5)*inv,gxf=(wx-gx0)/GG,i=gxf|0,fx=gxf-i;
      const u=(wx-wy)*KI+65536,v=(wx+wy)*KI*.5+65536,ti=((v&255)<<8)|(u&255),ti2=((((v*.71+37)|0)&255)<<8)|(((u*.71+91)|0)&255),mx=rm[i]+(rm[i+1]-rm[i])*fx;
      const tw=((wy&255)<<8)|(wx&255);let best=-1e9;for(let a=0;a<M;a++){const r=rs[a],s=r[i]+(r[i+1]-r[i])*fx+(WSA[a]?TX[a].h[tw]:TX[a].h[ti]*(1-mx)+TX[a].h[ti2]*mx)*HK[a]+(GNZ[(ti+a*40503)&65535]-.5)*.75;sv[a]=s;if(s>best)best=s}
      let R=0,G=0,B=0,ws=0;
      for(let a=0;a<M;a++){let w=1-(best-sv[a])*SH;if(w<=0)continue;w*=w;const t=rt[a],X=TX[a].rgb,i3=i*3,ws_=WSA[a],p=(ws_?tw:ti)*3,p2=(ws_?tw:ti2)*3,m1=(1-mx)/128*w,m2=mx/128*w;
        R+=(t[i3]+(t[i3+3]-t[i3])*fx)*(X[p]*m1+X[p2]*m2);G+=(t[i3+1]+(t[i3+4]-t[i3+1])*fx)*(X[p+1]*m1+X[p2+1]*m2);B+=(t[i3+2]+(t[i3+5]-t[i3+2])*fx)*(X[p+2]*m1+X[p2+2]*m2);ws+=w}
      R/=ws;G/=ws;B/=ws;
      if(hasL){const Lb=rl[i]+(rl[i+1]-rl[i])*fx;if(Lb>.3){const Lv=Lb+(GNZ[ti]-.5)*.14;
        if(Lv>.36){const wet=smooth(.36,.5,Lv),a=smooth(.465,.535,Lv),d=clamp((Lv-.5)/.32,0,1),X=LT.rgb,p=ti*3,hh=LT.h[ti]+.5;let wr,wg,wb;
          if(kind==='lava'){const heat=clamp(hh*hh*1.3+d*.1,0,1),li=(heat*255|0)*3;wr=LAVA_LUT[li];wg=LAVA_LUT[li+1];wb=LAVA_LUT[li+2];
            const rim=1-smooth(.5,.6,Lv);wr*=1-rim*.6;wg*=1-rim*.75;wb*=1-rim*.7;R=R*(1-wet*.5)+wet*26;G*=1-wet*.55;B*=1-wet*.55}
          else if(kind==='ice'){const k1=X[p]/128;wr=(lc[0]*2.9-d*30)*k1;wg=(lc[1]*3-d*24)*k1;wb=(lc[2]*2.4-d*10)*k1;const rim=1-smooth(.5,.56,Lv);wr+=(235-wr)*rim*.55;wg+=(240-wg)*rim*.55;wb+=(250-wb)*rim*.55}
          else{const k1=X[p]/128,dd=Math.pow(d,.7);const sh=(1-smooth(0,.35,d))*.55;wr=(lc[0]*(1.25-dd*.75)*(1-sh)+R*sh)*k1;wg=(lc[1]*(1.25-dd*.75)*(1-sh)+G*sh*1.05)*k1;wb=(lc[2]*(1.2-dd*.6)*(1-sh)+B*sh*1.1)*k1;
            const fo=clamp(1-Math.abs(Lv-.53)/.025,0,1)*smooth(.42,.7,GNZ[ti2])*(.6+.4*(X[p]/255));wr+=(215-wr)*fo*.6;wg+=(228-wg)*fo*.6;wb+=(230-wb)*fo*.6;R*=1-wet*.4;G*=1-wet*.38;B*=1-wet*.3}
          R+=(wr-R)*a;G+=(wg-G)*a;B+=(wb-B)*a}}}
      D[o]=R;D[o+1]=G;D[o+2]=B;D[o+3]=255}}
  g.putImageData(img,0,0);yield;
  // 길: 바퀴 자국과 박힌 돌 (월드 길 모양에서 정해지므로 조각 경계에서 이어진다)
  g.save();g.setTransform(sc,0,0,sc,-ox*sc,-oy*sc);g.lineCap='round';g.lineJoin='round';
  for(const r of ROADS){let near=false;for(const p of r)if(p.x>ox-200&&p.x<ox+CH+200&&p.y>oy-200&&p.y<oy+CH+200){near=true;break}if(!near)continue;
    for(const off of [-8,8])for(let i=1;i<r.length;i++){const a=r[i-1],b=r[i],l=Math.hypot(b.x-a.x,b.y-a.y),nx=-(b.y-a.y)/l,ny=(b.x-a.x)/l,h=hash(i*7+(off>0?1:0),r.length);
      if(Math.max(a.x,b.x)<ox-60||Math.min(a.x,b.x)>ox+CH+60||Math.max(a.y,b.y)<oy-60||Math.min(a.y,b.y)>oy+CH+60)continue;const RI=roadInfo((a.x+b.x)/2,(a.y+b.y)/2);if(RI.f>.5)continue;
      if(off<0){g.restore();for(let t=0;t<l;t+=7){const cx=a.x+(b.x-a.x)*t/l,cy=a.y+(b.y-a.y)*t/l;for(const sd of [-1,1,0]){const hh=hash((cx*5)|0,(cy*5+sd*31)|0);if(hh>(sd?.3:.06))continue;
          const e=sd?RI.w/2-4+hh*10:(hh-.04)*60,px=cx+nx*e*sd+(sd?0:nx*e),py=cy+ny*e*sd+(sd?0:ny*e);if(px<ox-20||px>ox+CH+20||py<oy-20||py>oy+CH+20)continue;
          gPut(g,sc,ox,oy,gSpr('pebble',(hh*60|0)%6,RI.c.map(v=>v*(.8+hh*.5))),px,py,.9+hh*1.2)}}
        g.save();g.setTransform(sc,0,0,sc,-ox*sc,-oy*sc);g.lineCap='round'}
      const n=Math.max(2,Math.round(l/14));const w0=(fbm(a.x/40,a.y/40,off>0?3:4)-.5)*7;let px=a.x+nx*(off+w0),py=a.y+ny*(off+w0);for(let k=1;k<=n;k++){const f=k/n,hh=hash((a.x+f*99)|0,(a.y+off*7+k)|0),wb=(fbm((a.x+(b.x-a.x)*f)/40,(a.y+(b.y-a.y)*f)/40,off>0?3:4)-.5)*7,qx=a.x+(b.x-a.x)*f+nx*(off+wb),qy=a.y+(b.y-a.y)*f+ny*(off+wb);
        if(hh>.12){g.strokeStyle=`rgba(30,20,12,${.08+hh*.1})`;g.lineWidth=5+hh*2;g.beginPath();g.moveTo(px,py);g.lineTo(qx,qy);g.stroke();g.strokeStyle=`rgba(22,14,8,${.1+h*.08})`;g.lineWidth=2;g.beginPath();g.moveTo(px+.6,py+.6);g.lineTo(qx+.6,qy+.6);g.stroke()}px=qx;py=qy}}}
  g.restore();
  yield;
  // 흩뿌림: 풀포기, 꽃, 자갈, 낙엽 (월드 칸마다 정해져서 경계를 넘어도 같다)
  const CS=18;
  for(let cy=Math.floor((oy-20)/CS);cy<=Math.floor((oy+CH+20)/CS);cy++){if(cy%6===0)yield;for(let cx=Math.floor((ox-20)/CS);cx<=Math.floor((ox+CH+20)/CS);cx++){
    const h1=hash(cx*3+1,cy*5+2),h2=hash(cx+77,cy-31),h3=hash(cx-5,cy+911);const x=(cx+h2)*CS,y=(cy+h3)*CS;
    const gxf=(x-gx0)/GG,gyf=(y-gy0)/GG,i=gxf|0,j=gyf|0;if(i<0||j<0||i>=NG-1||j>=NG-1)continue;const fx=gxf-i,fy=gyf-j,q=j*NG+i;
    const bi=(A)=>A[q]*(1-fx)*(1-fy)+A[q+1]*fx*(1-fy)+A[q+NG]*(1-fx)*fy+A[q+NG+1]*fx*fy;
    if(hasL&&bi(LG)>.34)continue;let bk=0,bs=-1e9;for(const k of AK){const s=bi(S[k]);if(s>bs){bs=s;bk=k}}
    const m=GMAT[bk],tc=[0,1,2].map(c=>T[bk][q*3+c]),tu=bi(TU);let kd=null,A0=null,col=tc,vv=(h1*97|0)%6;
    if(m==='grass'){if(h1<.4*tu)kd='tuft';else if(h1>.9&&vnoise(x/140,y/140,31)>.68&&(A0=GAWat(x,y)).flowers&&h1>1-.3*(A0.flower||0)){kd='flower';col=Kit.hex(A0.flowers[(h2*A0.flowers.length)|0])}else if(h1>.4*tu&&h1<.4*tu+.02)kd='pebble',col=[110,104,94]}
    else if(m==='leaf'){if(h1<.3)kd='leaf',col=[[150,96,58],[132,118,70],[164,130,70],[110,84,60]][(h2*4)|0];else if(h1<.3+.25*tu)kd='tuft',col=[tc[0]*.8,tc[1]*1.1,tc[2]*.8];else if(h1>.97)kd='twig',col=[70,56,42]}
    else if(m==='mud'){if(h1<.22*tu)kd='reed',col=[tc[0]*1.1,tc[1]*1.35,tc[2]*.9];else if(h1>.95)kd='pebble',col=[86,84,76]}
    else if(m==='dirt'||m==='road'||m==='rock'||m==='ash'||m==='sand'){if(h1<(m==='road'?.16:.08))kd='pebble',col=[tc[0]*1.05,tc[1]*1.02,tc[2]],vv=(h2*6)|0;else if(h1>1-.06*tu&&m!=='road')kd='tuft',col=m==='ash'?[70,66,50]:[96,96,56]}
    else if(m==='snow'){if(h1<.04)kd='pebble',col=[110,116,128]}
    if(!kd)continue;
    gPut(g,sc,ox,oy,gSpr(kd,vv,col),x,y,.75+h3*.5)}}
  // 마을 광장: 분수 둘레 경계석과 안전 지대 표시
  g.setTransform(sc,0,0,sc,-ox*sc,-oy*sc);
  for(const t of TOWNS){const SAFE=tSafe(t);if(t.x+SAFE+20<ox||t.x-SAFE-20>ox+CH||t.y+SAFE+20<oy||t.y-SAFE-20>oy+CH)continue;
    const pc=[...(AREAS[t.id]&&AREAS[t.id].plaza||[130,120,104])];
    for(let k=0;k<44;k++){const a=k/44*6.283,x=t.x+Math.cos(a)*76,y=t.y+Math.sin(a)*76;if(x<ox-20||x>ox+CH+20||y<oy-20||y>oy+CH+20)continue;gPut(g,sc,ox,oy,gSpr('pebble',2+k%2,[pc[0]*.85,pc[1]*.85,pc[2]*.85]),x,y,1.6);g.setTransform(sc,0,0,sc,-ox*sc,-oy*sc)}
    g.setLineDash([14,18]);g.lineCap='round';for(const [w,c] of [[7,'rgba(214,178,98,.07)'],[2.6,'rgba(226,192,110,.26)']]){g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.arc(t.x,t.y,SAFE,0,6.283);g.stroke()}g.setLineDash([])}
  g.setTransform(sc,0,0,sc,0,0);
  // 물결 반짝임 자리 (매 프레임에는 미리 구운 몇 장을 번갈아 붙이기만 한다)
  let fxs=null;if(hasL){fxs=[];const CS2=34;for(let cy=Math.floor(oy/CS2);cy<Math.ceil((oy+CH)/CS2);cy++)for(let cx=Math.floor(ox/CS2);cx<Math.ceil((ox+CH)/CS2);cx++){const h=hash(cx*13+5,cy*7+3);if(h>.55)continue;
    const x=(cx+hash(cx,cy+9))*CS2,y=(cy+hash(cx+9,cy))*CS2;if(x<ox||x>=ox+CH||y<oy||y>=oy+CH)continue;const L=liqAt(x,y);if(L<.62)continue;fxs.push({x,y,ph:h*20,k:kind})}}
  return fxs}
function GAWat(x,y){areaWeights(x,y);let best=null,bw=0;for(const [a,w] of GAW)if(w>bw&&a.flowers){bw=w;best=a}return best||{}}
function roadInfo(x,y){areaWeights(x,y);let f=0,w=0,c=[0,0,0];for(const [a,ww] of GAW){f+=ww*(a.roadFlag||0);w+=ww*(a.roadW||44);const rc=a.road||[110,94,66];for(let k=0;k<3;k++)c[k]+=rc[k]*ww}return{f,w,c}}
function roadFlagAt(x,y){if(REG.th)return 0;areaWeights(x,y);let f=0;for(const [a,w] of GAW)f+=w*(a.roadFlag||0);return f}

/* ---------- 조각 캐시: 시간 예산 안에서만 굽는다 ---------- */
let chunkScale=0,chunkWorld=null;const GJOBS=[];
// 아직 다 굽지 못한 조각은 5×5 색 미리보기를 부드럽게 늘려 둔다 (점들이 월드 격자에 맞아 이웃 조각과 이어진다)
function chunkPreview(cx,cy){const cv=document.createElement('canvas');cv.width=cv.height=5;const g=cv.getContext('2d'),id=g.createImageData(5,5);
  for(let j=0;j<5;j++)for(let i=0;i<5;i++){const c=DG?[12,11,10]:groundRGB(cx*CH+i*100,cy*CH+j*100).map(v=>v/.75),k=(j*5+i)*4;id.data[k]=c[0];id.data[k+1]=c[1];id.data[k+2]=c[2];id.data[k+3]=255}g.putImageData(id,0,0);return cv}
function getChunkE(cx,cy){const want=clamp(Math.round(DPR*.9*20)/20,.8,1.4);if(want!==chunkScale){chunkScale=want;chunks.clear();GJOBS.length=0}
  const k=cx*1000+cy;let c=chunks.get(k);if(c){c.used=frameN;return c}
  const cv2=document.createElement('canvas');cv2.width=cv2.height=Math.round(CH*chunkScale);const g2=cv2.getContext('2d');g2.scale(chunkScale,chunkScale);
  c={cv:cv2,used:frameN,fx:null,ready:false,pv:chunkPreview(cx,cy),cx,cy,ms:0};c.job=paintChunkG(g2,cx*CH,cy*CH);chunks.set(k,c);GJOBS.push(c);
  if(chunks.size>64){let old=null,ou=1e12;for(const [kk,v] of chunks)if(v.used<ou&&v.ready){ou=v.used;old=kk}if(old!=null)chunks.delete(old)}
  return c}
function getChunk(cx,cy){const c=getChunkE(cx,cy);return c&&c.ready?c.cv:null}
// 굽기 일감: 이번 프레임 예산(ms) 안에서 가까운 조각부터 조금씩
const GWARM=['grass','dirt','road','flag','leaf','mud','sand','ash','rock','snow','water','lava','ice'];
function runChunkJobs(budget){const t0=performance.now();if(paused&&!GJOBS.length){const n=GWARM.find(n=>!GTX[n]);if(n)gtex(n)} // 멈춘 화면(시작 화면)에서 재질을 미리 굽는다
const pcx=P.x/CH,pcy=P.y/CH;
  for(let i=GJOBS.length-1;i>=0;i--)if(GJOBS[i].ready||chunks.get(GJOBS[i].cx*1000+GJOBS[i].cy)!==GJOBS[i])GJOBS.splice(i,1);
  GJOBS.sort((a,b)=>(b.used-a.used)||(Math.hypot(a.cx+.5-pcx,a.cy+.5-pcy)-Math.hypot(b.cx+.5-pcx,b.cy+.5-pcy)));
  for(const c of GJOBS){while(!c.ready){const t1=performance.now(),r=c.job.next(),dt=performance.now()-t1;c.ms+=dt;GSTAT.sl.push(dt);if(GSTAT.sl.length>4000)GSTAT.sl.shift();if(r.done){c.ready=true;c.fx=r.value;c.job=null;c.pv=null;GSTAT.n++;GSTAT.ms+=c.ms;GSTAT.last=c.ms}
      if(performance.now()-t0>budget)return}}}
// 땅 그리기: 보이는 조각(없으면 미리보기) → 굽기 일감 → 여유가 있으면 화면 밖 한 겹을 미리 일감에 올린다
const GVIS=[];
function drawGround(cx0,cx1,cy0,cy1){{const wk=DG||REG;if(wk!==chunkWorld){chunkWorld=wk;chunks.clear();GJOBS.length=0}}GVIS.length=0;let miss=0;const lim=DG?{a:Math.floor(OX/CH),b:Math.floor((OX+DN*TS)/CH)}:{a:0,b:Math.ceil(WORLD/CH)-1};
  const inView=(cx,cy,m)=>{m=m||20;const a=W2S(cx*CH,cy*CH),b=W2S(cx*CH+CH,cy*CH),c=W2S(cx*CH+CH,cy*CH+CH),d=W2S(cx*CH,cy*CH+CH);return!(Math.max(a.x,b.x,c.x,d.x)<-m||Math.min(a.x,b.x,c.x,d.x)>W+m||Math.max(a.y,b.y,c.y,d.y)<-m||Math.min(a.y,b.y,c.y,d.y)>H+m)};
  const ok=(cx,cy)=>cx>=lim.a&&cy>=lim.a&&cx<=lim.b&&cy<=lim.b;
  for(let cy=cy0;cy<=cy1;cy++)for(let cx=cx0;cx<=cx1;cx++){if(!ok(cx,cy)||!inView(cx,cy))continue;const c=getChunkE(cx,cy);if(!c.ready)miss++}
  // 걸을 때는 한 프레임 4ms(멈춤 화면 10ms), 순간이동 직후 화면이 비어 있으면 24ms까지
  runChunkJobs(miss>4?24:paused?10:4);
  for(let cy=cy0;cy<=cy1;cy++)for(let cx=cx0;cx<=cx1;cx++){if(!ok(cx,cy)||!inView(cx,cy))continue;const c=chunks.get(cx*1000+cy);if(!c)continue;
    if(c.ready){if(!isoBlit(c,cx,cy))ctx.drawImage(c.cv,cx*CH,cy*CH,CH+1,CH+1);if(c.fx&&c.fx.length)GVIS.push(c)}else ctx.drawImage(c.pv,.5,.5,4,4,cx*CH,cy*CH,CH+1,CH+1)}
  if(!miss&&GJOBS.length<2&&chunks.size<60){outer:for(let cy=cy0-1;cy<=cy1+1;cy++)for(let cx=cx0-1;cx<=cx1+1;cx++){if(!ok(cx,cy)||chunks.has(cx*1000+cy)||!inView(cx,cy,250))continue;getChunkE(cx,cy).used=frameN-1;break outer}}}
// [최적화] 다 구운 조각을 화면 방향(마름모)으로 한 번 더 구워 두고, 매 프레임에는 회전 없이 그대로 붙인다.
// 회전·기울인 큰 그림을 매 프레임 그리는 비용이 프레임의 절반 가까이였다. 그림 내용은 같다.
const ISO_PAD=2,ISO_MAX=28;
function isoBlit(c,cx,cy){const s=DPR;
  if(!c.iso||c.iso.s!==s){let n=0,old=null,ou=1e12;for(const v of chunks.values())if(v.iso&&v!==c){n++;if(v.isoU<ou){ou=v.isoU;old=v}}if(n>=ISO_MAX&&old)old.iso=null;
    const w=Math.ceil((2*CH*KI+ISO_PAD*2)*s),h=Math.ceil((CH*KI+ISO_PAD*2)*s),cv2=document.createElement('canvas');cv2.width=w;cv2.height=h;const g=cv2.getContext('2d');
    g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.setTransform(s*KI,s*KI/2,-s*KI,s*KI/2,s*(CH*KI+ISO_PAD),s*ISO_PAD);g.drawImage(c.cv,-.5,-.5,CH+1.5,CH+1.5);
    decoIdx();const fl=DFLAT.get(cx*1000+cy);if(fl){g.setTransform(s,0,0,s,0,0);const bl=SC.bakeLeft;SC.bakeLeft=1e9;const ox=(cx*CH-cy*CH)*KI-CH*KI-ISO_PAD,oy=(cx*CH+cy*CH)*KI/2-ISO_PAD;for(const d of fl)RD.draw(g,d,(d.x-d.y)*KI-ox,(d.x+d.y)*KI/2-oy,1,0);SC.bakeLeft=bl}
    c.iso={cv:cv2,s}}
  c.isoU=frameN;
  const wx=cx*CH,wy=cy*CH,sx=(wx-wy)*KI-camX+shx-CH*KI-ISO_PAD,sy=(wx+wy)*KI/2-camY+shy-ISO_PAD;
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(c.iso.cv,Math.round(sx*s),Math.round(sy*s));G();return true}
// [최적화 v19] 장식 칸 나누기: 장식을 땅 조각(400칸)별로 묶어, 화면에 보이는 조각의 장식만 살핀다.
// 낮고 움직이지 않는 지역 장식(밀·꽃·고사리·이끼 바위 …)은 땅 조각 그림에 함께 구워 매 프레임 따로 그리지 않는다.
const DBUCK=new Map(),DFLAT=new Map(),DMOB=[];let decoKey='';
function isFlatDecor(d){const df=RD.D[d.k];return !!df&&!df.glow&&df.h<=60&&!d.zh&&!d.cell&&!d.label&&!/vent|mushroom|icespike|searock|edgeportal/.test(d.k)}
function decoIdx(){const k=REG.id+'/'+decor.length+'/'+(decor[0]&&decor[0].x)+'/'+(decor.length&&decor[decor.length-1].x);if(k===decoKey)return;decoKey=k;DBUCK.clear();DFLAT.clear();DMOB.length=0;
  for(const c of chunks.values())c.iso=null;
  for(const d of decor){d._flat=isFlatDecor(d);if(d.k==='tfolk'||d.k==='npc'||d.walkT!=null||d.hx!=null){d._flat=false;DMOB.push(d);continue}if(!d._flat){const key=Math.floor(d.x/CH)*1000+Math.floor(d.y/CH);let b=DBUCK.get(key);if(!b)DBUCK.set(key,b=[]);b.push(d);continue}
    const df=RD.D[d.k],sc=d.s||1,sx=(d.x-d.y)*KI,sy=(d.x+d.y)*KI/2,x0=sx-df.ax*sc,x1=x0+df.w*sc,y0=sy-df.ay*sc,y1=y0+df.h*sc;
    // 그림이 걸치는 모든 조각에 넣는다 (조각 경계에서 잘리지 않게)
    const cxa=Math.floor((d.x-90)/CH),cxb=Math.floor((d.x+90)/CH),cya=Math.floor((d.y-90)/CH),cyb=Math.floor((d.y+90)/CH);
    for(let cy=cya;cy<=cyb;cy++)for(let cx=cxa;cx<=cxb;cx++){const ox=(cx*CH-cy*CH)*KI-CH*KI-ISO_PAD,oy=(cx*CH+cy*CH)*KI/2-ISO_PAD,w=2*CH*KI+ISO_PAD*2,h=CH*KI+ISO_PAD*2;
      if(x1<ox||x0>ox+w||y1<oy||y0>oy+h)continue;const key=cx*1000+cy;let b=DFLAT.get(key);if(!b)DFLAT.set(key,b=[]);b.push(d)}}
  for(const b of DFLAT.values())b.sort((a,b)=>a.x+a.y-b.x-b.y)}
// 화면에 보이는 조각(+둘레 한 겹) 안의 장식만 돌려준다
// [v20] 자동 품질이 내려가면(프레임이 계속 느리면) 꾸밈 장식(나무·덤불 등, 이동을 막지 않음)을 일부만 그린다: 품질 1단계 25%, 0단계 45% 덜 그림.
// 어느 장식을 뺄지는 위치로 고정(깜빡이지 않음). 이름표·불빛·마을 건물·사람·절벽은 늘 그린다.
const DTHIN=/^(htree|hpine|hbirch|hdead|hbush|oak|fern|mushroom|mossrock|bigleaf|jungletree|palm|snowpine|cactus|windtree|wheat|flowers|haystack|rock|stump|tree|bush)$/;
function decoVisible(cx0,cx1,cy0,cy1,out){decoIdx();for(const d of DMOB)out.push(d);const th=Q.lvl>=2?0:Q.lvl===1?.25:.45;
  for(let cy=cy0-1;cy<=cy1+1;cy++)for(let cx=cx0-1;cx<=cx1+1;cx++){const b=DBUCK.get(cx*1000+cy);if(b)for(const d of b){if(th&&d._thin==null)d._thin=DTHIN.test(d.k)&&!d.label&&!d.light&&!d.cell?hash((d.x*7)|0,(d.y*13)|0):1;if(th&&d._thin<th)continue;out.push(d)}}return out}
// 물결/얼음/용암 반짝임: 미리 구운 4장을 번갈아 붙인다
const GLINT={};
function glintCv(kind,f){const key=kind+f;if(GLINT[key])return GLINT[key];const cv=document.createElement('canvas');cv.width=64;cv.height=24;const g=cv.getContext('2d');
  const col=kind==='lava'?[255,170,60]:kind==='ice'?[220,240,255]:[200,230,255],s=mulberry(f*17+kind.length);g.lineCap='round';
  if(kind==='lava'){const gr=g.createRadialGradient(32,12,0,32,12,12+f*2);gr.addColorStop(0,`rgba(255,220,120,${.5-f*.08})`);gr.addColorStop(1,'rgba(255,80,20,0)');g.fillStyle=gr;g.fillRect(0,0,64,24);
}
  else for(let i=0;i<3;i++){const y=8+i*4+s()*2,x=10+s()*20,l=14+s()*18,a=[.15,.5,.8,.4][f]*(1-i*.25);g.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},${a})`;g.lineWidth=1.3;g.beginPath();g.moveTo(x+f*3,y);g.quadraticCurveTo(x+l/2+f*3,y-2,x+l+f*3,y);g.stroke()}
  return GLINT[key]=cv}
function drawGroundFx(){if(!GVIS.length)return;const po=ctx.globalCompositeOperation;ctx.globalCompositeOperation='lighter';
  for(const c of GVIS)for(const p of c.fx){const s=W2S(p.x,p.y);if(s.x<-40||s.x>W+40||s.y<-20||s.y>H+20)continue;const ph=time*(p.k==='lava'?.9:1.3)+p.ph,f=Math.floor(ph)%4;
    ctx.globalAlpha=p.k==='ice'?.55:.8*(.5+.5*Math.sin(ph*1.57));ctx.drawImage(glintCv(p.k,f),s.x-32,s.y-12)}
  ctx.globalAlpha=1;ctx.globalCompositeOperation=po}
function groundLights(Lt){let n=0;for(const c of GVIS)for(const p of c.fx){if(p.k!=='lava'||(p.ph*10|0)%3)continue;const s=W2S(p.x,p.y);Lt(s.x,s.y,150,.45);if(++n>40)return}}

/* ---------- 붓질한 그을음 · 땅 장판 ---------- */
const DECV={};
function decalCv(col,kind,v){const key=col+kind+v;if(DECV[key])return DECV[key];const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d'),s=mulberry(v*71+kind.length*13),c=Kit.hex(col);
  const rc=a=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;g.translate(64,64);
  if(kind==='scorch'){for(let i=0;i<70;i++){const a=s()*6.283,d=Math.pow(s(),.7)*44,r=6+s()*16*(1-d/60);g.fillStyle=rc(.16+.2*(1-d/50));g.beginPath();g.ellipse(Math.cos(a)*d,Math.sin(a)*d,r,r*(.5+s()*.5),a,0,6.283);g.fill()}
    g.lineCap='round';for(let i=0;i<16;i++){const a=s()*6.283,d0=14+s()*16,d1=d0+14+s()*24;g.strokeStyle=rc(.3);g.lineWidth=1+s()*3;g.beginPath();g.moveTo(Math.cos(a)*d0,Math.sin(a)*d0);g.quadraticCurveTo(Math.cos(a+.2)*(d0+d1)/2,Math.sin(a+.2)*(d0+d1)/2,Math.cos(a)*d1,Math.sin(a)*d1);g.stroke()}
    for(let i=0;i<30;i++){const a=s()*6.283,d=s()*30;g.fillStyle=rc(.5);g.beginPath();g.arc(Math.cos(a)*d,Math.sin(a)*d,1+s()*2.5,0,6.283);g.fill()}}
  else{const gr=g.createRadialGradient(0,0,0,0,0,60);gr.addColorStop(0,rc(.3));gr.addColorStop(.75,rc(.2));gr.addColorStop(1,rc(0));g.fillStyle=gr;g.beginPath();g.arc(0,0,60,0,6.283);g.fill();
    g.lineCap='round';for(let i=0;i<46;i++){const a=s()*6.283,d=20+s()*36,l=.3+s()*.7;g.strokeStyle=`rgba(${Math.min(255,c[0]+50)},${Math.min(255,c[1]+50)},${Math.min(255,c[2]+50)},${.12+s()*.25})`;g.lineWidth=2+s()*5;g.beginPath();g.arc(0,0,d,a,a+l);g.stroke()}
    for(let i=0;i<40;i++){const a=s()*6.283,d=50+s()*10;g.fillStyle=rc(.25+s()*.25);g.beginPath();g.ellipse(Math.cos(a)*d,Math.sin(a)*d,3+s()*6,2+s()*3,a,0,6.283);g.fill()}}
  return DECV[key]=cv}
function drawDecalsFields(){
  for(const d of decals){const a=clamp(d.life/d.max*2,0,1);
    if(d.crack){ctx.lineCap='round';ctx.lineJoin='round';strokePts(d.crack,d.w*1.1,'#0e0905',.45*a);strokePts(d.crack,d.w*.7,'#120c06',.7*a);ctx.save();ctx.translate(-1.5,-1.5);strokePts(d.crack,d.w*.25,'#c9a46a',.35*a);ctx.restore();strokePts(d.crack,d.w*.28,'#ff8a3a',.5*a*a);ctx.globalAlpha=1;continue}
    const v=(hash(d.x|0,d.y|0)*3)|0;ctx.globalAlpha=.75*a;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(v*2.1);ctx.drawImage(decalCv(d.col,'scorch',v),-d.r*1.35,-d.r*1.35,d.r*2.7,d.r*2.7);ctx.restore()}ctx.globalAlpha=1;
  for(const f of fields){const col=f.s.heal?'#9fe39a':EL[f.s.el],fade=Math.min(1,f.t*2,(f.max-f.t)*4),v=(hash(f.x|0,f.y|0)*3)|0;ctx.globalAlpha=.55*fade;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(v*2.1+f.t*.15);ctx.drawImage(decalCv(col,'field',v),-f.rad*1.07,-f.rad*1.07,f.rad*2.14,f.rad*2.14);ctx.restore()}ctx.globalAlpha=1}

/* ---------- 던전: 바닥 조각과 벽 ---------- */
// 던전마다 재질 색: 고분 = 이끼 낀 흙과 돌, 수로 = 젖은 벽돌과 물, 요새 = 검은 돌과 쇠, 성소 = 재와 붉은 균열
const DGMAT={
  barrow:{earth:[58,52,40],slab:[96,92,80],mortar:[24,22,18],moss:[70,96,44],mossA:.55,bone:.2,puddle:.05,pcol:[28,38,36],brick:[86,80,66],top:[78,82,62],topDust:[122,124,100],soot:'14,12,8',lay:'big',miss:.12},
  sewer:{earth:[42,50,46],slab:[72,86,82],mortar:[18,26,24],moss:[56,96,70],mossA:.4,bone:.05,puddle:.4,pcol:[22,50,56],brick:[66,88,84],top:[58,74,70],topDust:[90,110,100],soot:'8,14,14',lay:'brick',miss:.04,wet:1},
  fort:{earth:[40,38,38],slab:[70,68,70],mortar:[12,12,13],moss:null,bone:.08,puddle:.04,pcol:[26,28,32],brick:[62,60,64],top:[70,68,70],topDust:[110,106,104],soot:'6,6,6',lay:'big',miss:.03,iron:1},
  sanctum:{earth:[60,40,34],slab:[86,66,58],mortar:[22,10,8],moss:null,bone:.14,puddle:0,pcol:[30,20,20],brick:[96,60,48],top:[92,76,70],topDust:[140,128,122],soot:'14,6,4',lay:'big',miss:.08,ember:1},
};
for(const d of WX_DUNGEONS)if(!DGMAT[d.id])DGMAT[d.id]=wxDgMat(d);// v18 지역 던전 24곳 (wx-base.js)
const DGTX={};
// 회색 텍스처에 던전 색을 입힌 무늬 (화면 방향으로 놓이도록 변환을 건다)
function dgPat(g,name,col){const key=name+col.join(',');let cv=DGTX[key];if(!cv){const T=gtex(name);cv=document.createElement('canvas');cv.width=cv.height=GT;const c2=cv.getContext('2d'),id=c2.createImageData(GT,GT);
    for(let i=0;i<GT*GT;i++){id.data[i*4]=T.rgb[i*3]*col[0]/128;id.data[i*4+1]=T.rgb[i*3+1]*col[1]/128;id.data[i*4+2]=T.rgb[i*3+2]*col[2]/128;id.data[i*4+3]=255}c2.putImageData(id,0,0);DGTX[key]=cv}
  const p=g.createPattern(cv,'repeat');p.setTransform(new DOMMatrix(ISOM.concat([0,0])));return p}
function paintDungeonChunk(g,ox,oy,sc){const d=DG.d,M=DGMAT[d.id]||DGMAT.barrow,rc=(c,a)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
  g.setTransform(sc,0,0,sc,-ox*sc,-oy*sc);g.fillStyle='#0b0a09';g.fillRect(ox,oy,CH,CH);
  const i0=Math.floor((ox-OX)/TS)-1,i1=Math.floor((ox+CH-OX)/TS)+1,j0=Math.floor((oy-OY)/TS)-1,j1=Math.floor((oy+CH-OY)/TS)+1;
  const earth=dgPat(g,'dirt',M.earth),stone=dgPat(g,'rock',M.slab),put=(e,x,y,k)=>{gPut(g,sc,ox,oy,e,x,y,k);g.setTransform(sc,0,0,sc,-ox*sc,-oy*sc)};
  const tiles=[];for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(dgFloor(i,j))tiles.push([i,j]);
  // 1) 흙 바닥
  g.fillStyle=earth;for(const [i,j] of tiles)g.fillRect(OX+i*TS-1,OY+j*TS-1,TS+2,TS+2);
  // 2) 판석
  for(const [i,j] of tiles){const x0=OX+i*TS,y0=OY+j*TS,s=mulberry(i*733+j*1301+7),L=[];
    if(M.lay==='brick'){for(let r=0;r<4;r++){const off=r%2?25:0;for(let c=-1;c<2;c++){const a=x0+off+c*50;L.push([Math.max(x0,a),y0+r*25,Math.min(x0+TS,a+50),y0+r*25+25])}}}
    else{const t=s();if(t<.35)L.push([x0,y0,x0+50,y0+50],[x0+50,y0,x0+100,y0+50],[x0,y0+50,x0+50,y0+100],[x0+50,y0+50,x0+100,y0+100]);
      else if(t<.6)L.push([x0,y0,x0+100,y0+50],[x0,y0+50,x0+50,y0+100],[x0+50,y0+50,x0+100,y0+100]);
      else if(t<.85)L.push([x0,y0,x0+50,y0+100],[x0+50,y0,x0+100,y0+50],[x0+50,y0+50,x0+100,y0+100]);else L.push([x0,y0,x0+100,y0+100])}
    for(const [a,b,c,e] of L){if(c-a<6)continue;if(s()<M.miss){for(let k=0;k<4;k++)put(gSpr('pebble',(s()*6)|0,M.slab),a+s()*(c-a),b+s()*(e-b),1+s()*.6);continue}
      const jt=()=>(s()-.5)*4,P=[[a+2.5+jt(),b+2.5+jt()],[c-2.5+jt(),b+2.5+jt()],[c-2.5+jt(),e-2.5+jt()],[a+2.5+jt(),e-2.5+jt()]];
      const path=()=>{g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()};
      g.fillStyle=rc(M.mortar,.75);g.save();g.translate(1.5,1.5);path();g.fill();g.restore();
      path();g.fillStyle=stone;g.fill();const v=s();g.fillStyle=v<.5?`rgba(0,0,0,${(.5-v)*.5})`:`rgba(255,240,220,${(v-.5)*.16})`;g.fill();
      g.lineWidth=1.6;g.strokeStyle='rgba(255,240,220,.16)';g.beginPath();g.moveTo(P[3][0],P[3][1]);g.lineTo(P[0][0],P[0][1]);g.lineTo(P[1][0],P[1][1]);g.stroke();
      g.strokeStyle='rgba(0,0,0,.4)';g.beginPath();g.moveTo(P[1][0],P[1][1]);g.lineTo(P[2][0],P[2][1]);g.lineTo(P[3][0],P[3][1]);g.stroke();
      if(s()<.3){let x=a+s()*(c-a),y=b+s()*(e-b);const pts=[[x,y]];for(let k=0;k<5;k++){x+=(s()-.5)*24;y+=(s()-.5)*24;pts.push([clamp(x,a+3,c-3),clamp(y,b+3,e-3)])}
        const cr=(w,col,o)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();pts.forEach((p,k)=>k?g.lineTo(p[0]+o,p[1]+o):g.moveTo(p[0]+o,p[1]+o));g.stroke()};
        if(M.ember){cr(3,'rgba(40,6,2,.8)',0);cr(1.4,'rgba(255,90,30,.75)',0);cr(.6,'rgba(255,210,120,.8)',0)}else{cr(1.4,'rgba(0,0,0,.5)',0);cr(.7,'rgba(255,240,220,.12)',-1)}}
      if(M.moss&&s()<M.mossA){for(let k=0;k<6;k++){const ex=s()<.5,x=ex?(s()<.5?a:c):a+s()*(c-a),y=ex?b+s()*(e-b):(s()<.5?b:e),r=3+s()*7;g.fillStyle=rc(M.moss.map(v=>v*(.75+s()*.5)),.55);g.beginPath();g.ellipse(x,y,r,r*.6,s()*3,0,6.283);g.fill()}}
      if(M.wet&&s()<.5){g.save();path();g.clip();g.setTransform(sc*ISOM[0],sc*ISOM[1],sc*ISOM[2],sc*ISOM[3],sc*((a+c)/2-ox),sc*((b+e)/2-oy));g.strokeStyle='rgba(200,240,240,.12)';g.lineWidth=2;g.beginPath();g.moveTo(-14,-2);g.lineTo(10,-4);g.stroke();g.restore();g.setTransform(sc,0,0,sc,-ox*sc,-oy*sc)}}
    // 웅덩이 · 쇠창살 · 재 · 뼈
    if(s()<M.puddle){const px=x0+20+s()*60,py=y0+20+s()*60,r=14+s()*20;g.setTransform(sc*ISOM[0],sc*ISOM[1],sc*ISOM[2],sc*ISOM[3],sc*(px-ox),sc*(py-oy));
      g.fillStyle=rc(M.pcol,.9);g.beginPath();g.ellipse(0,0,r,r*.45,0,0,6.283);g.fill();g.fillStyle='rgba(140,190,200,.16)';g.beginPath();g.ellipse(-r*.2,-r*.1,r*.6,r*.14,0,0,6.283);g.fill();
      g.strokeStyle='rgba(200,230,230,.22)';g.lineWidth=1;g.beginPath();g.ellipse(0,0,r,r*.45,0,3.5,5.9);g.stroke();g.strokeStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(0,1,r,r*.45,0,.3,2.8);g.stroke();g.setTransform(sc,0,0,sc,-ox*sc,-oy*sc)}
    if(M.iron&&s()<.07){const gx=x0+28,gy=y0+28;g.fillStyle='#08080a';g.fillRect(gx,gy,44,44);g.strokeStyle='#4a4644';g.lineWidth=3;g.strokeRect(gx,gy,44,44);g.lineWidth=2;for(let k=1;k<5;k++){g.beginPath();g.moveTo(gx+k*8.8,gy);g.lineTo(gx+k*8.8,gy+44);g.stroke()}
      g.strokeStyle='rgba(200,190,180,.25)';g.lineWidth=1;g.beginPath();g.moveTo(gx,gy+44);g.lineTo(gx,gy);g.lineTo(gx+44,gy);g.stroke()}
    if(M.ember&&s()<.35){for(let k=0;k<5;k++){const r=6+s()*12;g.fillStyle=`rgba(140,128,122,${.18+s()*.15})`;g.beginPath();g.ellipse(x0+s()*TS,y0+s()*TS,r,r*.6,s()*3,0,6.283);g.fill()}}
    if(s()<M.bone)put(gSpr('bone',(s()*6)|0),x0+15+s()*70,y0+15+s()*70,1.3+s()*.5)}
  // 3) 벽 밑 그늘과 먼지
  for(const [i,j] of tiles){const x0=OX+i*TS,y0=OY+j*TS;
    for(const [a,b] of [[-1,0],[1,0],[0,-1],[0,1]]){if(dgFloor(i+a,j+b))continue;const w=a<0||b<0?44:30,k=a<0||b<0?.6:.42;
      let gr;if(a===-1)gr=g.createLinearGradient(x0,0,x0+w,0);else if(a===1)gr=g.createLinearGradient(x0+TS,0,x0+TS-w,0);else if(b===-1)gr=g.createLinearGradient(0,y0,0,y0+w);else gr=g.createLinearGradient(0,y0+TS,0,y0+TS-w);
      gr.addColorStop(0,`rgba(${M.soot},${k})`);gr.addColorStop(1,`rgba(${M.soot},0)`);g.fillStyle=gr;g.fillRect(x0,y0,TS,TS);
      const s=mulberry(i*31+j*17+a*5+b*3);for(let n=0;n<3;n++){const t=s()*TS,x=a?x0+(a<0?6:TS-6):x0+t,y=b?y0+(b<0?6:TS-6):y0+t;put(gSpr('pebble',(s()*6)|0,M.slab.map(v=>v*.8)),x,y,.9+s()*.5)}}}
  g.setTransform(sc,0,0,sc,0,0)}
function drawDungeonFloor(){const cs=[S2W(0,0),S2W(W,0),S2W(0,H),S2W(W,H)];
  drawGround(Math.floor(Math.min(...cs.map(c=>c.x))/CH),Math.floor(Math.max(...cs.map(c=>c.x))/CH),Math.floor(Math.min(...cs.map(c=>c.y))/CH),Math.floor(Math.max(...cs.map(c=>c.y))/CH))}
// 벽: 벽돌 면 두 장 + 윗면(이끼/먼지) + 밑동 그을음 + 모서리 기둥. 던전 · 높이 · 변형마다 한 번 굽는다
function wallSprite(d,h,v,pil){const M=DGMAT[d.id]||DGMAT.barrow,key=`wall/${d.id}/${h}/${v}/${pil}`;
  return SC.get(key,176,h+100,88,h+52,g=>{g.translate(88,h+52);const s=mulberry(v*977+h+d.id.length*31),rc=(c,k,a)=>`rgba(${Math.min(255,c[0]*k)|0},${Math.min(255,c[1]*k)|0},${Math.min(255,c[2]*k)|0},${a==null?1:a})`;
    const A=[0,-37.5],B=[75,0],C=[0,37.5],D=[-75,0],tex=g.createPattern(Kit.tile('stone'),'repeat');g.lineJoin='round';
    // 면: (원점, 가로 방향) → 면 좌표 u(0..100) · v(0..h, 위로)
    const face=(o,dx,dy,lit)=>{g.save();g.transform(dx,dy,0,-1,o[0],o[1]);
      g.fillStyle=rc(M.mortar,1);g.fillRect(0,0,100,h);
      const rows=Math.max(1,Math.round(h/17)),rh=h/rows;
      for(let r=0;r<rows;r++){let u=-(s()*26)-(r%2?13:0);while(u<100){const L=22+s()*16,u0=u<=0?0:u+1,u1=u+L>=100?100:u+L-1;if(u1-u0>3){const k=lit*(.82+s()*.32),y0=r*rh+1.2,y1=(r+1)*rh-1.2;
          g.fillStyle=rc(M.brick,k);g.beginPath();g.roundRect?g.roundRect(u0,y0,u1-u0,y1-y0,1.5):g.rect(u0,y0,u1-u0,y1-y0);g.fill();
          g.fillStyle=rc(M.brick,k*1.3+.1,.5);g.fillRect(u0+.5,y1-1.6,u1-u0-1,1.4);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(u0+.5,y0,u1-u0-1,1.3);
          if(s()<.12){g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=.7;g.beginPath();g.moveTo(u0+s()*(u1-u0),y1);g.lineTo(u0+s()*(u1-u0),y0+(y1-y0)*s());g.stroke()}}u+=L}}
      g.globalAlpha=.3;g.globalCompositeOperation='overlay';g.fillStyle=tex;g.fillRect(0,0,100,h);g.globalAlpha=1;g.globalCompositeOperation='source-over';
      const gr=g.createLinearGradient(0,0,0,46);gr.addColorStop(0,`rgba(${M.soot},.8)`);gr.addColorStop(1,`rgba(${M.soot},0)`);g.fillStyle=gr;g.fillRect(0,0,100,46);
      const gt=g.createLinearGradient(0,h,0,h-24);gt.addColorStop(0,'rgba(0,0,0,.25)');gt.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gt;g.fillRect(0,h-24,100,24);
      // 이끼/먼지 흘러내림
      const mc=M.moss||M.topDust;for(let k=0;k<(M.moss?16:9);k++){const u=s()*100,len=4+s()*(M.moss?22:8),w=2+s()*4;g.fillStyle=rc(mc,.7+s()*.4,M.moss?.6:.35);g.beginPath();g.ellipse(u,h-len/2,w,len/2,0,0,6.283);g.fill()}
      if(M.ember)for(let k=0;k<3;k++){let u=s()*100,vv=8+s()*(h-30);g.strokeStyle='rgba(255,90,30,.55)';g.lineWidth=1.1;g.beginPath();g.moveTo(u,vv);for(let q=0;q<4;q++){u+=(s()-.5)*10;vv+=4+s()*7;g.lineTo(u,vv)}g.stroke()}
      if(M.iron&&s()<.5){const u=20+s()*60;g.fillStyle='#2a2828';g.fillRect(u,h*.35,5,h*.4);g.fillStyle='rgba(200,190,180,.3)';g.fillRect(u,h*.35,1.2,h*.4);for(const q of [.4,.7]){g.fillStyle='#4a4644';g.beginPath();g.arc(u+2.5,h*q,1.6,0,6.283);g.fill()}}
      g.restore()};
    face(D,.75,.375,.92);face(B,-.75,.375,.62);
    // 면이 만나는 모서리 빛
    g.strokeStyle='rgba(255,236,200,.12)';g.lineWidth=1.5;g.beginPath();g.moveTo(C[0]-1,C[1]);g.lineTo(C[0]-1,C[1]-h);g.stroke();
    // 윗면
    const U=[A,B,C,D].map(p=>[p[0],p[1]-h]),tp=()=>{g.beginPath();U.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()};
    tp();g.fillStyle=rc(M.top,1.05);g.fill();g.save();tp();g.clip();g.globalAlpha=.45;g.globalCompositeOperation='overlay';g.fillStyle=tex;g.fillRect(-80,-h-40,160,90);g.globalAlpha=1;g.globalCompositeOperation='source-over';
    for(let k=0;k<22;k++){const x=(s()-.5)*130,y=-h+(s()-.5)*60,r=3+s()*8;g.fillStyle=rc(s()<.5?M.topDust:M.top,.7+s()*.5,.4);g.beginPath();g.ellipse(x,y,r,r*.5,0,0,6.283);g.fill()}
    for(let k=0;k<5;k++){const x=(s()-.5)*90,y=-h+(s()-.5)*36;g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(x+1.4,y+1,3.4,1.8,0,0,6.283);g.fill();g.fillStyle=rc(M.brick,1.15);g.beginPath();g.ellipse(x,y,3,1.7,0,0,6.283);g.fill()}
    g.restore();
    g.lineWidth=2;g.strokeStyle=rc(M.topDust,1.25,.55);g.beginPath();g.moveTo(U[3][0],U[3][1]);g.lineTo(U[2][0],U[2][1]);g.stroke();g.strokeStyle=rc(M.topDust,1,.3);g.beginPath();g.moveTo(U[2][0],U[2][1]);g.lineTo(U[1][0],U[1][1]);g.stroke();
    g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;g.beginPath();g.moveTo(U[3][0],U[3][1]);g.lineTo(U[0][0],U[0][1]);g.lineTo(U[1][0],U[1][1]);g.stroke();
    // 모서리 기둥
    if(pil){const x0=-10,x1=10,yb=C[1]+3,yt=C[1]-h-8;g.fillStyle=rc(M.brick,.95);g.fillRect(x0,yt,10,yb-yt);g.fillStyle=rc(M.brick,.62);g.fillRect(0,yt,10,yb-yt);
      g.globalAlpha=.3;g.globalCompositeOperation='overlay';g.fillStyle=tex;g.fillRect(x0,yt,20,yb-yt);g.globalAlpha=1;g.globalCompositeOperation='source-over';
      for(let y=yb-20;y>yt+10;y-=20){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x0,y,20,1.4);g.fillStyle='rgba(255,240,220,.1)';g.fillRect(x0,y+1.4,20,1)}
      const gr=g.createLinearGradient(0,yb,0,yb-40);gr.addColorStop(0,`rgba(${M.soot},.75)`);gr.addColorStop(1,`rgba(${M.soot},0)`);g.fillStyle=gr;g.fillRect(x0,yb-40,20,40);
      g.fillStyle=rc(M.top,1.1);g.fillRect(x0-3,yt-5,26,7);g.fillStyle=rc(M.top,.7);g.fillRect(x0-3,yt+2,26,3);g.fillStyle=rc(M.brick,.9);g.fillRect(x0-3,yb-7,26,7);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x0-3,yb-1,26,2);
      g.strokeStyle='rgba(255,236,200,.22)';g.lineWidth=1.2;g.beginPath();g.moveTo(x0+.6,yb);g.lineTo(x0+.6,yt);g.stroke();
      if(M.moss){g.fillStyle=rc(M.moss,1,.6);g.beginPath();g.ellipse(x0+5,yt+3,9,4,0,0,6.283);g.fill()}}
    // 바깥선
    g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1;g.beginPath();g.moveTo(D[0],D[1]);g.lineTo(C[0],C[1]);g.lineTo(B[0],B[1]);g.stroke()},{force:1})}
function torchSprite(){return SC.get('dg/torchb',30,40,15,34,g=>{g.translate(15,34);
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(-5,-18,11,16);g.fillStyle='#2e2a28';g.fillRect(-6,-20,10,16);g.fillStyle='#4e4844';g.fillRect(-6,-20,2,16);
  for(const y of [-17,-8]){g.fillStyle='#6a625c';g.beginPath();g.arc(-1,y,1.3,0,6.283);g.fill()}
  g.strokeStyle='#3a3430';g.lineWidth=2.4;g.lineCap='round';g.beginPath();g.moveTo(-1,-12);g.quadraticCurveTo(4,-14,5,-22);g.stroke();
  g.fillStyle='#5a3a22';g.beginPath();g.moveTo(1,-20);g.lineTo(9,-20);g.lineTo(7,-30);g.lineTo(3,-30);g.closePath();g.fill();g.fillStyle='#7a5434';g.fillRect(2.5,-30,2,10);
  g.fillStyle='#3a3430';g.fillRect(0,-24,10,3);g.fillStyle='rgba(255,220,180,.25)';g.fillRect(0,-24,10,1)},{force:1,pin:1})}
const FLAMES={};
function flameCv(col,f){const key=col+f;if(FLAMES[key])return FLAMES[key];const cv=document.createElement('canvas');cv.width=24;cv.height=40;const g=cv.getContext('2d'),s=mulberry(f*13+5);
  for(const [sc0,c,a] of [[1,col,.7],[.62,'#ffd890',.85],[.32,'#fff6d8',.95]]){const w=7*sc0,h=26*sc0+f*1.5,sw=(s()-.5)*4*sc0;g.fillStyle=c;g.globalAlpha=a;g.beginPath();g.moveTo(12-w,36);g.quadraticCurveTo(12-w*1.1,36-h*.5,12+sw,36-h);g.quadraticCurveTo(12+w*1.1,36-h*.5,12+w,36);g.quadraticCurveTo(12,39,12-w,36);g.fill()}
  return FLAMES[key]=cv}
function drawTorchFlame(s,t){const f=Math.floor(time*12+t.x*.1)%4;ctx.globalAlpha=.95;ctx.drawImage(flameCv(DG.d.torch,f),s.x-12+5,s.y-112,24,40)}
function wallTorch(w){if(!DG._tm){DG._tm=new Map();for(const t of DG.torches)for(const [a,b] of [[1,0],[0,1]]){const q=dgTile(t.x-a*52,t.y-b*52);if(dgFloor(q.i,q.j))continue;
      const c=tc(q.i,q.j);if(Math.abs(c.x+a*52-t.x)<1&&Math.abs(c.y+b*52-t.y)<1){DG._tm.set(tIdx(q.i,q.j),t);break}}}
  return DG._tm.get(tIdx(w.i,w.j))}
function drawWall(w){
  const ps=P._s||W2S(P.x,P.y),s=w._s;
  const front=w.x+w.y>P.x+P.y&&Math.abs(s.x-ps.x)<150&&s.y-ps.y>-30&&s.y-ps.y<280;
  const h=front?26:w.h,hv=hash(w.i,w.j),v=(hv*4)|0,pil=!front&&(dgFloor(w.i+1,w.j)||dgFloor(w.i,w.j+1))&&(dgFloor(w.i+1,w.j)!==dgFloor(w.i+1,w.j+1)||dgFloor(w.i,w.j+1)!==dgFloor(w.i+1,w.j+1)||hv>.72)?1:0;
  const e=wallSprite(DG.d,h,v,pil);ctx.globalAlpha=front?.55:1;if(e)SC.draw(ctx,e,s.x,s.y);
  const t=wallTorch(w);if(t){const st=W2S(t.x,t.y),b=torchSprite();if(b)SC.draw(ctx,b,st.x,st.y-48)}
  ctx.globalAlpha=1}
// 디버그/측정용 (그림 전용): 조각 굽기 통계와 캐시 크기
window.__gfx={GSTAT,get chunks(){return chunks},SC,bake(cx,cy,sc){const c=document.createElement('canvas');c.width=c.height=Math.round(CH*sc);const g=c.getContext('2d');g.scale(sc,sc);const t=performance.now();paintChunk(g,cx*CH,cy*CH);return performance.now()-t}};
