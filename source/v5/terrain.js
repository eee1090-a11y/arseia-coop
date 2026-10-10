/* ---------- 지형 1단계: 맵 테두리 산맥 · 절벽 · 바위 언덕 · 숲 덩어리 ---------- */
// 땅을 100×100 칸으로 나눠 "절벽 칸"을 정한다. 절벽 칸은 지나갈 수 없고(물처럼 막힘), 칸마다 높이가 있는 바위 덩어리로 그린다.
// 마법·화살은 절벽을 넘어간다(맞는 규칙은 그대로). 저장 형식은 건드리지 않는다.
// 지역마다 씨앗이 같으면 늘 같은 땅이 나온다(같이 하기에서 모두 같은 지형).
// 다른 파일보다 먼저 불릴 수 있는 값은 var로 둔다(그 전에는 지형 없음으로 동작).
// v18: 지킬 자리(마을·길·포탈·동굴·둥지·채집 자리·의뢰인)는 이 파일이 읽힐 때 한 번 적어 두고(TKEEP), 절벽 격자는 그 목록만으로 만든다
//  → 언제 어느 순서로 지역에 들어가도, 방장과 손님 누구에게나 같은 절벽이 나온다. 물+절벽으로 막힌 자리는 물만 있을 때의 길을 따라 뚫는다.
var TREADY=false,TGRID=null,TCS=100,TNC=60,TK=10,TN=80;
function terrIdx(i,j){return (j+TK)*TN+(i+TK)}
function terrWallIJ(i,j){if(!TGRID)return false;if(i<-TK||j<-TK||i>=TNC+TK||j>=TNC+TK)return true;return TGRID.w[terrIdx(i,j)]===1}
function terrWall(x,y){return TGRID!==null&&terrWallIJ(Math.floor(x/TCS),Math.floor(y/TCS))}
// 칸에 들어가 버린 사람을 가장 가까운 빈 칸으로 옮긴다 (예전 저장 위치, 순간이동, 밀려남)
function terrFix(o){if(!TGRID||DG||!terrWall(o.x,o.y))return false;const i0=Math.floor(o.x/TCS),j0=Math.floor(o.y/TCS);
  for(let r=1;r<20;r++){let best=null,bd=1e9;for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){if(Math.max(Math.abs(i-i0),Math.abs(j-j0))!==r)continue;if(i<0||j<0||i>=TNC||j>=TNC||terrWallIJ(i,j))continue;
      const cx=(i+.5)*TCS,cy=(j+.5)*TCS;if(LQ&&liqAt(cx,cy)>.5)continue;const d=Math.hypot(cx-o.x,cy-o.y);if(d<bd){bd=d;best={x:cx,y:cy}}}
    if(best){o.x=best.x;o.y=best.y;return true}}return false}
// 테마: 바위 색 · 윗면 색 · 윗면 풀 술 · 윗면에 올릴 나무
const TTHEME={
  royal:{rock:[150,140,120],dark:[88,80,66],top:[86,116,58],fringe:[62,96,44],tree:['oak','windtree'],grass:1},
  moss:{rock:[126,114,96],dark:[70,62,54],top:[86,104,58],fringe:[58,84,40],tree:['htree','hpine'],grass:1},
  ash:{rock:[98,90,86],dark:[54,50,50],top:[78,72,64],fringe:null,tree:['hdead','stump']},
  meadow:{rock:[156,132,96],dark:[92,76,56],top:[132,126,64],fringe:[104,104,44],tree:['oak','windtree'],grass:1},
  lush:{rock:[100,104,84],dark:[52,56,44],top:[54,84,42],fringe:[36,66,30],tree:['oak','hpine'],grass:1},
  sand:{rock:[184,118,76],dark:[112,64,44],top:[196,146,96],fringe:null,tree:['cactus','sandrock']},
  snow:{rock:[124,132,146],dark:[70,78,94],top:[226,232,242],fringe:[236,240,248],tree:['snowpine','snowpine']},
  lava:{rock:[60,50,48],dark:[30,24,24],top:[70,58,52],fringe:null,tree:['obsidian','lavarock'],ember:1},
  beach:{rock:[172,154,120],dark:[106,92,70],top:[124,144,82],fringe:[96,124,60],tree:['palm','searock'],grass:1},
};
const TSCEN=new Set(['htree','hbirch','hpine','hdead','hbush','tree','rock','bush','stump','ruin','tomb','wheat','haystack','flowers','windtree','oak','mushroom','fern','mossrock','cactus','bones','sandrock','ruinpillar','palm','snowpine','icespike','iceboulder','frozenbones','jungletree','bigleaf','templestone','lavarock','obsidian','ashtree','vent','coral','shell','searock','wreck']);
const TTREE=new Set(['htree','hbirch','hpine','hdead','hbush','tree','oak','windtree','snowpine','jungletree','bigleaf','ashtree','palm','bush','fern','mushroom']);
const TERR={};
function terrTheme(id,x,y){if(id==='home')return levelAt(x,y)>=12?'ash':'moss';const p=(REGIONS[id]&&REGIONS[id].th&&REGIONS[id].th.paint)||'moss';return TTHEME[p]?p:'moss'}
// 지킬 자리: 마을 · 길 · 포탈 · 동굴 · 우두머리 둥지 · 채집 자리 · 장식이 아닌 물건 (마을 건물 · 의뢰인 · 마을 사람 걷는 길)
const terrProt=d=>d.town||d.use||d.tprop||d.qonly||d.k==='npc'||d.k==='tfolk';
function terrKeeps(id,L){const K=[];const add=(x,y,r)=>K.push({x,y,r});
  for(const t of L.towns||[])add(t.x,t.y,tSafe(t)+170);
  for(const r of L.roads||[])for(let i=0;i<r.length;i++)add(r[i].x,r[i].y,140);
  for(const e of L.edges||[]){add(e.x,e.y,320);const iv=INW[e.side];for(let d=100;d<=1000;d+=100)add(e.x+iv[0]*d,e.y+iv[1]*d,230)}
  for(const c of L.caves||[]){add(c.x,c.y,260);add(c.x,c.y+80,160)}
  if(L.lair)add(L.lair.x,L.lair.y,560);
  for(const sid in L.spots||{})for(const p of L.spots[sid])add(p.x,p.y,150);
  for(const d of L.decor||[]){if(d.tcell)continue;if(terrProt(d))add(d.x,d.y,150);else if(!TSCEN.has(d.k))add(d.x,d.y,170);if(d.path)for(const p of d.path)add(p.x,p.y,90)}
  return K}
// 걸어서 닿아야 하는 자리 (마을 중심에서 출발): 마을 · 짝문 · 창고 · 상점 · 포탈 · 동굴 앞 · 둥지 · 채집 자리 · 의뢰인
function terrTargets(L){const o=[];const add=p=>{if(p&&isFinite(p.x)&&isFinite(p.y))o.push({x:p.x,y:p.y})};
  for(const t of L.towns||[]){add(t);add(t.gate);add(t.stash);add(t.shop);add(t.npc)}
  for(const e of L.edges||[]){const iv=INW[e.side];add({x:e.x+iv[0]*170,y:e.y+iv[1]*170})}
  for(const c of L.caves||[]){add({x:c.x,y:c.y+40});add({x:c.x,y:c.y+80})}
  if(L.lair)add(L.lair);
  for(const sid in L.spots||{})for(const p of L.spots[sid])add(p);
  for(const d of L.decor||[])if(!d.tcell&&(d.use||d.k==='npc'))add(d);
  return o}
