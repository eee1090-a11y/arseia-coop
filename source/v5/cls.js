/* ---------- v18: 새 직업 전사(warrior) · 궁수(archer) — 데이터 ----------
   설계: rpg/v18-design/code/v18-classes.js 를 그대로 옮겼다(def 95개 · 화면 이름 · 시전/채널링 · 계열 · 선행).
   names.js 바로 뒤, b2.js(TREE·LINKS·PASSIVES) 앞에 붙는다. 전투·장비·화면 코드는 cls2.js.
   마법사·사제의 기존 데이터는 건드리지 않는다. */
EL.phys='#e8e4d8';ELN.phys='물리';
const PHYS_CLS={warrior:1,archer:1};
// ---- 직업 (b1.js CLASSES 에 추가) ----
const CLASSES_V18={
  warrior:{n:'전사',rankN:r=>`무예 ${r}단`,grade:['훈련병','훈련병','병사','병사','숙련 전사','숙련 전사','기사','기사단장','전설의 용사'],
    desc:'칼과 방패, 혹은 긴 창을 들고 맨 앞에 섭니다. 힘이 오를수록 강해지고, 동료를 지키는 데 능합니다.',
    start:['slash'],hp:1.35,mp:.8,st:{str:16,dex:10,vit:16,spi:8},
    trees:['검과 방패','창술','수호','격노']},
  archer:{n:'궁수',rankN:r=>`사수 ${r}단`,grade:['견습 사수','견습 사수','사수','사수','숙련 사수','숙련 사수','명사수','신궁','전설의 신궁'],
    desc:'멀리서 활을 당깁니다. 민첩이 오를수록 강해지고 잘 맞힙니다. 덫과 사냥 동료, 그리고 몇 가지 원소 화살을 씁니다.',
    start:['quickshot'],hp:1.1,mp:.9,st:{str:10,dex:18,vit:12,spi:10},
    trees:['사격','원소 화살','덫과 생존','사냥']},
};

/* ======================= 전사 ======================= */
// ---- 0 검과 방패: 균형 잡힌 공격 + 방패 막기 ----
def('warrior',1,'slash','베기','Slash','phys','melee',0,1,{phys:1,aspd:1,wt:'melee',mult:1.2,ang:.9,max:1,mhit:2},'무기를 휘둘러 앞의 적 하나를 벱니다. 맞히면 마나가 2 찹니다. 모든 근접 무기로 쓸 수 있는 기본기.');
def('warrior',1,'shieldbash','방패 치기','Shield Strike','phys','melee',8,4,{phys:1,wt:'shield',mult:1,ang:.8,max:1,stun:.8,knock:40},'방패로 후려쳐 적을 0.8초 동안 멈칫하게 합니다. 방패가 있어야 씁니다.');
def('warrior',2,'guardstance','방패 자세','Guard Stance','phys','passive',0,0,{wt:'shield',pv:{blk:[.05,.008]}},'방패를 늘 몸 앞에 둡니다. 패시브: 방패를 들고 있으면 막기 확률이 오릅니다(1레벨 5%, 레벨마다 +0.8%).');
def('warrior',2,'doubleslash','두 번 베기','Twin Cut','phys','melee',8,1.6,{phys:1,wt:'sword',mult:.85,hits:2,hitIv:.15,ang:1,max:2},'검을 빠르게 두 번 휘두릅니다. 한 번에 적 둘까지.');
def('warrior',3,'swordmastery','검술 수련','Blade Discipline','phys','passive',0,0,{wt:'sword',pv:{acc:[8,2],crit:[.02,.003]}},'패시브: 한손검을 들면 명중과 치명타 확률이 오릅니다.');
def('warrior',3,'riposte','받아치기','Riposte','phys','buff',10,16,{burst:1,dur:5,blk:.25,counter:1.2,wt:'shield',excl:'guard'},'5초 동안 막기 확률이 25% 오르고, 막을 때마다 그 적을 되받아 칩니다(무기 피해 120%). 짧은 방어 강화.');
def('warrior',4,'crossslash','십자 베기','Cross Cut','phys','melee',14,3,{phys:1,wt:'sword',mult:2,ang:1.6,max:4},'검으로 열십자를 그어 앞쪽의 적 넷까지 벱니다.');
def('warrior',5,'shieldcharge','방패 돌진','Shield Rush','phys','charge',15,8,{phys:1,wt:'shield',dist:260,w:40,mult:1.6,stun:1,knock:60},'방패를 앞세워 달려가며 길 위의 적을 밀쳐 1초 동안 기절시킵니다. 거리를 좁히거나 빠져나올 때.');
def('warrior',5,'bladedance','칼춤','Blade Waltz','phys','nova',22,6,{phys:1,wt:'sword',mult:2.4,rad:110},'제자리에서 검을 돌리며 1.5초 동안 둘레를 계속 벱니다(채널링: 누르고 있는 동안).');
def('warrior',6,'shieldthrow','돌아오는 방패','Shield Boomerang','phys','chain',18,6,{phys:1,wt:'shield',mult:2.2,jumps:3,stun:.6},'방패를 던져 적 셋을 차례로 치고 손으로 되돌려 받습니다. 맞은 적은 잠깐 멈칫합니다.');
def('warrior',7,'thousandcuts','강철의 소나기','Flurry of Steel','phys','cone',30,6,{phys:1,wt:'sword',mult:1.1,range:150,ang:1.4,hits:4,hitIv:.12},'눈앞을 칼날로 뒤덮어 네 번 연속으로 벱니다(한 번에 무기 피해 110%).');
def('warrior',8,'oathblade','맹세의 검','Oathblade','phys','buff',40,90,{burst:1,dur:12,dmg:.15,wave:.8,wt:'sword'},'12초 동안 피해 15% 증가, 베기마다 검기가 앞으로 날아갑니다(무기 피해 80%). 결정적인 때 쓰는 짧은 강화.');
def('warrior',9,'sunderingstrike','산 가르는 일격','Mountain Splitter','phys','beam',50,14,{phys:1,wt:'sword',mult:9,len:420,w:60,stun:1.2},'잠깐 기를 모았다가(시전 0.6초) 검을 내리그어 앞쪽을 일직선으로 가릅니다.');

