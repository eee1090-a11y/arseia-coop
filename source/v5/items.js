/* ---------- v5: 유니크 · 상급 유니크 · 세트 ---------- */
// 숫자는 int/hp/mp/regen이면 기본 굴림의 배수, 나머지는 그대로
const UNIQ=[
  {n:'불사조의 깃털',slot:'staff',cls:'mage',st:{int:1.3,tr_0:2,el_fire:20,proc_bird:12},lore:'한 번 타 버린 새는 다시 타지 않는다.'},
  {n:'천공의 지휘봉',slot:'staff',cls:'mage',st:{int:1.3,tr_2:2,el_storm:20,proc_chain:12},lore:'구름을 지휘하던 대마법사의 것.'},
  {n:'서리여왕의 홀',slot:'staff',cls:'mage',st:{int:1.2,tr_1:2,el_ice:20,proc_frost:12},lore:'손잡이가 늘 차갑다.'},
  {n:'대지 심장 지팡이',slot:'staff',cls:'mage',st:{int:1.2,tr_3:2,el_earth:20,dr:8},lore:'산의 심장에서 깎아 냈다.'},
  {n:'시간술사의 옷',slot:'robe',cls:'mage',st:{hp:1.1,tr_4:2,cdr:12},lore:'옷자락이 한 박자 늦게 따라온다.'},
  {n:'서리여왕의 인장',slot:'ring',cls:'mage',st:{mp:1.1,tr_1:1,el_ice:15,crit:6}},
  {n:'아우렐의 지팡이',slot:'staff',cls:'priest',st:{int:1.3,tr_0:2,el_holy:20,proc_nova:12},lore:'성 아우렐이 순례길에 짚던 지팡이.'},
  {n:'퇴마사의 사슬봉',slot:'staff',cls:'priest',st:{int:1.3,tr_1:2,el_holy:15,proc_chain:10}},
  {n:'대사제의 성의',slot:'robe',cls:'priest',st:{hp:1.4,tr_2:2,dr:8}},
  {n:'아우렐의 눈물',slot:'amulet',cls:'priest',st:{regen:1.3,tr_2:1,ls:3,all:1}},
  {n:'발케르의 망토',slot:'robe',st:{hp:1.4,mp:1,dr:10,ms:8},lore:'불타는 성문을 지나온 망토.'},
  {n:'시간술사의 고리',slot:'ring',st:{mp:1.2,cdr:12,mcost:10}},
  {n:'근원어의 목걸이',slot:'amulet',st:{regen:1.4,all:1,mk:5}},
  {n:'피의 성배 목걸이',slot:'amulet',st:{hp:1,ls:4,crit:5}},
];
// 던전 보스만 떨어뜨리는 상급 유니크
const BOSSU=[
  {n:'아르실의 망령 지팡이',slot:'staff',st:{int:1.7,all:2,crit:8,ls:3,proc_frost:15},lore:'고분의 왕이 죽어서도 놓지 않던 지팡이.'},
  {n:'삼키는 자의 가죽',slot:'robe',st:{hp:2,dr:15,ls:5,ms:10},lore:'강 밑바닥의 것이 벗어 놓은 껍질.'},
  {n:'발드라크의 재 홀',slot:'staff',cls:'mage',st:{int:1.8,all:2,el_fire:30,proc_bird:20,cdr:10},lore:'요새를 태운 불이 아직 그 안에 있다.'},
  {n:'하늘 가르는 자',slot:'staff',cls:'mage',st:{int:1.8,all:2,el_storm:30,proc_chain:20}},
  {n:'빛의 사도 지팡이',slot:'staff',cls:'priest',st:{int:1.8,all:2,el_holy:30,proc_nova:20}},
  {n:'모르가스의 눈',slot:'ring',st:{mp:1.5,all:2,cdr:15,mcost:15},lore:'재의 사도가 세상을 보던 눈.'},
  {n:'얼어붙은 왕의 반지',slot:'ring',st:{mp:1.3,all:1,el_ice:25,proc_frost:20,crit:6}},
  {n:'재의 왕관 조각',slot:'amulet',st:{regen:1.6,all:2,mk:8,proc_nova:15}},
];
const SETS={
  valker:{n:'발케르의 불꽃',cls:'mage',p:{staff:'발케르의 횃불',robe:'발케르의 그을린 로브',ring:'발케르의 불씨 반지',amulet:'발케르의 재 목걸이'},key:'tr_0',
    b:{2:{el_fire:15},3:{cdr:10,tr_0:1},4:{proc_bird:15,all:1,int:30}}},
  frostspire:{n:'서리첨탑',cls:'mage',p:{staff:'서리첨탑 지팡이',robe:'서리첨탑 외투',ring:'서리첨탑 고리',amulet:'서리첨탑 눈물'},key:'tr_1',
    b:{2:{el_ice:15},3:{dr:10,tr_1:1},4:{proc_frost:15,all:1,hp:150}}},
  stormcaller:{n:'폭풍을 부르는 자',cls:'mage',p:{staff:'뇌명의 지팡이',robe:'폭풍 망토',ring:'번개 고리',amulet:'천둥 부적'},key:'tr_2',
    b:{2:{el_storm:15},3:{ms:10,tr_2:1},4:{proc_chain:15,all:1,crit:8}}},
  seeker:{n:'근원의 탐구자',cls:'mage',p:{staff:'탐구자의 지팡이',robe:'탐구자의 로브',ring:'탐구자의 인장',amulet:'탐구자의 나침반'},key:'tr_3',
    b:{2:{mcost:10,regen:3},3:{tr_3:1,tr_4:1},4:{all:2,cdr:10}}},
  aurel:{n:'성 아우렐의 유산',cls:'priest',p:{staff:'아우렐의 홀',robe:'아우렐의 예복',ring:'아우렐의 반지',amulet:'아우렐의 성표'},key:'tr_0',
    b:{2:{el_holy:15},3:{tr_0:1,cdr:10},4:{proc_nova:15,all:1,int:30}}},
  exorcist:{n:'퇴마사의 맹세',cls:'priest',p:{staff:'맹세의 철퇴',robe:'퇴마사의 사슬옷',ring:'맹세의 반지',amulet:'봉인의 목걸이'},key:'tr_1',
    b:{2:{crit:6},3:{tr_1:1,ls:3},4:{proc_chain:15,all:1}}},
  saint:{n:'성녀의 가호',cls:'priest',p:{staff:'성녀의 지팡이',robe:'성녀의 베일',ring:'성녀의 묵주 반지',amulet:'성녀의 눈물'},key:'tr_2',
    b:{2:{hp:120},3:{tr_2:1,dr:10},4:{all:2,regen:5}}},
};
const SCALE=new Set(['int','hp','mp','regen']);
function fixedStats(st,il){const o={};for(const [k,f] of Object.entries(st))o[k]=SCALE.has(k)?(k==='regen'?Math.round(rollStat(k,il)*f*10)/10:Math.round(rollStat(k,il)*f)):f;return o}
/* v21 (사용자 03:17 「장비 드랍율이 너무 높은 것 같아 … 잡템이 쌓이니까」): 몬스터가 떨어뜨리는 장비 중 일반은 절반, 마법은 70%만 남긴다.
   희귀·세트·유니크·상급 유니크는 그대로(드문 아이템의 확률은 안 바뀜). 의뢰·현상금·상자 보상은 그대로. */
