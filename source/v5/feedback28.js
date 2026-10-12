/* v28 플레이 피드백. skill27c.js 뒤, qa.js 앞. 캐릭터 저장 형식은 바꾸지 않는다. */
const FB28={key:'arseia-device-v28',zoom:1,pos:{},hold:2000,drag:null,replay:false,blockedUntil:0,pointers:new Map(),pinch:null};
window.__fb28=FB28;
function fb28Clean(v){const o={zoom:1,pos:{}};if(!v||typeof v!=='object')return o;
  if(Number.isFinite(v.zoom))o.zoom=clamp(v.zoom,.7,1.5);
  for(const mode of ['L','P'])for(const id of ['bar','side','log']){const p=v.pos&&v.pos[mode+'_'+id];if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))o.pos[mode+'_'+id]={x:clamp(p.x,0,1),y:clamp(p.y,0,1)}}return o}
try{if(!window.__QA)Object.assign(FB28,fb28Clean(JSON.parse(localStorage.getItem(FB28.key)||'null')))}catch(_){}
function fb28Save(){if(window.__QA)return;try{localStorage.setItem(FB28.key,JSON.stringify({zoom:FB28.zoom,pos:FB28.pos}))}catch(_){}}
function fb28Zoom(z,saveIt=true){if(!Number.isFinite(z))return;FB28.zoom=clamp(z,.7,1.5);if(M22.phone()){m22Cam(true);followCam()}if(saveIt){m22Rebake();fb28Save()}}
function fb28Group(id){return id==='side'?[...document.querySelectorAll('#bar .sk.s26')]:[document.getElementById(id)].filter(Boolean)}
function fb28Rect(id){const es=fb28Group(id).filter(e=>e.getBoundingClientRect().width>0);if(!es.length)return null;const rs=es.map(e=>e.getBoundingClientRect()),x=Math.min(...rs.map(r=>r.left)),y=Math.min(...rs.map(r=>r.top));return {x,y,w:Math.max(...rs.map(r=>r.right))-x,h:Math.max(...rs.map(r=>r.bottom))-y}}
function fb28Move(id,x,y){const r=fb28Rect(id);if(!r)return null;const vp=M22.vp();x=clamp(x,0,Math.max(0,vp.w-r.w));y=clamp(y,0,Math.max(0,vp.h-r.h));
  if(id==='side'){for(const b of fb28Group(id)){const a=b.getBoundingClientRect();b.style.left=(a.left+x-r.x)+'px';b.style.top=(a.top+y-r.y)+'px'}}
  else{const b=fb28Group(id)[0];b.style.position='fixed';b.style.width=Math.min(r.w,vp.w)+'px';b.style.maxWidth='100vw';b.style.left=x+'px';b.style.top=y+'px';b.style.bottom='auto';b.style.right='auto';b.style.transform='none';if(id==='log'){b.style.maxHeight=Math.max(0,vp.h-y)+'px';b.style.overflowY='auto'}}return {x,y,w:r.w,h:r.h}}
function fb28Apply(id){if(!M22.phone())return;const p=FB28.pos[M22.mode()+'_'+id],r=fb28Rect(id);if(p&&r){const vp=M22.vp();fb28Move(id,p.x*Math.max(0,vp.w-r.w),p.y*Math.max(0,vp.h-r.h))}}
function fb28Restore(){for(const id of ['bar','log'])for(const b of fb28Group(id))for(const k of ['position','width','maxWidth','left','top','bottom','right','transform','maxHeight','overflowY'])b.style[k]=''}
function fb28Reset(){FB28.pos={};fb28Restore();s26Lay();fb28Save()}
function fb28Cancel(){const d=FB28.drag;if(!d)return;clearTimeout(d.timer);for(const b of fb28Group(d.id))b.classList.remove('fb28moving');FB28.drag=null}
function fb28Down(e){if(FB28.replay||!M22.phone()||e.pointerType!=='touch'||FB28.drag)return;
  const t=e.target.closest&&e.target.closest('#bar,#log');if(!t)return;if(t.id==='bar')barPT='touch';const id=t.id==='log'?'log':e.target.closest('.s26')?'side':'bar',r=fb28Rect(id);if(!r)return;
  e.preventDefault();e.stopImmediatePropagation();const d=FB28.drag={id,pid:e.pointerId,t0:performance.now(),x:e.clientX,y:e.clientY,r,b:e.target.closest('button'),on:false,cancelled:false};
  try{t.setPointerCapture(e.pointerId)}catch(_){}
  d.timer=setTimeout(()=>{if(FB28.drag!==d||d.cancelled)return;d.on=true;for(const b of fb28Group(id))b.classList.add('fb28moving')},FB28.hold)}
