/* ---------- 소리: 배경음악 · 효과음 · 고위 스킬 대사 (audio.js) ----------
   게임 IIFE 안에 들어가는 조각. 빌드 순서: lines.js → music-index.js → audio.js 를 shop.js 뒤, qa.js 앞에 둔다.
   - 게임 규칙·숫자·저장은 건드리지 않는다. 기존 함수를 감싸서(castFx, hurtE, killFx, hitPlayer, gainXp, pickup,
     usePotion, loadRegion, enterDungeon, leaveDungeon, update, render) 소리와 말풍선만 더한다.
   - 효과음은 전부 코드로 합성한다(파일 없음). 배경음악은 MP3 10곡이고 v18에서는 music-index.js 안에 data: URL로 넣었다(HTML 한 파일). MUSIC_INDEX가 곡과 출처를 준다.
   - v18 합치기(AUDIO): #qa에서는 AudioContext를 만들지 않는다(조용, 점검이 소리 기계에 기대지 않게. window.__QA_AUDIO=1이면 만든다).
     기계 음성(TTS)은 쓰지 않는다 — 대사는 말풍선 글자만. 감싼 함수는 인자를 모두 그대로 넘긴다.
   - 설정은 localStorage 'arseia-audio' 한 키에만 쓴다(캐릭터 키 arseia-char-N은 건드리지 않음).
   - 브라우저 정책상 첫 클릭·키 입력 전에는 소리가 나지 않는다. 그 전 요청은 조용히 버린다. */
const AU={ctx:null,on:false,bus:{},set:{music:.45,sfx:.7,lines:true},act:0,ends:[],last:new Map(),noise:null};
(()=>{try{const v=JSON.parse(localStorage.getItem('arseia-audio')||'null');if(v&&typeof v==='object')for(const k in AU.set)if(typeof v[k]===typeof AU.set[k])AU.set[k]=v[k]}catch(_){}})();
function auSave(){try{localStorage.setItem('arseia-audio',JSON.stringify(AU.set))}catch(_){}}
const AU_QA=location.hash==='#qa';
function auInit(){if(AU.ctx||(AU_QA&&!window.__QA_AUDIO))return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  try{const c=AU.ctx=new AC();const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=10;comp.ratio.value=5;comp.attack.value=.003;comp.release.value=.2;comp.connect(c.destination);
    for(const k of ['music','sfx'])AU.bus[k]=c.createGain();AU.bus.music.connect(c.destination);AU.bus.sfx.connect(comp);auVol();
    const n=c.sampleRate,b=c.createBuffer(1,n,n),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;AU.noise=b;AU.on=true}catch(_){AU.ctx=null}}
function auVol(){if(!AU.ctx)return;const t=AU.ctx.currentTime;AU.bus.music.gain.setTargetAtTime(AU.set.music*.8,t,.05);AU.bus.sfx.gain.setTargetAtTime(AU.set.sfx,t,.05)}
function auUnlock(){try{auInit();if(AU.ctx&&AU.ctx.state==='suspended'){const r=AU.ctx.resume();if(r&&r.catch)r.catch(()=>{})}BGM.want&&BGM.apply()}catch(_){}}
['pointerdown','keydown','touchstart'].forEach(ev=>window.addEventListener(ev,auUnlock,{passive:true}));

/* ===== 합성 도구 ===== */
// 소리 하나가 몇 개 겹쳐 울리는지 세서 너무 많으면 버린다(몬스터 50마리 전투에서도 귀가 아프지 않게)
// v24(사용자 05:40 「체인 라이트닝과 스파크 체인을 연달아 쓰면 효과음이 씹힘」): 내가 쓴 마법 · 맞음 · 레벨 같은 중요한 소리는 맞는 소리 · 쓰러짐 같은
// 많이 겹치는 소리에 묻히지 않게 몫을 나눈다(많이 겹치는 소리는 20개까지, 중요한 소리는 48개까지). 울리는 수는 끝나는 시각으로 센다
// (onended를 못 받아 수가 남아 계속 막히는 일이 없게).
const AU_LOW=/^(hit|thud|die|gold|item)/;
function auBusy(t){const e=AU.ends;let n=0;for(let i=e.length-1;i>=0;i--){if(e[i]<=t){e[i]=e[e.length-1];e.pop()}else n++}return n}
function auGo(key,gap,max){if(!AU.on||AU.ctx.state!=='running'||AU.set.sfx<=0)return false;const t=AU.ctx.currentTime,l=AU.last.get(key)||-9;
  if(t-l<gap||auBusy(t)>(max||(AU_LOW.test(key)?20:48)))return false;AU.last.set(key,t);return true}
function auOut(pan,vol){const c=AU.ctx,g=c.createGain();g.gain.value=vol;let n=g;
  if(pan&&c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=Math.max(-1,Math.min(1,pan));g.connect(p);p.connect(AU.bus.sfx)}else g.connect(AU.bus.sfx);return n}
