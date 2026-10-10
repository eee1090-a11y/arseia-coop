/* ---------- v20 WORLD: 3차 전직의 땅 (실행) ----------
   데이터는 world3d.js. 이 파일은 job3q.js 바로 뒤에 붙는다(J3Q · breakAdd · j3Send를 바로 쓴다).
   · 봉인문(지옥 심연의 균열 동쪽) · 고원→왕도 길 · 짝문: 지옥 + J3Q.sealOpen() / J3Q.capitalOpen() 일 때만 (QA: W3.qaOpen)
   · 야영지 둘: 고원은 천막과 모닥불, 왕도는 등대지기의 집 한 채. 상점 하나씩, 왕도는 창고 없음
   · 시험의 방 입구(pt_trials): F → J3Q.enterTrial()
   · 던전 보스 장치: 카델(봉인석 보호막) · 모르디스(「재의 성가」 끊기) · 이그나시우스(룬 비) · 바르테인(죽음의 표식 · 근위병)
   · 재의 왕좌(cp_throne): 정해진 둥근 방 + 기둥 셋. 재의 군주 「이름 부르기」 동안 기둥 셋을 지키면 무너짐 게이지가 차서 끊긴다.
     못 끊으면 모두 큰 피해(꺼진 기둥만큼 더). 사이사이 「이름 불린 사람」을 따라가는 원. 혼자 · 둘이면 수호 정령이 남는 기둥을 지킨다.
   · 전리품: 직업별 3차 전용 상급 유니크(첫 처치 확정, 그 뒤 40%) + J3Q.onAshLordKill (모든 동료 화면에서) */
const W3={qaOpen:!!(window.__QA&&window.__QA.on),REG:{plateau:'plateau',capital:'capital'},ar:null,fol:[],lt:0,st:0,denyT:-9};
window.__w3=W3;
const W3_DG=new Set(W3_DUNGEONS.map(d=>d.id));
const w3J=()=>typeof J3Q!=='undefined'?J3Q:null;
const w3Hell=id=>!!(REGIONS[id]&&REGIONS[id].hell);
const w3Try=f=>{try{return f()}catch(err){if(window.__QA)throw err}};
for(const d of W3_DUNGEONS)if(!DGMAT[d.id])DGMAT[d.id]=wxDgMat(d);
queueMicrotask(()=>{try{if(typeof BGM_REG==='object')Object.assign(BGM_REG,{plateau:'dark',capital:'dark'})}catch(_){}});

/* ===== 1) 봉인: 들어갈 수 있는지 ('' = 열림) ===== */
function w3BlockReg(id){if(!w3Hell(id)||W3.qaOpen)return '';
  if(P.diff!==2)return '지옥 난이도에서만 열리는 봉인';
  const J=w3J();if(!J||!J.sealOpen())return '봉인문이 닫혀 있습니다 · 지옥 「공허의 옥좌」에서 「재의 열쇠」를 얻어야 열립니다';
  if(['capital','roots','eclipse'].includes(id)&&!(J.capitalOpen&&J.capitalOpen()))return '재의 장막이 왕도로 가는 길을 막고 있습니다 · 「잿빛 성가대의 무덤」의 주인을 쓰러뜨려야 걷힙니다';
  return ''}
function w3Deny(m){msg(m,'#ffb07a');if(time-W3.denyT>.6){ftext(P.x,P.y-30,'봉인','#ffb07a',false,70);rings.push({x:P.x,y:P.y,r:8,max:80,life:.5,col:'#8a7a6a'})}W3.denyT=time}
{const _ue=useEdge;useEdge=function(ep){if(ep&&w3Hell(ep.to)&&!NET.guest){const m=w3BlockReg(ep.to);if(m){w3Deny(m);return}}return _ue(ep)}}
{const _tt=travelTown;travelTown=function(t){if(t&&t.reg!==REG.id&&w3Hell(t.reg)&&!NET.guest){const m=w3BlockReg(t.reg);if(m){w3Deny(m);return true}}return _tt(t)}}
// 같이 하기: 참가자가 지옥 전용 지역으로 이끌어 달라고 하면 방장 쪽 봉인을 본다
{const _om=netOnMsg;netOnMsg=function(m){if(m&&m.t==='req'&&NET.host&&m.a==='reg'&&w3Hell(m.id)){const b=w3BlockReg(m.id);
    if(b){const r=NET.peers.get(m.from);msg(`${r&&r.name||'동료'}님이 ${REGIONS[m.id].n}(으)로 가려 했지만 닫혀 있습니다 · ${b}`,'#ffb07a');j3Send('w3m',{s:'방장 쪽 봉인: '+b,c:'#ffb07a'},m.from);return}}
  return _om(m)}}
