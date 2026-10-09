/* ---------- 주인공 그림: 부위별 인형 (5방향 굽기 + 3방향 좌우 반전) ---------- */
// 단위 좌표: 발밑이 (0,0), 위가 음수. 화면에는 HS배로 그린다.
const HS=.92,PK=1.07; // PK: 플레이어 캐릭터 크기(NPC 대비, 몸비율 변화 포함 약 1.1배)
// 몸 비율: 다리·치마·몸통·팔·망토는 늘이고 머리는 줄여 3등신 → 약 4등신
const BK={leg:1.3,sk:1.08,to:1.1,arm:1.12,ck:1.1,hd:.86};
const HERO_PAL={
  mage:{robe:'#2b3080',robeD:'#1c1f58',cloak:'#2a1c4e',lining:'#5a2a6e',hat:'#252a70',skin:'#e9c29c',hair:'#4a2e1e',boot:'#3a2a1e',wood:'#5e3f22',gold:'#d4aa4c',gem:'#b9a2ff'},
  priest:{robe:'#ece3cc',robeD:'#cfc4a8',cloak:'#7e2a2c',lining:'#c9a85a',hat:'#e6dcc2',skin:'#ecc8a4',hair:'#7a5a3a',boot:'#5a4630',wood:'#d9c9a0',gold:'#e0b850',gem:'#ffe39a'}};
// ---------- 장비 → 겉모습 (그림 전용: 저장·수치와 무관) ----------
// 로브: 아이템 레벨 단계(0~7)마다 무늬·어깨 망토·모자가 달라지고, 마법 이상 등급은 이름으로 정해지는 색으로 물든다. 세트는 세트 색.
// 지팡이: 아이템 레벨 단계마다 머리 모양과 재질이 다르다. 목걸이는 가슴에, 반지는 손에 보인다.
const LOOK_DYE={ // [로브, 모자, 망토, 안감]
  mage:[['#2b3080','#252a70','#2a1c4e','#5a2a6e'],['#4a2470','#3e1e60','#24123a','#8a4ab0'],['#6a1e2a','#5a1822','#2a0e14','#c8503a'],['#1e4a5a','#1a3e4c','#102630','#4ab0b8'],['#2a2a34','#22222a','#121216','#7a6ab8'],['#22503a','#1c4430','#10261c','#8ac070']],
  priest:[['#ece3cc','#e6dcc2','#7e2a2c','#c9a85a'],['#e6eaf0','#dfe4ec','#2a3e6a','#b8c8e8'],['#efe0bc','#e8d6ae','#5a2a5a','#e0b860'],['#ded8ea','#d6cfe4','#3a2a5a','#c0a8e8'],['#f2ece0','#ebe2d0','#2e5a3a','#a8d0a0']]};
const LOOK_SET={valker:['#6e2418','#5a1c14','#2e120e','#e0703a'],frostspire:['#2e5a7a','#284e6a','#16283c','#9fdcf4'],stormcaller:['#22305e','#1c2850','#121628','#f0d050'],seeker:['#1e5050','#1a4444','#2a2418','#d0a050'],aurel:['#f4eedc','#f0e6cc','#8a6a1a','#ffe39a']};
const LOOK_UNIQ=[['#3a1030','#30102a','#140810','#e04a8a'],['#101a30','#0e1628','#06080e','#5ab0ff'],['#3a2a10','#30220c','#140e04','#ffb43a'],['#0e2a1e','#0c2418','#040e08','#5affb0']];
function lookHash(it){if(!it)return 0;if(it.h!=null)return it.h>>>0;let h=7;const n=it.name||'';for(let i=0;i<n.length;i++)h=Math.imul(h,31)+n.charCodeAt(i)|0;return h>>>0}
const lookTier=it=>it&&it.il?clamp(Math.floor(it.il/8),0,7):0;
function heroLook(h){const cls=h.cls in HERO_PAL?h.cls:'mage',p=HERO_PAL[cls],gr=h.gear||{},rb=gr.robe,st=gr.staff,am=gr.amulet,rg=gr.ring;
  let dye=null;if(rb&&rb.il){if(rb.set&&LOOK_SET[rb.set])dye=LOOK_SET[rb.set];else if(rb.rar>=4)dye=LOOK_UNIQ[lookHash(rb)%LOOK_UNIQ.length];else if(rb.rar>=1){const D=LOOK_DYE[cls];dye=D[lookHash(rb)%D.length]}}
  const pal=dye?Object.assign({},p,{robe:dye[0],robeD:Kit.lit(dye[0],-.18),hat:dye[1],cloak:dye[2],lining:dye[3]}):p;
  const L={cls,pal,trim:rb?RAR[rb.rar].c:p.gold,gem:st?RAR[st.rar].c:p.gem,rt:lookTier(rb),wt:lookTier(st),rr:rb?rb.rar:-1,wr:st?st.rar:-1,
    amu:am?{t:lookTier(am),c:RAR[am.rar].c}:null,ring:rg?RAR[rg.rar].c:null};
  L.wk=st&&st.wt||(cls==='warrior'?'sword':cls==='archer'?'bow':'staff');
  const of=gr.off;L.off=of?{wt:of.wt||(cls==='archer'?'quiver':'shield'),t:lookTier(of),c:RAR[of.rar].c}:null;
  L.key=[pal.robe,pal.cloak,pal.lining,L.trim,L.rt,L.wt,L.amu?L.amu.t+L.amu.c:'',L.ring||'',L.wk,L.off?L.off.wt+L.off.t+L.off.c:''].join(',');return L}
const HERO_DIRS=[0,45,90,135,180];// 화면 기준: 0=카메라 쪽(아래), 90=오른쪽, 180=뒤(위)
// 화면 방향 8칸: face(월드 각도) → 화면 각도 → 45° 반올림. 결과: 굽는 방향 번호와 좌우 반전 여부
function heroDir(face){const c=Math.cos(face),s=Math.sin(face),a=Math.atan2((c+s)*.5,c-s);
  const i=((Math.round(a/(Math.PI/4))%8)+8)%8;// 0=E 1=SE 2=S 3=SW 4=W 5=NW 6=N 7=NE
  return [[2,0],[1,0],[0,0],[1,1],[2,1],[3,1],[4,0],[3,0]][i]}
const HANIM=new WeakMap();// 그리기 전용 상태 (저장되지 않음)
function heroCast(h,el){let a=HANIM.get(h);if(!a)HANIM.set(h,a={});a.castT=time;a.el=el}
function heroCastK(h,t){const a=HANIM.get(h);if(!a||a.castT==null)return 0;const d=t-a.castT;return d<0?0:d<.08?d/.08:d<.3?1:Math.max(0,1-(d-.3)/.25)}

