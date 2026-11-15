/* ---------- 2차 스킬 트리 계열 나누기 (사용자 2026-11-15) ----------
   「1차에서는 특정 계열을 선택해서 올렸는데 2차에서는 그런 선택지가 전혀 없잖아. 대심문관을 골랐으면 심판과 퇴마 계열쪽이랑
    축복/치유/수호쪽으로 갈라놔야지. 대심문관은 공격형이니까 축복/치유/수호쪽은 보조적으로 선택할 수 있도록. 궁수나 마법사, 전사도 동일하게.」
   · 계열 표는 job2d.js의 J2G(갈래마다 주 계열 둘 + 보조 계열 하나). job2Ok(job2.js)가 보조 계열로 빌려 온 기술도 찍고 쓰게 한다.
   · 보조 계열: 한 기술 최대 J2G_SUP.per(10)점, 계열 합계 최대 J2G_SUP.tot(20)점. 주 계열은 예전처럼 한 기술 20점.
   · 스킬 id · 저장 형식은 그대로. 불러올 때 보조 계열에 상한보다 많이 찍혀 있으면 넘는 점수만 스킬 포인트로 돌려준다(줄이기만, 지우지 않음 · 매번 불러올 때 같은 결과).
   · 갈래 탭 그림: 계열마다 칸 묶음(머리글: 이름 · 주/보조 · 찍은 점수), 선행 선은 예전과 같은 모양(M x y V … H …)으로 그린다.
   arch38.js · g42c.js 뒤, b5.js 앞에 붙는다(b5의 let은 실행 중에만 쓴다). */
const J2GV={};
/* 사용자 2026-11-15 「2차 기술과 상위 기술을 왜 나눠 놨는지 모르겠어. 하나로 합쳐」: 전직 뒤에는 「상위 기술」 탭이 없어지고, 상위 기술(ADV_IDS)이
   갈래 탭 안의 「공용 기술」 묶음(맨 오른쪽)으로 들어간다. 한 기술 20점 그대로 · 저장은 그대로(같은 id · 같은 점수).
   전직 전에는 예전처럼 잠긴 목록 탭(이름 「2차 기술 · 잠김」)에서 미리 찍어 둔 점수를 본다. 줄(단)은 열리는 레벨(upLv)로. */
const J2G_ADVN='공용 기술';
function j2gAll(br){const k='all:'+br;if(J2GV[k])return J2GV[k];const G=J2G[br].slice();let cls=null;for(const c in JOB2_IDS)if(JOB2_IDS[c].includes(br))cls=c;
  const ids=((typeof ADV_IDS==='object'&&ADV_IDS[cls])||[]).filter(id=>SPELLS[id]);if(ids.length)G.push({n:J2G_ADVN,main:true,adv:true,ids});return J2GV[k]=G}
