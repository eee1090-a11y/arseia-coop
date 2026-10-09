/* ---------- v18: 전사 · 궁수 주인공 그림 (부위 인형 · 5방향 굽기 + 좌우 반전) ----------
   hero.js와 같은 방식: 몸 부위는 방향마다 SC에 한 번 굽고, 팔·무기는 한 장씩 구워 회전/기울임만 한다.
   무기와 손 위치는 '몸 기준 3차원'(앞 fw · 오른쪽 rt · 위 up)으로 정하고 화면에 투영해서 8방향 어디서나 맞게 보인다.
   무기 종류: 전사 sword(+shield) / polearm, 궁수 bow / xbow (+ 늘 화살통). 장비 등급색: 갑옷=테두리·장식, 무기=보석·빛, 보조=방패 테.
   동작: 가만히 · 걷기 · 휘두르기(swing, 번갈아 위/아래) · 찌르기(thrust) · 휩쓸기(sweep) · 내려찍기(slam) · 방패치기(bash)
        · 회전(spin) · 외침(shout) · 당기기/놓기(draw/release) · 막기 자세(guard) · 시전 유지(castK: 전사=치켜들기, 궁수=끝까지 당김).
   바깥에서 쓰는 것: drawFigure(…)가 이 직업이면 drawFigure18로 넘어온다 · heroAtk(h,kind,dur) · drawHeroClass(g,cls,gear,pose,x,y,k,t,dirIx) */
const HERO18={
  warrior:{plate:'#9aa2ae',plateD:'#5e6570',mail:'#7a7e88',tabard:'#8a2a24',cloak:'#6a1e1a',lining:'#3a1410',skin:'#e2b48e',hair:'#5a3a22',boot:'#4a3a2c',leather:'#5a3e26',wood:'#6a4a2c',gold:'#d4aa4c',gem:'#ff8a6a',steel:'#d8dde6'},
  archer:{leather:'#7a5634',leatherD:'#55391f',tunic:'#4a6a34',hood:'#36502a',cloak:'#3a5a2e',lining:'#5a4a2a',skin:'#e6bf98',hair:'#8a5a2e',boot:'#4a3220',wood:'#7a5230',gold:'#c9a24a',gem:'#9fe39a',steel:'#cfd4dc',feather:'#f0ece0'}};
for(const k in HERO18){const p=HERO18[k];HERO_PAL[k]={robe:p.tabard||p.tunic,robeD:p.cloak,cloak:p.cloak,lining:p.lining,hat:p.hood||p.plate,skin:p.skin,hair:p.hair,boot:p.boot,wood:p.wood,gold:p.gold,gem:p.gem}}
// ---------- 장비 → 겉모습 (그림 전용: 저장·수치와 무관) ----------
// 갑옷 단계 RT = 몸 방어구(로브 칸) 아이템 레벨 단계(0~7). 전사: 누빔옷(0~1) → 사슬(2~3) → 판금(4~) → 문양(5) → 금테(6) → 금빛 판금(7).
// 투구: 맨머리 → 가죽 모자 → 쇠 투구 → 볏 → 날개 → 금관. 궁수: 튜닉 → 가죽 조끼 → 징 → 두건(4~) → 잎관(6~).
// 무기 WT: 검 길이·모양, 창날, 활 끝, 석궁 활대가 단계마다 바뀐다. 보조 OT: 방패 모양, 화살 수.
Object.assign(LOOK_DYE,{ // [천, 두건, 망토, 안감]
  warrior:[['#8a2a24','#8a2a24','#6a1e1a','#3a1410'],['#2a3a6a','#2a3a6a','#1e2a52','#121a34'],['#2e5a34','#2e5a34','#1e4024','#10240e'],['#5a2a5a','#5a2a5a','#3e1a40','#221022'],['#6a5a24','#6a5a24','#4a3e16','#2a220a']],
  archer:[['#4a6a34','#36502a','#3a5a2e','#5a4a2a'],['#5a4a2a','#4a3a20','#3a2e1a','#a08a4a'],['#2a4a4a','#203a3a','#1a3030','#5a9a8a'],['#4a3a5a','#3a2c48','#2a2036','#8a6aa8'],['#6a3a22','#55301a','#3a2414','#c07a3a']]});
const waMetal=t=>['#8a8e96','#8a8e96','#9aa2ae','#a2aab6','#9aa2ae','#b0b8c6','#bcc6d6','#d8c890'][t];
function heroLook18(h){const cls=h.cls,p0=HERO18[cls],gr=h.gear||{},rb=gr.robe,st=gr.staff,of=gr.off,W=cls==='warrior';
  let dye=null;if(rb&&rb.il){if(rb.set&&LOOK_SET[rb.set]){const d=LOOK_SET[rb.set];dye=W?[d[0],d[0],d[2],d[2]]:d}else if(rb.rar>=4)dye=LOOK_UNIQ[lookHash(rb)%LOOK_UNIQ.length];else if(rb.rar>=1){const D=LOOK_DYE[cls];dye=D[lookHash(rb)%D.length]}}
  const RT=lookTier(rb),pal=Object.assign({},p0);
  if(dye){if(W){pal.tabard=dye[0];pal.cloak=dye[2];pal.lining=Kit.lit(dye[2],-.4)}else{pal.tunic=dye[0];pal.hood=dye[1];pal.cloak=dye[2];pal.lining=dye[3]}}
  if(W){pal.plate=waMetal(RT);pal.plateD=Kit.lit(pal.plate,-.38);pal.mail=Kit.lit(pal.plate,-.15)}
  const L={cls,pal,rt:RT,wt:lookTier(st),ot:lookTier(of),trim:rb?RAR[rb.rar].c:p0.gold,offc:of?RAR[of.rar].c:rb?RAR[rb.rar].c:p0.gold,ring:gr.ring?RAR[gr.ring.rar].c:null};
  L.key=[pal.tabard||pal.tunic,pal.hood||'',pal.cloak,L.rt,L.wt,L.ot].join(',');return L}
const H18K=.75;// 화면 투영 (b1.js KI와 같은 값)
// 몸 기준 벡터(앞·오른쪽·위) → 반전 전 지역 화면 좌표. d>0 이면 카메라 쪽
function h18prj(f,flip,fw,rt,up){const cf=Math.cos(f),sf=Math.sin(f),wx=cf*fw-sf*rt,wy=sf*fw+cf*rt;return{x:(wx-wy)*H18K*(flip?-1:1),y:(wx+wy)*H18K/2-up,d:wx+wy}}
function h18lerp(a,b,u){return a+(b-a)*u}
function h18ease(u){u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)}
// 키프레임 [{u,v:[...]}] 사이를 보간
function h18kf(kf,u){if(u<=kf[0].u)return kf[0].v;for(let i=1;i<kf.length;i++){const a=kf[i-1],b=kf[i];if(u<=b.u){const q=h18ease((u-a.u)/((b.u-a.u)||1));return a.v.map((x,j)=>h18lerp(x,b.v[j],q))}}return kf[kf.length-1].v}
// 공격 동작 상태 (그림 전용, 저장 안 됨)
function heroAtk(h,kind,dur){if(!h)return;let a=HANIM.get(h);if(!a)HANIM.set(h,a={});a.atk=kind;a.atkT=time;a.atkD=dur||.32;a.atkN=(a.atkN|0)+1}
function heroAtkS(h,t){const a=HANIM.get(h);if(!a||a.atkT==null)return null;const p=(t-a.atkT)/(a.atkD||.32);return p<0||p>=1?null:{k:a.atk,p,n:a.atkN|0}}
function h18weap(h,o){const cls=h.cls,gr=h.gear||{},st=gr.staff,of=gr.off;
  let wt=(o&&o.wt)||(st&&st.wt)||'',off=o&&o.off!==undefined?o.off:(of&&of.wt)||null;
  if(cls==='warrior'){if(wt!=='sword'&&wt!=='polearm')wt='sword';if(wt==='polearm'||off!=='shield')off=off==='shield'&&wt==='sword'?'shield':null}
  else{if(wt!=='bow'&&wt!=='xbow')wt='bow';off='quiver'}
  return{wt,off}}
function heroColors18(h){const p=HERO18[h.cls],gr=h.gear||{};
  return{trim:gr.robe?RAR[gr.robe.rar].c:p.gold,gem:gr.staff?RAR[gr.staff.rar].c:p.gem,offc:gr.off?RAR[gr.off.rar].c:gr.robe?RAR[gr.robe.rar].c:p.gold,
    robeR:gr.robe?gr.robe.rar:-1,staffR:gr.staff?gr.staff.rar:-1,offR:gr.off?gr.off.rar:-1}}

