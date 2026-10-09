/* ---------- save: 캐릭터마다 따로 저장 (최대 8명) ---------- */
const KEY='arseia-apprentice-save-v1',SLOTKEY=i=>'arseia-char-'+i,NSAVE=8;let curSlot=0;
function saveData(){return{v:4,slot:curSlot,towns:P.towns,home:P.home,cls:P.cls,lvl:P.lvl,xp:P.xp,gold:P.gold,gear:P.gear,bag:P.bag,pot:P.pot,bar:P.bar,sk:P.sk,sp:P.sp,st:P.st,ap:P.ap,diff:P.diff,x:P.x,y:P.y,hp:P.hp,mp:P.mp,uid}}
function save(){if(paused&&!$('#intro').hidden)return;try{localStorage.setItem(SLOTKEY(curSlot),JSON.stringify(saveData()))}catch(_){}}
const okSave=d=>d&&d.v>=2&&d.v<=4&&CLASSES[d.cls];
function readSlot(i){try{const s=localStorage.getItem(SLOTKEY(i));const d=s?JSON.parse(s):null;return okSave(d)?d:null}catch(_){return null}}
// 예전 한 칸짜리 저장은 1번 캐릭터로 옮긴다 (원본은 지우지 않음)
(()=>{try{if(!localStorage.getItem(SLOTKEY(0))){const s=localStorage.getItem(KEY);const d=s?JSON.parse(s):null;if(okSave(d))localStorage.setItem(SLOTKEY(0),s)}}catch(_){}})();
const fixItem=it=>it&&SLOT[it.slot]&&it.stats?it:null;
function load(d,slot){
  if(!okSave(d))return false;
  curSlot=slot!=null?slot:(d.slot|0);
  P=freshPlayer(d.cls);
  P.lvl=clamp(d.lvl|0,1,MAXLV);P.gold=d.gold|0;P.pot=d.pot||P.pot;
  for(const sl in P.gear)P.gear[sl]=fixItem(d.gear&&d.gear[sl]);P.bag=(d.bag||[]).map(fixItem).filter(Boolean).slice(0,20);
  uid=Math.max(uid,d.uid||100);
  P.towns=(d.towns||['brenhill']).filter(id=>TOWNS.some(t=>t.id===id));if(!P.towns.length)P.towns=['brenhill'];P.home=d.home||'brenhill';
  if(typeof d.x==='number'){P.x=clamp(d.x,20,WORLD-20);P.y=clamp(d.y,20,WORLD-20)}
  if(d.v===4){P.xp=d.xp|0;P.sk={};for(const k in d.sk||{})if(SPELLS[k]&&SPELLS[k].cls===d.cls)P.sk[k]=clamp(d.sk[k]|0,0,MAXSK);
    P.sp=d.sp|0;P.st=Object.assign(P.st,d.st||{});P.ap=d.ap|0;const df=d.diff|0;P.diff=DIFF[df]&&P.lvl>=DIFF[df].req?df:0;
    P.bar=Array(21).fill(null).map((_,i)=>{const x=d.bar&&d.bar[i];return x&&SPELLS[x]&&SPELLS[x].cls===d.cls?x:null})}
  else{P.xp=Math.min(d.xp|0,xpNeed(P.lvl)-1);P.sp=P.lvl-1;P.ap=(P.lvl-1)*5;
    setTimeout(()=>{msg(`새 성장 체계로 바뀌었습니다. 스킬 포인트 ${P.sp}점과 능력치 포인트 ${P.ap}점을 돌려받았습니다`,'#ffd76a');msg('스킬 트리(T)와 캐릭터(C)에서 찍으세요','#ffd76a')},400)}
  P.hp=Math.min(maxHp(),d.hp>0?d.hp:maxHp());P.mp=Math.min(maxMp(),d.mp||maxMp());
  lastRank=rankOf(P.lvl);buildBar();
  enemies=[];loot=[];projs=[];fields=[];rains=[];pend=[];followCam();return true;
}
function newGame(cls,slot){
  curSlot=slot;P=freshPlayer(cls);P.hp=maxHp();P.mp=maxMp();lastRank=1;enemies=[];loot=[];projs=[];fields=[];rains=[];pend=[];
  followCam();buildBar();
  $('#intro').hidden=true;paused=false;save();
  msg(cls==='priest'?'성 아우렐의 견습사제로 길을 나섭니다':'근원어를 막 깨친 견습 마법사로 길을 나섭니다','#d6b262');
  msg('레벨이 오르면 스킬 트리(T)에서 새 마법을 찍으세요','#d6b262');
}
let delAsk=-1;
function introButtons(resume){
  const box=$('#introBody'),inGame=resume;
  let h='';
  if(inGame)h+='<div class="row" style="margin-top:4px"><button class="primary" type="button" id="go">계속하기</button></div>';
  h+='<h2>캐릭터</h2><div class="classes">';
  let empty=-1;
  for(let i=0;i<NSAVE;i++){const d=readSlot(i);if(!d){if(empty<0)empty=i;continue}const C=CLASSES[d.cls],here=inGame&&i===curSlot;
    h+=`<div class="cls"><b>${C.n} · Lv ${d.lvl}</b><span>${C.grade[rankOf(d.lvl)-1]} · ${C.rankN(rankOf(d.lvl))}${d.diff?` · ${DIFF[d.diff].n}`:''}<br>금화 ${(d.gold|0).toLocaleString()} · 가 본 마을 ${(d.towns||[]).length}곳</span>
      <div class="row" style="margin-top:6px">${here?'<button class="ghost" type="button" disabled>지금 플레이 중</button>':`<button class="primary" type="button" data-play="${i}">이어하기</button>`}
      ${here?'':`<button class="ghost" type="button" data-del="${i}">${delAsk===i?'정말 지우기':'지우기'}</button>`}</div></div>`}
  h+='</div>';
  if(empty>=0){h+='<h2>새 캐릭터 만들기</h2><div class="classes">';
    for(const k in CLASSES){const C=CLASSES[k];h+=`<button class="cls" type="button" data-cls="${k}" data-slot="${empty}"><b>${C.n}</b><span>${C.desc}</span><em>스킬 트리: ${C.trees.join(', ')} · 첫 마법: ${SPELLS[C.start[0]].n}</em></button>`}
    h+='</div><p class="muted" style="margin-top:8px">새 캐릭터는 빈 칸에 따로 저장됩니다. 다른 캐릭터는 그대로 남습니다.</p>'}
  else h+='<p class="muted">캐릭터 칸이 가득 찼습니다(8명). 새로 만들려면 하나를 지우세요.</p>';
  box.innerHTML=h;
  if(inGame)$('#go').onclick=()=>{$('#intro').hidden=true;paused=false};
  box.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{save();const i=+b.dataset.play;load(readSlot(i),i);$('#intro').hidden=true;paused=false;msg('다시 모험을 이어갑니다','#d6b262')});
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const i=+b.dataset.del;if(delAsk!==i){delAsk=i;introButtons(resume);return}delAsk=-1;try{localStorage.removeItem(SLOTKEY(i));if(i===0)localStorage.removeItem(KEY)}catch(_){}introButtons(resume)});
  box.querySelectorAll('[data-cls]').forEach(b=>b.onclick=()=>{if(inGame)save();newGame(b.dataset.cls,+b.dataset.slot)});
}

