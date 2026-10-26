/* ---------- [v48] 성장 컨텐츠 그림 (Codex가 그린 그림 34장, 2026-10-26) ----------
   - 60~100레벨 · 30~60레벨 성장(v42 · v45)에 쓰던 임시 그림을 새 그림으로 바꾼다.
     동료 짐승(늑대 · 매 · 돌 골렘 · 작은 정령) · 말과 준마 · 거점 건물 넷의 1~3단계 · 채집 자리(약초 · 광석 · 수정, 캐기 전 / 캔 뒤) ·
     쉼터 습격 울타리와 뿔피리(멀쩡함 / 부서짐) · 숨은 곳 반짝임.
   - 그림 묶음(img/flare-g48-*.js): 짐승 하나 · 말 하나마다 한 묶음, 거점 건물 + 울타리 한 묶음(g48-base), 채집 자리 + 반짝임 한 묶음(g48-field).
     화면에 처음 나올 때 그 묶음만 받는다(휴대폰이 안 보이는 그림까지 받지 않게).
   - 짐승 · 말은 8방향(남 · 남서 · 서 · 북서 · 북 · 북동 · 동 · 남동) 띠 그림. 움직인 방향으로 돌아보고, 움직이면 걷기 · 달리기, 서 있으면 서기,
     동료가 때리면(덤벼드는 순간) 치기 · 물기 그림. 매는 움직일 때 날갯짓, 멈추면 활공. 정령은 방향 없이 떠 있기 6장.
   - 묶음을 받는 동안: 짐승 · 건물 · 채집 자리 · 울타리 · 반짝임은 예전 그림, 말과 매는 예전 무료 그림 묶음을 따로 받지 않게 말은 잠깐 안 보이고(예전에 묶음 없을 때와 같음) 매는 코드 매.
   - 「그림: 예전 그림」 설정 · 묶음을 못 받았을 때 · #qa 에서는 예전 그림 그대로.
   - 캔 채집 자리는 예전에는 아무것도 안 그렸다. 새 그림 묶음이 있을 때만 「캔 뒤」 그림을 그 자리에 그린다(캘 수 있는 곳 표시 · 이름표는 그대로 캘 수 있을 때만).
   - 그림만 바뀐다: 자리 · 크기 갈래 · 충돌 · 적중 · 수치 · 저장은 그대로. 새 저장 칸 없음.
   - 같이 하기: 다른 사람의 말은 준마인지 알 수 없어 늘 말 그림(예전에도 말 그림 하나). */
const K48={pet:{wolf:'g48-wolf',hawk:'g48-hawk',golem:'g48-golem',spirit:'g48-spirit'},
  // 그림 1px → 화면 px (예전 그림과 비슷한 크기가 되게 맞춘 값; 묶음을 줄여 담았으면 meta.sc로 나눈다)
  k:{wolf:.3,golem:.42,hawk:.38,spirit:.24,horse:.64,smith:.5,herb:.5,dummy:.3,bed:.5,nherb:.3,nore:.36,ncry:.32,fence:.66,spark:.34},
  // 한 바퀴 시간(초): 움직임 · 서기(오가기) · 치기
  mv:{wolf:.6,golem:1,hawk:.6,horse:.5},idle:1.6,atk:.42,glide:1.4,hover:1,spark:.8,
  bs:{anvil:'smith',planter:'herb',mannequin:'dummy',tent:'bed'},n:0};
