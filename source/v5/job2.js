/* ---------- v19 (JOB): 2차 전직 · 시스템 · 새 효과 ----------
   데이터는 job2d.js. 퀘스트 · 시련의 문 · 전직관 · 스킬 창 탭 · 저장은 job2q.js.
   · P.job2: null | 갈래 id. 50레벨에 전직 퀘스트를 마치면 정해진다. job2Ok(id): 그 갈래 스킬만 찍고 쓴다.
   · 새 효과는 모두 기존 함수(tryCast · hurtE · applyFx · hitPlayer · updateAllies · update · drawAlly)를 감싸서 넣는다.
   · 피해는 더하는 식: 패시브 % 는 기존 덧셈 칸(강화 칸 · 물리 % 칸 · 동료 % 칸) 안에서 한 번만 곱한다. */
const JOB2={
  mage:{archmage:{n:'아크메이지',tree:'원소',desc:'네 원소를 섞어 쓰는 원소 특화. 다른 원소를 번갈아 쓸수록 강해진다.',next:'대마법사'},
        summoner:{n:'서머너',tree:'소환',desc:'정령과 골렘을 불러 함께 싸우는 소환 특화. 혼자 다니기 편하다.',next:'정령왕의 계약자'}},
  priest:{inquisitor:{n:'대심문관',tree:'심문',desc:'강한 공격 기도로 혼자서도 싸우는 공격 특화.',next:'빛의 집행자'},
          archbishop:{n:'대주교',tree:'성가',desc:'치유·축복·수호로 파티를 지키는 보조 특화. 공격은 약하다.',next:'성자'}},
  warrior:{guardian:{n:'가디언 나이트',tree:'수호기사',desc:'몹을 모으고 버티며 동료를 지키는 탱커.',next:'성벽의 군주'},
           berserker:{n:'버서커',tree:'광전사',desc:'치명타·흡혈·연타로 밀어붙이는 공격 특화.',next:'전쟁군주'}},
  archer:{hawkeye:{n:'호크아이',tree:'명궁',desc:'멀리서 정확하게 쏘는 사격 특화.',next:'신궁'},
          ranger:{n:'레인저',tree:'덫과 사냥',desc:'덫을 깔고 동료와 함께 몹을 다루는 덫 특화.',next:'그림자 사냥꾼'}}};
const J2LV=50;
const job2Ok=id=>{const s=SPELLS[id];return !s||!s.job2||s.job2===P.job2};
const job2Of=br=>{for(const c in JOB2)if(JOB2[c][br])return JOB2[c][br];return null};
const job2SwapPrice=()=>40000+Math.max(0,P.lvl-50)*2200;
// 시전 시간 · 채널링 표 (castmark.js 표시도 이 표를 읽는다)
Object.assign(CAST_T,CAST_T_J2);Object.assign(CHAN,CHAN_J2);
// 계열(갈래) · 선행 · 칸 자리: 2차 갈래는 문자열 계열 'j_갈래' (1차 숫자 탭과 겹치지 않음)
for(const id of J2_SPELLS)TREE[id]='j_'+SPELLS[id].job2;
for(const l of LINKS_J2.trim().split(/\s+/)){const [a,b]=l.split('>');if(SPELLS[a]&&SPELLS[b]&&SPELLS[a].rank<SPELLS[b].rank&&TREE[a]===TREE[b])(PRE[b]=PRE[b]||[]).push(a)}
for(const c in JOB2_IDS)for(const br of JOB2_IDS[c]){const list=J2_SPELLS.map(id=>SPELLS[id]).filter(s=>s.job2===br);
  for(let r=10;r<=19;r++){const row=list.filter(s=>s.rank===r),used=new Set();row.sort((a,b)=>(PRE[b.id]?1:0)-(PRE[a.id]?1:0));
    for(const s of row){const want=PRE[s.id]&&TREEPOS[PRE[s.id][0]]?TREEPOS[PRE[s.id][0]].col:0;let c2=want;
      for(let d=0;d<6;d++){if(!used.has(want+d)){c2=want+d;break}if(want-d>=0&&!used.has(want-d)){c2=want-d;break}}
      used.add(c2);TREEPOS[s.id]={row:r-1,col:c2}}}}
// 패시브: 지금 갈래의 것만 더한다 (다른 갈래 점수는 갈래 바꾸기 때 돌려받지만, 혹시 남아 있어도 켜지지 않게)
for(const c in PASSIVES){const all=PASSIVES[c].slice();Object.defineProperty(PASSIVES,c,{configurable:true,enumerable:true,get(){return P&&P.cls===c?all.filter(id=>job2Ok(id)):all}})}
// 배우기: 그 갈래로 전직했을 때만
{const _cl=canLearn;canLearn=function(id){return job2Ok(id)&&_cl(id)}}
// 장비 「+갈래 기술」 옵션 이름 (tr_j_갈래)
{const _sn=statName;statName=function(k){if(typeof k==='string'&&k.startsWith('tr_j_')){const j=job2Of(k.slice(5));return j?`${j.n} 갈래 기술`:k}return _sn(k)}}
// 1차 칭호 + 위계 시험 인증 / 2차 칭호
const TRIAL_BADGE={
  mage:   ['','제2위계 인증','제3위계 인증','제4위계 인증','제5위계 인증','제6위계 인증','제7위계 인증','제8위계 인증'],
  priest: ['','은총 2단계 · 서원','은총 3단계 · 서품','은총 4단계 인증','은총 5단계 인증','은총 6단계 인증','은총 7단계 인증','은총 8단계 인증'],
  warrior:['','첫 방패','훈련병','종자','정식 병사','고참 병사','부대장','기사 후보'],
  archer: ['','첫 사냥','몰이꾼','정찰병','사수','숙련 사수','추적자','명궁 후보']};
