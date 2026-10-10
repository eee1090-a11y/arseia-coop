/* ---------- 마을 의뢰: 수집 · 호위 · 배달 · 채집 · 일상 (저장: P.sq, 옛 판은 모르는 칸이라 무시한다) ---------- */
// P.sq={a:{의뢰id:{c:{g0:수},got:[줍은 자리],hp}}, d:{id:끝낸 횟수}, cd:{id:다시 받을 수 있는 시각(ms)}, hide:알림판 접기}
const SQ=[
 {id:'cat',town:'brenhill',giver:'toby',lvl:1,kind:'일상',t:'길 잃은 고양이 보리',say:'우리 고양이 보리가 어제부터 안 보여요… 마을 남서쪽 들판으로 나비를 쫓아갔대요. 찾아 주시면 제 보물을 드릴게요!',done:'보리야! 어디 갔었어! 고마워요, 이건 할아버지가 주신 귀환 두루마리예요. 저보다 형이 더 필요할 것 같아요.',
  goals:[{type:'find',use:'cat',d:'남서쪽 들판에서 고양이 보리 찾기'}],rw:{xp:.6,gold:40,tp:1}},
 {id:'bread',town:'brenhill',giver:'hanna',lvl:2,kind:'배달',t:'갓 구운 빵 배달',say:'윌로벤 나루 주점의 어부 브람이 우리 빵을 그렇게 좋아한단다. 식기 전에 이 바구니를 전해 주겠니? 동쪽 길로 쭉 가면 된단다.',done:'(브람) 오오, 한나네 빵이로군! 이 냄새, 고향 냄새야. 자, 수고비 받게.',
  goals:[{type:'talk',npc:'bram',item:'갓 구운 빵 바구니',d:'윌로벤 나루 주점의 어부 브람에게 빵 전하기'}],turn:'bram',rw:{xp:.8,gold:90,pot:2}},
 {id:'bell',town:'brenhill',giver:'yoan',lvl:1,kind:'일상',rep:.5,t:'저녁 종 울리기',say:'들판의 일꾼들에게 하루가 저물었음을 알려야 합니다. 제 손이 묶여 있으니, 종 줄을 대신 당겨 주시겠습니까?',done:'고운 소리였습니다. 빛이 그대의 하루도 지켜 주기를.',
  goals:[{type:'use',use:'bell',d:'예배당 안 종 줄을 당겨 종 울리기'}],rw:{xp:.3,gold:25}},
 {id:'herb',town:'brenhill',giver:'marta',lvl:2,kind:'채집',rep:20,t:'은방울풀 캐기',say:'물약을 달이려면 은방울풀이 다섯 포기 필요하단다. 마을 둘레 들판 가장자리에 흰 꽃이 피어 있을 게다. 늑대 조심하고.',done:'싱싱하구나! 이걸로 물약을 달여 너한테도 나눠 주마.',
  goals:[{type:'gather',use:'herb',n:5,item:'은방울풀',d:'들판 가장자리에서 은방울풀 캐기'}],rw:{xp:.7,gold:50,pot:3}},
 {id:'fang',town:'brenhill',giver:'garret',lvl:3,kind:'수집',t:'늑대 송곳니',say:'늑대들이 들판까지 내려오는 건 안개숲 고분에 자리 잡은 늑대 우두머리 잿빛 이빨 때문이라네. 그놈 송곳니 하나면 액막이 부적을 마을 문마다 걸 수 있지. 고분에 들어갈 일이 있거든 그놈을 꺾고 송곳니를 가져다주게.',done:'이 송곳니… 정말 그놈 것이군. 이제 늑대들도 좀 잠잠해지겠어. 약속한 대로 내 사냥 장비 하나를 주지.',
  goals:[{type:'kill',k:['m_wolfking'],n:1,item:'잿빛 이빨의 송곳니',d:'안개숲 고분의 늑대 우두머리 잿빛 이빨 처치'}],rw:{xp:1,gold:80,item:1}},
 {id:'wolfd',town:'brenhill',giver:'bruno',lvl:2,kind:'매일',rep:20,t:'동쪽 길 순찰',say:'매일 동쪽 길에 늑대와 재 들개가 몰려든다. 열 마리만 쫓아내 주면 오늘 순찰은 끝이다. 내일 또 부탁하지.',done:'수고했다. 오늘 밤은 양치기들이 편히 자겠군.',
  goals:[{type:'kill',k:['wolf','ashhound'],n:10,d:'동쪽 길의 늑대·재 들개 쫓아내기'}],rw:{xp:.8,gold:70,pot:2}},
 {id:'esc1',town:'brenhill',giver:'lina',lvl:3,kind:'호위',t:'행상인 리나 호위',say:'윌로벤까지 양털을 팔러 가야 하는데, 혼자서는 늑대가 무서워요. 같이 가 주시겠어요? 제가 다치면 끝이에요. 잘 지켜 주세요!',done:'무사히 왔네요! 정말 고마워요. 이건 제 몫의 이익이에요.',
  goals:[{type:'escort',who:'lina',to:'willowen',d:'리나를 윌로벤까지 데려다주기'}],hp:260,rw:{xp:1.4,gold:150,tp:2}},
 {id:'drift',town:'willowen',giver:'jon',lvl:5,kind:'채집',rep:20,t:'강가 표류목',say:'새 배를 짓는데 나무가 모자라. 강 하류 동쪽 기슭에 표류목이 걸려 있을 거야. 네 토막만 주워다 주게.',done:'바닷물 아니 강물에 잘 마른 놈들이군. 좋은 용골이 되겠어.',
  goals:[{type:'gather',use:'drift',n:4,item:'표류목',d:'강 하류 동쪽 기슭에서 표류목 줍기'}],rw:{xp:.7,gold:60,pot:2}},
 {id:'slime',town:'willowen',giver:'nella',lvl:5,kind:'수집',t:'끈적한 점액',say:'배 틈을 메우는 데 슬라임 점액만 한 게 없어요. 여덟 덩이 모아 주실래요? 가방이 끈적해질 걱정은 마세요, 제 항아리에 담아 드릴게요.',done:'이만하면 배 세 척은 메우겠어요! 고마워요.',
  goals:[{type:'collect',k:['slime'],p:.6,n:8,item:'끈적한 점액',d:'늪 슬라임에게서 점액 모으기'}],rw:{xp:1,gold:110,item:1}},
 {id:'esc2',town:'willowen',giver:'ella',lvl:8,kind:'호위',t:'순례자 엘라 호위',say:'헤이븐 교차로의 성소까지 가야 해요. 길에 재 들개가 나온다는데… 함께 가 주세요. 제가 쓰러지면 순례도 끝이에요.',done:'성소의 종소리가 들려요. 덕분에 무사히 왔어요. 빛의 축복을 나눠 드릴게요.',
  goals:[{type:'escort',who:'ella',to:'haven',d:'엘라를 헤이븐 교차로까지 데려다주기'}],hp:420,rw:{xp:1.5,gold:300,tp:2,item:1}},
 {id:'keg',town:'haven',giver:'toma',lvl:6,kind:'일상',rep:.5,t:'맥주통 나르기',say:'대상 마당에 새 맥주통이 왔는데 제가 계산대를 비울 수가 없어요. 마당의 통 하나만 계산대로 옮겨 주세요!',done:'살았다! 리사 아주머니한테 혼날 뻔했어요. 이거 받으세요.',
  goals:[{type:'use',use:'kegpick',d:'대상 마당(동쪽)에서 맥주통 들기'},{type:'use',use:'kegdrop',d:'여관 계산대에 맥주통 내려놓기'}],seq:1,rw:{xp:.5,gold:70}},
 {id:'cargo',town:'haven',giver:'kasim',lvl:10,kind:'수집',t:'찢긴 짐 꾸러미',say:'재 들개 떼가 짐수레를 덮쳐 비단 꾸러미를 물고 달아났네. 놈들을 잡으면 꾸러미가 나올 걸세. 다섯 개만 되찾아 주게.',done:'내 비단이로군! 이 정도면 손해는 면했네. 약속한 사례일세.',
  goals:[{type:'collect',k:['ashhound'],p:.4,n:5,item:'찢긴 짐 꾸러미',d:'재 들개에게서 짐 꾸러미 되찾기'}],rw:{xp:1.1,gold:200,item:1,tp:1}},
 {id:'letter',town:'arden',giver:'mira',lvl:12,kind:'배달',t:'봉인된 서신',say:'엘리안 선생님이 브렌힐 예배당의 사제 요안님께 이 서신을 전하라고 하셨어요. 그런데 전 시험 때문에… 대신 가 주실 수 있나요?',done:'(요안) 마법원의 봉인이군요. 고분의 일에 관한 기록을 보내 주셨군요. 수고하셨습니다, 이건 감사의 표시입니다.',
  goals:[{type:'talk',npc:'yoan',item:'봉인된 서신',d:'브렌힐 예배당의 사제 요안에게 서신 전하기'}],turn:'yoan',rw:{xp:1,gold:250,tp:2}},
 {id:'ess',town:'arden',giver:'oswin',lvl:14,kind:'매일',rep:20,t:'망령의 푸른 정수',say:'봉인 연구에 망령의 정수가 매일 필요하다네. 성벽 밖 망령들에게서 여섯 방울만 모아 오게.',done:'오늘 실험은 이걸로 충분하네. 내일도 부탁하지.',
  goals:[{type:'collect',k:['wraith'],p:.45,n:6,item:'푸른 정수',d:'망령에게서 푸른 정수 모으기'}],rw:{xp:1.2,gold:300,item:1}},
];
const SQBY={};for(const q of SQ)SQBY[q.id]=q;
const SQV={mode:null,npc:null};// 의뢰 창에 무엇을 보여 줄지
function sqState(){let s=P.sq;if(!s||typeof s!=='object')s=P.sq={};if(!s.a||typeof s.a!=='object')s.a={};if(!s.d||typeof s.d!=='object')s.d={};if(!s.cd||typeof s.cd!=='object')s.cd={};return s}
// v20: 고르는 의뢰의 갈래(ch: {의뢰id:'a'|'b'})를 남긴다. 모르는 의뢰 id(더 새 판·지운 의뢰)는 버리지 않고 ux에 따로 두었다가
//      저장할 때(forSave) 원래 자리(a·d·cd)로 되돌려 쓴다 → 롤백해도 기록이 사라지지 않음. 게임 코드는 ux를 보지 않는다.
function sqClean(raw,forSave){const s={a:{},d:{},cd:{},hide:0,ch:{}};if(!raw||typeof raw!=='object')return s;s.hide=raw.hide?1:0;
  const ux={a:{},d:{},cd:{}},ob=v=>v&&typeof v==='object'&&!Array.isArray(v);
  for(const id in raw.a||{}){const q=SQBY[id],v=raw.a[id];if(!v||typeof v!=='object')continue;if(!q){ux.a[id]=v;continue}const c={};for(const k in v.c||{})c[k]=Math.max(0,v.c[k]|0);s.a[id]={c,got:Array.isArray(v.got)?v.got.filter(n=>typeof n==='number').slice(0,20):[]};if(v.hp>0)s.a[id].hp=+v.hp}
  for(const id in raw.d||{}){if(SQBY[id])s.d[id]=Math.max(0,raw.d[id]|0);else if(typeof raw.d[id]==='number')ux.d[id]=raw.d[id]}
  for(const id in raw.cd||{}){if(SQBY[id]){if(raw.cd[id]>0)s.cd[id]=+raw.cd[id]}else if(typeof raw.cd[id]==='number')ux.cd[id]=raw.cd[id]}
  if(ob(raw.ch))for(const id in raw.ch){const v=raw.ch[id];if(typeof v==='string'&&v.length&&v.length<=16)s.ch[id]=v}
  if(ob(raw.ux))for(const k of ['a','d','cd'])if(ob(raw.ux[k]))for(const id in raw.ux[k])if(!(id in ux[k])&&!SQBY[id])ux[k][id]=raw.ux[k][id];
  if(forSave){for(const k of ['a','d','cd'])for(const id in ux[k])if(!(id in s[k]))s[k][id]=ux[k][id]}
  else if(Object.keys(ux.a).length+Object.keys(ux.d).length+Object.keys(ux.cd).length)s.ux=ux;
  return s}
