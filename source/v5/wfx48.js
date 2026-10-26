/* ---------- v48: 전사 기술 그림 12가지 더 (Codex 그림 151~162번, 띠 14장 · 묶음 img/fx-warrior-phys-2.js) · 마법사 스톤 스킨 새 그림 (125번 · 묶음 img/fx-mage-earth-2.js) ----------
   v45에 넣은 wfx43.js(띠 126~141 · 150번)에 이어, 그때 아직 그리던 151~162번이 다 그려져 넣는다. 예전 묶음(fx-warrior-phys · fx-mage-earth) 파일은 그대로 두고 작은 새 묶음만 더한다.
   · 불워크: 나를 따라다니는 구역 가운데의 예전 파란 깃발 대신 「땅에 세운 방패 + 둘레 보호 장판」 그림 (사람 키에 맞춘 크기, 구역보다 크지 않게 · 구역 테두리 원은 그대로)
   · 스톤 램파트: 예전 바위 덩이 대신 바위 벽 그림을 실제 벽 길이만큼 이어 세운다 (솟아오르고 무너지는 높이 · 그림자는 예전처럼)
   · 포트리스 시프트: 두 자리를 잇던 예전 빛 줄 대신 떠난 자리와 닿은 자리에 빛기둥 하나씩
   · 레트리뷰션: 모으는 동안 방패에 모이는 빛(예전 작은 고리 · 반짝이 대신), 놓을 때 앞쪽 부채꼴 폭발(예전 부채꼴 빛 대신, 실제 사거리와 각도)
   · 어스 앵커: 예전 지대 바닥 빛과 닻 무늬 대신 장판 그림 (지대 폭). 지대 테두리 선은 그대로
   · 언폴른 킹덤: 예전 금빛 원 대신 금빛 고리 그림 (둘레 450 폭, 시전한 사람을 따라감)
   · 헐 웨폰: 예전 도는 칼 그림 대신 날아가는 칼 그림 (맞는 폭에 맞춤), 맞힐 때 맞음 그림
   · 익스큐션 리프: 세 번 착지할 때마다 예전 착지 고리 · 별빛 대신 착지 충격 그림 (반경 150 폭, 1 · 2 · 3번째가 서로 다른 칸)
   · 블러드 하베스트: 예전 붉은 고리 대신 몸으로 빨려드는 빛 (예전 입자는 절반)
   · 워로드 게일: 모으는 동안 소용돌이(예전 반짝이 대신), 놓을 때 칼날이 터지고(예전 고리 대신), 날아가는 검기마다 예전 검기 그림 대신 칼날 그림
   · 팬텀 라이더즈: 환영 기수마다 예전 기수 그림 대신 그림 기수 (그림의 네 기수 중 하나를 잘라 씀)
   · 차지 오브 더 호스트: 예전 기수 열 명 대신 환영 기병대 그림 (지나가는 길의 바닥 빛은 그대로)
   · 스톤 스킨(마법사): 무적 동안 몸을 감싸는 돌 껍질 그림 — 예전 046번 그림 자리(FX31.M)를 새 묶음의 125번으로 바꾼다
   · 범위 테두리 · 지대 테두리 · 길 바닥 빛 · 소환 고리 · 모으기 마법진 · 땅 자국 · 도약 자취는 그대로. 예전 그림을 빼는 것은 그리기에서만(입자는 만든 뒤 지움)이라
     게임 난수 · 판정 · 피해 · 숫자 · 저장은 그대로다. 같이 하기 동료의 시전도 같은 자리(J3W · 동료 대역)를 거치므로 동료 자리에서 그려진다.
   · 묶음이 없거나(받는 중 · 못 받음) 「예전 그림」이면 예전 그대로. 한 번에 drawImage 하나, FXL 예산을 따르고 매 프레임 새 배열을 만들지 않는다
     (잠깐 빼 두는 목록은 늘 같은 배열을 다시 씀). */
