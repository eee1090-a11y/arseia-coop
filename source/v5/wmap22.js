/* ---------- v22 GFX: 세계 지도(M) 읽기 쉽게 (지역 20곳) ----------
   · 칸 크기 · 자리 계산 하나(wmapGeo)를 큰 지도 · 잿빛 메아리 표시(echo21)가 같이 쓴다 → WMAP.geo
   · PC: 세계 지도 탭일 때 창을 넓히고(최대 1200) 화면 높이에 맞춤. 칸 안에 세 줄: 지역 이름 / Lv · 속성 / 마을 이름
   · 휴대폰(지도 창 폭 640 이하): 칸 크기를 고정(글자 12px)하고 지도를 손가락으로 밀어 보는 스크롤 칸 안에 그린다.
     열 때 · 탭을 바꿀 때 지금 있는 지역이 가운데 오게. 위 단추(탭 · 닫기)는 높이 40px 이상.
   · 그리기만: 규칙 · 수치 · 저장과 무관. 매 프레임 그라디언트 · 그림자 · 필터 없음 (지도는 열려 있을 때 0.4초마다 다시 그림). */
const WMAP22={phone:640,cell:[116,86],minLeg:48,regW:720,hint:'<b style="color:#ffd76a">손가락으로 밀면 지도가 움직입니다.</b>'};
function wmapGeo(Wd,Hd,fix){const V=Object.values(WPOS),XS=V.map(p=>p[0]),YS=V.map(p=>p[1]),x0=Math.min(...XS),x1=Math.max(...XS),y0=Math.min(...YS),y1=Math.max(...YS),nx=x1-x0+1,ny=y1-y0+1;
  const sx=fix?fix[0]:Math.min(Wd/(nx+.3),175),sy=fix?fix[1]:Math.min(Hd/(ny+.3),92),cx=Wd/2-(x0+x1)/2*sx,cy=Hd/2-(y0+y1)/2*sy;
  const w=Math.min(160,sx*.94),h=Math.min(66,sy*.8),fs=fix||sx>=118?13:sx>=96?12:10;
  return WMAP.geo={sx,sy,cx,cy,w,h,fs,lines:h>=50?3:2,nx,ny,Wd,Hd,fix:!!fix,pos:id=>({x:cx+WPOS[id][0]*sx,y:cy+WPOS[id][1]*sy})}}
// 창 · 캔버스 크기 정하기 (wmapDraw가 부름). 휴대폰 세계 지도만 스크롤 칸.
function wmapLay(el,cv,dp){const scr=$('#wmapScr')||cv.parentNode,world=WMAP.tab==='world',phone=el.clientWidth<=WMAP22.phone;
  el.classList.toggle('w22world',world);el.classList.toggle('w22phone',phone);
  const cw=Math.max(240,scr.clientWidth|0),top=el.querySelector('.wtop'),leg=$('#wmapLeg');
  const chrome=24+(phone?20:28)+(top?top.offsetHeight+8:40)+Math.max(WMAP22.minLeg,leg?leg.offsetHeight+8:0)+4,avail=Math.max(200,el.clientHeight-chrome);
  let Wd,Hd,fix=null;
  if(world&&phone){fix=WMAP22.cell;const g0=wmapGeo(1,1,fix);Wd=Math.max(cw,Math.round(fix[0]*(g0.nx+.3)));Hd=Math.round(fix[1]*(g0.ny+.3))}
  else if(world){Wd=Math.max(280,cw);Hd=Math.max(260,Math.min(Math.round(Wd*.62),avail))}
  else if(phone&&!DG){Wd=Math.max(cw,WMAP22.regW);Hd=Math.round(Wd*.54)}// 휴대폰 지역 지도도 크게 그리고 밀어서 본다
  else{Wd=Math.max(280,cw);Hd=Math.round(Wd*.62)}
  scr.style.maxHeight=phone&&(world||!DG)?Math.max(220,Math.min(Hd+2,avail))+'px':'';
  cv.style.width=Wd+'px';cv.style.height=Hd+'px';
  if(cv.width!==Math.round(Wd*dp)||cv.height!==Math.round(Hd*dp)){cv.width=Math.round(Wd*dp);cv.height=Math.round(Hd*dp)}
  if(world){const G=wmapGeo(Wd,Hd,fix);if(WMAP.cen){WMAP.cen=0;const id=WPOS[REG.id]?REG.id:'home',p=G.pos(id);scr.scrollLeft=Math.max(0,p.x-scr.clientWidth/2);scr.scrollTop=Math.max(0,p.y-scr.clientHeight/2)}}
  else if(WMAP.cen){WMAP.cen=0;if(phone&&!DG){const m=Math.min((Wd-30)/(WORLD*2*KI),(Hd-30)/(WORLD*KI)),x=Wd/2+(P.x-P.y)*KI*m,y=Hd/2-WORLD*KI/2*m+(P.x+P.y)*KI/2*m;scr.scrollLeft=Math.max(0,x-scr.clientWidth/2);scr.scrollTop=Math.max(0,y-scr.clientHeight/2)}else{scr.scrollLeft=0;scr.scrollTop=0}}
  WMAP.ph=phone&&(world||!DG)?1:0;return{Wd,Hd,phone}}