// 이 파일이 읽힐 때(저장을 불러오기 전) 모든 지역의 지킬 자리를 적어 둔다
const TKEEP={};
function terrLayer(id){return id==='home'?HOME:RCACHE[id]}
function terrSnap(id){const L=terrLayer(id);if(!L)return null;let k=TKEEP[id];if(!k||k.L!==L)k=TKEEP[id]={L,keeps:terrKeeps(id,L),tg:terrTargets(L)};return k}
// 물(LQ)과 절벽을 함께 막힘으로 본 걷기 도달 격자 (LQS 간격 점). w가 없으면 물만 본다
function terrReachLQ(L,w,x,y,par){const N=LQN,lq=L.lq&&L.id!=='home'?L.lq:null,ok=new Uint8Array(N*N);
  const free=n=>{if(lq&&lq[n]>.5)return false;if(!w)return true;const i=n%N,j=(n/N)|0,ci=Math.floor(i*LQS/TCS),cj=Math.floor(j*LQS/TCS);return !(ci<-TK||cj<-TK||ci>=TNC+TK||cj>=TNC+TK)&&!w[terrIdx(ci,cj)]};
  const i0=clamp(Math.round(x/LQS),0,N-1),j0=clamp(Math.round(y/LQS),0,N-1),s0=j0*N+i0,q=[s0];ok[s0]=1;if(par)par[s0]=-1;
  for(let h=0;h<q.length;h++){const k=q[h],i=k%N,j=(k/N)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=i+a,Y=j+b;if(X<0||Y<0||X>=N||Y>=N)continue;const n=Y*N+X;if(ok[n]||!free(n))continue;ok[n]=1;if(par)par[n]=k;q.push(n)}}return ok}
const terrLQi=(x,y)=>clamp(Math.round(y/LQS),0,LQN-1)*LQN+clamp(Math.round(x/LQS),0,LQN-1);
// QA · 손쉬운 검사용: 지역 L에서 마을부터 걸어서 닿는 격자 (물 + 절벽)
function terrReach(id){const L=terrLayer(id),T=terrEnsure(id),t0=(L.towns&&L.towns[0])||{x:3000,y:3000};return terrReachLQ(L,T&&T.w,t0.x,t0.y)}
// 절벽 격자만 만든다: 씨앗 + 처음 적어 둔 지킬 자리만 쓰므로 같은 지역이면 늘 같다 (같이 하기 · QA 결정성 점검)
function terrGrid(id){const S=terrSnap(id);if(!S)return null;const L=S.L,keeps=S.keeps;
  const sd=id==='home'?5:((REGIONS[id].seed|0)*13+7),N=TNC,w=new Uint8Array(TN*TN);
  const kept=(x,y)=>{for(const k of keeps){const dx=x-k.x,dy=y-k.y;if(dx*dx+dy*dy<k.r*k.r)return true}return false};
  // 1) 절벽 칸 고르기
  for(let j=-TK;j<N+TK;j++)for(let i=-TK;i<N+TK;i++){const x=(i+.5)*TCS,y=(j+.5)*TCS,k=terrIdx(i,j);
    if(i<0||j<0||i>=N||j>=N){w[k]=1;continue}
    const e=Math.min(x,y,WORLD-x,WORLD-y),band=220+fbm(x/700,y/700,sd)*380,RD0=REGIONS[id];
    let wall=e<band;
    // v26 왕도: 작은 지도. 포탈(한가운데에서 1750) 바깥은 모두 언덕으로 막는다. 안쪽 바위 언덕은 두지 않는다
    if(RD0&&RD0.side){const dx=Math.abs(x-3000),dy=Math.abs(y-3000);wall=Math.max(dx,dy)*.6+Math.hypot(dx,dy)*.4>1840+(fbm(x/500,y/500,sd)-.5)*220}
    else if(!wall){const rn=fbm(x/1150,y/1150,sd+5),gate=fbm(x/1700,y/1700,sd+9);if(Math.abs(rn-.5)<.026&&gate>.52)wall=true}
    if(!wall&&fbm(x/360,y/360,sd+13)>.83)wall=true;
    if(wall&&kept(x,y))wall=false;
    w[k]=wall?1:0}
  // 2) 이어짐: 첫 마을에서 걸어서 닿지 않는 빈 땅은 길을 뚫거나(넓을 때) 메운다(좁을 때). 물은 지나갈 수 있다고 보고 센다(물 때문에 끊긴 곳은 예전과 같다)
  const T0=(L.towns&&L.towns[0])||{x:3000,y:3000};
  for(let pass=0;pass<12;pass++){
    const seen=new Int32Array(N*N).fill(-1),comps=[];
    for(let s0=0;s0<N*N;s0++){if(seen[s0]>=0||w[terrIdx(s0%N,(s0/N)|0)])continue;const q=[s0],cells=[];seen[s0]=comps.length;let hasKeep=false;
      while(q.length){const c=q.pop(),ci=c%N,cj=(c/N)|0;cells.push(c);if(!hasKeep&&kept((ci+.5)*TCS,(cj+.5)*TCS))hasKeep=true;
        for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){const ni=ci+di,nj=cj+dj;if(ni<0||nj<0||ni>=N||nj>=N)continue;const n=nj*N+ni;if(seen[n]>=0||w[terrIdx(ni,nj)])continue;seen[n]=comps.length;q.push(n)}}
      comps.push({cells,hasKeep})}
    const mi=clamp(Math.floor(T0.x/TCS),0,N-1),mj=clamp(Math.floor(T0.y/TCS),0,N-1),main=seen[mj*N+mi];
    if(comps.length<=1||main<0)break;let changed=false;
    const mainSet=comps[main].cells;
    comps.forEach((cp,ci)=>{if(ci===main)return;
      if(cp.cells.length<14&&!cp.hasKeep){for(const c of cp.cells)w[terrIdx(c%N,(c/N)|0)]=1;changed=true;return}
      // 가장 가까운 큰 땅 칸까지 두 칸 폭으로 뚫는다
      let best=null,bd=1e9;const a=cp.cells[(cp.cells.length/2)|0],ai=a%N,aj=(a/N)|0;
      for(let t=0;t<mainSet.length;t+=3){const b=mainSet[t],bi=b%N,bj=(b/N)|0,d=(bi-ai)*(bi-ai)+(bj-aj)*(bj-aj);if(d<bd){bd=d;best=[bi,bj]}}
      if(!best)return;const steps=Math.max(Math.abs(best[0]-ai),Math.abs(best[1]-aj));
      for(let s=0;s<=steps;s++){const ii=Math.round(ai+(best[0]-ai)*s/steps),jj=Math.round(aj+(best[1]-aj)*s/steps);for(const [di,dj] of [[0,0],[1,0],[0,1]]){const ni=ii+di,nj=jj+dj;if(ni>=0&&nj>=0&&ni<N&&nj<N)w[terrIdx(ni,nj)]=0}}
      changed=true});
    if(!changed)break}
  // 2b) 물과 절벽을 함께 보면 못 닿는 자리: 물만 있을 때의 걷는 길을 따라 절벽 칸을 비운다 (원래 물로 막힌 곳은 그대로)
  {const t0=(L.towns&&L.towns[0])||{x:3000,y:3000},par=new Int32Array(LQN*LQN).fill(-2),ok0=terrReachLQ(L,null,t0.x,t0.y,par);let ok=terrReachLQ(L,w,t0.x,t0.y),cut=0;
    for(const p of S.tg){let n=terrLQi(p.x,p.y);if(ok[n]||!ok0[n])continue;
      for(let g=0;n>=0&&g<LQN*LQN;g++){const ci=Math.floor((n%LQN)*LQS/TCS),cj=Math.floor(((n/LQN)|0)*LQS/TCS);if(ci>=0&&cj>=0&&ci<N&&cj<N&&w[terrIdx(ci,cj)]){w[terrIdx(ci,cj)]=0;cut++}n=par[n]}
      ok=terrReachLQ(L,w,t0.x,t0.y)}
    w.cut=cut}
  return w}
