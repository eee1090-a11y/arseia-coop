/* ---------- v26 휴대폰 세로 단축창 (사용자 2026-10-10 13:17) ----------
   「모바일에서는 스킬단축창을 계열별로 분리할 수 있도록 해줘. 특정 계열의 스킬들은 오른쪽 가에 세로로 놓을 수 있게 한다든지 하는.」
   · 휴대폰(M22.phone())에서만. 「설정 ⚙」 목록에 「오른쪽 세로 단축창」: 직업의 계열(스킬 트리 갈래) · 2차 · 3차 가운데 고른 것을
     단축바에서 빼 화면 오른쪽 가에 세로로 놓는다. 아무것도 안 고르면 예전 그대로.
   · 칸(P.bar)은 그대로이고 보이는 자리만 바뀐다: 버튼은 #bar 안에 남은 채 position:fixed로 오른쪽 가에 선다
     (누르기 · 꾹 눌러 모으기 · 재사용 대기 · 설명 띄우기가 #bar에 묶여 있어 그대로 돈다).
   · 자리: 오른쪽 위 작은 지도 칸(.rightcol) 아래 ~ 마나 구슬(.orb.mp) 위 사이 가운데, 한 줄에 가로 화면 4칸 · 세로 화면 6칸까지(넘치면 왼쪽에 한 줄 더). 의뢰 칸은 그만큼 왼쪽으로.
   · 저장: 캐릭터마다 side26(고른 계열 이름 목록) — 없으면 빈 목록(예전 그대로). 캐릭터 키를 지우거나 비우지 않는다. */
const S26={GAP:4,MAX:44,MIN:36,PER:4,PMAX:6};
// 스킬의 계열: 't0'..(스킬 트리 갈래) · 'j2' 2차 · 'j3' 3차 · 'etc'
function s26Cat(id){const s=SPELLS[id];if(!s)return null;if(s.job3)return 'j3';if(s.job2)return 'j2';const t=TREE[id];return t!=null?'t'+t:'etc'}
function s26Name(k){if(k==='j3')return '3차';if(k==='j2')return '2차';if(k==='etc')return '그 밖';const C=P&&CLASSES[P.cls];return (C&&C.trees[+k.slice(1)])||k}
// 이 직업에서 고를 수 있는 계열(트리 갈래 + 전직한 차수 + 단축바에 있는 그 밖)
function s26Cats(){if(!P||!P.cls)return[];const C=CLASSES[P.cls],out=C.trees.map((_,i)=>'t'+i);if(P.job2)out.push('j2');if(P.job3)out.push('j3');
  if((P.bar||[]).some(id=>id&&s26Cat(id)==='etc'))out.push('etc');return out}
function s26Clean(a){return Array.isArray(a)?[...new Set(a.filter(k=>typeof k==='string'&&/^(t\d|j2|j3|etc)$/.test(k)))]:[]}
function s26Sel(){if(!P)return[];if(!Array.isArray(P.side26))P.side26=[];return P.side26}
function s26On(){return typeof M22==='object'&&M22.phone()&&s26Sel().length>0}
function s26Toggle(k){const a=s26Sel(),i=a.indexOf(k);if(i>=0)a.splice(i,1);else a.push(k);buildBar();save()}
// 버튼 자리 잡기
function s26Lay(){const bar=document.getElementById('bar');if(!bar)return;const btns=[...bar.querySelectorAll('button.sk[data-slot]')];
  const on=s26On(),set=new Set(on?s26Sel():[]),side=[];
  for(const b of btns){const id=P&&P.bar[+b.dataset.slot],me=on&&!!id&&set.has(s26Cat(id));b.classList.toggle('s26',me);if(me)side.push(b);else{b.style.left='';b.style.top='';b.style.width='';b.style.height=''}}
  const body=document.body;body.classList.toggle('s26on',side.length>0);if(!side.length){body.style.removeProperty('--s26w');return}
  const q=s=>{const e=document.querySelector(s);return e&&e.offsetParent!==null?e.getBoundingClientRect():null};
  const tp=q('#hud .rightcol')||q('#hud .top'),bt=q('#hud .orb.mp')||q('#hud .bottom');
  const y0=(tp?tp.bottom:120)+6,y1=(bt?bt.top:innerHeight)-6,room=Math.max(80,y1-y0);
  const g=S26.GAP,sz=Math.max(S26.MIN,Math.min(S26.MAX,Math.floor((room-(S26.PER-1)*g)/S26.PER))),per=Math.max(1,Math.min(S26.PMAX,Math.floor((room+g)/(sz+g))));
  const cols=Math.ceil(side.length/per),right=8,hr=q('#hud'),W0=hr?hr.right:innerWidth;
  side.forEach((b,i)=>{const c=Math.floor(i/per),r=i%per,n=Math.min(per,side.length-c*per),h=n*sz+(n-1)*g,top=y0+Math.max(0,(room-h)/2);
    b.style.width=b.style.height=sz+'px';b.style.left=Math.round(W0-right-sz-c*(sz+g))+'px';b.style.top=Math.round(top+r*(sz+g))+'px'});
  body.style.setProperty('--s26w',(cols*(sz+g)+right)+'px')}
{const _bb=buildBar;buildBar=function(){const r=_bb.apply(this,arguments);try{s26Lay()}catch(err){if(window.__QA)throw err}return r}}
addEventListener('resize',()=>{try{if(P&&P.cls)s26Lay()}catch(_){}});
// 설정 ⚙ 목록에 고르기 (휴대폰에서만)
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);const el=SET24.el;if(!el||el.hidden||!(typeof M22==='object'&&M22.phone())||!P||!P.cls)return;
  const sel=new Set(s26Sel()),cats=s26Cats();if(!cats.length)return;
  const box=document.createElement('div');box.className='s26set';
  box.innerHTML=`<div class="s24h">오른쪽 세로 단축창</div><div class="s24row">${cats.map(k=>`<button type="button" class="s24seg${sel.has(k)?' on':''}" data-s26="${k}" aria-pressed="${sel.has(k)}">${s26Name(k)}</button>`).join('')}</div>
    <div class="s24n">고른 계열의 스킬은 아래 단축창에서 빠져 화면 오른쪽 가에 세로로 놓여요. 여러 개 고를 수 있고, 다시 누르면 아래로 돌아가요. 캐릭터마다 따로 저장돼요</div>`;
  const sep=el.querySelector('.s24sep');el.insertBefore(box,sep||null);
  box.querySelectorAll('[data-s26]').forEach(b=>b.onclick=e=>{e.stopPropagation();s26Toggle(b.dataset.s26);set24Draw();set24Place()})}}
// 저장 · 불러오기: side26은 선택 필드
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{const a=P&&s26Clean(P.side26);if(d&&a&&a.length)d.side26=a}catch(_){}return d}}
{const _ld=load;load=function(d){let a=[];try{a=s26Clean(d&&d.side26)}catch(_){}const r=_ld.apply(this,arguments);try{if(P)P.side26=a;if(r&&P&&P.cls)buildBar()}catch(_){}return r}}
{const st=document.createElement('style');st.textContent=`body.m22 #hud .bar .sk.s26{position:fixed;z-index:12;margin:0;box-shadow:0 2px 6px rgba(0,0,0,.55)}
body.m22.s26on #qhud{right:var(--s26w,8px)!important}
body.m22 #set24{max-height:calc(100vh - 16px);overflow-y:auto}`;document.head.appendChild(st)}
if(window.__game)Object.assign(window.__game,{S26,s26Cat,s26Lay,s26Toggle});
