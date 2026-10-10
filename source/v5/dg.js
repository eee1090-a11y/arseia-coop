/* ---------- v5: 주문 보조(궤도, 갑옷, 발동 효과) ---------- */
const PROC={
  proc_chain:{id:'proc_chain',n:'연쇄 번개',el:'storm',rank:5,proc:1,kind:'chain'},
  proc_bird:{id:'proc_bird',n:'불새',el:'fire',rank:6,proc:1,kind:'bolt',homing:1,aoe:60,burn:1,spd:380,r:9},
  proc_frost:{id:'proc_frost',n:'서리 폭발',el:'ice',rank:5,proc:1,freeze:1},
  proc_nova:{id:'proc_nova',n:'빛의 폭발',el:'holy',rank:6,proc:1,ud:2},
};
let procT=0;
function procHit(e){
  if(time<procT)return;
  for(const k in PROC){const ch=stat(k);if(!ch||R()*100>=ch)continue;procT=time+.4;const s=PROC[k],pw=power()*dmgMul()*1.6;
    if(k==='proc_chain'){let from={x:P.x,y:P.y,z:24},cur=e,hit=new Set(),st=stormStyle(5);for(let j=0;j<4&&cur;j++){const to={x:cur.x,y:cur.y,z:16};zap(from,to,Object.assign({life:.25},st));hit.add(cur);hurtE(cur,pw*.9,s);from=to;cur=nearestEnemy(cur,240,hit)}}
    else if(k==='proc_bird'){const a=Math.atan2(e.y-P.y,e.x-P.x);projs.push({x:P.x,y:P.y,z:24,vx:Math.cos(a)*s.spd,vy:Math.sin(a)*s.spd,r:s.r,dmg:pw*1.4,owner:'p',s,life:2.5,col:EL.fire,hit:null})}
    else if(k==='proc_frost'){rings.push({x:e.x,y:e.y,r:6,max:100,life:.45,col:EL.ice});burst(e.x,e.y,'#e8f8ff',26,200,3,10);for(const o of enemies)if(!o.dead&&dist(o,e)<100+hR(o)){hurtE(o,pw*.7,s);applyFx(o,s,e)}}
    else{pillars.push({x:e.x,y:e.y,w:60,life:.4,max:.4,col:EL.holy});rings.push({x:e.x,y:e.y,r:6,max:120,life:.45,col:EL.holy});for(const o of enemies)if(!o.dead&&dist(o,e)<120+hR(o))hurtE(o,pw,s)}
    ftext(e.x,e.y,s.n,EL[s.el],false,e.r*2+34);return}
}
let shardT=0;
function updateSpellBits(dt){
  if(P.orbits){const o=P.orbits;o.t-=dt;o.a+=dt*3.4;
    for(let i=0;i<o.n;i++){const a=o.a+i*6.283/o.n,x=P.x+Math.cos(a)*o.rad,y=P.y+Math.sin(a)*o.rad;
      if(R()<.5)parts.push({x,y,z:20,vx:rnd(-10,10),vy:rnd(-10,10),vz:rnd(0,20),life:.3,max:.3,col:EL[o.s.el],sz:2.5});
      for(const e of enemies){if(e.dead||(o.hit.get(e)||0)>time)continue;if(Math.hypot(e.x-x,e.y-y)<hR(e)+14){o.hit.set(e,time+.45);hurtE(e,o.dmg*rnd(.9,1.1),o.s);applyFx(e,o.s,P);burst(x,y,EL[o.s.el],6,90,2.5,20)}}}
    if(o.t<=0)P.orbits=null}
  if(P.armor){const a=P.armor;a.t-=dt;
    if(a.aura){a.tick-=dt;if(a.tick<=0){a.tick=.5;for(const e of enemies)if(!e.dead&&dist(e,P)<a.aura+hR(e))hurtE(e,a.dmg*.35,a.s)}}
    if(R()<.4){const an=R()*6.283;parts.push({x:P.x+Math.cos(an)*16,y:P.y+Math.sin(an)*16,z:rnd(4,34),vx:0,vy:0,vz:30,life:.5,max:.5,col:EL[a.s.el],sz:2.2})}
    if(a.t<=0)P.armor=null}
  // 프로즌 오브: 날아가며 얼음 조각을 뿌린다
  shardT-=dt;const emit=shardT<=0;if(emit)shardT=.07;
  for(const p of projs){if(p.owner!=='p'||!p.s.shards)continue;
    if(emit){p.sa=(p.sa||0)+2.4;shard(p,p.sa)}
    if(p.life<=dt*1.5&&!p.popped){p.popped=1;for(let i=0;i<14;i++)shard(p,i*6.283/14)}}
  for(const a of allies)if(a.s.form==='hydra'){a.atkCd-=0;}
}
const SHARD={id:'shard',n:'얼음 조각',el:'ice',rank:5,proc:1,slow:1};
function shard(p,a){projs.push({x:p.x,y:p.y,z:p.z,vx:Math.cos(a)*420,vy:Math.sin(a)*420,r:4,dmg:p.dmg*.45,owner:'p',s:Object.assign({},SHARD,{cls:P.cls,ghost:p.s&&p.s.ghost}),life:.55,col:'#cfeeff',hit:null})}

