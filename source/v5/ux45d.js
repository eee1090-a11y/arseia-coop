/* ---------- v45 휴대폰 경험 5차 (사용자 2026-10-24 15:47Z 「모두넣어줘」 · rpg/mobile-ux-3/HANDOFF-5 · 이 파일: Q3 · Q4 · Q5 · Q6 · Q7 · Q8 · Q10 · Q11 · Q12 · Q13 · Q14) ----------
   Q3 주우면 바로 금화로(캐릭터마다 · 설정 ⚙ 조작): 끔(처음) · 일반 · 일반+마법. 줍는 순간 상점 판매가(itemPrice)만큼 금화. 1초 안의 것은 한 줄로 합침(「일반 장비 3개 → 금화 420」).
      그대로 줍는 것: 의뢰 · 전직 · 현상금 · 성장 보상(아래 보상 함수가 떨군 것 r45 · 발밑에 둔 keep), 희귀 이상, 홈(so) · 재련(rf) · 마법 부여(en) 장비, 지금 입은 것보다 좋은 장비(줍기 알림의 「지금보다 좋음」과 같은 셈).
      같이 하기에서도 바닥 물건은 원래 각자 화면에 따로 생기므로 내 화면 기준.
   Q4 마을에서 물약 채우기(캐릭터마다 · 설정 ⚙ 조작): 생명 · 마나 [끔 · 5 · 10 · 20], 귀환 두루마리 [끔 · 1 · 2 · 3]. 마을 안전 지대에 들어설 때(잡화점이 있는 마을만) 잡화점 값 그대로 모자란 만큼 산다.
      등급(세부-설정-기록 「물약 5단계 · 마을(지역) 레벨로 등급이 열림」): 그 마을 잡화점이 파는 가장 좋은 등급(potOpen). 가진 수는 그 등급 이상만 센다(낮은 등급은 그대로 두고 마실 때는 늘 좋은 것부터).
      금화가 모자라면 생명 → 마나 → 두루마리 차례로 살 수 있는 만큼. 한 줄 알림.
   Q5 돌아가는 문(사용자 OK: 놀이 방식 조금 바뀜): 귀환 두루마리(townPortal) · 다시 일어나기(#respawn)로 마을에 오면 그 마을 짝문 옆에 파란 문 하나. 「돌아가는 문」(F · #act)을 누르면
      떠난 자리(들판 좌표)로 한 번 가고 문은 사라진다. 던전에서 왔으면 그 던전 입구 앞으로 가서 보통 입장(doAct 'dungeon' → enterDungeon · 던전 기억 dgkeep22 규칙 그대로) → 입구 방.
      같이 하기 참가자(NET.guest)는 던전 안으로 저절로 들어가지 않고 입구 앞까지만(들어가기는 원래처럼 방장에게 부탁) · 다른 지역으로 돌아가는 문은 참가자에게 안 생김(지역은 파티가 같이 넘어감).
      사라짐: 다른 지역 · 다른 마을 · 다른 던전에 들어감 · 다시 귀환. 이번 접속 동안만(저장 안 함). 시험의 방 · 미궁 · 투기장 같은 특별 던전은 입구 앞까지만.
   Q6 내 캐릭터 발밑 고리(휴대폰): 얇은 밝은 고리(같이 하기 동료는 하늘색). 나무 · 큰 바위 기둥 · 몬스터가 앞에서 가리면 내 캐릭터 윤곽선을 그 위에 비춰 그린다.
      윤곽은 mon.js mInk처럼 실루엣을 8방향으로 밀어 테두리만 남긴다(가릴 때만 · 그때만 한 번 더 그림). 건물 · 절벽 · 던전 벽은 원래 반투명이 되므로 뺌. 그래픽 품질 「낮음」에서도 고리는 보임.
   Q7 피해 숫자(설정 ⚙ 화면 · 이 기기): 모두 · 큰 것만(치명타 · 보스/준보스 · 내가 받은 피해) · 끄기. 처음 값: 휴대폰 큰 것만, PC 모두(PC 모두 = 예전 그대로, 합치기도 안 함).
      휴대폰(또는 큰 것만)에서는 같은 적에게 0.2초 안에 뜬 숫자를 앞 숫자에 더해 하나로 보인다. 숫자는 그대로 만들고 그리기에서만 뺀다(소리 · 다른 코드는 그대로).
   Q8 걸으며 보는 큰 지도(휴대폰): 미니맵을 누르면 화면 가운데에 반투명 지역 지도(마을 · 던전 · 의뢰 표시 · 내 위치, 지도 창(M)과 같은 그림)가 겹친다. 게임은 멈추지 않고 누르기를 막지 않는다
      (pointer-events 없음, 「지도 닫기」 단추만). 미니맵을 다시 누르면 닫힘. 던전 안은 미니맵을 크게. 0.4초마다 다시 그림. 지도 창(M) · PC의 미니맵 누르기는 그대로.
   Q10 희귀 장비(세트 · 유니크 · 상급 유니크)가 떨어지면(휴대폰) 위쪽 띠에 이름 5초, 화면 밖이면 그쪽 가장자리 화살표(mux45 m45Edge · m45Arrow 그대로). 90초 사라짐 규칙 그대로(사라지거나 주우면 화살표도 없어짐).
   Q11 쓰러진 이유: #death 카드에 「마지막에 맞은 것: (몬스터)의 (공격) 412」. hitPlayer 가장 바깥에서 마지막으로 생명이 줄어든 때의 원인 · 실제 피해 숫자를 기억.
      공격 이름: 바닥 경고가 터짐(updateWarns) 「범위 공격」 · 돌진(dashHits) 「돌진」 · 투사체(g29Source) 「원거리 공격」 · 그 밖 「근접 공격」.
   Q12 진동 더(휴대폰): 보스 · 준보스의 큰 공격 예고(warns, 피해 있는 것 · 내 곁) 30ms · 레벨 업 30-60-30 · 세트 · 유니크 · 상급 유니크 장비 45ms. 0.6초 안에 겹치면 한 번.
      설정 「진동」 하나로 모두: v43 「위험 알림 진동」 칸(FB28.vib, 기기 설정)을 「진동」으로 바꿔 부르고, navigator.vibrate를 감싸 꺼 두면 어떤 진동(꾹 눌러 옮기기 포함)도 안 울린다.
   Q13 가방 거의 참: 40칸 중 36칸이 차면 한 번 한 줄 알림(35칸 아래로 줄면 다시). 가방이 36칸 이상일 때 상점 창의 「지금 장비보다 약한 것 모두 판매」 단추가 깜빡인다.
   Q14 사냥 결과: 마을 안전 지대를 떠날 때 레벨 · 경험치 · 금화 · 주운 장비 수를 기억해 두고, 돌아오면(걸어서 · 귀환 · 다시 일어나기) 「이번 사냥: 경험치 +x% · 금화 +n · 장비 n개」. 모두 0이면 안 띄움.
      마을 들고 나기: 들어올 때 안전 지대 안, 나갈 때 80 더 바깥(경계에서 들락날락해도 한 번만). 건물 안은 마을. 던전은 마을 밖.
   설정 칸(set24Draw 감싸기 · data-tab45): 「주우면 바로 금화로」 · 「마을에서 물약 채우기」(조작) · 「피해 숫자」(화면) · 「진동」(알림, v43 칸 이름만 바꿈).
   저장: 캐릭터 저장에 x45d {ag, hp, mp, tp} 하나(하나라도 켰을 때만, 없으면 모두 끔). 기기 설정은 새 키 'arseia-ux45d-v1' {dn}(없으면 기기에 맞는 처음 값 · #qa에서는 안 씀).
   캐릭터 키는 읽기만 하고 지우거나 비우지 않는다. 게임 수치(피해 · 값 · 떨어뜨림 · 경험치)는 그대로.
   붙는 곳: ux45a.js 다음, tap20.js · dnd20.js · bar44.js · b5.js 앞. b5.js의 let(panel · pbody · tab)은 함수 안에서만(시작 뒤) 쓴다. */
