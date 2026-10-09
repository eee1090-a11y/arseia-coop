/* ---------- 상점 셋 (무기상 · 방어구상 · 잡화점) · 귀환 두루마리 · 도감 ---------- */
// 마을마다 t.shops=[{type,x,y,n}]. 마을 담당(B)이 먼저 넣어 두면 그대로 쓰고, 없으면 옛 t.shop 자리를 잡화점으로 삼아 기본 노점 둘을 더 세운다.
const SHOPN={weapon:'무기상',armor:'방어구상',general:'잡화점'};
const SHOP_SLOTS={weapon:['staff'],armor:['robe'],general:['ring','amulet']};
const SHOP_OFF={weapon:[70,105],armor:[105,-10]};// t.shop에서 떨어진 자리
let actShop='general';
function ensureShops(){
  const layers=[HOME,...REG_IDS.map(id=>RCACHE[id])].filter(Boolean);
  for(const L of layers)for(const t of L.towns){
    if(Array.isArray(t.shops)&&t.shops.length)continue;
    if(!t.shop)continue;
    t.shops=[{type:'general',x:t.shop.x,y:t.shop.y,n:SHOPN.general}];
    const d0=L.decor.find(d=>d.k==='shop'&&d.town===t&&!d.shopType);if(d0){d0.shopType='general';d0.stall=1}
    for(const type of ['weapon','armor']){const o=SHOP_OFF[type],x=t.shop.x+o[0],y=t.shop.y+o[1];
      t.shops.push({type,x,y,n:SHOPN[type]});
      const d={x,y,k:'shop',s:1,v:0,town:t,light:110,shopType:type,stall:1};L.decor.push(d);L.lights.push(d);
      if(REG.id===L.id){decor.push(d);LIGHTS.push(d)}}
  }
}
ensureShops();
// 가까운 상점 (90 안) 하나
function shopAt(t){const list=t.shops&&t.shops.length?t.shops:t.shop?[{type:'general',x:t.shop.x,y:t.shop.y}]:[];let b=null,bd=90;
  for(const s of list){const d=dist(P,s);if(d<(s.r||90)&&d<bd){bd=d;b=s}}
  // 짝문·창고가 더 가까우면 그쪽이 먼저
  if(b&&(t.gate&&dist(P,t.gate)<90&&dist(P,t.gate)<bd||t.stash&&dist(P,t.stash)<75&&dist(P,t.stash)<bd))return null;return b}
