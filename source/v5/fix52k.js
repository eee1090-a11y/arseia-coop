/* ---------- v52 단축바 단축키 글자 잘 보이게 (PC) ----------
   사용자 2026-11-02 「지금 플레이 화면에 단축바에서 어떤 스킬이 어떤 단축키인지 알아볼 수가 없어.」
   원인: 칸 왼쪽 위 단축키 글자(.k)가 10.5px 옅은 금색에 바탕이 없어, 새 스킬 그림 · 등급 표시와 겹치면 묻혔다.
   고침(그리기만 · PC만, 휴대폰은 예전처럼 단축키 글자를 숨김):
   · 단축키를 칸 왼쪽 위 모서리의 어두운 바탕 · 금색 테두리 작은 표 안에 굵은 12px 밝은 글자로(그림 위에 놓음).
   · 등급 표시(t22)가 있는 칸은 그 표시 오른쪽에 붙임.
   · 추가 단축바에서 키를 아직 정하지 않은 칸은 칸 번호(+1 …)를 흐린 글자로만 두어 진짜 키와 헷갈리지 않게, 칸 설명에 「단축키 없음 · ⚙ 설정 → 단축키에서 정하기」.
   저장 · 키 배정은 바꾸지 않는다. */
const K52={css:`body:not(.m22) .sk .k{top:0;left:0;z-index:4;min-width:16px;height:16px;padding:0 3px;box-sizing:border-box;border-radius:2px 0 5px 0;background:rgba(8,6,4,.9);border:1px solid rgba(214,178,98,.75);border-top:0;border-left:0;
  color:#fff1c8;font-weight:700;font-size:12px;line-height:15px;text-align:center;letter-spacing:0;text-shadow:none;white-space:nowrap;pointer-events:none}
body:not(.m22) .sk.t22 .k{left:15px;border-left:1px solid rgba(214,178,98,.75);border-radius:0 0 5px 5px}
body:not(.m22) .sk .k.k52n{background:none;border:0;color:#7d7464;font-weight:400;font-size:10px;line-height:14px}`};
const k52NoKey=i=>{try{return i>=B44.BASE&&!(KB_BY['s'+i]&&KB.bind[KB_BY['s'+i].id])}catch(_){return false}};
{const _sb=slotBtn;slotBtn=function(i){let h=_sb.apply(this,arguments);try{if(k52NoKey(i)){h=h.replace('<span class="k">','<span class="k k52n">');h=h.replace(/title="([^"]*)"/,(m,t)=>`title="${t}\n단축키 없음 · ⚙ 설정 → 단축키에서 정할 수 있어요"`)}}catch(e){if(window.__QA)throw e}return h}}
{const st=document.createElement('style');st.id='k52css';st.textContent=K52.css;document.head.appendChild(st)}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{K52,k52NoKey})}catch(_){}},0);
