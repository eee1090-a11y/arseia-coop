/* ---------- v22 QUEST: 의뢰 길 안내 (사용자 07:36) ----------
   「로그에서 퀘스트를 선택하면 퀘스트 위치로 안내하는 장치가 필요할 것 같아」
   · 의뢰 일지(L)의 의뢰마다 「길 안내」 단추. 한 번에 하나만 따라간다(다른 의뢰를 누르면 바뀌고, 같은 것을 다시 누르면 끔).
     중요한 의뢰 카드 칸(quest21)과 받을 수 있는 의뢰도 안내할 수 있다(그때는 의뢰인에게).
   · 안내: 캐릭터 둘레의 작은 화살표 + 짧은 이름 · 거리. 목표가 화면 안이면 그 자리 위에 작은 표식. 미니맵 · 큰 지도(지역 칸)에 금색 마름모,
     세계 칸에는 목표 지역을 굵은 테두리와 지금 지역에서 이어지는 길로 표시.
   · 목표 자리는 기존 목표 계산(qMainTargetW · sqTarget · qRoute)을 그대로 쓴다: 다른 지역이면 그쪽 맵 끝 포탈(「○○로 가는 길」),
     던전 안이면 나가는 문, 건물 안이면 문. 같은 지역이면 사람은 지금 서 있는 자리(마을 넓히기 뒤의 자리), 몬스터 목표는 가까이 있으면 그 몬스터,
     맞는 던전 안에서는 살아 있는 준보스·보스.
   · 의뢰를 끝내면 안내가 꺼진다(메인 의뢰는 그 의뢰가 끝날 때). 단계가 남은 동안은 다음 목표로 저절로 넘어간다.
   · 저장: P.qg = 'main:<번호>' | 'sq:<의뢰 id>' → 저장 칸 d.qg (안내 중일 때만). 없으면 꺼짐. */
const QG={t:0,rt:0,cvR:null,cur:null,ang:0,el:null,last:{},R:72,Rm:54};
const qgTxt=t=>String(t||'').split(' · ').pop().replace(/<[^>]*>/g,'').trim();
const qgRo=n=>{const c=String(n).charCodeAt(String(n).length-1)-0xac00;if(c<0||c>11171)return n+'(으)로';const j=c%28;return n+(j===0||j===8?'로':'으로')};
function qgQuest(id){if(typeof id!=='string')return null;if(id.startsWith('main:')){const i=+id.slice(5),st=qState();return st.i===i?qCur():null}
  if(id.startsWith('sq:'))return SQBY[id.slice(3)]||null;return null}
function qgValid(id){const q=qgQuest(id);if(!q)return false;if(id.startsWith('main:'))return true;const s=sqState();if(s.a[q.id])return true;const v=sqAvail(q);return v==='ok'||v==='low'}
function qgName(id){const q=qgQuest(id);return q?q.t:''}
// 지금 할 일의 몬스터 종류(맞는 던전 안 · 가까운 몬스터로 끌어당기기)
function qgKinds(id){const q=qgQuest(id);if(!q)return null;
  if(id.startsWith('main:')){const st=qState();if(st.st!==1)return null;for(let j=0;j<q.goals.length;j++){if(qGoalDone(q,j))continue;const g=q.goals[j];return g.k||null}return null}
  const a=sqState().a[q.id];if(!a||sqAllDone(q))return null;for(let j=0;j<q.goals.length;j++){if(sqGoalDone(q,j))continue;const g=q.goals[j];return g.k||null}return null}
// 지금 목표가 사람인가(받기 전 · 보고 · 말 걸기 목표) → 그때만 서 있는 사람 자리로 끌어당김
function qgIsNpc(id){const q=qgQuest(id);if(!q)return false;let g=null;
  if(id.startsWith('main:')){const st=qState();if(st.st!==1)return true;for(let j=0;j<q.goals.length;j++)if(!qGoalDone(q,j)){g=q.goals[j];break}}
  else{const a=sqState().a[q.id];if(!a||sqAllDone(q))return true;for(let j=0;j<q.goals.length;j++)if(!sqGoalDone(q,j)){g=q.goals[j];break}}
  return !!g&&g.type==='talk'}
// 세계 기준 목표 {reg,x,y,cave?,room?,door?,label}
function qgTargetW(id){const q=qgQuest(id);if(!q)return null;
  if(id.startsWith('main:'))return qMainTargetW();
  if(sqState().a[q.id])return sqTarget(q);
  const t=typeof j2NpcAt==='function'?j2NpcAt(q.giver):null;return t?Object.assign({},t,{label:`${t.label} · 「${q.t}」 의뢰인`}):null}
