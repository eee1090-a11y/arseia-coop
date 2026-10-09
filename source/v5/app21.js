// v21 게임 창(앱으로 설치) · 같이 하기 서버에서 열었을 때만 (server.js가 window.APP_INSTALL을 켠다). 게임 주소(Artifact)·#qa에서는 아무것도 안 한다.
(()=>{if(!window.APP_INSTALL)return;
  const inApp=()=>{try{return matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true}catch(_){return false}};
  // 설치한 창에서는 브라우저가 저장을 함부로 비우지 않게 부탁해 둔다(허락 여부와 상관없이 게임은 그대로)
  if(inApp()){try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist().catch(()=>{})}catch(_){}return}
  const body=document.getElementById('introBody');if(!body||!body.parentNode)return;
  const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const box=document.createElement('div');box.id='appInstall';
  box.innerHTML='<h2>게임 창으로 설치</h2><p class="muted">주소창 없는 게임 전용 창으로 엽니다. 컴퓨터는 바탕화면·시작 메뉴, 휴대폰은 홈 화면에 「아르세이아」 아이콘이 생깁니다. 새 판이 나오면 창을 다시 열기만 하면 됩니다. 이 브라우저의 캐릭터가 그대로 보입니다.</p>'+
    '<div class="row" style="margin-top:0"><button type="button" id="appInstBtn" hidden>게임 창으로 설치</button></div><p class="muted" id="appInstMsg"></p>';
  body.parentNode.insertBefore(box,body.nextSibling);
  const btn=box.querySelector('#appInstBtn'),m=box.querySelector('#appInstMsg');
  const hint=()=>{if(window.__bip){btn.hidden=false;m.textContent='';return}btn.hidden=true;
    m.innerHTML=ios?'아이폰·아이패드: Safari 아래쪽 <b>공유</b> 버튼 → <b>홈 화면에 추가</b>. 아이폰은 홈 화면 앱의 저장소가 따로라서, 처음 한 번 시작 화면의 「캐릭터 옮기기」(내보내기 → 가져오기)로 캐릭터를 옮겨 주세요.'
      :'설치 버튼이 안 보이면 크롬·엣지 주소창 오른쪽의 <b>설치</b> 아이콘이나, 메뉴(⋮ 또는 …) → <b>앱 설치</b> / <b>홈 화면에 추가</b>를 누르세요. 이미 설치했다면 바탕화면·홈 화면의 아이콘으로 여세요.'};
  btn.onclick=()=>{const e=window.__bip;if(!e)return;window.__bip=null;
    try{e.prompt();e.userChoice.then(r=>{if(r&&r.outcome==='accepted'){btn.hidden=true;m.textContent='설치했습니다. 이제 「아르세이아」 아이콘으로 열면 게임 창으로 뜹니다.'}else hint()}).catch(hint)}catch(_){hint()}};
  addEventListener('app-installable',hint);
  addEventListener('appinstalled',()=>{btn.hidden=true;m.textContent='설치했습니다. 이제 「아르세이아」 아이콘으로 열면 게임 창으로 뜹니다.'});
  hint();
})();