function terrBuild(id){const S=terrSnap(id);if(!S)return null;const L=S.L,keeps=S.keeps;
  const sd=id==='home'?5:((REGIONS[id].seed|0)*13+7),N=TNC,w=terrGrid(id),h=new Float32Array(TN*TN);
  // 3) 높이: 빈 땅에서 멀수록 높다 (가장자리는 산맥, 안쪽 바위 언덕은 낮다)
  const dO=new Int16Array(TN*TN).fill(99),q=[];
  for(let j=-TK;j<N+TK;j++)for(let i=-TK;i<N+TK;i++){const k=terrIdx(i,j);if(!w[k]){dO[k]=0;q.push(k)}}
  for(let qi=0;qi<q.length;qi++){const k=q[qi],i=k%TN-TK,j=((k/TN)|0)-TK;for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const ni=i+di,nj=j+dj;if(ni<-TK||nj<-TK||ni>=N+TK||nj>=N+TK)continue;const n=terrIdx(ni,nj);if(dO[n]>dO[k]+1){dO[n]=dO[k]+1;q.push(n)}}}
  const cells=[],tops=[],pr=mulberry(sd*7919+3);
  for(let j=-TK;j<N+TK;j++)for(let i=-TK;i<N+TK;i++){const k=terrIdx(i,j);if(!w[k])continue;const x=(i+.5)*TCS,y=(j+.5)*TCS,d=Math.min(dO[k],8);
    const hh=40+d*40+fbm(x/260,y/260,sd+21)*50+(d>=3?fbm(x/520,y/520,sd+33)*90:0);let fr=false;for(let b=0;b<=5&&!fr;b++)for(let a2=0;a2<=5-b&&!fr;a2++){if(a2+b===0)continue;const ii=i-a2,jj=j-b;if(ii>=0&&jj>=0&&ii<N&&jj<N&&!w[terrIdx(ii,jj)])fr=true}
    h[k]=Math.round((fr?Math.min(hh,36+Math.min(d,4)*14):hh)/20)*20;
    const th=terrTheme(id,clamp(x,0,WORLD),clamp(y,0,WORLD));
    const c={x,y,i,j,k:'cliff',cliff:1,h:h[k],th,v:(hash(i+sd,j)*3)|0,s:1,tcell:1,d:dO[k],dk:Math.min(4,d)};cells.push(c);
    // 산 윗면 나무: 빈 땅 가까운 칸에만 (멀리 있는 칸은 산꼭대기)
    const T0t=TTHEME[th];if(d<=2&&pr()<(T0t.grass?[0,.55,.6,.5,.35][d]:[0,.3,.2,.12,.08][d])){const T=TTHEME[th];const kind=T.tree[pr()<.7?0:1];tops.push({x:x+(pr()-.5)*40,y:y+(pr()-.5)*40,k:kind,s:(kind[0]==='h'?.55:.7)+pr()*.3,v:pr(),zl:0,zh:h[k],zk:x+y+1,tcell:1,cell:c})}}
  // 3b) [v20 절벽 2.0] 높이를 이웃과 섞어 계단을 줄이고(빈 땅 쪽은 낮게), 낮은 쪽을 향한 변을 표시한다(그림 전용)
  {const h2=new Float32Array(h);for(const c of cells){let sum=h[terrIdx(c.i,c.j)]*2,n=2;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const ni=c.i+a,nj=c.j+b;if(ni<-TK||nj<-TK||ni>=N+TK||nj>=N+TK)continue;const k=terrIdx(ni,nj);sum+=w[k]?h[k]:24;n++}
      const k0=terrIdx(c.i,c.j);h2[k0]=Math.max(30,Math.min(h[k0]+20,Math.round(sum/n/20)*20))}
    for(const c of cells){const k=terrIdx(c.i,c.j);h[k]=h2[k];c.h=h2[k]}
    for(const t of tops)t.zh=t.cell.h;
    for(const c of cells){let m=0;for(const [a,b,bit] of [[0,1,1],[1,0,2],[-1,0,4],[0,-1,8]]){const ni=c.i+a,nj=c.j+b;if(ni<-TK||nj<-TK||ni>=N+TK||nj>=N+TK)continue;const k=terrIdx(ni,nj),inW=ni>=0&&nj>=0&&ni<N&&nj<N;if(bit>2?(!w[k]&&inW):(!w[k]||h[k]<=c.h-40))m|=bit}c.m=m}}
  // 4) 장식 다시 놓기: 나무는 숲 덩어리로 모으고, 절벽 칸에 걸린 장식은 빈 땅으로 옮긴다
  const dec=L.decor,ds=mulberry(sd*104729+11),openAt=(x,y)=>{const i=Math.floor(x/TCS),j=Math.floor(y/TCS);return i>=0&&j>=0&&i<N&&j<N&&!w[terrIdx(i,j)]};
  const nearCliff=(x,y)=>{const i=Math.floor(x/TCS),j=Math.floor(y/TCS);return i>=0&&j>=0&&i<N&&j<N&&dO[terrIdx(i,j)]===0&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>terrIdx(i+a,j+b)>=0&&w[terrIdx(i+a,j+b)])};
  const roadD=(x,y)=>{let m=1e9;for(const r of L.roads||[])for(let i=1;i<r.length;i+=1){const dd=segDist(x,y,r[i-1].x,r[i-1].y,r[i].x,r[i].y);if(dd<m)m=dd}return m};
  // 장식을 놓으면 안 되는 자리 (50 간격 점): 지킬 자리마다 반지름의 0.6 (마을 · 포탈 · 마을 사람 · 의뢰인 · 채집 자리 둘레)
  const NM=WORLD/50+1,nomask=new Uint8Array(NM*NM);for(const k of keeps){const rr=k.r*.6,i0=Math.max(0,Math.floor((k.x-rr)/50)),i1=Math.min(NM-1,Math.ceil((k.x+rr)/50)),j0=Math.max(0,Math.floor((k.y-rr)/50)),j1=Math.min(NM-1,Math.ceil((k.y+rr)/50));
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const dx=i*50-k.x,dy=j*50-k.y;if(dx*dx+dy*dy<(rr+35)*(rr+35))nomask[j*NM+i]=1}}
  const clearOf=(x,y)=>{if(REGIONS[id]&&REGIONS[id].clear&&REGIONS[id].clear(x,y))return false;for(const t of L.towns||[])if(Math.hypot(x-t.x,y-t.y)<TOWN_R+90)return false;if(nomask[clamp(Math.round(y/50),0,NM-1)*NM+clamp(Math.round(x/50),0,NM-1)])return false;return roadD(x,y)>52};
  const lq=L.lq||null,wet=k=>k==='coral'||k==='wreck'||k==='searock'||k==='shell',liq=(x,y)=>{if(!lq)return 0;const i=clamp(Math.round(x/LQS),0,LQN-1),j=clamp(Math.round(y/LQS),0,LQN-1);return lq[j*LQN+i]};
  // 예전 동그란 나무 → 가지와 잎 뭉치가 보이는 나무 (활엽수 · 자작나무 · 침엽수 · 마른 나무)
  for(const d of dec){if(terrProt(d))continue;if(d.k==='tree'){const zl=id==='home'?levelAt(d.x,d.y):0;d.k=zl>=14&&d.v<.6?'hdead':fbm(d.x/900,d.y/900,sd+57)>.56?'hpine':d.v<.22?'hbirch':'htree';d.s*=.62}else if(d.k==='bush'){d.k='hbush';d.s*=.8}}
  const inTown=(x,y)=>(L.towns||[]).some(t=>Math.hypot(x-t.x,y-t.y)<tSafe(t)+170);
  for(let n=dec.length-1;n>=0;n--){const d=dec[n];if(!TSCEN.has(d.k)||d.tcell||d.light||terrProt(d))continue;
    const isTree=TTREE.has(d.k);if((!isTree||inTown(d.x,d.y))&&openAt(d.x,d.y))continue;if(wet(d.k)&&!isTree){dec.splice(n,1);continue}
    let ok=false;for(let t=0;t<40&&!ok;t++){const x=40+ds()*(WORLD-80),y=40+ds()*(WORLD-80);if(!openAt(x,y)||!clearOf(x,y)||liq(x,y)>.15)continue;
      const f=fbm(x/640,y/640,sd+41),want=isTree?clamp((f-.44)/.14,0,1)*.95+(nearCliff(x,y)?.35:0)+.04:1;if(ds()>want)continue;d.x=x;d.y=y;ok=true}
    if(!ok)dec.splice(n,1)}
  // [그래픽 v20] 나무 아닌 소품(바위·선인장·뼈·얼음 기둥…)도 종류별 무리로 모으고 빈터를 남긴다 + 지역마다 랜드마크 몇 곳
  {const cr=mulberry(sd*7919+5),okAt=(x,y,d)=>openAt(x,y)&&clearOf(x,y)&&(wet(d.k)?liq(x,y)<.92:liq(x,y)<=.15),by={};
    for(const d of dec){if(!TSCEN.has(d.k)||TTREE.has(d.k)||d.tcell||d.light||d.use||d.qonly||d.town||terrProt(d))continue;(by[d.k]||(by[d.k]=[])).push(d)}
    for(const k in by){const A=by[k];if(A.length<8)continue;const C=[];for(let i=Math.max(2,Math.round(A.length/8));i>0;i--)C.push({x:200+cr()*(WORLD-400),y:200+cr()*(WORLD-400),R:110+cr()*150});
      for(const d of A){if(cr()<.2)continue;let c=null,bd=900*900;for(const q of C){const e=(q.x-d.x)**2+(q.y-d.y)**2;if(e<bd){bd=e;c=q}}if(!c)continue;
        const a=cr()*6.283,u=Math.sqrt(cr()),x=c.x+Math.cos(a)*c.R*u,y=c.y+Math.sin(a)*c.R*u*.85;if(okAt(x,y,d)){d.x=x;d.y=y;d.s=(d.s||1)*(1.12-u*.25);if(id==='home'&&d.zl!=null)d.zl=Math.floor(levelAt(x,y))}}}
    const LMS={sand:[['ruinpillar',6,150,1.15],['sandrock',3,70,1.7]],snow:[['icespike',7,110,1.35],['iceboulder',3,60,1.5]],lava:[['obsidian',7,120,1.6],['lavarock',4,80,1.3]],
      meadow:[['ruinpillar',7,130,1.05],['mossrock',3,50,1.3]],moss:[['ruinpillar',7,130,1.05],['mossrock',3,50,1.3]],ash:[['ruinpillar',6,140,1.1],['tomb',3,60,1.1]],lush:[['templestone',6,120,1.2],['mossrock',3,60,1.4]],beach:[['searock',5,110,1.5],['wreck',1,0,1.2]]};
    for(let n=0,t=0;n<4&&t<200;t++){const x=500+cr()*(WORLD-1000),y=500+cr()*(WORLD-1000);let good=true;
      for(let q=0;q<10&&good;q++){const a=q/10*6.283;if(!openAt(x+Math.cos(a)*190,y+Math.sin(a)*190)||!clearOf(x+Math.cos(a)*190,y+Math.sin(a)*190)||liq(x+Math.cos(a)*190,y+Math.sin(a)*190)>.1)good=false}
      if(!good||!openAt(x,y)||!clearOf(x,y)||liq(x,y)>.1)continue;const LM=LMS[terrTheme(id,x,y)];if(!LM)continue;n++;
      for(const [k,cnt,R,sc] of LM){if(!TSCEN.has(k))continue;for(let i=0;i<cnt;i++){const a=i/cnt*6.283+cr()*.3,rr=R*(cnt>2?1:.4);dec.push({x:x+Math.cos(a)*rr,y:y+Math.sin(a)*rr*.85,k,s:sc*(.9+cr()*.2),v:cr(),zl:0,lm:1})}}}}
  // 절벽 밑 떨어진 돌
  for(const c of cells){if(c.d!==1||c.i<0||c.j<0||c.i>=N||c.j>=N||pr()>.16)continue;const x=c.x+(pr()<.5?60:-60)*(pr()<.5?1:0),y=c.y+70;if(openAt(x,y)&&clearOf(x,y))dec.push({x,y,k:id==='home'?'rock':'rock',s:.5+pr()*.4,v:pr(),zl:0,tcell:1})}
  for(const t of tops)dec.push(t);
  // 절벽 칸은 장식 목록에 넣지 않는다: 매 프레임 장식 6천 개를 훑지 않고, 화면에 걸친 칸만 terrVis가 꺼낸다
  const byK=new Array(TN*TN);for(const c of cells)byK[terrIdx(c.i,c.j)]=c;
  return{L,w,h,dO,cells,byK,n:cells.length}}
