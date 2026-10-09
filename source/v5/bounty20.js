/* ---------- v20 Q1 현상금 게시판 (설계: rpg/v20-ideas/code/bounty.js) ----------
   게시판 13곳(헤이븐 교차로 + 지역 마을 12). 날마다(사용자 컴퓨터 날짜) 게시판마다 「이름 붙은 정예」 3마리 — 날짜+게시판 씨앗이라 누구나 같다.
   받으면(동시에 3개까지) 지도에 대략 자리(반지름 600)가 뜨고, 가까이 가면 나타난다. 생명력 ×7 · 피해 ×1.4(정예와 같음) · 크기 ×1.45 · 기술 하나.
   잡으면 경험치·금화·장비 한 번 더 + 「현상금 증표」. 하루 9마리까지 증표 (넘어도 잡을 수는 있음). 증표는 게시판에서 바꾼다.
   저장: P.bty={day,took:[],done:[],tok,n} — 날이 바뀌면 took·done·n만 비우고 tok은 남는다. 모르는 칸은 그대로 다시 쓴다.
   설계와 바꾼 점: 「망토 물감」 → 망토 그림이 아직 없어 칭호 「현상금 사냥꾼」으로. */
const BTY_PRE=['외눈','피 묻은 갈기의','늙은','굶주린','잿빛 흉터의','쇠이빨','세 번 죽은','달빛 아래의','미친','검은 발톱의','울부짖는','되살아난','왕관 쓴','쌍둥이','뿔 부러진','그림자 같은'];
const BTY_TINT=['#c8402a','#3a3a44','#e8d8a0','#5a2a6a','#2a6a5a'];
const BTY_SKILL=['charge','slam','volley','summon'];
const BTY_SKN={charge:'돌진',slam:'내려찍기',volley:'흩뿌리기',summon:'무리 부르기'};
const BTY_BOARDS={
  haven:{reg:'home',mobs:['wolf','ashhound','goblin','ashsoldier','wraith','ogre','ashknight'],lvBand:[6,24]},
  goldmere:{reg:'plains',mobs:['p_wolf','p_raider','p_ogre','p_storm']},
  elderhold:{reg:'forest',mobs:['f_slime','f_were','f_golem','f_dryad']},
  sahar:{reg:'desert',mobs:['d_scorp','d_mummy','d_sand','d_viper']},
  frostheim:{reg:'ice',mobs:['i_yeti','i_wraith','i_elem','i_knight']},
  tamal:{reg:'jungle',mobs:['j_lizard','j_panther','j_viper','j_golem']},
  emberhold:{reg:'lava',mobs:['l_imp','l_golem','l_elem','l_knight']},
  pearlport:{reg:'sea',mobs:['s_crab','s_drown','s_serp','s_siren']},
  rookwell:{reg:'moor',mobs:['h_hound','h_cairn','h_keen','h_troll']},
  windcrag:{reg:'highland',mobs:['k_bear','k_harpy','k_rogue','k_shaman']},
  dustgate:{reg:'canyon',mobs:['c_dust','c_bandit','c_scorp','c_automaton']},
  gullhaven:{reg:'cliffs',mobs:['t_harpy','t_drake','t_cultist','t_sentinel']},
  lastlight:{reg:'abyss',mobs:['v_shade','v_maw','v_knight','v_seer']}};
for(const b in BTY_BOARDS)BTY_BOARDS[b].mobs=BTY_BOARDS[b].mobs.filter(k=>TYPES[k]);
const BTY_MUL={hp:7,dmg:1.4,r:1.45,xp:8,gold:12};
const BTY_CAP={took:3,day:9,board:3};
const BTY_SHOP=[
  {id:'pots',cost:3,n:'물약 꾸러미',d:'지금 레벨에 맞는 생명력·마나 물약 5개씩'},
  {id:'tp',cost:2,n:'귀환 두루마리 3장',d:'가장 가까운 마을로 (R)'},
  {id:'forget',cost:8,n:'망각의 물약',d:'스킬·능력치 다시 찍기'},
  {id:'box',cost:10,n:'현상금 장비 상자',d:'지금 레벨의 좋은 장비 하나 (정예가 떨구는 것과 같은 표)'},
  {id:'title',cost:6,n:'칭호 「현상금 사냥꾼」',d:'캐릭터 창에 다는 칭호 (한 번만)'}];
