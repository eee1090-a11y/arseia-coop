/* ---------- v23 스킬 창: 모든 탭의 「+」 · 스킬 설명 띄우기 (사용자 2026-10-09 15:09) ----------
   · v18의 「+」(keys.js kbTreeExtras)는 1차 트리 HTML에만 붙어서, 나중에 생긴 상위 기술 · 2차 · 3차 탭에는 없었다.
     이제 창을 그린 뒤 고른 아이콘 옆에 「+」가 없으면 붙인다(1차 트리는 예전 것 그대로). 누르면 같은 data-learn 길로 1점.
     못 찍으면 막힌 모양 + 누르면 까닭(창 아래 설명의 조건 글과 같음).
   · 스킬 트리 아이콘 · 아래 단축칸(dock)에 마우스를 올리면 설명 상자. 휴대폰은 누르면 뜨고(고르기 · 「+」는 그대로 됨) 4초 뒤나 다른 곳을 누르면 닫힘.
     설명 상자는 pointer-events:none이라 「+」나 다른 단추를 가리지 않는다.
   · 규칙 · 숫자 · 저장은 바꾸지 않는다. */
const SK23={tip:null,cur:null,pt:'mouse',tapId:null,tapT:0,hideT:0};
const sk23Max=id=>typeof skMax==='function'?skMax(id):MAXSK;
const sk23Lv=id=>typeof skShow==='function'?skShow(id):skLv(id);
const sk23Tier=s=>s.job3?'3차 전직':s.job2?'2차 전직':s.tab==='adv'?'상위 기술':(CLASSES[P.cls]&&CLASSES[P.cls].rankN?CLASSES[P.cls].rankN(s.rank):'');
// 못 찍는 까닭: 1차는 kbLearnWhy, 그 밖에는 창 아래 설명의 조건 글
function sk23Why(id){if(canLearn(id))return '';const base=P.sk[id]||0;
  if(base>=sk23Max(id))return `최대 ${sk23Max(id)}점까지 찍었습니다`;if(P.sp<=0)return '남은 스킬 포인트가 없습니다';
  const r=pbody.querySelector('.detail .req:not(.ok)');const t=r&&r.textContent.trim();if(t)return t;
  const k=typeof kbLearnWhy==='function'?kbLearnWhy(id):'';return k||'지금은 찍을 수 없습니다'}
function sk23Plus(){if(!P||panel.hidden||tab!=='tree')return;const id=nodeSel,s=id&&SPELLS[id];if(!s)return;
  if(pbody.querySelector(`.nodeplus[data-learn="${id}"]`))return;
  const n=pbody.querySelector(`[data-node="${id}"]`);if(!n||!n.parentElement)return;const par=n.parentElement;
  if(getComputedStyle(par).position==='static')par.style.position='relative';
  const why=sk23Why(id),b=document.createElement('button');b.type='button';b.className='nodeplus sk23plus';b.dataset.learn=id;b.dataset.why=why;
  b.setAttribute('aria-disabled',String(!!why));b.setAttribute('aria-label',`${s.n}에 1점 찍기`);b.title=why||`${s.n}에 1점 찍기 (남은 ${P.sp}점)`;b.textContent='+';
  const row=n.offsetWidth>n.offsetHeight*1.6,sz=document.body.classList.contains('m22')?32:24;
  b.style.left=Math.round(row?n.offsetLeft+n.offsetWidth-sz-6:n.offsetLeft+n.offsetWidth-sz/2-2)+'px';
  b.style.top=Math.round(row?n.offsetTop+(n.offsetHeight-sz)/2:Math.max(2,n.offsetTop-9))+'px';n.after(b)}
{const _rp=renderPanel;renderPanel=function(){const r=_rp.apply(this,arguments);try{sk23Plus();sk23TapShow()}catch(e){if(window.__QA)throw e}return r}}
// 설명 상자
function sk23El(){let el=SK23.tip;if(el&&el.isConnected)return el;el=SK23.tip=document.createElement('div');el.id='sktip';el.hidden=true;el.setAttribute('role','tooltip');document.body.appendChild(el);return el}
function sk23TipHtml(id){const s=SPELLS[id];if(!s)return '';const L=sk23Lv(id),mx=sk23Max(id),ci=typeof castInfo==='function'?castInfo(id,Math.max(1,skLv(id))):'';
  let h=`<div class="st-n">${s.n}${s.en?` <i>${s.en}</i>`:''}</div><div class="st-s">${[sk23Tier(s),KINDN[s.kind],ELN[s.el],s.kind==='passive'?'':`재사용 ${Math.round(cdOf(id)*100)/100}초`,ci].filter(Boolean).join(' · ')}</div>`;
  h+=`<div class="st-d">${s.desc||''}</div><div class="st-l">스킬 레벨 <b>${L}</b> / ${mx}${P.sk[id]?'':' · 아직 안 배움'}</div>`;
  try{const cur=numsAt(id,Math.max(1,skLv(id))).slice(0,s.kind==='passive'||(typeof TIP25==='object'&&TIP25.DEF.includes(s.kind))?4:3);if(cur.length)h+=`<div class="st-x">${cur.map(([k,v])=>`${k} <b>${v}</b>`).join(' · ')}</div>`}catch(_){}
  const why=P.sk[id]>=mx?'':sk23Why(id);if(why&&SK23.cur&&SK23.cur.closest&&SK23.cur.closest('#pbody .tree, #pbody [data-node]'))h+=`<div class="st-w">${why}</div>`;
  return h}
