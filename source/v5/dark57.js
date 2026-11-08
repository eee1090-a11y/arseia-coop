/* ---------- v57 어둠의 등불 대상 지역 보이기 (사용자 2026-11-07 「어둠의 등불을 통해서 강화되는 대상이 되는 맵들을 미니맵 위에 표기 해줘.
   그리고 짝문에서도 볼 수 있도록 해주고, 월드맵을 봤을 때에도 굵은 선이라던가 하는 방식으로 표기될 수 있도록 해줘」) ----------
   대상 규칙(dark21.js darkRegOk): 지옥에서 몬스터가 100레벨부터 나오는 지역 전부 + 그 던전 · 오늘의 잿빛 메아리 둘(140레벨 캐릭터).
   · 미니맵(둥근 칸): 지금 있는 곳이 대상이면 아래쪽에 「✦ 등불 대상 · N단계/꺼짐」(보통 · 악몽에서는 「✦ 지옥에서 등불 대상」) · 지옥에서는 대상 지역으로 가는 포탈에 보라 고리
   · 짝문: 대상 지역 칸에 보라 굵은 테두리와 이름 앞 ✦ · 아래 설명 줄
   · 세계 지도: 대상 지역 칸에 보라 굵은 테두리 · 아래 설명 줄에 규칙
   보이는 때: 100레벨 이상이거나 등불이 켜졌을 때(fix51g G51.SHOW_LAMP와 같음). 그림 · 글만, 수치 · 저장은 그대로. */
const D57={col:'#b48aff',dim:'#8a78a8'};
const d57Show=()=>!!P&&(P.lvl>=G51.SHOW_LAMP||darkLit());
const d57Ok=id=>darkRegOk(id)||(P&&P.diff===2&&echoOn(id));// 이 캐릭터에게 대상인 지역 (메아리는 지옥 · 140일 때만 목록에 있음)
const d57Rule=()=>`지옥 난이도에서 몬스터가 ${D21_MIN}레벨 이상인 지역 전부와 그 던전${P&&P.lvl>=MAXLV&&P.diff===2?' · 오늘의 잿빛 메아리 지역':''}`;
function d57MiniLabel(){if(!d57Show()||IN)return '';const t=darkTier();
  if(darkHere())return `✦ 등불 대상 · ${t?`${t}단계`:'꺼짐'}`;
  const id=DG&&DG.d?DG.d.reg:REG.id;if(P.diff!==2&&darkRegOk(id))return '✦ 지옥에서 등불 대상';return ''}
{const _dm=drawMinimap;drawMinimap=function(){const r=_dm.apply(this,arguments);d21Try(()=>{if(!d57Show()||IN)return;const S0=mm.width;
  if(!DG&&P.diff===2){const m=S0/2600,px=(P.x-P.y)*KI,py=(P.x+P.y)*KI/2;mctx.setTransform(m*KI,m*KI/2,-m*KI,m*KI/2,S0/2-m*px,S0/2-m*py);mctx.strokeStyle=D57.col;mctx.lineWidth=46;
    for(const e of EDGES||[])if(e&&e.to&&darkRegOk(e.to)){mctx.beginPath();mctx.arc(e.x,e.y,240,0,6.283);mctx.stroke()}mctx.setTransform(1,0,0,1,0,0)}
  const L=d57MiniLabel();if(!L)return;const f=Math.max(10,Math.round(S0/15));mctx.font=`700 ${f}px ${FONT}`;mctx.textAlign='center';mctx.lineWidth=3;mctx.strokeStyle='rgba(0,0,0,.85)';
  const y=Math.round(S0*.8);mctx.strokeText(L,S0/2,y);mctx.fillStyle=darkHere()?D57.col:D57.dim;mctx.fillText(L,S0/2,y)});return r}}
/* ===== 짝문: 대상 지역 칸 ===== */
function d57Gate(){const w=$('#g26w');if(!w||!d57Show())return 0;let n=0;
  for(const c of w.querySelectorAll('.g26c[data-greg]')){const id=c.getAttribute('data-greg'),on=d57Ok(id);c.classList.toggle('d57',on);
    const nm=c.querySelector('.g26n');let b=c.querySelector('.d57b');if(on&&!b&&nm){b=document.createElement('span');b.className='d57b';b.textContent='✦ ';b.title='어둠의 등불 대상 지역';nm.prepend(b)}else if(!on&&b)b.remove();if(on)n++}
  if(!panel.querySelector('.d57h')){const s=document.createElement('p');s.className='muted d57h';
    s.innerHTML=`<b style="color:${D57.col}">✦ 보라 굵은 테두리</b> = 어둠의 등불 대상 지역 (${d57Rule()})`;w.insertAdjacentElement('afterend',s)}return n}
{const _rp=renderPanel;renderPanel=function(){const r=_rp.apply(this,arguments);if(tab==='gate')d21Try(d57Gate);return r}}
{const st=document.createElement('style');st.textContent=`
.g26c.d57{box-shadow:0 0 0 3px ${D57.col},0 0 10px rgba(180,138,255,.45)}
.g26c .d57b{color:${D57.col};font-weight:700}
.d57h{font-size:12.5px;margin:4px 0}`;document.head.appendChild(st)}
/* ===== 세계 지도: 대상 지역 굵은 테두리 ===== */
function d57Wmap(g){const G=WMAP.geo;if(!G||!g||!d57Show())return 0;let n=0;
  g.save();g.strokeStyle=D57.col;g.lineWidth=4;g.shadowColor='rgba(180,138,255,.6)';g.shadowBlur=6;
  for(const id in REGIONS){if(!WPOS[id]||!d57Ok(id))continue;const p=G.pos(id);g.strokeRect(p.x-G.w/2-6,p.y-G.h/2-6,G.w+12,G.h+12);n++}g.restore();
  const lg=$('#wmapLeg');if(lg&&!lg.innerHTML.includes('d57leg'))lg.innerHTML+=`<span class="d57leg"> <b style="color:${D57.col}">▢ 보라 굵은 테두리</b> 어둠의 등불 대상 지역: ${d57Rule()}${darkLit()?` · 지금 ${(P.dark.cur|0)?`어둠 ${P.dark.cur}단계`:'꺼짐'}`:' · 등불은 아직 꺼져 있음'}.</span>`;
  return n}
{const _w=wmapWorld22;wmapWorld22=function(g){const r=_w.apply(this,arguments);d21Try(()=>d57Wmap(g));return r}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{D57,d57Show,d57Ok,d57MiniLabel,d57Gate,d57Wmap,darkRegOk,darkRegList})}catch(_){}},0);
