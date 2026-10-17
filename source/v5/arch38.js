/* ---------- v38: 궁수 2차 재정비 — 「원소 궁술」 탭(화염 · 냉기 · 폭풍 갈래) + 1차와 겹치던 기술을 1차의 발전형으로 (arch34.js 뒤, qa.js 앞) ----------
   사용자 요청(2026-10-17): 「지금 2차에서는 원소 관련된 스킬들이 싹다 빠져있는데 원소쪽을 1차보다 발전된 형태가 될 수 있도록 넣어야돼.
     현재 2차에서도 1차와 컨셉 겹치는 스킬들이 너무 많아. 1차가 구분되면서 발전하는 형태였으면 좋겠어(예: 멀티샷이 적중하면 화살이 다시 두 개로 쪼개짐).
     원소는 3원소를 한줄로 쭉 몰지 말고 원소의 취향에 따라 선택 가능하도록 각각의 갈래로.」
   · 「원소 궁술」(tab:'el38'): 호크아이 · 레인저 어느 쪽이든 2차 전직 뒤에 열리는 공용 탭. 화염 · 냉기 · 폭풍 세 갈래(계열 TREE 'j_el_fire' · 'j_el_ice' · 'j_el_storm'),
     갈래마다 4개(53 · 61 · 75 · 86레벨 = 위계 11 · 13 · 16 · 18). 갈래의 각 기술은 1차 원소 사격의 같은 원소 기술 1점 이상이 선행(발전형).
     점수는 다른 2차 기술과 같은 규칙(위계 요구 레벨 + 찍은 점수). 갈래를 섞어 찍을 수 있지만 2차 점수가 모자라 보통 한두 갈래를 고른다.
     갈래 바꾸기(호크아이 ↔ 레인저)로 이 탭의 점수는 사라지지 않는다(job2 갈래 기술이 아님).
   · 바뀐 기술(id 그대로): 트리플 샷 → 스플리팅 샷(멀티플 샷 발전: 맞으면 둘로 갈라짐) · 마크 오브 데스(표식이 죽으면 옮겨 붙으며 터짐) ·
     애로우 볼텍스 → 바운싱 스톰(리코셰 발전: 구역 안을 계속 튕김) · 블래스트 트랩 → 클러스터 트랩(샤프넬 트랩 발전: 작은 덫 셋을 흩뿌림) ·
     넷 샷 → 링크 넷(스네어 트랩 발전: 셋을 한 그물로 묶어 피해 나눔) · 헌팅 도미니언 → 킬 존(트랩 필드 발전: 구역 안 덫이 다시 장전) ·
     와일드 센스(패시브: 회피 → 덫에 걸린 적에게 화살 피해). 스나이프(멀수록 셈 · 반드시 치명타 · 쓰러뜨리면 재사용 풀림) · 쏜 트랩(가시밭이 넓어지고 오래 있으면 묶임)은 다듬기만.
     애로우 펜스의 불 · 얼음 · 번개 차례는 arch34.js에서 뺐다(물리 · 느리게).
   · 저장: 모양이 바뀐 여덟 기술(트리플 샷 · 마크 오브 데스 · 애로우 볼텍스 · 애로우 펜스 · 블래스트 트랩 · 넷 샷 · 헌팅 도미니언 · 와일드 센스)에 찍은 점수는
     이 판을 처음 불러올 때 한 번 스킬 포인트로 돌려준다(rs27 · rs34와 같은 방식, 저장 필드 rs38 = {v:1, old:{원래 점수}}). 캐릭터 키는 지우거나 비우지 않는다.
   · 같이 하기: 다른 사람의 이 기술들은 내 화면에 그림만(피해 0). 몬스터를 밀고 당기고 얼리는 일은 방장(혼자면 나)만.
   · 피해는 더하는 식: 기술 위력 = 물리 위력 × 배율 × 강화 × physScale(레벨 · 같은 갈래 시너지 · % 피해) 한 번. 새 덧셈 칸(와일드 센스)은 강화 칸 상한 안에서만. */
const A38={
  EL:{fire:['ignitearrow','firetrail','phoenixarrow','solararrow'],ice:['shatterarrow','glacialorb','crystalprison','avalanche'],storm:['stormarrow','tailwind','lightningrod','hurricaneshot']},
  FROM:{ignitearrow:'flamearrow',firetrail:'firerain',phoenixarrow:'burstarrow',solararrow:'volcanoshot',shatterarrow:'icearrow',glacialorb:'blizzardshot',crystalprison:'glacialarrow',avalanche:'glacialspike',
    stormarrow:'shockarrow',tailwind:'galearrow',lightningrod:'cyclonearrow',hurricaneshot:'thunderarrow'},
  ELN:{fire:'화염',ice:'냉기',storm:'폭풍'},
  refund:['tripleshot','deathmark','arrowvortex','elemrain','blasttrap','netshot','dominion','wildsense'],
  ROWS:[11,13,16,18],trail:[],phx:[],sun:[],orb:[],cp:[],aval:[],rod:[],hur:[],bnc:[],kz:[],lnk:[],gust:[],seg:[],twN:0};
A38.ids=[].concat(A38.EL.fire,A38.EL.ice,A38.EL.storm);
const big38=e=>{const t=TYPES[e.k]||{};return !!(t.boss||t.mini)};
// 얼리기: 방장(혼자면 나)만 직접, 손님은 applyFx로 방장에게 보냄. 보스 · 준보스는 짧게
function frz38(e,t,bt){if(!e||e.dead)return;const v=big38(e)?Math.min(t,bt):t;if(NET.guest){applyFx(e,{freeze:v},e);return}e.freezeT=Math.max(e.freezeT||0,v)}

/* ===== 1) 원소 궁술 12개 ===== */
{const D=(rank,id,n,kn,en,el,kind,cost,cd,o,desc)=>{def('archer',rank,id,n,en,el,kind,cost,cd,Object.assign({phys:1,wt:'bow'},o),desc);SPELLS[id].kn=kn};
  // 화염
  D(11,'ignitearrow','이그나이트 애로우','불씨 쌓는 화살','Ignite Arrow','fire','bolt',10,1.2,{mult:2.2,spd:820,r:7,burn:1,ign38:{max:5,dur:6,mult:4,rad:130},chant:''},
    '맞힐 때마다 그 적에게 불씨가 한 겹씩 쌓입니다(6초 안에 다시 맞혀야 이어짐). 다섯 겹이 되면 그 적이 터져 둘레(반경 130)를 함께 태웁니다. 플레임 애로우의 발전형.');
  D(13,'firetrail','파이어 트레일','불길 남기는 화살','Fire Trail','fire','bolt',24,6,{mult:2,spd:900,r:7,pierce:1,burn:1,tr38:{dur:4,w:34,iv:.5,k:.22},chant:'불길을 따라가라'},
    '일직선의 적을 꿰뚫는 불화살. 화살이 지나간 길이 4초 동안 불타는 줄이 되어, 그 위의 적을 0.5초마다 태웁니다. 블레이즈 필드의 발전형(둥근 장판이 아니라 긴 줄).');
  D(16,'phoenixarrow','피닉스 애로우','불새 화살','Phoenix Arrow','fire','bolt',34,7,{mult:3.4,spd:760,r:9,burn:1,phx38:{n:3,rad:110,k:.6,reach:360,delay:.35},chant:'날아올라라, 불새여!'},
    '잠깐 겨눴다가(시전 0.6초) 쏘는 불새 화살. 맞으면 터져 둘레(반경 110)를 태우고, 불새가 되어 다시 솟아 가까운 다른 적에게 내리꽂히며 또 터집니다(세 번). 익스플로시브 애로우의 발전형.');
  D(18,'solararrow','솔라 애로우','작은 해','Solar Arrow','fire','sun38',100,60,{mult:16,sun38:{dur:6,iv:.5,rad:200,k0:.07,kd:.008,fin:.8,frad:260,reach:600},chant:'떠올라라, 작은 해여!'},
    '하늘로 쏜 화살이(시전 1.2초) 겨눈 곳 위에 작은 해가 되어 6초 동안 떠 있습니다. 0.5초마다 둘레(반경 200)에 불길을 뿜고 그 불길은 점점 세지며, 마지막에 크게 터집니다(반경 260). 볼케이노 샷의 발전형. 재사용 60초.');
  // 냉기
  D(11,'shatterarrow','셔터 애로우','얼음 깨는 화살','Shatter Arrow','ice','bolt',10,1.2,{mult:2,spd:820,r:7,slow:1,sh38:{need:3,frz:1.2,bossFrz:.5,k:2,rad:130,kk:.8,frz2:.8},chant:''},
    '맞은 적을 느리게 하고, 세 번 맞히면 1.2초 얼립니다. 언 적을 맞히면 피해가 두 배이고, 그 적의 얼음이 깨지며 조각이 튀어 둘레(반경 130)의 적을 다시 얼립니다(얼음이 옮겨 감). 프로스트 애로우의 발전형.');
  D(13,'glacialorb','글레이셜 오브','서리 구슬','Glacial Orb','ice','orb38',28,7,{mult:1.8,orb38:{spd:230,life:2.3/* 굴러간 거리 + 조각 거리가 궁수 사거리(810) 안 */,r:14,iv:.22,k:.5,end:8},chant:'굴러라, 서리여'},
    '천천히 굴러가는 얼음 구슬 화살. 지나가며 닿는 적을 모두 치고, 사방으로 얼음 조각을 뿌려 맞은 적을 느리게 합니다. 끝에서 조각 여덟을 한꺼번에 터뜨립니다. 블리자드 샷의 발전형.');
  D(16,'crystalprison','크리스탈 프리즌','수정 감옥','Crystal Prison','ice','bolt',32,12,{mult:2.6,spd:900,r:8,cp38:{dur:3,boss:1,store:.5,mult:2.2,rad:150},chant:'갇혀라'},
    '잠깐 겨눴다가(시전 0.6초) 한 적을 3초 동안 수정에 가둡니다(보스 · 준보스는 1초). 갇힌 동안 내가 준 피해의 절반을 모아 두었다가, 수정이 깨질 때 둘레(반경 150)에 함께 터뜨립니다. 프리징 애로우의 발전형.');
  D(18,'avalanche','아발란체 샷','얼음 가시 물결','Avalanche Shot','ice','aval38',100,60,{mult:16,aval38:{len:720,n:10,step:.07,rad:85,k1:.45,k2:.75,hold:1.4,frz:2,bossFrz:1},chant:'무너져 내려라!'},
    '땅에 쏜 화살에서(시전 1초) 겨눈 쪽으로 얼음 가시가 차례로 솟아 긴 줄(720)을 이룹니다. 닿은 적은 2초 얼고(보스 1초), 잠시 뒤 가시가 한꺼번에 부서지며 다시 칩니다. 글레이셜 스파이크의 발전형(한 점이 아니라 긴 줄). 재사용 60초.');
  // 폭풍(바람 + 번개)
  D(11,'stormarrow','스톰 애로우','번개 꿰는 화살','Storm Arrow','storm','bolt',10,1.2,{mult:1.8,spd:1000,r:7,pierce:1,arc:1,knock:30,chant:''},
    '일직선의 적을 모두 꿰뚫는 바람 화살. 꿰뚫은 적마다 번개가 옆의 적 하나에게 튀고(절반 피해), 맞은 적은 살짝 밀려납니다. 윈드 애로우의 발전형.');
  D(13,'tailwind','테일윈드','뒷바람','Tailwind','storm','buff',20,30,{dur:30,ias:.15,spd:.15,tw38:{every:5,mult:1.2,range:260,ang:1.2,push:90},chant:'바람을 등에 업고'},
    '자기 강화. 30초 동안 공격 속도와 이동 속도가 15% 오르고, 화살 기술을 다섯 번 쏠 때마다 앞쪽으로 돌풍이 일어 적을 치고 밀어냅니다(보스 · 준보스는 안 밀림). 지속은 스킬 레벨마다 +30초(최대 300초). 게일 애로우의 발전형.');
  D(16,'lightningrod','라이트닝 로드','피뢰침 화살','Lightning Rod','storm','rod38',40,16,{mult:1.6,rod38:{dur:8,iv:.8,reach:280,jumps:2,place:520},chant:'벼락을 불러라'},
    '겨눈 곳(최대 520)에 피뢰침 화살을 꽂습니다. 8초 동안 0.8초마다 둘레(280)의 가장 가까운 적에게 벼락이 떨어지고, 벼락은 옆의 적 둘에게 이어 튑니다. 사이클론 애로우의 발전형(설치형).');
  D(18,'hurricaneshot','허리케인 샷','폭풍 회오리','Hurricane Shot','storm','hur38',100,60,{mult:16,hur38:{spd:150,life:5.5,rad:130,tick:.3,k:.1,bolt:.5,kb:.35,pull:150,fin:.6},chant:'휘몰아쳐라!'},
    '큰 회오리를 실은 화살을(시전 1초) 겨눈 쪽으로 천천히 보냅니다. 5.5초 동안 길 위의 적을 가운데로 빨아들이며 베고(보스 · 준보스는 안 끌림), 회오리 안에 0.5초마다 벼락이 칩니다. 끝나면 흩어지며 한 번 더 칩니다. 썬더스톰 애로우의 발전형. 재사용 60초.')}