function sk23Show(t,id){if(!t||!SPELLS[id])return sk23Hide();const el=sk23El();SK23.cur=t;el.innerHTML=sk23TipHtml(id);el.hidden=false;
  const r=t.getBoundingClientRect(),w=el.offsetWidth,h=el.offsetHeight,vw=window.innerWidth,vh=window.innerHeight,m=8;
  // 아래에, 모자라면 위에(「+」는 아이콘 위쪽 오른편이라 아래로 띄우면 안 가림 · 어차피 누르기는 통과)
  let x=Math.min(Math.max(m,r.left),Math.max(m,vw-m-w)),y=r.bottom+6;if(y+h>vh-m)y=r.top-h-14;if(y<m)y=Math.max(m,Math.min(vh-m-h,r.top));
  el.style.left=Math.round(x)+'px';el.style.top=Math.round(y)+'px';SK23.id=id;clearTimeout(SK23.hideT);if(SK23.pt!=='mouse')SK23.hideT=setTimeout(sk23Hide,4000)}
function sk23Hide(){if(SK23.tip)SK23.tip.hidden=true;SK23.cur=null;SK23.id=null;clearTimeout(SK23.hideT)}
const sk23IdOf=t=>{if(!t)return null;if(t.dataset.node)return t.dataset.node;const k=t.dataset.dock!=null?t.dataset.dock:t.dataset.slot;if(k!=null){const id=P&&P.bar[+k];return id&&SPELLS[id]?id:null}return null};
// v24(사용자 05:21): 화면 아래 단축칸에 마우스를 올려도 같은 설명 상자 (마우스만 · 휴대폰 단축칸은 누르면 바로 시전되므로 스킬 창 아래 칸을 눌러 봄)
const sk23BarTgt=e=>e.target&&e.target.closest&&e.target.closest('#bar button[data-slot]');
const sk23Tgt=e=>e.target&&e.target.closest&&e.target.closest('#pbody [data-node], #pbody [data-dock]');
document.addEventListener('pointerover',e=>{SK23.pt=e.pointerType||'mouse';if(SK23.pt!=='mouse')return;const t=sk23Tgt(e)||sk23BarTgt(e);if(t===SK23.cur)return;if(!t){if(SK23.cur)sk23Hide();return}const id=sk23IdOf(t);if(id)sk23Show(t,id);else sk23Hide()});
document.addEventListener('pointerdown',e=>{SK23.pt=e.pointerType||'mouse';if(SK23.pt==='mouse')return;const t=sk23Tgt(e);if(!t)sk23Hide()},true);
// 휴대폰: 누르면 그 자리에 설명 (아이콘을 누르면 창이 다시 그려지므로 그린 뒤 새 아이콘에 붙인다)
document.addEventListener('click',e=>{if(SK23.pt==='mouse')return;const t=sk23Tgt(e);if(!t)return;const id=sk23IdOf(t);if(!id)return;SK23.tapId=t.dataset.node?'n:'+t.dataset.node:'d:'+t.dataset.dock;SK23.tapT=performance.now();
  setTimeout(()=>{if(SK23.tapId)sk23TapShow()},0)},true);
