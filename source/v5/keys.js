/* ---------- v18 (SYS): 단축키 바꾸기 ----------
   단축칸 21칸(좌·우 마우스 칸에도 키를 하나 더 줄 수 있음)과 물약·두루마리·창 열기 키를 원하는 키 조합
   (Shift/Alt/Ctrl + 키)으로 바꾼다. 캐릭터마다 저장의 선택 필드 keys에 '기본과 다른 것만' 넣는다
   ({s13:'S+Digit1', hp:'KeyZ'} · ''는 비워 둠). keys가 없는 옛 저장은 지금까지와 똑같은 기본 배치.
   조합 문자열: [C][A][S]+code  (C=Ctrl A=Alt S=Shift, 예: 'S+Digit1', 'A+KeyQ', 'F3')
   · 키 입력은 가장 먼저(window 캡처 단계) 받아서: 단축칸 키는 keys에 그 조합을 넣고(b3.js가 CODE2SLOT으로 시전),
     다른 키(물약·창)는 원래 키(Q, T, M …)를 한 번 대신 눌러 준다 → 원래 처리 코드(b5·sq·worldmap)를 그대로 쓴다.
   · 기본 키를 다른 데로 옮겼으면 그 키는 막는다. 바꾼 적 없는 조합에 Shift/Alt가 붙으면 예전처럼 같은 키로 친다.
   · 브라우저가 쓰는 조합(Alt+F4, Ctrl+W/T/N/R/L, F5, F11, F12 …)과 이동 키(WASD·방향키·Space)는 고를 수 없다.
   · Alt를 누른 채 쓰는 조합은 브라우저 메뉴가 뜨지 않도록 막는다(preventDefault).
   b2.js(SLOTS · CODE2SLOT) 다음, 다른 키 처리(sq.js · worldmap.js · b5.js)보다 먼저 와야 한다. */
const KB_EXTRA=[['hp','KeyQ','생명력 물약'],['mp','KeyE','마나 물약'],['tp','KeyR','귀환 두루마리'],['act','KeyF','말 걸기 · 들어가기'],
  ['tree','KeyT','스킬 트리'],['char','KeyC','캐릭터와 가방'],['codex','KeyJ','도감'],['quest','KeyL','의뢰 일지'],['map','KeyM','지도']];
const KB_ACTS=[];
SLOTS.forEach((s,i)=>KB_ACTS.push({id:'s'+i,slot:i,def:s.code||'',k0:s.k,n:i<2?`${s.k} 칸 (마우스 ${i?'오른쪽':'왼쪽'})`:`칸 [${s.k}]`}));
for(const [id,def,n] of KB_EXTRA)KB_ACTS.push({id,def,n});
const KB_BY={};KB_ACTS.forEach(a=>KB_BY[a.id]=a);
const KB={p:null,bind:{},map:{},cap:null,note:'',synth:false,win:null};
const KB_DEFCODES=new Set(KB_ACTS.map(a=>a.def).filter(Boolean));
const KB_MODS=new Set(['ShiftLeft','ShiftRight','AltLeft','AltRight','ControlLeft','ControlRight','MetaLeft','MetaRight','OSLeft','OSRight']);
const kbCombo=e=>{const m=(e.ctrlKey?'C':'')+(e.altKey?'A':'')+(e.shiftKey?'S':'');return m?m+'+'+e.code:e.code};
const kbSplit=c=>{const i=c.indexOf('+');return i>0&&/^C?A?S?$/.test(c.slice(0,i))?{m:c.slice(0,i),code:c.slice(i+1)}:{m:'',code:c}};
function kbKeyName(code){let m;
  if((m=/^Digit(\d)$/.exec(code)))return m[1];if((m=/^Key([A-Z])$/.exec(code)))return m[1];if((m=/^Numpad(\d)$/.exec(code)))return 'N'+m[1];if(/^F\d+$/.test(code))return code;
  return{Backquote:'`',Minus:'-',Equal:'=',BracketLeft:'[',BracketRight:']',Backslash:'\\',Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/',
    NumpadAdd:'N+',NumpadSubtract:'N-',NumpadMultiply:'N*',NumpadDivide:'N/',NumpadDecimal:'N.',Insert:'Ins',Delete:'Del',Home:'Home',End:'End',PageUp:'PgUp',PageDown:'PgDn',Backspace:'⌫',IntlBackslash:'\\'}[code]||code}