/* ---------- v5: 던전 ---------- */
const TS=100,DN=36,OX=1000,OY=1000;
const DUNGEONS=[
  {id:'barrow',n:'안개숲 고분',x:900,y:5650,lvl:5,floor:[58,54,48],wall:['#4a443a','#2e2a24','#615a4c'],torch:'#ffb060',
   mobs:['slime','wolf','ashhound'],minis:['m_bolg','m_wolfking'],boss:'b_arsil'},
  {id:'sewer',n:'은류강 지하 수로',x:4300,y:5450,lvl:10,floor:[44,58,58],wall:['#36504e','#1e302e','#4a6664'],torch:'#7ae0ff',
   mobs:['slime','goblin','wraith'],minis:['m_grol','m_drowned'],boss:'b_devourer'},
  {id:'fort',n:'잿빛 요새',x:5600,y:3600,lvl:16,floor:[56,50,48],wall:['#58504a','#33302c','#6e665e'],torch:'#ff8a40',
   mobs:['ashsoldier','ashhound','ashknight','goblin'],minis:['m_herdin','m_packlord'],boss:'b_baldrak'},
  {id:'sanctum',n:'재의 성소',x:1000,y:700,lvl:23,floor:[62,40,34],wall:['#5a3428','#30180f','#74463a'],torch:'#ff5a2a',
   mobs:['wraith','ashknight','apostle'],minis:['m_seren','m_archbishop'],boss:'b_morgath'},
];
Object.assign(TYPES,{
  m_bolg:{n:'고분지기 볼그',hp:330,dmg:14,spd:80,r:24,xp:110,aggro:380,atk:1.3,col:'#c8c0a8',undead:true,draw:'skeleton',sc:1.9,mini:1,skills:['slam','summon'],summon:'ashsoldier',aura:'rgba(255,170,80,.25)'},
  m_wolfking:{n:'잿빛 이빨',hp:260,dmg:12,spd:150,r:22,xp:110,aggro:420,atk:1,col:'#9a9aa2',draw:'wolf',sc:1.8,mini:1,skills:['charge','summon'],summon:'wolf',eye:'#ff4a2a',aura:'rgba(255,170,80,.25)'},
  b_arsil:{n:'고분의 왕 아르실',hp:900,dmg:16,spd:85,r:30,xp:320,aggro:520,atk:1.5,col:'#b9a8ff',ranged:true,pcol:'#c6b4ff',undead:true,draw:'wraith',sc:2.7,boss:1,skills:['volley','slam','summon'],summon:'ashsoldier',sumCd:30,aura:'rgba(255,90,60,.3)'},// v22(사용자 06:25): 부하 부르기는 30초에 한 번(처음은 20초 뒤)
  m_grol:{n:'늪거인 그롤',hp:380,dmg:20,spd:70,r:28,xp:130,aggro:380,atk:1.4,col:'#5a8a3e',draw:'slime',sc:2.6,mini:1,skills:['slam','summon'],summon:'slime',aura:'rgba(255,170,80,.25)'},
  m_drowned:{n:'익사한 사제',hp:300,dmg:18,spd:90,r:22,xp:130,aggro:460,atk:1.5,col:'#6ac0c8',ranged:true,pcol:'#8ae8ff',undead:true,draw:'wraith',sc:1.9,mini:1,skills:['volley','summon'],summon:'wraith',aura:'rgba(255,170,80,.25)'},
  b_devourer:{n:'삼키는 자',hp:1100,dmg:30,spd:75,r:36,xp:360,aggro:520,atk:1.7,col:'#5a6a4a',draw:'ogre',sc:2.5,boss:1,skills:['slam','charge','summon'],summon:'slime',aura:'rgba(255,90,60,.3)'},
  m_herdin:{n:'배신자 헤르딘',hp:420,dmg:30,spd:100,r:24,xp:150,aggro:400,atk:1.2,col:'#9a948a',undead:true,draw:'knight',sc:1.8,mini:1,skills:['charge','slam'],aura:'rgba(255,170,80,.25)'},
  m_packlord:{n:'재 사냥개 무리왕',hp:360,dmg:26,spd:160,r:24,xp:150,aggro:440,atk:.9,col:'#6a625a',undead:true,draw:'wolf',sc:1.9,mini:1,skills:['charge','summon'],summon:'ashhound',eye:'#ff6a2a',aura:'rgba(255,170,80,.25)'},
  b_baldrak:{n:'잿빛 군주 발드라크',hp:1250,dmg:36,spd:95,r:34,xp:400,aggro:520,atk:1.4,col:'#7a7468',undead:true,draw:'knight',sc:2.5,boss:1,skills:['slam','charge','volley','summon'],summon:'ashsoldier',pcol:'#ff7a3a',aura:'rgba(255,90,60,.3)'},
  m_seren:{n:'타락한 세렌',hp:380,dmg:34,spd:90,r:22,xp:170,aggro:480,atk:1.6,col:'#a05ac0',ranged:true,pcol:'#d07aff',undead:true,draw:'apostle',sc:1.8,mini:1,skills:['volley','summon'],summon:'wraith',aura:'rgba(255,170,80,.25)'},
  m_archbishop:{n:'재의 대주교',hp:440,dmg:38,spd:85,r:24,xp:170,aggro:480,atk:1.7,col:'#c0603a',ranged:true,pcol:'#ff6a2a',undead:true,draw:'apostle',sc:2,mini:1,skills:['volley','slam'],aura:'rgba(255,170,80,.25)'},
  b_morgath:{n:'재의 사도 모르가스',hp:1450,dmg:42,spd:90,r:34,xp:450,aggro:560,atk:1.6,col:'#e0502a',ranged:true,pcol:'#ff4a1a',undead:true,draw:'apostle',sc:2.8,boss:1,skills:['volley','slam','charge','summon'],summon:'apostle',aura:'rgba(255,90,60,.35)'},
});
// 일반 몬스터 무작위 등장 목록에서 보스는 뺀다
const FIELD_TYPES=Object.keys(TYPES).filter(k=>!TYPES[k].mini&&!TYPES[k].boss);
let DG=null,actCave=null,warns=[];
const CAVES=DUNGEONS.map(d=>({x:d.x,y:d.y,k:'cave',cave:d,s:1,v:0,light:120}));
for(let i=decor.length-1;i>=0;i--)if(CAVES.some(c=>Math.hypot(decor[i].x-c.x,decor[i].y-c.y)<130))decor.splice(i,1);
decor.push(...CAVES);LIGHTS.push(...CAVES);
const nearCave=()=>CAVES.find(c=>dist(P,c)<95);
const tIdx=(i,j)=>j*DN+i;
const dgTile=(x,y)=>({i:Math.floor((x-OX)/TS),j:Math.floor((y-OY)/TS)});
function dgFloor(i,j){return i>=0&&j>=0&&i<DN&&j<DN&&DG.g[tIdx(i,j)]===1}
function dgFree(x,y,r){if(!DG)return !blockedAt(x,y);r=r||0;for(const [dx,dy] of [[-r,-r],[r,-r],[-r,r],[r,r]]){const t=dgTile(x+dx,y+dy);if(!dgFloor(t.i,t.j))return false}return true}
function dgLand(ox,oy,x,y){for(let k=0;k<=20;k++){const f=1-k/20,px=ox+(x-ox)*f,py=oy+(y-oy)*f;if(dgFree(px,py,P.r))return{x:px,y:py}}return{x:ox,y:oy}}
const tc=(i,j)=>({x:OX+(i+.5)*TS,y:OY+(j+.5)*TS});
function genDungeon(d){
  const g=new Uint8Array(DN*DN),rooms=[];
  for(let tries=0;tries<400&&rooms.length<11;tries++){
    const w=ri(4,7),h=ri(4,7),i=ri(1,DN-w-2),j=ri(1,DN-h-2);
    if(rooms.some(r=>i<r.i+r.w+2&&i+w+2>r.i&&j<r.j+r.h+2&&j+h+2>r.j))continue;
    rooms.push({i,j,w,h,cx:i+(w>>1),cy:j+(h>>1)})}
  for(const r of rooms)for(let y=r.j;y<r.j+r.h;y++)for(let x=r.i;x<r.i+r.w;x++)g[tIdx(x,y)]=1;
  const dig=(x,y)=>{for(let a=0;a<2;a++)for(let b=0;b<2;b++){const X=clamp(x+a,1,DN-2),Y=clamp(y+b,1,DN-2);g[tIdx(X,Y)]=1}};
  const done=[rooms[0]];
  while(done.length<rooms.length){let best=null,bd=1e9;
    for(const r of rooms){if(done.includes(r))continue;for(const q of done){const dd=Math.abs(r.cx-q.cx)+Math.abs(r.cy-q.cy);if(dd<bd){bd=dd;best=[r,q]}}}
    const [r,q]=best;let x=r.cx,y=r.cy;
    if(R()<.5){while(x!==q.cx){dig(x,y);x+=Math.sign(q.cx-x)}while(y!==q.cy){dig(x,y);y+=Math.sign(q.cy-y)}}
    else{while(y!==q.cy){dig(x,y);y+=Math.sign(q.cy-y)}while(x!==q.cx){dig(x,y);x+=Math.sign(q.cx-x)}}
    dig(x,y);done.push(r)}
  return{g,rooms}}
