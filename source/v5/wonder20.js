/* ---------- v20 W2 세계의 신비 (설계: rpg/v20-ideas/code/wonders.js) ----------
   25분마다 지역 하나에 5분 동안 신비한 일이 일어난다(그날 날짜 + 몇 번째 25분인지로 정함 → 같은 시각이면 누구나 같은 곳).
   1분 전 알림, 지도에 보라 고리, 알림판에 남은 시간. 그 지역 들판에 있을 때만 효과(마을 안전 지대·던전·실내는 없음).
   효과는 모두 덧셈(장비 능력치 칸 · 피해 증가 칸 · 치유 칸). 나오는 몬스터는 정예와 같은 세기(생명력 ×3, 피해 ×1.4).
   나온 무리를 다 잡으면(거울 그림자 · 예언자 셋 포함) 「신비의 상자」 한 번. 파티원이 같은 지역에 있으면 장비 한 번 더.
   하늘 효과: 미리 구운 덧칠 한 장 + 입자 60개(휴대폰 30개). 저장: P.won={seen:[처음 본 신비 id…]} (v20c.js). */
const WONDERS=[
 {id:'aurora',reg:'ice',n:'오로라 내리는 밤',say:'하늘빛이 얼음 벌판까지 내려와 낮게 노래한다.',sky:'aurora',fx:{manaRegen:.5},spawn:{k:'i_elem',n:6,tint:'#c9a6ee',name:'하늘빛 정령',book:'w1'},d:'마나 회복 +50%. 하늘빛 정령 여섯이 나타나고, 하나는 책 「오로라 빙원의 밤」을 지니고 있다(아직 없으면).'},
 {id:'stormcape',reg:'cliffs',n:'그치지 않는 번개',say:'맑은 하늘에서 번개가 쏟아진다.',sky:'lightning',fx:{stormDmg:.15},hazard:{every:4,warn:1.2,hpPct:.08},spawn:{k:'t_sentinel',n:5,tint:'#ffe066',name:'번개 맞은 수호석'},d:'번개 피해 +15%. 4초마다 바닥에 번개 예고 원(1.2초 뒤 떨어짐, 맞으면 최대 생명력 8%). 번개 맞은 수호석 다섯.'},
 {id:'noshadow',reg:'plains',n:'그림자 없는 한낮',say:'어떤 것에도 그림자가 생기지 않는다.',sky:'noon',fx:{xp:.25},spawn:{k:'p_raider',n:6,tint:'#f0e0a0',name:'숨어 있던 약탈 기사'},d:'경험치 +25%. 숨어 있던 약탈 기사 여섯이 드러난다.'},
 {id:'saltmirror',reg:'desert',n:'소금 거울',say:'땅이 하늘을 비춘다. 거울 속 별자리가 다르다.',sky:'mirror',mirror:{hp:.6,dmg:.1},d:'내 그림자(내 모습, 내 최대 생명력 60%)가 거울에서 나와 내 마법 셋의 빛으로 싸운다. 이기면 신비의 상자.'},
 {id:'risingrain',reg:'highland',n:'오르는 비',say:'비가 땅에서 하늘로 내린다.',sky:'uprain',fx:{iceDmg:.12,windDmg:.12},flip:1,spawn:{k:'k_harpy',n:5,tint:'#9fd8ff',name:'비를 타는 하피'},d:'얼음·바람 피해 +12%. 밀쳐내기가 위로 띄우기로 바뀌어 적이 잠깐 공중에 뜬다(그 자리에 묶임).'},
 {id:'fireflies',reg:'moor',n:'떠나지 못한 등불',say:'겨울에도 반딧불 같은 빛이 떠다닌다.',sky:'fireflies',wisps:{n:12,heal:.05,mana:.05},spawn:{k:'h_keen',n:5,tint:'#ffe39a',name:'등불을 쫓는 망령'},d:'떠다니는 빛 열둘: 지나가면 생명력·마나 5%. 빛을 쫓는 망령 다섯.'},
 {id:'floatrock',reg:'canyon',n:'바위가 꿈꾸는 날',say:'바위들이 땅에서 떠올라 천천히 돈다.',sky:'dust',rocks:{n:8},fx:{earthDmg:.15},spawn:{k:'c_dust',n:5,tint:'#c9a46a',name:'바위를 맴도는 먼지 정령'},d:'대지 피해 +15%. 떠오른 바위 여덟: 바위 곁에 서면 날아오는 공격을 막아 준다.'},
 {id:'burningsnow',reg:'lava',n:'타오르는 눈',say:'눈이 땅에 닿자 푸른 불꽃으로 타오른다.',sky:'bluesnow',fx:{fireDmg:.12,iceDmg:.12},spawn:{k:'l_elem',n:5,tint:'#7ad8ff',name:'푸른 불 정령'},d:'불·얼음 피해 +12%. 푸른 불 정령 다섯.'},
 {id:'whalesong',reg:'sea',n:'고래 무덤의 노래',say:'바다 밑에서 오래된 노래가 올라온다.',sky:'mist',fx:{moveSpd:.10},spawn:{k:'s_drown',n:6,tint:'#8ad0e0',name:'노래에 깨어난 익사자'},d:'이동 속도 +10%. 노래에 깨어난 익사자 여섯.'},
 {id:'rootsing',reg:'forest',n:'뿌리의 노래',say:'고목들이 한꺼번에 흥얼거린다.',sky:'leaves',fx:{healPct:.15,lifeRegen:.01},spawn:{k:'f_dryad',n:5,tint:'#9fe39a',name:'노래하는 숲 정령',calm:1},d:'내가 건 치유 +15%, 초당 생명력 1% 회복. 숲 정령 다섯은 먼저 공격하지 않는다(때리면 싸움).'},
 {id:'drumecho',reg:'jungle',n:'사흘 늦은 메아리',say:'사흘 전 북소리가 이제야 돌아온다.',sky:'drums',fx:{cdr:.10},spawn:{k:'j_lizard',n:6,tint:'#b48aff',name:'메아리 주술사'},d:'재사용 대기 −10%. 메아리 주술사 여섯.'},
 {id:'voidbreath',reg:'abyss',n:'균열의 큰 숨',say:'균열이 길게 숨을 들이쉰다.',sky:'void',pull:{every:20,str:60},spawn:{k:'v_seer',n:3,tint:'#c06aff',name:'숨을 세는 예언자'},d:'20초마다 모든 것이 균열 쪽으로 조금 끌려간다. 숨을 세는 예언자 셋: 다 잡으면 숨이 멈추고 신비의 상자.'}].filter(w=>REGIONS[w.reg]&&(!w.spawn||TYPES[w.spawn.k]));