// 짧은 표시(단축칸 위): ⇧1 · A1 · ^1 · F3
function kbShort(c){if(!c)return '';const{m,code}=kbSplit(c);return(m.includes('C')?'^':'')+(m.includes('A')?'A':'')+(m.includes('S')?'⇧':'')+kbKeyName(code)}
// 긴 표시(설정 창): Shift+1 · Alt+Q
function kbLong(c){if(!c)return '없음';const{m,code}=kbSplit(c);return(m.includes('C')?'Ctrl+':'')+(m.includes('A')?'Alt+':'')+(m.includes('S')?'Shift+':'')+kbKeyName(code)}
// 고를 수 없는 조합이면 까닭을, 괜찮으면 ''
function kbReserved(c){const{m,code}=kbSplit(c);
  if(!code||KB_MODS.has(code))return '조합 키만 따로 쓸 수는 없습니다';
  if(/^(Key[WASD]|Arrow\w+|Space)$/.test(code))return '이동 키입니다';
  if(/^(Escape|Tab|Enter|NumpadEnter|CapsLock|NumLock|ScrollLock|Pause|PrintScreen|ContextMenu|Fn|FnLock)$/.test(code))return '게임이나 운영체제가 쓰는 키입니다';
  if(/^F(5|11|12|1[3-9]|2\d)$/.test(code)||(code==='F6'&&m))return '브라우저가 쓰는 키입니다 (새로고침 · 전체 화면 · 개발 도구)';
  if(m.includes('S')&&code==='F10')return '브라우저가 쓰는 조합입니다';
  if(m.includes('A')&&!m.includes('C')&&/^(F4|F10|KeyD|KeyE|KeyF|Home|Backspace)$/.test(code))return '브라우저나 운영체제가 쓰는 조합입니다 (Alt+F4 · Alt+D …)';
  if(m.includes('C')&&m.includes('A')&&/^(Delete|Backspace|Insert)$/.test(code))return '운영체제가 쓰는 조합입니다';
  if(m.includes('C')&&!m.includes('A')&&/^(Key[WTNRLQPSDHJOUFACVXZYGBIKEM]|Digit\d|Numpad\d|Minus|Equal|PageUp|PageDown|F4|Backquote|Backspace|Delete|Insert)$/.test(code))return '브라우저가 쓰는 조합입니다 (Ctrl+W · Ctrl+T · Ctrl+숫자 …)';
  return ''}
const kbValid=c=>typeof c==='string'&&c.length<=24&&/^(?:(?:C|CA|CAS|CS|A|AS|S)\+)?[A-Z][A-Za-z0-9]*$/.test(c);
// 저장에서 읽은 keys 정리: 아는 동작 · 올바른 조합 · 고를 수 없는 조합 제외(기본 키는 예외) · 겹치면 앞의 것만
function kbClean(o){const out={};if(!o||typeof o!=='object'||Array.isArray(o))return out;const used=new Set();
  for(const id of Object.keys(o)){const a=KB_BY[id],c=o[id];if(!a)continue;
    if(c===''){out[id]='';continue}
    if(!kbValid(c)||(kbReserved(c)&&!KB_DEFCODES.has(c))||c===a.def||used.has(c))continue;used.add(c);out[id]=c}
  return out}
// 지금 캐릭터(P.keys)의 배치를 계산해 CODE2SLOT · 단축칸 글자에 반영
function kbSync(){if(!P)return;const ov=P.keys&&typeof P.keys==='object'?P.keys:{};KB.p=P;
  const bind={},taken=new Set();
  for(const a of KB_ACTS)if(a.id in ov){bind[a.id]=ov[a.id];if(ov[a.id])taken.add(ov[a.id])}
  for(const a of KB_ACTS)if(!(a.id in ov))bind[a.id]=a.def&&!taken.has(a.def)?a.def:'';
  KB.bind=bind;KB.map={};for(const a of KB_ACTS)if(bind[a.id])KB.map[bind[a.id]]=a;
  for(const c of Object.keys(CODE2SLOT))delete CODE2SLOT[c];
  for(const a of KB_ACTS)if(a.slot!=null&&bind[a.id])CODE2SLOT[bind[a.id]]=a.slot;
  for(const a of KB_ACTS)if(a.slot!=null)SLOTS[a.slot].k=a.slot<2?(bind[a.id]?`${a.k0}·${kbShort(bind[a.id])}`:a.k0):kbShort(bind[a.id])||'–';
  try{for(const [id,sel,t] of [['tree','#treeBtn','스킬 트리'],['char','#charBtn','캐릭터'],['map','#mapBtn','지도']]){const b=document.querySelector(sel);if(b&&new RegExp('^'+t+' \\(').test(b.textContent))b.textContent=`${t} (${bind[id]?kbLong(bind[id]):'키 없음'})`}}catch(_){}}
