/* ---------- v57 새 그림 넣기 (Codex가 그린 그림 · 사용자 2026-11-07 「그때까지 작업이 완료된 그래픽들을 반영해서 다음 패치를 배포해줘」) ----------
   · 110레벨 이후 새 땅 다섯 곳 · 아홉 첨탑 대성당(60장) · 141~158레벨 새 땅 넷 · 별이 떨어진 큰 구덩이 · 떠도는 강자(65장) · 마법사 · 사제 스킬 그림(219장).
   · 묶음(img/flare-*.js)은 그 땅이나 그 땅 던전에 들어설 때만 받는다(떠도는 강자 묶음은 강자가 나타났을 때, 스킬 그림은 내 직업 것만 들어온 뒤).
     #qa에서는 받지 않는다(flNeed 규칙). 그림이 없거나 「화면 · 그림: 예전 그림」이면 지금 코드 그림 그대로.
   · 그림만 바뀐다: 크기 · 충돌 · 적중 · 수치 · 저장은 그대로(저장 칸 없음).
   · 몬스터 · 보스 · 마을 사람: 그림 한 장(왼쪽 아래를 본다)을 뒤집어 오른쪽을 보는 기본 모양에 맞추고 걸음 · 공격 때 살짝 흔든다(옹기여신 그림과 같은 방식).
   · 물체: 같은 자리의 코드 그림(SC 이름)을 새 그림으로 바꿔 굽는다. 대성당 바깥 · 기둥 · 종은 크기와 기준점이 코드 그림과 똑같다. */