const WONDER_CYCLE={every:25*60,len:5*60,warn:60};
const WONBY={};for(const w of WONDERS)WONBY[w.id]=w;
function wonderAt(ms){const k=Math.floor(ms/1000/WONDER_CYCLE.every),d=new Date(ms).toISOString().slice(0,10);const h=v20Hash(d+'|'+k);
  const w=WONDERS[h%WONDERS.length],t=ms/1000-k*WONDER_CYCLE.every;return{w,k,active:t<WONDER_CYCLE.len,left:WONDER_CYCLE.len-t,next:WONDER_CYCLE.every-t}}
// 시험·도감용: 이 신비가 다음에 일어나는 시각(ms)
function wonFind(id,from){const E=WONDER_CYCLE.every*1000;let k=Math.floor((from==null?v20Now():from)/E);for(let i=0;i<4000;i++,k++){const ms=k*E+10000;if(wonderAt(ms).w.id===id)return ms}return null}
const WON={k:-1,w:null,active:false,inNow:false,warnK:-1,startK:-1,spK:-1,spN:0,kills:0,chestK:-1,boltT:2,pullT:20,wisps:[],rocks:[],sp:[],lastT:0,flash:0};
function wonCur(){const a=wonderAt(v20Now());WON.k=a.k;WON.w=a.w;WON.active=a.active;WON.left=a.left;WON.next=a.next;return a}
const wonIn=()=>!!(P&&WON.active&&WON.w&&REG.id===WON.w.reg&&!DG&&!IN&&!inSafe(P.x,P.y,0));
const wonFx=k=>wonIn()&&WON.w.fx&&WON.w.fx[k]||0;
/* ===== 효과 (덧셈) ===== */
V20.gsAdd.push((x,o)=>{if(!WON.inNow)return;const f=WON.w.fx||{};if(f.manaRegen)x.regen=(x.regen||0)+v20RegenPct(o,f.manaRegen);if(f.moveSpd)x.ms=(x.ms||0)+f.moveSpd*100;if(f.cdr)x.cdr=(x.cdr||0)+f.cdr*100});
V20.dmgAdd.push((e,s)=>{if(!WON.inNow)return 0;const f=WON.w.fx||{};return (s.el==='storm'?f.stormDmg||0:0)+(s.el==='ice'?f.iceDmg||0:0)+(s.el==='wind'?f.windDmg||0:0)+(s.el==='earth'?f.earthDmg||0:0)+(s.el==='fire'?f.fireDmg||0:0)});
V20.healK.push(()=>WON.inNow?(WON.w.fx&&WON.w.fx.healPct)||0:0);
{const _gx=gainXp;gainXp=function(n){if(WON.inNow&&WON.w.fx&&WON.w.fx.xp&&n>0)n=Math.max(1,Math.round(n*(1+WON.w.fx.xp)));return _gx.call(this,n)}}
// 오르는 비: 밀쳐내기 → 띄우기(그 자리에 묶임)
{const _af=applyFx;applyFx=function(e,s,from){if(!(WON.inNow&&WON.w.flip&&s&&s.knock&&e&&!e.dead))return _af.apply(this,arguments);const x=e.x,y=e.y;const r=_af.apply(this,arguments);
  e.x=x;e.y=y;e.rootT=Math.max(e.rootT||0,.8);for(let i=0;i<5&&parts.length<Q.pcap;i++)parts.push({x:e.x+rnd(-8,8),y:e.y+rnd(-8,8),z:6,vx:0,vy:0,vz:rnd(120,200),life:.5,max:.5,col:'#9fd8ff',sz:2});return r}}