J3NET.w3m=m=>{if(typeof m.s==='string'&&m.s)msg(m.s.slice(0,180),typeof m.c==='string'&&/^#[0-9a-f]{3,6}$/i.test(m.c)?m.c:'#ffb07a')};
// 짝문 창: 지옥 전용 지역에서는 난이도를 못 바꾸고, 닫힌 야영지로는 건너갈 수 없다
{const _gh=gateHtml;gateHtml=function(){let h=_gh();
  if(w3Hell(REG.id)&&!W3.qaOpen){h=h.replace(/<button type="button" data-diff="([01])"[^>]*>([^<]*)<\/button>/g,(a,i,t)=>`<button type="button" data-diff="${i}" disabled title="지옥 전용 지역">${t}</button>`);
    h=h.replace('</div><p class="muted">','</div><p class="muted" style="color:#ffb07a">지옥 전용 지역에서는 난이도를 바꿀 수 없습니다.</p><p class="muted">')}
  if(!NET.guest)for(const id of ['plateau','capital','starsea','thunder','roots','eclipse']){const t=RCACHE[id]&&RCACHE[id].town;if(!t||t.reg===REG.id)continue;const b=w3BlockReg(id);if(!b)continue;
    h=h.replace(new RegExp(`<button type="button" data-travel="${t.id}"[^>]*>건너가기</button>`),`<button type="button" disabled title="${b}">봉인됨</button>`)}
  return h}}
// 지옥 전용 지역에 지옥이 아닌 채로 있으면(옛 저장 · 시험 중 바꿈) 심연의 균열 마을로 돌려보낸다
function w3Safety(){if(DG||IN||NET.guest||W3.qaOpen||!w3Hell(REG.id)||P.diff===2)return false;
  switchRegion('abyss');msg('지옥 난이도가 아니어서 봉인문 밖 「심연의 균열」로 돌아왔습니다','#ffb07a');return true}

/* ===== 2) 지도 위 표시: 맵 끝 포탈 이름 · 봉인 · 시험의 방 · 왕좌 문 ===== */
function w3Labels(){for(const id of ['abyss','plateau','capital','starsea','thunder','roots','eclipse']){const L=RCACHE[id];if(!L||!L.edges)continue;
  for(const e of L.edges){if(!w3Hell(e.to))continue;const D=REGIONS[e.to],lv=D.base+40,b=w3BlockReg(e.to);
    if(id==='abyss'){e.label=b?`봉인문 · 닫힘 (${P.diff===2?'재의 열쇠':'지옥 전용'})`:`봉인문 · ${D.n}로 · 지옥 Lv${lv}~`;e.col=b?'#8a7a6a':D.col;e.w3s=b?1:0}
    else if(e.to==='capital'&&id==='plateau'){e.label=b?'재의 장막 · 닫힘 (왕도로 가는 길)':`${D.n}로 · 지옥 Lv${lv}~`;e.col=b?'#8a7a6a':D.col;e.w3s=b?1:0}
    else{e.label=`${D.n}로 · 지옥 Lv${lv}~`;e.w3s=0}}}}
// 봉인 · 장막 그림을 포탈 위에 겹친다
for(const [id,to,k] of [['abyss','plateau','w3seal'],['plateau','capital','w3veil']]){const L=RCACHE[id],e=L&&L.edges&&L.edges.find(x=>x.to===to);if(!e)continue;
  L.decor.push({x:e.x+1,y:e.y+1,k,s:1,v:0,ed:e})}
const w3SealSpr=()=>SC.get('w3/seal',150,170,75,140,g=>{g.translate(75,140);
  const chain=(x0,y0,x1,y1)=>{const n=12;for(let i=0;i<=n;i++){const u=i/n,x=x0+(x1-x0)*u,y=y0+(y1-y0)*u,a=Math.atan2(y1-y0,x1-x0);g.save();g.translate(x,y);g.rotate(a+(i%2?1.571:0));
    g.strokeStyle='#2a2422';g.lineWidth=3.4;g.beginPath();g.ellipse(0,0,5,2.6,0,0,6.283);g.stroke();g.strokeStyle=i%2?'#8a7e72':'#b0a492';g.lineWidth=1.8;g.beginPath();g.ellipse(0,0,5,2.6,0,0,6.283);g.stroke();g.restore()}};
  chain(-40,-104,40,-6);chain(40,-104,-40,-6);
  Kit.solid(g,q=>{q.arc(0,-56,15,0,6.283)},-15,-71,15,-41,'#4a3e36',{tex:'stone',texA:.6,rim:'rgba(255,220,170,.5)'});
  g.strokeStyle='#ffb04a';g.lineWidth=1.6;g.beginPath();g.arc(0,-56,9,0,6.283);g.moveTo(0,-65);g.lineTo(0,-47);g.moveTo(-8,-56);g.lineTo(8,-56);g.stroke();
  g.fillStyle='#ffd08a';g.beginPath();g.arc(0,-56,2,0,6.283);g.fill()},{scale:Math.max(1.25,DPR)});
const w3VeilSpr=()=>SC.get('w3/veil',150,170,75,140,g=>{g.translate(75,140);const s=mulberry(77);
  for(let i=0;i<34;i++){const x=-46+s()*92,y0=-120+s()*20,y1=-6-s()*12;g.strokeStyle=`rgba(${150+s()*40|0},${140+s()*30|0},${130+s()*30|0},${.22+s()*.25})`;g.lineWidth=2+s()*5;g.beginPath();g.moveTo(x,y0);g.quadraticCurveTo(x+(s()-.5)*16,(y0+y1)/2,x+(s()-.5)*8,y1);g.stroke()}
  g.fillStyle='rgba(220,210,200,.55)';for(let i=0;i<60;i++)g.fillRect(-48+s()*96,-124+s()*120,1.6,1.6)},{scale:Math.max(1.25,DPR)});
function w3DrawSeal(d){const s=d._s,e=d.k==='w3seal'?w3SealSpr():w3VeilSpr();if(e)SC.draw(ctx,e,s.x,s.y);
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+.2*Math.sin(time*2.4);if(d.k==='w3seal')glow(s.x,s.y-56,28,'#ffb04a');else glow(s.x,s.y-60,40,'#8a8078');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
// 시험의 방: 돌 문틀과 룬이 빛나는 입구 · 재의 왕좌: 잿불 금이 간 검은 문
const w3TrialSpr=()=>SC.get('w3/trial',170,190,85,150,g=>{g.translate(85,150);Kit.shadow(g,6,4,70,20,1);
  twBox(g,0,0,0,104,76,10,'#5a524c',{tex:'stone',texA:.5});for(const x of [-36,36])twBox(g,x,-6,10,16,16,92,'#6e665e',{tex:'stone',texA:.5});
  const a=isoP(-28,-6,10),b=isoP(28,-6,10),c=isoP(28,-6,100),d=isoP(-28,-6,100);twFill(g,[a,b,c,d],'#140e0c');
  twBox(g,0,-6,102,92,20,12,'#7a6e64',{tex:'stone',texA:.5});
  const m={x:(a.x+c.x)/2,y:(a.y+c.y)/2};g.strokeStyle='#ffd76a';g.lineWidth=1.6;g.beginPath();g.ellipse(m.x,m.y,15,22,0,0,6.283);g.stroke();
  g.beginPath();g.moveTo(m.x,m.y-20);g.lineTo(m.x,m.y+20);g.moveTo(m.x-12,m.y-6);g.lineTo(m.x+12,m.y+6);g.moveTo(m.x-12,m.y+6);g.lineTo(m.x+12,m.y-6);g.stroke();
  for(const x of [-36,36]){const p=isoP(x,-6,60);g.fillStyle='#ffd76a';g.fillRect(p.x-1.5,p.y-8,3,3);g.fillRect(p.x-1.5,p.y,3,3)}},{scale:Math.max(1.25,DPR)});
const w3ThroneSpr=()=>SC.get('w3/throne',190,200,95,160,g=>{g.translate(95,160);Kit.shadow(g,8,4,82,22,1);
  twBox(g,0,0,0,120,84,14,'#3a302c',{tex:'stone',texA:.55});for(const x of [-44,44])twBox(g,x,-8,14,22,22,104,'#4a3e3a',{tex:'stone',texA:.55});
  const a=isoP(-33,-8,14),b=isoP(33,-8,14),c=isoP(33,-8,112),d=isoP(-33,-8,112);twFill(g,[a,b,c,d],'#0a0606');
  twBox(g,0,-8,118,112,26,16,'#5a4a44',{tex:'stone',texA:.5});const top=isoP(0,-8,134);twFill(g,[{x:top.x-20,y:top.y},{x:top.x+20,y:top.y},{x:top.x,y:top.y-22}],'#4a3e3a');
  const s=mulberry(9);g.strokeStyle='#ff8a2a';g.lineWidth=1.3;for(let i=0;i<7;i++){const x=a.x+4+s()*(b.x-a.x-8),y=d.y+8+s()*((a.y-d.y)-16);g.beginPath();g.moveTo(x,y);g.lineTo(x+(s()-.5)*14,y+6+s()*10);g.lineTo(x+(s()-.5)*10,y+14+s()*10);g.stroke()}
  for(const x of [-44,44]){const p=isoP(x,-8,118);g.fillStyle='#2a2220';g.beginPath();g.ellipse(p.x,p.y,9,4,0,0,6.283);g.fill()}},{scale:Math.max(1.25,DPR)});
{const _dc=drawCave;drawCave=function(d){const k=d.cave&&d.cave.w3k;if(!k)return _dc(d);const s=d._s,e=k==='trial'?w3TrialSpr():w3ThroneSpr();if(!e)return _dc(d);SC.draw(ctx,e,s.x,s.y);
  ctx.globalCompositeOperation='lighter';if(k==='trial'){const on=w3J()&&J3Q.trialOpen&&J3Q.trialOpen();ctx.globalAlpha=(on?.55:.25)+.15*Math.sin(time*3);glow(s.x,s.y-55,on?42:30,'#ffd76a')}
  else{ctx.globalAlpha=.4+.15*Math.sin(time*2);glow(s.x,s.y-50,40,'#ff7a2a');for(const x of [-1,1]){const p={x:s.x+x*44*KI,y:s.y-118};ctx.drawImage(flameCv('#ff9a40',Math.floor(time*12+x*3)&3),p.x-8,p.y-28,16,30)}}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}
// 동굴 이름표: 시험의 방은 던전 레벨 대신 안내, 지옥 전용 던전은 지옥 레벨
{const _dl=drawV5Labels;drawV5Labels=function(){
  if(DG||!w3Hell(REG.id)){_dl();w3DrawLord();return}
  const keep=CAVES.slice(),mine=keep.filter(c=>c.cave&&W3_DG.has(c.cave.id));setArr(CAVES,keep.filter(c=>!mine.includes(c)));try{_dl()}finally{setArr(CAVES,keep)}
  ctx.textAlign='center';ctx.font='700 13px '+FONT;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';
  for(const c of mine){const s=W2S(c.x,c.y);if(!onScreen(s,80))continue;const d=c.cave,tr=d.w3k==='trial',on=tr&&w3J()&&J3Q.trialOpen&&J3Q.trialOpen();
    const t=tr?(on?'시험의 방 · 갈래의 시험이 기다립니다':'시험의 방 · 「갈래의 시험」 의뢰 때 열림'):`${d.n} · 던전 지옥 Lv${d.lvl+40}`;const y=s.y-(tr?150:d.w3k==='throne'?170:74);
    ctx.strokeText(t,s.x,y);ctx.fillStyle=tr?'#ffd76a':d.w3k==='throne'?'#ff9a5a':'#ffb07a';ctx.fillText(t,s.x,y)}
  w3DrawLord()}}
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.k==='w3seal'||d.k==='w3veil'){if(d.ed&&d.ed.w3s)w3DrawSeal(d);return true}return _rd(d)}}

/* ===== 3) 야영지 두 곳: 건물 대신 천막 · 등대지기의 집, 상점 하나, 왕도는 창고 없음 ===== */
twDef('w3tent',120,100,60,78,(g,v)=>{Kit.shadow(g,10,4,52,14,.9);const c=['#8a7e72','#6e645c','#9a8a76'][v%3],ap=isoP(0,0,50),A=isoP(-30,30,0),B=isoP(30,30,0),C=isoP(30,-30,0);
  twFill(g,[A,B,ap],Kit.lit(c,.08));twFill(g,[B,C,ap],Kit.lit(c,-.42));const s=mulberry(v*31+5);
  for(let i=0;i<4;i++){const u=.15+s()*.6,w=.12+s()*.12,p0={x:A.x+(B.x-A.x)*u,y:A.y+(B.y-A.y)*u},p1={x:A.x+(B.x-A.x)*(u+w),y:A.y+(B.y-A.y)*(u+w)},k=.35+s()*.3;
    twFill(g,[p0,p1,{x:p1.x+(ap.x-p1.x)*k,y:p1.y+(ap.y-p1.y)*k},{x:p0.x+(ap.x-p0.x)*k,y:p0.y+(ap.y-p0.y)*k}],Kit.lit(c,(s()-.5)*.35))}
  g.strokeStyle='rgba(40,30,26,.55)';g.lineWidth=1;for(let k=1;k<4;k++){g.beginPath();g.moveTo(ap.x,ap.y);g.lineTo(A.x+(B.x-A.x)*k/4,A.y+(B.y-A.y)*k/4);g.stroke()}
  const m=isoP(0,30,0);twFill(g,[{x:m.x-8,y:m.y-1},{x:m.x+8,y:m.y+1},{x:m.x,y:m.y-24}],'#1a120c');g.fillStyle='rgba(255,170,90,.55)';g.fillRect(m.x-2,m.y-10,4,8);
  g.fillStyle='#3a2a1a';g.fillRect(ap.x-1,ap.y-12,2,12);g.fillStyle='#c8a050';g.fillRect(ap.x+1,ap.y-12,9,4)});
function w3Camp(id){const L=RCACHE[id],t=L&&L.town;if(!t||t.w3c)return;t.w3c=1;const B=TW.blds[L.id]||(TW.blds[L.id]=[]),cap=id==='capital';
  const drop=f=>{for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(f(d)){L.decor.splice(i,1);const j=B.indexOf(d);if(j>=0)B.splice(j,1)}}};
  drop(d=>d.town===t&&d.k==='bld');
  drop(d=>d.k==='fountain'&&Math.hypot(d.x-t.x,d.y-t.y)<12);
  if(!cap)drop(d=>d.k==='lamp'&&Math.hypot(d.x-t.x,d.y-t.y)<330);
  // 상점은 하나 (잡화점 자리)
  const sh=(t.shops||[]).find(s=>s.type==='general')||(t.shops||[])[0];if(sh){sh.n=cap?'가게':'행상';t.shops=[sh];t.shop={x:sh.x,y:sh.y}}
  drop(d=>d.k==='shop'&&d.town===t&&sh&&d.shopType!==sh.type);
  if(cap){drop(d=>d.k==='stash'&&d.town===t);t.stash=null}
  const add=d=>{L.decor.push(d);return d},occ=[t.gate,t.stash,t.shop,t.npc,{x:t.x,y:t.y},...L.decor.filter(d=>d.k==='tfolk'&&d.town===t)].filter(Boolean);
  const free=(x,y,r)=>occ.every(o=>Math.hypot(o.x-x,o.y-y)>=r)&&B.every(b=>!b.foot||b.foot.every(f=>x<f[0]-40||x>f[2]+40||y<f[1]-40||y>f[3]+40));
  const prop=(k,dx,dy,pv,r,foot)=>{const x=t.x+dx,y=t.y+dy;if(!free(x,y,r||100))return null;const d=add({x,y,k,pv:pv|0,v:((pv|0)*.37)%1,fl:0,s:1,zl:0,tprop:true});if(foot){d.foot=[[x-foot,y-foot,x+foot,y+foot]];B.push(d)}occ.push(d);return d};
  add({x:t.x,y:t.y,k:'campfire',pv:0,v:0,fl:0,s:1.3,zl:0,tprop:true,light:230});
  if(!cap){for(const [dx,dy,v] of [[-205,-70,0],[-140,-205,1],[45,-235,2],[215,-150,0],[235,115,1],[-225,170,2],[-30,235,0],[160,230,2]])prop('w3tent',dx,dy,v,115,30);
    for(const [dx,dy] of [[-95,40],[90,95],[-60,-95]])prop('banner',dx,dy,1,70);prop('wagon',265,-10,0,110,30);prop('sacks',-120,-120,0,60)}
  else{const h=twMkBld(t,{st:'keeper',dx:-205,dy:-70,W:116,D:86,ridge:'x',door:{face:'y',f:.5},v:2,tall:1,chim:1});h.light=90;h.label='꺼진 등대지기의 집';add(h);B.push(h);occ.push(h);
    for(const [dx,dy,k,pv] of [[-110,-150,'barrel',0],[-290,30,'crate',1],[-140,40,'banner',1],[60,-120,'banner',1],[200,140,'well',0]])prop(k,dx,dy,pv,70,k==='well'?20:0)}
  L.lights.length=0;for(const d of L.decor)if(d.light)L.lights.push(d);
  if(REG.id===id&&!DG){setArr(decor,L.decor);setArr(LIGHTS,L.lights)}}