function job2Title(){const C=CLASSES[P.cls];if(P.job2&&JOB2[P.cls]&&JOB2[P.cls][P.job2])return JOB2[P.cls][P.job2].n;return C.grade[Math.min(C.grade.length,rankOf(P.lvl))-1]}
const trialBadge=()=>{const b=TRIAL_BADGE[P.cls];return b&&P.trial>0&&!P.job2?b[Math.min(b.length-1,P.trial)]||'':''};
{const _uh=updateHud;updateHud=function(){_uh();if(P.job2||P.trial>0){const b=trialBadge();el.title.textContent=job2Title()+(b?' · '+b:'')}}}
{const _gx=gainXp;gainXp=function(n){const l0=P.lvl;const r=_gx(n);if(l0<J2LV&&P.lvl>=J2LV&&!P.job2)setTimeout(()=>msg('2차 전직을 할 수 있습니다. 직업 전직관에게 가 보세요 (의뢰 일지 L)','#ffd76a'),300);return r}}

/* ===== 쓰기: 갈래 확인 · 시전 앞뒤 처리 ===== */
const J2R={el:null,n:0,t:0};// 원소 공명(아크메이지): 다른 원소 마법을 이어 쓸 때마다 쌓임
const J2_BX=['petDmg','petHp','petSpd','petSize','thorns','ccImmune','ias','ls','blockRanged','arc','trapThrow','spreadOne','threatDown','size'];
const j2Mine=()=>allies.filter(a=>a.j2&&!a.gone);
const j2BS=k=>{let v=0;for(const id in P.buffs)v+=+P.buffs[id][k]||0;return v};// 강화에만 있는 값(패시브 제외)
function j2Pre(id,t){const s0=SPELLS[id];
  const c={id,s0,t,cd0:P.cd[id]||0,CM:CAST_MOD,G:GHOST,nP:projs.length,nF:fields.length,A:new Set(allies),T:new Set(traps),ox:P.x,oy:P.y};
  if(GHOST||CAST_MOD)return c;
  if(s0.swap&&!j2Mine().some(a=>a.s.kind==='summon'||a.wisp)){if(P.noMpT<=0){msg(`${s0.n}: 자리를 바꿀 소환수가 없습니다`,'#a39d8f');P.noMpT=1.2}return false}
  if(s0.one&&s0.kind==='charge'&&typeof PTY==='object'){const R0=PTY.pick();if(R0.r){c.rush=R0.r;c.t={x:R0.r.x,y:R0.r.y}}}
  // 축복의 왕관: 한 사람 축복·보호막이 둘레 파티원 모두에게
  if(s0.one&&P.buffs.crownofblessing&&P.buffs.crownofblessing.t>0&&['buff','shield','heal','hot','ward'].includes(s0.kind)){c.crown=1;delete s0.one;s0.party=550}
  return c}
function j2Post(c){const s0=c.s0,id=c.id;if(c.crown){s0.one=1;delete s0.party}
  const did=c.CM?true:(P.cd[id]||0)>c.cd0+1e-9;if(!did)return;
  const L=Math.max(1,skLv(id)),s=eff(id,L),G=c.G;
  // 원소 공명
  if(!G&&!c.CM&&P.cls==='mage'&&isDmg(s0)&&s0.el!=='phys'){if(J2R.el&&J2R.el!==s0.el&&passSum('reson')>0){J2R.n=Math.min(4,J2R.n+1);J2R.t=8;ftext(P.x,P.y-20,`원소 공명 ${J2R.n}`,'#d8c8ff',false,70)}else if(J2R.n)J2R.t=8;J2R.el=s0.el}
  const np=projs.slice(c.nP);
  if(s0.prism&&!c.CM){const k=(P._prism=((P._prism|0)+1)%3),el=['fire','ice','storm'][k];for(const p of np)if(p.s&&p.s.id===id){p.s=Object.assign({},p.s,{el,burn:k===0?1:0,slow:k===1?1:0,j2arc:k===2?2:0});p.col=EL[el]}}
  if(s0.cls==='archer'&&s0.kind==='bolt'){const rg=passSum('range');if(rg>0)for(const p of np)if(p.s&&p.s.id===id)p.life*=1+rg}
  // 소환: 서머너 강화 · 정령 군단 · 한꺼번에 4종류까지
  if(s0.kind==='summon'&&s0.job2&&!G){const nw=allies.filter(a=>!c.A.has(a));
    if(s0.legion){for(const a of nw)a.gone=true;allies=allies.filter(a=>!a.gone);
      for(const k of s0.legion)j2Summon(k,Math.max(1,skLv(k)||L),{amp:s0.amp||0,dur:s.dur,x:P.x+rnd(-50,50),y:P.y+rnd(-50,50),legion:1});
      rings.push({x:P.x,y:P.y,r:10,max:200,life:.8,col:'#d8c8ff'});burst(P.x,P.y,'#d8c8ff',50,220,3,20)}
    else for(const a of nw)j2Setup(a,s,0);
    const kinds=[];for(const a of j2Mine())if(!a.wisp&&!kinds.includes(a.s.id))kinds.push(a.s.id);
    while(kinds.length>4+Math.min(1,passSum('petKinds')|0)){const old=kinds.shift();for(const a of allies)if(a.j2&&a.s.id===old)a.gone=true}allies=allies.filter(a=>!a.gone)}
  // 덫: 던지기(덫 던지기 강화)
  if(s0.kind==='trap'&&!G){const tw=j2BS('trapThrow');if(tw>0&&c.t){const nt=traps.filter(q=>!c.T.has(q));if(nt.length){const p=clampRange(c.t,tw),dx=p.x-nt[0].x,dy=p.y-nt[0].y;for(const q of nt){const l=landAt(q.x,q.y,q.x+dx,q.y+dy);q.x=l.x;q.y=l.y}}}}
  if(s0.kind==='detonate')j2Detonate(s,id,L,c);
  if(s0.kind==='link'&&!G)j2Link(s,id);
  if(s0.kind==='cleanse'&&!G)j2CleanseCast(s,id);
  if(s0.swap&&!G){const mine=j2Mine();let a=null;if(c.t){let bd=140;for(const o of mine){const d=dist(o,c.t);if(d<bd){bd=d;a=o}}}
    if(!a){let bd=-1;for(const o of mine){const d=dist(o,{x:c.ox,y:c.oy});if(d>bd){bd=d;a=o}}}
    if(a){const ax=a.x,ay=a.y;burst(P.x,P.y,EL.arcane,20,120,3,16);a.x=c.ox;a.y=c.oy;P.x=ax;P.y=ay;followCam();burst(P.x,P.y,EL.arcane,24,140,3,16);rings.push({x:a.x,y:a.y,r:6,max:60,life:.4,col:EL.arcane})}}
  if(s0.shot){const sh=s0.shot,a0=c.t?Math.atan2(c.t.y-c.oy,c.t.x-c.ox):P.face,pw=G?0:physPower()*sh.mult*physBuffMul()*physScale(id,L),ss=Object.assign({},s,{kind:'bolt',shot:0,mult:sh.mult,phys:1,ghost:G?1:s.ghost});
    for(let i=0;i<sh.cnt;i++){const a=a0+(i-(sh.cnt-1)/2)*sh.spread;projs.push({x:P.x+Math.cos(a)*16,y:P.y+Math.sin(a)*16,z:20,vx:Math.cos(a)*900,vy:Math.sin(a)*900,r:6,dmg:pw,owner:'p',s:ss,life:.9,col:EL.phys,hit:null})}P.face=a0}
  if(s0.rushAlly&&!G){const sh=s0.rushShield,amt=Math.round((physPower()*sh.mult+sh.flat)*supScale(L));
    if(!(P.shield>amt&&P.shieldT>0)){P.shield=amt;P.shieldT=sh.dur;P.shieldN=0;P.shieldRef=0;P.shieldS=s}
    for(const e of enemies)if(!e.dead&&dist(e,P)<(s0.rad||200)+e.r)applyFx(e,{taunt:s0.taunt},P);
    rings.push({x:P.x,y:P.y,r:10,max:s0.rad||200,life:.5,col:'#e8e4d8'});msg(`${s0.n} (${amt} 흡수)`,'#e8e4d8');
    if(c.rush&&NET.on)netSend({t:'j2x',k:'sh',to:c.rush.id,a:amt,d:sh.dur})}
  if(s0.kind==='buff'&&P.buffs[id]&&!G)for(const k of J2_BX)if(s[k]!=null&&s[k]!==0)P.buffs[id][k]=s[k];
  if(s0.kind==='buff'&&(s0.petDmg||s0.petHp)&&!G)for(const a of j2Pets())j2PetBuff(a,s);
  if(c.crown&&NET.on&&!G)netSend({t:'j2x',k:'crown',sp:id,L,pw:Math.round(power())})}
{const _tc=tryCast;tryCast=function(id,t){const s0=SPELLS[id];if(!s0)return _tc(id,t);
  if(s0.job2&&!GHOST&&!CAST_MOD&&s0.job2!==P.job2&&s0.cls===P.cls){if(P.noMpT<=0){const j=job2Of(s0.job2);msg(`${s0.n}: 2차 전직 「${j?j.n:s0.job2}」 갈래의 기술입니다`,'#a39d8f');P.noMpT=1.5}return}
  const c=j2Pre(id,t);if(c===false)return;const r=_tc(id,c.t||t);try{j2Post(c)}catch(err){if(window.__QA)throw err}return r}}
