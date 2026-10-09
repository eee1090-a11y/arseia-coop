/* ---------- 월드 확장(v18): 새 지역의 마을 모습 · 몬스터 구별 · 지역 땅에 던전/의뢰 자리 놓기 ----------
   wx-world.js · wx-act2.js · wx-towns.js(순수 데이터) 바로 뒤, region.js 앞에 붙는다.
   여기 함수들은 region.js buildRegion · town.js twBuildTown 안에서 불린다. */
// 새 마을 다섯 곳의 건물 재질 (townart.js TWPAL 과 같은 모양)
const WX_TWPAL={
  rook:{wall:'stone',wc:'#7a7480',timber:'#3a2e2a',base:'#4e4a52',roof:'thatch',rc:['#5a4a5e','#4a4046','#62544a'],door:'#3a2a22',shut:['#4a3a5a','#5a3a2a','#3a4a3a'],trim:'#3a2e2a',moss:1},
  crag:{wall:'log',wc:'#7a5e44',timber:'#3a2a1c',base:'#6a6a66',roof:'slate',rc:['#5a4a3a','#4a3a2e','#3e4a52'],door:'#3a2a1c',shut:['#7a3a2a','#3e4a5a','#5a5a3a'],trim:'#3a2a1c',snow:1,stoneLow:1},
  dust:{wall:'adobe',wc:'#c89a6a',timber:'#5a3a22',base:'#8a6a4a',roof:'tile',rc:['#8a5a3a','#7a4a32','#9a7a5a'],door:'#4a3020',shut:['#3a6a7a','#8a4a2a','#6a5a3a'],trim:'#5a3a22',stoneLow:1},
  gull:{wall:'plaster',wc:'#dcdcd4',timber:'#2e3a4a',base:'#6a7078',roof:'slate',rc:['#3a4a6a','#4a4a5a','#2a3a5a'],door:'#2a3a4a',shut:['#2e4a7a','#7a2a2a','#3a5a6a'],trim:'#2e3a4a',stoneLow:1},
  last:{wall:'ashlar',wc:'#5e5470',timber:null,base:'#3a3446',roof:'iron',rc:['#3a2a4a','#2e2a3a','#4a3a5a'],door:'#2a1e3a',shut:['#6a3a9a','#3a2a5a','#5a4a7a'],trim:'#8a6ac0',arch:1},
};
// 새 전초 마을의 분위기 (town.js TWOUT 과 같은 모양)
const WX_TWOUT={
  moor:{st:'rook',local:['선돌 순례자','#5a4a62',5,'선돌 사이로 바람이 울면, 죽은 이들이 길을 묻는 거래요.'],props:['ruinpillar','haystack','fence','bones']},
  highland:{st:'crag',local:['산사람 목동','#6a5040',3,'산에선 날씨가 왕이야. 구름이 내려오면 무조건 내려가.'],props:['snowpine','crate','sacks','iceboulder']},
  canyon:{st:'dust',local:['발굴꾼','#8a6a42',3,'거인들 톱니는 아직도 기름 냄새가 나. 믿어지나?'],props:['sandrock','cart','crate','ruinpillar']},
  cliffs:{st:'gull',local:['등대 견습생','#3a4a6a',6,'번개가 칠 때마다 등대 불빛을 세. 오늘은 마흔둘.'],props:['searock','nets','barrel','windtree']},
  abyss:{st:'last',local:['등불지기','#4a3a5a',5,'등불은 꺼지면 안 돼. 꺼지는 순간 균열이 한 뼘 다가와.'],props:['obsidian','banner','crate','ruinpillar']},
};
// 같은 지역에서 원본과 똑같아 보이는 몬스터는 색 · 눈빛을 바꿔 구별한다 (그림은 구워 두는 그대로)
const WX_TINT={
  m_stinger:{col:'#7a3a5a',eye:'#9aff3a'},m_oko:{col:'#8a6a2a'},m_igna:{col:'#ffc04a',eye:'#fff4c0'},k_rogue:{col:'#4e5e70'},
  m_keymaster:{col:'#8a7a5a',eye:'#ffd060'},m_riftmother:{col:'#8a3a6a'},h_cairn:{eye:'#c88aff'},h_troll:{col:'#5a7a52'},
  c_dust:{col:'#b8a890'},m_isra:{col:'#4ab0e8'},b_morwen:{col:'#d0d8e8'},
};
// 이름 있는 새 준보스 · 보스의 장식 (mon.js MON_V 에 있는 장식만 쓴다)
const WX_MONV={b_setra:'crown',m_bran:'crown',b_morwen:'kingcrown',m_isra:'weed',m_sylva:'weed',m_sporemom:'moss',b_kragul:'moss',m_frostfang:'collar',m_thornhound:'collar',m_fenrick:'bonearmor',
  m_gur:'maw',m_bosun:'maw',m_hagen:'broken',b_azar:'broken',m_sarkan:'broken',m_rokan:'warlord',b_karven:'mitre',m_nefer:'mitre',b_kaila:'halo',m_ulva:'halo',m_riftmother:'halo',b_oseros:'flamecrown',b_elgaros:'flamecrown'};
