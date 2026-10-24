/* ---------- v42 도전 던전 (제안 13) · 쉼터 습격 방어전 (제안 12) ----------
   · 도전 던전: 55레벨 이상 보통 던전(이야기 던전 · 시험 · 투기장 빼고)에 그날의 규칙 둘이 붙는다. 「성장 → 도전」에서 켜고 들어간다.
     보스를 쓰러뜨린 시간으로 금 · 은 · 동. 던전마다 하루에 한 번, 더 좋은 등급을 처음 받을 때 그 등급 상자.
   · 쉼터 습격: 여섯 쉼터(갈대 · 가마 · 수정 · 설원 · 종원 · 장막)의 울타리 뿔피리. 다섯 무리 + 습격 대장. 울타리가 버티면 상자, 3시간에 한 번.
   · 함께하면 무리가 커지고(사람마다 +50%), 같은 곳의 동료도 상자를 받는다.
   · 저장: P.g42.ch {day, got:{던전id:등급}}, P.g42.rd {쉼터id: 마지막으로 막은 때(ms)}. 없으면 비어 있다. */
const G42_CHM=[
 {k:'hp',n:'단단한 무리',d:'몬스터 체력 +35%'},
 {k:'dmg',n:'성난 무리',d:'몬스터 공격력 +25%'},
 {k:'elite',n:'정예 잔치',d:'일반 몬스터 넷 중 하나가 정예'},
 {k:'pot',n:'마른 샘',d:'물약 회복량 −40%'},
 {k:'fire',n:'불타는 바닥',d:'6초마다 발밑에 불길이 솟는다(피하기)'}];
