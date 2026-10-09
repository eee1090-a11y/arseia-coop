/* ---------- v22 DEEP: B4 군주의 메아리 (설계: rpg/endgame/엔드컨텐츠-설계서.md B4 · 1 · 4 · 5 · 6절) ----------
   · 입구: 지옥 「불 꺼진 왕도」 꺼진 등대지기의 집의 「메아리의 거울」(어둠의 등불 곁). 재의 군주를 한 번 쓰러뜨리면(P.w3.lord>0) 빛나고, 140레벨부터 들어간다.
   · 보스 다섯(주마다 보스마다 상급 상자 한 번, 그 뒤엔 일반 상자) + 숨은 보스 「이름을 되찾은 자」(어둠 10단계에서 재의 군주를 쓰러뜨리면 열림).
     모르가스(1막) · 엘가로스(2막) · 재의 군주의 그림자(3막) · 잿빛 성가대장(고원 깊은 던전) · 재의 군주 어둠판(140 협동 보스).
   · 「이번 주의 메아리」: 다섯 가운데 하나가 주마다(월요일) 바뀌어 재의 결정 두 배.
   · 둥근 방 하나(던전 번호 980~989). 몬스터 레벨 140, 생명력은 지옥 기준 고정 + 어둠 단계(방장이 등불에서 고른 단계: 생명력 +40%·단계, 피해 +6%·단계, 덧셈).
     파티 생명력은 다른 보스와 같이 party18.js가 처음 움직일 때 한 번 늘린다(보스 +100%/명, 덧셈).
   · 기믹은 「한 사람이 위협을 잡아 주면 쉬운」 쪽으로. 혼자면 수호 정령이 기둥 · 구슬 · 낙인 · 성가대 하나를 조금 대신하고 패턴이 느려진다.
   · 같이 하기: 방장(또는 혼자)이 방을 짓고 기믹을 계산한다. 'dg' 메시지에 b4{id,tier}를 싣고, 'v20x' b4s(0.2초마다 구슬 · 기둥 · 낙인 · 노래 상태), b4m(알림), b4req(참가자 → 방장 입장 부탁).
   · 보상(각자 화면, dgBossDrop): 재의 결정(ashGain) · END2 상자 end22Drop('b4'|'b4hidden',단계,x,y) · 첫 처치마다 스킬 포인트 1점(다섯, 설계 2-덤) · 숨은 보스 첫 처치 칭호 「이름을 지킨 자」.
   · 저장 P.b4={wk,got:[],first:[],hid,kc:{}} (없으면 기본값, 모르는 칸은 그대로 다시 씀, 비었으면 저장에 안 씀).
   · 새 보스는 기존 그림(사도 그림)을 색 · 크기만 바꿔 쓴다. 맞는 크기는 range22.js hR(e)(그림 'apostle' 반폭 × sc)가 그대로 맡는다. */
const B4={ar:null,g:null,sendT:0,qaWeek:null,raw:false,mirror:null};
window.__b4=B4;
const b4Try=f=>{try{return f()}catch(err){if(window.__QA)throw err}};
const B4_TYPES={
  b4_morgath:{n:'모르가스의 메아리 · 재의 몸',hp:2700,dmg:32,spd:90,r:34,xp:1500,aggro:1200,atk:1.6,col:'#6a5a52',ranged:true,pcol:'#ffc89a',undead:true,draw:'apostle',sc:2.8,boss:1,skills:['volley','slam','charge'],aura:'rgba(230,210,190,.3)',eye:'#ffe0b0',gshN:'재의 껍질: 불의 몸을 더 깎으세요'},
  b4_morgath2:{n:'모르가스의 메아리 · 불의 몸',hp:2700,dmg:32,spd:95,r:34,xp:1500,aggro:1200,atk:1.6,col:'#b8402a',ranged:true,pcol:'#ff5a1a',undead:true,draw:'apostle',sc:2.8,boss:1,skills:['volley','slam','charge'],aura:'rgba(255,90,40,.38)',eye:'#ffb03a',gshN:'재의 껍질: 재의 몸을 더 깎으세요'},
  b4_elgaros:{n:'엘가로스의 메아리',hp:4600,dmg:34,spd:100,r:36,xp:3000,aggro:1200,atk:1.4,col:'#4a3a5e',ranged:true,pcol:'#e0c0ff',draw:'apostle',sc:3,boss:1,skills:['volley','slam','charge'],aura:'rgba(200,150,255,.36)',eye:'#e8c8ff'},
  b4_ashname:{n:'재의 군주의 그림자 메아리',hp:4500,dmg:33,spd:100,r:38,xp:3000,aggro:1200,atk:1.4,col:'#4a3a32',undead:true,ranged:true,pcol:'#ffb07a',draw:'apostle',sc:3.4,boss:1,skills:['volley','slam','charge'],aura:'rgba(255,170,110,.36)',eye:'#ffc890'},
  b4_choir:{n:'잿빛 성가대장의 메아리',hp:4300,dmg:33,spd:90,r:30,xp:3000,aggro:1200,atk:1.5,col:'#8a8078',ranged:true,pcol:'#fff0d0',undead:true,draw:'apostle',sc:2.9,boss:1,skills:['volley','slam'],aura:'rgba(255,235,190,.34)',eye:'#fff0c0'},
  b4_singer:{n:'메아리 성가대',min:136,hp:520,dmg:18,spd:0,r:16,xp:220,aggro:700,atk:1.6,col:'#a8a098',ranged:true,pcol:'#ffe8c0',undead:true,draw:'apostle',sc:1.3,eye:'#fff0c0',still:1},
  b4_ashlord:{n:'재의 군주 · 어둠판',hp:4900,dmg:35,spd:95,r:36,xp:3600,aggro:1200,atk:1.4,col:'#1e1814',ranged:true,pcol:'#c8a0ff',draw:'apostle',sc:3.2,boss:1,skills:['slam','volley','charge'],eye:'#c8a0ff',aura:'rgba(160,110,255,.42)'},
  b4_named:{n:'이름을 되찾은 자',hp:5800,dmg:37,spd:100,r:38,xp:5000,aggro:1400,atk:1.3,col:'#d8ccb0',ranged:true,pcol:'#fff0b0',draw:'apostle',sc:3.5,boss:1,skills:['slam','volley','charge'],eye:'#ffffff',aura:'rgba(255,230,150,.48)'}};