// ---- 1 창술: 한 방이 무겁고 느리다, 긴 사거리 ----
def('warrior',1,'thrust','찌르기','Spear Thrust','phys','melee',6,1.2,{phys:1,wt:'polearm',mult:1.5,ang:.35,max:2},'창을 곧게 찔러 일직선의 적 둘까지 꿰뚫습니다.');
def('warrior',2,'sweep','휩쓸기','Wide Sweep','phys','melee',12,3,{phys:1,wt:'polearm',mult:1.3,ang:2.4,max:6,knock:60},'긴 자루로 크게 휩쓸어 앞쪽 반원의 적을 밀어냅니다.');
def('warrior',3,'polearmmastery','장병기 수련','Polearm Discipline','phys','passive',0,0,{wt:'polearm',pv:{pdmg:[.06,.012],acc:[6,1.5]}},'패시브: 창·폴암을 들면 물리 피해와 명중이 오릅니다.');
def('warrior',3,'hook','걸어 당기기','Hook and Pull','phys','cone',10,6,{phys:1,wt:'polearm',mult:.8,range:260,ang:.3,max:1,pull:1,slow:1},'창끝 갈고리로 멀리 있는 적 하나를 끌어당기고 느리게 합니다. 원거리 적이나 도망가는 적에게.');
def('warrior',4,'vault','장대 도약','Pole Vault','phys','leap',15,7,{phys:1,wt:'polearm',range:280,rad:90,mult:1.8,stun:.6},'창을 짚고 뛰어올라 내려앉으며 주변을 찍습니다.');
def('warrior',5,'lungepierce','꿰뚫는 창','Lunge Pierce','phys','beam',18,3,{phys:1,wt:'polearm',mult:3,len:300,w:26},'몸을 날리며 창을 내질러 앞쪽 일직선의 적을 모두 꿰뚫습니다.');
def('warrior',5,'polecircle','장대 돌리기','Pole Circle','phys','nova',26,8,{phys:1,wt:'polearm',mult:3,rad:140,knock:40},'창을 머리 위로 돌려 2초 동안 넓은 둘레를 칩니다(채널링).');
def('warrior',6,'heavycrash','내려찍기','Heavy Crash','phys','strike',26,7,{phys:1,wt:'polearm',mult:5,rad:110,delay:.35,stun:1.2},'창을 높이 들어 땅이 갈라지도록 내려찍습니다. 1.2초 기절.');
def('warrior',7,'dragonfang','용아 연격','Dragon Fang Rush','phys','melee',30,7,{phys:1,wt:'polearm',mult:1,hits:5,hitIv:.12,ang:.3,max:3},'눈에 보이지 않을 만큼 빠르게 다섯 번 찌릅니다. 한 번에 적 셋까지.');
def('warrior',8,'skyfalllance','하늘에서 떨어지는 창','Skyfall Lance','phys','leap',40,14,{phys:1,wt:'polearm',range:360,rad:150,mult:6.5,stun:1.5},'하늘 높이 뛰어올라 창끝으로 떨어집니다. 넓은 범위 1.5초 기절.');
def('warrior',8,'warbanner','전투 깃발','War Banner','phys','field',30,60,{mult:0,rad:200,dur:15,ally:{dmg:.08,ias:.1},role:'banner'},'창에 깃발을 달아 땅에 꽂습니다. 15초 동안 깃발 둘레의 파티원은 피해 8%, 공격 속도 10%가 오릅니다.');
def('warrior',9,'heavenpiercer','하늘 꿰뚫기','Heaven Piercer','phys','beam',55,16,{phys:1,wt:'polearm',mult:9.5,len:600,w:70,knock:120},'온몸의 힘을 실어(시전 0.8초) 창을 내질러, 하늘까지 닿을 듯한 일직선을 꿰뚫습니다.');

