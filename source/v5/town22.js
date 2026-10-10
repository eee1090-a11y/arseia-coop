/* ---------- v22 TOWN: 마을을 20~50% 넓히기 · 겹침 없애기 · 누른 NPC와 이야기 · 같은 사람은 한 곳에만 (사용자 06:52 · 07:00) ----------
   「마을이 협소한데 NPC들이 많아서 대화를 걸 때 다른 오브젝트나 원치 않는 NPC와 대화를 하게 되는 문제 … 마을 크기를 20%에서 50% 늘려주고, 서로 겹치지 않도록」
   「대마법사 엘리안이 건물 안과 밖에 둘 다 있거든? 하나만 존재하도록 … 다른 NPC들도 조사해서 반영」
   · 자리와 그림은 나뉜다. 자리(데이터): TWLAY(town.js) · 아래 TK22 배율표 → 계산된 자리는 decor 객체의 x,y · foot · door · hx,hy · path 와
     마을 t.gate / t.stash / t.shops / t.npc / t.safe 에 들어간다. 그림(painter 함수)은 이 파일에서 하나도 건드리지 않는다.
   · 넓히기: 마을 한가운데를 기준으로 마을 물건(건물 · 노점 · 짝문 · 창고 · 의뢰인 · 마을 사람 · 소품 · 등불)을 TK22 배만큼 바깥으로 옮긴다.
     건물 크기는 그대로라 사이가 벌어진다. 울타리와 양(우리) · 강가 나루 · 건물에 붙은 소품 · 간판은 한 덩어리로 옮겨 모양을 지킨다.
     아르덴 성벽은 새 크기에 맞게 다시 세운다. 물 · 용암 · 막힌 곳 · 동굴 · 포탈에 걸리면 그 물건만 배율을 조금씩 줄인다.
   · 안전 지대: 마을마다 t.safe (b1.js tSafe) = max(470, 마을 물건이 닿는 거리 + 70). 몬스터 레벨(levelAt)은 그대로.
   · 겹침: 마을 사람 자리를 다시 다듬는다(wx-base.js 규칙 + 화면에서 누르는 상자가 서로 겹치지 않게).
   · 누르기(PC 클릭 · 휴대폰 탭): 손가락/마우스 밑에 "보이는 몸"이 있는 사람 · 노점 · 짝문 · 창고를 고른다(가까운 사람 순이 아님).
     멀면 걸어가서 말을 건다. 조이스틱 자리(화면 왼쪽)에서는 톡 누르고 뗄 때만. PC는 마우스를 올린 사람을 F가 먼저 고른다.
   · 같은 사람 한 명: 아르덴 의뢰인(대마법사 엘리안)이 바깥(의뢰인 그림)과 마법원 안(전직관)에 둘 다 있었다 → 마법원 안 한 명만 남기고
     1막·2막 의뢰도 그 사람에게서 받는다(목표 표시 · 지도 고리 · ! ? 모두 마법원 안을 가리킨다). 이름만 같던 다른 사람 둘은 이름을 바꾼다.
   · 저장: 새 값 없음. 옛 저장이 마을 안에서 건물 · 소품 위에 서 있으면 불러올 때 가장 가까운 빈자리로 옮긴다. */
const TK22={// 마을별 넓힘 배율 (v21 마을에서 "누를 수 있는 것" 사이 거리의 가운데값 nnMed: 64 → 1.5 · 112 → 1.2, 0.05 단위)
 brenhill:1.35,willowen:1.5,haven:1.5,arden:1,// v26: 왕도는 처음부터 넓게 그렸다
 goldmere:1.45,elderhold:1.4,sahar:1.25,frostheim:1.4,tamal:1.35,emberhold:1.3,pearlport:1.45,rookwell:1.4,windcrag:1.2,dustgate:1.35,gullhaven:1.4,lastlight:1.35,
 pilgrimtent:1.35,keeperhouse:1.35,mistford:1.4,charkiln:1.4,frostlamp:1.4,stormcloister:1.4,rootwatch:1.4,lastvigil:1.4};
const TK22_DEF=1.3;
const T22={k:TK22,v21:{},now:{},cut:{},moved:{},gone:{},ren:[],dups:[],ms:0,go:null,hov:null,tap:null,hovT:0};
WXT.k22={};// wxTk = v18 배율 × v22 배율 (wx-base.js)
const TW22_PROT=new Set(['cave','edgeportal','a3gate','mzgate']);
const TW22_NATX=new Set(['tree','rock','bush','stump','ruin','tomb']);
const TW22_RIGID=new Set(['fence','sheep']);
const tw22K=t=>TK22[t.id]||TK22_DEF;
// 화면에서 "보이는 몸" 상자 (발 밑 기준, 화면 단위). 누를 수 없는 것은 null
function tw22Box(d,live){
  if(d.k==='tfolk')return d.esc?null:d.L&&d.L.child?[-10,-46,10,2]:[-13,-66,13,2];// v22 그림(TW_FK=.87): 어른 몸 위끝 -52~-66 · 아이 -40~-43
  if(d.k==='npc')return d.town&&d.town.npc&&QNPC[d.town.id]?[-15,-78,15,2]:null;
  if(d.k==='shop')return d.tshop?[-44,-76,44,12]:null;
  if(d.k==='gate')return[-30,-62,30,6];
  if(d.k==='stash')return[-24,-42,24,6];
  if(d.use&&!d.room&&d.si==null){if(live&&!sqUseLive(d))return null;return[-20,-48,20,6]}
  if(d.use&&d.room){if(live&&!sqUseLive(d))return null;return[-18,-40,18,6]}
  return null}
const tw22Abs=(d,x,y,b)=>{const sx=(x-y)*KI,sy=(x+y)*KI/2;return[sx+b[0],sy+b[1],sx+b[2],sy+b[3]]};
const tw22Hit=(a,b,g)=>a[0]<b[2]+g&&b[0]<a[2]+g&&a[1]<b[3]+g&&b[1]<a[3]+g;
// 노점과 그 노점 주인은 같은 일(상점 열기)이라 상자가 겹쳐도 된다
const tw22Same=(a,b)=>{const s=a.k==='shop'?a:b.k==='shop'?b:null,f=s===a?b:a;return !!(s&&f.k==='tfolk'&&f.shopk&&f.shopk===s.shopType&&f.town===s.town)};

/* ===== 1) 넓히기 ===== */
function tw22Ext(L,t,list){let m=0;for(const d of list){const r=d.foot||[[d.x,d.y,d.x,d.y]];for(const f of r)for(const [x,y] of [[f[0],f[1]],[f[2],f[1]],[f[0],f[3]],[f[2],f[3]]])m=Math.max(m,Math.hypot(x-t.x,y-t.y))}return m}
const tw22CoreOf=(L,t)=>L.decor.filter(d=>!d.room&&d.town===t&&(d.k==='bld'||d.k==='shop'||d.k==='gate'||d.k==='stash'||d.k==='npc'||d.k==='tfolk'));
function tw22Stat(L,t){const c=tw22CoreOf(L,t).map(d=>Math.hypot((d.k==='tfolk'?d.hx:d.x)-t.x,(d.k==='tfolk'?d.hy:d.y)-t.y)).sort((a,b)=>a-b);
  return{n:c.length,med:Math.round(c[c.length>>1]||0),p90:Math.round(c[Math.floor(c.length*.9)]||0),max:Math.round(c[c.length-1]||0)}}
function tw22Mine(L,t,R){return L.decor.filter(d=>{if(d.room||d.k==='cwall'||d.k==='gatetower')return false;if(d.town===t)return true;if(d.town&&d.town!==t)return false;
  if(d.k==='tfolk'||TW22_PROT.has(d.k))return false;const dd=Math.hypot(d.x-t.x,d.y-t.y);if(dd>R)return false;
  return !!(d.tprop||d.light&&d.k!=='vent'||d.zl===0&&d.pv!=null||d.k==='fountain'||d.k==='statue'||d.k==='facesign'||d.k==='house'||d.k==='mill')})}
