/* ---------- 구글 로그인 + 계정 저장 (같이 하기 서버 + Firebase) ---------- */
// 로그인하면 캐릭터 칸이 계정 칸으로 바뀐다. 계정 칸은 이 브라우저에도 따로 보관하고(arseia-g-<uid>-char-N),
// Firestore players/<uid> 문서의 c0~c7 필드에 {d:저장 JSON, t:저장 시각}으로 올린다.
// 로그인하지 않은 브라우저 캐릭터(arseia-char-N)는 건드리지 않는다. 계정으로는 "복사"만 한다.
let ACC=null;// {uid,name,email}
const CSL=()=>[...Array(NSAVE).keys(),'s'];
const CLOUD={ready:false,busy:false,err:'',auth:null,db:null,lastPush:{},pushT:20,state:'',FV:null};
const ACCKEY=(uid,i)=>'arseia-g-'+uid+'-char-'+i,ACCT=(uid,i)=>'arseia-g-'+uid+'-t-'+i,ACCB=(uid,i)=>'arseia-g-'+uid+'-b-'+i;
// t: 이 기기에서 마지막으로 저장한 시각, b: 마지막으로 저장소와 맞춘 시각. 저장소의 t가 b와 다르면 다른 기기에서 더 진행한 것이므로 저장소가 이긴다.
function cloudOn(){return !!(window.COOP_SERVER&&window.FIREBASE_CONFIG)}
function cloudLoadSdk(){const v='10.12.2',base=`https://www.gstatic.com/firebasejs/${v}/`;
  const add=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error(src));document.head.appendChild(s)});
  return add(base+'firebase-app-compat.js').then(()=>Promise.all([add(base+'firebase-auth-compat.js'),add(base+'firebase-firestore-compat.js')]))}
function cloudInit(){if(!cloudOn())return;CLOUD.state='로그인 준비 중…';
  cloudLoadSdk().then(()=>{const fb=window.firebase;fb.initializeApp(window.FIREBASE_CONFIG);CLOUD.auth=fb.auth();CLOUD.db=fb.firestore();CLOUD.FV=fb.firestore.FieldValue;CLOUD.ready=true;CLOUD.state='';
      CLOUD.auth.getRedirectResult&&CLOUD.auth.getRedirectResult().catch(e=>cloudErr(e));
      CLOUD.auth.onAuthStateChanged(u=>{if(u)cloudSignedIn(u);else if(ACC)cloudSwitch(null);else cloudIntro()})})
    .catch(()=>{CLOUD.state='로그인 기능을 불러오지 못했습니다. 인터넷 연결을 확인하세요';cloudIntro()})}
function cloudErr(e){const c=e&&e.code||'';CLOUD.busy=false;
  CLOUD.err=c==='auth/unauthorized-domain'?'이 주소가 Firebase에 등록되지 않았습니다. 안내서 3단계(승인된 도메인)를 확인하세요'
    :c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request'?'로그인 창이 닫혔습니다'
    :c==='permission-denied'?'저장소 규칙이 맞지 않습니다. 안내서 4단계(규칙)를 확인하세요'
    :'로그인 중 문제가 생겼습니다'+(c?` (${c})`:'');cloudIntro()}
function cloudLogin(){if(!CLOUD.ready||CLOUD.busy)return;CLOUD.busy=true;CLOUD.err='';cloudIntro();
  const pv=new window.firebase.auth.GoogleAuthProvider();pv.setCustomParameters({prompt:'select_account'});
  CLOUD.auth.signInWithPopup(pv).then(()=>{CLOUD.busy=false}).catch(e=>{
    if(e&&(e.code==='auth/popup-blocked'||e.code==='auth/operation-not-supported-in-this-environment'))return CLOUD.auth.signInWithRedirect(pv).catch(cloudErr);cloudErr(e)})}
