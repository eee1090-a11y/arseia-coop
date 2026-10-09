<script>
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const cv=$('#game'),ctx=cv.getContext('2d'),mm=$('#minimap'),mctx=mm.getContext('2d');
let W=0,H=0,DPR=1;
const lc=document.createElement('canvas'),lctx=lc.getContext('2d');
// [그래픽 v20] 화면 설정: 카메라 당기기(CZ 1 / 1.15) · 빛과 안개. 설정은 'arseia-gfx' 한 키에만 쓴다 (캐릭터 키는 건드리지 않음)
const GFX={zoom:1,fog:true};try{const v=JSON.parse(localStorage.getItem('arseia-gfx')||'null');if(v&&typeof v==='object'){if(v.zoom===1.15)GFX.zoom=1.15;if(typeof v.fog==='boolean')GFX.fog=v.fog;if(v.art==='old')GFX.art='old'}}catch(_){}
let CZ=1;// 당기면 세계 좌표의 화면 크기(W,H)가 1/CZ로 줄고 DPR이 CZ배가 된다 → 캔버스 픽셀 수는 그대로
function resize(){CZ=GFX.zoom;DPR=Math.min(1.5,window.devicePixelRatio||1)*CZ;const cw=cv.clientWidth||innerWidth,ch=cv.clientHeight||innerHeight;W=cw/CZ;H=ch/CZ;cv.width=Math.round(cw*DPR/CZ);cv.height=Math.round(ch*DPR/CZ);lc.width=Math.ceil(W/2);lc.height=Math.ceil(H/2)}
addEventListener('resize',resize);resize();
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FONT=getComputedStyle(document.documentElement).getPropertyValue('--body')||'sans-serif',DISPLAY=getComputedStyle(document.documentElement).getPropertyValue('--display')||'serif';

