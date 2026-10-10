
/* ---------- HUD ---------- */
const barEl=$('#bar');
let bindId=null;
const slotLabel=s=>{const w=s.n.split(' ');return w.length===1?w[0]:w.slice(0,2).join('<br>')};
function slotBtn(i){const id=P.bar[i],s=id&&SPELLS[id],L=s?skLv(id):0;
  return `<button class="sk${s?'':' empty'}${s&&!L?' unlearned':''}${bindId?' binding':''}" type="button" data-slot="${i}" title="${s?`${s.n} (${s.kn}) · 스킬 레벨 ${L} · 마나 ${costOf(id)}${castInfo(id,L)?' · '+castInfo(id,L):''}\n${s.desc}\n오른쪽 클릭: 칸 비우기`:'빈 칸: 스킬 트리(T)에서 마법을 넣으세요'}">${s?spellSvg(s):''}<span class="ab">${s?slotLabel(s):''}</span><span class="k">${SLOTS[i].k}</span>${L?`<span class="lvb" title="스킬 레벨">Lv${L}</span>`:''}<span class="cd"></span></button>`}
function buildBar(){
  let h='<div class="barrow">';for(let i=0;i<13;i++)h+=slotBtn(i);h+='</div><div class="barrow">';for(let i=13;i<21;i++)h+=slotBtn(i);
  h+='<div class="sep"></div>';
  h+=`<button class="sk" type="button" data-pot="hp" title="${potTip('hp')}" data-pc="${potCounts('hp')}">${miscIcon('hp'+Math.max(0,potBest('hp')),24)}<span class="ab">생명</span><span class="k">Q</span><span class="cnt"></span><span class="cd"></span></button>`;
  h+=`<button class="sk" type="button" data-pot="mp" title="${potTip('mp')}" data-pc="${potCounts('mp')}">${miscIcon('mp'+Math.max(0,potBest('mp')),24)}<span class="ab">마나</span><span class="k">E</span><span class="cnt"></span><span class="cd"></span></button>`;
  h+=`<button class="sk" type="button" data-pot="tp" title="귀환 두루마리: ${TP_CAST}초 동안 펼치면 가장 가까운 마을 짝문으로 돌아갑니다 (움직이면 끊김). 잡화점에서 팝니다">${miscIcon('tp',24)}<span class="ab">귀환</span><span class="k">R</span><span class="cnt"></span><span class="cd"></span></button></div>`;
  barEl.innerHTML=h;
}
function bindTo(i){const id=bindId;bindId=null;const prev=P.bar.indexOf(id);if(prev>=0)P.bar[prev]=P.bar[i];P.bar[i]=id;msg(`${SPELLS[id].n} → [${SLOTS[i].k}]`,EL[SPELLS[id].el]);buildBar();if(!panel.hidden)renderPanel();save()}
function barPress(b){if(b.dataset.slot!=null){const i=+b.dataset.slot;if(bindId){bindTo(i);return}castSlot(i)}else if(b.dataset.pot)usePotion(b.dataset.pot)}
barEl.addEventListener('pointerdown',e=>{barPT=e.pointerType;const b=e.target.closest('button');if(!b)return;e.preventDefault();if(e.button===2)return;barPress(b)});
barEl.addEventListener('click',e=>{if(e.detail===0){const b=e.target.closest('button');if(b)barPress(b)}});
// v20: 오른쪽 클릭(마우스)만 칸을 비운다. 휴대폰에서 꾹 누르면 브라우저가 contextmenu를 보내 칸이 비던 버그
let barPT='mouse';barEl.addEventListener('contextmenu',e=>{e.preventDefault();if(barPT!=='mouse')return;const b=e.target.closest('button');if(b&&b.dataset.slot!=null){P.bar[+b.dataset.slot]=null;buildBar();save()}});
const el={lv:$('#lv'),title:$('#title'),rank:$('#rank'),xpfill:$('#xpfill'),xptext:$('#xptext'),zone:$('#zone'),gold:$('#gold'),hpfill:$('#hpfill'),mpfill:$('#mpfill'),hptext:$('#hptext'),mptext:$('#mptext'),sh:$('#shring'),buffs:$('#buffs'),
  target:$('#target'),tname:$('#tname'),tfill:$('#tfill'),tsub:$('#tsub'),treeBtn:$('#treeBtn'),charBtn:$('#charBtn')};
let lastZone='',lastBuffs='',lastPts='';const actBtn=$('#act');actBtn.onclick=()=>doAct();
function pickHover(){hover=null;if(touchMode||!mouse.active||paused)return;let bd=1e9;
  for(const e of enemies){const s=W2S(e.x,e.y),sc=e.sc||(e.elite?1.25:1),d=Math.hypot(mouse.x-s.x,mouse.y-(s.y-TYPES[e.k].r*sc));if(d<TYPES[e.k].r*sc*1.3+10&&d<bd){bd=d;hover=e}}}
function updateHud(){
  const C=CLASSES[P.cls],r=rankOf(P.lvl);
  el.lv.textContent=P.lvl;el.title.textContent=C.grade[r-1];el.rank.textContent=C.rankN(r);
  const need=xpNeed(P.lvl);el.xpfill.style.width=(P.lvl>=MAXLV?100:P.xp/need*100).toFixed(1)+'%';el.xptext.textContent=P.lvl>=MAXLV?'최고 레벨':`경험치 ${P.xp.toLocaleString()} / ${need.toLocaleString()}`;
  const zl=DG?DG.lvl:zoneLevel(P.x,P.y),zn=DG?DG.d.n:zoneName(P.x,P.y),D=DIFF[P.diff];
  const zh=DG?`${zn}<small>던전 · 몬스터 레벨 ${zl}~${zl+2}${DG.bossDead?' · 보스 처치':''}</small>`:zl===0?`${zn}<small>안전 지대 · 분수 곁에서 회복${P.diff?` · <span style="color:${D.col}">${D.n}</span>`:''}</small>`:`${zn}<small>몬스터 레벨 ${Math.max(1,zl+D.add-1)}~${zl+D.add}${P.diff?` · <span style="color:${D.col}">${D.n}</span>`:''}</small>`;
  if(zh!==lastZone){if(lastZone&&!paused)msg(`${zn}에 들어섰습니다`,'#d6b262');lastZone=zh;el.zone.innerHTML=zh}
  el.gold.textContent=P.gold.toLocaleString();
  const mh=maxHp(),mp=maxMp();
  el.hpfill.style.height=(P.hp/mh*100).toFixed(1)+'%';el.mpfill.style.height=(P.mp/mp*100).toFixed(1)+'%';
  el.hptext.textContent=`${Math.ceil(P.hp)}/${mh}`;el.mptext.textContent=`${Math.floor(P.mp)}/${mp}`;
  el.sh.style.opacity=P.shield>0||P.invT>0?1:0;
  const pts=P.sp+'/'+P.ap;if(pts!==lastPts){lastPts=pts;el.treeBtn.textContent=P.sp?`스킬 트리 +${P.sp} (T)`:'스킬 트리 (T)';el.treeBtn.classList.toggle('lvup',P.sp>0);el.charBtn.textContent=P.ap?`캐릭터 +${P.ap} (C)`:'캐릭터 (C)';el.charBtn.classList.toggle('lvup',P.ap>0)}
  const at=act&&!P.dead?(twActLabel(act)||(act==='shop'?`${shopName(actTown,actShop)} 열기 (F)`:act==='stash'?'창고 열기 (F)':act==='quest'?`${QNPC[actTown.id].n}와 이야기 (F)`:act==='dungeon'?`${actCave.cave.n} 들어가기 (F)`:act==='exit'?'던전에서 나가기 (F)':act==='edge'?`${actEdge.label} (F)`:'짝문 열기 (F)')):'';if(actBtn.textContent!==at){actBtn.textContent=at;actBtn.hidden=!at}
  const bl=[];for(const id in P.buffs)bl.push(`${P.buffs[id].n} ${Math.ceil(P.buffs[id].t)}`);
  if(P.ward)bl.push(`${P.ward.n} ${Math.ceil(P.ward.t)}`);if(P.shield>0)bl.push(`보호막 ${P.shield}`);if(P.hot)bl.push(`치유 ${Math.ceil(P.hot.t)}`);if(P.potHot)for(const k in P.potHot)bl.push(`${k==='hp'?'생명력':'마나'} 물약 ${Math.ceil(P.potHot[k].t)}`);if(potCdLeft('hp')>0)bl.push(`생명력 물약 대기 ${Math.ceil(potCdLeft('hp'))}`);if(potCdLeft('mp')>0)bl.push(`마나 물약 대기 ${Math.ceil(potCdLeft('mp'))}`);if(P.storm)bl.push(`${P.storm.s.n} ${Math.ceil(P.storm.t)}`);if(P.invT>0)bl.push('무적');
  const bs=bl.map(b=>`<span>${b}</span>`).join('');if(bs!==lastBuffs){lastBuffs=bs;el.buffs.innerHTML=bs}
  pickHover();
  let hv=hover;if(!hv){let bd=760;for(const e of enemies)if(e.big&&e.aggroed&&!e.dead){const d=dist(e,P);if(d<bd){bd=d;hv=e}}}
  if(hv){const t=TYPES[hv.k];el.target.hidden=false;el.tname.textContent=`${hv.elite?'정예 ':''}${t.boss?'보스 · ':t.mini?'준보스 · ':''}${t.n}`;el.tname.style.color=t.boss?'#ff8a3a':t.mini?'#ffb07a':hv.elite?'#9bb8ff':'#efe2c0';el.tfill.style.width=clamp(hv.hp/hv.max*100,0,100)+'%';
    el.tsub.textContent=`레벨 ${hv.lvl}${t.undead?' · 언데드 (신성·빛 두 배)':''}${t.ranged?' · 원거리':''}${hv.rage?' · 분노':''}`}else el.target.hidden=true;
  let potReb=0;
  for(const row of barEl.children)for(const b of row.children){
    if(b.dataset.slot!=null){const id=P.bar[+b.dataset.slot];if(!id)continue;const p=(P.cd[id]||0)/cdOf(id);b.querySelector('.cd').style.setProperty('--p',p.toFixed(3));b.classList.toggle('nomana',P.mp<costOf(id))}
    else if(b.dataset.pot){const tp=b.dataset.pot==='tp';b.querySelector('.cd').style.setProperty('--p',(tp?(TPC?1-TPC.t/TP_CAST:0):potCdLeft(b.dataset.pot)/POT_CD[b.dataset.pot]).toFixed(3));const cn=tp?tpCount():potTotal(b.dataset.pot);b.querySelector('.cnt').textContent=cn;if(!tp&&b.dataset.pc!==potCounts(b.dataset.pot))potReb=1}
  }
  if(potReb)buildBar();
}