const A57={keys:{"cg-g100-cave":["b_bl1_drake","bl1_bat","bl1_spider","bl1_stal","bl1_worm","g1_dg_cave","g1_glowshroom","g1_glowthread","g1_lanternpost","g1_stalag","m_bl1_hermit","m_bl1_spq","npc_g1_moro"],"cg-g100-coast":["b_bc1_serp","bc1_bird","bc1_crab","bc1_giant","bc1_sailor","g1_basalt_big","g1_basalt_low","g1_dg_coast","g1_tide_foam","m_bc1_harp","m_bc1_witch","npc_g1_gunhild"],"cg-g100-salt":["b_sm1_queen","g1_dg_salt","g1_salthut","g1_saltpile","m_sm1_maid","m_sm1_scorp","npc_g1_pacha","sm1_crane","sm1_golem","sm1_hunter","sm1_spirit"],"cg-g100-spire":["b_cr1_heart","b_sp1_king","cr1_shard","cr1_ward","cr1_wisp","g1_bridge","g1_dg_crater","g1_dg_spire","g1_rift","g1_spire","g1_starrock","m_cr1_dust","m_cr1_iron","m_sp1_cap","m_sp1_drum","npc_g1_ling","sp1_crane","sp1_monkey","sp1_tiger","sp1_warrior"],"cg-g100-st":["st_aurora","st_capital","st_jungle","st_lake","st_peak","st_plateau"],"cg-r110-aurora":["au1_bear","au1_guard","au1_spirit","au1_whale","au1_wolf","b_au1_whale","m_au1_keeper","m_au1_knight","npc_r110_sanna","r110_fire","r110_view"],"cg-r110-jungle":["b_jg1_croc","jg1_bat","jg1_firefly","jg1_frog","jg1_idol","jg1_jaguar","jg1_snake","m_jg1_priest","m_jg1_queen","npc_r110_ikaru","r110_dock","r110_raft","r110_view"],"cg-r110-lake":["b_lk1_seal","lk1_giant","lk1_mist","lk1_ward","lk1_wolf","m_lk1_pike","m_lk1_shaman","npc_r110_ulgen","r110_fishhole","r110_pole","r110_pole_s","r110_tent","r110_thinice","r110_view"],"cg-r110-peak":["b_pk1_roc","m_pk1_cairn","m_pk1_herder","npc_r110_dato","pk1_eagle","pk1_golem","pk1_monk","pk1_ram","r110_cairn","r110_chapel","r110_flag","r110_view"],"cg-r110-sq":["b_ct_tsar","ct_choir","ct_dome","ct_icon","m_ct_bell","m_ct_glass","npc_g1_baren","npc_r110_iliya","r110_cath_bell","r110_cath_ext","r110_cath_floor","r110_cath_glass","r110_cath_pillar","r110_cath_wall","r110_view"],"icon57-mage":["mage_absolutezero","mage_affinity","mage_airwall","mage_arcaneheal","mage_arcanemissiles","mage_blink","mage_blizzard","mage_bodyofwater","mage_breeze","mage_callstorm","mage_callwave","mage_chainlightning","mage_collapse","mage_communion","mage_crackstone","mage_dancingflames","mage_dawnblade","mage_dragonbreath","mage_drawwater","mage_dustdevil","mage_earthquake","mage_earthshaping","mage_ease","mage_elembarrier","mage_elempierce","mage_elemrelease","mage_ember","mage_eyeofstorm","mage_finalcircle","mage_firebird","mage_firebolt","mage_fireburst","mage_fireelem","mage_firestorm","mage_firewall","mage_fissure","mage_flamelance","mage_flamelash","mage_flamemantle","mage_flameshaping","mage_forbidblaze","mage_forbiddenlore","mage_forbidgale","mage_forbidtide","mage_forbidupheave","mage_frostarmor","mage_frostarrow","mage_frostchain","mage_frostdiver","mage_frostgolem","mage_frozenground","mage_frozenorb","mage_glacier","mage_gust","mage_hail","mage_heavenbolt","mage_hold","mage_hydra","mage_iceshield","mage_jaws","mage_kingspact","mage_lancelight","mage_light","mage_lightning","mage_lightrain","mage_lordvermilion","mage_magmafield","mage_magmariver","mage_manaclone","mage_manaflux","mage_meteor","mage_meteorswarm","mage_obsidian","mage_overload","mage_pactcommand","mage_pactmark","mage_pactprice","mage_phoenix","mage_prismbolt","mage_purifywater","mage_pyroblast","mage_quadorb","mage_quake","mage_quicksand","mage_raisemountain","mage_rendingsky","mage_resonance","mage_rewind","mage_shieldcircle","mage_shockinggrasp","mage_spaceprison","mage_spacetwist","mage_spark","mage_spiritadvent","mage_spiritburst","mage_spiritchain","mage_spiritfrenzy","mage_spiritfusion","mage_spiritlegion","mage_spiritreturn","mage_spiritsovereign","mage_spiritthrone","mage_splash","mage_starlight","mage_static","mage_steamburst","mage_steamjet","mage_stonebody","mage_stonerain","mage_stoneset","mage_stonethrow","mage_stonetitan","mage_stop","mage_stormhawk","mage_summoncircle","mage_sunfall","mage_sunflame","mage_swapplace","mage_testament","mage_timerift","mage_timestop","mage_turncurrent","mage_vacuumblade","mage_wardspirit","mage_warmth","mage_watershaping","mage_waterwhip","mage_whirlpool","mage_whirlwind","mage_windblade","mage_windleap","mage_windreading"],"icon57-priest":["priest_aegis","priest_agiup","priest_apotheosis","priest_archhymn","priest_atonelight","priest_barrier","priest_battlerez","priest_benediction","priest_blessedhammer","priest_blessing","priest_brandspread","priest_chainheal","priest_chainoflight","priest_closewounds","priest_condemnfield","priest_confessbell","priest_consecration","priest_conviction","priest_crownofblessing","priest_divineshield","priest_execeye","priest_execlance","priest_execution","priest_exorcircle","priest_faith","priest_finalverdict","priest_gloria","priest_godspear","priest_graceamp","priest_gracelink","priest_grandblessing","priest_grandcross","priest_grandverdict","priest_greaterheal","priest_greatjudgment","priest_guardianspirit","priest_hammerofjustice","priest_hammerofwrath","priest_healcircle","priest_heavenblades","priest_heavenprison","priest_heavenwrath","priest_heresybrand","priest_holychains","priest_holycross","priest_holyfire","priest_holyflame","priest_holysun","priest_hymnecho","priest_impositio","priest_inqarmor","priest_inviolable","priest_javelin","priest_judgechain","priest_judgespear","priest_judgment","priest_kings","priest_kyrie","priest_lifespring","priest_lightchaser","priest_lightvolley","priest_lightward","priest_lightwings","priest_magnus","priest_minorheal","priest_painsup","priest_penitence","priest_pillaroflight","priest_prayerheal","priest_purgefire","priest_purifyhand","priest_radiance","priest_rainoflight","priest_regeneration","priest_renew","priest_resurrection","priest_returnmiracle","priest_sacredsword","priest_salvation","priest_sanctum","priest_smite","priest_sunsword","priest_symbolflash","priest_thunderprayer","priest_turnundead","priest_waveoflight","priest_wisdom"]},
  reg:{r110_lake:'cg-r110-lake',r110_peak:'cg-r110-peak',r110_jungle:'cg-r110-jungle',r110_aurora:'cg-r110-aurora',r110_square:'cg-r110-sq',
    g1_salt:'cg-g100-salt',g1_coast:'cg-g100-coast',g1_cave:'cg-g100-cave',g1_spire:'cg-g100-spire'},
  ST:'cg-g100-st',
  // 몬스터 크기: 코드 모양 높이(MON_H) × 배수 (보스 · 준보스는 조금 더 크게)
  hk:{mob:1.25,mini:1.32,boss:1.36},
  // 코드 그림 이름 → [새 그림, 맞출 높이(코드 그림 칸 높이 비율) 또는 0(크기 · 기준점 그대로)]
  sc:{'r110/cath':['r110_cath_ext',0],'r110/cpil':['r110_cath_pillar',0],'r110/cbell':['r110_cath_bell',0],
    'r110/pole':['r110_pole',1],'r110/poles':['r110_pole_s',1],'r110/tent':['r110_tent',1.05],'r110/cairn':['r110_cairn',1.05],'r110/flag':['r110_flag',1],
    'r110/chapel':['r110_chapel',1],'r110/dock':['r110_dock',1],'r110/fire':['r110_fire',1.1],'r110/view':['r110_view',1],
    'g100/salt0':['g1_saltpile',1],'g100/salt1':['g1_saltpile',1.1],'g100/basalt0':['g1_basalt_low',1.05],'g100/basalt1':['g1_basalt_big',1],
    'g100/post':['g1_lanternpost',1],'g100/shroom':['g1_glowshroom',1.1],'g100/spire0':['g1_spire',.85],'g100/spire1':['g1_spire',1],'g100/bridge':['g1_bridge',1.15]},
  // 가운데가 기준인 그림 (나머지는 맨 아래 가운데)
  mid:new Set(['g1_bridge','r110_fishhole','r110_thinice','r110_raft','g1_tide_foam','r110_cath_floor']),
  // 던전 입구 (그 던전 id → 그림 · 맞출 가로 폭)
  cave:{g1_saltdg:'g1_dg_salt',g1_coastdg:'g1_dg_coast',g1_cavedg:'g1_dg_cave',g1_spiredg:'g1_dg_spire',g1_crater:'g1_dg_crater'},caveW:178,
  c:{},mon:{},ic:new Map(),icT:0,stT:0,stOn:0};
