// v36 지역 의뢰: 분포 · 특색 의뢰 · 자료가 맞는지 · 걸어서 닿는지
const Q36SP=new Set(['track','defend','ritual','riddle','chase','escort']);
const q36Kinds=qs=>{const o={kill:0,collect:0,sp:new Set()};for(const q of qs)for(const g of q.goals){if(g.type==='kill')o.kill++;else if(g.type==='collect'||g.type==='gather')o.collect++;else if(Q36SP.has(g.type))o.sp.add(g.type)}return o};
qT(QA36,'지역 의뢰: 의뢰가 없던 마을 9곳에 4개 넘게 · 브렌힐 말고 모든 마을에 의뢰 4개 넘게 · 20~99레벨 10레벨마다 잡기 · 모으기 · 특수 의뢰 2종 넘게 · 새 의뢰를 받은 마을마다 특색 의뢰 꼭 하나',()=>{qPrep('mage',{lvl:60});const bad=[];
  const by={};for(const q of SQ)if(q.town&&!q.daily)(by[q.town]=by[q.town]||[]).push(q);
  for(const id of ['pilgrimtent','keeperhouse','mistford','charkiln','frostlamp','stormcloister','rootwatch','lastvigil','ongi_camp'])if(!((by[id]||[]).length>=4))bad.push(id+' '+(by[id]||[]).length+'개');
  for(const t of ALLTOWNS){if(t.id==='brenhill'||t.id==='arden')continue;if(!((by[t.id]||[]).length>=4))bad.push(t.id+' '+(by[t.id]||[]).length+'개')}
  for(let b=20;b<100;b+=10){const k=q36Kinds(SQ.filter(q=>q.town&&q.lvl>=b&&q.lvl<b+10));if(!k.kill||!k.collect||k.sp.size<2)bad.push(`${b}~${b+9}: 잡기 ${k.kill} 모으기 ${k.collect} 특수 ${[...k.sp]}`)}
  const tw=[...new Set(Q36_SQ.map(q=>q.town))];for(const id of tw){const s=Q36_SQ.filter(q=>q.town===id&&q.sig);if(s.length!==1)bad.push(id+' 특색 '+s.length);else{if(!/^특색/.test(s[0].kind))bad.push(s[0].id+' 이름표');if(s[0].goals.every(g=>g.type==='kill'||g.type==='collect'))bad.push(s[0].id+' 특색이 잡기/모으기')}}
  qOk(!bad.length,bad.join(' / '));return `새 의뢰 ${Q36_SQ.length}개 · 마을 ${tw.length}곳 · 특색 ${Q36_SQ.filter(q=>q.sig).length}`});
qT(QA36,'지역 의뢰 자료: 주는 사람이 그 마을에 있음 · 몬스터가 그 지역 것 · 수수께끼 정답 하나(보기 셋) · 봉인 순서가 돌을 한 번씩 · 흔적 · 돌 · 지킬 자리 · 달아나는 길이 모두 걸어서 닿음 · 새 마을 사람도 닿음 · 보상 공식',()=>{qPrep('mage',{lvl:100});const bad=[];let n=0;
  for(const q of Q36_SQ){const T=ALLTOWNS.find(t=>t.id===q.town);if(!T){bad.push(q.id+' 마을 없음');continue}const f=sqFolk(q.giver);if(!f||f.town!==T)bad.push(q.id+' 주는 사람');
    const mobs=(REGIONS[T.reg]||{}).mobs||[];if(q.req&&!SQBY[q.req])bad.push(q.id+' 앞 의뢰 없음');
    if(q.rw.gold!==Math.round(q.lvl*q.lvl*.1+q.lvl*4))bad.push(q.id+' 금화 '+q.rw.gold);
    for(const g of q.goals){if(g.k)for(const k of g.k)if(!TYPES[k]||!mobs.includes(k))bad.push(q.id+' 몬스터 '+k);
      if(g.foe&&!TYPES[g.foe])bad.push(q.id+' 적 '+g.foe);for(const k of g.mobs||[])if(!TYPES[k])bad.push(q.id+' 몹 '+k);
      if(g.type==='riddle'){if(g.npc!==q.giver)bad.push(q.id+' 묻는 사람');for(const r of g.qs)if(r[1].length!==3||!(r[2]>=0&&r[2]<=2)||new Set(r[1]).size!==3)bad.push(q.id+' 물음 '+r[0])}
      if(g.type==='ritual'&&(g.order.length!==g.stones.length||[...g.order].sort().join()!==g.stones.map((_,i)=>i).join()||g.n!==g.stones.length))bad.push(q.id+' 봉인 순서');
      if(g.type==='track'&&g.n!==g.steps.length+1)bad.push(q.id+' 추적 셈');
      if(g.reg&&g.reg!=='home'){if(!REGIONS[g.reg]||!RCACHE[g.reg]){bad.push(q.id+' 지역 '+g.reg);continue}const ok=terrReach(g.reg),b=g.from?ALLTOWNS.find(t=>t.id===g.from):RCACHE[g.reg].town;
        const pts=[...(g.steps||[]),...(g.at?[g.at]:[]),...(g.stones||[]),...(g.path||[]),...(g.start?[g.start]:[])];
        for(const a of pts){const r=a[0]*Math.PI/180,x=clamp(b.x+Math.cos(r)*a[1],150,WORLD-150),y=clamp(b.y+Math.sin(r)*a[1],150,WORLD-150);n++;if(!wxCanReach(ok,x,y))bad.push(q.id+' 못 닿음 '+JSON.stringify(a.slice(0,2)))}}}}
  for(const id in Q36_FOLK){const f=sqFolk(id);if(!f||!f.town){bad.push(id+' 마을 사람 없음');continue}const ok=terrReach(f.town.reg);n++;if(!wxCanReach(ok,f.hx,f.hy))bad.push(id+' 못 닿음')}
  qOk(!bad.length,bad.slice(0,12).join(' / '));return `${Q36_SQ.length}개 · 자리 ${n}곳`});
