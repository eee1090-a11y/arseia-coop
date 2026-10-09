/* ---------- v20 J2 소속 고르기 (설계: rpg/v20-ideas/code/aff.js) ----------
   셋째 위계 시험(ctm3·ctp3·ctw3·cta3)을 마친 뒤, 16레벨부터 스승에게 「소속」 의뢰를 받는다. 대표 셋과 이야기하면 고르기 단추가 켜진다.
   고르면 P.aff='id' (바꾸기: 스승에게 금화, P.affN+1). 특성은 모두 덧셈이고 기존 상한을 그대로 지킨다.
   설계와 바꾼 점: 카즈둔 「수리·제작 25% 할인」 → 게임에 수리·제작이 없어 「상점 장비 값 15% 돌려받기」.
                  초원 「달리며 쏠 때 감속 없음」 → 채널링 기술을 쓰며 제 속도로 걷기(멈춰 서지 않아도 시작).
                  붉은 탑 「시전마다 생명력 1%」 → 마나를 쓰는 시전만 (기본 공격은 빼고). */
const AFF20={
  mage:[
    {id:'academy',n:'왕립 마법원',npc:'oswin',cloak:'#2e4a8a',fx:'마나 소모 8% 감소',pitch:'마법원은 오래 버티는 마법사를 기르지. 마나를 아껴 쓰는 법부터 배우게.'},
    {id:'ceres',n:'세레스의 탑',npc:'aff_idel',cloak:'#5a8aa8',fx:'재사용 대기 6% 감소',pitch:'세레스의 탑에서는 같은 주문을 더 자주 외우는 법을 가르칩니다. 바람처럼 빠르게.'},
    {id:'redtower',n:'붉은 탑 전투 영창',npc:'aff_kadel',cloak:'#8a2a24',fx:'시전 시간 10% 감소 · 마나를 쓰는 시전마다 최대 생명력 1% (생명력 10% 아래면 쓰지 않음)',pitch:'붉은 탑은 피로 주문을 앞당긴다. 빠르지만 아프지. 그래도 하겠나?'}],
  priest:[
    {id:'aurel',n:'아우렐 · 여명교단',npc:'priestess',cloak:'#e8d27a',fx:'내가 건 치유량 6% 증가',pitch:'여명의 빛은 상처를 더 깊이 어루만집니다. 아우렐의 등불을 드세요.'},
    {id:'mordin',n:'모르딘 · 안식회',npc:'aff_odo',cloak:'#3a3446',fx:'언데드에게 주는 피해 12% 증가 · 부활 마나 절반',pitch:'죽은 자를 쉬게 하는 것도 사제의 일이지. 안식회는 무덤을 지킨다네.'},
    {id:'nella',n:'넬라 · 파도 사제',npc:'aff_sira',cloak:'#3a7a8a',fx:'이동 속도 5% · 내가 건 축복 지속 10% 증가',pitch:'파도는 멈추지 않아요. 넬라의 사제는 늘 움직이며 축복을 나르지요.'}],
  warrior:[
    {id:'knights',n:'에르난 기사단',npc:'j2_warrior',cloak:'#2e4a6a',fx:'막기 확률 5% 증가 (방패를 들었을 때 · 최대 50%)',pitch:'기사단은 방패로 동료를 지킨다. 막는 법을 몸에 새겨라.'},
    {id:'steel',n:'발카르 · 강철 사제단',npc:'aff_rok',cloak:'#5a5a62',fx:'생명력 50% 아래에서 주는 피해 8% 증가',pitch:'쓰러지기 직전이 가장 강할 때다. 강철 사제단은 그 순간을 가르친다.'},
    {id:'kazdun',n:'카즈둔 룬 대장간',npc:'aff_durin',cloak:'#7a5a2a',fx:'물리 피해 5% 증가 · 상점에서 장비를 사면 값의 15%를 돌려받음',pitch:'좋은 무기는 좋은 대장장이를 안다네. 카즈둔이 흥정도 대신 해 주지.'}],
  archer:[
    {id:'patrol',n:'윌로벤 순찰대',npc:'j2_archer',cloak:'#4a6a3a',fx:'명중 5% 증가 (최대 97%)',pitch:'순찰대는 빗나가지 않아. 한 발 한 발 세어서 쏘는 법을 알려 줄게.'},
    {id:'steppe',n:'바람의 초원 켄타우로스',npc:'aff_hargan',cloak:'#a8843a',fx:'채널링 기술을 쓰며 제 속도로 걸을 수 있음',pitch:'초원의 활은 달리면서 쏜다. 멈춰 서는 건 사냥감이 할 일이지.'},
    {id:'silvaren',n:'실바렌 노래꾼',npc:'aff_riel',cloak:'#7aa8a0',fx:'마나 회복 10% 증가',pitch:'숲의 노래를 들으면 숨이 고르게 돼요. 실바렌은 지치지 않는 궁수를 길러요.'}]};
