/* ---------- v21 HUNT: 어둠 단계 1~10 (설계: rpg/endgame/엔드컨텐츠-설계서.md 3절 B1) ----------
   「재의 군주」를 처음 쓰러뜨리면(P.w3.lord>0) 꺼진 등대지기의 집에 「어둠의 등불」이 켜진다. 등불에서 단계를 고르면
   지옥의 140 지역(재가 내리는 고원 · 불 꺼진 왕도 · 그 던전 · 잿빛 메아리 지역과 그 던전 둘)이 그 단계가 된다.
   · 단계 t: 몬스터 생명력 +40%·t, 보스·준보스·던전 정예 피해 +6%·t, 경험치(각인) +15%·t, 아이템 찾기 +10%·t, 무리 +5%·t (모두 덧셈)
   · 들판 몬스터(정예 포함)의 한 대 피해는 단계와 상관없이 그대로 → 필드 한 대 상한 유지. 단계가 오르면 체력과 무리 수가 는다.
   · 5단계부터 정예에 수식어 하나(쇠 같은 피부 · 얼음 숨결 · 피를 마시는 · 불씨를 품은 · 되살아나는). 이름 앞에 붙고 발밑 고리 색이 다르다.
   · 단계 깨기: 그 단계에서 140 지역 던전 보스 하나 처치 → 다음 단계가 열린다 (파티원 각자 화면에서, 자기 열린 단계가 그 단계 이상일 때).
   · 재의 결정(ashGain, GROW): 140 지역에서 단계가 오를수록 더 (아래 darkAsh).
   · 같이 하기: 방장이 단계를 정하고 몬스터를 키운다. 참가자는 'v20x' h21 메시지로 단계 · 메아리 · 수식어를 받는다.
   저장: P.dark={open,cur,top} (없으면 기본값, 모르는 칸은 그대로 다시 씀). */
const DARK_MAX=10;
const DARK_ROW=t=>({hp:.4*t,dmg:.06*t,xp:.15*t,find:.1*t,pack:.05*t});
const DARK_AFX={
  iron:{pre:'쇠 같은 피부의',n:'쇠 같은 피부',col:'#b8c0cc',d:'생명력 +60%'},
  frost:{pre:'얼음 숨결의',n:'얼음 숨결',col:'#9fe0ff',d:'6초마다 둘레에 서리 원'},
  vamp:{pre:'피를 마시는',n:'피를 마시는',col:'#e0485a',d:'때릴 때마다 생명력 4% 회복'},
  ember:{pre:'불씨를 품은',n:'죽음의 불씨',col:'#ff8a3a',d:'쓰러진 자리에 불씨 원'},
  regen:{pre:'되살아나는',n:'되살아나는',col:'#8ae07a',d:'3초 동안 안 맞으면 생명력이 차오름'}};
const DARK_AFX_IDS=Object.keys(DARK_AFX);
const D21={xm:1,h:null,sendT:0,key:'',raw:false,lit:0};
window.__d21=D21;
const d21Try=f=>{try{return f()}catch(err){if(window.__QA)throw err}};
/* ===== 상태 · 저장 ===== */
function darkClean(raw){const o=raw&&typeof raw==='object'&&!Array.isArray(raw)?Object.assign({},raw):{};const n=(v,a,b)=>Number.isFinite(+v)?clamp(Math.floor(+v),a,b):a;
  o.open=n(o.open,0,DARK_MAX);o.top=n(o.top,0,DARK_MAX);o.cur=n(o.cur,0,o.open);return o}
