/* ---------- v45 휴대폰 화면·조작 개선 3 · 둘째 묶음 (사용자 2026-10-24 14:48Z 「14빼고 이번 패치에 반영해줘.」) ----------
   이 파일은 제안 3의 2 · 6 · 7 · 10 · 15 · 16. (1 · 3 · 4 · 5 · 8 · 9 · 11 · 12 · 13은 다른 파일.) 게임 수치 · 드랍 · 경험치 · 물약 대기시간은 그대로, 화면과 조작만.
   2 점수 빨리 넣기: 능력치 +1/+5 · 스킬 트리 +(그림 옆 + · 설명 칸 「+1 포인트」)를 꾹 누르면 0.4초 뒤부터 점점 빠르게 계속 찍힌다(PC 마우스도).
     찍는 길은 손으로 누를 때와 같다(단추를 대신 누름 · 막히면 멈춤). 한 번 짧게 누르기는 지금처럼 1번.
     「남은 점수 모두 넣기」(능력치를 고른 뒤) · 「직업 추천 비율로 나누기」: 둘 다 미리 보기를 보여 주고 「넣기」「나누기」를 눌러야 들어간다.
     추천 비율(UXB.RATIO · 세부-설정-기록에 정해진 값이 없어 기본안): 마법사 지능 60 · 활력 20 · 정신 20 / 사제 지능 50 · 활력 25 · 정신 25 /
       전사 힘 50 · 민첩 15 · 활력 25 · 정신 10 / 궁수 민첩 60 · 힘 10 · 활력 20 · 정신 10. 비율대로 버림하고 남는 점수(1~3점)는 주 능력치에.
   6 가로 화면 캐릭터 창 두 칸(가로 휴대폰 m22L에서만): 왼쪽 이름 · 능력치 · 방어력 · 착용 장비 · 물약, 오른쪽 가방(칸 · 목록). 두 칸은 따로 넘긴다.
     가방 장비를 누르면 원래 쪽지(착용 중인 장비와 비교)가 뜨고, 왼쪽의 같은 착용 칸이 금색 테두리로 빛난다. 세로 · PC는 지금 그대로 한 줄.
   7 가방 정렬 + 「새」: 가방 제목 옆 「정렬」 → 종류(무기 · 보조 · 옷 · 모자 · 반지 · 목걸이) → 등급(높은 것 먼저) → 레벨(높은 것 먼저).
     땅에서 새로 주운 장비는 it.n45=1 → 가방 칸 · 목록에 작은 「새」. 캐릭터 창에서 한 번 본 뒤 창을 닫거나 다른 탭으로 가면 지운다.
     (n45는 가방 물건에 붙어 함께 저장되고, 없으면 새것 아님 · 다른 파일의 빨간 점이 읽어도 됨)
   10 스킬 단추 꾹 눌러 설명(휴대폰): 단축칸 스킬을 0.5초 누르면 쪽지(이름 · 마나 · 재사용 · 시전 · 짧은 설명). 손을 떼도 시전하지 않고 쪽지는 1.5초 뒤 사라짐.
     단축칸 옮기기(feedback28 · mobile30 꾹 눌러 옮기기)는 설정 ⚙ 「배치 바꾸기」를 켰을 때만. 켜 둔 동안은 예전처럼 꾹 눌러 옮기고, 위쪽 「배치 바꾸기 끝」으로 끈다.
     「위치 되돌리기」는 그대로. 기록창 · 의뢰 알림판의 꾹 눌러 옮기기는 그대로(스킬 단추와 안 겹침). 배치 바꾸기 켬/끔은 저장하지 않음(다시 켜면 처음엔 끔).
     짧게 누르기는 예전과 똑같이 손을 뗄 때 시전, 12px 넘게 움직이면 시전 안 함. 손가락 움직임(touchmove · pointermove)은 막지 않는다(나중에 땅 마법 끌어서 자리 정하기를 붙일 자리).
   15 장비 묶음 2개: 캐릭터 창 착용 칸 아래 「묶음 1/2 저장」(지금 착용 장비) · 「묶음 1/2 입기」(가방에서 한 번에 갈아입기 · 착용 단추와 같은 길).
     가방에 없는 물건은 건너뛰고 이름을 알려 준다. 묶음에 없는 칸은 그대로 둔다. 이미 저장한 묶음을 다시 저장할 때는 한 번 더 눌러야 덮어쓴다.
     저장: 새 필드 gs45 = [{칸:{id,n}} | null, …](하나라도 있을 때만) · 없으면 빈 묶음 두 개 · 모르는 값은 버리지 않고 칸 이름 그대로.
   16 물약 꾹 눌러 등급 고르기(휴대폰): 생명 · 마나 물약 단추를 0.5초 누르면 가진 등급이 동그랗게 펼쳐진다. 손가락을 끌어 놓거나, 손을 뗀 뒤 눌러 고른다.
     마시는 길은 usePotion(→ drinkPotion · 같은 재사용 대기 · 같은 3초 회복)이고 등급만 고른 것으로. 한 번 누르기는 지금처럼 가장 좋은 등급.
   꾹 누르기끼리: 단축칸(10 · 16)은 window 붙잡기 단계에서 먼저 받아 feedback28의 옮기기로 넘어가지 않게 한다(배치 바꾸기 켬이면 넘김).
     능력치 · 스킬 +(2)는 창 안 단추라 단축칸과 따로. 가방 칸 꾹 누르기(장비 쪽지)는 그대로.
   P3(4차 목록) 화면 누르기 기술 좌/우: 휴대폰 단축칸 끝(물약 옆)에 작은 「좌/우」 단추. 화면 오른쪽 누르기(fireTouch)가 쓰는 칸을 첫째 칸(좌) ↔ 둘째 칸(우)으로 바꾼다.
     이 기기에 저장(arseia-device-v28의 fire: 1이면 우, 없으면 좌). 겨누는 곳 · 시전 길(castSlot)은 그대로이고 칸 번호만 바뀐다. PC 좌 · 우 클릭은 그대로.
   P4(4차 목록) 설정 ⚙ 「단축칸: 한 줄 넘기기(지금 · 기본) · 두 줄 전부(PC처럼)」: 두 줄이면 가로 휴대폰에서 쪽 넘기기 없이 PC처럼 13칸 + 8칸(빈 칸도) +
     추가 단축바 줄(bar44 설정대로)을 두 구슬 사이에 보인다. 칸 크기는 들어가는 만큼 줄이되 40px 아래로는 안 줄인다(모자라면 다음 줄로).
     이 기기에 저장(bar2: 1이면 두 줄, 없으면 한 줄). 세로 휴대폰은 지금처럼 든 칸이 모두 보이는 그대로.
   손가락 끌기(4차 P2 · mux45.js)와: 이 파일은 단축칸 pointerdown을 document 붙잡기에서 stopPropagation만 한다(같은 document의 뒤 듣개는 받음).
     12px 넘게 움직이면 짧게 누르기 시전을 하지 않고, pointermove는 막지 않는다. 지금 누른 손가락 상태는 UXB.bars(Map).
   Q1(5차 목록) 단축칸 꾹 = 계속 쓰기: 마을 밖에서 휴대폰 스킬 칸을 누르고 있으면 PC 키를 누른 것처럼 매 프레임 castSlot(겨눔 · tap20 채널링 규칙 그대로).
     재사용 1초 이상 겨누는 마법은 0.15초 가만히 있어야 시작(끌어서 겨누기 몫) · 12px 넘게 움직이면 멈춤 · 물약 칸은 아님.
     10번 설명 쪽지는 ux45TipOk()(마을 안전 지대 · 스킬 트리 창 · 배치 바꾸기)일 때만 — 나중에 바꿀 때 이 함수 한 줄만.
   Q2(5차) 버프 다시 걸기 알림: 내가 건 버프 5초 남음 → 그 단축칸 깜빡 · 끝나면 버프 옆 「다시」 6초(castSlot 길 · 저절로 안 걸림) · 설정 켬/끔(기기 키 rb:0이면 끔).
   Q9(5차) 큰 기술 준비 반짝: 이번 재사용이 30초 이상이던 마법이 준비되면 그 칸 한 번 반짝 · 안 보이는 쪽이면 쪽 단추가 반짝.
   붙는 곳: fix44.js 다음, tap20.js 앞(b5.js 앞이라 panel · pbody · tab · barPT는 함수 안에서만). */
