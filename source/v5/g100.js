/* ---------- v57 후보 · 141~160레벨 새 땅 (움직임 · 그림 · 땅마다 놀이 · 저장) · 자료는 g100d.js · 큰 구덩이는 g100c.js ----------
   사용자 2026-11-07 「140레벨 이상의 사냥터가 없어 … 더 강한 지역의 몬스터들을 잡을 기회」 → 제안 가-1 (+ 정할 것 ①②).
   · 소금 거울 평원: 얕은 물이 고인 「거울 물」 자리 열 곳(하늘 · 구름이 비침). 「거울 속 사냥꾼」은 거의 보이지 않다가 거울 물 위에서는 물에 비친 모습이 또렷하다(그림만 · 맞는 판정은 그대로).
   · 검은 기둥 해안: 6분마다 1분 50초 밀물. 바다 쪽(지도 아래) 모래밭이 잠겨 걸음 −45%, 바다 동굴(던전) 입구는 썰물 때만 열림. 화면 위에 밀물 · 썰물 시계.
   · 푸른 빛 동굴: 캄캄한 땅속. 내 둘레 · 길가 등불 걸이 둘레만 밝다. 빛 버섯을 건드리면 60초 동안 내 등불 +50%(대신 눈먼 굴박쥐가 1.6배 멀리서 알아챔). 천장의 푸른 빛 실.
   · 구름 돌기둥 숲: 땅을 가르는 구름 바다 두 줄기(못 건넘), 길이 지나는 곳에만 흔들다리. 다리 위에서는 옆바람(하얀 줄무늬 1.2초 예고 → 옆으로 밀림).
   · 정할 것 ① 140 넘는 몬스터(새 땅 · 그 던전)의 한 대 피해는 140레벨 것으로 묶고, 생명력 +3%/레벨(140 넘는 만큼, 덧셈). 처음 한 번만 고친다(e.g1).
   · 정할 것 ② 장비 레벨은 그대로(makeItem이 140에서 멈춤). 대신 새 땅 · 그 던전에서는 장비가 50% 더 자주, 룬석 · 재의 결정이 더 나온다.
   · 들어가기: 지옥 · 봉인 규칙(world3.js) + 130레벨부터. 밀물 · 바람 · 등불은 각자 화면에서(시계는 실제 시각이라 동료와 같다).
   · 저장: P.g100 하나 (없으면 기본값 · 모르는 칸은 그대로 · 비면 안 씀). g100b.js · g100g.js도 이 칸을 쓴다. 캐릭터 키를 지우거나 비우는 코드 없음. */
const G100V={toff:0,force:{tide:null},prevT:null,gust:null,gustT:6,shroom:0,said:{},last:{},spT:0};
const G100T={tideCyc:360,tideLen:110,tideWarn:15,tideY:4250,tideSlow:-.45,lampR:.3,postR:240,shroomT:60,shroomRe:180,batAgg:1.6,gust:[7,11],gustPush:150,bridgeR:120,dropMul:.5};
window.__g100=G100V;
const g100Now=()=>Date.now()/1000+G100V.toff;
const g100Day=()=>Math.floor((Date.now()+9*3600e3)/86400000);
const g100In=id=>!DG&&!IN&&REG&&REG.id===id;
const g100Land=()=>!DG&&!IN&&REG&&G100.all.includes(REG.id);
const g100DgIn=()=>!!(DG&&DG.d&&(G100.dgs.includes(DG.d.id)||DG.d.id===G100.crater||G100.dgx.includes(DG.d.id)));
const g100Tide=()=>{if(G100V.force.tide!=null)return !!G100V.force.tide;if(window.__QA)return false;/* #qa: 시계 탓에 옛 던전 공통 시험이 흔들리지 않게 · 밀물 시험은 force로 */return (g100Now()%G100T.tideCyc)>=G100T.tideCyc-G100T.tideLen};
const g100TideLeft=()=>{const t=g100Now()%G100T.tideCyc,hi=G100T.tideCyc-G100T.tideLen;return t>=hi?G100T.tideCyc-t:hi-t};
queueMicrotask(()=>{try{if(typeof BGM_REG==='object')Object.assign(BGM_REG,{[G100.salt]:'snow',[G100.coast]:'sea',[G100.cave]:'dark',[G100.spire]:'field'})}catch(_){}});
if(typeof AG26==='object')for(const k of ['sm1_golem','sm1_spirit','bc1_crab','bc1_giant','bl1_stal','bl1_worm','sp1_crane','sp1_warrior'])AG26.P.add(k);
if(typeof G42_GREG==='object')Object.assign(G42_GREG,{[G100.salt]:{herb:.1,ore:.2,cry:.7},[G100.coast]:{herb:.3,ore:.5,cry:.2},[G100.cave]:{herb:.2,ore:.3,cry:.5},[G100.spire]:{herb:.6,ore:.2,cry:.2}});