function auEnd(node,stopAt){AU.act++;AU.ends.push(stopAt);node.onended=()=>{AU.act--};node.stop(stopAt)}
// 음 하나: f0→f1로 미끄러지며 a초에 올라가 dur초에 사라진다
function tone(out,type,f0,f1,dur,vol,a,t0){const c=AU.ctx,t=(t0||c.currentTime),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  a=a||.005;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(g);g.connect(out);o.start(t);auEnd(o,t+dur+.02);return o}
// 잡음 한 줄기: 필터 주파수를 f0→f1로 움직인다
function hiss(out,ft,f0,f1,q,dur,vol,a,t0){const c=AU.ctx,t=(t0||c.currentTime),s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.noise;s.loop=true;
  f.type=ft;f.Q.value=q||1;f.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)f.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);
  a=a||.004;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+dur);
  s.connect(f);f.connect(g);g.connect(out);s.start(t,Math.random()*.8);auEnd(s,t+dur+.02);return s}
const rr=(a,b)=>a+Math.random()*(b-a);
// 화면 위치로 좌우·거리 크기를 정한다
function auPos(o){if(!o||!P||!isFinite(o.x)||!isFinite(o.y))return{pan:0,v:1};const dx=(o.x-o.y)-(P.x-P.y),d=Math.hypot(o.x-P.x,o.y-P.y);return{pan:dx/700,v:Math.max(.12,Math.min(1,1-(d-280)/900))}}