const UXB={edit:0,fire:0,bar2:0,rb:1,SZ_MIN:40,SZ_MAX:44,LP:500,TIP_HIDE:1500,MOVE:12,HOLD_AIM:.15,AIM_CD:1,RB_LOW:5,RB_MINMAX:10,RB_SHOW:6000,RDY_CD:30,RDY_MS:1000,REP0:400,REP1:200,REPK:.8,REPMIN:40,RAD_R:84,RAD_IDLE:6000,
  RATIO:{mage:{int:60,vit:20,spi:20},priest:{int:50,vit:25,spi:25},warrior:{str:50,dex:15,vit:25,spi:10},archer:{dex:60,str:10,vit:20,spi:10}},
  KIND:['staff','off','robe','hat','ring','amulet'],GS_N:2,
  pick:null,bars:new Map(),mine:null,tipT:0,rad:null,radT:0,forceT:null,rep:null,eat:0,repClick:0,seen:new Set(),gsArm:-1,gsArmT:0,
  rbHad:new Set(),rbMax:{},rbBtn:new Map(),low:new Set(),cdWas:{},cdMax:{},rdy:new Map(),markP:null,markSig:''};
const uxbEsc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const uxbStatN=k=>(typeof STAT_N==='object'&&STAT_N[k])||({int:'지능',vit:'활력',spi:'정신',str:'힘',dex:'민첩'})[k]||k;
const uxbPanelOn=()=>typeof panel!=='undefined'&&!panel.hidden;

/* ===== 2 점수 빨리 넣기 ===== */
function uxbRatio(cls){const keys=(typeof STAT_KEYS==='object'&&STAT_KEYS[cls])||['int','vit','spi'],r=UXB.RATIO[cls]||{},o={};for(const k of keys)o[k]=r[k]>0?r[k]:0;if(!keys.some(k=>o[k]>0))o[keys[0]]=1;return o}
// 비율대로 나눠 버림하고, 남는 점수(칸 수보다 적음)는 모두 주 능력치(첫 칸)에
function uxbSplit(n,ratio){n=Math.max(0,n|0);const ks=Object.keys(ratio),sum=ks.reduce((a,k)=>a+ratio[k],0)||1,out={};let used=0;
  for(const k of ks){out[k]=Math.floor(n*ratio[k]/sum+1e-9);used+=out[k]}const main=ks.find(k=>ratio[k]>0)||ks[0];out[main]+=n-used;return out}
function uxbPlan(){const pk=UXB.pick;if(!pk||!P||!(P.ap>0))return null;if(pk.k==='all')return pk.stat?{[pk.stat]:P.ap|0}:null;return uxbSplit(P.ap,uxbRatio(P.cls))}
function uxbApHtml(){if(!P||!P.cls||!(P.ap>0)){UXB.pick=null;return ''}const pk=UXB.pick,keys=Object.keys(uxbRatio(P.cls));
  if(!pk)return `<div class="ux45ap"><button type="button" class="ghost" data-ux45ap="all">남은 점수 모두 넣기</button><button type="button" class="ghost" data-ux45ap="ratio">직업 추천 비율로 나누기</button></div>`;
  if(pk.k==='all'&&!pk.stat)return `<div class="ux45ap on"><div class="ux45q">남은 점수 ${P.ap}점을 어느 능력치에 모두 넣을까요?</div><div class="ux45row">${keys.map(k=>`<button type="button" data-ux45ap="stat" data-k="${k}">${uxbStatN(k)}</button>`).join('')}<button type="button" class="ghost" data-ux45ap="no">취소</button></div></div>`;
  const add=uxbPlan()||{},R=uxbRatio(P.cls),C=CLASSES[P.cls];pk.ap=P.ap|0;
  const head=pk.k==='all'?`${uxbStatN(pk.stat)}에 남은 점수 ${P.ap}점을 모두 넣어요`:`${C&&C.n||''} 추천 비율(${keys.filter(k=>R[k]>0).map(k=>uxbStatN(k)+' '+R[k]).join(' · ')})로 남은 점수 ${P.ap}점을 나눠요`;
  const rows=keys.filter(k=>add[k]>0).map(k=>`<div><span>${uxbStatN(k)}</span><b>${P.st[k]|0} → ${(P.st[k]|0)+add[k]}</b><i>+${add[k]}</i></div>`).join('');
  return `<div class="ux45ap on"><div class="ux45q">${head}</div><div class="ux45pv">${rows}</div><div class="ux45row"><button type="button" data-ux45ap="ok">${pk.k==='all'?'넣기':'나누기'}</button><button type="button" class="ghost" data-ux45ap="no">취소</button></div><div class="muted ux45n">한 번 넣은 점수는 상점의 망각의 물약으로만 되돌릴 수 있어요</div></div>`}
function uxbApApply(){const pk=UXB.pick;if(!pk||!P)return false;if((P.ap|0)!==pk.ap){renderPanel();return false}// 그사이 점수가 바뀌면 다시 미리 보기
  const add=uxbPlan();if(!add)return false;let n=0;for(const k in add){const v=add[k]|0;if(v>0&&k in P.st){P.st[k]+=v;n+=v}}P.ap-=n;UXB.pick=null;renderPanel();save();
  msg(`능력치에 ${n}점을 넣었습니다 (${Object.keys(add).filter(k=>add[k]>0).map(k=>uxbStatN(k)+' +'+add[k]).join(' · ')})`,'#ffd76a');return true}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#pbody [data-ux45ap]');if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.ux45ap;
  if(a==='all')UXB.pick={k:'all'};else if(a==='ratio')UXB.pick={k:'ratio'};else if(a==='stat'&&UXB.pick)UXB.pick.stat=b.dataset.k;else if(a==='no')UXB.pick=null;else if(a==='ok'){uxbApApply();return}renderPanel()},true);
// 꾹 눌러 계속 찍기: 찍는 일은 늘 지금 화면의 같은 단추를 대신 누른다(막힌 단추면 멈춤)
const UXB_REP='#pbody button[data-stat],#pbody button[data-learn]';
function uxbRepBtn(r){const pb=document.getElementById('pbody');if(!pb)return null;const L=[...pb.querySelectorAll(r.sel)];return L.find(b=>r.cls&&b.classList.contains(r.cls))||L[0]||null}
function uxbRepOk(r,b){if(!b||b.disabled||b.getAttribute('aria-disabled')==='true')return false;if(r.learn&&!(typeof canLearn==='function'&&canLearn(r.learn)))return false;if(r.stat&&!(P.ap>=Math.min(+r.q||1,1)))return false;return true}
function uxbRepTick(){const r=UXB.rep;if(!r)return;const b=uxbRepBtn(r);if(!uxbRepOk(r,b)){r.stop=1;return}
  UXB.repClick=1;try{b.click()}finally{UXB.repClick=0}r.n++;r.timer=setTimeout(uxbRepTick,Math.max(UXB.REPMIN,UXB.REP1*Math.pow(UXB.REPK,r.n-1)))}
function uxbRepEnd(){const r=UXB.rep;if(!r)return;clearTimeout(r.timer);UXB.rep=null;if(r.n>0)UXB.eat=performance.now()+450}
document.addEventListener('pointerdown',e=>{if(e.button>0)return;UXB.eat=0;const b=e.target&&e.target.closest&&e.target.closest(UXB_REP);if(!b||b.disabled||b.getAttribute('aria-disabled')==='true')return;uxbRepEnd();
  const r={pid:e.pointerId,x:e.clientX,y:e.clientY,n:0,stop:0,cls:b.classList.contains('nodeplus')?'nodeplus':''};
  if(b.dataset.stat!=null){r.stat=b.dataset.stat;r.q=b.dataset.q;r.sel=`button[data-stat="${r.stat}"][data-q="${r.q}"]`}else{r.learn=b.dataset.learn;r.sel=`button[data-learn="${r.learn}"]`}
  UXB.rep=r;r.timer=setTimeout(uxbRepTick,UXB.REP0)},true);
addEventListener('pointermove',e=>{const r=UXB.rep;if(r&&r.pid===e.pointerId&&Math.hypot(e.clientX-r.x,e.clientY-r.y)>10)uxbRepEnd()},true);
for(const ev of ['pointerup','pointercancel'])addEventListener(ev,e=>{const r=UXB.rep;if(r&&r.pid===e.pointerId)uxbRepEnd()},true);
// 계속 찍은 뒤 손을 떼며 생기는 click은 버린다(한 점 더 찍히지 않게)
document.addEventListener('click',e=>{if(UXB.repClick||performance.now()>UXB.eat)return;const b=e.target&&e.target.closest&&e.target.closest(UXB_REP);if(!b&&!(e.target&&e.target.closest&&e.target.closest('#pbody')))return;UXB.eat=0;e.preventDefault();e.stopImmediatePropagation()},true);
document.addEventListener('contextmenu',e=>{const t=e.target&&e.target.closest&&e.target.closest(UXB_REP+',#ux45rad');if(t)e.preventDefault()},true);

