/* ---------- [v58] 새 그림 넣기 (Codex 그림, 2026-11-11) ----------
   사용자 2026-11-10 「지금까지 작업된 것들을 모두 반영해서 패치로 올려줘」.
   - 스킬 그림: 전사 98 · 궁수 112 · 사제 나머지 12 (img/flare-icon58-<직업>.*, 내 직업 묶음만 게임에 들어올 때 받음). art57(마법사 · 사제 219)과 같은 방식.
   - 전사 방패 2~7단계(앞/뒤) 12장: img/flare-hero58-warrior.* (v54 전사 몸과 같은 칸 28x32 · 기준점). 그 방패를 든 전사가 화면에 나올 때만 받음.
   - 공통 맞음 그림 16장: img/fx-common.* (FX31 묶음). 자기 맞힘 그림이 없는 스킬의 맞힘 빛 · 전사 · 궁수 물리 타격 불꽃 · 치명타 · 빗나감 · 피함 · 레벨 업 · 되살아남 · (그림 없는) 치유.
     마법사 번개 계열처럼 「예전 이펙트가 낫다」고 고른 스킬(FX31.OLD)은 그대로 예전 빛. 입자 · 땅 자국 · 글자는 그대로 두고 예전 빛 한 겹만 그림이 대신함.
   - 그림만 바뀜: 크기 · 충돌 · 적중 · 수치 · 저장 그대로(저장 칸 없음 · 캐릭터 키 손대지 않음). 「예전 그림」 · #qa · 묶음을 아직 못 받았을 때는 예전 그대로. */