const sqFolk=id=>TW.folk.find(f=>f.id===id);
const sqTurn=q=>q.turn||q.giver;
const sqGoalN=g=>g.n||1;
function sqGoalDone(q,j){const a=sqState().a[q.id];if(!a)return false;return (a.c['g'+j]||0)>=sqGoalN(q.goals[j])}
const sqAllDone=q=>q.goals.every((_,j)=>sqGoalDone(q,j));
function sqAvail(q){const s=sqState();if(s.a[q.id])return 'active';if(!q.rep&&s.d[q.id])return 'done';if(q.rep&&(s.cd[q.id]||0)>Date.now())return 'cool';if(P.lvl<q.lvl-3)return 'low';return 'ok'}
// 가방 칸 수: 다른 작업에서 BAG_MAX 같은 이름으로 늘리면 그 값을 쓴다
const sqBagCap=()=>{try{return typeof BAG_MAX==='number'?BAG_MAX:20}catch(e){return 20}};
const sqXp=q=>{const v=qxp24(q,.035);return v!=null?v:Math.round(xpNeed(Math.max(1,q.lvl))*.3*q.rw.xp)};// v24: 50레벨 이상은 quest.js qxp24 (필요 경험치의 9.5% 아래)
function sqRwHtml(q){const r=q.rw,a=[`경험치 ${sqXp(q).toLocaleString()}`,`금화 ${r.gold}`];if(r.pot)a.push(`물약 ${r.pot}개씩`);if(r.tp)a.push(`<b style="color:#9fd0ff">귀환 두루마리 ${r.tp}장</b>`);if(r.item)a.push('좋은 장비');return `<p class="muted">보상: ${a.join(' · ')}${q.rep?` · <span style="color:#9fe39a">${q.rep>=1?'하루에 한 번':'잠시 뒤 다시'} 받을 수 있음</span>`:''}</p>`}
function sqGoalText(q,j){const g=q.goals[j],a=sqState().a[q.id],c=a?(a.c['g'+j]||0):0;
  if(g.type==='escort'){const E=SQE.cur;return `호위: ${g.d}${E&&E.q===q.id?` · 체력 ${Math.max(0,Math.ceil(E.hp))}/${E.max}`:''}`}
  return g.n?`${g.d} ${Math.min(c,g.n)}/${g.n}`:g.d}
