/* ---------- [v46] 주인공 부위 그림 (Codex가 그린 그림, 2026-10-24) ----------
   - 그림: game.html 옆 img/flare-hero-mage.js · flare-hero-priest.js · flare-hero-archer.js (Flare 묶음과 같은 모양, 2배 크기).
   - 몸은 예전처럼 부위(신발 · 치마 · 몸통 · 머리 · 망토 · 어깨 · 팔 · 지팡이 · 활 · 석궁 · 화살통)를 따로 그려 움직인다. 바뀌는 것은 부위 한 장의 그림뿐:
     같은 크기 · 같은 기준점이라 걷기 · 휘두르기 · 시전 · 좌우 반전은 그대로.
   - 그림은 장비 단계(0~7)마다 한 장. 옷 색은 단계 그림 색 그대로(장비마다 다르게 물들던 색은 쓰지 않는다). 등급 빛 · 반지 · 목걸이 · 보석 빛은 예전처럼 코드로 위에 그린다.
   - 그림이 없는 부위(전사 전체, 방패 등; 궁수 화살통 1~7단계는 v48에 들어옴)와 「그림: 예전 그림」 설정, 묶음을 아직 못 받았을 때는 예전 코드 그림 그대로.
   - 그림만 바뀐다: 크기 · 충돌 · 적중 · 수치 · 저장은 그대로. */
const H46={cls:{mage:1,priest:1,archer:1},n:0};
function h46Pack(cls){if(!H46.cls[cls])return null;const nm='hero-'+cls,P=flPack(nm);if(!P)flNeed(nm);return P}
// 부위 그림 한 장을 예전 부위와 같은 크기 · 기준점으로 SC에 굽는다. 없으면 null (→ 예전 그림)
function h46Img(cls,part,t,v,di,sc,over,ok){const P=h46Pack(cls);if(!P)return null;const R=P.meta.r[part+'/'+t+(v!=null?'/'+v:'')];if(!R)return null;
  const x=R[0],y=R[1],n=R[2],cw=R[3],ch=R[4],ax=R[5],ay=R[6],k=P.meta.sc||2,f=n>1?Math.max(0,Math.min(n-1,di|0)):0;
  H46.n++;return SC.get(`hcg/${cls}/${part}/${t}/${v==null?'':v}/${f}/${ok||''}/${sc.toFixed(2)}`,cw,ch,ax,ay,g=>{g.drawImage(P.img,x+f*cw*k,y,cw*k,ch*k,0,0,cw,ch);if(over)over(g,ax,ay)},{force:1,scale:sc})}
// 목걸이 (몸통 그림 위에, 예전 몸통 그림과 같은 자리 · 모양)
function h46Amu(A,di){return(g,ax,ay)=>{const th=HERO_DIRS[di]*Math.PI/180,s=Math.sin(th),c=Math.cos(th);if(c<=-.3)return;
  g.save();g.translate(ax,ay);g.scale(.78+.22*Math.abs(c),1);const x=s*4,y=-8.6;
  g.strokeStyle='rgba(230,200,120,.85)';g.lineWidth=.6;g.beginPath();g.moveTo(x-4.2*Math.max(.4,c),-15);g.quadraticCurveTo(x-1,y-1,x,y);g.quadraticCurveTo(x+1,y-1,x+4.2*Math.max(.4,c),-15);g.stroke();
  const base=['#d8ccb0','#c8ccd4','#d89a3a','#6a5a8a','#e0c060','#c8d8ff','#c84a3a','#fff0c0'][A.t];
  if(A.t===0){g.fillStyle=base;g.beginPath();g.moveTo(x-1,y);g.lineTo(x,y+3.4);g.lineTo(x+1,y);g.closePath();g.fill()}
  else{const rr=1.6+A.t*.16;Kit.solid(g,q=>q.arc(x,y+rr,rr,0,6.283),x-rr,y,x+rr,y+rr*2,base,{rim:'rgba(255,255,255,.9)',lineW:.5});
    g.fillStyle=A.c;g.beginPath();g.arc(x,y+rr,rr*.55,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.fillRect(x-rr*.35,y+rr*.6,.7,.7);
    if(A.t>=5){g.strokeStyle=Kit.rgb(Kit.hex(A.c),.8);g.lineWidth=.5;for(let q=0;q<6;q++){const a=q*Math.PI/3;g.beginPath();g.moveTo(x+Math.cos(a)*rr*1.2,y+rr+Math.sin(a)*rr*1.2);g.lineTo(x+Math.cos(a)*rr*1.8,y+rr+Math.sin(a)*rr*1.8);g.stroke()}}}
  g.restore()}}
const h46T=t=>Math.max(0,Math.min(7,t|0));
// 마법사 · 사제 (hero.js)
{const _hp=heroPart;heroPart=function(cls,part,di,trim,bs){
  const L=trim&&typeof trim==='object'?trim:null;
  if(H46.cls[cls]&&/^(boot|skirt|torso|head|cloak|pauld|arm|armB|staff)$/.test(part)){
    const HD=L&&part==='head'&&L.hrt!=null,RT=L?(HD?L.hrt:L.rt):0,WT=L?L.wt:0,sc=bs||Math.max(1,DPR)*HS;
    const t=part==='boot'?0:part==='staff'?h46T(WT):h46T(RT),am=part==='torso'&&L&&L.amu;
    const e=h46Img(cls,part,t,null,di,sc,am?h46Amu(L.amu,di):null,am?L.amu.t+L.amu.c:'');if(e)return e}
  return _hp.apply(this,arguments)}}
// 궁수 (hero18.js)
{const _hp=heroPart18;heroPart18=function(cls,part,di,trim,bs,v,tc){
  const L=trim&&typeof trim==='object'?trim:null;
  if(cls==='archer'&&/^(boot|skirt|torso|head|cloak|arm|armB|bow|xbow|xprod|quiver)$/.test(part)){
    const HD=L&&part==='head'&&L.hrt!=null,RT=L?(HD?L.hrt:L.rt):4,WT=L?L.wt:2,OT=L?L.ot:2,sc=bs||Math.max(1,DPR)*HS;
    if(part==='cloak'&&L&&RT<1)return null;// 예전처럼 0단계는 망토 없음
    const t=part==='boot'?0:/^(bow|xbow|xprod)$/.test(part)?h46T(WT):part==='quiver'?h46T(OT):h46T(RT);
    const e=h46Img(cls,part,t,part==='bow'?(v|0):null,di,sc);if(e)return e}
  return _hp.apply(this,arguments)}}
