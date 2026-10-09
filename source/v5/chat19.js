/* ---------- v19: 대화 (같이 하기 서버 주소에서만) ----------
   서버 주소로 들어온 사람은 파티가 아니어도 서로 대화한다. 채널 셋:
     「전체」 서버에 들어온 모두 · 「파티」 같은 파티(방)만 · 「귓속말」 한 사람에게만
   · 명령: /w 이름 할말 (/귓) · /r 할말 (마지막 귓속말에 답) · /p 할말 (/파티) · /a 할말 (/전체)
           /mute 이름 (/숨김: 이 브라우저에서 그 사람 글을 숨김) · /unmute 이름 (/숨김해제) · /도움
   · 줄마다 [전체]/[파티]/[귓속말] 표시와 색. 대화창을 연 채로 이름을 누르면 그 사람에게 귓속말. 입력칸 왼쪽 단추(또는 Tab)로 채널 바꾸기.
   · 5초에 5번까지 · 120자 · 모든 글은 글자로만 그린다(HTML은 그대로 글자로 보임). 서버가 최근 「전체」 30줄을 들어올 때 보내 준다.
   · 옛 서버(v18)는 hello에 f:['chat2']가 없다 → 「전체」만 쓴다(파티·귓속말 글이 모두에게 새지 않게).
   · 서버 없이 연 한 파일 게임: 대화 버튼은 숨겨진 채, 아무것도 열거나 보내지 않는다.
   · 저장과 무관. 숨긴 이름 목록만 이 브라우저의 arseia-chat-mute 한 키에 둔다(캐릭터 키는 건드리지 않음).
   net.js의 대화 함수(chatBox·chatOpen·chatClose·chatLine·chatAdd)를 이 파일이 바꿔 끼운다. */
