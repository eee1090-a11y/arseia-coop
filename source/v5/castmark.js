
/* ---------- v18: 쓰는 방식 표시 (즉시 · 시전 · 채널링) ----------
   단축칸 오른쪽 위(파티 표시가 있으면 그 아래로 내림)와 스킬 트리 아이콘 왼쪽 아래에 작은 그림 하나. 글자 대신 모양과 색으로 구분한다.
   즉시 = 금색 번개 · 시전 = 파란 모래시계 · 채널링 = 보라 물결. 패시브와 빈 칸은 표시 없음. 표(CAST_T/CHAN)를 그때그때 읽는다. */
const CMARK={
  kind(id){const s=SPELLS[id];if(!s||s.kind==='passive')return '';if(CAST_T[id])return 'cast';if(chanOf(id))return 'chan';return 'inst'},
  LBL:{inst:'즉시',cast:'시전',chan:'채널링'},
  SVG:{inst:'<svg viewBox="0 0 10 10"><path d="M6.2 0L1.3 5.6h3.1L3.4 10l5.3-6.2H5.5z"/></svg>',
    cast:'<svg viewBox="0 0 10 10"><path d="M2 .5h6v1.2L5.7 5 8 8.3v1.2H2V8.3L4.3 5 2 1.7z"/></svg>',
    chan:'<svg viewBox="0 0 10 10"><path d="M.8 2.6q2.1-2 4.2 0t4.2 0M.8 5.2q2.1-2 4.2 0t4.2 0M.8 7.8q2.1-2 4.2 0t4.2 0" fill="none" stroke-width="1.4" stroke-linecap="round"/></svg>'},
  html(id,c){const k=this.kind(id);return k?`<span class="${c} cm-${k}" data-cm="${k}" aria-label="${this.LBL[k]}">${this.SVG[k]}</span>`:''},
  legend(){return `<span class="cmleg">${['inst','cast','chan'].map(k=>`<span class="cmk cm-${k}">${this.SVG[k]}</span>${this.LBL[k]}`).join(' ')}</span>`}};
{const _sb=slotBtn;slotBtn=function(i){const h=_sb.apply(this,arguments),id=P.bar[i];if(!id||!SPELLS[id])return h;const k=CMARK.kind(id);if(!k)return h;
   return h.replace('<span class="cd">',CMARK.html(id,'cmk')+'<span class="cd">').replace(/title="([^"]*?) · 스킬 레벨/,(m,a)=>`title="${a} · ${CMARK.LBL[k]} · 스킬 레벨`)};
 const _th=treeHtml;treeHtml=function(){let h=_th.apply(this,arguments);
   h=h.replace(/(<button class="node[^"]*" type="button" data-node="([^"]+)"[^>]*>)/g,(m,a,id)=>a+CMARK.html(id,'cmk cmn'));
   const i=h.indexOf('</div><div class="treetabs">');if(i>=0)h=h.slice(0,i)+CMARK.legend()+h.slice(i);return h};
 const st=document.createElement('style');st.textContent=`
.cmk{display:inline-flex;align-items:center;justify-content:center;width:13px;height:13px;border-radius:3px;background:rgba(10,8,4,.85);border:1px solid #5a4a36;vertical-align:-2px;margin-right:2px}
.cmk svg{width:10px;height:10px;filter:none}
.sk .cmk{position:absolute;top:1px;right:1px;margin:0;z-index:1;pointer-events:none}
.sk:has(.cmk) .ptm{top:15px}
.node .cmk.cmn{position:absolute;left:1px;bottom:1px;margin:0;z-index:1;pointer-events:none}
.cm-inst{border-color:#a08030}.cm-inst svg{fill:#ffd76a}
.cm-cast{border-color:#3f6f9a}.cm-cast svg{fill:#8fd0ff}
.cm-chan{border-color:#7a4f9a}.cm-chan svg{stroke:#d6a6ff}
.cmleg{margin-left:10px;font-size:11px;color:#c8b88a;white-space:nowrap}
@media (max-width:640px){.sk .cmk{width:11px;height:11px}.sk:has(.cmk) .ptm{top:13px}.sk .cmk svg{width:8px;height:8px}.cmleg{display:none}}`;document.head.appendChild(st)}