const AFF20_BY={};for(const c in AFF20)for(const a of AFF20[c]){a.cls=c;AFF20_BY[a.id]=a}
// 설계 이름 그대로도 쓸 수 있게
const AFF=AFF20;
const AFF_CHANGE_GOLD=lv=>2000+lv*150;
// 대표(새 마을 사람 8명). 자리는 v20AddFolk가 겹치지 않게 고른다.
const AFF20_FOLK={
  aff_idel:{town:'arden',at:[-100,-140],n:'세레스 사절 이델',role:'세레스의 탑 사절',L:{body:'#5a8aa8',cape:'#2e4a6a',hair:'#e0d4b8',hs:2,hat:5,hatC:'#3a5a7a',prop:'staff',gem:'#bfe8ff',dress:1},lines:['서쪽 곶의 바람이 그립군요.','세레스의 탑은 언제나 문이 열려 있습니다.']},
  aff_kadel:{town:'haven',at:[-110,-120],n:'붉은 탑의 카델',role:'붉은 탑을 떠난 마법사',L:{body:'#5a2420',cape:'#8a2a24',hair:'#2a1a1a',hs:3,hat:0,prop:'staff',gem:'#ff8a5a'},lines:['발케르의 붉은 탑… 이제는 돌아갈 수 없지.','빠른 주문엔 값이 따르는 법이야.']},
  aff_rok:{town:'haven',at:[-40,-210],n:'강철 사제 로크',role:'떠돌이 강철 사제',L:{armor:1,body:'#6a6a72',legs:'#3a3a42',tabard:'#5a5a62',hair:'#4a3a2a',hs:4,hat:4,prop:'sword'},lines:['강철은 두들겨 맞을수록 단단해진다.','발카르는 쓰러지지 않는 자를 굽어본다.']},
  aff_hargan:{town:'haven',at:[240,250],n:'켄타우로스 사절 하르간',role:'바람의 초원 사절',L:{body:'#8a6a3a',legs:'#5a4020',cape:'#a8843a',hair:'#3a2a1a',hs:4,hat:3,hatC:'#a8843a',prop:'spear'},lines:['초원은 넓고 바람은 빠르다.','대상 마당은 시끄럽군. 초원이 그립다.']},
  aff_odo:{town:'willowen',at:[-250,40],n:'장의사 오도',role:'모르딘 안식회',L:{body:'#3a3446',cape:'#2a2432',hair:'#8a8a8a',hs:3,hat:7,hatC:'#3a3446',prop:'book'},lines:['죽은 자는 조용하지. 산 자가 시끄러울 뿐.','안식회는 무덤과 나루를 함께 지킨다네.']},
  aff_sira:{town:'willowen',at:[160,230],n:'파도 사제 시라',role:'넬라의 사제',L:{body:'#3a7a8a',legs:'#2a5a6a',cape:'#2a5a6a',hair:'#e8d0a0',hs:1,hat:3,hatC:'#3a7a8a',dress:1,prop:'staff',gem:'#9fe8ff'},lines:['물때가 바뀌면 운명도 바뀌어요.','넬라의 축복이 그대의 걸음에 함께하기를.']},
  aff_riel:{town:'willowen',at:[-110,-60],n:'엘프 노래꾼 리엘',role:'실바렌 노래꾼',L:{body:'#7aa8a0',legs:'#3a5a50',cape:'#4a7a6a',hair:'#f0e8c8',hs:2,hat:3,hatC:'#5a8a70',prop:'spear'},lines:['라— 라라— 숲은 노래로 숨을 쉬어요.','활시위도 악기랍니다.']},
  aff_durin:{town:'brenhill',at:[300,130],n:'드워프 대장장이 두린',role:'카즈둔 룬 대장간',L:{armor:1,body:'#7a5a2a',legs:'#4a3a2a',tabard:'#7a5a2a',hair:'#c86a2a',hs:4,hat:4,prop:'sword',child:0},lines:['룬은 망치로 새기는 게야.','브렌힐 쇠는 나쁘지 않군. 카즈둔만은 못해도.']}};