function cloudLogout(){if(!CLOUD.auth)return;cloudPush(true);CLOUD.auth.signOut()}
// 로그인됨: 계정 칸을 받아 와서 이 브라우저의 계정 칸과 맞춘다 (더 늦게 저장된 쪽이 남는다)
function cloudSignedIn(u){if(ACC&&ACC.uid===u.uid){cloudIntro();return}
  CLOUD.busy=true;CLOUD.state='계정의 캐릭터를 불러오는 중…';cloudIntro();
  CLOUD.db.collection('players').doc(u.uid).get().then(snap=>{const doc=snap.exists?snap.data():{},up={};let lost=0;
    for(const i of CSL()){const c=doc['c'+i],ls=lsGet(ACCKEY(u.uid,i)),lt=+lsGet(ACCT(u.uid,i))||0,base=+lsGet(ACCB(u.uid,i))||0;
      if(c&&c.d){if(!ls||c.t!==base){if(ls&&lt>base&&ls!==c.d)lost++;lsSet(ACCKEY(u.uid,i),c.d);lsSet(ACCT(u.uid,i),String(c.t));lsSet(ACCB(u.uid,i),String(c.t))}
        else if(lt>c.t&&ls!==c.d){const t=Date.now();up['c'+i]={d:ls,t};lsSet(ACCB(u.uid,i),String(t));lsSet(ACCT(u.uid,i),String(t))}}
      else if(ls){const t=Date.now();up['c'+i]={d:ls,t};lsSet(ACCB(u.uid,i),String(t));lsSet(ACCT(u.uid,i),String(t))}}
    if(Object.keys(up).length)CLOUD.db.collection('players').doc(u.uid).set(up,{merge:true}).catch(cloudErr);
    for(const i of CSL())CLOUD.lastPush[i]=lsGet(ACCKEY(u.uid,i));
    CLOUD.busy=false;CLOUD.state=lost?'다른 기기에서 더 진행한 캐릭터를 불러왔습니다':'';cloudSwitch({uid:u.uid,name:u.displayName||'',email:u.email||''},true)})
  .catch(e=>{CLOUD.state='';cloudErr(e)})}
// 칸 묶음 바꾸기. 하던 캐릭터는 원래 칸에 저장하고, 새 묶음에서 다시 고르게 한다(다른 캐릭터를 덮어쓰지 않도록)
function cloudSwitch(acc,keep){const playing=$('#intro').hidden||!!introButtons.last;
  if(playing&&curSlot>=0)saveNow();cloudPush(true);
  ACC=acc;curSlot=-1;if(!keep)CLOUD.lastPush={};
  if(acc&&!NET.name)NET.meK='';
  paused=true;$('#intro').hidden=false;introButtons(false);
  if(playing)msg(acc?'구글 계정으로 로그인했습니다. 이어 할 캐릭터를 고르세요':'로그아웃했습니다. 이 브라우저의 캐릭터를 고르세요','#9fe0ff')}
const lsGet=k=>{try{return localStorage.getItem(k)}catch(_){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v);return true}catch(_){return false}};
// 저장할 때마다 시각을 남기고, 20초마다(또는 창을 가릴 때) 바뀐 칸을 올린다
function cloudSaved(slot){if(!ACC||slot<0)return;lsSet(ACCT(ACC.uid,slot),String(Date.now()))}
// 올리기 전에 저장소를 읽어서, 다른 기기가 그 사이 저장한 칸은 덮어쓰지 않는다
function cloudPush(now){if(!ACC||!CLOUD.db||CLOUD.pushing)return;const uid=ACC.uid,ch=[];
  for(const i of CSL()){const d=lsGet(ACCKEY(uid,i));if(d&&CLOUD.lastPush[i]!==d)ch.push(i)}
  if(!ch.length)return;CLOUD.pushing=true;const ref=CLOUD.db.collection('players').doc(uid);
  ref.get().then(snap=>{const doc=snap.exists?snap.data():{},up={};let clash=0;
    for(const i of ch){const c=doc['c'+i],base=+lsGet(ACCB(uid,i))||0,d=lsGet(ACCKEY(uid,i));
      if(c&&c.t!==base){clash++;CLOUD.lastPush[i]=d;continue}
      const t=Date.now();up['c'+i]={d,t};CLOUD.lastPush[i]=d;CLOUD.pend=CLOUD.pend||{};CLOUD.pend[i]=t}
    if(clash&&!CLOUD.warned){CLOUD.warned=1;msg('다른 기기에서 이 계정 캐릭터를 더 최근에 저장해서, 이 기기의 진행은 올리지 않았습니다. 캐릭터 선택에서 다시 고르면 최신으로 이어집니다','#ff9a6a')}
    if(!Object.keys(up).length)return;
    return ref.set(up,{merge:true}).then(()=>{for(const k in up){const i=k.slice(1);lsSet(ACCB(uid,i),String(up[k].t));lsSet(ACCT(uid,i),String(up[k].t))}CLOUD.err=''})})
  .catch(e=>{CLOUD.lastPush={};CLOUD.err='계정 저장에 실패했습니다. 잠시 뒤 다시 올립니다';if(e&&e.code==='permission-denied')cloudErr(e)})
  .then(()=>{CLOUD.pushing=false})}