/* ---------- panel: 스킬 트리 / 캐릭터 / 상점 / 짝문 ---------- */
const panel=$('#panel'),pbody=$('#pbody');let tab='tree',treeSel=0,nodeSel=null;
function openPanel(t){tab=t;panel.hidden=false;paused=true;renderPanel()}
function closePanel(){panel.hidden=true;bindId=null;codexBack();paused=!$('#intro').hidden||!$('#death').hidden;buildBar()}
const KINDN={rez:'부활',bolt:'투사체',nova:'주변 범위',chain:'연쇄',field:'지속 지대',rain:'광역 낙하',strike:'지정 낙하',beam:'관통 직선',cone:'부채꼴',blink:'이동',heal:'치유',hot:'지속 치유',shield:'보호막',buff:'강화',ward:'가호',invuln:'무적',storm:'주변 낙뢰',orbit:'궤도',summon:'소환',armor:'갑옷',passive:'패시브',melee:'근접',leap:'도약',charge:'돌진',trap:'덫',intervene:'대신 맞기'};
const potPrice=t=>8+t.base*4+Math.floor(P.lvl*1.5),buyPrice=it=>itemPrice(it)*4,respecPrice=()=>100+P.lvl*30;
function shopStock(t,type){type=SHOP_SLOTS[type]?type:SHOP_SLOTS[actShop]?actShop:'general';const key=t.id+':'+type,sl=SHOP_SLOTS[type];let st=shops[key];
  if(!st||st.lvl!==P.lvl||st.diff!==P.diff||time-st.time>180){st=shops[key]={lvl:P.lvl,diff:P.diff,time,type,items:[]};
    for(let i=0;i<(type==='general'?6:8);i++){const il=Math.max(t.base+DIFF[P.diff].add,P.lvl-1)+ri(0,2),el=R()<.3;for(let k=0;k<80;k++){const it=makeItem(il,el);if(sl.includes(it.slot)){st.items.push(it);break}}}}
  return st}
function itemRow(it,btns){const cur=gearCur(it),diff=Math.round(itemScore(it)-itemScore(cur));
  return `<div class="item hasic" data-iid="${it.id}">${itemIcon(it)}<div><div class="nm" style="color:${RAR[it.rar].c}">${itemName(it)} <span class="muted">${RAR[it.rar].n} ${SLOT[it.slot].n} · Lv${it.il}</span></div><div class="st">${statLine(it)}</div><div class="cmp" style="color:${diff>0?'#8cf08a':diff<0?'#ff8a7a':'#a39d8f'}">${diff>0?'▲ 지금보다 좋음':diff<0?'▼ 지금보다 약함':'비슷함'}${diff?` (${diff>0?'+':''}${diff})`:''} <span class="muted">· 착용 중: ${cur?itemName(cur):'없음'}</span></div></div><div class="btns">${btns}</div></div>`}
// 스킬 수치 미리보기
function numsAt(id,L){const s=eff(id,L),out=[];
  if(isDmg(s)){const d=power()*s.mult*dmgMul()*dmgScale(id,L)*(s.kind==='rain'&&typeof rainDK==='function'?rainDK(s):1);out.push(['피해',`${Math.round(d*.9)}~${Math.round(d*1.1)}`+(s.cnt>1?` ×${s.cnt}발`:'')+(s.kind==='field'?' /0.5초':s.kind==='rain'||s.kind==='storm'?' /낙하':'')])}
  const sup=supScale(L);
  if(s.kind==='heal')out.push(['회복',Math.round((maxHp()*s.pct+power()*s.mult)*sup)]);
  if(s.kind==='hot')out.push(['총 회복',Math.round((maxHp()*s.pct+power()*s.mult)*sup)]);
  if(s.kind==='shield')out.push(['흡수',Math.round((power()*s.mult+s.flat)*sup)]);
  if(s.kind==='buff'){if(s.dmg)out.push(['피해 증가',Math.round(s.dmg*100)+'%']);if(s.spd)out.push(['이동 속도',Math.round(s.spd*100)+'%']);if(s.dr)out.push(['받는 피해 감소',Math.round(s.dr*100)+'%']);if(s.crit)out.push(['치명타',`+${Math.round(s.crit*100)}%`]);if(s.cdr)out.push(['재사용 대기 감소',Math.round(s.cdr*100)+'%']);if(s.hp)out.push(['최대 생명력',`+${Math.round(s.hp*100)}%`]);if(s.regen)out.push(['마나 회복',`+${Math.round(s.regen*10)/10}/초`]);if(s.life)out.push(['생명력 회복',`${Math.round(s.life*1000)/10}%/초`])}
  if(s.kind==='passive'){if(s.regen)out.push(['초당 마나 회복',`+${Math.round(s.regen*10)/10}`]);if(s.dmg)out.push(['피해 증가',Math.round(s.dmg*100)+'%']);if(s.spd)out.push(['이동 속도',Math.round(s.spd*100)+'%']);out.push(['상태','늘 켜짐']);return out}
  if(s.drf)out.push(['안에서 받는 피해',`-${Math.round(s.drf*100)}%`]);if(s.atone)out.push(['맞히면 생명력',`+${Math.round(s.atone*1000)/10}%`]);if(s.kind==='rez')out.push(['되살릴 때 생명력',Math.round(s.pct*100)+'%']);if(s.party)out.push(['파티 범위',s.party]);
  if(s.kind==='ward')out.push(['되살아날 때 생명력',Math.round(s.heal*100)+'%']);
  if(s.low)out.push(['빈사일 때 회복',`×${1+s.low}`]);if(s.hot&&s.kind==='heal')out.push(['이어지는 치유',`최대 생명력 ${Math.round(s.hot*100)}% / 6초`]);if(s.mana)out.push([s.kind==='field'?'마나 /0.5초':'총 마나',`최대 마나 ${Math.round(s.mana*(s.kind==='field'?50:100))}%`]);if(s.hits)out.push(['깨지기까지',s.hits+'번 맞음']);if(s.reflect)out.push(['막은 피해 되돌림',Math.round(s.reflect*100)+'%']);if(s.healUp)out.push(['받는 치유',`+${Math.round(s.healUp*100)}%`]);if(s.inv)out.push(['되살아난 뒤 무적',s.inv+'초']);if(s.floor)out.push(['쓰러지지 않음','생명력 1']);if(s.block)out.push(['적 투사체','막음']);if(s.kind==='shield')out.push(['보호막 규칙','겹치지 않음 · 다른 보호막 '+SHIELD_LOCK+'초 잠김']);
  if(s.heal&&s.kind==='field')out.push(['회복 /0.5초',Math.round(maxHp()*s.heal*.5*sup)]);
  if(s.rad)out.push(['범위',s.rad]);if(s.jumps)out.push(['튀는 횟수',s.jumps]);
  if(s.dur&&s.kind!=='shield')out.push(['지속',s.dur+'초']);if(s.freeze)out.push(['빙결',s.freeze+'초']);if(s.stun)out.push(['기절',s.stun+'초']);
  if(s.kind==='blink')out.push(['거리',s.range]);
  out.push(['마나',costAt(id,L)]);return out}