w3Camp('plateau');w3Camp('capital');

/* ===== 4) 시험의 방 입구 · 던전 들어가기 ===== */
function w3Trial(){const J=w3J();if(!J||!J.enterTrial){msg('시험의 방이 아직 잠들어 있습니다','#a39d8f');return false}return w3Try(()=>J.enterTrial())}
{const _da=doAct;doAct=function(){if(act==='dungeon'&&actCave&&actCave.cave&&actCave.cave.w3k==='trial'){w3Trial();return}return _da()}}
{const _ed=enterDungeon;enterDungeon=function(c){if(c&&c.cave&&c.cave.w3k==='trial'){w3Trial();return}const r=_ed(c);if(DG&&DG.d&&DG.d.arena)w3ArInit(true);return r}}
{const _ne=netEnterDg;netEnterDg=function(D){const r=_ne(D);if(DG&&DG.d&&DG.d.arena)w3ArInit(false);return r}}
{const _ld=leaveDungeon;leaveDungeon=function(){W3.ar=null;W3.fol=[];return _ld()}}
// 재의 왕좌: 둥근 큰 방(가운데 군주) + 아래쪽 들어오는 방 · 기둥 셋은 방 안의 벽 칸
const W3A={cx:17.5,cy:12.5,rx:11,ry:10,pil:[[16,19],[14,9],[24,11]],hold:170};
function w3Arena(){const g=new Uint8Array(DN*DN);
  for(let j=1;j<DN-1;j++)for(let i=1;i<DN-1;i++){const dx=(i-W3A.cx)/W3A.rx,dy=(j-W3A.cy)/W3A.ry;if(dx*dx+dy*dy<=1)g[tIdx(i,j)]=1}
  for(let j=22;j<=28;j++)for(let i=17;i<=18;i++)g[tIdx(i,j)]=1;
  for(let j=28;j<=32;j++)for(let i=15;i<=20;i++)g[tIdx(i,j)]=1;
  for(const [i,j] of W3A.pil)g[tIdx(i,j)]=0;
  return{g,rooms:[{i:15,j:28,w:6,h:5,cx:18,cy:30},{i:7,j:3,w:22,h:20,cx:18,cy:13}]}}
{const _gd=genDungeon;genDungeon=function(d){return d&&d.arena?w3Arena():_gd(d)}}
const w3PilAt=(i,j)=>W3A.pil.some(p=>p[0]===i&&p[1]===j);
function w3ArInit(host){W3.fol=[];W3.ar={pil:W3A.pil.map(([i,j],k)=>{const c=tc(i,j);return{i,j,x:c.x,y:c.y,lit:0,sp:0,held:0,k}}),c:0,cm:10,sendT:0};
  const n=w3N();for(const p of W3.ar.pil)p.sp=p.k>=n?1:0;
  if(host){const sp=3-n;banner={t:'재의 왕좌',sub:`기둥 셋 · 「이름 부르기」를 끊으세요${sp?` · 수호 정령 ${sp}이(가) 기둥을 지킵니다`:''}`,col:'#ff9a5a',life:3,max:3};
    msg(`재의 군주가 왕좌에서 기다립니다. 「이름 부르기」를 외우면 기둥 셋에 불을 붙여 무너짐 게이지를 채우세요${sp?` (수호 정령이 기둥 ${sp}개를 대신 지킵니다)`:''}`,'#ffb04a')}}