function fb28DragMove(e){const d=FB28.drag;if(!d||d.pid!==e.pointerId)return;e.preventDefault();e.stopImmediatePropagation();
  const dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.on){if(Math.hypot(dx,dy)>12){d.cancelled=true;clearTimeout(d.timer)}return}fb28Move(d.id,d.r.x+dx,d.r.y+dy)}
function fb28Up(e){const d=FB28.drag;if(!d||d.pid!==e.pointerId)return;e.preventDefault();e.stopImmediatePropagation();clearTimeout(d.timer);FB28.blockedUntil=performance.now()+500;
  if(d.on){const r=fb28Rect(d.id),vp=M22.vp();if(r){FB28.pos[M22.mode()+'_'+d.id]={x:r.x/Math.max(1,vp.w-r.w),y:r.y/Math.max(1,vp.h-r.h)};fb28Save()}}
  else if(!d.cancelled&&e.type==='pointerup'&&d.b){FB28.replay=true;try{barPress(d.b)}finally{FB28.replay=false}}fb28Cancel()}
document.addEventListener('pointerdown',fb28Down,true);document.addEventListener('pointermove',fb28DragMove,true);
document.addEventListener('pointerup',fb28Up,true);document.addEventListener('pointercancel',fb28Up,true);
document.addEventListener('click',e=>{if(M22.phone()&&performance.now()<FB28.blockedUntil&&e.target.closest('#bar,#log')){e.preventDefault();e.stopImmediatePropagation()}},true);
{const _sl=s26Lay;s26Lay=function(){_sl.apply(this,arguments);fb28Apply('side')}}
{const _bb=buildBar;buildBar=function(){const r=_bb.apply(this,arguments);fb28Apply('bar');return r}}
{const _sd=set24Draw;set24Draw=function(){_sd.apply(this,arguments);if(!SET24.el||SET24.el.hidden||!M22.phone())return;const b=document.createElement('button');b.type='button';b.className='s24item';b.id='fb28reset';b.textContent='위치 되돌리기';b.onclick=e=>{e.stopPropagation();fb28Reset();set24Open(false)};SET24.el.appendChild(b)}}
addEventListener('resize',()=>{fb28Cancel();FB28.pointers.clear();FB28.pinch=null;fb28Restore();setTimeout(()=>{s26Lay();for(const id of ['bar','log'])fb28Apply(id)},0)});
/* 두 손가락은 지도 캔버스에서만 받는다. 첫 손가락의 이동/공격도 둘째 손가락부터 멈춘다. */
function fb28Pinch(e){if(!M22.phone()||e.pointerType!=='touch')return;const pts=FB28.pointers;
  if(e.type==='pointerdown'){pts.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId)}catch(_){}}
  else if(e.type==='pointermove'){if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY})}
  else pts.delete(e.pointerId);
  if(pts.size>=2){const [a,b]=[...pts.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(!FB28.pinch)FB28.pinch={d:Math.max(1,d),z:FB28.zoom};
    else if(e.type==='pointermove')fb28Zoom(FB28.pinch.z*d/FB28.pinch.d,false);joy=null;fireTouch=null;mouse.l=mouse.r=false;castStop('move');e.preventDefault();e.stopImmediatePropagation()}
  else if(FB28.pinch){e.preventDefault();e.stopImmediatePropagation();joy=null;fireTouch=null;if(!pts.size){FB28.pinch=null;m22Rebake();fb28Save()}}}
