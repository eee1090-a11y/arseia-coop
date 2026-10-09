/* 지역별 장식(사막·빙산·용암·정글·바다·들판·깊은 숲) — 종류×변형마다 한 번 굽고(SC), 매 프레임은 그림 한 장 + 가벼운 빛/불씨만 */
const RD=(()=>{
const TAU=6.283,PI=Math.PI;
const pl=a=>c=>{c.moveTo(a[0],a[1]);for(let i=2;i<a.length;i+=2)c.lineTo(a[i],a[i+1]);c.closePath()};
const sm=a=>c=>{const n=a.length/2,X=i=>a[(i%n)*2],Y=i=>a[(i%n)*2+1];c.moveTo((X(0)+X(1))/2,(Y(0)+Y(1))/2);for(let i=1;i<=n;i++)c.quadraticCurveTo(X(i),Y(i),(X(i)+X(i+1))/2,(Y(i)+Y(i+1))/2);c.closePath()};
const bb=a=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(let i=0;i<a.length;i+=2){x0=Math.min(x0,a[i]);x1=Math.max(x1,a[i]);y0=Math.min(y0,a[i+1]);y1=Math.max(y1,a[i+1])}return[x0,y0,x1,y1]};
// 명암+외곽광+외곽선 (sm=1 이면 부드러운 윤곽)
const S=(g,a,col,o,smo)=>{const b=bb(a);return Kit.solid(g,smo?sm(a):pl(a),b[0],b[1],b[2],b[3],col,o)};
const clip=(g,a,smo,fn)=>{g.save();g.beginPath();(smo?sm(a):pl(a))(g);g.clip();fn();g.restore()};
const dab=(g,x,y,rx,ry,rot,col,al)=>{g.globalAlpha=al==null?1:al;g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,rot||0,0,TAU);g.fill();g.globalAlpha=1};
const leaf=(g,x,y,s,a,col)=>{const c=Math.cos(a),n=Math.sin(a);g.fillStyle=col;g.beginPath();g.moveTo(x-c*s,y-n*s);g.quadraticCurveTo(x-n*s*.55,y+c*s*.55,x+c*s,y+n*s);g.quadraticCurveTo(x+n*s*.55,y-c*s*.55,x-c*s,y-n*s);g.fill()};
const shd=(g,x,y,rx,ry,a)=>Kit.shadow(g,x,y,rx,ry,a==null?.9:a);
const ln=(g,col,w,p,al)=>{g.globalAlpha=al==null?1:al;g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(p[0],p[1]);if(p.length===6)g.quadraticCurveTo(p[2],p[3],p[4],p[5]);else for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);g.stroke();g.globalAlpha=1};
// 둥근 막대(가지·갈비뼈·산호): 어두운 그림자 → 본색 → 왼쪽 위 밝은 테
const rod=(g,p,w,c)=>{const r=Kit.ramp(c);ln(g,r.lo,w+1.2,p.map((v,i)=>v+(i%2?.7:.5)));ln(g,c,w,p);ln(g,r.hi,Math.max(.6,w*.38),p.map((v,i)=>v-w*.22),.85)};
const mixL=(p,l)=>l<.33?Kit.mix(p[0],p[1],l/.33):l<.7?Kit.mix(p[1],p[2],(l-.33)/.37):Kit.mix(p[2],p[3],Math.min(1,(l-.7)/.3));
// 잎 덩어리: 어두운 바탕 위에 왼쪽 위로 갈수록 밝은 잎 붓질을 쌓는다
function foliage(g,r,cx,cy,rx,ry,p,n,sz,lift){g.fillStyle=Kit.lit(p[0],-.25);g.beginPath();g.ellipse(cx+rx*.06,cy+ry*.08,rx*.86,ry*.86,0,0,TAU);g.fill();
  for(let i=0;i<10;i++){const a=i/10*TAU;g.beginPath();g.arc(cx+Math.cos(a)*rx*.72,cy+Math.sin(a)*ry*.7,Math.min(rx,ry)*(.32+r()*.14),0,TAU);g.fill()}
  const ds=[];for(let i=0;i<n;i++){const a=r()*TAU,q=Math.sqrt(r()),x=cx+Math.cos(a)*rx*q,y=cy+Math.sin(a)*ry*q;ds.push([x,y,.5-(x-cx)/rx*.32-(y-cy)/ry*.42+(r()-.5)*.32+(lift||0)])}
  ds.sort((a,b)=>a[2]-b[2]);for(const [x,y,l] of ds)leaf(g,x,y,sz*(.7+r()*.6),-.6+r()*1.2+(r()<.5?PI:0),mixL(p,Math.max(0,l)));
  g.globalAlpha=.55;for(let i=0;i<n/8;i++){const a=PI*(1.05+r()*.6);leaf(g,cx+Math.cos(a)*rx*.86,cy+Math.sin(a)*ry*.84,sz*.6,a+1.6,p[3])}g.globalAlpha=1}
function trunk(g,a,c,tex){S(g,a,c,{tex:tex||'wood',texA:.55,rim:'rgba(255,230,190,.55)'},1);const b=bb(a);
  clip(g,a,1,()=>{for(let i=0;i<14;i++){const x=b[0]+(i/13)*(b[2]-b[0]);ln(g,i%3?'rgba(20,12,6,.35)':'rgba(255,230,190,.16)',.8,[x,b[3],x+(i%2?1.5:-1.5),(b[1]+b[3])/2,x,b[1]])}})}
// 바위 덩어리 + 윗면 + 금
function rock(g,r,a,c,o){o=o||{};S(g,a,c,{tex:'stone',texA:o.texA||.65,rim:o.rim},1);const b=bb(a);
  clip(g,a,1,()=>{g.globalAlpha=.35;g.fillStyle=Kit.lit(c,.35);g.beginPath();g.ellipse(b[0]+(b[2]-b[0])*.38,b[1]+(b[3]-b[1])*.22,(b[2]-b[0])*.36,(b[3]-b[1])*.22,-.15,0,TAU);g.fill();g.globalAlpha=1;
    for(let i=0;i<(o.cracks??3);i++){let x=b[0]+(b[2]-b[0])*(.25+r()*.5),y=b[1]+(b[3]-b[1])*(.2+r()*.4);const p=[x,y];for(let k=0;k<4;k++){x+=r()*8-3;y+=2+r()*4;p.push(x,y)}ln(g,'rgba(10,8,10,.45)',.9,p);ln(g,'rgba(255,240,220,.18)',.6,p.map((v,j)=>v-(j%2?.8:.8)))}})}
// 모래 둔덕
function sand(g,r,x,y,rx,ry,c){const a=[];for(let i=0;i<10;i++){const t=i/10*TAU;a.push(x+Math.cos(t)*rx*(.85+r()*.2),y+Math.sin(t)*ry*(t>PI?1.6:.7))}const cc=c||'#c8a46a';S(g,a,cc,{rim:'rgba(255,245,215,.55)',lineW:.4},1);
  clip(g,a,1,()=>{for(let i=0;i<3;i++){const yy=y-ry*.9+i*ry*.7;ln(g,Kit.rgb(Kit.lit(cc,-.3).match(/\d+/g),.18),.7,[x-rx,yy,x,yy-2,x+rx,yy+1])}})}
function grass(g,r,x,y,n,w,h,cols){for(let i=0;i<n;i++){const bx=x+(r()-.5)*w,hh=h*(.5+r()*.6),lean=(r()-.4)*6;ln(g,cols[(r()*cols.length)|0],1,[bx,y+(r()-.5)*3,bx+lean*.3,y-hh*.6,bx+lean,y-hh])}}
// 뼈 무더기 (얼음판이면 서리)
function bones(g,r,v,fz){const bc=fz?'#c8d6e2':'#dccfae';shd(g,6,2,30,8,.75);if(v===2||fz)sand(g,r,2,0,28,5,fz?'#dce8f4':'#c8a46a');
  rod(g,[-22,-2,0,-6,22,0],3,bc);for(let x=-18;x<20;x+=4)dab(g,x,-3.4+Math.abs(x)*.02,1.6,1.4,0,Kit.lit(bc,.25));
  for(let i=0;i<5;i++){const x=-15+i*7,h=18-i*2.4;rod(g,[x+3,-1,x+9,-h*1.25,x+11,1],1.6,Kit.lit(bc,-.15))}
  for(let i=0;i<5;i++){const x=-16+i*7,h=17-i*2.4;rod(g,[x,-4,x+7,-4-h*1.3,x+9,2],2.2,bc)}
  rod(g,[18,-2,22,-7,26,-2],2.6,bc);rod(g,[20,0,27,4],1.6,bc)
  const sx=-28,sy=-6;
  S(g,[sx-8,sy+2,sx-9,sy-6,sx-4,sy-11,sx+3,sy-11,sx+7,sy-5,sx+6,sy+1,sx+2,sy+4,sx-4,sy+4],bc,{tex:'bone',texA:.6,rim:'rgba(255,255,240,.9)'},1);
  dab(g,sx-3,sy-5,2,2.3,0,'#2a2018');dab(g,sx+2.6,sy-5,1.8,2.1,0,'#2a2018');dab(g,sx,sy-1,.9,1.3,0,'#3a2e22');g.fillStyle='#4a3e2e';for(let i=0;i<4;i++)g.fillRect(sx-3+i*1.6,sy+1.6,1,1.6);if(v===1&&!fz){rod(g,[sx-6,sy-8,sx-15,sy-10,sx-15,sy-19],2.2,'#e8dcc0');rod(g,[sx+5,sy-8,sx+13,sy-12,sx+11,sy-21],2.2,'#e8dcc0')}
  if(fz){g.globalAlpha=.55;for(let i=0;i<5;i++){const x=-20+r()*40;S(g,[x-4,1,x-1,-10-r()*8,x+4,1],'#a8d8f4',{rim:'rgba(255,255,255,.95)',lineW:.5})}g.globalAlpha=1;
    for(let i=0;i<30;i++)dab(g,-30+r()*56,-14+r()*14,.6+r()*.8,.5,0,'#fff',.55);sand(g,r,8,3,20,3.5,'#e8f0fa')}
  else if(v===2)sand(g,r,10,3,18,3.5,'#d0ac74')}
