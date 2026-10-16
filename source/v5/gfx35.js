/* ---------- v35: 그림 어긋남 고침 (사용자 2026-10-15 「던전 문이랑 안의 네모난 포탈 어긋나있어」 · 「마을 가운데 분수와 그 아래의 동그란 돌맹이들 원이 어긋나있어」) ----------
   · 던전 입구: 빛 층(문 안을 채우는 빛)을 입구 그림의 땅 기준점에 세워 그려서, 문이 아니라 오른쪽 벽이나 바닥에 떠 있었다.
     입구 17종마다 문 구멍 자리(그림에서 잰 값)에 빛의 가운데를 맞추고 문 크기로 줄이거나 늘린다. GX35[종류]=[x 옮김, y 옮김, 가로 배율, 세로 배율] (입구 기준점 기준).
     환상 열석(circle)은 문이 없어 돌 고리 가운데 바닥에 깐다.
   · 마을 한가운데: 땅에 구운 둥근 경계석(ground.js, 마을 중심에서 반지름 76)은 마을 중심이 원의 가운데인데,
     분수 · 동상 그림은 그림 맨 아래(앞 테두리)를 마을 중심에 세워서 그림이 위로 떠 보였다. 받침 바닥 원의 가운데를 마을 중심에 맞춘다.
     분수 31 · 브렌힐 동상 36 (그림 크기 1배 기준, 그림 아래 끝 − 받침 가로 반폭의 절반으로 잰 값). 동상 받침은 넓어서 경계석 반지름을 86으로. */
const GX35={barrow:[-28.2,-22.4,0.69,0.53],cave:[-22.3,-24.6,1.09,1.16],circle:[-22.0,-36.6,0.9,0.9],crypt:[-16.7,-29.8,0.74,0.6],forge:[-25.1,-20.3,1.27,0.71],fortgate:[-36.3,-37.4,0.95,0.75],icecave:[-4.6,-29.5,0.74,0.91],mine:[-29.7,-22.5,1.28,1.18],pyramid:[-29.9,-34.5,0.68,0.73],rift:[0.4,-2.9,1.14,1.13],roots:[-33.2,-23.9,0.88,0.87],sewer:[-36.0,-41.4,0.53,0.73],shrine:[-35.4,-37.0,0.91,0.78],sunken:[-20.7,-36.5,0.65,0.59],sunken2:[-15.2,-47.8,0.49,0.62],tower:[-9.8,-40.6,0.65,0.83],wreck:[-11.0,-32.4,0.77,0.62]};
const FT35={fountain:31,statue:36};
{const _dg=cgDgEnt;cgDgEnt=function(d){const c=d.cave;if(!c||c.w3k||typeof FLDG!=='object')return false;const PK=cgPK(CG.DGE);if(!PK)return false;// 묶음을 먼저 받아야 CG.dg 목록이 채워진다
  const A=FLDG[c.id]||['cave'],O=CG.dg[A[0]],G=GX35[A[0]];if(!G||!O||!O.s||!O.g)return _dg.apply(this,arguments);const s=d._s,t=reduceMotion?0:time;
  cgDraw(ctx,PK,O.s,s.x,s.y,1);const r=PK.meta.r[O.g];if(!r)return true;
  const a=(typeof flLo==='function'&&flLo())?.45:.38+.18*Math.sin(t*3),tc=typeof flPkTint==='function'?flPkTint(PK,O.g,c.torch||'#ff9a40',1,'m'):null;
  const w=r[2]*G[2],h=r[3]*G[3],x=s.x+G[0]-r[4]*G[2],y=s.y+G[1]-r[5]*G[3];
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;if(tc)ctx.drawImage(tc,0,0,r[2],r[3],x,y,w,h);else ctx.drawImage(PK.img,r[0],r[1],r[2],r[3],x,y,w,h);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';return true}}
// 받침 가운데를 마을 중심에: 그림만 아래로 내려 그린다 (자리 · 부딪힘 · 이름표 기준은 그대로)
{const _cl=cgLand;cgLand=function(d){if(d.k!=='fountain'||!d._s)return _cl.apply(this,arguments);const s0=d._s;d._s={x:s0.x,y:s0.y+FT35.fountain*(d.s||1)};try{return _cl.apply(this,arguments)}finally{d._s=s0}}}
// 동상은 그리는 자리(cgDec)에서 내린다 — f29Statue 자체(물 · 받침 그림 자리)는 그대로
{const _cd=cgDec;cgDec=function(c,d,x,y,k){if(d&&d.k==='statue'&&!d.og&&!DG)y+=FT35.statue*(d.s||1)*(k||1);return _cd.call(this,c,d,x,y,k)}}
{const T0=TOWNS.find(t=>t.id==='brenhill');if(T0)T0.ringR=86}
