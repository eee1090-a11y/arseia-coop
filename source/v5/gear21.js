/* ---------- v21 GEAR: 반지 두 개 · 모자 칸 · 장비 툴팁 (사용자 02:57) ----------
   · 착용 칸: P.gear.hat(모자) · P.gear.ring2(두 번째 반지). 옛 저장에는 없으므로 불러올 때 null.
     반지 아이템은 slot:'ring' 그대로 — ring/ring2 어느 칸에나 낀다. 모자는 slot:'hat'.
   · 모자 굴림: 다른 방어구처럼 기본 옵션(생명력) + 무작위 옵션(그 직업의 옵션 풀). 유니크 모자 4개(직업마다 1개, 드묾).
   · 툴팁: itemTip(it,opts) 하나로 가방 칸 · 착용 칸 · 목록(가방 · 창고 · 상점) 모두. PC는 마우스를 올리면, 휴대폰은 누르면(길게 눌러도) 뜬다.
     목록에 새 장비 칸을 만들 때는 그 칸에 data-tip="${tipReg(it)}" 만 붙이면 된다.
   · 그림: 모자를 쓰면 머리 그림(구운 부위)이 모자 단계·희귀도 색을 따른다 (마법사 고깔 · 사제 서클릿/주교관 · 전사 투구 · 궁수 두건). */
const HAT_BASE={
  mage:['헝겊 고깔','펠트 뾰족 모자','수습 마법사 모자','룬 고깔','은실 마법 모자','별무늬 고깔','대마법사의 모자','근원의 고깔'],
  priest:['아마 두건','순례자 머리띠','은 머리띠','축복의 서클릿','성유물 서클릿','빛의 관','주교관','근원의 성관'],
  warrior:['가죽 모자','철 모자','반투구','기사 투구','은룡의 투구','용뼈 투구','별철 대투구','근원의 투구'],
  archer:['천 두건','깃 모자','사냥꾼 두건','룬 두건','은룡의 두건','용가죽 두건','별빛 잎관','근원의 두건']};
const hatCls=c=>HAT_BASE[c]?c:'mage';
Object.defineProperty(SLOT,'hat',{value:{n:'모자',main:'hp',get base(){return HAT_BASE[hatCls(P&&P.cls)]}},enumerable:false,configurable:true,writable:true});
Object.defineProperty(SLOT,'ring2',{value:{n:'반지 2',base:SLOT.ring.base,main:'mp'},enumerable:false,configurable:true,writable:true});
const GEAR21N={ring:'반지 1',ring2:'반지 2',hat:'모자'};
const gearSlotN=sl=>GEAR21N[sl]||(SLOT[sl]?SLOT[sl].n:sl);
function gearSlots21(){return PHYS_CLS[P.cls]?['staff','off','robe','hat','ring','ring2','amulet']:['staff','robe','hat','ring','ring2','amulet']}
// 유니크 모자: 직업마다 하나 (+모든 마법·계열 옵션 없음)
const HAT_UNIQ=[
  {n:'별지기의 고깔',slot:'hat',cls:'mage',st:{hp:.8,int:.6,cdr:8,crit:5,mcost:8},lore:'별을 세던 늙은 마법사가 밤마다 쓰던 고깔. 끝에 별가루가 묻어 있다.'},
  {n:'순례자의 빛 서클릿',slot:'hat',cls:'priest',st:{hp:.9,int:.5,regen:.8,dr:6,ls:2},lore:'먼 길을 걸은 순례자의 이마에서 빛이 꺼지지 않았다.'},
  {n:'사자 갈기 투구',slot:'hat',cls:'warrior',st:{hp:1,str:20,dr:8,ias:6},lore:'투구 꼭대기의 갈기가 바람에 흔들릴 때마다 적이 물러선다.'},
  {n:'매사냥꾼의 깃 두건',slot:'hat',cls:'archer',st:{hp:.8,dex:20,crit:6,ms:6},lore:'매가 내려앉던 어깨, 그 깃을 엮어 만든 두건.'}];
