
/* ---------- 큰 지도 (M): 지금 지역 상세 + 세계 지역 연결도 ---------- */
const WMAP={tab:'reg',bg:new Map(),t:0};
// 세계 연결도에서 지역의 자리 (홈을 가운데에 두고 포탈 방향대로)
const WPOS={home:[0,0],plains:[1,0],desert:[1,1],jungle:[2,1],sea:[2,2],ice:[0,-1],lava:[0,-2],forest:[-1,0]};
function wmapBg(){let c=WMAP.bg.get(REG.id);if(c)return c;
  const N=180;c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),id=g.createImageData(N,N);
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=(i+.5)/N*WORLD,y=(j+.5)/N*WORLD,k=(j*N+i)*4,col=groundRGB(x,y);id.data[k]=Math.min(255,col[0]*1.5);id.data[k+1]=Math.min(255,col[1]*1.5);id.data[k+2]=Math.min(255,col[2]*1.5);id.data[k+3]=255}
  g.putImageData(id,0,0);WMAP.bg.set(REG.id,c);return c}
const regKnown=id=>id==='home'||id===REG.id||ALLTOWNS.some(t=>t.reg===id&&P.towns.includes(t.id));
function wmapOpen(){let el=$('#wmap');if(!el){el=document.createElement('div');el.id='wmap';el.hidden=true;
    el.innerHTML=`<div class="card"><div class="wtop"><div class="wtabs"><button type="button" data-wt="reg"></button><button type="button" data-wt="world">세계 지도</button></div><button type="button" data-wclose="1">닫기 (M)</button></div><div class="wscr" id="wmapScr"><canvas id="wmapCv"></canvas></div><div class="wleg muted" id="wmapLeg"></div></div>`;
    document.body.appendChild(el);
    el.addEventListener('click',e=>{const b=e.target.closest('button');if(e.target===el||b&&b.dataset.wclose){wmapClose();return}if(b&&b.dataset.wt){WMAP.tab=b.dataset.wt;WMAP.cen=1;wmapDraw()}})}
  el.hidden=false;WMAP.cen=1;wmapDraw()}