function tw22Move(d,dx,dy){d.x+=dx;d.y+=dy;if(d.hx!=null){d.hx+=dx;d.hy+=dy}
  if(d.foot){if(Array.isArray(d.foot[0]))d.foot=d.foot.map(f=>[f[0]+dx,f[1]+dy,f[2]+dx,f[3]+dy]);else d.foot=[d.foot[0]+dx,d.foot[1]+dy,d.foot[2]+dx,d.foot[3]+dy]}
  if(d.door)d.door={x:d.door.x+dx,y:d.door.y+dy};d._s=null}
function tw22Expand(L,t){const k=tw22K(t);WXT.k22[t.id]=k;if(k===1)return;
  const cx=t.x,cy=t.y,core=tw22CoreOf(L,t),E0=tw22Ext(L,t,core),R=Math.max(320,E0+80);
  const mine=tw22Mine(L,t,R),moved=new Set(),MAP=T22.map[L.id]||(T22.map[L.id]=new Map()),key=(x,y)=>Math.round(x)+','+Math.round(y);
  const lq=L.id==='home'?null:L.lq,ok=lq?(L.okT||(L.okT=wxReach(lq,cx,cy))):null;
  const prot=L.decor.filter(d=>TW22_PROT.has(d.k)&&Math.hypot(d.x-cx,d.y-cy)<R*k+300);
  const blds=TW.blds[L.id]||[],bset=new Set(blds);
  // 덩어리 만들기: 울타리 · 양 / 건물에 붙은 소품 · 간판 / 강가
  const unit=new Map(),units=[],mk=(objs,piv,mode)=>{const u={objs,piv,mode};units.push(u);for(const o of objs)unit.set(o,u);return u};
  const W=(TW.water[L.id]||[]).find(w=>Math.hypot((w.x0+w.x1)/2-cx,(w.y0+w.y1)/2-cy)<900&&w.y0>cy);
  if(W){const inR=d=>d.k!=='bld'&&d.y>=W.y0-45&&d.x>W.x0-40&&d.x<W.x1+40;const band=mine.filter(inR);for(const d of band)mk([d],{x:d.x,y:d.y},'river')}
  const bl=mine.filter(d=>d.k==='bld');
  const near=d=>{let o=null,od=1e9;for(const b of bl){const v=d.k==='facesign'?Math.hypot(d.x-b.x,d.y-b.y):wxRD(d.x,d.y,b.foot[0]);if(v<od){od=v;o=b}}return d.k==='facesign'?(od<260?o:null):(od<26?o:null)};
  const att=new Map(bl.map(b=>[b,[b]]));for(const d of mine){if(unit.has(d)||d.k==='bld'||d.k==='tfolk'||d.k==='npc'||d.k==='shop'||d.k==='gate'||d.k==='stash'||d.use||d.k==='fountain'||d.k==='statue'||d.k==='lamp')continue;const b=near(d);if(b)att.get(b).push(d)}
  for(const b of bl)mk(att.get(b),{x:b.x,y:b.y},'scale')
  {const rg=mine.filter(d=>TW22_RIGID.has(d.k)&&!unit.has(d)),seen=new Set();
    for(const d of rg){if(seen.has(d))continue;const grp=[d];seen.add(d);for(let i=0;i<grp.length;i++)for(const e of rg)if(!seen.has(e)&&Math.hypot(e.x-grp[i].x,e.y-grp[i].y)<80){seen.add(e);grp.push(e)}
      mk(grp,{x:grp.reduce((a,o)=>a+o.x,0)/grp.length,y:grp.reduce((a,o)=>a+o.y,0)/grp.length},'scale')}}
  for(const d of mine)if(!unit.has(d))mk([d],{x:d.x,y:d.y},'scale');
  const dyR=kk=>W?(kk-1)*((W.y0+W.y1)/2-cy):0;
  const del=(u,kk)=>u.mode==='river'?{dx:(kk-1)*(u.piv.x-cx),dy:dyR(kk)}:{dx:(kk-1)*(u.piv.x-cx),dy:(kk-1)*(u.piv.y-cy)};
  const pts=d=>{const o=[[d.x,d.y]];if(d.foot)for(const f of Array.isArray(d.foot[0])?d.foot:[d.foot])o.push([f[0],f[1]],[f[2],f[1]],[f[0],f[3]],[f[2],f[3]]);if(d.door)o.push([d.door.x,d.door.y]);return o};
  const reachK=d=>d.k==='tfolk'||d.k==='npc'||d.k==='shop'||d.k==='gate'||d.k==='stash'||d.use||d.k==='bld'&&d.enter;
  const good=(u,dx,dy)=>{for(const d of u.objs){if(u.mode==='river')continue;for(const [x0,y0] of pts(d)){const x=x0+dx,y=y0+dy;if(x<140||y<140||x>WORLD-140||y>WORLD-140)return false;
      if(lq&&wxLqAt(lq,x,y)>.3&&d.k!=='boat')return false;for(const p of prot)if(Math.hypot(p.x-x,p.y-y)<(d.k==='bld'?60:80))return false}
    if(ok&&reachK(d)){const p=d.k==='bld'&&d.door?d.door:d;if(!wxCanReach(ok,p.x+dx,p.y+dy))return false}}return true};
  let cut=0;
  for(const u of units){let kk=k,dd=del(u,kk);while(kk>1.001&&!good(u,dd.dx,dd.dy)){kk=Math.round((kk-.05)*100)/100;dd=del(u,kk)}if(kk<k)cut++;
    for(const d of u.objs){const ox=d.x,oy=d.y;tw22Move(d,dd.dx,dd.dy);MAP.set(key(ox,oy),{x:d.x,y:d.y});moved.add(d);
      if(d.k==='tfolk'&&d.path)d.path=d.path.map(p=>u.mode==='river'?{x:p.x+dd.dx,y:p.y+dd.dy}:{x:cx+(p.x-cx)*kk,y:cy+(p.y-cy)*kk})}}
  T22.cut[t.id]=cut;
  // 강 · 나루: 가로는 넓히고 세로는 강 가운데를 옮긴다 (나루 너비는 그대로)
  if(W){const dy=dyR(k);W.x0=cx+(W.x0-cx)*k;W.x1=cx+(W.x1-cx)*k;W.y0+=dy;W.y1+=dy;W.docks=W.docks.map(q=>{const mx=(q[0]+q[1])/2,hw=(q[1]-q[0])/2,nx=cx+(mx-cx)*k;return[nx-hw,nx+hw,q[2]+dy,q[3]+dy]});TW.flats={}}
  // 마을 자리 값
  {const g=L.decor.find(d=>d.k==='gate'&&d.town===t),s=L.decor.find(d=>d.k==='stash'&&d.town===t),n=L.decor.find(d=>d.k==='npc'&&d.town===t);
    if(g)t.gate={x:g.x,y:g.y};if(s)t.stash={x:s.x,y:s.y};if(n&&t.npc)t.npc={x:n.x,y:n.y};
    if(t.shops)t.shops=t.shops.map(sh=>{const st=L.decor.find(d=>d.k==='shop'&&d.town===t&&d.shopType===sh.type&&MAP.get(key(sh.x,sh.y))&&Math.abs(d.x-MAP.get(key(sh.x,sh.y)).x)<1&&Math.abs(d.y-MAP.get(key(sh.x,sh.y)).y)<1);return st?{...sh,x:st.x,y:st.y}:sh});
    if(t.shops&&t.shops[0])t.shop={x:t.shops[0].x,y:t.shops[0].y}}
  if(L.id==='home'&&t.id==='arden')tw22Walls(L,t,k);
  T22.moved[t.id]=moved.size;return moved}