UNIQ.push(...HAT_UNIQ);
const HAT_P={phys:1/6,cast:1/5},HAT_UQ={base:.004,elite:.012};
function makeHat(il,elite,cls){cls=cls||P.cls;il=clamp(Math.round(il),1,Math.max(99,MAXLV));const phys=!!PHYS_CLS[cls],r=R();
  if(r<HAT_UQ.base+(elite?HAT_UQ.elite:0)){const u=HAT_UNIQ.find(x=>x.cls===cls);if(u)return{id:uid++,slot:'hat',rar:4,name:u.n,il,stats:(phys?fixedStatsV18:fixedStats)(u.st,il),cls,lore:u.lore}}
  const rar=r<.12+(elite?.18:0)?2:r<.42+(elite?.3:0)?1:0,stats={hp:Math.round(rollStat('hp',il)*.8)};
  const pool=(phys?affixPoolV18:affixPool)(il,cls).filter(k=>k!=='hp');let n=rar===2?ri(2,3):RAR[rar].a;
  if(rar>=1&&il>=8&&R()<(rar===2?TREE_AFX.rare:TREE_AFX.magic)){const k='tr_'+ri(0,CLASSES[cls].trees.length-1);stats[k]=rollStat(k,il);n--}
  for(let i=0;i<n;i++){const k=pick(pool);stats[k]=Math.round(((stats[k]||0)+rollStat(k,il))*10)/10;if(k==='cdr')stats[k]=Math.min(25,stats[k]);if(k==='mcost')stats[k]=Math.min(30,stats[k]);if(k==='ias')stats[k]=Math.min(20,stats[k])}
  let name=HAT_BASE[hatCls(cls)][clamp(Math.floor(il/8),0,7)];if(rar===1||rar===2)name=pick(PREF)+' '+name;
  return{id:uid++,slot:'hat',rar,name,il,stats,cls}}
// 떨어지는 장비의 한 몫이 모자 (강제 종류 'uniq'·'set'·'boss'는 원래대로)
{const _mi=makeItem;makeItem=function(il,elite,cls,force){const c=cls||P.cls;if(!force&&R()<(PHYS_CLS[c]?HAT_P.phys:HAT_P.cast))return makeHat(il,elite,c);return _mi.apply(this,arguments)}}
SHOP_SLOTS.armor.push('hat');// 방어구상이 모자도 판다

/* ===== 착용: 어느 칸에 끼우나 · 지금 무엇과 바뀌나 ===== */
// 반지: 빈 칸 먼저, 둘 다 차 있으면 약한 쪽 (want로 칸을 정할 수 있음)
function gearDest(it,want){if(!it)return null;if(it.slot!=='ring')return it.slot;if(want==='ring'||want==='ring2')return want;const g=P.gear||{};
  if(!g.ring)return'ring';if(!g.ring2)return'ring2';return itemScore(g.ring)<=itemScore(g.ring2)?'ring':'ring2'}
function gearCur(it){const s=gearDest(it);return s&&P.gear?P.gear[s]||null:null}
function gearEquip(it,want){const ix=P.bag.indexOf(it);if(ix<0||!canWear(it))return false;const sl=gearDest(it,want),old=P.gear[sl];P.gear[sl]=it;P.bag.splice(ix,1);if(old)P.bag.push(old);P.hp=Math.min(P.hp,maxHp());P.mp=Math.min(P.mp,maxMp());return sl}
// 같은 세트 조각을 두 칸(반지 둘)에 껴도 한 조각으로 센다
setCount=function(sid){const s=new Set();const g=P.gear||{};for(const k in g){const it=g[k];if(it&&it.set===sid)s.add(it.slot)}return s.size};
{const _fp=freshPlayer;freshPlayer=function(cls){const p=_fp.apply(this,arguments);if(p&&p.gear){if(!('hat' in p.gear))p.gear.hat=null;if(!('ring2' in p.gear))p.gear.ring2=null}return p}}
// 불러오기: 새 칸 기본값 · 잘못 들어간 장비는 가방으로(잃지 않음) · 모르는 칸(나중 판)은 그대로 다시 저장
function gearFix21(d){const g=P.gear;if(!g)return;if(!('hat' in g))g.hat=null;if(!('ring2' in g))g.ring2=null;
  const back=[];if(g.hat&&g.hat.slot!=='hat'){back.push(g.hat);g.hat=null}if(g.ring2&&g.ring2.slot!=='ring'){back.push(g.ring2);g.ring2=null}
  for(const k of ['staff','robe','ring','amulet','off'])if(g[k]&&g[k].slot==='hat'){back.push(g[k]);g[k]=null}
  for(const it of back)P.bag.push(it);
  P._gearX=null;const dg=d&&d.gear;if(dg&&typeof dg==='object'&&!Array.isArray(dg))for(const k in dg)if(!(k in g)&&dg[k]&&typeof dg[k]==='object')(P._gearX=P._gearX||{})[k]=dg[k]}
{const _ld=load;load=function(d){const r=_ld.apply(this,arguments);if(r&&P)gearFix21(d);return r}}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);if(d&&P&&P._gearX&&d.gear)d.gear=Object.assign({},P._gearX,d.gear);return d}}
// 같이 하기: 모자 겉모습도 보낸다 (net.js LK_SLOTS 끝에 덧붙임 → 예전 판은 무시)
if(!LK_SLOTS.includes('hat'))LK_SLOTS.push('hat');

