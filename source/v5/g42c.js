/* ---------- v42 성장(60~100) 공통 · 휴식 경험치 · 연속 사냥 · 성장 길잡이 · 레벨 단계 상자 · 전직 숙련 특성 ----------
   사용자 2026-10-23 「60레벨에서 접었다 · 새 컨텐츠가 없고 퀘스트가 비슷하고 사냥만 하고 레벨업이 오래 걸린다」 → 제안 16가지 「모두 반영」.
   설계 문서: https://claude.ai/artifact/CT2v5GKpSoBaufBJz7ooqs · 수치 기록: rpg/growth-v42/설정-기록-추가분.md
   · 「성장」 창(G 키 · 메뉴 「성장 (G)」): 칸을 G42.tabs 에 붙인다(다른 v42 파일도 여기에 칸을 더한다).
   · 저장: P.g42 하나(없으면 기본값 · 모르는 칸은 그대로 다시 쓴다). 저장 키·다른 칸은 건드리지 않는다.
   · 경험치 덤(휴식 · 연속)은 몬스터 처치 경험치에만 붙는다: rewardKill 안의 첫 gainXp 한 번. 덧셈(휴식 +100% · 연속 최대 +30%).
   · 숙련 특성은 모두 덧셈이고 기존 상한(재사용 50% · 마나 40% · 피해 증가 칸 · 받는 피해 50%) 안에서 센다. */
const G42={tabs:[],hudX:[],kill:false,clock:0,stk:{n:0,t:-99},hud:null,qa:{}};
const G42_LV=30;// 휴식 · 연속 덤이 붙는 레벨 (v45: 사용자 「30~60에도 성장 선택지」 → 50에서 30으로)
const G42_REST={perH:.05,cap:1.5,mul:1};// 한 시간 쉬면 그 레벨 필요 경험치의 5% · 최대 1.5레벨 · 처치 경험치 +100%
const G42_STK={gap:5,per:1,max:30};// 5초 안에 다음 처치 · 한 마리마다 +1% · 최대 +30%
const G42_BOX=[60,65,70,75,80,85,90,95,100];
const G42_BOXT={70:'수련을 마친 자',80:'길을 넓힌 자',90:'높은 봉우리의 손님',100:'백 번째 걸음'};
const G42_TRLV=[60,65,70,75,80,85,90,95];
/* ===== 저장 칸 ===== */
function g42Clean(raw){const o=v20Obj(raw)?Object.assign({},raw):{};
  const num=(v,lo,hi)=>Number.isFinite(+v)?Math.max(lo,Math.min(hi,+v)):lo;
  o.rest=num(o.rest,0,1e12);o.ts=num(o.ts,0,1e15);
  o.box=Array.isArray(o.box)?[...new Set(o.box.map(v=>v|0).filter(v=>G42_BOX.includes(v)))]:[];
  const tr={};if(v20Obj(o.tr))for(const k in o.tr){const L=k|0;if(G42_TRLV.includes(L)&&(o.tr[k]==='a'||o.tr[k]==='b'))tr[L]=o.tr[k]}o.tr=tr;
  o.trN=num(o.trN,0,1e6)|0;return o}