/* ===== 7 가방 정렬 + 「새」 ===== */
function uxbSortKey(it){const i=UXB.KIND.indexOf(it&&it.slot);return i<0?99:i}
function uxbSortBag(){if(!P||!Array.isArray(P.bag))return false;P.bag.sort((a,b)=>uxbSortKey(a)-uxbSortKey(b)||(b.rar|0)-(a.rar|0)||(b.il|0)-(a.il|0)||String(a.name||'').localeCompare(String(b.name||''),'ko'));
  if(uxbPanelOn())renderPanel();save();msg('가방을 정렬했습니다 (종류 → 등급 → 레벨)','#d6c7a1');return true}
// 땅에서 주운 장비에 「새」 표시 (가방이 가득 차 못 주우면 지움)
{const _pk=pickup;pickup=function(l){const it=l&&l.kind!=='gold'&&l.kind!=='tp'&&l.kind!=='hp'&&l.kind!=='mp'&&l.item;let had=false;
  try{if(it){had=!!it.n45;it.n45=1}}catch(_){}const r=_pk.apply(this,arguments);try{if(it&&!had&&!(l.taken&&P.bag.includes(it)))delete it.n45}catch(err){if(window.__QA)throw err}return r}}
function uxbSeenClear(){if(!UXB.seen.size)return;try{for(const it of P.bag||[])if(it&&UXB.seen.has(it.id))delete it.n45}catch(_){}UXB.seen.clear()}
function uxbNewMarks(){const pb=document.getElementById('pbody'),on=uxbPanelOn();for(const it of P.bag||[]){if(!it||!it.n45)continue;if(on)UXB.seen.add(it.id);
  const c=pb.querySelector(`.bagc[data-bagcell="${it.id}"]`);if(c&&!c.querySelector('.ux45new'))c.insertAdjacentHTML('beforeend','<span class="ux45new" aria-label="새로 주움">새</span>');
  const row=pb.querySelector(`.item[data-iid="${it.id}"] .nm`);if(row&&!row.querySelector('.ux45new'))row.insertAdjacentHTML('afterbegin','<span class="ux45new">새</span> ')}}

/* ===== 15 장비 묶음 ===== */
function uxbGsClean(v){const out=Array(UXB.GS_N).fill(null);if(!Array.isArray(v))return out;
  for(let i=0;i<UXB.GS_N;i++){const s=v[i];if(!s||typeof s!=='object'||Array.isArray(s))continue;const o={};
    for(const k in s){const x=s[k];if(x&&typeof x==='object'&&Number.isFinite(+x.id))o[k]={id:+x.id,n:String(x.n==null?'':x.n).slice(0,80)}}if(Object.keys(o).length)out[i]=o}return out}
function uxbGs(){if(!P)return Array(UXB.GS_N).fill(null);if(!Array.isArray(P.gs45))P.gs45=Array(UXB.GS_N).fill(null);return P.gs45}
function uxbGsSave(i){const g=uxbGs(),o={};for(const sl in P.gear){const it=P.gear[sl];if(it&&it.id!=null)o[sl]={id:it.id,n:typeof itemName==='function'?itemName(it):it.name}}
  if(!Object.keys(o).length){msg('착용한 장비가 없어 묶음에 넣을 것이 없습니다','#a39d8f');return false}g[i]=o;UXB.gsArm=-1;save();msg(`장비 묶음 ${i+1}에 지금 장비 ${Object.keys(o).length}개를 저장했습니다`,'#d6b262');if(uxbPanelOn())renderPanel();return true}
// 착용은 캐릭터 창의 「착용」 단추와 같은 길(직업 · 두 손 무기 · 방패 규칙 그대로)
function uxbEquipVia(it,sl){const pb=document.getElementById('pbody');if(!pb)return false;const b=document.createElement('button');b.type='button';b.hidden=true;b.dataset.equip=it.id;if(sl==='ring'||sl==='ring2')b.dataset.eqsl=sl;pb.appendChild(b);try{b.click()}finally{b.remove()}return P.gear[sl]===it}
function uxbGsWear(i){const set=uxbGs()[i];if(!set){msg(`장비 묶음 ${i+1}이 비어 있습니다`,'#a39d8f');return null}const miss=[],got=[],said=[];const keep=msg;
  msg=function(t,c){said.push([t,c])};
  try{for(const sl of Object.keys(set)){if(!P.gear||!(sl in P.gear))continue;const w=set[sl],cur=P.gear[sl];if(!w||cur&&cur.id===w.id)continue;
      const other=Object.keys(P.gear).find(k=>k!==sl&&P.gear[k]&&P.gear[k].id===w.id);
      if(other){if(/^ring2?$/.test(sl)&&/^ring2?$/.test(other)){const a=P.gear[other];P.gear[other]=cur||null;P.gear[sl]=a;got.push(a)}continue}// 반지 1 ↔ 2
      const it=P.bag.find(x=>x&&x.id===w.id);if(!it){miss.push(w.n||'장비');continue}if(uxbEquipVia(it,sl))got.push(it)}}
  finally{msg=keep}
  for(const [t,c] of said)if(!/ 착용$/.test(String(t)))msg(t,c);
  P.hp=Math.min(P.hp,maxHp());P.mp=Math.min(P.mp,maxMp());buildBar();if(uxbPanelOn())renderPanel();save();
  msg(got.length?`장비 묶음 ${i+1}로 갈아입었습니다 (${got.length}개)`:`장비 묶음 ${i+1}: 이미 그대로 입고 있습니다`,'#d6b262');
  if(miss.length)msg(`가방에 없어 건너뛴 것 ${miss.length}개: ${miss.join(', ')}`,'#ff8a7a');return {got:got.length,miss}}
function uxbGsHtml(){if(!P||!P.gear)return '';const g=uxbGs(),now=performance.now();if(UXB.gsArm>=0&&now-UXB.gsArmT>4000)UXB.gsArm=-1;
  let h='<div class="ux45gs"><span class="ux45gsh">장비 묶음</span>';
  for(let i=0;i<UXB.GS_N;i++){const s=g[i],n=s?Object.keys(s).length:0,names=s?Object.values(s).map(x=>x.n).join(', '):'';
    h+=`<span class="ux45g"><button type="button" data-ux45gw="${i}" ${n?'':'disabled'} title="${uxbEsc(n?`묶음 ${i+1}: ${names}`:`묶음 ${i+1}이 비어 있습니다`)}">묶음 ${i+1} 입기${n?` <small>${n}</small>`:''}</button><button type="button" class="ghost" data-ux45gs="${i}">${UXB.gsArm===i?'덮어쓸까요?':'저장'}</button></span>`}
  return h+'<div class="muted ux45n">지금 착용한 장비를 묶음에 저장하고, 가방에서 한 번에 갈아입어요. 가방에 없는 물건은 건너뛰어요</div></div>'}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#pbody [data-ux45gw],#pbody [data-ux45gs]');if(!b||b.disabled)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.ux45gw!=null){uxbGsWear(+b.dataset.ux45gw);return}const i=+b.dataset.ux45gs;
  if(uxbGs()[i]&&!(UXB.gsArm===i&&performance.now()-UXB.gsArmT<=4000)){UXB.gsArm=i;UXB.gsArmT=performance.now();renderPanel();return}uxbGsSave(i)},true);
{const _gg=gearGridHtml;gearGridHtml=function(){const h=_gg.apply(this,arguments);try{return h+uxbGsHtml()}catch(err){if(window.__QA)throw err;return h}}}
{const _fp=freshPlayer;freshPlayer=function(){const p=_fp.apply(this,arguments);try{if(p)p.gs45=Array(UXB.GS_N).fill(null)}catch(err){if(window.__QA)throw err}return p}}
{const _ld=load;load=function(d){const g=uxbGsClean(d&&d.gs45),r=_ld.apply(this,arguments);try{if(r&&P)P.gs45=g;UXB.seen.clear();UXB.pick=null}catch(err){if(window.__QA)throw err}return r}}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{const g=P&&P.gs45;if(d&&Array.isArray(g)&&g.some(Boolean))d.gs45=JSON.parse(JSON.stringify(g))}catch(err){if(window.__QA)throw err}return d}}

/* ===== 6 가로 화면 캐릭터 창 두 칸 + 창 그린 뒤 붙이기(2 · 7) ===== */
function uxbColScroll(){const pb=document.getElementById('pbody'),l=pb&&pb.querySelector('.ux45l'),r=pb&&pb.querySelector('.ux45r');return l&&r?{l:l.scrollTop,r:r.scrollTop}:null}
function uxbCols(prev){const card=panel.querySelector('.card'),pb=pbody,on=M22.mode()==='L'&&tab==='char';if(card)card.classList.toggle('ux45two',false);if(!on)return false;
  const kids=[...pb.children],i=kids.findIndex(e=>e.tagName==='H2'&&/^가방/.test(e.textContent.trim()));if(i<1)return false;
  const wrap=document.createElement('div'),L=document.createElement('div'),R=document.createElement('div');wrap.className='ux45cols';L.className='ux45l';R.className='ux45r';
  kids.forEach((e,j)=>(j<i?L:R).appendChild(e));wrap.append(L,R);pb.appendChild(wrap);if(card)card.classList.add('ux45two');
  if(prev){L.scrollTop=prev.l;R.scrollTop=prev.r}return true}
