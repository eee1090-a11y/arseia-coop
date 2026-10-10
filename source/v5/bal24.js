/* ---------- v24 보스 세기 · 보스방 (사용자 2026-10-10 05:06 · 05:07) ----------
   「57레벨 마법사가 57레벨 던전 보스를 10초 만에 잡음 → 적어도 1분 이상」 「보스방은 최소 2배 이상」
   「필드 보스는 지금의 3~10배 오래 · 30레벨부터 점점」 「보스 공격력도 보스답게, 한 방에 죽지는 않게」
   · 던전 보스(동굴 던전의 보스): 생명력 ×B24.dgHp(보스 레벨) — 10레벨 ×3 → 30레벨 ×5 → 60레벨 ×8 → 140레벨 ×10.
   · 필드 보스(지역 우두머리): 생명력 ×B24.fdHp — 10레벨까지 ×1.5 → 30레벨 ×3 → 60레벨 ×6 → 140레벨 ×10.
   · 두 보스 모두 공격력 ×B24.dmg — 10레벨까지 ×1.15 → 30레벨부터 ×1.35. 대신 보스의 한 대는 맞는 사람 최대 생명력의 60%를 넘지 않는다(한 방에 죽지 않음).
   · 파티: 이 보스들(e._b24)의 생명력 인원 배수를 ×(1+1.0(n−1)) → ×(1+0.7(n−1))로 (둘이면 혼자보다 약 15% · 셋이면 20% 빨리 · 더 안전하게).
   · 보스방: 동굴 던전의 가장 깊은 방(보스방)을 넓이 2.25배(큰 보스는 2.6배) 이상으로 넓힌다. 다른 방과는 한 칸 넘게 떨어뜨리고, 넓힌 뒤에도 가장 깊은 방이어야 한다(아니면 다시 만듦).
   · 빼는 것: 미궁 오르타 · 미궁 심층 · 군주의 메아리 · 시련/시험의 방 · 투기장 · 잿빛 메아리 지역(Lv136~140, 따로 맞춘 끝 콘텐츠).
   · 계산은 방장(또는 혼자)의 화면이 한다. 저장은 바꾸지 않는다. */
const B24={HP_PARTY_BOSS:.7,CAP:.6,
  ramp(L,pts){if(L<=pts[0][0])return pts[0][1];for(let i=1;i<pts.length;i++){const [a,va]=pts[i-1],[b,vb]=pts[i];if(L<=b)return va+(vb-va)*(L-a)/(b-a)}return pts[pts.length-1][1]},
  dgHp:L=>B24.ramp(L,[[10,3],[30,5],[60,8],[140,10]]),
  fdHp:L=>B24.ramp(L,[[10,1.5],[30,3],[60,6],[140,10]]),
  dmg:L=>B24.ramp(L,[[10,1.15],[30,1.35]]),
  gen:null};
// 파티: v24로 맞춘 보스(e._b24)만 인원당 +70% (따로 맞춘 끝 콘텐츠 · 같이 하기 전용 보스는 예전 +100% 그대로)
if(typeof PTY==='object'&&PTY.scale){const _sc=PTY.scale;PTY.scale=function(e){if(!e||!e._b24)return _sc.apply(this,arguments);const h0=this.HP.boss;this.HP.boss=B24.HP_PARTY_BOSS;try{return _sc.apply(this,arguments)}finally{this.HP.boss=h0}}}
const b24Echo=()=>typeof echoOn==='function'&&REG&&echoOn(REG.id);
// 이 보스가 v24 조정 대상인가: 'dg'(던전 보스) · 'fd'(필드 보스) · null
function b24Kind(k){const t=TYPES[k];if(!t||NET.guest)return null;if(b24Echo())return null;
  if(DG){const d=DG.d;if(!t.boss||!d||DG.a21||DG.b4||DG.j2t||DG.j3t||d.trial||d.arena||!(DG.ci>=0&&DG.ci<900)||DG.boss)return null;return 'dg'}
  return REG&&REG.boss===k&&!REG.bossE?'fd':null}
{const _m=dgMob;dgMob=function(k,x,y,lvl,extra){const kind=b24Kind(k),e=_m.apply(this,arguments);if(!kind||!e)return e;
  const L=e.lvl||lvl||1,m=kind==='dg'?B24.dgHp(L):B24.fdHp(L);e.hp=Math.round(e.hp*m);e.max=Math.round(e.max*m);e.dmg*=B24.dmg(L);e._b24=kind;return e}}