const a57All=(()=>{const o={};for(const n in A57.keys)for(const k of A57.keys[n])if(!o[k])o[k]=n;return o})();
// 그림 한 장 찾기: [묶음, 자르는 칸] (받은 묶음만)
function a57R(key){const n=A57.c[key]||a57All[key];if(!n||typeof flPack!=='function')return null;const PK=flPack(n),r=PK&&PK.meta&&PK.meta.r&&PK.meta.r[key];return r?[PK,r]:null}
const a57Place=()=>{if(DG){const d=DG.d;if(!d)return null;return d.cath?'cg-r110-sq':A57.reg[d.reg]||null}return REG?A57.reg[REG.id]||null:null};
function a57Need(){if(typeof flNeed!=='function')return;const p=a57Place();if(p)flNeed(p);if(A57.stOn)flNeed(A57.ST)}
{const _l=loadRegion;loadRegion=function(){const r=_l.apply(this,arguments);try{a57Need()}catch(e){if(window.__QA)throw e}return r}}
{const _e=enterDungeon;enterDungeon=function(){const r=_e.apply(this,arguments);try{a57Need()}catch(e){if(window.__QA)throw e}return r}}
{const _v=leaveDungeon;leaveDungeon=function(){const r=_v.apply(this,arguments);try{a57Need()}catch(e){if(window.__QA)throw e}return r}}
if(typeof netEnterDg==='function'){const _n=netEnterDg;netEnterDg=function(){const r=_n.apply(this,arguments);try{a57Need()}catch(e){if(window.__QA)throw e}return r}}
{const _f=flLoad;flLoad=function(){_f.apply(this,arguments);try{a57Need()}catch(e){if(window.__QA)throw e}}}
// 떠도는 강자: 화면에 나타나면 그 묶음 (1초마다 한 번 살핌)
{const _u=updateEnemies;updateEnemies=function(dt){const r=_u.apply(this,arguments);if((A57.stT-=dt||0)<=0){A57.stT=1;try{if(!A57.stOn&&enemies.some(e=>e&&!e.dead&&typeof e.k==='string'&&e.k.startsWith('st_'))){A57.stOn=1;a57Need()}}catch(e){if(window.__QA)throw e}}return r}}
// 한 장 그리기: (x,y) = 기준점 · k = 크기 · fl = 좌우 뒤집기
function a57Draw(c,key,x,y,k,fl){const R0=a57R(key);if(!R0)return false;const [PK,r]=R0;
  if(fl){c.save();c.translate(x,y);c.scale(-1,1);FLC.draw(c,PK.img,r[0],r[1],r[2],r[3],-r[4]*k,-r[5]*k,r[2]*k,r[3]*k);c.restore()}
  else FLC.draw(c,PK.img,r[0],r[1],r[2],r[3],x-r[4]*k,y-r[5]*k,r[2]*k,r[3]*k);return true}

