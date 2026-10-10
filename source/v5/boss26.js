/* ---------- v26 보스방 3배 (사용자 2026-10-10 12:56 「보스방은 현재 크기의 최소한 3배 이상이 되도록」) ----------
   · v24에 넓힌 보스방(원래 방의 2.25배 · 큰 보스 2.6배)을 다시 3배 이상으로: 원래 방의 6.75배(큰 보스 7.8배) 넓이.
   · 모든 동굴 던전 보스방(v24 B24.gen이 켜진 던전 = 미궁 · 시련 · 투기장 · 끝 콘텐츠 빼고 모두). 모르가스(재의 성소)도 여기에 들어간다.
   · 넓힌 방 = 원래 보스방 가운데를 품는 직사각형(가로:세로 2.2배 안), 시작 방에서 될수록 먼 자리. 그 안에 걸치는 다른 방은 보스방에 합친다
     (시작 방은 빼고, 방이 8개 아래로 줄면 안 됨). 바닥만 늘리고 통로는 그대로라 걸어 들어갈 수 있다.
   · 넓힌 뒤에도 보스방이 시작 방에서 가장 먼 방이어야 한다(아니면 던전을 다시 만든다). 저장은 바꾸지 않는다. */
const B26={K:3};
function b26Grow(G,d){const {g,rooms}=G;if(!rooms||rooms.length<8)return false;const st=rooms[0];
  const far=()=>{const D=bfs(g,st.cx,st.cy);return rooms.slice(1).sort((a,b)=>D[tIdx(b.cx,b.cy)]-D[tIdx(a.cx,a.cy)])[0]};
  const br=far();if(!br)return false;const t=TYPES[d&&d.boss]||{},want=Math.ceil(br.w*br.h*((t.sc||2)>=2.7?2.6:2.25)*B26.K);
  // 넓힌 보스방 = 원래 보스방 가운데를 품는 직사각형(가로:세로 2.2배 안). 시작 방과는 한 칸 넘게 떨어지고, 시작 방에서 될수록 먼 자리
  const M=DN-2,touch=(r,x0,y0,x1,y1)=>x0<=r.i+r.w&&x1>=r.i-1&&y0<=r.j+r.h&&y1>=r.j-1,c=[];
  for(let w=Math.ceil(Math.sqrt(want/2.2));w<=M;w++){const h=Math.ceil(want/w);if(h>M||h<w/2.2)continue;if(h>w*2.2)continue;
    for(let x0=Math.max(1,br.cx-w+1);x0<=Math.min(br.cx,M-w+1);x0++)for(let y0=Math.max(1,br.cy-h+1);y0<=Math.min(br.cy,M-h+1);y0++){const x1=x0+w-1,y1=y0+h-1;if(touch(st,x0,y0,x1,y1))continue;
      const cx=x0+(w>>1),cy=y0+(h>>1);c.push({x0,y0,x1,y1,w,h,s:Math.abs(cx-st.cx)+Math.abs(cy-st.cy)-w*h*.001})}}
  c.sort((a,b)=>b.s-a.s);
  for(const q of c.slice(0,24)){const eat=rooms.filter(r=>r!==br&&r!==st&&touch(r,q.x0,q.y0,q.x1,q.y1));if(rooms.length-eat.length<8)continue;
    const keep={i:br.i,j:br.j,w:br.w,h:br.h,cx:br.cx,cy:br.cy},g0=g.slice(),r0=rooms.slice();
    for(let y=q.y0;y<=q.y1;y++)for(let x=q.x0;x<=q.x1;x++)g[tIdx(x,y)]=1;for(const r of eat)rooms.splice(rooms.indexOf(r),1);
    Object.assign(br,{i:q.x0,j:q.y0,w:q.w,h:q.h,cx:q.x0+(q.w>>1),cy:q.y0+(q.h>>1),b24:keep.w*keep.h,b26:eat.length});
    if(far()===br)return true;g.set(g0);rooms.length=0;rooms.push(...r0);Object.assign(br,keep);delete br.b24;delete br.b26}
  return false}
{const _g=genDungeon;genDungeon=function(d){if(!B24.gen||B24.gen!==d)return _g.apply(this,arguments);
  // bal24의 genDungeon(2.25배)을 지나 온 결과를 버리지 않도록, 원래 방 크기에서 새로 넓힌다: 넓히기 전 방으로 되돌릴 수 없으니 바깥 단계(B24.gen)를 잠깐 꺼서 원래 던전을 받는다
  const g0=B24.gen;let G=null;try{B24.gen=null;for(let k=0;k<40;k++){G=_g.call(this,d);if(!G.rooms||G.rooms.length<8)return G;if(b26Grow(G,d))return G}}finally{B24.gen=g0}
  // 3배가 끝내 안 되면 v24(2.25배)라도
  for(let k=0;k<30;k++){G=_g.call(this,d);if(!G.rooms||G.rooms.length<8)return G;if(b24Grow(G,d))return G}return G}}
window.__b24=Object.assign(window.__b24||{},{B26,b26Grow});
