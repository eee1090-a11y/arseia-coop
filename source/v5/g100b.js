/* ---------- v57 후보 · 1차 묶음 둘째: 정할 것 ③ 높은 몬스터 경험치 · 가-2 떠도는 강자 · 가-5 위험 색 ----------
   사용자 2026-11-07 「내 캐릭터 레벨은 130 이상이라고 하더라도 더 강한 지역의 몬스터들을 잡을 기회를 줘야」 → 제안 「모두 추천대로」.
   · ③ 경험치: 130레벨부터 나보다 높은 몬스터는 레벨 차이로 줄지 않고(b3.js xpUp21을 되돌림), 1레벨 높을 때마다 +2%(최대 +40%). 몬스터 처치 경험치의 첫 gainXp 한 번에만(g42c.js 휴식 덤과 같은 자리).
     140레벨에서는 이 경험치가 그대로 룬 각인 막대로 간다(rune21.js).
   · 가-2 떠도는 강자: 실제 시각 30분마다 100~140 땅 여섯(재가 내리는 고원 · 불 꺼진 왕도 · 유리얼음 호수 · 구름 첨봉 · 대강 밀림 · 오로라 빙관) 가운데 하나에
     이름 있는 강자가 나타난다(지옥에서만 · 누구나 같은 곳). 그 땅 끝 레벨 +12(적어도 142), 생명력 정예의 5배, 크기 1.6배. 30분 안에 캐릭터마다 한 번 잡을 수 있다.
     화면 가장자리 화살표로 방향과 거리, 세계 지도에 ★. 잡으면 정예 장비 둘(하나는 희귀 이상) · 재의 결정 5 · 룬석 하나 · 업적 수(P.g100.st).
     같이 하기: 몬스터는 방장이 부른다(다른 몬스터와 같음). 보상은 각자 화면(rewardKill).
   · 가-5 위험 색: 세계 지도 칸 왼쪽 위에 내 레벨과 비교한 점(초록 쉬움 · 노랑 비슷 · 주황 강함 · 빨강 위험), 맵 끝 포탈 이름 뒤에 같은 말.
   · 저장: P.g100.st(잡은 수) · P.g100.d.st(마지막으로 잡은 30분 칸 번호). */
const G100B={xpFrom:130,xpPer:.02,xpMax:.4,slot:1800,stAdd:12,stMin:142,stHp:5,stSc:1.6,
  regs:['plateau','capital','r110_lake','r110_peak','r110_jungle','r110_aurora'],st:null,kx:0};
// 떠도는 강자 여섯 (수치는 일식 · 3차 땅 준보스를 빌림 · 준보스 표시는 붙이지 않아 들판 몬스터처럼 다룸)
{const W=k=>WX_TYPES[k]||TYPES[k],mk=(id,base,o)=>{const s=W(base)||W('ec_paladin');TYPES[id]={...s,...o,boss:0,mini:0,summon:null,skills:null,reg:1,stg:1}};
 mk('st_plateau','ec_hound',{n:'잿빛 갈기 늑대왕 카르',draw:'wolf',col:'#6a6058',eye:'#ff8a3a'});
 mk('st_capital','ec_paladin',{n:'꺼진 왕관의 기사 오델',draw:'knight',col:'#2a2a30',eye:'#ffd76a'});
 mk('st_lake','ec_maw',{n:'얼음 밑 큰메기 무르',draw:'serpent',col:'#7a9ab0',eye:'#e8f8ff'});
 mk('st_peak','ec_hound',{n:'구름 깎는 독수리왕 세하',draw:'imp',col:'#5a4a3a',eye:'#ffe8a0',alt:'goblin'});
 mk('st_jungle','ec_hound',{n:'밤 숲의 재규어 여왕 이차',draw:'panther',col:'#1e1a14',eye:'#ffd040'});
 mk('st_aurora','ec_maw',{n:'오로라 먹는 흰곰 눈발톱',draw:'yeti',col:'#eef4f8',eye:'#7affc8',alt:'ogre'});
 for(const k of ['st_plateau','st_capital','st_lake','st_peak','st_jungle','st_aurora'])if(!MON[TYPES[k].draw])TYPES[k].draw=TYPES[k].alt||'wolf';
 if(typeof WX21_EL==='object'){const E={st_plateau:'fire',st_capital:'dark',st_lake:'ice',st_peak:'storm',st_jungle:'earth',st_aurora:'ice'};Object.assign(WX21_EL,E);for(const k in E)TYPES[k].el=E[k]}}