// 같은 곳에 있는 사람 수 (나 포함, 최대 3): 기둥을 지킬 사람
function w3N(){let n=1;if(NET.on)for(const r of NET.peers.values())if((r.seen||r.name)&&netSame(r))n++;return Math.min(3,n)}

/* ===== 5) 보스 장치 (방장 · 혼자 화면에서 계산, 참가자는 예고 원 · 메시지 · 기둥 상태를 받는다) ===== */
function w3Say(s,c){msg(s,c);j3Send('w3m',{s,c})}
const w3Nm=p=>p===P?(NET.on?(typeof netName==='function'?netName():'방장')+'님':'당신'):(p.name||'동료')+'님';
const w3Hit=(o,d,e)=>{if(o===P)hitPlayer(d,e);else netHit(o,d,e)};
function w3Follow(e,p,rad,t,mul,col,lock){const w={x:p.x,y:p.y,rad,t,max:t,dmg:e.dmg*mul,col,src:e};warns.push(w);W3.fol.push({w,tg:p,lock});return w}
function w3Warden(e,solo){
  if(!e.ga&&e.hp<e.max*.6&&e.hp>0){e.ga=1;e.gsh=1;const n=solo?2:3;
    for(let i=0;i<n;i++){const a=i*6.283/n+.5;let x=e.x+Math.cos(a)*170,y=e.y+Math.sin(a)*170;if(!dgFree(x,y,24)){x=e.x+Math.cos(a)*70;y=e.y+Math.sin(a)*70}
      const g=dgMob('w3_sealstone',x,y,Math.max(1,e.lvl-2));g.guard=e;rings.push({x,y,r:4,max:60,life:.6,col:'#ffd76a'})}
    rings.push({x:e.x,y:e.y,r:10,max:e.r*3,life:.8,col:'#ffd76a'});w3Say(`카델이 봉인석 ${n}개를 세우고 보호막을 두릅니다 — 봉인석을 부수세요`,'#ffd76a')}
  if(e.gsh&&e.ga&&!enemies.some(o=>o.guard===e&&!o.dead)){e.gsh=0;burst(e.x,e.y,'#ffd76a',40,200,3,30);w3Say('봉인석이 모두 부서져 카델의 보호막이 벗겨졌습니다','#ffd34d');PTY.stag(e,PTY.STG.interrupt)}}