const K48BK={};for(const k of ['smith','herb','dummy','bed'])K48BK[k]=['',k+'/1',k+'/2',k+'/3'];// 건물 열쇠 (단계별, 미리 만들어 둠)
// 묶음: 있으면 묶음, 받는 중이면 0, 없음(「예전 그림」 · #qa · 못 받음)이면 null
function k48Pk(n){const PK=flPack(n);if(PK)return PK;if(!flWant())return null;flNeed(n);return FL.want[n]===1?0:null}
// 세계에서 움직인 방향 → 화면 8방향 (0 남 · 1 남서 · 2 서 · 3 북서 · 4 북 · 5 북동 · 6 동 · 7 남동)
function k48Dir(dx,dy){const th=Math.atan2((dx+dy)/2,dx-dy);return ((Math.round((th-1.5707963)/.7853982)%8)+8)%8}
// 열쇠 표: 묶음을 처음 쓸 때 한 번 만든다 (그릴 때마다 글자를 새로 만들지 않게)
function k48Keys(PK){if(PK._k48)return PK._k48;const o={};for(const a in PK.meta.a||{}){const [nf,nd]=PK.meta.a[a];o[a]=[];for(let f=0;f<nf;f++){const row=[];for(let d=0;d<nd;d++)row.push(nd>1?`${a}/${f}/${d}`:nf>1?`${a}/${f}`:a);o[a].push(row)}}return PK._k48=o}
// 칸 번호: 돌기(loop) 또는 오가기(0 1 2 3 2 1)
const k48Loop=(n,t,dur)=>Math.floor(((t/dur)%1+1)%1*n)%n;
function k48Pp(n,t,dur){if(n<2)return 0;const m=n*2-2,q=Math.floor(((t/dur)%1+1)%1*m)%m;return q<n?q:m-q}
function k48Draw(PK,key,x,y,k){K48.n++;return flDraw(ctx,PK,key,x,y,k/(PK.meta.sc||1))}
// 움직임 상태 (몸에 하나만 붙여 둠): 마지막으로 움직인 방향 · 때 · 덤벼든 때
function k48St(o){return o._k48||(o._k48={x:o.x,y:o.y,dx:1,dy:1,mv:-9,at:-9,pl:0})}
function k48Moved(o,st){const mx=o.x-st.x,my=o.y-st.y;if(mx*mx+my*my>.16){st.dx=mx;st.dy=my;st.mv=time}st.x=o.x;st.y=o.y;return time-st.mv<.2}
// 덤벼드는 순간(lunge가 다시 커짐) → 치기 그림 시작, 가장 가까운 적 쪽을 본다
function k48Atk(a,st){const l=a.lunge||0;if(l>st.pl+.01){st.at=time;let bd=320*320,tx=0,ty=0;for(const e of enemies){if(e.dead)continue;const dx=e.x-a.x,dy=e.y-a.y,d=dx*dx+dy*dy;if(d<bd){bd=d;tx=dx;ty=dy}}if(tx||ty){st.dx=tx;st.dy=ty}}st.pl=l}
// 짐승 · 말 한 장 고르기: 치기 > 움직임 > 서기
function k48Beast(PK,st,mv,kind,x,y,k){const K=k48Keys(PK),d=k48Dir(st.dx,st.dy),at=time-st.at;let A,f;
  if(K.atk&&at>=0&&at<K48.atk){A=K.atk;f=Math.min(A.length-1,Math.floor(at/K48.atk*A.length))}
  else if(mv&&K.move){A=K.move;f=k48Loop(A.length,time,K48.mv[kind]||.6)}
  else{A=K.idle||K.move;f=k48Pp(A.length,time,K48.idle)}
  return k48Draw(PK,A[f][Math.min(d,A[f].length-1)],x,y,k)}
