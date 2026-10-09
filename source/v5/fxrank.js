/* ---------- v17: 위계별 투사체 그림 ----------
   같은 원소의 화살이라도 위계(rank 1~9)가 높을수록 크고 모양이 또렷해진다. 판정·피해·속도·반지름은 그대로(그림만).
   위계 단계 t: 1~2→0 작은 알맹이+짧은 꼬리 / 3~4→1 원소 모양(불꽃 혀·얼음 조각·불꽃 튐·돌·룬·빛창) / 5~6→2 감도는 빛알+쌍꼬리+작은 터짐
   / 7~8→3 룬 고리+땅 충격파·자국 / 9→4 겹꼬리 혜성+도는 문장+큰 터짐.
   모든 그림은 (모양,색,단계,프레임)마다 SC에 한 번 굽고(그라디언트는 굽는 순간에만) 매 프레임엔 drawImage와 짧은 선만 쓴다.
   색은 투사체의 col(=EL[원소])을 그대로 쓴다. 새 마법도 s.rank·s.el만 있으면 자동으로 적용된다. */
const FXR={
  T:[0,0,0,1,1,2,2,3,3,4],rng:mulberry(9173),K:[1,1.38,1.7,2.05,2.5],FR:4,imp:[],n:0,cc:new Map(),
  TN:[4,7,9,9,14],RB:[1,1,1.1,1,1.1,1,1.1,1,1.1,1],TW:[.9,1.15,1.3,1.4,1.75],GW:[2.3,2.1,2.3,2.5,2.9],GA:[1,.55,.55,.6,.65],LT:[110,130,150,175,210],
  SH:{fire:'flame',blood:'flame',ice:'shard',water:'shard',storm:'spark',earth:'rock',arcane:'rune',shadow:'rune',holy:'spear',light:'spear',wind:'blade',life:'leaf'},
  tierOf(r){return this.T[Math.max(1,Math.min(9,(r|0)||1))]},
  tier(p){return p._fxt!=null?p._fxt:(p._fxt=this.tierOf(p.s&&p.s.rank))},
  trLen(p){return this.tier(p)>=4?14:9},
  lt(p){return this.LT[this.tier(p)]},
  lit(col,k){const key=col+'|'+k;let v=this.cc.get(key);if(!v){v=Kit.lit(col,k);this.cc.set(key,v)}return v},
  shapeOf(el,t){return t?(this.SH[el]||'orb'):'orb'},
  /* ----- 굽기 ----- */
  body(el,col,t,f){const sh=this.shapeOf(el,t),u=6*this.K[t],w=Math.ceil(u*(t>=4?15:4+1.8*t+3.4)),h=Math.ceil(u*5),ax=Math.ceil(w-u*2.6),ay=h/2;
    return SC.get(`fxr/b/${sh}/${col}/${t}/${f}`,w,h,ax,ay,g=>this.paint(g,sh,col,t,f,u,ax,ay),{force:1})},
  tail(g,cx,cy,L,hw,col,a){const c=Kit.hex(col),gr=g.createLinearGradient(cx,0,cx-L,0);gr.addColorStop(0,Kit.rgb(c,a));gr.addColorStop(.55,Kit.rgb(c,a*.4));gr.addColorStop(1,Kit.rgb(c,0));
    g.fillStyle=gr;g.beginPath();g.moveTo(cx,cy-hw);g.quadraticCurveTo(cx-L*.45,cy-hw*.7,cx-L,cy);g.quadraticCurveTo(cx-L*.45,cy+hw*.7,cx,cy+hw);g.arc(cx,cy,hw,Math.PI/2,-Math.PI/2,true);g.fill()},
  paint(g,sh,col,t,f,u,cx,cy){const rn=mulberry(f*131+t*17+sh.length*7+1),c=Kit.hex(col),hi=Kit.lit(col,.55),lo=Kit.lit(col,-.35);
    g.lineCap=g.lineJoin='round';
    let gr=g.createRadialGradient(cx,cy,0,cx,cy,u*2.2);gr.addColorStop(0,Kit.rgb(c,sh==='rock'?.25:.5));gr.addColorStop(1,Kit.rgb(c,0));g.fillStyle=gr;g.fillRect(cx-u*2.2,cy-u*2.2,u*4.4,u*4.4);
    const L=t>=4?u*12:u*(1.4+t*1.5);this.tail(g,cx,cy,L,u*(.5+.07*t),col,sh==='rock'?.35:.55);
    if(t>=4){this.tail(g,cx,cy,L*.72,u*.34,hi,.7);this.tail(g,cx,cy,L*.42,u*.15,'#ffffff',.85)}
    const P=(fn)=>{g.beginPath();fn();g.closePath()};
    if(sh==='orb'){gr=g.createRadialGradient(cx+u*.15,cy-u*.1,0,cx,cy,u*1.05);gr.addColorStop(0,'#fff');gr.addColorStop(.35,hi);gr.addColorStop(.7,col);gr.addColorStop(1,Kit.rgb(c,0));g.fillStyle=gr;g.beginPath();g.arc(cx,cy,u*1.05,0,6.283);g.fill();return}
    if(sh==='flame'){const tong=(s,ox,oy,wig)=>{const r=u*.85*s,Lf=u*(2+.35*t)*s;g.beginPath();g.arc(cx+ox,cy+oy,r,-Math.PI/2,Math.PI/2);
        g.bezierCurveTo(cx+ox-r*1.2,cy+oy+r,cx+ox-Lf*.6,cy+oy+r*.4+wig,cx+ox-Lf,cy+oy+wig*1.6);g.bezierCurveTo(cx+ox-Lf*.55,cy+oy-r*.3+wig,cx+ox-r*1.1,cy+oy-r,cx+ox,cy+oy-r);g.fill()};
      const wg=()=>(rn()-.5)*u*.9;
      if(t>=2){g.fillStyle=Kit.rgb(Kit.hex(lo),.75);tong(.75,-u*.6,-u*.45,wg());tong(.7,-u*.6,u*.45,wg())}
      g.fillStyle=Kit.rgb(c,.95);tong(1,0,0,wg());g.fillStyle=hi;tong(.62,u*.18,0,wg()*.6);g.fillStyle='#fff8e0';tong(.32,u*.35,0,wg()*.3);return}
    if(sh==='shard'){const sd=(x,y,s,a)=>{g.save();g.translate(x,y);g.rotate(a);g.scale(s,s);const F=u*1.8,B=u*1.6,Hh=u*.62;
        g.fillStyle=hi;P(()=>{g.moveTo(F,0);g.lineTo(0,-Hh);g.lineTo(-B,0)});g.fill();g.fillStyle=col;P(()=>{g.moveTo(F,0);g.lineTo(-B,0);g.lineTo(0,Hh)});g.fill();
        g.fillStyle=Kit.rgb(Kit.hex(lo),.6);P(()=>{g.moveTo(-B*.2,Hh*.25);g.lineTo(-B,0);g.lineTo(0,Hh)});g.fill();
        g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=.9;g.beginPath();g.moveTo(F,0);g.lineTo(0,-Hh);g.lineTo(-B,0);g.stroke();g.globalAlpha=.6;g.beginPath();g.moveTo(F*.9,0);g.lineTo(-B*.7,0);g.stroke();g.globalAlpha=1;g.restore()};
      if(t>=2){sd(cx-u*.7,cy-u*.75,.45,-.35);sd(cx-u*.7,cy+u*.75,.45,.35)}sd(cx,cy,1,(rn()-.5)*.08);
      gr=g.createRadialGradient(cx+u*1.2,cy,0,cx+u*1.2,cy,u*.7);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(cx+u*.5,cy-u*.7,u*1.4,u*1.4);return}
    if(sh==='spark'){const n=3+t;for(let i=0;i<n;i++){const a=Math.PI+(rn()-.5)*(i<2?1.2:3.6),l=u*(1.1+rn()*1.3);let x=cx,y=cy;const pts=[[x,y]];
        for(let k=1;k<=3;k++){const d=l*k/3,j=(rn()-.5)*u*.7;pts.push([cx+Math.cos(a)*d-Math.sin(a)*j,cy+Math.sin(a)*d+Math.cos(a)*j])}
        for(const [w,s] of [[2.2,Kit.rgb(c,.85)],[.9,'#fffbe8']]){g.lineWidth=w*(1+t*.12);g.strokeStyle=s;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(const q of pts)g.lineTo(q[0],q[1]);g.stroke()}}
      gr=g.createRadialGradient(cx,cy,0,cx,cy,u*.75);gr.addColorStop(0,'#fff');gr.addColorStop(.5,hi);gr.addColorStop(1,Kit.rgb(c,0));g.fillStyle=gr;g.beginPath();g.arc(cx,cy,u*.75,0,6.283);g.fill();return}
    if(sh==='rock'){const n=7,a0=f*.8,r=u*.95,pts=[];for(let i=0;i<n;i++){const a=a0+i/n*6.283,k=.78+rn()*.32;pts.push([cx+Math.cos(a)*r*k,cy+Math.sin(a)*r*k*.9])}
      const path=gg=>{gg.moveTo(pts[0][0],pts[0][1]);for(const q of pts)gg.lineTo(q[0],q[1]);gg.closePath()};
      Kit.solid(g,path,cx-r,cy-r,cx+r,cy+r,col,{lineW:1.1});
      g.strokeStyle=Kit.rgb(Kit.hex(lo),.7);g.lineWidth=.8;for(let i=0;i<2;i++){g.beginPath();g.moveTo(cx+(rn()-.5)*r,cy+(rn()-.5)*r);g.lineTo(cx+(rn()-.5)*r,cy+(rn()-.5)*r);g.stroke()}
      if(t>=2){g.fillStyle=Kit.rgb(Kit.hex(hi),.8);for(let i=0;i<3;i++){g.beginPath();g.arc(cx-u*(1.1+rn()*1.2),cy+(rn()-.5)*u*1.2,u*(.12+rn()*.12),0,6.283);g.fill()}}
      g.strokeStyle=Kit.rgb(Kit.hex(hi),.55);g.lineWidth=1.4;g.beginPath();g.arc(cx,cy,r*.92,-1.2,1.2);g.stroke();return}
    if(sh==='rune'){gr=g.createRadialGradient(cx,cy,0,cx,cy,u*.75);gr.addColorStop(0,'#fff');gr.addColorStop(.45,hi);gr.addColorStop(1,Kit.rgb(c,.15));g.fillStyle=gr;g.beginPath();g.arc(cx,cy,u*.75,0,6.283);g.fill();
      g.strokeStyle=Kit.rgb(c,.9);g.lineWidth=1.3;g.beginPath();g.arc(cx,cy,u*1.15,0,6.283);g.stroke();
      g.save();g.translate(cx,cy);g.rotate(f*Math.PI/8);g.strokeStyle='#fff';g.lineWidth=1.1;const q=u*.45;g.beginPath();g.moveTo(-q,-q*.2);g.lineTo(0,-q);g.lineTo(q,-q*.2);g.moveTo(0,-q);g.lineTo(0,q);g.moveTo(-q*.6,q*.5);g.lineTo(q*.6,q*.5);g.stroke();
      g.fillStyle=hi;for(let i=0;i<6;i++){const a=i*1.047;g.beginPath();g.arc(Math.cos(a)*u*1.15,Math.sin(a)*u*1.15,u*.11,0,6.283);g.fill()}g.restore();return}
    if(sh==='spear'){const F=u*2.1,B=u*2.4,Hh=u*.34;g.fillStyle=Kit.rgb(c,.85);P(()=>{g.moveTo(cx+F,cy);g.quadraticCurveTo(cx,cy-Hh*1.3,cx-B,cy);g.quadraticCurveTo(cx,cy+Hh*1.3,cx+F,cy)});g.fill();
      g.fillStyle='#fffdf0';P(()=>{g.moveTo(cx+F*.95,cy);g.quadraticCurveTo(cx,cy-Hh*.5,cx-B*.8,cy);g.quadraticCurveTo(cx,cy+Hh*.5,cx+F*.95,cy)});g.fill();
      const sx=cx+u*1.3,st=(l,w)=>{g.beginPath();g.moveTo(sx-l,cy);g.quadraticCurveTo(sx,cy-w,sx+l,cy);g.quadraticCurveTo(sx,cy+w,sx-l,cy);g.moveTo(sx,cy-l);g.quadraticCurveTo(sx+w,cy,sx,cy+l);g.quadraticCurveTo(sx-w,cy,sx,cy-l);g.fill()};
      g.fillStyle=Kit.rgb(Kit.hex(hi),.85);st(u*(.8+.12*t),u*.16);g.fillStyle='#fff';st(u*.45,u*.09);return}
    if(sh==='blade'){g.fillStyle=Kit.rgb(c,.9);g.beginPath();g.arc(cx-u*.5,cy,u*1.35,-1.25,1.25);g.arc(cx-u*1.0,cy,u*1.1,1.15,-1.15,true);g.fill();
      g.strokeStyle='#ffffff';g.lineWidth=1;g.beginPath();g.arc(cx-u*.5,cy,u*1.28,-1,1);g.stroke();return}
    if(sh==='leaf'){g.fillStyle=Kit.rgb(c,.9);P(()=>{g.moveTo(cx+u*1.3,cy);g.quadraticCurveTo(cx,cy-u*.9,cx-u*1.3,cy);g.quadraticCurveTo(cx,cy+u*.9,cx+u*1.3,cy)});g.fill();
      g.strokeStyle='#fff';g.lineWidth=.9;g.beginPath();g.moveTo(cx+u*1.1,cy);g.lineTo(cx-u*1.2,cy);g.stroke()}},
  halo(col,t){const u=6*this.K[t],S=Math.ceil(u*4.4);return SC.get(`fxr/h/${col}/${t}`,S,S,S/2,S/2,g=>{const c=Kit.hex(col),r=S*.4;g.lineCap='round';
      g.strokeStyle=Kit.rgb(c,.8);g.lineWidth=1.5;g.beginPath();g.arc(S/2,S/2,r,0,6.283);g.stroke();g.strokeStyle=Kit.rgb(c,.35);g.lineWidth=1;g.beginPath();g.arc(S/2,S/2,r*.84,0,6.283);g.stroke();
      g.fillStyle=Kit.lit(col,.5);for(let i=0;i<8;i++){const a=i*.785,x=S/2+Math.cos(a)*r,y=S/2+Math.sin(a)*r;g.save();g.translate(x,y);g.rotate(a);g.beginPath();g.moveTo(-2.6,0);g.lineTo(0,-1.6);g.lineTo(2.6,0);g.lineTo(0,1.6);g.closePath();g.fill();g.restore()}},{force:1})},
  sigil(col){const S=120;return SC.get(`fxr/sg/${col}`,S,S,S/2,S/2,g=>{const c=Kit.hex(col),m=S/2,r=S*.45;g.lineCap=g.lineJoin='round';
      g.strokeStyle=Kit.rgb(c,.85);g.lineWidth=2;g.beginPath();g.arc(m,m,r,0,6.283);g.stroke();g.lineWidth=1;g.strokeStyle=Kit.rgb(c,.5);g.beginPath();g.arc(m,m,r*.9,0,6.283);g.stroke();
      g.strokeStyle=Kit.rgb(Kit.hex(Kit.lit(col,.45)),.8);g.lineWidth=1.4;for(const o of [0,Math.PI]){g.beginPath();for(let i=0;i<3;i++){const a=o-Math.PI/2+i*2.094;g[i?'lineTo':'moveTo'](m+Math.cos(a)*r*.82,m+Math.sin(a)*r*.82)}g.closePath();g.stroke()}
      g.strokeStyle=Kit.rgb(c,.7);g.beginPath();g.arc(m,m,r*.4,0,6.283);g.stroke();
      g.fillStyle=Kit.rgb(c,.9);for(let i=0;i<12;i++){const a=i*.5236;g.fillRect(m+Math.cos(a)*r*.95-1,m+Math.sin(a)*r*.95-1,2,2)}},{force:1})},
  flare(col){return SC.get(`fxr/fl/${col}`,64,64,32,32,g=>{const c=Kit.hex(col);let gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'#fff');gr.addColorStop(.25,Kit.rgb(c,.9));gr.addColorStop(1,Kit.rgb(c,0));g.fillStyle=gr;g.fillRect(0,0,64,64);
      g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.moveTo(2,32);g.quadraticCurveTo(32,29,62,32);g.quadraticCurveTo(32,35,2,32);g.moveTo(32,6);g.quadraticCurveTo(35,32,32,58);g.quadraticCurveTo(29,32,32,6);g.fill()},{force:1})},
  ring(col){return SC.get(`fxr/rg/${col}`,96,96,48,48,g=>{const c=Kit.hex(col),gr=g.createRadialGradient(48,48,0,48,48,48);gr.addColorStop(0,Kit.rgb(c,0));gr.addColorStop(.7,Kit.rgb(c,0));gr.addColorStop(.86,Kit.rgb(c,.75));gr.addColorStop(.93,'rgba(255,255,255,.8)');gr.addColorStop(1,Kit.rgb(c,0));g.fillStyle=gr;g.fillRect(0,0,96,96)},{force:1})},
  /* ----- 매 프레임 그리기 (현재 합성: lighter, 변환: 화면 좌표 × k + (ox,oy)) ----- */
  draw(c,p,s,k,ox,oy,map){const t=this.tier(p),col=p.col,el=p.s&&p.s.el,low=Q.lvl===0,r=p.r||6,m=Math.max(.8,Math.min(1.3,Math.sqrt(r/7)))*(this.RB[(p.s&&p.s.rank)|0]||1),z=p.z||0;
    if(p._fxph==null)p._fxph=(this.n=(this.n+1)%97)*1.7;const ph=p._fxph;
    const ang=p._ang!=null?p._ang:Math.atan2((p.vx+p.vy)*KI/2,(p.vx-p.vy)*KI);
    const tr=p.tr;
    if(tr&&tr.length>1){const n=Math.min(tr.length,this.TN[t]),i0=tr.length-n,w=r*this.TW[t];c.strokeStyle=col;
      let a=map(tr[i0].x,tr[i0].y);for(let i=i0+1;i<tr.length;i++){const b=map(tr[i].x,tr[i].y),q=(i-i0)/n;c.globalAlpha=q*.6;c.lineWidth=w*q;c.beginPath();c.moveTo(a.x,a.y-z);c.lineTo(b.x,b.y-z);c.stroke();a=b}
      if(t>=4){c.globalAlpha=.55;c.strokeStyle=this.lit(col,.6);c.lineWidth=w*.35;c.beginPath();for(let i=i0;i<tr.length;i++){const b=map(tr[i].x,tr[i].y);c[i>i0?'lineTo':'moveTo'](b.x,b.y-z)}c.stroke()}
      if(t>=2&&!low&&n>2){c.strokeStyle=this.lit(col,.4);c.lineWidth=1.3;c.globalAlpha=.55;for(const o of [0,Math.PI]){c.beginPath();let pa=map(tr[i0].x,tr[i0].y);
          for(let i=i0+1;i<tr.length;i++){const b=map(tr[i].x,tr[i].y),dx=b.x-pa.x,dy=b.y-pa.y,l=Math.hypot(dx,dy)||1,q=(i-i0)/n,off=Math.sin(i*1.3-time*16+ph+o)*w*.75*q;
            c[i>i0+1?'lineTo':'moveTo'](b.x-dy/l*off,b.y-z+dx/l*off);pa=b}c.stroke()}}}
    const G=r*this.GW[t];c.globalAlpha=this.SH[el]==='rock'&&t?.3:this.GA[t];c.drawImage(Kit.glowCv(col),s.x-G,s.y-G,G*2,G*2);c.globalAlpha=1;
    const f=((time*14+ph)|0)%this.FR,e=this.body(el,col,t,f),co=Math.cos(ang),si=Math.sin(ang);
    if(e){const solid=t&&this.SH[el]==='rock';if(solid)c.globalCompositeOperation='source-over';
      c.setTransform(k*co,k*si,-k*si,k*co,k*s.x+ox,k*s.y+oy);c.drawImage(e.cv,-e.ax*m,-e.ay*m,e.w*m,e.h*m);if(solid)c.globalCompositeOperation='lighter'}
    if(t>=3){const h=t>=4?this.sigil(col):this.halo(col,t),ra=(t>=4?-1.6:2.2)*time+ph,cr=Math.cos(ra),sr=Math.sin(ra),hs=t>=4?.62*m:m;
      c.setTransform(k*cr,k*sr,-k*sr,k*cr,k*s.x+ox,k*s.y+oy);c.globalAlpha=t>=4?.7:.8;c.drawImage(h.cv,-h.ax*hs,-h.ay*hs,h.w*hs,h.h*hs);c.globalAlpha=1}
    c.setTransform(k,0,0,k,ox,oy);
    if(t>=2&&!low){const u=6*this.K[t]*m,gc=Kit.glowCv(this.lit(col,.45)),R=u*.42;for(let j=0;j<(t>=3?2:1);j++){const a=time*9+ph+j*Math.PI;c.drawImage(gc,s.x+Math.cos(a)*u*1.7-R,s.y+Math.sin(a)*u*.75-R,R*2,R*2)}}},
  /* ----- 맞힘 ----- */
  hit(p){if(!p||!p.s)return;const t=this.tier(p);this.imp.push({x:p.x,y:p.y,z:p.z||0,t,col:p.col,t0:time,d:[.16,.22,.32,.45,.62][t]});if(this.imp.length>48)this.imp.shift();
    if(t>=2)this.spray(p.x,p.y,p.z||0,this.lit(p.col,.4),[0,0,5,8,12][t],[0,0,140,180,240][t],[0,0,2.5,3,3.5][t]);
    if(t>=3)decal(p.x,p.y,t>=4?34:22,p.s.el)},
  // 그림 전용 입자: 게임 난수(R=Math.random, #qa에선 시드 고정)를 쓰지 않아 판정·난수 순서를 바꾸지 않는다. 입자 상한·품질을 따른다
  spray(x,y,z,col,n,sp,size){n=Math.ceil(n*Q.burstK);const M=FXR.rng;for(let i=0;i<n&&parts.length<Q.pcap;i++){const a=M()*6.283,v=(.2+.8*M())*sp;parts.push({x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:(M()*.9-.3)*v*.6,life:.35+.45*M(),max:.8,col,sz:1.5+M()*(size-1.5)})}},
  drawImp(c,im,a,k,ox,oy,map){const s=map(im.x,im.y),t=im.t,fa=Math.pow(1-a,1.4),F=[10,15,21,28,40][t]*(.7+.6*a),fl=this.flare(im.col);
    c.globalAlpha=fa;c.drawImage(fl.cv,s.x-F,s.y-im.z-F,F*2,F*2);
    if(t>=2){const rg=this.ring(im.col),e=1-Math.pow(1-a,2);
      if(t===2){const R=30*e;c.globalAlpha=fa*.9;c.drawImage(rg.cv,s.x-R,s.y-im.z-R,R*2,R*2)}
      else{for(let i=0;i<(t>=4?2:1);i++){const b=clamp(a*1.25-i*.3,0,1),R=(i?70:t>=4?105:62)*(1-Math.pow(1-b,2));if(b<=0||b>=1)continue;c.globalAlpha=(1-b)*.95;c.drawImage(rg.cv,s.x-R,s.y-R*.5,R*2,R)}}}
    if(t>=4){const sg=this.sigil(im.col),ra=a*2.2,cr=Math.cos(ra),sr=Math.sin(ra),sc=.55+.35*a;
      c.setTransform(k*cr*sc,k*sr*sc*.5,-k*sr*sc,k*cr*sc*.5,k*s.x+ox,k*s.y+oy);c.globalAlpha=fa*.8;c.drawImage(sg.cv,-sg.ax,-sg.ay,sg.w,sg.h);c.setTransform(k,0,0,k,ox,oy)}
    c.globalAlpha=1},
  drawImpacts(c,k,ox,oy,map){if(!this.imp.length)return;let dead=0;for(const im of this.imp){const a=(time-im.t0)/im.d;if(a>=1||a<0){dead++;continue}this.drawImp(c,im,a,k,ox,oy,map)}
    if(dead)this.imp=this.imp.filter(im=>{const a=(time-im.t0)/im.d;return a<1&&a>=0})},
  /* 비교표: 원소 × 위계 1~9 (투사체 줄 + 맞힘 줄) */
  sheet(els,k){els=els||['fire','ice','storm','earth','arcane','holy'];k=k||2;const CW=130,RH=150,LW=90,cw=LW+CW*9,ch=40+RH*els.length;
    const cv=document.createElement('canvas');cv.width=cw*k;cv.height=ch*k;const c=cv.getContext('2d'),map=(x,y)=>({x,y});c.setTransform(k,0,0,k,0,0);
    c.fillStyle='#16141c';c.fillRect(0,0,cw,ch);c.font=`700 14px ${typeof FONT!=='undefined'?FONT:'sans-serif'}`;c.fillStyle='#e8e2d2';c.textAlign='center';
    for(let r=1;r<=9;r++)c.fillText(`위계 ${r}`,LW+CW*(r-.5),24);
    els.forEach((el,row)=>{const y0=40+RH*row,col=EL[el];c.fillStyle=row%2?'#1c1a24':'#201d29';c.fillRect(0,y0,cw,RH);c.textAlign='left';c.fillStyle=col;c.fillText(el,12,y0+RH/2);
      for(let r=1;r<=9;r++){const cx=LW+CW*(r-1)+CW*.62,cy=y0+48,tr=[];for(let i=13;i>=0;i--)tr.push({x:cx-i*7.5,y:cy});
        const p={x:cx,y:cy,z:0,vx:1,vy:0,r:7,col,s:{rank:r,el},_ang:0,_fxph:r*1.3,tr};c.globalCompositeOperation='lighter';this.draw(c,p,{x:cx,y:cy},k,0,0,map);
        const im={x:LW+CW*(r-.5),y:y0+RH-34,z:0,t:this.tierOf(r),col};this.drawImp(c,im,.32,k,0,0,map);c.globalCompositeOperation='source-over'}});
    return cv}};
