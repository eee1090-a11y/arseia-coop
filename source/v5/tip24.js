/* ---------- v24 스킬 설명 점검 (사용자 2026-10-10 06:47) ----------
   「패시브에 재사용이 붙어 있다」 「앰플리파이드 그레이스는 20레벨에 +15%만 나오고 레벨마다 얼마나 오르는지 안 나온다」
   · 패시브: 스킬 창 설명 윗줄의 「재사용 0초」를 뺀다(설명 상자는 이미 뺐음). 마나 줄도 없음.
   · 패시브 수치: 모든 패시브 값(pv)을 이름 · 단위와 함께 보인다. 예전에는 마법사 · 사제의 2차 · 3차 패시브가 「늘 켜짐」만,
     전사 · 궁수 2차 · 3차는 영어 이름(threat · blkMp …)에 단위가 틀린 값(막을 때 마나 +720%, 덫 수 +100%)이 나왔다.
   · 「레벨마다」(3차는 「1점마다」) 줄: 지금 레벨에서 한 단계 올리면 오르는 양(20레벨을 장비로 넘기면 그 위는 절반씩이라 그만큼 작게 보임).
   · 작은 값은 소수 한 자리까지(예: 피해 +5% → +5.3%), 그래서 지금 · 다음 레벨 칸이 같은 숫자로 보이지 않는다.
   · 규칙 · 숫자 · 저장은 바꾸지 않는다. 보여 주기만. */
const TIP24={
  PCT:{blk:'막기 확률',crit:'치명타 확률',pdmg:'물리 피해',hp:'최대 생명력',dr:'받는 피해 감소',spd:'이동 속도',dmg:'피해 증가',elArrow:'원소 화살 피해',eva:'회피',
    reson:'공명 한 겹마다 피해',bossDmg:'준보스 · 보스에게 피해',holyDmg:'심판 · 퇴마 · 대심문관 기도 피해',hitHeal:'맞히면 생명력 회복(최대 생명력의)',healAmp:'치유량 · 보호막량',
    threat:'위협',lowIas:'공격 속도(생명력 30% 이하에서 최대)',range:'화살 사거리',farCrit:'먼 적 치명타 확률(500 거리에서 최대)',trapDmg:'덫 피해',
    j3castCut:'금기 마법 외우는 시간 감소',brandDmg:'낙인 찍힌 적에게 피해',stigma:'치유 증가(생명력이 바닥일 때 최대)',critDmg:'치명타 피해',breathCrit:'호흡 하나마다 치명타 확률'},
  FLAT:{acc:['명중',''],regen:['초당 마나 회복',''],ls:['생명력 흡수','%'],petRegen:['소환수 하나마다 초당 마나 회복',''],blessRegen:['축복 걸린 파티원 한 명마다 초당 마나 회복',''],
    blkMp:['막을 때마다 마나',''],trapN:['덫마다 동시에 놓는 수','개'],resonMax:['원소 공명 최대 겹',''],petKinds:['함께 부르는 소환수 종류','종'],brandDur:['낙인 지속','초']},
  PET:{mage:['소환수 피해','소환수 생명력'],archer:['사냥 동료 피해','사냥 동료 생명력']}};
const tip24R1=v=>Math.abs(v)<1?Math.round(v*100)/100:Math.round(v*10)/10;// 1보다 작은 값은 소수 두 자리(레벨마다 +0.06% 같은 것)
function tip24Row(cls,k,v){const F=TIP24.FLAT[k];if(F)return [F[0],`+${tip24R1(v)}${F[1]}`];
  let n=TIP24.PCT[k];if(k==='petDmg'||k==='petHp'){const p=TIP24.PET[cls]||TIP24.PET.mage;n=p[k==='petDmg'?0:1]}if(k==='dmg'&&cls==='mage')n='마법 피해';
  if(!n)n=k;return [n,`${k==='j3castCut'?'-':'+'}${tip24R1(v*100)}%`]}
// 한 단계(1차 · 2차 = 1레벨, 3차 = 1점)마다 오르는 양
const tip24Step=id=>{const s=SPELLS[id];return s&&s.job3&&typeof J3K==='function'?J3K(s.cls):1};
function tip24Per(id,L){const s=SPELLS[id],a=eff(id,L),b=eff(id,L+tip24Step(id)),parts=[];
  for(const k in s.pv){const d=b[k]-a[k];if(!(d>1e-9))continue;const r=tip24Row(s.cls,k,d);parts.push((Object.keys(s.pv).length>1?r[0]+' ':'')+r[1])}
  return parts.length?[s.job3?'1점마다':'레벨마다',parts.join(' · ')]:null}
{const _na=numsAt;numsAt=function(id,L){const s0=SPELLS[id];if(!s0||s0.kind!=='passive'||!s0.pv)return _na(id,L);
  const s=eff(id,L),rows=[];for(const k in s0.pv)rows.push(tip24Row(s0.cls,k,s[k]));const per=tip24Per(id,Math.max(1,L));if(per)rows.push(per);
  if(s0.wt&&typeof WT_REQN==='object')rows.push(['필요한 무기',WT_REQN[s0.wt]]);rows.push(['상태','늘 켜짐']);return rows}}
// 패시브는 재사용 대기시간이 없다: 스킬 창 윗줄에서 뺀다
{const _dh=detailHtml;detailHtml=function(id){const h=_dh(id),s=SPELLS[id];if(!s||s.kind!=='passive')return h;
  return h.replace(/(<div class="sub">[\s\S]*?)\s·\s재사용 [\d.]+초([\s\S]*?<\/div>)/,'$1$2')}}
window.__tip24={TIP24,tip24Row,tip24Per};
