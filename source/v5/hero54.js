/* ---------- [v54] 전사 몸 그림 · 희귀 이상 장비 겉모습 (Codex 그림, 2026-11-02~03) ----------
   사용자 2026-11-03 「지금까지 완료된 그래픽 작업들도 반영해줘」 (그림: Codex 직접 지시 시험 스레드, 「장비가 몸에 보이게」 · 「전사 캐릭터 몸 그림」).
   - 전사: img/flare-hero-warrior.* (단계 0~7 부위 그림 74장). 신발 · 치마 · 몸통 · 머리(투구) · 망토 · 팔 · 칼 · 장병기 · 방패(0~1단계).
     아직 안 나온 방패 2~7단계는 예전 코드 그림.
   - 장비 겉모습: img/flare-gear-<직업>.* (등급 0~2). 희귀 · 세트 · 유니크 · 상급 유니크 로브 · 지팡이는 장식이 더해진 등급 그림:
     등급 = max(아이템 단계 묶음 0~2·3~5·6~7 → 0·1·2, 희귀도 희귀·세트 1 · 유니크·상급 유니크 2).
     일반 · 마법 장비는 예전처럼 단계(0~7) 그림 그대로. 반지(손) · 목걸이(가슴)는 끼고 있으면 등급 그림을 겹쳐 그린다(마법사 · 사제).
     궁수는 옷(몸통 · 치마 · 신발 · 팔 · 망토)만. 모자 그림(얼굴 없이 모자만)과 활(당김 3장이 다 있는 등급 없음)은 아직 안 쓴다.
   - 같은 칸 크기 · 같은 기준점이라 움직임 · 반전은 그대로. 「그림: 예전 그림」 · 묶음을 아직 못 받았을 때 · #qa는 예전 그림.
   - 그림만 바뀐다: 크기 · 충돌 · 적중 · 수치 · 저장은 그대로. */
const H54={n:0,W:/^(boot|skirt|torso|head|cloak|arm|armB|sword|polearm|shield)$/,M:/^(boot|skirt|torso|cloak|pauld|arm|armB|staff)$/,A:/^(boot|skirt|torso|cloak|arm|armB)$/};
const h54RG=r=>r==null||r<2?0:r<4?1:2;// 희귀도 → 등급
const h54TG=t=>t<=2?0:t<=5?1:2;// 아이템 단계 → 등급
const h54G=it=>it&&it.il&&h54RG(it.rar)>=1?Math.max(h54TG(lookTier(it)),h54RG(it.rar)):-1;// 희귀 이상만
const h54GA=it=>it?Math.max(h54TG(lookTier(it)),h54RG(it.rar)):-1;// 반지 · 목걸이
function h54Pk(nm){const P=flPack(nm);if(!P)flNeed(nm);return P}
function h54Has(nm,k){const P=flPack(nm);return !!(P&&P.meta.r[k])}
// 같은 칸 크기 · 기준점의 그림 여러 겹을 한 장으로 굽는다. 하나라도 없으면 null (→ 예전 그림)
function h54Img(layers,di,sc){const Ls=[];for(const [nm,k] of layers){const P=h54Pk(nm),R=P&&P.meta.r[k];if(!R)return null;Ls.push([P,R])}
  const R0=Ls[0][1],cw=R0[3],ch=R0[4],ax=R0[5],ay=R0[6];let multi=false;
  for(const [,R] of Ls){if(R[3]!==cw||R[4]!==ch||R[5]!==ax||R[6]!==ay)return null;if(R[2]>1)multi=true}
  H54.n++;return SC.get('hcg/'+layers.map(l=>l[0]+':'+l[1]).join('+')+`/${multi?di|0:0}/${sc.toFixed(2)}`,cw,ch,ax,ay,g=>{
    for(const [P,R] of Ls){const k=P.meta.sc||2,n=R[2],f=n>1?Math.max(0,Math.min(n-1,di|0)):0;g.drawImage(P.img,R[0]+f*R[3]*k,R[1],R[3]*k,R[4]*k,0,0,R[3],R[4])}},{force:1,scale:sc})}
// 장비 등급을 겉모습에 붙인다 (그림 전용, 저장 안 됨)
function h54Look(L,h){if(!L||!h)return L;const gr=h.gear||{},q={r:h54G(gr.robe),w:h54G(gr.staff),r1:h54GA(gr.ring),r2:h54GA(gr.ring2),am:h54GA(gr.amulet)};
  L.g54=q;L.key+=`|g${q.r},${q.w},${q.r1},${q.r2},${q.am}`;return L}
{const _l=heroLook;heroLook=function(h){return h54Look(_l.apply(this,arguments),h)}}
{const _l=heroLook18;heroLook18=function(h){return h54Look(_l.apply(this,arguments),h)}}
// 마법사 · 사제: 희귀 이상 로브 · 지팡이는 등급 그림, 반지 · 목걸이는 겹쳐 그림
function h54Mage(cls,part,di,L,bs){const q=L.g54;if(!q)return null;const gp='gear-'+cls,sc=bs||Math.max(1,DPR)*HS;
  const g=part==='staff'?q.w:q.r,ov=part==='torso'?['amulet',q.am]:part==='arm'?['ring',q.r1]:part==='armB'?['ring2',q.r2]:null,
    hasOv=!!(ov&&ov[1]>=0&&h54Has(gp,ov[0]+'/'+ov[1]));
  if(g<0&&!hasOv)return null;
  let base;if(g>=0&&h54Has(gp,part+'/'+g))base=[gp,part+'/'+g];
  else{const t=part==='boot'?0:part==='staff'?h46T(L.wt):h46T(L.rt),hp='hero-'+cls;if(!h54Has(hp,part+'/'+t)){h54Pk(hp);return null}base=[hp,part+'/'+t]}
  const ls=[base];if(hasOv)ls.push([gp,ov[0]+'/'+ov[1]]);return h54Img(ls,di,sc)}
{const _hp=heroPart;heroPart=function(cls,part,di,trim,bs){
  const L=trim&&typeof trim==='object'?trim:null;
  if(L&&(cls==='mage'||cls==='priest')&&H54.M.test(part)){const e=h54Mage(cls,part,di,L,bs);if(e)return e}
  return _hp.apply(this,arguments)}}
// 전사 몸 (단계 그림) · 궁수 희귀 이상 옷 (등급 그림)
{const _hp=heroPart18;heroPart18=function(cls,part,di,trim,bs,v,tc){
  const L=trim&&typeof trim==='object'?trim:null,sc=bs||Math.max(1,DPR)*HS;
  if(cls==='warrior'&&H54.W.test(part)){
    const HD=L&&part==='head'&&L.hrt!=null,RT=L?(HD?L.hrt:L.rt):4,WT=L?L.wt:2,OT=L?L.ot:2;
    if(!(part==='cloak'&&L&&RT<2)){const t=part==='sword'||part==='polearm'?h46T(WT):part==='shield'?h46T(OT):h46T(RT);
      const e=h54Img([['hero-warrior',part+'/'+t+(part==='shield'?'/'+(v|0):'')]],di,sc);if(e)return e}}
  else if(cls==='archer'&&L&&L.g54&&L.g54.r>=0&&H54.A.test(part)&&!(part==='cloak'&&L.rt<1)){
    const e=h54Img([['gear-archer',part+'/'+L.g54.r]],di,sc);if(e)return e}
  return _hp.apply(this,arguments)}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{H54,h54G,h54GA,h54Img,h54Look})}catch(_){}},0);