const g42S=()=>{if(!P)return g42Clean(null);if(!v20Obj(P.g42)||!Array.isArray(P.g42.box))P.g42=g42Clean(P.g42);return P.g42};
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P){d.g42=g42Clean(P.g42)}}catch(e){if(window.__QA)throw e}return d}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok){try{P.g42=g42Clean(d&&d.g42);g42RestOffline()}catch(e){if(window.__QA)throw e;P.g42=g42Clean(null)}G42.stk={n:0,t:-99};v20GsBump()}return ok}}
{const _ng=newGame;newGame=function(cls,slot){const r=_ng.apply(this,arguments);if(P){P.g42=g42Clean(null);P.g42.ts=v20Now()}G42.stk={n:0,t:-99};v20GsBump();return r}}
/* ===== 5 휴식 경험치: 게임을 끈 동안 · 마을 안전 지대에서 쌓인다 ===== */
const g42RestCap=()=>Math.round(xpNeed(P.lvl)*G42_REST.cap);
const g42RestOn=()=>P&&P.lvl>=G42_LV&&P.lvl<MAXLV;
function g42RestAdd(hours){const g=g42S();if(!g42RestOn()||!(hours>0))return 0;const cap=g42RestCap(),add=Math.min(Math.max(0,cap-g.rest),Math.round(hours*G42_REST.perH*xpNeed(P.lvl)));g.rest+=add;return add}
// 마지막으로 있던 때(ts)는 30초마다 적어 둔다(저장할 때마다 찍으면 같은 판을 저장 · 불러오기만 해도 저장 내용이 바뀜). 1분 안에 다시 들어오면 그대로 둔다.
function g42RestOffline(){const g=g42S(),now=v20Now();if(g.ts>0&&now-g.ts<6e4)return;if(g.ts>0&&now>g.ts){const h=Math.min(48,(now-g.ts)/36e5);const a=g42RestAdd(h);if(a>0)setTimeout(()=>msg(`쉬는 동안 휴식 기운이 쌓였습니다: 다음 사냥 경험치 ${a.toLocaleString()}만큼 두 배 (성장 G)`,'#9fe8c8'),900)}g.ts=now}
G42.tsT=0;V20.slowTick.push(st=>{if(!P)return;G42.tsT+=st;if(G42.tsT>=30){G42.tsT=0;g42S().ts=v20Now()}});
V20.slowTick.push(st=>{if(!P||P.dead||DG||IN||!g42RestOn())return;if(inSafe(P.x,P.y,0))g42RestAdd(st/3600)});
/* ===== 6 연속 사냥 ===== */
V20.tick.push(dt=>{G42.clock+=dt});
const g42StkPct=()=>G42.clock-G42.stk.t<=G42_STK.gap?Math.min(G42_STK.max,Math.max(0,(G42.stk.n-1)*G42_STK.per)):0;
/* 경험치 덤: rewardKill 안의 첫 gainXp(처치 경험치) 한 번에만 */
{const _rk=rewardKill;rewardKill=function(e){if(!P||GHOST)return _rk.apply(this,arguments);
  if(g42RestOn()){const s=G42.stk;s.n=G42.clock-s.t<=G42_STK.gap?s.n+1:1;s.t=G42.clock}
  G42.kill=true;try{return _rk.apply(this,arguments)}finally{G42.kill=false}}}
{const _gx=gainXp;gainXp=function(n){if(G42.kill&&P){G42.kill=false;if(g42RestOn()&&n>0){const g=g42S();let add=0;
    if(g.rest>0){const r=Math.min(g.rest,Math.round(n*G42_REST.mul));g.rest-=r;add+=r}
    const sp=g42StkPct();if(sp>0)add+=Math.round(n*sp/100);
    if(add>0){n+=add;G42.qa.lastAdd=add}}}
  return _gx.call(this,n)}}