// 지역 던전 입구 (dg.js CAVES 와 같은 모양)
const wxCaves=id=>WX_DUNGEONS.filter(d=>d.reg===id).map(d=>({x:d.x,y:d.y,k:'cave',cave:d,s:1,v:0,light:120}));
// 길 하나 (포탈 길과 같은 2차 곡선)
function wxRoad(A,B,s){const mx=(A.x+B.x)/2,my=(A.y+B.y)/2,dx=B.x-A.x,dy=B.y-A.y,l=Math.hypot(dx,dy)||1,off=(s()-.5)*l*.3,cx=mx-dy/l*off,cy=my+dx/l*off,pts=[];
  for(let i=0;i<=40;i++){const u=i/40;pts.push({x:(1-u)*(1-u)*A.x+2*(1-u)*u*cx+u*u*B.x,y:(1-u)*(1-u)*A.y+2*(1-u)*u*cy+u*u*B.y})}return pts}
// 물/용암 격자에서 (x,y)로부터 걸어서 닿는 칸 (1=닿음). QA와 채집 자리 놓기에 쓴다
function wxReach(lq,x,y){const N=LQN,ok=new Uint8Array(N*N),i0=clamp(Math.round(x/LQS),0,N-1),j0=clamp(Math.round(y/LQS),0,N-1),q=[j0*N+i0];ok[q[0]]=1;
  for(let h=0;h<q.length;h++){const k=q[h],i=k%N,j=(k/N)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=i+a,Y=j+b;if(X<0||Y<0||X>=N||Y>=N)continue;const n=Y*N+X;if(ok[n]||lq[n]>.5)continue;ok[n]=1;q.push(n)}}return ok}
