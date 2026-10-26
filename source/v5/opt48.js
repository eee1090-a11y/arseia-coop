/* ---------- v48 휴대폰 더 가볍게 (사용자가 고른 폰 경량화 후보 2 · 5번, optimization/v47/폰-경량화-후보.md) ----------
   ② 오래 안 쓴 몬스터 그림 묶음 내려놓기 (휴대폰만)
   · 몬스터 그림 묶음(img/flare-m-*)은 한 번 받으면 끝까지 풀어 둔 채라(묶음 하나 2~6MB) 지역을 많이 돌수록 폰 메모리가 계속 늘었다.
   · 휴대폰에서는 풀어 둔 몬스터 묶음이 모두 48MB를 넘으면, 1분 넘게 안 그린 몬스터 묶음부터(가장 오래된 것부터) 내려놓는다.
     지금 그리는 몬스터 묶음(1분 안에 그린 것)과 마을 · 땅 · 장식 · 주인공 · 마을 사람 · 이펙트 묶음은 내려놓지 않는다.
   · 내려놓을 때: 풀어 둔 그림을 닫고(close), 그 그림에서 잘라 둔 칸(FLC)과 색 입힌 칸(FLT)도 함께 버려 메모리를 바로 돌려준다.
   · 그 몬스터가 다시 나오면 처음 받을 때처럼 다시 푼다(받아 둔 목록과 그림 주소를 기억해 두어 목록 파일은 다시 받지 않음).
     다시 푸는 아주 잠깐 동안은 처음 받을 때처럼 예전 코드 그림이 보인다. 크기 · 동작 · 적중은 그대로.
   · 다른 창을 보는 동안(화면이 숨겨짐)은 내려놓지 않는다(그동안 안 그렸을 뿐이라). PC는 그대로. #qa에서는 저절로 하지 않는다(검사가 직접 부름).
   ⑤ 첫 화면 캐릭터 미리보기 그림을 나중에 굽기
   · 캐릭터 고르기 화면의 미리보기 그림(heroPreviews)을 버튼이 먼저 화면에 나온 다음(다음 그리기 뒤) 굽는다. 느린 폰에서 버튼이 그만큼 빨리 보인다.
   · 그 사이에 화면을 또 만들면(introButtons를 다시 부름) 마지막 화면 것만 굽는다. 그림 · 움직임은 그대로.
   · 저장: 새 저장 칸 없음. 캐릭터 키를 건드리지 않는다.
   붙는 곳: flare.js(flPack · flNeed · flReady · FLARE_PACK · FLC · FLT) · hero.js(heroPreviews) 다음, gear47 다음 b5.js 앞. */
const OP48={on:matchMedia('(pointer:coarse)').matches&&location.hash!=='#qa',cap:48*1048576,keep:60000,use:{},src:{},ev:{},n:0,re:0,pvQ:null};
const op48Mon=n=>typeof n==='string'&&n.charCodeAt(0)===109&&n.charCodeAt(1)===45; // 'm-' 로 시작하는 몬스터 묶음
// 몬스터 묶음을 쓴 시각: flPack은 그릴 때마다 불리므로 여기서 숫자 하나만 적는다 (휴대폰 · #qa만 감싼다)
if(OP48.on||location.hash==='#qa'){const _fp=flPack;flPack=function(name){const PK=_fp(name);if(PK&&op48Mon(name))OP48.use[name]=performance.now();return PK}}
// 다시 풀 때 쓸 목록 · 그림 주소를 기억 (그림을 글자로 담은 data: 주소는 크므로 기억하지 않고 예전처럼 묶음 파일을 다시 받는다)
{const _pk=window.FLARE_PACK;window.FLARE_PACK=function(name,meta,url){if(op48Mon(name)&&typeof url==='string'&&!/^data:/.test(url))OP48.src[name]=[meta,url];return _pk.apply(this,arguments)}}
function op48Bytes(){let b=0;for(const n in FL.P)if(op48Mon(n)){const im=FL.P[n].img;if(im)b+=(im.width||0)*(im.height||0)*4}return b}
// 묶음 하나 내려놓기: 그림 · 잘라 둔 칸 · 색 입힌 칸을 버리고, 다음에 필요하면 다시 받도록 표시
function op48Drop(name){const PK=FL.P[name];if(!PK||!op48Mon(name))return false;delete FL.P[name];FL.want[name]=0;OP48.ev[name]=1;OP48.n++;
  const im=PK.img,W=im&&FLC.w.get(im);if(W){for(const c of W.values())if(FLC.m.delete(c))FLC.b-=c.width*c.height*4;FLC.w.delete(im)}
  const ids=Object.keys(PK.meta&&PK.meta.mon||{}).map(id=>id+'/');
  if(ids.length&&FL.tint.size)for(const [k,c] of [...FL.tint])if(ids.some(p=>k.startsWith(p))){FL.tint.delete(k);FLT.b-=c.width*c.height*4}
  if(im&&typeof im.close==='function')try{im.close()}catch(_){}
  return true}
// 상한을 넘으면 1분 넘게 안 그린 몬스터 묶음부터 내려놓는다. 내려놓은 이름들을 돌려준다
function op48Sweep(now,cap,keep){if(now==null)now=performance.now();if(cap==null)cap=OP48.cap;if(keep==null)keep=OP48.keep;const out=[];let b=op48Bytes();
  while(b>cap){let best=null,bt=Infinity;for(const n in FL.P){if(!op48Mon(n))continue;const t=OP48.use[n]||0;if(now-t<keep)continue;if(t<bt){bt=t;best=n}}
    if(!best)break;const im=FL.P[best].img;b-=im?(im.width||0)*(im.height||0)*4:0;op48Drop(best);out.push(best)}
  return out}
// 내려놓은 묶음이 다시 필요하면: 기억해 둔 목록 · 주소로 바로 다시 푼다 (없으면 원래 flNeed가 묶음 파일을 다시 받음)
function op48Again(name){const s=OP48.src[name];if(!OP48.ev[name]||FL.want[name]||!s)return false;FL.want[name]=1;OP48.re++;window.FLARE_PACK(name,s[0],s[1]);return true}
{const _fn=flNeed;flNeed=function(name){if(OP48.ev[name]&&!FL.want[name]&&flWant()&&location.hash!=='#qa'&&op48Again(name))return;return _fn.apply(this,arguments)}}
{const _fr=flReady;flReady=function(name){const r=_fr.apply(this,arguments);if(op48Mon(name)){OP48.use[name]=performance.now();delete OP48.ev[name];if(OP48.on)setTimeout(()=>{if(!document.hidden)op48Sweep()},0)}return r}}
if(OP48.on)setInterval(()=>{if(!document.hidden)op48Sweep()},10000);
// ⑤ 미리보기: 버튼이 화면에 나온 다음 굽는다 (버튼을 그리는 차례 → 그 그림이 화면에 나온 뒤의 일감으로 · 마지막으로 부른 화면만).
//   그리기 차례 두 번 뒤로 미루면 첫 바깥 그리기(무거움)와 같은 차례에 들어가 더 늦게 나와서, 그리기 한 번 뒤의 일감으로 한다
function op48PvRun(){const q=OP48.pvQ;OP48.pvQ=null;if(q&&q[0].isConnected)q[1].call(null,q[0])}
{const _hp=heroPreviews;heroPreviews=function(root){OP48.pvQ=[root,_hp];requestAnimationFrame(()=>setTimeout(op48PvRun,0))}}
window.__op48=OP48; // 잴 때 보는 숫자(내려놓은 수 n · 다시 푼 수 re)