/* ===== 저장 칸 ===== */
const g100Obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const g100Int=(v,mx)=>Number.isFinite(+v)?Math.max(0,Math.min(mx||1e9,Math.floor(+v))):0;
function g100Clean(raw){const o=g100Obj(raw)?Object.assign({},raw):{};
  for(const k of ['bk','d','k','tr','sv','ex','tk','pe','qs','g140'])o[k]=g100Obj(o[k])?Object.assign({},o[k]):{};
  o.bx=Array.isArray(o.bx)?[...new Set(o.bx.map(v=>v|0).filter(v=>v>0&&v<=200))]:[];
  for(const k of ['tok','rf','st','rp','sh'])o[k]=g100Int(o[k]);return o}
const g100Empty=o=>!['bk','d','k','tr','sv','ex','tk','pe','qs','g140'].some(k=>Object.keys(o[k]).length)&&!o.bx.length&&!o.tok&&!o.rf&&!o.st&&!o.rp&&!o.sh;
const g100S=()=>{if(!P)return g100Clean(null);if(!g100Obj(P.g100)||!g100Obj(P.g100.bk)||!Array.isArray(P.g100.bx))P.g100=g100Clean(P.g100);return P.g100};
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P&&P.g100){const s=g100Clean(P.g100);if(!g100Empty(s))d.g100=s}}catch(e){if(window.__QA)throw e}return d}}
{const _ld=load;load=function(d){const ok=_ld.apply(this,arguments);if(ok){try{P.g100=g100Clean(d&&d.g100)}catch(e){if(window.__QA)throw e;P.g100=g100Clean(null)}g100Reset()}return ok}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);if(P)P.g100=g100Clean(null);g100Reset();return r}}
function g100Reset(){Object.assign(G100V,{gust:null,shroom:0,prevT:null})}
const g100Cnt=(k,n)=>{const s=g100S();s.k[k]=g100Int((s.k[k]|0)+(n==null?1:n));return s.k[k]};
const g100Once=(k,t,c)=>{if(G100V.said[k])return;G100V.said[k]=1;msg(t,c||'#cfe8ff')};

/* ===== 1) 레벨 · 봉인 · 몬스터 세기 ===== */
// b1.js levelAt은 99에서 멈춘다(지옥 +40 = 139) → 새 땅에서는 그 끝을 없앤다(같은 식).
{const _la=levelAt;levelAt=function(x,y){if(!DG&&REG&&G100.all.includes(REG.id)){let l=999;for(const t of lvAnch()){const d=Math.hypot(x-t.x,y-t.y);l=Math.min(l,t.base+Math.min(REG.zc||99,Math.max(0,d-SAFE)/(REG.zs||ZSTEP)))}return l}return _la.apply(this,arguments)}}
{const _b=w3BlockReg;w3BlockReg=function(id){const m=_b.apply(this,arguments);if(m||!G100.all.includes(id)||W3.qaOpen)return m;if(P.lvl<G100.minLv)return `${G100.minLv}레벨부터 들어갈 수 있는 강한 땅입니다 (지금 Lv${P.lvl}) · 몬스터 141~158레벨`;return ''}}
// 정할 것 ①: 140 넘는 몬스터 — 한 대 피해는 140레벨 것, 생명력 +3%/레벨 (처음 한 번)
function g100Fix(e){if(!e||e.g1||!(e.lvl>G100.capLv))return;e.g1=1;const L=e.lvl,c=G100.capLv;
  let f=(1+.18*(c-1))/(1+.18*(L-1));if(e._b24&&typeof B24==='object'&&B24.dmg)f*=B24.dmg(c)/B24.dmg(L);e.dmg*=f;if(e.dmg2)e.dmg2*=f;
  const k=1+G100.hpPer*(L-c);e.hp=Math.round(e.hp*k);e.max=Math.round(e.max*k)}
// 첫 만남 안내
function g100Enter(){const id=REG.id;if(!G100.all.includes(id))return;const D=REGIONS[id];
  banner={t:D.n,sub:`지옥 Lv${w3LvOf(id)}~ · 나보다 강한 땅 · 한 대 피해는 140레벨 몬스터와 같고 더 단단합니다`,col:D.col,life:3,max:3}}