Object.assign(CAST_T,{phoenixarrow:.6,crystalprison:.6,solararrow:1.2,avalanche:1,hurricaneshot:1});
// 후딜레이(recov.js): 위계가 9보다 높아 규칙대로면 0.6초가 되므로 직접 정한다 — 마구 쓰는 첫 기술은 짧게, 마무리기는 0.4초
/* v32 규칙: 시전 시간이 있는 궁수 공격 기술은 위력 +10% — 새 기술도 같게 */
for(const id of A38.ids)if(CAST_T[id]>0&&!CHAN[id]&&SPELLS[id].mult>0&&!AR32_CAST.ids.includes(id)){SPELLS[id].mult*=AR32_CAST.up;AR32_CAST.ids.push(id)}
/* 바운싱 스톰은 장판이 아니므로 「레벨마다 0.5초 길어지는 장판」 목록(feedback28)에서 뺀다 */
{const i=FB28_TICKS.indexOf('arrowvortex');if(i>=0)FB28_TICKS.splice(i,1)}
Object.assign(REC_T,{ignitearrow:.1,shatterarrow:.1,stormarrow:.1,firetrail:.2,glacialorb:.2,tailwind:.2,lightningrod:.2,crystalprison:.2,phoenixarrow:.25,solararrow:.4,avalanche:.4,hurricaneshot:.4});
for(const el in A38.EL)A38.EL[el].forEach(id=>{const s=SPELLS[id];s.tab='el38';s.j38=el;s.upLv=RANK_LV_J2[s.rank-10];TREE[id]='j_el_'+el;/* 1차 원소 기술 선행은 PRE(같은 나무끼리만)가 아니라 canLearn에서 따로 본다 */
  TREEPOS[id]={row:s.rank-1,col:['fire','ice','storm'].indexOf(el)}});
['sun38','orb38','rod38','hur38','aval38','bounce38','kz38'].forEach(k=>AIMED.add(k));
// 원소 궁술의 「위계」 이름: 1차는 9위계까지라 10 이상은 이 탭에서만 쓴다(2차 갈래는 job2q가 이 글을 갈래 이름으로 바꿔 넣는다)
{const C=CLASSES.archer,_rn=C.rankN;C.rankN=r=>r>=10&&r<20?(A38.ROWS.includes(r)?`원소 궁술 ${A38.ROWS.indexOf(r)+1}단`:`${r-9}단`):_rn(r)}

/* ===== 2) 호크아이 · 레인저: 1차와 겹치던 기술을 발전형으로 ===== */
delete SPELLS.elemrain.tri;/* 애로우 펜스(arch34)는 이제 원소 없이 가시 화살만 — 세 원소 차례 표시를 지운다 */
{const S=SPELLS;
  {const s=S.tripleshot;delete s.hits;delete s.hitIv;Object.assign(s,{cnt:3,spread:.14,mult:.9,n:'스플리팅 샷',kn:'갈라지는 화살',en:'Splitting Shot',split38:{k:.6,ang:.45,spd:760,life:.45},
    desc:'화살 세 대를 부채꼴로 쏩니다. 적에게 맞은 화살은 그 자리에서 둘로 갈라져 뒤쪽으로 비스듬히 날아가며 지나는 적을 꿰뚫습니다(갈라진 화살은 60% 위력). 멀티플 샷의 발전형. 호크아이의 기본기.'})}
  {const s=S.snipe;Object.assign(s,{mult:6*AR32_CAST.up/* 반드시 치명타(×1.75)라 9→6, 시전 기술 +10%(v32)를 다시 곱함 */,critB:0,crit38:1,killReset:1,far38:{from:150,to:550,max:.5},
    desc:'숨을 멈추고(시전 1초) 한 적에게 큰 한 발. 반드시 치명타이고, 멀리 있는 적일수록 세집니다(150부터 550 거리까지 최대 +50%). 이 기술로 적을 쓰러뜨리면 재사용 대기가 바로 풀립니다. 차지 샷의 발전형.'})}
  {const s=S.deathmark;Object.assign(s,{dm38:{n:3,reach:300,mult:1.6,rad:120},
    desc:'12초 동안 그 적은 모든 파티원에게서 받는 피해가 15% 늘어납니다(표식은 가장 센 것 하나만). 표식이 붙은 적이 쓰러지면 표식이 터지며(반경 120) 가장 가까운 다른 적(300 안)에게 옮겨 붙습니다(세 번까지). 트래커 마크의 발전형.'})}
  {const s=S.arrowvortex;for(const k of ['rad','dur','pull'])delete s[k];Object.assign(s,{kind:'bounce38',mult:.75,n:'바운싱 스톰',kn:'튕겨 다니는 화살',en:'Bouncing Storm',b38:{dur:4,iv:.25,zone:260,grow:.06,max:.8,reach:600},
    desc:'겨눈 곳(최대 600)에 4초 동안 반경 260의 구역을 정하고, 화살 하나가 그 안의 적 사이를 0.25초마다 튕겨 다닙니다. 튕길 때마다 조금씩 세집니다(한 번에 +6%, 최대 +80%). 같은 적을 연달아 맞히지 않습니다. 리코셰의 발전형.'})}
  {const s=S.blasttrap;Object.assign(s,{n:'클러스터 트랩',kn:'흩어지는 덫',en:'Cluster Trap',cl38:{n:3,ring:90,k:.45,arm:.35,life:6,rad:80},
    desc:'빨리 켜지는 폭발 덫. 터지면서 작은 덫 셋을 둘레에 흩뿌리고, 작은 덫은 0.35초 뒤 켜져 밟히면 다시 터집니다(45% 위력, 6초). 동시에 셋. 샤프넬 트랩의 발전형. 레인저의 기본기.'})}
  {const s=S.thorntrap;Object.assign(s,{grow38:{to:1.85,hold:2,root:1,bossRoot:.4},
    desc:'밟으면 독 가시밭이 펼쳐져 6초 동안 적을 느리게 하고 계속 찌릅니다. 가시밭은 점점 넓어지고(반경 140 → 약 260), 그 안에 2초 넘게 머문 적은 가시에 1초 묶입니다(보스 · 준보스 0.4초). 칼트롭의 발전형.'})}
  {const s=S.netshot;Object.assign(s,{pierce:1,root:1.5,bossRoot:.6,n:'링크 넷',kn:'한 그물 묶기',en:'Link Net',link38:{n:3,share:.3,dur:6},
    desc:'그물 화살이 일직선의 적 셋까지 꿰어 한 그물로 묶습니다(1.5초 묶임, 보스 0.6초). 6초 동안 묶인 적 하나가 내 공격에 맞으면 그 피해의 30%를 그물에 묶인 다른 적도 받고, 서로 멀어지지 못하고 끌려옵니다. 스네어 트랩의 발전형.'})}
  {const s=S.dominion;for(const k of ['ring','cnt'])delete s[k];Object.assign(s,{kind:'kz38',mult:2.2,n:'킬 존',kn:'다시 서는 덫 구역',en:'Kill Zone',kz38:{dur:8,rad:260,n:4,ring:150,amp:.15,place:500},
    desc:'겨눈 곳(최대 500)에 8초 동안 반경 260의 사냥 구역을 정하고 덫 넷을 깝니다. 구역 안에서 터진 내 덫은 1초 뒤 그 자리에 한 번 다시 장전되고, 구역 안의 적은 내 덫에 15% 더 아프게 맞습니다. 트랩 필드의 발전형.'})}
  {const s=S.wildsense;s.pv={trapShot:[.1,.01]};delete s.eva;s.desc='패시브: 덫에 걸린 적(덫에 맞은 지 3초 안이거나 묶여 있는 적)에게 주는 내 화살 · 사격 피해가 오릅니다(1레벨 10%, 레벨마다 +1%, 강화 피해 상한 안에서).'}
  for(const id of ['tripleshot','arrowvortex','blasttrap','netshot','dominion'])if(NAMES_J2[id])NAMES_J2[id]=[S[id].n,NAMES_J2[id][1]||''];
  // 세 하늘의 장궁(원소 핵심 유니크): 원소 사격 + 원소 궁술 세 갈래가 대상 (애로우 펜스는 이제 원소가 아님)
  try{const c=CORE21_BY.c_threesky;c.tag=Object.assign({},c.tag,{trees:[1,'j_el_fire','j_el_ice','j_el_storm'],ids:[]})}catch(_){}}
