/* ---------- v57 후보 · 별이 떨어진 큰 구덩이 (가-1 끝 보스 「식은 별의 심장」 162) ----------
   · 입구: 구름 돌기둥 숲 남서쪽. 네 땅 던전 보스(미라엔 · 하르크 · 루미오르 · 바위결)를 모두 한 번씩 쓰러뜨려야 열린다(P.g100.bk · 같이 하기는 방장 기준).
   · 「식은 별의 심장」: 2~3명 협동 보스(파티 생명력은 party18.js가 다른 보스처럼 늘림). 던전 보스방 그대로.
     ① 별똥 떨어짐: 8초마다(혼자 10초) 사람 둘레에 빛 고리 3~5개 → 1.6초 뒤 떨어짐. 맞으면 내 최대 생명력의 22%(한 번에 죽지 않음 · 보스 규칙).
     ② 별 조각: 생명력 75 · 50 · 25%에 「별 조각 골렘」 둘(혼자 하나)이 깨어난다. 조각이 하나라도 있는 동안 심장은 받는 피해 −60% (빛 막이 보임).
   · 첫 처치: 칭호 「별을 식힌 자」 · 상급 상자(end22Drop 'dark' boss 10단계 몫) · 재의 결정 20. 그 뒤는 보통 보스 떨굼 + g100.js 덤.
   · 저장: P.g100.bk.b_cr1_heart (처치 수). */
const G100H={fall:8,fallSolo:10,warn:1.6,fallR:90,fallPct:.22,cuts:[.75,.5,.25],shield:.4,title:'별을 식힌 자'};
const g100CraterOpen=()=>{const s=g100S();return G100.bosses.every(k=>s.bk[k])||!!(window.__QA&&!G100H.qaLock)};/* #qa: 옛 던전 공통 시험은 열린 채로 · 잠금 시험은 qaLock */
{const _ed=enterDungeon;enterDungeon=function(c){try{const id=c&&(c.cave&&c.cave.id||c.id);if(id===G100.crater&&!NET.guest&&!g100CraterOpen()){const s=g100S(),left=G100.bosses.filter(k=>!s.bk[k]).map(k=>TYPES[k].n);
  msg(`큰 구덩이로 내려가는 길이 별빛에 막혀 있습니다 · 아직 이기지 못한 땅의 주인: ${left.join(' · ')}`,'#d8d0ff');return}}catch(e){if(window.__QA)throw e}return _ed.apply(this,arguments)}}
