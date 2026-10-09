/* ---------- 마을 그림: 손으로 칠한 건물 · 소품 · 가구 (모두 한 번 구워 drawImage만) ---------- */
// 좌표: 월드(x,y,z) → 스프라이트 안 화면 좌표. 빛은 왼쪽 위에서, 그림자는 오른쪽 아래로 눕는다.
const isoP=(x,y,z)=>({x:(x-y)*KI,y:(x+y)*KI/2-(z||0)});
// 면 좌표계: O에서 U(월드 1단위) · V(월드 1단위) 방향. 면 위에서는 (u,v)로 그린다 (v가 위쪽)
function faceT(g,O,U,V){const o=isoP(O[0],O[1],O[2]),u=isoP(U[0],U[1],U[2]),v=isoP(V[0],V[1],V[2]);g.transform(u.x,u.y,v.x,v.y,o.x,o.y)}
const TWPAL={// 재질 팔레트
  bren:{wall:'plaster',wc:'#d9c9a2',timber:'#4a3220',base:'#77705f',roof:'thatch',rc:['#b39552','#a4864a','#bf9f5c'],door:'#5a3a22',shut:['#3e5a3a','#7a3a2a','#3a4a6a'],trim:'#4a3220',moss:1},
  will:{wall:'plank',wc:'#8a6c4e',timber:'#3e2c1e',base:'#5e5a52',roof:'shingle',rc:['#4c5c6a','#3e505c','#5c5248'],door:'#3e2c1e',shut:['#2e5a6a','#5a6a7a','#6a4a2a'],trim:'#2e2218',stilt:1},
  haven:{wall:'plaster',wc:'#cdb48e',timber:'#5a3a24',base:'#7a6a58',roof:'tile',rc:['#9c4c30','#8a4028','#ab5a32'],door:'#4e2e1c',shut:['#7a5a2a','#3e5a3a','#6a2a2a'],trim:'#5a3a24',stoneLow:1},
  arden:{wall:'ashlar',wc:'#e6e1d6',timber:null,base:'#b8b2a4',roof:'slate',rc:['#3c4c6c','#30405e','#485470'],door:'#3a2c4a',shut:['#2e3e6a','#4a3a6a','#2e4a5a'],trim:'#c8b070',arch:1},
  gold:{wall:'plaster',wc:'#e0cc96',timber:'#6a4420',base:'#7a6e56',roof:'thatch',rc:['#c8a450','#b8943e','#d0ae5a'],door:'#6a4420',shut:['#7a3a2a','#3e5a3a','#6a5a2a'],trim:'#6a4420'},
  elder:{wall:'log',wc:'#6e5236',timber:'#3e2c1c',base:'#5a5e4e',roof:'shingle',rc:['#4a5a32','#3e4e2c','#56603a'],door:'#3e2c1c',shut:['#3e5a2a','#5a4a2a','#2e4a3a'],trim:'#3e2c1c',moss:1},
  sahar:{wall:'adobe',wc:'#d6a676',timber:'#6a4a2a',base:'#a87a50',roof:'flat',rc:['#c89a6a','#b88a5a','#d0a070'],door:'#5a3a22',shut:['#2e6a7a','#7a3a2a','#3a5a8a'],trim:'#6a4a2a'},
  frost:{wall:'plank',wc:'#5e4a3a',timber:'#2e2218',base:'#6a6e78',roof:'slate',rc:['#3a4656','#2e3a4a','#46505e'],door:'#2e2218',shut:['#6a2a2a','#2e4a6a','#4a4a3a'],trim:'#2e2218',snow:1},
  tamal:{wall:'bamboo',wc:'#a89058',timber:'#5a4422',base:'#5a6048',roof:'leaf',rc:['#5a6a2e','#4e5e28','#66743a'],door:'#4a3418',shut:['#8a3a2a','#2e6a4a','#8a6a2a'],trim:'#4a3418',stilt:1},
  ember:{wall:'stone',wc:'#5a4e4a',timber:'#2a1e1a',base:'#3e3634',roof:'iron',rc:['#4a3a36','#3e302c','#56443e'],door:'#2a1e1a',shut:['#6a2a1a','#4a3a2a','#5a2a2a'],trim:'#8a4a2a'},
  pearl:{wall:'plaster',wc:'#ece6da',timber:null,base:'#a89e8a',roof:'tile',rc:['#2e6a7a','#3a7a86','#2a5a6a'],door:'#2a4a5a',shut:['#2e6a8a','#3a8a8a','#2a4a7a'],trim:'#2a4a5a'},
};
// 면 하나 칠하기 (지역 좌표: u 0..L 오른쪽, v 0..H 위쪽). lf: 밝기(빛 받는 면 1, 그늘진 면 .64)
function twWall(g,L,H,M,lf,s,o){o=o||{};
  const base=Kit.lit(M.wc,lf>=1?.06:-(1-lf)*.75);
  {const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,Kit.lit(base,-.32));gr.addColorStop(.22,base);gr.addColorStop(.8,Kit.lit(base,.08));gr.addColorStop(1,Kit.lit(base,-.38));g.fillStyle=gr;g.fillRect(0,0,L,H)}
  const blocks=(rowH,minW,maxW,col,gap,stag)=>{for(let v=0,r=0;v<H;v+=rowH,r++){let u=stag&&r%2?-minW*.5:0;while(u<L){const w=minW+s()*(maxW-minW);g.fillStyle=Kit.lit(col,(s()-.5)*.24+(lf-1)*.7);g.fillRect(Math.max(0,u)+gap/2,v+gap/2,Math.min(w,L-u)-gap,rowH-gap);
      g.fillStyle='rgba(255,246,224,.12)';g.fillRect(Math.max(0,u)+gap/2,v+rowH-gap/2-1,Math.min(w,L-u)-gap,1);u+=w}}};
  if(M.wall==='plaster'||M.wall==='adobe'){for(let i=0;i<L*H/26;i++){const v=s()<.5?40:235;g.fillStyle=`rgba(${v},${v},${v-10},${.04+s()*.05})`;g.beginPath();g.ellipse(s()*L,s()*H,1+s()*4,1+s()*2,0,0,6.283);g.fill()}
    if(M.wall==='adobe'){g.strokeStyle='rgba(90,50,20,.3)';g.lineWidth=.7;for(let i=0;i<3;i++){let u=s()*L,v=s()*H;g.beginPath();g.moveTo(u,v);for(let k=0;k<4;k++){u+=s()*8-4;v-=s()*6;g.lineTo(u,v)}g.stroke()}}}
  else if(M.wall==='plank'){for(let v=0;v<H;v+=5.5){g.fillStyle=Kit.lit(base,(s()-.5)*.22);g.fillRect(0,v,L,5);g.fillStyle='rgba(20,12,6,.45)';g.fillRect(0,v+5,L,.8);g.fillStyle='rgba(255,240,210,.1)';g.fillRect(0,v+4.2,L,.6)}
    g.save();g.globalAlpha=.35;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'wood');g.fillRect(0,0,L,H);g.restore()}
  else if(M.wall==='log'){for(let v=0;v<H;v+=7){const gr=g.createLinearGradient(0,v,0,v+7);gr.addColorStop(0,Kit.lit(base,-.35));gr.addColorStop(.6,Kit.lit(base,.12+(s()-.5)*.1));gr.addColorStop(1,Kit.lit(base,-.2));g.fillStyle=gr;g.fillRect(-3,v,L+6,7)}
    for(const u of [0,L]){for(let v=0;v<H;v+=7){g.fillStyle=Kit.lit(base,.25);g.beginPath();g.ellipse(u,v+3.5,3,3.3,0,0,6.283);g.fill();g.strokeStyle='rgba(60,40,20,.5)';g.lineWidth=.6;g.beginPath();g.arc(u,v+3.5,1.6,0,6.283);g.stroke()}}}
  else if(M.wall==='bamboo'){for(let u=0;u<L;u+=4){g.fillStyle=Kit.lit(base,(s()-.5)*.25);g.fillRect(u,0,3.4,H);g.fillStyle='rgba(255,240,190,.18)';g.fillRect(u+.4,0,.8,H);for(let v=6+s()*6;v<H;v+=10+s()*4){g.fillStyle='rgba(60,40,10,.4)';g.fillRect(u,v,3.4,1)}}}
  else if(M.wall==='stone')blocks(7,8,16,base,1.2,1);
  else if(M.wall==='ashlar'){blocks(8,13,20,base,.9,1);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(0,H-3,L,3)}
  // 아랫단 돌
  const bh=o.baseH!=null?o.baseH:M.stoneLow?H*.38:8;if(bh>0&&M.wall!=='stone'&&M.wall!=='ashlar'){g.save();g.beginPath();g.rect(0,0,L,bh);g.clip();blocks(5.5,6,12,M.base,1,1);g.restore();g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,bh,L,1.2)}
  // 나무 뼈대
  if(M.timber&&(M.wall==='plaster')){const tc=Kit.lit(M.timber,(lf-1)*.6),hi='rgba(255,230,190,.18)';const beam=(x,y,w,h)=>{g.fillStyle=tc;g.fillRect(x,y,w,h);g.fillStyle=hi;g.fillRect(x,y+h-1,w,.8)};
    const n=Math.max(2,Math.round(L/28));for(let i=0;i<=n;i++){const u=i/n*L-1.6;g.fillStyle=tc;g.fillRect(Math.max(-.5,Math.min(L-2.7,u)),bh,3.2,H-bh);g.fillStyle=hi;g.fillRect(Math.max(-.5,Math.min(L-2.7,u)),bh,.8,H-bh)}
    beam(0,bh,L,2.6);beam(0,H*.62,L,2.6);beam(0,H-3,L,3);
    if(!o.noBrace)for(let i=0;i<n;i++){if(o.skip&&o.skip(i/n*L,(i+1)/n*L))continue;const u0=i/n*L,u1=(i+1)/n*L;g.strokeStyle=tc;g.lineWidth=2.4;g.beginPath();if(i%2){g.moveTo(u0+2,bh+2);g.lineTo(u1-2,H*.62)}else{g.moveTo(u0+2,H*.62);g.lineTo(u1-2,bh+2)}g.stroke()}}
  // 창문 · 문
  for(const w of o.win||[])twWindow(g,w,M,lf,s);
  if(o.door)twDoor(g,o.door,M,lf,s);
  // 모서리 기둥 + 외곽광 (왼쪽 모서리가 빛을 받는다)
  g.fillStyle=Kit.lit(M.trim||'#3a2a1a',(lf-1)*.5);if(M.wall!=='log'){g.fillRect(-1,0,2.4,H);g.fillRect(L-1.4,0,2.4,H)}
  if(lf>=1){g.fillStyle='rgba(255,236,200,.35)';g.fillRect(-1,0,1,H)}
  // 처마 그늘
  {const gr=g.createLinearGradient(0,H,0,H-12);gr.addColorStop(0,'rgba(10,6,4,.55)');gr.addColorStop(1,'rgba(10,6,4,0)');g.fillStyle=gr;g.fillRect(0,H-12,L,12)}
  // 바닥 쪽 젖은 흙
  {const gr=g.createLinearGradient(0,0,0,5);gr.addColorStop(0,'rgba(20,14,8,.45)');gr.addColorStop(1,'rgba(20,14,8,0)');g.fillStyle=gr;g.fillRect(0,0,L,5)}
}
function twWindow(g,w,M,lf,s){const {u,v,ww,wh}=w,arch=M.arch||w.arch;
  const shape=q=>{if(arch){q.moveTo(u,v);q.lineTo(u+ww,v);q.lineTo(u+ww,v+wh-ww/2);q.arc(u+ww/2,v+wh-ww/2,ww/2,0,Math.PI);q.closePath()}else q.rect(u,v,ww,wh)};
  g.fillStyle=Kit.lit(M.trim||'#3a2a1a',-.2+(lf-1)*.4);g.beginPath();if(arch){g.moveTo(u-1.6,v-1.6);g.lineTo(u+ww+1.6,v-1.6);g.lineTo(u+ww+1.6,v+wh-ww/2);g.arc(u+ww/2,v+wh-ww/2,ww/2+1.6,0,Math.PI);g.closePath()}else g.rect(u-1.6,v-1.6,ww+3.2,wh+3.2);g.fill();
  const gc=w.cold?['#c8d8ff','#6a7ad8','#2a3070']:['#fff0b8','#ffb950','#a8521c'],gr=g.createRadialGradient(u+ww/2,v+wh*.45,0,u+ww/2,v+wh*.45,Math.max(ww,wh)*.75);
  gr.addColorStop(0,gc[0]);gr.addColorStop(.5,gc[1]);gr.addColorStop(1,gc[2]);g.fillStyle=gr;g.beginPath();shape(g);g.fill();
  g.fillStyle=Kit.lit(M.trim||'#3a2a1a',-.35);g.fillRect(u+ww/2-.6,v,1.2,wh-(arch?ww/2-1:0));g.fillRect(u,v+wh*.5,ww,1.1);
  g.fillStyle='rgba(255,255,255,.35)';g.fillRect(u+1,v+wh-3,ww*.3,1);
  g.fillStyle=Kit.lit(M.base||'#7a7468',.15);g.fillRect(u-2.4,v-3.2,ww+4.8,2);// 창턱
  if(w.shut&&!arch){const sc=Kit.lit(w.shut,(lf-1)*.5);for(const x of [u-ww*.48-2,u+ww+2]){g.fillStyle=sc;g.fillRect(x,v-1,ww*.48,wh+2);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+ww*.24-.3,v-1,.6,wh+2);g.fillStyle='rgba(255,240,210,.18)';g.fillRect(x,v+wh,ww*.48,.8)}}
  if(w.box){g.fillStyle='#5a3a22';g.fillRect(u-2,v-6.5,ww+4,3.5);for(let i=0;i<5;i++){g.fillStyle=['#e07a96','#f0d870','#d84a4a','#f4f0e4','#8aa8e8'][(i+((s()*5)|0))%5];g.beginPath();g.arc(u-1+i*(ww+2)/4,v-2.5+s()*1.5,1.6,0,6.283);g.fill()}g.fillStyle='#3e6a2a';g.fillRect(u-2,v-3.5,ww+4,1)}}
function twDoor(g,d,M,lf,s){const {u,dw,dh}=d,v=0,arch=M.arch||d.arch;
  const shp=(q,p)=>{q.moveTo(u-p,v);q.lineTo(u+dw+p,v);if(arch){q.lineTo(u+dw+p,v+dh-dw/2);q.arc(u+dw/2,v+dh-dw/2,dw/2+p,0,Math.PI)}else{q.lineTo(u+dw+p,v+dh+p);q.lineTo(u-p,v+dh+p)}q.closePath()};
  g.fillStyle=Kit.lit(M.base||'#7a7468',(lf-1)*.4);g.beginPath();shp(g,2.4);g.fill();
  const dc=Kit.lit(d.col||M.door,(lf-1)*.5);g.fillStyle=dc;g.beginPath();shp(g,0);g.fill();
  g.save();g.beginPath();shp(g,0);g.clip();for(let x=u+dw/4;x<u+dw;x+=dw/4){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-.4,0,.8,dh)}
  g.fillStyle='rgba(255,230,190,.12)';g.fillRect(u,0,1.2,dh);g.fillStyle='#2a2420';g.fillRect(u,dh*.25,dw,1.4);g.fillRect(u,dh*.7,dw,1.4);g.restore();
  g.fillStyle='#d8b060';g.beginPath();g.arc(u+dw*.78,dh*.45,1,0,6.283);g.fill();
  if(d.lamp){const x=u+dw+5;g.fillStyle='#2a2018';g.fillRect(x-.5,dh*.7,4,1);g.fillRect(x+2.6,dh*.55,1,6);g.fillStyle='#ffd27a';g.fillRect(x+1.4,dh*.45,3.4,4.6)}}
// 지붕 비탈 하나 (u 0..L 용마루 방향, v 0..S 처마→용마루). 재질별 결
function twRoof(g,L,S,M,col,lf,s){const kind=M.roof,base=Kit.lit(col,(lf-1)*.55);
  {const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,Kit.lit(base,-.3));gr.addColorStop(.6,base);gr.addColorStop(1,Kit.lit(base,.22));g.fillStyle=gr;g.fillRect(0,0,L,S)}
  if(kind==='thatch'||kind==='leaf'){for(let i=0;i<L*S/5;i++){const u=s()*L,v=s()*S,l=3+s()*5;g.strokeStyle=Kit.lit(base,(s()-.45)*.5);g.lineWidth=.7+s()*.6;g.beginPath();g.moveTo(u,v);g.lineTo(u+(s()-.5)*1.5,v-l);g.stroke()}
    for(let v=S*.3;v<S;v+=S*.3){g.fillStyle='rgba(30,20,10,.18)';g.fillRect(0,v,L,1.2)}
    g.fillStyle=Kit.lit(base,-.35);g.fillRect(0,0,L,3);for(let u=0;u<L;u+=2){g.fillStyle=Kit.lit(base,(s()-.5)*.3-.15);g.fillRect(u,-1.5,1.4,3+s()*2)}
    if(kind==='leaf')for(let i=0;i<L/6;i++){g.fillStyle=Kit.lit('#4e6a2a',(s()-.5)*.4);g.beginPath();g.ellipse(s()*L,s()*S,5,2,s()*3,0,6.283);g.fill()}}
  else if(kind==='flat'){g.fillStyle='rgba(255,240,210,.08)';for(let i=0;i<20;i++){g.beginPath();g.ellipse(s()*L,s()*S,2+s()*4,1+s()*2,0,0,6.283);g.fill()}}
  else{const rh=kind==='tile'?5.5:kind==='slate'?4.6:kind==='iron'?100:5;
    if(kind==='iron'){for(let u=0;u<L;u+=6){g.fillStyle=Kit.lit(base,(s()-.5)*.2);g.fillRect(u,0,5,S);g.fillStyle='rgba(255,240,220,.2)';g.fillRect(u,0,1,S);g.fillStyle='rgba(120,40,20,.25)';g.fillRect(u+2,s()*S,2,3)}}
    else for(let v=0,r=0;v<S;v+=rh,r++){const tw=kind==='tile'?5:kind==='slate'?7:6.5;for(let u=(r%2)*tw/2-tw;u<L;u+=tw){const c=Kit.lit(base,(s()-.5)*.3);g.fillStyle=c;
        if(kind==='tile'){g.beginPath();g.moveTo(u,v);g.lineTo(u+tw,v);g.lineTo(u+tw,v+rh+1);g.quadraticCurveTo(u+tw/2,v+rh+2.4,u,v+rh+1);g.closePath();g.fill();g.fillStyle='rgba(255,230,200,.2)';g.fillRect(u+1,v+rh-.4,tw*.4,.8)}
        else{g.fillRect(u+.3,v,tw-.6,rh+.6);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(u,v,.6,rh);g.fillStyle='rgba(255,240,220,.12)';g.fillRect(u+.6,v+rh-.2,tw-1.2,.6)}}
      g.fillStyle='rgba(0,0,0,.28)';g.fillRect(0,v,L,.9)}}
  if(M.moss)for(let i=0;i<L/14;i++){g.fillStyle=`rgba(${70+s()*30|0},${96+s()*30|0},${40},${.3+s()*.3})`;g.beginPath();g.ellipse(s()*L,s()*S*.6,3+s()*6,1.5+s()*2,0,0,6.283);g.fill()}
  if(M.snow){g.fillStyle='rgba(240,246,255,.92)';g.beginPath();g.moveTo(0,S);g.lineTo(L,S);g.lineTo(L,S*.35);for(let u=L;u>0;u-=10){const m=S*(.2+s()*.18);g.quadraticCurveTo(u-5,m-4,u-10,S*(.22+s()*.15))}g.closePath();g.fill();g.fillStyle='rgba(200,215,240,.6)';for(let u=0;u<L;u+=4)g.fillRect(u,-1.5,3,2.5+s()*2.5)}
  // 용마루 쪽 빛 (왼쪽 위 광원)
  {const gr=g.createLinearGradient(0,0,L,0);gr.addColorStop(0,'rgba(255,240,210,.14)');gr.addColorStop(.6,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.18)');g.fillStyle=gr;g.fillRect(0,0,L,S)}}
// 상자 하나 (월드 좌표 기준): 윗면 · +y면(밝음) · +x면(그늘)
function twBox(g,x,y,z,w,d,h,col,o){o=o||{};const P0=(a,b,c)=>isoP(x+a,y+b,z+c),f=(pts,c)=>{g.fillStyle=c;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill()};
  const top=[P0(-w/2,-d/2,h),P0(w/2,-d/2,h),P0(w/2,d/2,h),P0(-w/2,d/2,h)],L=[P0(-w/2,d/2,0),P0(w/2,d/2,0),P0(w/2,d/2,h),P0(-w/2,d/2,h)],Rr=[P0(w/2,d/2,0),P0(w/2,-d/2,0),P0(w/2,-d/2,h),P0(w/2,d/2,h)];
  const cl=o.cl||Kit.lit(col,.02),cr=o.cr||Kit.lit(col,-.38),ct=o.ct||Kit.lit(col,.22);
  f(L,cl);f(Rr,cr);f(top,ct);
  if(o.tex){g.save();g.globalAlpha=o.texA||.35;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,o.tex);for(const q of [L,Rr,top]){g.beginPath();q.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill()}g.restore()}
  g.strokeStyle='rgba(255,240,214,.35)';g.lineWidth=.8;g.beginPath();g.moveTo(top[3].x,top[3].y);g.lineTo(top[0].x,top[0].y);g.lineTo(top[1].x,top[1].y);g.stroke();
  if(!o.noLine){g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(col,-.75)),.55);g.lineWidth=.7;g.beginPath();[L[0],L[1],Rr[1],Rr[2],top[0],top[3],L[0]].forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke()}
  return{top,L,R:Rr}}
// 원기둥(통 · 탑): 중심 (x,y), 반지름, 높이
function twCyl(g,x,y,z,r,h,col,o){o=o||{};const c=isoP(x,y,z),t=isoP(x,y,z+h),rx=r*KI*1.414,ry=rx/2;
  const gr=g.createLinearGradient(c.x-rx,0,c.x+rx,0);gr.addColorStop(0,Kit.lit(col,.25));gr.addColorStop(.45,col);gr.addColorStop(1,Kit.lit(col,-.5));
  g.fillStyle=gr;g.beginPath();g.ellipse(c.x,c.y,rx,ry,0,0,Math.PI);g.lineTo(t.x-rx,t.y);g.ellipse(t.x,t.y,rx,ry,0,Math.PI,0,true);g.closePath();g.fill();
  if(o.bands)for(const k of o.bands){const p=isoP(x,y,z+h*k);g.strokeStyle=o.bandC||'#3a3430';g.lineWidth=1.4;g.beginPath();g.ellipse(p.x,p.y,rx,ry,0,0,Math.PI);g.stroke()}
  g.fillStyle=o.top||Kit.lit(col,.15);g.beginPath();g.ellipse(t.x,t.y,rx,ry,0,0,6.283);g.fill();g.strokeStyle='rgba(255,240,214,.4)';g.lineWidth=.8;g.beginPath();g.ellipse(t.x,t.y,rx,ry,0,Math.PI*.9,Math.PI*1.6);g.stroke();
  return{c,t,rx,ry}}