const WFX2={PK:'warrior-phys-2',
  // [띠 번호, 모양, 띠 2번 있음, 기술]
  T:[['151','bulwark',0,'bulwark'],['152','wall',0,'stonerampart'],['153','swap',0,'fortressswap'],['154','counter',1,'bulwarkcounter'],['155','field',0,'earthanchor'],['156','kingdom',0,'unfallenkingdom'],
    ['157','throw',1,'weaponthrow'],['158','mleap',0,'executionleap'],['159','harvest',0,'bloodharvest'],['160','gale',0,'lordgale'],['161','riders',0,'phantomriders'],['162','sweep',0,'heavenlycharge']],
  // 땅에 닿는 줄(칸 안 y, 그림에서 잰 값): 장판 · 고리는 가운데, 세운 것은 바닥
  GY:{bulwark:83,field:65,kingdom:65,mleap:70,harvest:66,wall:80,swap:80,sweep:86,rider:98},
  // 칸 안에서 잘라 쓰는 네모 [x0,y0,x1,y1]: 기수 하나(오른쪽 아래) · 칼날 하나(오른쪽) · 빛기둥 왼쪽/오른쪽
  CUT:{rider:[62,63,120,106],blade:[80,52,118,79],swapL:[0,0,64,128],swapR:[64,0,128,128]},
  M:{},inst:[],cnt:{},n:{draw:0,hid:0},_g:[],_t:[],_e:[],_f:[],_f2:[],STUB:{j3wa:1},KS:KI*1.4142,
  init(){for(const [no,f,two,id] of this.T)this.M[id]={no,f,b:`fx_${no}_1_warrior_phys_${f}`,i:two?`fx_${no}_2_warrior_phys_${f}`:null,pk:this.PK}},
  // 쓸 수 있는 그림 {m,PK}. 없으면 null (ask가 false가 아니면 받을 줄에 세움)
  get(id,ask){const m=id&&this.M[id];if(!m||!FX31.on())return null;const PK=FX31.P[m.pk];if(PK){if(!FX31.fr(PK,m.b))return null;PK.used=FX31.now();return{m,PK}}if(ask!==false)FX31.need(m.pk);return null},
  fit(b,r){return Math.max(.2,Math.min(16,2*(r||60)*this.KS/b.vw))},
  // 칸 하나(R이 있으면 그 안의 네모만)를 (x,y)에. ax,ay: 칸 안 기준점. sx,sy: 배율(음수면 뒤집음). (e1x,e1y): 그림 가로축의 화면 방향, (e2x,e2y): 세로축
  pic(c,PK,st,f,x,y,ax,ay,sx,sy,e1x,e1y,e2x,e2y,a,R){if(!f||!f[2]||!(a>0))return;let qx=f[0],qy=f[1],w=f[2],h=f[3],fx=f[4],fy=f[5];
    if(R){const x0=Math.max(fx,R[0]),y0=Math.max(fy,R[1]),x1=Math.min(fx+w,R[2]),y1=Math.min(fy+h,R[3]);if(x1<=x0||y1<=y0)return;qx+=x0-fx;qy+=y0-fy;w=x1-x0;h=y1-y0;fx=x0;fy=y0}
    if(sx<0){sx=-sx;e1x=-e1x;e1y=-e1y}if(sy<0){sy=-sy;e2x=-e2x;e2y=-e2y}const k=DPR;c.globalAlpha=Math.min(1,a);
    c.setTransform(k*e1x,k*e1y,k*e2x,k*e2y,k*(x+shx),k*(y+shy));FLC.draw(c,PK.img,qx,qy,w,h,(fx-ax)*sx,(fy-ay)*sy,w*sx,h*sy);c.setTransform(k,0,0,k,k*shx,k*shy);
    FXL.spend(1);this.n.draw++;this.cnt[st]=(this.cnt[st]|0)+1},
  rot(c,PK,st,f,x,y,ax,ay,sx,sy,r,a,R){const co=Math.cos(r),si=Math.sin(r);this.pic(c,PK,st,f,x,y,ax,ay,sx,sy,co,si,-si,co,a,R)},
  add(o){o.t0=o.t0!=null?o.t0:time;this.inst.push(o);if(this.inst.length>60)this.inst.shift();return o},
  // 잠깐 재생되는 그림 하나 (f0~f1 칸만 · gnd: 땅 높이라 몸보다 먼저)
  one(c,o,map){const el=time-o.t0,a=el/o.d;if(a<0||a>=1)return;const PK=FX31.P[o.pk];if(!PK)return;const F=FX31.fr(PK,o.st);if(!F)return;
    if(o.fol){const h=o.who;if(!h||h.dead){o.d=0;return}o.x=h.x;o.y=h.y}const s=map(o.x,o.y),y=s.y-(o.z||0);if(!FXL.lod(s.x,y,70*o.sc))return;
    const f0=o.f0|0,f1=Math.min(F.length-1,o.f1!=null?o.f1:F.length-1),k=Math.min(f1,f0+((a*(f1-f0+1))|0));this.pic(c,PK,o.st,F[k],s.x,y,o.ax,o.ay,o.sc,o.sc,1,0,0,1,1)},
  drawInst(c,map,gnd){let dead=0;for(const o of this.inst){if(time-o.t0>=o.d){dead++;continue}if(!!o.gnd===gnd)this.one(c,o,map)}if(dead&&!gnd)this.inst=this.inst.filter(o=>time-o.t0<o.d)},
  // 그림이 대신하는 예전 효과 목록 칸인가 (포트리스 시프트 빛 줄 · 언폴른 킹덤 원 · 레트리뷰션 부채꼴 · 블러드 하베스트 고리)
  hide(g){const k=g.k;return k==='swap'?!!this.get('fortressswap',false):k==='dome'?!!this.get('unfallenkingdom',false):(k==='cone'||k==='pulse')&&g.s48&&this.M[g.s48]?!!this.get(g.s48,false):false},
  // 어스 앵커 지대: 그리는 동안만 기술 정보를 빈 것으로 바꿔 둔다 (sw에 [지대, 원래 정보] 쌍)
  anc(L,sw){if(L)for(const f of L)if(f.s&&f.s.id==='earthanchor'&&f.s.j3anchor){sw.push(f,f.s);f.s=this.STUB}}};