// ---- 2 수호: 방어 특화 · 동료 지키기 ----
def('warrior',1,'steelheart','강철 심장','Steel Heart','phys','buff',10,20,{dur:30,hp:.08,dr:.05},'자기 강화. 30초 동안 최대 생명력 8%, 받는 피해 5% 감소(스킬 레벨마다 지속 +30초, 최대 300초).');
def('warrior',2,'taunt','도발의 외침','Challenge','phys','nova',5,8,{mult:0,rad:220,taunt:4},'크게 외쳐 둘레의 적이 4초 동안 나만 노리게 합니다. 파티에서 동료를 지킬 때.');
def('warrior',2,'toughness','단련된 몸','Hardened Body','phys','passive',0,0,{pv:{hp:[.04,.008],dr:[.01,.002]}},'패시브: 최대 생명력과 받는 피해 감소가 조금씩 오릅니다.');
def('warrior',3,'ironwall','강철 벽','Iron Wall','phys','buff',20,60,{burst:1,dur:6,dr:.4,wt:'shield',excl:'guard'},'방패 뒤로 몸을 숨겨 6초 동안 받는 피해 40% 감소. 보스의 큰 공격 직전에. 다른 방어 강화와 겹치지 않습니다.');
def('warrior',3,'provokestrike','도발 일격','Provoking Strike','phys','melee',8,3,{phys:1,wt:'melee',mult:1.4,ang:.9,max:3,threat:4,taunt:2},'적 셋까지 치며 위협을 크게(피해의 4배) 쌓고 2초 동안 나를 노리게 합니다. 몰아 온 몹이 동료에게 가지 않게 붙잡아 둘 때.');
def('warrior',4,'defiance','도전자의 기세','Defiance','phys','buff',10,20,{dur:30,threat:.5,dr:.05,healUp:.1},'30초 동안 내가 쌓는 위협 50% 증가, 받는 피해 5% 감소, 받는 치유 10% 증가(스킬 레벨마다 지속 +30초). 파티에서 앞을 맡을 때 켜 두는 강화.');
def('warrior',4,'guardlink','대신 맞기','Guardian Link','phys','intervene',15,30,{range:300,dur:8,share:.3},'동료 하나와 8초 동안 이어져, 그 동료가 받는 피해의 30%를 내가 대신 받습니다.');
def('warrior',5,'rally','결집의 외침','Rally','phys','buff',20,40,{dur:60,hp:.08,dr:.04,party:450},'60초 동안 나와 파티원의 최대 생명력 8%, 받는 피해 4% 감소(스킬 레벨마다 지속 +30초).');
def('warrior',5,'spikeguard','가시 방어','Spiked Guard','phys','armor',22,20,{mult:.6,dur:20,red:.12},'20초 동안 받는 피해 12% 감소, 나를 때린 적은 가시에 찔립니다(지속 스킬 레벨마다 +30초).');
def('warrior',6,'laststand','마지막 버팀','Last Hold','phys','buff',30,120,{burst:1,dur:5,floor:1,excl:'guard'},'5초 동안 생명력이 1 아래로 떨어지지 않습니다. 재사용 2분.');
def('warrior',6,'stomp','땅 구르기','Ground Stomp','phys','nova',22,12,{phys:1,mult:2,rad:180,stun:1.2,taunt:3},'발을 굴러 둘레의 적을 1.2초 기절시키고 3초 동안 나를 노리게 합니다.');
def('warrior',7,'fortress','요새','Fortress','phys','buff',25,45,{burst:1,dur:20,dr:.25,blk:.15,spd:-.3,excl:'guard'},'20초 동안 받는 피해 25% 감소, 막기 15% 증가. 대신 이동 속도가 30% 느려집니다.');
def('warrior',7,'gathercry','끌어모으는 함성','Gathering Cry','phys','nova',20,25,{mult:0,rad:320,pull:1,taunt:5},'넓게 외쳐 둘레 320 안의 적을 내 쪽으로 끌어당기고 5초 동안 나를 노리게 합니다. 몹을 한데 모아 동료의 범위 마법에 넘길 때.');
def('warrior',8,'standard','수호의 군기','Guardian Standard','phys','field',35,90,{mult:0,rad:200,dur:10,drf:.25,role:'zone'},'군기를 꽂아 10초 동안 그 둘레의 파티원이 받는 피해를 25% 줄입니다. 사제의 방벽 같은 지대와는 겹치지 않고 더 센 쪽만 듭니다.');
def('warrior',9,'undying','꺾이지 않는 뜻','Undying Will','phys','ward',40,180,{dur:30,heal:.4,inv:3,taunt:5},'30초 안에 쓰러질 일격을 한 번 버텨 생명력 40%로 일어서고, 3초 무적과 함께 둘레의 적을 도발합니다. 재사용 3분.');

