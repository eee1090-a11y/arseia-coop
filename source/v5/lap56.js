/* ---------- v56 저사양 노트북 (사용자 2026-11-06 「모두 반영해」, optimization/v56/저사양-노트북-후보.md) ----------
   1 「낮음」 = 게임 그림 75% (b1.js gfxLowCap) · 2 「자동」도 보통 화면에서 75%까지 (b1.js arTick) · 4 땅 조각 줄 나눠 붙이기 (ground.js isoStrips)
   3 브라우저 그래픽 가속이 꺼져 보이면 한 번 알려 주기 · 5 PC 「낮음」에서도 오래 안 쓴 몬스터 그림 내려놓기 · 6 「낮음」을 고르면 30장 상한 권하기
   저장 형식 · 캐릭터 키는 건드리지 않는다. 알림을 봤다는 표시만 새 키 arseia-gpu-tip 에 둔다. */
const LAP56={gpu:null,tipKey:'arseia-gpu-tip',tipEl:null,shown:false};
window.__iso56={set(v){ISO_STRIP=!!v},mg(v){ISO_MG=+v},get(){return{on:ISO_STRIP,mg:ISO_MG,ns:ISO_NS}},
  // 점검용: 지금 화면 방향 그림이 있는 땅 조각을 같은 순서로 예전 방식 · 줄 방식으로 따로 그려 화소를 비교한다
  cmp(keep){const s=DPR,mk=()=>{const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;const g=c.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,c.width,c.height);return c},A=mk(),B=mk(),ga=A.getContext('2d'),gb=B.getContext('2d');
    const L=[...chunks.entries()].filter(([k,c])=>c.ready&&c.iso&&c.iso.s===s).map(([k,c])=>({c,cx:Math.floor(k/1000+1e-9),cy:k-Math.floor(k/1000+1e-9)*1000})).sort((a,b)=>a.cy-b.cy||a.cx-b.cx);const on=ISO_STRIP;
    for(const {c,cx,cy} of L){const wx=cx*CH,wy=cy*CH,X=Math.round(((wx-wy)*KI-camX+shx-CH*KI-ISO_PAD)*s),Y=Math.round(((wx+wy)*KI/2-camY+shy-ISO_PAD)*s);ISO_STRIP=false;isoStrips(c.iso.cv,X,Y,s,ga);ISO_STRIP=true;isoStrips(c.iso.cv,X,Y,s,gb)}ISO_STRIP=on;
    const a=ga.getImageData(0,0,A.width,A.height).data,b=gb.getImageData(0,0,B.width,B.height).data;let n=0,mx=0;for(let i=0;i<a.length;i+=4){const d=Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),Math.abs(a[i+2]-b[i+2]));if(d){n++;if(d>mx)mx=d}}if(keep){const M=document.createElement('canvas');M.width=A.width;M.height=A.height;const gm=M.getContext('2d'),im=gm.createImageData(M.width,M.height);for(let i=0;i<a.length;i+=4){const d=Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),Math.abs(a[i+2]-b[i+2]));im.data[i]=d?255:a[i]*.3;im.data[i+1]=d?0:a[i+1]*.3;im.data[i+2]=d?0:a[i+2]*.3;im.data[i+3]=255}gm.putImageData(im,0,0);this.last={a:A.toDataURL(),b:B.toDataURL(),m:M.toDataURL()}}
    return{chunks:L.length,diffPx:n,maxDiff:mx,px:a.length/4}}};
// 3) 그래픽 가속: WebGL이 아예 없거나, 소프트웨어 그리기(SwiftShader · llvmpipe · Microsoft Basic Render …)면 「꺼짐」으로 본다 (추측일 수 있어 한 번만 알린다)
function lap56SoftName(n){return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(String(n||''))}
function lap56Gpu(){if(LAP56.gpu)return LAP56.gpu;let r={soft:false,name:''};
  try{const c=document.createElement('canvas'),gl=c.getContext('webgl')||c.getContext('experimental-webgl');
    if(!gl)r={soft:true,name:'WebGL 없음'};else{const ext=gl.getExtension('WEBGL_debug_renderer_info');const n=String(ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)||'');
      r={soft:lap56SoftName(n),name:n};const lose=gl.getExtension('WEBGL_lose_context');if(lose)lose.loseContext()}}catch(_){r={soft:false,name:'?'}}
  return LAP56.gpu=r}