/* ---------- 건물 ---------- */
// b: {st, w,d (그림 좌표), h, rh, ridge, door:{face:'x'|'y',f}, win:n, chim, extra, v, sign}
// 그림 좌표에서 +y면이 화면 왼쪽 아래(빛), +x면이 오른쪽 아래(그늘, 박공).
function twHousePaint(g,b,M,ax,ay,out){
  const s=mulberry(b.seed||7),{w,d,h}=b,rh=b.rh||Math.min(48,d*.5),oh=6,col=M.rc[(b.v||0)%3];
  g.translate(ax,ay);
  // 접지 그림자: 오른쪽 아래로 길게
  Kit.shadow(g,isoP(w*.15,d*.25,0).x+18,isoP(w*.15,d*.25,0).y+6,(w+d)*KI*.72,(w+d)*KI*.26,.95);
  const stil=M.stilt&&b.stilt!==0?8:0,H0=stil;
  if(stil){for(const [px,py] of [[-w/2+4,d/2-2],[w/2-4,d/2-2],[w/2-2,-d/2+4],[0,d/2-2]]){const a=isoP(px,py,0),c2=isoP(px,py,stil);g.fillStyle='#3a2c1e';g.fillRect(a.x-1.6,c2.y,3.2,a.y-c2.y)}}
  const lfY=1,lfX=.64;
  // 뒤 지붕 (그늘)
  const RP=(x,y,z)=>isoP(x,y,z+H0);
  const poly=(pts,c)=>{g.fillStyle=c;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill()};
  const flat=M.roof==='flat';
  if(!flat)poly([RP(-w/2-oh,-d/2-oh,h),RP(w/2+oh,-d/2-oh,h),RP(w/2+oh,0,h+rh),RP(-w/2-oh,0,h+rh)],Kit.lit(col,-.6));
  // 벽: +y면 (문과 창), +x면
  const door=b.door||{face:'y',f:.5};
  const winY=[],winX=[];const nY=b.winY!=null?b.winY:Math.max(1,Math.round(w/40)),nX=b.winX!=null?b.winX:Math.max(0,Math.round(d/50));
  const ww=b.big?9:7.5,wh=b.big?12:10,wv=h*(b.tall?.62:.42);
  const dw=b.big?16:12,dh=Math.min(h*.72,b.big?30:22);
  const placeWins=(n,L,arr,df)=>{for(let i=0;i<n;i++){let u=(i+.5)/n*L-ww/2;if(df!=null&&Math.abs(u+ww/2-df)<dw*.5+ww*.9+4)u=u+ww/2<df?df-dw/2-ww*1.4-3:df+dw/2+ww*.4+3;if(u<5||u+ww>L-5)continue;arr.push({u,v:wv,ww,wh,shut:M.shut[(i+(b.v|0))%3],box:b.box&&i%2===0,cold:b.cold});if(b.tall&&h>48)arr.push({u,v:wv-h*.38,ww,wh,shut:M.shut[(i+1)%3],cold:b.cold})}};
  const dY=door.face==='y'?door.f*w:null,dX=door.face==='x'?(1-door.f)*d:null;
  placeWins(nY,w,winY,dY);placeWins(nX,d,winX,dX);
  const mark=(face,u,v)=>face==='y'?RP(-w/2+u,d/2,v):RP(w/2,d/2-u,v);
  g.save();faceT(g,[-w/2,d/2,H0],[1,0,0],[0,0,1]);twWall(g,w,h,M,lfY,s,{win:winY,door:dY!=null?{u:dY-dw/2,dw,dh,lamp:b.lamp,col:b.doorC}:null,skip:(a,c)=>dY!=null&&dY>a-6&&dY<c+6});g.restore();
  g.save();faceT(g,[w/2,d/2,H0],[0,-1,0],[0,0,1]);twWall(g,d,h,M,lfX,s,{win:winX,door:dX!=null?{u:dX-dw/2,dw,dh,lamp:b.lamp,col:b.doorC}:null,skip:(a,c)=>dX!=null&&dX>a-6&&dX<c+6});g.restore();
  for(const q of winY)out.win.push(mark('y',q.u+ww/2,q.v+wh/2));for(const q of winX)out.win.push(mark('x',q.u+ww/2,q.v+wh/2));
  if(b.lamp){if(dY!=null)out.win.push(mark('y',dY+dw/2+7,dh*.5));if(dX!=null)out.win.push(mark('x',dX+dw/2+7,dh*.5))}
  if(flat){// 평평한 지붕 + 난간
    twBox(g,0,0,h+H0,w+4,d+4,4,Kit.lit(M.wc,-.1),{ct:Kit.lit(col,.1),noLine:1});
    for(const [a,b2,c,e2] of [[-w/2-2,d/2+2,w/2+2,d/2+2],[w/2+2,d/2+2,w/2+2,-d/2-2]]){const p1=RP(a,b2,h+4),p2=RP(c,e2,h+4),p3=RP(c,e2,h+9),p4=RP(a,b2,h+9);poly([p1,p2,p3,p4],Kit.lit(M.wc,a===w/2+2?-.25:.08))}
    if(b.chim!==0){const p=RP(w*.2,-d*.2,h+4);g.fillStyle='#6a4a2a';for(let i=0;i<5;i++)g.fillRect(p.x-12+i*5,p.y-6,1.4,8);}
  }else{
    // 박공 삼각형 (+x면)
    g.save();faceT(g,[w/2,d/2,H0],[0,-1,0],[0,0,1]);g.beginPath();g.moveTo(-oh*.2,h);g.lineTo(d+oh*.2,h);g.lineTo(d/2,h+rh);g.closePath();g.clip();
    twWall(g,d,h+rh+2,M,lfX-.08,s,{baseH:0,noBrace:1});
    g.fillStyle=Kit.lit(M.trim||'#3a2a1a',-.3);g.fillRect(d/2-1.4,h,2.8,rh);if(rh>26){g.fillStyle='#2a1a10';g.beginPath();g.arc(d/2,h+rh*.42,3.4,0,6.283);g.fill();g.fillStyle='#ffb950';g.beginPath();g.arc(d/2,h+rh*.42,2.4,0,6.283);g.fill();out.win.push(RP(w/2,0,h+rh*.42))}
    g.restore();
    // 앞 지붕 비탈
    const S0=Math.hypot(d/2,rh),SL=S0*(1+oh/(d/2));g.save();faceT(g,[-w/2-oh,d/2+oh,h+H0-oh*rh/(d/2)],[1,0,0],[0,-(d/2)/S0,rh/S0]);g.beginPath();g.rect(0,0,w+oh*2,SL);g.clip();twRoof(g,w+oh*2,SL,M,col,lfY,s);g.restore();
    // 박공 처마 널 + 용마루
    const e1=RP(w/2+oh,d/2+oh,h-oh*rh/(d/2)),e2=RP(w/2+oh,0,h+rh),e3=RP(w/2+oh,-d/2-oh,h-oh*rh/(d/2));
    g.strokeStyle=Kit.lit(M.trim||'#3a2a1a',-.25);g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(e1.x,e1.y);g.lineTo(e2.x,e2.y);g.lineTo(e3.x,e3.y);g.stroke();
    g.strokeStyle='rgba(255,232,190,.35)';g.lineWidth=.9;g.beginPath();g.moveTo(e1.x,e1.y-1.4);g.lineTo(e2.x,e2.y-1.4);g.stroke();
    const r1=RP(-w/2-oh,0,h+rh),r2=RP(w/2+oh,0,h+rh);g.strokeStyle=Kit.lit(col,M.roof==='thatch'?-.15:.25);g.lineWidth=M.roof==='thatch'?5:2.4;g.beginPath();g.moveTo(r1.x,r1.y);g.lineTo(r2.x,r2.y);g.stroke();
    g.strokeStyle='rgba(255,240,214,.4)';g.lineWidth=.9;g.beginPath();g.moveTo(r1.x,r1.y-1.8);g.lineTo(r2.x,r2.y-1.8);g.stroke();
    // 굴뚝
    if(b.chim!==0){const cx=-w*.22,cy=-d*.12,z=h+rh*(1-Math.abs(cy)/(d/2))-4;twBox(g,cx,cy,z+H0,10,10,rh*.28+10,'#7a6e62',{tex:'stone',texA:.5});const top=RP(cx,cy,z+rh*.28+10);out.smoke=[top.x,top.y-2];
      g.fillStyle='#2a2420';g.beginPath();g.ellipse(top.x,top.y,4.5,2.2,0,0,6.283);g.fill()}
  }
  if(b.sign){const p=door.face==='y'?RP(-w/2+(dY||w/2)+dw*.5+16,d/2+8,h*.78):RP(w/2+8,d/2-(dX||d/2)-dw*.5-14,h*.78);out.sign=[p.x,p.y]}
}
// 탑 (네모 몸통 + 뾰족 지붕): 예배당 종탑, 마법원 첨탑, 망루
function twTowerPaint(g,t,M,col,s,out,H0){const {x,y,sz,h}=t,rh=t.rh||sz*1.6,RP=(a,b,c)=>isoP(x+a,y+b,c+(H0||0));
  g.save();faceT(g,[x-sz/2,y+sz/2,H0||0],[1,0,0],[0,0,1]);twWall(g,sz,h,M,1,s,{noBrace:1,win:[{u:sz/2-3.5,v:h-26,ww:7,wh:13,arch:1,cold:t.cold}],baseH:6});g.restore();
  g.save();faceT(g,[x+sz/2,y+sz/2,H0||0],[0,-1,0],[0,0,1]);twWall(g,sz,h,M,.64,s,{noBrace:1,win:[{u:sz/2-3.5,v:h-26,ww:7,wh:13,arch:1,cold:t.cold}],baseH:6});g.restore();
  out.win.push(RP(0,sz/2,h-19),RP(sz/2,0,h-19));
  if(t.bell){const p=RP(0,sz/2,h-12);g.fillStyle='#c89a3a';g.beginPath();g.moveTo(p.x-3,p.y+2);g.quadraticCurveTo(p.x-3,p.y-5,p.x,p.y-5);g.quadraticCurveTo(p.x+3,p.y-5,p.x+3,p.y+2);g.closePath();g.fill()}
  twBox(g,x,y,h+(H0||0),sz+4,sz+4,3,Kit.lit(M.wc,-.05),{ct:Kit.lit(M.wc,.15)});
  const ap=RP(0,0,h+3+rh),c1=RP(-sz/2-3,sz/2+3,h+3),c2=RP(sz/2+3,sz/2+3,h+3),c3=RP(sz/2+3,-sz/2-3,h+3);
  for(const [A,B,lf] of [[c1,c2,1],[c2,c3,.6]]){g.save();g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.lineTo(ap.x,ap.y);g.closePath();g.clip();
    const gr=g.createLinearGradient(ap.x,ap.y,(A.x+B.x)/2,(A.y+B.y)/2);gr.addColorStop(0,Kit.lit(col,lf>=1?.25:-.2));gr.addColorStop(1,Kit.lit(col,lf>=1?-.1:-.55));g.fillStyle=gr;g.fillRect(Math.min(A.x,B.x)-2,ap.y,Math.abs(B.x-A.x)+4,Math.max(A.y,B.y)-ap.y+2);
    for(let k=.12;k<1;k+=.1){const P1={x:ap.x+(A.x-ap.x)*k,y:ap.y+(A.y-ap.y)*k},P2={x:ap.x+(B.x-ap.x)*k,y:ap.y+(B.y-ap.y)*k};g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=.7;g.beginPath();g.moveTo(P1.x,P1.y);g.lineTo(P2.x,P2.y);g.stroke()}
    g.restore()}
  g.strokeStyle='rgba(255,240,214,.45)';g.lineWidth=1;g.beginPath();g.moveTo(c1.x,c1.y);g.lineTo(ap.x,ap.y);g.stroke();
  if(t.flag){g.strokeStyle='#3a3430';g.lineWidth=1.2;g.beginPath();g.moveTo(ap.x,ap.y);g.lineTo(ap.x,ap.y-14);g.stroke();out.flag=[ap.x,ap.y-14,t.flag]}
  else if(t.cross){g.fillStyle='#d8b860';g.fillRect(ap.x-.8,ap.y-11,1.6,11);g.fillRect(ap.x-3.4,ap.y-8,6.8,1.6)}
  else{g.fillStyle='#d8b860';g.beginPath();g.arc(ap.x,ap.y-2,2,0,6.283);g.fill()}}
// 건물 묶음: 블록(본채 · 탑)을 깊이 순서대로. 반환: {w,h,ax,ay,win,smoke,sign,foot}
function twBldSprite(b){
  const M=TWPAL[b.st]||TWPAL.bren,key=`bld/${b.st}/${b.w}x${b.d}x${b.h}/${b.rh||0}/${b.v|0}/${b.door?b.door.face+b.door.f:''}/${b.extra||''}/${b.seed||0}/${b.chim===0?0:1}${b.tall?'t':''}${b.big?'b':''}`;
  // 크기: 모든 꼭짓점의 화면 범위
  const pts=[];const add=(x,y,z)=>pts.push(isoP(x,y,z));const W2=b.w/2+10,D2=b.d/2+10,top=b.h+(b.rh||Math.min(48,b.d*.5))+40;
  for(const [x,y] of [[-W2,-D2],[W2,-D2],[W2,D2],[-W2,D2]]){add(x,y,0);add(x,y,top)}
  for(const t of b.towers||[]){for(const [x,y] of [[t.x-t.sz,t.y-t.sz],[t.x+t.sz,t.y+t.sz],[t.x+t.sz,t.y-t.sz],[t.x-t.sz,t.y+t.sz]]){add(x,y,0);add(x,y,t.h+(t.rh||t.sz*1.6)+22)}}
  let x0=Math.min(...pts.map(p=>p.x))-6,x1=Math.max(...pts.map(p=>p.x))+50,y0=Math.min(...pts.map(p=>p.y))-6,y1=Math.max(...pts.map(p=>p.y))+22;
  const W=Math.ceil(x1-x0),Hh=Math.ceil(y1-y0),ax=-x0,ay=-y0,out={win:[],smoke:null,sign:null,flag:null};
  const e=SC.get(key,W,Hh,ax,ay,g=>{const s=mulberry((b.seed||3)*77+1);
      const blocks=[{k:'h',x:0,y:0}].concat((b.towers||[]).map(t=>({k:'t',t,x:t.x,y:t.y})));blocks.sort((a,c)=>(a.x+a.y)-(c.x+c.y));
      let shadowDone=false;
      for(const bl of blocks){if(bl.k==='h'){g.save();twHousePaint(g,b,M,ax,ay,out);g.restore();shadowDone=true}
        else{g.save();g.translate(ax,ay);if(!shadowDone){const c=isoP(bl.t.x,bl.t.y,0);Kit.shadow(g,c.x+bl.t.sz*.8,c.y+4,bl.t.sz*1.4,bl.t.sz*.5,.9)}twTowerPaint(g,bl.t,M,b.towerC||M.rc[0],s,out,0);g.restore()}}
    },{scale:Math.max(1,DPR)});
  if(e&&!e.win){e.win=out.win;e.smoke=out.smoke;e.sign=out.sign;e.flag=out.flag}
  return e}
// 풍차 날개 (돌아가는 부분만 따로)
const twBlade=()=>SC.get('tw/blade',120,120,60,60,g=>{g.translate(60,60);for(let i=0;i<4;i++){g.save();g.rotate(i*Math.PI/2);
  g.fillStyle='#5a4028';g.fillRect(-1.6,-56,3.2,54);g.fillStyle='#d8ccae';g.fillRect(1.6,-54,10,40);g.strokeStyle='rgba(90,70,40,.6)';g.lineWidth=.7;for(let y=-52;y<-14;y+=6){g.beginPath();g.moveTo(1.6,y);g.lineTo(11.6,y);g.stroke()}
  g.fillStyle='rgba(255,250,230,.25)';g.fillRect(1.6,-54,2,40);g.restore()}g.fillStyle='#3a2a1a';g.beginPath();g.arc(0,0,5,0,6.283);g.fill();g.fillStyle='#8a6a3a';g.beginPath();g.arc(-1,-1,2,0,6.283);g.fill()},{force:1,scale:Math.max(1,DPR)});
// 굴뚝 연기 한 덩이
const twPuff=()=>SC.get('tw/puff',32,32,16,16,g=>{const gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(170,165,160,.55)');gr.addColorStop(.6,'rgba(140,136,132,.25)');gr.addColorStop(1,'rgba(120,120,120,0)');g.fillStyle=gr;g.fillRect(0,0,32,32)},{force:1,scale:1});
// 간판 (글자는 뒤집히지 않게 따로)
function twSign(text,col){return SC.get('tw/sign/'+text+col,110,40,55,34,g=>{g.translate(55,34);
  g.strokeStyle='#2a2018';g.lineWidth=1.4;g.beginPath();g.moveTo(-26,-30);g.lineTo(-26,-24);g.moveTo(26,-30);g.lineTo(26,-24);g.stroke();
  g.font=`700 11px ${DISPLAY}`;const tw=Math.max(40,g.measureText(text).width+16);
  const bd=q=>{q.roundRect?q.roundRect(-tw/2,-24,tw,18,3):q.rect(-tw/2,-24,tw,18)};Kit.solid(g,bd,-tw/2,-24,tw/2,-6,col||'#6a4a2c',{tex:'wood',texA:.5,rim:'rgba(255,230,180,.7)'});
  g.fillStyle='#fff0c8';g.textAlign='center';g.textBaseline='middle';g.fillText(text,0,-14.6)},{scale:Math.max(1.5,DPR)})}

/* ---------- 소품 · 가구: 종류마다 한 장씩 굽는다 (v = 변형 0..2) ---------- */
const TWP={};
const twDef=(k,w,h,ax,ay,p)=>{TWP[k]={w,h,ax,ay,p}};
const twFill=(g,pts,c)=>{g.fillStyle=c;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill()};
// [v22] 바깥 소품 다시 칠하기: 돌 쌓기 · 널빤지 · 쇠테 · 이끼와 닳음 · 짙은 외곽선. 무거운 일은 굽는 순간에만, 매 프레임은 구운 그림 한 장
const twFace=(g,O,U,V,fn)=>{g.save();faceT(g,O,U,V);fn();g.restore()};
const twPoly=(g,pts)=>{g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath()};
// 이끼 얼룩 (면 좌표 아래쪽에 몰린다)
function twMoss(g,L,H,s,amt){for(let i=0;i<L*amt/3;i++){const u=s()*L,v=Math.pow(s(),1.7)*H;g.fillStyle=`rgba(${58+s()*40|0},${84+s()*40|0},${34+s()*16|0},${.3+s()*.35})`;g.beginPath();g.ellipse(u,v,1+s()*2.6,.8+s()*1.3,0,0,6.283);g.fill()}}
// 돌 쌓기 면 (면 좌표 u 0..L 오른쪽, v 0..H 위쪽). lf: 빛 받는 면 1, 그늘 면 .62
function twMason(g,L,H,col,s,o){o=o||{};const rh=o.rh||6,b0=o.bw?o.bw[0]:7,b1=o.bw?o.bw[1]:13,lf=o.lf==null?1:o.lf,sh=(lf-1)*.7;
  g.fillStyle=Kit.lit(col,-.5+sh*.5);g.fillRect(0,0,L,H);// 줄눈
  for(let v=0,r=0;v<H-.01;v+=rh,r++){let u=r%2?-b0*.5:0;const v1=Math.min(H,v+rh);while(u<L){const w=b0+s()*(b1-b0),x0=Math.max(0,u)+.45,x1=Math.min(L,u+w)-.45;
    if(x1>x0+.5){const c=Kit.lit(col,(s()-.5)*.24+sh),gr=g.createLinearGradient(0,v,0,v1);gr.addColorStop(0,Kit.lit(c,-.16));gr.addColorStop(1,Kit.lit(c,.12));g.fillStyle=gr;g.fillRect(x0,v+.45,x1-x0,v1-v-.9);
      g.fillStyle=`rgba(255,244,220,${lf>=1?.26:.1})`;g.fillRect(x0,v1-1.1,x1-x0,.6);g.fillStyle='rgba(8,6,10,.22)';g.fillRect(x1-.7,v+.45,.7,v1-v-.9);
      if(s()<.22){g.strokeStyle='rgba(20,16,14,.35)';g.lineWidth=.5;const cx=x0+(x1-x0)*s();g.beginPath();g.moveTo(cx,v1-1);g.lineTo(cx+s()*3-1.5,v+(v1-v)*.4);g.stroke()}}
    u+=w}}
  if(o.moss)twMoss(g,L,Math.min(H,o.mossH||8),s,o.moss);
  const ao=Math.min(H,o.ao!=null?o.ao:9);if(ao>0){const gr=g.createLinearGradient(0,0,0,ao);gr.addColorStop(0,'rgba(10,6,12,.5)');gr.addColorStop(1,'rgba(10,6,12,0)');g.fillStyle=gr;g.fillRect(0,0,L,ao)}}
// 널빤지 면: 가로(기본) 또는 세로(vert) 널. 틈 · 나뭇결 · 옹이 · 못
function twPlank(g,L,H,col,s,o){o=o||{};const lf=o.lf==null?1:o.lf,sh=(lf-1)*.7,pw=o.pw||5,vert=o.vert,n=vert?L:H;
  for(let p=0;p<n-.01;p+=pw){const q=Math.min(n,p+pw),c=Kit.lit(col,(s()-.5)*.26+sh),x=vert?p:0,y=vert?0:p,w=vert?q-p:L,h=vert?H:q-p;g.fillStyle=c;g.fillRect(x,y,w,h);
    g.strokeStyle='rgba(30,16,8,.26)';g.lineWidth=.45;for(let k=0;k<2;k++){const t=.25+s()*.5;g.beginPath();if(vert){g.moveTo(x+w*t,0);g.bezierCurveTo(x+w*(t+.2),H*.3,x+w*(t-.2),H*.7,x+w*t,H)}else{g.moveTo(0,y+h*t);g.bezierCurveTo(L*.3,y+h*(t+.25),L*.7,y+h*(t-.25),L,y+h*t)}g.stroke()}
    if(s()<.28){g.strokeStyle='rgba(30,16,8,.45)';g.beginPath();g.ellipse(vert?x+w/2:s()*L,vert?s()*H:y+h/2,vert?w*.22:1.8,vert?1.6:h*.22,0,0,6.283);g.stroke()}
    g.fillStyle=`rgba(255,236,200,${lf>=1?.18:.08})`;if(vert)g.fillRect(x,0,.7,H);else g.fillRect(0,q-.8,L,.7);
    g.fillStyle='rgba(12,6,2,.55)';if(vert)g.fillRect(q-.55,0,.55,H);else g.fillRect(0,p,L,.55);
    if(o.nails){g.fillStyle='rgba(36,32,30,.95)';for(const t of [.1,.9]){const nx=vert?x+w/2:L*t,ny=vert?H*t:y+h/2;g.fillRect(nx-.55,ny-.55,1.1,1.1)}}}
  const ao=Math.min(H,o.ao!=null?o.ao:6);if(ao>0){const gr=g.createLinearGradient(0,0,0,ao);gr.addColorStop(0,'rgba(10,6,4,.5)');gr.addColorStop(1,'rgba(10,6,4,0)');g.fillStyle=gr;g.fillRect(0,0,L,ao)}}
// 재질 상자: twBox 위에 면마다 돌/널 무늬. m: 'stone' | 'plank'(가로 널) | 'vplank'(세로 널)
function twBoxR(g,x,y,z,w,d,h,col,m,s,o){o=o||{};const r=twBox(g,x,y,z,w,d,h,col,{noLine:1});
  const paint=(L,H,lf,c,top)=>m==='stone'?twMason(g,L,H,c,s,{lf,rh:o.rh,bw:o.bw,moss:top?0:o.moss,ao:top?0:o.ao}):twPlank(g,L,H,c,s,{lf,pw:o.pw,vert:top?m!=='vplank':m==='vplank',nails:o.nails,ao:top?0:o.ao});
  const F=(O,U,V,L,H,lf,c,top)=>twFace(g,O,U,V,()=>{g.beginPath();g.rect(0,0,L,H);g.clip();paint(L,H,lf,c,top)});
  F([x-w/2,y+d/2,z],[1,0,0],[0,0,1],w,h,1,col);F([x+w/2,y+d/2,z],[0,-1,0],[0,0,1],d,h,.62,col);
  if(!o.noTop)F([x-w/2,y+d/2,z+h],[1,0,0],[0,-1,0],w,d,1.12,o.topC||Kit.lit(col,.1),1);
  const t=r.top;g.strokeStyle='rgba(255,240,214,.5)';g.lineWidth=.8;g.beginPath();g.moveTo(t[3].x,t[3].y);g.lineTo(t[0].x,t[0].y);g.lineTo(t[1].x,t[1].y);g.stroke();
  g.strokeStyle='rgba(255,236,206,.32)';g.beginPath();g.moveTo(r.L[3].x,r.L[3].y);g.lineTo(r.L[2].x,r.L[2].y);g.lineTo(r.L[1].x,r.L[1].y);g.stroke();return r}
// 원기둥 앞 반쪽을 화면 타원 각도 θ(0 오른쪽 · π 왼쪽)로 나눠 칠한다: 돌 블록('stone') 또는 통널('stave')
function twCylR(g,x,y,z,r,h,col,m,s,o){o=o||{};const c=isoP(x,y,z),t=isoP(x,y,z+h),rx=r*KI*1.414,ry=rx/2,P=(th,zz)=>({x:c.x+Math.cos(th)*rx,y:c.y-zz+Math.sin(th)*ry});
  const lit=th=>.3*Math.cos(th-2.25)-.1,patch=(t0,t1,z0,z1,fill)=>{g.fillStyle=fill;g.beginPath();for(let i=0;i<=4;i++){const p=P(t0+(t1-t0)*i/4,z0);i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)}for(let i=4;i>=0;i--){const p=P(t0+(t1-t0)*i/4,z1);g.lineTo(p.x,p.y)}g.closePath();g.fill()};
  patch(0,Math.PI,0,h,Kit.lit(col,-.55));
  if(m==='stone'){const rh=o.rh||5.5;for(let z0=0,row=0;z0<h-.01;z0+=rh,row++){const z1=Math.min(h,z0+rh);let a=row%2?-.2:0;while(a<Math.PI){const bw=.34+s()*.2,a0=Math.max(0,a)+.03,a1=Math.min(Math.PI,a+bw)-.03;
      if(a1>a0){const m2=(a0+a1)/2;patch(a0,a1,z0+.45,z1-.45,Kit.lit(col,lit(m2)+(s()-.5)*.2));patch(a0,a1,z1-1.1,z1-.45,`rgba(255,244,220,${.12+.18*Math.max(0,Math.cos(m2-2.25))})`)}a+=bw}}}
  else{const n=o.n||9;for(let i=0;i<n;i++){const a0=i/n*Math.PI+.02,a1=(i+1)/n*Math.PI-.02,m2=(a0+a1)/2;patch(a0,a1,0,h,Kit.lit(col,lit(m2)+(s()-.5)*.16));
      patch(a0,a0+.05,0,h,'rgba(255,236,200,.12)');g.save();g.globalAlpha=.25;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'wood');patch(a0,a1,0,h,g.fillStyle);g.restore()}
    // 가운데 불룩한 빛
    const gr=g.createLinearGradient(0,t.y,0,c.y);gr.addColorStop(0,'rgba(0,0,0,.18)');gr.addColorStop(.5,'rgba(255,236,200,.1)');gr.addColorStop(1,'rgba(0,0,0,.25)');patch(0,Math.PI,0,h,gr)}
  // 바닥 차폐
  {const gr=g.createLinearGradient(0,c.y+ry,0,c.y+ry-Math.min(h,8));gr.addColorStop(0,'rgba(10,6,10,.5)');gr.addColorStop(1,'rgba(10,6,10,0)');patch(0,Math.PI,0,Math.min(h,8),gr)}
  if(o.moss){const ms=mulberry(7);for(let i=0;i<o.moss*14;i++){const a=ms()*Math.PI,p=P(a,Math.pow(ms(),1.8)*h*.5);g.fillStyle=`rgba(${60+ms()*36|0},${86+ms()*36|0},36,${.35+ms()*.3})`;g.beginPath();g.ellipse(p.x,p.y,1+ms()*2.4,.8+ms()*1.2,0,0,6.283);g.fill()}}
  for(const k of o.bands||[]){const zz=h*k;g.strokeStyle=o.bandC||'#2e2a28';g.lineWidth=o.bandW||1.8;g.beginPath();g.ellipse(c.x,c.y-zz,rx+.3,ry+.15,0,0,Math.PI);g.stroke();
    g.strokeStyle='rgba(230,226,220,.4)';g.lineWidth=.6;g.beginPath();g.ellipse(c.x,c.y-zz-.8,rx+.3,ry+.15,0,Math.PI*.45,Math.PI*.95);g.stroke()}
  g.fillStyle=o.top||Kit.lit(col,.15);g.beginPath();g.ellipse(t.x,t.y,rx,ry,0,0,6.283);g.fill();
  g.strokeStyle='rgba(255,240,214,.45)';g.lineWidth=.8;g.beginPath();g.ellipse(t.x,t.y,rx,ry,0,Math.PI*.9,Math.PI*1.65);g.stroke();
  return{c,t,rx,ry,P}}