/* ===== 그림: 모자를 쓰면 머리가 모자를 따른다 (부위 굽기 키에 모자 단계·색) ===== */
const HAT_METAL={mage:'#c9a46a',priest:'#d4aa4c',warrior:'#d8dde6',archer:'#c9a24a'};
function hatDye(cls,ht,base){if(!ht)return base;const h=lookHash(ht);if(ht.rar>=4)return LOOK_UNIQ[h%LOOK_UNIQ.length][1];const D=LOOK_DYE[cls];if(ht.rar>=1&&D)return D[h%D.length][1];
  return{mage:'#4a3a2a',priest:'#b8c4d8',warrior:'#4a3626',archer:'#5a4a30'}[cls]||base}
function hatLook(L,h){const ht=h&&h.gear&&h.gear.hat;if(!L||!ht||!ht.il&&ht.il!==0)return L;const cls=L.cls||h.cls,t=lookTier(ht),c=(ht.rar|0)>=1?RAR[clamp(ht.rar|0,0,RAR.length-1)].c:HAT_METAL[cls]||'#d4aa4c',p=Object.assign({},L.pal);
  if(cls==='mage'){L.hrt=t;p.hat=hatDye(cls,ht,p.hat)}
  else if(cls==='priest'){L.hrt=t>=4?Math.max(6,t):4;p.hat=hatDye(cls,ht,p.hat)}// 서클릿 → (Lv32~) 주교관
  else if(cls==='warrior'){L.hrt=t<1?2:clamp(t+2,3,7);/* 쇠꼭지 가죽 모자 → (Lv8~) 투구 */p.plate=waMetal(L.hrt);p.plateD=Kit.lit(p.plate,-.38);p.tabard=ht.rar>=1?hatDye(cls,ht,p.tabard):p.tabard;p.leather=hatDye(cls,ht,p.leather||'#5a3e26')}
  else{L.hrt=clamp(t+1,1,7);p.hood=hatDye(cls,ht,p.hood)}
  L.htc=c;L.hpal=p;L.key+=`|h${L.hrt}${c}${p.hat||''}${p.hood||''}${p.plate||''}`;return L}
{const _hl=heroLook;heroLook=function(h){return hatLook(_hl.apply(this,arguments),h)}}
{const _hl=heroLook18;heroLook18=function(h){return hatLook(_hl.apply(this,arguments),h)}}

/* ===== 아이콘: 모자 (직업 × 8단계 · 유니크 4) ===== */
const HAT_COL={mage:['#6a5a44','#4a3a5a','#2b3080','#1e3a5a','#3a3a4a','#1c2250','#4a1e3a','#e8dcc0'],priest:['#c8bc9c','#8a7a5a','#c8ccd8','#e0b040','#d8d0c0','#fff0c0','#f0e8d8','#ffe39a'],
  warrior:['#7a5a3a','#8a8e96','#9aa2ae','#a2aab6','#c8d0dc','#d8ceb4','#6a7aa8','#e8c050'],archer:['#5a6a3a','#6a5634','#36502a','#3a4a5a','#b8c0d0','#7a4a2a','#4a6a8a','#e0c060']};
