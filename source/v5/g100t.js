/* ---------- v57 후보 · 2차 묶음 첫째: 가-4 강자의 증표 · 가-3 틈 · 나-8 100~140 업적 ----------
   사용자 2026-11-07 「내 캐릭터 레벨은 130 이상이라고 하더라도 더 강한 지역의 몬스터들을 잡을 기회를 줘야」 → 제안 「모두 추천대로」.
   · 가-4 강자의 증표: 100레벨부터 나보다 높은 몬스터를 잡으면 가끔(2% + 1레벨 높을 때마다 0.4%, 최대 10% · 정예 2.5배) 증표 하나.
     준보스 1 · 보스 2 · 떠도는 강자 5 · 틈의 수호자 3은 꼭. 같이 하기는 각자 화면(rewardKill).
     바꾸기: 성장(G) 「강자」 칸, 마을 안에서만(증표 상인 바렌 이야기와 같음).
       재의 결정 10 ← 4 · 룬석 ← 8 · 희귀 이상 장비 ← 12 · 유니크 장비 ← 30 · 칭호 「강자 사냥꾼」 ← 40(한 번).
     (탈것 색은 3차 묶음 나-6 말 훈련과 함께)
   · 가-3 틈: 실제 시각 10분마다 100~140 땅 여섯(재가 내리는 고원 · 불 꺼진 왕도 · 유리얼음 호수 · 구름 첨봉 · 대강 밀림 · 오로라 빙관)에서 땅마다 반쯤 틈이 열린다(지옥에서만 · 누구나 같은 곳).
     틈 앞에서 F → 둘레 520 싸움터. 정예 무리 세 번(5 · 6 · 7마리) + 「틈의 수호자」(정예 생명력 ×4 · 크기 1.4). 몬스터 레벨 = 그 땅 끝 +10, 그보다 내 레벨 +5(최대 150)가 높으면 그것.
     5분 안에 다 잡으면 상자: 희귀 이상 장비 하나 · 재의 결정 3 · 증표 3(수호자) · 반쯤 룬석. 싸움터 밖(1.5배)으로 나가거나 쓰러지거나 시간이 지나면 실패.
     10분 칸마다 땅마다 캐릭터당 한 번. 같이 하기: 방장(혼자면 나)이 열고 몬스터를 부름, 보상은 각자.
   · 나-8 업적 묶음 「100레벨 이후」(g42a.js 업적 점수에 더함): 새 땅 넷 가 보기 · 새 땅 던전 주인 넷 · 식은 별의 심장 · 떠도는 강자 1 / 10 · 틈 1 / 20 ·
     증표 50 모으기 · 밀물에 잠긴 모래밭에서 버티기(밀물 동안 바다 쪽에서 30초) · 단계 상자 여덟 · 3차 숙련 특성 일곱.
   · 저장: P.g100.tok(가진 증표) · P.g100.tk {got 모은 수, ttl 칭호, tide 밀물 버틴 초} · P.g100.rf(깬 틈 수) · P.g100.d.rf {땅: 깬 칸 번호} · P.g100.k {땅: 1}(가 본 새 땅).
     모두 g100.js g100Clean이 고침(없으면 기본값). */
const G100R={tokCh:.02,tokPer:.004,tokMax:.10,tokEl:2.5,tokMini:1,tokBoss:2,tokSt:5,tokGd:3,
  slot:600,ch:.5,lvMe:5,lvMax:150,time:300,R:520,out:1.5,waves:[5,6,7],add:10,gdHp:4,gdSc:1.4,
  regs:['plateau','capital','r110_lake','r110_peak','r110_jungle','r110_aurora'],
  shop:[{k:'ash',n:'재의 결정 10개',c:4},{k:'rune',n:'룬석 하나',c:8},{k:'rare',n:'희귀 이상 장비 하나',c:12},{k:'uniq',n:'유니크 장비 하나',c:30},{k:'title',n:'칭호 「강자 사냥꾼」',c:40,once:1}],
  title:'강자 사냥꾼'};