function lap56Phone(){return typeof M22==='object'&&M22.phone&&M22.phone()||matchMedia('(pointer:coarse)').matches}
function lap56TipSeen(){try{return localStorage.getItem(LAP56.tipKey)==='1'}catch(_){return false}}
function lap56TipEl(){if(LAP56.tipEl)return LAP56.tipEl;const el=document.createElement('div');el.id='lap56gpu';el.hidden=true;el.setAttribute('role','status');
  el.style.cssText='position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:60;max-width:min(560px,92vw);background:rgba(24,18,10,.94);color:#f3e6c4;border:1px solid #a8844a;border-radius:8px;padding:10px 14px;font-size:13px;line-height:1.5;box-shadow:0 4px 18px rgba(0,0,0,.5)';
  el.innerHTML='<b>게임이 느리다면</b> 브라우저의 그래픽 가속이 꺼져 있는 것 같아요(추측). 켜면 훨씬 부드러워질 수 있어요.<br>'+
    '크롬 · 엣지: 설정 → 시스템 → 「가능한 경우 그래픽 가속 사용」 켜기 → 브라우저 다시 시작<br>'+
    '그래도 느리면 설정 ⚙ 에서 그래픽 품질 「낮음」 · 프레임 상한 「30」을 골라 보세요.'+
    '<div style="text-align:right;margin-top:6px"><button type="button" class="stonebox" data-lap56="ok">알겠어요</button></div>';
  el.querySelector('[data-lap56="ok"]').onclick=e=>{e.stopPropagation();lap56TipClose()};document.body.appendChild(el);return LAP56.tipEl=el}
function lap56TipClose(){if(LAP56.tipEl)LAP56.tipEl.hidden=true;try{localStorage.setItem(LAP56.tipKey,'1')}catch(_){}}
// 게임에 들어간 뒤(시작 화면이 닫힌 뒤) 한 번만, PC에서만. 12초 뒤 저절로 닫힌다(다음에는 안 나옴)
function lap56TipCheck(){if(LAP56.shown||window.__QA||location.hash==='#qa'||lap56Phone()||lap56TipSeen())return false;const it=document.getElementById('intro');if(it&&!it.hidden)return false;
  if(typeof P==='undefined'||!P||!P.cls)return false;if(!lap56Gpu().soft)return false;LAP56.shown=true;const el=lap56TipEl();el.hidden=false;setTimeout(()=>{if(!el.hidden)lap56TipClose()},12000);return true}
setInterval(()=>{if(!LAP56.shown)lap56TipCheck()},3000);
// 5) PC 「낮음」: 폰처럼 오래(1분) 안 그린 몬스터 그림 묶음을 48MB 넘으면 내려놓는다 (opt48.js의 op48Sweep 그대로). 폰 · #qa 는 opt48 이 이미 한다
if(!OP48.on&&location.hash!=='#qa'){const _fp=flPack;flPack=function(name){const PK=_fp(name);if(PK&&op48Mon(name))OP48.use[name]=performance.now();return PK}}
function lap56Low(){return GFX.q==='low'&&!OP48.on}
setInterval(()=>{if(lap56Low()&&!document.hidden&&location.hash!=='#qa')op48Sweep()},10000);
// 6) 「낮음」을 골랐는데 프레임 상한이 60이면 설정 창에 「30으로 바꾸기」 한 줄을 보여 준다 (누르면 30, 안 누르면 그대로)
{const _d=set24Draw;set24Draw=function(){_d.apply(this,arguments);const el=SET24.el;if(!el||el.hidden||GFX.q!=='low'||fps30())return;
  const n=document.createElement('div');n.className='s24n';n.id='lap56fps';n.innerHTML='낮음과 같이 프레임 상한을 30으로 두면 더 고르게 움직이고 덜 뜨거워요 <button type="button" class="s24seg" data-lap56fps="30">30으로 바꾸기</button>';
  const rows=el.querySelectorAll('.s24row');const at=rows[1]||null;if(at)el.insertBefore(n,at.nextSibling);else el.appendChild(n);
  n.querySelector('button').onclick=e=>{e.stopPropagation();set24Fps(30)};set24Place()}}
