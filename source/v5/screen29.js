/* v29 작업F: 창 배치와 브렌힐 그림만. cg28.js 뒤, qa.js 앞. 저장/충돌/전투는 그대로. */
const F29={clinic:'페이스라인성형외과',treeRatio:.85};
// 예전 간판 객체는 배치 보호 검사에 남기고, 간판은 빈 성형외과 건물 정면에 붙인다.
{const host=HOME.decor.find(d=>d.k==='bld'&&d.label==='페이스라인 성형외과');
 if(host&&!host.enter){host.signT=F29.clinic;host.b.sign=1;host.b.extra=(host.b.extra||'')+'/f29sign';const sg=HOME.decor.find(d=>d.k==='facesign');if(sg)sg.f29host=host;}}
{const draw=drawRegionDecor;drawRegionDecor=function(d){if(d.k==='facesign'&&d.f29host)return true;return draw.apply(this,arguments);};}
// 새 동상 그림의 마른 분수 안만 투명하게 굽는다. 물 → 받침/동상 순으로 그려 앞 테두리와 동상을 보존한다.
// v30 (사용자 16:01 「가짜코 동상 아래 물도 위치가 어긋나있어」): 물 자리를 그림의 안쪽 바닥에 맞춘다.
//  안쪽 바닥 = 타원 (86,171) 62×25 (그림 좌표 · 안쪽 벽 x 22~150, 뒤 y 145, 앞 테두리 y 198) · 받침 계단 타원 (91.5,190) 35×12 와 기둥 (69~116, 138~192)은 뺀다.
//  예전(v29)은 (90,207) 66×20 이라 앞 테두리 위에 물이 그려지고 안쪽 바닥은 말라 보였다.
const F29W={cx:86,cy:171,rx:62,ry:25,step:[91.5,190,35,12],col:[69,138,47,54]};
function f29Mask(w,h){const m=document.createElement('canvas');m.width=w;m.height=h;const g=m.getContext('2d');g.fillStyle='#fff';g.beginPath();g.ellipse(F29W.cx,F29W.cy,F29W.rx,F29W.ry,0,0,Math.PI*2);g.fill();
 g.globalCompositeOperation='destination-out';const s=F29W.step;g.beginPath();g.ellipse(s[0],s[1],s[2],s[3],0,0,Math.PI*2);g.fill();g.fillRect(...F29W.col);return m;}
function f29Basin(g){g.beginPath();g.ellipse(F29W.cx,F29W.cy,F29W.rx,F29W.ry,0,0,Math.PI*2);}
function f29Statue(c,PK,d,x,y,k){const r=PK.meta.r['076_statue_false_nose_single'];if(!r)return false;
 if(!PK.f29statue){const M=f29Mask(r[2],r[3]),cv=document.createElement('canvas');cv.width=r[2];cv.height=r[3];const g=cv.getContext('2d');g.drawImage(PK.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);g.globalCompositeOperation='destination-out';g.drawImage(M,0,0);
  const wv=document.createElement('canvas');wv.width=r[2];wv.height=r[3];PK.f29statue=cv;PK.f29mask=M;PK.f29wv=wv;}
 const wv=PK.f29wv,w=wv.getContext('2d'),t=reduceMotion?0:time;w.globalCompositeOperation='source-over';w.clearRect(0,0,wv.width,wv.height);
 const gr=w.createLinearGradient(0,F29W.cy-F29W.ry,0,F29W.cy+F29W.ry);gr.addColorStop(0,'#3a6670');gr.addColorStop(.55,'#518c98');gr.addColorStop(1,'#2c5560');w.fillStyle=gr;w.fillRect(F29W.cx-F29W.rx-2,F29W.cy-F29W.ry-2,F29W.rx*2+4,F29W.ry*2+4);
 w.strokeStyle='rgba(216,240,237,.32)';w.lineWidth=1;for(let i=0;i<3;i++){w.beginPath();w.ellipse(F29W.cx,F29W.cy+4,40+i*9+Math.sin(t*.8+i)*2,13+i*3,0,0,Math.PI*2);w.stroke();}
 w.globalCompositeOperation='destination-in';w.drawImage(PK.f29mask,0,0);
 c.save();c.translate(x-r[4]*k,y-r[5]*k);c.scale(k,k);c.drawImage(wv,0,0);c.drawImage(PK.f29statue,0,0);c.restore();return true;}
