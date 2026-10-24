/* ---------- v43 만듦 · v45에 넣음(사용자 「그래픽도 지금까지 완성된 것들 반영해줘」): 전사 기술 그림 (Codex 그림 126~141 · 150번, 띠 22장 · 108칸, 묶음 img/fx-warrior-phys.js · fx40.js 뒤 · g42c.js 앞) ----------
   v43(사용자 「전사 그림은 다음 판에」): 다 그려진 띠만 넣는다. 151~162번(불워크 · 스톤 램파트 · 포트리스 시프트 · 레트리뷰션 · 어스 앵커 · 언폴른 킹덤 · 헐 웨폰 ·
     익스큐션 리프 · 블러드 하베스트 · 워로드 게일 · 팬텀 라이더즈 · 차지 오브 더 호스트)은 아직 그리는 중이라 예전 그림 그대로.
   · 받기 · 메모리 · 「예전 그림」 설정은 fx31.js(FX31.P · need · on · tick)를 같이 쓴다. 전사 짝은 FX31.M이 아니라 여기(WFX.M)에 둔다(마법사 · 궁수 · 사제 짝 시험이 그대로).
   · 전사 효과는 fxphys.js(FXP)가 그린다. 시전 때 생긴 효과(FXP.fx)에는 기술 이름(sid)이 붙어 있어, 그 기술 그림이 있으면 같은 역할의 예전 효과 대신 그림을 그린다(겹치지 않음):
     베기 궤적 · 방패 치기 · 찌르기 · 부채꼴 · 돌진 자취 · 회전/외침 고리 · 던진 방패 · 검기/창 광선 · 착지와 내리찍기의 별빛과 고리.
     같이 하기 동료의 시전도 FXP.cast를 거치므로 동료 자리에서 그려진다(몸에 붙는 빛은 동료를 따라감).
   · 크기: 베기 · 찌르기 · 부채꼴은 그 기술의 실제 사거리(앞으로)와 휘두르는 폭(옆으로), 고리 · 착지 · 내리찍기 · 깃발은 실제 범위 원의 폭, 돌진은 돌진 길이와 폭,
     광선은 길이와 폭(fx31.js 광선 이어 붙이기). 그림은 오른쪽을 보고 그려져 있어 바라보는(휘두르는) 쪽으로 돌린다. 번갈아 휘두르는 베기는 위아래를 뒤집는다.
   · 강화(몸 둘레 빛) · 가호 · 가시 갑옷 · 오스 블레이드는 예전 시전 빛(FXB) 대신. 발밑 상태 고리 · 머리 위 가호 표시 · 범위 외침 고리(랠리 · 배틀 로어 …) · 도발 고리 ·
     땅 갈라짐 자국 · 범위 테두리(장판 · 내리찍기)는 그대로 둔다.
   · 판정 · 피해 · 숫자 · 저장은 건드리지 않는다. 묶음이 없거나(받는 중 · 못 받음) 「예전 그림」이면 예전 그대로. 한 번에 drawImage 하나, FXL 예산을 따르고
     매 프레임 새 배열을 만들지 않는다(잠깐 빼 두는 목록은 늘 같은 배열을 다시 씀). */