/* ===== HUD: 연속 · 휴식 한 줄 (경험치 막대 아래) ===== */
function g42Hud(){let el2=G42.hud;if(!el2){const x=$('#xptext');if(!x)return;el2=document.createElement('div');el2.id='g42hud';x.parentNode.appendChild(el2);G42.hud=el2}
  const a=[];if(P)for(const f of G42.hudX){let x='';try{x=f()}catch(_){}if(x)a.push(x)}
  if(!P||!g42RestOn()){const t=a.join(' · ');if(el2._h!==t){el2._h=t;el2.innerHTML=t}return}
  const g=g42S(),sp=g42StkPct();if(sp>0)a.push(`<b style="color:#ffcf6a">연속 ${G42.stk.n} · +${sp}%</b>`);if(g.rest>0)a.push(`<span style="color:#9fe8c8">휴식 ×2 ${Math.max(1,Math.min(100,Math.round(g.rest/xpNeed(P.lvl)*100)))}%</span>`);
  const nx=g42Next(),t=a.join(' · ')+(nx&&!v20Mob()?`${a.length?' · ':''}<span class="muted">다음: ${nx}</span>`:'');if(el2._h!==t){el2._h=t;el2.innerHTML=t}}
{const _uh=updateHud;updateHud=function(){_uh();try{g42Hud()}catch(e){if(window.__QA)throw e}}}
v20Css('#g42hud{font-size:11px;line-height:1.3;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px}#g42hud:empty{display:none}');
/* ===== 2 다음 성장 길잡이 ===== */
function g42Spells(){const out=[];for(const id in SPELLS){const s=SPELLS[id];if(s.cls!==P.cls||s.merged||s.hidden||s.kind==='passive'&&!s.job2&&!s.job3)continue;
    if(s.job2&&P.job2&&s.job2!==P.job2)continue;if(s.job3&&P.job3&&s.job3!==P.job3)continue;if(s.job2&&!P.job2&&P.lvl>=J2LV)continue;
    let L=0;try{L=reqLvOf(id)}catch(_){continue}if(L>P.lvl&&L<=MAXLV)out.push({id,L,n:s.n})}
  return out.sort((a,b)=>a.L-b.L)}
function g42Places(){const out=[],dgs=[...DUNGEONS,...(typeof WX_DUNGEONS!=='undefined'?WX_DUNGEONS:[])];
  DIFF.forEach((Df,di)=>{if(P.lvl<Df.req)return;const D=Df.add,dn=di?Df.n:'';
    for(const id in REGIONS){const R0=REGIONS[id];if(id==='home'||id==='royal'||di!==P.diff)continue;const lo=(R0.base|0)+D;if(R0.hell&&di<2)continue;if(lo>P.lvl&&lo<=P.lvl+15)out.push({k:'reg',n:R0.n,L:lo,dn})}
    for(const d of dgs){if(!d||!d.lvl)continue;const reg=d.region&&REGIONS[d.region];if(reg&&reg.hell&&di<2)continue;const L=d.lvl+D;if(L>=P.lvl-3&&L<=P.lvl+6)out.push({k:'dg',n:d.n,L,where:reg?reg.n:'',dn,di})}});
  return out.sort((a,b)=>(a.di===P.diff?0:1)-(b.di===P.diff?0:1)||a.L-b.L)}
function g42Next(){if(!P||P.lvl>=MAXLV)return '';const sp=g42Spells()[0],tl=G42_TRLV.find(L=>L>P.lvl),bx=G42_BOX.find(L=>L>P.lvl);
  const c=[];if(sp)c.push([sp.L,`${sp.L}레벨 새 기술 「${sp.n}」`]);if(tl&&P.lvl>=55)c.push([tl,`${tl}레벨 숙련 특성`]);if(bx&&P.lvl>=55)c.push([bx,`${bx}레벨 단계 상자`]);
  const rg=g42Places().find(p=>p.k==='reg');if(rg)c.push([rg.L,`${rg.L}레벨 사냥터 「${rg.n}」`]);c.sort((a,b)=>a[0]-b[0]);return c.length?c[0][1]:''}