// 그리기 목록에 화면에 걸친 절벽 칸만 넣는다 (키 큰 칸은 아래쪽 화면 밖에서도 윗면이 보이므로 높이만큼 더 본다)
function terrVis(vis){const T=TGRID;if(!T||!T.byK)return;const m=200,c0=S2W(-m,-m),c1=S2W(W+m,-m),c2=S2W(-m,H+m*1.6+600),c3=S2W(W+m,H+m*1.6+600);
  const i0=Math.max(-TK,Math.floor(Math.min(c0.x,c1.x,c2.x,c3.x)/TCS)),i1=Math.min(TNC+TK-1,Math.floor(Math.max(c0.x,c1.x,c2.x,c3.x)/TCS)),j0=Math.max(-TK,Math.floor(Math.min(c0.y,c1.y,c2.y,c3.y)/TCS)),j1=Math.min(TNC+TK-1,Math.floor(Math.max(c0.y,c1.y,c2.y,c3.y)/TCS));
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const c=T.byK[terrIdx(i,j)];if(!c)continue;const sx=(c.x-c.y)*KI-camX,sy=(c.x+c.y)*KI/2-camY;
    if(sx>-m&&sx<W+m&&sy-c.h<H+m*1.6&&sy>-m){c._s={x:sx,y:sy};vis.push(c)}else c._front=false}}
// 지역을 불러올 때 지형을 준비한다 (한 번 만든 지형은 다시 쓴다)
function terrEnsure(id){const L=terrLayer(id);if(!L)return null;let T=TERR[id];if(!T||T.L!==L)T=TERR[id]=terrBuild(id);return T}
function terrApply(id){if(!TREADY){TGRID=null;return}const T=terrEnsure(id);TGRID=T||null;
  const L=terrLayer(id);if(L)setArr(decor,L.decor)}