function detailHtml(id){const s=SPELLS[id],base=P.sk[id]||0,L=skLv(id),bon=base?bonusLv(id):0,pre=PRE[id],need=reqLvOf(id),C=CLASSES[P.cls],rkN=s.tab==='adv'?'상위 기술':C.rankN(s.rank);
  let h=`<div class="detail"><div class="t">${s.n}<i>${s.en}</i></div><div class="sub">${s.kn} · ${rkN} · ${ELN[s.el]} · ${KINDN[s.kind]} · 재사용 ${Math.round(cdOf(id)*100)/100}초${castInfo(id,L)?` · <b class="cinfo">${castInfo(id,L)}</b>`:''}</div><div class="d">${s.desc}${s.chant?` <span class="muted">영창 「${s.chant}」</span>`:''}</div>`;
  h+=`<div>스킬 레벨 <b style="color:#ffd76a">${L}</b> / ${MAXSK}${bon?` <span class="muted">(찍은 점수 ${base} + 장비 ${bon})</span>`:''}</div>`;
  const cur=numsAt(id,Math.max(1,L)),nx=base<MAXSK?numsAt(id,(L||0)+1):null;
  h+='<div class="nums"><span></span><span class="muted">'+(L?'지금':'1레벨')+'</span><span class="muted">'+(nx&&L?'다음 레벨':'')+'</span>';
  cur.forEach(([k,v],i)=>{h+=`<span>${k}</span><b>${v}</b><b class="nx">${nx&&L&&nx[i]&&nx[i][1]!==v?nx[i][1]:''}</b>`});h+='</div>';
  if(isDmg(s))h+=`<div class="muted">시너지: 같은 ${C.trees[TREE[id]]} 계열의 다른 마법에 찍은 1점마다 피해 +${SYN_PT*100}% (최대 +${SYN_CAP*100}%, 지금 +${Math.round(synBonus(id)*1000)/10}%). 스킬 레벨·시너지·원소 %는 서로 더해집니다</div>`;
  const reqs=[];if(s.tab==='adv'&&!P.job2)reqs.push(`<span class="lockup">상위 기술: 2차 전직 뒤에 찍고 쓸 수 있습니다 (레벨 ${need}부터)${base?` · 찍어 둔 ${base}점은 그대로 남아 있습니다`:''}</span>`);else if(P.lvl<need)reqs.push(base?`<span class="lockup">이미 배운 마법이라 지금 점수(${base}점) 그대로 씁니다 · 더 찍으려면 레벨 ${ptNeed(id)}부터 (${rkN}는 레벨 ${need}부터)</span>`:`레벨 ${need} 필요`);else if(base<MAXSK&&P.lvl<ptNeed(id))reqs.push(`다음 점수는 레벨 ${ptNeed(id)}부터 (점수를 찍을 때마다 요구 레벨 +1)`);const miss=(pre||[]).filter(p=>!P.sk[p]);if(miss.length)reqs.push(`선행 마법 ${miss.map(p=>SPELLS[p].n).join(', ')}에 1점 이상`);
  if(reqs.length)h+=`<div class="req">${reqs.join(' · ')}</div>`;else if(pre)h+=`<div class="req ok">선행 마법 ${pre.map(p=>SPELLS[p].n).join(', ')} ✓</div>`;else h+='<div class="req ok">선행 마법 없음 · 레벨만 되면 바로 찍을 수 있습니다</div>';
  h+=`<div class="acts"><button type="button" data-learn="${id}" ${canLearn(id)?'':'disabled'}>+1 포인트 ${P.sp?`(남은 ${P.sp})`:''}</button>`;
  if(L&&s.kind!=='passive')h+=`<button type="button" data-bind="${id}">${bindId===id?'누를 키를 기다리는 중… (Esc 취소)':'다음에 누르는 키에 넣기'}</button>`;h+='</div>';
  if(L&&s.kind!=='passive'){h+='<div class="slotpick">';SLOTS.forEach((sl,i)=>{h+=`<button type="button" data-assign="${id}" data-i="${i}" aria-pressed="${P.bar[i]===id}" title="${sl.k} 칸에 넣기">${sl.k}</button>`});h+='</div>'}
  return h+'</div>'}
function treeHtml(){const C=CLASSES[P.cls],trees=C.trees;
  let h=`<div class="pts">남은 스킬 포인트 <b>${P.sp}</b> <span class="muted">· 레벨마다 1점 · 한 마법에 최대 ${MAXSK}점 · 선으로 이어진 마법만 위의 마법에 1점이 필요하고, 나머지는 레벨만 되면 바로 찍습니다</span></div><div class="treetabs">`;
  trees.forEach((n,t)=>{let pts=0;for(const k in P.sk)if(TREE[k]===t)pts+=P.sk[k];h+=`<button type="button" data-tree="${t}" aria-selected="${t===treeSel}">${n} <span class="muted">${pts}</span></button>`});h+='</div>';
  const list=Object.values(SPELLS).filter(s=>s.cls===P.cls&&TREE[s.id]===treeSel&&!s.tab);// v19: 상위 기술(tab:'adv')은 1차 나무에 없음
  const cols=Math.max(...list.map(s=>TREEPOS[s.id].col))+1,CW=60,RH=58,LW=70,width=LW+cols*CW,height=RANK_LV.length*RH;
  if(!nodeSel||!list.some(s=>s.id===nodeSel))nodeSel=(list.find(s=>P.sk[s.id])||list[0]).id;
  let lines='',nodes='',labels='';
  const pos=id=>{const p=TREEPOS[id];return{x:LW+p.col*CW+25,y:p.row*RH+25}};
  for(let r=0;r<RANK_LV.length;r++)labels+=`<div class="rl" style="top:${r*RH}px"><b>${C.rankN(r+1)}</b>레벨 ${RANK_LV[r]}</div>`;
  for(const s of list){const p=pos(s.id);for(const pr of PRE[s.id]||[]){const q=pos(pr),on=P.sk[pr]>0,adj=p.y-q.y<=RH+1&&q.x===p.x;
    // 바로 아래 칸이 아니면 칸 사이 틈으로 돌아가 다른 마법 위를 지나지 않게 한다
    const gx=q.x+(p.x>=q.x?30:-30),d=adj?`M${q.x} ${q.y+25}V${p.y-25}`:`M${q.x} ${q.y+25}V${q.y+29}H${gx}V${p.y-29}H${p.x}V${p.y-25}`;
    lines+=`<path d="${d}" fill="none" stroke="${on?'#c9a24a':'#5a4a36'}" stroke-width="2" stroke-linejoin="round"/>`}
    const L=skLv(s.id),cls=L?(P.sk[s.id]&&(P.lvl<reqLvOf(s.id)||!advUnlocked(s.id))?'has lockup':'has'):canLearn(s.id)?'can':P.lvl<reqLvOf(s.id)||!preOk(s.id)||!advUnlocked(s.id)?'locked':'';
    nodes+=`<button class="node ${cls}${s.kind==='passive'?' passive':''}" type="button" data-node="${s.id}" aria-pressed="${nodeSel===s.id}" title="${s.n}${s.kind==='passive'?' (패시브)':''}" style="left:${p.x-25}px;top:${p.y-25}px">${spellSvg(s)}${s.kind==='passive'?'<span class="pv">패시브</span>':''}${L?`<span class="nl">${L}</span>`:''}</button>`}
  h+=`<div class="treescroll"><div class="tree" style="width:${width}px;height:${height}px"><svg class="lines" width="${width}" height="${height}">${lines}</svg>${labels}${nodes}</div></div>`;
  h+=detailHtml(nodeSel);
  return h}
