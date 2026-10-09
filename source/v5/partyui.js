/* ---------- v17: 파티 지원 마법 표시 · 파티 창 ----------
   1) 치유·강화·가호 마법마다 「파티(주변)」/「한 명」/「자신만」(v18)을 스킬 트리 칸, 자세히 보기·수치표, 단축칸 모서리에 표시한다.
      규칙(PUI.rule)은 실제로 누구에게 걸리는지를 그대로 옮긴 것이다:
        · net.js netGhostCast: 동료의 마법 중 kind가 heal/hot/shield/buff/ward이고 party 값이 있으면, 시전자 둘레 party 안의 동료에게 supFx로 걸린다
        · 지대(field)의 heal/drf/mana는 그 지대 안의 누구에게나(동료 화면에도 같은 지대가 생김) — self면 시전자를 따라다닌다
        · rez는 시전자 둘레 rad 안의 쓰러진 동료, atone(공격)은 시전할 때 시전자 둘레 400 안의 동료가 절반 회복
        · 그 밖의 치유·강화·보호막·무적·갑옷은 자신에게만
   2) 파티 창(net.js의 옛 #party 대신): 내 정보 아래에 동료(이름·직업·레벨·생명력·마나)와 걸린 강화를 작은 아이콘 + 남은 초로 보여 준다. 내 강화도 같은 줄로.
      동료의 강화는 상태 메시지(st)에 덧붙인 bf=[[id,남은초,흡수량?],…]로 받는다(옛 클라이언트는 무시, 없으면 내가 건 것만 기억해 보여 줌).
   규칙·수치는 바꾸지 않는다. */