function shopName(t,type){const n=(t.shops&&(t.shops.find(s=>s.type===type)||{}).n)||SHOPN[type]||'상점';return n.startsWith(t.n)?n:`${t.n} ${n}`}
// 노점 그리기 (그라디언트 없이 손으로 칠한 색)
function drawShop(d){const s=d._s,ty=d.shopType||'general';ctx.save();ctx.translate(s.x,s.y);ctx.scale(d.s,d.s);
  ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(10,8,42,11,.2,0,6.283);ctx.fill();
  const robe=ty==='weapon'?'#3a4a7a':ty==='armor'?'#3e6a3a':'#5a3a7a';
  ctx.fillStyle=robe;ctx.fillRect(-6,-28,12,18);ctx.fillStyle='#e8c09a';circ(0,-32,5.5);
  if(ty==='weapon'){ctx.fillStyle='#8a8a92';ctx.beginPath();ctx.arc(0,-34,7,Math.PI,0);ctx.fill();ctx.fillStyle='#5a3a22';ctx.fillRect(-5,-29,10,3)}
  else{ctx.fillStyle='#2a1e12';ell(0,-36,8,2.5);ctx.fillRect(-4,-43,8,7)}
  ctx.fillStyle='#6a4628';ctx.fillRect(-32,-12,64,20);ctx.fillStyle='#4a2e18';ctx.fillRect(-32,-12,64,4);ctx.fillStyle='#3a2414';ctx.fillRect(10,-8,22,16);
  if(ty==='weapon'){// 지팡이 몇 자루와 보석 머리
    const C=['#ff7a2e','#8fd8ff','#ffe066','#b9a2ff'];for(let i=0;i<4;i++){const x=-24+i*9;ctx.fillStyle='#5a3a1e';ctx.fillRect(x,-40+i%2*4,2.5,30);ctx.fillStyle=C[i];circ(x+1.2,-42+i%2*4,3.2);ctx.fillStyle='rgba(255,255,255,.7)';circ(x,-43+i%2*4,1)}
    ctx.fillStyle='#8a8a92';ctx.fillRect(14,-17,14,3);ctx.fillStyle='#c8c8d0';ctx.fillRect(14,-17,14,1)}
  else if(ty==='armor'){// 걸어 둔 로브 두 벌
    ctx.fillStyle='#3a2a1a';ctx.fillRect(-28,-44,30,2.5);
    for(const [x,c,c2] of [[-22,'#7a2a3a','#a84a5a'],[-8,'#2a4a7a','#4a6aa8']]){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x-4,-42);ctx.lineTo(x+4,-42);ctx.lineTo(x+7,-16);ctx.lineTo(x-7,-16);ctx.closePath();ctx.fill();ctx.fillStyle=c2;ctx.fillRect(x-1,-42,2,26)}
    ctx.fillStyle='#c8b070';ctx.fillRect(13,-18,15,5);ctx.fillStyle='#8a6a3a';ctx.fillRect(13,-15,15,2)}
  else{ctx.fillStyle='#d0443a';circ(-20,-15,3.5);ctx.fillStyle='#3a6ad6';circ(-11,-15,3.5);ctx.fillStyle='#e8c35a';circ(13,-15,3);ctx.fillStyle='#b9a2ff';ctx.fillRect(19,-19,3,8);
    ctx.fillStyle='#e8d8b0';ctx.fillRect(-4,-18,7,4);ctx.fillStyle='#a8885a';ctx.fillRect(-5,-18,2,4);ctx.fillRect(3,-18,2,4)}
  ctx.fillStyle='#3a2a1a';ctx.fillRect(-32,-54,3,44);ctx.fillRect(29,-54,3,44);
  const aw=ty==='weapon'?['#2a3a6a','#c8c0b0']:ty==='armor'?['#2e5a32','#d8d0b0']:['#8a2a22','#d8d0c0'];
  for(let i=0;i<6;i++){ctx.fillStyle=aw[i%2];ctx.fillRect(-36+i*12,-58,12,10)}
  const lb=SHOPN[ty]||'상점';ctx.font='700 13px '+FONT;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(lb,0,-66);ctx.fillStyle='#ffd27a';ctx.fillText(lb,0,-66);
  ctx.restore()}

/* ---------- 귀환 두루마리: 가장 가까운 마을 짝문으로 ---------- */
ICON.scroll='<path d="M6 4h10a3 3 0 0 1 3 3v11a2 2 0 0 1-2 2H8a3 3 0 0 1-3-3V7a1.5 1.5 0 0 0-3 0v1h3"/><path d="M9 9h7M9 12h7M9 15h5" stroke="#3a2a14" stroke-width="1.4" fill="none"/>';
const TP_CAST=1.5;let TPC=null;
const tpCount=()=>P.pot&&P.pot.tp>0?P.pot.tp|0:0;
function useScroll(){
  if(P.dead||paused)return;
  if(TPC)return;// 이미 펼치는 중 (멈추려면 움직인다)
  if(tpCount()<=0){msg('귀환 두루마리가 없습니다. 잡화점에서 살 수 있습니다','#a39d8f');return}
  if(!DG&&nearestTown(P.x,P.y).d<SAFE){msg('이미 마을 안에 있습니다','#a39d8f');return}
  TPC={t:0,x:P.x,y:P.y};msg('귀환 두루마리를 펼칩니다… 움직이면 끊깁니다','#9fd0ff');rings.push({x:P.x,y:P.y,r:4,max:48,life:.5,col:'#9fd0ff'})}
