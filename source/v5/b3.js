
/* ---------- 번개: 위계가 오를수록 굵어지고, 가지가 늘고, 색이 푸른빛에서 보랏빛으로 ---------- */
function stormStyle(rank){
  if(rank<=2)return{w:1.6,br:1,depth:1,col:'#fff4b0',glow:'#ffd84a'};
  if(rank<=5)return{w:2.4,br:3,depth:1,col:'#eef4ff',glow:'#6fa4ff'};
  if(rank<=6)return{w:3.2,br:4,depth:2,col:'#f2f6ff',glow:'#5a8cff'};
  if(rank<=7)return{w:3.4,br:4,depth:2,col:'#f6eeff',glow:'#9a7cff'};
  return{w:4.6,br:5,depth:2,col:'#ffffff',glow:'#b48cff'}}
function zapPaths(a,b,o){const paths=[],seg=o.seg||10;
  function path(a,b,disp,depth,w){const az=a.z||0,dx=b.x-a.x,dy=b.y-a.y,dz=(b.z||0)-az,len=Math.hypot(dx,dy,dz)||1,pts=[{x:a.x,y:a.y,z:az}];
    for(let i=1;i<seg;i++){const f=i/seg,j=disp*Math.sin(f*Math.PI)*rnd(.4,1);pts.push({x:a.x+dx*f+rnd(-j,j),y:a.y+dy*f+rnd(-j,j),z:az+dz*f+rnd(-j,j)*.7})}
    pts.push({x:b.x,y:b.y,z:b.z||0});paths.push({pts,w});
    if(depth<(o.depth||1))for(let k=0;k<(o.br||0);k++){const p=pts[ri(2,seg-2)],ang=R()*6.283,bl=len*rnd(.15,.4);
      path(p,{x:p.x+Math.cos(ang)*bl,y:p.y+Math.sin(ang)*bl,z:Math.max(0,p.z+rnd(-.5,.3)*bl)},disp*.55,depth+1,w*.5)}}
  path(a,b,o.disp!=null?o.disp:Math.hypot(b.x-a.x,b.y-a.y,(b.z||0)-(a.z||0))*.09,0,1);return paths}
function zap(a,b,o){const life=o.life||.3;bolts.push({a,b,o,paths:zapPaths(a,b,o),life,max:life,w:o.w||2,col:o.col||'#fff',glow:o.glow||o.col||'#ffe066',gen:time,delay:o.delay||0,flick:o.flick!==false})}