const G100RV={rift:null,said:{}};
const g100Tk=()=>{const s=g100S();if(!g100Obj(s.tk))s.tk={};return s.tk};
const g100TokAdd=(n,x,y)=>{if(!P||!(n>0))return;const s=g100S(),t=g100Tk();s.tok=g100Int(s.tok+n);t.got=g100Int((t.got|0)+n);
  if(x!=null){ftext(x,y-30,`강자의 증표 +${n}`,'#ffd76a',true,70);rings.push({x,y,r:6,max:60,life:.5,col:'#ffd76a'})}};
/* ===== 가-4 증표 떨굼 ===== */
function g100TokRoll(e){if(!P||!e||P.lvl<100)return 0;const T=TYPES[e.k]||{};
  if(e.slot&&e.stg&&String(e.k).startsWith('st_'))return G100R.tokSt;if(e.g100gd)return G100R.tokGd;
  const d=(e.lvl|0)-P.lvl;if(d<=0)return 0;if(T.boss||e.boss)return G100R.tokBoss;if(T.mini||e.mini)return G100R.tokMini;
  const p=Math.min(G100R.tokMax,G100R.tokCh+G100R.tokPer*d)*(e.elite?G100R.tokEl:1);return R()<p?1:0}
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&e&&!e.g100tok){e.g100tok=1;const n=g100TokRoll(e);if(n)g100TokAdd(n,e.x,e.y)}}catch(err){if(window.__QA)throw err}return r}}
const g100InTown=()=>!DG&&!IN&&!!P&&inSafe(P.x,P.y);
function g100ShopBuy(k){const it0=G100R.shop.find(o=>o.k===k);if(!P||!it0)return false;const s=g100S(),t=g100Tk();
  if(!g100InTown()){msg('증표는 마을 안에서만 바꿀 수 있습니다','#ff8a5a');return false}if(it0.once&&t.ttl){msg('이미 받았습니다','#ff8a5a');return false}
  if((s.tok|0)<it0.c){msg(`강자의 증표가 모자랍니다 (${s.tok|0}/${it0.c})`,'#ff8a5a');return false}
  const give=it=>{if(!it)return;if(P.bag.length<BAG_MAX)P.bag.push(it);else loot.push({x:P.x+rnd(-16,16),y:P.y+rnd(-16,16),kind:'item',item:it,t:0,keep:1});return itemName(it)};
  let got='';
  if(k==='ash'){if(typeof ashGain!=='function')return false;ashGain(10,P.x,P.y);got='재의 결정 10개'}
  else if(k==='rune'){if(typeof e22RuneRoll!=='function')return false;e22RuneGain(e22RuneRoll(6),1,P.x,P.y);got='룬석'}
  else if(k==='rare'){let it=null;for(let i=0;i<80&&!(it&&it.rar>=2);i++)it=makeItem(Math.min(P.lvl,MAXLV),true);if(it&&it.rar<2)it.rar=2;got=give(it)}
  else if(k==='uniq'){let it=makeItem(Math.min(P.lvl,MAXLV),true,P.cls,'uniq');if(!it||it.rar<4){for(let i=0;i<80&&!(it&&it.rar>=2);i++)it=makeItem(Math.min(P.lvl,MAXLV),true)}got=give(it)}
  else if(k==='title'){t.ttl=1;got=`칭호 「${G100R.title}」`}
  s.tok=g100Int(s.tok-it0.c);burst(P.x,P.y,'#ffd76a',30,160,3,20);msg(`강자의 증표 ${it0.c}개 → ${got}`,'#ffd76a');save();return true}