function bfs(g,si,sj){const D=new Int16Array(DN*DN).fill(-1),q=[tIdx(si,sj)];D[q[0]]=0;
  for(let h=0;h<q.length;h++){const k=q[h],i=k%DN,j=(k/DN)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=i+a,y=j+b;if(x<0||y<0||x>=DN||y>=DN)continue;const n=tIdx(x,y);if(g[n]!==1||D[n]>=0)continue;D[n]=D[k]+1;q.push(n)}}
  return D}
function dgMob(k,x,y,lvl,extra){const t=TYPES[k],D=DIFF[P.diff];const hp=Math.round(t.hp*(1+.34*(lvl-1))*D.hp*(extra&&extra.elite?3:1));
  const e={k,x,y,lvl,elite:!!(extra&&extra.elite),hp,max:hp,dmg:t.dmg*(1+.18*(lvl-1))*(extra&&extra.elite?1.4:1),r:t.r,atkCd:rnd(.5,1.5),anim:R()*10,wx:x,wy:y,wt:0,hurt:0,fx:1,slowT:0,freezeT:0,stunT:0,burn:null,lunge:0,sc:t.sc,boss:t.boss||t.mini?1:0,big:t.boss?2:t.mini?1:0,skT:rnd(1.5,3),cast:0,dash:0};
  if(e.elite){e.r*=1.25}enemies.push(e);return e}
