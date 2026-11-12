/* ---------- v59 최적화 · 경량화 (사용자 2026-11-12 「125 반영」, optimization/v57/추가-후보.md 1 · 2 · 5) ----------
   1 땅 칸 계산 일꾼 · 땅 그림판 다시 쓰기는 ground.js
   2 그래픽 「낮음」: 몬스터 · 건물 · 사람 · 기술 그림 묶음을 절반 크기로 풀어 둔다 (flare.js pkBitmap). 여기서는 그릴 때 자르는 자리를 맞춘다
   5 예비 그림 파일(.js)을 빼므로, 파일을 바로 열면(file://) 그림이 안 나온다는 것을 한 번 알린다
   저장 · 캐릭터 키는 건드리지 않는다 */
const H59=new WeakMap();let H59N=0;const H59S={half:0,full:0,names:{}};
function h59Low(){return typeof GFX!=='undefined'&&GFX.q==='low'}
function h59Name(name){const n=String(name||'');return /^(m-|g48-|npc48-|folk|cg-|fx-)/.test(n)&&!/^cg-(ground|cliff)$/.test(n)}// 땅 · 절벽 무늬는 화면 대부분을 덮어 그대로 둔다(땅 조각 그림판에 한 번만 그려 메모리 차이도 작다)
function h59Tex(meta){const r=meta&&meta.r;if(!r)return false;for(const k in r)if(k.slice(0,4)==='tex/')return true;return false}// 땅 무늬로 색을 읽는 묶음은 그대로
function h59Want(name,meta,im){return h59Low()&&h59Name(name)&&!h59Tex(meta)&&!!im&&im.width>=64&&im.height>=16}
function h59Reg(b,w,h,name){H59.set(b,[b.width/w,b.height/h]);H59N++;H59S.half++;H59S.names[name]=1}
// 절반 그림은 drawImage 의 자르는 자리(sx,sy,sw,sh)만 비율대로 바꾼다. 3개 인자(원래 크기로 그리기)는 원래 크기로 늘려 그린다. 다른 그림은 그대로
{const CP=CanvasRenderingContext2D.prototype,_d=CP.drawImage;CP.drawImage=function(im,a,b,c,e,f,g,h,i){if(H59N){const k=H59.get(im);if(k){const n=arguments.length;
  if(n>=9)return _d.call(this,im,a*k[0],b*k[1],c*k[0],e*k[1],f,g,h,i);if(n===3)return _d.call(this,im,a,b,im.width/k[0],im.height/k[1])}}return _d.apply(this,arguments)}}
// 「낮음」을 켜거나 끄면, 이미 풀어 둔 묶음 중 크기가 맞지 않는 것을 내려놓아 다음에 쓸 때 맞는 크기로 다시 받는다
function h59Repack(){const lo=h59Low();let n=0;
  for(const name in FL.P){const PK=FL.P[name];if(!PK||!h59Name(name)||h59Tex(PK.meta))continue;const isH=H59.has(PK.img);if(isH!==lo){delete FL.P[name];FL.want[name]=0;n++}}
  if(typeof FX31==='object'&&FX31.P)for(const pk in FX31.P){const PK=FX31.P[pk];if(!PK)continue;const isH=H59.has(PK.img);if(isH!==lo){delete FX31.P[pk];FX31.want[pk]=0;n++}}
  return n}
{const _q=set24Q;set24Q=function(q){const lo0=h59Low(),r=_q.apply(this,arguments);if(h59Low()!==lo0)h59Repack();return r}}
// 5) 파일을 바로 열었을 때(file://): 그림 묶음은 인터넷 주소에서만 받으므로 한 번 알린다 (게임은 예전 그림으로 그대로 할 수 있다)
const F59={key:'arseia-file-tip',el:null};
function f59Check(){if(location.protocol!=='file:'||window.__QA||location.hash==='#qa')return false;try{if(localStorage.getItem(F59.key)==='1')return false}catch(_){}
  const el=document.createElement('div');el.id='f59file';el.setAttribute('role','status');
  el.style.cssText='position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:70;max-width:min(560px,92vw);background:rgba(24,18,10,.94);color:#f3e6c4;border:1px solid #a8844a;border-radius:8px;padding:10px 14px;font-size:13px;line-height:1.5';
  el.innerHTML='<b>파일을 바로 열었어요.</b> 이렇게 열면 새 그림(몬스터 · 건물 · 기술 그림)이 나오지 않고 예전 그림으로 보여요. 게임 주소(인터넷)나 설치한 게임 창으로 들어가면 그림이 다 나와요.<div style="text-align:right;margin-top:6px"><button type="button" class="stonebox" data-f59="ok">알겠어요</button></div>';
  el.querySelector('[data-f59="ok"]').onclick=e=>{e.stopPropagation();el.remove();try{localStorage.setItem(F59.key,'1')}catch(_){}};document.body.appendChild(el);F59.el=el;return true}
setTimeout(f59Check,1500);
window.__h59={st:H59S,repack:h59Repack,isHalf:im=>H59.has(im)};