const A58={keys:{"icon58-warrior":["warrior_avatarofwar","warrior_battleblood","warrior_battletrance","warrior_bewall","warrior_bladedance","warrior_bloodfire","warrior_bloodfrenzy","warrior_bloodharvest","warrior_bloodlust","warrior_bloodoath","warrior_bloodthirst","warrior_bulwark","warrior_bulwarkcounter","warrior_chainpull","warrior_citadel","warrior_citadelecho","warrior_commandshout","warrior_crossslash","warrior_crushcombo","warrior_defiance","warrior_doubleslash","warrior_dragonfang","warrior_earthanchor","warrior_earthsplit","warrior_endblow","warrior_execute","warrior_executionleap","warrior_fearhowl","warrior_fortress","warrior_fortressswap","warrior_furytraining","warrior_gathercry","warrior_grandtaunt","warrior_groundbreaker","warrior_guardianoath","warrior_guardlink","warrior_guardrush","warrior_guardstance","warrior_heavenlycharge","warrior_heavenpiercer","warrior_heavyblow","warrior_heavycrash","warrior_hook","warrior_ironflesh","warrior_ironwall","warrior_lastbastion","warrior_laststand","warrior_leapsmash","warrior_lordcombo","warrior_lordduel","warrior_lordgale","warrior_lordstance","warrior_lungepierce","warrior_myriadslash","warrior_oathblade","warrior_phantomriders","warrior_polearmmastery","warrior_polecircle","warrior_provokemark","warrior_provokestrike","warrior_ragespin","warrior_rally","warrior_rampage","warrior_rampartbash","warrior_redmist","warrior_rend","warrior_retaliation","warrior_riposte","warrior_shieldbash","warrior_shieldcharge","warrior_shieldthrow","warrior_shieldwall","warrior_skyfalllance","warrior_slash","warrior_spikeguard","warrior_standard","warrior_steadfast","warrior_steelheart","warrior_stomp","warrior_stonerampart","warrior_sunderingstrike","warrior_sweep","warrior_swordmastery","warrior_taunt","warrior_terrorroar","warrior_thousandcuts","warrior_thrust","warrior_thunderdrop","warrior_toughness","warrior_undying","warrior_unfallenkingdom","warrior_vault","warrior_warbanner","warrior_wardrum","warrior_warlordroar","warrior_weaponmastery","warrior_weaponthrow","warrior_whirlslash"],"icon58-archer":["archer_abysstrap","archer_apexhunt","archer_arrowrain","archer_arrowvortex","archer_avalanche","archer_backshot","archer_beastawaken","archer_beastbond","archer_beastcage","archer_blasttrap","archer_blizzardshot","archer_breathmastery","archer_burstarrow","archer_caltrops","archer_camouflage","archer_crystalprison","archer_curvingshot","archer_cyclonearrow","archer_darkhunter","archer_deadeye","archer_deathmark","archer_detonate","archer_dominion","archer_doublestream","archer_drivehunt","archer_earthbind","archer_elementquiver","archer_elemrain","archer_evaderoll","archer_exposeweak","archer_falcon","archer_falcondive","archer_fanshot","archer_farsight","archer_firerain","archer_firetrail","archer_firetrap","archer_flamearrow","archer_focus","archer_frosttrap","archer_fulldraw","archer_galearrow","archer_glacialarrow","archer_glacialorb","archer_glacialspike","archer_hawkeye","archer_heavenbow","archer_homingarrow","archer_huntground","archer_huntinghorn","archer_hurricaneshot","archer_icearrow","archer_ignitearrow","archer_imbue","archer_leecharrow","archer_lightningrod","archer_lure","archer_netshot","archer_nighthunt","archer_nimble","archer_oneshot","archer_phoenixarrow","archer_piercearrow","archer_pierceblow","archer_piercinggaze","archer_poisonshade","archer_powershot","archer_predatoreye","archer_quickshot","archer_rapidhand","archer_returnarrow","archer_ricochet","archer_scattervolley","archer_sevenstars","archer_shadowarrow","archer_shadowclone","archer_shadowhide","archer_shadowstep","archer_shadowtrap","archer_shatterarrow","archer_shockarrow","archer_shootrhythm","archer_shrapneltrap","archer_siegeshot","archer_skyvolley","archer_smoke","archer_snaretrap","archer_snipe","archer_solararrow","archer_splitarrow","archer_starfallbow","archer_steadyhand","archer_stormarrow","archer_streamshot","archer_survivor","archer_tailwind","archer_thorntrap","archer_thunderarrow","archer_trackmark","archer_trapfield","archer_trapmaster","archer_traptoss","archer_trinityarrow","archer_tripleshot","archer_volcanoshot","archer_weakpoint","archer_weakspot","archer_wildrun","archer_wildsense","archer_windpierce","archer_windstep","archer_wolfcall"],"icon58-priest":["priest_consecrate","priest_graceaccel","priest_grandrez","priest_heavengate","priest_lifeswap","priest_lightpath","priest_martyrprayer","priest_saintmarch","priest_saintmiracle","priest_sainttouch","priest_sanctumfield","priest_stigmata"]},ic:new Map(),FX:'common',
  el:{phys:'physical',physical:'physical',fire:'fire',ice:'ice',storm:'storm',earth:'earth',wind:'wind',arcane:'arcane',light:'light',holy:'holy',life:'life'},
  n:{hit:0,spark:0,crit:0,miss:0,evade:0,lv:0,rez:0,heal:0,shield:0}};
A58.set={};for(const n in A58.keys)A58.set[n]=new Set(A58.keys[n]);
/* ===== 스킬 그림 (전사 · 궁수 · 사제 나머지 · 내 직업 묶음만) ===== */
const a58IcPk=cls=>'icon58-'+cls;
function a58Icon(s){if(!s||!s.cls||!s.id||(typeof flWant==='function'&&!flWant()))return null;// 「예전 그림」이면 기억해 둔 것도 쓰지 않음
  const pk=a58IcPk(s.cls),key=s.cls+'_'+s.id;if(!A58.set[pk]||!A58.set[pk].has(key))return null;
  let u=A58.ic.get(key);if(u)return u;const PK=typeof flPack==='function'?flPack(pk):null,r=PK&&PK.meta.r[key];if(!r)return null;
  try{const cv=document.createElement('canvas');cv.width=r[2];cv.height=r[3];cv.getContext('2d').drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);
    u=`<svg viewBox="0 0 32 32" aria-hidden="true"><image href="${cv.toDataURL('image/png')}" x="0" y="0" width="32" height="32"/></svg>`}catch(_){return null}
  A58.ic.set(key,u);return u}