// ---- 3 격노: 공격 특화 · 치명타와 흡혈 ----
def('warrior',1,'bloodfire','끓는 피','Burning Blood','phys','buff',10,20,{dur:30,dmg:.06},'자기 강화. 30초 동안 피해 6% 증가(스킬 레벨마다 지속 +30초, 피해는 천천히 오름).');
def('warrior',2,'heavyblow','강타','Heavy Blow','phys','melee',12,2,{phys:1,wt:'melee',mult:2.2,ang:.8,max:1,critB:.1},'힘을 실어 한 번 크게 내리칩니다. 치명타 확률 +10%.');
def('warrior',2,'furytraining','전투 호흡','Battle Breath','phys','passive',0,0,{pv:{regen:[1.5,.3]}},'패시브: 싸우는 동안 숨을 고르는 법을 익혀 마나 회복이 늘 오릅니다(1레벨 초당 +1.5, 레벨마다 +0.3).');
def('warrior',3,'leapsmash','도약 강타','Leap Smash','phys','leap',12,6,{phys:1,wt:'melee',range:300,rad:80,mult:1.8},'멀리 뛰어들어 내려치며 주변 적을 칩니다.');
def('warrior',4,'rampage','몰아치기','Rampage','phys','buff',15,30,{burst:1,dur:8,ias:.25},'8초 동안 공격 속도 25% 증가.');
def('warrior',4,'fearhowl','위협의 포효','Fear Howl','phys','nova',15,20,{mult:0,rad:220,weaken:{dmg:.2,dur:8}},'포효해 둘레의 적이 8초 동안 주는 피해를 20% 줄입니다.');
def('warrior',5,'endblow','마무리 일격','End Blow','phys','melee',20,5,{phys:1,wt:'melee',mult:2.5,ang:.8,max:1,exec:{hp:.3,mul:2.5}},'적 하나를 크게 벱니다. 생명력이 30% 아래인 적에게는 2.5배.');
def('warrior',5,'bloodthirst','피의 갈망','Blood Thirst','phys','passive',0,0,{pv:{ls:[1,.15]}},'패시브: 근접 피해의 일부(1레벨 1%, 레벨마다 +0.15%)만큼 생명력을 빨아들입니다.');
def('warrior',6,'ragespin','분노의 회전','Rage Spin','phys','nova',30,10,{phys:1,wt:'melee',mult:3.6,rad:130},'무기를 휘두르며 2초 동안 빙글빙글 돕니다(채널링, 천천히 움직일 수 있음).');
def('warrior',7,'redmist','붉은 안개','Red Mist','phys','buff',25,90,{burst:1,dur:10,dmg:.3,dr:-.15},'10초 동안 피해 30% 증가, 대신 받는 피해 15% 증가.');
def('warrior',8,'groundbreaker','대지 분쇄','Ground Breaker','phys','strike',45,12,{phys:1,wt:'melee',mult:7,rad:160,delay:.3,stun:1.5},'힘을 모아(시전 0.5초) 땅을 내리쳐 넓은 범위를 부숩니다.');
def('warrior',9,'warlordroar','전쟁군주의 포효','Warlord Roar','phys','buff',30,120,{burst:1,dur:12,dmg:.2,ias:.15,party:450},'12초 동안 나와 파티원의 피해 20%, 공격 속도 15% 증가. 보스전의 결정적인 순간에.');

/* ======================= 궁수 ======================= */
// ---- 0 사격 ----
def('archer',1,'quickshot','사격','Quick Shot','phys','bolt',0,1,{phys:1,aspd:1,wt:'bow',mult:1,spd:760,r:5,mhit:1},'화살 한 대를 빠르게 쏩니다. 맞히면 마나가 1 찹니다. 활·석궁 모두 쓰는 기본기.');
def('archer',1,'hawkeye','매의 눈','Eagle Eye','phys','buff',10,20,{dur:30,acc:15,crit:.03},'자기 강화. 30초 동안 명중 +15, 치명타 확률 3% 증가(스킬 레벨마다 지속 +30초).');
def('archer',2,'doubleshot','두 발 쏘기','Twin Arrow','phys','bolt',8,1,{phys:1,wt:'bow',mult:.8,spd:760,r:5,cnt:2,spread:.05},'화살 두 대를 거의 한 줄로 쏩니다.');
def('archer',3,'piercearrow','관통 화살','Piercing Shot','phys','bolt',12,2,{phys:1,wt:'bow',mult:1.8,spd:900,r:6,pierce:1},'일직선의 적을 모두 꿰뚫는 화살.');
def('archer',3,'steadyhand','궁술 수련','Steady Hand','phys','passive',0,0,{wt:'bow',pv:{acc:[10,2],pdmg:[.04,.01]}},'패시브: 명중과 물리 피해가 오릅니다.');
def('archer',4,'fanshot','부채 사격','Fan Shot','phys','bolt',16,3,{phys:1,wt:'bow',mult:.8,spd:720,r:5,cnt:5,spread:.18},'다섯 대를 부채꼴로 흩뿌립니다.');
def('archer',5,'fulldraw','힘껏 당기기','Full Draw','phys','bolt',20,4,{phys:1,wt:'bow',mult:4.5,spd:1000,r:8,pierce:1,knock:80},'활을 끝까지 당겼다가(시전 0.8초) 놓아, 꿰뚫고 밀어내는 한 대를 쏩니다.');
def('archer',5,'streamshot','연사','Stream Shot','phys','bolt',24,8,{phys:1,wt:'bow',mult:.7,spd:800,r:5,cnt:8},'2초 동안 화살 여덟 대를 쉬지 않고 쏩니다(채널링).');
def('archer',6,'ricochet','튕기는 화살','Ricochet','phys','chain',16,2.5,{phys:1,wt:'bow',mult:2,jumps:4},'적에게서 적으로 네 번 튕겨 가는 화살.');
def('archer',7,'arrowrain','화살비','Arrow Rain','phys','rain',35,12,{phys:1,wt:'bow',mult:1.4,rad:160,dur:3,rate:10,srad:36},'하늘로 쏘아 올린 화살이 3초 동안 비처럼 쏟아집니다.');
def('archer',7,'deadeye','정조준','Dead Eye','phys','buff',20,60,{burst:1,dur:8,crit:.25},'8초 동안 치명타 확률 25% 증가. 짧은 강화.');
def('archer',8,'siegeshot','공성 사격','Siege Shot','phys','beam',40,12,{phys:1,wt:'bow',mult:7,len:700,w:30},'성벽도 뚫을 화살을 날려(시전 1초) 긴 일직선을 꿰뚫습니다.');
def('archer',9,'skyvolley','하늘을 덮는 화살','Sky Volley','phys','rain',60,25,{phys:1,wt:'bow',mult:2.2,rad:240,dur:4,rate:14,srad:40},'하늘을 가득 메울 만큼 화살을 쏘아 올립니다(채널링, 누르는 동안 쏟아짐).');