// 바퀴: 축이 y인 x-z 평면의 원. 쇠테 · 바퀴살 · 바퀴통
function twWheel(g,x,y,z,R,col){const P=(a,rr)=>isoP(x+Math.cos(a)*rr,y,z+Math.sin(a)*rr),ring=rr=>{g.beginPath();for(let i=0;i<=28;i++){const p=P(i/28*6.283,rr);i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)}};
  g.lineCap='round';for(let i=0;i<8;i++){const a=i/8*6.283+.2,p=P(a,R*.15),q=P(a,R*.84);g.strokeStyle=Kit.lit(col,-.4);g.lineWidth=2.1;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke();g.strokeStyle=Kit.lit(col,.18);g.lineWidth=.7;g.beginPath();g.moveTo(p.x-.4,p.y-.5);g.lineTo(q.x-.4,q.y-.5);g.stroke()}
  ring(R*.9);g.strokeStyle=Kit.lit(col,-.15);g.lineWidth=3.2;g.stroke();ring(R*.9);g.strokeStyle='rgba(30,16,8,.5)';g.lineWidth=.5;g.stroke();
  ring(R*1.02);g.strokeStyle='#2a2624';g.lineWidth=1.6;g.stroke();
  g.strokeStyle='rgba(230,226,220,.5)';g.lineWidth=.6;g.beginPath();for(let i=0;i<=6;i++){const p=P(Math.PI/2+i/6*Math.PI/2,R*1.02);i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)}g.stroke();
  const hb=isoP(x,y,z);g.fillStyle='#3a2a1a';g.beginPath();g.ellipse(hb.x,hb.y,3.2,3.8,0,0,6.283);g.fill();g.fillStyle='#7a7a82';g.beginPath();g.arc(hb.x-.5,hb.y-.6,1.3,0,6.283);g.fill()}
// 둥근 막대(기둥 · 굴대): 그늘 → 본색 → 왼쪽 위 밝은 테
function twRod(g,a,b,w,col){g.lineCap='round';g.strokeStyle=Kit.lit(col,-.45);g.lineWidth=w+1;g.beginPath();g.moveTo(a.x+.5,a.y+.3);g.lineTo(b.x+.5,b.y+.3);g.stroke();g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();
  g.strokeStyle=Kit.lit(col,.3);g.lineWidth=Math.max(.6,w*.3);g.beginPath();g.moveTo(a.x-w*.25,a.y);g.lineTo(b.x-w*.25,b.y);g.stroke()}
// 천 주름: 어두운 골 + 옆 밝은 마루
const twFold=(g,a,b,c,col,w)=>{const p=[[a.x,a.y],[b.x,b.y,c.x,c.y]];mFold(g,p,col,w||1)};
// 잎 하나 (빛 쪽이 밝다)
function twLeaf(g,x,y,sz,a,col){const c=Math.cos(a),n=Math.sin(a);g.fillStyle=col;g.beginPath();g.moveTo(x-c*sz,y-n*sz);g.quadraticCurveTo(x-n*sz*.55,y+c*sz*.55,x+c*sz,y+n*sz);g.quadraticCurveTo(x+n*sz*.55,y-c*sz*.55,x-c*sz,y-n*sz);g.fill()}
// 잎 덩어리: 어두운 바탕 → 왼쪽 위로 갈수록 밝은 잎
function twBush(g,s,cx,cy,rx,ry,pal,n,sz){g.fillStyle=Kit.lit(pal[0],-.2);g.beginPath();g.ellipse(cx,cy,rx*.9,ry*.9,0,0,6.283);g.fill();
  const ds=[];for(let i=0;i<n;i++){const a=s()*6.283,q=Math.sqrt(s()),x=cx+Math.cos(a)*rx*q,y=cy+Math.sin(a)*ry*q;ds.push([x,y,.5-(x-cx)/rx*.35-(y-cy)/ry*.45+(s()-.5)*.3])}
  ds.sort((a,b)=>a[2]-b[2]);for(const [x,y,l] of ds){const k=Math.max(0,Math.min(.999,l)),i=Math.floor(k*(pal.length-1)),c=Kit.mix(pal[i],pal[i+1],k*(pal.length-1)-i);twLeaf(g,x,y,sz*(.7+s()*.6),-.6+s()*1.2+(s()<.5?Math.PI:0),c)}}
// 꽃 한 송이 (꽃잎 다섯 + 가운데)
function twFlower(g,x,y,r,col){for(let i=0;i<5;i++){const a=i/5*6.283;g.fillStyle=Kit.lit(col,i<2?.2:-.08);g.beginPath();g.ellipse(x+Math.cos(a)*r*.7,y+Math.sin(a)*r*.45,r*.55,r*.4,a,0,6.283);g.fill()}g.fillStyle='#f0d060';g.beginPath();g.arc(x,y,r*.32,0,6.283);g.fill()}

// 바깥 소품
twDef('well',90,100,45,78,(g,v)=>{const s=mulberry(11+v);Kit.shadow(g,10,4,40,12,.9);
  const c=twCylR(g,0,0,0,18,16,'#8a8274','stone',s,{rh:5.4,top:'#a0988a',moss:1});
  // 돌 테두리 윗면과 우물 구멍
  g.strokeStyle='rgba(40,36,32,.55)';g.lineWidth=.6;for(let i=0;i<12;i++){const a=i/12*6.283;g.beginPath();g.moveTo(c.t.x+Math.cos(a)*c.rx*.76,c.t.y+Math.sin(a)*c.ry*.76);g.lineTo(c.t.x+Math.cos(a)*c.rx,c.t.y+Math.sin(a)*c.ry);g.stroke()}
  g.save();g.beginPath();g.ellipse(c.t.x,c.t.y,c.rx*.76,c.ry*.76,0,0,6.283);g.clip();g.fillStyle='#14191c';g.fill();
  g.fillStyle='#4a463e';g.beginPath();g.ellipse(c.t.x,c.t.y-c.ry*.3,c.rx*.8,c.ry*.62,0,Math.PI,0);g.fill();
  const wg=g.createRadialGradient(c.t.x-3,c.t.y+3,0,c.t.x,c.t.y+3,c.rx*.6);wg.addColorStop(0,'#3a6a7a');wg.addColorStop(1,'#10242c');g.fillStyle=wg;g.beginPath();g.ellipse(c.t.x,c.t.y+3,c.rx*.62,c.ry*.46,0,0,6.283);g.fill();
  g.fillStyle='rgba(180,225,240,.45)';g.beginPath();g.ellipse(c.t.x-4,c.t.y+2,c.rx*.24,c.ry*.1,0,0,6.283);g.fill();g.restore();
  // 기둥과 굴대
  const wd='#5a3e26',p1a=isoP(-19,0,13),p1b=isoP(-19,0,52),p2a=isoP(19,0,13),p2b=isoP(19,0,52);twRod(g,p1a,p1b,3.4,wd);
  const ax0=isoP(-19,0,40),ax1=isoP(19,0,40);twRod(g,ax0,ax1,3,'#6a4a2e');
  g.strokeStyle='#b8a070';g.lineWidth=.8;for(let i=0;i<6;i++){const p=isoP(-4+i*1.6,0,40);g.beginPath();g.moveTo(p.x-1.5,p.y-1.8);g.lineTo(p.x+1.2,p.y+1.8);g.stroke()}
  // 두레박 줄과 두레박
  const rp=isoP(2,0,39);g.strokeStyle='#a89060';g.lineWidth=.8;g.beginPath();g.moveTo(rp.x,rp.y);g.lineTo(rp.x,rp.y+12);g.stroke();
  twCylR(g,2,0,20,3.6,5,'#7a5432','stave',s,{n:5,bands:[.25,.8],bandW:1,top:'#3a2a1a'});
  twRod(g,p2a,p2b,3.4,wd);
  const h0=isoP(19,0,40),h1=isoP(25,0,40),h2=isoP(25,0,33);g.strokeStyle='#2e2a28';g.lineWidth=1.6;g.lineCap='round';g.beginPath();g.moveTo(h0.x,h0.y);g.lineTo(h1.x,h1.y);g.lineTo(h2.x,h2.y);g.stroke();
  // 작은 박공지붕: 뒤 비탈 → 박공 → 앞 비탈 (널 지붕)
  const rc=['#7a3e28','#4c5c6a','#6a5a3a'][v%3];
  twFill(g,[isoP(-24,-14,47),isoP(24,-14,47),isoP(24,0,63),isoP(-24,0,63)],Kit.lit(rc,-.55));
  twFace(g,[24,14,47],[0,-1,0],[0,0,1],()=>{g.beginPath();g.moveTo(0,0);g.lineTo(28,0);g.lineTo(14,16);g.closePath();g.clip();twPlank(g,28,16,'#5a3e26',s,{lf:.62,vert:1,pw:3.5,ao:0})});
  twFace(g,[-24,14,47],[1,0,0],[0,-1,16/14],()=>{g.beginPath();g.rect(0,0,48,14);g.clip();g.fillStyle=Kit.lit(rc,-.2);g.fillRect(0,0,48,14);
    for(let r=0,v0=0;v0<14;v0+=3.5,r++)for(let u=r%2?-2.5:0;u<48;u+=5){const cc=Kit.lit(rc,(s()-.5)*.25+v0/14*.18);g.fillStyle=cc;g.fillRect(u+.3,v0,4.4,3.9);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(u,v0,.5,3.5);g.fillStyle='rgba(255,236,200,.2)';g.fillRect(u+.5,v0+3.2,4,.5)}
    g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,48,1.2);twMoss(g,48,4,s,.5)});
  twRod(g,isoP(-25,0,63.5),isoP(25,0,63.5),2.2,Kit.lit(rc,-.35))});
twDef('cart',110,80,55,58,(g,v)=>{const s=mulberry(21+v);Kit.shadow(g,10,4,46,12,.9);
  twWheel(g,-18,-16,10,10,'#4a3220');twWheel(g,18,-16,10,10,'#4a3220');
  for(const sy of [-8,8]){const a=isoP(28,sy,13),b=isoP(58,sy*.8,7);twRod(g,a,b,2.2,'#5a3a22')}
  twBoxR(g,0,0,10,56,30,12,'#7a5432','plank',s,{pw:4,nails:1,topC:'#4a3220'});
  for(const [x,y] of [[-27,14],[27,14],[27,-14]]){twRod(g,isoP(x,y,22),isoP(x,y,28),2,'#5a3a22')}
  twWheel(g,-18,16,10,10,'#5a3e24');twWheel(g,18,16,10,10,'#5a3e24');
  if(v!==1){for(let i=0;i<3;i++)twBoxR(g,-14+i*12,-4+i%2*6,22,10,10,8,'#c8a870','vplank',s,{pw:2.5,ao:0})}
  else{const b=twCylR(g,0,0,22,13,5,'#a07a48','stave',s,{n:12,top:'#6a4a2a'});for(let i=0;i<9;i++){const p={x:b.t.x-10+(i%5)*5+(i>4?2.5:0),y:b.t.y-(i>4?3:0)},cc=['#c84a3a','#e0b040','#7aa04a','#c06a2a'][i%4];
      const gr=g.createRadialGradient(p.x-1.4,p.y-1.6,0,p.x,p.y,4.4);gr.addColorStop(0,Kit.lit(cc,.45));gr.addColorStop(.5,cc);gr.addColorStop(1,Kit.lit(cc,-.5));g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,4.2,0,6.283);g.fill()}}});
twDef('wagon',150,120,75,92,(g,v)=>{const s=mulberry(31+v);Kit.shadow(g,16,6,66,18,.95);
  twWheel(g,-26,-20,12,12,'#3a2818');twWheel(g,26,-20,12,12,'#3a2818');
  for(const sy of [-9,9]){twRod(g,isoP(40,sy,15),isoP(74,sy*.7,8),2.4,'#4a3220')}
  twBoxR(g,0,0,12,80,38,12,'#6a4a2e','plank',s,{pw:4,nails:1});
  // 둥근 천막: 앞뒤로 띠를 이어 칠하고, 굽은 테가 천 밑으로 비친다
  const cc=['#e8dcc0','#d8c8a0','#c8b890'][v%3],arc=x=>{const pts=[];for(let k=0;k<=12;k++){const a=k/12*Math.PI;pts.push(isoP(x,-Math.cos(a)*20,24+Math.sin(a)*30))}return pts};
  const A=arc(-38),B=arc(38);
  for(let k=0;k<12;k++){const a=(k+.5)/12*Math.PI,l=.55*Math.sin(a)+.45*(-Math.cos(a)),gr=g.createLinearGradient(A[k].x,A[k].y,B[k].x,B[k].y);gr.addColorStop(0,Kit.lit(cc,l*.32-.04));gr.addColorStop(1,Kit.lit(cc,l*.32-.2));
    twFill(g,[A[k],A[k+1],B[k+1],B[k]],gr)}
  g.save();g.beginPath();A.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));for(let k=12;k>=0;k--)g.lineTo(B[k].x,B[k].y);g.closePath();g.clip();
  g.globalAlpha=.35;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'cloth');g.fillRect(-80,-120,160,120);g.restore();
  for(const x of [-26,-13,0,13,26]){const q=arc(x);mFold(g,q.slice(2,13).map(p=>[p.x,p.y]),cc,1.4)}
  for(let k=0;k<12;k++)if(k%3===1)mFold(g,[[A[k].x,A[k].y],[B[k].x,B[k].y]],cc,.8);
  // 뒤 끝: 어두운 안쪽 + 단
  g.fillStyle='#2a2018';g.globalAlpha=.8;twPoly(g,B);g.fill();g.globalAlpha=1;g.strokeStyle=Kit.lit(cc,-.25);g.lineWidth=1.6;g.beginPath();B.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke();
  g.strokeStyle='#8a7a5a';g.lineWidth=.7;for(let i=0;i<=8;i++){const p=isoP(-36+i*9,20,24),q=isoP(-36+i*9,20,16);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}
  twWheel(g,-26,20,12,12,'#5a3e24');twWheel(g,26,20,12,12,'#5a3e24')});
twDef('crate',50,50,25,38,(g,v)=>{const s=mulberry(41+v);Kit.shadow(g,6,2,18,6,.8);const c=['#8a6a40','#7a5a36','#9a7a4a'][v%3];
  const box=(x,y,z,w,d,h,c)=>{twBoxR(g,x,y,z,w,d,h,c,'plank',s,{pw:4,ao:3});const fr=Kit.lit(c,-.28);
    for(const [O,U,L,lf] of [[[x-w/2,y+d/2,z],[1,0,0],w,1],[[x+w/2,y+d/2,z],[0,-1,0],d,.62]])twFace(g,O,U,[0,0,1],()=>{g.fillStyle=Kit.lit(fr,(lf-1)*.6);g.fillRect(0,0,2.2,h);g.fillRect(L-2.2,0,2.2,h);g.fillRect(0,0,L,2);g.fillRect(0,h-2,L,2);
      g.strokeStyle=Kit.lit(fr,(lf-1)*.6);g.lineWidth=2;g.beginPath();g.moveTo(2,2);g.lineTo(L-2,h-2);g.stroke();g.strokeStyle='rgba(255,236,200,.22)';g.lineWidth=.5;g.beginPath();g.moveTo(1,h-1.2);g.lineTo(L-1,h-1.2);g.moveTo(2,3);g.lineTo(L-2.5,h-2);g.stroke();
      g.fillStyle='#2a2624';for(const [a,b] of [[1.1,1],[L-1.1,1],[1.1,h-1],[L-1.1,h-1]])g.fillRect(a-.5,b-.5,1,1)})};
  box(0,0,0,18,18,16,c);if(v===2)box(2,-2,16,12,12,11,'#a8844e')});
twDef('barrel',40,50,20,40,(g,v)=>{const s=mulberry(51+v);Kit.shadow(g,4,2,14,5,.8);const c=['#7a5230','#6a4628','#8a5e36'][v%3];
  const b=twCylR(g,0,0,0,9,20,c,'stave',s,{n:8,bands:[.14,.38,.66,.88],bandW:1.5,top:Kit.lit(c,.05)});
  g.save();g.beginPath();g.ellipse(b.t.x,b.t.y,b.rx,b.ry,0,0,6.283);g.clip();g.strokeStyle='rgba(30,16,8,.45)';g.lineWidth=.6;for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(b.t.x+i*3.4-4,b.t.y-6);g.lineTo(b.t.x+i*3.4+4,b.t.y+6);g.stroke()}g.restore();
  g.strokeStyle='#2e2a28';g.lineWidth=1.2;g.beginPath();g.ellipse(b.t.x,b.t.y,b.rx-.6,b.ry-.4,0,0,6.283);g.stroke()});
twDef('sacks',50,40,25,30,(g,v)=>{const s=mulberry(61+v);Kit.shadow(g,4,2,18,5,.8);
  for(const [x,y] of [[6,-2],[-5,4],[0,8]]){const c=isoP(x,y,0),col=Kit.lit('#c8b08a',(s()-.5)*.15);
    const bag=q=>{q.moveTo(c.x-7.5,c.y);q.bezierCurveTo(c.x-9.5,c.y-9,c.x-5,c.y-13,c.x-2.2,c.y-13.5);q.lineTo(c.x+2.2,c.y-13.5);q.bezierCurveTo(c.x+5,c.y-13,c.x+9.5,c.y-9,c.x+7.5,c.y);q.quadraticCurveTo(c.x,c.y+2.4,c.x-7.5,c.y);q.closePath()};
    Kit.solid(g,bag,c.x-9,c.y-14,c.x+9,c.y+2,col,{tex:'cloth',texA:.6,rim:'rgba(255,240,210,.6)'});mForm(g,bag,c.x-9,c.y-14,c.x+9,c.y+2,.9);
    mFold(g,[[c.x-2,c.y-12],[c.x-5,c.y-6,c.x-4,c.y-1]],col,.9);mFold(g,[[c.x+2,c.y-12],[c.x+4,c.y-7,c.x+2.5,c.y-2]],col,.8);
    // 묶은 목과 끈
    Kit.solid(g,q=>{q.moveTo(c.x-2.2,c.y-13.4);q.lineTo(c.x-3,c.y-17);q.quadraticCurveTo(c.x,c.y-19,c.x+3,c.y-17);q.lineTo(c.x+2.2,c.y-13.4);q.closePath()},c.x-3,c.y-19,c.x+3,c.y-13,Kit.lit(col,-.05),{tex:'cloth',texA:.5});
    g.strokeStyle='#6a4a2a';g.lineWidth=1.3;g.beginPath();g.moveTo(c.x-2.6,c.y-13.8);g.lineTo(c.x+2.6,c.y-13.4);g.stroke();
    g.strokeStyle='rgba(90,60,30,.4)';g.lineWidth=.5;g.setLineDash([1,1.2]);g.beginPath();g.moveTo(c.x-6.6,c.y-3);g.quadraticCurveTo(c.x,c.y-1,c.x+6.6,c.y-3);g.stroke();g.setLineDash([])}});
twDef('fence',80,46,40,30,(g,v)=>{// v=0: x방향, 1: y방향
  const s=mulberry(71+v),L=56,dir=v===1?[0,1]:[1,0],P0=t=>[dir[0]*(t-L/2),dir[1]*(t-L/2)],wc='#6a4a2e';
  for(const z of [7,14]){const [x0,y0]=P0(-2),[x1,y1]=P0(L+2),cx=(x0+x1)/2,cy=(y0+y1)/2;twBoxR(g,cx,cy,z,dir[0]?L+4:1.4,dir[1]?L+4:1.4,2.6,wc,'plank',s,{pw:2.6,ao:0,vert:0})}
  for(let t=0;t<=L;t+=14){const [x,y]=P0(t);twBoxR(g,x,y,0,2.8,2.8,17,'#5a4028','vplank',s,{pw:1.4,ao:4});const tp=isoP(x,y,17),tq=isoP(x,y,20.5);
    g.fillStyle=Kit.lit('#5a4028',.12);g.beginPath();g.moveTo(tp.x-2.1,tp.y);g.lineTo(tq.x,tq.y);g.lineTo(tp.x+2.1,tp.y);g.lineTo(tp.x,tp.y+1.4);g.closePath();g.fill();
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.moveTo(tq.x,tq.y);g.lineTo(tp.x+2.1,tp.y);g.lineTo(tp.x,tp.y+1.4);g.closePath();g.fill();
    if(s()<.5){const m=isoP(x,y,1+s()*3);g.fillStyle='rgba(70,100,40,.55)';g.beginPath();g.ellipse(m.x-1,m.y,2.4,1.2,0,0,6.283);g.fill()}}});
twDef('bench',60,40,30,28,(g,v)=>{const s=mulberry(81+v);Kit.shadow(g,4,2,22,6,.8);
  for(const x of [-13,13])twBoxR(g,x,-4,0,3,2,17,'#4a3220','vplank',s,{pw:3,ao:3});
  twBoxR(g,0,-4.6,11,34,1.6,6,'#7a5432','plank',s,{pw:3,ao:0});
  for(const x of [-13,13])twBoxR(g,x,1,0,3,8,8,'#4a3220','vplank',s,{pw:3,ao:3});
  twBoxR(g,0,0,8,34,10,3,'#7a5432','plank',s,{pw:3,nails:1,ao:0})});
twDef('signpost',60,90,30,76,(g,v)=>{const s=mulberry(91+v);Kit.shadow(g,4,2,12,4,.8);
  for(let i=0;i<4;i++){const a=i*1.7,p=isoP(Math.cos(a)*5,Math.sin(a)*5,0);Kit.solid(g,q=>q.ellipse(p.x,p.y-1.2,2.6,1.8,0,0,6.283),p.x-2.6,p.y-3,p.x+2.6,p.y+.6,'#7a7468',{tex:'stone',texA:.5})}
  twBoxR(g,0,0,0,4,4,64,'#5a4028','vplank',s,{pw:2,ao:6});const cp=isoP(0,0,64);Kit.solid(g,q=>{q.moveTo(cp.x-3.4,cp.y);q.lineTo(cp.x,cp.y-4);q.lineTo(cp.x+3.4,cp.y);q.lineTo(cp.x,cp.y+1.6);q.closePath()},cp.x-3.4,cp.y-4,cp.x+3.4,cp.y+1.6,'#4a3220');
  for(const [y,dx,c] of [[-58,1,'#8a6a40'],[-46,-1,'#7a5a36'],[-34,1,'#8a6a40']]){const pts=q=>{q.moveTo(0,y);q.lineTo(dx*20,y);q.lineTo(dx*26,y+4);q.lineTo(dx*20,y+8);q.lineTo(0,y+8);q.closePath()};
    Kit.solid(g,pts,dx>0?0:-26,y,dx>0?26:0,y+8,c,{tex:'wood',texA:.6,rim:'rgba(255,230,190,.55)'});
    g.fillStyle='rgba(30,16,6,.55)';for(let i=0;i<5;i++){const x=dx>0?4+i*3.2:-6-i*3.2;g.fillRect(x,y+3+(i%2)*.6,2,1.6+(i%3)*.4)}
    g.fillStyle='#2e2a28';g.fillRect(dx>0?1.2:-2.2,y+1.2,1,1);g.fillRect(dx>0?1.2:-2.2,y+5.8,1,1)}});
twDef('tent',120,100,60,78,(g,v)=>{const s=mulberry(101+v);Kit.shadow(g,10,4,52,14,.9);const c=['#a8443a','#3e6a8a','#c8a050'][v%3],ap=isoP(0,0,52),A=isoP(-30,30,0),B=isoP(30,30,0),C=isoP(30,-30,0);
  const fl=q=>{q.moveTo(A.x,A.y);q.lineTo(B.x,B.y);q.lineTo(ap.x,ap.y);q.closePath()},fr=q=>{q.moveTo(B.x,B.y);q.lineTo(C.x,C.y);q.lineTo(ap.x,ap.y);q.closePath()};
  {const gr=g.createLinearGradient(ap.x,ap.y,A.x,A.y);gr.addColorStop(0,Kit.lit(c,.25));gr.addColorStop(1,Kit.lit(c,-.12));g.fillStyle=gr;g.beginPath();fl(g);g.fill()}
  {const gr=g.createLinearGradient(B.x,B.y,C.x,C.y);gr.addColorStop(0,Kit.lit(c,-.42));gr.addColorStop(1,Kit.lit(c,-.58));g.fillStyle=gr;g.beginPath();fr(g);g.fill()}
  for(const f of [fl,fr]){g.save();g.beginPath();f(g);g.clip();g.globalAlpha=.45;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'cloth');g.fillRect(-60,-80,120,100);g.restore()}
  // 솔기와 주름: 꼭대기에서 아래로 처진 골
  for(let k=1;k<6;k++){const t=k/6,a={x:A.x+(B.x-A.x)*t,y:A.y+(B.y-A.y)*t},m={x:(ap.x+a.x)/2+(k%2?1.5:-1),y:(ap.y+a.y)/2+1.5};twFold(g,ap,m,a,c,k%2?1.1:.7)}
  for(let k=1;k<5;k++){const t=k/5,a={x:B.x+(C.x-B.x)*t,y:B.y+(C.y-B.y)*t};mFold(g,[[ap.x,ap.y],[a.x,a.y]],Kit.lit(c,-.45),.8)}
  // 가장자리 띠 (물결 단)
  const hem=(P1,P2,col)=>{for(let i=0;i<6;i++){const t0=i/6,t1=(i+1)/6,p={x:P1.x+(P2.x-P1.x)*t0,y:P1.y+(P2.y-P1.y)*t0},q={x:P1.x+(P2.x-P1.x)*t1,y:P1.y+(P2.y-P1.y)*t1};g.fillStyle=col;g.beginPath();g.moveTo(p.x,p.y-3);g.lineTo(q.x,q.y-3);g.quadraticCurveTo((p.x+q.x)/2,(p.y+q.y)/2+2.4,p.x,p.y-3);g.fill()}};
  hem(A,B,Kit.lit(c==='#c8a050'?'#8a2a22':'#e8dcc0',-.05));hem(B,C,Kit.lit(c==='#c8a050'?'#8a2a22':'#e8dcc0',-.45));
  // 출입구: 어두운 안 + 젖힌 자락
  const m=isoP(0,30,0);g.fillStyle='#1a120c';g.beginPath();g.moveTo(m.x-9,m.y-1);g.lineTo(m.x,m.y-27);g.lineTo(m.x+9,m.y+1);g.closePath();g.fill();
  Kit.solid(g,q=>{q.moveTo(m.x,m.y-27);q.lineTo(m.x-9,m.y-1);q.lineTo(m.x-14,m.y-2);q.quadraticCurveTo(m.x-8,m.y-14,m.x,m.y-27);q.closePath()},m.x-14,m.y-27,m.x,m.y,Kit.lit(c,.05),{tex:'cloth',texA:.5});
  g.strokeStyle='#a89870';g.lineWidth=.8;g.beginPath();g.moveTo(m.x-12,m.y-6);g.lineTo(m.x-9,m.y-7);g.stroke();
  twRod(g,{x:ap.x,y:ap.y+1},{x:ap.x,y:ap.y-10},2,'#4a3220');Kit.solid(g,q=>{q.moveTo(ap.x+1,ap.y-10);q.quadraticCurveTo(ap.x+6,ap.y-11,ap.x+10,ap.y-8);q.lineTo(ap.x+1,ap.y-5);q.closePath()},ap.x,ap.y-11,ap.x+10,ap.y-5,Kit.lit(c,.3),{lineW:.6})});