for(const ev of ['pointerdown','pointermove','pointerup','pointercancel'])cv.addEventListener(ev,fb28Pinch,true);
/* 기존에 고정돼 있던 숫자 효과만 기본 값의 2%씩 더한다. 최대 증가 40%, 기존에 자라는 효과는 유지. */
const FB28_KEYS=['blk','counter','ias','acc','threat','healUp','imbue','nextShot','markDmg','wave','petDmg','petHp','petSpd','thorns','ls','trapThrow','j3cost','j3ls','critDmg','arc'];
const FB28_OLD_EFF=eff,FB28_BUFF={};
for(const s of Object.values(SPELLS))if(s.kind==='buff'){const a=FB28_OLD_EFF(s.id,1),b=FB28_OLD_EFF(s.id,1+tip24Step(s.id)),ks=FB28_KEYS.filter(k=>typeof s[k]==='number'&&s[k]>0&&a[k]===b[k]);if(ks.length)FB28_BUFF[s.id]=ks}
// 수치로 더 세질 수 없는 완전 면역·복사·죽음 방지는 재사용을 단계마다 1% 줄인다(최대 25%).
const FB28_BINARY=['laststand','steadfast','crownofblessing','shadowhide','sanctumfield','earthanchor'];
const FB28_FIELD={warbanner:['ally','dmg','ias'],spiritthrone:['throne','amp'],nighthunt:['j3night','miss','bossMiss','dmg','thr']};
const fb28Steps=(s,L)=>Math.max(0,(L-1)/(s.job3?J3K(s.cls):1));
const fb28DurStep=n=>Math.max(.5,Math.ceil(n*.05/.5-1e-9)*.5);
const FB28_TICKS=Object.values(SPELLS).filter(s=>s.kind==='field'||s.after||s.bleed||s.id==='forbidgale').map(s=>s.id);
{const _ef=eff;eff=function(id,L){const e=_ef(id,L),s=SPELLS[id],n=fb28Steps(s,L),k=1+Math.min(.4,.02*n);
  for(const key of FB28_BUFF[id]||[])e[key]=s[key]*k;
  if(FB28_FIELD[id]){const [obj,...keys]=FB28_FIELD[id];e[obj]=Object.assign({},s[obj]);for(const key of keys)e[obj][key]=key==='thr'?1-(1-s[obj][key])*k:s[obj][key]*k}
  if(s.kind==='field'&&s.dur)e.dur=s.dur+fb28DurStep(s.dur)*n;
  if(s.after)e.after=s.after+.5*n;
  if(id==='forbidgale'){e.dur=s.dur+.5*n;e.charge=Object.assign({},s.charge,{max:s.charge.max+.5*n})}
  if(s.bleed)e.bleed=Object.assign({},s.bleed,{dur:s.bleed.dur+.5*n});
  if(s.j3wall)e.j3wall=Object.assign({},s.j3wall,{share:Math.min(.9,s.j3wall.share*k)});
  if(s.j3venom)e.j3venom=Object.assign({},s.j3venom,{mult:s.j3venom.mult*k});
  if(id==='streamshot')e.cnt=8;
  return e}}
{const _cd=cdOf;cdOf=id=>_cd(id)*(FB28_BINARY.includes(id)?1-Math.min(.25,.01*fb28Steps(SPELLS[id],Math.max(1,skLv(id)))):1)}
// 시전 시간이 있는 3차 강화와 동료가 건 강화도, 실제로 남은 버프의 레벨이 같을 때 새 수치 칸을 담는다.
{const _sf=supFx;supFx=function(s,id,pwr,from){const r=_sf.apply(this,arguments),b=P.buffs[id];if(s&&s.kind==='buff'&&b&&b.L===(s.L||1))for(const key of FB28_BUFF[id]||[])b[key]=s[key];return r}}
/* 8발: 시전 순간 가까운 적 8마리까지 고르고 순서대로 분배. 화살 한 발의 v27 배율은 유지한다. */
Object.assign(SPELLS.streamshot,{rapid28:1,cnt:8,desc:'사거리 안 가까운 적 최대 8마리를 골라 8발을 빠르게 나눠 쏩니다. 적이 적으면 여러 발씩, 없으면 앞쪽으로 쏩니다. 한 발 위력은 그대로입니다.'});delete CHAN.streamshot;
Object.assign(SPELLS.piercearrow,{mult:2.2,growPierce:.15,slow:1,slowDur:1.2,desc:'강한 일직선 화살. 한 적을 관통할 때마다 첫 화살 피해의 15%가 더해지고, 맞은 적은 1.2초 느려집니다.'});
Object.assign(SPELLS.powershot,{mult:SPELLS.quickshot.mult*3,knock:90,desc:'기본 사격의 3배 위력인 한 발로 적을 살짝 밀어내고 잠깐 멈칫하게 합니다.'});
SPELLS.siegeshot.w*=1.8;SPELLS.siegeshot.desc='잠깐 겨눴다가 넓은 일직선을 꿰뚫습니다. 맞는 폭과 화살 효과가 함께 1.8배 넓어졌습니다.';
let fb28Shots=[];
function fb28Targets(s){return enemies.filter(e=>!e.dead&&r22In(e,P,r22Cap(s))).sort((a,b)=>dist(a,P)-dist(b,P)).slice(0,8)}
function fb28Volley(s,pw,t){const es=fb28Targets(s),iv=Math.min(.08,atkIv(SPELLS.quickshot)/2),own=GHOST||P;
  for(let i=0;i<8;i++)fb28Shots.push({at:time+i*iv,own,ghost:!!GHOST,s,dmg:pw,e:es.length?es[i%es.length]:null,face:own.face,t:{x:t.x,y:t.y}});fb28Fire()}
