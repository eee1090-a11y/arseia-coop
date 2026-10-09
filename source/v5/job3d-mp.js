/* ---------- v20 (MAGEPRI): 3차 전직 스킬 데이터 — 마법사(대마법사 · 정령왕의 계약자) · 사제(빛의 집행자 · 성자) ----------
   설계: rpg/job-advancement-3/3차전직-컨셉.md 1·3절. job3d.js 바로 뒤(b2.js 앞)에 붙는다. 실행 중 효과는 job3fx-mp.js.
   · def(cls, 20+i, ...) · opts.job3 = 3차 갈래. i = 설계 표 순서(0~10). 열리는 레벨(upLv)·최대 10점·계열(TREE)·칸은 CORE(job3.js)가 정한다.
   · 수치는 스킬 레벨 1 기준. 한 점마다 실제 레벨이 1.2씩 오른다(CORE의 skLv = 1+1.2×(점수-1), 피해 +12%, 더하는 식). 패시브의 레벨당 값은 10점(실제 11.8)에 설명의 값이 되도록.
   · 위계 원칙(설계 1절): 범위 450~550 · 파티 전체 무적·부활 · 보스 무너짐 게이지 · 땅을 바꾸는 장판(잿더미·뒤집힌 땅) · 오래 누를수록 커지는 「모으기」.
   · 2차의 같은 역할 기술보다 기본 배율을 2.5배쯤 두어, 1점일 때 2차 만렙에 가깝고 10점이면 그 두 배를 넘는다.
   · j3spec: 새 효과라 '3차 전직 v20 (마법사·사제)' 묶음에서 따로 점검하는 기술 (qa.js). j3t: 「파티(주변)」/「한 명」/「자신만」 표시(partyui).
   · j3dur: 지속을 레벨에 따라 늘리지 않는다(설계의 초를 그대로). 채널링 · 장판 · 짧은 강화. */