function g42GuideHtml(){if(P.lvl>=MAXLV)return '<p class="muted">최고 레벨입니다. 룬 각인과 어둠 단계가 기다립니다.</p>';
  const sp=g42Spells().slice(0,4),pl=g42Places(),here=pl.filter(p=>p.k==='dg'),reg=pl.filter(p=>p.k==='reg').slice(0,3);
  let h='<div class="v20box"><h3>다음에 열리는 것</h3>';
  const rows=[];for(const s of sp)rows.push([s.L,`새 기술 「${v20Esc(s.n)}」`]);
  const tl=G42_TRLV.find(L=>L>P.lvl);if(tl)rows.push([tl,'전직 숙련 특성 고르기']);const bx=G42_BOX.find(L=>L>P.lvl);if(bx)rows.push([bx,'레벨 단계 상자']);
  for(const r of reg)rows.push([r.L,`새 사냥터 「${v20Esc(r.n)}」${P.diff?` (${DIFF[P.diff].n})`:''}`]);
  rows.sort((a,b)=>a[0]-b[0]);h+=rows.length?rows.map(([L,t])=>`<div class="v20row"><div>${t}</div><div><b>${L}레벨</b> <span class="muted">${L-P.lvl}레벨 남음</span></div></div>`).join(''):'<p class="muted">곧 열리는 것이 없습니다.</p>';
  h+='</div><div class="v20box"><h3>지금 레벨에 맞는 던전</h3>';
  h+=here.length?here.slice(0,8).map(d=>`<div class="v20row"><div>${v20Esc(d.n)} <span class="muted">${v20Esc(d.where)}${d.dn?` · <span style="color:${DIFF[d.di].col}">${d.dn}</span>`:''}</span></div><div>몬스터 ${d.L}레벨</div></div>`).join(''):'<p class="muted">맞는 던전이 없습니다. 미궁 오르타(헤이븐 교차로 동쪽)는 층마다 레벨이 오릅니다.</p>';
  return h+'</div>'}
/* ===== 3 레벨 단계 상자 ===== */
const g42BoxOpen=L=>P.lvl>=L&&!g42S().box.includes(L);
function g42BoxGive(L){const g=g42S();if(!g42BoxOpen(L))return false;g.box.push(L);
  let it=null;for(let i=0;i<80&&!it;i++){const x=makeItem(P.lvl,true);if(x&&x.rar===2)it=x}if(!it)it=makeItem(P.lvl,true);
  if(it.rar>=3){it.rar=2}// 상자는 유니크·세트를 주지 않는다(희귀 등급 확정)
  if(P.bag.length<BAG_MAX)P.bag.push(it);else loot.push({x:P.x+rnd(-16,16),y:P.y+rnd(-16,16),kind:'item',item:it,t:0});
  const gold=L*250;P.gold+=gold;P.pot.hp=(P.pot.hp|0)+5;P.pot.mp=(P.pot.mp|0)+5;
  rings.push({x:P.x,y:P.y,r:10,max:150,life:.9,col:'#ffd76a'});burst(P.x,P.y,'#ffd76a',40,180,3,20);
  msg(`${L}레벨 단계 상자: ${itemName(it)} · 금화 ${gold.toLocaleString()} · 물약 5개씩${G42_BOXT[L]?` · 칭호 「${G42_BOXT[L]}」`:''}`,'#ffd76a');save();return true}
V20A.g42box=L=>{g42BoxGive(L|0)};
function g42BoxHtml(){let h='<div class="v20box"><h3>레벨 단계 상자 <span class="muted">60레벨부터 5레벨마다 · 희귀 장비 1개 · 금화 · 물약</span></h3>';
  for(const L of G42_BOX){const got=g42S().box.includes(L),can=g42BoxOpen(L);
    h+=`<div class="v20row"><div><b>${L}레벨</b> <span class="muted">희귀 장비 · 금화 ${(L*250).toLocaleString()} · 물약 5개씩${G42_BOXT[L]?` · 칭호 「${G42_BOXT[L]}」`:''}</span></div><div class="btns">${got?'<button type="button" disabled>받음</button>':v20Btn('g42box',L,'받기',{dis:!can,title:can?'':`${L}레벨부터`})}</div></div>`}
  return h+'</div>'}
for(const L in G42_BOXT)V20.titles.push({id:'g42box'+L,n:G42_BOXT[L],col:'#ffd76a',src:`${L}레벨 단계 상자`,have:()=>!!(P&&g42S().box.includes(+L))});
/* ===== 1 전직 숙련 특성 (60~95, 5레벨마다 둘 중 하나) =====
   fx: gs(장비 능력치 칸에 덧셈) · hp/mp(기본 생명력·마나의 %) · regen(기본 마나 회복의 %) · dmg(피해 증가 칸) · heal(내 치유량) */