// 바위 덩어리 한 칸 그림: 왼쪽 면(밝음) · 오른쪽 면(어두움) · 윗면(풀/눈/모래) · 위 가장자리 풀 술 · 아래 그을음
// 바위 덩어리 한 칸 그림 (v20 절벽 2.0): 낮은 쪽(빈 땅·낮은 이웃)을 향한 변만 윗면을 안쪽으로 들이고 울퉁불퉁하게 → 상자 계단 대신 비탈진 벼랑.
// 높이가 비슷한 이웃 쪽 변은 곧게 두어 이웃 칸과 이음매 없이 이어진다. m: 드러난 변 비트(1=+j 앞왼쪽, 2=+i 앞오른쪽, 4=-i 뒤왼쪽, 8=-j 뒤오른쪽)
function cliffSprite(th,h,v,dk,m){dk=dk||1;m=m==null?15:m;const T=TTHEME[th],key=`cliff2/${th}/${h}/${v}/${dk}/${m}`,F=[1,1,.8,.62,.48][dk];
  return SC.get(key,176,h+120,88,h+60,g=>{g.translate(88,h+60);const s=mulberry(v*977+h*13+th.length*31+m*7),rc=(c,k,a)=>`rgba(${Math.min(255,c[0]*k*F)|0},${Math.min(255,c[1]*k*F)|0},${Math.min(255,c[2]*k*F)|0},${a==null?1:a})`;
    const A=[0,-37.5],B=[75,0],C=[0,37.5],D=[-75,0],tex=g.createPattern(Kit.tile('stone'),'repeat');g.lineJoin='round';g.lineCap='round';
    const ex=b=>!!(m&b),tp=Math.min(22,10+h*.05);
    // 윗면 꼭짓점: 드러난 변의 안쪽 법선 방향으로 들인다
    const N={1:[.447,-.894],2:[-.447,-.894],4:[.447,.894],8:[-.447,.894]},sides=[[D,C,1],[C,B,2],[B,A,8],[A,D,4]];
    const top=p=>[p[0],p[1]-h],V=new Map([[A,top(A)],[B,top(B)],[C,top(C)],[D,top(D)]]);
    for(const [P0,P1,b] of sides)if(ex(b)){const n=N[b];for(const P of [P0,P1]){const q=V.get(P);V.set(P,[q[0]+n[0]*tp,q[1]+n[1]*tp])}}
    // 윗면 테두리: 드러난 변은 바위턱처럼 들쭉날쭉, 아닌 변은 곧게 (이웃과 이어짐)
    const edge=(P0,P1,b)=>{const a=V.get(P0),c=V.get(P1),n=N[b],pts=[];const k=ex(b)?9:1;for(let i=0;i<k;i++){const t=i/k,j=ex(b)&&i>0?(s()-.35)*7:0;pts.push([a[0]+(c[0]-a[0])*t-n[0]*j,a[1]+(c[1]-a[1])*t-n[1]*j])}return pts};
    const E=sides.map(([P0,P1,b])=>edge(P0,P1,b)),ring=[].concat(...E);
    // 앞 두 면: 밑변(바닥 그대로) → 윗면 테두리
    const face=(Pa,Pb,ei,dx,dy,lit)=>{const top0=E[ei].concat([V.get(Pb)]);g.save();g.beginPath();g.moveTo(Pa[0],Pa[1]+1);
      const nb=6;for(let i=1;i<=nb;i++){const t=i/nb;g.lineTo(Pa[0]+(Pb[0]-Pa[0])*t,Pa[1]+(Pb[1]-Pa[1])*t+1+(i<nb?s()*2.4:0))}
      for(let i=top0.length-1;i>=0;i--)g.lineTo(top0[i][0],top0[i][1]);g.closePath();g.clip();
      g.save();g.transform(dx,dy,0,-1,Pa[0],Pa[1]);
      g.fillStyle=rc(T.rock,lit*.9);g.fillRect(-4,-4,108,h+tp+30);
      // 바위 판: 위로 갈수록 작아지는 덩어리(비탈) + 층
      let u=-6;while(u<104){const wd=10+s()*18;let vv=0;while(vv<h+tp+20){const ht=Math.min(h+tp+20-vv,12+s()*26),k=lit*(.7+s()*.42+vv/(h+40)*.12),sk=(s()-.5)*6;
          g.fillStyle=rc(T.rock,k);g.beginPath();g.moveTo(u+1,vv+1);g.lineTo(u+wd-1+sk,vv+1.5);g.lineTo(u+wd-1,vv+ht-1);g.lineTo(u+1+sk*.5,vv+ht-.5);g.closePath();g.fill();
          g.fillStyle=rc(T.rock,k*1.28+.08,.55);g.fillRect(u+1.5,vv+ht-3,wd-3,2);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(u+1,vv+1,1.6,ht-2);vv+=ht}u+=wd}
      g.globalAlpha=.35;g.globalCompositeOperation='overlay';g.fillStyle=tex;g.fillRect(0,0,100,h+tp+20);g.globalAlpha=1;g.globalCompositeOperation='source-over';
      for(let k=0;k<3;k++){let x0=s()*100,y0=h*(.3+s()*.6);g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1;g.beginPath();g.moveTo(x0,y0);for(let q=0;q<5;q++){x0+=(s()-.5)*9;y0-=4+s()*8;g.lineTo(x0,y0)}g.stroke()}
      const gb=g.createLinearGradient(0,0,0,Math.min(70,h));gb.addColorStop(0,rc(T.dark,1,.9));gb.addColorStop(1,rc(T.dark,1,0));g.fillStyle=gb;g.fillRect(-4,-4,108,Math.min(70,h)+4);
      if(T.ember)for(let k=0;k<2;k++){let x0=s()*100,y0=6+s()*(h*.6);g.strokeStyle='rgba(255,100,30,.6)';g.lineWidth=1.2;g.beginPath();g.moveTo(x0,y0);for(let q=0;q<4;q++){x0+=(s()-.5)*10;y0+=4+s()*7;g.lineTo(x0,y0)}g.stroke()}
      g.restore();
      // 위 가장자리: 풀/눈이 흘러내린 술 (윗면 테두리를 따라)
      if(T.fringe)for(let k=0;k<16;k++){const t=s(),i=Math.min(top0.length-2,Math.floor(t*(top0.length-1))),q0=top0[i],q1=top0[i+1],f=t*(top0.length-1)-i,x0=q0[0]+(q1[0]-q0[0])*f,y0=q0[1]+(q1[1]-q0[1])*f,len=3+s()*(T.grass?10:6),wd=3+s()*5;
        g.fillStyle=rc(T.fringe,(.75+s()*.4)*(lit>.8?1:.8),.9);g.beginPath();g.ellipse(x0,y0+len/2-1,wd,len/2+1,0,0,6.283);g.fill()}
      g.restore()};
    face(D,C,0,.75,.375,1);face(C,B,1,-.75,.375,.62);
    // 윗면
    const tpath=()=>{g.beginPath();ring.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()};
    tpath();g.fillStyle=rc(T.top,T.grass?.84:1);g.fill();g.save();tpath();g.clip();g.globalAlpha=.4;g.globalCompositeOperation='overlay';g.fillStyle=tex;g.fillRect(-80,-h-50,160,100);if(T.grass){g.globalAlpha=.7;g.globalCompositeOperation='overlay';g.fillStyle=g.createPattern(Kit.tile('grass'),'repeat');g.fillRect(-80,-h-50,160,100);g.globalCompositeOperation='source-over'}g.globalAlpha=1;g.globalCompositeOperation='source-over';
    for(let k=0;k<26;k++){const x=(s()-.5)*140,y=-h+(s()-.5)*66,r=4+s()*12;g.fillStyle=rc(s()<.6?T.top:T.rock,.82+s()*.3,.3);g.beginPath();g.ellipse(x,y,r,r*.5,0,0,6.283);g.fill()}
    // 드러난 변 쪽 윗면은 살짝 어둡게(둥글게 넘어가는 느낌)
    for(const [P0,P1,b] of sides)if(ex(b)){const a=V.get(P0),c=V.get(P1),n=N[b],mx=(a[0]+c[0])/2,my=(a[1]+c[1])/2,gr=g.createLinearGradient(mx,my,mx+n[0]*26,my+n[1]*26);gr.addColorStop(0,b&3?'rgba(0,0,0,.22)':'rgba(255,248,220,.10)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(-90,-h-60,180,120)}
    if(T.grass)for(let k=0;k<40;k++){const x=(s()-.5)*120,y=-h+(s()-.5)*54,l=3+s()*4;g.strokeStyle=rc(T.fringe,.8+s()*.5,.7);g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+(s()-.5)*3,y-l);g.stroke()}
    for(let k=0;k<v;k++){const x=(s()-.5)*80,y=-h+(s()-.5)*30,r=3+s()*4;g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(x+1.5,y+1.2,r*1.1,r*.6,0,0,6.283);g.fill();g.fillStyle=rc(T.rock,1.1);g.beginPath();g.ellipse(x,y-r*.2,r,r*.62,0,0,6.283);g.fill();g.fillStyle=rc(T.rock,1.45,.6);g.beginPath();g.ellipse(x-r*.3,y-r*.5,r*.45,r*.25,0,0,6.283);g.fill()}
    g.restore();
    // 앞쪽 드러난 윗가장자리: 바위턱·풀덤불
    for(const ei of [0,1]){if(!ex(sides[ei][2]))continue;const pts=E[ei],lit=ei?.7:1;for(let k=1;k<pts.length;k++){if(s()<.35)continue;const [x,y]=pts[k],r=3.5+s()*6;
      if(T.grass&&s()<.55){g.fillStyle=rc(T.fringe,.8+s()*.4,.95);g.beginPath();g.ellipse(x,y-r*.3,r*1.1,r*.7,0,0,6.283);g.fill();g.fillStyle=rc(T.fringe,1.35,.6);g.beginPath();g.ellipse(x-r*.3,y-r*.6,r*.5,r*.3,0,0,6.283);g.fill()}
      else{g.fillStyle=rc(T.rock,lit*(.85+s()*.25));g.beginPath();g.ellipse(x,y-r*.15,r,r*.62,(s()-.5)*.6,0,6.283);g.fill();g.fillStyle=rc(T.rock,lit*1.3,.55);g.beginPath();g.ellipse(x-r*.25,y-r*.45,r*.5,r*.25,0,0,6.283);g.fill()}}}
    // 밑동 돌무더기(드러난 앞면만)
    for(const [Pa,Pb,b] of [[D,C,1],[C,B,2]]){if(!ex(b))continue;for(let k=0;k<5;k++){const t=s(),x=Pa[0]+(Pb[0]-Pa[0])*t,y=Pa[1]+(Pb[1]-Pa[1])*t+3,r=2.5+s()*5;g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(x+1,y+1.5,r*1.2,r*.6,0,0,6.283);g.fill();g.fillStyle=rc(T.rock,(b===1?.95:.7)*(.85+s()*.3));g.beginPath();g.ellipse(x,y,r,r*.6,0,0,6.283);g.fill()}}},{force:1})}
// [v20] 산맥 안쪽(빈 땅에서 3칸 이상) 칸은 평평한 상자 대신 뾰족한 바위 봉우리로 그린다. 봉우리는 칸보다 넓어 이웃과 겹쳐 하나의 산줄기가 된다
function peakSprite(th,h,v,dk){dk=dk||1;const T=TTHEME[th],F=[1,1,.82,.66,.52][dk],key=`peak/${th}/${h}/${v}/${dk}`;
  return SC.get(key,220,h+150,110,h+70,g=>{g.translate(110,h+70);const s=mulberry(v*131+h*7+th.length*17),rc=(c,k,a)=>`rgba(${Math.min(255,c[0]*k*F)|0},${Math.min(255,c[1]*k*F)|0},${Math.min(255,c[2]*k*F)|0},${a==null?1:a})`;
    const L=[-100+s()*8,-2],R=[100-s()*8,-2],H0=h*.72+20;
    // 능선: 왼쪽 끝 → 봉우리 2~3개 → 오른쪽 끝 (둥근 어깨 + 들쭉날쭉한 바위)
    const nh=2+(s()*2|0),hum=[];for(let i=0;i<nh;i++)hum.push({x:-60+120*(i+.5)/nh+(s()-.5)*24,y:H0*(.7+s()*.3)});
    const prof=x=>{let m=0;for(const u of hum){const d=(x-u.x)/58;m=Math.max(m,u.y*Math.max(0,1-d*d*.9))}return m};
    const ridgeP=[L];for(let i=1;i<20;i++){const x=L[0]+(R[0]-L[0])*i/20;ridgeP.push([x,-prof(x)-(s()-.5)*7+Math.abs(x)*.05])}ridgeP.push(R);
    let hi=1;for(let i=1;i<ridgeP.length;i++)if(ridgeP[i][1]<ridgeP[hi][1])hi=i;const top=ridgeP[hi];
    const lr=ridgeP.slice(0,hi+1),rr=ridgeP.slice(hi),Fr=[top[0]*.3+(s()-.5)*10,44];
    const fr=[Fr];for(let i=1;i<6;i++){const t=i/6;fr.push([Fr[0]+(top[0]-Fr[0])*t+(s()-.5)*12,Fr[1]+(top[1]-Fr[1])*t])}fr.push(top);
    const poly=(pts,fill)=>{g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=fill;g.fill()};
    const lit=[].concat(lr,fr.slice().reverse().slice(1)),shd=[].concat(fr,rr.slice(1),[[R[0],R[1]+2],[Fr[0],Fr[1]]]);
    lit.push([Fr[0],Fr[1]]);
    const gl=g.createLinearGradient(0,top[1],0,46);gl.addColorStop(0,rc(T.rock,1.35));gl.addColorStop(1,rc(T.rock,.95));
    const gs=g.createLinearGradient(0,top[1],0,46);gs.addColorStop(0,rc(T.rock,.86));gs.addColorStop(1,rc(T.dark,1.15));
    poly(lit,gl);poly(shd,gs);
    // 바위 결: 능선에서 아래로 갈라지는 골짜기 선
    g.save();g.beginPath();[].concat(lr,rr.slice(1),[[R[0],R[1]],[Fr[0],Fr[1]],[L[0],L[1]]]).forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();
    for(let k=0;k<14;k++){const src=s()<.5?lr:rr,q=src[1+(s()*(src.length-2)|0)];let x=q[0],y=q[1];g.strokeStyle=s()<.5?'rgba(0,0,0,.28)':rc(T.rock,1.4,.35);g.lineWidth=1+s();g.beginPath();g.moveTo(x,y);
      for(let i=0;i<6;i++){x+=(Math.sign(x-top[0])||1)*(2+s()*5);y+=8+s()*10;g.lineTo(x,y)}g.stroke()}
    g.globalAlpha=.3;g.globalCompositeOperation='overlay';g.fillStyle=g.createPattern(Kit.tile('stone'),'repeat');g.fillRect(-110,-h-80,220,h+140);g.globalAlpha=1;g.globalCompositeOperation='source-over';
    // 눈 덮인 꼭대기(눈 지역이거나 아주 높을 때) · 아래쪽 풀/덤불
    if(T.top[0]>200){// 눈 지역: 위쪽 절반 가까이 눈, 아래로 흘러내린 눈 줄기. 빛 받는 쪽은 흰색, 그늘은 푸른빛
      const sl=top[1]+(46-top[1])*(.42+s()*.12),pts=[];for(let i=0;i<=24;i++){const x=-110+220*i/24;pts.push([x,sl+Math.abs(x-top[0])*.18+(s()-.3)*16+(i%3===1?14+s()*20:0)])}
      const sn=(f)=>{g.beginPath();g.moveTo(-110,-h-80);g.lineTo(110,-h-80);for(let i=pts.length-1;i>=0;i--)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.fillStyle=f;g.fill()};
      g.save();g.beginPath();lit.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();sn(rc([240,244,250],1/F*.98));g.restore();
      g.save();g.beginPath();shd.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();sn(rc([168,184,212],1/F*.95));g.restore();
      for(let k=0;k<10;k++){const x=(s()-.5)*170,y=-prof(x)+12+s()*20;g.strokeStyle=x<top[0]?'rgba(150,160,184,.5)':'rgba(240,244,250,.35)';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+(s()-.5)*6,y+10+s()*14);g.stroke()}}
    else if(h>440){const sy=top[1]+24+s()*16;g.fillStyle=rc([236,240,248],1,.95);g.beginPath();g.moveTo(top[0],top[1]);for(let i=0;i<=8;i++){const t=i/8,x=top[0]-40+80*t,y=sy+Math.sin(i*1.9)*6+(Math.abs(t-.5))*28;g.lineTo(x,y)}g.closePath();g.fill()}
    if(T.grass){const gg=g.createLinearGradient(0,-H0*.6,0,40);gg.addColorStop(0,rc(T.top,.9,0));gg.addColorStop(1,rc(T.top,.9,.75));g.fillStyle=gg;g.fillRect(-110,-H0,220,H0+50)}
    if(T.grass)for(let k=0;k<26;k++){const x=(s()-.5)*180,y=-H0*.3*s()+10+s()*34,r=4+s()*9;g.fillStyle=rc(T.fringe,.65+s()*.4,.9);g.beginPath();g.ellipse(x,y,r,r*.6,0,0,6.283);g.fill()}
    // 풀 지역: 아래 비탈에 작은 침엽수 숲 (멀리 있는 숲처럼 보이게)
    if(T.grass){const tr=[];for(let k=0;k<22;k++){const x=(s()-.5)*190,y0=-prof(x);const y=y0*(.05+s()*.38)+14+s()*22;if(y<y0+16)continue;tr.push([x,y,6+s()*6])}
      tr.sort((a,b)=>a[1]-b[1]);for(const [x,y,r] of tr){const sh=x>top[0]?.62:1;g.fillStyle=rc(T.fringe,.55*sh);g.beginPath();g.moveTo(x,y-r*2.3);g.lineTo(x+r,y);g.lineTo(x-r,y);g.closePath();g.fill();
        g.fillStyle=rc(T.fringe,.85*sh,.9);g.beginPath();g.moveTo(x,y-r*2.3);g.lineTo(x-r,y);g.lineTo(x-r*.15,y);g.closePath();g.fill()}}
    // 사막: 가로 지층 띠(메사) · 용암: 갈라진 틈의 붉은 빛 · 재: 흩어진 돌무더기와 마른 나무
    if(th==='sand')for(let k=0;k<7;k++){const y=-H0*.9+k*(H0*.95/7)+s()*6;g.fillStyle=k%2?rc(T.rock,1.18,.45):rc(T.dark,1.1,.35);g.beginPath();g.moveTo(-110,y);for(let i=0;i<=11;i++)g.lineTo(-110+20*i,y+Math.sin(i*1.3+k)*2.5+(i*20-110)*.04);g.lineTo(110,y+6+s()*4);g.lineTo(-110,y+5);g.closePath();g.fill()}
    if(T.ember)for(let k=0;k<7;k++){const q=(s()<.5?lr:rr)[1+(s()*(lr.length-2)|0)]||top;let x=q[0]*.8,y=q[1]+16+s()*20;g.strokeStyle='rgba(255,'+(90+s()*60|0)+',30,.85)';g.lineWidth=1.2+s()*1.2;g.shadowColor='#ff5a10';g.shadowBlur=6;g.beginPath();g.moveTo(x,y);for(let i=0;i<5;i++){x+=(s()-.5)*10;y+=7+s()*9;g.lineTo(x,y)}g.stroke();g.shadowBlur=0}
    if(th==='ash'){for(let k=0;k<40;k++){const x=(s()-.5)*190,y0=-prof(x),y=y0+(36-y0)*(.45+s()*.55),r=1.5+s()*3;g.fillStyle=rc(T.rock,x<top[0]?1.3:.8,.8);g.beginPath();g.ellipse(x,y,r,r*.6,0,0,6.283);g.fill()}
      for(let k=0;k<6;k++){const x=(s()-.5)*160,y0=-prof(x),y=y0+(36-y0)*(.5+s()*.4);g.strokeStyle=rc(T.dark,.7,.9);g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-9);g.moveTo(x,y-5);g.lineTo(x-3,y-8);g.moveTo(x,y-7);g.lineTo(x+3,y-10);g.stroke()}}
    const gb=g.createLinearGradient(0,10,0,50);gb.addColorStop(0,'rgba(0,0,0,0)');gb.addColorStop(1,rc(T.dark,.8,.6));g.fillStyle=gb;g.fillRect(-110,10,220,40);
    g.restore();
    g.strokeStyle=rc(T.rock,1.5,.5);g.lineWidth=1.2;g.beginPath();lr.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()},{force:1})}