// ---- 1 원소 화살: 불·얼음·번개 세 가지만, 수를 일부러 적게 ----
def('archer',2,'flamearrow','불화살','Flame Shaft','fire','bolt',6,.8,{phys:1,wt:'bow',mult:1.3,spd:700,r:6,burn:1},'불붙은 화살. 맞은 적은 3초 동안 불탑니다.');
def('archer',3,'icearrow','얼음 화살','Frost Shaft','ice','bolt',7,1,{phys:1,wt:'bow',mult:1.1,spd:700,r:6,slow:1,freeze:.6},'맞은 적을 잠깐 얼리고 느리게 합니다.');
def('archer',4,'shockarrow','번개 화살','Storm Shaft','storm','bolt',9,1.2,{phys:1,wt:'bow',mult:1.2,spd:760,r:6,arc:2},'맞으면 번개가 가까운 적 둘에게 튑니다.');
def('archer',5,'elementquiver','원소 화살통','Elemental Quiver','phys','passive',0,0,{pv:{elArrow:[.05,.01]}},'패시브: 원소 화살 계열의 피해가 오릅니다(1레벨 5%, 레벨마다 +1%).');
def('archer',5,'burstarrow','폭발 화살','Burst Shaft','fire','bolt',18,3,{phys:1,wt:'bow',mult:2.6,spd:640,r:7,aoe:100,burn:1},'꽂히는 순간 터져 둘레를 태웁니다.');
def('archer',6,'glacialarrow','서리 폭발 화살','Glacial Shaft','ice','bolt',20,6,{phys:1,wt:'bow',mult:2,spd:640,r:7,aoe:110,freeze:1.5},'터지며 둘레의 적을 1.5초 동안 얼립니다.');
def('archer',7,'thunderarrow','뇌전 화살','Thunder Shaft','storm','strike',26,6,{phys:1,wt:'bow',mult:5,rad:110,delay:.2,stun:.8},'하늘로 쏜 화살이 벼락이 되어 떨어집니다.');
def('archer',8,'imbue','원소 부여','Elemental Imbue','phys','buff',20,30,{dur:30,imbue:.3},'30초 동안 기본 사격에 불·얼음·번개가 번갈아 깃들어 피해가 30% 더해집니다(스킬 레벨마다 지속 +30초).');
def('archer',9,'trinityarrow','삼원소 화살','Trinity Shaft','fire','bolt',50,12,{phys:1,wt:'bow',mult:3.5,spd:620,r:9,cnt:3,spread:.12,aoe:90,tri:1},'잠깐 겨눴다가(시전 0.6초) 불·얼음·번개 화살 세 대를 한꺼번에 쏩니다. 각각 터지며 자기 원소 효과를 남깁니다.');