function btySeed(day,board){return v20Hash(day+'|'+board)}
function btyToday(day,board){const B=BTY_BOARDS[board];if(!B||!B.mobs.length)return [];let s=btySeed(day,board);const rnd=()=>((s=Math.imul(s^(s>>>15),2246822507)>>>0)/4294967296);
  const out=[],pool=B.mobs.slice();for(let i=0;i<3;i++){const k=pool.splice(Math.floor(rnd()*pool.length),1)[0]||B.mobs[0];
    out.push({id:board+':'+day+':'+i,board,k,pre:BTY_PRE[Math.floor(rnd()*BTY_PRE.length)],tint:BTY_TINT[Math.floor(rnd()*BTY_TINT.length)],skill:BTY_SKILL[Math.floor(rnd()*BTY_SKILL.length)],ang:rnd()*Math.PI*2,dist:.35+rnd()*.5})}
  return out}
const btyName=b=>`${b.pre} ${TYPES[b.k]?TYPES[b.k].n:b.k}`;
function btyById(id){if(typeof id!=='string')return null;const p=id.split(':');if(p.length!==3||!BTY_BOARDS[p[0]])return null;return btyToday(p[1],p[0])[+p[2]]||null}
// 저장 값 다듬기 (모르는 칸은 남긴다)
function btyClean(raw){const o=v20Obj(raw)?Object.assign({},raw):{};const ids=a=>Array.isArray(a)?[...new Set(a.filter(x=>typeof x==='string'&&x.length<=60))].slice(0,40):[];
  o.day=typeof o.day==='string'&&o.day.length<=12?o.day:'';o.took=ids(o.took);o.done=ids(o.done);o.tok=Number.isFinite(+o.tok)?Math.max(0,Math.floor(+o.tok)):0;o.n=Number.isFinite(+o.n)?Math.max(0,Math.floor(+o.n)):0;return o}
function btyState(){if(!v20Obj(P.bty))P.bty=btyClean(null);const s=P.bty,d=v20Day();if(s.day!==d){s.day=d;s.took=[];s.done=[];s.n=0}return s}
const btyActive=()=>{const s=btyState();return s.took.filter(id=>!s.done.includes(id)).map(btyById).filter(Boolean)};
/* ===== 자리: 헤이븐은 그 몬스터 레벨이 맞는 들판, 지역은 마을에서 900~2300 떨어진 걸을 수 있는 땅 ===== */
const BTYSP={};
function btySpot(b){if(BTYSP[b.id])return BTYSP[b.id];const B=BTY_BOARDS[b.board],T=v20Town(b.board);if(!T)return null;const rg=v20Rng(v20Hash(b.id));let base=null,here=B.reg===REG.id&&!DG;
  if(B.reg==='home'){const z=qZone([b.k],'haven');if(z){for(let i=0;i<30;i++){const a=b.ang+i*.9,r=60+rg()*220,x=z.x+Math.cos(a)*r,y=z.y+Math.sin(a)*r;if(x<200||y<200||x>WORLD-200||y>WORLD-200)continue;
      const c={x,y};if(!base)base=c;if(here&&(blockedAt(x,y)||inSafe(x,y,160)))continue;BTYSP[b.id]={reg:'home',x,y};return BTYSP[b.id]}}}
  else for(let i=0;i<40;i++){const a=b.ang+i*.55,r=900+b.dist*1400+(i%5)*60,x=T.x+Math.cos(a)*r,y=T.y+Math.sin(a)*r;if(x<200||y<200||x>WORLD-200||y>WORLD-200)continue;
    const c={x,y};if(!base)base=c;if(!here)break;if(blockedAt(x,y)||inSafe(x,y,160)||zoneLevel(x,y)<1)continue;BTYSP[b.id]={reg:B.reg,x,y};return BTYSP[b.id]}
  return base?{reg:B.reg,x:base.x,y:base.y,rough:1}:null}