/* 동료 짐승 */
const K48TOP={wolf:52,golem:70,hawk:78,spirit:44};
// 늑대는 fxphys.js가 실린 뒤(queueMicrotask) 사냥 동료 그림으로 가로채므로, 그보다 바깥에서 감싸려고 같은 방법으로 늦게 감싼다
queueMicrotask(()=>{const _da=drawAlly;drawAlly=function(a){if(!a||!a.g42pet||!K48.pet[a.g42pet])return _da(a);const kind=a.g42pet,PK=k48Pk(K48.pet[kind]);
  if(PK===null||PK===0&&kind!=='hawk')return _da(a);// 없음 · 받는 중: 예전 그림 (매는 받는 중이면 아래에서 코드 매)
  const s=a._s;if(!s||!onScreen(s,90))return;const st=k48St(a),mv=k48Moved(a,st);k48Atk(a,st);
  ctx.save();ctx.globalAlpha=.45;ctx.strokeStyle='#c8e0a0';ctx.lineWidth=1.5;ell2(s.x,s.y,a.r+6,(a.r+6)*.4);ctx.restore();
  if(kind==='hawk'){const hy=s.y-46+Math.sin(a.anim*2)*4;Kit.shadow(ctx,s.x,s.y,10,4,.6);
    if(!PK)j2Bird(a,s,'#a07848');else{const K=k48Keys(PK),fly=mv||time-st.at<K48.atk,A=fly?K.fly:K.glide,d=k48Dir(st.dx,st.dy);
      k48Draw(PK,A[fly?k48Loop(A.length,time,K48.mv.hawk):k48Pp(A.length,time,K48.glide)][d],s.x,hy,K48.k.hawk)}}
  else if(kind==='spirit'){const K=k48Keys(PK).hover,y=s.y-24+Math.sin(a.anim*5)*3;Kit.shadow(ctx,s.x,s.y,8,3,.35);k48Draw(PK,K[k48Loop(K.length,time+a.anim,K48.hover)][0],s.x,y,K48.k.spirit)}
  else{Kit.shadow(ctx,s.x,s.y+1,a.r*1.3,a.r*.5,.55);k48Beast(PK,st,mv,kind,s.x,s.y,K48.k[kind])}
  const w=30,y=s.y-K48TOP[kind];ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,5);ctx.fillStyle='#9ad06a';ctx.fillRect(s.x-w/2,y,w*clamp(a.hp/a.max,0,1),3)}});
/* 말 · 준마: g42Horse(그림자 + 말)만 바꾼다. 사람을 올려 그리는 자리는 그대로 */
const k48MtPk=o=>{const m=o===P&&P&&P.g42&&P.g42.mt;return m&&(m.lv|0)>=2?'g48-courser':'g48-horse'};
{const _gh=g42Horse;g42Horse=function(o,s,st){const PK=k48Pk(k48MtPk(o));if(PK===null)return _gh.apply(this,arguments);
  const mv=Math.hypot(o.x-st.x,o.y-st.y)>.4;if(mv){st.dx=o.x-st.x;st.dy=o.y-st.y;st.mv=time}st.x=o.x;st.y=o.y;st.t=(st.t||0)+(mv?1/30:1/60);
  if(!PK)return false;// 받는 중: 예전에 묶음이 없을 때처럼 말 없이
  Kit.shadow(ctx,s.x,s.y+2,30,10,.5);return k48Beast(PK,st,time-st.mv<.2,'horse',s.x,s.y+4,K48.k.horse)}}
/* 거점 건물: 단계마다 한 장 (첫 소품 자리에 그리고 나머지 소품은 그 그림 안에 들어 있으므로 안 그림) */
function k48BsLv(k){const b=P&&P.g42&&P.g42.bs&&P.g42.bs.b;return Math.min(3,Math.max(1,b?b[k]|0:1))}
{const _dd=drawDecor;drawDecor=function(d){if(!d.g42bs||!d._s)return _dd.apply(this,arguments);const PK=k48Pk('g48-base');if(!PK)return _dd.apply(this,arguments);
  if(d.pv)return;const k=K48.bs[d.k];if(!k)return _dd.apply(this,arguments);k48Draw(PK,K48BK[k][k48BsLv(k)],d._s.x,d._s.y,K48.k[k])}}