function charHtml(){
  const C=CLASSES[P.cls];
  let h=`<div class="pts">남은 능력치 포인트 <b>${P.ap}</b> <span class="muted">· 레벨마다 5점</span></div>`;
  for(const [k,n,d] of clsStatRows(C)||[['int','지능','주문력 +1 (모든 마법 피해와 치유가 늘어납니다)'],['vit','활력',`생명력 +${Math.round(4*C.hp*10)/10}`],['spi','정신',`마나 +${Math.round(3*C.mp*10)/10}, 마나 회복 +0.06/초`]])
    h+=`<div class="attr"><div><b>${n}</b> <span class="muted">${d}</span></div><div class="btns"><b>${P.st[k]}</b><button type="button" data-stat="${k}" data-q="1" ${P.ap?'':'disabled'} aria-label="${n} 1점 올리기">+1</button><button type="button" data-stat="${k}" data-q="5" ${P.ap>=5?'':'disabled'} aria-label="${n} 5점 올리기">+5</button></div></div>`;
  const st=[...(PHYS_CLS[P.cls]?clsStatList():[['주문력',Math.round(power())]]),['생명력',maxHp()],['마나',maxMp()],['마나 회복/초',regen().toFixed(1)],['치명타',Math.round(critC()*100)+'%'],['재사용 대기 감소',Math.min(50,stat('cdr'))+'%'],['마나 소모 감소',Math.min(40,stat('mcost'))+'%'],['모든 마법 레벨','+'+stat('all')],['금화',P.gold.toLocaleString()],['난이도',DIFF[P.diff].n]];
  h+='<h2>능력</h2><div class="stats">'+st.map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('')+'</div><h2>착용 중</h2>';
  for(const sl of gearSlots()){const it=P.gear[sl];h+=`<div class="item hasic">${itemIcon(it,{slot:sl})}<div><div class="nm" style="color:${it?RAR[it.rar].c:'#a39d8f'}">${SLOT[sl].n}: ${it?itemName(it):'없음'}</div>${it?`<div class="st">${statLine(it)}</div>`:''}</div></div>`}
  const sh=setsHtml();if(sh)h+='<h2>세트 효과</h2>'+sh;
  h+=`<h2>물약</h2><div class="stats"><div><span>생명력 (Q)</span><b>${potCounts('hp')}</b></div><div><span>마나 (E)</span><b>${potCounts('mp')}</b></div><div><span>귀환 두루마리 (R)</span><b>${tpCount()}</b></div></div>`;
  h+=`<h2>가방 <span class="muted">${P.bag.length}/${BAG_MAX}</span></h2>`+bagGridHtml();
  if(!P.bag.length)h+='<p class="muted">몬스터를 쓰러뜨리면 장비가 떨어집니다. 정예 몬스터(파란 이름)는 반드시 장비를 떨어뜨립니다. 노란 글씨 옵션은 마법 레벨을 올려 줍니다.</p>';
  else h+=`<div class="row" style="margin:0 0 10px"><button class="ghost" type="button" data-sellweak="1">지금 장비보다 약한 것 모두 판매</button></div>`;
  for(const it of P.bag)h+=itemRow(it,`<button type="button" data-equip="${it.id}">착용</button><button type="button" data-sell="${it.id}">판매 ${itemPrice(it)}</button>`);
  return h}
function shopHtml(){const t=actTown,type=SHOP_SLOTS[actShop]?actShop:'general',st=shopStock(t,type),pp=potPrice(t),rp=respecPrice(),ic=k=>miscIcon(k,26);
  let h=`<p class="purse">가진 금화 <b>${P.gold.toLocaleString()}</b></p>`;
  if(type==='general'){h+='<h2>물약과 두루마리</h2>';
    h+=`<p class="muted" style="margin:-2px 0 6px">물약은 ${POT_DUR}초에 걸쳐 회복합니다 · 생명력 ${POT_CD.hp}초, 마나 ${POT_CD.mp}초마다 한 병 · Q/E는 가진 것 중 가장 좋은 등급을 마십니다</p>`;
    const row=(k,T,n,d,have,pr,u)=>`<div class="shoprow"><div>${ic(k==='tp'?'tp':k+T)}${n} <span class="muted">· ${d} · 가진 것 ${have}${u}</span></div><div class="btns"><button type="button" data-buypot="${k}" data-tier="${T}" data-q="1" ${P.gold<pr?'disabled':''}>1${u} ${pr}</button><button type="button" data-buypot="${k}" data-tier="${T}" data-q="5" ${P.gold<pr*5?'disabled':''}>5${u} ${pr*5}</button></div></div>`;
    let locked=0;
    for(const k of ['hp','mp'])for(let T=0;T<POT_T.length;T++){if(!potOpen(t,T)){locked++;continue}h+=row(k,T,potName(k,T),`${POT_DUR}초 동안 ${k==='hp'?'생명력':'마나'} ${potAmt(k,T)}`,potN(k,T),potPriceT(k,T),'개')}
    if(locked)h+=`<p class="muted" style="margin:4px 0">더 좋은 물약은 더 깊은 땅의 마을(지역)에서 팝니다.</p>`;
    h+=row('tp',0,'귀환 두루마리',`${TP_CAST}초 뒤 가장 가까운 마을로 (R)`,tpCount(),pp,'장');
    h+=`<div class="shoprow"><div>${ic('respec')}망각의 물약 <span class="muted">· 찍은 스킬과 능력치를 모두 되돌려 다시 찍습니다</span></div><div class="btns"><button type="button" data-respec="1" ${P.gold<rp?'disabled':''}>마시기 ${rp}</button></div></div>`}
  const sl=SHOP_SLOTS[type];
  h+=`<h2>${type==='general'?'반지와 목걸이':SHOP_SLOTS[type].filter(k=>k!=='off'||PHYS_CLS[P.cls]).map(k=>SLOT[k].n).join('·')} <span class="muted">레벨이 오르거나 3분이 지나면 물건이 바뀝니다</span></h2>`;
  h+='<div class="muted" style="margin:-2px 0 8px">'+sl.filter(k=>k!=='off'||PHYS_CLS[P.cls]).map(k=>{const it=P.gear[k];return `착용 중인 ${SLOT[k].n}: <span style="color:${it?RAR[it.rar].c:'#a39d8f'}">${it?itemName(it):'없음'}</span>`}).join(' · ')+'</div>';
  if(!st.items.length)h+='<p class="muted">지금은 팔 물건이 없습니다.</p>';
  for(const it of st.items){const pr=buyPrice(it);h+=itemRow(it,`<button type="button" data-buy="${it.id}" ${P.gold<pr?'disabled':''}>구매 ${pr}</button>`)}
  const others=Object.keys(SHOPN).filter(k=>k!==type).map(k=>shopName(t,k)).join(', ');
  h+=`<h2>팔기 <span class="muted">가방 ${P.bag.length}/${BAG_MAX} · 어느 상점이든 다 삽니다</span></h2>`;
  if(!P.bag.length)h+='<p class="muted">팔 물건이 없습니다.</p>';
  else h+=`<div class="row" style="margin:0 0 10px"><button class="ghost" type="button" data-sellweak="1">지금 장비보다 약한 것 모두 판매</button></div>`;
  for(const it of P.bag)h+=itemRow(it,`<button type="button" data-equip="${it.id}">착용</button><button type="button" data-sell="${it.id}">판매 ${itemPrice(it)}</button>`);
  h+=`<p class="muted" style="margin-top:10px">이 마을의 다른 가게: ${others}</p>`;
  return h}