const HAT_GEM=['#c9a46a','#9ab0c0','#8fd8ff','#6ab0ff','#e8f0ff','#ff5a3a','#b9d0ff','#b9a2ff'];
function hatSpec(cls,i){cls=hatCls(cls);i=clamp(i|0,0,7);return{cls,t:i,c:HAT_COL[cls][i],gem:HAT_GEM[i],glow:HAT_GEM[i],trim:i>=6?'#ffd76a':i>=3?'#d6b262':'#8a7a5a'}}
Object.assign(IUNQ,{'별지기의 고깔':{cls:'mage',t:7,c:'#14183a',gem:'#fff3b0',glow:'#c8d8ff',trim:'#ffe39a',u:1},'순례자의 빛 서클릿':{cls:'priest',t:5,c:'#f4e0a0',gem:'#fff8d0',glow:'#ffe39a',trim:'#ffd76a',u:1},
  '사자 갈기 투구':{cls:'warrior',t:6,c:'#c8a050',gem:'#ff8a3a',glow:'#ffb04a',trim:'#e8c050',mane:'#c87a2a',u:1},'매사냥꾼의 깃 두건':{cls:'archer',t:4,c:'#5a3e26',gem:'#9fe39a',glow:'#9fe39a',trim:'#c9a24a',feather:'#f0ece0',u:1}});