const G42_TR={
 mage:[[{n:'불꽃과 번개',d:'화염 · 대기 · 벼락 피해 +6%',gs:{el_fire:6,el_wind:6,el_storm:6}},{n:'얼음과 대지',d:'물과 얼음 · 대지 피해 +6%',gs:{el_ice:6,el_earth:6}}],
  [{n:'아끼는 손',d:'마나 소모 −4%',gs:{mcost:4}},{n:'깊은 샘',d:'마나 회복 +8%',regen:.08}],
  [{n:'날카로운 눈',d:'치명타 +2%',gs:{crit:2}},{n:'빠른 영창',d:'재사용 대기 −3%',gs:{cdr:3}}],
  [{n:'단단한 몸',d:'기본 생명력 +6%',hp:.06},{n:'마력 갑옷',d:'받는 피해 −3%',gs:{dr:3}}],
  [{n:'원소의 힘',d:'마법 피해 +4%',dmg:.04},{n:'되찾는 마나',d:'적 처치 시 마나 +6',gs:{mk:6}}],
  [{n:'봉인의 결',d:'봉인·공간 · 빛 · 변성 피해 +8%',gs:{el_arcane:8,el_light:8,el_life:8}},{n:'가벼운 걸음',d:'이동 속도 +4%',gs:{ms:4}}],
  [{n:'꿰뚫는 눈',d:'치명타 +3%',gs:{crit:3}},{n:'넓은 그릇',d:'기본 마나 +8%',mp:.08}],
  [{n:'대마법의 문턱',d:'마법 피해 +5%',dmg:.05},{n:'흐르는 시간',d:'재사용 대기 −4%',gs:{cdr:4}}]],
 priest:[[{n:'심판의 빛',d:'신성 피해 +6%',gs:{el_holy:6}},{n:'따뜻한 손',d:'내 치유량 +5%',heal:.05}],
  [{n:'아끼는 기도',d:'마나 소모 −4%',gs:{mcost:4}},{n:'깊은 샘',d:'마나 회복 +8%',regen:.08}],
  [{n:'밝은 눈',d:'치명타 +2%',gs:{crit:2}},{n:'이어지는 기도',d:'재사용 대기 −3%',gs:{cdr:3}}],
  [{n:'단단한 몸',d:'기본 생명력 +6%',hp:.06},{n:'믿음의 갑옷',d:'받는 피해 −3%',gs:{dr:3}}],
  [{n:'빛의 칼날',d:'마법 피해 +4%',dmg:.04},{n:'넘치는 은총',d:'내 치유량 +6%',heal:.06}],
  [{n:'생명의 빛',d:'피해의 1% 생명력 흡수',gs:{ls:1}},{n:'순례자의 걸음',d:'이동 속도 +4%',gs:{ms:4}}],
  [{n:'꿰뚫는 눈',d:'치명타 +3%',gs:{crit:3}},{n:'넓은 그릇',d:'기본 마나 +8%',mp:.08}],
  [{n:'성스러운 분노',d:'마법 피해 +5%',dmg:.05},{n:'성자의 손',d:'내 치유량 +7%',heal:.07}]],
 warrior:[[{n:'무거운 일격',d:'물리 피해 +5%',gs:{pdmg:5}},{n:'방패 다루기',d:'막기 확률 +3%',gs:{blk:3}}],
  [{n:'아끼는 숨',d:'마나 소모 −4%',gs:{mcost:4}},{n:'두꺼운 살갗',d:'기본 생명력 +6%',hp:.06}],
  [{n:'급소 찌르기',d:'치명타 +2%',gs:{crit:2}},{n:'버티는 몸',d:'받는 피해 −3%',gs:{dr:3}}],
  [{n:'빠른 손',d:'공격 속도 +4%',gs:{ias:4}},{n:'몸 비틀기',d:'회피 확률 +2%',gs:{eva:2}}],
  [{n:'전장의 힘',d:'물리 피해 +6%',gs:{pdmg:6}},{n:'피의 맛',d:'피해의 1% 생명력 흡수',gs:{ls:1}}],
  [{n:'몸에 밴 기술',d:'재사용 대기 −3%',gs:{cdr:3}},{n:'진군',d:'이동 속도 +4%',gs:{ms:4}}],
  [{n:'꿰뚫는 눈',d:'치명타 +3%',gs:{crit:3}},{n:'거인의 몸',d:'기본 생명력 +8%',hp:.08}],
  [{n:'전쟁의 문턱',d:'물리 피해 +7%',gs:{pdmg:7}},{n:'성벽',d:'받는 피해 −4%',gs:{dr:4}}]],
 archer:[[{n:'깊은 화살',d:'물리 피해 +5%',gs:{pdmg:5}},{n:'원소 화살',d:'화염 · 물과 얼음 · 대기 · 벼락 피해 +6%',gs:{el_fire:6,el_ice:6,el_wind:6,el_storm:6}}],
  [{n:'아끼는 숨',d:'마나 소모 −4%',gs:{mcost:4}},{n:'몸 비틀기',d:'회피 확률 +2%',gs:{eva:2}}],
  [{n:'급소 노리기',d:'치명타 +2%',gs:{crit:2}},{n:'빠른 장전',d:'재사용 대기 −3%',gs:{cdr:3}}],
  [{n:'빠른 시위',d:'공격 속도 +4%',gs:{ias:4}},{n:'질긴 몸',d:'기본 생명력 +6%',hp:.06}],
  [{n:'사냥꾼의 힘',d:'물리 피해 +6%',gs:{pdmg:6}},{n:'바람의 걸음',d:'이동 속도 +4%',gs:{ms:4}}],
  [{n:'피의 맛',d:'피해의 1% 생명력 흡수',gs:{ls:1}},{n:'가죽 갑옷 다루기',d:'받는 피해 −3%',gs:{dr:3}}],
  [{n:'매의 눈',d:'치명타 +3%',gs:{crit:3}},{n:'넓은 그릇',d:'기본 마나 +8%',mp:.08}],
  [{n:'신궁의 문턱',d:'물리 피해 +7%',gs:{pdmg:7}},{n:'흐르는 시간',d:'재사용 대기 −4%',gs:{cdr:4}}]]};
