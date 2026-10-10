/* ---------- v27 (SKILL): 새로 짠 계열의 선행 연결 · 칸 배치 (b2.js 바로 뒤) ----------
   데이터는 skill27.js. b2.js는 옛 LINKS로 PRE를 만들었으므로, 새로 짠 계열(궁수 사격 · 원소 사격, 사제 심판 · 퇴마)만
   LINKS27로 PRE를 다시 만들고 칸(TREEPOS)도 b2.js와 같은 규칙(선행 스킬 바로 아래 칸 먼저)으로 다시 놓는다. */
(()=>{for(const cls in LINKS27)for(const t in LINKS27[cls]){const T=+t,list=Object.values(SPELLS).filter(s=>s.cls===cls&&TREE[s.id]===T);
  for(const s of list)delete PRE[s.id];
  for(const l of LINKS27[cls][t].trim().split(/\s+/)){const [a,b]=l.split('>');
    if(SPELLS[a]&&SPELLS[b]&&SPELLS[a].rank<SPELLS[b].rank&&TREE[a]===T&&TREE[b]===T&&!(PRE[b]||[]).includes(a))(PRE[b]=PRE[b]||[]).push(a)}
  for(let r=1;r<=9;r++){const row=list.filter(s=>s.rank===r),used=new Set();
    row.sort((a,b)=>(PRE[b.id]||b.col27!=null?1:0)-(PRE[a.id]||a.col27!=null?1:0));
    for(const s of row){let want=s.col27!=null?s.col27:PRE[s.id]&&TREEPOS[PRE[s.id][0]]?TREEPOS[PRE[s.id][0]].col:0,c=want;
      for(let d=0;d<8;d++){if(want+d>=0&&!used.has(want+d)){c=want+d;break}if(want-d>=0&&!used.has(want-d)){c=want-d;break}}
      used.add(c);TREEPOS[s.id]={row:r-1,col:c}}}}})();