/* ===== 효과음 ===== */
const SFX={
  // 마법이 맞을 때: 원소마다 다른 소리 + 아래에 깔리는 짧은 '퍽'
  hit(el,o,crit,big){if(!auGo('hit'+el,.045))return;const p=auPos(o),out=auOut(p.pan,p.v*(crit?1.25:1)*(big?1.2:.85)),k=crit?1.25:1;
    hiss(out,'lowpass',900,180,.8,.09,.35);tone(out,'sine',150*k,60,.11,.35);
    switch(el){
      case'fire':hiss(out,'lowpass',2600,350,.7,.28,.42,.01);for(let i=0;i<4;i++)hiss(out,'bandpass',rr(1500,3500),0,6,.025,.22,.002,AU.ctx.currentTime+rr(.02,.2));break;
      case'ice':for(const f of [2350,3520,4700])tone(out,'triangle',f*rr(.97,1.03)*k,f*.98,.22,.09);hiss(out,'highpass',5000,7000,.7,.1,.25);break;
      case'storm':hiss(out,'bandpass',3200,1200,.6,.07,.5,.001);tone(out,'sawtooth',95,70,.14,.14);tone(out,'square',1800*k,220,.09,.06);break;
      case'earth':tone(out,'sine',95,38,.26,.5);hiss(out,'lowpass',500,120,1,.22,.35);break;
      case'wind':hiss(out,'bandpass',700,2600,2.5,.18,.35,.03);break;
      case'arcane':tone(out,'sine',880*k,1320,.18,.13);tone(out,'sine',1760*k,1980,.22,.06,.02);break;
      case'holy':case'light':for(const f of [1046,1568,2093])tone(out,'sine',f*k,f,.42,.08,.003);hiss(out,'highpass',3500,5000,.7,.12,.12);break;
      case'life':tone(out,'sine',660,880,.2,.12);break;
      default:hiss(out,'bandpass',1200,500,1,.1,.3)}
    if(crit)tone(out,'triangle',2400,2600,.12,.1)},
  // 몸에 맞는 소리(동료 소환수의 근접 공격 같은 원소 없는 타격)
  thud(o){if(!auGo('thud',.06))return;const p=auPos(o),out=auOut(p.pan,p.v*.8);tone(out,'sine',170,60,.12,.45);hiss(out,'lowpass',1200,250,.8,.08,.35)},
  // 몬스터가 쓰러질 때
  die(t,o){if(!auGo('die',.05))return;const p=auPos(o),out=auOut(p.pan,p.v);
    if(t&&t.boss){tone(out,'sine',70,28,1.6,.7,.01);hiss(out,'lowpass',800,60,.7,1.4,.5,.02);tone(out,'sawtooth',110,40,1.1,.12,.05);return}
    if(t&&t.undead){for(let i=0;i<6;i++)hiss(out,'bandpass',rr(1800,3200),0,8,.03,.25,.002,AU.ctx.currentTime+i*rr(.03,.05));tone(out,'sine',120,55,.25,.3);return}
    tone(out,'sine',120*(t&&t.mini?.7:1),45,.3,.5);hiss(out,'lowpass',700,120,.9,.28,.32,.01)},
  // 내가 맞을 때
  hurt(r){if(!auGo('hurt',.09))return;const out=auOut(0,Math.min(1,.55+r*2));tone(out,'sine',160,65,.16,.55);hiss(out,'lowpass',1400,300,.8,.12,.4);
    const o=tone(out,'sawtooth',190,120,.14,.06,.01)},
  block(){if(!auGo('block',.08))return;const out=auOut(0,.7);tone(out,'triangle',1850,1800,.18,.14);tone(out,'triangle',2750,2700,.14,.08);hiss(out,'highpass',4000,6000,1,.05,.15)},
  death(){if(!auGo('death',1))return;const out=auOut(0,.9),t=AU.ctx.currentTime;[392,349,311,233].forEach((f,i)=>tone(out,'triangle',f,f*.99,.6,.18,.02,t+i*.28));tone(out,'sine',80,40,1.6,.4,.05)},
  // 마법을 쓸 때: 위계가 높을수록 길고 묵직하다
  cast(s,o){if(!s||!auGo('cast'+s.id,.06))return;const p=auPos(o),out=auOut(p.pan,p.v*.75),r=s.rank||1,d=.14+r*.045,c=AU.ctx,t=c.currentTime;
    const F={fire:[500,2200],ice:[2000,5000],storm:[1500,4200],earth:[300,900],wind:[600,2600],arcane:[900,2600],holy:[1200,3600],light:[1200,3600],life:[700,2000]}[s.el]||[800,2400];
    hiss(out,'bandpass',F[0],F[1],1.4,d,.28+r*.02,.02);
    if(s.kind==='heal'||s.kind==='hot'||s.kind==='buff'||s.kind==='ward'||s.kind==='shield'||s.kind==='invuln'||s.kind==='armor'||s.kind==='rez'){
      const base=s.el==='holy'||s.el==='light'?523:440;[1,1.25,1.5,2].forEach((m,i)=>tone(out,'sine',base*m,base*m,.5+r*.04,.07,.01,t+i*.06));return}
    if(r>=5)tone(out,'sine',110,55,.25+r*.05,.25+r*.03,.02);
    if(r>=7){const base={fire:98,ice:131,storm:110,earth:82,wind:123,arcane:117,holy:131,light:131,life:131}[s.el]||110;
      for(const m of [1,1.5,2.01])tone(out,'sawtooth',base*m,base*m,.9+r*.08,.035,.12,t)}
    if(s.kind==='strike'||s.kind==='rain'||s.kind==='nova'||s.kind==='storm')if(r>=4)tone(out,'sine',90,35,.5+r*.05,.35,.01,t+.08)},
  // 시전 시간이 있는 마법을 외우는 동안 차오르는 소리 (멈추는 함수를 돌려준다)
  charge(s,dur){if(!AU.on||AU.ctx.state!=='running'||AU.set.sfx<=0)return null;const c=AU.ctx,t=c.currentTime,out=auOut(0,.5),o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();
    o.type='sawtooth';o.frequency.setValueAtTime({fire:110,ice:147,storm:123,earth:82,holy:131,light:131}[s.el]||117,t);f.type='lowpass';f.Q.value=6;f.frequency.setValueAtTime(200,t);f.frequency.exponentialRampToValueAtTime(2400,t+Math.max(.2,dur));
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.13,t+Math.max(.15,dur*.8));o.connect(f);f.connect(g);g.connect(out);o.start(t);AU.act++;AU.ends.push(t+dur+.1);o.onended=()=>{AU.act--};
    return(ok)=>{const n=c.currentTime;g.gain.cancelScheduledValues(n);g.gain.setValueAtTime(g.gain.value,n);g.gain.linearRampToValueAtTime(0,n+(ok?.05:.18));o.stop(n+.2);if(!ok)tone(out,'sine',300,120,.2,.08)}},
  level(){if(!auGo('level',.5))return;const out=auOut(0,.9),t=AU.ctx.currentTime;[523,659,784,1046,1318].forEach((f,i)=>{tone(out,'triangle',f,f,.7,.16,.01,t+i*.09);tone(out,'sine',f*2,f*2,.5,.04,.01,t+i*.09)});hiss(out,'highpass',5000,8000,.7,1.2,.08,.3,t+.3)},
  gold(o){if(!auGo('gold',.05))return;const p=auPos(o),out=auOut(p.pan,.6),t=AU.ctx.currentTime;tone(out,'triangle',2637,2637,.12,.12,.002,t);tone(out,'triangle',3322,3322,.18,.1,.002,t+.06)},
  item(rar,o){if(!auGo('item',.06))return;const p=auPos(o),out=auOut(p.pan,.7),t=AU.ctx.currentTime;tone(out,'sine',260,180,.12,.3);hiss(out,'lowpass',1500,400,1,.08,.25);
    if(rar>=2)[880,1109,1319,1760].slice(0,Math.min(4,rar+1)).forEach((f,i)=>tone(out,'sine',f,f,.6,.07,.005,t+.05+i*.07))},
  potion(){if(!auGo('potion',.2))return;const out=auOut(0,.7),t=AU.ctx.currentTime;for(let i=0;i<4;i++)tone(out,'sine',rr(260,340),rr(600,800),.07,.18,.005,t+i*.08)},
  warp(){if(!auGo('warp',.5))return;const out=auOut(0,.75);tone(out,'sine',180,1200,.7,.15,.15);hiss(out,'bandpass',400,3000,2,.8,.2,.2)},
  door(){if(!auGo('door',.5))return;const out=auOut(0,.8);hiss(out,'lowpass',300,90,1,.9,.4,.05);tone(out,'sine',70,45,.8,.4,.05)},
  roar(o){if(!auGo('roar',3))return;const p=auPos(o),out=auOut(p.pan,1),c=AU.ctx,t=c.currentTime,o1=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();
    o1.type='sawtooth';o1.frequency.setValueAtTime(95,t);o1.frequency.exponentialRampToValueAtTime(55,t+1.3);lfo.frequency.value=13;lg.gain.value=9;lfo.connect(lg);lg.connect(o1.frequency);
    f.type='bandpass';f.frequency.value=420;f.Q.value=1.2;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.55,t+.12);g.gain.exponentialRampToValueAtTime(.001,t+1.4);o1.connect(f);f.connect(g);g.connect(out);
    o1.start(t);lfo.start(t);auEnd(o1,t+1.45);lfo.stop(t+1.45);hiss(out,'lowpass',900,150,.8,1.2,.3,.1)},
  ui(){if(!auGo('ui',.04))return;tone(auOut(0,.35),'sine',1250,1100,.05,.12)},
};