V20A.g100tok=k=>{g100ShopBuy(String(k))};
if(typeof V20==='object'&&V20.titles)V20.titles.push({id:'g100tok',n:G100R.title,col:'#ffd76a',src:'강자의 증표 40개',have:()=>!!(P&&g100Tk().ttl)});
/* ===== 가-3 틈 ===== */
const g100RfSlot=()=>Math.floor(g100Now()/G100R.slot);
const g100RfOpen=(r,s)=>{s=s==null?g100RfSlot():s;if(window.__QA&&G100R.qaReg===r)return true;/* #qa: 시계에 안 흔들리게 */return G100R.regs.includes(r)&&(v20Hash('g100rf|'+s+'|'+r)%1000)/1000<G100R.ch};
const g100RfDone=r=>{const d=g100S().d;return !!(g100Obj(d.rf)&&(d.rf[r]|0)===g100RfSlot())};
const g100RfLv=r=>{const D=REGIONS[r];return Math.max(D?D.base+40+(D.zcap||8)+G100R.add:140,Math.min(G100R.lvMax,(P?P.lvl:0)+G100R.lvMe))};
function g100RfSpot(r){const L=RCACHE[r],s=mulberry(v20Hash('g100rfsp|'+g100RfSlot()+r)%1000003),T=L&&L.town;
  for(let i=0;i<300;i++){const x=900+s()*4200,y=900+s()*4200;if(T&&Math.hypot(x-T.x,y-T.y)<SAFE+1100)continue;let bad=false;
    for(let k=0;k<12&&!bad;k++){const a=k/12*6.283;if(blockedAt(x+Math.cos(a)*G100R.R*.7,y+Math.sin(a)*G100R.R*.7))bad=true}if(bad||blockedAt(x,y))continue;
    if(L&&L.lq){const pv=LQ;LQ=L.lq;const w=liqAt(x,y)>.1;LQ=pv;if(w)continue}return{x,y}}return null}
// 지금 땅의 틈 자리(열려 있을 때만 · 하루 칸마다 다시 셈)
function g100RfHere(){if(DG||IN||!REG||!P||P.diff!==2)return null;const r=REG.id;if(!g100RfOpen(r))return null;const L=RCACHE[r];if(!L)return null;const s=g100RfSlot();
  if(!L._g100rf||L._g100rf.s!==s){const p=g100RfSpot(r);L._g100rf=p?{s,x:p.x,y:p.y}:{s,x:null}}return L._g100rf.x==null?null:L._g100rf}
function g100RfStart(){const h=g100RfHere();if(!h||G100RV.rift)return false;const r=REG.id;
  if(NET.guest){msg('틈은 방장이 열어야 합니다','#ff8a5a');return false}if(g100RfDone(r)){msg('이 틈은 이번 10분 안에 이미 닫았습니다','#ff8a5a');return false}
  G100RV.rift={reg:r,x:h.x,y:h.y,slot:h.s,w:0,t:G100R.time,mobs:[],lv:g100RfLv(r),st:'fight',gd:null};g100RfWave();
  banner={t:'틈이 열렸습니다',sub:`5분 안에 무리 셋과 틈의 수호자를 쓰러뜨리세요 · Lv${G100RV.rift.lv}`,col:'#c8a0ff',life:2.6,max:2.6};
  rings.push({x:h.x,y:h.y,r:20,max:G100R.R,life:1,col:'#c8a0ff'});return true}
function g100RfMob(k,x,y,lv,o){const e=dgMob(k,x,y,lv,o||{elite:true});e.aggroed=true;e.g100rf=1;if(e.lvl>G100.capLv&&typeof g100Fix==='function')g100Fix(e);return e}
function g100RfWave(){const F=G100RV.rift;if(!F)return;const mobs=(REGIONS[F.reg].mobs||[]).filter(k=>TYPES[k]&&!TYPES[k].boss&&!TYPES[k].mini);if(!mobs.length)return;
  if(F.w<G100R.waves.length){const n=G100R.waves[F.w]+(typeof PTY==='object'&&PTY.partyN&&PTY.partyN()>1?2:0);
    for(let i=0;i<n;i++){const a=i/n*6.283+R()*.4,d=rnd(G100R.R*.35,G100R.R*.7);F.mobs.push(g100RfMob(pick(mobs),F.x+Math.cos(a)*d,F.y+Math.sin(a)*d,F.lv))}
    F.w++;msg(`틈 무리 ${F.w}/${G100R.waves.length}`,'#c8a0ff')}
  else{const k=pick(mobs),e=g100RfMob(k,F.x,F.y-60,F.lv+2);e.hp=e.max=Math.round(e.max*G100R.gdHp);e.sc=G100R.gdSc;e.r*=1.25;e.g100gd=1;e.nm='틈의 수호자 · '+TYPES[k].n;F.gd=e;F.mobs.push(e);
    banner={t:'틈의 수호자가 나타났습니다',sub:TYPES[k].n,col:'#c8a0ff',life:2,max:2}}}