for(const id in AFF20_FOLK){const F=AFF20_FOLK[id];TWFOLK[id]={n:F.n,role:F.role,L:F.L,lines:F.lines.slice()}}
{for(const id in AFF20_FOLK){const F=AFF20_FOLK[id];v20AddFolk(id,F.town,F.at[0],F.at[1])}v20SyncDecor()}
const AFF20_REP={};for(const c in AFF20)for(const a of AFF20[c])AFF20_REP[a.npc]=(AFF20_REP[a.npc]||[]).concat(a);
// 대표가 실제로 서 있는 곳 (일지·창에 씀)
function affWhere(a){const f=sqFolk(a.npc);if(!f)return '';return f.room&&TWROOM[f.room]?`${f.town.n} ${TWROOM[f.room].n} 안`:f.town?f.town.n:''}

/* ===== 소속 의뢰 4개 (셋째 위계 시험 뒤, 16레벨) ===== */
const AFF20_Q=[
 {id:'affm',cls:'mage',town:'arden',giver:'elian',req:'ctm3',lvl:16,kind:'소속',t:'어느 탑에 설 것인가',say:'마법사는 저마다 설 자리가 있네. 이 마법원, 서쪽 곶의 세레스, 그리고… 발케르의 붉은 탑을 떠나온 자도 있지. 세 사람을 만나 보고 고르게. 나중에 바꿀 수도 있으니 너무 겁내지 말고.',done:'좋은 선택이네. 그 망토가 잘 어울리는군.',
  goals:[{type:'pick',grp:'aff',d:'소속 대표 셋과 이야기하고 하나 고르기'}],rw:{xp:1,gold:300}},
 {id:'affp',cls:'priest',town:'arden',giver:'j2_priest',req:'ctp3',lvl:16,kind:'소속',t:'어느 신의 등불을 들 것인가',say:'사제는 한 신만을 섬긴다. 여명의 아우렐, 안식의 모르딘, 바다와 운명의 넬라. 세 분을 섬기는 이들을 만나 보고 마음이 가는 곳을 고르거라.',done:'네 성표에 그 신의 빛이 깃들었구나.',
  goals:[{type:'pick',grp:'aff',d:'세 교단의 사제와 이야기하고 하나 고르기'}],rw:{xp:1,gold:300}},
 {id:'affw',cls:'warrior',town:'haven',giver:'j2_warrior',req:'ctw3',lvl:16,kind:'소속',t:'누구의 깃발 아래',say:'싸우는 자는 깃발이 있어야 한다. 에르난 기사단, 발카르의 강철 사제단, 카즈둔 드워프 대장간. 셋 다 만나 보고 골라라.',done:'좋아, 그 색을 부끄럽게 하지 마라.',
  goals:[{type:'pick',grp:'aff',d:'세 깃발의 대표와 이야기하고 하나 고르기'}],rw:{xp:1,gold:300}},
 {id:'affa',cls:'archer',town:'willowen',giver:'j2_archer',req:'cta3',lvl:16,kind:'소속',t:'누구와 함께 쏠 것인가',say:'활 쏘는 법은 하나가 아니야. 우리 순찰대, 초원의 켄타우로스, 숲의 엘프 노래꾼. 셋 다 만나 보고 골라.',done:'그 색 망토는 멀리서도 알아보겠어.',
  goals:[{type:'pick',grp:'aff',d:'세 무리의 대표와 이야기하고 하나 고르기'}],rw:{xp:1,gold:300}}];