function gateHtml(){let h='<h2 style="margin-top:0">난이도</h2><div class="diffs">';
  DIFF.forEach((d,i)=>{const ok=P.lvl>=d.req;h+=`<button type="button" data-diff="${i}" aria-pressed="${P.diff===i}" ${ok?'':'disabled'}>${d.n}${ok?'':` (레벨 ${d.req})`}</button>`});
  h+=`</div><p class="muted">악몽은 몬스터 레벨 +20, 지옥은 +40. 더 강하고 더 많은 경험치와 높은 레벨의 장비를 줍니다.</p><h2>짝문</h2><p class="muted">짝 룬이 새겨진 두 문 사이를 잇습니다. 한 번 가 본 마을이면 어디서든 바로 건너갈 수 있습니다.</p>`;
  let rg='';for(const t of ALLTOWNS){const known=P.towns.includes(t.id),here=actTown===t;
    if(t.reg!==rg){rg=t.reg;const D=REGIONS[rg];h+=`<h3 style="margin:.8em 0 .2em;color:${D.col}">${D.n}${rg!=='home'?` <span class="muted">· 맵 끝 포탈로 처음 가 보세요</span>`:''}</h3>`}
    h+=`<div class="town"><div><b>${known?t.n:'???'}</b> <span class="muted">· ${REGIONS[t.reg]&&REGIONS[t.reg].hell?'지옥 전용 · ':''}주변 몬스터 레벨 ${t.base+w3Add(REGIONS[t.reg])}부터</span><div class="d">${known?t.desc:'아직 가 보지 않은 마을. 길을 따라 걸어가면 짝문이 이어집니다.'}</div></div><div>${here?'<button type="button" disabled>지금 여기</button>':`<button type="button" data-travel="${t.id}" ${known?'':'disabled'}>건너가기</button>`}</div></div>`}
  return h}
function renderPanel(){
  const st=pbody.scrollTop,ps=pbody.parentElement.scrollTop;
  $('#tabTree').setAttribute('aria-selected',tab==='tree');$('#tabChar').setAttribute('aria-selected',tab==='char');
  document.querySelector('.tabs').hidden=!(tab==='tree'||tab==='char');
  $('#ptitle').textContent=tab==='tree'?(CLASSES[P.cls].treeN||(P.cls==='priest'?'기도의 나무':'마법의 나무')):tab==='char'?'캐릭터와 가방':tab==='shop'?shopName(actTown,actShop):tab==='codex'?'도감':tab==='stash'?'창고':tab==='quest'?'의뢰':'짝문';
  pbody.innerHTML=tab==='tree'?treeHtml():tab==='char'?charHtml():tab==='shop'?shopHtml():tab==='codex'?codexHtml():tab==='stash'?stashHtml():tab==='quest'?questHtml():gateHtml();
  pbody.parentElement.scrollTop=ps;if(tab==='codex')codexDraw();
}
function respec(){let pts=0;for(const k in P.sk)pts+=P.sk[k];P.sk={};P.sp+=pts;const C=CLASSES[P.cls];
  P.ap+=(P.st.int-C.st[0])+(P.st.vit-C.st[1])+(P.st.spi-C.st[2]);P.st={int:C.st[0],vit:C.st[1],spi:C.st[2]};
  P.hp=Math.min(P.hp,maxHp());P.mp=Math.min(P.mp,maxMp());buildBar();msg(`망각의 물약: 스킬 포인트 ${P.sp}, 능력치 포인트 ${P.ap}을(를) 돌려받았습니다`,'#c9b4ff')}
pbody.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;
  if(stashClick(b)||questClick(b)||codexClick(b))return;
  if(b.dataset.tree){treeSel=+b.dataset.tree;nodeSel=null;renderPanel();return}
  if(b.dataset.node){nodeSel=b.dataset.node;bindId=null;renderPanel();return}
  if(b.dataset.learn){if(learnPoint(b.dataset.learn))renderPanel();return}
  if(b.dataset.bind){bindId=bindId===b.dataset.bind?null:b.dataset.bind;renderPanel();return}
  if(b.dataset.assign){bindId=b.dataset.assign;bindTo(+b.dataset.i);return}
  if(b.dataset.stat){const q=Math.min(P.ap,+b.dataset.q);P.st[b.dataset.stat]+=q;P.ap-=q;renderPanel();save();return}
  if(b.dataset.diff){P.diff=+b.dataset.diff;enemies=[];shops[actTown.id]=null;msg(`난이도: ${DIFF[P.diff].n}`,DIFF[P.diff].col);renderPanel();save();return}
  if(b.dataset.respec){const rp=respecPrice();if(P.gold<rp)return;P.gold-=rp;respec();renderPanel();save();return}
  if(b.dataset.buypot){const q=+b.dataset.q,k=b.dataset.buypot,T=b.dataset.tier!=null?+b.dataset.tier:POT_DEF;if(k!=='tp'&&!(POT_T[T]&&potOpen(actTown,T)))return;const pr=(k==='tp'?potPrice(actTown):potPriceT(k,T))*q;if(P.gold<pr)return;P.gold-=pr;if(k==='tp')P.pot.tp=tpCount()+q;else potAdd(k,T,q);msg(k==='tp'?`귀환 두루마리 ${q}장을 샀습니다`:`${potName(k,T)} ${q}개를 샀습니다`,'#e8c35a');renderPanel();save();return}
  if(b.dataset.buy){const st=shopStock(actTown,actShop),ix=st.items.findIndex(x=>x.id===+b.dataset.buy);if(ix<0)return;const it=st.items[ix],pr=buyPrice(it);
    if(P.bag.length>=BAG_MAX){msg('가방이 가득 찼습니다','#a39d8f');return}if(P.gold<pr)return;P.gold-=pr;st.items.splice(ix,1);P.bag.push(it);msg(`${it.name}을(를) 샀습니다`,RAR[it.rar].c);renderPanel();save();return}
  if(b.dataset.travel){const t=ALLTOWNS.find(x=>x.id===b.dataset.travel);if(!t)return;if(travelTown(t))return;burst(P.x,P.y,'#b9a2ff',30,160);P.x=t.gate.x+40;P.y=t.gate.y+40;P.home=t.id;enemies=[];projs=[];fields=[];rains=[];pend=[];
    followCam();closePanel();burst(P.x,P.y,'#b9a2ff',40,180);rings.push({x:P.x,y:P.y,r:10,max:90,life:.6,col:'#b9a2ff'});msg(`짝문을 지나 ${t.n}에 도착했습니다`,'#c9b4ff');save();return}
  if(b.dataset.equip){const id=+b.dataset.equip,ix=P.bag.findIndex(x=>x.id===id);if(ix<0)return;const it=P.bag[ix],gsl=gearDest(it,b.dataset.eqsl),old=P.gear[gsl];P.gear[gsl]=it;P.bag.splice(ix,1);if(old)P.bag.push(old);
    P.hp=Math.min(P.hp,maxHp());P.mp=Math.min(P.mp,maxMp());msg(`${itemName(it)} 착용`,RAR[it.rar].c);buildBar();renderPanel();save()}
  else if(b.dataset.sell){const id=+b.dataset.sell,ix=P.bag.findIndex(x=>x.id===id);if(ix<0)return;P.gold+=itemPrice(P.bag[ix]);P.bag.splice(ix,1);renderPanel();save()}
  else if(b.dataset.sellweak){let g=0;P.bag=P.bag.filter(it=>{if(itemScore(it)<=itemScore(gearCur(it))&&!(typeof rfOf==='function'&&rfOf(it))){g+=itemPrice(it);return false}return true})/* v21: 재련한 장비는 한꺼번에 팔지 않음 */;P.gold+=g;msg(`금화 ${g} 획득`,'#e8c35a');renderPanel();save()}
});
$('#tabTree').onclick=()=>{tab='tree';renderPanel()};$('#tabChar').onclick=()=>{tab='char';renderPanel()};
$('#pclose').onclick=closePanel;panel.addEventListener('pointerdown',e=>{if(e.target===panel)closePanel()});
$('#treeBtn').onclick=()=>openPanel('tree');$('#charBtn').onclick=()=>openPanel('char');
if(window.COOP_SERVER){$('#coopBtn').hidden=false;$('#coopBtn').onclick=netOpen;$('#chatBtn').hidden=false;$('#chatBtn').onclick=chatOpen;chatBox();netOpenWs();cloudInit()}
$('#codexBtn').onclick=()=>{if(!panel.hidden)closePanel();openCodex(!$('#intro').hidden)};
$('#helpBtn').onclick=()=>{save();$('#intro').hidden=false;paused=true;introButtons(true)};
$('#respawn').onclick=()=>{
  // 같이 하는 던전에서는 파티를 두고 나가지 않도록 던전 입구 방에서 다시 일어난다
  if(DG&&NET.on){const lost=Math.floor(P.gold*.1);P.gold-=lost;P.dead=false;const p0=tc(DG.start.cx,DG.start.cy);P.x=p0.x+rnd(-30,30);P.y=p0.y+rnd(-30,30);
    P.hp=maxHp();P.mp=maxMp();P.shield=0;P.hot=null;P.storm=null;P.buffs={};P.ward=null;P.invT=2;for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}
    projs=projs.filter(p=>p.owner!=='p');$('#death').hidden=true;paused=false;followCam();msg(lost?`금화 ${lost}을(를) 잃고 던전 입구에서 다시 일어섰습니다`:'던전 입구에서 다시 일어섰습니다','#a39d8f');save();return}
  DG=null;allies=[];warns=[];const lost=Math.floor(P.gold*.1);P.gold-=lost;P.dead=false;const ht=ALLTOWNS.find(t=>t.id===P.home)||TOWN;if(ht.reg!==REG.id){loadRegion(ht.reg);loot=[]}P.x=ht.x;P.y=ht.y+110;P.hp=maxHp();P.mp=maxMp();P.shield=0;P.hot=null;P.storm=null;P.buffs={};P.ward=null;
  enemies=[];projs=[];fields=[];pend=[];rains=[];$('#death').hidden=true;paused=false;followCam();msg(lost?`금화 ${lost}을(를) 잃었습니다`:`${ht.n}에서 다시 일어섰습니다`,'#a39d8f');save()};