IPAINT.hat=(g,o)=>{const c=o.c||'#6a5a44',T=o.trim||'#d6b262',t=o.t|0,cls=o.cls||'mage';
  if(o.glow)IIK.glow(g,32,30,24,o.glow,.35+t*.04);
  if(cls==='mage'){// 챙 넓은 뾰족 고깔
    Kit.solid(g,q=>q.ellipse(32,47,25,7.5,0,0,6.283),7,40,57,55,Kit.lit(c,-.1),{tex:'cloth',texA:.4,lineW:.9});
    const tx=40+t*.6,ty=8-t*.4,cone=q=>{q.moveTo(19,46);q.bezierCurveTo(21,30,tx-6,ty+16,tx,ty);q.quadraticCurveTo(tx+3,ty+1,tx+2,ty+4);q.bezierCurveTo(tx-2,ty+18,42,32,45,46);q.quadraticCurveTo(32,49,19,46);q.closePath()};
    Kit.solid(g,cone,19,ty,45,48,c,{tex:'cloth',texA:.45,rim:'rgba(255,240,214,.8)',lineW:.9});
    g.save();g.beginPath();cone(g);g.clip();g.fillStyle=T;g.fillRect(16,39,32,4.4);g.restore();
    if(t>=2)IIK.gem(g,32,41,2.4+t*.2,o.gem);if(t>=5){g.fillStyle=Kit.lit(T,.4);for(const [x,y] of [[30,30],[36,22],[27,36]]){g.beginPath();for(let k=0;k<8;k++){const a=k*.785,r=k%2?.6:1.8;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}g.fill()}}
    if(o.u)IIK.spark(g,tx+1,ty+1,4,'#fff6c0');return}
  if(cls==='priest'){
    if(t>=6||o.u&&t>=6){// 주교관
      const mit=q=>{q.moveTo(19,50);q.quadraticCurveTo(17,28,30,10);q.lineTo(32,13);q.lineTo(34,10);q.quadraticCurveTo(47,28,45,50);q.quadraticCurveTo(32,53,19,50);q.closePath()};
      Kit.solid(g,mit,17,10,47,52,c,{tex:'cloth',texA:.35,rim:'rgba(255,248,220,.9)',lineW:.9});g.save();g.beginPath();mit(g);g.clip();g.fillStyle=T;g.fillRect(30.6,8,2.8,44);g.fillRect(16,44,32,4);g.fillRect(25,26,14,2.4);g.restore();IIK.gem(g,32,46,2.6,o.gem);return}
    // 서클릿: 비스듬히 본 금속 고리 + 앞 보석 (단계가 오를수록 뾰족 장식)
    const back=q=>q.ellipse(32,36,20,8,0,Math.PI,0);g.lineCap='round';g.strokeStyle=Kit.lit(T,-.35);g.lineWidth=4.6;g.beginPath();back(g);g.stroke();
    if(t>=3){g.fillStyle=Kit.lit(T,-.1);for(let k=-2;k<=2;k++){const x=32+k*7.5,y=40+Math.abs(k)*-.6,hgt=6+(2-Math.abs(k))*3+t*.6;g.beginPath();g.moveTo(x-2.4,y);g.lineTo(x,y-hgt);g.lineTo(x+2.4,y);g.closePath();g.fill();g.strokeStyle='rgba(60,40,10,.6)';g.lineWidth=.6;g.stroke()}}
    g.strokeStyle=T;g.lineWidth=5;g.beginPath();g.ellipse(32,36,20,8,0,0,Math.PI);g.stroke();g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=1;g.beginPath();g.ellipse(32,35,20,8,0,.3,Math.PI-.3);g.stroke();
    if(t<3){Kit.solid(g,q=>{q.moveTo(14,30);q.quadraticCurveTo(32,12,50,30);q.quadraticCurveTo(32,24,14,30);q.closePath()},14,14,50,30,c,{tex:'cloth',texA:.4,lineW:.7})}
    IIK.gem(g,32,44,3+t*.25,o.gem,t>=4?'diamond':'round');if(o.u)IIK.spark(g,32,44,7,'#fff8d0');return}
  if(cls==='warrior'){// 투구: 둥근 정수리 · 이마 띠 · 코가리개 · (4~) 볏 · (6~) 날개
    if(t<2){Kit.solid(g,q=>{q.ellipse(32,38,19,15,0,Math.PI,0);q.lineTo(51,42);q.lineTo(13,42);q.closePath()},13,23,51,42,c,{tex:'leather',texA:.5,lineW:.9});g.fillStyle=Kit.lit(c,-.35);g.fillRect(13,38,38,4);if(t>=1){g.fillStyle='#c8ccd8';g.fillRect(31,22,2.4,16)}return}
    const dome=q=>{q.moveTo(13,44);q.bezierCurveTo(12,14,52,14,51,44);q.lineTo(51,47);q.quadraticCurveTo(32,41,13,47);q.closePath()};
    Kit.solid(g,dome,12,16,52,47,c,{tex:'metal',texA:.45,rim:'rgba(255,255,255,.95)',lineW:1});
    g.fillStyle=T;g.beginPath();g.moveTo(13,42);g.quadraticCurveTo(32,36,51,42);g.lineTo(51,45.5);g.quadraticCurveTo(32,39.5,13,45.5);g.closePath();g.fill();
    Kit.solid(g,q=>q.rect(30.4,40,3.2,14),30,40,34,54,Kit.lit(c,.15),{lineW:.6});
    for(const sd of [-1,1])Kit.solid(g,q=>{const x=32+sd*14;q.moveTo(x-3,44);q.lineTo(x+3,44);q.lineTo(x+2*sd,56);q.lineTo(x-2*sd,54);q.closePath()},14,44,50,56,c,{lineW:.6});
    if(t>=4||o.mane){const pc=o.mane||(t>=5?Kit.lit(T,-.1):'#8a2a24');Kit.solid(g,q=>{q.moveTo(24,20);q.bezierCurveTo(26,6,44,4,50,14);q.quadraticCurveTo(40,12,34,22);q.closePath()},24,4,50,22,pc,{tex:'cloth',texA:.4,lineW:.7})}
    if(t>=6){for(const sd of [-1,1])Kit.solid(g,q=>{const x=32+sd*18;q.moveTo(x,34);q.quadraticCurveTo(x+sd*9,22,x+sd*7,12);q.quadraticCurveTo(x+sd*3,22,x-sd*2,30);q.closePath()},6,12,58,34,t>=7?T:'#eef0f6',{tex:'metal',texA:.3,lineW:.6})}
    if(t>=3)IIK.gem(g,32,41,2.2+t*.15,o.gem);return}
  // 궁수: 두건 (1~3 깃털 모자처럼 깃 하나 · 6~ 잎관)
  const hood=q=>{q.moveTo(15,54);q.bezierCurveTo(10,30,20,12,34,8);q.quadraticCurveTo(44,6,46,14);q.bezierCurveTo(54,26,54,44,49,54);q.quadraticCurveTo(32,58,15,54);q.closePath()};
  Kit.solid(g,hood,10,6,54,57,c,{tex:'cloth',texA:.5,rim:'rgba(255,240,214,.8)',lineW:.9});
  g.fillStyle=Kit.lit(c,-.6);g.beginPath();g.ellipse(32,40,10,12,0,0,6.283);g.fill();g.strokeStyle=T;g.lineWidth=1.4;g.beginPath();g.ellipse(32,40,11.4,13.2,0,3.5,5.9);g.stroke();
  if(t<=3||o.feather){g.save();g.translate(44,22);g.rotate(.6);Kit.solid(g,q=>q.ellipse(0,-9,2.6,10,0,0,6.283),-3,-19,3,1,o.feather||(t>=2?T:'#f0ece0'),{lineW:.5});g.restore()}
  if(t>=6){g.fillStyle=t>=7?'#ffe39a':Kit.lit(T,.15);for(let k=-2;k<=2;k++){g.save();g.translate(32+k*6,16+Math.abs(k)*2);g.rotate(k*.35);g.beginPath();g.ellipse(0,-3,2.2,5,0,0,6.283);g.fill();g.restore()}}
  if(t>=4)IIK.gem(g,32,29,2+t*.2,o.gem)};
{const _k=itemIconKey;itemIconKey=function(it){if(it&&it.slot==='hat'&&!(it.rar>=4&&IUNQ[it.name]&&IUNQ[it.name].cls))return 'h/'+hatCls(it.cls)+'/'+clamp(Math.floor((it.il||1)/8),0,7);return _k(it)}}
{const _sp=iconSpec;iconSpec=function(key){const [t,a,b]=key.split('/');
  if(t==='h')return{paint:'hat',o:hatSpec(a,+b)};if(t==='b'&&a==='hat')return{paint:'hat',o:hatSpec(P&&P.cls,+b)};if(t==='b'&&a==='ring2')return _sp('b/ring/'+b);
  if(t==='u'&&IUNQ[a]&&IUNQ[a].cls&&HAT_UNIQ.some(u=>u.n===a))return{paint:'hat',o:IUNQ[a]};return _sp(key)}}
{const _ak=allIconKeys;allIconKeys=function(){const ks=_ak();for(const c in HAT_BASE)for(let i=0;i<8;i++)ks.push('h/'+c+'/'+i);return ks}}