/* ===== 몬스터 · 거울 그림자 ===== */
function wonMob(k,x,y,o){const t=TYPES[k];if(!t)return null;const D=DIFF[P.diff],lvl=Math.max(1,Math.max(t.min||1,zoneLevel(x,y))+D.add),hp=Math.round(t.hp*(1+.34*(lvl-1))*3*D.hp);
  const e={k,x,y,lvl,elite:true,hp,max:hp,dmg:t.dmg*(1+.18*(lvl-1))*1.4,r:t.r*1.25,atkCd:1,anim:R()*10,wx:x,wy:y,wt:0,hurt:0,fx:1,slowT:0,freezeT:0,stunT:0,burn:null,lunge:0,won:WON.w.id,wonK:WON.k,v20n:o.name,v20c:o.tint||'#c9a6ff'};
  if(o.calm){e.calm=1;e._hx=x;e._hy=y}enemies.push(e);rings.push({x,y,r:6,max:70,life:.6,col:e.v20c});return e}
function wonSpot(i,n,r0,r1){for(let k=0;k<24;k++){const a=(i/n)*6.283+k*.7+R()*.3,r=rnd(r0,r1),x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;if(x<80||y<80||x>WORLD-80||y>WORLD-80)continue;if(blockedAt(x,y)||inSafe(x,y,60))continue;return{x,y}}return null}
function wonSpawn(){const w=WON.w;WON.spK=WON.k;WON.spN=0;WON.kills=0;
  if(w.spawn){for(let i=0;i<w.spawn.n;i++){const p=wonSpot(i,w.spawn.n,320,620);if(!p)continue;const e=wonMob(w.spawn.k,p.x,p.y,w.spawn);if(!e)continue;WON.spN++;if(i===0&&w.spawn.book)e.wbook=w.spawn.book}}
  if(w.mirror)wonMirror();
  wonLocal();
  if(WON.spN)msg(`${w.n}: ${w.spawn?w.spawn.name:'거울 그림자'}${v20J(w.spawn?w.spawn.name:'거울 그림자','가','이')} 나타났습니다`,'#c9a6ff')}