/* ===== 배경음악 ===== */
// 지역 → 곡. 같은 성격의 지역은 한 곡을 함께 쓴다. MUSIC_INDEX에 없는 곡은 reuse(대신 쓸 곡)를 따른다.
const BGM_REG={royal:'field',home:'field',plains:'field',moor:'field',forest:'forest',jungle:'forest',ice:'snow',highland:'snow',desert:'desert',canyon:'desert',sea:'sea',cliffs:'sea',lava:'dark',abyss:'dark'};
// 풀어 둔 곡은 많아야 2개 (곡 하나가 풀면 40~50MB라 메모리 절약 · v18 최적화 B1)
const BGM_KEEP=2;
const BGM={cur:null,want:null,src:null,gain:null,buf:new Map(),load:new Map(),miss:new Set(),bossOn:false,
  url(slot){const m=typeof MUSIC_INDEX!=='undefined'&&MUSIC_INDEX[slot];if(!m)return null;if(m.reuse&&m.reuse!==slot)return this.url(m.reuse);
    return m.data||((typeof window.ARSEIA_AUDIO_BASE==='string'?window.ARSEIA_AUDIO_BASE:'audio/')+m.file)},
  get(slot){const u=this.url(slot);if(!u||!AU.ctx||this.miss.has(u)||(AU_QA&&!window.__QA_MUSIC&&!/^data:/.test(u)))return Promise.resolve(null);if(this.buf.has(u))return Promise.resolve(this.buf.get(u));if(this.load.has(u))return this.load.get(u);
    const p=fetch(u).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>new Promise((ok,no)=>AU.ctx.decodeAudioData(a,ok,no))).then(b=>{
      this.buf.set(u,b);if(this.buf.size>BGM_KEEP){for(const k of this.buf.keys()){if(k!==this.url(this.cur)&&k!==u){this.buf.delete(k);break}}}return b}).catch(()=>{this.miss.add(u);return null}).finally(()=>this.load.delete(u));
    this.load.set(u,p);return p},
  play(slot){this.want=slot;this.apply()},
  apply(){const slot=this.want;if(!AU.on||AU.ctx.state!=='running'||slot===this.cur)return;this.cur=slot;
    this.get(slot).then(b=>{if(this.cur!==slot||!b)return;const c=AU.ctx,t=c.currentTime,old=this.gain,olds=this.src;
      if(old){old.gain.cancelScheduledValues(t);old.gain.setValueAtTime(old.gain.value,t);old.gain.linearRampToValueAtTime(0,t+1.6);olds.stop(t+1.7)}
      const s=c.createBufferSource(),g=c.createGain(),m=MUSIC_INDEX[slot]||{},mg=m.reuse?(MUSIC_INDEX[m.reuse]||{}).gain:m.gain;s.buffer=b;s.loop=true;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(Math.min(2,Math.pow(10,(mg||0)/20)),t+(slot==='boss'?.6:2));s.connect(g);g.connect(AU.bus.music);s.start(t);this.src=s;this.gain=g})},
  // 지금 상황에 맞는 곡 고르기 (0.5초마다)
  pick(){if(typeof P==='undefined'||!P)return'title';const intro=document.getElementById('intro');if(intro&&!intro.hidden)return'title';
    const boss=this.bossNear();if(boss){if(!this.bossOn){this.bossOn=true;SFX.roar(boss)}return'boss'}this.bossOn=false;
    if(typeof DG!=='undefined'&&DG)return'dungeon';
    if((typeof IN!=='undefined'&&IN)||(typeof inSafe==='function'&&inSafe(P.x,P.y,-120)))return'town';
    return BGM_REG[REG&&REG.id]||'field'},
  bossNear(){if(typeof enemies==='undefined')return null;for(const e of enemies){if(e.dead||!e.aggroed)continue;const t=TYPES[e.k];if(t&&t.boss&&dist(e,P)<720)return e}return null},
};
// v22: 마을 경계에서 0.5초마다 마을/들판 곡이 번갈아 바뀌지 않게, 보스·처음 곡 말고는 같은 곡이 1초 이어 골라져야 바꾼다
setInterval(()=>{if(!AU.on)return;const p=BGM.pick();if(p!==BGM.cand){BGM.cand=p;BGM.candN=0}BGM.candN++;if(p==='boss'||p==='title'||BGM.cur==null||BGM.candN>=2)BGM.play(p)},500);