const wxCanReach=(ok,x,y)=>{const N=LQN,i=clamp(Math.round(x/LQS),0,N-1),j=clamp(Math.round(y/LQS),0,N-1);return !!ok[j*N+i]};
// buildRegion 끝에서: 2막 의뢰인 자리 · 마을 의뢰 채집 자리. LQ는 이 지역 격자로 잡혀 있다
function wxRegionExtras(id,T,dec,lair,caves,edges,lq){
  if(QNPC[T.id]){T.npc={x:T.x-125,y:T.y-45};dec.push({x:T.npc.x,y:T.npc.y,k:'npc',s:1,v:0,town:T,light:120})}
  const spots={},ok=wxReach(lq,T.x,T.y);
  for(const sid in WX_SPOTS){const S=WX_SPOTS[sid];if(S.reg!==id)continue;const s=mulberry(((REGIONS[id].seed|0)*7919+sid.length*131+sid.charCodeAt(0)*17+sid.charCodeAt(sid.length-1))|0),out=[];
    const nr=S.near||'town';let cx=T.x,cy=T.y,r0=500,r1=650,dir=null;
    if(nr==='lair'){cx=lair.x;cy=lair.y;r0=300;r1=450}
    else if(nr.startsWith('dungeon:')){const c=caves.find(c=>c.cave.id===nr.slice(8));if(c){cx=c.x;cy=c.y;r0=250;r1=400}}
    else if(nr.startsWith('edge:')){const sd=nr.slice(5),e=edges.find(e=>e.side===sd);if(e){cx=e.x;cy=e.y;r0=300;r1=500;dir=INW[sd]}}
    for(let i=0;i<S.n;i++){let p=null;
      for(let k=0;k<60&&!p;k++){let x,y;const r=r0+s()*(r1-r0);
        if(dir){const pv=s()*2-1;x=cx+dir[0]*r+dir[1]*pv*420;y=cy+dir[1]*r+dir[0]*pv*420}else{const a=s()*6.283;x=cx+Math.cos(a)*r;y=cy+Math.sin(a)*r}
        if(x<160||y<160||x>WORLD-160||y>WORLD-160)continue;if(liqAt(x,y)>.15||!wxCanReach(ok,x,y))continue;
        if(Math.hypot(x-T.x,y-T.y)<TOWN_R+150||out.some(o=>Math.hypot(o.x-x,o.y-y)<70)||edges.some(e=>Math.hypot(e.x-x,e.y-y)<120)||caves.some(c=>Math.hypot(c.x-x,c.y-y)<140))continue;p={x,y}}
      if(!p)p={x:T.x+Math.cos(i)*560,y:T.y+Math.sin(i)*560};out.push(p);
      dec.push({x:p.x,y:p.y,k:S.kind,pv:i%3,use:sid,si:i,qonly:1,tprop:1,s:1,v:0,zl:0})}
    spots[sid]=out}
  // 장식이 채집 자리를 가리지 않게
  const all=Object.values(spots).flat();if(all.length)for(let i=dec.length-1;i>=0;i--){const d=dec[i];if(d.use||d.town||d.k==='edgeportal'||d.k==='cave'||d.k==='npc')continue;if(all.some(p=>Math.hypot(d.x-p.x,d.y-p.y)<46))dec.splice(i,1)}
  return spots}
// 전초 마을에 마을 의뢰 사람들 세우기 (town.js twBuildTown 전초 갈래). 건물과 겹치면 바깥쪽으로 민다
function wxPlaceFolk(t,add,blds){for(const id in WX_FOLK){const F=WX_FOLK[id];if(F.town!==t.id)continue;
  let ox=0,oy=0;const hit=(x,y)=>blds.some(b=>b.foot&&b.foot.some(f=>x>f[0]-26&&x<f[2]+26&&y>f[1]-26&&y<f[3]+26))||(t.shops||[]).some(s=>Math.hypot(s.x-x,s.y-y)<90)||Math.hypot(t.x-x,t.y-y)<105||Math.hypot(t.gate.x-x,t.gate.y-y)<60||Math.hypot(t.stash.x-x,t.stash.y-y)<55||t.npc&&Math.hypot(t.npc.x-x,t.npc.y-y)<50;
  const ax=F.at[0],ay=F.at[1],l=Math.hypot(ax,ay)||1;for(let k=0;k<10&&hit(t.x+ax+ox,t.y+ay+oy);k++){ox+=ax/l*24;oy+=ay/l*24}
  const d=twFolkObj(id,t,t.x+ax+ox,t.y+ay+oy);if(!d)continue;if(d.path)d.path=d.path.map(p=>({x:p.x+ox,y:p.y+oy})).filter(p=>!hit(p.x,p.y));if(d.path&&d.path.length<2)d.path=null;add(d)}}
// 지역 던전의 바닥·벽 재질 (ground.js DGMAT 와 같은 모양): 데이터의 floor · wall · 지역 성격으로 만든다 (구워 두는 벽 그림이 던전마다 달라진다)
function wxDgMat(d){const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),m=(c,k)=>c.map(v=>Math.min(255,Math.round(v*k))),f=d.floor,w0=hx(d.wall[0]),w1=hx(d.wall[1]),w2=hx(d.wall[2]);
  const r=d.reg,mossy={forest:[70,100,44],jungle:[60,110,50],moor:[86,96,60],highland:[90,98,80],sea:[50,104,96],cliffs:[70,96,90]}[r]||null;
  return{earth:m(f,.85),slab:m(f,1.45),mortar:m(w1,.55),moss:mossy,mossA:mossy?.4:0,bone:/moor|desert|abyss|sea/.test(r)?.16:.06,puddle:/sea|cliffs|ice|jungle/.test(r)?.3:.04,pcol:m(w1,.8),
    brick:w0,top:m(w2,.82),topDust:m(w2,1.25),soot:m(w1,.3).join(','),lay:d.at==='deep'?'big':'brick',miss:.06,wet:/sea|cliffs/.test(r)?1:0,iron:/canyon|highland|plains/.test(r)?1:0,ember:/lava|abyss/.test(r)?1:0}}