try{PVN.trapShot='덫에 걸린 적에게 화살 피해'}catch(_){}
setTimeout(()=>{try{if(typeof KINDN==='object')Object.assign(KINDN,{sun38:'하늘의 해',orb38:'굴러가는 구슬',rod38:'설치',hur38:'회오리',aval38:'얼음 가시 줄',bounce38:'튕기는 화살',kz38:'덫 구역'});
  if(typeof TIP24==='object'&&TIP24.PCT)TIP24.PCT.trapShot='덫에 걸린 적에게 화살 피해'}catch(_){}},0);

/* ===== 3) 원소 궁술 탭: 2차 전직 뒤에만 찍고 쓴다 ===== */
const a38PreOk=id=>{const f=A38.FROM[id];return !f||P.sk[f]>0};
{const _cl=canLearn;canLearn=function(id){return _cl(id)&&a38PreOk(id)}}
{const _au=advUnlocked;advUnlocked=function(id){const s=SPELLS[id];if(s&&s.tab==='el38')return !!(P&&P.job2&&P.cls==='archer')&&P.lvl>=s.upLv;return _au(id)}}
{const _of=TIER22.of;TIER22.of=function(id){const s=SPELLS[id];return s&&s.tab==='el38'?2:_of.call(this,id)}}
{const _ln=TIER22.line;TIER22.line=function(id){const s=SPELLS[id];if(!s||s.tab!=='el38')return _ln.call(this,id);
  return `<div class="t22l t22l2">${this.mark(2,'t22i')}<b>${this.LBL[2]}</b> <span class="muted">· 원소 궁술 · ${A38.ELN[s.j38]} 갈래</span></div>`}}
{const _tb=j2TabsHtml;j2TabsHtml=function(){let h=_tb();if(P.cls!=='archer')return h;let pt=0;for(const k in P.sk)if(SPELLS[k]&&SPELLS[k].tab==='el38')pt+=P.sk[k];
  return h+`<button type="button" data-j2tab="el38" class="j2t j2b${P.job2?'':' lk'}" aria-selected="${J2UI.tab==='el38'}">원소 궁술 <span class="muted">${P.job2?pt:'잠김'}</span></button>`}}
function a38TabHtml(){const cols=['fire','ice','storm'],rows=A38.ROWS,CW=96,RH=64,LW=70,TOP=34,width=LW+cols.length*CW,height=rows.length*RH+TOP;
  const ids=A38.ids;if(!nodeSel||!ids.includes(nodeSel))nodeSel=ids.find(id=>P.sk[id])||ids[0];
  const pos=id=>{const s=SPELLS[id];return{x:LW+cols.indexOf(s.j38)*CW+CW/2,y:TOP+rows.indexOf(s.rank)*RH+25}};let lines='',nodes='',labels='';
  cols.forEach((el,i)=>labels+=`<div style="position:absolute;top:4px;left:${LW+i*CW}px;width:${CW}px;text-align:center;font-weight:700;color:${EL[el]}">${A38.ELN[el]}</div>`);
  rows.forEach((r,i)=>labels+=`<div class="rl" style="top:${TOP+i*RH}px"><b>${i+1}단</b>레벨 ${RANK_LV_J2[r-10]}</div>`);
  for(const el of cols){const L=A38.EL[el];for(let i=1;i<L.length;i++){const a=pos(L[i-1]),b=pos(L[i]),on=P.sk[L[i-1]]>0;lines+=`<path d="M${a.x} ${a.y+25}V${b.y-25}" fill="none" stroke="${on?'#c9a24a':'#5a4a36'}" stroke-width="2"/>`}}
  for(const id of ids){const s=SPELLS[id],p=pos(id),L=skLv(id),c=L?(P.lvl<reqLvOf(id)||!advUnlocked(id)?'has lockup':'has'):canLearn(id)?'can':!advUnlocked(id)||P.lvl<reqLvOf(id)||!a38PreOk(id)?'locked':'';
    nodes+=`<button class="node ${c}" type="button" data-node="${id}" aria-pressed="${nodeSel===id}" title="${s.n}" style="left:${p.x-25}px;top:${p.y-25}px">${j2PT(id)}${j2CM(id,'cmk cmn')}${spellSvg(s)}${L?`<span class="nl">${L}</span>`:''}</button>`}
  const note=P.job2?'화염 · 냉기 · 폭풍 세 갈래가 따로 있습니다. 마음에 드는 원소를 골라 찍으세요. 갈래의 기술은 1차 「원소 사격」의 같은 원소 기술에서 이어집니다(그 기술에 1점 이상).':
    `<span class="lockup">2차 전직(레벨 ${J2LV}, 전직관의 의뢰) 뒤에 열립니다.</span> 호크아이 · 레인저 어느 쪽이든 쓸 수 있습니다.`;
  return `<p class="muted j2note"><b style="color:#ffd76a">원소 궁술</b> · ${note}</p><div class="treescroll"><div class="tree" style="width:${width}px;height:${height}px"><svg class="lines" width="${width}" height="${height}">${lines}</svg>${labels}${nodes}</div></div>`+detailHtml(nodeSel)}
{const _bh=j2BranchHtml;j2BranchHtml=function(){if(J2UI.tab==='el38'&&P.cls==='archer')return a38TabHtml();return _bh()}}
{const _th=treeHtml;treeHtml=function(){if(J2UI.tab==='el38'&&P.cls!=='archer')J2UI.tab=null;
  if(J2UI.tab!=='el38'||P.job2)return _th.apply(this,arguments);
  // 2차 전직 전: 갈래 탭(j2)이 없으니 job2q의 그리기를 거치지 않고 잠긴 탭을 보여 준다
  const C=CLASSES[P.cls];let h=`<div class="pts">남은 스킬 포인트 <b>${P.sp}</b> <span class="muted">· 한 기술에 최대 ${MAXSK}점</span>${typeof CMARK==='object'?CMARK.legend():''}</div><div class="treetabs">`;
  C.trees.forEach((n,t)=>{let pts=0;for(const k in P.sk)if(TREE[k]===t)pts+=P.sk[k];h+=`<button type="button" data-tree="${t}" aria-selected="false">${n} <span class="muted">${pts}</span></button>`});
  return h+j2TabsHtml()+'</div>'+a38TabHtml()}}
{const _dh=detailHtml;detailHtml=function(id){const s=SPELLS[id];if(!s||s.tab!=='el38')return _dh(id);let h=_dh(id);
  const pre=SPELLS[A38.FROM[id]];h=h.split('같은 undefined 계열').join(`같은 ${A38.ELN[s.j38]} 갈래`);
  if(!P.job2)h=h.replace('<div class="acts">',`<div class="req"><span class="lockup">원소 궁술: 2차 전직 뒤에 찍고 쓸 수 있습니다 (레벨 ${s.upLv}부터)</span></div><div class="acts">`);
  else if(pre&&!P.sk[pre.id]&&!h.includes(pre.n))h=h.replace('<div class="acts">',`<div class="req">1차 「${pre.n}」에 1점 이상</div><div class="acts">`);
  return h}}
{const _tc=tryCast;tryCast=function(id,t){const s=SPELLS[id];
  if(s&&s.tab==='el38'&&!GHOST&&!CAST_MOD&&!advUnlocked(id)){if(P.noMpT<=0){msg(`${s.n}: 2차 전직 뒤 레벨 ${s.upLv}부터 쓸 수 있습니다`,'#a39d8f');P.noMpT=1.5}return}
  return _tc(id,t)}}

/* ===== 4) 시전 뒤: 새 종류 놓기 · 뒷바람 세기 ===== */
const a38Pw=(id,L,s,k)=>GHOST?0:physPower()*(s.mult||0)*physBuffMul()*physScale(id,L)*(k||1);
const A38_POST=new Set(['solararrow','glacialorb','avalanche','lightningrod','hurricaneshot','arrowvortex','dominion']);
function a38Pre(id,t){const s0=SPELLS[id];if(!s0||s0.cls!=='archer')return null;
  return {id,s0,t,cd0:P.cd[id]||0,CM:CAST_MOD,G:GHOST,ox:P.x,oy:P.y,nP:projs.length,tg:t||(GHOST?{x:P.x+Math.cos(P.face)*120,y:P.y+Math.sin(P.face)*120}:aimPoint())}}
