/* ---------- 110레벨 이후: 아홉 첨탑 대성당 (사용자 2026-11-02 「성당같은 건축물은 … 하나의 큰 던전으로 · 성당의 탁트인 내부가 좀 더 잘 구현된 쪽」) ----------
   · 바깥: 첨탑 광장 북쪽에 붉은 벽돌 · 흰 아치 회랑 · 알록달록한 양파 지붕 탑 여덟 + 가운데 높은 뾰족 탑. 문으로 들어간다(동굴 그림은 숨김).
   · 안: 무작위 방이 아니라 정해진 모양. 가운데 둥근 큰 홀(기둥 여덟) · 둘레에 작은 예배당 여덟(저마다 색) · 예배당을 잇는 둥근 복도 · 아래 현관.
   · 진행: ① 예배당마다 지키는 몬스터를 물리치고 그 예배당 종을 울린다(여덟 곳) ② 큰 홀 색유리가 빛난 순서(네 색)대로 종을 다시 친다(틀리면 처음부터 · 조금 아픔)
           ③ 홀 가운데에 「첨탑의 주인 바실리온」(Lv140, 지옥) · 무너지는 둥근 지붕 조각 · 색유리 빛줄기 · 반쯤 남으면 금박 기사.
   · 같이 하기: 종 · 순서는 방장이 정하고 모두에게 보낸다(참가자가 친 종은 방장에게 부탁). 저장에 새 값 없음(쓰러뜨린 횟수만 P.r110.cath).
   · 그림은 모두 코드로 그림(코덱스 그림이 오면 바꿔 끼움). */
const R1C={cx:18,cy:15,hr:7.0,ring:10.5,cr:3.1,pilR:4,hold:95,bellR:340,act:-1,hudT:0,sendT:0};
R1C.ang=[...Array(8)].map((_,k)=>-1.1781+k*.7854);// 예배당: 위쪽 왼편부터 시계 방향(아래 한가운데는 현관이라 비움)
R1C.chap=R1C.ang.map(a=>({u:R1C.cx+Math.cos(a)*R1C.ring,v:R1C.cy+Math.sin(a)*R1C.ring}));
R1C.pil=[...Array(8)].map((_,k)=>[Math.round(R1C.cx+Math.cos(k*.7854)*R1C.pilR),Math.round(R1C.cy+Math.sin(k*.7854)*R1C.pilR)]);
const r1cW=(u,v)=>({x:OX+(u+.5)*TS,y:OY+(v+.5)*TS});
const r1cOn=()=>!!(DG&&DG.d&&DG.d.cath);
const r1cPilAt=(i,j)=>R1C.pil.some(p=>p[0]===i&&p[1]===j);
function r110cGen(){const g=new Uint8Array(DN*DN),dig=(i,j)=>{if(i>0&&j>0&&i<DN-1&&j<DN-1)g[tIdx(i,j)]=1};
  for(let j=1;j<DN-1;j++)for(let i=1;i<DN-1;i++){const d=Math.hypot(i-R1C.cx,j-R1C.cy);
    if(d<=R1C.hr||Math.abs(d-R1C.ring)<=1.05||R1C.chap.some(c=>Math.hypot(i-c.u,j-c.v)<=R1C.cr))g[tIdx(i,j)]=1}
  // 홀 → 예배당 넓은 통로 (세 칸)
  for(const a of R1C.ang)for(let r=R1C.hr-1;r<=R1C.ring;r+=.35){const u=R1C.cx+Math.cos(a)*r,v=R1C.cy+Math.sin(a)*r;for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)dig(Math.round(u)+x,Math.round(v)+y)}
  // 현관 → 홀 (세 칸 · 아래)
  for(let j=Math.floor(R1C.cy+R1C.hr)-1;j<=30;j++)for(let i=17;i<=19;i++)dig(i,j);
  for(let j=30;j<=33;j++)for(let i=15;i<=21;i++)dig(i,j);
  for(const [i,j] of R1C.pil)g[tIdx(i,j)]=0;
  const rooms=[{i:15,j:30,w:7,h:4,cx:18,cy:31},{i:12,j:9,w:13,h:13,cx:18,cy:15}];
  for(const c of R1C.chap){const ci=Math.round(c.u),cj=Math.round(c.v);rooms.push({i:ci-2,j:cj-2,w:5,h:5,cx:ci,cy:cj})}
  return{g,rooms}}
{const _gd=genDungeon;genDungeon=function(d){return d&&d.cath?r110cGen():_gd.apply(this,arguments)}}

