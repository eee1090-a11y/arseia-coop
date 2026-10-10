/* ---------- 그래픽 기반: 자동 품질 · 스프라이트 캐시 · 그림 도구 · 그림 슬롯 · 갤러리 ---------- */
// 자동 품질: 실제 프레임 간격의 이동 평균이 길면 한 단계 내리고, 오래 여유 있으면 다시 올린다.
const Q={lvl:2,ema:16.7,lowT:0,highT:0,pcap:900,burstK:1,
  tick(ms){if(!(ms>0)||ms>100)return;this.ema+=(ms-this.ema)*.05;if(typeof autoResTick==='function')autoResTick(ms,this.ema,this.lvl);
    if(this.ema>24){this.lowT+=ms;this.highT=0}else if(this.ema<15.5){this.highT+=ms;this.lowT=0}else this.lowT=this.highT=0;
    if(this.lowT>2000&&this.lvl>0){this.lvl--;this.lowT=0;this.apply()}
    if(this.highT>8000&&this.lvl<2){this.lvl++;this.highT=0;this.apply()}},
  apply(){this.pcap=[350,600,900][this.lvl];this.burstK=[.45,.7,1][this.lvl]}};

// 스프라이트 캐시: 키마다 오프스크린 캔버스를 한 번 굽고 재사용한다. 화소 비율로 굽고, 앵커(발밑)를 함께 둔다.
const SC={map:new Map(),bytes:0,cap:(matchMedia('(pointer:coarse)').matches?64:96)*1048576,bakeLeft:8,
  get(key,w,h,ax,ay,paint,o){let e=this.map.get(key);if(e){e.used=frameN;return e}
    o=o||{};if(!o.force&&this.bakeLeft<=0)return null;this.bakeLeft--;
    const s=o.scale||Math.max(1,DPR),cv=document.createElement('canvas');cv.width=Math.max(1,Math.ceil(w*s));cv.height=Math.max(1,Math.ceil(h*s));
    const g=cv.getContext('2d');g.imageSmoothingQuality='high';g.scale(s,s);paint(g,w,h);
    e={key,cv,w,h,ax,ay,s,bytes:cv.width*cv.height*4,used:frameN,pin:!!o.pin};this.map.set(key,e);this.bytes+=e.bytes;this.evict();return e},
  evict(){if(this.bytes<=this.cap)return;const arr=[...this.map.values()].sort((a,b)=>a.used-b.used);
    for(const e of arr){if(this.bytes<=this.cap*.85)break;if(e.pin)continue;this.map.delete(e.key);this.bytes-=e.bytes}},
  draw(c,e,x,y,k){k=k||1;c.drawImage(e.cv,x-e.ax*k,y-e.ay*k,e.w*k,e.h*k)}};