const WFX={PK:'warrior-phys',
  // [띠 번호, 모양, 띠 2번 있음, 기술]
  T:[['126','slash',0,'slash doubleslash crossslash sweep provokestrike heavyblow endblow crushcombo rend execute lordcombo'],
    ['127','bash',0,'shieldbash rampartbash'],
    ['128','buff',0,'riposte steelheart ironwall defiance rally laststand fortress bloodfire rampage redmist warlordroar shieldwall retaliation steadfast commandshout citadel bloodfrenzy battletrance avatarofwar bewall citadelecho bloodoath wardrum'],
    ['129','charge',0,'shieldcharge guardrush'],
    ['130','nova',0,'bladedance polecircle taunt stomp gathercry fearhowl ragespin grandtaunt whirlslash terrorroar'],
    ['131','chain',1,'shieldthrow'],['132','cone',0,'thousandcuts hook myriadslash'],['133','enchantslash',1,'oathblade'],
    ['134','beam',1,'sunderingstrike lungepierce heavenpiercer earthsplit'],['135','thrust',0,'thrust dragonfang'],
    ['136','leap',0,'vault skyfalllance leapsmash thunderdrop'],['137','strike',0,'heavycrash groundbreaker'],['138','banner',0,'warbanner standard'],
    ['139','link',0,'guardlink'],['140','spikearmor',1,'spikeguard'],['141','ward',0,'undying lastbastion'],['150','bolt',1,'chainpull provokemark lordduel']],
  // 그 모양의 그림이 대신하는 예전 FXP 효과 (외침 고리는 고리 모양일 때만 — 강화 · 도발 기술의 외침은 범위 표시라 그대로)
  OLD:{slash:'slash',bash:'bash slash',charge:'charge',nova:'spin shout',chain:'toss',cone:'slash thrust',beam:'beamp',thrust:'thrust',leap:'land',strike:'land'},
  // 땅에 닿는 자리(칸 안 y, 그림에서 잰 값): 강화 빛 · 고리 · 착지 · 내리찍기 · 깃발 · 가호는 이 줄을 발밑/범위 중심에 맞춘다
  GY:{buff:92,nova:66,leap:90,strike:93,banner:77,ward:88},
  M:{},inst:[],cnt:{},n:{draw:0},snap:null,STUB:{},_sw:[],_ln:[],_lk:[],_pl:[],
  init(){for(const [no,f,two,ids] of this.T){const b=`fx_${no}_1_warrior_phys_${f}`,i=two?`fx_${no}_2_warrior_phys_${f}`:null,old=new Set((this.OLD[f]||'').split(' ').filter(Boolean));
    for(const id of ids.split(' '))this.M[id]={no,f,b,i,pk:this.PK,old}}},
  // 쓸 수 있는 그림 {m,PK}. 없으면 null (ask가 false가 아니면 받을 줄에 세움)
  get(id,ask){const m=id&&this.M[id];if(!m||!FX31.on())return null;const PK=FX31.P[m.pk];if(PK){PK.used=FX31.now();return{m,PK}}if(ask!==false)FX31.need(m.pk);return null},
  // 띠 전체의 그림 테두리(칸 좌표)와 가장 넓은 칸의 폭 — 묶음마다 한 번 재 둔다
  bx(PK,st){const c=PK.wb43||(PK.wb43={});let b=c[st];if(b)return b;const F=FX31.fr(PK,st)||[];let x0=128,x1=0,y0=128,y1=0,vw=8;
    for(const f of F){if(!f[2])continue;x0=Math.min(x0,f[4]);x1=Math.max(x1,f[4]+f[2]);y0=Math.min(y0,f[5]);y1=Math.max(y1,f[5]+f[3]);vw=Math.max(vw,f[2])}
    if(x1<=x0){x0=0;x1=128;y0=0;y1=128}return c[st]={x0,x1,y0,y1,w:x1-x0,h:Math.max(8,y1-y0),cx:(x0+x1)/2,cy:(y0+y1)/2,vw}},
  KS:KI*1.4142,// 세계 길이 1 → 화면 가로 길이(가장 길 때)
  // 땅의 둥근 범위(세계 반지름 r)와 그림 폭이 같아지는 배율 (fx31.js fit과 같음)
  fit(b,r){return Math.max(.2,Math.min(10,2*(r||60)*this.KS/b.vw))},
  // 높이 솟는 그림(착지 · 내리찍기 · 깃발): 가로는 범위에 맞추고, 세로는 너무 커지지 않게 (1.4배까지는 그대로, 넘으면 가로의 60%)
  tall(sx){return Math.min(sx,Math.max(1.4,sx*.6))},
  // 칸 하나를 (x,y)에. ax,ay: 칸 안 기준점. sy가 음수면 위아래를 뒤집는다. rot: 화면 각도
  img(c,PK,st,f,x,y,ax,ay,sx,sy,rot,a){if(!f||!f[2]||a<=0)return;c.globalAlpha=Math.min(1,a);const k=DPR,ox=DPR*shx,oy=DPR*shy,fl=sy<0?-1:1,co=Math.cos(rot||0),si=Math.sin(rot||0);sy*=fl;
    c.setTransform(k*co,k*si,-k*si*fl,k*co*fl,k*x+ox,k*y+oy);FLC.draw(c,PK.img,f[0],f[1],f[2],f[3],(f[4]-ax)*sx,(f[5]-ay)*sy,f[2]*sx,f[3]*sy);c.setTransform(k,0,0,k,ox,oy);
    FXL.spend(1);this.n.draw++;this.cnt[st]=(this.cnt[st]|0)+1},
  add(o){o.t0=o.t0!=null?o.t0:time;this.inst.push(o);if(this.inst.length>60)this.inst.shift();return o},
  wire(a){return FX31.scrLen(a+1.5708,1)}};// 옆 방향 세계 길이 1의 화면 길이