// 글자가 칸보다 길면 1px 줄이고, 그래도 길면 끝을 …로
function wmapFit(g,t,maxW,fs,bold){let f=fs;g.font=`${bold?'700 ':''}${f}px ${FONT}`;if(g.measureText(t).width>maxW){f=fs-1;g.font=`${bold?'700 ':''}${f}px ${FONT}`}
  if(g.measureText(t).width>maxW){while(t.length>1&&g.measureText(t+'…').width>maxW)t=t.slice(0,-1);t+='…'}return t}
function wmapWorld22(g,Wd,Hd){const G=WMAP.geo&&WMAP.geo.Wd===Wd&&WMAP.geo.Hd===Hd?WMAP.geo:wmapGeo(Wd,Hd),{w,h,fs,pos}=G,f2=fs-(fs>=12?2:1);
  g.font=`${fs}px ${FONT}`;g.fillStyle='#7a7468';g.textAlign='left';g.fillText('북 ↑',8,fs+6);
  g.lineCap='round';g.strokeStyle='rgba(200,170,110,.5)';g.lineWidth=3;g.setLineDash([6,6]);
  for(const id in REGIONS){if(!WPOS[id])continue;for(const sd in REGIONS[id].edges){const to=REGIONS[id].edges[sd];if(!WPOS[to]||to<id&&REGIONS[to].edges)continue;const a=pos(id),b=pos(to);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}}
  g.setLineDash([]);
  const QR=sqTargetRegs(),rr=(x,y,ww,hh,r)=>{g.beginPath();g.roundRect?g.roundRect(x,y,ww,hh,r):g.rect(x,y,ww,hh)};
  for(const id in REGIONS){if(!WPOS[id])continue;const D=REGIONS[id],p=pos(id),k=regKnown(id),here=REG.id===id,L=p.x-w/2,T=p.y-h/2;
    g.fillStyle='#14120e';rr(L,T,w,h,6);g.fill();if(here){g.fillStyle='rgba(255,215,106,.18)';g.fill()}g.strokeStyle=here?'#ffd76a':k?D.col:'#4a4438';g.lineWidth=here?2.5:1.5;g.stroke();
    const ex=typeof wx21ElTag==='function'?wx21ElTag(id):null,lv=`${D.hell?'지옥 ':''}Lv${w3LvOf(id)}~`,town=ALLTOWNS.find(t=>t.reg===id&&t.reg!=='home'),tn=id==='home'?`마을 ${HOME.towns.length}곳`:town?town.n:'';
    const y1=G.lines===3?T+fs+5:p.y-3,y2=G.lines===3?y1+f2+5:p.y+fs,y3=y2+f2+5;
    g.textAlign='center';g.fillStyle=k?D.col:'#7a7468';g.fillText(wmapFit(g,k?D.n:D.n+' ?',w-8,fs,1),p.x,y1);
    {g.font=`${f2}px ${FONT}`;const t2=ex?ex.t:'',wa=g.measureText(lv).width,wb=t2?g.measureText(t2).width:0;
      if(wa+wb<=w-6){g.textAlign='left';g.fillStyle='#c8c0ae';g.fillText(lv,p.x-(wa+wb)/2,y2);if(t2){g.fillStyle=ex.c;g.fillText(t2,p.x-(wa+wb)/2+wa,y2)}g.textAlign='center'}
      else{g.fillStyle='#c8c0ae';g.fillText(wmapFit(g,lv,w-6,f2),p.x,y2)}}
    if(G.lines===3&&tn){g.fillStyle=id==='home'?'#a39d8f':'#d9c38a';g.fillText(wmapFit(g,tn,w-8,f2),p.x,y3)}
    if(here){g.fillStyle='#fff';g.beginPath();g.arc(L+w-8,T+8,4,0,6.283);g.fill()}
    if(QR[id]){g.strokeStyle='#ffd34d';g.lineWidth=2;g.setLineDash([5,4]);rr(L-5,T-5,w+10,h+10,8);g.stroke();g.setLineDash([]);g.font=`700 ${f2}px ${FONT}`;g.fillStyle='#ffd34d';g.textAlign='center';g.fillText(`◎ 의뢰 ${QR[id]}`,p.x,T+h+f2+5)}}
  $('#wmapLeg').innerHTML=(G.fix?WMAP22.hint+' ':'')+'가운데가 처음 시작한 땅입니다. 점선은 맵 끝 포탈로 이어진 길입니다. 한 번 간 지역의 마을은 짝문으로 바로 건너갈 수 있습니다. 흰 점이 지금 있는 곳입니다.'+WMAPLINK22.filter(L=>WPOS[L.a]&&WPOS[L.b]).map(L=>` <span class="w60leg"><b style="color:${L.col}">┅ ${L.t}</b> ${L.leg(!!G.fix)}</span>`).join('')}