/* ===== 고위 스킬 대사: 말풍선 (기계 음성은 어색하다는 사용자 의견으로 뺐음, 2026-10-08) ===== */
const SAYS=[];// {o:말하는 사람, t:글, life, max, col}
const LINES={lastAll:-9,lastBy:new Map(),
  // 마법사: 주문 + 끝에 룬 영창, 사제: 기도 + 끝에 짧은 기도. 연달아 쓰는 마법은 가끔만 말한다
  say(s,who,start){if(!AU.set.lines||!s||(s.rank||0)<LINE_MIN_RANK)return false;const ln=SKILL_LINES[s.id];if(!ln)return false;
    const now=performance.now()/1000,key=(who&&who.id||0)+':'+s.id,lb=this.lastBy.get(key)||-99,spam=(s.cd||0)<3;
    if(now-this.lastAll<(spam?4:1.2)||(spam&&now-lb<9))return false;this.lastAll=now;this.lastBy.set(key,now);
    const parts=ln.split(' / '),fin=s.chant?(s.cls==='mage'?s.chant+'!':s.chant):null,col=EL[s.el]||'#ffe39a',o=who||P;
    for(let i=0;i<SAYS.length;i++)if(SAYS[i].o===o)SAYS.splice(i--,1);
    parts.forEach((t,i)=>SAYS.push({o,t,col,delay:i*1.5,life:2.6+(i===parts.length-1?.6:0)}));
    if(fin&&s.cls==='mage')SAYS.push({o,t:fin,col,delay:parts.length*1.5-.2,life:1.6,rune:true});
    return true}};
function drawSpellSays(){if(!SAYS.length)return;ctx.save();S();ctx.textAlign='center';ctx.textBaseline='middle';const row=new Map();
  for(const b of SAYS){if(b.delay>0)continue;const o=b.o;if(!o||o.dead)continue;const s=o===P||!o._s?W2S(o.x,o.y):o._s,n=row.get(o)||0;row.set(o,n+1);
    const a=Math.max(0,Math.min(1,b.life*2.2,(b.age||0)*8));ctx.globalAlpha=a;ctx.font=b.rune?`700 15px ${DISPLAY}`:`italic 600 14px ${FONT}`;
    const w=Math.min(340,ctx.measureText(b.t).width+20),y=s.y-108-n*30;
    ctx.fillStyle=b.rune?'rgba(20,14,6,.55)':'rgba(24,18,10,.88)';ctx.strokeStyle=b.col;ctx.lineWidth=1.2;ctx.beginPath();
    ctx.roundRect?ctx.roundRect(s.x-w/2,y-13,w,26,9):ctx.rect(s.x-w/2,y-13,w,26);if(!b.rune&&n===0){ctx.moveTo(s.x-6,y+13);ctx.lineTo(s.x,y+20);ctx.lineTo(s.x+6,y+13)}ctx.fill();ctx.stroke();
    ctx.fillStyle=b.rune?b.col:'#f6ecd2';ctx.fillText(b.rune?'「'+b.t+'」':b.t,s.x,y+1)}
  ctx.restore()}
function tickSpellSays(dt){for(let i=SAYS.length-1;i>=0;i--){const b=SAYS[i];if(b.delay>0){b.delay-=dt;continue}b.age=(b.age||0)+dt;b.life-=dt;if(b.life<=0)SAYS.splice(i,1)}}

