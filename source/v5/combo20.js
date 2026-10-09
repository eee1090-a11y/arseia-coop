/* ---------- v20 J3 원소·상태 연계 (설계: rpg/v20-ideas/code/combos.js) ----------
   몬스터 상태끼리 이어지는 규칙 셋 + 표식 하나. 피해는 모두 「그 한 대 피해의 몇 %」를 따로 한 번 더 주는 덧셈(치명타 다시 굴리지 않음).
   불+얼음 조합은 2차 아크메이지 기술과 겹치지 않게 뺐다. 같이 하기: 저마다 제 공격의 연계를 계산하고, 손님은 피해를 netDmg로 보낸다. */
const COMBO={
  shatter:{n:'깨뜨리기',when:'얼어 있는 적을 물리 또는 대지 공격으로 맞힘',fx:'그 한 대 피해의 40%를 한 번 더 주고 얼음이 풀린다.',pct:.40,col:'#cfeeff',why:'마법사가 얼리고 전사가 깨는 연계. 혼자서는 얼린 뒤 대지 마법으로.'},
  conduct:{n:'감전 퍼짐',when:'느려진 적을 번개로 맞힘',fx:'그 한 대 피해의 30%가 120 거리 안의 다른 적 둘에게 튄다 (같은 적에서는 1초에 한 번).',pct:.30,jumps:2,range:120,icd:1,col:'#ffe066',why:'얼음으로 느리게 하고 번개로 퍼뜨리는 연계. 무리 사냥이 편해진다.'},
  fan:{n:'불길 번짐',when:'불타는 적을 바람으로 맞힘',fx:'그 적의 화상(같은 초당 피해, 3초)이 100 거리 안의 적에게 옮겨 붙는다 (같은 적에서는 2초에 한 번).',range:100,icd:2,col:'#ff9a4a',why:'불을 붙이고 바람으로 번지게. 불 화살·불 마법과 바람 마법이 이어진다.'},
  markfinish:{n:'표식 마무리',when:'내가 표식을 붙인 적이 누구에게든 쓰러짐',fx:'표식을 붙인 사람이 최대 마나 3%를 돌려받는다 (1초에 한 번).',mana:.03,icd:1,col:'#ffe39a',why:'사제·궁수가 표식을 붙이면 파티 누가 잡든 이득.'}};
const CB={mkT:0,n:{shatter:0,conduct:0,fan:0,markfinish:0}};
const cbTxtOn=()=>v20Opt('comboTxt')!==0;
function cbShow(e,k){const C=COMBO[k];CB.n[k]++;rings.push({x:e.x,y:e.y,r:6,max:(e.r||14)*3,life:.45,col:C.col});if(cbTxtOn())ftext(e.x,e.y,C.n,C.col,false,(e.r||14)*2+38)}
// 연계 피해: 치명타·피해 증가를 다시 곱하지 않고 그대로 넣는다
function cbHit(e,amt,col){if(!e||e.dead)return;amt=Math.max(1,Math.round(amt));e.hp-=amt;e.hurt=.12;e.aggroed=true;ftext(e.x,e.y,amt,col,false,(e.r||14)*2+24);
  if(NET.guest&&e.id){netDmg(e,amt,{},false);return}if(e.hp<=0&&!e.dead)killE(e)}