window.__fxr={FXR,sheet:(e,k)=>FXR.sheet(e,k).toDataURL('image/png')};
/* ---------- v17: 치유 · 강화 시전 효과와 지속 표시 ----------
   종류(kind)와 필드만 보고 그린다(마법 id와 무관): heal · hot · shield(흡수) · buff · ward · invuln · armor · rez · cleanse, 그 밖의 비공격 지원 마법.
   시전 순간: 발밑 고리 + 빛기둥/거품/올라가는 표식이 위계만큼 커진다. 걸려 있는 동안: 보호막 거품(남은 흡수량만큼 진하게), 발밑 고리·머리 위 후광·감도는 문양(최대 3개).
   모두 색마다 한 번 구운 스프라이트를 drawImage로만 그린다. 규칙(치유량·흡수량·시간)은 건드리지 않는다. */
const FXB={fx:[],shTop:0,
  D:{heal:.75,hot:1,shield:.6,absorb:.6,buff:.8,ward:.9,invuln:.85,armor:.7,rez:1.2,cleanse:.7},
  KNOWN:new Set(['heal','hot','shield','buff','ward','invuln','armor','rez']),
  SUP:new Set(['heal','hot','shield','absorb','buff','ward','invuln','armor','rez','cleanse']),
  isSup(s){return !!s&&(this.SUP.has(s.kind)||((s.cleanse||s.absorb)&&!(s.mult>0)))},
  style(s){return s.kind==='absorb'||(s.absorb&&s.kind!=='heal')?'shield':s.kind==='cleanse'||(s.cleanse&&!this.SUP.has(s.kind))?'cleanse':this.D[s.kind]?s.kind:'cleanse'},
  // castFx에서: supFx/invuln/armor/rez가 직접 부르지 않는 새 지원 마법만
  other(s){if(s&&this.isSup(s)&&!this.KNOWN.has(s.kind))this.cast(s,P)},
  // o: 효과를 받는 쪽(나/동료). from: 동료가 건 파티 기도가 나에게 올 때. 이미 걸려 있던 걸 새로 걸면(갱신) 작은 맥박만
  cast(s,o,from){if(!s)return;o=o||P;const real=o===P&&!GHOST;
    const ref=real&&(s.kind==='hot'?!!(P.hot&&P.hot.t>0):s.kind==='shield'?P.shield>0&&P.shieldT>0:s.kind==='buff'?!!(s.id&&P.buffs[s.id]):s.kind==='ward'?!!P.ward:false);
    if(real&&typeof PUI!=='undefined')PUI.src[s.kind]=s.id;
    this.push(s,o,ref);
    // 파티 기도: 시전자(나 또는 다시 그리는 동료) 둘레의 다른 동료에게도 걸리는 순간을 보여 준다 (판정은 net.js의 규칙 그대로)
    if(!from&&s.party&&NET.on&&typeof PUI!=='undefined'&&PUI.PK.has(s.kind)){const c=GHOST||P;
      for(const r of NET.peers.values())if(r!==GHOST&&!r.dead&&netSame(r)&&dist(r,c)<=s.party){this.push(s,r,PUI.has(r,s));if(!GHOST)PUI.mark(r,s)}}},
  push(s,o,ref){const k=ref?'pulse':this.style(s),col=EL[s.el]||EL.holy,rank=Math.max(1,Math.min(9,s.rank||1)),ks=1+(rank-1)*.09;
    if(k==='shield'&&o===P)this.shTop=0;
    this.fx.push({o,x:o.x,y:o.y,k,col,rank,ks,t0:time,d:ref?.45:this.D[k]||.7});if(this.fx.length>24)this.fx.shift();
    if((k==='heal'||k==='rez'||k==='cleanse')&&typeof parts!=='undefined'){const n=Math.round((6+rank*1.5)*Q.burstK),mc=FXR.lit(col,.35);
      for(let i=0;i<n&&parts.length<Q.pcap;i++){const a=FXR.rng()*6.283,d=FXR.rng()*22*ks;parts.push({x:o.x+Math.cos(a)*d,y:o.y+Math.sin(a)*d,z:6+FXR.rng()*20,vx:0,vy:0,vz:60+FXR.rng()*70,life:.9,max:.9,col:mc,sz:1.6+FXR.rng()*1.4})}}},
  /* 굽기 */
  column(col){return SC.get(`fxb/c/${col}`,40,160,20,160,g=>{const c=Kit.hex(col);let gr=g.createLinearGradient(0,0,40,0);gr.addColorStop(0,Kit.rgb(c,0));gr.addColorStop(.3,Kit.rgb(c,.55));gr.addColorStop(.5,'rgba(255,255,255,.9)');gr.addColorStop(.7,Kit.rgb(c,.55));gr.addColorStop(1,Kit.rgb(c,0));
      g.fillStyle=gr;g.fillRect(0,0,40,160);g.globalCompositeOperation='destination-in';gr=g.createLinearGradient(0,0,0,160);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.55,'rgba(0,0,0,.7)');gr.addColorStop(1,'rgba(0,0,0,1)');g.fillStyle=gr;g.fillRect(0,0,40,160)},{force:1})},
  ring(col){return SC.get(`fxb/r/${col}`,128,64,64,32,g=>{const c=Kit.hex(col);g.save();g.translate(64,32);g.scale(1,.5);const gr=g.createRadialGradient(0,0,30,0,0,62);gr.addColorStop(0,Kit.rgb(c,0));gr.addColorStop(.75,Kit.rgb(c,.28));gr.addColorStop(1,Kit.rgb(c,0));g.fillStyle=gr;g.beginPath();g.arc(0,0,62,0,6.283);g.fill();
      g.strokeStyle=Kit.rgb(c,.9);g.lineWidth=3;g.beginPath();g.arc(0,0,54,0,6.283);g.stroke();g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.2;g.beginPath();g.arc(0,0,46,0,6.283);g.stroke();
      g.fillStyle=Kit.lit(col,.5);for(let i=0;i<12;i++){const a=i*.5236;g.save();g.translate(Math.cos(a)*50,Math.sin(a)*50);g.rotate(a);g.beginPath();g.moveTo(-4,0);g.lineTo(0,-2.4);g.lineTo(4,0);g.lineTo(0,2.4);g.closePath();g.fill();g.restore()}g.restore()},{force:1})},
  bubble(col){return SC.get(`fxb/b/${col}`,100,100,50,50,g=>{const c=Kit.hex(col),gr=g.createRadialGradient(50,50,0,50,50,48);gr.addColorStop(0,Kit.rgb(c,.05));gr.addColorStop(.7,Kit.rgb(c,.14));gr.addColorStop(.92,Kit.rgb(c,.6));gr.addColorStop(.97,'rgba(255,255,255,.55)');gr.addColorStop(1,Kit.rgb(c,0));
      g.fillStyle=gr;g.beginPath();g.arc(50,50,48,0,6.283);g.fill();g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=3;g.lineCap='round';g.beginPath();g.arc(50,50,38,3.5,4.4);g.stroke();g.lineWidth=1.5;g.beginPath();g.arc(50,50,38,4.6,4.8);g.stroke()},{force:1})},
  glyph(col,kind){return SC.get(`fxb/g/${kind}/${col}`,24,24,12,12,g=>{const c=Kit.hex(col),gr=g.createRadialGradient(12,12,0,12,12,12);gr.addColorStop(0,Kit.rgb(c,.6));gr.addColorStop(1,Kit.rgb(c,0));g.fillStyle=gr;g.fillRect(0,0,24,24);
      g.lineCap=g.lineJoin='round';g.strokeStyle='#fff';g.fillStyle=Kit.lit(col,.4);g.lineWidth=2;g.beginPath();
      if(kind==='plus'){g.moveTo(12,5);g.lineTo(12,19);g.moveTo(5,12);g.lineTo(19,12);g.stroke()}
      else if(kind==='chev'){g.moveTo(5,15);g.lineTo(12,8);g.lineTo(19,15);g.stroke()}
      else{g.moveTo(12,4);g.lineTo(18,12);g.lineTo(12,20);g.lineTo(6,12);g.closePath();g.fill();g.lineWidth=1.2;g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(12,12,1.8,0,6.283);g.fill()}},{force:1})},
  halo(col){return SC.get(`fxb/h/${col}`,48,18,24,9,g=>{const c=Kit.hex(col);g.strokeStyle=Kit.rgb(c,.95);g.lineWidth=2.6;g.beginPath();g.ellipse(24,9,19,5.5,0,0,6.283);g.stroke();g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1;g.beginPath();g.ellipse(24,9,19,5.5,0,3.4,6);g.stroke()},{force:1})},
  /* 그리기 (lighter, 화면 좌표) */
  img(c,e,x,y,w,h,a){if(a<=0)return;c.globalAlpha=Math.min(1,a);c.drawImage(e.cv,x-w/2,y-h/2,w,h)},
  drawOne(c,f,a,map){const o=f.o&&f.o.x!=null?f.o:f,s=map(o.x,o.y),ks=f.ks,col=f.col,fa=1-a,up=Math.min(1,a*4),k=f.k;
    const ring=(R,al)=>this.img(c,this.ring(col),s.x,s.y,R*2,R,al);
    const colm=(w,h,al)=>{const e=this.column(col);if(al>0&&h>0){c.globalAlpha=Math.min(1,al);c.drawImage(e.cv,s.x-w/2,s.y-h,w,h)}};
    if(k==='heal'){colm(26*ks,(80+f.rank*12)*up,fa*.9);ring((18+36*a)*ks,fa);this.img(c,this.glyph(col,'plus'),s.x,s.y-72-38*a,16*ks,16*ks,fa*1.3)}
    else if(k==='hot'){ring(34*ks,fa*.9);const gc=Kit.glowCv(FXR.lit(col,.35)),n=Q.lvl?6:3;c.globalAlpha=fa;for(let i=0;i<n;i++){const an=a*9+i*6.283/n,r=24*ks*(1-a*.4),x=s.x+Math.cos(an)*r,y=s.y+Math.sin(an)*r*.45-10-a*60;c.drawImage(gc,x-5,y-5,10,10)}}
    else if(k==='shield'){const R=34*ks*(.6+.5*(1-Math.pow(1-a,2)));this.img(c,this.bubble(col),s.x,s.y-26,R*2,R*2,fa*1.2);ring(30*ks,fa*.8)}
    else if(k==='buff'){ring((44-16*a)*ks,fa);const ch=this.glyph(col,'chev');for(let i=0;i<3;i++){const b=a*1.3-i*.15;if(b<0||b>1)continue;this.img(c,ch,s.x,s.y-12-b*72,18*ks,18*ks,(1-b)*1.2)}}
    else if(k==='ward'){colm(12*ks,90*up,fa*.6);this.img(c,this.halo(col),s.x,s.y-110+48*Math.min(1,a*2),36*ks,13*ks,fa*1.3);ring(26*ks,fa*.7)}
    else if(k==='invuln'){colm(46*ks,(120+f.rank*10)*up,fa);this.img(c,this.bubble(col),s.x,s.y-28,70*ks,70*ks,fa);ring((30+30*a)*ks,fa)}
    else if(k==='armor'){ring((26+34*a)*ks,fa);ring((50-20*a)*ks,fa*.6);this.img(c,this.bubble(col),s.x,s.y-24,56*ks,56*ks,fa*.6)}
    else if(k==='pulse'){ring((22+16*a)*ks*.8,fa*.85);this.img(c,this.glyph(col,'rune'),s.x,s.y-46-22*a,12*ks,12*ks,fa)}
    else if(k==='rez'){colm(50*ks,220*up,fa);ring((24+50*a)*ks,fa);this.img(c,this.glyph(col,'plus'),s.x,s.y-90-30*a,22,22,fa*1.3)}
    else{ring((20+30*a)*ks,fa);this.img(c,this.glyph(col,'rune'),s.x,s.y-40-40*a,16*ks,16*ks,fa*1.3);colm(16*ks,70*up,fa*.5)}
    c.globalAlpha=1},
  draw(c,map){if(this.fx.length){let dead=0;for(const f of this.fx){const a=(time-f.t0)/f.d;if(a>=1||a<0){dead++;continue}this.drawOne(c,f,a,map)}
      if(dead)this.fx=this.fx.filter(f=>{const a=(time-f.t0)/f.d;return a<1&&a>=0})}
    if(typeof P==='undefined'||P.dead||!P._s)return;const s=P._s;
    if(P.shield>0&&(P.shieldT==null||P.shieldT>0)){if(P.shield>this.shTop)this.shTop=P.shield;const fr=P.shield/(this.shTop||1),col=P.shieldS&&EL[P.shieldS.el]||EL.holy;
      this.img(c,this.bubble(col),s.x,s.y-26,66,66,.22+.4*fr+.05*Math.sin(time*3))}
    // 지속 표시(최대 3개): 밝은 땅에서도 읽히도록 먼저 보통 합성으로 어두운 테두리 바탕을 깔고, 그 위에 lighter로 빛을 얹는다
    const M=this.mk;M.length=0;const pul=.08*Math.sin(time*2.5);
    if(P.armor&&P.armor.t>0)M.push(['ring',EL[P.armor.s&&P.armor.s.el]||EL.earth,s.x,s.y,76,38,.6+pul]);
    if(P.ward&&M.length<3)M.push(['halo',EL.holy,s.x,s.y-64+2*Math.sin(time*2),32,12,.95]);
    if(P.hot&&P.hot.t>0&&M.length<3)M.push(['ring',EL.life,s.x,s.y,58,29,.55+pul]);
    if(M.length<3&&P.buffs)for(const id in P.buffs){if(M.length>=3)break;const b=P.buffs[id];if(!b||!(b.t>0)||id.startsWith('_'))continue;const sp=SPELLS[id],an=time*1.6+M.length*2.094;
      M.push(['glyph',sp&&EL[sp.el]||EL.arcane,s.x+Math.cos(an)*30,s.y-8+Math.sin(an)*11,19,19,1])}
    if(!M.length){c.globalAlpha=1;return}
    c.globalCompositeOperation='source-over';for(const m of M)this.img(c,this.base(m[0],m[1]),m[2],m[3],m[4],m[5],Math.min(1,m[6]*1.25));
    c.globalCompositeOperation='lighter';for(const m of M)this.img(c,m[0]==='ring'?this.ring(m[1]):m[0]==='halo'?this.halo(m[1]):this.glyph(m[1],'rune'),m[2],m[3],m[4],m[5],m[6]*.7);
    c.globalAlpha=1},
  mk:[],
  // 보통 합성용 바탕: 어두운 테두리 + 원소 색 선 (굽는 순간에만 그림)
  base(kind,col){const D='rgba(14,10,20,.62)',L=Kit.lit(col,.35);
    if(kind==='ring')return SC.get(`fxb/rb/${col}`,128,64,64,32,g=>{g.save();g.translate(64,32);g.scale(1,.5);g.lineCap='round';
      g.strokeStyle=D;g.lineWidth=7;g.beginPath();g.arc(0,0,54,0,6.283);g.stroke();g.strokeStyle=col;g.lineWidth=3;g.beginPath();g.arc(0,0,54,0,6.283);g.stroke();
      for(let i=0;i<12;i++){const a=i*.5236;g.save();g.translate(Math.cos(a)*54,Math.sin(a)*54);g.rotate(a);g.beginPath();g.moveTo(-5,0);g.lineTo(0,-3.4);g.lineTo(5,0);g.lineTo(0,3.4);g.closePath();g.fillStyle=L;g.fill();g.strokeStyle=D;g.lineWidth=1.6;g.stroke();g.restore()}g.restore()},{force:1});
    if(kind==='halo')return SC.get(`fxb/hb/${col}`,48,18,24,9,g=>{g.strokeStyle=D;g.lineWidth=5;g.beginPath();g.ellipse(24,9,19,5.5,0,0,6.283);g.stroke();g.strokeStyle=col;g.lineWidth=2.4;g.beginPath();g.ellipse(24,9,19,5.5,0,0,6.283);g.stroke()},{force:1});
    return SC.get(`fxb/gb/${col}`,24,24,12,12,g=>{g.lineJoin='round';g.beginPath();g.moveTo(12,3);g.lineTo(19,12);g.lineTo(12,21);g.lineTo(5,12);g.closePath();g.fillStyle=col;g.fill();g.strokeStyle=D;g.lineWidth=2.6;g.stroke();
      g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.moveTo(12,7);g.lineTo(15,12);g.lineTo(12,17);g.lineTo(9,12);g.closePath();g.fill();g.fillStyle=D;g.beginPath();g.arc(12,12,1.5,0,6.283);g.fill()},{force:1})}};
window.__fxr.FXB=FXB;