/* ---------- combat ---------- */
function aimPoint(){
  if(!touchMode&&mouse.active)return S2W(mouse.x,mouse.y);
  const e=nearestEnemy(P,650);return e?{x:e.x,y:e.y}:{x:P.x+Math.cos(P.face)*300,y:P.y+Math.sin(P.face)*300};
}
function nearestEnemy(pt,max,skip){let b=null,bd=max;for(const e of enemies){if(e.dead||(skip&&skip.has(e)))continue;const d=dist(e,pt);if(d<bd){bd=d;b=e}}return b}
function castSlot(i,target){const id=P.bar[i];if(id)tryCast(id,target)}
const AIMED=new Set(['bolt','chain','field','rain','strike','beam','cone','blink']);
let CAST_MOD=null;// cast.js: 채널링 한 틱 {free,mul,share,ov,tick} — 마나·재사용·castFx를 건너뛰고 피해를 나눈다
function tryCast(id,target){const CM=CAST_MOD;
  if(P.dead||paused)return;const s0=SPELLS[id];if(!s0||s0.cls!==P.cls)return;
  const L=skLv(id);
  if(L<=0){if(P.noMpT<=0){msg(`${s0.n}: 아직 배우지 않았습니다. 스킬 트리(T)에서 찍으세요`,'#a39d8f');P.noMpT=1.5}return}
  if(s0.kind==='passive')return;
  if(s0.wt&&!GHOST&&!clsWtMsg(s0))return;// v18: 필요한 무기 (cls2.js)
  if(!CM&&(P.cd[id]||0)>0)return;
  const c=costOf(id);
  if(!CM&&P.mp<c){if(P.noMpT<=0){msg('마나가 부족합니다','#8fb0ff');P.noMpT=1.5}return}
  const s=eff(id,L);if(GHOST)s.ghost=1;if(CM&&CM.ov)Object.assign(s,CM.ov);
  if(!CM){P.mp-=c;P.cd[id]=cdOf(id);core21OnCast(id);castFx(s)}
  const t=clsAim(s,target||aimPoint());if(NET.on&&!GHOST)netCast(id,L,t,CM);
  if(AIMED.has(s.kind)&&!s.self)P.face=Math.atan2(t.y-P.y,t.x-P.x);
  const pw=(PHYS_CLS[s.cls]?physPw(id,L,s):power()*(s.mult||0)*dmgMul()*dmgScale(id,L))*(CM&&CM.mul||1),col=EL[s.el],sup=supScale(L);
  switch(s.kind){
    case'melee':case'leap':case'charge':case'trap':case'intervene':clsKind(s,id,L,t,pw,c,CM);break;// v18 전사·궁수 (cls2.js)
    case'bolt':{const base=Math.atan2(t.y-P.y,t.x-P.x),n=s.cnt||1;
      for(let i=0;i<n;i++){const a=base+(n%2?i-(n-1)/2:(i&1?-1:1)*((i+1)>>1))*(s.spread||0);
        projs.push({x:P.x+Math.cos(a)*16,y:P.y+Math.sin(a)*16,z:20,vx:Math.cos(a)*s.spd,vy:Math.sin(a)*s.spd,r:s.r,dmg:pw,owner:'p',s,life:s.homing?3:1.4,col,hit:s.pierce?new Set():null})}break}
    case'nova':{rings.push({x:P.x,y:P.y,r:10,max:s.rad,life:.5,col});burst(P.x,P.y,col,34,s.rad*1.4);
      if(s.el==='earth'){decal(P.x,P.y,s.rad*.6,'earth');for(let i=0;i<14;i++){const a=R()*6.283;parts.push({x:P.x+Math.cos(a)*s.rad*.5,y:P.y+Math.sin(a)*s.rad*.5,z:0,vx:Math.cos(a)*60,vy:Math.sin(a)*60,vz:rnd(120,220),g:1,life:.8,max:.8,col:'#8a7350',sz:rnd(2.5,5)})}}
      if(s.el==='arcane'&&s.mult===0){rings.push({x:P.x,y:P.y,r:10,max:s.rad*1.1,life:.9,col:'#d8c8ff'});flash={col:'#b9a2ff',a:.25}}
      for(const e of enemies)if(!e.dead&&dist(e,P)<s.rad+hR(e)){if(pw>0)hurtE(e,pw*rnd(.9,1.1),s);applyFx(e,s,P)}
      shake=Math.max(shake,3);break}
    case'chain':{let from={x:P.x,y:P.y,z:24},hit=new Set(),cur=r22First(t,240,s)/* v22: 첫 대상은 사거리 안에서 */,dmg=pw;
      const st=s.el==='storm'?stormStyle(s.rank):{w:2.6,br:2,depth:1,col:'#fffbe0',glow:'#ffd76a'};
      if(!cur){zap(from,{x:P.x+Math.cos(P.face)*170,y:P.y+Math.sin(P.face)*170,z:6},Object.assign({life:.22},st));break}
      for(let j=0;j<s.jumps&&cur;j++){const to={x:cur.x,y:cur.y,z:16},dl=s.rank>=4?j*.06:0;
        zap(from,to,Object.assign({life:.3+dl,delay:dl},st));if(s.rank>=7)zap(from,to,Object.assign({},st,{w:st.w*.5,br:1,depth:1,life:.25+dl,delay:dl}));
        rings.push({x:cur.x,y:cur.y,r:4,max:26+s.rank*3,life:.3,col:st.glow});burst(cur.x,cur.y,st.glow,8,140,2.5,16);
        hit.add(cur);hurtE(cur,dmg*rnd(.9,1.1),s);applyFx(cur,s,from);from=to;dmg*=.9;cur=nearestEnemy(cur,260,hit)}break}
    case'field':{const p=s.self?{x:P.x,y:P.y}:clampRange(t,520);fields.push({x:p.x,y:p.y,rad:s.rad,t:s.dur,max:s.dur,tick:0,dmg:pw,s,sup});break}
    case'rain':{const p=clampRange(t,520);rains.push({x:p.x,y:p.y,rad:s.rad,t:s.dur,acc:0,dmg:pw,s});break}
    case'strike':{const p=clampRange(t,560);pend.push({x:p.x,y:p.y,t:s.delay,max:s.delay,dmg:pw,s});break}
    case'beam':{const a=P.face,x2=P.x+Math.cos(a)*s.len,y2=P.y+Math.sin(a)*s.len,A={x:P.x+Math.cos(a)*14,y:P.y+Math.sin(a)*14,z:20},B={x:x2,y:y2,z:14};
      beams.push({x1:A.x,y1:A.y,x2,y2,z:18,w:s.w,life:s.rank>=6?.45:.3,max:s.rank>=6?.45:.3,col,el:s.el,rank:s.rank});
      if(s.el==='storm'){const st=stormStyle(s.rank);
        zap(A,B,Object.assign({life:.32,seg:14},st));zap(A,B,Object.assign({},st,{life:.28,w:st.w*.6,seg:14}));
        if(s.rank>=6){for(let i=0;i<3;i++)zap(A,B,Object.assign({},st,{life:.45,w:1.2,br:0,depth:0,seg:22,disp:s.len*.035}));
          rings.push({x:x2,y:y2,r:8,max:90,life:.45,col:st.glow});burst(x2,y2,st.glow,30,240,3,14);decal(x2,y2,40,'storm');flash={col:st.glow,a:.12}}
        burst(A.x,A.y,st.col,10,120,2.5,20)}
      if(s.el==='earth'){const pts=[];for(let i=0;i<=12;i++){const f=i/12;pts.push({x:P.x+(x2-P.x)*f+rnd(-10,10),y:P.y+(y2-P.y)*f+rnd(-10,10)})}decals.push({crack:pts,life:4,max:4,w:s.w});
        for(let i=0;i<24;i++){const f=R();parts.push({x:P.x+(x2-P.x)*f,y:P.y+(y2-P.y)*f,z:0,vx:rnd(-30,30),vy:rnd(-30,30),vz:rnd(100,220),g:1,life:.7,max:.7,col:'#8a7350',sz:rnd(2,4.5)})}}
      for(const e of enemies)if(!e.dead&&segDist(e.x,e.y,P.x,P.y,x2,y2)<s.w+hR(e)){hurtE(e,pw*rnd(.9,1.1),s);applyFx(e,s,P)}
      shake=Math.max(shake,s.rank>=6?5:2);break}
    case'cone':{const a=P.face;
      for(let i=0;i<Math.min(90,s.range/3);i++){const aa=a+rnd(-s.ang/2,s.ang/2),sp=rnd(.4,1)*s.range*2.4;parts.push({x:P.x,y:P.y,z:16,vx:Math.cos(aa)*sp,vy:Math.sin(aa)*sp,vz:rnd(-10,30),life:.4,max:.4,col,sz:rnd(2,4.5)})}
      for(const e of enemies)if(!e.dead&&dist(e,P)<s.range+hR(e)&&angDiff(Math.atan2(e.y-P.y,e.x-P.x),a)<s.ang/2){hurtE(e,pw*rnd(.9,1.1),s);applyFx(e,s,P)}break}
    case'blink':{burst(P.x,P.y,col,24,120,3,16);const ox=P.x,oy=P.y;let p=clampRange(t,s.range);if(DG)p=dgLand(ox,oy,p.x,p.y);P.x=clamp(p.x,20,WORLD-20);P.y=clamp(p.y,20,WORLD-20);P.invT=Math.max(P.invT,.3);burst(P.x,P.y,col,24,120,3,16);
      if(pw>0){if(s.el==='storm'){const st=stormStyle(s.rank);zap({x:ox,y:oy,z:16},{x:P.x,y:P.y,z:16},Object.assign({life:.35,seg:14},st))}
        else{rings.push({x:P.x,y:P.y,r:10,max:s.w*1.6,life:.4,col});for(let i=0;i<18;i++){const a=R()*6.283;parts.push({x:P.x,y:P.y,z:4,vx:Math.cos(a)*220,vy:Math.sin(a)*220,vz:rnd(10,60),life:.4,max:.4,col,sz:3})}}
        for(const e of enemies)if(!e.dead&&(segDist(e.x,e.y,ox,oy,P.x,P.y)<s.w+hR(e)||dist(e,P)<s.w*1.4+hR(e))){hurtE(e,pw*rnd(.9,1.1),s);applyFx(e,s,P)}shake=Math.max(shake,3)}break}
    case'heal':case'hot':case'shield':case'buff':case'ward':supFx(s,id,power(),null);break;
    case'rez':{if(GHOST)break;const dead=NET.on?[...NET.peers.values()].filter(r=>r.dead&&netSame(r)&&dist(r,P)<s.rad):[];
      if(!dead.length){P.mp+=c;P.cd[id]=0;msg(NET.on?'가까이에 쓰러진 동료가 없습니다':'리저렉션은 같이 하기에서 쓰러진 동료를 살립니다','#a39d8f');break}
      for(const r of dead){netSend({t:'rez',to:r.id,p:s.pct});FXB.cast(s,{x:r.x,y:r.y});rings.push({x:r.x,y:r.y,r:6,max:90,life:.8,col});burst(r.x,r.y,'#fff2c0',40,160,3,30);msg(`${r.name}님을 되살렸습니다`,col)}break}
    case'invuln':{P.invT=s.dur;FXB.cast(s,P);if(s.heal)healP(Math.round(maxHp()*s.heal*sup));burst(P.x,P.y,col,30,120,3,16);msg(s.n,col);break}
    case'storm':{P.storm={t:s.dur,tick:0,rate:s.rate,range:s.range,dmg:pw,s};msg(s.n,col);break}
    case'orbit':{P.orbits={t:s.dur,max:s.dur,n:s.orbs+Math.floor((L-1)/6),rad:s.orad,dmg:pw,s,a:0,hit:new Map()};msg(s.n,col);break}
    case'summon':{if(s.form==='hydra'){const hs=allies.filter(a=>a.s.id===id);if(hs.length>=3)allies.splice(allies.indexOf(hs[0]),1)}else allies=allies.filter(a=>a.s.id!==id);const hp=Math.round(maxHp()*s.hp*sup),a=P.face;let q=s.form==='hydra'?clampRange(t,420):{x:P.x+Math.cos(a)*50,y:P.y+Math.sin(a)*50};if(DG)q=dgLand(P.x,P.y,q.x,q.y);
      allies.push({ally:1,x:q.x,y:q.y,hp,max:hp,r:s.form==='hydra'?16:20,dmg:pw,t:s.dur,s,atkCd:.5,anim:0,fx:1,lunge:0,hurt:0});
      rings.push({x:q.x,y:q.y,r:6,max:70,life:.6,col});decal(q.x,q.y,40,s.el);shake=Math.max(shake,4);msg(`${s.n}을(를) 불러냈습니다`,col);break}
    case'armor':{FXB.cast(s,P);P.armor={t:s.dur,max:s.dur,red:Math.min(.6,s.red*(1+.02*lvSteps(L))),dmg:pw,s,tick:0,n:s.n,aura:s.aura||0,dmgB:(s.dmg||0)*(1+.04*lvSteps(L))};burst(P.x,P.y,col,30,120,3,16);rings.push({x:P.x,y:P.y,r:6,max:60,life:.5,col});msg(s.n,col);break}
  }
  if(PHYS_CLS[s.cls])clsAfter(s,id,L,t,pw,CM);
  if(s.atone&&!GHOST&&pw>0)healP(Math.round(maxHp()*s.atone*(CM&&CM.share||1)));
  if(typeof FXP!=='undefined')FXP.cast(s,t,GHOST||P);// v18 물리 효과·동작 (fxphys.js)
}
// 치유 · 보호막 · 강화 · 가호: 내가 쓰면 나에게, 동료가 쓴 파티 기도는 from(그 동료)과 그의 주문력으로 나에게 걸린다
function supFx(s,id,pwr,from){const col=EL[s.el],sup=supScale(s.L||1),by=from?`${from.name||'동료'}님의 `:'';FXB.cast(s,P,from);
  if(!from&&s.party&&NET.on)rings.push({x:P.x,y:P.y,r:10,max:s.party*.7,life:.7,col});
  switch(s.kind){
    case'heal':{healP(Math.round((maxHp()*s.pct+pwr*s.mult)*sup*(s.low?1+s.low*(1-P.hp/maxHp()):1)));if(s.hot)putHotV19({t:6,rate:maxHp()*s.hot*sup/6},by,null);if(s.resetcd&&!from){for(const k in P.cd)if(k!==id)P.cd[k]=0;rings.push({x:P.x,y:P.y,r:10,max:120,life:.7,col});msg(`${s.n}: 다른 마법의 재사용 대기가 사라졌습니다`,col)}burst(P.x,P.y,col,26,90,3,16);rings.push({x:P.x,y:P.y,r:6,max:50,life:.4,col:'#9fe39a'});break}
    case'hot':{if(putHotV19({t:s.dur,rate:(maxHp()*s.pct+pwr*s.mult)*sup/s.dur,mrate:s.mana?maxMp()*s.mana*sup/s.dur:0},by,s))msg(by+s.n,col);burst(P.x,P.y,col,16,70);break}
    // v17 흡수 보호막은 겹치지 않는다: 이미 걸린 막보다 크거나 같으면 새 막으로 바꾸고(시간도 새로), 작으면 지금 막을 그대로 둔다 (동료가 건 막도 같음)
    case'shield':{const amt=Math.round((pwr*s.mult+s.flat)*sup);
      if(P.shield>0&&P.shieldT>0&&amt<P.shield)msg(`${by}${s.n}: 더 강한 보호막(${P.shield})이 이미 있습니다`,'#a39d8f');
      else{P.shield=amt;P.shieldT=s.dur;P.shieldN=s.hits||0;P.shieldRef=s.reflect||0;P.shieldS=s;msg(`${by}${s.n} (${P.shield} 흡수${s.hits?` · ${s.hits}번`:''})`,col)}burst(P.x,P.y,col,20,120,3,16);
      // 약해진 영혼: 내가 보호막을 걸면 다른 보호막 마법은 잠깐(SHIELD_LOCK초) 쓸 수 없다
      if(!from)for(const k in P.sk)if(k!==id&&SPELLS[k]&&SPELLS[k].kind==='shield')P.cd[k]=Math.max(P.cd[k]||0,SHIELD_LOCK);
      if(s.rad&&!from){rings.push({x:P.x,y:P.y,r:10,max:s.rad,life:.6,col});burst(P.x,P.y,'#e8f8ff',40,s.rad*1.3,3,10);for(const e of enemies)if(!e.dead&&dist(e,P)<s.rad+e.r)applyFx(e,s,P)}break}
    // v19: 같은 버프는 시전자의 스킬 레벨(L)이 높은 쪽이 남고, 약한 것은 기다렸다가 이어진다 (putBuffV19, skill19.js)
    case'buff':{putBuffV19(id,{t:s.dur,max:s.dur,dmg:s.dmg||0,spd:s.spd||0,regen:s.regen||0,dr:s.dr||0,crit:s.crit||0,cdr:s.cdr||0,hp:s.hp||0,life:s.life||0,floor:s.floor||0,n:s.n,L:s.L||1,by:from?from.name||'동료':''},by,s);burst(P.x,P.y,col,22,100,3,16);break}
    case'ward':{if(putWardV19({t:s.dur,heal:s.heal,n:s.n,healUp:s.healUp||0,inv:s.inv||0},by,s))msg(by+s.n,col);burst(P.x,P.y,col,22,100,3,16);break}
  }}