// 다 외운 시전(시전 시간 마법)은 cast.js가 안쪽 tryCast로 바로 부른다 → 같은 앞뒤 처리
{const _cr=_castRelease;_castRelease=function(cu){const s0=SPELLS[cu.id];if(!s0||(!s0.job2&&s0.kind!=='summon'))return _cr(cu);const c=j2Pre(cu.id,cu.tg);if(c===false)return;_cr(cu);j2Post(c)}}
// 덫 수 + (덫 장인)
{const _ef=eff;eff=function(id,L){const e=_ef(id,L);if(e.kind==='trap'&&!GHOST&&P&&P.cls==='archer'&&e.cls==='archer'){const n=passSum('trapN');if(n>0)e.maxN=(e.maxN||2)+n}return e}}

/* ===== 소환수 (서머너 · 사냥 동료 강화) ===== */
const J2FORM={fireelem:{k:'l_elem',r:16,ranged:1},golem:{k:'i_elem',r:20},stone:{k:'j_golem',r:24},wisp:{r:9},falcon:{bird:'#6a8ab8',r:12},firebird:{bird:'#ff8a3a',r:14}};
const j2Pets=()=>allies.filter(a=>!a.gone&&a.s&&(a.j2||a.s.cls==='archer'));
function j2Setup(a,s,amp){a.j2=1;a.hs={id:s.id,cls:s.cls,el:s.el,kind:'summon',rank:s.rank,job2:s.job2,n:s.n,L:s.L};
  const pd=passSum('petDmg'),ph=passSum('petHp');a.dmg*=(1+pd+(amp||0))/(1+(P.cls==='mage'?0:pd));a.max=a.hp=Math.round(a.max*(1+ph+(amp||0)));
  const f=s.form==='golem'&&s.tint==='stone'?J2FORM.stone:J2FORM[s.form]||{};a.r=Math.round((f.r||18)*(s.sc||1));a.fly=s.fly?1:0;a.tt=1}
function j2Summon(id,L,o){const s=eff(id,L),sup=supScale(L),hp=Math.round(maxHp()*s.hp*sup),pw=power()*(s.mult||0)*dmgMul()*dmgScale(id,L);
  allies=allies.filter(a=>!(a.s&&a.s.id===id));const p=DG?dgLand(P.x,P.y,o.x,o.y):{x:o.x,y:o.y};
  const a={ally:1,x:p.x,y:p.y,hp,max:hp,r:20,dmg:pw,t:o.dur||s.dur,s:Object.assign(s,{dur:o.dur||s.dur}),atkCd:.5,anim:0,fx:1,lunge:0,hurt:0,legion:o.legion?1:0};allies.push(a);j2Setup(a,s,o.amp);
  rings.push({x:p.x,y:p.y,r:6,max:60,life:.5,col:EL[s.el]});return a}