/* ---------- input ---------- */
addEventListener('keydown',e=>{
  const c=e.code;
  if(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName))return;
  if(/^F[1-8]$/.test(c))e.preventDefault();
  if(bindId&&c in CODE2SLOT){e.preventDefault();bindTo(CODE2SLOT[c]);return}
  if(c==='Escape'){if(bindId){bindId=null;if(!panel.hidden)renderPanel();buildBar();return}if(!panel.hidden)closePanel();return}
  if(!$('#intro').hidden)return;
  if((c==='Enter'||c==='NumpadEnter')&&window.COOP_SERVER){e.preventDefault();chatOpen();return}
  if(c==='KeyF'){if(!panel.hidden&&(tab==='shop'||tab==='gate'||tab==='stash'||tab==='quest'))closePanel();else if(act&&!P.dead)doAct();return}
  if(c==='KeyT'||c==='KeyB'||c==='KeyK'){panel.hidden||tab!=='tree'?openPanel('tree'):closePanel();return}
  if(c==='KeyC'||c==='KeyI'){panel.hidden||tab!=='char'?openPanel('char'):closePanel();return}
  if(c==='KeyQ'){usePotion('hp');return}if(c==='KeyE'){usePotion('mp');return}if(c==='KeyR'){useScroll();return}
  if(c==='KeyJ'){panel.hidden||tab!=='codex'?openCodex(false):closePanel();return}
  if(/^(Key[WASD]|Arrow|Space)/.test(c)||c in CODE2SLOT){keys.add(c);if(c==='Space'||c.startsWith('Arrow')||c==='Backquote')e.preventDefault()}
});
addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>{keys.clear();mouse.l=mouse.r=false;joy=null;fireTouch=null});
cv.addEventListener('contextmenu',e=>e.preventDefault());
const rel=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/CZ,y:(e.clientY-r.top)/CZ}};// v20: 카메라 당기기 배율
cv.addEventListener('pointermove',e=>{const p=rel(e);
  if(e.pointerType==='mouse'){mouse.x=p.x;mouse.y=p.y;mouse.active=true;touchMode=false}
  if(joy&&e.pointerId===joy.id){joy.x=p.x;joy.y=p.y}
  if(fireTouch&&e.pointerId===fireTouch.id){fireTouch.x=p.x;fireTouch.y=p.y}});
cv.addEventListener('pointerdown',e=>{const p=rel(e);
  if(e.pointerType==='mouse'){mouse.x=p.x;mouse.y=p.y;mouse.active=true;touchMode=false;if(e.button===0)mouse.l=true;if(e.button===2)mouse.r=true;return}
  touchMode=true;try{cv.setPointerCapture(e.pointerId)}catch(_){}
  if(p.x<W*.45&&!joy)joy={id:e.pointerId,ox:p.x,oy:p.y,x:p.x,y:p.y};else fireTouch={id:e.pointerId,x:p.x,y:p.y}});
const upH=e=>{if(e.pointerType==='mouse'){if(e.button===0)mouse.l=false;if(e.button===2)mouse.r=false}
  if(joy&&e.pointerId===joy.id)joy=null;if(fireTouch&&e.pointerId===fireTouch.id)fireTouch=null};
addEventListener('pointerup',upH);addEventListener('pointercancel',upH);
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();mouse.l=mouse.r=false}});