/* ===== 장비 툴팁 ===== */
const TIP={m:new Map(),n:0,el:null,cur:null,pt:'mouse',lp:0};
const ITEMTIP_LINES=[];// 다른 파일이 툴팁에 줄을 더할 때: ITEMTIP_LINES.push((it,o)=>'<div>…</div>')
function tipReg(it,o){if(!it)return'';if(TIP.m.size>4000)TIP.m.clear();const k='t'+(++TIP.n);TIP.m.set(k,{it,o:o||null});return k}
const tipName=it=>typeof itemName==='function'?itemName(it):it.name;
function tipKind(it){return it.wt&&WT[it.wt]?WT[it.wt].n:SLOT[it.slot]?SLOT[it.slot].n:''}
function tipCmp(it,cur,sl){if(!canWear(it))return'';if(!cur)return `<div class="tt-c">${gearSlotN(sl)} 칸이 비어 있습니다 · 끼면 그대로 더해집니다</div>`;
  const sc=Math.round(itemScore(it)-itemScore(cur)),ks=[...new Set(Object.keys(it.stats).concat(Object.keys(cur.stats)))],out=[];
  for(const k of ks){const d=Math.round(((+it.stats[k]||0)-(+cur.stats[k]||0))*10)/10;if(d)out.push(`<div style="color:${d>0?'#8cf08a':'#ff8a7a'}">${d>0?'+':''}${d} ${statName(k)}</div>`)}
  return `<div class="tt-c"><div>착용 중인 ${gearSlotN(sl)}: <b style="color:${RAR[cur.rar].c}">${tipName(cur)}</b></div><div style="color:${sc>0?'#8cf08a':sc<0?'#ff8a7a':'#a39d8f'}">${sc>0?'▲ 지금보다 좋음':sc<0?'▼ 지금보다 약함':'비슷함'}${sc?` (${sc>0?'+':''}${sc})`:''}</div>${out.length?out.join(''):'<div class="muted">옵션 차이 없음</div>'}</div>`}
function itemTip(it,o){o=o||{};if(!it||!it.stats)return'';const rr=RAR[clamp(it.rar|0,0,RAR.length-1)];
  let h=`<div class="tt-n" style="color:${rr.c}">${tipName(it)}</div><div class="tt-k">${rr.n} ${tipKind(it)} · Lv${it.il}${o.eq?` · 착용 중 (${gearSlotN(o.eq)})`:''}</div>`;
  h+=`<div class="tt-s">${String(statLine(it)).split(' · ').join('<br>')}</div>`;
  for(const f of ITEMTIP_LINES){try{const x=f(it,o);if(x)h+=x}catch(_){}}
  if(!canWear(it))h+=`<div class="tt-c" style="color:#ff8a7a">${CLASSES[P.cls].n}은(는) 착용할 수 없습니다</div>`;
  else if(!o.eq&&o.cmp!==false){const sl=gearDest(it);h+=tipCmp(it,P.gear[sl]||null,sl)}
  return h}