/* ===== 게임 함수 감싸기 (원래 동작은 그대로, 소리만 더함) ===== */
{const _f=castFx;castFx=function(s,...a){const ret=_f(s,...a);try{const who=GHOST||null;SFX.cast(s,who||P);
  if(!(AU.chargeId===s.id&&!who))LINES.say(s,who);AU.chargeId=null}catch(_){}return ret}}
{const _h=hurtE;hurtE=function(e,amt,s,...a){const hp=e&&e.hp,n=texts.length,ret=_h(e,amt,s,...a);try{if(e&&e.hp<hp){const t=texts[texts.length-1],crit=texts.length>n&&t&&t.big;
  if(s&&s.el)SFX.hit(s.el,e,crit,s.rank>=6);else SFX.thud(e)}}catch(_){}return ret}}
{const _k=killFx;killFx=function(e,...a){const ret=_k(e,...a);try{SFX.die(TYPES[e.k],e)}catch(_){}return ret}}
{const _p=hitPlayer;hitPlayer=function(d,...a){const hp=P.hp,dead=P.dead,n=texts.length,ret=_p(d,...a);try{
  if(!dead&&P.dead)SFX.death();else if(P.hp<hp)SFX.hurt((hp-P.hp)/Math.max(1,maxHp()));else if(texts.length>n&&!dead)SFX.block()}catch(_){}return ret}}
{const _g=gainXp;gainXp=function(...a){const l=P.lvl,ret=_g(...a);try{if(P.lvl>l)SFX.level()}catch(_){}return ret}}
{const _pk=pickup;pickup=function(l,...a){const ret=_pk(l,...a);try{if(l.taken){if(l.kind==='gold')SFX.gold(l);else if(l.kind==='item')SFX.item(l.item&&RAR_IDX(l.item.rar),l);else SFX.item(0,l)}}catch(_){}return ret}}
const RAR_IDX=r=>typeof r==='number'?r:({normal:0,magic:1,rare:2,set:3,uniq:3,unique:3,boss:4})[r]||0;
{const _u=usePotion;usePotion=function(k,...r){const a=JSON.stringify(P.pot&&P.pot[k]),ret=_u(k,...r);try{if(k!=='tp'&&(ret===true||JSON.stringify(P.pot&&P.pot[k])!==a))SFX.potion()}catch(_){}return ret}}
{const _l=loadRegion;loadRegion=function(...a){const r=_l(...a);try{SFX.warp()}catch(_){}return r}}
{const _e=enterDungeon;enterDungeon=function(...a){const r=_e(...a);try{SFX.door()}catch(_){}return r}}
{const _x=leaveDungeon;leaveDungeon=function(...a){const r=_x(...a);try{SFX.door()}catch(_){}return r}}
// 시전 시간 있는 마법: 외우기 시작할 때 대사와 차오르는 소리, 끊기면 꺼지는 소리
{const _u=update;update=function(dt,...a){const ret=_u(dt,...a);try{tickSpellSays(dt);
  const cu=typeof CAST!=='undefined'?CAST.cur:null;
  if(cu&&AU.castObj!==cu){AU.castObj=cu;if(AU.stopCharge)AU.stopCharge(false);const s=SPELLS[cu.id];AU.stopCharge=SFX.charge(s,cu.max);if(LINES.say(Object.assign({},s,{L:skLv(cu.id)})))AU.chargeId=cu.id}
  else if(!cu&&AU.castObj){const done=AU.castObj.t>=AU.castObj.max;AU.castObj=null;if(AU.stopCharge){AU.stopCharge(done);AU.stopCharge=null}if(!done){AU.chargeId=null;for(let i=SAYS.length-1;i>=0;i--)if(SAYS[i].o===P)SAYS.splice(i,1);}}
}catch(_){}return ret}}
{const _r=render;render=function(...a){const ret=_r(...a);try{drawSpellSays()}catch(_){}return ret}}
document.addEventListener('click',e=>{try{if(e.target&&e.target.closest&&e.target.closest('button'))SFX.ui()}catch(_){}},true);

