/* ---------- v21 HUNT: 잿빛 메아리 (설계: rpg/endgame/엔드컨텐츠-설계서.md 3절 B2) ----------
   날마다(사용자 컴퓨터 날짜 · 누구나 같음) 옛 지역 12곳 가운데 둘이 지옥 난이도의 140레벨 캐릭터에게 「잿빛 메아리」판이 된다.
   · 6일이 한 바퀴: 한 바퀴 안에서 12곳이 꼭 한 번씩 (씨앗 v20Hash('echo21|'+바퀴)) → 「오늘 메아리는 정글이랑 빙원이네」
   · 들판 Lv136~140, 지역 던전 둘 136/138(보스 +2), 지역 우두머리 = 「메아리 군주」(Lv142 · 「잿빛 메아리」 장치 하나 더)
   · 세기는 불 꺼진 왕도에 맞춘다: 들판 몬스터 ×(왕도 평균 / 그 지역 평균), 준보스 · 보스 · 우두머리는 왕도 쪽 평균으로. 피해는 왕도 들판 최대를 넘지 않음(한 대 상한)
   · 몬스터 종류(키)는 그대로 → 의뢰 · 도감 · 책 · 현상금 처치 판정이 그대로 맞는다. 색만 재·잿불 빛으로(그리기 때만 바꿈) + 땅에 잿빛 막과 잿가루
   · 재의 결정이 조금 더(dark21 darkAshN), 큰 지도 · 미니맵 · 포탈 이름에 잿빛 표시, 현상금 게시판 「상급 현상금」 하루 셋
   · 같이 하기: 방장 기준(방장이 지옥 · 140일 때). 참가자는 h21 메시지의 ec 목록을 쓴다. */
const ECHO_REGS=['plains','forest','desert','ice','jungle','lava','sea','moor','highland','canyon','cliffs','abyss'];
const EC={on:false,ld:'',lv:[],dn:null,dnAt:0,B:null,K:{},A:{},tint:{},bt:{},key:'',lk:'',mmT:0};
const WXD=new Set((typeof WX_DUNGEONS!=='undefined'?WX_DUNGEONS:[]).filter(d=>ECHO_REGS.includes(d.reg)).map(d=>d.id));
/* ===== 오늘의 메아리 ===== */
function echoDayNum(day){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day||''));if(!m)return 0;return Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5)}
function echoToday(day){const n=echoDayNum(day||v20Day()),cyc=Math.floor(n/6),i=((n%6)+6)%6,r=v20Rng(v20Hash('echo21|'+cyc)),o=ECHO_REGS.slice();
  for(let k=o.length-1;k>0;k--){const j=Math.floor(r()*(k+1));const x=o[k];o[k]=o[j];o[j]=x}return[o[2*i],o[2*i+1]]}
function echoDayStr(){const now=v20Now();if(EC.dn==null||V20.qaNow!=null||Math.abs(now-EC.dnAt)>1000){EC.dnAt=now;EC.dn=v20Day(now)}return EC.dn}
// 지금 이 캐릭터에게 메아리인 지역 (방장/혼자: 지옥 · 140레벨일 때 오늘의 둘 · 참가자: 방장이 보낸 목록)
function echoList(){if(!P)return[];if(NET.guest){const h=D21.h;return h&&time-h.at<6?h.ec:[]}
  if(P.diff!==2||P.lvl<MAXLV)return[];const d=echoDayStr();if(EC.ld!==d){EC.ld=d;EC.lv=echoToday(d)}return EC.lv}
