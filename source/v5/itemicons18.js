/* ---------- v18: 전사 · 궁수 장비 아이콘 ----------
   itemicons.js와 같은 화가 방식(64×64 논리 좌표, 왼쪽 위 광원, 굽는 순간에만 그라디언트, 키마다 한 번 굽고 캐시).
   무기 종류(it.wt)마다 8단계 바탕: 한손검 · 창/폴암 · 활 · 석궁 · 방패 · 화살통 · 판금(전사 갑옷) · 가죽(궁수 갑옷).
   키: 'b/<wt>/<단계>'(cls2.js) · v18 유니크·상급 유니크는 'u/<이름>'(IUNQ에 wt를 달아 둠) · v18 세트는 's/<세트>/<칸>'. */
// 단계별 설계 (v18-items.js BASE_V18 이름 순서)
const IW_NAMES={
  sword:['녹슨 장검','철 장검','기사의 장검','룬 장검','은룡의 검','용뼈 검','별철 검','근원의 검'],
  polearm:['참나무 창','철 창','기병창','룬 할버드','은룡의 글레이브','용뼈 창','별철 할버드','근원의 창'],
  bow:['사냥꾼의 단궁','물푸레 활','합성궁','룬 장궁','은룡의 활','용뼈 활','별철 장궁','근원의 활'],
  xbow:['나무 석궁','철 석궁','연발 석궁','룬 석궁','은룡의 석궁','용뼈 석궁','별철 석궁','근원의 석궁'],
  shield:['나무 원방패','철 원방패','연 방패','룬 방패','은룡의 방패','용비늘 방패','별철 탑방패','근원의 방패'],
  quiver:['가죽 화살통','사냥꾼의 화살통','깃 장식 화살통','룬 화살통','은룡의 화살통','용가죽 화살통','별빛 화살통','근원의 화살통'],
  plate:['누빈 갑옷','사슬 갑옷','비늘 갑옷','판금 흉갑','은룡의 갑주','용비늘 갑주','별철 판금','근원의 갑주'],
  leather:['가죽 조끼','징 박은 가죽','사냥꾼의 가죽옷','룬 가죽옷','은룡의 가죽옷','용가죽 갑옷','별빛 가죽옷','근원의 가죽옷']};
// 단계 공통 재질: 금속색 · 장식(금) · 보석 · 빛 · 특징
const IW_T=[
  {m:'#8a7a6a',d:'#6a5040',gem:null,glow:'#a89080',rust:1,wood:'#7a5a3a'},
  {m:'#a8aeb8',d:'#5a4030',gem:null,glow:'#b8c0cc',wood:'#6a4a2c'},
  {m:'#c8ced8',d:'#d4aa4c',gem:'#3a6ad0',glow:'#9ab8ff',wood:'#5a3a24'},
  {m:'#9aa4b8',d:'#4a5a8a',gem:'#6ab0ff',glow:'#6ab0ff',rune:1,wood:'#3a2a20'},
  {m:'#d8e4f0',d:'#8ab0d8',gem:'#8fd8ff',glow:'#9fd8ff',dragon:1,wood:'#c8ccd8'},
  {m:'#e0d4b8',d:'#8a2a1a',gem:'#ff5a3a',glow:'#ff7a2e',bone:1,wood:'#d8ceb4'},
  {m:'#4a5070',d:'#c8d0f0',gem:'#e8f0ff',glow:'#b9d0ff',star:1,wood:'#2a2e44'},
  {m:'#f0d070',d:'#b9a2ff',gem:'#efe6ff',glow:'#b9a2ff',origin:1,wood:'#e0b040'}];
const IW={};for(const w in IW_NAMES)IW[w]=IW_T.map((t,i)=>Object.assign({wt:w,tier:i},t));
const IW_FACE=['#7a5a3a','#5a6a7a','#8a2a24','#26386a','#c8d8e8','#6a2a1a','#1c2250','#f0ead8'];// 방패 바탕
const IW_EMB=['none','boss','lion','rune','dragon','scale','star','sun'];
// v18 유니크 (UNIQ_V18 · BOSSU_V18 이름)
Object.assign(IUNQ,{
  '브렌힐 수비대장의 검':Object.assign({},IW.sword[2],{m:'#d8dce4',d:'#e8c35a',gem:'#d02a3a',glow:'#ffb060',guard:'wing'}),
  '용뼈 글레이브':Object.assign({},IW.polearm[5],{head:'glaive',gem:'#ff3a1a'}),
  '성문 방패':Object.assign({},IW.shield[1],{face:'#5a3a24',emb:'gate',glow:'#ff9a3a',gem:'#ffb040'}),
  '광전사의 띠':{cord:'#5a1a10',pend:'tooth',metal:'#8a2a24',gem:'#e0243a',glow:IEL.blood},
  '바람길 장궁':Object.assign({},IW.bow[3],{m:'#bfeedd',gem:'#bfeedd',glow:'#bfeedd',wind:1}),
  '세 원소의 석궁':Object.assign({},IW.xbow[3],{gem:'#ff7a2e',glow:'#b9a2ff',tri:1}),
  '덫사냥꾼의 화살통':Object.assign({},IW.quiver[2],{glow:'#c8a870',trap:1}),
  '고목 숲 사냥매 깃':{cord:'leather',pend:'tear',metal:'#a87a4a',gem:'#9fe39a',glow:IEL.life},
  '발드라크의 잿불 할버드':Object.assign({},IW.polearm[3],{m:'#3a302a',d:'#ff7a2e',gem:'#ff5a1a',glow:IEL.fire,ember:1}),
  '아르실의 왕실 방패':Object.assign({},IW.shield[4],{face:'#2a3a6a',emb:'crown',glow:'#ffd76a',gem:'#ffd76a'}),
  '모르가스의 재 장궁':Object.assign({},IW.bow[6],{m:'#2a2028',gem:'#ff3a2a',glow:'#ff3a2a',ember:1}),
  '삼키는 자의 이빨 석궁':Object.assign({},IW.xbow[5],{m:'#3a5a3a',gem:'#a0e070',glow:'#a0e070',teeth:1})});