function fb28Fire(){const due=fb28Shots.filter(o=>o.at<=time+1e-6);fb28Shots=fb28Shots.filter(o=>o.at>time+1e-6&&((o.ghost)||o.own===P&&!P.dead));
  for(const o of due){if(!o.ghost&&(o.own!==P||P.dead))continue;let e=o.e;if(e&&(e.dead||!r22In(e,o.own,r22Cap(o.s))))e=null;
    const a=e?Math.atan2(e.y-o.own.y,e.x-o.own.x):o.face,spd=o.s.spd;
    projs.push({x:o.own.x+Math.cos(a)*16,y:o.own.y+Math.sin(a)*16,z:20,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:o.s.r,dmg:o.dmg,owner:'p',s:o.s,life:1.4,col:EL[o.s.el],hit:null,ghost:o.ghost,fb28Target:e,fb28Shot:1});heroAtk(o.own,'release',.12)}}
{const _u=update;update=function(dt){fb28Fire();for(const p of projs)if(p.fb28Target&&!p.fb28Target.dead){const a=Math.atan2(p.fb28Target.y-p.y,p.fb28Target.x-p.x),sp=Math.hypot(p.vx,p.vy);p.vx=Math.cos(a)*sp;p.vy=Math.sin(a)*sp}_u(dt);fb28Fire()}}
function fb28Night(p,key){let v;for(const f of fields){if(!p||!f.s.j3night||(key==='dmg'&&f.s.ghost)||dist(p,f)>=f.rad+(p.k?hR(p):0))continue;const n=f.s.j3night[key];if(n!=null)v=v==null?n:key==='thr'?Math.min(v,n):Math.max(v,n)}return v}
/* 중간보스는 던전의 가장 강한 정예보다 체력 3.2배, 공격 1% 높게. 최종 보스 아래인지 QA로 전 던전 확인. */
function fb28Elite(d,L,diff,fixed=false){const D=DIFF[diff||0],m=(d.mobs||[]).filter(k=>TYPES[k]);return {hp:Math.max(0,...m.map(k=>Math.round(TYPES[k].hp*(1+.34*(L-1))*(fixed?1:D.hp)*3))),dmg:Math.max(0,...m.map(k=>{const t=TYPES[k],n=t.dmg*(1+.18*(L-1))*1.4;return fixed?Math.min(n,dm21Cap(k,L,true)):n}))}}
function fb28MazeElite(a,L,all=false){const pool=all?MAZE_POOL:mzPool(a.day,a.f),m=all?1:(1-(a.rules.includes('heavy')?.15:0)-(a.rules.includes('crowd')?.2:0));
  return {hp:Math.max(...pool.map(k=>{const t=TYPES[k],b=t.dmg0?clamp(t.hp,700,1000):clamp(t.hp,220,900)*3;return Math.max(1,Math.round(Math.round(b*(1+.34*(L-1)))*m))})),dmg:Math.max(...pool.map(k=>dm21Cap(k,L,!TYPES[k].dmg0)*(TYPES[k].dmg0?.9:.92)))}}
{const _dm=dgMob;dgMob=function(k,x,y,L,extra){const e=_dm.apply(this,arguments),d=DG&&DG.d;if(!NET.guest&&e&&d&&(d.minis||[]).includes(k)&&L===DG.lvl+1){const a=fb28Elite(d,DG.lvl,P.diff,!!DG.a21);e.hp=e.max=Math.max(e.max,Math.ceil(a.hp*3.2));e.dmg=Math.max(e.dmg,a.dmg*1.01);e.fb28mini=1}
  if(!NET.guest&&e&&DG&&DG.a21&&DG.a21.k==='mz'){const a=DG.a21,t=TYPES[k];if(t.mini&&MAZE_MINIS.includes(k)&&L===DG.lvl+1){const v=fb28MazeElite(a,DG.lvl);e.hp=e.max=Math.max(e.max,Math.ceil(v.hp*3.2));e.dmg=Math.max(e.dmg,v.dmg*1.01);e.fb28mini=1}else if(MAZE_BOSSES.includes(k)&&L===DG.lvl+2){const v=fb28MazeElite(a,DG.lvl,true);e.hp=e.max=Math.max(e.max,Math.ceil(v.hp*4));e.dmg=Math.max(e.dmg,v.dmg*1.05);e.fb28final=1}}
  if(!NET.guest&&e&&DG&&DG.a21&&DG.a21.k==='a3'&&k===d.boss&&L===DG.lvl+2){const linked=A3_DG.filter(x=>(x.minis||[]).length&&(x.id===d.id||x.next===d.id)),need=Math.max(0,...linked.map(x=>fb28Elite(x,x.lvl,0,true).hp*4));if(need>e.max){e.hp=e.max=Math.ceil(need);e.fb28final=1}const attack=Math.max(0,...linked.map(x=>fb28Elite(x,x.lvl,0,true).dmg*1.05));if(attack>e.dmg){e.dmg=attack;e.fb28final=1}}return e}}
