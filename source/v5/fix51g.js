/* ---------- v51 길잡이: 어둠의 등불 · 거점 쉼터가 어디 있는지 알려 주기 ----------
   사용자 2026-11-02 「현재는 어둠의 등불을 고를 수 있는 맵이 어디인지 제대로 설명이 안돼있어. 그리고 자신의 쉼터를 고르는 것도.」
   · 어둠의 등불(dark21.js): 켜지기 전에도 꺼진 등불이 보이고, 가까이 가면 「재의 군주를 쓰러뜨리면 켜집니다」 · 누르면 어떻게 켜는지 알림.
     지옥 「불 꺼진 왕도」의 「꺼진 등대지기의 집」에 처음 들어오면 등불이 여기 있다고 한 번 알림.
   · 거점(g42f.js): 「거점」 칸 아래에 고를 수 있는 쉼터 여섯(지역 · 레벨 · 가 봤는지 · 가는 길) 목록.
     여섯 쉼터마다 「거점 표지판」(누르면 거점 칸이 열림) · 거점이 없을 때 그 쉼터에 처음 들어오면 한 번 알림.
   · 세계 지도: 쉼터 여섯에 ⌂(금색 = 내 거점), 불 꺼진 왕도에 ✦(어둠의 등불, 켜지면 보라색) · 아래 설명 줄.
   · 「성장」 칸: 「어디서 고르나요」 상자(60레벨부터 거점, 100레벨부터 어둠 단계).
   안내만 더한다. 규칙 · 수치 · 저장 값은 바꾸지 않는다(알림을 한 번 했는지는 저장하지 않고 게임을 켤 때마다 새로). */
const G51={tip:{},lampTip:0,posts:{},SHOW_BS:60,SHOW_LAMP:100};
const G51_SIDE={N:'북',S:'남',E:'동',W:'서'};
const g51Menu=()=>typeof touchMode!=='undefined'&&touchMode?'☰ 안 「성장」':'「성장」(G)';
// 그 지역으로 들어가는 길: 이어진 이웃 지역 가운데 레벨이 가장 낮은 곳의 어느 쪽 끝
function g51Way(id){let best=null;
  for(const n in REGIONS){if(n===id)continue;const e=REGIONS[n].edges;if(!e)continue;for(const sd in e)if(e[sd]===id){const b=REGIONS[n].base|0;if(!best||b<best.b)best={n,sd,b}}}
  if(!best){const R0=REGIONS[id],sd=R0&&R0.entry,n=sd&&R0.edges&&R0.edges[sd];if(n&&REGIONS[n])return `「${REGIONS[n].n}」에서 넘어감`;return ''}
  return `「${REGIONS[best.n].n}」 ${G51_SIDE[best.sd]||''}쪽 끝에서 넘어감`}
const g51Lv=id=>typeof w3LvOf==='function'?w3LvOf(id):(REGIONS[id].base|0);
const g51Camp=id=>RCACHE[id]&&RCACHE[id].town||null;

/* ===== 어둠의 등불: 꺼져 있어도 보이고, 어떻게 켜는지 알려 준다 ===== */
const G51_LAMP_HOW='어둠의 등불은 아직 꺼져 있습니다 · 같은 「불 꺼진 왕도」의 「재의 왕좌」 던전에서 재의 군주를 처음 쓰러뜨리면 켜지고, 그때부터 여기서 어둠 단계를 고릅니다 (지옥 난이도)';
{const _l=sqUseLive;sqUseLive=function(d){if(d&&d.use==='g51:bs'){const b=g42Bs(),reg=REG.id;
      return{label:b.reg===reg?'내 거점 · 건물 올리기':b.reg?'거점 표지판 · 여기로 거점 옮기기':'거점 표지판 · 이 쉼터를 거점으로',col:'#ffd98a',q:0}}
    if(d&&d.use==='d21:lamp'&&!darkLit())return{label:'꺼진 어둠의 등불 · 재의 군주를 쓰러뜨리면 켜집니다',col:'#a89cc0',q:0};
    return _l(d)}}
{const _u=sqUse;sqUse=function(d){if(d&&d.use==='g51:bs'){v20Open('g42','bs');return}
    if(d&&d.use==='d21:lamp'&&!darkLit()){msg(G51_LAMP_HOW,'#c8a0ff');return}
    return _u(d)}}

/* ===== 거점 표지판: 여섯 쉼터 안 ===== */
function g51PlacePosts(){let n=0;for(const id of G42_BSREG){if(G51.posts[id]){n++;continue}const T=g51Camp(id);if(!T)continue;
    const d=v20AddProp(T.id,-120,70,{k:'signpost',pv:0,use:'g51:bs',qonly:1});if(d){G51.posts[id]=d;n++}}
  v20SyncDecor();return n}
g51PlacePosts();

/* ===== 거점 칸: 고를 수 있는 쉼터 여섯 ===== */
function g51BsList(){const b=g42Bs(),inCamp=G42_BSREG.includes(REG.id)&&g42InTown();
  let h=`<div class="v20box"><h3>거점으로 삼을 수 있는 쉼터 여섯</h3><p class="muted" style="margin:4px 0">${inCamp?'':'<b style="color:#ffb07a">지금은 쉼터 밖이라 고르는 단추가 없습니다.</b> '}아래 쉼터 가운데 하나에 들어가(안전한 원 안) 이 칸을 다시 열거나, 쉼터의 「거점 표지판」을 누르면 「이 쉼터를 거점으로」 단추가 나옵니다. 세계 지도에는 <b style="color:#ffd98a">⌂</b>로 표시됩니다.</p>`;
  for(const id of G42_BSREG){const R0=REGIONS[id];if(!R0)continue;const T=g51Camp(id),tn=T?T.n:R0.n,been=!!(T&&P.towns.includes(T.id)),mine=b.reg===id,here=REG.id===id&&g42InTown();
    h+=`<div class="v20row"><div><b style="color:${mine?'#ffd98a':R0.col}">⌂ ${v20Esc(tn)}</b>${mine?' <span style="color:#ffd98a">· 내 거점</span>':''}${here?' <span style="color:#9fe0ff">· 지금 여기</span>':''}<br><span class="muted" style="font-size:12px">${v20Esc(R0.n)} · Lv${g51Lv(id)}~ · ${been?'가 본 곳: 마을 짝문으로 바로 갈 수 있음':'가는 길: '+v20Esc(g51Way(id))}</span></div></div>`}
  return h+'</div>'}
{const t=G42.tabs.find(x=>x.k==='bs');if(t){const _h=t.html;t.html=function(){return _h.apply(this,arguments)+g51BsList()}}}