function sqGoalsHtml(q){return '<ul class="qgoals">'+q.goals.map((g,j)=>{const ok=sqGoalDone(q,j);return `<li class="${ok?'ok':''}">${ok?'✓':'○'} ${sqGoalText(q,j)}</li>`}).join('')+'</ul>'}
// 받기 · 끝내기 · 포기
function sqAccept(id){const q=SQBY[id];if(!q||sqAvail(q)!=='ok')return;const s=sqState();s.a[id]={c:{},got:[]};
  if(q.goals[0].type==='escort'){s.a[id].hp=q.hp;sqEscortStart(q)}
  msg(`의뢰를 받았습니다: ${q.t}`,'#9fe0ff');questHud();save()}
function sqAbandon(id){const s=sqState();if(!s.a[id])return;delete s.a[id];if(SQE.cur&&SQE.cur.q===id)SQE.cur=null;msg(`의뢰를 포기했습니다: ${SQBY[id].t}`,'#a39d8f');questHud();save()}
function sqFinish(id){const q=SQBY[id],s=sqState();if(!q||!s.a[id]||!sqAllDone(q))return;const r=q.rw;
  gainXp(sqXp(q));P.gold+=r.gold;if(r.pot){P.pot.hp+=r.pot;P.pot.mp+=r.pot}if(r.tp)P.pot.tp=(P.pot.tp|0)+r.tp;
  if(r.item){const it=makeItem(Math.max(q.lvl,P.lvl-2),true);if(P.bag.length<sqBagCap()){P.bag.push(it);msg(`보상: ${it.name}`,RAR[it.rar].c)}else loot.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),kind:'item',item:it,t:0})}
  delete s.a[id];s.d[id]=(s.d[id]|0)+1;if(q.rep)s.cd[id]=Date.now()+q.rep*3600e3;if(SQE.cur&&SQE.cur.q===id)SQE.cur=null;
  banner={t:`의뢰 완료 · ${q.t}`,sub:`경험치 ${sqXp(q).toLocaleString()} · 금화 ${r.gold}${r.tp?` · 귀환 두루마리 ${r.tp}장`:''}`,col:'#9fe0ff',life:2.6,max:2.6};
  burst(P.x,P.y,'#9fe0ff',30,150,3,30);msg(`의뢰 완료: ${q.t}`,'#9fe0ff');questHud();save()}
function sqProgress(q,j,n,silent){const s=sqState(),a=s.a[q.id];if(!a||sqGoalDone(q,j))return;a.c['g'+j]=(a.c['g'+j]||0)+(n||1);
  if(!silent&&q.goals[j].n)msg(`${q.goals[j].item||q.goals[j].d} ${Math.min(a.c['g'+j],q.goals[j].n)}/${q.goals[j].n}`,'#9fe0ff');
  if(sqAllDone(q)){const tf=sqFolk(sqTurn(q));if(q.goals.some(g=>g.type==='escort'))return;msg(`「${q.t}」 목표를 모두 이뤘습니다. ${tf?tf.n+'에게 알리세요':''}`,'#9fe0ff')}
  questHud();save()}