// 그림 도구
const Kit={
  hex(c){if(c[0]!=='#'){const m=c.match(/[\d.]+/g);return m&&m.length>=3?[+m[0],+m[1],+m[2]]:[128,128,128]}if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];const n=parseInt(c.slice(1),16);return[n>>16&255,n>>8&255,n&255]},
  rgb(a,al){return al==null?`rgb(${a[0]|0},${a[1]|0},${a[2]|0})`:`rgba(${a[0]|0},${a[1]|0},${a[2]|0},${al})`},
  mix(c1,c2,t){const a=this.hex(c1),b=this.hex(c2);return this.rgb([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t])},
  lit(c,k){return k>=0?this.mix(c,'#fff6e0',k):this.mix(c,'#0a0810',-k)},
  // 하나의 기본색에서 밝은 면 · 중간 · 어두운 면 · 반사광 4색을 만든다 (광원: 왼쪽 위)
  ramp(c){return{hi:this.lit(c,.32),mid:c,lo:this.lit(c,-.45),bounce:this.mix(this.lit(c,-.3),'#6a5a8a',.25),line:this.rgb(this.hex(this.lit(c,-.7)),.7)}},
  // 입체 명암: 경로를 왼쪽 위→오른쪽 아래 그라디언트로 칠한다 (굽는 순간에만 쓴다)
  shade(g,path,x0,y0,x1,y1,c){const r=typeof c==='string'?this.ramp(c):c,gr=g.createLinearGradient(x0,y0,x1,y1);
    gr.addColorStop(0,r.hi);gr.addColorStop(.42,r.mid);gr.addColorStop(.86,r.lo);gr.addColorStop(1,r.bounce);g.fillStyle=gr;g.beginPath();path(g);g.fill();return r},
  // 외곽광: 왼쪽 위 테두리만 밝게 (경로 안쪽으로 잘라 그린다)
  rim(g,path,x0,y0,x1,y1,col,w){g.save();g.beginPath();path(g);g.clip();const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,col||'rgba(255,236,200,.75)');gr.addColorStop(.5,'rgba(255,236,200,0)');
    g.strokeStyle=gr;g.lineWidth=(w||1.6)*2;g.beginPath();path(g);g.stroke();g.restore()},
  // 부드러운 외곽선: 검정 대신 같은 계열의 어두운 색, 반투명
  outline(g,path,col,w){g.strokeStyle=col;g.lineWidth=w||1.2;g.lineJoin='round';g.beginPath();path(g);g.stroke()},
  // 3종 세트: 명암 + 외곽광 + 외곽선
  solid(g,path,x0,y0,x1,y1,c,o){o=o||{};const r=this.shade(g,path,x0,y0,x1,y1,c);if(o.tex){g.save();g.globalAlpha=o.texA||.35;g.globalCompositeOperation='overlay';g.fillStyle=this.pattern(g,o.tex);g.beginPath();path(g);g.fill();g.restore()}
    this.rim(g,path,x0,y0,x1,y1,o.rim,o.rimW);this.outline(g,path,r.line,o.lineW);return r},
  // 접지 그림자: 흐린 타원 한 장을 굽고 크기만 바꿔 쓴다
  shadowE:null,
  shadow(c,x,y,rx,ry,a){const e=this.shadowE||(this.shadowE=SC.get('kit/shadow',128,64,64,32,g=>{const gr=g.createRadialGradient(64,32,0,64,32,64);gr.addColorStop(0,'rgba(0,0,0,.62)');gr.addColorStop(.55,'rgba(0,0,0,.34)');gr.addColorStop(1,'rgba(0,0,0,0)');g.save();g.scale(1,.5);g.translate(0,32);g.fillStyle=gr;g.fillRect(0,-32,128,128);g.restore()},{force:1,pin:1,scale:1}));
    const pa=c.globalAlpha;c.globalAlpha=pa*(a==null?1:a);c.drawImage(e.cv,x-rx,y-ry,rx*2,ry*2);c.globalAlpha=pa},
  // 빛 번짐: 색마다 한 장 (흰 중심 → 색 → 투명)
  glows:new Map(),
  glowCv(col){let cv=this.glows.get(col);if(cv)return cv;cv=document.createElement('canvas');cv.width=cv.height=96;const g=cv.getContext('2d'),gr=g.createRadialGradient(48,48,0,48,48,48);
    gr.addColorStop(0,'#fff');gr.addColorStop(.3,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,96,96);if(this.glows.size>160)this.glows.clear();this.glows.set(col,cv);return cv},
  // 재질 무늬: 시드 고정 노이즈 64px 타일
  tiles:{},pats:new WeakMap(),
  tile(name){if(this.tiles[name])return this.tiles[name];const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d'),s=mulberry(name.length*977+name.charCodeAt(0));
    g.fillStyle='#808080';g.fillRect(0,0,64,64);
    const dab=(x,y,r,v,a)=>{g.fillStyle=`rgba(${v},${v},${v},${a})`;g.beginPath();g.ellipse(x,y,r,r*(.5+s()*.5),s()*3,0,6.283);g.fill()};
    if(name==='cloth'){for(let i=0;i<26;i++){const x=s()*64;{const v=s()<.5?40:220;g.strokeStyle=`rgba(${v},${v},${v},.18)`}g.lineWidth=1+s()*2.5;g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+s()*8-4,20,x+s()*8-4,44,x+s()*6-3,64);g.stroke()}
      for(let i=0;i<300;i++){g.fillStyle=`rgba(0,0,0,${s()*.06})`;g.fillRect(s()*64,s()*64,1,1)}}
    else if(name==='stone'){for(let i=0;i<60;i++)dab(s()*64,s()*64,2+s()*7,s()<.5?60:190,.12+s()*.12);g.strokeStyle='rgba(30,30,30,.25)';g.lineWidth=.8;for(let i=0;i<5;i++){g.beginPath();let x=s()*64,y=s()*64;g.moveTo(x,y);for(let k=0;k<4;k++){x+=s()*14-7;y+=s()*14-7;g.lineTo(x,y)}g.stroke()}}
    else if(name==='wood'){for(let y=0;y<64;y+=2+s()*3){{const v=s()<.5?45:200;g.strokeStyle=`rgba(${v},${v},${v},${.12+s()*.12})`}g.lineWidth=.8+s()*1.4;g.beginPath();g.moveTo(0,y);g.bezierCurveTo(20,y+s()*4-2,44,y+s()*4-2,64,y);g.stroke()}
      for(let i=0;i<3;i++){const x=s()*64,y=s()*64;g.strokeStyle='rgba(40,30,20,.3)';g.lineWidth=1;g.beginPath();g.ellipse(x,y,4,2,0,0,6.283);g.stroke()}}
    else if(name==='metal'){const gr=g.createLinearGradient(0,0,64,64);gr.addColorStop(0,'#a8a8a8');gr.addColorStop(.5,'#707070');gr.addColorStop(1,'#9a9a9a');g.fillStyle=gr;g.fillRect(0,0,64,64);
      for(let i=0;i<40;i++){g.strokeStyle=`rgba(255,255,255,${s()*.12})`;g.lineWidth=.6;const y=s()*64;g.beginPath();g.moveTo(0,y);g.lineTo(64,y+s()*6-3);g.stroke()}for(let i=0;i<14;i++)dab(s()*64,s()*64,.8+s()*1.4,255,.35)}
    else if(name==='leather'){for(let i=0;i<120;i++)dab(s()*64,s()*64,1+s()*2.5,s()<.5?70:170,.1+s()*.1);for(let i=0;i<6;i++){g.strokeStyle='rgba(40,30,20,.2)';g.lineWidth=.7;g.beginPath();g.moveTo(s()*64,s()*64);g.quadraticCurveTo(s()*64,s()*64,s()*64,s()*64);g.stroke()}}
    else if(name==='bone'){for(let i=0;i<40;i++)dab(s()*64,s()*64,1+s()*5,s()<.3?90:210,.1+s()*.1);for(let i=0;i<10;i++){g.strokeStyle='rgba(70,60,40,.22)';g.lineWidth=.6;const x=s()*64;g.beginPath();g.moveTo(x,s()*64);g.lineTo(x+s()*10-5,s()*64);g.stroke()}}
    else if(name==='grass'){for(let i=0;i<90;i++){const x=s()*64,y=s()*64;{const v=s()<.5?50:210;g.strokeStyle=`rgba(${v},${v},${v},.18)`}g.lineWidth=.8;g.beginPath();g.moveTo(x,y);g.lineTo(x+s()*3-1.5,y-3-s()*5);g.stroke()}}
    return this.tiles[name]=cv},
  pattern(g,name){let m=this.pats.get(g);if(!m){m={};this.pats.set(g,m)}return m[name]||(m[name]=g.createPattern(this.tile(name),'repeat'))},
  // 팔레트: 채도 낮은 흙색 바탕 + 선명한 강조색
  pal:{
    region:{meadow:['#4a5230','#3c4428','#5e6a3a'],forest:['#2e3a26','#24301e','#3e4c30'],ash:['#4a463a','#3a362e','#5e584a'],sanctum:['#4e362c','#3a2620','#6a4a3a']},
    cloth:{mage:['#3a3e8a','#24265a','#b8964a'],priest:['#e8e0cc','#a89e88','#d6b262']},
    wood:'#6a4a2c',stone:'#7a7468',metal:'#9a9aa2',leather:'#6a4a32',bone:'#d8ceb4',gold:'#e8b840',
  },
};
// 스케치용: 날카로운 고정 그라디언트 객체를 한 번만 만든다 (같은 지역 좌표에서 재사용)
const GR={};const grad=(key,mk)=>GR[key]||(GR[key]=mk());