/* 실제 값으로 설명을 만든다. 고정된 특수 효과도 다음 레벨 칸에서 변화를 확인할 수 있다. */
const FB28_LABEL={counter:'반격 위력',ias:'공격 속도',acc:'명중',threat:'위협 증가',healUp:'받는 치유',imbue:'원소 추가 피해',nextShot:'첫 화살 추가 피해',markDmg:'표식·보스 추가 피해',wave:'검기 위력',petDmg:'동료 피해',petHp:'동료 생명력',petSpd:'동료 공격 속도',thorns:'반사 피해',ls:'흡혈',trapThrow:'덫 거리',j3cost:'마나 환급',j3ls:'흡혈',critDmg:'치명타 피해',arc:'막는 각도',j3hide:'숨은 사격 배율',blk:'막기'};
{const _na=numsAt;numsAt=function(id,L){const rows=_na(id,L),s=eff(id,L);for(const k of FB28_BUFF[id]||[]){const label=FB28_LABEL[k],value=['acc','trapThrow'].includes(k)?String(Math.round(s[k]*100)/100):k==='arc'?s[k].toFixed(2)+' 라디안':k==='j3hide'?s[k].toFixed(2)+'배':(Math.round(s[k]*10000)/100)+'%';const i=rows.findIndex(r=>r[0]===label);if(i>=0)rows[i]=[label,value];else rows.push([label,value])}
  if(FB28_FIELD[id]){const [obj,...keys]=FB28_FIELD[id];const labels={dmg:'지대 피해 증가',ias:'지대 공격 속도',amp:'소환수 강화',miss:'일반 적 빗나감',bossMiss:'보스 빗나감',thr:'위협 감소'};for(const key of keys)rows.push([labels[key],Math.round((key==='thr'?1-s[obj][key]:s[obj][key])*10000)/100+'%'])}
  if(FB28_BINARY.includes(id))rows.push(['스킬 자체 재사용 감소',Math.round(Math.min(.25,.01*fb28Steps(SPELLS[id],L))*100)+'%']);
  if(SPELLS[id].kind==='field')rows.push(['레벨마다 지속','+'+fb28DurStep(SPELLS[id].dur)+'초 (0.5초 틱)']);if(s.after)rows.push(['뒤에 남는 지대',s.after+'초']);if(s.bleed)rows.push(['출혈 지속',s.bleed.dur+'초']);if(id==='forbidgale')rows.push(['모으기 최대',s.charge.max+'초']);return rows}}