/* v60: 세계 지도 연결선을 칸 테두리(보라 테두리 · 의뢰 · 잿빛 메아리 테두리) 위에 한 번 더 · 칸 밖 부분만. 맨 마지막에 그림(dark57.js의 wmapDraw 감싸기). 맵 끝 길이 아닌 특별한 길(하늘 계단)은 WMAPLINK22 */
const WMAPLINK22=[];
function wmapSegOut22(G,ax,ay,bx,by,pad){let iv=[[0,1]];const dx=bx-ax,dy=by-ay;
  for(const id in REGIONS){if(!WPOS[id])continue;const p=G.pos(id),x0=p.x-G.w/2-pad,x1=p.x+G.w/2+pad,y0=p.y-G.h/2-pad,y1=p.y+G.h/2+pad;let t0=0,t1=1,ok=true;
    for(const [q,r] of [[-dx,ax-x0],[dx,x1-ax],[-dy,ay-y0],[dy,y1-ay]]){if(q===0){if(r<0){ok=false;break}continue}const t=r/q;if(q<0){if(t>t1){ok=false;break}if(t>t0)t0=t}else{if(t<t0){ok=false;break}if(t<t1)t1=t}}
    if(!ok||t1<=t0)continue;const nx=[];for(const [u,v] of iv){if(t1<=u||t0>=v){nx.push([u,v]);continue}if(t0>u)nx.push([u,t0]);if(t1<v)nx.push([t1,v])}iv=nx}
  return iv.filter(([u,v])=>v-u>1e-3).map(([u,v])=>[ax+dx*u,ay+dy*u,ax+dx*v,ay+dy*v])}