const g42TrOn=()=>!!(P&&P.job2&&G42_TR[P.cls]);
function g42TrList(){if(!g42TrOn())return [];const g=g42S(),L=G42_TR[P.cls],out=[];G42_TRLV.forEach((lv,i)=>{const c=g.tr[lv];if(c&&P.lvl>=lv&&L[i])out.push(L[i][c==='a'?0:1])});return out}
V20.gsAdd.push((x)=>{for(const t of g42TrList()){if(t.gs)for(const k in t.gs)x[k]=(x[k]||0)+t.gs[k];const C=CLASSES[P.cls];
  if(t.hp)x.hp=(x.hp||0)+Math.round((40+P.lvl*12)*C.hp*t.hp);if(t.mp)x.mp=(x.mp||0)+Math.round((20+P.lvl*5)*C.mp*t.mp);if(t.regen)x.regen=(x.regen||0)+Math.round(v20RegenPct(x,t.regen)*10)/10}});
V20.dmgAdd.push(()=>{let v=0;for(const t of g42TrList())if(t.dmg)v+=t.dmg;return v});
V20.healK.push(()=>{let v=0;for(const t of g42TrList())if(t.heal)v+=t.heal;return v});
const g42TrPrice=()=>3000+Math.max(0,P.lvl-60)*200;
V20A.g42tr=v=>{const [lv,c]=String(v).split(':'),L=lv|0;if(!g42TrOn()||!G42_TRLV.includes(L)||P.lvl<L||(c!=='a'&&c!=='b'))return;const g=g42S();
  if(g.tr[L]===c)return;if(g.tr[L]){const pr=g42TrPrice();if(P.gold<pr){msg(`금화가 모자랍니다 (${pr.toLocaleString()})`,'#ff8a5a');return}P.gold-=pr;g.trN++}
  g.tr[L]=c;v20GsBump();const t=G42_TR[P.cls][G42_TRLV.indexOf(L)][c==='a'?0:1];msg(`숙련 특성 「${t.n}」: ${t.d}`,'#c9b4ff');rings.push({x:P.x,y:P.y,r:10,max:120,life:.7,col:'#c9b4ff'});save()};