function g100RfEnd(ok,why){const F=G100RV.rift;if(!F)return;G100RV.rift=null;for(const e of F.mobs)if(!e.dead){const i=enemies.indexOf(e);if(i>=0)enemies.splice(i,1)}
  if(!ok){msg(`틈이 닫혔습니다 · ${why}`,'#ff8a5a');return}
  const s=g100S();if(!g100Obj(s.d.rf))s.d.rf={};s.d.rf[F.reg]=F.slot;s.rf=g100Int(s.rf+1);
  let it=null;for(let i=0;i<80&&!(it&&it.rar>=2);i++)it=makeItem(Math.min(F.lv,MAXLV),true);if(it&&it.rar<2)it.rar=2;if(it)loot.push({x:F.x+rnd(-30,30),y:F.y+rnd(-30,30),kind:'item',item:it,t:0,keep:1});
  if(typeof ashGain==='function')ashGain(3,F.x,F.y);if(R()<.5&&typeof e22RuneRoll==='function')e22RuneGain(e22RuneRoll(5),1,F.x,F.y);
  rings.push({x:F.x,y:F.y,r:20,max:200,life:1,col:'#ffd76a'});burst(F.x,F.y,'#c8a0ff',60,220,4,30);
  banner={t:'틈을 닫았습니다',sub:`희귀 이상 장비 · 재의 결정 3 · 강자의 증표 · 깬 틈 ${s.rf}`,col:'#ffd76a',life:3,max:3};save()}
function g100RfTick(dt){const F=G100RV.rift;if(!F)return;if(DG||IN||REG.id!==F.reg){G100RV.rift=null;return}
  if(P.dead){g100RfEnd(false,'쓰러졌습니다');return}F.t-=dt;if(F.t<=0){g100RfEnd(false,'시간이 다 됐습니다');return}
  if(Math.hypot(P.x-F.x,P.y-F.y)>G100R.R*G100R.out){g100RfEnd(false,'싸움터를 벗어났습니다');return}
  F.mobs=F.mobs.filter(e=>!e.dead&&e.hp>0&&enemies.includes(e));
  if(!F.mobs.length){if(F.gd){g100RfEnd(true);return}g100RfWave()}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(!P||paused)return r;try{g100RfTick(dt);g100ActTick();g100AchTick(dt)}catch(e){if(window.__QA)throw e}return r}}