function darkSt(){if(!P.dark||typeof P.dark!=='object'||Array.isArray(P.dark))P.dark=darkClean(null);return P.dark}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);d21Try(()=>{if(d&&P&&P.dark){const s=darkClean(P.dark);if(s.open>0||D21.raw)d.dark=s}});return d}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok){D21.raw=!!(d&&d.dark);P.dark=darkClean(d&&d.dark);if(P.w3&&(P.w3.lord|0)>0&&P.dark.open<1)P.dark.open=1;D21.h=null}return ok}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);if(P){P.dark=darkClean(null);D21.raw=false;D21.h=null}return r}}
/* ===== 지금 어디 · 몇 단계 ===== */
const D21_W3=new Set(['plateau','capital']);
// 140 던전: 고원·왕도 던전(재의 왕좌 포함, 시험의 방 · 3차 시험 방 제외) 또는 오늘 메아리 지역의 던전 둘
function darkDgOk(d){if(!DG||!d||DG.j3t||(DG.ci|0)>=900)return false;if(typeof W3_DG!=='undefined'&&W3_DG.has(d.id))return d.w3k!=='trial';return echoDg(d)}
function darkHere(){if(!P||IN)return false;
  if(NET.guest){const h=D21.h;return !!(h&&h.dh&&h.a===netArea()&&time-h.at<6)}
  if(P.diff!==2)return false;if(DG)return darkDgOk(DG.d);return D21_W3.has(REG.id)||echoHere()}
function darkTier(){if(!P)return 0;if(NET.guest){const h=D21.h;return h&&h.dh&&h.a===netArea()&&time-h.at<6?h.t|0:0}
  if(!darkHere())return 0;const s=darkSt();return Math.min(s.cur|0,s.open|0)}
function darkMods(t){if(t==null)t=darkTier();return DARK_ROW(clamp(t|0,0,DARK_MAX))}
/* ===== 몬스터 키우기 (방장 · 혼자): 처음 움직이기 전에 한 번 ===== */
function darkScan(){let t=-1,M=null,ec=false;
  for(const e of enemies){if(e.d21||e.dead)continue;e.d21=1;if(e.qa||e.net)continue;
    if(t<0){t=darkTier();M=DARK_ROW(t);ec=echoHere()}
    if(ec)ecNorm(e);
    if(t<=0)continue;e.d21t=t;const T=TYPES[e.k]||{};let hk=M.hp;
    if(t>=5&&e.elite&&!e.bty&&!T.boss&&!T.mini&&!e.afx){e.afx=pick(DARK_AFX_IDS);if(e.afx==='iron')hk+=.6}
    e.hp=Math.round(e.hp*(1+hk));e.max=Math.round(e.max*(1+hk));
    // 피해: 보스 · 준보스(지역 우두머리 포함) 어디서나, 정예는 던전 안에서만. 들판 몬스터 · 들판 정예는 그대로(한 대 상한)
    if(T.boss||T.mini||(DG&&e.elite))e.dmg*=1+M.dmg}}
