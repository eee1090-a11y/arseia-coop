// ---- v13: 사제 계열 확장 (치유 · 수호 · 축복; v17에서 속죄는 심판으로 합쳐짐). party: 그 거리 안의 동료에게도 걸린다 ----
// 축복: 몸과 마음을 북돋는 강화
def('priest',2,'agiup','어질리티 업','Increase Agility','holy','buff',14,20,{dur:30,spd:.22,party:450},'발걸음을 가볍게 해 30초 동안 이동 속도가 빨라집니다. 파티원에게도 걸립니다.');
def('priest',3,'wisdom','지혜의 축복','Blessing of Wisdom','holy','buff',16,30,{dur:40,regen:3,party:450},'마음을 맑게 해 40초 동안 마나 회복이 크게 늘어납니다. 파티원에게도 걸립니다.');
def('priest',4,'impositio','임포지티오 마누스','Impositio Manus','holy','buff',20,45,{burst:1,dur:10,dmg:.2,party:450},'손을 얹어 10초 동안 피해를 20% 늘립니다. 짧은 강화라 싸움이 몰릴 때 맞춰 거세요. 파티원에게도 걸립니다.');
def('priest',4,'kings','왕의 축복','Blessing of Kings','holy','buff',24,40,{dur:60,hp:.1,dr:.06,dmg:.04,party:450},'60초 동안 최대 생명력 10%, 받는 피해 6% 감소, 피해 4% 증가. 파티원에게도 걸립니다.');
def('priest',5,'gloria','글로리아','Gloria','holy','buff',26,30,{dur:30,crit:.08,party:450},'영광의 찬가를 불러 30초 동안 치명타 확률이 8% 오릅니다. 파티원에게도 걸립니다.');
def('priest',6,'magnificat','마그니피캇','Magnificat','holy','buff',30,40,{dur:30,regen:6,cdr:.05,party:450},'찬미의 노래로 30초 동안 마나가 넘치게 차오르고 재사용 대기가 5% 줄어듭니다. 파티원에게도 걸립니다.');
def('priest',6,'fortitude','인내의 기도','Prayer of Fortitude','holy','buff',32,45,{dur:60,hp:.18,life:.004,party:450},'60초 동안 최대 생명력이 18% 늘고 생명력이 조금씩 차오릅니다. 파티원에게도 걸립니다.');
def('priest',7,'aspersio','아스페르시오','Aspersio','holy','buff',38,60,{burst:1,dur:12,dmg:.25,crit:.05,party:450},'성수를 뿌려 12초 동안 피해 25%, 치명타 5%를 더합니다. 짧은 강화입니다. 파티원에게도 걸립니다.');
def('priest',8,'assumptio','어섬티오','Assumptio','holy','buff',46,90,{burst:1,dur:20,dr:.35,party:450},'하늘로 들어 올리는 은총. 20초 동안 받는 피해가 35% 줄어듭니다. 파티원에게도 걸립니다.');
def('priest',9,'benediction','성인의 대축복','Benediction of the Saints','holy','buff',64,120,{burst:1,dur:15,dmg:.3,dr:.15,spd:.12,crit:.06,regen:5,life:.006,party:550},'모든 축복을 한꺼번에 내립니다. 15초 동안 피해·방어·속도·치명타·회복이 모두 오릅니다. 파티원에게도 걸립니다.');
// 수호: 막고 버티게 하는 기도
def('priest',2,'kyrie','키리에 엘레이손','Kyrie Eleison','holy','shield',16,20,{mult:2.4,flat:16,dur:15,hits:6,party:450,role:'hits'},'주여 자비를. 15초 동안 피해를 흡수하는 막. 크기와 상관없이 6번 맞으면 깨지니, 작은 공격이 많을 때 좋습니다. 파티원에게도 걸립니다.');
def('priest',3,'safetywall','세이프티 월','Safety Wall','holy','field',18,24,{mult:0,rad:80,dur:7,drf:.35,block:1,role:'wall'},'7초 동안 빛의 벽을 세웁니다. 벽 안으로 날아드는 적의 투사체를 막고, 안에 선 사람이 받는 피해를 35% 줄입니다.');
def('priest',5,'barrier','파워 워드: 방벽','Power Word: Barrier','holy','field',30,60,{mult:0,rad:150,dur:9,drf:.3,heal:.02,role:'zone'},'넓은 방벽을 세워 9초 동안 안의 모두가 받는 피해를 30% 줄이고 조금씩 낫게 합니다.');
def('priest',6,'guardianspirit','수호 천사','Guardian Spirit','holy','ward',34,90,{dur:10,heal:.5,healUp:.4,party:450,role:'heal-amp'},'수호 천사가 10초 동안 곁을 지켜 받는 치유가 40% 늘고, 쓰러질 일격을 한 번 막아 생명력 50%로 일으킵니다. 파티원에게도 걸립니다.');
def('priest',8,'painsup','고통 억제','Pain Suppression','holy','buff',40,90,{burst:1,dur:8,dr:.5,party:450,role:'dr'},'8초 동안 받는 피해가 절반으로 줄어듭니다. 보스의 큰 공격 앞에서 쓰세요. 파티원에게도 걸립니다.');
def('priest',9,'aegis','신성한 아이기스','Divine Aegis','holy','shield',60,120,{mult:6,flat:100,dur:15,reflect:.5,party:550,role:'reflect'},'거대한 빛의 방패로 15초 동안 큰 피해를 흡수하고, 나를 직접 때린 적에게 막은 피해의 절반을 되돌려 줍니다. 파티원에게도 걸립니다.');
// 치유: 살리고 일으키는 기도
def('priest',2,'renew','리뉴','Renew','holy','hot',14,8,{dur:12,pct:.3,mult:1.6,party:450,role:'hot-party'},'12초 동안 상처가 조금씩 아물게 합니다. 파티원에게도 걸립니다.');
def('priest',4,'prayerheal','치유의 기도','Prayer of Healing','holy','heal',26,10,{pct:.22,mult:1.5,party:450,role:'group'},'주변의 동료와 나를 한꺼번에 조금씩 치유합니다.');
def('priest',7,'salvation','성언: 구원','Holy Word: Salvation','holy','heal',50,90,{pct:.5,mult:2.5,hot:.25,party:550,role:'group-big'},'구원의 말씀(시전 시간)으로 나와 주변의 동료를 크게 살리고, 6초 동안 치유가 이어집니다.');
def('priest',7,'resurrection','리저렉션','Resurrection','holy','rez',40,60,{rad:420,pct:.5,role:'rez'},'쓰러진 동료를 생명력 50%로 되살립니다. 같이 하기 전용.');
def('priest',9,'divinehymn','신성한 찬가','Divine Hymn','holy','field',64,90,{mult:0,rad:220,dur:8,heal:.08,mana:.03,self:1,role:'hymn'},'8초 동안 찬가를 불러 둘레의 모두를 빠르게 치유하고 마나도 채웁니다.');
// 심판(v17): 속죄 계열을 없애고 심판으로 합쳤다. 스마이트·홀리 파이어·징벌·그랜드 크로스는 옮기고(점수 그대로),
// 페넌스·홀리 노바·디바인 스타·헤일로는 없앴다(불러올 때 점수를 돌려준다, b5.js load). 아포테오시스는 '응징의 날개'(짧은 강화)로 바뀜
def('priest',1,'smite','스마이트','Smite','holy','bolt',5,1,{mult:1.6,spd:600,r:7,stun:.4},'빛의 무게로 내리쳐 적을 잠깐 멈칫하게 합니다. 성스러운 불티보다 느리지만 무겁습니다.');
def('priest',1,'holycross','홀리 크로스','Holy Cross','holy','cone',6,1,{mult:1.3,range:120,ang:1.2},'눈앞에 빛의 십자를 그어 가까이 붙은 적을 벱니다.');
def('priest',2,'holyfire','홀리 파이어','Holy Fire','holy','bolt',8,3,{mult:1.6,spd:560,r:8,burn:1},'성스러운 불길로 적을 태웁니다. 맞은 적은 3초 동안 불탑니다.');
def('priest',2,'hammerofjustice','정의의 망치','Hammer of Justice','holy','strike',10,7,{mult:1.2,rad:50,delay:.2,stun:1.6},'정의의 망치를 내리쳐 적을 1.6초 동안 꼼짝 못 하게 합니다.');
def('priest',3,'blessedhammer','축복받은 망치','Blessed Hammer','holy','orbit',14,7,{mult:.9,orbs:2,orad:80,dur:6,ud:2},'빛의 망치 둘이 6초 동안 내 둘레를 돌며 닿는 적을 때립니다. 언데드에게 두 배.');
def('priest',3,'consecration','신성화','Consecration','holy','field',18,9,{mult:.55,rad:100,dur:5},'땅을 성별해 5초 동안 그 위에 선 적을 태웁니다.');
def('priest',4,'avengersshield','응징의 방패','Avenger\'s Shield','holy','chain',18,6,{mult:1.7,jumps:3,stun:.8},'빛의 방패를 던져 적 셋을 차례로 치고 멈칫하게 합니다.');
def('priest',4,'radiance','광휘','Radiance','holy','beam',16,1.6,{mult:2,len:380,w:18},'손바닥에서 곧은 빛줄기를 쏘아 줄지어 선 적을 꿰뚫습니다.');
def('priest',5,'chastise','징벌','Chastise','holy','bolt',20,8,{mult:2.4,spd:700,r:8,stun:2.2},'징벌의 말씀으로 적을 2초 넘게 꿇어앉힙니다.');
def('priest',5,'divinestorm','신성한 폭풍','Divine Storm','holy','nova',22,4,{mult:2,rad:150,knock:40},'몸을 축으로 빛을 휘몰아쳐 둘레의 적을 베고 밀어냅니다.');
def('priest',6,'fistofheaven','하늘의 주먹','Fist of the Heavens','holy','strike',30,5,{mult:4.4,rad:80,delay:.35,stun:.5},'하늘에서 벼락 같은 빛을 내리꽂습니다.');
def('priest',6,'hammerofwrath','천벌의 망치','Hammer of Wrath','holy','bolt',28,5,{mult:3.4,spd:620,r:10,aoe:80},'천벌의 망치를 던져 맞은 자리를 크게 터뜨립니다.');
def('priest',7,'gloriadomini','글로리아 도미니','Gloria Domini','holy','bolt',40,7,{mult:6.5,spd:760,r:9,homing:1,stun:.6},'주의 영광으로 적 하나를 짓누릅니다. 빛이 끝까지 적을 쫓아갑니다.');
def('priest',7,'condemn','단죄의 원','Circle of Condemnation','holy','field',44,12,{mult:1,rad:150,dur:5,slow:1},'죄 지은 땅에 원을 그어 5초 동안 그 안의 적을 느리게 하고 태웁니다.');
def('priest',8,'grandcross','그랜드 크로스','Grand Cross','holy','nova',44,7,{mult:4.6,rad:230,ud:2,stun:.6},'발밑에 거대한 십자를 그어 둘레를 정화합니다. 언데드에게 두 배.');
def('priest',8,'sacredsword','심판의 성검','Sword of Judgment','holy','beam',50,6,{mult:7,len:480,w:28,stun:.4},'하늘에서 내려 받은 성검으로 먼 곳까지 일직선을 가릅니다.');
def('priest',9,'apotheosis','응징의 날개','Avenging Wrath','holy','buff',58,120,{burst:1,dur:12,dmg:.3,cdr:.15},'빛의 날개를 펼쳐 12초 동안 피해 30% 증가, 재사용 대기 15% 감소. 결정적인 순간에만 쓰는 짧은 강화입니다.');