// 그림 슬롯: 모든 그림 요청은 Art.get(종류, 상태)를 거친다. data URL 그림이 등록되면 그것이 먼저 쓰인다.
const Art={imgs:new Map(),painters:{},
  register(key,url,ax,ay,w,h){const im=new Image();im.onload=()=>this.imgs.set(key,{key,cv:im,w:w||im.naturalWidth,h:h||im.naturalHeight,ax:ax||0,ay:ay||0,img:1});im.src=url},
  def(kind,fn){this.painters[kind]=fn},
  get(kind,state){const k=state!=null&&state!==''?kind+'/'+state:kind;const im=this.imgs.get(k);if(im)return im;
    const p=this.painters[kind];if(!p)return null;const d=p(state);return SC.get('art/'+k,d.w,d.h,d.ax,d.ay,d.paint,d.o)}};

// 첫 그림들: 떨어진 금화 · 물약 · 장비 (지형과 한눈에 구분되도록 밝은 테두리 + 받침 빛)
Art.def('coin',()=>({w:34,h:26,ax:17,ay:18,o:{pin:1},paint(g){
  Kit.shadow(g,17,19,15,5,.8);
  for(const [cx,cy] of [[11,15],[22,15],[16,11],[17,17]]){const p=c=>{c.ellipse(cx,cy,6,3.4,0,0,6.283)};
    g.fillStyle='#6a4a10';g.beginPath();g.ellipse(cx,cy+1.6,6,3.4,0,0,6.283);g.fill();
    Kit.solid(g,p,cx-6,cy-3,cx+6,cy+3,'#e8b840',{rim:'rgba(255,248,210,.95)',lineW:.8});
    g.strokeStyle='rgba(120,80,10,.6)';g.lineWidth=.7;g.beginPath();g.ellipse(cx,cy,3.6,1.9,0,0,6.283);g.stroke()}}}));