const G42_CHG=[{k:'gold',n:'금',col:'#ffd76a',f:.65,xp:.08,gold:400,force:'uniq'},{k:'silver',n:'은',col:'#d8e0ea',f:1,xp:.06,gold:280,force:'set'},{k:'bronze',n:'동',col:'#d89a6a',f:1e9,xp:.04,gold:180,force:null}];
const G42_CHLV=35;// v45: 55에서 35로 (사용자 「30~60에도 성장 선택지」) · 습격도 이 레벨부터
const G42D={on:false,raid:null,near:{}};
function g42Ch(){const g=g42S();if(!v20Obj(g.ch))g.ch={};const c=g.ch,day=v20Day();if(c.day!==day){c.day=day;c.got={}}if(!v20Obj(c.got))c.got={};return c}
function g42Rd(){const g=g42S();if(!v20Obj(g.rd))g.rd={};return g.rd}
// 그날의 규칙 둘 (날짜로 정해져서 모두 같다)
function g42ChMods(day){const h=v20Hash('g42ch|'+(day||v20Day())),a=h%G42_CHM.length;let b=(h>>>8)%(G42_CHM.length-1);if(b>=a)b++;return [G42_CHM[a],G42_CHM[b]]}
const g42ChOk=()=>!!(DG&&DG.d&&!DG.a21&&!DG.d.arena&&!DG.d.trial&&!DG.j2t&&!DG.j3t&&!DG.b4&&DG.ci>=0&&DG.ci<900&&DG.boss&&DG.lvl>=G42_CHLV);
const g42ChHas=k=>!!(DG&&DG.g42ch&&DG.g42ch.mods.includes(k));
const g42ChPar=()=>Math.round(70+DG.rooms.length*16);
function g42ChMob(e){const C=DG&&DG.g42ch;if(!C||!e||e.g42cm)return e;e.g42cm=1;
  if(C.mods.includes('elite')&&!e.boss&&!e.elite&&R()<.25){e.elite=true;e.hp*=3;e.max*=3;e.dmg*=1.4;e.r*=1.25}
  if(C.mods.includes('hp')){e.hp=Math.round(e.hp*1.35);e.max=Math.round(e.max*1.35)}
  if(C.mods.includes('dmg'))e.dmg*=1.25;return e}
{const _ed=enterDungeon;enterDungeon=function(c){const r=_ed.apply(this,arguments);try{if(DG&&G42D.on&&!NET.guest&&g42ChOk()){const M=g42ChMods();DG.g42ch={mods:M.map(m=>m.k),t:0,par:g42ChPar(),ft:3,end:0};for(const e of enemies)g42ChMob(e);
    banner={t:`도전 · ${DG.d.n}`,sub:`${M.map(m=>m.n).join(' · ')} · 금 ${g42Clock(DG.g42ch.par*G42_CHG[0].f)} 안에`,col:'#ffd76a',life:3,max:3};msg(`도전 던전: ${M.map(m=>`「${m.n}」 ${m.d}`).join(' / ')}`,'#ffd76a');v20Send('g42chs',{mods:DG.g42ch.mods,par:DG.g42ch.par})}}catch(e){if(window.__QA)throw e}return r}}
{const _dm=dgMob;dgMob=function(){const e=_dm.apply(this,arguments);try{if(DG&&DG.g42ch)g42ChMob(e)}catch(err){if(window.__QA)throw err}return e}}
{const _dp=drinkPotion;drinkPotion=function(k){const ok=_dp.apply(this,arguments);try{if(ok&&g42ChHas('pot')&&P.potHot&&P.potHot[k])P.potHot[k].rate*=.6}catch(e){if(window.__QA)throw e}return ok}}
const g42Clock=s=>{s=Math.max(0,Math.round(s));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
const g42ChGrade=(sec,par)=>G42_CHG.find(G=>sec<=par*G.f)||G42_CHG[2];
V20.tick.push(dt=>{const C=DG&&DG.g42ch;if(!C||C.end||!P)return;if(!paused)C.t+=dt;
  if(C.mods.includes('fire')&&q30Host()){C.ft-=dt;if(C.ft<=0){C.ft=6;const tg=[P];try{if(NET.on)for(const p of NET.peers.values())if(netSame(p)&&!p.dead)tg.push(p)}catch(_){}
    for(const t of tg){if(t.dead)continue;const a=R()*6.283,r=rnd(0,40);warns.push({x:t.x+Math.cos(a)*r,y:t.y+Math.sin(a)*r,rad:90,t:1.3,max:1.3,dmg:(10+DG.lvl*6),col:'#ff7a3a'})}}}});
// 보스가 쓰러지면 등급 · 상자
function g42ChReward(gr,lvl,dgId,via){const c=g42Ch(),G=G42_CHG.find(x=>x.k===gr);if(!G)return null;const rank=x=>G42_CHG.findIndex(y=>y.k===x),had=c.got[dgId];
  if(had&&rank(had)<=rank(gr)){const gold=Math.round(lvl*40);P.gold+=gold;msg(`도전 ${G.n} · 오늘 이 던전 상자는 이미 받았습니다 (금화 ${gold.toLocaleString()})`,G.col);return 'again'}
  c.got[dgId]=gr;const L=Math.max(1,lvl|0),xp=Math.round(xpNeed(P.lvl)*G.xp),gold=L*G.gold;let it=makeItem(L,true,null,G.force&&R()<(G.k==='gold'?.5:.35)?G.force:null);
  if(it&&it.rar<2){for(let i=0;i<60;i++){const x=makeItem(L,true);if(x&&x.rar>=2){it=x;break}}}
  if(P.bag.length<BAG_MAX)P.bag.push(it);else loot.push({x:P.x+rnd(-16,16),y:P.y+rnd(-16,16),kind:'item',item:it,t:0});P.gold+=gold;gainXp(xp);
  try{const a=g42Ac();a.chg=a.chg||{};a.chg[gr]=(a.chg[gr]|0)+1}catch(_){}
  rings.push({x:P.x,y:P.y,r:10,max:160,life:.9,col:G.col});burst(P.x,P.y,G.col,40,180,3,20);
  msg(`도전 ${G.n} 상자${via?' ('+via+')':''}: ${itemName(it)} · 금화 ${gold.toLocaleString()} · 경험치 ${xp.toLocaleString()}`,G.col);save();return gr}
{const _bd=dgBossDrop;dgBossDrop=function(e){const r=_bd.apply(this,arguments);try{const C=DG&&DG.g42ch,t=TYPES[e.k]||{};if(C&&!C.end&&t.boss){C.end=1;const G=g42ChGrade(C.t,C.par);
      banner={t:`도전 ${G.n}`,sub:`${DG.d.n} · ${g42Clock(C.t)} (금 ${g42Clock(C.par*G42_CHG[0].f)} · 은 ${g42Clock(C.par)})`,col:G.col,life:3.2,max:3.2};
      g42ChReward(G.k,DG.lvl,DG.d.id);v20Send('g42che',{g:G.k,lvl:DG.lvl,id:DG.d.id,t:Math.round(C.t)})}}catch(err){if(window.__QA)throw err}return r}}
// 동료: 방장이 도전으로 들어가면 같은 던전의 동료도 시간을 본다 · 끝나면 각자 상자
V20NET.g42chs=(m)=>{if(!NET.guest||!DG)return;DG.g42ch={mods:Array.isArray(m.mods)?m.mods.filter(k=>G42_CHM.some(x=>x.k===k)).slice(0,2):[],t:0,par:Math.max(30,m.par|0),ft:3,end:0,guest:1}};
V20NET.g42che=(m,r)=>{if(!NET.guest||!DG||!P||!G42_CHG.some(x=>x.k===m.g))return;if(DG.g42ch)DG.g42ch.end=1;g42ChReward(m.g,Math.min(P.lvl+10,m.lvl|0),String(m.id||'').slice(0,40),`${r&&r.name||'방장'}님과 함께`)};
G42.hudX.push(()=>{const C=DG&&DG.g42ch;if(!C)return '';const G=g42ChGrade(C.t,C.par);return `<b style="color:${G.col}">도전 ${g42Clock(C.t)} · 지금 ${G.n}</b>${C.end?'':` <span class="muted">(금 ${g42Clock(C.par*G42_CHG[0].f)} · 은 ${g42Clock(C.par)})</span>`}`});
V20A.g42chon=()=>{G42D.on=!G42D.on;msg(G42D.on?`다음에 들어가는 ${G42_CHLV}레벨 이상 던전은 도전 던전이 됩니다`:'도전 던전을 껐습니다',G42D.on?'#ffd76a':'#a39d8f')};
function g42ChHtml(){const M=g42ChMods(),c=g42Ch(),got=Object.keys(c.got);
  let h=`<div class="v20box"><h3>오늘의 도전 <span class="muted">· ${c.day} · 날마다 바뀝니다</span></h3>${M.map(m=>`<div class="v20row"><div><b style="color:#ffd76a">${m.n}</b> <span class="muted">${m.d}</span></div></div>`).join('')}
    <p class="muted" style="margin:6px 0">${G42_CHLV}레벨 이상 보통 던전(이야기 · 시련 던전 빼고)에 들어갈 때 붙습니다. 보스를 쓰러뜨린 시간으로 금 · 은 · 동을 받고, 던전마다 하루에 한 번 그 등급 상자를 받습니다. 동료와 함께 들어가면 동료도 상자를 받습니다.</p>
    <div class="btns">${v20Btn('g42chon',1,G42D.on?'도전 켜짐 (끄기)':'도전 켜기',{cls:G42D.on?'':'ghost',dis:P.lvl<G42_CHLV,title:P.lvl<G42_CHLV?`${G42_CHLV}레벨부터`:''})}</div></div>`;
  h+=`<div class="v20box"><h3>상자</h3>${G42_CHG.map(G=>`<div class="v20row"><div><b style="color:${G.col}">${G.n}</b> <span class="muted">${G.k==='gold'?'정한 시간의 65% 안':G.k==='silver'?'정한 시간 안 (방 수로 정함)':'시간과 상관없이'} · 희귀 이상 장비 · 금화 (던전 레벨 × ${G.gold}) · 경험치 그 레벨의 ${Math.round(G.xp*100)}%${G.force?` · ${G.k==='gold'?'절반은 유니크':'세 번에 하나꼴로 세트'}`:''}</span></div></div>`).join('')}</div>`;
  h+=`<div class="v20box"><h3>오늘 받은 상자 ${got.length}</h3>${got.length?got.map(id=>{const d=[...DUNGEONS,...(typeof WX_DUNGEONS!=='undefined'?WX_DUNGEONS:[])].find(d=>d&&d.id===id),G=G42_CHG.find(x=>x.k===c.got[id]);return `<div class="v20row"><div>${v20Esc(d?d.n:id)}</div><div style="color:${G?G.col:'#ccc'}">${G?G.n:''}</div></div>`}).join(''):'<p class="muted">아직 없습니다.</p>'}</div>`;
  return h}
G42.tabs.push({k:'ch',n:'도전',html:g42ChHtml,dot:()=>false});

/* ===== 12 쉼터 습격 방어전 ===== */
const G42_RD=['h29_reed','h29_kiln','h29_crystal','h29_snow','h29_bell','h29_veil'];
const G42_RDCFG={waves:5,cd:3*36e5,hp:100,zone:900,grace:8,next:35};
// 울타리 자리: 쉼터 안전 지대 바로 바깥, 걸어서 닿는 곳(지역마다 한 번 정해 기억)
function g42RdBar(reg){const ck='g42rd/'+reg;if(Q30.pos[ck])return Q30.pos[ck];if(REG.id!==reg||DG||IN)return null;const L=RCACHE[reg],T=L&&L.town;if(!T)return null;
  const ok=q30Reach(reg),a0=v20Hash(reg)%628/100;
  for(let k=0;k<32;k++){const a=a0+k*.39;for(let r=tSafe(T)+90;r<tSafe(T)+400;r+=30){const x=T.x+Math.cos(a)*r,y=T.y+Math.sin(a)*r;if(q30OkAt(x,y)&&(!ok||wxCanReach(ok,x,y)))return Q30.pos[ck]={x,y,reg,tn:T.n||'쉼터'}}}
  return null}
const g42RdLeft=reg=>{const t=+g42Rd()[reg]||0;return Math.max(0,t+G42_RDCFG.cd-v20Now())};
const g42RdPeers=()=>{let n=0;try{if(NET.on)for(const p of NET.peers.values())if(netSame(p))n++}catch(_){}return n};
{const _ag=aggroOf;aggroOf=(e,t)=>e.g42rd?220:_ag(e,t)}
function g42RdStart(reg){if(G42D.raid||!q30Host()||REG.id!==reg||DG||IN)return false;const B=g42RdBar(reg);if(!B||g42RdLeft(reg)>0)return false;
  G42D.raid={reg,B,w:0,wt:2,hp:G42_RDCFG.hp,out:0,hit:0,peers:g42RdPeers(),lead:null,done:0};closePanel();
  banner={t:'습격이다!',sub:`${B.tn}의 울타리를 지키세요 · 다섯 무리와 습격 대장`,col:'#ff9a6a',life:2.8,max:2.8};msg(`${B.tn} 습격 방어전 시작: 울타리가 무너지거나 오래 떠나 있으면 실패`,'#ff9a6a');v20Send('g42rds',{reg});return true}
function g42RdWave(Rd){const D0=REGIONS[Rd.reg];if(!D0||!D0.mobs||!D0.mobs.length)return;Rd.w++;Rd.wt=G42_RDCFG.next;const n=Math.round((3+Rd.w)*(1+.5*Math.min(2,Rd.peers)));
  for(let i=0;i<n;i++){const p=q30Near(Rd.B.x,Rd.B.y,460,620);if(!p)continue;const e=q30Mob(D0.mobs[i%D0.mobs.length],p.x,p.y,{elite:i===0&&Rd.w>=3});if(e){e.g42rd=1;e.aggroed=false;e.wx=Rd.B.x;e.wy=Rd.B.y;e.wt=3}}
  if(Rd.w>=G42_RDCFG.waves){let p=null;for(let i=0;i<6&&!p;i++)p=q30Near(Rd.B.x,Rd.B.y,420,640);if(!p)p={x:Rd.B.x,y:Rd.B.y+300};{const e=q30Mob(D0.mobs[0],p.x,p.y,{elite:1});if(e){e.g42rd=1;e.g42lead=1;e.hp*=2.5;e.max*=2.5;e.dmg*=1.2;e.sc=(e.sc||1)*1.25;e.wx=Rd.B.x;e.wy=Rd.B.y;Rd.lead=e}}}
  banner={t:`${Rd.w}번째 무리${Rd.w>=G42_RDCFG.waves?' · 습격 대장':''}`,sub:`울타리 ${Math.max(0,Math.round(Rd.hp))}%`,col:'#ff9a6a',life:2,max:2}}
function g42RdEnd(ok,why){const Rd=G42D.raid;if(!Rd)return;G42D.raid=null;for(const e of enemies)if(e.g42rd){e.g42rd=0;if(!ok)e.aggroed=true}
  if(!ok){msg(`습격 방어전 실패: ${why} 뿔피리를 다시 불면 처음부터입니다`,'#ff8a6a');banner={t:'방어 실패',sub:why,col:'#ff8a6a',life:2.4,max:2.4};v20Send('g42rde',{reg:Rd.reg,ok:0});return}
  g42RdReward(Rd.reg,Rd.B);v20Send('g42rde',{reg:Rd.reg,ok:1})}
function g42RdReward(reg,B,via){g42Rd()[reg]=v20Now();const L=Math.max(1,zoneLevel(B.x,B.y)+(DIFF[P.diff]?DIFF[P.diff].add:0)),xp=Math.round(xpNeed(P.lvl)*.06),gold=L*300;
  let it=makeItem(L,true,null,R()<.25?(R()<.5?'uniq':'set'):null);if(it&&it.rar<2){for(let i=0;i<60;i++){const x=makeItem(L,true);if(x&&x.rar>=2){it=x;break}}}
  if(P.bag.length<BAG_MAX)P.bag.push(it);else loot.push({x:P.x+rnd(-16,16),y:P.y+rnd(-16,16),kind:'item',item:it,t:0});P.gold+=gold;P.pot.hp=(P.pot.hp|0)+3;P.pot.mp=(P.pot.mp|0)+3;gainXp(xp);
  try{const a=g42Ac();a.raid=(a.raid|0)+1}catch(_){}
  rings.push({x:B.x,y:B.y,r:10,max:220,life:1,col:'#ffd76a'});burst(B.x,B.y,'#ffd76a',40,200,3,24);banner={t:'쉼터를 지켜 냈다!',sub:`${B.tn}${via?' · '+via:''}`,col:'#ffd76a',life:3,max:3};
  msg(`습격 방어 상자: ${itemName(it)} · 금화 ${gold.toLocaleString()} · 경험치 ${xp.toLocaleString()} · 물약 3개씩`,'#ffd76a');save()}
V20NET.g42rds=(m)=>{if(!NET.guest||!P||REG.id!==m.reg)return;const B=g42RdBar(m.reg);if(B){G42D.gst={reg:m.reg};banner={t:'습격이다!',sub:`${B.tn}의 울타리를 함께 지키세요`,col:'#ff9a6a',life:2.4,max:2.4}}};
V20NET.g42rde=(m,r)=>{if(!NET.guest||!P)return;const was=G42D.gst;G42D.gst=null;if(!m.ok||!was||was.reg!==m.reg||REG.id!==m.reg)return;const B=g42RdBar(m.reg);if(!B||dist(P,B)>G42_RDCFG.zone)return;if(g42RdLeft(m.reg)>0){msg('이 쉼터의 습격 상자는 아직 다시 받을 수 없습니다','#a39d8f');return}g42RdReward(m.reg,B,`${r&&r.name||'방장'}님과 함께`)};
function g42RdTick(dt){if(!P||DG||IN||!G42_RD.includes(REG.id)||P.lvl<G42_CHLV&&!G42D.raid)return;const reg=REG.id,B=g42RdBar(reg);if(!B)return;const Rd=G42D.raid&&G42D.raid.reg===reg?G42D.raid:null,left=g42RdLeft(reg);
  q30Mark('g42rd/'+reg,{kind:'g42bar',x:B.x,y:B.y,hp:Rd?Rd.hp/G42_RDCFG.hp:null,lb:Rd?`울타리 ${Math.max(0,Math.round(Rd.hp))}% · ${Rd.w}/${G42_RDCFG.waves} 무리`:left>0?`습격 뿔피리 · ${Math.ceil(left/6e4)}분 뒤`:'습격 뿔피리 · 가까이 가기',on:!!Rd});
  if(!Rd){const near=!P.dead&&dist(P,B)<80;if(near&&!G42D.near[reg]&&left<=0&&P.lvl>=G42_CHLV&&q30Host()&&panel.hidden){G42D.near[reg]=1;v20Open('g42rd',reg)}if(!near&&dist(P,B)>140)G42D.near[reg]=0;return}
  if(paused)return;Rd.wt-=dt;const live=enemies.filter(e=>!e.dead&&e.g42rd);
  if(Rd.w<G42_RDCFG.waves&&(Rd.wt<=0||(Rd.w>0&&live.length===0)||Rd.w===0&&Rd.wt<=0)){g42RdWave(Rd);return}
  for(const e of live){if(!e.aggroed){e.wx=B.x;e.wy=B.y;e.wt=2}const d=dist(e,B);if(d<e.r+70&&(!e.aggroed||dist(e,P)>260)){e._g42T=(e._g42T==null?.8:e._g42T)-dt;if(e._g42T<=0){e._g42T=2;const k=e.g42lead?5:e.elite?3:1.5;Rd.hp-=k;ftext(B.x,B.y-30,`-${k}%`,'#ff9a7a',false,60)}}}
  if(Rd.hp<=0)return g42RdEnd(false,'울타리가 무너졌습니다.');if(P.dead)return g42RdEnd(false,'쓰러졌습니다.');
  if(dist(P,B)>G42_RDCFG.zone){Rd.out+=dt;if(Rd.out>=G42_RDCFG.grace)return g42RdEnd(false,'울타리를 너무 오래 비웠습니다.')}else Rd.out=0;
  if(Rd.w>=G42_RDCFG.waves&&live.length===0)g42RdEnd(true)}
{const _u=update;update=function(dt){_u(dt);try{g42RdTick(dt)}catch(e){if(window.__QA)throw e}}}
{const _lr=loadRegion;loadRegion=function(id){if(G42D.raid&&G42D.raid.reg!==id)g42RdEnd(false,'쉼터를 떠났습니다.');G42D.gst=null;return _lr.apply(this,arguments)}}
{const _ld=load;load=function(){G42D.raid=null;G42D.gst=null;G42D.on=false;return _ld.apply(this,arguments)}}
V20P.g42rd={title:()=>'쉼터 습격 방어전',html(reg){const B=g42RdBar(reg),left=g42RdLeft(reg),pe=g42RdPeers();if(!B)return '<p class="muted">쉼터 곁으로 가세요.</p>';
  return `<p class="qsay">「녀석들이 무리를 지어 몰려오고 있어! 뿔피리를 불면 다들 울타리로 모인다. 함께 막아 주겠나?」</p><div class="v20box"><b>${v20Esc(B.tn)} 지키기</b><p class="muted" style="margin:4px 0">다섯 무리가 차례로 몰려오고, 마지막에 습격 대장이 옵니다. 울타리가 무너지거나 울타리에서 너무 멀리 8초 넘게 떠나 있으면 실패입니다.${pe?` 동료 ${pe}명과 함께라 무리가 더 큽니다.`:' 동료와 함께하면 무리가 커지고, 동료도 상자를 받습니다.'}</p>
    <p class="muted">상자: 희귀 이상 장비(넷 중 하나는 세트나 유니크) · 금화 · 그 레벨 경험치의 6% · 물약 3개씩 · 쉼터마다 3시간에 한 번</p>
    <div class="btns">${v20Btn('g42rdgo',reg,left>0?`${Math.ceil(left/6e4)}분 뒤에`:'뿔피리 불기',{dis:left>0||P.lvl<G42_CHLV})}</div></div>`}};
V20A.g42rdgo=reg=>{g42RdStart(String(reg))};
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.k!=='q30'||d.kind!=='g42bar')return _rd(d);const s=d._s;if(!s)return true;const pa=ctx.globalAlpha,pul=.5+.5*Math.sin(time*4);
  if(d.on){ctx.globalAlpha=.25;ctx.strokeStyle='#ff9a6a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x,s.y,G42_RDCFG.zone*.25,G42_RDCFG.zone*.125,0,0,6.283);ctx.stroke()}
  ctx.globalAlpha=1;for(const [k,ox,oy,pv] of [['fence',-34,6,0],['fence',34,6,0],['banner',0,-4,0]])_rd({k,tprop:1,x:d.x+ox,y:d.y+oy,s:1,v:0,zl:0,pv,_s:{x:s.x+ox,y:s.y+oy}});
  if(!d.on){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.25+.2*pul;glow(s.x,s.y-50,28,'#ffd08a');ctx.globalCompositeOperation='source-over'}
  if(d.hp!=null){ctx.globalAlpha=1;ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(s.x-34,s.y-58,68,7);ctx.fillStyle=d.hp<.3?'#ff5a4a':'#ffd08a';ctx.fillRect(s.x-34,s.y-58,68*Math.max(0,d.hp),7)}
  ctx.globalAlpha=pa;QLBL.push({x:s.x,y:s.y-66,n:d.lb,mk:'',c:d.on?'#ff9a6a':'#ffd08a',say:'',sa:0,ph:d.x});return true}}
