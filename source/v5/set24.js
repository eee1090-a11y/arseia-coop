/* ---------- v24 설정 단추 · 그래픽 품질 (사용자 2026-10-10 05:30) ----------
   「그래픽 품질을 낮춰 부하가 덜 걸리게 하는 옵션」 「스킬트리 · 캐릭터 · 같이하기 같은 메인은 그대로, 패치노트 · 소리 · 화면 같은 설정은 설정 버튼 안 드롭다운으로」
   · 위 단추 줄에 「설정 ⚙」 하나. 누르면 아래로 목록: 그래픽 품질 · 프레임 상한 · 화면(빛 · 안개 · 카메라 · 그림) · 소리 · 패치노트.
     예전 「화면」 · 「소리 ♪」 · 「패치노트」 단추는 줄에서 숨기고(그대로 살아 있어 목록이 그 단추를 누른다) 휴대폰 ☰ 메뉴에서도 같은 목록.
   · 그래픽 품질: 자동(예전처럼 빠르기에 따라 저절로) · 높음 · 보통 · 낮음.
       높음: 효과 단계 2 고정 · 화소 비율 1.5까지 / 보통: 효과 단계 1까지 · 화소 비율 1.25까지 / 낮음: 효과 단계 0 · 화소 비율 1(그리는 점 수가 절반 가까이)
       효과 단계(Q.lvl)는 예전 자동 품질과 같은 것: 파티클 수 · 잔상 · 작은 빛 · 장식 수.
   · 프레임 상한: 60(기본) · 30(절전). 120·144Hz 화면도 60번까지만 그리고, 30이면 그리기를 절반으로 줄여 열과 전기를 아낀다(게임 속도는 같음 · b5.js frameCapMs).
   · 낮음은 빛과 안개도 끈다(b4.js · 「화면」 창의 켜기/끄기는 그대로 저장).
   · 설정은 'arseia-gfx' 한 키에만(캐릭터 키는 건드리지 않음). */
const SET24={el:null,btn:null,lastRun:0,
  Q_MAX:{auto:2,high:2,mid:1,low:0},Q_FIX:{high:2,low:0},
  QN:{auto:'자동',high:'높음',mid:'보통',low:'낮음'},FN:{60:'60 (부드럽게)',30:'30 (절전)'}};
// 효과 단계: 고른 품질에 맞춰 묶는다 (자동 · 보통은 그 안에서 예전처럼 저절로 오르내림)
function set24Clamp(){const q=GFX.q||'auto',fx=SET24.Q_FIX[q],mx=SET24.Q_MAX[q]??2;const l0=Q.lvl;
  if(fx!=null)Q.lvl=fx;else if(Q.lvl>mx)Q.lvl=mx;if(Q.lvl!==l0)Q.apply()}
{const _t=Q.tick;Q.tick=function(ms){// 일부러 쉰 시간(30프레임)은 frame()이 빼고 넘긴다(qTickMs)
  if(SET24.Q_FIX[GFX.q]!=null){set24Clamp();return}const r=_t.call(this,ms);set24Clamp();return r}}
// 프레임 상한(60 · 30)은 b5.js frame()의 frameCapMs가 맡는다 (「게임 최적화 방안」 스레드)
function set24Q(q){if(!SET24.QN[q])return;GFX.q=q;gfxSave();resize();if(typeof P!=='undefined'&&P&&P.cls&&typeof heroBake==='function'){SC.bakeLeft=99;heroBake(P,Math.max(1,DPR)*HS*PK)}
  if(q==='high'||q==='auto')Q.lvl=2;set24Clamp();Q.apply();set24Draw()}
function set24Fps(f){f=+f;if(!(f in SET24.FN))return;GFX.fps=f;gfxSave();set24Draw()}
function set24Draw(){const el=SET24.el;if(!el||el.hidden)return;const seg=(k,cur,map,cls)=>Object.keys(map).map(v=>`<button type="button" class="s24seg${String(cur)===v?' on':''}" data-${cls}="${v}" aria-pressed="${String(cur)===v}">${map[v]}</button>`).join('');
  el.innerHTML=`<div class="s24h">그래픽 품질</div><div class="s24row">${seg('q',GFX.q||'auto',SET24.QN,'s24q')}</div>
    <div class="s24n">낮음일수록 가볍고 열이 덜 나요. 낮음: 화면을 조금 덜 선명하게 그리고 효과 · 빛과 안개를 줄여요${GFX.q==='auto'?` · 지금 효과 단계 ${Q.lvl}`:''}</div>
    <div class="s24h">프레임 상한</div><div class="s24row">${seg('f',GFX.fps===30?30:60,SET24.FN,'s24f')}</div>
    <div class="s24n">30으로 두면 그리는 횟수가 절반이라 노트북 · 휴대폰이 덜 뜨거워져요. 게임 속도는 같아요</div>
    <div class="s24sep"></div>
    <button type="button" class="s24item" data-s24go="gfxBtn">화면 <small>빛 · 안개 · 카메라 · 그림</small></button>
    <button type="button" class="s24item" data-s24go="auBtn">소리 <small>배경음악 · 효과음 크기</small></button>
    <button type="button" class="s24item" data-s24go="patchBtn">패치노트 <small>바뀐 것 다시 보기</small></button>`;
  el.querySelectorAll('[data-s24q]').forEach(b=>b.onclick=e=>{e.stopPropagation();set24Q(b.dataset.s24q)});
  el.querySelectorAll('[data-s24f]').forEach(b=>b.onclick=e=>{e.stopPropagation();set24Fps(b.dataset.s24f)});
  el.querySelectorAll('[data-s24go]').forEach(b=>b.onclick=e=>{e.stopPropagation();const t=document.getElementById(b.dataset.s24go);set24Open(false);if(typeof MOB==='object'&&MOB.menu)try{MOB.menu(false)}catch(_){}if(t)t.click()})}