// ---- 2 덫과 생존 ----
def('archer',1,'snaretrap','올가미 덫','Snare Trap','phys','trap',10,6,{mult:.4,rad:70,arm:.6,life:30,maxN:2,root:2.5},'밟은 적을 2.5초 동안 묶어 둡니다. 동시에 두 개까지.');
def('archer',2,'evaderoll','뒤로 구르기','Evade Roll','phys','blink',8,8,{range:200,back:1},'겨눈 쪽의 반대로 몸을 굴려 거리를 벌립니다.');
def('archer',3,'firetrap','화염 덫','Fire Trap','fire','trap',14,8,{mult:2.4,rad:100,arm:.6,life:30,maxN:3,burn:1},'밟으면 불길이 솟는 덫. 동시에 세 개까지.');
def('archer',4,'nimble','몸놀림','Nimble Step','phys','passive',0,0,{pv:{eva:[.03,.006],spd:[.03,.004]}},'패시브: 공격을 피할 확률과 이동 속도가 조금씩 오릅니다.');
def('archer',4,'caltrops','마름쇠','Caltrops','phys','field',14,12,{mult:.35,rad:110,dur:6,slow:1},'날카로운 쇠를 흩뿌려 6초 동안 그 위의 적을 찌르고 느리게 합니다.');
def('archer',5,'frosttrap','서리 덫','Frost Trap','ice','trap',18,14,{mult:1.2,rad:130,arm:.6,life:30,maxN:2,freeze:2.5},'밟으면 둘레를 2.5초 동안 얼리는 덫.');
def('archer',6,'camouflage','위장','Camouflage','phys','buff',15,40,{burst:1,dur:4,stealth:1,nextShot:.5},'4초 동안 몸을 감춰 적이 나를 놓칩니다. 숨은 채 쏘는 첫 화살은 피해 50% 증가.');
def('archer',6,'shrapneltrap','파편 덫','Shrapnel Trap','phys','trap',24,10,{phys:1,mult:4,rad:150,arm:.8,life:30,maxN:2,knock:100},'밟으면 쇳조각을 사방으로 터뜨리는 덫.');
def('archer',7,'survivor','생존 본능','Survivor','phys','buff',20,75,{burst:1,dur:8,dr:.3,spd:.2,excl:'guard'},'8초 동안 받는 피해 30% 감소, 이동 속도 20% 증가. 다른 방어 강화와 겹치지 않습니다.');
def('archer',8,'trapfield','덫밭','Trap Field','phys','trap',40,25,{phys:1,mult:3,rad:90,arm:.8,life:20,maxN:5,ring:160,cnt:5},'정한 자리 둘레에 화염·파편 덫 다섯 개를 한꺼번에 깔아 둡니다.');
def('archer',9,'beastcage','짐승 우리','Beast Cage','phys','trap',50,40,{phys:1,mult:6,rad:220,arm:1,life:30,maxN:1,root:4,mark:{amp:.15,dur:6}},'거대한 덫. 걸린 적을 4초 묶고(보스는 1.5초), 6초 동안 모든 파티원에게서 받는 피해를 15% 늘립니다.');

// ---- 3 사냥: 표식 · 사냥 동료 · 파티 지원 ----
def('archer',1,'trackmark','추적 표식','Tracker Mark','phys','bolt',5,4,{mult:.3,spd:900,r:6,mark:{amp:.08,dur:10}},'표식 화살. 맞은 적은 10초 동안 모든 파티원에게서 받는 피해가 8% 늘어납니다. 보스에게 먼저 거세요.');
def('archer',2,'falcon','사냥매','Falcon Companion','phys','summon',20,30,{mult:.8,dur:60,hp:1.5,form:'falcon'},'매를 불러 60초 동안 곁에 둡니다. 매는 내가 노리는 적을 쪼고, 표식이 있는 적을 먼저 노립니다.');
def('archer',3,'wolfcall','늑대 동료','Wolf Companion','phys','summon',25,45,{mult:1.2,dur:40,hp:3,form:'wolf',taunt:1},'늑대를 불러 40초 동안 함께 싸웁니다. 늑대는 적을 앞에서 붙잡아 둡니다.');
def('archer',4,'beastbond','짐승과의 유대','Beast Bond','phys','passive',0,0,{pv:{petDmg:[.08,.015],petHp:[.08,.015]}},'패시브: 사냥 동료의 피해와 생명력이 오릅니다.');
def('archer',5,'weakspot','약점 사격','Weak Spot','phys','bolt',15,4,{phys:1,wt:'bow',mult:2.4,spd:900,r:6,markCrit:.5},'급소를 노리는 화살. 표식이 붙은 적에게는 치명타 확률 +50%.');
def('archer',5,'falcondive','매 급강하','Falcon Dive','phys','strike',16,6,{phys:1,mult:3.2,rad:70,delay:.25,stun:1},'매가 하늘에서 내리꽂혀 적을 1초 동안 기절시킵니다(매가 없어도 쓸 수 있음).');
def('archer',6,'huntinghorn','사냥 나팔','Hunting Horn','phys','buff',20,40,{dur:60,spd:.1,crit:.03,party:450},'60초 동안 나와 파티원의 이동 속도 10%, 치명타 확률 3% 증가(스킬 레벨마다 지속 +30초).');
def('archer',7,'predatoreye','포식자의 눈','Predator Eye','phys','buff',20,60,{burst:1,dur:10,markDmg:.2},'10초 동안 표식이 붙은 적과 보스에게 주는 피해 20% 증가. 짧은 강화.');
def('archer',8,'wildrun','짐승 떼 달리기','Wild Run','phys','beam',40,20,{phys:1,mult:5,len:500,w:120,knock:150},'짐승 떼를 불러 앞쪽으로 내달리게 합니다. 길 위의 적을 모두 치고 밀어냅니다.');
def('archer',9,'apexhunt','최후의 사냥','Apex Hunt','phys','strike',50,30,{phys:1,mult:8,rad:120,delay:.5,mark:{amp:.15,dur:12}},'모든 사냥 동료와 함께 한 적을 덮칩니다. 큰 피해와 함께 12초 동안 모든 파티원에게서 받는 피해 15% 증가.');