// 아르덴 성벽: 새 크기 둘레에 다시 세운다 (조각 길이 140은 그대로, 개수를 늘린다)
function tw22Walls(L,t,k){const old=L.decor.filter(d=>(d.k==='cwall'||d.k==='gatetower')&&Math.hypot(d.x-t.x,d.y-t.y)<1000);if(!old.length)return;
  const cw=old.find(d=>d.k==='cwall'),gt=old.find(d=>d.k==='gatetower'),B=TW.blds[L.id]||[];
  for(const d of old){const i=L.decor.indexOf(d);if(i>=0)L.decor.splice(i,1);const j=B.indexOf(d);if(j>=0)B.splice(j,1);const l=L.lights.indexOf(d);if(l>=0)L.lights.splice(l,1)}
  const Lw=Math.round(-470*k),a=Lw+50,b=-Lw-50,n=Math.max(1,Math.round((b-a)/140)),end=a+n*140,mk=(src,x,y,pv)=>{const d={...src,x:t.x+x,y:t.y+y,pv,_s:null,_flat:undefined};delete d._thin;
    d.foot=src.k==='gatetower'?[[d.x-22,d.y-22,d.x+22,d.y+22]]:[pv===1?[d.x-14,d.y-70,d.x+14,d.y+70]:[d.x-70,d.y-14,d.x+70,d.y+14]];L.decor.push(d);B.push(d);return d};
  for(let i=0;i<n;i++){const u=a+70+i*140;mk(cw,u,Lw,0);mk(cw,Lw,u,1)}
  if(gt){mk(gt,Lw,Lw,0);mk(gt,end+10,Lw,0);mk(gt,Lw,end+10,0)}}
// 넓어진 마을에 걸린 들판 풍경(나무 · 바위 …)은 치우고, 채집 자리 · 이름 붙은 표지는 바깥으로 민다
function tw22Clear(L,t,moved){const cx=t.x,cy=t.y,B=(TW.blds[L.id]||[]).filter(b=>Math.hypot(b.x-cx,b.y-cy)<1100),objs=[...moved].filter(d=>d.k!=='bld'&&d.k!=='lamp'),
    MAP=T22.map[L.id]||(T22.map[L.id]=new Map()),key=(x,y)=>Math.round(x)+','+Math.round(y);let gone=0;
  const hitAt=(x,y,pad)=>B.some(b=>b.foot&&b.foot.some(f=>x>f[0]-pad&&x<f[2]+pad&&y>f[1]-pad&&y<f[3]+pad))||objs.some(o=>Math.abs(o.x-x)<pad+4&&Math.abs(o.y-y)<pad+4&&Math.hypot(o.x-x,o.y-y)<pad+4);
  const ext=tw22Ext(L,t,tw22CoreOf(L,t))+120;
  for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(moved.has(d)||d.town||d.k==='tfolk'||d.k==='npc'||d.k==='bld'||d.k==='cwall'||d.k==='gatetower'||TW22_PROT.has(d.k))continue;
    const dd=Math.hypot(d.x-cx,d.y-cy);if(dd>ext)continue;
    if(d.use||d.label||d.light&&d.k!=='vent'){// 채집 자리 · 표지: 밀어낸다
      if(!hitAt(d.x,d.y,36))continue;const ox=d.x,oy=d.y,ax=(d.x-cx)/(dd||1),ay=(d.y-cy)/(dd||1);let x=d.x,y=d.y;
      for(let s=0;s<20&&hitAt(x,y,36);s++){x+=ax*24;y+=ay*24}
      if(L.lq&&wxLqAt(L.lq,x,y)>.3)continue;d.x=x;d.y=y;d._s=null;MAP.set(key(ox,oy),{x,y});continue}
    const nat=TW22_NATX.has(d.k)||(typeof TSCEN!=='undefined'&&TSCEN.has(d.k))||(RD.D&&RD.D[d.k]&&!d.label);
    if(nat&&hitAt(d.x,d.y,d.k==='flowers'||d.k==='fern'||d.k==='mushroom'?18:30)){L.decor.splice(i,1);gone++}}
  T22.gone[t.id]=gone}
// 노점 · 짝문 · 창고(제자리 물건)끼리 화면 상자가 겹치면 노점을 바깥으로 비킨다 (노점 주인도 같이)
function tw22Fixed(L,t,moved){const cx=t.x,cy=t.y,MAP=T22.map[L.id]||(T22.map[L.id]=new Map()),key=(x,y)=>Math.round(x)+','+Math.round(y),log=[];
  const B=(TW.blds[L.id]||[]).filter(b=>Math.hypot(b.x-cx,b.y-cy)<1100),lq=L.id==='home'?null:L.lq,ok=lq?L.okT:null;
  const prot=L.decor.filter(d=>TW22_PROT.has(d.k)&&Math.hypot(d.x-cx,d.y-cy)<1400);
  const F=()=>L.decor.filter(d=>!d.room&&(d.town===t||!d.town&&Math.hypot(d.x-cx,d.y-cy)<1000)&&d.k!=='tfolk'&&d.k!=='npc'&&(d.k==='statue'||d.k==='fountain'||tw22Box(d,false)));
  const box=d=>d.k==='statue'||d.k==='fountain'?[-40,-70,40,20]:tw22Box(d,false);
  const clash=(d,x,y,list)=>{const r=tw22Abs(d,x,y,box(d));return list.some(o=>o!==d&&tw22Hit(r,tw22Abs(o,o.x,o.y,box(o)),6))};
  const free=(x,y)=>{if(x<160||y<160||x>WORLD-160||y>WORLD-160)return false;if(lq&&wxLqAt(lq,x,y)>.3)return false;if(ok&&!wxCanReach(ok,x,y))return false;
    if(B.some(b=>b.foot&&b.foot.some(f=>x>f[0]-44&&x<f[2]+44&&y>f[1]-44&&y<f[3]+44)))return false;if(prot.some(p=>Math.hypot(p.x-x,p.y-y)<90))return false;
    if(typeof twWet==='function'&&twWet(L.id,x,y))return false;return true};
  const mov=d=>d.k==='shop'||d.use&&d.k!=='gate'&&d.k!=='stash';
  for(let pass=0;pass<20;pass++){const list=F();let any=false,pick=null;
    for(const d of list){if(!mov(d)||!clash(d,d.x,d.y,list))continue;
      const a0=Math.atan2(d.y-cy,d.x-cx);let best=null;
      for(let r=12;r<=180&&!best;r+=12)for(const da of [0,.5,-.5,1,-1,1.6,-1.6,2.4,-2.4,Math.PI]){const x=d.x+Math.cos(a0+da)*r,y=d.y+Math.sin(a0+da)*r;if(free(x,y)&&!clash(d,x,y,list)){best={x,y,r};break}}
      if(best&&(!pick||best.r<pick.best.r))pick={d,best}}
    {if(!pick)break;const {d,best}=pick;const dx=best.x-d.x,dy=best.y-d.y,ox=d.x,oy=d.y;tw22Move(d,dx,dy);moved.add(d);MAP.set(key(ox,oy),{x:d.x,y:d.y});
      for(const f of L.decor)if(d.k==='shop'&&f.k==='tfolk'&&f.town===t&&!f.room&&f.shopk===d.shopType&&Math.hypot(f.hx-ox,f.hy-oy)<140){const fx=f.hx,fy=f.hy;tw22Move(f,dx,dy);if(f.path)f.path=f.path.map(p=>({x:p.x+dx,y:p.y+dy}));MAP.set(key(fx,fy),{x:f.hx,y:f.hy})}
      if(t.shops)t.shops=t.shops.map(sh=>Math.abs(sh.x-ox)<1&&Math.abs(sh.y-oy)<1?{...sh,x:d.x,y:d.y}:sh);if(t.shops&&t.shops[0])t.shop={x:t.shops[0].x,y:t.shops[0].y};
      log.push(`${d.shopType||d.k} ${Math.round(Math.hypot(dx,dy))}`);any=true}
    if(!any)break}
  (T22.fixedT||(T22.fixedT={}))[t.id]=log;return log}