const j2gRk=s=>{if(s.job2)return s.rank;const lv=s.upLv||RANK_LV_J2[0];let r=0;for(let i=0;i<RANK_LV_J2.length;i++)if(RANK_LV_J2[i]<=lv)r=i;return 10+r};
const j2gGroups=()=>P&&P.job2?J2G[P.job2]||null:null;
const j2gPts=g=>{let n=0;for(const id of g.ids)n+=P.sk[id]||0;return n};
const j2gSup=id=>{const g=P&&P.job2?j2gOf(P.job2,id):null;return g&&!g.main?g:null};
const j2gMax=id=>j2gSup(id)?J2G_SUP.per:MAXSK;
// 찍기: 보조 계열 상한
{const _cl=canLearn;canLearn=function(id){if(!_cl(id))return false;const g=j2gSup(id);if(g&&((P.sk[id]||0)>=J2G_SUP.per||j2gPts(g)>=J2G_SUP.tot))return false;return true}}
{const _kw=kbLearnWhy;kbLearnWhy=function(id){const g=j2gSup(id);if(g&&P.lvl>=ptNeed(id)){if((P.sk[id]||0)>=J2G_SUP.per)return `보조 계열 기술은 최대 ${J2G_SUP.per}점까지입니다`;if(j2gPts(g)>=J2G_SUP.tot)return `보조 계열 「${g.n}」에는 모두 합쳐 ${J2G_SUP.tot}점까지 찍을 수 있습니다`}return _kw(id)}}
// 불러오기: 보조 계열에 상한보다 많이 찍힌 점수만 돌려준다 (기술은 1점 이상 남기므로 선행 연결이 끊기지 않음)
function j2gFix(){if(!P||!P.job2||!P.sk)return 0;const G=J2G[P.job2];if(!G)return 0;let back=0;
  for(const g of G){if(g.main)continue;
    for(const id of g.ids){const v=P.sk[id]|0;if(v>J2G_SUP.per){back+=v-J2G_SUP.per;P.sk[id]=J2G_SUP.per}}
    let tot=j2gPts(g);while(tot>J2G_SUP.tot){let top=null;for(const id of g.ids)if((P.sk[id]|0)>1&&(!top||P.sk[id]>P.sk[top]))top=id;if(!top)break;P.sk[top]--;back++;tot--}}
  if(back>0){P.sp=(P.sp|0)+back;passT=-1}return back}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok&&P)try{const n=j2gFix();J2GV.last=n;
    if(n>0)setTimeout(()=>{msg(`2차 스킬 트리가 계열(주 계열 둘 + 보조 계열)로 나뉘었습니다. 보조 계열 상한을 넘던 ${n}점을 스킬 포인트로 돌려받았습니다`,'#ffd76a');msg(`보조 계열은 한 기술 ${J2G_SUP.per}점, 모두 합쳐 ${J2G_SUP.tot}점까지입니다 (스킬 트리 T)`,'#ffd76a')},1000)}catch(err){if(window.__QA)throw err}
  return ok}}
// 갈래 탭 이름 옆 점수: 빌려 온 기술까지
j2TabsHtml=(_t=>function(){let h=_t();if(!P||!P.job2||!J2G[P.job2])return h.replace(/(data-j2tab="adv"[^>]*>)상위 기술 /,'$12차 기술 ');let pj=0;for(const g of j2gAll(P.job2))pj+=j2gPts(g);
  h=h.replace(/<button type="button" data-j2tab="adv"[^>]*>[\s\S]*?<\/button>/,'');if(J2UI.tab==='adv')h=h.replace(/(data-j2tab="j2" class="[^"]*" aria-selected=")false/,'$1true');
  return h.replace(/(data-j2tab="j2"[^>]*>[^<]*<span class="muted">)\d+(<\/span>)/,`$1${pj}$2`)})(j2TabsHtml);
// 전직 뒤 「상위 기술」(adv)을 고른 상태여도 합친 갈래 나무를 보여 준다
j2AdvHtml=(_a=>function(){if(P&&P.job2&&J2G[P.job2])return j2gBranchHtml();return _a().replace('2차 전직으로 열린 기술입니다.','2차 전직으로 열린 공용 기술입니다. 전직하면 갈래 탭 안 「공용 기술」 묶음에 함께 나옵니다.').replace('뒤에 열립니다.</span>','뒤에 열립니다. 전직하면 갈래 탭 안 「공용 기술」 묶음으로 들어갑니다.</span>')})(j2AdvHtml);
// 칸 배치: 계열마다 왼쪽부터 칸 묶음. 묶음 안에서는 b2.js와 같은 규칙(선행 기술 바로 아래 칸 먼저)
function j2gLayout(br,ph){const K=br+(ph?':p':'');if(J2GV[K])return J2GV[K];const G=J2G[br],pos={},blocks=[];let c0=0;// 공용 기술은 나무 칸이 아니라 같은 탭 안 나무 아래 목록(PC) · 둘째 쪽(가로 휴대폰: 아이콘 34px · 옆으로 안 밀기 규칙 · 휴대폰 v48)
  for(const g of G){const list=g.ids.filter(id=>SPELLS[id]).map(id=>SPELLS[id]);const used={};let w=1;
    for(let r=10;r<=19;r++){const row=list.filter(s=>j2gRk(s)===r);row.sort((a,b)=>(PRE[b.id]?1:0)-(PRE[a.id]?1:0));const u=used[r]=new Set();
      for(const s of row){const pr=(PRE[s.id]||[]).find(p=>pos[p]&&pos[p].g===g);const want=pr?pos[pr].col-c0:0;let c=want;
        for(let d=0;d<8;d++){if(!u.has(want+d)){c=want+d;break}if(want-d>=0&&!u.has(want-d)){c=want-d;break}}
        u.add(c);w=Math.max(w,c+1);pos[s.id]={col:c0+c,rank:j2gRk(s),g}}}
    if(w<2&&!ph){for(const id in pos)if(pos[id].g===g)pos[id].col+=(2-w)/2;w=2}// 머리글 글자가 들어가게 묶음은 두 칸 이상 · 한 줄짜리는 가운데(가로 휴대폰은 칸이 고르게 60씩이어야 mob48이 돌려 그림)
    blocks.push({g,c0,w});c0+=w}
  return J2GV[K]={pos,blocks,cols:c0}}