// 지금 보고 있는 맵에서 갈 자리 {x,y,label,kind}
function qgLocal(id){const tg=qgTargetW(id);if(!tg)return null;const reg=tg.reg||'home',ks=qgKinds(id);
  const near=(list,f,R,o)=>{o=o||P;let b=null,bd=R;for(const e of list){if(!f(e))continue;const d=Math.hypot(e.x-o.x,e.y-o.y);if(d<bd){bd=d;b=e}}return b};
  const mob=R=>ks&&near(enemies,e=>!e.dead&&ks.includes(e.k),R);
  if(DG){const r=qRoute(tg);if(r==null){const e=mob(1e9);return e?{x:e.x,y:e.y,label:TYPES[e.k].n,kind:'mob'}:null}
    return{x:r.x,y:r.y,label:reg!==REG.id?qgRo(REGIONS[reg].n)+' 가는 길 · 던전 밖으로':'던전 밖으로',kind:'exit'}}
  if(IN){if(tg.room===IN.rid&&reg===REG.id){const f=qgIsNpc(id)&&near(IN.list||[],d=>d.k==='tfolk',260,tg);const p=f||tg;return{x:p.x,y:p.y,label:qgTxt(tg.label),kind:'npc'}}
    return{x:IN.exit.x,y:IN.exit.y,label:'건물 밖으로',kind:'exit'}}
  if(reg!==REG.id){const r=qRoute(tg);return r?{x:r.x,y:r.y,label:qgRo(REGIONS[reg].n)+' 가는 길',kind:'edge',to:reg}:null}
  if(tg.room&&tg.door)return{x:tg.door.x,y:tg.door.y,label:qgTxt(tg.label)+' (건물 안)',kind:'door'};
  const e=mob(700);if(e)return{x:e.x,y:e.y,label:TYPES[e.k].n,kind:'mob'};
  // 사람: 마을 넓히기·걷기 뒤의 지금 자리
  const f=tg.cave==null&&qgIsNpc(id)&&near(decor,d=>(d.k==='tfolk'&&!d.esc)||d.k==='npc',200,tg);
  if(f)return{x:f.x,y:f.y,label:qgTxt(tg.label),kind:'npc'};
  return{x:tg.x,y:tg.y,label:qgTxt(tg.label),kind:tg.cave!=null?'cave':'spot'}}
// 켜기 · 끄기
function qgSet(id,quiet){if(id&&!qgValid(id))return false;const was=P.qg;if(!id||was===id){delete P.qg;QG.cur=null;if(!quiet&&was)msg('길 안내를 껐습니다','#d6b262')}
  else{P.qg=id;QG.t=0;if(!quiet)msg(`길 안내: ${qgName(id)}`,'#ffd98a')}qgTick(true);questHud();try{save()}catch(_){}return true}
function qgBtn(id){const on=P&&P.qg===id;return `<button type="button" class="${on?'primary':'ghost'} qgbtn" data-qg="${id}" title="${on?'길 안내 끄기':'화살표와 지도 표시로 갈 곳 알려 주기'}">${on?'안내 끄기':'길 안내'}</button>`}
{const _qc=questClick;questClick=function(b){if(b&&b.dataset&&b.dataset.qg){qgSet(b.dataset.qg);renderPanel();return true}return _qc(b)}}
// 의뢰가 끝나면 끔 · 목표 다시 계산
function qgTick(force){if(!P)return;const id=P.qg;if(!id){QG.cur=null;return}
  if(!qgValid(id)){const n=QG.name||'';delete P.qg;QG.cur=null;msg(`길 안내를 마쳤습니다${n?` · 「${n}」`:''}`,'#ffd98a');return}
  QG.name=qgName(id);if(force||(QG.t-=1/60)<=0){QG.t=.25;QG.cur=qgLocal(id)}}