// 처치: 수집 · 처치 목표 (같이 하기에서도 각자 화면에서 센다)
{const _qk=questKill;questKill=function(e){_qk(e);const s=sqState();
  for(const id in s.a){const q=SQBY[id];q.goals.forEach((g,j)=>{if(!g.k||!g.k.includes(e.k)||sqGoalDone(q,j))return;
    if(g.type==='kill')sqProgress(q,j,1,true);else if(g.type==='collect'&&R()<g.p){sqProgress(q,j,1,true);ftext(e.x,e.y,g.item,'#9fe0ff',false,(e.r||14)*2+30)}})}}}
// 들판의 채집 자리 · 고양이 · 맥주통
const SQSPOT={herb:[],drift:[],cat:[]};
{const B=HOME.towns.find(t=>t.id==='brenhill'),Wl=HOME.towns.find(t=>t.id==='willowen'),H=HOME.towns.find(t=>t.id==='haven');
  for(let i=0;i<8;i++){const a=2.0+i*.42,r=540+(i%3)*45;SQSPOT.herb.push({x:B.x+Math.cos(a)*r,y:B.y+Math.sin(a)*r})}
  for(let i=0;i<6;i++)SQSPOT.drift.push({x:Wl.x+640+i*55,y:Wl.y+215+((i*37)%90)});
  SQSPOT.cat.push({x:B.x-470,y:B.y+330});
  for(const k in SQSPOT)SQSPOT[k].forEach((p,i)=>{const d={x:p.x,y:p.y,k:k==='herb'?'herb':k==='drift'?'drift':'cat',pv:k==='cat'?0:i%3,use:k,si:i,qonly:1,tprop:1,s:1,v:0,zl:0};HOME.decor.push(d)});
  const kh=wxTk(H),kg=HOME.decor.find(d=>d.k==='kegs'&&Math.hypot(d.x-H.x-Math.round(175*kh),d.y-H.y-Math.round(215*kh))<5);if(kg)kg.use='kegpick';// v18: 넓힌 마을 배율 (wxTk)
  for(const it of TWROOM.haven_inn.items)if(it[0]==='counter')it[5]='kegdrop';
  if(REG.id==='home')setArr(decor,HOME.decor)}
const sqUseQ=u=>{const s=sqState();for(const id in s.a){const q=SQBY[id];for(let j=0;j<q.goals.length;j++){const g=q.goals[j];if(g.use===u&&!sqGoalDone(q,j)&&(!q.seq||j===0||sqGoalDone(q,j-1)))return{q,j}}}return null};
function sqUseLive(d){const u=d.use;if(!u)return null;const h=sqUseQ(u);
  if(u==='bell')return{label:'예배당 종 울리기',col:h?'#ffd34d':'#c8b890',q:!!h};
  if(!h)return null;const a=sqState().a[h.q.id];
  if(u==='herb'||u==='drift'){if(a.got.includes(d.si))return null;return{label:u==='herb'?'은방울풀 캐기':'표류목 줍기',col:'#9fe39a',q:1}}
  if(u==='cat')return{label:'고양이 보리 안아 들기',col:'#ffd34d',q:1};
  if(u==='kegpick')return{label:'맥주통 들기',col:'#ffd34d',q:1};if(u==='kegdrop')return{label:'맥주통 내려놓기',col:'#ffd34d',q:1};return null}
function sqUse(d){const u=d.use,h=sqUseQ(u);
  if(u==='bell'){rings.push({x:d.x,y:d.y,r:10,max:220,life:1,col:'#ffd98a'});rings.push({x:d.x,y:d.y,r:10,max:140,life:.8,col:'#fff0c0'});shake=Math.max(shake,3);banner={t:'댕 — 댕 —',sub:'브렌힐 들판에 저녁 종소리가 퍼집니다',col:'#ffd98a',life:2,max:2};
    for(const f of TW.folk)if(f.town&&f.town.id==='brenhill'&&!f.room&&R()<.4){f.say='종이 울리네. 오늘도 수고했어.';f.sayT=time+3}if(h)sqProgress(h.q,h.j,1);return}
  if(!h)return;const a=sqState().a[h.q.id];
  if(u==='herb'||u==='drift'){if(a.got.includes(d.si))return;a.got.push(d.si);burst(d.x,d.y,'#9fe39a',14,80);sqProgress(h.q,h.j,1);return}
  if(u==='cat'){burst(d.x,d.y,'#ffd98a',16,90);msg('보리가 품에 안겨 가르랑거립니다. 토비에게 데려가세요','#9fe0ff');sqProgress(h.q,h.j,1,true);return}
  if(u==='kegpick'){burst(d.x,d.y,'#c89a5a',12,80);msg('맥주통을 어깨에 메었습니다. 여관 계산대로 가져가세요','#9fe0ff');sqProgress(h.q,h.j,1,true);return}
  if(u==='kegdrop'){burst(d.x,d.y,'#c89a5a',12,80);sqProgress(h.q,h.j,1,true);return}}
// 대화: 배달 · 보고 · 의뢰 창
function sqNpcQuests(f){return SQ.filter(q=>q.giver===f.id||sqTurn(q)===f.id||q.goals.some(g=>g.npc===f.id))}
function sqMark(f){if(SQE.cur&&SQE.cur.who===f.id)return '';const s=sqState();let m='';
  for(const id in s.a){const q=SQBY[id];if(sqTurn(q)===f.id&&sqAllDone(q)&&!q.goals.some(g=>g.type==='escort'))return '?';if(q.goals.some((g,j)=>g.type==='talk'&&g.npc===f.id&&!sqGoalDone(q,j)))return '?'}
  for(const q of SQ)if(q.giver===f.id&&sqAvail(q)==='ok')m='!';return m}