function applyFx(e,s,from){
  if(e.dead||s.ghost)return;
  if(NET.guest&&e.id)netFx(e,s,from);
  if(s.slow)e.slowT=Math.max(e.slowT,2.5);
  if(s.freeze)e.freezeT=Math.max(e.freezeT,s.freeze);
  if(s.stun)e.stunT=Math.max(e.stunT,s.stun);
  if(s.knock&&from){const d=dist(e,from)||1;e.x+=(e.x-from.x)/d*s.knock;e.y+=(e.y-from.y)/d*s.knock}
}
function clampRange(t,max){const d=dist(t,P);if(d<=max)return t;return{x:P.x+(t.x-P.x)/d*max,y:P.y+(t.y-P.y)/d*max}}
const SHIELD_LOCK=5;
function healP(n){if(P.ward&&P.ward.healUp)n*=1+P.ward.healUp;const before=P.hp;P.hp=Math.min(maxHp(),P.hp+n);const g=Math.round(P.hp-before);if(g>0)ftext(P.x,P.y,'+'+g,'#8cf08a')}
let lastChant=-9;
function castFx(s){const col=EL[s.el];FXB.other(s);
  heroCast(GHOST||P,s.el);
  circles.push({x:P.x,y:P.y,r:24+s.rank*6,life:.6,max:.6,col,rot:R()*6});
  if(s.chant&&(s.cd>=.8||time-lastChant>2.5)){texts.push({x:P.x,y:P.y,z:70,t:'「'+s.chant+'」',c:col,life:1.15,chant:true});lastChant=time}
  if(s.rank>=6&&!GHOST){banner={t:s.n,sub:`${s.kn!==s.n?s.kn+' · ':''}스킬 레벨 ${s.L}${s.chant?' · '+s.chant:''}`,col,life:1.7,max:1.7};flash={col,a:.08+s.rank*.012}}
  burst(P.x,P.y,col,6+s.rank,70,2.5,30)}
function decal(x,y,r,el){if(decals.length>70)decals.shift();const c={fire:'#140a04',earth:'#1e170e',storm:'#0e0c14',ice:'#cfeeff',holy:'#ffe9a8',light:'#ffe9a8'}[el];if(c)decals.push({x,y,r,col:c,life:6,max:6})}
function hurtE(e,amt,s){
  if(e.dead||(s&&s.ghost))return;
  const t=TYPES[e.k];
  if(t.undead&&s&&(s.el==='holy'||s.el==='light'))amt*=s.ud||2;
  if(s&&s.el==='fire')amt*=core21TakeMul(e,s);// v21 잿불 (builds21.js)
  const crit=R()<critC();if(crit)amt*=typeof critDmgK==='function'?critDmgK():1.75;amt=Math.max(1,Math.round(amt));
  e.hp-=amt;e.hurt=.12;e.aggroed=true;if(s&&EL[s.el])for(let i=0;i<4;i++){const a=R()*6.283;parts.push({x:e.x,y:e.y,z:14,vx:Math.cos(a)*rnd(80,200),vy:Math.sin(a)*rnd(80,200),vz:rnd(0,80),life:.25,max:.25,col:EL[s.el],sz:1.8})}
  if(s&&s.burn)e.burn={t:3,dps:Math.max(1,amt*.18)};
  ftext(e.x,e.y,amt,crit?'#ffd34d':'#fff',crit,e.r*2+16);
  if(s&&s.cls){const ls=stat('ls');if(ls&&!P.dead)P.hp=Math.min(maxHp(),P.hp+amt*ls/100);if(!s.proc)procHit(e)}
  if(s&&s.id&&s.cls===P.cls&&!s.proc&&!GHOST)core21OnHit(e,s.id,amt,crit,s);// v21 빌드 핵심 효과 (builds21.js)
  if(NET.guest&&e.id){netDmg(e,amt,s,crit);return}
  if(e.hp<=0&&!e.dead)killE(e);
}
function killE(e){
  e.dead=true;killFx(e);if(NET.host)netKill(e);if(!NET.on||netNear(e)||TYPES[e.k].boss||TYPES[e.k].mini)rewardKill(e)}