/* ===== 몬스터 · 준보스 · 보스 · 떠도는 강자 ===== */
function a57Mon(g,e,t,st,key,hd,role){const R0=a57R(key);if(!R0)return false;const [PK,r]=R0;
  const H=(MON_H[hd]||50)*A57.hk[role],k=H/r[3],L=Math.max(0,st.lunge||0),bob=Math.abs(Math.sin(st.ph*7))*st.mv*1.6;
  g.save();g.translate(L*4,-bob);g.scale(-1,1);if(L>0)g.scale(1+L*.06,1-L*.05);
  FLC.draw(g,PK.img,r[0],r[1],r[2],r[3],-r[4]*k,-r[5]*k,r[2]*k,r[3]*k);g.restore();st.head={x:0,y:-H};return true}
for(const key in a57All){const t=TYPES[key];if(!t||!t.draw||String(t.draw).startsWith('a57_'))continue;const hd=t.draw;if(!MON[hd])continue;
  const nk='a57_'+key,role=t.boss?'boss':t.mini?'mini':'mob';A57.mon[key]=nk;
  MON_H[nk]=MON_H[hd];if(typeof R22_HW==='object'&&R22_HW[hd]!=null)R22_HW[nk]=R22_HW[hd];
  MON[nk]=function(g,e,t2,st){if(a57Mon(g,e,t2,st,key,hd,role))return;return MON[hd].apply(this,arguments)};t.draw=nk}