/* ===== 상태 ===== */
const r110cNew=()=>({bell:[0,0,0,0,0,0,0,0],seq:[],prog:0,st:0,dT:5,gT:8,kn:0,show:0});
const r110cBells=()=>R1C.chap.map((c,k)=>{const a=R1C.ang[k],p=r1cW(c.u+Math.cos(a)*1.3,c.v+Math.sin(a)*1.3);return{x:p.x,y:p.y,k}});
function r110cClear(k){const c=r1cW(R1C.chap[k].u,R1C.chap[k].v);return !enemies.some(e=>!e.dead&&!e.ally&&e.hp>0&&Math.hypot(e.x-c.x,e.y-c.y)<R1C.bellR)}
const r110cCol=k=>R110.chap[k][1],r110cNm=k=>R110.chap[k][0];
// 처음 들어갈 때(방장 · 혼자): 원래 배치를 지우고 예배당마다 지키는 무리 · 복도 몇 · 홀은 비워 둠(보스 자리)
function r110cInit(){const d=DG.d,L=DG.lvl;enemies=[];DG.boss=null;DG.ct=r110cNew();DG.bells=r110cBells();
  for(const w of DG.walls)w.h=r1cPilAt(w.i,w.j)?120:Math.hypot(w.i-R1C.cx,w.j-R1C.cy)<R1C.ring-1.2?64:180;// 홀과 예배당 사이는 낮은 난간 벽(안이 탁 트여 보이게) · 바깥 벽은 높게
  R1C.chap.forEach((c,k)=>{const p=r1cW(c.u,c.v),sp=()=>{for(let t=0;t<12;t++){const x=p.x+rnd(-170,170),y=p.y+rnd(-170,170);if(dgFree(x,y,26))return{x,y}}return p};
    if(k%2===0){dgMob(d.minis[(k>>1)%2],p.x,p.y,L+1);for(let n=0;n<2;n++){const q=sp();dgMob(pick(d.mobs),q.x,q.y,L)}}
    else for(let n=0;n<4;n++){const q=sp();dgMob(pick(d.mobs),q.x,q.y,L,{elite:n===0})}});
  for(let k=0;k<8;k++){const a=R1C.ang[k]+.3927,p=r1cW(R1C.cx+Math.cos(a)*R1C.ring,R1C.cy+Math.sin(a)*R1C.ring);if(dgFree(p.x,p.y,20))dgMob(pick(d.mobs),p.x,p.y,L)}
  msg('작은 예배당 여덟 곳의 종을 모두 울리면 큰 홀의 색유리가 빛납니다','#ffe8a0');
  banner={t:d.n,sub:`탁 트인 큰 홀 · 작은 예배당 여덟 · 몬스터 레벨 ${L}~${L+5}`,col:'#ffd08a',life:3,max:3}}
{const _ed=enterDungeon;enterDungeon=function(c){const r=_ed.apply(this,arguments);try{if(r1cOn()&&!DG.kept22&&!DG.ct&&!NET.guest)r110cInit()}catch(e){if(window.__QA)throw e}return r}}
{const _ne=netEnterDg;netEnterDg=function(D){const r=_ne.apply(this,arguments);try{if(r1cOn()&&!DG.ct){DG.ct=r110cNew();DG.bells=r110cBells()}}catch(e){if(window.__QA)throw e}return r}}

/* ===== 종 · 색유리 순서 ===== */
function r110cTell(t,c){msg(t,c);if(NET.on&&NET.host)v20Send('r1cs',Object.assign(r110cPack(),{m:t,c}))}
const r110cPack=()=>{const C=DG.ct;return{b:C.bell.join(''),s:C.seq.join(''),p:C.prog,st:C.st}};
function r110cRing(k,who){const C=DG&&DG.ct;if(!C||!(k>=0&&k<8))return false;const b=DG.bells[k],col=r110cCol(k);
  const fx=()=>{rings.push({x:b.x,y:b.y,r:10,max:300,life:1,col});rings.push({x:b.x,y:b.y,r:10,max:170,life:.7,col:'#fff6d8'});burst(b.x,b.y-60,col,20,140,3,5)};
  if(C.st===0){if(C.bell[k]){if(!who)msg(`${r110cNm(k)} 예배당 종은 이미 울렸습니다`,'#a39d8f');return false}
    if(!r110cClear(k)){if(!who)msg(`${r110cNm(k)} 예배당을 지키는 몬스터를 먼저 물리치세요`,'#ff9a6a');return false}
    C.bell[k]=1;fx();const n=C.bell.filter(x=>x).length;
    if(n<8){r110cTell(`${r110cNm(k)} 종이 울립니다 (${n}/8)`,col);return true}
    const o=[0,1,2,3,4,5,6,7];for(let i=7;i>0;i--){const j=Math.floor(R()*(i+1));[o[i],o[j]]=[o[j],o[i]]}C.seq=o.slice(0,4);C.prog=0;C.st=1;C.show=0;
    banner={t:'색유리가 빛납니다',sub:'큰 홀 가운데 색유리가 빛난 순서대로 예배당 종을 다시 치세요',col:'#ffe8a0',life:3.5,max:3.5};
    r110cTell(`여덟 종이 모두 울렸습니다 · 색유리 순서: ${C.seq.map(r110cNm).join(' → ')}`,'#ffe8a0');return true}
  if(C.st===1){if(k===C.seq[C.prog]){C.prog++;fx();if(C.prog<4){r110cTell(`맞는 종입니다 (${C.prog}/4)`,col);return true}
      C.st=2;r110cBoss();return true}
    C.prog=0;rings.push({x:b.x,y:b.y,r:10,max:220,life:.6,col:'#ff4a3a'});shake=Math.max(shake,8);
    if(!P.dead&&DG)hitPlayer(maxHp()*.05,null);if(NET.host)for(const r of NET.peers.values())if(!r.dead&&netSame(r))netHit(r,(r.max||1000)*.05,null);
    r110cTell('종소리가 어긋났습니다! 색유리 순서를 처음부터 다시','#ff7a5a');return false}
  if(!who)msg('종은 이제 조용합니다','#a39d8f');return false}