const g100StSlot=()=>Math.floor(g100Now()/G100B.slot);
const g100StReg=s=>{s=s==null?g100StSlot():s;return G100B.regs[v20Hash('g100st|'+s)%G100B.regs.length]};
const g100StKey=r=>'st_'+(r.startsWith('r110_')?r.slice(5):r);
const g100StDone=()=>{const s=g100S();return (s.d.st|0)===g100StSlot()};
const g100StLeft=()=>G100B.slot-(g100Now()%G100B.slot);
function g100StLv(r){const D=REGIONS[r];return Math.max(G100B.stMin,D?D.base+40+(D.zcap||8)+G100B.stAdd:140)}
function g100StSpot(r){const L=RCACHE[r],s=mulberry(v20Hash('g100sp|'+g100StSlot()+r)%1000003),T=L&&L.town;for(let i=0;i<200;i++){const x=700+s()*4600,y=700+s()*4600;
  if(T&&Math.hypot(x-T.x,y-T.y)<SAFE+900)continue;if(blockedAt(x,y))continue;if(L&&L.lq){const pv=LQ;LQ=L.lq;const w=liqAt(x,y)>.1;LQ=pv;if(w)continue}return{x,y}}return{x:WORLD/2,y:WORLD/2}}
function g100StTick(){if(DG||IN||NET.guest||P.diff!==2){return}const r=REG.id;const want=g100StReg();
  if(G100B.st&&(G100B.st.dead||!enemies.includes(G100B.st)||G100B.st.slot!==g100StSlot()||G100B.st.reg!==r)){if(G100B.st.slot!==g100StSlot()&&enemies.includes(G100B.st)&&!G100B.st.dead)G100B.st.gone=true;G100B.st=null}
  if(G100B.st||r!==want||g100StDone())return;
  const p=g100StSpot(r),k=g100StKey(r),lv=g100StLv(r),e=dgMob(k,p.x,p.y,lv,{elite:true});e.hp=e.max=Math.round(e.hp*G100B.stHp);e.sc=G100B.stSc;e.r*=1.3;e.stg=1;e.slot=g100StSlot();e.reg=r;e.wx=p.x;e.wy=p.y;
  if(typeof g100Fix==='function')g100Fix(e);G100B.st=e;
  if(!G100V.said['st'+e.slot]){G100V.said['st'+e.slot]=1;banner={t:'떠도는 강자가 이 땅에 나타났습니다',sub:`${TYPES[k].n} · Lv${lv} · 화면 가장자리 화살표를 따라가세요`,col:'#ff9a6a',life:3,max:3}}}
{const _rk=rewardKill;rewardKill=function(e){const d=e&&TYPES[e.k]&&P?e.lvl-P.lvl:0;G100B.kx=P&&P.lvl>=G100B.xpFrom&&d>0?(1+Math.min(G100B.xpMax,G100B.xpPer*d))/Math.max(.05,xpUp21(d)):0;
  let r;try{r=_rk.apply(this,arguments)}finally{G100B.kx=0}
  try{if(P&&e&&e.stg){const s=g100S();s.d.st=e.slot||g100StSlot();s.st=g100Int(s.st+1);
    for(let i=0;i<2;i++){let it=makeItem(e.lvl,true);if(i===0)for(let k=0;k<6&&it&&(it.rar|0)<2;k++)it=makeItem(e.lvl,true);if(it)loot.push({x:e.x+rnd(-24,24),y:e.y+rnd(-24,24),kind:'item',item:it,t:0,keep:1})}
    if(typeof ashGain==='function')ashGain(5,e.x,e.y);if(typeof e22RuneRoll==='function')e22RuneGain(e22RuneRoll(6),1,e.x,e.y);
    banner={t:`${TYPES[e.k].n}을(를) 쓰러뜨렸습니다`,sub:'떠도는 강자 · 정예 장비 둘 · 재의 결정 5 · 룬석',col:'#ffd76a',life:3,max:3};save()}}catch(err){if(window.__QA)throw err}return r}}
{const _gx=gainXp;gainXp=function(n){if(G100B.kx&&n>0){n=Math.round(n*G100B.kx);G100B.kx=0}return _gx.apply(this,[n,...[...arguments].slice(1)])}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(!P||paused)return r;try{G100B.t=(G100B.t||0)-dt;if(G100B.t<=0){G100B.t=.5;g100StTick();g100DangerLabels()}}catch(e){if(window.__QA)throw e}return r}}
// 화살표 (화면 가장자리)
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);try{const e=G100B.st;if(DG||IN||!e||e.dead||!e._s)return;const s=e._s;if(s.x>40&&s.y>40&&s.x<W-40&&s.y<H-40)return;S();
  const cx=W/2,cy=H/2,a=Math.atan2(s.y-cy,s.x-cx),m=Math.min((W/2-50)/Math.abs(Math.cos(a)||1e-6),(H/2-60)/Math.abs(Math.sin(a)||1e-6)),x=cx+Math.cos(a)*m,y=cy+Math.sin(a)*m,d=Math.round(dist(P,e)/10);
  ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#ff9a6a';ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-8,-10);ctx.lineTo(-3,0);ctx.lineTo(-8,10);ctx.closePath();ctx.fill();ctx.restore();
  ctx.font=`600 12px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';const t=`떠도는 강자 ${d}m`;ctx.strokeText(t,x-Math.cos(a)*30,y-Math.sin(a)*22);ctx.fillStyle='#ffd0b0';ctx.fillText(t,x-Math.cos(a)*30,y-Math.sin(a)*22)}catch(err){if(window.__QA)throw err}}}
// 가-5 위험 색
const G100DG=[[-10,'쉬움','#7ad06a'],[4,'비슷','#ffd76a'],[14,'강함','#ff9a4a'],[999,'위험','#ff4a3a']];
function g100Danger(id){if(!P||!REGIONS[id]||id==='home')return null;const d=w3LvOf(id)-P.lvl;for(const g of G100DG)if(d<=g[0])return {n:g[1],c:g[2],d};return null}
/* 속성 글자(wx21.js 「· 냉기」)가 늘 맨 끝에 오게 그 앞에 넣는다 · w3Labels가 글자를 새로 써도 0.5초 안에 다시 붙음 */
function g100DangerLabels(){if(DG||IN||!REG)return;const L=RCACHE[REG.id];if(!L||!L.edges)return;
  for(const e of L.edges){if(typeof e.label!=='string'||e.to==='home')continue;let t=e.label.replace(/ · (쉬움|비슷|강함|위험)(?= · | *$)/g,'');const g=e.w3s?null:g100Danger(e.to);
    if(g){const x=typeof wx21ElTag==='function'?wx21ElTag(e.to):null;t=x&&t.endsWith(x.t)?t.slice(0,-x.t.length)+` · ${g.n}`+x.t:t+` · ${g.n}`}if(t!==e.label)e.label=t}}
{const _w=wmapWorld22;wmapWorld22=function(g,Wd,Hd){const r=_w.apply(this,arguments);try{const G=WMAP.geo;if(!G||!P)return r;const sr=P.diff===2?g100StReg():null;
  for(const id in REGIONS){if(!WPOS[id]||id==='home')continue;const p=G.pos(id),L=p.x-G.w/2,T=p.y-G.h/2,dg=g100Danger(id);if(dg){g.fillStyle=dg.c;g.beginPath();g.arc(L+8,T+8,4,0,6.283);g.fill()}
    if(id===sr){g.font=`700 ${G.fs+2}px ${FONT}`;g.textAlign='right';g.fillStyle=g100StDone()?'#7a7468':'#ff9a6a';g.fillText('★',L+G.w-4,T+G.fs+3)}}
  }catch(e){if(window.__QA)throw e}return r}}
window.__g100b={G100B,g100StReg,g100StTick,g100Danger,g100StDone};