WFX2.init();
// 마법사 스톤 스킨: 예전 046번 짝을 새 묶음의 125번으로 (그리는 방식 · 무적 동안만은 그대로)
if(FX31.M.stonebody)FX31.M.stonebody=Object.assign({},FX31.M.stonebody,{b:'fx_125_1_mage_earth_stonebody',i:'fx_125_2_mage_earth_stonebody',pk:'mage-earth-2'});

/* ----- 시전 때: 묶음 받기 · 이번 시전이 만든 효과에 기술 이름 붙이기 · 예전 고리를 그림으로 ----- */
{const _fc=FXP.cast;FXP.cast=function(s){try{if(s&&WFX2.M[s.id])WFX2.get(s.id)}catch(err){if(window.__QA)throw err}return _fc.apply(this,arguments)}}
{const _b=FX31.barPacks;FX31.barPacks=function(){const s=_b.apply(this,arguments);if(P&&P.bar)for(const id of P.bar){const m=id&&WFX2.M[id];if(m&&skLv(id)>0)s.add(m.pk)}return s}}
{const _p=jwPost;jwPost=function(c){if(!c||!WFX2.M[c.id])return _p.apply(this,arguments);const n={g:J3W.gfx.length,r:rings.length,p:parts.length,l:J3W.leaps.length};const r=_p.apply(this,arguments);
  try{WFX2.post(c,n)}catch(err){if(window.__QA)throw err}return r}}
