/* ---------- [v48] 마을 사람 서 있는 그림 (주인이 만든 그림, 2026-10-26) ----------
   - 그림: art48/npc 의 「NNN_<사람 id>_stand」 88장 모두(83명 + 아래 윌로벤 5명). 계획은 144명이고 아직 그리지 않은 사람은 예전 모습 그대로.
   - 묶음은 마을마다 하나: img/flare-npc48-bren(브렌힐 · 방 안 포함) · npc48-haven(헤이븐 교차로 · 나루 · 여관 · 창고) · npc48-arden(왕도 아르덴 · 전당 안)
     · npc48-gm(골드미어) · npc48-el(엘드홀트) · npc48-sh(사하르 오아시스). 그 마을 가까이 가거나(방 안 포함) 그 사람이 화면에 보일 때만 받는다(휴대폰은 필요한 것만).
   - 그림 하나로 서 있기 · 숨쉬기(아주 살짝) · 걷기(미끄러지듯 이동, 걷는 그림 없음)를 모두 그린다. 그림은 왼쪽 아래를 보고 있어서
     좌우를 뒤집어 굽는다: 예전처럼 face 1(오른쪽)이면 오른쪽, face -1이면 왼쪽(그림 그대로)을 본다. 말 걸 때 나를 보는 것도 예전 그대로.
   - 크기: 그림의 어른 키(154)를 예전 Flare 마을 사람 키 60에 맞춘 한 배율. 아이는 그림부터 작게 그려져 약 44(예전 아이와 같음). 발밑 자리 그대로.
   - 그림만 바뀐다: 자리 · 누르는 범위 · 이름표 · ! ? 표시 · 상점 이름 색 · 대사 · 저장 그대로.
   - 묶음이 없거나(받기 전 · #qa) 「그림: 예전 그림」이면 예전 그림 그대로(Flare 마을 사람 → 코드 그림).
   - 예전 윌로벤 사람 5명(꼬마 핍 kid2 · 꼬마 솔 kid3 · 무기상 도린 weaponer · 가죽장이 레아 tanner · 잡화상 몰리 grocer2)은 v26에 윌로벤이 없어진 뒤
     어디에도 서 있지 않았다(TWFOLK에만 남음). 주인 2026-10-26 「이유가 있다면 다른 마을로 보내도 돼」 → 다른 윌로벤 사람들(오드릭 · 넬라 · 욘 …)이 옮겨 간
     헤이븐 나루(헤이븐 교차로 남쪽 강가)에 세운다. 이름 · 역할 · 대사 그대로. 셋은 예전처럼 말을 걸면 가게가 열리는데, 윌로벤 가게가 없어졌으므로
     헤이븐의 같은 가게(무기 · 갑옷 · 잡화, 물건 · 값 같음)가 열린다(새 물건 · 새 저장 값 없음). 아이 둘은 강가를 조금 걷는다.
   - 만드는 법: npc48-pack.py (알파 테두리만 잘라 마을별 한 장으로) */
const N48={pk:{
  bren:'toby marta garret lina bruno farmer shepherd miller smith armorer grocer oldman kid1 hanna millwife yoan nun appr aff_durin',
  haven:'odric jon nella ella fisher sailor bram magda bard elsa kasim guard1 guard2 trader traveler kid4 weaponer2 armorer2 grocer3 cook toma bard2 patron clerk aff_kadel aff_rok aff_hargan aff_odo aff_sira aff_riel nera weaponer tanner grocer2 kid2 kid3',
  arden:'guardA guardB guardC noble scholar priestess kid5 weaponer3 armorer3 grocer4 mira oswin student baker elian j2_priest j2_warrior j2_archer aff_idel',
  gm:'gm_berta gm_corwin gm_pell gm_nim o_local_plains',el:'el_orein el_muna el_taren el_pio o_local_forest',sh:'sh_zarin sh_mehra sh_ilan sh_dalia'},
  town:{bren:'brenhill',haven:'haven',arden:'arden',gm:'goldmere',el:'elderhold',sh:'sahar'},
  id:{},H:60,n:0};