function killFx(e){const t=TYPES[e.k];monDie(e);rings.push({x:e.x,y:e.y,r:4,max:e.r*2.4,life:.3,col:t.undead?'#d8d0ff':'#fff'});if(t.undead)for(let i=0;i<8;i++)parts.push({x:e.x+rnd(-8,8),y:e.y+rnd(-8,8),z:10,vx:rnd(-15,15),vy:rnd(-15,15),vz:rnd(50,110),life:.9,max:.9,col:'#cfc6ff',sz:2.4});
  burst(e.x,e.y,t.col,18,140)}
const xpUp21=d=>d<=20?1:Math.max(.1,1-.9*(d-20)/30);
let DROP24=.2;// v24: 몬스터 · 보스 덤 장비 드롭 배수 (#qa가 개수를 셀 때 잠깐 0으로)
function rewardKill(e){const t=TYPES[e.k];questKill(e);
  let xp=t.xp*(1+.35*(e.lvl-1))*(e.elite?3:1)*DIFF[P.diff].xp;
  const gap=P.lvl-5-e.lvl;if(gap>0)xp*=Math.max(.05,1-.15*gap);xp*=xpUp21(e.lvl-P.lvl);// v21(사용자 04:34): 몬스터가 20레벨 이상 높으면 줄어 50레벨 위면 10%
  gainXp(Math.max(1,Math.round(xp)));const mk=stat('mk');if(mk)P.mp=Math.min(maxMp(),P.mp+mk);
  if(t.boss||t.mini){dgBossDrop(e);return}
  if(R()<.6)loot.push({x:e.x+rnd(-12,12),y:e.y+rnd(-12,12),kind:'gold',amt:ri(1,4)*e.lvl+(e.elite?e.lvl*5:0),t:0});
  if(R()<.13)loot.push({x:e.x+rnd(-14,14),y:e.y+rnd(-14,14),kind:R()<.55?'hp':'mp',tier:potDropTier(e.lvl||1),t:0});
  if(R()<.02)loot.push({x:e.x+rnd(-14,14),y:e.y+rnd(-14,14),kind:'tp',t:0});
  // v24(사용자 2026-10-10 05:17): 몬스터 장비 드롭을 1/5로 — 일반 10%→2% · 정예 확정 1개+50% → 20%+10%. 아이템 하나의 등급 확률(유니크·세트)은 그대로
  if(R()<(e.elite?1:.1)*DROP24){const it=makeItem(e.lvl,e.elite);if(junkKeep(it))loot.push({x:e.x+rnd(-16,16),y:e.y+rnd(-16,16),kind:'item',item:it,t:0})}
  if(e.elite&&R()<.5*DROP24){const it=makeItem(e.lvl+1,true);if(junkKeep(it))loot.push({x:e.x+rnd(-18,18),y:e.y+rnd(-18,18),kind:'item',item:it,t:0})}/* v21: 잡템 줄이기(junkKeep) */
}
function gainXp(n){
  if(P.lvl>=MAXLV)return;
  P.xp+=n;ftext(P.x+18,P.y,'+'+n+' 경험치','#c9b4ff',false,58);
  while(P.lvl<MAXLV&&P.xp>=xpNeed(P.lvl)){
    P.xp-=xpNeed(P.lvl);P.lvl++;P.sp++;P.ap+=5;P.hp=maxHp();P.mp=maxMp();
    rings.push({x:P.x,y:P.y,r:10,max:120,life:.8,col:'#ffd76a'});burst(P.x,P.y,'#ffd76a',50,200,3.5,20);
    msg(`레벨 ${P.lvl} 달성! 스킬 포인트 1점, 능력치 포인트 5점 (T · C)`,'#ffd76a');
    const r=rankOf(P.lvl);
    if(r>lastRank){lastRank=r;const C=CLASSES[P.cls];msg(`${C.rankN(r)}에 올랐습니다 (${C.grade[r-1]}). 새 마법을 찍을 수 있습니다`,'#c9b4ff')}
    if(P.lvl===DIFF[1].req)msg('악몽 난이도가 열렸습니다. 짝문에서 고를 수 있습니다','#ff8a5a');
    if(P.lvl===DIFF[2].req)msg('지옥 난이도가 열렸습니다. 짝문에서 고를 수 있습니다','#ff4a3a');
    if(P.lvl>=MAXLV){P.xp=0;msg(`최고 레벨 ${MAXLV}에 닿았습니다`,'#ffd76a')}
    save();
  }
}
function learnPoint(id){
  if(!canLearn(id))return false;const first=!P.sk[id];P.sk[id]=(P.sk[id]||0)+1;P.sp--;passT=-1;
  if(first&&SPELLS[id].kind==='passive')msg(`${SPELLS[id].n}: 패시브라서 배운 순간부터 늘 켜져 있습니다`,EL[SPELLS[id].el]);
  else if(first){let slot=-1;for(const i of [0,1,2,3,4,5,6,7,8,9,10,11,12])if(!P.bar[i]){slot=i;break}
    if(slot>=0){P.bar[slot]=id;msg(`${SPELLS[id].n}을(를) [${SLOTS[slot].k}] 칸에 넣었습니다`,EL[SPELLS[id].el])}}
  buildBar();save();return true}
function hitPlayer(d,src){
  if(P.dead)return;
  if(P.invT>0){ftext(P.x,P.y,'막음','#ffe39a');return}
  if(P.armor){d*=1-P.armor.red;if(src&&!src.dead){const s=P.armor.s;hurtE(src,P.armor.dmg*.6,s);applyFx(src,s,P)}}
  d=Math.round(d*(1-Math.min(.5,stat('dr')/100))*(1-Math.min(.6,buffSum('dr'))));
  if(P.shield>0){const a=Math.min(P.shield,d);P.shield-=a;d-=a;if(P.shieldRef&&a>0&&src&&!src.dead&&src.hp!=null&&P.shieldS)hurtE(src,a*P.shieldRef,P.shieldS);
    if(P.shieldN>0&&--P.shieldN<=0)P.shield=0;if(P.shield<=0)P.shieldT=0;}
  if(d<=0){ftext(P.x,P.y,'흡수','#8fd8ff');return}
  P.hp-=d;P.hurtT=.25;ftext(P.x,P.y,'-'+d,'#ff6a5a');
  if(P.hp<=0&&buffSum('floor')>0){P.hp=1;ftext(P.x,P.y,'버팀','#ffe39a');return}
  if(P.hp<=0&&P.ward){P.hp=Math.max(1,Math.round(maxHp()*P.ward.heal));msg(`${P.ward.n}: 쓰러지지 않았습니다`,'#ffe39a');P.invT=P.ward.inv||1.5;P.ward=null;
    rings.push({x:P.x,y:P.y,r:10,max:140,life:.7,col:'#ffe39a'});burst(P.x,P.y,'#ffe39a',50,200);return}
  if(P.hp<=0){P.hp=0;P.dead=true;burst(P.x,P.y,'#c9b4ff',40,160);setTimeout(()=>{$('#death').hidden=false},700)}
}