if(typeof IC25==='object'&&typeof IC25.svg==='function'){const _s=IC25.svg;IC25.svg=function(s){return a58Icon(s)||_s.apply(this,arguments)};
  if(typeof IC25.has==='function'){const _h=IC25.has;IC25.has=function(s){return !!a58Icon(s)||_h.apply(this,arguments)}}}
if(typeof physIcon==='function'){const _p=physIcon;physIcon=function(s){return a58Icon(s)||_p.apply(this,arguments)}}
function a58IcNeed(){if(P&&P.cls&&A58.set[a58IcPk(P.cls)]&&typeof flNeed==='function')flNeed(a58IcPk(P.cls))}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{a58IcNeed()}catch(e){if(window.__QA)throw e}return r}}
{const _ld=load;load=function(){const r=_ld.apply(this,arguments);try{if(r)a58IcNeed()}catch(e){if(window.__QA)throw e}return r}}
{const _r=flReady;flReady=function(name){const r=_r.apply(this,arguments);try{if(/^icon58-/.test(name)){A58.ic.clear();if(typeof PUI==='object'&&PUI&&PUI.ic)PUI.ic.clear();if(P&&typeof buildBar==='function')buildBar();if(typeof renderPanel==='function'&&typeof panel!=='undefined'&&panel&&!panel.hidden)renderPanel()}}catch(e){if(window.__QA)throw e}return r}}
/* ===== 전사 방패 2~7단계 (일반 · 마법 방패. 희귀 이상은 v55 장비 겉모습 그대로) ===== */
{const _hp=heroPart18;heroPart18=function(cls,part,di,trim,bs,v,tc){
  if(cls==='warrior'&&part==='shield'){const L=trim&&typeof trim==='object'?trim:null,q=L&&L.g54;
    if(!(q&&q.o>=0)){const t=h46T(L?L.ot:2);if(t>=2&&t<=7){const e=h54Img([['hero58-warrior','shield/'+t+'/'+(v|0)]],di,bs||Math.max(1,DPR)*HS);if(e){A58.n.shield++;return e}}}}
  return _hp.apply(this,arguments)}}
/* ===== 공통 맞음 그림 (FX31 묶음 「common」) ===== */
// 쓸 수 있으면 묶음, 아니면 null (그리고 받을 줄에 세움 · #qa에서는 FX31이 받지 않음)
function a58Pk(stem){if(typeof FX31!=='object'||!FX31.on())return null;const PK=FX31.P[A58.FX];if(!PK){if(location.hash!=='#qa')FX31.need(A58.FX);return null}if(!FX31.fr(PK,stem))return null;PK.used=FX31.now();return PK}
function a58Add(stem,o){const PK=a58Pk(stem);if(!PK)return false;FX31.add(Object.assign({st:stem,pk:A58.FX,z:0,ax:64,ay:64},o));return true}
// 자기 맞힘 그림이 없는 플레이어 스킬의 맞힘: 예전 빛 터짐(한 겹)을 원소 그림이 대신 (입자 · 땅 자국은 그대로)
{const _h=FXR.hit;FXR.hit=function(p){const s=p&&p.s,id=s&&s.id;
  if(!s||!id||!SPELLS[id]||(FX31.OLD&&FX31.OLD.includes(id)))return _h.apply(this,arguments);
  const g=FX31.get(id,false);if(g&&g.m.i&&FX31.fr(g.PK,g.m.i))return _h.apply(this,arguments);
  const el=A58.el[s.el||(s.phys?'phys':'')]||(s.cls==='warrior'||s.cls==='archer'?'physical':null),stem=el&&'fx_common_hit_'+el,PK=stem&&a58Pk(stem);if(!PK)return _h.apply(this,arguments);
  const n0=FXR.imp.length,r=_h.apply(this,arguments);if(FXR.imp.length>n0)FXR.imp.splice(n0);
  const t=FXR.tier(p);FX31.add({st:stem,pk:A58.FX,x:p.x,y:p.y,z:p.z||0,d:[.22,.26,.32,.4,.52][t],sc:s.aoe?Math.min(2.4,Math.max(.9,FX31.fit(PK,stem,s.aoe))):.85+.12*t,ax:64,ay:64});A58.n.hit++;return r}}