function w3Choir(e,dt,solo){
  if(e.w3bc){if(e.bc>0){e.bc=Math.max(0,e.bc-dt);e.cast=Math.max(e.cast||0,Math.min(.2,e.bc));if(e.bc<=0){e.w3bc=0;e.bcw=null;e.hp=Math.min(e.max,e.hp+e.max*.06);w3Say('「재의 성가」가 끝까지 울렸습니다 — 모르디스가 생명력을 되찾습니다','#ff9a6a')}}else e.w3bc=0;return}
  if(!e.aggroed||e.hp<=0||e.brk>0||e.stunT>0||e.freezeT>0)return;e.bcT=(e.bcT==null?(solo?12:9):e.bcT)-dt;if(e.bcT>0)return;
  e.bcT=solo?21:16;e.bc=2.5;e.w3bc=1;e.cast=.2;const w={x:e.x,y:e.y,rad:320,t:2.5,max:2.5,dmg:e.dmg*2.6,col:'#ffe0b0',src:e};warns.push(w);e.bcw=w;
  w3Say('모르디스가 「재의 성가」를 외웁니다 — 기절 · 밀치기로 끊거나 멀리 피하세요','#ffe0b0')}
function w3Dean(e,dt,solo){if(!e.aggroed||e.hp<=0||e.brk>0)return;e.w3rT=(e.w3rT==null?6:e.w3rT)-dt;if(e.w3rT>0)return;e.w3rT=solo?14:11;
  const rw=(x,y)=>warns.push({x,y,rad:120,t:1.5,max:1.5,dmg:e.dmg*1.6,col:'#c8a0ff',src:e});
  for(const o of netPlayers())if(dist(o,e)<900)rw(o.x,o.y);
  for(let i=0;i<2;i++){const a=R()*6.283,r=rnd(120,320),x=e.x+Math.cos(a)*r,y=e.y+Math.sin(a)*r;if(dgFree(x,y,4))rw(x,y)}
  w3Say('이그나시우스가 「룬 비」를 내립니다 — 발밑의 원에서 벗어나세요','#c8a0ff')}
function w3Regent(e,dt,solo){if(!e.aggroed||e.hp<=0)return;
  if(!e.w3g&&e.hp<e.max*.5){e.w3g=1;const n=solo?2:4;for(let i=0;i<n;i++){const a=i*6.283/n+.3;let x=e.x+Math.cos(a)*140,y=e.y+Math.sin(a)*140;if(!dgFree(x,y,18)){x=e.x+Math.cos(a)*50;y=e.y+Math.sin(a)*50}
      const g=dgMob('z_guard',x,y,Math.max(1,e.lvl-1));g.aggroed=true;rings.push({x,y,r:4,max:50,life:.5,col:'#ffcf6a'})}
    w3Say(`바르테인이 잠든 근위병 ${n}을 깨웁니다`,'#ffcf6a')}
  if(e.brk>0||e.stunT>0||e.freezeT>0)return;e.w3mT=(e.w3mT==null?7:e.w3mT)-dt;if(e.w3mT>0)return;e.w3mT=solo?16:13;
  const pl=netPlayers().filter(o=>dist(o,e)<1000);if(!pl.length)return;const p=pick(pl);w3Follow(e,p,180,2.5,2.2,'#e8d8b0',.7);
  w3Say(`바르테인이 ${w3Nm(p)}에게 「죽음의 표식」을 새깁니다 — ${solo?'표식이 굳기 전에 원 밖으로':'표식이 굳기 전에 동료에게서 떨어지세요'}`,'#e8d8b0')}