WFX.init();

/* ----- FXP 효과 하나를 그림으로 (f: FXP.fx 한 칸, u: 0..1) — 그렸으면(또는 일부러 안 그렸으면) true ----- */
WFX.fxOne=function(c,f,u,map,g){const m=g.m,PK=g.PK,F=FX31.fr(PK,m.b);if(!F)return false;const sh=m.f,s0=SPELLS[f.sid]||{},b=this.bx(PK,m.b);
  if(sh==='beam')return true;// 몸통은 fx31.js 광선(beams[].a31), 끝 맞음은 시전 때 한 번
  if(sh==='leap'||sh==='strike'){const p=map(f.x,f.y),sx=this.fit(b,f.rad);if(!FXL.lod(p.x,p.y-40,f.rad*1.2+40))return true;this.img(c,PK,m.b,F[FX31.kOf(F,u)],p.x,p.y,64,this.GY[sh],sx,this.tall(sx),0,1);return true}
  if(sh==='chain'){// 던진 방패: 예전과 같은 길로 줄기가 날아가고, 한 칸 끝에 닿을 때 맞음 그림
    const T=f.d-.25,q=u*f.d/(T/f.segs.length);let i=Math.min(f.segs.length-1,Math.floor(q)),fr=Math.min(1,q-i);if(u*f.d>T){i=f.segs.length-1;fr=1}
    const A=f.segs[i][0],B=f.segs[i][1];
    if(fr<1){const x=A.x+(B.x-A.x)*fr,y=A.y+(B.y-A.y)*fr,z=(A.z||16)+((B.z||16)-(A.z||16))*fr,p=FXP.P3(x,y,z,map);if(FXL.lod(p.x,p.y,60)){const pa=map(A.x,A.y),pb=map(B.x,B.y);
      this.img(c,PK,m.b,F[Math.min(2,(fr*3)|0)],p.x,p.y,b.x1-b.w*.15,b.cy,.5,.5,Math.atan2(pb.y-pa.y-((B.z||16)-(A.z||16)),pb.x-pa.x),1)}}
    if(fr>.9&&m.i&&!((f.w43|0)&(1<<i))){f.w43=(f.w43|0)|(1<<i);this.add({st:m.i,pk:m.pk,x:B.x,y:B.y,z:B.z||16,d:.32,sc:.55,ax:64,ay:64})}return true}
  const a=f.a||0,ra=FX31.scrAng(a),co=Math.cos(ra),si=Math.sin(ra),fr=F[FX31.kOf(F,u)];
  if(sh==='charge'){// 돌진: 지나간 길 전체(길이 · 폭)에 걸쳐, 머리가 끝에
    const L=FX31.scrLen(a,Math.max(30,f.L||0)),A=FXP.P3(f.x,f.y,14,map);if(!FXL.lod(A.x+co*L/2,A.y+si*L/2,L/2+40))return true;
    this.img(c,PK,m.b,fr,A.x+co*L,A.y+si*L,b.x1,b.cy,L/b.w,Math.max(.6,Math.min(1.6,(f.w||40)*2.4*this.wire(a)/b.h)),ra,1);return true}
  const z=sh==='cone'?16:sh==='thrust'?20:sh==='bash'?18:22,O=FXP.P3(f.x,f.y,z,map);
  if(sh==='bash'){// 방패 치기: 앞쪽 치는 자리에 충격 빛 (지름은 휘두르는 폭의 1.3배, 56~170)
    const reach=f.k==='bash'?f.R/.7:f.R,d=f.k==='bash'?f.R:f.R*.7,ang=f.an43||s0.ang||.8,D=Math.max(56,Math.min(170,2*reach*Math.sin(Math.min(ang,2.6)/2)*1.3)),sc=D*this.KS/b.w,L=FX31.scrLen(a,d);
    if(!FXL.lod(O.x+co*L,O.y+si*L,D))return true;this.img(c,PK,m.b,fr,O.x+co*L,O.y+si*L,b.cx,b.cy,sc,sc,ra,1);return true}
  if(sh==='thrust'){// 찌르기: 사람 앞 14에서 사거리 끝까지
    const L0=FX31.scrLen(a,14),L=FX31.scrLen(a,Math.max(20,f.R-14)),sx=L/b.w;if(!FXL.lod(O.x+co*(L0+L/2),O.y+si*(L0+L/2),L/2+30))return true;
    this.img(c,PK,m.b,fr,O.x+co*L0,O.y+si*L0,b.x0,b.cy,sx,Math.max(.45,Math.min(1.1,sx))*(f.dir<0?-1:1),ra,1);return true}
  if(sh==='cone'){// 부채꼴: 꼭짓점이 사람, 길이는 실제 사거리, 벌어진 폭은 실제 각도
    const R=f.rg43||s0.range||f.R,ang=f.an43||s0.ang||1,L=FX31.scrLen(a,R),sx=L/b.w,ch=2*R*Math.sin(Math.min(ang,2.4)/2)*this.wire(a);if(!FXL.lod(O.x+co*L/2,O.y+si*L/2,L/2+ch/2))return true;
    this.img(c,PK,m.b,fr,O.x,O.y,b.x0,b.cy,sx,Math.max(sx*.3,Math.min(sx*1.4,ch/b.h))*(f.dir<0?-1:1),ra,1);return true}
  // 베기: 바깥 끝이 사거리, 활 모양의 폭은 휘두르는 폭
  const R=f.R||72,span=Math.min(2.8,(f.ang||1)*1.15),L=FX31.scrLen(a,R),sx=L*.92/b.w,ch=2*R*Math.sin(span/2)*this.wire(a);if(!FXL.lod(O.x+co*L*.6,O.y+si*L*.6,L*.6+ch/2))return true;
  this.img(c,PK,m.b,fr,O.x+co*L,O.y+si*L,b.x1,b.cy,sx,Math.max(sx*.6,Math.min(sx*2.2,ch/b.h))*(f.dir<0?-1:1),ra,1);return true};

