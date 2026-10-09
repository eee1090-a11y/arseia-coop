/* ---------- v20 (WARARC): 3차 전직 스킬 데이터 — 전사(성벽의 군주 · 전쟁군주) · 궁수(신궁 · 그림자 사냥꾼) ----------
   설계: rpg/job-advancement-3/3차전직-컨셉.md 3절 표 그대로(갈래마다 11개, 패시브 1). job3d.js 바로 뒤(job3d-mp.js가 있으면 그 뒤), b2.js 앞에 붙는다.
   실행 중 동작 · 그림 · 아이콘은 job3fx-wa.js. 위계 20~30 = 표의 순서(J3_LV 100·100·103·…·130). 수치는 3차 스킬 1점(스킬 레벨 1) 기준이고,
   한 점마다 2레벨씩(J3K) 올라 피해 +12%씩 더해진다(곱하지 않음). 전사 피해는 힘, 궁수 피해는 민첩(physPower), 둘 다 마나를 쓴다.
   새 종류(kind): wall 지형 · throw 던졌다 되돌아옴 · mleap 연속 도약 · sweep 돌격 행렬 · riders 소환 · kingdom 파티 수호 · swap 자리 바꾸기 ·
   counter 반격 · gale 사방 검기 · harvest 회복 · homing 유도 화살 · sidestep 이동 사격 · scatter 부채꼴 · stars 다중 조준 · starfall 별 떨구기 · clones 분신.
   이 종류들은 b3.js의 switch가 모르는 이름이라 기본 동작이 없고, job3fx-wa.js가 시전 뒤(같이 하기 유령 시전 포함)에 직접 처리한다. */