twDef('boat',140,70,70,46,(g,v)=>{const s=mulberry(111+v),c=['#6a4a2e','#5a4a3e','#7a5a3a'][v%3];
  const hull=(z,k)=>{const pts=[];for(let i=0;i<=16;i++){const a=i/16*Math.PI*2,x=Math.cos(a)*48*k,y=Math.sin(a)*14*k;pts.push(isoP(x,y,z))}return pts};
  g.fillStyle='rgba(10,30,40,.45)';twPoly(g,hull(-2,1.05));g.fill();
  const out=hull(8,1),inn=hull(9,.82),bot=hull(0,.75);
  g.fillStyle=Kit.lit(c,-.3);g.beginPath();bot.slice(0,9).forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));for(let i=8;i>=0;i--)g.lineTo(out[i].x,out[i].y);g.closePath();g.fill();
  // 뱃전 널 줄
  for(const f of [.33,.66]){const r=hull(8*f,.75+.25*f);g.strokeStyle='rgba(20,10,4,.5)';g.lineWidth=.7;g.beginPath();r.slice(0,9).forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke();g.strokeStyle='rgba(255,230,190,.14)';g.beginPath();r.slice(1,8).forEach((p,i)=>i?g.lineTo(p.x,p.y-.8):g.moveTo(p.x,p.y-.8));g.stroke()}
  g.fillStyle=Kit.lit(c,.05);twPoly(g,out);g.fill();g.fillStyle=Kit.lit(c,-.5);twPoly(g,inn);g.fill();
  g.save();twPoly(g,inn);g.clip();for(let i=-4;i<=4;i++){const a=isoP(i*9,-14,9),b=isoP(i*9,14,9);g.strokeStyle='rgba(255,230,190,.12)';g.lineWidth=1.6;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}
  g.fillStyle='rgba(60,90,100,.35)';twPoly(g,hull(2,.6));g.fill();g.restore();
  for(const x of [-18,12])twBoxR(g,x,0,4,4,22,4,Kit.lit(c,.2),'plank',s,{pw:2,ao:0});
  g.strokeStyle='rgba(255,230,190,.4)';g.lineWidth=1;g.beginPath();out.slice(5,13).forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke();
  if(v===2){const a=isoP(-4,0,6),b=isoP(-4,0,58);twRod(g,a,b,2,'#4a3220');const sail=[isoP(-4,0,56),isoP(30,0,16),isoP(-4,0,16)];
    const gr=g.createLinearGradient(sail[0].x,sail[0].y,sail[1].x,sail[1].y);gr.addColorStop(0,'#f0e6cc');gr.addColorStop(1,'#c8b890');g.fillStyle=gr;twPoly(g,sail);g.fill();
    for(let k=1;k<4;k++){const p={x:sail[0].x+(sail[2].x-sail[0].x)*k/4,y:sail[0].y+(sail[2].y-sail[0].y)*k/4},q={x:sail[1].x+(sail[2].x-sail[1].x)*k/4,y:sail[1].y+(sail[2].y-sail[1].y)*k/4};mFold(g,[[p.x,p.y],[q.x,q.y]],'#d8c8a0',.7)}}
  else{twRod(g,isoP(30,6,10),isoP(56,22,2),1.6,'#5a4028');const e=isoP(56,22,2);g.fillStyle='#5a4028';g.beginPath();g.ellipse(e.x,e.y,4,1.6,.5,0,6.283);g.fill()}});
twDef('nets',90,80,45,60,(g,v)=>{const s=mulberry(121+v);Kit.shadow(g,6,2,30,8,.8);
  twRod(g,isoP(-24,0,0),isoP(-24,0,41),3,'#4a3220');
  const a=isoP(-26,0,38),b=isoP(26,0,38);twRod(g,a,b,2,'#5a4028');
  // 그물: 처진 가로줄 + 엇갈린 세로줄 + 매듭
  g.strokeStyle='rgba(200,190,160,.8)';g.lineWidth=.55;const N=(i,z)=>{const p=isoP(-24+i*4.8,0,z);return{x:p.x+Math.sin(i*1.7+z)*.6,y:p.y+Math.sin(i/10*Math.PI)*(38-z)*.12}};
  for(let z=36;z>8;z-=4.2){g.beginPath();for(let i=0;i<=10;i++){const p=N(i,z);i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)}g.stroke()}
  for(let i=0;i<=10;i++){g.beginPath();for(let z=38,k=0;z>8;z-=4.2,k++){const p=N(i+(k%2?.5:0),z);k?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)}g.stroke()}
  g.fillStyle='rgba(120,110,90,.8)';for(let z=36;z>8;z-=4.2)for(let i=0;i<=10;i+=2){const p=N(i,z);g.fillRect(p.x-.5,p.y-.5,1,1)}
  // 코르크 찌와 걸린 물고기
  for(let i=0;i<4;i++){const p=N(1+i*2.7,12);const gr=g.createRadialGradient(p.x-1,p.y-1,0,p.x,p.y,2.8);gr.addColorStop(0,'#f0a060');gr.addColorStop(1,'#a0401a');g.fillStyle=gr;g.beginPath();g.ellipse(p.x,p.y+1,2.6,2,0,0,6.283);g.fill()}
  for(let i=0;i<3;i++){const p=isoP(-10+i*12,0,30),fc=Kit.lit('#b0b8c0',(s()-.5)*.2);Kit.solid(g,q=>{q.moveTo(p.x,p.y);q.quadraticCurveTo(p.x+2.4,p.y+4,p.x,p.y+9);q.quadraticCurveTo(p.x-2.4,p.y+4,p.x,p.y);q.closePath()},p.x-2.4,p.y,p.x+2.4,p.y+9,fc,{rim:'rgba(255,255,255,.8)',lineW:.5});
    g.fillStyle=fc;g.beginPath();g.moveTo(p.x,p.y+8);g.lineTo(p.x-2,p.y+11);g.lineTo(p.x+2,p.y+11);g.closePath();g.fill()}
  twRod(g,isoP(24,0,0),isoP(24,0,41),3,'#4a3220')});
twDef('banner',40,120,20,104,(g,v)=>{const s=mulberry(131+v);Kit.shadow(g,3,2,8,3,.8);const c=['#8a2a3a','#24325c','#3e5a2e'][v%3];
  for(let i=0;i<3;i++){const a=i*2.1,p=isoP(Math.cos(a)*3,Math.sin(a)*3,0);Kit.solid(g,q=>q.ellipse(p.x,p.y-1,2.4,1.6,0,0,6.283),p.x-2.4,p.y-2.6,p.x+2.4,p.y+.6,'#7a7468')}
  twRod(g,{x:0,y:0},{x:0,y:-96},3,'#3a3430');Kit.solid(g,q=>{q.moveTo(0,-104);q.lineTo(2.6,-98);q.lineTo(0,-95);q.lineTo(-2.6,-98);q.closePath()},-2.6,-104,2.6,-95,'#d8b860',{rim:'rgba(255,250,210,.9)',lineW:.6});
  twRod(g,{x:-1,y:-90},{x:17,y:-88.5},1.6,'#3a3430');
  const cl=q=>{q.moveTo(1,-90);q.lineTo(16,-88);q.quadraticCurveTo(17,-70,16,-52);q.lineTo(8.5,-58);q.lineTo(1,-52);q.quadraticCurveTo(2,-70,1,-90);q.closePath()};
  Kit.solid(g,cl,1,-90,16,-52,c,{tex:'cloth',texA:.55,rim:'rgba(255,230,190,.6)'});mForm(g,cl,1,-90,17,-52,1);
  mFold(g,[[5,-88],[6,-72,4.5,-56]],c,1.1);mFold(g,[[12,-88],[13.5,-72,12,-56]],c,.9);
  g.strokeStyle='#d8b860';g.lineWidth=.9;g.beginPath();g.moveTo(1.6,-87);g.lineTo(15.4,-85.4);g.moveTo(1.8,-55);g.lineTo(8.5,-61);g.lineTo(15.4,-55);g.stroke();
  // 수놓은 무늬: 둥근 테 + 별
  g.strokeStyle='#e8c870';g.lineWidth=1.1;g.beginPath();g.arc(8.5,-74,4.2,0,6.283);g.stroke();g.fillStyle='#e8c870';g.beginPath();for(let i=0;i<10;i++){const a=i/10*6.283-1.57,r=i%2?1.2:2.8;i?g.lineTo(8.5+Math.cos(a)*r,-74+Math.sin(a)*r):g.moveTo(8.5+Math.cos(a)*r,-74+Math.sin(a)*r)}g.closePath();g.fill()});
twDef('campfire',60,40,30,26,(g,v)=>{const s=mulberry(141+v);Kit.shadow(g,2,2,20,6,.7);
  {const gr=g.createRadialGradient(0,-1,0,0,-1,12);gr.addColorStop(0,'#2a2420');gr.addColorStop(1,'rgba(60,54,48,.6)');g.fillStyle=gr;g.beginPath();g.ellipse(0,-1,12,6,0,0,6.283);g.fill()}
  const st=[];for(let i=0;i<9;i++){const a=i/9*6.283,c=isoP(Math.cos(a)*12,Math.sin(a)*12,0);st.push([c,i])}st.sort((a,b)=>a[0].y-b[0].y);
  const logs=()=>{for(const a of [.4,2.3,4.2]){const p=isoP(Math.cos(a)*10,Math.sin(a)*10,1),q=isoP(-Math.cos(a)*2,-Math.sin(a)*2,7);twRod(g,p,q,3.2,'#4a3020');g.fillStyle='#ff8a3a';g.beginPath();g.arc(q.x,q.y,1.4,0,6.283);g.fill();g.fillStyle='#e8d0a8';g.beginPath();g.ellipse(p.x,p.y,1.6,1.4,0,0,6.283);g.fill()}
    for(let i=0;i<6;i++){g.fillStyle=i%2?'#ffb050':'#d84a1a';g.fillRect(-5+s()*10,-3+s()*4,1.2,1.2)}};
  let lg=0;for(const [c,i] of st){if(!lg&&c.y>-1){logs();lg=1}const col=Kit.lit('#7a7468',(s()-.5)*.25);Kit.solid(g,q=>q.ellipse(c.x,c.y-2,4.2,2.8,0,0,6.283),c.x-4.2,c.y-4.8,c.x+4.2,c.y+.8,col,{tex:'stone',texA:.5,lineW:.6})}if(!lg)logs()});
twDef('statue2',90,170,45,150,(g,v)=>{const s=mulberry(151+v);Kit.shadow(g,8,4,36,12,.9);
  twBoxR(g,0,0,0,36,36,22,'#b8b2a4','stone',s,{rh:5.5,bw:[8,14],moss:1.2});twBoxR(g,0,0,22,26,26,8,'#c8c2b4','stone',s,{rh:8,bw:[13,13],ao:3});
  // 기사상: 망토와 검 (풍화된 대리석)
  const m='#d8d2c6',cape=q=>{q.moveTo(-10,-30);q.lineTo(10,-30);q.lineTo(12,-82);q.quadraticCurveTo(0,-90,-12,-82);q.closePath()};
  Kit.solid(g,cape,-12,-90,12,-30,m,{tex:'stone',texA:.35,rim:'rgba(255,255,255,.9)'});mForm(g,cape,-12,-90,12,-30,1);
  mFold(g,[[-6,-80],[-7,-56,-5,-31]],m,1.2);mFold(g,[[2,-84],[3,-60,1,-31]],m,1);mFold(g,[[8,-80],[10,-56,8,-31]],m,.9);
  const hd=q=>q.arc(0,-96,7,0,6.283);Kit.solid(g,hd,-7,-103,7,-89,m,{rim:'rgba(255,255,255,.9)'});mForm(g,hd,-7,-103,7,-89,1);
  Kit.solid(g,q=>{q.moveTo(-6,-100);q.lineTo(6,-100);q.lineTo(5,-108);q.lineTo(-5,-108);q.closePath()},-6,-108,6,-100,'#c8c2b4');
  g.fillStyle='rgba(60,56,50,.55)';g.fillRect(-4,-98,8,1.4);
  Kit.solid(g,q=>q.rect(12,-118,3,72),12,-118,15,-46,'#b8b2a4',{lineW:.6});Kit.solid(g,q=>q.rect(6,-62,15,3),6,-62,21,-59,'#a8a294',{lineW:.6});
  const sh=q=>{q.moveTo(-16,-80);q.lineTo(-6,-80);q.lineTo(-6,-56);q.quadraticCurveTo(-11,-48,-16,-56);q.closePath()};Kit.solid(g,sh,-16,-80,-6,-48,'#c8c2b4',{tex:'stone',texA:.4});
  g.strokeStyle='rgba(90,84,70,.5)';g.lineWidth=.8;g.beginPath();g.moveTo(-11,-78);g.lineTo(-11,-52);g.moveTo(-15,-68);g.lineTo(-7,-68);g.stroke();
  // 빗물 자국과 이끼
  g.strokeStyle='rgba(80,90,70,.25)';g.lineWidth=1.2;for(let i=0;i<5;i++){const x=-9+i*4.4;g.beginPath();g.moveTo(x,-84+i%2*6);g.lineTo(x+.6,-50+i*3);g.stroke()}
  for(let i=0;i<10;i++){g.fillStyle=`rgba(${70+s()*30|0},${100+s()*30|0},44,${.4+s()*.3})`;g.beginPath();g.ellipse(-10+s()*20,-32-s()*8,1.4+s()*2,1+s(),0,0,6.283);g.fill()}});
twDef('planter',60,90,30,72,(g,v)=>{const s=mulberry(161+v);Kit.shadow(g,6,2,20,6,.8);
  twBoxR(g,0,0,0,22,22,10,'#d8d2c6','stone',s,{rh:5,bw:[11,11],moss:.8});const t=isoP(0,0,10);g.fillStyle='#3a2a1a';g.beginPath();g.ellipse(t.x,t.y,13,6,0,0,6.283);g.fill();
  twRod(g,{x:t.x,y:t.y},{x:t.x,y:t.y-30},3,'#5a3a22');twRod(g,{x:t.x,y:t.y-20},{x:t.x+7,y:t.y-30},1.4,'#5a3a22');
  twBush(g,s,0,-48,15,13,[['#2a4a1e','#3e6a2e','#5a8a3a','#a8c870'],['#2e4a20','#4a7a36','#6a9a42','#b8d080'],['#3a4a1a','#5a6a2a','#7a8a3a','#c8c870']][v%3],70,3.4);
  if(v===1)for(let i=0;i<6;i++){const gr=g.createRadialGradient(0,0,0,0,0,2.4);g.fillStyle='#e8a030';const x=-9+s()*18,y=-56+s()*14;g.beginPath();g.arc(x,y,1.8,0,6.283);g.fill();g.fillStyle='rgba(255,240,180,.8)';g.fillRect(x-1,y-1,.8,.8);void gr}});
twDef('cwall',260,150,130,104,(g,v)=>{// 성벽 한 칸 (x방향 길이 140), v=1이면 y방향
  const s=mulberry(171+v),len=140,iy=v===1;const B=(x,y,z,w,d,h,c,o)=>iy?twBoxR(g,y,x,z,d,w,h,c,'stone',s,o):twBoxR(g,x,y,z,w,d,h,c,'stone',s,o);
  Kit.shadow(g,iy?-20:30,10,90,20,.9);B(0,0,0,len,22,58,'#ddd8cc',{rh:8,bw:[14,22],moss:1.4,mossH:14,ao:14});
  for(let i=0;i<8;i++)B(-len/2+9+i*17.5,0,58,10,22,8,'#e6e1d6',{rh:8,bw:[10,10],ao:0});
  // 물 흘러내린 얼룩
  const fx=iy?[11,len/2,0]:[-len/2,11,0],fu=iy?[0,-1,0]:[1,0,0];twFace(g,fx,fu,[0,0,1],()=>{for(let i=0;i<9;i++){const u=8+s()*(len-16),gr=g.createLinearGradient(0,58,0,30);gr.addColorStop(0,'rgba(60,64,50,.3)');gr.addColorStop(1,'rgba(60,64,50,0)');g.fillStyle=gr;g.fillRect(u,30,1.6+s()*2,28)}})});
twDef('gatetower',120,190,60,150,(g,v)=>{const s=mulberry(181+v);Kit.shadow(g,16,6,46,16,.9);
  twBoxR(g,0,0,0,36,36,96,'#e0dbcf','stone',s,{rh:8,bw:[12,18],moss:1.2,mossH:16,ao:16});
  twBoxR(g,0,0,92,40,40,4,'#d0cabe','stone',s,{rh:4,bw:[10,10],ao:0,noTop:1});
  for(let i=0;i<4;i++)for(const [x,y] of [[-15+i*10,18],[18,15-i*10]])twBoxR(g,x,y,96,6,6,7,'#e6e1d6','stone',s,{rh:7,bw:[6,6],ao:0});
  const w=isoP(0,18,60);for(const [ww,hh,c] of [[4.2,11,'#7a7468'],[3,9,'#1a1828']]){g.fillStyle=c;g.beginPath();g.moveTo(w.x-ww,w.y+hh);g.lineTo(w.x-ww,w.y);g.arc(w.x,w.y,ww,Math.PI,0);g.lineTo(w.x+ww,w.y+hh);g.closePath();g.fill()}
  g.fillStyle='rgba(255,200,120,.35)';g.fillRect(w.x-1,w.y+2,2,5);
  const t=isoP(0,0,103);twRod(g,{x:t.x,y:t.y},{x:t.x,y:t.y-28},1.6,'#3a3430');
  const fl=q=>{q.moveTo(t.x,t.y-27);q.quadraticCurveTo(t.x+9,t.y-29,t.x+18,t.y-23);q.quadraticCurveTo(t.x+9,t.y-21,t.x,t.y-17);q.closePath()};Kit.solid(g,fl,t.x,t.y-29,t.x+18,t.y-17,'#24325c',{tex:'cloth',texA:.5});
  mFold(g,[[t.x+6,t.y-27],[t.x+7,t.y-23,t.x+6,t.y-19]],'#24325c',.8)});
twDef('trough',60,40,30,28,(g,v)=>{const s=mulberry(191+v);Kit.shadow(g,4,2,22,6,.8);twBoxR(g,0,0,0,36,12,9,'#6a4a2e','plank',s,{pw:3,nails:1,topC:'#4a3220'});
  const t=[isoP(-16,4,8.4),isoP(16,4,8.4),isoP(16,-4,8.4),isoP(-16,-4,8.4)],gr=g.createLinearGradient(t[3].x,t[3].y,t[1].x,t[1].y);gr.addColorStop(0,'#4a7a8a');gr.addColorStop(1,'#1e3a48');g.fillStyle=gr;twPoly(g,t);g.fill();
  g.strokeStyle='rgba(200,235,250,.5)';g.lineWidth=.6;const m=isoP(-6,0,8.4);g.beginPath();g.moveTo(m.x-6,m.y+1);g.lineTo(m.x+4,m.y+.2);g.stroke();
  for(const x of [-12,12]){twFace(g,[x-1,6,0],[1,0,0],[0,0,1],()=>{g.fillStyle='#2e2a28';g.fillRect(0,0,2,9);g.fillStyle='rgba(220,220,230,.35)';g.fillRect(0,0,.6,9)})}});
twDef('anvil',70,70,35,52,(g,v)=>{const s=mulberry(201+v);Kit.shadow(g,6,2,26,8,.85);
  twBoxR(g,18,6,0,24,22,18,'#6a6058','stone',s,{rh:5,bw:[7,10],ao:5});const f=isoP(18,17,9);g.fillStyle='#1a0e08';g.fillRect(f.x-6,f.y-7,12,8);
  {const gr=g.createRadialGradient(f.x,f.y-2,0,f.x,f.y-2,7);gr.addColorStop(0,'#ffd080');gr.addColorStop(.5,'#ff7a2a');gr.addColorStop(1,'#5a1a08');g.fillStyle=gr;g.fillRect(f.x-5,f.y-5,10,5)}
  const tp=isoP(18,6,18);g.fillStyle='#2a2420';g.beginPath();g.ellipse(tp.x,tp.y,9,4.2,0,0,6.283);g.fill();for(let i=0;i<8;i++){g.fillStyle=i%2?'#ff9a40':'#c83a10';g.beginPath();g.arc(tp.x-6+s()*12,tp.y-2+s()*3,1,0,6.283);g.fill()}
  const b=twCylR(g,-6,0,0,7,10,'#5a3a22','stave',s,{n:6,top:'#8a6a44'});g.strokeStyle='rgba(60,36,18,.6)';g.lineWidth=.5;for(const r of [.3,.6,.85]){g.beginPath();g.ellipse(b.t.x,b.t.y,b.rx*r,b.ry*r,0,0,6.283);g.stroke()}
  // 모루: 받침 → 허리 → 몸통 + 뿔
  const a=isoP(-6,0,10),M='#4a4a52';Kit.solid(g,q=>{q.moveTo(a.x-6,a.y);q.lineTo(a.x+6,a.y);q.lineTo(a.x+3,a.y-5);q.lineTo(a.x-3,a.y-5);q.closePath()},a.x-6,a.y-5,a.x+6,a.y,M,{tex:'metal',texA:.5,lineW:.6});
  const body=q=>{q.moveTo(a.x-9,a.y-5);q.lineTo(a.x+8,a.y-5);q.lineTo(a.x+9,a.y-10);q.lineTo(a.x-9,a.y-10);q.quadraticCurveTo(a.x-14,a.y-10,a.x-18,a.y-8.6);q.quadraticCurveTo(a.x-13,a.y-7,a.x-9,a.y-5);q.closePath()};
  Kit.solid(g,body,a.x-18,a.y-10,a.x+9,a.y-5,M,{tex:'metal',texA:.6,rim:'rgba(220,226,240,.9)'});g.fillStyle='rgba(230,236,250,.55)';g.fillRect(a.x-9,a.y-10.4,17,1);
  // 망치
  twRod(g,{x:a.x+2,y:a.y-11},{x:a.x+9,y:a.y-16},1.4,'#6a4a2a');g.fillStyle='#3a3a42';g.fillRect(a.x+7,a.y-19,5,3.4)});
twDef('herb',40,40,20,30,(g,v)=>{const s=mulberry(211+v);
  for(let i=0;i<11;i++){const a=i/11*6.283+s()*.3,x=Math.cos(a)*6,y=Math.sin(a)*3,l=9+s()*5;g.strokeStyle='#3e6a2a';g.lineWidth=.8;g.beginPath();g.moveTo(0,-1);g.quadraticCurveTo(x*.6,y-l*.5,x*1.3,y-l);g.stroke();
    twLeaf(g,x*1.1,y-l*.7,3.2,a+1.2,Kit.lit('#4e8a3a',.25*Math.cos(a-3.6)+(s()-.5)*.15))}
  for(let i=0;i<5;i++)twFlower(g,-6+i*3.2,-13-(i%2)*3-s()*2,2.2,['#f4f0e4','#e8f0ff','#d8c8f8'][(i+v)%3])});
twDef('drift',50,30,25,20,(g,v)=>{const s=mulberry(221+v);Kit.shadow(g,2,2,16,4,.7);
  const lg=q=>{q.moveTo(-15,-1);q.quadraticCurveTo(-4,-9,14,-6.5);q.lineTo(15,-2);q.quadraticCurveTo(-2,-3,-14,2.4);q.closePath()};Kit.solid(g,lg,-15,-9,15,2.4,'#a09078',{tex:'wood',texA:.7,rim:'rgba(255,250,235,.7)'});
  g.strokeStyle='rgba(70,60,46,.5)';g.lineWidth=.5;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-12,-1-i*.9+.4);g.quadraticCurveTo(0,-6.4-i*.6,13,-5.6+i*.9);g.stroke()}
  twRod(g,{x:-2,y:-5},{x:-6,y:-12},1.6,'#9a8a72');g.fillStyle='#d8ccb4';g.beginPath();g.ellipse(14.6,-4.2,1.1,2.2,0,0,6.283);g.fill();void s});
twDef('kegs',70,60,35,44,(g,v)=>{const s=mulberry(231+v);Kit.shadow(g,6,2,26,7,.85);
  for(const [x,y] of [[0,-6],[-8,6],[8,6]]){const b=twCylR(g,x,y,0,7,15,Kit.lit('#7a5230',(s()-.5)*.15),'stave',s,{n:7,bands:[.16,.84],bandW:1.3,top:'#8a6a42'});g.strokeStyle='#2e2a28';g.lineWidth=.9;g.beginPath();g.ellipse(b.t.x,b.t.y,b.rx-.6,b.ry-.4,0,0,6.283);g.stroke()}
  const b=twCylR(g,0,4,15,7,14,'#8a5e36','stave',s,{n:7,bands:[.16,.84],bandW:1.3,top:'#9a7448'});g.strokeStyle='#2e2a28';g.lineWidth=.9;g.beginPath();g.ellipse(b.t.x,b.t.y,b.rx-.6,b.ry-.4,0,0,6.283);g.stroke();
  g.fillStyle='#3a2a1a';g.beginPath();g.arc(b.t.x+1,b.t.y,1.2,0,6.283);g.fill()});
twDef('flowerbed',70,30,35,18,(g,v)=>{const s=mulberry(241+v);twBoxR(g,0,0,0,40,14,4,'#6a5a48','stone',s,{rh:4,bw:[6,9],ao:0,topC:'#3a2a1a'});
  const t=[isoP(-18,5,4),isoP(18,5,4),isoP(18,-5,4),isoP(-18,-5,4)];g.fillStyle='#3a281a';twPoly(g,t);g.fill();
  for(let i=0;i<22;i++){const c=isoP(-17+s()*34,-4+s()*8,5);twLeaf(g,c.x,c.y-2,2.4,s()*3,Kit.lit('#3e6a2a',(s()-.4)*.3))}
  const pts=[];for(let i=0;i<16;i++)pts.push(isoP(-17+i*2.3,(i%3-1)*3,5));pts.sort((a,b)=>a.y-b.y);
  pts.forEach((c,i)=>{g.strokeStyle='#3e6a2a';g.lineWidth=.8;g.beginPath();g.moveTo(c.x,c.y);g.lineTo(c.x,c.y-4);g.stroke();twFlower(g,c.x,c.y-5,2,['#e07a96','#f0d870','#f4f0e4','#b0a0f0'][(i+v)%4])})});