// 깊은 던전 상급 유니크 14개의 그림 설계 (itemicons.js IUNQ 와 같은 모양)
Object.assign(IUNQ,{
  '카르벤의 피뢰침':{mat:'metal',sh:'#5a6488',head:'fork',gem:'#fff6b0',glow:IEL.storm},
  '엘라무르의 달빛 수액':{cord:'#8aa0c8',pend:'drop',metal:'#c8d8f0',gem:'#e0f0ff',glow:IEL.ice},
  '크리샤의 독침 고리':{band:'#7a2a1a',set:'eye',gem:'#9aff3a',glow:IEL.earth,spikes:1},
  '하랄드의 서리 왕관 조각':{cord:'#9ab0c8',pend:'crown',metal:'#c8e0f8',gem:'#8ae8ff',glow:IEL.ice},
  '우무의 그림자 가죽':{body:'#2a2a24',trim:'#8a5ac0',pat:'scales',belt:'#14140e',glow:IEL.shadow},
  '사라쿠스의 심장불':{mat:'bone',sh:'#6a2a14',head:'ember',gem:'#ffb03a',glow:IEL.fire},
  '오세로스의 조수 홀':{mat:'gold',sh:'#2a7ab0',head:'scepter',gem:'#9affff',glow:'#9affff'},
  '카일라의 돌원 반지':{band:'#6a7a5a',set:'round',gem:'#9aff8a',glow:IEL.earth},
  '셀레스의 깃털 망토':{body:'#d8c8a8',trim:'#f0f4ff',pat:'cloak',belt:'#6a5a3a',glow:IEL.storm,hood:1},
  '오르데의 설계 반지':{band:'#b0946a',set:'clock',gem:'#7affff',glow:'#7affff'},
  '아스트락의 천둥 비늘':{body:'#3a5a8a',trim:'#ffe066',pat:'scales',belt:'#1a2a4a',glow:IEL.storm},
  '아자르의 텅 빈 왕관':{cord:'#2a1a3a',pend:'crown',metal:'#4a3a5a',gem:'#c88aff',glow:IEL.shadow},
  '닫힌 문의 열쇠':{band:'#3a2a4a',set:'star',gem:'#e0b0ff',glow:IEL.arcane},
  '엘가로스의 공허 지팡이':{mat:'metal',sh:'#2a1a3a',head:'crystal',gem:'#d8a0ff',glow:IEL.shadow},
});
/* ---------- v18 마을 사람 자리 다듬기: 사람끼리 · 건물 · 소품 · 문과 겹치지 않게 (town.js 가 마을을 다 지은 뒤 한 번 부른다) ---------- */
// 사람 사이 48 이상, 건물 발자국 · 문 · 소품에서 40 이상. 자리가 겹치면 가장 가까운 빈자리로 옮긴다 (나선형으로 찾기)
const WXT={npc:48,bld:40,door:40,prop:40,small:24,shopOwn:18,center:70,stall:48};
const WXT_SMALL=new Set(['flowers','fern','mushroom','bones','shell','coral','wheat','herb','grass','pebble']);
const wxRD=(x,y,f)=>{const dx=Math.max(f[0]-x,0,x-f[2]),dy=Math.max(f[1]-y,0,y-f[3]);return (dx||dy)?Math.hypot(dx,dy):-Math.min(x-f[0],f[2]-x,y-f[1],f[3]-y)};
const wxLqAt=(lq,x,y)=>{if(!lq)return 0;const fx=clamp(x/LQS,0,LQN-1.001),fy=clamp(y/LQS,0,LQN-1.001),i=fx|0,j=fy|0,u=fx-i,v=fy-j,k=j*LQN+i;return lq[k]*(1-u)*(1-v)+lq[k+1]*u*(1-v)+lq[k+LQN]*(1-u)*v+lq[k+LQN+1]*u*v};
function wxTownParts(L,t){const RR=720,near=d=>Math.abs(d.x-t.x)<RR&&Math.abs(d.y-t.y)<RR;
  const folk=L.decor.filter(d=>d.k==='tfolk'&&d.town===t&&!d.room),npcD=L.decor.find(d=>d.k==='npc'&&d.town===t)||null;
  const bl=(TW.blds[L.id]||[]).filter(near),rects=[];for(const b of bl)for(const f of b.foot||[])rects.push(f);
  const doors=bl.filter(b=>b.k==='bld'&&b.door).map(b=>b.door);
  const props=L.decor.filter(d=>near(d)&&d.k!=='tfolk'&&d.k!=='npc'&&d.k!=='bld'&&!d.foot&&!(d.town&&d.town!==t));
  return{id:L.id,folk,npcD,rects,doors,props,lq:L.id==='home'?null:L.lq}}