function uxbAfterRender(prev){if(tab!=='char'||!P||!P.cls){uxbSeenClear();UXB.pick=null;const c=panel.querySelector('.card');if(c)c.classList.remove('ux45two');return}
  const pb=pbody,attrs=pb.querySelectorAll(':scope>.attr');if(attrs.length){const h=uxbApHtml();if(h)attrs[attrs.length-1].insertAdjacentHTML('afterend',h)}
  const bh=[...pb.querySelectorAll(':scope>h2')].find(e=>/^가방/.test(e.textContent.trim()));
  if(bh&&P.bag.length>1&&!bh.querySelector('.ux45sort'))bh.insertAdjacentHTML('beforeend',' <button type="button" class="ghost ux45sort" data-ux45sort="1" title="종류 → 등급 → 레벨 순서로 정렬">정렬</button>');
  uxbNewMarks();uxbCols(prev);
  const box=UXB.pick&&pb.querySelector('.ux45ap.on');if(box){const sc=box.closest('.ux45l')||panel.querySelector('.card'),br=box.getBoundingClientRect(),sr=sc.getBoundingClientRect();if(br.bottom>sr.bottom)sc.scrollTop+=Math.min(br.bottom-sr.bottom+8,br.top-sr.top)}}
{const _rp=renderPanel;renderPanel=function(){const prev=uxbColScroll(),r=_rp.apply(this,arguments);try{uxbAfterRender(prev)}catch(err){if(window.__QA)throw err}return r}}
{const _cp=closePanel;closePanel=function(){const r=_cp.apply(this,arguments);try{uxbSeenClear();UXB.pick=null;UXB.eat=0;uxbRepEnd();uxbCmpOff()}catch(err){if(window.__QA)throw err}return r}}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#pbody [data-ux45sort]');if(!b)return;e.preventDefault();e.stopPropagation();uxbSortBag()},true);
// 가방 칸을 누르면(쪽지가 뜰 때) 왼쪽의 같은 착용 칸을 빛낸다
function uxbCmpOff(){for(const el of document.querySelectorAll('#pbody .ux45cmp'))el.classList.remove('ux45cmp')}
function uxbCmpOn(cell){uxbCmpOff();const it=P&&P.bag.find(x=>x&&x.id===+cell.dataset.bagcell);if(!it||typeof gearDest!=='function')return null;const sl=gearDest(it),g=pbody.querySelector(`.ux45l .geqc[data-geq="${sl}"]`);if(!g)return null;
  g.classList.add('ux45cmp');const L=g.closest('.ux45l'),gr=g.getBoundingClientRect(),lr=L.getBoundingClientRect();if(gr.top<lr.top||gr.bottom>lr.bottom){UXB.selfScroll=performance.now()+350;L.scrollTop+=gr.top-lr.top-(lr.height-gr.height)/2}return sl}
document.addEventListener('click',e=>{const c=e.target&&e.target.closest&&e.target.closest('#pbody .ux45r [data-bagcell]');if(!c){if(!(e.target&&e.target.closest&&e.target.closest('#itip')))setTimeout(()=>{if(typeof TIP==='object'&&!TIP.cur)uxbCmpOff()},0);return}
  setTimeout(()=>{try{if(typeof TIP==='object'&&TIP.cur===c)uxbCmpOn(c);else uxbCmpOff()}catch(err){if(window.__QA)throw err}},0)},true);
// 왼쪽 칸을 이 파일이 넘길 때 생기는 scroll로 쪽지가 닫히지 않게(gear21은 어떤 scroll에도 쪽지를 닫음)
addEventListener('scroll',e=>{if(performance.now()<(UXB.selfScroll||0)&&e.target&&e.target.classList&&e.target.classList.contains('ux45l')&&typeof TIP==='object'&&TIP.cur){UXB.keepTip=1;setTimeout(()=>{UXB.keepTip=0},0)}},true);
{const _th=tipHide;tipHide=function(){if(UXB.keepTip){UXB.keepTip=0;return}const r=_th.apply(this,arguments);try{uxbCmpOff()}catch(_){}return r}}

/* ===== 10 · 16 단축칸 꾹 누르기 (휴대폰) ===== */
// 붙잡기 단계 window에서 먼저 받는다: feedback28(document 붙잡기)의 옮기기는 FB28.replay로 건너뛰게 하고, 그 뒤의 document 붙잡기에서 이 손가락을 맡는다.
// 단축칸이 다시 그려져(buildBar) 누른 단추가 바뀌었으면 같은 칸의 새 단추
function uxbLive(b){if(!b||b.isConnected)return b;if(b.id)return document.getElementById(b.id);if(b.dataset.slot!=null)return document.querySelector(`#bar [data-slot="${b.dataset.slot}"]`);if(b.dataset.pot)return document.querySelector(`#bar [data-pot="${b.dataset.pot}"]`);return null}
const uxbBarOn=e=>!UXB.edit&&e.pointerType==='touch'&&typeof M22==='object'&&M22.phone()&&!FB28.replay&&e.target&&e.target.closest&&!!e.target.closest('#bar');
addEventListener('pointerdown',e=>{if(!uxbBarOn(e))return;UXB.mine=e;FB28.replay=true;setTimeout(()=>{if(UXB.mine===e){UXB.mine=null;FB28.replay=false}},0)},true);
document.addEventListener('pointerdown',e=>{if(UXB.mine!==e)return;UXB.mine=null;FB28.replay=false;try{barPT='touch'}catch(_){}e.preventDefault();e.stopPropagation();
  const b=e.target.closest('button'),s={pid:e.pointerId,x:e.clientX,y:e.clientY,b,lp:'',cancel:false,hold:null,i:-1,w:0,fired:0};UXB.bars.set(e.pointerId,s);uxbTipHide(true);
  // Q1 싸움 중(설명 쪽지를 쓰는 곳이 아니면) 스킬 칸 꾹 = PC 키처럼 매 프레임 castSlot.
  // 재사용 1초 이상인 겨누는 마법만 0.15초 가만히 있어야 시작(그 한 방은 끌어서 겨누기에 남김 · 12px 넘게 움직이면 시작 안 함). 연달아 쏘는 짧은 재사용 마법은 바로
  {const i=b&&b.dataset.slot!=null?+b.dataset.slot:-1,id=i>=0&&P&&P.bar[i];if(id&&SPELLS[id]&&!bindId&&!ux45TipOk()){s.i=i;s.hold=uxbAimable(id)&&cdOf(id)>=UXB.AIM_CD?'wait':'on';return}}
  s.timer=setTimeout(()=>{const b=uxbLive(s.b);if(UXB.bars.get(s.pid)!==s||s.cancel||!b)return;
    if(b.dataset.slot!=null&&!bindId&&P&&P.bar[+b.dataset.slot]&&SPELLS[P.bar[+b.dataset.slot]]){s.lp='tip';uxbTipShow(b,P.bar[+b.dataset.slot])}
    else if(b.dataset.pot==='hp'||b.dataset.pot==='mp')s.lp=uxbRadOpen(b,b.dataset.pot)?'pot':'done';// 물약이 없으면 알림만(손을 떼도 다시 안 마심)
    if(s.lp==='tip'||s.lp==='pot')try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}},UXB.LP)},true);
addEventListener('pointermove',e=>{const s=UXB.bars.get(e.pointerId);if(!s)return;
  if(!s.lp){if(Math.hypot(e.clientX-s.x,e.clientY-s.y)>UXB.MOVE){s.cancel=true;s.hold=null;clearTimeout(s.timer)}return}
  if(s.lp==='pot')uxbRadHover(e.clientX,e.clientY)},true);
function uxbBarUp(e){const s=UXB.bars.get(e.pointerId);if(!s)return;UXB.bars.delete(e.pointerId);clearTimeout(s.timer);if(e.cancelable)e.preventDefault();FB28.blockedUntil=performance.now()+500;
  if(s.lp==='tip'){uxbTipHide();return}if(s.lp==='done')return;
  if(s.lp==='pot'){const o=e.type==='pointerup'?uxbRadAt(e.clientX,e.clientY):null;if(o)uxbRadPick(o);else if(UXB.rad)UXB.rad.held=false;return}
  if(s.fired)return;// Q1 꾹 누르는 동안 이미 나감: 뗄 때 한 번 더 안 나감
  const b=uxbLive(s.b);if(!s.cancel&&e.type==='pointerup'&&b){FB28.replay=true;try{barPress(b)}finally{FB28.replay=false}}}
