/* ---------- v18: 물리 효과 (전사 · 궁수) ----------
   칼 베기 궤적 · 창 찌르기/휩쓸기 · 방패 치기 · 도약/돌진 자취 · 화살(보통·관통·부채·비·힘껏 당김) · 원소 화살(fxrank 위계 그림 재사용)
   · 땅의 덫 · 사냥 동료(매·늑대) · 깃발/군기 · 외침 고리 · 적 머리 위 도발/표식 · 막음/피함/빗나감 글자.
   규칙: 그라디언트·그림자 흐림 없이 미리 구운 스프라이트(SC)와 짧은 경로만 매 프레임 그린다. 입자는 Q.pcap·Q.burstK를 따르고
   게임 난수(R)를 쓰지 않는다(그림 전용 난수 FXP.rng). 판정·피해는 건드리지 않는다.
   이어 붙인 곳: b3.js tryCast 끝 → FXP.cast(s,t,actor) · b4.js 땅 그림 → FXP.ground · 효과 위 → FXP.draw · r5.js drawAlly → FXP.pet
   · FXR.draw(화살) 감싸기 · 규칙 쪽에서 부를 수 있는 것: FXP.text('block'|'evade'|'miss'|'parry',x,y) · FXP.hitSpark(x,y,col) · FXP.drawTrap(c,tr,map) */