/* ----- 한 번(또는 잠깐 반복) 재생되는 그림 하나 ----- */
WFX.one=function(c,o,map){const a=(time-o.t0)/o.d;if(a<0||a>=1)return;const PK=FX31.P[o.pk];if(!PK)return;const F=FX31.fr(PK,o.st);if(!F)return;
  if(o.fol){const h=o.who;if(!h||h.dead){o.d=0;return}o.x=h.x;o.y=h.y}const s=map(o.x,o.y),y=s.y-(o.z||0);if(!FXL.lod(s.x,y,90*o.sc))return;
  const el=time-o.t0;this.img(c,PK,o.st,o.loop?F[FX31.loopK(F,8,o.x*.01)]:F[FX31.kOf(F,a)],s.x,y,o.ax,o.ay,o.sc,o.sc,o.rot||0,o.loop?.95*Math.min(1,el*5,(o.d-el)*3):1)};
// 효과 위: 내 가시 갑옷 · 오스 블레이드(떠 있는 동안) · 대신 맞기 끈 · 한 번 재생 그림
WFX.drawAir=function(c,map,L){const op=c.globalCompositeOperation;c.globalCompositeOperation='source-over';
  if(P&&!P.dead){const A=P.armor;if(A&&A.t>0&&A.s&&this.M[A.s.id]){const g=this.get(A.s.id,false),F=g&&FX31.fr(g.PK,g.m.b);if(F){const s=map(P.x,P.y);this.img(c,g.PK,g.m.b,F[FX31.loopK(F,7)],s.x,s.y-24,64,64,.72,.72,0,.85*Math.min(1,A.t*2))}}
    const ob=P.buffs&&P.buffs.oathblade;if(ob&&ob.t>0){const g=this.get('oathblade',false),F=g&&FX31.fr(g.PK,g.m.b);if(F){const s=map(P.x,P.y),ra=FX31.scrAng(P.face||0),b=this.bx(g.PK,g.m.b);
      this.img(c,g.PK,g.m.b,F[FX31.loopK(F,8)],s.x+Math.cos(ra)*14,s.y-22+Math.sin(ra)*7,b.cx,b.cy,.42,.42,ra,.9*Math.min(1,ob.t*2))}}}
  if(L.length){const g=this.get('guardlink',false),F=g&&FX31.fr(g.PK,g.m.b);if(F){const b=this.bx(g.PK,g.m.b),f=F[FX31.loopK(F,8)];
    for(let i=0;i+1<L.length;i+=2){const A=map(L[i].x,L[i].y),B=map(L[i+1].x,L[i+1].y);A.y-=30;B.y-=30;const d=Math.hypot(B.x-A.x,B.y-A.y);if(d<8||!FXL.lod((A.x+B.x)/2,(A.y+B.y)/2,d/2+30))continue;
      const sx=d/b.w;this.img(c,g.PK,g.m.b,f,A.x,A.y,b.x0,b.cy,sx,Math.max(.5,Math.min(1.4,sx*.7)),Math.atan2(B.y-A.y,B.x-A.x),.8+.15*Math.sin(time*6))}}}
  let dead=0;for(const o of this.inst){if(time-o.t0>=o.d){dead++;continue}this.one(c,o,map)}if(dead)this.inst=this.inst.filter(o=>time-o.t0<o.d);
  c.globalCompositeOperation=op;c.globalAlpha=1};