// 부위 굽기
function heroPart(cls,part,di,trim,bs){
  const L=trim&&typeof trim==='object'?trim:null,HD=L&&part==='head'&&L.hrt!=null;if(L)trim=HD?L.htc:L.trim;// v21: 모자를 쓰면 머리는 모자 단계·색으로
  const th=HERO_DIRS[di]*Math.PI/180,s=Math.sin(th),c=Math.cos(th),p=L?(HD&&L.hpal||L.pal):HERO_PAL[cls],pr=cls==='priest',RT=L?(HD?L.hrt:L.rt):0,WT=L?L.wt:0;
  const sc=bs||Math.max(1,DPR)*HS,key=`hero/${cls}/${part}/${di}/${L?L.key:trim}/${sc.toFixed(2)}`;
  const o={force:1,scale:sc};
  const rimC='rgba(255,240,214,.85)',T=trim;
  switch(part){
  case'boot':return SC.get(key,20,16,10,14,g=>{g.translate(10,14);
    const leg=q=>{q.moveTo(-2.6,-12);q.lineTo(2.6,-12);q.lineTo(2.8,-4);q.lineTo(-2.8,-4);q.closePath()};
    Kit.solid(g,leg,-3,-12,3,-4,pr?'#6a5a48':'#26244a',{lineW:.7});
    const ft=q=>{q.ellipse(s*2.2,-2.4,3.4+Math.abs(s)*2.2,2.6,0,0,6.283)};
    Kit.solid(g,ft,-5,-5,5,0,p.boot,{tex:'leather',texA:.4,lineW:.7});
    Kit.solid(g,q=>q.rect(-3,-7.5,6,3.5),-3,-7.5,3,-4,p.boot,{lineW:.6})},o);
  case'skirt':return SC.get(key,36,28,18,2,g=>{g.translate(18,2);
    const sk=q=>{q.moveTo(-7.6,0);q.lineTo(7.6,0);q.bezierCurveTo(10,7,12.6,14,13.4,20);q.bezierCurveTo(8,23.6,-8,23.6,-13.4,20);q.bezierCurveTo(-12.6,14,-10,7,-7.6,0);q.closePath()};
    Kit.solid(g,sk,-13,0,13,23,p.robe,{tex:'cloth',texA:.5,rim:rimC});
    g.save();g.beginPath();sk(g);g.clip();
    // 주름
    g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(p.robe,-.5)),.35);g.lineWidth=1.1;
    for(const fx of [-6.5,-2,3,7.5]){g.beginPath();g.moveTo(fx*.6,2);g.quadraticCurveTo(fx*.9,12,fx*1.25,22);g.stroke()}
    g.strokeStyle='rgba(255,246,224,.12)';for(const fx of [-4.5,1,5.5]){g.beginPath();g.moveTo(fx*.6,3);g.quadraticCurveTo(fx*.9,12,fx*1.25,21);g.stroke()}
    // 앞섶 금실 띠 (앞을 볼 때만)
    if(c>-.3){const x=s*6.5,w=(pr?4.2:3)*Math.max(.35,c*.7+.3);
      Kit.solid(g,q=>{q.moveTo(x*.55-w/2,0);q.lineTo(x*.55+w/2,0);q.lineTo(x*1.1+w*.6,24);q.lineTo(x*1.1-w*.6,24);q.closePath()},x-w,0,x+w,24,T,{rim:'rgba(255,255,255,.7)',lineW:.6});
      g.fillStyle=Kit.lit(T,-.45);for(let y=4;y<22;y+=4.5){const xx=x*.55+(x*.55)*(y/24);g.beginPath();g.moveTo(xx,y-1.4);g.lineTo(xx+1.2,y);g.lineTo(xx,y+1.4);g.lineTo(xx-1.2,y);g.closePath();g.fill()}}
    else{g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(p.robe,-.6)),.4);g.lineWidth=1;g.beginPath();g.moveTo(-s*2,0);g.lineTo(-s*3,23);g.stroke()}
    // 로브 단계 무늬: 1 누빔 · 2 비단 광택 · 3 룬 · 5 별무늬 · 7 빛나는 문양
    if(RT>=1){g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(p.robe,-.45)),.3);g.lineWidth=.6;g.setLineDash([1.6,1.4]);for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*5-6,1);g.lineTo(i*5+8,22);g.moveTo(i*5+6,1);g.lineTo(i*5-8,22);g.stroke()}g.setLineDash([])}
    if(RT>=2){const sh=g.createLinearGradient(-13,0,13,0);sh.addColorStop(0,'rgba(255,255,255,0)');sh.addColorStop(.3-s*.15,'rgba(255,250,235,.22)');sh.addColorStop(.5-s*.15,'rgba(255,255,255,0)');g.fillStyle=sh;g.fillRect(-14,0,28,24)}
    if(RT>=3){g.fillStyle=Kit.rgb(Kit.hex(T),RT>=7?.95:.65);for(let i=-4;i<=4;i++){const x=i*2.8,y=17.6+(1-Math.abs(i)/4.5)*1.6,k=(i+9)%3;g.save();g.translate(x,y);
        if(k===0){g.fillRect(-.4,-1.6,.8,2.6);g.fillRect(-1.1,-.6,2.2,.6)}else if(k===1){g.beginPath();g.moveTo(-1,.9);g.lineTo(0,-1.6);g.lineTo(1,.9);g.closePath();g.fill()}else{g.beginPath();g.arc(0,-.3,1,0,6.283);g.fill()}g.restore()}}
    if(RT>=5){g.fillStyle=Kit.rgb(Kit.hex(Kit.lit(T,.4)),.55);const sr=mulberry(RT*31+7);for(let i=0;i<9;i++){const x=(sr()-.5)*20,y=3+sr()*12,r=.5+sr()*.6;g.beginPath();for(let k=0;k<8;k++){const a=k*Math.PI/4,rr=k%2?r*.4:r*1.6;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath();g.fill()}}
    // 밑단 금실
    g.strokeStyle=T;g.lineWidth=RT>=4?3:2.2;g.beginPath();g.moveTo(-13.4,20);g.bezierCurveTo(-8,23.6,8,23.6,13.4,20);g.stroke();
    g.strokeStyle=Kit.lit(T,.4);g.lineWidth=.7;g.beginPath();g.moveTo(-13,19.2);g.bezierCurveTo(-8,22.6,8,22.6,13,19.2);g.stroke();
    g.fillStyle=Kit.lit(T,-.35);for(let i=-5;i<=5;i++){const x=i*2.3;g.beginPath();g.arc(x,21.2+(1-Math.abs(i)/5.5)*2-.4,.55,0,6.283);g.fill()}
    g.restore();Kit.outline(g,sk,Kit.rgb(Kit.hex(Kit.lit(p.robe,-.75)),.8),.9);
    // 허리에 매단 것: 1단계~ 가죽 주머니, 3단계~ 마법사 책 / 사제 묵주, 6단계~ 책에 빛나는 룬
    if(Math.abs(c)>.3){const x1=c*8.6,x2=-c*8.4;
      if(RT>=1){Kit.solid(g,q=>{q.moveTo(x1-2.4,1);q.lineTo(x1+2.4,1);q.quadraticCurveTo(x1+3,6.4,x1,7.2);q.quadraticCurveTo(x1-3,6.4,x1-2.4,1);q.closePath()},x1-3,1,x1+3,7.2,'#6a4426',{tex:'leather',texA:.5,rim:'rgba(255,230,190,.5)',lineW:.5});
        g.fillStyle=Kit.lit('#6a4426',-.3);g.fillRect(x1-2.4,1,4.8,1.6);g.fillStyle=T;g.beginPath();g.arc(x1,3.2,.7,0,6.283);g.fill()}
      if(RT>=3){if(!pr){g.strokeStyle='rgba(220,200,150,.8)';g.lineWidth=.5;g.beginPath();g.moveTo(x2,0);g.lineTo(x2,3);g.stroke();
          const bw=RT>=6?4.4:3.6,bh=RT>=6?5.6:4.6;Kit.solid(g,q=>q.rect(x2-bw/2,3,bw,bh),x2-bw/2,3,x2+bw/2,3+bh,RT>=6?'#3a1a4a':'#5a2a1a',{tex:'leather',texA:.4,rim:'rgba(255,240,214,.6)',lineW:.5});
          g.fillStyle=T;for(const [u,v] of [[0,0],[1,0],[0,1],[1,1]])g.fillRect(x2-bw/2+u*(bw-1),3+v*(bh-1),1,1);
          if(RT>=6){g.fillStyle=Kit.lit(T,.5);g.beginPath();g.arc(x2,3+bh/2,1,0,6.283);g.fill()}}
        else{g.fillStyle='#4a3020';for(let i=0;i<9;i++){const a=i/8*Math.PI;g.beginPath();g.arc(x2+Math.cos(a)*2.2-0,1+Math.sin(a)*6,.6,0,6.283);g.fill()}
          g.fillStyle=T;g.fillRect(x2-.4,7,.8,3.6);g.fillRect(x2-1.4,8,2.8,.8)}}}},o);
  case'torso':return SC.get(key,30,22,15,19,g=>{g.translate(15,19);const wf=.78+.22*Math.abs(c);g.scale(wf,1);
    const to=q=>{q.moveTo(-7.4,1);q.lineTo(7.4,1);q.lineTo(9,-10);q.quadraticCurveTo(9.6,-14,5,-15);q.lineTo(-5,-15);q.quadraticCurveTo(-9.6,-14,-9,-10);q.closePath()};
    Kit.solid(g,to,-9,-15,9,1,p.robe,{tex:'cloth',texA:.45,rim:rimC});
    g.save();g.beginPath();to(g);g.clip();
    if(pr){// 금색 영대 (어깨에서 앞으로)
      if(c>-.3){for(const sd of [-1,1]){const x=s*5+sd*3.2*Math.max(.4,c);g.fillStyle=T;g.beginPath();g.moveTo(x-1.6,-15);g.lineTo(x+1.6,-15);g.lineTo(x+1.4,1);g.lineTo(x-1.4,1);g.fill();
        g.fillStyle=Kit.lit(T,-.4);g.fillRect(x-.4,-11,.8,3.2);g.fillRect(x-1.2,-10,2.4,.8)}}
      else{g.fillStyle=T;g.fillRect(-9,-15,18,2.2)}}
    else if(c>-.3){// 브이넥 금실 깃
      const x=s*4;g.strokeStyle=T;g.lineWidth=1.6;g.beginPath();g.moveTo(x-4.5*Math.max(.4,c),-15);g.lineTo(x,-7);g.lineTo(x+4.5*Math.max(.4,c),-15);g.stroke()}
    // 4단계부터 앞판(마법사) · 6단계부터 높은 깃
    if(!pr&&RT>=4&&c>-.3){const x=s*4,w=4.4*Math.max(.45,c);Kit.solid(g,q=>{q.moveTo(x-w,-14);q.lineTo(x+w,-14);q.lineTo(x+w*.8,1);q.lineTo(x-w*.8,1);q.closePath()},x-w,-14,x+w,1,Kit.lit(p.robe,-.25),{rim:Kit.rgb(Kit.hex(T),.8),lineW:.6});
      g.strokeStyle=T;g.lineWidth=.9;g.beginPath();g.arc(x,-8,1.8,0,6.283);g.stroke()}
    // 허리띠
    g.fillStyle=pr?'#8a6a3a':'#3a2414';g.fillRect(-9,-2.4,18,3.2);g.fillStyle='rgba(255,230,180,.25)';g.fillRect(-9,-2.4,18,.8);
    if(c>-.3){const x=s*6;Kit.solid(g,q=>q.rect(x-2,-3,4,4),x-2,-3,x+2,1,T,{rim:'rgba(255,255,255,.9)',lineW:.5})}
    g.restore();Kit.outline(g,to,Kit.rgb(Kit.hex(Kit.lit(p.robe,-.75)),.8),.9);
    if(RT>=6){for(const sd of [-1,1]){const x=sd*6.4+s*1.5;Kit.solid(g,q=>{q.moveTo(x,-14.5);q.quadraticCurveTo(x+sd*2.6,-18.5,x+sd*4.2,-21);q.lineTo(x-sd*.6,-15.2);q.closePath()},x-5,-21,x+5,-14,Kit.lit(p.robe,-.15),{rim:Kit.rgb(Kit.hex(T),.9),lineW:.6})}}
    // 목걸이: 가슴에 보인다 (단계마다 모양)
    if(L&&L.amu&&c>-.3){const A=L.amu,x=s*4,y=-8.6;g.strokeStyle='rgba(230,200,120,.85)';g.lineWidth=.6;g.beginPath();g.moveTo(x-4.2*Math.max(.4,c),-15);g.quadraticCurveTo(x-1,y-1,x,y);g.quadraticCurveTo(x+1,y-1,x+4.2*Math.max(.4,c),-15);g.stroke();
      const base=['#d8ccb0','#c8ccd4','#d89a3a','#6a5a8a','#e0c060','#c8d8ff','#c84a3a','#fff0c0'][A.t];
      if(A.t===0){g.fillStyle=base;g.beginPath();g.moveTo(x-1,y);g.lineTo(x,y+3.4);g.lineTo(x+1,y);g.closePath();g.fill()}
      else{const rr=1.6+A.t*.16;Kit.solid(g,q=>q.arc(x,y+rr,rr,0,6.283),x-rr,y,x+rr,y+rr*2,base,{rim:'rgba(255,255,255,.9)',lineW:.5});
        g.fillStyle=A.c;g.beginPath();g.arc(x,y+rr,rr*.55,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.fillRect(x-rr*.35,y+rr*.6,.7,.7);
        if(A.t>=5){g.strokeStyle=Kit.rgb(Kit.hex(A.c),.8);g.lineWidth=.5;for(let k=0;k<6;k++){const a=k*Math.PI/3;g.beginPath();g.moveTo(x+Math.cos(a)*rr*1.2,y+rr+Math.sin(a)*rr*1.2);g.lineTo(x+Math.cos(a)*rr*1.8,y+rr+Math.sin(a)*rr*1.8);g.stroke()}}}}},o);
  case'pauld':return SC.get(key,40,22,20,8,g=>{g.translate(20,8);const wf=.74+.26*Math.abs(c);g.scale(wf,1);
    // 어깨 망토(3단계~): 짧은 케이프, 6단계부터 두 겹 + 금장식
    const layer=(w,h,y,col)=>{const sh=q=>{q.moveTo(-w,y+h*.55);q.quadraticCurveTo(-w-1,y-h*.35,-w*.45,y-h*.5);q.quadraticCurveTo(0,y-h*.75,w*.45,y-h*.5);q.quadraticCurveTo(w+1,y-h*.35,w,y+h*.55);
        for(let i=0;i<=5;i++){const xx=w-i*w*2/5;q.quadraticCurveTo(xx+w*.2,y+h*.95,xx,y+h*.55+(i%2?.8:0))}q.closePath()};
      Kit.solid(g,sh,-w,y-h,w,y+h,col,{tex:'cloth',texA:.45,rim:'rgba(255,240,214,.75)'});
      g.strokeStyle=T;g.lineWidth=1.3;g.beginPath();g.moveTo(-w,y+h*.55);for(let i=0;i<=5;i++){const xx=w-(5-i)*w*2/5;g.lineTo(xx-w*2/5*.0+0,y+h*.55+(i%2?.8:0))}g.stroke();Kit.outline(g,sh,Kit.rgb(Kit.hex(Kit.lit(col,-.75)),.8),.8)};
    if(RT>=6)layer(14,9,1,Kit.lit(p.cloak,.15));
    layer(12,7,-1,RT>=6?p.robe:Kit.lit(p.robe,-.12));
    if(RT>=6&&c>-.3){g.fillStyle=T;for(const sd of [-1,1]){g.beginPath();g.arc(sd*8+s*2,-1.5,1.4,0,6.283);g.fill()}}},o);
  case'head':return SC.get(key,44,44,22,40,g=>{g.translate(22,40);const hx=s*1.2,hy=-8;
    if(pr){// 두건
      const hood=q=>{q.ellipse(hx-s*1.6,hy-.6,8.6,9.4,0,0,6.283)};
      Kit.solid(g,hood,hx-9,hy-10,hx+8,hy+9,p.hat,{tex:'cloth',texA:.4,rim:rimC});
      if(c>-.25){const fw=5.2*(.55+.45*Math.max(0,c)),fx=hx+s*2.4;
        const face=q=>{q.ellipse(fx,hy+1,fw,5.8,0,0,6.283)};
        Kit.solid(g,face,fx-fw,hy-5,fx+fw,hy+7,p.skin,{rim:'rgba(255,240,220,.7)',lineW:.6});
        g.fillStyle=p.hair;g.beginPath();g.ellipse(fx,hy-3.6,fw,2.2,0,Math.PI,0);g.fill();
        heroEyes(g,fx,hy+1.4,s,c);heroFaceD(g,fx,hy+1.4,s,c,p.skin);
        g.save();g.beginPath();face(g);g.clip();g.fillStyle='rgba(60,40,20,.22)';g.beginPath();g.ellipse(fx,hy-4.4,fw+2,2.6,0,0,6.283);g.fill();g.restore();
        g.strokeStyle=T;g.lineWidth=1.5;g.beginPath();g.ellipse(fx,hy+1,fw+1,6.6,0,0,6.283);g.stroke();
        g.fillStyle=T;g.beginPath();g.arc(fx,hy-5.2,1.3,0,6.283);g.fill()}
      else{g.strokeStyle=T;g.lineWidth=1.3;g.beginPath();g.moveTo(hx,hy-6);g.lineTo(hx,hy+5);g.moveTo(hx-3,hy-2);g.lineTo(hx+3,hy-2);g.stroke()}
      g.strokeStyle=T;g.lineWidth=1.2;g.beginPath();g.ellipse(hx-s*1.6,hy+6.6,7.6,2.4,0,0,Math.PI);g.stroke();
      if(RT>=6){// 주교관: 두건 위로 솟은 뾰족한 관
        const mx=hx-s*1.4,my=hy-7.4,mit=q=>{q.moveTo(mx-6,my+2);q.quadraticCurveTo(mx-6.4,my-7,mx-1,my-13);q.lineTo(mx,my-11.6);q.lineTo(mx+1,my-13);q.quadraticCurveTo(mx+6.4,my-7,mx+6,my+2);q.quadraticCurveTo(mx,my+3.4,mx-6,my+2);q.closePath()};
        Kit.solid(g,mit,mx-7,my-13,mx+7,my+3,p.hat,{tex:'cloth',texA:.35,rim:rimC});g.save();g.beginPath();mit(g);g.clip();g.fillStyle=T;g.fillRect(mx-.9,my-13,1.8,16);g.fillRect(mx-7,my-.6,14,2.2);g.fillRect(mx-3.2,my-7.6,6.4,1.4);g.restore();Kit.outline(g,mit,Kit.rgb(Kit.hex(Kit.lit(T,-.5)),.8),.7)}
      else if(RT>=4&&c>-.25){g.strokeStyle=T;g.lineWidth=1.6;g.beginPath();g.ellipse(hx-s*1.6,hy-4.6,7.8,2.2,0,Math.PI*1.05,Math.PI*1.95);g.stroke();g.fillStyle=Kit.lit(T,.4);g.beginPath();g.arc(hx+s*2.4,hy-6.4,1.2,0,6.283);g.fill()}
      return}
    // 마법사: 얼굴 + 챙 넓은 모자
    const head=q=>{q.arc(hx,hy,6.4,0,6.283)};
    Kit.solid(g,head,hx-6,hy-6,hx+6,hy+6,c>-.25?p.skin:p.hair,{rim:'rgba(255,240,220,.7)',lineW:.7});
    if(c>-.25){g.fillStyle=p.hair;g.beginPath();g.ellipse(hx-s*2.6,hy-1.6,6.6,4.4,0,Math.PI*.95,Math.PI*2.05);g.fill();
      if(Math.abs(s)>.5){g.beginPath();g.ellipse(hx-s*4.6,hy+.6,2.6,5,0,0,6.283);g.fill()}
      // 옆머리: 귀 뒤로 어깨까지 흘러내린다
      for(const sd of [-1,1]){const x=hx+sd*5.4*Math.max(.55,c)+s*1.2;if(sd*s<-.5)continue;g.fillStyle=Kit.lit(p.hair,sd*s>0?-.15:0);g.beginPath();g.moveTo(x-1.6*sd,hy-3);g.quadraticCurveTo(x+1.6*sd,hy+3,x+.6*sd,hy+8.4);g.quadraticCurveTo(x-.8*sd,hy+6,x-1.8*sd,hy+1);g.closePath();g.fill()}
      heroEyes(g,hx+s*2.6,hy+1,s,c);heroFaceD(g,hx+s*2.6,hy+1,s,c,p.skin);
      g.save();g.beginPath();g.arc(hx,hy,6.4,0,6.283);g.clip();g.fillStyle='rgba(20,10,30,.2)';g.beginPath();g.ellipse(hx,hy-6,9,3,0,0,6.283);g.fill();g.restore()}
    else{g.fillStyle=Kit.lit(p.hair,-.1);g.beginPath();g.ellipse(hx,hy+4,5.6,4.6,0,0,Math.PI);g.fill()}
    const by=hy-3.4;
    // 챙 (뒤쪽 반)
    const brim=q=>{q.ellipse(hx,by,14.2,4.6,0,0,6.283)};
    Kit.solid(g,brim,hx-14,by-4,hx+14,by+4,p.hat,{tex:'cloth',texA:.4,rim:rimC,lineW:.8});
    g.strokeStyle=Kit.rgb(Kit.hex(T),.85);g.lineWidth=1;g.beginPath();g.ellipse(hx,by,13.2,4,0,0,6.283);g.stroke();
    // 원뿔 (끝이 뒤로 휘어진다)
    const tx=hx-s*(RT>=5?11:9),ty=by-(RT>=5?31:25);
    const cone=q=>{q.moveTo(hx-6.8,by);q.bezierCurveTo(hx-6,by-9,tx-1,ty+9,tx-1.6,ty);q.quadraticCurveTo(tx+1,ty-1,tx+1.6,ty+.4);q.bezierCurveTo(tx+2,ty+10,hx+5.6,by-9,hx+6.8,by);q.quadraticCurveTo(hx,by+2,hx-6.8,by);q.closePath()};
    Kit.solid(g,cone,hx-7,ty,hx+7,by,p.hat,{tex:'cloth',texA:.45,rim:rimC});
    // 모자 띠 + 별 장식
    g.save();g.beginPath();cone(g);g.clip();g.fillStyle=T;g.beginPath();g.moveTo(hx-7,by-1);g.quadraticCurveTo(hx,by+1.4,hx+7,by-1);g.lineTo(hx+6.4,by-4.4);g.quadraticCurveTo(hx,by-2.4,hx-6.4,by-4.4);g.closePath();g.fill();
    g.fillStyle='rgba(255,255,255,.35)';g.fillRect(hx-7,by-4.4,14,.8);g.restore();
    if(c>-.3){const x=hx+s*3.6,y=by-2.6;g.fillStyle=Kit.lit(T,.5);g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?1:2.6;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}g.closePath();g.fill();
      if(RT>=3){g.fillStyle=Kit.lit(T,-.3);g.beginPath();g.arc(x-s*6,y+.4,1.3,0,6.283);g.fill()}}
    // 5단계부터 모자에 별 장식, 6단계부터 모자 끝 초승달
    if(RT>=5){g.fillStyle=Kit.rgb(Kit.hex(Kit.lit(T,.5)),.8);for(const [u,v] of [[.35,.3],[.6,-.2],[.75,.4]]){const x=hx+(tx-hx)*u+v*3,y=by+(ty-by)*u;g.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?.4:1.3;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}g.closePath();g.fill()}}
    if(RT>=6){g.fillStyle=Kit.lit(T,.45);g.beginPath();g.arc(tx+1,ty-1.6,2.6,0,6.283);g.arc(tx+2.2,ty-2.4,2.2,0,6.283,true);g.fill()}},o);
  case'cloak':return SC.get(key,44,48,22,4,g=>{g.translate(22,4);const wf=.72+.28*Math.abs(c),tr=-s*6;
    const ck=q=>{q.moveTo(-9*wf,0);q.lineTo(9*wf,0);q.bezierCurveTo(13*wf,10,15*wf+tr,26,16*wf+tr,36);
      for(let i=0;i<=4;i++){const x=(16-i*8)*wf+tr;q.quadraticCurveTo(x-4*wf,38+(i%2?2:-1),x-8*wf,36+(i%2?0:1.5))}
      q.bezierCurveTo(-15*wf+tr,26,-13*wf,10,-9*wf,0);q.closePath()};
    const inside=c>.2;
    Kit.solid(g,ck,-16,0,16,40,inside?Kit.lit(p.lining,-.25):p.cloak,{tex:'cloth',texA:.5,rim:inside?'rgba(255,240,214,.35)':rimC});
    g.save();g.beginPath();ck(g);g.clip();
    g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1.4;for(const fx of [-8,-2.5,3,8.5]){g.beginPath();g.moveTo(fx*.5*wf,3);g.quadraticCurveTo(fx*wf+tr*.4,20,fx*1.1*wf+tr,38);g.stroke()}
    if(!inside){// 등 문양
      if(c<-.3){const y=14;g.strokeStyle=Kit.rgb(Kit.hex(T),.8);g.lineWidth=1.4;
        if(pr){g.beginPath();g.arc(tr*.4,y,5,0,6.283);g.moveTo(tr*.4,y-8);g.lineTo(tr*.4,y+8);g.moveTo(tr*.4-6,y);g.lineTo(tr*.4+6,y);g.stroke()}
        else{g.beginPath();g.arc(tr*.4,y,5.5,0,6.283);g.stroke();g.beginPath();for(let i=0;i<3;i++){const a=i*2.094-Math.PI/2;g.lineTo(tr*.4+Math.cos(a)*5.5,y+Math.sin(a)*5.5)}g.closePath();g.stroke()}}
      g.strokeStyle=T;g.lineWidth=2;g.beginPath();g.moveTo(-9*wf,0);g.bezierCurveTo(-13*wf,10,-15*wf+tr,26,-16*wf+tr,36);g.moveTo(9*wf,0);g.bezierCurveTo(13*wf,10,15*wf+tr,26,16*wf+tr,36);g.stroke()}
    if(RT>=5&&!inside){g.fillStyle=Kit.rgb(Kit.hex(T),.75);for(let i=0;i<7;i++){const u=i/6;g.beginPath();g.arc((-16+u*32)*wf+tr,36.6+(i%2?1:0),.9,0,6.283);g.fill()}}
    g.restore();Kit.outline(g,ck,Kit.rgb(Kit.hex(Kit.lit(p.cloak,-.75)),.8),.9);
    // 어깨 걸쇠
    if(c>-.3){g.fillStyle=T;for(const sd of [-1,1]){g.beginPath();g.arc(sd*7.4*wf+s*2,1,1.7,0,6.283);g.fill()}}},o);
  case'arm':case'armB':return SC.get(key,16,22,8,3,g=>{g.translate(8,3);const col=part==='armB'?Kit.lit(p.robe,-.28):p.robe;
    const fl=RT>=2?1:0,sl=q=>{q.moveTo(-3.2,-1.5);q.quadraticCurveTo(0,-3,3.2,-1.5);q.quadraticCurveTo(3.6,6,5.4+fl,12.6);q.quadraticCurveTo(0,14.8,-5.4-fl,12.6);q.quadraticCurveTo(-3.6,6,-3.2,-1.5);q.closePath()};
    // 손 (소매보다 먼저: 소매 끝에서 나온다) — 엄지가 있는 손
    const sk=part==='armB'?Kit.lit(p.skin,-.2):p.skin;
    Kit.solid(g,q=>{q.ellipse(0,15.2,2.5,2.9,0,0,6.283)},-2.5,12.3,2.5,18.1,sk,{lineW:.55});
    Kit.solid(g,q=>{q.ellipse(-2.1,14.2,1,1.7,-.5,0,6.283)},-3.2,12.4,-1,16,Kit.lit(sk,-.06),{lineW:.45});
    g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(sk,-.5)),.5);g.lineWidth=.4;g.beginPath();g.moveTo(-.6,16.8);g.lineTo(1.6,16.4);g.moveTo(-.4,17.6);g.lineTo(1.4,17.3);g.stroke();
    Kit.solid(g,sl,-5.4-fl,-2,5.4+fl,15,col,{tex:'cloth',texA:.45,rim:part==='armB'?'rgba(255,240,214,.3)':rimC,lineW:.8});
    g.save();g.beginPath();sl(g);g.clip();g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(col,-.5)),.35);g.lineWidth=.7;g.beginPath();g.moveTo(-.8,0);g.quadraticCurveTo(-1.6,7,-2.4,13);g.moveTo(1.4,1);g.quadraticCurveTo(2,7,2.8,13);g.stroke();
    // 소맷부리: 1단 금실, 4단계부터 두 겹, 5단계부터 금속 팔찌
    g.fillStyle=Kit.lit(p.lining||p.robe,-.1);g.beginPath();g.moveTo(-5.4-fl,12.6);g.quadraticCurveTo(0,14.8,5.4+fl,12.6);g.lineTo(5,11);g.quadraticCurveTo(0,13,-5,11);g.closePath();g.fill();g.restore();
    g.strokeStyle=T;g.lineWidth=1.6;g.beginPath();g.moveTo(-5.2-fl,12.4);g.quadraticCurveTo(0,14.6,5.2+fl,12.4);g.stroke();
    if(RT>=4){g.lineWidth=.8;g.beginPath();g.moveTo(-4.4,9.6);g.quadraticCurveTo(0,11.6,4.4,9.6);g.stroke()}
    if(RT>=5)Kit.solid(g,q=>q.rect(-3,4.6,6,2.4),-3,4.6,3,7,RT>=7?'#f0e0a0':'#b8bcc8',{tex:'metal',texA:.5,rim:'rgba(255,255,255,.8)',lineW:.5})},o);
  case'staff':return SC.get(key,32,72,16,46,g=>{g.translate(16,46);
    // 지팡이 단계: 0 참나무 · 1 물푸레 갈퀴 · 2 수정 · 3 룬 · 4 은룡 날개 · 5 용뼈 뿔 · 6 별철 별관 · 7 근원의 고리
    const MAT=['#5e3f22','#7a5a38','#4e5a66','#3a2a22','#c8ccd4','#e6dcc2','#3a3e4c','#e8d8a0'],BAND=['#8a6a3a','#d4aa4c','#9fd8ff','#c9a2ff','#ffffff','#b8a888','#a8b8ff','#fff3b0'],m=MAT[WT],bd=BAND[WT];
    const sh=q=>{q.moveTo(-1.5,22);q.quadraticCurveTo(-2.2,0,-1.2,-28);q.lineTo(1.2,-28);q.quadraticCurveTo(1.8,0,1.5,22);q.closePath()};
    Kit.solid(g,sh,-2,-28,2,22,m,{tex:WT===4||WT===6||WT===7?'metal':WT===5?'bone':'wood',texA:.6,rim:'rgba(255,240,214,.6)',rimW:.5,lineW:.6});
    const band=y=>Kit.solid(g,q=>q.rect(-2.2,y,4.4,2),-2,y,2,y+2,bd,{rim:'rgba(255,255,255,.9)',lineW:.5});
    band(-1.5);band(-26);band(18);if(WT>=3)band(-14);
    if(WT===3){g.strokeStyle='rgba(200,170,255,.85)';g.lineWidth=.6;for(let y=-24;y<16;y+=5){g.beginPath();g.moveTo(-1,y);g.lineTo(1,y+1.6);g.lineTo(-.6,y+3);g.stroke()}}
    if(WT===5){g.fillStyle='rgba(60,40,20,.5)';for(let y=-22;y<18;y+=4.5)g.fillRect(-1.6,y,3.2,.8)}
    const L2=Kit.lit(m,.35),D2=Kit.lit(m,-.35);
    g.save();g.translate(0,-34);
    if(WT===0){Kit.solid(g,q=>q.ellipse(0,4.6,3.4,4,0,0,6.283),-3.4,.6,3.4,8.6,m,{tex:'wood',texA:.6,lineW:.6})}
    else if(WT===1){g.strokeStyle=Kit.lit(m,-.2);g.lineWidth=1.8;g.lineCap='round';for(const sd of [-1,1]){g.beginPath();g.moveTo(sd*.6,7);g.bezierCurveTo(sd*6,4,sd*6.4,-2,sd*2,-5.5);g.stroke()}g.strokeStyle=L2;g.lineWidth=.6;g.beginPath();g.moveTo(-.6,7);g.bezierCurveTo(-5.6,4,-5.8,-1,-2.2,-4.8);g.stroke()}
    else if(WT===2){for(const [x,y,w,h,a] of [[-4,2,2.2,9,-.35],[4.2,2.6,2,8,.4],[-1.8,-1,1.8,7,-.15],[2,-1.4,1.6,6,.2]]){g.save();g.translate(x,y);g.rotate(a);Kit.solid(g,q=>{q.moveTo(0,-h);q.lineTo(w,-h*.6);q.lineTo(w*.8,0);q.lineTo(-w*.8,0);q.lineTo(-w,-h*.6);q.closePath()},-w,-h,w,0,'#8fd0f0',{rim:'rgba(255,255,255,.95)',lineW:.5});g.restore()}}
    else if(WT===3){g.strokeStyle='#c9a2ff';g.lineWidth=1.2;g.beginPath();g.ellipse(0,0,7,2.6,0,0,6.283);g.stroke();g.fillStyle='#e8d8ff';for(let k=0;k<4;k++){const a=k*Math.PI/2+.4;g.fillRect(Math.cos(a)*7-.7,Math.sin(a)*2.6-.7,1.4,1.4)}
      Kit.solid(g,q=>{q.moveTo(-2.4,7);q.lineTo(-3.4,2);q.lineTo(3.4,2);q.lineTo(2.4,7);q.closePath()},-3.4,2,3.4,7,m,{lineW:.5})}
    else if(WT===4){for(const sd of [-1,1]){const w=q=>{q.moveTo(sd*1.4,6);q.bezierCurveTo(sd*7,5,sd*11,-1,sd*10,-9);q.quadraticCurveTo(sd*8,-4,sd*6.6,-4.4);q.quadraticCurveTo(sd*7.4,-1,sd*4,1);q.quadraticCurveTo(sd*4.6,3,sd*1.4,3);q.closePath()};
        Kit.solid(g,w,sd>0?0:-11,-9,sd>0?11:0,6,'#d8dce4',{tex:'metal',texA:.5,rim:'rgba(255,255,255,.95)',lineW:.6});g.strokeStyle='rgba(90,100,120,.6)';g.lineWidth=.5;for(let k=0;k<3;k++){g.beginPath();g.moveTo(sd*(3+k*2),3-k);g.lineTo(sd*(6+k*1.6),-3-k*1.6);g.stroke()}}}
    else if(WT===5){for(const sd of [-1,1]){g.strokeStyle='#efe6cc';g.lineWidth=2.4;g.lineCap='round';g.beginPath();g.moveTo(sd*1,6);g.bezierCurveTo(sd*7,4,sd*9,-4,sd*4,-8);g.quadraticCurveTo(sd*2.4,-9,sd*3,-6.6);g.stroke();g.strokeStyle='rgba(120,100,70,.6)';g.lineWidth=.6;for(let k=0;k<4;k++){g.beginPath();g.arc(sd*(4+k*1.2),3-k*2.6,1.4,0,Math.PI);g.stroke()}}}
    else if(WT===6){for(let k=0;k<5;k++){const a=-Math.PI/2+(k-2)*.55;g.save();g.rotate(a+Math.PI/2);Kit.solid(g,q=>{q.moveTo(-1.4,-3);q.lineTo(0,-11);q.lineTo(1.4,-3);q.closePath()},-1.4,-11,1.4,-3,'#5a6278',{tex:'metal',texA:.5,rim:'rgba(200,215,255,.9)',lineW:.5});g.restore()}
      Kit.solid(g,q=>q.arc(0,3.6,3.2,0,6.283),-3.2,.4,3.2,6.8,'#3a3e4c',{tex:'metal',lineW:.5})}
    else{for(const [rx,ry,a] of [[9,3,.3],[8,2.6,-.5]]){g.strokeStyle='rgba(255,240,180,.9)';g.lineWidth=1.1;g.beginPath();g.ellipse(0,0,rx,ry,a,0,6.283);g.stroke()}g.fillStyle='#fff3b0';for(let k=0;k<3;k++){const a=k*2.094;g.beginPath();g.arc(Math.cos(a)*9,Math.sin(a)*3,1,0,6.283);g.fill()}
      Kit.solid(g,q=>{q.moveTo(-2,8);q.lineTo(0,4);q.lineTo(2,8);q.closePath()},-2,4,2,8,'#e8d8a0',{lineW:.4})}
    if(pr){// 사제: 성표 (낮은 단계 십자, 높은 단계 햇살)
      if(WT<=3){Kit.solid(g,q=>{q.rect(-.9,-14,1.8,7);q.rect(-3,-11.6,6,1.6)},-3,-14,3,-7,'#e0b850',{rim:'rgba(255,255,255,.95)',lineW:.4})}
      else{g.strokeStyle='rgba(255,226,140,.85)';g.lineWidth=.9;for(let k=0;k<10;k++){const a=k*Math.PI/5;g.beginPath();g.moveTo(Math.cos(a)*6,Math.sin(a)*6);g.lineTo(Math.cos(a)*(k%2?8.4:10.4),Math.sin(a)*(k%2?8.4:10.4));g.stroke()}}}
    g.restore()},o);
  case'gem':return SC.get(`hero/gem/${trim}/${sc.toFixed(2)}`,12,12,6,6,g=>{
    Kit.solid(g,q=>q.arc(6,6,3.6,0,6.283),2.4,2.4,9.6,9.6,trim,{rim:'rgba(255,255,255,.95)',lineW:.6});
    g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.ellipse(4.8,4.6,1.3,.9,-.5,0,6.283);g.fill()},o);
  case'ice':return SC.get(`hero/ice/${sc.toFixed(2)}`,40,76,20,72,g=>{g.translate(20,72);
    const sh=q=>{q.moveTo(-15,-2);q.lineTo(-17,-28);q.lineTo(-11,-52);q.lineTo(-4,-64);q.lineTo(3,-58);q.lineTo(9,-66);q.lineTo(14,-44);q.lineTo(17,-22);q.lineTo(14,-1);q.quadraticCurveTo(0,4,-15,-2);q.closePath()};
    g.globalAlpha=.55;Kit.solid(g,sh,-17,-66,17,2,'#8fd8ff',{rim:'rgba(255,255,255,1)',rimW:2.2,lineW:1});g.globalAlpha=1;
    g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=1;for(const [x0,y0,x1,y1] of [[-10,-40,-4,-20],[6,-50,10,-30],[-2,-12,6,-4],[-12,-14,-8,-6]]){g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke()}},o);
  case'star':return SC.get(`hero/star/${sc.toFixed(2)}`,12,12,6,6,g=>{g.translate(6,6);g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?1.8:5;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();
    g.fillStyle='#ffe066';g.fill();g.strokeStyle='#8a6a10';g.lineWidth=.7;g.stroke();g.fillStyle='#fff8d0';g.beginPath();g.arc(-.8,-.8,1.2,0,6.283);g.fill()},o);
  }}