// 마을 사람 자리 다시 다듬기: wx-base.js 규칙(건물 40 · 문 40 · 소품 · 사람 48 · 물) + 화면에서 누르는 상자가 서로 안 겹치게
function tw22Relax(L,t){const P0=wxTownParts(L,t),lim={bld:WXT.bld,door:WXT.door,prop:1,npc:WXT.npc};
  const ok=P0.lq?(L.okT||(L.okT=wxReach(P0.lq,t.x,t.y))):null,placed=[],moved=[];
  const fixed=P0.props.map(d=>{const b=tw22Box(d,false);return b?{d,r:tw22Abs(d,d.x,d.y,b)}:null}).filter(Boolean),boxes=[...fixed];
  const R0=Math.max(320,...P0.folk.map(f=>Math.hypot(f.hx-t.x,f.hy-t.y)+80),P0.npcD?Math.hypot(P0.npcD.x-t.x,P0.npcD.y-t.y)+80:0);
  const boxOk=(f,x,y)=>{const b=tw22Box(f,false);if(!b)return true;const r=tw22Abs(f,x,y,b);for(const o of boxes)if(!tw22Same(f,o.d)&&tw22Hit(r,o.r,3))return false;return true};
  const find=(x0,y0,f,lm,maxR,box)=>{const m=maxR+90,Q={...P0,props:P0.props.filter(p=>Math.abs(p.x-x0)<m&&Math.abs(p.y-y0)<m),rects:P0.rects.filter(r=>r[0]-m<x0&&r[2]+m>x0&&r[1]-m<y0&&r[3]+m>y0),doors:P0.doors.filter(p=>Math.abs(p.x-x0)<m&&Math.abs(p.y-y0)<m)};
    const good=(x,y)=>Math.hypot(x-t.x,y-t.y)<=R0&&(!ok||wxCanReach(ok,x,y))&&wxSpotOk(Q,x,y,f,placed,lm)&&(!box||boxOk(f,x,y));
    if(good(x0,y0))return{x:x0,y:y0};for(let r=8;r<=maxR;r+=8){const n=Math.max(8,Math.round(r*6.283/14)),a0=hash(x0|0,y0|0)*6.283;
      for(let i=0;i<n;i++){const a=a0+i/n*6.283,x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r;if(good(x,y))return{x,y}}}return null};
  const list=[...(P0.npcD?[P0.npcD]:[]),...P0.folk.filter(f=>f.shopk),...P0.folk.filter(f=>!f.shopk&&!f.path),...P0.folk.filter(f=>!f.shopk&&f.path)];
  for(const f of list){const isN=f.k==='npc',x0=isN?f.x:f.hx,y0=isN?f.y:f.hy,s=find(x0,y0,f,lim,300,true)||find(x0,y0,f,lim,300,false)||{x:x0,y:y0},dx=s.x-x0,dy=s.y-y0;
    if(dx||dy){moved.push([f.id||'npc',Math.round(Math.hypot(dx,dy))]);if(isN){f.x=s.x;f.y=s.y;if(t.npc)t.npc={x:s.x,y:s.y}}else{f.x=f.hx=s.x;f.y=f.hy=s.y}}
    placed.push({x:s.x,y:s.y,id:f.id});const b=tw22Box(f,false);if(b)boxes.push({d:f,r:tw22Abs(f,s.x,s.y,b)});
    if(f.path){const lp={bld:24,door:0,prop:0,npc:0},pts=[];for(const p of f.path){const q=find(p.x+dx,p.y+dy,f,lp,80,false);if(q)pts.push(q)}
      const cross=(a,b)=>{const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/8);for(let i=1;i<n;i++){const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;if(P0.rects.some(r=>wxRD(x,y,r)<12)||wxWet(P0,x,y))return true}return false};
      const out=[];for(const q of pts){const prev=out.length?out[out.length-1]:{x:f.x,y:f.y};if(!cross(prev,q))out.push(q)}
      while(out.length>1&&cross(out[out.length-1],out[0]))out.pop();f.path=out.length>=2?out:null;f.wi=0}}
  (T22.relax||(T22.relax={}))[t.id]=moved;return moved}
// 좌표를 따로 들고 있는 표(제단 · 채집 자리 · 고르기 자리)를 새 자리로
function tw22Stores(){const seen=new Set(),fix=(reg,o)=>{if(!o||typeof o.x!=='number'||seen.has(o))return;seen.add(o);const M=T22.map[reg||'home'];if(!M)return;
    for(let i=0;i<5;i++){const n=M.get(Math.round(o.x)+','+Math.round(o.y));if(!n||n.x===o.x&&n.y===o.y)break;o.x=n.x;o.y=n.y}};
  for(const S0 of [typeof J2SPOT!=='undefined'?J2SPOT:null,typeof J3SPOT!=='undefined'?J3SPOT:null,typeof CH_SPOT!=='undefined'?CH_SPOT:null])if(S0)for(const id in S0){const o=S0[id];if(o&&!o.room)fix(o.reg,o)}
  for(const id of REG_IDS){const L=RCACHE[id];if(L&&L.spots)for(const sid in L.spots)for(const o of L.spots[sid])fix(id,o)}
  for(const sid in SQSPOT){const reg=(typeof WXSPOT_REG!=='undefined'&&WXSPOT_REG[sid])||'home',a=SQSPOT[sid];if(Array.isArray(a))for(const o of a)fix(reg,o)}}
function tw22Safe(L,t){const list=L.decor.filter(d=>!d.room&&d.town===t&&d.k!=='lamp');let m=tw22Ext(L,t,list.filter(d=>d.k!=='tfolk'));
  for(const f of list)if(f.k==='tfolk')m=Math.max(m,Math.hypot(f.hx-t.x,f.hy-t.y));t.safe=Math.max(SAFE,Math.round(m+70))}
/* ===== 1b) 건물이 간판 · 들어갈 문 · 노점을 가리지 않게 (사용자 07:24 · 07:25: 「건물들이 간판을 가리는 문제나 들어가야 하는 문을 가리지만 않게」) =====
   건물 그림이 화면에서 차지하는 모양(볼록 껍질: 바닥 네 모서리 · 처마 높이 · 용마루 · 탑)을 그림 크기 규칙(townart.js twBldSprite와 같은 높이)으로 셈한다.
   그리는 순서는 플레이어 자리에 따라 바뀔 수 있으므로(town.js zk) 앞뒤를 가리지 않고 "겹치면 가린다"로 본다. 고칠 때는 자리만 옮긴다(그림 함수는 그대로). */
function tw22Hull(d){const b=d.b;if(!b)return null;const fx=d.flip?-1:1,ox=(d.x-d.y)*KI,oy=(d.x+d.y)*KI/2,pts=[],w=b.w/2+4,dd=b.d/2+4,h=b.h||46,rh=b.rh||Math.min(48,b.d*.5);
  const add=(x,y,z)=>{const p=isoP(x,y,z);pts.push([ox+p.x*fx,oy+p.y])};
  for(const [x,y] of [[-w,-dd],[w,-dd],[w,dd],[-w,dd]]){add(x,y,0);add(x,y,h)}add(-w,0,h+rh);add(w,0,h+rh);
  for(const q of b.towers||[]){const s=q.sz/2+2;for(const [x,y] of [[q.x-s,q.y-s],[q.x+s,q.y-s],[q.x+s,q.y+s],[q.x-s,q.y+s]]){add(x,y,0);add(x,y,q.h||60)}add(q.x,q.y,(q.h||60)+(q.rh||q.sz*1.6))}
  pts.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}
  for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
  up.pop();lo.pop();const H=lo.concat(up);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of H){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}H.bb=[x0,y0,x1,y1];return H}