for(const q of AFF20_Q){q.affq=1;SQ.push(q);SQBY[q.id]=q}
const AFF_QUESTS=AFF20_Q;
const affQ=()=>AFF20_Q.find(q=>q.cls===P.cls)||null;
const affMine=()=>(P&&AFF20[P.cls])||[];
const affCur=()=>P&&P.aff&&AFF20_BY[P.aff]&&AFF20_BY[P.aff].cls===P.cls?AFF20_BY[P.aff]:null;
const affMet=(q,id)=>{const a=sqState().a[q.id];return !!(a&&a.c&&a.c['t_'+id])};
{const _a=sqAvail;sqAvail=function(q){if(!q||!q.affq)return _a(q);if(q.cls!==P.cls)return 'hidden';const s=sqState();
  if(!s.a[q.id]&&!s.d[q.id]&&affCur())return 'hidden';const v=_a(q);if(v==='ok'&&P.lvl<q.lvl)return 'low';return v}}
{const _g=sqGoalText;sqGoalText=function(q,j){const g=q.goals[j];if(!g||g.type!=='pick'||g.grp!=='aff')return _g(q,j);if(sqGoalDone(q,j))return g.d;
  const n=affMine().filter(a=>affMet(q,a.id)).length;return `${g.d} · 만난 대표 ${n}/3`}}
{const _t=sqTarget;sqTarget=function(q){if(!q||!q.affq)return _t(q);const a=sqState().a[q.id];if(!a||sqAllDone(q))return _t(q);
  for(const f of affMine())if(!affMet(q,f.id)){const t=j2NpcAt(f.npc);if(t)return Object.assign({},t,{label:`${t.label} (${f.n})`})}
  const t=j2NpcAt(q.giver);return t?Object.assign({},t,{label:`${t.label} · 소속 고르기`}):null}}
// 대표와 이야기하기: 의뢰 중이면 「만남」을 남긴다
V20.onTalk.push(f=>{const q=affQ();if(!q||!sqState().a[q.id])return;for(const a of AFF20_REP[f.id]||[]){if(a.cls!==P.cls||affMet(q,a.id))continue;
  sqState().a[q.id].c['t_'+a.id]=1;msg(`${a.n}의 이야기를 들었습니다 (${affMine().filter(x=>affMet(q,x.id)).length}/3)`,'#9fe0ff');f.say=a.pitch;f.sayT=time+5;questHud();save()}});
function affCard(a,q,o){const cur=affCur(),met=q&&affMet(q,a.id),mine=cur&&cur.id===a.id;
  let btn='';if(o.pick)btn=v20Btn('affpick',a.id,'이 소속 고르기',{cls:'primary',dis:!met,title:met?'':'먼저 대표와 이야기하세요'});
  else if(o.chg&&!mine){const pr=AFF_CHANGE_GOLD(P.lvl);btn=v20Btn('affchg',a.id,`바꾸기 · 금화 ${pr.toLocaleString()}`,{dis:P.gold<pr})}
  return `<div class="v20row"><div><span class="v20chip" style="background:${a.cloak}"></span><b>${a.n}</b>${mine?' <i class="v20tag" style="background:#c9a24a;color:#000">내 소속</i>':''}${o.pick?(met?' <span class="ok">✓ 만남</span>':' <span class="muted">· 아직 안 만남</span>'):''}
    <div class="muted" style="font-size:12px">${a.fx}</div>${o.where?`<div class="muted" style="font-size:12px">대표: ${TWFOLK[a.npc]?TWFOLK[a.npc].n:''} · ${affWhere(a)}</div>`:''}</div><div class="btns">${btn}</div></div>`}