function enterDungeon(c){
  const d=c.cave;let G0;for(let k=0;k<20;k++){G0=genDungeon(d);if(G0.rooms.length>=8)break}
  const {g,rooms}=G0,st=rooms[0],D0=bfs(g,st.cx,st.cy);
  const order=rooms.slice(1).sort((a,b)=>D0[tIdx(b.cx,b.cy)]-D0[tIdx(a.cx,a.cy)]);
  DG={d,ci:CAVES.indexOf(c),g,rooms,ret:{x:c.x,y:c.y+80},lvl:d.lvl+DIFF[P.diff].add,flow:null,ft:-1,portals:[],walls:[],torches:[],floor:[],bossDead:false,boss:null,start:st};
  for(let j=0;j<DN;j++)for(let i=0;i<DN;i++){if(g[tIdx(i,j)]===1){DG.floor.push([i,j]);continue}
    let adj=false;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(dgFloor(i+a,j+b))adj=true;
    if(adj){const c2=tc(i,j);DG.walls.push({x:c2.x,y:c2.y,i,j,wall:1,h:R()<.1?150:120});
      if(R()<.09){const sides=[[1,0],[0,1]].filter(([a,b])=>dgFloor(i+a,j+b));if(sides.length){const [a,b]=sides[0];DG.torches.push({x:c2.x+a*52,y:c2.y+b*52,light:150,torch:1})}}}}
  enemies=[];projs=[];fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  const L=DG.lvl;
  const bossRoom=order[0];DG.boss=dgMob(d.boss,tc(bossRoom.cx,bossRoom.cy).x,tc(bossRoom.cx,bossRoom.cy).y,L+2);
  [order[1],order[2]].forEach((r,ix)=>{if(r){const p=tc(r.cx,r.cy);dgMob(d.minis[ix],p.x,p.y,L+1);for(let n=0;n<3;n++)dgMob(pick(d.mobs),p.x+rnd(-120,120),p.y+rnd(-120,120),L)}});
  for(const r of order.slice(3)){const n=ri(3,6);for(let k=0;k<n;k++){const i=ri(r.i,r.i+r.w-1),j=ri(r.j,r.j+r.h-1),p=tc(i,j);dgMob(pick(d.mobs),p.x+rnd(-30,30),p.y+rnd(-30,30),L,{elite:k===0&&R()<.4})}}
  const p0=tc(st.cx,st.cy);DG.portals.push({x:p0.x+60,y:p0.y+60,exit:1});
  P.x=p0.x;P.y=p0.y;for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}
  followCam();msg(`${d.n}에 들어섰습니다. 가장 깊은 방에 ${TYPES[d.boss].n}이(가) 있습니다`,'#ff9a6a');
  banner={t:d.n,sub:`던전 · 몬스터 레벨 ${L}~${L+2}${P.diff?' · '+DIFF[P.diff].n:''}`,col:'#ff9a6a',life:2.2,max:2.2};save()}