twDef('pier',150,80,75,40,(g,v)=>{// 물 위 말뚝 + 기둥 등불
  const s=mulberry(251+v);for(const [x,y] of [[-40,-12],[0,-12],[40,-12],[-40,12],[0,12],[40,12]]){const b=twCylR(g,x,y,-14,2.6,18,'#3a2a1a','stave',s,{n:3,top:'#5a4630'});
    const w=isoP(x,y,-14);g.fillStyle='rgba(30,60,60,.45)';g.fillRect(w.x-3,w.y-8,6,8);g.strokeStyle='rgba(170,215,230,.45)';g.lineWidth=.8;g.beginPath();g.ellipse(w.x,w.y-.5,4,1.4,0,0,6.283);g.stroke();
    g.strokeStyle='#a89060';g.lineWidth=.8;for(let k=0;k<3;k++){g.beginPath();g.moveTo(b.t.x-3,b.t.y+5+k*1.4);g.lineTo(b.t.x+3,b.t.y+6+k*1.4);g.stroke()}}});
// 사람 크기 동물
twDef('sheep',44,36,22,28,(g,v)=>{Kit.shadow(g,3,1,13,4,.8);g.fillStyle='#2a2420';for(const x of [-6,-2,4,8])g.fillRect(x,-6,1.6,6);
  for(let i=0;i<7;i++){g.fillStyle=Kit.lit('#e8e2d2',(i%3-1)*.1-.05);g.beginPath();g.arc(-6+i*2.4,-10-(i%2)*2,5,0,6.283);g.fill()}g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.arc(-4,-13,3,0,6.283);g.fill();
  g.fillStyle='#3a3430';g.beginPath();g.ellipse(-12,-11,3.4,4,.3,0,6.283);g.fill();g.fillStyle='#fff';g.fillRect(-13.5,-12,1,1)});
twDef('cat',30,26,15,20,(g,v)=>{Kit.shadow(g,1,1,8,3,.8);const c=['#d88a3a','#4a4440','#e8e2d2'][v%3];g.fillStyle=c;g.beginPath();g.ellipse(0,-5,6,4,0,0,6.283);g.fill();g.beginPath();g.arc(-6,-9,3.6,0,6.283);g.fill();
  g.beginPath();g.moveTo(-9,-11);g.lineTo(-8,-15);g.lineTo(-6.5,-12);g.moveTo(-5.5,-12);g.lineTo(-4,-15);g.lineTo(-3,-11);g.fill();g.strokeStyle=c;g.lineWidth=1.8;g.beginPath();g.moveTo(5,-5);g.quadraticCurveTo(10,-8,8,-14);g.stroke();
  g.fillStyle='#d8f060';g.fillRect(-7.6,-10,1,1);g.fillRect(-5.4,-10,1,1)});
// 실내 가구
twDef('table',80,60,40,40,(g,v)=>{Kit.shadow(g,4,2,30,9,.75);for(const [x,y] of [[-18,-10],[18,-10],[-18,10],[18,10]])twBox(g,x,y,0,3,3,14,'#4a3220');twBox(g,0,0,14,44,28,3,'#7a5432',{tex:'wood',texA:.6});
  const t=isoP(-6,2,17);g.fillStyle='#d8d0c0';g.beginPath();g.ellipse(t.x,t.y,5,2.4,0,0,6.283);g.fill();if(v!==1){const c=isoP(8,-4,17);twCyl(g,8,-4,17,2.6,6,'#a87a4a')}else{g.fillStyle='#c89a5a';g.beginPath();g.ellipse(t.x+12,t.y-2,6,3.4,0,0,6.283);g.fill()}void t});
twDef('stool',30,30,15,22,(g,v)=>{Kit.shadow(g,2,1,8,3,.7);twCyl(g,0,0,6,6,3,'#7a5432');g.fillStyle='#4a3220';g.fillRect(-4,-6,1.6,6);g.fillRect(3,-6,1.6,6)});
twDef('bed',90,70,45,48,(g,v)=>{Kit.shadow(g,6,2,32,10,.75);twBox(g,0,0,0,52,28,10,'#6a4628',{tex:'wood',texA:.5});const c=['#7a2a2a','#2e4a6a','#4a6a3a'][v%3];twBox(g,4,0,10,42,26,4,c,{tex:'cloth',texA:.6});twBox(g,-20,0,10,10,22,5,'#e8e2d2',{tex:'cloth',texA:.3});twBox(g,-27,0,0,4,30,22,'#5a3a22',{tex:'wood',texA:.5})});
twDef('shelf',70,90,35,72,(g,v)=>{Kit.shadow(g,4,2,22,6,.7);twBox(g,0,0,0,40,12,54,'#5a3a22',{tex:'wood',texA:.6});
  g.save();faceT(g,[-20,6,0],[1,0,0],[0,0,1]);for(const z of [8,22,36]){g.fillStyle='#2a1a10';g.fillRect(2,z,36,12);for(let u=3;u<36;u+=4.2){g.fillStyle=v===1?['#8a2a2a','#2a4a6a','#4a6a3a','#8a6a2a','#5a3a6a'][(u*7+z)%5|0]:['#c8a870','#a87a4a','#d8d0c0','#7a5a3a'][(u*3+z)%4|0];g.fillRect(u,z,v===1?3:3.6,v===1?10:6+((u+z)%3))}}g.restore()});
twDef('hearth',100,130,50,100,(g,v)=>{Kit.shadow(g,6,2,30,8,.7);twBox(g,0,0,0,44,16,60,'#7a7064',{tex:'stone',texA:.6});twBox(g,0,0,60,30,12,30,'#6a6058',{tex:'stone',texA:.6});
  g.save();faceT(g,[-22,8,0],[1,0,0],[0,0,1]);g.fillStyle='#120a06';g.beginPath();g.moveTo(10,0);g.lineTo(34,0);g.lineTo(34,20);g.quadraticCurveTo(22,30,10,20);g.closePath();g.fill();g.fillStyle='#5a3a22';g.fillRect(-2,32,48,4);g.restore()});
twDef('counter',140,80,70,52,(g,v)=>{Kit.shadow(g,10,4,50,12,.8);twBox(g,0,0,0,90,18,20,'#6a4628',{tex:'wood',texA:.6});twBox(g,0,0,20,94,22,3,'#8a6038',{tex:'wood',texA:.5});
  for(let i=0;i<3;i++){twCyl(g,-30+i*14,-2,23,2.6,6,'#c89a5a')}twCyl(g,28,-2,23,6,12,'#7a5230',{bands:[.2,.8]})});
twDef('pew',90,50,45,34,(g,v)=>{Kit.shadow(g,4,2,32,8,.7);twBox(g,0,0,7,52,10,3,'#6a4628',{tex:'wood',texA:.5});twBox(g,0,-5,7,52,3,14,'#5a3a22',{tex:'wood',texA:.5});for(const x of [-24,24])twBox(g,x,0,0,3,10,8,'#4a3220')});
twDef('altar',90,110,45,80,(g,v)=>{Kit.shadow(g,4,2,30,8,.7);twBox(g,0,0,0,40,18,22,'#e8e2d6',{tex:'stone',texA:.4});twBox(g,0,0,22,44,20,2,'#d8b860');
  const c=isoP(0,0,24);g.fillStyle='#d8b860';g.fillRect(c.x-1.2,c.y-30,2.4,30);g.fillRect(c.x-8,c.y-22,16,2.4);for(const x of [-14,14]){const p=isoP(x,0,24);g.fillStyle='#f0e8d0';g.fillRect(p.x-1.4,p.y-9,2.8,9)}});
twDef('bellrope',50,140,25,120,(g,v)=>{Kit.shadow(g,2,1,10,3,.7);g.strokeStyle='#8a6a3a';g.lineWidth=2;g.beginPath();g.moveTo(0,-110);g.quadraticCurveTo(2,-60,0,-14);g.stroke();g.fillStyle='#c84a3a';g.beginPath();g.ellipse(0,-12,3,6,0,0,6.283);g.fill();
  Kit.solid(g,q=>{q.moveTo(-14,-100);q.quadraticCurveTo(-14,-122,0,-124);q.quadraticCurveTo(14,-122,14,-100);q.lineTo(16,-96);q.lineTo(-16,-96);q.closePath()},-16,-124,16,-96,'#c8962e',{rim:'rgba(255,240,180,.9)'})});
twDef('cauldron',60,60,30,44,(g,v)=>{Kit.shadow(g,4,2,18,6,.8);const c=twCyl(g,0,0,4,12,14,'#2e2c30');g.fillStyle='#6aff9a';g.globalAlpha=.7;g.beginPath();g.ellipse(c.t.x,c.t.y,c.rx*.8,c.ry*.8,0,0,6.283);g.fill();g.globalAlpha=1});
twDef('orrery',90,120,45,96,(g,v)=>{Kit.shadow(g,4,2,24,8,.8);twCyl(g,0,0,0,10,30,'#5a3a22');const c=isoP(0,0,62);g.strokeStyle='#d8b860';g.lineWidth=1.6;for(const [rx,ry,r] of [[30,10,.2],[22,16,-.6],[14,14,1]]){g.beginPath();g.ellipse(c.x,c.y,rx,ry,r,0,6.283);g.stroke()}
  g.fillStyle='#ffd27a';g.beginPath();g.arc(c.x,c.y,6,0,6.283);g.fill();for(const [a,col] of [[.6,'#8fd8ff'],[2.4,'#ff7a5a'],[4.4,'#b9a2ff']]){g.fillStyle=col;g.beginPath();g.arc(c.x+Math.cos(a)*24,c.y+Math.sin(a)*12,3,0,6.283);g.fill()}});
twDef('lectern',40,70,20,54,(g,v)=>{Kit.shadow(g,2,1,10,4,.7);twBox(g,0,0,0,6,6,26,'#5a3a22');twBox(g,0,0,26,18,12,3,'#7a5432');const p=isoP(0,0,30);g.fillStyle='#e8e0c8';g.beginPath();g.moveTo(p.x-9,p.y);g.quadraticCurveTo(p.x-4,p.y-4,p.x,p.y);g.quadraticCurveTo(p.x+4,p.y-4,p.x+9,p.y);g.lineTo(p.x+8,p.y+3);g.lineTo(p.x-8,p.y+3);g.closePath();g.fill()});
twDef('candle',30,70,15,58,(g,v)=>{Kit.shadow(g,2,1,6,2,.6);g.fillStyle='#d8b860';g.fillRect(-1,-40,2,40);g.fillRect(-5,-1,10,2);g.fillRect(-6,-41,12,2);g.fillStyle='#f0e8d0';for(const x of [-4,0,4])g.fillRect(x-1,-48,2,7)});
twDef('desk',90,70,45,48,(g,v)=>{Kit.shadow(g,4,2,30,9,.75);twBox(g,0,0,0,46,24,16,'#5a3a22',{tex:'wood',texA:.6});twBox(g,0,0,16,50,26,2,'#7a5432');const p=isoP(-6,0,18);g.fillStyle='#e8e0c8';g.fillRect(p.x-8,p.y-3,12,5);g.fillStyle='#2a2a3a';g.fillRect(p.x+10,p.y-6,2,6)});
twDef('rack',90,90,45,66,(g,v)=>{Kit.shadow(g,4,2,30,8,.8);twBox(g,0,0,0,46,10,6,'#4a3220');for(let i=0;i<5;i++){const p=isoP(-18+i*9,0,6);g.fillStyle='#8a8a92';g.fillRect(p.x-1,p.y-40,2,40);g.fillStyle=v===1?'#5a3a22':'#c8c8d0';g.fillRect(p.x-1,p.y-40,2,v===1?40:30);if(v===1){g.fillStyle=['#ff7a2e','#8fd8ff','#ffe066','#b9a2ff','#9fe39a'][i];g.beginPath();g.arc(p.x,p.y-42,3,0,6.283);g.fill()}}});
twDef('mannequin',40,80,20,64,(g,v)=>{Kit.shadow(g,2,1,10,3,.7);g.fillStyle='#4a3220';g.fillRect(-1,-14,2,14);g.fillRect(-6,-1,12,2);Kit.solid(g,q=>{q.moveTo(-8,-48);q.lineTo(8,-48);q.lineTo(10,-14);q.lineTo(-10,-14);q.closePath()},-10,-48,10,-14,['#7a2a3a','#2a4a7a','#4a5a3a'][v%3],{tex:'cloth',texA:.5});g.fillStyle='#c8b090';g.beginPath();g.arc(0,-53,5,0,6.283);g.fill()});
// [v22] 굽기 마무리: 그림자 호출은 모아 두었다가 맨 뒤에 깔고(발밑 짙은 접지 그늘 + 넓은 그림자),
//   몸체에는 왼쪽 위 빛 기울기 · 바닥 차폐 · 짙은 외곽선(몬스터와 같은 mInk)을 입힌다. 굽는 순간에만 돈다
function twBake(g,w,h,ax,ay,paint,o){o=o||{};const sh=[],ks=Kit.shadow;Kit.shadow=function(c){if(c===g){sh.push([].slice.call(arguments,1));return}return ks.apply(Kit,arguments)};
  g.save();g.translate(ax,ay);try{paint(g)}finally{Kit.shadow=ks;g.restore()}
  g.save();g.globalCompositeOperation='source-atop';
  let gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'rgba(255,232,190,.1)');gr.addColorStop(.5,'rgba(255,232,190,0)');gr.addColorStop(1,'rgba(24,12,36,.16)');g.fillStyle=gr;g.fillRect(0,0,w,h);
  const ao=o.ao!=null?o.ao:Math.max(4,Math.min(12,ay*.14));if(ao>0){gr=g.createLinearGradient(0,ay+4,0,ay-ao);gr.addColorStop(0,'rgba(14,8,14,.3)');gr.addColorStop(1,'rgba(14,8,14,0)');g.fillStyle=gr;g.fillRect(0,ay-ao,w,h-ay+ao)}
  g.restore();
  if(o.ink!==0)mInk(g,'rgba(22,13,9,.85)',o.ink||.6);
  if(sh.length){g.save();g.globalCompositeOperation='destination-over';g.translate(ax,ay);for(const a of sh){const al=a[4]==null?1:a[4];ks.call(Kit,g,a[0]*.3,a[1]*.4,a[2]*.6,a[3]*.62,Math.min(1,al*.9));ks.call(Kit,g,a[0],a[1],a[2],a[3],al)}g.restore()}}
// 소품 한 장 굽기 (반전과 깊이 순서는 호출자가)
function twProp(d){const D=TWP[d.k];if(!D)return null;const v=d.pv|0;return SC.get(`twp/${d.k}/${v}`,D.w,D.h,D.ax,D.ay,g=>twBake(g,D.w,D.h,D.ax,D.ay,q=>D.p(q,v)),{scale:Math.max(1.5,DPR)})}

/* ---------- [v22] 마을 지형지물: 분수 · 등불 · 짝문 · 창고. 한 번 굽고, 매 프레임은 물결 · 물방울 · 빛 같은 가벼운 덧그림만 ---------- */
// 분수: 돌 블록을 두른 둥근 못 + 가운데 받침과 물그릇
function twFountainPaint(g){const s=mulberry(303),st='#8a8478';Kit.shadow(g,10,10,88,30,.85);
  const rx=74,ry=35,H=13,P=(th,z,k)=>({x:Math.cos(th)*rx*(k||1),y:-z+Math.sin(th)*ry*(k||1)}),lit=th=>.3*Math.cos(th-2.25)-.08;
  const patch=(t0,t1,z0,z1,fill,k)=>{g.fillStyle=fill;g.beginPath();for(let i=0;i<=6;i++){const p=P(t0+(t1-t0)*i/6,z0,k);i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)}for(let i=6;i>=0;i--){const p=P(t0+(t1-t0)*i/6,z1,k);g.lineTo(p.x,p.y)}g.closePath();g.fill()};
  // 바깥 벽: 앞 반쪽에 돌 두 줄
  patch(0,Math.PI,-6,H,Kit.lit(st,-.55));
  for(let row=0;row<2;row++){const z0=-6+row*9.5,z1=Math.min(H,z0+9.5);let a=row?-.12:0;while(a<Math.PI){const bw=.26+s()*.16,a0=Math.max(0,a)+.012,a1=Math.min(Math.PI,a+bw)-.012,m=(a0+a1)/2;
      patch(a0,a1,z0+.6,z1-.6,Kit.lit(st,lit(m)+(s()-.5)*.18));patch(a0,a1,z1-1.6,z1-.6,`rgba(255,244,220,${.1+.2*Math.max(0,Math.cos(m-2.25))})`);
      if(s()<.35){const p=P(a0+(a1-a0)*s(),z0+2+s()*5);g.strokeStyle='rgba(20,16,14,.35)';g.lineWidth=.6;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+s()*4-2,p.y-3);g.stroke()}a+=bw}}
  {const gr=g.createLinearGradient(0,ry+6,0,ry-6);gr.addColorStop(0,'rgba(10,6,12,.55)');gr.addColorStop(1,'rgba(10,6,12,0)');patch(0,Math.PI,-6,2,gr)}
  for(let i=0;i<40;i++){const a=s()*Math.PI,p=P(a,-5+Math.pow(s(),2)*9);g.fillStyle=`rgba(${58+s()*36|0},${86+s()*36|0},36,${.35+s()*.35})`;g.beginPath();g.ellipse(p.x,p.y,1.4+s()*3,1+s()*1.4,0,0,6.283);g.fill()}
  // 테두리 윗면: 갓돌 고리 (바깥 74 → 안 62)
  g.fillStyle=Kit.lit(st,.08);g.beginPath();g.ellipse(0,-H,rx,ry,0,0,6.283);g.fill();
  {const gr=g.createLinearGradient(-rx,-H-ry,rx,-H+ry);gr.addColorStop(0,'rgba(255,240,214,.22)');gr.addColorStop(1,'rgba(0,0,0,.2)');g.fillStyle=gr;g.beginPath();g.ellipse(0,-H,rx,ry,0,0,6.283);g.fill()}
  g.strokeStyle='rgba(40,36,32,.6)';g.lineWidth=.7;for(let i=0;i<22;i++){const a=i/22*6.283+.1,p=P(a,H,.84),q=P(a,H);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}
  g.strokeStyle='rgba(255,244,220,.5)';g.lineWidth=1;g.beginPath();g.ellipse(0,-H,rx-.5,ry-.3,0,Math.PI*.15,Math.PI*.85);g.stroke();
  // 안쪽: 먼 벽 그늘 → 물
  g.save();g.beginPath();g.ellipse(0,-H,rx*.84,ry*.84,0,0,6.283);g.clip();g.fillStyle='#3e3a34';g.fillRect(-rx,-H-ry,rx*2,ry*2);
  for(let i=0;i<14;i++){const a=Math.PI+i/14*Math.PI;const p=P(a,H,.84);g.fillStyle='rgba(20,18,16,.5)';g.fillRect(p.x-.4,p.y,.8,6)}
  {const gr=g.createRadialGradient(-12,-H+2,4,0,-H+4,rx*.86);gr.addColorStop(0,'#4a8a9a');gr.addColorStop(.55,'#24586a');gr.addColorStop(1,'#12303e');g.fillStyle=gr;g.beginPath();g.ellipse(0,-H+4,rx*.84,ry*.76,0,0,6.283);g.fill()}
  g.fillStyle='rgba(190,230,245,.22)';g.beginPath();g.ellipse(-24,-H-4,20,4,-.08,0,6.283);g.fill();
  for(let i=0;i<7;i++){g.fillStyle='rgba(230,190,90,.55)';g.beginPath();g.ellipse(-30+s()*60,-H+2+s()*16,1.3,.7,0,0,6.283);g.fill()}
  g.restore();
  // 가운데 받침: 낮은 원통 → 기둥 → 물그릇 → 꼭대기 장식
  const cyl=(cy,r,h,col,o)=>{const rx2=r,ry2=r*.48,top=cy-h,gr=g.createLinearGradient(-rx2,0,rx2,0);gr.addColorStop(0,Kit.lit(col,.28));gr.addColorStop(.45,col);gr.addColorStop(1,Kit.lit(col,-.5));
    g.fillStyle=gr;g.beginPath();g.ellipse(0,cy,rx2,ry2,0,0,Math.PI);g.lineTo(-rx2,top);g.ellipse(0,top,rx2,ry2,0,Math.PI,0,true);g.closePath();g.fill();
    if(o&&o.tex){g.save();g.globalAlpha=.4;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'stone');g.fill();g.restore()}
    g.fillStyle=Kit.lit(col,.18);g.beginPath();g.ellipse(0,top,rx2,ry2,0,0,6.283);g.fill();g.strokeStyle='rgba(255,244,220,.45)';g.lineWidth=.8;g.beginPath();g.ellipse(0,top,rx2,ry2,0,Math.PI*.9,Math.PI*1.7);g.stroke();return top};
  let y=-H+6;y=cyl(y,15,6,'#7a7468',{tex:1});{const gr=g.createLinearGradient(0,y+8,0,y);gr.addColorStop(0,'rgba(20,40,50,.5)');gr.addColorStop(1,'rgba(20,40,50,0)');g.fillStyle=gr;g.fillRect(-15,y,30,8)}
  y=cyl(y,6,22,'#9a9486',{tex:1});g.strokeStyle='rgba(60,56,50,.5)';g.lineWidth=.8;for(const k of [.3,.7]){g.beginPath();g.ellipse(0,y+22*k,6,2.9,0,0,Math.PI);g.stroke()}
  // 물그릇: 아래로 볼록한 접시
  const by=y-1,bw=22,bh=10.5;
  Kit.solid(g,q=>{q.moveTo(-bw,by-3);q.quadraticCurveTo(-bw*.6,by+7,0,by+7);q.quadraticCurveTo(bw*.6,by+7,bw,by-3);q.ellipse(0,by-3,bw,bh*.5,0,0,Math.PI,true);q.closePath()},-bw,by-8,bw,by+7,'#a8a294',{tex:'stone',texA:.45,rim:'rgba(255,244,220,.6)',lineW:.8});
  g.fillStyle='#b8b2a4';g.beginPath();g.ellipse(0,by-3,bw,bh*.5,0,0,6.283);g.fill();
  {const gr=g.createRadialGradient(-5,by-4,1,0,by-3,bw);gr.addColorStop(0,'#5a9aaa');gr.addColorStop(1,'#1e4a5a');g.fillStyle=gr;g.beginPath();g.ellipse(0,by-3,bw-2.4,bh*.5-1.3,0,0,6.283);g.fill()}
  g.strokeStyle='rgba(255,244,220,.55)';g.lineWidth=.8;g.beginPath();g.ellipse(0,by-3,bw,bh*.5,0,Math.PI*.1,Math.PI*.9);g.stroke();
  // 흘러내리는 물 장막 (옅게 구워 두고, 물방울은 매 프레임)
  for(let i=0;i<9;i++){const a=.15+i/8*(Math.PI-.3),x=Math.cos(a)*bw,y0=by-3+Math.sin(a)*bh*.5,gr=g.createLinearGradient(0,y0,0,-H+6);gr.addColorStop(0,'rgba(200,236,250,.5)');gr.addColorStop(1,'rgba(200,236,250,.05)');
    g.strokeStyle=gr;g.lineWidth=1.3;g.beginPath();g.moveTo(x,y0);g.quadraticCurveTo(x*1.3,y0+4,x*1.45,-H+6+Math.sin(a)*4);g.stroke()}
  // 꼭대기: 작은 기둥 + 물이 솟는 꽃봉오리
  const ty=cyl(by-3,3.2,10,'#a8a294');Kit.solid(g,q=>{q.moveTo(-4.2,ty);q.quadraticCurveTo(-5,ty-5,0,ty-9);q.quadraticCurveTo(5,ty-5,4.2,ty);q.closePath()},-5,ty-9,5,ty,'#b8b2a4',{tex:'stone',texA:.4,rim:'rgba(255,250,235,.8)',lineW:.7});
  for(let i=0;i<5;i++){g.fillStyle=`rgba(${64+s()*30|0},${92+s()*30|0},40,.5)`;g.beginPath();g.ellipse(-4+s()*5,y+12+s()*8,1.2,1.8,0,0,6.283);g.fill()}}
// 등불: 돌 받침 · 꼰 쇠기둥 · 덩굴손 장식 · 따뜻한 유리 등
function twLampPaint(g){const s=mulberry(404),ir='#2a2624';Kit.shadow(g,8,2,11,3.4,.8);
  twBoxR(g,0,0,0,7,7,5,'#7a7468','stone',s,{rh:5,bw:[7,7],ao:2});
  const b=isoP(0,0,5),py=b.y,top=-40;
  // 기둥: 아래가 굵고 위로 가늘다 + 고리 마디
  const post=q=>{q.moveTo(-2.4,py);q.lineTo(-1.3,top);q.lineTo(1.3,top);q.lineTo(2.4,py);q.closePath()};Kit.solid(g,post,-2.4,top,2.4,py,'#3a3634',{tex:'metal',texA:.45,rim:'rgba(220,210,200,.7)',lineW:.6});
  for(const yy of [py-2,py-14,top+6]){Kit.solid(g,q=>q.ellipse(0,yy,3,1.3,0,0,6.283),-3,yy-1.3,3,yy+1.3,'#4a4440',{rim:'rgba(230,220,200,.8)',lineW:.5})}
  // 덩굴손 (양쪽으로 말린 쇠)
  g.strokeStyle=ir;g.lineWidth=1.1;g.lineCap='round';for(const sx of [-1,1]){g.beginPath();g.moveTo(0,top+10);g.quadraticCurveTo(sx*7,top+9,sx*6,top+4);g.quadraticCurveTo(sx*5,top+1,sx*3.4,top+3);g.stroke()}
  g.strokeStyle='rgba(200,190,180,.4)';g.lineWidth=.4;g.beginPath();g.moveTo(-.4,top+9.5);g.quadraticCurveTo(-6.6,top+8.6,-6,top+4);g.stroke();
  // 등: 아래 받침 → 유리 4면(앞 둘) → 쇠살 → 갓 → 고리
  const ly=top-1,lh=12,w0=4.2,w1=5.6;
  Kit.solid(g,q=>{q.moveTo(-w0-1,ly);q.lineTo(w0+1,ly);q.lineTo(w0-1,ly+2.4);q.lineTo(-w0+1,ly+2.4);q.closePath()},-w0-1,ly,w0+1,ly+2.4,'#3a3430',{lineW:.5});
  const glass=q=>{q.moveTo(-w0,ly);q.lineTo(-w1,ly-lh);q.lineTo(w1,ly-lh);q.lineTo(w0,ly);q.closePath()};
  {const gr=g.createRadialGradient(-.6,ly-lh*.5,0,0,ly-lh*.5,lh*.8);gr.addColorStop(0,'#fff6d0');gr.addColorStop(.35,'#ffd27a');gr.addColorStop(.8,'#e08a30');gr.addColorStop(1,'#9a4a18');g.fillStyle=gr;g.beginPath();glass(g);g.fill()}
  g.fillStyle='rgba(120,50,10,.35)';g.beginPath();g.moveTo(.6,ly);g.lineTo(.8,ly-lh);g.lineTo(w1,ly-lh);g.lineTo(w0,ly);g.closePath();g.fill();
  g.fillStyle='#fffbe8';g.beginPath();g.ellipse(-.4,ly-lh*.42,1.2,2.4,0,0,6.283);g.fill();
  g.strokeStyle=ir;g.lineWidth=.9;g.beginPath();g.moveTo(-w0,ly);g.lineTo(-w1,ly-lh);g.moveTo(w0,ly);g.lineTo(w1,ly-lh);g.moveTo(.4,ly);g.lineTo(.5,ly-lh);g.moveTo(-w0-.2,ly-lh*.5);g.lineTo(w0+.2,ly-lh*.5);g.stroke();
  g.fillStyle='rgba(255,255,255,.55)';g.fillRect(-w0+.6,ly-lh+1.4,.8,lh-3);
  const cap=q=>{q.moveTo(-w1-1.6,ly-lh);q.lineTo(w1+1.6,ly-lh);q.quadraticCurveTo(3,ly-lh-3,0,ly-lh-7);q.quadraticCurveTo(-3,ly-lh-3,-w1-1.6,ly-lh);q.closePath()};
  Kit.solid(g,cap,-w1-1.6,ly-lh-7,w1+1.6,ly-lh,'#3a3634',{tex:'metal',texA:.5,rim:'rgba(230,220,200,.85)',lineW:.6});
  {const gr=g.createLinearGradient(0,ly-lh,0,ly-lh-3);gr.addColorStop(0,'rgba(255,190,90,.55)');gr.addColorStop(1,'rgba(255,190,90,0)');g.fillStyle=gr;g.beginPath();cap(g);g.fill()}
  g.strokeStyle=ir;g.lineWidth=1;g.beginPath();g.arc(0,ly-lh-8.6,1.8,0,6.283);g.stroke()}
