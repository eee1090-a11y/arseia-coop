/* ---------- v40: 궁수 남은 그림 21가지 + 히드라 몸 그림 (fx31.js 표 114~124 · 142~149, arch38.js 뒤 · qa.js 앞) ----------
   사용자 요청(2026-10-18): 「이번에 넣었어야지」 「당장 넣고 패치 업로드해」 — Codex가 그려 둔 궁수 그림 31장과 히드라 몸 2장을 모두 게임에 넣는다.
   · 장판 · 내리꽂기 · 광선 · 화살 · 강화 · 구르기 · 부채꼴은 fx31.js가 그대로 그린다(표에 줄만 더함).
   · 따로 그리는 궁수 기술은 여기서 그 자리의 예전 그림 대신 그림을 그린다(겹치지 않음):
     센트리 발리스타(포대 · 포대 화살 · 맞힘) · 퓨즈 애로우(꽂힌 폭약 · 터짐) · 애로우 펜스(울타리) · 리트리트 넷(그물) · 보우 오브 헤븐(머리 위 활 · 내려오는 화살 · 터짐)
     세븐 스타즈 · 스타폴 보우(떨어지는 별 · 땅에 맞음) · 리턴 애로우(오가는 화살 · 맞힘) · 섀도 트윈즈(분신이 나타날 때 빛) · 스캐터 발리(예전 부채꼴 빛은 그림이 대신).
   · 히드라: 몸을 그림으로(서 있을 때 4칸 반복 · 물 때 6칸). 남은 시간 줄은 그대로. 묶음 fx-mage-hydra.js는 히드라가 나와 있을 때만 받는다.
   · 그림이 없거나(받는 중 · 못 받음) 「화면」 설정이 「예전 그림」이면 모두 예전 그대로. 판정 · 피해 · 저장은 건드리지 않는다. */
const FX40={HY:'mage-hydra',HI:'fx_hydra_body_idle',HA:'fx_hydra_body_attack',
  // 띠 3번(포대 맞힘 · 폭약 터짐 · 하늘의 활 터짐)
  s3(m){return m.b.replace('_1_','_3_')},
  // 그림이 들어와 있으면 {m,PK} (없으면 받을 줄에 세움)
  g(id,ask){if(!FX31.on())return null;const g=FX31.get(id,ask);return g&&FX31.fr(g.PK,g.m.b)?g:null},
  // 띠 하나의 칸들
  F(g,st){return FX31.fr(g.PK,st)},
  // 아래쪽이 잘린 칸들도 같은 자리에 서도록: 칸 안 그림의 발
  ft(g,st){return FX31.foot(g.PK,st)},
  hy(){if(!FX31.on())return null;const PK=FX31.P[this.HY];if(PK){PK.used=FX31.now();return PK}FX31.need(this.HY);return null},
  n:{tur:0,fen:0,bomb:0,net:0,sky:0,star:0,thr:0,hy:0}};
// 포대 화살은 맞힘 그림이 띠 3번 · 퓨즈 애로우의 맞힘은 예전 빛(띠 2번은 꽂힌 폭약) · 하늘의 활 터짐은 띠 3번
{const M=FX31.M;if(M.pierceblow){M.pierceblow.pa=M.pierceblow.i;M.pierceblow.i=FX40.s3(M.pierceblow)}
  if(M.splitarrow){M.splitarrow.fu=M.splitarrow.i;M.splitarrow.bo=FX40.s3(M.splitarrow);M.splitarrow.i=null}
  if(M.heavenbow){M.heavenbow.fa=M.heavenbow.i;M.heavenbow.i=FX40.s3(M.heavenbow)}}