function leaveDungeon(){if(!DG)return;const r=DG.ret;DG=null;P.x=r.x;P.y=r.y;enemies=[];projs=[];fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}followCam();msg('던전을 빠져나왔습니다','#d6b262');save()}
function dgAct(){for(const p of DG.portals)if(dist(P,p)<80)return'exit';return null}
function doAct(){if(act==='edge'&&actEdge){useEdge(actEdge);return}
  if(NET.guest&&(act==='dungeon'||act==='exit')){if(act==='dungeon'&&actCave)netSend({t:'req',to:NET.hostId,a:'dungeon',c:CAVES.indexOf(actCave),rg:REG.id});else if(act==='exit')netSend({t:'req',to:NET.hostId,a:'exit'});return}
  if(act==='quest'){questTalk(actTown);return}
  if(act==='dungeon'&&actCave)enterDungeon(actCave);else if(act==='exit')leaveDungeon();else if(act)openPanel(act)}
function dgFlowFor(tg){if(!tg||tg===P)return DG.flow;const t=dgTile(tg.x,tg.y),k=tIdx(t.i,t.j);const C=DG.fc||(DG.fc=new Map());let F=C.get(k);if(!F){if(C.size>24)C.clear();F=bfs(DG.g,t.i,t.j);C.set(k,F)}return F}
function dgSees(e,tg){if(e.aggroed)return true;const t=dgTile(e.x,e.y),FL=dgFlowFor(tg);const f=FL&&FL[tIdx(t.i,t.j)];return f>=0&&f<=TYPES[e.k].aggro/TS+1}
function dgStep(e,tg){const F=dgFlowFor(tg);if(!F)return null;const t=dgTile(e.x,e.y),cur=F[tIdx(t.i,t.j)];if(cur<=1)return null;
  let best=null,bv=cur;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const i=t.i+a,j=t.j+b;if(!dgFloor(i,j))continue;if(a&&b&&(!dgFloor(t.i+a,t.j)||!dgFloor(t.i,t.j+b)))continue;const v=F[tIdx(i,j)];if(v>=0&&v<bv){bv=v;best=[i,j]}}
  if(!best)return null;const c=tc(best[0],best[1]),dx=c.x-e.x,dy=c.y-e.y,l=Math.hypot(dx,dy)||1;return{x:dx/l,y:dy/l}}
