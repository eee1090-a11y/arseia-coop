/* ---------- v19 (JOB): 2차 전직 스킬 데이터 (설계: rpg/job-advancement/code/job2-skills.js + job-advancement-3 0·A절) ----------
   skill19.js 바로 뒤, b2.js(PASSIVES) 앞에 붙는다. 실행 중 동작·탭·퀘스트는 job2.js · job2q.js.
   · 50레벨 2차 전직. 직업마다 갈래 둘, 갈래마다 12개(패시브 2). 위계 10~19 = 열리는 레벨 RANK_LV_J2(50~92), 점수 한 점마다 +1레벨(기존 규칙).
   · 모든 2차 스킬은 job2:'갈래'. 그 갈래로 전직한 캐릭터만 찍고 쓴다(job2Ok). 피해는 기존과 같이 더하는 식(곱하는 배율 새로 없음). */
const RANK_LV_J2=[50,53,57,61,65,70,75,80,86,92];
const JOB2_IDS={mage:['archmage','summoner'],priest:['inquisitor','archbishop'],warrior:['guardian','berserker'],archer:['hawkeye','ranger']};
def('mage',10,'prismbolt','프리즘 화살','Prism Bolt','arcane','bolt',8,.4,{job2:'archmage',mult:2.2,spd:640,r:8,prism:1},'쏠 때마다 불(불태움) → 얼음(느리게) → 번개(둘에게 튐) 순서로 바뀌는 마력 화살. 아크메이지의 기본기.');
def('mage',10,'resonance','원소 공명','Elemental Resonance','arcane','passive',0,0,{job2:'archmage',pv:{reson:[.03,.003]}},'앞서 쓴 것과 다른 원소의 마법을 쓸 때마다 피해가 조금씩 오릅니다(최대 4중첩, 8초). 패시브. 다른 피해 증가와 더해지며 상한 안에서만 듭니다.');
def('mage',11,'steamburst','증기 폭발','Steam Burst','ice','strike',30,6,{job2:'archmage',mult:5,rad:120,delay:.2,shatter:2},'불과 얼음을 한 점에서 부딪쳐 터뜨립니다. 얼거나 느려진 적은 두 배 피해.');
def('mage',12,'magmafield','용암 들판','Magma Field','fire','field',40,14,{job2:'archmage',mult:.9,rad:150,dur:6,burn:1,slow:1},'땅을 녹여 6초 동안 용암 바닥을 깝니다. 밟은 적은 타고 느려집니다.');
def('mage',13,'frostchain','서리 번개 사슬','Frostbolt Chain','storm','chain',34,4,{job2:'archmage',mult:3.2,jumps:6,freeze:.6},'얼음을 품은 번개가 적 여섯을 튀며 잠깐씩 얼립니다.');
def('mage',14,'elempierce','원소 관통','Elemental Pierce','arcane','passive',0,0,{job2:'archmage',pv:{bossDmg:[.04,.004]}},'준보스·보스에게 주는 마법 피해가 오릅니다. 패시브. 덧셈 칸에 더해집니다.');
def('mage',14,'elembarrier','원소 방벽','Elemental Barrier','arcane','shield',40,30,{job2:'archmage',mult:5,flat:60,dur:12,retort:1,excl:'selfshield'},'12초 동안 피해를 흡수하는 자기 보호막. 마지막으로 쓴 원소에 따라 때린 적을 태우거나 얼리거나 감전시킵니다.');
def('mage',15,'overload','마력 과부하','Arcane Overload','arcane','buff',30,120,{job2:'archmage',burst:1,dur:15,dmg:.2,cdr:.15},'15초 동안 피해 20% 증가, 재사용 대기 15% 감소. 재사용 2분. 결정적인 때만.');
def('mage',16,'meteorswarm','유성 떼','Meteor Swarm','fire','rain',70,20,{job2:'archmage',mult:2.6,rad:220,dur:4,rate:8,srad:55,burn:1},'누르고 있는 동안(채널링) 작은 운석이 넓은 땅에 쏟아집니다. 1차 「하늘불」이 이 스킬로 합쳐졌습니다.');
def('mage',17,'collapse','원소 붕괴','Elemental Collapse','arcane','bolt',30,10,{job2:'archmage',mult:1.5,spd:700,r:9,collapse:{need:4,mult:8,rad:140,dur:8}},'적에게 붕괴의 표식을 붙입니다. 8초 안에 불·얼음·번개·대지 네 원소를 모두 맞히면 크게 폭발합니다.');
def('mage',18,'absolutezero','절대 영도','Absolute Zero','ice','nova',90,30,{job2:'archmage',mult:9,rad:320,freeze:4},'주문을 외워(시전 1.2초) 둘레 넓은 곳을 4초 동안 완전히 얼립니다(보스는 1.5초).');
def('mage',19,'testament','원소의 유언','Arch Testament','arcane','strike',120,60,{job2:'archmage',mult:16,rad:260,delay:1,burn:1,freeze:1.5,stun:1.5},'네 원소를 한꺼번에 불러(시전 1.5초) 한 곳에 떨어뜨리는 아크메이지 최후의 마법. 재사용 60초.');
def('mage',10,'fireelem','불꽃 정령','Fire Elemental','fire','summon',25,4,{job2:'summoner',mult:1.6,dur:60,hp:1.5,form:'fireelem',ranged:1},'불덩이를 쏘는 불꽃 정령을 60초 동안 부릅니다. 서머너의 기본 소환수.');
def('mage',10,'pactmark','계약의 각인','Mark of the Pact','arcane','passive',0,0,{job2:'summoner',pv:{petDmg:[.06,.012],petHp:[.06,.012]}},'모든 소환수의 피해와 생명력이 오릅니다. 패시브.');
def('mage',11,'frostgolem','서리 골렘','Frost Golem','ice','summon',35,8,{job2:'summoner',mult:1.8,dur:60,hp:4,form:'golem',tint:'ice',slowHit:1},'느리지만 단단한 얼음 골렘. 맞은 적이 느려집니다.');
def('mage',12,'stormhawk','폭풍 매','Storm Hawk','storm','summon',30,6,{job2:'summoner',mult:1.4,dur:60,hp:1.2,form:'falcon',tint:'storm',fly:1,chain:2},'하늘을 날며 적을 쫓아 번개를 떨굽니다. 번개는 둘에게 튑니다.');
def('mage',13,'stonetitan','바위 거인','Stone Titan','earth','summon',50,30,{job2:'summoner',mult:2.2,dur:45,hp:6,form:'golem',tint:'stone',sc:1.4,taunt:3,tauntIv:6},'몸집 큰 바위 거인. 6초마다 둘레의 일반 몬스터를 3초 도발합니다(보스는 안 끌림). 혼자나 둘이 다닐 때의 방패. 1차 「돌 수호자」가 이 스킬로 합쳐졌습니다.');
def('mage',14,'affinity','정령 친화','Spirit Affinity','life','passive',0,0,{job2:'summoner',pv:{petRegen:[.8,.16]}},'불러 둔 소환수 하나마다 마나 회복이 오릅니다(최대 4마리분). 패시브.');
def('mage',14,'communion','정령 교감','Spirit Communion','arcane','buff',30,30,{job2:'summoner',dur:30,petDmg:.15,petSpd:.2},'소환수 모두의 피해 15%, 이동·공격 속도 20% 증가. 지속은 스킬 레벨마다 +30초(최대 300초).');
def('mage',15,'spiritburst','정령 폭발','Spirit Burst','fire','detonate',30,10,{job2:'summoner',mult:7,rad:160},'가장 가까운 소환수 하나를 터뜨려 둘레에 큰 피해를 줍니다. 그 소환수는 재사용 없이 다시 부를 수 있습니다.');
def('mage',16,'summoncircle','소환진','Summoning Circle','arcane','field',60,30,{job2:'summoner',mult:0,rad:90,dur:10,spawn:{form:'wisp',iv:2,mult:.9,hp:.4,dur:8,max:4}},'바닥에 소환진을 그립니다. 10초 동안 2초마다 작은 정령이 나와 8초 동안 싸웁니다.');
def('mage',17,'swapplace','자리 바꾸기','Spirit Swap','arcane','blink',15,12,{job2:'summoner',swap:1},'가리킨(없으면 가장 먼) 소환수와 내 자리를 바꿉니다. 위험에서 빠질 때.');
def('mage',18,'phoenix','불사조','Phoenix','fire','summon',80,60,{job2:'summoner',mult:3,dur:60,hp:2.5,form:'firebird',sc:1.5,fly:1,rebirth:1},'날아다니며 불을 뿌리는 불사조. 쓰러지면 한 번 불길 속에서 되살아납니다.');
def('mage',19,'spiritlegion','정령 군단','Spirit Legion','arcane','summon',100,90,{job2:'summoner',legion:['fireelem','frostgolem','stormhawk'],dur:20,amp:.4},'주문을 마치면(시전 1.5초) 불꽃 정령·서리 골렘·폭풍 매를 한꺼번에 20초 동안 불러냅니다. 이 셋은 피해·생명력이 40% 더 셉니다(배운 레벨이 없는 소환수는 정령 군단의 레벨로). 재사용 90초.');
def('priest',10,'lightvolley','빛의 창 연발','Lance Volley','holy','bolt',8,.45,{job2:'inquisitor',mult:2.2,spd:680,r:8,cnt:2,spread:.12},'빛의 창 둘을 빠르게 던집니다. 대심문관의 기본기.');
def('priest',10,'conviction','확신','Conviction','holy','passive',0,0,{job2:'inquisitor',pv:{holyDmg:[.03,.004]}},'심판·퇴마 계열과 대심문관 기도의 피해가 천천히 오릅니다(20레벨에 +11%). 패시브.');
def('priest',11,'heresybrand','이단 낙인','Brand of Heresy','holy','bolt',12,4,{job2:'inquisitor',mult:1.2,spd:800,r:7,mark:{amp:.12,dur:10}},'낙인을 찍습니다. 10초 동안 그 적은 모든 파티원에게서 받는 피해가 12% 늘어납니다(표식은 가장 센 것 하나만).');
def('priest',12,'purgefire','정죄의 불꽃','Purging Flame','holy','bolt',24,5,{job2:'inquisitor',mult:1.6,spd:560,r:9,burn:1,burnMul:2,spreadMarked:1},'오래 타는 성화를 붙입니다. 낙인 찍힌 적이 타면 둘레의 적에게 불이 옮겨붙습니다.');
def('priest',13,'judgechain','심판의 사슬','Chains of Judgment','holy','chain',34,10,{job2:'inquisitor',mult:2.6,jumps:5,pull:1,root:1.5},'빛의 사슬이 적 다섯을 이어 끌어당기고 1.5초 묶습니다.');
def('priest',14,'penitence','정죄의 은혜','Grace of Penance','holy','passive',0,0,{job2:'inquisitor',pv:{hitHeal:[.004,.0006]}},'공격 기도가 적에게 맞으면(한 번 시전에 한 번) 내 생명력이 조금 회복됩니다(20레벨에 1.5%). 혼자 다니기 위한 패시브.');
def('priest',14,'confessbell','고해의 종','Bell of Confession','holy','nova',40,14,{job2:'inquisitor',mult:3,rad:200,stun:1.8},'커다란 종소리로 둘레의 적을 1.8초 기절시킵니다.');
def('priest',15,'inqarmor','심문관의 갑주','Inquisitor\'s Mail','holy','shield',40,40,{job2:'inquisitor',mult:5,flat:60,dur:12,excl:'selfshield'},'12초 동안 피해를 흡수하는 자기 전용 갑주. 다른 사람에게는 걸 수 없고, 내 다른 보호막과 겹치면 더 센 쪽만 듭니다.');
def('priest',16,'holyflame','성화 폭풍','Sacred Fire Storm','holy','beam',60,12,{job2:'inquisitor',mult:7,len:420,w:60,burn:1},'누르고 있는 동안(채널링 2초) 앞쪽으로 성화를 뿜습니다.');
def('priest',17,'finalverdict','마지막 판결','Final Verdict','holy','strike',40,8,{job2:'inquisitor',mult:6,rad:60,delay:.15,exec:{below:.3,mult:2.5}},'한 적에게 판결을 내립니다. 생명력이 30% 아래인 적은 2.5배.');
def('priest',18,'heavenblades','천벌의 검','Blades of Heaven','holy','rain',90,25,{job2:'inquisitor',mult:3.2,rad:200,dur:2.5,rate:10,srad:50},'기도를 마치면(시전 1초) 하늘에서 빛의 검이 쏟아집니다. 1차 「천 개의 빛창」이 이 스킬로 합쳐졌습니다.');
def('priest',19,'grandverdict','최후의 대심판','Grand Verdict','holy','nova',130,60,{job2:'inquisitor',mult:14,rad:420,ud:3},'긴 기도 끝에(시전 1.5초) 둘레 넓은 곳을 심판합니다. 언데드·악마에게 세 배. 재사용 60초.');
def('priest',10,'grandblessing','대축복','Grand Blessing','holy','buff',30,20,{job2:'archbishop',dur:30,dr:.06,hp:.08,party:550},'범위 축복: 나와 둘레 파티원의 받는 피해 6% 감소, 생명력 8% 증가. 지속은 스킬 레벨마다 +30초(최대 300초).');
def('priest',10,'graceamp','은총 증폭','Amplified Grace','holy','passive',0,0,{job2:'archbishop',pv:{healAmp:[.04,.006]}},'내 치유량과 보호막량이 오릅니다(20레벨에 +15%). 패시브.');
def('priest',11,'gracelink','은총 전이','Grace Link','holy','link',25,30,{job2:'archbishop',target:'one',dur:20,share:.4},'한 사람 대상: 20초 동안 그 동료와 이어져, 내가 나에게 쓰는 치유의 40%가 그 동료에게도 갑니다.');
def('priest',12,'lifespring','생명의 샘','Wellspring of Life','holy','field',36,20,{job2:'archbishop',mult:0,rad:120,dur:10,heal:.04,role:'spring'},'정한 자리에 10초 동안 샘을 둡니다. 그 안의 파티원이 천천히 낫습니다. 나를 따라오는 「치유의 원」과 달리 자리를 지킵니다.');
def('priest',13,'chainheal','연쇄 치유','Chain Healing','holy','heal',34,6,{job2:'archbishop',pct:.22,mult:1.8,jumps:4,decay:.8,role:'chain'},'다친 동료 사이를 튀며 넷까지 치유합니다. 튈 때마다 20%씩 줄어듭니다.');
def('priest',14,'hymnecho','성가의 울림','Echoing Hymn','holy','passive',0,0,{job2:'archbishop',pv:{blessRegen:[.6,.12]}},'내 축복이 걸린 파티원 한 명마다 마나 회복이 오릅니다(최대 3명분). 패시브.');
def('priest',14,'purifyhand','정화의 손','Hand of Purification','holy','cleanse',15,12,{job2:'archbishop',target:'one',immune:3},'한 사람 대상: 해로운 효과(묶임·느려짐·중독·불태움·공포)를 지우고 3초 동안 다시 걸리지 않게 합니다.');
def('priest',15,'sanctum','성역 결계','Sanctum Barrier','holy','shield',60,90,{job2:'archbishop',mult:6,flat:80,dur:10,party:550,excl:'bigshield'},'범위: 나와 둘레 파티원에게 10초짜리 큰 보호막. 다른 큰 보호막(신성 방패·아이기스 등)과 겹치지 않고 더 센 쪽만 듭니다. 재사용 90초.');
def('priest',16,'lightwings','빛의 날개','Wings of Light','holy','buff',25,45,{job2:'archbishop',burst:1,dur:6,spd:.3,party:550},'범위: 6초 동안 나와 파티원의 이동 속도 30% 증가. 보스의 큰 기술을 피할 때.');
def('priest',17,'archhymn','대주교의 성가','Archbishop\'s Hymn','holy','field',70,60,{job2:'archbishop',mult:0,rad:240,dur:6,heal:.08,mana:.03,self:1,drf:.1,cleanse:1,role:'hymn2'},'누르고 있는 동안(채널링 6초) 둘레 파티원을 치유하고 마나도 채우며, 받는 피해를 10% 줄이고 해로운 효과를 지웁니다. 1차 「헤븐리 코랄(신성한 찬가)」이 이 스킬로 합쳐졌습니다.');
def('priest',18,'battlerez','전장의 부활','Battlefield Resurrection','holy','rez',80,180,{job2:'archbishop',rad:300,hp:.5,combat:1},'기도를 마치면(시전 1초) 전투 중에도 쓰러진 동료를 생명력 절반으로 일으킵니다. 재사용 3분.');
def('priest',19,'crownofblessing','축복의 왕관','Crown of Blessings','holy','buff',80,180,{job2:'archbishop',burst:1,dur:30,spreadOne:1,party:550},'30초 동안 내가 한 사람에게 거는 축복·보호막이 둘레 파티원 모두에게 함께 걸립니다. 재사용 3분. (파티 전체 무적 「기적」은 3차 성자의 몫)');
def('warrior',10,'ironflesh','강철 육체','Iron Flesh','phys','passive',0,0,{job2:'guardian',pv:{dr:[.02,.002]}},'받는 피해가 줄어듭니다(20레벨에 5.8%). 기존 피해 감소 상한 안에서. 패시브.');
def('warrior',10,'grandtaunt','대도발','Grand Challenge','phys','nova',10,6,{job2:'guardian',phys:1,mult:1.5,rad:300,taunt:5},'넓은 범위의 적을 치고 5초 동안 나만 노리게 합니다. 재사용 6초.');
def('warrior',11,'chainpull','사슬 끌기','Chain Hook','phys','bolt',12,6,{job2:'guardian',phys:1,mult:2,spd:900,r:8,hook:1,taunt:4},'사슬을 던져 맞은 적을 내 앞으로 끌어오고 4초 도발합니다. 보스·준보스는 끌려오지 않고 도발만 됩니다.');
def('warrior',12,'shieldwall','방패 성벽','Shield Wall','phys','buff',25,25,{job2:'guardian',wt:'shield',burst:1,dur:6,blockRanged:1,arc:1.6},'6초 동안 방패를 세워 내 앞쪽 부채꼴로 날아오는 화살·마법 탄을 막습니다. 뒤에 선 동료도 지켜집니다.');
def('warrior',13,'guardrush','수호 돌진','Guardian Rush','phys','charge',20,20,{job2:'guardian',target:'one',rushAlly:1,range:450,shield:{mult:2.5,flat:40,dur:5},taunt:3,rad:200},'한 사람 대상: 그 동료에게 달려가 나와 동료 둘 다 5초짜리 보호막을 두르고, 둘레 적을 3초 도발합니다. 1차 「대신 맞기」와 달리 피해를 나누지 않고 빠르게 끼어드는 기술.');
def('warrior',14,'guardianoath','수호자의 맹세','Guardian\'s Oath','phys','passive',0,0,{job2:'guardian',pv:{threat:[.15,.03]}},'내 공격이 쌓는 위협이 늘어납니다. 패시브.');
def('warrior',14,'retaliation','반격 오라','Retaliation Aura','phys','buff',20,30,{job2:'guardian',dur:30,thorns:.3},'나를 때린 적에게 받은 피해의 30%를 되돌려 줍니다. 지속은 스킬 레벨마다 +30초(최대 300초).');
def('warrior',15,'steadfast','굳건한 발걸음','Steadfast','phys','buff',15,40,{job2:'guardian',burst:1,dur:6,ccImmune:1},'6초 동안 밀치기·기절·묶임에 걸리지 않습니다.');
def('warrior',16,'commandshout','지휘관의 외침','Commander\'s Shout','phys','buff',25,30,{job2:'guardian',dur:30,dr:.06,threatDown:.3,party:450},'범위: 파티원의 받는 피해 6% 감소, 파티원이 쌓는 위협 30% 감소(나는 그대로). 지속은 스킬 레벨마다 +30초.');
def('warrior',17,'bulwark','성벽 구역','Bulwark','phys','field',40,60,{job2:'guardian',mult:0,rad:180,dur:12,self:1,drf:.15,role:'zone'},'12초 동안 나를 따라다니는 구역. 그 안의 파티원이 받는 피해 15% 감소. 「수호의 군기」·사제 방벽과 겹치지 않고 더 센 쪽만 듭니다.');
def('warrior',18,'citadel','불굴의 성채','Unyielding Citadel','phys','buff',40,180,{job2:'guardian',burst:1,dur:10,dr:.5,excl:'guard'},'10초 동안 받는 피해 50% 감소. 강철 벽·요새와 같은 무리라 동시에 하나만. 재사용 3분.');
def('warrior',19,'lastbastion','최후의 보루','Last Bastion','phys','ward',50,180,{job2:'guardian',dur:30,heal:.3,inv:2,taunt:8,tauntRad:400},'30초 안에 쓰러질 일격을 한 번 버텨 생명력 30%로 일어서고, 2초 무적과 함께 둘레 넓은 곳의 적을 8초 도발합니다. 「꺾이지 않는 뜻」과 같이 걸려도 하나만 발동. 재사용 3분.');
def('warrior',10,'crushcombo','분쇄 연격','Crushing Combo','phys','melee',6,1.2,{job2:'berserker',phys:1,wt:'melee',mult:1.4,hits:3,hitIv:.15,max:2,mhit:2},'세 번 이어 칩니다. 한 번에 둘까지. 버서커의 기본기.');
def('warrior',10,'bloodlust','피의 갈증','Bloodlust','phys','passive',0,0,{job2:'berserker',pv:{lowIas:[.1,.01]}},'생명력이 낮을수록 공격 속도가 오릅니다(생명력 30% 이하에서 최대, 20레벨에 +29%). 공격 속도 합계 상한 안에서. 패시브.');
def('warrior',11,'whirlslash','회오리 베기','Whirlwind Slash','phys','nova',30,8,{job2:'berserker',phys:1,wt:'melee',mult:2.2,rad:150,pullIn:1},'누르고 있는 동안(채널링 2초) 제 속도로 걸으며 돕니다. 「분노의 회전」과 달리 걸음이 느려지지 않고, 둘레 적을 안으로 끌어들입니다.');
def('warrior',12,'thunderdrop','낙뢰 강하','Thunder Drop','phys','leap',22,7,{job2:'berserker',phys:1,wt:'melee',range:400,rad:170,mult:5,stun:1},'멀리 뛰어올라 벼락처럼 내려찍습니다. 1초 기절.');
def('warrior',13,'bloodfrenzy','피의 광란','Blood Frenzy','phys','buff',20,45,{job2:'berserker',burst:1,dur:10,ls:.08,dr:-.1},'10초 동안 준 피해의 8%를 생명력으로 흡수하지만 받는 피해가 10% 늘어납니다.');
def('warrior',14,'weaponmastery','무기 숙련','Weapon Mastery','phys','passive',0,0,{job2:'berserker',pv:{crit:[.02,.002]}},'치명타 확률이 오릅니다(20레벨에 5.8%). 패시브.');
def('warrior',14,'rend','상처 찢기','Rend','phys','melee',18,4,{job2:'berserker',phys:1,wt:'melee',mult:2.5,bleed:{mult:.6,dur:6}},'베어 상처를 찢습니다. 6초 동안 출혈.');
def('warrior',15,'terrorroar','공포의 포효','Roar of Terror','phys','nova',20,25,{job2:'berserker',mult:0,rad:250,fear:2.5},'둘레의 일반 몬스터가 2.5초 동안 겁에 질려 달아납니다(보스·준보스는 안 걸림).');
def('warrior',16,'execute','처형','Execute','phys','melee',30,10,{job2:'berserker',phys:1,wt:'melee',mult:5,exec:{below:.25,mult:2},killReset:1},'한 적을 크게 벱니다. 생명력 25% 아래면 두 배. 이걸로 쓰러뜨리면 재사용이 바로 풀립니다.');
def('warrior',17,'battletrance','전투 망각','Battle Trance','phys','buff',20,40,{job2:'berserker',burst:1,dur:6,ccImmune:1,ias:.15},'6초 동안 기절·둔화·묶임을 무시하고 공격 속도 15% 증가.');
def('warrior',18,'myriadslash','천 갈래 베기','Myriad Slash','phys','cone',60,18,{job2:'berserker',phys:1,wt:'melee',mult:2.2,hits:5,hitIv:.12,range:240,ang:1.8},'숨을 고르고(시전 0.5초) 앞쪽 넓은 곳을 다섯 번 연속으로 벱니다.');
def('warrior',19,'avatarofwar','전쟁의 화신','Avatar of War','phys','buff',60,180,{job2:'berserker',burst:1,dur:20,dmg:.25,ias:.2,ls:.05,size:1.3},'20초 동안 몸이 커지며 피해 25%, 공격 속도 20%, 흡혈 5% 증가. 강화 피해 상한(50%) 안에서. 재사용 3분.');
def('archer',10,'tripleshot','연속 사격','Triple Shot','phys','bolt',6,1,{job2:'hawkeye',phys:1,wt:'bow',aspd:1,mult:1,hits:3,hitIv:.1,spd:900,r:6,mhit:1},'세 발을 빠르게 이어 쏩니다. 호크아이의 기본기.');
def('archer',10,'farsight','먼 시야','Far Sight','phys','passive',0,0,{job2:'hawkeye',pv:{range:[.05,.01],acc:[5,1]}},'화살 사거리와 명중이 오릅니다. 패시브.');
def('archer',11,'pierceblow','관통 일격','Piercing Blow','phys','beam',20,4,{job2:'hawkeye',phys:1,wt:'bow',mult:4,len:640,w:24},'일직선의 모든 적을 꿰뚫는 한 발.');
def('archer',12,'snipe','저격','Snipe','phys','bolt',35,8,{job2:'hawkeye',phys:1,wt:'bow',mult:9,spd:1400,r:8},'숨을 멈추고(시전 1초) 한 적에게 큰 한 발.');
def('archer',13,'splitarrow','분열 화살','Splitting Arrow','phys','bolt',22,3,{job2:'hawkeye',phys:1,wt:'bow',mult:2.4,spd:700,r:8,split:{n:5,mult:.8}},'맞으면 다섯 갈래로 갈라져 둘레로 퍼집니다.');
def('archer',14,'weakpoint','약점 간파','Weak Point','phys','passive',0,0,{job2:'hawkeye',pv:{farCrit:[.04,.006]}},'멀리 있는 적일수록 치명타 확률이 오릅니다(500 거리에서 최대, 20레벨에 15%). 패시브.');
def('archer',14,'elemrain','원소 화살비','Elemental Rain','phys','rain',45,14,{job2:'hawkeye',phys:1,wt:'bow',mult:1.6,rad:200,dur:3,rate:10,srad:44,tri:1},'불·얼음·번개 화살을 비처럼 쏟습니다. 화살마다 자기 원소 효과.');
def('archer',15,'focus','집중','Focus','phys','buff',20,45,{job2:'hawkeye',burst:1,dur:10,ias:.3,spd:-.3},'10초 동안 공격 속도 30% 증가, 이동 속도 30% 감소.');
def('archer',16,'backshot','물러나며 쏘기','Retreating Shot','phys','blink',18,8,{job2:'hawkeye',range:220,back:1,shot:{mult:3,cnt:3,spread:.25}},'뒤로 뛰며 앞쪽에 화살 셋을 부채꼴로 쏩니다.');
def('archer',17,'deathmark','죽음의 표식','Mark of Death','phys','bolt',15,12,{job2:'hawkeye',mult:.5,spd:900,r:7,mark:{amp:.15,dur:12}},'12초 동안 그 적은 모든 파티원에게서 받는 피해가 15% 늘어납니다(표식은 가장 센 것 하나만).');
def('archer',18,'arrowvortex','화살 회오리','Arrow Vortex','phys','field',80,25,{job2:'hawkeye',phys:1,wt:'bow',mult:1.4,rad:180,dur:4,pull:1},'쏜 자리에 4초 동안 화살 소용돌이를 일으켜 둘레 적을 안으로 끌어 모으며 벱니다(보스는 안 끌림).');
def('archer',19,'heavenbow','천궁','Bow of Heaven','phys','beam',110,60,{job2:'hawkeye',phys:1,wt:'bow',mult:16,len:1000,w:80,knock:200},'하늘의 활을 당겨(시전 1.2초) 멀리 일직선을 꿰뚫는 빛의 화살을 쏩니다. 재사용 60초.');
def('archer',10,'blasttrap','폭발 덫','Blast Trap','phys','trap',10,1.5,{job2:'ranger',phys:1,mult:3,rad:110,arm:.4,life:30,maxN:3},'빨리 켜지는 작은 폭발 덫. 동시에 셋. 레인저의 기본기.');
def('archer',10,'trapmaster','덫 장인','Trap Master','phys','passive',0,0,{job2:'ranger',pv:{trapDmg:[.05,.01],trapN:[1,0]}},'모든 덫의 피해가 오르고(20레벨에 +24%) 덫마다 동시에 놓을 수 있는 수가 하나 늘어납니다. 패시브.');
def('archer',11,'thorntrap','독 가시 덫','Thorn Trap','phys','trap',18,6,{job2:'ranger',phys:1,mult:.6,rad:140,arm:.5,life:30,maxN:2,field:{dur:6,slow:1}},'밟으면 6초 동안 독 가시밭이 펼쳐져 적을 느리게 하고 계속 찌릅니다.');
def('archer',12,'traptoss','덫 던지기','Trap Toss','phys','buff',10,20,{job2:'ranger',dur:30,trapThrow:500},'30초 동안 모든 덫을 발밑이 아니라 가리킨 곳(최대 500)에 던져 놓습니다. 지속은 스킬 레벨마다 +30초.');
def('archer',13,'smoke','연막','Smoke Screen','phys','field',30,35,{job2:'ranger',mult:0,rad:180,dur:8,blind:.4},'8초 동안 연기를 피웁니다. 연기 안의 적은 공격이 40% 빗나갑니다(보스는 15%).');
def('archer',14,'wildsense','야생의 감각','Wild Sense','phys','passive',0,0,{job2:'ranger',pv:{eva:[.02,.004]}},'회피가 오릅니다(회피 상한 25% 안에서). 패시브.');
def('archer',14,'netshot','그물 사격','Net Shot','phys','bolt',15,8,{job2:'ranger',phys:1,wt:'bow',mult:1.5,spd:800,r:10,root:2.5},'그물 화살로 한 적을 2.5초 묶습니다(보스는 1초).');
def('archer',15,'beastawaken','야수 각성','Beast Awakening','phys','buff',30,60,{job2:'ranger',burst:1,dur:20,petDmg:.3,petHp:.3,petSize:1.3},'20초 동안 사냥 동료(늑대·매) 모두가 커지며 피해·생명력이 30% 오릅니다.');
def('archer',16,'detonate','덫 연쇄','Chain Detonation','phys','detonate',20,10,{job2:'ranger',trapAll:1,mult:1.5},'깔아 둔 덫을 한꺼번에 터뜨립니다. 각 덫은 원래 피해의 1.5배.');
def('archer',17,'lure','함정 유인','Lure','phys','field',25,25,{job2:'ranger',mult:0,rad:300,dur:4,lure:1},'미끼를 던져 4초 동안 둘레 일반 몬스터를 그 자리로 끌어 모읍니다(보스는 안 끌림). 덫 위에 던지면 좋습니다.');
def('archer',18,'dominion','사냥터 지배','Hunting Dominion','phys','trap',70,30,{job2:'ranger',phys:1,mult:3.5,rad:100,arm:.6,life:25,maxN:8,ring:220,cnt:8},'가리킨 곳 둘레에 덫 여덟 개를 한꺼번에 깝니다.');
def('archer',19,'earthbind','대지의 포박','Earthbind','phys','nova',80,90,{job2:'ranger',phys:1,mult:6,rad:320,root:6,bossRoot:1.5},'땅의 덩굴로 둘레의 모든 적을 6초 묶습니다(보스 1.5초). 재사용 90초.');
const CAST_T_J2={absolutezero:1.2,testament:1.5,spiritlegion:1.5,heavenblades:1,grandverdict:1.5,battlerez:1,myriadslash:.5,snipe:1,heavenbow:1.2};
const CHAN_J2={meteorswarm:{mode:'keep'},holyflame:{mode:'tick',dur:2,iv:.25},archhymn:{mode:'keep'},whirlslash:{mode:'tick',dur:2,iv:.25,walk:1}};
const LINKS_J2=`
prismbolt>frostchain steamburst>absolutezero magmafield>meteorswarm frostchain>collapse collapse>testament overload>testament
fireelem>phoenix frostgolem>stonetitan stonetitan>spiritlegion communion>spiritlegion fireelem>spiritburst
lightvolley>holyflame heresybrand>purgefire heresybrand>finalverdict judgechain>heavenblades heavenblades>grandverdict
grandblessing>lightwings lifespring>archhymn grandblessing>crownofblessing sanctum>crownofblessing archhymn>battlerez
grandtaunt>lastbastion chainpull>guardrush shieldwall>citadel bulwark>citadel
crushcombo>rend rend>execute whirlslash>myriadslash bloodfrenzy>avatarofwar battletrance>avatarofwar
tripleshot>splitarrow pierceblow>heavenbow snipe>heavenbow elemrain>arrowvortex
blasttrap>dominion thorntrap>dominion lure>earthbind netshot>earthbind`;
const NAMES_J2={
  prismbolt:['프리즘 볼트','카스 에아 타룬'],resonance:['엘리멘탈 레조넌스',''],steamburst:['스팀 버스트','카스 에아셀 엔테'],magmafield:['마그마 필드','카스 도르 오르'],
  frostchain:['프로스트 볼트 체인','에아셀 타룬 벨'],elempierce:['엘리멘탈 피어스',''],elembarrier:['엘리멘탈 배리어','셀 카스 에아 도르'],overload:['아케인 오버로드','비엔 아르 셀'],
  meteorswarm:['메테오 스웜','카스 오르 엔테 아르'],collapse:['엘리멘탈 콜랩스','셀 넨 시르'],absolutezero:['제로 도메인','에아셀 아르 엔 넨'],testament:['아크 테스트먼트','카스 에아 타룬 도르, 아르 엔테'],
  fireelem:['파이어 엘리멘탈','카스 실'],pactmark:['팩트 마크',''],frostgolem:['프로스트 골렘','에아셀 도르 실'],stormhawk:['스톰 호크','타룬 베안 실'],
  stonetitan:['스톤 타이탄','도르 아르 실'],affinity:['스피릿 어피니티',''],communion:['스피릿 커뮤니언','실 비엔 로'],spiritburst:['스피릿 버스트','실 엔테'],
  summoncircle:['서모닝 서클','실 셀 엔 오르'],swapplace:['스피릿 스왑','파스 실'],phoenix:['피닉스','카스 실 넨 아르'],spiritlegion:['스피릿 리전','실 엔테, 카스 에아 타룬 실'],
  lightvolley:['랜스 발리','빛이여, 창이 되어 날아가라'],conviction:['컨빅션',''],heresybrand:['브랜드 오브 헤러시','죄 지은 자에게 표를 남기소서'],purgefire:['퍼징 플레임','정결한 불이여, 더러움을 사르라'],
  judgechain:['체인 오브 저지먼트','빛의 사슬이여, 죄인을 묶으라'],penitence:['그레이스 오브 페넌스',''],confessbell:['벨 오브 컨페션','종이여, 숨은 죄를 깨우라'],inqarmor:['인퀴지터 메일','신앙이 나의 갑옷이 되게 하소서'],
  holyflame:['세이크리드 파이어스톰','성화여, 앞을 모두 사르라'],finalverdict:['파이널 버딕트','판결은 내려졌노라'],heavenblades:['블레이드 오브 헤븐','하늘의 검이여, 땅에 내리소서'],grandverdict:['그랜드 버딕트','모든 죄가 빛 앞에 서게 하소서'],
  grandblessing:['그랜드 블레싱','우리 모두에게 은총을 내리소서'],graceamp:['앰플리파이드 그레이스',''],gracelink:['그레이스 링크','나의 은총을 저이와 나누게 하소서'],lifespring:['웰스프링','이곳에 생명의 샘이 솟게 하소서'],
  chainheal:['체인 힐링','상처에서 상처로 빛이 건너가게 하소서'],hymnecho:['에코잉 힘',''],purifyhand:['핸드 오브 퓨리피케이션','이 손으로 더러움을 거두소서'],sanctum:['생텀 배리어','이곳을 거룩한 땅으로 지키소서'],
  lightwings:['윙즈 오브 라이트','빛의 날개로 우리를 실어 가소서'],archhymn:['아크비숍 힘','모두 함께 노래하라, 빛이 들으시니'],battlerez:['배틀필드 레저렉션','쓰러진 이여, 아직 그대의 때가 아니니'],crownofblessing:['크라운 오브 블레싱','한 사람에게 내린 은총이 모두에게 닿게 하소서'],
  ironflesh:['아이언 플레시',''],grandtaunt:['그랜드 챌린지','모두 나를 보라!'],chainpull:['체인 훅','이리 와라!'],shieldwall:['실드 월','방패 뒤로!'],
  guardrush:['가디언 러시','버텨, 지금 간다!'],guardianoath:['가디언 오스',''],retaliation:['리탤리에이션 오라','칠 테면 쳐 봐라'],steadfast:['스테드패스트','한 걸음도 물러서지 않는다'],
  commandshout:['커맨더 샤우트','진형을 지켜라!'],bulwark:['불워크','내 곁에 서라!'],citadel:['언일딩 시타델','나는 성벽이다'],lastbastion:['라스트 바스티온','여기서 끝내지 않는다!'],
  crushcombo:['크러싱 콤보',''],bloodlust:['블러드러스트',''],whirlslash:['월윈드 슬래시','쓸어버려라!'],thunderdrop:['썬더 드롭','하늘에서 떨어진다!'],
  bloodfrenzy:['블러드 프렌지','피가 끓는다!'],weaponmastery:['웨폰 마스터리',''],rend:['렌드',''],terrorroar:['로어 오브 테러','도망쳐라!'],
  execute:['익스큐트','끝이다'],battletrance:['배틀 트랜스','아무것도 날 막지 못한다'],myriadslash:['미리어드 슬래시','천 번 베어 주마!'],avatarofwar:['아바타 오브 워','전쟁이 내 몸에 깃든다!'],
  tripleshot:['트리플 샷',''],farsight:['파 사이트',''],pierceblow:['피어싱 블로',''],snipe:['스나이프','숨을 멈추고…'],
  splitarrow:['스플리팅 애로우',''],weakpoint:['위크 포인트',''],elemrain:['엘리멘탈 레인','불, 얼음, 번개여!'],focus:['포커스','과녁만 보인다'],
  backshot:['리트리팅 샷',''],deathmark:['마크 오브 데스','넌 이미 사냥감이다'],arrowvortex:['애로우 볼텍스','휘감아라!'],heavenbow:['보우 오브 헤븐','하늘이여, 활시위를!'],
  blasttrap:['블래스트 트랩',''],trapmaster:['트랩 마스터',''],thorntrap:['쏜 트랩',''],traptoss:['트랩 토스',''],
  smoke:['스모크 스크린',''],wildsense:['와일드 센스',''],netshot:['넷 샷',''],beastawaken:['비스트 어웨이큰','깨어나라, 짐승들아!'],
  detonate:['체인 디토네이션','터져라!'],lure:['루어',''],dominion:['헌팅 도미니언','이 땅은 내 사냥터다'],earthbind:['어스바인드','대지여, 붙잡아라!']};
// 다듬기: 요구 레벨(upLv) · 화면 이름 · 기존 칸 이름에 맞추기 (exec → {hp,mul}, 한 사람 대상 → one, 끌어들이기 → pull)
const J2_SPELLS=[];
for(const id in SPELLS){const s=SPELLS[id];if(!s.job2)continue;J2_SPELLS.push(id);
  s.upLv=RANK_LV_J2[s.rank-10];s.kn=s.n;const nm=NAMES_J2[id];if(nm){s.n=nm[0];if(nm[1])s.chant=nm[1]}
  if(s.exec&&s.exec.below!=null)s.exec={hp:s.exec.below,mul:s.exec.mult};
  if(s.target==='one')s.one=1;if(s.pullIn)s.pull=1;
  if(s.kind==='charge'&&!s.dist)s.dist=s.range||400;if(s.shield&&typeof s.shield==='object'){s.rushShield=s.shield;delete s.shield}
  if(s.kind==='blink'&&!(s.range>0))s.range=s.swap?900:220}