/* ----- arch34.js 그리기(포대 · 울타리 · 폭약 · 그물 · 하늘의 활): 그림이 있는 것은 예전 목록에서 잠깐 빼고 그린 뒤 그림으로 ----- */
{const _ad=a34Draw;a34Draw=function(c,map){if(!FX31.on())return _ad.apply(this,arguments);
  const T=A34.tur.length&&FX40.g('pierceblow'),Fn=A34.fen.length&&FX40.g('elemrain'),B=A34.bomb.length&&FX40.g('splitarrow'),N=A34.net.length&&FX40.g('backshot'),
    K=(A34.sky.length||A34.fall.length)&&FX40.g('heavenbow');
  const sv={};const hide=(k,on)=>{if(on&&A34[k].length){sv[k]=A34[k];A34[k]=[]}};
  hide('tur',T);hide('fen',Fn);hide('net',N&&FX40.F(N,N.m.i));hide('bomb',B&&FX40.F(B,B.m.fu));hide('sky',K);hide('fall',K&&FX40.F(K,K.m.fa));
  try{_ad.apply(this,arguments)}finally{for(const k in sv)A34[k]=sv[k]}
  try{FX40.drawA34(c,map,sv,{T,Fn,B,N,K})}catch(err){if(window.__QA)throw err}finally{c.globalAlpha=1}}}
FX40.drawA34=function(c,map,sv,G){const op=c.globalCompositeOperation;c.globalCompositeOperation='source-over';
  // 그물(땅) — 범위 반지름에 맞춤
  if(sv.net){const g=G.N,F=this.F(g,g.m.i);for(const n of sv.net){const p=map(n.x,n.y);if(!FXL.lod(p.x,p.y,n.rad))continue;
    FX31.img(c,g.PK,F[FX31.loopK(F,6,n.x*.01)],p.x,p.y,64,64,FX31.fit(g.PK,g.m.i,n.rad),FX31.fit(g.PK,g.m.i,n.rad),0,.85*Math.min(1,n.t*2,(n.max-n.t)*6));this.n.net++}}
  // 화살 울타리 — 울타리 줄의 화면 방향으로 돌려 길이에 맞춤(그림 자체가 18도 기울어 있음)
  if(sv.fen){const g=G.Fn,F=this.F(g,g.m.b),ay=this.ft(g,g.m.b);for(const f of sv.fen){const A=map(f.x-f.ux*f.h,f.y-f.uy*f.h),Bp=map(f.x+f.ux*f.h,f.y+f.uy*f.h),L=Math.hypot(Bp.x-A.x,Bp.y-A.y),p=map(f.x,f.y);
    if(L<4||!FXL.lod(p.x,p.y,L/2+40))continue;let r=Math.atan2(Bp.y-A.y,Bp.x-A.x)-.314;while(r>Math.PI/2)r-=Math.PI;while(r<-Math.PI/2)r+=Math.PI;
    const sx=L/(FX31.visW(g.PK,g.m.b)*.95),sy=Math.max(.55,Math.min(1.1,sx*.6))*Math.min(1,(f.max-f.t)*8);
    FX31.img(c,g.PK,F[FX31.loopK(F,7,f.x*.01)],p.x,p.y,64,ay,sx,sy,r,Math.min(1,f.t*2,(f.max-f.t)*5));this.n.fen++}}
  // 쇠뇌 포대 — 발을 포대 자리에
  if(sv.tur){const g=G.T,F=this.F(g,g.m.b),ay=this.ft(g,g.m.b);for(const q of sv.tur){const p=map(q.x,q.y);if(!FXL.lod(p.x,p.y-30,60))continue;
    FX31.img(c,g.PK,F[FX31.loopK(F,6,q.x*.01)],p.x,p.y,64,ay,.62,.62,0,Math.min(1,q.t*2,(q.max-q.t)*6));this.n.tur++}}
  // 꽂힌 폭약 — 적 몸 위(1초 남으면 깜빡임)
  if(sv.bomb){const g=G.B,F=this.F(g,g.m.fu);for(const b of sv.bomb){const e=b.e;if(e.dead)continue;const p=map(e.x,e.y),bl=b.t<1?(Math.sin(time*30)>0?1:.5):1;
    FX31.img(c,g.PK,F[FX31.loopK(F,8,e.x*.01)],p.x+e.r*.3,p.y-e.r*1.2-18,64,64,.42*(1+.08*Math.min(b.n,5)),.42*(1+.08*Math.min(b.n,5)),0,bl);this.n.bomb++}}
  // 하늘의 활(머리 위) · 내려오는 빛 화살
  if(sv.sky){const g=G.K,F=this.F(g,g.m.b);for(const q of sv.sky){const o=q.own;if(!o)continue;const p=map(o.x,o.y),bob=Math.sin(time*2.4)*4;
    FX31.img(c,g.PK,F[FX31.loopK(F,6)],p.x,p.y-118+bob,64,64,.72,.72,0,.95*Math.min(1,q.t*2,(q.max-q.t)*4));this.n.sky++}}
  if(sv.fall){const g=G.K,F=this.F(g,g.m.fa);for(const f of sv.fall){const k=1-f.t/f.max,a=map(f.sx,f.sy),b=map(f.x,f.y),x0=a.x,y0=a.y-150,x=x0+(b.x-x0)*k,y=y0+(b.y-y0)*k;
    FX31.img(c,g.PK,F[Math.min(F.length-1,(k*3)|0)],x,y,64,64,.62,.62,0,1);this.n.sky++}}
  c.globalCompositeOperation=op};