/* ===== 소리 설정 창 (♪ 버튼) + 음악 출처 ===== */
function auPanel(){let el=document.getElementById('auPanel');if(el){el.hidden=!el.hidden;return}
  el=document.createElement('div');el.id='auPanel';
  el.style.cssText='position:fixed;left:12px;top:100px;z-index:70;width:min(320px,calc(100vw - 24px));max-height:70vh;overflow:auto;background:rgba(20,16,10,.95);border:1px solid #8a7346;border-radius:10px;padding:12px 14px;color:#efe2c0;font:13px var(--body,sans-serif)';
  const pc=v=>v<=0?'끔':Math.round(v*100)+'%';
  const sl=(k,n)=>`<label style="display:flex;align-items:center;gap:8px;margin:6px 0"><span style="min-width:56px">${n}</span><input type="range" min="0" max="100" value="${Math.round(AU.set[k]*100)}" data-k="${k}" style="flex:1" aria-label="${n} 음량"><output data-o="${k}" style="min-width:34px;text-align:right">${pc(AU.set[k])}</output></label>`;
  const ck=(k,n)=>`<label style="display:flex;align-items:center;gap:8px;margin:6px 0"><input type="checkbox" data-c="${k}" ${AU.set[k]?'checked':''}>${n}</label>`;
  const cr=(typeof MUSIC_INDEX!=='undefined'?Object.values(MUSIC_INDEX):[]).filter(m=>m.credit&&!m.reuse).map(m=>`<li>${m.credit}</li>`).join('');
  el.innerHTML=`<b style="font-size:15px">소리</b><div style="font-size:12px;color:#a39d8f">0으로 내리면 꺼집니다. 이 설정은 캐릭터 저장과 따로, 이 기기에 저장됩니다.</div>${sl('music','배경음악')}${sl('sfx','효과음')}${ck('lines','고위 스킬 대사 말풍선 (5위계 이상)')}
    <div style="margin-top:10px"><b>음악 출처</b><ul style="margin:4px 0 0 16px;padding:0;font-size:12px;line-height:1.5">${cr||'<li>(음악 파일 없음)</li>'}</ul><div style="font-size:12px;color:#a39d8f">효과음은 게임 안에서 직접 합성한 소리입니다.</div></div>
    <div style="text-align:right;margin-top:8px"><button type="button" class="ghost" id="auClose">닫기</button></div>`;
  el.querySelectorAll('[data-k]').forEach(i=>i.oninput=()=>{AU.set[i.dataset.k]=+i.value/100;auVol();auSave();const o=el.querySelector(`[data-o="${i.dataset.k}"]`);if(o)o.textContent=pc(AU.set[i.dataset.k])});
  el.querySelectorAll('[data-c]').forEach(i=>i.onchange=()=>{AU.set[i.dataset.c]=i.checked;auSave()});
  el.querySelector('#auClose').onclick=()=>{el.hidden=true};el.addEventListener('keydown',e=>e.stopPropagation());
  document.body.appendChild(el)}
(()=>{const b=document.createElement('button');b.type='button';b.id='auBtn';b.title='소리 설정';b.textContent='소리 ♪';
  const row=document.getElementById('treeBtn');if(row&&row.parentNode){b.className='stonebox';row.parentNode.appendChild(b)}
  else{b.style.cssText='position:fixed;left:12px;bottom:12px;z-index:59;padding:6px 10px;border-radius:6px;border:1px solid #8a7346;background:rgba(20,16,10,.85);color:#efe2c0;cursor:pointer';document.body.appendChild(b)}
  b.onclick=e=>{e.stopPropagation();auUnlock();auPanel()}})();

// 도움말(시작 화면) 아래: 소리 설정 버튼과 음악 출처 (CC-BY / CC-BY-SA 표시 의무)
(()=>{const card=document.querySelector('#intro .card');if(!card)return;const d=document.createElement('div');d.id='auCredits';
  const cr=(typeof MUSIC_INDEX!=='undefined'?Object.values(MUSIC_INDEX):[]).filter(m=>m.credit&&!m.reuse).map(m=>`<li>${m.credit}</li>`).join('');
  d.innerHTML=`<h2>소리 · 음악 출처</h2><div class="row" style="margin-top:0"><button class="ghost" id="auIntroBtn" type="button">소리 설정</button></div>
    <ul class="muted" style="margin:6px 0 0 16px;padding:0;font-size:12px;line-height:1.5">${cr}</ul><p class="muted" style="font-size:12px;margin:4px 0 0">효과음은 게임 안에서 직접 합성한 소리입니다.</p>`;
  card.appendChild(d);d.querySelector('#auIntroBtn').onclick=e=>{e.stopPropagation();auUnlock();auPanel()}})();

/* ===== #qa에서 부를 점검 (qa.js 블록 안에서 AUDIO_QA()를 불러 결과를 qOk로 확인) ===== */
// 대사가 없는 고위 스킬(전사·궁수, v18에서 위계가 바뀐 마법)은 말풍선 없이 지나간다 → 실패가 아니라 목록으로만 알려 준다
function AUDIO_QA_MISSING(){const m=[];for(const id in SPELLS){const s=SPELLS[id];if(s.kind!=='passive'&&(s.rank||0)>=LINE_MIN_RANK&&!SKILL_LINES[id])m.push(id)}return m}
function AUDIO_QA(){const bad=[];
  for(const id in SKILL_LINES)if(!SPELLS[id])bad.push('없는 스킬의 대사: '+id);
  for(const slot of new Set(Object.values(BGM_REG).concat(['title','town','dungeon','boss'])))if(!BGM.url(slot))bad.push('곡 없음: '+slot);
  return bad}
