<script>
/* ---------- QA 0: 자가 점검 모드(#qa) 준비 — 게임 코드보다 먼저 실행된다 ----------
   location.hash가 '#qa'일 때만 동작하고, 평소에는 아무것도 하지 않는다.
   - window.localStorage를 메모리 안의 가짜 저장소로 바꾼다 (진짜 저장소는 읽지도 쓰지도 않는다)
   - 진짜 저장소(Storage.prototype)에 닿는 모든 호출을 센다 → 끝날 때 0이어야 한다
   - 같이 하기 서버 · 구글 로그인(Firebase) · 패치노트 창을 끈다
   - Math.random을 씨앗 고정 난수로 바꿔서 매번 같은 결과가 나오게 한다
   - requestAnimationFrame을 붙잡아 게임 자체 루프를 멈춘다 (점검은 update(dt)/render()로 직접 진행) */
(function(){
  'use strict';
  if(location.hash!=='#qa')return;
  var QA=window.__QA={on:true,realAccess:0,realLog:[],sessionAccess:0,storeLog:[],seed:20261008,held:[],hold:true};
  // 1) 진짜 저장소 접근 세기: 가짜 저장소가 아닌 Storage 인스턴스에 대한 모든 메서드/길이 접근
  var SP=window.Storage&&Storage.prototype,realLS=null;
  try{var dsc=Object.getOwnPropertyDescriptor(window,'localStorage')||Object.getOwnPropertyDescriptor(Window.prototype,'localStorage');
    QA._lsDesc=dsc}catch(_){}
  var fake;try{QA.ss=window.sessionStorage}catch(_){QA.ss=null}
  if(SP){['getItem','setItem','removeItem','clear','key'].forEach(function(m){var orig=SP[m];if(typeof orig!=='function')return;
      SP[m]=function(){if(this!==fake){if(this!==QA.ss){QA.realAccess++;if(QA.realLog.length<50)QA.realLog.push(m+'('+(arguments[0]!=null?String(arguments[0]).slice(0,60):'')+')')}else QA.sessionAccess++}
        return orig.apply(this,arguments)}});
    try{var ld=Object.getOwnPropertyDescriptor(SP,'length');if(ld&&ld.get){var lg=ld.get;Object.defineProperty(SP,'length',{configurable:true,enumerable:ld.enumerable,get:function(){if(this!==fake&&this!==QA.ss){QA.realAccess++;QA.realLog.push('length')}return lg.call(this)}})}}catch(_){}}
  // 2) 메모리 저장소: Storage와 같은 모양. removeItem/clear 호출은 기록해 둔다
  function FakeStorage(){var m=new Map(),self=this;
    Object.defineProperty(this,'_m',{value:m});
    this.getItem=function(k){k=String(k);return m.has(k)?m.get(k):null};
    this.setItem=function(k,v){k=String(k);v=String(v);if(QA.quota&&v.length>QA.quota)throw new DOMException('QA quota','QuotaExceededError');m.set(k,v);QA.storeLog.push({op:'set',k:k,t:QA.phase||''})};
    this.removeItem=function(k){k=String(k);QA.storeLog.push({op:'remove',k:k,t:QA.phase||'',stack:(new Error().stack||'').split('\n').slice(2,5).join(' | ')});m.delete(k)};
    this.clear=function(){QA.storeLog.push({op:'clear',k:'*',t:QA.phase||'',stack:(new Error().stack||'').split('\n').slice(2,5).join(' | ')});m.clear()};
    this.key=function(i){var a=Array.from(m.keys());return i>=0&&i<a.length?a[i]:null};
    Object.defineProperty(this,'length',{get:function(){return m.size}});
  }
  fake=new FakeStorage();QA.store=fake;
  try{Object.defineProperty(window,'localStorage',{configurable:true,enumerable:true,get:function(){return fake},set:function(){}});}catch(e){QA.swapError=String(e)}
  QA.swapped=(function(){try{return window.localStorage===fake}catch(_){return false}})();
  // 3) 같이 하기 서버 · 구글 로그인 끄기 (서버가 먼저 넣어 둔 값도 지운다)
  ['COOP_SERVER','FIREBASE_CONFIG'].forEach(function(k){try{delete window[k]}catch(_){}try{Object.defineProperty(window,k,{configurable:true,get:function(){return undefined},set:function(){}})}catch(_){}});
  // 4) 패치노트 창: notes.js는 navigator.webdriver면 띄우지 않는다 → #qa에서도 그렇게 보이게 한다
  try{Object.defineProperty(navigator,'webdriver',{configurable:true,get:function(){return true}})}catch(_){}
  // 5) 씨앗 고정 난수 (mulberry32)
  var s=QA.seed>>>0;QA.reseed=function(n){s=n>>>0};
  Math.random=function(){s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  // 6) 게임 루프 붙잡기: 점검이 끝나면 QA.release()로 풀어 준다
  var rAF=window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame=function(cb){if(QA.hold){QA.held.push(cb);return -1}return rAF(cb)};
  QA.release=function(){QA.hold=false;var h=QA.held.splice(0);h.forEach(function(cb){rAF(cb)})};
  // 7) 오류 모으기
  QA.errors=[];
  addEventListener('error',function(e){QA.errors.push('error: '+(e.message||e.type)+(e.filename?' @'+e.lineno:''))});
  addEventListener('unhandledrejection',function(e){QA.errors.push('rejection: '+(e.reason&&e.reason.message||e.reason))});
})();
</script>