/* ===== 마을 사람 ===== */
{const _f=twDrawFolk;twDrawFolk=function(d){const id=d&&d.L&&d.L.key,key=id&&'npc_'+id,R0=key&&a57All[key]?a57R(key):null;if(!R0)return _f.apply(this,arguments);
  const r=R0[1],s=d._s,bob=d.moving?-Math.abs(Math.sin(d.walkT*14))*1.6:0,k=68/r[3];
  a57Draw(ctx,key,s.x,s.y+bob,k,d.face>0);// 그림은 왼쪽을 본다
  const top=s.y-76,near=dist(P,d)<140,mk=typeof sqMark==='function'?sqMark(d):'';
  if(near||mk||(d.say&&time<d.sayT))QLBL.push({x:s.x,y:top,n:near||mk?d.n:'',mk,c:d.shopk?'#ffd27a':mk?'#ffe6a8':'#e8e2d2',say:d.say&&time<d.sayT?d.say:'',sa:clamp((d.sayT-time)*2,0,1),ph:d.x})}}

/* ===== 물체: 코드 그림을 새 그림으로 굽기 ===== */
{const _g=SC.get;SC.get=function(key,w,h,ax,ay,paint,o){const m=A57.sc[key];if(m){const R0=a57R(m[0]);if(R0){const [PK,r]=R0,ex=!m[1];
      const k=ex?1:clamp(h*m[1]/r[3],.2,1.25),Wd=r[2]*k,Hd=r[3]*k,cx=r[4]*k,cy=A57.mid.has(m[0])?Hd/2:r[5]*k;
      return _g.call(this,'a57/'+key,Wd,Hd,cx,cy,g=>{g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,Wd,Hd)},{force:1,scale:Math.max(1,Math.min(2,DPR))})}}
  return _g.apply(this,arguments)}}