const echoOn=id=>!!id&&echoList().includes(id);
const echoDg=d=>!!(d&&WXD.has(d.id)&&echoOn(d.reg));
function echoHere(){if(!P||IN)return false;return DG?echoDg(DG.d):echoOn(REG.id)}
const ecReg=()=>DG&&DG.d?DG.d.reg:REG.id;
const ecDgLvl=d=>d.at==='deep'?98:96;// 보통 단위 (+지옥 40 → 136/138, 보스 +2)
/* ===== 세기: 불 꺼진 왕도에 맞추기 ===== */
function ecBase(){if(EC.B)return EC.B;const av=(ks,f)=>{const a=ks.map(k=>TYPES[k]).filter(Boolean);return a.length?a.reduce((s,t)=>s+f(t),0)/a.length:1};
  const grp=ks=>({hp:av(ks,t=>t.hp),dmg:av(ks,t=>t.dmg),xp:av(ks,t=>t.xp)});
  const mob=['z_panther','z_guard','z_golem','z_mage'],B={mob:grp(mob),mini:grp(['m_w3scribe','m_w3doll','m_w3gate','m_w3widow']),boss:grp(['b_w3dean','b_w3regent'])};
  B.mob.dmax=Math.max(...mob.filter(k=>TYPES[k]).map(k=>TYPES[k].dmg));const ks=TYPES.r_kingshade||{hp:2600,dmg:34,xp:1400};B.lord={hp:Math.round(ks.hp*1.15),dmg:ks.dmg,xp:ks.xp};return EC.B=B}
function ecRegAvg(reg){if(EC.A[reg])return EC.A[reg];const ks=((REGIONS[reg]&&REGIONS[reg].mobs)||[]).filter(k=>TYPES[k]),n=Math.max(1,ks.length),s=f=>ks.reduce((a,k)=>a+f(TYPES[k]),0)/n;
  return EC.A[reg]=ks.length?{hp:s(t=>t.hp),dmg:s(t=>t.dmg),xp:s(t=>t.xp)}:ecBase().mob}
function ecK(k,reg){const t=TYPES[k];if(!t)return{hp:1,dmg:1,xp:1};const key=k+'|'+reg;if(EC.K[key])return EC.K[key];const B=ecBase();let f;
  const to=b=>({hp:b.hp/Math.max(1,t.hp),dmg:t.dmg>0?b.dmg/t.dmg:1,xp:t.xp>0?b.xp/t.xp:1});
  if(k.startsWith('r_')&&t.reg)f=to(B.lord);else if(t.boss)f=to(B.boss);else if(t.mini)f=to(B.mini);
  else{const A=ecRegAvg(reg);f={hp:B.mob.hp/A.hp,dmg:t.dmg>0?Math.min(t.dmg*B.mob.dmg/A.dmg,B.mob.dmax)/t.dmg:1,xp:B.mob.xp/A.xp}}
  return EC.K[key]=f}
function ecNorm(e){if(!e||e.ec)return;const f=ecK(e.k,ecReg());e.hp=Math.round(e.hp*f.hp);e.max=Math.round(e.max*f.hp);e.dmg*=f.dmg;e.ec=1;if(!DG&&REG.boss&&e.k===REG.boss)e.ecl=1}
const ecXpK=k=>ecK(k,ecReg()).xp;
/* ===== 레벨: 들판 136~140 · 던전 136/138 ===== */
{const _la=levelAt;levelAt=function(x,y){if(!DG&&REG.id!=='home'&&echoOn(REG.id)){let l=100;for(const t of TOWNS){const d=Math.hypot(x-t.x,y-t.y);l=Math.min(l,96+Math.min(4,Math.max(0,d-SAFE)/280))}return l}return _la.apply(this,arguments)}}
{const _ed=enterDungeon;enterDungeon=function(c){const d=c&&c.cave;if(d&&!NET.guest&&WXD.has(d.id)&&d.reg===REG.id&&echoOn(d.reg)){const l0=d.lvl;d.lvl=ecDgLvl(d);try{return _ed.apply(this,arguments)}finally{d.lvl=l0}}return _ed.apply(this,arguments)}}
const ecLvlSwap=fn=>{const sw=[];if(!DG&&echoOn(REG.id))for(const c of CAVES){const d=c.cave;if(d&&WXD.has(d.id)&&d.reg===REG.id){sw.push([d,d.lvl]);d.lvl=ecDgLvl(d)}}try{return fn()}finally{for(const [d,l] of sw)d.lvl=l}};
{const _w=w3LvOf;w3LvOf=function(id){return echoOn(id)?136:_w.apply(this,arguments)}}
/* ===== 메아리 군주: 지역 우두머리 + 「잿빛 메아리」 ===== */
{const _rt=regionTick;regionTick=function(dt){const b0=REG.bossE;const r=_rt.apply(this,arguments);
  if(!b0&&REG.bossE&&!NET.guest&&echoOn(REG.id)){const t=TYPES[REG.boss];banner={t:`메아리 군주 · ${t.n}`,sub:`${REG.n}의 잿빛 메아리 · Lv${REG.bossE.lvl} · 「잿빛 메아리」를 울립니다`,col:'#e0d0c0',life:2.8,max:2.8}}return r}}