function sqTalk(f){if(SQE.cur&&SQE.cur.who===f.id)return false;const s=sqState();let deliver=null;
  for(const id in s.a){const q=SQBY[id];q.goals.forEach((g,j)=>{if(g.type==='talk'&&g.npc===f.id&&!sqGoalDone(q,j)&&(!q.seq||j===0||sqGoalDone(q,j-1))){sqProgress(q,j,1,true);deliver=q;msg(`${g.item||'물건'}을(를) 건넸습니다`,'#9fe0ff')}})}
  const qs=sqNpcQuests(f).filter(q=>{const v=sqAvail(q);return v==='ok'||v==='active'||v==='cool'});
  if(!qs.length&&!deliver)return false;
  SQV.mode='npc';SQV.npc=f;qTown=f.town||qTown;openPanel('quest');return true}
function sqNpcHtml(){const f=SQV.npc,s=sqState();if(!f)return '';let h=`<p class="qsay"><b>${f.n}</b> <span class="muted">${f.role||''}</span></p>`;let any=false;
  for(const q of sqNpcQuests(f)){const v=sqAvail(q);
    if(v==='active'&&sqTurn(q)===f.id&&sqAllDone(q)){any=true;h+=`<h2>${q.t} <span class="muted">${q.kind}</span></h2><p class="qsay">「${q.done}」</p>${sqRwHtml(q)}<div class="row"><button class="primary" type="button" data-sqdone="${q.id}">보상 받기</button></div>`}
    else if(v==='active'&&q.giver===f.id){any=true;h+=`<h2>${q.t} <span class="muted">진행 중 · ${q.kind}</span></h2><p class="qsay">「부탁한 일은 잘 되어 가나요?」</p>${sqGoalsHtml(q)}<p class="muted">${sqWhereQ(q)}</p><div class="row"><button class="ghost" type="button" data-sqab="${q.id}">의뢰 포기</button></div>`}
    else if(v==='ok'&&q.giver===f.id){any=true;h+=`<h2>${q.t} <span class="muted">${q.kind} · 권장 레벨 ${q.lvl}</span></h2><p class="qsay">「${q.say}」</p>${sqGoalsHtml(q)}${sqRwHtml(q)}<div class="row"><button class="primary" type="button" data-sqacc="${q.id}">의뢰 받기</button></div>`}
    else if(v==='cool'&&q.giver===f.id){any=true;const m=Math.ceil(((s.cd[q.id]||0)-Date.now())/60000);h+=`<h2>${q.t} <span class="muted">${q.kind}</span></h2><p class="muted">오늘 몫은 끝났습니다. ${m>=60?`${Math.ceil(m/60)}시간`:`${m}분`} 뒤에 다시 받을 수 있습니다.</p>`}}
  if(!any)h+=`<p class="qsay">「${f.lines[0]||'…'}」</p>`;return h}
// 의뢰 일지 (L): 1막 + 마을 의뢰 전부
function sqLogHtml(){const s=sqState();let h='<p class="muted" style="margin-top:0">진행 중인 의뢰와 가야 할 곳입니다. 지도(M)와 미니맵의 노란 고리(1막) · 하늘색 고리(마을 의뢰)가 목표를 가리킵니다.</p>';
  h+='<h2>1막 「재의 그림자」</h2>';{const q=qCur(),st=qState();if(!q)h+='<p class="muted">1막의 의뢰를 모두 마쳤습니다.</p>';else{const b=qHudBlock();h+=`<div class="qlog"><b>${b.t}</b><div class="muted">${b.w}</div><ul class="qgoals">${b.g.map(x=>`<li class="${x.ok?'ok':''}">${x.ok?'✓':'○'} ${x.s}</li>`).join('')}</ul><div class="row qgrow">${qgBtn('main:'+st.i)}</div></div>`}}
  h+='<h2>마을 의뢰 · 진행 중</h2>';const act=Object.keys(s.a);if(!act.length)h+='<p class="muted">없습니다. 이름 위에 노란 ! 가 뜬 마을 사람에게 말을 걸어 보세요.</p>';
  for(const id of act){const q=SQBY[id],g=sqFolk(q.giver),tf=sqFolk(sqTurn(q));h+=`<div class="qlog"><b>${q.t}</b> <span class="muted">${q.kind} · ${g?g.n:''}의 부탁</span><div class="muted">${sqWhereQ(q)}</div>${sqGoalsHtml(q)}${sqAllDone(q)&&tf?`<div class="ok">✓ ${tf.n}에게 돌아가기</div>`:''}<div class="row">${qgBtn('sq:'+id)}<button class="ghost" type="button" data-sqab="${id}">포기</button></div></div>`}
  const av=SQ.filter(q=>sqAvail(q)==='ok');h+='<h2>받을 수 있는 의뢰</h2>';if(!av.length)h+='<p class="muted">지금은 없습니다.</p>';
  else h+='<ul class="qgoals">'+av.map(q=>{const g=sqFolk(q.giver);return `<li>! <b>${q.t}</b> <span class="muted">${q.kind} · ${ALLTOWNS.find(t=>t.id===q.town).n}의 ${g?g.n:''}${g&&g.room?` (${TWROOM[g.room].n} 안)`:''}</span> ${qgBtn('sq:'+q.id)}</li>`}).join('')+'</ul>';
  const cool=SQ.filter(q=>sqAvail(q)==='cool');if(cool.length)h+=`<p class="muted">다시 받을 때를 기다리는 의뢰: ${cool.map(q=>q.t).join(', ')}</p>`;
  const nd=Object.values(s.d).reduce((a,b)=>a+b,0);h+=`<p class="muted">지금까지 끝낸 마을 의뢰 ${nd}번 · 알림판 ${s.hide?'접힘':'펼침'}</p><div class="row"><button class="ghost" type="button" data-sqtrack="1">알림판 ${s.hide?'펼치기':'접기'}</button></div>`;
  return h}
{const _qh=questHtml;questHtml=function(){if(SQV.mode==='npc')return sqNpcHtml();if(SQV.mode==='log')return sqLogHtml();return _qh()}}
{const _qt=questTalk;questTalk=function(t){SQV.mode=null;return _qt(t)}}
{const _qc=questClick;questClick=function(b){const d=b.dataset;
  if(d.sqacc){sqAccept(d.sqacc);renderPanel();return true}if(d.sqdone){sqFinish(d.sqdone);renderPanel();return true}if(d.sqab){sqAbandon(d.sqab);renderPanel();return true}
  if(d.sqtrack){const s=sqState();s.hide=s.hide?0:1;questHud();renderPanel();save();return true}if(d.sqlog){sqOpenLog();return true}return _qc(b)}}
{const _rp=renderPanel;renderPanel=function(){_rp();if(tab==='quest'&&SQV.mode){const t=$('#ptitle');if(t)t.textContent=SQV.mode==='log'?'의뢰 일지':SQV.npc?SQV.npc.n:'의뢰'}}}
function sqOpenLog(){SQV.mode='log';SQV.npc=null;openPanel('quest')}
addEventListener('keydown',e=>{if(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName))return;if(e.code!=='KeyL'||!$('#intro').hidden)return;e.preventDefault();
  if(!panel.hidden&&tab==='quest'&&SQV.mode==='log')closePanel();else sqOpenLog()});