function a38Post(c){if(!c)return;const id=c.id,G=c.G,did=c.CM?true:(P.cd[id]||0)>c.cd0+1e-9;if(!did)return;
  const s0=c.s0,own=G||P;
  // 뒷바람: 화살 기술 다섯 번마다 돌풍 (같이 하기 손님 시전 · 채널링 한 틱은 세지 않음)
  if(!G&&!c.CM&&P.buffs.tailwind&&P.buffs.tailwind.t>0&&s0.mult>0&&['bolt','beam','chain','rain','strike','bounce38','orb38','sun38','aval38','hur38'].includes(s0.kind)){
    A38.twN++;const tw=SPELLS.tailwind.tw38;if(A38.twN>=tw.every){A38.twN=0;a38Gust(tw)}}
  if(!A38_POST.has(id))return;
  const L=Math.max(1,skLv(id)),s=eff(id,L);if(G)s.ghost=1;const pose=(k,d)=>{if(typeof heroAtk==='function')heroAtk(own,k,d)};
  const kid=o=>Object.assign({},s,{kind:'strike',ghost:G?1:0,a38kid:1},o||{});
  if(s.kind==='sun38'){const S=s.sun38,p=clampRange(c.tg,S.reach);A38.sun.push({x:p.x,y:p.y,t:S.dur,max:S.dur,cd:.25,iv:S.iv,i:0,rad:S.rad,k0:S.k0,kd:S.kd,fin:S.fin,frad:S.frad,G:!!G,dmg:a38Pw(id,L,s),s:kid()});
    rings.push({x:p.x,y:p.y,r:10,max:S.rad,life:.6,col:EL.fire});flash={col:'#ffb070',a:.12};pose('volley',.5)}
  else if(s.kind==='orb38'){const O=s.orb38,a=Math.atan2(c.tg.y-c.oy,c.tg.x-c.ox),ss=Object.assign({},s,{kind:'bolt',ghost:G?1:0});
    const p={x:c.ox+Math.cos(a)*18,y:c.oy+Math.sin(a)*18,z:22,vx:Math.cos(a)*O.spd,vy:Math.sin(a)*O.spd,r:O.r,dmg:a38Pw(id,L,s),owner:'p',s:ss,life:O.life,col:EL.ice,hit:new Set(),orb38:{acc:0,iv:O.iv,k:O.k,end:O.end,a:R()*6.283}};
    if(G)p.ghost=1;projs.push(p);A38.orb.push(p);pose('release',.3)}
  else if(s.kind==='aval38'){const V=s.aval38,a=Math.atan2(c.tg.y-c.oy,c.tg.x-c.ox);A38.aval.push({ox:c.ox,oy:c.oy,ux:Math.cos(a),uy:Math.sin(a),n:V.n,step:V.step,acc:0,i:0,rad:V.rad,len:V.len,k1:V.k1,k2:V.k2,hold:V.hold,frz:V.frz,bossFrz:V.bossFrz,
      dmg:a38Pw(id,L,s),s:kid(),G:!!G,pts:[],hit:new Set(),t:-1,stop:0});shake=Math.max(shake,4);pose('volley',.5)}
  else if(s.kind==='rod38'){const D=s.rod38,p0=clampRange(c.tg,D.place),p=G?p0:landAt(c.ox,c.oy,p0.x,p0.y);for(const q of A38.rod)if(q.own===own)q.t=0;
    A38.rod.push({x:p.x,y:p.y,t:D.dur,max:D.dur,cd:.3,iv:D.iv,reach:D.reach,jumps:D.jumps,dmg:a38Pw(id,L,s),s:kid(),G:!!G,own});
    zap({x:p.x,y:p.y,z:260},{x:p.x,y:p.y,z:30},Object.assign({life:.35},stormStyle(8)));rings.push({x:p.x,y:p.y,r:8,max:D.reach,life:.5,col:EL.storm});pose('release',.3)}
  else if(s.kind==='hur38'){const H=s.hur38,a=Math.atan2(c.tg.y-c.oy,c.tg.x-c.ox);
    A38.hur.push({x:c.ox+Math.cos(a)*40,y:c.oy+Math.sin(a)*40,vx:Math.cos(a)*H.spd,vy:Math.sin(a)*H.spd,t:H.life,max:H.life,rad:H.rad,tick:H.tick,tc:0,k:H.k,bolt:H.bolt,bc:.2,kb:H.kb,pull:H.pull,fin:H.fin,dmg:a38Pw(id,L,s),s:kid(),G:!!G,spin:0});
    flash={col:'#bfeedd',a:.1};pose('volley',.5)}
  else if(s.kind==='bounce38'){const B=s.b38,p=clampRange(c.tg,B.reach);for(const q of A38.bnc)if(q.own===own)q.t=0;
    A38.bnc.push({x:p.x,y:p.y,zone:B.zone,t:B.dur,max:B.dur,cd:0,iv:B.iv,i:0,grow:B.grow,mx:B.max,last:null,ax:c.ox,ay:c.oy,dmg:a38Pw(id,L,s),s:Object.assign({},s,{kind:'bolt',ghost:G?1:0}),G:!!G,own});
    rings.push({x:p.x,y:p.y,r:10,max:B.zone,life:.5,col:'#e8e4d8'});pose('release',.3)}
  else if(s.kind==='kz38'){const K=s.kz38,p0=clampRange(c.tg,K.place),p=G?p0:landAt(c.ox,c.oy,p0.x,p0.y),ownId=G?G.id:0;for(const z of A38.kz)if(z.own===ownId)z.t=0;
    A38.kz.push({x:p.x,y:p.y,rad:K.rad,t:K.dur,max:K.dur,amp:K.amp,own:ownId,G:!!G});
    const ts=Object.assign({},s,{kind:'trap',kz38:0,ghost:G?1:0});for(const q of traps)if(q.id==='dominion'&&q.own===ownId)q.life=0;
    for(let k=0;k<K.n;k++){const an=k/K.n*6.283+.4,q=k?landAt(p.x,p.y,p.x+Math.cos(an)*K.ring,p.y+Math.sin(an)*K.ring):p;traps.push({x:q.x,y:q.y,s:ts,id:'dominion',own:ownId,dmg:a38Pw(id,L,s),arm:s.arm||.6,life:K.dur+2,age:0})}
    traps=traps.filter(q=>q.life>0);rings.push({x:p.x,y:p.y,r:10,max:K.rad,life:.6,col:'#c9a46a'});pose('release',.3)}}
{const _tc=tryCast;tryCast=function(id,t){const c=a38Pre(id,t);if(!c)return _tc(id,t);const r=_tc(id,t);try{a38Post(c)}catch(err){if(window.__QA)throw err}return r}}
{const _cr=_castRelease;_castRelease=function(cu){const c=cu&&a38Pre(cu.id,cu.tg);if(!c)return _cr(cu);_cr(cu);try{a38Post(c)}catch(err){if(window.__QA)throw err}}}
function a38Gust(tw){const L=Math.max(1,skLv('tailwind')),pw=physPower()*tw.mult*physBuffMul()*physScale('tailwind',L),a=P.face,s=A38GUST;
  A38.gust.push({x:P.x,y:P.y,a,r:tw.range,ang:tw.ang,t:.35,max:.35});
  for(const e of enemies){if(e.dead||dist(e,P)>tw.range+hR(e)||angDiff(Math.atan2(e.y-P.y,e.x-P.x),a)>tw.ang/2)continue;hurtE(e,pw*rnd(.9,1.1),s);
    if(!e.dead&&!big38(e)&&!NET.guest){const d=dist(e,P)||1;moveBody(e,(e.x-P.x)/d*tw.push,(e.y-P.y)/d*tw.push)}}}
const A38GUST={id:'tailwind',n:'돌풍',cls:'archer',el:'storm',kind:'cone',rank:13,phys:0,proc:1,a38kid:1};

/* ===== 5) 맞았을 때 ===== */
const A38LNK={id:'netshot',n:'링크 넷',cls:'archer',el:'phys',kind:'strike',rank:14,phys:0,proc:1,a38kid:1,a38lnk:1};
const a38Mine=s=>s&&!s.ghost&&!GHOST&&s.cls==='archer'&&P.cls==='archer';
{const _he=hurtE;hurtE=function(e,amt,s){if(!e||e.dead||!a38Mine(s))return _he(e,amt,s);
  // 맞히기 전: 거리 보너스 · 언 적 두 배 · 덫에 걸린 적 · 킬 존
  if(s.far38){const F=s.far38;amt*=1+F.max*clamp((dist(e,P)-F.from)/(F.to-F.from),0,1)}
  const wasFrozen=(e.freezeT||0)>0;if(s.sh38&&!s.a38kid&&wasFrozen)amt*=s.sh38.k;
  if(!s.proc&&s.kind!=='trap'&&s.id!=='thorntrap'&&s.kind!=='summon'){const x=passSum('trapShot');if(x>0&&((e._tr38||-9)>time-3||e.rootT>0)){const bd=Math.min(dmgCap(),buffSum('dmg'));amt*=(1+Math.min(dmgCap(),bd+x))/(1+bd)}}
  if(s.kind==='trap'&&A38.kz.length){for(const z of A38.kz)if(z.t>0&&!z.G&&Math.hypot(e.x-z.x,e.y-z.y)<z.rad+hR(e)){amt*=1+z.amp;break}}
  e._miss=null;const h0=e.hp;let r;
  if(s.crit38){/* 스나이프: 반드시 치명타 — 치명타 확률은 장비 값(stat('crit'))에서 오므로 이 한 번만 크게 올려 둔다 */const gs=gearStats;gearStats=function(){const o=gs();return Object.assign({},o,{crit:(o.crit||0)+1e4})};try{r=_he(e,amt,s)}finally{gearStats=gs}}else r=_he(e,amt,s);
  const hit=e._miss!==s,dealt=Math.max(0,h0-e.hp);if(!hit)return r;
  if(s.kind==='trap'||s.id==='thorntrap')e._tr38=time;
  // 수정 감옥: 갇힌 동안 받은 피해를 모은다
  if(e.cp38&&e.cp38.t>0&&!s.cp38&&!s.a38cp)e.cp38.store+=dealt*e.cp38.k;
  // 링크 넷: 묶인 적 하나가 맞으면 다른 적도 나눠 받는다
  if(e.ln38&&e.ln38.t>0&&!s.a38lnk&&dealt>0){for(const o of e.ln38.g)if(o!==e&&!o.dead)_he(o,dealt*e.ln38.share,A38LNK)}
  if(s.a38kid)return r;
  if(s.split38&&s.kind==='bolt'){const K=s.split38,base=Math.atan2(e.y-P.y,e.x-P.x),ss=Object.assign({},s,{split38:0,a38kid:1,phys:0,mhit:0});
    for(const sd of [-1,1]){const a=base+sd*K.ang;projs.push({x:e.x+Math.cos(a)*(e.r+6),y:e.y+Math.sin(a)*(e.r+6),z:18,vx:Math.cos(a)*K.spd,vy:Math.sin(a)*K.spd,r:5,dmg:amt*K.k,owner:'p',s:ss,life:K.life,col:EL.phys,hit:new Set([e])})}}
  if(s.ign38&&!e.dead){const I=s.ign38,g=e.ig38&&e.ig38.until>time?e.ig38:(e.ig38={n:0});g.n++;g.until=time+I.dur;
    if(g.n>=I.max){e.ig38=null;const pw=amt/(s.mult||1)*I.mult,x=e.x,y=e.y,ks=Object.assign({},s,{ign38:0,a38kid:1,phys:0,kind:'strike'});
      rings.push({x,y,r:8,max:I.rad,life:.4,col:EL.fire});burst(x,y,'#ffb070',30,I.rad*2,4,16);decal(x,y,I.rad*.5,'fire');shake=Math.max(shake,4);
      for(const o of enemies)if(!o.dead&&Math.hypot(o.x-x,o.y-y)<I.rad+hR(o))hurtE(o,pw*rnd(.95,1.05),ks)}
    else ftext(e.x,e.y-20,`불씨 ${g.n}`,'#ffb070',false,e.r*2+30)}
  if(s.phx38){const X=s.phx38,ks=Object.assign({},s,{phx38:0,a38kid:1,phys:0,kind:'strike'}),dm=amt*X.k;
    a38Boom(e.x,e.y,X.rad,dm,ks,EL.fire,e);A38.phx.push({x:e.x,y:e.y,n:X.n,prev:new Set([e]),dmg:dm,t:X.delay,delay:X.delay,rad:X.rad,reach:X.reach,s:ks})}
  if(s.sh38){const H=s.sh38;if(wasFrozen){const x=e.x,y=e.y,ks=Object.assign({},s,{sh38:0,a38kid:1,phys:0,kind:'strike',slow:1});if(!NET.guest)e.freezeT=0;e.ch38=0;
      burst(x,y,'#e8f8ff',26,H.rad*2,3.5,18);rings.push({x,y,r:8,max:H.rad,life:.35,col:EL.ice});A38.seg.push({k:'shard',x,y,t:.4,max:.4,rad:H.rad});
      for(const o of enemies)if(o!==e&&!o.dead&&Math.hypot(o.x-x,o.y-y)<H.rad+hR(o)){hurtE(o,amt/H.k*H.kk*rnd(.95,1.05),ks);frz38(o,H.frz2,H.frz2*.5)}}
    else if(!e.dead){e.ch38=(e.ch38T||0)>time-4?(e.ch38|0)+1:1;e.ch38T=time;if(e.ch38>=H.need){e.ch38=0;frz38(e,H.frz,H.bossFrz);ftext(e.x,e.y-20,'얼어붙음','#bfe8ff',false,e.r*2+30)}
      else ftext(e.x,e.y-20,`냉기 ${e.ch38}`,'#bfe8ff',false,e.r*2+30)}}
  if(s.cp38&&!e.dead&&!(e.cp38&&e.cp38.t>0)){const C=s.cp38,t=big38(e)?C.boss:C.dur;frz38(e,t,t);e.cp38={t,max:t,store:0,k:C.store,dmg:amt/(s.mult||1)*C.mult,rad:C.rad,s:Object.assign({},s,{cp38:0,a38kid:1,a38cp:1,phys:0,kind:'strike'})};A38.cp.push(e);
    ftext(e.x,e.y-20,'수정 감옥','#bfe8ff',false,e.r*2+30)}
  if(s.link38&&!e.dead){const g=s._lg38||(s._lg38={g:[],t:s.link38.dur,share:s.link38.share});if(!g.g.includes(e)&&g.g.length<s.link38.n){g.g.push(e);e.ln38=g;if(g.g.length===1)A38.lnk.push(g)}}
  if(s.dm38&&s.id==='deathmark'&&!e.dead){const L=Math.max(1,s.L||1);e.dm38={n:s.dm38.n,reach:s.dm38.reach,rad:s.dm38.rad,pw:physPower()*s.dm38.mult*physBuffMul()*physScale('deathmark',L),mark:s.mark}}
  return r}}