function wmapClose(){const el=$('#wmap');if(el)el.hidden=true}
const wmapIsOpen=()=>{const el=$('#wmap');return !!el&&!el.hidden};
function wmapDraw(){const el=$('#wmap');if(!el||el.hidden)return;
  el.querySelector('[data-wt="reg"]').textContent=DG?DG.d.n:REG.n;el.querySelectorAll('[data-wt]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.wt===WMAP.tab));
  const cv=$('#wmapCv'),dp=Math.min(2,devicePixelRatio||1),{Wd,Hd}=wmapLay(el,cv,dp);// v22 GFX: 크기 · 휴대폰 스크롤 칸은 wmap22.js
  const g=cv.getContext('2d');g.setTransform(dp,0,0,dp,0,0);g.fillStyle='#0c0b09';g.fillRect(0,0,Wd,Hd);
  if(WMAP.tab==='world')wmapWorld(g,Wd,Hd);else if(DG){g.fillStyle='#a39d8f';g.font=`15px ${FONT}`;g.textAlign='center';g.fillText('던전 안에서는 오른쪽 위 미니맵으로 길을 보세요',Wd/2,Hd/2)}else wmapRegion(g,Wd,Hd)}
function wmapRegion(g,Wd,Hd){
  const m=Math.min((Wd-30)/(WORLD*2*KI),(Hd-30)/(WORLD*KI)),ox=Wd/2,oy=Hd/2-WORLD*KI/2*m;
  const S=(x,y)=>({x:ox+(x-y)*KI*m,y:oy+(x+y)*KI/2*m});
  g.save();g.setTransform(g.getTransform().multiply(new DOMMatrix([m*KI,m*KI/2,-m*KI,m*KI/2,ox,oy])));
  g.imageSmoothingEnabled=true;g.drawImage(wmapBg(),0,0,WORLD,WORLD);
  g.strokeStyle='rgba(200,170,110,.85)';g.lineWidth=60;g.lineCap='round';for(const rd of ROADS){g.beginPath();rd.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke()}
  g.strokeStyle='rgba(214,178,98,.6)';g.lineWidth=24;g.setLineDash([80,80]);for(const t of TOWNS){g.beginPath();g.arc(t.x,t.y,tSafe(t),0,6.283);g.stroke()}g.setLineDash([]);
  g.strokeStyle='#5c4a2e';g.lineWidth=40;g.strokeRect(0,0,WORLD,WORLD);g.restore();
  const lab=(x,y,t,c,sz,bold)=>{g.font=`${bold?'700 ':''}${sz||12}px ${FONT}`;g.textAlign='center';g.lineWidth=3;g.strokeStyle='rgba(0,0,0,.85)';g.strokeText(t,x,y);g.fillStyle=c;g.fillText(t,x,y)};
  const dot=(x,y,r,c,sq)=>{g.fillStyle=c;g.beginPath();sq?(g.moveTo(x,y-r),g.lineTo(x+r,y),g.lineTo(x,y+r),g.lineTo(x-r,y),g.closePath()):g.arc(x,y,r,0,6.283);g.fill();g.strokeStyle='rgba(0,0,0,.8)';g.lineWidth=1.5;g.stroke()};
  for(const t of TOWNS){const s=S(t.x,t.y),k=P.towns.includes(t.id);dot(s.x,s.y,7,k?'#e8c45a':'#6a6458');lab(s.x,s.y-12,k?t.n:'???',k?'#ffe7a0':'#a39d8f',13,1)}
  for(const c of CAVES){const s=S(c.x,c.y);dot(s.x,s.y,6,'#ff8a3a',1);lab(s.x,s.y-10,`${c.cave.n} · Lv${c.cave.lvl+DIFF[P.diff].add}`,'#ffb07a',11)}
  for(const e of EDGES){const s=S(e.x,e.y),R2=REGIONS[e.to];dot(s.x,s.y,7,e.col,1);lab(s.x,s.y-11,`→ ${R2.n}${e.to==='home'?'':` Lv${w3LvOf(e.to)}~`}${typeof wx21ElTag==='function'&&wx21ElTag(e.to)?wx21ElTag(e.to).t:''}`,e.col,11,1)}
  if(REG.lair){const s=S(REG.lair.x,REG.lair.y);g.strokeStyle=REG.bossDead?'#6a6458':'#ff4a3a';g.lineWidth=2.5;g.beginPath();g.arc(s.x,s.y,9,0,6.283);g.stroke();lab(s.x,s.y-13,REG.bossDead?'우두머리 (쓰러짐)':TYPES[REG.boss].n,REG.bossDead?'#a39d8f':'#ff8a6a',11)}
  {const st=STATUE&&HOME.decor.find(d=>d.k==='statue');if(st&&REG.id==='home'){const s=S(st.x,st.y);lab(s.x,s.y+18,'가짜코 동상','#e8e0cc',10)}}
  // 의뢰 표시: 1막(노랑) · 마을 의뢰(하늘) 고리와 이름, 채집 자리 점, ! ? 표시 (sq.js sqMarks)
  {const ms=sqMarks(true),seen=[];for(const k of ms){const s=S(k.x,k.y);
    if(k.kind==='dot'){g.fillStyle=k.col;g.beginPath();g.arc(s.x,s.y,2.6,0,6.283);g.fill();continue}
    if(k.kind==='ring'){const n=seen.filter(o=>Math.hypot(o.x-s.x,o.y-s.y)<20).length;seen.push(s);g.strokeStyle=k.col;g.lineWidth=2.5;g.beginPath();g.arc(s.x,s.y,13+n*4,0,6.283);g.stroke();lab(s.x,s.y+26+n*13,k.label||'의뢰',k.col,11,1);continue}
    g.font=`800 15px ${FONT}`;g.textAlign='center';g.lineWidth=3;g.strokeStyle='#000';g.strokeText(k.kind,s.x,s.y+5);g.fillStyle=k.col;g.fillText(k.kind,s.x,s.y+5)}}
  if(NET.on)for(const r of NET.peers.values()){if(!netSame(r))continue;const s=S(r.x,r.y);dot(s.x,s.y,5,'#5ad0ff');lab(s.x,s.y-9,r.name||'동료','#9fe0ff',11)}
  {const s=S(P.x,P.y),d=scrDir(Math.cos(P.face),Math.sin(P.face)),a=Math.atan2((Math.cos(P.face)+Math.sin(P.face))*.5,Math.cos(P.face)-Math.sin(P.face));
    g.save();g.translate(s.x,s.y);g.rotate(a);g.fillStyle='#fff';g.beginPath();g.moveTo(10,0);g.lineTo(-6,-6);g.lineTo(-3,0);g.lineTo(-6,6);g.closePath();g.fill();g.strokeStyle='#000';g.lineWidth=1.5;g.stroke();g.restore();void d}
  $('#wmapLeg').innerHTML=`<span style="color:#e8c45a">●</span> 마을 &nbsp;<span style="color:#ff8a3a">◆</span> 던전 &nbsp;<span style="color:#b9a2ff">◆</span> 맵 끝 포탈 &nbsp;<span style="color:#ff4a3a">○</span> 우두머리 &nbsp;<span style="color:#ffd34d">○</span> 1막 의뢰 &nbsp;<span style="color:#7fd8ff">○</span> 마을 의뢰 &nbsp;<span style="color:#ffd34d">!</span> 받기 <span style="color:#9fe0ff">?</span> 보고 &nbsp;<span style="color:#5ad0ff">●</span> 파티원 · 지금 위치 몬스터 Lv${zoneLevel(P.x,P.y)||'-'}`}
function wmapWorld(g,Wd,Hd){wmapWorld22(g,Wd,Hd)}// v22 GFX: 세계 지도 칸 · 글자는 wmap22.js (지역 20곳 · 휴대폰)
addEventListener('keydown',e=>{if(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName))return;
  if(e.code==='KeyM'&&$('#intro').hidden){e.preventDefault();e.stopImmediatePropagation();wmapIsOpen()?wmapClose():wmapOpen();return}
  if(e.code==='Escape'&&wmapIsOpen()){e.preventDefault();e.stopImmediatePropagation();wmapClose()}},true);
{const b=document.createElement('button');b.className='stonebox';b.id='mapBtn';b.type='button';b.textContent='지도 (M)';b.onclick=()=>wmapIsOpen()?wmapClose():wmapOpen();
  const tools=document.querySelector('.tools'),pb=$('#patchBtn');if(tools)tools.insertBefore(b,pb||null)}