// 코·입·눈썹 (작게: 화면에서 1~2px)
function heroFaceD(g,x,y,s,c,sk){const d=Kit.rgb(Kit.hex(Kit.lit(sk,-.45)),.75);g.strokeStyle=d;g.lineWidth=.5;
  if(c>.35){const sp=2.3*Math.max(.2,c);g.beginPath();g.moveTo(x-sp-1,y-1.9);g.lineTo(x-sp+.9,y-2.2);g.moveTo(x+sp-.9,y-2.2);g.lineTo(x+sp+1,y-1.9);g.stroke()}
  g.beginPath();g.moveTo(x+s*1.8,y+.6);g.lineTo(x+s*2.4,y+2);g.lineTo(x+s*1.6,y+2.2);g.stroke();
  g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(sk,-.55)),.6);g.beginPath();g.moveTo(x+s*1.8-.9*Math.max(.3,c),y+3.4);g.quadraticCurveTo(x+s*1.8,y+3.8,x+s*1.8+.9*Math.max(.3,c),y+3.4);g.stroke()}
function heroEyes(g,x,y,s,c){g.fillStyle='#2a1a14';const sp=2.3*Math.max(.2,c);
  if(c>.35){g.beginPath();g.ellipse(x-sp,y,.9,1.2,0,0,6.283);g.ellipse(x+sp,y,.9,1.2,0,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.85)';g.fillRect(x-sp+.1,y-.7,.45,.45);g.fillRect(x+sp+.1,y-.7,.45,.45)}
  else{g.beginPath();g.ellipse(x+s*1.2,y,.8,1.2,0,0,6.283);g.fill()}
  g.fillStyle='rgba(200,90,70,.25)';g.beginPath();g.ellipse(x+s*1.6,y+2.4,1.6,.9,0,0,6.283);g.fill()}
function heroColors(h){const p=HERO_PAL[h.cls]||HERO_PAL.mage,gr=h.gear||{};
  return{trim:gr.robe?RAR[gr.robe.rar].c:p.gold,gem:gr.staff?RAR[gr.staff.rar].c:p.gem,robeR:gr.robe?gr.robe.rar:-1,staffR:gr.staff?gr.staff.rar:-1}}
// 모든 방향 미리 굽기
function heroBake(h,bs){if(typeof HERO18!=='undefined'&&HERO18[h.cls])return heroBake18(h,bs);const {gem}=heroColors(h),cls=h.cls in HERO_PAL?h.cls:'mage',L=heroLook(h);
  for(let d=0;d<5;d++)for(const pt of L.rt>=3?['boot','skirt','torso','head','cloak','pauld']:['boot','skirt','torso','head','cloak'])heroPart(cls,pt,d,L,bs);
  if(L.off)for(let d=0;d<5;d++)heroPart(cls,'off',d,L,bs);
  heroPart(cls,'arm',0,L,bs);heroPart(cls,'armB',0,L,bs);heroPart(cls,'staff',0,L,bs);heroPart(cls,'gem',0,gem,bs)}

// 한 플레이어를 그린다. g: 그릴 캔버스, (x,y): 발밑 화면 좌표, k: 추가 배율, o: {t, castK, el, bs}
function drawFigure(g,h,x,y,k,o){
  if(typeof HERO18!=='undefined'&&HERO18[h.cls])return drawFigure18(g,h,x,y,k,o);// v18 전사·궁수 (hero18.js)
  o=o||{};const t=o.t!=null?o.t:time,frozen=(h.freezeT||0)>0,stun=(h.stunT||0)>0,cls=h.cls in HERO_PAL?h.cls:'mage',pal=HERO_PAL[cls];
  const [di,flip]=heroDir(h.face||0),th=HERO_DIRS[di]*Math.PI/180,s=Math.sin(th),c=Math.cos(th);
  const col=heroColors(h),bs=o.bs,LK=heroLook(h);
  const mv=h.moving&&!frozen&&!stun?1:0,ph=(h.walk||0)*11,tt=frozen?0:t;
  const ck=o.castK!=null?o.castK:frozen?0:heroCastK(h,t),el=o.el||(HANIM.get(h)||{}).el;
  const hk=Math.max(0,Math.min(1,(h.hurtT||0)/.25));
  g.save();g.translate(x,y);if(k&&k!==1)g.scale(k,k);
  Kit.shadow(g,2,1,24*HS,8.5*HS,1);
  g.scale(HS*(flip?-1:1),HS);
  if(hk>0){g.translate(-s*hk*5,-c*.5*hk*5);g.rotate(-s*hk*.12)}
  // 걸음
  const st=mv?Math.sin(ph):0,bob=mv?-Math.abs(Math.cos(ph))*1.8:Math.sin(tt*2.2)*.5,br=mv?0:Math.sin(tt*2.2);
  const lift=q=>mv?Math.max(0,q)*2.2:0;
  const ops=[];
  const P_=(z,f)=>ops.push({z,f});
  const boot=heroPart(cls,'boot',di,LK,bs),skirt=heroPart(cls,'skirt',di,LK,bs),torso=heroPart(cls,'torso',di,LK,bs),head=heroPart(cls,'head',di,LK,bs),cloak=heroPart(cls,'cloak',di,LK,bs),pauld=LK.rt>=3?heroPart(cls,'pauld',di,LK,bs):null;
  const arm=heroPart(cls,'arm',0,LK,bs),armB=heroPart(cls,'armB',0,LK,bs),staff=heroPart(cls,'staff',0,LK,bs),isSt=LK.wk==='staff',gem=isSt?heroPart(cls,'gem',0,col.gem,bs):null,off=LK.off?heroPart(cls,'off',LK.off.wt==='quiver'?di:di,LK,bs):null;
  const fwx=s,fwy=c*.5;
  // 다리 (오른발 = 화면 기준 -c 쪽)
  for(const sd of [1,-1]){const q=st*sd,bx=-c*3.6*sd+fwx*q*5,by=fwy*q*5-lift(sd*Math.cos(ph));
    P_(-1.5+sd*s*.4,()=>{g.save();g.translate(bx,by);g.scale(1,BK.leg);SC.draw(g,boot,0,0);g.restore()})}
  const wy=-28+bob;
  P_(0,()=>{g.save();g.translate(0,wy);g.transform(1,0,mv?st*.08*(Math.abs(s)>.3?1:.5):Math.sin(tt*1.6)*.012,1,0,0);g.scale(1,BK.sk);SC.draw(g,skirt,0,0);g.restore()});
  P_(1,()=>{g.save();g.translate(0,wy);g.scale(1,BK.to*(1+br*.015));SC.draw(g,torso,0,0);g.restore()});
  const shy=wy-14.2*BK.to-br*.25;
  if(pauld)P_(5.5,()=>SC.draw(g,pauld,0,shy+1));
  P_(6,()=>{g.save();g.translate(0,shy+1.5);g.scale(BK.hd,BK.hd);SC.draw(g,head,0,0);g.restore()});
  // 망토
  const sway=Math.sin(tt*1.6)*.035+(mv?s*.16+Math.sin(ph*2)*.04:0)+hk*s*.1;
  if(cloak)P_(c>=0?-10:1.5,()=>{g.save();g.translate(0,shy+.5);g.rotate(sway);g.scale(1,BK.ck);SC.draw(g,cloak,0,0);g.restore()});
  if(off&&LK.off.wt==='quiver')P_(c>=0?-10.5:1.6,()=>{g.save();g.translate(5,shy-3);g.rotate(.4+sway*.5);SC.draw(g,off,0,0);g.restore()});
  // 팔 + 지팡이
  const rest=.12;
  const arms=[];
  for(const sd of [1,-1]){// sd=1 오른팔(지팡이)
    const sx=-c*7.4*sd+s*1.2*sd*.4,sy=shy+1.6;
    let r=sd*(sd===1?.32:rest)*c-st*sd*.6*s*.9-(mv?0:br*.03*sd);
    if(sd===1&&ck>0){const dx=-c*.7+s*1,dy=-1.4,rc=Math.atan2(-dx,dy);r=r+(rc-r)*ck}
    if(sd===-1&&ck>0)r+=ck*(-s*.7+c*.25);
    const near=sd*s>=0;arms.push({sd,sx,sy,r,z:2+sd*s*3,img:near||Math.abs(s)<.3?arm:armB});
  }
  for(const a of arms){const hx=a.sx-Math.sin(a.r)*15*BK.arm,hy=a.sy+Math.cos(a.r)*15*BK.arm;a.hx=hx;a.hy=hy;
    P_(a.z,()=>{g.save();g.translate(a.sx,a.sy);g.rotate(a.r);g.scale(1,BK.arm);SC.draw(g,a.img,0,0);g.restore()})}
  const R=arms[0],sr=(-c*.1+s*.1)+(R.r-.32*c)*.22+ck*(s*.3-c*.12);
  const gx=R.hx-Math.sin(-sr)*0+Math.sin(sr)*34,gy=R.hy-Math.cos(sr)*34;
  P_(R.z-.05,()=>{g.save();g.translate(R.hx,R.hy);g.rotate(sr);SC.draw(g,staff,0,0);g.restore();if(gem)SC.draw(g,gem,gx,gy)});
  if(off&&LK.off.wt!=='quiver'){const A=arms[1];P_(A.z+(c>=0?.03:-.03),()=>SC.draw(g,off,A.hx+s*1.5,A.hy-2))}
  if(LK.ring){const A=arms[1];P_(A.z+.01,()=>{g.fillStyle=LK.ring;g.beginPath();g.arc(A.hx,A.hy-.6,1.1,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.85)';g.fillRect(A.hx-.6,A.hy-1.3,.6,.6)})}
  ops.sort((a,b)=>a.z-b.z);for(const op of ops)op.f();
  // 빛: 보석 · 시전 · 등급 반짝임 (가산 혼합)
  const po=g.globalCompositeOperation;g.globalCompositeOperation='lighter';
  const pulse=.85+Math.sin(t*3)*.15,gc=ck>0&&el&&EL[el]?EL[el]:col.gem;
  heroGlow(g,gx,gy,(isSt?9+ck*14:ck*12)*pulse,gc,.9);if(ck>.3)heroGlow(g,gx,gy,5,'#ffffff',ck);
  if(isSt&&col.staffR>=4){const n=col.staffR>=5?3:2;for(let i=0;i<n;i++){const a=t*2.6+i*6.283/n;heroGlow(g,gx+Math.cos(a)*8,gy+Math.sin(a)*3.4-1,col.staffR>=5?5:4,col.gem,.9)}}
  if(col.robeR>=4){const n=col.robeR>=5?3:2;for(let i=0;i<n;i++){const u=Math.sin(t*1.1+i*2.1);heroGlow(g,u*12,wy+24+(1-u*u)*2,col.robeR>=5?6:4.5,col.trim,.7+Math.sin(t*4+i)*.3)}}
  if(LK.ring){const A=arms[1];heroGlow(g,A.hx,A.hy-.6,3.2,LK.ring,.7+Math.sin(t*3)*.2)}
  if(LK.rt>=7)heroGlow(g,0,wy+21,16,col.trim,.25+Math.sin(t*2)*.1);
  if(hk>0)heroGlow(g,0,-30,34,'rgba(255,70,50,.9)',hk*.75);
  g.globalCompositeOperation=po;
  if(frozen)SC.draw(g,heroPart(cls,'ice',0,'',bs),0,0);
  if(stun){for(let i=0;i<3;i++){const a=t*4+i*2.094;SC.draw(g,heroPart(cls,'star',0,'',bs),Math.cos(a)*10,shy-20+Math.sin(a)*3)}}
  g.restore();
  return{gx:x+(flip?-gx:gx)*HS*(k||1),gy:y+gy*HS*(k||1)};
}
function heroGlow(g,x,y,r,col,a){if(r<=0||a<=0)return;const pa=g.globalAlpha;g.globalAlpha=pa*Math.min(1,a);g.drawImage(Kit.glowCv(col),x-r,y-r,r*2,r*2);g.globalAlpha=pa}
// 화면 방향 번호(0=E,1=SE,2=S…) → 월드 face 각도
function heroFace(i){const a=i*Math.PI/4,c=(Math.cos(a)+2*Math.sin(a))/2,s=(2*Math.sin(a)-Math.cos(a))/2;return Math.atan2(s,c)}
// 캐릭터 선택 화면 미리보기: 천천히 돌며 숨쉬고 가끔 지팡이를 든다
let pvLoop=0;
function heroPreviews(root){
  const cvs=[...root.querySelectorAll('canvas.pv')];if(!cvs.length)return;
  const dp=Math.min(2,window.devicePixelRatio||1);
  const items=cvs.map((cv,i)=>{cv.width=64*dp;cv.height=84*dp;let gear={};try{gear=JSON.parse(cv.dataset.gear||'{}')}catch(_){}
    return{cv,g:cv.getContext('2d'),h:{cls:cv.dataset.pv,gear,face:heroFace(2),moving:false,walk:0},off:i*1.7}});
  for(const it of items)heroBake(it.h,dp*HS*1.25);
  const id=++pvLoop;
  const step=()=>{if(id!==pvLoop||$('#intro').hidden||!items[0].cv.isConnected)return;const t=performance.now()/1000;
    for(const it of items){const {g,h,cv}=it,u=t+it.off;h.face=heroFace((2+Math.floor(u/1.6))%8);
      const cp=(u%6.4)/6.4,ck=cp>.8?Math.sin((cp-.8)/.2*Math.PI):0;
      g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.scale(dp,dp);
      const v18=typeof HERO18!=='undefined'&&HERO18[h.cls]&&!h.gear.staff;// v18: 장비가 없으면 무기 갈래를 번갈아 보여 준다
      drawFigure(g,h,32,78,1.25,v18?{t:u,bs:dp*HS*1.25,wt:Math.floor(u/6.4)%2?(h.cls==='warrior'?'polearm':'xbow'):null,off:h.cls==='warrior'?'shield':undefined,atk:ck>0?(h.cls==='warrior'?(Math.floor(u/6.4)%2?'thrust':'swing'):'draw'):null,atkP:(cp-.8)/.2}:{t:u,castK:ck,bs:dp*HS*1.25})}
    requestAnimationFrame(step)};
  requestAnimationFrame(step)}
// 갤러리: 8방향 × 동작
function heroGallery(box){
  const wrap=document.createElement('div');wrap.style.cssText='margin:6px 0 18px';box.insertBefore(wrap,box.querySelector('#galGrid'));
  const MOT=['가만히','걷기','시전','피격','빙결','기절'],ORD=[2,1,0,7,6,5,4,3],DN=['동','남동','남','남서','서','북서','북','북동'];
  const CW=86,CH=104,dp=Math.min(2,window.devicePixelRatio||1),bs=dp*HS*1.1;
  const cvs=[];
  for(const cls of ['mage','priest'].concat(typeof HERO18!=='undefined'?Object.keys(HERO18):[])){
    const t=document.createElement('div');t.textContent=({mage:'마법사',priest:'사제',warrior:'전사',archer:'궁수'})[cls]+' · 8방향 × 동작 (오른쪽 끝: 장비 등급 0~5)';t.style.cssText='margin:8px 0 4px;font-weight:600';wrap.appendChild(t);
    const cv=document.createElement('canvas');cv.width=(CW*8+CW*1.2)*dp;cv.height=(CH*6+16)*dp;cv.style.cssText=`width:${CW*8+CW*1.2}px;height:${CH*6+16}px;max-width:100%;background:#2a2620;border:1px solid #3a342a;border-radius:6px`;wrap.appendChild(cv);
    const hs=MOT.map((m,r)=>ORD.map(i=>({cls,gear:{},face:heroFace(i),moving:r===1,walk:0,hurtT:0,freezeT:r===4?1:0,stunT:r===5?1:0})));
    const rh=[0,1,2,3,4,5].map(r=>({cls,gear:{robe:{rar:r},staff:{rar:r}},face:heroFace(2),moving:false,walk:0}));
    heroBake(hs[0][0],bs);for(const h of rh)heroBake(h,bs);
    cvs.push({cv,g:cv.getContext('2d'),hs,rh})}
  const t0=performance.now();
  const step=()=>{if(!wrap.isConnected)return;const t=(performance.now()-t0)/1000;
    for(const {cv,g,hs,rh} of cvs){g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.scale(dp,dp);
      g.fillStyle='#e8e2d2';g.font='11px sans-serif';g.textAlign='center';
      for(let j=0;j<8;j++)g.fillText(DN[ORD[j]],CW*j+CW/2,12);
      for(let r=0;r<6;r++){g.textAlign='left';g.fillStyle='rgba(232,226,210,.6)';g.fillText(MOT[r],4,16+CH*r+14);
        for(let j=0;j<8;j++){const h=hs[r][j];h.walk=t;if(r===3)h.hurtT=.25*Math.max(0,1-(t%1)/.4);
          drawFigure(g,h,CW*j+CW/2,16+CH*r+CH-12,1.1,{t,castK:r===2?.5+.5*Math.sin(t*3):0,el:r===2?['fire','ice','storm','arcane','holy','light','life','earth'][j]:null,bs})}}
      for(let r=0;r<6;r++){drawFigure(g,rh[r],CW*8+CW*.6,16+CH*r+CH-12,1.1,{t,bs});g.fillStyle=RAR[r].c;g.textAlign='center';g.fillText(RAR[r].n,CW*8+CW*.6,16+CH*r+CH-2)}}
    requestAnimationFrame(step)};
  requestAnimationFrame(step)}