const tw22InHull=(H,x,y)=>{if(x<H.bb[0]||x>H.bb[2]||y<H.bb[1]||y>H.bb[3])return false;for(let i=0;i<H.length;i++){const a=H[i],b=H[(i+1)%H.length];if((b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0])<0)return false}return true};
function tw22Cover(r,H){if(r[2]<H.bb[0]||r[0]>H.bb[2]||r[3]<H.bb[1]||r[1]>H.bb[3])return 0;let n=0;for(let i=0;i<7;i++)for(let j=0;j<7;j++)if(tw22InHull(H,r[0]+(r[2]-r[0])*(i+.5)/7,r[1]+(r[3]-r[1])*(j+.5)/7))n++;return n/49}
// 가리면 안 되는 것: 간판(가짜코 옆 간판 · 건물 간판) · 들어가는 건물의 문 · 노점(가게). 화면 상자 (월드 화면 좌표)
function tw22Marks(L,t){const o=[],S=(x,y,b)=>{const sx=(x-y)*KI,sy=(x+y)*KI/2;return[sx+b[0],sy+b[1],sx+b[2],sy+b[3]]};
  for(const d of L.decor){if(d.k==='facesign'&&Math.hypot(d.x-t.x,d.y-t.y)<900)o.push({T:d,kind:'간판',host:null,r:S(d.x,d.y,[-44,-104,60,-58])});
    if(d.k==='bld'&&d.town===t&&d.enter&&d.door){const fy=Math.abs(d.door.y-(d.y+d.D/2+18))<1,wx=fy?d.door.x:d.door.x-18,wy=fy?d.door.y-18:d.door.y,top=d.signT?-((d.b.h||46)*.78+36):-56,hw=d.signT?40:16;
      o.push({T:d,kind:'문',host:d,r:S(wx,wy,[-hw,top,hw,2])})}
    if(d.k==='shop'&&d.tshop&&d.town===t)o.push({T:d,kind:'노점',host:null,r:S(d.x,d.y,[-40,-82,40,6])})}
  return o}
function tw22Hidden(L,t,lim){lim=lim==null?.12:lim;const B=(TW.blds[L.id]||[]).filter(b=>b.k==='bld'&&Math.hypot(b.x-t.x,b.y-t.y)<1100).map(b=>({b,H:tw22Hull(b)})).filter(o=>o.H),out=[];
  for(const m of tw22Marks(L,t))for(const o of B){if(o.b===m.host)continue;const f=tw22Cover(m.r,o.H);if(f>lim)out.push({T:m.T,kind:m.kind,by:o.b,frac:Math.round(f*100)/100,label:(m.T.label||m.T.shopN||m.T.k)+' ← '+(o.b.label||o.b.id||'집')})}
  return out}
// 고치기: 간판은 간판을 옮기고, 문 · 노점을 가린 건물은 그 건물(과 붙은 소품)을 옆으로 옮긴다
function tw22Unhide(L,t){const log=[],B=()=>(TW.blds[L.id]||[]).filter(b=>Math.hypot(b.x-t.x,b.y-t.y)<1100);
  const lq=L.id==='home'?null:L.lq,ok=lq?(L.okT||(L.okT=wxReach(lq,t.x,t.y))):null;
  const pins=()=>L.decor.filter(d=>Math.hypot(d.x-t.x,d.y-t.y)<1100&&(d.k==='tfolk'&&!d.room||d.k==='npc'||d.k==='shop'||d.k==='gate'||d.k==='stash'||d.k==='fountain'||d.k==='statue'||d.k==='facesign'||d.use||d.tprop&&!d.foot||d.k==='lamp'));
  const rgap=(a,b)=>Math.max(a[0]-b[2],b[0]-a[2],a[1]-b[3],b[1]-a[3]);
  const moveSign=s=>{const host=B().filter(b=>b.k==='bld').sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0],x0=s.x,y0=s.y,P0=pins().filter(p=>p!==s),Hs=B().filter(b=>b.k==='bld').map(b=>tw22Hull(b)).filter(Boolean);
    const good=(x,y)=>{if(host&&Math.hypot(x-host.x,y-host.y)>260)return false;if(lq&&wxLqAt(lq,x,y)>.3)return false;const r=[(x-y)*KI-44,(x+y)*KI/2-104,(x-y)*KI+60,(x+y)*KI/2-58];
      for(const H of Hs)if(tw22Cover(r,H)>.04)return false;for(const p of P0){const b=p.k==='shop'?[-44,-80,44,12]:p.k==='statue'?[-60,-200,60,10]:p.k==='gate'?[-30,-62,30,6]:p.k==='stash'?[-24,-42,24,6]:null;if(b){const sx=(p.x-p.y)*KI,sy=(p.x+p.y)*KI/2;if(tw22Hit(r,[sx+b[0],sy+b[1],sx+b[2],sy+b[3]],2))return false}}for(const b of B())for(const f of b.foot||[])if(wxRD(x,y,f)<26)return false;for(const p of P0)if(Math.hypot(p.x-x,p.y-y)<(p.k==='fountain'||p.k==='statue'?90:p.k==='shop'?60:34))return false;return true};
    for(let r=10;r<=260;r+=10){const n=Math.max(8,Math.round(r*6.283/14));for(let i=0;i<n;i++){const a=i/n*6.283,x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r;if(good(x,y)){s.x=x;s.y=y;s._s=null;return Math.round(r)}}}return 0};
  const shift=(C,marks)=>{const f0=C.foot[0],att=L.decor.filter(d=>d!==C&&!d.foot&&d.k!=='tfolk'&&d.k!=='npc'&&d.k!=='shop'&&d.k!=='gate'&&d.k!=='stash'&&!d.use&&d.k!=='facesign'&&d.k!=='fountain'&&d.k!=='statue'&&d.k!=='lamp'&&wxRD(d.x,d.y,f0)<26);
    const others=B().filter(b=>b!==C),P0=pins().filter(p=>!att.includes(p)),d0=Math.hypot(C.x-t.x,C.y-t.y),ux=(C.x-t.x)/(d0||1),uy=(C.y-t.y)/(d0||1),q=Math.SQRT1_2;
    const dirs=[[q,-q],[-q,q],[ux,uy],[(ux+q)/1.6,(uy-q)/1.6],[(ux-q)/1.6,(uy+q)/1.6]];
    for(let s=12;s<=150;s+=12)for(const [ax,ay] of dirs){const dx=ax*s,dy=ay*s,ft=C.foot.map(f=>[f[0]+dx,f[1]+dy,f[2]+dx,f[3]+dy]);
      if(Math.hypot(C.x+dx-t.x,C.y+dy-t.y)>d0+140)continue;let bad=false;
      for(const o of others){for(const g of o.foot||[])for(const f of ft)if(rgap(f,g)<30){bad=true;break}if(bad)break}if(bad)continue;
      for(const p of P0){for(const f of ft)if(wxRD(p.x,p.y,f)<22){bad=true;break}if(bad)break}if(bad)continue;
      if(lq){for(const f of ft)for(const [x,y] of [[f[0],f[1]],[f[2],f[1]],[f[0],f[3]],[f[2],f[3]]])if(wxLqAt(lq,x,y)>.3)bad=true;if(bad)continue;if(C.door&&ok&&!wxCanReach(ok,C.door.x+dx,C.door.y+dy))continue}
      const tmp={...C,x:C.x+dx,y:C.y+dy},H=tw22Hull(tmp);if(marks.some(m=>m.host!==C&&tw22Cover(m.r,H)>.06))continue;
      if(C.enter&&C.door){const mm=tw22Marks({decor:[tmp]},t).find(m=>m.host===tmp);if(mm&&others.some(o=>o.k==='bld'&&tw22Cover(mm.r,tw22Hull(o))>.06))continue}
      for(const d of [C,...att])tw22Move(d,dx,dy);return Math.round(s)}return 0};
  for(let pass=0;pass<4;pass++){const V=tw22Hidden(L,t);if(!V.length)break;let fixed=0;
    for(const v of V){if(v.T.k==='facesign'){const r=moveSign(v.T);if(r){fixed++;log.push(`간판 ${r} 옮김 (${v.label})`)}}
      else{const r=shift(v.by,tw22Marks(L,t));if(r){fixed++;log.push(`${v.by.label||'집'} ${r} 옮김 (${v.label})`)}}
      if(fixed)break}
    if(!fixed)break}
  (T22.unhide||(T22.unhide={}))[t.id]=log;return log}