function bossThink(e,dt,tg,d){
  const t=TYPES[e.k];if(e.freezeT>0||e.stunT>0)return;
  if(!e.rage&&e.hp<e.max*.5&&t.boss){e.rage=1;msg(`${t.n}이(가) 분노합니다!`,'#ff5a3a');rings.push({x:e.x,y:e.y,r:10,max:200,life:.7,col:'#ff5a3a'});shake=8}
  if(e.cast>0){e.cast-=dt;return}
  if(t.sumCd){if(e.sumT==null)e.sumT=t.sumCd*2/3;e.sumT-=dt}
  e.skT-=dt;if(e.skT>0)return;
  const ok=t.skills.filter(s=>s==='slam'?d<230:s==='charge'?d>140&&d<600:s==='summon'?enemies.length<45&&!(e.sumT>0):true);if(!ok.length)return;
  const s=pick(ok);if(s==='summon'&&t.sumCd)e.sumT=t.sumCd;e.skT=rnd(2.6,4)*(e.rage?.6:1)*(t.mini?1.2:1);
  if(s==='slam'){const rad=t.boss?170:130;warns.push({x:e.x,y:e.y,rad,t:.95,max:.95,dmg:e.dmg*2.2,col:'#ff5a3a',src:e});e.cast=.95}
  else if(s==='volley'){const n=t.boss?(e.rage?14:10):7,a0=Math.atan2(tg.y-e.y,tg.x-e.x);for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.16;projs.push({x:e.x,y:e.y,z:30,vx:Math.cos(a)*270,vy:Math.sin(a)*270,r:7,dmg:e.dmg*.7,owner:'e',life:2.2,col:t.pcol||'#ff7a3a'})}e.cast=.4}
  else if(s==='summon'){const n=t.boss?3:2;for(let i=0;i<n;i++){const a=R()*6.283,x=e.x+Math.cos(a)*70,y=e.y+Math.sin(a)*70;if(!dgFree(x,y,14))continue;const m=dgMob(t.summon,x,y,Math.max(1,e.lvl-2));m.aggroed=true;rings.push({x,y,r:4,max:40,life:.4,col:'#b49cff'})}msg(`${t.n}이(가) 부하를 부릅니다`,'#c9b4ff');e.cast=.6}
  else if(s==='charge'){const a=Math.atan2(tg.y-e.y,tg.x-e.x);e.dvx=Math.cos(a);e.dvy=Math.sin(a);e.dash=.5;e.dashHit=0;warns.push({x:e.x,y:e.y,rad:40,t:.25,max:.25,dmg:0,col:'#ffb05a'})}
}
function dgUpdate(dt){
  const t=dgTile(P.x,P.y),k=tIdx(t.i,t.j);if(k!==DG.ft){DG.ft=k;DG.flow=bfs(DG.g,t.i,t.j)}
  dashHits();
  for(const p of DG.portals)if(R()<.4)rise(p.x+rnd(-24,24),p.y+rnd(-24,24),p.exit?'#9fe0ff':'#ffb05a')
}
function dashHits(){
  if(!NET.guest)for(const e of enemies)if(e.dash>0&&!e.dashHit){if(dist(e,P)<e.r+P.r+8){e.dashHit=1;hitPlayer(e.dmg*1.6,e);applyFx(P,{},e);shake=Math.max(shake,6)}else if(NET.host)for(const r of NET.peers.values())if(!r.dead&&netSame(r)&&dist(e,r)<e.r+r.r+8){e.dashHit=1;netHit(r,e.dmg*1.6,e);break}}
}
function updateWarns(dt){for(const w of warns){w.t-=dt;if(w.t<=0&&!w.done){w.done=1;if(!w.dmg)continue;rings.push({x:w.x,y:w.y,r:10,max:w.rad,life:.4,col:w.col});burst(w.x,w.y,'#8a6a50',30,w.rad*1.8,4,6);decal(w.x,w.y,w.rad*.6,'earth');shake=Math.max(shake,9);
  if(!P.dead&&dist(P,w)<w.rad+P.r)hitPlayer(w.dmg,w.src);if(NET.host)for(const r of NET.peers.values())if(!r.dead&&netSame(r)&&dist(r,w)<w.rad+r.r)netHit(r,w.dmg,w.src);for(const a of allies)if(dist(a,w)<w.rad+a.r)hurtAlly(a,w.dmg)}}warns=warns.filter(w=>w.t>0)}