addEventListener('pointerup',uxbBarUp,true);addEventListener('pointercancel',uxbBarUp,true);
// 10 스킬 설명 쪽지
function uxbTipEl(){let el=document.getElementById('ux45tip');if(!el){el=document.createElement('div');el.id='ux45tip';el.hidden=true;el.setAttribute('role','tooltip');document.body.appendChild(el)}return el}
function uxbShort(t){t=String(t||'').replace(/\s+/g,' ').trim();const m=/^(.+?(?:다|요)\.)(\s|$)/.exec(t);let s=m?m[1]:t;if(s.length>90)s=s.slice(0,88)+'…';return s}
function uxbTipHtml(id){const s=SPELLS[id],L=Math.max(1,skLv(id)),cd=Math.round(cdOf(id)*100)/100,ci=typeof castInfo==='function'?castInfo(id,L):'';
  return `<div class="t">${uxbEsc(s.n)}${skLv(id)?` <small>Lv${skLv(id)}</small>`:''}</div><div class="k">마나 ${costOf(id)} · 재사용 ${cd>0?cd+'초':'없음'}${ci?' · '+uxbEsc(ci):''}</div><div class="d">${uxbEsc(uxbShort(s.desc))}</div>`}
function uxbTipShow(b,id){const el=uxbTipEl();el.innerHTML=uxbTipHtml(id);el.hidden=false;el.dataset.id=id;clearTimeout(UXB.tipT);
  const r=b.getBoundingClientRect(),w=el.offsetWidth,h=el.offsetHeight,vw=innerWidth,m=8;let x=clamp(r.left+r.width/2-w/2,m,Math.max(m,vw-m-w)),y=r.top-h-10;if(y<m)y=Math.min(innerHeight-h-m,r.bottom+10);
  el.style.left=Math.round(x)+'px';el.style.top=Math.round(y)+'px';return el}
function uxbTipHide(now){const el=document.getElementById('ux45tip');if(!el||el.hidden)return;clearTimeout(UXB.tipT);if(now){el.hidden=true;return}UXB.tipT=setTimeout(()=>{el.hidden=true},UXB.TIP_HIDE)}
// 16 물약 등급 고르기
function uxbRadEl(){let el=document.getElementById('ux45rad');if(!el){el=document.createElement('div');el.id='ux45rad';el.hidden=true;el.setAttribute('role','menu');document.body.appendChild(el);
    el.addEventListener('click',e=>{const o=e.target.closest('[data-ux45t]');if(o){e.stopPropagation();uxbRadPick(o)}})}return el}
function uxbRadOpen(b,k){const tiers=[];for(let T=0;T<POT_T.length;T++)if(potN(k,T)>0)tiers.push(T);if(!tiers.length){msg(k==='hp'?'생명력 물약이 없습니다':'마나 물약이 없습니다','#a39d8f');return false}
  const el=uxbRadEl(),r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,n=tiers.length,R=UXB.RAD_R,m=30;
  el.innerHTML=tiers.map((T,i)=>{const a=n===1?-Math.PI/2:Math.PI*(1.15+.7*i/(n-1)),x=clamp(cx+Math.cos(a)*R,m,innerWidth-m),y=clamp(cy+Math.sin(a)*R,m,innerHeight-m);
    return `<button type="button" class="ux45o ${k}" data-ux45t="${T}" data-k="${k}" style="left:${Math.round(x)}px;top:${Math.round(y)}px" aria-label="${uxbEsc(potName(k,T))} ${potN(k,T)}개">${miscIcon(k+T,26)}<b>${potN(k,T)}</b><small>${POT_T[T].n}</small></button>`}).join('')+
    `<span class="ux45rc" style="left:${Math.round(cx)}px;top:${Math.round(cy)}px">${k==='hp'?'생명':'마나'}</span>`;
  el.hidden=false;UXB.rad={k,held:true,t:performance.now()};clearTimeout(UXB.radT);UXB.radT=setTimeout(uxbRadIdle,UXB.RAD_IDLE);return true}
function uxbRadIdle(){if(UXB.rad&&!UXB.rad.held&&performance.now()-UXB.rad.t>=UXB.RAD_IDLE-50)uxbRadClose();else if(UXB.rad)UXB.radT=setTimeout(uxbRadIdle,1000)}
function uxbRadClose(){const el=document.getElementById('ux45rad');if(el){el.hidden=true;el.innerHTML=''}UXB.rad=null;clearTimeout(UXB.radT)}
function uxbRadAt(x,y){if(!UXB.rad)return null;const el=document.elementFromPoint(x,y);return el&&el.closest?el.closest('#ux45rad [data-ux45t]'):null}
function uxbRadHover(x,y){const o=uxbRadAt(x,y);for(const b of document.querySelectorAll('#ux45rad .ux45o'))b.classList.toggle('on',b===o);if(UXB.rad)UXB.rad.t=performance.now()}
function uxbDrink(k,T){UXB.forceT={k,T:+T};try{return usePotion(k)}finally{UXB.forceT=null}}
function uxbRadPick(o){const k=o.dataset.k,T=+o.dataset.ux45t;uxbRadClose();const r=uxbDrink(k,T);try{buildBar()}catch(_){}return r}
// 고른 등급만 바꾸고 나머지(재사용 대기 · 회복 · 시험의 방 규칙 · 소리)는 원래 길 그대로
{const _pb=potBest;potBest=function(k){const f=UXB.forceT;if(f&&f.k===k&&potN(k,f.T)>0)return f.T;return _pb.apply(this,arguments)}}
addEventListener('pointerdown',e=>{if(!UXB.rad)return;const t=e.target;if(t&&t.closest&&(t.closest('#ux45rad')||t.closest('#bar [data-pot]')))return;uxbRadClose()},true);
addEventListener('resize',()=>{uxbRadClose();uxbTipHide(true)});
// 배치 바꾸기(설정 ⚙ · 휴대폰): 켬이면 단축칸 꾹 누르기 = 예전처럼 옮기기
function uxbEdit(on){UXB.edit=on?1:0;document.body.classList.toggle('ux45edit',!!UXB.edit);let c=document.getElementById('ux45editbar');
  if(UXB.edit&&!c){c=document.createElement('button');c.type='button';c.id='ux45editbar';c.textContent='배치 바꾸기 끝 ✓';c.addEventListener('pointerdown',e=>e.stopPropagation());c.addEventListener('click',e=>{e.stopPropagation();uxbEdit(false)});document.body.appendChild(c)}
  if(!UXB.edit&&c)c.remove();if(!UXB.edit){try{fb28Cancel()}catch(_){}}uxbRadClose();uxbTipHide(true);
  if(on)msg('배치 바꾸기: 단축칸을 꾹 눌러 끌어 옮기세요. 다 되면 위쪽 「배치 바꾸기 끝」','#d6c7a1');return UXB.edit}
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);try{const el=SET24.el;if(!el||el.hidden||!M22.phone())return;const sep=el.querySelector('.s24sep'),v=UXB.edit;
  const box=document.createElement('div');box.className='m43set ux45set';
  box.innerHTML=`<div class="s24h">배치 바꾸기</div><div class="s24row"><button type="button" class="s24seg${v?' on':''}" data-ux45edit="1" aria-pressed="${!!v}">켬</button><button type="button" class="s24seg${v?'':' on'}" data-ux45edit="0" aria-pressed="${!v}">끔</button></div>
    <div class="s24n">켜면 아래 단축칸을 꾹 눌러 끌어서 옮길 수 있어요. 끄면 꾹 누르기는 스킬 설명 · 물약 등급 고르기예요. 처음 자리로는 아래 「위치 되돌리기」</div>`;
  el.insertBefore(box,sep||null);box.querySelectorAll('[data-ux45edit]').forEach(b=>b.onclick=e=>{e.stopPropagation();const on=b.dataset.ux45edit==='1';uxbEdit(on);if(on)set24Open(false);else{set24Draw();set24Place()}})}catch(err){if(window.__QA)throw err}}}

/* ===== P3 화면 누르기 기술 좌/우 · P4 단축칸 두 줄 전부 (이 기기 설정) ===== */
function uxbDevClean(o){return {fire:o&&typeof o==='object'&&o.fire===1?1:0,bar2:o&&typeof o==='object'&&o.bar2===1?1:0}}// 없거나 엉뚱하면 좌 · 한 줄
try{if(!window.__QA)Object.assign(UXB,uxbDevClean(JSON.parse(localStorage.getItem(FB28.key)||'null')))}catch(_){}
// 기기 설정 저장: 예전 값(zoom · pos · vib)에 fire · bar2만 덧붙인다 (캐릭터 키와 상관없는 기기 키)
{const _s=fb28Save;fb28Save=function(){const r=_s.apply(this,arguments);if(window.__QA)return r;try{const o=JSON.parse(localStorage.getItem(FB28.key)||'null');if(o&&typeof o==='object'){if(UXB.fire)o.fire=1;else delete o.fire;if(UXB.bar2)o.bar2=1;else delete o.bar2;localStorage.setItem(FB28.key,JSON.stringify(o))}}catch(_){}return r}}
function uxbFireSet(v){UXB.fire=v?1:0;fb28Save();uxbFireBtn();const i=UXB.fire,id=P&&P.bar[i];
  msg(`화면 오른쪽을 누르면: ${i?'우':'좌'} 칸${id&&SPELLS[id]?` (${SPELLS[id].n})`:' (비어 있음)'}`,'#d6c7a1');return UXB.fire}