// 폭약이 터질 때: 예전 고리 대신 터지는 그림(범위에 맞춤)
{const _ab=a34Boom;a34Boom=function(b){const g=FX40.g('splitarrow',false),e=b&&b.e,n0=rings.length,p0=parts.length,x=e&&e.x,y=e&&e.y,rad=b&&b.rad*(1+.1*b.n);const r=_ab.apply(this,arguments);
  try{if(g&&e&&FX40.F(g,g.m.bo)){if(rings.length>n0)rings.splice(n0);FX31.halve(p0);FX31.add({st:g.m.bo,pk:g.m.pk,x,y,z:0,d:.6,sc:FX31.fit(g.PK,g.m.bo,rad),ax:64,ay:FX40.ft(g,g.m.bo)})}}catch(err){if(window.__QA)throw err}return r}}
// 하늘의 활 화살이 땅에 닿을 때: 예전 고리 대신 터지는 그림
{const _at=a34Tick;a34Tick=function(dt){const g=A34.fall.length&&FX40.g('heavenbow',false),L=g?A34.fall.filter(f=>f.t-dt<=0).map(f=>({f,x:f.x,y:f.y})):null,n0=rings.length;const r=_at.apply(this,arguments);
  try{if(L&&L.length&&FX40.F(g,g.m.i)){for(let i=rings.length-1;i>=n0;i--)if(L.some(q=>q.f.x===rings[i].x&&q.f.y===rings[i].y))rings.splice(i,1);
    for(const q of L)FX31.add({st:g.m.i,pk:g.m.pk,x:q.f.x,y:q.f.y,z:0,d:.5,sc:FX31.fit(g.PK,g.m.i,q.f.rad*1.3),ax:64,ay:FX40.ft(g,g.m.i)})}}catch(err){if(window.__QA)throw err}return r}}
// 포대가 쏘는 화살: 몸통은 띠 2번 (맞힘은 fx31.js의 맞힘 그림이 띠 3번으로)
{const _d=FXR.draw;FXR.draw=function(c,p,s,k,ox,oy,map){const g=p&&p.s&&p.s.a34tur&&FX40.g('pierceblow'),F=g&&g.m.pa&&FX31.fr(g.PK,g.m.pa);if(!F)return _d.apply(this,arguments);if(!FXL.lod(s.x,s.y,40))return;
  const ang=Math.atan2((p.vx+p.vy)*KI/2,(p.vx-p.vy)*KI),age=(p._a31=(p._a31||0)+1),f=F[Math.min(F.length-1,age<3?1:2)];c.globalCompositeOperation='source-over';
  FX31.img(c,g.PK,f,s.x,s.y,f[4]+f[2]*.72,f[5]+f[3]/2,.36*1.1,.36*.5,ang,1);c.globalCompositeOperation='lighter';c.globalAlpha=1}}