WFX2.post=function(c,n){const id=c.id;for(let i=n.g;i<J3W.gfx.length;i++)J3W.gfx[i].s48=id;const g=this.get(id);if(!g)return;const m=g.m,own=jwOwn(c);
  if(m.f==='gale'&&rings.length>n.r){for(let i=rings.length-1;i>=n.r;i--)if(!rings[i].faint)rings.splice(i,1);this.add({st:m.b,pk:m.pk,x:c.ox,y:c.oy,z:16,d:.3,f0:0,f1:2,sc:1.7,ax:64,ay:64})}// 놓을 때: 예전 고리 대신 터지는 칼날
  else if(m.f==='harvest'&&J3W.gfx.length>n.g){FX31.halve(n.p);this.add({st:m.b,pk:m.pk,who:own,fol:1,x:own.x,y:own.y,z:20,d:.8,sc:this.fit(WFX.bx(g.PK,m.b),120)*.8,ax:64,ay:this.GY.harvest})}
  else if(m.f==='mleap'){let k=0;for(let i=n.l;i<J3W.leaps.length;i++)J3W.leaps[i].i48=k++}};// 몇 번째 착지인지
// 익스큐션 리프 착지: 예전 착지 고리 · 별빛(도약 효과의 착지) 대신 착지 충격 그림
{const _l=jwLeapLand;jwLeapLand=function(o){const g=o&&o.s&&o.s.id==='executionleap'&&WFX2.get('executionleap',false);if(!g)return _l.apply(this,arguments);
  const n0=rings.length,sp=FXP._sid;FXP._sid='executionleap';let r;try{r=_l.apply(this,arguments)}finally{FXP._sid=sp}
  try{const k=Math.min(2,o.i48|0),sc=WFX2.fit(WFX.bx(g.PK,g.m.b),o.s.rad);for(let i=rings.length-1;i>=n0;i--){const q=rings[i];if(q.faint||q.max!==o.s.rad)continue;rings.splice(i,1);
    WFX2.add({st:g.m.b,pk:g.m.pk,gnd:1,x:q.x,y:q.y,z:0,d:.38,f0:2*k,f1:2*k+1,sc,ax:64,ay:WFX2.GY.mleap})}}catch(err){if(window.__QA)throw err}return r}}
{const _o=FXP.drawOne;FXP.drawOne=function(c,f){if(f&&f.sid==='executionleap'&&f.k==='land'&&WFX2.get('executionleap',false))return;return _o.apply(this,arguments)}}
// 모으는 동안: 레트리뷰션의 시작 고리 · 앞쪽 반짝이, 워로드 게일의 도는 반짝이는 그림이 대신 (원래대로 만든 뒤 지움 — 게임 난수는 그대로)
queueMicrotask(()=>{try{if(typeof J3CHG!=='object')return;const cut=(id,h,k)=>{const f=h&&h[k];if(typeof f!=='function')return;h[k]=function(){const r0=rings.length,p0=parts.length,r=f.apply(this,arguments);
    try{if(WFX2.get(id,false)){if(rings.length>r0)rings.length=r0;if(parts.length>p0)parts.length=p0}}catch(err){if(window.__QA)throw err}return r}};
  cut('bulwarkcounter',J3CHG.bulwarkcounter,'start');cut('bulwarkcounter',J3CHG.bulwarkcounter,'tick');cut('lordgale',J3CHG.lordgale,'tick')}catch(err){if(window.__QA)throw err}});
// 헐 웨폰이 적을 맞힐 때 맞음 그림 (맞힌 적 목록이 늘어난 만큼)
{const _u=update;update=function(dt){const T=J3W.thr;let on=null;if(T.length&&(on=WFX2.get('weaponthrow',false)))for(const t of T)if(t.s&&t.s.id==='weaponthrow')t.n48=t.h0.size+t.h1.size;
  const r=_u.apply(this,arguments);if(on&&on.m.i)try{for(const t of J3W.thr){if(t.n48==null)continue;const n=t.h0.size+t.h1.size;if(n<=t.n48)continue;let i=0;
    for(const e of t.h0){if(i++>=t.n48)WFX2.add({st:on.m.i,pk:on.m.pk,x:e.x,y:e.y,z:22,d:.3,sc:.62,ax:64,ay:64})}for(const e of t.h1){if(i++>=t.n48)WFX2.add({st:on.m.i,pk:on.m.pk,x:e.x,y:e.y,z:22,d:.3,sc:.62,ax:64,ay:64})}t.n48=n}}catch(err){if(window.__QA)throw err}return r}}