/* ===== 2) 지도 다듬기 ===== */
const G100L={mirrors:[],spireY:[x=>2050+260*Math.sin(x/820+1.1)+120*Math.sin(x/390),x=>3900+240*Math.sin(x/760+.3)+110*Math.sin(x/350)],spireW:150};
const g100D=(x,y,t,o)=>Object.assign({x,y,k:'g100',t,s:1,v:0,zl:0},o||{});
function g100Post(){
  // 소금: 거울 물 열 곳 · 소금 결정 무더기
  {const L=RCACHE[G100.salt];if(L&&!L.g100){const s=mulberry(5101),T=L.town,M=[];
    for(let i=0;i<400&&M.length<10;i++){const x=600+s()*4800,y=600+s()*4800,rx=260+s()*260,ry=rx*(.7+s()*.2);
      if(T&&Math.hypot(x-T.x,y-T.y)<SAFE+rx+200)continue;if(M.some(m=>Math.hypot(m.x-x,m.y-y)<m.rx+rx+120))continue;if(L.caves.some(c=>Math.hypot(c.x-x,c.y-y)<rx+200))continue;if(L.edges.some(e=>Math.hypot(e.x-x,e.y-y)<rx+220))continue;M.push({x,y,rx,ry,i:M.length,cl:Array.from({length:4},()=>({u:s(),v:s()*.6-.3,k:.5+s()*.5}))})}
    r110Clear(L,d=>M.some(m=>((d.x-m.x)/(m.rx+30))**2+((d.y-m.y)/(m.ry+30))**2<1));
    for(let i=0;i<34;i++){const x=500+s()*5000,y=500+s()*5000;if(!r110Free(L,x,y,160)||M.some(m=>((x-m.x)/m.rx)**2+((y-m.y)/m.ry)**2<1.2))continue;L.decor.push(g100D(x,y,'salt',{v:s()}))}
    L.g100={mirrors:M};G100L.mirrors=M}}
  // 해안: 밀물에 잠기는 모래밭 띠 위 장식은 걷기(검은 기둥만 몇 개) · 기둥 묶음
  {const L=RCACHE[G100.coast];if(L&&!L.g100){const s=mulberry(5107);r110Clear(L,d=>d.y>G100T.tideY+40&&!(d.k==='obsidian'&&s()<.2));
    const cols=[];for(let i=0;i<300&&cols.length<26;i++){const x=400+s()*5200,y=600+s()*(G100T.tideY-700);if(!r110Free(L,x,y,220)||cols.some(c=>Math.hypot(c.x-x,c.y-y)<380))continue;cols.push(g100D(x,y,'basalt',{v:s(),big:s()<.45}))}
    L.decor.push(...cols);L.g100={cols}}}
  // 동굴: 길가 등불 걸이 · 빛 버섯 · 천장 빛 실
  {const L=RCACHE[G100.cave];if(L&&!L.g100){const s=mulberry(5113),T=L.town,posts=[],shrooms=[],thr=[];
    if(T)for(const a of [.6,2.2,3.8,5.3])posts.push(g100D(T.x+Math.cos(a)*(SAFE+60),T.y+Math.sin(a)*(SAFE+60),'post',{light:150}));
    for(const r of L.roads)for(let i=6;i<r.length;i+=9){const p=r[i];if(posts.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<520))continue;if(r110Free(L,p.x+70,p.y,90))posts.push(g100D(p.x+70,p.y,'post',{light:150}))}
    for(let i=0;i<400&&shrooms.length<12;i++){const x=500+s()*5000,y=500+s()*5000;if(!r110Free(L,x,y,160)||shrooms.some(q=>Math.hypot(q.x-x,q.y-y)<700)||posts.some(q=>Math.hypot(q.x-x,q.y-y)<300))continue;shrooms.push(g100D(x,y,'shroom',{i:shrooms.length,at:-999,light:70}))}
    for(let i=0;i<70;i++)thr.push({x:300+s()*5400,y:300+s()*5400,n:3+(s()*5|0),ph:s()*6.283});
    L.decor.push(...posts,...shrooms);L.g100={posts,shrooms,thr}}}
  // 돌기둥 숲: 구름 바다 두 줄기(길이 지나는 곳만 다리로 남김) · 큰 돌기둥 · 다리
  {const L=RCACHE[G100.spire];if(L&&!L.g100){const lq=L.lq,T=L.town,s=mulberry(5119),W0=G100L.spireW;
    const rb=L.roads.map(r=>r.map(p=>[p.x,p.y])),road=(x,y)=>{let m=1e9;for(const r of rb){m=Math.min(m,r110Seg(x,y,r));if(m<90)break}return m};
    for(const Y of G100L.spireY)for(let j=0;j<LQN;j++)for(let i=0;i<LQN;i++){const x=i*LQS,y=j*LQS,d=Math.abs(y-Y(x));if(d>W0+60)continue;let a=clamp((W0+40-d)/80,0,1);if(!a)continue;
      const keep=Math.min((road(x,y)-60)/70,T?(Math.hypot(x-T.x,y-T.y)-SAFE-160)/150:9,...L.edges.map(e=>(Math.hypot(x-e.x,y-e.y)-260)/120),...L.caves.map(c=>(Math.hypot(x-c.x,y-c.y)-280)/120));
      if(keep<1)a*=clamp(keep,0,1);const k=j*LQN+i;lq[k]=Math.max(lq[k],a)}
    {const prev=LQ;LQ=lq;r110Clear(L,d=>liqAt(d.x,d.y)>.12);LQ=prev}
    const br=[];for(const Y of G100L.spireY)for(const r of rb)for(let i=1;i<r.length;i++){const [ax,ay]=r[i-1],[bx,by]=r[i];const da=ay-Y(ax),db=by-Y(bx);if(da*db>0)continue;const u=da/(da-db||1),x=ax+(bx-ax)*u,y=ay+(by-ay)*u;if(br.some(b=>Math.hypot(b.x-x,b.y-y)<300))continue;br.push(g100D(x,y,'bridge',{a:Math.atan2(by-ay,bx-ax),label:'흔들다리'}))}
    const sp=[];for(let i=0;i<300&&sp.length<22;i++){const x=400+s()*5200,y=400+s()*5200;if(!r110Free(L,x,y,240)||sp.some(q=>Math.hypot(q.x-x,q.y-y)<420)||G100L.spireY.some(Y=>Math.abs(y-Y(x))<W0+160)||road(x,y)<150)continue;sp.push(g100D(x,y,'spire',{v:s()}))}
    r110Clear(L,d=>br.some(b=>Math.hypot(d.x-b.x,d.y-b.y)<160));L.decor.push(...sp,...br);L.g100={br,sp}}}
  g100Labels()}