const cbPhys=s=>s.el==='phys'||!!s.phys||s.el==='earth';
{const _he=hurtE;hurtE=function(e,amt,s){if(!e||e.dead||!s||s.ghost||GHOST||s.proc||s.v20cb||!(s.cls===P.cls))return _he.apply(this,arguments);
  const fr=e.freezeT>0,sl=e.slowT>0,bu=e.burn&&e.burn.dps>0?e.burn.dps:0,hp0=e.hp,tk0=e.taken;
  const r=_he.apply(this,arguments);const dealt=typeof tk0==='number'&&typeof e.taken==='number'?e.taken-tk0:hp0-e.hp;if(!(dealt>0))return r;
  if(fr&&cbPhys(s)){cbShow(e,'shatter');e.freezeT=0;if(NET.guest&&e.id)v20Send('cbUnfz',{id:e.id});for(let i=0;i<10&&parts.length<Q.pcap;i++){const a=R()*6.283;parts.push({x:e.x,y:e.y,z:16,vx:Math.cos(a)*rnd(90,200),vy:Math.sin(a)*rnd(90,200),vz:rnd(40,140),life:.45,max:.45,col:'#e8f8ff',sz:2.2})}cbHit(e,dealt*COMBO.shatter.pct,COMBO.shatter.col)}
  else if(sl&&s.el==='storm'&&!(e._cbC>time)){e._cbC=time+COMBO.conduct.icd;const C=COMBO.conduct,ts=enemies.filter(o=>o!==e&&!o.dead&&dist(o,e)<C.range+(o.r||0)).sort((a,b)=>dist(a,e)-dist(b,e)).slice(0,C.jumps);
    if(ts.length){cbShow(e,'conduct');for(const o of ts){zap({x:e.x,y:e.y},{x:o.x,y:o.y},{life:.22,col:C.col,w:2});cbHit(o,dealt*C.pct,C.col)}}}
  else if(bu&&s.el==='wind'&&!(e._cbF>time)){e._cbF=time+COMBO.fan.icd;const C=COMBO.fan,ts=enemies.filter(o=>o!==e&&!o.dead&&dist(o,e)<C.range+(o.r||0));
    if(ts.length){cbShow(e,'fan');const ids=[];for(const o of ts){o.burn={t:3,dps:bu};o.aggroed=true;if(o.id)ids.push(o.id);for(let i=0;i<4&&parts.length<Q.pcap;i++)parts.push({x:o.x+rnd(-8,8),y:o.y+rnd(-6,6),z:rnd(4,20),vx:0,vy:0,vz:50,life:.5,max:.5,col:'#ff7a2e',sz:2.6})}if(NET.guest&&ids.length)v20Send('cbBurn',{ids,dps:bu})}}
  return r}}
V20NET.cbUnfz=m=>{if(!NET.host)return;const e=enemies.find(o=>o.id===m.id);if(e)e.freezeT=0};
V20NET.cbBurn=m=>{if(!NET.host||!Array.isArray(m.ids))return;const d=Math.max(0,Math.min(+m.dps||0,1e6));for(const e of enemies)if(m.ids.includes(e.id)&&!e.dead)e.burn={t:3,dps:d}};
// 표식 마무리: 내가 건 표식이 있는 적이 쓰러지면 (누가 잡든) 마나 3%
{const _af=applyFx;applyFx=function(e,s,from){const r=_af.apply(this,arguments);if(e&&!e.dead&&s&&s.mark&&!GHOST&&s.cls===P.cls&&(!from||from===P))e._mkT=time+(s.mark.dur||5);return r}}
{const _kf=killFx;killFx=function(e){_kf.apply(this,arguments);if(!e||!P||P.dead||GHOST)return;if(!(e._mkT>time)||!(e.markT>0||e._mkT>time))return;if(CB.mkT>time)return;CB.mkT=time+COMBO.markfinish.icd;
  const g=maxMp()*COMBO.markfinish.mana;P.mp=Math.min(maxMp(),P.mp+g);cbShow(e,'markfinish');rings.push({x:P.x,y:P.y,r:6,max:46,life:.4,col:'#8fd8ff'});if(cbTxtOn())ftext(P.x,P.y,'+'+Math.round(g)+' 마나','#8fd8ff',false,60)}}
// 도감 「연계」 칸 (글씨 끄기 설정 포함)
V20.cx.push({k:'combos',n:'연계',html(){let h=`<p class="muted" style="margin-top:0">몬스터의 상태끼리 이어지는 연계입니다. 파티로 하면 더 쉽지만 혼자서도 됩니다. 연계 피해는 그 한 대 피해에 덧셈으로 붙습니다.</p>`;
  for(const k in COMBO){const C=COMBO[k];h+=`<div class="v20box"><h3 style="color:${C.col}">${C.n}</h3><div><b>언제</b> ${C.when}</div><div><b>무엇</b> ${C.fx}</div><div class="muted" style="font-size:12px">${C.why}</div></div>`}
  h+=`<div class="v20row"><div>적 위에 연계 이름 글씨 <span class="muted">(이 기기에만 저장 · 휴대폰에서 화면을 덜 가리게)</span></div><div class="btns">${v20Btn('cbtxt','',cbTxtOn()?'글씨 끄기':'글씨 켜기')}</div></div>`;return h}});
V20A.cbtxt=()=>{v20Opt('comboTxt',cbTxtOn()?0:1)};
window.__v20=window.__v20||{};Object.assign(window.__v20,{COMBO,CB,cbHit,cbTxtOn});
