/* ---------- v45: 궁수 원소 기술 세 가지(바운싱 스톰 · 아발란체 샷 · 허리케인 샷)에 그림 (사용자 「그래픽도 지금까지 완성된 것들 반영해줘」) ----------
   이 셋은 arch38.js가 자기 방식(A38.seg 'bnc' · A38.aval · A38.hur)으로 그려서 fx31의 보통 길(투사체 · 광선 · 장판)을 안 거친다.
   그림 묶음이 있으면 그 자리의 예전 손그림 대신 그림을 그린다(겹치지 않음). 「예전 그림」이거나 묶음이 없으면 예전 그대로. 판정 · 피해는 그대로.
   · 바운싱 스톰(366번): 튕길 때마다 생기는 줄을 따라 화살 띠(1번)를 줄 방향으로, 맞은 곳에 별(2번).
   · 아발란체 샷(368번): 솟는 얼음 가시마다 띠 1번(땅 기준, 솟는 동안 앞 칸부터), 깨질 때 띠 2번.
   · 허리케인 샷(370번): 회오리 자리에 띠를 돌려 가며, 크기는 회오리 반지름. */
const FX45={n:{bnc:0,aval:0,hur:0}};
{const _d=a38Draw;a38Draw=function(c,map){const A=A38;
  const gB=A.seg.some(q=>q.k==='bnc')&&FX40.g('arrowvortex'),gV=A.aval.length&&FX40.g('avalanche'),gH=A.hur.length&&FX40.g('hurricaneshot');
  if(!gB&&!gV&&!gH)return _d.apply(this,arguments);
  const sv={seg:A.seg,aval:A.aval,hur:A.hur};if(gB)A.seg=A.seg.filter(q=>q.k!=='bnc');if(gV)A.aval=[];if(gH)A.hur=[];
  try{_d.apply(this,arguments)}finally{A.seg=sv.seg;A.aval=sv.aval;A.hur=sv.hur}
  const ga=c.globalAlpha;
  try{
    if(gB){const F=FX31.fr(gB.PK,gB.m.b),F2=gB.m.i&&FX31.fr(gB.PK,gB.m.i),W=FX31.visW(gB.PK,gB.m.b);
      for(const q of A.seg){if(q.k!=='bnc')continue;const a=map(q.x1,q.y1),b=map(q.x2,q.y2),k=1-q.t/q.max,L=Math.hypot(b.x-a.x,b.y-a.y),sx=Math.max(.3,Math.min(2.5,L/W));
        FX31.fr(gB.PK,gB.m.b);FX31.img(c,gB.PK,F[FX31.kOf(F,k)],(a.x+b.x)/2,(a.y+b.y)/2-16,64,64,sx,Math.min(1,sx)*.8,Math.atan2(b.y-a.y,b.x-a.x),Math.min(1,(1-k)*2.5));
        if(F2){FX31.fr(gB.PK,gB.m.i);FX31.img(c,gB.PK,F2[FX31.kOf(F2,k)],b.x,b.y-16,64,64,.5,.5,0,1)}FX45.n.bnc++}}
    if(gV){const F=FX31.fr(gV.PK,gV.m.b),F2=gV.m.i&&FX31.fr(gV.PK,gV.m.i),ay=FX31.foot(gV.PK,gV.m.b);
      for(const v of A.aval){const sc=FX31.fit(gV.PK,gV.m.b,v.rad);for(const q of v.pts){const p=map(q.x,q.y);if(q.t45==null)q.t45=time;
        if(v.t<0||!F2){const k=Math.min(1,(time-q.t45)/.35),i=v.t<0?FX31.kOf(F,k*.6):Math.min(F.length-1,FX31.kOf(F,.6+.4*(1-v.t/v.hold)));FX31.fr(gV.PK,gV.m.b);FX31.img(c,gV.PK,F[i],p.x,p.y,64,ay,sc,sc,0,1)}
        else{FX31.fr(gV.PK,gV.m.i);FX31.img(c,gV.PK,F2[FX31.kOf(F2,1-v.t/v.hold)],p.x,p.y,64,FX31.foot(gV.PK,gV.m.i),sc,sc,0,1)}FX45.n.aval++}}}
    if(gH){const F=FX31.fr(gH.PK,gH.m.b),ay=FX31.foot(gH.PK,gH.m.b);
      for(const h of A.hur){const p=map(h.x,h.y),sc=FX31.fit(gH.PK,gH.m.b,h.rad);FX31.fr(gH.PK,gH.m.b);FX31.img(c,gH.PK,F[FX31.loopK(F,10,h.x*.01)],p.x,p.y,64,ay,sc,sc,0,Math.min(1,h.t*2,(h.max-h.t)*4));FX45.n.hur++}}
  }catch(err){if(window.__QA)throw err}finally{c.globalAlpha=ga}}}
setTimeout(()=>{try{if(window.__game)window.__game.FX45=FX45}catch(_){}},0);