function g100Labels(){for(const id of [...G100.all,R110.jungle]){const L=RCACHE[id];if(!L||!L.edges)continue;for(const e of L.edges){const D=REGIONS[e.to];if(!D)continue;e.label=`${D.n}로 · ${D.hell?'지옥 ':''}Lv${D.base+(D.hell?40:0)}~`}}}
// 바위 언덕(terrain.js): 거울 물 · 다리 · 새 물건 둘레에는 세우지 않음
{const _tg=terrGrid;terrGrid=function(id){const w=_tg.apply(this,arguments);try{if(w&&G100.all.includes(id))g100TerrFix(id,w)}catch(e){if(window.__QA)throw e}return w}}
function g100TerrFix(id,w){const L=RCACHE[id];if(!L)return;const mine=L.decor.filter(d=>d.k==='g100'),M=id===G100.salt&&L.g100?L.g100.mirrors:[];
  for(let j=0;j<TNC;j++)for(let i=0;i<TNC;i++){const k=terrIdx(i,j);if(!w[k])continue;const x=(i+.5)*TCS,y=(j+.5)*TCS;
    if(M.some(m=>((x-m.x)/(m.rx+160))**2+((y-m.y)/(m.ry+160))**2<1)||id===G100.coast&&y>G100T.tideY-100||mine.some(d=>Math.abs(d.x-x)<170&&Math.abs(d.y-y)<170))w[k]=0}}
{const _z=wxRegZone;wxRegZone=function(id,k){const L=RCACHE[id];if(!L||L.lair||!G100.all.includes(id))return _z.apply(this,arguments);L.lair={x:WORLD/2,y:WORLD/2};try{return _z.apply(this,arguments)}finally{L.lair=null}}}

/* ===== 3) 땅마다 놀이 ===== */
const g100OnMirror=(x,y)=>{const L=RCACHE[G100.salt],M=L&&L.g100?L.g100.mirrors:G100L.mirrors;return M.some(m=>((x-m.x)/m.rx)**2+((y-m.y)/m.ry)**2<1)};
function g100CoastTick(dt){const hi=g100Tide(),left=g100TideLeft();
  if(G100V.prevT!==hi){if(G100V.prevT!=null)banner=hi?{t:'밀물이 들어옵니다',sub:'바다 쪽 모래밭이 잠겼습니다 · 바다 동굴 입구가 닫힙니다',col:'#9fd8ff',life:2.6,max:2.6}:{t:'썰물입니다',sub:'모래밭이 드러났습니다 · 바다 동굴 입구가 열립니다',col:'#ffe8a0',life:2.4,max:2.4};G100V.prevT=hi}
  if(!hi&&left<=G100T.tideWarn&&!G100V.said.tw){G100V.said.tw=1;msg(`${Math.ceil(left)}초 뒤 밀물이 들어옵니다 · 바다 쪽 모래밭에서 올라가세요`,'#9fd8ff')}if(hi)G100V.said.tw=0;
  if(hi&&!P.dead&&P.y>G100T.tideY&&!inSafe(P.x,P.y,10)){P.buffs.g100_tide={t:.35,max:.35,n:'밀물에 잠김',spd:G100T.tideSlow};g100Once('tide','밀물에 발이 잠겨 걸음이 느려졌습니다. 기둥 위나 마을 쪽으로 올라가세요','#9fd8ff')}}