const UXD={KEY:'arseia-ux45d-v1',dev:{},
  AG:[0,1,2],AGN:['끔','일반','일반+마법'],RF:[0,5,10,20],RFT:[0,1,2,3],
  DN:['all','big','off'],DNN:{all:'모두',big:'큰 것만',off:'끄기'},MERGE:.2,
  BAG:36,TOWN_OUT:80,DOOR_R:55,BAND_MS:5000,VIB_GAP:600,
  town:null,hunt:null,items:0,bagW:0,slowT:0,ag:{n:0,g:0,r:[],t:-1},door:null,
  map:0,mapT:0,rare:[],vibT:-1e9,vibLog:[],last:null,how:'',hitD:null,occ:false,oc:null,outN:0,arrN:0,tg:null,inHit:0,mergeW:new WeakMap()};
const uxdPh=()=>typeof M22==='object'&&M22.phone();
const uxdOn=()=>typeof P!=='undefined'&&!!P&&!!P.cls;
const uxdErr=e=>{if(window.__QA)throw e};
// 기기 설정 (캐릭터 키와 상관없는 새 키 하나)
try{if(!window.__QA){const o=JSON.parse(localStorage.getItem(UXD.KEY)||'null');if(o&&typeof o==='object'&&UXD.DN.includes(o.dn))UXD.dev.dn=o.dn}}catch(_){}
function uxdDevSave(){if(window.__QA)return;try{localStorage.setItem(UXD.KEY,JSON.stringify({dn:UXD.dev.dn}))}catch(_){}}

/* ===== 캐릭터 설정: x45d {ag, hp, mp, tp} ===== */
function uxdClean(v){const o={ag:0,hp:0,mp:0,tp:0};if(v&&typeof v==='object'){if(UXD.AG.includes(+v.ag))o.ag=+v.ag;for(const k of ['hp','mp'])if(UXD.RF.includes(+v[k]))o[k]=+v[k];if(UXD.RFT.includes(+v.tp))o.tp=+v.tp}return o}
function uxdCfg(){if(!uxdOn())return {ag:0,hp:0,mp:0,tp:0};if(!P.x45d||typeof P.x45d!=='object')P.x45d=uxdClean(null);return P.x45d}
function uxdSet(k,v){const c=uxdCfg(),L=k==='ag'?UXD.AG:k==='tp'?UXD.RFT:UXD.RF;v=+v;if(!L.includes(v))return false;c[k]=v;save();return true}
function uxdReset(){UXD.town=null;UXD.hunt=null;UXD.items=0;UXD.door=null;UXD.rare=[];UXD.last=null;UXD.ag={n:0,g:0,r:[],t:-1};UXD.bagW=P&&P.bag&&P.bag.length>=UXD.BAG?1:0;uxdWhyClear()}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{const c=P&&P.x45d;if(d&&c&&(c.ag||c.hp||c.mp||c.tp))d.x45d={ag:c.ag,hp:c.hp,mp:c.mp,tp:c.tp}}catch(e){uxdErr(e)}return d}}
{const _ld=load;load=function(d){const c=uxdClean(d&&d.x45d),r=_ld.apply(this,arguments);try{if(r&&P){P.x45d=c;uxdReset()}}catch(e){uxdErr(e)}return r}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{if(P)P.x45d=uxdClean(null);uxdReset()}catch(e){uxdErr(e)}return r}}

/* ===== Q12 진동: 설정 「진동」(FB28.vib) 하나로 모든 진동 ===== */
try{const NP=typeof Navigator!=='undefined'&&Navigator.prototype,_v=NP&&NP.vibrate;if(typeof _v==='function')NP.vibrate=function(){if(typeof FB28==='object'&&FB28.vib===0)return false;return _v.apply(this,arguments)}}catch(_){}
function uxdVib(p,why){if(!uxdPh()||(typeof FB28==='object'&&FB28.vib===0))return false;const now=performance.now();if(now-UXD.vibT<UXD.VIB_GAP)return false;UXD.vibT=now;UXD.vibLog.push(why);if(UXD.vibLog.length>20)UXD.vibLog.shift();
  try{if(navigator.vibrate)navigator.vibrate(p)}catch(_){}return true}
const uxdBossy=e=>!!(e&&(e.boss||e.big||(TYPES[e.k]&&(TYPES[e.k].boss||TYPES[e.k].mini))));
{const _gx=gainXp;gainXp=function(n){const l0=P?P.lvl:0;const r=_gx.apply(this,arguments);try{if(P&&P.lvl>l0)uxdVib([30,60,30],'lv')}catch(e){uxdErr(e)}return r}}
function uxdWarnScan(){for(const w of warns){if(w._u45d)continue;w._u45d=1;if(!(w.dmg>0)||!uxdBossy(w.src)||P.dead)continue;if(Math.hypot(P.x-w.x,P.y-w.y)>(w.rad||0)+500)continue;uxdVib(30,'warn')}}