/* ---------- helpers ---------- */
const R=Math.random,rnd=(a,b)=>a+R()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(R()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function angDiff(a,b){let d=a-b;while(d>Math.PI)d-=6.283;while(d<-Math.PI)d+=6.283;return Math.abs(d)}
function segDist(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1;const t=clamp(((px-x1)*dx+(py-y1)*dy)/l,0,1);return Math.hypot(px-(x1+dx*t),py-(y1+dy*t))}

/* ---------- 쿼터뷰 투영: 월드(x,y) → 화면 ---------- */
const KI=.75;let camX=0,camY=0;
const W2S=(x,y)=>({x:(x-y)*KI-camX,y:(x+y)*KI/2-camY});
function S2W(sx,sy){const X=(sx+camX)/KI,Y=(sy+camY)*2/KI;return{x:(X+Y)/2,y:(Y-X)/2}}
function scrDir(dx,dy){const x=(dx+2*dy)/(2*KI),y=(2*dy-dx)/(2*KI),l=Math.hypot(x,y)||1;return{x:x/l,y:y/l}}
const P3=(p)=>{const s=W2S(p.x,p.y);return{x:s.x,y:s.y-(p.z||0)}};

/* ---------- world: 브렌힐에서 아르덴까지 ---------- */
const WORLD=6000,TOWN_R=260,SAFE=470,ZSTEP=160;
let REG={id:'home',th:null,zs:0};
const TOWNS=[
  {id:'brenhill',n:'브렌힐',x:1500,y:4700,base:1,area:'방앗간 들판',desc:'안개숲 가장자리의 방앗간 마을. 이야기가 시작된 곳.',roof:['#6a2c22','#3e4a26','#6a4c22','#5a3250']},
  {id:'willowen',n:'윌로벤',x:3500,y:4450,base:5,area:'은류강 나루',desc:'은류강 나루터 마을. 상인과 뱃사람이 쉬어 갑니다.',roof:['#2a405a','#32505a','#4e4032','#2a4e40']},
  {id:'haven',n:'헤이븐 교차로',x:4500,y:2650,base:10,area:'남부 대로',desc:'남부와 수도를 잇는 교차로. 소문이 모이는 여관 마을.',roof:['#5c4024','#4e2424','#40404e','#5c4e32']},
  {id:'arden',n:'아르덴',x:2500,y:1300,base:16,area:'왕도 외곽',desc:'하얀 성벽의 수도. 일곱 첨탑의 왕립 마법원이 있습니다.',roof:['#24325c','#32244e','#24404e','#40325c'],white:true},
];
const TOWN=TOWNS[0];
TOWNS.forEach(t=>{t.shop={x:t.x+110,y:t.y-40};t.gate={x:t.x-60,y:t.y+120};t.stash={x:t.x+75,y:t.y+175}});
function nearestTown(x,y){let b=TOWNS[0],bd=1e9;for(const t of TOWNS){const d=Math.hypot(x-t.x,y-t.y);if(d<bd){bd=d;b=t}}return{t:b,d:bd}}
function levelAt(x,y){let l=99;for(const t of TOWNS){const d=Math.hypot(x-t.x,y-t.y);l=Math.min(l,t.base+Math.min(REG.zc||99,Math.max(0,d-SAFE)/(REG.zs||ZSTEP)))}return l}
const tSafe=t=>t.safe||SAFE;// v22 TOWN: 넓힌 마을은 안전 지대도 넓다 (town22.js)
const zoneLevel=(x,y)=>{const n=nearestTown(x,y);return n.d<tSafe(n.t)?0:Math.max(1,Math.floor(levelAt(x,y)))};
const inSafe=(x,y,pad)=>TOWNS.some(t=>Math.hypot(x-t.x,y-t.y)<tSafe(t)-(pad||0));
function zoneName(x,y){const n=nearestTown(x,y);if(n.d<tSafe(n.t))return n.t.n;const l=levelAt(x,y);
  if(REG.th)return l<n.t.base+3?n.t.area:l<n.t.base+8?REG.n:`${REG.n} 깊은 곳`;
  if(l<n.t.base+3)return n.t.area;return l>=30?'재의 심연':l>=24?'재의 황야':l>=18?'노르반 폐허':l>=12?'잿빛 폐허':l>=7?'속삭이는 갈대 늪':l>=4?'안개숲':n.t.area}
const ROADS=[];
(()=>{const s=mulberry(77);
  for(const [a,b] of [[0,1],[1,2],[2,3],[0,3]]){const A=TOWNS[a],B=TOWNS[b],mx=(A.x+B.x)/2,my=(A.y+B.y)/2,dx=B.x-A.x,dy=B.y-A.y,l=Math.hypot(dx,dy),off=(s()-.5)*l*.35;
    const cx=mx-dy/l*off,cy=my+dx/l*off,pts=[];for(let i=0;i<=40;i++){const u=i/40;pts.push({x:(1-u)*(1-u)*A.x+2*(1-u)*u*cx+u*u*B.x,y:(1-u)*(1-u)*A.y+2*(1-u)*u*cy+u*u*B.y})}ROADS.push(pts)}})();
function roadDist(x,y){let m=1e9;for(const r of ROADS)for(let i=1;i<r.length;i++){const d=segDist(x,y,r[i-1].x,r[i-1].y,r[i].x,r[i].y);if(d<m)m=d}return m}
// 디아블로2 1막 같은 어둡고 탁한 땅 색: 들판 → 숲 → 늪 → 폐허 → 재의 황야
const GROUND=[[64,72,40],[50,60,36],[44,52,38],[54,52,40],[56,48,38],[48,42,38],[44,36,34],[38,30,30]];
// groundRGB · paintChunk · getChunk → ground.js (지역 재질 표)
const decor=[];
(()=>{
  const s=mulberry(1337);
  for(let i=0;i<1700;i++){
    const x=s()*WORLD,y=s()*WORLD,t=s(),sc=.75+s()*.6,v=s();
    if(nearestTown(x,y).d<TOWN_R+90)continue;
    const zl=levelAt(x,y);
    let k=t<.55?'tree':t<.75?'rock':t<.88?'bush':'stump';
    if(zl>=12&&t>.8)k=s()<.5?'ruin':'tomb';
    if(roadDist(x,y)<52)continue;
    decor.push({x,y,k,s:sc,v,zl:Math.floor(zl)});
  }
  TOWNS.forEach((T0,ti)=>{
    for(let i=0;i<7;i++){const a=i/7*Math.PI*2+.4;const hx=T0.x+Math.cos(a)*215,hy=T0.y+Math.sin(a)*205;
      if(Math.hypot(hx-T0.shop.x,hy-T0.shop.y)<175||Math.hypot(hx-T0.gate.x,hy-T0.gate.y)<175)continue;
      decor.push({x:hx,y:hy,k:ti===0&&i===3?'mill':'house',v:i,s:1,town:T0,light:70})}
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.2;decor.push({x:T0.x+Math.cos(a)*285,y:T0.y+Math.sin(a)*285,k:'lamp',s:1,v:0,light:170})}
    decor.push({x:T0.x,y:T0.y,k:'fountain',s:1,v:0,light:190});
    decor.push({x:T0.shop.x,y:T0.shop.y,k:'shop',s:1,v:0,town:T0,light:150});
    decor.push({x:T0.gate.x,y:T0.gate.y,k:'gate',s:1,v:0,town:T0,light:140});
    decor.push({x:T0.stash.x,y:T0.stash.y,k:'stash',s:1,v:0,town:T0,light:110});
    if(T0.white)for(let i=0;i<7;i++){const a=i/7*Math.PI*2+.2;decor.push({x:T0.x+Math.cos(a)*330,y:T0.y+Math.sin(a)*320,k:'spire',s:1,v:i,light:90})}
  });
})();
const LIGHTS=decor.filter(d=>d.light);

