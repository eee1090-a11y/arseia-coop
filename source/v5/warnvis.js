/* ---------- v53: 보스 위험 장판이 내 큰 장판 그림에 가려지지 않게 (warnvis.js · fxalign.js 뒤 · b5.js 앞) ----------
   사용자 요청(2026-11-03): 「큰 장판기술을 쓰면 보스의 장판이 안보이는 문제가 있어. 이것도 가시성을 해결해줘」.
   원인: 보스 경고(warns)는 r5.js drawV5Glow에서 밝게 더하기(lighter)로 옅게(테두리 .5 · 안쪽 .18) 그려지고,
         그 뒤에 내 기술 그림(FX31 · 전사 그림, 하늘에서 떨어지는 것 · 터지는 것)이 덮어 그려진다. 금빛 · 흰 장판 위에서는 더하기 빛이 거의 안 보인다.
   고침(그림만, 판정 · 피해 · 경고 시간 그대로):
   · ① 화면 가로 160px보다 큰 내 기술 그림이 보스 경고와 겹치면 그 그림을 40% 진하기로 그린다(경고가 있는 동안만, 겹치는 그림만).
   · ② 모든 기술 그림 · 입자 · 번개를 다 그린 뒤(글자 · 체력바 바로 전) 보스 경고를 한 번 더 또렷하게: 검은 테두리 + 경고 색 실선 + 차오르는 안쪽(덮어 칠하기),
        떨어지기 0.5초 전부터 흰 테두리가 깜빡임. 휴대폰의 진한 경고(mux51.js)도 그대로 둔다. */
const WV={DIM:.4,MINW:160,n:{dim:0,draw:0},fr:-1,L:[],
  // 이번 화면의 경고 목록 (화면 좌표 타원) — 한 화면에 한 번
  list(){if(this.fr===frameN)return this.L;this.fr=frameN;const L=this.L;L.length=0;
    for(const w of warns){if(w.done||!(w.t>0)||!(w.rad>0))continue;const s=W2S(w.x,w.y),rx=w.rad*KI*1.4142;L.push({x:s.x,y:s.y,rx,ry:rx/2})}return L},
  // 그림 네모(칸 128을 배율대로)가 경고 타원과 겹치나
  hit(x,y,ax,ay,sx,sy){const L=this.list();if(!L.length)return false;sx=Math.abs(sx);sy=Math.abs(sy);if(128*sx<this.MINW)return false;
    const x0=x-ax*sx,x1=x+(128-ax)*sx,y0=y-ay*sy,y1=y+(128-ay)*sy;
    for(const q of L){const nx=Math.max(x0,Math.min(q.x,x1)),ny=Math.max(y0,Math.min(q.y,y1)),dx=(nx-q.x)/q.rx,dy=(ny-q.y)/q.ry;if(dx*dx+dy*dy<=1)return true}return false},
  // ② 또렷한 경고
  draw(){const L=warns;if(!L.length)return;let n=0;G();const op=ctx.globalCompositeOperation;ctx.globalCompositeOperation='source-over';
    try{for(const w of L){if(w.done||!(w.t>0)||!(w.rad>0))continue;const s=W2S(w.x,w.y);if(!onScreen(s,w.rad*KI*1.5+20))continue;n++;
      const k=clamp(1-w.t/(w.max||1),0,1),col=w.col||'#ff5a3a';
      ctx.globalAlpha=.55;ctx.strokeStyle='#000';ctx.lineWidth=9;ctx.beginPath();ctx.arc(w.x,w.y,w.rad,0,6.283);ctx.stroke();
      ctx.globalAlpha=.95;ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();
      ctx.globalAlpha=.14+.16*k;ctx.fillStyle=col;circ(w.x,w.y,w.rad*Math.max(.08,k));
      if(w.t<.5&&w.dmg>0){const f=.5+.5*Math.sin(time*36);ctx.globalAlpha=.4+.5*f;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(w.x,w.y,w.rad,0,6.283);ctx.stroke()}}}
    finally{ctx.globalAlpha=1;ctx.globalCompositeOperation=op;S()}this.n.draw+=n}};
// ① 겹치는 큰 그림은 옅게 (FX31 · 전사 WFX · WFX2)
{const _i=FX31.img;FX31.img=function(c,PK,f,x,y,ax,ay,sx,sy,rot,a){if(a>0&&warns.length&&WV.hit(x,y,ax,ay,sx,sy)){a*=WV.DIM;WV.n.dim++}return _i.call(this,c,PK,f,x,y,ax,ay,sx,sy,rot,a)}}
{const _w=WFX.img;WFX.img=function(c,PK,st,f,x,y,ax,ay,sx,sy,rot,a){if(a>0&&warns.length&&WV.hit(x,y,ax,ay,sx,sy)){a*=WV.DIM;WV.n.dim++}return _w.call(this,c,PK,st,f,x,y,ax,ay,sx,sy,rot,a)}}
{const _p=WFX2.pic;WFX2.pic=function(c,PK,st,f,x,y,ax,ay,sx,sy){if(warns.length&&arguments[14]>0&&WV.hit(x,y,ax,ay,sx,sy)){const A=[...arguments];A[14]*=WV.DIM;WV.n.dim++;return _p.apply(this,A)}return _p.apply(this,arguments)}}
// ② 글자 · 체력바 바로 전에 (b4.js render: 모든 효과 → drawV5Labels)
{const _l=drawV5Labels;drawV5Labels=function(){try{if(warns.length)WV.draw()}catch(err){if(window.__QA)throw err}return _l.apply(this,arguments)}}
window.__wv=WV;