function r110cBoss(){const p=r1cW(R1C.cx,R1C.cy),b=dgMob(DG.d.boss,p.x,p.y,DG.lvl+5);DG.boss=b;DG.k22bp={x:p.x,y:p.y};b.aggroed=true;
  rings.push({x:p.x,y:p.y,r:10,max:420,life:1.2,col:'#ffd08a'});shake=Math.max(shake,12);flash={col:'#ffe8a0',a:.35};
  banner={t:TYPES[DG.d.boss].n,sub:'아홉 첨탑의 종이 모두 맞았습니다 · 홀 가운데로 주인이 내려옵니다',col:'#ffd08a',life:3,max:3};
  r110cTell(`${TYPES[DG.d.boss].n}이(가) 큰 홀에 내려왔습니다!`,'#ffd08a')}
V20NET.r1cb=(m,peer)=>{if(!NET.host||!r1cOn()||!DG.ct||!peer||!netSame(peer))return;const k=m.i|0,b=DG.bells[k];if(!b||Math.hypot(peer.x-b.x,peer.y-b.y)>R1C.hold+80)return;r110cRing(k,peer)};
V20NET.r1cs=m=>{if(NET.host||!r1cOn())return;const C=DG.ct||(DG.ct=r110cNew());if(!DG.bells)DG.bells=r110cBells();
  if(typeof m.b==='string'&&m.b.length===8)C.bell=[...m.b].map(x=>x==='1'?1:0);if(typeof m.s==='string')C.seq=[...m.s].map(x=>x|0).filter(x=>x>=0&&x<8).slice(0,4);
  C.prog=Math.max(0,Math.min(4,m.p|0));const st=Math.max(0,Math.min(3,m.st|0));if(st===1&&C.st!==1)C.show=0;C.st=st;if(m.m)msg(String(m.m).slice(0,80),typeof m.c==='string'?m.c:'#ffe8a0')};

/* ===== 보스: 무너지는 둥근 지붕 · 색유리 빛줄기 · 금박 기사 ===== */
function r110cBossTick(dt){const C=DG.ct,b=DG.boss;if(!b||b.dead||!(b.hp>0)||!b.aggroed)return;
  const tg=[];if(!P.dead)tg.push(P);if(NET.host)for(const r of NET.peers.values())if(!r.dead&&netSame(r))tg.push(r);if(!tg.length)return;
  const hc=r1cW(R1C.cx,R1C.cy);
  C.dT-=dt;if(C.dT<=0){C.dT=b.rage?6:8.5;
    for(let n=0;n<4;n++)for(let t=0;t<8;t++){const a=R()*6.283,r=R()*R1C.hr*TS*.85,x=hc.x+Math.cos(a)*r,y=hc.y+Math.sin(a)*r;if(dgFree(x,y,30)){warns.push({x,y,rad:120,t:1.5,max:1.5,dmg:b.dmg*1.5,col:'#e0b030',src:b});break}}
    for(const q of tg)warns.push({x:q.x+rnd(-20,20),y:q.y+rnd(-20,20),rad:110,t:1.6,max:1.6,dmg:b.dmg*1.5,col:'#e0b030',src:b});
    if(!C.dm){C.dm=1;msg('둥근 지붕 조각이 떨어집니다! 금빛 원 밖으로','#ffd08a')}}
  C.gT-=dt;if(C.gT<=0){C.gT=b.rage?9:12.5;const q=pick(tg),a=Math.atan2(q.y-b.y,q.x-b.x),col=r110cCol(ri(0,7));
    for(let i=1;i<=9;i++){const x=b.x+Math.cos(a)*i*105,y=b.y+Math.sin(a)*i*105;if(!dgFree(x,y,10))break;warns.push({x,y,rad:72,t:1.1+i*.06,max:1.1+i*.06,dmg:b.dmg*1.2,col,src:b})}
    if(!C.gm){C.gm=1;msg('색유리 빛줄기! 줄을 벗어나세요','#ffd0f0')}}
  if(!C.kn&&b.hp<b.max*.5){C.kn=1;const n=tg.length>1?3:2;let made=0;
    for(const [i,j] of R1C.pil){if(made>=n)break;const c=tc(i,j),a=Math.atan2(hc.y-c.y,hc.x-c.x),x=c.x+Math.cos(a)*110,y=c.y+Math.sin(a)*110;if(!dgFree(x,y,20))continue;
      const m=dgMob('ct_icon',x,y,Math.max(1,b.lvl-2));m.aggroed=true;rings.push({x,y,r:4,max:60,life:.5,col:'#ffd08a'});made++}
    banner={t:'금박 기사',sub:'색유리가 깨지며 금박 성화 기사들이 내려옵니다',col:'#ffd08a',life:2.4,max:2.4}}}
{const _r=k22BossReset;k22BossReset=function(){const r=_r.apply(this,arguments);if(r1cOn()&&DG.ct&&DG.ct.st===2){DG.ct.kn=0;DG.ct.dT=5;DG.ct.gT=8}return r}}
Object.assign(R110_DEX,{b_ct_tsar:'첨탑의 주인 바실리온 (아홉 첨탑 대성당)'});
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&e&&e.k==='b_ct_tsar'&&r1cOn()){const S0=r110S();S0.cath=(S0.cath|0)+1;if(DG.ct)DG.ct.st=3}}catch(err){if(window.__QA)throw err}return r}}