/* ===== 「성장」 칸: 어디서 고르나요 ===== */
function g51WhereHtml(){if(!P)return '';const rows=[],b=g42Bs();
  if(P.lvl>=G51.SHOW_BS||b.reg){const T=b.reg&&g51Camp(b.reg);rows.push(`<div class="v20row"><div><b style="color:#ffd98a">⌂ 거점 쉼터</b><br><span class="muted" style="font-size:12px">70~100레벨 지역의 쉼터 여섯 가운데 하나 · 그 쉼터 안에서 「거점」 칸이나 거점 표지판으로 고릅니다${T?` · 지금 거점: ${v20Esc(T.n)}`:' · 아직 없음'}</span></div></div>`)}
  if(P.lvl>=G51.SHOW_LAMP||darkLit()){rows.push(`<div class="v20row"><div><b style="color:#b48aff">✦ 어둠의 등불 (어둠 단계)</b><br><span class="muted" style="font-size:12px">지옥 난이도 「불 꺼진 왕도」의 쉼터 「꺼진 등대지기의 집」 안 · ${darkLit()?'켜져 있음: 다가가 F(휴대폰은 누르기)로 단계를 고릅니다':'꺼져 있음: 같은 왕도의 「재의 왕좌」에서 재의 군주를 처음 쓰러뜨리면 켜집니다'}</span></div></div>`)}
  return rows.length?`<div class="v20box"><h3>어디서 고르나요</h3>${rows.join('')}</div>`:''}
{const t=G42.tabs.find(x=>x.k==='main');if(t){const _h=t.html;t.html=function(){return _h.apply(this,arguments)+g51WhereHtml()}}}

/* ===== 처음 들어오면 한 번 알림 (게임을 켤 때마다 새로) ===== */
function g51Tips(){if(!P||P.dead||DG||IN)return '';const id=REG.id;
  if(G42_BSREG.includes(id)&&g42InTown()&&!G51.tip[id]){G51.tip[id]=1;const b=g42Bs();if(b.reg)return '';
    const s=`이 쉼터를 내 거점으로 삼을 수 있습니다 · ${g51Menu()} 창의 「거점」 칸이나 쉼터의 「거점 표지판」을 눌러 보세요`;msg(s,'#ffd98a');return s}
  if(id==='capital'&&!darkLit()&&!G51.lampTip&&P.diff===2&&g42InTown()){const T=g51Camp('capital');if(T&&T.id==='keeperhouse'){G51.lampTip=1;msg('이 집에 꺼진 「어둠의 등불」이 있습니다 · 재의 군주를 처음 쓰러뜨리면 켜지고, 여기서 어둠 단계를 고릅니다','#c8a0ff');return 'lamp'}}
  return ''}
V20.slowTick.push(()=>{try{g51Tips()}catch(e){if(window.__QA)throw e}});

/* ===== 세계 지도: ⌂ 거점 쉼터 · ✦ 어둠의 등불 ===== */
function g51MapMarks(g){const G=WMAP.geo;if(!G||!P)return [];const b=g42Bs(),out=[];
  const mark=(id,t,col)=>{if(!WPOS[id])return;out.push([id,t]);if(!g)return;const p=G.pos(id),x=p.x-G.w/2+3,y=p.y-G.h/2+3;
    g.fillStyle='#14120e';g.beginPath();g.arc(x,y,8,0,6.283);g.fill();g.strokeStyle=col;g.lineWidth=1.5;g.stroke();
    g.font=`700 11px ${FONT}`;g.textAlign='center';g.textBaseline='middle';g.fillStyle=col;g.fillText(t,x,y+.5);g.textBaseline='alphabetic'};
  if(P.lvl>=G51.SHOW_BS||b.reg)for(const id of G42_BSREG)mark(id,'⌂',b.reg===id?'#ffd98a':'#a39d8f');
  if(P.lvl>=G51.SHOW_LAMP||darkLit())mark('capital','✦',darkLit()?'#b48aff':'#7a7468');
  if(out.length){const lg=$('#wmapLeg');if(lg&&!lg.innerHTML.includes('g51leg')){const k=out.map(o=>o[1]);
    lg.innerHTML+=`<span class="g51leg"> ${k.includes('⌂')?'<b style="color:#ffd98a">⌂</b> 거점으로 삼을 수 있는 쉼터(금색 = 내 거점).':''} ${k.includes('✦')?'<b style="color:#b48aff">✦</b> 어둠의 등불: 지옥 불 꺼진 왕도의 꺼진 등대지기의 집.':''}</span>`}}
  return out}
{const _w=wmapWorld22;wmapWorld22=function(g){const r=_w.apply(this,arguments);try{g51MapMarks(g)}catch(e){if(window.__QA)throw e}return r}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{G51,g51Way,g51BsList,g51WhereHtml,g51Tips,g51MapMarks,g51PlacePosts})}catch(_){}},0);