/* 채집 자리 · 습격 울타리 · 숨은 곳 (q30 표시) */
const K48N={herb:['herb/0','herb/1'],ore:['ore/0','ore/1'],cry:['cry/0','cry/1']},K48NK={herb:'nherb',ore:'nore',cry:'ncry'};
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.k!=='q30')return _rd(d);const kd=d.kind;
  if(kd==='k48dep'){const s=d._s,PK=flPack('g48-field');if(s&&PK&&K48N[d.m])k48Draw(PK,K48N[d.m][1],s.x,s.y,K48.k[K48NK[d.m]]);return true}
  if(kd!=='g42node'&&kd!=='g42bar'&&kd!=='g42ex')return _rd(d);const PK=k48Pk(kd==='g42bar'?'g48-base':'g48-field');if(!PK)return _rd(d);const s=d._s;if(!s)return true;const pa=ctx.globalAlpha;
  if(kd==='g42node'){const M=G42_MAT[d.m];k48Draw(PK,K48N[d.m][0],s.x,s.y,K48.k[K48NK[d.m]]);
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(d.near?.35:.18)+.12*Math.sin(time*3+d.x);glow(s.x,s.y-14,d.near?34:24,M.col);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=pa;
    if(d.f>0){ctx.strokeStyle=M.col;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(s.x,s.y,26,13,0,-1.57,-1.57+6.283*d.f);ctx.stroke()}
    if(d.near)QLBL.push({x:s.x,y:s.y-44,n:`${M.n} · 곁에 서 있으면 캠`,mk:'',c:M.col,say:'',sa:0,ph:d.x});return true}
  if(kd==='g42bar'){const pul=.5+.5*Math.sin(time*4);
    if(d.on){ctx.globalAlpha=.25;ctx.strokeStyle='#ff9a6a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x,s.y,G42_RDCFG.zone*.25,G42_RDCFG.zone*.125,0,0,6.283);ctx.stroke()}
    ctx.globalAlpha=1;k48Draw(PK,d.hp!=null&&d.hp<.5?'fence/1':'fence/0',s.x,s.y+8,K48.k.fence);// 습격 중 울타리가 절반 넘게 상하면 부서진 그림
    if(!d.on){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.25+.2*pul;glow(s.x,s.y-50,28,'#ffd08a');ctx.globalCompositeOperation='source-over'}
    if(d.hp!=null){ctx.globalAlpha=1;ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(s.x-34,s.y-58,68,7);ctx.fillStyle=d.hp<.3?'#ff5a4a':'#ffd08a';ctx.fillRect(s.x-34,s.y-58,68*Math.max(0,d.hp),7)}
    ctx.globalAlpha=pa;QLBL.push({x:s.x,y:s.y-66,n:d.lb,mk:'',c:d.on?'#ff9a6a':'#ffd08a',say:'',sa:0,ph:d.x});return true}
  // 숨은 곳: 은은한 빛은 그대로, 코드 반짝이 세 점 대신 반짝임 그림 (가까울수록 크고 진함)
  const pul=.5+.5*Math.sin(time*3+d.x),K=k48Keys(PK).spark;
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(.15+.35*d.f)*(.6+.4*pul);glow(s.x,s.y-12,22+20*d.f,'#9fe8ff');ctx.globalCompositeOperation='source-over';
  ctx.globalAlpha=.45+.55*d.f;k48Draw(PK,K[k48Loop(K.length,time+d.x*.01,K48.spark)][0],s.x,s.y-14,K48.k.spark*(.8+.4*d.f));ctx.globalAlpha=pa;return true}}
// 캔 채집 자리: 새 그림 묶음이 있을 때만 「캔 뒤」 그림 표시를 둔다 (없으면 예전처럼 아무것도 없음).
// 캘 수 있을 때의 표시와 같은 열쇠(같은 물건)를 써서 종류만 바꾼다: 장식 목록 길이가 그대로면 화면 칸 색인(decoIdx)이 새 물건을 못 보기 때문
function k48GTick(){if(!P||DG||IN||!G42_GREG[REG.id]||P.lvl<G42_GLV||!flPack('g48-field'))return;const reg=REG.id,S=Q30.pos['g42g/'+reg];if(!S)return;
  for(let i=0;i<S.length;i++){const p=S[i];if(!(G42F.cut[reg+i]>G42.clock)||dist(P,p)>=900)continue;q30Mark('g42g/'+reg+i,{kind:'k48dep',x:p.x,y:p.y,m:p.m,near:false,f:0})}}
{const _u=update;update=function(dt){_u(dt);try{k48GTick()}catch(e){if(window.__QA)throw e}}}
window.__k48={K48,k48Pk,k48Dir,k48Keys,k48Loop,k48Pp,k48St,k48Beast,k48GTick,k48MtPk,k48BsLv};