const kbBind=id=>{if(KB.p!==P)kbSync();return KB.bind[id]||''};
// 동작 하나에 조합을 넣는다. 다른 동작이 쓰던 조합이면 서로 바꾼다. 실패하면 까닭(문자열), 성공하면 ''
function kbSet(id,c){const a=KB_BY[id];if(!a)return '모르는 동작';if(KB.p!==P)kbSync();
  if(c){if(!kbValid(c))return '쓸 수 없는 키';const why=kbReserved(c);if(why&&c!==a.def)return why}
  const old=KB.bind[id]||'',other=c?KB.map[c]:null;
  const ov=Object.assign({},P.keys&&typeof P.keys==='object'?P.keys:{});
  const put=(x,v)=>{if(v===x.def)delete ov[x.id];else ov[x.id]=v};
  put(a,c||'');if(other&&other!==a)put(other,old);
  P.keys=ov;kbSync();buildBar();return ''}
function kbReset(){P.keys={};kbSync();buildBar()}
const kbSave=()=>{try{saveNow()}catch(_){}};

/* 키 입력: 가장 먼저 받는다 */
addEventListener('keydown',e=>{
  if(KB.synth)return;
  const t=e.target;if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;
  if(kbIsOpen()){if(KB.cap)kbCapture(e);else{e.stopImmediatePropagation();if(e.code==='Escape'||e.code==='Enter'){e.preventDefault();kbClose()}}return}// 창이 열려 있으면 게임으로 보내지 않는다
  if(e.code==='AltLeft'||e.code==='AltRight'){e.preventDefault();return}// Alt만 눌렀다 떼면 브라우저 메뉴로 가는 것을 막는다
  if(KB_MODS.has(e.code))return;
  if(KB.p!==P)kbSync();
  const combo=kbCombo(e);let a=KB.map[combo];
  if(!a&&combo!==e.code&&(e.shiftKey||e.altKey)&&!e.ctrlKey&&!e.metaKey)a=KB.map[e.code];// 바꾼 적 없는 Shift/Alt 조합: 예전처럼 같은 키
  if(e.altKey&&!e.ctrlKey&&e.code!=='F4'&&e.code!=='Tab')e.preventDefault();// Alt 조합: 브라우저 메뉴가 뜨지 않게
  if(!a){if(combo===e.code&&KB_DEFCODES.has(e.code)&&!/^Key[BKI]$/.test(e.code)){e.stopImmediatePropagation();if(/^F\d+$/.test(e.code))e.preventDefault()}return}// 옮겨서 비어 있는 기본 키
  const intro=$('#intro');if(intro&&!intro.hidden)return;
  if(a.slot!=null){e.stopImmediatePropagation();e.preventDefault();
    if(bindId){bindTo(a.slot);return}
    if(a.slot>=2&&kbPickOn()){bindId=KB.picked;bindTo(a.slot);return}// 스킬 트리에서 고른 마법 → 누른 칸
    const tok=KB.map[combo]===a?combo:e.code;keys.add(tok);return}
  if(e.code===a.def&&combo===e.code)return;// 기본 키 그대로: 원래 처리
  e.stopImmediatePropagation();e.preventDefault();kbFire(a.def)},true);
addEventListener('keyup',e=>{if(KB.synth)return;
  if(e.code==='AltLeft'||e.code==='AltRight')e.preventDefault();
  const mod=/^Shift/.test(e.code)?'S':/^Alt/.test(e.code)?'A':/^Control/.test(e.code)?'C':'';
  for(const k of [...keys]){if(!(k in CODE2SLOT))continue;const s=kbSplit(k);if(s.code===e.code||(mod&&s.m.includes(mod)))keys.delete(k)}},true);
// 원래 키를 한 번 대신 눌러 준다 (원래 처리 코드가 그대로 받는다)
function kbFire(code){const ev=new KeyboardEvent('keydown',{code,key:code.replace(/^Key/,'').toLowerCase(),bubbles:true,cancelable:true});
  KB.synth=true;try{(document.body||document).dispatchEvent(ev)}finally{KB.synth=false}
  KB.synth=true;try{(document.body||document).dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true,cancelable:true}))}finally{KB.synth=false}}