function btyDir(b,sp){const T=v20Town(b.board);if(!T||!sp)return '';const dx=sp.x-T.x,dy=sp.y-T.y,a=Math.atan2((dx+dy)/2,dx-dy),i=((Math.round(a/(Math.PI/4))%8)+8)%8;return `${T.n} ${QDIR[i]}쪽`}
/* ===== 나타나기 · 기술 ===== */
const btyLive=id=>enemies.find(e=>!e.dead&&e.bty===id);
function btySpawn(b){const sp=btySpot(b);if(!sp||sp.reg!==REG.id||DG||IN)return null;if(btyLive(b.id))return null;const t=TYPES[b.k];if(!t)return null;const D=DIFF[P.diff];
  const lvl=Math.max(1,Math.max(t.min||1,zoneLevel(sp.x,sp.y))+D.add),hp=Math.round(t.hp*(1+.34*(lvl-1))*BTY_MUL.hp*D.hp);
  const e={k:b.k,x:sp.x,y:sp.y,lvl,elite:true,hp,max:hp,dmg:t.dmg*(1+.18*(lvl-1))*BTY_MUL.dmg,r:t.r*BTY_MUL.r,sc:BTY_MUL.r,atkCd:1,anim:0,wx:sp.x,wy:sp.y,wt:0,hurt:0,fx:1,slowT:0,freezeT:0,stunT:0,burn:null,lunge:0,bty:b.id,btyT:3.5};
  enemies.push(e);rings.push({x:e.x,y:e.y,r:10,max:120,life:.8,col:b.tint});burst(e.x,e.y,b.tint,24,120,3,20);msg(`현상금 정예 「${btyName(b)}」${v20J(btyName(b),'가','이')} 나타났습니다!`,'#ffb05a');
  if(NET.host)v20Send('btyE',{id:b.id,eid:e.id||0});return e}
function btySkill(e,b,tg,d){const t=TYPES[e.k];if(e.freezeT>0||e.stunT>0)return;if(e.cast>0)return;
  const s=b.skill;e.btyT=rnd(5,7);
  if(s==='slam'&&d<220){const rad=130;warns.push({x:e.x,y:e.y,rad,t:1,max:1,dmg:e.dmg,col:b.tint,src:e});e.cast=1}
  else if(s==='volley'){const n=5,a0=Math.atan2(tg.y-e.y,tg.x-e.x);for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.2;projs.push({x:e.x,y:e.y,z:30,vx:Math.cos(a)*250,vy:Math.sin(a)*250,r:7,dmg:e.dmg*.45,owner:'e',life:2,col:t.pcol||b.tint})}e.cast=.4}
  else if(s==='summon'&&enemies.length<45){for(let i=0;i<2;i++){const a=R()*6.283,x=e.x+Math.cos(a)*80,y=e.y+Math.sin(a)*80;if(blockedAt(x,y))continue;const lv=Math.max(1,e.lvl-2),hp=Math.round(t.hp*(1+.34*(lv-1))*DIFF[P.diff].hp);
      enemies.push({k:e.k,x,y,lvl:lv,elite:false,hp,max:hp,dmg:t.dmg*(1+.18*(lv-1)),r:t.r,atkCd:1,anim:0,wx:x,wy:y,wt:0,hurt:0,fx:1,slowT:0,freezeT:0,stunT:0,burn:null,lunge:0,aggroed:true});rings.push({x,y,r:4,max:40,life:.4,col:b.tint})}e.cast=.6}
  else if(s==='charge'&&d>120&&d<560){const a=Math.atan2(tg.y-e.y,tg.x-e.x);e.dvx=Math.cos(a);e.dvy=Math.sin(a);e.dash=.45;e.dashHit=1;e._bdash=1;warns.push({x:e.x,y:e.y,rad:40,t:.25,max:.25,dmg:0,col:'#ffb05a'})}
  else e.btyT=1.2}