function g100CaveTick(dt){const L=RCACHE[G100.cave],K=L&&L.g100;if(!K)return;G100V.shroom=Math.max(0,G100V.shroom-dt);
  for(const m of K.shrooms){if(time-m.at<G100T.shroomRe||P.dead||dist(P,m)>70)continue;m.at=time;G100V.shroom=G100T.shroomT;g100Cnt('shroom');msg('빛 버섯이 터졌습니다! 60초 동안 등불이 커집니다 (눈먼 굴박쥐가 더 멀리서 알아챕니다)','#9fe8ff');
    rings.push({x:m.x,y:m.y,r:10,max:160,life:.7,col:'#7ad8ff'})}}
{const _ag=aggroOf;aggroOf=function(e,t){const v=_ag.apply(this,arguments);return e&&e.k==='bl1_bat'&&G100V.shroom>0?v*G100T.batAgg:v}}
function g100OnBridge(){const L=RCACHE[G100.spire],K=L&&L.g100;if(!K)return null;for(const b of K.br)if(Math.hypot(P.x-b.x,P.y-b.y)<G100T.bridgeR)return b;return null}
function g100SpireTick(dt){const b=g100OnBridge();
  if(G100V.gust){const g=G100V.gust;g.t-=dt;if(g.t<=0&&!g.done){g.done=1;const on=g100OnBridge();if(on&&!P.dead){const n=Math.atan2(Math.sin(on.a),Math.cos(on.a))+Math.PI/2*(g.dx>0?1:-1);moveBody(P,Math.cos(n)*G100T.gustPush,Math.sin(n)*G100T.gustPush);ftext(P.x,P.y-40,'옆바람!','#e8f0ff',false,60);g100Cnt('gust')}}if(g.t<-.4)G100V.gust=null}
  else if(b){G100V.gustT-=dt;if(G100V.gustT<=0){G100V.gustT=rnd(...G100T.gust);G100V.gust={t:1.2,max:1.2,dx:R()<.5?-1:1};g100Once('gust','다리 위에 옆바람이 붑니다! 하얀 줄무늬가 보이면 어서 건너세요','#e8f0ff')}}
  else G100V.gustT=Math.max(G100V.gustT,2.5)}
// 바다 동굴: 밀물 때는 닫힘 · 큰 구덩이 잠금은 g100c.js
{const _ed=enterDungeon;enterDungeon=function(c){try{const id=c&&(c.cave&&c.cave.id||c.id);if(id==='g1_coastdg'&&g100Tide()&&!NET.guest){msg(`밀물이라 바다 동굴 입구가 물에 잠겼습니다 · 썰물까지 ${Math.ceil(g100TideLeft())}초`,'#9fd8ff');return}}catch(e){if(window.__QA)throw e}return _ed.apply(this,arguments)}}

/* ===== 4) 몬스터 · 떨굼 ===== */
// 정할 것 ②: 장비 +50% · 룬석 · 재의 결정 (새 땅과 그 던전 · 큰 구덩이)
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&e&&e.lvl>G100.capLv&&(g100Land()||g100DgIn())){const t=TYPES[e.k]||{};
  if(!(t.boss||t.mini)){if(R()<(e.elite?1:.1)*DROP24*G100T.dropMul){const it=makeItem(e.lvl,e.elite);if(junkKeep(it))loot.push({x:e.x+rnd(-16,16),y:e.y+rnd(-16,16),kind:'item',item:it,t:0})}
    if(typeof e22RuneRoll==='function'&&R()<(e.elite?.15:.02))e22RuneGain(e22RuneRoll(5),1,e.x,e.y);if(typeof ashGain==='function'&&R()<(e.elite?.6:.12))ashGain(e.elite?2:1,e.x,e.y)}
  else{if(typeof e22RuneRoll==='function')e22RuneGain(e22RuneRoll(t.boss?7:5),1,e.x,e.y);if(typeof ashGain==='function')ashGain(t.boss?6:3,e.x,e.y);
    if(t.boss&&G100.bosses.includes(e.k)){const s=g100S();if(!s.bk[e.k]){s.bk[e.k]=1;msg(`${t.n}을(를) 처음 쓰러뜨렸습니다 · 네 땅의 주인 ${Object.keys(s.bk).filter(k=>G100.bosses.includes(k)).length}/4`,'#ffd76a')}else s.bk[e.k]=Math.min(9999,(s.bk[e.k]|0)+1)}}}}catch(err){if(window.__QA)throw err}return r}}

/* ===== 5) 매 프레임 ===== */
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(!P||paused)return r;try{g100Tick(dt)}catch(e){if(window.__QA)throw e}return r}}
const g100Here=()=>DG?!!(DG.d&&(G100.dgs.includes(DG.d.id)||DG.d.id===G100.crater||G100.dgx.includes(DG.d.id))):!IN&&!!REG&&G100.all.includes(REG.id);
function g100Tick(dt){if(g100Here())for(const e of enemies)if(!e.g1&&e.lvl>G100.capLv)g100Fix(e);
  if(DG||IN){G100V.gust=null;return}const id=REG.id;if(G100V.lastReg!==id){G100V.lastReg=id;if(G100.all.includes(id))g100Enter()}
  if(id===G100.coast)g100CoastTick(dt);else G100V.prevT=null;
  if(id===G100.cave)g100CaveTick(dt);else G100V.shroom=0;
  if(id===G100.spire)g100SpireTick(dt);else G100V.gust=null}

/* ===== 6) 그림 ===== */
// 땅 위 납작한 것: 거울 물 · 밀물 · 구름 바다 반짝임
{const _ddf=drawDecalsFields;drawDecalsFields=function(){_ddf.apply(this,arguments);if(DG||IN)return;try{
  if(REG.id===G100.salt)g100DrawMirror();else if(REG.id===G100.coast)g100DrawTide();else if(REG.id===G100.spire)g100DrawCloud()}catch(e){if(window.__QA)throw e}}}