function f29Gate(){if(!M22.phone())return;const w=pbody.querySelector('#g26w'),m=w&&w.querySelector('.g26m');if(!m)return;
 const card=panel.querySelector('.card'),head=document.createElement('div');head.className='f29gatehead';head.innerHTML='<span>난이도</span>';
 const diffs=pbody.querySelector('.diffs');if(diffs)head.appendChild(diffs);const hint=document.createElement('span');hint.textContent='가 본 마을을 누르세요';head.appendChild(hint);
 for(const e of [...pbody.children])if(e!==w)e.remove();pbody.prepend(head);card.scrollTop=pbody.scrollTop=0;
 const r=w.getBoundingClientRect(),cr=card.getBoundingClientRect(),cs=getComputedStyle(card),h=Math.max(40,Math.min(innerHeight-8,cr.bottom)-r.top-parseFloat(cs.paddingBottom)-6),mw=parseFloat(m.style.width),mh=parseFloat(m.style.height);
 const z=Math.min(1,(pbody.clientWidth-2)/mw,(h-2)/mh);const fit=document.createElement('div');fit.className='f29mapfit';fit.style.cssText='position:relative;overflow:hidden;margin:auto;width:'+Math.ceil(mw*z)+'px;height:'+Math.ceil(mh*z)+'px';m.before(fit);fit.appendChild(m);m.style.position='absolute';m.style.transformOrigin='0 0';m.style.transform='scale('+z+')';m.style.zoom='';w.style.height=Math.ceil(mh*z)+2+'px';w.style.maxHeight='none';w.style.overflow='auto';w.scrollTop=w.scrollLeft=0;
}
{const rp=renderPanel;renderPanel=function(){const c=panel.querySelector('.card');c.classList.toggle('f29quest',tab==='quest'&&M22.phone());c.classList.toggle('f29gate',tab==='gate'&&M22.phone());const r=rp.apply(this,arguments);if(tab==='gate')f29Gate();return r;};}
// 이벤트 전달만 멈춘다. 손가락 스크롤과 버튼 클릭은 그대로 둔다.
setTimeout(()=>{for(const ev of ['pointerdown','pointermove','pointerup','touchstart','touchmove','touchend','wheel'])pbody.addEventListener(ev,e=>{if(tab==='quest'&&M22.phone())e.stopPropagation();},{passive:true});if(window.__game)Object.assign(window.__game,{F29,f29Statue,f29Basin});},0);
{const st=document.createElement('style');st.textContent=`
#panel .card.t27{width:min(884px,85%)}body.m22L #panel .card.t27{width:min(884px,85%)}
.t27row{gap:8px}.t27l{flex:1 1 0;max-width:calc(100% - 368px)}.t27l .treescroll{max-width:100%;box-sizing:border-box}
body.m22L .t27l{max-width:calc(100% - 268px)}body.m22P .t27l{flex:0 0 100%;max-width:100%}
@media(max-width:640px){.t27l{flex:0 0 100%;max-width:100%}}
body.m22 #panel .card.f29quest{display:flex;flex-direction:column;max-height:100%;overflow:hidden;min-height:0}
body.m22 .f29quest .phead{flex:none}body.m22 .f29quest #pbody{overflow-y:auto;min-height:0;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch}
body.m22 #panel .card.f29gate{height:100%;overflow:hidden;padding:6px 10px;display:flex;flex-direction:column}
body.m22 .f29gate .phead{flex:none;margin:0 0 2px;height:32px}body.m22 .f29gate .phead h1{font-size:16px}body.m22 .f29gate #pclose{padding:3px 10px;min-height:28px}
body.m22 .f29gate #pbody{min-height:0;flex:1}.f29gatehead{display:flex;align-items:center;gap:6px;white-space:nowrap;font-size:11px;height:28px}.f29gatehead .diffs{display:flex;gap:3px;margin:0}.f29gatehead button{font-size:11px;padding:3px 5px}.f29gatehead>span:last-child{overflow:hidden;text-overflow:ellipsis}
body.m22 .f29gate .g26w{margin:2px 0 0}
`;document.head.appendChild(st);}