{const t0=performance.now();T22.map={};
  for(const [L,t] of wxTowns())T22.v21[t.id]=tw22Stat(L,t);
  const MV=new Map(),tm=T22.tm={},lap=k=>{const n=performance.now();tm[k]=Math.round(n-(lap.t||t0));lap.t=n};
  for(const [L,t] of wxTowns())MV.set(t,tw22Expand(L,t)||new Set());lap('expand');
  for(const [L,t] of wxTowns())tw22Fixed(L,t,MV.get(t));lap('fixed');
  for(const [L,t] of wxTowns())tw22Clear(L,t,MV.get(t));lap('clear');
  for(const [L,t] of wxTowns())tw22Unhide(L,t);lap('unhide');
  // 마을 사람 자리: 옛 v18 배율로 길을 또 늘리지 않게 잠시 1로 둔다
  for(const [L,t] of wxTowns()){const k0=WXT.k[t.id];WXT.k[t.id]=1;try{tw22Relax(L,t)}finally{if(k0!=null)WXT.k[t.id]=k0;else delete WXT.k[t.id]}}lap('relax');
  for(const [L,t] of wxTowns()){tw22Safe(L,t);T22.now[t.id]=tw22Stat(L,t)}
  tw22Stores();lap('rest');
  T22.ms=Math.round(performance.now()-t0)}

/* ===== 2) 같은 사람은 한 곳에만 ===== */
// 마을 의뢰인(QNPC, 바깥에 선 그림)과 같은 사람이 마을 사람(TWFOLK)으로도 있으면 마을 사람 쪽만 남기고, 메인 의뢰도 그 사람이 맡는다
const TW22_QM={arden:'elian',willowen:'odric'},TW22_QMR={elian:'arden',odric:'willowen'};// v26: 윌로벤 의뢰인 오드릭은 헤이븐 나루에
function tw22MainMk(tid){const q=qCur();if(!q)return '';const st=qState().st;if(st===0&&q.town===tid)return '!';if(st===2&&qTurnTown(q)===tid)return '?';
  if(st===1&&q.goals.some((g,j)=>g.type==='talk'&&g.town===tid&&!qGoalDone(q,j)))return '?';return ''}
const tw22MainHere=tid=>{const q=qCur();return !!(tw22MainMk(tid)||q&&qState().st===1&&q.town===tid)};
const tw22QT=tid=>qTw(tid);const tw22Reg=f=>f&&f.town&&f.town.reg||'home';// v26: 왕도 · 헤이븐 나루
for(const tid in TW22_QM){const t=tw22QT(tid),f=sqFolk(TW22_QM[tid]);if(!t||!f||!QNPC[tid]||QNPC[tid].n!==f.n)continue;
  {const L0=twL(t.reg||'home');if(L0)for(const arr of [L0.decor,L0.lights]){for(let i=arr.length-1;i>=0;i--){const d=arr[i];if(d.k==='npc'&&d.town===t)arr.splice(i,1)}}}
  t.npc=null;T22.dups.push(`${f.n}: 바깥 의뢰인 그림을 치우고 ${f.room?TWROOM[f.room].n+' 안':t.n} 한 명만 남김`)}
const tw22MainTarget=tid=>{const t=tw22QT(tid),f=sqFolk(TW22_QM[tid]);if(!t||!f)return null;
  if(f.room){const o=(TWFOLK[f.id].room)||[0,0],rg=tw22Reg(f),b=(TW.blds[rg]||[]).find(b=>b.enter===f.room);return{reg:rg,x:t.x+o[0],y:t.y+o[1],room:f.room,door:b?b.door:null,label:`${t.n} ${TWROOM[f.room].n} 안 · ${f.n}`}}
  return{reg:tw22Reg(f),x:f.hx,y:f.hy,label:`${t.n} · ${f.n}`}};
{const _q=qMainTargetW;qMainTargetW=function(){let fx=null;
  for(const tid in TW22_QM){const t=tw22QT(tid);if(t&&!t.npc){const g=tw22MainTarget(tid);if(g){t.npc={x:g.x,y:g.y};(fx||(fx=[])).push([t,g])}}}
  let r;try{r=_q()}finally{if(fx)for(const [t] of fx)t.npc=null}
  if(r&&fx)for(const [,g] of fx)if(Math.abs(r.x-g.x)<.01&&Math.abs(r.y-g.y)<.01)return Object.assign({},g);return r}}
{const _m=sqMark;sqMark=function(f){const tid=f&&TW22_QMR[f.id];if(tid&&!(SQE.cur&&SQE.cur.who===f.id)){const m=tw22MainMk(tid);if(m){const s=_m(f);return s==='?'?'?':m}}return _m(f)}}
{const _t=sqTalk;sqTalk=function(f){const tid=f&&TW22_QMR[f.id];if(tid&&tw22MainHere(tid)&&!(SQE.cur&&SQE.cur.who===f.id)){const t=tw22QT(tid);
    _t(f);questTalk(t);SQV.mode='npc';SQV.npc=f;qTown=t;if(!panel.hidden&&tab==='quest')renderPanel();return true}return _t(f)}}
{const _h=questHtml;questHtml=function(){const f=SQV.mode==='npc'&&SQV.npc,tid=f&&TW22_QMR[f.id];if(!tid||!tw22MainHere(tid))return _h();
  const t=tw22QT(tid),q0=qTown;let mh='';SQV.mode=null;qTown=t;try{mh=_h()}finally{SQV.mode='npc';SQV.npc=f;qTown=q0}
  const nh=_h().replace(/^<p class="qsay"><b>[^<]*<\/b>[^]*?<\/p>/,'');return mh+(nh.trim()?'<hr class="tw22sep">'+nh:'')}}
{const _ms=sqMarks;sqMarks=function(world){const out=_ms(world);
  for(const tid in TW22_QM){const m=tw22MainMk(tid);if(!m)continue;const f=sqFolk(TW22_QM[tid]);if(!f)continue;const b=f.room?(TW.blds[tw22Reg(f)]||[]).find(b=>b.enter===f.room):null;
    const spots=IN?(IN.rid===f.room?[f]:[]):(!DG&&REG.id===tw22Reg(f)?[b?b.door:{x:f.hx,y:f.hy}]:[]);
    for(const p of spots){const k=out.find(k=>(k.kind==='!'||k.kind==='?')&&Math.abs(k.x-p.x)<1&&Math.abs(k.y-p.y)<1);if(k){k.kind=m;k.col=WX_QCOL.main;k.mq=1}else out.push({x:p.x,y:p.y,kind:m,col:WX_QCOL.main,mq:1})}}
  return out}}