// 스승 창: 고르기 · 바꾸기 / 대표 창: 이 소속 설명 (+ 의뢰 중이면 고르기)
V20.npcBox.push(f=>{if(!P)return '';const q=affQ();if(!q)return '';const s=sqState(),act=!!s.a[q.id],cur=affCur();
  if(f.id===q.giver){if(act)return `<div class="v20box"><h3>소속 고르기</h3><p class="muted" style="margin:0">셋 다 만나 보면 단추가 켜집니다. 나중에 스승에게 금화를 내고 바꿀 수 있습니다.</p>${affMine().map(a=>affCard(a,q,{pick:1,where:1})).join('')}</div>`;
    if(cur)return `<div class="v20box"><h3>소속 · ${cur.n}</h3><p class="muted" style="margin:0">바꾸면 바로 새 특성이 적용됩니다. 값: 금화 ${AFF_CHANGE_GOLD(P.lvl).toLocaleString()} (레벨에 따라)${P.affN?` · 지금까지 ${P.affN}번 바꿈`:''}</p>${affMine().map(a=>affCard(a,q,{chg:1})).join('')}</div>`;return ''}
  const mine=(AFF20_REP[f.id]||[]).filter(a=>a.cls===P.cls);if(!mine.length)return '';
  return `<div class="v20box"><h3>소속 안내</h3>${mine.map(a=>`<p class="qsay" style="margin:2px 0">「${a.pitch}」</p>`+affCard(a,q,{pick:act})).join('')}${!act&&!cur?`<p class="muted" style="margin:4px 0 0">셋째 위계 시험을 마친 뒤 16레벨부터 ${TWFOLK[q.giver].n}에게 소속 의뢰를 받을 수 있습니다.</p>`:''}</div>`});
function affSet(id,how){const a=AFF20_BY[id];if(!a||a.cls!==P.cls)return false;P.aff=id;P._affRaw=null;v20GsBump();
  rings.push({x:P.x,y:P.y,r:10,max:160,life:.9,col:a.cloak});rings.push({x:P.x,y:P.y,r:6,max:90,life:.6,col:'#ffe9a8'});burst(P.x,P.y,a.cloak,36,150,3,30);
  banner={t:`소속 · ${a.n}`,sub:a.fx,col:'#ffd76a',life:3,max:3};msg(`${how}: ${a.n} — ${a.fx}`,'#ffd76a');return true}
V20A.affpick=id=>{const q=affQ(),s=sqState();if(!q||!s.a[q.id]||!affMet(q,id)||!affSet(id,'소속을 골랐습니다'))return;
  sqProgress(q,0,1,true);const b=banner;sqFinish(q.id);banner=b;if(banner)banner.sub+=` · 의뢰 「${q.t}」 완료`;const g=sqFolk(q.giver);if(g){g.say=q.done;g.sayT=time+5}msg(`${g?g.n:''}: 「${q.done}」`,'#e8dcc0');save()};
V20A.affchg=id=>{const q=affQ(),cur=affCur(),pr=AFF_CHANGE_GOLD(P.lvl);if(!q||!cur||cur.id===id||P.gold<pr)return;if(!AFF20_BY[id]||AFF20_BY[id].cls!==P.cls)return;
  P.gold-=pr;affSet(id,`소속을 바꿨습니다 (금화 ${pr.toLocaleString()})`);P.affN=(P.affN|0)+1;save()};

/* ===== 특성 ===== */
V20.gsAdd.push((x,o)=>{const a=affCur();if(!a)return;switch(a.id){
  case'academy':x.mcost=(x.mcost||0)+8;break;case'ceres':x.cdr=(x.cdr||0)+6;break;case'nella':x.ms=(x.ms||0)+5;break;
  case'knights':x.blk=(x.blk||0)+5;break;case'kazdun':x.pdmg=(x.pdmg||0)+5;break;case'silvaren':x.regen=(x.regen||0)+v20RegenPct(o,.10);break}});