// 그리기: 주인공 바로 앞(아래쪽) 칸은 낮게 · 반투명으로 (주인공이 가려지지 않게)
function drawCliff(c){const ps=P._s||W2S(P.x,P.y),s=c._s;
  const front=c.x+c.y>P.x+P.y&&Math.abs(s.x-ps.x)<95&&s.y-ps.y>-20&&s.y-c.h-40<ps.y;c._front=front;
  if(c.d>=3&&!front){const e=peakSprite(c.th,c.h,c.v,c.dk);if(e)SC.draw(ctx,e,s.x,s.y);return}
  const e=cliffSprite(c.th,c.h,c.v,c.dk,c.m);if(!e)return;if(front){ctx.globalAlpha=.38;SC.draw(ctx,e,s.x,s.y);ctx.globalAlpha=1;return}
  // [최적화] 앞 두 이웃(왼쪽 아래 · 오른쪽 아래) 절벽이 이 칸의 옆면 아래쪽을 덮는다 → 덮이는 부분은 그리지 않는다 (겹쳐 그리기가 산맥에서 6겹 가까이였다)
  const ph=terrClipH(c,s,ps);if(ph>=e.h){SC.draw(ctx,e,s.x,s.y);return}
  ctx.drawImage(e.cv,0,0,e.cv.width,Math.ceil(ph*e.s),s.x-e.ax,s.y-e.ay,e.w,Math.ceil(ph*e.s)/e.s)}
