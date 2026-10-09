// ---- v5: 이름난 큰 마법들 ----
def('mage',2,'frostdiver','프로스트 다이버','Frost Diver','ice','bolt',6,1.2,{mult:1.1,spd:540,r:6,freeze:1.6},'바닥을 타고 달리는 얼음 줄기로 적 하나를 꽁꽁 얼립니다.');
def('mage',3,'arcanemissiles','아케인 미사일','Arcane Missiles','arcane','bolt',9,1.2,{mult:.55,spd:430,r:5,cnt:5,spread:.14,homing:1},'보랏빛 마력탄 다섯 발이 적을 따라가 꽂힙니다.');
def('mage',5,'frozenorb','프로즌 오브','Frozen Orb','ice','bolt',22,1.6,{mult:.7,spd:190,r:12,pierce:1,shards:1},'천천히 굴러가며 사방으로 얼음 조각을 뿌리고, 끝에서 크게 터지는 얼음 구슬.');
def('mage',6,'hydra','히드라','Hydra','fire','summon',26,3,{mult:1.1,dur:10,hp:2,form:'hydra'},'불을 뿜는 세 머리 히드라를 땅에 불러 세웁니다. 움직이지 않고 가까운 적에게 불덩이를 쏩니다.');
def('mage',7,'meteor','메테오','Meteor','fire','strike',34,5,{mult:7,rad:120,delay:.9,fall:1,burn:1,after:4},'하늘에서 운석을 떨어뜨립니다. 떨어진 자리는 4초 동안 불탑니다.');
def('mage',7,'stormgust','스톰 거스트','Storm Gust','ice','field',38,8,{mult:.9,rad:180,dur:4,freeze:1.4,slow:1},'얼음 폭풍을 일으켜 그 안의 적을 몰아치며 얼립니다.');
def('mage',8,'lordvermilion','로드 오브 버밀리온','Lord of Vermilion','storm','rain',52,12,{mult:1.7,rad:230,dur:4,rate:12,srad:46,stun:.25},'넓은 땅에 붉은 벼락을 끝없이 내리꽂습니다.');
def('mage',8,'pyroblast','불덩이 작렬','Pyroblast','fire','bolt',40,4,{mult:9,spd:360,r:15,aoe:120,burn:1},'거대한 불덩이를 날려 크게 터뜨립니다.');
def('priest',6,'sanctuary','생츄어리','Sanctuary','holy','field',30,20,{mult:.6,rad:150,dur:8,heal:.06,ud:3,role:'ground'},'정한 자리에 성역을 펼쳐 안에 선 나를 치유하고, 그 안의 적을 태웁니다. 언데드에게 세 배.');
def('priest',9,'magnus','마그누스 엑소시즘','Magnus Exorcismus','holy','field',70,25,{mult:2.2,rad:220,dur:6,ud:3},'거대한 십자 결계를 그려 그 안의 마물을 쉬지 않고 정화합니다. 언데드에게 세 배.');