const G100HV={st:null};
function g100HeartSt(){const b=DG&&DG.boss;if(!b||b.k!=='b_cr1_heart'||b.dead){G100HV.st=null;return null}if(!G100HV.st||G100HV.st.b!==b)G100HV.st={b,t:3,falls:[],cut:0,shards:[]};return G100HV.st}
function g100HeartTick(dt){const S0=g100HeartSt();if(!S0||NET.guest)return;const b=S0.b;S0.shards=S0.shards.filter(e=>!e.dead&&e.hp>0&&enemies.includes(e));
  if(!b.aggroed)return;const pn=typeof PTY==='object'&&PTY.partyN?PTY.partyN():1;
  S0.t-=dt;if(S0.t<=0){S0.t=pn>1?G100H.fall:G100H.fallSolo;const tg=[P];if(NET.on&&NET.host)for(const r of NET.peers.values())if(!r.dead&&netSame(r))tg.push(r);
    for(const t of tg){const n=3+(R()<.5?1:0)+(pn>2?1:0);for(let i=0;i<n;i++){const a=R()*6.283,d=i?rnd(60,220):rnd(0,40);S0.falls.push({x:t.x+Math.cos(a)*d,y:t.y+Math.sin(a)*d,t:G100H.warn})}}}
  for(const f of S0.falls){f.t-=dt;if(f.t<=0&&!f.done){f.done=1;rings.push({x:f.x,y:f.y,r:10,max:G100H.fallR+20,life:.5,col:'#e8e0ff'});
    if(!P.dead&&Math.hypot(P.x-f.x,P.y-f.y)<G100H.fallR+P.r)hitPlayer(maxHp()*G100H.fallPct,b)}}
  S0.falls=S0.falls.filter(f=>f.t>-.3);
  const hpR=b.hp/b.max;while(S0.cut<G100H.cuts.length&&hpR<=G100H.cuts[S0.cut]){S0.cut++;const n=pn>1?2:1;for(let i=0;i<n;i++){const a=R()*6.283,e=dgMob('cr1_shard',b.x+Math.cos(a)*180,b.y+Math.sin(a)*140,b.lvl-2,{elite:true});e.aggroed=true;e.g1shard=1;S0.shards.push(e)}
    banner={t:'별 조각이 깨어났습니다',sub:'조각이 남아 있는 동안 심장은 거의 다치지 않습니다',col:'#d8d0ff',life:2.4,max:2.4}}}
{const _he=hurtE;hurtE=function(e,amt,s){if(e&&e.k==='b_cr1_heart'&&amt>0){const S0=G100HV.st;if(S0&&S0.b===e&&S0.shards.some(x=>!x.dead&&x.hp>0))amt*=G100H.shield}return _he.call(this,e,amt,s)}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(!P||paused)return r;try{if(DG)g100HeartTick(dt);else G100HV.st=null}catch(e){if(window.__QA)throw e}return r}}
{const _rk=rewardKill;rewardKill=function(e){const r=_rk.apply(this,arguments);try{if(P&&e&&e.k==='b_cr1_heart'){const s=g100S(),first=!s.bk.b_cr1_heart;s.bk.b_cr1_heart=Math.min(9999,(s.bk.b_cr1_heart|0)+1);
  if(first){if(typeof ashGain==='function')ashGain(20,e.x,e.y);if(typeof end22Drop==='function')end22Drop('dark',10,e.x,e.y,{kind:'boss',chest:1});
    banner={t:'식은 별의 심장을 쓰러뜨렸습니다',sub:`칭호 「${G100H.title}」 · 상급 상자`,col:'#e8e0ff',life:3.2,max:3.2};save()}}}catch(err){if(window.__QA)throw err}return r}}
// 그림: 떨어질 자리 · 빛 막
{const _ddf=drawDecalsFields;drawDecalsFields=function(){_ddf.apply(this,arguments);try{const S0=G100HV.st;if(!S0||!DG)return;
  for(const f of S0.falls){if(f.done)continue;const u=1-f.t/G100H.warn;ctx.globalAlpha=.25+.35*u;ctx.fillStyle='#2a2440';ctx.beginPath();ctx.ellipse(f.x,f.y,G100H.fallR*(.3+.7*u),G100H.fallR*(.3+.7*u),0,0,6.283);ctx.fill();
    ctx.globalAlpha=.8;ctx.strokeStyle='#e8e0ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,G100H.fallR,0,6.283);ctx.stroke();ctx.globalAlpha=1}}catch(e){if(window.__QA)throw e}}}
{const _de=drawEnemy;drawEnemy=function(e){const r=_de.apply(this,arguments);try{if(e&&e.k==='b_cr1_heart'&&e._s){const S0=G100HV.st;if(S0&&S0.shards.some(x=>!x.dead&&x.hp>0)){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.3+.1*Math.sin(time*4);glow(e._s.x,e._s.y-60,120,'#c8b8ff');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}}catch(err){if(window.__QA)throw err}return r}}
if(typeof V20==='object'&&V20.titles)V20.titles.push({id:'g100heart',n:G100H.title,col:'#e8e0ff',src:'식은 별의 심장 처치',have:()=>!!(P&&g100S().bk.b_cr1_heart)});
window.__g100c={G100H,G100HV,g100CraterOpen};