setInterval(()=>cloudPush(),20000);addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){if($('#intro').hidden&&curSlot>=0)saveNow();cloudPush(true)}});
function cloudDel(i){if(!ACC||!CLOUD.db)return;try{localStorage.removeItem(ACCT(ACC.uid,i));localStorage.removeItem(ACCB(ACC.uid,i))}catch(_){}delete CLOUD.lastPush[i];
  CLOUD.db.collection('players').doc(ACC.uid).update({['c'+i]:CLOUD.FV.delete()}).catch(()=>{})}
// 이 브라우저(로그인 전) 캐릭터를 계정 빈 칸으로 복사
function cloudCopyLocal(i){if(!ACC)return '';const s=lsGet('arseia-char-'+i);if(!s)return '';let d;try{d=JSON.parse(s)}catch(_){return ''}
  let slot=-1;for(let k=0;k<NSAVE;k++)if(!lsGet(ACCKEY(ACC.uid,k))){slot=k;break}
  if(slot<0)return '계정 캐릭터 칸이 가득 찼습니다';d.slot=slot;lsSet(ACCKEY(ACC.uid,slot),JSON.stringify(d));cloudSaved(slot);cloudPush(true);
  return `${CLASSES[d.cls].n} Lv ${d.lvl} 캐릭터를 계정으로 복사했습니다 (원래 캐릭터도 그대로 남습니다)`}
// 캐릭터 선택 화면 위쪽의 계정 칸
function cloudBox(){if(!cloudOn())return '';
  let h='<div class="acct">';
  if(ACC){h+=`<span>구글 계정 <b>${esc(ACC.name||ACC.email)}</b>${ACC.name&&ACC.email?` <em class="muted">${esc(ACC.email)}</em>`:''}<br><em class="muted">캐릭터가 계정에 저장됩니다. 어느 기기에서 로그인해도 이어서 합니다.</em></span><button class="ghost" type="button" id="accOut">로그아웃</button>`}
  else h+=`<span>구글로 로그인하면 캐릭터가 계정에 저장되어 어느 기기에서나 이어서 할 수 있습니다.</span><button class="primary" type="button" id="accIn"${CLOUD.ready&&!CLOUD.busy?'':' disabled'}>${CLOUD.busy?'로그인 중…':'구글로 로그인'}</button>`;
  h+='</div>';if(CLOUD.state||CLOUD.err)h+=`<p class="muted" style="margin:4px 0 0;color:${CLOUD.err?'#ff9a6a':''}">${esc(CLOUD.err||CLOUD.state)}</p>`;
  if(ACC){let loc='';for(let i=0;i<NSAVE;i++){const s=lsGet('arseia-char-'+i);let d=null;try{d=s&&JSON.parse(s)}catch(_){}if(!d||!CLASSES[d.cls])continue;
      loc+=`<li>${CLASSES[d.cls].n} · Lv ${d.lvl} <button class="ghost sm" type="button" data-cpy="${i}">계정으로 복사</button></li>`}
    if(loc)h+=`<details class="acct-loc"><summary>로그인 전에 이 브라우저에서 키운 캐릭터 가져오기</summary><ul>${loc}</ul><p class="muted" id="cpyMsg"></p></details>`}
  return h}
function cloudWire(box,resume){const i=box.querySelector('#accIn');if(i)i.onclick=cloudLogin;const o=box.querySelector('#accOut');if(o)o.onclick=cloudLogout;
  box.querySelectorAll('[data-cpy]').forEach(b=>b.onclick=()=>{const m=cloudCopyLocal(+b.dataset.cpy);introButtons(resume);const el=$('#cpyMsg');if(el){el.textContent=m;el.closest('details').open=true}})}
function cloudIntro(){if($('#intro')&&!$('#intro').hidden)introButtons(!!introButtons.last)}