// 재의 군주
function w3Lord(e,dt){const A=W3.ar;if(!A)return;const n=w3N(),solo=n<=1,pl=netPlayers(),ch=e.w3c>0;
  for(const p of A.pil){p.sp=p.k>=n?1:0;const held=p.sp||pl.some(o=>dist(o,p)<W3A.hold);p.held=held?1:0;
    p.lit=ch?clamp(p.lit+(held?dt/2.5:-dt*.35),0,1):Math.max(0,p.lit-dt*.8)}
  if(!e.aggroed||e.hp<=0)return;
  if(ch){e.cast=Math.max(e.cast||0,.2);if(e.brk>0){w3ChantEnd(e,true);return}
    e.w3c-=dt;A.c=e.w3c;A.cm=e.w3cm||A.cm;e.w3pT=(e.w3pT==null?1:e.w3pT)-dt;
    if(e.w3pT<=0){e.w3pT=1;if(A.pil.every(p=>p.lit>=1))breakAdd(e,20)}
    if(e.brk>0){w3ChantEnd(e,true);return}if(e.w3c<=0)w3ChantEnd(e,false);return}
  A.c=0;if(e.brk>0||e.stunT>0||e.freezeT>0)return;
  e.w3cT=(e.w3cT==null?18:e.w3cT)-dt;if(e.w3cT<=0){w3ChantStart(e,solo,n);return}
  e.w3nT=(e.w3nT==null?8:e.w3nT)-dt;if(e.w3nT<=0&&e.w3cT>4){e.w3nT=solo?14:11;const tg=pl.filter(o=>dist(o,e)<1400);if(tg.length){const p=pick(tg);
    w3Follow(e,p,solo?150:170,2.6,solo?1.8:2.2,'#ff9a4a',.6);w3Say(`재의 군주가 ${w3Nm(p)}의 이름을 부릅니다 — ${solo?'원이 굳기 전에 밖으로 피하세요':'이름 불린 사람은 동료에게서 떨어지세요'}`,'#ff9a4a')}}}
function w3ChantStart(e,solo,n){const A=W3.ar,d=solo?16:12;e.w3c=d;e.w3cm=d;A.c=d;A.cm=d;e.w3pT=1;e.cast=.2;
  for(let k=0;k<n;k++){const p=A.pil[k],a=R()*6.283,x=p.x+Math.cos(a)*130,y=p.y+Math.sin(a)*130;if(!dgFree(x,y,14))continue;const s=dgMob('w3_shade',x,y,Math.max(1,e.lvl-2));s.aggroed=true;rings.push({x,y,r:4,max:40,life:.4,col:'#ff9a4a'})}
  rings.push({x:e.x,y:e.y,r:10,max:260,life:1,col:'#ff9a4a'});shake=Math.max(shake,6);
  w3Say(solo?'재의 군주가 「이름 부르기」를 외웁니다 — 정령이 없는 기둥 곁에 서서 불을 붙이세요 (기둥 셋에 모두 불이 붙어 있는 동안 무너짐 게이지가 찹니다)':'재의 군주가 「이름 부르기」를 외웁니다 — 기둥 셋을 함께 지켜 불을 붙이세요 (셋 모두 불이 붙어 있는 동안 무너짐 게이지가 찹니다)','#ffb04a')}
function w3ChantEnd(e,ok){const A=W3.ar;e.w3c=0;A.c=0;e.cast=0;e.w3cT=w3N()<=1?40:34;e.w3nT=6;
  if(ok){rings.push({x:e.x,y:e.y,r:10,max:300,life:1,col:'#ffd34d'});w3Say('「이름 부르기」를 끊었습니다! 재의 군주가 무너졌습니다 — 지금 쏟아부으세요','#ffd34d')}
  else{const unlit=A.pil.filter(p=>p.lit<1).length,mul=1.3+.45*unlit;for(const o of netPlayers())w3Hit(o,e.dmg*mul,e);for(const a of allies)hurtAlly(a,e.dmg*mul);
    if(unlit)e.hp=Math.min(e.max,e.hp+e.max*.03*unlit);rings.push({x:e.x,y:e.y,r:10,max:900,life:1,col:'#ff5a2a'});burst(e.x,e.y,'#ff7a2a',60,500,4,30);shake=Math.max(shake,12);flash={col:'#ff7a2a',a:.3};
    w3Say(`재의 군주가 이름을 불렀습니다${unlit?` — 꺼진 기둥 ${unlit}개만큼 더 아프고 군주가 생명력을 되찾습니다`:' — 무너짐 게이지가 모자랐습니다'}`,'#ff7a3a')}
  for(const p of A.pil)p.lit=0}
function w3Tick(dt){const solo=w3N()<=1;
  for(const e of enemies){if(e.dead||e.down)continue;const k=e.k;
    if(k==='b_w3warden')w3Warden(e,solo);else if(k==='b_w3choir')w3Choir(e,dt,solo);else if(k==='b_w3dean')w3Dean(e,dt,solo);else if(k==='b_w3regent')w3Regent(e,dt,solo);else if(k==='b_ashlord')w3Lord(e,dt)}
  for(const f of W3.fol){const w=f.w;if(w.done||w.t<=f.lock||!f.tg||f.tg.dead)continue;const k=Math.min(1,dt*6);w.x+=(f.tg.x-w.x)*k;w.y+=(f.tg.y-w.y)*k}
  W3.fol=W3.fol.filter(f=>!f.w.done&&f.w.t>0);
  const A=W3.ar;if(A&&NET.on&&NET.host&&(A.sendT-=dt)<=0){A.sendT=.2;j3Send('w3a',{l:A.pil.map(p=>Math.round(p.lit*100)),s:A.pil.map(p=>p.sp),h:A.pil.map(p=>p.held),c:Math.round(A.c*10),m:Math.round(A.cm*10)})}}
{const _pt=PTY.tick;PTY.tick=function(dt){_pt.call(this,dt);if(DG&&DG.d&&W3_DG.has(DG.d.id))w3Try(()=>w3Tick(dt))}}
J3NET.w3a=m=>{const A=W3.ar;if(!NET.guest||!A||!DG||!DG.d||!DG.d.arena)return;const ok=a=>Array.isArray(a)&&a.length===3;if(!ok(m.l)||!ok(m.s))return;
  A.pil.forEach((p,i)=>{p.lit=clamp((+m.l[i]||0)/100,0,1);p.sp=m.s[i]?1:0;p.held=ok(m.h)&&m.h[i]?1:0});A.c=clamp((+m.c||0)/10,0,30);A.cm=clamp((+m.m||100)/10,1,30)};