// 이름만 같던 다른 사람: 한쪽 이름을 바꿔 같은 사람이 두 곳에 있는 것처럼 보이지 않게
function tw22Rename(){
  if(QNPC.lastlight&&QNPC.lastlight.n==='감시자 세린'){QNPC.lastlight.n='감시자 이로나';
    const fx=s=>typeof s==='string'?s.replace(/감시자 세린/g,'감시자 이로나').replace(/\(세린\)/g,'(이로나)').replace(/세린에게/g,'이로나에게').replace(/세린과/g,'이로나와'):s;
    for(const q of (typeof WX_ACT2!=='undefined'?WX_ACT2:[])){if(q.town!=='gullhaven'&&q.town!=='lastlight')continue;for(const k of ['say','done','t']){const ds=Object.getOwnPropertyDescriptor(q,k);if(ds&&'value' in ds&&ds.writable)q[k]=fx(q[k])}for(const g of q.goals||[])if(g.d)g.d=fx(g.d)}
    T22.ren.push('2막 마지막 등불의 「감시자 세린」 → 「감시자 이로나」 (궁수 전직관 「순찰대장 세린」과 이름이 같았음)')}
  if(TWFOLK.dg_pip&&TWFOLK.dg_pip.n==='꼬마 발굴꾼 핍'){const n='꼬마 발굴꾼 모리';TWFOLK.dg_pip.n=n;if(typeof WX_FOLK!=='undefined'&&WX_FOLK.dg_pip)WX_FOLK.dg_pip.n=n;
    for(const [L] of wxTowns())for(const d of L.decor)if(d.k==='tfolk'&&d.id==='dg_pip')d.n=n;for(const f of TW.folk)if(f.id==='dg_pip')f.n=n;
    T22.ren.push('더스트게이트 「꼬마 발굴꾼 핍」 → 「꼬마 발굴꾼 모리」 (윌로벤 「꼬마 핍」과 이름이 같았음)')}}
tw22Rename();
// 같은 이름 · 같은 사람 찾기 (검사 · 보고용): 이름 붙은 사람이 두 곳 이상에 있으면 [이름, 자리…]
function tw22DupList(){const at={};const add=(n,w)=>(at[n]=at[n]||[]).push(w);const seen=new Set();
  for(const [L,t] of wxTowns())for(const d of L.decor){if(d.k==='tfolk'&&!seen.has(d)&&!/^o_/.test(d.id)){seen.add(d);add(d.n,`${L.id}:${(d.town||t).id}`)}if(d.k==='npc'&&d.town===t&&QNPC[t.id])add(QNPC[t.id].n,`${L.id}:${t.id}:의뢰인`)}
  for(const f of TW.folk)if(f.room&&!seen.has(f)){seen.add(f);add(f.n,'방:'+f.room)}
  return Object.entries(at).filter(([n,a])=>a.length>1)}

/* ===== 3) 누르기: 보이는 몸으로 고르고, 멀면 걸어가서 말 걸기 ===== */
const tw22Can=()=>!!(P&&!P.dead&&!DG&&!paused&&panel.hidden&&(IN||inSafe(P.x,P.y,-60)));
function tw22Targets(){const L=IN?IN.list:decor,o=[];for(const d of L){if(Math.abs(d.x-P.x)>900||Math.abs(d.y-P.y)>900)continue;if(tw22Box(d,true))o.push(d)}return o}
// sx,sy: 화면 단위(rel() 결과). touch면 손가락 여유 12
function tw22Pick(sx,sy,touch){let best=null,bs=1e9;const slop=touch?12:2;
  for(const d of tw22Targets()){const b=tw22Box(d,true),s=W2S(d.x,d.y),x0=s.x+b[0],y0=s.y+b[1],x1=s.x+b[2],y1=s.y+b[3];
    if(sx<x0-slop||sx>x1+slop||sy<y0-slop||sy>y1+slop)continue;const inside=sx>=x0&&sx<=x1&&sy>=y0&&sy<=y1;
    const sc=(inside?0:1e5)+Math.hypot(sx-(x0+x1)/2,(sy-(y0+y1)/2)*.5)-(inside?(d.x+d.y)*1e-4:0);if(sc<bs){bs=sc;best=d}}
  return best}
const tw22Reach=d=>d.k==='tfolk'?56:d.k==='npc'?72:d.k==='shop'?78:d.k==='gate'?78:d.k==='stash'?66:54;
function tw22Do(d){const t=d.town||(IN&&IN.town)||nearestTown(d.x,d.y).t;
  if(d.k==='tfolk'){if(d.shopk&&!d.room){actTown=t;actShop=d.shopk;act='shop'}else{act='tw_talk';TW.act=d}}
  else if(d.k==='npc'){act='quest';actTown=d.town}
  else if(d.k==='shop'){actTown=d.town||t;actShop=d.shopType;act='shop'}
  else if(d.k==='gate'){actTown=d.town||t;act='gate'}
  else if(d.k==='stash'){actTown=d.town||t;act='stash'}
  else if(d.use){act='tw_use';TW.act=d}
  else return false;doAct();return true}
function tw22Stop(){T22.go=null;if(joy&&joy.id==='tw22')joy=null}
function tw22Click(d){tw22Stop();if(!d||!tw22Can())return false;if(dist(P,d)<=tw22Reach(d)){tw22Do(d);return true}
  T22.go={d,best:dist(P,d),t:0,stuck:0};return true}
function tw22GoTick(dt){const g=T22.go;if(!g)return;const d=g.d;
  const mv=keys.has('KeyW')||keys.has('KeyA')||keys.has('KeyS')||keys.has('KeyD')||keys.has('ArrowUp')||keys.has('ArrowDown')||keys.has('ArrowLeft')||keys.has('ArrowRight');
  if(!P||P.dead||DG||!panel.hidden||mv||joy&&joy.id!=='tw22'||(IN?!IN.list.includes(d):!decor.includes(d))){tw22Stop();return}
  const dd=dist(P,d);if(dd<=tw22Reach(d)-4){tw22Stop();tw22Do(d);return}
  g.t+=dt;if(dd<g.best-3){g.best=dd;g.stuck=0}else if((g.stuck+=dt)>.9||g.t>14){tw22Stop();msg('길이 막혀 더 가지 못했어요. 조금 돌아서 다시 눌러 보세요','#a39d8f');return}
  const a=W2S(d.x,d.y),b=W2S(P.x,P.y),vx=a.x-b.x,vy=a.y-b.y,l=Math.hypot(vx,vy)||1;joy={id:'tw22',ox:0,oy:0,x:vx/l*44,y:vy/l*44}}
cv.addEventListener('pointerdown',e=>{if(T22.go)tw22Stop();if(!tw22Can())return;if(e.pointerType==='mouse'&&e.button!==0)return;
  const p=rel(e),touch=e.pointerType!=='mouse',d=tw22Pick(p.x,p.y,touch);if(!d)return;
  if(touch&&p.x<W*.45){T22.tap={id:e.pointerId,x:p.x,y:p.y,t:performance.now(),d};return}// 조이스틱 자리: 뗄 때 톡 누른 것이면
  e.stopImmediatePropagation();e.preventDefault();tw22Click(d)},true);
addEventListener('pointerup',e=>{const tp=T22.tap;if(!tp||tp.id!==e.pointerId)return;T22.tap=null;const p=rel(e);
  if(Math.hypot(p.x-tp.x,p.y-tp.y)<12&&performance.now()-tp.t<400&&tw22Can()){if(joy&&joy.id===e.pointerId)joy=null;tw22Click(tp.d)}},true);
cv.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const n=performance.now();if(n-T22.hovT<60)return;T22.hovT=n;
  const p=rel(e),d=tw22Can()?tw22Pick(p.x,p.y,false):null;T22.hov=d;const c=d?'pointer':'';if(cv.style.cursor!==c)cv.style.cursor=c});