for(const p in N48.pk)for(const id of N48.pk[p].split(' '))N48.id[id]='npc48-'+p;
// 사람 하나의 그림 (SC에 한 번 굽기). 이 사람이 아니면 undefined(→ 예전 그림), 굽기 차례가 밀리면 null(그 프레임만 비움: 예전 그림과 번갈아 깜빡이지 않게)
function n48Sprite(L,f){const id=L.key,pn=id&&N48.id[id];if(!pn)return undefined;const PK=flPack(pn);if(!PK){flNeed(pn);return undefined}
  const r=PK.meta.n48&&PK.meta.n48[id];if(!r)return undefined;const k=N48.H/(PK.meta.ref||154),b=f===3?1.012:1;N48.n++;
  return SC.get('n48/'+id+(b>1?'/b':''),r[2]*k,r[3]*k*b,(r[2]-r[4])*k,r[5]*k*b,(g,w,h)=>{g.translate(w,0);g.scale(-1,1);g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,w,h)},{scale:Math.max(1.25,DPR)})}
{const _fs=twFolkSprite;twFolkSprite=function(L,f){if(flWant()&&L){const e=n48Sprite(L,f);if(e!==undefined)return e}return _fs.apply(this,arguments)}}
// 미리 받기: 지금 지역의 그 마을 가까이(안전 지대 + 900) 있거나 그 마을 방 안이면 그 마을 묶음
function n48Want(){const out=[];if(DG||!REG||!P||typeof P.x!=='number')return out;
  for(const p in N48.town){const t=v20Town(N48.town[p]);if(!t||(t.reg||'home')!==REG.id)continue;if(IN?IN.town===t:Math.hypot(P.x-t.x,P.y-t.y)<(t.safe||500)+900)out.push('npc48-'+p)}return out}
function n48Pre(){try{if(!flWant()||location.hash==='#qa')return;for(const pn of n48Want())flNeed(pn)}catch(_){}}
{const _lr=loadRegion;loadRegion=function(){const r=_lr.apply(this,arguments);setTimeout(n48Pre,0);return r}}
setInterval(n48Pre,1000);
// 윌로벤 다섯: 헤이븐 마을 중심 기준 자리(게임 단위, 이미 넓힌 마을 기준) · 아이는 걷는 길(같은 기준). 걸을 수 있는 빈자리를 찾고(v20FindSpot: 건물 · 문 · 소품 · 사람 · 물 피함)
// 누르는 상자가 다른 것과 겹치거나 건물에 가리면 옮긴다(tw22Settle). 마을 decor 맨 뒤에 붙여 다른 것의 순서는 그대로
const N48W=[['weaponer',-440,590],['tanner',330,590],['grocer2',-80,545],['kid2',30,580,[[-30,585],[70,575],[110,545]]],['kid3',-20,540,[[-60,545],[40,545],[0,575]]]];
function n48Willowen(){const t=v20Town('haven'),L=HOME;if(!t||!L)return 0;const Pt=wxTownParts(L,t);let n=0;
  for(const [id,dx,dy,w] of N48W){if(!TWFOLK[id]||L.decor.some(d=>d.k==='tfolk'&&d.id===id))continue;
    const p=v20FindSpot(L,t,t.x+dx,t.y+dy,240,{maxD:(t.safe||900)-60});if(!p)continue;
    const d=twFolkObj(id,t,p.x,p.y);if(!d)continue;d.path=null;L.decor.push(d);tw22Settle(L,t,d);
    // 걷는 길은 자리가 정해진 뒤 그 자리 기준으로 (물 · 건물 곁은 뺀다)
    if(w){const ox=d.hx-t.x-dx,oy=d.hy-t.y-dy,pt=w.map(q=>({x:t.x+q[0]+ox,y:t.y+q[1]+oy})).filter(q=>wxSpotOk(Pt,q.x,q.y,null,[],{bld:24}));if(pt.length>=2){d.path=pt;d.wi=0}}
    n++}
  if(n){tw22Safe(L,t);v20SyncDecor()}return n}
n48Willowen();
window.__npc48={N48,N48W,n48Sprite,n48Want,css:(x,y)=>{const s=W2S(x,y);return{x:s.x*CZ,y:s.y*CZ}},get IN(){return IN}};// 확인용 (화면 촬영)