const PUI={
  PK:new Set(['heal','hot','shield','buff','ward']),
  SUPK:new Set(['heal','hot','shield','absorb','buff','ward','invuln','armor','cleanse','rez']),
  src:{},mine:new Map(),ic:new Map(),lastH:'',nextT:0,el:null,
  LBL:{area:'파티(주변)',one:'한 명',self:'자신만'},
  rule(s){if(!s||s.kind==='passive')return null;
    // v18: 「한 명」 — 고른 동료 한 명(없거나 멀면 나). party18.js의 PTY가 대상을 고르고 cast 메시지에 tg를 싣는다
    if(s.one)return{party:false,one:true,mode:'one',how:'one',r:650,short:'한 명 · 고른 동료 (650 안)',text:'파티 창이나 화면의 동료를 눌러(또는 Tab) 고른 동료 한 명에게 겁니다. 고르지 않았거나 멀면 나에게 걸립니다'};
    if(s.kind==='rez')return{party:true,mode:'area',how:'downed',r:s.rad,short:`파티(주변) · 쓰러진 동료 ${s.rad}`,text:`시전자 둘레 ${s.rad} 안의 쓰러진 동료를 살립니다 (나에게는 걸리지 않음)`};
    if(this.PK.has(s.kind)&&s.party)return{party:true,mode:'area',how:'radius',r:s.party,short:`파티(주변) · 둘레 ${s.party}`,text:`나와, 시전할 때 내 둘레 ${s.party} 안에 있는 동료 모두에게 걸립니다`};
    if(s.kind==='field'&&(s.heal||s.drf||s.mana))return{party:true,mode:'area',how:'zone',r:s.rad,short:`파티(주변) · 지대 안`,text:s.self?`나를 따라다니는 지대(반경 ${s.rad}) 안에 있는 동료 모두에게 듣습니다`:`땅에 깐 지대(반경 ${s.rad}) 안에 있는 동료 모두에게 듣습니다`};
    if(s.atone)return{party:true,mode:'area',how:'cast',r:400,short:'파티(주변) · 시전 둘레 400',text:'시전하면 나와, 내 둘레 400 안의 동료도 생명력을 되찾습니다(동료는 절반)'};
    if(this.SUPK.has(s.kind)||s.absorb||s.cleanse)return{party:false,mode:'self',how:'self',r:0,short:'자신만',text:'자신에게만 걸립니다 (동료에게는 걸리지 않음)'};
    return null},
  /* 동료가 이미 이 강화를 갖고 있나 (갱신이면 작은 맥박) */
  has(r,s){const now=time;if(Array.isArray(r.bf)){const el=now-(r.bfT||now);return r.bf.some(e=>e[1]-el>0&&(e[0]===s.id||(s.kind==='shield'&&e[0]==='_sh')))}
    const t=this.mine.get(r.id+'|'+s.id);return !!t&&t>now},
  mark(r,s){if(s.dur&&s.kind!=='heal')this.mine.set(r.id+'|'+s.id,time+s.dur);if(this.mine.size>80)this.mine.clear()},
  /* 내 강화 목록 (상태 메시지와 내 줄에 함께 씀) */
  myBuffs(){const o=[];if(!P)return o;
    for(const id in P.buffs){const b=P.buffs[id];if(!b||!(b.t>0)||id.startsWith('_'))continue;o.push([id,Math.ceil(b.t)])}
    if(P.hot&&P.hot.t>0)o.push([this.src.hot&&SPELLS[this.src.hot]?this.src.hot:'_hot',Math.ceil(P.hot.t)]);
    if(P.shield>0&&P.shieldT>0)o.push([P.shieldS&&P.shieldS.id||'_sh',Math.ceil(P.shieldT),Math.round(P.shield)]);
    if(P.ward&&P.ward.t>0)o.push([this.src.ward&&SPELLS[this.src.ward]?this.src.ward:'_ward',Math.ceil(P.ward.t)]);
    return o.slice(0,8)},
  icon(id){let h=this.ic.get(id);if(h)return h;const s=SPELLS[id]||{id:'pui'+id,kind:id==='_sh'?'shield':id==='_hot'?'hot':'ward',el:'holy'};h=spellSvg(s);this.ic.set(id,h);return h},
  chips(list,el){let h='';for(const e of list){const left=Math.ceil(e[1]-(el||0));if(left<=0)continue;const s=SPELLS[e[0]];
      h+=`<span class="pbi" title="${s?s.n:'강화'}${e[3]?` · ${e[3]}레벨${e[4]?` · ${e[4]}님`:''}`:''}${e[2]?` · ${e[2]} 흡수`:''} · ${left}초">${this.icon(e[0])}<em>${left>99?'99+':left}</em></span>`}return h},
  frames(){if(!P)return '';let h='';const me=this.chips(this.myBuffs());
    if(me)h+=`<div class="pf me"><div class="pbf">${me}</div></div>`;
    if(NET.on)for(const r of NET.peers.values()){if(!r.seen&&!r.name)continue;const C=CLASSES[r.cls]||CLASSES.mage,same=netSame(r),hp=clamp((r.hp||0)/(r.max||1),0,1),mp=clamp((r.mp||0)/(r.mmax||1),0,1);
      let bl;if(Array.isArray(r.bf))bl=this.chips(r.bf,time-(r.bfT||time));else{const a=[];for(const [k,t] of this.mine)if(k.startsWith(r.id+'|')&&t>time)a.push([k.slice(String(r.id).length+1),t-time]);bl=this.chips(a)}
      const sel=typeof PTY!=='undefined'&&PTY.tgt===r.id;
      h+=`<div class="pf${r.dead?' dead':''}${same?'':' far'}${sel?' sel':''}" data-pid="${esc(String(r.id))}" title="눌러서 「한 명」 지원 마법의 대상으로 고르기 (Tab)"><div class="pn"><b>${esc(r.name||'동료')}</b><small>Lv${r.lvl||1} ${C.n}${r.id===NET.hostId?' · 방장':''}${r.dead?' · 쓰러짐':same?'':' · 다른 곳'}</small>${sel?'<span class="ptg">◆ 대상</span>':''}</div>`+
        `<div class="pb hp"><i style="width:${(hp*100).toFixed(0)}%"></i></div><div class="pb mp"><i style="width:${(mp*100).toFixed(0)}%"></i></div>${bl?`<div class="pbf">${bl}</div>`:''}</div>`}
    return h},
  tick(force){const now=performance.now();if(!force&&now<this.nextT)return;this.nextT=now+200;
    if(!this.el){const w=document.querySelector('#hud .leftcol .who');if(!w)return;this.el=document.createElement('div');this.el.id='pframes';w.after(this.el);
      // v18: 동료 칸을 누르면 「한 명」 지원 대상으로 고른다(다시 누르면 풀림)
      this.el.addEventListener('pointerdown',e=>{const f=e.target.closest('.pf[data-pid]');if(!f||typeof PTY==='undefined')return;e.stopPropagation();e.preventDefault();
        const r=[...NET.peers.values()].find(o=>String(o.id)===f.dataset.pid);if(r)PTY.sel(PTY.tgt===r.id?null:r.id)})}
    const h=this.frames();if(h!==this.lastH){this.lastH=h;this.el.innerHTML=h;this.el.hidden=!h}},
  mc(r){return r.mode==='one'?'o':r.party?'p':'s'},lbl(r){return this.LBL[r.mode||(r.party?'area':'self')]},
  badge(s,cls){const r=this.rule(s);if(!r)return '';return `<span class="${cls} ${this.mc(r)}" title="${this.lbl(r)}: ${r.text}">${this.lbl(r)}</span>`},
  mark1(s){const r=this.rule(s);if(!r)return '';return `<span class="ptm ${this.mc(r)}" aria-label="${this.lbl(r)}">${r.mode==='one'?this.SVG3:r.party?this.SVG2:this.SVG1}</span>`},
  SVG1:'<svg viewBox="0 0 12 12"><circle cx="6" cy="4" r="2.2"/><path d="M2 11c0-2.6 1.8-4 4-4s4 1.4 4 4z"/></svg>',
  SVG3:'<svg viewBox="0 0 12 12"><circle cx="6" cy="4.2" r="2"/><path d="M2.6 11c0-2.3 1.5-3.5 3.4-3.5s3.4 1.2 3.4 3.5z"/><path d="M0.4 1.2h2.4v1H1.4v1.4H.4zM11.6 1.2H9.2v1h1.4v1.4h1z"/></svg>',
  SVG2:'<svg viewBox="0 0 12 12"><circle cx="4" cy="4.2" r="1.9"/><circle cx="8.4" cy="3.6" r="1.7"/><path d="M0.6 11c0-2.3 1.5-3.6 3.4-3.6S7.4 8.7 7.4 11zM6.6 7.2c.5-.4 1.1-.6 1.8-.6 1.8 0 3 1.2 3 3.4H8.2"/></svg>'};