/* ----- job3fx-wa.js(3차 궁수): 되돌아오는 화살 · 일곱 별 · 별 떨구기 · 분신 · 부채꼴 ----- */
{const _ju=jwUpright;jwUpright=function(c,map){if(!FX31.on())return _ju.apply(this,arguments);
  const R=J3W.thr.length&&FX40.g('returnarrow'),S7=J3W.stars.length&&FX40.g('sevenstars'),SF=J3W.sfall.length&&FX40.g('starfallbow');
  const sv={};if(R){const mine=J3W.thr.filter(t=>t.s&&t.s.id==='returnarrow');if(mine.length){sv.thr=J3W.thr;J3W.thr=J3W.thr.filter(t=>!mine.includes(t));sv.mine=mine}}
  if(S7){sv.stars=J3W.stars;J3W.stars=[]}if(SF){sv.sfall=J3W.sfall;J3W.sfall=[]}
  try{_ju.apply(this,arguments)}finally{if(sv.thr)J3W.thr=sv.thr;if(sv.stars)J3W.stars=sv.stars;if(sv.sfall)J3W.sfall=sv.sfall}
  try{const op=c.globalCompositeOperation;c.globalCompositeOperation='source-over';const P3=(x,y,z)=>{const s=map(x,y);return{x:s.x,y:s.y-(z||0)}};
    if(sv.mine){const F=FX40.F(R,R.m.b);for(const th of sv.mine){const p=P3(th.x,th.y,34);if(!FXL.lod(p.x,p.y,50))continue;const o=th.own||P;
      const a=th.ph?Math.atan2(((o.x-th.x)+(o.y-th.y))*KI/2,((o.x-th.x)-(o.y-th.y))*KI):FX31.scrAng(th.a),f=F[1+FX31.loopK([0,0],12,th.x*.01)];
      FX31.img(c,R.PK,f,p.x,p.y,f[4]+f[2]*.6,f[5]+f[3]/2,.5*1.1,.5*.5,a,1);FX40.n.thr++}}
    // 떨어지는 별: 예전 별과 같은 길로, 띠의 1~3칸
    if(sv.stars){const F=FX40.F(S7,S7.m.b);for(const o of sv.stars){const k=o.t/o.max,p=P3(o.x-k*120,o.y-k*120,20+k*420);FX31.img(c,S7.PK,F[Math.min(2,((1-k)*3)|0)],p.x,p.y,64,64,.6,.6,0,1);FX40.n.star++}}
    if(sv.sfall){const F=FX40.F(SF,SF.m.b);for(const o of sv.sfall){const k=o.t/o.max,p=P3(o.x-k*200,o.y-k*200,30+k*700),sc=Math.max(.8,Math.min(2.2,(120+o.rad*.5)/90));
      FX31.img(c,SF.PK,F[Math.min(2,((1-k)*3)|0)],p.x,p.y,64,64,sc,sc,0,1);FX40.n.star++}}
    c.globalCompositeOperation=op}catch(err){if(window.__QA)throw err}finally{c.globalAlpha=1}}}