function darkAfxTick(dt){for(const e of enemies){if(!e.afx||e.dead)continue;
  if(e.afx==='frost'){if(!e.aggroed||e.freezeT>0||e.stunT>0)continue;e.afT=(e.afT==null?3:e.afT)-dt;if(e.afT>0)continue;e.afT=6;
    if(netPlayers().some(o=>dist(o,e)<320)){warns.push({x:e.x,y:e.y,rad:130,t:1.1,max:1.1,dmg:e.dmg*.9,col:'#9fe0ff',src:e});rings.push({x:e.x,y:e.y,r:6,max:130,life:.5,col:'#cff4ff'})}}
  else if(e.afx==='regen'){if(e.hurt>0)e.afH=0;else{e.afH=(e.afH||0)+dt;if(e.afH>3&&e.hp<e.max)e.hp=Math.min(e.max,e.hp+e.max*.015*dt)}}}}
{const _ue=updateEnemies;updateEnemies=function(dt){d21Try(()=>{darkScan();darkAfxTick(dt)});return _ue.apply(this,arguments)}}
const darkVamp=src=>{if(!NET.guest&&src&&src.afx==='vamp'&&!src.dead&&src.hp>0){src.hp=Math.min(src.max,src.hp+src.max*.04);if(R()<.5)burst(src.x,src.y,'#e0485a',6,60,2,20)}};
{const _hp=hitPlayer;hitPlayer=function(d,src){const h0=P.hp,r=_hp.apply(this,arguments);if(P.hp<h0)darkVamp(src);return r}}
{const _nh=netHit;netHit=function(r,d,src){const x=_nh.apply(this,arguments);darkVamp(src);return x}}
{const _ke=killE;killE=function(e){const r=_ke.apply(this,arguments);if(e&&e.afx==='ember'&&!NET.guest){warns.push({x:e.x,y:e.y,rad:120,t:1.2,max:1.2,dmg:e.dmg,col:'#ff8a3a',src:e});rings.push({x:e.x,y:e.y,r:6,max:120,life:.6,col:'#ff8a3a'})}return r}}
// 무리 +5%·t: 던전은 방마다 졸개를 더 세운다 (들판은 b3.js 생성 목표 수에 곱함)
{const _ed=enterDungeon;enterDungeon=function(c){const r=_ed.apply(this,arguments);d21Try(()=>{if(!DG||NET.guest||DG.kept22)return;/* v22: 기억해 둔 던전에 다시 들어갈 땐 무리를 또 더하지 않음 */const t=darkTier();if(t<=0)return;const p=darkMods(t).pack;
  const base=enemies.filter(e=>!e.dead&&!TYPES[e.k].boss&&!TYPES[e.k].mini),n=Math.round(base.length*p),mobs=(DG.d.mobs||[]).filter(k=>TYPES[k]);DG.d21x=0;if(!mobs.length)return;
  for(let i=0;i<n;i++){const o=pick(base);if(!o)break;const x=o.x+rnd(-40,40),y=o.y+rnd(-40,40);if(!dgFree(x,y,14))continue;dgMob(pick(mobs),x,y,DG.lvl);DG.d21x++}});return r}}
/* ===== 경험치 · 재의 결정 ===== */
{const _gx=gainXp;gainXp=function(n){if(D21.xm!==1&&n>0)n=Math.max(1,Math.round(n*D21.xm));return _gx.apply(this,[n].concat([].slice.call(arguments,1)))}}
// 어둠 단계 경험치: 140 아래는 여기서 ×(1+xp). 140(각인)은 GROW(rune21.js)가 각인 경험치에 darkMods().xp를 더한다 → 두 번 세지 않음. 메아리 맞춤(ecXpK)은 늘
{const _rk=rewardKill;rewardKill=function(e){const k0=D21.xm;let k=1;d21Try(()=>{if(e&&P&&!GHOST)k=(P.lvl<MAXLV?1+darkMods().xp:1)*(echoHere()?ecXpK(e.k):1)});D21.xm=k;
  try{_rk.apply(this,arguments)}finally{D21.xm=k0}d21Try(()=>{if(e&&P&&!GHOST)darkAsh(e)})}}
// 재의 결정 굴림 (각자 화면). 근거: 1시간 사냥(들판 ~500마리 · 던전 4번)에 단계 0 ≈ 35개, 단계 10 ≈ 150개 → 재련 몇 번 (설계 4절 「매일 재련 한두 번」)
function darkAshN(e,t,ec){const T=TYPES[e.k]||{},k=String(e.k||'');
  if(k.startsWith('r_')&&T.reg)return ec?5+t:2+(t>>1);
  if(T.boss)return 3+t+(ec?2:0);
  if(T.mini)return 1+Math.floor(t/3)+(ec?1:0);
  if(e.bty)return 0;
  if(e.elite)return R()<.25+.05*t?1+(R()<t/10?1:0):0;
  return R()<(.015+.005*t)*(ec?1.5:1)?1:0}