const wxPropR=(d,f)=>d.k==='shop'?(f&&f.shopk&&f.shopk===d.shopType?WXT.shopOwn:WXT.stall):d.k==='gate'||d.k==='stash'?WXT.stall:d.k==='fountain'||d.k==='statue'?WXT.center:WXT_SMALL.has(d.k)?WXT.small:WXT.prop;
const wxWet=(P,x,y)=>P.lq?wxLqAt(P.lq,x,y)>.3:twWet(P.id,x,y);// 고향 강은 걷기 판정(twWet)과 같게
// 한 자리의 문제 목록 (빈 배열이면 괜찮은 자리). others = 이미 자리를 잡은 사람들 [{x,y}]
function wxSpotBad(P,x,y,f,others,lim,tol){tol=tol||0;const bad=[];
  for(const r of P.rects){const d=wxRD(x,y,r);if(d<lim.bld)bad.push(['bld',d])}
  for(const o of P.doors){const d=Math.hypot(o.x-x,o.y-y);if(d<lim.door)bad.push(['door',d])}
  for(const p of P.props){const d=Math.hypot(p.x-x,p.y-y),need=lim.prop?wxPropR(p,f):0;if(need&&d<need-tol)bad.push(['prop:'+p.k,d])}
  for(const o of others){const d=Math.hypot(o.x-x,o.y-y);if(d<lim.npc)bad.push(['npc:'+(o.id||'npc'),d])}
  if(wxWet(P,x,y))bad.push(['water',0]);return bad}
// 빠른 판정 (첫 문제에서 멈춘다): 자리 찾기용
function wxSpotOk(P,x,y,f,others,lim){for(const r of P.rects)if(wxRD(x,y,r)<lim.bld)return false;
  if(lim.door)for(const o of P.doors)if(Math.hypot(o.x-x,o.y-y)<lim.door)return false;
  if(lim.prop)for(const p of P.props)if(Math.hypot(p.x-x,p.y-y)<wxPropR(p,f))return false;
  if(lim.npc)for(const o of others)if(Math.hypot(o.x-x,o.y-y)<lim.npc)return false;
  return !wxWet(P,x,y)}