// v18 세트 (SETS_V18 키)
Object.assign(ISET,{
  bulwark:{staff:Object.assign({},IW.sword[2],{glow:'#9fc8ff'}),off:Object.assign({},IW.shield[2],{face:'#2a4a7a',emb:'tower',glow:'#9fc8ff'}),robe:Object.assign({},IW.plate[1],{glow:'#9fc8ff',tab:'#2a4a7a'}),ring:{band:'#a8b0c0',set:'signet',gem:'#5a8aff',glow:'#9fc8ff'}},
  lancer:{staff:Object.assign({},IW.polearm[2],{glow:'#ffd76a',pennon:'#d8483a'}),robe:Object.assign({},IW.plate[3],{glow:'#ffd76a',tab:'#8a2a24'}),ring:{band:'#d4aa4c',set:'round',gem:'#d02a3a',glow:'#ffd76a'},amulet:{cord:'#8a2a24',pend:'star',metal:'#d4aa4c',gem:'#ffd76a',glow:'#ffd76a'}},
  ranger:{staff:Object.assign({},IW.bow[2],{glow:'#9fe39a'}),off:Object.assign({},IW.quiver[2],{glow:'#9fe39a'}),robe:Object.assign({},IW.leather[2],{glow:'#9fe39a',cloak:'#3a5a2e'}),amulet:{cord:'leather',pend:'compass',metal:'#c8a050',gem:'#9fe39a',glow:'#9fe39a'}},
  trapper:{staff:Object.assign({},IW.xbow[1],{glow:'#ff9a3a'}),robe:Object.assign({},IW.leather[1],{glow:'#ff9a3a',cloak:'#b8864a'}),ring:{band:'#8a6a40',set:'round',gem:'#ff7a2e',glow:'#ff9a3a'},amulet:{cord:'leather',pend:'tooth',metal:'#c8a060',gem:'#ff7a2e',glow:'#ff9a3a'}}});