function wonMirror(){const want=!PHYS_CLS[P.cls]||P.cls==='archer',L=(REGIONS[WON.w.reg].mobs||[]).filter(k=>TYPES[k]);const k=L.find(k=>!!TYPES[k].ranged===want)||L[0];if(!k)return null;
  const p=wonSpot(0,1,260,380)||{x:P.x+260,y:P.y};const e=wonMob(k,p.x,p.y,{name:`거울 속 ${CLASSES[P.cls].n||'그림자'}`,tint:'#cfe8ff'});if(!e)return null;
  const hp=Math.round(maxHp()*WON.w.mirror.hp);e.hp=e.max=hp;e.dmg=maxHp()*WON.w.mirror.dmg;e.r=16;e.mirror=1;e.sc=1;e.mirT=2.5;e.aggroed=true;
  e.mirEl=[...new Set((P.bar||[]).filter(id=>SPELLS[id]&&EL[SPELLS[id].el]).map(id=>SPELLS[id].el))].slice(0,3);if(!e.mirEl.length)e.mirEl=['arcane'];WON.spN++;return e}
// 거울 그림자 그리기: 내 모습(살짝 투명) + 고리
{const _d=drawEnemy;drawEnemy=function(e){if(!e.mirror)return _d.apply(this,arguments);const s=e._s;if(!s||!onScreen(s,140))return;
  const b=e._fig||(e._fig=Object.create(P));b.x=e.x;b.y=e.y;b.face=Math.atan2(P.y-e.y,P.x-e.x);b.moving=Math.hypot(e.x-(e._lx||e.x),e.y-(e._ly||e.y))>.3;b.walk=(b.walk||0)+(b.moving?.016:0);b.freezeT=e.freezeT;b.stunT=e.stunT;e._lx=e.x;e._ly=e.y;
  const R0=monRing('#cfe8ff'),r=40;ctx.drawImage(R0.cv,s.x-r,s.y-r*.5,r*2,r);ctx.save();ctx.globalAlpha=.72;try{drawFigure(ctx,b,s.x,s.y,PK,{bs:Math.max(1,DPR)*HS*PK})}catch(_){glow(s.x,s.y-30,30,'#cfe8ff')}ctx.restore()}}
