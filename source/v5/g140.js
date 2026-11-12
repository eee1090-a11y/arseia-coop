/* ---------- v58 후보 · 별 너머 새 땅 둘 (움직임 · 그림 · 땅마다 놀이 · 별 조각 · 저장) · 자료는 g140d.js · 별의 탑은 g140t.js ----------
   사용자 2026-11-08 「고레벨 컨텐츠 다음배치 만들고」 → 제안 다-1 「추천대로 다섯 가지 모두」.
   · 들어가기: 지옥 · 봉인 규칙(world3.js) + 140레벨 + 「식은 별의 심장」을 한 번 쓰러뜨림(P.g100.bk.b_cr1_heart · 같이 하기는 방장 기준).
     길: 구름 돌기둥 숲, 별이 떨어진 큰 구덩이 곁 「하늘 계단」(F) ↔ 구름 닻 정박지 곁 「내려가는 계단」. 한 번 가 본 마을은 짝문으로도.
   · 부서진 하늘섬: 마을 밖에서 9~14초마다 별똥 셋(금빛 고리 1.6초 → 떨어짐 · 맞으면 내 최대 생명력 8%). 떨어진 자리에 가끔(20%) 별 조각.
   · 별바다 가장자리: 푸른 별빛 돌 여덟. 곁에 가면 60초 동안 「별빛 깃듦」 피해 +10%(덧셈 · V20.dmgAdd). 돌마다 180초 쉼.
   · 별 조각(다-4 별빛 강화에 씀): 두 땅 · 두 던전 · 별의 탑에서. 보통 3%(정예 9%) · 준보스 1 · 보스 3.
   · 저장: P.g100.g140 {sh 가진 조각, got 모은 조각, k 가 본 땅, bk 쓰러뜨린 주인, gs 별빛 돌, pk 주운 조각, tw 탑 기록(g140t.js)} — g100.js g100Clean이 칸을 지킴, 없으면 기본값. */
const G140T={mtGap:[9,14],mtWarn:1.6,mtR:80,mtPct:.08,mtPick:.2,pickR:46,pickLife:30,gsN:8,gsR:70,gsT:60,gsRe:180,gsAdd:.1,shCh:.03,shEl:3,shMini:1,shBoss:3,title:'하늘 계단을 오른 자'};
const G140V={mt:{t:6,falls:[]},picks:[],gate:{},said:{},qaLock:0,lastReg:null};
window.__g140=G140V;
const g140Int=(v,mx)=>Number.isFinite(+v)?Math.max(0,Math.min(mx||1e9,Math.floor(+v))):0;
function g140Clean(raw){const o=g100Obj(raw)?Object.assign({},raw):{};for(const k of ['k','bk','tw','pt','wb'])o[k]=g100Obj(o[k])?Object.assign({},o[k]):{};
  for(const k of ['sh','got','gs','pk'])o[k]=g140Int(o[k]);return o}
const g140S=()=>{const s=g100S();if(!g100Obj(s.g140)||!g100Obj(s.g140.k)||!g100Obj(s.g140.tw)||!g100Obj(s.g140.bk))s.g140=g140Clean(s.g140);return s.g140};
const g140Open=()=>!!(P&&g100S().bk.b_cr1_heart)||!!(window.__QA&&!G140V.qaLock);/* #qa: 옛 시험은 열린 채로 · 잠금 시험은 qaLock */
const g140Land=()=>!DG&&!IN&&!!REG&&G140.ids.includes(REG.id);
const g140DgIn=()=>!!(DG&&DG.d&&(G140.dgs.includes(DG.d.id)||DG.d.id===G140.tower));
const g140Once=(k,t,c)=>{if(G140V.said[k])return;G140V.said[k]=1;msg(t,c||'#fff6c8')};
function g140ShAdd(n,x,y){if(!P||!(n>0))return;const s=g140S();s.sh=g140Int(s.sh+n);s.got=g140Int(s.got+n);
  if(x!=null){ftext(x,y-34,`별 조각 +${n}`,'#fff6a0',true,70);rings.push({x,y,r:6,max:56,life:.5,col:'#fff6a0'})}}