/* ===== 화가 ===== */
const IWP={
  // 금속 날 채우기 (너비 방향 원통 명암)
  steel(g,x0,x1,c){return IIK.lin(g,x0,0,x1,0,[Kit.lit(c,.55),Kit.lit(c,.2),c,Kit.lit(c,-.45)])},
  runes(g,x,y0,y1,col){g.save();g.strokeStyle=col;g.lineWidth=.8;g.globalAlpha=.9;for(let y=y0;y<y1;y+=5){g.beginPath();g.moveTo(x-1,y);g.lineTo(x+1,y+1.5);g.lineTo(x-1,y+3);g.stroke()}g.restore();IIK.glow(g,x,(y0+y1)/2,10,col,.35)},
  stars(g,pts){for(const [x,y,r] of pts)IIK.spark(g,x,y,r||2.4,'#e8f0ff')},
  sword(g,o){const t=o.tier|0;g.save();g.translate(32,33);g.rotate(.785);
    const L=t===0?22:24+Math.min(t,5),W=t>=5?3.4:3,tip=-L-4,bl=c=>{c.moveTo(-W,6);c.lineTo(-W*(t===5?1.1:.9),tip+7);c.lineTo(0,tip);c.lineTo(W*(t===5?1.1:.9),tip+7);c.lineTo(W,6);c.closePath()};
    IIK.glow(g,0,tip+12,18,o.glow,t>=3?.45:.18);
    g.fillStyle=this.steel(g,-W,W,o.m);g.beginPath();bl(g);g.fill();
    g.strokeStyle=IIK.rgb(Kit.lit(o.m,-.6),.7);g.lineWidth=.7;g.beginPath();g.moveTo(0,4);g.lineTo(0,tip+6);g.stroke();
    g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=.6;g.beginPath();g.moveTo(-W*.6,4);g.lineTo(-W*.5,tip+7);g.stroke();
    if(o.rust){g.fillStyle='rgba(140,70,30,.55)';for(const [x,y,r] of [[-1,-6,1.6],[1.2,-14,1.2],[-.6,-20,1]]){g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}}
    if(o.rune)this.runes(g,0,tip+9,2,o.glow);if(o.star)this.stars(g,[[0,-10,2],[0,-20,2.6],[0,tip+8,1.8]]);
    if(o.bone){g.fillStyle=Kit.lit(o.m,-.25);for(let y=0;y>tip+8;y-=5){g.beginPath();g.moveTo(W,y);g.lineTo(W+1.8,y-2.4);g.lineTo(W,y-3.4);g.closePath();g.fill()}}
    if(o.dragon){g.strokeStyle=IIK.rgb(o.d,.9);g.lineWidth=.7;for(let y=-2;y>tip+8;y-=4){g.beginPath();g.moveTo(-W+.6,y);g.quadraticCurveTo(0,y-2,W-.6,y);g.stroke()}}
    if(o.origin){IIK.glow(g,0,-12,9,o.glow,.6);IIK.gem(g,0,-12,2,o.gem,'diamond')}
    Kit.outline(g,bl,IIK.rgb(Kit.lit(o.m,-.75),.85),.8);
    // 코등이
    const gw=o.guard==='wing'||t>=4?11:t>=2?9:7.5,gc=t<=1?'#8a8e98':o.d;
    const gd=c=>{if(o.guard==='wing'||t>=4){c.moveTo(-gw,3);c.quadraticCurveTo(-gw*.5,9,0,7.5);c.quadraticCurveTo(gw*.5,9,gw,3);c.quadraticCurveTo(gw*.5,5.6,0,5.4);c.quadraticCurveTo(-gw*.5,5.6,-gw,3);c.closePath()}else c.rect(-gw,5.2,gw*2,3)};
    g.fillStyle=this.steel(g,-gw,gw,gc);g.beginPath();gd(g);g.fill();Kit.outline(g,gd,IIK.rgb(Kit.lit(gc,-.7),.8),.7);
    // 손잡이 · 머리
    const wc=t>=5?'#3a1a14':'#4a3020';g.fillStyle=IIK.rodFill(g,-1.6,1.6,wc);g.fillRect(-1.6,8,3.2,9);g.strokeStyle=IIK.rgb(Kit.lit(wc,.4),.7);g.lineWidth=.7;for(let y=9;y<17;y+=2){g.beginPath();g.moveTo(-1.6,y);g.lineTo(1.6,y+1.2);g.stroke()}
    if(o.gem){IIK.glow(g,0,19.5,6,o.glow,.6);IIK.gem(g,0,19.5,2.6,o.gem)}else{g.fillStyle=this.steel(g,-2.6,2.6,gc);g.beginPath();g.arc(0,19.5,2.6,0,6.283);g.fill()}
    g.restore();if(t>=4)IIK.spark(g,46,14,3)},
  polearm(g,o){const t=o.tier|0,head=o.head||(t===2?'lance':t===3||t===6?'halberd':t===4?'glaive':'spear');g.save();g.translate(32,32);g.rotate(.785);
    IIK.glow(g,0,-22,16,o.glow,t>=3?.45:.15);
    const sh=t>=4&&!o.bone?o.wood:o.wood;Kit.solid(g,c=>c.rect(-1.8,-16,3.6,44),-2,-16,2,28,sh,{tex:o.bone||t===4||t===6||t===7?'metal':'wood',texA:.5,lineW:.7});
    for(const y of [-15,6,26]){g.fillStyle=this.steel(g,-2.4,2.4,t<=1?'#8a8e98':o.d);g.fillRect(-2.4,y,4.8,2.2)}
    g.fillStyle=IIK.rodFill(g,-2,2,'#4a3020');g.fillRect(-2,8,4,7);
    const mf=c=>this.steel(g,-6,6,c);
    if(head==='lance'){const ln=c=>{c.moveTo(0,-34);c.lineTo(4.6,-14);c.lineTo(-4.6,-14);c.closePath()};g.fillStyle=mf(o.m);g.beginPath();ln(g);g.fill();Kit.outline(g,ln,'rgba(30,30,40,.8)',.7);
      const vp=c=>{c.moveTo(-7,-12);c.quadraticCurveTo(0,-16,7,-12);c.lineTo(5,-9);c.quadraticCurveTo(0,-11,-5,-9);c.closePath()};g.fillStyle=mf(o.d);g.beginPath();vp(g);g.fill();Kit.outline(g,vp,'rgba(30,30,40,.7)',.6)}
    else{const L=head==='glaive'?20:16,sp=c=>{if(head==='glaive'){c.moveTo(-1.6,-16);c.quadraticCurveTo(-5,-26,0,-38);c.quadraticCurveTo(5,-30,3.4,-16);c.closePath()}else{c.moveTo(0,-16-L-2);c.bezierCurveTo(3.6,-16-L*.6,3.6,-20,2,-16);c.lineTo(-2,-16);c.bezierCurveTo(-3.6,-20,-3.6,-16-L*.6,0,-16-L-2);c.closePath()}};
      g.fillStyle=mf(o.m);g.beginPath();sp(g);g.fill();g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=.6;g.beginPath();g.moveTo(-.6,-18);g.lineTo(-.6,-16-L+2);g.stroke();Kit.outline(g,sp,IIK.rgb(Kit.lit(o.m,-.75),.85),.7);
      if(head==='halberd'){const ax=c=>{c.moveTo(2,-24);c.bezierCurveTo(9,-30,13,-22,11.4,-14);c.quadraticCurveTo(8,-17,2,-16.4);c.closePath()};g.fillStyle=mf(o.m);g.beginPath();ax(g);g.fill();Kit.outline(g,ax,'rgba(30,30,40,.8)',.7);
        const sp2=c=>{c.moveTo(-2,-21);c.lineTo(-8,-23);c.lineTo(-2,-18);c.closePath()};g.fillStyle=mf(o.m);g.beginPath();sp2(g);g.fill()}
      if(o.bone){g.fillStyle=Kit.lit(o.m,-.3);for(const y of [-20,-25,-30]){g.beginPath();g.moveTo(2.6,y);g.lineTo(5,y-3);g.lineTo(2.4,y-2.6);g.fill()}}}
    if(o.rune)this.runes(g,0,-30,-18,o.glow);if(o.star)this.stars(g,[[0,-26,2.4],[-1,4,1.6]]);if(o.ember){IIK.flame(g,6,-26,4,'#ff6a1a','#ffd27a');IIK.flame(g,-5,-20,3,'#ff6a1a','#ffd27a')}
    if(o.pennon){g.fillStyle=o.pennon;g.beginPath();g.moveTo(2,-13);g.lineTo(13,-10);g.lineTo(9,-7);g.lineTo(13,-4);g.lineTo(2,-5);g.closePath();g.fill();g.strokeStyle='#e8c35a';g.lineWidth=.6;g.stroke()}
    else if(t<=3){g.strokeStyle='#c8382a';g.lineWidth=1;for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(0,-15);g.quadraticCurveTo(i*1.2,-10,i*1.8-.6,-6);g.stroke()}}
    if(o.gem){IIK.glow(g,0,-15,6,o.glow,.6);IIK.gem(g,0,-14.6,2.2,o.gem)}
    g.restore()},
  bow(g,o){const t=o.tier|0;g.save();g.translate(30,32);g.rotate(.62);IIK.glow(g,4,0,20,o.glow,t>=3?.4:.15);
    const H=t===0?20:t>=3?27:24,bend=t===2||t===4||t===5?7:5.4,rec=t>=2;
    const limb=sd=>{g.beginPath();g.moveTo(1,sd*3.5);g.bezierCurveTo(bend+3,sd*H*.4,bend+2,sd*H*.85,rec?2:0,sd*H);if(rec)g.quadraticCurveTo(-.6,sd*(H+2.6),-2.6,sd*(H+1.4))};
    g.strokeStyle='rgba(240,232,210,.9)';g.lineWidth=.8;g.beginPath();g.moveTo(rec?-2.4:0,-(rec?H+1.2:H));g.lineTo(rec?-2.4:0,rec?H+1.2:H);g.stroke();
    const wc=o.bone?o.m:t===4||t===6||t===7?o.m:o.wood;
    for(const sd of [-1,1]){limb(sd);g.strokeStyle=IIK.rgb(Kit.lit(wc,-.65),.95);g.lineWidth=4.4;g.lineCap='round';g.stroke();limb(sd);g.strokeStyle=IIK.lin(g,0,-H,8,H,[Kit.lit(wc,.4),wc,Kit.lit(wc,-.3)]);g.lineWidth=3;g.stroke();
      limb(sd);g.strokeStyle='rgba(255,240,210,.45)';g.lineWidth=.7;g.stroke();
      if(t===2||t===5){g.fillStyle=t===5?'#e8dcc0':'#e8dcc0';g.beginPath();g.arc(rec?-2.4:0,sd*(H+1.3),1.4,0,6.283);g.fill()}
      if(t>=4&&!o.bone){g.strokeStyle=o.d;g.lineWidth=.8;for(let k=1;k<4;k++){g.beginPath();g.moveTo(bend*.9-1,sd*H*k/4.6);g.lineTo(bend*.9+2,sd*(H*k/4.6+1.6));g.stroke()}}}
    g.fillStyle=IIK.rodFill(g,0,5,'#3a2418');g.fillRect(.8,-4,4.4,8);g.fillStyle=o.d==='#6a5040'?'#8a6a40':o.d;g.fillRect(.8,-4.6,4.4,1);g.fillRect(.8,3.6,4.4,1);
    if(o.rune)for(const sd of [-1,1])this.runes(g,bend+.4,sd>0?6:-H+4,sd>0?H-4:-6,o.glow);if(o.star)this.stars(g,[[bend+1,-12,2.2],[bend+1,12,2.2]]);if(o.ember)IIK.flame(g,bend+2,-14,3.4,'#ff3a1a','#ffb060');
    if(o.wind){g.strokeStyle='rgba(220,255,240,.75)';g.lineWidth=1;for(const y of [-14,0,14]){g.beginPath();g.moveTo(-14,y);g.quadraticCurveTo(-8,y-3,-3,y);g.stroke()}}
    if(o.gem){IIK.glow(g,6.4,0,6,o.glow,.6);IIK.gem(g,6.4,0,2.2,o.gem)}
    g.restore()},
  xbow(g,o){const t=o.tier|0;g.save();g.translate(31,33);g.rotate(-.62);IIK.glow(g,8,0,18,o.glow,t>=3?.4:.15);
    const wc=t>=4&&!o.bone?Kit.mix(o.wood,'#3a2a20',.4):o.wood;
    const st=c=>{c.moveTo(-22,-1.8);c.lineTo(-10,-3);c.lineTo(16,-3);c.lineTo(16,1);c.lineTo(-6,1.4);c.lineTo(-9,6);c.lineTo(-13,6);c.lineTo(-12,2);c.lineTo(-22,3.6);c.closePath()};
    Kit.solid(g,st,-22,-3,16,6,o.bone?o.m:o.wood,{tex:o.bone?'bone':'wood',texA:.55,lineW:.8});
    if(t===2){Kit.solid(g,c=>c.rect(-2,-10,10,7),-2,-10,8,-3,'#6a4a2c',{tex:'wood',lineW:.7});g.fillStyle='#c8ccd8';g.fillRect(-1,-10.6,8,1.2)}
    const pc=o.m,pr=c=>{c.moveTo(12,-1);c.quadraticCurveTo(9,-14,4,-21);c.lineTo(6.4,-21.6);c.quadraticCurveTo(12.4,-13,15,-1);c.quadraticCurveTo(12.4,13,6.4,21.6);c.lineTo(4,21);c.quadraticCurveTo(9,14,12,1);c.closePath()};
    g.strokeStyle='rgba(240,232,210,.85)';g.lineWidth=.7;g.beginPath();g.moveTo(5,-21);g.lineTo(-2,-1);g.lineTo(5,21);g.stroke();
    g.fillStyle=this.steel(g,4,15,pc);g.beginPath();pr(g);g.fill();Kit.outline(g,pr,IIK.rgb(Kit.lit(pc,-.7),.85),.7);
    g.strokeStyle='#5a3a1c';g.lineWidth=1.2;g.beginPath();g.moveTo(-4,-3.6);g.lineTo(20,-3.6);g.stroke();g.fillStyle=this.steel(g,18,23,'#d8dce4');g.beginPath();g.moveTo(24,-3.6);g.lineTo(19,-5.6);g.lineTo(19,-1.6);g.closePath();g.fill();
    g.fillStyle=t<=1?'#8a8e98':o.d;g.fillRect(-11,-3.4,2,4.6);g.fillRect(14,-3.4,1.6,4.4);
    if(o.rune)this.runes(g,-14,-1,1,o.glow);if(o.star)this.stars(g,[[10,-12,2],[10,12,2]]);
    if(o.tri){IIK.gem(g,8,-15,2,'#ff7a2e');IIK.gem(g,12,0,2,'#8fd8ff');IIK.gem(g,8,15,2,'#ffe066')}
    if(o.teeth){g.fillStyle='#f4efe2';for(let i=0;i<5;i++){g.beginPath();g.moveTo(-20+i*3.4,3.4);g.lineTo(-18.6+i*3.4,7);g.lineTo(-17.4+i*3.4,3.2);g.fill()}}
    if(o.gem&&!o.tri){IIK.glow(g,-17,1,5,o.glow,.6);IIK.gem(g,-17,.8,2,o.gem)}
    g.restore()},
  shield(g,o){const t=o.tier|0,face=o.face||IW_FACE[t],emb=o.emb||IW_EMB[t],shape=t<=1&&!o.emb?'round':t===6||emb==='tower'?'tower':t===2?'kite':'heater';
    IIK.glow(g,32,30,24,o.glow,t>=3?.35:.12);g.save();g.translate(32,32);
    const sh=c=>{if(shape==='round')c.arc(0,0,20,0,6.283);else if(shape==='tower'){c.moveTo(-15,-22);c.quadraticCurveTo(0,-25,15,-22);c.lineTo(15,14);c.quadraticCurveTo(0,26,-15,14);c.closePath()}
      else if(shape==='kite'){c.moveTo(-15,-18);c.quadraticCurveTo(0,-23,15,-18);c.quadraticCurveTo(14,4,0,25);c.quadraticCurveTo(-14,4,-15,-18);c.closePath()}
      else{c.moveTo(-18,-19);c.quadraticCurveTo(0,-23,18,-19);c.lineTo(18,-3);c.bezierCurveTo(18,9,9,17,0,23);c.bezierCurveTo(-9,17,-18,9,-18,-3);c.closePath()}};
    Kit.solid(g,sh,-20,-22,20,25,face,{tex:t<=1?'wood':o.dragon||o.bone?'leather':'metal',texA:.5,rim:'rgba(255,240,214,.8)',lineW:1});
    g.save();g.beginPath();sh(g);g.clip();
    if(t<=1&&shape==='round'){g.strokeStyle='rgba(40,25,10,.45)';g.lineWidth=.8;for(let x=-16;x<=16;x+=6){g.beginPath();g.moveTo(x,-21);g.lineTo(x,21);g.stroke()}}
    if(emb==='lion'||emb==='gate'||emb==='crown'){g.fillStyle=Kit.lit(o.m,.1);g.fillRect(-2.4,-24,4.8,50);g.fillRect(-20,-6,40,4.8)}
    if(o.bone||emb==='scale'){g.strokeStyle=IIK.rgb(Kit.lit(face,.4),.6);g.lineWidth=.8;for(let y=-18;y<24;y+=4)for(let x=-18+(y/4%2?2:0);x<20;x+=4){g.beginPath();g.arc(x,y,2,0,Math.PI);g.stroke()}}
    if(o.star){this.stars(g,[[-8,-10,2],[9,-4,2.6],[-4,8,1.8],[7,12,1.6]])}
    g.restore();
    // 테두리
    g.strokeStyle=this.steel(g,-20,20,t<=1?'#8a8e98':o.d);g.lineWidth=t<=1?2.4:3;g.beginPath();sh(g);g.stroke();
    if(t===1||shape==='round')for(let i=0;i<10;i++){const a=i/10*6.283;g.fillStyle='#d8dce4';g.beginPath();g.arc(Math.cos(a)*18,Math.sin(a)*18,1,0,6.283);g.fill()}
    // 문장
    const ec=o.m;
    if(emb==='boss'||emb==='none'){g.fillStyle=this.steel(g,-6,6,emb==='none'?'#8a7a6a':ec);g.beginPath();g.arc(0,0,emb==='none'?4:6,0,6.283);g.fill();Kit.outline(g,c=>c.arc(0,0,emb==='none'?4:6,0,6.283),'rgba(20,20,30,.8)',.7)}
    else if(emb==='rune'){this.runes(g,0,-12,10,o.glow);IIK.gem(g,0,-1,3.4,o.gem)}
    else if(emb==='dragon'){g.fillStyle=Kit.lit(o.d,-.2);g.beginPath();g.moveTo(0,-14);g.quadraticCurveTo(9,-8,6,2);g.quadraticCurveTo(12,0,13,-6);g.quadraticCurveTo(14,8,0,12);g.quadraticCurveTo(-14,8,-13,-6);g.quadraticCurveTo(-12,0,-6,2);g.quadraticCurveTo(-9,-8,0,-14);g.fill();IIK.gem(g,0,-2,3,o.gem)}
    else if(emb==='sun'){IIK.glow(g,0,-1,16,o.glow,.6);for(let i=0;i<12;i++){const a=i/12*6.283;g.strokeStyle=o.d;g.lineWidth=1.4;g.beginPath();g.moveTo(Math.cos(a)*7,Math.sin(a)*7-1);g.lineTo(Math.cos(a)*13,Math.sin(a)*13-1);g.stroke()}IIK.gem(g,0,-1,5,o.gem)}
    else if(emb==='tower'){g.fillStyle='#d8dce4';g.beginPath();g.moveTo(-6,10);g.lineTo(-6,-6);g.lineTo(-8,-6);g.lineTo(-8,-11);g.lineTo(-4,-11);g.lineTo(-4,-8);g.lineTo(-1,-8);g.lineTo(-1,-11);g.lineTo(1,-11);g.lineTo(1,-8);g.lineTo(4,-8);g.lineTo(4,-11);g.lineTo(8,-11);g.lineTo(8,-6);g.lineTo(6,-6);g.lineTo(6,10);g.closePath();g.fill();g.fillStyle=face;g.fillRect(-2,3,4,7)}
    else if(emb==='gate'){IIK.flame(g,0,-6,6,'#ff6a1a','#ffd27a');g.fillStyle='#2a1a10';g.beginPath();g.arc(0,6,6,Math.PI,0);g.lineTo(6,12);g.lineTo(-6,12);g.closePath();g.fill()}
    else if(emb==='crown'){g.fillStyle='#e8c35a';g.beginPath();g.moveTo(-9,4);g.lineTo(-10,-7);g.lineTo(-5,-3);g.lineTo(0,-10);g.lineTo(5,-3);g.lineTo(10,-7);g.lineTo(9,4);g.closePath();g.fill();IIK.gem(g,0,-1,2.4,'#d02a3a')}
    else if(emb==='lion'){g.fillStyle='#e8c35a';g.beginPath();g.arc(0,-1,5.4,0,6.283);g.fill();g.fillStyle=face;g.beginPath();g.arc(-1.6,-2,.9,0,6.283);g.arc(1.6,-2,.9,0,6.283);g.fill()}
    else if(emb==='star'){g.fillStyle=o.d;g.beginPath();for(let i=0;i<10;i++){const a=-1.5708+i*.6283,r=i%2?4:10;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();IIK.gem(g,0,0,2.4,o.gem)}
    if(t>=4)IIK.spark(g,13,-14,3);g.restore()},
  quiver(g,o){const t=o.tier|0;g.save();g.translate(32,34);g.rotate(.45);IIK.glow(g,0,-8,18,o.glow,t>=3?.35:.12);
    const fc=[['#f4efe2','#c8382a'],['#f4efe2','#5a8a3a'],['#e8d0a0','#3a6ad0'],['#cfe6ff','#6ab0ff'],['#e8f4ff','#8fd8ff'],['#f4e8d0','#ff5a3a'],['#e8f0ff','#b9d0ff'],['#fff4c0','#b9a2ff']][t];
    for(let i=0;i<5;i++){const x=-5+i*2.5,y=-20-(i*7%4);g.strokeStyle='#7a5a30';g.lineWidth=1;g.beginPath();g.moveTo(x,-12);g.lineTo(x,y);g.stroke();g.fillStyle=fc[i%2];g.beginPath();g.moveTo(x,y-6);g.lineTo(x+2,y-3);g.lineTo(x+1.8,y+1);g.lineTo(x,y);g.lineTo(x-1.8,y+1);g.lineTo(x-2,y-3);g.closePath();g.fill()}
    const lc=o.dragon?'#4a6a8a':o.bone?'#6a3a24':o.star?'#2a2e50':o.origin?'#e8dcc0':t===3?'#3a3050':'#7a5434';
    const qv=c=>{c.moveTo(-8,-13);c.lineTo(8,-13);c.lineTo(6.6,20);c.quadraticCurveTo(0,23,-6.6,20);c.closePath()};
    Kit.solid(g,qv,-8,-13,8,23,lc,{tex:'leather',texA:.6,rim:'rgba(255,236,200,.7)',lineW:.9});
    const bc=t<=1?'#5a3a20':o.d;g.fillStyle=this.steel(g,-8,8,bc);g.fillRect(-8.4,-14,16.8,3);g.fillRect(-7.4,12,14.6,2.2);
    g.strokeStyle='rgba(240,220,180,.5)';g.setLineDash([1.6,1.4]);g.lineWidth=.6;g.beginPath();g.moveTo(-5,-10);g.lineTo(-4.4,18);g.moveTo(5,-10);g.lineTo(4.4,18);g.stroke();g.setLineDash([]);
    g.strokeStyle='#5a3a1c';g.lineWidth=2;g.beginPath();g.moveTo(8,-8);g.quadraticCurveTo(16,4,7,16);g.stroke();
    if(o.rune)this.runes(g,0,-8,10,o.glow);if(o.star)this.stars(g,[[-2,-2,2],[2,8,1.6]]);if(o.dragon){g.strokeStyle=o.d;g.lineWidth=.7;for(let y=-8;y<12;y+=3.4){g.beginPath();g.arc(0,y,3,0,Math.PI);g.stroke()}}
    if(o.trap){g.strokeStyle='#d8dce4';g.lineWidth=1.2;g.beginPath();g.arc(0,4,5,Math.PI,0);g.stroke();for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(i*2,4);g.lineTo(i*2,1.6);g.stroke()}}
    if(o.gem){IIK.glow(g,0,2,6,o.glow,.6);IIK.gem(g,0,2,2.6,o.gem)}
    g.restore()},
  // 전사 갑옷: 누빈 옷 → 사슬 → 비늘 → 판금 → 용 갑주
  plate(g,o){const t=o.tier|0;IIK.glow(g,32,32,24,o.glow,t>=3?.35:.12);g.save();g.translate(32,34);
    const body=c=>{c.moveTo(-14,-18);c.quadraticCurveTo(-8,-14,-5,-19);c.lineTo(5,-19);c.quadraticCurveTo(8,-14,14,-18);c.lineTo(20,-12);c.lineTo(16,-4);c.lineTo(13,-6);c.lineTo(13,18);c.quadraticCurveTo(0,22,-13,18);c.lineTo(-13,-6);c.lineTo(-16,-4);c.lineTo(-20,-12);c.closePath()};
    const mc=t===0?'#9a8a6a':t===1?'#8a8e98':o.m;
    Kit.solid(g,body,-20,-19,20,21,mc,{tex:t===0?'cloth':'metal',texA:.55,rim:'rgba(255,255,255,.8)',lineW:1});
    g.save();g.beginPath();body(g);g.clip();
    if(t===0){g.strokeStyle='rgba(60,40,20,.45)';g.lineWidth=.8;for(let y=-16;y<22;y+=4){g.beginPath();g.moveTo(-20,y);g.lineTo(20,y);g.stroke()}for(let x=-12;x<14;x+=6){g.beginPath();g.moveTo(x,-20);g.lineTo(x,22);g.stroke()}}
    else if(t===1){g.strokeStyle='rgba(30,30,40,.45)';g.lineWidth=.6;for(let y=-18;y<22;y+=2.4){g.beginPath();for(let x=-20+(y*1.3%2);x<20;x+=2.4){g.moveTo(x+1.2,y);g.arc(x,y,1.2,0,Math.PI)}g.stroke()}}
    else if(t===2||o.dragon||o.bone){g.strokeStyle=IIK.rgb(Kit.lit(mc,-.5),.6);g.fillStyle=IIK.rgb(Kit.lit(mc,.3),.35);g.lineWidth=.7;for(let y=-16;y<22;y+=3.6)for(let x=-18+((y/3.6)%2?1.8:0);x<20;x+=3.6){g.beginPath();g.arc(x,y,1.8,0,Math.PI);g.fill();g.stroke()}}
    else{g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.moveTo(-1,-18);g.lineTo(1,-18);g.lineTo(1.4,16);g.lineTo(-1.4,16);g.closePath();g.fill();g.strokeStyle='rgba(30,30,40,.4)';g.lineWidth=.9;for(const y of [4,9,14]){g.beginPath();g.moveTo(-13,y);g.quadraticCurveTo(0,y+2,13,y);g.stroke()}}
    if(o.tab){g.fillStyle=o.tab;g.fillRect(-5,-2,10,24);g.strokeStyle='#e8c35a';g.lineWidth=.8;g.strokeRect(-5,-2,10,24)}
    if(o.star)this.stars(g,[[-7,-6,2],[8,2,2.4],[-3,12,1.6]]);if(o.rune)this.runes(g,0,-12,10,o.glow);
    g.restore();
    const tc=t<=1?'#6a5040':o.d;g.strokeStyle=tc;g.lineWidth=1.6;g.beginPath();g.moveTo(-14,-18);g.quadraticCurveTo(-8,-14,-5,-19);g.lineTo(5,-19);g.quadraticCurveTo(8,-14,14,-18);g.stroke();
    if(t>=3){for(const sd of [-1,1]){const pd=c=>{c.moveTo(sd*12,-19);c.quadraticCurveTo(sd*24,-18,sd*22,-6);c.quadraticCurveTo(sd*17,-9,sd*12,-12);c.closePath()};g.fillStyle=this.steel(g,sd*12,sd*23,o.m);g.beginPath();pd(g);g.fill();Kit.outline(g,pd,'rgba(30,30,40,.8)',.7);g.strokeStyle=o.d;g.lineWidth=1;g.beginPath();g.moveTo(sd*22,-6);g.quadraticCurveTo(sd*17,-9,sd*12,-12);g.stroke()}}
    g.fillStyle='#4a3020';g.fillRect(-13,10,26,3.4);g.fillStyle=t<=1?'#a8a090':o.d;g.fillRect(-2.4,9.6,4.8,4.2);
    if(o.gem){IIK.glow(g,0,-8,7,o.glow,.6);IIK.gem(g,0,-8,3,o.gem)}
    if(t>=4)IIK.spark(g,-14,-20,3);g.restore()},
  leather(g,o){const t=o.tier|0;IIK.glow(g,32,32,24,o.glow,t>=3?.35:.12);g.save();g.translate(32,34);
    const lc=o.dragon?'#5a7a9a':o.bone?'#7a3a24':o.star?'#2a3050':o.origin?'#d8c8a0':t===3?'#4a3a5a':t===2?'#5a6a3a':t===1?'#6a4a2c':'#8a6440';
    if(o.cloak||t>=2){const ck=c=>{c.moveTo(-15,-16);c.quadraticCurveTo(-24,4,-20,22);c.lineTo(20,22);c.quadraticCurveTo(24,4,15,-16);c.closePath()};Kit.solid(g,ck,-24,-16,24,22,o.cloak||Kit.lit(lc,-.25),{tex:'cloth',texA:.5,lineW:.8})}
    const body=c=>{c.moveTo(-12,-18);c.quadraticCurveTo(-6,-13,-4,-19);c.lineTo(4,-19);c.quadraticCurveTo(6,-13,12,-18);c.lineTo(16,-8);c.lineTo(12,-6);c.lineTo(12,18);c.quadraticCurveTo(0,21,-12,18);c.lineTo(-12,-6);c.lineTo(-16,-8);c.closePath()};
    Kit.solid(g,body,-16,-19,16,21,lc,{tex:'leather',texA:.6,rim:'rgba(255,236,200,.7)',lineW:1});
    g.save();g.beginPath();body(g);g.clip();
    g.strokeStyle='rgba(240,220,180,.5)';g.setLineDash([1.6,1.4]);g.lineWidth=.6;g.beginPath();g.moveTo(-11,-4);g.quadraticCurveTo(0,-1,11,-4);g.moveTo(-8,-16);g.lineTo(-8,18);g.moveTo(8,-16);g.lineTo(8,18);g.stroke();g.setLineDash([]);
    if(t===1||t>=4){g.fillStyle=t===1?'#c8ccd4':o.d;for(let y=-12;y<16;y+=5)for(const x of [-10,-4,4,10]){g.beginPath();g.arc(x,y,.9,0,6.283);g.fill()}}
    if(o.dragon||o.bone){g.strokeStyle=IIK.rgb(Kit.lit(lc,.4),.55);g.lineWidth=.6;for(let y=-14;y<20;y+=3.4)for(let x=-12+((y/3.4)%2?1.7:0);x<14;x+=3.4){g.beginPath();g.arc(x,y,1.7,0,Math.PI);g.stroke()}}
    if(o.star)this.stars(g,[[-6,-8,2],[6,4,2.2]]);if(o.rune)this.runes(g,0,-12,8,o.glow);
    g.restore();
    g.strokeStyle='#5a3a1c';g.lineWidth=3;g.beginPath();g.moveTo(-10,-17);g.lineTo(11,16);g.stroke();g.strokeStyle=t<=1?'#8a6a40':o.d;g.lineWidth=.8;g.stroke();
    g.strokeStyle='#e8dcc0';g.lineWidth=.6;g.beginPath();for(let y=-14;y<2;y+=2.4){g.moveTo(-1.6,y);g.lineTo(1.6,y+1.4);g.moveTo(1.6,y);g.lineTo(-1.6,y+1.4)}g.stroke();
    g.fillStyle='#3a2414';g.fillRect(-12,9,24,3.2);g.fillStyle=t<=1?'#a8906a':o.d;g.fillRect(-2,8.6,4,4);
    Kit.solid(g,c=>c.rect(5,12,6,6),5,12,11,18,'#6a4a2a',{tex:'leather',lineW:.6});
    if(o.gem){IIK.glow(g,-6,-10,6,o.glow,.6);IIK.gem(g,-6,-10,2.4,o.gem)}
    if(t>=4)IIK.spark(g,14,-20,3);g.restore()}};