/* ===== 매 프레임 · 할 일(F) ===== */
function r110cTick(dt){if(!r1cOn()||!DG.ct)return;const C=DG.ct;if(!DG.bells)DG.bells=r110cBells();C.show+=dt;
  if(!NET.guest){if(C.st===2)r110cBossTick(dt);if(NET.on&&NET.host){R1C.sendT-=dt;if(R1C.sendT<=0){R1C.sendT=2;v20Send('r1cs',r110cPack())}}}
  if(P.dead||act)return;R1C.act=-1;for(const b of DG.bells)if(Math.hypot(P.x-b.x,P.y-b.y)<R1C.hold){act='r110c_bell';R1C.act=b.k;return}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(!P||paused)return r;try{r110cTick(dt)}catch(e){if(window.__QA)throw e}return r}}
{const _tl=twActLabel;twActLabel=function(a){if(a!=='r110c_bell')return _tl.apply(this,arguments);const C=DG&&DG.ct,k=R1C.act;if(!C||k<0)return '';const nm=r110cNm(k);
  if(C.st===0)return C.bell[k]?`${nm} 예배당 종 · 울림`:r110cClear(k)?`${nm} 예배당 종 울리기 (F)`:`${nm} 예배당 종 · 지키는 몬스터를 먼저`;
  if(C.st===1)return `${nm} 종 치기 · 색유리 순서 ${C.prog+1}번째 (F)`;return `${nm} 예배당 종`}}
{const _da=doAct;doAct=function(){if(act!=='r110c_bell')return _da.apply(this,arguments);const k=R1C.act;if(k<0||!DG||!DG.ct)return;
  if(NET.on&&NET.guest){v20Send('r1cb',{i:k},NET.hostId);return}r110cRing(k,null)}}

/* ===== 바깥: 첨탑 광장 북쪽 대성당 건물 ===== */
const R1C_B={W:440,D:440};
function r110cCamp(){const L=RCACHE[R110.sq];if(!L||!L.town)return null;const t=L.town,c=L.caves.find(c=>c.cave&&c.cave.cath);if(!c)return null;const {W,D}=R1C_B;
  const b=twMkBld(t,{id:'r110_cath',st:'arden',dx:c.x-t.x,dy:c.y+80-18-D/2-t.y,W,D,h:70,rh:56,big:1,tall:1,door:{face:'y',f:.5},v:1,lamp:1,label:'아홉 첨탑 대성당',light:160});b.r1c=1;
  const F=b.foot[0],in_=d=>d.x>F[0]-60&&d.x<F[2]+60&&d.y>F[1]-60&&d.y<F[3]+70;
  for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(d.k==='cave'||d.k==='edgeportal'||d.k==='tfolk'||d.k==='npc'||d.town===t&&d.k==='bld')continue;if(in_(d))L.decor.splice(i,1)}
  L.decor.push(b);(TW.blds[L.id]||(TW.blds[L.id]=[])).push(b);if(L.lights)L.lights.push(b);if(typeof tw22Safe==='function')tw22Safe(L,t);return b}
const R1C_CAMP=r110cCamp();
{const _tg=terrGrid;terrGrid=function(id){const w=_tg.apply(this,arguments);try{const b=R1C_CAMP;if(w&&id===R110.sq&&b){const F=b.foot[0];
  for(let j=0;j<TNC;j++)for(let i=0;i<TNC;i++){const k=terrIdx(i,j);if(!w[k])continue;const x=(i+.5)*TCS,y=(j+.5)*TCS;if(x>F[0]-200&&x<F[2]+200&&y>F[1]-200&&y<F[3]+260)w[k]=0}}}catch(e){if(window.__QA)throw e}return w}}