const JUNK21={0:.5,1:.7};
function junkKeep(it){return !!it&&(it.rar>=2||R()<(JUNK21[it.rar]??1))}
function makeItem(il,elite,cls,force){
  cls=cls||P.cls;il=clamp(Math.round(il),1,Math.max(99,MAXLV));// v20: 140레벨까지 아이템 레벨도 따라감
  const r=R();
  // v18: 유니크·세트가 더 드물게 (예전 일반 .8%/1.2% · 정예 3.8%/5.2% → 일반 .4%/.6% · 정예 1.6%/2.4%)
  let kind=force||(r<.004+(elite?.012:0)?'uniq':r<.01+(elite?.03:0)?'set':null);
  if(kind==='boss'){const pool=BOSSU.filter(u=>!u.cls||u.cls===cls),u=pick(pool);
    return{id:uid++,slot:u.slot,rar:5,name:u.n,il:il+3,stats:fixedStats(u.st,il+3),cls,lore:u.lore}}
  if(kind==='uniq'){const pool=UNIQ.filter(u=>!u.cls||u.cls===cls),u=pick(pool);
    return{id:uid++,slot:u.slot,rar:4,name:u.n,il,stats:fixedStats(u.st,il),cls,lore:u.lore}}
  if(kind==='set'){const ids=Object.keys(SETS).filter(k=>SETS[k].cls===cls),sid=pick(ids),S=SETS[sid],slot=pick(Object.keys(SLOT)),stats={};
    {const mk=SLOT[slot].main,v=rollStat(mk,il)*1.15;stats[mk]=mk==='regen'?Math.round(v*10)/10:Math.round(v)}stats[S.key]=1;
    const pool=affixPool(il,cls).filter(k=>!(k in stats)&&!k.startsWith('sk_'));for(let i=0;i<2;i++){const k=pick(pool);stats[k]=Math.round(((stats[k]||0)+rollStat(k,il))*10)/10}
    for(const k of ['cdr','mcost'])if(stats[k])stats[k]=Math.min(25,stats[k]);
    return{id:uid++,slot,rar:3,name:S.p[slot],il,stats,cls,set:sid}}
  let rar=r<.12+(elite?.18:0)?2:r<.42+(elite?.3:0)?1:0;
  const slot=pick(Object.keys(SLOT)),S=SLOT[slot],stats={};
  stats[S.main]=rollStat(S.main,il);
  const pool=affixPool(il,cls).filter(k=>k!==S.main);
  let n=rar===2?ri(2,3):RAR[rar].a;
  // 계열 마법 레벨은 희귀: 마법 등급 1.5%, 희귀 등급 5% (아이템 레벨 8 이상)
  if(rar>=1&&il>=8&&R()<(rar===2?TREE_AFX.rare:TREE_AFX.magic)){const k='tr_'+ri(0,CLASSES[cls].trees.length-1);stats[k]=rollStat(k,il);n--}
  for(let i=0;i<n;i++){const k=pick(pool);const v=rollStat(k,il);stats[k]=Math.round(((stats[k]||0)+v)*10)/10;if(k==='cdr'||k==='mcost')stats[k]=Math.min(k==='cdr'?25:30,stats[k])}
  let name=S.base[clamp(Math.floor(il/8),0,7)];
  if(rar===1||rar===2)name=pick(PREF)+' '+name;
  return{id:uid++,slot,rar,name,il,stats,cls};
}
const TREE_AFX={magic:.015,rare:.05};
function setCount(sid){let n=0;for(const s in P.gear){const it=P.gear[s];if(it&&it.set===sid)n++}return n}
let gsKey='',gsP=null,gsVal={};
function gearStats(){
  const key=Object.values(P.gear).map(it=>it?it.id:0).join(',');
  if(key===gsKey&&gsP===P)return gsVal;
  const o={};const add=(k,v)=>o[k]=Math.round(((o[k]||0)+v)*10)/10;
  for(const s in P.gear){const it=P.gear[s];if(it)for(const k in it.stats)add(k,it.stats[k])}
  for(const sid in SETS){const n=setCount(sid);if(n<2)continue;for(const c in SETS[sid].b)if(n>=+c)for(const [k,v] of Object.entries(SETS[sid].b[c]))add(k,v)}
  gsKey=key;gsP=P;gsVal=o;return o}
function setLine(it){const S=SETS[it.set];if(!S)return'';const n=setCount(it.set);
  return `<div style="color:#5ee06a;margin-top:3px">${S.n} 세트 (${n}/4 착용)`+Object.entries(S.b).map(([c,b])=>`<div style="opacity:${n>=+c?1:.45}">${c}개: ${Object.entries(b).map(([k,v])=>statOne(k,v)).join(', ')}</div>`).join('')+'</div>'}
function setsHtml(){let h='';for(const sid in SETS){const n=setCount(sid);if(!n)continue;const S=SETS[sid];
  h+=`<div class="item"><div><div class="nm" style="color:#5ee06a">${S.n} <span class="muted">${n}/4</span></div>`+Object.entries(S.b).map(([c,b])=>`<div class="st" style="opacity:${n>=+c?1:.45}">${c}개: ${Object.entries(b).map(([k,v])=>statOne(k,v)).join(', ')}</div>`).join('')+'</div></div>'}
  return h}
