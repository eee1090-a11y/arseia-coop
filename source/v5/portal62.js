/* ---------- v62 던전 안 문도 새 포탈 그림으로 (사용자 2026-11-15 「그리고 포탈 그래픽은 왜 옛날꺼니」) ----------
   들판의 지역 문(edgeportal)은 v28부터 새 그림(cg-town 079_region_portal_structure · 없으면 flare-portal)인데,
   던전 · 미궁 · 시련의 방 안의 문(나가는 문 · 짝문 · 다음 층 문 · 다음 길 · 잠긴 짝문)은 처음 판의 파란 고리 세 줄(r5.js)과 보라 고리(maze21.js)로만 그려지고 있었다.
   · 이제 DG.portals와 잠긴 다음 층 문(DG.a21.door)을 들판 지역 문과 같은 새 그림으로, 깊이 순서(벽 · 몬스터 · 나와 앞뒤)에 맞춰 그린다.
     빛 색: 나가는 문 하늘색 · 문마다 정한 색(짝문 보라 등) · 잠긴 문 잿빛. 크기 PT62.s.
   · 그림 묶음을 아직 못 받았거나 「옛 그림」 설정이면 예전 고리 그대로(그 프레임에 새 그림을 그렸으면 고리는 안 그림).
   · 문 이름(나가는 문 · 짝문 …)은 새 그림 위로 올린다. 저장은 바꾸지 않는다. */
const PT62={s:.8,lab:124,lock:'#6a6478'};
const pt62Col=(p,lock)=>lock?PT62.lock:p.col||(p.exit?'#9fe0ff':'#c9b4ff');
const pt62On=p=>!!p&&p.d62===frameN;
function pt62Draw(o){const p=o.dp62,s=o._s;if(!p||!s)return false;const d={col:pt62Col(p,o.lock),s:PT62.s};let ok=false;
  try{ok=(typeof cgPortal==='function'&&cgPortal(ctx,d,s.x,s.y,1,time))||(typeof flPortal==='function'&&flWant()&&flPortal(ctx,d,s.x,s.y,1,time))}catch(err){if(window.__QA)throw err}
  if(ok)p.d62=frameN;return ok}
// 깊이 순서 목록에 문을 넣는다 (던전에서는 render가 wbDraw로 벽을 넣는 자리)
{const _wb=wbDraw;wbDraw=function(vis){const r=_wb.apply(this,arguments);try{if(DG){const add=(p,lock)=>{const s=W2S(p.x,p.y);if(onScreen(s,220))vis.push({dp62:p,lock,x:p.x,y:p.y,_s:s})};
    for(const p of DG.portals||[])add(p,0);const a=DG.a21;if(a&&a.door&&!a.open)add(a.door,1)}}catch(err){if(window.__QA)throw err}return r}}
{const _dd=drawDecor;drawDecor=function(d){if(d&&d.dp62){pt62Draw(d);return}return _dd.apply(this,arguments)}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{PT62,pt62Draw})}catch(_){}},0);