/* 저장 · 불러오기: keys는 선택 필드 (없으면 기본 배치) */
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);try{const k=P&&P.keys;if(d&&k&&typeof k==='object'&&Object.keys(k).length)d.keys=Object.assign({},k)}catch(_){}return d}}
{const _ld=load;load=function(d){let ks={};try{ks=kbClean(d&&d.keys)}catch(_){}const r=_ld.apply(this,arguments);try{if(r&&P){P.keys=ks;kbSync();buildBar()}}catch(_){}return r}}
{const _bb=buildBar;buildBar=function(){if(KB.p!==P)kbSync();_bb.apply(this,arguments);
  try{const bar=document.getElementById('bar');for(const id of ['hp','mp','tp']){const k=bar&&bar.querySelector(`[data-pot="${id}"] .k`);if(k)k.textContent=kbShort(KB.bind[id])}}catch(_){}}}

/* 설정 창 */
{const st=document.createElement('style');st.textContent=`#kbwin{position:fixed;inset:0;display:grid;place-items:center;background:rgba(3,3,4,.74);pointer-events:auto;padding:12px;box-sizing:border-box;z-index:65}
#kbwin[hidden]{display:none}#kbwin .card{width:min(720px,100%);padding:16px}
#kbwin .kbtop{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}#kbwin h1{font-size:22px;margin:0}
#kbwin .kbg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 14px;margin:6px 0 4px}
#kbwin .kbr{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid #2c261d;font-size:13px}
#kbwin .kbr .nm{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#kbwin .kbr .nm i{font-style:normal;color:var(--muted);font-size:12px}
#kbwin .kbr button{min-width:92px;padding:5px 8px;font-size:13px;border-radius:3px;border:1px solid var(--line,#4e4030);background:#2a2216;font-variant-numeric:tabular-nums}
#kbwin .kbr button.cap{border-color:#ffd76a;color:#ffd76a;box-shadow:0 0 0 1px #ffd76a inset}
#kbwin .kbr button.def{color:#cfc6b0;background:#1a1612}#kbwin .kbr button.chg{color:#ffe7a8;border-color:#a8843e;background:#33280f}
#kbwin .kbnote{min-height:1.5em;margin:6px 0 0;font-size:13px;color:#ffd76a}#kbwin .kbnote.bad{color:#ff9a6a}
#kbwin .acts{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:10px}
#kbwin .acts button{font-size:13px;padding:7px 12px;border-radius:3px;border:1px solid var(--line,#4e4030);background:#2a2216}#kbwin .acts button.primary,#kbwin .kbtop button{border:1px solid var(--line,#4e4030);background:#2a2216;border-radius:3px;padding:6px 12px}
@media (max-width:640px){#kbwin .kbg{grid-template-columns:1fr}#kbwin .card{padding:12px}#kbwin h1{font-size:19px}}`;document.head.appendChild(st)}
function kbRow(a){const c=KB.bind[a.id]||'',cap=KB.cap===a.id,sid=a.slot!=null?P.bar[a.slot]:null,sp=sid&&SPELLS[sid];
  return `<div class="kbr"><span class="nm">${a.n}${sp?` <i>${sp.n}</i>`:''}</span><button type="button" class="${cap?'cap':c===a.def?'def':'chg'}" data-kb="${a.id}" aria-pressed="${cap}" title="눌러서 바꾸기 · 오른쪽 클릭: 비우기">${cap?'키를 누르세요…':kbLong(c)}</button></div>`}
function kbRender(){const w=KB.win;if(!w||w.hidden)return;if(KB.p!==P)kbSync();
  const slots=KB_ACTS.filter(a=>a.slot!=null),rest=KB_ACTS.filter(a=>a.slot==null);
  w.querySelector('.kbbody').innerHTML=`<h2>단축칸 마법</h2><div class="kbg">${slots.map(kbRow).join('')}</div><h2>물약 · 창</h2><div class="kbg">${rest.map(kbRow).join('')}</div>`;
  const n=w.querySelector('.kbnote');n.textContent=KB.note||(KB.cap?'바꿀 키를 누르세요. Shift · Alt · Ctrl과 함께 눌러도 됩니다. Esc: 취소':'');n.className='kbnote'+(KB.bad?' bad':'')}