// 돌진 맞기: 피해는 정예 한 대와 같게 (들판 기준 안)
function btyDashHit(e){if(!e._bdash)return;if(!(e.dash>0)){e._bdash=0;return}if(e._bhit)return;
  if(!P.dead&&dist(e,P)<e.r+P.r+8){e._bhit=1;hitPlayer(e.dmg,e);shake=Math.max(shake,5)}else if(NET.host)for(const r of NET.peers.values())if(!r.dead&&netSame(r)&&dist(e,r)<e.r+r.r+8){e._bhit=1;netHit(r,e.dmg,e);break}
  if(e._bhit&&!(e.dash>0))e._bhit=0}
let btyReqT=0;
const btyRad=()=>v20OwnHas('perk:star')?1000:600;// 세력 평판 「별 지도」
V20.tick.push(dt=>{if(!P||DG||IN)return;
  if(!NET.guest)for(const e of enemies){if(e.dead||!e.bty)continue;btyDashHit(e);if(!(e.dash>0))e._bhit=0;const b=btyById(e.bty);if(!b||!e.aggroed)continue;e.btyT-=dt;if(e.btyT<=0){const {tg,d}=enemyTarget(e);if(d<700)btySkill(e,b,tg,d)}}});
V20.slowTick.push(st=>{if(!P||DG||IN||P.dead)return;const L=btyActive();if(!L.length)return;btyReqT-=st;
  for(const b of L){const sp=btySpot(b);if(!sp||sp.reg!==REG.id||sp.rough)continue;if(Math.hypot(P.x-sp.x,P.y-sp.y)>btyRad())continue;if(enemies.some(e=>!e.dead&&e.bty===b.id))continue;
    if(NET.guest){if(btyReqT<=0){btyReqT=3;v20Send('btyReq',{id:b.id})}}else btySpawn(b)}});
// 같이 하기: 손님이 부탁하면 주인이 세운다 · 주인은 어느 적이 현상금인지 알려 준다
V20NET.btyReq=m=>{if(!NET.host)return;const b=btyById(m.id);if(!b||b.id.split(':')[1]!==v20Day())return;const sp=btySpot(b);if(!sp||sp.reg!==REG.id)return;if(btyLive(b.id))return;btySpawn(b)};
V20NET.btyE=m=>{if(!NET.guest)return;for(const e of enemies)if(e.id&&e.id===m.eid)e.bty=m.id};
let btyMarkT=0;V20.slowTick.push(st=>{if(!NET.host)return;btyMarkT-=st;if(btyMarkT>0)return;btyMarkT=2;for(const e of enemies)if(!e.dead&&e.bty&&e.id)v20Send('btyE',{id:e.bty,eid:e.id})});
{const _nk=netKill;netKill=function(e){V20.nkE=e;try{return _nk.apply(this,arguments)}finally{V20.nkE=null}}}
{const _ns=netSend;netSend=function(o){if(V20.nkE&&o&&o.t==='kill'&&V20.nkE.bty)o.bty=V20.nkE.bty;return _ns.apply(this,arguments)}}
{const _no=netOnKill;netOnKill=function(m){V20.killBty=m&&typeof m.bty==='string'?m.bty:null;try{return _no.apply(this,arguments)}finally{V20.killBty=null}}}
/* ===== 잡았을 때 ===== */
{const _rk=rewardKill;rewardKill=function(e){_rk.apply(this,arguments);const id=e.bty||V20.killBty;if(id&&P&&!GHOST)btyCredit(id,e)}}
function btyCredit(id,e){const s=btyState(),b=btyById(id);if(!b||!s.took.includes(id)||s.done.includes(id))return false;s.done.push(id);const t=TYPES[b.k]||{xp:1},lvl=e&&e.lvl||P.lvl;
  const capped=s.n>=BTY_CAP.day;if(!capped){s.n++;s.tok++}
  const xp=Math.round(t.xp*(1+.35*(lvl-1))*DIFF[P.diff].xp*(BTY_MUL.xp-3));gainXp(Math.max(1,xp));
  if(e&&e.x!=null){loot.push({x:e.x+rnd(-20,20),y:e.y+rnd(-20,20),kind:'gold',amt:Math.round(lvl*BTY_MUL.gold*ri(1,3)),t:0});loot.push({x:e.x+rnd(-20,20),y:e.y+rnd(-20,20),kind:'item',item:makeItem(lvl,true),t:0})}
  banner={t:`현상금 · ${btyName(b)}`,sub:capped?'오늘 증표는 다 받았습니다 (9마리) · 경험치와 전리품은 그대로':`현상금 증표 +1 (가진 증표 ${s.tok}) · 오늘 ${s.n}/${BTY_CAP.day}`,col:'#ffb05a',life:3,max:3};
  rings.push({x:P.x,y:P.y,r:10,max:140,life:.8,col:'#ffb05a'});msg(`현상금을 잡았습니다: ${btyName(b)}${capped?'':' · 증표 +1'}`,'#ffb05a');if(typeof repGain==='function')repGain(b.board,'bounty');questHud();save();return true}