const FXP={fx:[],rng:mulberry(4817),seen:new Map(),links:[],stuck:[],
  WTR:{sword:72,polearm:110},
  col(s){return s&&s.el&&s.el!=='phys'&&EL[s.el]?EL[s.el]:(EL.phys||'#e8e4d8')},
  add(o){o.t0=o.t0!=null?o.t0:time;this.fx.push(o);if(this.fx.length>80)this.fx.shift();return o},
  wtOf(h){return typeof h18weap==='function'&&h&&HERO18[h.cls]?h18weap(h,{}):{wt:'',off:null}},
  dust(x,y,n,sp,col){n=Math.ceil(n*Q.burstK);const M=this.rng;for(let i=0;i<n&&parts.length<Q.pcap;i++){const a=M()*6.283,v=(.3+.7*M())*sp;parts.push({x,y,z:2,vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:20+M()*60,g:1,life:.4+.4*M(),max:.8,col:col||'#a89a84',sz:1.6+M()*2.6})}},
  hitSpark(x,y,col,n){n=Math.ceil((n||6)*Q.burstK);const M=this.rng;for(let i=0;i<n&&parts.length<Q.pcap;i++){const a=M()*6.283,v=120+M()*160;parts.push({x,y,z:18,vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:M()*80,life:.18+.2*M(),max:.4,col:col||'#fff4d0',sz:1.2+M()*1.4})}
    this.add({k:'star',x,y,z:18,d:.16,col:col||'#fff4d0'})},
  // 막음 · 피함 · 빗나감 (규칙 쪽에서 부른다)
  text(kind,x,y){const T={block:['막음','#9fc8ff'],parry:['받아침','#ffd76a'],evade:['피함','#bff0c0'],miss:['빗나감','#b8b0a4'],immune:['면역','#e8e2d2']}[kind]||[kind,'#e8e2d2'];
    texts.push({x:x+this.rng()*10-5,y,z:46,t:T[0],c:T[1],life:1});
    if(kind==='block'||kind==='parry')this.add({k:'blockfx',x,y,d:.3,col:T[1]});else if(kind==='evade')this.add({k:'evadefx',x,y,d:.3});else if(kind==='miss')this.dust(x,y,3,40,'#9a9288')},
  /* ----- 시전: tryCast 끝에서 (같이 하기 유령 시전도 여기로 온다. 위치는 그때의 P) ----- */
  cast(s,t,actor){if(!s)return;const ph=s.phys||s.el==='phys'||s.cls==='warrior'||s.cls==='archer';if(!ph)return;
    const o=P,a=o.face||0,W=this.wtOf(actor),col=this.col(s),war=s.cls==='warrior',k=s.kind,now=time;
    const pose=(p,d)=>{if(typeof heroAtk==='function'&&actor&&HERO18[actor.cls])heroAtk(actor,p,d)},fast=s.aspd?.26:.34;
    const iv=s.hitIv||.12,hits=typeof clsLater!=='undefined'&&!GHOST?1:Math.max(1,s.hits|0);// 연속 타격은 규칙(CLS clsLater)이 tryCast를 다시 부른다
    if(k==='melee'||(k==='cone'&&s.phys)){const reach=(this.WTR[W.wt]||(war?72:60))*(k==='cone'?Math.max(1,(s.range||150)/90):(s.range||1)),ang=(s.ang||1)*(W.wt==='polearm'?1.15:1);
      const thr=W.wt==='polearm'&&ang<1,bash=s.wt==='shield',heavy=s.mult>=2&&!s.hits&&!thr&&!bash;
      for(let i=0;i<hits;i++){const dir=((actor&&(HANIM.get(actor)||{}).atkN)|0)+i;
        if(thr)this.add({k:'thrust',x:o.x,y:o.y,a:a+(i%2?.06:-.06)*(hits>1?1:0),R:reach*1.25,d:.2,t0:now+i*iv,col});
        else if(bash)this.add({k:'bash',x:o.x,y:o.y,a,R:reach*.7,d:.24,t0:now+i*iv});
        else this.add({k:'slash',x:o.x,y:o.y,a,R:reach,ang:Math.max(.9,ang),dir:dir%2?-1:1,d:heavy?.24:.18,w:heavy?.42:W.wt==='polearm'?.3:.34,t0:now+i*iv,col,cross:s.id==='crossslash'})}
      if(s.id==='crossslash')this.add({k:'slash',x:o.x,y:o.y,a,R:reach,ang:1.6,dir:-1,d:.2,w:.3,t0:now+.08,col});
      pose(thr?'thrust':bash?'bash':heavy?'slam':W.wt==='polearm'?'sweep':'swing',Math.max(fast,hits>1?iv*hits+.1:0));
      if(s.taunt)this.add({k:'shout',x:o.x,y:o.y,R:reach*1.6,d:.4,col:'#ff8a6a'});return}
    if(k==='charge'){if(typeof PFX==='undefined'){const L=s.dist||240;this.chargeFx(o.x,o.y,o.x+Math.cos(a)*L,o.y+Math.sin(a)*L,s)}pose('bash',.45);return}
    if(k==='leap'){const p=t?clampRange(t,s.range||300):{x:o.x+Math.cos(a)*(s.range||300),y:o.y+Math.sin(a)*(s.range||300)};
      if(typeof PFX==='undefined')this.leapFx(o.x,o.y,p.x,p.y,s,W);pose('slam',.5);return}
    if(k==='trap'){pose('bash',.3);this.dust(t?t.x:o.x,t?t.y:o.y,4,40);return}
    if(k==='intervene'){pose('guard',.6);return}
    if(k==='nova'){if(s.mult>0&&s.wt){this.add({k:'spin',x:o.x,y:o.y,R:s.rad||120,d:.3,a,col,spear:W.wt==='polearm'});pose('spin',.32)}
      else{this.add({k:'shout',x:o.x,y:o.y,R:s.rad||220,d:.55,col:s.weaken?'#c8a0ff':s.taunt?'#ff8a6a':'#ffd76a',pull:!!s.pull});pose('shout',.6);
        if(s.mult>0){this.dust(o.x,o.y,14,s.rad||150);decals.push({crack:this.crack(o.x,o.y,(s.rad||150)*.55),life:3,max:3,w:10})}}return}
    if(k==='beam'){const L=s.len||400,x2=o.x+Math.cos(a)*L,y2=o.y+Math.sin(a)*L;
      const form=s.id==='wildrun'?'herd':war?(W.wt==='polearm'?'lance':'wave'):'giant';
      this.add({k:'beamp',form,x:o.x,y:o.y,x2,y2,a,w:s.w||40,d:form==='herd'?.7:.42,col});pose(war?(W.wt==='polearm'?'thrust':'slam'):'release',.4);
      if(form==='wave'){decals.push({crack:this.crackLine(o.x,o.y,x2,y2),life:3.5,max:3.5,w:s.w})}return}
    if(k==='chain'&&s.phys){// 기본 번개 대신: 던진 방패 / 튕기는 화살
      const segs=[];for(const b of bolts)if(b.gen===time&&!b._fxp&&b.col==='#fffbe0'){b._fxp=1;b.life=0;segs.push([b.a,b.b,b.delay||0])}
      if(segs.length)this.add({k:'toss',segs,d:.16*segs.length+.25,form:war?'shield':'arrow',back:war});pose(war?'swing':'release',.3);return}
    if(k==='bolt'){pose(s.cnt>4?'volley':'release',s.aspd?.22:.28);if(s.knock||s.mult>=4)this.add({k:'shout',x:o.x+Math.cos(a)*18,y:o.y+Math.sin(a)*18,R:60,d:.25,col:'#fff4d0'});return}
    if(k==='rain'){pose('volley',.5);return}
    if(k==='strike'){pose(war?'slam':'volley',.45);return}
    if(k==='blink'){this.add({k:'roll',x:o.x,y:o.y,a,d:.35});this.dust(o.x,o.y,8,70);return}
    if(k==='summon'){this.add({k:'shout',x:o.x,y:o.y,R:80,d:.4,col:'#c8e0a0'});pose('shout',.45);return}
    if(k==='field'){pose(war?'shout':'bash',.5);return}
    if(k==='buff'||k==='armor'||k==='ward'){pose(s.excl==='guard'?'guard':'shout',.55);if(s.party||s.taunt)this.add({k:'shout',x:o.x,y:o.y,R:s.party?Math.min(320,s.party*.6):160,d:.6,col:'#ffd76a'})}},
  crack(x,y,r){const pts=[];const M=this.rng;for(let i=0;i<=8;i++){const a=i/8*6.283+M()*.4;pts.push({x:x+Math.cos(a)*r*(.5+M()*.5),y:y+Math.sin(a)*r*(.5+M()*.5)})}return pts},
  crackLine(x1,y1,x2,y2){const pts=[];const M=this.rng;for(let i=0;i<=12;i++){const f=i/12;pts.push({x:x1+(x2-x1)*f+(M()-.5)*16,y:y1+(y2-y1)*f+(M()-.5)*16})}return pts},
  leapFx(ox,oy,x,y,s,W){W=W||{};const rad=s.rad||90;this.add({k:'leap',x:ox,y:oy,x2:x,y2:y,d:.42,rad,spear:W.wt==='polearm'});this.add({k:'land',x,y,rad,d:.5,t0:time+.3,el:s.el})},
  chargeFx(ox,oy,x,y,s){const L=Math.max(30,Math.hypot(x-ox,y-oy)),a=Math.atan2(y-oy,x-ox);this.add({k:'charge',x:ox,y:oy,a,L,w:s.w||40,d:.45});this.dust(ox,oy,8,90);this.dust(x,y,6,70)},
  // 덫이 터질 때 (CLS PFX.trap)
  trapBoom(tr){const s=tr.s||{},id=s.id||'',rad=s.rad||80,x=tr.x,y=tr.y,el=s.el;
    if(id==='beastcage'){this.add({k:'cagec',x,y,rad,d:Math.max(1.2,s.root||4)});this.dust(x,y,16,rad);rings.push({x,y,r:8,max:rad,life:.4,col:'#d4aa4c'});return}
    if(id==='snaretrap'){this.add({k:'snarec',x,y,d:Math.max(.8,s.root||2.5)});this.dust(x,y,6,50);return}
    const col=el==='fire'?'#ff7a2e':el==='ice'?'#8fd8ff':'#e8ecf2';rings.push({x,y,r:6,max:rad,life:.4,col});
    if(el==='fire'||el==='ice'){if(typeof FXR!=='undefined'&&FXR.spray)FXR.spray(x,y,8,EL[el],14,rad*2,3);this.add({k:'shout',x,y,R:rad,d:.4,col})}
    else{this.hitSpark(x,y,'#e8ecf2',14);this.dust(x,y,10,rad*1.2)}},
  /* ----- 매 프레임: 끝난 내려찍기(pend) 찾기 · 표식 ----- */
  tick(){for(const m of pend)if(m.s&&(m.s.phys||m.s.el==='phys')&&!this.seen.has(m))this.seen.set(m,{x:m.x,y:m.y,s:m.s});
    for(const [m,v] of this.seen)if(!pend.includes(m)){this.seen.delete(m);const s=v.s;
      this.add({k:'land',x:v.x,y:v.y,rad:s.rad||100,d:.5,el:s.el,claw:s.id==='apexhunt',spear:s.id==='heavycrash'});
      if(s.cls==='warrior')decals.push({crack:this.crack(v.x,v.y,(s.rad||100)*.6),life:4,max:4,w:12})}
    for(const r of rains)if(r.s&&r.s.phys&&!r._fxp){r._fxp=1;r._fn=0}},
  /* ----- 스프라이트 ----- */
  arrowSpr(col,big,el){return SC.get(`fxp/ar/${col}/${big}/${el||''}`,big?60:44,big?14:10,big?57:42,big?7:5,g=>{const L=big?60:44,h=big?14:10,cy=h/2,u=big?1.3:1;
      g.lineCap='round';g.strokeStyle='#5a3a1c';g.lineWidth=2.2*u;g.beginPath();g.moveTo(5*u,cy);g.lineTo(L-8*u,cy);g.stroke();g.strokeStyle='#c8a070';g.lineWidth=1*u;g.stroke();
      g.fillStyle=el?col:'#e8ecf2';g.beginPath();g.moveTo(L-1,cy);g.lineTo(L-9*u,cy-3*u);g.lineTo(L-7.4*u,cy);g.lineTo(L-9*u,cy+3*u);g.closePath();g.fill();g.strokeStyle='rgba(30,30,40,.6)';g.lineWidth=.5;g.stroke();
      g.fillStyle=el?Kit.lit(col,.4):'#f4efe2';for(const sd of [-1,1]){g.beginPath();g.moveTo(9*u,cy);g.lineTo(2*u,cy+sd*3.4*u);g.lineTo(6*u,cy+sd*3.4*u);g.lineTo(13*u,cy);g.closePath();g.fill()}},{force:1})},
  starSpr(col){return SC.get(`fxp/st/${col}`,40,40,20,20,g=>{g.translate(20,20);g.fillStyle=col;g.beginPath();for(let i=0;i<16;i++){const a=i/16*6.283,r=i%2?4:19-(i%4)*4;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.fillStyle='#fff';g.beginPath();g.arc(0,0,4,0,6.283);g.fill()},{force:1})},
  shieldSpr(){return SC.get('fxp/shield',26,30,13,15,g=>{g.translate(13,15);const sh=q=>{q.moveTo(-10,-12);q.quadraticCurveTo(0,-14,10,-12);q.lineTo(10,-2);q.bezierCurveTo(10,7,5,11,0,14);q.bezierCurveTo(-5,11,-10,7,-10,-2);q.closePath()};
      Kit.solid(g,sh,-10,-12,10,14,'#8a2a24',{tex:'cloth',texA:.3,rim:'rgba(255,230,210,.8)',lineW:.8});g.strokeStyle='#d4aa4c';g.lineWidth=1.6;g.beginPath();sh(g);g.stroke();
      Kit.solid(g,q=>q.arc(0,-3,3,0,6.283),-3,-6,3,0,'#d8dde6',{lineW:.5})},{force:1})},
  // 덫 (땅에 눕힌 모양, 세로 0.55배). type: snare|fire|frost|shrapnel|cage · on: 켜짐
  trapSpr(type,on){return SC.get(`fxp/tr/${type}/${+on||0}`,type==='cage'?96:56,type==='cage'?80:34,type==='cage'?48:28,type==='cage'?58:20,g=>{
      const C=type==='cage';g.translate(C?48:28,C?58:20);
      if(C){g.save();g.scale(1,.55);g.strokeStyle='#5a3a1c';g.lineWidth=4;g.beginPath();g.arc(0,0,38,0,6.283);g.stroke();g.strokeStyle='#a8763e';g.lineWidth=2;g.stroke();g.restore();
        if(on===2){for(let i=0;i<12;i++){const a=i/12*6.283,x=Math.cos(a)*38,y=Math.sin(a)*38*.55;g.strokeStyle='#5a3a1c';g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x*.82,y-40+Math.abs(x)*.25);g.stroke();g.strokeStyle='#b8864a';g.lineWidth=1.4;g.stroke()}
          g.strokeStyle='#8a5a2a';g.lineWidth=2;g.beginPath();g.ellipse(0,-40,30,8,0,0,6.283);g.stroke()}
        else if(on){g.fillStyle='#dfe3ea';for(let i=0;i<16;i++){const a=i/16*6.283,x=Math.cos(a)*36,y=Math.sin(a)*36*.55;g.beginPath();g.moveTo(x-2.2,y);g.lineTo(x*.84,y*.84-3);g.lineTo(x+2.2,y);g.closePath();g.fill()}}
        else{g.strokeStyle='rgba(200,170,110,.7)';g.setLineDash([4,4]);g.lineWidth=1.2;g.beginPath();g.ellipse(0,0,30,16,0,0,6.283);g.stroke();g.setLineDash([])}
        g.fillStyle='#d4aa4c';for(let i=0;i<4;i++){const a=i/4*6.283+.4;g.beginPath();g.arc(Math.cos(a)*38,Math.sin(a)*38*.55,2.4,0,6.283);g.fill()}return}
      if(type==='snare'&&on===2){g.strokeStyle='#6a5030';g.lineWidth=2.6;g.beginPath();g.ellipse(0,-6,8,4,0,0,6.283);g.stroke();g.strokeStyle='#d8b878';g.lineWidth=1.3;g.stroke();g.beginPath();g.moveTo(6,-8);g.quadraticCurveTo(14,-14,16,-19);g.stroke();Kit.solid(g,q=>q.rect(-2,-10,4,10),-2,-10,2,0,'#7a5a30',{tex:'wood',lineW:.5});return}
      if(type==='snare'){g.strokeStyle='#6a5030';g.lineWidth=2.6;g.beginPath();g.ellipse(0,0,15,7,0,0,6.283);g.stroke();g.strokeStyle='#d8b878';g.lineWidth=1.3;g.stroke();
        g.strokeStyle='#d8b878';g.lineWidth=1.2;g.beginPath();g.moveTo(14,-1);g.quadraticCurveTo(22,-6,24,-14);g.stroke();Kit.solid(g,q=>q.rect(-2,-10,4,10),-2,-10,2,0,'#7a5a30',{tex:'wood',lineW:.5});return}
      const plate=type==='shrapnel'?'#6a6a72':'#4a4a52';
      g.save();g.scale(1,.55);Kit.solid(g,q=>q.arc(0,0,18,0,6.283),-18,-18,18,18,plate,{tex:'metal',texA:.5,lineW:.8});
      g.strokeStyle=type==='fire'?'#ff7a2e':type==='frost'?'#8fd8ff':'#c8ccd4';g.lineWidth=2;g.beginPath();g.arc(0,0,12,0,6.283);g.stroke();g.restore();
      // 이빨
      g.fillStyle='#dfe3ea';for(let i=0;i<10;i++){const a=i/10*6.283,x=Math.cos(a)*15,y=Math.sin(a)*15*.55;g.beginPath();g.moveTo(x-2,y);g.lineTo(x*.8,y*.8-(on?4:2.4));g.lineTo(x+2,y);g.closePath();g.fill()}
      if(type==='shrapnel'){g.fillStyle='#e8ecf2';for(let i=0;i<6;i++){const a=i/6*6.283+.3;g.beginPath();g.moveTo(Math.cos(a)*6,Math.sin(a)*3.3-1);g.lineTo(Math.cos(a)*9,Math.sin(a)*5-5);g.lineTo(Math.cos(a)*10,Math.sin(a)*5);g.closePath();g.fill()}}
      const gc=type==='fire'?'#ff7a2e':type==='frost'?'#8fd8ff':'#ffd76a';g.fillStyle=on?gc:'#5a5a60';g.beginPath();g.arc(0,0,3,0,6.283);g.fill();if(on){g.fillStyle='#fff';g.beginPath();g.arc(-.8,-.8,1,0,6.283);g.fill()}},{force:1})},
  bannerSpr(col,f){return SC.get(`fxp/bn/${col}/${f}`,44,90,6,86,g=>{g.translate(6,86);
      Kit.solid(g,q=>q.rect(-1.6,-84,3.2,84),-2,-84,2,0,'#6a4a2c',{tex:'wood',texA:.6,lineW:.5});Kit.solid(g,q=>q.arc(0,-86,2.6,0,6.283),-3,-89,3,-83,'#d4aa4c',{lineW:.5});
      const w=k=>Math.sin(f*1.57+k*3.2)*2.6;
      const fl=q=>{q.moveTo(1.6,-80);for(let i=0;i<=6;i++)q.lineTo(1.6+i*5.4,-80+w(i/6)*(i/6));q.lineTo(34,-62+w(1));q.lineTo(28,-54+w(.85));for(let i=6;i>=0;i--)q.lineTo(1.6+i*5.4*(i===6?.85:1),-52+w(i/6)*(i/6)+(i===6?-2:0));q.closePath()};
      Kit.solid(g,fl,2,-82,34,-50,col,{tex:'cloth',texA:.45,rim:'rgba(255,230,210,.6)',lineW:.8});
      g.strokeStyle='#d4aa4c';g.lineWidth=1.2;g.beginPath();fl(g);g.stroke();
      g.fillStyle='#d4aa4c';g.beginPath();const cx=17,cy=-66+w(.5)*.5;for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?2.4:5.4;g.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}g.closePath();g.fill()},{force:1})},
  // 표식(과녁) · 도발(성난 표시)
  markSpr(){return SC.get('fxp/mark',36,36,18,18,g=>{g.translate(18,18);g.strokeStyle='#ff5a4a';g.lineWidth=2;g.beginPath();g.arc(0,0,13,0,6.283);g.stroke();g.lineWidth=1.4;g.beginPath();g.arc(0,0,7,0,6.283);g.stroke();
      g.lineWidth=2;g.beginPath();for(const [x,y] of [[0,-1],[0,1],[-1,0],[1,0]]){g.moveTo(x*10,y*10);g.lineTo(x*17,y*17)}g.stroke();g.fillStyle='#ffd0c0';g.beginPath();g.arc(0,0,2,0,6.283);g.fill()},{force:1})},
  tauntSpr(){return SC.get('fxp/taunt',28,28,14,24,g=>{g.translate(14,24);Kit.solid(g,q=>{q.moveTo(-3.6,-21);q.lineTo(3.6,-21);q.lineTo(1.8,-7);q.lineTo(-1.8,-7);q.closePath()},-4,-21,4,-7,'#ff4a3a',{rim:'rgba(255,230,210,.9)',lineW:.8});
      Kit.solid(g,q=>q.arc(0,-2.6,2.8,0,6.283),-3,-5,3,0,'#ff4a3a',{lineW:.8});
      g.strokeStyle='#ffd76a';g.lineWidth=1.6;g.lineCap='round';for(const sd of [-1,1]){g.beginPath();g.moveTo(sd*7,-19);g.lineTo(sd*10,-22);g.moveTo(sd*7.5,-14);g.lineTo(sd*11.5,-14);g.stroke()}},{force:1})},
  // 매 (오른쪽을 본다) f: 날갯짓 0~2
  falconSpr(f){return SC.get(`fxp/fa/${f}`,48,36,24,18,g=>{g.translate(24,18);const wy=[-12,-2,7][f],col='#9a7448';
      const wing=sd=>{g.beginPath();g.moveTo(-2,0);g.bezierCurveTo(-6,wy*.6-2*sd,-14,wy-1,-20,wy+(f===2?2:0));g.lineTo(-14,wy*.7+3);g.lineTo(-17,wy*.6+5);g.lineTo(-9,wy*.4+5);g.lineTo(2,3);g.closePath()};
      g.save();g.globalAlpha=.85;g.translate(4,-1);wing(-1);g.fillStyle=Kit.lit(col,-.3);g.fill();g.restore();
      Kit.solid(g,q=>{q.moveTo(12,-2);q.quadraticCurveTo(6,-6,-6,-2);q.lineTo(-14,1);q.lineTo(-17,4);q.lineTo(-12,4);q.lineTo(-4,4);q.quadraticCurveTo(6,5,12,1);q.closePath()},-17,-6,12,5,col,{tex:'leather',texA:.3,rim:'rgba(255,240,214,.7)',lineW:.7});
      Kit.solid(g,q=>q.arc(12,-3,3.6,0,6.283),8,-7,16,1,Kit.lit(col,.1),{lineW:.6});g.fillStyle='#f0e8d0';g.beginPath();g.ellipse(9,-.5,4,2,0,0,6.283);g.fill();
      g.fillStyle='#e8c35a';g.beginPath();g.moveTo(15,-3);g.lineTo(19,-1.6);g.lineTo(15,-.6);g.closePath();g.fill();g.fillStyle='#1a1008';g.beginPath();g.arc(13.4,-4,.9,0,6.283);g.fill();
      wing(1);g.fillStyle=col;g.fill();g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(col,-.7)),.8);g.lineWidth=.7;g.stroke();
      g.strokeStyle='rgba(255,240,214,.5)';g.lineWidth=.5;for(let i=1;i<4;i++){g.beginPath();g.moveTo(-2-i*3,wy*.25*i/2+2);g.lineTo(-6-i*4,wy*.6+i);g.stroke()}},{force:1})},
  // 늑대 (오른쪽을 본다) f: 달리기 0~3
  wolfSpr(f){return SC.get(`fxp/wo/${f}`,60,40,30,36,g=>{g.translate(30,36);const col='#8a8478',ph=f*Math.PI/2,lg=(o,x)=>{const a=Math.sin(ph+o)*.55;g.save();g.translate(x,-14);g.rotate(a);Kit.solid(g,q=>{q.moveTo(-2,0);q.lineTo(2,0);q.lineTo(1.4,13);q.lineTo(-1.6,13);q.closePath()},-2,0,2,13,Kit.lit(col,o?-.25:0),{lineW:.6});g.restore()};
      lg(Math.PI,-11);lg(0,10);
      const by=-Math.abs(Math.sin(ph))*1.6;
      Kit.solid(g,q=>{q.moveTo(-16,-16+by);q.quadraticCurveTo(-4,-24+by,10,-20+by);q.quadraticCurveTo(15,-16+by,13,-11+by);q.quadraticCurveTo(0,-8+by,-15,-11+by);q.closePath()},-16,-24,15,-8,col,{tex:'leather',texA:.4,rim:'rgba(255,240,214,.7)',lineW:.7});
      Kit.solid(g,q=>{q.moveTo(-15,-15+by);q.quadraticCurveTo(-24,-20+by-Math.sin(ph)*2,-27,-14+by);q.quadraticCurveTo(-22,-13+by,-15,-12+by);q.closePath()},-27,-21,-15,-12,Kit.lit(col,-.15),{lineW:.6});
      Kit.solid(g,q=>{q.moveTo(8,-21+by);q.lineTo(12,-27+by);q.lineTo(14,-22+by);q.lineTo(22,-19+by);q.quadraticCurveTo(23,-16+by,19,-15+by);q.lineTo(11,-13+by);q.closePath()},8,-27,23,-13,Kit.lit(col,.08),{lineW:.6});
      g.fillStyle='#ffd040';g.beginPath();g.arc(15.4,-20+by,1,0,6.283);g.fill();g.fillStyle='#1a1410';g.beginPath();g.arc(22.4,-17.6+by,1,0,6.283);g.fill();
      lg(Math.PI*.5,-13);lg(Math.PI*1.5,8)},{force:1})},
  /* ----- 그리기 ----- */
  P3(x,y,z,map){const s=map(x,y);return{x:s.x,y:s.y-(z||0)}},
  ribbon(c,map,cx,cy,z,R,a0,a1,w,col,al){const n=12;c.beginPath();for(let i=0;i<=n;i++){const f=i/n,a=a0+(a1-a0)*f,p=this.P3(cx+Math.cos(a)*R,cy+Math.sin(a)*R,z+f*4,map);c[i?'lineTo':'moveTo'](p.x,p.y)}
    for(let i=n;i>=0;i--){const f=i/n,a=a0+(a1-a0)*f,r=R*(1-w*Math.pow(f,.8)),p=this.P3(cx+Math.cos(a)*r,cy+Math.sin(a)*r,z+f*2,map);c.lineTo(p.x,p.y)}
    c.closePath();c.globalAlpha=al*.55;c.fillStyle=col;c.fill();c.globalAlpha=al;c.strokeStyle='#fff';c.lineWidth=1.4;c.beginPath();for(let i=Math.floor(n*.35);i<=n;i++){const f=i/n,a=a0+(a1-a0)*f,p=this.P3(cx+Math.cos(a)*R,cy+Math.sin(a)*R,z+f*4,map);c[i>Math.floor(n*.35)?'lineTo':'moveTo'](p.x,p.y)}c.stroke()},
  drawOne(c,f,u,map,now){const lo=Q.lvl===0;
    switch(f.k){
    case'slash':{const span=f.ang*1.15,h0=f.a-f.dir*span/2,h1=f.a+f.dir*span/2,e=1-Math.pow(1-Math.min(1,u*1.6),2),head=h0+(h1-h0)*e,tail=h0+(h1-h0)*Math.max(0,e-.8-(u>.5?-(u-.5)*1.4:0));
      this.ribbon(c,map,f.x,f.y,22,f.R,tail,head,f.w,f.col==='#e8e4d8'?'#dfe8ff':f.col,Math.max(0,1-Math.pow(u,2.2)));
      if(f.cross&&u<.6)this.ribbon(c,map,f.x,f.y,30,f.R*.85,tail+.3,head+.3,f.w*.8,'#ffffff',.5*(1-u));break}
    case'thrust':{const e=Math.min(1,u*2.4),L=f.R*e,a=f.a,ca=Math.cos(a),sa=Math.sin(a),A=this.P3(f.x+ca*14,f.y+sa*14,20,map),B=this.P3(f.x+ca*L,f.y+sa*L,20,map),al=1-u;
      const nx=-(B.y-A.y),ny=B.x-A.x,nl=Math.hypot(nx,ny)||1,w=7*(1-u*.5);c.globalAlpha=al*.5;c.fillStyle=f.col==='#e8e4d8'?'#dfe8ff':f.col;c.beginPath();c.moveTo(A.x+nx/nl*w,A.y+ny/nl*w);c.lineTo(B.x,B.y);c.lineTo(A.x-nx/nl*w,A.y-ny/nl*w);c.closePath();c.fill();
      c.globalAlpha=al;c.strokeStyle='#fff';c.lineWidth=1.6;c.beginPath();c.moveTo(A.x,A.y);c.lineTo(B.x,B.y);c.stroke();
      if(!lo)for(let i=-1;i<=1;i+=2){c.globalAlpha=al*.6;c.lineWidth=1;c.beginPath();c.moveTo(A.x+nx/nl*w*1.8*i,A.y+ny/nl*w*1.8*i);c.lineTo(A.x+(B.x-A.x)*.7+nx/nl*w*1.2*i,A.y+(B.y-A.y)*.7+ny/nl*w*1.2*i);c.stroke()}
      if(u<.35){const st=this.starSpr('#fff4d0'),r=8+u*20;c.globalAlpha=1-u/.35;c.drawImage(st.cv,B.x-r,B.y-r,r*2,r*2)}break}
    case'bash':{const a=f.a,p=this.P3(f.x+Math.cos(a)*f.R,f.y+Math.sin(a)*f.R,18,map),sh=this.shieldSpr(),k=1+u*.5;c.globalAlpha=(1-u)*.8;c.drawImage(sh.cv,p.x-13*k,p.y-15*k,26*k,30*k);
      const st=this.starSpr('#ffd76a'),r=10+u*26;c.globalAlpha=1-u;c.drawImage(st.cv,p.x-r,p.y-r,r*2,r*2);break}
    case'spin':{const a0=f.a+u*6.283*1.2;this.ribbon(c,map,f.x,f.y,20,f.R*.92,a0-3.4,a0,f.spear?.22:.3,f.col==='#e8e4d8'?'#dfe8ff':f.col,1-u);if(!lo)this.ribbon(c,map,f.x,f.y,26,f.R*.7,a0+3.14-2.2,a0+3.14,.25,'#ffffff',(1-u)*.5);break}
    case'shout':{const rg=FXR.ring(f.col),s=map(f.x,f.y);for(let i=0;i<3;i++){const b=Math.max(0,Math.min(1,u*1.3-i*.18)),R=f.R*(f.pull?1-b*.85:b);if(b<=0||b>=1)continue;c.globalAlpha=(1-b)*.85;c.drawImage(rg.cv,s.x-R,s.y-R*.5,R*2,R)}break}
    case'charge':{const e=Math.min(1,u*1.6),ca=Math.cos(f.a),sa=Math.sin(f.a),L=f.L*e,al=1-u;
      for(let i=-1;i<=1;i++){const ox=-sa*f.w*.5*i,oy=ca*f.w*.5*i,A=this.P3(f.x+ox,f.y+oy,8+Math.abs(i)*8,map),B=this.P3(f.x+ox+ca*L,f.y+oy+sa*L,8+Math.abs(i)*8,map);c.globalAlpha=al*(i?.45:.7);c.strokeStyle=i?'#fff4d0':'#ffd76a';c.lineWidth=i?1.2:3;c.beginPath();c.moveTo(A.x,A.y);c.lineTo(B.x,B.y);c.stroke()}
      const sh=this.shieldSpr();for(let j=1;j<=3;j++){const q=Math.max(0,e-j*.18),p=this.P3(f.x+ca*f.L*q,f.y+sa*f.L*q,22,map);c.globalAlpha=al*(.5-j*.12);c.drawImage(sh.cv,p.x-13,p.y-15,26,30)}break}
    case'leap':{const n=14,e=Math.min(1,u*1.25);c.globalAlpha=.75*(1-u*.6);c.strokeStyle='#fff4d0';c.lineWidth=2;c.beginPath();
      for(let i=0;i<=n;i++){const q=i/n*e,p=this.P3(f.x+(f.x2-f.x)*q,f.y+(f.y2-f.y)*q,Math.sin(q*Math.PI)*90,map);c[i?'lineTo':'moveTo'](p.x,p.y)}c.stroke();
      if(!lo){c.globalAlpha=.4*(1-u);c.lineWidth=6;c.strokeStyle=f.spear?'#dfe8ff':'#ffd76a';c.stroke()}break}
    case'land':{if(!f.done){f.done=1;rings.push({x:f.x,y:f.y,r:8,max:f.rad*1.1,life:.45,col:'#ffd76a'});this.dust(f.x,f.y,18,f.rad*1.4);if(f.el&&f.el!=='phys')FXR.spray(f.x,f.y,6,EL[f.el],12,f.rad*2,3)}
      const st=this.starSpr(f.claw?'#ff5a4a':'#fff4d0'),s=map(f.x,f.y),r=f.rad*.5*(.5+u);c.globalAlpha=(1-u)*.9;c.drawImage(st.cv,s.x-r,s.y-r*.55,r*2,r*1.1);
      if(f.claw&&u<.7){c.strokeStyle='#ff6a5a';c.lineWidth=3;c.globalAlpha=1-u/.7;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(s.x-22+i*10,s.y-46);c.quadraticCurveTo(s.x+i*10,s.y-20,s.x+18+i*10,s.y+4);c.stroke()}}break}
    case'beamp':{const e=Math.min(1,u*2),ca=Math.cos(f.a),sa=Math.sin(f.a),L=Math.hypot(f.x2-f.x,f.y2-f.y),al=1-u;
      if(f.form==='wave'){const q=e*L,cx=f.x+ca*q,cy=f.y+sa*q;this.ribbon(c,map,cx-ca*30,cy-sa*30,10,f.w*1.1+20,f.a-1,f.a+1,.45,'#dfe8ff',al)}
      else if(f.form==='lance'){const A=this.P3(f.x,f.y,20,map),B=this.P3(f.x+ca*L*e,f.y+sa*L*e,20,map);c.globalAlpha=al*.22;c.strokeStyle='#dfe8ff';c.lineWidth=f.w*.45;c.beginPath();c.moveTo(A.x,A.y);c.lineTo(B.x,B.y);c.stroke();c.globalAlpha=al;c.strokeStyle='#fff';c.lineWidth=2;c.stroke();
        const st=this.starSpr('#fff4d0'),r=14+f.w*.4;c.globalAlpha=al;c.drawImage(st.cv,B.x-r,B.y-r,r*2,r*2)}
      else if(f.form==='giant'){const q=e*L,p=this.P3(f.x+ca*q,f.y+sa*q,20,map),s0=this.P3(f.x,f.y,20,map),ang=Math.atan2(p.y-s0.y,p.x-s0.x),ar=this.arrowSpr('#ffd76a',1,0);
        c.globalAlpha=al*.4;c.strokeStyle='#fff4d0';c.lineWidth=f.w*.6;c.beginPath();c.moveTo(s0.x,s0.y);c.lineTo(p.x,p.y);c.stroke();
        c.globalAlpha=Math.min(1,al*1.5);c.save();c.translate(p.x,p.y);c.rotate(ang);c.scale(1.6,1.6);c.drawImage(ar.cv,-ar.ax,-ar.ay,ar.w,ar.h);c.restore()}
      else{// 짐승 떼: 늑대 그림자들이 길을 따라 달린다
        for(let i=0;i<5;i++){const q=Math.min(1,e*1.1-i*.08);if(q<=0)continue;const side=(i%2?1:-1)*(i>>1)*f.w*.22,p=this.P3(f.x+ca*L*q-sa*side,f.y+sa*L*q+ca*side,0,map),fl=Math.cos(Math.atan2(p.y-map(f.x,f.y).y,p.x-map(f.x,f.y).x))<0,w=this.wolfSpr(((now*12+i)|0)%4);
          c.globalCompositeOperation='source-over';c.globalAlpha=al*.85;c.save();c.translate(p.x,p.y);if(fl)c.scale(-1,1);c.drawImage(w.cv,-w.ax,-w.ay,w.w,w.h);c.restore();c.globalCompositeOperation='lighter'}
        if(!lo&&u<.8)this.dust(f.x+ca*L*e,f.y+sa*L*e,2,60)}
      break}
    case'toss':{const T=f.d-.25,q=u*f.d/(T/f.segs.length);let i=Math.min(f.segs.length-1,Math.floor(q)),fr=Math.min(1,q-i);if(u*f.d>T){i=f.segs.length-1;fr=1}
      const [A,B]=f.segs[i],x=A.x+(B.x-A.x)*fr,y=A.y+(B.y-A.y)*fr,z=(A.z||16)+((B.z||16)-(A.z||16))*fr,p=this.P3(x,y,z,map);
      c.globalCompositeOperation='source-over';c.globalAlpha=1;
      if(f.form==='shield'){const sh=this.shieldSpr();c.save();c.translate(p.x,p.y);c.rotate(now*18);c.scale(1,.7);c.drawImage(sh.cv,-13,-15,26,30);c.restore()}
      else{const a=this.P3(A.x,A.y,A.z||16,map),b=this.P3(B.x,B.y,B.z||16,map),ar=this.arrowSpr('#e8ecf2',0,0);c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(b.y-a.y,b.x-a.x));c.drawImage(ar.cv,-ar.ax,-ar.ay,ar.w,ar.h);c.restore()}
      c.globalCompositeOperation='lighter';if(fr>.9&&!f['h'+i]){f['h'+i]=1;this.hitSpark(B.x,B.y,'#fff4d0',5)}break}
    case'roll':{const s=map(f.x,f.y);c.globalAlpha=(1-u)*.6;c.strokeStyle='#d8e8c8';c.lineWidth=2;for(let i=0;i<3;i++){c.beginPath();c.ellipse(s.x,s.y-16,14+i*4+u*10,10+i*2,0,0,6.283*.6);c.stroke()}break}
    case'star':{const st=this.starSpr(f.col),s=map(f.x,f.y),r=8+u*12;c.globalAlpha=1-u;c.drawImage(st.cv,s.x-r,s.y-f.z-r,r*2,r*2);break}
    case'cagec':case'snarec':{const cg=f.k==='cagec',sp=this.trapSpr(cg?'cage':'snare',2),p=map(f.x,f.y),kk=cg?Math.max(1,Math.min(1.6,f.rad/180)):1.2,sh=Math.min(1,u*f.d/.15);
      c.globalCompositeOperation='source-over';c.globalAlpha=Math.min(1,(1-u)*f.d/.4);c.drawImage(sp.cv,p.x-sp.ax*kk,p.y-sp.ay*kk*sh,sp.w*kk,sp.h*kk*sh);c.globalCompositeOperation='lighter';break}
    case'blockfx':{const sh=this.shieldSpr(),s=map(f.x,f.y),k=1.1+u*.6;c.globalAlpha=(1-u)*.7;c.drawImage(sh.cv,s.x-13*k,s.y-34-15*k,26*k,30*k);break}
    case'evadefx':{const s=map(f.x,f.y);c.globalAlpha=(1-u)*.6;c.strokeStyle='#bff0c0';c.lineWidth=1.6;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(s.x-18-u*16,s.y-28+i*8);c.lineTo(s.x-6-u*10,s.y-28+i*8);c.stroke()}break}
    }},
  // 효과 위(가산 혼합) : b4.js FXB.draw 다음
  draw(c,map,now){now=now==null?time:now;this.tick();
    if(this.fx.length){let dead=0;for(const f of this.fx){const u=(now-f.t0)/f.d;if(u<0)continue;if(u>=1){dead++;continue}this.drawOne(c,f,u,map,now)}
      if(dead)this.fx=this.fx.filter(f=>(now-f.t0)/f.d<1)}
    // 하늘에서 쏟아지는 화살 (물리 화살비)
    for(const r of rains){if(!r.s||!(r.s.phys||r.s.wt==='bow'))continue;const n=Q.lvl===0?4:8,s0=map(r.x,r.y);
      for(let i=0;i<n;i++){const ph=(now*2.4+i/n+(r._ph||(r._ph=this.rng())))%1,a=hash(i,(now*2.4+i/n)|0)*6.283,d=Math.sqrt(hash(i+7,(now*2.4+i/n)|0))*r.rad,
          p=this.P3(r.x+Math.cos(a)*d,r.y+Math.sin(a)*d,(1-ph)*260,map),ar=this.arrowSpr('#e8ecf2',0,0);
        c.globalAlpha=Math.min(1,ph*4)*.9;c.save();c.translate(p.x,p.y);c.rotate(1.35);c.drawImage(ar.cv,-ar.ax,-ar.ay,ar.w,ar.h);c.restore()}}
    // 대신 맞기 끈
    if(typeof NET!=='undefined'&&NET.on&&typeof netSame==='function'){const L=[];if(P.lnkOut){const r=NET.peers.get(P.lnkOut.id);if(r&&netSame(r))L.push([P,r])}
      for(const r of NET.peers.values())if(r.lk&&netSame(r)){const o=r.lk===NET.id?P:NET.peers.get(r.lk);if(o)L.push([r,o])}
      for(const [h,o] of L){const a=this.P3(h.x,h.y,30,map),b=this.P3(o.x,o.y,30,map),pu=.6+Math.sin(now*6)*.25;
      c.globalAlpha=pu*.35;c.strokeStyle='#9fc8ff';c.lineWidth=5;c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2-20,b.x,b.y);c.stroke();c.globalAlpha=pu;c.strokeStyle='#e8f4ff';c.lineWidth=1.2;c.setLineDash([5,4]);c.lineDashOffset=-now*30;c.stroke();c.setLineDash([])}}
    // 적 머리 위: 도발 · 표식 (그림 그대로)
    c.globalCompositeOperation='source-over';
    for(const e of enemies){if(e.dead||!e._s)continue;const tn=e.tauntT>0||e.taunted>0,mk=e.markT>0||(e.mark&&e.mark.t>0);if(!tn&&!mk)continue;
      const sc=e.sc||(e.elite?1.25:1),s=e._s,top=s.y-e.r*sc*2.4-18;
      if(mk){const m=this.markSpr(),r=13+Math.sin(now*5)*1.5;c.globalAlpha=.85;c.save();c.translate(s.x,s.y-e.r*sc*.4);c.scale(1.4,.7);c.rotate(now*1.2);c.drawImage(m.cv,-r,-r,r*2,r*2);c.restore()}
      if(tn){const tt=this.tauntSpr(),b=Math.abs(Math.sin(now*6))*3;c.globalAlpha=1;c.drawImage(tt.cv,s.x-14+(mk?10:0),top-b-6,28,28)}}
    c.globalAlpha=1;c.globalCompositeOperation='lighter'},
  linkTo(h,range){if(typeof NET==='undefined'||!NET.on)return null;let b=null,bd=range||300;const me=h===P||h.remote?h:P;
    const cand=h.remote?[P]:[...NET.peers.values()];for(const r of cand){if(!r||r===h||r.dead)continue;const d=dist(r,h);if(d<bd){bd=d;b=r}}return b},
  // 땅 위(몸보다 먼저): 덫 · 깃발 · 마름쇠
  ground(c,map,now){now=now==null?time:now;
    const TR=typeof traps!=='undefined'&&Array.isArray(traps)?traps:null;if(TR)for(const tr of TR)this.drawTrap(c,tr,map,now);
    for(const f of fields){if(!f.s)continue;const id=f.s.id,role=f.s.role;
      if(role==='banner'||role==='zone'){const s=map(f.x,f.y),b=this.bannerSpr(role==='zone'?'#3a5a9a':'#8a2a24',((now*5)|0)%4),fade=Math.min(1,f.t*3,(f.max-f.t)*6);c.globalAlpha=fade;c.drawImage(b.cv,s.x-b.ax,s.y-b.ay,b.w,b.h)}
      else if(id==='caltrops'){const n=Q.lvl===0?7:12,fade=Math.min(1,f.t*3);c.globalAlpha=fade;c.fillStyle='#c8ccd4';c.strokeStyle='#4a4a52';c.lineWidth=.8;
        for(let i=0;i<n;i++){const a=hash(i,3)*6.283,d=Math.sqrt(hash(i,5))*f.rad*.9,s=map(f.x+Math.cos(a)*d,f.y+Math.sin(a)*d);c.beginPath();c.moveTo(s.x,s.y-5);c.lineTo(s.x+3.4,s.y+1.6);c.lineTo(s.x-3.4,s.y+1.6);c.closePath();c.fill();c.stroke()}}}
    c.globalAlpha=1},
  // 덫 하나 그리기 (규칙 쪽 덫 객체: {x,y,s,arm(남은 준비 시간),t/life(남은 수명)} — 이름이 달라도 s.id·s.el만 있으면 된다)
  drawTrap(c,tr,map,now){now=now==null?time:now;const s=tr.s||{},id=s.id||'',type=id==='beastcage'?'cage':id==='snaretrap'?'snare':s.el==='fire'||id==='firetrap'?'fire':s.el==='ice'||id==='frosttrap'?'frost':'shrapnel';
    const on=tr.age!=null?tr.age>=tr.arm:(tr.arm!=null?tr.arm:tr.armT||0)<=0,sp=this.trapSpr(type,on),p=map(tr.x,tr.y),life=tr.t!=null?tr.t:tr.life!=null?tr.life:9;
    const kk=type==='cage'?Math.max(1,Math.min(1.6,(s.rad||220)/180)):Math.max(1,Math.min(1.8,(s.rad||70)/55));c.globalAlpha=Math.min(1,life*2)*(on?1:.6+.2*Math.sin(now*12));c.drawImage(sp.cv,p.x-sp.ax*kk,p.y-sp.ay*kk,sp.w*kk,sp.h*kk);
    if(on&&type!=='cage'&&type!=='snare'){const gc=type==='fire'?'#ff7a2e':type==='frost'?'#8fd8ff':'#ffd76a';c.globalCompositeOperation='lighter';c.globalAlpha=.35+.25*Math.sin(now*4+tr.x);c.drawImage(Kit.glowCv(gc),p.x-14*kk,p.y-10*kk,28*kk,16*kk);c.globalCompositeOperation='source-over'}
    c.globalAlpha=1},
  // 사냥 동료 (r5.js drawAlly 앞에서) — 그렸으면 true
  pet(a,s){const fm=a.s&&a.s.form;if(fm!=='falcon'&&fm!=='wolf')return false;if(!onScreen(s,90))return true;
    const mv=a._px!=null?Math.hypot(a.x-a._px,a.y-a._py)>.4:false;a._px=a.x;a._py=a.y;const fl=(a.fx||1)<0;ctx.save();ctx.translate(s.x,s.y);
    if(fm==='falcon'){const dive=a.lunge>0?Math.min(1,a.lunge/.2):0,h=46+Math.sin(time*3+a.x*.01)*5-dive*30;Kit.shadow(ctx,0,2,12,4,.6);
      const fr=dive>0?2:((time*9+a.x)|0)%3,sp=this.falconSpr(fr===2&&!dive?1:fr);ctx.save();ctx.translate(0,-h);ctx.scale(fl?-1.45:1.45,1.45);if(dive)ctx.rotate(.5*dive);ctx.drawImage(sp.cv,-sp.ax,-sp.ay,sp.w,sp.h);ctx.restore();
      if(a.hurt>0)hurtFlash(0,-h,18,.5);this.petBar(a,-h-22)}
    else{Kit.shadow(ctx,0,1,22,6,.8);const run=mv||a.lunge>0,fr=run?((time*12)|0)%4:0,sp=this.wolfSpr(fr),lu=a.lunge>0?6:0;ctx.save();if(fl)ctx.scale(-1,1);ctx.translate(lu,run?0:Math.sin(time*2)*.6);ctx.drawImage(sp.cv,-sp.ax,-sp.ay,sp.w,sp.h);ctx.restore();
      if(a.hurt>0)hurtFlash(0,-18,24,.5);this.petBar(a,-46)}
    ctx.restore();return true},
  petBar(a,y){const w=30;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(-w/2-1,y-1,w+2,5);ctx.fillStyle='#6ad06a';ctx.fillRect(-w/2,y,w*clamp(a.hp/a.max,0,1),3);ctx.fillStyle='#c9a46a';ctx.fillRect(-w/2,y+4,w*clamp(a.t/a.s.dur,0,1),1.5)},
  /* ----- 화살 (FXR.draw 감싸기): 물리 투사체는 화살 그림. 원소 화살은 fxrank 위계 그림 위에 화살을 얹는다 ----- */
  arrow(c,p,s,k,ox,oy,map){const sp=p.s,el=sp.el&&sp.el!=='phys'?sp.el:null,ang=p._ang!=null?p._ang:Math.atan2((p.vx+p.vy)*KI/2,(p.vx-p.vy)*KI),z=p.z||0,
      big=sp.mult>=4||sp.id==='fulldraw'||sp.id==='siegeshot'?1:0,pierce=sp.pierce||p.hit,col=el?EL[el]:'#fff4d0';
    if(el)FXR_draw0.call(FXR,c,p,s,k,ox,oy,map);
    const tr=p.tr;if(tr&&tr.length>1){const n=Math.min(tr.length,pierce||big?9:5),i0=tr.length-n;let a=map(tr[i0].x,tr[i0].y);c.strokeStyle=el?col:'#e8ecf8';
      for(let i=i0+1;i<tr.length;i++){const b=map(tr[i].x,tr[i].y),q=(i-i0)/n;c.globalAlpha=q*(el?.35:.5);c.lineWidth=(big?3.4:pierce?2.2:1.4)*q;c.beginPath();c.moveTo(a.x,a.y-z);c.lineTo(b.x,b.y-z);c.stroke();a=b}}
    if(big&&!el){c.globalAlpha=.5;c.drawImage(Kit.glowCv('#ffd76a'),s.x-16,s.y-16,32,32)}
    const ar=this.arrowSpr(el?col:'#e8ecf2',big,el||0),co=Math.cos(ang),si=Math.sin(ang);c.globalCompositeOperation='source-over';c.globalAlpha=1;
    c.setTransform(k*co,k*si,-k*si,k*co,k*s.x+ox,k*s.y+oy);c.drawImage(ar.cv,-ar.ax,-ar.ay,ar.w,ar.h);c.setTransform(k,0,0,k,ox,oy);c.globalCompositeOperation='lighter';
    if(sp.mark&&!el){c.globalAlpha=.7;c.drawImage(Kit.glowCv('#ff5a4a'),s.x-7,s.y-7,14,14)}},
  /* ----- 견본표 (점검·스크린샷) ----- */
  sheet(k){k=k||2;const CW=200,RH=170,cols=5,cells=[];
    const T=(n,fn)=>cells.push({n,fn});
    const mk=(o,u)=>Object.assign({t0:0,d:1},o);
    T('한손검 베기',(c,m)=>this.drawOne(c,mk({k:'slash',x:0,y:0,a:.6,R:72,ang:.9,dir:1,w:.34,col:'#e8e4d8'}),.42,m,0));
    T('십자 베기',(c,m)=>{this.drawOne(c,mk({k:'slash',x:0,y:0,a:.6,R:80,ang:1.6,dir:1,w:.3,col:'#e8e4d8',cross:1}),.42,m,0);this.drawOne(c,mk({k:'slash',x:0,y:0,a:.6,R:80,ang:1.6,dir:-1,w:.3,col:'#e8e4d8'}),.3,m,0)});
    T('창 찌르기',(c,m)=>this.drawOne(c,mk({k:'thrust',x:-40,y:0,a:.4,R:130,col:'#e8e4d8'}),.3,m,0));
    T('창 휩쓸기',(c,m)=>this.drawOne(c,mk({k:'slash',x:0,y:0,a:.6,R:110,ang:2.7,dir:1,w:.3,col:'#e8e4d8'}),.45,m,0));
    T('방패 치기',(c,m)=>this.drawOne(c,mk({k:'bash',x:-20,y:0,a:.6,R:50}),.25,m,0));
    T('회전 베기',(c,m)=>this.drawOne(c,mk({k:'spin',x:0,y:0,a:0,R:110,col:'#e8e4d8'}),.4,m,0));
    T('도약 자취',(c,m)=>{this.drawOne(c,mk({k:'leap',x:-80,y:40,x2:60,y2:-40,rad:90}),.7,m,0);this.drawOne(c,mk({k:'land',x:60,y:-40,rad:90,done:1}),.2,m,0)});
    T('방패 돌진',(c,m)=>this.drawOne(c,mk({k:'charge',x:-90,y:30,a:-.3,L:200,w:40}),.5,m,0));
    T('외침·도발 고리',(c,m)=>{this.drawOne(c,mk({k:'shout',x:0,y:0,R:110,col:'#ff8a6a'}),.35,m,0);this.drawOne(c,mk({k:'shout',x:0,y:0,R:110,col:'#ffd76a',pull:1}),.5,m,0)});
    T('검기 (산 가르기)',(c,m)=>this.drawOne(c,mk({k:'beamp',form:'wave',x:-60,y:30,x2:120,y2:-60,a:-.46,w:60}),.14,m,0));
    T('하늘 꿰뚫기',(c,m)=>this.drawOne(c,mk({k:'beamp',form:'lance',x:-60,y:30,x2:140,y2:-70,a:-.46,w:70}),.3,m,0));
    T('공성 사격',(c,m)=>this.drawOne(c,mk({k:'beamp',form:'giant',x:-80,y:40,x2:140,y2:-70,a:-.46,w:30}),.35,m,0));
    T('짐승 떼',(c,m)=>this.drawOne(c,mk({k:'beamp',form:'herd',x:-80,y:40,x2:120,y2:-60,a:-.46,w:120}),.4,m,0));
    T('던진 방패',(c,m)=>this.drawOne(c,mk({k:'toss',segs:[[{x:-60,y:20,z:16},{x:40,y:-30,z:16}]],d:.5,form:'shield',h0:1}),.3,m,0));
    const ap=(n,o,f)=>T(n,(c,m)=>{const pts=[];for(let i=0;i<10;i++)pts.push({x:-70+i*10*(o.sp||1),y:20-i*5*(o.sp||1)});const p=Object.assign({x:pts[9].x,y:pts[9].y,z:0,vx:1,vy:-.5,r:6,col:'#fff',tr:pts,_fxph:1},o.p);p.s=Object.assign({rank:o.rank||1,phys:1},o.s);if(o.s.el&&o.s.el!=='phys')p.col=EL[o.s.el];
      const s=m(p.x,p.y);c.globalCompositeOperation='lighter';this.arrow(c,p,s,k,0,0,m);if(f)f(c,m,p)});
    // 화살: 셀 중심 변환이 setTransform을 쓰므로 아래 그리기에서 원점을 맞춘다
    ap('화살',{s:{el:'phys',mult:1}});ap('관통 화살',{s:{el:'phys',mult:1.8,pierce:1}});ap('힘껏 당긴 화살',{s:{el:'phys',mult:4.5,id:'fulldraw',pierce:1}});
    T('부채 사격',(c,m)=>{for(let i=-2;i<=2;i++){const a=-.46+i*.18,pts=[];for(let j=0;j<6;j++)pts.push({x:-40+Math.cos(a)*j*16,y:Math.sin(a)*j*16});const p={x:pts[5].x,y:pts[5].y,z:0,vx:Math.cos(a),vy:Math.sin(a),_ang:Math.atan2((Math.cos(a)+Math.sin(a))*KI/2,(Math.cos(a)-Math.sin(a))*KI),tr:pts,s:{phys:1,mult:.8}};this.arrow(c,p,m(p.x,p.y),k,0,0,m)}});
    for(const [el,r] of [['fire',2],['fire',7],['ice',3],['ice',9],['storm',4],['storm',7]])ap(`${ELN[el]||el} 화살 · 위계 ${r}`,{s:{el,mult:1.3},rank:r});
    T('화살비',(c,m)=>{const r={x:0,y:0,rad:80,s:{phys:1},_ph:.3};const keep=rains;rains=[r];this.draw(c,m,1.3);rains=keep;c.globalAlpha=.3;c.strokeStyle='#e8e4d8';c.setLineDash([6,6]);const s=m(0,0);c.beginPath();c.ellipse(s.x,s.y,80*1.06,80*.53,0,0,6.283);c.stroke();c.setLineDash([])});
    for(const [n,id,el,arm] of [['올가미 덫','snaretrap','phys',0],['화염 덫 (준비)','firetrap','fire',.4],['화염 덫','firetrap','fire',0],['서리 덫','frosttrap','ice',0],['파편 덫','shrapneltrap','phys',0],['짐승 우리','beastcage','phys',0]])
      T(n,(c,m)=>{c.globalCompositeOperation='source-over';this.drawTrap(c,{x:0,y:0,s:{id,el},arm,t:9},m,.2)});
    T('짐승 우리 (걸림)',(c,m)=>this.drawOne(c,{k:'cagec',x:0,y:0,rad:220,d:4,t0:0},.5,m,0));
    T('전투 깃발 · 수호 군기',(c,m)=>{c.globalCompositeOperation='source-over';const a=this.bannerSpr('#8a2a24',1),b=this.bannerSpr('#3a5a9a',2),s=m(0,0);c.drawImage(a.cv,s.x-40-a.ax,s.y+40-a.ay,a.w,a.h);c.drawImage(b.cv,s.x+30-b.ax,s.y+40-b.ay,b.w,b.h)});
    T('사냥매 (날갯짓)',(c,m)=>{c.globalCompositeOperation='source-over';const s=m(0,0);for(let f=0;f<3;f++){const sp=this.falconSpr(f);Kit.shadow(c,s.x-55+f*55,s.y+40,12,4,.6);c.drawImage(sp.cv,s.x-55+f*55-sp.ax*1.45,s.y-sp.ay*1.45,sp.w*1.45,sp.h*1.45)}});
    T('늑대 동료 (달리기)',(c,m)=>{c.globalCompositeOperation='source-over';const s=m(0,0);for(let f=0;f<4;f++){const sp=this.wolfSpr(f),x=s.x-66+(f%2)*70,y=s.y+(f>>1)*52-6;Kit.shadow(c,x,y+1,20,5,.7);c.drawImage(sp.cv,x-sp.ax,y-sp.ay,sp.w,sp.h)}});
    T('도발 · 표식',(c,m)=>{c.globalCompositeOperation='source-over';const s=m(0,0),mm=this.markSpr(),tt=this.tauntSpr();c.save();c.translate(s.x+30,s.y+20);c.scale(1.4,.7);c.drawImage(mm.cv,-13,-13,26,26);c.restore();
      c.fillStyle='#5a4a3a';c.beginPath();c.ellipse(s.x-30,s.y+5,16,22,0,0,6.283);c.fill();c.fillStyle='#5a4a3a';c.beginPath();c.ellipse(s.x+30,s.y+5,16,22,0,0,6.283);c.fill();c.drawImage(tt.cv,s.x-44,s.y-50,28,28);c.save();c.translate(s.x+30,s.y+22);c.scale(1.4,.7);c.drawImage(mm.cv,-13,-13,26,26);c.restore()});
    T('대신 맞기 끈',(c,m)=>{const a=m(-50,20),b=m(50,-20);c.globalAlpha=.4;c.strokeStyle='#9fc8ff';c.lineWidth=5;c.beginPath();c.moveTo(a.x,a.y-30);c.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2-50,b.x,b.y-30);c.stroke();c.globalAlpha=1;c.strokeStyle='#e8f4ff';c.lineWidth=1.2;c.setLineDash([5,4]);c.stroke();c.setLineDash([])});
    T('막음 · 피함 · 빗나감',(c,m)=>{const s=m(0,0);this.drawOne(c,mk({k:'blockfx',x:-60,y:30}),.2,m,0);this.drawOne(c,mk({k:'evadefx',x:60,y:-30}),.3,m,0);c.globalCompositeOperation='source-over';c.textAlign='center';c.font=`700 13px ${typeof FONT!=='undefined'?FONT:'sans-serif'}`;
      for(const [t,col,x,y] of [['막음','#9fc8ff',-40,-30],['피함','#bff0c0',40,-40],['빗나감','#b8b0a4',0,30]]){c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.8)';c.strokeText(t,s.x+x,s.y+y);c.fillStyle=col;c.fillText(t,s.x+x,s.y+y)}});
    T('착지 · 발톱',(c,m)=>this.drawOne(c,mk({k:'land',x:0,y:0,rad:110,claw:1,done:1}),.3,m,0));
    const rows=Math.ceil(cells.length/cols),cv=document.createElement('canvas');cv.width=CW*cols*k;cv.height=RH*rows*k;const c=cv.getContext('2d');
    c.setTransform(k,0,0,k,0,0);c.fillStyle='#24262a';c.fillRect(0,0,CW*cols,RH*rows);
    cells.forEach((cl,i)=>{const x0=(i%cols)*CW,y0=Math.floor(i/cols)*RH,cx=x0+CW/2,cy=y0+RH/2+18;c.setTransform(k,0,0,k,0,0);c.fillStyle=(i+Math.floor(i/cols))%2?'#2a2c31':'#26282d';c.fillRect(x0,y0,CW,RH);
      c.strokeStyle='rgba(255,255,255,.06)';c.beginPath();for(let g=-3;g<=3;g++){const a=W2Sloc(g*40,-120),b=W2Sloc(g*40,120),a2=W2Sloc(-120,g*40),b2=W2Sloc(120,g*40);c.moveTo(cx+a.x,cy+a.y);c.lineTo(cx+b.x,cy+b.y);c.moveTo(cx+a2.x,cy+a2.y);c.lineTo(cx+b2.x,cy+b2.y)}c.stroke();
      c.save();c.beginPath();c.rect(x0,y0,CW,RH);c.clip();const m=(x,y)=>{const q=W2Sloc(x,y);return{x:cx+q.x,y:cy+q.y}};c.globalCompositeOperation='lighter';c.lineCap='round';c.lineJoin='round';
      try{cl.fn(c,m)}catch(e){c.fillStyle='#f55';c.fillText(e.message,x0+4,y0+40)}c.restore();c.setTransform(k,0,0,k,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';
      c.fillStyle='#e8e2d2';c.font='600 12px sans-serif';c.textAlign='left';c.fillText(cl.n,x0+8,y0+16)});
    return cv}};
function W2Sloc(x,y){return{x:(x-y)*KI,y:(x+y)*KI/2}}
// FXR.draw 감싸기: 물리 투사체(화살)만 가로챈다
const FXR_draw0=FXR.draw;
FXR.draw=function(c,p,s,k,ox,oy,map){if(p&&p.s&&(p.s.phys||p.s.wt==='bow'))return FXP.arrow(c,p,s,k,ox,oy,map);return FXR_draw0.call(this,c,p,s,k,ox,oy,map)};
window.__fxp={FXP,sheet:k=>FXP.sheet(k).toDataURL('image/png')};
// CLS(cls2.js)는 이 파일 뒤에 실린다 → 끝난 뒤에 PFX 자리를 이 그림으로 바꿔 끼운다. clsDraw(임시 그림)는 끈다: 덫·표식·끈은 FXP.ground/draw가 그린다
queueMicrotask(()=>{if(typeof PFX==='undefined')return;
  Object.assign(PFX,{cast(){},swing(){},hit(e,s){FXP.hitSpark(e.x,e.y,'#fff4d0',5)},
    leap(h,ox,oy,x,y,s){FXP.leapFx(ox,oy,x,y,s,FXP.wtOf(h))},charge(h,ox,oy,x,y,s){FXP.chargeFx(ox,oy,x,y,s)},
    trap(tr,ev){if(ev==='boom')FXP.trapBoom(tr)},block(h){FXP.add({k:'blockfx',x:h.x,y:h.y,d:.3})},evade(h){FXP.add({k:'evadefx',x:h.x,y:h.y,d:.3})}});
  if(typeof clsDraw==='function')clsDraw=function(){};
  if(typeof drawAlly==='function'){const _d=drawAlly;drawAlly=function(a){if(a&&a._s&&FXP.pet(a,a._s))return;return _d(a)}}});
