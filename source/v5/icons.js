/* ---------- 마법 아이콘: 마법의 종류(모양)와 원소(색·문장)를 조합해 그린다 ---------- */
const EMB={
  fire:'<path d="M0-4c1 2 3 3 3 5.5a3 3 0 0 1-6 0c0-1.5 1-2.5 1.5-3.5 0 1 .5 1.5 1 1.5 0-1.5-.5-2.5.5-3.5z"/>',
  ice:'<path d="M0-4v8M-3.5-2l7 4M3.5-2l-7 4" stroke-width="1.3" fill="none" stroke-linecap="round"/>',
  storm:'<path d="M1-4.5L-3 .5h2.5l-1 4 4.5-5.5H.5l1.5-3.5z"/>',
  wind:'<path d="M-4-1.5h5a1.5 1.5 0 1 0-1.5-1.5M-4 1.5h6.5a1.5 1.5 0 1 1-1.5 1.5" fill="none" stroke-width="1.2" stroke-linecap="round"/>',
  earth:'<path d="M-4.5 3.5l3-6 2 3 1.5-2 3 5z"/>',
  arcane:'<path d="M0-4.5l1.2 3.3 3.3 1.2-3.3 1.2L0 4.5l-1.2-3.3L-4.5 0l3.3-1.2z"/>',
  light:'<circle r="2"/><path d="M0-4.5v1.5M0 3v1.5M-4.5 0H-3M3 0h1.5M-3.2-3.2l1 1M2.2 2.2l1 1M-3.2 3.2l1-1M2.2-2.2l1-1" stroke-width="1" fill="none"/>',
  holy:'<path d="M-1-4.5h2v3h3v2h-3v4h-2v-4h-3v-2h3z"/>',
  life:'<path d="M0 4c-3-1.5-4-4-3.5-7 2.5 0 4.5 1.5 3.5 4.5M0 4c3-1.5 4-4 3.5-7-2.5 0-4.5 1.5-3.5 4.5"/>'};
const PAL={fire:['#ff7a2e','#5a1a08','#ffd27a'],ice:['#8fd8ff','#0e2a44','#e8f8ff'],storm:['#9fc0ff','#141a3e','#fff6b0'],wind:['#bfeedd','#0e2e2a','#ffffff'],earth:['#c9a46a','#2e2010','#efd8a8'],
  arcane:['#b9a2ff','#21123e','#efe6ff'],light:['#fff3b0','#3a3010','#ffffff'],holy:['#ffe39a','#3a2c0c','#ffffff'],life:['#9fe39a','#103a14','#efffe8']};