// 이름표 (신비 몬스터)
{const _l=drawV5Labels;drawV5Labels=function(){wonSky();_l.apply(this,arguments);if(!P)return;for(const e of enemies){if(e.dead||!e.v20n)continue;const s=W2S(e.x,e.y),t=TYPES[e.k];if(!onScreen(s,120))continue;
  const y=s.y-(e.mirror?82*PK:(MON_H[t.draw]||40)*(e.sc||1.25)+20),n=e.v20n;ctx.textAlign='center';ctx.font='700 13px '+FONT;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(n,s.x,y);ctx.fillStyle=e.v20c||'#c9a6ff';ctx.fillText(n,s.x,y)}}}
{const _d=drawEnemy;drawEnemy=function(e){if(e.v20c&&!e.mirror&&e._s){const R0=monRing(e.v20c),r=e.r*1.7;ctx.drawImage(R0.cv,e._s.x-r,e._s.y-r*.5,r*2,r)}return _d.apply(this,arguments)}}
/* ===== 매 프레임: 위험 · 빛 · 바위 · 숨 · 거울의 마법 · 숲 정령 ===== */
V20.tick.push(dt=>{if(!P||!WON.w)return;const w=WON.w;
  // 숲 정령은 먼저 덤비지 않는다 (맞으면 싸움) · 거울의 마법 (주인 · 혼자)
  if(!NET.guest)for(const e of enemies){if(e.dead)continue;if(e.calm){if(e.hurt>0||e.hp<e.max){e.calm=0;e.aggroed=true}else{e.x=e._hx;e.y=e._hy;e.aggroed=false;e.atkCd=Math.max(e.atkCd,1)}}
    if(e.mirror&&!(e.freezeT>0||e.stunT>0)){e.mirT-=dt;if(e.mirT<=0){e.mirT=3.2;const {tg,d}=enemyTarget(e);if(d<520){const el=pick(e.mirEl),a0=Math.atan2(tg.y-e.y,tg.x-e.x);for(let i=-1;i<=1;i++){const a=a0+i*.18;projs.push({x:e.x,y:e.y,z:28,vx:Math.cos(a)*280,vy:Math.sin(a)*280,r:7,dmg:e.dmg*.8,owner:'e',life:2,col:EL[el]})}e.cast=.35}}}}
  if(!WON.inNow)return;
  if(w.hazard){WON.boltT-=dt;if(WON.boltT<=0&&!P.dead){WON.boltT=w.hazard.every;const x=P.x+rnd(-170,170),y=P.y+rnd(-170,170);if(!inSafe(x,y,40)){warns.push({x,y,rad:70,t:w.hazard.warn,max:w.hazard.warn,dmg:maxHp()*w.hazard.hpPct,col:'#ffe066',src:null});zap({x:x-150,y:y-150},{x,y},{delay:w.hazard.warn,life:.25,col:'#fff6c0',w:3,glow:'#ffe066'})}}}
  if(w.fx&&w.fx.lifeRegen&&!P.dead){P.hp=Math.min(maxHp(),P.hp+maxHp()*w.fx.lifeRegen*dt);if(R()<dt*3&&parts.length<Q.pcap)parts.push({x:P.x+rnd(-10,10),y:P.y+rnd(-6,6),z:8,vx:0,vy:0,vz:60,life:.6,max:.6,col:'#9fe39a',sz:2})}
  if(w.wisps)for(let i=WON.wisps.length-1;i>=0;i--){const o=WON.wisps[i];if(Math.hypot(o.x-P.x,o.y-P.y)<44&&!P.dead){WON.wisps.splice(i,1);healP(maxHp()*w.wisps.heal);P.mp=Math.min(maxMp(),P.mp+maxMp()*w.wisps.mana);burst(o.x,o.y,'#ffe39a',14,80,2.5,24);rings.push({x:P.x,y:P.y,r:6,max:40,life:.4,col:'#ffe39a'})}}
  if(w.rocks&&WON.rocks.length){const near=WON.rocks.filter(r=>Math.hypot(r.x-P.x,r.y-P.y)<80);if(near.length)for(const p of projs){if(p.owner!=='e'||p.life<=0)continue;if(near.some(r=>Math.hypot(p.x-r.x,p.y-r.y)<64)){p.life=0;burst(p.x,p.y,'#c9a46a',8,70)}}}
  if(w.pull){const alive=enemies.some(e=>!e.dead&&e.won===w.id&&e.wonK===WON.k);if(alive||WON.spK!==WON.k){WON.pullT-=dt;if(WON.pullT<=0){WON.pullT=w.pull.every;const c=REG.lair||{x:WORLD/2,y:WORLD/2},str=w.pull.str;
    const pl=o=>{const d=Math.hypot(c.x-o.x,c.y-o.y);if(d<1)return;const k=Math.min(str,d-60);if(k<=0)return;const nx=o.x+(c.x-o.x)/d*k,ny=o.y+(c.y-o.y)/d*k;if(o===P){if(!blockedAt(nx,ny)){P.x=nx;P.y=ny}}else moveBody(o,nx-o.x,ny-o.y)};
    pl(P);if(!NET.guest)for(const e of enemies)if(!e.dead&&!TYPES[e.k].boss)pl(e);rings.push({x:P.x,y:P.y,r:120,max:10,life:.6,col:'#c06aff'});shake=Math.max(shake,4);msg('균열이 숨을 들이쉽니다 — 모든 것이 끌려갑니다','#c06aff')}}}});
function wonLocal(){const w=WON.w;
  if(w.wisps){WON.wisps=[];for(let i=0;i<w.wisps.n;i++){const p=wonSpot(i,w.wisps.n,140,520);if(p)WON.wisps.push({x:p.x,y:p.y,ph:R()*6})}}
  if(w.rocks){WON.rocks=[];for(let i=0;i<w.rocks.n;i++){const p=wonSpot(i,w.rocks.n,160,560);if(p)WON.rocks.push({x:p.x,y:p.y,ph:R()*6})}}}
