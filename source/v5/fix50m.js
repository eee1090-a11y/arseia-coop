/* ---------- v50 휴대폰 메뉴는 모두 ☰ 안으로 (사용자 2026-10-30 「폰 화면에서 메뉴는 다 햄버거 버튼안에 넣어달라고 했는데 왜 다 나와있어? 화면 너무 가리잖아」) ----------
   원인: v45 ux45a.js P5 「창 단추 늘 보이기」가 휴대폰(가로 · 세로 모두) ☰ 바로 옆에 그림 단추 줄(#u45quick: 스킬 트리 · 가방 · 성장 · 지도 · 대화)을 늘 보이게 했다.
   고침: 그 줄을 휴대폰에서 숨긴다. 같은 칸은 ☰를 누르면 나오는 막대(#u45bar)에 모두 그대로 있다(가방 · 스킬 트리 · 성장 · 지도 · 의뢰 · 같이 · 대화 · 설정).
   빨간 점 길잡이는 ☰에 그대로 뜬다(u45DotTick의 D.menu). 귀환 두루마리 단추(v22, 물건)는 ☰ 옆 그대로. PC는 바뀌지 않음. 저장 · 수치 바뀜 없음.
   붙는 곳: ux45a.js 뒤 아무 곳(b5.js 앞). */
{const st=document.createElement('style');st.id='fix50m';st.textContent=`body.m22 #u45quick{display:none!important}`;document.head.appendChild(st)}