function j2Wisp(f){const sp=f.s.spawn,L=f.s.L||1;if(allies.filter(a=>a.wisp).length>=sp.max)return;
  const hp=Math.round(maxHp()*sp.hp*supScale(L)),pw=power()*sp.mult*dmgMul()*dmgScale(f.s.id,L),a0=R()*6.283,x=f.x+Math.cos(a0)*30,y=f.y+Math.sin(a0)*30;
  const s={id:'j2wisp',n:'작은 정령',cls:'mage',el:'arcane',kind:'summon',rank:16,job2:'summoner',form:'wisp',dur:sp.dur,L};
  const a={ally:1,x,y,hp,max:hp,r:9,dmg:pw,t:sp.dur,s,atkCd:.3,anim:R()*3,fx:1,lunge:0,hurt:0,wisp:1};allies.push(a);j2Setup(a,s,0);a.dmg=pw;a.max=a.hp=hp;
  burst(x,y,'#d8c8ff',10,90,2.5,20)}
function j2PetBuff(a,s){a.aw={t:s.dur,dmg:s.petDmg||0,size:s.petSize||1};if(s.petHp){const k=1+s.petHp;if(!a.awHp){a.awHp=k;a.max=Math.round(a.max*k);a.hp=Math.round(a.hp*k)}}}
const j2PetSpd=()=>Math.min(.6,j2BS('petSpd'));
function j2AllyTick(a,dt){const s=a.s,sp=1+j2PetSpd();a.t-=dt;a.anim+=dt;a.atkCd-=dt*sp;a.hurt-=dt;a.lunge=Math.max(0,a.lunge-dt);
  if(a.aw){a.aw.t-=dt;if(a.aw.t<=0){if(a.awHp){a.max=Math.round(a.max/a.awHp);a.hp=Math.min(a.hp,a.max);a.awHp=0}a.aw=null}}
  let tg=null,bd=a.fly?640:560;for(const e of enemies){if(e.dead)continue;const d=dist(e,a);if(d<bd){bd=d;tg=e}}
  let mx=0,my=0,spd=(a.fly?230:a.wisp?150:115)*sp;
  if(tg){a.fx=((tg.x-a.x)-(tg.y-a.y))>=0?1:-1;const d=bd;
    if(s.ranged){if(d>260){mx=(tg.x-a.x)/d;my=(tg.y-a.y)/d}else if(d<140){mx=-(tg.x-a.x)/d;my=-(tg.y-a.y)/d}
      if(d<440&&a.atkCd<=0){a.atkCd=1;a.lunge=.2;const an=Math.atan2(tg.y-a.y,tg.x-a.x);projs.push({x:a.x,y:a.y,z:30,vx:Math.cos(an)*480,vy:Math.sin(an)*480,r:8,dmg:a.dmg,owner:'p',s:Object.assign({},a.hs,{burn:1}),life:1.2,col:EL.fire,hit:null})}}
    else if(a.fly){if(d>90){mx=(tg.x-a.x)/d;my=(tg.y-a.y)/d}else{const an=a.anim*2;mx=Math.cos(an)*.6;my=Math.sin(an)*.6}
      if(d<260&&a.atkCd<=0){a.atkCd=1.2;a.lunge=.2;
        if(s.form==='firebird'){rings.push({x:tg.x,y:tg.y,r:6,max:80,life:.35,col:EL.fire});burst(tg.x,tg.y,EL.fire,14,120,3,20);const hs=Object.assign({},a.hs,{burn:1});for(const e of enemies)if(!e.dead&&dist(e,tg)<80+hR(e))hurtE(e,a.dmg*rnd(.9,1.1)*(e===tg?1:.6),hs)}
        else{const st=stormStyle(4),hit=new Set([tg]);zap({x:a.x,y:a.y,z:60},{x:tg.x,y:tg.y,z:10},Object.assign({life:.25},st));hurtE(tg,a.dmg*rnd(.9,1.1),a.hs);let from=tg;
          for(let i=0;i<(s.chain||0);i++){const o=nearestEnemy(from,220,hit);if(!o)break;hit.add(o);zap({x:from.x,y:from.y,z:16},{x:o.x,y:o.y,z:16},Object.assign({life:.22},st));hurtE(o,a.dmg*.6,a.hs);from=o}}}}
    else{if(d>a.r+tg.r+6){mx=(tg.x-a.x)/d;my=(tg.y-a.y)/d}else if(a.atkCd<=0){a.atkCd=a.wisp?.8:1.1;a.lunge=.2;hurtE(tg,a.dmg*rnd(.9,1.1),a.hs);if(s.slowHit)tg.slowT=Math.max(tg.slowT,2);applyFx(tg,{knock:a.wisp?0:16},a);burst(tg.x,tg.y,EL[s.el]||'#c9a46a',8,110,2.5,12)}}}
  else{const d=dist(a,P);if(d>(a.fly?60:90)){mx=(P.x-a.x)/d;my=(P.y-a.y)/d;a.fx=((P.x-a.x)-(P.y-a.y))>=0?1:-1}}
  if(s.taunt&&!s.legionKid){a.tt-=dt;if(a.tt<=0){a.tt=s.tauntIv||6;let n=0;for(const e of enemies){const t=TYPES[e.k]||{};if(e.dead||t.boss||t.mini||dist(e,a)>240)continue;clsFx(e,{taunt:s.taunt},a,a);n++}if(n)rings.push({x:a.x,y:a.y,r:10,max:240,life:.6,col:'#c9a46a'})}}
  if(a.fly){a.x+=mx*spd*dt;a.y+=my*spd*dt}else moveBody(a,mx*spd*dt,my*spd*dt);
  if(a.hp<=0&&s.rebirth&&!a.reb){a.reb=1;a.hp=a.max;rings.push({x:a.x,y:a.y,r:10,max:120,life:.8,col:EL.fire});burst(a.x,a.y,EL.fire,40,180,3.5,30);msg(`${s.n}이(가) 불길 속에서 되살아났습니다`,EL.fire)}
  else if(a.hp<=0||a.t<=0){a.gone=true;burst(a.x,a.y,EL[s.el]||'#8a7350',24,140,3,14)}}
{const _ua=updateAllies;updateAllies=function(dt){if(!allies.some(a=>a.j2))return _ua(dt);const mine=allies.filter(a=>a.j2);allies=allies.filter(a=>!a.j2);_ua(dt);
  for(const a of mine)j2AllyTick(a,dt);allies=allies.concat(mine.filter(a=>!a.gone))}}