function ecLordTick(dt){if(NET.guest||DG)return;const e=REG.bossE;if(!e||e.dead||!e.ecl||!e.aggroed||e.hp<=0||e.stunT>0||e.freezeT>0||e.brk>0)return;
  e.ecT=(e.ecT==null?8:e.ecT)-dt;if(e.ecT>0)return;const pl=netPlayers(),solo=pl.length<=1;e.ecT=solo?19:15;
  for(const p of pl)if(dist(p,e)<1000)warns.push({x:p.x,y:p.y,rad:150,t:2.2,max:2.2,dmg:e.dmg*1.8,col:'#d8c8b8',src:e});
  warns.push({x:e.x,y:e.y,rad:230,t:2.2,max:2.2,dmg:e.dmg*2,col:'#d8c8b8',src:e});e.cast=.6;rings.push({x:e.x,y:e.y,r:10,max:260,life:.9,col:'#e0d0c0'});shake=Math.max(shake,5);
  darkSay('메아리 군주가 「잿빛 메아리」를 울립니다 — 발밑의 잿빛 원과 군주 곁에서 벗어나세요','#e0d0c0')}
V20.tick.push(dt=>{EC.on=echoHere();if(EC.on)d21Try(()=>ecLordTick(dt))});
const ecIsLord=e=>!!(e&&!DG&&EC.on&&String(e.k).startsWith('r_')&&TYPES[e.k]&&TYPES[e.k].reg);
/* ===== 그리기: 재 빛 몬스터 · 잿빛 막 · 이름 ===== */
function ecTintT(k){let t=EC.tint[k];if(t)return t;const o=TYPES[k];t=Object.assign({},o,{col:Kit.mix(o.col||'#808080','#5e5650',.6),eye:'#ff8a2a'});if(o.pcol)t.pcol='#ffa04a';if(o.aura)t.aura='rgba(255,150,80,.3)';return EC.tint[k]=t}
{const _dm=drawMon;drawMon=function(g,e,x,y,o){if(!EC.on||g!==ctx||!e||!TYPES[e.k])return _dm.apply(this,arguments);const k=e.k,t0=TYPES[k];TYPES[k]=ecTintT(k);try{return _dm.apply(this,arguments)}finally{TYPES[k]=t0}}}
function ecSky(){S();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='rgba(84,70,62,.16)';ctx.fillRect(-20,-20,W+40,H+40);
  const n=reduceMotion?16:(touchMode?28:48);ctx.fillStyle='#d8ccc0';
  for(let i=0;i<n;i++){const sp=16+(i%5)*6,fx=(i*97.31)%1,fy=(i*53.77)%1,x=(fx*(W+60)+time*(10+(i%3)*4)+Math.sin(time*.7+i)*12)%(W+60)-30,y=((fy*(H+40)+time*sp)%(H+40))-20;
    ctx.globalAlpha=.3+(i%4)*.09;const z=1.3+(i%3)*.7;ctx.fillRect(x,y,z,z)}ctx.globalAlpha=1}
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);if(EC.on&&!IN)d21Try(ecSky)}}
{const _l=drawV5Labels;drawV5Labels=function(){const r=ecLvlSwap(()=>_l.apply(this,arguments));if(!EC.on||DG)return r;ctx.textAlign='center';ctx.font='700 13px '+FONT;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';
  for(const e of enemies){if(e.dead||!e._s||!ecIsLord(e))continue;const s=e._s,t=TYPES[e.k];if(!onScreen(s,160))continue;const y=s.y-(MON_H[t.draw]||40)*(e.sc||2)-24;ctx.strokeText('메아리 군주',s.x,y);ctx.fillStyle='#e8dccc';ctx.fillText('메아리 군주',s.x,y)}return r}}
{const _uh=updateHud;updateHud=function(){_uh.apply(this,arguments);d21Try(()=>{if(!EC.on)return;const box=document.getElementById('target');if(!box||box.hidden)return;const hv=darkHv();if(!hv||!TYPES[hv.k])return;
  const tn=document.getElementById('tname'),ts=document.getElementById('tsub'),t=TYPES[hv.k];if(ecIsLord(hv)&&tn&&!tn.textContent.includes('메아리 군주'))tn.textContent=tn.textContent.replace(t.n,`메아리 군주 · ${t.n}`);
  if(ts&&!ts.textContent.includes('잿빛 메아리'))ts.textContent+=' · 잿빛 메아리'})}}