function set24Place(){const el=SET24.el,b=SET24.btn;if(!el||!b)return;const r=b.getBoundingClientRect(),w=el.offsetWidth,h=el.offsetHeight,m=8;
  let x=Math.min(Math.max(m,r.left),innerWidth-m-w),y=r.bottom+6;if(y+h>innerHeight-m)y=Math.max(m,innerHeight-m-h);el.style.left=Math.round(x)+'px';el.style.top=Math.round(y)+'px'}
function set24Open(on){const el=SET24.el;if(!el)return;on=on==null?el.hidden:!!on;el.hidden=!on;SET24.btn&&SET24.btn.setAttribute('aria-expanded',String(on));if(on){set24Draw();set24Place()}}
(()=>{const tools=document.querySelector('#hud .tools');if(!tools)return;const b=document.createElement('button');b.type='button';b.className='stonebox';b.id='setBtn';b.textContent='설정 ⚙';b.title='설정: 그래픽 품질 · 화면 · 소리 · 패치노트';
  b.setAttribute('aria-haspopup','true');b.setAttribute('aria-expanded','false');const mp=document.getElementById('mapBtn');tools.insertBefore(b,mp?mp.nextSibling:null);SET24.btn=b;
  const el=document.createElement('div');el.id='set24';el.hidden=true;el.setAttribute('role','menu');document.body.appendChild(el);SET24.el=el;
  el.addEventListener('pointerdown',e=>e.stopPropagation());el.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape')set24Open(false)});
  b.onclick=e=>{e.stopPropagation();set24Open()};
  addEventListener('pointerdown',e=>{if(!el.hidden&&!e.target.closest('#set24')&&e.target!==b)set24Open(false)},true);
  addEventListener('resize',()=>{if(!el.hidden)set24Place()});
  const st=document.createElement('style');st.textContent=`#hud .tools #gfxBtn,#hud .tools #auBtn,#hud .tools #patchBtn{display:none!important}
#set24{position:fixed;z-index:70;width:min(300px,calc(100vw - 16px));box-sizing:border-box;padding:10px 12px;background:rgba(20,16,10,.97);border:1px solid #8a7346;border-radius:8px;color:#efe2c0;font-size:13px;line-height:1.45;box-shadow:0 6px 22px rgba(0,0,0,.6)}
#set24 .s24h{font-weight:700;color:#ffe2a0;margin:2px 0 4px}#set24 .s24row{display:flex;gap:4px;flex-wrap:wrap}
#set24 .s24seg{flex:1 1 0;min-width:52px;padding:6px 4px;border:1px solid #5a4a36;background:#1e1a14;color:#cfc6b2;border-radius:5px;font-size:13px;cursor:pointer}
#set24 .s24seg.on{background:#5a4418;border-color:#d6b262;color:#fff}#set24 .s24n{color:#a39d8f;font-size:11.5px;margin:4px 0 8px}
#set24 .s24sep{border-top:1px solid #4a3e2c;margin:4px 0 6px}#set24 .s24item{display:block;width:100%;text-align:left;padding:8px 8px;margin:2px 0;border:1px solid transparent;background:transparent;color:#efe2c0;border-radius:5px;font-size:14px;cursor:pointer}
#set24 .s24item:hover{background:#3a2c12;border-color:#7a6236}#set24 .s24item small{color:#a39d8f;font-size:11.5px;margin-left:6px}
body.m22P #chat{width:min(300px,calc(100% - 192px))}/* v24: 세로 휴대폰에서 의뢰 칸이 세 줄로 길어지면 대화 칸 오른쪽 4px과 겹치던 것 */
body.m22 #set24 .s24seg{min-height:36px}body.m22 #set24 .s24item{min-height:40px}`;document.head.appendChild(st)})();
set24Clamp();Q.apply();
window.__set24={SET24,set24Q,set24Fps,set24Open,set24Clamp,gfxDprCap};