function g42TrHtml(){const L=G42_TR[P.cls];if(!L)return '';const g=g42S();let h=`<div class="v20box"><h3>전직 숙련 특성 <span class="muted">60~95레벨, 5레벨마다 둘 중 하나 · 모두 덧셈</span></h3>`;
  if(!P.job2)return h+'<p class="muted">2차 전직을 마치면 고를 수 있습니다.</p></div>';
  const pend=G42_TRLV.filter(lv=>P.lvl>=lv&&!g.tr[lv]).length;if(pend)h+=`<p style="color:#ffd76a;margin:2px 0">고르지 않은 특성 ${pend}개</p>`;
  G42_TRLV.forEach((lv,i)=>{const c=g.tr[lv],open=P.lvl>=lv;h+=`<div class="v20row"><div style="flex-basis:100%"><b>${lv}레벨</b>${c?'':open?' <span style="color:#ffd76a">고르기</span>':` <span class="muted">${lv-P.lvl}레벨 남음</span>`}</div>`;
    for(const k of ['a','b']){const t=L[i][k==='a'?0:1],on=c===k;h+=`<div style="flex:1 1 200px;opacity:${open?1:.55}"><b style="color:${on?'#c9b4ff':'#efe2c0'}">${on?'✔ ':''}${t.n}</b> <span class="muted" style="font-size:12px">${t.d}</span><div class="btns" style="margin-top:3px">${on?'<button type="button" disabled>고름</button>':v20Btn('g42tr',lv+':'+k,c?`바꾸기 (금화 ${g42TrPrice().toLocaleString()})`:'고르기',{dis:!open})}</div></div>`}
    h+='</div>'});return h+'</div>'}
/* ===== 5·6 안내 칸 ===== */
function g42XpHtml(){if(P.lvl<G42_LV)return `<div class="v20box"><h3>휴식 경험치 · 연속 사냥</h3><p class="muted">${G42_LV}레벨부터 켜집니다.</p></div>`;if(P.lvl>=MAXLV)return '';const g=g42S(),need=xpNeed(P.lvl),sp=g42StkPct();
  return `<div class="v20box"><h3>휴식 경험치 · 연속 사냥</h3><div class="v20row"><div>휴식 기운 <span class="muted">게임을 끈 동안 · 마을 안전 지대에서 한 시간에 필요 경험치의 5%씩 (최대 1.5레벨)</span></div><div><b style="color:#9fe8c8">${g.rest.toLocaleString()}</b> <span class="muted">(${Math.round(g.rest/need*100)}%)</span></div></div>`+
   `<p class="muted" style="margin:4px 0 0">휴식 기운이 있으면 몬스터 경험치가 두 배로 나오고, 그만큼 휴식 기운이 줄어듭니다.</p>`+
   `<div class="v20row"><div>연속 사냥 <span class="muted">5초 안에 다음 몬스터를 잡으면 한 마리마다 경험치 +1% (최대 +30%)</span></div><div><b style="color:#ffcf6a">${sp>0?`연속 ${G42.stk.n} · +${sp}%`:'없음'}</b></div></div></div>`}
