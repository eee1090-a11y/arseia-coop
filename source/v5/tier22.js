/* ---------- v22 GFX: 2차 · 3차 전직 기술 구분 (사용자 07:37) ----------
   2차 전직 기술(갈래 기술 + 「상위 기술」 탭) = 은청색 테두리 + Ⅱ 문양, 3차 전직 기술 = 진홍 · 금 테두리 + Ⅲ 문양. 1차 기술은 그대로.
   · 색: 아이템 등급 색(일반 흰 · 마법 파랑 #7aa2ff · 희귀 노랑 · 세트 초록 · 유니크 황갈 · 상급 유니크 주황)과 겹치지 않게
     2차는 채도 낮은 은청(#a9c0dc), 3차는 진홍(#a8232e) 테두리 안에 금색 가는 줄(#e8b850). 「쓰는 방식」 표시(castmark.js)의 파랑·금 번개와는 자리 · 모양으로 구분.
   · 자리: 단축칸은 왼쪽 위(키 글자는 그 오른쪽으로 비킴 · 쓰는 방식 표시는 오른쪽 위 · 파티 표시는 그 아래 · 아래는 이름 글자), 스킬 나무 아이콘은 오른쪽 위(쓰는 방식은 왼쪽 아래 · 레벨은 오른쪽 아래),
     상위 기술 · 3차 줄은 아이콘 왼쪽 위, 스킬 창 아래 단축칸 줄(dnd20)은 오른쪽 위. 단축칸에 스킬 레벨은 보이지 않는다(사용자 규칙).
   · 설명: 단축칸 · 나무 아이콘의 말풍선(title)과 오른쪽 자세히 칸에 「2차 전직 기술」 / 「3차 전직 기술」 줄.
   · 그리기만(HTML · CSS 고정 그림, 매 프레임 효과 없음). 규칙 · 수치 · 저장과 무관. 휴대폰 단축칸 자리는 MOBILE(mobile22.js)이 정하고 여기서는 모양만. */
