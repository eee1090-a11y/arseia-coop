
/* ---------- 휴대폰: 창을 열면 「중요한 의뢰가 열렸습니다」 카드를 잠깐 숨기기 (2026-11-03, 협업자 요청 「모바일 최적화 · 화면 · 버튼 정리」) ----------
   - 고친 문제: 중요한 의뢰 카드(quest21.js #qn21, z-index 45)가 창(#panel: 가방 · 스킬 트리 · 상점 · 창고 · 도감 · 짝문 …)보다 위에 떠서,
     휴대폰(가로 844×390 · 667×375 · 세로 390×844 모두)에서 창 한가운데를 덮었다. 창이 열려 있으면 게임이 멈춰 카드가 40초 뒤 저절로 닫히지도 않아
     창을 닫거나 「나중에」를 누를 때까지 상점 목록 · 능력치 단추 · 스킬 트리를 가렸다.
   - 바꾼 것(휴대폰 M22.phone()에서만): 창(#panel)이나 첫 화면(#intro)이 열려 있는 동안 카드를 보이지 않게만 한다(지우지 않음).
     창을 닫으면 카드가 그대로 다시 보인다(받기 · 내용 보기 · 나중에 · 남은 시간 그대로). 알림판 · 의뢰 일지의 「중요한 의뢰」 칸도 그대로.
   - 그대로인 것: PC 화면, 카드 내용 · 단추 · 뜨는 때, 의뢰 · 수치 · 저장(새 저장 칸 없음, 캐릭터 키를 건드리지 않음).
   - 붙는 곳: body에 'm52cover' 표시 하나. #panel · #intro의 hidden이 바뀔 때(MutationObserver)와 화면 크기가 바뀔 때 다시 본다.
     b5.js 앞에 붙으므로 b5의 panel 등은 쓰지 않고 DOM(#panel · #intro)만 본다. */
const M52={on:false,obs:null};
function m52Cover(){const pn=document.getElementById('panel'),it=document.getElementById('intro');
  return !!(typeof M22==='object'&&M22.phone()&&((pn&&!pn.hidden)||(it&&!it.hidden)))}
function m52Sync(){const b=document.body;if(!b)return M52.on;const on=m52Cover();if(on!==M52.on||b.classList.contains('m52cover')!==on){M52.on=on;b.classList.toggle('m52cover',on)}return on}
setTimeout(()=>{
  const st=document.createElement('style');st.textContent='body.m52cover #qn21{display:none!important}';document.head.appendChild(st);
  try{M52.obs=new MutationObserver(()=>m52Sync());for(const id of ['panel','intro']){const el=document.getElementById(id);if(el)M52.obs.observe(el,{attributes:true,attributeFilter:['hidden']})}}catch(_){}
  addEventListener('resize',()=>m52Sync());addEventListener('orientationchange',()=>setTimeout(m52Sync,200));m52Sync()},0);