function darkAsh(e){if(typeof ashGain!=='function'||!darkHere())return 0;const n=darkAshN(e,darkTier(),echoHere());if(n>0)ashGain(n,e.x,e.y);return n}
/* ===== 단계 깨기: 그 단계에서 140 던전 보스 처치 ===== */
function darkClear(t){const s=darkSt();t=clamp(t|0,1,DARK_MAX);const first=t>(s.top|0);if(first)s.top=t;let opened=false;
  if(s.open>=t&&t<DARK_MAX&&s.open<t+1){s.open=t+1;opened=true}
  if(first&&typeof ashGain==='function')ashGain(10+5*t,P.x,P.y);
  const sub=`어둠 ${t}단계를 깼습니다${opened?` · ${t+1}단계가 열렸습니다 (어둠의 등불)`:t>=DARK_MAX&&first?' · 가장 깊은 어둠':''}`;
  msg(sub+(first?' · 첫 클리어 보상 재의 결정':''),'#c8a0ff');if(banner&&banner.life>0)banner.sub=(banner.sub?banner.sub+' · ':'')+sub;rings.push({x:P.x,y:P.y,r:10,max:160,life:.9,col:'#b48aff'});save();return first||opened}
{const _bd=dgBossDrop;dgBossDrop=function(e){const r=_bd.apply(this,arguments);d21Try(()=>{const T=e&&TYPES[e.k];if(T&&T.boss&&DG&&P&&!GHOST){const t=darkTier();if(t>0)darkClear(t)}});return r}}
/* ===== 어둠의 등불 (꺼진 등대지기의 집) ===== */
twDef('d21lamp',70,140,35,128,(g,v)=>{Kit.shadow(g,4,3,26,9,.9);
  twBox(g,0,0,0,30,30,12,'#4a4450',{tex:'stone',texA:.55});twBox(g,0,0,12,20,20,6,'#5a5262',{tex:'stone',texA:.5});
  twCyl(g,0,0,18,3.2,70,'#2a2630',{});const top=isoP(0,0,88);
  g.fillStyle='#1e1a24';g.fillRect(top.x-11,top.y-2,22,4);g.fillStyle='rgba(120,90,180,.35)';g.fillRect(top.x-9,top.y-24,18,22);
  g.strokeStyle='#2a2630';g.lineWidth=2;g.strokeRect(top.x-9,top.y-24,18,22);g.beginPath();g.moveTo(top.x,top.y-24);g.lineTo(top.x,top.y-2);g.stroke();
  g.fillStyle='#2a2630';g.beginPath();g.moveTo(top.x-13,top.y-24);g.lineTo(top.x,top.y-36);g.lineTo(top.x+13,top.y-24);g.closePath();g.fill();g.fillStyle='#8a70b8';g.fillRect(top.x-1.5,top.y-41,3,5)});