/* ----- 그리기: 예전 층을 그리는 동안만 목록에서 잠깐 빼 두고, 같은 자리에 그림 ----- */
// 땅(화면 좌표): 바위 벽 · 어스 앵커 바닥 빛은 그림이 대신
{const _jg=jwGround;jwGround=function(c,map){if(!FX31.on())return _jg.apply(this,arguments);const W0=J3W.walls,sw=WFX2._f;sw.length=0;const hw=W0.length&&WFX2.get('stonerampart',false);
  if(WFX2.get('earthanchor',false)){WFX2.anc(J3W.hold,sw);WFX2.anc(fields,sw)}if(hw)J3W.walls=WFX2._e;
  try{return _jg.apply(this,arguments)}finally{J3W.walls=W0;for(let i=0;i+1<sw.length;i+=2)sw[i].s=sw[i+1];sw.length=0}}}
// 빛나는 땅 무늬(세계 좌표): 언폴른 킹덤 원 · 레트리뷰션 부채꼴 · 블러드 하베스트 고리 · 어스 앵커 닻 무늬는 그림이 대신 (어스 앵커 테두리 선은 예전 그대로 다시 그음)
{const _gg=jwGlowGround;jwGlowGround=function(){if(!FX31.on())return _gg.apply(this,arguments);const G0=J3W.gfx,K=WFX2._g,sw=WFX2._f;K.length=0;sw.length=0;
  for(const g of G0)if(WFX2.hide(g))WFX2.n.hid++;else K.push(g);J3W.gfx=K;if(WFX2.get('earthanchor',false)){WFX2.anc(J3W.hold,sw);WFX2.anc(fields,sw)}
  try{return _gg.apply(this,arguments)}finally{J3W.gfx=G0;K.length=0;const c=ctx;
    for(let i=0;i+1<sw.length;i+=2){const f=sw[i];f.s=sw[i+1];const fade=Math.min(1,f.t*2,(f.max-f.t)*4);c.globalAlpha=.6*fade;c.strokeStyle='#d8c8a0';c.lineWidth=4;c.beginPath();c.arc(f.x,f.y,f.rad*.9,0,6.283);c.stroke()}
    sw.length=0;c.globalAlpha=1}}}
// 서 있는 효과(화면 좌표): 던진 칼 · 검기 · 환영 기병대 · 빛 줄 · 부채꼴은 그림이 대신
{const _ju=jwUpright;jwUpright=function(c,map){if(!FX31.on())return _ju.apply(this,arguments);const G0=J3W.gfx,T0=J3W.thr,V0=J3W.waves,S0=J3W.sweeps,K=WFX2._g,T=WFX2._t;K.length=0;T.length=0;
  for(const g of G0)if(WFX2.hide(g))WFX2.n.hid++;else K.push(g);const th=T0.length&&WFX2.get('weaponthrow',false);if(th)for(const t of T0)if(t.arrow||!t.s||t.s.id!=='weaponthrow')T.push(t);
  J3W.gfx=K;if(th)J3W.thr=T;if(V0.length&&WFX2.get('lordgale',false))J3W.waves=WFX2._e;if(S0.length&&WFX2.get('heavenlycharge',false))J3W.sweeps=WFX2._e;
  try{return _ju.apply(this,arguments)}finally{J3W.gfx=G0;J3W.thr=T0;J3W.waves=V0;J3W.sweeps=S0;K.length=0;T.length=0;try{WFX2.drawUp(c,map)}catch(err){if(window.__QA)throw err}}}}
// 환영 기수(팬텀 라이더즈 · 동료의 기수): 예전 기수 그림 대신 그림 기수 하나
{const _rd=jwRiderDraw;jwRiderDraw=function(c,x,y,fx,k,a){const g=WFX2.get('phantomriders',false);if(!g)return _rd.apply(this,arguments);const F=FX31.fr(g.PK,g.m.b),sc=1.6*k,op=c.globalCompositeOperation;
  if(!FXL.lod(x,y-30,60))return;c.globalCompositeOperation='source-over';WFX2.pic(c,g.PK,g.m.b,F[((time*8+(a||0))|0)%F.length],x,y,91,WFX2.GY.rider,fx<0?-sc:sc,sc,1,0,0,1,.95,WFX2.CUT.rider);c.globalCompositeOperation=op;c.globalAlpha=1}}