const CHAT={ch:'all',wTo:0,wName:'',lastW:null,rl:[],RL_N:5,RL_MS:5000,MAX:120,HIST:30,mutes:null,seen:new Set(),seenQ:[],
  TAG:{all:'전체',party:'파티',w:'귓속말'},
  COL:{all:'#d6b262',party:'#7fd4ff',w:'#e79cff'},
  on(){return !!window.COOP_SERVER},
  srv2(){return !!NET.chat2},
  live(){return !!(NET.ws&&NET.ws.readyState===1)},
  /* 이 브라우저에서 숨긴 이름 */
  muteList(){if(!this.mutes){let a=[];try{a=JSON.parse(localStorage.getItem('arseia-chat-mute')||'[]')}catch(_){}this.mutes=new Set(Array.isArray(a)?a.filter(x=>typeof x==='string').slice(0,50):[])}return this.mutes},
  muteKey:n=>String(n||'').replace(/\s+/g,' ').trim().toLowerCase(),
  muted(n){return this.muteList().has(this.muteKey(n))},
  setMute(n,on){const k=this.muteKey(n);if(!k)return false;const L=this.muteList();if(on){if(L.size>=50&&!L.has(k))return false;L.add(k)}else L.delete(k);
    try{localStorage.setItem('arseia-chat-mute',JSON.stringify([...L]))}catch(_){}return true},
  /* 5초에 5번 (서버와 같은 규칙: 미리 막아 서버까지 가지 않게) */
  rlOk(now){const q=this.rl;while(q.length&&now-q[0]>=this.RL_MS)q.shift();if(q.length>=this.RL_N)return false;q.push(now);return true},
  /* 입력 한 줄 → 무엇을 할지. lobby: [{id,n}] (이름 찾기용, 기본은 서버의 접속자 목록) */
  parse(s,lobby){s=String(s==null?'':s).replace(/\s+/g,' ').trim();if(!s)return null;lobby=lobby||NET.lobby||[];
    const cut=x=>x.slice(0,this.MAX);
    if(s[0]!=='/'){const o={ch:this.ch,x:cut(s)};if(o.ch==='w'){o.to=this.wTo;o.tn=this.wName}return o}
    const sp=s.indexOf(' '),cmd=(sp<0?s.slice(1):s.slice(1,sp)).toLowerCase(),rest=sp<0?'':s.slice(sp+1).trim();
    if(/^(w|귓|귓속말|whisper|m|msg)$/.test(cmd)){if(!rest)return{err:'사용법: /w 이름 할말'};
      // 이름에 빈칸이 있을 수 있어 접속자 이름 중 가장 긴 것부터 맞춰 본다
      const lo=rest.toLowerCase();let hit=null;
      for(const o of lobby){const n=String(o.n||''),l=n.toLowerCase();if(!l||o.id===NET.id)continue;if((lo===l||lo.startsWith(l+' '))&&(!hit||n.length>hit.n.length))hit=o}
      const tn=hit?hit.n:rest.split(' ')[0],x=rest.slice(tn.length).trim();
      if(this.muteKey(tn)===this.muteKey(netName())&&!hit)return{err:'자기 자신에게는 귓속말을 보낼 수 없습니다'};
      return x?{ch:'w',to:hit?hit.id:0,tn,x:cut(x)}:{cmd:'wset',to:hit?hit.id:0,tn}}
    if(/^(r|답|답장)$/.test(cmd)){if(!this.lastW)return{err:'아직 받은 귓속말이 없습니다'};if(!rest)return{cmd:'wset',to:this.lastW.id,tn:this.lastW.n};return{ch:'w',to:this.lastW.id,tn:this.lastW.n,x:cut(rest)}}
    if(/^(p|파티|party)$/.test(cmd))return rest?{ch:'party',x:cut(rest)}:{cmd:'ch',ch:'party'};
    if(/^(a|전체|all|s)$/.test(cmd))return rest?{ch:'all',x:cut(rest)}:{cmd:'ch',ch:'all'};
    if(/^(mute|숨김|차단)$/.test(cmd))return rest?{cmd:'mute',tn:rest}:{cmd:'mutes'};
    if(/^(unmute|숨김해제|차단해제)$/.test(cmd))return rest?{cmd:'unmute',tn:rest}:{err:'사용법: /unmute 이름'};
    if(/^(help|도움|도움말|\?)$/.test(cmd))return{cmd:'help'};
    return{err:'모르는 명령입니다. /도움 으로 명령을 봅니다'}},
  /* 받은 대화 한 줄 → HTML (이름·글은 모두 글자로) */
  fmt(m,me){const ch=this.TAG[m.ch]?m.ch:'all',mine=m.from===me,c=this.COL[ch];
    const nb=(id,n,col)=>`<b class="cn" data-id="${esc(String(id|0))}" data-n="${esc(n)}" style="color:${col}">${esc(n)}</b>`;
    let who;if(ch==='w')who=mine?`→ ${nb(m.to,m.tn||'',c)}`:nb(m.from,m.n||'',c);
    else who=nb(m.from,m.n||'',mine?'#ffd98a':ch==='party'||m.p?'#9fe0ff':'#c9c1ad');
    const tm=m.hist&&m.ts?`<small class="ctm">${new Date(m.ts).toTimeString().slice(0,5)}</small> `:'';
    return `${tm}<span class="ctag" style="color:${c}">[${this.TAG[ch]}]</span> ${who}<span class="csep">:</span> <span class="cx"${ch==='all'?'':` style="color:${c}"`}>${esc(String(m.x==null?'':m.x).slice(0,this.MAX))}</span>`},
  /* 이 줄을 보여 줄까 (숨긴 이름) */
  accept(m){if(!m||m.from===NET.id)return true;return !this.muted(m.n)},
  sys(t,col){if(!this.on()){msg(t,col);return}chatLine(`<i style="color:${col||'#a39d8f'}">${esc(t)}</i>`)},
  chans(){const a=['all'];if(this.srv2()){if(NET.on)a.push('party');if(this.wTo||this.wName)a.push('w')}return a},
  setCh(ch){if(ch!=='all'&&!this.srv2()){this.sys('이 서버는 아직 파티·귓속말 대화를 모릅니다. 서버를 새 버전으로 올려 주세요','#ff9a6a');ch='all'}
    if(ch==='party'&&!NET.on){this.sys('파티에 들어가 있지 않습니다','#ff9a6a');ch='all'}
    if(ch==='w'&&!(this.wTo||this.wName))ch='all';this.ch=ch;this.label()},
  setW(id,n){if(!n)return;if(id&&id===NET.id)return;this.wTo=id|0;this.wName=n;this.setCh('w')},
  cycle(){const a=this.chans();this.setCh(a[(a.indexOf(this.ch)+1)%a.length])},
  label(){const b=document.getElementById('chatCh'),i=document.getElementById('chatIn');if(!b||!i)return;
    if(this.ch==='party'&&!NET.on)this.ch='all';
    const t=this.ch==='w'?'→'+this.wName:this.TAG[this.ch];b.textContent=t.length>9?t.slice(0,8)+'…':t;b.style.color=this.COL[this.ch];b.title='채널 바꾸기 (Tab)';
    i.placeholder=(this.ch==='w'?`${this.wName}님에게 귓속말`:this.ch==='party'?'파티에게':'모두에게')+' · Enter 보내기 · /도움'},
  help(){this.sys('/w 이름 할말 — 귓속말 · /r 할말 — 답장 · /p 할말 — 파티 · /a 할말 — 전체','#c9c1ad');
    this.sys('/mute 이름 — 그 사람 글 숨기기 · /unmute 이름 — 다시 보기 · 대화창에서 이름을 누르면 귓속말','#c9c1ad')},
  /* 입력 한 줄 처리. 보냈으면 true */
  send(text){if(!this.on())return false;const r=this.parse(text);if(!r)return false;
    if(r.err){this.sys(r.err,'#ff9a6a');return false}
    if(r.cmd==='help'){this.help();return false}
    if(r.cmd==='mute'){if(this.muteKey(r.tn)===this.muteKey(netName())){this.sys('자기 이름은 숨길 수 없습니다','#ff9a6a');return false}
      this.sys(this.setMute(r.tn,true)?`${r.tn}님의 글을 이 브라우저에서 숨깁니다 (/unmute ${r.tn} 로 다시 보기)`:'더 숨길 수 없습니다 (50명까지)','#a39d8f');return false}
    if(r.cmd==='unmute'){const was=this.muted(r.tn);this.setMute(r.tn,false);this.sys(was?`${r.tn}님의 글을 다시 봅니다`:`${r.tn}님은 숨긴 적이 없습니다`,'#a39d8f');return false}
    if(r.cmd==='mutes'){const L=[...this.muteList()];this.sys(L.length?'숨긴 이름: '+L.join(', '):'숨긴 이름이 없습니다 · 사용법: /mute 이름','#a39d8f');return false}
    if(r.cmd==='ch'){this.setCh(r.ch);return false}
    if(r.cmd==='wset'){if(!this.srv2()){this.setCh('w');return false}this.setW(r.to,r.tn);return false}
    if(!this.live()){this.sys('서버에 연결되어 있지 않습니다. 잠시 뒤에 다시 해 보세요','#ff9a6a');return false}
    if(r.ch!=='all'&&!this.srv2()){this.sys('이 서버는 아직 파티·귓속말 대화를 모릅니다. 서버를 새 버전으로 올려 주세요','#ff9a6a');return false}
    if(r.ch==='party'&&!NET.on){this.sys('파티에 들어가 있지 않습니다 (모두에게는 /a 할말)','#ff9a6a');return false}
    if(r.ch==='w'&&r.to&&r.to===NET.id){this.sys('자기 자신에게는 귓속말을 보낼 수 없습니다','#ff9a6a');return false}
    if(!this.rlOk(performance.now())){this.sys('너무 빨리 보내고 있습니다. 잠시 뒤에 다시 보내세요','#ff9a6a');return false}
    const o={t:'chat',x:r.x};if(r.ch!=='all'){o.ch=r.ch;if(r.ch==='w'){if(r.to)o.to=r.to;o.tn=r.tn}}
    netSend(o);return true},
  /* 서버에서 온 새 메시지 (옛 게임은 모르는 종류라 무시) */
  onMsg(m){if(m.t==='hello'){NET.chat2=Array.isArray(m.f)&&m.f.includes('chat2');return false}
    if(m.t==='csys'){this.sys(String(m.x||''),'#ff9a6a');return true}
    if(m.t==='chist'){if(!Array.isArray(m.list))return true;const L=m.list.slice(-this.HIST).filter(h=>h&&!this.seen.has(this.key(h)));if(!L.length)return true;
      this.sys(`— 최근 대화 ${L.length}줄 —`,'#7d7568');for(const h of L)chatAdd(Object.assign({},h,{ch:'all',hist:1}));return true}
    return false},
  key:h=>(h.ts||0)+'|'+h.n+'|'+h.x,
  remember(m){if(!m.ts)return;const k=this.key(m);if(this.seen.has(k))return;this.seen.add(k);this.seenQ.push(k);if(this.seenQ.length>60)this.seen.delete(this.seenQ.shift())}};