function a38Boom(x,y,rad,dm,s,col,skip){rings.push({x,y,r:8,max:rad,life:.35,col});burst(x,y,col,22,rad*2,3.5,16);decal(x,y,rad*.4,s.el);
  if(!s.ghost)for(const o of enemies)if(o!==skip&&!o.dead&&Math.hypot(o.x-x,o.y-y)<rad+hR(o))hurtE(o,dm*rnd(.95,1.05),s)}
// 마크 오브 데스: 표식이 붙은 적이 쓰러지면 터지며 옆 적에게 옮겨 붙는다
const A38DM={id:'deathmark',n:'마크 오브 데스',cls:'archer',el:'phys',kind:'strike',rank:17,phys:0,proc:1,a38kid:1};
{const _ke=killE;killE=function(e){const d=e&&!e.dead&&e.dm38&&e.markT>0?e.dm38:null;if(e)e.dm38=null;_ke(e);if(!d||P.cls!=='archer')return;
  const x=e.x,y=e.y;rings.push({x,y,r:8,max:d.rad,life:.4,col:'#ff9a4a'});burst(x,y,'#ff9a4a',24,d.rad*2,3.5,16);
  for(const o of enemies)if(!o.dead&&Math.hypot(o.x-x,o.y-y)<d.rad+hR(o))hurtE(o,d.pw*rnd(.95,1.05),A38DM);
  if(d.n<=0)return;const o=nearestEnemy({x,y},d.reach);if(!o)return;
  zap({x,y,z:20},{x:o.x,y:o.y,z:20},{life:.3,w:2.4,br:1,depth:1,col:'#ffd0a0',glow:'#ff9a4a'});applyFx(o,{mark:d.mark,job2:'hawkeye'},{x,y});
  o.dm38={n:d.n-1,reach:d.reach,rad:d.rad,pw:d.pw,mark:d.mark};ftext(o.x,o.y-20,'표식 옮김','#ff9a4a',false,o.r*2+30)}}
// 덫: 클러스터 트랩 흩뿌리기 · 킬 존 다시 장전 (fxphys가 다 실은 뒤 덫 그림을 바꿔 끼우므로 job2.js처럼 다음 차례에 감싼다)
queueMicrotask(()=>{const _pt=PFX.trap;PFX.trap=function(tr,ev){const r=_pt.apply(this,arguments);if(ev!=='boom'||!tr||!tr.s||tr.s.ghost||tr.own)return r;
  try{const C=tr.s.cl38;if(C&&tr.id==='blasttrap'){const ks=Object.assign({},tr.s,{cl38:0,rad:C.rad});
      for(let k=0;k<C.n;k++){const an=k/C.n*6.283+R()*.8,q=landAt(tr.x,tr.y,tr.x+Math.cos(an)*C.ring,tr.y+Math.sin(an)*C.ring);traps.push({x:q.x,y:q.y,s:ks,id:'cluster38',own:0,dmg:tr.dmg*C.k,arm:C.arm,life:C.life,age:0})}}
    if(!tr.kz38)for(const z of A38.kz)if(z.t>0&&!z.G&&Math.hypot(tr.x-z.x,tr.y-z.y)<z.rad){traps.push({x:tr.x,y:tr.y,s:tr.s,id:tr.id,own:0,dmg:tr.dmg,arm:1,life:Math.max(1.2,z.t+.5),age:0,kz38:1});break}}catch(err){if(window.__QA)throw err}
  return r}});