/* ---------- 땅 조각: 질감을 미리 그려 둔다 ---------- */
const CH=400,chunks=new Map();let chunkBudget=0,frameN=0;
// 빛 스프라이트(어둠을 지우는 부드러운 원)
const LS=document.createElement('canvas');LS.width=LS.height=128;{const g=LS.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.45,'rgba(0,0,0,.75)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,128,128)}

/* ---------- spells: 룬의 계승자 설정의 열 개의 위계 / 은총의 단계 ---------- */
const EL={fire:'#ff7a2e',ice:'#8fd8ff',storm:'#ffe066',earth:'#c9a46a',wind:'#bfeedd',arcane:'#b9a2ff',light:'#fff3b0',holy:'#ffe39a',life:'#9fe39a'};
const ELN={fire:'화염',ice:'물과 얼음',storm:'대기·벼락',earth:'대지',wind:'대기',arcane:'봉인·공간',light:'빛',holy:'신성',life:'변성'};
const CLASSES={
  mage:{n:'마법사',rankN:r=>`제${r}위계`,grade:['견습 마법사','견습 마법사','하급 마법사','하급 마법사','중급 마법사','중급 마법사','상급 마법사','상급 마법사','대마법사'],
    desc:'세상의 숨인 마나를 길어 올려 근원어로 부릅니다. 불, 얼음, 벼락, 대지, 봉인, 공간을 넘나드는 넓은 마법.',start:['spark'],hp:1,mp:1.15,st:[14,10,14],
    trees:['화염','냉기','폭풍','대지','이치']},
  priest:{n:'사제',rankN:r=>`은총 ${r}단계`,grade:['견습사제','견습사제','사제','사제','고위사제','고위사제','주교','대주교','성자'],
    desc:'마나 대신 신에게 기도해 은총을 청합니다. 치유와 수호, 그리고 부정한 것을 태우는 심판. 언데드에게 특히 강합니다.',start:['holyspark'],hp:1.2,mp:.95,st:[12,14,12],
    trees:['심판','퇴마','치유','수호','축복']},
};
const MAXLV=140,MAXSK=20;// v19: 2차 전직 · v20: 3차 전직 · 최고 레벨 140 (3차 스킬은 skMax=10, job3.js)
// v18: 9위계·은총 9단계가 너무 일찍 열려서 늦춘다 (예전 1/4/8/13/19/26/34/43/52). 이미 찍은 점수는 그대로 두고, 더 찍을 때만 이 레벨을 따진다
// v19: 1차는 1~8위계만 (2차 전직 50레벨). 옛 9위계는 2차 「상위 기술」 탭(skill19.js의 upLv)으로
const RANK_LV=[1,5,10,16,23,31,38,45];
const rankOf=l=>{let r=1;for(let i=0;i<RANK_LV.length;i++)if(l>=RANK_LV[i])r=i+1;return r};
const SPELLS={};
function def(cls,rank,id,n,en,el,kind,cost,cd,o,desc){SPELLS[id]=Object.assign({id,cls,rank,n,en,el,kind,cost,cd,desc},o)}