/* ===== 포탈 이름 · 들어올 때 알림 ===== */
V20.slowTick.push(()=>{if(!P)return;
  for(const e of EDGES||[]){if(!e||!ECHO_REGS.includes(e.to))continue;if(e.lb21==null)e.lb21=e.label;const on=echoOn(e.to),want=on?`잿빛 메아리 · ${REGIONS[e.to].n}로 · 지옥 Lv136~`:e.lb21;if(e.label!==want)e.label=want}
  const key=(DG?'d':REG.id)+'|'+(EC.on?1:0);if(key!==EC.key){EC.key=key;if(EC.on&&!DG){banner={t:`잿빛 메아리 · ${REG.n}`,sub:'몬스터 Lv136~140 · 둥지에 메아리 군주 · 재의 결정이 더 나옵니다',col:'#e0d0c0',life:2.8,max:2.8};msg(`오늘의 잿빛 메아리: ${REG.n}이(가) 140레벨 메아리판입니다`,'#e0d0c0')}}});
/* ===== 큰 지도 · 미니맵 ===== */
function ecWmap(){const el=$('#wmap');if(!el||el.hidden)return;const L=echoList();const cv=$('#wmapCv');if(!cv)return;const dp=Math.min(2,devicePixelRatio||1),Wd=cv.width/dp,Hd=cv.height/dp,g=cv.getContext('2d');g.setTransform(dp,0,0,dp,0,0);
  const lab=(x,y,t,c,sz)=>{g.font=`700 ${sz}px ${FONT}`;g.textAlign='center';g.lineWidth=3;g.strokeStyle='rgba(0,0,0,.85)';g.strokeText(t,x,y);g.fillStyle=c;g.fillText(t,x,y)};
  if(WMAP.tab==='world'){const G=WMAP.geo||wmapGeo(Wd,Hd),fs=G.fs;// v22 GFX: 칸 자리는 wmap22.js wmapGeo와 같이
    for(const id of L){if(!WPOS[id])continue;const p=G.pos(id),w=G.w,h=G.h;
      g.strokeStyle='#e0d0c0';g.lineWidth=2;g.setLineDash([3,3]);g.strokeRect(p.x-w/2-3,p.y-h/2-3,w+6,h+6);g.setLineDash([]);lab(p.x,p.y-h/2-6,'◈ 잿빛 메아리',`#e8dccc`,fs-2)}
    const lg=$('#wmapLeg');if(lg&&!lg.innerHTML.includes('잿빛 메아리')){const td=echoToday(echoDayStr()).map(id=>REGIONS[id].n).join(' · ');lg.innerHTML+=` <span style="color:#e0d0c0">◈ 잿빛 메아리</span> 오늘: ${td}${L.length?'':' (지옥 난이도 · 140레벨 캐릭터에게만)'}`}}
  else if(!DG&&L.length){const m=Math.min((Wd-30)/(WORLD*2*KI),(Hd-30)/(WORLD*KI)),ox=Wd/2,oy=Hd/2-WORLD*KI/2*m,S1=(x,y)=>({x:ox+(x-y)*KI*m,y:oy+(x+y)*KI/2*m});
    for(const e of EDGES)if(L.includes(e.to)){const s=S1(e.x,e.y);g.strokeStyle='#e0d0c0';g.lineWidth=2;g.beginPath();g.arc(s.x,s.y,12,0,6.283);g.stroke();lab(s.x,s.y+24,'◈ 잿빛 메아리','#e8dccc',11)}
    if(L.includes(REG.id))lab(Wd/2,18,`◈ 잿빛 메아리 · ${REG.n} · 몬스터 Lv136~140`,'#e8dccc',13)}}
{const _wd=wmapDraw;wmapDraw=function(){const r=ecLvlSwap(()=>_wd.apply(this,arguments));d21Try(ecWmap);return r}}
{const _dm=drawMinimap;drawMinimap=function(){const r=_dm.apply(this,arguments);d21Try(()=>{if(DG)return;const L=echoList();if(!L.length)return;const S0=mm.width,m=S0/2600,px=(P.x-P.y)*KI,py=(P.x+P.y)*KI/2;
  mctx.setTransform(m*KI,m*KI/2,-m*KI,m*KI/2,S0/2-m*px,S0/2-m*py);mctx.strokeStyle='#e0d0c0';mctx.lineWidth=40;
  for(const e of EDGES)if(L.includes(e.to)){mctx.beginPath();mctx.arc(e.x,e.y,190,0,6.283);mctx.stroke()}
  mctx.setTransform(1,0,0,1,0,0);if(EC.on){const f=Math.max(10,Math.round(S0/14));mctx.font=`700 ${f}px ${FONT}`;mctx.textAlign='center';mctx.lineWidth=3;mctx.strokeStyle='rgba(0,0,0,.85)';mctx.strokeText('◈ 잿빛 메아리',S0/2,f+4);mctx.fillStyle='#e8dccc';mctx.fillText('◈ 잿빛 메아리',S0/2,f+4)}});return r}}