if(typeof AG26==='object')for(const k of ['sk2_ram','sk2_giant','gr2_moth','gr2_golem'])AG26.P.add(k);/* 비선공 섞기 (aggro26.js) */
queueMicrotask(()=>{try{if(typeof BGM_REG==='object')Object.assign(BGM_REG,{[G140.sky]:'field',[G140.grave]:'dark'})}catch(_){}});
if(typeof G42_GREG==='object')Object.assign(G42_GREG,{[G140.sky]:{herb:.4,ore:.4,cry:.2},[G140.grave]:{herb:.1,ore:.4,cry:.5}});

/* ===== 1) 들어가기 · 길 ===== */
{const _b=w3BlockReg;w3BlockReg=function(id){const m=_b.apply(this,arguments);if(m||!G140.ids.includes(id)||W3.qaOpen)return m;
  if(P.lvl<G140.minLv)return `${G140.minLv}레벨부터 들어갈 수 있는 땅입니다 (지금 Lv${P.lvl}) · 몬스터 159~172레벨`;
  if(!g140Open())return '하늘 계단이 아직 잠들어 있습니다 · 구름 돌기둥 숲 큰 구덩이의 「식은 별의 심장」을 한 번 쓰러뜨려야 열립니다';return ''}}
// 계단(지도 끝 포탈이 아닌 길): 길 찾기 · 의뢰 길잡이가 계단을 가리키게
const g140Nb=c=>{const E=REGIONS[c]&&REGIONS[c].edges,o=E?Object.values(E):[];if(c===G100.spire)o.push(G140.sky);if(c===G140.sky)o.push(G100.spire);return o};
{const _rh=regHop;regHop=function(a,b){const r=_rh.apply(this,arguments);if(r||a===b||!(G140.ids.includes(a)||G140.ids.includes(b)))return r;
  const prev={[a]:null},Q=[a];while(Q.length){const c=Q.shift();for(const n of g140Nb(c)){if(n in prev)continue;prev[n]=c;if(n===b){let x=n;while(prev[x]!==a)x=prev[x];return x}Q.push(n)}}return null}}
{const _qr=qRoute;qRoute=function(tg){try{if(tg&&!DG&&!IN&&REG){const t=typeof wxTg==='function'?wxTg(tg):tg,to=(t&&t.reg)||'home';
  if(to!==REG.id){const h=regHop(REG.id,to);if(REG.id===G100.spire&&h===G140.sky&&G140V.gate.up)return G140V.gate.up.d;if(REG.id===G140.sky&&h===G100.spire&&G140V.gate.down)return G140V.gate.down.d}}}catch(e){if(window.__QA)throw e}
  return _qr.apply(this,arguments)}}
// 계단 그림 (한 번 구워 둔다 · v=0 오르는 돌계단 · v=1 구름 계단)
twDef('g140stair',220,230,110,190,(g,v)=>{Kit.shadow(g,0,6,96,26,1);const c=v?['#e8ecf4','#c8d0e0']:['#9a9488','#7a7468'];
  for(let i=0;i<7;i++)twBox(g,0,26-i*9,0,78-i*4,10,6+i*9,i%2?c[1]:c[0],{tex:'stone',texA:v?.15:.5});
  for(const x of [-34,34])twBox(g,x,-38,58,8,8,70,v?'#d8e0f0':'#6a6458',{tex:'stone',texA:.4});twBox(g,0,-38,126,78,10,8,v?'#fff6d0':'#8a8478',{tex:'stone',texA:.3});
  const a=isoP(-28,-38,64),b=isoP(28,-38,64),cc=isoP(28,-38,124),d=isoP(-28,-38,124);twFill(g,[a,b,cc,d],v?'rgba(200,220,255,.55)':'rgba(255,246,190,.5)')});
twDef('g140tower',240,360,120,320,(g)=>{Kit.shadow(g,0,6,110,30,1);
  twBox(g,0,0,0,96,80,210,'#4a4a6a',{tex:'stone',texA:.6});twBox(g,0,0,210,108,90,14,'#5a5a7a',{tex:'stone',texA:.5});twBox(g,0,0,224,70,60,60,'#3a3a5a',{tex:'stone',texA:.5});
  const a=isoP(-20,40,0),b=isoP(20,40,0),c=isoP(20,40,70),d=isoP(-20,40,70);twFill(g,[a,b,c,d],'#0e0c1e');
  const m={x:(a.x+c.x)/2,y:(a.y+c.y)/2};g.strokeStyle='#c8c0e8';g.lineWidth=1.6;g.beginPath();g.ellipse(m.x,m.y,10,22,0,0,6.283);g.stroke();
  for(let i=0;i<4;i++){const p=isoP(-30+i*20,40,120+(i%2)*30);g.fillStyle='#e8e0ff';g.fillRect(p.x-2,p.y-6,4,8)}
  const t=isoP(0,0,300);g.fillStyle='#fff6d0';g.beginPath();for(let i=0;i<10;i++){const r=i%2?5:13,an=i/10*6.283-Math.PI/2;g.lineTo(t.x+Math.cos(an)*r,t.y+Math.sin(an)*r)}g.closePath();g.fill()});