// 실내에 들어갈 때 (배달 목표가 그 방 사람이면 표시만)
function sqOnEnter(){}

/* ---------- 호위: 따라오는 사람. 맞으면 체력이 깎이고, 쓰러지면 실패 (다시 받을 수 있다) ---------- */
const SQE={cur:null};
function sqEscortStart(q){const f=sqFolk(q.goals[0].who),a=sqState().a[q.id];if(!f)return;
  SQE.cur={q:q.id,who:f.id,k:'tfolk',esc:1,n:f.n,role:f.role,L:f.L,lines:[],x:P.x+rnd(-30,30),y:P.y+rnd(20,40),hp:a&&a.hp>0?a.hp:q.hp,max:q.hp,face:1,walkT:0,moving:false,s:1,v:0,to:q.goals[0].to,reg:'home',hurt:0}}
function sqEscortTick(dt){const s=sqState();let E=SQE.cur;
  if(!E){for(const id in s.a){const q=SQBY[id];if(q.goals[0].type==='escort'&&!sqGoalDone(q,0)){sqEscortStart(q);E=SQE.cur;break}}if(!E)return}
  const q=SQBY[E.q],a=s.a[E.q];if(!q||!a){SQE.cur=null;return}
  if(IN||DG||REG.id!==E.reg){const i=decor.indexOf(E);if(i>=0)decor.splice(i,1);return}
  if(!decor.includes(E))decor.push(E);
  const d=dist(E,P);E.moving=false;if(d>900){E.x=P.x+rnd(-40,40);E.y=P.y+rnd(20,50)}
  else if(d>70&&!P.dead){const sp=Math.min(SPEED*.92,d*2)*dt,dx=P.x-E.x,dy=P.y-E.y;E.x+=dx/d*sp;E.y+=dy/d*sp;E.moving=true;E.walkT+=dt;const sx=dx-dy;if(Math.abs(sx)>.5)E.face=sx>0?1:-1}
  E.hurt=Math.max(0,E.hurt-dt);
  // 몬스터에게 맞기
  for(const e of enemies){if(e.dead)continue;const dd=Math.hypot(e.x-E.x,e.y-E.y);if(dd>e.r*(e.sc||1)+26){continue}e._escT=(e._escT==null?.4:e._escT)-dt;if(e._escT<=0){e._escT=(TYPES[e.k].atk||1.2)*1.1;const dm=Math.max(1,Math.round(e.dmg||6));E.hp-=dm;E.hurt=.2;ftext(E.x,E.y,'-'+dm,'#ff9a7a',false,50)}}
  for(const p of projs){if(p.owner!=='e'||p.life<=0)continue;if(Math.hypot(p.x-E.x,p.y-E.y)<p.r+12){p.life=0;const dm=Math.max(1,Math.round(p.dmg||8));E.hp-=dm;E.hurt=.2;ftext(E.x,E.y,'-'+dm,'#ff9a7a',false,50);burst(p.x,p.y,p.col||'#ff7a3a',6,60)}}
  a.hp=Math.max(0,Math.round(E.hp));
  if(E.hp<=0){burst(E.x,E.y,'#ff5a4a',24,140);msg(`${E.n}이(가) 쓰러졌습니다. 호위 의뢰 「${q.t}」 실패. ${E.n}은(는) 마을로 돌아갔습니다. 다시 받을 수 있습니다`,'#ff8a6a');
    banner={t:'호위 실패',sub:`${E.n}이(가) 쓰러졌습니다 · 다시 받을 수 있습니다`,col:'#ff8a6a',life:2.6,max:2.6};const i=decor.indexOf(E);if(i>=0)decor.splice(i,1);SQE.cur=null;delete s.a[E.q];questHud();save();return}
  const T=ALLTOWNS.find(t=>t.id===E.to);if(T&&Math.hypot(E.x-T.x,E.y-T.y)<300){sqProgress(q,0,1,true);const i=decor.indexOf(E);if(i>=0)decor.splice(i,1);SQE.cur=null;E.say=null;
    const f=sqFolk(E.who);if(f){f.say='고마워요! 여기서부터는 혼자 갈 수 있어요.';f.sayT=time+4}sqFinish(q.id)}}
// 호위 그림: 마을 사람 그림 + 체력 띠
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.esc){twDrawFolk(d);const s=d._s,y=s.y-(d.L.child?54:76);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(s.x-22,y-14,44,5);ctx.fillStyle=d.hp/d.max<.3?'#ff5a4a':'#9fe0ff';ctx.fillRect(s.x-22,y-14,44*clamp(d.hp/d.max,0,1),5);if(d.hurt>0)hurtFlash(s.x,s.y-30,28,.5);return true}
  if(d.k==='tfolk'&&SQE.cur&&SQE.cur.who===d.id&&!d.esc)return true;
  if(d.qonly&&!sqUseLive(d))return true;return _rd(d)}}