// 땅 위(몸보다 먼저): 불워크 구역의 예전 깃발은 그림이 대신 (그리는 동안만 기술 정보를 빈 것으로)
{const _g=FXP.ground;FXP.ground=function(c,map,now){const on=FX31.on(),sw=WFX2._f2;sw.length=0;if(on&&fields.length&&WFX2.get('bulwark',false))for(const f of fields)if(f.s&&f.s.id==='bulwark'){sw.push(f,f.s);f.s=WFX2.STUB}
  try{return _g.apply(this,arguments)}finally{for(let i=0;i+1<sw.length;i+=2)sw[i].s=sw[i+1];sw.length=0;if(on)try{WFX2.drawGround(c,map)}catch(err){if(window.__QA)throw err}}}}
WFX2.drawGround=function(c,map){const op=c.globalCompositeOperation;c.globalCompositeOperation='source-over';let g;
  if(fields.length&&(g=this.get('bulwark',false))){const F=FX31.fr(g.PK,g.m.b),b=WFX.bx(g.PK,g.m.b);for(const f of fields){if(!f.s||f.s.id!=='bulwark')continue;const p=map(f.x,f.y);if(!FXL.lod(p.x,p.y-30,f.rad*1.1+40))continue;
    const sc=Math.min(2.3,this.fit(b,f.rad));this.pic(c,g.PK,g.m.b,F[FX31.loopK(F,6,f.x*.01)],p.x,p.y,64,this.GY.bulwark,sc,sc,1,0,0,1,Math.min(1,f.t*3,(f.max-f.t)*6))}}
  if(g=this.get('earthanchor',false)){if(J3W.hold)this.ancDraw(c,map,g,J3W.hold);this.ancDraw(c,map,g,fields)}
  if(J3W.gfx.length&&(g=this.get('unfallenkingdom',false))){const F=FX31.fr(g.PK,g.m.b),b=WFX.bx(g.PK,g.m.b);for(const q of J3W.gfx){if(q.k!=='dome')continue;const o=q.own;if(!o)continue;const p=map(o.x,o.y);if(!FXL.lod(p.x,p.y,q.rad*1.1))continue;
    const sc=this.fit(b,q.rad);this.pic(c,g.PK,g.m.b,F[FX31.loopK(F,6)],p.x,p.y,64,this.GY.kingdom,sc,sc,1,0,0,1,.9*Math.min(1,q.t,(q.max-q.t)*3))}}
  if(J3W.walls.length&&(g=this.get('stonerampart',false)))for(const w of J3W.walls)this.wall(c,map,g,w);
  this.drawInst(c,map,true);c.globalCompositeOperation=op;c.globalAlpha=1};
WFX2.ancDraw=function(c,map,g,L){const F=FX31.fr(g.PK,g.m.b),b=WFX.bx(g.PK,g.m.b);for(const f of L){if(!f.s||f.s.id!=='earthanchor'||!f.s.j3anchor)continue;const p=map(f.x,f.y);if(!FXL.lod(p.x,p.y,f.rad*1.1))continue;
  const sc=this.fit(b,f.rad);this.pic(c,g.PK,g.m.b,F[FX31.loopK(F,6,f.x*.01)],p.x,p.y,64,this.GY.field,sc,sc,1,0,0,1,Math.min(1,f.t*2,(f.max-f.t)*3))}};