// 매 프레임: 걸어가기 · PC에서 마우스를 올린 사람을 F가 먼저 고르기
{const _u=update;update=function(dt){if(T22.go)tw22GoTick(dt);_u(dt);
  const h=T22.hov;if(h&&!touchMode&&mouse.active&&!P.dead&&!DG&&(IN?IN.list.includes(h):decor.includes(h))&&dist(P,h)<=tw22Reach(h)&&tw22Box(h,true)){
    const t=h.town||(IN&&IN.town)||nearestTown(h.x,h.y).t;
    if(h.k==='tfolk'){if(h.shopk&&!h.room){act='shop';actShop=h.shopk;actTown=t}else{act='tw_talk';TW.act=h}}
    else if(h.k==='npc'){act='quest';actTown=h.town}else if(h.k==='shop'){act='shop';actShop=h.shopType;actTown=t}
    else if(h.k==='gate'){act='gate';actTown=t}else if(h.k==='stash'){act='stash';actTown=t}else if(h.use){act='tw_use';TW.act=h}}}}
// 마우스를 올린 사람은 멀어도 이름을 보인다 · 합친 의뢰인은 메인 의뢰 색
{const _df=twDrawFolk;twDrawFolk=function(d){const n=QLBL.length;_df(d);
  if(TW22_QMR[d.id]&&QLBL.length>n&&tw22MainMk(TW22_QMR[d.id]))QLBL[QLBL.length-1].main=1;
  if(d===T22.hov&&QLBL.length===n&&d._s)QLBL.push({x:d._s.x,y:d._s.y-(d.L.child?58:78),n:d.n,mk:'',c:d.shopk?'#ffd27a':'#e8e2d2',say:'',sa:0,ph:d.x})}}

/* ===== 4) 늦게 세우는 사람 · 소품도 같은 배율로 (lord22 거울 · dark21 등불 …) ===== */
// 나중에(의뢰 도중) 세우는 사람 · 물건(메아리의 거울 · 꺼진 등불 · 네라 …)도 누르는 상자가 다른 것과 겹치거나 건물에 가리면 가까운 빈자리로
function tw22Settle(L,t,d){if(!d||!tw22Box(d,false))return d;const fk=d.k==='tfolk',bx=tw22Box(d,false),i0=L.decor.indexOf(d);
  const O=L.decor.filter(o=>o!==d&&!o.room&&Math.abs(o.x-d.x)<700&&Math.abs(o.y-d.y)<700&&tw22Box(o,false)&&!tw22Same(o,d)).map(o=>tw22Abs(o,o.k==='tfolk'?o.hx:o.x,o.k==='tfolk'?o.hy:o.y,tw22Box(o,false)));
  const H=(TW.blds[L.id]||[]).filter(b=>b.k==='bld'&&Math.abs(b.x-d.x)<700&&Math.abs(b.y-d.y)<700).map(tw22Hull);
  const clear=(x,y)=>{const r=tw22Abs(d,x,y,bx);return !O.some(o=>tw22Hit(r,o,3))&&H.every(h=>tw22Cover(r,h)<.12)};
  const x0=fk?d.hx:d.x,y0=fk?d.hy:d.y;if(clear(x0,y0))return d;
  if(i0>=0)L.decor.splice(i0,1);let p=null;
  try{for(let r=12;r<=300&&!p;r+=12){const n=Math.max(8,Math.round(r*6.283/16));for(let i=0;i<n;i++){const a=i/n*6.283,x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r;if(clear(x,y)&&v20FindSpot(L,t,x,y,0,fk?null:{prop:56})){p={x,y};break}}}}
  finally{if(i0>=0)L.decor.splice(i0,0,d)}
  if(p){tw22Move(d,p.x-x0,p.y-y0);if(fk){d.x=d.hx;d.y=d.hy;if(d.path)d.path=null}(T22.settle||(T22.settle=[])).push(`${d.n||d.k} ${Math.round(Math.hypot(p.x-x0,p.y-y0))}`)}
  return d}
{const _f=v20AddFolk;v20AddFolk=function(id,townId,dx,dy){const t=v20Town(townId),k=t&&t.reg&&t.reg!=='home'?tw22K(t):1;const d=_f(id,townId,dx*k,dy*k);return d&&t?tw22Settle(v20L(t.reg||'home'),t,d):d}}
{const _p=v20AddProp;v20AddProp=function(townId,dx,dy,o){const t=v20Town(townId),k=t&&t.reg&&t.reg!=='home'?tw22K(t):1;const d=_p(townId,dx*k,dy*k,o);return d&&t?tw22Settle(v20L(t.reg||'home'),t,d):d}}

/* ===== 5) 옛 저장: 마을 안에서 건물 · 소품 위에 서 있으면 가까운 빈자리로 ===== */
// 걸을 수 있는 자리: 막힌 땅 · 물 · 건물 발자국(twPush가 밀어내는 곳)만 아니면 된다. 옛 저장은 이것만 고친다(분수 옆 등 v21에서 서 있던 자리는 그대로)
function tw22WalkAt(x,y){if(!(x>=20&&y>=20&&x<=WORLD-20&&y<=WORLD-20))return false;if(blockedAt(x,y)||twWet(REG.id,x,y))return false;const r=P?P.r:13;
  for(const b of TW.blds[REG.id]||[])for(const f of b.foot||[])if(x>f[0]-r&&x<f[2]+r&&y>f[1]-r&&y<f[3]+r)return false;return true}
// 빈자리: 걸을 수 있고 사람 · 노점 · 분수 같은 것 위도 아닌 곳 (옮겨 줄 자리를 고를 때)
function tw22FreeAt(x,y){if(!tw22WalkAt(x,y))return false;
  for(const d of decor){if(Math.abs(d.x-x)>90||Math.abs(d.y-y)>90)continue;const big=d.k==='fountain'||d.k==='statue';
    if(big||d.k==='tfolk'||d.k==='npc'||d.k==='shop'||d.k==='gate'||d.k==='stash'||d.tprop&&!WXT_SMALL.has(d.k)&&d.si==null){if(Math.hypot(d.x-x,d.y-y)<(big?82:d.k==='shop'?40:24))return false}}
  return true}
function tw22SafeSpot(){if(!P||DG||IN)return null;const n=nearestTown(P.x,P.y);if(n.d>(n.t.safe||SAFE)+80)return null;if(tw22WalkAt(P.x,P.y))return null;const x0=P.x,y0=P.y;
  for(let r=12;r<=420;r+=12){const m=Math.max(8,Math.round(r*6.283/16));for(let i=0;i<m;i++){const a=i/m*6.283,x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r;if(tw22FreeAt(x,y)){P.x=x;P.y=y;followCam();return{x,y,from:[x0,y0]}}}}
  P.x=n.t.x;P.y=n.t.y+110;followCam();return{x:P.x,y:P.y,from:[x0,y0]}}
{const _ld=load;load=function(d,slot){const r=_ld(d,slot);if(r){try{T22.fixed=tw22SafeSpot()}catch(e){if(window.__QA)throw e}}return r}}

/* ===== 6) 화면 · 길찾기 캐시 다시 굽기 ===== */
{for(const k in TKEEP)delete TKEEP[k];for(const k in TERR)delete TERR[k];for(const k in QZC)delete QZC[k];TW.flats={};mmBg=null;decoKey='';if(typeof chunks!=='undefined')chunks.clear();
  if(REG.id==='home'||RCACHE[REG.id]){const L=twL(REG.id);setArr(decor,L.decor);setArr(LIGHTS,L.lights)}}
window.__town22={TK22,T22,tw22Box,tw22Pick,tw22Click,tw22Do,tw22Stop,tw22Targets,tw22FreeAt,tw22WalkAt,tw22SafeSpot,tw22DupList,tw22MainMk,tw22MainTarget,tw22Stat,tw22Abs,tw22Hit,tw22Same,TW22_QM,dbgZoom:z=>{GFX.zoom=z;resize()},tw22Hull,tw22Hidden,tw22Marks,tw22Cover};