/* ----- 시전 앞뒤: clsAim(겨눔 직전)에서 개수를 적어 두고, FXP.cast(시전 끝)에서 이번 시전이 만든 예전 층을 바꾼다 ----- */
{const _ca=clsAim;clsAim=function(s,t){if(s&&WFX.M[s.id])WFX.snap={id:s.id,r:rings.length,p:parts.length,fb:FXB.fx.length,bm:beams.length,fx:FXP.fx.length};return _ca.apply(this,arguments)}}
{const _fc=FXP.cast;FXP.cast=function(s,t,actor){const r=_fc.apply(this,arguments),sn=WFX.snap;WFX.snap=null;try{if(s&&sn&&sn.id===s.id)WFX.cast(s,t,sn)}catch(err){if(window.__QA)throw err}return r}}
// 같이 하기 유령 시전에서는 P가 잠깐 동료의 대역이고 GHOST가 그 동료 (net.js) — 몸에 붙는 그림은 동료(GHOST)를 따라간다
WFX.cast=function(s,t,sn){for(let i=Math.min(sn.fx,FXP.fx.length);i<FXP.fx.length;i++){const f=FXP.fx[i];if(f.sid===s.id){f.rg43=s.range;f.an43=s.ang}}/* 이번 시전의 실제 사거리 · 각도(레벨 · 장비가 반영된 값) */
  const g=this.get(s.id);if(!g)return;const m=g.m,me=GHOST||P,sh=m.f;
  const rings0=()=>{for(let i=rings.length-1;i>=sn.r;i--)if(rings[i]&&!rings[i].faint)rings.splice(i,1)};
  let tg=null;if((sh==='buff'||sh==='ward'||sh==='spikearmor'||sh==='enchantslash')&&FXB.fx.length>sn.fb){tg=[];for(let i=sn.fb;i<FXB.fx.length;i++){const o=FXB.fx[i].o,q=!o||o.x==null||o===P?me:o;if(!tg.includes(q))tg.push(q)}FXB.fx.splice(sn.fb)}// 예전 시전 빛은 그림이 대신
  if(sh==='buff'){for(const q of (tg&&tg.length?tg:[me]).slice(0,6))this.add({st:m.b,pk:m.pk,who:q,fol:1,x:q.x,y:q.y,z:0,d:.8,sc:.74,ax:64,ay:this.GY.buff})}
  else if(sh==='ward')this.add({st:m.b,pk:m.pk,who:me,fol:1,loop:1,x:me.x,y:me.y,z:0,d:2.2,sc:.8,ax:64,ay:this.GY.ward});
  else if(sh==='spikearmor'){rings0();if(GHOST)this.add({st:m.b,pk:m.pk,who:me,fol:1,loop:1,x:me.x,y:me.y,z:24,d:1.6,sc:.72,ax:64,ay:64})}// 내 것은 떠 있는 동안 drawAir가 그림
  else if(sh==='enchantslash'){if(GHOST)this.add({st:m.b,pk:m.pk,who:me,fol:1,loop:1,x:me.x,y:me.y,z:22,d:1.6,sc:.42,ax:64,ay:64})}
  else if(sh==='nova'||sh==='chain'){rings0();FX31.halve(sn.p)}// 예전 범위 고리 · 맞힘 고리는 그림이 대신, 예전 입자는 절반
  else if(sh==='cone')FX31.halve(sn.p);// 부채꼴로 뿌리던 예전 입자는 절반
  else if(sh==='beam'){for(let i=sn.bm;i<beams.length;i++){const b=beams[i];b.a31=m;if(m.i)this.add({st:m.i,pk:m.pk,x:b.x2,y:b.y2,z:b.z||14,d:.4,sc:Math.max(.5,Math.min(1.3,(b.w||40)*1.2*this.KS/this.bx(g.PK,m.i).vw)),ax:64,ay:64})}}};