function tpTick(dt){potTick(dt);if(!TPC)return;
  if(P.dead){TPC=null;return}
  if(Math.hypot(P.x-TPC.x,P.y-TPC.y)>14){TPC=null;msg('움직여서 귀환이 끊겼습니다','#a39d8f');return}
  TPC.t+=dt;const k=TPC.t/TP_CAST;
  for(let i=0;i<3;i++){const a=TPC.t*7+i*2.094,r=24-k*8;parts.push({x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r,z:2,vx:-Math.cos(a)*14,vy:-Math.sin(a)*14,vz:40+k*90,life:.6,max:.6,col:i?'#9fd0ff':'#e8f4ff',sz:2+k*1.5})}
  if(R()<dt*3)rings.push({x:P.x,y:P.y,r:6,max:40+k*20,life:.45,col:'#7ab8ff'});
  if(TPC.t>=TP_CAST){TPC=null;townPortal()}}
function tpArrive(t){P.x=t.gate.x+40;P.y=t.gate.y+40;P.home=t.id;followCam()}
function townPortal(){
  if(tpCount()<=0)return false;
  const fx=(x,y)=>{burst(x,y,'#9fd0ff',36,170,4,20);rings.push({x,y,r:8,max:95,life:.6,col:'#9fd0ff'});pillars.push({x,y,w:46,life:.7,max:.7,col:'#9fd0ff'})};
  P.pot.tp=tpCount()-1;fx(P.x,P.y);
  if(DG){
    // 같이 하는 던전의 참가자는 파티를 흩뜨리지 않도록 던전 입구 방으로만 돌아간다
    if(NET.guest){const p0=tc(DG.start.cx,DG.start.cy);P.x=p0.x;P.y=p0.y;followCam();fx(P.x,P.y);msg('파티와 함께인 던전이라 입구로 돌아왔습니다','#9fd0ff');save();return true}
    leaveDungeon()}
  const t=nearestTown(P.x,P.y).t;tpArrive(t);
  if(!NET.on){projs=projs.filter(p=>p.owner==='p');warns=[]}
  for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}
  fx(P.x,P.y);flash={col:'#9fd0ff',a:.22};msg(`귀환 두루마리: ${t.n}에 도착했습니다`,'#9fd0ff');save();return true}
// 떨어진 두루마리
function drawTpLoot(l,label){
  if(label){ctx.strokeText('귀환 두루마리',0,-12);ctx.fillStyle='#bfe0ff';ctx.fillText('귀환 두루마리',0,-12);return}
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.3;glow(0,-5,15,'#7ab8ff');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='rgba(0,0,0,.35)';ell(2,1,10,3);
  ctx.fillStyle='#d8c08a';ctx.fillRect(-8,-11,16,9);ctx.fillStyle='#b89a62';ctx.fillRect(-8,-4,16,2);
  ctx.fillStyle='#8a6a3a';ell(-8,-6.5,2.4,5);ell(8,-6.5,2.4,5);ctx.fillStyle='#3a6ad6';ctx.fillRect(-1.5,-11,3,9)}

/* ---------- 도감: 유니크 · 세트 · 몬스터 ---------- */
let cxSub='items',cxFromIntro=false;
const CLSN=c=>c?`${CLASSES[c].n} 전용`:'모든 직업';
function cxOne(k,v,cls){
  if(k.startsWith('tr_')){const i=+k.slice(3),cs=cls?[cls]:Object.keys(CLASSES);return `<b style="color:#ffd76a">+${v} ${cs.map(c=>CLASSES[c].trees[i]).filter(Boolean).join('/')} 계열 마법</b>`}
  return statOne(k,v)}
function cxFixed(st,cls){return Object.entries(st).map(([k,v])=>SCALE.has(k)?`${STATN[k]} <span style="color:#ffd76a">보통의 ${v}배</span>`:cxOne(k,v,cls)).join(' · ')}
function cxUniq(u,boss){const c=boss?RAR[5].c:RAR[4].c;
  return `<div class="item cx"><div><div class="nm" style="color:${c}">${u.n} <span class="muted">${boss?'상급 유니크':'유니크'} ${SLOT[u.slot].n} · ${CLSN(u.cls)}</span></div><div class="st">${cxFixed(u.st,u.cls)}</div>${u.lore?`<div class="muted" style="font-style:italic">${u.lore}</div>`:''}</div></div>`}