function wonSlow(){if(!P)return;const a=wonCur(),w=a.w;
  // 1분 전 알림
  if(!a.active&&a.next<=WONDER_CYCLE.warn&&WON.warnK!==a.k+1){WON.warnK=a.k+1;const nx=wonderAt(v20Now()+a.next*1000+5000).w;msg(`곧 ${REGIONS[nx.reg].n}에 「${nx.n}」${v20J(nx.n,'가','이')} 일어납니다 (1분 뒤)`,'#c9a6ff');if(REG.id===nx.reg)banner={t:`곧 · ${nx.n}`,sub:`1분 뒤 ${REGIONS[nx.reg].n}에서`,col:'#c9a6ff',life:2.6,max:2.6}}
  const inN=wonIn(),inW=inN&&WON.w?WON.w.id:'';if(inN!==WON.inNow||inW!==WON.inW){WON.inNow=inN;WON.inW=inW;v20GsBump()}
  if(a.active&&WON.startK!==a.k){WON.startK=a.k;msg(`세계의 신비 · ${REGIONS[w.reg].n}: 「${w.n}」 (5분)`,'#c9a6ff');if(REG.id===w.reg&&!DG)banner={t:w.n,sub:w.say,col:'#c9a6ff',life:3.2,max:3.2}}
  if(!a.active){WON.wisps.length=0;WON.rocks.length=0}
  if(!inN)return;if(!v20Obj(P.won)||!Array.isArray(P.won.seen))P.won={seen:[]};if(!P.won.seen.includes(w.id)){P.won.seen.push(w.id);msg(`처음 본 신비: 「${w.n}」 (도감 J · 신비)`,'#c9a6ff');save()}
  if(WON.spK!==a.k){if(!NET.guest)wonSpawn();else{WON.spK=a.k;WON.spN=0;WON.kills=0;wonLocal()}}}
V20.slowTick.push(wonSlow);
// 잡기: 무리를 다 잡으면 신비의 상자 · 책
{const _nk=netKill;netKill=function(e){V20.nkW=e;try{return _nk.apply(this,arguments)}finally{V20.nkW=null}}}
{const _ns=netSend;netSend=function(o){if(V20.nkW&&o&&o.t==='kill'&&V20.nkW.won){o.won=V20.nkW.won;o.wk=V20.nkW.wonK;o.wn=WON.spN}return _ns.apply(this,arguments)}}
{const _no=netOnKill;netOnKill=function(m){V20.killWon=m&&typeof m.won==='string'?m:null;try{return _no.apply(this,arguments)}finally{V20.killWon=null}}}
{const _rk=rewardKill;rewardKill=function(e){_rk.apply(this,arguments);if(!P||GHOST)return;const id=e.won||(V20.killWon&&V20.killWon.won),k=e.won?e.wonK:V20.killWon&&V20.killWon.wk;if(!id||k!==WON.k)return;
  if(V20.killWon&&!e.won&&V20.killWon.wn)WON.spN=Math.max(WON.spN,V20.killWon.wn);WON.kills++;if(e.wbook&&typeof bookGain==='function')bookGain(e.wbook,'세계의 신비');
  if(WON.kills>=WON.spN&&WON.spN>0&&WON.chestK!==k)wonChest(e)}}
function wonChest(at){WON.chestK=WON.k;const L=Math.max(1,(at&&at.lvl)||P.lvl),x=at&&at.x!=null?at.x:P.x,y=at&&at.y!=null?at.y:P.y;
  loot.push({x:x+rnd(-20,20),y:y+rnd(-20,20),kind:'item',item:makeItem(L,true),t:0});loot.push({x:x+rnd(-20,20),y:y+rnd(-20,20),kind:'gold',amt:L*25,t:0});loot.push({x:x+rnd(-20,20),y:y+rnd(-20,20),kind:R()<.5?'hp':'mp',tier:potDropTier(L),t:0});
  let party=false;if(NET.on)for(const r of NET.peers.values())if(!r.dead&&netSame(r)){party=true;break}if(party)loot.push({x:x+rnd(-20,20),y:y+rnd(-20,20),kind:'item',item:makeItem(L,true),t:0});
  banner={t:'신비의 상자',sub:`${WON.w.n}${v20J(WON.w.n,'를','을')} 끝까지 지켜보았습니다${party?' · 파티 덤 장비 하나 더':''}`,col:'#c9a6ff',life:3,max:3};rings.push({x,y,r:10,max:140,life:.9,col:'#c9a6ff'});burst(x,y,'#c9a6ff',40,160,3,30);
  if(typeof repGain==='function'){const T=RCACHE[WON.w.reg]&&RCACHE[WON.w.reg].town;if(T)repGain(T.id,'wonder')}}