Art.def('potion',kind=>({w:24,h:32,ax:12,ay:28,o:{pin:1},paint(g){const c=kind==='mp'?'#4a7af0':'#e0443a';
  Kit.shadow(g,12,28,9,3.5,.8);
  const body=c2=>{c2.moveTo(9,9);c2.lineTo(15,9);c2.lineTo(15,13);c2.bezierCurveTo(21,15,21,27,12,27);c2.bezierCurveTo(3,27,3,15,9,13);c2.closePath()};
  Kit.solid(g,body,4,10,20,27,c,{rim:'rgba(255,255,255,.9)'});
  g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(9,18,1.8,4,.3,0,6.283);g.fill();
  Kit.solid(g,c2=>c2.rect(9,5,6,5),9,5,15,10,'#a8784a',{lineW:.8})}}));
Art.def('gem',rar=>({w:30,h:30,ax:15,ay:22,o:{pin:1},paint(g){const c=RAR[rar|0].c;
  Kit.shadow(g,15,23,12,4,.8);
  const gr=g.createRadialGradient(15,15,0,15,15,14);gr.addColorStop(0,Kit.rgb(Kit.hex(c),.45));gr.addColorStop(1,Kit.rgb(Kit.hex(c),0));g.fillStyle=gr;g.fillRect(0,0,30,30);
  const d=c2=>{c2.moveTo(15,5);c2.lineTo(22,13);c2.lineTo(15,22);c2.lineTo(8,13);c2.closePath()};
  Kit.solid(g,d,8,5,22,22,c,{rim:'rgba(255,255,255,.95)',lineW:1});
  g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.moveTo(15,5);g.lineTo(18,12);g.lineTo(15,13);g.lineTo(11,10);g.closePath();g.fill()}}));