/* ===== 게시판 (마을 소품) ===== */
twDef('bboard',80,110,40,92,(g,v)=>{Kit.shadow(g,6,3,30,8,.85);g.fillStyle='#4a3420';g.fillRect(-26,-70,5,70);g.fillRect(21,-70,5,70);
  g.fillStyle='#7a5432';g.fillRect(-32,-82,64,44);g.fillStyle='#5a3c22';g.fillRect(-32,-82,64,4);g.fillRect(-32,-42,64,4);g.fillStyle='#8a6440';g.fillRect(-30,-78,60,36);
  const pp=[[-25,-74,16,20,'#efe2c0',-.06],[-5,-76,14,18,'#e8d8b0',.05],[12,-73,15,21,'#f4e8c8',-.03],[-18,-58,13,14,'#e0cfa0',.08]];
  for(const [x,y,w,h,c,r] of pp){g.save();g.translate(x+w/2,y+h/2);g.rotate(r);g.fillStyle=c;g.fillRect(-w/2,-h/2,w,h);g.fillStyle='rgba(60,30,20,.55)';g.fillRect(-w/2+2,-h/2+4,w-4,1.2);g.fillRect(-w/2+2,-h/2+7,w-6,1.2);g.fillStyle='#a82a1a';g.beginPath();g.arc(0,-h/2+1.5,1.6,0,6.283);g.fill();g.restore()}
  g.fillStyle='#3a2a1a';g.beginPath();g.moveTo(-36,-82);g.lineTo(0,-96);g.lineTo(36,-82);g.closePath();g.fill();g.fillStyle='rgba(255,220,160,.18)';g.fillRect(-30,-78,60,3)});