// 전사 · 궁수 물리 타격 불꽃: 예전 별빛 한 겹을 물리 맞음 그림이 대신 (튀는 입자는 그대로)
{const _hs=FXP.hitSpark;FXP.hitSpark=function(x,y,col,n){const n0=this.fx.length,r=_hs.apply(this,arguments);
  if(a58Pk('fx_common_hit_physical')){for(let i=this.fx.length-1;i>=n0;i--)if(this.fx[i].k==='star')this.fx.splice(i,1);FX31.add({st:'fx_common_hit_physical',pk:A58.FX,x,y,z:18,d:.2,sc:n>=10?1.25:.95,ax:64,ay:64});A58.n.spark++}return r}}
// 빗나감 · 피함: 글자는 그대로, 피함 빛 한 겹을 그림이 대신 · 빗나감은 그림을 더함
{const _t=FXP.text;FXP.text=function(kind,x,y){const n0=this.fx.length,r=_t.apply(this,arguments);
  if(kind==='evade'&&a58Pk('fx_common_evade')){for(let i=this.fx.length-1;i>=n0;i--)if(this.fx[i].k==='evadefx')this.fx.splice(i,1);a58Add('fx_common_evade',{x,y,z:22,d:.3,sc:1.1});A58.n.evade++}
  else if(kind==='miss'&&a58Add('fx_common_miss',{x,y,z:22,d:.3,sc:1.05}))A58.n.miss++;return r}}
// 치명타: 노란 큰 피해 숫자가 뜰 때 그 자리에 치명타 빛
{const _ft=ftext;ftext=function(x,y,t,c,big,z){const r=_ft.apply(this,arguments);try{if(typeof t==='number'&&big&&c==='#ffd34d'&&a58Add('fx_common_critical',{x,y,z:Math.max(14,(z||40)*.55),d:.3,sc:1.2}))A58.n.crit++}catch(e){if(window.__QA)throw e}return r}}
// 레벨 업: 내 발밑에 레벨 업 빛 (예전 빛 · 글자는 그대로)
{const _gx=gainXp;gainXp=function(){const l0=P&&P.lvl,r=_gx.apply(this,arguments);try{if(P&&P.lvl>l0&&a58Add('fx_common_levelup',{who:P,fol:1,x:P.x,y:P.y,z:0,d:.8,sc:1.7,ay:70}))A58.n.lv++}catch(e){if(window.__QA)throw e}return r}}
// 되살아남 · 치유: 자기 그림이 없는 것만 (같이 하기에서 동료가 살려 줄 때 · 그림 없는 치유)
{const _c=FXB.cast;FXB.cast=function(s,o,from){const r=_c.apply(this,arguments);try{if(s&&(s.kind==='rez'||s.kind==='heal')&&!(s.id&&FX31.get(s.id,false))){const q=o||P,rez=s.kind==='rez';
    if(a58Add(rez?'fx_common_revive':'fx_common_heal',{who:q,fol:1,x:q.x,y:q.y,z:rez?0:20,d:rez?.9:.7,sc:rez?1.6:1.3,ay:rez?72:64}))A58.n[rez?'rez':'heal']++}}catch(e){if(window.__QA)throw e}return r}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{A58,a58Icon,a58Pk})}catch(_){}},0);
