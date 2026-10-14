/* ---------- v32: 궁수 — 낮은 레벨 유도 화살 · 아주 약한 생명력 흡수 강화 (skill27.js 바로 뒤, b2.js 앞) ----------
   사용자 요청(2026-10-14): 「궁수 타겟팅이 너무 어렵다는 피드백이 있어서 유도화살 스킬이 낮은 레벨에서 찍을 수 있도록 하나 더 있었으면 해.
   그리고 버프로 아주 낮은 수준의 피흡이 되는 스킬을 만들어서 생존력을 보강했으면 좋겠어」
   · 유도 화살: 사격 계열 1단(1레벨부터). 적을 따라 휘어 가는 화살 한 대(b3.js 의 homing 화살과 같은 방식).
     사격보다 약하고(90%) 마나를 2 쓰며 마나를 채우지 않는다 — 맞히기 쉬운 대신 기본 사격을 밀어내지 않게.
     3차 전직의 시킹 샤프트(적 다섯을 차례로 쫓는 큰 한 방)와는 다른, 한 발짜리 기본기.
   · 생명의 화살촉: 덫과 생존 계열 2단(5레벨부터). 준 피해의 1.5%를 생명력으로 흡수(레벨마다 기본 값의 2%씩, 최대 +40% = 2.1%).
     지속 30초, 레벨마다 +30초(최대 300초) — 다른 긴 강화와 같은 규칙. 흡수는 job2.js 의 강화 흡혈(ls)과 같은 길로 들어간다. */
def('archer',1,'homingarrow','유도 화살','Homing Arrow','phys','bolt',2,1,{phys:1,aspd:1,wt:'bow',mult:.9,spd:620,r:5,homing:1},'적을 따라 휘어 날아가는 화살 한 대. 겨누기 어려울 때 씁니다. 사격보다 조금 약하고 마나를 씁니다.');
def('archer',2,'leecharrow','생명의 화살촉','Leech Tip','phys','buff',12,20,{dur:30,ls:.015},'화살촉에 생명을 빨아들이는 힘을 입힙니다. 지속 시간 동안 준 피해의 1.5%만큼 생명력을 되찾습니다(레벨마다 조금씩 늘고, 지속 시간도 길어짐).');
/* 사용자 요청(같은 날): 「연사에 특화된 스킬 라인들도 사격 스킬트리에 추가해줘」
   · 퀵 샷 → 래피드 핸드(3단, 패시브) → 슈팅 리듬(4단, 긴 강화) → 더블 스트림(6단, 짧은 강화)로 이어지는 연사 줄기.
     기본 화살(공격 속도로 쏘는 사격: 퀵 샷 · 호밍 애로우 · 2차 트리플 샷 등)을 빠르게 · 세게 · 두 배로 쏘게 한다.
     2차의 집중(공격 속도 폭발 + 느려짐)·트리플 샷(세 발 이어 쏘기)과 겹치지 않게: 상시 속도 · 연속 명중 피해 · 한 발 더. */
def('archer',3,'rapidhand','빠른 손','Rapid Hand','phys','passive',0,0,{wt:'bow',pv:{ias:[.05,.0075]}},'패시브: 기본 화살(퀵 샷 · 호밍 애로우처럼 공격 속도로 쏘는 사격)의 공격 속도가 오릅니다(1레벨 5%, 레벨마다 +0.75%). 장비·강화와 합쳐 공격 속도 상한 40%까지.');
def('archer',4,'shootrhythm','사격 리듬','Shooting Rhythm','phys','buff',15,20,{dur:30,rh:.02,rhMax:10,rhT:2},'지속 시간 동안 기본 화살이 맞을 때마다 기본 화살 피해가 2%씩 쌓입니다(최대 10겹 = 20%). 2초 동안 못 맞히면 처음부터 다시 쌓입니다.');
def('archer',6,'doublestream','겹화살','Double Stream','phys','buff',25,40,{burst:1,dur:8,ds:.6},'8초 동안 기본 화살을 쏠 때마다 한 발이 더 나갑니다(더 나가는 화살은 60% 위력).');
NAMES_V18.homingarrow=['호밍 애로우',''];NAMES_V18.leecharrow=['라이프 리치',''];NAMES_V18.rapidhand=['래피드 핸드',''];NAMES_V18.shootrhythm=['슈팅 리듬',''];NAMES_V18.doublestream=['더블 스트림','쉬지 마라!'];
for(const id of ['homingarrow','leecharrow','rapidhand','shootrhythm','doublestream']){const s=SPELLS[id],nm=NAMES_V18[id];s.kn=s.n;s.n=nm[0];if(nm[1])s.chant=nm[1]}
TREE_V18.archer[0]=TREE_V18.archer[0].replace('quickshot hawkeye','quickshot hawkeye homingarrow').replace('steadyhand','steadyhand rapidhand shootrhythm doublestream');
LINKS27.archer[0]+=' quickshot>rapidhand rapidhand>shootrhythm shootrhythm>doublestream';
TREE_V18.archer[2]=TREE_V18.archer[2].replace('snaretrap evaderoll','snaretrap evaderoll leecharrow');
/* 친구 피드백(사용자 전달 2026-10-14): 「하늘에서 내리는 에로우 스킬이랑 원소에서 불화살 쏘는거 겹쳐」
   · 사격의 애로우 레인(화살비, 7단)과 원소 사격의 파이어 레인(불화살 비, 5단)이 둘 다 '하늘로 쏘아 올려 3초 동안 넓은 곳에 쏟아지는 화살 비'로
     모양 · 범위 · 지속 · 재사용(16.2초)까지 거의 같았다. 하늘 화살비는 사격 줄기(애로우 레인 → 스카이 볼리)에 남기고,
     원소 쪽은 얼음(블리자드 샷) · 바람(사이클론 애로우)과 같은 「땅에 꽂혀 퍼지는 장판」으로 바꾼다. id는 그대로(찍은 점수 · 단축칸 그대로). */
{const s=SPELLS.firerain;delete s.rate;delete s.srad;Object.assign(s,{kind:'field',mult:.55,rad:170,dur:4,cd:14,n:'타오르는 땅',kn:'타오르는 땅',en:'Blaze Field',
  desc:'불화살을 땅에 꽂아 넓은 곳을 불바다로 만듭니다. 안에 있는 적은 계속 피해를 받고 불탑니다.'})}