// 화면 안에 두기: 대상 칸 오른쪽 → 왼쪽 → 위/아래 가운데 순서로, 늘 화면 안(8px 여백)
function tipPlace(r,w,h,vw,vh){const m=8;let x=r.right+m,y=r.top;
  if(x+w>vw-m){x=r.left-m-w;if(x<m){x=clamp((r.left+r.right)/2-w/2,m,Math.max(m,vw-m-w));y=r.bottom+m;if(y+h>vh-m)y=r.top-m-h}}
  return{x:Math.round(clamp(x,m,Math.max(m,vw-m-w))),y:Math.round(clamp(y,m,Math.max(m,vh-m-h)))}}
function tipEl(){let el=TIP.el;if(el&&el.isConnected)return el;el=TIP.el=document.createElement('div');el.id='itip';el.hidden=true;el.setAttribute('role','tooltip');document.body.appendChild(el);return el}
function tipShowFor(t){const k=t&&t.dataset&&t.dataset.tip,rec=k&&TIP.m.get(k);if(!rec){tipHide();return false}const el=tipEl();el.innerHTML=itemTip(rec.it,rec.o);el.hidden=false;
  const r=t.getBoundingClientRect(),p=tipPlace(r,el.offsetWidth,el.offsetHeight,window.innerWidth,window.innerHeight);el.style.left=p.x+'px';el.style.top=p.y+'px';TIP.cur=t;return true}
function tipHide(){if(TIP.el)TIP.el.hidden=true;TIP.cur=null}
document.addEventListener('pointerover',e=>{TIP.pt=e.pointerType||'mouse';if(e.pointerType!=='mouse')return;const t=e.target.closest&&e.target.closest('[data-tip]');if(t===TIP.cur)return;if(!t){if(TIP.cur)tipHide();return}tipShowFor(t)});
document.addEventListener('pointerout',e=>{if(e.pointerType!=='mouse')return;const t=e.target.closest&&e.target.closest('[data-tip]');if(!t||t!==TIP.cur)return;const to=e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest('[data-tip]');if(to!==t)tipHide()});
// 휴대폰: 누르면 뜨고(가방 칸은 한 번 더 누르면 원래대로 목록으로), 길게 눌러도 뜬다. 다른 곳을 누르면 닫힌다
document.addEventListener('pointerdown',e=>{TIP.pt=e.pointerType||'mouse';clearTimeout(TIP.lp);if(e.pointerType==='mouse')return;const t=e.target.closest&&e.target.closest('[data-tip]');
  if(!t){if(TIP.cur&&!(e.target.closest&&e.target.closest('#itip')))tipHide();return}TIP.lp=setTimeout(()=>{tipShowFor(t);TIP.lpd=t},420)},true);
document.addEventListener('pointerup',()=>clearTimeout(TIP.lp),true);document.addEventListener('pointercancel',()=>clearTimeout(TIP.lp),true);
document.addEventListener('click',e=>{if(TIP.pt==='mouse')return;const t=e.target.closest&&e.target.closest('[data-tip]');if(!t)return;
  if(TIP.lpd===t){TIP.lpd=null;e.stopPropagation();e.preventDefault();return}TIP.lpd=null;
  if(TIP.cur===t){tipHide();return}// 두 번째 누름: 원래 동작(가방 칸 → 목록으로)
  tipShowFor(t);if(t.dataset.bagcell!=null){e.stopPropagation();e.preventDefault()}},true);
document.addEventListener('scroll',()=>{if(TIP.cur)tipHide()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&TIP.cur)tipHide()},true);
// 목록 · 가방 칸 · 착용 칸에 툴팁 열쇠 달기
{const _ir=itemRow;itemRow=function(it,btns){
  if(it&&it.slot==='ring'&&P.gear&&P.gear.ring&&P.gear.ring2&&typeof btns==='string')btns=btns.replace(/<button type="button" data-equip="(\d+)">착용<\/button>/,(m,id)=>`<button type="button" data-equip="${id}" data-eqsl="ring" title="반지 1(${P.gear.ring.name}) 자리에">반지 1에</button><button type="button" data-equip="${id}" data-eqsl="ring2" title="반지 2(${P.gear.ring2.name}) 자리에">반지 2에</button>`);
  const h=_ir.call(this,it,btns);return it?h.replace('<span class="iic',`<span data-tip="${tipReg(it)}" class="iic`):h}}