/* 기존 화면 함수에 덧붙이기 (b5.js의 함수 선언은 IIFE 안에서 미리 올라와 있어 여기서 감쌀 수 있다) */
{const _na=numsAt;numsAt=function(id,L){const o=_na(id,L),r=PUI.rule(SPELLS[id]);if(r)o.unshift(['대상',r.short]);return o};
 const _dh=detailHtml;detailHtml=function(id){const h=_dh(id),r=PUI.rule(SPELLS[id]);if(!r)return h;
   return h.replace('</div><div class="d">',`</div><div class="ptyline ${PUI.mc(r)}">「${PUI.lbl(r)}」 ${r.text}</div><div class="d">`)};
 const _th=treeHtml;treeHtml=function(){return _th().replace(/(<button class="node[^"]*" type="button" data-node="([^"]+)"[^>]*>)/g,(m,a,id)=>a+PUI.badge(SPELLS[id],'ptb'))};
 const _sb=slotBtn;slotBtn=function(i){let h=_sb(i);const id=P.bar[i],s=id&&SPELLS[id],r=s&&PUI.rule(s);if(!r)return h;
   h=h.replace(`title="${s.n} (`,`title="[${PUI.lbl(r)}] ${s.n} (`);return h.replace('<span class="ab">',PUI.mark1(s)+'<span class="ab">')};
 const _uh=updateHud;updateHud=function(){_uh();PUI.tick()};
 const st=document.createElement('style');st.textContent=`
#party{display:none!important}
#pframes{display:flex;flex-direction:column;gap:4px;pointer-events:auto;max-width:200px}
#pframes .pf{background:rgba(16,13,10,.82);border:1px solid #4e4030;border-radius:4px;padding:4px 6px;min-width:150px}
#pframes .pf.me{padding:3px 4px;min-width:0;background:rgba(16,13,10,.6)}
#pframes .pf.dead{filter:grayscale(1);opacity:.7}#pframes .pf.far{opacity:.6}
#pframes .pn{display:flex;gap:6px;align-items:baseline;font-size:12px;line-height:1.2;white-space:nowrap;overflow:hidden}#pframes .pn b{color:#efe2c0;overflow:hidden;text-overflow:ellipsis;max-width:90px}#pframes .pn small{color:#a39d8f;font-size:10.5px}
#pframes .pb{height:4px;background:#2a2118;border-radius:2px;margin-top:2px;overflow:hidden}#pframes .pb i{display:block;height:100%}#pframes .pb.hp i{background:#c0362c}#pframes .pb.mp i{background:#3b6fd6}
#pframes .pbf{display:flex;flex-wrap:wrap;gap:2px;margin-top:3px}
#pframes .pbi{position:relative;width:20px;height:20px;border:1px solid #6a5a30;border-radius:3px;background:#100e0b;display:inline-flex;align-items:center;justify-content:center}
#pframes .pbi svg{width:15px;height:15px}#pframes .pbi em{position:absolute;right:-2px;bottom:-3px;font-style:normal;font-size:9px;line-height:1;color:#fff;text-shadow:0 0 2px #000,0 0 2px #000;font-variant-numeric:tabular-nums}
.node .ptb{position:absolute;left:50%;top:-7px;transform:translateX(-50%);font-size:9px;line-height:1;padding:1px 3px;border-radius:3px;white-space:nowrap;pointer-events:none;z-index:1}
.node .ptb.p{background:#14301c;color:#9fe39a;border:1px solid #3f7a46}.node .ptb.o{background:#2c2410;color:#ffd76a;border:1px solid #8a7030}.node .ptb.s{background:#262019;color:#c8b88a;border:1px solid #5a4a36}
.ptyline{font-size:12.5px;margin:2px 0 4px}.ptyline.p{color:#9fe39a}.ptyline.o{color:#ffd76a}.ptyline.s{color:#c8b88a}
.sk .ptm{position:absolute;top:1px;right:1px;width:13px;height:13px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:1}
.sk .ptm svg{width:10px;height:10px;filter:none}.sk .ptm.p{background:#14301c;border:1px solid #6fc070;fill:#b8f0b0}.sk .ptm.o{background:#2c2410;border:1px solid #c8a040;fill:#ffe39a}.sk .ptm.s{background:rgba(20,17,13,.85);border:1px solid #5a4a36;fill:#a39d8f}
@media (max-width:640px){#pframes{max-width:150px}#pframes .pf{min-width:118px;padding:3px 5px}#pframes .pbi{width:17px;height:17px}#pframes .pbi svg{width:13px;height:13px}.sk .ptm{width:11px;height:11px}.sk .ptm svg{width:8px;height:8px}}`;
 document.head.appendChild(st)}
window.__pui=PUI;