/* ===== 상급 현상금 (현상금 게시판 · 140레벨) ===== */
const ECB_PRE=BTY_PRE.filter(p=>!p.startsWith('잿빛'));
function ecBtyBoard(reg){for(const b in BTY_BOARDS)if(BTY_BOARDS[b].reg===reg)return b;return null}
function ecBtyToday(day){if(EC.bt[day])return EC.bt[day];const L=echoToday(day),r=v20Rng(v20Hash('echo21b|'+day)),out=[],used={};
  for(let i=0;i<3;i++){const reg=i<2?L[i]:L[Math.floor(r()*2)],board=ecBtyBoard(reg),B=board&&BTY_BOARDS[board];if(!B||!B.mobs.length)continue;
    const u=used[reg]||(used[reg]=[]),pool=B.mobs.filter(k=>!u.includes(k)),k=(pool.length?pool:B.mobs)[Math.floor(r()*(pool.length||B.mobs.length))];u.push(k);
    out.push({id:`echo:${day}:${i}`,board,k,hi:1,pre:'잿빛 '+ECB_PRE[Math.floor(r()*ECB_PRE.length)],tint:'#d8c8b8',skill:BTY_SKILL[Math.floor(r()*BTY_SKILL.length)],ang:r()*Math.PI*2,dist:.35+r()*.5})}
  const ks=Object.keys(EC.bt);if(ks.length>6)delete EC.bt[ks[0]];return EC.bt[day]=out}
{const _b=btyById;btyById=function(id){if(typeof id==='string'&&id.startsWith('echo:')){const p=id.split(':');if(p.length!==3)return null;return ecBtyToday(p[1])[+p[2]]||null}return _b.apply(this,arguments)}}
{const _s=btySpawn;btySpawn=function(b){if(b&&b.hi){const reg=BTY_BOARDS[b.board]&&BTY_BOARDS[b.board].reg;if(!reg||REG.id!==reg||!echoOn(reg))return null}return _s.apply(this,arguments)}}
{const _c=btyCredit;btyCredit=function(id,e){if(typeof id==='string'&&id.startsWith('echo:'))return ecBtyCredit(id,e);return _c.apply(this,arguments)}}
function ecBtyCredit(id,e){const s=btyState(),b=btyById(id);if(!b||!s.took.includes(id)||s.done.includes(id))return false;s.done.push(id);s.tok+=3;
  const t=TYPES[b.k]||{xp:1},lvl=e&&e.lvl||P.lvl;gainXp(Math.max(1,Math.round(t.xp*(1+.35*(lvl-1))*DIFF[P.diff].xp*(BTY_MUL.xp-3))));
  if(typeof ashGain==='function')ashGain(5,e&&e.x!=null?e.x:P.x,e&&e.y!=null?e.y:P.y);
  if(e&&e.x!=null){loot.push({x:e.x+rnd(-20,20),y:e.y+rnd(-20,20),kind:'gold',amt:Math.round(lvl*BTY_MUL.gold*ri(2,4)),t:0});loot.push({x:e.x+rnd(-20,20),y:e.y+rnd(-20,20),kind:'item',item:makeItem(lvl,true),t:0})}
  banner={t:`상급 현상금 · ${btyName(b)}`,sub:`현상금 증표 +3 (가진 증표 ${s.tok}) · 재의 결정 · 하루 9개 한도 밖`,col:'#e0d0c0',life:3,max:3};
  rings.push({x:P.x,y:P.y,r:10,max:160,life:.8,col:'#e0d0c0'});msg(`상급 현상금을 잡았습니다: ${btyName(b)} · 증표 +3`,'#e0d0c0');if(typeof repGain==='function')repGain(b.board,'bounty');questHud();save();return true}
{const _t=V20A.btytake;V20A.btytake=function(id){if(typeof id==='string'&&id.startsWith('echo:')&&P.lvl<MAXLV)return;return _t.apply(this,arguments)}}
if(typeof ashGain==='function')BTY_SHOP.push({id:'ash',cost:3,n:'재의 결정 5개',d:'장비 재련 재료'});
if(typeof runeEraserGive==='function')BTY_SHOP.push({id:'eraser',cost:5,n:'각인 지우개',d:'룬 각인을 다시 찍기'});
{const _b=V20A.btybuy;V20A.btybuy=function(id){if(id!=='ash'&&id!=='eraser')return _b.apply(this,arguments);const s=btyState(),it=BTY_SHOP.find(x=>x.id===id);if(!it||s.tok<it.cost)return;
  if(id==='ash'){if(typeof ashGain!=='function')return;ashGain(5,P.x,P.y);msg('재의 결정 5개','#e0d0c0')}else{if(typeof runeEraserGive!=='function')return;runeEraserGive(1);msg('각인 지우개 1개','#e0d0c0')}
  s.tok-=it.cost;burst(P.x,P.y,'#e0d0c0',16,90,3,24);save()}}