/* ===== 6) 왕좌 그리기: 기둥 · 지키는 원 · 불 · 수호 정령 · 외우기 막대 ===== */
const w3PilSpr=()=>SC.get('w3/pillar',110,250,55,215,g=>{g.translate(55,215);Kit.shadow(g,6,4,46,15,1);
  twBox(g,0,0,0,62,62,16,'#3e3430',{tex:'stone',texA:.55});twCyl(g,0,0,16,20,140,'#5a4e48',{bands:[.25,.75],bandC:'rgba(30,20,16,.6)'});
  const s=mulberry(3);g.strokeStyle='rgba(255,150,70,.55)';g.lineWidth=1.2;for(let i=0;i<5;i++){const p=isoP(0,0,40+i*22);g.beginPath();g.moveTo(p.x-6+s()*4,p.y);g.lineTo(p.x+s()*6-3,p.y-8);g.lineTo(p.x+4,p.y-3);g.stroke()}
  twBox(g,0,0,156,50,50,10,'#4a3e3a',{tex:'stone',texA:.5});twCyl(g,0,0,166,22,8,'#2a2220',{top:'#140c0a'})},{scale:Math.max(1.25,DPR)});
{const _dw=drawWall;drawWall=function(w){if(!(DG&&DG.d&&DG.d.arena&&w3PilAt(w.i,w.j)))return _dw(w);const e=w3PilSpr();if(!e)return _dw(w);
  const s=w._s,ps=P._s||W2S(P.x,P.y),front=w.x+w.y>P.x+P.y&&Math.abs(s.x-ps.x)<90&&s.y-ps.y>-30&&s.y-ps.y<220;ctx.globalAlpha=front?.5:1;SC.draw(ctx,e,s.x,s.y);ctx.globalAlpha=1}}