function kbOpen(){if(curSlot<0||!P){msg('캐릭터를 고른 뒤에 단축키를 바꿀 수 있습니다','#a39d8f');return}
  if(!KB.win){const w=document.createElement('div');w.id='kbwin';w.hidden=true;
    w.innerHTML=`<div class="card" role="dialog" aria-modal="true" aria-labelledby="kbtitle"><div class="kbtop"><h1 id="kbtitle">단축키</h1><button class="ghost" type="button" data-kbclose="1">닫기</button></div>
<p class="muted" style="margin:6px 0 0">바꿀 칸을 누른 다음 새 키를 누르세요. <b>Shift · Alt · Ctrl + 키</b>나 <b>F1~F8</b>처럼 이동(WASD)과 같이 누르기 쉬운 키를 쓸 수 있습니다. 다른 곳에서 쓰던 키를 고르면 두 자리가 서로 바뀝니다. 이 캐릭터에만 저장됩니다.</p>
<div class="kbnote" aria-live="polite"></div><div class="kbbody"></div>
<div class="acts"><button class="ghost" type="button" data-kbreset="1">모두 기본값으로</button><button class="primary" type="button" data-kbclose="1">닫기</button></div></div>`;
    document.body.appendChild(w);KB.win=w;
    w.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
      if(b.dataset.kbclose){kbClose();return}
      if(b.dataset.kbreset){kbReset();KB.cap=null;KB.note='모든 단축키를 기본값으로 되돌렸습니다';KB.bad=false;kbSave();kbRender();return}
      if(b.dataset.kb){KB.cap=KB.cap===b.dataset.kb?null:b.dataset.kb;KB.note='';KB.bad=false;kbRender()}});
    w.addEventListener('contextmenu',e=>{const b=e.target.closest('button[data-kb]');if(!b)return;e.preventDefault();const a=KB_BY[b.dataset.kb];kbSet(a.id,'');KB.cap=null;KB.note=`${a.n}: 키를 비웠습니다`;KB.bad=false;kbSave();kbRender()});
    w.addEventListener('pointerdown',e=>{if(e.target===w)kbClose()})}
  KB.cap=null;KB.note='';KB.bad=false;KB.win.hidden=false;KB.wasPaused=paused;paused=true;keys.clear();kbRender()}
function kbClose(){if(!KB.win||KB.win.hidden)return;KB.win.hidden=true;KB.cap=null;
  paused=!$('#intro').hidden||!panel.hidden||!$('#death').hidden;if(!panel.hidden)renderPanel()}
const kbIsOpen=()=>!!(KB.win&&!KB.win.hidden);
// 바꿀 키를 기다리는 중
function kbCapture(e){e.preventDefault();e.stopImmediatePropagation();
  if(KB_MODS.has(e.code))return;
  const a=KB_BY[KB.cap];if(!a){KB.cap=null;return}
  if(e.code==='Escape'&&!e.shiftKey&&!e.altKey&&!e.ctrlKey){KB.cap=null;KB.note='';kbRender();return}
  if(e.metaKey){KB.note='⌘/Windows 키 조합은 쓸 수 없습니다';KB.bad=true;kbRender();return}
  const c=kbCombo(e),other=KB.map[c],why=kbSet(a.id,c);
  if(why){KB.note=`${kbLong(c)}: ${why}`;KB.bad=true;kbRender();return}
  KB.cap=null;KB.bad=false;KB.note=other&&other!==a?`${a.n} ← ${kbLong(c)} · ${other.n}에는 ${kbLong(KB.bind[other.id])}`:`${a.n} ← ${kbLong(c)}`;kbSave();kbRender()}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-kbopen]');if(b){e.preventDefault();kbOpen()}});

/* 여는 곳: 시작 화면(조작법) · 스킬 트리 창 */
{const k=document.querySelector('#intro .keys');if(k){const r=document.createElement('div');r.className='row';r.style.marginTop='8px';
  r.innerHTML='<button class="ghost" type="button" data-kbopen="1">단축키 바꾸기</button><span class="muted" style="align-self:center">Shift · Alt · Ctrl + 숫자, F1~F8 같은 키로 단축칸을 옮길 수 있습니다</span>';k.after(r)}}
{const _th=treeHtml;treeHtml=function(){let h=_th.apply(this,arguments);const b=' <button class="ghost kbbtn" type="button" data-kbopen="1">단축키 바꾸기</button>',i=h.indexOf('</div><div class="treetabs">');
  if(i>=0)h=h.slice(0,i)+b+h.slice(i);try{h=kbTreeExtras(h)}catch(_){}return h}}