// 착지 · 돌진은 규칙(cls2.js PFX.leap · PFX.charge)이 FXP.cast보다 먼저 그리므로 여기서 기술 이름을 붙여 둔다 (fxphys.js가 PFX를 바꿔 끼운 뒤)
queueMicrotask(()=>{if(typeof PFX==='undefined')return;for(const k of ['leap','charge']){const f=PFX[k];PFX[k]=function(h,ox,oy,x,y,s){const p=FXP._sid;if(s&&WFX.M[s.id]&&!p)FXP._sid=s.id;try{return f.apply(this,arguments)}finally{FXP._sid=p}}}});
// 단축칸에 올린 전사 기술 묶음도 미리 받고, 내려놓지 않는다
{const _b=FX31.barPacks;FX31.barPacks=function(){const s=_b.apply(this,arguments);if(P&&P.bar)for(const id of P.bar){const m=id&&WFX.M[id];if(m&&skLv(id)>0)s.add(m.pk)}return s}}

/* ----- 예전 FXP 효과 대신 그림 (WFX.old0: 예전 그리기 — 시험이 들여다봄) ----- */
WFX.old0=FXP.drawOne;
FXP.drawOne=function(c,f,u,map,now){const m=f&&f.sid&&WFX.M[f.sid];if(m&&m.old.has(f.k)){const g=WFX.get(f.sid,false);if(g&&FX31.fr(g.PK,m.b)){if(m.f==='nova')return;/* 고리는 땅에서(FXP.ground) */
  const op=c.globalCompositeOperation;c.globalCompositeOperation='source-over';try{WFX.fxOne(c,f,u,map,g)}catch(err){if(window.__QA)throw err}finally{c.globalCompositeOperation=op;c.globalAlpha=1}return}}
  return WFX.old0.apply(this,arguments)};