window.__chat=CHAT;
/* net.js의 대화 함수 바꿔 끼우기 */
chatBox=function(){let el=document.getElementById('chat');if(el)return el;
  el=document.createElement('div');el.id='chat';
  el.innerHTML='<div id="chatLog" aria-live="polite"></div><div id="chatRow" hidden><button type="button" id="chatCh">전체</button><input id="chatIn" maxlength="120" autocomplete="off" enterkeyhint="send"><button type="button" id="chatX" aria-label="대화창 닫기" title="닫기 (Esc)">✕</button></div>';
  document.body.appendChild(el);
  const i=el.querySelector('#chatIn'),row=el.querySelector('#chatRow');
  // 단추·이름을 눌러도 입력칸에서 초점이 빠지지 않게 (빠지면 대화창이 닫힘)
  el.addEventListener('mousedown',e=>{if(e.target!==i&&(e.target.closest('button')||e.target.closest('.cn')))e.preventDefault()});
  el.querySelector('#chatCh').onclick=()=>{CHAT.cycle();i.focus()};
  el.querySelector('#chatX').onclick=()=>chatClose();
  el.querySelector('#chatLog').addEventListener('click',e=>{const b=e.target.closest('.cn');if(!b||!el.classList.contains('open'))return;const id=+b.dataset.id||0;if(id&&id===NET.id)return;
    if(!CHAT.srv2()){CHAT.setCh('w');return}CHAT.setW(id,b.dataset.n);i.focus()});
  i.addEventListener('keydown',e=>{e.stopPropagation();
    if(e.key==='Enter'&&!e.isComposing){e.preventDefault();const x=i.value.trim();if(x)CHAT.send(x);i.value='';if(!(typeof MOB==='object'&&MOB.on()))chatClose()}
    else if(e.key==='Escape')chatClose();
    else if(e.key==='Tab'&&!e.isComposing){e.preventDefault();CHAT.cycle()}});
  i.addEventListener('blur',()=>setTimeout(()=>{if(!el.contains(document.activeElement)&&!i.value)chatClose()},0));
  row.hidden=true;CHAT.label();return el};
