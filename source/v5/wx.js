/* ---------- 월드 확장(v18): 지역 마을 의뢰 · 2막 · 목표 표시 · 세계 지도 · 저장 안전 ----------
   sq.js · worldmap.js 뒤에 붙는다. 데이터는 wx-world.js · wx-act2.js · wx-towns.js, 땅에 놓기는 wx-base.js. */
// 지역 마을 의뢰 60개
SQ.push(...WX_SQ);for(const q of WX_SQ)SQBY[q.id]=q;
// 채집 자리: 지역 땅을 지을 때 정해 둔 자리 (같은 씨앗 → 늘 같은 자리)
const WXSPOT_REG={};
function wxSpotsSync(){for(const id of REG_IDS){const L=RCACHE[id];if(L&&L.spots)for(const sid in L.spots){SQSPOT[sid]=L.spots[sid];WXSPOT_REG[sid]=id}}}
wxSpotsSync();
Object.assign(WPOS,WX_WPOS);
// 선행 의뢰(req)를 끝내야 다음 의뢰가 열린다
{const _a=sqAvail;sqAvail=function(q){const v=_a(q);if((v==='ok'||v==='low')&&q.req&&!(sqState().d[q.req]>0))return 'locked';return v}}
// 채집 자리 쓰기: 지역 채집 자리는 이름만 다르고 은방울풀과 같다
{const _l=sqUseLive;sqUseLive=function(d){const S=d&&WX_SPOTS[d.use];if(!S)return _l(d);const h=sqUseQ(d.use);if(!h)return null;const a=sqState().a[h.q.id];if(!a||a.got.includes(d.si))return null;
  return{label:`${S.label} ${S.kind==='drift'?'줍기':'캐기'}`,col:'#9fe39a',q:1}}}
{const _u=sqUse;sqUse=function(d){const S=d&&WX_SPOTS[d.use];if(!S)return _u(d);const h=sqUseQ(d.use);if(!h)return;const a=sqState().a[h.q.id];if(a.got.includes(d.si))return;
  a.got.push(d.si);burst(d.x,d.y,'#9fe39a',14,80);sqProgress(h.q,h.j,1)}}
// 처치 목표가 있는 곳: 던전 준보스·보스 → 그 동굴, 둥지 우두머리 → 둥지, 지역 들판 몬스터 → 그 지역 들판
const WXZ={};
function wxRegZone(id,k){const L=RCACHE[id],T=L&&L.town,D=REGIONS[id];if(!T)return null;const t=TYPES[k],dd=SAFE+Math.max(0,(t.min||D.base)+1-D.base)*360+120,
  ax=L.lair.x-T.x,ay=L.lair.y-T.y,l=Math.hypot(ax,ay)||1;let x=T.x+ax/l*dd,y=T.y+ay/l*dd;
  const ok=L.okT||(L.okT=wxReach(L.lq,T.x,T.y));// 섬 지역: 마을에서 걸어서 닿는 땅이 나올 때까지 마을 쪽으로
  for(let k2=0;k2<40&&L.lq&&(wxLiq(L,x,y)||!wxCanReach(ok,x,y));k2++){x+=(T.x-x)*.1;y+=(T.y-y)*.1}
  return{reg:id,x,y,label:`${D.n} 들판 · ${t.n} 출몰`,zone:1}}