function dgBossDrop(e){const t=TYPES[e.k],L=e.lvl,drop=(it)=>loot.push({x:e.x+rnd(-40,40),y:e.y+rnd(-40,40),kind:'item',item:it,t:0});
  loot.push({x:e.x,y:e.y,kind:'gold',amt:L*(t.boss?60:20),t:0});
  // v18: 상급 유니크는 보스 3마리 중 1마리꼴(지옥은 조금 더), 나머지 굴림도 유니크·세트가 덜 나옴
  if(t.boss){const bu=R()<(P.diff===2?.45:P.diff===1?.38:.33);drop(makeItem(L,true,null,bu?'boss':R()<.5?'uniq':'set'));drop(makeItem(L,true,null,R()<.2?'uniq':R()<.25?'set':null));if(R()<DROP24){const it=makeItem(L,true);if(junkKeep(it))drop(it)}/* v24: 덤 한 개 1/5 */
    DG.bossDead=true;DG.portals.push({x:e.x,y:e.y+80,exit:1});banner={t:`${t.n} 쓰러짐`,sub:(bu?'상급 유니크가 떨어졌습니다':'전리품이 떨어졌습니다')+' · 빛나는 문으로 나갈 수 있습니다',col:'#ff8a3a',life:3,max:3};flash={col:'#ff8a3a',a:.3}}
  else{drop(makeItem(L,true,null,R()<.12?'uniq':R()<.15?'set':null));if(R()<DROP24){const it=makeItem(L,true);if(junkKeep(it))drop(it)}}/* v24: 준보스 덤 1/5 *//* v21: 덤 한 개는 잡템이면 줄임 */
  msg(`${t.n}을(를) 쓰러뜨렸습니다!`,'#ff9a6a')}