chatOpen=function(){if(!CHAT.on())return;const el=chatBox(),i=el.querySelector('#chatIn');el.classList.add('open');el.querySelector('#chatRow').hidden=false;CHAT.label();
  keys.clear();mouse.l=mouse.r=false;i.focus();const log=el.querySelector('#chatLog');log.scrollTop=log.scrollHeight};
chatClose=function(){const el=document.getElementById('chat');if(!el)return;const i=el.querySelector('#chatIn');el.classList.remove('open');el.querySelector('#chatRow').hidden=true;i.blur()};
chatLine=function(html,cls){const log=chatBox().querySelector('#chatLog'),d=document.createElement('div');d.innerHTML=html;if(cls)d.className=cls;log.appendChild(d);
  while(log.children.length>50)log.firstChild.remove();log.scrollTop=log.scrollHeight;if(!/\bold\b/.test(cls||''))setTimeout(()=>d.classList.add('old'),12000)};
chatAdd=function(m){if(!m||!CHAT.accept(m))return;const mine=m.from===NET.id,ch=CHAT.TAG[m.ch]?m.ch:'all';CHAT.remember(m);
  chatLine(CHAT.fmt(m,NET.id),'cl c-'+ch+(m.hist?' hist old':''));if(m.hist)return;
  if(ch==='w'){if(!mine)CHAT.lastW={id:m.from,n:m.n};return}// 귓속말은 머리 위 말풍선 없음
  SAY.set(mine?0:m.from,{x:String(m.x||''),t:time})};
chatSys=function(t,col){CHAT.sys(t,col)};
{const _om=netOnMsg;netOnMsg=function(m){if(m&&CHAT.onMsg(m))return;return _om(m)}}
{const st=document.createElement('style');st.textContent=`
#chatRow{display:flex;align-items:stretch}#chatRow[hidden]{display:none}
#chatCh{flex:none;max-width:110px;background:rgba(10,9,8,.92);border:1px solid #8a7346;border-right:0;border-radius:0 0 0 3px;padding:0 9px;font:700 13px var(--body,sans-serif);cursor:pointer}
#chatRow #chatIn{flex:1;min-width:0;width:auto;border-radius:0}
#chatX{flex:none;background:rgba(10,9,8,.92);color:#a39d8f;border:1px solid #8a7346;border-left:0;border-radius:0 0 3px 0;padding:0 10px;font-size:14px;cursor:pointer}
#chatLog .ctag{font-size:.92em;font-weight:700;margin-right:1px}#chatLog .ctm{color:#7d7568;font-size:.85em}#chatLog .csep{color:#a39d8f}
#chat.open #chatLog .cn{cursor:pointer}#chat.open #chatLog .cn:hover{text-decoration:underline}
@media (max-width:640px){
  body #chat.open{top:calc(env(safe-area-inset-top,0px) + 130px);bottom:auto;left:8px;width:calc(100% - 16px);z-index:29;font-size:13px}
  body #chat.open #chatLog{max-height:28vh}
  #chatCh,#chatX{min-height:40px}
}`;document.head.appendChild(st)}