/* ===== 그림: 하늘 덧칠 · 입자 · 빛 · 바위 ===== */
const WSKY={aurora:['#1a4a3a','#4a2a6a',.32,'#9fe8c8'],lightning:['#20243a','#3a3a20',.3,'#fff6c0'],noon:['#fff4c0','#fff8e0',.18,'#ffffff'],mirror:['#cfe8ff','#f0e8ff',.2,'#ffffff'],uprain:['#2a3a5a','#4a6a8a',.28,'#9fd8ff'],
  fireflies:['#1a1a2a','#3a3020',.3,'#ffe39a'],dust:['#5a4024','#8a6a40',.24,'#e8c890'],bluesnow:['#1a2a4a','#2a4a6a',.28,'#9fe8ff'],mist:['#c8d8e0','#8aa8b8',.26,'#ffffff'],leaves:['#1a3a1a','#3a5a2a',.22,'#9fe39a'],drums:['#2a1a3a','#4a2a4a',.24,'#b48aff'],void:['#1a0a2a','#3a1a4a',.34,'#c06aff']};
function wonSky(){if(!P||!WON.active||!WON.w||REG.id!==WON.w.reg||DG||IN)return;const k=WON.w.sky,Q=WSKY[k];if(!Q)return;const now=performance.now()/1000,dt=Math.min(.05,now-(WON.lastT||now));WON.lastT=now;
  const e=SC.get('v20sky/'+k,8,128,0,0,g=>{const gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,Q[0]);gr.addColorStop(.55,Kit.rgb(Kit.hex(Q[1]),.5));gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,8,128)},{force:1,pin:1,scale:1});
  ctx.save();S();ctx.globalAlpha=Q[2];if(e)ctx.drawImage(e.cv,0,0,W,H*.75);
  if(k==='lightning'){WON.flash=Math.max(0,WON.flash-dt);if(R()<dt*.25)WON.flash=.18;if(WON.flash>0){ctx.globalAlpha=WON.flash;ctx.fillStyle='#fff8d8';ctx.fillRect(0,0,W,H)}}
  const N=v20Mob()?30:60,sp=WON.sp;while(sp.length<N)sp.push({x:R()*W,y:R()*H,v:rnd(.5,1.5),p:R()*6});if(sp.length>N)sp.length=N;
  ctx.fillStyle=Q[3];const up=k==='uprain',fall=k==='bluesnow'||k==='leaves'||k==='mist',drift=k==='dust'||k==='void'||k==='fireflies'||k==='aurora'||k==='noon'||k==='mirror'||k==='drums';
  for(const p of sp){if(up)p.y-=220*p.v*dt;else if(fall){p.y+=60*p.v*dt;p.x+=Math.sin(now+p.p)*20*dt}else if(drift){p.x+=Math.sin(now*.5+p.p)*14*dt;p.y+=Math.cos(now*.4+p.p)*10*dt}else p.y+=140*p.v*dt;
    if(p.y<-10)p.y=H+5;if(p.y>H+10)p.y=-5;if(p.x<-10)p.x=W+5;if(p.x>W+10)p.x=-5;
    ctx.globalAlpha=(k==='fireflies'||k==='mirror'?.5+.5*Math.sin(now*3+p.p):.55)*.8;if(up)ctx.fillRect(p.x,p.y,1.5,10*p.v);else ctx.fillRect(p.x,p.y,2.2*p.v,2.2*p.v)}
  ctx.restore()}
function wonRockSpr(){return SC.get('v20/floatrock',64,48,32,30,g=>{g.translate(32,30);g.fillStyle='#6a5034';g.beginPath();g.moveTo(-22,0);g.lineTo(-16,-14);g.lineTo(-2,-20);g.lineTo(16,-15);g.lineTo(23,-2);g.lineTo(12,10);g.lineTo(-10,11);g.closePath();g.fill();
  g.fillStyle='#8a6a44';g.beginPath();g.moveTo(-16,-14);g.lineTo(-2,-20);g.lineTo(16,-15);g.lineTo(4,-8);g.lineTo(-12,-8);g.closePath();g.fill();g.fillStyle='#4a3824';g.beginPath();g.moveTo(-10,11);g.lineTo(12,10);g.lineTo(2,16);g.closePath();g.fill()},{force:1,pin:1})}
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);if(!WON.inNow||(!WON.wisps.length&&!WON.rocks.length))return;S();const now=time;
  ctx.globalCompositeOperation='lighter';for(const o of WON.wisps){const s=W2S(o.x,o.y);if(!onScreen(s,40))continue;glow(s.x,s.y-26+Math.sin(now*2+o.ph)*6,16,'#ffe39a')}ctx.globalCompositeOperation='source-over';
  const R0=wonRockSpr();for(const o of WON.rocks){const s=W2S(o.x,o.y);if(!onScreen(s,80))continue;ctx.globalAlpha=.35;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(s.x,s.y,24,9,0,0,6.283);ctx.fill();ctx.globalAlpha=1;
    const hy=s.y-46+Math.sin(now*1.3+o.ph)*5;if(R0)ctx.drawImage(R0.cv,s.x-32,hy-30,64,48)}ctx.globalCompositeOperation='lighter'}}