function cxItems(){
  let h='<p class="muted" style="margin-top:0">「보통의 N배」는 같은 레벨 일반 장비의 기본 수치에 곱하는 배율입니다. 장비 레벨이 높을수록 수치도 커집니다.</p>';
  h+=`<h2>유니크 <span class="muted">${UNIQ.length}종 · 필드 몬스터와 상점에서 드물게</span></h2>`;for(const u of UNIQ)h+=cxUniq(u,false);
  h+=`<h2>상급 유니크 <span class="muted">${BOSSU.length}종 · 던전 보스만 떨어뜨림</span></h2>`;for(const u of BOSSU)h+=cxUniq(u,true);
  if(typeof core21Codex==='function')h+=core21Codex();// v21 빌드 핵심 장비 (builds21.js)
  h+=`<h2>세트 <span class="muted">${Object.keys(SETS).length}종 · 같은 세트를 여럿 입으면 효과가 더해집니다</span></h2>`;
  for(const sid in SETS){const S=SETS[sid],tr=CLASSES[S.cls].trees[+S.key.slice(3)];
    h+=`<div class="item cx"><div><div class="nm" style="color:${RAR[3].c}">${S.n} <span class="muted">세트 · ${CLSN(S.cls)}</span></div>`;
    h+='<div class="st">'+Object.entries(S.p).map(([sl,n])=>`<div><span class="muted">${SLOT[sl].n}</span> ${n}</div>`).join('')+'</div>';
    h+=`<div class="st muted">조각마다: 부위 기본 옵션(${Object.keys(SLOT).map(sl=>SLOT[sl].n+' '+STATN[SLOT[sl].main]).join(', ')}) 보통의 1.15배 + <b style="color:#ffd76a">+1 ${tr} 계열 마법</b> + 무작위 옵션 2개</div>`;
    h+='<div class="st">'+Object.entries(S.b).map(([c,b])=>`<div><b style="color:${RAR[3].c}">${c}개</b>: ${Object.entries(b).map(([k,v])=>cxOne(k,v,S.cls)).join(', ')}</div>`).join('')+'</div></div></div>'}
  return h}
const SKN={slam:'땅 내려찍기',charge:'돌진',volley:'탄막 발사',summon:'부하 부르기'};
function monInfo(k){const t=TYPES[k],wh=[];let lv=99;const add=(s,l)=>{wh.push(s);lv=Math.min(lv,l)};
  if(FIELD_TYPES.includes(k)&&!t.reg)add(`${REGIONS.home.n} 들판 (레벨 ${t.min}부터)`,t.min);
  for(const d of DUNGEONS){if(d.mobs.includes(k))add(`던전 ${d.n}`,d.lvl);if(d.minis.includes(k))add(`던전 ${d.n}의 준보스`,d.lvl+1);if(d.boss===k)add(`던전 ${d.n}의 마지막 보스`,d.lvl+2)}
  for(const id of REG_IDS){const D=REGIONS[id];if(D.mobs&&D.mobs.includes(k))add(`${D.n} (레벨 ${t.min}부터)`,t.min);
    if(D.boss===k){const L0=RCACHE[id],dd=L0&&L0.lair?Math.hypot(L0.lair.x-L0.town.x,L0.lair.y-L0.town.y):SAFE;add(`${D.n} 깊은 곳의 둥지`,Math.floor(D.base+Math.max(0,dd-SAFE)/360)+2)}}
  for(const o in TYPES)if(TYPES[o].summon===k&&(TYPES[o].boss||TYPES[o].mini))wh.push(`${TYPES[o].n}이(가) 불러냄`);
  const tr=[];if(t.boss)tr.push('<b style="color:#ff8a3a">보스</b>');else if(t.mini)tr.push(`<b style="color:#ffb07a">${t.reg?'지역 우두머리':'준보스'}</b>`);
  tr.push(t.ranged?'원거리 공격':'근접 공격');if(t.undead)tr.push('<span style="color:#d8d0ff">언데드 · 신성과 빛 피해 두 배</span>');
  if(t.spd>=150)tr.push('매우 빠름');else if(t.spd<=75)tr.push('느림');
  for(const s of t.skills||[])tr.push(s==='summon'&&t.summon&&TYPES[t.summon]?`${SKN[s]}(${TYPES[t.summon].n})`:SKN[s]||s);
  return{t,where:wh,lv:lv===99?(t.min||1):lv,traits:tr}}