function j2gAdvRows(ids){let h='';for(const id of ids){const s=SPELLS[id],L=skLv(id),need=reqLvOf(id),c=canLearn(id)?'can':'';h+=`<button class="j2row ${c}" type="button" data-node="${id}" aria-pressed="${nodeSel===id}" title="${s.n}">${spellSvg(s)}${L?`<span class="nl">${L}</span>`:''}<span style="min-width:0">${j2CM(id,'cmk')}<b>${s.n}</b><small>레벨 ${need}${PRE[id]?` · 선행 ${PRE[id].map(p=>SPELLS[p].n).join(', ')}`:''} ${j2PT(id)}</small></span></button>`}return h}
const j2gAdvBox=g=>`<div class="j2gadv"><div class="j2gh2"><b>${J2G_ADVN}</b> <small>예전 「상위 기술」 · 어느 갈래든 씀 · 한 기술 ${MAXSK}점 · ${j2gPts(g)}점</small></div><div class="j2adv">${j2gAdvRows(g.ids)}</div></div>`;
function j2gAdvPage(){const ids=(j2gAll(P.job2).find(g=>g.adv)||{ids:[]}).ids;if(!nodeSel||!ids.includes(nodeSel))nodeSel=ids.find(id=>P.sk[id])||ids[0];let h=`<p class="muted j2note"><button type="button" class="ghost j2gsub" data-j2gsub="x">◂ 계열 나무로</button> 「${J2G_ADVN}」(예전 「상위 기술」) · 갈래와 상관없이 쓰는 2차 기술</p><div class="j2adv">`+j2gAdvRows(ids);return h+'</div>'+detailHtml(nodeSel)}
{const _qc=questClick;questClick=function(b){const d=b.dataset;if(d.j2gsub){J2UI.sub=d.j2gsub==='x'?null:d.j2gsub;nodeSel=null;renderPanel();return true}if(d.j2tab||d.tree)J2UI.sub=null;return _qc(b)}}
function j2gBranchHtml(){const br=P.job2,J=JOB2[P.cls][br],ph=typeof M22==='object'&&M22.mode&&M22.mode()==='L';if(ph&&J2UI.sub==='adv')return j2gAdvPage();return j2gBranchHtml2(br,J,ph)}
function j2gBranchHtml2(br,J,ph){const L0=j2gLayout(br,ph),ids=Object.keys(L0.pos),advG0=j2gAll(br).find(g=>g.adv),advG=ph&&advG0;
  const CW=60,RH=58,LW=70,GAP=ph?0:14,HH=ph?0:40,width=LW+L0.cols*CW+GAP*(L0.blocks.length-1)+4,height=HH+RANK_LV_J2.length*RH;
  if(!nodeSel||!(ids.includes(nodeSel)||!ph&&advG0&&advG0.ids.includes(nodeSel)))nodeSel=ids.find(id=>P.sk[id])||ids[0];
  const bi=g=>L0.blocks.findIndex(b=>b.g===g);
  const pos=id=>{const p=L0.pos[id];return{x:LW+p.col*CW+bi(p.g)*GAP+25,y:HH+(p.rank-10)*RH+25}};let lines='',nodes='',labels='',heads='';
  for(let r=0;r<RANK_LV_J2.length;r++)labels+=`<div class="rl" style="top:${HH+r*RH}px"><b>${r+1}단</b>레벨 ${RANK_LV_J2[r]}</div>`;
  if(!ph)L0.blocks.forEach((b,i)=>{const x=LW+b.c0*CW+i*GAP,w=b.w*CW,pts=j2gPts(b.g);
    if(i&&!ph)heads+=`<div class="j2gsep" style="left:${x-GAP/2-1}px;top:4px;height:${height-8}px"></div>`;
    heads+=`<div class="j2gh${b.g.main?'':' sup'}" style="left:${x}px;width:${w}px" title="${b.g.n} · ${b.g.adv?'예전 상위 기술 · 어느 갈래든 씀':b.g.main?'주 계열':'보조 계열'}"><b>${ph&&!b.g.main?'보조':b.g.n}</b><small>${b.g.adv?'어느 갈래든':b.g.main?'주 계열':'보조 계열'} · ${b.g.main?pts+'점':pts+' / '+J2G_SUP.tot+'점'}</small></div>`});
  for(const id of ids){const s=SPELLS[id],p=pos(id);
    for(const pr of PRE[id]||[]){if(!L0.pos[pr]||!SPELLS[pr])continue;const q=pos(pr),on=P.sk[pr]>0,adj=p.y-q.y<=RH+1&&q.x===p.x,gx=q.x+(p.x>=q.x?30:-30),d=adj?`M${q.x} ${q.y+25}V${p.y-25}`:`M${q.x} ${q.y+25}V${q.y+29}H${gx}V${p.y-29}H${p.x}V${p.y-25}`;
      lines+=`<path d="${d}" fill="none" stroke="${on?'#c9a24a':'#5a4a36'}" stroke-width="2" stroke-linejoin="round"/>`}
    const L=skLv(id),c=L?(P.lvl<reqLvOf(id)?'has lockup':'has'):canLearn(id)?'can':P.lvl<reqLvOf(id)||!preOk(id)?'locked':'',sup=!L0.pos[id].g.main;
    nodes+=`<button class="node ${c}${s.kind==='passive'?' passive':''}${sup?' j2gsup':''}" type="button" data-node="${id}" aria-pressed="${nodeSel===id}" title="${s.n}${s.kind==='passive'?' (패시브)':''}${sup?` (보조 · 최대 ${J2G_SUP.per}점)`:''}" style="left:${p.x-25}px;top:${p.y-25}px">${j2PT(id)}${j2CM(id,'cmk cmn')}${spellSvg(s)}${s.kind==='passive'?'<span class="pv">패시브</span>':''}${L?`<span class="nl">${L}</span>`:''}</button>`}
  const sup=L0.blocks.find(b=>!b.g.main);
  return `<p class="muted j2note"><b style="color:#ffd76a">${J.n}</b> · ${J.desc}</p><p class="muted j2note j2grule">주 계열 둘(${L0.blocks.filter(b=>b.g.main&&!b.g.adv).map(b=>`「${b.g.n}」`).join(' · ')})은 한 기술 ${MAXSK}점까지 · 보조 계열${sup?` 「${sup.g.n}」`:''}은 한 기술 ${J2G_SUP.per}점, 모두 합쳐 ${J2G_SUP.tot}점까지.${L0.blocks.some(b=>b.g.adv)?` 「${J2G_ADVN}」(예전 「상위 기술」, ${ph?'아래 단추':'나무 아래 목록'})은 갈래와 상관없이 쓰는 기술로 한 기술 ${MAXSK}점까지.`:''} 2차 동안 받는 점수로는 다 찍을 수 없으니 주력으로 키울 계열을 고르세요.${advG?` <button type="button" class="ghost j2gsub" data-j2gsub="adv">${J2G_ADVN} ${j2gPts(advG)}점 ▸</button>`:''}</p><div class="treescroll"><div class="tree j2gtree" style="width:${width}px;height:${height}px"><svg class="lines" width="${width}" height="${height}">${lines}</svg>${heads}${labels}${nodes}</div>${advG0&&!ph?j2gAdvBox(advG0):''}</div>`+detailHtml(nodeSel)}
{const _bh=j2BranchHtml;j2BranchHtml=function(){if(!P||!P.job2||!J2G[P.job2]||(J2UI.tab==='el38'&&P.cls==='archer'))return _bh();return j2gBranchHtml()}}
// 설명 칸: 계열 이름 · 보조 계열 상한 · 빌려 온 기술에는 「다른 갈래 전용」 줄을 빼기
{const _dh=detailHtml;detailHtml=function(id){let h=_dh.apply(this,arguments);const s=SPELLS[id];if(typeof h!=='string'||!s||!P||!P.job2)return h;
  if(s.tab==='adv'&&!s.job2){const ln=`<div class="muted j2gline">「${J2G_ADVN}」 · 갈래와 상관없이 쓰는 2차 기술(예전 「상위 기술」)</div>`,i=h.indexOf('<div class="nums">');return i<0?h+ln:h.slice(0,i)+ln+h.slice(i)}
  if(!s.job2)return h;const g=j2gOf(P.job2,id);if(!g)return h;
  if(j2gBorrow(P.job2,id)){h=h.replace(/<div class="req"><span class="lockup">2차 전직 「[^」]*」 갈래 전용 기술입니다[^<]*<\/span><\/div>/,'');const J=job2Of(s.job2);h=h.replace(` · ${J?J.n:''} ${s.rank-9}단 · `,` · 보조 계열 ${s.rank-9}단 · `)}
  const pts=j2gPts(g),line=g.main?`<div class="muted j2gline">주 계열 「${g.n}」 · 이 계열에 찍은 점수 ${pts}점</div>`:`<div class="muted j2gline">보조 계열 「${g.n}」 · 한 기술 최대 ${J2G_SUP.per}점 · 이 계열에 찍은 점수 ${pts} / ${J2G_SUP.tot}점${j2gBorrow(P.job2,id)?` · ${(job2Of(s.job2)||{}).n||''}의 기술을 보조로 배웁니다`:''}</div>`;
  if(!g.main)h=h.replace(/(스킬 레벨 <b style="color:#ffd76a">[^<]*<\/b> \/ )\d+/,`$1${J2G_SUP.per}`);
  const i=h.indexOf('<div class="nums">');return i<0?h+line:h.slice(0,i)+line+h.slice(i)}}