D21.lamp=null;
function darkPlaceLamp(){if(D21.lamp)return D21.lamp;const d=v20AddProp('keeperhouse',150,110,{k:'d21lamp',pv:0,use:'d21:lamp',qonly:1});if(d){D21.lamp=d;v20SyncDecor()}return d}
darkPlaceLamp();
const darkLit=()=>!!(P&&P.dark&&(P.dark.open|0)>0);
{const _l=sqUseLive;sqUseLive=function(d){if(d&&d.use==='d21:lamp')return darkLit()?{label:`어둠의 등불${(P.dark.cur|0)?` · ${P.dark.cur}단계`:''}`,col:'#b48aff',q:0}:null;return _l(d)}}
{const _u=sqUse;sqUse=function(d){if(d&&d.use==='d21:lamp'){if(darkLit())v20Open('d21');return}return _u(d)}}
{const _p=twDrawProp;twDrawProp=function(d){const r=_p.apply(this,arguments);if(d&&d.k==='d21lamp'&&darkLit()&&d._s){const s=d._s,cur=P.dark.cur|0;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55+.25*Math.sin(time*3);glow(s.x,s.y-112,18+cur*2.2,'#b48aff');ctx.globalAlpha=.9;ctx.drawImage(flameCv('#b48aff',Math.floor(time*10)&3),s.x-7,s.y-126,14,22);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}return r}}
const darkPct=v=>`+${Math.round(v*100)}%`;
V20P.d21={title:()=>'어둠의 등불',html(){const s=darkSt(),g=NET.guest,cur=s.cur|0,ht=darkTier();
  let h=`<p class="muted" style="margin-top:0">단계를 고르면 <b>지옥</b>의 140 지역(재가 내리는 고원 · 불 꺼진 왕도 · 그 던전 · 잿빛 메아리 지역과 그 던전)이 그 단계로 바뀝니다. 그 단계에서 던전 보스 하나를 쓰러뜨리면 다음 단계가 열립니다.<br>들판 몬스터의 한 대 피해는 그대로이고 체력과 무리 수가 늘어납니다. 피해가 오르는 것은 보스 · 준보스와 던전 정예뿐입니다. 5단계부터 정예에게 수식어가 하나씩 붙습니다. 2~3인이면 한두 단계 위도 갈 만합니다.</p>`;
  h+=`<div class="v20box"><b>지금: ${cur?`어둠 ${cur}단계`:'꺼짐 (지옥 그대로)'}</b> <span class="muted">· 열린 단계 ${s.open} · 깬 가장 높은 단계 ${s.top|0}${P.diff!==2?' · 지옥 난이도에서만 바뀝니다':''}</span>${g?`<div class="muted" style="margin-top:4px">같이 하기: 방장이 고른 단계를 따릅니다 (지금 ${ht?ht+'단계':'꺼짐'})</div>`:''}</div>`;
  h+=`<div class="v20row"><div><b>끄기</b> <span class="muted" style="font-size:12px">· 지옥 그대로</span></div><div class="btns">${cur===0?'<button type="button" disabled>고름</button>':v20Btn('d21set',0,'고르기',{dis:g})}</div></div>`;
  for(let t=1;t<=DARK_MAX;t++){const M=DARK_ROW(t),open=t<=s.open,clr=t<=(s.top|0);
    h+=`<div class="v20row"><div><b style="color:${open?'#c8a0ff':'#7a7468'}">어둠 ${t}단계</b>${clr?' <span class="muted">✓ 깸</span>':''}<div class="muted" style="font-size:12px">몬스터 생명력 ${darkPct(M.hp)} · 보스·정예 피해 ${darkPct(M.dmg)} · 경험치·각인 ${darkPct(M.xp)} · 아이템 찾기 ${darkPct(M.find)} · 무리 ${darkPct(M.pack)}${t>=5?' · 정예 수식어':''}</div></div><div class="btns">${
      !open?`<button type="button" disabled title="${t-1}단계를 깨면 열림">잠김</button>`:cur===t?'<button type="button" disabled>고름</button>':v20Btn('d21set',t,'고르기',{cls:'primary',dis:g})}</div></div>`}
  h+=`<p class="muted" style="font-size:12px">정예 수식어: ${DARK_AFX_IDS.map(k=>`<span style="color:${DARK_AFX[k].col}">${DARK_AFX[k].n}</span>(${DARK_AFX[k].d})`).join(' · ')}</p>`;return h}};
V20A.d21set=v=>{if(NET.guest)return;const s=darkSt(),t=Math.floor(+v);if(!(t>=0&&t<=s.open))return;s.cur=t;
  msg(t?`어둠 ${t}단계를 골랐습니다 · 지옥 140 지역에서 새로 나오는 몬스터부터 바뀝니다`:'어둠 단계를 껐습니다','#c8a0ff');burst(P.x,P.y,'#b48aff',20,100,3,24);D21.sendT=0;save()};
/* ===== 표시: 수식어 고리 · 이름 · 대상 칸 ===== */
{const _d=drawEnemy;drawEnemy=function(e){if(e&&e.afx&&e._s){const A=DARK_AFX[e.afx];if(A){const R0=monRing(A.col),r=e.r*1.75;ctx.drawImage(R0.cv,e._s.x-r,e._s.y-r*.5,r*2,r)}}return _d.apply(this,arguments)}}
{const _l=drawV5Labels;drawV5Labels=function(){_l.apply(this,arguments);if(!P)return;ctx.textAlign='center';ctx.font='700 12px '+FONT;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';
  for(const e of enemies){if(e.dead||!e.afx||!e._s)continue;const A=DARK_AFX[e.afx],t=TYPES[e.k];if(!A||!t)continue;const s=e._s;if(!onScreen(s,120))continue;
    const y=s.y-(MON_H[t.draw]||40)*(e.sc||1.25)-18,n=`${A.pre} ${t.n}`;ctx.strokeText(n,s.x,y);ctx.fillStyle=A.col;ctx.fillText(n,s.x,y)}}}