function uxbFireBtn(){const bar=document.getElementById('bar');if(!bar)return null;let b=document.getElementById('ux45fire');
  if(!b||!bar.contains(b)){if(b)b.remove();b=document.createElement('button');b.type='button';b.id='ux45fire';const sep=bar.querySelector('.sep');(sep?sep.parentNode:bar).appendChild(b)}
  const i=UXB.fire,id=P&&P.bar[i],t=`화면 오른쪽 누르기로 쓰는 칸: ${i?'우(둘째 칸)':'좌(첫째 칸)'}${id&&SPELLS[id]?' · '+SPELLS[id].n:''} · 누르면 바뀜`;
  if(b.dataset.v!==String(i)){b.dataset.v=String(i);b.innerHTML=`<small>누르기</small><b>${i?'우':'좌'}</b>`}if(b.title!==t){b.title=t;b.setAttribute('aria-label',t)}return b}
{const _bp=barPress;barPress=function(b){if(b&&b.id==='ux45fire'){uxbFireSet(!UXB.fire);return}return _bp.apply(this,arguments)}}
// 화면 오른쪽 누르기(update의 fireTouch 줄)만 알아본다: 그 줄은 aimAt(fireTouch.x, fireTouch.y)로 겨눈 값을 castSlot(0, …)에 넘긴다
{const _a=aimAt;aimAt=function(sx,sy){const r=_a.apply(this,arguments);try{if(fireTouch&&sx===fireTouch.x&&sy===fireTouch.y&&r&&typeof r==='object')UXB.ftAim=r}catch(_){}return r}}
// 다른 파일(tap20 탭 한 번 채널링 · bar44)이 칸 번호를 보고 일하므로 맨 바깥에서 바꾼다(모두 감싼 뒤 · 시작 직후)
setTimeout(()=>{const _cs=castSlot;castSlot=function(i,t){if(i===0&&UXB.fire&&t&&t===UXB.ftAim){UXB.ftAim=null;i=1;return _cs.call(this,i,t)}return _cs.apply(this,arguments)}},0);
// P4 두 줄 전부
const uxbFull=()=>!!UXB.bar2&&typeof M22==='object'&&M22.mode()==='L';
function uxbBarSize(){const bar=document.getElementById('bar');if(!bar)return;const on=uxbFull();document.body.classList.toggle('ux45full',on);if(!on){bar.style.removeProperty('--ux45s');return}
  const w=bar.parentNode&&bar.parentNode.clientWidth;if(!w)return;let n=0;for(const r of bar.querySelectorAll('.barrow')){const c=[...r.children].filter(x=>x.matches('button')&&getComputedStyle(x).display!=='none'&&!x.classList.contains('s26')).length;if(c>n)n=c}
  const sz=Math.max(UXB.SZ_MIN,Math.min(UXB.SZ_MAX,Math.floor((w-8-3*(n-1))/Math.max(1,n))));bar.style.setProperty('--ux45s',sz+'px')}
function uxbBar2Set(v){UXB.bar2=v?1:0;fb28Save();try{buildBar()}catch(_){}return UXB.bar2}
// 쪽 넘기기: 좌/우 단추 자리만큼 한 쪽 칸을 하나 줄인다 · 두 줄 전부면 쪽을 하나로
{const _mp=m43Per;m43Per=function(bar){const n=_mp.apply(this,arguments);try{if(uxbFull())return 99;const f=document.getElementById('ux45fire');if(f&&getComputedStyle(f).display!=='none'){// 좌/우 단추(40 + 틈 3)만큼 자리를 빼고 다시 셈: 넓은 화면은 그대로 8칸, 좁으면 한 칸 줄어듦
    const w=bar.parentNode&&bar.parentNode.clientWidth;if(!w)return n;const pots=[...bar.querySelectorAll('[data-pot]')].filter(b=>getComputedStyle(b).display!=='none').length;
    return Math.max(3,Math.min(n,Math.floor((w-10-43-43-pots*47+3)/47)))}}catch(_){}return n}}
{const _bb=buildBar;buildBar=function(){const r=_bb.apply(this,arguments);try{uxbFireBtn();document.body.classList.toggle('ux45full',uxbFull());if(typeof m43Page==='function'&&P&&P.cls)m43Page();uxbBarSize();if(typeof fb28Apply==='function')fb28Apply('bar')}catch(err){if(window.__QA)throw err}return r}}
addEventListener('resize',()=>setTimeout(()=>{try{if(P&&P.cls){uxbFireBtn();uxbBarSize()}}catch(_){}},0));
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);try{const el=SET24.el;if(!el||el.hidden||!M22.phone())return;const sep=el.querySelector('.s24sep'),v=UXB.bar2,f=UXB.fire;
  const box=document.createElement('div');box.className='m43set ux45set2';
  box.innerHTML=`<div class="s24h">단축칸 (가로 화면)</div><div class="s24row"><button type="button" class="s24seg${v?'':' on'}" data-ux45bar2="0" aria-pressed="${!v}">한 줄 넘기기</button><button type="button" class="s24seg${v?' on':''}" data-ux45bar2="1" aria-pressed="${!!v}">두 줄 전부</button></div>
    <div class="s24n">두 줄 전부: PC처럼 모든 칸(빈 칸도)을 두 줄로 보여요. 추가 단축바를 켰으면 그 줄도 함께. 이 기기에 저장돼요</div>
    <div class="s24h">화면 오른쪽 누르기 기술</div><div class="s24row"><button type="button" class="s24seg${f?'':' on'}" data-ux45fire="0" aria-pressed="${!f}">좌 (첫째 칸)</button><button type="button" class="s24seg${f?' on':''}" data-ux45fire="1" aria-pressed="${!!f}">우 (둘째 칸)</button></div>
    <div class="s24n">단축칸 끝의 작은 「좌/우」 단추로도 바꿔요. 이 기기에 저장돼요</div>`;
  el.insertBefore(box,sep||null);
  box.querySelectorAll('[data-ux45bar2]').forEach(b=>b.onclick=e=>{e.stopPropagation();uxbBar2Set(b.dataset.ux45bar2==='1');set24Draw();set24Place()});
  box.querySelectorAll('[data-ux45fire]').forEach(b=>b.onclick=e=>{e.stopPropagation();uxbFireSet(b.dataset.ux45fire==='1');set24Draw();set24Place()})}catch(err){if(window.__QA)throw err}}}

/* ===== 5차 Q1 단축칸 꾹 = 계속 쓰기 · Q2 버프 다시 걸기 알림 · Q9 큰 기술 준비 반짝 ===== */
// 10번 설명 쪽지를 쓰는 곳: 스킬 트리 창 · 「배치 바꾸기」 · 마을 안전 지대. 그 밖(싸움)에서는 꾹 = 계속 쓰기(Q1). 나중에 바꿀 때 이 한 줄만
function ux45TipOk(){return !!(UXB.edit||(uxbPanelOn()&&tab==='tree')||(typeof safe24Here==='function'&&safe24Here()))}
// Q1: PC 키를 누르고 있을 때(b3 update의 CODE2SLOT 줄)와 같은 길 — 매 프레임 castSlot(i), 겨눔은 지금처럼 가장 가까운 적. tap20 규칙(새로 누름 · 누르고 있음)도 그대로 따라감
// 끌어서 겨눌 수 있는 마법(mux45 m45Aimable이 있으면 그것 · 없으면 b3 AIMED)
const uxbAimable=id=>typeof m45Aimable==='function'?!!m45Aimable(id):!!(SPELLS[id]&&AIMED.has(SPELLS[id].kind)&&!SPELLS[id].self);
// mux45가 이 손가락으로 겨누는 중이면(12px 넘게 끌림) 계속 쓰기는 멈춘다
const uxbAimOn=s=>typeof M45==='object'&&!!M45&&!!M45.aim&&M45.aim.on&&M45.aim.pid===s.pid;
function uxbHoldTick(dt){if(!UXB.bars.size||paused||!P||P.dead)return;
  for(const s of UXB.bars.values()){if(!s.hold||s.cancel||s.i<0)continue;if(uxbAimOn(s)){s.hold=null;s.cancel=true;continue}if(s.hold==='wait'){s.w+=dt;if(s.w<UXB.HOLD_AIM-1e-6)continue;s.hold='on'}
    if(!P.bar[s.i]){s.hold=null;continue}s.fired=1;castSlot(s.i)}}