/* ---------- spawning & AI ---------- */
function spawnEnemy(){
  for(let tries=0;tries<12;tries++){
    const A=netAnchor(),a=R()*6.283,d=rnd(760,1050),x=A.x+Math.cos(a)*d,y=A.y+Math.sin(a)*d;
    if(x<40||y<40||x>WORLD-40||y>WORLD-40)continue;
    const zl=zoneLevel(x,y);if(zl<1||blockedAt(x,y))continue;
    const pool=(REG.mobs||FIELD_TYPES).filter(k=>TYPES[k].min<=zl+(P.diff?40:0));const k=pick(pool.slice(-4));const t=TYPES[k];
    const D=DIFF[P.diff],lvl=Math.max(1,zl+D.add+ri(-1,0)),elite=R()<.06;
    const hp=Math.round(t.hp*(1+.34*(lvl-1))*(elite?3:1)*D.hp);
    enemies.push({k,x,y,lvl,elite,hp,max:hp,dmg:t.dmg*(1+.18*(lvl-1))*(elite?1.4:1),r:t.r*(elite?1.25:1),atkCd:rnd(.5,1.5),anim:R()*10,wx:x,wy:y,wt:0,hurt:0,fx:1,slowT:0,freezeT:0,stunT:0,burn:null,lunge:0});
    return;
  }
}
function enemyTarget(e){let tg=P,bd=P.dead?1e9:dist(e,P);if(NET.host)for(const r of NET.peers.values()){if(r.dead||!netSame(r))continue;const d=dist(e,r);if(d<bd){bd=d;tg=r}}for(const a of allies){const d=dist(e,a);if(d<bd-30){bd=d;tg=a}}return{tg,d:bd}}
const EGRID=new Map();
// 몬스터가 알아채는 거리 (v26 aggro26.js가 선공 · 비선공으로 바꾼다)
let aggroOf=(e,t)=>t.aggro*(e.boss?1.4:1);
function updateEnemies(dt){
  const pInTown=!DG&&inSafe(P.x,P.y,10);
  for(const e of enemies){
    if(e.dead)continue;const t=TYPES[e.k];
    e.anim+=dt;e.atkCd-=dt;e.hurt-=dt;e.lunge=Math.max(0,e.lunge-dt);
    if(e.burn){e.burn.t-=dt;e.hp-=e.burn.dps*dt;if(R()<.3)parts.push({x:e.x+rnd(-8,8),y:e.y+rnd(-6,6),z:rnd(4,20),vx:0,vy:0,vz:40,life:.5,max:.5,col:'#ff7a2e',sz:2.5});if(e.hp<=0){killE(e);continue}if(e.burn.t<=0)e.burn=null}
    e.slowT-=dt;e.freezeT-=dt;e.stunT-=dt;
    const held=e.freezeT>0||e.stunT>0||e.cast>0,sf=held?0:e.slowT>0?.45:1;
    const {tg,d}=enemyTarget(e);
    if(!DG&&netFar(e)){e.gone=true;continue}
    const chase=(NET.on?!tg.dead&&d<1e8&&!(!DG&&(tg===P||tg.remote)&&inSafe(tg.x,tg.y,10)):!P.dead&&!pInTown)&&(d<aggroOf(e,t)||e.aggroed)&&(!DG||dgSees(e,tg));
    if(chase)e.aggroed=true;
    let mx=0,my=0;
    if(e.boss&&chase)bossThink(e,dt,tg,d);
    if(chase){
      let ux=d>0?(tg.x-e.x)/d:1,uy=d>0?(tg.y-e.y)/d:0;if(!held)e.fx=(ux-uy)>=0?1:-1;// v18: 순간이동으로 몬스터와 같은 점에 서면 d=0 → NaN 위치가 되던 문제
      if(DG&&d>e.r+tg.r+30){const w=dgStep(e,tg);if(w){ux=w.x;uy=w.y}}
      if(t.ranged){
        if(d>240){mx=ux;my=uy}else if(d<150&&d>0){mx=-(tg.x-e.x)/d;my=-(tg.y-e.y)/d}
        if(d<420&&e.atkCd<=0&&!held){e.atkCd=t.atk;const a=Math.atan2(tg.y-e.y,tg.x-e.x),sp=t.draw==='apostle'?300:260;projs.push({x:e.x,y:e.y,z:18,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:6,dmg:e.dmg,owner:'e',life:2,col:t.pcol})}
      }else{
        if(d>e.r+tg.r+4){mx=ux;my=uy}
        else if(e.atkCd<=0&&!held){e.atkCd=t.atk;e.lunge=.15;if(tg.ally)hurtAlly(tg,e.dmg*rnd(.85,1.15));else if(tg.remote)netHit(tg,e.dmg*rnd(.85,1.15),e);else hitPlayer(e.dmg*rnd(.85,1.15),e)}
      }
    }else if(!DG){
      e.wt-=dt;if(e.wt<=0){e.wt=rnd(1.5,4);e.wx=e.x+rnd(-120,120);e.wy=e.y+rnd(-120,120)}
      const wd=Math.hypot(e.wx-e.x,e.wy-e.y);if(wd>6){mx=(e.wx-e.x)/wd*.4;my=(e.wy-e.y)/wd*.4;e.fx=(mx-my)>=0?1:-1}
    }
    if(e.dash>0){e.dash-=dt;mx=e.dvx;my=e.dvy}
    const sp=(e.dash>0?t.spd*4:t.spd)*(e.dash>0?1:sf);
    moveBody(e,mx*sp*dt,my*sp*dt);
    if(!DG)for(const tw of TOWNS){const td=Math.hypot(e.x-tw.x,e.y-tw.y),SF=tSafe(tw);if(td<SF){if(td<.01){e.x=tw.x+SF;continue}e.x=tw.x+(e.x-tw.x)/td*SF;e.y=tw.y+(e.y-tw.y)/td*SF}}// td=0(마을 한가운데)이면 NaN이 되던 것
    e.x=clamp(e.x,20,WORLD-20);e.y=clamp(e.y,20,WORLD-20);
  }
  // [v25 최적화] 몬스터끼리 밀어내기: 모든 쌍(n²)을 보던 것을 칸(격자)으로 나눠 이웃 칸끼리만 본다. 결과는 같다(겹친 쌍만 밀어냄).
  {let mr=0;for(const e of enemies)if(!e.dead&&e.r>mr)mr=e.r;const C=Math.max(64,mr*2+1),G=EGRID;G.clear();
    for(let i=0;i<enemies.length;i++){const a=enemies[i];if(a.dead)continue;const k=(Math.floor(a.x/C)+32768)*65536+Math.floor(a.y/C)+32768;let L=G.get(k);if(!L)G.set(k,L=[]);L.push(i)}
    for(let i=0;i<enemies.length;i++){const a=enemies[i];if(a.dead)continue;const cx=Math.floor(a.x/C),cy=Math.floor(a.y/C);
      for(let gx=cx-1;gx<=cx+1;gx++)for(let gy=cy-1;gy<=cy+1;gy++){const L=G.get((gx+32768)*65536+gy+32768);if(!L)continue;for(const j of L){if(j<=i)continue;
        const b=enemies[j];if(b.dead)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,m=a.r+b.r;
        if(d<m){const p=(m-d)/2,wa=a.boss?.1:1,wb=b.boss?.1:1;moveBody(a,-dx/d*p*wa,-dy/d*p*wa);moveBody(b,dx/d*p*wb,dy/d*p*wb)}}}}}
  enemies=enemies.filter(e=>!e.dead&&!e.gone);
}
// 벽이 있는 곳(던전)에서는 축마다 따로 막는다
function moveBody(o,dx,dy){if(!DG){if((LQ||TGRID)&&!blockedAt(o.x,o.y)&&blockedAt(o.x+dx,o.y+dy)){if(!blockedAt(o.x+dx,o.y))o.x+=dx;else if(!blockedAt(o.x,o.y+dy))o.y+=dy;else for(const a of [.75,-.75,1.5,-1.5]){const c=Math.cos(a),s=Math.sin(a),rx=dx*c-dy*s,ry=dx*s+dy*c;if(!blockedAt(o.x+rx,o.y+ry)){o.x+=rx;o.y+=ry;break}}return}o.x+=dx;o.y+=dy;return}
  const r=Math.min(o.r,30);
  if(dgFree(o.x+dx,o.y,r))o.x+=dx;if(dgFree(o.x,o.y+dy,r))o.y+=dy}