// 보리 고양이: 찾은 뒤 토비에게 갈 때까지 졸졸 따라온다
const SQCAT={x:0,y:0,on:false};
function sqCatTick(dt){const a=sqState().a.cat;const on=a&&sqGoalDone(SQBY.cat,0)&&!IN&&!DG&&REG.id==='home';
  if(on&&!SQCAT.on){SQCAT.x=P.x+20;SQCAT.y=P.y+20}SQCAT.on=on;if(!on)return;const d=Math.hypot(P.x-SQCAT.x,P.y-SQCAT.y);if(d>40){const k=Math.min(1,dt*3);SQCAT.x+=(P.x+18-SQCAT.x)*k;SQCAT.y+=(P.y+22-SQCAT.y)*k}}
{const _g=drawV5Glow;drawV5Glow=function(){_g();if(!SQCAT.on)return;S();const e=twProp({k:'cat',pv:0});if(e){const s=W2S(SQCAT.x,SQCAT.y);SC.draw(ctx,e,s.x,s.y)}}}
// 실내에서 내 대화 상대(호위 중인 사람) 숨기기 + 의뢰 진행 갱신
let sqHudT=0;
{const _u=update;update=function(dt){_u(dt);sqEscortTick(dt);sqCatTick(dt);sqHudT-=dt;if(sqHudT<=0){sqHudT=.5;questHud()}}}
// 저장 · 불러오기 · 새 캐릭터
{const _sd=saveData;saveData=function(){const d=_sd();d.sq=sqClean(P.sq,1);return d}}
{const _ld=load;load=function(d,slot){SQE.cur=null;const ok=_ld(d,slot);if(ok){P.sq=sqClean(d&&d.sq);questHud()}return ok}}
{const _ng=newGame;newGame=function(cls,slot){SQE.cur=null;P.sq=sqClean(null);const r=_ng(cls,slot);P.sq=P.sq||sqClean(null);questHud();return r}}

/* ---------- 목표 자리: 미니맵 · 큰 지도 · 알림판 ---------- */
// 의뢰 하나의 목표 자리 (월드 기준: reg, x, y, room?, label)
function sqTarget(q){const s=sqState(),a=s.a[q.id];if(!a)return null;const tw=id=>ALLTOWNS.find(t=>t.id===id);
  const npcAt=id=>{const f=sqFolk(id);if(!f)return null;if(f.room){const b=(TW.blds.home||[]).find(b=>b.enter===f.room);const rc=f.town;const o=TWFOLK[id].room||[0,0];return{reg:'home',x:rc.x+o[0],y:rc.y+o[1],room:f.room,door:b?b.door:null,label:`${f.town.n} ${TWROOM[f.room].n} 안 · ${f.n}`}}return{reg:f.town.reg||'home',x:f.hx,y:f.hy,label:`${f.town.n} · ${f.n}`}};
  if(sqAllDone(q))return npcAt(sqTurn(q));
  for(let j=0;j<q.goals.length;j++){if(sqGoalDone(q,j))continue;const g=q.goals[j];
    if(g.type==='talk')return npcAt(g.npc);
    if(g.type==='escort'){const T=tw(g.to);return{reg:'home',x:T.x,y:T.y,label:`${T.n} (호위 목적지)`}}
    if(g.type==='use'){if(g.use==='bell'){const B=tw('brenhill'),it=TWROOM.bren_chapel.items.find(i=>i[5]==='bell');const b=(TW.blds.home||[]).find(b=>b.enter==='bren_chapel');return{reg:'home',x:B.x+it[1],y:B.y+it[2],room:'bren_chapel',door:b.door,label:'브렌힐 예배당 안 · 종 줄'}}
      if(g.use==='kegpick'){const d=HOME.decor.find(d=>d.use==='kegpick');return{reg:'home',x:d.x,y:d.y,label:'헤이븐 교차로 동쪽 대상 마당'}}
      if(g.use==='kegdrop'){const H=tw('haven'),it=TWROOM.haven_inn.items.find(i=>i[5]==='kegdrop'),b=(TW.blds.home||[]).find(b=>b.enter==='haven_inn');return{reg:'home',x:H.x+it[1],y:H.y+it[2],room:'haven_inn',door:b.door,label:'황금 마차 여관 안 · 계산대'}}}
    if(g.type==='find'||g.type==='gather'){const sp=SQSPOT[g.use].filter((p,i)=>!a.got.includes(i));let b=null,bd=1e9;for(const p of sp){const dd=Math.hypot(p.x-P.x,p.y-P.y);if(dd<bd){bd=dd;b=p}}if(b)return{reg:'home',x:b.x,y:b.y,label:qPlace(b.x,b.y),spots:g.use}}
    if(g.type==='collect'||g.type==='kill'){const z=qZone(g.k,q.town);return z?{reg:'home',...z}:null}}
  return null}
function sqWhereQ(q){const t=sqTarget(q);return t?'📍 '+qWhereText(t):''}
// 의뢰 목표가 있는 지역 id → 개수 (큰 지도 세계 탭)
function sqTargetRegs(){const o={},s=sqState(),add=t=>{if(t){const r=t.reg||'home';o[r]=(o[r]||0)+1}};add(qMainTargetW());for(const id in s.a)add(sqTarget(SQBY[id]));return o}
// 알림판 덩이 (quest.js questHud)
function sqHudBlocks(){const s=sqState(),out=[];for(const id in s.a){const q=SQBY[id];if(!q)continue;const t=sqTarget(q),tf=sqFolk(sqTurn(q)),g=q.goals.map((g,j)=>({s:sqGoalText(q,j),ok:sqGoalDone(q,j)}));
  if(sqAllDone(q)&&tf)g.push({s:`${tf.n}에게 돌아가기`,ok:true});out.push({t:q.t,w:t?qWhereText(t):'',g,side:1})}return out}