function iconBody(s,c,hi){if(s.kind==='passive'){const o=Object.assign({},s,{kind:'buff'});for(const x in s.pv)o[x]=1;return iconBody(o,c,hi)+`<circle cx="16" cy="16" r="14" stroke="${c}" stroke-width="1" stroke-dasharray="2.5 2.5" fill="none" opacity=".8"/>`}const k=s.kind,h=(hash(s.id.length*7,s.id.charCodeAt(0)*13+s.id.charCodeAt(s.id.length-1))*4)|0;let g='';
  const st=(w)=>`stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  switch(k){
    case'bolt':
      if(s.homing){g=`<path d="M6 22c4-3 6-6 7-9-3-1-6-3-8-6 4 1 7 2 9 4 1-4 4-7 8-9-1 4-2 8-5 11 3 1 6 3 8 6-4-1-7-1-9-1-2 3-5 4-10 4z" fill="${c}"/><circle cx="20.5" cy="11.5" r="1" fill="${hi}"/>`;if(s.cnt>3)g+=`<path d="M3 9l3 1-2 2zM25 25l3-1-1 3z" fill="${c}"/>`}
      else if(s.pierce){g=`<path d="M5 27L25 7" ${st(3)}/><path d="M25 7l3-3-1 5-5 1z" fill="${hi}"/><path d="M5 27L25 7" stroke="${hi}" stroke-width="1" fill="none"/>`;if(s.burn)g+=`<path d="M9 26c-2-1-3-3-1-5" ${st(1.5)}/>`}
      else if(s.aoe){g=`<circle cx="18" cy="14" r="6" fill="${c}"/><circle cx="17" cy="13" r="2.5" fill="${hi}"/>`;for(let i=0;i<8;i++){const a=i/8*6.283;g+=`<path d="M${18+Math.cos(a)*8} ${14+Math.sin(a)*8}L${18+Math.cos(a)*11} ${14+Math.sin(a)*11}" ${st(1.6)}/>`}g+=`<path d="M4 28l8-8" ${st(2.5)} opacity=".6"/>`}
      else if(s.cnt>1){const n=Math.min(5,s.cnt);for(let i=0;i<n;i++){const a=-1.2+(i-(n-1)/2)*.32,x=6+Math.cos(a)*18,y=26+Math.sin(a)*18;g+=`<path d="M6 26L${x} ${y}" ${st(1.2)} opacity=".55"/><circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/><circle cx="${x-.6}" cy="${y-.6}" r="1" fill="${hi}"/>`}}
      else{g=`<path d="M5 27c5-3 9-7 11-11" ${st(4)} opacity=".45"/><path d="M8 25c4-3 7-6 9-9" ${st(2)} opacity=".8"/><circle cx="20" cy="12" r="${5+h%2}" fill="${c}"/><circle cx="19" cy="11" r="2" fill="${hi}"/>`}
      if(s.freeze)g+=`<path d="M24 4v6M21 7h6" stroke="${hi}" stroke-width="1.4"/>`;if(s.stun&&!s.freeze)g+=`<circle cx="25" cy="6" r="1.2" fill="${hi}"/><circle cx="28" cy="9" r="1" fill="${hi}"/>`;break;
    case'nova':{const n=6+h*2;g=`<circle cx="16" cy="16" r="4" fill="${hi}"/><circle cx="16" cy="16" r="9" ${st(2)}/>`;for(let i=0;i<n;i++){const a=i/n*6.283;g+=`<path d="M${16+Math.cos(a)*11} ${16+Math.sin(a)*11}L${16+Math.cos(a)*14.5} ${16+Math.sin(a)*14.5}" ${st(2)}/>`}
      if(s.knock)g+=`<path d="M3 16h4M29 16h-4M16 3v4M16 29v-4" stroke="${hi}" stroke-width="1.5"/>`;break}
    case'chain':g=`<path d="M4 25l7-9 3 4 6-9 3 3 5-8" ${st(2.4)}/><path d="M4 25l7-9 3 4 6-9 3 3 5-8" stroke="${hi}" stroke-width=".9" fill="none"/>`+[[4,25],[14,20],[23,14]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('');break;
    case'field':g=`<ellipse cx="16" cy="23" rx="12" ry="5" ${st(1.8)}/><ellipse cx="16" cy="23" rx="12" ry="5" fill="${c}" opacity=".25"/>`;
      if(s.pull)g+=`<path d="M16 12c5 0 7 4 4 7-3 2-7 0-6-3 1-2 3-2 4-1" ${st(1.8)}/><path d="M8 6c-2 3-2 6 0 8M24 6c2 3 2 6 0 8" ${st(1.4)}/>`;
      else if(s.el==='fire'||s.burn)g+=[9,16,23].map((x,i)=>`<path d="M${x} ${22-i%2*3}c-3-3-2-6 0-9 1 2 3 3 3 6s-1 3-3 3z" fill="${i===1?hi:c}"/>`).join('');
      else if(s.el==='ice')g+=`<path d="M10 22l2-9 2 9M15 22l2-12 2 12M20 22l2-7 2 7" fill="${c}" stroke="${hi}" stroke-width=".6"/>`;
      else if(s.el==='earth')g+=`<path d="M6 21l5-6 3 3 4-7 3 5 5-3" ${st(2)}/>`;
      else if(s.el==='holy'||s.el==='light')g+=`<path d="M16 7v13M11 12h10" ${st(2.4)}/>`;
      else g+=`<path d="M9 18c2-6 4-8 7-10M14 20c2-5 5-8 9-9M7 13c3-1 5 0 6 2" ${st(1.6)}/>`;
      if(s.self)g+=`<circle cx="16" cy="20" r="2" fill="${hi}"/>`;break;
    case'rain':g=`<path d="M7 12a4 4 0 0 1 1-8 6 6 0 0 1 11-1 4.5 4.5 0 0 1 6 5 3.5 3.5 0 0 1-1 4z" fill="${c}" opacity=".85"/>`;
      if(s.el==='storm')g+=`<path d="M12 14l-3 6h3l-2 6M21 14l-3 6h3l-2 6" stroke="${hi}" stroke-width="1.6" fill="none"/>`;
      else if(s.el==='earth')g+=[[9,18],[16,22],[23,17],[13,27],[21,27]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2" fill="${c}"/>`).join('');
      else if(s.el==='fire')g+=[[10,17],[17,21],[23,16],[13,26],[22,26]].map(([x,y])=>`<path d="M${x} ${y}l-2 3" stroke="${hi}" stroke-width="2.5" stroke-linecap="round"/><circle cx="${x-2.2}" cy="${y+3.2}" r="1.8" fill="${c}"/>`).join('');
      else g+=[[9,16],[15,20],[21,16],[12,25],[19,25],[25,22]].map(([x,y])=>`<path d="M${x} ${y}l-1.5 4" stroke="${s.el==='ice'?hi:c}" stroke-width="1.8" stroke-linecap="round"/>`).join('');break;
    case'strike':g=`<path d="M13 2h6l-1 20h-4z" fill="${c}" opacity=".85"/><path d="M15.2 2h1.6l-.3 20h-1z" fill="${hi}"/><ellipse cx="16" cy="25" rx="11" ry="3.5" ${st(1.8)}/>`;for(let i=0;i<6;i++){const a=3.4+i/5*2.6;g+=`<path d="M${16+Math.cos(a)*6} ${24+Math.sin(a)*3}L${16+Math.cos(a)*11} ${24+Math.sin(a)*7}" ${st(1.4)}/>`}break;
    case'beam':g=s.el==='storm'?`<path d="M3 28l6-7 1 4 7-9 1 4 11-14" ${st(3)}/><path d="M3 28l6-7 1 4 7-9 1 4 11-14" stroke="${hi}" stroke-width="1" fill="none"/>`
      :s.el==='earth'?`<path d="M3 28l5-3 2 2 5-5 2 1 4-5 2 1 6-6" ${st(2.6)}/><path d="M6 28l3 1M13 24l2 2M20 18l2 2" ${st(1.4)}/>`
      :`<path d="M4 28L28 4" ${st(s.w>40?7:5)} opacity=".45"/><path d="M4 28L28 4" ${st(2.4)}/><path d="M4 28L28 4" stroke="${hi}" stroke-width="1" fill="none"/><circle cx="27" cy="5" r="3" fill="${hi}"/>`;
      if(s.knock)g+=`<path d="M12 9l-4 4M23 20l-4 4" ${st(1.4)}/>`;break;
    case'cone':{const w=Math.min(1.5,s.ang||1),R0=Math.min(24,10+(s.range||150)/18);let d=`M4 28`;for(let i=0;i<=8;i++){const a=-.785-w/2+i/8*w;d+=`L${4+Math.cos(a)*R0} ${28+Math.sin(a)*R0}`}
      g=`<path d="${d}z" fill="${c}" opacity=".35"/><path d="${d}z" ${st(1.6)}/>`;for(let i=0;i<3;i++){const a=-.785-w/3+i*w/3;g+=`<path d="M6 26L${4+Math.cos(a)*R0*.85} ${28+Math.sin(a)*R0*.85}" stroke="${hi}" stroke-width="1.2"/>`}
      if(s.freeze)g+=`<path d="M22 6v6M19 9h6" stroke="${hi}" stroke-width="1.4"/>`;break}
    case'blink':g=`<circle cx="8" cy="22" r="3" fill="none" stroke="${c}" stroke-dasharray="2 2"/><circle cx="24" cy="9" r="3.5" fill="${c}"/><path d="M10 20l11-9" ${st(2)} stroke-dasharray="3 2.5"/>`;if(s.mult)g+=s.el==='storm'?`<path d="M12 22l4-6 1 3 4-6" stroke="${hi}" stroke-width="1.6" fill="none"/>`:`<path d="M18 24c4 0 7-2 9-4" ${st(1.5)}/>`;break;
    case'heal':g=`<path d="M16 27s-10-6-10-13a5.5 5.5 0 0 1 10-3.2A5.5 5.5 0 0 1 26 14c0 7-10 13-10 13z" fill="${c}"/><path d="M16 11v9M11.5 15.5h9" stroke="${hi}" stroke-width="2.2"/>`;if(s.resetcd)g=`<circle cx="16" cy="16" r="10" ${st(2.4)}/><path d="M16 9v7l-4 3" ${st(2)}/><path d="M4 9l2 5 5-2" ${st(2)}/>`;break;
    case'hot':g=`<path d="M16 25s-8-5-8-10.5a4.5 4.5 0 0 1 8-2.6 4.5 4.5 0 0 1 8 2.6C24 20 16 25 16 25z" fill="${c}"/><path d="M5 10a12 12 0 0 1 20-4M27 22a12 12 0 0 1-20 4" ${st(1.6)}/>`;break;
    case'shield':g=`<path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" fill="${c}" opacity=".9"/><path d="M16 6l8 3v6c0 5-3.5 9-8 10.5" stroke="${hi}" stroke-width="1.2" fill="none"/>`;if(s.freeze)g+=`<path d="M16 11v10M11.5 13.5l9 5M20.5 13.5l-9 5" stroke="#0e2a44" stroke-width="1.6"/>`;break;
    case'ward':g=`<path d="M16 26c-2-6-9-6-13-14 5 1 9 3 13 8 4-5 8-7 13-8-4 8-11 8-13 14z" fill="${c}"/><circle cx="16" cy="8" r="3.5" ${st(1.6)}/>`;break;
    case'rez':g=`<path d="M16 28V12" ${st(2.4)}/><circle cx="16" cy="8" r="3.5" fill="${hi}"/><path d="M16 16c-4-5-9-6-12-4 2 1 4 4 5 7M16 16c4-5 9-6 12-4-2 1-4 4-5 7" ${st(1.8)}/><path d="M10 28h12" ${st(2)}/>`;break;
    case'invuln':g=`<path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" ${st(2.2)}/><path d="M16 9l2 5 5 .5-4 3.5 1.5 5L16 20l-4.5 3 1.5-5-4-3.5 5-.5z" fill="${c}"/>`;break;
    case'buff':{// 강화의 종류마다 다른 그림: 피해=검, 방어=방패, 속도=날개, 치명=별, 생명=심장, 마나=물방울, 재사용=모래시계, 여럿=후광
      const n=['dmg','dr','spd','crit','hp','regen','cdr'].filter(k=>s[k]).length;
      if(n>=4)g=`<circle cx="16" cy="16" r="11" ${st(1.6)}/><path d="M16 6l2.5 6.5 6.5.5-5 4.5 1.5 6.5-5.5-3.5-5.5 3.5 1.5-6.5-5-4.5 6.5-.5z" fill="${c}"/><circle cx="16" cy="16" r="2.4" fill="${hi}"/>`;
      else if(s.dr)g=`<path d="M16 4l10 4v7c0 6-4.5 11-10 13C10.5 26 6 21 6 15V8z" ${st(2.2)}/><path d="M16 9v14M11 14h10" stroke="${hi}" stroke-width="1.8"/>`;
      else if(s.crit)g=`<path d="M16 3l3.2 8.4 9 .6-7 5.6 2.4 8.8L16 21.4 8.4 26.4l2.4-8.8-7-5.6 9-.6z" ${st(1.8)}/><circle cx="16" cy="15" r="3" fill="${hi}"/>`;
      else if(s.hp)g=`<path d="M16 27C6 20 4 14 6 10c2-4 7-4 10 0 3-4 8-4 10 0 2 4 0 10-10 17z" ${st(2)}/><path d="M11 16h3l2-4 2 7 2-3h2" stroke="${hi}" stroke-width="1.5" fill="none"/>`;
      else if(s.cdr)g=`<path d="M9 4h14M9 28h14M10 4c0 7 12 7 12 12s-12 5-12 12M22 4c0 7-12 7-12 12s12 5 12 12" ${st(1.9)}/><path d="M13 25h6l-3-4z" fill="${hi}"/>`;
      else if(s.spd&&!s.dmg)g=`<path d="M5 22c6-1 10-5 12-12 1 6 4 9 10 10-6 2-11 4-14 8" ${st(2)}/><path d="M3 12h6M2 16h5M4 20h4" stroke="${hi}" stroke-width="1.4"/>`;
      else if(s.regen&&!s.dmg)g=`<path d="M16 4c5 7 9 11 9 16a9 9 0 0 1-18 0c0-5 4-9 9-16z" ${st(2)}/><path d="M12 20a4 4 0 0 0 4 4" stroke="${hi}" stroke-width="1.6" fill="none"/>`;
      else if(s.dmg>=.3)g=`<path d="M16 3l3 4v13h-6V7z" ${st(1.8)}/><path d="M9 20h14M16 23v6" ${st(2.2)}/><circle cx="16" cy="11" r="1.8" fill="${hi}"/>`;
      else g=`<path d="M8 18l8-8 8 8M8 25l8-8 8 8" ${st(3)}/>`+(s.spd?`<path d="M3 11h5M2 15h4" stroke="${hi}" stroke-width="1.4"/>`:'');
      break}
    case'storm':g=`<path d="M7 13a4.5 4.5 0 0 1 1-9 6.5 6.5 0 0 1 12-1 5 5 0 0 1 6.5 5.5A4 4 0 0 1 25 13z" fill="${c}" opacity=".85"/><path d="M15 13l-4 7h4l-3 8 9-11h-5l3-4z" fill="${hi}"/><circle cx="16" cy="16" r="14" ${st(1)} stroke-dasharray="2 3"/>`;break;
    case'orbit':{const n=s.orbs||3;g=`<circle cx="16" cy="16" r="9" ${st(1.2)} stroke-dasharray="2 2"/><circle cx="16" cy="16" r="3" fill="${hi}"/>`;for(let i=0;i<n;i++){const a=i/n*6.283-.6;g+=`<circle cx="${16+Math.cos(a)*9}" cy="${16+Math.sin(a)*9}" r="3.2" fill="${c}"/><path d="M${16+Math.cos(a-.5)*9} ${16+Math.sin(a-.5)*9}A9 9 0 0 1 ${16+Math.cos(a-.15)*9} ${16+Math.sin(a-.15)*9}" ${st(2)} opacity=".6"/>`}break}
    case'summon':g=`<path d="M10 28l1-8-4-2 2-8 4-2h6l4 2 2 8-4 2 1 8h-4l-1-5h-2l-1 5z" fill="${c}"/><circle cx="16" cy="6" r="3.5" fill="${c}"/><circle cx="14.8" cy="5.5" r=".9" fill="#ff7a2a"/><circle cx="17.2" cy="5.5" r=".9" fill="#ff7a2a"/>`;break;
    case'armor':g=`<path d="M8 6l5-2c1 2 5 2 6 0l5 2 3 6-3 2v12H8V14l-3-2z" fill="${c}"/><path d="M16 9v16M11 14h10" stroke="${hi}" stroke-width="1.2"/>`+(s.aura?`<circle cx="16" cy="16" r="14" ${st(1.4)} stroke-dasharray="3 2"/>`:'');break;
  }
  return g}
function spellIcon(s){if(s.phys||s.el==='phys'||(typeof ICP!=='undefined'&&ICP[s.id]&&(s.cls==='warrior'||s.cls==='archer')))return physIcon(s);// v18 전사·궁수 (iconsphys.js)
  if(IC25.has(s))return IC25.svg(s);// v25 마법사·사제: 스킬마다 다른 그림 + 사제 계열 색 (icons25.js)
  const p=PAL[s.el]||PAL.arcane,heal=s.kind==='heal'||s.kind==='hot',c=heal?'#9fe39a':p[0],dk=heal?'#103a14':p[1],hi=p[2],gid='ig'+s.id;
  return `<svg viewBox="0 0 32 32" aria-hidden="true"><defs><radialGradient id="${gid}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="${dk}" stop-opacity="1"/><stop offset="1" stop-color="#050404"/></radialGradient></defs><rect x=".5" y=".5" width="31" height="31" rx="3" fill="url(#${gid})" stroke="${c}" stroke-opacity=".35"/>${iconBody(s,c,hi)}<g transform="translate(26.5 26.5) scale(.75)" fill="${hi}" stroke="${hi}" opacity=".9">${EMB[s.el]||''}</g></svg>`}
const spellSvg=spellIcon;