function hurtAlly(a,d){a.hp-=d;a.hurt=.12;ftext(a.x,a.y,'-'+Math.round(d),'#ffb08a',false,40)}
function updateAllies(dt){
  for(const a of allies){a.t-=dt;a.anim+=dt;a.atkCd-=dt;a.hurt-=dt;a.lunge=Math.max(0,a.lunge-dt);
    let tg=null,bd=a.s.form==='hydra'?460:520;for(const e of enemies){if(e.dead)continue;const d=dist(e,a);if(d<bd){bd=d;tg=e}}
    let mx=0,my=0;
    if(a.s.form==='hydra'){if(tg&&a.atkCd<=0){a.atkCd=.8;a.lunge=.2;a.fx=((tg.x-a.x)-(tg.y-a.y))>=0?1:-1;const an=Math.atan2(tg.y-a.y,tg.x-a.x);
        projs.push({x:a.x,y:a.y,z:34,vx:Math.cos(an)*420,vy:Math.sin(an)*420,r:7,dmg:a.dmg,owner:'p',s:a.s,life:1.3,col:EL.fire,hit:null})}}
    else if(tg){const d=bd;a.fx=((tg.x-a.x)-(tg.y-a.y))>=0?1:-1;
      if(d>a.r+tg.r+6){mx=(tg.x-a.x)/d;my=(tg.y-a.y)/d}
      else if(a.atkCd<=0){a.atkCd=1.1;a.lunge=.2;hurtE(tg,a.dmg*rnd(.9,1.1),a.s);applyFx(tg,{knock:20},a);rings.push({x:tg.x,y:tg.y,r:4,max:40,life:.3,col:'#c9a46a'});burst(tg.x,tg.y,'#8a7350',10,120,3,10);shake=Math.max(shake,2)}}
    else{const d=dist(a,P);if(d>90){mx=(P.x-a.x)/d;my=(P.y-a.y)/d;a.fx=((P.x-a.x)-(P.y-a.y))>=0?1:-1}}
    moveBody(a,mx*115*dt,my*115*dt);
    if(a.hp<=0||a.t<=0){a.gone=true;burst(a.x,a.y,'#8a7350',30,160,4,10);decal(a.x,a.y,30,'earth')}
  }
  allies=allies.filter(a=>!a.gone);
}
// v18 비 마법 낙하 자리: 예전엔 낙하마다 원 안 아무 데나(완전 무작위) → 난수에 따라 작은 표적이 한 번도 안 맞는 일이 있었다.
// 이제 원을 같은 넓이 7칸(가운데 원 1 + 바깥 고리 부채꼴 6)으로 나눠, 7번 떨어질 때마다 칸마다 한 번씩(순서는 무작위, 칸 안 자리도 무작위) 떨어진다.
// 첫 낙하는 겨눈 곳 한가운데(첫 바퀴의 가운데 칸 몫). 칸마다 넓이가 같으니 평균 분포·낙하 수·피해 합은 예전과 같고, 고르게 퍼진다.
function rainPt(r){const K=7;
  if(!r.q||!r.q.length){const q=[0,1,2,3,4,5,6];for(let i=K-1;i>0;i--){const j=Math.floor(R()*(i+1)),t=q[i];q[i]=q[j];q[j]=t}r.q=q;if(r.rot==null)r.rot=R()*6.283}
  if(!r.n){r.n=1;r.q.splice(r.q.indexOf(0),1);return{x:r.x,y:r.y}}
  r.n++;const c=r.q.pop();let d,a;
  if(c===0){d=Math.sqrt(R()/K)*r.rad;a=R()*6.283}else{d=Math.sqrt((1+R()*(K-1))/K)*r.rad;a=r.rot+(c-1+R())*6.283/(K-1)}
  return{x:r.x+Math.cos(a)*d,y:r.y+Math.sin(a)*d}}
// v18 비 마법 한 줄기의 실제 피해 반지름: 예전엔 srad(34~50)라 넓은 원 안에서 거의 안 맞았다 → 원 반지름의 0.56~0.66배(초당 낙하가 많을수록 작게).
// 그림(기둥·불씨·벼락)은 그대로 srad 크기, 실제 맞는 넓이는 옅은 고리로 보여 준다. rainDK: 넓어진 만큼 한 줄기 피해를 조금 줄이는 배수.
// 넓어진 만큼 맞는 횟수가 늘어나므로(몬스터 반지름 22 기준 맞을 확률 ((반지름+22)/원)²) 몬스터 하나가 받는 피해가 예전의 2배를 넘지 않게 한 줄기 피해를 줄인다.
function rainSR(s,rad){rad=rad||s.rad;const k=s.rate>=12?.56:s.rate>=10?.58:s.rate>=8?.6:s.rate>=7?.62:.66;return Math.max(s.srad||0,rad*k)}
function rainDK(s,rad){rad=rad||s.rad;const o=Math.min(1,((s.srad||0)+22)**2/(rad*rad)),n=Math.min(1,(rainSR(s,rad)+22)**2/(rad*rad));return n>0?Math.min(1,2*o/n):1}
function skyHit(x,y,s,dmg,rad,hitR){
  const col=EL[s.el];
  if(s.el==='storm'){const st=stormStyle(s.rank);zap({x:x+rnd(-40,40),y:y+rnd(-40,40),z:380},{x,y,z:0},Object.assign({life:.28,seg:12},st));
    rings.push({x,y,r:4,max:rad*1.2,life:.3,col:st.glow});if(s.rank>=7)arcs.push({x,y,rad:rad*.8,t:.5,col:st.col,glow:st.glow});decal(x,y,rad*.5,'storm')}
  else if(s.el==='holy'||s.el==='light')pillars.push({x,y,w:rad*.5,life:.35,max:.35,col});
  else if(s.el==='fire'){pend.push({x,y,t:.25,max:.25,dmg:0,s:{el:'fire',rad,fall:1,mini:1}})}
  burst(x,y,col,s.el==='earth'?14:10,140,s.el==='earth'?4:3);
  const hr=hitR||rad;if(hitR)rings.push({x,y,r:hr*.55,max:hr,life:.3,col,faint:1});
  for(const e of enemies)if(!e.dead&&Math.hypot(e.x-x,e.y-y)<hr+hR(e)){hurtE(e,dmg*rnd(.9,1.1),s);applyFx(e,s,{x,y})}
}