// 그림: 기존 몬스터 그림을 빌린다(불꽃 정령 · 얼음 정령 · 신전 수호석상) · 새·작은 정령은 가볍게 그린다
function j2Bird(a,s,col){const b=Math.sin(a.anim*14),hy=s.y-50+Math.sin(a.anim*2)*4-(a.lunge>0?-14:0),k=(a.s.sc||1)*(a.aw?a.aw.size:1);ctx.save();Kit.shadow(ctx,s.x,s.y,10*k,4*k,.6);ctx.translate(s.x,hy);ctx.scale((a.fx||1)*k,k);
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-2,0);ctx.quadraticCurveTo(-16,-10-b*8,-26,-2-b*10);ctx.quadraticCurveTo(-14,2,-2,4);ctx.fill();ctx.beginPath();ctx.moveTo(2,0);ctx.quadraticCurveTo(16,-10-b*8,26,-2-b*10);ctx.quadraticCurveTo(14,2,2,4);ctx.fill();
  ctx.fillStyle=Kit.mix(col,'#ffffff',.35);ctx.beginPath();ctx.ellipse(0,1,5,8,0,0,6.283);ctx.fill();ctx.globalCompositeOperation='lighter';ctx.fillStyle=Kit.mix(col,'#ffffff',.6);ctx.beginPath();ctx.arc(3,-6,3,0,6.283);ctx.fill();ctx.globalCompositeOperation='source-over';ctx.restore()}
{const _da=drawAlly;drawAlly=function(a){if(!a.j2&&!(a.aw&&a.s&&(a.s.form==='wolf')))return _da(a);const s=a._s;if(!s||!onScreen(s,80))return;
  if(!a.j2){ctx.save();ctx.globalAlpha=.55;ctx.strokeStyle='#ffd76a';ctx.lineWidth=2;ell2(s.x,s.y,24,9);ctx.restore();return _da(a)}
  const f=a.s.form,F=a.s.form==='golem'&&a.s.tint==='stone'?J2FORM.stone:J2FORM[f]||{},k=(a.aw?a.aw.size:1);
  ctx.save();ctx.globalAlpha=.5;ctx.strokeStyle=a.legion?'#d8c8ff':'#8cf08a';ctx.lineWidth=1.5;ell2(s.x,s.y,a.r+6,(a.r+6)*.4);ctx.restore();
  if(F.k){const pe=a.pe||(a.pe={k:F.k,freezeT:0,stunT:0,slowT:0,elite:false});Object.assign(pe,{x:a.x,y:a.y,fx:a.fx||1,anim:a.anim,lunge:a.lunge,hurt:a.hurt,sc:(TYPES[F.k].sc||1)*(a.s.sc||1)*k*.9});drawMon(ctx,pe,s.x,s.y)}
  else if(F.bird)j2Bird(a,s,F.bird);
  else{const y=s.y-22+Math.sin(a.anim*5)*3;ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(185,162,255,.35)';ctx.beginPath();ctx.arc(s.x,y,11,0,6.283);ctx.fill();ctx.fillStyle='#e8dcff';ctx.beginPath();ctx.arc(s.x,y,5,0,6.283);ctx.fill();ctx.restore()}
  const w=30,y=s.y-(a.fly?72:F.k?58:40)*(F.k==='j_golem'?1.3:1);ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,5);ctx.fillStyle='#6ad06a';ctx.fillRect(s.x-w/2,y,w*clamp(a.hp/a.max,0,1),3)}}

/* ===== 터뜨리기 · 이어짐 · 정화 ===== */
const J2BLAST={id:'j2blast',n:'폭발',el:'fire',rank:15,proc:1,cls:'mage'};
function j2Detonate(s,id,L,c){const G=c.G,pw=PHYS_CLS[s.cls]?physPw(id,L,s):power()*(s.mult||0)*dmgMul()*dmgScale(id,L);
  const blast=(x,y,rad,dmg,ss)=>{rings.push({x,y,r:8,max:rad,life:.45,col:EL[ss.el]||EL.phys});burst(x,y,EL[ss.el]||'#c9b48a',30,rad*1.6,4,10);decal(x,y,rad*.5,ss.el);shake=Math.max(shake,4);if(G)return;for(const e of enemies)if(!e.dead&&dist(e,{x,y})<rad+hR(e)){hurtE(e,dmg*rnd(.9,1.1),ss);applyFx(e,ss,{x,y})}};
  if(s.trapAll){const own=G?G.id:0,mine=traps.filter(q=>q.own===own&&q.life>0);
    if(mine.length){for(const q of mine){q.life=0;PFX.trap(q,'boom');if(!G)for(const e of enemies)if(!e.dead&&dist(e,q)<q.s.rad+hR(e)){hurtE(e,q.dmg*s.mult*rnd(.9,1.1),q.s);applyFx(e,q.s,q)}}traps=traps.filter(q=>q.life>0);shake=Math.max(shake,5);return}
    const p=clampRange(c.t||P,TRAP_RANGE);blast(p.x,p.y,110,pw*.6,Object.assign({},s,{kind:'trap',proc:1}));return}
  const mine=G?[]:j2Mine().filter(a=>!a.wisp||true);let a=null,bd=1e9;for(const o of mine){const d=dist(o,c.t||P);if(d<bd){bd=d;a=o}}
  const ss=Object.assign({},s,{proc:1});
  if(a){a.gone=true;allies=allies.filter(o=>!o.gone);if(a.s&&a.s.id&&SPELLS[a.s.id])P.cd[a.s.id]=0;blast(a.x,a.y,s.rad,pw,ss);msg(`${s.n}: ${a.s.n||'소환수'}을(를) 터뜨렸습니다`,EL.fire)}
  else{const p=clampRange(c.t||P,300);blast(p.x,p.y,s.rad*.7,pw*.6,ss)}}