/* ===== 지도 · 알림판 · 도감 ===== */
v20Css('.qtg.w{background:#7a4ac8;color:#fff}');
const wonTarget=w=>{const L=RCACHE[w.reg],T=L&&L.town;return T?{reg:w.reg,x:T.x,y:T.y,label:`${REGIONS[w.reg].n} 들판`}:null};
{const _m=sqMarks;sqMarks=function(world){const o=_m(world);if(!P||!WON.active||!WON.w||(REG.id===WON.w.reg&&!world))return o;const t=wonTarget(WON.w);if(!t)return o;const p=v20WP(t,world);if(p)o.push({x:p.x,y:p.y,kind:'ring',col:'#c9a6ff',label:p.via?`신비 → ${p.via}`:`신비 · ${WON.w.n}`});return o}}
const wonMS=s=>{s=Math.max(0,Math.round(s));return `${Math.floor(s/60)}분 ${String(s%60).padStart(2,'0')}초`};
{const _s=sqHudBlocks;sqHudBlocks=function(){const o=_s();if(!P||!WON.active||!WON.w)return o;const w=WON.w,here=REG.id===w.reg;
  o.push({t:`<i class="qtg w">신비</i>${w.n}`,w:`${REGIONS[w.reg].n} · ${wonMS(WON.left)} 남음`,g:[{s:here?(WON.inNow?'효과를 받는 중':'마을 밖 들판으로 나가면 효과'):'그 지역에 가면 효과를 받습니다',ok:WON.inNow}],side:1});return o}}
V20.cx.push({k:'wonders',n:'신비',html(){const seen=(P&&P.won&&P.won.seen)||[],now=v20Now(),a=wonderAt(now);
  let h=`<p class="muted" style="margin-top:0">25분마다 한 지역에 5분 동안 신비한 일이 일어납니다. 그 지역 들판에 있으면 효과를 받습니다. 본 신비 ${seen.filter(id=>WONBY[id]).length}/${WONDERS.length}</p>`;
  h+='<div class="v20box"><h3>언제 어디서</h3>';for(let i=0;i<4;i++){const ms=i===0&&a.active?now:now+(a.next+(i-(a.active?1:0))*WONDER_CYCLE.every)*1000+5000,b=wonderAt(ms),act=i===0&&a.active;
    const tt=act?`지금 · ${wonMS(b.left)} 남음`:`${wonMS((ms-now)/1000)} 뒤`;h+=`<div class="v20row"><div><b>${seen.includes(b.w.id)?b.w.n:'???'}</b> <span class="muted">· ${REGIONS[b.w.reg].n}</span></div><div class="muted">${tt}</div></div>`}h+='</div>';
  for(const w of WONDERS){const ok=seen.includes(w.id);h+=ok?`<div class="v20box"><h3 style="color:#c9a6ff">${w.n} <span class="muted" style="font-weight:400">· ${REGIONS[w.reg].n}</span></h3><div class="qsay">「${w.say}」</div><div class="muted" style="font-size:12px">${w.d}</div></div>`:
    `<div class="v20box" style="opacity:.7"><b>???</b> <span class="muted">· ${REGIONS[w.reg].n}에서 일어나는 신비</span></div>`}return h}});
window.__v20=window.__v20||{};Object.assign(window.__v20,{WONDERS,WONBY,WONDER_CYCLE,WON,wonderAt,wonFind,wonCur,wonIn,wonSlow,wonSpawn,wonMirror,wonChest,wonFx});