// ---- 화면 이름 · 외침 (names.js NAMES 와 같은 모양: [표시 이름, 외침]. 빈 외침은 머리 위에 글자를 띄우지 않는다) ----
const NAMES_V18={
  slash:['슬래시',''],shieldbash:['실드 스트라이크',''],guardstance:['가드 스탠스',''],doubleslash:['트윈 컷',''],swordmastery:['블레이드 디서플린',''],
  riposte:['리포스트','받아 주마!'],crossslash:['크로스 컷',''],shieldcharge:['실드 러시','비켜라!'],bladedance:['블레이드 왈츠',''],shieldthrow:['실드 부메랑',''],
  thousandcuts:['플러리 오브 스틸','하앗!'],oathblade:['오스 블레이드','이 검에 맹세한다!'],sunderingstrike:['마운틴 스플리터','갈라져라!'],
  thrust:['스피어 스러스트',''],sweep:['와이드 스윕',''],polearmmastery:['폴암 디서플린',''],hook:['훅 앤 풀','이리 와라!'],vault:['폴 볼트',''],
  lungepierce:['런지 피어스',''],polecircle:['폴 서클',''],heavycrash:['헤비 크래시','부서져라!'],dragonfang:['드래곤 팽 러시','하아앗!'],
  skyfalllance:['스카이폴 랜스','하늘에서!'],warbanner:['워 배너','깃발 아래로!'],heavenpiercer:['헤븐 피어서','꿰뚫어라!'],
  steelheart:['스틸 하트','버틴다!'],taunt:['챌린지','덤벼라!'],toughness:['하드닝',''],ironwall:['아이언 월','한 걸음도 물러서지 않는다!'],
  guardlink:['가디언 링크','내 뒤에 서!'],provokestrike:['프로보킹 스트라이크',''],defiance:['디파이언스','나를 상대해라!'],gathercry:['개더링 크라이','전부 이리 와라!'],rally:['랠리','모여라!'],spikeguard:['스파이크드 가드',''],laststand:['라스트 홀드','아직이다!'],
  stomp:['그라운드 스톰프','이쪽이다!'],fortress:['포트리스','성벽이 되리라!'],standard:['가디언 스탠다드','군기를 지켜라!'],undying:['언다잉 윌','쓰러지지 않는다!'],
  bloodfire:['버닝 블러드','피가 끓는다!'],heavyblow:['헤비 블로',''],furytraining:['배틀 브레스',''],leapsmash:['리프 스매시','받아라!'],
  rampage:['램페이지','더 빨리!'],fearhowl:['피어 하울','크아아!'],endblow:['엔드 블로','끝이다!'],bloodthirst:['블러드 서스트',''],
  ragespin:['레이지 스핀','으아아!'],redmist:['레드 미스트','눈앞이 붉다!'],groundbreaker:['그라운드 브레이커','부숴 버린다!'],warlordroar:['워로드 로어','전군, 돌격!'],
  quickshot:['퀵 샷',''],hawkeye:['이글 아이','보인다.'],doubleshot:['트윈 애로우',''],piercearrow:['피어싱 샷',''],steadyhand:['스테디 핸드',''],
  fanshot:['팬 샷',''],fulldraw:['풀 드로우','숨을 멈추고…'],streamshot:['스트림 샷',''],ricochet:['리코셰',''],arrowrain:['애로우 레인','쏟아져라!'],
  deadeye:['데드아이','놓치지 않는다.'],siegeshot:['시즈 샷','성벽째로!'],skyvolley:['스카이 볼리','하늘을 덮어라!'],
  flamearrow:['플레임 샤프트',''],icearrow:['프로스트 샤프트',''],shockarrow:['스톰 샤프트',''],elementquiver:['엘리멘털 퀴버',''],burstarrow:['버스트 샤프트',''],
  glacialarrow:['글레이셜 샤프트',''],thunderarrow:['썬더 샤프트','벼락이 되어라!'],imbue:['엘리멘털 임뷰','불, 얼음, 번개여.'],trinityarrow:['트리니티 샤프트','셋이 하나로!'],
  snaretrap:['스네어 트랩',''],evaderoll:['이베이드 롤',''],firetrap:['파이어 트랩',''],nimble:['님블 스텝',''],caltrops:['칼트롭',''],
  frosttrap:['아이스 트랩',''],camouflage:['카모플라주',''],shrapneltrap:['샤프넬 트랩',''],survivor:['서바이버','아직 안 끝났어.'],trapfield:['트랩 필드',''],beastcage:['비스트 케이지','걸렸다!'],
  trackmark:['트래커 마크',''],falcon:['팰컨 컴패니언','와라!'],wolfcall:['울프 컴패니언','가자, 친구.'],beastbond:['비스트 본드',''],weakspot:['위크 스팟',''],
  falcondive:['팰컨 다이브',''],huntinghorn:['헌팅 혼','사냥을 시작하자!'],predatoreye:['프레데터 아이',''],wildrun:['와일드 런','달려라!'],apexhunt:['에이펙스 헌트','사냥은 끝났다.'],
};