const G140G={
  up:{id:'g140up',reg:G100.spire,k:'g140stair',n:'하늘 계단',h:200,dot:'#fff6a0',
    lab:()=>({t:'하늘 계단 · 부서진 하늘섬',s:P.lvl<G140.minLv?`${G140.minLv}레벨부터`:g140Open()?'지옥 · 몬스터 159~':'「식은 별의 심장」을 쓰러뜨리면 열림',col:'#fff6a0'}),
    live:()=>({label:g140Open()?'하늘 계단 오르기 · 부서진 하늘섬':'하늘 계단 (잠김)',col:'#fff6a0',q:0}),go:()=>g140Stair(G140.sky)},
  down:{id:'g140down',reg:G140.sky,k:'g140stair',n:'내려가는 계단',h:200,dot:'#cfe8ff',
    lab:()=>({t:'내려가는 계단 · 구름 돌기둥 숲',s:'',col:'#cfe8ff'}),live:()=>({label:'구름 계단 내려가기 · 구름 돌기둥 숲',col:'#cfe8ff',q:0}),go:()=>g140Stair(G100.spire)}};
/* v60: 세계 지도에 하늘 계단 길 (구름 돌기둥 숲 ↔ 부서진 하늘섬). 걸어서 이어진 맵 끝 길이 없어 길이 안 보였음 */
WMAPLINK22.push({a:G100.spire,b:G140.sky,t:'하늘 계단',col:'#fff6a0',open:()=>g140Open(),
  lab:o=>o?'⇅ 하늘 계단':'⇅ 하늘 계단 (잠김)',leg:ph=>ph?`= 구름 돌기둥 숲 ↔ 부서진 하늘섬 · 「식은 별의 심장」을 쓰러뜨리면 열림${g140Open()?' (지금 열림)':' (지금 잠김)'}`:`= 구름 돌기둥 숲 큰 구덩이 곁 계단 ↔ 부서진 하늘섬 · ${G140.minLv}레벨부터 · 「식은 별의 심장」을 한 번 쓰러뜨리면 열림${g140Open()?' (지금 열림)':' (지금 잠김)'} · 별바다 가장자리는 하늘섬 서쪽`});
function g140Arr(to){const g=to===G140.sky?G140V.gate.down:G140V.gate.up;return g&&g.d?{x:g.d.x,y:g.d.y+90}:null}
function g140Stair(to){const a=g140Arr(to);if(!a)return false;
  if(to===G140.sky&&!NET.guest&&!g140Open()){w3Deny('하늘 계단이 아직 잠들어 있습니다 · 큰 구덩이의 「식은 별의 심장」을 한 번 쓰러뜨려야 열립니다');return false}
  if(w3Hell(to)&&!NET.guest){const m=w3BlockReg(to);if(m){w3Deny(m);return false}}
  if(NET.guest){netSend({t:'req',to:NET.hostId,a:'reg',id:to,x:a.x,y:a.y});msg('파티와 함께 넘어가는 중입니다','#9fe0ff');return true}
  switchRegion(to,a.x,a.y);return true}
function g140Gates(){
  {const L=RCACHE[G100.spire],c=L&&L.caves.find(c=>c.cave&&c.cave.id===G100.crater);if(c&&!G140V.gate.up){const p=dm21FindSpot(G100.spire,{x:c.x,y:c.y},-.23,{r0:380,r1:900})||{x:c.x+G140.stairDx+150,y:c.y+G140.stairDy};
    r110Clear(L,d=>d.k==='g100'&&Math.hypot(d.x-p.x,d.y-p.y)<340);dm21AddGate(G140G.up,p.x,p.y);G140V.gate.up=G140G.up}}
  {const L=RCACHE[G140.sky],T=L&&L.town;if(T&&!G140V.gate.down){const p=dm21FindSpot(G140.sky,T,Math.PI*.25,{r0:SAFE+60,r1:SAFE+600})||{x:T.x+SAFE+120,y:T.y+120};
    G140G.down.d=null;dm21AddGate(G140G.down,p.x,p.y);G140V.gate.down=G140G.down;G140G.down.d.v=1;G140G.down.d.pv=1}}}

