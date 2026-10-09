// 아르세이아의 견습생 · 게임 창(앱) 도우미
// 게임 파일은 저장해 두지 않는다(새 판이 바로 보이도록 항상 서버에서 받는다).
// 하는 일은 하나: 서버에 닿지 못하면 하얀 화면 대신 안내 쪽을 보여 준다.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
const OFF='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>아르세이아의 견습생</title>'+
'<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b0912;color:#e8e2d2;font:16px/1.6 sans-serif;text-align:center;padding:20px;box-sizing:border-box}'+
'button{margin-top:14px;padding:10px 22px;font-size:16px;background:#c98a2e;color:#160f05;border:0;border-radius:4px;cursor:pointer}</style></head>'+
'<body><div><h2>서버에 연결하지 못했습니다</h2><p>인터넷 연결을 확인해 주세요.<br>무료 서버가 쉬고 있었다면 깨어나는 데 1분쯤 걸릴 수 있습니다.</p>'+
'<p style="color:#a39d8f;font-size:13px">캐릭터 저장은 이 기기에 그대로 남아 있습니다.</p><button onclick="location.reload()">다시 시도</button></div></body></html>';
self.addEventListener('fetch',e=>{
  if(e.request.mode!=='navigate')return;// 음악·그림 등은 평소처럼
  e.respondWith(fetch(e.request).catch(()=>new Response(OFF,{headers:{'Content-Type':'text/html; charset=utf-8'}})));
});