// ---- 시전 시간 · 채널링 (cast.js CAST_T / CHAN 에 추가) ----
const CAST_T_V18={sunderingstrike:.6,heavenpiercer:.8,groundbreaker:.5,fulldraw:.8,siegeshot:1,trinityarrow:.6};
const CHAN_V18={bladedance:{mode:'tick',dur:1.5,iv:.25},polecircle:{mode:'tick',dur:2,iv:.25},ragespin:{mode:'tick',dur:2,iv:.25,walk:.5},
  streamshot:{mode:'tick',dur:2,ov:{cnt:1}},skyvolley:{mode:'keep'}};

// ---- 계열 (b2.js TREE 의 모양: 계열 번호 → id 목록) ----
const TREE_V18={
  warrior:{0:'slash shieldbash guardstance doubleslash swordmastery riposte crossslash shieldcharge bladedance shieldthrow thousandcuts oathblade sunderingstrike',
    1:'thrust sweep polearmmastery hook vault lungepierce polecircle heavycrash dragonfang skyfalllance warbanner heavenpiercer',
    2:'steelheart taunt toughness provokestrike defiance gathercry ironwall guardlink rally spikeguard laststand stomp fortress standard undying',
    3:'bloodfire heavyblow furytraining leapsmash rampage fearhowl endblow bloodthirst ragespin redmist groundbreaker warlordroar'},
  archer:{0:'quickshot hawkeye doubleshot piercearrow steadyhand fanshot fulldraw streamshot ricochet arrowrain deadeye siegeshot skyvolley',
    1:'flamearrow icearrow shockarrow elementquiver burstarrow glacialarrow thunderarrow imbue trinityarrow',
    2:'snaretrap evaderoll firetrap nimble caltrops frosttrap camouflage shrapneltrap survivor trapfield beastcage',
    3:'trackmark falcon wolfcall beastbond weakspot falcondive huntinghorn predatoreye wildrun apexhunt'}};

// ---- 선행 스킬 (b2.js LINKS 와 같은 형식: 이어지는 성격이 뚜렷한 것끼리만) ----
const LINKS_V18=`
slash>doubleslash doubleslash>crossslash crossslash>thousandcuts thousandcuts>sunderingstrike shieldbash>shieldcharge shieldcharge>shieldthrow bladedance>oathblade
thrust>lungepierce lungepierce>heavenpiercer sweep>polecircle vault>skyfalllance heavycrash>skyfalllance dragonfang>heavenpiercer
taunt>stomp taunt>provokestrike stomp>gathercry ironwall>fortress laststand>undying rally>standard steelheart>rally
heavyblow>endblow leapsmash>groundbreaker ragespin>groundbreaker bloodfire>redmist rampage>warlordroar
quickshot>doubleshot doubleshot>fanshot piercearrow>fulldraw fulldraw>siegeshot fanshot>arrowrain arrowrain>skyvolley streamshot>skyvolley
flamearrow>burstarrow icearrow>glacialarrow shockarrow>thunderarrow burstarrow>trinityarrow glacialarrow>trinityarrow thunderarrow>trinityarrow
snaretrap>frosttrap firetrap>shrapneltrap shrapneltrap>trapfield frosttrap>beastcage
trackmark>weakspot weakspot>apexhunt falcon>falcondive wolfcall>wildrun predatoreye>apexhunt`;
// ---- 끼워 넣기 ----
// CLASSES: 기존 코드(freshPlayer · respec)가 st[0..2]=지능·활력·정신을 읽으므로 그 모양을 맞추고, 다섯 능력치는 st5에 둔다
for(const k in CLASSES_V18){const C=CLASSES_V18[k];CLASSES[k]=Object.assign({},C,{st5:C.st,st:[0,C.st.vit,C.st.spi],
  treeN:k==='warrior'?'무예의 나무':'궁술의 나무',startMsg:k==='warrior'?'헤이븐 수비대에서 막 검을 받은 훈련병으로 길을 나섭니다':'윌로벤 숲 사냥꾼에게서 활을 배운 견습 사수로 길을 나섭니다'})}
// 화면 이름 · 외침 (names.js의 NAMES 반복과 같은 규칙: 설정 이름은 kn으로)
for(const id in NAMES_V18){const s=SPELLS[id],nm=NAMES_V18[id];if(!s)continue;s.kn=s.n;s.n=nm[0];if(nm[1])s.chant=nm[1]}
// 가까이에서 내려찍는 기술은 멀리 떨어뜨리지 않는다(지정 낙하 사거리)
for(const id of ['heavycrash','groundbreaker'])SPELLS[id].near=150;
