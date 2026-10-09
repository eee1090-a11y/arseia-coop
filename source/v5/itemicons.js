/* ---------- v17: 가방 40칸 · 아이템 아이콘 ----------
   모든 장비 바탕(부위 × 8단계), 유니크, 상급 유니크, 세트 조각, 물약·두루마리·금화·의뢰품·잡동사니마다 손으로 칠한 아이콘.
   Canvas 2D로 키마다 한 번만 굽고(그라디언트는 굽는 순간에만) 캔버스와 data URL을 캐시한다. 매 프레임 그리는 일은 없다.
   틀 색(희귀도)은 RAR의 색을 그대로 쓴다. */
const BAG_MAX=40;
const bagFull=()=>P.bag.length>=BAG_MAX;
const IIC={cv:new Map(),url:new Map()};
const IIK={
  rgb:(c,a)=>Kit.rgb(Kit.hex(c),a),
  lin(g,x0,y0,x1,y1,cs){const gr=g.createLinearGradient(x0,y0,x1,y1);cs.forEach((c,i)=>gr.addColorStop(i/(cs.length-1),c));return gr},
  rad(g,x,y,r,cs,fx,fy){const gr=g.createRadialGradient(fx==null?x:fx,fy==null?y:fy,0,x,y,r);cs.forEach((c,i)=>gr.addColorStop(i/(cs.length-1),c));return gr},
  glow(g,x,y,r,col,a){g.save();g.globalCompositeOperation='lighter';g.fillStyle=this.rad(g,x,y,r,[this.rgb(col,a==null?.85:a),this.rgb(col,(a==null?.85:a)*.35),this.rgb(col,0)]);g.fillRect(x-r,y-r,r*2,r*2);g.restore()},
  // 보석: 면 + 하이라이트 + 반짝임
  gem(g,x,y,r,col,shape){shape=shape||'round';const p=c=>{
      if(shape==='oval')c.ellipse(x,y,r*.72,r,0,0,6.283);
      else if(shape==='diamond'){c.moveTo(x,y-r*1.15);c.lineTo(x+r*.85,y);c.lineTo(x,y+r*1.15);c.lineTo(x-r*.85,y);c.closePath()}
      else if(shape==='tear'){c.moveTo(x,y-r*1.4);c.bezierCurveTo(x+r*.4,y-r*.6,x+r,y-r*.1,x+r,y+r*.3);c.arc(x,y+r*.3,r,0,3.1416);c.bezierCurveTo(x-r,y-r*.1,x-r*.4,y-r*.6,x,y-r*1.4);c.closePath()}
      else if(shape==='star'){for(let i=0;i<10;i++){const a=-1.5708+i*.6283,rr=i%2?r*.45:r*1.15;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath()}
      else if(shape==='heart'){c.moveTo(x,y+r);c.bezierCurveTo(x-r*1.4,y,x-r*.9,y-r*1.1,x,y-r*.4);c.bezierCurveTo(x+r*.9,y-r*1.1,x+r*1.4,y,x,y+r);c.closePath()}
      else c.arc(x,y,r,0,6.283)};
    g.fillStyle=this.rad(g,x,y,r*1.25,[Kit.lit(col,.55),col,Kit.lit(col,-.55)],x-r*.35,y-r*.4);g.beginPath();p(g);g.fill();
    g.save();g.beginPath();p(g);g.clip();g.globalAlpha=.28;g.strokeStyle=Kit.lit(col,.7);g.lineWidth=.7;g.beginPath();
    for(let i=0;i<6;i++){const a=i*1.047+.3;g.moveTo(x+Math.cos(a)*r*.4,y+Math.sin(a)*r*.4);g.lineTo(x+Math.cos(a)*r*1.3,y+Math.sin(a)*r*1.3)}g.stroke();
    g.globalAlpha=.35;g.fillStyle=Kit.lit(col,-.6);g.beginPath();g.ellipse(x+r*.3,y+r*.35,r*.75,r*.5,.5,0,6.283);g.fill();g.restore();
    g.strokeStyle=this.rgb(Kit.lit(col,-.7),.85);g.lineWidth=.9;g.beginPath();p(g);g.stroke();
    g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.ellipse(x-r*.35,y-r*.38,r*.28,r*.17,-.6,0,6.283);g.fill();
    g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.arc(x+r*.32,y+r*.3,r*.09+.3,0,6.283);g.fill()},
  spark(g,x,y,r,col){g.save();g.globalCompositeOperation='lighter';g.strokeStyle=col||'#fff';g.lineCap='round';g.lineWidth=1.1;g.beginPath();g.moveTo(x-r,y);g.lineTo(x+r,y);g.moveTo(x,y-r);g.lineTo(x,y+r);g.stroke();g.lineWidth=.7;g.beginPath();g.moveTo(x-r*.45,y-r*.45);g.lineTo(x+r*.45,y+r*.45);g.moveTo(x+r*.45,y-r*.45);g.lineTo(x-r*.45,y+r*.45);g.stroke();g.restore()},
  // 금속 막대·판: 가로 방향 원통 명암
  rodFill(g,x0,x1,col){return this.lin(g,x0,0,x1,0,[Kit.lit(col,-.35),Kit.lit(col,.45),col,Kit.lit(col,-.55)])},
  solid(g,path,box,col,o){return Kit.solid(g,path,box[0],box[1],box[2],box[3],col,o)},
  flame(g,x,y,s,c1,c2){g.save();g.globalCompositeOperation='lighter';const f=(k,col,a)=>{g.globalAlpha=a;g.fillStyle=col;g.beginPath();g.moveTo(x,y-s*1.6*k);g.bezierCurveTo(x+s*.9*k,y-s*.7*k,x+s*.8*k,y+s*.4*k,x,y+s*.55*k);g.bezierCurveTo(x-s*.8*k,y+s*.4*k,x-s*.9*k,y-s*.7*k,x,y-s*1.6*k);g.fill()};
    f(1,c1,.8);f(.62,c2,.9);f(.3,'#fff8e0',.9);g.restore()},
  bolt(g,pts,col,w){g.save();g.lineCap='round';g.lineJoin='round';g.globalCompositeOperation='lighter';g.strokeStyle=this.rgb(col,.45);g.lineWidth=w*2.6;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();g.strokeStyle='#fffbe8';g.lineWidth=w;g.stroke();g.restore()},
};

/* ===== 설계표: 아이콘 키 → 그림 매개변수 ===== */
// 원소 색 (icons.js의 PAL과 같은 계열)
const IEL={fire:'#ff7a2e',ice:'#8fd8ff',storm:'#9fc0ff',earth:'#9ac46a',arcane:'#b9a2ff',holy:'#ffe39a',life:'#9fe39a',blood:'#e0344a',shadow:'#8a7aff'};
// 바탕 장비 8단계 (SLOT[*].base 순서)
const IBASE={
  staff:[
    {mat:'wood',sh:'#6a4a2c',head:'knot',gem:'#e8b840',glow:'#c9a46a',leaf:1},
    {mat:'wood',sh:'#b89a6a',head:'bound',gem:'#7ab0a0',glow:'#bfeedd'},
    {mat:'wood',sh:'#5a3a24',head:'crystal',gem:'#8fd8ff',glow:'#8fd8ff'},
    {mat:'wood',sh:'#3a2a20',head:'rune',gem:'#6ab0ff',glow:'#6ab0ff'},
    {mat:'metal',sh:'#c8ccd8',head:'claw',gem:'#5a8aff',glow:'#9fc0ff'},
    {mat:'bone',sh:'#d8ceb4',head:'skull',gem:'#ff5a3a',glow:'#ff7a2e'},
    {mat:'metal',sh:'#4a4e66',head:'star',gem:'#e8f0ff',glow:'#b9d0ff'},
    {mat:'gold',sh:'#e0b040',head:'halo',gem:'#efe6ff',glow:'#b9a2ff'}],
  robe:[
    {body:'#7a5a3a',trim:'#5a4028',pat:'plain',belt:'rope',glow:'#c9a46a'},
    {body:'#4a5a6a',trim:'#8a7a5a',pat:'quilt',belt:'#3a2a1a',glow:'#9ab0c0'},
    {body:'#7a3a8a',trim:'#e8c35a',pat:'silk',belt:'#e8c35a',glow:'#d8a2ff'},
    {body:'#26386a',trim:'#6ab0ff',pat:'runes',belt:'#1a2440',glow:'#6ab0ff',hood:1},
    {body:'#e8e0cc',trim:'#d6b262',pat:'stole',belt:'#d6b262',glow:'#ffe39a'},
    {body:'#1c2250',trim:'#c8c0ff',pat:'stars',belt:'#3a3a7a',glow:'#9fb0ff',hood:1},
    {body:'#8a1e24',trim:'#e8b840',pat:'collar',belt:'#e8b840',glow:'#ff9a5a',gem:'#5ab0ff'},
    {body:'#f0ead8',trim:'#ffd76a',pat:'radiant',belt:'#ffd76a',glow:'#fff0b0',gem:'#b9a2ff'}],
  ring:[
    {band:'#c87a3a',set:'none',glow:'#e8a060',eng:1},
    {band:'#d0d4dc',set:'round',gem:'#e8f0ff',glow:'#d0e0ff',sm:1},
    {band:'#c8ccd8',set:'oval',gem:'#2a5ad0',glow:'#5a8aff'},
    {band:'#e0b040',set:'round',gem:'#d02a3a',glow:'#ff5a5a'},
    {band:'#b8c0d8',set:'moon',gem:'#dfe8ff',glow:'#c8d8ff'},
    {band:'#3a3e5a',set:'star',gem:'#f0f4ff',glow:'#a8c0ff'},
    {band:'#c89a30',set:'eye',gem:'#f0c020',glow:'#ffb020'},
    {band:'#f0e0b0',set:'orb',gem:'#efe6ff',glow:'#b9a2ff',twist:1}],
  amulet:[
    {cord:'leather',pend:'tooth',metal:'#d8ceb4',glow:'#c9b48a'},
    {cord:'#c8ccd8',pend:'disc',metal:'#c8ccd8',gem:'#8fb0ff',glow:'#c0d0ff'},
    {cord:'#c89a50',pend:'drop',metal:'#c89a50',gem:'#f0a020',glow:'#ffb040'},
    {cord:'leather',pend:'tablet',metal:'#7a7468',gem:'#6ab0ff',glow:'#6ab0ff'},
    {cord:'#e0b040',pend:'box',metal:'#e0b040',gem:'#ffe39a',glow:'#ffe39a'},
    {cord:'#c8ccd8',pend:'star',metal:'#d8dce8',gem:'#9fc0ff',glow:'#c8d8ff'},
    {cord:'#c89a30',pend:'heart',metal:'#c89a30',gem:'#e0243a',glow:'#ff4a3a'},
    {cord:'#f0e0b0',pend:'orb',metal:'#f0d070',gem:'#efe6ff',glow:'#b9a2ff'}],
};
// 유니크 · 상급 유니크 (이름 → 부위 그림 + 고유 강조)
const IUNQ={
  '불사조의 깃털':{mat:'wood',sh:'#7a2a1a',head:'feather',gem:'#ff7a2e',glow:IEL.fire},
  '천공의 지휘봉':{mat:'metal',sh:'#d8dce8',head:'baton',gem:'#fff6b0',glow:IEL.storm},
  '서리여왕의 홀':{mat:'metal',sh:'#a8d8f0',head:'scepter',gem:'#8fd8ff',glow:IEL.ice},
  '대지 심장 지팡이':{mat:'wood',sh:'#4a3a24',head:'stone',gem:'#5ac04a',glow:IEL.earth},
  '시간술사의 옷':{body:'#1e5a5a',trim:'#e8c35a',pat:'hourglass',belt:'#e8c35a',glow:'#7af0e0',hood:1},
  '서리여왕의 인장':{band:'#a8d8f0',set:'signet',gem:'#8fd8ff',glow:IEL.ice,mark:'flake'},
  '아우렐의 지팡이':{mat:'wood',sh:'#c8a878',head:'crook',gem:'#ffe39a',glow:IEL.holy},
  '퇴마사의 사슬봉':{mat:'metal',sh:'#7a7a86',head:'chain',gem:'#ffffff',glow:IEL.holy},
  '대사제의 성의':{body:'#f4f0e4',trim:'#e8b840',pat:'mantle',belt:'#b02a2a',glow:IEL.holy,gem:'#d02a3a'},
  '아우렐의 눈물':{cord:'#e0b040',pend:'tear',metal:'#e0b040',gem:'#ffe9a8',glow:IEL.holy},
  '발케르의 망토':{body:'#8a2a14',trim:'#ffb040',pat:'cloak',belt:'#3a1a10',glow:IEL.fire,hood:1},
  '시간술사의 고리':{band:'#d8c070',set:'clock',gem:'#7af0e0',glow:'#7af0e0'},
  '근원어의 목걸이':{cord:'#c8a050',pend:'glyph',metal:'#e8d8a8',gem:'#b9a2ff',glow:IEL.arcane},
  '피의 성배 목걸이':{cord:'#8a1a1a',pend:'chalice',metal:'#e0b040',gem:'#c0102a',glow:IEL.blood},
  '아르실의 망령 지팡이':{mat:'bone',sh:'#b8b0a0',head:'wraith',gem:'#8fe8ff',glow:'#7ad8ff'},
  '삼키는 자의 가죽':{body:'#3a5a3a',trim:'#a0c060',pat:'scales',belt:'#2a1a10',glow:'#a0e070'},
  '발드라크의 재 홀':{mat:'metal',sh:'#2a2420',head:'ember',gem:'#ff5a1a',glow:IEL.fire},
  '하늘 가르는 자':{mat:'metal',sh:'#c8d0f0',head:'cleaver',gem:'#fff6b0',glow:IEL.storm},
  '빛의 사도 지팡이':{mat:'gold',sh:'#f0d070',head:'sun',gem:'#ffffff',glow:IEL.holy},
  '모르가스의 눈':{band:'#2a2028',set:'eye',gem:'#ff3a2a',glow:'#ff3a2a',spikes:1},
  '얼어붙은 왕의 반지':{band:'#9ad0f0',set:'crown',gem:'#e8f8ff',glow:IEL.ice},
  '재의 왕관 조각':{cord:'#3a3030',pend:'crown',metal:'#c8a040',gem:'#ff7a2e',glow:IEL.fire},
};
// 세트: 세트 테마 + 부위별 그림
const ISET={
  valker:{staff:{mat:'metal',sh:'#4a2a1a',head:'torch',gem:'#ff7a2e',glow:IEL.fire},robe:{body:'#7a1e14',trim:'#ff9a3a',pat:'scorch',belt:'#2a1a12',glow:IEL.fire},
    ring:{band:'#3a2a24',set:'round',gem:'#ff6a1a',glow:IEL.fire,flame:1},amulet:{cord:'#3a3030',pend:'cage',metal:'#4a4a50',gem:'#ff6a1a',glow:IEL.fire}},
  frostspire:{staff:{mat:'metal',sh:'#9ac8e8',head:'spire',gem:'#c8f0ff',glow:IEL.ice},robe:{body:'#5a8ab8',trim:'#f0f8ff',pat:'fur',belt:'#2a4a6a',glow:IEL.ice},
    ring:{band:'#b8e0f8',set:'shard',gem:'#c8f0ff',glow:IEL.ice},amulet:{cord:'#c8e0f0',pend:'icedrop',metal:'#c8e0f0',gem:'#a8e8ff',glow:IEL.ice}},
  stormcaller:{staff:{mat:'metal',sh:'#3a3e66',head:'fork',gem:'#fff6b0',glow:IEL.storm},robe:{body:'#22285a',trim:'#fff0a0',pat:'storm',belt:'#14183a',glow:IEL.storm,hood:1},
    ring:{band:'#7a80a8',set:'boltset',gem:'#fff6b0',glow:IEL.storm},amulet:{cord:'#8a90b0',pend:'bolt',metal:'#f0d060',gem:'#fff6b0',glow:IEL.storm}},
  seeker:{staff:{mat:'wood',sh:'#5a4028',head:'astro',gem:'#b9a2ff',glow:IEL.arcane},robe:{body:'#5a4a30',trim:'#c8a060',pat:'pouches',belt:'#3a2a18',glow:IEL.arcane},
    ring:{band:'#b89060',set:'signet',gem:'#b9a2ff',glow:IEL.arcane,mark:'compass'},amulet:{cord:'leather',pend:'compass',metal:'#c8a050',gem:'#b9a2ff',glow:IEL.arcane}},
  aurel:{staff:{mat:'gold',sh:'#e8c060',head:'cross',gem:'#ffe39a',glow:IEL.holy},robe:{body:'#f0e8d4',trim:'#e8b840',pat:'sun',belt:'#e8b840',glow:IEL.holy},
    ring:{band:'#e8c050',set:'cross',gem:'#fff4c0',glow:IEL.holy},amulet:{cord:'#e8c050',pend:'cross',metal:'#e8c050',gem:'#fff4c0',glow:IEL.holy}},
  exorcist:{staff:{mat:'metal',sh:'#5a5a66',head:'mace',gem:'#e8f0ff',glow:'#d8e0ff'},robe:{body:'#6a6a74',trim:'#d8d0c0',pat:'mail',belt:'#3a2a1a',glow:'#d8e0ff'},
    ring:{band:'#5a5a66',set:'chainset',gem:'#e8f0ff',glow:'#d8e0ff'},amulet:{cord:'#7a7a86',pend:'seal',metal:'#8a2a22',gem:'#ffffff',glow:'#ffd0b0'}},
  saint:{staff:{mat:'wood',sh:'#e8dcc0',head:'lily',gem:'#ffffff',glow:IEL.life},robe:{body:'#f8f4ec',trim:'#a8c8e8',pat:'veil',belt:'#a8c8e8',glow:'#dff0ff',hood:1},
    ring:{band:'#e8e0d0',set:'beads',gem:'#ffffff',glow:'#dff0ff'},amulet:{cord:'#e8e0d0',pend:'pearl',metal:'#e8e0d0',gem:'#f8f4ff',glow:'#dff0ff'}},
};
// 소모품 · 그 밖
const IMISC={hp:{k:'flask',c:'#d8242a',glow:'#ff5a4a'},mp:{k:'flask',c:'#2a5ae0',glow:'#5a8aff'},respec:{k:'tall',c:'#8a4ae0',glow:'#c9a2ff'},
  tp:{k:'scroll',c:'#e8d8a8',glow:'#9fd0ff'},gold:{k:'coins',c:'#e8b840',glow:'#ffd27a'},quest:{k:'letter',c:'#e8dcc0',glow:'#ffd27a'},junk:{k:'junk',c:'#8a8070',glow:'#a09080'}};
// 물약 등급 0~4 (작은 → 최상급): 병이 커지고 색이 짙어지며, 고급·최상급은 반짝인다
[['hp',['#e86a5a','#d8242a','#b8101e','#94061a','#ff1a3a'],['#ff9a8a','#ff5a4a','#ff3a2a','#ff2a2a','#ffd27a']],
 ['mp',['#6a8ae8','#2a5ae0','#1a3ac8','#1424a0','#3a6aff'],['#9ab8ff','#5a8aff','#4a6aff','#6a5aff','#bfe8ff']]].forEach(([k,cs,gs])=>cs.forEach((c,T)=>{IMISC[k+T]={k:'flask',c,glow:gs[T],tier:T}}));

/* ===== 그리기: 부위별 화가 (64×64 논리 좌표, 왼쪽 위 광원) ===== */
const IPAINT={
  staff(g,o){const ang=.62;g.save();g.translate(30,35);g.rotate(ang);
    const top=o.head==='halo'||o.head==='sun'||o.head==='astro'?-9:-11,bot=29;
    // 자루
    const sw=o.mat==='bone'?2.9:o.mat==='wood'?2.7:2.3;
    const shaft=c=>{if(o.mat==='wood'&&o.head==='knot'){c.moveTo(-sw,bot);for(let y=bot;y>top;y-=6)c.lineTo(-sw+Math.sin(y*.7)*.8,y);c.lineTo(sw,top);for(let y=top;y<bot;y+=6)c.lineTo(sw+Math.sin(y*.9)*.7,y);c.closePath()}else c.rect(-sw,top,sw*2,bot-top)};
    if(o.mat==='wood')Kit.solid(g,shaft,-sw,top,sw,bot,o.sh,{tex:'wood',texA:.5,lineW:.9});
    else if(o.mat==='bone'){Kit.solid(g,shaft,-sw,top,sw,bot,o.sh,{tex:'bone',lineW:.9});for(let y=top+8;y<bot;y+=9){g.fillStyle=Kit.lit(o.sh,.25);g.beginPath();g.ellipse(0,y,sw+1.3,1.8,0,0,6.283);g.fill();g.strokeStyle=IIK.rgb(Kit.lit(o.sh,-.6),.6);g.lineWidth=.6;g.stroke()}}
    else{g.fillStyle=IIK.rodFill(g,-sw,sw,o.sh);g.beginPath();shaft(g);g.fill();Kit.outline(g,shaft,IIK.rgb(Kit.lit(o.sh,-.7),.8),.8);if(o.mat==='gold'){g.strokeStyle=IIK.rgb(Kit.lit(o.sh,-.4),.8);g.lineWidth=.8;for(let y=top+6;y<bot-4;y+=5){g.beginPath();g.moveTo(-sw,y);g.lineTo(sw,y+2.5);g.stroke()}}}
    // 손잡이 감개
    const wc=o.mat==='gold'?'#6a2a3a':o.mat==='metal'?'#3a2a1e':'#5a3a22';g.fillStyle=IIK.rodFill(g,-sw-.8,sw+.8,wc);g.fillRect(-sw-.8,6,sw*2+1.6,10);g.strokeStyle=IIK.rgb(Kit.lit(wc,.4),.7);g.lineWidth=.8;for(let y=7;y<16;y+=2.2){g.beginPath();g.moveTo(-sw-.8,y);g.lineTo(sw+.8,y+1.4);g.stroke()}
    // 물미
    g.fillStyle=IIK.rodFill(g,-sw-.6,sw+.6,'#a8a8b0');g.beginPath();g.moveTo(-sw-.6,bot-4);g.lineTo(sw+.6,bot-4);g.lineTo(0,bot+3);g.closePath();g.fill();
    g.save();g.translate(0,top);g.scale(1.3,1.3);g.translate(0,-top);IPAINT.head(g,o,top);g.restore();g.restore()},
  head(g,o,top){const y=top,gm=o.gem,gl=o.glow,met=o.mat==='gold'?'#e8c050':o.mat==='bone'?'#d8ceb4':o.mat==='wood'?o.sh:'#c8ccd8',ring=(x,yy,rx,ry,c,w)=>{g.strokeStyle=IIK.rodFill(g,x-rx,x+rx,c);g.lineWidth=w;g.beginPath();g.ellipse(x,yy,rx,ry,0,0,6.283);g.stroke()};
    switch(o.head){
      case'knot':Kit.solid(g,c=>{c.moveTo(-3,y+3);c.bezierCurveTo(-9,y-1,-7,y-9,-1,y-10);c.bezierCurveTo(6,y-11,9,y-4,3,y+3);c.closePath()},-8,y-10,8,y+3,o.sh,{tex:'wood',lineW:.9});
        g.fillStyle='#5a8a3a';for(const [lx,ly,a] of [[-6,y-6,-.9],[6,y-7,.8]]){g.save();g.translate(lx,ly);g.rotate(a);Kit.solid(g,c=>c.ellipse(0,-4,2.4,5,0,0,6.283),-2,-9,2,1,'#5a9a3a',{lineW:.6});g.restore()}IIK.gem(g,0,y-4,2.8,gm);break;
      case'bound':for(const s of [-1,1]){g.fillStyle=IIK.rodFill(g,-4,4,o.sh);g.beginPath();g.moveTo(s*1.5,y+2);g.quadraticCurveTo(s*7,y-5,s*3,y-11);g.lineTo(s*1.8,y-10);g.quadraticCurveTo(s*4.5,y-5,0,y+2);g.fill()}
        IIK.gem(g,0,y-6,3.6,gm,'oval');g.strokeStyle='#8a6a3a';g.lineWidth=1.1;for(let k=0;k<3;k++){g.beginPath();g.moveTo(-3,y+1+k*1.6);g.lineTo(3,y+2+k*1.6);g.stroke()}break;
      case'crystal':IIK.glow(g,0,y-9,13,gl,.7);g.save();g.translate(0,y-8);const cr=c=>{c.moveTo(0,-11);c.lineTo(3.4,-6);c.lineTo(3,5);c.lineTo(0,8);c.lineTo(-3,5);c.lineTo(-3.4,-6);c.closePath()};
        g.fillStyle=IIK.lin(g,-3.4,0,3.4,0,[Kit.lit(gm,.6),gm,Kit.lit(gm,-.5)]);g.beginPath();cr(g);g.fill();g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.moveTo(0,-11);g.lineTo(-3.4,-6);g.lineTo(-1,6);g.lineTo(0,-6);g.closePath();g.fill();Kit.outline(g,cr,IIK.rgb(Kit.lit(gm,-.7),.8),.8);g.restore();
        for(const s of [-1,1]){g.strokeStyle=IIK.rodFill(g,-5,5,o.sh);g.lineWidth=2;g.lineCap='round';g.beginPath();g.moveTo(0,y+2);g.quadraticCurveTo(s*6,y-1,s*3.6,y-8);g.stroke()}IIK.spark(g,2,y-17,3);break;
      case'rune':Kit.solid(g,c=>{c.moveTo(-6,y+2);c.lineTo(-7,y-10);c.lineTo(0,y-15);c.lineTo(7,y-10);c.lineTo(6,y+2);c.closePath()},-7,y-15,7,y+2,'#4a4a52',{tex:'stone',lineW:.9});
        IIK.glow(g,0,y-6,10,gl,.6);g.strokeStyle=Kit.lit(gm,.4);g.lineWidth=1.2;g.lineCap='round';g.beginPath();g.moveTo(-2.5,y-10);g.lineTo(0,y-6);g.lineTo(-2.5,y-2);g.moveTo(2.5,y-10);g.lineTo(2.5,y-2);g.moveTo(0,y-6);g.lineTo(2.5,y-6);g.stroke();break;
      case'claw':IIK.glow(g,0,y-7,12,gl,.6);IIK.gem(g,0,y-7,5,gm);for(const a of [-2.2,-1.2,1.2,2.2]){g.save();g.translate(0,y);g.rotate(a*.32);g.fillStyle=IIK.rodFill(g,-2,2,met);g.beginPath();g.moveTo(-1.6,1);g.quadraticCurveTo(-2.5,-8,a>0?3:-3,-14);g.quadraticCurveTo(0,-7,1.6,1);g.closePath();g.fill();g.strokeStyle=IIK.rgb('#20242e',.6);g.lineWidth=.6;g.stroke();g.restore()}break;
      case'skull':{g.save();g.translate(0,y-6);for(const s of [-1,1]){Kit.solid(g,c=>{c.moveTo(s*3,-4);c.quadraticCurveTo(s*10,-8,s*9,-16);c.quadraticCurveTo(s*7,-9,s*1,-6);c.closePath()},s*1,-16,s*10,-4,'#e8dcc0',{lineW:.7})}
        Kit.solid(g,c=>{c.moveTo(-5,-5);c.bezierCurveTo(-6,-11,6,-11,5,-5);c.lineTo(4,3);c.lineTo(1.5,7);c.lineTo(-1.5,7);c.lineTo(-4,3);c.closePath()},-6,-11,6,7,o.sh,{tex:'bone',lineW:.8});
        g.fillStyle='#1a0a08';g.beginPath();g.ellipse(-2.2,-2.5,1.7,1.3,.3,0,6.283);g.ellipse(2.2,-2.5,1.7,1.3,-.3,0,6.283);g.fill();IIK.glow(g,-2.2,-2.5,4,gl,.9);IIK.glow(g,2.2,-2.5,4,gl,.9);g.fillStyle=gm;g.beginPath();g.arc(-2.2,-2.5,.8,0,6.283);g.arc(2.2,-2.5,.8,0,6.283);g.fill();g.restore();break}
      case'star':IIK.glow(g,0,y-8,15,gl,.8);g.save();g.translate(0,y-8);const st8=c=>{for(let i=0;i<16;i++){const a=-1.5708+i*.3927,r=i%2?3:i%4?7:11;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath()};
        g.fillStyle=IIK.lin(g,-10,-10,10,10,['#f0f4ff','#8a90b0','#3a3e5a']);g.beginPath();st8(g);g.fill();Kit.outline(g,st8,'rgba(20,20,40,.8)',.7);g.restore();IIK.gem(g,0,y-8,2.6,gm);IIK.spark(g,6,y-17,3.5);break;
      case'halo':IIK.glow(g,0,y-10,17,gl,.75);ring(0,y-10,8,8,met,2.4);g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=.6;g.beginPath();g.arc(0,y-10,8,3.6,5.2);g.stroke();for(const s of [-1,1]){g.fillStyle=IIK.rodFill(g,-3,3,met);g.beginPath();g.moveTo(0,y+1);g.quadraticCurveTo(s*4,y-1,s*6,y-4);g.lineTo(s*4.5,y-4);g.quadraticCurveTo(s*2,y-1,0,y-1);g.fill()}IIK.gem(g,0,y-10,4.2,gm);IIK.spark(g,7,y-19,3);IIK.spark(g,-8,y-4,2);break;
      // --- 유니크·세트 머리 ---
      case'feather':IIK.glow(g,0,y-10,16,gl,.75);g.save();g.translate(0,y);g.rotate(-.18);const fp=c=>{c.moveTo(0,2);c.bezierCurveTo(-7,-4,-6,-16,1,-22);c.bezierCurveTo(6,-14,6,-4,0,2);c.closePath()};g.fillStyle=IIK.lin(g,0,2,0,-22,['#c02a10','#ff7a2e','#ffd27a']);g.beginPath();fp(g);g.fill();
        g.strokeStyle='rgba(90,20,0,.6)';g.lineWidth=.6;for(let k=0;k<7;k++){const yy=-3-k*2.6;g.beginPath();g.moveTo(.3,yy);g.lineTo(-4.5,yy-2.5);g.moveTo(.3,yy);g.lineTo(4,yy-2.6);g.stroke()}g.strokeStyle='#fff0c0';g.lineWidth=.8;g.beginPath();g.moveTo(0,2);g.quadraticCurveTo(.6,-10,1,-21);g.stroke();g.restore();IIK.flame(g,3,y-20,3.5,'#ff7a2e','#ffd27a');break;
      case'baton':IIK.glow(g,0,y-8,13,gl,.7);ring(0,y-1,3.2,1.4,'#e8c050',1.4);g.save();g.translate(0,y-9);g.fillStyle=IIK.lin(g,-2,0,2,0,['#fffbe0','#9fc0ff','#3a4a8a']);g.beginPath();g.moveTo(0,-10);g.lineTo(2.4,0);g.lineTo(0,7);g.lineTo(-2.4,0);g.closePath();g.fill();g.restore();IIK.bolt(g,[[4,y-18],[1,y-12],[5,y-10],[2,y-4]],gl,.9);IIK.bolt(g,[[-6,y-14],[-3,y-10],[-6,y-7]],gl,.7);break;
      case'scepter':IIK.glow(g,0,y-9,15,gl,.8);g.save();g.translate(0,y-6);for(const [a,h] of [[-.5,10],[0,14],[.5,10],[-.95,7],[.95,7]]){g.save();g.rotate(a);g.fillStyle=IIK.lin(g,-2,0,2,0,['#ffffff','#8fd8ff','#2a6a9a']);g.beginPath();g.moveTo(-2,0);g.lineTo(0,-h);g.lineTo(2,0);g.closePath();g.fill();g.strokeStyle='rgba(20,60,100,.6)';g.lineWidth=.5;g.stroke();g.restore()}
        ring(0,1,4.5,1.8,'#c8e8ff',1.6);g.restore();IIK.gem(g,0,y-7,2.8,gm,'diamond');break;
      case'stone':Kit.solid(g,c=>{c.moveTo(-7,y-2);c.lineTo(-8,y-10);c.lineTo(-2,y-16);c.lineTo(6,y-14);c.lineTo(8,y-6);c.lineTo(4,y+1);c.closePath()},-8,y-16,8,y+1,'#6a6050',{tex:'stone',lineW:.9});
        g.strokeStyle='#5ac04a';g.lineWidth=.9;g.globalAlpha=.8;g.beginPath();g.moveTo(-6,y-9);g.lineTo(-2,y-7);g.lineTo(-3,y-3);g.moveTo(5,y-11);g.lineTo(2,y-8);g.stroke();g.globalAlpha=1;IIK.glow(g,0,y-7,9,gl,.7);IIK.gem(g,0,y-7,3.4,gm,'heart');
        g.strokeStyle='#4a7a2a';g.lineWidth=1.2;g.beginPath();g.moveTo(-3,y+2);g.bezierCurveTo(-8,y+5,-6,y+10,-2,y+12);g.stroke();g.fillStyle='#6aa040';g.beginPath();g.ellipse(-6,y+8,1.4,2.6,-.6,0,6.283);g.fill();break;
      case'crook':g.lineCap='round';g.strokeStyle=IIK.rodFill(g,-8,8,o.sh);g.lineWidth=4.4;g.beginPath();g.moveTo(0,y+3);g.lineTo(0,y-8);g.arc(5,y-8,5,3.1416,0);g.lineTo(10,y-5);g.stroke();g.strokeStyle='rgba(255,240,200,.5)';g.lineWidth=1;g.beginPath();g.arc(5,y-8,5,3.4,5.2);g.stroke();
        IIK.glow(g,5,y-6,9,gl,.7);IIK.gem(g,5,y-5.5,2.6,gm,'tear');g.fillStyle='#e8c050';g.fillRect(-2.6,y-1,5.2,2.2);break;
      case'chain':{g.fillStyle=IIK.rodFill(g,-4,4,'#7a7a86');g.fillRect(-4,y-4,8,6);Kit.outline(g,c=>c.rect(-4,y-4,8,6),'rgba(20,20,30,.8)',.7);g.strokeStyle='#c8ccd8';g.lineWidth=1.3;for(let k=0;k<5;k++){const cx=4+k*1.7,cy=y-2+k*3.2;g.beginPath();g.ellipse(cx,cy,1.5,2,k%2?0:1.2,0,6.283);g.stroke()}
        IIK.glow(g,13,y+15,7,gl,.8);g.fillStyle=IIK.rodFill(g,10,16,'#c8ccd8');g.beginPath();g.arc(13,y+15,3.2,0,6.283);g.fill();g.fillStyle='#fff';g.fillRect(12.4,y+12.6,1.2,4.8);g.fillRect(11,y+14.2,4,1.2);IIK.gem(g,0,y-8,3,gm);g.fillStyle='#e8c050';g.fillRect(-1,y-14,2,6);g.fillRect(-3,y-12,6,1.6);break}
      case'wraith':IIK.glow(g,0,y-9,17,gl,.8);g.save();g.globalAlpha=.85;g.fillStyle=IIK.lin(g,0,y-20,0,y+8,['rgba(200,250,255,.9)','rgba(122,216,255,.5)','rgba(122,216,255,0)']);g.beginPath();g.moveTo(-7,y-8);g.bezierCurveTo(-8,y-20,8,y-20,7,y-8);g.bezierCurveTo(7,y,4,y+4,6,y+9);g.lineTo(2,y+4);g.lineTo(0,y+9);g.lineTo(-2,y+4);g.lineTo(-6,y+9);g.bezierCurveTo(-4,y+4,-7,y,-7,y-8);g.fill();g.restore();
        g.fillStyle='#0a1a2a';g.beginPath();g.ellipse(-2.6,y-10,1.8,2.3,.2,0,6.283);g.ellipse(2.6,y-10,1.8,2.3,-.2,0,6.283);g.fill();g.fillStyle=gm;g.beginPath();g.arc(-2.6,y-10,.8,0,6.283);g.arc(2.6,y-10,.8,0,6.283);g.fill();g.strokeStyle='#0a1a2a';g.lineWidth=.8;g.beginPath();g.moveTo(-2.5,y-5);g.quadraticCurveTo(0,y-3.5,2.5,y-5);g.stroke();
        for(const s of [-1,1]){g.fillStyle='#d8ceb4';g.beginPath();g.moveTo(s*2,y+1);g.quadraticCurveTo(s*9,y-1,s*8,y-10);g.lineTo(s*6.6,y-9);g.quadraticCurveTo(s*7,y-2,s*1,y-1);g.fill()}break;
      case'ember':Kit.solid(g,c=>{c.moveTo(-6,y+1);c.lineTo(-8,y-8);c.lineTo(-3,y-5);c.lineTo(0,y-13);c.lineTo(3,y-5);c.lineTo(8,y-8);c.lineTo(6,y+1);c.closePath()},-8,y-13,8,y+1,'#2a2420',{lineW:.9});
        IIK.glow(g,0,y-4,12,gl,.9);for(const [cx,cy,r] of [[-3,y-3,1.6],[2.5,y-2,1.3],[0,y-6,1.8],[4,y-6,1]]){g.fillStyle=IIK.rad(g,cx,cy,r*1.4,['#fff0a0','#ff7a1a','#7a1a00']);g.beginPath();g.arc(cx,cy,r,0,6.283);g.fill()}IIK.flame(g,0,y-12,3.4,'#ff5a1a','#ffb040');IIK.flame(g,-5,y-9,2,'#ff5a1a','#ffb040');break;
      case'cleaver':IIK.glow(g,2,y-8,16,gl,.75);g.save();g.translate(0,y-4);const cl=c=>{c.moveTo(-1,2);c.bezierCurveTo(-12,-2,-12,-16,-2,-20);c.bezierCurveTo(-7,-14,-6,-6,1,-2);c.closePath()};g.fillStyle=IIK.lin(g,-12,-18,0,0,['#ffffff','#c8d0f0','#5a608a']);g.beginPath();cl(g);g.fill();Kit.outline(g,cl,'rgba(20,24,50,.8)',.8);
        g.scale(-1,1);g.fillStyle=IIK.lin(g,-12,-18,0,0,['#e8ecff','#a8b0d8','#3a3e66']);g.beginPath();cl(g);g.fill();Kit.outline(g,cl,'rgba(20,24,50,.8)',.8);g.restore();IIK.bolt(g,[[0,y-24],[-2,y-17],[2,y-14],[-1,y-7]],gl,1);IIK.gem(g,0,y-4,2.4,gm,'diamond');break;
      case'sun':IIK.glow(g,0,y-10,19,gl,.9);g.save();g.translate(0,y-10);for(let i=0;i<12;i++){g.rotate(.5236);g.fillStyle=i%2?'#ffe39a':'#f0c040';g.beginPath();g.moveTo(-1.6,-6);g.lineTo(0,i%2?-11:-14);g.lineTo(1.6,-6);g.fill()}g.restore();IIK.gem(g,0,y-10,5.6,'#ffd76a');IIK.gem(g,0,y-10,2.6,gm);IIK.spark(g,9,y-20,3.5);break;
      case'torch':g.fillStyle=IIK.lin(g,-6,0,6,0,['#2a1a14','#5a3a2a','#1a100c']);g.beginPath();g.moveTo(-6,y-6);g.lineTo(6,y-6);g.lineTo(3,y+2);g.lineTo(-3,y+2);g.closePath();g.fill();g.strokeStyle='#8a5a3a';g.lineWidth=.8;g.stroke();g.fillStyle='#c87a3a';g.fillRect(-6.5,y-7,13,1.8);
        IIK.glow(g,0,y-11,16,gl,.9);IIK.flame(g,0,y-12,6,'#ff4a10','#ffb040');IIK.flame(g,-3,y-9,3,'#ff4a10','#ffd27a');IIK.flame(g,3.5,y-9,3,'#ff4a10','#ffd27a');break;
      case'spire':IIK.glow(g,0,y-10,15,gl,.75);for(const [x,h,w] of [[0,20,3.2],[-4.5,12,2.4],[4.5,13,2.4]]){g.fillStyle=IIK.lin(g,x-w,0,x+w,0,['#ffffff','#a8e0ff','#3a7aaa']);g.beginPath();g.moveTo(x-w,y);g.lineTo(x,y-h);g.lineTo(x+w,y);g.closePath();g.fill();g.strokeStyle='rgba(30,70,110,.6)';g.lineWidth=.6;g.stroke()}ring(0,y,6,2,'#c8e8ff',1.6);IIK.spark(g,0,y-21,3);break;
      case'fork':IIK.glow(g,0,y-9,15,gl,.75);for(const s of [-1,0,1]){g.strokeStyle=IIK.rodFill(g,-6,6,o.sh);g.lineWidth=2;g.lineCap='round';g.beginPath();g.moveTo(0,y+1);g.quadraticCurveTo(s*7,y-3,s*6,y-(s?12:15));g.stroke();g.fillStyle='#d8dce8';g.beginPath();g.moveTo(s*6-1.4,y-(s?12:15));g.lineTo(s*6,y-(s?16:19));g.lineTo(s*6+1.4,y-(s?12:15));g.fill()}
        IIK.bolt(g,[[-6,y-12],[-2,y-10],[0,y-14],[3,y-10],[6,y-12]],gl,.9);IIK.gem(g,0,y-1,2.6,gm);break;
      case'astro':ring(0,y-9,8,3.2,'#c8a050',1.3);ring(0,y-9,3.4,8,'#c8a050',1.3);g.save();g.translate(0,y-9);g.rotate(.7);g.strokeStyle=IIK.rodFill(g,-8,8,'#e8c870');g.lineWidth=1;g.beginPath();g.ellipse(0,0,8,4.5,0,0,6.283);g.stroke();g.restore();IIK.glow(g,0,y-9,10,gl,.8);IIK.gem(g,0,y-9,3,gm);IIK.spark(g,7,y-16,2.6);break;
      case'cross':IIK.glow(g,0,y-9,15,gl,.8);g.fillStyle=IIK.rodFill(g,-3,3,'#e8c050');g.fillRect(-2.2,y-19,4.4,20);g.fillStyle=IIK.lin(g,0,y-15,0,y-10,['#fff0b0','#e8c050','#9a7020']);g.fillRect(-8,y-14,16,4.2);Kit.outline(g,c=>{c.rect(-2.2,y-19,4.4,20);c.rect(-8,y-14,16,4.2)},'rgba(90,60,10,.7)',.6);IIK.gem(g,0,y-12,2.6,gm);break;
      case'mace':for(let i=0;i<6;i++){const a=i/6*6.283;g.save();g.translate(0,y-7);g.rotate(a);g.fillStyle=IIK.lin(g,0,-2,0,2,['#e8ecf4','#7a7a86']);g.beginPath();g.moveTo(0,-1.8);g.lineTo(8,-.6);g.lineTo(8,.6);g.lineTo(0,1.8);g.closePath();g.fill();g.restore()}
        g.fillStyle=IIK.rad(g,0,y-7,6,['#d8dce8','#6a6a76','#2a2a32'],-2,y-9);g.beginPath();g.arc(0,y-7,5,0,6.283);g.fill();IIK.glow(g,0,y-7,9,gl,.5);g.fillStyle='#fff';g.fillRect(-.7,y-10.5,1.4,7);g.fillRect(-2.8,y-8.2,5.6,1.4);break;
      case'lily':IIK.glow(g,0,y-8,13,gl,.7);for(const a of [-.9,-.3,.3,.9,0]){g.save();g.translate(0,y-2);g.rotate(a);g.fillStyle=IIK.lin(g,0,0,0,-12,['#c8e0b0','#ffffff','#fff8e0']);g.beginPath();g.moveTo(0,0);g.bezierCurveTo(-4,-5,-3,-10,0,-12);g.bezierCurveTo(3,-10,4,-5,0,0);g.fill();g.strokeStyle='rgba(120,140,100,.6)';g.lineWidth=.5;g.stroke();g.restore()}g.fillStyle='#ffd76a';for(const x of [-1.2,0,1.2]){g.beginPath();g.arc(x,y-8+Math.abs(x),.8,0,6.283);g.fill()}
        g.fillStyle='#5a9a3a';g.beginPath();g.ellipse(-4,y+4,1.6,3.6,-.8,0,6.283);g.fill();break;
      default:IIK.gem(g,0,y-6,4,gm)}},
  robe(g,o){const b=o.body,tr=o.trim;
    const body=c=>{c.moveTo(26,9);c.quadraticCurveTo(32,12,38,9);c.lineTo(46,12);c.quadraticCurveTo(52,15,54,24);c.lineTo(58,38);c.lineTo(51,40);c.lineTo(46,29);c.lineTo(46,34);c.quadraticCurveTo(48,46,52,58);c.quadraticCurveTo(32,62,12,58);c.quadraticCurveTo(16,46,18,34);c.lineTo(18,29);c.lineTo(13,40);c.lineTo(6,38);c.lineTo(10,24);c.quadraticCurveTo(12,15,18,12);c.closePath()};
    if(o.pat==='cloak'){g.fillStyle=IIK.lin(g,0,10,0,60,[Kit.lit(b,-.2),Kit.lit(b,-.55)]);g.beginPath();g.moveTo(18,10);g.lineTo(46,10);g.quadraticCurveTo(56,32,58,60);for(let x=58;x>6;x-=5)g.lineTo(x-2.5,57+((x/5)%2?-3:2));g.lineTo(6,60);g.quadraticCurveTo(8,32,18,10);g.fill()}
    if(o.hood){Kit.solid(g,c=>{c.moveTo(20,14);c.bezierCurveTo(18,2,46,2,44,14);c.quadraticCurveTo(32,10,20,14)},20,3,44,14,Kit.lit(b,-.15),{tex:'cloth',lineW:.8})}
    const r=Kit.solid(g,body,8,8,56,60,b,{tex:o.pat==='mail'?'metal':o.pat==='scales'?'leather':'cloth',texA:.45,lineW:1});
    g.save();g.beginPath();body(g);g.clip();
    // 옷 주름 (어두운 붓질)
    g.strokeStyle=IIK.rgb(r.lo,.45);g.lineWidth=1.4;g.lineCap='round';for(const [x0,x1] of [[24,21],[29,28],[38,40],[42,45]]){g.beginPath();g.moveTo(x0,36);g.quadraticCurveTo((x0+x1)/2+1,47,x1,58);g.stroke()}
    const P2=o.pat;
    if(P2==='quilt'){g.strokeStyle=IIK.rgb(Kit.lit(b,-.5),.55);g.lineWidth=.8;for(let k=-60;k<70;k+=6){g.beginPath();g.moveTo(k,0);g.lineTo(k+60,60);g.moveTo(k+60,0);g.lineTo(k,60);g.stroke()}}
    else if(P2==='silk'){g.globalCompositeOperation='lighter';for(const x of [22,34,44]){g.fillStyle=IIK.lin(g,x-3,0,x+3,0,['rgba(255,220,255,0)','rgba(255,220,255,.22)','rgba(255,220,255,0)']);g.fillRect(x-3,10,6,50)}g.globalCompositeOperation='source-over'}
    else if(P2==='stars'){g.fillStyle='#e8ecff';for(let i=0;i<14;i++){const x=12+hash(i,3)*40,y=16+hash(i,7)*40;g.globalAlpha=.5+hash(i,9)*.5;g.beginPath();g.arc(x,y,.5+hash(i,5)*.8,0,6.283);g.fill()}g.globalAlpha=1;g.fillStyle='#f0f0c0';g.beginPath();g.arc(40,46,3.4,0,6.283);g.fill();g.fillStyle=b;g.beginPath();g.arc(41.6,45,3,0,6.283);g.fill()}
    else if(P2==='scorch'){g.fillStyle=IIK.lin(g,0,46,0,60,['rgba(20,8,4,0)','rgba(20,8,4,.85)']);g.fillRect(0,44,64,20);g.globalCompositeOperation='lighter';for(let i=0;i<9;i++){g.fillStyle=`rgba(255,${120+i*12},40,.8)`;g.beginPath();g.arc(14+i*4.4,56+Math.sin(i*2.1)*2,.9,0,6.283);g.fill()}g.globalCompositeOperation='source-over'}
    else if(P2==='storm'){IIK.bolt(g,[[20,20],[24,30],[19,34],[25,46]],o.glow,.8);IIK.bolt(g,[[44,22],[40,32],[45,36],[40,50]],o.glow,.8)}
    else if(P2==='scales'){g.strokeStyle=IIK.rgb(Kit.lit(b,.35),.5);g.lineWidth=.8;for(let y=12;y<62;y+=4)for(let x=(y/4)%2?8:10;x<58;x+=4){g.beginPath();g.arc(x,y,2.2,0,3.1416);g.stroke()}}
    else if(P2==='mail'){g.strokeStyle='rgba(30,30,40,.45)';g.lineWidth=.6;for(let y=12;y<62;y+=2.6)for(let x=(y|0)%2?8:9.3;x<58;x+=2.6){g.beginPath();g.arc(x,y,1.2,0,6.283);g.stroke()}g.fillStyle=IIK.lin(g,0,0,0,64,['#d8d0c0','#a89a80']);g.fillRect(25,30,14,30);g.fillStyle='#8a2a22';g.fillRect(30.5,34,3,14);g.fillRect(27,38,10,3)}
    else if(P2==='hourglass'){g.fillStyle='#e8c35a';g.beginPath();g.moveTo(27,36);g.lineTo(37,36);g.lineTo(32,44);g.lineTo(37,52);g.lineTo(27,52);g.lineTo(32,44);g.closePath();g.fill();g.fillStyle='#7af0e0';g.beginPath();g.moveTo(29,38);g.lineTo(35,38);g.lineTo(32,42.5);g.closePath();g.moveTo(29.5,51);g.lineTo(34.5,51);g.lineTo(32,47);g.closePath();g.fill();g.globalAlpha=.25;g.strokeStyle='#7af0e0';g.lineWidth=1.2;g.beginPath();g.moveTo(13,62);g.quadraticCurveTo(32,66,53,62);g.stroke();g.globalAlpha=1}
    else if(P2==='pouches'){for(const x of [20,40]){Kit.solid(g,c=>c.rect(x,35,7,8),x,35,x+7,43,'#6a4a2a',{tex:'leather',lineW:.7});g.fillStyle='#c8a060';g.beginPath();g.arc(x+3.5,37,.9,0,6.283);g.fill()}g.strokeStyle='#c8a060';g.lineWidth=.9;g.beginPath();g.arc(32,48,4,0,6.283);g.moveTo(32,43);g.lineTo(32,53);g.moveTo(27,48);g.lineTo(37,48);g.stroke()}
    else if(P2==='fur'){g.fillStyle=IIK.lin(g,0,52,0,62,['rgba(240,248,255,0)','rgba(240,248,255,.6)']);g.fillRect(0,50,64,12);g.strokeStyle='rgba(220,240,255,.5)';g.lineWidth=.6;for(const [x,y] of [[16,24],[44,20],[22,44],[40,40],[30,30]]){g.beginPath();g.moveTo(x-2,y);g.lineTo(x+2,y);g.moveTo(x,y-2);g.lineTo(x,y+2);g.stroke()}}
    g.restore();
    // 앞섶·밑단 장식
    g.lineCap='round';g.strokeStyle=tr;g.lineWidth=1.8;g.beginPath();g.moveTo(32,13);g.lineTo(32,59);g.stroke();g.lineWidth=1.6;g.beginPath();g.moveTo(13,57.5);g.quadraticCurveTo(32,61.5,51,57.5);g.stroke();g.beginPath();g.moveTo(6.5,37.6);g.lineTo(13,39.6);g.moveTo(57.5,37.6);g.lineTo(51,39.6);g.stroke();
    if(P2==='runes'){g.strokeStyle=o.glow;g.lineWidth=1;IIK.glow(g,32,44,10,o.glow,.35);for(let k=0;k<4;k++){const yy=38+k*5;g.beginPath();g.moveTo(34.5,yy);g.lineTo(37,yy+2);g.lineTo(34.5,yy+4);g.moveTo(29.5,yy);g.lineTo(27,yy+3);g.stroke()}}
    if(P2==='stole'||P2==='mantle'||P2==='sun'||P2==='veil'){g.fillStyle=IIK.lin(g,0,10,0,60,[Kit.lit(tr,.3),tr,Kit.lit(tr,-.3)]);for(const s of [-1,1]){g.beginPath();g.moveTo(32+s*3,11);g.lineTo(32+s*7,12);g.lineTo(32+s*7,56);g.lineTo(32+s*3,56);g.closePath();g.fill()}
      if(P2!=='veil'){g.fillStyle=P2==='mantle'?'#b02a2a':'#fff8e0';for(const s of [-1,1]){g.fillRect(32+s*5-1,44,2,7);g.fillRect(32+s*5-2.6,46,5.2,2)}}}
    if(P2==='mantle'){Kit.solid(g,c=>{c.moveTo(18,12);c.quadraticCurveTo(32,20,46,12);c.lineTo(50,22);c.quadraticCurveTo(32,30,14,22);c.closePath()},14,12,50,30,'#e8b840',{lineW:.8})}
    if(P2==='sun'){IIK.glow(g,32,26,9,'#ffe39a',.6);g.fillStyle='#f0c040';g.beginPath();g.arc(32,26,4,0,6.283);g.fill();g.strokeStyle='#f0c040';g.lineWidth=1;for(let i=0;i<8;i++){const a=i*.785;g.beginPath();g.moveTo(32+Math.cos(a)*5,26+Math.sin(a)*5);g.lineTo(32+Math.cos(a)*8,26+Math.sin(a)*8);g.stroke()}}
    if(P2==='veil'){g.fillStyle='rgba(200,225,250,.45)';g.beginPath();g.moveTo(18,6);g.bezierCurveTo(22,-2,42,-2,46,6);g.quadraticCurveTo(54,22,56,36);g.quadraticCurveTo(46,28,42,14);g.lineTo(22,14);g.quadraticCurveTo(18,28,8,36);g.quadraticCurveTo(10,22,18,6);g.fill()}
    if(P2==='collar'){Kit.solid(g,c=>{c.moveTo(22,13);c.lineTo(17,2);c.lineTo(28,9);c.lineTo(32,12);c.lineTo(36,9);c.lineTo(47,2);c.lineTo(42,13);c.quadraticCurveTo(32,17,22,13);c.closePath()},17,2,47,17,'#e8b840',{lineW:.8});for(const s of [-1,1])Kit.solid(g,c=>c.ellipse(32+s*15,15,6,3.4,s*.4,0,6.283),32+s*15-6,12,32+s*15+6,18,'#c89a30',{lineW:.7})}
    if(P2==='radiant'){g.save();g.globalCompositeOperation='lighter';IIK.glow(g,32,30,26,o.glow,.35);g.restore();g.strokeStyle='rgba(255,240,180,.8)';g.lineWidth=.8;for(const yy of [20,26]){g.beginPath();g.moveTo(14,yy+20);g.quadraticCurveTo(32,yy+26,50,yy+20);g.stroke()}}
    // 허리띠
    if(o.belt==='rope'){g.strokeStyle='#c8a870';g.lineWidth=1.8;g.beginPath();g.moveTo(18,33);g.quadraticCurveTo(32,36,46,33);g.stroke();g.beginPath();g.moveTo(30,35);g.lineTo(28,45);g.moveTo(33,35);g.lineTo(35,44);g.stroke()}
    else if(o.belt){g.fillStyle=IIK.lin(g,0,31,0,36,[Kit.lit(o.belt,.3),o.belt,Kit.lit(o.belt,-.4)]);g.beginPath();g.moveTo(18,31);g.quadraticCurveTo(32,34,46,31);g.lineTo(46,35);g.quadraticCurveTo(32,38,18,35);g.closePath();g.fill();g.fillStyle='#e8c870';g.fillRect(29.5,31.5,5,4.5);g.fillStyle=IIK.rgb('#3a2a10',.7);g.fillRect(31,32.6,2,2.3)}
    if(o.gem)IIK.gem(g,32,16,2.6,o.gem);
    if(P2==='scorch')IIK.flame(g,46,56,3,'#ff4a10','#ffb040'),IIK.flame(g,18,57,2.4,'#ff4a10','#ffb040')},
  ring(g,o){const cx=32,cy=40,b=o.band;
    if(o.flame)IIK.glow(g,32,22,18,o.glow,.6);
    // 고리 (타원 두 장, even-odd)
    const band=c=>{c.ellipse(cx,cy,19,11.5,0,0,6.283);c.ellipse(cx,cy+.8,14.5,7.6,0,0,6.283)};
    g.fillStyle=IIK.lin(g,cx-19,cy-11,cx+19,cy+11,[Kit.lit(b,.65),b,Kit.lit(b,-.35),Kit.lit(b,-.65),Kit.lit(b,.1)]);g.beginPath();band(g);g.fill('evenodd');
    g.strokeStyle=IIK.rgb(Kit.lit(b,-.7),.85);g.lineWidth=.9;g.beginPath();band(g);g.stroke();
    g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1;g.beginPath();g.ellipse(cx,cy,17,9.8,0,3.5,4.8);g.stroke();g.beginPath();g.ellipse(cx,cy+.6,15.8,8.8,0,.3,1.4);g.strokeStyle=IIK.rgb(Kit.lit(b,.5),.4);g.stroke();
    if(o.twist){g.strokeStyle=IIK.rgb(Kit.lit(b,-.5),.6);g.lineWidth=.8;for(let a=0;a<6.283;a+=.35){g.beginPath();g.moveTo(cx+Math.cos(a)*14.8,cy+Math.sin(a)*8);g.lineTo(cx+Math.cos(a+.18)*18.7,cy+Math.sin(a+.18)*11.2);g.stroke()}}
    if(o.eng){g.strokeStyle=IIK.rgb(Kit.lit(b,-.6),.6);g.lineWidth=.7;for(let a=.4;a<2.8;a+=.4){g.beginPath();g.arc(cx+Math.cos(a)*16.8,cy+Math.sin(a)*9.6,.9,0,6.283);g.stroke()}}
    if(o.spikes){g.fillStyle='#4a3a44';for(const a of [.6,1.2,1.9,2.5]){const x=cx+Math.cos(a)*18.5,y=cy+Math.sin(a)*11;g.beginPath();g.moveTo(x-1.5,y-.5);g.lineTo(x+Math.cos(a)*4,y+Math.sin(a)*4);g.lineTo(x+1.5,y+.5);g.fill()}}
    if(o.set==='beads'){for(let a=0;a<6.283;a+=.45){const x=cx+Math.cos(a)*16.6,y=cy+Math.sin(a)*9.6;g.fillStyle=IIK.rad(g,x,y,2,['#ffffff','#e8e0f0','#a8a0b8'],x-.6,y-.6);g.beginPath();g.arc(x,y,1.7,0,6.283);g.fill()}}
    if(o.set==='chainset'){g.strokeStyle='#a8a8b4';g.lineWidth=1;for(let a=.2;a<3;a+=.5){g.beginPath();g.ellipse(cx+Math.cos(a)*17,cy+Math.sin(a)*10,2,1.3,a,0,6.283);g.stroke()}}
    // 받침 + 보석
    const top=cy-11,s=o.set;
    if(s==='none')return;
    IIK.glow(g,cx,top-4,13,o.glow,.65);
    const bez=(w,h)=>{g.fillStyle=IIK.rodFill(g,cx-w,cx+w,b);g.beginPath();g.moveTo(cx-w,top+3);g.lineTo(cx-w*.8,top-h);g.lineTo(cx+w*.8,top-h);g.lineTo(cx+w,top+3);g.closePath();g.fill();g.strokeStyle=IIK.rgb(Kit.lit(b,-.7),.8);g.lineWidth=.7;g.stroke()};
    if(s==='round'){bez(6,2);for(const dx of [-5,5,0]){g.fillStyle=Kit.lit(b,.3);g.beginPath();g.arc(cx+dx,top-3+(dx?0:-4.5),1,0,6.283);g.fill()}IIK.gem(g,cx,top-4,o.sm?3.6:5,o.gem)}
    else if(s==='oval'){bez(6,2);IIK.gem(g,cx,top-5,5.2,o.gem,'oval')}
    else if(s==='moon'){bez(5,2);IIK.gem(g,cx,top-5,5,o.gem);g.fillStyle=IIK.rgb(Kit.lit(o.gem,-.5),.55);g.beginPath();g.arc(cx+2,top-6,4,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(cx-1.6,top-5.4,3.4,1.9,4.6);g.arc(cx,top-6,3.2,4.4,2.1,true);g.fill()}
    else if(s==='star'){bez(4,1);IIK.gem(g,cx,top-5,5,o.gem,'star');IIK.spark(g,cx+8,top-11,3)}
    else if(s==='eye'){bez(7,2);g.fillStyle=IIK.rad(g,cx,top-4,7,[Kit.lit(o.gem,.5),o.gem,Kit.lit(o.gem,-.6)]);g.beginPath();g.ellipse(cx,top-4,7,4.6,0,0,6.283);g.fill();g.fillStyle='#120806';g.beginPath();g.ellipse(cx,top-4,1.2,4,0,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(cx-2.6,top-5.6,1,0,6.283);g.fill();g.strokeStyle=IIK.rgb(Kit.lit(b,-.6),.9);g.lineWidth=.8;g.beginPath();g.ellipse(cx,top-4,7,4.6,0,0,6.283);g.stroke()}
    else if(s==='orb'){for(const dx of [-4,4]){g.strokeStyle=IIK.rodFill(g,cx-6,cx+6,b);g.lineWidth=1.6;g.beginPath();g.moveTo(cx+dx*1.4,top+3);g.quadraticCurveTo(cx+dx*1.8,top-6,cx+dx*.5,top-11);g.stroke()}IIK.gem(g,cx,top-6,4.4,o.gem);IIK.spark(g,cx-8,top-12,2.6);IIK.spark(g,cx+9,top-2,2)}
    else if(s==='signet'){g.fillStyle=IIK.lin(g,cx-8,top-8,cx+8,top+2,[Kit.lit(b,.6),b,Kit.lit(b,-.5)]);g.beginPath();g.ellipse(cx,top-2,9,4.6,0,0,6.283);g.fill();g.strokeStyle=IIK.rgb(Kit.lit(b,-.7),.8);g.lineWidth=.8;g.stroke();g.fillStyle=IIK.rgb(o.gem,.85);g.beginPath();g.ellipse(cx,top-2.4,6.6,3.2,0,0,6.283);g.fill();g.strokeStyle='#ffffff';g.lineWidth=.8;g.beginPath();
      if(o.mark==='flake'){for(let i=0;i<3;i++){const a=i*1.047;g.moveTo(cx-Math.cos(a)*5,top-2.4-Math.sin(a)*2.6);g.lineTo(cx+Math.cos(a)*5,top-2.4+Math.sin(a)*2.6)}}else{g.moveTo(cx-5,top-2.4);g.lineTo(cx+5,top-2.4);g.moveTo(cx,top-5);g.lineTo(cx,top+.2);g.ellipse(cx,top-2.4,3,1.5,0,0,6.283)}g.stroke()}
    else if(s==='clock'){g.fillStyle=IIK.rodFill(g,cx-7,cx+7,b);g.beginPath();g.arc(cx,top-5,7,0,6.283);g.fill();g.fillStyle='#103a3a';g.beginPath();g.arc(cx,top-5,5.4,0,6.283);g.fill();IIK.glow(g,cx,top-5,7,o.glow,.5);g.strokeStyle=o.gem;g.lineWidth=1;g.beginPath();g.moveTo(cx,top-5);g.lineTo(cx,top-9);g.moveTo(cx,top-5);g.lineTo(cx+3,top-3.4);g.stroke();for(let i=0;i<12;i++){const a=i*.5236;g.fillStyle='#e8d8a0';g.fillRect(cx+Math.cos(a)*4.6-.4,top-5+Math.sin(a)*4.6-.4,.8,.8)}}
    else if(s==='crown'){g.fillStyle=IIK.lin(g,cx-8,0,cx+8,0,['#ffffff','#9ad0f0','#3a7aaa']);g.beginPath();g.moveTo(cx-8,top+2);g.lineTo(cx-8,top-6);g.lineTo(cx-5,top-2);g.lineTo(cx-2.5,top-10);g.lineTo(cx,top-3);g.lineTo(cx+2.5,top-10);g.lineTo(cx+5,top-2);g.lineTo(cx+8,top-6);g.lineTo(cx+8,top+2);g.closePath();g.fill();g.strokeStyle='rgba(30,70,110,.7)';g.lineWidth=.7;g.stroke();IIK.gem(g,cx,top-1.5,2.4,o.gem)}
    else if(s==='shard'){bez(5,1);g.fillStyle=IIK.lin(g,cx-4,0,cx+4,0,['#ffffff','#a8e8ff','#3a8ac0']);g.beginPath();g.moveTo(cx-4,top);g.lineTo(cx-1,top-14);g.lineTo(cx+4,top);g.closePath();g.fill();g.beginPath();g.moveTo(cx+1,top);g.lineTo(cx+6,top-9);g.lineTo(cx+6,top);g.fill();g.beginPath();g.moveTo(cx-6,top);g.lineTo(cx-7,top-7);g.lineTo(cx-3,top);g.fill()}
    else if(s==='boltset'){bez(5,1);g.fillStyle=IIK.lin(g,0,top-14,0,top+2,['#ffffff','#fff0a0','#e0b030']);g.beginPath();g.moveTo(cx+2,top-14);g.lineTo(cx-4,top-4);g.lineTo(cx,top-4);g.lineTo(cx-2,top+2);g.lineTo(cx+5,top-7);g.lineTo(cx+1,top-7);g.closePath();g.fill();g.strokeStyle='rgba(120,90,10,.8)';g.lineWidth=.6;g.stroke()}
    else if(s==='cross'){bez(5,1);g.fillStyle=IIK.lin(g,0,top-12,0,top,['#ffffff','#ffe39a','#c89a30']);g.fillRect(cx-1.6,top-12,3.2,12);g.fillRect(cx-5,top-9,10,3);IIK.gem(g,cx,top-7.5,1.6,o.gem)}
    else if(s==='chainset'){bez(5,2);IIK.gem(g,cx,top-4,4,o.gem,'diamond')}
    else if(s==='beads'){bez(4,1);g.fillStyle=IIK.rad(g,cx,top-5,5,['#ffffff','#f0eaf8','#b0a8c0'],cx-1.5,top-6.5);g.beginPath();g.arc(cx,top-5,4.4,0,6.283);g.fill();g.fillStyle='#c8a060';g.fillRect(cx-.6,top-12,1.2,4);g.fillRect(cx-2,top-11,4,1.1)}
    if(o.flame)IIK.flame(g,cx,top-8,3.4,'#ff4a10','#ffb040')},
  amulet(g,o){const px=32,py=42,m=o.metal;
    // 줄
    if(o.cord==='leather'){g.strokeStyle='#5a3a22';g.lineWidth=1.6;g.lineCap='round';g.beginPath();g.moveTo(10,4);g.bezierCurveTo(12,26,24,32,px,py-8);g.moveTo(54,4);g.bezierCurveTo(52,26,40,32,px,py-8);g.stroke();g.strokeStyle='rgba(200,160,110,.4)';g.lineWidth=.6;g.stroke()}
    else{const cc=o.cord;for(const s of [-1,1]){for(let t=0;t<1;t+=.075){const x0=32+s*22,bx=32+s*(22-21*t),by=4+Math.sin(t*1.5708)*(py-12),a=Math.atan2(py-12,-s*22*1.6);g.strokeStyle=IIK.rgb(Kit.lit(cc,(t*13|0)%2?.35:-.25),.95);g.lineWidth=.9;g.beginPath();g.ellipse(bx,by,1.9,1.1,(t*13|0)%2?a:a+1.57,0,6.283);g.stroke()}}}
    IIK.glow(g,px,py+2,16,o.glow,.55);
    const bale=()=>{g.strokeStyle=IIK.rodFill(g,px-2,px+2,m);g.lineWidth=1.4;g.beginPath();g.ellipse(px,py-8,1.8,2.4,0,0,6.283);g.stroke()};
    switch(o.pend){
      case'tooth':g.fillStyle='#5a3a22';g.fillRect(px-3,py-9,6,3);Kit.solid(g,c=>{c.moveTo(px-4,py-7);c.quadraticCurveTo(px-4,py+8,px+2,py+16);c.quadraticCurveTo(px+5,py+4,px+4,py-7);c.closePath()},px-4,py-7,px+5,py+16,m,{tex:'bone',lineW:.8});g.strokeStyle='rgba(90,70,40,.5)';g.lineWidth=.6;g.beginPath();g.moveTo(px-1,py-4);g.quadraticCurveTo(px,py+5,px+2,py+12);g.stroke();break;
      case'disc':bale();Kit.solid(g,c=>c.arc(px,py+2,9,0,6.283),px-9,py-7,px+9,py+11,m,{lineW:.9});g.strokeStyle=IIK.rgb(Kit.lit(m,-.5),.7);g.lineWidth=.8;g.beginPath();g.arc(px,py+2,6.6,0,6.283);g.stroke();for(let i=0;i<8;i++){const a=i*.785;g.beginPath();g.moveTo(px+Math.cos(a)*4,py+2+Math.sin(a)*4);g.lineTo(px+Math.cos(a)*6,py+2+Math.sin(a)*6);g.stroke()}IIK.gem(g,px,py+2,2.6,o.gem);break;
      case'drop':bale();g.fillStyle=IIK.rodFill(g,px-3,px+3,m);g.fillRect(px-3,py-6,6,3);IIK.gem(g,px,py+5,7,o.gem,'tear');g.fillStyle='rgba(60,30,0,.55)';g.beginPath();g.ellipse(px+1,py+6,1.6,2.6,.4,0,6.283);g.fill();g.strokeStyle='rgba(60,30,0,.5)';g.lineWidth=.5;g.beginPath();g.moveTo(px-1,py+4);g.lineTo(px-3,py+3);g.moveTo(px-1,py+7);g.lineTo(px-3,py+8);g.stroke();break;
      case'tablet':Kit.solid(g,c=>{c.moveTo(px-7,py-6);c.lineTo(px+6,py-8);c.lineTo(px+8,py+12);c.lineTo(px-6,py+14);c.closePath()},px-7,py-8,px+8,py+14,m,{tex:'stone',lineW:.9});IIK.glow(g,px,py+3,9,o.glow,.6);g.strokeStyle=Kit.lit(o.gem,.4);g.lineWidth=1.4;g.lineCap='round';g.beginPath();g.moveTo(px-1,py-3);g.lineTo(px-1,py+10);g.moveTo(px-1,py+1);g.lineTo(px+3,py-2);g.moveTo(px-1,py+5);g.lineTo(px+3,py+2);g.stroke();break;
      case'box':bale();Kit.solid(g,c=>c.rect(px-7,py-5,14,18),px-7,py-5,px+7,py+13,m,{lineW:.9});g.fillStyle='#3a1a10';g.fillRect(px-4.5,py-2,9,11);IIK.glow(g,px,py+3.5,6,o.glow,.8);g.fillStyle='#fff4d0';g.fillRect(px-.8,py-1,1.6,9);g.fillRect(px-3,py+1.6,6,1.6);g.fillStyle=m;for(const [x,y] of [[-7,-5],[7,-5],[-7,13],[7,13]]){g.beginPath();g.arc(px+x,py+y,1.5,0,6.283);g.fill()}break;
      case'star':bale();g.save();g.translate(px,py+3);const s5=c=>{for(let i=0;i<10;i++){const a=-1.5708+i*.6283,r=i%2?4.4:11;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath()};g.fillStyle=IIK.lin(g,-10,-10,10,10,[Kit.lit(m,.6),m,Kit.lit(m,-.5)]);g.beginPath();s5(g);g.fill();Kit.outline(g,s5,IIK.rgb(Kit.lit(m,-.7),.8),.7);g.restore();IIK.gem(g,px,py+3.5,3,o.gem);IIK.spark(g,px+11,py-6,3);break;
      case'heart':bale();for(const s of [-1,1]){g.fillStyle=IIK.rodFill(g,px-10,px+10,m);g.beginPath();g.moveTo(px+s*2,py-5);g.quadraticCurveTo(px+s*13,py-2,px+s*7,py+8);g.lineTo(px+s*5.5,py+6.5);g.quadraticCurveTo(px+s*9,py-1,px+s*1,py-3.5);g.fill()}IIK.gem(g,px,py+3,8,o.gem,'heart');break;
      case'orb':for(const s of [-1,1]){g.strokeStyle=IIK.rodFill(g,px-10,px+10,m);g.lineWidth=1.8;g.beginPath();g.moveTo(px,py-8);g.bezierCurveTo(px+s*12,py-6,px+s*12,py+12,px,py+15);g.stroke()}g.fillStyle=IIK.rodFill(g,px-4,px+4,m);g.beginPath();g.moveTo(px-4,py-9);g.lineTo(px+4,py-9);g.lineTo(px,py-3);g.fill();IIK.gem(g,px,py+3.5,6.4,o.gem);IIK.spark(g,px-12,py-4,3);IIK.spark(g,px+12,py+12,2.4);break;
      case'tear':bale();g.fillStyle=IIK.rodFill(g,px-5,px+5,m);g.beginPath();g.moveTo(px-5,py-4);g.quadraticCurveTo(px,py-8,px+5,py-4);g.lineTo(px+3,py-2);g.lineTo(px-3,py-2);g.fill();IIK.gem(g,px,py+6,6.4,o.gem,'tear');IIK.spark(g,px+8,py-4,3.2);break;
      case'glyph':bale();Kit.solid(g,c=>{c.moveTo(px-8,py-5);c.lineTo(px+8,py-5);c.lineTo(px+8,py+11);c.lineTo(px-8,py+11);c.closePath()},px-8,py-5,px+8,py+11,'#e8d8a8',{lineW:.8});for(const y of [py-6,py+12]){Kit.solid(g,c=>c.ellipse(px,y,9.4,2,0,0,6.283),px-9,y-2,px+9,y+2,'#a8784a',{lineW:.6})}IIK.glow(g,px,py+3,8,o.glow,.7);g.strokeStyle='#6a4ad0';g.lineWidth=1.1;g.beginPath();g.arc(px,py+3,4,0,6.283);g.moveTo(px,py-2);g.lineTo(px,py+8);g.moveTo(px-4,py+3);g.lineTo(px+4,py-1);g.stroke();break;
      case'chalice':bale();Kit.solid(g,c=>{c.moveTo(px-8,py-4);c.quadraticCurveTo(px-7,py+6,px-1.5,py+7);c.lineTo(px-1.5,py+11);c.lineTo(px-5,py+14);c.lineTo(px+5,py+14);c.lineTo(px+1.5,py+11);c.lineTo(px+1.5,py+7);c.quadraticCurveTo(px+7,py+6,px+8,py-4);c.closePath()},px-8,py-4,px+8,py+14,m,{lineW:.8});g.fillStyle=IIK.rad(g,px,py-4,8,['#ff5a6a','#a0001a','#400008']);g.beginPath();g.ellipse(px,py-4,7.4,2.2,0,0,6.283);g.fill();g.fillStyle='#c0102a';g.beginPath();g.moveTo(px+4,py-3);g.quadraticCurveTo(px+5.5,py+2,px+4.6,py+4);g.arc(px+4.6,py+4.6,.9,0,3.14);g.fill();IIK.gem(g,px,py+3,1.8,o.gem);break;
      case'crown':Kit.solid(g,c=>{c.moveTo(px-11,py+8);c.lineTo(px-10,py-4);c.lineTo(px-6,py+1);c.lineTo(px-2,py-8);c.lineTo(px+1,py);c.lineTo(px+4,py-3);c.lineTo(px+3,py+3);c.lineTo(px+7,py+5);c.lineTo(px+5,py+9);c.closePath()},px-11,py-8,px+7,py+9,m,{lineW:.9});g.fillStyle='rgba(20,10,5,.85)';g.beginPath();g.moveTo(px+4,py-3);g.lineTo(px+3,py+3);g.lineTo(px+7,py+5);g.lineTo(px+5,py+9);g.lineTo(px+9,py+9);g.lineTo(px+8,py+2);g.closePath();g.fill();IIK.gem(g,px-4,py+4,2.6,o.gem);IIK.flame(g,px+6,py+1,2,'#ff4a10','#ffb040');break;
      case'cage':bale();IIK.glow(g,px,py+4,10,o.glow,.9);g.fillStyle=IIK.rad(g,px,py+4,6,['#fff0a0','#ff6a1a','#6a1000']);g.beginPath();g.arc(px,py+4,5,0,6.283);g.fill();g.strokeStyle=IIK.rodFill(g,px-7,px+7,m);g.lineWidth=1.4;for(const s of [-1,-.35,.35,1]){g.beginPath();g.moveTo(px,py-5);g.quadraticCurveTo(px+s*10,py+4,px,py+13);g.stroke()}g.beginPath();g.ellipse(px,py+4,6.8,1.6,0,0,6.283);g.stroke();break;
      case'icedrop':bale();for(const [x,h] of [[0,17],[-4,10],[4,11]]){g.fillStyle=IIK.lin(g,px+x-3,0,px+x+3,0,['#ffffff','#a8e8ff','#3a8ac0']);g.beginPath();g.moveTo(px+x-3,py-5);g.lineTo(px+x,py-5+h);g.lineTo(px+x+3,py-5);g.closePath();g.fill()}g.fillStyle=IIK.rodFill(g,px-7,px+7,m);g.fillRect(px-7,py-7,14,2.6);IIK.spark(g,px+9,py+6,2.8);break;
      case'bolt':bale();g.fillStyle=IIK.lin(g,0,py-6,0,py+16,['#fffbe0','#f0d060','#a07a10']);const bp=c=>{c.moveTo(px+3,py-6);c.lineTo(px-6,py+5);c.lineTo(px-.5,py+5);c.lineTo(px-4,py+16);c.lineTo(px+7,py+2);c.lineTo(px+1,py+2);c.lineTo(px+5,py-6);c.closePath()};g.beginPath();bp(g);g.fill();Kit.outline(g,bp,'rgba(90,60,0,.8)',.8);IIK.bolt(g,[[px-10,py-2],[px-7,py+2],[px-10,py+5]],o.glow,.6);break;
      case'compass':bale();Kit.solid(g,c=>c.arc(px,py+3,9.5,0,6.283),px-9,py-6,px+9,py+12,m,{lineW:.9});g.fillStyle='#2a2018';g.beginPath();g.arc(px,py+3,7.4,0,6.283);g.fill();g.fillStyle='#e8d8a8';g.beginPath();g.moveTo(px,py-3.4);g.lineTo(px+1.6,py+3);g.lineTo(px,py+9.4);g.lineTo(px-1.6,py+3);g.closePath();g.fill();g.fillStyle=o.gem;g.beginPath();g.moveTo(px,py-3.4);g.lineTo(px+1.6,py+3);g.lineTo(px-1.6,py+3);g.closePath();g.fill();g.beginPath();g.moveTo(px-6.4,py+3);g.lineTo(px,py+1.6);g.lineTo(px+6.4,py+3);g.lineTo(px,py+4.4);g.closePath();g.fillStyle='rgba(232,216,168,.6)';g.fill();break;
      case'cross':bale();IIK.glow(g,px,py+3,12,o.glow,.7);g.fillStyle=IIK.lin(g,px-8,py-6,px+8,py+14,[Kit.lit(m,.6),m,Kit.lit(m,-.5)]);g.fillRect(px-2.4,py-6,4.8,20);g.fillRect(px-8,py-1,16,4.8);for(let i=0;i<8;i++){const a=i*.785;g.strokeStyle=IIK.rgb(o.glow,.8);g.lineWidth=.8;g.beginPath();g.moveTo(px+Math.cos(a)*5,py+1.4+Math.sin(a)*5);g.lineTo(px+Math.cos(a)*9,py+1.4+Math.sin(a)*9);g.stroke()}IIK.gem(g,px,py+1.4,2.4,o.gem);break;
      case'seal':bale();g.fillStyle=IIK.rad(g,px,py+4,10,['#d84a3a','#8a2a22','#4a1010'],px-3,py+1);g.beginPath();for(let i=0;i<16;i++){const a=i*.3927,r=8.6+(i%2?-.8:.6);g.lineTo(px+Math.cos(a)*r,py+4+Math.sin(a)*r)}g.closePath();g.fill();g.strokeStyle='rgba(255,200,180,.6)';g.lineWidth=.9;g.beginPath();g.arc(px,py+4,5.4,0,6.283);g.stroke();g.fillStyle='#fff';g.fillRect(px-.7,py,1.4,8);g.fillRect(px-2.8,py+2,5.6,1.4);break;
      case'pearl':bale();g.fillStyle=IIK.rodFill(g,px-4,px+4,m);g.fillRect(px-2,py-6,4,3);g.fillStyle=IIK.rad(g,px,py+4,8,['#ffffff','#f4eef8','#c8bcd8','#8a809a'],px-2.4,py+1);g.beginPath();g.ellipse(px,py+4,6,7,0,0,6.283);g.fill();g.globalCompositeOperation='lighter';g.fillStyle='rgba(255,220,240,.25)';g.beginPath();g.ellipse(px+2,py+6,3,4,.4,0,6.283);g.fill();g.globalCompositeOperation='source-over';IIK.spark(g,px-7,py-3,2.6);break;
      default:bale();IIK.gem(g,px,py+3,6,o.gem)}},
  misc(g,o){const c=o.c;
    if(o.tier!=null&&!o._t){const sc=.72+o.tier*.08;g.save();g.translate(32,60);g.scale(sc,sc);g.translate(-32,-60);IPAINT.misc(g,Object.assign({},o,{_t:1}));g.restore();
      if(o.tier>=3){IIK.spark(g,45,22,o.tier===4?4.2:2.8);if(o.tier===4)IIK.spark(g,19,34,2.6)}return}
    if(o.k==='flask'||o.k==='tall'){const tall=o.k==='tall';IIK.glow(g,32,40,22,o.glow,.45);
      const fl=tall?(q=>{q.moveTo(28,10);q.lineTo(36,10);q.lineTo(36,22);q.bezierCurveTo(46,28,46,56,32,58);q.bezierCurveTo(18,56,18,28,28,22);q.closePath()}):(q=>{q.moveTo(28,12);q.lineTo(36,12);q.lineTo(36,22);q.bezierCurveTo(50,25,52,52,32,57);q.bezierCurveTo(12,52,14,25,28,22);q.closePath()});
      g.fillStyle='rgba(200,220,230,.22)';g.beginPath();fl(g);g.fill();
      g.save();g.beginPath();fl(g);g.clip();g.fillStyle=IIK.rad(g,32,44,18,[Kit.lit(c,.45),c,Kit.lit(c,-.55)],27,38);g.fillRect(10,30,44,30);g.fillStyle=IIK.rgb(Kit.lit(c,.6),.8);g.beginPath();g.ellipse(32,31,13,2.6,0,0,6.283);g.fill();
      g.globalCompositeOperation='lighter';g.fillStyle='rgba(255,255,255,.35)';for(const [x,y,r] of [[26,46,1.6],[36,50,1.1],[30,40,.9],[38,42,1.3]]){g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}if(tall){g.strokeStyle='rgba(255,230,255,.55)';g.lineWidth=1.2;g.beginPath();g.arc(32,46,5,0,4.5);g.arc(32,46,9,4.5,8,false);g.stroke()}g.restore();
      g.strokeStyle='rgba(230,240,250,.65)';g.lineWidth=1.1;g.beginPath();fl(g);g.stroke();g.fillStyle='rgba(255,255,255,.65)';g.beginPath();g.ellipse(24,36,2.2,6,.35,0,6.283);g.fill();
      Kit.solid(g,q=>q.rect(27,5,10,8),27,5,37,13,'#a8784a',{tex:'wood',lineW:.8});g.fillStyle=IIK.rodFill(g,26,38,'#c8a050');g.fillRect(26,12,12,2.6);
      if(tall){g.fillStyle='#e8d8b0';g.beginPath();g.moveTo(38,20);g.lineTo(47,23);g.lineTo(46,30);g.lineTo(38,27);g.closePath();g.fill();g.strokeStyle='#8a6a3a';g.lineWidth=.6;g.stroke();g.fillStyle='#6a4ad0';g.fillRect(40,24,4,1.4)}return}
    if(o.k==='scroll'){IIK.glow(g,32,32,24,o.glow,.45);g.save();g.translate(32,32);g.rotate(-.5);Kit.solid(g,q=>q.rect(-16,-10,32,20),-16,-10,16,10,c,{tex:'cloth',texA:.3,lineW:.8});g.strokeStyle='rgba(90,60,30,.6)';g.lineWidth=.8;for(let y=-5;y<=5;y+=3.3){g.beginPath();g.moveTo(-11,y);g.lineTo(9-(y>3?6:0),y);g.stroke()}
      for(const x of [-17,17])Kit.solid(g,q=>q.ellipse(x,0,3.2,11.5,0,0,6.283),x-3,-11,x+3,11,Kit.lit(c,-.15),{lineW:.8});g.fillStyle='#8a6a3a';for(const x of [-17,17]){g.fillRect(x-1.5,-14,3,3);g.fillRect(x-1.5,11,3,3)}
      g.fillStyle=IIK.lin(g,0,-10,0,14,['#7ab8ff','#2a5ad0']);g.fillRect(-2,-11,4,22);g.beginPath();g.moveTo(-2,11);g.lineTo(-4,17);g.lineTo(-.5,15);g.lineTo(2,18);g.lineTo(2,11);g.fill();IIK.gem(g,0,0,3.4,'#9fd0ff');g.restore();return}
    if(o.k==='coins'){IIK.glow(g,32,38,22,o.glow,.45);const cs=[[22,46],[40,46],[31,48],[26,38],[38,38],[32,30],[31,40]];for(const [x,y] of cs){g.fillStyle='#6a4a10';g.beginPath();g.ellipse(x,y+2,8,4.4,0,0,6.283);g.fill();Kit.solid(g,q=>q.ellipse(x,y,8,4.4,0,0,6.283),x-8,y-4,x+8,y+4,c,{rim:'rgba(255,248,210,.95)',lineW:.8});g.strokeStyle='rgba(120,80,10,.55)';g.lineWidth=.7;g.beginPath();g.ellipse(x,y,5,2.6,0,0,6.283);g.stroke()}IIK.spark(g,40,26,4);IIK.spark(g,20,40,2.6);return}
    if(o.k==='letter'){Kit.solid(g,q=>q.rect(12,18,40,28),12,18,52,46,c,{tex:'cloth',texA:.25,lineW:.9});g.strokeStyle='rgba(120,90,50,.7)';g.lineWidth=1;g.beginPath();g.moveTo(12,18);g.lineTo(32,34);g.lineTo(52,18);g.moveTo(12,46);g.lineTo(27,30);g.moveTo(52,46);g.lineTo(37,30);g.stroke();IIK.glow(g,32,34,10,o.glow,.4);g.fillStyle=IIK.rad(g,32,34,6,['#e85a4a','#9a2a22','#5a1010'],30,32);g.beginPath();g.arc(32,34,5,0,6.283);g.fill();g.fillStyle='rgba(255,220,200,.7)';g.fillRect(31.2,31.5,1.6,5);g.fillRect(29.5,33.2,5,1.6);return}
    // 잡동사니: 녹슨 쇳조각 + 뼈 + 깨진 병
    Kit.solid(g,q=>{q.moveTo(12,46);q.lineTo(30,40);q.lineTo(34,48);q.lineTo(16,54);q.closePath()},12,40,34,54,'#7a5a3a',{tex:'metal',lineW:.8});g.fillStyle='rgba(150,70,20,.45)';g.beginPath();g.arc(22,48,3,0,6.283);g.fill();
    Kit.solid(g,q=>{q.moveTo(26,22);q.lineTo(48,40);q.lineTo(45,43);q.lineTo(23,25);q.closePath()},23,22,48,43,'#d8ceb4',{tex:'bone',lineW:.7});for(const [x,y] of [[25,22],[22,25],[47,41],[44,44]]){g.fillStyle='#e8dcc0';g.beginPath();g.arc(x,y,3,0,6.283);g.fill();g.strokeStyle='rgba(90,70,40,.6)';g.lineWidth=.6;g.stroke()}
    g.fillStyle='rgba(120,160,130,.55)';g.beginPath();g.moveTo(40,52);g.lineTo(44,40);g.lineTo(50,42);g.lineTo(54,52);g.lineTo(48,49);g.closePath();g.fill();g.strokeStyle='rgba(200,240,210,.6)';g.lineWidth=.7;g.stroke()},
};
// 일반 부위(나중에 늘어날 수 있는 부위): 이름 해시로 색을 정하고 상자·보석으로
IPAINT.generic=(g,o)=>{Kit.solid(g,c=>{c.moveTo(16,20);c.lineTo(48,20);c.lineTo(52,50);c.lineTo(12,50);c.closePath()},12,20,52,50,o.body||'#6a5a4a',{tex:'leather',lineW:.9});IIK.glow(g,32,34,12,o.glow,.6);IIK.gem(g,32,35,5,o.gem||'#ffd76a')};

/* ===== 키 · 설계 찾기 ===== */
function itemBaseIx(it){const S=SLOT[it.slot];if(!S||!S.base)return 0;const nm=String(it.name||'');
  let best=-1,bl=0;S.base.forEach((b,i)=>{if(nm.endsWith(b)&&b.length>bl){best=i;bl=b.length}});
  return best>=0?best:clamp(Math.floor((it.il||1)/8),0,S.base.length-1)}
function itemIconKey(it){if(!it)return'';
  if(it.rar>=4&&IUNQ[it.name])return'u/'+it.name;
  if(it.set&&ISET[it.set]&&ISET[it.set][it.slot])return's/'+it.set+'/'+it.slot;
  return'b/'+it.slot+'/'+itemBaseIx(it)}
function iconSpec(key){const [t,a,b]=key.split('/');
  if(t==='m')return{paint:'misc',o:IMISC[a]||IMISC.junk};
  if(t==='u'){const all=UNIQ.concat(BOSSU),u=all.find(x=>x.n===a);const slot=u?u.slot:'staff';return{paint:IPAINT[slot]?slot:'generic',o:IUNQ[a]}}
  if(t==='s')return{paint:IPAINT[b]?b:'generic',o:ISET[a][b]};
  const arr=IBASE[a];if(arr&&IPAINT[a])return{paint:a,o:arr[clamp(+b|0,0,arr.length-1)]};
  const h=hash((a||'').length*31+(+b|0),(a||'x').charCodeAt(0)),hu=(h*360)|0;
  return{paint:'generic',o:{body:`hsl(${hu},28%,34%)`,gem:`hsl(${(hu+180)%360},70%,65%)`,glow:`hsl(${(hu+180)%360},70%,65%)`}}}
// 굽기: bg=1이면 어두운 바탕(가방 칸), 0이면 투명(땅에 떨어진 모습)
const II_PX=96;
function iconCanvas(key,bg){const ck=key+(bg?'':'#g');let cv=IIC.cv.get(ck);if(cv)return cv;
  const sp=iconSpec(key);cv=document.createElement('canvas');cv.width=cv.height=II_PX;const g=cv.getContext('2d');g.imageSmoothingQuality='high';g.scale(II_PX/64,II_PX/64);
  if(bg){const gl=sp.o.glow||'#c9a46a';g.fillStyle=IIK.rad(g,30,26,46,[Kit.mix(gl,'#14100c',.72),Kit.mix(gl,'#0c0a08',.88),'#060505']);g.fillRect(0,0,64,64);
    g.fillStyle=IIK.rgb('#000',.35);for(let i=0;i<40;i++){g.globalAlpha=.08+hash(i,key.length)*.1;g.beginPath();g.arc(hash(i,1)*64,hash(i,2)*64,2+hash(i,3)*6,0,6.283);g.fill()}g.globalAlpha=1}
  try{g.save();IPAINT[sp.paint](g,sp.o);g.restore()}catch(e){g.restore();IIK.gem(g,32,32,8,'#ffd76a')}
  if(bg){g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;g.strokeRect(0,0,64,64)}
  if(IIC.cv.size>400)IIC.cv.clear();IIC.cv.set(ck,cv);return cv}
function iconUrl(key){let u=IIC.url.get(key);if(u)return u;try{u=iconCanvas(key,1).toDataURL('image/png')}catch(_){u=''}IIC.url.set(key,u);return u}
// HTML: 희귀도 틀(RAR 색) 안의 그림. 착용 칸이 비었으면 그 부위 바탕을 흐리게
function itemIcon(it,o){o=o||{};const sz=o.sz||44;
  if(!it){const sl=o.slot;if(!sl)return'';return `<span class="iic empty" style="width:${sz}px;height:${sz}px" title="${SLOT[sl]?SLOT[sl].n:''} 칸 비어 있음"><img src="${iconUrl('b/'+sl+'/0')}" alt=""></span>`}
  const c=RAR[clamp(it.rar|0,0,RAR.length-1)].c;
  return `<span class="iic r${it.rar|0}" style="width:${sz}px;height:${sz}px;--rc:${c}${typeof rfFrame==='function'?rfFrame(it):''}"><img src="${iconUrl(itemIconKey(it))}" alt=""></span>`}
function miscIcon(k,sz){sz=sz||22;return `<img class="iicm" src="${iconUrl('m/'+k)}" alt="" style="width:${sz}px;height:${sz}px">`}
// 땅에 떨어진 장비: 투명 바탕 그림 (한 번 굽고 재사용)
function itemGroundCv(it){return iconCanvas(itemIconKey(it),0)}
// 모든 아이콘 키 (점검·도감·견본용)
function allIconKeys(){const ks=[];for(const sl in SLOT){const n=SLOT[sl].base?SLOT[sl].base.length:1;for(let i=0;i<n;i++)ks.push('b/'+sl+'/'+i)}
  for(const u of UNIQ.concat(BOSSU))ks.push('u/'+u.n);for(const sid in SETS)for(const sl in SETS[sid].p)ks.push('s/'+sid+'/'+sl);for(const k in IMISC)ks.push('m/'+k);return ks}
// 가방 칸 격자 (40칸): 칸을 누르면 아래 목록의 그 장비로 이동
function bagGridHtml(){let h=`<div class="baggrid" role="list" aria-label="가방 ${P.bag.length}/${BAG_MAX}">`;
  for(let i=0;i<BAG_MAX;i++){const it=P.bag[i];h+=it?`<button type="button" class="bagc" role="listitem" data-bagcell="${it.id}" title="${typeof itemName==='function'?itemName(it):it.name} · ${RAR[it.rar].n} ${SLOT[it.slot]?SLOT[it.slot].n:''} Lv${it.il}">${itemIcon(it,{sz:40})}</button>`:'<span class="bagc none" role="listitem"></span>'}
  return h+'</div>'}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-bagcell]');if(!b)return;const pb=document.getElementById('pbody');if(!pb)return;
  const row=pb.querySelector(`.item[data-iid="${b.dataset.bagcell}"]`);if(!row)return;row.scrollIntoView({block:'center',behavior:'smooth'});row.classList.remove('iflash');void row.offsetWidth;row.classList.add('iflash')});
(()=>{const st=document.createElement('style');st.textContent=`
.iic{display:inline-flex;flex-shrink:0;border:1.5px solid var(--rc,#6a5a40);border-radius:4px;background:#080706;box-shadow:inset 0 0 0 1px rgba(0,0,0,.7),0 0 5px color-mix(in srgb,var(--rc,#000) 35%,transparent);overflow:hidden;box-sizing:border-box;vertical-align:middle}
.iic img{width:100%;height:100%;display:block}
.iic.r0{box-shadow:inset 0 0 0 1px rgba(0,0,0,.7)}
.iic.empty{border-color:#3a3226;opacity:.35;filter:grayscale(1)}
.iicm{vertical-align:-6px;margin-right:6px;border-radius:3px}
.item.hasic{justify-content:flex-start}.item.hasic>.iic{align-self:flex-start}.item.hasic>div:nth-child(2){flex:1;min-width:0}
.item.iflash{animation:iflash 1.1s ease-out}@keyframes iflash{0%{background:#4a3a1a}100%{background:#17140f}}
.baggrid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:4px;max-width:420px;margin:0 0 10px}
.bagc{aspect-ratio:1;padding:0;border:1px solid #2e271c;border-radius:4px;background:#0e0c0a;display:flex;align-items:center;justify-content:center;cursor:pointer;min-width:0}
.bagc.none{cursor:default;background:repeating-linear-gradient(135deg,#0e0c0a 0 4px,#120f0c 4px 8px)}
.bagc .iic{width:100%!important;height:100%!important}
.gearic{display:flex;gap:10px;align-items:center}
@media (max-width:520px){.item.hasic{flex-wrap:wrap}.item.hasic>.iic{width:36px!important;height:36px!important}.item.hasic>div:nth-child(2){flex:1 1 calc(100% - 50px)}.item.hasic>.btns{width:100%;justify-content:flex-end}.baggrid{gap:3px}}
`;document.head.appendChild(st)})();
(()=>{const st=document.createElement('style');st.textContent=`.sk .iicm{margin:0;width:24px!important;height:24px!important;filter:drop-shadow(0 0 2px rgba(0,0,0,.9))}@media (max-width:640px){.sk .iicm{width:17px!important;height:17px!important}}`;document.head.appendChild(st)})();
window.__itemIcons={allIconKeys,iconCanvas,iconUrl,itemIconKey,iconSpec};