for(const k in B4_TYPES){TYPES[k]=Object.assign({b4:1},B4_TYPES[k])}
const B4_KEYS=Object.keys(B4_TYPES);
if(typeof WX_MONV==='object')Object.assign(WX_MONV,{b4_morgath:'flamecrown',b4_morgath2:'flamecrown',b4_elgaros:'kingcrown',b4_ashname:'flamecrown',b4_choir:'mitre',b4_singer:'halo',b4_ashlord:'flamecrown',b4_named:'kingcrown'});
const B4_LIST=[
  {id:'morgath',k:'b4_morgath',n:'모르가스의 메아리',from:'1막 「재의 사도 모르가스」',role:'딜러 둘이 나눠 맡기',col:'#ff8a5a',
    d:'두 몸(재의 몸 · 불의 몸)으로 나뉩니다. 두 몸의 생명력이 많이 벌어지면 더 깎인 몸이 「재의 껍질」을 둘러 피해를 거의 받지 않고, 덜 깎인 몸은 더 세게 칩니다. 한 몸이 쓰러지면 10초 안에 다른 몸도 쓰러뜨려야 합니다.',
    solo:'혼자면 차이를 더 넓게 봐 주고 15초를 줍니다.'},
  {id:'elgaros',k:'b4_elgaros',n:'엘가로스의 메아리',from:'2막 「공허의 옥좌」',role:'탱커',col:'#d8b0ff',
    d:'공허 구슬이 위협 1위를 쫓다가 점점 빨라지고, 닿거나 9초가 지나면 그 자리에서 크게 터집니다. 한 사람이 위협을 꾸준히 잡고 구슬을 동료에게서 먼 곳으로 끌고 다니면 쉽습니다. 위협 1위가 바뀌면 구슬도 방향을 바꿉니다.',
    solo:'혼자면 구슬이 드물고 느리며, 수호 정령이 터지는 힘을 많이 막아 줍니다.'},
  {id:'ashname',k:'b4_ashname',n:'재의 군주의 그림자 메아리',from:'3막 「탑 꼭대기」',role:'치유',col:'#ffb07a',
    d:'「재의 낙인」이 붙은 사람은 매초 생명력을 잃습니다. 생명력을 90% 위로 채우면 씻겨 나가고, 10초를 버티면 둘레의 동료에게 번집니다. 사이사이 모두를 태우는 「잿불 숨결」.',
    solo:'혼자면 낙인이 약하고, 수호 정령이 낙인 동안 조금씩 치유해 줍니다.'},
  {id:'choir',k:'b4_choir',n:'잿빛 성가대장의 메아리',from:'고원 「잿빛 성가대의 무덤」',role:'끊기 · 기절',col:'#fff0c0',
    d:'성가대 넷이 노래를 시작합니다. 노래가 끝나기 전에 기절 · 얼림 · 밀치기로 끊거나 쓰러뜨리세요. 끝까지 부른 성가대 수만큼 모두 아프고 성가대장이 생명력을 되찾습니다. 넷을 다 끊으면 성가대장이 무너집니다.',
    solo:'혼자면 성가대가 둘이고 노래가 길며, 수호 정령이 하나를 끊어 줍니다.'},
  {id:'ashlord',k:'b4_ashlord',n:'재의 군주 · 어둠판',from:'왕도 「재의 왕좌」',role:'모두',col:'#c8a0ff',
    d:'「이름 부르기」를 두 번 연달아 외웁니다. 외울 때마다 다른 자리의 빛나는 기둥 셋에 불을 붙여 지키면 무너집니다. 사이사이 이름 불린 사람을 따라가는 원.',
    solo:'모자란 사람 수만큼 수호 정령이 기둥을 지키고, 외우는 시간이 길어집니다.'}];
const B4_HID={id:'named',k:'b4_named',n:'이름을 되찾은 자',from:'숨은 보스',role:'모두 · 탱킹이 거의 필수',col:'#ffe6a0',
  d:'위협 1위에게 「이름의 무게」를 떨어뜨립니다. 위협 1위가 바뀔 때마다 분노가 쌓여 더 세게 칩니다. 생명력 60% 아래에서 공허 구슬, 30% 아래에서 「이름 부르기」까지 더해집니다.',
  solo:'혼자면 수호 정령이 무게를 나눠 지고 패턴이 느립니다.'};
const B4_ALL=[...B4_LIST,B4_HID],B4_BY={};for(const b of B4_ALL)B4_BY[b.id]=b;
const B4_IDS=B4_ALL.map(b=>b.id);
/* ===== 주 · 저장 ===== */
function b4Week(){if(B4.qaWeek!=null)return B4.qaWeek;const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v20Day());return m?Math.floor((Date.UTC(+m[1],+m[2]-1,+m[3])/864e5+3)/7):0}
const b4Feat=w=>B4_LIST[(((w==null?b4Week():w)%5)+5)%5].id;
function b4Clean(raw){const o=raw&&typeof raw==='object'&&!Array.isArray(raw)?Object.assign({},raw):{};const ids=a=>Array.isArray(a)?[...new Set(a.filter(x=>B4_IDS.includes(x)))]:[];
  o.wk=Number.isFinite(+o.wk)?Math.floor(+o.wk):0;o.got=ids(o.got);o.first=ids(o.first);o.hid=o.hid?1:0;
  const kc={};if(o.kc&&typeof o.kc==='object'&&!Array.isArray(o.kc))for(const k in o.kc)kc[k]=Number.isFinite(+o.kc[k])?clamp(Math.floor(+o.kc[k]),0,1e6):0;o.kc=kc;return o}
function b4St(){if(!P)return b4Clean(null);if(!P.b4||typeof P.b4!=='object'||!Array.isArray(P.b4.got))P.b4=b4Clean(P.b4);const s=P.b4,w=b4Week();if(s.wk!==w){s.wk=w;s.got=[]}return s}
const b4Empty=s=>!s.first.length&&!s.got.length&&!s.hid&&!Object.keys(s.kc).length&&!Object.keys(s).some(k=>!['wk','got','first','hid','kc'].includes(k));
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);b4Try(()=>{if(d&&P&&P.b4){const s=b4Clean(P.b4);if(!b4Empty(s)||B4.raw)d.b4=s}});return d}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok){B4.raw=!!(d&&d.b4);P.b4=b4Clean(d&&d.b4)}return ok}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);if(P){P.b4=b4Clean(null);B4.raw=false}return r}}
const b4Lit=()=>!!(P&&P.w3&&(P.w3.lord|0)>0);
const b4Tier=()=>{if(!P||!P.dark||typeof P.dark!=='object')return 0;return clamp(Math.min(P.dark.cur|0,P.dark.open|0),0,10)};
const b4Row=t=>typeof darkMods==='function'?darkMods(t):{hp:.4*t,dmg:.06*t};
/* ===== 방 짓기 ===== */
const B4_PIL=[[[18,6],[11,18],[25,18]],[[12,9],[24,9],[18,22]]],B4_HOLD=170;
function b4Grid(){const g=new Uint8Array(DN*DN);
  for(let j=1;j<DN-1;j++)for(let i=1;i<DN-1;i++){const dx=(i-18)/12,dy=(j-14)/11;if(dx*dx+dy*dy<=1)g[tIdx(i,j)]=1}
  for(let j=24;j<=29;j++)for(let i=17;i<=18;i++)g[tIdx(i,j)]=1;
  for(let j=29;j<=33;j++)for(let i=15;i<=20;i++)g[tIdx(i,j)]=1;
  return{g,rooms:[{i:15,j:29,w:6,h:5,cx:18,cy:31},{i:6,j:3,w:25,h:22,cx:18,cy:14}]}}