/* ===== 부위 굽기 ===== */
function heroPart18(cls,part,di,trim,bs,v,tc){
  const L=trim&&typeof trim==='object'?trim:null,HD=L&&part==='head'&&L.hrt!=null;if(L)trim=HD?L.htc:tc||L.trim;// v21: 모자를 쓰면 머리는 모자 단계·색으로
  const th=HERO_DIRS[di]*Math.PI/180,s=Math.sin(th),c=Math.cos(th),p=L?(HD&&L.hpal||L.pal):HERO18[cls],W=cls==='warrior',RT=L?(HD?L.hrt:L.rt):4,WT=L?L.wt:2,OT=L?L.ot:2;
  const sc=bs||Math.max(1,DPR)*HS,key=`h18/${cls}/${part}/${di}/${trim}/${L?L.key:''}/${v==null?'':v}/${sc.toFixed(2)}`,o={force:1,scale:sc},wk=`${trim}/${WT}`;
  const rimC='rgba(255,240,214,.85)',T=trim,line=col=>Kit.rgb(Kit.hex(Kit.lit(col,-.75)),.8);
  switch(part){
  case'boot':return SC.get(key,22,18,11,15,g=>{g.translate(11,15);
    if(W&&RT<4){const leg=q=>{q.moveTo(-2.8,-12.5);q.lineTo(2.8,-12.5);q.lineTo(3,-4);q.lineTo(-3,-4);q.closePath()};
      Kit.solid(g,leg,-3,-12,3,-4,RT>=2?p.mail:'#4a4038',{tex:RT>=2?'metal':'cloth',texA:.45,rim:'rgba(255,230,200,.5)',lineW:.7});
      Kit.solid(g,q=>{q.moveTo(-3.2,-10);q.lineTo(3.2,-10);q.lineTo(3.2,-3.5);q.lineTo(-3.2,-3.5);q.closePath()},-3,-10,3,-3.5,p.leather,{tex:'leather',texA:.45,lineW:.6});
      g.fillStyle=Kit.lit(p.leather,.25);g.fillRect(-3.2,-10,6.4,1.2);
      Kit.solid(g,q=>{q.ellipse(s*2.3,-2.4,3.5+Math.abs(s)*2.4,2.6,0,0,6.283)},-6,-5,6,0,Kit.lit(p.leather,-.15),{tex:'leather',texA:.4,lineW:.7})}
    else if(W){const leg=q=>{q.moveTo(-2.9,-12.5);q.lineTo(2.9,-12.5);q.lineTo(3.1,-4);q.lineTo(-3.1,-4);q.closePath()};
      Kit.solid(g,leg,-3,-12,3,-4,p.plate,{tex:'metal',texA:.5,rim:rimC,lineW:.7});
      g.strokeStyle='rgba(40,40,50,.45)';g.lineWidth=.6;g.beginPath();g.moveTo(-2.9,-7.5);g.lineTo(2.9,-7.5);g.stroke();
      Kit.solid(g,q=>q.ellipse(s*.6,-11.6,3.4,2.3,0,0,6.283),-3,-14,3,-9,Kit.lit(p.plate,.15),{rim:'rgba(255,255,255,.8)',lineW:.6});
      g.fillStyle=T;g.beginPath();g.arc(s*.6+s*1.4,-11.6,.8,0,6.283);g.fill();
      const ft=q=>{q.ellipse(s*2.4,-2.5,3.6+Math.abs(s)*2.6,2.8,0,0,6.283)};
      Kit.solid(g,ft,-6,-5,6,0,p.plateD,{tex:'metal',texA:.4,lineW:.7});
      g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=.6;g.beginPath();g.ellipse(s*2.4,-3.2,2.6+Math.abs(s)*1.8,1.4,0,3.4,6);g.stroke()}
    else{const leg=q=>{q.moveTo(-2.7,-12.5);q.lineTo(2.7,-12.5);q.lineTo(3,-4);q.lineTo(-3,-4);q.closePath()};
      Kit.solid(g,leg,-3,-12,3,-4,p.boot,{tex:'leather',texA:.5,rim:'rgba(255,230,200,.5)',lineW:.7});
      Kit.solid(g,q=>{q.moveTo(-3.3,-13.2);q.lineTo(3.3,-13.2);q.lineTo(3.1,-10.4);q.quadraticCurveTo(0,-9.4,-3.1,-10.4);q.closePath()},-3,-13,3,-10,Kit.lit(p.boot,.22),{lineW:.6});
      if(c>-.3){g.strokeStyle='rgba(230,210,170,.55)';g.lineWidth=.5;g.beginPath();for(let y=-9;y<-4.5;y+=1.6){g.moveTo(s*.8-1.2,y);g.lineTo(s*.8+1.2,y+1.2);g.moveTo(s*.8+1.2,y);g.lineTo(s*.8-1.2,y+1.2)}g.stroke()}
      const ft=q=>{q.ellipse(s*2.2,-2.4,3.4+Math.abs(s)*2.3,2.6,0,0,6.283)};
      Kit.solid(g,ft,-5,-5,5,0,Kit.lit(p.boot,-.1),{tex:'leather',texA:.4,lineW:.7})}},o);
  case'skirt':return SC.get(key,36,26,18,2,g=>{g.translate(18,2);
    if(W){// 사슬 치마 + 앞뒤 휘장(tabard)
      const sk=q=>{q.moveTo(-7.8,0);q.lineTo(7.8,0);q.bezierCurveTo(9.6,5,10.4,10,10.8,14);q.bezierCurveTo(6,15.6,-6,15.6,-10.8,14);q.bezierCurveTo(-10.4,10,-9.6,5,-7.8,0);q.closePath()};
      const mail=RT>=2,skc=mail?p.mail:Kit.lit(p.tabard,-.3);
      Kit.solid(g,sk,-11,0,11,15,skc,{tex:mail?'metal':'cloth',texA:.45,rim:rimC});
      g.save();g.beginPath();sk(g);g.clip();g.strokeStyle=mail?'rgba(30,30,40,.4)':Kit.rgb(Kit.hex(Kit.lit(skc,-.5)),.4);g.lineWidth=.5;
      if(mail)for(let y=2;y<16;y+=2.2){g.beginPath();for(let x=-12+(y*1.3%2);x<12;x+=2.2){g.moveTo(x+1.1,y);g.arc(x,y,1.1,0,Math.PI)}g.stroke()}
      else{g.setLineDash([1.4,1.2]);for(let x=-9;x<=9;x+=3.6){g.beginPath();g.moveTo(x,0);g.lineTo(x*1.15,16);g.stroke()}g.setLineDash([])}
      if(RT>=4){for(const sd of [-1,1]){const x=sd*6.4+s*1.5;Kit.solid(g,q=>{q.moveTo(x-3.8,0);q.lineTo(x+3.8,0);q.lineTo(x+3.4,9);q.quadraticCurveTo(x,10.4,x-3.4,9);q.closePath()},x-4,0,x+4,10,p.plate,{tex:'metal',texA:.45,rim:'rgba(255,255,255,.8)',lineW:.5});
        if(RT>=6){g.strokeStyle=T;g.lineWidth=.8;g.beginPath();g.moveTo(x-3.4,9);g.quadraticCurveTo(x,10.4,x+3.4,9);g.stroke()}}}
      g.fillStyle='rgba(255,255,255,.1)';g.fillRect(-11,0,22,2);g.restore();Kit.outline(g,sk,line(skc),.8);
      const pw=c>-.3?6.4*Math.max(.45,.5+.5*c):5.6,px=c>-.3?s*4:-s*3;
      const tb=q=>{q.moveTo(px-pw/2,0);q.lineTo(px+pw/2,0);q.lineTo(px+pw*.55,16.5);q.lineTo(px,19);q.lineTo(px-pw*.55,16.5);q.closePath()};
      Kit.solid(g,tb,px-pw,0,px+pw,19,p.tabard,{tex:'cloth',texA:.45,rim:'rgba(255,230,210,.6)',lineW:.7});
      g.strokeStyle=T;g.lineWidth=1.1;g.beginPath();g.moveTo(px-pw*.42,1);g.lineTo(px-pw*.47,16);g.lineTo(px,18);g.lineTo(px+pw*.47,16);g.lineTo(px+pw*.42,1);g.stroke()}
    else{// 가죽 덧댄 사냥꾼 웃옷 자락 (앞이 갈라짐)
      const sk=q=>{q.moveTo(-7.6,0);q.lineTo(7.6,0);q.bezierCurveTo(9.4,5,10.4,9,11,13);q.lineTo(s*3+1.2,12.6);q.lineTo(s*3,8);q.lineTo(s*3-1.2,12.6);q.lineTo(-11,13);q.bezierCurveTo(-10.4,9,-9.4,5,-7.6,0);q.closePath()};
      Kit.solid(g,sk,-11,0,11,13,p.tunic,{tex:'cloth',texA:.5,rim:rimC});
      g.save();g.beginPath();sk(g);g.clip();g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(p.tunic,-.5)),.35);g.lineWidth=1;
      for(const fx of [-6,-2,4,7.5]){g.beginPath();g.moveTo(fx*.7,1);g.quadraticCurveTo(fx*.9,7,fx*1.2,13);g.stroke()}
      if(RT>=2){for(let i=-3;i<=3;i++){if(Math.abs(i*3.2-s*3)<1.6)continue;const x=i*3.2;Kit.solid(g,q=>{q.moveTo(x-1.3,6);q.lineTo(x+1.3,6);q.lineTo(x+1.2,13);q.lineTo(x,14);q.lineTo(x-1.2,13);q.closePath()},x-1.3,6,x+1.3,14,Kit.lit(p.leather,(i&1)*.08),{tex:'leather',texA:.4,lineW:.4})}}
      if(RT>=5){g.fillStyle=Kit.rgb(Kit.hex(T),.75);for(let i=-4;i<=4;i++){g.beginPath();g.arc(i*2.5,11.2,.55,0,6.283);g.fill()}}
      g.strokeStyle=T;g.lineWidth=RT>=4?1.8:1.3;g.beginPath();g.moveTo(-11,12.6);g.lineTo(11,12.6);g.stroke();g.restore();Kit.outline(g,sk,line(p.tunic),.8);
      // 허리 주머니
      const bx=c>-.3?-s*5.5-c*4:s*4;Kit.solid(g,q=>{q.moveTo(bx-2.6,.5);q.lineTo(bx+2.6,.5);q.lineTo(bx+2.4,5.5);q.quadraticCurveTo(bx,6.6,bx-2.4,5.5);q.closePath()},bx-3,0,bx+3,6,p.leather,{tex:'leather',texA:.5,lineW:.6});
      g.fillStyle=T;g.beginPath();g.arc(bx,2.4,.7,0,6.283);g.fill()}},o);
  case'torso':return SC.get(key,32,22,16,19,g=>{g.translate(16,19);const wf=.78+.22*Math.abs(c);g.scale(wf,1);
    const to=q=>{q.moveTo(-7.6,1);q.lineTo(7.6,1);q.lineTo(9.4,-10);q.quadraticCurveTo(10,-14.4,5.2,-15.2);q.lineTo(-5.2,-15.2);q.quadraticCurveTo(-10,-14.4,-9.4,-10);q.closePath()};
    if(W&&RT<4){const mail=RT>=2,tc0=mail?p.mail:Kit.lit(p.tabard,-.1);
      Kit.solid(g,to,-10,-15,10,1,tc0,{tex:mail?'metal':'cloth',texA:.5,rim:rimC});
      g.save();g.beginPath();to(g);g.clip();
      if(mail){g.strokeStyle='rgba(30,30,40,.4)';g.lineWidth=.5;for(let y=-14;y<1;y+=2.2){g.beginPath();for(let x=-11+(y*1.3%2);x<11;x+=2.2){g.moveTo(x+1.1,y);g.arc(x,y,1.1,0,Math.PI)}g.stroke()}
        if(c>-.3){const x=s*4,w=6.4*Math.max(.45,.5+.5*c);Kit.solid(g,q=>q.rect(x-w/2,-15,w,16),x-w/2,-15,x+w/2,1,p.tabard,{tex:'cloth',texA:.45,lineW:.5});g.fillStyle=T;g.fillRect(x-.6,-12,1.2,6);g.fillRect(x-2.2,-10,4.4,1.2)}}
      else{g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(tc0,-.5)),.45);g.lineWidth=.6;g.setLineDash([1.4,1.2]);for(let y=-12;y<0;y+=3){g.beginPath();g.moveTo(-10,y);g.lineTo(10,y);g.stroke()}g.setLineDash([]);
        if(c>-.3){const x=s*4;g.strokeStyle=Kit.lit(tc0,-.4);g.lineWidth=.9;g.beginPath();g.moveTo(x,-15);g.lineTo(x,0);g.stroke()}}
      if(RT>=1){g.fillStyle=p.leather;for(const sd of [-1,1]){g.beginPath();g.moveTo(sd*9.6,-14);g.lineTo(sd*5,-15.2);g.lineTo(sd*6,-11);g.lineTo(sd*9.8,-10);g.closePath();g.fill()}}
      g.fillStyle=p.leather;g.fillRect(-9.5,-2.4,19,3.2);g.fillStyle='rgba(255,230,180,.25)';g.fillRect(-9.5,-2.4,19,.8);
      if(c>-.3){const x=s*6;Kit.solid(g,q=>q.rect(x-2,-3,4,4),x-2,-3,x+2,1,'#b8a070',{rim:'rgba(255,255,255,.9)',lineW:.5})}
      g.restore();Kit.outline(g,to,line(tc0),.9)}
    else if(W){Kit.solid(g,to,-10,-15,10,1,p.plate,{tex:'metal',texA:.5,rim:'rgba(255,255,255,.9)'});
      g.save();g.beginPath();to(g);g.clip();
      if(c>-.3){const x=s*4.2;// 가슴 능선 + 갈비 띠 + 문장
        g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=.9;g.beginPath();g.moveTo(x,-14);g.quadraticCurveTo(x+.6,-7,x,-1);g.stroke();
        g.strokeStyle='rgba(30,30,40,.35)';g.lineWidth=.7;for(const y of [-5,-3]){g.beginPath();g.moveTo(-9,y);g.quadraticCurveTo(x,y+1.4,9,y);g.stroke()}
        g.fillStyle=T;g.beginPath();g.moveTo(x-3,-11.5);g.lineTo(x,-8.2);g.lineTo(x+3,-11.5);g.lineTo(x+3,-10);g.lineTo(x,-6.6);g.lineTo(x-3,-10);g.closePath();g.fill();
        g.fillStyle=Kit.lit(p.tabard,.1);g.beginPath();g.arc(x,-12.6,1.3,0,6.283);g.fill();
        if(RT>=5){g.strokeStyle=Kit.rgb(Kit.hex(T),.8);g.lineWidth=.6;for(const sd of [-1,1]){g.beginPath();g.moveTo(x+sd*3.4,-14);g.quadraticCurveTo(x+sd*7,-10,x+sd*5,-5.4);g.stroke()}}
        const hl=g.createLinearGradient(-10,0,10,0);hl.addColorStop(0,'rgba(255,255,255,0)');hl.addColorStop(.32-s*.15,'rgba(255,255,255,.22)');hl.addColorStop(.5-s*.15,'rgba(255,255,255,0)');g.fillStyle=hl;g.fillRect(-10,-16,20,17)}
      else{g.strokeStyle='rgba(30,30,40,.45)';g.lineWidth=1.4;for(const sd of [-1,1]){g.beginPath();g.moveTo(sd*6,-15);g.lineTo(-sd*4,-2);g.stroke()}}
      // 목가리개(금속 깃)
      g.fillStyle=Kit.lit(p.plate,-.2);g.fillRect(-6,-15.4,12,2.2);g.fillStyle=T;g.fillRect(-6,-13.4,12,.7);
      // 허리띠
      g.fillStyle=p.leather;g.fillRect(-9.5,-2.4,19,3.2);g.fillStyle='rgba(255,230,180,.25)';g.fillRect(-9.5,-2.4,19,.8);
      if(c>-.3){const x=s*6;Kit.solid(g,q=>q.rect(x-2,-3,4,4),x-2,-3,x+2,1,T,{rim:'rgba(255,255,255,.9)',lineW:.5})}
      g.restore();Kit.outline(g,to,line(p.plate),.9);if(RT>=6){g.strokeStyle=T;g.lineWidth=1;g.beginPath();to(g);g.stroke()}}
    else{const tun=RT<1;Kit.solid(g,to,-10,-15,10,1,tun?p.tunic:p.leather,{tex:tun?'cloth':'leather',texA:.55,rim:rimC});
      g.save();g.beginPath();to(g);g.clip();
      // 바느질 솔기
      g.strokeStyle='rgba(240,220,180,.4)';g.setLineDash([1.2,1.2]);g.lineWidth=.5;g.beginPath();g.moveTo(-8.6,-9);g.quadraticCurveTo(0,-7.5,8.6,-9);g.stroke();g.setLineDash([]);
      if(c>-.3){const x=s*4;g.strokeStyle=Kit.lit(p.leather,-.45);g.lineWidth=.9;g.beginPath();g.moveTo(x,-15);g.lineTo(x,-3);g.stroke();
        g.strokeStyle='rgba(235,220,190,.75)';g.lineWidth=.5;g.beginPath();for(let y=-13;y<-4;y+=2){g.moveTo(x-1.3,y);g.lineTo(x+1.3,y+1.3);g.moveTo(x+1.3,y);g.lineTo(x-1.3,y+1.3)}g.stroke()}
      if(RT>=2&&!tun){g.fillStyle=Kit.lit(p.steel,-.1);for(let y=-13;y<-2;y+=3)for(const xx of [-7.4,-5,5,7.4])g.fillRect(xx+s*2-.5,y,1,1)}
      if(RT>=5&&c>-.3){g.strokeStyle=Kit.rgb(Kit.hex(T),.8);g.lineWidth=.6;for(const sd of [-1,1]){const x=s*4+sd*6;g.beginPath();g.moveTo(x,-13);g.quadraticCurveTo(x-sd*3,-10,x,-6);g.quadraticCurveTo(x+sd*2,-10,x,-13);g.stroke()}}
      // 화살통 끈(어깨→반대 허리)
      const sx=c>-.3?-5.5*Math.max(.4,c)+s*2:5*Math.max(.4,-c)-s*2,ex=-sx*1.1;
      g.strokeStyle=Kit.lit(p.leatherD,-.15);g.lineWidth=2.4;g.beginPath();g.moveTo(sx,-15.5);g.lineTo(ex,1);g.stroke();
      g.strokeStyle=T;g.lineWidth=.6;g.beginPath();g.moveTo(sx,-15.5);g.lineTo(ex,1);g.stroke();
      // 허리띠
      g.fillStyle=p.leatherD;g.fillRect(-9.5,-2.4,19,3);g.fillStyle='rgba(255,230,180,.22)';g.fillRect(-9.5,-2.4,19,.7);
      if(c>-.3){const x=s*6;Kit.solid(g,q=>q.rect(x-1.8,-2.8,3.6,3.6),x-2,-3,x+2,1,T,{rim:'rgba(255,255,255,.9)',lineW:.5})}
      g.restore();Kit.outline(g,to,line(tun?p.tunic:p.leather),.9)}},o);
  case'head':return SC.get(key,48,52,24,46,g=>{g.translate(24,46);const hx=s*1.2,hy=-8;
    if(W){const face=c>-.25;
      Kit.solid(g,q=>q.arc(hx,hy,6.3,0,6.283),hx-6,hy-6,hx+6,hy+6,face?p.skin:RT>=3?Kit.lit(p.plate,-.15):p.hair,{rim:'rgba(255,240,220,.7)',lineW:.7});
      if(face){if(RT<3){g.fillStyle=p.hair;g.beginPath();g.ellipse(hx-s*2.2,hy-2.4,6.8,4.4,0,Math.PI*.95,Math.PI*2.05);g.fill();if(Math.abs(s)>.5){g.beginPath();g.ellipse(hx-s*4.6,hy+.6,2.6,4.6,0,0,6.283);g.fill()}}
        heroEyes(g,hx+s*2.6,hy+1.4,s,c);heroFaceD(g,hx+s*2.6,hy+1.4,s,c,p.skin);g.fillStyle='rgba(90,60,40,.35)';g.beginPath();g.ellipse(hx+s*2.8,hy+4.6,2.6*Math.max(.4,c),.9,0,0,6.283);g.fill()}
      if(RT<1)return;
      if(RT<3){// 가죽 모자
        Kit.solid(g,q=>{q.ellipse(hx,hy-2.6,7.2,5,0,Math.PI,0);q.lineTo(hx+7.2,hy-1.6);q.lineTo(hx-7.2,hy-1.6);q.closePath()},hx-7,hy-8,hx+7,hy-1,p.leather,{tex:'leather',texA:.5,rim:'rgba(255,230,200,.6)',lineW:.6});
        g.fillStyle=Kit.lit(p.leather,-.3);g.fillRect(hx-7.2,hy-2.8,14.4,1.4);if(RT>=2){g.fillStyle=p.steel;g.fillRect(hx-.7,hy-7.4,1.4,5)}return}
      // 투구: 둥근 정수리 + 이마 띠 + 볼가리개 + 코가리개
      const dome=q=>{q.moveTo(hx-7.4,hy-.4);q.bezierCurveTo(hx-7.6,hy-9.6,hx+7.6,hy-9.6,hx+7.4,hy-.4);q.lineTo(hx+7.4,hy+.6);q.quadraticCurveTo(hx,hy-1.6,hx-7.4,hy+.6);q.closePath()};
      Kit.solid(g,dome,hx-8,hy-9,hx+8,hy+1,p.plate,{tex:'metal',texA:.45,rim:'rgba(255,255,255,.95)',lineW:.8});
      g.fillStyle=T;g.beginPath();g.moveTo(hx-7.5,hy-.2);g.quadraticCurveTo(hx,hy-2.6,hx+7.5,hy-.2);g.lineTo(hx+7.5,hy+.9);g.quadraticCurveTo(hx,hy-1.4,hx-7.5,hy+.9);g.closePath();g.fill();
      if(face){const fx=hx+s*2.6;g.fillStyle=Kit.lit(p.plate,.2);g.fillRect(fx-.9,hy-1,1.8,6);g.strokeStyle=line(p.plate);g.lineWidth=.5;g.strokeRect(fx-.9,hy-1,1.8,6);
        for(const sd of [-1,1]){if(sd*s<-.5)continue;const cx=fx+sd*5.4*Math.max(.55,c);Kit.solid(g,q=>{q.moveTo(cx-1.6,hy);q.lineTo(cx+1.6,hy);q.lineTo(cx+1.2*sd,hy+6.6);q.lineTo(cx-1.4*sd,hy+5.8);q.closePath()},cx-2,hy,cx+2,hy+7,p.plate,{lineW:.5})}}
      else{g.fillStyle=Kit.lit(p.plate,-.1);g.beginPath();g.moveTo(hx-6.6,hy);g.lineTo(hx+6.6,hy);g.lineTo(hx+6,hy+6.4);g.lineTo(hx-6,hy+6.4);g.closePath();g.fill();g.strokeStyle='rgba(30,30,40,.4)';g.lineWidth=.6;for(let y=hy+1.6;y<hy+6;y+=1.6){g.beginPath();g.moveTo(hx-6,y);g.lineTo(hx+6,y);g.stroke()}}
      if(RT<4)return;
      if(RT>=6){for(const sd of [-1,1]){if(sd*s<-.6)continue;const x=hx+sd*6.8;Kit.solid(g,q=>{q.moveTo(x,hy-3);q.quadraticCurveTo(x+sd*4.4,hy-9,x+sd*3.4,hy-13.4);q.quadraticCurveTo(x+sd*1.6,hy-8,x-sd*.6,hy-5);q.closePath()},x-5,hy-14,x+5,hy-3,RT>=7?T:'#eef0f6',{tex:'metal',texA:.3,rim:'rgba(255,255,255,.95)',lineW:.5})}}
      if(RT>=7){g.fillStyle=T;for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(hx+i*2.6-1.2,hy-6.4);g.lineTo(hx+i*2.6,hy-10.4+Math.abs(i)*.8);g.lineTo(hx+i*2.6+1.2,hy-6.4);g.fill()}}
      // 볏(깃털 장식): 앞에서는 좁고 옆에서는 길게 (5단계부터 길고 등급색)
      const pl=(4+Math.abs(s)*7)*(RT>=5?1.35:1),py=hy-8.4;
      const crest=q=>{q.moveTo(hx-s*pl*.55-.9,py+1);q.bezierCurveTo(hx-s*pl*.5,py-5.4,hx+s*pl*.5,py-5.8,hx+s*pl*.6+1.2,py-2);q.quadraticCurveTo(hx+s*pl*.2,py-1.4,hx-s*pl*.1,py+1.4);q.closePath()};
      Kit.solid(g,crest,hx-pl,py-6,hx+pl,py+1,RT>=5?Kit.lit(T,-.1):p.tabard,{tex:'cloth',texA:.4,rim:'rgba(255,220,200,.7)',lineW:.6});
      g.strokeStyle=Kit.lit(p.tabard,.35);g.lineWidth=.5;for(let i=0;i<4;i++){const u=i/3;g.beginPath();g.moveTo(hx-s*pl*.4+s*pl*.9*u,py-4.4+Math.abs(u-.5)*2);g.lineTo(hx-s*pl*.3+s*pl*.8*u,py-.4);g.stroke()}
      g.fillStyle=T;g.beginPath();g.arc(hx,py+.4,1.1,0,6.283);g.fill();return}
    // 궁수: 0단계 맨머리(묶은 머리) · 1~3 깃털 모자 · 4~ 뾰족 두건 · 6~ 잎관
    if(RT<4){const face=c>-.25;
      if(!face){g.fillStyle=p.hair;g.beginPath();g.ellipse(hx,hy+6,2,4,0,0,6.283);g.fill()}
      Kit.solid(g,q=>q.arc(hx,hy,6.3,0,6.283),hx-6,hy-6,hx+6,hy+6,face?p.skin:p.hair,{rim:'rgba(255,240,220,.7)',lineW:.7});
      if(face){g.fillStyle=p.hair;g.beginPath();g.ellipse(hx-s*2.2,hy-2.4,6.8,4.4,0,Math.PI*.95,Math.PI*2.05);g.fill();if(Math.abs(s)>.5){g.beginPath();g.ellipse(hx-s*4.6,hy+.6,2.6,4.6,0,0,6.283);g.fill();g.beginPath();g.ellipse(hx-s*7,hy+3,1.6,3.4,-s*.4,0,6.283);g.fill()}
        heroEyes(g,hx+s*2.6,hy+1.4,s,c);heroFaceD(g,hx+s*2.6,hy+1.4,s,c,p.skin)}
      if(RT>=1){const cap=q=>{q.moveTo(hx-8,hy-2.6);q.quadraticCurveTo(hx-6,hy-10,hx+1-s*2,hy-10.4);q.quadraticCurveTo(hx+7,hy-8,hx+8.4,hy-2.4);q.quadraticCurveTo(hx,hy-.4,hx-8,hy-2.6);q.closePath()};
        Kit.solid(g,cap,hx-8,hy-11,hx+8,hy-1,p.hood,{tex:'cloth',texA:.45,rim:rimC});g.fillStyle=Kit.lit(p.leather,-.1);g.fillRect(hx-7.4,hy-4.6,14.8,1.4);
        g.save();g.translate(hx-s*4+2,hy-5);g.rotate(-.9-s*.4);Kit.solid(g,q=>{q.ellipse(0,-6,1.6,6.4,0,0,6.283)},-2,-12,2,0,RT>=3?T:p.feather,{lineW:.4});g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.4;g.beginPath();g.moveTo(0,0);g.lineTo(0,-12);g.stroke();g.restore()}
      return}
    const hood=q=>{q.moveTo(hx-8.4,hy+5);q.bezierCurveTo(hx-9.6,hy-6,hx-5,hy-10.4,hx-s*4,hy-11.6);q.quadraticCurveTo(hx-s*7-s*3,hy-13.2,hx-s*11,hy-9.2);q.bezierCurveTo(hx+s*-2+6,hy-12,hx+9.6,hy-5,hx+8.4,hy+5);q.quadraticCurveTo(hx,hy+8.6,hx-8.4,hy+5);q.closePath()};
    Kit.solid(g,hood,hx-11,hy-13,hx+10,hy+8,p.hood,{tex:'cloth',texA:.5,rim:rimC,lineW:.8});
    if(c>-.25){const fw=5.3*(.55+.45*Math.max(0,c)),fx=hx+s*2.5;
      g.fillStyle=Kit.lit(p.hood,-.55);g.beginPath();g.ellipse(fx,hy+1.2,fw+1.2,6.8,0,0,6.283);g.fill();
      Kit.solid(g,q=>q.ellipse(fx,hy+1.6,fw,5.7,0,0,6.283),fx-fw,hy-4,fx+fw,hy+7,p.skin,{rim:'rgba(255,240,220,.7)',lineW:.6});
      g.fillStyle=p.hair;g.beginPath();g.moveTo(fx-fw,hy-.6);g.quadraticCurveTo(fx-fw*.4,hy-5.6,fx+fw,hy-1.6);g.quadraticCurveTo(fx+fw*.3,hy-2.6,fx-fw*.2,hy-.4);g.quadraticCurveTo(fx-fw*.6,hy+1,fx-fw,hy-.6);g.fill();
      heroEyes(g,fx,hy+1.8,s,c);heroFaceD(g,fx,hy+1.8,s,c,p.skin);
      g.strokeStyle=T;g.lineWidth=.9;g.beginPath();g.ellipse(fx,hy+1.4,fw+1.4,7,0,3.6,5.8);g.stroke()}
    else{g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(p.hood,-.5)),.5);g.lineWidth=1;g.beginPath();g.moveTo(hx,hy-10);g.quadraticCurveTo(hx+1,hy-2,hx,hy+6);g.stroke()}
    g.strokeStyle=T;g.lineWidth=1;g.beginPath();g.ellipse(hx,hy+6,7.6,2.2,0,0,Math.PI);g.stroke();
    if(RT>=6){g.fillStyle=RT>=7?'#ffe39a':Kit.lit(T,.1);for(let i=-2;i<=2;i++){const x=hx+i*2.8-s*1.4,y=hy-8.6+Math.abs(i)*.9;g.save();g.translate(x,y);g.rotate(i*.35);g.beginPath();g.ellipse(0,-1.6,1,2.4,0,0,6.283);g.fill();g.restore()}}},o);
  case'cloak':if(L&&(W?RT<2:RT<1))return null;return SC.get(key,44,44,22,4,g=>{g.translate(22,4);const wf=.72+.28*Math.abs(c),tr=-s*5,L=W?26:30;
    const ck=q=>{q.moveTo(-9*wf,0);q.lineTo(9*wf,0);q.bezierCurveTo(12.6*wf,8,14*wf+tr,L*.7,14.6*wf+tr,L);
      if(W){for(let i=0;i<=3;i++){const x=(14.6-i*9.73)*wf+tr;q.quadraticCurveTo(x-4.8*wf,L+2.2,x-9.73*wf,L+(i%2?0:.6))}}
      else{for(let i=0;i<7;i++){const x=(14.6-i*4.17)*wf+tr;q.lineTo(x-2.1*wf,L+3+(i%2?1.6:0));q.lineTo(x-4.17*wf,L)}}
      q.bezierCurveTo(-14*wf+tr,L*.7,-12.6*wf,8,-9*wf,0);q.closePath()};
    const inside=c>.2,cc=inside?Kit.lit(p.lining,-.2):p.cloak;
    Kit.solid(g,ck,-15,0,15,L+3,cc,{tex:'cloth',texA:.5,rim:inside?'rgba(255,240,214,.35)':rimC});
    g.save();g.beginPath();ck(g);g.clip();
    g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1.3;for(const fx of [-7.5,-2.5,2.5,7.5]){g.beginPath();g.moveTo(fx*.5*wf,3);g.quadraticCurveTo(fx*wf+tr*.4,L*.55,fx*1.1*wf+tr,L+2);g.stroke()}
    if(!inside){if(W&&c<-.3){const y=11,x=tr*.4;g.fillStyle=T;g.beginPath();g.moveTo(x,y-6);g.lineTo(x+5,y-3);g.lineTo(x+4,y+4);g.lineTo(x,y+7);g.lineTo(x-4,y+4);g.lineTo(x-5,y-3);g.closePath();g.fill();
        g.fillStyle=p.cloak;g.beginPath();g.moveTo(x,y-3.6);g.lineTo(x+2.6,y-1.8);g.lineTo(x+2,y+2.6);g.lineTo(x,y+4.4);g.lineTo(x-2,y+2.6);g.lineTo(x-2.6,y-1.8);g.closePath();g.fill()}
      g.strokeStyle=T;g.lineWidth=W?1.8:1.1;g.beginPath();g.moveTo(-9*wf,0);g.bezierCurveTo(-12.6*wf,8,-14*wf+tr,L*.7,-14.6*wf+tr,L);g.moveTo(9*wf,0);g.bezierCurveTo(12.6*wf,8,14*wf+tr,L*.7,14.6*wf+tr,L);g.stroke()}
    g.restore();Kit.outline(g,ck,line(p.cloak),.9);
    if(c>-.3){g.fillStyle=T;for(const sd of [-1,1]){g.beginPath();g.arc(sd*7.4*wf+s*2,1,1.6,0,6.283);g.fill()}}},o);
  case'arm':case'armB':return SC.get(key,18,24,9,4,g=>{g.translate(9,4);const back=part==='armB',dk=x=>back?Kit.lit(x,-.28):x,rim=back?'rgba(255,240,214,.3)':rimC;
    if(W&&RT<4){const mail=RT>=2,sl=q=>{q.moveTo(-3,-1.5);q.quadraticCurveTo(0,-3,3,-1.5);q.lineTo(3.6,9);q.lineTo(-3.6,9);q.closePath()};
      Kit.solid(g,sl,-4,-2,4,9,dk(mail?p.mail:Kit.lit(p.tabard,-.1)),{tex:mail?'metal':'cloth',texA:.45,rim,lineW:.7});
      Kit.solid(g,q=>{q.moveTo(-3.5,8);q.lineTo(3.5,8);q.lineTo(3.1,13);q.lineTo(-3.1,13);q.closePath()},-4,8,4,13,dk(p.leather),{tex:'leather',texA:.5,rim,lineW:.6});
      Kit.solid(g,q=>q.ellipse(0,15,2.8,2.8,0,0,6.283),-3,12,3,18,dk(RT>=1?p.leather:p.skin),{rim,lineW:.6});
      Kit.solid(g,q=>{q.ellipse(-2.2,14,1,1.7,-.5,0,6.283)},-3.3,12.3,-1.1,15.8,dk(RT>=1?Kit.lit(p.leather,-.06):p.skin),{lineW:.45});
      if(RT>=1){const pd=q=>{q.moveTo(-4.6,2);q.bezierCurveTo(-5.2,-3.6,5.2,-3.6,4.6,2);q.quadraticCurveTo(0,3.6,-4.6,2);q.closePath()};Kit.solid(g,pd,-5,-3,5,3,dk(p.leather),{tex:'leather',texA:.5,rim,lineW:.6})}}
    else if(W){const sl=q=>{q.moveTo(-3,-1);q.lineTo(3,-1);q.lineTo(3.8,10);q.lineTo(-3.8,10);q.closePath()};
      Kit.solid(g,sl,-4,-1,4,10,dk(p.mail),{tex:'metal',texA:.4,rim,lineW:.7});
      Kit.solid(g,q=>{q.moveTo(-3.6,8);q.lineTo(3.6,8);q.lineTo(3.4,13);q.lineTo(-3.4,13);q.closePath()},-4,8,4,13,dk(p.plate),{tex:'metal',texA:.4,rim,lineW:.6});
      Kit.solid(g,q=>q.ellipse(0,15,3.1,2.8,0,0,6.283),-3,12,3,18,dk(p.plateD),{rim,lineW:.6});
      g.strokeStyle=T;g.lineWidth=.8;g.beginPath();g.moveTo(-3.5,8.2);g.lineTo(3.5,8.2);g.stroke();
      // 어깨받이
      const pd=q=>{q.moveTo(-5.4,2.4);q.bezierCurveTo(-6.2,-4.4,6.2,-4.4,5.4,2.4);q.quadraticCurveTo(0,4.6,-5.4,2.4);q.closePath()};
      Kit.solid(g,pd,-6,-4,6,4,dk(p.plate),{tex:'metal',texA:.45,rim:back?rim:'rgba(255,255,255,.95)',lineW:.7});
      g.strokeStyle=T;g.lineWidth=1.1;g.beginPath();g.moveTo(-5.3,2.2);g.quadraticCurveTo(0,4.4,5.3,2.2);g.stroke();
      if(RT>=5){const pd2=q=>{q.moveTo(-6,3.4);q.bezierCurveTo(-6.6,0,6.6,0,6,3.4);q.quadraticCurveTo(0,5.6,-6,3.4);q.closePath()};Kit.solid(g,pd2,-6.6,0,6.6,6,dk(Kit.lit(p.plate,-.08)),{tex:'metal',texA:.4,rim,lineW:.6});if(RT>=6){g.strokeStyle=T;g.lineWidth=.9;g.beginPath();g.moveTo(-6,3.4);g.quadraticCurveTo(0,5.6,6,3.4);g.stroke()}}}
    else{const sl=q=>{q.moveTo(-3,-1.5);q.quadraticCurveTo(0,-3,3,-1.5);q.lineTo(3.6,8);q.lineTo(-3.6,8);q.closePath()};
      Kit.solid(g,sl,-4,-2,4,8,dk(p.tunic),{tex:'cloth',texA:.45,rim,lineW:.7});
      Kit.solid(g,q=>{q.moveTo(-3.5,7.4);q.lineTo(3.5,7.4);q.lineTo(3,13);q.lineTo(-3,13);q.closePath()},-4,7,4,13,dk(p.leather),{tex:'leather',texA:.5,rim,lineW:.6});
      g.strokeStyle=T;g.lineWidth=.6;g.beginPath();g.moveTo(-3.4,8.6);g.lineTo(3.4,8.6);g.moveTo(-3.1,11.8);g.lineTo(3.1,11.8);g.stroke();
      Kit.solid(g,q=>q.arc(0,15,2.6,0,6.283),-2.6,12.4,2.6,17.6,dk(Kit.mix(p.skin,p.leatherD,.35)),{lineW:.6});
      Kit.solid(g,q=>{q.ellipse(-2.1,14,1,1.6,-.5,0,6.283)},-3.2,12.4,-1,15.6,dk(Kit.mix(p.skin,p.leatherD,.3)),{lineW:.4});
      if(RT>=3){const pd=q=>{q.moveTo(-4.4,2);q.bezierCurveTo(-5,-3.4,5,-3.4,4.4,2);q.quadraticCurveTo(0,3.4,-4.4,2);q.closePath()};Kit.solid(g,pd,-5,-3,5,3,dk(p.leather),{tex:'leather',texA:.5,rim,lineW:.6});if(RT>=5){g.fillStyle=T;g.beginPath();g.arc(0,-.4,.8,0,6.283);g.fill()}}}},o);
  // 무기: 손잡이가 (0,0), 칼날·자루는 위(-y)
  case'sword':return SC.get(`h18/sword/${wk}/${v}/${sc.toFixed(2)}`,20,52,10,40,g=>{g.translate(10,40);const P=HERO18.warrior;
    // 칼날: 단계마다 길고 넓어지고(0~4), 5단계부터 물결 날, 6단계부터 룬, 7단계 금빛
    const ln=23+WT*1.3,w=1.4+WT*.14,wv=WT>=5,tp=-3-ln;
    const bl=q=>{q.moveTo(-w,-3);if(wv){for(let i=1;i<=4;i++)q.quadraticCurveTo(-w-1.1*(i%2),-3-ln*.82*(i-.5)/4,-w*.9,-3-ln*.82*i/4)}else q.lineTo(-w*.85,-3-ln*.86);q.lineTo(0,tp);
      if(wv){q.lineTo(w*.9,-3-ln*.82);for(let i=4;i>=1;i--)q.quadraticCurveTo(w+1.1*(i%2),-3-ln*.82*(i-.5)/4,w,-3-ln*.82*(i-1)/4)}else{q.lineTo(w*.85,-3-ln*.86);q.lineTo(w,-3)}q.closePath()};
    Kit.solid(g,bl,-w-1,tp,w+1,-3,WT>=7?'#f4ecd0':P.steel,{tex:'metal',texA:.35,rim:'rgba(255,255,255,1)',rimW:.5,lineW:.5});
    g.strokeStyle='rgba(90,100,120,.55)';g.lineWidth=.6;g.beginPath();g.moveTo(0,-4);g.lineTo(0,tp+5);g.stroke();
    g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=.4;g.beginPath();g.moveTo(-w*.7,-4);g.lineTo(-w*.55,tp+4);g.stroke();
    if(WT>=6){g.fillStyle=Kit.rgb(Kit.hex(v||P.gem),.9);for(let i=0;i<4;i++)g.fillRect(-.5,-8-i*ln/5.2,1,1.8)}
    const gw=4.2+WT*.5;Kit.solid(g,q=>{q.moveTo(-gw,-3.6);q.quadraticCurveTo(0,WT>=3?-1.4:-2.2,gw,-3.6);if(WT>=4){q.lineTo(gw+1,-5)}q.lineTo(gw-.6,-1.6);q.quadraticCurveTo(0,-.8,-gw+.6,-1.6);if(WT>=4){q.lineTo(-gw-1,-5)}q.closePath()},-gw-1,-5,gw+1,-1,WT>=4?trim:'#8a7a5a',{rim:'rgba(255,255,255,.9)',lineW:.5});
    Kit.solid(g,q=>q.rect(-1.1,-1.4,2.2,6),-1,-1,1,5,P.leather,{tex:'leather',texA:.5,lineW:.5});
    Kit.solid(g,q=>q.arc(0,6.2,1.7,0,6.283),-2,4.5,2,8,v||P.gem,{rim:'rgba(255,255,255,.95)',lineW:.5})},o);
  case'polearm':return SC.get(`h18/pole/${wk}/${v}/${sc.toFixed(2)}`,22,84,11,60,g=>{g.translate(11,60);const P=HERO18.warrior;
    Kit.solid(g,q=>q.rect(-1.1,-38,2.2,56),-1,-38,1,18,P.wood,{tex:'wood',texA:.6,rim:'rgba(255,240,214,.6)',rimW:.4,lineW:.5});
    for(const y of [-37,-24,-6,16])Kit.solid(g,q=>q.rect(-1.5,y,3,1.6),-1.5,y,1.5,y+1.6,y===-37?trim:P.plateD,{lineW:.4});
    // 잎 모양 창날 + 한쪽 초승달 도끼날
    const hd=q=>{q.moveTo(0,-56);q.bezierCurveTo(2.6,-50,2.8,-44,1.4,-38);q.lineTo(-1.4,-38);q.bezierCurveTo(-2.8,-44,-2.6,-50,0,-56);q.closePath()};
    Kit.solid(g,hd,-3,-56,3,-38,P.steel,{tex:'metal',texA:.3,rim:'rgba(255,255,255,1)',rimW:.5,lineW:.5});
    g.strokeStyle='rgba(90,100,120,.55)';g.lineWidth=.5;g.beginPath();g.moveTo(0,-53);g.lineTo(0,-39.5);g.stroke();
    // 창 → (3단계~) 도끼날 → (5단계~) 뒤 갈고리 → (6단계~) 큰 도끼날
    if(WT>=3){const aw=WT>=6?1.25:1,ax=q=>{q.moveTo(1,-42);q.bezierCurveTo(6*aw,-46-aw,9.6*aw,-42,8.6*aw,-35+aw);q.quadraticCurveTo(6.2*aw,-38,1,-36.2);q.closePath()};
      Kit.solid(g,ax,1,-47,11,-34,WT>=7?'#f0e0a8':Kit.lit(P.steel,-.1),{tex:'metal',texA:.3,rim:'rgba(255,255,255,.9)',lineW:.5})}
    if(WT>=5)Kit.solid(g,q=>{q.moveTo(-1,-41);q.lineTo(-6.4,-44);q.lineTo(-3,-38);q.closePath()},-7,-44,-1,-38,Kit.lit(P.steel,-.15),{tex:'metal',texA:.3,lineW:.4});
    // 술 장식 (등급색 보석)
    g.strokeStyle=trim;g.lineWidth=.8;for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(0,-35.4);g.quadraticCurveTo(i*.8,-32,i*1.3-.8,-28.6);g.stroke()}
    Kit.solid(g,q=>q.arc(0,-35.6,1.3,0,6.283),-1.3,-37,1.3,-34.3,v||P.gem,{rim:'rgba(255,255,255,.95)',lineW:.4});
    Kit.solid(g,q=>{q.moveTo(-1.6,18);q.lineTo(1.6,18);q.lineTo(0,22);q.closePath()},-1.6,18,1.6,22,P.plateD,{lineW:.4})},o);
  // 활: 손잡이 (0,0), 몸통이 +x(앞)으로 휘고 줄은 -x. v = 당김 0/1/2
  case'bow':return SC.get(`h18/bow/${wk}/${v}/${sc.toFixed(2)}`,40,54,22,27,g=>{g.translate(22,27);const P=HERO18.archer,dl=[0,5,10.5][v|0],bw=WT>=6?'#e8dcc0':WT>=4?'#5a3020':P.wood;
    const limb=sd=>{g.beginPath();g.moveTo(.6,sd*2.6);g.bezierCurveTo(4.8,sd*8,5.2,sd*17,1.4,sd*22.4);g.quadraticCurveTo(.2,sd*24.2,-1.6,sd*23.6)};
    const tip=sd=>[-1.2,sd*23.2];
    // 줄
    const [x0,y0]=tip(-1),[x1,y1]=tip(1);g.strokeStyle='rgba(240,232,210,.9)';g.lineWidth=.55;g.beginPath();g.moveTo(x0,y0);g.lineTo(-dl,0);g.lineTo(x1,y1);g.stroke();
    for(const sd of [-1,1]){limb(sd);g.strokeStyle=Kit.lit(bw,-.55);g.lineWidth=3;g.lineCap='round';g.stroke();limb(sd);g.strokeStyle=bw;g.lineWidth=2;g.stroke();limb(sd);g.strokeStyle='rgba(255,236,200,.45)';g.lineWidth=.6;g.stroke();
      g.fillStyle=trim;g.beginPath();g.arc(1.4,sd*21.8,.9,0,6.283);g.fill();
      if(WT>=2){g.fillStyle=WT>=4?trim:'#a8a090';g.fillRect(3.4,sd*11-1,2,2)}
      if(WT>=3){g.fillStyle=P.steel;g.beginPath();g.moveTo(-1.6,sd*23.6);g.lineTo(-3.6,sd*25);g.lineTo(-.4,sd*21.6);g.closePath();g.fill()}
      if(WT>=5){g.fillStyle=Kit.rgb(Kit.hex(trim),.85);g.save();g.translate(5.2,sd*7);g.rotate(sd*.5);g.beginPath();g.ellipse(2.2,0,3,1.1,0,0,6.283);g.fill();g.restore()}}
    Kit.solid(g,q=>q.rect(-.6,-3.4,2.6,6.8),-1,-3,2,3,P.leatherD,{tex:'leather',texA:.5,lineW:.5});
    g.fillStyle=trim;g.fillRect(-.6,-3.6,2.6,.7);g.fillRect(-.6,2.9,2.6,.7);
    Kit.solid(g,q=>q.arc(2.6,0,1.2,0,6.283),1.4,-1.2,3.8,1.2,P.gem,{lineW:.4});
    if(dl>0){// 메긴 화살
      g.strokeStyle='#8a6a40';g.lineWidth=.9;g.beginPath();g.moveTo(-dl,0);g.lineTo(14,0);g.stroke();
      g.fillStyle=P.steel;g.beginPath();g.moveTo(17,0);g.lineTo(13.4,-1.5);g.lineTo(13.4,1.5);g.closePath();g.fill();
      g.fillStyle=P.feather;g.beginPath();g.moveTo(-dl+.4,0);g.lineTo(-dl+3.6,-1.6);g.lineTo(-dl+4.4,0);g.lineTo(-dl+3.6,1.6);g.closePath();g.fill()}},o);
  // 석궁 옆모습: 개머리 -x, 앞 +x, 손잡이 (0,0)
  case'xbow':return SC.get(`h18/xbow/${wk}/${v}/${sc.toFixed(2)}`,40,24,20,12,g=>{g.translate(20,12);const P=HERO18.archer;
    const st=q=>{q.moveTo(-14,-1.2);q.lineTo(-6,-2);q.lineTo(13,-2);q.lineTo(13,.8);q.lineTo(-4,1);q.lineTo(-6,3.2);q.lineTo(-14,2.6);q.closePath()};
    Kit.solid(g,st,-14,-2,13,3,P.wood,{tex:'wood',texA:.6,rim:'rgba(255,236,200,.6)',lineW:.5});
    g.fillStyle=trim;g.fillRect(-6.4,-2.2,1.2,3.4);g.fillRect(8,-2.2,1,3);
    if(WT>=3){g.fillStyle=P.steel;g.fillRect(-1,-2.4,8,1)}if(WT>=5){g.fillStyle=trim;g.fillRect(-13.4,-1,1.4,3)}
    Kit.solid(g,q=>q.rect(-2.4,1,1.4,4),-2,1,-1,5,P.steel,{lineW:.4});
    // 활대(옆에서 보면 짧은 세로선)
    Kit.solid(g,q=>{q.moveTo(10.6,-9);q.quadraticCurveTo(13.4,0,10.6,9);q.lineTo(9.6,9);q.quadraticCurveTo(12.2,0,9.6,-9);q.closePath()},9,-9,13,9,Kit.lit(P.steel,-.25),{rim:'rgba(255,255,255,.9)',lineW:.5});
    // 화살(볼트)
    g.strokeStyle='#6a4a2a';g.lineWidth=.9;g.beginPath();g.moveTo(-3,-2.6);g.lineTo(15,-2.6);g.stroke();g.fillStyle=P.steel;g.beginPath();g.moveTo(17.4,-2.6);g.lineTo(14.6,-3.8);g.lineTo(14.6,-1.4);g.closePath();g.fill();
    Kit.solid(g,q=>q.arc(-10,0.6,1.1,0,6.283),-11,-.5,-9,1.7,P.gem,{lineW:.3})},o);
  // 석궁 활대 위에서 본 모습(앞·뒤를 볼 때): x = 좌우, y = 뒤(+)
  case'xprod':return SC.get(`h18/xprod/${wk}/${sc.toFixed(2)}`,30,10,15,3,g=>{g.translate(15,3);const P=HERO18.archer;
    g.strokeStyle='rgba(240,232,210,.85)';g.lineWidth=.5;g.beginPath();g.moveTo(-12.6,3.6);g.lineTo(0,5.4);g.lineTo(12.6,3.6);g.stroke();
    g.strokeStyle=Kit.lit(P.steel,-.5);g.lineWidth=2.6;g.lineCap='round';g.beginPath();g.moveTo(-13,3.8);g.quadraticCurveTo(0,-3.6,13,3.8);g.stroke();
    g.strokeStyle=P.steel;g.lineWidth=1.5;g.beginPath();g.moveTo(-13,3.8);g.quadraticCurveTo(0,-3.6,13,3.8);g.stroke();
    g.fillStyle=trim;g.fillRect(-1.5,-1.2,3,2.4)},o);
  // 방패 앞(v=0)·뒤(v=1). 가운데(손잡이)가 (0,0)
  case'shield':return SC.get(`h18/shield/${trim}/${OT}/${p.tabard}/${v}/${sc.toFixed(2)}`,28,32,14,15,g=>{g.translate(14,15);const P=Object.assign({},HERO18.warrior,{tabard:p.tabard});
    // 방패: 0~1 둥근 나무 · 2~3 연 모양 · 4~ 큰 문장 방패(5~ 보석)
    const sh=OT<=1?q=>q.arc(0,0,9,0,6.283):OT<=3?q=>{q.moveTo(-9,-11);q.quadraticCurveTo(0,-13,9,-11);q.lineTo(9,-2);q.bezierCurveTo(9,6,4,10,0,13);q.bezierCurveTo(-4,10,-9,6,-9,-2);q.closePath()}
      :q=>{q.moveTo(-10.4,-12.4);q.quadraticCurveTo(0,-14.6,10.4,-12.4);q.lineTo(10,0);q.bezierCurveTo(10,7,5,11.6,0,14.6);q.bezierCurveTo(-5,11.6,-10,7,-10,0);q.closePath()};
    if(OT<=1&&!v){Kit.solid(g,sh,-9,-9,9,9,'#7a5430',{tex:'wood',texA:.6,rim:'rgba(255,230,210,.8)',lineW:.8});g.save();g.beginPath();sh(g);g.clip();g.strokeStyle='rgba(40,20,10,.5)';g.lineWidth=.6;for(let x=-6;x<=6;x+=3){g.beginPath();g.moveTo(x,-9);g.lineTo(x,9);g.stroke()}g.restore();
      g.strokeStyle=OT>=1?trim:Kit.lit(P.steel,-.3);g.lineWidth=1.6;g.beginPath();sh(g);g.stroke();Kit.solid(g,q=>q.arc(0,0,2.8,0,6.283),-3,-3,3,3,P.steel,{rim:'rgba(255,255,255,1)',lineW:.5});return}
    if(v){Kit.solid(g,sh,-9,-12,9,13,Kit.lit(P.wood,-.15),{tex:'wood',texA:.6,lineW:.8});
      g.strokeStyle=P.leather;g.lineWidth=2;g.beginPath();g.moveTo(-5,-4);g.lineTo(5,-4);g.moveTo(-5,3);g.lineTo(5,3);g.stroke();
      g.strokeStyle=trim;g.lineWidth=1;g.beginPath();sh(g);g.stroke();return}
    Kit.solid(g,sh,-9,-12,9,13,P.tabard,{tex:'cloth',texA:.3,rim:'rgba(255,230,210,.8)',lineW:.8});
    g.save();g.beginPath();sh(g);g.clip();
    g.fillStyle=Kit.lit(P.steel,-.05);g.beginPath();g.moveTo(-1.6,-13);g.lineTo(1.6,-13);g.lineTo(1.6,14);g.lineTo(-1.6,14);g.closePath();g.fill();
    g.fillRect(-10,-5.4,20,2.6);g.restore();
    g.strokeStyle=trim;g.lineWidth=1.6;g.beginPath();sh(g);g.stroke();g.strokeStyle=Kit.lit(trim,.4);g.lineWidth=.5;g.beginPath();g.moveTo(-8,-10.4);g.quadraticCurveTo(0,-12.2,8,-10.4);g.stroke();
    Kit.solid(g,q=>q.arc(0,-4,2.8,0,6.283),-3,-7,3,-1,P.steel,{rim:'rgba(255,255,255,1)',lineW:.5});
    g.fillStyle=trim;g.beginPath();g.arc(0,-4,1,0,6.283);g.fill();
    if(OT>=4){g.fillStyle=Kit.lit(trim,.15);g.beginPath();g.moveTo(0,1);g.lineTo(3.6,5.4);g.lineTo(0,10);g.lineTo(-3.6,5.4);g.closePath();g.fill()}
    if(OT>=5){g.fillStyle=HERO18.warrior.gem;g.beginPath();g.arc(0,5.4,1.4,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.85)';g.fillRect(-.7,4.6,.7,.7)}},o);
  // 화살통: 가운데가 (0,0), 입구는 위(-y)
  case'quiver':return SC.get(`h18/quiver/${trim}/${OT}/${sc.toFixed(2)}`,16,30,8,14,g=>{g.translate(8,14);const P=HERO18.archer,na=3+Math.min(4,OT);
    for(let i=0;i<na;i++){const x=-(na-1)*.65+i*1.3,y=-12-((i*7)%3);g.strokeStyle='#8a6a40';g.lineWidth=.6;g.beginPath();g.moveTo(x,-8);g.lineTo(x,y);g.stroke();
      g.fillStyle=i%2?P.feather:OT>=3?trim:Kit.lit(P.tunic,.2);g.beginPath();g.moveTo(x,y-3.4);g.lineTo(x+1.1,y-1.8);g.lineTo(x+1,y+.6);g.lineTo(x,y);g.lineTo(x-1,y+.6);g.lineTo(x-1.1,y-1.8);g.closePath();g.fill()}
    const qv=q=>{q.moveTo(-3.8,-9);q.lineTo(3.8,-9);q.lineTo(3.2,12);q.quadraticCurveTo(0,13.6,-3.2,12);q.closePath()};
    Kit.solid(g,qv,-4,-9,4,13,P.leather,{tex:'leather',texA:.6,rim:'rgba(255,230,200,.6)',lineW:.6});
    g.fillStyle=trim;g.fillRect(-3.9,-9.4,7.8,1.4);g.fillRect(-3.5,6,7,1);
    g.strokeStyle='rgba(240,220,180,.4)';g.setLineDash([1,1]);g.lineWidth=.45;g.beginPath();g.moveTo(-2.4,-7);g.lineTo(-2,11);g.stroke();g.setLineDash([])},o);
  }}
function heroBake18(h,bs){const col=heroColors18(h),cls=h.cls,W=h18weap(h,{}),L=heroLook18(h),pt18=(n,d,tr,v)=>heroPart18(cls,n,d,L,bs,v,tr);
  for(let d=0;d<5;d++)for(const pt of ['boot','skirt','torso','head','cloak'])pt18(pt,d,col.trim);
  pt18('arm',0,col.trim);pt18('armB',0,col.trim);
  if(cls==='warrior'){pt18('sword',0,col.trim,col.gem);pt18('polearm',0,col.trim,col.gem);pt18('shield',0,col.offc,0);pt18('shield',0,col.offc,1)}
  else{for(let v=0;v<3;v++)pt18('bow',0,col.trim,v);pt18('xbow',0,col.trim,0);pt18('xprod',0,col.trim);pt18('quiver',0,col.offc)}
  return W}

/* ===== 그리기 ===== */
// 공격 동작 이름 → 손·무기 키프레임. 값은 [오른손 fw,rt,up, 무기 방향 fw,rt,up, 왼손 fw,rt,up]
const H18POSE={
  // 한손검 내려베기 (앞쪽 오른 어깨 위 → 왼쪽 아래)
  swing:[{u:0,v:[1,2,-12, .5,.2,-.6, 2,0,-13]},{u:.22,v:[-3,4,9, -.45,.35,.8, 3,-1,-8]},{u:.5,v:[10,-3,1, .95,-.3,.05, 1,1,-11]},{u:.72,v:[8,-9,-8, .45,-.75,-.45, 1,1,-12]},{u:1,v:[1,2,-12, .5,.2,-.6, 2,0,-13]}],
  // 올려베기(번갈아 쓰는 두 번째 칼)
  swing2:[{u:0,v:[1,2,-12, .5,.2,-.6, 2,0,-13]},{u:.22,v:[7,-8,-9, .4,-.7,-.55, 2,1,-12]},{u:.5,v:[10,2,0, .9,.35,.25, 2,1,-11]},{u:.74,v:[1,6,9, -.1,.5,.85, 2,0,-12]},{u:1,v:[1,2,-12, .5,.2,-.6, 2,0,-13]}],
  // 치켜들었다 내려찍기 (강타·도약 착지·대지 분쇄)
  slam:[{u:0,v:[1,2,-12, .5,.2,-.6, 2,0,-13]},{u:.35,v:[-1,1,12, -.35,.05,.94, 0,-2,10]},{u:.6,v:[11,0,-3, .9,0,-.45, 9,-3,-3]},{u:.82,v:[11,0,-5, .85,0,-.52, 9,-3,-5]},{u:1,v:[1,2,-12, .5,.2,-.6, 2,0,-13]}],
  // 방패 치기: 왼손이 앞으로
  bash:[{u:0,v:[1,2,-12, .5,.2,-.6, 2,0,-11]},{u:.3,v:[-1,3,-11, .3,.3,-.7, -2,-3,-8]},{u:.55,v:[2,3,-11, .5,.3,-.6, 13,-1,-6]},{u:.8,v:[2,3,-11, .5,.3,-.6, 12,-1,-6]},{u:1,v:[1,2,-12, .5,.2,-.6, 2,0,-11]}],
  // 외침·강화: 무기를 높이 든다
  shout:[{u:0,v:[1,2,-12, .5,.2,-.6, 2,0,-13]},{u:.25,v:[2,4,11, .15,.15,.98, 4,-5,-3]},{u:.75,v:[2,4,11, .15,.15,.98, 4,-5,-3]},{u:1,v:[1,2,-12, .5,.2,-.6, 2,0,-13]}],
  // 막기 자세 (방패를 가슴 앞에)
  guard:[{u:0,v:[1,2,-12, .5,.2,-.6, 2,0,-11]},{u:.2,v:[0,4,-10, .3,.2,-.8, 9,-1,-4]},{u:.8,v:[0,4,-10, .3,.2,-.8, 9,-1,-4]},{u:1,v:[1,2,-12, .5,.2,-.6, 2,0,-11]}],
};
// 창: [잡는 손 fw,rt,up, 자루 방향 fw,rt,up, 앞으로 미는 정도]
const H18PPOSE={
  idle:[{u:0,v:[2,1,-11, .12,.05,1, 0]}],
  thrust:[{u:0,v:[2,1,-11, .12,.05,1, 0]},{u:.25,v:[-4,2,-6, 1,-.05,.12, 0]},{u:.48,v:[10,0,-5, 1,-.05,.08, 1]},{u:.7,v:[9,0,-5, 1,-.05,.08, 1]},{u:1,v:[2,1,-11, .12,.05,1, 0]}],
  slam:[{u:0,v:[2,1,-11, .12,.05,1, 0]},{u:.35,v:[0,1,8, -.25,0,.97, 0]},{u:.6,v:[8,0,-2, .9,0,-.42, 1]},{u:.82,v:[8,0,-3, .88,0,-.46, 1]},{u:1,v:[2,1,-11, .12,.05,1, 0]}],
};
function h18rot(dx,dy){return Math.atan2(-dx,dy)}// 아래로 뻗은 팔/스프라이트(+y)를 (dx,dy) 쪽으로
function drawFigure18(g,h,x,y,k,o){
  o=o||{};const t=o.t!=null?o.t:time,frozen=(h.freezeT||0)>0,stun=(h.stunT||0)>0,cls=h.cls,pal=HERO18[cls],WR=cls==='warrior',bs=o.bs;
  const col=heroColors18(h),W=h18weap(h,o),LK=heroLook18(h);
  let at=o.atk?{k:o.atk,p:o.atkP!=null?o.atkP:.5,n:o.atkN|0}:frozen||stun?null:heroAtkS(h,t);
  const ck=at?0:o.castK!=null?o.castK:frozen?0:heroCastK(h,t);
  // 회전 공격이면 몸이 돈다
  let faceIx=null;if(at&&at.k==='spin'){const a0=Math.round(((h.face||0)+.0)/(Math.PI/4));faceIx=((Math.floor(at.p*8+t*14)%8)+8)%8}
  const [di,flip]=faceIx!=null?[[2,0],[1,0],[0,0],[1,1],[2,1],[3,1],[4,0],[3,0]][faceIx]:heroDir(h.face||0);
  const th=HERO_DIRS[di]*Math.PI/180,s=Math.sin(th),c=Math.cos(th);
  // 몸이 보는 화면 방향과 같은 월드 각도 (무기 투영용)
  const scrIx=[[2,0],[1,0],[0,0],[1,1],[2,1],[3,1],[4,0],[3,0]].findIndex(q=>q[0]===di&&q[1]===flip),f=heroFace(scrIx);
  const Pj=(fw,rt,up)=>h18prj(f,flip,fw,rt,up);
  const mv=h.moving&&!frozen&&!stun?1:0,ph=(h.walk||0)*11,tt=frozen?0:t,hk=Math.max(0,Math.min(1,(h.hurtT||0)/.25));
  g.save();g.translate(x,y);if(k&&k!==1)g.scale(k,k);
  Kit.shadow(g,2,1,24*HS,8.5*HS,1);
  g.scale(HS*(flip?-1:1),HS);
  if(hk>0){g.translate(-s*hk*5,-c*.5*hk*5);g.rotate(-s*hk*.12)}
  // 공격할 때 몸이 앞으로 살짝 쏠린다
  let lean=0;if(at&&at.k!=='spin'){const q=Math.sin(Math.min(1,at.p*1.6)*Math.PI);lean=q*(at.k==='slam'?3.2:at.k==='bash'||at.k==='thrust'?2.6:1.6)}
  const L0=Pj(lean,0,0);g.translate(L0.x*.5,L0.y*.5);
  const st=mv?Math.sin(ph):0,bob=mv?-Math.abs(Math.cos(ph))*1.8:Math.sin(tt*2.2)*.5,br=mv?0:Math.sin(tt*2.2);
  const lift=q=>mv?Math.max(0,q)*2.2:0,ops=[],P_=(z,fn)=>ops.push({z,f:fn});
  const part=(n,d,tr,v)=>heroPart18(cls,n,d,LK,bs,v,tr);
  const boot=part('boot',di,col.trim),skirt=part('skirt',di,col.trim),torso=part('torso',di,col.trim),head=part('head',di,col.trim),cloak=part('cloak',di,col.trim);
  const arm=part('arm',0,col.trim),armB=part('armB',0,col.trim);
  const fwx=s,fwy=c*.5,stance=at&&(at.k==='slam'||at.k==='thrust'||at.k==='bash')?Math.sin(Math.min(1,at.p*1.5)*Math.PI):0;
  for(const sd of [1,-1]){const q=st*sd-(sd===-1?stance*.9:0)+(sd===1?stance*.3:0),bx=-c*3.6*sd+fwx*q*5,by=fwy*q*5-lift(sd*Math.cos(ph));P_(-1.5+sd*s*.4,()=>{g.save();g.translate(bx,by);g.scale(1,BK.leg);SC.draw(g,boot,0,0);g.restore()})}
  const wy=-28+bob;
  P_(0,()=>{g.save();g.translate(0,wy);g.transform(1,0,mv?st*.08*(Math.abs(s)>.3?1:.5):Math.sin(tt*1.6)*.012,1,0,0);g.scale(1,BK.sk);SC.draw(g,skirt,0,0);g.restore()});
  P_(1,()=>{g.save();g.translate(0,wy);g.scale(1,BK.to*(1+br*.015));SC.draw(g,torso,0,0);g.restore()});
  const shy=wy-14.2*BK.to-br*.25;
  P_(6,()=>{g.save();g.translate(0,shy+1.5);g.scale(BK.hd,BK.hd);SC.draw(g,head,0,0);g.restore()});
  const sway=Math.sin(tt*1.6)*.035+(mv?s*.16+Math.sin(ph*2)*.04:0)+hk*s*.1+(at?-s*.12*Math.sin(at.p*Math.PI):0);
  if(cloak)P_(c>=0?-10:1.5,()=>{g.save();g.translate(0,shy+.5);g.rotate(sway);g.scale(1,BK.ck);SC.draw(g,cloak,0,0);g.restore()});
  // 어깨 (sd=1 오른쪽: 무기 손)
  const sh=sd=>({x:-c*7.6*sd+s*.5*sd,y:shy+1.8});
  const RS=sh(1),LS=sh(-1),walkA=sd=>mv?-st*sd*.6*s*.9:-(br*.03*sd);
  const armAt=(S,hx,hy,sd)=>{const dx=hx-S.x,dy=hy-S.y,l=Math.hypot(dx,dy)||1;return{r:h18rot(dx,dy),ky:Math.max(.55,Math.min(1.15,l/15)),hx,hy,sd}};
  const armRest=(S,sd,r)=>{const rr=r+walkA(sd);return{r:rr,ky:BK.arm,hx:S.x-Math.sin(rr)*15*BK.arm,hy:S.y+Math.cos(rr)*15*BK.arm,sd}};
  const hand=(S,v)=>{const q=Pj(v[0],v[1],v[2]);return{x:S.x+q.x,y:S.y+q.y,d:q.d}};
  const drawArm=(a,z)=>P_(z,()=>{g.save();g.translate(a.S.x,a.S.y);g.rotate(a.r);g.scale(1,a.ky);SC.draw(g,a.img,0,0);g.restore()});
  const armZ=sd=>2+sd*s*3,img=sd=>sd*s>=0||Math.abs(s)<.3?arm:armB;
  // 무기를 축 방향으로 세워 그린다: spr의 -y가 dir(3차원 단위 벡터)를 향하고, 화면 길이만큼 줄어든다
  const axisDraw=(spr,hx,hy,dir,z,kx)=>{const q=Pj(dir[0],dir[1],dir[2]),l=Math.hypot(q.x,q.y)||1,r=Math.atan2(q.x,-q.y),ky=Math.max(.38,Math.min(1.08,l));
    P_(z,()=>{g.save();g.translate(hx,hy);g.rotate(r);g.scale(kx||1,ky);SC.draw(g,spr,0,0);g.restore()});return{x:hx+q.x*30,y:hy+q.y*30,d:q.d}};
  // 평면 그림: spr의 x축→A, y축→B (몸 기준 3차원)
  const planeDraw=(spr,hx,hy,A,B,z,sc0)=>{const a=Pj(A[0],A[1],A[2]),b=Pj(B[0],B[1],B[2]),m=sc0||1;
    P_(z,()=>{g.save();g.translate(hx,hy);g.transform(a.x*m,a.y*m,b.x*m,b.y*m,0,0);SC.draw(g,spr,0,0);g.restore()})};
  let tipG=null;// 무기 끝(빛)
  const frontZ=d=>d>0?7.5:-3;
  if(WR&&W.wt==='sword'){
    let v=null;
    if(at&&H18POSE[at.k==='swing'&&at.n%2?'swing2':at.k])v=h18kf(H18POSE[at.k==='swing'&&at.n%2?'swing2':at.k],at.p);
    else if(at&&at.k==='spin')v=[9,1,-2, .2,.98,0, 2,-4,-9];
    else if(ck>0)v=h18kf(H18POSE.shout,.25+ck*.5);
    let R,Lh;
    if(v){const hR=hand(RS,v),hL=hand(LS,v.slice(6));R=armAt(RS,hR.x,hR.y,1);R.d=hR.d;Lh=armAt(LS,hL.x,hL.y,-1);Lh.d=hL.d}
    else{R=armRest(RS,1,.32*c+.05);Lh=armRest(LS,-1,-.18*c-.1)}
    R.S=RS;R.img=img(1);Lh.S=LS;Lh.img=img(-1);
    const rz=v?Math.max(armZ(1),R.d>3?6:armZ(1)):armZ(1);drawArm(R,rz);drawArm(Lh,armZ(-1));
    const sw=part('sword',0,col.trim,col.gem),bd=v?[v[3],v[4],v[5]]:[.55+(mv?st*.12:0),.25,-.75];
    const tip=axisDraw(sw,R.hx,R.hy,bd,rz-.05+(v&&bd[0]>.3?.6:0));tipG=tip;
    if(W.off==='shield'){const bash=at&&at.k==='bash'?Math.sin(Math.min(1,at.p*1.8)*Math.PI):0,gd=at&&at.k==='guard'?1:0;
      const N=[Math.cos(.55-bash*.45-gd*.5),-Math.sin(.55-bash*.45-gd*.5),0],A=[-N[1],N[0],0],nq=Pj(N[0],N[1],0),back=nq.d<-.15;
      const spr=part('shield',0,col.offc,back?1:0),sx=Lh.hx+Pj(2.5,-1,0).x,sy=Lh.hy-3+Pj(2.5,-1,0).y;
      planeDraw(spr,sx,sy,back?[-A[0],-A[1],0]:A,[0,0,-1],nq.d>0?6.5+bash:Math.min(armZ(-1)-.1,-1.5),1+bash*.12)}}
  else if(WR){// 창: 두 손으로
    let v;if(at&&H18PPOSE[at.k])v=h18kf(H18PPOSE[at.k],at.p);
    else if(at&&(at.k==='swing'||at.k==='sweep')){const a=(-1.5+at.p*3)*(at.n%2?-1:1),e=h18ease(Math.min(1,at.p*1.4));v=[2+e*7,1+Math.sin(a)*3,-5, Math.cos(a)*.98,Math.sin(a)*.98,.05, e]}
    else if(at&&at.k==='spin')v=[7,0,-4, .1,1,.05, 1];
    else if(at&&(at.k==='shout'||at.k==='guard'||at.k==='bash'))v=[3,2,4, .08,.08,1, 0];
    else if(ck>0)v=h18kf(H18PPOSE.slam,.35*ck);
    else v=[2+(mv?st*1.2:0),1,-11, .12,.05,1, 0];
    const hR=hand(RS,v),dir=[v[3],v[4],v[5]],q=Pj(dir[0],dir[1],dir[2]),both=v[6]>.2||ck>0;
    const R=armAt(RS,hR.x,hR.y,1);R.S=RS;R.img=img(1);
    let Lh;if(both){const lx=hR.x+q.x*9,ly=hR.y+q.y*9;Lh=armAt(LS,lx,ly,-1)}else Lh=armRest(LS,-1,-.18*c-.1);Lh.S=LS;Lh.img=img(-1);
    const pz=q.d>.2?7:Math.abs(s)>.5?armZ(1)-.05:c>0?3.5:-4;
    drawArm(R,armZ(1));drawArm(Lh,both?Math.max(armZ(-1),pz+.1):armZ(-1));
    tipG=axisDraw(part('polearm',0,col.trim,col.gem),hR.x,hR.y,dir,pz);
    const tq=Pj(dir[0],dir[1],dir[2]);tipG={x:hR.x+tq.x*52,y:hR.y+tq.y*52}}
  else{// 궁수: 왼손 활 · 오른손 줄
    const rel=at&&at.k==='release',dr=at&&at.k==='draw';
    let draw=ck>0?ck:dr?h18ease(at.p*1.4):rel?Math.max(0,1-at.p*5):0;// 0~1
    const aimUp=at&&at.k==='volley'?.75:0,lift=Math.max(draw,rel?1-at.p*.6:0,aimUp?1:0);
    if(at&&at.k==='volley')draw=Math.max(draw,at.p<.45?h18ease(at.p/.45):Math.max(0,1-(at.p-.45)*6));
    const aim=[Math.cos(aimUp*.9),0,Math.sin(aimUp*.9)];
    const bowH=lift>0?[aim[0]*12,-1,-4+aim[2]*12]:[4+(mv?st*1.2:0),-2,-11];
    const hL=hand(LS,bowH),L=armAt(LS,hL.x,hL.y,-1);L.S=LS;L.img=img(-1);
    const sp=W.wt==='xbow';
    if(!sp){const pull=draw*10.5,rH=lift>0?[aim[0]*(12-pull)-1,0,-4+aim[2]*(12-pull)+1.5]:[1,2,-12];const hR=hand(RS,rH),R=armAt(RS,hR.x,hR.y,1);R.S=RS;R.img=img(1);
      const bz=Pj(aim[0],0,0).d>.2&&lift>0?7:Math.abs(s)>.5?armZ(-1)+.05:c>0?4:-4;
      drawArm(L,lift>0?bz-.1:armZ(-1));drawArm(R,lift>0?Math.max(armZ(1),bz+.1):armZ(1));
      const cant=.28,UP=[-aim[2]*Math.cos(cant),Math.sin(cant),aim[0]*Math.cos(cant)];
      const bw=part('bow',0,col.trim,draw>.66?2:draw>.2?1:0);
      if(lift>0)planeDraw(bw,hL.x,hL.y,aim,[-UP[0],-UP[1],-UP[2]],bz);
      else{// 내린 활: 손에 쥐고 아래로
        planeDraw(bw,hL.x,hL.y,[.95,-.1,.3],[.3,0,-.95],armZ(-1)-.05)}
      const a2=Pj(aim[0],0,aim[2]);tipG={x:hL.x+a2.x*16,y:hL.y+a2.y*16}}
    else{const rH=lift>0?[aim[0]*4,1,-6+aim[2]*4]:[2,2,-11];const hR=hand(RS,rH),R=armAt(RS,hR.x,hR.y,1);R.S=RS;R.img=img(1);
      const hL2=lift>0?hand(LS,[aim[0]*12,1,-5+aim[2]*12]):hL,L2=armAt(LS,hL2.x,hL2.y,-1);L2.S=LS;L2.img=img(-1);
      const a2=Pj(aim[0],0,aim[2]),bz=a2.d>.2?7:Math.abs(s)>.5?armZ(1)+.1:c>0?4:-4;
      drawArm(R,lift>0?Math.max(armZ(1),bz+.1):armZ(1));drawArm(L2,lift>0?Math.max(armZ(-1),bz+.15):armZ(-1));
      if(lift>0){const xs=part('xbow',0,col.trim,0);planeDraw(xs,hR.x,hR.y,aim,[0,0,-1],bz);
        const pr=part('xprod',0,col.trim),pp=Pj(aim[0]*10,0,aim[2]*10);planeDraw(pr,hR.x+pp.x,hR.y+pp.y,[0,1,0],[-aim[0],0,-aim[2]],bz+(a2.d>0?.05:-.05));tipG={x:hR.x+a2.x*16,y:hR.y+a2.y*16}}
      else{const xs=part('xbow',0,col.trim,0);planeDraw(xs,hR.x,hR.y,[.35,0,-.9],[0,1,0],armZ(1)-.05);tipG={x:hR.x,y:hR.y+8}}}
    // 화살통: 오른 어깨 뒤
    const qp=Pj(-4.5,2.5,0),qd=Pj(.1,.35,1),qr=Math.atan2(qd.x,-qd.y);
    P_(qp.d<0?-9:1.7,()=>{g.save();g.translate(RS.x*.5+qp.x,shy+9+qp.y);g.rotate(qr);SC.draw(g,part('quiver',0,col.offc),0,0);g.restore()})}
  ops.sort((a,b)=>a.z-b.z);for(const op of ops)op.f();
  // 빛: 무기 등급 · 시전 · 갑옷 등급 (가산)
  const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';
  const el=o.el||(HANIM.get(h)||{}).el,gc=ck>0&&el&&EL[el]?EL[el]:col.gem;
  if(tipG){const pulse=.85+Math.sin(t*3)*.15;if(col.staffR>=2||ck>0)heroGlow(g,tipG.x,tipG.y,(5+ck*12+(col.staffR>=4?4:0))*pulse,gc,.75);
    if(col.staffR>=4){const n=col.staffR>=5?3:2;for(let i=0;i<n;i++){const a=t*2.6+i*6.283/n;heroGlow(g,tipG.x+Math.cos(a)*6,tipG.y+Math.sin(a)*2.6,col.staffR>=5?4.5:3.5,col.gem,.85)}}}
  if(col.robeR>=4){const n=col.robeR>=5?3:2;for(let i=0;i<n;i++){const u=Math.sin(t*1.1+i*2.1);heroGlow(g,u*11,wy+17+(1-u*u)*2,col.robeR>=5?6:4.5,col.trim,.7+Math.sin(t*4+i)*.3)}}
  if(hk>0)heroGlow(g,0,-30,34,'rgba(255,70,50,.9)',hk*.75);
  g.globalCompositeOperation=po;
  if(frozen)SC.draw(g,heroPart('mage','ice',0,'',bs),0,0);
  if(stun){for(let i=0;i<3;i++){const a=t*4+i*2.094;SC.draw(g,heroPart('mage','star',0,'',bs),Math.cos(a)*10,shy-20+Math.sin(a)*3)}}
  g.restore();
  const gx=tipG?tipG.x:0,gy=tipG?tipG.y:-40;
  return{gx:x+(flip?-gx:gx)*HS*(k||1),gy:y+gy*HS*(k||1)}}
// 미리보기·견본용: 가짜 인물 하나를 원하는 동작으로 그린다
// pose: 'idle'|'walk'|'cast'|'swing'|'swing2'|'thrust'|'sweep'|'slam'|'bash'|'spin'|'shout'|'guard'|'draw'|'release'|'volley' · dirIx: 화면 8방향(0=동 … 2=남)
function drawHeroClass(g,cls,gear,pose,x,y,k,t,dirIx,o){o=Object.assign({},o||{});pose=pose||'idle';
  const h={cls,gear:gear||{},face:heroFace(dirIx==null?2:dirIx),moving:pose==='walk',walk:t||0};
  if(pose==='cast')o.castK=1;else if(pose!=='idle'&&pose!=='walk'){o.atk=pose==='swing2'?'swing':pose;o.atkN=pose==='swing2'?1:0;if(o.atkP==null)o.atkP=pose==='draw'?.6:pose==='release'?.12:.5}
  return drawFigure18(g,h,x,y,k||1,Object.assign({t:t||0},o))}
// 견본표: 무기 갈래 × 동작 × 8방향 + 동작 프레임 띠 + 장비 등급 (갤러리·점검용, 매 프레임 쓰지 않는다)
function heroSheet18(cls,k){k=k||2;const W=cls==='warrior',CW=78,RH=92,LW=96,ORD=[2,1,0,7,6,5,4,3],DN=['동','남동','남','남서','서','북서','북','북동'];
  const V=W?[{n:'한손검+방패',g:{staff:{rar:2,wt:'sword'},off:{rar:2,wt:'shield'}},P:['idle','walk','swing','swing2','slam','bash','guard','spin','cast']},
             {n:'창·폴암',g:{staff:{rar:2,wt:'polearm'}},P:['idle','walk','thrust','sweep','slam','spin','cast']}]
          :[{n:'활',g:{staff:{rar:2,wt:'bow'},off:{rar:2,wt:'quiver'}},P:['idle','walk','draw','release','volley','cast']},
            {n:'석궁',g:{staff:{rar:2,wt:'xbow'},off:{rar:2,wt:'quiver'}},P:['idle','walk','draw','release','volley','cast']}];
  const PN={idle:'가만히',walk:'걷기',swing:'내려베기',swing2:'올려베기',slam:'내려찍기',bash:'방패 치기',guard:'막기',spin:'회전',cast:'시전 유지',thrust:'찌르기',sweep:'휩쓸기',draw:'당기기',release:'놓기',volley:'하늘로'};
  const rows=V.reduce((n,v)=>n+v.P.length+2,0)+1,cw=LW+CW*8+CW*1.3,ch=30+RH*rows;
  const cv=document.createElement('canvas');cv.width=cw*k;cv.height=ch*k;const g=cv.getContext('2d');g.setTransform(k,0,0,k,0,0);
  g.fillStyle='#211e1a';g.fillRect(0,0,cw,ch);g.font='600 12px sans-serif';g.fillStyle='#e8e2d2';g.textAlign='center';for(let j=0;j<8;j++)g.fillText(DN[ORD[j]],LW+CW*j+CW/2,20);g.fillText('등급',LW+CW*8+CW*.65,20);
  const bs=k*HS*1.05;let row=0;
  const lab=(t,y,c)=>{g.textAlign='left';g.fillStyle=c||'rgba(232,226,210,.8)';g.fillText(t,8,y)};
  for(const v of V){const y0=30+RH*row;g.fillStyle='#2c2822';g.fillRect(0,y0,cw,RH*(v.P.length+2));lab(v.n,y0+16,'#ffd76a');
    v.P.forEach((pz,r)=>{const yb=y0+RH*r+RH-14;lab(PN[pz]||pz,yb-RH/2+8);
      for(let j=0;j<8;j++)drawHeroClass(g,cls,v.g,pz,LW+CW*j+CW/2,yb,1.05,pz==='walk'?.35+j*.07:1.3,ORD[j],{bs})});
    // 프레임 띠 (남동쪽): 첫 공격 동작
    const pz=v.P[2],yb=y0+RH*v.P.length+RH-14;lab(PN[pz]+' 0→1',yb-RH/2+8);
    for(let j=0;j<8;j++)drawHeroClass(g,cls,v.g,pz,LW+CW*j+CW/2,yb,1.05,1.3,1,{bs,atkP:j/8+.02});
    const pz2=v.P[3],yb2=yb+RH;lab(PN[pz2]+' 0→1',yb2-RH/2+8);
    for(let j=0;j<8;j++)drawHeroClass(g,cls,v.g,pz2,LW+CW*j+CW/2,yb2,1.05,1.3,6,{bs,atkP:j/8+.02});
    for(let r=0;r<6;r++){const gr={robe:{rar:r},staff:{rar:r,wt:v.g.staff.wt}};if(v.g.off)gr.off={rar:r,wt:v.g.off.wt};const yy=y0+RH*Math.min(r,v.P.length+1)+RH-14;
      if(r<v.P.length+2){drawHeroClass(g,cls,gr,'idle',LW+CW*8+CW*.65,yy,1.05,1.3+r,2,{bs});g.fillStyle=RAR[r].c;g.textAlign='center';g.fillText(RAR[r].n,LW+CW*8+CW*.65,yy+11)}}
    row+=v.P.length+2}
  return cv}
window.__h18={drawHeroClass,heroSheet18:(c,k)=>heroSheet18(c,k).toDataURL('image/png'),HERO18};