const wxLiq=(L,x,y)=>{const keep=LQ;LQ=L.lq;const v=blockedAt(x,y);LQ=keep;return v};
function wxKillTarget(kinds,townId){if(!kinds||!kinds.length)return null;const key=kinds.join(',')+'/'+townId;if(key in WXZ)return WXZ[key];
  const tw=ALLTOWNS.find(t=>t.id===townId),pref=tw&&tw.reg||'home',ids=[pref,...REG_IDS.filter(i=>i!==pref)];let r=null;
  // 던전
  {const hc=HOME.caves.findIndex(c=>[...c.cave.minis,c.cave.boss].some(k=>kinds.includes(k)));if(hc>=0){const c=HOME.caves[hc];r={reg:'home',x:c.x,y:c.y,cave:hc,label:`${qPlace(c.x,c.y)} · 던전 「${c.cave.n}」`}}}
  for(const id of ids){if(r)break;if(id==='home')continue;const L=RCACHE[id];if(!L)continue;
    const ci=L.caves.findIndex(c=>[...c.cave.minis,c.cave.boss].some(k=>kinds.includes(k)));
    if(ci>=0){const c=L.caves[ci];r={reg:id,x:c.x,y:c.y,cave:ci,label:`${REGIONS[id].n} · 던전 「${c.cave.n}」 Lv${c.cave.lvl}`};break}
    if(REGIONS[id].boss&&kinds.includes(REGIONS[id].boss)){r={reg:id,x:L.lair.x,y:L.lair.y,label:`${REGIONS[id].n} 깊은 곳 · ${TYPES[REGIONS[id].boss].n}의 둥지`};break}}
  if(!r)for(const id of ids){if(id==='home')continue;const D=REGIONS[id];const k=kinds.find(k=>(D.mobs||[]).includes(k));if(k){r=wxRegZone(id,k);break}}
  // 던전 안에서만 나오는 졸개(예: 2막 문 조각을 주는 몬스터가 던전에만 있을 때)
  if(!r){const d=WX_DUNGEONS.find(d=>d.mobs.some(k=>kinds.includes(k)));if(d){const L=RCACHE[d.reg],ci=L?L.caves.findIndex(c=>c.cave===d):-1;if(ci>=0){const c=L.caves[ci];r={reg:d.reg,x:c.x,y:c.y,cave:ci,label:`${REGIONS[d.reg].n} · 던전 「${d.n}」`}}}}
  return WXZ[key]=r}
{const _qz=qZone;qZone=function(kinds,townId){const tw=ALLTOWNS.find(t=>t.id===townId),home=!tw||(tw.reg||'home')==='home'||TOWN0.some(a=>a.id===townId);// v26: 왕도로 옮긴 아르덴의 의뢰도 남부 들판(옛 자리 둘레)을 먼저 본다
  if(home){const z=_qz(kinds,townId);if(z)return z}return wxKillTarget(kinds,townId)}}
// 1막·2막 목표 자리: 의뢰인이 지역 마을에 있어도 찾는다
qMainTargetW=function(){const q=qCur(),st=qState();if(!q)return null;
  const npc=id=>{const t=qTw(id);return t&&t.npc?{reg:t.reg||'home',x:t.npc.x,y:t.npc.y,label:`${t.n} · ${QNPC[id].n}`}:null};
  if(st.st===0)return npc(q.town);if(st.st===2)return npc(qTurnTown(q));
  for(let j=0;j<q.goals.length;j++){if(qGoalDone(q,j))continue;const g=q.goals[j];if(g.type==='talk')return npc(g.town);
    const hc=HOME.caves.findIndex(c=>[...c.cave.minis,c.cave.boss].some(k=>g.k.includes(k)));
    if(hc>=0){const c=HOME.caves[hc];return{reg:'home',x:c.x,y:c.y,cave:hc,label:`${qPlace(c.x,c.y)} · 던전 「${c.cave.n}」`}}
    const z=qZone(g.k,q.town);if(z)return{reg:'home',...z}}
  return null};
// 동굴 번호는 지역마다 0부터라 다른 지역의 같은 번호를 지금 던전으로 착각하지 않게
const wxTg=tg=>tg&&tg.cave!=null&&(tg.reg||'home')!==REG.id?Object.assign({},tg,{cave:-99}):tg;
{const _r=qRoute;qRoute=function(tg){return _r(wxTg(tg))}}
{const _w=qWhereText;qWhereText=function(tg){return _w(wxTg(tg))}}
// 마을 의뢰 목표: 지역 채집 자리
{const _t=sqTarget;sqTarget=function(q){const t=_t(q);if(t&&t.spots&&WXSPOT_REG[t.spots]){const S=WX_SPOTS[t.spots],id=WXSPOT_REG[t.spots];
  const a=sqState().a[q.id],near=REG.id===id?P:RCACHE[id].town;let b=null,bd=1e9;SQSPOT[t.spots].forEach((p,i)=>{if(a&&a.got.includes(i))return;const d=Math.hypot(p.x-near.x,p.y-near.y);if(d<bd){bd=d;b=p}});
  if(b)return{reg:id,x:b.x,y:b.y,label:`${REGIONS[id].n} · ${S.label} 자리`,spots:t.spots}}return t}}