// 별이 땅에 닿을 때 · 되돌아오는 화살이 맞힐 때: 예전 고리 대신 그림
{const _u=update;update=function(dt){const on=FX31.on()&&typeof J3W==='object';
  const S7=on&&J3W.stars.length&&FX40.g('sevenstars',false),SF=on&&J3W.sfall.length&&FX40.g('starfallbow',false),R=on&&J3W.thr.length&&FX40.g('returnarrow',false);
  const st=S7?J3W.stars.slice():null,sf=SF?J3W.sfall.slice():null,th=R?J3W.thr.filter(t=>t.s&&t.s.id==='returnarrow').map(t=>[t,t.h0.size+t.h1.size,new Set([...t.h0,...t.h1])]):null,n0=rings.length;
  _u.apply(this,arguments);
  try{const land=(g,L,rad,d)=>{const hit=L.filter(o=>o.done);if(!hit.length||!FX40.F(g,g.m.i))return;
      for(let i=rings.length-1;i>=n0;i--)if(hit.some(o=>o.x===rings[i].x&&o.y===rings[i].y))rings.splice(i,1);
      for(const o of hit)FX31.add({st:g.m.i,pk:g.m.pk,x:o.x,y:o.y,z:0,d,sc:FX31.fit(g.PK,g.m.i,rad(o)),ax:64,ay:64})};
    if(st)land(S7,st,()=>70,.45);if(sf)land(SF,sf,o=>o.rad,.7);
    if(th&&FX40.F(R,R.m.i))for(const [t,n,was] of th){if(t.h0.size+t.h1.size<=n)continue;for(const e of [...t.h0,...t.h1])if(!was.has(e))FX31.add({st:R.m.i,pk:R.m.pk,x:e.x,y:e.y,z:24,d:.3,sc:.42,ax:64,ay:64})}}catch(err){if(window.__QA)throw err}}}
// 섀도 트윈즈: 분신이 나타나는 두 자리에서 빛 한 번
{const _jc=jwClones;jwClones=function(s,c){const r=_jc.apply(this,arguments);try{const g=FX40.g('shadowclone');if(g){const o=jwOwn(c),f=o.face||0;
  for(const sd of [-1,1])FX31.add({st:g.m.b,pk:g.m.pk,x:o.x+Math.cos(f+sd*1.5708)*55,y:o.y+Math.sin(f+sd*1.5708)*55,z:0,d:.75,sc:.85,ax:64,ay:FX40.ft(g,g.m.b)})}}catch(err){if(window.__QA)throw err}return r}}
// 스캐터 발리: 예전 부채꼴 빛은 그림(fx31.js 부채꼴)이 대신
{const _js=jwScatter;jwScatter=function(s,pw,T,c){const n0=J3W.gfx.length,r=_js.apply(this,arguments);try{if(FX40.g('scattervolley',false))for(let i=J3W.gfx.length-1;i>=n0;i--)if(J3W.gfx[i].k==='cone')J3W.gfx.splice(i,1)}catch(err){if(window.__QA)throw err}return r}}

/* ----- 히드라 몸: 그림이 있으면 예전 몸(목 셋 · 머리) 대신. 무는 순간(lunge)부터 0.5초 동안 무는 그림 ----- */
{const _da=drawAlly;drawAlly=function(a){if(!(a&&a.s&&a.s.form==='hydra'))return _da.apply(this,arguments);const PK=FX40.hy(),FI=PK&&FX31.fr(PK,FX40.HI),FA=PK&&FX31.fr(PK,FX40.HA);if(!FI)return _da.apply(this,arguments);
  const s=a._s;if(!onScreen(s,80))return;if(a.lunge>0&&!(a._h40>time-.5))a._h40=time;const at=FA&&a._h40!=null&&time-a._h40<.5,F=at?FA:FI,f=at?F[FX31.kOf(F,(time-a._h40)/.5)]:F[FX31.loopK(F,6,a.x*.01)];
  ctx.save();ctx.translate(s.x,s.y);Kit.shadow(ctx,4,2,a.r*1.6,a.r*.6,1);if((a.fx||1)>0)ctx.scale(-1,1);/* 그림은 왼쪽을 봄 */
  const sc=.95,ay=FX31.foot(PK,FX40.HI);FLC.draw(ctx,PK.img,f[0],f[1],f[2],f[3],(f[4]-64)*sc,(f[5]-ay)*sc,f[2]*sc,f[3]*sc);FXL.spend(1);FX31.n.draw++;FX40.n.hy++;ctx.restore();
  ctx.save();ctx.translate(s.x,s.y);const w=34;ctx.fillStyle='#c9a46a';ctx.fillRect(-w/2,-58+4,w*clamp(a.t/a.s.dur,0,1),1.5);ctx.restore()}}
window.__fx40=FX40;
