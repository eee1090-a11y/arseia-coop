/* ---------- 창고 (40칸, 같은 브라우저·계정의 모든 캐릭터가 함께 씀) ---------- */
// 캐릭터 저장과 따로 둔다: 로그인 전에는 arseia-stash, 로그인하면 계정 칸 's'(클라우드 c s 필드).
const STASHN=40;
const STASHKEY=()=>ACC?ACCKEY(ACC.uid,'s'):'arseia-stash';
function stashRead(){try{const s=localStorage.getItem(STASHKEY());const d=s?JSON.parse(s):null;return d&&Array.isArray(d.items)?d.items.map(fixItem).filter(Boolean).slice(0,STASHN):[]}catch(_){return[]}}
// 창고 골드 (v18): 같은 기록의 gold 필드. 예전 기록에 없으면 0
function stashGold(){try{const s=localStorage.getItem(STASHKEY());const d=s?JSON.parse(s):null;const g=d&&+d.gold;return g>0&&isFinite(g)?Math.floor(Math.min(g,2e9)):0}catch(_){return 0}}
function stashWrite(items,gold){if(gold==null)gold=stashGold();try{localStorage.setItem(STASHKEY(),JSON.stringify({v:1,items,gold:Math.max(0,Math.floor(gold))}));if(ACC)cloudSaved('s');return true}catch(_){msg('창고에 저장하지 못했습니다','#ff9a6a');return false}}
let stashSort=0;
function stashHtml(){const st=stashRead();
  let h=`<p class="muted" style="margin-top:0">창고는 ${ACC?'이 구글 계정':'이 브라우저'}의 모든 캐릭터가 함께 씁니다. 다른 캐릭터에게 장비를 넘겨줄 때도 쓰세요.</p>`;
  {const g=stashGold();h+=`<h2>창고 골드 <span class="muted">${g.toLocaleString()}</span></h2><div class="row" style="margin:0 0 10px;gap:6px;flex-wrap:wrap"><input id="stgAmt" type="number" min="1" step="1" placeholder="금액" style="width:110px;background:#0e0c0a;color:#e8e2d2;border:1px solid var(--line)"><button type="button" data-stgin="1" ${P.gold>0?'':'disabled'}>맡기기</button><button type="button" data-stgout="1" ${g>0?'':'disabled'}>찾기</button><button class="ghost" type="button" data-stgin="all" ${P.gold>0?'':'disabled'}>모두 맡기기</button><button class="ghost" type="button" data-stgout="all" ${g>0?'':'disabled'}>모두 찾기</button><span class="muted">가진 금화 ${(P.gold|0).toLocaleString()}</span></div>`}
  h+=`<h2>창고 <span class="muted">${st.length}/${STASHN}</span></h2>`;
  if(!st.length)h+='<p class="muted">비어 있습니다. 아래 가방에서 "창고에 넣기"를 누르세요.</p>';
  st.forEach((it,i)=>{h+=itemRow(it,`<button type="button" data-stout="${i}" ${P.bag.length>=BAG_MAX?'disabled':''}>가방으로</button>`)});
  h+=`<h2>가방 <span class="muted">${P.bag.length}/${BAG_MAX}</span></h2>`;
  if(!P.bag.length)h+='<p class="muted">가방이 비어 있습니다.</p>';
  else if(P.bag.length>1)h+=`<div class="row" style="margin:0 0 10px"><button class="ghost" type="button" data-stall="1" ${st.length>=STASHN?'disabled':''}>가방 모두 창고에 넣기</button></div>`;
  for(const it of P.bag)h+=itemRow(it,`<button type="button" data-stin="${it.id}" ${st.length>=STASHN?'disabled':''}>창고에 넣기</button>`);
  return h}
// 옮길 때는 받는 쪽을 먼저 저장한다 (중간에 꺼져도 물건이 사라지지 않게)
function stashIn(ids){const st=stashRead();let n=0;const moved=[];
  for(const id of ids){if(st.length>=STASHN)break;const ix=P.bag.findIndex(x=>x.id===id);if(ix<0)continue;st.push(P.bag[ix]);moved.push(id);n++}
  if(!n)return;if(!stashWrite(st))return;P.bag=P.bag.filter(x=>!moved.includes(x.id));saveNow();
  msg(n>1?`장비 ${n}개를 창고에 넣었습니다`:'창고에 넣었습니다','#d6b262')}
function stashOut(i){const st=stashRead(),it=st[i];if(!it)return;if(P.bag.length>=BAG_MAX){msg('가방이 가득 찼습니다','#a39d8f');return}
  it.id=++uid;P.bag.push(it);saveNow();st.splice(i,1);stashWrite(st);msg(`${typeof itemName==='function'?itemName(it):it.name}을(를) 꺼냈습니다`,RAR[it.rar].c)}
// 골드도 받는 쪽을 먼저 저장한다 (중간에 꺼지면 사라지지 않고 양쪽에 남을 뿐)
function stashGoldMove(dir,amt){const g=stashGold(),have=P.gold|0;let n=amt==='all'?(dir>0?have:g):Math.floor(+amt);
  if(!(n>0)){msg('금액을 적으세요','#a39d8f');return false}n=Math.min(n,dir>0?have:g);if(n<=0)return false;
  if(dir>0){if(!stashWrite(stashRead(),g+n))return false;P.gold=have-n;saveNow();msg(`금화 ${n.toLocaleString()}을 창고에 맡겼습니다`,'#d6b262')}
  else{P.gold=have+n;saveNow();stashWrite(stashRead(),g-n);msg(`금화 ${n.toLocaleString()}을 찾았습니다`,'#d6b262')}
  return true}
function stashClick(b){
  if(b.dataset.stgin||b.dataset.stgout){const el=document.getElementById('stgAmt'),v=b.dataset.stgin||b.dataset.stgout;stashGoldMove(b.dataset.stgin?1:-1,v==='all'?'all':(el?el.value:0));renderPanel();return true}
  if(b.dataset.stin){stashIn([+b.dataset.stin]);renderPanel();return true}
  if(b.dataset.stall){stashIn(P.bag.map(x=>x.id));renderPanel();return true}
  if(b.dataset.stout){stashOut(+b.dataset.stout);renderPanel();return true}
  return false}