addEventListener('blur',()=>{for(const s of UXB.bars.values())s.hold=null});
document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const s of UXB.bars.values())s.hold=null});
// Q2 · Q9: 상태는 게임 프레임(update)에서 보고, 단축칸 그림은 바뀔 때만 고친다
function uxbRbClean(o){return o&&typeof o==='object'&&o.rb===0?0:1}// 없으면 켬
try{if(!window.__QA)UXB.rb=uxbRbClean(JSON.parse(localStorage.getItem(FB28.key)||'null'))}catch(_){}
{const _s=fb28Save;fb28Save=function(){const r=_s.apply(this,arguments);if(window.__QA)return r;try{const o=JSON.parse(localStorage.getItem(FB28.key)||'null');if(o&&typeof o==='object'){if(UXB.rb)delete o.rb;else o.rb=0;localStorage.setItem(FB28.key,JSON.stringify(o))}}catch(_){}return r}}
function uxbRbSet(v){UXB.rb=v?1:0;fb28Save();if(!UXB.rb){UXB.low.clear();for(const id of [...UXB.rbBtn.keys()])uxbRbHide(id)}uxbMarkApply(true);return UXB.rb}
const uxbMyBuff=id=>!!(id&&id[0]!=='_'&&SPELLS[id]&&P&&SPELLS[id].cls===P.cls&&P.bar.includes(id));
function uxbRbEl(){let el=document.getElementById('ux45rb');if(!el){el=document.createElement('div');el.id='ux45rb';
    el.addEventListener('pointerdown',e=>e.stopPropagation());el.addEventListener('click',e=>{const b=e.target.closest('[data-ux45rb]');if(!b)return;e.stopPropagation();uxbRbCast(b.dataset.ux45rb)})}
  const m=document.body.classList.contains('m22')||(typeof MOB==='object'&&MOB.on()),mb=document.getElementById('mbuffs'),pb=document.getElementById('buffs');
  if(m&&mb){if(el.previousElementSibling!==mb)mb.after(el)}else if(pb){if(el.previousElementSibling!==pb)pb.after(el)}else if(!el.isConnected)document.body.appendChild(el);return el}
function uxbRbShow(id){const el=uxbRbEl();let b=el.querySelector(`[data-ux45rb="${id}"]`);
  if(!b){b=document.createElement('button');b.type='button';b.dataset.ux45rb=id;b.innerHTML=`다시 <b>${uxbEsc(SPELLS[id].n)}</b>`;b.title=`${SPELLS[id].n} 다시 걸기 (마나 · 재사용은 그대로)`;el.appendChild(b)}
  UXB.rbBtn.set(id,performance.now()+UXB.RB_SHOW)}
function uxbRbHide(id){UXB.rbBtn.delete(id);const el=document.getElementById('ux45rb'),b=el&&el.querySelector(`[data-ux45rb="${id}"]`);if(b)b.remove()}
// 누르면 단축칸을 누른 것과 같은 길(castSlot) — 마나 · 재사용 · 마을 규칙 그대로. 다시 걸리면 단추가 사라짐
function uxbRbCast(id){const i=P&&P.bar?P.bar.indexOf(id):-1;if(i<0){uxbRbHide(id);return false}castSlot(i);if(P.buffs[id]&&P.buffs[id].t>0)uxbRbHide(id);return true}
function uxbMarkTick(){if(!P||!Array.isArray(P.bar))return;const now=performance.now();
  if(UXB.markP!==P){UXB.markP=P;UXB.rbHad.clear();UXB.rbMax={};UXB.low.clear();UXB.cdWas={};UXB.cdMax={};UXB.rdy.clear();for(const id of [...UXB.rbBtn.keys()])uxbRbHide(id)}
  // Q2 내가 건 버프: 남은 5초 이하(10초 넘게 걸리는 버프만) → 그 칸 깜빡 · 끝나면 「다시」 단추 6초
  const cur=new Set();UXB.low.clear();
  for(const id in P.buffs){const b=P.buffs[id];if(!b||!(b.t>0)||!uxbMyBuff(id))continue;cur.add(id);const m=UXB.rbMax[id]=Math.max(UXB.rbMax[id]||0,b.t);
    if(UXB.rb&&b.t<=UXB.RB_LOW&&m>=UXB.RB_MINMAX)UXB.low.add(id);if(UXB.rbBtn.has(id))uxbRbHide(id)}
  if(UXB.rb&&!P.dead)for(const id of UXB.rbHad)if(!cur.has(id)&&(UXB.rbMax[id]||0)>=UXB.RB_MINMAX&&uxbMyBuff(id))uxbRbShow(id);
  for(const id in UXB.rbMax)if(!cur.has(id))delete UXB.rbMax[id];UXB.rbHad=cur;
  for(const [id,t] of UXB.rbBtn)if(now>t||P.dead||!P.bar.includes(id))uxbRbHide(id);
  // Q9 재사용 30초 이상이던 마법이 다시 준비됨 → 그 칸 한 번 크게 반짝(안 보이는 쪽이면 쪽 단추)
  for(const id of P.bar){if(!id||!SPELLS[id])continue;const c=P.cd[id]||0,was=UXB.cdWas[id]||0;if(c>0)UXB.cdMax[id]=Math.max(UXB.cdMax[id]||0,c);
    else if(was>0){if((UXB.cdMax[id]||0)>=UXB.RDY_CD)UXB.rdy.set(id,now+UXB.RDY_MS);delete UXB.cdMax[id]}UXB.cdWas[id]=c}
  for(const [id,t] of UXB.rdy)if(now>t)UXB.rdy.delete(id);
  uxbMarkApply(false)}
function uxbMarkApply(force){const bar=document.getElementById('bar');if(!bar||!P||!P.bar)return;const sig=[...UXB.low].join()+'|'+[...UXB.rdy.keys()].join();if(!force&&sig===UXB.markSig)return;UXB.markSig=sig;
  let hidden=false;
  for(const b of bar.querySelectorAll('button.sk[data-slot]')){const id=P.bar[+b.dataset.slot];b.classList.toggle('ux45low',!!id&&UXB.low.has(id));const r=!!id&&UXB.rdy.has(id);b.classList.toggle('ux45rdy',r)}
  for(const id of UXB.rdy.keys()){const L=[...bar.querySelectorAll('button.sk[data-slot]')].filter(b=>P.bar[+b.dataset.slot]===id);if(!L.some(b=>!b.classList.contains('m43off')&&b.offsetParent!==null&&getComputedStyle(b).display!=='none'))hidden=true}
  const pg=document.getElementById('m43pg');if(pg)pg.classList.toggle('ux45rdy',hidden)}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{uxbHoldTick(dt);uxbMarkTick()}catch(err){if(window.__QA)throw err}return r}}
{const _bb=buildBar;buildBar=function(){const r=_bb.apply(this,arguments);try{uxbMarkApply(true)}catch(err){if(window.__QA)throw err}return r}}
// 설정 ⚙ 「버프 다시 걸기 알림」 (PC · 휴대폰 모두 · 이 기기에 저장 · 없으면 켬)
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);try{const el=SET24.el;if(!el||el.hidden)return;const sep=el.querySelector('.s24sep'),v=UXB.rb;
  const box=document.createElement('div');box.className='m43set ux45set3';
  box.innerHTML=`<div class="s24h">버프 다시 걸기 알림</div><div class="s24row"><button type="button" class="s24seg${v?' on':''}" data-ux45rb="1" aria-pressed="${!!v}">켬</button><button type="button" class="s24seg${v?'':' on'}" data-ux45rb="0" aria-pressed="${!v}">끔</button></div>
    <div class="s24n">내가 건 버프가 5초 남으면 그 단축칸이 깜빡이고, 끝나면 버프 옆에 「다시」 단추가 잠깐 나와요. 저절로 걸지는 않아요. 이 기기에 저장돼요</div>`;
  el.insertBefore(box,sep||null);box.querySelectorAll('.ux45set3 [data-ux45rb]').forEach(b=>b.onclick=e=>{e.stopPropagation();uxbRbSet(b.dataset.ux45rb==='1');set24Draw();set24Place()})}catch(err){if(window.__QA)throw err}}}