// 짝문: 돌을 깎아 쌓은 아치 · 보라 룬 · 디딤돌. 소용돌이는 매 프레임
const TWG={cy:-25,inx:18,spring:-44,top:-60};
function twGatePaint(g,glow){const s=mulberry(505),st='#8a8478',sd='#5e5a54';
  if(glow){// 룬 빛만 따로 한 장 (가산 합성으로 맥박)
    for(const sx of [-1,1])for(let i=0;i<3;i++){const x=sx*24,y=-10-i*12;g.drawImage(Kit.glowCv('#b9a2ff'),x-7,y-7,14,14)}g.drawImage(Kit.glowCv('#c9b4ff'),-6,TWG.top-9.4,12,12);return}
  Kit.shadow(g,12,4,42,10,.9);
  // 디딤돌 (앞면 · 윗면)
  const slab=(y0,x0,x1,h,c)=>{twFill(g,[{x:x0,y:y0},{x:x1,y:y0},{x:x1+6,y:y0-5},{x:x0+6,y:y0-5}],Kit.lit(c,.14));Kit.solid(g,q=>q.rect(x0,y0,x1-x0,h),x0,y0,x1,y0+h,c,{tex:'stone',texA:.55,lineW:.6});g.fillStyle=Kit.lit(c,-.45);g.beginPath();g.moveTo(x1,y0);g.lineTo(x1+6,y0-5);g.lineTo(x1+6,y0-5+h);g.lineTo(x1,y0+h);g.closePath();g.fill()};
  slab(-1,-38,36,5,'#7a7468');
  // 안쪽 어둠 (문 너머)
  {const op=q=>{q.moveTo(-TWG.inx,-2);q.lineTo(-TWG.inx,TWG.spring);q.ellipse(0,TWG.spring,TWG.inx,TWG.spring-TWG.top,0,Math.PI,0);q.lineTo(TWG.inx,-2);q.closePath()};
    const gr=g.createRadialGradient(0,TWG.cy,2,0,TWG.cy,34);gr.addColorStop(0,'#3a2a5a');gr.addColorStop(.7,'#1a1426');gr.addColorStop(1,'#0e0a16');g.fillStyle=gr;g.beginPath();op(g);g.fill()}
  // 기둥: 블록마다 앞면 + 오른쪽 옆면
  for(const sx of [-1,1]){const x0=sx<0?-31:TWG.inx+1,w=12;let y=-2,i=0;while(y>TWG.spring+.5){const h=Math.min(9+(i%2)*2,y-TWG.spring),c=Kit.lit(st,(s()-.5)*.16+(sx>0?-.06:0)),bw=w+(i%2?1:-.5),bx=x0-(i%2?.5:0);
      Kit.solid(g,q=>q.rect(bx,y-h,bw,h),bx,y-h,bx+bw,y,c,{tex:'stone',texA:.6,lineW:.6,rim:'rgba(255,244,220,.5)'});
      g.fillStyle=Kit.lit(sd,-.2);g.beginPath();g.moveTo(bx+bw,y);g.lineTo(bx+bw+4,y-3);g.lineTo(bx+bw+4,y-h-3);g.lineTo(bx+bw,y-h);g.closePath();g.fill();
      g.fillStyle='rgba(255,244,220,.28)';g.fillRect(bx+.5,y-h+.5,bw-1,.8);y-=h;i++}
    // 깎아 새긴 룬 (어둡게 판 홈 + 보라 빛)
    for(let k=0;k<3;k++){const cx=sx*24+(sx<0?.5:-.5),cy=-10-k*12;g.strokeStyle='rgba(20,14,30,.75)';g.lineWidth=1.3;g.beginPath();
      if(k===0){g.moveTo(cx-2.4,cy+3);g.lineTo(cx,cy-3);g.lineTo(cx+2.4,cy+3);g.moveTo(cx-1.4,cy+.6);g.lineTo(cx+1.4,cy+.6)}else if(k===1){g.moveTo(cx,cy-3.4);g.lineTo(cx,cy+3.4);g.moveTo(cx-2.4,cy-1.6);g.lineTo(cx+2.4,cy+1.6)}else{g.arc(cx,cy,2.6,0,6.283);g.moveTo(cx,cy-2.6);g.lineTo(cx,cy+2.6)}
      g.stroke();g.strokeStyle='#c9b4ff';g.lineWidth=.6;g.stroke()}}
  // 아치: 쐐기돌 9개 (안 반지름 18×16, 바깥 30×21) + 이맛돌
  const ir=[TWG.inx,TWG.spring-TWG.top],orr=[TWG.inx+13,TWG.spring-TWG.top+7];
  for(let i=0;i<9;i++){const a0=Math.PI+i/9*Math.PI+.015,a1=Math.PI+(i+1)/9*Math.PI-.015,pts=[];for(const [a,r] of [[a0,ir],[a0,orr],[a1,orr],[a1,ir]])pts.push(Math.cos(a)*r[0],TWG.spring+Math.sin(a)*r[1]);
    const c=i===4?'#a8a094':Kit.lit(st,.1-Math.abs(i-3)*.04+(s()-.5)*.08),pq=q=>{q.moveTo(pts[0],pts[1]);for(let k=2;k<8;k+=2)q.lineTo(pts[k],pts[k+1]);q.closePath()};
    Kit.solid(g,pq,Math.min(pts[0],pts[2],pts[4],pts[6]),Math.min(pts[1],pts[3],pts[5],pts[7]),Math.max(pts[0],pts[2],pts[4],pts[6]),Math.max(pts[1],pts[3],pts[5],pts[7]),c,{tex:'stone',texA:.6,lineW:.6,rim:'rgba(255,244,220,.55)'})}
  // 이맛돌에 박힌 보라 수정
  Kit.solid(g,q=>{q.moveTo(0,TWG.top-6.6);q.lineTo(2.4,TWG.top-3.4);q.lineTo(0,TWG.top-.2);q.lineTo(-2.4,TWG.top-3.4);q.closePath()},-2.4,TWG.top-6.6,2.4,TWG.top-.2,'#9a7ae8',{rim:'rgba(255,240,255,.95)',lineW:.6});
  // 담쟁이와 이끼 (왼쪽 기둥)
  g.strokeStyle='#3a5a24';g.lineWidth=.8;g.beginPath();g.moveTo(-31,-2);g.bezierCurveTo(-33,-14,-28,-24,-31,-38);g.stroke();
  for(let i=0;i<14;i++){const t=i/13,x=-31+Math.sin(t*9)*2.4,y=-2-t*38;twLeaf(g,x,y,2.2,s()*3,Kit.lit('#4a7a30',(s()-.4)*.4))}
  for(let i=0;i<12;i++){g.fillStyle=`rgba(${60+s()*30|0},${90+s()*30|0},38,.5)`;g.beginPath();g.ellipse(-36+s()*72,-2-s()*5,1.4+s()*2,.9,0,0,6.283);g.fill()}}
// 창고: 쇠띠 두른 나무 궤짝 (예전 그림과 같은 자리 · 크기)
function twStashPaint(g){const s=mulberry(606),wd='#7a5230',ir='#34302c';Kit.shadow(g,8,5,34,9,.95);
  const A={x:-24,y:-30},U={x:34,y:10},W={x:18,y:-10},Hh=26,fp=(t,v)=>({x:A.x+U.x*t,y:A.y+U.y*t+Hh*(1-v)}),sp=(t,v)=>({x:A.x+U.x+W.x*t,y:A.y+U.y+W.y*t+Hh*(1-v)});
  // 쇠 발
  for(const p of [fp(0,0),fp(1,0),sp(1,0)]){g.fillStyle=ir;g.fillRect(p.x-2,p.y-1,4,3)}
  // 앞면 (널 세 장) · 옆면
  const F=[fp(0,0),fp(1,0),fp(1,1),fp(0,1)],S=[sp(0,0),sp(1,0),sp(1,1),sp(0,1)];
  g.fillStyle=wd;twPoly(g,F);g.fill();g.fillStyle=Kit.lit(wd,-.42);twPoly(g,S);g.fill();
  for(let k=0;k<3;k++){const a=fp(0,k/3),b=fp(1,k/3),c=fp(1,(k+1)/3),d=fp(0,(k+1)/3),gr=g.createLinearGradient(0,d.y,0,a.y);gr.addColorStop(0,Kit.lit(wd,.16+(s()-.5)*.1));gr.addColorStop(1,Kit.lit(wd,-.14));g.fillStyle=gr;twPoly(g,[{x:a.x,y:a.y-.4},{x:b.x,y:b.y-.4},{x:c.x,y:c.y+.4},{x:d.x,y:d.y+.4}]);g.fill()}
  for(let k=0;k<3;k++){const a=sp(0,k/3),b=sp(1,k/3),c=sp(1,(k+1)/3),d=sp(0,(k+1)/3);g.fillStyle=Kit.lit(wd,-.4+(s()-.5)*.08);twPoly(g,[{x:a.x,y:a.y-.4},{x:b.x,y:b.y-.4},{x:c.x,y:c.y+.4},{x:d.x,y:d.y+.4}]);g.fill()}
  for(const Q of [F,S]){g.save();twPoly(g,Q);g.clip();g.globalAlpha=.45;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'wood');g.fillRect(-30,-50,70,60);g.restore()}
  // 뚜껑: 앞 모서리를 따라 누운 반원통
  const lid=(t,ph)=>{const b=fp(t,1),k=(1-Math.cos(ph))/2;return{x:b.x+W.x*k,y:b.y+W.y*k-Math.sin(ph)*9}};
  for(let i=0;i<8;i++){const p0=i/8*Math.PI,p1=(i+1)/8*Math.PI,m=(p0+p1)/2,l=.42*Math.sin(m+.5)-.12;g.fillStyle=Kit.lit('#93663c',l);twPoly(g,[lid(0,p0),lid(1,p0),lid(1,p1),lid(0,p1)]);g.fill()}
  {const pts=[];for(let i=0;i<=8;i++)pts.push(lid(0,i/8*Math.PI));for(let i=8;i>=0;i--)pts.push(lid(1,i/8*Math.PI));g.save();twPoly(g,pts);g.clip();g.globalAlpha=.4;g.globalCompositeOperation='overlay';g.fillStyle=Kit.pattern(g,'wood');g.fillRect(-30,-60,70,40);g.restore()}
  // 뚜껑 오른쪽 끝 (반달 모양)
  {const pts=[];for(let i=0;i<=10;i++)pts.push(lid(1,i/10*Math.PI));g.fillStyle=Kit.lit(wd,-.5);twPoly(g,pts);g.fill();g.strokeStyle='rgba(20,10,4,.45)';g.lineWidth=.5;for(const k of [.33,.66]){const a=lid(1,k*Math.PI*.5),b=lid(1,Math.PI-k*Math.PI*.5);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}}
  g.strokeStyle='rgba(255,226,170,.4)';g.lineWidth=1;g.beginPath();for(let i=2;i<=6;i++){const p=lid(0,i/8*Math.PI);i>2?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)}g.stroke();
  // 쇠띠: 앞면 세로 · 뚜껑 위 · 옆면 + 징
  const band=(pts,w)=>{g.strokeStyle=ir;g.lineWidth=w;g.lineJoin='round';g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke();g.strokeStyle='rgba(220,214,206,.45)';g.lineWidth=.6;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x-.7,p.y-.3):g.moveTo(p.x-.7,p.y-.3));g.stroke()};
  for(const t of [.15,.85]){band([fp(t,0),fp(t,1)],2.6);const lp=[];for(let i=0;i<=8;i++)lp.push(lid(t,i/8*Math.PI));band(lp,2.6);g.fillStyle='#8a8478';for(const v of [.2,.5,.8]){const p=fp(t,v);g.beginPath();g.arc(p.x,p.y,.8,0,6.283);g.fill()}}
  band([sp(.5,0),sp(.5,1)],2.2);band([fp(0,.08),fp(1,.08),sp(1,.08)],1.6);band([fp(0,1),fp(1,1),sp(1,1)],1.4);
  // 모서리 쇠 덧댐
  for(const [p,dx] of [[fp(0,0),1],[fp(0,1),1],[fp(1,0),-1],[fp(1,1),-1]]){g.fillStyle='#3e3a36';g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+dx*4,p.y+dx*1.2);g.lineTo(p.x,p.y+(p.y<-10?4:-4));g.closePath();g.fill()}
  // 자물쇠판과 고리 (매 프레임 빛이 덧씌워지는 자리: -6,-18)
  Kit.solid(g,q=>{q.moveTo(-10,-23);q.lineTo(-2,-21);q.lineTo(-2,-13);q.quadraticCurveTo(-6,-10,-10,-15);q.closePath()},-10,-23,-2,-10,'#e8c35a',{tex:'metal',texA:.5,rim:'rgba(255,250,210,1)',lineW:.6});
  g.fillStyle='#5a3e10';g.beginPath();g.arc(-6,-17.6,1.3,0,6.283);g.fill();g.fillRect(-6.5,-17.4,1,3);
  g.strokeStyle='#b89a40';g.lineWidth=1.2;g.beginPath();g.arc(-6,-24,2.4,Math.PI*.1,Math.PI*.9);g.stroke()}
const TWL={fountain:{w:180,h:124,ax:90,ay:64,p:twFountainPaint,ao:0},lamp:{w:40,h:92,ax:20,ay:82,p:twLampPaint,ao:6},gate:{w:100,h:104,ax:50,ay:86,p:twGatePaint,ao:6},stash:{w:84,h:74,ax:40,ay:60,p:twStashPaint,ao:5}};
const twLand=(k,gl)=>{const D=TWL[k];return SC.get('twl/'+k+(gl?'/g':''),D.w,D.h,D.ax,D.ay,gl?g=>{g.translate(D.ax,D.ay);D.p(g,1)}:g=>twBake(g,D.w,D.h,D.ax,D.ay,D.p,{ao:D.ao}),{scale:Math.max(1.5,DPR)})};
// 매 프레임: 구운 그림 한 장 + 몇 개의 호 · 점 · 빛 (이름표는 예전 자리 그대로)
function twLandDraw(d){const e=twLand(d.k);if(!e)return false;const s=d._s,k=d.s||1;SC.draw(ctx,e,s.x,s.y,k);
  ctx.save();ctx.translate(s.x,s.y);ctx.scale(k,k);const t=time,rm=reduceMotion;
  if(d.k==='fountain'){ctx.strokeStyle='rgba(210,240,255,.5)';ctx.lineWidth=1.2;for(let i=0;i<3;i++){const r=24+((t*12+i*13)%34);ctx.globalAlpha=(1-(r-24)/34)*.8;ctx.beginPath();ctx.ellipse(0,-9,r,r*.47,0,0,6.283);ctx.stroke()}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(220,244,255,.85)';
    if(!rm){for(let i=0;i<10;i++){const p=(t*1.3+i/10)%1,a=i/10*6.283,x=Math.cos(a)*p*14,y=-58+p*(-12+p*30);ctx.globalAlpha=1-p*.6;ctx.fillRect(x-.8,y-.8,1.6,1.6)}
      for(let i=0;i<12;i++){const p=(t*.9+i/12+(i%3)*.13)%1,a=.15+(i%9)/8*(Math.PI-.3),x=Math.cos(a)*(22+p*10),y=-40+Math.sin(a)*5+p*p*24;ctx.globalAlpha=(1-p)*.8;ctx.fillRect(x-.7,y,1.4,2.4)}}
    ctx.globalAlpha=.45;ctx.drawImage(Kit.glowCv('#aae6ff'),-28,-90,56,56);ctx.globalAlpha=.13+.05*Math.sin(t*2);ctx.drawImage(Kit.glowCv('#7ac8e8'),-60,-40,120,56)}
  else if(d.k==='lamp'){ctx.globalCompositeOperation='lighter';const f=rm?1:.92+.08*Math.sin(t*7+d.x)*Math.sin(t*3.1+d.y);
    ctx.globalAlpha=.85*f;const gr=grad('lamp22',()=>{const gr=ctx.createRadialGradient(0,-47,0,0,-47,44);gr.addColorStop(0,'rgba(255,200,110,.9)');gr.addColorStop(1,'rgba(0,0,0,0)');return gr});ctx.fillStyle=gr;circ(0,-47,44);
    ctx.globalAlpha=.7*f;ctx.drawImage(Kit.glowCv('#ffd27a'),-7,-54,14,14)}
  else if(d.k==='gate'){ctx.globalCompositeOperation='lighter';const g2=twLand('gate',1);if(g2){ctx.globalAlpha=.34+.2*Math.sin(t*2.2);SC.draw(ctx,g2,0,0)}ctx.globalAlpha=1;
    const sp=t*2;for(let i=0;i<3;i++){ctx.strokeStyle=`rgba(185,162,255,${.6-i*.15})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,TWG.cy,14-i*3,25-i*6,0,sp*(i%2?-1:1)+i,sp*(i%2?-1:1)+i+4.6);ctx.stroke()}
    const gr=grad('gate',()=>{const gr=ctx.createRadialGradient(0,-25,0,0,-25,26);gr.addColorStop(0,'rgba(185,162,255,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');return gr});ctx.fillStyle=gr;ell(0,-25,17,29)}
  else if(d.k==='stash'){ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(255,210,120,${.18+.08*Math.sin(t*2.4)})`;circ(-6,-18,9)}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
  if(d.k==='stash'||d.k==='gate'){const lb=d.k==='stash'?['창고',2,-54,'#ffd27a']:['짝문',0,-70,'#c9b4ff'];ctx.font='700 13px '+FONT;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(lb[0],lb[1],lb[2]);ctx.fillStyle=lb[3];ctx.fillText(lb[0],lb[1],lb[2])}
  ctx.restore();return true}
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(TWL[d.k]&&twLandDraw(d))return true;return _rd(d)}}

/* ---------- 마을 사람: 옷 · 머리 · 모자 · 손에 든 것으로 생김새를 나눈다 ---------- */
// L: {body,legs,skin,hair,hs(0짧은 1긴 2올림 3대머리+수염 4꽁지),hat(0~8),apron,dress,prop,child,armor,cape,belt}
// v22 손그림 마을 사람: 4등신 가까운 몸 · 짙은 윤곽선 · 둥근 명암 · 옷 주름 · 얼굴 · 머리 결 · 소품 (굽는 순간에만 그린다)
// f: 0 서기 · 1,2 걸음 · 3 숨 들이쉼 · 4 숨 내쉬며 살짝 기울임 (3,4는 서 있을 때 시간으로 고른다)
// 팔·다리: 점 몇 개를 따라 굵기가 줄어드는 모양 (끝은 둥글게)
function twLimb(pts,ws){return q=>{const n=pts.length,A=[],B=[];
  for(let i=0;i<n;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=ws[i]/2;A.push([pts[i][0]+nx*w,pts[i][1]+ny*w]);B.push([pts[i][0]-nx*w,pts[i][1]-ny*w])}
  const e=pts[n-1],p=pts[n-2],dx=e[0]-p[0],dy=e[1]-p[1],l=Math.hypot(dx,dy)||1,w=ws[n-1]*.5;
  q.moveTo(A[0][0],A[0][1]);for(let i=1;i<n;i++)q.lineTo(A[i][0],A[i][1]);q.quadraticCurveTo(e[0]+dx/l*w*1.1,e[1]+dy/l*w*1.1,B[n-1][0],B[n-1][1]);for(let i=n-2;i>=0;i--)q.lineTo(B[i][0],B[i][1]);q.closePath()}}
// 머리카락 결: 경로 안쪽에 밝은 결 · 어두운 결을 정수리에서 흘려 그린다
function twStrands(g,path,c,x0,y0,x1,y1,n,seed){const s=mulberry(seed||7);g.save();g.beginPath();path(g);g.clip();g.lineCap='round';
  for(let i=0;i<n;i++){const u=i/(n-1||1),x=x0+(x1-x0)*u,lt=i%3!==2;g.strokeStyle=lt?mrgb(liteOf(c,.42),.42):mrgb(darkOf(c,.55),.5);g.lineWidth=lt?.45:.55;
    g.beginPath();g.moveTo(x+(s()-.5)*1.2,y0);g.quadraticCurveTo(x+(x-(x0+x1)/2)*.35,(y0+y1)/2,x+(x-(x0+x1)/2)*.5+(s()-.5),y1);g.stroke()}g.restore()}