function j2Link(s,id){const R0=typeof PTY==='object'&&NET.on?PTY.pick():{r:null};
  if(!R0.r){P.cd[id]=0;P.mp+=costOf(id);msg(NET.on?`${s.n}: 고른 동료가 없습니다 (파티 창이나 이름표를 눌러 고르세요)`:`${s.n}: 같이 하기에서 동료와 이어 씁니다`,'#a39d8f');return}
  P.j2link={id:R0.r.id,t:s.dur,share:s.share};msg(`${s.n}: ${R0.r.name||'동료'}님과 이어졌습니다 (내 치유의 ${Math.round(s.share*100)}%)`,EL.holy)}
function j2Cleanse(dur){P.j2imm=Math.max(P.j2imm||0,dur||0);if(typeof PTY==='object'&&PTY.pull)PTY.pull=null;P.j2deb=0;rings.push({x:P.x,y:P.y,r:6,max:50,life:.45,col:'#fff2c0'});burst(P.x,P.y,'#fff2c0',18,90,2.5,24)}
function j2CleanseCast(s,id){const R0=typeof PTY==='object'&&NET.on?PTY.pick():{r:null};if(R0.r){msg(`${s.n} → ${R0.r.name||'동료'}`,EL.holy);return}j2Cleanse(s.immune);msg(`${s.n}: 해로운 효과를 지웠습니다`,EL.holy)}
// 내가 나에게 쓴 치유의 일부가 이어진 동료에게 (같이 하기 메시지 'j2x' — 옛 판은 모르는 메시지라 무시)
{const _hl=healP;healP=function(n){const h0=P.hp;_hl(n);const g=P.hp-h0,L=P.j2link;if(g>0&&L&&L.t>0&&NET.on&&!GHOST)netSend({t:'j2x',k:'h',to:L.id,a:Math.round(n*L.share)});
  const amp=passSum('healAmp');void amp}}
{const _sf=supFx;supFx=function(s,id,pwr,from){if(!s||from||GHOST||P.cls!=='priest')return _sf(s,id,pwr,from);const amp=passSum('healAmp');if(!(amp>0))return _sf(s,id,pwr,from);
  const sh0=P.shield;const r=_sf(s,id,pwr*(1+amp),from);if(s.kind==='shield'&&P.shield>sh0)P.shield=Math.round(P.shield);return r}}
{const _nm=netOnMsg;netOnMsg=function(m){if(m&&m.t==='j2x'){if(m.to&&m.to!==NET.id)return;const r=NET.peers.get(m.from);
    if(m.k==='h'&&!P.dead)healP(clamp(+m.a||0,0,maxHp()));
    else if(m.k==='sh'&&!P.dead){const a=clamp(+m.a||0,0,maxHp()*3);if(!(P.shield>a&&P.shieldT>0)){P.shield=a;P.shieldT=clamp(+m.d||5,0,30);P.shieldN=0;P.shieldRef=0}msg(`${r&&r.name||'동료'}님의 수호 돌진 (${a} 흡수)`,'#e8e4d8')}
    else if(m.k==='crown'&&r&&netSame(r)&&!P.dead&&dist(r,P)<=550&&SPELLS[m.sp]){const s=eff(m.sp,clamp(m.L|0,1,40));supFx(s,m.sp,+m.pw||power(),r)}
    return}return _nm(m)}}
{const _ng=netGhostCast;netGhostCast=function(m){_ng(m);const s0=SPELLS[m.sp];if(!s0||!s0.job2)return;
  if(s0.kind==='cleanse'&&m.tg===NET.id&&!P.dead){j2Cleanse(s0.immune);const r=NET.peers.get(m.from);msg(`${r&&r.name||'동료'}님의 ${s0.n}`,EL.holy)}}}