{const st=document.createElement('style');st.textContent=`
/* Q2 · Q9 */
#set24{max-height:calc(100vh - 16px);overflow-y:auto}/* Q2 설정 칸이 PC 설정 목록에도 붙어 길어짐 → 화면보다 길면 안에서 넘김(mux45와 같은 규칙) */
@keyframes ux45low{0%,100%{box-shadow:0 0 0 2px #ffd76a,0 0 8px #ffb84a}50%{box-shadow:0 0 0 2px rgba(255,215,106,.15)}}
#hud .bar button.sk.ux45low{animation:ux45low .8s ease-in-out infinite}
@keyframes ux45rdy{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,231,168,0)}35%{transform:scale(1.22);box-shadow:0 0 0 3px #ffe7a8,0 0 18px 6px #ffd76a}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,231,168,0)}}
#hud .bar button.sk.ux45rdy,#hud .bar #m43pg.ux45rdy{animation:ux45rdy .9s ease-out 1;position:relative;z-index:2}
#ux45rb{display:flex;flex-wrap:wrap;gap:3px;justify-content:flex-start;pointer-events:auto}#ux45rb:empty{display:none}
body.m22 #ux45rb{justify-content:flex-end;max-width:150px}
#ux45rb button{min-height:28px;padding:2px 8px;border:1px solid #d6b262;border-radius:12px;background:#3a2c12;color:#ffe7a8;font:inherit;font-size:12px;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.6)}
body.m22 #ux45rb button{min-height:34px;font-size:12.5px}
#ux45rb button b{font-weight:normal;color:#fff}
/* P3 */
#ux45fire{display:none}
body.m22 #hud .bar #ux45fire{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;order:3;width:40px;height:44px;flex:0 0 40px;padding:0;margin:0;border:1px solid #8a7346;border-radius:4px;background:linear-gradient(180deg,#2e2416,#16110b);color:#ffe2a0;font:inherit;line-height:1;pointer-events:auto;cursor:pointer}
body.m22 #hud .bar #ux45fire small{font-size:9px;color:#a39d8f}body.m22 #hud .bar #ux45fire b{font-size:15px}
/* P4 */
body.m22L.ux45full #hud .bar{flex-direction:column;flex-wrap:nowrap;align-items:center;gap:3px}
body.m22L.ux45full #hud .bar .barrow{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:100%}
body.m22L.ux45full #hud .bar .sk{width:var(--ux45s,44px);height:var(--ux45s,44px)}
body.m22L.ux45full #hud .bar .sk.empty{display:flex}
body.m22L.ux45full #hud .bar:not(.m22all) .sk.m43off{display:flex!important}
body.m22L.ux45full #hud .bar #m43pg{display:none}
body.m22L.ux45full #hud .bar #ux45fire{height:var(--ux45s,44px)}
/* 2 */
#pbody button[data-stat],#pbody button[data-learn],#ux45rad .ux45o{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}
#pbody .ux45ap{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}#pbody .ux45ap button{min-height:34px;padding:4px 10px;font-size:13px}
#pbody .ux45ap.on{flex-direction:column;align-items:stretch;border:1px solid #7a6236;border-radius:6px;padding:8px 10px;background:#1a150e}
#pbody .ux45ap .ux45q{color:#ffe2a0;font-size:13.5px}#pbody .ux45ap .ux45row{display:flex;flex-wrap:wrap;gap:6px}#pbody .ux45ap .ux45n{font-size:11.5px;margin:0}
#pbody .ux45pv{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:2px 12px;font-size:13px}#pbody .ux45pv div{display:flex;gap:8px;align-items:baseline}
#pbody .ux45pv b{color:#ffd76a}#pbody .ux45pv i{font-style:normal;color:#8cf08a;font-size:12px}
#pbody .ux45ap button:not(.ghost),#pbody .ux45g button:not(.ghost){background:#3a2c12;border:1px solid #d6b262;color:#ffe7a8;border-radius:4px;font-family:inherit}
#pbody .ux45g button:disabled{opacity:.45;border-color:#5a4a36;color:#a39d8f;background:#1e1a14}
/* 7 */
#pbody h2 .ux45sort{min-height:30px;padding:2px 10px;font-size:12.5px;margin-left:6px;vertical-align:middle}
#pbody .bagc{position:relative}#pbody .ux45new{display:inline-block;background:#c8462a;color:#fff;font-size:10px;font-weight:700;line-height:1;padding:2px 3px;border-radius:3px;vertical-align:middle}
#pbody .bagc .ux45new{position:absolute;top:1px;right:1px;pointer-events:none;box-shadow:0 0 0 1px rgba(0,0,0,.6)}
/* 15 */
#pbody .ux45gs{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin:0 0 10px}#pbody .ux45gsh{color:#d6b262;font-size:13px}
#pbody .ux45g{display:inline-flex;gap:3px}#pbody .ux45g button{min-height:34px;padding:4px 9px;font-size:13px}#pbody .ux45g small{color:#a39d8f;font-size:11px}
#pbody .ux45gs .ux45n{flex:1 1 100%;font-size:11.5px;margin:0}
/* 6 */
body.m22L #panel .card.ux45two{display:flex;flex-direction:column;overflow:hidden;height:100%;min-height:0;box-sizing:border-box}
body.m22L #panel .card.ux45two #pbody{flex:1 1 auto;min-height:0;display:flex;flex-direction:column}
body.m22L #pbody .ux45cols{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr);gap:12px}
body.m22L #pbody .ux45l,body.m22L #pbody .ux45r{min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y;padding-right:4px}
body.m22L #pbody .ux45r{border-left:1px solid #3e3424;padding-left:10px}
body.m22L #pbody .ux45l>h2:first-child,body.m22L #pbody .ux45r>h2:first-child{margin-top:0}
body.m22L #pbody .ux45l .geq{grid-template-columns:1fr 1fr}
body.m22L #pbody .ux45r .baggrid{max-width:none}
#pbody .geqc.ux45cmp{outline:2px solid #ffd76a;outline-offset:-1px;box-shadow:0 0 10px rgba(214,178,98,.7)}
/* 10 */
#ux45tip{position:fixed;z-index:9998;left:0;top:0;width:max-content;max-width:min(280px,calc(100vw - 16px));box-sizing:border-box;background:rgba(18,14,10,.97);border:1px solid #8a7346;border-radius:6px;padding:7px 10px;font-size:12.5px;line-height:1.4;color:#e8e2d2;box-shadow:0 4px 18px rgba(0,0,0,.65);pointer-events:none}
#ux45tip[hidden]{display:none}#ux45tip .t{font-weight:700;color:#ffe2a0;font-size:12px}#ux45tip .t small{color:#a39d8f;font-weight:400;font-size:11px}#ux45tip .k{color:#9fc4ff;font-size:12px;margin:1px 0 3px}#ux45tip .d{color:#d8d0bc}
body.ux45edit.m22 #hud .bar{outline:2px dashed #d6b262;outline-offset:3px}
#ux45editbar{display:none}body.m22.ux45edit #ux45editbar{display:block;position:fixed;z-index:72;left:50%;top:calc(env(safe-area-inset-top,0px) + 6px);transform:translateX(-50%);min-height:40px;padding:0 16px;border:1px solid #d6b262;border-radius:20px;background:#3a2c12;color:#ffe7a8;font:inherit;font-size:12px;box-shadow:0 2px 10px rgba(0,0,0,.6)}
/* 16 */
#ux45rad{position:fixed;inset:0;z-index:9997;pointer-events:none}#ux45rad[hidden]{display:none}
#ux45rad .ux45o{position:absolute;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;padding:0;border:2px solid #8a7346;background:radial-gradient(circle at 40% 35%,#3a2e1c,#140f0a);color:#ffe2a0;pointer-events:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1;box-shadow:0 2px 10px rgba(0,0,0,.7);cursor:pointer}
#ux45rad .ux45o.hp{border-color:#b04a3a}#ux45rad .ux45o.mp{border-color:#3a5ab0}
#ux45rad .ux45o.on,#ux45rad .ux45o:active{transform:translate(-50%,-50%) scale(1.15);border-color:#ffd76a;box-shadow:0 0 12px #d6b262}
#ux45rad .ux45o b{position:absolute;right:2px;bottom:4px;font-size:11px;color:#fff;text-shadow:0 0 3px #000}#ux45rad .ux45o small{font-size:9.5px;color:#d8c9a6;margin-top:1px}
#ux45rad .ux45o canvas,#ux45rad .ux45o img,#ux45rad .ux45o svg{width:26px;height:26px}
#ux45rad .ux45rc{position:absolute;transform:translate(-50%,-50%);font-size:11px;color:#ffe2a0;text-shadow:0 0 3px #000;pointer-events:none}`;document.head.appendChild(st)}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{uxbAimable,ux45TipOk,uxbHoldTick,uxbMarkTick,uxbMarkApply,uxbRbSet,uxbRbClean,uxbRbCast,uxbRbShow,uxbRbHide,uxbDevClean,uxbFireSet,uxbBar2Set,uxbBarSize,uxbFull,UXB,uxbRatio,uxbSplit,uxbPlan,uxbApApply,uxbSortBag,uxbGsWear,uxbGsSave,uxbGsClean,uxbGs,uxbEdit,uxbDrink,uxbRadOpen,uxbRadClose,uxbTipShow,uxbTipHide,uxbCols})}catch(_){}},0);