function wxTownRelax(L,t){const k=WXT.k[t.id]||1;if(k!==1)for(const f of L.decor)if(f.k==='tfolk'&&f.town===t&&f.path)f.path=f.path.map(p=>({x:t.x+(p.x-t.x)*k,y:t.y+(p.y-t.y)*k}));
  const P=wxTownParts(L,t),lim={bld:WXT.bld,door:WXT.door,prop:1,npc:WXT.npc};
  const ok=P.lq?(L.okT||(L.okT=wxReach(P.lq,t.x,t.y))):null,placed=[],moved=[];
  const R0=Math.max(300,...P.folk.map(f=>Math.hypot(f.hx-t.x,f.hy-t.y)+40));
  const find=(x0,y0,f,lm,maxR)=>{const m=maxR+90,Q={...P,props:P.props.filter(p=>Math.abs(p.x-x0)<m&&Math.abs(p.y-y0)<m),rects:P.rects.filter(r=>r[0]-m<x0&&r[2]+m>x0&&r[1]-m<y0&&r[3]+m>y0),doors:P.doors.filter(p=>Math.abs(p.x-x0)<m&&Math.abs(p.y-y0)<m)};
    const good=(x,y)=>Math.hypot(x-t.x,y-t.y)<=R0&&(!ok||wxCanReach(ok,x,y))&&wxSpotOk(Q,x,y,f,placed,lm);
    if(good(x0,y0))return{x:x0,y:y0};for(let r=8;r<=maxR;r+=8){const n=Math.max(8,Math.round(r*6.283/14)),a0=hash(x0|0,y0|0)*6.283;
      for(let i=0;i<n;i++){const a=a0+i/n*6.283,x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r;if(good(x,y))return{x,y}}}return null};
  // 의뢰인(t.npc) → 상인 → 서 있는 사람 → 걷는 사람 순서로 자리를 잡는다
  const list=[...(P.npcD?[P.npcD]:[]),...P.folk.filter(f=>f.shopk),...P.folk.filter(f=>!f.shopk&&!f.path),...P.folk.filter(f=>!f.shopk&&f.path)];
  for(const f of list){const isN=f.k==='npc',x0=isN?f.x:f.hx,y0=isN?f.y:f.hy,s=find(x0,y0,f,lim,320)||{x:x0,y:y0},dx=s.x-x0,dy=s.y-y0;
    if(dx||dy){moved.push([f.id||'npc',Math.round(Math.hypot(dx,dy))]);if(isN){f.x=s.x;f.y=s.y;t.npc={x:s.x,y:s.y}}else{f.x=f.hx=s.x;f.y=f.hy=s.y}}
    placed.push({x:s.x,y:s.y,id:f.id});
    // 걷는 길: 같이 옮기고, 건물 · 물 · 마을 밖으로 나가는 점은 가까운 빈자리로 (못 찾으면 뺀다)
    if(f.path){const lp={bld:24,door:0,prop:0,npc:0},pts=[];for(const p of f.path){const q=find(p.x+dx,p.y+dy,f,lp,80);if(q)pts.push(q)}
      const cross=(a,b)=>{const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/8);for(let i=1;i<n;i++){const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;if(P.rects.some(r=>wxRD(x,y,r)<12)||wxWet(P,x,y))return true}return false};
      const out=[];for(const q of pts){const prev=out.length?out[out.length-1]:{x:f.x,y:f.y};if(!cross(prev,q))out.push(q)}
      while(out.length>1&&cross(out[out.length-1],out[0]))out.pop();
      f.path=out.length>=2?out:null;f.wi=0}}
  (WXT.moved||(WXT.moved={}))[t.id]=moved;return moved}
// 검사용: 마을 하나의 겹침 · 건물 안 · 닿을 수 있는지
function wxTownAudit(L,t){const P=wxTownParts(L,t),A=[...(P.npcD?[{x:P.npcD.x,y:P.npcD.y,id:'npc',f:P.npcD}]:[]),...P.folk.map(f=>({x:f.hx,y:f.hy,id:f.id,f}))],bad=[];
  for(let i=0;i<A.length;i++){const a=A[i];for(let j=i+1;j<A.length;j++){const b=A[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<WXT.npc-.5)bad.push([a.id,b.id,'npc',Math.round(d)])}
    for(const [k,d] of wxSpotBad(P,a.x,a.y,a.f,[],{bld:WXT.bld-.5,door:WXT.door-.5,prop:1,npc:0},.5))bad.push([a.id,k,'',Math.round(d)]);
    if(a.f.path)for(const p of a.f.path)if(P.rects.some(r=>wxRD(p.x,p.y,r)<0))bad.push([a.id,'path-in-bld','',0])}
  // 닿기: 12px 격자, 건물 발자국(+12) · 물을 막고 문에서 BFS
  const S=12,N=Math.ceil(1440/S),x0=t.x-720,y0=t.y-720,blk=new Uint8Array(N*N),seen=new Uint8Array(N*N);
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=x0+i*S,y=y0+j*S;if(P.rects.some(r=>wxRD(x,y,r)<12)||wxWet(P,x,y))blk[j*N+i]=1}
  const gi=Math.round((t.gate.x-x0)/S),gj=Math.round((t.gate.y-y0)/S),q=[gj*N+gi];seen[q[0]]=1;
  for(let h=0;h<q.length;h++){const k=q[h],i=k%N,j=(k/N)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=i+a,Y=j+b;if(X<0||Y<0||X>=N||Y>=N)continue;const n=Y*N+X;if(seen[n]||blk[n])continue;seen[n]=1;q.push(n)}}
  const reach=(x,y)=>{for(let j=Math.floor((y-y0-52)/S);j<=Math.ceil((y-y0+52)/S);j++)for(let i=Math.floor((x-x0-52)/S);i<=Math.ceil((x-x0+52)/S);i++){if(i<0||j<0||i>=N||j>=N)continue;if(seen[j*N+i]&&Math.hypot(x0+i*S-x,y0+j*S-y)<52)return true}return false};
  for(const a of A)if(!reach(a.x,a.y))bad.push([a.id,'unreachable','',0]);
  return{n:A.length,bad,anchors:A.map(a=>[a.id,Math.round(a.x-t.x),Math.round(a.y-t.y)])}}