const TIER22={
  of(id){const s=SPELLS[id];if(!s)return 0;if(s.job3)return 3;if(s.job2||s.tab==='adv')return 2;return 0},
  LBL:{2:'2차 전직 기술',3:'3차 전직 기술'},
  SVG:{2:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2.2h8v1.3H2zM2 8.5h8v1.3H2zM3.7 3.5h1.5v5H3.7zM6.8 3.5h1.5v5H6.8z"/></svg>',
    3:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.3 2.2h9.4v1.3H1.3zM1.3 8.5h9.4v1.3H1.3zM2.6 3.5h1.4v5H2.6zM5.3 3.5h1.4v5H5.3zM8 3.5h1.4v5H8z"/></svg>'},
  legend(){return `<span class="t22leg">${this.mark(2)}2차 ${this.mark(3)}3차 전직</span>`},
  mark(t,c){return t?`<span class="t22m t22m${t}${c?' '+c:''}" data-t22="${t}" aria-label="${this.LBL[t]}">${this.SVG[t]}</span>`:''},
  line(id){const t=this.of(id);if(!t)return '';const s=SPELLS[id],J=t===3?(typeof job3Of==='function'&&job3Of(s.job3)):s.job2&&typeof job2Of==='function'?job2Of(s.job2):null;
    return `<div class="t22l t22l${t}">${this.mark(t,'t22i')}<b>${this.LBL[t]}</b>${J&&J.n?` <span class="muted">· ${J.n}</span>`:s.tab==='adv'?' <span class="muted">· 상위 기술</span>':''}</div>`}};
// 스킬 창 아이콘(나무 · 상위 기술 · 3차 줄): 테두리 class + 문양 + 말풍선 글
{const _th=treeHtml;treeHtml=function(){let h=_th.apply(this,arguments);if(typeof h!=='string')return h;
  {const i=h.indexOf('</div><div class="treetabs">');if(i>=0&&!h.includes('class="t22leg"'))h=h.slice(0,i)+TIER22.legend()+h.slice(i)}
  return h.replace(/<button class="(node|j2row)([^"]*)" type="button" data-node="([^"]+)"([^>]*)>/g,(m,k,c,id,rest)=>{const t=TIER22.of(id);if(!t)return m;
    rest=rest.replace(/title="([^"]*)"/,(q,a)=>`title="${a} · ${TIER22.LBL[t]}"`);return `<button class="${k}${c} t22 t22-${t}" type="button" data-node="${id}"${rest}>${TIER22.mark(t,k==='node'?'t22n':'t22r')}`})}}
{const _dh=detailHtml;detailHtml=function(id){const h=_dh.apply(this,arguments),l=TIER22.line(id);if(!l||typeof h!=='string'||h.includes('class="t22l'))return h;const i=h.indexOf('<div class="sub">');return i<0?h:h.slice(0,i)+l+h.slice(i)}}
// 단축칸: 테두리 + 왼쪽 위 문양 + 말풍선 둘째 줄 (레벨은 넣지 않음)
{const _sb=slotBtn;slotBtn=function(i){const h=_sb.apply(this,arguments),id=P.bar[i],t=id?TIER22.of(id):0;if(!t||typeof h!=='string')return h;
  return h.replace('<button class="sk',`<button class="sk t22 t22-${t}`).replace(/(title="[^"\n]*)\n/,(m,a)=>`${a}\n${TIER22.LBL[t]}\n`).replace('<span class="cd">',TIER22.mark(t,'t22s')+'<span class="cd">')}}
// 스킬 창 아래 단축칸 줄 (dnd20.js)
{const _dk=dockHtml;dockHtml=function(){const h=_dk.apply(this,arguments);if(typeof h!=='string')return h;
  return h.replace(/<div class="dks([^"]*)" data-dock="(\d+)" title="([^"]*)">/g,(m,c,i,ti)=>{const id=P.bar[+i],t=id?TIER22.of(id):0;if(!t)return m;return `<div class="dks${c} t22 t22-${t}" data-dock="${i}" title="${ti} · ${TIER22.LBL[t]}">${TIER22.mark(t,'t22d')}`})}}
{const st=document.createElement('style');st.textContent=`
.t22m{display:inline-flex;align-items:center;justify-content:center;width:13px;height:13px;border-radius:3px;box-sizing:border-box;pointer-events:none;line-height:0}
.t22m svg{width:11px;height:11px;filter:none}
.t22m2{background:#1f2c3e;border:1px solid #a9c0dc}.t22m2 svg{fill:#e6eef8}
.t22m3{background:#5c0d16;border:1px solid #e8b850}.t22m3 svg{fill:#ffd27a}
.t22.t22-2::before,.t22.t22-3::before{content:"";position:absolute;inset:2px;border-radius:2px;pointer-events:none;z-index:1;box-sizing:border-box}
.t22.t22-2::before{border:2px solid rgba(169,192,220,.85);box-shadow:inset 0 0 0 1px rgba(230,238,248,.25)}
.t22.t22-3::before{border:2px solid #a8232e;box-shadow:inset 0 0 0 1px rgba(232,184,80,.85)}
.node.t22.passive::before{border-radius:50%}
.sk .t22s{position:absolute;left:1px;top:1px;z-index:2}.sk.t22 .k{left:16px}
.node .t22n{position:absolute;right:1px;top:1px;z-index:2}.node:has(.ptb) .t22n{top:7px}
.j2row.t22{position:relative}.j2row .t22r{position:absolute;left:2px;top:2px;z-index:2}
#panel .dock20 .dks .t22d{position:absolute;right:1px;top:1px;z-index:2;width:11px;height:11px}#panel .dock20 .dks .t22d svg{width:9px;height:9px}
.t22l{display:flex;align-items:center;gap:5px;margin:2px 0 3px;font-size:12px}.t22l .t22i{flex:none}
.t22leg{margin-left:10px;font-size:11px;color:#c8b88a;white-space:nowrap}.t22leg .t22m{vertical-align:-2px;margin:0 2px 0 4px}
.t22l2 b{color:#c9d8ea}.t22l3 b{color:#f0c060}
@media (max-width:640px){.t22leg{display:none}}
@media (max-width:640px),(max-height:480px){.sk .t22s{width:11px;height:11px}.sk .t22s svg{width:9px;height:9px}.sk.t22 .k{left:14px}}`;document.head.appendChild(st)}