/* ---------- update ---------- */
function update(dt){
  time+=dt;
  for(const k in P.cd)P.cd[k]=Math.max(0,P.cd[k]-dt);
  P.potCd=Math.max(0,P.potCd-dt);P.noMpT-=dt;P.invT=Math.max(0,P.invT-dt);
  tickBuffsV19(dt);// v19: 기다리는 약한 버프도 같이 흐르고, 강한 것이 끝나면 이어진다
  if(P.ward){P.ward.t-=dt;if(P.ward.t<=0)P.ward=null}
  if(!P.dead){
    P.mp=Math.min(maxMp(),P.mp+regen()*dt);{const lf=buffSum('life');if(lf>0&&P.hp<maxHp())P.hp=Math.min(maxHp(),P.hp+maxHp()*lf*dt)}
    P.hp=Math.min(maxHp(),P.hp+(.6+P.lvl*.15)*(P.cls==='priest'?1.5:1)*dt);
    let sx=0,sy=0;
    if(keys.has('KeyW')||keys.has('ArrowUp'))sy--;if(keys.has('KeyS')||keys.has('ArrowDown'))sy++;
    if(keys.has('KeyA')||keys.has('ArrowLeft'))sx--;if(keys.has('KeyD')||keys.has('ArrowRight'))sx++;
    let mag=sx||sy?1:0;
    if(joy){const dx=joy.x-joy.ox,dy=joy.y-joy.oy,l=Math.hypot(dx,dy);if(l>8){sx=dx;sy=dy;mag=Math.min(1,l/44)}}
    P.moving=mag>.05;
    if(P.moving){const d=scrDir(sx,sy),sp=SPEED*spdMul()*mag*(CAST.ch&&CAST.ch.walk&&CAST.p===P?CAST.ch.walk:1);moveBody(P,d.x*sp*dt,d.y*sp*dt);P.x=clamp(P.x,20,WORLD-20);P.y=clamp(P.y,20,WORLD-20);P.walk+=dt*spdMul();if(touchMode||!mouse.active)P.face=Math.atan2(d.y,d.x)}
    if(!touchMode&&mouse.active){const m=S2W(mouse.x,mouse.y);P.face=Math.atan2(m.y-P.y,m.x-P.x)}
    if(mouse.l)castSlot(0,aimAt(mouse.x,mouse.y));
    if(mouse.r)castSlot(1,aimAt(mouse.x,mouse.y));
    if(fireTouch)castSlot(0,aimAt(fireTouch.x,fireTouch.y));
    for(const c in CODE2SLOT)if(keys.has(c))castSlot(CODE2SLOT[c]);
    if(!DG&&nearestTown(P.x,P.y).d<95){P.hp=Math.min(maxHp(),P.hp+maxHp()*.3*dt);P.mp=Math.min(maxMp(),P.mp+maxMp()*.3*dt);
      if(R()<.25)rise(P.x+rnd(-12,12),P.y+rnd(-12,12),'#9fe0ff')}
    if(P.shieldT>0){P.shieldT-=dt;if(P.shieldT<=0)P.shield=0}
    if(P.hot){P.hot.t-=dt;P.hp=Math.min(maxHp(),P.hp+P.hot.rate*dt);if(P.hot.mrate)P.mp=Math.min(maxMp(),P.mp+P.hot.mrate*dt);if(R()<.2)rise(P.x+rnd(-10,10),P.y+rnd(-10,10),'#9fe39a');if(P.hot.t<=0)P.hot=null}
    if(P.storm){const st=P.storm;st.t-=dt;st.tick-=dt;if(st.tick<=0){st.tick=1/st.rate;const c=enemies.filter(e=>dist(e,P)<st.range);if(c.length){const e=pick(c);skyHit(e.x,e.y,st.s,st.dmg,38);shake=Math.max(shake,3)}}if(st.t<=0)P.storm=null}
    if(P.hurtT>0)P.hurtT-=dt;
    const nt=nearestTown(P.x,P.y);
    if(DG)act=dgAct();else{
    if(nt.d<tSafe(nt.t)){if(!P.towns.includes(nt.t.id)){P.towns.push(nt.t.id);msg(`${nt.t.n}에 도착했습니다. 짝문이 이어졌습니다`,'#d6b262');burst(P.x,P.y,'#d6b262',30,160);save()}P.home=nt.t.id}
    {const sh=shopAt(nt.t);if(sh)actShop=sh.type;act=sh?'shop':dist(P,nt.t.gate)<90?'gate':nt.t.stash&&dist(P,nt.t.stash)<75?'stash':nt.t.npc&&dist(P,nt.t.npc)<80?'quest':null;actTown=nt.t}
    if(!act){const c=nearCave();if(c){act='dungeon';actCave=c}}
    if(!act){const ep=nearEdge();if(ep){act='edge';actEdge=ep}}}
  }
  spawnT-=dt;
  const zl=zoneLevel(P.x,P.y),target=(zl===0?6:11+Math.min(7,Math.floor(zl/3)))*(typeof darkMods==='function'?1+darkMods().pack:1);// v21 HUNT: 어둠 단계 무리 +5%·단계
  if(!DG&&spawnT<=0&&!NET.guest&&enemies.length<target*(NET.on?1+.5*Math.max(0,netPlayers().length-1):1)){spawnT=.5;spawnEnemy()}
  if(NET.guest)netGuestEnemies(dt);else updateEnemies(dt);updateAllies(dt);netTick(dt);updateSpellBits(dt);if(DG)dgUpdate(dt);else{dashHits();regionTick(dt)}tpTick(dt);
  for(const p of projs){
    if(p.owner==='p'&&p.s.homing){const e=nearestEnemy(p,520);if(e){const want=Math.atan2(e.y-p.y,e.x-p.x),cur=Math.atan2(p.vy,p.vx);let d=want-cur;while(d>Math.PI)d-=6.283;while(d<-Math.PI)d+=6.283;const na=cur+clamp(d,-5*dt,5*dt),sp=Math.hypot(p.vx,p.vy);p.vx=Math.cos(na)*sp;p.vy=Math.sin(na)*sp}}
    if(p.owner==='p'){(p.tr||(p.tr=[])).push({x:p.x,y:p.y});if(p.tr.length>FXR.trLen(p))p.tr.shift()}
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(DG&&!dgFree(p.x,p.y,2)){p.life=0;burst(p.x,p.y,p.col,6,80,2.5,p.z);if(p.owner==='p')FXR.hit(p);continue}
    if(p.owner==='p'){
      if(R()<.8)parts.push({x:p.x,y:p.y,z:p.z,vx:rnd(-20,20),vy:rnd(-20,20),vz:rnd(-10,20),life:.3,max:.3,col:p.col,sz:p.r*.5});
      for(const e of enemies){if(e.dead||(p.hit&&p.hit.has(e)))continue;if(Math.hypot(e.x-p.x,e.y-p.y)<hR(e)+p.r+4||r22Box(e,p)){
        const s=p.s;hurtE(e,p.dmg*rnd(.9,1.1),s);applyFx(e,s,{x:p.x-p.vx,y:p.y-p.vy});burst(p.x,p.y,p.col,s.aoe?34:10,s.aoe?220:100,s.aoe?5:3,p.z);FXR.hit(p);
        if(s.aoe){decal(p.x,p.y,s.aoe*.6,s.el);rings.push({x:p.x,y:p.y,r:8,max:s.aoe,life:.35,col:p.col});shake=Math.max(shake,4);for(const o of enemies)if(o!==e&&!o.dead&&dist(o,p)<s.aoe+hR(o)){hurtE(o,p.dmg*.6,s);applyFx(o,s,p)}}
        if(p.hit)p.hit.add(e);else{p.life=0;break}}}
    }else if(p.ghost){if(!DG&&inSafe(p.x,p.y,20))p.life=0}else{
      if(NET.host)for(const r of NET.peers.values())if(p.life>0&&!r.dead&&netSame(r)&&Math.hypot(r.x-p.x,r.y-p.y)<r.r+p.r+2){p.life=0;netHit(r,p.dmg,null);burst(p.x,p.y,p.col,8,80,3,p.z)}
      if(p.life>0&&!P.dead&&Math.hypot(P.x-p.x,P.y-p.y)<P.r+p.r+2){p.life=0;hitPlayer(p.dmg);burst(p.x,p.y,p.col,8,80,3,p.z)}
      for(const a of allies)if(p.life>0&&Math.hypot(a.x-p.x,a.y-p.y)<a.r+p.r){p.life=0;hurtAlly(a,p.dmg)}
      if(!DG&&inSafe(p.x,p.y,20))p.life=0;
    }
  }
  projs=projs.filter(p=>p.life>0);
  for(const f of fields){f.t-=dt;f.tick-=dt;const s=f.s,col=EL[s.el];
    if(s.self){const o=f.own||P;f.x=o.x;f.y=o.y}
    if(s.block)for(const p of projs)if(p.owner!=='p'&&p.life>0&&Math.hypot(p.x-f.x,p.y-f.y)<f.rad){p.life=0;burst(p.x,p.y,col,6,80,2.5,p.z)}
    for(let i=0;i<2;i++){const a=R()*6.283,r=Math.sqrt(R())*f.rad,x=f.x+Math.cos(a)*r,y=f.y+Math.sin(a)*r;
      if(s.el==='ice')parts.push({x,y,z:70,vx:rnd(-30,10),vy:rnd(-10,30),vz:-rnd(80,140),life:.5,max:.5,col:'#d8f2ff',sz:rnd(1.5,3)});else rise(x,y,s.heal?'#9fe39a':col)}
    if(f.tick<=0){f.tick=.5;
      if(s.drf&&!P.dead&&dist(P,f)<f.rad)P.buffs['_f_'+s.id]={t:.7,max:.7,dr:s.drf,n:s.n};
      if(s.heal&&dist(P,f)<f.rad)healP(Math.round(maxHp()*s.heal*.5*(f.sup||1)));if(s.mana&&dist(P,f)<f.rad)P.mp=Math.min(maxMp(),P.mp+maxMp()*s.mana*.5*(f.sup||1));
      if(f.dmg>0&&!s.ghost)for(const e of enemies)if(!e.dead&&dist(e,f)<f.rad+hR(e)){if(s.slow)e.slowT=Math.max(e.slowT,1);if(s.stun)e.stunT=Math.max(e.stunT,s.stun);if(s.freeze&&R()<.3)e.freezeT=Math.max(e.freezeT,s.freeze);hurtE(e,f.dmg,s)}}
    if(s.pull&&!s.ghost)for(const e of enemies){if(e.dead)continue;const d=dist(e,f);if(d>14&&d<f.rad+e.r+20){const k=(e.boss?40:140)*dt;moveBody(e,(f.x-e.x)/d*k,(f.y-e.y)/d*k)}}}
  fields=fields.filter(f=>f.t>0);
  for(const r of rains){r.t-=dt;r.acc+=dt*r.s.rate;while(r.acc>=1){r.acc--;const q=rainPt(r);skyHit(q.x,q.y,r.s,r.dmg*rainDK(r.s,r.rad),r.s.srad,rainSR(r.s,r.rad))}}
  rains=rains.filter(r=>r.t>0);
  updateWarns(dt);
  for(const m of pend){m.t-=dt;if(m.t<=0){const s=m.s,col=EL[s.el];
    if(s.mini){burst(m.x,m.y,'#ff9a3a',12,120,4);continue}
    shake=reduceMotion?0:Math.min(16,4+s.rad/12);rings.push({x:m.x,y:m.y,r:10,max:s.rad,life:.5,col});
    if(s.el==='storm'){const st=stormStyle(s.rank),big=s.rank>=9;
      for(let i=0;i<(big?5:3);i++)zap({x:m.x+rnd(-60,60),y:m.y+rnd(-60,60),z:460},{x:m.x+rnd(-14,14),y:m.y+rnd(-14,14),z:0},Object.assign({},st,{life:big?.7:.4,w:st.w*(big?(i?1:1.8):1),seg:14}));
      if(big){for(let i=1;i<=3;i++)rings.push({x:m.x,y:m.y,r:10,max:s.rad*(.6+i*.35),life:.4+i*.15,col:st.glow});arcs.push({x:m.x,y:m.y,rad:s.rad,t:1.4,col:st.col,glow:st.glow});flash={col:'#c8b0ff',a:.35}}}
    else if(s.el==='holy'||s.el==='light')pillars.push({x:m.x,y:m.y,w:s.rad*.7,life:.6,max:.6,col});
    if(s.after)fields.push({x:m.x,y:m.y,rad:s.rad*.8,t:s.after,max:s.after,tick:.3,dmg:m.dmg*.12,s:Object.assign({},s,{kind:'field',after:0})});
    burst(m.x,m.y,col,60,s.rad*2.4,6);decal(m.x,m.y,s.rad*.8,s.el);if(s.rank>=6&&!reduceMotion&&s.el!=='storm')flash={col,a:.22};if(s.el==='fire'||s.fall)burst(m.x,m.y,'#ffd76a',30,s.rad*1.6,4);
    for(const e of enemies)if(!e.dead&&dist(e,m)<s.rad+hR(e)){hurtE(e,m.dmg*rnd(.9,1.1),s);applyFx(e,s,m)}}}
  pend=pend.filter(m=>m.t>0);
  for(const a of arcs){a.t-=dt;if(R()<dt*30){const an=R()*6.283,d=Math.sqrt(R())*a.rad,x=a.x+Math.cos(an)*d,y=a.y+Math.sin(an)*d,an2=R()*6.283,l=rnd(20,50);
    zap({x,y,z:2},{x:x+Math.cos(an2)*l,y:y+Math.sin(an2)*l,z:2},{w:1.3,br:1,depth:1,life:.12,col:a.col,glow:a.glow,flick:false,seg:6})}}
  arcs=arcs.filter(a=>a.t>0);
  for(const l of loot){l.t+=dt;if(P.dead)continue;const d=Math.hypot(P.x-l.x,P.y-l.y);if(l.kind!=='item'&&d<110&&d>1){const k=Math.min(1,dt*(260/d));l.x+=(P.x-l.x)*k;l.y+=(P.y-l.y)*k}if(d<34)pickup(l)}
  loot=loot.filter(l=>!l.taken&&!loot25Gone(l));/* v25: 90초 (loot25.js) */
  for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.z=(p.z||0)+(p.vz||0)*dt;if(p.g){p.vz-=520*dt;if(p.z<0){p.z=0;p.vz=0}}p.vx*=.94;p.vy*=.94;if(!p.g)p.vz=(p.vz||0)*.94;p.life-=dt}
  parts=parts.filter(p=>p.life>0);if(parts.length>Q.pcap)parts.splice(0,parts.length-Q.pcap);
  for(const t of texts){t.z+=34*dt;t.life-=dt*.9}
  texts=texts.filter(t=>t.life>0);
  for(const b of bolts){if(b.delay>0){b.delay-=dt;continue}b.life-=dt}bolts=bolts.filter(b=>b.life>0);
  for(const b of beams)b.life-=dt;beams=beams.filter(b=>b.life>0);
  for(const b of pillars)b.life-=dt;pillars=pillars.filter(b=>b.life>0);
  for(const d of decals)d.life-=dt;decals=decals.filter(d=>d.life>0);
  for(const c of circles)c.life-=dt;circles=circles.filter(c=>c.life>0);
  if(banner){banner.life-=dt;if(banner.life<=0)banner=null}
  if(flash){flash.a-=dt*.8;if(flash.a<=0)flash=null}
  for(const r of rings){r.life-=dt;r.r+=(r.max-r.r)*Math.min(1,dt*12)}rings=rings.filter(r=>r.life>0);
  followCam(dt);
  shake=Math.max(0,shake-dt*30);
  saveT-=dt;if(saveT<=0){saveT=5;save()}
}
function followCam(dt){const tx=(P.x-P.y)*KI-W/2,ty=(P.x+P.y)*KI/2-H/2-10,k=dt==null?1:Math.min(1,dt*8);camX+=(tx-camX)*k;camY+=(ty-camY)*k}
let fullWarn=0;
function pickup(l){
  if(l.kind==='gold'){P.gold+=l.amt;ftext(l.x,l.y,'+'+l.amt+' 금화','#e8c35a',false,20);l.taken=true}
  else if(l.kind==='tp'){P.pot.tp=tpCount()+1;msg('귀환 두루마리를 주웠습니다 (R)','#9fd0ff');l.taken=true}
  else if(l.kind==='hp'||l.kind==='mp'){const T=l.tier>=0&&l.tier<POT_T.length?l.tier:POT_DEF;potAdd(l.kind,T,1);msg(`${potName(l.kind,T)}을 주웠습니다`,l.kind==='hp'?'#ff8a7a':'#8fb0ff');l.taken=true}
  else{if(P.bag.length>=BAG_MAX){if(time-fullWarn>4){fullWarn=time;msg('가방이 가득 찼습니다. 캐릭터 창(C)에서 정리하세요','#a39d8f')}return}
    P.bag.push(l.item);const it=l.item,better=itemScore(it)>itemScore(gearCur(it));
    msg(`${it.name} 획득${better?' (지금보다 좋음 · C)':''}`,RAR[it.rar].c);l.taken=true;if(!$('#panel').hidden)renderPanel()}
}
function usePotion(k){
  if(k==='tp'){useScroll();return}
  return drinkPotion(k);// 등급 · 지속 회복 · 재사용 대기 → shop.js
}