// cls2.js의 키 'b/<무기 종류>/<단계>'는 itemicons.js iconSpec이 IPAINT[종류]·IBASE[종류]로 그린다 (유니크 'u/'·세트 's/'도 종류 화가를 쓴다)
for(const w in IW_NAMES){IPAINT[w]=(g,o)=>IWP[w](g,o);IBASE[w]=IW[w]}
function allIconKeys18(){const ks=[];for(const w in IW)for(let i=0;i<8;i++)ks.push('b/'+w+'/'+i);
  for(const n in IUNQ)if(IUNQ[n].wt||/띠|사냥매/.test(n))ks.push('u/'+n);for(const sid of ['bulwark','lancer','ranger','trapper'])for(const sl in ISET[sid])ks.push('s/'+sid+'/'+sl);return ks}
// 견본표: 무기 종류 × 8단계 + v18 유니크·세트
function weaponIconSheet(){const rows=Object.keys(IW),extra=allIconKeys18().filter(k=>k[0]!=='b'),C=74,LW=90,k=2,cols=8,ch=26+C*rows.length+30+(C+12)*Math.ceil(extra.length/cols)+20,cw=LW+C*cols;
  const cv=document.createElement('canvas');cv.width=cw*k;cv.height=ch*k;const g=cv.getContext('2d');g.scale(k,k);g.fillStyle='#16130f';g.fillRect(0,0,cw,ch);g.font='11px sans-serif';
  const WN={sword:'한손검',polearm:'창·폴암',bow:'활',xbow:'석궁',shield:'방패',quiver:'화살통',plate:'판금 갑옷',leather:'가죽 갑옷'};
  g.fillStyle='#e8e2d2';g.textAlign='center';for(let i=0;i<8;i++)g.fillText(`${i+1}단계`,LW+C*i+C/2,16);
  rows.forEach((w,r)=>{g.textAlign='left';g.fillStyle='#ffd76a';g.fillText(WN[w],8,26+C*r+C/2);for(let i=0;i<8;i++){const x=LW+C*i,y=26+C*r;g.drawImage(iconCanvas('b/'+w+'/'+i,1),x+4,y+2,C-8,C-8);g.strokeStyle=RAR[Math.min(5,i>>1)].c;g.strokeRect(x+4,y+2,C-8,C-8)}});
  const y0=26+C*rows.length+24;g.textAlign='left';g.fillStyle='#ffd76a';g.fillText('v18 유니크 · 상급 유니크 · 세트',8,y0-6);
  extra.forEach((key,i)=>{const x=LW+C*(i%cols),y=y0+(C+12)*Math.floor(i/cols);g.drawImage(iconCanvas(key,1),x+4,y+2,C-8,C-8);g.strokeStyle=key[0]==='s'?RAR[3].c:RAR[4].c;g.strokeRect(x+4,y+2,C-8,C-8);
    g.fillStyle='rgba(232,226,210,.7)';g.textAlign='center';g.font='9px sans-serif';{let t=key.split('/').slice(1).join('/');while(t.length>2&&g.measureText(t).width>C-4)t=t.slice(0,-1);g.fillText(t,x+C/2,y+C+6)};g.font='11px sans-serif'});
  return cv.toDataURL('image/png')}
window.__iw={sheet:weaponIconSheet,keys:allIconKeys18};