// 땅 위(몸보다 먼저): 회전 · 외침 고리 그림, 깃발(워 배너 · 가디언 스탠다드)은 예전 깃발 대신 깃발 그림
{const _g=FXP.ground;FXP.ground=function(c,map,now){const on=FX31.on(),sw=WFX._sw;sw.length=0;
  if(on)for(const f of fields){const id=f.s&&f.s.id,m=id&&WFX.M[id];if(m&&m.f==='banner'&&WFX.get(id)&&FX31.fr(FX31.P[m.pk],m.b)){sw.push(f,f.s);f.s=WFX.STUB}}
  try{return _g.apply(this,arguments)}finally{for(let i=0;i+1<sw.length;i+=2)sw[i].s=sw[i+1];
    if(on)try{WFX.drawGround(c,map,now==null?time:now,sw)}catch(err){if(window.__QA)throw err}finally{sw.length=0}}}}
WFX.drawGround=function(c,map,now,sw){const op=c.globalCompositeOperation;c.globalCompositeOperation='source-over';
  for(let i=0;i+1<sw.length;i+=2){const f=sw[i],m=this.M[sw[i+1].id],PK=FX31.P[m.pk],F=FX31.fr(PK,m.b),p=map(f.x,f.y);if(!F||!FXL.lod(p.x,p.y-30,f.rad*1.1+40))continue;PK.used=FX31.now();
    const sx=this.fit(this.bx(PK,m.b),f.rad);this.img(c,PK,m.b,F[FX31.loopK(F,6,f.x*.01)],p.x,p.y,64,this.GY.banner,sx,this.tall(sx),0,Math.min(1,f.t*3,(f.max-f.t)*6))}
  for(const f of FXP.fx){if(!f.sid||(f.k!=='spin'&&f.k!=='shout'))continue;const m=this.M[f.sid];if(!m||m.f!=='nova')continue;const u=(now-f.t0)/f.d;if(u<0||u>=1)continue;const g=this.get(f.sid,false),F=g&&FX31.fr(g.PK,m.b);if(!F)continue;
    const p=map(f.x,f.y);if(!FXL.lod(p.x,p.y,f.R*1.1))continue;const sc=this.fit(this.bx(g.PK,m.b),f.R);this.img(c,g.PK,m.b,F[FX31.kOf(F,f.pull?1-u:u)],p.x,p.y,64,this.GY.nova,sc,sc,0,1)}// 끌어당기는 외침(개더링 크라이)은 거꾸로 재생
  c.globalCompositeOperation=op;c.globalAlpha=1};
// 효과 위: 대신 맞기 끈(가디언 링크)은 그림이 있으면 예전 점선 끈 대신 — 그리는 동안만 끈 표시를 잠깐 빼 둔다
{const _dr=FXP.draw;FXP.draw=function(c,map,now){const L=WFX._ln,K=WFX._lk;L.length=0;K.length=0;let lo=null;
  if(FX31.on()&&typeof NET!=='undefined'&&NET.on&&typeof netSame==='function'&&(P.lnkOut||NET.peers.size)&&WFX.get('guardlink')){
    if(P.lnkOut){const r=NET.peers.get(P.lnkOut.id);if(r&&netSame(r))L.push(P,r);lo=P.lnkOut;P.lnkOut=null}
    for(const r of NET.peers.values())if(r.lk){if(netSame(r)){const o=r.lk===NET.id?P:NET.peers.get(r.lk);if(o)L.push(r,o)}K.push(r,r.lk);r.lk=null}}
  try{return _dr.apply(this,arguments)}finally{if(lo)P.lnkOut=lo;for(let i=0;i+1<K.length;i+=2)K[i].lk=K[i+1];K.length=0;
    try{if(FX31.on())WFX.drawAir(c,map,L)}catch(err){if(window.__QA)throw err}finally{L.length=0}}}}