G42.hudX.push(()=>{const Rd=G42D.raid;return Rd?`<b style="color:#ff9a6a">습격 ${Rd.w}/${G42_RDCFG.waves} · 울타리 ${Math.max(0,Math.round(Rd.hp))}%</b>`:''});
/* 업적 */
G42.ach.push({id:'raid1',n:'울타리를 지킨 자',d:'쉼터 습격 막아 내기',need:1,cur:()=>g42AcN('raid'),grp:'세계',pts:10},{id:'raid20',n:'쉼터의 수호자',d:'쉼터 습격 20번 막아 내기',need:20,cur:()=>g42AcN('raid'),grp:'세계',pts:20},
  {id:'chg1',n:'첫 도전',d:'도전 던전 아무 등급이나',need:1,cur:()=>{const c=g42Ac().chg||{};return (c.gold|0)+(c.silver|0)+(c.bronze|0)},grp:'던전',pts:10},
  {id:'chgold10',n:'금빛 발걸음',d:'도전 던전 금 10번',need:10,cur:()=>((g42Ac().chg||{}).gold|0),grp:'던전',pts:20});
Object.assign(window.__g42,{G42D,G42_CHM,G42_CHG,G42_RD,G42_RDCFG,g42Ch,g42Rd,g42ChMods,g42ChGrade,g42ChReward,g42RdBar,g42RdStart,g42RdEnd,g42RdLeft});