/* ---------- save: 캐릭터마다 따로 저장 (최대 8명) ---------- */
const KEY='arseia-apprentice-save-v1',SLOTKEY=i=>ACC?ACCKEY(ACC.uid,i):'arseia-char-'+i,NSAVE=8;let curSlot=0;
function saveData(){return{v:5,slot:curSlot,towns:P.towns,home:P.home,cls:P.cls,lvl:P.lvl,xp:P.xp,gold:P.gold,gear:P.gear,bag:P.bag,pot:P.pot,bar:P.bar,sk:P.sk,sp:P.sp,st:P.st,ap:P.ap,diff:P.diff,x:DG?DG.ret.x:P.x,y:DG?DG.ret.y:P.y,reg:DG?'home':REG.id,hp:P.hp,mp:P.mp,uid,q:P.q,skOld:P.skOld||{}}}
function saveNow(){if(curSlot<0)return;try{localStorage.setItem(SLOTKEY(curSlot),JSON.stringify(saveData()));cloudSaved(curSlot)}catch(_){}}
function save(){if(curSlot<0||paused&&!$('#intro').hidden)return;try{localStorage.setItem(SLOTKEY(curSlot),JSON.stringify(saveData()));cloudSaved(curSlot)}catch(_){}}
const okSave=d=>d&&d.v>=2&&d.v<=5&&CLASSES[d.cls];
function slotRaw(i){try{return !!localStorage.getItem(SLOTKEY(i))||(i===0&&!ACC&&!!localStorage.getItem(KEY))}catch(_){return false}}
function readSlot(i){try{const s=localStorage.getItem(SLOTKEY(i));const d=s?JSON.parse(s):null;return okSave(d)?d:null}catch(_){return null}}
// 예전 한 칸짜리 저장은 1번 캐릭터로 옮긴다 (원본은 지우지 않음)
(()=>{try{if(!localStorage.getItem(SLOTKEY(0))){const s=localStorage.getItem(KEY);const d=s?JSON.parse(s):null;if(okSave(d))localStorage.setItem(SLOTKEY(0),s)}}catch(_){}})();
const fixItem=it=>{if(!(it&&SLOT[it.slot]&&it.stats))return null;if(it.rar===3&&!it.set)it.rar=4;if(it.rar>5)it.rar=5;fixStats(it.stats);return it};
function load(d,slot){
  if(!okSave(d))return false;
  curSlot=slot!=null?slot:(d.slot|0);DG=null;allies=[];warns=[];
  P=freshPlayer(d.cls);
  P.lvl=clamp(d.lvl|0,1,MAXLV);P.gold=d.gold|0;P.pot=d.pot&&typeof d.pot==='object'?d.pot:P.pot;for(const k of ['ht','mt'])if(k in P.pot&&!Array.isArray(P.pot[k]))delete P.pot[k];
  for(const sl in P.gear)P.gear[sl]=fixItem(d.gear&&d.gear[sl]);P.bag=(d.bag||[]).map(fixItem).filter(Boolean).slice(0,BAG_MAX);
  uid=Math.max(uid,d.uid||100);
  loadRegion(REGIONS[d.reg]?d.reg:'home');
  P.towns=(d.towns||['brenhill']).filter(id=>ALLTOWNS.some(t=>t.id===id));if(!P.towns.length)P.towns=['brenhill'];P.home=d.home||'brenhill';
  if(typeof d.x==='number'){P.x=clamp(d.x,20,WORLD-20);P.y=clamp(d.y,20,WORLD-20)}
  if(d.v>=4){P.xp=clamp(d.xp|0,0,Math.max(0,xpNeed(P.lvl)-1));const sl=skLoad(d.sk,d.cls,P.lvl);P.sk=sl.sk;P.skOld=Object.assign({},sl.skOld,d.skOld&&typeof d.skOld==='object'&&!Array.isArray(d.skOld)?d.skOld:{});// v19: 합친 스킬 점수 옮기기 · 원래 점수 보관
    P.sp=(d.sp|0)+sl.back;if(sl.back||sl.moved.length)setTimeout(()=>skMoveMsgV19(sl),400);P.st=Object.assign(P.st,d.st||{});P.ap=d.ap|0;const df=d.diff|0;P.diff=DIFF[df]&&P.lvl>=DIFF[df].req?df:0;
    P.bar=Array(21).fill(null).map((_,i)=>{const x=mapBarV19(d.bar,i);return x&&SPELLS[x]&&SPELLS[x].cls===d.cls&&SPELLS[x].kind!=='passive'?x:null})}
  else{P.xp=Math.min(d.xp|0,xpNeed(P.lvl)-1);P.sp=P.lvl-1;P.ap=(P.lvl-1)*5;
    setTimeout(()=>{msg(`새 성장 체계로 바뀌었습니다. 스킬 포인트 ${P.sp}점과 능력치 포인트 ${P.ap}점을 돌려받았습니다`,'#ffd76a');msg('스킬 트리(T)와 캐릭터(C)에서 찍으세요','#ffd76a')},400)}
  P.hp=Math.min(maxHp(),d.hp>0?d.hp:maxHp());P.mp=Math.min(maxMp(),d.mp||maxMp());
  lastRank=rankOf(P.lvl);buildBar();
  {const q=d.q;P.q=q&&typeof q==='object'?{i:clamp(q.i|0,0,QUESTS.length),st:clamp(q.st|0,0,2),c:typeof q.c==='object'&&q.c?q.c:{}}:{i:0,st:0,c:{}}}
  enemies=[];loot=[];projs=[];fields=[];rains=[];pend=[];followCam();questHud();return true;
}
function newGame(cls,slot){
  loadRegion('home');curSlot=slot;DG=null;allies=[];warns=[];P=freshPlayer(cls);P.hp=maxHp();P.mp=maxMp();lastRank=1;enemies=[];loot=[];projs=[];fields=[];rains=[];pend=[];
  followCam();buildBar();
  P.q={i:0,st:0,c:{}};questHud();
  $('#intro').hidden=true;paused=false;save();
  msg(CLASSES[cls].startMsg||(cls==='priest'?'성 아우렐의 견습사제로 길을 나섭니다':'근원어를 막 깨친 견습 마법사로 길을 나섭니다'),'#d6b262');
  msg('레벨이 오르면 스킬 트리(T)에서 새 마법을 찍으세요','#d6b262');
}
let delAsk=-1;
function introButtons(resume){
  if(curSlot<0)resume=false;introButtons.last=resume;
  const box=$('#introBody'),inGame=resume;
  let h=cloudBox();
  if(inGame)h+='<div class="row" style="margin-top:4px"><button class="primary" type="button" id="go">계속하기</button></div>';
  h+='<h2>캐릭터</h2><div class="classes">';
  let empty=-1;
  for(let i=0;i<NSAVE;i++){const d=readSlot(i);if(!d){if(slotRaw(i)){h+=`<div class="cls"><b>읽을 수 없는 칸 ${i+1}</b><span>손상됐거나 더 새 버전에서 만든 저장입니다. 덮어쓰지 않도록 잠가 두었습니다.</span></div>`;continue}if(empty<0)empty=i;continue}const C=CLASSES[d.cls],here=inGame&&i===curSlot;
    const gq=JSON.stringify({robe:d.gear&&d.gear.robe?{rar:d.gear.robe.rar}:null,staff:d.gear&&d.gear.staff?{rar:d.gear.staff.rar}:null});
    h+=`<div class="cls has-pv"><canvas class="pv" data-pv="${d.cls}" data-gear='${gq}'></canvas><b>${C.n} · Lv ${d.lvl}</b><span>${C.grade[rankOf(d.lvl)-1]} · ${C.rankN(rankOf(d.lvl))}${d.diff?` · ${DIFF[d.diff].n}`:''}<br>금화 ${(d.gold|0).toLocaleString()} · 가 본 마을 ${(d.towns||[]).length}곳</span>
      <div class="row" style="margin-top:6px">${here?'<button class="ghost" type="button" disabled>지금 플레이 중</button>':`<button class="primary" type="button" data-play="${i}">이어하기</button>`}
      ${here?'':`<button class="ghost" type="button" data-del="${i}">${delAsk===i?'정말 지우기':'지우기'}</button>`}<button class="ghost" type="button" data-exp="${i}">내보내기</button></div><div data-expbox="${i}"></div></div>`}
  h+='</div>';
  if(empty>=0){h+='<h2>새 캐릭터 만들기</h2><div class="classes">';
    for(const k in CLASSES){const C=CLASSES[k];h+=`<button class="cls has-pv" type="button" data-cls="${k}" data-slot="${empty}"><canvas class="pv" data-pv="${k}"></canvas><b>${C.n}</b><span>${C.desc}</span><em>스킬 트리: ${C.trees.join(', ')} · 첫 마법: ${SPELLS[C.start[0]].n}</em></button>`}
    h+='</div><p class="muted" style="margin-top:8px">새 캐릭터는 빈 칸에 따로 저장됩니다. 다른 캐릭터는 그대로 남습니다.</p>'}
  else h+='<p class="muted">캐릭터 칸이 가득 찼습니다(8명). 새로 만들려면 하나를 지우세요.</p>';
  h+=`<h2>캐릭터 옮기기</h2><p class="muted">다른 주소(예: 같이 하기 서버)로 캐릭터를 옮길 때 씁니다. 캐릭터 카드의 <b>내보내기</b>로 코드를 복사해, 옮길 곳에서 아래 칸에 붙여 넣으세요. 빈 칸에만 들어가고 기존 캐릭터는 건드리지 않습니다.</p><textarea id="impCode" rows="2" style="width:100%;box-sizing:border-box;background:#0e0c0a;color:#e8e2d2;border:1px solid var(--line);border-radius:3px;font-size:12px" placeholder="ARSEIA1:로 시작하는 코드"></textarea><div class="row" style="margin-top:6px"><button class="ghost" type="button" id="impBtn">가져오기</button><span class="muted" id="impMsg"></span></div>`;
  box.innerHTML=h;heroPreviews(box);cloudWire(box,resume);
  box.querySelectorAll('[data-exp]').forEach(b=>b.onclick=()=>{const i=+b.dataset.exp;if(inGame&&i===curSlot)saveNow();const d=readSlot(i);if(!d)return;const code=charCode(d),eb=box.querySelector(`[data-expbox="${i}"]`);
    eb.innerHTML='<textarea readonly rows="3" style="width:100%;box-sizing:border-box;margin-top:6px;background:#0e0c0a;color:#e8e2d2;border:1px solid var(--line);font-size:11px"></textarea><span class="muted">코드를 모두 복사하세요</span>';const ta=eb.querySelector('textarea');ta.value=code;ta.focus();ta.select();try{navigator.clipboard.writeText(code).then(()=>{eb.querySelector('span').textContent='복사했습니다. 옮길 곳의 캐릭터 옮기기 칸에 붙여 넣으세요'},()=>{})}catch(_){}});
  const ib=box.querySelector('#impBtn');if(ib)ib.onclick=()=>{const d=charDecode($('#impCode').value),out=$('#impMsg');if(!d||!okSave(d)){out.textContent='코드를 읽을 수 없습니다';return}
    let slot=-1;for(let i=0;i<NSAVE;i++){if(readSlot(i))continue;if(i===0){try{if(localStorage.getItem(KEY))continue}catch(_){}}slot=i;break}
    if(slot<0){out.textContent='빈 캐릭터 칸이 없습니다. 하나를 지운 뒤 다시 하세요';return}
    d.slot=slot;try{if(localStorage.getItem(SLOTKEY(slot)))throw 0;localStorage.setItem(SLOTKEY(slot),JSON.stringify(d));cloudSaved(slot);cloudPush(true)}catch(_){out.textContent='저장하지 못했습니다';return}introButtons(resume);msg(`${CLASSES[d.cls].n} Lv ${d.lvl} 캐릭터를 가져왔습니다`,'#d6b262')};
  if(inGame)$('#go').onclick=()=>{$('#intro').hidden=true;paused=false};
  box.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{if(inGame)saveNow();const i=+b.dataset.play;load(readSlot(i),i);$('#intro').hidden=true;paused=false;msg('다시 모험을 이어갑니다','#d6b262')});
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const i=+b.dataset.del;if(delAsk!==i){delAsk=i;introButtons(resume);return}delAsk=-1;try{localStorage.removeItem(SLOTKEY(i));if(ACC)cloudDel(i);else if(i===0)localStorage.removeItem(KEY)}catch(_){}introButtons(resume)});
  box.querySelectorAll('[data-cls]').forEach(b=>b.onclick=()=>{const sl=+b.dataset.slot;if(slotRaw(sl)&&!readSlot(sl)){introButtons(resume);return}if(inGame)saveNow();newGame(b.dataset.cls,sl)});
}

