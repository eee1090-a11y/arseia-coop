/* ---------- v20: 채널링은 한 번 누르면 이어진다 (사용자 23:48) ----------
   예전: 채널링·모으기는 키·단축칸을 누르고 있는 동안만 이어졌다(손을 떼면 끊김). 휴대폰에서 꾹 누르기가 불편했다.
   지금: 한 번 누르면 시작해서, 움직이지 않으면 정해진 시간 끝까지 이어진다(움직이면 끊김 · 걸으며 쓰는 채널링은 그대로 걸어도 됨).
   · 모으기(3차)는 다 모이면 저절로 터진다. 움직이면 그때까지 모은 만큼 터진다.
   · 같은 칸을 다시 새로 누르면(누르고 있던 손이 아니라 새로) 채널링을 멈추고, 모으기는 그 자리에서 터뜨린다.
   · 다른 마법을 누르면 지금처럼 바뀐다. 누르고 있어도 다시 시작하지 않는다(멈춘 뒤 손을 뗄 때까지 그 칸은 쉰다).
   cast.js·job3.js 다음, b5.js 앞. castSlot(손 입력)만 감싼다 — 코드에서 바로 부르는 tryCast(점검·동료)는 그대로. */
const TAP={f:0,seen:{},block:{}};
// 매 프레임: 손을 떼도 끊기지 않게(sticky). cast.js·job3.js의 update보다 먼저
{const _u=update;update=function(dt){TAP.f++;if(CAST.ch)CAST.ch.sticky=true;if(typeof J3CH!=='undefined'&&J3CH)J3CH.sticky=true;return _u(dt)}}
{const _cs=castSlot;castSlot=function(i,target){const id=P&&P.bar[i],held=TAP.seen[i]>=TAP.f-1;TAP.seen[i]=TAP.f;
  if(TAP.block[i]){if(held)return;TAP.block[i]=false}
  if(id&&!held){// 새로 누름: 같은 마법이 이어지는 중이면 멈추거나 터뜨림
    const ch=CAST.ch,jc=typeof J3CH!=='undefined'?J3CH:null;
    if(ch&&ch.id===id&&ch.t>.25){castStop();TAP.block[i]=true;msg(`${SPELLS[id].n}: 채널링을 멈췄습니다`,'#a39d8f');return}
    if(jc&&jc.id===id&&jc.t>.25&&typeof j3ChargeRelease==='function'){j3ChargeRelease();TAP.block[i]=true;return}}
  const r=_cs(i,target);if(CAST.ch)CAST.ch.sticky=true;if(typeof J3CH!=='undefined'&&J3CH)J3CH.sticky=true;return r}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{TAP})}catch(_){}},0);