/* v18 (SYS): 스킬 트리에서 고른 마법 옆의 작은 + (그 자리에서 1점 찍기) · 고른 뒤 단축키를 누르면 그 칸에 등록 */
// 찍을 수 없는 까닭 (찍을 수 있으면 '')
function kbLearnWhy(id){const s=SPELLS[id];if(!s)return '알 수 없는 마법';const base=P.sk[id]||0;
  if(base>=MAXSK)return `최대 ${MAXSK}점까지 찍었습니다`;
  if(isAdv(id)&&!P.job2)return '상위 기술: 2차 전직 뒤에 찍을 수 있습니다';// v19
  if(P.lvl<ptNeed(id))return base&&P.lvl>=reqLvOf(id)?`다음 점수는 레벨 ${ptNeed(id)}부터`:`레벨 ${ptNeed(id)} 필요`;
  const miss=(PRE[id]||[]).filter(p=>!P.sk[p]);if(miss.length)return `선행 마법 ${miss.map(p=>SPELLS[p].n).join(', ')}에 1점 이상 필요`;
  if(P.sp<=0)return '남은 스킬 포인트가 없습니다';
  return canLearn(id)?'':'지금은 찍을 수 없습니다'}
const kbCanBind=id=>{const s=SPELLS[id];return !!s&&s.cls===P.cls&&s.kind!=='passive'&&skLv(id)>0};
function kbTreeExtras(h){const id=nodeSel;if(!id||!SPELLS[id])return h;
  const m=new RegExp('<button class="node[^"]*"[^>]*data-node="'+id+'"[^>]*style="left:(-?[\\d.]+)px;top:(-?[\\d.]+)px"[^>]*>').exec(h);
  if(m){const e=h.indexOf('</button>',m.index);if(e>0){const x=+m[1],y=+m[2],why=kbLearnWhy(id),s=SPELLS[id];
    const pb=`<button class="nodeplus" type="button" data-learn="${id}" data-why="${why.replace(/"/g,'&quot;')}" aria-disabled="${!!why}" aria-label="${s.n}에 1점 찍기" title="${why?why.replace(/"/g,'&quot;'):`${s.n}에 1점 찍기 (남은 ${P.sp}점)`}" style="left:${x+35}px;top:${y-9}px">+</button>`;
    h=h.slice(0,e+9)+pb+h.slice(e+9)}}
  if(kbCanBind(id)&&KB.picked===id){const hint=`<div class="kbhint" role="note">단축키를 누르면 이 칸에 등록 <span class="muted">· 고른 마법 「${SPELLS[id].n}」 · 1~0, \`, F1~F8이나 바꾼 단축키 (휴대폰은 아래 칸 단추)</span></div>`;
    const j=h.indexOf('<div class="detail">');if(j>=0)h=h.slice(0,j)+hint+h.slice(j)}
  return h}
{const st=document.createElement('style');st.textContent=`.tree .nodeplus{position:absolute;z-index:3;width:24px;height:24px;border-radius:50%;padding:0;border:1px solid #d6b262;background:#3a2c12;color:#ffe7a8;font-size:17px;font-weight:700;line-height:20px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,.8)}
.tree .nodeplus:hover{background:#5a4418}.tree .nodeplus[aria-disabled="true"]{border-color:#5a4a36;background:#1e1a14;color:#6e624e;cursor:not-allowed}
.kbhint{margin:6px 0 2px;font-size:13px;color:#ffd76a}.kbhint .muted{display:inline}
@media (max-width:640px){.tree .nodeplus{width:28px;height:28px;font-size:19px;line-height:24px}}`;document.head.appendChild(st)}
// 막힌 + 를 누르면 까닭을 알려 준다 (휴대폰에서는 툴팁이 없으니)
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.nodeplus[aria-disabled="true"]');if(b){e.preventDefault();e.stopPropagation();msg(b.dataset.why||'찍을 수 없습니다','#a39d8f')}},true);
// 아이콘을 직접 눌러 골랐을 때만 단축키 등록을 받는다 (창을 열 때 저절로 골라진 것은 아님)
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#pbody [data-node]');if(b)KB.picked=b.dataset.node},true);
{const _cp=closePanel;closePanel=function(){KB.picked=null;return _cp.apply(this,arguments)}}
const kbPickOn=()=>!!KB.picked&&!panel.hidden&&tab==='tree'&&nodeSel===KB.picked&&kbCanBind(KB.picked);
// 점검·도구용: b5.js가 window.__game을 만든 뒤에 붙인다
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{KB,kbSet,kbBind,kbOpen,kbClose,kbReset,REC,recOf,RANK_LV})}catch(_){}},0);