function g100DrawMirror(){const L=RCACHE[G100.salt],M=L&&L.g100?L.g100.mirrors:[];const cs=W2S(P.x,P.y);
  for(const m of M){const s=W2S(m.x,m.y);if(Math.abs(s.x-cs.x)>W+m.rx*2||Math.abs(s.y-cs.y)>H+m.ry*2)continue;
    const gr=ctx.createLinearGradient(m.x-m.rx,m.y-m.ry,m.x+m.rx,m.y+m.ry);gr.addColorStop(0,'rgba(96,160,228,.86)');gr.addColorStop(.55,'rgba(150,196,240,.84)');gr.addColorStop(1,'rgba(240,170,206,.8)');
    ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(m.x,m.y,m.rx,m.ry,0,0,6.283);ctx.fill();ctx.save();ctx.clip();
    ctx.fillStyle='rgba(255,255,255,.55)';for(const c of m.cl){const x=m.x-m.rx+((c.u*2*m.rx+time*12*c.k)%(2*m.rx)),y=m.y+c.v*m.ry;ctx.beginPath();ctx.ellipse(x,y,60*c.k,20*c.k,0,0,6.283);ctx.ellipse(x+40*c.k,y-8,40*c.k,16*c.k,0,0,6.283);ctx.fill()}
    ctx.restore();ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(m.x,m.y,m.rx,m.ry,0,0,6.283);ctx.stroke()}}
function g100DrawCloud(){const cs=W2S(P.x,P.y),W0=G100L.spireW;ctx.fillStyle='rgba(244,247,252,.38)';const BR=(RCACHE[G100.spire]&&RCACHE[G100.spire].g100)?RCACHE[G100.spire].g100.br:[];
  for(const Y of G100L.spireY)for(let x=0;x<=WORLD;x+=110){const y=Y(x),s=W2S(x,y);if(Math.abs(s.x-cs.x)>W||Math.abs(s.y-cs.y)>H)continue;if(BR.some(b=>Math.abs(b.x-x)<200&&Math.abs(b.y-y)<200))continue;const k=.5+.5*Math.sin(x*.013+time*.6);ctx.beginPath();ctx.ellipse(x+Math.sin(time*.3+x)*20,y,90+30*k,W0*.55+20*k,0,0,6.283);ctx.fill()}}