// 큰 구덩이 안: 식은 별의 심장을 쓰러뜨리면 보스 자리에 하늘섬으로 가는 빛나는 문 (제안서 「구덩이 안쪽에 열리는 빛나는 문」)
function g140DoorTick(){if(!DG||!DG.d||DG.d.id!==G100.crater){return}if(DG.bossDead&&!DG.g140door&&DG.boss){const b=DG.boss;let x=b.x,y=b.y-110;if(!dgFree(x,y,14)){x=b.x;y=b.y}DG.g140door={x,y}}
  const d=DG.g140door;if(d&&!act&&!P.dead&&Math.hypot(P.x-d.x,P.y-d.y)<80)act='g140_door'}
{const _tl=twActLabel;twActLabel=function(a){if(a==='g140_door')return P.lvl<G140.minLv?`빛나는 문 · ${G140.minLv}레벨부터`:'빛나는 문 · 부서진 하늘섬으로 (F)';return _tl.apply(this,arguments)}}
{const _da=doAct;doAct=function(){if(act==='g140_door'){g140Stair(G140.sky);return}return _da.apply(this,arguments)}}
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);try{const d=DG&&DG.g140door;if(!d)return;G();const o=ctx.globalCompositeOperation;ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=.55;ctx.strokeStyle='#fff6a0';ctx.lineWidth=4;ctx.beginPath();ctx.arc(d.x,d.y,40+Math.sin(time*3)*4,0,6.283);ctx.stroke();ctx.globalAlpha=.5+.2*Math.sin(time*2);glow(d.x,d.y-30,60,'#fff6c8');
  ctx.globalAlpha=1;ctx.globalCompositeOperation=o;S();const s=W2S(d.x,d.y);ctx.font=`700 13px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('빛나는 문 · 부서진 하늘섬',s.x,s.y-70);ctx.fillStyle='#fff6a0';ctx.fillText('빛나는 문 · 부서진 하늘섬',s.x,s.y-70)}catch(e){if(window.__QA)throw e}}}
/* ===== 2) 지도 다듬기: 별빛 돌 ===== */
function g140Post(){const L=RCACHE[G140.grave];if(!L||L.g140)return;const s=mulberry(5207),T=L.town,st=[];
  for(let i=0;i<500&&st.length<G140T.gsN;i++){const x=600+s()*4800,y=600+s()*4800;if(T&&Math.hypot(x-T.x,y-T.y)<SAFE+300)continue;if(!r110Free(L,x,y,170))continue;
    if(st.some(q=>Math.hypot(q.x-x,q.y-y)<900))continue;if(L.caves.some(c=>Math.hypot(c.x-x,c.y-y)<300)||L.edges.some(e=>Math.hypot(e.x-x,e.y-y)<300))continue;
    st.push(g100D(x,y,'g140stone',{i:st.length,at:-999,light:90}))}
  r110Clear(L,d=>st.some(q=>Math.hypot(d.x-q.x,d.y-q.y)<120));L.decor.push(...st);for(const d of st)L.lights.push(d);L.g140={st}}
const g140Spr={stone:()=>SC.get('g140/stone',70,100,35,92,g=>{g.translate(35,92);Kit.solid(g,q=>{q.moveTo(-18,0);q.lineTo(-18,-56);q.quadraticCurveTo(0,-80,18,-56);q.lineTo(18,0);q.closePath()},-18,-80,18,0,'#3a3450',{tex:'stone',texA:.7,rim:'rgba(160,210,255,.7)'});
  g.fillStyle='#9fd8ff';g.beginPath();for(let i=0;i<10;i++){const r=i%2?3:7,a=i/10*6.283-Math.PI/2;g.lineTo(Math.cos(a)*r,-46+Math.sin(a)*r)}g.closePath();g.fill();
  g.fillStyle='rgba(20,16,30,.6)';g.beginPath();g.ellipse(0,2,22,6,0,0,6.283);g.fill()},{scale:2})};
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(!(d&&d.k==='g100'&&d.t==='g140stone'))return _rd.apply(this,arguments);const s=d._s;if(!s)return true;
  const dim=time-d.at<G140T.gsRe;if(dim)ctx.globalAlpha=.4;const sp=g140Spr.stone();if(sp)SC.draw(ctx,sp,s.x,s.y);ctx.globalAlpha=1;
  if(!dim){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+.15*Math.sin(time*2.4+d.x);glow(s.x,s.y-46,40,'#7ac8ff');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  if(dist(P,d)<300)r110Name(s,dim?`별빛 돌 · 쉬는 중 ${Math.ceil(G140T.gsRe-(time-d.at))}초`:'별빛 돌 (가까이 가면 별빛이 깃듦)',dim?'#a8a0c0':'#9fd8ff',40);return true}}

// 하늘섬: 발밑으로 흘러가는 낮은 구름 (그림만)
const G140CL=(()=>{const r=mulberry(5211),o=[];for(let i=0;i<70;i++)o.push({x:r()*6000,y:r()*6000,k:.6+r()*.8,v:8+r()*14});return o})();
function g140DrawCloud(){const cs=W2S(P.x,P.y);ctx.fillStyle='rgba(250,252,255,.30)';
  for(const c of G140CL){const x=((c.x+time*c.v)%6200+6200)%6200-100,s=W2S(x,c.y);if(Math.abs(s.x-cs.x)>W||Math.abs(s.y-cs.y)>H)continue;
    ctx.beginPath();ctx.ellipse(x,c.y,150*c.k,46*c.k,0,0,6.283);ctx.ellipse(x+90*c.k,c.y-18*c.k,90*c.k,34*c.k,0,0,6.283);ctx.ellipse(x-80*c.k,c.y+10*c.k,80*c.k,28*c.k,0,0,6.283);ctx.fill()}}
/* ===== 3) 땅마다 놀이 ===== */
function g140SkyTick(dt){const M=G140V.mt;
  if(!P.dead&&!inSafe(P.x,P.y,10)){M.t-=dt;if(M.t<=0){M.t=rnd(...G140T.mtGap);M.n=(M.n|0)+1;g140Once('mt','하늘에서 별똥이 떨어집니다! 땅에 금빛 고리가 보이면 비키세요','#fff6a0');
    for(let i=0;i<3;i++){const a=R()*6.283,d=i?rnd(90,240):rnd(0,50);M.falls.push({x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d,t:G140T.mtWarn})}}}
  for(const f of M.falls){f.t-=dt;if(f.t<=0&&!f.done){f.done=1;rings.push({x:f.x,y:f.y,r:10,max:G140T.mtR+30,life:.5,col:'#fff6a0'});burst(f.x,f.y,'#fff6a0',16,140,3,20);
    if(!P.dead&&Math.hypot(P.x-f.x,P.y-f.y)<G140T.mtR+P.r)hitPlayer(maxHp()*G140T.mtPct,null);else if(R()<G140T.mtPick)G140V.picks.push({x:f.x,y:f.y,t:G140T.pickLife,reg:REG.id})}}
  M.falls=M.falls.filter(f=>f.t>-.3)}
function g140GraveTick(dt){const L=RCACHE[G140.grave],K=L&&L.g140;if(!K||P.dead)return;
  for(const m of K.st){if(time-m.at<G140T.gsRe||dist(P,m)>G140T.gsR)continue;m.at=time;P.buffs.g140_gs={t:G140T.gsT,max:G140T.gsT,n:'별빛 깃듦'};const s=g140S();s.gs=g140Int(s.gs+1);
    msg('별빛 돌의 별빛이 몸에 깃들었습니다! 60초 동안 피해 +10%','#9fd8ff');rings.push({x:m.x,y:m.y,r:10,max:150,life:.7,col:'#9fd8ff'});burst(P.x,P.y,'#9fd8ff',20,120,3,20)}}
if(typeof V20==='object'&&Array.isArray(V20.dmgAdd))V20.dmgAdd.push(()=>P&&P.buffs&&P.buffs.g140_gs&&P.buffs.g140_gs.t>0?G140T.gsAdd:0);
function g140PickTick(dt){for(const p of G140V.picks){p.t-=dt;if(p.t>0&&!p.got&&p.reg===REG.id&&!P.dead&&Math.hypot(P.x-p.x,P.y-p.y)<G140T.pickR){p.got=1;g140ShAdd(1,p.x,p.y);const s=g140S();s.pk=g140Int(s.pk+1)}}
  G140V.picks=G140V.picks.filter(p=>p.t>0&&!p.got)}
function g140Tick(dt){if(DG||IN){G140V.mt.falls=[];if(DG)g140DoorTick();return}const id=REG.id;
  if(G140V.lastReg!==id){G140V.lastReg=id;G140V.picks=G140V.picks.filter(p=>p.reg===id);if(G140.ids.includes(id)){const s=g140S();if(!s.k[id]){s.k[id]=1;save()}}}
  if(id===G140.sky)g140SkyTick(dt);else{G140V.mt.falls=[];G140V.mt.t=Math.max(G140V.mt.t,4)}
  if(id===G140.grave)g140GraveTick(dt);g140PickTick(dt)}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(!P||paused)return r;try{g140Tick(dt)}catch(e){if(window.__QA)throw e}return r}}

/* ===== 4) 떨굼 · 주인 기록 ===== */
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&e&&!e.g140sh&&(g140Land()||g140DgIn())){e.g140sh=1;const t=TYPES[e.k]||{};
  if(t.boss)g140ShAdd(G140T.shBoss,e.x,e.y);else if(t.mini)g140ShAdd(G140T.shMini,e.x,e.y);else if(R()<G140T.shCh*(e.elite?G140T.shEl:1))g140ShAdd(1,e.x,e.y);
  if(t.boss&&G140.bosses.includes(e.k)){const s=g140S(),first=!s.bk[e.k];s.bk[e.k]=Math.min(9999,(s.bk[e.k]|0)+1);if(first){msg(`${t.n}을(를) 처음 쓰러뜨렸습니다 · 별 너머 땅의 주인 ${G140.bosses.filter(k=>s.bk[k]).length}/2`,'#ffd76a');save()}}}}catch(err){if(window.__QA)throw err}return r}}

/* ===== 5) 그림: 별똥 고리 · 주울 별 조각 ===== */
{const _ddf=drawDecalsFields;drawDecalsFields=function(){_ddf.apply(this,arguments);if(DG||IN)return;try{
  if(REG.id===G140.sky)g140DrawCloud();
  if(REG.id===G140.sky)for(const f of G140V.mt.falls){if(f.done)continue;const u=1-f.t/G140T.mtWarn;ctx.globalAlpha=.2+.3*u;ctx.fillStyle='#5a4a20';ctx.beginPath();ctx.arc(f.x,f.y,G140T.mtR*(.3+.7*u),0,6.283);ctx.fill();
    ctx.globalAlpha=.85;ctx.strokeStyle='#ffe066';ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,G140T.mtR,0,6.283);ctx.stroke();ctx.globalAlpha=1}
  for(const p of G140V.picks){if(p.reg!==REG.id)continue;const k=.6+.4*Math.sin(time*5+p.x);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5*k;glow(p.x,p.y-6,22,'#fff6a0');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='#fff6c8';ctx.beginPath();for(let i=0;i<10;i++){const r=i%2?3:8,a=i/10*6.283-Math.PI/2+time;ctx.lineTo(p.x+Math.cos(a)*r,p.y-6+Math.sin(a)*r)}ctx.closePath();ctx.fill()}}catch(e){if(window.__QA)throw e}}}
// 하늘에서 떨어지는 별똥 줄기 (화면 위)
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);if(DG||IN||REG.id!==G140.sky)return;try{const F=G140V.mt.falls.filter(f=>!f.done);if(!F.length)return;G();const o=ctx.globalCompositeOperation;ctx.globalCompositeOperation='lighter';
  for(const f of F){const u=Math.max(0,1-f.t/G140T.mtWarn);if(u<.55)continue;const k=(u-.55)/.45,x=f.x+220*(1-k),y=f.y-520*(1-k);ctx.globalAlpha=.9;ctx.strokeStyle='#fff6a0';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x+60,y-150);ctx.lineTo(x,y);ctx.stroke();glow(x,y,26,'#fff6c8')}
  ctx.globalAlpha=1;ctx.globalCompositeOperation=o;S()}catch(e){if(window.__QA)throw e}}}

/* ===== 6) 마을 · 게시판 · 업적 · 칭호 ===== */
if(typeof BTY_BOARDS==='object'&&typeof v20AddProp==='function'){const M={g2_sky_camp:G140.sky,g2_grave_camp:G140.grave},OFF=[[150,-90],[-150,90],[120,140],[-120,-130],[200,0],[-200,0]];
  for(const id in M){if(BTY_BOARDS[id])continue;const reg=M[id],mobs=(REGIONS[reg].mobs||[]).filter(k=>TYPES[k]);if(!mobs.length)continue;BTY_BOARDS[id]={reg,mobs};if(!v20Town(id))continue;
    let d=null;for(const o of OFF){d=v20AddProp(id,o[0],o[1],{k:'bboard',pv:0,use:'bty:'+id});if(d)break}if(d)BTY_PROP[id]=d}
  v20SyncDecor()}
// 떠도는 강자 둘 (g100b.js 규칙 그대로 · 이름은 g100StKey = 'st_' + 지역 이름)
{const W=k=>WX_TYPES[k]||TYPES[k],mk=(id,base,o)=>{const s=W(base)||W('ec_paladin');TYPES[id]={...s,...o,boss:0,mini:0,summon:null,skills:null,reg:1,stg:1};if(!MON[TYPES[id].draw])TYPES[id].draw=TYPES[id].alt||'wolf'};
 mk('st_g2_sky','ec_maw',{n:'구름을 찢는 거인 하늘뿔',draw:'yeti',col:'#e8ecf4',eye:'#ffe066',alt:'ogre'});
 mk('st_g2_grave','ec_paladin',{n:'별을 품은 운석왕 고르',draw:'golem',col:'#3a2a2a',eye:'#ff8a4a',alt:'ogre'});
 if(typeof WX21_EL==='object'){Object.assign(WX21_EL,{st_g2_sky:'storm',st_g2_grave:'fire'});TYPES.st_g2_sky.el='storm';TYPES.st_g2_grave.el='fire'}}
// 떠도는 강자 · 틈에도 (제안서 다-1 · 몬스터 레벨은 옛 규칙 그대로 「그 땅 끝 +12 / +10」)
for(const L of [typeof G100B==='object'&&G100B.regs,typeof G100R==='object'&&G100R.regs])if(Array.isArray(L))for(const r of G140.ids)if(!L.includes(r))L.push(r);
if(typeof G42_RD==='object')for(const r of G140.ids)if(REGIONS[r]&&!G42_RD.includes(r))G42_RD.push(r);
{const _wr=g42WkRegs;g42WkRegs=function(){const rs=_wr.apply(this,arguments);try{if(P&&P.lvl>=G140.minLv&&g140Open()&&Array.isArray(rs))return rs.concat(G140.ids.filter(r=>REGIONS[r]&&!rs.includes(r)))}catch(e){if(window.__QA)throw e}return rs}}
if(typeof V20==='object'&&V20.titles)V20.titles.push({id:'g140sky',n:G140T.title,col:'#fff6a0',src:'별 너머 땅의 주인 둘 처치',have:()=>!!(P&&G140.bosses.every(k=>g140S().bk[k]))});
if(typeof G42==='object'&&Array.isArray(G42.ach)){const add=(id,n,d,need,cur,pts)=>G42.ach.push({id,n,d,need,cur,grp:'140레벨 이후',pts:pts||10});const S1=()=>g140S();
  add('g140land','별 너머 두 땅','부서진 하늘섬 · 별바다 가장자리에 모두 가 보기',2,()=>G140.ids.filter(k=>S1().k[k]).length,15);
  add('g140boss','별 너머 땅의 주인','테미르 · 녹타르를 모두 쓰러뜨리기',2,()=>G140.bosses.filter(k=>S1().bk[k]).length,25);
  add('g140sh100','별 조각 모으기','별 조각 100개 모으기(쓴 것도 셈)',100,()=>S1().got|0,15);
  add('g140gs10','별빛이 깃든 자','별빛 돌의 별빛 10번 받기',10,()=>S1().gs|0,10);
  add('g140pk10','별똥 줍기','별똥이 떨어진 자리의 별 조각 10개 줍기',10,()=>S1().pk|0,10)}
g140Post();g140Gates();
window.__g140x={G140T,G140V,G140G,g140S,g140Clean,g140Open,g140Stair,g140Arr,g140ShAdd,g140Post,g140Gates};