function cxGroups(){const G=[],seen=new Set(),push=(n,ks)=>{ks=ks.filter(k=>TYPES[k]&&!seen.has(k));ks.forEach(k=>seen.add(k));if(ks.length)G.push([n,ks])};
  push(`${REGIONS.home.n} 들판`,FIELD_TYPES.filter(k=>!TYPES[k].reg).sort((a,b)=>TYPES[a].min-TYPES[b].min));
  for(const d of DUNGEONS)push(`던전 · ${d.n} (Lv${d.lvl})`,[...d.minis,d.boss]);
  for(const id of REG_IDS){const D=REGIONS[id];push(`${D.n} (Lv${D.base}~)`,[...(D.mobs||[]),D.boss])}
  push('그 밖의 몬스터',Object.keys(TYPES));return G}
function cxMons(){let h='<p class="muted" style="margin-top:0">레벨은 보통 난이도 기준입니다. 악몽은 +20, 지옥은 +40. 이름 앞 그림은 실제 모습입니다.</p>',n=0;
  for(const [g,ks] of cxGroups()){h+=`<h2>${g}</h2>`;
    for(const k of ks){const m=monInfo(k);n++;
      h+=`<div class="item cx cxm"><canvas class="cxpic" data-mon="${k}" width="128" height="128" aria-hidden="true"></canvas><div><div class="nm" style="color:${m.t.boss?'#ff8a3a':m.t.mini?'#ffb07a':'#efe2c0'}">${m.t.n} <span class="muted">레벨 ${m.lv}</span></div><div class="st">${m.traits.join(' · ')}</div><div class="st muted">나오는 곳: ${m.where.join(', ')||'알 수 없음'}</div></div></div>`}}
  return `<p class="muted">몬스터 ${n}종</p>`+h}
function codexHtml(){
  let h=`<div class="treetabs" role="tablist"><button type="button" role="tab" data-cx="items" aria-selected="${cxSub==='items'}">유니크 · 세트</button><button type="button" role="tab" data-cx="mons" aria-selected="${cxSub==='mons'}">몬스터</button></div>`;
  return h+(cxSub==='items'?cxItems():cxMons())}
// 열 때 한 번만 그린다
function codexDraw(){for(const cv of pbody.querySelectorAll('canvas[data-mon]')){const k=cv.dataset.mon,t=TYPES[k];if(!t)continue;const g=cv.getContext('2d');g.clearRect(0,0,128,128);
  const sc=t.sc||1,H=(MON_H[t.draw]||40)*sc,kk=Math.min(1.6,92/H);
  const e={k,x:0,y:0,fx:1,anim:1,lunge:0,hurt:0,freezeT:0,stunT:0,slowT:0,sc:t.sc,boss:t.boss||t.mini?1:0,cast:0,dash:0};
  try{g.save();g.scale(1,1);drawMon(g,e,64,112,{t:0,mv:0,noHover:1,k:kk});g.restore()}catch(_){g.restore()}}}
function codexClick(b){if(b.dataset.cx){cxSub=b.dataset.cx;pbody.scrollTop=0;pbody.parentElement.scrollTop=0;renderPanel();return true}return false}
function openCodex(fromIntro){cxFromIntro=!!fromIntro;if(fromIntro)$('#intro').hidden=true;pbody.parentElement.scrollTop=0;openPanel('codex');pbody.parentElement.scrollTop=0}
function codexBack(){if(cxFromIntro){cxFromIntro=false;$('#intro').hidden=false;introButtons(introButtons.last)}}

/* ---------- 물약 등급: 정해진 양을 3초에 걸쳐 회복 · 생명력/마나 따로 재사용 대기 ---------- */
// P.pot.hp/mp는 예전처럼 '보통' 등급 개수(옛 저장·옛 버전과 호환). 다른 등급은 P.pot.ht/mt[등급] (없으면 0).
const POT_T=[
  {n:'작은',hp:50,mp:30,lv:1,pr:25},
  {n:'보통',hp:120,mp:70,lv:5,pr:60},
  {n:'큰',hp:240,mp:140,lv:12,pr:150},
  {n:'고급',hp:450,mp:260,lv:24,pr:360},
  {n:'최상급',hp:800,mp:450,lv:36,pr:800}];