function g100DrawTide(){const hi=g100Tide(),Y=G100T.tideY,t=g100Now()%G100T.tideCyc,hiAt=G100T.tideCyc-G100T.tideLen;
  // 밀물: 띠가 차오르고(4초) 빠짐(4초)
  let u=G100V.force.tide!=null?(hi?1:0):hi?Math.min(1,(t-hiAt)/4):Math.max(0,1-Math.min(t,99)/4);if(!hi&&t>8)u=0;if(u<=0)return;const top=Y+(1-u)*600;
  ctx.globalAlpha=.78;ctx.fillStyle='#2a5a7a';ctx.fillRect(0,top,WORLD,WORLD-top);ctx.globalAlpha=.6;ctx.strokeStyle='#e8f4ff';ctx.lineWidth=10;ctx.beginPath();
  for(let x=0;x<=WORLD;x+=60){const y=top+Math.sin(x/90+time*2)*10;x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();ctx.globalAlpha=1}
// 거울 속 사냥꾼: 물 밖에서는 거의 안 보이고, 거울 물 위에서는 물에 비친 모습이 또렷 (그림만)
{const _de=drawEnemy;drawEnemy=function(e){if(!e||e.k!=='sm1_hunter'||DG)return _de.apply(this,arguments);const s=e._s;if(!s)return _de.apply(this,arguments);
  const on=g100OnMirror(e.x,e.y),near=dist(P,e)<170,a=on?.3:near?.45:.12;const o=ctx.globalAlpha;
  if(on){ctx.save();ctx.globalAlpha=.85;ctx.translate(0,s.y*2+6);ctx.scale(1,-1);try{_de.apply(this,arguments)}finally{ctx.restore()}}
  ctx.globalAlpha=a;try{return _de.apply(this,arguments)}finally{ctx.globalAlpha=o}}}
const g100Spr={
  salt:v=>SC.get('g100/salt'+(v>.5?1:0),80,70,40,62,g=>{g.translate(40,62);const n=v>.5?6:4;for(let i=0;i<n;i++){const x=(i-n/2)*10+4,h=18+((i*7)%4)*9;Kit.solid(g,q=>{q.moveTo(x-6,0);q.lineTo(x,-h);q.lineTo(x+6,0);q.closePath()},x-6,-h,x+6,0,'#f4f6f8',{rim:'rgba(200,230,255,.9)',lineW:.4})}},{scale:2}),
  basalt:big=>SC.get('g100/basalt'+(big?1:0),big?150:100,big?190:90,big?75:50,big?175:80,g=>{g.translate(big?75:50,big?175:80);const hs=big?[60,96,140,110,78,50]:[22,34,28,18],w=big?22:20;
    hs.forEach((h,i)=>{const x=(i-(hs.length-1)/2)*w*.9,y=(i%2)*6;Kit.solid(g,q=>{q.moveTo(x-w/2,y);q.lineTo(x-w/2,y-h);q.lineTo(x,y-h-5);q.lineTo(x+w/2,y-h);q.lineTo(x+w/2,y);q.closePath()},x-w/2,y-h-5,x+w/2,y,'#3a3a40',{tex:'stone',texA:.6,rim:'rgba(180,200,220,.5)'});
      g.fillStyle='#55555c';g.beginPath();g.moveTo(x-w/2,y-h);g.lineTo(x,y-h-5);g.lineTo(x+w/2,y-h);g.lineTo(x,y-h+4);g.closePath();g.fill()})},{scale:2}),
  post:()=>SC.get('g100/post',50,110,25,104,g=>{g.translate(25,104);Kit.solid(g,q=>q.rect(-3,-90,6,90),-3,-90,3,0,'#5a4030',{tex:'wood',texA:.5});Kit.solid(g,q=>q.rect(-14,-90,28,4),-14,-90,14,-86,'#5a4030');
    for(const x of [-12,12]){g.strokeStyle='#3a2a1a';g.lineWidth=1;g.beginPath();g.moveTo(x,-86);g.lineTo(x,-80);g.stroke();Kit.solid(g,q=>q.rect(x-5,-80,10,13),x-5,-80,x+5,-67,'#ffb060',{rim:'rgba(255,240,200,.9)',lineW:.5})}},{scale:2}),
  shroom:()=>SC.get('g100/shroom',60,50,30,44,g=>{g.translate(30,44);for(const [x,h,r,c] of [[-12,14,9,'#5ae0d0'],[2,20,12,'#9a7aff'],[14,12,7,'#5ae0d0']]){Kit.solid(g,q=>q.rect(x-2,-h,4,h),x-2,-h,x+2,0,'#d8e8f0');Kit.solid(g,q=>q.ellipse(x,-h,r,r*.55,0,0,6.283),x-r,-h-r,x+r,-h+r,c,{rim:'rgba(255,255,255,.8)'})}},{scale:2}),
  spire:v=>SC.get('g100/spire'+(v>.5?1:0),120,330,60,320,g=>{g.translate(60,320);const h=v>.5?300:240,w=v>.5?34:28;
    Kit.solid(g,q=>{q.moveTo(-w,0);q.lineTo(-w*.8,-h*.6);q.lineTo(-w*.7,-h);q.lineTo(w*.7,-h);q.lineTo(w*.85,-h*.55);q.lineTo(w,0);q.closePath()},-w,-h,w,0,'#9a9080',{tex:'stone',texA:.75,rim:'rgba(255,250,240,.6)'});
    for(const [x,s] of [[-10,1],[12,.8]]){g.fillStyle='#3a5a2a';g.beginPath();g.ellipse(x,-h-14*s,16*s,10*s,0,0,6.283);g.fill();g.fillStyle='#4a6a3a';g.beginPath();g.ellipse(x+4,-h-22*s,11*s,7*s,0,0,6.283);g.fill();g.strokeStyle='#4a3a2a';g.lineWidth=2;g.beginPath();g.moveTo(x,-h);g.lineTo(x,-h-10*s);g.stroke()}
    g.fillStyle='rgba(240,244,255,.85)';for(let i=0;i<4;i++){g.beginPath();g.ellipse(-30+i*20,-4,26,9,0,0,6.283);g.fill()}},{scale:2}),
  bridge:()=>SC.get('g100/bridge',200,90,100,45,g=>{g.translate(100,45);for(let i=0;i<10;i++){const x=-80+i*17.6;Kit.solid(g,q=>q.rect(x,-8,14,16),x,-8,x+14,8,i%2?'#8a6a42':'#7a5a36',{tex:'wood',texA:.5,lineW:.3})}
    g.strokeStyle='#c8a878';g.lineWidth=2;for(const y of [-16,14]){g.beginPath();g.moveTo(-86,y);g.quadraticCurveTo(0,y+8,86,y);g.stroke()}for(const x of [-86,86])Kit.solid(g,q=>q.rect(x-3,-24,6,40),x-3,-24,x+3,16,'#5a4030')},{scale:2})};
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.k!=='g100')return _rd.apply(this,arguments);const s=d._s;if(!s)return true;let e=null;
  if(d.t==='salt')e=g100Spr.salt(d.v);else if(d.t==='basalt')e=g100Spr.basalt(d.big);else if(d.t==='spire')e=g100Spr.spire(d.v);else if(g100Spr[d.t])e=g100Spr[d.t]();
  if(d.t==='bridge'){ctx.save();ctx.translate(s.x,s.y);ctx.rotate(Math.atan2(Math.sin(d.a)*.5+Math.cos(d.a)*.5,Math.cos(d.a)-Math.sin(d.a))*0);if(e)SC.draw(ctx,e,0,0);ctx.restore();if(dist(P,d)<300)r110Name(s,'흔들다리','#e8e0d0',36);return true}
  const dim=d.t==='shroom'&&time-d.at<G100T.shroomRe;if(dim)ctx.globalAlpha=.35;if(e)SC.draw(ctx,e,s.x,s.y);ctx.globalAlpha=1;
  if(d.t==='post'||d.t==='shroom'&&!dim){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4+.1*Math.sin(time*3+d.x);glow(s.x,s.y-(d.t==='post'?78:14),d.t==='post'?50:26,d.t==='post'?'#ffb060':'#7ad8ff');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  if(d.t==='shroom'&&!dim&&dist(P,d)<260)r110Name(s,'빛 버섯 (가까이 가면 터짐)','#9fe8ff',36);
  return true}}