function ecBtyHtml(){const s=btyState(),L=ecBtyToday(s.day),act=btyActive().length,ok=P.lvl>=MAXLV,E=echoToday(s.day).map(id=>REGIONS[id].n).join(' · ');
  let h=`<h2>상급 현상금 <span class="muted">· 잿빛 메아리</span></h2><p class="muted" style="font-size:12px;margin:2px 0 6px">오늘의 잿빛 메아리: <b style="color:#e8dccc">${E}</b> · 지옥 난이도의 140레벨 캐릭터에게 140레벨 메아리판이 됩니다. 상급 현상금은 메아리 지역에서만 나타나고, 잡으면 증표 3개(하루 9개 한도 밖)와 재의 결정 5개.</p>`;
  if(!ok)return h+'<p class="muted">140레벨이 되면 받을 수 있습니다.</p>';
  for(const b of L){const reg=BTY_BOARDS[b.board].reg,sp=btySpot(b),done=s.done.includes(b.id),took=s.took.includes(b.id),t=TYPES[b.k];
    const btn=done?'<button type="button" disabled>잡음 ✓</button>':took?v20Btn('btydrop',b.id,'포기',{cls:'ghost'}):v20Btn('btytake',b.id,'받기',{cls:'primary',dis:act>=BTY_CAP.took,title:act>=BTY_CAP.took?'동시에 3개까지':''});
    h+=`<div class="v20row"><div><span class="v20chip" style="background:${b.tint}"></span><b>${btyName(b)}</b> <span class="muted">· 기술 「${BTY_SKN[b.skill]}」</span><div class="muted" style="font-size:12px">${REGIONS[reg].n} (메아리) · ${btyDir(b,sp)} · ${t&&t.ranged?'멀리서 쏨':'가까이 붙음'}</div></div><div class="btns">${btn}</div></div>`}
  return h}
{const _h=V20P.bty.html;V20P.bty.html=function(board){const h=_h.apply(this,arguments);let x='';d21Try(()=>{x=ecBtyHtml()});const i=h.indexOf('<h2>증표 바꾸기');return i>=0?h.slice(0,i)+x+h.slice(i):h+x}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{EC,ECHO_REGS,WXD,echoToday,echoList,echoOn,echoHere,ecK,ecBase,ecBtyToday})}catch(_){}},0);