/* ===== Q3 주우면 바로 금화로 ===== */
// 보상을 떨어뜨리는 함수(가방이 가득 차 발밑에 둔 보상)가 만든 장비에는 r45를 단다
{const tag=f=>{const w=function(){const L=loot,n=L.length,r=f.apply(this,arguments);try{if(loot===L)for(let i=n;i<L.length;i++)if(L[i]&&L[i].kind==='item')L[i].r45=1}catch(_){}return r};w.__orig=f.__orig||f;return w};// __orig: #qa가 원래 함수 글을 읽음
  if(typeof questFinish==='function')questFinish=tag(questFinish);if(typeof sqFinish==='function')sqFinish=tag(sqFinish);if(typeof a3Reward==='function')a3Reward=tag(a3Reward);
  if(typeof chAccept==='function')chAccept=tag(chAccept);if(typeof btyCredit==='function')btyCredit=tag(btyCredit);if(typeof ecBtyCredit==='function')ecBtyCredit=tag(ecBtyCredit);
  if(typeof c21Drop==='function')c21Drop=tag(c21Drop);if(typeof c21LegKill==='function')c21LegKill=tag(c21LegKill);if(typeof c21Give==='function')c21Give=tag(c21Give);
  if(typeof g42BoxGive==='function')g42BoxGive=tag(g42BoxGive);if(typeof g42ChReward==='function')g42ChReward=tag(g42ChReward);if(typeof g42RdReward==='function')g42RdReward=tag(g42RdReward);
  if(typeof g42WkAdd==='function')g42WkAdd=tag(g42WkAdd);if(typeof j2GiveUniq==='function')j2GiveUniq=tag(j2GiveUniq);if(typeof j3GiveUniq==='function')j3GiveUniq=tag(j3GiveUniq)}
function uxdAgOk(l){const m=uxdCfg().ag;if(!m||!l||l.kind!=='item'||l.taken||l.keep||l.r45)return false;const it=l.item;if(!it||!(it.rar>=0)||it.rar>(m===1?0:1))return false;
  if(it.set||(typeof rfOf==='function'&&rfOf(it))||(Array.isArray(it.so)&&it.so.length)||it.en||it.core)return false;
  try{if((!it.cls||it.cls===P.cls)&&itemScore(it)>itemScore(gearCur(it)))return false}catch(_){return false}return true}
function uxdAgFlush(){const a=UXD.ag;if(!a.n)return '';const r0=a.r.every(x=>x===0),r1=a.r.every(x=>x===1),t=`${r0?'일반':r1?'마법':'일반 · 마법'} 장비 ${a.n}개 → 금화 ${a.g.toLocaleString()}`;
  UXD.ag={n:0,g:0,r:[],t:-1};msg(t,'#e8c35a');return t}
{const _pk=pickup;pickup=function(l){let r;
  if(uxdAgOk(l)){const it=l.item,g=itemPrice(it);P.gold+=g;l.taken=true;UXD.items++;const a=UXD.ag;if(!a.n)a.t=time;a.n++;a.g+=g;a.r.push(it.rar);ftext(l.x,l.y,'+'+g+' 금화','#e8c35a',false,20);
    try{if(typeof SFX==='object'&&SFX.gold)SFX.gold(l)}catch(_){}return}
  r=_pk.apply(this,arguments);try{if(l&&l.kind==='item'&&l.taken)UXD.items++}catch(e){uxdErr(e)}return r}}

/* ===== Q14 사냥 결과 · Q4 물약 채우기: 마을 들고 나기 ===== */
function uxdInTown(){if(!uxdOn()||DG)return false;if(IN)return true;return inSafe(P.x,P.y,UXD.town?-UXD.TOWN_OUT:0)}
function uxdTownTick(){const now=uxdInTown();if(UXD.town==null){UXD.town=now;return}if(now===UXD.town)return;UXD.town=now;if(now)uxdArrive();else uxdLeave()}
function uxdLeave(){UXD.hunt={lvl:P.lvl,xp:P.xp,gold:P.gold,items:UXD.items}}
function uxdHuntText(){const h=UXD.hunt;if(!h)return '';const need=l=>Math.max(1,xpNeed(l)),at=(l,x)=>l>=MAXLV?l*100:l*100+x/need(l)*100;
  let xp=at(P.lvl,P.xp)-at(h.lvl,h.xp);if(!(xp>=.05))xp=0;const g=P.gold-h.gold,n=UXD.items-h.items,out=[];
  if(xp)out.push(`경험치 +${xp>=10?Math.round(xp):xp.toFixed(1)}%${P.lvl>h.lvl?` (레벨 +${P.lvl-h.lvl})`:''}`);if(g)out.push(`금화 ${g>0?'+':'−'}${Math.abs(g).toLocaleString()}`);if(n>0)out.push(`장비 ${n}개`);
  return out.length?'이번 사냥: '+out.join(' · '):''}
function uxdArrive(){const t=uxdHuntText();UXD.hunt=null;if(t)msg(t,'#d6b262');if(!IN)uxdRefill()}
function uxdShopTown(){const t=nearestTown(P.x,P.y).t;return t&&((t.shops&&t.shops.some(s=>s.type==='general'))||t.shop)?t:null}
function uxdRefill(t){const c=uxdCfg();if(!(c.hp||c.mp||c.tp)||!uxdOn()||P.dead)return null;t=t||uxdShopTown();if(!t)return null;
  const got=[];let spent=0,short=0;
  for(const k of ['hp','mp']){if(!c[k])continue;let T=-1;for(let i=0;i<POT_T.length;i++)if(potOpen(t,i))T=i;if(T<0)continue;
    let have=0;for(let i=T;i<POT_T.length;i++)have+=potN(k,i);const need=c[k]-have;if(need<=0)continue;const pr=potPriceT(k,T),q=Math.min(need,Math.floor(P.gold/pr));short+=need-q;
    if(q>0){P.gold-=q*pr;spent+=q*pr;potAdd(k,T,q);got.push(`${potName(k,T)} ${q}`)}}
  if(c.tp){const need=c.tp-tpCount();if(need>0){const pr=potPrice(t),q=Math.min(need,Math.floor(P.gold/pr));short+=need-q;if(q>0){P.gold-=q*pr;spent+=q*pr;P.pot.tp=tpCount()+q;got.push(`귀환 두루마리 ${q}`)}}}
  if(!got.length&&!short)return null;
  const s=got.length?`마을에서 채웠습니다: ${got.join(' · ')} (금화 ${spent.toLocaleString()})${short?` · 금화가 모자라 ${short}개는 못 샀어요`:''}`:'금화가 모자라 물약을 채우지 못했습니다';
  msg(s,'#e8c35a');try{buildBar()}catch(_){}save();return {got,spent,short}}