/* ===== 맞힐 때: 패시브 피해 칸 · 조건부 피해 · 표식 · 출혈 · 갈라짐 · 처치 시 재사용 ===== */
const J2BLEED={id:'j2bleed',n:'출혈',el:'phys',rank:14,proc:1,cls:'warrior'},J2COL={id:'j2col',n:'원소 붕괴',el:'arcane',rank:17,proc:1,cls:'mage'};
const J2TRI=['fire','ice','storm'];
{const _he=hurtE;hurtE=function(e,amt,s){
  if(!e||e.dead||!s||s.ghost)return _he(e,amt,s);
  const t=TYPES[e.k]||{},big=t.boss||t.mini;let k=1;
  if(e.weakEl&&s.el===e.weakEl)k*=1.5;
  if(e.trapWeak&&(s.kind==='trap'))k*=e.trapWeak;
  if(s.cls&&s.cls===P.cls){let x=0;
    if(P.cls==='mage'&&s.kind!=='summon'){if(J2R.n>0)x+=J2R.n*passSum('reson');if(big)x+=passSum('bossDmg')}
    if(P.cls==='priest'&&(TREE[s.id]===0||TREE[s.id]===1||s.job2==='inquisitor'))x+=passSum('holyDmg');
    if(x>0){const bd=Math.min(dmgCap(),buffSum('dmg')+(P.armor?P.armor.dmgB:0));k*=(1+Math.min(dmgCap(),bd+x))/(1+bd)}
    if(s.kind==='summon'){const base=passSum('petDmg'),b=j2BS('petDmg');if(b>0)k*=(1+base+b)/(1+base)}
    if(s.kind==='trap'&&P.cls==='archer'&&SPELLS[s.id]){const td=passSum('trapDmg');if(td>0){const ps=physScale(s.id,s.L||1);k*=(ps+td)/ps}}}
  if(s.shatter&&(e.freezeT>0||e.slowT>0))k*=s.shatter;
  if(s.exec&&s.kind!=='melee'&&e.max&&e.hp/e.max<s.exec.hp)k*=s.exec.mul;
  let s2=s;if(s.tri&&s.kind==='rain'){const i=(s._ti=((s._ti|0)+1)%3),el=J2TRI[i];s2=(s._tv||(s._tv=[]))[i]||(s._tv[i]=Object.assign({},s,{el,tri:0,burn:i===0?1:0,slow:i===1?1:0,j2arc:i===2?1:0}))}
  let fc=0;if(s.cls==='archer'&&s.cls===P.cls&&!s.proc){const f=passSum('farCrit');if(f>0){fc=f*clamp(dist(e,P)/500,0,1);P.buffs._j2c={t:1,max:1,crit:fc,n:''}}}
  const h0=e.hp;try{_he(e,amt*k,s2)}finally{if(fc)delete P.buffs._j2c}
  const dealt=Math.max(0,h0-e.hp);if(s.proc||GHOST)return;
  if(s2.j2arc&&!s.arcKid){const hit=new Set([e]);let from={x:e.x,y:e.y,z:16};for(let i=0;i<s2.j2arc;i++){const o=nearestEnemy(e,220,hit);if(!o)break;hit.add(o);zap(from,{x:o.x,y:o.y,z:16},Object.assign({life:.22},stormStyle(4)));_he(o,amt*k*.5,Object.assign({},s2,{j2arc:0,arcKid:1,phys:0}));from={x:o.x,y:o.y,z:16}}}
  if(s.burnMul&&e.burn){e.burn.dps*=s.burnMul;e.burn.t=Math.max(e.burn.t,6)}
  if(s.spreadMarked&&e.markT>0&&e.burn&&!s._spr){s._spr=1;let n=0;for(const o of enemies){if(o===e||o.dead||dist(o,e)>150)continue;o.burn={t:e.burn.t,dps:e.burn.dps};burst(o.x,o.y,EL.fire,8,90,2.5,14);if(++n>=2)break}}
  if(s.bleed&&!e.dead){const b=s.bleed;e.j2bl={t:b.dur,iv:.5,dps:amt*b.mult/b.dur}}
  if(s.collapse&&!e.dead){e.colT=s.collapse.dur;e.colN=[];e.colS={mult:s.collapse.mult,rad:s.collapse.rad,need:s.collapse.need,L:s.L||1}}
  else if(e.colT>0&&s.cls==='mage'&&['fire','ice','storm','earth'].includes(s.el)&&!e.colN.includes(s.el)){e.colN.push(s.el);ftext(e.x,e.y-20,`붕괴 ${e.colN.length}/${e.colS.need}`,'#d8c8ff',false,e.r*2+34);
    if(e.colN.length>=e.colS.need){const C=e.colS,pw=power()*C.mult*dmgMul()*dmgScale('collapse',C.L);e.colT=0;rings.push({x:e.x,y:e.y,r:10,max:C.rad,life:.6,col:'#d8c8ff'});burst(e.x,e.y,'#d8c8ff',50,C.rad*2,4,20);flash={col:'#b9a2ff',a:.2};shake=Math.max(shake,6);
      const cx=e.x,cy=e.y;for(const o of enemies)if(!o.dead&&Math.hypot(o.x-cx,o.y-cy)<C.rad+hR(o))_he(o,pw*rnd(.9,1.1),J2COL)}}
  if(s.cls===P.cls&&P.cls==='priest'&&dealt>0&&!s._hh&&isDmg(s)){const hh=passSum('hitHeal');if(hh>0){s._hh=1;healP(Math.round(maxHp()*hh))}}
  if(s.cls===P.cls&&PHYS_CLS[P.cls]&&dealt>0&&s.kind!=='summon'){const ls=j2BS('ls');if(ls>0&&!P.dead)P.hp=Math.min(maxHp(),P.hp+dealt*ls)}
  if(s.killReset&&e.dead&&SPELLS[s.id]){P.cd[s.id]=0;ftext(P.x,P.y-30,'재사용 풀림','#ffd76a',false,70)}
  if(s.split&&!s.splitKid&&s.kind==='bolt'){const sp=s.split,ss=Object.assign({},s,{split:0,splitKid:1,phys:0});for(let i=0;i<sp.n;i++){const a=i/sp.n*6.283+R()*.3;projs.push({x:e.x+Math.cos(a)*(e.r+6),y:e.y+Math.sin(a)*(e.r+6),z:18,vx:Math.cos(a)*620,vy:Math.sin(a)*620,r:5,dmg:amt*k*sp.mult,owner:'p',s:ss,life:.4,col:EL.phys,hit:new Set([e])})}}}}
{const _af=applyFx;applyFx=function(e,s,from){_af(e,s,from);if(!e||e===P||e.dead||!s||s.ghost||e.ally)return;
  if(!(s.job2||s.fear||s.hook))return;const t=TYPES[e.k]||{},big=t.boss||t.mini;
  if(s.hook&&!big&&!NET.guest){const a=Math.atan2(e.y-P.y,e.x-P.x),d=P.r+e.r+18,x=P.x+Math.cos(a)*d,y=P.y+Math.sin(a)*d;if(DG?dgFree(x,y,e.r*.5):!blockedAt(x,y)){e.x=x;e.y=y}burst(e.x,e.y,'#c9c9d0',8,90,2.5,14)}
  if(s.fear&&!big)e.fearT=Math.max(e.fearT||0,s.fear);
  if(s.freeze&&s.job2&&big&&e.freezeT>1.5)e.freezeT=1.5;
  if(s.root&&big&&e.rootT>0)e.rootT=Math.min(e.rootT,s.bossRoot||1)}}