V20.dmgAdd.push(e=>{const a=affCur();if(!a)return 0;if(a.id==='mordin'){const t=TYPES[e.k];return t&&t.undead?.12:0}if(a.id==='steel')return P.hp<maxHp()*.5?.08:0;return 0});
V20.healK.push(()=>{const a=affCur();return a&&a.id==='aurel'?.06:0});
{const _h=hitChance;hitChance=function(e){const h=_h(e);const a=affCur();return a&&a.id==='patrol'?Math.min(.97,h+.05):h}}
{const _b=putBuffV19;putBuffV19=function(id,nb,by,s){const a=affCur();if(a&&a.id==='nella'&&V20.healMine&&nb&&nb.t>0){nb.t*=1.1;nb.max=(nb.max||nb.t/1.1)*1.1}return _b.apply(this,arguments)}}
// 시전: 붉은 탑(시전 시간 · 생명력) · 모르딘(부활 마나) · 초원(채널링 걷기)
function affCastPaid(id,mp0){const a=affCur(),s=SPELLS[id];if(!a||!s)return;const spent=mp0-P.mp;if(spent<=1e-6)return;
  if(a.id==='redtower'){const mh=maxHp();if(P.hp>mh*.1)P.hp=Math.max(1,P.hp-mh*.01)}
  if(a.id==='mordin'&&s.kind==='rez')P.mp=Math.min(maxMp(),P.mp+spent*.5)}
{const _tc=tryCast;tryCast=function(id,target){const a=affCur();if(GHOST||CAST_MOD||!a)return _tc.apply(this,arguments);
  const mp0=P.mp,cu0=CAST.cur,s=SPELLS[id];let r,ch=null;
  if(a.id==='steppe'&&s&&typeof CHAN==='object'&&CHAN[id]&&!(CAST.ch&&CAST.ch.id===id)){ch=CHAN[id];CHAN[id]=Object.assign({},ch,{move:1,walk:1})}
  try{r=_tc.apply(this,arguments)}finally{if(ch)CHAN[id]=ch}
  if(a.id==='redtower'&&CAST.cur&&CAST.cur!==cu0&&CAST.cur.id===id){CAST.cur.max=Math.max(.1,Math.round(CAST.cur.max*.9*100)/100);castBarSet(CAST.cur)}
  affCastPaid(id,mp0);return r}}
{const _cr=_castRelease;_castRelease=function(cu){const mp0=P.mp;const r=_cr.apply(this,arguments);if(cu&&!GHOST)affCastPaid(cu.id,mp0);return r}}
// 카즈둔: 상점에서 장비를 사면 15% 돌려받기 (산 뒤에 확인)
setTimeout(()=>pbody.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b||b.disabled||!b.dataset.buy)return;const a=affCur();if(!a||a.id!=='kazdun')return;
  const g0=P.gold,n0=P.bag.length;setTimeout(()=>{const sp=g0-P.gold;if(sp>0&&P.bag.length>n0){const back=Math.round(sp*.15);P.gold+=back;msg(`카즈둔 대장간의 흥정: 금화 ${back} 돌려받음`,'#e8c35a');if(!panel.hidden&&tab==='shop')renderPanel();save()}},0)},true),0);
// 캐릭터 창 한 줄
{const _c=charHtml;charHtml=function(){const h=_c();if(!P)return h;const a=affCur(),q=affQ();
  const line=a?`<div class="v20box"><span class="v20chip" style="background:${a.cloak}"></span><b>소속 · ${a.n}</b> <span class="muted" style="font-size:12px">${a.fx}</span></div>`:
    (q&&P.lvl>=12?`<p class="muted">소속: 없음 · 셋째 위계 시험 뒤 16레벨부터 ${TWFOLK[q.giver].n}에게 「${q.t}」 의뢰</p>`:'');
  const i=h.indexOf('<h2>능력</h2>');return line&&i>=0?h.slice(0,i)+line+h.slice(i):h}}
window.__v20=window.__v20||{};Object.assign(window.__v20,{AFF20,AFF20_BY,AFF20_Q,AFF20_FOLK,affCur,affSet,affMet,affQ,AFF_CHANGE_GOLD});