// 화면 위: 동굴 어둠과 빛 · 다리 바람 · 밀물 시계
const G100C={cv:null,g:null};
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);if(DG||IN)return;try{const o=ctx.globalCompositeOperation;
  if(REG.id===G100.cave)g100DrawDark();
  if(REG.id===G100.spire&&G100V.gust&&!G100V.gust.done){S();ctx.globalCompositeOperation='lighter';const g=G100V.gust,u=1-g.t/g.max;ctx.strokeStyle='rgba(240,248,255,.6)';ctx.lineWidth=2;
    for(let i=0;i<18;i++){const y=(i*53)%H,x0=((time*900*(g.dx>0?1:-1)+i*211)%(W+300)+W+300)%(W+300)-150;ctx.globalAlpha=.2+.5*u;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0+(g.dx>0?-120:120),y+8);ctx.stroke()}ctx.globalAlpha=1}
  if(REG.id===G100.coast){S();ctx.globalCompositeOperation='source-over';const hi=g100Tide(),l=Math.ceil(g100TideLeft());ctx.font=`600 13px ${FONT}`;ctx.textAlign='center';const t=hi?`밀물 · 썰물까지 ${l}초`:`썰물 · 밀물까지 ${l}초`;
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(W/2-90,58,180,22);ctx.fillStyle=hi?'#9fd8ff':'#ffe8a0';ctx.fillText(t,W/2,74)}
  ctx.globalCompositeOperation=o}catch(e){if(window.__QA)throw e}}}
function g100DrawDark(){const L=RCACHE[G100.cave],K=L&&L.g100;if(!K||!P._s)return;S();
  if(!G100C.cv||G100C.cv.width!==W||G100C.cv.height!==H){G100C.cv=document.createElement('canvas');G100C.cv.width=Math.max(1,W);G100C.cv.height=Math.max(1,H);G100C.g=G100C.cv.getContext('2d')}
  const g=G100C.g;g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.fillStyle='rgba(4,6,14,.86)';g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
  const hole=(x,y,r)=>{const gr=g.createRadialGradient(x,y,r*.35,x,y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.283);g.fill()};
  const R0=Math.max(W,H)*G100T.lampR*(G100V.shroom>0?1.5:1);hole(P._s.x,P._s.y-20,R0);
  for(const p of K.posts){const s=W2S(p.x,p.y);if(s.x<-300||s.y<-300||s.x>W+300||s.y>H+300)continue;hole(s.x,s.y-60,G100T.postR)}
  for(const m of K.shrooms){if(time-m.at<G100T.shroomRe)continue;const s=W2S(m.x,m.y);if(s.x<-100||s.y<-100||s.x>W+100||s.y>H+100)continue;hole(s.x,s.y-10,90)}
  ctx.globalCompositeOperation='source-over';ctx.drawImage(G100C.cv,0,0,W,H);
  // 천장 빛 실 (푸른 별빛)
  ctx.globalCompositeOperation='lighter';for(const t of K.thr){const s=W2S(t.x,t.y);if(s.x<-40||s.y<-200||s.x>W+40||s.y>H+40)continue;for(let i=0;i<t.n;i++){const k=.5+.5*Math.sin(time*1.4+t.ph+i);ctx.globalAlpha=.35+.45*k;glow(s.x+i*9-t.n*4,s.y-180-i*7+Math.sin(time+i)*3,3+2*k,'#7ad8ff')}}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
for(const id of G100.all)delete TERR[id];
g100Post();
// 현상금 게시판 (bty36.js · r110과 같은 방식)
if(typeof BTY_BOARDS==='object'&&typeof v20AddProp==='function'){const M={g1_salt_camp:G100.salt,g1_coast_camp:G100.coast,g1_cave_camp:G100.cave,g1_spire_camp:G100.spire},OFF=[[150,-90],[-150,90],[120,140],[-120,-130],[200,0],[-200,0]];
  for(const id in M){if(BTY_BOARDS[id])continue;const reg=M[id],mobs=(REGIONS[reg].mobs||[]).filter(k=>TYPES[k]);if(!mobs.length)continue;BTY_BOARDS[id]={reg,mobs};if(!v20Town(id))continue;
    let d=null;for(const o of OFF){d=v20AddProp(id,o[0],o[1],{k:'bboard',pv:0,use:'bty:'+id});if(d)break}if(d)BTY_PROP[id]=d}
  v20SyncDecor()}
window.__g100x={G100,G100V,G100T,g100S,g100Clean,g100Tide,g100OnMirror,g100Fix,g100Post};