// 미니맵에 찍을 것들: 지금 보고 있는 곳 기준으로 길을 따라 바꾼다
function sqMarks(world){const out=[],s=sqState(),wp=t=>{if((t.reg||'home')===REG.id)return t.room&&t.door?t.door:t;const h=regHop(REG.id,t.reg||'home'),e=EDGES.find(e=>e.to===h);return e?{x:e.x,y:e.y,via:REGIONS[t.reg||'home'].n}:null};
  {const t=qMainTargetW();if(t){const p=world?wp(t):qRoute(t);if(p)out.push({x:p.x,y:p.y,kind:'ring',col:'#ffd34d',label:p.via?`1막 → ${p.via}`:'1막',main:1})}}
  for(const id in s.a){const q=SQBY[id],t=sqTarget(q);if(!t)continue;const p=world?wp(t):qRoute(t);if(p)out.push({x:p.x,y:p.y,kind:'ring',col:'#7fd8ff',label:p.via?`${q.t} → ${p.via}`:q.t});
    if(t.spots&&REG.id==='home'&&!IN&&!DG){const a=s.a[id];SQSPOT[t.spots].forEach((sp,i)=>{if(!a.got.includes(i))out.push({x:sp.x,y:sp.y,kind:'dot',col:'#9fe39a'})})}}
  // 이름 위 ! ? 를 단 사람
  const fl=IN?IN.list:decor;
  for(const f of fl){if(f.k!=='tfolk'||f.esc)continue;const m=sqMark(f);if(m)out.push({x:f.x,y:f.y,kind:m,col:m==='!'?'#ffd34d':'#9fe0ff'})}
  if(!IN&&!DG)for(const t of TOWNS){if(!t.npc)continue;const q=qCur(),st=qState().st;if(!q)continue;let m='';if(st===0&&q.town===t.id)m='!';else if(st===2&&qTurnTown(q)===t.id)m='?';else if(st===1&&q.goals.some((g,j)=>g.type==='talk'&&g.town===t.id&&!qGoalDone(q,j)))m='?';if(m)out.push({x:t.npc.x,y:t.npc.y,kind:m,col:m==='!'?'#ffd34d':'#9fe0ff'})}
  // 받을 수 있는 의뢰가 실내 사람에게 있으면 그 건물 문에 !
  if(!IN&&!DG&&REG.id==='home')for(const b of TW.blds.home||[]){if(!b.enter)continue;let m='';for(const f of TW.folk)if(f.room===b.enter){const k=sqMark(f);if(k==='?'){m='?';break}if(k==='!')m='!'}if(m)out.push({x:b.door.x,y:b.door.y,kind:m,col:m==='!'?'#ffd34d':'#9fe0ff'})}
  return out}
{const _dm=drawMinimap;drawMinimap=function(){_dm();if(DG&&!DG.d)return;const S0=mm.width,m=S0/2600,ms=sqMarks(false);if(!ms.length)return;
  const px=(P.x-P.y)*KI,py=(P.x+P.y)*KI/2,mk=DG?m*1.4:m,ik=IN?S0*.8/Math.max(IN.R.w*1.4,IN.R.h*1.4)*1.3:0,
    toS=(x,y)=>IN?{x:S0/2+((x-IN.rc.x)-(y-IN.rc.y))*KI*ik,y:S0/2+((x-IN.rc.x)+(y-IN.rc.y))*KI/2*ik}:{x:S0/2+mk*((x-y)*KI-px),y:S0/2+mk*((x+y)*KI/2-py)};
  const R0=S0/2-8;mctx.setTransform(1,0,0,1,0,0);
  for(const k of ms){let p=toS(k.x,k.y);const dx=p.x-S0/2,dy=p.y-S0/2,l=Math.hypot(dx,dy),out=l>R0;if(k.main&&!out&&!DG&&!IN)continue;if(out){p={x:S0/2+dx/l*R0,y:S0/2+dy/l*R0}}
    if(k.kind==='dot'){if(out)continue;mctx.fillStyle=k.col;mctx.beginPath();mctx.arc(p.x,p.y,2.4,0,6.283);mctx.fill();continue}
    if(k.kind==='ring'){mctx.strokeStyle=k.col;mctx.lineWidth=2.4;mctx.globalAlpha=.7+.3*Math.sin(time*4);mctx.beginPath();mctx.arc(p.x,p.y,out?5:8,0,6.283);mctx.stroke();
      if(out){mctx.fillStyle=k.col;mctx.beginPath();const a=Math.atan2(dy,dx);mctx.moveTo(p.x+Math.cos(a)*9,p.y+Math.sin(a)*9);mctx.lineTo(p.x+Math.cos(a+2.5)*6,p.y+Math.sin(a+2.5)*6);mctx.lineTo(p.x+Math.cos(a-2.5)*6,p.y+Math.sin(a-2.5)*6);mctx.fill()}mctx.globalAlpha=1;continue}
    mctx.font=`800 ${S0<120?11:14}px sans-serif`;mctx.textAlign='center';mctx.textBaseline='middle';mctx.lineWidth=3;mctx.strokeStyle='#000';mctx.strokeText(k.kind,p.x,p.y);mctx.fillStyle=k.col;mctx.fillText(k.kind,p.x,p.y)}
  mctx.textBaseline='alphabetic'}}
// 시험용 (QA · Playwright)
window.__town.sq={SQ,SQBY,SQE,SQSPOT,SQCAT,sqState,sqAccept,sqFinish,sqAbandon,sqTalk:f=>sqTalk(f),sqUse,sqUseLive,sqTarget,sqMarks,sqHudBlocks,sqTargetRegs,questKill:e=>questKill(e),qMainTargetW,qRoute,qWhereText,qZone,regHop,questHud:()=>questHud(),doAct:()=>doAct(),qState,qCur,questTarget:()=>questTarget(),twTalk:f=>twTalk(f),get act(){return act},get tact(){return TW.act}};