// 도구·스크린샷용 (게임 동작과 무관)
window.__audio={AU,BGM,LINES,SAYS,SFX,get P(){return P},cast:(id,x,y)=>{P.sk[id]=Math.max(P.sk[id]||0,10);P.mp=maxMp();P.cd[id]=0;return tryCast(id,{x,y})}};

/* ===== [v20 최적화] 배경음악을 게임 파일 안에 넣지 않고 옆 파일(audio/music/*.mp3)로 둘 때 =====
   - MUSIC_INDEX에 data가 없으면 <audio>로 흘려 듣는다: 곡을 통째로 풀지 않아 메모리가 거의 들지 않고, 게임 파일이 11.7MB 줄어든다.
   - http(s)로 열면 소리 기계(볼륨 단계)에 이어 붙이고, D:\ 폴더에서 바로 연 경우(file:)는 <audio> 볼륨으로 직접 맞춘다.
   - 파일이 없으면 조용히 넘어간다(게임은 그대로). data가 있으면 예전 방식 그대로. */
const BGMS={el:null,fade:0,old:null,all:new Set()};// v22: old = 지금 줄어드는 곡 · all = 만든 곡 모두(겹침 방지)
function bgmStop(o){if(!o)return;try{o.pause();if(o._node)o._node.gain.value=0;o.removeAttribute('src');o.load()}catch(_){}BGMS.all.delete(o)}
function bgmStreamUrl(slot){if(typeof MUSIC_INDEX==='undefined')return null;const m=MUSIC_INDEX[slot];if(!m)return null;if(m.reuse&&m.reuse!==slot)return bgmStreamUrl(m.reuse);if(m.data)return null;
  return (typeof window.ARSEIA_AUDIO_BASE==='string'?window.ARSEIA_AUDIO_BASE:'audio/')+m.file}
function bgmElVol(el){return el._node?1:Math.min(1,AU.set.music*.8*el._gk)}
{const _ap=BGM.apply.bind(BGM);
  BGM.apply=function(){const slot=this.want,u=bgmStreamUrl(slot);if(!u)return _ap();if(this.miss.has(u))return;if(!AU.on||!AU.ctx||AU.ctx.state!=='running'||slot===this.cur)return;this.cur=slot;
    const m=MUSIC_INDEX[slot]||{},mg=m.reuse?(MUSIC_INDEX[m.reuse]||{}).gain:m.gain,el=new Audio();el.loop=true;el.preload='auto';el._gk=Math.min(2,Math.pow(10,(mg||0)/20));
    if(location.protocol!=='file:'){try{const g=AU.ctx.createGain();g.gain.value=0;AU.ctx.createMediaElementSource(el).connect(g);g.connect(AU.bus.music);el._node=g}catch(_){el._node=null}}
    el.volume=0;el.src=u;el.onerror=()=>{if(BGMS.el===el){BGMS.el=null;this.cur=null;this.miss.add(u)}};el.play().catch(()=>{});
    // v22(사용자 06:49 「두 맵 배경음이 겹쳐 들림」): 바꾸는 도중에 또 바뀌면 예전엔 줄어들던 곡이 멈추지 않고 계속 울렸다 → 줄어들던 곡은 바로 끈다
    if(BGMS.old&&BGMS.old!==BGMS.el)bgmStop(BGMS.old);BGMS.all.add(el);
    const old=BGMS.el,sec=slot==='boss'?.6:2,t0=performance.now();BGMS.el=el;BGMS.old=old;clearInterval(BGMS.fade);
    BGMS.fade=setInterval(()=>{const k=Math.min(1,(performance.now()-t0)/(sec*1000));
      if(el._node)el._node.gain.value=el._gk*k,el.volume=1;else el.volume=bgmElVol(el)*k;
      if(old){if(old._node)old._node.gain.value=old._gk*(1-k);else old.volume=bgmElVol(old)*(1-k)}
      if(k>=1){clearInterval(BGMS.fade);if(old)bgmStop(old);if(BGMS.old===old)BGMS.old=null}},50)}}
// 소리를 끄거나 볼륨을 바꾸면 흘려 듣는 곡도 따른다
{const _v=auVol;auVol=function(){_v();const el=BGMS.el;if(el&&!el._node)el.volume=bgmElVol(el)}}
setInterval(()=>{for(const o of [...BGMS.all])if(o!==BGMS.el&&o!==BGMS.old)bgmStop(o);/* v22: 지금 곡과 줄어드는 곡 말고는 절대 울리지 않음 */const el=BGMS.el;if(!el)return;if(!AU.on&&!el.paused)el.pause();else if(AU.on&&el.paused&&AU.ctx&&AU.ctx.state==='running')el.play().catch(()=>{})},500);
