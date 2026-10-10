/* ---------- v26 짝문 = 세계 지도 배치 (사용자 2026-10-10 12:05) ----------
   「짝문은 현재 스크롤다운 방식이라서 어느 마을이 어디인지 세계지도랑 왔다갔다하면서 봐야하는 불편함 … 세계지도의 배치처럼 짝문에서 갈 곳을 골라서 갈 수 있도록」
   · 칸 = 지역 (자리는 세계 지도 WPOS 그대로), 칸 안 단추 = 그 지역 마을. 누르면 바로 건너간다 (b5.js data-travel 그대로).
   · 가 본 적 없는 마을: 자물쇠 + 눌리지 않음. 지금 있는 마을: 「지금 여기」. 지옥 봉인: 「봉인됨」.
   · 휴대폰: 단추 높이 40px 이상. 칸이 화면보다 크면 지도 칸 안에서 밀어 본다 · 열 때 지금 있는 지역이 가운데. */
const G26={CW:96,CH:120,SX:104,SY:128,PAD:8};
function g26Seal(t){try{if(NET.guest||!w3Hell(t.reg))return '';return w3BlockReg(t.reg)||''}catch(_){return ''}}
function gate26Map(){const ids=Object.keys(REGIONS).filter(id=>WPOS[id]&&ALLTOWNS.some(t=>t.reg===id));
  const xs=ids.map(id=>WPOS[id][0]),ys=ids.map(id=>WPOS[id][1]),x0=Math.min(...xs),y0=Math.min(...ys),x1=Math.max(...xs),y1=Math.max(...ys);
  const {CW,CH,SX,SY,PAD}=G26,Wd=(x1-x0)*SX+CW+PAD*2,Hd=(y1-y0)*SY+CH+PAD*2,cx=id=>PAD+(WPOS[id][0]-x0)*SX,cy=id=>PAD+(WPOS[id][1]-y0)*SY;
  let lines='';for(const id of ids)for(const sd in REGIONS[id].edges){const to=REGIONS[id].edges[sd];if(!ids.includes(to)||to<id&&REGIONS[to].edges&&Object.values(REGIONS[to].edges).includes(id))continue;
    lines+=`<line x1="${cx(id)+CW/2}" y1="${cy(id)+CH/2}" x2="${cx(to)+CW/2}" y2="${cy(to)+CH/2}"/>`}
  let cells='';const here=DG?null:actTown;
  for(const id of ids){const D=REGIONS[id],tw=ALLTOWNS.filter(t=>t.reg===id),known=tw.some(t=>P.towns.includes(t.id)),isHere=REG.id===id&&!DG,two=tw.length>1;
    let b='';for(const t of tw){const k=P.towns.includes(t.id),seal=k?g26Seal(t):'',me=here===t;
      b+=me?`<button type="button" class="g26t here" disabled aria-label="${t.n} · 지금 여기">${t.n}<small>지금 여기</small></button>`
        :seal?`<button type="button" class="g26t" disabled title="${seal}" aria-label="${t.n} · 봉인됨">${t.n}<small>봉인됨</small></button>`
        :k?`<button type="button" class="g26t" data-travel="${t.id}" aria-label="${t.n}(으)로 건너가기">${t.n}<small>Lv${t.base+w3Add(D)}~</small></button>`
        :`<button type="button" class="g26t lock" disabled aria-label="아직 가 보지 않은 마을">🔒<small>가 본 적 없음</small></button>`}
    cells+=`<div class="g26c${isHere?' now':''}${known?'':' unk'}${two?' two':''}" data-greg="${id}" style="left:${cx(id)}px;top:${cy(id)}px;width:${CW}px;height:${CH}px;--rc:${D.col}"><div class="g26n">${known?D.n:D.n+' ?'}</div>${b}</div>`}
  return `<div class="g26w" id="g26w"><div class="g26m" style="width:${Wd}px;height:${Hd}px"><svg width="${Wd}" height="${Hd}" aria-hidden="true">${lines}</svg>${cells}</div></div>
    <p class="muted g26h">북쪽이 위입니다. 한 번 가 본 마을만 누를 수 있습니다. 처음 가는 곳은 맵 끝 포탈로 걸어가 보세요.</p>`}
// 열 때 지금 있는 지역을 가운데로
function g26Center(){const w=$('#g26w');if(!w)return;const c=w.querySelector('.g26c.now')||w.querySelector('[data-greg="home"]');if(!c)return;
  w.scrollLeft=Math.max(0,c.offsetLeft+c.offsetWidth/2-w.clientWidth/2);w.scrollTop=Math.max(0,c.offsetTop+c.offsetHeight/2-w.clientHeight/2)}
{const _rp=renderPanel;renderPanel=function(){const w0=$('#g26w'),sl=w0?w0.scrollLeft:null,st=w0?w0.scrollTop:null;const r=_rp.apply(this,arguments);
  if(tab==='gate'){const w=$('#g26w');if(w){if(sl!=null){w.scrollLeft=sl;w.scrollTop=st}else g26Center()}}return r}}
{const st=document.createElement('style');st.textContent=`
.g26w{overflow:auto;max-height:min(62vh,560px);border:1px solid rgba(176,142,82,.25);border-radius:3px;background:#0c0b09;overscroll-behavior:contain;touch-action:pan-x pan-y;margin:6px 0 8px}
.g26m{position:relative}
.g26m svg{position:absolute;left:0;top:0}.g26m line{stroke:rgba(200,170,110,.45);stroke-width:3;stroke-dasharray:6 6;stroke-linecap:round}
.g26c{position:absolute;box-sizing:border-box;border:1.5px solid color-mix(in srgb,var(--rc) 70%,#000);border-radius:6px;background:#14120e;padding:4px;display:flex;flex-direction:column;gap:4px}
.g26c.unk{border-color:#4a4438}.g26c.now{border:2.5px solid #ffd76a;background:#221d12}
.g26n{font-size:11.5px;line-height:1.25;color:var(--rc);text-align:center;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g26c.unk .g26n{color:#7a7468}
.g26t{flex:1;min-height:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:2px 3px;font-size:12.5px;font-weight:700;line-height:1.15;border-radius:4px;border:1px solid #6a5636;background:linear-gradient(#3a2e1c,#231b10);color:#f0dca8;word-break:keep-all;text-align:center;cursor:pointer}
.g26t small{font-size:10.5px;font-weight:400;color:#c8c0ae}
.g26t:not(:disabled):hover{border-color:#ffd76a;background:linear-gradient(#4a3a22,#2a2014)}
.g26t:disabled{cursor:default;opacity:1}.g26t.lock{background:#1a1712;border-color:#3a342a;color:#8a8070}.g26t.lock small{color:#7a7468}
.g26t.here{background:#3a3018;border-color:#ffd76a;color:#ffe6a8}.g26t.here small{color:#ffd76a}
.g26h{font-size:12.5px}`;document.head.appendChild(st)}