function sk23TapShow(){const k=SK23.tapId;if(!k||performance.now()-SK23.tapT>600)return;SK23.tapId=null;if(panel.hidden)return;
  const t=pbody.querySelector(k[0]==='n'?`[data-node="${k.slice(2)}"]`:`[data-dock="${k.slice(2)}"]`);const id=sk23IdOf(t);if(t&&id)sk23Show(t,id)}
{const _cp=closePanel;closePanel=function(){sk23Hide();return _cp.apply(this,arguments)}}
{const _rp=renderPanel;renderPanel=function(){const keep=SK23.cur&&SK23.pt==='mouse';const r=_rp.apply(this,arguments);if(keep&&SK23.cur&&!SK23.cur.isConnected)sk23Hide();return r}}
setTimeout(()=>{try{pbody.addEventListener('scroll',()=>{if(SK23.pt!=='mouse')sk23Hide()},true)}catch(_){}},0);
{const st=document.createElement('style');st.textContent=`#pbody .nodeplus.sk23plus{position:absolute;z-index:3;width:24px;height:24px;border-radius:50%;padding:0;border:1px solid #d6b262;background:#3a2c12;color:#ffe7a8;font-size:17px;font-weight:700;line-height:20px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,.8);min-width:0;min-height:0}
#pbody .nodeplus.sk23plus:hover{background:#5a4418}#pbody .nodeplus.sk23plus[aria-disabled="true"]{border-color:#5a4a36;background:#1e1a14;color:#6e624e;cursor:not-allowed}
body.m22 #pbody .nodeplus{width:32px!important;height:32px!important;font-size:21px!important;line-height:28px!important}
#sktip{position:fixed;z-index:9999;left:0;top:0;width:max-content;max-width:min(300px,calc(100vw - 16px));box-sizing:border-box;background:rgba(18,14,10,.97);border:1px solid #7a6236;border-radius:6px;padding:8px 10px;font-size:12.5px;line-height:1.45;color:#e8e2d2;box-shadow:0 4px 18px rgba(0,0,0,.65);pointer-events:none}
#sktip .st-n{font-size:14px;font-weight:700;color:#ffe2a0}#sktip .st-n i{font-weight:400;font-size:11px;color:#a39d8f}#sktip .st-s{font-size:11.5px;color:#c9b07a;margin:1px 0 4px}
#sktip .st-d{margin-bottom:4px}#sktip .st-l b{color:#ffd76a}#sktip .st-x{color:#cfc6b2;font-size:12px}#sktip .st-x b{color:#fff}#sktip .st-w{margin-top:4px;color:#e0a070;font-size:12px}`;document.head.appendChild(st)}
window.__sk23={SK23,sk23Plus,sk23Why,sk23Show,sk23Hide,sk23TipHtml};
// v24: 단축칸을 다시 그리면(배우기 · 칸 바꾸기) 같은 칸의 새 단추에 설명 상자를 다시 붙이거나 닫는다
{const _bb=buildBar;buildBar=function(){const r=_bb.apply(this,arguments);try{const c=SK23.cur;if(c&&!c.isConnected&&c.dataset&&c.dataset.slot!=null){const n=document.querySelector(`#bar button[data-slot="${c.dataset.slot}"]`),id=sk23IdOf(n);if(n&&id)sk23Show(n,id);else sk23Hide()}}catch(e){if(window.__QA)throw e}return r}}
