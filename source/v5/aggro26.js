/* ---------- v26 선공 · 비선공 (사용자 2026-10-10 12:35) ----------
   「몬스터들이 선공몹인지 아닌지도 구분 … 저렙존의 몬스터들까지 모두 선공몹이면 근접캐릭터인 전사가 불리 … 모두 선공몹이고 인식 범위가 넓으면 … 둘러싸여서 금방 죽을 것 같아」
   · 들판(던전 밖) 몬스터만 바꾼다. 비선공(P)은 먼저 맞기 전까지 다가오지 않는다(맞으면 그때부터 쫓아온다 · 예전과 같은 e.aggroed).
   · 선공(A)은 알아채는 거리를 예전의 70%로 줄인다(무리 전체가 한꺼번에 몰려오지 않게).
   · 저레벨 남부는 대부분 비선공, 레벨이 오를수록 선공이 늘지만 높은 지역에도 비선공을 섞는다(지역마다 넷 중 둘, 지옥 지역은 넷 중 셋 안팎).
   · 그대로 선공(예전 거리): 보스 · 준보스 · 정예 · 던전 안 몬스터 · 이 표에 없는 몬스터(표에 없으면 선공, 거리만 70%).
   · 보이기: 선공 몬스터 머리 위 작은 빨간 표시(아직 나를 쫓지 않을 때) · 몬스터 이름 창에 「선공」/「비선공」 */
const AG26={K:.7,
  P:new Set(['slime','wolf','ashhound','goblin','ashsoldier','ogre',
    'p_ogre','p_storm','f_slime','f_golem','f_dryad','lk_crab','lk_toad','lk_elem','h_cairn','h_troll','d_mummy','d_sand','sc_kobold','sc_golem','k_bear','k_shaman','i_yeti','i_elem',
    'c_dust','c_automaton','j_lizard','j_golem','t_cultist','t_sentinel','l_golem','l_elem','s_crab','s_siren','v_maw','v_seer',
    'a_brute','ss_crab','ss_giant','th_cloud','z_golem','rt_beetle','rt_golem','ec_maw'])};
const ag26Kind=e=>{const t=TYPES[e.k]||{};if(DG||e.boss||e.elite||t.boss||t.mini||t.trial)return 'X';return AG26.P.has(e.k)?'P':'A'};
aggroOf=(e,t)=>{const m=ag26Kind(e);return m==='P'?0:m==='A'?t.aggro*AG26.K:t.aggro*(e.boss?1.4:1)};
const ag26Tag=e=>{const m=ag26Kind(e);return m==='P'?' · 비선공':' · 선공'};
// 머리 위 작은 빨간 표시: 선공 들판 몬스터가 아직 나를 쫓지 않을 때만
{const _de=drawEnemy;drawEnemy=function(e){_de(e);if(DG||e.dead||e.aggroed||ag26Kind(e)!=='A')return;const s=e._s,t=TYPES[e.k];if(!s||!t)return;
  const sc=e.sc||(e.elite?1.25:1),y=s.y-((MON_H[t.draw]||40)*sc)-14;
  ctx.fillStyle='#ff5a3a';ctx.strokeStyle='rgba(20,8,6,.85)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(s.x-5,y-6);ctx.lineTo(s.x+5,y-6);ctx.lineTo(s.x,y+1);ctx.closePath();ctx.fill();ctx.stroke()}}