// ===== 전사 · 성벽의 군주 (가디언 나이트에서) =====
def('warrior',20,'rampartbash','성벽 강타','Rampart Smash','phys','melee',6,1.1,{job3:'bulwark',phys:1,wt:'melee',mult:2.6,ang:1.9,max:6,threat:5,mhit:3,j3blk:{mul:1.6,stun:.6,brk:8}},'방패로(창을 들었다면 자루로) 앞쪽 넓은 부채꼴을 후려쳐 적 여섯까지 치고, 위협을 크게(피해의 5배) 쌓습니다. 막기에 성공한 뒤의 다음 강타는 피해가 60% 오르고 0.6초 기절시킵니다(보스는 무너짐 게이지가 찹니다). 성벽의 군주의 기본기.');
def('warrior',20,'lordstance','군주의 자세','Sovereign Stance','phys','passive',0,0,{job3:'bulwark',wt:'shield',pv:{blk:[.04,.004],blkMp:[4,.8]}},'방패를 든 동안 막기 확률이 오르고(1점 4%, 10점 11% · 막기 상한 50% 안), 막을 때마다 마나가 찹니다(1점 4, 10점 18). 패시브.');
def('warrior',21,'bewall','성벽이 되리라','Living Rampart','phys','buff',30,60,{job3:'bulwark',burst:1,dur:8,dr:.2,j3wall:{share:.6,rad:350}},'파티(둘레 350): 8초 동안 둘레 350 안의 파티원이 받는 범위 공격(바닥에 경고가 뜨는 내려찍기·폭발) 피해의 60%를 내가 대신 받고, 그동안 내가 받는 피해가 20% 줄어듭니다. 혼자일 때는 피해 감소만. 재사용 60초.');
def('warrior',22,'provokemark','도발의 표식','Mark of Defiance','phys','bolt',14,12,{job3:'bulwark',phys:1,wt:'melee',mult:3.2,spd:1000,r:9,taunt:10,j3prov:10},'한 적: 표식 창을 던집니다. 맞은 적은 10초 동안 나만 노리고, 그 적이 파티원에게 쓰려던 돌진·저격·내려찍기 같은 기술도 모두 나에게 옵니다(보스 포함).');
def('warrior',23,'stonerampart','바위 성벽','Stone Rampart','phys','wall',32,18,{job3:'bulwark',phys:1,mult:3.5,len:400,dur:6,range:520,knock:60,j3brk:40},'지형: 가리킨 자리에 길이 400의 바위 벽을 6초 동안 세웁니다. 솟아오를 때 그 줄 위의 적을 치고 밀어내며, 몬스터와 날아오는 투사체는 벽을 지나가지 못합니다. 보스는 벽을 부수고 지나가지만 1초 멈칫하고 무너짐 게이지가 크게(40) 찹니다.');
def('warrior',24,'citadelecho','성채의 메아리','Citadel Echo','phys','buff',25,40,{job3:'bulwark',burst:1,dur:15,j3echo:{mult:1.2,flat:30,rad:400,iv:.6,dur:5}},'파티(둘레 400): 15초 동안 막기에 성공할 때마다 나와 둘레 400 안의 파티원에게 작은 보호막(공격력의 120% + 30, 5초)을 씌웁니다. 더 큰 보호막이 이미 있으면 그대로 둡니다. 방패를 들어야 막을 수 있습니다.');
def('warrior',25,'lordduel','군주의 결투','Sovereign\'s Duel','phys','bolt',25,30,{job3:'bulwark',phys:1,wt:'melee',mult:6,spd:1100,r:10,taunt:4,j3duel:{dur:12,amp:.5}},'한 적: 결투의 창을 던집니다. 맞은 적이 보스·준보스면 12초 동안 결투 — 그 적은 나만 노리고, 그동안 다른 파티원이 그 적을 때리면 무너짐 게이지가 차며, 무너짐 게이지가 50% 더 빨리 찹니다. 일반 몬스터는 4초 도발.');
def('warrior',26,'fortressswap','요새 이동','Fortress Shift','phys','swap',20,20,{job3:'bulwark',range:600,leap:400,taunt:3,rad:300},'한 사람: 위험한 동료(고른 동료, 없으면 둘레 600 안에서 생명력이 가장 낮은 동료)와 자리를 바꾸고, 그 동료에게 쏠린 위협을 모두 넘겨받아 둘레 적이 3초 동안 나를 노립니다. 혼자일 때는 가리킨 곳(최대 400)으로 뛰어들어 둘레 적을 도발합니다. 재사용 20초.');
def('warrior',27,'bulwarkcounter','역습','Retribution','phys','counter',40,16,{job3:'bulwark',phys:1,wt:'melee',mult:7.5,range:300,ang:1.7,knock:90,charge:{max:4,mul:2.2},j3store:{dr:.5,cap:4,k:2},j3brk:20},'모으기 채널링(최대 4초): 방패를 세워 그동안 받는 피해를 50% 줄이고 막아 낸 피해를 모읍니다. 손을 떼면(또는 4초가 차면) 앞쪽 부채꼴로 크게 터뜨립니다. 오래 모을수록 세지고(최대 2.2배), 모은 피해의 두 배가 더해집니다(공격력의 네 배까지).');
def('warrior',28,'earthanchor','대지 고정','Earth Anchor','phys','field',35,40,{job3:'bulwark',phys:1,mult:.9,rad:400,dur:6,slow:1,j3anchor:1,j3at:'me'},'파티(지대 안): 6초 동안 내 둘레 반경 400의 땅을 붙듭니다. 그 안의 적은 밀치기·돌진·도약·순간이동을 못 하고 느려지며 조금씩 피해를 받고, 그 안의 파티원은 밀려나거나 끌려가지 않습니다.');
def('warrior',29,'unfallenkingdom','무너지지 않는 왕국','Unfallen Kingdom','phys','kingdom',60,180,{job3:'bulwark',dur:12,rad:450,heal:.2,cap:.5},'파티(둘레 450): 12초 동안 둘레 450 안의 파티원(나 포함) 모두의 생명력이 1 아래로 떨어지지 않습니다. 끝날 때 그동안 받아 낸 피해의 20%만큼(최대 생명력의 절반까지) 회복합니다. 재사용 3분.');
// ===== 전사 · 전쟁군주 (버서커에서) — 투혼: 공격이 맞을 때마다(한 번 쓸 때 한 번) 1씩, 최대 10 =====
def('warrior',20,'lordcombo','군주의 연격','Warlord\'s Flurry','phys','melee',6,1.2,{job3:'warlord',phys:1,wt:'melee',mult:1.25,hits:4,hitIv:.13,ang:1.1,max:3,mhit:2,j3fzLast:2},'네 번 이어 칩니다(한 번에 적 셋까지). 마지막 일격이 맞으면 투혼 +2. 전쟁군주의 기본기. 「투혼」: 전쟁군주는 공격이 맞을 때마다(한 번 쓸 때 한 번) 투혼이 1씩 쌓이고(최대 10), 몇몇 기술이 써서 강해집니다. 6초 동안 싸우지 않으면 하나씩 흩어집니다.');
def('warrior',20,'battleblood','전장의 피','Blood of the Field','phys','passive',0,0,{job3:'warlord',pv:{critDmg:[.08,.008]}},'치명타 피해가 오릅니다(1점 +8%, 10점 +22%, 다른 치명타 피해 증가와 합쳐 +50%까지, 더하는 식). 패시브.');
def('warrior',21,'earthsplit','대지 가르기','Earth Splitter','phys','beam',20,6,{job3:'warlord',phys:1,wt:'melee',mult:5,len:320,w:50,stun:.5,j3fury:{len:16,mult:.7,brk:4}},'투혼을 모두 써서 앞으로 땅을 가릅니다. 투혼 하나마다 길이 +16, 피해 +0.7배(투혼 10이면 길이 480, 피해 세 배 가까이). 투혼이 없어도 쓸 수 있습니다. 보스는 투혼 하나마다 무너짐 게이지가 4 찹니다.');
def('warrior',22,'weaponthrow','무기 투척','Hurl Weapon','phys','throw',14,5,{job3:'warlord',phys:1,wt:'melee',mult:3,range:520,spd:900,w:34,j3fzPer:1,j3fzMax:3},'무기를 던져 일직선을 꿰뚫고 손으로 되돌아오게 합니다(가는 길과 오는 길에 한 번씩). 맞힌 적 하나마다 투혼 +1(최대 +3).');
def('warrior',23,'executionleap','처단의 도약','Execution Leap','phys','mleap',28,12,{job3:'warlord',phys:1,wt:'melee',mult:4.5,range:420,rad:150,num:3,iv:.38,stun:.4,j3brk:8},'세 번 연달아 뛰어 내려찍습니다. 둘레에 적이 여럿이면 셋에게 한 번씩, 하나뿐이면 그 적에게 세 번. 착지할 때마다 반경 150을 칩니다.');
def('warrior',24,'bloodoath','피의 맹세','Blood Oath','phys','buff',30,45,{job3:'warlord',burst:1,dur:10,party:450,j3ls:.03},'파티(둘레 450): 10초 동안 나와 둘레 450 안의 파티원이 준 피해의 3%가 생명력으로 돌아옵니다(한 사람이 1초에 최대 생명력의 4%까지).');
def('warrior',25,'bloodharvest','피의 갈무리','Blood Harvest','phys','harvest',15,20,{job3:'warlord',pct:.03},'자신만: 투혼을 모두 써서 투혼 하나마다 생명력 3%를 되찾습니다(투혼 10이면 30%, 스킬 점수마다 조금씩 늘어남). 투혼이 없으면 쓰이지 않습니다.');
def('warrior',26,'lordgale','군주의 칼바람','Warlord\'s Gale','phys','gale',40,14,{job3:'warlord',phys:1,wt:'melee',mult:3.4,range:480,num:6,numMax:16,charge:{max:3,mul:2.2},j3brk:3},'모으기 채널링(최대 3초): 제자리에서 무기를 휘두르며 힘을 모았다가, 놓으면 사방으로 검기를 날립니다. 오래 모을수록 검기가 많아지고(6 → 16) 세집니다(최대 2.2배). 검기는 적을 꿰뚫습니다.');
def('warrior',27,'wardrum','전쟁의 북','War Drums','phys','buff',35,90,{job3:'warlord',burst:1,dur:15,party:450,critDmg:.1,j3drum:1},'파티(둘레 450): 15초 동안 나와 둘레 450 안의 파티원의 치명타 피해 +10%. 그동안 파티원이 적을 맞혀도 내 투혼이 찹니다(한 사람당 1초에 한 번). 재사용 90초.');
def('warrior',28,'phantomriders','환영 기수 소집','Phantom Riders','phys','riders',45,60,{job3:'warlord',phys:1,mult:1.6,dur:15,num:4,numFull:6,hp:.4},'15초 동안 환영 기수 넷이 나타나 내가 노리는 적(없으면 가까운 적)을 함께 칩니다. 투혼이 10이면 여섯(투혼은 쓰지 않음). 재사용 60초.');
def('warrior',29,'heavenlycharge','천군의 돌격','Charge of the Host','phys','sweep',60,60,{job3:'warlord',phys:1,mult:24,len:1100,w:110,knock:120,spd:1500,j3brk:45},'1초 동안 기를 모은 뒤(시전 1초) 환영 기병대가 앞쪽(길이 480, 폭 220)을 휩쓸고 지나갑니다. 길 위의 적을 모두 치고 밀어내며, 보스의 무너짐 게이지를 크게(45) 채웁니다. 재사용 60초.');
// ===== 궁수 · 신궁 (호크아이에서) — 호흡: 움직이지 않으면 0.5초마다 1, 최대 5 =====
def('archer',20,'windpierce','바람 꿰기','Wind Piercer','phys','bolt',4,1,{job3:'divinearcher',phys:1,wt:'bow',aspd:1,mult:3,spd:1150,r:6,pierce:1,mhit:1,j3pmax:2,j3pmaxBr:4},'바람을 꿰는 화살이 적 둘을 꿰뚫습니다. 호흡이 하나라도 있으면 둘 더(넷까지) 꿰뚫습니다(호흡은 쓰지 않음). 신궁의 기본기.');
def('archer',20,'breathmastery','신궁의 호흡','Archer\'s Breath','phys','passive',0,0,{job3:'divinearcher',pv:{breathCrit:[.03,.0015]}},'「호흡」: 움직이지 않으면 0.5초마다 호흡이 하나씩 쌓입니다(최대 5). 호흡 하나마다 치명타 확률 +3%(10점 +5.7%). 큰 기술(휘는 마탄·일곱 별의 화살·되돌아오는 화살·일격필살·별 떨구는 활)은 쌓인 호흡을 모두 써서 호흡 하나마다 피해 +8%. 움직이면 호흡이 흩어집니다(바람 걸음은 예외). 패시브.');
def('archer',21,'curvingshot','휘는 마탄','Seeking Shaft','phys','homing',18,5,{job3:'divinearcher',phys:1,wt:'bow',mult:4.4,spd:760,num:5,range:520,j3br:1},'지형을 돌아 휘어 날아가며 적 다섯을 차례로 쫓아 맞히는 화살. 호흡을 씁니다.');
def('archer',22,'windstep','바람 걸음','Wind Step','phys','sidestep',12,6,{job3:'divinearcher',phys:1,wt:'bow',mult:4.2,range:240,num:3,spread:.16,spd:1000},'옆으로 미끄러지며 겨눈 쪽으로 화살 세 대를 쏩니다. 호흡을 잃지 않습니다.');
def('archer',23,'exposeweak','약점 공개','Expose Weakness','phys','bolt',15,12,{job3:'divinearcher',phys:1,wt:'bow',mult:3,spd:1200,r:7,j3weak:{crit:.15,dur:12}},'파티 공용 표식: 맞은 적은 12초 동안 모든 파티원의 치명타 확률이 15% 더 높아집니다(표식은 가장 센 하나만).');
def('archer',24,'scattervolley','산탄 일제 사격','Scatter Volley','phys','scatter',22,7,{job3:'divinearcher',phys:1,wt:'bow',mult:5,range:300,ang:2.2,knock:130},'가까이 붙은 적에게 넓은 부채꼴(반경 300)로 화살을 흩뿌려 치고 뒤로 멀리 밀어냅니다.');
def('archer',25,'piercinggaze','꿰뚫는 시선','Piercing Gaze','phys','buff',25,60,{job3:'divinearcher',burst:1,dur:10,dmg:.12,j3gaze:1},'자신만: 10초 동안 화살이 빗나가지 않고(적의 회피 무시), 적의 단단함(방어)을 꿰뚫어 피해가 12% 오릅니다(강화 피해 상한 50% 안). 재사용 60초.');
def('archer',26,'sevenstars','일곱 별의 화살','Seven Stars','phys','stars',45,16,{job3:'divinearcher',phys:1,wt:'bow',mult:8.5,num:7,range:760,j3br:1,j3brk:12},'활을 하늘로 들어(시전 0.8초) 사거리 안에서 가장 강한 적 일곱(보스·준보스 먼저)에게 큰 별빛 화살을 하나씩 떨어뜨립니다. 적이 일곱보다 적으면 남은 화살은 강한 적에게 더 갑니다. 호흡을 씁니다.');
def('archer',27,'returnarrow','되돌아오는 화살','Return Arrow','phys','throw',20,6,{job3:'divinearcher',phys:1,wt:'bow',mult:4.4,range:820,spd:1300,w:22,j3br:1},'멀리 날아간 화살이 되돌아오며 지나간 줄의 적을 한 번 더 꿰뚫습니다(가는 길과 오는 길에 한 번씩). 호흡을 씁니다.');
def('archer',28,'oneshot','일격필살','One Shot','phys','bolt',50,20,{job3:'divinearcher',phys:1,wt:'bow',mult:36,spd:1900,r:10,j3br:1,j3kill:{mul:2,brk:45}},'숨을 고르고(시전 2초, 호흡이 5면 1초) 한 적에게 아주 큰 한 발. 무너진 보스에게는 두 배이고, 무너지지 않은 보스는 무너짐 게이지가 크게(45) 찹니다. 호흡을 씁니다.');
def('archer',29,'starfallbow','별 떨구는 활','Starfall Bow','phys','starfall',60,90,{job3:'divinearcher',phys:1,wt:'bow',mult:20,rad:300,radMax:500,delay:.75,range:620,charge:{max:4,mul:2.2},j3br:1,j3brk:25},'모으기 채널링(최대 4초): 하늘로 활을 오래 당길수록 별이 커집니다. 놓으면 가리킨 곳에 별이 떨어져 반경 300~500을 폭발시킵니다(최대 2.2배, 보스의 무너짐 게이지 25~55). 재사용 90초. 호흡을 씁니다.');
// ===== 궁수 · 그림자 사냥꾼 (레인저에서) =====
def('archer',20,'shadowarrow','그림자 화살','Shadow Shaft','phys','bolt',4,1,{job3:'shadowhunter',phys:1,wt:'bow',aspd:1,mult:3.2,spd:950,r:6,root:.6,mhit:1,j3hidden:2},'적의 그림자를 꿰어 0.6초 묶습니다. 숨어 있을 때(그림자 숨기·위장) 쏘면 두 배. 그림자 사냥꾼의 기본기.');
def('archer',20,'darkhunter','어둠의 사냥꾼','Hunter of the Dark','phys','passive',0,0,{job3:'shadowhunter',pv:{trapDmg:[.06,.006],petDmg:[.06,.006]}},'덫과 사냥 동료(늑대·매·환영)의 피해가 오르고(1점 6%, 10점 17%), 내 덫이 그림자에 묻혀 흐릿하게 깔립니다. 패시브.');
def('archer',21,'shadowhide','그림자 숨기','Shadow Veil','phys','buff',15,25,{job3:'shadowhunter',burst:1,dur:4,stealth:1,j3hide:1},'자신만: 4초 동안 그림자 속에 숨어 적이 나를 놓치고, 내게 쏠린 위협이 0이 됩니다(파티에서 몹을 떼어 낼 때). 숨은 채 쏘는 그림자 화살은 두 배.');
def('archer',22,'shadowtrap','그림자 덫','Shadow Snare','phys','trap',16,6,{job3:'shadowhunter',phys:1,mult:2.8,rad:160,arm:.5,life:30,maxN:3,root:4,j3brk:30},'밟은 적과 둘레(반경 160) 적의 그림자를 땅에 꿰매 4초 동안 못 움직이게 합니다(보스는 1.5초, 무너짐 게이지가 크게(30) 찹니다). 동시에 셋.');
def('archer',23,'shadowstep','그림자 이동','Shadow Step','phys','blink',10,10,{job3:'shadowhunter',range:900,j3step:260},'깔아 둔 내 덫 하나(가리킨 곳에서 가장 가까운 것)의 자리로 순간이동합니다. 덫이 없으면 가리킨 쪽으로 짧게(260) 옮겨 갑니다. 재사용 10초.');
def('archer',24,'huntground','사냥터 봉쇄','Hunting Ground','phys','field',35,30,{job3:'shadowhunter',phys:1,mult:1.4,rad:400,dur:8,j3ring:1,j3brk:20},'가리킨 곳에 8초 동안 반경 400의 그림자 경계를 긋습니다. 경계 밖으로 나가려는 적은 1초 기절하고 안으로 튕겨 들어옵니다(보스는 기절 대신 무너짐 게이지가 찹니다). 경계 안의 적은 조금씩 피해를 받습니다.');
def('archer',25,'poisonshade','독 그림자','Venom Shade','phys','buff',20,30,{job3:'shadowhunter',burst:1,dur:15,j3venom:{mult:.25,dur:6,n:2,rad:170}},'자신만: 15초 동안 내 덫에 걸린 적이 독에 걸립니다(6초 동안 1초마다 덫 피해의 25%). 독에 걸린 적은 1초마다 둘레 170 안의 적 둘에게 독을 옮깁니다.');
def('archer',26,'shadowclone','그림자 분신','Shadow Twins','phys','clones',30,40,{job3:'shadowhunter',dur:10,num:2,shotMul:.6,trapMul:.5},'그림자 분신 둘이 10초 동안 내 양옆에서 내 사격과 덫 놓기를 따라 합니다(분신의 사격은 60%, 분신의 덫은 피해 절반).');
def('archer',27,'drivehunt','몰이 사냥','Driven Hunt','phys','strike',30,40,{job3:'shadowhunter',phys:1,mult:10,rad:220,delay:2.6,j3drive:{rad:650,dur:2.4,spd:300}},'사냥 동료(늑대·매)의 그림자가 넓은 범위(반경 650)의 일반 몬스터를 가리킨 곳으로 몰아옵니다(보스·준보스는 안 끌림). 다 모이면 그 자리를 덮쳐 반경 220에 피해를 줍니다. 재사용 40초.');
def('archer',28,'abysstrap','심연 덫','Abyss Trap','phys','trap',35,18,{job3:'shadowhunter',phys:1,mult:3,rad:170,arm:.6,life:30,maxN:2,j3abyss:{n:5,t:2,mult:3,brk:50}},'걸린 적(보스 포함)을 땅 밑으로 2초 끌어내렸다가 떨어뜨리며 큰 피해(덫 피해의 세 배)를 줍니다. 일반 몬스터는 둘레 다섯까지. 보스는 끌려 내려가는 동안 무너짐 게이지가 크게(50) 찹니다. 동시에 둘.');
def('archer',29,'nighthunt','밤의 사냥','Night Hunt','phys','field',55,120,{job3:'shadowhunter',mult:0,rad:550,dur:12,j3night:{miss:.25,bossMiss:.1,dmg:.2,thr:.5},j3at:'me'},'파티(지대 안): 12초 동안 내 둘레 반경 550에 밤이 내립니다. 어둠 속의 적은 공격이 25% 빗나가고(보스 10%), 그 안의 적에게 내 덫·사냥 동료·사격이 20% 더 아픕니다(강화 피해 상한 안). 어둠 안의 파티원은 위협을 절반만 쌓습니다. 재사용 2분.');
// 화면 이름 · 외침 (job2d.js NAMES_J2와 같은 모양: [표시 이름, 외침]. 빈 외침은 머리 위에 글자를 띄우지 않는다)
const NAMES_J3WA={
  rampartbash:['램파트 스매시',''],lordstance:['소버린 스탠스',''],bewall:['리빙 램파트','내 뒤로 서라!'],provokemark:['마크 오브 디파이언스','네 상대는 나다!'],
  stonerampart:['스톤 램파트','길을 막아라!'],citadelecho:['시타델 에코','울려라, 성벽이여!'],lordduel:['소버린 듀얼','일대일이다!'],fortressswap:['포트리스 시프트','자리 바꿔!'],
  bulwarkcounter:['레트리뷰션','되갚아 주마!'],earthanchor:['어스 앵커','흔들리지 마라!'],unfallenkingdom:['언폴른 킹덤','이 왕국은 무너지지 않는다!'],
  lordcombo:['워로드 플러리',''],battleblood:['블러드 오브 더 필드',''],earthsplit:['어스 스플리터','갈라져라!'],weaponthrow:['헐 웨폰','받아라!'],
  executionleap:['익스큐션 리프','처단한다!'],bloodoath:['블러드 오스','피로 맹세하라!'],bloodharvest:['블러드 하베스트','피를 거둔다!'],lordgale:['워로드 게일','휩쓸어라!'],
  wardrum:['워 드럼','북을 울려라!'],phantomriders:['팬텀 라이더즈','기수들이여, 나와라!'],heavenlycharge:['차지 오브 더 호스트','천군이여, 돌격하라!'],
  windpierce:['윈드 피어서',''],breathmastery:['아처스 브레스',''],curvingshot:['시킹 샤프트','쫓아가라!'],windstep:['윈드 스텝',''],
  exposeweak:['익스포즈 위크니스','거기가 약점이다!'],scattervolley:['스캐터 발리','물러서라!'],piercinggaze:['피어싱 게이즈','모든 것이 보인다'],sevenstars:['세븐 스타즈','일곱 별이여!'],
  returnarrow:['리턴 애로우',''],oneshot:['원 샷','숨을 멈추고… 지금!'],starfallbow:['스타폴 보우','별이여, 떨어져라!'],
  shadowarrow:['섀도 샤프트',''],darkhunter:['다크 헌터',''],shadowhide:['섀도 베일',''],shadowtrap:['섀도 스네어',''],
  shadowstep:['섀도 스텝',''],huntground:['헌팅 그라운드','여기서 못 나간다'],poisonshade:['베놈 셰이드',''],shadowclone:['섀도 트윈즈','그림자여, 일어서라'],
  drivehunt:['드리븐 헌트','몰아라!'],abysstrap:['어비스 트랩',''],nighthunt:['나이트 헌트','밤이 내린다']};
const J3WA_IDS=Object.keys(NAMES_J3WA);
// j3spec: 새 효과라 일반 '비공격 마법' 점검 대신 '3차 전직 v20 (전사·궁수)' 묶음에서 따로 본다 (qa.js)
const J3WA_SPEC=['citadelecho','fortressswap','unfallenkingdom','bloodoath','bloodharvest','wardrum','poisonshade','shadowclone','nighthunt'];
for(const id of J3WA_IDS){const s=SPELLS[id],nm=NAMES_J3WA[id];if(!s)continue;s.j3wa=1;if(J3WA_SPEC.includes(id))s.j3spec=1;s.kn=s.n;s.n=nm[0];if(nm[1])s.chant=nm[1]}
// 시전 시간 (cast.js의 CAST_T에는 job3fx-wa.js가 넣는다 · 일격필살은 호흡 5면 1초)
const CAST_T_J3WA={sevenstars:.8,oneshot:2,heavenlycharge:1};