/* ===== 6) 매 프레임 ===== */
function a38Tick(dt){
  // 불길 남기는 화살: 날아가는 길에 점을 남기고, 점마다 4초 동안 탄다
  for(const p of projs)if(p.owner==='p'&&p.s&&p.s.tr38&&p.life>0){let T=p.a38tr;if(!T){const R0=p.s.tr38;T=p.a38tr={pts:[],w:R0.w,iv:R0.iv,cd:R0.iv,dmg:p.dmg*R0.k,dur:R0.dur,s:Object.assign({},p.s,{tr38:0,a38kid:1,phys:0,kind:'field',pierce:0}),G:!!p.s.ghost,hitT:new WeakMap()};A38.trail.push(T)}
    const l=T.pts[T.pts.length-1];if(!l||Math.hypot(p.x-l.x,p.y-l.y)>=24)T.pts.push({x:p.x,y:p.y,t:T.dur})}
  for(const T of A38.trail){for(const q of T.pts)q.t-=dt;T.pts=T.pts.filter(q=>q.t>0);T.cd-=dt;if(T.G||T.cd>0||!T.pts.length)continue;T.cd=T.iv;
    for(const e of enemies){if(e.dead)continue;const r=T.w+hR(e);if(T.pts.some(q=>Math.abs(e.x-q.x)<r&&Math.abs(e.y-q.y)<r&&Math.hypot(e.x-q.x,e.y-q.y)<r))hurtE(e,T.dmg*rnd(.9,1.1),T.s)}}
  A38.trail=A38.trail.filter(T=>T.pts.length||projs.some(p=>p.a38tr===T));
  // 불새: 가까운 다른 적에게 차례로 내리꽂힘
  for(const f of A38.phx){f.t-=dt;if(f.t>0)continue;let o=null,bd=f.reach;for(const e of enemies){if(e.dead||f.prev.has(e))continue;const d=Math.hypot(e.x-f.x,e.y-f.y);if(d<bd){bd=d;o=e}}
    if(!o){f.n=0;continue}A38.seg.push({k:'phx',x1:f.x,y1:f.y,x2:o.x,y2:o.y,t:.3,max:.3});f.prev.add(o);f.x=o.x;f.y=o.y;a38Boom(o.x,o.y,f.rad,f.dmg,f.s,EL.fire,null);f.n--;f.t=f.delay}
  A38.phx=A38.phx.filter(f=>f.n>0);
  // 작은 해
  for(const u of A38.sun){u.t-=dt;u.cd-=dt;if(u.cd<=0&&u.t>0){u.cd=u.iv;const k=u.k0+u.kd*u.i++;rings.push({x:u.x,y:u.y,r:10,max:u.rad,life:.35,col:'#ffb070'});burst(u.x,u.y,'#ffd27a',8+u.i,u.rad,3,90);
      if(!u.G)for(const e of enemies)if(!e.dead&&Math.hypot(e.x-u.x,e.y-u.y)<u.rad+hR(e))hurtE(e,u.dmg*k*rnd(.95,1.05),u.s)}
    if(u.t<=0){rings.push({x:u.x,y:u.y,r:10,max:u.frad,life:.6,col:'#fff2c0'});burst(u.x,u.y,'#ffb070',60,u.frad*2.2,5,40);decal(u.x,u.y,u.frad*.5,'fire');flash={col:'#ffb070',a:.2};shake=Math.max(shake,8);
      if(!u.G)for(const e of enemies)if(!e.dead&&Math.hypot(e.x-u.x,e.y-u.y)<u.frad+hR(e))hurtE(e,u.dmg*u.fin*rnd(.95,1.05),u.s)}}
  A38.sun=A38.sun.filter(u=>u.t>0);
  // 서리 구슬: 조각 뿌리기, 끝나면 여덟 조각
  for(const p of A38.orb){const O=p.orb38,ks=O.ks||(O.ks=Object.assign({},p.s,{a38kid:1,phys:0,slow:1,slowDur:1.5}));
    const shard=a=>projs.push({x:p.x,y:p.y,z:18,vx:Math.cos(a)*520,vy:Math.sin(a)*520,r:5,dmg:p.dmg*O.k,owner:'p',s:ks,life:.5,col:EL.ice,hit:null,ghost:p.ghost});
    if(p.life>0){O.acc+=dt;while(O.acc>=O.iv){O.acc-=O.iv;O.a+=2.4;shard(O.a)}}else if(!O.done){O.done=1;for(let i=0;i<O.end;i++)shard(i/O.end*6.283);burst(p.x,p.y,'#e8f8ff',20,180,3,18)}}
  A38.orb=A38.orb.filter(p=>p.life>0);
  // 수정 감옥: 시간이 다하거나 쓰러지면 깨지며 모은 피해를 터뜨림
  for(const e of A38.cp){const C=e.cp38;if(!C)continue;C.t-=dt;if(C.t>0&&!e.dead)continue;e.cp38=null;const x=e.x,y=e.y,dm=C.dmg+C.store;
    rings.push({x,y,r:8,max:C.rad,life:.45,col:'#e8f8ff'});burst(x,y,'#e8f8ff',36,C.rad*2,4,20);A38.seg.push({k:'shard',x,y,t:.5,max:.5,rad:C.rad});shake=Math.max(shake,4);
    for(const o of enemies)if(!o.dead&&Math.hypot(o.x-x,o.y-y)<C.rad+hR(o))hurtE(o,dm*rnd(.95,1.05),C.s)}
  A38.cp=A38.cp.filter(e=>e.cp38);
  // 얼음 가시 줄
  for(const v of A38.aval){if(v.t<0){v.acc+=dt;while(v.acc>=v.step&&v.i<v.n&&!v.stop){v.acc-=v.step;const d=60+v.i*(v.len-60)/(v.n-1),x=v.ox+v.ux*d,y=v.oy+v.uy*d;v.i++;
        if(DG?!dgFree(x,y,4):blockedAt(x,y)){v.stop=1;break}v.pts.push({x,y,a:0});burst(x,y,'#e8f8ff',10,120,3,10);
        if(!v.G)for(const e of enemies)if(!e.dead&&!v.hit.has(e)&&Math.hypot(e.x-x,e.y-y)<v.rad+hR(e)){v.hit.add(e);hurtE(e,v.dmg*v.k1*rnd(.95,1.05),v.s);frz38(e,v.frz,v.bossFrz)}}
      if(v.i>=v.n||v.stop)v.t=v.hold}
    else{v.t-=dt;if(v.t<=0){const done=new Set();for(const q of v.pts){burst(q.x,q.y,'#e8f8ff',16,160,3.5,16);decal(q.x,q.y,30,'ice');
        if(!v.G)for(const e of enemies)if(!e.dead&&!done.has(e)&&Math.hypot(e.x-q.x,e.y-q.y)<v.rad+hR(e)){done.add(e);hurtE(e,v.dmg*v.k2*rnd(.95,1.05),v.s)}}shake=Math.max(shake,6);v.dead=1}}}
  A38.aval=A38.aval.filter(v=>!v.dead);
  // 피뢰침
  for(const q of A38.rod){q.t-=dt;q.cd-=dt;if(q.t<=0||q.cd>0)continue;let tg=null,bd=q.reach;for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-q.x,e.y-q.y);if(d<bd){bd=d;tg=e}}
    if(!tg)continue;q.cd=q.iv;const st=stormStyle(7),hit=new Set([tg]);zap({x:q.x,y:q.y,z:70},{x:tg.x,y:tg.y,z:16},Object.assign({life:.28},st));zap({x:tg.x,y:tg.y,z:240},{x:tg.x,y:tg.y,z:10},Object.assign({life:.25},st));
    if(!q.G)hurtE(tg,q.dmg*rnd(.9,1.1),q.s);let from=tg;for(let j=0;j<q.jumps;j++){const o=nearestEnemy(from,220,hit);if(!o)break;hit.add(o);zap({x:from.x,y:from.y,z:16},{x:o.x,y:o.y,z:16},Object.assign({life:.22},st));if(!q.G)hurtE(o,q.dmg*.6*rnd(.9,1.1),q.s);from=o}}
  A38.rod=A38.rod.filter(q=>q.t>0);
  // 회오리
  for(const h of A38.hur){h.t-=dt;h.spin+=dt*9;const nx=h.x+h.vx*dt,ny=h.y+h.vy*dt;if(DG?dgFree(nx,ny,10):!blockedAt(nx,ny)){h.x=nx;h.y=ny}
    if(R()<.9)parts.push({x:h.x+rnd(-h.rad,h.rad)*.6,y:h.y+rnd(-h.rad,h.rad)*.4,z:rnd(0,60),vx:rnd(-60,60),vy:rnd(-60,60),vz:rnd(60,160),life:.5,max:.5,col:'#cfeee4',sz:rnd(1.5,3)});
    if(!h.G&&!NET.guest)for(const e of enemies){if(e.dead||big38(e))continue;const d=Math.hypot(e.x-h.x,e.y-h.y);if(d>14&&d<h.rad+60+hR(e)){const k=Math.min(d-10,h.pull*dt);moveBody(e,(h.x-e.x)/d*k,(h.y-e.y)/d*k)}}
    h.tc-=dt;if(h.tc<=0){h.tc=h.tick;if(!h.G)for(const e of enemies)if(!e.dead&&Math.hypot(e.x-h.x,e.y-h.y)<h.rad+hR(e))hurtE(e,h.dmg*h.k*rnd(.9,1.1),h.s)}
    h.bc-=dt;if(h.bc<=0){h.bc=h.bolt;const ins=enemies.filter(e=>!e.dead&&Math.hypot(e.x-h.x,e.y-h.y)<h.rad+hR(e));const tg=ins.length?ins[(R()*ins.length)|0]:null;const p=tg||{x:h.x+rnd(-40,40),y:h.y+rnd(-30,30)};
      zap({x:p.x,y:p.y,z:260},{x:p.x,y:p.y,z:8},Object.assign({life:.25},stormStyle(8)));if(tg&&!h.G)hurtE(tg,h.dmg*h.kb*rnd(.9,1.1),h.s)}
    if(h.t<=0){rings.push({x:h.x,y:h.y,r:10,max:h.rad*1.4,life:.5,col:'#cfeee4'});burst(h.x,h.y,'#cfeee4',40,h.rad*2.4,4,30);
      if(!h.G)for(const e of enemies)if(!e.dead&&Math.hypot(e.x-h.x,e.y-h.y)<h.rad*1.4+hR(e))hurtE(e,h.dmg*h.fin*rnd(.9,1.1),h.s)}}
  A38.hur=A38.hur.filter(h=>h.t>0);
  // 튕겨 다니는 화살
  for(const b of A38.bnc){b.t-=dt;b.cd-=dt;if(b.t<=0||b.cd>0)continue;let tg=null,bd=1e9;
    for(const e of enemies){if(e.dead||e===b.last||Math.hypot(e.x-b.x,e.y-b.y)>b.zone+hR(e))continue;/* 가장 오래 안 맞은 적부터(같으면 가까운 적) — 둘 사이만 오가지 않고 구역 안 적을 돌아가며 */const hm=b.hm||(b.hm=new Map()),d=(hm.has(e)?hm.get(e)+1:0)*1e5+Math.hypot(e.x-b.ax,e.y-b.ay);if(d<bd){bd=d;tg=e}}
    if(!tg&&b.last&&!b.last.dead&&Math.hypot(b.last.x-b.x,b.last.y-b.y)<=b.zone+hR(b.last)&&enemies.filter(e=>!e.dead&&Math.hypot(e.x-b.x,e.y-b.y)<=b.zone+hR(e)).length===1)tg=b.last;
    if(!tg)continue;b.cd=b.iv;A38.seg.push({k:'bnc',x1:b.ax,y1:b.ay,x2:tg.x,y2:tg.y,t:.18,max:.18});b.ax=tg.x;b.ay=tg.y;b.last=tg;(b.hm||(b.hm=new Map())).set(tg,b.i);burst(tg.x,tg.y,'#e8e4d8',6,90,2.5,16);
    if(!b.G)hurtE(tg,b.dmg*(1+Math.min(b.mx,b.grow*b.i))*rnd(.9,1.1),b.s);b.i++}
  A38.bnc=A38.bnc.filter(b=>b.t>0);
  // 킬 존
  for(const z of A38.kz)z.t-=dt;A38.kz=A38.kz.filter(z=>z.t>0);
  // 링크 넷: 묶인 적끼리 멀어지지 못함 · 화살은 셋까지만 꿰뚫음
  for(const p of projs)if(p.owner==='p'&&p.s&&p.s.link38&&p.hit&&p.hit.size>=p.s.link38.n)p.life=0;
  for(const g of A38.lnk){g.t-=dt;const al=g.g.filter(e=>!e.dead);if(g.t<=0||al.length<1){for(const e of g.g)if(e.ln38===g)e.ln38=null;g.t=0;continue}
    if(al.length<2||NET.guest)continue;let cx=0,cy=0;for(const e of al){cx+=e.x;cy+=e.y}cx/=al.length;cy/=al.length;
    for(const e of al){if(big38(e))continue;const d=Math.hypot(e.x-cx,e.y-cy);if(d>50)moveBody(e,(cx-e.x)/d*Math.min(d-50,90*dt),(cy-e.y)/d*Math.min(d-50,90*dt))}}
  A38.lnk=A38.lnk.filter(g=>g.t>0);
  // 쏜 트랩: 가시밭이 넓어지고, 2초 넘게 머문 적은 묶임
  for(const f of fields){const G=f.s&&f.s.grow38;if(!G||f.s.ghost)continue;if(!f.r38)f.r38=f.rad;f.rad=f.r38*(1+(G.to-1)*clamp(1-f.t/f.max,0,1));
    const W=f.st38||(f.st38=new Map());for(const e of enemies){if(e.dead)continue;if(Math.hypot(e.x-f.x,e.y-f.y)<f.rad+hR(e)){const v=(W.get(e)||0)+dt;W.set(e,v);
        if(v>=G.hold&&v-dt<G.hold)applyFx(e,{root:G.root,bossRoot:G.bossRoot,job2:'ranger'},f)}else W.delete(e)}}
  for(const g of A38.gust)g.t-=dt;A38.gust=A38.gust.filter(g=>g.t>0);
  for(const q of A38.seg)q.t-=dt;A38.seg=A38.seg.filter(q=>q.t>0)}
{const _u=update;update=function(dt){_u(dt);if(!paused||NET.on)try{a38Tick(dt)}catch(err){if(window.__QA)throw err}}}
function a38Clear(){for(const k of ['trail','phx','sun','orb','cp','aval','rod','hur','bnc','kz','lnk','gust','seg'])A38[k].length=0;A38.twN=0}
{const _lr=loadRegion;loadRegion=function(){a38Clear();return _lr.apply(this,arguments)}}
{const _ed=enterDungeon;enterDungeon=function(){a38Clear();return _ed.apply(this,arguments)}}
{const _xd=leaveDungeon;leaveDungeon=function(){a38Clear();return _xd.apply(this,arguments)}}
{const _ng=newGame;newGame=function(){a38Clear();return _ng.apply(this,arguments)}}