delete TERR[R110.sq];
{const _dc=drawCave;drawCave=function(d){if(!DG&&d.cave&&d.cave.cath)return;return _dc.apply(this,arguments)}}
// 양파 지붕: (x,y)는 지붕 밑 가운데(화면) · rx 반지름 · h 높이 · 무늬 spiral/zig/dia/stripe
function r1cOnion(g,x,y,rx,h,c1,c2,pat){const path=()=>{g.beginPath();g.moveTo(x-rx*.8,y);g.bezierCurveTo(x-rx*1.5,y-h*.32,x-rx*.95,y-h*.72,x,y-h);g.bezierCurveTo(x+rx*.95,y-h*.72,x+rx*1.5,y-h*.32,x+rx*.8,y);g.closePath()};
  g.save();path();g.fillStyle=c1;g.fill();g.clip();g.fillStyle=c2;const w=rx*.42;
  if(pat==='spiral')for(let i=-6;i<=6;i++){const x0=x+i*w*1.25;g.beginPath();g.moveTo(x0-rx*.6,y+2);g.quadraticCurveTo(x0,y-h*.5,x0+rx*.7,y-h-2);g.lineTo(x0+rx*.7+w*.6,y-h-2);g.quadraticCurveTo(x0+w*.6,y-h*.5,x0-rx*.6+w*.6,y+2);g.fill()}
  else if(pat==='zig')for(let r=0;r<5;r++){const yy=y-h*(.12+r*.18);g.beginPath();for(let u=-1.6;u<=1.6;u+=.4){const xx=x+u*rx,yz=yy+((Math.round(u/.4))%2?-h*.06:h*.06);u===-1.6?g.moveTo(xx,yz):g.lineTo(xx,yz)}g.lineWidth=h*.06;g.strokeStyle=c2;g.stroke()}
  else if(pat==='dia')for(let r=0;r<6;r++)for(let u=-4;u<=4;u++){const cx=x+(u+(r%2)*.5)*rx*.42,cy=y-h*(.08+r*.16);g.beginPath();g.moveTo(cx,cy-h*.07);g.lineTo(cx+rx*.13,cy);g.lineTo(cx,cy+h*.07);g.lineTo(cx-rx*.13,cy);g.fill()}
  else for(let u=-4;u<=4;u+=2){g.beginPath();g.ellipse(x+u*rx*.2,y-h*.45,rx*.09,h*.6,0,0,6.283);g.fill()}
  const gr=g.createLinearGradient(x-rx*1.3,0,x+rx*1.3,0);gr.addColorStop(0,'rgba(255,250,230,.38)');gr.addColorStop(.42,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(0,0,0,.42)');g.fillStyle=gr;g.fillRect(x-rx*1.6,y-h-4,rx*3.2,h+8);g.restore();
  path();g.strokeStyle='rgba(40,20,10,.55)';g.lineWidth=1.2;g.stroke();
  g.strokeStyle='#e8c050';g.lineWidth=2;g.beginPath();g.moveTo(x,y-h);g.lineTo(x,y-h-22);g.stroke();g.beginPath();g.moveTo(x-6,y-h-15);g.lineTo(x+6,y-h-15);g.stroke();g.fillStyle='#ffe08a';g.beginPath();g.arc(x,y-h-3,2.6,0,6.283);g.fill()}
// 흰 반달 장식 띠(코코시니크 같은 아치 줄): 원기둥 꼭대기 앞쪽 반 둘레
function r1cArches(g,c,rx,ry,n,col){for(let i=0;i<n;i++){const a=Math.PI*(i+.5)/n,x=c.x-Math.cos(a)*rx,y=c.y+Math.sin(a)*ry;g.fillStyle=col;g.beginPath();g.arc(x,y,rx/n*1.15,Math.PI,0);g.fill();g.strokeStyle='rgba(60,30,20,.4)';g.lineWidth=.8;g.stroke()}}
const R1C_DOME=[['#2a8a4a','#f0d050','spiral'],['#c83a2a','#f4ecd8','zig'],['#2a5ab8','#f4ecd8','spiral'],['#e8b030','#2a7a4a','dia'],['#7a3aa0','#f0c040','stripe'],['#2a9a8a','#e84a3a','spiral'],['#e8702a','#f4e8c8','zig'],['#3a8ad0','#f0c840','dia']];
const r110cExtSpr=()=>SC.get('r110/cath',780,800,390,600,g=>{g.translate(390,600);const I=isoP;
  Kit.shadow(g,20,10,360,170,1);
  // 바닥 회랑: 붉은 벽돌 + 흰 아치 + 흰 처마
  const base=twBox(g,0,0,0,440,440,72,'#a8443a',{tex:'stone',texA:.35});
  const arch=(face,u)=>{const P0=face==='y'?(a,z)=>I(u+a,220,z):(a,z)=>I(220,u+a,z);g.fillStyle='#2a120e';g.beginPath();const a=P0(-13,10),b=P0(-13,42),c=P0(13,42),d=P0(13,10),m=P0(0,56);
    g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.quadraticCurveTo(m.x,m.y,c.x,c.y);g.lineTo(d.x,d.y);g.closePath();g.fill();g.strokeStyle='#efe6d4';g.lineWidth=2.2;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.quadraticCurveTo(m.x,m.y,c.x,c.y);g.lineTo(d.x,d.y);g.stroke()};
  for(let u=-190;u<=190;u+=38)if(Math.abs(u)>30)arch('y',u);for(let u=-190;u<=190;u+=38)arch('x',u);
  twBox(g,0,0,72,452,452,9,'#ece2cc');
  twBox(g,0,0,81,380,380,44,'#b8503e',{tex:'stone',texA:.3});twBox(g,0,0,125,388,388,7,'#ece2cc');
  // 정문: +y면 가운데 아치 · 금빛 테 · 계단
  {const s0=I(0,232,0);twBox(g,0,250,0,120,40,10,'#c8b8a0');const a=I(-34,221,0),b=I(-34,221,58),c=I(34,221,58),d=I(34,221,0),m=I(0,221,92);
    g.fillStyle='#1a0c08';g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.quadraticCurveTo(m.x,m.y,c.x,c.y);g.lineTo(d.x,d.y);g.closePath();g.fill();g.strokeStyle='#e8c050';g.lineWidth=3.5;g.stroke();
    g.fillStyle='rgba(255,200,120,.35)';g.beginPath();g.ellipse(s0.x,s0.y-26,14,22,0,0,6.283);g.fill()}
  // 탑들 (뒤에서 앞으로)
  const T=[];for(let k=0;k<4;k++){const a=k*1.5708;T.push({x:Math.cos(a)*150,y:Math.sin(a)*150,r:38,h:150,k:k*2})}
  for(let k=0;k<4;k++){const a=.7854+k*1.5708;T.push({x:Math.cos(a)*165,y:Math.sin(a)*165,r:27,h:105,k:k*2+1})}
  T.push({x:0,y:0,c:1});T.sort((a,b)=>(a.x+a.y)-(b.x+b.y));
  for(const t of T){if(t.c){const c1=twCyl(g,0,0,132,66,190,'#c4523e',{bands:[.3,.62],bandC:'#efe6d4'});r1cArches(g,I(0,0,322),c1.rx,c1.ry,7,'#efe6d4');
      const c2=twCyl(g,0,0,322,54,46,'#efe6d4',{bands:[.5],bandC:'#c4523e'});const b0=I(0,0,368),rx=c2.rx,top=b0.y-210;
      g.save();g.beginPath();g.moveTo(b0.x-rx,b0.y);g.lineTo(b0.x,top);g.lineTo(b0.x+rx,b0.y);g.ellipse(b0.x,b0.y,rx,c2.ry,0,0,Math.PI);g.closePath();g.fillStyle='#2a7a4a';g.fill();g.clip();
      for(let r=0;r<12;r++)for(let u=-5;u<=5;u++){const cx=b0.x+(u+(r%2)*.5)*rx*.26,cy=b0.y-r*17-6;g.fillStyle=(r+u)%3?'#e8c050':'#f4ecd8';g.beginPath();g.moveTo(cx,cy-5);g.lineTo(cx+5,cy);g.lineTo(cx,cy+5);g.lineTo(cx-5,cy);g.fill()}
      const gr=g.createLinearGradient(b0.x-rx,0,b0.x+rx,0);gr.addColorStop(0,'rgba(255,250,230,.3)');gr.addColorStop(.45,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.45)');g.fillStyle=gr;g.fillRect(b0.x-rx,top,rx*2,b0.y-top+20);g.restore();
      g.strokeStyle='rgba(40,20,10,.5)';g.lineWidth=1.2;g.beginPath();g.moveTo(b0.x-rx,b0.y);g.lineTo(b0.x,top);g.lineTo(b0.x+rx,b0.y);g.stroke();
      r1cOnion(g,b0.x,top+6,12,30,'#e8c050','#fff0b0','stripe');continue}
    const D0=R1C_DOME[t.k],body=t.k%4===1?'#efe6d4':'#c4523e',trim=t.k%4===1?'#c4523e':'#efe6d4';
    const c1=twCyl(g,t.x,t.y,132,t.r,t.h,body,{bands:[.35,.7],bandC:trim});r1cArches(g,I(t.x,t.y,132+t.h),c1.rx,c1.ry,5,trim);
    const c2=twCyl(g,t.x,t.y,132+t.h,t.r*.72,16,D0[0],{bands:[.5],bandC:D0[1]});const p=I(t.x,t.y,148+t.h);r1cOnion(g,p.x,p.y,c2.rx*1.05,t.r*2.3,D0[0],D0[1],D0[2])}},{scale:Math.min(1.5,Math.max(1,DPR))});
{const _db=twDrawBld;twDrawBld=function(d){if(!d.r1c)return _db.apply(this,arguments);const s=d._s,e=r110cExtSpr();if(!s)return;if(!e)return _db.apply(this,arguments);
  let a=1;if(!P.dead&&P._s){const ps=P._s,front=P.x>d.foot[0][2]||P.y>d.foot[0][3];if(!front&&ps.x>s.x-330&&ps.x<s.x+330&&ps.y>s.y-560&&ps.y<s.y+170)a=.45}
  ctx.globalAlpha=a;SC.draw(ctx,e,s.x,s.y);ctx.globalAlpha=1}}

/* ===== 안: 기둥 · 바닥 문양 · 종 · 빛 ===== */
const r1cPilSpr=()=>SC.get('r110/cpil',110,300,55,262,g=>{g.translate(55,262);Kit.shadow(g,6,4,48,16,1);
  twBox(g,0,0,0,64,64,18,'#c8bca8',{tex:'stone',texA:.4});twCyl(g,0,0,18,19,190,'#efe6d4',{bands:[.12,.36,.6,.84],bandC:'#b8483a'});
  for(let i=0;i<4;i++){const p=isoP(0,0,40+i*46);g.fillStyle=R110.chap[i*2][1];g.beginPath();g.moveTo(p.x,p.y-8);g.lineTo(p.x+6,p.y);g.lineTo(p.x,p.y+8);g.lineTo(p.x-6,p.y);g.fill()}
  twCyl(g,0,0,208,26,10,'#e8c050');twBox(g,0,0,218,58,58,12,'#d8ccb8',{tex:'stone',texA:.3})},{scale:Math.max(1.25,DPR)});
{const _dw=drawWall;drawWall=function(w){if(!(r1cOn()&&r1cPilAt(w.i,w.j)))return _dw.apply(this,arguments);const e=r1cPilSpr();if(!e)return _dw.apply(this,arguments);
  const s=w._s,ps=P._s||W2S(P.x,P.y),front=w.x+w.y>P.x+P.y&&Math.abs(s.x-ps.x)<90&&s.y-ps.y>-30&&s.y-ps.y<240;ctx.globalAlpha=front?.5:1;SC.draw(ctx,e,s.x,s.y);ctx.globalAlpha=1}}
{const _wi=wbInit;wbInit=function(){const r=_wi.apply(this,arguments);if(r1cOn())for(const c of WB.ch.values())if(c.walls.some(w=>r1cPilAt(w.i,w.j)))c.never=1;return r}}
// 바닥: 큰 홀 둥근 무늬(여덟 색 꽃잎) · 예배당 둥근 띠(종을 울리면 밝게) · 색유리 순서 때는 다음 색 꽃잎이 숨 쉼
{const _df=drawDungeonFloor;drawDungeonFloor=function(){const r=_df.apply(this,arguments);if(!r1cOn()||!DG.ct)return r;try{r110cFloor()}catch(e){if(window.__QA)throw e}return r}}
function r110cFloor(){const C=DG.ct,hc=r1cW(R1C.cx,R1C.cy),R0=R1C.hr*TS-40;ctx.save();G();
  ctx.globalAlpha=.32;ctx.fillStyle='#3a1a14';ctx.beginPath();ctx.arc(hc.x,hc.y,R0,0,6.283);ctx.fill();
  const nx=C.st===1?C.seq[C.prog]:-1;
  for(let k=0;k<8;k++){const a=R1C.ang[k],lit=C.bell[k],on=k===nx;ctx.globalAlpha=on?.45+.3*Math.sin(time*5):lit?.34:.16;ctx.fillStyle=r110cCol(k);ctx.beginPath();ctx.moveTo(hc.x,hc.y);
    ctx.arc(hc.x,hc.y,R0*.92,a-.33,a+.33);ctx.closePath();ctx.fill()}
  ctx.globalAlpha=.55;ctx.strokeStyle='#e8c050';ctx.lineWidth=10;for(const f of [.35,.62,.95]){ctx.beginPath();ctx.arc(hc.x,hc.y,R0*f,0,6.283);ctx.stroke()}
  ctx.globalAlpha=.5;ctx.fillStyle='#f4e8c8';ctx.beginPath();for(let i=0;i<16;i++){const a=i*.3927,r=i%2?R0*.12:R0*.3;ctx.lineTo(hc.x+Math.cos(a)*r,hc.y+Math.sin(a)*r)}ctx.closePath();ctx.fill();
  R1C.chap.forEach((c,k)=>{const p=r1cW(c.u,c.v);ctx.globalAlpha=C.bell[k]?.55:.25;ctx.strokeStyle=r110cCol(k);ctx.lineWidth=C.bell[k]?16:9;ctx.beginPath();ctx.arc(p.x,p.y,R1C.cr*TS-60,0,6.283);ctx.stroke()});
  ctx.restore()}
const r1cBellSpr=()=>SC.get('r110/cbell',80,150,40,140,g=>{g.translate(40,140);Kit.shadow(g,4,3,40,12,1);
  for(const x of [-26,26])Kit.solid(g,q=>q.rect(x-3,-118,6,118),x-3,-118,x+3,0,'#6a4028',{tex:'wood',texA:.5});Kit.solid(g,q=>q.rect(-32,-124,64,8),-32,-124,32,-116,'#7a4a2e',{tex:'wood',texA:.5});
  Kit.solid(g,q=>{q.moveTo(-6,-114);q.quadraticCurveTo(-8,-96,-20,-72);q.lineTo(20,-72);q.quadraticCurveTo(8,-96,6,-114);q.closePath()},-20,-114,20,-72,'#d8a840',{rim:'rgba(255,240,190,.8)',lineW:.6});
  g.fillStyle='#7a5a20';g.beginPath();g.arc(0,-70,4,0,6.283);g.fill()},{scale:2});
if(typeof wbDraw==='function'){const _w=wbDraw;wbDraw=function(vis,ents){const r=_w.apply(this,arguments);if(r1cOn()&&DG.bells)for(const b of DG.bells){const s=W2S(b.x,b.y);if(!onScreen(s,160))continue;b._s=s;b.r1cb=1;ents.push(b)}return r}}
{const _dd=drawDecor;drawDecor=function(d){if(!d.r1cb)return _dd.apply(this,arguments);const s=d._s,C=DG&&DG.ct;if(!C)return;const e=r1cBellSpr(),k=d.k,col=r110cCol(k),swing=C.bell[k]?Math.sin(time*6+k)*.12:0;
  if(e){ctx.save();ctx.translate(s.x,s.y);SC.draw(ctx,e,0,0);ctx.restore()}
  if(C.bell[k]||C.st===1&&C.seq[C.prog]===k){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5+.25*Math.sin(time*4+k)+swing;glow(s.x,s.y-92,34,col);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  if(dist(P,d)<300)r110Name(s,`${r110cNm(k)} 예배당 종`,C.bell[k]?col:'#e8e0d0',150)}}
{const _gl=groundLights;groundLights=function(Lt){_gl(Lt);if(!r1cOn())return;const hc=W2S(...Object.values(r1cW(R1C.cx,R1C.cy)));Lt(hc.x,hc.y,900,.75);
  for(const [i,j] of R1C.pil){const c=tc(i,j),s=W2S(c.x,c.y);Lt(s.x,s.y-60,260,.45)}
  R1C.chap.forEach((c,k)=>{const p=r1cW(c.u,c.v),s=W2S(p.x,p.y);Lt(s.x,s.y,DG.ct&&DG.ct.bell[k]?520:380,.65)})}}
// 화면: 색유리 빛 기둥(홀) · 위쪽 진행 막대
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);if(!r1cOn()||!DG.ct)return;try{r110cGlow()}catch(e){if(window.__QA)throw e}}}
function r110cGlow(){const C=DG.ct,o=ctx.globalCompositeOperation;S();ctx.globalCompositeOperation='lighter';
  for(let k=0;k<8;k++){const a=R1C.ang[k],p=r1cW(R1C.cx+Math.cos(a)*(R1C.hr-1.3),R1C.cy+Math.sin(a)*(R1C.hr-1.3)),s=W2S(p.x,p.y);if(!onScreen(s,300))continue;
    const gr=ctx.createLinearGradient(s.x,s.y-420,s.x,s.y);gr.addColorStop(0,'rgba(0,0,0,0)');const c=Kit.hex(r110cCol(k)),A=(C.bell[k]?.2:.09)+.04*Math.sin(time*1.3+k);gr.addColorStop(1,`rgba(${c[0]},${c[1]},${c[2]},${A})`);
    ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(s.x-26,s.y-420);ctx.lineTo(s.x+26,s.y-420);ctx.lineTo(s.x+70,s.y);ctx.lineTo(s.x-70,s.y);ctx.closePath();ctx.fill()}
  ctx.globalCompositeOperation=o;
  if(C.st>=2)return;const n=C.bell.filter(x=>x).length,y=86,x0=W/2;ctx.font=`600 13px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';
  const t=C.st===0?`예배당 종 ${n}/8`:`색유리 순서 ${C.prog}/4`;ctx.strokeText(t,x0,y);ctx.fillStyle='#ffe8a0';ctx.fillText(t,x0,y);
  const L=C.st===0?[0,1,2,3,4,5,6,7]:C.seq;L.forEach((k,i)=>{const x=x0+(i-(L.length-1)/2)*22,on=C.st===0?C.bell[k]:i<C.prog;ctx.globalAlpha=on?1:.4;ctx.fillStyle=r110cCol(k);ctx.beginPath();ctx.arc(x,y+14,7,0,6.283);ctx.fill();
    if(C.st===1&&i===C.prog){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y+14,10,0,6.283);ctx.stroke()}});ctx.globalAlpha=1}
setTimeout(()=>{if(window.__game)Object.assign(window.__game,{R1C,r110cGen,r110cRing,r110cInit,r110cClear,R1C_CAMP,r110cBells})},0);