const w3PilCol=p=>p.lit>=1?'#ffb04a':p.sp?'#9fe0ff':p.held?'#ffd08a':'#8a7a6a';
{const _gl=groundLights;groundLights=function(Lt){_gl(Lt);const A=W3.ar;if(!A||!DG||!DG.d||!DG.d.arena)return;for(const p of A.pil){const s=W2S(p.x,p.y);Lt(s.x,s.y-120,220+340*p.lit,.6+.35*p.lit)}}}
{const _g=drawV5Glow;drawV5Glow=function(){_g();w3Try(w3Glow)}}
function w3Glow(){const A=W3.ar;
  if(A&&DG&&DG.d&&DG.d.arena){G();const ch=A.c>0;for(const p of A.pil){const c=w3PilCol(p);ctx.globalAlpha=ch?.55:.22;ctx.strokeStyle=c;ctx.lineWidth=ch?10:6;ctx.beginPath();ctx.arc(p.x,p.y,W3A.hold,0,6.283);ctx.stroke();
      if(p.lit>0){ctx.globalAlpha=.9;ctx.strokeStyle='#ffd08a';ctx.lineWidth=18;ctx.beginPath();ctx.arc(p.x,p.y,W3A.hold,-1.571,-1.571+6.283*p.lit);ctx.stroke()}}
    S();ctx.globalCompositeOperation='lighter';
    for(const p of A.pil){const s=W2S(p.x,p.y);if(!onScreen(s,240))continue;const top=s.y-182;
      if(p.lit>0){ctx.globalAlpha=.5+.4*p.lit;glow(s.x,top,28+46*p.lit,'#ff9a40');const k=.6+.9*p.lit;ctx.drawImage(flameCv('#ff9a40',Math.floor(time*12+p.k*5)&3),s.x-12*k,top-34*k,24*k,40*k)}
      else{ctx.globalAlpha=.25;glow(s.x,top,18,'#8a6a50')}
      if(p.sp){const a=time*1.3+p.k*2.1,x=s.x+Math.cos(a)*46,y=s.y-70+Math.sin(time*2.2+p.k)*10;ctx.globalAlpha=.75;glow(x,y,26,'#9fe0ff');ctx.globalAlpha=1;glow(x,y,8,'#ffffff')}}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  // 재 내리는 하늘 (고원: 잿가루가 내린다 · 왕도: 불티가 오른다) — 화면 글자 크기의 작은 점만
  if(!DG&&!IN&&(REG.id==='plateau'||REG.id==='capital')){S();const cap=REG.id==='capital',n=reduceMotion?20:(touchMode?36:64);ctx.globalCompositeOperation=cap?'lighter':'source-over';ctx.fillStyle=cap?'#ff9a4a':'#d8d0c8';
    for(let i=0;i<n;i++){const sp=18+(i%5)*7,fx=(i*97.31)%1,fy=(i*53.77)%1;let x=(fx*(W+60)+time*(cap?6:14+(i%3)*5)+Math.sin(time*.7+i)*12)%(W+60)-30,y=cap?(H+40)-((fy*(H+40)+time*sp)%(H+40)):((fy*(H+40)+time*sp)%(H+40))-20;
      ctx.globalAlpha=cap?.35+.3*Math.sin(time*3+i):.35+(i%4)*.1;const z=1.4+(i%3)*.8;ctx.fillRect(x,y,z,z)}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}
function w3DrawLord(){const A=W3.ar;if(!A||!DG||!DG.d||!DG.d.arena)return;const e=enemies.find(o=>o.k==='b_ashlord'&&!o.dead);if(!e||!e._s)return;
  const c=NET.guest?A.c:(e.w3c||0);if(!(c>0))return;const s=e._s,top=s.y-(TYPES.b_ashlord.r)*(e.sc||3.2)*2.4-30,w=120,k=clamp(1-c/(A.cm||10),0,1),lit=A.pil.filter(p=>p.lit>=1).length;
  ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(s.x-w/2-1,top-1,w+2,8);ctx.fillStyle='#ff7a3a';ctx.fillRect(s.x-w/2,top,w*k,6);
  ctx.font=`700 14px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const t1='「이름 부르기」',t2=`불붙은 기둥 ${lit}/3`;
  ctx.strokeText(t1,s.x,top-8);ctx.fillStyle='#ffb07a';ctx.fillText(t1,s.x,top-8);ctx.font=`600 12px ${FONT}`;ctx.strokeText(t2,s.x,top+20);ctx.fillStyle=lit>=3?'#ffd34d':'#e8dcc0';ctx.fillText(t2,s.x,top+20)}
{const _h=PTY.hud;PTY.hud=function(){_h.call(this);const A=W3.ar;if(!A||!DG||!DG.d||!DG.d.arena)return;const e=enemies.find(o=>o.k==='b_ashlord'&&!o.dead),c=NET.guest?A.c:e&&e.w3c;if(!e||!(c>0))return;
  const ts=document.getElementById('tsub'),tn=document.getElementById('tname');if(ts&&tn&&tn.textContent.includes(TYPES.b_ashlord.n)&&!ts.textContent.includes('이름 부르기'))ts.textContent+=` · 「이름 부르기」 — 기둥 셋을 지키세요 (${A.pil.filter(p=>p.lit>=1).length}/3)`}}

/* ===== 7) 전리품: 3차 전용 상급 유니크 · 퀘스트 훅 ===== */
function w3Uniq(cls,lvl){const u=W3_UNIQ.find(x=>x.cls===cls);if(!u)return null;const il=Math.min(99,Math.max(1,Math.round(lvl||99)))+3;
  const st=u.wt&&typeof fixedStatsV18==='function'?fixedStatsV18(u.st,il,u.wt):fixedStats(u.st,il);const it={id:uid++,slot:u.slot,rar:5,name:u.n,il,stats:st,cls,lore:u.lore,w3u:1};if(u.wt)it.wt=u.wt;return it}
function w3LordDrop(e){P.w3=P.w3&&typeof P.w3==='object'?P.w3:{};const first=!((P.w3.lord|0)>0);P.w3.lord=(P.w3.lord|0)+1;
  if(first||R()<.4){const it=w3Uniq(P.cls,e.lvl);if(it){loot.push({x:e.x+rnd(-30,30),y:e.y+50,kind:'item',item:it,t:0,keep:first?1:0});msg(`3차 전용 상급 유니크 「${it.name}」이(가) 떨어졌습니다${first?' (첫 처치)':''}`,RAR[5].c)}}
  const J=w3J();if(J&&J.onAshLordKill)w3Try(()=>J.onAshLordKill(e))}
{const _bd=dgBossDrop;dgBossDrop=function(e){const r=_bd(e),k=e&&e.k;
  if(k==='b_ashlord')w3LordDrop(e);else if(k==='b_w3choir'){const J=w3J();if(J&&J.onChoirBossKill)w3Try(()=>J.onChoirBossKill(e))}
  return r}}
const w3CanWear0=canWear;
{canWear=function(it,cls){if(it&&it.w3u&&(!cls||cls===P.cls)&&!P.job3)return false;return w3CanWear0(it,cls)}}
{const _ir=itemRow;itemRow=function(it,btns){let h=_ir(it,btns);if(it&&it.w3u){if(!P.job3&&w3CanWear0(it))h=h.replace(`${CLASSES[P.cls].n}은(는) 착용할 수 없습니다`,'3차 전용 상급 유니크 · 3차 전직 뒤에 쓸 수 있습니다')}return h}}
{const _is=iconSpec;iconSpec=function(key){const [t,a]=key.split('/');if(t==='u'){const u=W3_UNIQ.find(x=>x.n===a);if(u&&IUNQ[a]){const k=u.wt||u.slot;return{paint:IPAINT[k]?k:'generic',o:IUNQ[a]}}}return _is(key)}}
// 저장: 재의 군주 처치 수 (없으면 0, 옛 저장은 그대로)
{const _sd=saveData;saveData=function(){const d=_sd();if(P&&P.w3&&typeof P.w3==='object'&&(P.w3.lord|0)>0)d.w3={lord:P.w3.lord|0};return d}}
{const _ld=load;load=function(d,slot){const ok=_ld(d,slot);if(ok){const w=d&&d.w3;P.w3={lord:w&&typeof w==='object'?Math.max(0,w.lord|0):0};
  if(!DG&&w3Hell(REG.id)&&P.diff!==2&&!W3.qaOpen){loadRegion('abyss');const t=TOWNS[0];P.x=t.gate.x+40;P.y=t.gate.y+40;followCam()}}return ok}}

/* ===== 8) 의뢰 목표 자리 · 들판 토벌 자리 · 매 프레임 ===== */
W3.where=function(key){if(key==='trial')key='pt_trials';else if(key==='throne')key='cp_throne';
  if(key==='seal'||key==='capitalGate'){const [rg,to,lb]=key==='seal'?['abyss','plateau',`${REGIONS.abyss.n} 동쪽 끝 · 봉인문`]:['plateau','capital',`${REGIONS.plateau.n} 북쪽 끝 · 왕도로 가는 길`];
    const L=RCACHE[rg],e=L&&L.edges&&L.edges.find(x=>x.to===to);return e?{reg:rg,x:e.x,y:e.y,label:lb}:null}
  const d=W3_DUNGEONS.find(x=>x.id===key);if(!d)return null;const L=RCACHE[d.reg],ci=L?L.caves.findIndex(c=>c.cave===d):-1;if(ci<0)return null;const c=L.caves[ci];
  return{reg:d.reg,x:c.x,y:c.y,cave:ci,label:d.w3k==='trial'?`${REGIONS[d.reg].n} · 「시험의 방」`:`${REGIONS[d.reg].n} · 던전 「${d.n}」 지옥 Lv${d.lvl+40}`}};
{const J=w3J();if(J){J.trialAt=W3.where('trial');J.hookAt=Object.assign(J.hookAt||{},{choir:W3.where('pt_choir'),ash:W3.where('cp_throne')})}}
{const _z=wxRegZone;wxRegZone=function(id,k){const r=_z(id,k);if(!r||!w3Hell(id))return r;const L=RCACHE[id],T=L&&L.town,D=REGIONS[id],t=TYPES[k];if(!T||!t)return r;
  const dd=SAFE+Math.max(0,(t.min||D.base)+1-D.base)*(D.zs||170)+120,ax=L.lair.x-T.x,ay=L.lair.y-T.y,l=Math.hypot(ax,ay)||1;let x=T.x+ax/l*dd,y=T.y+ay/l*dd;
  const ok=TRCH[id]||(TRCH[id]=terrReach(id));for(let n=0;n<60&&!ok[terrLQi(x,y)];n++){x+=(T.x-x)*.08;y+=(T.y-y)*.08}r.x=x;r.y=y;return r}}
{const _k=wxKillTarget;wxKillTarget=function(kinds,townId){const r=_k(kinds,townId);if(r&&!r.w3l&&r.cave!=null&&w3Hell(r.reg)){r.w3l=1;r.label=r.label.replace(/ Lv(\d+)$/,(a,n)=>` 지옥 Lv${+n+40}`)}return r}}
{const _u=update;update=function(dt){_u(dt);if((W3.lt-=dt)<=0){W3.lt=.25;w3Labels();w3Safety()}}}
w3Labels();
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{W3,w3BlockReg,w3Uniq,w3Arena,W3A,W3_REGIONS,W3_TYPES,W3_DUNGEONS,W3_UNIQ,RCACHE,w3N,w3Warns:()=>warns})}catch(_){}},0);