// 맞을 때: 연막(빗나감) · 반격 오라 · 원소 방벽 · 최후의 보루 도발
const J2THORN={id:'j2thorn',n:'반격',el:'phys',rank:14,proc:1,cls:'warrior'};
{const _hp=hitPlayer;hitPlayer=function(d,src,o){if(P.dead||P.invT>0||!src||src.dead||src.hp==null||!TYPES[src.k])return _hp(d,src,o);
  const t=TYPES[src.k],big=t.boss||t.mini;if(src.blindT>0&&R()<(big?.15:.4)){ftext(P.x,P.y,'빗나감','#c8c8c8');return}
  const th=j2BS('thorns');if(th>0){hurtE(src,d*th,J2THORN);burst(src.x,src.y,'#e8e4d8',6,80,2,14)}
  if(P.shield>0&&P.shieldS&&P.shieldS.retort){const el=J2R.el||'fire';applyFx(src,el==='fire'?{burn:1}:el==='ice'?{slow:1}:{stun:.3},P);if(el==='fire'&&!src.burn)src.burn={t:2,dps:Math.max(1,d*.1)}}
  const w=P.ward,lb=w&&w.n===(SPELLS.lastbastion&&SPELLS.lastbastion.n);const r=_hp(d,src,o);
  if(lb&&!P.ward&&!P.dead){for(const e of enemies)if(!e.dead&&dist(e,P)<(SPELLS.lastbastion.tauntRad||400)+e.r)applyFx(e,{taunt:SPELLS.lastbastion.taunt||8},P);rings.push({x:P.x,y:P.y,r:10,max:400,life:.7,col:'#e8e4d8'})}
  return r}}

/* ===== 매 프레임: 공명 · 출혈 · 공포 · 붕괴 · 지대(연막 · 미끼 · 소환진 · 정화) · 투사체 막기 · 마나 회복 패시브 ===== */
let j2T=0;
function j2Tick(dt){if(J2R.t>0){J2R.t-=dt;if(J2R.t<=0)J2R.n=0}
  if(P.j2link){P.j2link.t-=dt;if(P.j2link.t<=0)P.j2link=null}if(P.j2imm>0)P.j2imm-=dt;
  if((P.j2imm>0||j2BS('ccImmune')>0)&&typeof PTY==='object'&&PTY.pull)PTY.pull=null;
  for(const e of enemies){if(e.dead)continue;
    if(e.j2bl){const b=e.j2bl;b.t-=dt;b.iv-=dt;if(b.iv<=0){b.iv=.5;hurtE(e,b.dps*.5,J2BLEED);if(R()<.6)burst(e.x,e.y,'#c0182a',4,60,2,14)}if(b.t<=0)e.j2bl=null}
    if(e.colT>0)e.colT-=dt;if(e.blindT>0)e.blindT-=dt;
    if(e.fearT>0){e.fearT-=dt;const d=dist(e,P)||1;moveBody(e,(e.x-P.x)/d*120*dt,(e.y-P.y)/d*120*dt);e.atkCd=Math.max(e.atkCd,.25)}}
  for(const f of fields){const s=f.s;if(!s.job2&&!s.lure&&!s.blind)continue;
    if(s.blind)for(const e of enemies)if(!e.dead&&dist(e,f)<f.rad+hR(e))e.blindT=.6;
    if(s.lure&&!s.ghost)for(const e of enemies){const t=TYPES[e.k]||{};if(e.dead||t.boss||t.mini)continue;const d=dist(e,f);if(d>20&&d<f.rad+e.r+40){moveBody(e,(f.x-e.x)/d*170*dt,(f.y-e.y)/d*170*dt);e.aggroed=true}}
    if(s.spawn&&!s.ghost){f.sp=(f.sp==null?.2:f.sp)-dt;if(f.sp<=0){f.sp=s.spawn.iv;j2Wisp(f)}}
    if(s.cleanse&&!s.ghost&&dist(P,f)<f.rad&&(P.j2imm||0)<.2)P.j2imm=.4}
  if(j2BS('blockRanged')>0&&!P.dead){const arc=(P.buffs.shieldwall&&P.buffs.shieldwall.arc)||1.6;for(const p of projs)if(p.owner!=='p'&&p.life>0&&Math.hypot(p.x-P.x,p.y-P.y)<70&&angDiff(Math.atan2(p.y-P.y,p.x-P.x),P.face)<arc/2){p.life=0;burst(p.x,p.y,'#e8e4d8',8,90,2.5,p.z)}}
  j2T-=dt;if(j2T>0)return;j2T=.25;const k=.25;
  if(!P.dead&&P.job2){const pr=passSum('petRegen');if(pr>0){const n=Math.min(4,j2Mine().filter(a=>!a.wisp).length);if(n)P.mp=Math.min(maxMp(),P.mp+pr*n*k)}
    const br=passSum('blessRegen');if(br>0&&NET.on){let mineB=false;for(const id in P.buffs){const b=P.buffs[id];if(!b.by&&SPELLS[id]&&SPELLS[id].party)mineB=true}if(mineB){const n=Math.min(3,[...NET.peers.values()].filter(r=>!r.dead&&netSame(r)&&dist(r,P)<550).length);if(n)P.mp=Math.min(maxMp(),P.mp+br*n*k)}}
    const li=passSum('lowIas');if(li>0){const f=clamp((1-P.hp/maxHp())/.7,0,1);if(f>0)P.buffs._j2low={t:.6,max:.6,ias:li*f,n:''};else delete P.buffs._j2low}}}
{const _u=update;update=function(dt){_u(dt);if(!paused)j2Tick(dt)}}
// 덫이 터지면 지대가 되는 덫 (독 가시 덫)
{const _pt=PFX.trap;PFX.trap=function(tr,ev){const r=_pt.apply(this,arguments);if(ev==='boom'&&tr&&tr.s&&tr.s.field&&!tr.s.ghost){const F=tr.s.field;fields.push({x:tr.x,y:tr.y,rad:tr.s.rad,t:F.dur,max:F.dur,tick:.2,dmg:tr.dmg*.5,s:Object.assign({},tr.s,{kind:'field',field:0,slow:F.slow?1:0})})}return r}}
// 새 종류 이름 (스킬 창)
function j2KindN(){if(typeof KINDN==='object'&&!KINDN.detonate)Object.assign(KINDN,{detonate:'터뜨리기',link:'이어짐',cleanse:'정화'})}