/* ===== 「성장」 창 ===== */
G42.tabs.push({k:'main',n:'성장',html(){return g42XpHtml()+g42GuideHtml()+g42BoxHtml()}});
G42.tabs.push({k:'trait',n:'숙련 특성',html:()=>g42TrHtml()||'<p class="muted">이 직업은 숙련 특성이 없습니다.</p>',dot:()=>g42TrOn()&&G42_TRLV.some(lv=>P.lvl>=lv&&!g42S().tr[lv])});
G42.cur='main';
const g42Dot=()=>{if(!P)return false;if(G42_BOX.some(L=>g42BoxOpen(L)))return true;for(const t of G42.tabs)if(t.dot)try{if(t.dot())return true}catch(_){}return false};
V20P.g42={title:()=>'성장',html(arg){const k=G42.tabs.some(t=>t.k===arg)?arg:G42.tabs.some(t=>t.k===G42.cur)?G42.cur:'main';G42.cur=k;
  const tabs=`<div class="tabs g42tabs" role="tablist" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">${G42.tabs.map(t=>{let d=false;try{d=t.dot&&t.dot()}catch(_){}return `<button type="button" role="tab" aria-selected="${t.k===k}" data-v20a="g42tab" data-v20b="${t.k}">${t.n}${d?' <span style="color:#ffd76a">●</span>':''}</button>`}).join('')}</div>`;
  let body='';try{body=G42.tabs.find(t=>t.k===k).html()}catch(e){if(window.__QA)throw e;body='<p class="muted">이 칸을 그리지 못했습니다.</p>'}return tabs+body}};
V20A.g42tab=k=>{G42.cur=k;if(V20.panel)V20.panel.arg=k};
const g42IsOpen=()=>!panel.hidden&&tab==='quest'&&SQV.mode==='v20'&&V20.panel&&V20.panel.kind==='g42';
function g42Open(k){if(g42IsOpen()&&(!k||k===G42.cur)){closePanel();return}v20Open('g42',k||G42.cur)}
setTimeout(()=>{const tools=document.querySelector('#hud .tools');if(!tools||$('#g42Btn'))return;const b=document.createElement('button');b.className='stonebox';b.id='g42Btn';b.type='button';b.textContent='성장 (G)';
  const c=$('#charBtn');if(c&&c.nextSibling)tools.insertBefore(b,c.nextSibling);else tools.appendChild(b);b.onclick=()=>{try{if(typeof MOB==='object'&&MOB.menu)MOB.menu(false)}catch(_){}g42Open()}},0);
V20.slowTick.push(()=>{const b=$('#g42Btn');if(b){const d=g42Dot();if(b._d!==d){b._d=d;b.classList.toggle('lvup',d);b.textContent=d?'성장 ● (G)':'성장 (G)'}}});
addEventListener('keydown',e=>{if(e.code!=='KeyG'||e.ctrlKey||e.altKey||e.metaKey)return;const t=e.target;if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;
  if(!P||!$('#intro').hidden||(typeof kbIsOpen==='function'&&kbIsOpen()))return;e.preventDefault();g42Open()});
/* 레벨업 알림 */
{const _gx=gainXp;gainXp=function(n){const l0=P?P.lvl:0;const r=_gx.apply(this,arguments);if(P&&P.lvl>l0){const L=P.lvl;
  if(G42_BOX.some(b=>b>l0&&b<=L))setTimeout(()=>msg('레벨 단계 상자가 생겼습니다. 성장(G) 창에서 받으세요','#ffd76a'),500);
  if(g42TrOn()&&G42_TRLV.some(b=>b>l0&&b<=L))setTimeout(()=>msg('새 숙련 특성을 고를 수 있습니다 (성장 G · 숙련 특성)','#c9b4ff'),700);
  const nx=g42Next();if(nx&&L>=55)setTimeout(()=>msg(`다음: ${nx}`,'#d6b262'),900)}return r}}
window.__g42=Object.assign(window.__g42||{},{G42,g42S,g42Clean,g42RestAdd,g42RestOffline,g42StkPct,g42BoxGive,g42TrList,g42Next,g42Spells,g42Places,g42Open,G42_TR,G42_BOX,G42_TRLV,G42_REST,G42_STK});