/* ===== Q5 돌아가는 문 ===== */
function uxdLeavePt(){if(DG){const d=DG.d,c=CAVES[DG.ci];if(!d||!DG.ret)return null;
    const auto=!!(c&&c.cave===d&&d.boss&&!d.arena&&!d.trial&&!DG.a21&&!DG.c21t&&!DG.j3t);return {reg:REG.id,x:DG.ret.x,y:DG.ret.y,dg:1,ci:DG.ci,cid:d.id,auto,n:d.n}}
  return {reg:REG.id,x:P.x,y:P.y,dg:0,n:zoneName(P.x,P.y)}}
function uxdDoorSpot(t){const g=t.gate||t,far=(x,y)=>[t.gate,t.stash,t.npc,...(t.shops||[])].every(o=>!o||Math.hypot(o.x-x,o.y-y)>=105)&&!decor.some(d=>d.k!=='flowerbed'&&d.k!=='wheat'&&Math.abs(d.x-x)<60&&Math.abs(d.y-y)<60&&Math.hypot(d.x-x,d.y-y)<(d.k==='tfolk'||d.k==='npc'?75:50));
  // 짝문 왼쪽(화면) → 오른쪽 → 아래 차례로, 막히지 않고 사람 · 가게 · 물건과 떨어진 첫 자리
  for(const [a,b] of [[-85,85],[-110,110],[85,-85],[110,-110],[-60,120],[120,-60],[60,100],[100,60],[0,150],[150,0],[-140,140],[140,-140]]){const x=g.x+a,y=g.y+b;if(!blockedAt(x,y)&&far(x,y))return {x,y}}return {x:g.x-85,y:g.y+85}}
function uxdDoorMake(lp){UXD.door=null;if(!lp||DG||!uxdOn()||P.dead)return null;if(NET.on&&NET.guest&&lp.reg!==REG.id)return null;
  if(!lp.dg&&lp.reg===REG.id&&inSafe(lp.x,lp.y,0))return null;const t=nearestTown(P.x,P.y).t;if(!t||!t.gate)return null;const sp=uxdDoorSpot(t);
  UXD.door=Object.assign({},lp,{town:t.id,treg:REG.id,dx:sp.x,dy:sp.y});msg(`짝문 옆에 「돌아가는 문」이 열렸습니다 (${lp.n}${lp.dg?' 입구':''})`,'#9fd0ff');return UXD.door}
function uxdDoorTick(){const d=UXD.door;if(!d)return;if(DG||REG.id!==d.treg){UXD.door=null;return}
  if(UXD.town&&!IN){const nt=nearestTown(P.x,P.y);if(nt.t&&nt.t.id!==d.town&&nt.d<tSafe(nt.t)){UXD.door=null;return}}
  if(!P.dead&&!IN&&Math.hypot(P.x-d.dx,P.y-d.dy)<UXD.DOOR_R)act='uxd_door'}