const POT_DEF=1,POT_PCT=.03,POT_DUR=3,POT_CD={hp:9,mp:7},POTN={hp:'생명력 물약',mp:'마나 물약'};
const potName=(k,T)=>`${POT_T[T].n} ${POTN[k]}`;
function potN(k,T){const p=P.pot||{};if(T===POT_DEF)return p[k]>0?p[k]|0:0;const a=p[k[0]+'t'];return Array.isArray(a)&&a[T]>0?a[T]|0:0}
function potSet(k,T,n){n=Math.max(0,n|0);if(T===POT_DEF){P.pot[k]=n;return}let a=P.pot[k[0]+'t'];if(!Array.isArray(a))a=P.pot[k[0]+'t']=[0,0,0,0,0];a[T]=n}
const potAdd=(k,T,n)=>potSet(k,T,potN(k,T)+n);
function potTotal(k){let n=0;for(let T=0;T<POT_T.length;T++)n+=potN(k,T);return n}
function potBest(k){for(let T=POT_T.length-1;T>=0;T--)if(potN(k,T)>0)return T;return -1}
const potAmt=(k,T)=>Math.round(POT_T[T][k]+(k==='hp'?maxHp():maxMp())*POT_PCT);
const potPriceT=(k,T)=>Math.round(POT_T[T].pr*(k==='mp'?.8:1));
const potOpen=(t,T)=>POT_T[T].lv<=t.base+4+DIFF[P.diff].add;// 마을(지역) 레벨로 등급이 열린다
const potCdLeft=k=>k==='hp'?Math.max(0,P.potCd||0):Math.max(0,P.potCdM||0);
function potDropTier(L){let T=0;for(let i=0;i<POT_T.length;i++)if(POT_T[i].lv<=L)T=i;if(T>0&&R()<.35)T--;return T}
let potWarnT=-9;
function drinkPotion(k){
  if(P.dead||paused)return false;
  const T=potBest(k);if(T<0){msg(k==='hp'?'생명력 물약이 없습니다':'마나 물약이 없습니다','#a39d8f');return false}
  const cd=potCdLeft(k);if(cd>0){if(time-potWarnT>.8){potWarnT=time;msg(`${POTN[k]}: ${cd.toFixed(1)}초 뒤에 다시 마실 수 있습니다`,'#a39d8f')}return false}
  potAdd(k,T,-1);if(k==='hp')P.potCd=POT_CD.hp;else P.potCdM=POT_CD.mp;
  const amt=potAmt(k,T);(P.potHot||(P.potHot={}))[k]={t:POT_DUR,rate:amt/POT_DUR,n:POT_T[T].n};
  ftext(P.x,P.y,`${potName(k,T)} +${amt}`,k==='hp'?'#ff9a8a':'#8fb0ff');rise(P.x,P.y,k==='hp'?'#ff6a5a':'#6a9aff');return true}
function potTick(dt){P.potCdM=Math.max(0,(P.potCdM||0)-dt);const H=P.potHot;if(!H)return;
  if(P.dead){P.potHot=null;return}
  for(const k in H){const h=H[k],u=Math.min(dt,h.t);h.t-=dt;
    if(k==='hp')P.hp=Math.min(maxHp(),P.hp+h.rate*u);else P.mp=Math.min(maxMp(),P.mp+h.rate*u);
    if(R()<.3)rise(P.x+rnd(-10,10),P.y+rnd(-10,10),k==='hp'?'#ff7a6a':'#7aa0ff');if(h.t<=0)delete H[k]}}
function potTip(k){return `${POTN[k]} (${k==='hp'?'Q':'E'}): 가진 것 중 가장 좋은 등급을 마십니다. ${POT_DUR}초에 걸쳐 회복 · 재사용 대기 ${POT_CD[k]}초\n`+POT_T.map((p,T)=>`${p.n}: ${potN(k,T)}개`).join(' · ')}
function potCounts(k){return POT_T.map((p,T)=>potN(k,T)?`${p.n} ${potN(k,T)}`:'').filter(Boolean).join(' · ')||'없음'}