// 던진 창 · 사슬(체인 훅 · 마크 오브 디파이언스 · 소버린 듀얼)과 오스 블레이드 검기: 예전 화살 그림 대신 날아가는 그림
{const _d=FXR.draw;FXR.draw=function(c,p,s,k,ox,oy,map){const id=p&&p.s&&p.s.id,ow=id==='oathwave',m=id&&!ow&&WFX.M[id],g=ow?WFX.get('oathblade',false):m&&m.f==='bolt'&&WFX.get(id);if(!g)return _d.apply(this,arguments);
  const st=ow?g.m.i:g.m.b,F=st&&FX31.fr(g.PK,st);if(!F)return _d.apply(this,arguments);if(!FXL.lod(s.x,s.y,50))return;
  const ang=Math.atan2((p.vx+p.vy)*KI/2,(p.vx-p.vy)*KI),age=(p._a43=(p._a43||0)+1),b=WFX.bx(g.PK,st),sc=ow?.75:.42,op=c.globalCompositeOperation;c.globalCompositeOperation='source-over';
  WFX.img(c,g.PK,st,F[age<3?1:2],s.x,s.y,b.x1-b.w*.2,b.cy,sc,sc,ang,1);c.globalCompositeOperation=op;c.globalAlpha=1}}
// 맞힘: 예전 빛 터짐 대신 맞음 그림
{const _h=FXR.hit;FXR.hit=function(p){const id=p&&p.s&&p.s.id,m=id&&WFX.M[id],g=m&&m.f==='bolt'&&m.i&&WFX.get(id,false);if(!g||!FX31.fr(g.PK,m.i))return _h.apply(this,arguments);
  WFX.add({st:m.i,pk:m.pk,x:p.x,y:p.y,z:p.z||0,d:.32,sc:.5,ax:64,ay:64})}}
// 가시 갑옷 반격: 나를 때린 적이 가시에 찔릴 때 반격 섬광 (한 적에 0.25초에 한 번)
{const _he=hurtE;hurtE=function(e,amt,s){const r=_he.apply(this,arguments);try{if(s&&s.id==='spikeguard'&&e&&e.x!=null&&!(e._w43>time-.25)){const g=WFX.get('spikeguard',false);if(g&&g.m.i&&FX31.fr(g.PK,g.m.i)){e._w43=time;WFX.add({st:g.m.i,pk:g.m.pk,x:e.x,y:e.y,z:20,d:.4,sc:.5,ax:64,ay:64})}}}catch(err){if(window.__QA)throw err}return r}}
// 내리찍기(헤비 크래시 · 그라운드 브레이커)가 땅에 닿을 때: 예전 충격 고리는 그림이 대신 (범위 테두리는 닿기 전까지 그대로)
{const _u=update;update=function(dt){const L=WFX._pl;L.length=0;if(pend.length&&FX31.on())for(const q of pend){const m=q.s&&WFX.M[q.s.id];if(m&&m.f==='strike'&&q.t-dt<=0&&WFX.get(q.s.id,false))L.push(q)}
  try{return _u.apply(this,arguments)}finally{if(L.length){for(let i=rings.length-1;i>=0;i--){const r=rings[i];if(!r.faint&&r.life>=.4&&L.some(q=>q.x===r.x&&q.y===r.y&&q.s.rad===r.max))rings.splice(i,1)}L.length=0}}}}
// 어스 스플리터: 예전 빛 길(J3W lane)은 광선 그림이 대신 (땅 갈라짐은 그대로)
if(typeof jwAfter==='function'){const _ja=jwAfter;jwAfter=function(s,c,T){const n0=J3W.gfx.length,r=_ja.apply(this,arguments);try{if(c&&WFX.M[c.id]&&WFX.M[c.id].f==='beam'&&WFX.get(c.id,false))for(let i=J3W.gfx.length-1;i>=n0;i--)if(J3W.gfx[i].k==='lane')J3W.gfx.splice(i,1)}catch(err){if(window.__QA)throw err}return r}}
window.__wfx43=WFX;
