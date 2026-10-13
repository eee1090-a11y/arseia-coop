/* ---------- v30 낮은 레벨 · 전사 생존 (사용자 2026-10-13 16:11) ----------
   「전사 5레벨에 첫 던전에서 몹한테 몇 대 맞으면 그냥 죽던데? 기본 방어스탯을 좀 더 주거나 피통이 원거리 직업들보다 높아야」
   원인: v29 방어력(armor29)은 「같은 레벨 일반 방어구를 다 입었을 때 = 예전 피해」에 맞춰 몬스터 피해를 ×2.5 한 뒤 방어력으로 깎는다.
     낮은 레벨은 방어구가 거의 없어(시작 방패 3) 첫 던전 늑대 한 대가 v28의 약 2~3배(전사 2%→14%, 준보스 11%→25%, 보스 7%→41%).
   · 낮은 레벨 보정: 입은 방어력이 「레벨×15(같은 레벨 일반 방어구 한 벌)」보다 적으면 모자란 만큼 채워 준다. 10레벨까지 전부, 30레벨에서 0 (사이는 직선).
   · 직업 기본 방어: 레벨마다 전사 6 · 사제 2 · 궁수 1 · 마법사 0. 입은 방어구와 더해진다(모든 레벨).
   · 전사 생명력 배수 1.35 → 1.5 (사제 1.2 · 궁수 1.1 · 마법사 1 그대로).
   · 일반 몬스터 한 대 상한: 최대 생명의 50% → 35% (보스·준보스 60% 그대로).
   (사용자 16:12 「첫 마을만이 아니라 근접인 전사 전반적으로 기본 방어력이랑 체력 버프. 몹 여러 마리한테 맞으면 근접은 금방 죽게 돼 있어」)
   · 같은 레벨 일반 방어구를 다 입은 전사가 같은 레벨 몬스터 4마리에 둘러싸여 가만히 맞을 때 30·60·100레벨에서 약 3초 만에 쓰러졌다(마법사 1.5초).
     → 모든 레벨에서: 전사 기본 방어 레벨마다 6 → 15, 생명력 배수 1.5 → 2.0, 「전사의 맷집」 몬스터 피해 일반 30% · 준보스·보스 10% 덜 받음.
     같은 조건에서 전사 약 8~9초 (사제·궁수·마법사는 그대로).
   방어구 아이템의 방어력 수치 · 감소율 공식(최대 75%) · 레벨 차이 곡선은 그대로. 저장 없음. */
const G30={per:{warrior:15,priest:2,archer:1,mage:0},grace:[10,30],full:15,bonus:0,tough:{warrior:[.7,.9]}};
function g30Tough(src){const t=G30.tough[P&&P.cls];if(!t||!src||!Number.isFinite(Number(src.lvl)))return 1;return g29Boss(src)?t[1]:t[0]}
function g30Innate(){return Math.round((G30.per[P.cls]||0)*Math.max(1,P.lvl|0))}
function g30Grace(gear){const L=Math.max(1,P.lvl|0),f=clamp((G30.grace[1]-L)/(G30.grace[1]-G30.grace[0]),0,1);return Math.max(0,Math.round(G30.full*L*f-(gear||0)))}
function g30Bonus(gear){if(gear==null)gear=g29Total();return g30Innate()+g30Grace(gear)}
{const f=g29Damage;g29Damage=function(d,src,level,armor){return G30.bonus?f.call(this,d,src,level,(Number(armor)||0)+G30.bonus):f.apply(this,arguments)}}
{const f=hitPlayer;hitPlayer=function(d,src,...rest){if(!P)return f.apply(this,arguments);const b0=G30.bonus;G30.bonus=g30Bonus();if(d>0)d*=g30Tough(src);try{return f.call(this,d,src,...rest)}finally{G30.bonus=b0}}}
if(CLASSES.warrior)CLASSES.warrior.hp=2;
G29.normalCap=.35;
{const f=charHtml;charHtml=function(){const h=f.apply(this,arguments);try{const g=g29Total(),b=g30Bonus(g);if(!b)return h;const red=Math.round(g29Reduction(g+b,P.lvl)*100),parts=[];const i=g30Innate(),gr=g30Grace(g);
  if(i)parts.push(`${CLASSES[P.cls].n} 기본 방어 +${i}`);if(gr)parts.push(`낮은 레벨 보정 +${gr}`);const tg=G30.tough[P.cls];
  return h.replace('</div><h2>능력</h2>',`<br><span class="muted">${parts.join(' · ')} → 실제 피해 감소 약 ${red}%${tg?`<br>전사의 맷집: 몬스터 피해 ${Math.round((1-tg[0])*100)}% 덜 받음 (준보스·보스 ${Math.round((1-tg[1])*100)}%)`:''}</span></div><h2>능력</h2>`)}catch(err){if(window.__QA)throw err;return h}}}
setTimeout(()=>{if(window.__game)Object.assign(window.__game,{G30,g30Bonus,g30Innate,g30Grace,g30Tough})},0);