/* ===== 7) 그리기 (FXP.draw: 화면 좌표) ===== */
{const _fd=FXP.draw;FXP.draw=function(c,map,now){_fd.call(this,c,map,now);try{a38Draw(c,map)}catch(err){if(window.__QA)throw err}}}
function a38Draw(c,map){const A=A38;let any=A.trail.length+A.sun.length+A.orb.length+A.cp.length+A.aval.length+A.rod.length+A.hur.length+A.bnc.length+A.kz.length+A.lnk.length+A.gust.length+A.seg.length;
  let ig=0;for(const e of enemies)if(e.ig38&&!e.dead&&e.ig38.until>time){ig=1;break}if(!any&&!ig)return;
  const op=c.globalCompositeOperation,ga=c.globalAlpha,lw=c.lineWidth;c.lineCap='round';
  // 바닥에 깔리는 것
  c.globalCompositeOperation='source-over';
  for(const z of A.kz){const p=map(z.x,z.y),q=map(z.x+z.rad,z.y),r=Math.abs(q.x-p.x);c.globalAlpha=.55*Math.min(1,z.t*2,(z.max-z.t)*5);c.strokeStyle='#c9a46a';c.lineWidth=2;c.setLineDash([10,8]);
    c.beginPath();c.ellipse(p.x,p.y,r,r*.5,0,0,6.283);c.stroke();c.setLineDash([])}
  for(const g of A.lnk){const al=g.g.filter(e=>!e.dead);if(al.length<2)continue;c.globalAlpha=.8;c.strokeStyle='#e8e0c8';c.lineWidth=2;c.beginPath();
    al.forEach((e,i)=>{const p=map(e.x,e.y);i?c.lineTo(p.x,p.y-10):c.moveTo(p.x,p.y-10)});c.stroke()}
  c.globalCompositeOperation='lighter';
  for(const T of A.trail){if(T.pts.length<1)continue;for(const q of T.pts){const p=map(q.x,q.y),a=Math.min(1,q.t*1.5);c.globalAlpha=.55*a;c.drawImage(Kit.glowCv('#ff7a2e'),p.x-22,p.y-14,44,28);
    c.globalAlpha=.8*a;c.drawImage(Kit.glowCv('#ffd27a'),p.x-7,p.y-10-Math.sin(time*9+q.x)*4,14,18)}}
  for(const v of A.aval)for(const q of v.pts){const p=map(q.x,q.y),h=v.t<0?34:34*Math.max(.2,v.t/v.hold);c.globalAlpha=.9;c.fillStyle='#d8f2ff';c.beginPath();c.moveTo(p.x-11,p.y);c.lineTo(p.x-2,p.y-h);c.lineTo(p.x+3,p.y-h*.7);c.lineTo(p.x+11,p.y);c.closePath();c.fill();
    c.fillStyle='#8fd8ff';c.beginPath();c.moveTo(p.x+2,p.y);c.lineTo(p.x+8,p.y-h*.55);c.lineTo(p.x+13,p.y);c.closePath();c.fill()}
  for(const e of A.cp){if(e.dead||!e.cp38)continue;const p=map(e.x,e.y),r=e.r*1.25+8;c.globalAlpha=.55;c.fillStyle='#bfe8ff';c.beginPath();c.moveTo(p.x,p.y-r*2.1);c.lineTo(p.x+r,p.y-r*.9);c.lineTo(p.x+r*.8,p.y+r*.2);c.lineTo(p.x-r*.8,p.y+r*.2);c.lineTo(p.x-r,p.y-r*.9);c.closePath();c.fill();
    c.globalAlpha=.9;c.strokeStyle='#ffffff';c.lineWidth=1.6;c.stroke()}
  for(const u of A.sun){const p=map(u.x,u.y),k=Math.min(1,(u.max-u.t)*3),sz=40+u.i*3;c.globalAlpha=.9*k;c.drawImage(Kit.glowCv('#ffb070'),p.x-sz,p.y-120-sz,sz*2,sz*2);c.drawImage(Kit.glowCv('#fff2c0'),p.x-sz*.45,p.y-120-sz*.45,sz*.9,sz*.9);
    const q=map(u.x+u.rad,u.y),r=Math.abs(q.x-p.x);c.globalAlpha=.25*k;c.strokeStyle='#ffb070';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y,r,r*.5,0,0,6.283);c.stroke()}
  for(const o of A.orb){if(o.life<=0)continue;const p=map(o.x,o.y);c.globalAlpha=.95;c.drawImage(Kit.glowCv('#8fd8ff'),p.x-22,p.y-40,44,44);c.drawImage(Kit.glowCv('#ffffff'),p.x-9,p.y-27,18,18)}
  for(const q of A.rod){const p=map(q.x,q.y);c.globalAlpha=Math.min(1,q.t*2);c.strokeStyle='#e8e4d8';c.lineWidth=3;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x,p.y-62);c.stroke();
    c.drawImage(Kit.glowCv('#9fc0ff'),p.x-16,p.y-78,32,32);if(R()<.3){c.strokeStyle='#fff6b0';c.lineWidth=1;c.beginPath();c.moveTo(p.x,p.y-62);c.lineTo(p.x+rnd(-14,14),p.y-48);c.stroke()}}
  for(const h of A.hur){const p=map(h.x,h.y),a=Math.min(1,h.t*2,(h.max-h.t)*4);c.strokeStyle='#cfeee4';for(let i=0;i<5;i++){const y=p.y-i*22,w=h.rad*(.35+i*.17);c.globalAlpha=.35*a;c.lineWidth=3;
    c.beginPath();c.ellipse(p.x+Math.sin(h.spin+i)*6,y,w,w*.32,0,h.spin+i,h.spin+i+4.6);c.stroke()}}
  for(const g of A.gust){const p=map(g.x,g.y),k=1-g.t/g.max;c.globalAlpha=.6*(1-k);c.strokeStyle='#bfeedd';c.lineWidth=3;c.beginPath();c.ellipse(p.x,p.y,g.r*(.4+.6*k),g.r*(.4+.6*k)*.5,0,g.a-g.ang/2,g.a+g.ang/2);c.stroke()}
  for(const q of A.seg){const k=q.t/q.max;c.globalAlpha=k;if(q.k==='bnc'||q.k==='phx'){const a=map(q.x1,q.y1),b=map(q.x2,q.y2);c.strokeStyle=q.k==='phx'?'#ffb070':'#fff6d8';c.lineWidth=q.k==='phx'?4:2.4;
      c.beginPath();c.moveTo(a.x,a.y-16);if(q.k==='phx')c.quadraticCurveTo((a.x+b.x)/2,Math.min(a.y,b.y)-90,b.x,b.y-14);else c.lineTo(b.x,b.y-16);c.stroke()}
    else if(q.k==='shard'){const p=map(q.x,q.y);for(let i=0;i<8;i++){const an=i/8*6.283,d=q.rad*(1-k);c.fillStyle='#e8f8ff';c.fillRect(p.x+Math.cos(an)*d-2,p.y+Math.sin(an)*d*.5-14-2,4,4)}}}
  c.globalCompositeOperation='source-over';
  for(const e of enemies){const g=e.ig38;if(!g||e.dead||g.until<=time)continue;const p=map(e.x,e.y);c.globalAlpha=.95;for(let i=0;i<g.n;i++){c.fillStyle=i===g.n-1?'#ffd27a':'#ff7a2e';c.beginPath();c.arc(p.x-(g.n-1)*5+i*10,p.y-e.r*2-28,3.4,0,6.283);c.fill()}}
  c.globalAlpha=ga;c.globalCompositeOperation=op;c.lineWidth=lw}