// 이 칸 그림에서 실제로 보이는 윗부분 높이(그림 위끝부터). 앞 이웃이 벽이 아니거나 반투명(주인공 앞)이면 다 그린다
var TCLIP=true;// QA: 끄면 예전처럼 다 그린다 (그림 비교용)
function terrClipH(c,s,ps){const G=TGRID;if(!TCLIP||!G||!G.h)return 1e9;const i=c.i,j=c.j;if(i+1>=TNC+TK||j+1>=TNC+TK)return 1e9;
  const kl=terrIdx(i,j+1),kr=terrIdx(i+1,j);if(!G.w[kl]||!G.w[kr])return 1e9;
  // v20: 앞 이웃이 산봉우리(d>=3)거나 윗면을 안쪽으로 들인 칸(m≠0)이면 상자처럼 다 덮지 않으므로 자르지 않는다
  {const a=G.byK&&G.byK[kl],b=G.byK&&G.byK[kr];if(!a||!b||a.m||b.m||a.d>=3||b.d>=3)return 1e9}const hl=G.h[kl],hr=G.h[kr],m=Math.min(hl,hr);if(m<40)return 1e9;
  // 이웃이 이번 프레임에 반투명으로 그려질 수 있으면 자르지 않는다 (drawCliff의 front 조건과 같은 식)
  for(const [dx,hn] of [[-75,hl],[75,hr]]){const nx=s.x+dx,ny=s.y+37.5;if(Math.abs(nx-ps.x)<95&&ny-ps.y>-20&&ny-hn-40<ps.y)return 1e9}
  return c.h+60+37.5-m+4}