for(const id in FB28_BUFF)SPELLS[id].desc+=' 고정돼 있던 수치 효과도 단계마다 기본 값의 2%씩 더해집니다(최대 +40%). 자세한 값은 아래 표에 나옵니다.';
for(const id in FB28_FIELD)SPELLS[id].desc+=' 지대의 고정 강화 효과도 한 단계마다 기본 값의 2%씩 더해집니다(최대 +40%).';
for(const id of FB28_BINARY)SPELLS[id].desc+=' 완전한 효과는 유지하고 단계마다 이 스킬의 재사용 시간이 1%씩 줄어듭니다(최대 25%).';
for(const id of FB28_TICKS)SPELLS[id].desc=SPELLS[id].desc.replace(/\d+(?:\.\d+)?초 동안/g,'표에 나온 시간 동안')+' 반복 효과는 한 단계마다 최소 0.5초 길어집니다. 정확한 지속 시간은 아래 표에 나옵니다.';
{const st=document.createElement('style');st.textContent=`
.t27r{flex:0 0 360px;min-width:360px;max-width:360px}.t27r .detail{box-sizing:border-box;width:100%;overflow-wrap:anywhere}.t27r .nums{grid-template-columns:1fr .85fr .85fr;gap:3px}.t27r button{max-width:100%;overflow-wrap:anywhere;white-space:normal}.t27r .acts{flex-wrap:wrap}
body.m22L .t27r{flex-basis:260px;min-width:260px;max-width:260px}body.m22P .t27r{flex:0 0 100%;min-width:0;max-width:100%}
@media(max-width:640px){.t27r{flex:0 0 100%;min-width:0;max-width:100%}.t27r .nums{grid-template-columns:1fr 1fr 1fr}}
body.m22 #bar,body.m22 #bar *,body.m22 #log{touch-action:none!important}body.m22 #log{pointer-events:auto}body.m22 .fb28moving{outline:2px solid #ffe093;box-shadow:0 0 10px #d6b262;cursor:move}`;document.head.appendChild(st)}
setTimeout(()=>{fb28Zoom(FB28.zoom,false);for(const id of ['bar','log'])fb28Apply(id);if(window.__game)Object.assign(window.__game,{FB28,fb28Clean,fb28Zoom,fb28Targets,fb28Volley,fb28Elite,FB28_BUFF,FB28_TICKS,FB28_BINARY})},0);