// 갤러리 확인용 견본: 재질 무늬 + 명암 공
Art.def('swatch',name=>({w:72,h:72,ax:36,ay:66,paint(g){Kit.shadow(g,36,64,26,7,.9);const c={cloth:'#3a3e8a',stone:'#7a7468',wood:'#6a4a2c',metal:'#9a9aa2',leather:'#6a4a32',bone:'#d8ceb4',grass:'#4a5a30'}[name]||'#888';
  Kit.solid(g,c2=>c2.arc(36,36,26,0,6.283),12,12,60,60,c,{tex:name,texA:.6})}}));

// 갤러리: 주소 끝 #gallery (또는 Ctrl+Shift+G)
function showGallery(){
  SC.bakeLeft=99;
  for(const k of ['cloth','stone','wood','metal','leather','bone','grass'])Art.get('swatch',k);for(let r=0;r<6;r++)Art.get('gem',r);Art.get('potion','hp');Art.get('potion','mp');Art.get('coin');
  let box=document.getElementById('gallery');if(!box){box=document.createElement('div');box.id='gallery';document.body.appendChild(box)}
  box.style.cssText='position:fixed;inset:0;z-index:99;overflow:auto;background:#0d0c0b;color:#e8e2d2;font:13px var(--body,sans-serif);padding:16px';
  let mem=0;for(const e of SC.map.values())mem+=e.bytes;let chunkMem=0;for(const c of chunks.values())chunkMem+=c.cv.width*c.cv.height*4;
  box.innerHTML=`<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px"><b style="font-size:16px">스프라이트 갤러리</b><span>스프라이트 ${SC.map.size}장 · ${(mem/1048576).toFixed(1)}MB · 땅 조각 ${chunks.size}장 · ${(chunkMem/1048576).toFixed(1)}MB · 품질 ${Q.lvl} · 프레임 ${Q.ema.toFixed(1)}ms</span><button type="button" id="galClose" style="margin-left:auto">닫기</button></div><div id="galGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px"></div>`;
  const grid=box.querySelector('#galGrid');
  const add=(name,cv,w,h,ax,ay)=>{const cell=document.createElement('div');cell.style.cssText='background:#1c1a17 repeating-conic-gradient(#22201c 0 25%,#1a1815 0 50%) 0 0/16px 16px;border:1px solid #3a342a;border-radius:6px;padding:8px;text-align:center';
    const c=document.createElement('canvas'),k=Math.min(2,100/Math.max(w,h));c.width=w*k*2;c.height=h*k*2;c.style.width=w*k+'px';c.style.height=h*k+'px';const g=c.getContext('2d');g.drawImage(cv,0,0,c.width,c.height);
    if(ax!=null){g.strokeStyle='#ff5a5a';g.lineWidth=2;g.beginPath();g.moveTo(ax*k*2-6,ay*k*2);g.lineTo(ax*k*2+6,ay*k*2);g.moveTo(ax*k*2,ay*k*2-6);g.lineTo(ax*k*2,ay*k*2+6);g.stroke()}
    cell.appendChild(c);const t=document.createElement('div');t.textContent=name;t.style.cssText='font-size:11px;opacity:.75;word-break:break-all;margin-top:4px';cell.appendChild(t);grid.appendChild(cell)};
  for(const e of SC.map.values())add(e.key,e.cv,e.w,e.h,e.ax,e.ay);
  for(const n in Kit.tiles)add('texture/'+n,Kit.tiles[n],64,64);
  heroGallery(box);monGallery(box);regDecorGallery(box);
  box.querySelector('#galClose').onclick=()=>{box.remove();if(location.hash==='#gallery')history.replaceState(null,'',location.pathname+location.search)};
}
addEventListener('hashchange',()=>{if(location.hash==='#gallery')showGallery()});
addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.code==='KeyG'){e.preventDefault();showGallery()}});