// 던전 입구 (새 땅 넷 · 큰 구덩이)
{const _dc=drawCave;drawCave=function(d){const id=!DG&&d&&d.cave&&d.cave.id,key=id&&A57.cave[id],R0=key?a57R(key):null;if(!R0)return _dc.apply(this,arguments);
  const r=R0[1],s=d._s,k=A57.caveW/r[2];a57Draw(ctx,key,s.x,s.y+6,k,false);
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.32+.1*Math.sin(time*3);glow(s.x,s.y-20,30,d.cave.torch||'#ff9a40');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}

/* ===== 유리얼음 호수: 낚시 구멍 · 얇은 얼음 (코드 그림 위에 덮음 · 찌는 다시 위에) ===== */
{const _dl=r110DrawLake;r110DrawLake=function(){_dl.apply(this,arguments);const L=RCACHE[R110.lake],Q=L&&L.r110;if(!Q||!a57R('r110_fishhole'))return;
  ctx.save();S();const KW=KI*1.414;
  for(const p of Q.thin){const sp=W2S(p.x,p.y);if(!onScreen(sp,p.r*2))continue;const brk=time-p.brk<30,R0=a57R('r110_thinice');if(!R0)break;const k=p.r*2*KW/R0[1][2];ctx.globalAlpha=brk?.35:.9;a57Draw(ctx,'r110_thinice',sp.x,sp.y,k,false)}
  ctx.globalAlpha=1;const F=R110V.fish;
  for(const h of Q.holes){const sp=W2S(h.x,h.y);if(!onScreen(sp,90))continue;const cd=time-(R110V.hole[h.i]||-99)<25,R0=a57R('r110_fishhole');const k=90/R0[1][2];ctx.globalAlpha=cd?.6:1;a57Draw(ctx,'r110_fishhole',sp.x,sp.y,k,false);ctx.globalAlpha=1;
    if(F&&F.h===h){const bob=F.st==='bite'?Math.sin(time*30)*5:Math.sin(time*3)*1.5;ctx.fillStyle='#ff5a3a';ctx.beginPath();ctx.arc(sp.x+4,sp.y+bob-2,4,0,6.283);ctx.fill()}}
  ctx.restore()}}

/* ===== 대성당 안: 홀 바닥 둥근 무늬 · 색유리 빛줄기 · 벽 ===== */
{const _cf=r110cFloor;r110cFloor=function(){const R0=a57R('r110_cath_floor');if(R0&&DG&&DG.ct){const hc=r1cW(R1C.cx,R1C.cy),s=W2S(hc.x,hc.y),R=R1C.hr*TS-40,k=R*2*KI*1.414/R0[1][2];
    ctx.save();S();ctx.globalAlpha=.92;a57Draw(ctx,'r110_cath_floor',s.x,s.y,k,false);ctx.restore()}return _cf.apply(this,arguments)}}
{const _cg=r110cGlow;r110cGlow=function(){const R0=a57R('r110_cath_glass');if(!R0||!DG||!DG.ct)return _cg.apply(this,arguments);
  // 색 빛줄기(원래 그림)는 그대로 두고, 그 위에 창살 무늬가 있는 흰 빛줄기 그림을 옅게 더한다
  const C=DG.ct,o=ctx.globalCompositeOperation;S();ctx.globalCompositeOperation='lighter';const k=420/R0[1][3];
  for(let i=0;i<8;i++){const a=R1C.ang[i],p=r1cW(R1C.cx+Math.cos(a)*(R1C.hr-1.3),R1C.cy+Math.sin(a)*(R1C.hr-1.3)),s=W2S(p.x,p.y);if(!onScreen(s,300))continue;
    ctx.globalAlpha=(C.bell[i]?.3:.14)+.04*Math.sin(time*1.3+i);a57Draw(ctx,'r110_cath_glass',s.x,s.y,k,false)}
  ctx.globalAlpha=1;ctx.globalCompositeOperation=o;return _cg.apply(this,arguments)}}
// 대성당 벽: 그림 가운데 띠(벽돌 줄)를 벽 면 무늬로 (옹기여신 던전 벽과 같은 방식 · 윗면 · 모서리는 그대로)
function a57WallTex(){const R0=a57R('r110_cath_wall');if(!R0)return null;if(A57.wt&&A57.wtP===R0[0])return A57.wt;const [PK,r]=R0,cv=document.createElement('canvas');cv.width=128;cv.height=44;
  cv.getContext('2d').drawImage(PK.img,r[0]+r[2]*.12,r[1]+r[3]*.5,r[2]*.76,r[3]*.2,0,0,128,44);A57.wtP=PK;return A57.wt=cv}
{const _w=wallSprite;wallSprite=function(d,h,v,pil){const T=d&&d.cath?a57WallTex():null;if(!T)return _w.apply(this,arguments);const M=DGMAT[d.id]||DGMAT.barrow;
  return SC.get(`a57wall/${h}/${v}/${pil}`,176,h+100,88,h+52,g=>{g.translate(88,h+52);const A=[0,-37.5],B=[75,0],C=[0,37.5],D=[-75,0],rc=(c,k,a)=>`rgba(${Math.min(255,c[0]*k)|0},${Math.min(255,c[1]*k)|0},${Math.min(255,c[2]*k)|0},${a==null?1:a})`;
    const face=(o,dx,dy,dark)=>{g.save();g.transform(dx,dy,0,-1,o[0],o[1]);const s=100/128;
      for(let y=0,row=0;y<h;y+=44*s,row++){g.save();g.translate(0,y+44*s);g.scale(s,-s);for(let x=-((row*37+v*23)%128);x<128/s;x+=128)g.drawImage(T,x,0);g.restore()}
      g.fillStyle=`rgba(0,0,0,${dark})`;g.fillRect(0,0,100,h);
      const gr=g.createLinearGradient(0,0,0,46);gr.addColorStop(0,`rgba(${M.soot},.8)`);gr.addColorStop(1,`rgba(${M.soot},0)`);g.fillStyle=gr;g.fillRect(0,0,100,46);g.restore()};
    face(D,.75,.375,.05);face(B,-.75,.375,.36);
    const U=[A,B,C,D].map(p=>[p[0],p[1]-h]);g.beginPath();U.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=rc(M.top,1.05);g.fill();
    g.lineWidth=2;g.strokeStyle=rc(M.topDust,1.25,.55);g.beginPath();g.moveTo(U[3][0],U[3][1]);g.lineTo(U[2][0],U[2][1]);g.stroke();g.strokeStyle=rc(M.topDust,1,.3);g.beginPath();g.moveTo(U[2][0],U[2][1]);g.lineTo(U[1][0],U[1][1]);g.stroke();
    if(pil){const x0=-10,yb=C[1]+3,yt=C[1]-h-8;g.fillStyle=rc(M.brick,.95);g.fillRect(x0,yt,10,yb-yt);g.fillStyle=rc(M.brick,.62);g.fillRect(0,yt,10,yb-yt);g.fillStyle=rc(M.top,1.1);g.fillRect(x0-3,yt-5,26,7)}
    g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1;g.beginPath();g.moveTo(D[0],D[1]);g.lineTo(C[0],C[1]);g.lineTo(B[0],B[1]);g.stroke()},{force:1})}}

/* ===== 스킬 그림 (마법사 · 사제 · 내 직업 묶음만) ===== */
const a57IcPk=cls=>'icon57-'+cls;
function a57Icon(s){if(!s||!s.cls||!s.id||(typeof flWant==='function'&&!flWant()))return null;// 「예전 그림」이면 기억해 둔 것도 쓰지 않음
  const key=s.cls+'_'+s.id;if(!A57.keys[a57IcPk(s.cls)]||!A57.keys[a57IcPk(s.cls)].includes(key))return null;
  let u=A57.ic.get(key);if(u)return u;const PK=typeof flPack==='function'?flPack(a57IcPk(s.cls)):null,r=PK&&PK.meta.r[key];if(!r)return null;
  try{const cv=document.createElement('canvas');cv.width=r[2];cv.height=r[3];cv.getContext('2d').drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);
    u=`<svg viewBox="0 0 32 32" aria-hidden="true"><image href="${cv.toDataURL('image/png')}" x="0" y="0" width="32" height="32"/></svg>`}catch(_){return null}
  A57.ic.set(key,u);return u}