mm.style.cursor='pointer';mm.style.pointerEvents='auto';mm.title='큰 지도 (M)';mm.addEventListener('click',()=>wmapOpen());
// 미니맵 덧그리기: 파티원 · 바라보는 방향 · 열려 있으면 큰 지도도 갱신
{const _dm=drawMinimap;drawMinimap=function(){_dm();
  if(!DG){const S0=mm.width,m=S0/2600,px=(P.x-P.y)*KI,py=(P.x+P.y)*KI/2;
    if(NET.on){mctx.setTransform(m*KI,m*KI/2,-m*KI,m*KI/2,S0/2-m*px,S0/2-m*py);for(const r of NET.peers.values()){if(!netSame(r))continue;mctx.fillStyle='#5ad0ff';mctx.beginPath();mctx.arc(r.x,r.y,70,0,6.283);mctx.fill()}}
    mctx.setTransform(1,0,0,1,0,0);const a=Math.atan2((Math.cos(P.face)+Math.sin(P.face))*.5,Math.cos(P.face)-Math.sin(P.face));mctx.save();mctx.translate(S0/2,S0/2);mctx.rotate(a);mctx.fillStyle='#fff';mctx.beginPath();mctx.moveTo(13,0);mctx.lineTo(6,-4);mctx.lineTo(6,4);mctx.closePath();mctx.fill();mctx.restore()}
  if(wmapIsOpen()&&time-WMAP.t>.4){WMAP.t=time;wmapDraw()}}}