/* ---------- loop ---------- */
let last=performance.now(),mmT=0,hudT=0; // [최적화] 화면 아래 정보(HUD)는 초당 15번만 고친다
// [최적화] FPS 표시기: Ctrl+Shift+F로 켜고 끈다 (그리기 전용, 저장 안 함)
const FPSM={on:false,el:null,n:0,acc:0,worst:0,t0:0,prev:0};
function fpsTick(now){if(!FPSM.on){FPSM.prev=now;return}const d=now-FPSM.prev;FPSM.prev=now;if(!(d>0)||d>1000)return;FPSM.n++;FPSM.acc+=d;FPSM.worst=Math.max(FPSM.worst,d);
  if(now-FPSM.t0>=500){FPSM.el.textContent=`FPS ${(1000*FPSM.n/FPSM.acc).toFixed(0)} · 평균 ${(FPSM.acc/FPSM.n).toFixed(1)}ms · 최악 ${FPSM.worst.toFixed(0)}ms · 품질 ${Q.lvl}`;FPSM.n=0;FPSM.acc=0;FPSM.worst=0;FPSM.t0=now}}
addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.code==='KeyF'){e.preventDefault();FPSM.on=!FPSM.on;
  if(!FPSM.el){FPSM.el=document.createElement('div');FPSM.el.style.cssText='position:fixed;left:50%;top:4px;transform:translateX(-50%);z-index:9999;padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.6);color:#d6f5c8;font:12px monospace;pointer-events:none';document.body.appendChild(FPSM.el)}
  FPSM.el.hidden=!FPSM.on;FPSM.el.textContent='FPS 재는 중…';FPSM.n=FPSM.acc=FPSM.worst=0;FPSM.t0=performance.now()}});
// [v24 최적화 · 「게임 최적화 방안」 스레드] 프레임 상한: 화면 주사율이 120·144Hz여도 60번(절전이면 30번)만 그린다 → 발열·전력 절약.
// rAF 간격(per)의 절반만큼 일찍 와도 그린다 (60Hz 화면에서 프레임을 건너뛰지 않게).
let rafPer=16.7,rafPrev=0;
function stepSim(dt){if(!paused||NET.on){let r=dt,n=0;do{const d=Math.min(.05,r);update(d);r-=d;n++}while(r>1e-4&&n<5);return n}time+=Math.min(.05,dt);return 0}
// [v25 최적화] 자동 절전: 60 설정이어도 화면에 움직일 것이 없으면(2초 동안 입력 · 이동 · 싸움 · 마법이 없음) 또는 다른 창을 보고 있으면 30번만 그린다.
// 움직이기 시작하면(키 · 마우스 · 터치, 몬스터가 쫓아옴, 마법) 바로 60으로 돌아온다. 같이하기 중에는 늘 60. 게임 속도는 같다.
const IDLE={inp:0,px:0,py:0,t:0};
for(const ev of ['keydown','pointerdown','pointermove','wheel','touchstart'])addEventListener(ev,()=>{IDLE.inp=performance.now();IDLE.t=0},{passive:true,capture:true});
function idleTick(dt,now){let busy=now-IDLE.inp<1500||NET.on;if(!busy&&!P.dead&&(Math.abs(P.x-IDLE.px)+Math.abs(P.y-IDLE.py)>.5))busy=true;IDLE.px=P.x;IDLE.py=P.y;
  if(!busy&&(projs.length||fields.length||pend.length||beams.length||bolts.length||rains.length))busy=true;
  if(!busy)for(const e of enemies)if(e.aggroed&&!e.dead){busy=true;break}
  IDLE.t=busy?0:IDLE.t+dt}
function frameCapMs(){if(GFX.fps===30)return 33.3;if(!NET.on&&(IDLE.t>2||!document.hasFocus()))return 33.3;return 16.6}
const qTickMs=raw=>raw-Math.max(0,frameCapMs()-16.7);// 일부러 쉰 시간은 자동 품질에서 느림으로 치지 않음
function frame(now){
  {const d=now-rafPrev;rafPrev=now;if(d>0&&d<100)rafPer+=(d-rafPer)*.1}
  const raw=now-last,cap=frameCapMs();
  if(raw<cap-rafPer/2&&raw>=0){requestAnimationFrame(frame);return}
  Q.tick(qTickMs(raw));last=now;
  // [v24 최적화] 밀림 고치기: 예전에는 한 프레임에 0.05초까지만 게임 시간을 흘려, 20fps 아래에서는 게임 전체가 느리게(슬로 모션) 갔다.
  // 이제 실제로 흐른 시간(한 프레임 최대 0.25초)을 0.05초 조각으로 나눠 update를 여러 번 부른다. 조각 크기는 예전과 같아 규칙·수치는 그대로.
  const dt=Math.min(.25,Math.max(0,raw)/1000);
  stepSim(dt);idleTick(dt,now);
  fpsTick(now);render();hudT-=dt;if(hudT<=0){hudT=1/15;updateHud()}
  mmT-=dt;if(mmT<=0){mmT=.15;drawMinimap()}
  requestAnimationFrame(frame);
}
function start(data){
  SC.bakeLeft=99;Kit.shadow(ctx,-99,-99,1,1,0);heroBake(P,Math.max(1,DPR)*HS*PK);Art.get('coin');Art.get('potion','hp');Art.get('potion','mp');for(let r=0;r<6;r++)Art.get('gem',r);
  buildBar();P.hp=maxHp();P.mp=maxMp();followCam();
  if(okSave(data)&&load(data,data.slot|0)){$('#intro').hidden=true;paused=false}
  else introButtons(false);
  requestAnimationFrame(t=>{last=t;frame(t)});
  if(location.hash==='#gallery')setTimeout(showGallery,300);
}
window.claude?.hot?.snapshot?.(()=>saveData());
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
window.__game={SC,get decorList(){return decor},regen,spdMul,dmgMul,eff,moveBody,get REG(){return REG},get EDGES(){return EDGES},REGIONS,ALLTOWNS,loadRegion,switchRegion,useEdge,liqAt,blockedAt,regionTick,dgMob,enemyTarget,inSafe,ghostTest:(from,sp,x,y)=>netGhostCast({from,sp,L:10,x,y}),get NET(){return NET},get DG(){return DG},get allies(){return allies},get loot(){return loot},CAVES,enterDungeon,leaveDungeon,TYPES,SETS,gearStats,stat,get act(){return act},hurtE,killE,save,saveData,load,readSlot,get P(){return P},get enemies(){return enemies},get bolts(){return bolts},SPELLS,TREE,PRE,tryCast,newGame,gainXp,update,spawnEnemy,learnPoint,skLv,makeItem,render,bindTo,set bindId(v){bindId=v},S2W,W2S,get cam(){return{camX,camY}},saveNow,cloudPush,get ACC(){return ACC},get curSlot(){return curSlot},
  shopAt,shopStock,shopName,SHOPN,SHOP_SLOTS,get actShop(){return actShop},get actTown(){return actTown},useScroll,townPortal,tpCount,get TPC(){return TPC},TP_CAST,potPrice,POT_T,POT_DEF,POT_CD,POT_DUR,potN,potAdd,potTotal,potBest,potAmt,potPriceT,potOpen,drinkPotion,potCdLeft,openCodex,cxGroups,monInfo,UNIQ,BOSSU,DUNGEONS,openPanel,closePanel,renderPanel,doAct,get tab(){return tab},get panelHidden(){return panel.hidden},itemScore,usePotion,get TOWNS(){return TOWNS},get paused(){return paused},set paused(v){paused=v},get decor(){return decor}};
})();
</script>