// 미니맵·큰 지도: 지역 채집 자리 점 · 2막 고리 이름
{const _m=sqMarks;sqMarks=function(world){const out=_m(world),s=sqState();
  if(REG.id!=='home'&&!IN&&!DG)for(const id in s.a){const q=SQBY[id];if(!q)continue;const t=sqTarget(q);if(!t||!t.spots||WXSPOT_REG[t.spots]!==REG.id)continue;const a=s.a[id];SQSPOT[t.spots].forEach((sp,i)=>{if(!a.got.includes(i))out.push({x:sp.x,y:sp.y,kind:'dot',col:'#9fe39a'})})}
  // 메인 의뢰: 목표 고리와 의뢰인 ! ? 는 주황 (마을 의뢰 색은 그대로)
  const npcAt=new Set(TOWNS.filter(t=>t.npc).map(t=>Math.round(t.npc.x)+','+Math.round(t.npc.y)));
  for(const k of out){if(k.main){k.col=WX_QCOL.main;if(k.label)k.label='메인 · '+k.label.replace(/^1막/,wxAct()+'막')}
    else if((k.kind==='!'||k.kind==='?')&&!IN&&npcAt.has(Math.round(k.x)+','+Math.round(k.y))){k.col=WX_QCOL.main;k.mq=1}}
  return out}}
