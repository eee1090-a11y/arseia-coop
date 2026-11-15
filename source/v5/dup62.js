/* ---------- v62 장비 옵션 겹침 없애기 (사용자 2026-11-15 「아이템마다 주능력치가 붙었으면 별개로 붙는 주능력치는 없어야지. 체력도 마찬가지고.
   주능력치가 붙어있는데 밑에 별도로 지능이 붙어있으면 아무 의미가 없잖아 … 지금 싹다 고쳐」) ----------
   v57부터 모든 장비에 기본 두 줄(주 능력치 pri · 생명력 hp)이 붙는다(gear57.js). 그런데 무작위 옵션으로 또 지능(전사 힘 · 궁수 민첩)이나 생명력이 붙어
   「+5 주 능력치(지능) · … · +30 지능」처럼 같은 능력치가 두 줄로 보였다.
   · 새 장비(드랍 · 상점 · 보상 · 모자 · 세트 · 엔드 세트 · 오르타 다시 굴리기): 무작위로 붙은 주 능력치 · 생명력 옵션은 그 자리에 다른 무작위 옵션을 붙인다
     (같은 장비 레벨 · 같은 직업 옵션 목록에서, 이미 있는 옵션 · 주 능력치 · 생명력 · 모든 마법 · 계열 · (세트는) 개별 스킬 빼고). 옵션 줄 수는 그대로.
   · 장비가 원래 갖는 능력치(지팡이의 지능 · 갑옷/로브/모자의 생명력 · 유니크/상급 유니크/핵의 정해진 수치)는 그대로 두고,
     화면에는 기본 줄과 합쳐 한 줄로 보인다(「+35 주 능력치(지능)」). 재련 · 각성은 원래 값을 그대로 본다.
   · 이미 가진 장비(옛 저장 · 창고): 값은 하나도 바꾸지 않는다(지우거나 줄이지 않음). 화면에서 겹치던 줄을 주 능력치 한 줄로 합쳐 보여 준다.
     효과는 원래도 합쳐져 있었으므로(gearStats) 힘은 그대로.
   · 마법 부여(ench36.js): 주 능력치 · 생명력은 고를 수 없게. 이미 부여된 것은 그대로 효과가 있고, 줄 이름은 「주 능력치」로 보인다.
   저장: 새 장비에 표시 p62=1 하나만 더해진다. 캐릭터 키는 건드리지 않는다. */
const DUP62={ver:1};
const g62Mains=it=>it.wt&&typeof MAIN_V18==='object'&&MAIN_V18[it.wt]?MAIN_V18[it.wt]:SLOT[it.slot]&&SLOT[it.slot].main?[SLOT[it.slot].main]:[];
// 장비가 원래 갖는 능력치(무작위가 아닌 것). null = 모두 정해진 수치(유니크 · 상급 유니크 · 핵 · 이름 목걸이)
function g62Fixed(it){if(!it||it.rar>=4||it.core||it.nameu)return null;const d=new Set(g62Mains(it));const S=it.set&&SETS[it.set];if(S&&S.key)d.add(S.key);return d}
// 이 장비에서 겹치는 무작위 옵션 키들 (주 능력치 = 장비 직업의 주 능력치, 생명력)
function g62Dups(it){if(!it||!it.stats)return[];const D=g62Fixed(it);if(!D)return[];const mk=g57Main(it.cls||(P&&P.cls));return[mk,'hp'].filter(k=>k in it.stats&&!D.has(k))}
const G62_CAP={cdr:25,mcost:30,ias:20};
function g62New(it){if(!it||typeof it!=='object'||!it.stats||it.b57||it.p62)return it;it.p62=DUP62.ver;const bad=g62Dups(it);if(!bad.length)return it;
  const cls=it.cls||P.cls,mk=g57Main(cls),phys=!!PHYS_CLS[cls],il=clamp(Math.round(Number(it.il)||1),1,MAXLV+3);
  const pool=(phys?affixPoolV18:affixPool)(il,cls),no=k=>k===mk||k==='hp'||k==='pri'||k==='all'||/^tr_/.test(k)||(it.rar===3&&/^sk_/.test(k))||k in it.stats;
  for(const k of bad){delete it.stats[k];const c=pool.filter(x=>!no(x));if(!c.length)continue;const nk=pick(c);let v=phys?rollStat(nk,il,it.wt):rollStat(nk,il);
    v=Math.round(v*10)/10;if(G62_CAP[nk])v=Math.min(it.rar===3&&nk==='mcost'?25:G62_CAP[nk],v);it.stats[nk]=v}
  return it}
// 모자는 makeItem 안에서도 · 따로도 만들어진다
if(typeof makeHat==='function'){const _h=makeHat;makeHat=function(){return g62New(_h.apply(this,arguments))}}
// 엔드 세트 조각은 makeItem을 거치지 않는다
if(typeof e22MakeSet==='function'){const _f=e22MakeSet;e22MakeSet=function(){const it=_f.apply(this,arguments);return it&&!it.b57?g62New(it):it}}
// 화면: 보는 캐릭터의 주 능력치 줄을 「주 능력치」 한 줄로 합친다 (값은 장비 안에 그대로)
{const _sv=statView;statView=function(it){if(it&&it.stats&&!it.b57)g57Ensure(it);/* 옛 장비도 기본 두 줄을 먼저 (itemRow와 같음) */const e=_sv.apply(this,arguments),st=it&&it.stats;if(!st||!('pri' in st))return e;const vm=g57Main(P&&P.cls);if(!(vm in st))return e;
  const sum=Math.round(((+st.pri||0)+(+st[vm]||0))*10)/10;return e.filter(([k])=>k!==vm).map(([k,v])=>k==='pri'?[k,sum]:[k,v])}}
// 재련 · 별빛 · 마법 부여 줄: 주 능력치 이름으로
{const _rl=rfLine;rfLine=function(it){const h=_rl.apply(this,arguments);if(!h)return h;const n=statName(g57Main(P&&P.cls)),pn=statName('pri');
  return h.replace(new RegExp(`(\\+[\\d.]+ )${n}(?=<|$| ·)|(: |· )${n}( \\+)`,'g'),(m,a,b,c)=>a!=null?a+pn:b+pn+c)}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{DUP62,g62New,g62Dups,g62Fixed})}catch(_){}},0);