function uxdDoorGo(){const d=UXD.door;if(!d||!uxdOn()||P.dead)return false;UXD.door=null;
  const fx=(x,y)=>{burst(x,y,'#7ab8ff',36,170,4,20);rings.push({x,y,r:8,max:95,life:.6,col:'#7ab8ff'})};fx(P.x,P.y);
  if(d.reg!==REG.id)switchRegion(d.reg,d.x,d.y,true);else{P.x=d.x;P.y=d.y;for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}followCam()}
  fx(P.x,P.y);
  if(d.dg&&d.auto&&!NET.guest){const c=CAVES[d.ci];if(c&&c.cave&&c.cave.id===d.cid){actCave=c;act='dungeon';doAct();if(DG){save();return true}}}
  msg(`돌아가는 문: ${d.n}${d.dg?' 입구':''}(으)로 돌아왔습니다`,'#9fd0ff');if(NET.on){try{if(NET.host)netAreaNow();else netSendState()}catch(_){}}save();return true}
{const _tp=townPortal;townPortal=function(){let lp=null;try{if(uxdOn()&&!P.dead)lp=uxdLeavePt()}catch(e){uxdErr(e)}const r=_tp.apply(this,arguments);try{if(r&&!DG)uxdDoorMake(lp)}catch(e){uxdErr(e)}return r}}
setTimeout(()=>{const b=document.getElementById('respawn');if(!b||!b.onclick)return;const _o=b.onclick;// maze21.js도 같은 식으로 감싼다(그보다 바깥)
  b.onclick=function(){let lp=null;try{if(uxdOn()&&P.dead)lp=uxdLeavePt()}catch(e){uxdErr(e)}const r=_o.apply(this,arguments);try{if(!DG&&uxdOn()&&!P.dead)uxdDoorMake(lp)}catch(e){uxdErr(e)}return r}},0);
{const _tl=twActLabel;twActLabel=function(a){if(a==='uxd_door'&&UXD.door)return `돌아가는 문: ${UXD.door.n}${UXD.door.dg?' 입구':''} (F)`;return _tl.apply(this,arguments)}}
{const _da=doAct;doAct=function(){if(act==='uxd_door'){uxdDoorGo();return}return _da.apply(this,arguments)}}
function uxdDoorDraw(){const d=UXD.door;if(!d||DG||REG.id!==d.treg)return;const s=W2S(d.dx,d.dy);if(!onScreen(s,140))return;const t=time;
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5;glow(s.x,s.y-36,78,'#4a8aff');ctx.globalAlpha=.55;ctx.strokeStyle='#7ab8ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x,s.y,30,13,0,0,6.283);ctx.stroke();
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.78;ctx.fillStyle='#16306a';ctx.beginPath();ctx.ellipse(s.x,s.y-40,22,39,0,0,6.283);ctx.fill();
  ctx.globalCompositeOperation='lighter';ctx.lineWidth=2.5;for(let i=0;i<3;i++){const a=t*(1.4+i*.5)+i*2.1;ctx.globalAlpha=.55-i*.12;ctx.strokeStyle=i?'#9fd0ff':'#e8f4ff';ctx.beginPath();ctx.ellipse(s.x,s.y-40,17-i*4,34-i*8,0,a,a+3.6);ctx.stroke()}
  ctx.globalAlpha=.95;ctx.strokeStyle='#bfe0ff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(s.x,s.y-40,22,39,0,0,6.283);ctx.stroke();
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.font=`700 12px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('돌아가는 문',s.x,s.y-88);ctx.fillStyle='#bfe0ff';ctx.fillText('돌아가는 문',s.x,s.y-88);
  ctx.restore()}
{const _dc=drawCorpses;drawCorpses=function(){const r=_dc.apply(this,arguments);try{uxdDoorDraw()}catch(e){uxdErr(e)}return r}}

/* ===== Q6 발밑 고리 + 가려질 때 윤곽 (휴대폰) ===== */
function uxdRing(s,col){ctx.save();ctx.globalAlpha=.55;ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=3.4;ctx.beginPath();ctx.ellipse(s.x,s.y+1,23*PK,10.5*PK,0,0,6.283);ctx.stroke();
  ctx.globalAlpha=.92;ctx.strokeStyle=col;ctx.lineWidth=1.6;ctx.stroke();ctx.restore()}
// 앞(깊이가 더 큼)에 서서 내 몸 상자와 겹치는 것: 몬스터 · 키 큰 장식(나무 · 기둥 …)
const UXD_TALL=/tree|pine|birch|oak|dead|palm|willow|cypress|spruce|fir|cedar|ruinpillar|statue|obelisk|totem|pillar|crystal|lamp|banner|tent/;
function uxdOcc(){const s=P._s;if(!s||P.dead)return false;const pd=P.zk!=null?P.zk:P.x+P.y,hx0=s.x-13*PK,hx1=s.x+13*PK,hy0=s.y-56*PK,hy1=s.y-8;
  const hit=(x0,x1,y0,y1)=>Math.min(x1,hx1)-Math.max(x0,hx0)>5&&Math.min(y1,hy1)-Math.max(y0,hy0)>8;
  for(const e of enemies){if(e.dead||!e._s)continue;const d=e.zk!=null?e.zk:e.x+e.y;if(d<=pd)continue;const es=e._s;if(es.y<s.y||es.y-s.y>220)continue;const r=(TYPES[e.k]&&TYPES[e.k].r||e.r||14)*(e.sc||(e.elite?1.25:1));if(hit(es.x-r*1.1,es.x+r*1.1,es.y-r*2.6,es.y))return true}
  // 장식은 그려지는 것만(ground.js decoVisible · 내 칸 둘레 3×3 칸 · 품질 「낮음」에서 솎아 낸 것은 빠짐)
  if(!DG){const cx=Math.floor(P.x/CH),cy=Math.floor(P.y/CH),L=UXD.dv||(UXD.dv=[]);L.length=0;decoVisible(cx,cx,cy,cy,L);for(const d of L){if(Math.abs(d.x-P.x)>300||Math.abs(d.y-P.y)>300)continue;if(d._uxt==null)d._uxt=typeof d.k==='string'&&UXD_TALL.test(d.k)?1:0;if(!d._uxt)continue;
    const dd=d.zk!=null?d.zk:d.x+d.y;if(dd<=pd)continue;const ds=W2S(d.x,d.y),k=d.s||1,y=ds.y-(d.zh||0),w=(/tree|pine|birch|oak|dead|palm|willow|cypress|spruce|fir|cedar/.test(d.k)?40:16)*k,h=(/lamp|banner|tent/.test(d.k)?80:140)*k;
    if(hit(ds.x-w,ds.x+w,y-h,y))return true}}
  return false}
function uxdOutline(){const s=P._s;if(!s)return;const k=DPR,W0=140,H0=170,F=H0-16,wp=Math.ceil(W0*k),hp=Math.ceil(H0*k);let c=UXD.oc;
  if(!c)c=UXD.oc={a:document.createElement('canvas'),b:document.createElement('canvas')};for(const v of [c.a,c.b])if(v.width!==wp||v.height!==hp){v.width=wp;v.height=hp}
  const ga=c.a.getContext('2d'),gb=c.b.getContext('2d');ga.setTransform(1,0,0,1,0,0);ga.globalCompositeOperation='source-over';ga.clearRect(0,0,wp,hp);ga.setTransform(k,0,0,k,0,0);
  const sh=Kit.shadow;Kit.shadow=()=>{};try{drawFigure(ga,P,W0/2,F,PK,{bs:Math.max(1,DPR)*HS*PK})}finally{Kit.shadow=sh}
  ga.setTransform(1,0,0,1,0,0);ga.globalCompositeOperation='source-in';ga.fillStyle='#fff1c8';ga.fillRect(0,0,wp,hp);ga.globalCompositeOperation='source-over';
  gb.setTransform(1,0,0,1,0,0);gb.globalCompositeOperation='source-over';gb.clearRect(0,0,wp,hp);const o=Math.max(1.4,1.7*k);for(let i=0;i<8;i++){const a=i*.7854;gb.drawImage(c.a,Math.cos(a)*o,Math.sin(a)*o)}
  gb.globalCompositeOperation='destination-out';gb.drawImage(c.a,0,0);gb.globalCompositeOperation='source-over';
  const mt=P.g42&&P.g42.mt,y=s.y-(mt&&mt.on&&!DG?24*PK:0);
  ctx.save();ctx.setTransform(DPR,0,0,DPR,DPR*shx,DPR*shy);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.16;ctx.drawImage(c.a,s.x-W0/2,y-F,W0,H0);ctx.globalAlpha=.95;ctx.drawImage(c.b,s.x-W0/2,y-F,W0,H0);ctx.restore();UXD.outN++}
{const _dh=drawHero;drawHero=function(){const on=uxdPh()&&!!P&&!!P._s&&!P.dead;try{if(on)uxdRing(P._s,'#fff0b8')}catch(e){uxdErr(e)}const r=_dh.apply(this,arguments);try{UXD.occ=on&&uxdOcc()}catch(e){UXD.occ=false;uxdErr(e)}return r}}
{const _dr=drawRemote;drawRemote=function(o){try{if(uxdPh()&&o&&o._s&&!o.dead&&onScreen(o._s,120))uxdRing(o._s,'#7fd8ff')}catch(e){uxdErr(e)}return _dr.apply(this,arguments)}}
{const _g=drawV5Glow;drawV5Glow=function(){const r=_g.apply(this,arguments);try{if(UXD.occ&&uxdPh())uxdOutline();UXD.occ=false}catch(e){uxdErr(e)}return r}}

/* ===== Q7 피해 숫자 ===== */
function uxdDn(){const v=UXD.dev.dn;return UXD.DN.includes(v)?v:(uxdPh()?'big':'all')}
{const _he=hurtE;hurtE=function(e){const p=UXD.tg;UXD.tg=e||null;try{return _he.apply(this,arguments)}finally{UXD.tg=p}}}
function uxdDnOne(o,who){const me=who===P,m=uxdDn();
  if(m==='off'){o.h45=1;return}
  if(m==='big'&&!me&&!o.big&&!uxdBossy(who)){o.h45=1;return}
  if(m==='all'&&!uxdPh())return;// PC 「모두」 = 예전 그대로
  if(!who)return;const L=UXD.mergeW.get(who);
  if(L&&!L.h45&&L.life>0&&time-L.t45<=UXD.MERGE){if(me)L.t='-'+(Math.abs(parseInt(L.t,10)||0)+Math.abs(parseInt(o.t,10)||0));else L.t=(+L.t||0)+(+o.t||0);
    if(o.big){L.big=o.big;L.c=o.c}L.life=Math.max(L.life,.9);o.h45=1;return}
  o.t45=time;UXD.mergeW.set(who,o)}
{const _ft=ftext;ftext=function(x,y,t){const n=texts.length,r=_ft.apply(this,arguments);
  try{const num=typeof t==='number',hurt=UXD.inHit>0&&typeof t==='string'&&/^-\d+$/.test(t);if((num||hurt)&&texts.length>n){const o=texts[texts.length-1];if(hurt)UXD.hitD=Math.abs(parseInt(t,10));uxdDnOne(o,num?UXD.tg:P)}}catch(e){uxdErr(e)}return r}}

/* ===== Q11 쓰러진 이유 ===== */
{const _uw=updateWarns;updateWarns=function(){const h=UXD.how;UXD.how='범위 공격';try{return _uw.apply(this,arguments)}finally{UXD.how=h}}}
{const _dh=dashHits;dashHits=function(){const h=UXD.how;UXD.how='돌진';try{return _dh.apply(this,arguments)}finally{UXD.how=h}}}
function uxdHow(src){if(UXD.how)return UXD.how;if(!src)return '';const t=TYPES[src.k];if(!('x' in src)||(t&&t.ranged))return '원거리 공격';return '근접 공격'}
{const _hp=hitPlayer;hitPlayer=function(d,src){const h0=P.hp,dead0=P.dead;UXD.inHit++;UXD.hitD=null;let r;try{r=_hp.apply(this,arguments)}finally{UXD.inHit--}
  try{if(!dead0&&P.hp<h0){const t=src&&TYPES[src.k];UXD.last={n:t?(src.elite?'정예 ':'')+t.n:'',how:uxdHow(src),d:UXD.hitD!=null?UXD.hitD:Math.max(1,Math.round(h0-P.hp))}}
    if(!dead0&&P.dead)uxdWhy()}catch(e){uxdErr(e)}return r}}
function uxdWhyText(){const L=UXD.last;if(!L)return '';return L.n?`마지막에 맞은 것: ${L.n}의 ${L.how||'공격'} ${L.d.toLocaleString()}`:`마지막에 맞은 피해: ${L.d.toLocaleString()}`}
function uxdWhy(){const card=document.querySelector('#death .card');if(!card)return '';let p=document.getElementById('uxdWhy');
  if(!p){p=document.createElement('p');p.id='uxdWhy';const row=card.querySelector('.row');card.insertBefore(p,row||null)}const t=uxdWhyText();p.textContent=t;p.hidden=!t;return t}
function uxdWhyClear(){const p=document.getElementById('uxdWhy');if(p){p.textContent='';p.hidden=true}}

/* ===== Q8 걸으며 보는 큰 지도 (휴대폰) ===== */
function uxdMapEl(){let el=document.getElementById('uxdMap');if(el)return el;el=document.createElement('div');el.id='uxdMap';el.hidden=true;el.setAttribute('aria-hidden','true');
  el.innerHTML='<canvas id="uxdMapCv"></canvas>';const g=document.getElementById('game');if(g)g.after(el);else document.body.appendChild(el);
  const x=document.createElement('button');x.type='button';x.id='uxdMapX';x.hidden=true;x.textContent='지도 닫기 ✕';x.setAttribute('aria-label','반투명 큰 지도 닫기');document.body.appendChild(x);
  x.addEventListener('click',e=>{e.stopPropagation();uxdMapOpen(false)});x.addEventListener('pointerdown',e=>e.stopPropagation());return el}
function uxdMapBox(){const vp=typeof M22==='object'&&M22.vp?M22.vp():{w:innerWidth,h:innerHeight},L=M22.mode()!=='P';
  if(L){const top=58,bot=82,side=Math.max(100,Math.round(vp.w*.14));return {x:side,y:top,w:vp.w-side*2,h:Math.max(120,vp.h-top-bot)}}
  // 세로: 오른쪽 위 의뢰 알림판(#qhud)과 겹치지 않게 그 아래에 놓아요(자리가 모자라면 원래 자리)
  const w=vp.w-16;let y=Math.round(vp.h*.2);const q=document.getElementById('qhud');if(q&&!q.hidden&&q.offsetHeight>0){const qb=Math.round(q.getBoundingClientRect().bottom)+8;if(vp.h-qb-96>=220)y=Math.max(y,qb)}
  const h=Math.min(w,Math.round(vp.h*.48),vp.h-y-96);return {x:8,y,w,h:Math.max(160,h)}}
function uxdMapOpen(on){on=on==null?!UXD.map:!!on;if(on&&(!uxdPh()||!uxdOn()))on=false;UXD.map=on?1:0;const el=uxdMapEl(),x=document.getElementById('uxdMapX');el.hidden=!on;if(x)x.hidden=!on;if(on)uxdMapDraw();return on}
function uxdMapDraw(){if(!UXD.map)return;const el=uxdMapEl(),cv=document.getElementById('uxdMapCv'),b=uxdMapBox(),dp=Math.min(2,devicePixelRatio||1);
  el.style.left=b.x+'px';el.style.top=b.y+'px';el.style.width=b.w+'px';el.style.height=b.h+'px';const x=document.getElementById('uxdMapX');if(x){x.style.left=Math.round(b.x+b.w-x.offsetWidth-6)+'px';x.style.top=Math.round(b.y+6)+'px'}
  if(cv.width!==Math.round(b.w*dp)||cv.height!==Math.round(b.h*dp)){cv.width=Math.round(b.w*dp);cv.height=Math.round(b.h*dp)}
  const g=cv.getContext('2d');g.setTransform(dp,0,0,dp,0,0);g.clearRect(0,0,b.w,b.h);UXD.mapT=time;
  if(DG){const s=Math.min(b.w,b.h)-12;g.imageSmoothingEnabled=true;g.globalAlpha=.95;g.drawImage(mm,(b.w-s)/2,(b.h-s)/2,s,s);g.globalAlpha=1;return}
  // 지도 창(M)과 같은 그림(wmapRegion). 그 함수가 끝에 범례(#wmapLeg)를 쓰므로 창이 아직 없으면 잠깐 빈 칸을 둔다
  let tmp=null;if(!document.getElementById('wmapLeg')){tmp=document.createElement('div');tmp.id='wmapLeg';tmp.hidden=true;el.appendChild(tmp)}
  try{wmapRegion(g,b.w,b.h)}finally{if(tmp)tmp.remove()}}
document.addEventListener('click',e=>{if(e.target!==mm||!uxdPh())return;e.stopImmediatePropagation();e.preventDefault();uxdMapOpen()},true);
{const _dm=drawMinimap;drawMinimap=function(){const r=_dm.apply(this,arguments);try{if(UXD.map){if(!uxdPh()||!uxdOn()||!$('#intro').hidden)uxdMapOpen(false);else if(time-UXD.mapT>.4||time<UXD.mapT)uxdMapDraw()}}catch(e){uxdErr(e)}return r}}

/* ===== Q10 희귀 장비 띠 알림 + 화면 밖 화살표 (휴대폰) ===== */
// 화면 가장자리 화살표는 mux45.js(2차 10번 보스 · 동료 화살표)의 m45Edge · m45Arrow를 그대로 쓴다(따로 만들지 않음 · mux45가 없는 빌드면 화살표만 안 그림)
const uxdIName=it=>typeof itemName==='function'?itemName(it):it.name;
function uxdLootScan(){for(const l of loot){if(l._u45d)continue;l._u45d=1;if(l.kind!=='item'||!l.item||!(l.item.rar>=3)||(l.t||0)>1.5)continue;uxdRare(l)}}
function uxdRare(l){UXD.rare.push(l);if(UXD.rare.length>12)UXD.rare.shift();const it=l.item,R0=RAR[it.rar]||RAR[3];uxdVib(45,'rare');if(uxdPh())uxdBand(`${R0.n} 「${uxdIName(it)}」이(가) 떨어졌습니다`,R0.c)}
function uxdBand(t,col){let el=document.getElementById('uxdBand');if(!el){el=document.createElement('div');el.id='uxdBand';el.setAttribute('role','status');document.body.appendChild(el)}
  el.textContent=t;el.style.color=col||'';el.style.borderColor=col||'';el.hidden=false;el.classList.remove('off');
  uxdBandPlace(el);
  clearTimeout(UXD.bandT);UXD.bandT=setTimeout(()=>{el.classList.add('off');UXD.bandT=setTimeout(()=>{el.hidden=true},400)},UXD.BAND_MS);return el}
// 위쪽 띠 자리: ux45a의 위쪽 칸(u45TopArea)에 두되, 이미 떠 있는 위쪽 알림(ux45a 지난번 한 줄 #u45sum · 중요한 의뢰 띠 .u45band · mux45 저절로 걷기 #m45aw)과 겹치면 그 아래로
function uxdBandPlace(el){el=el||document.getElementById('uxdBand');if(!el||el.hidden)return;let top=8,mid=null,mw=null;
  try{if(typeof u45TopArea==='function'){const a=u45TopArea();mid=Math.round(a.left+a.w/2);mw=a.w;if(a.top!=null)top=a.top}}catch(_){}
  el.style.left=mid!=null?mid+'px':'';el.style.maxWidth=mw!=null?mw+'px':'';el.style.top=top+'px';
  for(let k=0;k<3;k++){const b=el.getBoundingClientRect();let moved=false;
    for(const o of document.querySelectorAll('#u45sum,.u45band,#m45aw')){if(o===el||o.hidden||getComputedStyle(o).display==='none')continue;const r=o.getBoundingClientRect();if(!r.width||!r.height)continue;
      if(r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top){top=Math.round(r.bottom+4);el.style.top=top+'px';moved=true;break}}if(!moved)break}}
function uxdRareDraw(){if(!UXD.rare.length||!uxdPh()||P.dead||typeof m45Edge!=='function'||typeof m45Arrow!=='function')return;ctx.save();S();
  try{for(const l of UXD.rare){if(l.taken||!loot.includes(l))continue;const s=W2S(l.x,l.y);if(s.x>=-10&&s.y>=-10&&s.x<=W+10&&s.y<=H+10)continue;const p=W2S(P.x,P.y),an=Math.atan2(s.y-p.y,s.x-p.x),q=m45Edge(an,22),R0=RAR[l.item.rar]||RAR[3];
    m45Arrow(q.x,q.y,an,R0.c,R0.n);UXD.arrN++}}finally{ctx.restore()}}
{const _r=render;render=function(){const all=texts;let sw=false;for(const t of all)if(t.h45){sw=true;break}let F=null,n0=0;if(sw){F=all.filter(t=>!t.h45);n0=F.length;texts=F}
  let r;try{r=_r.apply(this,arguments)}finally{if(sw){if(texts===F&&F.length>n0)for(let i=n0;i<F.length;i++)all.push(F[i]);texts=all}}
  try{uxdRareDraw()}catch(e){uxdErr(e)}return r}}

/* ===== Q13 가방 거의 참 ===== */
function uxdBagTick(){const n=P.bag.length;if(n>=UXD.BAG){if(!UXD.bagW){UXD.bagW=1;msg(`가방이 거의 찼습니다 (${n}/${BAG_MAX}) · 상점의 「지금 장비보다 약한 것 모두 판매」로 한 번에 정리할 수 있어요`,'#e8c35a');return true}}else if(n<UXD.BAG)UXD.bagW=0;return false}
{const _rp=renderPanel;renderPanel=function(){const r=_rp.apply(this,arguments);try{if(tab==='shop'&&uxdOn()&&P.bag.length>=UXD.BAG)pbody.querySelectorAll('[data-sellweak]').forEach(b=>b.classList.add('uxdflash'))}catch(e){uxdErr(e)}return r}}

/* ===== 매 update: 마을 들고 나기 · 돌아가는 문 · 진동 · 희귀 장비 / 0.5초마다 가방 · 화살표 정리 · 금화 알림 묶기 ===== */
function uxdTick(){if(!uxdOn())return;uxdTownTick();uxdDoorTick();uxdWarnScan();uxdLootScan();
  if(UXD.ag.n&&(time-UXD.ag.t>1||time<UXD.ag.t))uxdAgFlush();
  if(time>=UXD.slowT||time<UXD.slowT-1){UXD.slowT=time+.5;uxdBagTick();uxdBandPlace();if(UXD.rare.length)UXD.rare=UXD.rare.filter(l=>!l.taken&&loot.includes(l))}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{uxdTick()}catch(e){uxdErr(e)}return r}}

/* ===== 설정 ⚙ ===== */
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);try{const el=SET24.el;if(!el||el.hidden)return;const sep=el.querySelector('.s24sep');
  const seg=(k,v,lab,cur)=>`<button type="button" class="s24seg${cur===v?' on':''}" data-uxd="${k}" data-v="${v}" aria-pressed="${cur===v}">${lab}</button>`;
  const box=(tab,h)=>{const b=document.createElement('div');b.className='m43set uxdset';b.dataset.tab45=tab;b.innerHTML=h;el.insertBefore(b,sep||null);return b};
  if(uxdOn()){const c=uxdCfg(),n=v=>v?String(v):'끔';
    box('조작',`<div class="s24h">주우면 바로 금화로</div><div class="s24row">${UXD.AG.map(v=>seg('ag',v,UXD.AGN[v],c.ag)).join('')}</div>
      <div class="s24n">고른 등급 장비는 줍는 순간 상점에 판 값만큼 금화가 돼요. 의뢰 · 전직 · 현상금 보상, 홈이 있거나 재련 · 마법 부여한 장비, 지금 입은 것보다 좋은 장비는 그대로 주워요. 캐릭터마다 따로 저장돼요</div>`);
    box('조작',`<div class="s24h">마을에서 물약 채우기</div><div class="s24row"><span class="m43l">생명</span>${UXD.RF.map(v=>seg('hp',v,n(v),c.hp)).join('')}</div>
      <div class="s24row" style="margin-top:4px"><span class="m43l">마나</span>${UXD.RF.map(v=>seg('mp',v,n(v),c.mp)).join('')}</div>
      <div class="s24row" style="margin-top:4px"><span class="m43l">귀환</span>${UXD.RFT.map(v=>seg('tp',v,n(v),c.tp)).join('')}</div>
      <div class="s24n">마을에 들어서면 모자란 만큼 잡화점 값 그대로 사요. 물약은 그 마을 잡화점에서 파는 가장 좋은 등급으로 사고, 그 등급 이상만 세요. 금화가 모자라면 살 수 있는 만큼만. 캐릭터마다 따로 저장돼요</div>`)}
  const dn=uxdDn();box('화면',`<div class="s24h">피해 숫자</div><div class="s24row">${UXD.DN.map(v=>seg('dn',v,UXD.DNN[v],dn)).join('')}</div>
    <div class="s24n">큰 것만: 치명타 · 보스 · 내가 받은 피해만 보여요.${uxdPh()?' 같은 적에게 짧은 사이에 뜬 숫자는 하나로 합쳐 보여요.':''} 처음 값은 휴대폰 큰 것만, 컴퓨터 모두예요. 이 기기에 저장돼요</div>`);
  // Q12: v43 「위험 알림 진동」 칸을 「진동」 하나로 (같은 설정 FB28.vib)
  const vb=el.querySelector('[data-m43vib]'),vbox=vb&&vb.closest('.m43set');if(vbox){vbox.dataset.tab45='알림';const h=vbox.querySelector('.s24h'),nt=vbox.querySelector('.s24n');if(h)h.textContent='진동';
    if(nt)nt.textContent='생명이 30% 아래로 내려갈 때(위험 알림 진동) · 보스의 큰 공격 예고 · 레벨 업 · 세트 · 유니크 장비가 떨어질 때 아주 짧게 떨려요(되는 휴대폰만). 끄면 모든 진동이 꺼져요. 이 기기에 저장돼요'}
  el.querySelectorAll('[data-uxd]').forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.uxd,v=b.dataset.v;
    if(k==='dn'){if(UXD.DN.includes(v)){UXD.dev.dn=v;uxdDevSave()}}else uxdSet(k,v);set24Draw();set24Place()})}catch(e){uxdErr(e)}}}

{const st=document.createElement('style');st.textContent=`
#uxdMap{position:fixed;pointer-events:none;border-radius:10px;background:rgba(8,7,5,.42);box-shadow:0 0 0 1px rgba(214,178,98,.35);opacity:.82;overflow:hidden}
#uxdMap canvas{width:100%;height:100%;display:block;pointer-events:none}
#uxdMapX{position:fixed;z-index:31;pointer-events:auto;min-height:36px;padding:6px 12px;border:1px solid #8a7346;border-radius:6px;background:rgba(20,16,10,.9);color:#efe2c0;font-size:13px}
#uxdBand{position:fixed;z-index:46;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translateX(-50%);max-width:min(520px,calc(100% - 24px));box-sizing:border-box;padding:6px 14px;
  background:rgba(14,11,8,.9);border:1px solid #c8a060;border-radius:16px;font-size:13.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;transition:opacity .4s;box-shadow:0 4px 14px rgba(0,0,0,.55)}
#uxdBand.off{opacity:0}
#uxdWhy{margin:0 auto 10px;color:#ffb0a0;font-size:14px}
#pbody button.uxdflash{animation:uxdflash .7s ease-in-out 5 alternate;border-color:#ffd76a}
@keyframes uxdflash{from{box-shadow:0 0 0 0 rgba(255,215,106,0);background:inherit}to{box-shadow:0 0 0 3px rgba(255,215,106,.85);background:#5a4418}}
@media (prefers-reduced-motion:reduce){#pbody button.uxdflash{animation:none;box-shadow:0 0 0 3px rgba(255,215,106,.85)}}`;document.head.appendChild(st)}
setTimeout(()=>{try{window.__ux45d={UXD,uxdCfg,uxdSet,uxdClean,uxdAgOk,uxdAgFlush,uxdInTown,uxdTownTick,uxdHuntText,uxdRefill,uxdLeavePt,uxdDoorMake,uxdDoorGo,uxdDoorSpot,uxdOcc,uxdOutline,
  uxdDn,uxdDnOne,uxdWhy,uxdWhyText,uxdHow,uxdMapOpen,uxdMapDraw,uxdMapBox,uxdRare,uxdBand,uxdBagTick,uxdVib,uxdBandPlace,uxdRareDraw};if(window.__game)window.__game.UXD=UXD}catch(_){}},0);