const BTY_PROP={};
{const OFF=[[150,-90],[-150,90],[120,140],[-120,-130]];for(const id in BTY_BOARDS){const t=v20Town(id);if(!t)continue;let d=null;for(const o of OFF){d=v20AddProp(id,o[0],o[1],{k:'bboard',pv:0,use:'bty:'+id});if(d)break}if(d)BTY_PROP[id]=d}v20SyncDecor()}
{const _l=sqUseLive;sqUseLive=function(d){if(d&&typeof d.use==='string'&&d.use.startsWith('bty:')){const n=btyActive().length;return{label:`현상금 게시판${n?` (받은 것 ${n})`:''}`,col:'#ffb05a',q:0}}return _l(d)}}
{const _u=sqUse;sqUse=function(d){if(d&&typeof d.use==='string'&&d.use.startsWith('bty:')){v20Open('bty',d.use.slice(4));return}return _u(d)}}
V20P.bty={title:a=>`현상금 게시판 · ${v20Town(a)?v20Town(a).n:''}`,html(board){const s=btyState(),L=btyToday(s.day,board),act=btyActive().length;
  let h=`<p class="muted" style="margin-top:0">오늘(${s.day}) 이 게시판의 이름 붙은 정예 셋. 받으면 지도에 대략 자리가 뜨고, 가까이(600 걸음) 가면 나타납니다. 혼자서도 잡을 수 있지만 단단합니다.</p>`;
  h+=`<div class="v20box"><b>현상금 증표 ${s.tok}</b> <span class="muted">· 오늘 받은 증표 ${s.n}/${BTY_CAP.day} · 지금 받은 현상금 ${act}/${BTY_CAP.took}</span></div><h2>오늘의 현상금</h2>`;
  for(const b of L){const sp=btySpot(b),done=s.done.includes(b.id),took=s.took.includes(b.id),t=TYPES[b.k];
    const btn=done?'<button type="button" disabled>잡음 ✓</button>':took?v20Btn('btydrop',b.id,'포기',{cls:'ghost'}):v20Btn('btytake',b.id,'받기',{cls:'primary',dis:act>=BTY_CAP.took,title:act>=BTY_CAP.took?'동시에 3개까지':''});
    h+=`<div class="v20row"><div><span class="v20chip" style="background:${b.tint}"></span><b>${btyName(b)}</b> <span class="muted">· 기술 「${BTY_SKN[b.skill]}」</span><div class="muted" style="font-size:12px">${REGIONS[BTY_BOARDS[board].reg].n} · ${btyDir(b,sp)} · ${t&&t.ranged?'멀리서 쏨':'가까이 붙음'}</div></div><div class="btns">${btn}</div></div>`}
  h+=`<h2>증표 바꾸기 <span class="muted">가진 증표 ${s.tok}</span></h2>`;
  for(const it of BTY_SHOP){const own=it.id==='title'&&v20OwnHas('title:bounty');h+=`<div class="v20row"><div><b>${it.n}</b> <span class="muted" style="font-size:12px">· ${it.d}</span></div><div class="btns">${own?'<button type="button" disabled>가짐</button>':v20Btn('btybuy',it.id,`증표 ${it.cost}`,{dis:s.tok<it.cost})}</div></div>`}
  return h}};
V20A.btytake=id=>{const s=btyState(),b=btyById(id);if(!b||id.split(':')[1]!==s.day||s.took.includes(id)||btyActive().length>=BTY_CAP.took)return;s.took.push(id);const sp=btySpot(b);msg(`현상금을 받았습니다: ${btyName(b)} · ${REGIONS[BTY_BOARDS[b.board].reg].n} ${btyDir(b,sp)}`,'#ffb05a');questHud();save()};
V20A.btydrop=id=>{const s=btyState();if(s.done.includes(id))return;s.took=s.took.filter(x=>x!==id);for(const e of enemies)if(e.bty===id&&!e.aggroed)e.gone=true;questHud();save()};
V20A.btybuy=id=>{const s=btyState(),it=BTY_SHOP.find(x=>x.id===id);if(!it||s.tok<it.cost)return;
  if(id==='pots'){const T=Math.max(0,POT_T.reduce((a,p,i)=>p.lv<=P.lvl?i:a,0));potAdd('hp',T,5);potAdd('mp',T,5);msg(`${potName('hp',T)} · ${potName('mp',T)} 5개씩`,'#e8c35a')}
  else if(id==='tp'){P.pot.tp=tpCount()+3;msg('귀환 두루마리 3장','#e8c35a')}
  else if(id==='forget'){respec()}
  else if(id==='box'){if(P.bag.length>=BAG_MAX){msg('가방이 가득 찼습니다','#a39d8f');return}const x=makeItem(P.lvl,true);P.bag.push(x);msg(`현상금 장비 상자: ${x.name}`,RAR[x.rar].c)}
  else if(id==='title'){if(v20OwnHas('title:bounty'))return;v20OwnAdd('title:bounty');msg('칭호 「현상금 사냥꾼」을 얻었습니다 (평판 칸에서 달기)','#ffb05a')}
  s.tok-=it.cost;burst(P.x,P.y,'#ffb05a',16,90,3,24);save()};