// 바위 벽: 화면에서 벽이 누운 쪽으로 기울여(가로축만) 길이만큼 이어 세운다. 화면에서 세로로 선 벽은 짧은 조각을 계단처럼
WFX2.wall=function(c,map,g,w){const up=clamp(w.age/.22,0,1)*clamp((w.t+.5)/.5,0,1);if(up<=0)return;const A=map(w.x-w.ux*w.h,w.y-w.uy*w.h),ax=A.x,ay=A.y,B=map(w.x+w.ux*w.h,w.y+w.uy*w.h),dx=B.x-ax,dy=B.y-ay,L=Math.hypot(dx,dy);
  if(!FXL.lod((ax+B.x)/2,(ay+B.y)/2-30,L/2+80))return;Kit.shadow(c,(ax+B.x)/2,(ay+B.y)/2+4,Math.abs(dx)/2+30,Math.abs(dy)/2+14,.7*up);
  const steep=Math.abs(dy)>.6*Math.abs(dx),n=steep?Math.max(2,Math.min(10,Math.ceil(Math.abs(dy)/40))):Math.max(1,Math.min(8,Math.round(L/150))),px=dx/n,py=dy/n,b=WFX.bx(g.PK,g.m.b),
    W=Math.max(Math.abs(px)*1.12,64),sx=W/b.w,sl=Math.abs(px)<1?0:Math.max(-.6,Math.min(.6,py/px)),sy=Math.max(.9,Math.min(1.7,sx))*up,F=FX31.fr(g.PK,g.m.b),f=F[FX31.loopK(F,5,w.seed)];
  for(let j=0;j<n;j++){const i=py>=0?j:n-1-j;this.pic(c,g.PK,g.m.b,f,ax+px*(i+.5),ay+py*(i+.5),b.cx,this.GY.wall,sx,sy,1,sl,0,1,Math.min(1,up*1.4))}};
WFX2.drawUp=function(c,map){const op=c.globalCompositeOperation;c.globalCompositeOperation='source-over';let g;
  // 헐 웨폰: 날아가는 칼 (지름은 맞는 폭)
  if(J3W.thr.length&&(g=this.get('weaponthrow',false))){const F=FX31.fr(g.PK,g.m.b),b=WFX.bx(g.PK,g.m.b);for(const t of J3W.thr){if(t.arrow||!t.s||t.s.id!=='weaponthrow')continue;const s=map(t.x,t.y);if(!FXL.lod(s.x,s.y-34,60))continue;
    const sc=Math.max(.6,Math.min(1.4,2*t.w*this.KS/b.vw));this.pic(c,g.PK,g.m.b,F[FX31.loopK(F,12,t.sx*.01)],s.x,s.y-34,b.cx,b.cy,sc,sc,1,0,0,1,1)}}
  // 워로드 게일: 날아가는 검기마다 칼날 하나 (가는 쪽으로 돌림)
  if(J3W.waves.length&&(g=this.get('lordgale',false))){const F=FX31.fr(g.PK,g.m.b),f=F[2+(((time*10)|0)&1)];for(const v of J3W.waves){const x=v.x+v.ux*v.d,y=v.y+v.uy*v.d,s=map(x,y);if(!FXL.lod(s.x,s.y-20,50))continue;
    const k=2*v.w/30;this.rot(c,g.PK,g.m.b,f,s.x,s.y-20,99,65,k,k,FX31.scrAng(v.a),Math.min(1,(v.range-v.d)/120),this.CUT.blade)}}
  // 차지 오브 더 호스트
  if(J3W.sweeps.length&&(g=this.get('heavenlycharge',false)))for(const w of J3W.sweeps)this.sweep(c,map,g,w);
  // 포트리스 시프트 빛기둥 · 레트리뷰션 부채꼴
  for(const q of J3W.gfx){if(q.k==='swap'){if(g=this.get('fortressswap',false))this.swap(c,map,g,q)}else if(q.k==='cone'&&q.s48==='bulwarkcounter'&&(g=this.get('bulwarkcounter',false)))this.cone(c,map,g,q)}
  // 내가 모으는 동안: 방패에 모이는 빛 · 소용돌이
  const ch=typeof J3CH!=='undefined'?J3CH:null;if(ch&&ch.p===P&&!P.dead&&(ch.id==='bulwarkcounter'||ch.id==='lordgale')&&(g=this.get(ch.id,false))){const F=FX31.fr(g.PK,g.m.b),f=ch.f||0;
    if(ch.id==='bulwarkcounter'){const a=P.face||0,s=map(P.x+Math.cos(a)*16,P.y+Math.sin(a)*16),sc=.65+.25*f;this.pic(c,g.PK,g.m.b,F[FX31.loopK(F,8)],s.x,s.y-30,64,63,sc,sc,1,0,0,1,.95)}
    else{const s=map(P.x,P.y),sc=1.2+1.8*f;this.rot(c,g.PK,g.m.b,F[0],s.x,s.y-18,65,64,sc,sc*.6,time*9,.85)}}
  this.drawInst(c,map,false);c.globalCompositeOperation=op;c.globalAlpha=1};