function g100ActTick(){if(DG||IN||P.dead||act||G100RV.rift)return;const h=g100RfHere();if(h&&Math.hypot(P.x-h.x,P.y-h.y)<110)act='g100_rift'}
{const _tl=twActLabel;twActLabel=function(a){if(a==='g100_rift')return g100RfDone(REG.id)?'틈 · 이번 10분 안에 이미 닫음':'틈으로 들어가기 · 5분 도전 (F)';return _tl.apply(this,arguments)}}
{const _da=doAct;doAct=function(){if(act==='g100_rift'){g100RfStart();return}return _da.apply(this,arguments)}}
// 그림: 틈 (보랏빛 갈라진 금) · 싸움터 둘레 · 남은 시간
{const _ddf=drawDecalsFields;drawDecalsFields=function(){_ddf.apply(this,arguments);try{if(DG||IN)return;const F=G100RV.rift,h=F||g100RfHere();if(!h)return;
  if(F){ctx.globalAlpha=.55;ctx.strokeStyle='#c8a0ff';ctx.lineWidth=4;ctx.setLineDash([18,12]);ctx.beginPath();ctx.arc(F.x,F.y,G100R.R,0,6.283);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
  if(!F&&g100RfDone(REG.id))ctx.globalAlpha=.35;const t=time;ctx.save();ctx.translate(h.x,h.y);ctx.globalCompositeOperation='lighter';glow(0,-40,90,'#8a5aff');ctx.globalCompositeOperation='source-over';
  ctx.strokeStyle='#e8d8ff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,-110);for(let i=1;i<=8;i++){ctx.lineTo(Math.sin(i*1.7+t*2)*(8+i*1.5),-110+i*14)}ctx.stroke();
  ctx.strokeStyle='#8a5aff';ctx.lineWidth=2;ctx.stroke();ctx.restore();ctx.globalAlpha=1}catch(e){if(window.__QA)throw e}}}
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);try{const F=G100RV.rift;if(!F||DG||IN)return;S();ctx.font=`700 15px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';
  const m=Math.floor(F.t/60),s=Math.floor(F.t%60),txt=`틈 · 무리 ${Math.min(F.w,G100R.waves.length)}/${G100R.waves.length}${F.gd?' · 수호자':''} · ${m}:${String(s).padStart(2,'0')}`;ctx.strokeText(txt,W/2,96);ctx.fillStyle='#e8d8ff';ctx.fillText(txt,W/2,96)}catch(e){if(window.__QA)throw e}}}
/* ===== 나-8 업적 ===== */
function g100AchTick(dt){if(DG||IN||!REG)return;const id=REG.id,s=g100S();if(G100.ids.includes(id)&&!s.k[id]){s.k[id]=1}
  if(id===G100.coast&&typeof g100Tide==='function'&&g100Tide()&&P.y>G100T.tideY&&!P.dead){const t=g100Tk();t.tide=Math.min(9999,(+t.tide||0)+dt)}}
if(typeof G42==='object'&&Array.isArray(G42.ach)){const add=(id,n,d,need,cur,pts)=>G42.ach.push({id,n,d,need,cur,grp:'100레벨 이후',pts:pts||10});const S1=()=>g100S();
  add('g100land','새 땅 넷','141~158레벨 새 땅 넷에 모두 가 보기',4,()=>G100.ids.filter(k=>S1().k[k]).length,15);
  add('g100boss','네 땅의 주인','새 땅 던전 보스 넷을 모두 쓰러뜨리기',4,()=>G100.bosses.filter(k=>S1().bk[k]).length,20);
  add('g100heart','별을 식힌 자','식은 별의 심장 쓰러뜨리기',1,()=>S1().bk.b_cr1_heart?1:0,30);
  add('g100st1','떠도는 강자','떠도는 강자 처음 잡기',1,()=>Math.min(1,S1().st|0),10);
  add('g100st10','강자를 쫓는 이','떠도는 강자 10번 잡기',10,()=>S1().st|0,20);
  add('g100rf1','틈 닫기','틈 처음 닫기',1,()=>Math.min(1,S1().rf|0),10);
  add('g100rf20','틈 사냥꾼','틈 20번 닫기',20,()=>S1().rf|0,20);
  add('g100tok50','증표 모으기','강자의 증표 50개 모으기(쓴 것도 셈)',50,()=>g100Tk().got|0,15);
  add('g100tide','밀물을 버틴 자','검은 기둥 해안 밀물 때 바다 쪽 모래밭에서 30초 버티기',30,()=>Math.floor(+g100Tk().tide||0),10);
  add('g100bx','여덟 상자','레벨 단계 상자 여덟 모두 받기',8,()=>S1().bx.length,15);
  add('g100tr','일곱 갈림길','3차 숙련 특성 일곱 모두 고르기',7,()=>typeof g100TrSel==='function'?Object.keys(g100TrSel()).length:0,15)}
// 성장(G) 「강자」 칸
function g100TokHtml(){const s=g100S(),t=g100Tk(),town=g100InTown();let h=`<div class="v20box"><h3>강자의 증표 <span class="muted">가진 것 ${s.tok|0}개 · 모은 것 ${t.got|0}개</span></h3>`;
  h+=`<p class="muted" style="margin:2px 0 6px">100레벨부터 나보다 높은 몬스터를 잡으면 가끔 나옵니다(높을수록 · 정예일수록 잘). 준보스 · 보스 · 떠도는 강자 · 틈의 수호자는 꼭. 증표 상인 바렌(첨탑 광장)과 같은 값으로, 마을 안에서 바꿉니다.</p>`;
  if(!town)h+='<p style="color:#ffb07a;margin:2px 0">지금은 마을 밖이라 바꿀 수 없습니다</p>';
  for(const o of G100R.shop){const done=o.once&&t.ttl,can=town&&!done&&(s.tok|0)>=o.c;
    h+=`<div class="v20row"><div><b>${o.n}</b> <span class="muted">증표 ${o.c}개</span></div><div class="btns">${done?'<button type="button" disabled>받음</button>':v20Btn('g100tok',o.k,'바꾸기',{dis:!can,title:can?'':town?`증표 ${o.c}개 필요`:'마을 안에서만'})}</div></div>`}
  h+='</div>';const r=REG&&REG.id,open=G100R.regs.filter(x=>g100RfOpen(x)),left=Math.ceil((G100R.slot-(g100Now()%G100R.slot))/60);
  h+=`<div class="v20box"><h3>틈 <span class="muted">깬 틈 ${s.rf|0} · 지옥 · 10분마다 바뀜(${left}분 남음)</span></h3><p class="muted" style="margin:2px 0">지금 열린 땅: ${open.length?open.map(x=>REGIONS[x].n+(g100RfDone(x)?' (닫음)':'')).join(' · '):'없음'}</p>`;
  if(r&&open.includes(r)&&P.diff===2&&!g100RfDone(r))h+='<p style="color:#c8a0ff;margin:2px 0">이 땅에 틈이 있습니다 · 보랏빛 금을 찾아 F</p>';return h+'</div>'}
G42.tabs.push({k:'g100tok',n:'강자',html:g100TokHtml,dot:()=>!!P&&P.lvl>=100&&g100InTown()&&G100R.shop.some(o=>!(o.once&&g100Tk().ttl)&&(g100S().tok|0)>=o.c)});
/* ===== 나-5 주간 계약 · 습격 방어전 · 도전 던전 100~140판 =====
   · 주간 계약: 100레벨부터 새로 뽑는 주의 계약 땅을 100~140 땅 여섯에서(130부터는 새 땅 넷도). 이미 받은 이번 주 계약은 그대로.
   · 습격 방어전: 100~140 땅 여섯 + 새 땅 넷의 마을 울타리에도 뿔피리(g45b.js처럼 G42_RD에 더함 · 몬스터는 그 땅 레벨).
   · 도전 던전: 이미 레벨 제한이 없어 100~140 · 새 땅 던전에도 붙음(시험으로 확인). */
const G100W={wkFrom:100};
{const _wr=g42WkRegs;g42WkRegs=function(){if(!P||P.lvl<G100W.wkFrom)return _wr.apply(this,arguments);const rs=G100R.regs.concat(P.lvl>=G100.minLv?G100.ids:[]).filter(r=>REGIONS[r]);return rs.length?rs:_wr.apply(this,arguments)}}
if(typeof G42_RD==='object')for(const r of G100R.regs.concat(G100.ids))if(REGIONS[r]&&!G42_RD.includes(r))G42_RD.push(r);
window.__g100t={G100R,G100RV,g100TokRoll,g100TokAdd,g100ShopBuy,g100RfOpen,g100RfHere,g100RfStart,g100RfDone,g100RfLv};