// 마을 사람 크기: 주인공이 약 1.1배 크게 보이도록 몸 전체를 줄인다 (이름표 높이도 이것에 맞춘다)
const TW_FK=.87;
function twFolkPaint(g,L,f){
  const sk=L.skin||'#e2b48c',body=L.body||'#6a5a3a',legsC=L.legs||'#4a3a2a',bootC=L.boot||'#3a2a1e',hair=L.hair||'#4a2e1e',beltC=L.belt||'#3a2414';
  const CH=!!L.child,k=(CH?.72:1)*TW_FK,AR=!!L.armor,DR=!!L.dress,rim='rgba(255,240,214,.85)',hs=L.hs|0,ht=L.hat|0,hc=L.hatC||'#c8a860',pr=L.prop||'';
  const st=f===1?1:f===2?-1:0,up=f===3?.7:f===4?.25:0,swx=f===4?.45:0;
  const metal=AR?Kit.lit(body,.05):body,cl=AR?'metal':'cloth';
  g.save();g.scale(k,k);
  // ---- 다리와 신발 (치마면 발끝만) ----
  const hem=DR?-4.4:-18.4,hw=DR?11.6:8.8;
  const legs=[];for(const sd of [-1,1]){const o=sd*st,ax=sd*3+o*1.7,fy=o<0?-1.1:0;legs.push({sd,o,ax,fy})}
  legs.sort((a,b)=>a.o-b.o);
  for(const l of legs){const {sd,ax,fy}=l,kx=sd*3.1+l.o*.8;
    if(!DR){const leg=twLimb([[sd*2.9,-25],[kx,-12.6],[ax,fy-4.4]],[5.4,4.3,3.7]);Kit.solid(g,leg,ax-3,-25,ax+3,fy,AR?Kit.lit(legsC,.1):legsC,{tex:AR?'metal':'cloth',texA:.4,lineW:.5});mForm(g,leg,ax-3,-25,ax+3,fy,.8);
      mFold(g,[[kx-1,-13.4],[kx+.2,-12.4],[kx+1.2,-13.2]],legsC,.6);
      if(AR){// 정강이 보호대
        const gr=q=>{q.moveTo(ax-2.2,-14.6);q.quadraticCurveTo(ax+.2,-15.8,ax+2.4,-14.6);q.lineTo(ax+2.1,fy-5.2);q.lineTo(ax-1.9,fy-5.2);q.closePath()};Kit.solid(g,gr,ax-2.4,-16,ax+2.4,fy-5,metal,{tex:'metal',texA:.5,rim:'rgba(255,255,255,.9)',lineW:.5});
        g.fillStyle='rgba(255,255,255,.5)';g.fillRect(ax-.6,-14,.7,7)}}
    // 장화: 목 · 발등 · 밑창 · 접은 단
    const bt=q=>{q.moveTo(ax-2.2,fy-6.2);q.lineTo(ax+2.2,fy-6.2);q.lineTo(ax+2.4,fy-2.8);q.quadraticCurveTo(ax+5.4,fy-2.6,ax+5.4,fy-.2);q.lineTo(ax-2.6,fy-.2);q.quadraticCurveTo(ax-2.8,fy-3,ax-2.2,fy-6.2);q.closePath()};
    if(DR&&fy<0)continue;
    Kit.solid(g,bt,ax-2.8,fy-6.2,ax+5.4,fy,bootC,{tex:'leather',texA:.5,lineW:.5});mForm(g,bt,ax-2.8,fy-6.2,ax+5.4,fy,.7);
    g.fillStyle=mrgb(darkOf(bootC,.6),.95);g.fillRect(ax-2.6,fy-.9,8,.9);
    g.fillStyle=mrgb(liteOf(bootC,.25),1);g.fillRect(ax-2.3,fy-6.4,4.6,1.2);
    g.fillStyle='rgba(255,236,206,.45)';g.beginPath();g.ellipse(ax+3.4,fy-2.3,1.2,.5,-.2,0,6.283);g.fill()}
  g.translate(0,-up);
  // ---- 뒤쪽: 망토 · 긴 머리 · 꽁지 · 두건 자락 (몸 뒤) ----
  const hy0=-52.6,hk=CH?1.12:1,HX=swx;
  const headT=()=>{g.translate(HX,-46.5);g.scale(hk,hk);g.translate(0,46.5)};
  if(L.cape){const sx=swx*1.6,cp=q=>{q.moveTo(-7.4,-45.4);q.lineTo(7.6,-45.4);q.quadraticCurveTo(11.4,-30,12.8+sx,-7.4);
      for(let i=0;i<5;i++){const x0=12.8-i*5.1+sx,x1=x0-5.1;q.quadraticCurveTo((x0+x1)/2,-7.4+(i%2?1.8:-.6),x1,-7.4+(i===4?0:.4))}
      q.quadraticCurveTo(-11.2,-30,-7.4,-45.4);q.closePath()};
    Kit.solid(g,cp,-13,-46,13,-6,Kit.lit(L.cape,-.12),{tex:'cloth',texA:.5,rim:'rgba(255,240,214,.5)',lineW:.6});mForm(g,cp,-13,-46,13,-6,1);
    for(const x of [-9.5,-4,2,8])mFold(g,[[x*.5,-42],[x*.8,-26,x*.95+sx*.5,-9]],L.cape,1)}
  if(ht===3){g.save();headT();const hd=q=>{q.moveTo(-6.4,hy0-4);q.quadraticCurveTo(-9.6,hy0+4,-10.4,-41.6);q.quadraticCurveTo(0,-38.6,10,-41.4);q.quadraticCurveTo(8.8,hy0+5,7.4,hy0-2);q.closePath()};
    Kit.solid(g,hd,-10.6,hy0-4,10.4,-38.6,Kit.lit(hc,-.15),{tex:'cloth',texA:.45,lineW:.6});mForm(g,hd,-10.6,hy0-4,10.4,-38.6,.9);g.restore()}
  if((hs===1||hs===4)&&ht!==3&&ht!==6){g.save();headT();
    if(hs===1){const bh=q=>{q.moveTo(-5.6,hy0-5);q.quadraticCurveTo(-9.4,hy0+4,-8.4,-38.4);q.quadraticCurveTo(-5,-36.6,-1.6,-38.6);q.quadraticCurveTo(2.6,-37.2,5.4,-39.6);q.quadraticCurveTo(6.6,hy0+6,5.6,hy0-2);q.closePath()};
      Kit.solid(g,bh,-9.4,hy0-5,6.6,-36.6,Kit.lit(hair,-.18),{lineW:.5});twStrands(g,bh,hair,-8,hy0-4,5,-37,7,11)}
    else{const tl=q=>{q.moveTo(-4.6,hy0-3.4);q.quadraticCurveTo(-9.6-swx,hy0+2,-8.4-swx*2,hy0+12.6);q.quadraticCurveTo(-7.2-swx*2,hy0+13.6,-6.4-swx*2,hy0+12.4);q.quadraticCurveTo(-6.6,hy0+3,-2.4,hy0-1.6);q.closePath()};
      Kit.solid(g,tl,-9.6,hy0-4,-2.4,hy0+13.6,Kit.lit(hair,-.12),{lineW:.5});twStrands(g,tl,hair,-8.6,hy0-2,-4.8,hy0+13,4,13);
      g.fillStyle=L.hatC&&!ht?hc:'#8a3a2a';g.beginPath();g.ellipse(-6.4,hy0+1.6,1.6,1.1,.6,0,6.283);g.fill()}
    g.restore()}
  if(ht===6){g.save();headT();g.fillStyle=Kit.lit(hc,-.25);for(const [a,l] of [[.5,7],[.9,6]]){g.beginPath();g.moveTo(-5.4,hy0-2);g.quadraticCurveTo(-7.4-swx,hy0+2,-6.8-Math.cos(a)*2-swx*2,hy0-2+l);g.lineTo(-5,hy0+l-3);g.closePath();g.fill()}g.restore()}
  // ---- 몸통: 웃옷 / 치마 / 갑옷 ----
  const torso=q=>{q.moveTo(-7.4,-45.2);q.quadraticCurveTo(0,-47.2,7.6,-45.2);q.quadraticCurveTo(9.8,-44,9.2,-40.4);q.quadraticCurveTo(7.4,-35.4,6.8,-30.6);q.quadraticCurveTo(DR?8.6:7.8,-26,hw,hem);
    const n=DR?6:4;for(let i=0;i<n;i++){const x0=hw-i*2*hw/n,x1=x0-2*hw/n;q.quadraticCurveTo((x0+x1)/2,hem+(i%2?1.5:.3),x1,hem+(i===n-1?0:.6))}
    q.quadraticCurveTo(DR?-8.6:-7.8,-26,-6.8,-30.6);q.quadraticCurveTo(-7.4,-35.4,-9.2,-40.4);q.quadraticCurveTo(-9.8,-44,-7.4,-45.2);q.closePath()};
  Kit.solid(g,torso,-hw,-47,hw,hem+1,metal,{tex:cl,texA:AR?.6:.45,rim,lineW:.6});mForm(g,torso,-hw,-47,hw,hem+1,1.1,.32,.18);
  g.save();g.beginPath();torso(g);g.clip();
  if(!AR){// 가슴 · 허리 아래 주름, 치맛단 안쪽 그늘
    mFold(g,[[-3.4,-40.6],[-1.6,-38.6,.6,-39.4]],body,.7);
    const fx=DR?[-8.4,-4.6,-1,2.8,6.6,9.6]:[-5.6,-1.6,2.4,6];for(let i=0;i<fx.length;i++){const x=fx[i];mFold(g,[[x*.55,-29.4],[x*.82,(hem-29.4)/2,x,hem+1]],body,DR?1:.85)}
    g.fillStyle=mrgb(darkOf(body,.6),.35);g.fillRect(-hw,hem-1.6,hw*2,3);
    // 목둘레: 속옷 깃이 보이는 V자 깃
    const nk=q=>{q.moveTo(-3.6,-46.4);q.lineTo(3.8,-46.4);q.lineTo(1.2,-41.2);q.quadraticCurveTo(.2,-40.6,-.4,-41.4);q.closePath()};Kit.solid(g,nk,-3.6,-46.4,3.8,-40.6,Kit.mix(body,'#efe4cc',.62),{lineW:.45});
    mLine(g,[[-3.8,-46],[-.4,-41],[4,-46]],darkOf(body,.6),.7,.8)}
  else{// 가슴판: 가운데 능선 · 갈비 판 · 리벳
    g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.moveTo(-.4,-44.6);g.lineTo(.6,-44.6);g.lineTo(.4,-31);g.lineTo(-.2,-31);g.closePath();g.fill();
    for(const y of [-36.2,-33.4]){mLine(g,[[-7.4,y+.6],[0,y-.6,7.4,y+.6]],darkOf(body,.6),.8,.85);mLine(g,[[-7.2,y+1.3],[0,y+.1,7.2,y+1.3]],liteOf(body,.5),.4,.6)}
    for(let r=0;r<2;r++){const y=-27.4+r*4.2;mLine(g,[[-hw,y+.4],[0,y+1.2,hw,y+.4]],darkOf(body,.6),.9,.85);mLine(g,[[-hw,y+1.1],[0,y+1.9,hw,y+1.1]],liteOf(body,.5),.4,.55)}
    g.fillStyle='rgba(255,255,240,.85)';for(const [x,y] of [[-5.6,-42.8],[5.8,-42.8],[-6,-26.4],[6,-26.4],[-6.6,-22.2],[6.6,-22.2]]){g.beginPath();g.arc(x,y,.45,0,6.283);g.fill()}
    // 겉옷(타바드): 가운데 늘어진 천 + 문장
    const tb=L.tabard||'#8a2a2a',tp=q=>{q.moveTo(-3.8,-43.6);q.lineTo(3.8,-43.6);q.lineTo(4.2,hem+2.4);q.lineTo(0,hem+4.4);q.lineTo(-4.2,hem+2.4);q.closePath()};
    Kit.solid(g,tp,-4.2,-43.6,4.2,hem+4.4,tb,{tex:'cloth',texA:.5,lineW:.5});mForm(g,tp,-4.2,-43.6,4.2,hem+4.4,.9);mFold(g,[[-1.4,-28],[-1.8,hem+2]],tb,.7);
    g.fillStyle='#d8b860';g.beginPath();g.moveTo(0,-39.4);g.lineTo(2.2,-36.6);g.lineTo(0,-33.4);g.lineTo(-2.2,-36.6);g.closePath();g.fill();g.fillStyle=Kit.lit(tb,-.2);g.beginPath();g.arc(0,-36.5,.9,0,6.283);g.fill();
    g.strokeStyle='#d8b860';g.lineWidth=.5;g.strokeRect(-3.4,-43.2,6.8,.1)}
  g.restore();
  // 앞치마: 가슴받이 · 끈 · 주머니 · 주름
  if(L.apron){const ab=hem+(DR?-1:1.2),aw=DR?8.4:7.2,ap=q=>{q.moveTo(-3.6,-39.4);q.lineTo(3.8,-39.4);q.lineTo(4.4,-31);q.quadraticCurveTo(6.6,-30.2,6.4,-29);q.quadraticCurveTo(aw,-18,aw,ab);
      for(let i=0;i<4;i++){const x0=aw-i*aw/2,x1=x0-aw/2;q.quadraticCurveTo((x0+x1)/2,ab+(i%2?1.2:.2),x1,ab+(i===3?0:.4))}
      q.quadraticCurveTo(-aw,-18,-6.2,-29);q.quadraticCurveTo(-6.4,-30.2,-4.2,-31);q.closePath()};
    Kit.solid(g,ap,-aw,-39.4,aw,ab+1,L.apron,{tex:'cloth',texA:.4,rim:'rgba(255,248,230,.6)',lineW:.55});mForm(g,ap,-aw,-39.4,aw,ab+1,.75);
    mLine(g,[[-3.4,-39.2],[-5.6,-45]],darkOf(L.apron,.25),.9,.95);mLine(g,[[3.6,-39.2],[5.8,-45]],darkOf(L.apron,.35),.9,.95);
    g.save();g.beginPath();ap(g);g.clip();for(const x of [-4,0,3.6])mFold(g,[[x*.7,-27],[x,ab]],L.apron,.8);
    const py=DR?-20:-25;g.strokeStyle=mrgb(darkOf(L.apron,.45),.7);g.lineWidth=.5;g.strokeRect(-3,py,5.6,3.8);g.restore()}
  // 허리띠 · 버클 · 주머니
  const bl=q=>{q.moveTo(-7.2,-31.6);q.quadraticCurveTo(0,-30.2,7.2,-31.6);q.lineTo(7.4,-28.8);q.quadraticCurveTo(0,-27.4,-7.4,-28.8);q.closePath()};
  Kit.solid(g,bl,-7.4,-31.6,7.4,-27.4,beltC,{tex:'leather',texA:.5,lineW:.5});
  Kit.solid(g,q=>{q.rect(-1.5,-31.4,3.2,3.2)},-1.5,-31.4,1.7,-28.2,'#c8a050',{rim:'rgba(255,250,220,.9)',lineW:.45});g.fillStyle=mrgb(darkOf(beltC,.3),1);g.fillRect(-.7,-30.6,1.6,1.6);
  if(!DR&&!AR&&!L.apron){const pp=q=>{q.moveTo(-7.4,-29);q.lineTo(-3.6,-29);q.quadraticCurveTo(-3.4,-24.4,-5.4,-24);q.quadraticCurveTo(-7.6,-24.4,-7.4,-29);q.closePath()};Kit.solid(g,pp,-7.6,-29,-3.4,-24,Kit.lit(beltC,.2),{tex:'leather',texA:.5,lineW:.45});g.fillStyle='#c8a050';g.beginPath();g.arc(-5.5,-27.6,.5,0,6.283);g.fill()}
  // 망토 앞자락 (어깨에 걸친 깃 + 고리)
  if(L.cape){for(const sd of [-1,1]){const cl2=q=>{q.moveTo(sd*2.6,-46.2);q.quadraticCurveTo(sd*7.8,-46.6,sd*9.6,-43.4);q.quadraticCurveTo(sd*7,-42.2,sd*2.2,-43.4);q.closePath()};Kit.solid(g,cl2,-9.6,-46.6,9.6,-42.2,L.cape,{tex:'cloth',texA:.4,lineW:.5})}
    g.fillStyle='#d8b860';g.beginPath();g.arc(0,-44.2,1.2,0,6.283);g.fill();g.fillStyle='rgba(255,255,230,.8)';g.fillRect(-.6,-44.9,.6,.6)}
  // ---- 팔 (화면 왼쪽 팔 → 손에 든 것 → 오른쪽 팔) ----
  const sw=st*1.8;let H={x:10.2,y:-27.6};
  if(pr==='book')H={x:7.4,y:-32};else if(pr==='lute')H={x:5.4,y:-31.4};else if(pr==='mug')H={x:10.6,y:-31.4};else if(pr==='bread')H={x:9.6,y:-30};else if(pr==='basket')H={x:10.6,y:-30.6};
  const free=!pr;
  const arm=(sd,hand)=>{const S=[sd*7.4,-43.2],E=[sd*9.6+(hand?(hand.x-sd*10)*.25:sw*sd*.35),-35.6],W=hand?[hand.x-sd*.4,hand.y-1.4]:[sd*9.4+sw*sd*.9,-29.6];
    const c=sd>0?Kit.lit(body,-.16):body,sl=twLimb([S,E,W],[5,4.2,3.6]);
    Kit.solid(g,sl,Math.min(S[0],W[0])-2.6,-45,Math.max(S[0],W[0])+2.6,W[1]+1.8,AR?Kit.lit(metal,-.04):c,{tex:cl,texA:.45,rim:sd<0?rim:'rgba(255,240,214,.35)',lineW:.5});
    mFold(g,[[E[0]-1.4,E[1]-.4],[E[0],E[1]+.6,E[0]+1.4,E[1]-.2]],body,.6);
    // 소매 끝단
    const cx=W[0],cy=W[1];g.fillStyle=AR?mrgb(liteOf(metal,.25),1):mrgb(darkOf(body,.3),1);g.beginPath();g.ellipse(cx,cy,2.1,1.1,(cx-E[0])*.1,0,6.283);g.fill();
    // 손 (엄지 쪽 살짝)
    const hx=hand?hand.x:sd*9.4+sw*sd,hy=hand?hand.y:-27.4,hn=q=>{q.ellipse(hx,hy,1.8,2.2,-sd*.15,0,6.283)};
    Kit.solid(g,hn,hx-1.8,hy-2.2,hx+1.8,hy+2.2,sk,{rim:'rgba(255,240,220,.7)',lineW:.5});g.strokeStyle=mrgb(darkOf(sk,.45),.7);g.lineWidth=.45;g.beginPath();g.moveTo(hx-sd*.4,hy-1.2);g.quadraticCurveTo(hx+sd*1.4,hy-.6,hx+sd*.9,hy+.8);g.stroke();
    if(AR){// 어깨 보호대: 두 겹 판
      for(let i=1;i>=0;i--){const py=-44.6+i*2.4,pp=q=>{q.ellipse(sd*8.2,py,4.6-i*.6,3.2-i*.4,sd*.25,Math.PI*1.02,Math.PI*2.06);q.closePath()};Kit.solid(g,pp,sd*8.2-4.6,py-3.4,sd*8.2+4.6,py+.6,metal,{tex:'metal',texA:.55,rim:'rgba(255,255,255,.95)',lineW:.5})}
      g.fillStyle='rgba(255,255,240,.85)';g.beginPath();g.arc(sd*8.6,-46.2,.45,0,6.283);g.fill()}};
  arm(-1,null);
  const hx=H.x,hy=H.y,wd='#6a4a2c';
  const shaft=(x0,y0,x1,y1,w,c)=>{const sp=twLimb([[x0,y0],[x1,y1]],[w,w]);Kit.solid(g,sp,Math.min(x0,x1)-w,Math.min(y0,y1),Math.max(x0,x1)+w,Math.max(y0,y1),c,{tex:'wood',texA:.6,lineW:.45})};
  // 긴 자루 소품: 손 뒤에 그린다
  if(pr==='pitchfork'){shaft(hx-.6,-1.6,hx+.4,-64,1.8,wd);const fk=q=>{q.moveTo(hx-4,-63.4);q.quadraticCurveTo(hx+.4,-65.6,hx+4.6,-63.4);q.lineTo(hx+4.6,-62.2);q.quadraticCurveTo(hx+.4,-64.2,hx-4,-62.2);q.closePath()};Kit.solid(g,fk,hx-4,-65.6,hx+4.6,-62.2,'#8a8a92',{rim:'rgba(255,255,255,.9)',lineW:.4});
    for(const x of [-3.6,.4,4.2]){g.strokeStyle='#3a3a40';g.lineWidth=1.3;g.lineCap='round';g.beginPath();g.moveTo(hx+x,-63);g.quadraticCurveTo(hx+x*1.08,-69,hx+x*.9,-74);g.stroke();g.strokeStyle='#c8c8d0';g.lineWidth=.6;g.beginPath();g.moveTo(hx+x-.2,-63.4);g.quadraticCurveTo(hx+x*1.08-.2,-69,hx+x*.9-.2,-73.4);g.stroke()}}
  else if(pr==='spear'){shaft(hx-.4,-2,hx+.3,-76,1.7,'#5a3a22');
    const bd=q=>{q.moveTo(hx+.3,-88.4);q.quadraticCurveTo(hx+3.2,-82,hx+1.6,-77.4);q.lineTo(hx-1,-77.4);q.quadraticCurveTo(hx-2.6,-82,hx+.3,-88.4);q.closePath()};Kit.solid(g,bd,hx-2.6,-88.4,hx+3.2,-77.4,'#c8c8d0',{tex:'metal',texA:.5,rim:'rgba(255,255,255,.95)',lineW:.5});
    g.strokeStyle='rgba(60,60,70,.7)';g.lineWidth=.45;g.beginPath();g.moveTo(hx+.3,-87);g.lineTo(hx+.3,-78.4);g.stroke();
    Kit.solid(g,q=>q.rect(hx-1.3,-77.6,3.2,2.4),hx-1.3,-77.6,hx+1.9,-75.2,'#8a6a3a',{lineW:.4});g.fillStyle=L.tabard||'#8a2a2a';g.beginPath();g.moveTo(hx+.6,-75);g.quadraticCurveTo(hx+4,-73,hx+3.4,-69);g.lineTo(hx+1.8,-71.4);g.lineTo(hx+.6,-69.6);g.closePath();g.fill()}
  else if(pr==='staff'){const sp=q=>{q.moveTo(hx-1.2,-1.6);q.quadraticCurveTo(hx-.4,-30,hx-1.4,-48);q.quadraticCurveTo(hx-.2,-58,hx-1.6,-64);q.lineTo(hx+1,-64.4);q.quadraticCurveTo(hx+1.8,-58,hx+1.4,-48);q.quadraticCurveTo(hx+1.6,-30,hx+1.1,-1.6);q.closePath()};
    Kit.solid(g,sp,hx-1.6,-64.4,hx+1.8,-1.6,'#5e3f22',{tex:'wood',texA:.6,lineW:.45});
    g.strokeStyle='#5e3f22';g.lineWidth=1.6;g.lineCap='round';g.beginPath();g.moveTo(hx-1,-64);g.quadraticCurveTo(hx-4.6,-69,hx-1.4,-72.4);g.moveTo(hx+.8,-64);g.quadraticCurveTo(hx+4.4,-69,hx+1.6,-72.4);g.stroke();
    const gm=L.gem||'#b9a2ff',gg=g.createRadialGradient(hx,-68.6,0,hx,-68.6,6.4);gg.addColorStop(0,mrgb(gm,.5));gg.addColorStop(1,mrgb(gm,0));g.fillStyle=gg;g.fillRect(hx-7,-75,14,13);
    Kit.solid(g,q=>q.arc(hx,-68.6,2.9,0,6.283),hx-2.9,-71.5,hx+2.9,-65.7,gm,{rim:'rgba(255,255,255,.95)',lineW:.5});g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(hx-1,-69.6,.8,0,6.283);g.fill();
    g.strokeStyle=mrgb(darkOf('#5e3f22',.4),.8);g.lineWidth=.6;for(const y of [-30,-31.4])g.beginPath(),g.moveTo(hx-1.4,y),g.lineTo(hx+1.4,y+.4),g.stroke()}
  else if(pr==='hammer'){// 대장장이 망치: 손에 늘어뜨려 쥔다 (머리가 아래)
    shaft(hx+.2,hy-2.6,hx+1,hy+10.4,1.7,'#5a3a22');const y0=hy+10,hm=q=>{q.moveTo(hx-3.4,y0);q.lineTo(hx+5.4,y0);q.lineTo(hx+5.9,y0+.7);q.lineTo(hx+5.9,y0+3.9);q.lineTo(hx+5.4,y0+4.6);q.lineTo(hx-3.4,y0+4.6);q.quadraticCurveTo(hx-4.2,y0+2.3,hx-3.4,y0);q.closePath()};
    Kit.solid(g,hm,hx-4.2,y0,hx+5.9,y0+4.6,'#5a5a62',{tex:'metal',texA:.6,rim:'rgba(255,255,255,.9)',lineW:.5});mForm(g,hm,hx-4.2,y0,hx+5.9,y0+4.6,.7);g.fillStyle='rgba(255,255,255,.5)';g.fillRect(hx+5,y0+.8,.7,3);g.fillStyle='rgba(20,20,26,.45)';g.fillRect(hx-3.4,y0+3.6,8.8,1)}
  else if(pr==='rod'){g.lineCap='round';g.strokeStyle='#3a2a1a';g.lineWidth=2;g.beginPath();g.moveTo(hx-1.4,-22.6);g.quadraticCurveTo(hx+7,-50,hx+12.6,-78);g.stroke();g.strokeStyle='#8a6a3c';g.lineWidth=1.1;g.beginPath();g.moveTo(hx-1.4,-22.6);g.quadraticCurveTo(hx+7,-50,hx+12.6,-78);g.stroke();
    g.strokeStyle='rgba(230,230,220,.65)';g.lineWidth=.4;g.beginPath();g.moveTo(hx+12.6,-78);g.quadraticCurveTo(hx+13.6,-60,hx+12.8,-44);g.stroke();g.fillStyle='#d84a3a';g.beginPath();g.ellipse(hx+12.8,-43,1,1.5,0,0,6.283);g.fill();g.fillStyle='#f0e8d8';g.fillRect(hx+11.8,-43.2,2,.6);
    Kit.solid(g,q=>q.arc(hx+1.8,-33.6,1.6,0,6.283),hx,-35.2,hx+3.4,-32,'#8a8a92',{lineW:.4})}
  else if(pr==='broom'){shaft(hx-1.2,-9,hx+.4,-56,1.7,wd);const bb=q=>{q.moveTo(hx-2.2,-10.6);q.lineTo(hx+1.4,-10.6);q.quadraticCurveTo(hx+4.6,-5,hx+5.4,-.6);q.quadraticCurveTo(hx-.6,.4,hx-6.6,-.6);q.quadraticCurveTo(hx-5,-5,hx-2.2,-10.6);q.closePath()};
    Kit.solid(g,bb,hx-6.6,-10.6,hx+5.4,.4,'#c8a860',{tex:'wood',texA:.5,lineW:.45});g.save();g.beginPath();bb(g);g.clip();g.strokeStyle='rgba(90,60,20,.5)';g.lineWidth=.4;for(let i=0;i<7;i++){const x=hx-5.6+i*1.7;g.beginPath();g.moveTo(hx-.4+(x-hx)*.25,-10);g.lineTo(x,0);g.stroke()}g.restore();
    g.fillStyle='#8a3a2a';g.fillRect(hx-2.4,-9.4,4,1.2)}
  else if(pr==='lute'){g.save();g.translate(hx-5.2,-29.4);g.rotate(-.75);
    Kit.solid(g,q=>q.rect(-1.1,-17.6,2.2,12),-1.1,-17.6,1.1,-5.6,'#4a3220',{lineW:.4});Kit.solid(g,q=>{q.moveTo(-1.6,-17.4);q.lineTo(1.6,-17.4);q.lineTo(2.2,-21.2);q.lineTo(-1.8,-21.2);q.closePath()},-1.8,-21.2,2.2,-17.4,'#5a3a22',{lineW:.4});
    const lb=q=>{q.moveTo(0,-7.6);q.bezierCurveTo(5.4,-6.8,6.2,4.6,0,5.4);q.bezierCurveTo(-6.2,4.6,-5.4,-6.8,0,-7.6);q.closePath()};Kit.solid(g,lb,-5.8,-7.6,5.8,5.4,'#b8804a',{tex:'wood',texA:.5,rim:'rgba(255,240,200,.8)',lineW:.5});mForm(g,lb,-5.8,-7.6,5.8,5.4,.8);
    g.fillStyle='#2a1a10';g.beginPath();g.arc(0,-1.6,1.5,0,6.283);g.fill();g.fillStyle='#4a3220';g.fillRect(-2,2.4,4,1);g.strokeStyle='rgba(240,230,210,.7)';g.lineWidth=.25;for(const x of [-.6,0,.6]){g.beginPath();g.moveTo(x,-20);g.lineTo(x,2.6);g.stroke()}g.restore()}
  // 바구니: 손잡이를 손이 쥔다
  if(pr==='basket'){const bx=10.8,by=-22.2,bk=q=>{q.moveTo(bx-6,by-3.4);q.lineTo(bx+6,by-3.4);q.quadraticCurveTo(bx+5.6,by+3.6,bx+3.8,by+4.4);q.lineTo(bx-3.8,by+4.4);q.quadraticCurveTo(bx-5.6,by+3.6,bx-6,by-3.4);q.closePath()};
    g.strokeStyle='#5a3a1a';g.lineWidth=1.6;g.beginPath();g.moveTo(bx-4.8,by-3.4);g.quadraticCurveTo(bx,by-11.6,bx+4.8,by-3.4);g.stroke();g.strokeStyle='#b8905a';g.lineWidth=.7;g.beginPath();g.moveTo(bx-4.8,by-3.6);g.quadraticCurveTo(bx,by-11.6,bx+4.8,by-3.6);g.stroke();
    for(const [x,y,r,c] of [[-2.6,-3.8,2.2,'#c8904a'],[1.2,-4.4,2,'#c83a2a'],[3.6,-3.6,1.8,'#7a9a3a'],[-.4,-3.2,1.6,'#d8a050']]){Kit.solid(g,q=>q.arc(bx+x,by+y,r,0,6.283),bx+x-r,by+y-r,bx+x+r,by+y+r,c,{lineW:.4})}
    Kit.solid(g,bk,bx-6,by-3.4,bx+6,by+4.4,'#a8804a',{tex:'wood',texA:.6,rim:'rgba(255,240,200,.7)',lineW:.5});g.save();g.beginPath();bk(g);g.clip();g.strokeStyle='rgba(80,50,20,.55)';g.lineWidth=.5;for(let y=by-2;y<by+4.4;y+=1.6){g.beginPath();g.moveTo(bx-6,y);g.lineTo(bx+6,y);g.stroke()}for(let x=bx-5;x<bx+6;x+=2){g.beginPath();g.moveTo(x,by-3.4);g.lineTo(x+.3,by+4.4);g.stroke()}g.restore();
    g.fillStyle='#8a6a3a';g.fillRect(bx-6.2,by-4,12.4,1.2)}
  // 오른팔 (손이 자루를 쥔다)
  arm(1,free?null:H);
  // 손에 든 물건: 손 앞에 그린다
  // 칼: 팔 앞에 살짝 바깥으로 기울여 들고, 손을 손잡이 위에 다시 얹는다
  if(pr==='sword'){g.save();g.translate(hx,hy);g.rotate(.18);g.translate(-hx,-hy);Kit.solid(g,q=>{q.moveTo(hx-1.1,hy-2.6);q.lineTo(hx-1.1,hy-22.6);q.lineTo(hx+.1,hy-25.4);q.lineTo(hx+1.3,hy-22.6);q.lineTo(hx+1.3,hy-2.6);q.closePath()},hx-1.1,hy-25.4,hx+1.3,hy-2.6,'#c8c8d0',{tex:'metal',texA:.5,rim:'rgba(255,255,255,1)',lineW:.45});
    g.fillStyle='rgba(70,70,84,.6)';g.fillRect(hx-.05,hy-21,.4,17);
    Kit.solid(g,q=>{q.moveTo(hx-3.8,hy-2.6);q.quadraticCurveTo(hx,hy-1.6,hx+4,hy-2.6);q.lineTo(hx+4,hy-1.2);q.quadraticCurveTo(hx,hy-.4,hx-3.8,hy-1.2);q.closePath()},hx-3.8,hy-2.6,hx+4,hy-.4,'#d8b860',{rim:'rgba(255,255,230,.9)',lineW:.45});
    Kit.solid(g,q=>q.rect(hx-.8,hy-1,1.8,4.6),hx-.8,hy-1,hx+1,hy+3.6,'#4a3220',{lineW:.4});g.fillStyle='#d8b860';g.beginPath();g.arc(hx+.1,hy+4.4,1.2,0,6.283);g.fill();g.restore();Kit.solid(g,q=>q.ellipse(hx,hy,1.8,2.2,-.15,0,6.283),hx-1.8,hy-2.2,hx+1.8,hy+2.2,sk,{rim:'rgba(255,240,220,.7)',lineW:.5})}
  else if(pr==='book'){const bk=q=>{q.moveTo(hx-5.2,-35.6);q.lineTo(hx+2.4,-36.4);q.lineTo(hx+2.8,-26.6);q.lineTo(hx-4.8,-25.8);q.closePath()};
    g.fillStyle='#ece2c8';g.beginPath();g.moveTo(hx+2.4,-36.4);g.lineTo(hx+3.6,-35.8);g.lineTo(hx+4,-26.2);g.lineTo(hx+2.8,-26.6);g.closePath();g.fill();
    Kit.solid(g,bk,hx-5.2,-36.4,hx+2.8,-25.8,'#7a2a2a',{tex:'leather',texA:.5,rim:'rgba(255,230,200,.7)',lineW:.5});
    g.strokeStyle='#d8b860';g.lineWidth=.5;g.beginPath();g.moveTo(hx-3.8,-34.2);g.lineTo(hx+1.2,-34.8);g.lineTo(hx+1.6,-27.6);g.lineTo(hx-3.4,-27);g.closePath();g.stroke();g.fillStyle='#d8b860';g.beginPath();g.arc(hx-1.1,-31,1,0,6.283);g.fill();
    Kit.solid(g,q=>q.ellipse(hx+2.6,-30.6,1.9,2.2,0,0,6.283),hx+.7,-32.8,hx+4.5,-28.4,sk,{lineW:.45})}
  else if(pr==='mug'){const mx=hx+.6,my=hy-1.4,mg=q=>{q.moveTo(mx-2.4,my-3.6);q.lineTo(mx+2.6,my-3.6);q.lineTo(mx+2.8,my+3.2);q.lineTo(mx-2.6,my+3.2);q.closePath()};
    g.strokeStyle='#5a3a1a';g.lineWidth=1.3;g.beginPath();g.arc(mx+3,my,1.9,-1.4,1.4);g.stroke();
    Kit.solid(g,mg,mx-2.6,my-3.6,mx+2.8,my+3.2,'#a87a4a',{tex:'wood',texA:.6,lineW:.45});g.fillStyle='#8a8a92';g.fillRect(mx-2.6,my-2.6,5.4,.8);g.fillRect(mx-2.7,my+1.8,5.5,.8);
    g.fillStyle='#f4ecd8';g.beginPath();g.ellipse(mx+.1,my-3.8,2.9,1.2,0,0,6.283);g.arc(mx-1.4,my-4.4,1.1,0,6.283);g.arc(mx+1.2,my-4.6,1.2,0,6.283);g.fill();
    Kit.solid(g,q=>q.ellipse(mx-1.8,my+.2,1.6,2,0,0,6.283),mx-3.4,my-1.8,mx-.2,my+2.2,sk,{lineW:.4})}
  else if(pr==='bread'){const br=q=>{q.ellipse(hx+.4,hy-1.6,6,2.6,-.35,0,6.283)};Kit.solid(g,br,hx-5.6,hy-4.2,hx+6.4,hy+1,'#c8904a',{rim:'rgba(255,240,200,.9)',lineW:.5});mForm(g,br,hx-5.6,hy-4.2,hx+6.4,hy+1,.7);
    g.strokeStyle='rgba(255,236,190,.85)';g.lineWidth=.6;for(const x of [-2.8,0,2.8]){g.beginPath();g.moveTo(hx+x-.8,hy-2.2+x*.3);g.lineTo(hx+x+.8,hy-3.4+x*.3);g.stroke()}
    Kit.solid(g,q=>q.ellipse(hx+1.4,hy-.6,1.9,2.1,0,0,6.283),hx-.5,hy-2.7,hx+3.3,hy+1.5,sk,{lineW:.4})}
  // ---- 목 · 머리 ----
  g.save();headT();
  const neck=q=>{q.moveTo(-2,-49);q.lineTo(2.6,-49);q.lineTo(2.8,-45.2);q.quadraticCurveTo(.4,-44.2,-2.2,-45.2);q.closePath()};Kit.solid(g,neck,-2.2,-49,2.8,-44.2,Kit.lit(sk,-.12),{lineW:.45});
  g.fillStyle=mrgb(darkOf(sk,.5),.45);g.beginPath();g.ellipse(.6,-47.6,2.8,1.2,0,0,6.283);g.fill();
  const hd=q=>{q.moveTo(.8,hy0-6.4);q.bezierCurveTo(4.6,hy0-6.4,6.4,hy0-3.4,6.2,hy0+.4);q.bezierCurveTo(6,hy0+3.6,4.6,hy0+6,1.8,hy0+6.6);q.bezierCurveTo(-.6,hy0+7,-3.4,hy0+5,-4.6,hy0+2);q.bezierCurveTo(-5.4,hy0-1,-4.8,hy0-6.4,.8,hy0-6.4);q.closePath()};
  Kit.solid(g,hd,-5.4,hy0-6.4,6.4,hy0+7,sk,{rim:'rgba(255,242,224,.8)',lineW:.55});mForm(g,hd,-5.4,hy0-6.4,6.4,hy0+7,.8,.6,.3);
  // 귀
  if(hs!==1&&ht!==3&&ht!==6){const er=q=>{q.ellipse(-4.4,hy0+.8,1.3,2,.15,0,6.283)};Kit.solid(g,er,-5.7,hy0-1.2,-3.1,hy0+2.8,Kit.lit(sk,-.08),{lineW:.45});g.fillStyle=mrgb(darkOf(sk,.5),.55);g.beginPath();g.ellipse(-4.3,hy0+.9,.5,1,.15,0,6.283);g.fill()}
  // 얼굴: 눈썹 · 눈 · 코 · 입 · 볼
  const fx=2.6,ey=hy0+.4,brow=mrgb(darkOf(hair,.35),.95);
  for(const [x,rx] of [[fx-2.3,.95],[fx+2.1,.8]]){g.fillStyle='rgba(250,244,232,.95)';g.beginPath();g.ellipse(x,ey,rx*1.2,.75,0,0,6.283);g.fill();g.fillStyle='#2a1a14';g.beginPath();g.ellipse(x+.25,ey,rx*.62,.95,0,0,6.283);g.fill();
    g.fillStyle='rgba(255,255,255,.95)';g.fillRect(x-.05,ey-.6,.42,.42);g.strokeStyle=mrgb(darkOf(sk,.6),.85);g.lineWidth=.42;g.beginPath();g.moveTo(x-rx*1.2,ey-.4);g.quadraticCurveTo(x,ey-1.2,x+rx*1.2,ey-.5);g.stroke();
    g.strokeStyle=brow;g.lineWidth=CH?.5:.62;g.beginPath();g.moveTo(x-rx*1.2,ey-1.9+(x<fx?.15:0));g.quadraticCurveTo(x,ey-2.6,x+rx*1.3,ey-2.1);g.stroke()}
  g.strokeStyle=mrgb(darkOf(sk,.5),.75);g.lineWidth=.5;g.beginPath();g.moveTo(fx+.4,ey+.6);g.quadraticCurveTo(fx+1.5,ey+2.4,fx+1,ey+2.9);g.lineTo(fx-.2,ey+3);g.stroke();g.fillStyle='rgba(255,246,230,.55)';g.fillRect(fx+.1,ey+1,.5,1.2);
  g.fillStyle='rgba(200,90,70,.22)';g.beginPath();g.ellipse(fx-2.6,ey+2.6,1.6,.9,0,0,6.283);g.ellipse(fx+3,ey+2.4,1,.8,0,0,6.283);g.fill();
  if(hs!==3){g.strokeStyle=mrgb(Kit.mix(darkOf(sk,.5),'#8a2a2a',.35),.85);g.lineWidth=.5;g.beginPath();g.moveTo(fx-1.1,ey+4.3);g.quadraticCurveTo(fx+.1,ey+4.9,fx+1.2,ey+4.2);g.stroke()}
  // ---- 머리 모양 ----
  if(hs===3){// 대머리 + 수염: 옆머리 · 턱수염 · 콧수염
    g.fillStyle=Kit.lit(hair,-.1);g.beginPath();g.moveTo(-5.2,hy0-2.4);g.quadraticCurveTo(-6.2,hy0+1,-4.6,hy0+3.4);g.lineTo(-3.4,hy0+1);g.quadraticCurveTo(-3.6,hy0-1.4,-2.6,hy0-2.8);g.closePath();g.fill();
    const bd=q=>{q.moveTo(-3.6,hy0+1.2);q.quadraticCurveTo(-3.2,hy0+8.6,2.4,hy0+10);q.quadraticCurveTo(6.4,hy0+7.6,6,hy0+2.2);q.lineTo(5,hy0+3.6);q.quadraticCurveTo(fx+1.4,hy0+5.8,fx,hy0+5.6);q.quadraticCurveTo(fx-1.6,hy0+5.8,-1.6,hy0+3.8);q.quadraticCurveTo(-2.6,hy0+2.6,-3.6,hy0+1.2);q.closePath()};
    Kit.solid(g,bd,-3.6,hy0+1,6.4,hy0+10,hair,{lineW:.5});twStrands(g,bd,hair,-2.6,hy0+2,5,hy0+10,6,17);
    const ms=q=>{q.moveTo(fx-2.8,hy0+5);q.quadraticCurveTo(fx,hy0+2.6,fx+2.8,hy0+4.6);q.quadraticCurveTo(fx+.4,hy0+4.4,fx,hy0+4.2);q.quadraticCurveTo(fx-.6,hy0+4.4,fx-2.8,hy0+5);q.closePath()};Kit.solid(g,ms,fx-2.8,hy0+2.6,fx+2.8,hy0+5,Kit.lit(hair,-.12),{lineW:.4});
    if(ht===0){g.fillStyle='rgba(255,250,236,.4)';g.beginPath();g.ellipse(-.4,hy0-4.4,2.4,1.1,-.4,0,6.283);g.fill()}}
  else{const fr=hs===2?q=>{q.moveTo(-4.8,hy0+1.4);q.quadraticCurveTo(-6.4,hy0-7.6,1,hy0-7.4);q.quadraticCurveTo(6.8,hy0-7,6.4,hy0-1.6);q.quadraticCurveTo(4,hy0-4.6,1,hy0-4.2);q.quadraticCurveTo(-2.4,hy0-4,-3.4,hy0+1);q.closePath()}
      :q=>{q.moveTo(-4.8,hy0+(hs===1?5.6:1.6));q.quadraticCurveTo(-6.6,hy0-7.6,1,hy0-7.4);q.quadraticCurveTo(7,hy0-7,6.6,hy0-1.2);q.lineTo(5.6,hy0-2.8);q.lineTo(4.8,hy0-1.6);q.lineTo(3.6,hy0-3.4);q.lineTo(2,hy0-2.2);q.lineTo(.6,hy0-3.8);q.lineTo(-1,hy0-2.6);q.quadraticCurveTo(-2.6,hy0-3.4,-3.2,hy0-.6);q.quadraticCurveTo(-3.6,hy0+(hs===1?4:1.4),-3.8,hy0+(hs===1?6.4:2.6));q.closePath()};
    if(hs===2){const bn=q=>q.arc(-3.2,hy0-7,3.3,0,6.283);Kit.solid(g,bn,-6.5,hy0-10.3,.1,hy0-3.7,hair,{lineW:.5});twStrands(g,bn,hair,-5.6,hy0-10,-.6,hy0-4,4,19)}
    Kit.solid(g,fr,-6.6,hy0-7.6,7,hy0+3,hair,{rim:'rgba(255,240,210,.55)',lineW:.5});twStrands(g,fr,hair,-5.6,hy0-7.6,6.4,hy0+1,8,23);
    g.fillStyle='rgba(255,244,220,.28)';g.beginPath();g.ellipse(-.6,hy0-5.6,2.8,1,-.25,0,6.283);g.fill();
    if(hs===1){// 앞으로 흘러내린 옆머리
      const lk=q=>{q.moveTo(-4.6,hy0-1);q.quadraticCurveTo(-6.6,hy0+6,-5.6,hy0+10.4);q.quadraticCurveTo(-4.4,hy0+8,-3.4,hy0+2);q.closePath()};Kit.solid(g,lk,-6.6,hy0-1,-3.4,hy0+10.4,hair,{lineW:.45})}}
  // ---- 모자 ----
  const hb=hy0-4.4;
  if(ht===1){// 밀짚모자: 넓은 챙 · 둥근 꼭대기 · 띠 · 짚 결
    const br=q=>q.ellipse(.8,hb,11.6,3.4,-.05,0,6.283),cr=q=>{q.moveTo(-5,hb);q.bezierCurveTo(-5.4,hb-8.6,6.8,hb-8.6,6.6,hb);q.quadraticCurveTo(.8,hb+1.4,-5,hb);q.closePath()};
    Kit.solid(g,br,-10.8,hb-3.4,12.4,hb+3.4,hc,{tex:'wood',texA:.45,rim:'rgba(255,248,220,.9)',lineW:.55});g.strokeStyle=mrgb(darkOf(hc,.35),.6);g.lineWidth=.4;g.beginPath();g.ellipse(.8,hb,9.6,2.6,-.05,0,6.283);g.stroke();
    Kit.solid(g,cr,-5.4,hb-8.4,6.8,hb+1.4,hc,{tex:'wood',texA:.45,rim:'rgba(255,248,220,.9)',lineW:.55});mForm(g,cr,-5.4,hb-8.4,6.8,hb+1.4,.7);
    g.fillStyle='#8a3a2a';g.beginPath();g.moveTo(-5.2,hb-1.8);g.quadraticCurveTo(.8,hb-.6,6.7,hb-1.8);g.lineTo(6.6,hb-.2);g.quadraticCurveTo(.8,hb+1.2,-5,hb-.2);g.closePath();g.fill()}
  else if(ht===2){// 천 모자: 부푼 정수리 + 앞 챙
    const cp=q=>{q.moveTo(-5.8,hb+1.4);q.bezierCurveTo(-7.6,hb-7.4,6,hb-8.4,7.2,hb+.4);q.quadraticCurveTo(.6,hb-1.2,-5.8,hb+1.4);q.closePath()},vz=q=>{q.moveTo(2.4,hb+.2);q.quadraticCurveTo(8.4,hb-1.4,10.2,hb+1.6);q.quadraticCurveTo(7.2,hb+2.4,2.6,hb+1.8);q.closePath()};
    Kit.solid(g,cp,-7.6,hb-8.2,7.4,hb+1.6,hc,{tex:'cloth',texA:.45,rim,lineW:.55});mForm(g,cp,-7.6,hb-8.2,7.4,hb+1.6,.8);mFold(g,[[-2,hb-5.4],[-.4,hb-2.2,1.4,hb]],hc,.7);
    Kit.solid(g,vz,2.4,hb-1.4,10.2,hb+2.4,Kit.lit(hc,-.2),{lineW:.5});g.fillStyle=Kit.lit(hc,.3);g.beginPath();g.arc(-.4,hb-6.8,1,0,6.283);g.fill()}
  else if(ht===3){// 두건: 얼굴 둘레 테 (얼굴 자리는 비운다)
    const hd2=q=>{q.ellipse(.6,hy0-.6,7.6,8.6,0,0,6.283);q.moveTo(7.2,hy0+1);q.ellipse(2,hy0+1.2,5.2,6.4,0,Math.PI*2,0,true)};
    Kit.solid(g,hd2,-7,hy0-9.2,8.2,hy0+8,hc,{tex:'cloth',texA:.45,rim,lineW:.55});mForm(g,hd2,-7,hy0-9.2,8.2,hy0+8,.9);
    g.save();g.beginPath();g.ellipse(2,hy0+1.2,5.2,6.4,0,0,6.283);g.clip();g.fillStyle='rgba(30,16,10,.32)';g.beginPath();g.ellipse(2,hy0-5.4,7,3.4,0,0,6.283);g.fill();g.restore();
    mFold(g,[[-5,hy0-4],[-6,hy0+2,-4.6,hy0+7]],hc,.7)}
  else if(ht===4){// 투구: 둥근 철모 · 챙 · 코 가리개 · 리벳
    const hm=q=>{q.moveTo(-6.2,hb+2.2);q.bezierCurveTo(-6.8,hb-8,8.2,hb-8,7.6,hb+2.2);q.quadraticCurveTo(.8,hb+.6,-6.2,hb+2.2);q.closePath()};
    Kit.solid(g,hm,-6.8,hb-7.6,8.2,hb+2.2,'#9a9aa2',{tex:'metal',texA:.6,rim:'rgba(255,255,255,.95)',lineW:.55});mForm(g,hm,-6.8,hb-7.6,8.2,hb+2.2,.9);
    const rm=q=>{q.moveTo(-6.8,hb+1.4);q.quadraticCurveTo(.8,hb-.4,8.4,hb+1.4);q.lineTo(8.6,hb+2.8);q.quadraticCurveTo(.8,hb+1.2,-6.8,hb+2.9);q.closePath()};Kit.solid(g,rm,-6.8,hb-.4,8.6,hb+2.9,'#7a7a84',{rim:'rgba(255,255,255,.9)',lineW:.5});
    Kit.solid(g,q=>{q.moveTo(fx+.6,hb+1.6);q.lineTo(fx+1.8,hb+1.6);q.lineTo(fx+1.6,hy0+2.4);q.lineTo(fx+.9,hy0+2.8);q.closePath()},fx+.6,hb+1.6,fx+1.8,hy0+2.8,'#8a8a94',{rim:'rgba(255,255,255,.9)',lineW:.4});
    g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.moveTo(-1.4,hb-6.6);g.quadraticCurveTo(.6,hb-7.4,2.6,hb-6.4);g.lineTo(2,hb-5.6);g.quadraticCurveTo(.6,hb-6.4,-1,hb-5.8);g.closePath();g.fill();
    g.fillStyle='#d8d8e0';for(const x of [-4.4,-1,2.6,6]){g.beginPath();g.arc(x,hb+1.4-(x>0?.2:0),.42,0,6.283);g.fill()}
    Kit.solid(g,q=>{q.moveTo(-.2,hb-6.4);q.lineTo(.6,hb-9.6);q.lineTo(1.4,hb-6.4);q.closePath()},-.2,hb-9.6,1.4,hb-6.4,'#c8c8d0',{lineW:.4})}
  else if(ht===5){// 고깔모자: 챙 · 뒤로 휜 원뿔 · 금띠
    const br=q=>q.ellipse(.8,hb,11.4,3.4,-.05,0,6.283),cn=q=>{q.moveTo(-5.4,hb);q.bezierCurveTo(-4.8,hb-9,-2.6,hb-15,-7,hb-22.4);q.quadraticCurveTo(-5.6,hb-23.6,-4.6,hb-22.2);q.bezierCurveTo(1.6,hb-16,5.2,hb-9,6.8,hb);q.quadraticCurveTo(.8,hb+1.4,-5.4,hb);q.closePath()};
    Kit.solid(g,br,-10.6,hb-3.4,12.2,hb+3.4,hc,{tex:'cloth',texA:.45,rim,lineW:.55});Kit.solid(g,cn,-7,hb-23.6,6.8,hb+1.4,hc,{tex:'cloth',texA:.45,rim,lineW:.55});mForm(g,cn,-7,hb-23.6,6.8,hb+1.4,.9);
    mFold(g,[[-1.6,hb-4],[-2.4,hb-12,-4.8,hb-18]],hc,.8);
    g.save();g.beginPath();cn(g);g.clip();g.fillStyle='#d8b860';g.beginPath();g.moveTo(-5.6,hb-1.6);g.quadraticCurveTo(.8,hb-.2,7,hb-1.6);g.lineTo(6.6,hb-3.6);g.quadraticCurveTo(.8,hb-2.2,-5.2,hb-3.6);g.closePath();g.fill();g.restore();
    g.fillStyle='#f0d890';g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?.6:1.6;g.lineTo(1.2+Math.cos(a)*r,hb-8+Math.sin(a)*r)}g.closePath();g.fill()}
  else if(ht===6){// 머릿수건: 정수리를 감싸고 뒤에서 묶는다
    const kc=q=>{q.moveTo(-5.4,hy0+1.6);q.bezierCurveTo(-7.6,hb-6.6,6.6,hb-7.8,7,hb+2.2);q.quadraticCurveTo(4,hb-.2,1,hb+.4);q.quadraticCurveTo(-2.4,hb+1,-3.6,hy0+1.4);q.closePath()};
    Kit.solid(g,kc,-7.6,hb-7.2,7,hy0+1.6,hc,{tex:'cloth',texA:.45,rim,lineW:.55});mForm(g,kc,-7.6,hb-7.2,7,hy0+1.6,.85);
    mFold(g,[[-3.6,hb-3.6],[-1,hb-2,2.4,hb-3.8]],hc,.7);mFold(g,[[-4.6,hb-.4],[-3,hb+1.6]],hc,.6);
    g.fillStyle=Kit.lit(hc,-.12);g.beginPath();g.ellipse(-5.4,hb+1.8,1.6,1.2,.4,0,6.283);g.fill();
    if(hs!==3){g.fillStyle=hair;g.beginPath();g.moveTo(1,hb+.6);g.quadraticCurveTo(4,hb+.2,6.6,hb+2.6);g.quadraticCurveTo(4,hb+1.6,1,hb+1.8);g.closePath();g.fill()}}
  else if(ht===7){// 주교관: 뾰족한 관 + 금 십자 띠
    const mt=q=>{q.moveTo(-5.4,hb+.6);q.quadraticCurveTo(-6.2,hb-9,-.2,hb-16.6);q.lineTo(.8,hb-14.6);q.lineTo(1.8,hb-16.6);q.quadraticCurveTo(7.8,hb-9,7,hb+.6);q.quadraticCurveTo(.8,hb+2,-5.4,hb+.6);q.closePath()};
    Kit.solid(g,mt,-6.2,hb-16.6,7.8,hb+2,hc,{tex:'cloth',texA:.4,rim:'rgba(255,255,255,.85)',lineW:.55});mForm(g,mt,-6.2,hb-16.6,7.8,hb+2,.7);
    g.save();g.beginPath();mt(g);g.clip();g.fillStyle='#d8b860';g.fillRect(.1,hb-16,1.4,17);g.fillRect(-6,hb-1.2,14,1.8);g.fillRect(-2.4,hb-10.4,6.4,1.3);g.restore()}
  else if(ht===8){// 흰 두건 모자 (빵 굽는 이)
    const ck=q=>{q.moveTo(-5.4,hb+1);q.bezierCurveTo(-8.6,hb-3,-6.4,hb-11.4,-1.4,hb-9.6);q.bezierCurveTo(1,hb-12.6,7,hb-11.4,6.4,hb-7.4);q.bezierCurveTo(9,hb-4.6,8,hb,7,hb+1);q.quadraticCurveTo(.8,hb+2,-5.4,hb+1);q.closePath()};
    Kit.solid(g,ck,-8.4,hb-11.8,8.6,hb+2,'#f4f0e8',{tex:'cloth',texA:.35,rim:'rgba(255,255,255,.9)',lineW:.55});mForm(g,ck,-8.4,hb-11.8,8.6,hb+2,.6);
    mFold(g,[[-1.4,hb-9],[-.4,hb-4]],'#e8e2d6',.7);mFold(g,[[3.4,hb-9.6],[3,hb-4.4]],'#e8e2d6',.7);
    Kit.solid(g,q=>{q.moveTo(-5.6,hb-1.4);q.quadraticCurveTo(.8,hb,7.2,hb-1.4);q.lineTo(7,hb+1);q.quadraticCurveTo(.8,hb+2.2,-5.4,hb+1);q.closePath()},-5.6,hb-1.4,7.2,hb+2.2,'#e8e2d6',{lineW:.45})}
  g.restore();
  g.restore();
  // 짙은 윤곽선 (주인공 · 몬스터와 같은 테두리), 그다음 바닥 그림자를 뒤에 깐다
  mInk(g,'rgba(22,13,9,.92)',CH?.5:.6);
  g.save();g.globalCompositeOperation='destination-over';g.scale(k,k);Kit.shadow(g,2.4,0,13.5,4.6,.85);g.restore()}
// 스프라이트: 48×88, 발밑 (24,82). 소품 끝(창 · 낚싯대)까지 들어간다
function twFolkSprite(L,f){const key='folk/'+L.key+'/'+f;return SC.get(key,48,88,24,82,g=>{g.translate(24,82);twFolkPaint(g,L,f)},{scale:Math.max(1.25,DPR)})}
window.__twl={TWL,twLand};