V20.titles.push({id:'bounty',n:'현상금 사냥꾼',col:'#ffb05a',src:'현상금 증표',have:()=>v20OwnHas('title:bounty')});
/* ===== 지도 · 알림판 · 일지 ===== */
function btyTarget(b){const sp=btySpot(b);if(!sp)return null;return{reg:sp.reg,x:sp.x,y:sp.y,label:`${btyDir(b,sp)} · 현상금 ${btyName(b)}`}}
const v20WP=(t,world)=>{if(!world)return qRoute(t);if((t.reg||'home')===REG.id)return t.room&&t.door?t.door:t;const h=regHop(REG.id,t.reg||'home'),e=EDGES.find(e=>e.to===h);return e?{x:e.x,y:e.y,via:REGIONS[t.reg||'home'].n}:null};
{const _m=sqMarks;sqMarks=function(world){const o=_m(world);if(!P)return o;for(const b of btyActive()){const t=btyTarget(b);if(!t)continue;const p=v20WP(t,world);if(p)o.push({x:p.x,y:p.y,kind:'ring',col:'#ffb05a',label:p.via?`현상금 → ${p.via}`:btyName(b)})}
  if(!IN&&!DG)for(const id in BTY_PROP){const d=BTY_PROP[id];if(BTY_BOARDS[id].reg===REG.id)o.push({x:d.x,y:d.y,kind:'dot',col:'#ffb05a'})}return o}}
{const _r=sqTargetRegs;sqTargetRegs=function(){const o=_r();if(!P)return o;for(const b of btyActive()){const t=btyTarget(b);if(t)o[t.reg]=(o[t.reg]||0)+1}return o}}
v20Css('.qtg.b{background:#c8702a;color:#fff}');
{const _s=sqHudBlocks;sqHudBlocks=function(){const o=_s();if(!P)return o;for(const b of btyActive()){const t=btyTarget(b);o.push({t:`<i class="qtg b">현상금</i>${btyName(b)}`,w:t?qWhereText(t):'',g:[{s:`${REGIONS[BTY_BOARDS[b.board].reg].n} · 가까이 가면 나타남`,ok:false}],side:1})}return o}}
{const _l=sqLogHtml;sqLogHtml=function(){let h=_l();if(!P)return h;const L=btyActive(),s=btyState();
  let x=`<h2>현상금 <span class="muted">증표 ${s.tok} · 오늘 ${s.n}/${BTY_CAP.day}</span></h2>`;
  if(!L.length)x+='<p class="muted">받은 현상금이 없습니다. 헤이븐 교차로와 지역 마을의 현상금 게시판(주황 점)에서 받으세요.</p>';
  else x+=L.map(b=>{const t=btyTarget(b);return `<div class="qlog"><b><i class="qtg b">현상금</i>${btyName(b)}</b><div class="muted">${t?qWhereText(t):''}</div><div class="row">${v20Btn('btydrop',b.id,'포기',{cls:'ghost'})}</div></div>`}).join('');
  const i=h.indexOf('<h2>받을 수 있는 의뢰');return i>=0?h.slice(0,i)+x+h.slice(i):h+x}}
/* ===== 그리기: 색 고리 + 이름 ===== */
{const _d=drawEnemy;drawEnemy=function(e){if(e.bty&&e._s){const b=btyById(e.bty);if(b){const R0=monRing(b.tint),r=e.r*1.9;ctx.drawImage(R0.cv,e._s.x-r,e._s.y-r*.5,r*2,r)}}return _d.apply(this,arguments)}}
{const _l=drawV5Labels;drawV5Labels=function(){_l.apply(this,arguments);if(!P)return;for(const e of enemies){if(e.dead||!e.bty)continue;const b=btyById(e.bty);if(!b)continue;const s=W2S(e.x,e.y),t=TYPES[e.k];if(!onScreen(s,120))continue;
  const y=s.y-(MON_H[t.draw]||40)*(e.sc||1.45)-22,n=`★ ${btyName(b)}`;ctx.textAlign='center';ctx.font='700 13px '+FONT;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(n,s.x,y);ctx.fillStyle='#ffb05a';ctx.fillText(n,s.x,y)}}}
window.__v20=window.__v20||{};Object.assign(window.__v20,{BTY_BOARDS,BTY_MUL,BTY_SHOP,BTY_CAP,BTY_PROP,btyToday,btyById,btyState,btyClean,btySpot,btySpawn,btyCredit,btyActive,btyName});
