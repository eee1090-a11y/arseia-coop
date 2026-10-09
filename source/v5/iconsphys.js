/* ---------- v18: 전사 · 궁수 스킬 아이콘 (물리 문양) ----------
   icons.js의 spellIcon과 같은 32×32 SVG 틀. 마법처럼 '종류×원소'로 자동 생성하면 95개가 서로 비슷해지므로,
   칼·창·방패·화살·활·덫·짐승·깃발·외침 같은 문양 조각(ICM)을 스킬마다 직접 조합한다(ICP). 표에 없는 물리 스킬은 종류로 대신 그린다.
   틀 색: 전사=강철+붉은 기, 궁수=나무+초록 기. 원소 화살(불·얼음·번개)은 그 원소 색이 주색이 된다. 패시브는 점선 고리. */
PAL.phys=PAL.phys||['#e8e4d8','#24201a','#ffffff'];
EMB.phys=EMB.phys||'<path d="M-3.5 3.5L3 -3M1.5-3.5h2v2" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
const ICC={steel:'#dfe3ea',steelD:'#6c7280',gold:'#e8c35a',wood:'#a8763e',woodD:'#5a3a1c',leather:'#8a5a32',red:'#d8483a',blood:'#c0182a',green:'#8fd06a',feather:'#f4efe2',bone:'#e8dcc0',fur:'#9a8a78'};
const ICM={
  g(x,y,r,s,inner){return `<g transform="translate(${x} ${y}) rotate(${r||0}) scale(${s||1})">${inner}</g>`},
  // 칼: 손잡이가 아래, 날 끝이 위 (원점 = 칼 가운데)
  sword(x,y,r,s,c){c=c||ICC.steel;return this.g(x,y,r,s,`<path d="M0-13l2.2 3.2V5h-4.4V-9.8z" fill="${c}" stroke="#2a2a32" stroke-width=".6" stroke-linejoin="round"/><path d="M0-11.5V4" stroke="#fff" stroke-width=".6" opacity=".8"/><rect x="-5.2" y="4.6" width="10.4" height="2.2" rx="1" fill="${ICC.gold}" stroke="#4a3410" stroke-width=".4"/><rect x="-1" y="6.8" width="2" height="4.2" fill="${ICC.leather}"/><circle cy="12" r="1.5" fill="${ICC.gold}"/>`)},
  // 창: 끝이 위
  spear(x,y,r,s,c){c=c||ICC.steel;return this.g(x,y,r,s,`<path d="M0-6V15" stroke="${ICC.woodD}" stroke-width="2.6" stroke-linecap="round"/><path d="M0-6V15" stroke="${ICC.wood}" stroke-width="1.4" stroke-linecap="round"/><path d="M0-16c2 3 2.6 6 1.4 9.6h-2.8C-2.6-10-2-13 0-16z" fill="${c}" stroke="#2a2a32" stroke-width=".55"/><path d="M0-14.5v6.6" stroke="#fff" stroke-width=".5"/><path d="M-1.6-6h3.2" stroke="${ICC.gold}" stroke-width="1.4"/><path d="M0-5.2c-1 1.6-1.6 3.2-1.4 5M0-5.2c1 1.6 1.6 3.2 1.4 5" stroke="${ICC.red}" stroke-width=".9" fill="none"/>`)},
  shield(x,y,s,c,em){c=c||ICC.red;return this.g(x,y,0,s,`<path d="M-8.5-9.5Q0-11.8 8.5-9.5V-1C8.5 5 4.4 8.6 0 10.6-4.4 8.6-8.5 5-8.5-1z" fill="${c}" stroke="${ICC.gold}" stroke-width="1.4" stroke-linejoin="round"/><path d="M-1.4-10.6h2.8v20.4h-2.8zM-8.5-4.2h17v2.6h-17z" fill="${ICC.steel}" opacity=".85"/>${em||`<circle cy="-2.9" r="2.4" fill="${ICC.steel}" stroke="#2a2a32" stroke-width=".5"/>`}`)},
  round(x,y,s,c){c=c||ICC.wood;return this.g(x,y,0,s,`<circle r="9.5" fill="${c}" stroke="${ICC.steelD}" stroke-width="1.6"/><circle r="9.5" fill="none" stroke="${ICC.steel}" stroke-width=".6"/><path d="M-9 0h18M0-9v18" stroke="${ICC.woodD}" stroke-width=".6" opacity=".7"/><circle r="3" fill="${ICC.steel}" stroke="#2a2a32" stroke-width=".5"/>`)},
  // 화살: 촉이 +x
  arrow(x,y,r,s,c,fl){c=c||ICC.steel;return this.g(x,y,r,s,`<path d="M-12 0H9" stroke="${ICC.woodD}" stroke-width="1.6"/><path d="M-12 0H9" stroke="${ICC.wood}" stroke-width=".8"/><path d="M13.5 0L8 -2.8 9.2 0 8 2.8z" fill="${c}" stroke="#2a2a32" stroke-width=".4"/><path d="M-12.5 0l-2.6-2.8h4.2L-8.6 0zM-12.5 0l-2.6 2.8h4.2L-8.6 0z" fill="${fl||ICC.feather}" stroke="#6a5a40" stroke-width=".3"/>`)},
  // 활: 등이 +x, 줄은 -x (d: 당김 0~1)
  bow(x,y,r,s,d){const dl=(d||0)*8;return this.g(x,y,r,s,`<path d="M-1-12.5L${-dl} 0-1 12.5" stroke="#f0e8d0" stroke-width=".6" fill="none"/><path d="M-1-12.5C6-9 6.4 9 -1 12.5" stroke="${ICC.woodD}" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M-1-12.5C6-9 6.4 9 -1 12.5" stroke="${ICC.wood}" stroke-width="1.5" fill="none" stroke-linecap="round"/><rect x="3" y="-2" width="2.4" height="4" fill="${ICC.leather}"/>${d?`<path d="M${-dl} 0H12" stroke="${ICC.wood}" stroke-width=".9"/><path d="M14.5 0L11 -1.8V1.8z" fill="${ICC.steel}"/>`:''}`)},
  xbow(x,y,r,s){return this.g(x,y,r,s,`<path d="M-11 1.5L4 -.5 12 -.5 12 1.5 4 2.2-5 4-11 4z" fill="${ICC.wood}" stroke="${ICC.woodD}" stroke-width=".6"/><path d="M8-8Q12.5 0 8 8" stroke="${ICC.steel}" stroke-width="2" fill="none"/><path d="M8.4-8L3 0 8.4 8" stroke="#f0e8d0" stroke-width=".5" fill="none"/><path d="M-3 0H14" stroke="${ICC.steelD}" stroke-width="1"/>`)},
  quiver(x,y,r,s,f){f=f||[ICC.feather,ICC.red,ICC.feather];return this.g(x,y,r,s,f.map((c,i)=>`<path d="M${-3+i*3}-6V-11" stroke="${ICC.wood}" stroke-width=".8"/><path d="M${-3+i*3}-15l1.4 2v3l-1.4-1-1.4 1v-3z" fill="${c}"/>`).join('')+`<path d="M-5-7h10l-1 18c-2.6 1.4-5.4 1.4-8 0z" fill="${ICC.leather}" stroke="${ICC.woodD}" stroke-width=".7"/><path d="M-5.2-7.2h10.4v2H-5.2z" fill="${ICC.gold}"/>`)},
  // 덫(곰덫 이빨)
  trap(x,y,s,c){c=c||ICC.steelD;return this.g(x,y,0,s,`<ellipse cy="3.5" rx="11" ry="3.6" fill="none" stroke="${c}" stroke-width="1.6"/><path d="M-10 3c0-7 4-10 10-10S10-4 10 3" fill="none" stroke="${ICC.steel}" stroke-width="1.6"/><path d="M-8.6-1l1.6 3 1-4.4 1.6 4 1.2-4.6 1.4 4.4L0-3.4l1.2 4.6 1.4-4.4 1.2 4.6 1.6-4 1 4.4 1.6-3" fill="${ICC.steel}" stroke="#2a2a32" stroke-width=".4"/><circle cy="3.5" r="1.8" fill="${ICC.gold}"/>`)},
  falcon(x,y,r,s,c){c=c||'#b08a5a';return this.g(x,y,r,s,`<path d="M0-2c-3-4-8-6-13-5 3 1 5 3 6 5-3 0-5 1-6 2 4 0 7 1 9 2l1 5 3-4 3 4 1-5c2-1 5-2 9-2-1-1-3-2-6-2 1-2 3-4 6-5-5-1-10 1-13 5z" fill="${c}" stroke="#3a2a18" stroke-width=".6" stroke-linejoin="round"/><circle cy="-3.4" r="2.6" fill="${c}" stroke="#3a2a18" stroke-width=".5"/><path d="M0-2.2l1.6 1-1.6.9z" fill="${ICC.gold}"/><circle cx=".8" cy="-4" r=".55" fill="#1a1008"/>`)},
  wolf(x,y,s,c){c=c||ICC.fur;return this.g(x,y,0,s,`<path d="M-9-10l3 6c-3 3-4 7-2 10l4 4h8l4-4c2-3 1-7-2-10l3-6-6 3c-1-.6-3-1-4-1s-3 .4-4 1z" fill="${c}" stroke="#2a2018" stroke-width=".7" stroke-linejoin="round"/><path d="M-2 5l2 2.6L2 5" fill="#2a2018"/><path d="M-5-1l2.6 1M5-1L2.4 0" stroke="${ICC.gold}" stroke-width="1.3" stroke-linecap="round"/><path d="M-3 9l1.2 1.6M3 9l-1.2 1.6" stroke="#fff" stroke-width=".7"/>`)},
  paw(x,y,s,c){c=c||ICC.fur;return this.g(x,y,0,s,`<ellipse cy="2.6" rx="4" ry="3.4" fill="${c}"/><circle cx="-4.6" cy="-2.6" r="1.7" fill="${c}"/><circle cx="-1.6" cy="-5.2" r="1.7" fill="${c}"/><circle cx="1.6" cy="-5.2" r="1.7" fill="${c}"/><circle cx="4.6" cy="-2.6" r="1.7" fill="${c}"/>`)},
  banner(x,y,s,c,em){c=c||ICC.red;return this.g(x,y,0,s,`<path d="M-7-14V14" stroke="${ICC.woodD}" stroke-width="2.4" stroke-linecap="round"/><path d="M-7-14V14" stroke="${ICC.wood}" stroke-width="1.2"/><circle cx="-7" cy="-14.5" r="1.6" fill="${ICC.gold}"/><path d="M-6-12h14l-3 5 3 5-1.6 4-12.4 0z" fill="${c}" stroke="${ICC.gold}" stroke-width=".9" stroke-linejoin="round"/>${em||`<path d="M1-8.6l1.6 3.2 3.4.4-2.6 2.2.8 3.4L1-1.2-2-.4l.8-3.4-2.6-2.2 3.4-.4z" fill="${ICC.gold}"/>`}`)},
  horn(x,y,r,s){return this.g(x,y,r,s,`<path d="M-11 4c2-8 10-12 20-12l2 2c-6 0-10 4-11 10 0 2-2 3-4 3h-4c-2 0-3-1.4-3-3z" fill="${ICC.bone}" stroke="#6a5a3a" stroke-width=".7"/><path d="M-4 5l1-6M1 2l2-5" stroke="${ICC.gold}" stroke-width="1.2"/><ellipse cx="10" cy="-7" rx="1.4" ry="2.6" fill="#5a4a2a" transform="rotate(-30 10 -7)"/>`)},
  waves(x,y,r,s,c,n){c=c||ICC.gold;let o='';for(let i=0;i<(n||3);i++){const R=4+i*3.6;o+=`<path d="M${R*Math.cos(-.8)} ${R*Math.sin(-.8)}A${R} ${R} 0 0 1 ${R*Math.cos(.8)} ${R*Math.sin(.8)}" stroke="${c}" stroke-width="${1.8-i*.35}" fill="none" stroke-linecap="round" opacity="${1-i*.2}"/>`}return this.g(x,y,r,s,o)},
  // 베기 자국(초승달)
  arc(x,y,r,s,c,w){c=c||'#fff';return this.g(x,y,r,s,`<path d="M-11 6C-8-6 4-11 12-9 4-7-4-2-11 6z" fill="${c}" opacity=".9"/><path d="M-11 6C-8-6 4-11 12-9" stroke="#fff" stroke-width="${w||.8}" fill="none"/>`)},
  lines(x,y,r,s,c,n){c=c||'#fff';let o='';for(let i=0;i<(n||3);i++)o+=`<path d="M${-6-i%2*3} ${(i-((n||3)-1)/2)*3.4}h-${5+i%2*3}" stroke="${c}" stroke-width="1.3" stroke-linecap="round" opacity=".8"/>`;return this.g(x,y,r,s,o)},
  burst(x,y,s,c,n){c=c||ICC.gold;n=n||8;let d='';for(let i=0;i<n*2;i++){const a=i/(n*2)*6.283,R=i%2?3.4:8;d+=(i?'L':'M')+(Math.cos(a)*R).toFixed(1)+' '+(Math.sin(a)*R).toFixed(1)}return this.g(x,y,0,s,`<path d="${d}z" fill="${c}" opacity=".95"/><circle r="2.4" fill="#fff"/>`)},
  crack(x,y,s,c){c=c||ICC.gold;return this.g(x,y,0,s,`<ellipse rx="12" ry="3.6" fill="${c}" opacity=".25"/><path d="M0 0l-5-1.4-4 2M0 0l3-2.6 6 .6M0 0l5 2 4-.6M0 0l-2 2.6-5 .8" stroke="${c}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`)},
  ring(x,y,s,c,dash){c=c||ICC.gold;return this.g(x,y,0,s,`<ellipse rx="12" ry="4.4" fill="none" stroke="${c}" stroke-width="1.5"${dash?' stroke-dasharray="2.4 2"':''}/>`)},
  heart(x,y,s,c){c=c||ICC.red;return this.g(x,y,0,s,`<path d="M0 9C-9 3-10-3-7.6-6.4-5.6-9.2-1.6-8.6 0-5.6 1.6-8.6 5.6-9.2 7.6-6.4 10-3 9 3 0 9z" fill="${c}" stroke="#3a0a0a" stroke-width=".6"/><path d="M-5.6-5.6c-1.6.4-2.4 2-2 3.4" stroke="#fff" stroke-width=".8" fill="none" opacity=".7"/>`)},
  drop(x,y,s,c){c=c||ICC.blood;return this.g(x,y,0,s,`<path d="M0-8c3 4.6 5 7 5 9.6a5 5 0 0 1-10 0C-5-1-3 3.4 0-8z" fill="${c}" stroke="#3a0a0a" stroke-width=".5"/><path d="M-2.4 1.6a2.6 2.6 0 0 0 1.6 2.4" stroke="#fff" stroke-width=".7" fill="none"/>`)},
  flame(x,y,s,c){c=c||PAL.fire[0];return this.g(x,y,0,s,`<path d="M0-9c2 4 6 5 6 10a6 6 0 0 1-12 0c0-3 2-4.6 3-7 0 2 1 3 2 3 0-2-.4-4 1-6z" fill="${c}"/><path d="M0-2c1 2 3 2.6 3 5a3 3 0 0 1-6 0c0-1.6 1.6-2.4 3-5z" fill="${PAL.fire[2]}"/>`)},
  flake(x,y,s,c){c=c||PAL.ice[0];return this.g(x,y,0,s,`<path d="M0-8V8M-7-4L7 4M7-4L-7 4M-2-6.4L0-4.6 2-6.4M-2 6.4L0 4.6 2 6.4" stroke="${c}" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle r="1.6" fill="${PAL.ice[2]}"/>`)},
  zap(x,y,r,s,c){c=c||PAL.storm[2];return this.g(x,y,r,s,`<path d="M2-10L-4 1h4l-3 9 8-12H1l3-8z" fill="${c}" stroke="#4a4010" stroke-width=".5" stroke-linejoin="round"/>`)},
  eye(x,y,s,c,slit){c=c||ICC.gold;return this.g(x,y,0,s,`<path d="M-11 0C-6-7 6-7 11 0 6 7-6 7-11 0z" fill="#f4efe2" stroke="#3a2a18" stroke-width=".8"/><circle r="4.4" fill="${c}"/>${slit?'<ellipse rx="1" ry="3.6" fill="#1a1008"/>':'<circle r="2" fill="#1a1008"/>'}<circle cx="-1.4" cy="-1.6" r=".9" fill="#fff"/>`)},
  target(x,y,s,c){c=c||ICC.red;return this.g(x,y,0,s,`<circle r="9" fill="none" stroke="${c}" stroke-width="1.5"/><circle r="5" fill="none" stroke="${c}" stroke-width="1.2"/><circle r="1.6" fill="${c}"/><path d="M0-12v4M0 12V8M-12 0h4M12 0H8" stroke="${c}" stroke-width="1.2"/>`)},
  plate(x,y,s,c){c=c||ICC.steel;return this.g(x,y,0,s,`<path d="M-9-8l5-3c1 2.4 7 2.4 8 0l5 3 2 5-3 1.4V10H-7V-1.6L-10-3z" fill="${c}" stroke="#2a2a32" stroke-width=".7" stroke-linejoin="round"/><path d="M0-8.4V9M-5 2h10M-5 5h10" stroke="${ICC.steelD}" stroke-width=".8"/>`)},
  boot(x,y,r,s){return this.g(x,y,r,s,`<path d="M-4-10h7v10l7 2c1.4.6 1.4 3 0 3.4H-4z" fill="${ICC.leather}" stroke="${ICC.woodD}" stroke-width=".7" stroke-linejoin="round"/><path d="M-4-10h7v2.4h-7z" fill="${ICC.gold}"/>`)},
  fist(x,y,r,s){return this.g(x,y,r,s,`<rect x="-6" y="-5" width="12" height="9" rx="3" fill="${ICC.steel}" stroke="#2a2a32" stroke-width=".7"/><path d="M-2-5v5M2-5v5" stroke="${ICC.steelD}" stroke-width=".8"/><rect x="-5" y="4" width="10" height="6" rx="1" fill="${ICC.steelD}"/>`)},
  chain(x,y,r,s,c){c=c||ICC.steel;let o='';for(let i=-2;i<=2;i++)o+=`<ellipse cx="${i*4.4}" rx="3" ry="${i%2?1.4:2.2}" fill="none" stroke="${c}" stroke-width="1.3"/>`;return this.g(x,y,r,s,o)},
  figure(x,y,s,c){c=c||ICC.steel;return this.g(x,y,0,s,`<circle cy="-8" r="3" fill="${c}"/><path d="M-4-4h8l1 8h-2l-1 7h-4l-1-7h-2z" fill="${c}"/>`)},
  tower(x,y,s){return this.g(x,y,0,s,`<path d="M-9-10h3v3h3v-3h6v3h3v-3h3v6l-2 2V11H-7V-2l-2-2z" fill="${ICC.steelD}" stroke="#2a2a32" stroke-width=".7"/><path d="M-2 11V4a2 2 0 0 1 4 0v7" fill="#1a1612"/><path d="M-6 0h12M-6 5h3M3 5h3" stroke="${ICC.steel}" stroke-width=".6" opacity=".7"/>`)},
  cage(x,y,s){let o=`<path d="M-10 10V-4Q0-14 10-4V10z" fill="rgba(0,0,0,.25)" stroke="${ICC.wood}" stroke-width="1.6"/>`;for(let i=-6;i<=6;i+=4)o+=`<path d="M${i} 10V${-9+Math.abs(i)*.45}" stroke="${ICC.wood}" stroke-width="1.3"/>`;return this.g(x,y,0,s,o+`<path d="M-11 10h22" stroke="${ICC.woodD}" stroke-width="2.4"/>`)},
  noose(x,y,s){return this.g(x,y,0,s,`<path d="M0-13V-4" stroke="#c8a870" stroke-width="1.8"/><ellipse cy="3" rx="7" ry="5" fill="none" stroke="#c8a870" stroke-width="1.8"/><path d="M-1.6-5h3.2v3h-3.2z" fill="#a88850"/>`)},
  caltrop(x,y,s){return this.g(x,y,0,s,`<path d="M0 0L0-6M0 0L-5 3.4M0 0L5 3.4M0 0L1 2" stroke="${ICC.steel}" stroke-width="1.6" stroke-linecap="round"/><path d="M0-6l-.9 1.4h1.8zM-5 3.4l1.6-.1-.8-1.5zM5 3.4l-1.6-.1.8-1.5z" fill="#fff"/>`)},
  leaf(x,y,r,s,c){c=c||ICC.green;return this.g(x,y,r,s,`<path d="M0-9C6-5 6 4 0 9-6 4-6-5 0-9z" fill="${c}" stroke="#2a4a18" stroke-width=".6"/><path d="M0-8V8" stroke="#2a4a18" stroke-width=".6"/>`)},
  feather(x,y,r,s,c){c=c||ICC.feather;return this.g(x,y,r,s,`<path d="M0-11C4-7 4 3 0 9-4 3-4-7 0-11z" fill="${c}" stroke="#7a6a4a" stroke-width=".5"/><path d="M0-10V12" stroke="#7a6a4a" stroke-width=".7"/><path d="M0-4l3-2M0 0l3-2M0-4l-3-2M0 0l-3-2" stroke="#7a6a4a" stroke-width=".4"/>`)},
  claw(x,y,r,s,c){c=c||ICC.red;return this.g(x,y,r,s,[-4,0,4].map(d=>`<path d="M${d-3}-9C${d+1}-4 ${d+2} 2 ${d-1} 10" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`).join(''))},
  fang(x,y,s){return this.g(x,y,0,s,`<path d="M-9-6Q0-1 9-6V-2Q0 3-9-2z" fill="#3a0a0a"/><path d="M-6-4l1.4 7 1.4-6.4M6-4L4.6 3 3.2-3.4" fill="#f4efe2" stroke="#6a5a40" stroke-width=".4"/>`)},
  skull(x,y,s,c){c=c||ICC.bone;return this.g(x,y,0,s,`<path d="M-7 1c-2-8 2-11 7-11s9 3 7 11l-2 1v4h-10v-4z" fill="${c}" stroke="#5a4a30" stroke-width=".6"/><circle cx="-3" cy="-1" r="2" fill="#1a1008"/><circle cx="3" cy="-1" r="2" fill="#1a1008"/><path d="M-3 6v-2M0 6v-2M3 6v-2" stroke="#5a4a30" stroke-width=".7"/>`)},
  crown(x,y,s){return this.g(x,y,0,s,`<path d="M-9 4l-1-10 5 4 5-7 5 7 5-4-1 10z" fill="${ICC.gold}" stroke="#5a4010" stroke-width=".7" stroke-linejoin="round"/><circle cy="0" r="1.4" fill="${ICC.red}"/>`)},
  wings(x,y,s,c){c=c||ICC.feather;return this.g(x,y,0,s,`<path d="M-2 0C-6-6-12-8-15-6c3 1 4 3 4 4-2 0-3 1-4 3 3-1 6 0 9 2zM2 0C6-6 12-8 15-6c-3 1-4 3-4 4 2 0 3 1 4 3-3-1-6 0-9 2z" fill="${c}" stroke="#7a6a4a" stroke-width=".5"/>`)},
  cloud(x,y,s,c){c=c||'#8a90a8';return this.g(x,y,0,s,`<path d="M-9 4a4 4 0 0 1 0-8 6 6 0 0 1 11-2 4.6 4.6 0 0 1 7 4 3.6 3.6 0 0 1-1 6z" fill="${c}" opacity=".9"/>`)},
  spiral(x,y,s,c){c=c||'#fff';return this.g(x,y,0,s,`<path d="M0 0a2 2 0 0 1 4 0 4 4 0 0 1-8 0 6 6 0 0 1 12 0 8 8 0 0 1-16 0 10 10 0 0 1 20 0" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>`)},
  laurel(x,y,s,c){c=c||ICC.gold;let o='';for(const sd of [-1,1])for(let i=0;i<5;i++){const a=(sd<0?Math.PI:0)+sd*(-.9+i*.42),R=11;o+=`<ellipse cx="${(Math.cos(a)*R).toFixed(1)}" cy="${(Math.sin(a)*R+1).toFixed(1)}" rx="1.3" ry="2.6" fill="${c}" transform="rotate(${(a*57.3+90*sd).toFixed(0)} ${(Math.cos(a)*R).toFixed(1)} ${(Math.sin(a)*R+1).toFixed(1)})"/>`}return this.g(x,y,0,s,o)},
  bricks(x,y,s){let o='';for(let r=0;r<4;r++)for(let i=0;i<3;i++)o+=`<rect x="${-9+i*6+(r%2?3:0)}" y="${-8+r*4}" width="5.4" height="3.4" fill="#7a6e60" stroke="#3a3228" stroke-width=".5"/>`;return this.g(x,y,0,s,`<g clip-path="none">${o}</g>`)},
  hourglass(x,y,s){return this.g(x,y,0,s,`<path d="M-5-9h10M-5 9h10M-4-9c0 6 8 6 8 9s-8 3-8 9M4-9c0 6-8 6-8 9s8 3 8 9" stroke="${ICC.gold}" stroke-width="1.4" fill="none"/><path d="M-2.6 7.6h5.2L0 4z" fill="${ICC.gold}"/>`)},
  up(x,y,s,c){c=c||ICC.gold;return this.g(x,y,0,s,`<path d="M-5 3l5-5 5 5M-5 8l5-5 5 5" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`)},
  inward(x,y,s,c){c=c||ICC.gold;let o='';for(let i=0;i<6;i++){const a=i/6*6.283,cx=Math.cos(a),sy=Math.sin(a);o+=`<path d="M${(cx*12).toFixed(1)} ${(sy*12).toFixed(1)}L${(cx*5).toFixed(1)} ${(sy*5).toFixed(1)}" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/><path d="M${(cx*4.4).toFixed(1)} ${(sy*4.4).toFixed(1)}l${(-sy*2-cx*2).toFixed(1)} ${(cx*2-sy*2).toFixed(1)}M${(cx*4.4).toFixed(1)} ${(sy*4.4).toFixed(1)}l${(sy*2-cx*2).toFixed(1)} ${(-cx*2-sy*2).toFixed(1)}" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>`}return this.g(x,y,0,s,o)},
  orb(x,y,r,c){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x-r*.35}" cy="${y-r*.35}" r="${r*.35}" fill="#fff" opacity=".8"/>`},
  dots(pts,c,r){return pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${r||2.4}" fill="${c||'#fff'}" opacity=".85"/>`).join('')},
  path(d,c,w,o){return `<path d="${d}" stroke="${c||'#fff'}" stroke-width="${w||1.4}" fill="none" stroke-linecap="round" stroke-linejoin="round"${o?` opacity="${o}"`:''}/>`},
};
// 스킬 → 문양 조합. c: 주색(원소/직업), hi: 밝은 색
const ICX=ICM;
const ICP={
  /* 전사 · 검과 방패 */
  slash:c=>ICX.arc(17,15,-10,1.05,c.hi)+ICX.sword(14,17,40,.95),
  shieldbash:c=>ICX.burst(23,10,.75,ICC.gold)+ICX.shield(13,17,1,c.r)+ICX.lines(10,17,0,.8,'#fff',3),
  guardstance:c=>ICX.sword(21,15,25,.75)+ICX.shield(14,17,1.05,c.r),
  doubleslash:c=>ICX.arc(15,13,-10,.9,c.hi)+ICX.arc(18,20,-10,.9,c.hi)+ICX.sword(8,18,40,.7),
  swordmastery:c=>ICX.laurel(16,16,1.15)+ICX.sword(16,15,0,.9),
  riposte:c=>ICX.shield(12,17,.9,c.r)+ICX.path('M20 9a7 7 0 0 1 4 11l-3-1',ICC.gold,1.8)+ICX.burst(24,22,.4,'#fff'),
  crossslash:c=>ICX.path('M6 6L26 26M26 6L6 26','#fff',2.2,.55)+ICX.sword(16,16,45,.9)+ICX.sword(16,16,-45,.9),
  shieldcharge:c=>ICX.lines(9,16,0,1.1,c.hi,4)+ICX.shield(19,16,1,c.r),
  bladedance:c=>ICX.spiral(16,16,.95,c.hi)+ICX.sword(16,16,60,.85),
  shieldthrow:c=>ICX.path('M6 22C6 8 26 6 26 16',ICC.gold,1.2,.8)+`<path d="M6 22C6 8 26 6 26 16" stroke="#fff" stroke-width=".6" stroke-dasharray="2 2" fill="none"/>`+ICX.round(21,19,.7,c.r)+ICX.dots([[6,22],[12,10],[24,9]],ICC.gold,1.6),
  thousandcuts:c=>[[-35,12,10],[-20,18,9],[-5,22,14],[10,12,20]].map(([r,x,y])=>ICX.arc(x+4,y,r,.6,c.hi)).join('')+ICX.sword(7,22,45,.6),
  oathblade:c=>ICX.burst(16,9,.9,'rgba(255,230,140,.55)',10)+ICX.sword(16,16,0,1.1)+ICX.path('M5 24c4-3 7-3 11 0s7 3 11 0',c.hi,1.4),
  sunderingstrike:c=>ICX.crack(16,26,1,c.hi)+ICX.path('M16 26L16 4',c.hi,5,.35)+ICX.sword(16,13,180,1.05),
  /* 전사 · 창술 */
  thrust:c=>ICX.spear(14,18,45,.95)+ICX.lines(27,6,-45,.7,'#fff',3),
  sweep:c=>ICX.path('M4 20A13 9 0 0 1 28 20',c.hi,2.2,.7)+ICX.spear(16,16,-78,.95),
  polearmmastery:c=>ICX.laurel(16,16,1.15)+ICX.spear(16,17,0,.85),
  hook:c=>ICX.spear(12,18,45,.85)+ICX.path('M27 6c-4 0-5 4-2 5',ICC.steel,1.8)+ICX.path('M26 26c-6-1-8-5-9-9',c.hi,1.6)+ICX.path('M15 15l1 3 3-1',c.hi,1.6),
  vault:c=>ICX.path('M4 26Q14 0 26 22',c.hi,1.3,.8)+`<path d="M4 26Q14 0 26 22" stroke="#fff" stroke-dasharray="2 2" stroke-width=".6" fill="none"/>`+ICX.spear(10,16,-20,.75)+ICX.ring(25,24,.5,c.hi),
  lungepierce:c=>ICX.orb(14,14,3.6,'#7a6a5a')+ICX.orb(21,9,3.6,'#7a6a5a')+ICX.spear(14,17,55,1.05)+ICX.lines(8,24,-35,.6,'#fff',3),
  polecircle:c=>`<ellipse cx="16" cy="16" rx="13" ry="8" fill="none" stroke="${c.hi}" stroke-width="1.6" opacity=".8"/>`+ICX.spear(16,16,-70,.95)+ICX.path('M27 12l2 3-3.4.6',c.hi,1.4),
  heavycrash:c=>ICX.crack(16,26,1.05,c.hi)+ICX.spear(16,12,180,.95)+ICX.burst(16,25,.45,'#fff'),
  dragonfang:c=>[0,1,2,3,4].map(i=>ICX.g(7+i*2.6,25-i*4.2,45,.42,'<path d="M0-16c2 3 2.6 6 1.4 9.6h-2.8C-2.6-10-2-13 0-16z" fill="'+(i===4?ICC.steel:c.hi)+'" opacity="'+(.45+i*.13)+'"/>')).join('')+ICX.spear(10,22,45,.75),
  skyfalllance:c=>ICX.lines(16,4,90,.7,'#fff',3)+ICX.spear(16,14,180,.85)+ICX.ring(16,26,.9,c.hi)+ICX.crack(16,26,.6,c.hi),
  warbanner:c=>ICX.banner(18,16,1,c.r)+ICX.up(25,25,.45,ICC.gold),
  heavenpiercer:c=>ICX.path('M16 30V2',c.hi,7,.3)+ICX.path('M16 30V2','#fff',1.4,.8)+ICX.spear(16,18,0,1.05)+ICX.burst(16,4,.5,'#fff'),
  /* 전사 · 수호 */
  steelheart:c=>ICX.heart(16,17,1.15,ICC.steel)+ICX.path('M10 12h12M9 17h14',ICC.steelD,1)+ICX.heart(16,17,.45,c.r),
  taunt:c=>ICX.figure(11,19,.9,ICC.steel)+ICX.waves(15,12,0,1,ICC.gold,3)+ICX.path('M27 6v6M27 15v.5',ICC.red,2.4),
  toughness:c=>ICX.plate(16,17,1.15)+ICX.path('M8 6l3 3M24 6l-3 3',ICC.gold,1.2),
  provokestrike:c=>ICX.sword(12,17,40,.85)+ICX.target(23,10,.55,ICC.red)+ICX.path('M23 22v3',ICC.red,2.2),
  defiance:c=>ICX.shield(13,17,.95,c.r)+ICX.up(24,18,.75,ICC.gold)+ICX.heart(24,7,.38,'#8cf08a'),
  ironwall:c=>ICX.path('M5 6v20M27 6v20',ICC.steelD,2.4)+ICX.shield(16,16,1.15,ICC.steelD,ICX.g(0,-2,0,1,'<path d="M-5-4h10M-5 0h10M-5 4h10M-2-4v4M2 0v4" stroke="'+ICC.steel+'" stroke-width="1"/>'))+ICX.burst(25,7,.3,'#fff'),
  guardlink:c=>ICX.figure(8,20,.75,ICC.steel)+ICX.figure(24,20,.75,'#c8d8e8')+ICX.chain(16,14,0,.62,ICC.gold)+ICX.shield(8,22,.4,c.r),
  rally:c=>ICX.horn(15,18,-10,.85)+ICX.up(24,9,.6,ICC.gold)+ICX.heart(8,8,.35,c.r),
  spikeguard:c=>ICX.plate(16,18,1)+ICX.path('M5 12l-3-1M5 18l-3 1M27 12l3-1M27 18l3 1M10 7l-1-3M22 7l1-3',ICC.steel,1.8),
  laststand:c=>ICX.shield(16,16,1.05,c.r)+ICX.path('M13 5l3 6-3 3 4 5-2 5',"#1a1612",1.4)+ICX.heart(16,15,.38,'#ffd0c0'),
  stomp:c=>ICX.crack(16,25,1.1,c.hi)+ICX.boot(15,15,0,1)+ICX.lines(16,4,90,.5,'#fff',3),
  fortress:c=>ICX.tower(16,17,1.1)+ICX.shield(24,24,.4,c.r),
  gathercry:c=>ICX.inward(16,16,1.1,ICC.gold)+ICX.figure(16,18,.55,ICC.steel),
  standard:c=>ICX.banner(18,16,1,'#3a5a9a',ICX.shield(1,-5,.36,ICC.steel))+ICX.ring(16,27,.6,ICC.gold),
  undying:c=>ICX.wings(16,13,1,'#ffe8b0')+ICX.heart(16,16,.75,c.r)+ICX.burst(16,6,.35,'#fff'),
  /* 전사 · 격노 */
  bloodfire:c=>ICX.flame(16,13,1.1,'#ff5a3a')+ICX.drop(16,20,.75,ICC.blood),
  heavyblow:c=>ICX.burst(20,22,.85,ICC.gold)+ICX.sword(14,13,-35,1)+ICX.path('M5 8l4 4',c.hi,1.4),
  furytraining:c=>ICX.spiral(16,16,.9,'#8fb0ff')+ICX.drop(16,16,.55,'#5a8aff'),
  leapsmash:c=>ICX.path('M4 24Q12 2 22 18',c.hi,1.3,.8)+ICX.sword(22,15,160,.8)+ICX.ring(22,25,.6,c.hi)+ICX.burst(22,25,.35,'#fff'),
  rampage:c=>ICX.sword(13,16,30,.8)+ICX.sword(19,16,-30,.8)+ICX.lines(10,26,0,.6,'#fff',3)+ICX.up(27,8,.4,ICC.gold),
  fearhowl:c=>ICX.skull(14,17,1,ICC.bone)+ICX.waves(19,14,0,.85,'#c8a0ff',3),
  endblow:c=>`<path d="M5 26a11 11 0 0 1 22 0" fill="${ICC.blood}" opacity=".35"/>`+ICX.sword(16,13,180,1.05)+ICX.skull(16,25,.42,ICC.bone),
  bloodthirst:c=>ICX.fang(16,13,1.15)+ICX.drop(16,24,.6,ICC.blood),
  ragespin:c=>ICX.spiral(16,16,1,'#ff8a6a')+ICX.sword(16,16,-55,.8)+ICX.sword(16,16,125,.6),
  redmist:c=>ICX.cloud(12,15,.95,'#b02a2a')+ICX.cloud(20,20,.85,'#d8483a')+ICX.eye(16,11,.45,ICC.red,1),
  groundbreaker:c=>ICX.crack(16,25,1.2,c.hi)+ICX.fist(16,13,0,1.1)+ICX.burst(16,25,.5,'#fff'),
  warlordroar:c=>ICX.crown(16,9,.85)+ICX.waves(10,20,0,.85,ICC.gold,3)+ICX.waves(22,20,180,.85,ICC.gold,3)+ICX.sword(16,21,0,.55),
  /* 궁수 · 사격 */
  quickshot:c=>ICX.lines(9,23,-45,.7,'#fff',3)+ICX.arrow(16,16,-45,1.05),
  hawkeye:c=>ICX.eye(16,16,1.05,ICC.gold)+ICX.path('M5 7c4-3 8-3 11-1',ICC.woodD,1.8)+ICX.feather(26,9,40,.45),
  doubleshot:c=>ICX.arrow(14,18,-45,.95)+ICX.arrow(19,13,-45,.95),
  piercearrow:c=>ICX.orb(13,19,3.6,'#7a6a5a')+ICX.orb(20,12,3.6,'#7a6a5a')+ICX.arrow(16,16,-45,1.15)+ICX.path('M8 24l-3 3',c.hi,1.4),
  steadyhand:c=>ICX.laurel(16,16,1.15)+ICX.bow(16,16,0,.8,.6),
  fanshot:c=>[-75,-60,-45,-30,-15].map(a=>ICX.arrow(6+Math.cos(a/57.3)*11,26+Math.sin(a/57.3)*11,a,.6)).join(''),
  fulldraw:c=>ICX.bow(17,16,-45,1.1,1)+ICX.burst(26,7,.35,'#fff'),
  streamshot:c=>[0,1,2,3].map(i=>ICX.arrow(7+i*5,25-i*5,-45,.5)).join('')+ICX.lines(6,27,-45,.5,c.hi,2),
  ricochet:c=>ICX.path('M4 24L12 10 19 22 27 8',c.hi,1.2,.75)+`<path d="M4 24L12 10 19 22 27 8" stroke="#fff" stroke-dasharray="2 2" stroke-width=".6" fill="none"/>`+ICX.dots([[12,10],[19,22]],c.hi,2)+ICX.arrow(25,11,-60,.55),
  arrowrain:c=>ICX.cloud(16,6,.9,'#6a7088')+[[8,14],[14,18],[20,13],[25,19],[11,24],[19,25]].map(([x,y])=>ICX.arrow(x,y,70,.42)).join(''),
  deadeye:c=>ICX.target(16,16,1.05,ICC.red)+ICX.burst(16,16,.45,ICC.gold),
  siegeshot:c=>ICX.bricks(23,16,.9)+ICX.path('M3 16H18',c.hi,4,.35)+ICX.arrow(13,16,0,1.1)+ICX.burst(19,16,.45,'#fff'),
  skyvolley:c=>ICX.path('M3 28Q16-6 29 28',c.hi,1,.5)+[[6,10],[11,14],[16,9],[21,15],[26,10],[9,22],[16,20],[23,23]].map(([x,y])=>ICX.arrow(x,y,75,.38)).join(''),
  /* 궁수 · 원소 화살 */
  flamearrow:c=>ICX.flame(9,22,.7)+ICX.arrow(17,15,-45,1,PAL.fire[0],PAL.fire[0]),
  icearrow:c=>ICX.flake(9,22,.6)+ICX.arrow(17,15,-45,1,PAL.ice[2],PAL.ice[0]),
  shockarrow:c=>ICX.zap(8,22,20,.55)+ICX.arrow(17,15,-45,1,PAL.storm[2],PAL.storm[0])+ICX.path('M24 8l3-2-1 4 3-1',PAL.storm[2],1.1),
  elementquiver:c=>ICX.quiver(16,17,0,1.1,[PAL.fire[0],PAL.ice[0],PAL.storm[2]]),
  burstarrow:c=>ICX.burst(22,10,1,PAL.fire[0],9)+ICX.flame(22,10,.5)+ICX.arrow(12,20,-45,.8,PAL.fire[0],PAL.fire[0]),
  glacialarrow:c=>ICX.flake(22,10,1.05)+`<circle cx="22" cy="10" r="9" fill="none" stroke="${PAL.ice[0]}" stroke-width="1" opacity=".7"/>`+ICX.arrow(12,20,-45,.8,PAL.ice[2],PAL.ice[0]),
  thunderarrow:c=>ICX.cloud(16,6,.85,'#5a6088')+ICX.zap(16,17,0,.95)+ICX.arrow(9,22,-60,.55,PAL.storm[2],PAL.storm[0])+ICX.ring(16,27,.6,PAL.storm[2]),
  imbue:c=>ICX.arrow(16,17,-45,1)+ICX.orb(8,8,3.2,PAL.fire[0])+ICX.orb(24,24,3.2,PAL.ice[0])+ICX.orb(8,25,3.2,PAL.storm[2]),
  trinityarrow:c=>ICX.arrow(16,9,-20,.85,PAL.fire[0],PAL.fire[0])+ICX.arrow(16,17,-20,.85,PAL.ice[2],PAL.ice[0])+ICX.arrow(16,25,-20,.85,PAL.storm[2],PAL.storm[0]),
  /* 궁수 · 덫과 생존 */
  snaretrap:c=>ICX.noose(16,15,1)+ICX.ring(16,24,.7,'#c8a870',1),
  evaderoll:c=>ICX.path('M24 9a9 9 0 1 0 2 9',c.hi,2)+ICX.path('M26 18l1-4-4 1',c.hi,1.8)+ICX.lines(27,24,180,.6,'#fff',3)+ICX.figure(15,18,.6,'#a8c890'),
  firetrap:c=>ICX.trap(16,20,1)+ICX.flame(16,10,.75),
  nimble:c=>ICX.boot(15,17,0,.9)+ICX.wings(18,10,.5,ICC.feather)+ICX.lines(8,24,0,.6,'#fff',3),
  caltrops:c=>ICX.caltrop(9,21,1)+ICX.caltrop(21,23,.9)+ICX.caltrop(16,12,1)+ICX.path('M4 28h24',ICC.woodD,1,.6),
  frosttrap:c=>ICX.trap(16,20,1,PAL.ice[0])+ICX.flake(16,9,.75),
  camouflage:c=>ICX.leaf(10,13,-30,.8)+ICX.leaf(22,13,30,.8)+ICX.leaf(16,20,0,.9,'#6a9a4a')+ICX.eye(16,14,.32,ICC.gold)+ICX.path('M8 24L24 8','#1a2a12',1.6,.6),
  shrapneltrap:c=>ICX.trap(16,22,.9)+[[-60,1],[-90,1.2],[-120,1],[-30,.8],[-150,.8]].map(([a,s])=>ICX.g(16+Math.cos(a/57.3)*9,16+Math.sin(a/57.3)*9,a+90,s,'<path d="M0-4l2 4-2 2-2-2z" fill="'+ICC.steel+'"/>')).join(''),
  survivor:c=>ICX.heart(16,17,1,'#6aa04a')+ICX.leaf(22,9,30,.55)+ICX.up(16,17,.55,'#fff'),
  trapfield:c=>[[8,9],[24,9],[16,16],[8,24],[24,24]].map(([x,y])=>ICX.trap(x,y,.42)).join('')+`<circle cx="16" cy="16" r="13" fill="none" stroke="${c.hi}" stroke-dasharray="2 2" stroke-width=".8"/>`,
  beastcage:c=>ICX.cage(16,17,1.05)+ICX.target(16,6,.32,ICC.red),
  /* 궁수 · 사냥 */
  trackmark:c=>ICX.target(17,15,.95,ICC.red)+ICX.arrow(10,22,-45,.6),
  falcon:c=>ICX.falcon(16,15,0,1.1),
  wolfcall:c=>ICX.wolf(16,16,1.05),
  beastbond:c=>ICX.paw(12,18,1,ICC.fur)+ICX.heart(23,10,.5,ICC.red),
  weakspot:c=>ICX.target(19,13,.95,ICC.gold)+ICX.arrow(13,19,-45,.85)+ICX.burst(19,13,.3,'#fff'),
  falcondive:c=>ICX.lines(16,8,90,.6,'#fff',3)+ICX.falcon(16,15,180,.8)+ICX.ring(16,27,.6,c.hi),
  huntinghorn:c=>ICX.horn(14,18,-15,1)+ICX.waves(25,8,-40,.6,ICC.gold,3),
  predatoreye:c=>ICX.eye(16,16,1.1,'#e8a020',1)+ICX.claw(16,16,20,.5,'rgba(216,72,58,.7)'),
  wildrun:c=>ICX.paw(8,22,.6)+ICX.paw(14,15,.65)+ICX.paw(21,20,.7)+ICX.paw(26,11,.75)+ICX.lines(6,10,0,.7,'#fff',3),
  apexhunt:c=>ICX.claw(16,16,15,1.2,ICC.red)+ICX.falcon(24,7,0,.45)+ICX.crown(9,7,.45),
};
// 그 밖의 물리 스킬(표에 없는 것): 종류로 대신
function physIconFallback(s,c){const w=s.cls==='archer';
  switch(s.kind){case'melee':return ICX.arc(17,15,-10,1,c.hi)+ICX.sword(14,17,40,.9);case'bolt':return ICX.arrow(16,16,-45,1.05);case'trap':return ICX.trap(16,18,1);
    case'leap':return ICX.path('M4 24Q14 2 26 22',c.hi,1.3)+ICX.ring(25,24,.5,c.hi);case'charge':return ICX.lines(9,16,0,1,c.hi,4)+ICX.shield(19,16,.9,c.r);
    case'summon':return w?ICX.wolf(16,16,1):ICX.figure(16,18,1.1);case'buff':return ICX.up(16,16,1.1,c.hi);case'passive':return ICX.laurel(16,16,1.1)+(w?ICX.bow(16,16,0,.7,.5):ICX.sword(16,16,0,.8));
    default:return w?ICX.arrow(16,16,-45,1):ICX.sword(16,16,30,1)}}
function physIcon(s){const elc=s.el&&s.el!=='phys'&&PAL[s.el],w=s.cls==='archer';
  const c={c:elc?elc[0]:w?'#a8c890':'#e8c8b0',hi:elc?elc[2]:w?'#e8f8d8':'#fff4e0',r:w?'#5a7a3a':ICC.red,dk:elc?elc[1]:w?'#16200e':'#2a1410'};
  const f=ICP[s.id],body=f?f(c):physIconFallback(s,c),gid='ip'+s.id,fr=elc?elc[0]:w?'#8fbf6a':'#c8a07a';
  const pv=s.kind==='passive'?`<circle cx="16" cy="16" r="14.3" stroke="${fr}" stroke-width="1" stroke-dasharray="2.5 2.5" fill="none" opacity=".85"/>`:'';
  return `<svg viewBox="0 0 32 32" aria-hidden="true"><defs><radialGradient id="${gid}" cx=".4" cy=".35" r=".85"><stop offset="0" stop-color="${c.dk}"/><stop offset=".55" stop-color="${Kit.mix(c.dk,'#000000',.35)}"/><stop offset="1" stop-color="#050404"/></radialGradient></defs><rect x=".5" y=".5" width="31" height="31" rx="3" fill="url(#${gid})" stroke="${fr}" stroke-opacity=".5"/>${body}${pv}</svg>`}
// 아이콘 견본표 (점검·스크린샷용)
function physIconSheet(ids){ids=ids||Object.keys(ICP);const n=ids.length,cols=10,CW=120,RH=104,cv=document.createElement('canvas'),k=2;cv.width=CW*cols*k;cv.height=(Math.ceil(n/cols)*RH+10)*k;
  const g=cv.getContext('2d');g.scale(k,k);g.fillStyle='#1a1714';g.fillRect(0,0,CW*cols,cv.height);
  return new Promise(ok=>{let left=n;ids.forEach((id,i)=>{const s=SPELLS[id]||{id,kind:'melee',cls:/shot|arrow|trap|falcon|wolf|hawk|eye|horn|cage|run|hunt|mark|bond|spot|roll|nimble|calt|camo|surv|imbue|quiver|volley|siege|rain|rico|draw|hand|stream|fan|dive/.test(id)?'archer':'warrior',el:/flame|burst|fire|trinity/.test(id)?'fire':/ice|glacial|frost/.test(id)?'ice':/shock|thunder/.test(id)?'storm':'phys'};
    const im=new Image();im.onload=im.onerror=()=>{const x=(i%cols)*CW,y=Math.floor(i/cols)*RH+6;g.drawImage(im,x+28,y,64,64);g.fillStyle='#e8e2d2';g.font='11px sans-serif';g.textAlign='center';g.fillText((s.n||id).slice(0,14),x+CW/2,y+78);g.fillStyle='rgba(232,226,210,.5)';g.fillText(id,x+CW/2,y+92);if(--left===0)ok(cv.toDataURL('image/png'))};
    im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(physIcon(s).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '))})})}
window.__icp={sheet:()=>physIconSheet(),ids:()=>Object.keys(ICP),svg:id=>physIcon(SPELLS[id]||{id,kind:'melee',cls:'warrior',el:'phys'})};