const B4_PAL={id:'b4_arena',floor:[42,38,48],wall:['#4a4458','#1c1826','#6a6280'],torch:'#c8b4ff'};
if(!DGMAT[B4_PAL.id])DGMAT[B4_PAL.id]=wxDgMat(B4_PAL);
function b4Desc(id){const b=B4_BY[id];return{id:B4_PAL.id,b4:id,n:`메아리의 거울 · ${b?b.n:''}`,floor:B4_PAL.floor,wall:B4_PAL.wall,torch:B4_PAL.torch,lvl:MAXLV,mobs:[],minis:[],boss:b?b.k:null}}
function b4Ret(){const m=B4.mirror;return m?{x:m.x,y:m.y+90}:{x:P.x,y:P.y}}
function b4Pils(){return B4_PIL.map(S0=>S0.map(([i,j],k)=>{const c=tc(i,j);return{x:c.x,y:c.y,k}}))}
function b4ArInit(id,guest){B4.ar={id,guest:guest?1:0,t:0,PIL:b4Pils(),ps:0,lit:[0,0,0],held:[0,0,0],sp:[0,0,0],c:0,cm:10,cn:0,pT:1,next2:0,orbs:[],br:[],ch:null,fol:[],sendT:0};B4.g=null;return B4.ar}
function b4Enter(id){const b=B4_BY[id];if(!b||NET.guest||DG)return false;
  if(P.lvl<MAXLV){msg(`군주의 메아리는 ${MAXLV}레벨부터 들어갈 수 있습니다`,'#a39d8f');return false}
  if(!b4Lit()){msg('메아리의 거울이 아직 어둡습니다 · 재의 군주를 한 번 쓰러뜨려야 빛납니다','#a39d8f');return false}
  if(id==='named'&&!b4St().hid){msg('이름을 되찾은 자는 어둠 10단계에서 재의 군주를 쓰러뜨려야 나타납니다','#a39d8f');return false}
  if(!panel.hidden)closePanel();if(IN&&typeof twLeave==='function')try{twLeave(true,true)}catch(_){}
  const G0=b4Grid(),rng=v20Rng(v20Hash('b4|'+id)),tier=b4Tier(),ret=b4Ret();
  DG={d:b4Desc(id),ci:980+B4_IDS.indexOf(id),g:G0.g,rooms:G0.rooms,ret,lvl:MAXLV,flow:null,ft:-1,portals:[],walls:[],torches:[],floor:[],bossDead:false,boss:null,start:G0.rooms[0],b4:{id,tier}};
  const g=G0.g;for(let j=0;j<DN;j++)for(let i=0;i<DN;i++){if(g[tIdx(i,j)]===1){DG.floor.push([i,j]);continue}
    let adj=false;for(let a=-1;a<=1;a++)for(let c=-1;c<=1;c++)if(dgFloor(i+a,j+c))adj=true;
    if(adj){const c2=tc(i,j);DG.walls.push({x:c2.x,y:c2.y,i,j,wall:1,h:rng()<.15?150:120});if(rng()<.12){const sides=[[1,0],[0,1]].filter(([a,c])=>dgFloor(i+a,j+c));if(sides.length){const [a,c]=sides[0];DG.torches.push({x:c2.x+a*52,y:c2.y+c*52,light:150,torch:1})}}}}
  enemies=[];projs=projs.filter(p=>p.owner==='p'&&p.ghost);projs=[];fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  const p0=tc(DG.start.cx,DG.start.cy);DG.portals.push({x:p0.x+60,y:p0.y+60,exit:1});P.x=p0.x;P.y=p0.y;for(const a of allies){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-40,40)}followCam();
  b4ArInit(id,false);b4Spawn(b);
  const feat=b4Feat()===id,st=b4St();
  banner={t:b.n,sub:`군주의 메아리 · 몬스터 레벨 ${MAXLV}${tier?` · 어둠 ${tier}단계`:''} · ${b.role}${feat?' · 이번 주의 메아리':''}${st.got.includes(id)?' · 이번 주 상급 상자는 받음':''}`,col:b.col,life:3,max:3};
  msg(`메아리의 거울 너머 · ${b.n}: ${b.d}${b4N()<=1?' '+b.solo:''}`,b.col);
  if(NET.on&&NET.host)netSend({t:'dg',d:netDgData()});save();return true}
function b4Mob(k,x,y,lvl){const t=TYPES[k];if(!t)return null;const T=DG&&DG.b4?DG.b4.tier|0:0,M=b4Row(T);const e=dgMob(k,x,y,lvl||MAXLV);if(!e)return null;const L=e.lvl;
  e.hp=e.max=Math.max(1,Math.round(t.hp*(1+.34*(L-1))*DIFF[2].hp*(1+M.hp)));e.dmg=t.dmg*(1+.18*(L-1))*(1+M.dmg);e.b4d0=e.dmg;e.b4=1;if(NET.on&&!e.id)e.id=++NET.eid;return e}
function b4Spawn(b){const c=tc(18,14),e=b4Mob(b.k,c.x,c.y,MAXLV);DG.boss=e;e.aggroed=false;
  if(b.id==='morgath'){const tw=b4Mob('b4_morgath2',c.x+150,c.y-60,MAXLV);tw.clone=1;tw.aggroed=false;const B={boss:e,mem:[e,tw],t0:-1,win:b4N()<=1?15:10,done:0,b4:1};e.mg=B;tw.mg=B;PTY.sets.push(B)}
  return e}
// 같은 방의 사람 수 (나 포함, 최대 3)
function b4N(){let n=1;if(NET.on)for(const r of NET.peers.values())if((r.seen||r.name)&&!r.dead&&netSame(r))n++;return Math.min(3,n)}
/* ===== 같이 하기 ===== */
{const _nd=netDgData;netDgData=function(){const d=_nd();if(DG&&DG.b4)d.b4={id:DG.b4.id,tier:DG.b4.tier|0};return d}}
{const _ne=netEnterDg;netEnterDg=function(D){if(D&&D.b4&&typeof D.b4==='object'&&B4_BY[D.b4.id])return b4NetEnter(D);return _ne.apply(this,arguments)}}
function b4NetEnter(D){const id=D.b4.id,b=B4_BY[id],rg=REGIONS[D.reg]?D.reg:'home';if(IN&&typeof twLeave==='function')try{twLeave(true,true)}catch(_){}if(REG.id!==rg)loadRegion(rg);
  enemies=[];projs=projs.filter(p=>p.owner==='p');fields=[];rains=[];pend=[];loot=[];warns=[];arcs=[];
  DG={d:b4Desc(id),ci:D.ci,net:1,g:D.g,rooms:D.rooms,ret:D.ret,lvl:D.lvl,flow:null,ft:-1,portals:D.portals,walls:[],torches:[],floor:[],bossDead:!!D.bd,boss:null,start:D.rooms[D.st]||D.rooms[0],b4:{id,tier:clamp(D.b4.tier|0,0,10)}};
  for(let j=0;j<DN;j++)for(let i=0;i<DN;i++)if(D.g[tIdx(i,j)]===1)DG.floor.push([i,j]);
  for(const [i,j,h] of D.walls){const c2=tc(i,j);DG.walls.push({x:c2.x,y:c2.y,i,j,wall:1,h})}for(const [x,y] of D.torches)DG.torches.push({x,y,light:150,torch:1});
  const p0=tc(DG.start.cx,DG.start.cy);P.x=p0.x+rnd(-30,30);P.y=p0.y+rnd(-30,30);for(const al of allies){al.x=P.x+rnd(-40,40);al.y=P.y+rnd(-40,40)}followCam();
  b4ArInit(id,true);banner={t:b.n,sub:`군주의 메아리 · 파티와 함께 · ${b.role}${DG.b4.tier?` · 어둠 ${DG.b4.tier}단계`:''}`,col:b.col,life:2.6,max:2.6};
  msg(`메아리의 거울 너머 ${b.n}에 파티와 함께 들어섰습니다 · ${b.d}`,b.col);if(NET.on)netSendState();return true}