if(typeof IC25==='object'&&typeof IC25.svg==='function'){const _s=IC25.svg;IC25.svg=function(s){return a57Icon(s)||_s.apply(this,arguments)};
  if(typeof IC25.has==='function'){const _h=IC25.has;IC25.has=function(s){return !!a57Icon(s)||_h.apply(this,arguments)}}}
if(typeof physIcon==='function'){const _p=physIcon;physIcon=function(s){return a57Icon(s)||_p.apply(this,arguments)}}
function a57IcNeed(){if(P&&P.cls&&A57.keys[a57IcPk(P.cls)]&&typeof flNeed==='function')flNeed(a57IcPk(P.cls))}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{a57IcNeed()}catch(e){if(window.__QA)throw e}return r}}
{const _ld=load;load=function(){const r=_ld.apply(this,arguments);try{if(r)a57IcNeed()}catch(e){if(window.__QA)throw e}return r}}
// 묶음이 들어오면: 스킬 그림이면 단축칸 · 열린 창 다시 그리기, 새 땅 묶음이면 구운 그림 다시
{const _r=flReady;flReady=function(name){const r=_r.apply(this,arguments);try{if(/^icon57-/.test(name)){A57.ic.clear();if(typeof PUI==='object'&&PUI&&PUI.ic)PUI.ic.clear();if(P&&typeof buildBar==='function')buildBar();if(typeof renderPanel==='function'&&typeof panel!=='undefined'&&panel&&!panel.hidden)renderPanel()}
    else if(A57.keys[name]&&typeof WB==='object')WB.dg=null}catch(e){if(window.__QA)throw e}return r}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{A57,a57R,a57All,a57Place,a57Icon})}catch(_){}},0);