function wmapTop22(g,G){let n=0;g.save();g.lineCap='round';g.strokeStyle='rgba(232,204,140,.9)';g.lineWidth=2.5;g.setLineDash([5,4]);
  for(const id in REGIONS){if(!WPOS[id])continue;for(const sd in REGIONS[id].edges){const to=REGIONS[id].edges[sd];if(!WPOS[to]||to<id&&REGIONS[to].edges)continue;const a=G.pos(id),b=G.pos(to);
    for(const s of wmapSegOut22(G,a.x,a.y,b.x,b.y,1.5)){const sh=Math.hypot(s[2]-s[0],s[3]-s[1])<16;g.setLineDash(sh?[]:[5,4]);g.lineWidth=sh?3:2.5;g.beginPath();g.moveTo(s[0],s[1]);g.lineTo(s[2],s[3]);g.stroke();n++}}}/* 짧은 틈(옆 칸 사이)은 끊김 없는 선: 점선이면 틈에 빈 곳만 걸려 안 보일 수 있음 */
  g.setLineDash([]);
  for(const L of WMAPLINK22){if(!WPOS[L.a]||!WPOS[L.b])continue;const a=G.pos(L.a),b=G.pos(L.b),open=L.open(),gap=G.sy-G.h,ly=Math.max(a.y,b.y)+G.h/2+gap/2;
    /* 같은 줄이면 두 칸 아래 틈으로 돌아가는 길 · 아니면 곧은 길 */
    const pts=Math.abs(a.y-b.y)<1?[[a.x,a.y+G.h/2],[a.x,ly],[b.x,ly],[b.x,b.y+G.h/2]]:[[a.x,a.y],[b.x,b.y]];
    g.strokeStyle=L.col;g.globalAlpha=open?1:.75;g.lineWidth=2.5;g.setLineDash(open?[7,4]:[2,4]);g.beginPath();pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();g.setLineDash([]);
    for(const q of [pts[0],pts[pts.length-1]]){g.fillStyle=L.col;g.beginPath();g.arc(q[0],q[1],3.5,0,6.283);g.fill()}
    const fs=Math.max(10,G.fs-2),tx=(pts[1][0]+pts[pts.length-2][0])/2,ty=pts.length>2?ly:(a.y+b.y)/2,lab=L.lab(open);g.font=`700 ${fs}px ${FONT}`;const tw=g.measureText(lab).width+10;
    g.globalAlpha=1;g.fillStyle='rgba(16,14,10,.92)';g.fillRect(tx-tw/2,ty-fs/2-3,tw,fs+6);g.strokeStyle=L.col;g.lineWidth=1;g.strokeRect(tx-tw/2+.5,ty-fs/2-2.5,tw-1,fs+5);
    g.fillStyle=L.col;g.textAlign='center';g.textBaseline='middle';g.fillText(lab,tx,ty+.5);g.textBaseline='alphabetic';L.box={x:tx-tw/2,y:ty-fs/2-3,w:tw,h:fs+6,pts};n++}
  g.restore();WMAP.top22=n;return n}
{const _wr=wmapRegion;wmapRegion=function(g,Wd,Hd){const r=_wr.apply(this,arguments);if(WMAP.ph){const lg=$('#wmapLeg');if(lg)lg.innerHTML=WMAP22.hint+' '+lg.innerHTML}return r}}
{const st=document.createElement('style');st.textContent=`#wmap .wscr{max-width:100%;overflow:auto;touch-action:pan-x pan-y;overscroll-behavior:contain;border-radius:3px}
#wmap .wscr #wmapCv{max-width:none;box-sizing:border-box}
#wmap.w22world .card{width:min(1200px,100%)}
#wmap.w22phone{padding:8px;align-items:start}#wmap.w22phone .card{padding:10px;max-height:100%;overflow:auto;box-sizing:border-box}
#wmap.w22phone .wtop button{min-height:40px;min-width:44px;padding:0 12px;font-size:14px}
#wmap.w22phone .wleg{font-size:12.5px;line-height:1.5}
.w60leg{white-space:normal}`;document.head.appendChild(st)}