// 화살표 (DOM · 캐릭터 둘레). 화면 좌표 = W2S × (보이는 캔버스 폭 / W)
function qgEl(){if(QG.el&&QG.el.isConnected)return QG.el;const el=document.createElement('div');el.id='qg22';el.hidden=true;
  el.innerHTML='<div class="qg-a"><svg viewBox="-14 -12 28 24" width="34" height="28"><path d="M12 0 L-8 -10 L-3 0 L-8 10 Z" fill="#ffd36a" stroke="#2a1a08" stroke-width="2" stroke-linejoin="round"/><path d="M8 0 L-4 -6 L-1 0 Z" fill="#fff3c0" opacity=".7"/></svg></div><div class="qg-l"></div><div class="qg-p"><svg viewBox="-8 -10 16 20" width="16" height="20"><path d="M0 -9 L7 0 L0 9 L-7 0 Z" fill="#ffd36a" stroke="#2a1a08" stroke-width="2"/></svg></div>';
  document.body.appendChild(el);QG.el=el;return el}
{const st=document.createElement('style');st.textContent=`#qg22{position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:4}
#qg22 .qg-a{position:fixed;left:0;top:0;width:34px;height:28px;margin:-14px 0 0 -17px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))}
#qg22 .qg-l{position:fixed;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:11px;line-height:1.2;color:#ffe6a8;background:rgba(14,12,10,.72);border:1px solid #6c5634;border-radius:3px;padding:1px 5px;text-shadow:0 1px 2px #000}
#qg22 .qg-p{position:fixed;left:0;top:0;width:16px;height:20px;margin:-10px 0 0 -8px;animation:qg22b 1s ease-in-out infinite;filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))}
@keyframes qg22b{0%,100%{translate:0 -4px}50%{translate:0 2px}}
#pbody .qgbtn{min-height:26px;padding:2px 8px;font-size:12px}
.qlog .qgrow{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}`;document.head.appendChild(st)}
// 휴대폰: mobile22의 M22.mode()('L'·'P')를 따르고, 없으면 짧은 변 500px 이하
function qgPhone(){try{if(typeof M22==='object'&&M22&&typeof M22.mode==='function')return !!M22.mode()}catch(_){}return Math.min(innerWidth,innerHeight)<=500}
function qgDraw(){const el=qgEl(),c=P&&P.qg&&QG.cur;const hide=!c||P.dead||!$('#intro').hidden||($('#wmap')&&!$('#wmap').hidden);
  if(hide){if(!el.hidden)el.hidden=true;return}
  if((QG.rt-=1/60)<=0||!QG.cvR){QG.rt=.5;QG.cvR=cv.getBoundingClientRect()}const r=QG.cvR,k=r.width/W,ph=QG.ph=qgPhone();
  const a=W2S(P.x,P.y),b=W2S(c.x,c.y),px=r.left+a.x*k,py=r.top+(a.y-30)*k,tx=r.left+b.x*k,ty=r.top+(b.y-20)*k,dx=tx-px,dy=ty-py,L=Math.hypot(dx,dy),ang=Math.atan2(dy,dx);
  const R=ph?QG.Rm:QG.R,dist=Math.hypot(c.x-P.x,c.y-P.y),on=tx>r.left+20&&tx<r.right-20&&ty>r.top+20&&ty<r.bottom-20;
  QG.ang=ang;QG.dist=dist;el.hidden=false;const A=el.children[0],Lb=el.children[1],Pn=el.children[2],close=L<R+24;
  A.style.display=close?'none':'';A.style.transform=`translate(${px+Math.cos(ang)*R}px,${py+Math.sin(ang)*R}px) rotate(${ang}rad)`;
  Pn.style.display=on?'':'none';if(on)Pn.style.transform=`translate(${tx}px,${ty-26}px)`;
  const nm=c.label.length>(ph?9:16)?c.label.slice(0,ph?8:15)+'…':c.label,txt=`${nm} · ${Math.max(1,Math.round(dist/10))}m`;
  if(Lb.textContent!==txt){Lb.textContent=txt;Lb.style.fontSize=ph?'10px':'11px';QG.lw=Lb.offsetWidth;QG.lh=Lb.offsetHeight}
  // 이름표는 화살표 바깥쪽에 붙인다(화살표를 가리지 않게)
  const cs=Math.cos(ang),sn=Math.sin(ang),e=R+16,lx=close?tx:px+cs*e+cs*((QG.lw||80)/2+2),ly=close?ty-50:py+sn*e+sn*((QG.lh||16)/2+2);
  Lb.style.transform=`translate(${lx}px,${ly}px) translate(-50%,-50%)`}
{const _u=update;update=function(dt){const r=_u(dt);try{if(P&&P.qg)qgTick();else QG.cur=null;qgDraw()}catch(err){if(window.__QA)throw err}return r}}
addEventListener('resize',()=>{QG.cvR=null});
// 미니맵: 금색 마름모 (밖이면 가장자리에 붙이고 방향 점)
{const _dm=drawMinimap;drawMinimap=function(){_dm();const c=P&&P.qg&&QG.cur;QG.last.mm=null;if(!c||(DG&&!DG.d))return;
  const S0=mm.width,m=S0/2600,px=(P.x-P.y)*KI,py=(P.x+P.y)*KI/2,mk=DG?m*1.4:m,ik=IN?S0*.8/Math.max(IN.R.w*1.4,IN.R.h*1.4)*1.3:0;
  let p=IN?{x:S0/2+((c.x-IN.rc.x)-(c.y-IN.rc.y))*KI*ik,y:S0/2+((c.x-IN.rc.x)+(c.y-IN.rc.y))*KI/2*ik}:{x:S0/2+mk*((c.x-c.y)*KI-px),y:S0/2+mk*((c.x+c.y)*KI/2-py)};
  const R0=S0/2-8,dx=p.x-S0/2,dy=p.y-S0/2,l=Math.hypot(dx,dy),out=l>R0;if(out)p={x:S0/2+dx/l*R0,y:S0/2+dy/l*R0};QG.last.mm={x:p.x,y:p.y,out};
  mctx.setTransform(1,0,0,1,0,0);const s=out?5:7,pul=.75+.25*Math.sin(time*5);mctx.globalAlpha=pul;mctx.fillStyle='#ffd36a';mctx.strokeStyle='#2a1a08';mctx.lineWidth=2;
  mctx.beginPath();mctx.moveTo(p.x,p.y-s);mctx.lineTo(p.x+s,p.y);mctx.lineTo(p.x,p.y+s);mctx.lineTo(p.x-s,p.y);mctx.closePath();mctx.stroke();mctx.fill();mctx.globalAlpha=1}}