// 2막 제목: 알림판 · 일지 · 의뢰 창
const wxAct=()=>qState().i>=12?2:1;
const WXTAG={m:'<i class="qtg m">메인</i>',s:'<i class="qtg s">의뢰</i>'};
{const st=document.createElement('style');st.textContent='.qtg{font-style:normal;font-size:10px;font-weight:800;line-height:1;padding:2px 4px 1px;margin-right:5px;border-radius:3px;vertical-align:1px;display:inline-block}.qtg.m{background:#ff9a1f;color:#2a1400}.qtg.s{color:#9fe0ff;border:1px solid rgba(127,216,255,.55);padding:1px 3px 0}';document.head.appendChild(st)}
{const _h=qHudBlock;qHudBlock=function(){const b=_h();if(b){if(wxAct()===2)b.t=b.t.replace(/^1막 · /,'2막 · ');b.t=WXTAG.m+b.t;b.main=1}return b}}
{const _s=sqHudBlocks;sqHudBlocks=function(){const o=_s();for(const b of o)b.t=WXTAG.s+b.t;return o}}
{const _l=sqLogHtml;sqLogHtml=function(){let h=_l().replace('노란 고리(1막) · 하늘색 고리(마을 의뢰)',`<b style="color:${WX_QCOL.main}">주황 고리 · 주황 ! ?(메인)</b> · 하늘색 고리 · 노란 ! 하늘 ?(마을 의뢰)`).replace(/<div class="qlog"><b>(?!<i class="qtg)/g,'<div class="qlog"><b>'+WXTAG.s);if(wxAct()===2){h=h.replace('<h2>1막 「재의 그림자」</h2>','<h2>2막 「갈라진 문」</h2>').replace('1막의 의뢰를 모두 마쳤습니다.','2막 「갈라진 문」까지 모든 의뢰를 마쳤습니다.')}return wxKindTags(h)}}
{const _q=questHtml;questHtml=function(){const h=_q();if(SQV.mode)return wxKindTags(h);if(!qCur()&&wxAct()===2)return h.replace(/<p class="qsay">「재의 사도가[^<]*<\/p><p class="muted">1막의 의뢰를 모두 마쳤습니다.<\/p>/,'<p class="qsay">「문이 닫히고 보랏빛 바람이 멎었네. 자네 덕분일세.」</p><p class="muted">2막 「갈라진 문」까지 모든 의뢰를 마쳤습니다.</p>');return h}}
// 의뢰 종류 글자 색: 수집·처치·배달·채집·매일·일상 + 던전·토벌
const WX_KIND={'수집':'#e8c45a','처치':'#ff9a7a','배달':'#9fd0ff','채집':'#9fe39a','매일':'#c8b4ff','일상':'#e8e0cc','호위':'#ffd09a','던전':'#ff8a3a','토벌':'#ff5a5a','찾기':'#e8e0cc'};
const wxKindTags=h=>h.replace(/<span class="muted">(진행 중 · )?(수집|처치|배달|채집|매일|일상|호위|던전|토벌)( · |<\/span>)/g,(m,a,k,b)=>`<span class="muted">${a||''}<b style="color:${WX_KIND[k]}">${k}</b>${b}`);
// 도감: 지역 던전도 나오는 곳에 적는다
{const _mi=monInfo;monInfo=function(k){const m=_mi(k);let lv=m.where.length?m.lv:99;
  for(const d of WX_DUNGEONS){const r=REGIONS[d.reg].n;if(d.mobs.includes(k)){m.where.push(`${r} 던전 ${d.n}`);lv=Math.min(lv,d.lvl)}if(d.minis.includes(k)){m.where.push(`${r} 던전 ${d.n}의 준보스`);lv=Math.min(lv,d.lvl+1)}if(d.boss===k){m.where.push(`${r} 던전 ${d.n}의 마지막 보스`);lv=Math.min(lv,d.lvl+2)}}
  m.lv=lv===99?m.lv:lv;return m}}
{const _g=cxGroups;cxGroups=function(){const G=_g(),other=G.length&&G[G.length-1][0]==='그 밖의 몬스터'?G.pop():null,seen=new Set();for(const [,ks] of G)ks.forEach(k=>seen.add(k));
  for(const d of WX_DUNGEONS){const ks=[...d.minis,d.boss].filter(k=>TYPES[k]&&!seen.has(k));ks.forEach(k=>seen.add(k));if(ks.length)G.push([`${REGIONS[d.reg].n} 던전 · ${d.n} (Lv${d.lvl})`,ks])}
  if(other){const ks=other[1].filter(k=>!seen.has(k));if(ks.length)G.push(['그 밖의 몬스터',ks])}return G}}
// 깊은 던전 보스: 상급 유니크 굴림의 절반은 그 던전 전용(WX_BOSSU dg)에서
function wxBossPool(dgId){return WX_BOSSU.filter(u=>u.dg===dgId)}
// 그 직업에 맞는 것만 (전사·궁수는 cls2.js uFits 규칙), 맞는 게 없으면 원래 굴림. BOSSU를 잠깐 바꿔 끼우므로 makeItem을 누가 감싸든 같다
const wxFits=(u,c)=>typeof PHYS_CLS!=='undefined'&&PHYS_CLS[c]&&typeof uFits==='function'?uFits(u,c):(!u.cls||u.cls===c);
{const _bd=dgBossDrop;dgBossDrop=function(e){const t=TYPES[e.k],own=DG&&DG.d&&t&&t.boss?wxBossPool(DG.d.id):[];
  if(!own.length)return _bd(e);const keep=makeItem;let n=0;
  makeItem=function(il,elite,cls,force){const c=cls||P.cls,fit=force==='boss'&&n++===0&&R()<.5?own.filter(u=>wxFits(u,c)):[];
    if(!fit.length)return keep.apply(this,arguments);const save=BOSSU.splice(0,BOSSU.length,...fit);try{return keep.apply(this,arguments)}finally{BOSSU.splice(0,BOSSU.length,...save)}};
  try{return _bd(e)}finally{makeItem=keep}}}
// 저장 안전: 지역 던전 안에서 저장하면 그 지역(동굴 앞)으로 돌아온다 · 불러온 자리가 물/용암 위면 그 지역 짝문 앞으로
{const _sd=saveData;saveData=function(){const d=_sd();if(DG&&REGIONS[REG.id])d.reg=REG.id;return d}}
// 불러온 자리가 물 · 건물 발자국 안이면 (마을 배치가 바뀌어 옛 자리가 집 안이 된 경우 포함) 가장 가까운 마을 짝문 앞으로
const wxStuckIn=(L,x,y)=>L.id!=='home'&&wxLqAt(L.lq,x,y)>.5||twWet(L.id,x,y)||(TW.blds[L.id]||[]).some(b=>b.foot&&b.foot.some(f=>x>f[0]-4&&x<f[2]+4&&y>f[1]-4&&y<f[3]+4));
const wxStuck=(x,y)=>wxStuckIn(twL(REG.id)||{id:REG.id},x,y);
// 짝문 앞 빈자리 (짝문 오른쪽 아래부터 둘레를 돈다)
function wxGateDrop(L,t){for(const r of [57,80,110])for(let i=0;i<16;i++){const a=.785+i/16*6.283,x=t.gate.x+Math.cos(a)*r,y=t.gate.y+Math.sin(a)*r;if(!wxStuckIn(L,x,y))return{x,y}}return{x:t.gate.x,y:t.gate.y}}
{const _ld=load;load=function(d,slot){const ok=_ld(d,slot);if(ok&&!DG&&!IN&&wxStuck(P.x,P.y)){const t=nearestTown(P.x,P.y).t,p=wxGateDrop(twL(REG.id),t);P.x=p.x;P.y=p.y;followCam()}return ok}}
// 시험용
window.__wx={WX_REGIONS,WX_TYPES,WX_DUNGEONS,WX_ACT2,WX_SQ,WX_SPOTS,WX_FOLK,WX_BOSSU,WX_RETUNE,FIELD_BUDGET,WXSPOT_REG,wxKillTarget,wxReach,wxCanReach,wxBossPool,wxFits,get RCACHE(){return RCACHE},buildRegion:id=>buildRegion(id),wxTownAudit,wxTownRelax,wxTowns,WXT,wxStuck,wxStuckIn,wxGateDrop,WX_QCOL,wxMarkCol};