const wxTowns=()=>{const o=HOME.towns.map(t=>[HOME,t]);for(const id of REG_IDS){const L=RCACHE[id];if(L&&L.town)o.push([L,L.town])}return o};
// 붐비는 고향 마을은 배치를 조금 넓힌다 (바깥 사람 8명 넘으면 한 명당 2.5%, 최대 1.2배). 성벽 · 망루는 그대로 두어 이음새가 벌어지지 않게
WXT.k={};
function wxLayScale(t,lay){const n=lay.folk.filter(f=>!f[3]).length+(lay.npc?1:0),k=Math.round(Math.min(1.2,Math.max(1,1+(n-8)*.025))*1000)/1000;WXT.k[t.id]=k;if(k===1)return lay;
  const m=a=>a&&[Math.round(a[0]*k),Math.round(a[1]*k)],FIX=new Set(['cwall','gatetower']);
  return{...lay,gate:m(lay.gate),stash:m(lay.stash),npc:m(lay.npc),
    shops:lay.shops.map(([ty,dx,dy,n])=>[ty,Math.round(dx*k),Math.round(dy*k),n]),
    blds:lay.blds.map(o=>o.keep!=null?o:{...o,dx:Math.round(o.dx*k),dy:Math.round(o.dy*k),seed:o.seed||((o.dx*7+o.dy*13)&1023)}),
    props:lay.props.map(p=>FIX.has(p[0])?p:[p[0],Math.round(p[1]*k),Math.round(p[2]*k),...p.slice(3)]),
    folk:lay.folk.map(f=>f[3]?f:[f[0],Math.round(f[1]*k),Math.round(f[2]*k)]),
    river:lay.river&&{x0:lay.river.x0*k,x1:lay.river.x1*k,y0:lay.river.y0*k,y1:lay.river.y1*k},docks:lay.docks&&lay.docks.map(q=>q.map(v=>Math.round(v*k)))}}
const wxTk=t=>(WXT.k[t.id]||1)*(WXT.k22&&WXT.k22[t.id]||1);// v22 TOWN: v18 배율 × v22 배율 (town22.js)
// v18 메인(1막·2막) 의뢰와 마을 의뢰를 색으로 가른다: 메인은 주황(머리 위 ! ? · 미니맵/지도 고리 · 「메인」 표), 마을 의뢰는 예전 그대로 노랑 ! · 하늘 ? · 하늘 고리
const WX_QCOL={main:'#ff8a1e',bang:'#ffd34d',ask:'#9fe0ff',ring:'#7fd8ff'};
const wxMarkCol=l=>l.main?WX_QCOL.main:l.mk==='!'?WX_QCOL.bang:WX_QCOL.ask;
// 메인 의뢰 표시 밑에 둥근 방패(어두운 바탕 + 주황 테두리): 노란 ! 와 한눈에 갈리게. 원 하나라 매 프레임 그려도 가볍다
function wxMarkBadge(l,y){if(!l.main)return;ctx.fillStyle='rgba(48,20,4,.82)';ctx.beginPath();ctx.arc(l.x,y-9,15,0,6.283);ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=WX_QCOL.main;ctx.stroke()}