// 야자수: 굽은 줄기 마디 + 늘어진 잎
function palm(g,r,v){const lean=[10,16,-6][v],H=[74,84,66][v];shd(g,18,2,34,9,.8);
  const P=t=>[lean*t*t+(-4)*t*(1-t)*4,-H*t],L=[],R=[];for(let i=0;i<=10;i++){const t=i/10,[x,y]=P(t),w=5.2-2.4*t;L.push(x-w,y);R.unshift(x+w,y)}
  trunk(g,L.concat(R),'#8a6a48');for(let i=1;i<10;i++){const [x,y]=P(i/10),w=5.2-2.4*i/10;ln(g,'rgba(40,24,10,.6)',1,[x-w,y+1,x,y+2.6,x+w,y+1]);ln(g,'rgba(255,230,180,.35)',.7,[x-w,y-.4,x-w*.3,y+.8])}
  const [tx,ty]=P(1);const fr=[];for(let i=0;i<9;i++){const a=-PI+i/8*PI*1.0+(r()-.5)*.25+(i%2?.1:-.1),len=28+r()*10;fr.push([a,len,Math.sin(a)>-.5?0:1])}
  fr.sort((a,b)=>Math.sin(b[0])-Math.sin(a[0]));const pal=['#18321a','#2a5a26','#4e8834','#a8cc66'];
  const front=fr.slice(),draw=([a,len])=>{const ex=tx+Math.cos(a)*len,ey=ty+Math.sin(a)*len*.55+12,cx=tx+Math.cos(a)*len*.55,cy=ty-10+Math.sin(a)*8;
    const lit=.55-Math.cos(a)*.25-Math.sin(a)*.2;
    for(let k=1;k<=16;k++){const t=k/17,x=(1-t)*(1-t)*tx+2*(1-t)*t*cx+t*t*ex,y=(1-t)*(1-t)*ty+2*(1-t)*t*cy+t*t*ey,ll=9*(1-t*.6);
      ln(g,mixL(pal,lit*.8-.1),1.6,[x,y,x+Math.cos(a)*3-2,y+ll]);ln(g,mixL(pal,lit+.15),1.2,[x,y,x+Math.cos(a)*3+2,y+ll*.85])}
    ln(g,mixL(pal,lit+.3),1.1,[tx,ty,cx,cy,ex,ey])};
  front.forEach(draw);for(let i=0;i<3;i++){const x=tx-4+i*4,y=ty+3+(i%2)*2;dab(g,x,y,2.8,2.8,0,'#4a2e16');dab(g,x-.9,y-.9,1,1,0,'#a07a4a')}}
// 1단계 지형: 잎 뭉치 나무. 가지 끝마다 작은 잎 뭉치를 따로 얹고 사이에 틈을 남겨 둥근 덩어리처럼 보이지 않게 한다
function clump(g,r,cx,cy,R,p,lift){const n=Math.round(R*R*.9);
  g.globalAlpha=.9;for(let i=0;i<5;i++){const a=r()*TAU,q=r()*.55;dab(g,cx+Math.cos(a)*R*q,cy+Math.sin(a)*R*q*.8,R*(.32+r()*.2),R*(.26+r()*.16),r()*3,Kit.lit(p[0],-.2))}g.globalAlpha=1;
  const ds=[];for(let i=0;i<n;i++){const a=r()*TAU,q=Math.pow(r(),.7),x=cx+Math.cos(a)*R*q*1.08,y=cy+Math.sin(a)*R*q*.86;ds.push([x,y,.5-(x-cx)/R*.35-(y-cy)/R*.45+(r()-.5)*.35+(lift||0)])}
  ds.sort((a,b)=>a[2]-b[2]);for(const [x,y,l] of ds)leaf(g,x,y,2.6+r()*2.2,-1.2+r()*2.4+(r()<.5?PI:0),mixL(p,Math.max(0,l)))}
function branchTree(g,r,o){const p=o.pal,H=o.H,tw=o.tw;
  // 줄기: 아래가 넓고 위로 갈라진다
  const lean=(r()-.5)*8;trunk(g,[-tw*1.6,3,-tw*.9,-4,-tw*.75,-H*.35,-tw*.5+lean*.4,-H*.55,tw*.5+lean*.4,-H*.55,tw*.75,-H*.35,tw*.9,-4,tw*1.7,3,0,5],o.bark);
  const tips=[];const grow=(x,y,a,len,w,depth)=>{const ex=x+Math.cos(a)*len,ey=y+Math.sin(a)*len;rod(g,[x,y,(x+ex)/2+(r()-.5)*4,(y+ey)/2+(r()-.5)*4,ex,ey],w,o.bark);
    if(depth<o.depth&&o.mid)o.mid.push([ex,ey]);if(depth<=0||len<10){tips.push([ex,ey]);return}const k=depth>1?2:2+(r()<.4?1:0);for(let i=0;i<k;i++)grow(ex,ey,a+(i-(k-1)/2)*(.55+r()*.35)+(r()-.5)*.3,len*(.62+r()*.18),w*.62,depth-1)};
  const bx=lean*.4,by=-H*.55;o.mid=[];for(let i=0;i<o.limbs;i++)grow(bx,by,-PI/2+(i-(o.limbs-1)/2)*(o.spread||.62)+(r()-.5)*.25,H*(.28+r()*.08),tw*.85,o.depth);
  if(o.bare)return;
  // 뒤쪽(위) 잎 뭉치부터, 앞쪽(아래) 잎 뭉치를 나중에
  if(o.low)for(let i=0;i<3;i++)clump(g,r,(i-1)*o.R*1.1+(r()-.5)*6,-H*.6+(r()-.5)*6,o.R*1.05,p,-.3);
  for(const [x,y] of o.mid)clump(g,r,x,y-2,o.R*1.15,p,-.22);
  tips.sort((a,b)=>a[1]-b[1]);const back=tips.filter((t,i)=>i%2===0),front=tips.filter((t,i)=>i%2===1);
  for(const [x,y] of back)clump(g,r,x+(r()-.5)*6,y+(r()-.5)*4,o.R*(.85+r()*.35),p,-.08);
  for(const [x,y] of front)clump(g,r,x+(r()-.5)*6,y+4+(r()-.5)*4,o.R*(.75+r()*.3),p,.06);
  // 가장자리에 흩어진 잎 몇 장 (윤곽을 깬다)
  g.globalAlpha=.85;for(let i=0;i<26;i++){const t=tips[(r()*tips.length)|0],a=r()*TAU,d=o.R*(1+r()*.5);leaf(g,t[0]+Math.cos(a)*d,t[1]+Math.sin(a)*d*.8,2.2+r()*1.4,r()*TAU,mixL(p,.35+r()*.5))}g.globalAlpha=1}
function pineTree(g,r,o){const p=o.pal,H=o.H;trunk(g,[-4,2,-3,-H*.3,3,-H*.3,4,2],o.bark);
  // 층마다 아래로 처진 가지 다발: 끝이 들쭉날쭉하다
  const layers=o.layers;for(let i=0;i<layers;i++){const t=i/(layers-1),y=-H*.16-t*H*.78,rx=o.W*(1-t*.82)*(.9+r()*.2);
    {const a=[0,y-rx*.9];for(let k=0;k<=10;k++){const u=k/10;a.push(rx*(1-2*u)*.95,y+5+(k%2?-3:2)+Math.sin(u*PI)*4)}S(g,a,p[1],{rim:'rgba(170,210,160,.25)',lineW:.5})}
    for(const sd of [-1,1])for(let k=0;k<7;k++){const q=(k+1)/7,x0=sd*rx*q*.25,len=rx*(.55+q*.45),a=sd>0?.28+r()*.2:PI-.28-r()*.2;
      const ex=x0+Math.cos(a)*len,ey=y+Math.sin(a)*len*.5+4;const lit=sd<0?.62:.32;
      for(let m=0;m<14;m++){const u=m/14,x=x0+(ex-x0)*u,yy=y+(ey-y)*u;leaf(g,x,yy+2,3.2*(1-u*.4)+1,a+(m%2?1.2:-1.2)*.6+PI/2*0,mixL(p,lit+(r()-.5)*.25-u*.12))}
      ln(g,mixL(p,lit+.25),1,[x0,y,ex,ey],.7)}
    // 층 가운데 그늘
    dab(g,0,y+3,rx*.3,3,0,Kit.lit(p[0],-.3),.6)}
  for(let i=0;i<4;i++)leaf(g,(r()-.5)*3,-H*.94-i*3,3.5-i*.6,PI/2+(r()-.5)*.4,mixL(p,.6+i*.1))}