// 작은 지도: 절벽 칸을 어두운 바위색으로
function terrMinimap(c,N){if(!TGRID)return;const f=N/TNC;for(let j=0;j<TNC;j++)for(let i=0;i<TNC;i++){if(!terrWallIJ(i,j))continue;const T=TTHEME[TGRID.cells.length?terrTheme(REG.id,(i+.5)*TCS,(j+.5)*TCS):'moss'];c.fillStyle=`rgb(${T.dark[0]*1.4|0},${T.dark[1]*1.4|0},${T.dark[2]*1.4|0})`;c.fillRect(i*f,j*f,f+.5,f+.5)}}
for(const id of ['home',...REG_IDS])terrSnap(id);
// 지역 들판 토벌 목표 자리(wx.js)가 절벽 안이면 마을 쪽으로 당긴다 (표시 자리만 바뀐다)
const TRCH={};
{const _z=wxRegZone;wxRegZone=function(id,k){const r=_z(id,k);if(!r)return r;const L=terrLayer(id),t=L&&L.town;if(!t)return r;
  const ok=TRCH[id]||(TRCH[id]=terrReach(id));for(let k2=0;k2<60&&!ok[terrLQi(r.x,r.y)];k2++){r.x+=(t.x-r.x)*.08;r.y+=(t.y-r.y)*.08}return r}}
TREADY=true;terrApply(REG.id);if(!DG)terrFix(P);
// [그래픽 v20] 빛과 안개: 지역마다 먼 곳(화면 위쪽) 옅은 안개 + 가장자리 은은한 어둠 + 마을 등불 빛 번짐. 미리 구운 그림 한 장을 덮는다
const ATMOS={moss:['#b8c4a0',.13],ash:['#8c8478',.18],meadow:['#d8d4b8',.13],lush:['#a8c8a0',.15],sand:['#e8b880',.16],snow:['#e4ecf8',.2],lava:['#b04a20',.2],beach:['#c8e4ec',.14]};
function atmosLayer(lg,lcv){const th=DG?'dg':(TGRID||REG.th)?terrTheme(REG.id,P.x,P.y):'moss',A=ATMOS[th]||['#000',0],w=lcv.width,h=lcv.height;
  // 어둠 층(반 해상도)에 같이 그린다: 화면 전체를 한 번 더 덮지 않아 거의 공짜. 빛 둘레는 어둠과 함께 걷힌다
  const e=SC.get(`fx/atmos/${th}/${w}x${h}`,w,h,0,0,g=>{
    if(A[1]>0){const c=Kit.hex(A[0]),gr=g.createLinearGradient(0,0,0,h*.5);gr.addColorStop(0,`rgba(${c[0]},${c[1]},${c[2]},${A[1]})`);gr.addColorStop(.55,`rgba(${c[0]},${c[1]},${c[2]},${A[1]*.35})`);gr.addColorStop(1,`rgba(${c[0]},${c[1]},${c[2]},0)`);g.fillStyle=gr;g.fillRect(0,0,w,h*.5);
      g.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},.025)`;g.fillRect(0,0,w,h)}
    const m=Math.max(w,h),rv=g.createRadialGradient(w/2,h*.56,m*.38,w/2,h*.56,m*.78);rv.addColorStop(0,'rgba(4,4,8,0)');rv.addColorStop(1,`rgba(4,4,8,${DG?.5:.4})`);g.fillStyle=rv;g.fillRect(0,0,w,h)},{force:1,scale:1});
  if(e)lg.drawImage(e.cv,0,0,w,h)}
function drawAtmos(zl){if(DG)return;let gc=null;
  for(const d of LIGHTS){if(d.k!=='lamp')continue;const s=W2S(d.x,d.y);if(s.x<-80||s.x>W+80||s.y<-120||s.y>H+60)continue;
    if(!gc){gc=Kit.glowCv('#ffb45a');ctx.globalCompositeOperation='lighter'}ctx.globalAlpha=.2+.04*Math.sin(time*3+d.x*.01);ctx.drawImage(gc,(s.x-70)*DPR,(s.y-95)*DPR,140*DPR,110*DPR)}
  if(gc){ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}
// 화면 설정 창 (「화면」 단추): 빛과 안개 켜기/끄기 · 카메라 1.0 / 1.15
function gfxSave(){try{localStorage.setItem('arseia-gfx',JSON.stringify(GFX))}catch(_){}}
function gfxSet(k,v){GFX[k]=v;gfxSave();if(k==='art'&&typeof flGround==='function'){if(v!=='old')flLoad();flGround()}if(k==='zoom'){resize();if(typeof P!=='undefined'&&P&&P.cls&&typeof heroBake==='function'){SC.bakeLeft=99;heroBake(P,Math.max(1,DPR)*HS*PK)}}}
(()=>{const b=document.createElement('button');b.type='button';b.id='gfxBtn';b.title='화면 설정';b.textContent='화면';
  const row=document.getElementById('treeBtn');if(!row||!row.parentNode)return;b.className='stonebox';row.parentNode.appendChild(b);
  let el=null;b.onclick=e=>{e.stopPropagation();if(!el){el=document.createElement('div');el.id='gfxPanel';
      el.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:66;width:min(340px,calc(100vw - 32px));padding:14px 16px;background:rgba(20,16,10,.96);border:1px solid #8a7346;border-radius:8px;color:#efe2c0;font-size:14px;line-height:1.5;box-sizing:border-box';
      el.addEventListener('keydown',e=>e.stopPropagation());el.addEventListener('pointerdown',e=>e.stopPropagation());document.body.appendChild(el)}
    const ck=(on)=>on?' checked':'';
    el.innerHTML=`<b style="font-size:16px">화면 설정</b>
      <label style="display:flex;gap:8px;align-items:center;margin-top:10px"><input type="checkbox" data-g="fog"${ck(GFX.fog)}> 빛과 안개 <span style="color:#a39d8f;font-size:12px">(먼 곳 안개 · 가장자리 그늘 · 등불 빛)</span></label>
      <div style="margin-top:10px">카메라</div><div style="display:flex;gap:14px;margin-top:2px">
      <label><input type="radio" name="gz" data-z="1"${ck(GFX.zoom===1)}> 기본 (1.0)</label><label><input type="radio" name="gz" data-z="1.15"${ck(GFX.zoom===1.15)}> 가까이 (1.15)</label></div>
      <div style="color:#a39d8f;font-size:12px;margin-top:4px">가까이 하면 캐릭터·몬스터가 크게 보이고 보이는 범위는 조금 좁아집니다.</div>
      <div style="margin-top:10px">그림 <span style="color:#a39d8f;font-size:12px">(시험: 처음 들판의 나무·바위·땅과 고블린·해골·오우거)</span></div><div style="display:flex;gap:14px;margin-top:2px">
      <label><input type="radio" name="ga" data-a="new"${ck(GFX.art!=='old')}> 새 그림</label><label><input type="radio" name="ga" data-a="old"${ck(GFX.art==='old')}> 예전 그림</label></div>
      <div style="text-align:right;margin-top:10px"><button type="button" class="ghost" data-close="1">닫기</button></div>`;
    el.querySelector('[data-g="fog"]').onchange=ev=>gfxSet('fog',ev.target.checked);
    el.querySelectorAll('[data-z]').forEach(r=>r.onchange=()=>gfxSet('zoom',+r.dataset.z));
    el.querySelectorAll('[data-a]').forEach(r=>r.onchange=()=>gfxSet('art',r.dataset.a));
    el.querySelector('[data-close]').onclick=()=>{el.hidden=true};el.hidden=false}})();
window.__terr={GFX,gfxSet,terrGrid,terrEnsure,terrReach,terrReachLQ,terrFix,terrWall,terrSnap,TERR,TSCEN,get TGRID(){return TGRID},set clip(v){TCLIP=!!v}};