// 큰 지도 · 지역 칸: 목표(다른 지역이면 그쪽 맵 끝 포탈)에 금색 마름모와 「길 안내」 이름
function qgMapPoint(id){const tg=qgTargetW(id);if(!tg)return null;const reg=tg.reg||'home';
  if(reg===REG.id)return{x:tg.room&&tg.door?tg.door.x:tg.x,y:tg.room&&tg.door?tg.door.y:tg.y,label:qgTxt(tg.label)};
  const h=regHop(REG.id,reg),e=EDGES.find(e=>e.to===h);return e?{x:e.x,y:e.y,label:qgRo(REGIONS[reg].n)+' 가는 길'}:null}
const qgRegS=(Wd,Hd)=>{const m=Math.min((Wd-30)/(WORLD*2*KI),(Hd-30)/(WORLD*KI)),ox=Wd/2,oy=Hd/2-WORLD*KI/2*m;return(x,y)=>({x:ox+(x-y)*KI*m,y:oy+(x+y)*KI/2*m})};
{const _wr=wmapRegion;wmapRegion=function(g,Wd,Hd){const r=_wr.apply(this,arguments);QG.last.reg=null;try{if(!P||!P.qg)return r;const t=qgMapPoint(P.qg);if(!t)return r;const s=qgRegS(Wd,Hd)(t.x,t.y);QG.last.reg={x:s.x,y:s.y};
  g.save();g.fillStyle='#ffd36a';g.strokeStyle='#1a1006';g.lineWidth=2.5;g.beginPath();g.moveTo(s.x,s.y-11);g.lineTo(s.x+11,s.y);g.lineTo(s.x,s.y+11);g.lineTo(s.x-11,s.y);g.closePath();g.stroke();g.fill();
  g.font=`700 12px ${FONT}`;g.textAlign='center';g.lineWidth=3;g.strokeStyle='rgba(0,0,0,.9)';const tx=`길 안내 · ${t.label}`,tw=g.measureText(tx).width,lx=Math.max(tw/2+8,Math.min(Wd-tw/2-8,s.x)),ly=s.y<60?s.y+30:s.y-30;g.fillStyle='rgba(20,13,6,.82)';g.fillRect(lx-tw/2-6,ly-15,tw+12,19);g.strokeText(tx,lx,ly);g.fillStyle='#ffe6a8';g.fillText(tx,lx,ly);g.restore()}catch(err){if(window.__QA)throw err}return r}}