const D={
htree:{w:180,h:200,ax:88,ay:180,p(g,r,v){shd(g,18,4,52,15);branchTree(g,r,{pal:[['#0e1a0a','#20381a','#3e5e28','#86a44c'],['#0c180c','#1a3420','#335a36','#78a064'],['#121a0a','#2a3a16','#4e6a26','#98ac50']][v],H:[84,92,78][v],tw:6,bark:'#3e2e20',limbs:4,depth:2,R:18,spread:.42,low:1})}},
hbirch:{w:120,h:180,ax:58,ay:162,p(g,r,v){shd(g,14,3,30,9);branchTree(g,r,{pal:[['#14220c','#2e4a1a','#56782c','#a0bc5c'],['#16200c','#344c1a','#5e7a2c','#a8c060'],['#18200c','#3a4a18','#647a2a','#b0bc58']][v],H:104,tw:3.2,bark:'#cfc8b8',limbs:3,depth:2,R:12,spread:.4});
  for(let i=0;i<9;i++)dab(g,(r()-.5)*4,-6-r()*54,1.6,.7,0,'#2a2620',.8)}},
hpine:{w:110,h:160,ax:54,ay:144,p(g,r,v){shd(g,14,3,32,9);pineTree(g,r,{pal:[['#0a1610','#18321f','#2f5434','#6a9460'],['#0a1610','#163020','#2a5032','#5e8a5a'],['#0c1612','#1c3426','#365a3e','#749a6c']][v],H:[118,128,108][v],W:[42,46,38][v],layers:[7,8,6][v],bark:'#3e2c1e'})}},
hdead:{w:110,h:130,ax:52,ay:114,p(g,r,v){shd(g,14,3,30,8,.7);branchTree(g,r,{pal:['#000','#000','#000','#000'],H:[80,92,70][v],tw:4.5,bark:['#3a3028','#2e2a26','#443828'][v],limbs:3,depth:2,R:0,bare:1})}},
hbush:{w:70,h:56,ax:34,ay:44,p(g,r,v){shd(g,8,2,24,7,.75);const p=[['#122010','#2a4a1c','#56782e','#a8c060'],['#101e10','#22421e','#46703a','#98c070'],['#1c1e0e','#3e4418','#6e7a2a','#c0c060']][v];
  for(let i=0;i<4;i++)rod(g,[(r()-.5)*6,0,(r()-.5)*26,-10-r()*12],1.4,'#3a2a1a');clump(g,r,-9,-12,10,p);clump(g,r,9,-11,10,p);clump(g,r,0,-19,10,p,.1)}},
wheat:{w:70,h:50,ax:32,ay:38,p(g,r,v){shd(g,6,2,30,9,.7);const p=[['#5a5a1e','#8a8a30','#c8bc58','#f0e8a0'],['#7a5a18','#b88a30','#e8c460','#fff0b0'],['#8a5a14','#c8902a','#f0c050','#fff4c0']][v];
  dab(g,0,0,26,8,0,'#4a3a14',.6);const st=[];for(let i=0;i<70;i++){const a=r()*TAU,q=Math.sqrt(r());st.push([Math.cos(a)*24*q,Math.sin(a)*8*q])}st.sort((a,b)=>a[1]-b[1]);
  for(const [x,y] of st){const t=(y+8)/16,h=16+r()*10+(1-t)*3,lean=3+r()*4,c=mixL(p,.15+t*.45+r()*.15),hx=x+lean,hy=y-h;ln(g,c,.9,[x,y,x+lean*.3,y-h*.6,hx,hy]);
    g.save();g.translate(hx,hy-3);g.rotate(lean*.05);dab(g,0,0,1.8,4.6,0,mixL(p,.4+t*.4));dab(g,-.6,-.8,.8,3,0,mixL(p,.75+t*.25));for(let k=-1;k<2;k+=2)ln(g,mixL(p,.8),.4,[0,-3,k*1.6,-8]);g.restore()}}},
haystack:{w:64,h:60,ax:28,ay:46,p(g,r,v){shd(g,10,2,28,8);if(v===1)for(let i=0;i<24;i++){const x=-24+r()*48;ln(g,r()<.5?'#d8b058':'#8a6428',.8,[x,2+r()*3,x+r()*8-4,r()*3])}
  const a=[-20,1,-22,-12,-16,-26,-6,-34,6,-34,16,-26,22,-12,20,1,0,4];S(g,a,'#c4943c',{tex:'grass',texA:.5,rim:'rgba(255,240,190,.85)'},1);
  clip(g,a,1,()=>{for(let i=0;i<190;i++){const x=-22+r()*44,y=-36+r()*38,dx=x*.12,l=.5-x/44-(y+16)/50+(r()-.5)*.5;ln(g,l>.55?'#f4d888':l>.3?'#c89a40':'#6a4818',.8,[x,y,x+dx,y+5+r()*3],.75)}
    ln(g,'#5a3a18',2,[-22,-14,0,-8,22,-15],.8);ln(g,'#d8b068',.8,[-22,-15.5,0,-9.5,22,-16.5],.8)});
  for(let i=0;i<14;i++){const x=-6+r()*12;ln(g,i%2?'#f0d080':'#a07a30',.8,[x,-33,x+r()*8-4,-38-r()*4])}
  if(v===2){ln(g,'#4a3020',1.6,[18,-44,-2,8]);ln(g,'#a07850',.6,[17.4,-44.4,-2.6,7.6]);for(let k=-1;k<2;k++)ln(g,'#8a8a90',.9,[18+k*2.2,-44,19+k*2.6,-52])}}},
flowers:{w:56,h:46,ax:26,ay:34,p(g,r,v){shd(g,5,2,20,6,.7);grass(g,r,0,0,30,30,16,['#2e4a1e','#3e6a26','#5a8a30','#7aa83a']);
  const fc=[['#a070e0','#d8c0ff'],['#f0c030','#fff0a0'],['#e04848','#ffb0a0']][v],F=[];for(let i=0;i<12;i++)F.push([(r()-.5)*28,-6-r()*14,r()<.25]);F.sort((a,b)=>a[1]-b[1]);
  for(const [x,y,w] of F){ln(g,'#3a6a24',.8,[x+(r()-.5)*4,0,x,y]);const c=w?['#e8e4d8','#ffffff']:fc,s=w?2:2.4;for(let k=0;k<5;k++){const a=k/5*TAU+r();dab(g,x+Math.cos(a)*s,y+Math.sin(a)*s*.7,s*.9,s*.6,a,Kit.lit(c[0],-.12))}
    dab(g,x-.7,y-.8,s*.9,s*.6,0,c[1],.8);dab(g,x,y,1,.8,0,w?'#e8b830':'#4a2a10')}}},
windtree:{w:96,h:96,ax:34,ay:84,p(g,r,v){shd(g,22,3,34,9);trunk(g,[-6,1,-5,-14,-2,-30,6,-44,14,-52,18,-50,10,-40,5,-26,4,-12,7,1],'#5a4030');
  rod(g,[6,-40,-6,-50,-12,-52],2,'#4a3424');rod(g,[12,-48,24,-56,34,-56],1.8,'#4a3424');
  const p=[['#1e3018','#3a5a24','#6a8c34','#c0d870'],['#22321a','#465e26','#7a9036','#d0d880'],['#2e2a14','#5a5a22','#9a8a34','#e8d070']][v];
  foliage(g,r,30,-56,18,11,p,70,3.6);foliage(g,r,-6,-54,13,9,p,50,3.4);foliage(g,r,12,-64,26,14,p,120,4)}},
oak:{w:150,h:140,ax:70,ay:122,p(g,r,v){shd(g,20,4,58,17);const p=[['#101c0e','#24401c','#4a6e2c','#a4c060'],['#121a0c','#2e3e18','#5a6e28','#b8c060'],['#0e1c12','#1e4224','#3e6e3a','#98c878']][v];
  foliage(g,r,0,-98,40,24,p,150,5,-.12);foliage(g,r,-36,-84,28,20,p,100,4.6,-.1);foliage(g,r,36,-86,28,20,p,100,4.6,-.15);
  trunk(g,[-26,3,-14,-3,-11,-22,-11,-42,-20,-58,-8,-52,0,-62,6,-52,18,-60,11,-42,11,-22,15,-3,28,3,8,6,-8,6],'#4e3a28');
  clip(g,[-26,3,-14,-3,-11,-22,-11,-42,-20,-58,-8,-52,0,-62,6,-52,18,-60,11,-42,11,-22,15,-3,28,3,8,6,-8,6],1,()=>{for(let i=0;i<40;i++)leaf(g,-12+r()*12,-6-r()*30,2,r()*3,r()<.5?'#3e5a22':'#5a7a2c');dab(g,4,-30,3,4.5,0,'#1a120a')});
  rod(g,[-6,-50,-22,-62,-34,-70],3.4,'#4a3626');rod(g,[6,-50,24,-62,30,-72],3.4,'#4a3626');
  foliage(g,r,-28,-66,27,17,p,90,4.4,.05);foliage(g,r,26,-64,27,16,p,90,4.4);foliage(g,r,-2,-80,28,17,p,110,4.6,.08)}},
mushroom:{w:84,h:84,ax:38,ay:68,glow:1,p(g,r,v){shd(g,8,2,30,8);const cc=['#2aa8a0','#8a5ad8','#3a78e0'][v],hi=['#a8fff0','#e8c8ff','#b8e0ff'][v];
  const gr=g.createRadialGradient(0,-30,0,0,-30,40);gr.addColorStop(0,Kit.rgb(Kit.hex(hi),.22));gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(-40,-70,80,80);
  const M=[[-17,3,22,12,-.15],[0,0,40,22,.05],[15,6,14,8,.18],[-6,8,8,5,0],[23,9,7,4.5,.1]];
  for(const [x,y,h,cr,tl] of M){const tx=x+tl*h,ty=y-h,sw=cr*.28;trunk(g,[x-sw*1.2,y,x-sw,y-h*.5,tx-sw*.8,ty,tx+sw*.8,ty,x+sw,y-h*.5,x+sw*1.3,y],'#d8d0bc','bone');
    dab(g,tx,ty+cr*.1,cr*.95,cr*.32,tl,Kit.lit(cc,-.55));for(let k=-4;k<=4;k++)ln(g,Kit.lit(cc,-.25),.5,[tx,ty+cr*.15,tx+k*cr*.22,ty+cr*.3],.6);
    const cap=[tx-cr,ty+cr*.15,tx-cr*.85,ty-cr*.4,tx-cr*.4,ty-cr*.75,tx+cr*.2,ty-cr*.8,tx+cr*.75,ty-cr*.5,tx+cr,ty+cr*.1,tx,ty+cr*.32];S(g,cap,cc,{rim:Kit.rgb(Kit.hex(hi),.95),rimW:2.2},1);
    for(let k=0;k<Math.ceil(cr/2.6);k++){const a=PI*(1.1+r()*.8),q=.3+r()*.6;dab(g,tx+Math.cos(a)*cr*q,ty-cr*.2+Math.sin(a)*cr*.5*q,cr*.07+.5,cr*.05+.4,0,hi,.9)}}},
  gp(g,r,v){const hi=['#7affe8','#c890ff','#7ab8ff'][v];g.drawImage(Kit.glowCv(hi),-36,-70,72,56);g.drawImage(Kit.glowCv(hi),-28,-32,22,16);g.drawImage(Kit.glowCv(hi),6,-21,18,12)}},
fern:{w:70,h:48,ax:32,ay:34,p(g,r,v){shd(g,6,2,26,7,.7);const p=['#16301a','#2e5a26','#5a8a34','#b0d870'],fr=[];
  for(let i=0;i<11;i++){const a=-PI*(.08+i/10*.84)+(r()-.5)*.2;fr.push([a,18+r()*10+(v*3)])}for(let i=0;i<3;i++)fr.push([PI*(.15+i*.35),12+r()*5]);fr.sort((a,b)=>Math.sin(a[0])-Math.sin(b[0]));
  for(const [a,L] of fr){const ex=Math.cos(a)*L,ey=Math.sin(a)*L*.6-4,cx=Math.cos(a)*L*.5,cy=Math.sin(a)*L*.5-L*.45,lit=.45-Math.cos(a)*.2-Math.sin(a)*.25+(Math.sin(a)>0?.15:0);
    for(let k=1;k<=12;k++){const t=k/13,x=2*(1-t)*t*cx+t*t*ex,y=2*(1-t)*t*cy+t*t*ey,s=(1-t)*4.6+1.2,dx=2*(1-t)*cx+2*t*(ex-cx),dy=2*(1-t)*cy+2*t*(ey-cy),an=Math.atan2(dy,dx);
      leaf(g,x+Math.cos(an-1.2)*s*.9,y+Math.sin(an-1.2)*s*.9,s,an-1.2+.5,mixL(p,lit+.12));leaf(g,x+Math.cos(an+1.2)*s*.9,y+Math.sin(an+1.2)*s*.9,s,an+1.2-.5,mixL(p,lit-.12))}
    ln(g,mixL(p,lit+.3),.7,[0,0,cx,cy,ex,ey])}}},
mossrock:{w:76,h:56,ax:32,ay:40,p(g,r,v){shd(g,10,2,32,9);const a=[[-24,1,-27,-10,-18,-23,-4,-29,12,-25,23,-14,26,-2,10,5,-10,5],[-28,1,-24,-16,-10,-34,6,-36,18,-22,26,-6,12,5,-12,5],[-26,1,-26,-14,-14,-20,4,-21,20,-16,28,-4,12,5,-12,5]][v];
  rock(g,r,a,'#5a5850',{});const b=bb(a),p=['#1a2e14','#2e5222','#5a8a30','#a8d060'];
  clip(g,a,1,()=>{for(let i=0;i<220;i++){const x=b[0]+r()*(b[2]-b[0]),y=b[1]+r()*(b[3]-b[1])*.55+Math.abs(x)*.1;leaf(g,x,y,1.6+r()*1.4,r()*3,mixL(p,.75-(y-b[1])/(b[3]-b[1])*1.1-x/120+(r()-.5)*.3))}
    for(let i=0;i<8;i++){const x=b[0]+6+r()*(b[2]-b[0]-12);ln(g,'#3a6a24',1,[x,b[1]+8+Math.abs(x)*.2,x+r()*2-1,b[1]+14+r()*10],.7)}});
  grass(g,r,-14,3,8,12,7,['#2e4a1e','#4a7a2a']);grass(g,r,18,4,6,10,6,['#2e4a1e','#4a7a2a'])}},
cactus:{w:56,h:84,ax:24,ay:68,p(g,r,v){shd(g,10,2,20,6);sand(g,r,1,0,13,3,'#c8a066');const c='#4e8a3a';
  const col=(x,y0,y1,w)=>{const p=c=>{c.moveTo(x-w,y0);c.lineTo(x-w,y1+w);c.arc(x,y1+w,w,PI,0);c.lineTo(x+w,y0);c.closePath()};Kit.solid(g,p,x-w,y1,x+w,y0,c,{rim:'rgba(230,255,200,.8)'});
    g.save();g.beginPath();p(g);g.clip();for(let k=-2;k<=2;k++){const xx=x+k*w*.42;ln(g,'rgba(10,40,10,.45)',.8,[xx+.6,y0,xx+.6,y1]);ln(g,'rgba(200,255,170,.35)',.6,[xx-.5,y0,xx-.5,y1])}g.restore();
    for(let yy=y1+3;yy<y0;yy+=3.5)for(let k=-2;k<=2;k+=2)dab(g,x+k*w*.42,yy+(k?1.5:0),.5,.5,0,'#f0f0c8',.85)};
  const arm=(s,y,h,o)=>{const x=s*(6+o);g.lineCap='butt';const bx=s*5;Kit.solid(g,c=>{c.moveTo(bx,y+3);c.quadraticCurveTo(x,y+3,x,y-2);c.lineTo(x+(s>0?-4:4),y-2);c.quadraticCurveTo(x+(s>0?-4:4),y-2.5,bx,y-3);c.closePath()},bx-4,y-3,x+4,y+3,c,{});col(x,y,y-h,3.8)};
  if(v===0){col(0,0,-52,6.5);arm(1,-22,18,7)}else if(v===1){arm(-1,-28,14,6);col(0,0,-58,6.5);arm(1,-20,22,7)}else{col(-8,1,-20,5);col(4,2,-30,6);col(13,3,-14,4.5);for(const [x,y] of [[4,-35],[-8,-24]])for(let k=0;k<5;k++)dab(g,x+Math.cos(k*1.26)*2.2,y+Math.sin(k*1.26)*1.4,1.8,1.1,k*1.26,k%2?'#ff7aa0':'#ffb0c8')}}},
bones:{w:86,h:52,ax:46,ay:34,p(g,r,v){bones(g,r,v,0)}},
frozenbones:{w:86,h:52,ax:46,ay:34,p(g,r,v){bones(g,r,v,1)}},
sandrock:{w:76,h:80,ax:32,ay:64,p(g,r,v){shd(g,14,3,32,9);const c='#c08048';
  const strata=a=>{const b=bb(a);clip(g,a,v!==2,()=>{for(let y=b[1]+3;y<b[3];y+=3+r()*3){ln(g,r()<.5?'rgba(110,50,20,.35)':'rgba(255,220,160,.3)',1+r()*1.4,[b[0],y,(b[0]+b[2])/2,y+(r()-.5)*3,b[2],y+1])}})};
  if(v===0){sand(g,r,0,1,18,4,'#c89a60');const n=[-8,1,-6,-14,-9,-26,-6,-36,6,-36,9,-26,6,-14,10,1];S(g,n,c,{tex:'stone',texA:.5},1);strata(n);const cap=[-22,-40,-18,-52,-4,-58,14,-55,24,-45,18,-36,4,-33,-12,-34];S(g,cap,'#b87040',{tex:'stone',texA:.6},1);strata(cap)}
  else if(v===1){const a=[-27,2,-26,-30,-18,-44,0,-48,18,-42,26,-28,27,2,10,5,-12,5];S(g,a,c,{tex:'stone',texA:.6},1);strata(a);
    g.save();g.globalCompositeOperation='destination-out';dab(g,1,-12,9,13,0,'#000');g.restore();g.lineWidth=2;g.strokeStyle='#6a3a1a';g.beginPath();g.ellipse(1,-12,9,13,0,-PI*.5,PI*.6);g.stroke();g.strokeStyle='rgba(255,220,170,.6)';g.beginPath();g.ellipse(1,-12,9,13,0,PI*.7,PI*1.4);g.stroke();sand(g,r,2,3,24,4,'#c89a60')}
  else{const a=[-24,1,-24,-34,-20,-46,-6,-50,8,-48,20,-40,24,-30,24,1,8,6,-10,6];S(g,a,c,{tex:'stone',texA:.6});strata(a);S(g,[-20,-46,-6,-50,8,-48,20,-40,4,-38,-10,-40],'#e0a868',{texA:.2});sand(g,r,4,4,26,4,'#c89a60')}}},
palm:{w:110,h:104,ax:42,ay:92,p(g,r,v){palm(g,r,v)}},
ruinpillar:{w:64,h:100,ax:28,ay:84,p(g,r,v){shd(g,16,3,30,8);const H=[50,64,38][v],c='#cdbf9e';g.save();if(v===1)g.rotate(.12);
  const a=[-9,2,-9,-H,-5,-H-4,-1,-H+1,3,-H-6,7,-H-2,9,-H,9,2];S(g,a,c,{tex:'stone',texA:.6});clip(g,a,0,()=>{for(let k=-3;k<=3;k++){const x=k*2.6;ln(g,'rgba(90,70,40,.45)',.9,[x+.6,2,x+.6,-H]);ln(g,'rgba(255,248,220,.4)',.7,[x-.6,2,x-.6,-H])}for(let i=0;i<4;i++){const y=-r()*H;ln(g,'rgba(60,40,20,.4)',.8,[-9,y,-2,y+2,3,y-1])}});
  if(v===0){S(g,[-13,-H+2,-13,-H-5,13,-H-5,13,-H+2],'#d8cbaa',{tex:'stone',texA:.5});S(g,[-13,-H-5,-9,-H-9,17,-H-9,13,-H-5],'#ece2c8',{})}g.restore();
  if(v===1)S(g,[16,2,15,-6,24,-8,27,0,22,3],'#c4b490',{tex:'stone'});sand(g,r,2,2,24,5,'#d0a86c');sand(g,r,-12,4,12,3,'#c89e62')}},
snowpine:{w:76,h:108,ax:34,ay:92,p(g,r,v){shd(g,14,3,30,8);trunk(g,[-3,1,-3,-14,3,-14,3,1],'#3a2a1e');const sc=[1,1.08,.9][v];
  for(let i=0;i<4;i++){const y=-10-i*17*sc,rx=(26-i*5.5)*sc,h=26*sc,a=[0,y-h];for(let k=0;k<=8;k++){const t=k/8;a.push(rx-t*rx*2,y+(k%2?-2:3)+Math.sin(t*PI)*3)}
    S(g,a,'#1e3a32',{rim:'rgba(200,230,255,.5)'});clip(g,a,0,()=>{for(let k=0;k<40;k++){const x=(r()-.5)*rx*2,yy=y-r()*h*.8;ln(g,x<0?'#3a6a5a':'#0e2420',.7,[x,yy,x+(x<0?-2:2),yy+3],.7)}});
    const sn=[0,y-h-1,rx*.5,y-h*.55,rx*.62,y-h*.4];for(let k=0;k<=6;k++){const t=k/6;sn.push(rx*.6-t*rx*1.2,y-h*.38+(k%2?4:0)+Math.sin(t*PI)*3)}sn.push(-rx*.62,y-h*.42);
    S(g,sn,'#dde8f4',{rim:'rgba(255,255,255,1)',lineW:.6},1)}
  sand(g,r,2,2,18,3.5,'#e4eef8')}},
icespike:{w:68,h:84,ax:30,ay:68,glow:1,p(g,r,v){shd(g,10,2,26,7,.7);const sets=[[[-10,5,30,-.25],[2,7,52,.05],[13,5,34,.3],[-3,3,18,-.5],[20,3,14,.6]],[[-6,6,42,-.15],[9,6,40,.2],[-16,4,20,-.5],[18,3,22,.45]],[[0,8,58,0],[-12,4,26,-.35],[12,4,30,.35],[5,3,14,.7]]][v];
  sets.sort((a,b)=>b[2]-a[2]);sand(g,r,2,2,24,4,'#cfe2f2');
  for(const [x,w,h,l] of sets){const tx=x+l*h*.6,ty=-h,mx=x+w*.15,my=2;g.globalAlpha=.94;
    S(g,[x-w,0,tx,ty,mx,my],'#bfe6ff',{rim:'rgba(255,255,255,1)',lineW:.6});S(g,[mx,my,tx,ty,x+w,0],'#3a78c0',{rim:'rgba(220,245,255,.6)',lineW:.6});g.globalAlpha=1;
    ln(g,'#ffffff',.9,[mx,my,tx,ty],.9);ln(g,'rgba(255,255,255,.55)',1.4,[x-w*.5,-h*.15,tx-w*.2,ty+h*.35]);ln(g,'rgba(20,60,120,.35)',.6,[x+w*.6,-h*.1,(x+tx)/2+w*.3,-h*.55])}},
  gp(g,r,v){g.globalAlpha=.6;g.drawImage(Kit.glowCv('#6ac8ff'),-24,-50,48,50)}},
iceboulder:{w:72,h:56,ax:32,ay:40,p(g,r,v){shd(g,10,2,30,9);const a=[[-24,1,-26,-12,-16,-26,0,-30,16,-26,25,-12,24,1,8,6,-10,6],[-28,1,-24,-18,-8,-26,12,-28,24,-16,28,1,10,6,-12,6],[-20,1,-22,-16,-12,-34,4,-36,18,-24,22,-8,20,2,4,6,-10,5]][v];
  rock(g,r,a,'#6a8098',{});const b=bb(a),top=[];for(let k=0;k<=8;k++){const t=k/8,x=b[0]+2+t*(b[2]-b[0]-4);top.push(x,b[1]+(b[3]-b[1])*(.28+Math.sin(t*PI*3)*.06)+Math.abs(t-.5)*8)}
  clip(g,a,1,()=>{const sn=[b[0]-4,b[1]-4,b[2]+4,b[1]-4].concat(top.slice().reverse().reduce((o,_,i,ar)=>i%2?o:o.concat([ar[i+1],ar[i]]),[]));S(g,sn,'#e8f2fc',{rim:'rgba(255,255,255,1)',lineW:.6});
    for(let i=2;i<top.length-2;i+=4)S(g,[top[i]-1.4,top[i+1]-1,top[i]+1.4,top[i+1]-1,top[i]+.2,top[i+1]+4+r()*4],'#cfeaff',{lineW:.4});
    for(let i=0;i<5;i++){const x=b[0]+6+r()*(b[2]-b[0])*.5;ln(g,'rgba(255,255,255,.55)',.8,[x,b[1]+(b[3]-b[1])*.55,x+4,b[1]+(b[3]-b[1])*.75])}});
  sand(g,r,6,3,22,3.2,'#e4eef8')}},
jungletree:{w:150,h:150,ax:68,ay:130,p(g,r,v){shd(g,22,4,54,15);const p=['#0a2210','#1a5226','#3a8a32','#b0e060'];
  foliage(g,r,0,-110,40,18,p,140,5,-.15);foliage(g,r,-40,-100,28,14,p,90,4.6,-.1);foliage(g,r,40,-102,28,14,p,90,4.6,-.15);
  const t=[-22,2,-10,-6,-6,-30,-5,-70,-4,-92,4,-92,5,-70,6,-30,9,-6,24,2,10,0,4,4,-4,4,-10,0];trunk(g,t,'#6a5a46');
  clip(g,t,1,()=>{for(let i=0;i<30;i++)leaf(g,-5+r()*6,-20-r()*60,1.6,r()*3,r()<.5?'#2e6a28':'#4a8a30')});
  rod(g,[-2,-86,-20,-96,-34,-98],2.6,'#5a4a38');rod(g,[2,-84,22,-94,36,-98],2.6,'#5a4a38');
  foliage(g,r,-26,-94,30,13,p,100,4.6,.05);foliage(g,r,26,-92,30,13,p,100,4.6);foliage(g,r,0,-100,26,12,p,80,4.6,.1);
  for(let i=0;i<9;i++){const x=-44+r()*88,y0=-90+Math.abs(x)*.1,L=18+r()*40,sw=(r()-.5)*8;ln(g,'#1e3a14',1.1,[x,y0,x+sw,y0+L*.6,x+sw*.4,y0+L]);for(let k=0;k<5;k++){const tt=r();leaf(g,x+sw*tt*.8,y0+L*tt,2,1.2+r(),r()<.5?'#3a7a2a':'#6aa83a')}}}},
bigleaf:{w:84,h:64,ax:38,ay:46,p(g,r,v){shd(g,6,2,30,8,.75);const p=['#0e3a18','#1e6a2a','#3e9a38','#b8ec70'],Ls=[];
  for(let i=0;i<6;i++){const a=-PI*(.12+i/5*.76)+(r()-.5)*.2;Ls.push([a,26+r()*10])}Ls.push([PI*.25,22],[PI*.75,20]);Ls.sort((a,b)=>Math.sin(a[0])-Math.sin(b[0]));
  for(const [a,L] of Ls){const ca=Math.cos(a),sa=Math.sin(a)*.62,ux=ca,uy=sa-.5,n=Math.hypot(ux,uy),dx=ux/n,dy=uy/n,nx=-dy,ny=dx,W=L*(.32+v*.04),bx=dx*6,by=dy*6;
    ln(g,'#2e5a1e',1.4,[0,0,bx,by]);const pts=[];for(let k=0;k<=12;k++){const t=k/12,w=Math.sin(t*PI)*W*(1-t*.3)*(k%2&&v===2?.85:1);pts.push(bx+dx*L*t+nx*w,by+dy*L*t+ny*w+t*t*6)}for(let k=11;k>0;k--){const t=k/12,w=Math.sin(t*PI)*W*(1-t*.3);pts.push(bx+dx*L*t-nx*w,by+dy*L*t-ny*w+t*t*6)}
    const lit=.5-ca*.18-Math.sin(a)*.2;S(g,pts,mixL(p,lit),{rim:'rgba(230,255,190,.7)'});const ex=bx+dx*L,ey=by+dy*L+6;
    clip(g,pts,0,()=>{g.globalAlpha=.25;g.fillStyle=nx*-1-ny>0?'#000':'#fff';g.beginPath();g.moveTo(bx,by);for(let k=0;k<=12;k++){const t=k/12,w=Math.sin(t*PI)*W;g.lineTo(bx+dx*L*t+nx*w*1.2,by+dy*L*t+ny*w*1.2+t*t*6)}g.closePath();g.fill();g.globalAlpha=1;
      for(let k=1;k<9;k++){const t=k/9,x=bx+dx*L*t,y=by+dy*L*t+t*t*6;ln(g,'rgba(10,40,10,.35)',.6,[x,y,x+nx*W+dx*4,y+ny*W+dy*4]);ln(g,'rgba(10,40,10,.35)',.6,[x,y,x-nx*W+dx*4,y-ny*W+dy*4])}});
    ln(g,mixL(p,lit+.35),.9,[bx,by,bx+dx*L*.5,by+dy*L*.5+1.5,ex,ey])}}},
templestone:{w:80,h:76,ax:36,ay:56,p(g,r,v){const H=[30,36,24][v];shd(g,14,4,34,10);const L=[-28,-6],F=[0,8],R=[26,-6],B=[-2,-20],u=(p,h)=>[p[0],p[1]-h];
  const lf=[...L,...F,...u(F,H),...u(L,H)],rf=[...F,...R,...u(R,H),...u(F,H)],tf=[...u(L,H),...u(F,H),...u(R,H),...u(B,H)];
  S(g,lf,'#8a8470',{tex:'stone',texA:.7});S(g,rf,'#5e5a4c',{tex:'stone',texA:.7});S(g,tf,'#a8a28a',{tex:'stone',texA:.6});
  g.save();g.transform(28/28,14/28,0,1,-28,-6-H);clip(g,[1,2,27,2,27,H-2,1,H-2],0,()=>{const cx=14,cy=H/2;g.strokeStyle='rgba(30,28,20,.7)';g.lineWidth=1.4;
    g.beginPath();g.arc(cx,cy,7,0,TAU);g.stroke();g.beginPath();g.arc(cx,cy,3,0,TAU);g.stroke();for(const yy of [4,H-4]){g.beginPath();g.moveTo(3,yy);g.lineTo(25,yy);g.stroke()}
    g.strokeStyle='rgba(255,250,220,.4)';g.lineWidth=.7;g.beginPath();g.arc(cx+.7,cy+.7,7,.3,2.2);g.stroke();for(let k=0;k<5;k++){g.fillStyle='rgba(30,28,20,.6)';g.fillRect(3+k*5,6,2,2)}});g.restore();
  if(v===1){g.save();g.globalCompositeOperation='destination-out';g.beginPath();g.moveTo(26,-6-H);g.lineTo(14,-H-2);g.lineTo(26,-H+10);g.fill();g.restore();S(g,[26,-H+10,14,-H-2,18,-H+12],'#4e4a3e',{})}
  const p=['#1a3a14','#2e6a24','#5a9a34','#b0e070'];for(let i=0;i<120;i++){const t=r(),s=r(),x=-28+t*28+s*26-2*(1-s)*0,y=-6-H+t*14-s*14+(r()-.5)*4;if(r()<.6)leaf(g,x,y-(r()*4),1.8+r(),r()*3,mixL(p,.4+r()*.6))}
  for(let i=0;i<6;i++){const t=r(),x=-28+t*28,y=-6-H+t*14,L=8+r()*16;ln(g,'#2e5a1e',1,[x,y,x+1,y+L*.6,x-1,y+L]);for(let k=0;k<3;k++)leaf(g,x,y+L*r(),1.6,1.4,'#4a8a2e')}
  grass(g,r,-18,-1,6,10,6,['#2e5a1e','#4a7a2a'])}},
lavarock:{w:72,h:56,ax:32,ay:40,glow:1,p(g,r,v){shd(g,10,2,30,9);const a=[[-24,1,-26,-10,-18,-22,-6,-28,10,-26,22,-15,26,-2,10,5,-10,5],[-28,1,-22,-20,-6,-34,8,-32,20,-18,26,1,10,6,-12,6],[-22,1,-26,-8,-14,-18,2,-20,18,-15,24,-4,14,5,-8,5]][v];
  rock(g,r,a,'#2c2628',{rim:'rgba(255,170,110,.5)',cracks:0});clip(g,a,1,()=>cracks(g,a,v,'#5a1a08',1.6))},
  gp(g,r,v){const a=[[-24,1,-26,-10,-18,-22,-6,-28,10,-26,22,-15,26,-2,10,5,-10,5],[-28,1,-22,-20,-6,-34,8,-32,20,-18,26,1,10,6,-12,6],[-22,1,-26,-8,-14,-18,2,-20,18,-15,24,-4,14,5,-8,5]][v];
  clip(g,a,1,()=>{cracks(g,a,v,'rgba(255,90,20,.5)',3.4);cracks(g,a,v,'#ff8a2a',1.5);cracks(g,a,v,'#fff0a0',.6)});g.globalAlpha=.5;g.drawImage(Kit.glowCv('#ff6a1a'),-30,-8,60,16)}},
obsidian:{w:64,h:72,ax:28,ay:54,p(g,r,v){shd(g,10,2,26,7);const sets=[[[-8,6,40,-.2],[6,7,30,.25],[16,4,16,.5],[-16,4,14,-.5]],[[0,8,48,.05],[-12,5,22,-.4],[13,5,24,.4]],[[-6,6,28,-.3],[8,6,36,.15],[18,4,12,.6],[-14,3,10,-.6]]][v].sort((a,b)=>b[2]-a[2]);
  for(let i=0;i<10;i++){const x=-22+r()*44,y=(r()-.3)*6;S(g,[x-2,y,x,y-2-r()*2,x+2.4,y],'#1a1620',{lineW:.4})}
  for(const [x,w,h,l] of sets){const tx=x+l*h*.6,ty=-h,mx=x+w*.1,my=2;S(g,[x-w,0,tx,ty,mx,my],'#3e3650',{rim:'rgba(220,200,255,.9)',lineW:.6});S(g,[mx,my,tx,ty,x+w,0],'#100c16',{rim:'rgba(160,140,220,.4)',lineW:.6});
    ln(g,'rgba(200,180,255,.45)',1.6,[x-w*.55,-h*.12,tx-w*.25,ty+h*.4]);ln(g,'#ffffff',.7,[mx,my,tx,ty],.8);ln(g,'rgba(120,200,255,.5)',.7,[mx+w*.4,my-2,(mx+tx)/2+w*.3,-h*.5])}}},
ashtree:{w:84,h:104,ax:36,ay:90,glow:1,p(g,r,v){shd(g,18,3,32,9);sand(g,r,2,1,16,3,'#4a4440');const t=[-7,2,-5,-20,-6,-40,-3,-56,2,-56,4,-38,5,-18,8,2];trunk(g,t,'#2a2420');
  const br=(x,y,a,L,w,d)=>{const ex=x+Math.cos(a)*L,ey=y+Math.sin(a)*L;ln(g,'#16120f',w+1,[x+.5,y+.5,ex+.5,ey+.5]);ln(g,'#2e2824',w,[x,y,ex,ey]);ln(g,'#8a7c70',Math.max(.5,w*.35),[x-w*.25,y-w*.3,ex-w*.25,ey-w*.3],.6);if(d>0){br(ex,ey,a-.45-r()*.3,L*.68,w*.65,d-1);br(ex,ey,a+.35+r()*.3,L*.62,w*.6,d-1)}};
  br(-1,-52,-PI/2-.1,14,4,3);br(-4,-34,-PI*.82,12,2.6,2);br(4,-28,-PI*.2,12,2.4,2+(v===2?1:0));
  clip(g,t,1,()=>{const q=mulberry(77+v);for(let i=0;i<5;i++){const y=-6-q()*44;ln(g,'#1a0a04',1.2,[-3,y,0,y-4,2,y-9])}})},
  gp(g,r,v){r=mulberry(77+v);for(let i=0;i<5;i++){const y=-6-r()*44;ln(g,'#ff7a2a',1,[-3,y,0,y-4,2,y-9]);ln(g,'#ffe08a',.4,[-3,y,0,y-4,2,y-9])}g.globalAlpha=.4;g.drawImage(Kit.glowCv('#ff5a1a'),-16,-6,32,10)}},
vent:{w:76,h:56,ax:34,ay:36,glow:1,p(g,r,v){shd(g,6,3,30,9,.7);dab(g,0,0,24,10,0,'#1a1214');const gr=g.createRadialGradient(0,0,0,0,0,18);gr.addColorStop(0,'#fff0a0');gr.addColorStop(.35,'#ff8a2a');gr.addColorStop(1,'#5a1206');g.fillStyle=gr;g.beginPath();g.ellipse(0,0,17,6,0,0,TAU);g.fill();
  for(let i=0;i<10;i++){const a=i/10*TAU+r()*.2,x=Math.cos(a)*20,y=Math.sin(a)*8,s=4+r()*4;S(g,[x-s,y+2,x-s*.6,y-s*.9,x+s*.4,y-s,x+s,y+1,x,y+3],'#302a2c',{tex:'stone',rim:'rgba(255,160,90,.55)'})}},
  gp(g,r,v){g.drawImage(Kit.glowCv('#ff6a1a'),-30,-18,60,30);g.globalAlpha=.5;g.drawImage(Kit.glowCv('#ffb050'),-14,-30,28,40)}},
coral:{w:64,h:60,ax:28,ay:44,p(g,r,v){shd(g,6,2,24,7,.7);sand(g,r,0,1,22,4,'#d8b880');const c=['#e86a8a','#f08a4a','#c05ac0'][v];
  if(v===1){const a=[-20,1,-22,-10,-14,-18,-4,-20,4,-14,2,1];S(g,a,'#e8a060',{tex:'bone',texA:.5},1);clip(g,a,1,()=>{for(let i=0;i<8;i++)ln(g,'rgba(120,40,20,.5)',.8,[-20+r()*6,-16+i*2,-12+r()*6,-17+i*2.4,-2,-15+i*2])})}
  const br=(x,y,a,L,w,d)=>{const ex=x+Math.cos(a)*L,ey=y+Math.sin(a)*L;rod(g,[x,y,ex,ey],w,c);if(d>0){br(ex,ey,a-.4-r()*.3,L*.75,w*.82,d-1);if(r()<.85)br(ex,ey,a+.4+r()*.3,L*.72,w*.8,d-1)}else{dab(g,ex,ey,w*.75,w*.75,0,Kit.lit(c,.35))}};
  br(4,0,-PI/2+.1,12,4,3);br(-6,1,-PI/2-.5,9,3,2);br(14,2,-PI/2+.6,8,2.6,2);
  for(let i=0;i<14;i++)dab(g,-14+r()*32,-30+r()*28,.6,.6,0,'#fff4e8',.7);for(let i=0;i<4;i++){const x=-18+r()*36;dab(g,x,2,1.6,1,0,'#f4e8d0')}}},
shell:{w:70,h:44,ax:32,ay:30,p(g,r,v){g.scale(1.6,1.6);shd(g,4,2,15,4.5,.7);
  const scal=(x,y,s,c)=>{const a=[x-9*s,y-4*s,x-6*s,y-12*s,x,y-14*s,x+6*s,y-12*s,x+9*s,y-4*s,x+2*s,y+1*s,x-2*s,y+1*s];S(g,a,c,{tex:'bone',texA:.4,rim:'rgba(255,255,255,.9)'},1);
    clip(g,a,1,()=>{for(let k=-4;k<=4;k++)ln(g,'rgba(120,60,40,.4)',.7,[x,y,x+k*2.4*s,y-14*s]);for(let k=-4;k<=4;k++)ln(g,'rgba(255,255,240,.45)',.5,[x-.6,y,x+k*2.4*s-.8,y-14*s])});S(g,[x-3*s,y,x-4*s,y+2.6*s,x+4*s,y+2.6*s,x+3*s,y],c,{})};
  if(v===0)scal(0,0,1,'#f0c8a8');
  else if(v===1){const a=[-12,-2,-8,-9,2,-11,12,-7,14,-3,6,1,-4,2];S(g,a,'#e8d0b0',{tex:'bone',texA:.5,rim:'rgba(255,255,255,.9)'},1);clip(g,a,1,()=>{for(let k=0;k<5;k++)ln(g,'rgba(110,70,40,.5)',.8,[-10+k*5,-9,-8+k*5.4,1])});
    for(let k=0;k<4;k++)S(g,[-6+k*5,-9,-5+k*5,-13,-3+k*5,-9],'#e8d8c0',{lineW:.4});S(g,[4,-6,12,-6,13,-2,6,0],'#f08aa0',{lineW:.5})}
  else{scal(-6,0,.65,'#e8b8c8');const sx=8,sy=-2;const st=[];for(let k=0;k<10;k++){const a=-PI/2+k/10*TAU,q=k%2?3:9;st.push(sx+Math.cos(a)*q,sy+Math.sin(a)*q*.62)}S(g,st,'#e8783a',{tex:'leather',texA:.6,rim:'rgba(255,230,180,.9)'},1);for(let k=0;k<12;k++)dab(g,sx+(r()-.5)*10,sy+(r()-.5)*6,.5,.5,0,'#ffd8a0')}}},
searock:{w:78,h:58,ax:34,ay:42,p(g,r,v){shd(g,10,2,30,8,.7);const a=[[-24,1,-26,-12,-16,-26,-2,-32,12,-28,22,-16,26,-2,10,5,-10,5],[-30,1,-24,-16,-10,-22,6,-22,22,-14,28,1,10,6,-12,6],[-18,1,-22,-16,-12,-36,2,-40,14,-30,20,-12,18,2,4,6,-8,5]][v];
  dab(g,0,1,32,8,0,'rgba(90,120,130,.22)');rock(g,r,a,'#2a3236',{rim:'rgba(220,240,255,.75)'});const b=bb(a);
  clip(g,a,1,()=>{for(let i=0;i<9;i++){const x=b[0]+4+r()*(b[2]-b[0])*.55,y=b[1]+4+r()*(b[3]-b[1])*.5;ln(g,'rgba(255,255,255,.6)',.8,[x,y,x+3+r()*4,y+1+r()*3])}
    for(let i=0;i<20;i++)dab(g,b[0]+r()*(b[2]-b[0]),b[3]-r()*10,.8,.6,0,'#c8c0b0',.8);for(let i=0;i<8;i++){const x=b[0]+r()*(b[2]-b[0]);ln(g,'#2e4a20',1.1,[x,b[3],x+r()*4-2,b[3]-6-r()*6],.85)}});
  for(let i=0;i<26;i++){const t=r()*TAU,x=Math.cos(t)*(26+r()*4),y=2+Math.sin(t)*(6.5+r()*1.5);if(Math.sin(t)>-.2)dab(g,x,y,2+r()*5,.7+r()*.6,Math.cos(t)*.25,'#f4faff',.35+r()*.4)}g.globalAlpha=.6;g.strokeStyle='#e8f6ff';g.lineWidth=.8;g.beginPath();g.ellipse(0,2,28,7.5,0,.1,PI-.1);g.stroke();g.globalAlpha=1}},
wreck:{w:116,h:84,ax:52,ay:60,p(g,r,v){shd(g,12,4,50,12);sand(g,r,0,2,46,6,'#c8a46a');
  const in_=[-40,-6,-36,-18,-14,-26,12,-30,36,-38,40,-32,30,-20,6,-14,-18,-8];S(g,in_,'#2e2016',{});
  for(let i=0;i<6;i++){const x=-30+i*12,y=-22-i*2.4,h=10+r()*14;rod(g,[x,y+8,x-2,y-h*.5,x+2,y-h],2.6,'#4e3624')}
  const a=[-44,1,-40,-12,-20,-20,10,-24,36,-34,44,-30,40,-14,22,0,-10,6,-36,6];S(g,a,'#5e4430',{tex:'wood',texA:.7,rim:'rgba(255,220,170,.6)'},1);
  clip(g,a,1,()=>{for(let k=1;k<6;k++){const o=k*5;ln(g,'rgba(20,10,4,.55)',1,[-44,-10+o,-6,-20+o,44,-30+o]);ln(g,'rgba(255,220,170,.2)',.6,[-44,-11+o,-6,-21+o,44,-31+o])}
    for(let i=0;i<20;i++)dab(g,-30+r()*60,-2+r()*6,.9,.7,0,'#d8d0c0',.7);for(let i=0;i<8;i++){const x=-34+r()*60;ln(g,'#2e4a20',1,[x,6,x+2,-2-r()*4],.7)}});
  rod(g,[-40,-12,-6,-21,40,-34],2.6,'#6a5038');if(v!==1){rod(g,[-4,-24,-14,-56,-18,-66],3.4,'#4a3424');ln(g,'#c8b890',.6,[-14,-56,8,-24]);ln(g,'#c8b890',.6,[-16,-60,-30,-14])}
  if(v===2)S(g,[18,-2,30,-8,34,-2,22,4],'#5a4030',{tex:'wood'})}},
edgeportal:{w:124,h:150,ax:58,ay:128,p(g,r,v){shd(g,14,6,58,14);S(g,[-50,2,-44,-6,44,-6,52,2,40,8,-40,8],'#5a5660',{tex:'stone',texA:.6});const st='#7a7484';
  for(const s of [-1,1])for(let i=0;i<4;i++){const y=-4-i*17,x0=s<0?-42:28,w=14;S(g,[x0,y,x0+w,y,x0+w,y-16,x0,y-16],s<0?st:Kit.lit(st,-.12),{tex:'stone',texA:.7});S(g,[x0+w,y,x0+w+5,y-3,x0+w+5,y-19,x0+w,y-16],Kit.lit(st,-.45),{tex:'stone'})}
  for(let i=0;i<9;i++){const a0=PI+i/9*PI+.02,a1=PI+(i+1)/9*PI-.02,R0=28,R1=42,cy=-72,p=[];for(const [a,R] of [[a0,R0],[a0,R1],[a1,R1],[a1,R0]])p.push(Math.cos(a)*R,cy+Math.sin(a)*R);
    S(g,p,i===4?'#8a8494':Kit.lit(st,.12-i*.04),{tex:'stone',texA:.7})}
  S(g,[-7,-118,7,-118,5,-104,-5,-104],'#9a94a4',{tex:'stone'});for(let i=0;i<6;i++)dab(g,-40+r()*80,-r()*110,1.4,1,0,'#4a6a2e',.5)}},
};
// 용암 균열: 변형마다 같은 시드라 바탕/빛 그림이 정확히 겹친다
function cracks(g,a,v,col,w){const r=mulberry(911+v*7),b=bb(a);for(let i=0;i<5;i++){let x=b[0]+(b[2]-b[0])*(.15+r()*.7),y=b[1]+(b[3]-b[1])*(.15+r()*.3);const p=[x,y];for(let k=0;k<5;k++){x+=r()*10-5;y+=2+r()*5;p.push(x,y)}ln(g,col,w,p)}}
const scale=()=>Math.min(2.4,Math.max(1,DPR)*1.35);
function spr(k,vi,gl){const df=D[k];return SC.get('rd/'+k+'/'+vi+(gl?'/g':''),df.w,df.h,df.ax,df.ay,g=>{g.translate(df.ax,df.ay);(gl?df.gp:df.p)(g,mulberry(k.length*131+k.charCodeAt(0)*7+vi*1013),vi)},{scale:scale()})}
// 매 프레임 덧그림 (가산 합성, 몇 개의 호·점만)
function anim(c,d,vi,t){const k=d.k,ph=d.v*9;
  if(D[k].glow){const e=spr(k,vi,1);if(e){c.globalCompositeOperation='lighter';c.globalAlpha=k==='icespike'?.35+.25*Math.sin(t*1.3+ph):k==='vent'?.75+.25*Math.sin(t*5+ph):.6+.35*Math.sin(t*(k==='mushroom'?1.6:2.4)+ph);SC.draw(c,e,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over'}}
  if(k==='vent'){c.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const p=(t*.55+i/7+d.v)%1,x=Math.sin(i*7.3)*9+Math.sin(t*2+i)*4*p,y=-2-p*58,s=1.8*(1-p)+.4;c.fillStyle=i%2?'rgba(255,200,90,'+(1-p)+')':'rgba(255,110,30,'+(1-p)+')';c.fillRect(x-s/2,y-s/2,s,s)}c.globalCompositeOperation='source-over'}
  else if(k==='mushroom'){c.globalCompositeOperation='lighter';c.fillStyle=['#7affe8','#d0a0ff','#90c8ff'][vi];for(let i=0;i<4;i++){const p=(t*.18+i/4+d.v)%1;c.globalAlpha=Math.sin(p*PI)*.8;c.beginPath();c.arc(Math.sin(i*5.1+t*.8)*16,-14-p*50,1.1,0,TAU);c.fill()}c.globalAlpha=1;c.globalCompositeOperation='source-over'}
  else if(k==='icespike'){const p=(t*.5+d.v*3)%3;if(p<.6){const a=Math.sin(p/.6*PI),x=[2,-6,0][vi],y=[-50,-40,-56][vi];c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,255,255,'+a+')';c.fillRect(x-.5,y-5*a,1,10*a);c.fillRect(x-5*a,y-.5,10*a,1);c.globalCompositeOperation='source-over'}}
  else if(k==='searock'){const p=(t*.4+d.v)%1;c.strokeStyle='rgba(240,250,255,'+(.5*(1-p))+')';c.lineWidth=1.2;c.beginPath();c.ellipse(0,2,26+p*10,6+p*3,0,0,TAU);c.stroke()}
  else if(k==='edgeportal'){const col=d.col||'#9ad8ff',cy=-48;c.globalCompositeOperation='lighter';c.globalAlpha=.55+.15*Math.sin(t*2);c.drawImage(Kit.glowCv(col),-30,cy-54,60,108);c.globalAlpha=1;
    for(let i=0;i<4;i++){const sp=t*(1.6+i*.5)*(i%2?-1:1)+i*1.7;c.strokeStyle=col;c.globalAlpha=.75-i*.13;c.lineWidth=2.4-i*.4;c.beginPath();c.ellipse(0,cy,22-i*4.5,44-i*9,0,sp,sp+3.6);c.stroke()}
    c.fillStyle='#fff';for(let i=0;i<6;i++){const a=t*1.2+i/6*TAU;c.globalAlpha=.6+.4*Math.sin(t*3+i);c.fillRect(Math.cos(a)*16-1,cy+Math.sin(a)*34-1,2,2)}
    c.globalAlpha=.8+.2*Math.sin(t*2.5);c.fillStyle=col;for(const x of [-35,35])for(let i=0;i<3;i++)c.fillRect(x-2,-16-i*17,4,6);c.fillRect(-2.5,-115,5,7);c.drawImage(Kit.glowCv(col),-10,-122,20,20);
    c.globalAlpha=1;c.globalCompositeOperation='source-over';
    if(d.label){c.font='700 13px '+FONT;c.textAlign='center';c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.85)';c.strokeText(d.label,0,-130);c.fillStyle=col;c.fillText(d.label,0,-130)}}}
function draw(c,d,x,y,k,t){const df=D[d.k];if(!df)return false;const vi=d.v<.34?0:d.v<.67?1:2,e=spr(d.k,vi),s=(d.s||1)*(k||1);
  c.save();c.translate(x,y);c.scale(s,s);if(e)SC.draw(c,e,0,0);if(e)anim(c,d,vi,t);c.restore();return true}
return{D,draw,cracks}})();
function drawRegionDecor(d){return RD.draw(ctx,d,d._s.x,d._s.y,1,time)}
// 갤러리: 지역별로 모든 장식 × 변형 3개 (v=.1/.5/.9)
function regDecorGallery(box){
  const wrap=document.createElement('div');wrap.style.cssText='margin:6px 0 18px';wrap.id='regDecorGal';box.insertBefore(wrap,box.querySelector('#galGrid'));
  const G=[['들판','#4a5230',['wheat','haystack','flowers','windtree']],['깊은 숲','#2a3622',['oak','mushroom','fern','mossrock']],['사막','#8a6c44',['cactus','bones','sandrock','palm','ruinpillar']],
    ['빙산','#5a6878',['snowpine','icespike','iceboulder','frozenbones']],['정글','#2c4424',['jungletree','bigleaf','templestone','palm']],['용암','#33262a',['lavarock','obsidian','ashtree','vent']],
    ['바다·해안','#8a7650',['palm','coral','shell','searock','wreck']],['지역 문','#3a3a40',['edgeportal']]];
  const CW=118,CH=160,PER=12,dp=Math.min(2,window.devicePixelRatio||1),cvs=[];SC.bakeLeft=999;
  for(const [name,bg,ks] of G){const t=document.createElement('div');t.textContent='지역 장식 · '+name;t.style.cssText='margin:8px 0 4px;font-weight:600';wrap.appendChild(t);
    const n=ks.length*3,cols=Math.min(PER,n),rows=Math.ceil(n/PER),cv=document.createElement('canvas');cv.width=CW*cols*dp;cv.height=CH*rows*dp;
    cv.style.cssText=`width:${CW*cols}px;height:${CH*rows}px;max-width:100%;background:${bg};border:1px solid #3a342a;border-radius:6px`;cv.className='rdgal';wrap.appendChild(cv);
    const ds=[];ks.forEach((k,i)=>[.1,.5,.9].forEach((v,j)=>{const q=i*3+j,df=RD.D[k];ds.push({d:{k,v,s:1,x:0,y:0,label:'모래바다로',col:['#ffb84a','#7ad8ff','#c890ff'][j]},cx:(q%PER)*CW+CW/2,cy:Math.floor(q/PER)*CH+CH-24,f:Math.min(1,(CH-30)/df.h,(CW-4)/df.w)})}));
    cvs.push({cv,bg,ds})}
  const t0=performance.now();
  const step=()=>{if(!wrap.isConnected)return;const t=(performance.now()-t0)/1000;SC.bakeLeft=Math.max(SC.bakeLeft,60);
    for(const {cv,bg,ds} of cvs){const g=cv.getContext('2d');g.setTransform(1,0,0,1,0,0);g.fillStyle=bg;g.fillRect(0,0,cv.width,cv.height);g.scale(dp,dp);
      for(const o of ds){g.fillStyle='rgba(255,255,255,.05)';g.beginPath();g.ellipse(o.cx,o.cy,CW*.42,CW*.18,0,0,6.283);g.fill();RD.draw(g,o.d,o.cx,o.cy,o.f,t);
        g.font='11px sans-serif';g.textAlign='center';g.fillStyle='rgba(240,232,214,.85)';g.fillText(o.d.k+' '+o.d.v,o.cx,o.cy+18)}}
    requestAnimationFrame(step)};
  requestAnimationFrame(step)}