bagGridHtml=function(){let h=`<div class="baggrid" role="list" aria-label="가방 ${P.bag.length}/${BAG_MAX}">`;
  for(let i=0;i<BAG_MAX;i++){const it=P.bag[i];h+=it?`<button type="button" class="bagc" role="listitem" data-bagcell="${it.id}" data-tip="${tipReg(it)}" aria-label="${typeof itemName==='function'?itemName(it):it.name} · ${RAR[it.rar].n} ${SLOT[it.slot]?SLOT[it.slot].n:''} Lv${it.il}">${itemIcon(it,{sz:40})}</button>`:'<span class="bagc none" role="listitem"></span>'}
  return h+'</div>'};
function gearGridHtml(){let h=`<h2>착용 중 <span class="muted" style="font-size:12px;font-weight:400">· ${window.matchMedia&&matchMedia('(hover: none)').matches?'아이콘을 누르면':'아이콘에 마우스를 올리면'} 옵션이 보입니다</span></h2><div class="geq">`;
  for(const sl of gearSlots21()){const it=P.gear[sl];
    h+=`<div class="item hasic geqc" data-geq="${sl}"${it?` data-tip="${tipReg(it,{eq:sl})}"`:''}>${itemIcon(it,{slot:sl==='ring2'?'ring':sl,sz:40})}<div><div class="gsl muted">${gearSlotN(sl)}</div><div class="nm" style="color:${it?RAR[it.rar].c:'#a39d8f'}">${it?tipName(it):'없음'}</div></div></div>`}
  return h+'</div>'}
{const _c=charHtml;charHtml=function(){const h=_c.apply(this,arguments);const a=h.indexOf('<h2>착용 중</h2>');if(a<0)return h;const b=h.indexOf('<h2>',a+8);return h.slice(0,a)+gearGridHtml()+(b<0?'':h.slice(b))}}
{const _rp=renderPanel;renderPanel=function(){tipHide();TIP.m.clear();return _rp.apply(this,arguments)}}
{const _cp=closePanel;closePanel=function(){tipHide();return _cp.apply(this,arguments)}}
(()=>{const st=document.createElement('style');st.textContent=`
#itip{position:fixed;z-index:9999;left:0;top:0;width:max-content;max-width:min(300px,calc(100vw - 16px));box-sizing:border-box;background:rgba(18,14,10,.97);border:1px solid #7a6236;border-radius:6px;padding:8px 10px;font-size:12.5px;line-height:1.45;color:#e8e2d2;box-shadow:0 4px 18px rgba(0,0,0,.65);pointer-events:none}
#itip[hidden]{display:none}#itip .tt-n{font-weight:700;font-size:14px;line-height:1.3}#itip .tt-k{color:#a39d8f;font-size:11.5px;margin-bottom:4px}#itip .tt-s{color:#d8d0bc}
#itip .tt-c{border-top:1px solid #3e3424;margin-top:6px;padding-top:5px;font-size:12px}
.geq{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:6px;margin:0 0 8px}
.geq .geqc{margin:0;padding:5px 7px;justify-content:flex-start;gap:8px;cursor:default;min-width:0}
.geq .geqc[data-tip]:hover{border-color:rgba(214,178,98,.6);background:#1e1912}
.geq .gsl{font-size:11px;line-height:1.2}.geq .nm{font-size:12.5px;line-height:1.25;overflow-wrap:anywhere}
@media(max-width:520px){.geq{grid-template-columns:1fr 1fr}.geq .geqc{padding:4px 5px;gap:6px}}`;document.head.appendChild(st)})();
setTimeout(()=>{try{window.__gear21={HAT_BASE,HAT_UNIQ,makeHat,gearDest,gearCur,gearEquip,itemTip,tipPlace,tipShowFor,tipHide,TIP,gearSlots21,iconCanvas,
  drawHero:(g,cls,gear,x,y,k,d)=>PHYS_CLS[cls]?drawHeroClass(g,cls,gear,'idle',x,y,k,.37,d):drawFigure(g,{cls,gear,face:heroFace(d),moving:false,walk:0},x,y,k,{t:.37})}}catch(_){}},0);