// 큰 지도 · 세계 칸: 목표 지역 굵은 금색 테두리 + 지금 지역에서 이어지는 길
{const _ww=wmapWorld;wmapWorld=function(g,Wd,Hd){const r=_ww.apply(this,arguments);QG.last.world=null;try{if(!P||!P.qg)return r;const tg=qgTargetW(P.qg),G=WMAP.geo;if(!tg||!G)return r;const id=tg.reg||'home';if(!WPOS[id])return r;
  const p=G.pos(id),path=regPath(REG.id,id).filter(x=>WPOS[x]);QG.last.world={id,x:p.x,y:p.y};g.save();
  if(path.length>1){g.strokeStyle='rgba(255,211,106,.9)';g.lineWidth=4;g.lineCap='round';g.beginPath();const cut=(dx,dy)=>Math.min(dx?(G.w/2+4)/Math.abs(dx):1e9,dy?(G.h/2+4)/Math.abs(dy):1e9);
    for(let i=1;i<path.length;i++){const a=G.pos(path[i-1]),b=G.pos(path[i]),dx=b.x-a.x,dy=b.y-a.y,t=Math.min(.5,cut(dx,dy));g.moveTo(a.x+dx*t,a.y+dy*t);g.lineTo(b.x-dx*t,b.y-dy*t)}g.stroke()}
  g.strokeStyle='#ffd36a';g.lineWidth=4;g.beginPath();g.roundRect?g.roundRect(p.x-G.w/2-8,p.y-G.h/2-8,G.w+16,G.h+16,9):g.rect(p.x-G.w/2-8,p.y-G.h/2-8,G.w+16,G.h+16);g.stroke();
  const bx=p.x-G.w/2-8,by=p.y-G.h/2-8;g.fillStyle='#ffd36a';g.strokeStyle='#1a1006';g.lineWidth=2;g.beginPath();g.moveTo(bx,by-7);g.lineTo(bx+7,by);g.lineTo(bx,by+7);g.lineTo(bx-7,by);g.closePath();g.fill();g.stroke();
  // 글자는 칸 위가 아니라 캔버스 오른쪽 위 구석에 (칸이 촘촘한 휴대폰에서도 겹치지 않게)
  const sc=$('#wmapScr'),vx=sc&&sc.scrollWidth>sc.clientWidth+2?sc.scrollLeft+sc.clientWidth:Wd,tx=`◆ 길 안내 · ${REGIONS[id]?REGIONS[id].n:''}`;
  g.font=`700 ${Math.max(11,G.fs)}px ${FONT}`;g.textAlign='right';g.textBaseline='top';g.lineWidth=3;g.strokeStyle='rgba(0,0,0,.9)';g.strokeText(tx,vx-10,8);g.fillStyle='#ffe6a8';g.fillText(tx,vx-10,8);g.restore()}catch(err){if(window.__QA)throw err}return r}}
// 의뢰 일지(L) 단추 · 중요한 의뢰 칸(quest21)은 「지금 받기」 옆에
setTimeout(()=>{try{const _l=sqLogHtml;sqLogHtml=function(){const h=_l.apply(this,arguments);if(!P)return h;
  return h.replace(/(<button type="button" data-sqacc="([^"]+)">[^<]*<\/button>)/g,(m0,b,id)=>SQBY[id]?b+qgBtn('sq:'+id):b)}}catch(_){}},0);
// 끝낼 때 · 포기할 때 바로 정리
{const _f=questFinish;questFinish=function(){const r=_f.apply(this,arguments);try{qgTick(true)}catch(_){}return r}}
{const _f=sqFinish;sqFinish=function(){const r=_f.apply(this,arguments);try{qgTick(true)}catch(_){}return r}}
{const _a=sqAbandon;sqAbandon=function(id){const on=P&&P.qg==='sq:'+id&&sqState().a[id];const r=_a.apply(this,arguments);try{if(on&&!sqState().a[id]){delete P.qg;QG.cur=null;msg('길 안내를 껐습니다','#d6b262')}}catch(_){}return r}}
// 저장 · 불러오기
const qgClean=v=>typeof v==='string'&&v.length<=40&&/^(main:\d{1,3}|sq:[\w-]{1,32})$/.test(v)?v:null;
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P&&qgClean(P.qg))d.qg=P.qg}catch(_){}return d}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok&&P)try{const v=qgClean(d&&d.qg);if(v&&qgValid(v))P.qg=v;else delete P.qg;QG.cur=null;QG.t=0}catch(err){if(window.__QA)throw err}return ok}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{QG,qgSet,qgTargetW,qgLocal,qgValid,qgTick,qgMapPoint})}catch(_){}},0);