V20NET.b4req=(m,r)=>{if(!NET.host||DG)return;const id=String(m.id||'');if(!B4_BY[id])return;msg(`${r&&r.name||'동료'}님이 「${B4_BY[id].n}」에 가자고 합니다`,'#c8a0ff');b4Enter(id)};
V20NET.b4m=m=>{if(!NET.guest)return;if(typeof m.s==='string'&&m.s)msg(m.s.slice(0,180),typeof m.c==='string'&&/^#[0-9a-f]{3,6}$/i.test(m.c)?m.c:'#c8b8a8')};
V20NET.b4s=m=>{if(!NET.guest||!DG||!DG.b4||m.id!==DG.b4.id)return;const n3=a=>Array.isArray(a)&&a.length===3;
  B4.g={at:time,o:Array.isArray(m.o)?m.o.slice(0,4).filter(a=>Array.isArray(a)&&Number.isFinite(+a[0])&&Number.isFinite(+a[1])):[],ps:m.ps===1?1:0,
    l:n3(m.l)?m.l.map(v=>clamp((+v||0)/100,0,1)):[0,0,0],s:n3(m.s)?m.s.map(v=>v?1:0):[0,0,0],h:n3(m.h)?m.h.map(v=>v?1:0):[0,0,0],
    c:clamp((+m.c||0)/10,0,60),cm:clamp((+m.cm||100)/10,1,60),cn:m.cn|0,br:Array.isArray(m.br)?m.br.slice(0,4).map(String):[],ch:Array.isArray(m.ch)?[clamp((+m.ch[0]||0)/10,0,60),clamp((+m.ch[1]||10)/10,1,60)]:null,so:m.so?1:0}};
const b4Say=(s,c)=>{msg(s,c);v20Send('b4m',{s,c})};
const b4Key=o=>o===P?0:o&&o.remote?o.id:o?'pet':null;
const b4NetId=o=>o===P?(NET.on?NET.id:0):o&&o.id;
const b4Ga=w=>{const c=String(w).charCodeAt(String(w).length-1)-0xAC00;return w+(c>=0&&c<11172&&c%28?'이':'가')};
const b4Nm=p=>p===P?(NET.on?(NET.name||'방장')+'님':'당신'):p&&p.remote?(p.name||'동료')+'님':'소환수';
const b4Hit=(o,d,e)=>{if(!o||!(d>0))return;if(o===P)hitPlayer(d,e);else if(o.remote)netHit(o,d,e);else hurtAlly(o,d)};
const b4Tg=e=>{const o=enemyTarget(e);return o&&o.tg||P};
function b4Dmg(e){if(e.b4d0)e.dmg=e.b4d0*(1+(e.b4rg?.25:0)+.12*(e.b4st|0))}
const b4Fx=(x,y,col,r)=>{rings.push({x,y,r:10,max:r,life:.8,col});burst(x,y,col,30,Math.min(400,r*1.6),3,20);PTY.pm({k:'fx',x:Math.round(x),y:Math.round(y),c:col,r:Math.round(r)})};
function b4Follow(e,p,rad,t,mul,col,lock){const w={x:p.x,y:p.y,rad,t,max:t,dmg:e.dmg*mul,col,src:e};warns.push(w);B4.ar.fol.push({w,tg:p,lock});return w}
/* ===== 기믹 (방장 · 혼자) ===== */
// 모르가스: 두 몸 생명력 차이 → 더 깎인 몸에 재의 껍질(받는 피해 −80%, party18 e.gsh), 덜 깎인 몸 피해 +25%(덧셈)
function b4Morg(e,dt,solo){const B=e.mg;if(!B)return;B.win=solo?15:10;const tw=B.mem[1];if(!tw)return;const up=o=>!o.dead&&!o.down&&o.hp>0;
  if(!up(e)||!up(tw)){if(e.gsh||tw.gsh||e.b4rg||tw.b4rg){e.gsh=tw.gsh=0;e.b4rg=tw.b4rg=0;b4Dmg(e);b4Dmg(tw)}return}
  const pa=e.hp/e.max,pb=tw.hp/tw.max,gap=Math.abs(pa-pb),G0=solo?.2:.12,lo=pa<pb?e:tw,hi=lo===e?tw:e;
  if(gap>G0){if(!lo.gsh){lo.gsh=1;hi.gsh=0;lo.b4rg=0;hi.b4rg=1;b4Dmg(e);b4Dmg(tw);rings.push({x:lo.x,y:lo.y,r:10,max:lo.r*3,life:.7,col:'#e8dccc'});
      b4Say(`${TYPES[lo.k].n.split(' · ')[1]||'한 몸'}이 「재의 껍질」을 두릅니다 — ${TYPES[hi.k].n.split(' · ')[1]||'다른 몸'}을 더 깎으세요 (그 몸은 지금 더 세게 칩니다)`,'#e8dccc')}}
  else if(gap<G0*.5&&(e.gsh||tw.gsh)){e.gsh=tw.gsh=0;e.b4rg=tw.b4rg=0;b4Dmg(e);b4Dmg(tw);b4Say('두 몸의 생명력이 다시 비슷해져 껍질이 벗겨졌습니다','#ffd34d')}}
// 엘가로스 · 숨은 보스: 공허 구슬
function b4OrbStart(e,solo,first,every){const A=B4.ar;e.b4oT=(e.b4oT==null?first:e.b4oT)-(A._dt||0);if(e.b4oT>0||A.orbs.length>=2||e.brk>0||e.stunT>0)return;e.b4oT=solo?every*1.45:every;
  A.orbs.push({x:e.x,y:e.y,t:-1.2,life:9,src:e,tk:null,solo,pT:0});warns.push({x:e.x,y:e.y,rad:60,t:1.2,max:1.2,dmg:0,col:'#c8a0ff'});
  b4Say(solo?`${b4Ga(TYPES[e.k].n)} 공허 구슬을 띄웁니다 — 구슬은 당신을 쫓습니다. 9초 동안 끌고 다니다 터뜨리세요 (수호 정령이 막아 줍니다)`:`${b4Ga(TYPES[e.k].n)} 공허 구슬을 띄웁니다 — 위협 1위가 구슬을 동료에게서 먼 곳으로 끌고 가세요`,'#d8b0ff')}
function b4Orbs(dt,A){for(const o of A.orbs){o.t+=dt;if(o.t<0)continue;const e=o.src;if(!e||e.dead){o.done=1;continue}const tg=b4Tg(e),k=b4Key(tg);
    if(o.tk!==k){if(o.tk!=null){rings.push({x:o.x,y:o.y,r:6,max:70,life:.5,col:'#e0c0ff'});b4Say(`공허 구슬이 ${b4Nm(tg)}에게로 방향을 바꿉니다 (위협 1위가 바뀜)`,'#e0c0ff')}o.tk=k}
    const sp=Math.min(o.solo?150:175,(o.solo?95:110)+12*o.t),dx=tg.x-o.x,dy=tg.y-o.y,l=Math.hypot(dx,dy)||1,mv=Math.min(l,sp*dt);o.x+=dx/l*mv;o.y+=dy/l*mv;
    o.pT-=dt;if(o.pT<=0){o.pT=.5;for(const p of netPlayers())if(p!==tg&&dist(p,o)<80)b4Hit(p,e.dmg*.12,e)}
    if(l<36||o.t>=o.life)b4Boom(o,e)}
  A.orbs=A.orbs.filter(o=>!o.done)}
function b4Boom(o,e){o.done=1;const rad=170,m=o.solo?.6:1,d=e.dmg*2.4*m;for(const p of netPlayers())if(dist(p,o)<rad+(p.r||14))b4Hit(p,d,e);for(const a of allies)if(dist(a,o)<rad)hurtAlly(a,d);
  if(!e.dead&&e.hp>0)e.hp=Math.min(e.max,e.hp+e.max*.02);b4Fx(o.x,o.y,'#b48aff',rad);shake=Math.max(shake,8)}
// 재의 군주의 그림자: 잿불 숨결 · 재의 낙인
function b4Ash(e,dt,solo){const A=B4.ar;if(!e.aggroed||e.hp<=0)return;
  e.b4pT=(e.b4pT==null?6:e.b4pT)-dt;if(e.b4pT<=0&&!(e.brk>0)){e.b4pT=solo?11:8;const d=e.dmg*.45;for(const p of netPlayers())if(dist(p,e)<1600)b4Hit(p,d,e);for(const a of allies)hurtAlly(a,d);b4Fx(e.x,e.y,'#ffb07a',520)}
  e.b4bT=(e.b4bT==null?10:e.b4bT)-dt;if(e.b4bT>0||e.brk>0||e.stunT>0)return;e.b4bT=solo?22:16;
  const pl=netPlayers().filter(p=>dist(p,e)<1600&&!A.br.some(b=>b.p===p));if(!pl.length)return;for(let i=pl.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[pl[i],pl[j]]=[pl[j],pl[i]]}
  const got=pl.slice(0,solo?1:Math.min(2,pl.length));for(const p of got)A.br.push({p,t:0,max:10,e,k:1});
  b4Say(`${b4Ga(TYPES[e.k].n)} ${got.map(b4Nm).join(' · ')}에게 「재의 낙인」을 찍습니다 — 생명력을 90% 위로 채우면 씻겨 나갑니다${solo?' (수호 정령이 조금 치유해 줍니다)':''}`,'#ffb07a')}
function b4Brands(dt,A,solo){for(const b of A.br){b.t+=dt;const p=b.p;if(!p||p.dead||(p!==P&&!netSame(p))){b.done=1;continue}
    const fr=p===P?P.hp/maxHp():(p.max>0?p.hp/p.max:0);if(b.t>1.5&&fr>=.9){b.done=1;rings.push({x:p.x,y:p.y,r:6,max:70,life:.6,col:'#9fe39a'});b4Say(`${b4Nm(p)}의 「재의 낙인」이 씻겨 나갔습니다`,'#9fe39a');continue}
    b.k-=dt;if(b.k<=0){b.k=1;const mh=p===P?maxHp():(p.max||1000);b4Hit(p,mh*(solo?.025:.04),b.e);if(solo&&p===P&&!P.dead){healP(maxHp()*.02);rings.push({x:P.x,y:P.y,r:4,max:40,life:.4,col:'#9fe0ff'})}}
    if(b.t>=b.max){b.done=1;const d=(b.e&&b.e.dmg||500)*1.4;let n=0;for(const o of netPlayers())if(o!==p&&dist(o,p)<160){b4Hit(o,d,b.e);n++}
      b4Fx(p.x,p.y,'#ff7a3a',160);b4Say(`${b4Nm(p)}의 「재의 낙인」이 끝까지 타올라 번졌습니다${n?` (동료 ${n} 맞음)`:''}`,'#ff7a3a')}}
  A.br=A.br.filter(b=>!b.done)}
// 잿빛 성가대장: 성가대의 노래
function b4Choir(e,dt,solo){const A=B4.ar;if(!e.aggroed||e.hp<=0||A.ch)return;e.b4cT=(e.b4cT==null?12:e.b4cT)-dt;if(e.b4cT>0||e.brk>0||e.stunT>0)return;e.b4cT=solo?34:26;
  const n=solo?2:4,dur=solo?12:9;A.ch={t:dur,max:dur,e,sp:solo?3:-1};
  for(let i=0;i<n;i++){const a=i*6.283/n+.4;let x=e.x+Math.cos(a)*260,y=e.y+Math.sin(a)*260;if(!dgFree(x,y,18)){x=e.x+Math.cos(a)*130;y=e.y+Math.sin(a)*130}if(!dgFree(x,y,18)){x=e.x+Math.cos(a)*60;y=e.y+Math.sin(a)*60}
    const s=b4Mob('b4_singer',x,y,MAXLV-2);if(!s)continue;s.b4sg=1;s.aggroed=true;s.atkCd=dur+1;s.cast=dur;rings.push({x,y,r:4,max:60,life:.6,col:'#fff0c0'})}
  b4Say(`성가대장이 성가대 ${["","하나","둘","셋","넷"][n]||n+"명"}을 불러 노래를 시작합니다 — ${dur}초 안에 기절 · 얼림 · 밀치기로 끊거나 쓰러뜨리세요${solo?' (수호 정령이 하나를 끊어 줍니다)':''}`,'#fff0c0')}
function b4Cut(s,who){if(!s||s.b4sg!==1||s.dead)return;s.b4sg=2;s.cast=0;const left=enemies.filter(o=>o.b4sg===1&&!o.dead).length;rings.push({x:s.x,y:s.y,r:6,max:70,life:.5,col:'#ffd34d'});killE(s);
  b4Say(`${who?who+' ':''}성가대 하나를 끊었습니다 (남은 ${left})`,'#ffd34d')}
function b4Sing(dt,A){const C=A.ch;if(!C)return;C.t-=dt;
  for(const s of enemies){if(s.b4sg!==1||s.dead)continue;if(s.stunT>0||s.freezeT>0||s.b4cut)b4Cut(s);else{s.cast=Math.max(s.cast||0,.3);s.atkCd=Math.max(s.atkCd||0,.5)}}
  if(C.sp>=0){C.sp-=dt;if(C.sp<0){const L=enemies.filter(s=>s.b4sg===1&&!s.dead);if(L.length)b4Cut(pick(L),'수호 정령이')}}
  const left=enemies.filter(s=>s.b4sg===1&&!s.dead);
  if(!left.length){A.ch=null;if(C.e&&!C.e.dead&&C.e.hp>0){PTY.stag(C.e,PTY.STG.interrupt*2);b4Say('성가대를 모두 끊었습니다! 성가대장이 흔들립니다','#ffd34d')}return}
  if(C.t<=0){A.ch=null;const k=left.length;for(const s of left){s.b4sg=2;s.dead=true;killFx(s);if(NET.host)netKill(s)}
    if(C.e&&!C.e.dead){const d=C.e.dmg*.55*k;for(const p of netPlayers())b4Hit(p,d,C.e);for(const a of allies)hurtAlly(a,d);if(C.e.hp>0)C.e.hp=Math.min(C.e.max,C.e.hp+C.e.max*.04*k);b4Fx(C.e.x,C.e.y,'#fff0c0',600)}
    b4Say(`노래가 끝까지 울렸습니다 — 성가대 ${k}의 목소리만큼 모두 아프고 성가대장이 생명력을 되찾습니다`,'#ff9a6a')}}
// 밀치기도 노래를 끊는다 (기절 · 얼림은 매 프레임 b4Sing에서 본다)
{const _af=applyFx;applyFx=function(e,s,from){if(e&&e.b4sg===1&&s&&!s.ghost&&!NET.guest&&(s.knock||0)>0)e.b4cut=1;return _af.apply(this,arguments)}}
// 재의 군주 어둠판 · 숨은 보스: 기둥과 「이름 부르기」 (o.dbl: 두 번 연달아)
function b4Pil(e,dt,n,ch){const A=B4.ar,S0=A.PIL[A.ps],pl=netPlayers();
  for(let k=0;k<3;k++){const sp=k>=n?1:0,held=sp||pl.some(o=>dist(o,S0[k])<B4_HOLD);A.sp[k]=sp;A.held[k]=held?1:0;A.lit[k]=ch?clamp(A.lit[k]+(held?dt/2.5:-dt*.35),0,1):Math.max(0,A.lit[k]-dt*.8)}}
function b4Lord(e,dt,solo,n,o){const A=B4.ar;b4Pil(e,dt,n,A.c>0);if(!e.aggroed||e.hp<=0)return;
  if(A.c>0){e.cast=Math.max(e.cast||0,.2);if(e.brk>0){b4ChantEnd(e,true,solo,o);return}A.c-=dt;A.pT-=dt;if(A.pT<=0){A.pT=1;if(A.lit.every(v=>v>=1))PTY.stag(e,20)}
    if(e.brk>0){b4ChantEnd(e,true,solo,o);return}if(A.c<=0)b4ChantEnd(e,false,solo,o);return}
  if(A.next2>0){if(e.brk>0)return;A.next2-=dt;if(A.next2<=0){A.ps=1;b4ChantStart(e,solo,n,2)}return}
  if(e.brk>0||e.stunT>0||e.freezeT>0)return;
  e.b4cT=(e.b4cT==null?o.first:e.b4cT)-dt;if(e.b4cT<=0){A.ps=0;b4ChantStart(e,solo,n,o.dbl?1:3);return}
  if(o.call){e.b4nT=(e.b4nT==null?8:e.b4nT)-dt;if(e.b4nT<=0&&e.b4cT>4){e.b4nT=solo?14:11;const tg=pl0(e);if(tg){b4Follow(e,tg,solo?150:170,2.6,solo?1.8:2.2,'#c8a0ff',.6);
    b4Say(`${b4Ga(TYPES[e.k].n)} ${b4Nm(tg)}의 이름을 부릅니다 — ${solo?'원이 굳기 전에 밖으로 피하세요':'이름 불린 사람은 동료에게서 떨어지세요'}`,'#c8a0ff')}}}}
const pl0=e=>{const L=netPlayers().filter(o=>dist(o,e)<1400);return L.length?pick(L):null};
function b4ChantStart(e,solo,n,which){const A=B4.ar,d=which===2?(solo?14:10):(solo?16:12);A.c=d;A.cm=d;A.cn=which;A.pT=1;A.lit=[0,0,0];e.cast=.2;
  rings.push({x:e.x,y:e.y,r:10,max:260,life:1,col:'#c8a0ff'});shake=Math.max(shake,6);const sp=3-n;
  b4Say(`${b4Ga(TYPES[e.k].n)} 「이름 부르기」를 외웁니다${which===1?' (첫째)':which===2?' (둘째 · 다른 자리의 기둥)':''} — 빛나는 기둥 셋에 불을 붙여 지키세요${sp?` (수호 정령이 기둥 ${sp}개를 지킵니다)`:''}`,'#c8a0ff')}
function b4ChantEnd(e,ok,solo,o){const A=B4.ar,which=A.cn;A.c=0;A.cn=0;e.cast=0;
  if(ok){rings.push({x:e.x,y:e.y,r:10,max:300,life:1,col:'#ffd34d'});b4Say('「이름 부르기」를 끊었습니다! 무너졌습니다 — 지금 쏟아부으세요','#ffd34d')}
  else{const unlit=A.lit.filter(v=>v<1).length,mul=1.3+.45*unlit;for(const p of netPlayers())b4Hit(p,e.dmg*mul,e);for(const a of allies)hurtAlly(a,e.dmg*mul);if(unlit&&e.hp>0)e.hp=Math.min(e.max,e.hp+e.max*.03*unlit);
    b4Fx(e.x,e.y,'#b48aff',900);shake=Math.max(shake,12);flash={col:'#8a5aff',a:.25};b4Say(`이름이 불렸습니다${unlit?` — 꺼진 기둥 ${unlit}개만큼 더 아프고 생명력을 되찾습니다`:' — 무너짐 게이지가 모자랐습니다'}`,'#b48aff')}
  A.lit=[0,0,0];if(which===1){A.next2=3}else{e.b4cT=o.every*(solo?1.25:1);e.b4nT=6;A.ps=0}}
// 숨은 보스: 이름의 무게 · 흔들린 이름(위협 1위가 바뀌면 분노)
function b4Named(e,dt,solo,n){const A=B4.ar;if(!e.aggroed||e.hp<=0)return;const tg=b4Tg(e),k=b4Key(tg);
  if(!solo&&e.b4lk!=null&&k!==e.b4lk&&k!=='pet'&&e.b4lk!=='pet'){e.b4st=Math.min(5,(e.b4st|0)+1);e.b4stT=20;b4Dmg(e);rings.push({x:e.x,y:e.y,r:10,max:e.r*3,life:.5,col:'#ff6a3a'});
    b4Say(`위협 1위가 바뀌어 이름을 되찾은 자가 분노합니다 (${e.b4st}겹 · 피해 +${e.b4st*12}%) — 한 사람이 꾸준히 붙잡아 주세요`,'#ff8a5a')}
  e.b4lk=k;if(e.b4st>0){e.b4stT-=dt;if(e.b4stT<=0){e.b4st=0;b4Dmg(e)}}
  if(A.c>0||A.next2>0)return;
  e.b4wT=(e.b4wT==null?6:e.b4wT)-dt;if(e.b4wT<=0&&!(e.brk>0)&&!(e.stunT>0)){e.b4wT=solo?13:9;if(tg){b4Follow(e,tg,120,1.8,2.4*(solo?.6:1),'#fff0b0',.5);
    b4Say(`이름을 되찾은 자가 ${b4Nm(tg)}에게 「이름의 무게」를 떨어뜨립니다 — ${solo?'수호 정령이 무게를 나눠 집니다':'위협을 잡은 사람이 받아 내고, 다른 사람은 떨어지세요'}`,'#fff0b0')}}}
// 한 프레임 (모든 화면: 참가자는 그리기 상태만)
function b4Tick(dt){const A=B4.ar;if(!A)return;if(!DG||!DG.b4||DG.b4.id!==A.id){B4.ar=null;B4.g=null;return}A.t+=dt;if(A.guest||NET.guest)return;A._dt=dt;
  const n=b4N(),solo=n<=1;
  for(const e of enemies){if(e.dead||e.down||!e.b4)continue;const k=e.k;
    if(k==='b4_morgath'&&!e.clone)b4Morg(e,dt,solo);
    else if(k==='b4_elgaros'){if(e.aggroed&&e.hp>0)b4OrbStart(e,solo,8,14)}
    else if(k==='b4_ashname')b4Ash(e,dt,solo);
    else if(k==='b4_choir')b4Choir(e,dt,solo);
    else if(k==='b4_ashlord')b4Lord(e,dt,solo,n,{dbl:1,first:15,every:42,call:1});
    else if(k==='b4_named'){b4Named(e,dt,solo,n);if(e.aggroed&&e.hp>0&&e.hp<e.max*.6&&!(A.c>0))b4OrbStart(e,solo,3,16);
      if(e.hp<e.max*.3||A.c>0)b4Lord(e,dt,solo,n,{dbl:0,first:3,every:30,call:0});else b4Pil(e,dt,n,false)}}
  b4Orbs(dt,A);b4Brands(dt,A,solo);b4Sing(dt,A);
  for(const f of A.fol){const w=f.w;if(w.done||w.t<=f.lock||!f.tg||f.tg.dead)continue;const q=Math.min(1,dt*6);w.x+=(f.tg.x-w.x)*q;w.y+=(f.tg.y-w.y)*q}A.fol=A.fol.filter(f=>!f.w.done&&f.w.t>0);
  if(NET.on&&NET.host&&(A.sendT-=dt)<=0){A.sendT=.2;v20Send('b4s',b4Pack(A,solo))}}
function b4Pack(A,solo){return{id:A.id,o:A.orbs.filter(o=>o.t>=0).map(o=>[Math.round(o.x),Math.round(o.y)]),ps:A.ps,l:A.lit.map(v=>Math.round(v*100)),s:A.sp,h:A.held,c:Math.round(A.c*10),cm:Math.round(A.cm*10),cn:A.cn,
  br:A.br.map(b=>b4NetId(b.p)).filter(Boolean),ch:A.ch?[Math.round(A.ch.t*10),Math.round(A.ch.max*10)]:0,so:solo?1:0}}
V20.tick.push(dt=>b4Try(()=>b4Tick(dt)));
{const _ld=leaveDungeon;leaveDungeon=function(){B4.ar=null;B4.g=null;return _ld.apply(this,arguments)}}
/* ===== 보상 (각자 화면) ===== */
function b4Reward(e){const id=(B4_ALL.find(b=>b.k===e.k)||{}).id;if(!id||!DG||!DG.b4)return null;const st=b4St(),T=clamp(DG.b4.tier|0,0,10),big=!st.got.includes(id),feat=b4Feat()===id,first=!st.first.includes(id),x=e.x,y=e.y;
  if(big)st.got.push(id);if(first)st.first.push(id);st.kc[id]=(st.kc[id]|0)+1;
  let ash=id==='named'?30+3*T:big?15+2*T:4+T;if(feat)ash*=2;if(typeof ashGain==='function')ashGain(ash,x,y-30);
  let box='';if(typeof end22Drop==='function'){try{if(id==='named'){end22Drop('b4hidden',T,x,y,big?{chest:1}:null);box=big?' · 숨은 보스 상급 상자':' · 숨은 보스 상자'}else{end22Drop('b4',T,x,y,big?{chest:1}:null);box=big?' · 상급 상자':' · 상자'}}catch(err){if(window.__QA)throw err}}
  if(!box&&big){const it=makeItem(e.lvl,true,null,R()<.5?'uniq':'set');loot.push({x:x+rnd(-40,40),y:y+rnd(20,60),kind:'item',item:it,t:0});box=' · 상급 상자'}
  let sp='';if(first&&id!=='named'){P.sp=(P.sp|0)+1;sp=' · 첫 처치: 스킬 포인트 +1'}
  if(first&&id==='named'){sp=' · 칭호 「이름을 지킨 자」';burst(P.x,P.y,'#ffe6a0',40,200,3,30)}
  if(id==='ashlord'&&T>=10)b4Unlock();
  const b=B4_BY[id];msg(`${b.n} 처치 · 재의 결정 +${ash}${feat?' (이번 주의 메아리 두 배)':''}${box}${big?'':' · 이번 주 상급 상자는 이미 받음'}${sp}`,b.col);
  if(banner&&banner.life>0)banner.sub=(banner.sub?banner.sub+' · ':'')+`재의 결정 +${ash}${box}${sp}`;save();return{id,ash,big,first,feat}}
function b4Unlock(){const st=b4St();if(st.hid)return false;st.hid=1;msg('어둠 10단계의 재의 군주가 쓰러지며 이름 하나가 풀려났습니다 · 메아리의 거울에 숨은 보스 「이름을 되찾은 자」가 나타납니다','#ffe6a0');
  banner={t:'숨은 보스가 열렸습니다',sub:'메아리의 거울 · 「이름을 되찾은 자」',col:'#ffe6a0',life:3.2,max:3.2};save();return true}
{const _bd=dgBossDrop;dgBossDrop=function(e){const r=_bd.apply(this,arguments);b4Try(()=>{if(!e||GHOST||!P)return;const T=TYPES[e.k];
  if(T&&T.b4&&T.boss&&!e.clone&&DG&&DG.b4)b4Reward(e);
  else if(e.k==='b_ashlord'&&typeof darkTier==='function'&&darkTier()>=10)b4Unlock()});return r}}
V20.titles.push({id:'b4named',n:'이름을 지킨 자',col:'#ffe6a0',src:'군주의 메아리 · 숨은 보스',have:()=>!!(P&&P.b4&&Array.isArray(P.b4.first)&&P.b4.first.includes('named'))});
/* ===== 메아리의 거울 (꺼진 등대지기의 집) ===== */
twDef('b4mirror',100,190,50,176,(g,v)=>{Kit.shadow(g,6,4,36,12,.9);
  twBox(g,0,0,0,44,26,12,'#4a4450',{tex:'stone',texA:.55});for(const x of [-17,17])twBox(g,x,0,12,8,10,100,'#5a5262',{tex:'stone',texA:.5});twBox(g,0,0,110,44,12,10,'#5a5262',{tex:'stone',texA:.5});
  const c=isoP(0,0,62),t=isoP(0,0,124);g.fillStyle='#14101e';g.beginPath();g.ellipse(c.x,c.y,15,42,0,0,6.283);g.fill();
  g.strokeStyle='#b9a8d8';g.lineWidth=1.6;g.beginPath();g.ellipse(c.x,c.y,15,42,0,0,6.283);g.stroke();g.strokeStyle='rgba(200,180,255,.35)';g.lineWidth=1;
  for(let i=0;i<4;i++){g.beginPath();g.moveTo(c.x-8+i*4,c.y-30+i*6);g.lineTo(c.x-2+i*4,c.y-18+i*6);g.stroke()}
  g.fillStyle='#4a4458';g.beginPath();g.moveTo(t.x-12,t.y+2);g.lineTo(t.x,t.y-12);g.lineTo(t.x+12,t.y+2);g.closePath();g.fill();g.fillStyle='#c8a0ff';g.fillRect(t.x-1.5,t.y-8,3,4)});
function b4PlaceMirror(){if(B4.mirror)return B4.mirror;const d=v20AddProp('keeperhouse',-160,110,{k:'b4mirror',pv:0,use:'b4:mirror',qonly:1});if(d){B4.mirror=d;v20SyncDecor()}return d}
b4PlaceMirror();
{const _l=sqUseLive;sqUseLive=function(d){if(d&&d.use==='b4:mirror')return b4Lit()?{label:'메아리의 거울 · 군주의 메아리',col:'#c8a0ff',q:0}:null;return _l.apply(this,arguments)}}
{const _u=sqUse;sqUse=function(d){if(d&&d.use==='b4:mirror'){if(b4Lit())v20Open('b4');return}return _u.apply(this,arguments)}}
{const _p=twDrawProp;twDrawProp=function(d){const r=_p.apply(this,arguments);if(d&&d.k==='b4mirror'&&b4Lit()&&d._s){const s=d._s;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4+.2*Math.sin(time*2.2);glow(s.x,s.y-70,34,'#b48aff');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}return r}}
/* ===== 창 ===== */
V20P.b4={title:()=>'메아리의 거울 · 군주의 메아리',html(){const st=b4St(),g=NET.guest,w=b4Week(),feat=b4Feat(w),T=b4Tier(),low=P.lvl<MAXLV;
  let h=`<p class="muted" style="margin-top:0">지금까지 쓰러뜨린 큰 보스들이 ${MAXLV}레벨 협동 보스로 돌아옵니다. 보스마다 <b>한 주에 한 번 상급 상자</b>(월요일에 다시), 그 뒤엔 일반 상자. 처음 쓰러뜨리면 스킬 포인트 1점. 혼자서도 갈 수 있지만, 탱커 · 치유가 있으면 훨씬 쉽습니다.</p>`;
  h+=`<div class="v20box"><b>이번 주의 메아리:</b> <span style="color:${B4_BY[feat].col}">${B4_BY[feat].n}</span> <span class="muted">(재의 결정 두 배)</span><div class="muted" style="font-size:12px;margin-top:3px">어둠 단계: ${T?`${T}단계 (몬스터 생명력 +${T*40}% · 피해 +${T*6}%)`:'꺼짐'} · 어둠의 등불에서 고릅니다${g?' · 같이 하기: 방장이 고른 단계':''}</div>${low?`<div style="margin-top:3px"><b>${MAXLV}레벨부터</b> 들어갈 수 있습니다.</div>`:''}</div>`;
  const row=(b,lock)=>{const got=st.got.includes(b.id),first=st.first.includes(b.id);
    const btn=lock?'<button type="button" disabled>잠김</button>':v20Btn('b4go',b.id,g?'방장과 가기':'들어가기',{cls:'primary',dis:low&&!g});
    return `<div class="v20row"><div><b style="color:${b.col}">${b.n}</b> <span class="v20tag" style="background:#2a2236;color:#e8dcff">${b.role}</span>${b.id===feat?'<span class="v20tag" style="background:#3a2a10;color:#ffd76a">이번 주</span>':''}
      <div class="muted" style="font-size:12px">${b.from} · ${lock?'어둠 10단계에서 재의 군주(재의 왕좌 또는 이 거울의 「재의 군주 · 어둠판」)를 쓰러뜨리면 열립니다':b.d}</div>
      ${lock?'':`<div class="muted" style="font-size:12px">혼자: ${b.solo}</div><div style="font-size:12px">${got?'<span class="muted">이번 주 상급 상자 받음</span>':'<span style="color:#ffd76a">이번 주 상급 상자 남음</span>'}${first?` · 처치 ${st.kc[b.id]|0}번`:b.id==='named'?' · 첫 처치 칭호 「이름을 지킨 자」':' · 첫 처치 스킬 포인트 +1'}</div>`}</div><div class="btns">${btn}</div></div>`};
  for(const b of B4_LIST)h+=row(b,false);h+=row(B4_HID,!st.hid);return h}};
V20A.b4go=v=>{const id=String(v||'');if(!B4_BY[id])return;if(NET.guest){v20Send('b4req',{id});closePanel();msg('방장에게 메아리의 거울로 가자고 했습니다','#9fe0ff');return}b4Enter(id)};
/* ===== 그리기: 구슬 · 기둥 · 낙인 · 수호 정령 · 외우기 막대 ===== */
function b4View(){const A=B4.ar;if(!A||!DG||!DG.b4)return null;if(!A.guest&&!NET.guest)return{o:A.orbs.filter(o=>o.t>=0).map(o=>[o.x,o.y]),ps:A.ps,l:A.lit,s:A.sp,h:A.held,c:A.c,cm:A.cm,cn:A.cn,br:A.br.map(b=>b.p),ch:A.ch?[A.ch.t,A.ch.max]:null,so:b4N()<=1};
  const g=B4.g;if(!g||time-g.at>3)return null;const who=id=>{if(NET.on&&id===NET.id)return P;const r=NET.peers.get(id);return r&&netSame(r)?r:null};return Object.assign({},g,{br:g.br.map(who).filter(Boolean)})}
const b4Pillars=()=>{const id=DG&&DG.b4&&DG.b4.id;return id==='ashlord'||id==='named'};
{const _g=drawV5Glow;drawV5Glow=function(){_g.apply(this,arguments);b4Try(b4Glow)}}
function b4Glow(){const V=b4View(),A=B4.ar;if(!V||!A)return;G();
  if(b4Pillars()){const S0=A.PIL[V.ps|0];for(let k=0;k<3;k++){const p=S0[k],lit=V.l[k]||0,c=lit>=1?'#ffb04a':V.s[k]?'#9fe0ff':V.h[k]?'#ffd08a':'#8a7a9a';ctx.globalAlpha=V.c>0?.55:.18;ctx.strokeStyle=c;ctx.lineWidth=V.c>0?10:5;ctx.beginPath();ctx.arc(p.x,p.y,B4_HOLD,0,6.283);ctx.stroke();
      if(lit>0){ctx.globalAlpha=.9;ctx.strokeStyle='#ffd08a';ctx.lineWidth=18;ctx.beginPath();ctx.arc(p.x,p.y,B4_HOLD,-1.571,-1.571+6.283*lit);ctx.stroke()}}}
  for(const p of V.br){ctx.globalAlpha=.6+.25*Math.sin(time*6);ctx.strokeStyle='#ff8a3a';ctx.lineWidth=6;ctx.beginPath();ctx.arc(p.x,p.y,46,0,6.283);ctx.stroke()}
  S();ctx.globalCompositeOperation='lighter';
  for(const [x,y] of V.o){const s=W2S(x,y);if(!onScreen(s,80))continue;ctx.globalAlpha=.85;glow(s.x,s.y-40,46+6*Math.sin(time*8),'#8a5aff');ctx.globalAlpha=1;glow(s.x,s.y-40,16,'#e8d8ff')}
  if(b4Pillars()){const S0=A.PIL[V.ps|0];for(let k=0;k<3;k++){const p=S0[k],s=W2S(p.x,p.y);if(!onScreen(s,200))continue;const lit=V.l[k]||0;ctx.globalAlpha=.35+.5*lit;glow(s.x,s.y-30,22+40*lit,lit>0?'#ff9a40':'#8a6aa0');
      if(lit>0)ctx.drawImage(flameCv('#ff9a40',Math.floor(time*12+k*5)&3),s.x-10,s.y-62,20,34);
      if(V.s[k]){const a=time*1.3+k*2.1,x=s.x+Math.cos(a)*46,y=s.y-70+Math.sin(time*2.2+k)*10;ctx.globalAlpha=.75;glow(x,y,26,'#9fe0ff');ctx.globalAlpha=1;glow(x,y,8,'#ffffff')}}}
  for(const p of V.br){const s=W2S(p.x,p.y);ctx.globalAlpha=.7;glow(s.x,s.y-60,20,'#ff7a2a')}
  if(V.so&&!b4Pillars()&&P._s&&!P.dead){const a=time*1.6,s=P._s,x=s.x+Math.cos(a)*40,y=s.y-60+Math.sin(time*2.4)*8;ctx.globalAlpha=.7;glow(x,y,22,'#9fe0ff');ctx.globalAlpha=1;glow(x,y,7,'#ffffff')}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
{const _l=drawV5Labels;drawV5Labels=function(){_l.apply(this,arguments);b4Try(b4Labels)}}
function b4Labels(){const V=b4View();if(!V)return;const boss=enemies.find(e=>e.b4&&TYPES[e.k].boss&&!e.clone&&!e.dead&&e._s);ctx.textAlign='center';
  const bar=(s,t1,t2,k,col)=>{const top=s.y-210,w=120;ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(s.x-w/2-1,top-1,w+2,8);ctx.fillStyle=col;ctx.fillRect(s.x-w/2,top,w*clamp(k,0,1),6);
    ctx.font=`700 14px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(t1,s.x,top-8);ctx.fillStyle='#e8dcff';ctx.fillText(t1,s.x,top-8);if(t2){ctx.font=`600 12px ${FONT}`;ctx.strokeText(t2,s.x,top+20);ctx.fillStyle='#e8dcc0';ctx.fillText(t2,s.x,top+20)}};
  if(boss&&V.c>0)bar(boss._s,`「이름 부르기」${V.cn===1?' 첫째':V.cn===2?' 둘째':''}`,`불붙은 기둥 ${V.l.filter(v=>v>=1).length}/3`,1-V.c/(V.cm||10),'#b48aff');
  if(boss&&V.ch){const n=enemies.filter(e=>e.k==='b4_singer'&&!e.dead).length;bar(boss._s,'성가대의 노래',`노래하는 성가대 ${n}`,1-V.ch[0]/(V.ch[1]||9),'#fff0c0');
    ctx.font=`700 12px ${FONT}`;for(const e of enemies){if(e.k!=='b4_singer'||e.dead||!e._s)continue;const s=e._s;ctx.strokeText('노래하는 중',s.x,s.y-70);ctx.fillStyle='#fff0c0';ctx.fillText('노래하는 중',s.x,s.y-70)}}
  ctx.font=`700 12px ${FONT}`;for(const p of V.br){const s=p===P?P._s:W2S(p.x,p.y);if(!s)continue;ctx.strokeText('재의 낙인',s.x,s.y-96);ctx.fillStyle='#ffb07a';ctx.fillText('재의 낙인',s.x,s.y-96)}}
// 대상 칸: 맡을 역할 한 줄
{const _uh=updateHud;updateHud=function(){_uh.apply(this,arguments);b4Try(()=>{if(!DG||!DG.b4)return;const box=document.getElementById('target');if(!box||box.hidden)return;const ts=document.getElementById('tsub'),tn=document.getElementById('tname');if(!ts||!tn)return;
  const b=B4_BY[DG.b4.id];if(b&&tn.textContent.includes(TYPES[b.k].n.split(' · ')[0])&&!ts.textContent.includes('메아리:'))ts.textContent+=` · 메아리: ${b.role}${DG.b4.tier?` · 어둠 ${DG.b4.tier}단계`:''}`})}}
/* ===== 도감 ===== */
{const _g=cxGroups;cxGroups=function(){const G0=_g(),set=new Set(B4_KEYS);for(const g of G0)g[1]=g[1].filter(k=>!set.has(k));const out=G0.filter(g=>g[1].length);
  const o2=out.length&&out[out.length-1][0]==='그 밖의 몬스터'?out.pop():null;out.push(['군주의 메아리 · 메아리의 거울',B4_KEYS.filter(k=>TYPES[k])]);if(o2)out.push(o2);return out}}
{const _mi=monInfo;monInfo=function(k){const m=_mi(k);if(!B4_KEYS.includes(k))return m;const b=B4_ALL.find(x=>x.k===k||(k==='b4_morgath2'&&x.id==='morgath')||(k==='b4_singer'&&x.id==='choir'));m.where=[`메아리의 거울 (불 꺼진 왕도) · ${b?b.n:''}`];m.lv=MAXLV;return m}}
setTimeout(()=>{try{Object.assign(B4,{B4_TYPES,B4_KEYS,B4_LIST,B4_HID,B4_ALL,B4_BY,B4_IDS,B4_PIL,B4_HOLD,b4Week,b4Feat,b4Clean,b4St,b4Tier,b4Grid,b4Enter,b4NetEnter,b4Mob,b4Spawn,b4N,b4Tick,b4Reward,b4Unlock,b4Pack,b4View,b4Lit,b4PlaceMirror,MAXLV,hpMax:()=>maxHp(),send:(k,o)=>v20Send(k,o)});if(window.__game)window.__game.B4=B4}catch(_){}},0);