// 보스의 한 대는 최대 생명력의 60%까지 (참가자 화면에서도: 보낸 보스를 TYPES로 알아본다)
const b24IsBoss=s=>!!(s&&!s.dead&&(s._b24||(TYPES[s.k]&&(TYPES[s.k].boss||(REG&&s.k===REG.boss)))));
{const _hp=hitPlayer;hitPlayer=function(d,src,...a){if(d>0&&b24IsBoss(src)){const c=maxHp()*B24.CAP;if(d>c)d=c}return _hp.call(this,d,src,...a)}}
// ===== 보스방 넓히기 =====
function b24Grow(G,d){const {g,rooms}=G;if(!rooms||rooms.length<8)return false;const st=rooms[0];
  const far=()=>{const D=bfs(g,st.cx,st.cy);return rooms.slice(1).sort((a,b)=>D[tIdx(b.cx,b.cy)]-D[tIdx(a.cx,a.cy)])[0]};
  const br=far();if(!br)return false;const t=TYPES[d&&d.boss]||{},want=Math.ceil(br.w*br.h*((t.sc||2)>=2.7?2.6:2.25));
  let i0=br.i,j0=br.j,i1=br.i+br.w-1,j1=br.j+br.h-1;const others=rooms.filter(r=>r!==br);
  const ok=(x0,y0,x1,y1)=>{if(x0<1||y0<1||x1>DN-2||y1>DN-2)return false;for(const r of others)if(x0<=r.i+r.w&&x1>=r.i-1&&y0<=r.j+r.h&&y1>=r.j-1)return false;return true};
  const sx=Math.sign(br.cx-st.cx)||1,sy=Math.sign(br.cy-st.cy)||1;
  for(let n=0;n<40&&(i1-i0+1)*(j1-j0+1)<want;n++){const w=i1-i0+1,h=j1-j0+1;
    const sides=[];const H=[[sx>0?'R':'L'],[sx>0?'L':'R']],V=[[sy>0?'D':'U'],[sy>0?'U':'D']];
    (w<=h?[H[0],V[0],H[1],V[1]]:[V[0],H[0],V[1],H[1]]).forEach(s=>sides.push(s[0]));
    let grown=false;for(const s of sides){const c=s==='L'?[i0-1,j0,i0-1,j1]:s==='R'?[i1+1,j0,i1+1,j1]:s==='U'?[i0,j0-1,i1,j0-1]:[i0,j1+1,i1,j1+1];
      if(ok(...c)){if(s==='L')i0--;else if(s==='R')i1++;else if(s==='U')j0--;else j1++;grown=true;break}}
    if(!grown)break}
  if((i1-i0+1)*(j1-j0+1)<want)return false;
  const keep={i:br.i,j:br.j,w:br.w,h:br.h,cx:br.cx,cy:br.cy},g0=g.slice();
  for(let y=j0;y<=j1;y++)for(let x=i0;x<=i1;x++)g[tIdx(x,y)]=1;Object.assign(br,{i:i0,j:j0,w:i1-i0+1,h:j1-j0+1,cx:i0+((i1-i0+1)>>1),cy:j0+((j1-j0+1)>>1),b24:keep.w*keep.h});
  if(far()!==br){g.set(g0);Object.assign(br,keep);delete br.b24;return false}return true}
{const _g=genDungeon;genDungeon=function(d){if(!B24.gen||B24.gen!==d)return _g.apply(this,arguments);let G=null;
  for(let k=0;k<30;k++){G=_g.apply(this,arguments);if(!G.rooms||G.rooms.length<8)return G;if(b24Grow(G,d))return G}return G}}
{const _ed=enterDungeon;enterDungeon=function(c){const d=c&&c.cave,on=!!(d&&!NET.guest&&!d.trial&&!d.arena&&d.boss);const g0=B24.gen;if(on)B24.gen=d;
  try{return _ed.apply(this,arguments)}finally{B24.gen=g0}}}
window.__b24=Object.assign(window.__b24||{},{B24,b24Kind,b24Grow,b24IsBoss});