function darkHv(){let hv=hover;if(!hv){let bd=760;for(const e of enemies)if(e.big&&e.aggroed&&!e.dead){const d=dist(e,P);if(d<bd){bd=d;hv=e}}}return hv}
{const _uh=updateHud;updateHud=function(){_uh.apply(this,arguments);d21Try(()=>{const box=document.getElementById('target');if(!box||box.hidden)return;const hv=darkHv();if(!hv)return;const t=TYPES[hv.k];if(!t)return;
  const tn=document.getElementById('tname'),ts=document.getElementById('tsub');
  if(hv.afx&&DARK_AFX[hv.afx]&&tn){const A=DARK_AFX[hv.afx];if(!tn.textContent.includes(A.pre))tn.textContent=tn.textContent.replace(t.n,`${A.pre} ${t.n}`);if(ts&&!ts.textContent.includes(A.d))ts.textContent+=` · ${A.n}: ${A.d}`}
  const dt=darkTier();if(dt>0&&ts&&!ts.textContent.includes('어둠 '))ts.textContent+=` · 어둠 ${dt}단계`})}}
/* ===== 매 1/4초: 등불 켜기 · 들어온 곳 알림 · 같이 하기 보내기 ===== */
V20.slowTick.push(st=>{if(!P)return;const s=darkSt();
  if(P.w3&&(P.w3.lord|0)>0&&s.open<1){s.open=1;msg('꺼진 등대지기의 집에 「어둠의 등불」이 켜졌습니다 · 지옥 140 지역을 더 깊은 어둠으로 바꿀 수 있습니다','#c8a0ff');banner={t:'어둠의 등불',sub:'꺼진 등대지기의 집 · 어둠 1단계가 열렸습니다',col:'#b48aff',life:3,max:3};save()}
  const t=darkTier(),key=t+'|'+(DG?'d'+(DG.ci|0):REG.id);if(key!==D21.key){D21.key=key;if(t>0){const M=DARK_ROW(t);msg(`어둠 ${t}단계 · 몬스터 생명력 ${darkPct(M.hp)} · 보스·정예 피해 ${darkPct(M.dmg)} · 경험치 ${darkPct(M.xp)} · 아이템 찾기 ${darkPct(M.find)}`,'#c8a0ff')}D21.sendT=0}
  if(NET.on&&NET.host){D21.sendT-=st;if(D21.sendT<=0){D21.sendT=1;v20Send('h21',darkPayload())}}});
function darkPayload(){return{dt:darkTier(),dh:darkHere()?1:0,a:netArea(),ec:echoList(),af:enemies.filter(e=>e.afx&&e.id&&!e.dead).slice(0,40).map(e=>[e.id,e.afx])}}
V20NET.h21=(m)=>{if(!NET.guest||(m.from&&NET.hostId&&m.from!==NET.hostId))return;
  D21.h={t:clamp(Math.floor(+m.dt)||0,0,DARK_MAX),dh:!!m.dh,a:Number.isFinite(+m.a)?+m.a:-99,ec:Array.isArray(m.ec)?m.ec.filter(x=>ECHO_REGS.includes(x)).slice(0,2):[],at:time};
  if(Array.isArray(m.af)){const by=new Map();for(const a of m.af)if(Array.isArray(a)&&DARK_AFX[a[1]])by.set(a[0],a[1]);for(const e of enemies)if(e.id&&by.has(e.id))e.afx=by.get(e.id)}};
V20NET.h21m=m=>{if(typeof m.s==='string'&&m.s)msg(m.s.slice(0,160),typeof m.c==='string'&&/^#[0-9a-f]{3,6}$/i.test(m.c)?m.c:'#c8b8a8')};
const darkSay=(s,c)=>{msg(s,c);v20Send('h21m',{s,c})};
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{D21,DARK_ROW,DARK_AFX,darkTier,darkMods,darkHere,darkClean,darkClear,darkAshN})}catch(_){}},0);