// 환영 기병대: 앞머리 자리에 한 덩이 (오른쪽을 보고 그려져 있어 가는 쪽이 왼쪽이면 뒤집고, 기울기는 반 라디안까지). 길 끝을 지나면 흩어지는 칸
WFX2.sweep=function(c,map,g,w){const d=Math.min(w.d,w.len+200),al=Math.min(1,(w.len+300-w.d)/200);if(d<0||al<=0)return;const s=map(w.x+w.ux*d,w.y+w.uy*d),b=WFX.bx(g.PK,g.m.b),F=FX31.fr(g.PK,g.m.b);
  const sc=Math.max(1.4,Math.min(3,2*w.w*this.KS/b.vw));if(!FXL.lod(s.x,s.y-40,b.vw*sc))return;let ra=FX31.scrAng(w.a);const fl=Math.cos(ra)<0;if(fl)ra=ra>0?ra-Math.PI:ra+Math.PI;ra=Math.max(-.5,Math.min(.5,ra));
  const k=w.d>w.len&&F.length>4?Math.min(F.length-1,4+(((w.d-w.len)/120)|0)):((time*10+w.x*.01)|0)%Math.min(4,F.length);this.rot(c,g.PK,g.m.b,F[k],s.x,s.y,b.x1-b.w*.06,this.GY.sweep,fl?-sc:sc,sc,ra,al)};
// 자리 바꾸기: 떠난 자리에 왼쪽 빛기둥, 닿은 자리에 오른쪽 빛기둥
WFX2.swap=function(c,map,g,q){const F=FX31.fr(g.PK,g.m.b),f=F[FX31.kOf(F,1-q.t/q.max)],sc=1.7,A=map(q.x1,q.y1),B=map(q.x2,q.y2);
  if(FXL.lod(A.x,A.y-40,70))this.pic(c,g.PK,g.m.b,f,A.x,A.y,38,this.GY.swap,sc,sc,1,0,0,1,1,this.CUT.swapL);if(FXL.lod(B.x,B.y-40,70))this.pic(c,g.PK,g.m.b,f,B.x,B.y,90,this.GY.swap,sc,sc,1,0,0,1,1,this.CUT.swapR)};
// 앞쪽 부채꼴 폭발: 꼭짓점이 시전한 자리, 길이는 부채꼴 반지름, 벌어진 폭은 실제 각도 (wfx43 부채꼴과 같은 셈)
WFX2.cone=function(c,map,g,q){const st=g.m.i,F=st&&FX31.fr(g.PK,st);if(!F)return;const b=WFX.bx(g.PK,st),O=map(q.x,q.y),oy=O.y-16,ra=FX31.scrAng(q.a),L=FX31.scrLen(q.a,q.rad),sx=L/b.w,
  ch=2*q.rad*Math.sin(Math.min(q.ang,2.4)/2)*WFX.wire(q.a),co=Math.cos(ra),si=Math.sin(ra);if(!FXL.lod(O.x+co*L/2,oy+si*L/2,L/2+ch/2))return;
  this.rot(c,g.PK,st,F[FX31.kOf(F,1-q.t/q.max)],O.x,oy,b.x0,b.cy,sx,Math.max(sx*.3,Math.min(sx*1.4,ch/b.h)),ra,1)};
window.__wfx48=WFX2;
