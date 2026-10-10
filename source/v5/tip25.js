/* ---------- v25 방어 기술 설명 · 스킬 창 탭의 차수 (사용자 2026-10-10 08:53) ----------
   「갑옷류 스킬 설명은 피해를 흡수 또는 줄여 준다고 되어 있는데 실제 수치나 효과가 툴팁에 제대로 안 나온 것이 있는지」
   「상위 기술 / 원소 → 얘네 [2차] 이런 식으로. 2차인지 눌러 보기 전까지는 모르니까」
   · 갑옷(플레임 맨틀 · 프로스트 아머 · 스파이크드 가드): 「받는 피해 감소」가 아예 없었다 → 실제 값(b3.js armor.red: 기본 × (1 + 2% × 레벨 단계), 최대 60%).
     「피해」는 쓸 때 터지는 피해처럼 보였다 → 「나를 때린 적에게 (맞을 때마다)」, 실제로 들어가는 60%(b3.js hitPlayer)로.
   · 보호막: 흡수량만 있고 「지속」이 빠져 있었다(보호막은 스킬 레벨로 지속이 늘지 않음 · b3.js P.shieldT=s.dur).
   · 무적(스톤 스킨 · 워터 폼 · 언터처블 라이트): 「받는 피해 없음」 줄, 워터 폼은 「생명력 회복」(최대 생명력 × 비율 × 지원 배율).
   · 받는 피해가 늘어나는 강화(레드 미스트 · 블러드 프렌지): 「받는 피해 감소 −16%」 → 「받는 피해 증가 +16%」. 블러드 프렌지는 「준 피해의 생명력 흡수」.
   · 엘리멘탈 배리어: 맞으면 마지막 원소로 태움 · 얼림 · 감전.
   · 설명 상자는 방어 기술이면 넉 줄까지 보인다(대상 다음에 흡수 · 감소 · 지속이 오도록).
   · 탭: 상위 기술 · 2차 갈래 탭 끝에 [2차], 3차 갈래 탭 끝에 [3차] (모든 직업). 1차 갈래 탭은 그대로.
   · 규칙 · 숫자 · 저장은 바꾸지 않는다. 보여 주기만. */
const TIP25={DEF:['armor','shield','invuln','ward','buff']};
const tip25Num=t=>{const m=String(t).match(/-?[\d.]+/g);return m?m.map(Number):[]};
{const _na=numsAt;numsAt=function(id,L){const rows=_na(id,L),s0=SPELLS[id];if(!s0)return rows;const s=eff(id,L);
  const at=k=>rows.findIndex(r=>r[0]===k),put=(i,r)=>{rows.splice(Math.max(0,i),0,r)},after0=()=>rows[0]&&rows[0][0]==='대상'?1:0;
  if(s0.kind==='armor'){const red=Math.min(.6,s0.red*(1+.02*lvSteps(Math.max(1,L))));const i=at('피해');
    if(i>=0){const n=tip25Num(rows[i][1]),mid=n.length>=2?(n[0]+n[1])/2:n[0]||0;rows[i]=['나를 때린 적에게 (맞을 때마다)',String(Math.round(mid*.6))+(s0.burn?' · 불태움':'')]}
    put(after0(),['받는 피해 감소',`${Math.round(red*1000)/10}%`+(red>=.6?' (최대)':'')])}
  if(s0.kind==='shield'&&s.dur&&at('지속')<0){const i=at('흡수');put(i>=0?i+1:rows.length-1,['지속',s.dur+'초'])}
  if(s0.kind==='shield'&&s0.retort)rows.splice(Math.max(0,at('마나')),0,['나를 때린 적','마지막 원소로 태움 · 얼림 · 감전']);
  if(s0.kind==='invuln'){put(after0(),['받는 피해','없음 (무적)']);if(s.heal){const i=at('지속');put(i>=0?i+1:rows.length-1,['생명력 회복',`최대 생명력의 ${Math.round(s.heal*supScale(Math.max(1,L))*1000)/10}%`])}}
  if(s0.kind==='buff'){const i=at('받는 피해 감소');if(i>=0&&s.dr<0)rows[i]=['받는 피해 증가',`+${Math.round(-s.dr*100)}%`];
    if(s.ls)rows.splice(Math.max(0,at('지속')),0,['준 피해의 생명력 흡수',`${Math.round(s.ls*1000)/10}%`])}
  return rows}}
// 스킬 창 탭: 차수 붙이기
function tip25Tabs(){if(!P||panel.hidden||tab!=='tree')return;
  for(const b of pbody.querySelectorAll('button[data-j2tab]')){if(b.querySelector('.tier25'))continue;const k=b.dataset.j2tab,lab=k==='j3'?'3차':'2차';
    if(k==='j3'&&!P.job3)continue;// 잠긴 3차 탭은 이미 「3차 전직」
    const sp=document.createElement('span');sp.className='tier25';sp.textContent=` [${lab}]`;const m=b.querySelector('.muted');b.insertBefore(sp,m||null)}}
{const _rp=renderPanel;renderPanel=function(){const r=_rp.apply(this,arguments);try{tip25Tabs()}catch(e){if(window.__QA)throw e}return r}}
{const st=document.createElement('style');st.textContent='#pbody button[data-j2tab] .tier25{color:#ffd76a;font-weight:700;font-size:.92em}';document.head.appendChild(st)}
window.__tip25={TIP25,tip25Tabs};