const J3MP_BR=['archsorcerer','spiritking','executor','saint'];
/* ===== 마법사 · 대마법사 (아크메이지에서) ===== */
def('mage',20,'quadorb','원소 사중탄','Elemental Quartet','arcane','bolt',10,.5,{job3:'archsorcerer',mult:1.4,spd:640,r:9,quad:1},'불·얼음·번개·대지 구슬 넷이 차례로 날아갑니다. 불은 태우고, 얼음은 느리게 하고, 번개는 곁의 적에게 튀고, 대지는 잠깐 멈칫하게 합니다. 대마법사의 기본기.');
def('mage',21,'forbiddenlore','금서의 이해','Forbidden Grimoire','arcane','passive',0,0,{job3:'archsorcerer',pv:{j3castCut:[.02,.01667],resonMax:[2,0]}},'금기 마법(이름 앞에 「금기」가 붙은 마법)을 외우는 시간이 줄어듭니다(10점에 20%). 2차 「원소 공명」을 두 번 더 쌓을 수 있습니다(4 → 6중첩). 패시브.');
def('mage',22,'forbidblaze','금기: 불바다','Forbidden: Sea of Flame','fire','field',90,25,{job3:'archsorcerer',mult:4.5,rad:380,dur:10,burn:1,forbid:1,j3dur:1,ash:{dur:8,k:.9}},'주문을 외워(시전 1.5초) 반경 380을 10초 동안 불길로 덮습니다. 다 탄 땅은 잿더미가 되어 8초 동안 그 위의 적이 느려집니다(땅이 바뀜).');
def('mage',23,'elemrelease','원소 해방','Elemental Release','arcane','field',50,30,{job3:'archsorcerer',mult:0,rad:450,dur:15,j3dur:1,j3t:'area',release:{amp:.15},j3spec:1},'15초 동안 반경 450의 원소 장판을 깝니다. 그 안의 적은 원소 약점이 모두 드러나고, 모든 파티원에게서 받는 피해가 15% 늘어납니다(표식은 가장 센 하나만). 장판 안의 파티원에게 「원소 해방」이 표시됩니다.');
def('mage',24,'forbidtide','금기: 대해일','Forbidden: Tidal Wave','ice','wave',110,24,{job3:'archsorcerer',mult:48,len:1100,w:760,spd:950,slow:1,forbid:1,brk:25},'주문을 외워(시전 1.5초) 화면 폭의 물벽을 일으켜 앞쪽 480을 쓸고 지나갑니다. 일반 몬스터는 물벽에 실려 끝까지 밀려 나고, 보스는 멈칫하며 무너짐 게이지가 찹니다.');
def('mage',25,'manaflux','마력 역류','Mana Reflux','arcane','buff',40,60,{job3:'archsorcerer',burst:1,dur:12,j3dur:1,regen:16,party:550,j3cost:.25},'범위: 12초 동안 나와 둘레 파티원의 마나 회복이 크게 늘어납니다(초당 +16, 스킬 레벨마다 더). 그동안 내 금기 마법의 마나 소모가 25% 줄어듭니다. 재사용 60초.');
def('mage',26,'forbidgale','금기: 태풍','Forbidden: Typhoon','storm','gale',120,30,{job3:'archsorcerer',mult:2.2,rad:260,radMax:470,dur:5,j3dur:1,pull:1,forbid:1,charge:{max:5,mul:2.2},boom:{mult:20,stun:1}},'모으기 채널링(최대 5초): 누르는 동안 겨눈 곳의 태풍이 점점 커지며(반경 260 → 470) 적을 가운데로 끌어 모으고 찢습니다. 손을 떼면(또는 5초가 차면) 터지고, 오래 누를수록 터지는 힘이 커집니다(최대 2.2배).');
def('mage',27,'timerift','시간의 틈','Time Rift','arcane','field',60,60,{job3:'archsorcerer',mult:0,rad:320,dur:6,j3dur:1,rift:{k:.5,boss:.25},j3spec:1},'6초 동안 반경 320에 시간의 틈을 엽니다. 그 안의 적은 움직임과 공격이 50% 느려집니다(보스는 25%, 외우는 기술도 느려짐). 재사용 60초.');
def('mage',28,'forbidupheave','금기: 대지 뒤집기','Forbidden: Earth Overturn','earth','strike',140,40,{job3:'archsorcerer',mult:90,rad:450,delay:.35,stun:2,bossStun:.5,brk:45,forbid:1,rubble:{dur:8,k:.85}},'주문을 외워(시전 2초) 반경 450의 땅을 뒤집습니다. 큰 피해와 2초 기절(보스는 0.5초 대신 무너짐 게이지가 크게 참). 뒤집힌 땅은 8초 동안 울퉁불퉁해 적이 느려집니다(땅이 바뀜).');
def('mage',29,'manaclone','마력 분신','Arcane Double','arcane','clone',80,90,{job3:'archsorcerer',mult:0,dur:10,j3dur:1,clone:{k:.5},j3t:'self',j3spec:1},'10초 동안 곁에 마력 분신을 세웁니다. 분신은 내가 쓰는 공격 마법을 그 자리에서 따라 씁니다(피해 절반). 금기 마법·채널링·소환은 따라 하지 않습니다. 재사용 90초.');
def('mage',30,'finalcircle','종언의 원','Circle of Ending','arcane','rain',200,90,{job3:'archsorcerer',mult:18,rad:520,dur:6,j3dur:1,rate:8,srad:60,quad:1,final:{mult:120,stun:1,freeze:1}},'채널링 6초: 반경 520에 불·얼음·번개·대지가 차례로 쏟아집니다. 끝까지 버티면 마지막에 네 원소가 한꺼번에 터집니다(가장 큰 한 방). 재사용 90초.');
/* ===== 마법사 · 정령왕의 계약자 (서머너에서) ===== */
def('mage',20,'pactcommand','계약자의 명령','Pact Command','arcane','bolt',8,.45,{job3:'spiritking',mult:5,spd:720,r:9,focus:4},'가리킨 적에게 마력탄을 쏘고, 4초 동안 모든 소환수가 그 적을 함께 공격하게 합니다. 정령왕의 계약자의 기본기.');
def('mage',21,'kingspact','왕의 계약','King\'s Pact','arcane','passive',0,0,{job3:'spiritking',pv:{petDmg:[.06,.01667],petHp:[.06,.01667],petKinds:[1,0]}},'한꺼번에 부를 수 있는 소환수 종류가 하나 늘고(4 → 5), 모든 소환수의 피해·생명력이 오릅니다(10점에 24%). 패시브.');
def('mage',22,'spiritfusion','정령 융합','Spirit Fusion','arcane','fuse',50,30,{job3:'spiritking',mult:4,dur:25,j3dur:1,j3spec:1},'가까운 소환수 둘을 합쳐 25초 동안 상급 정령 하나로 만듭니다. 상급 정령은 둘의 힘을 합쳐(피해·생명력 1.3배) 불덩이를 쏘고, 맞은 적을 태우고 느리게 하며 곁으로 번개가 튑니다. 소환수가 모자라면 그만큼 약한 상급 정령이 나옵니다.');
def('mage',23,'wardspirit','수호 정령','Guardian Wisp','life','buff',40,20,{job3:'spiritking',dur:30,dr:.04,party:550,guard:{mult:2,iv:10}},'범위 축복: 나와 둘레 파티원 각자에게 작은 정령이 붙습니다. 정령은 그 동료를 때린 적에게 반격하고, 10초마다 한 번 피해를 통째로 막아 줍니다(큰 보호막이 있으면 그쪽이 먼저). 받는 피해도 조금 줄어듭니다. 지속은 스킬 레벨마다 늘어 최대 300초.');
def('mage',24,'spiritchain','정령 사슬','Spirit Chain','storm','spchain',40,14,{job3:'spiritking',mult:1,dur:8,j3dur:1,j3spec:1},'8초 동안 나와 내 소환수들이 번개 사슬로 이어집니다. 사슬 사이를 지나는 적은 계속 감전됩니다. 소환수가 없으면 겨눈 곳 양옆에 작은 정령 둘을 불러 잇습니다.');
def('mage',25,'spiritfrenzy','정령 폭주','Spirit Frenzy','fire','buff',30,45,{job3:'spiritking',burst:1,dur:8,j3dur:1,petSpd:.4,boom:{mult:4,rad:130},j3spec:1},'8초 동안 모든 소환수의 공격·이동이 40% 빨라집니다. 끝날 때 소환수마다 작게 터져 둘레를 태웁니다(소환수는 사라지지 않음).');
def('mage',26,'pactprice','계약의 대가','Price of the Pact','arcane','ward',40,90,{job3:'spiritking',dur:30,heal:.3,inv:1,pact:1,j3t:'self',j3spec:1},'30초 안에 쓰러질 피해를 받으면, 가장 가까운 소환수가 대신 사라지고 나는 생명력 30%로 버팁니다(소환수가 없으면 듣지 않음). 재사용 90초.');
def('mage',27,'spiritreturn','정령 귀환','Spirit Recall','arcane','recall',60,60,{job3:'spiritking',mult:0,j3t:'self',j3spec:1},'쓰러졌거나 사라진 소환수를 재사용 대기 없이 한꺼번에 다시 부릅니다(최근 2분 안에 부른 것). 재사용 60초.');
def('mage',28,'spiritsovereign','원소 군주 소환','Elemental Sovereign','arcane','summon',120,180,{job3:'spiritking',mult:6,dur:30,j3dur:1,hp:10,form:'sovereign',sc:1.8,slam:{iv:1.6,rad:170}},'주문을 마치면(시전 1.5초) 30초 동안 거대한 원소 군주를 부릅니다. 군주는 불·얼음·번개·대지를 돌아가며 둘레를 내려찍습니다. 재사용 3분.');
def('mage',29,'spiritthrone','정령 왕좌','Spirit Throne','arcane','field',60,40,{job3:'spiritking',mult:0,rad:280,dur:12,j3dur:1,throne:{amp:.2,heal:.03},j3spec:1},'정한 자리에 12초 동안 정령의 왕좌를 세웁니다. 왕좌 안의 소환수는 매초 생명력 3%를 되찾고 피해가 20% 오르며, 안에 들어온 적은 느려집니다.');
def('mage',30,'spiritadvent','정령왕 강림','Advent of the Spirit King','arcane','buff',100,180,{job3:'spiritking',burst:1,dur:20,j3dur:1,dmg:.15,petDmg:.3,petSpd:.25,petSize:1.25,advent:1},'주문을 마치면(시전 2초) 20초 동안 내가 정령왕이 됩니다. 내 마법이 네 원소를 모두 띠어(태움·느리게·감전·멈칫, 약점 원소에도 맞음) 피해가 15% 오르고, 모든 소환수가 커지며 피해 30% · 빠르기 25%가 오릅니다. 재사용 3분.');
/* ===== 사제 · 빛의 집행자 (대심문관에서) — 「낙인」 = 2차 「이단 낙인」 등의 표식(받는 피해 증가) ===== */
def('priest',20,'execlance','집행의 창','Executioner\'s Lance','holy','bolt',10,.45,{job3:'executor',mult:1.9,spd:720,r:8,cnt:3,spread:.14,seekBrand:1},'빛의 창 셋을 던집니다. 낙인 찍힌 적이 둘레에 있으면 창이 그쪽을 스스로 쫓아갑니다. 빛의 집행자의 기본기.');
def('priest',21,'execeye','집행자의 눈','Executioner\'s Eye','holy','passive',0,0,{job3:'executor',pv:{brandDmg:[.05,.01389],brandDur:[2,.3333]}},'낙인 찍힌 적에게 주는 피해가 오르고(10점에 +20%, 다른 피해 증가와 더함) 내가 찍는 낙인이 더 오래 갑니다(10점에 +5.6초). 패시브.');
def('priest',22,'heavenwrath','하늘의 노여움','Wrath of Heaven','holy','rain',110,30,{job3:'executor',mult:20,rad:400,dur:6,j3dur:1,rate:10,srad:55,brandAim:.6},'기도를 마치면(시전 1초) 반경 400에 6초 동안 빛이 쏟아집니다. 낙인 찍힌 적이 안에 있으면 빛줄기가 그쪽으로 몰립니다. 언데드에게 두 배.');
def('priest',23,'brandspread','낙인 전파','Brand Burst','holy','brandburst',30,8,{job3:'executor',mult:12,rad:220,brand:{amp:.12,dur:10}},'둘레(600 안)의 낙인 찍힌 적을 모두 터뜨려 그 둘레의 모든 적에게 낙인을 옮깁니다. 낙인 찍힌 적이 없으면 겨눈 곳의 적에게 작은 폭발과 함께 낙인을 찍습니다.');
def('priest',24,'lightchaser','빛의 추적자','Light Chaser','holy','blink',20,10,{job3:'executor',range:650,mult:12,w:44,chase:1},'낙인 찍힌 적(없으면 겨눈 곳) 곁으로 빛이 되어 날아가며 지나는 길의 적을 벱니다. 재사용 10초.');
def('priest',25,'condemnfield','정죄의 결계','Purgatory Barrier','holy','field',50,30,{job3:'executor',mult:0,rad:320,dur:10,j3dur:1,condemn:{heal:.006},j3t:'area',j3spec:1},'10초 동안 반경 320의 결계를 칩니다. 안의 적은 생명력을 되찾지 못하고 언데드·악마는 느려집니다. 결계 안에서 적을 때리는 파티원은 때릴 때마다 생명력이 조금 찹니다.');
def('priest',26,'heavenprison','천상의 감옥','Heavenly Prison','holy','bolt',40,20,{job3:'executor',mult:2,spd:1300,r:10,prison:{dur:3,boss:1.5,burst:.3,brk:40}},'적 하나(보스 포함)를 빛의 감옥에 3초 가둡니다(보스 1.5초). 갇힌 동안 받은 피해의 30%가 풀릴 때 한 번 더 터지고, 보스는 무너짐 게이지가 크게 찹니다.');
def('priest',27,'atonelight','속죄의 빛','Light of Atonement','holy','buff',40,45,{job3:'executor',burst:1,dur:12,j3dur:1,party:550,atone3:{heal:.04},j3spec:1},'범위: 12초 동안 나와 둘레 파티원에게 속죄의 빛이 걸립니다. 그동안 낙인 찍힌 적이 둘레(550 안)에서 쓰러질 때마다 빛을 받은 사람이 생명력 4%(스킬 레벨마다 더)를 되찾습니다.');
def('priest',28,'judgespear','심판의 대창','Lance of Judgment','holy','beam',90,16,{job3:'executor',mult:36,len:1150,w:46,brandBoom:{k:.5,rad:150}},'기도를 마치면(시전 1초) 거대한 빛의 창을 던져 앞쪽 480까지 꿰뚫습니다. 낙인 찍힌 적에 닿으면 그 자리에서 한 번 더 터집니다.');
def('priest',29,'execution','집행','Execution','holy','strike',70,12,{job3:'executor',mult:40,rad:70,delay:.15,exec3:{hp:.2,boss:3}},'기도를 마치면(시전 0.8초) 한 적에게 빛의 칼날을 떨어뜨려 큰 피해를 줍니다. 생명력 20% 아래의 낙인 찍힌 적은 바로 쓰러뜨립니다(보스·준보스는 3배 피해).');
def('priest',30,'heavengate','하늘 문이 열리는 날','The Day Heaven Opens','holy','rain',220,90,{job3:'executor',mult:15,rad:550,dur:5,j3dur:1,rate:14,srad:45,ud:3,udx:1,final:{mult:120,stun:1}},'채널링 5초: 하늘이 열려 반경 550에 빛기둥이 쉬지 않고 내리꽂힙니다. 언데드·악마에게 세 배. 끝까지 버티면 마지막에 가장 큰 빛기둥이 떨어집니다. 재사용 90초.');
/* ===== 사제 · 성자 (대주교에서) — 공격은 여전히 약하다 ===== */
def('priest',20,'sainttouch','성자의 손길','Saint\'s Touch','holy','heal',22,1.5,{job3:'saint',pct:.3,mult:4,target:'one',overShield:{k:.5,cap:.2,dur:8}},'한 사람 대상: 곧바로 크게 치유합니다. 넘친 치유의 절반은 8초짜리 작은 보호막이 됩니다(최대 생명력의 20%까지, 큰 보호막이 있으면 생기지 않음). 성자의 기본기.');
def('priest',21,'stigmata','성흔','Stigmata','holy','passive',0,0,{job3:'saint',pv:{stigma:[.06,.01296]}},'내 생명력이 낮을수록 내가 거는 치유가 늘어납니다(생명력이 바닥일 때 10점에 +20%, 덧셈). 패시브.');
def('priest',22,'martyrprayer','순교의 기도','Martyr\'s Prayer','holy','martyr',30,25,{job3:'saint',mult:0,sac:.25,hmul:3,hpw:3,party:550,j3t:'area',j3spec:1},'내 생명력 25%를 바쳐 둘레(550) 파티원 모두를 크게 치유합니다(바친 양의 3배 + 주문력). 나는 치유받지 않습니다. 둘레에 동료가 없으면 바치지 않습니다.');
def('priest',23,'lightpath','빛의 길','Path of Light','holy','blink',25,12,{job3:'saint',range:650,target:'one',pheal:{pct:.15,mult:2}},'한 사람 대상: 고른 동료 곁으로 순간이동하며 나와 그 동료를 치유합니다(고르지 않았으면 겨눈 곳으로 가며 나만). 재사용 12초.');
def('priest',24,'consecrate','축성','Holy Renewal','holy','consec',40,30,{job3:'saint',mult:0,party:550,heal:.06,j3t:'area',j3spec:1},'범위: 둘레(550) 파티원에게 내가 건 축복의 남은 시간을 처음으로 되돌리고, 해로운 효과를 하나씩 지우며 조금 치유합니다.');
def('priest',25,'graceaccel','은총의 가속','Haste of Grace','holy','buff',30,60,{job3:'saint',burst:1,dur:15,j3dur:1,cdr:.2,regen:8,target:'one'},'한 사람 대상: 15초 동안 그 동료의 재사용 대기가 20% 줄고 마나 회복이 늘어납니다. 재사용 60초.');
def('priest',26,'lifeswap','생명 교환','Life Exchange','holy','lswap',20,30,{job3:'saint',mult:0,target:'one',j3spec:1},'한 사람 대상: 나와 고른 동료의 생명력 비율을 맞바꿉니다(내가 대신 다침). 같이 하기에서 동료를 골라 씁니다. 재사용 30초.');
def('priest',27,'saintmarch','성자의 행진','March of the Saint','holy','field',80,30,{job3:'saint',mult:0,rad:320,dur:8,j3dur:1,self:1,heal:.05,drf:.15,role:'march'},'걸으며 채널링(최대 8초): 나를 따라다니는 빛 안의 파티원이 매초 생명력 5%를 되찾고 받는 피해가 15% 줄어듭니다. 걸으면서 이어 갈 수 있습니다(조금 느려짐).');
def('priest',28,'sanctumfield','성소 펼치기','Holy Ground','holy','field',60,90,{job3:'saint',mult:0,rad:280,dur:10,j3dur:1,sanct:1,j3t:'area',j3spec:1},'정한 자리에 10초 동안 성소를 펼칩니다. 성소 안의 파티원은 해로운 효과(묶임·기절·중독·공포·끌려감)에 걸리지 않습니다. 재사용 90초.');
def('priest',29,'grandrez','대부활','Grand Resurrection','holy','rez',100,300,{job3:'saint',rad:1600,pct:.6,combat:1},'기도를 마치면(시전 2초) 쓰러진 파티원 모두를 전투 중에 생명력 60%로 일으킵니다. 쓰러진 동료가 없으면 마나·재사용이 들지 않습니다. 재사용 5분.');
def('priest',30,'saintmiracle','기적','Miracle','holy','miracle',150,180,{job3:'saint',mult:0,party:700,inv:4,j3t:'area',j3spec:1},'둘레(700) 파티원 모두의 생명력을 가득 채우고 4초 동안 어떤 피해도 받지 않게 합니다. 재사용 3분. (2차 대주교에서 옮겨 온 파티 전체 무적)');
// 시전 시간 · 채널링 (job3fx-mp.js가 CAST_T · CHAN에 넣는다. 모으기 채널링 「금기: 태풍」은 charge로 CORE가 다룬다)
const CAST_T_J3MP={forbidblaze:1.5,forbidtide:1.5,forbidupheave:2,spiritsovereign:1.5,spiritadvent:2,heavenwrath:1,judgespear:1,execution:.8,grandrez:2};
const CHAN_J3MP={finalcircle:{mode:'keep'},heavengate:{mode:'keep'},saintmarch:{mode:'keep',walk:.6}};
// 금기 마법 (금서의 이해 · 마력 역류가 듣는 것)
const J3_FORBID=['forbidblaze','forbidtide','forbidgale','forbidupheave'];
// 화면 이름 · 영창 (2차 NAMES_J2와 같은 방식: 설정 이름은 kn으로 남는다)
const NAMES_J3MP={
  quadorb:['엘리멘탈 쿼텟','카스, 에아셀, 타룬, 도르'],forbiddenlore:['포비든 그리모어',''],forbidblaze:['금기: 씨 오브 플레임','카스 아르 엔테 오르 에온'],
  elemrelease:['엘리멘탈 릴리스','셀 넨, 카스 에아 타룬 도르'],forbidtide:['금기: 타이달 웨이브','에아 오르 아르 엔테 에온'],manaflux:['마나 리플럭스','비엔 로 엔테'],
  forbidgale:['금기: 타이푼','베안 에아 오르 아르 에온'],timerift:['타임 리프트','셀 타이르 시르'],forbidupheave:['금기: 어스 오버턴','도르 아르 넨 엔테 에온'],
  manaclone:['아케인 더블','셀 비엔 파스'],finalcircle:['서클 오브 엔딩','카스 에아셀 타룬 도르, 에온 엔 넨'],
  pactcommand:['팩트 커맨드','실 시르'],kingspact:['킹스 팩트',''],spiritfusion:['스피릿 퓨전','실 엔, 실 아르'],wardspirit:['워드 스피릿','실 비엔 로'],
  spiritchain:['스피릿 체인','실 타룬 벨'],spiritfrenzy:['스피릿 프렌지','실 카스 엔테'],pactprice:['프라이스 오브 팩트','실 넨 바'],spiritreturn:['스피릿 리콜','실 넨 로'],
  spiritsovereign:['엘리멘탈 소버린','카스 에아 타룬 도르, 실 아르 에온'],spiritthrone:['스피릿 스론','실 아르 엔 오르'],spiritadvent:['어드벤트 오브 스피릿 킹','실 아르 에온, 비엔 넨'],
  execlance:['엑서큐셔너 랜스','빛이여, 죄인을 쫓으라'],execeye:['엑서큐셔너 아이',''],heavenwrath:['래스 오브 헤븐','하늘이여, 노하소서'],brandspread:['브랜드 버스트','낙인이여, 번져라'],
  lightchaser:['라이트 체이서','빛이 되어 쫓으리라'],condemnfield:['퍼거토리 배리어','이 결계 안에서 죄는 낫지 못하리라'],heavenprison:['헤븐리 프리즌','빛의 감옥에 갇혀라'],
  atonelight:['라이트 오브 어톤먼트','죄가 스러질 때 우리가 낫게 하소서'],judgespear:['저지먼트 랜스','하늘의 대창이여, 끝까지 꿰뚫으라'],execution:['엑서큐션','집행한다'],
  heavengate:['게이트 오브 헤븐','하늘 문이여, 열려라'],
  sainttouch:['세인트 터치','성자의 손으로 낫게 하소서'],stigmata:['스티그마타',''],martyrprayer:['마터스 프레이어','내 피로 그들을 살리소서'],lightpath:['패스 오브 라이트','빛의 길로 그대에게 가리라'],
  consecrate:['홀리 리뉴얼','은총이여, 처음처럼 새로워지라'],graceaccel:['그레이스 헤이스트','은총이 그대의 걸음을 서두르게 하리라'],lifeswap:['라이프 익스체인지','그대의 상처를 내가 지리라'],
  saintmarch:['세인츠 마치','함께 걸으라, 빛이 앞서 가니'],sanctumfield:['홀리 그라운드','이 땅에서는 어떤 저주도 닿지 못하리라'],grandrez:['그랜드 레저렉션','쓰러진 모두여, 다시 일어나라'],
  saintmiracle:['미라클','기적이여, 우리 모두에게']};
// 다듬기: 화면 이름 · 설정 이름(kn) · 한 사람 대상(one) · 2차와 같은 칸 이름
const J3MP_SPELLS=[];
for(const id in SPELLS){const s=SPELLS[id];if(!s.job3||!J3MP_BR.includes(s.job3))continue;J3MP_SPELLS.push(id);
  s.kn=s.n;const nm=NAMES_J3MP[id];if(nm){s.n=nm[0];if(nm[1])s.chant=nm[1]}
  if(s.target==='one'){s.one=1;s.j3t='one'}}
