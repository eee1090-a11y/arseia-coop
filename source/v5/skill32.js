/* ---------- v32: 스킬 점수 한 단계씩 빼기 · 망각의 물약을 능력치용 · 스킬용 둘로 ----------
   사용자 요청(2026-10-14): 「망각의 포션을 먹지 않고도 스킬레벨을 하나씩 빼고 올리기가 가능하도록 해줘.
   그리고 망각의 포션을 스탯초기화와 스킬초기화로 구분해서 팔아줘」
   · 스킬 창의 「+1 포인트」 옆에 「−1 포인트」: 찍은 점수 1점을 그 자리에서 돌려받는다(금화 · 물약 없음).
     빼지 못하는 경우: 찍은 점수가 없음 / 처음 받은 기본기(직업 시작 기술)는 1점 아래로 / 0점이 되면 선으로 이어진 다음 마법에 점수가 있을 때.
     0점이 되면 단축칸에서 비운다(다시 찍으면 빈 칸에 다시 들어감). 지금 걸려 있는 강화는 남은 시간만큼 그대로.
   · 잡화점의 망각의 물약이 두 줄: 「능력치」(찍은 능력치만) · 「스킬」(찍은 스킬만). 값은 각각 예전 물약의 60%.
     보상으로 받는 망각의 물약(현상금 · 미궁 · 세력 상점)은 예전처럼 둘 다 되돌린다. 물약은 사자마자 마시는 것이라 저장에 남는 개수는 없다. */
const SK32={part:.6};
const sk32Price=()=>Math.round(respecPrice()*SK32.part);
function unlearnWhy(id){const s=SPELLS[id],b=(P.sk&&P.sk[id])||0;if(!s||b<=0)return '찍은 점수가 없습니다';
  if(b<=1&&(CLASSES[P.cls].start||[]).includes(id))return '처음 배운 기본기는 1점 아래로 뺄 수 없습니다';
  if(b<=1){const dep=Object.keys(PRE).filter(x=>(PRE[x]||[]).includes(id)&&P.sk[x]>0&&SPELLS[x]);if(dep.length)return `먼저 ${dep.map(x=>SPELLS[x].n).join(', ')}의 점수를 모두 빼야 합니다 (선으로 이어진 다음 마법)`}
  return ''}
function unlearnPoint(id){if(!P||unlearnWhy(id))return false;const s=SPELLS[id];P.sk[id]--;P.sp++;passT=-1;
  if(P.sk[id]<=0){delete P.sk[id];for(let i=0;i<P.bar.length;i++)if(P.bar[i]===id)P.bar[i]=null;msg(`${s.n}: 점수를 모두 돌려받았습니다 (남은 스킬 포인트 ${P.sp})`,'#c9b4ff')}
  else msg(`${s.n}: 1점을 돌려받았습니다 · 지금 ${P.sk[id]}점 (남은 스킬 포인트 ${P.sp})`,'#c9b4ff');
  P.hp=Math.min(P.hp,maxHp());P.mp=Math.min(P.mp,maxMp());buildBar();save();return true}
{const _dh=detailHtml;detailHtml=function(id){const h=_dh.apply(this,arguments);if(typeof h!=='string'||h.includes('data-unlearn'))return h;
  const i=h.indexOf(`data-learn="${id}"`);if(i<0)return h;const j=h.indexOf('</button>',i);if(j<0)return h;const why=unlearnWhy(id);
  const bt=`<button type="button" class="ghost" data-unlearn="${id}" ${why?'disabled':''} title="${why?why.replace(/"/g,'&quot;'):'찍은 점수 1점을 돌려받습니다 (물약 필요 없음)'}">−1 포인트</button>`;
  return h.slice(0,j+9)+bt+h.slice(j+9)}}
// 망각의 물약: 능력치만 / 스킬만
function respecSkills(){let pts=0;for(const k in P.sk)pts+=P.sk[k];P.sk={};P.sp+=pts;passT=-1;P.hp=Math.min(P.hp,maxHp());P.mp=Math.min(P.mp,maxMp());buildBar();
  msg(`망각의 물약(스킬): 스킬 포인트 ${P.sp}을(를) 돌려받았습니다`,'#c9b4ff')}
function respecStats(){const sk=P.sk,sp=P.sp,m=msg;msg=()=>{};try{respec()}finally{msg=m}P.sk=sk;P.sp=sp;passT=-1;P.hp=Math.min(P.hp,maxHp());P.mp=Math.min(P.mp,maxMp());buildBar();
  msg(`망각의 물약(능력치): 능력치 포인트 ${P.ap}을(를) 돌려받았습니다`,'#c9b4ff')}
{const _sh=shopHtml;shopHtml=function(){const h=_sh.apply(this,arguments);const a=h.indexOf('data-respec="1"');if(a<0)return h;
  const s=h.lastIndexOf('<div class="shoprow">',a),e=h.indexOf('</div></div>',a);if(s<0||e<0)return h;const pr=sk32Price(),ic=miscIcon('respec',26);
  const row=(k,n,d)=>`<div class="shoprow"><div>${ic}${n} <span class="muted">· ${d}</span></div><div class="btns"><button type="button" data-respec="${k}" ${P.gold<pr?'disabled':''}>마시기 ${pr}</button></div></div>`;
  return h.slice(0,s)+row('st','망각의 물약 · 능력치','찍은 능력치(힘·민첩·지능·활력·정신)만 모두 되돌려 다시 찍습니다')+row('sk','망각의 물약 · 스킬','찍은 스킬 점수만 모두 되돌려 다시 찍습니다 · 한 점씩은 스킬 창의 「−1 포인트」로 물약 없이')+h.slice(e+12)}}
// pbody는 b5.js(뒤)에서 만들어지므로 스크립트가 다 읽힌 뒤에 붙인다 (잡는 단계라 b5.js의 망각의 물약 처리보다 먼저)
queueMicrotask(()=>pbody.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled||!pbody.contains(b))return;
  if(b.dataset.unlearn){e.stopImmediatePropagation();if(unlearnPoint(b.dataset.unlearn))renderPanel();return}
  const k=b.dataset.respec;if(k==='st'||k==='sk'){e.stopImmediatePropagation();const pr=sk32Price();if(P.gold<pr)return;P.gold-=pr;(k==='st'?respecStats:respecSkills)();renderPanel();save()}},true));
