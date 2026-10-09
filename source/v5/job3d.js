/* ---------- v20 (CORE): 3차 전직 기본 값 (설계: rpg/job-advancement-3/3차전직-컨셉.md 1·2절) ----------
   job2d.js 바로 뒤, 3차 스킬 데이터(job3d-mp.js · job3d-wa.js) 앞에 붙는다. 실행 중 동작은 job3.js, 퀘스트는 job3q.js.
   · 100레벨 3차 전직. 2차 갈래마다 3차 갈래 하나(JOB3_OF). 갈래마다 11개, 위계 20~30 = 열리는 레벨 J3_LV.
   · 3차 스킬은 최대 10점. 한 점마다 피해 +12%(마법 계열 1.2레벨 · 물리 계열 2레벨, 더하는 식). */
const J3LV=100,J3_MAXSK=10,J3KC={mage:1.2,priest:1.2,warrior:2,archer:2},J3K=cls=>J3KC[cls]||1.2;
const J3_LV=[100,100,103,106,109,112,115,119,123,127,130];
const JOB3_OF={archmage:'archsorcerer',summoner:'spiritking',inquisitor:'executor',archbishop:'saint',guardian:'bulwark',berserker:'warlord',hawkeye:'divinearcher',ranger:'shadowhunter'};
const JOB2_OF3={};for(const k in JOB3_OF)JOB2_OF3[JOB3_OF[k]]=k;
const JOB3_IDS={mage:['archsorcerer','spiritking'],priest:['executor','saint'],warrior:['bulwark','warlord'],archer:['divinearcher','shadowhunter']};
const JOB3={
  mage:{archsorcerer:{n:'대마법사',tree:'금기',from:'archmage',desc:'금기라 불리던 전쟁 마법을 다룬다. 길게 외우고 크게 쏟아붓는 화력. 동료가 시전을 지켜 준다.'},
        spiritking:{n:'정령왕의 계약자',tree:'정령왕',from:'summoner',desc:'네 정령왕과 계약한 사람. 소환 군단을 부리고, 동료에게 수호 정령을 붙여 준다.'}},
  priest:{executor:{n:'빛의 집행자',tree:'집행',from:'inquisitor',desc:'심판을 직접 집행한다. 낙인을 퍼뜨려 무리를 정리하고, 보스를 빛의 감옥에 가둔다.'},
          saint:{n:'성자',tree:'기적',from:'archbishop',desc:'자기 생명을 바쳐 기적을 일으킨다. 파티 전체 부활·무적, 동료 하나를 밀어 주는 가속. 공격은 약하다.'}},
  warrior:{bulwark:{n:'성벽의 군주',tree:'성벽',from:'guardian',desc:'파티 전체의 성벽. 범위 공격을 대신 받고, 벽을 세워 전장을 나눈다.'},
           warlord:{n:'전쟁군주',tree:'전쟁',from:'berserker',desc:'전장을 휘어잡는 군주. 투혼을 쌓아 터뜨리고, 환영 기병대를 부른다.'}},
  archer:{divinearcher:{n:'신궁',tree:'신궁',from:'hawkeye',desc:'숨을 고를수록 강해지는 한 발의 극치. 보스의 약점을 드러내 파티 치명타를 올린다.'},
          shadowhunter:{n:'그림자 사냥꾼',tree:'그림자',from:'ranger',desc:'그림자 속에서 덫과 짐승을 부린다. 몹을 가둬 두고 위협을 떼어 낸다.'}}};
for(const c in JOB3)for(const b in JOB3[c])JOB3[c][b].title=JOB3[c][b].n;