/* ===== 8) 스킬 창 숫자 ===== */
{const _na=numsAt;numsAt=function(id,L){const out=_na(id,L),s0=SPELLS[id];if(!s0||s0.cls!=='archer')return out;const Lv=Math.max(1,L||1),s=eff(id,Lv);
  const rng=d=>`${Math.round(d*.9)}~${Math.round(d*1.1)}`,base=physPower()*(s.mult||0)*physBuffMul()*physScale(id,Lv),put=(k,v)=>{const i=out.findIndex(r=>r[0]===k);if(i>=0)out[i]=[k,v];else out.unshift([k,v])},add=(...r)=>out.splice(1,0,...r);
  switch(id){
    case'ignitearrow':add(['불씨 다섯 겹',`${rng(physPower()*s.ign38.mult*physBuffMul()*physScale(id,Lv))} · 범위 ${s.ign38.rad}`]);break;
    case'firetrail':add(['불길 줄',`${rng(base*s.tr38.k)} /0.5초 · ${s.tr38.dur}초`]);break;
    case'phoenixarrow':add(['불새',`${rng(base*s.phx38.k)} · 범위 ${s.phx38.rad} · ${s.phx38.n}번 더`]);break;
    case'solararrow':{const S=s.sun38;put('피해',`${rng(base*S.k0)} → ${rng(base*(S.k0+S.kd*(S.dur/S.iv-1)))} /0.5초`);add(['마지막 폭발',`${rng(base*S.fin)} · 범위 ${S.frad}`],['작은 해',`${S.dur}초 · 범위 ${S.rad}`]);break}
    case'shatterarrow':add(['언 적',`×${s.sh38.k} · 조각 범위 ${s.sh38.rad}`],['세 번 맞히면',`${s.sh38.frz}초 얼림`]);break;
    case'glacialorb':add(['얼음 조각',`${rng(base*s.orb38.k)} · ${s.orb38.iv}초마다`],['구슬',`${s.orb38.life}초`]);break;
    case'crystalprison':add(['깨질 때',`${rng(physPower()*s.cp38.mult*physBuffMul()*physScale(id,Lv))} + 모은 피해 · 범위 ${s.cp38.rad}`],['가두기',`${s.cp38.dur}초 (보스 ${s.cp38.boss}초)`]);break;
    case'avalanche':{const V=s.aval38;put('피해',`${rng(base*V.k1)} (솟을 때) · ${rng(base*V.k2)} (부서질 때)`);add(['얼음 가시 줄',`길이 ${V.len} · 얼림 ${V.frz}초 (보스 ${V.bossFrz}초)`]);break}
    case'stormarrow':add(['번개 튐','옆의 적 하나 · 절반 피해']);break;
    case'tailwind':add(['돌풍',`화살 기술 ${s.tw38.every}번마다 · ${rng(physPower()*s.tw38.mult*physBuffMul()*physScale(id,Lv))}`],['공격 · 이동 속도',`+${Math.round(s.ias*100)}% · +${Math.round(s.spd*100)}%`]);break;
    case'lightningrod':put('피해',rng(base)+' /벼락');add(['피뢰침',`${s.rod38.dur}초 · ${s.rod38.iv}초마다 · 범위 ${s.rod38.reach} · ${s.rod38.jumps}번 튐`]);break;
    case'hurricaneshot':{const H=s.hur38;put('피해',`${rng(base*H.k)} /${H.tick}초 · 벼락 ${rng(base*H.kb)}`);add(['회오리',`${H.life}초 · 범위 ${H.rad}`],['흩어질 때',rng(base*H.fin)]);break}
    case'tripleshot':add(['갈라진 화살',`${rng(base*s.split38.k)} ×2`]);break;
    case'snipe':add(['멀리 있는 적',`최대 +${Math.round(s.far38.max*100)}% (${s.far38.to} 거리)`],['치명타','반드시']);break;
    case'deathmark':add(['표식이 터질 때',`${rng(physPower()*s.dm38.mult*physBuffMul()*physScale(id,Lv))} · 범위 ${s.dm38.rad} · ${s.dm38.n}번 옮김`]);break;
    case'arrowvortex':put('피해',rng(base)+' /튕김');add(['튕기는 구역',`${s.b38.dur}초 · 범위 ${s.b38.zone} · 튕길 때마다 +${Math.round(s.b38.grow*100)}%`]);break;
    case'blasttrap':add(['작은 덫',`${rng(base*s.cl38.k)} ×${s.cl38.n}`]);break;
    case'netshot':add(['그물',`적 ${s.link38.n}까지 · ${s.link38.dur}초 · 나눠 받는 피해 ${Math.round(s.link38.share*100)}%`]);break;
    case'dominion':put('피해',rng(base)+' /덫');add(['사냥 구역',`${s.kz38.dur}초 · 범위 ${s.kz38.rad} · 덫 다시 장전 · 덫 피해 +${Math.round(s.kz38.amp*100)}%`]);break;
    case'thorntrap':add(['넓어짐',`반경 ×${s.grow38.to} · ${s.grow38.hold}초 머물면 ${s.grow38.root}초 묶임`]);break}
  return out}}

/* ===== 9) 아이콘 ===== */
Object.assign(ICP,{
  ignitearrow:c=>ICX.arrow(13,19,-45,.85,PAL.fire[0],PAL.fire[0])+ICX.dots([[20,7],[24,10],[27,14]],PAL.fire[2],2)+ICX.flame(24,22,.5),
  firetrail:c=>ICX.path('M4 26Q12 22 20 14T29 4',PAL.fire[0],3)+ICX.flame(9,24,.45)+ICX.flame(17,17,.45)+ICX.arrow(24,9,-45,.6,PAL.fire[2],PAL.fire[0]),
  phoenixarrow:c=>ICX.wings(16,13,.9,PAL.fire[0])+ICX.arrow(16,20,-90,.6,PAL.fire[2],PAL.fire[0])+ICX.burst(16,27,.4,PAL.fire[2],6),
  solararrow:c=>ICX.orb(16,11,7,PAL.fire[2])+ICX.burst(16,11,1.05,PAL.fire[0],10)+ICX.arrow(16,26,-90,.45),
  shatterarrow:c=>ICX.flake(11,20,.8)+ICX.arrow(19,13,-45,.75,PAL.ice[0],PAL.ice[0])+ICX.dots([[25,23],[28,19],[22,27]],PAL.ice[2],1.8),
  glacialorb:c=>ICX.orb(16,16,7,PAL.ice[0])+ICX.lines(8,16,0,.7,PAL.ice[2],3)+ICX.dots([[25,8],[27,24],[6,6]],PAL.ice[2],1.8),
  crystalprison:c=>ICX.path('M16 3L25 12L22 27H10L7 12Z',PAL.ice[2],1.6)+ICX.figure(16,17,.45,'#5a6a7a')+ICX.flake(25,25,.4),
  avalanche:c=>ICX.path('M3 28L8 18L11 28M10 28L16 11L21 28M20 28L26 5L30 28',PAL.ice[0],1.8)+ICX.flake(8,8,.45),
  stormarrow:c=>ICX.arrow(14,18,-30,.9,PAL.wind[0],PAL.wind[0])+ICX.zap(24,10,20,.5),
  tailwind:c=>ICX.waves(10,16,0,1,PAL.wind[0],3)+ICX.boot(20,20,0,.6)+ICX.up(25,8,.4,PAL.wind[2]),
  lightningrod:c=>ICX.path('M16 30V9',ICC.steel,2.2)+ICX.zap(16,7,0,.6)+ICX.path('M8 30h16',ICC.woodD,1.6),
  hurricaneshot:c=>ICX.spiral(16,15,1.05,PAL.wind[0])+ICX.zap(24,22,0,.45),
  tripleshot:c=>ICX.arrow(12,16,0,.7)+ICX.path('M18 16L28 9M18 16L28 23',c.hi,1.4)+ICX.arrow(10,8,-20,.45)+ICX.arrow(10,24,20,.45),
  deathmark:c=>ICX.skull(13,15,.75,c.hi)+ICX.target(13,15,1,c.r)+ICX.path('M20 18L28 26',c.r,1.4)+ICX.burst(27,25,.35,c.r,6),
  arrowvortex:c=>ICX.dots([[6,24],[16,8],[26,22]],c.r,2.6)+ICX.path('M6 24L16 8L26 22L10 18',c.hi,1.3)+ICX.arrow(10,18,190,.4),
  blasttrap:c=>ICX.trap(16,20,.8)+ICX.burst(16,10,.55,'#ff7a2e')+ICX.trap(6,27,.3)+ICX.trap(26,27,.3),
  netshot:c=>ICX.path('M4 10L28 22M4 22L28 10M10 7V25M16 7V25M22 7V25',c.hi,1)+ICX.dots([[8,16],[16,16],[24,16]],c.r,2.6),
  dominion:c=>ICX.ring(16,22,1.1,c.hi,1)+ICX.trap(16,20,.55)+ICX.up(16,8,.45,c.hi),
  wildsense:c=>ICX.trap(12,22,.6)+ICX.eye(19,11,.7,c.hi)+ICX.arrow(22,20,-30,.45)});

/* ===== 10) 그림(fx31): 새 기술은 1차 같은 원소의 그림을 빌려 쓴다 (새 그림이 오면 짝만 바꿈) ===== */
setTimeout(()=>{try{if(typeof FX31!=='object'||!FX31.M)return;const M=FX31.M,cp=(to,from)=>{if(M[from]&&!M[to])M[to]=Object.assign({},M[from])};
  cp('ignitearrow','flamearrow');cp('firetrail','flamearrow');cp('phoenixarrow','burstarrow');cp('shatterarrow','icearrow');cp('crystalprison','glacialarrow');cp('glacialorb','icearrow');
  cp('stormarrow','quickshot');cp('tailwind','hawkeye');
  delete M.arrowvortex/* 바운싱 스톰은 장판이 아니라 튕기는 화살 — 옛 장판 그림 짝을 뗀다(그림 없으면 직접 그린 선) */}catch(_){}},0);

/* ===== 11) 저장: 모양이 바뀐 여덟 기술의 점수를 한 번 돌려주기 (rs27 · rs34와 같은 방식) ===== */
const REFUND38={archer:A38.refund.slice()};
const rs38Clean=x=>{const o={v:1};if(x&&typeof x==='object'&&!Array.isArray(x)&&x.old&&typeof x.old==='object'&&!Array.isArray(x.old)){const old={};for(const k in x.old){const v=x.old[k]|0;if(v>0&&v<=99)old[k]=v}if(Object.keys(old).length)o.old=old}return o};
function rs38Fix(d){if(!d||typeof d!=='object'||d.rs38||!(d.v>=4)||!d.sk||typeof d.sk!=='object'||!REFUND38[d.cls])return {d,n:0};
  const sk=Object.assign({},d.sk),old={};let n=0;
  for(const id of REFUND38[d.cls]){const v=clamp(sk[id]|0,0,MAXSK);if(v>0){old[id]=v;n+=v}delete sk[id]}
  if(!n)return {d,n:0};
  return {d:Object.assign({},d,{sk,sp:(d.sp|0)+n,rs38:{v:1,old}}),n,old}}
{const _ld=load;load=function(d,slot){a38Clear();const f=rs38Fix(d);const ok=_ld.call(this,f.d,slot);
  if(ok&&P){P.rs38=rs38Clean(f.d&&f.d.rs38);
    if(f.n>0)setTimeout(()=>{msg(`궁수 2차 기술 여덟이 새 모양으로 바뀌었습니다. 찍었던 ${f.n}점을 스킬 포인트로 돌려받았습니다`,'#ffd76a');msg('스킬 트리(T)의 「명궁」 · 「덫과 사냥」 · 새 「원소 궁술」 탭에서 다시 찍으세요','#ffd76a')},900)}
  return ok}}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{if(d&&P)d.rs38=rs38Clean(P.rs38)}catch(err){if(window.__QA)throw err}return d}}

setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{A38,REFUND38,rs38Fix})}catch(_){}},0);
