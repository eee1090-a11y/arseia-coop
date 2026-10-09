
/* ---------- v18: 휴대폰 화면 정리 (폭 640px 이하에서만) ----------
   · 위 왼쪽 버튼들(스킬 트리·캐릭터·지도…)은 ☰ 버튼 하나로 접는다. 찍을 점수가 있으면 ☰에 점이 뜬다.
   · 내 강화는 글자 대신 작은 아이콘으로 오른쪽 위(미니맵 아래)에. 의뢰 안내는 그 아래로 비켜 선다.
   · 단축칸 21개 + 물약 3개를 한 줄 8칸씩 세 줄로 접어 화면 밖으로 잘리지 않게.
   PC 화면은 그대로. 저장·규칙과 무관. */
const MOB={mq:matchMedia('(max-width:640px)'),el:null,last:'',nextT:0,qTop:-1,
  on(){return this.mq.matches},
  menu(open){const t=document.querySelector('#hud .tools');if(t)t.classList.toggle('open',open==null?!t.classList.contains('open'):!!open)},
  tick(){if(!this.on()){if(this.el&&this.last){this.el.innerHTML='';this.last=''}return}const now=performance.now();if(now<this.nextT)return;this.nextT=now+200;
    if(!this.el){const mm=document.querySelector('#hud .rightcol');if(!mm)return;this.el=document.createElement('div');this.el.id='mbuffs';mm.appendChild(this.el)}
    const h=typeof PUI==='object'?PUI.chips(PUI.myBuffs()):'';if(h!==this.last){this.last=h;this.el.innerHTML=h}
    const q=document.querySelector('#qhud'),rc=document.querySelector('#hud .rightcol');if(q&&rc){const top=Math.round(rc.getBoundingClientRect().bottom+6);if(top!==this.qTop){this.qTop=top;q.style.top=top+'px'}}}};
{const t=document.querySelector('#hud .tools');if(t){const b=document.createElement('button');b.className='stonebox';b.id='menuBtn';b.type='button';b.textContent='☰';b.title='메뉴';b.setAttribute('aria-label','메뉴');
   t.insertBefore(b,t.firstChild);b.addEventListener('click',e=>{e.stopPropagation();MOB.menu()});
   t.addEventListener('click',e=>{const x=e.target.closest('button');if(x&&x!==b&&MOB.on())MOB.menu(false)})}
 addEventListener('pointerdown',e=>{if(MOB.on()&&!e.target.closest('#hud .tools'))MOB.menu(false)},true);
 MOB.mq.addEventListener&&MOB.mq.addEventListener('change',()=>{MOB.menu(false);MOB.qTop=-1;const q=document.querySelector('#qhud');if(q&&!MOB.on())q.style.top=''});
 const _uh=updateHud;updateHud=function(){_uh.apply(this,arguments);MOB.tick()};
 const st=document.createElement('style');st.textContent=`
#menuBtn{display:none}
#mbuffs{display:none}
@media (max-width:640px){
  #menuBtn{display:inline-block;font-size:17px;line-height:1;padding:6px 11px;position:relative}
  #hud .tools{flex-direction:column;align-items:stretch;gap:4px}
  #hud .tools:not(.open) button:not(#menuBtn){display:none!important}
  #hud .tools.open{background:rgba(14,12,10,.92);border:1px solid #5c4a2e;border-radius:4px;padding:5px;z-index:30;position:relative}
  .tools.open #menuBtn{align-self:flex-start}
  .tools:has(.lvup):not(.open) #menuBtn::after{content:'';position:absolute;top:3px;right:3px;width:8px;height:8px;border-radius:50%;background:#ffd76a;box-shadow:0 0 6px #ffb84a}
  #buffs{display:none!important}
  #pframes .pf.me{display:none}
  #hud .zone small{display:none}
  #mbuffs{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:3px;max-width:150px;pointer-events:auto}
  #mbuffs .pbi{position:relative;width:20px;height:20px;border:1px solid #6a5a30;border-radius:3px;background:rgba(16,13,10,.85);display:inline-flex;align-items:center;justify-content:center}
  #mbuffs .pbi svg{width:15px;height:15px}
  #mbuffs .pbi em{position:absolute;right:-2px;bottom:-3px;font-style:normal;font-size:9px;line-height:1;color:#fff;text-shadow:0 0 2px #000,0 0 2px #000;font-variant-numeric:tabular-nums}
  #hud .barwrap{overflow:visible}
  #hud .bar .barrow{display:contents}
  #hud .bar{display:flex;flex-direction:row;flex-wrap:wrap;gap:3px;justify-content:flex-start;width:100%;box-sizing:border-box}
  #hud .bar .sep{display:none}
  #hud .bar .sk{width:calc((100% - 21px) / 8);height:40px}
  #hud #act{bottom:calc(env(safe-area-inset-bottom,0px) + 232px)}
  #hud #log{bottom:calc(env(safe-area-inset-bottom,0px) + 280px)}
  #hud #target{bottom:calc(env(safe-area-inset-bottom,0px) + 212px)}
  body #chat{bottom:calc(env(safe-area-inset-bottom,0px) + 344px)}
}`;document.head.appendChild(st)}