v20Css('.j2gtree .j2gh{position:absolute;top:2px;height:34px;text-align:center;border-bottom:1px solid #5a4a36;line-height:1.15;overflow:hidden}.j2gtree .j2gh b{display:block;color:#ffd76a;font-size:12.5px;white-space:nowrap}.j2gtree .j2gh small{display:block;color:#bfb39a;font-size:10.5px;white-space:nowrap}.j2gtree .j2gh.sup b{color:#9fd0ff}.j2gtree .j2gh.sup{border-bottom-style:dashed}.j2gtree .j2gsep{position:absolute;width:0;border-left:1px dashed #5a4a36;opacity:.8}.j2gtree .node.j2gsup{border-style:dashed}.j2grule{font-size:11.5px}.j2gsub{padding:1px 8px;font-size:12px;margin-left:4px}.j2gadv{margin:10px 4px 4px;border-top:1px dashed #5a4a36;padding-top:6px;max-width:460px}.j2gh2 b{color:#ffd76a;font-size:12.5px}.j2gh2 small{color:#bfb39a;font-size:10.5px}.j2gadv .j2adv{margin-top:4px}.j2gtree .j2gh.m48h{border-bottom:0;border-right:1px solid #5a4a36;display:flex;flex-direction:column;justify-content:center;padding:0 2px;box-sizing:border-box}.j2gtree .j2gh.m48h.sup{border-right-style:dashed}.j2gtree .j2gh.m48h b{white-space:normal;font-size:10.5px;word-break:keep-all}.j2gtree .j2gh.m48h small{display:none}.j2gtree .j2gh.m48h{overflow:visible}.j2gline{margin:2px 0}');
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{J2G,J2G_SUP,J2GV,j2gOf,j2gBorrow,j2gFix,j2gLayout,j2gMax,job2Ok})}catch(_){}},0);
