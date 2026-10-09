/* ---------- v18: 전사 · 궁수 — 능력치 · 무기 · 전투 · 장비 · 화면 ----------
   설계: rpg/v18-design/code/v18-stats.js · v18-items.js. 데이터는 cls.js.
   마법사·사제의 계산은 그대로 둔다(PHYS_CLS가 아닌 직업은 모든 새 갈래를 건너뛴다).
   그림 담당(ART)이 바꿔 쓸 수 있는 자리: PFX(물리 효과 그림), IPAINT[무기 종류]·IBASE[무기 종류](아이템 아이콘),
   heroWeapon(h)(영웅이 든 무기 종류). 여기 그림은 자리만 채우는 임시 그림이다. */

/* ===== 무기 종류 · 칸 · 옵션 (v18-items.js) ===== */
const WT={
  sword:  {n:'한손검',cls:'warrior',mul:1.0,spd:.45,reach:72,hand:1},
  polearm:{n:'창·폴암',cls:'warrior',mul:1.5,spd:.60,reach:110,hand:2,arc:1.15},
  bow:    {n:'활',cls:'archer',mul:1.0,spd:.42,range:1,hand:2,offOk:'quiver'},
  xbow:   {n:'석궁',cls:'archer',mul:1.45,spd:.62,range:1.1,hand:2,offOk:'quiver',pierce:1},
  shield: {n:'방패',cls:'warrior',off:1},
  quiver: {n:'화살통',cls:'archer',off:1},
  plate:  {n:'판금 갑옷',cls:'warrior',body:1},
  leather:{n:'가죽 갑옷',cls:'archer',body:1},
};
const SLOT_N={staff:{warrior:'무기',archer:'활'},robe:{warrior:'갑옷',archer:'가죽 갑옷'},off:{warrior:'방패',archer:'화살통'}};
const BASE_V18={
  sword:  ['녹슨 장검','철 장검','기사의 장검','룬 장검','은룡의 검','용뼈 검','별철 검','근원의 검'],
  polearm:['참나무 창','철 창','기병창','룬 할버드','은룡의 글레이브','용뼈 창','별철 할버드','근원의 창'],
  bow:    ['사냥꾼의 단궁','물푸레 활','합성궁','룬 장궁','은룡의 활','용뼈 활','별철 장궁','근원의 활'],
  xbow:   ['나무 석궁','철 석궁','연발 석궁','룬 석궁','은룡의 석궁','용뼈 석궁','별철 석궁','근원의 석궁'],
  shield: ['나무 원방패','철 원방패','연 방패','룬 방패','은룡의 방패','용비늘 방패','별철 탑방패','근원의 방패'],
  quiver: ['가죽 화살통','사냥꾼의 화살통','깃 장식 화살통','룬 화살통','은룡의 화살통','용가죽 화살통','별빛 화살통','근원의 화살통'],
  plate:  ['누빈 갑옷','사슬 갑옷','비늘 갑옷','판금 흉갑','은룡의 갑주','용비늘 갑주','별철 판금','근원의 갑주'],
  leather:['가죽 조끼','징 박은 가죽','사냥꾼의 가죽옷','룬 가죽옷','은룡의 가죽옷','용가죽 갑옷','별빛 가죽옷','근원의 가죽옷'],
};
const MAIN_V18={sword:['atk'],polearm:['atk'],bow:['atk'],xbow:['atk'],shield:['blk','dr'],quiver:['acc'],plate:['hp','dr'],leather:['hp','eva']};
const STATN_V18={str:'힘',dex:'민첩',atk:'공격력',ias:'공격 속도 %',acc:'명중',blk:'막기 확률 %',eva:'회피 확률 %',pdmg:'물리 피해 %'};
Object.assign(STATN,STATN_V18);
const AFX_POOL_V18={warrior:['str','dex','atk','hp','mp','regen','crit','cdr','ias','acc','pdmg'],archer:['dex','str','atk','hp','mp','regen','crit','cdr','ias','acc','pdmg','eva']};
const SCORE_V18={str:3,dex:3,atk:3,ias:5,acc:1,blk:4,eva:5,pdmg:2};
const UNIQ_V18=[
  {n:'브렌힐 수비대장의 검',slot:'staff',wt:'sword',cls:'warrior',st:{atk:1.3,tr_0:2,blk:5,ls:3},lore:'마을 문을 마지막까지 지킨 칼.'},
  {n:'용뼈 글레이브',slot:'staff',wt:'polearm',cls:'warrior',st:{atk:1.4,tr_1:2,pdmg:20,crit:6},lore:'자루가 무거울수록 끝이 날카롭다.'},
  {n:'성문 방패',slot:'off',wt:'shield',cls:'warrior',st:{blk:1.2,dr:10,hp:1,tr_2:1},lore:'불타는 성문에서 떼어 냈다.'},
  {n:'광전사의 띠',slot:'amulet',cls:'warrior',st:{regen:1,tr_3:1,ias:10,ls:3}},
  {n:'바람길 장궁',slot:'staff',wt:'bow',cls:'archer',st:{atk:1.3,tr_0:2,ias:10,acc:20},lore:'바람이 지나는 길을 화살이 따라간다.'},
  {n:'세 원소의 석궁',slot:'staff',wt:'xbow',cls:'archer',st:{atk:1.3,tr_1:2,el_fire:15,el_ice:15,el_storm:15}},
  {n:'덫사냥꾼의 화살통',slot:'off',wt:'quiver',cls:'archer',st:{acc:1.2,tr_2:2,eva:5}},
  {n:'고목 숲 사냥매 깃',slot:'amulet',cls:'archer',st:{regen:1,tr_3:2,crit:5,ms:8},lore:'고목의 숲 사냥꾼들이 매에게서 받은 깃털.'},
];
const BOSSU_V18=[
  {n:'발드라크의 잿불 할버드',slot:'staff',wt:'polearm',cls:'warrior',st:{atk:1.8,all:2,pdmg:30,proc_bird:15},lore:'요새를 태운 불이 날에 남아 있다.'},
  {n:'아르실의 왕실 방패',slot:'off',wt:'shield',cls:'warrior',st:{blk:1.4,all:1,dr:12,hp:1.4},lore:'고분의 왕이 무덤까지 들고 간 방패.'},
  {n:'모르가스의 재 장궁',slot:'staff',wt:'bow',cls:'archer',st:{atk:1.8,all:2,crit:8,proc_chain:15}},
  {n:'삼키는 자의 이빨 석궁',slot:'staff',wt:'xbow',cls:'archer',st:{atk:1.9,all:2,ls:4,ias:12}},
];
const SETS_V18={
  bulwark:{n:'헤이븐 수비대',cls:'warrior',p:{staff:'수비대 장검',off:'수비대 원방패',robe:'수비대 사슬갑옷',ring:'수비대 인장'},key:'tr_2',
    b:{2:{blk:8},3:{dr:8,tr_2:1},4:{hp:150,proc_nova:10}}},
  lancer:{n:'아르덴 창기병',cls:'warrior',p:{staff:'창기병의 기병창',robe:'창기병의 판금',ring:'창기병의 반지',amulet:'창기병의 훈장'},key:'tr_1',
    b:{2:{pdmg:12},3:{crit:6,tr_1:1},4:{ias:12,atk:30}}},
  ranger:{n:'윌로벤 순찰자',cls:'archer',p:{staff:'순찰자의 장궁',off:'순찰자의 화살통',robe:'순찰자의 가죽옷',amulet:'순찰자의 호루라기'},key:'tr_3',
    b:{2:{acc:30},3:{ms:10,tr_3:1},4:{crit:8,proc_chain:12}}},
  trapper:{n:'붉은 사막 덫꾼',cls:'archer',p:{staff:'덫꾼의 석궁',robe:'덫꾼의 모래 망토',ring:'덫꾼의 반지',amulet:'덫꾼의 목걸이'},key:'tr_2',
    b:{2:{eva:6},3:{cdr:10,tr_2:1},4:{el_fire:25,proc_bird:12}}},
};
// 세트 조각의 무기·갑옷 종류
const SET_WT={bulwark:{staff:'sword',off:'shield',robe:'plate'},lancer:{staff:'polearm',robe:'plate'},ranger:{staff:'bow',off:'quiver',robe:'leather'},trapper:{staff:'xbow',robe:'leather'}};
UNIQ.push(...UNIQ_V18);BOSSU.push(...BOSSU_V18);Object.assign(SETS,SETS_V18);
Object.assign(CAST_T,CAST_T_V18);Object.assign(CHAN,CHAN_V18);// 시전 시간 · 채널링 (cast.js 표에 더함)
// 보조 칸: 저장·불러오기(fixItem)가 알아보도록 SLOT에 두되, 마법사·사제의 장비 굴림(Object.keys(SLOT))에는 끼지 않게 숨긴다
Object.defineProperty(SLOT,'off',{value:{n:'보조',base:BASE_V18.shield,main:'blk'},enumerable:false,configurable:true,writable:true});
for(const sl of ['staff','robe','off']){const o=SLOT[sl],d=o.n;Object.defineProperty(o,'n',{configurable:true,enumerable:true,get(){return SLOT_N[sl][P&&P.cls]||d}})}
SHOP_SLOTS.armor.push('off');// 방어구점은 방패·화살통도 판다 (마법사·사제에게는 나오지 않는 칸)

/* ===== 능력치 (v18-stats.js) ===== */
const STAT_KEYS={mage:['int','vit','spi'],priest:['int','vit','spi'],warrior:['str','dex','vit','spi'],archer:['dex','str','vit','spi']};
const STAT_N={str:'힘',dex:'민첩',int:'지능',vit:'활력',spi:'정신'};
const WT_NEED={melee:'근접 무기가 있어야 씁니다',sword:'한손검을 들어야 씁니다',shield:'방패를 들어야 씁니다',polearm:'창·폴암을 들어야 씁니다',bow:'활이나 석궁을 들어야 씁니다'};
const WT_REQN={melee:'근접 무기(한손검·창)',sword:'한손검',shield:'방패',polearm:'창·폴암',bow:'활·석궁'};
const PSCALE={perL:.06,syn:.01,synCap:.4,pctCap:.6,buffCap:{warrior:.5,archer:.5}};
// 다른 사람의 시전을 화면에만 다시 그릴 때(GHOST)는 그 사람의 무기를 본다
const curGear=()=>GHOST?(GHOST.gear||{}):P.gear;
const mainWT=()=>{const w=curGear().staff;return w&&w.wt?WT[w.wt]:null};
const offIs=k=>{const o=curGear().off;return !!(o&&o.wt===k)};
function wtOk(k){const w=curGear().staff&&curGear().staff.wt;
  switch(k){case'melee':return w==='sword'||w==='polearm';case'sword':return w==='sword';case'shield':return offIs('shield');
    case'polearm':return w==='polearm';case'bow':return w==='bow'||w==='xbow'}return true}
function clsWtMsg(s){if(wtOk(s.wt))return true;if(P.noMpT<=0){msg(`${s.n}: ${WT_NEED[s.wt]||'맞는 무기가 없습니다'}`,'#a39d8f');P.noMpT=1.5}return false}
const stv=k=>(P.st&&P.st[k])||0;
function physPower(){const w=mainWT();if(!w)return 2+P.lvl*.5;
  const wr=P.cls==='warrior',main=wr?stv('str')+.3*stv('dex'):stv('dex')+.3*stv('str');
  return(4+P.lvl*1.5+main+stat('str')*(wr?1:.3)+stat('dex')*(wr?.3:1)+stat('atk'))*w.mul}
function physScale(id,L){const s=SPELLS[id];
  const pct=Math.min(PSCALE.pctCap,stat('pdmg')/100+passSum('pdmg')+(s.el!=='phys'?stat('el_'+s.el)/100+passSum('elArrow'):0));
  return 1+PSCALE.perL*lvSteps(Math.max(1,L))+Math.min(PSCALE.synCap,PSCALE.syn*synergy(id))+pct+core21Dmg(id)+core21SweepDmg(id)}/* v21 빌드 핵심: 대상 스킬 피해 % (덧셈, builds21.js) */
const physBuffMul=()=>1+Math.min(PSCALE.buffCap[P.cls]||.5,buffSum('dmg'))-core21Pen();/* v21 시간의 길 −20% */
const iasMul=()=>1-Math.min(.4,stat('ias')/100+buffSum('ias'));
function atkIv(s){const w=mainWT();return Math.max(.2,(w?w.spd:.6)*(s.cd||1)*iasMul())}
const accRating=()=>stv('dex')+P.lvl+stat('acc')+buffSum('acc');
function hitChance(e){const t=TYPES[e.k]||{};let h=.8+(accRating()-(e.lvl||1)*2.5)*.003;
  if(t.mini)h-=.03;if(t.boss)h-=.05;if(e.stunT>0||e.freezeT>0||e.rootT>0)h+=.15;return clamp(h,.65,.97)}
const blkC=()=>offIs('shield')?Math.min(.5,((curGear().off.stats||{}).blk||0)/100+(stat('blk')-((P.gear.off&&P.gear.off.stats&&P.gear.off.stats.blk)||0))/100+buffSum('blk')):0;
const evaC=()=>Math.min(.25,stat('eva')/100+buffSum('eva'));
// 스킬 한 번의 위력: 스킬 레벨·시너지·% 피해는 더한 뒤 한 번만 곱하고, 강화만 따로(상한 50%)
function physPw(id,L,s){const m=s.mult||0;if(!m)return 0;let pw=physPower()*m*physBuffMul()*physScale(id,L);
  if(!GHOST){const cam=P.buffs.camouflage;if(cam&&cam.nextShot&&isDmg(s)){pw*=1+cam.nextShot;delete P.buffs.camouflage}
    const im=P.buffs.imbue;if(im&&im.imbue&&id==='quickshot'){pw*=1+im.imbue;const k=(P._imb=((P._imb|0)+1)%3);s.el=['fire','ice','storm'][k];if(k===0)s.burn=1;else if(k===1)s.slow=1;else s.arc=1}}
  return pw}
function canWear(it,cls){cls=cls||P.cls;if(!it)return true;const w=it.wt&&WT[it.wt];
  if(w)return w.cls.split(' ').includes(cls);
  if(it.slot==='staff'||it.slot==='robe')return !PHYS_CLS[cls];if(it.slot==='off')return false;return true}// 지팡이·로브는 마법사·사제 것
const gearSlots=()=>PHYS_CLS[P.cls]?['staff','off','robe','ring','amulet']:['staff','robe','ring','amulet'];
// 그림 쪽(ART)에서 쓰는 도우미: 영웅이 든 무기·보조 종류
function heroWeapon(h){const g=(h&&h.gear)||{};return{main:g.staff&&g.staff.wt||(PHYS_CLS[h&&h.cls]?null:'staff'),off:g.off&&g.off.wt||null}}

/* ===== 캐릭터: 새로 만들기 · 되돌리기 · 패시브 ===== */
{const _fp=freshPlayer;freshPlayer=function(cls){const p=_fp(cls),C=CLASSES[cls];p.gear.off=null;
  if(C&&C.st5)p.st={str:C.st5.str,dex:C.st5.dex,int:0,vit:C.st5.vit,spi:C.st5.spi};return p}}
function makeBaseV18(wt,il,cls,rar){il=clamp(Math.round(il),1,99);const W=WT[wt],slot=W.off?'off':W.body?'robe':'staff',stats={};
  for(const k of MAIN_V18[wt])stats[k]=rollStat(k,il,wt);
  return{id:uid++,slot,rar:rar||0,name:BASE_V18[wt][clamp(Math.floor(il/8),0,7)],il,stats,cls:cls||W.cls,wt}}
const STARTER={warrior:['sword','shield'],archer:['bow','quiver']};
{const _ng=newGame;newGame=function(cls,slot){const r=_ng(cls,slot);
  if(STARTER[cls]&&P.cls===cls){for(const wt of STARTER[cls]){const it=makeBaseV18(wt,1,cls);P.gear[it.slot]=it}P.hp=maxHp();P.mp=maxMp();save()}return r}}
{const _rs=respec;respec=function(){const C=CLASSES[P.cls];if(!C.st5)return _rs();
  P.ap+=(stv('str')-C.st5.str)+(stv('dex')-C.st5.dex);_rs();P.st.str=C.st5.str;P.st.dex=C.st5.dex;P.st.int=0}}
// 패시브: 무기가 필요한 패시브(검술 수련 등)는 그 무기를 들었을 때만 센다
passSum=function(k){if(passT===time&&passP===P)return passVal[k]||0;passT=time;passP=P;const ids=PASSIVES[P.cls]||[],g=P.gear||{};
  let key=P.cls+'|'+(g.staff&&g.staff.wt||'')+(g.off&&g.off.wt||'');for(const id of ids)key+=','+skLv(id);
  if(key!==passKey){passKey=key;passVal={};for(const id of ids){const L=skLv(id);if(L<=0)continue;const s0=SPELLS[id];if(s0.wt&&!wtOk(s0.wt))continue;const e=eff(id,L);for(const s in s0.pv)passVal[s]=(passVal[s]||0)+e[s]}}
  return passVal[k]||0};

/* ===== 장비: 굴림 · 만들기 · 점수 · 착용 ===== */
{const _rs=rollStat;rollStat=function(k,il,wt){const m=rnd(.75,1.2);let v;
  switch(k){case'str':case'dex':v=1+Math.round(il*.5*m);break;
    case'atk':v=Math.round((2+il*1.3*m)*(wt==='polearm'||wt==='xbow'?1.1:1));break;
    case'ias':v=Math.min(20,ri(5,10)+Math.floor(il/12));break;
    case'acc':v=ri(5,10)+Math.floor(il*.8);break;
    case'blk':v=wt==='shield'?Math.min(30,10+Math.floor(il/3)):ri(2,4);break;
    case'eva':v=Math.min(8,ri(2,4)+Math.floor(il/15));break;
    case'pdmg':v=ri(5,10)+Math.floor(il/5);break;
    case'dr':if(wt==='shield'||wt==='plate')v=Math.min(12,3+Math.floor(il/6));break}
  return v!=null?v:_rs(k,il)}}
const SCALE_V18=(k,wt)=>SCALE.has(k)||k==='atk'||(k==='blk'&&wt==='shield')||(k==='acc'&&wt==='quiver');
function fixedStatsV18(st,il,wt){const o={};for(const [k,f] of Object.entries(st))o[k]=SCALE_V18(k,wt)?(k==='regen'?Math.round(rollStat(k,il,wt)*f*10)/10:Math.round(rollStat(k,il,wt)*f)):f;return o}
function affixPoolV18(il,cls){const p=AFX_POOL_V18[cls].slice();
  const mine=Object.values(SPELLS).filter(s=>s.cls===cls&&s.rank<=rankOf(Math.max(1,il))+1);
  for(let i=0;i<4;i++)p.push('sk_'+pick(mine).id);
  const els=[...new Set(mine.filter(isDmg).map(s=>s.el).filter(e=>e!=='phys'))];if(els.length)p.push('el_'+pick(els));
  return p}
const wtFor=(slot,cls)=>slot==='staff'?(cls==='warrior'?(R()<.55?'sword':'polearm'):(R()<.6?'bow':'xbow')):slot==='off'?(cls==='warrior'?'shield':'quiver'):slot==='robe'?(cls==='warrior'?'plate':'leather'):undefined;
const uFits=(u,cls)=>u.cls===cls||(!u.cls&&(u.slot==='ring'||u.slot==='amulet')&&!('int' in u.st));
function makeItemV18(il,elite,cls,force){il=clamp(Math.round(il),1,Math.max(99,MAXLV));/* v20: 140까지 */const r=R();
  const kind=force||(r<.008+(elite?.03:0)?'uniq':r<.02+(elite?.07:0)?'set':null);
  if(kind==='boss'||kind==='uniq'){const u=pick((kind==='boss'?BOSSU:UNIQ).filter(x=>uFits(x,cls))),L=kind==='boss'?il+3:il;
    return{id:uid++,slot:u.slot,rar:kind==='boss'?5:4,name:u.n,il:L,stats:fixedStatsV18(u.st,L,u.wt),cls,lore:u.lore,wt:u.wt||(u.slot==='robe'||u.slot==='off'?undefined:undefined)}}
  if(kind==='set'){const sid=pick(Object.keys(SETS).filter(k=>SETS[k].cls===cls)),S=SETS[sid],slot=pick(Object.keys(S.p)),wt=(SET_WT[sid]||{})[slot],stats={};
    for(const mk of wt?MAIN_V18[wt]:[SLOT[slot].main]){const v=rollStat(mk,il,wt)*1.15;stats[mk]=mk==='regen'?Math.round(v*10)/10:Math.round(v)}stats[S.key]=1;
    const pool=affixPoolV18(il,cls).filter(k=>!(k in stats)&&!k.startsWith('sk_'));for(let i=0;i<2;i++){const k=pick(pool);stats[k]=Math.round(((stats[k]||0)+rollStat(k,il,wt))*10)/10}
    for(const k of ['cdr'])if(stats[k])stats[k]=Math.min(25,stats[k]);if(stats.ias)stats.ias=Math.min(20,stats.ias);
    return{id:uid++,slot,rar:3,name:S.p[slot],il,stats,cls,set:sid,wt}}
  const rar=r<.12+(elite?.18:0)?2:r<.42+(elite?.3:0)?1:0;
  const slot=pick(['staff','off','robe','ring','amulet']),wt=wtFor(slot,cls),stats={},mains=wt?MAIN_V18[wt]:[SLOT[slot].main];
  for(const k of mains)stats[k]=rollStat(k,il,wt);
  const pool=affixPoolV18(il,cls).filter(k=>!mains.includes(k));let n=rar===2?ri(2,3):RAR[rar].a;
  if(rar>=1&&il>=8&&R()<(rar===2?TREE_AFX.rare:TREE_AFX.magic)){const k='tr_'+ri(0,CLASSES[cls].trees.length-1);stats[k]=rollStat(k,il);n--}
  for(let i=0;i<n;i++){const k=pick(pool);stats[k]=Math.round(((stats[k]||0)+rollStat(k,il,wt))*10)/10;if(k==='cdr')stats[k]=Math.min(25,stats[k]);if(k==='ias')stats[k]=Math.min(20,stats[k])}
  let name=wt?BASE_V18[wt][clamp(Math.floor(il/8),0,7)]:SLOT[slot].base[clamp(Math.floor(il/8),0,7)];
  if(rar===1||rar===2)name=pick(PREF)+' '+name;
  return{id:uid++,slot,rar,name,il,stats,cls,wt}}
// 상점 물건은 직업마다 따로 (같은 레벨로 다른 직업 캐릭터를 불러와도 그 직업의 물건으로 다시 채운다)
{const _ss=shopStock;shopStock=function(t,type){let st=_ss(t,type);if(st&&st.cls!==undefined&&st.cls!==P.cls){st.lvl=-1;st=_ss(t,type)}if(st)st.cls=P.cls;return st}}
{const _mi=makeItem;makeItem=function(il,elite,cls,force){cls=cls||P.cls;return PHYS_CLS[cls]?makeItemV18(il,elite,cls,force):_mi(il,elite,cls,force)}}
{const _is=itemScore;itemScore=function(it){if(it&&!canWear(it))return 0;let v=_is(it);if(it)for(const k in it.stats)if(SCORE_V18[k])v+=it.stats[k]*(SCORE_V18[k]-1);return v}}
{const _ir=itemRow;itemRow=function(it,btns){const ok=canWear(it);
  if(!ok)btns=btns.replace(/<button type="button" data-equip="\d+">착용<\/button>/,'<button type="button" disabled title="이 직업은 쓸 수 없는 장비입니다">착용 불가</button>');
  let h=_ir(it,btns);if(it.wt&&WT[it.wt])h=h.replace(`${RAR[it.rar].n} ${SLOT[it.slot].n} ·`,`${RAR[it.rar].n} ${WT[it.wt].n} ·`);
  if(!ok)h=h.replace(/<div class="cmp"[^>]*>.*?<\/span><\/div>/,`<div class="cmp" style="color:#ff8a7a">${CLASSES[P.cls].n}은(는) 착용할 수 없습니다${it.wt&&WT[it.wt]?` (${WT[it.wt].n} · ${WT[it.wt].cls.split(' ').map(c=>CLASSES[c]?CLASSES[c].n:c).join('·')} 전용)`:it.slot==='staff'?' (지팡이 · 마법사·사제 전용)':it.slot==='robe'?' (로브 · 마법사·사제 전용)':''}</div>`);
  return h}}
// 착용 단추: 직업에 맞지 않으면 막고, 두 손 무기(창·활)와 방패는 함께 들 수 없다
{const pb=document.getElementById('pbody');if(pb)pb.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button[data-equip]');if(!b||b.disabled)return;
  const it=P.bag.find(x=>x.id===+b.dataset.equip);if(!it)return;const stop=()=>{e.stopImmediatePropagation();e.preventDefault()};
  if(!canWear(it)){stop();msg(`${it.name}: ${CLASSES[P.cls].n}은(는) 착용할 수 없습니다`,'#a39d8f');return}
  const two=it.slot==='staff'&&it.wt&&WT[it.wt].hand===2;
  if(two&&P.gear.off&&P.gear.off.wt==='shield'){const after=P.bag.length-1+(P.gear.staff?1:0)+1;if(after>BAG_MAX){stop();msg('가방이 가득 차서 방패를 벗을 수 없습니다','#a39d8f');return}
    P.bag.push(P.gear.off);P.gear.off=null;msg('두 손 무기를 들어 방패를 가방에 넣었습니다','#a39d8f')}
  if(it.wt==='shield'&&P.gear.staff&&P.gear.staff.wt&&WT[P.gear.staff.wt].hand===2){stop();msg('창·폴암을 든 채로는 방패를 쓸 수 없습니다','#a39d8f')}},true)}

/* ===== 아이템 아이콘: 무기 종류마다 키 'b/<종류>/<단계>' (그림은 ART가 IPAINT[종류]·IBASE[종류]로 덮어쓴다) ===== */
const V18_UN=new Set(UNIQ_V18.concat(BOSSU_V18).map(u=>u.n));
function baseIxV18(it){const arr=BASE_V18[it.wt],nm=String(it.name||'');let best=-1,bl=0;arr.forEach((b,i)=>{if(nm.endsWith(b)&&b.length>bl){best=i;bl=b.length}});
  return best>=0?best:clamp(Math.floor((it.il||1)/8),0,7)}
const strHash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967296};
const PH_MAT=['#8a7a68','#b8bcc8','#c9a46a','#7ab0c8','#d8dce8','#e0d4b0','#6a7aa8','#e8c050'];
// 자리 채움 설계(ph:1): ART가 같은 이름으로 진짜 설계를 넣으면 그것을 쓴다
for(const u of UNIQ_V18.concat(BOSSU_V18))if(!IUNQ[u.n]){const h=strHash(u.n);IUNQ[u.n]={ph:1,wt:u.wt||u.slot,body:`hsl(${(h*360)|0},45%,52%)`,gem:`hsl(${((h*360)|0+150)%360},80%,62%)`,glow:`hsl(${((h*360)|0+150)%360},80%,62%)`,u:1}}
for(const sid in SETS_V18){ISET[sid]=ISET[sid]||{};for(const sl in SETS_V18[sid].p)if(!ISET[sid][sl]){const h=strHash(sid+sl);ISET[sid][sl]={ph:1,wt:(SET_WT[sid]||{})[sl]||sl,body:'#3e7a3e',gem:`hsl(${(h*360)|0},70%,60%)`,glow:'#5ee06a',set:1}}}
{const _k=itemIconKey;itemIconKey=function(it){if(it&&it.wt&&BASE_V18[it.wt]&&!(it.rar>=4&&IUNQ[it.name])&&!(it.set&&ISET[it.set]&&ISET[it.set][it.slot]))return 'b/'+it.wt+'/'+baseIxV18(it);return _k(it)}}
{const _sp=iconSpec;iconSpec=function(key){const [t,a,b]=key.split('/');
  if(t==='b'&&BASE_V18[a]){const i=clamp(+b|0,0,7);if(IPAINT[a]&&IBASE[a])return{paint:a,o:IBASE[a][clamp(i,0,IBASE[a].length-1)]};return{paint:'v18ph',o:{wt:a,i,body:a==='leather'||a==='quiver'?`hsl(${24+i*4},${40+i*3}%,${26+i*5}%)`:PH_MAT[i],gem:`hsl(${(i*45+((strHash(a)*360)|0))%360},75%,60%)`,glow:PH_MAT[i]}}}
  if(t==='u'&&V18_UN.has(a)){const o=IUNQ[a],u=UNIQ_V18.concat(BOSSU_V18).find(x=>x.n===a),k=u.wt||u.slot;if(o&&!o.ph&&IPAINT[k])return{paint:k,o};return{paint:'v18ph',o:Object.assign({i:3},o,{wt:k})}}
  if(t==='s'&&SETS_V18[a]){const o=ISET[a]&&ISET[a][b],k=(SET_WT[a]||{})[b]||b;if(o&&!o.ph&&IPAINT[k])return{paint:k,o};return{paint:'v18ph',o:Object.assign({i:2},o,{wt:k})}}
  return _sp(key)}}
{const _ak=allIconKeys;allIconKeys=function(){const ks=_ak();for(const wt in BASE_V18)for(let i=0;i<8;i++)ks.push('b/'+wt+'/'+i);return ks}}
// 임시 그림: 무기 종류마다 알아볼 수 있는 실루엣 (64×64 좌표)
IPAINT.v18ph=(g,o)=>{const c=o.body||'#b8bcc8',gem=o.gem||'#ffd76a',lw={lineW:.9},k=o.wt;
  const S=(f,x0,y0,x1,y1,col,op)=>Kit.solid(g,f,x0,y0,x1,y1,col,Object.assign({},lw,op||{}));
  if(k==='sword'){S(q=>{q.moveTo(46,10);q.lineTo(52,12);q.lineTo(24,42);q.lineTo(20,40);q.closePath()},20,10,52,42,c);S(q=>{q.moveTo(14,36);q.lineTo(30,52);q.lineTo(33,49);q.lineTo(17,33);q.closePath()},14,33,33,52,'#7a5a2a');S(q=>{q.moveTo(19,43);q.lineTo(12,50);q.lineTo(15,53);q.lineTo(22,46);q.closePath()},12,43,22,53,'#4a3020');IIK.gem(g,24,42,3.5,gem)}
  else if(k==='polearm'){S(q=>{q.moveTo(10,54);q.lineTo(13,57);q.lineTo(46,22);q.lineTo(43,19);q.closePath()},10,19,46,57,'#6a4a2c');S(q=>{q.moveTo(42,18);q.lineTo(56,6);q.lineTo(50,22);q.lineTo(46,22);q.closePath()},42,6,56,22,c);S(q=>{q.moveTo(38,18);q.lineTo(44,12);q.lineTo(50,24);q.lineTo(44,26);q.closePath()},38,12,50,26,c);IIK.gem(g,45,21,2.6,gem)}
  else if(k==='bow'||k==='xbow'){if(k==='xbow'){S(q=>{q.moveTo(14,48);q.lineTo(18,52);q.lineTo(46,24);q.lineTo(42,20);q.closePath()},14,20,46,52,'#6a4a2c')}
    g.strokeStyle=c;g.lineWidth=k==='xbow'?5:4.5;g.lineCap='round';g.beginPath();k==='xbow'?g.arc(40,24,18,2.2,5.6):g.arc(18,46,36,-1.45,-.12);g.stroke();
    g.strokeStyle='rgba(240,230,210,.9)';g.lineWidth=1;g.beginPath();k==='xbow'?(g.moveTo(40+18*Math.cos(2.2),24+18*Math.sin(2.2)),g.lineTo(40+18*Math.cos(5.6),24+18*Math.sin(5.6))):(g.moveTo(18+36*Math.cos(-1.45),46+36*Math.sin(-1.45)),g.lineTo(18+36*Math.cos(-.12),46+36*Math.sin(-.12)));g.stroke();IIK.gem(g,k==='xbow'?30:44,k==='xbow'?34:22,3,gem)}
  else if(k==='shield'){S(q=>{q.moveTo(32,8);q.lineTo(52,14);q.lineTo(50,36);q.quadraticCurveTo(44,50,32,57);q.quadraticCurveTo(20,50,14,36);q.lineTo(12,14);q.closePath()},12,8,52,57,c,{rim:'rgba(255,240,210,.6)'});IIK.gem(g,32,30,5.5,gem)}
  else if(k==='quiver'){S(q=>{q.moveTo(22,20);q.lineTo(38,16);q.lineTo(46,52);q.lineTo(30,56);q.closePath()},22,16,46,56,c,{tex:'leather'});g.strokeStyle='#e8e0cc';g.lineWidth=1.6;for(let i=0;i<3;i++){g.beginPath();g.moveTo(26+i*5,19-i);g.lineTo(23+i*5,6+i*2);g.stroke()}IIK.gem(g,35,36,3.2,gem)}
  else if(k==='plate'||k==='leather'||k==='robe'){S(q=>{q.moveTo(18,12);q.lineTo(26,10);q.quadraticCurveTo(32,16,38,10);q.lineTo(46,12);q.lineTo(52,24);q.lineTo(46,28);q.lineTo(46,54);q.lineTo(18,54);q.lineTo(18,28);q.lineTo(12,24);q.closePath()},12,10,52,54,c,k==='leather'?{tex:'leather'}:{rim:'rgba(255,255,255,.5)'});IIK.gem(g,32,30,4,gem)}
  else{g.strokeStyle=c;g.lineWidth=2.5;g.beginPath();g.arc(32,22,12,.3,2.84);g.stroke();IIK.glow(g,32,40,12,o.glow||gem,.6);IIK.gem(g,32,40,6,gem,'tear')}
  if(o.u||o.set)IIK.glow(g,32,32,26,o.glow||gem,.25)};

/* ===== 전투: 새 종류 (melee · leap · charge · trap · intervene) ===== */
['melee','leap','charge','trap'].forEach(k=>AIMED.add(k));
let traps=[],swings=[],clsLater=[];
const LUNGE=70,TRAP_RANGE=380;
// 물리 효과 그림 자리 (ART가 함수를 바꿔 끼운다). 여기서는 가벼운 임시 효과만
const PFX={
  cast(h,s){if(typeof heroAtk==='function')heroAtk(h,clsAnim(h,s),s.kind==='melee'||s.kind==='bolt'?.3:.45)},
  swing(h,x,y,a,arc,reach,s){if(swings.length>24)swings.shift();swings.push({x,y,a,arc,reach,t:.2,max:.2,col:EL[s.el]||EL.phys,big:s.rank>=5})},
  hit(e,s){burst(e.x,e.y,'#f4efe2',5,150,2.2,16)},
  leap(h,ox,oy,x,y,s){rings.push({x,y,r:8,max:s.rad||90,life:.4,col:'#c9b48a'});for(let i=0;i<14;i++){const a=R()*6.283;parts.push({x:x+Math.cos(a)*12,y:y+Math.sin(a)*12,z:2,vx:Math.cos(a)*110,vy:Math.sin(a)*110,vz:rnd(60,140),g:1,life:.6,max:.6,col:'#8a7350',sz:rnd(2,4)})}},
  charge(h,ox,oy,x,y,s){const n=10;for(let i=0;i<n;i++){const f=i/n;parts.push({x:ox+(x-ox)*f,y:oy+(y-oy)*f,z:6,vx:rnd(-20,20),vy:rnd(-20,20),vz:rnd(20,60),life:.45,max:.45,col:'#c9b48a',sz:3})}},
  trap(tr,ev){if(ev==='boom'){rings.push({x:tr.x,y:tr.y,r:6,max:tr.s.rad,life:.4,col:EL[tr.s.el]||EL.phys});burst(tr.x,tr.y,EL[tr.s.el]||'#c9b48a',24,tr.s.rad*1.6,3.5,6)}},
  block(h,src){rings.push({x:h.x,y:h.y,r:6,max:34,life:.25,col:'#e8e4d8'})},
  evade(h){},
};
// 영웅 몸짓 이름 (hero18.js heroAtk): 휘두르기·찌르기·휩쓸기·내려찍기·방패치기·외침·놓기
function clsAnim(h,s){const g=(h&&h.gear)||{},wt=g.staff&&g.staff.wt;if(h&&h.cls==='archer')return s.kind==='buff'||s.kind==='summon'||s.kind==='ward'?'shout':'release';
  switch(s.kind){case'melee':return (s.ang||1)>=1.6?'sweep':wt==='polearm'?'thrust':s.wt==='shield'?'bash':'swing';case'leap':case'nova':return 'slam';case'charge':return 'bash';case'channel':return 'spin';
    case'buff':case'ward':case'field':case'intervene':return 'shout'}return 'swing'}
function landAt(ox,oy,x,y){for(let k=0;k<=20;k++){const f=1-k/20,px=ox+(x-ox)*f,py=oy+(y-oy)*f;if(DG?dgFree(px,py,P.r):!blockedAt(px,py))return{x:px,y:py}}return{x:ox,y:oy}}
function stepP(dx,dy,n){n=n||4;for(let i=0;i<n;i++)moveBody(P,dx/n,dy/n);P.x=clamp(P.x,20,WORLD-20);P.y=clamp(P.y,20,WORLD-20)}
const meleeReach=s=>{const w=mainWT();return(w&&w.reach||60)*(s.range||1)};
function clsAim(s,t){if(!PHYS_CLS[s.cls]||GHOST||!t)return t;
  if(s.back&&s.kind==='blink'){const d=Math.hypot(t.x-P.x,t.y-P.y)||1;return{x:P.x-(t.x-P.x)/d*s.range,y:P.y-(t.y-P.y)/d*s.range}}
  if(s.near&&s.kind==='strike')return clampRange(t,s.near);return t}
function clsKind(s,id,L,t,pw,c,CM){switch(s.kind){
  case'melee':{const w=mainWT(),reach=meleeReach(s),arc=(s.ang||1)*(w&&w.arc||1),mx=s.max||1;
    // 겨눈 적이 사거리 바로 밖이면 한 걸음 내디딘다
    if(!GHOST&&!CM){const tg=nearestEnemy(t,70);if(tg){const d=dist(tg,P)-tg.r;if(d>reach*.85&&d<reach+LUNGE){const a=Math.atan2(tg.y-P.y,tg.x-P.x);stepP(Math.cos(a)*Math.min(LUNGE,d-reach*.7),Math.sin(a)*Math.min(LUNGE,d-reach*.7));P.face=a}}}
    const a=P.face,hit=[];
    for(const e of enemies){if(e.dead)continue;const d=dist(e,P),hr=hR(e);if(d<reach+hr&&angDiff(Math.atan2(e.y-P.y,e.x-P.x),a)<arc/2+Math.atan2(hr,Math.max(1,d)))hit.push([d,e])}
    hit.sort((x,y)=>x[0]-y[0]);PFX.swing(GHOST||P,P.x,P.y,a,arc,reach,s);
    for(const [,e] of hit.slice(0,mx)){const m=s.exec&&e.hp/e.max<s.exec.hp?s.exec.mul:1;hurtE(e,pw*m*rnd(.9,1.1),s);applyFx(e,s,P);PFX.hit(e,s)}
    if(hit.length)shake=Math.max(shake,s.rank>=5?3:1.5);
    const ob=!GHOST&&P.buffs.oathblade;if(ob&&ob.wave&&s.id!=='oathwave'){const sw=Object.assign({},s,{id:'oathwave',mhit:0,pierce:1,kind:'bolt'}),sp=620;
      projs.push({x:P.x+Math.cos(a)*20,y:P.y+Math.sin(a)*20,z:18,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:12,dmg:physPower()*physBuffMul()*ob.wave,owner:'p',s:sw,life:.55,col:EL.phys,hit:new Set()})}
    break}
  case'leap':{const ox=P.x,oy=P.y,lt=clampRange(t,s.range),p=landAt(ox,oy,lt.x,lt.y);P.x=clamp(p.x,20,WORLD-20);P.y=clamp(p.y,20,WORLD-20);if(!GHOST){P.invT=Math.max(P.invT,.25);followCam(.05)}
    PFX.leap(GHOST||P,ox,oy,P.x,P.y,s);decal(P.x,P.y,s.rad*.5,'earth');
    for(const e of enemies)if(!e.dead&&dist(e,P)<s.rad+hR(e)){hurtE(e,pw*rnd(.9,1.1),s);applyFx(e,s,P)}shake=Math.max(shake,4);break}
  case'charge':{const a=P.face,ox=P.x,oy=P.y;let x=ox,y=oy;
    if(GHOST){x=ox+Math.cos(a)*s.dist;y=oy+Math.sin(a)*s.dist}else{const n=13;for(let i=0;i<n;i++){const px=P.x,py=P.y;moveBody(P,Math.cos(a)*s.dist/n,Math.sin(a)*s.dist/n);if(Math.hypot(P.x-px,P.y-py)<1)break}
      P.x=clamp(P.x,20,WORLD-20);P.y=clamp(P.y,20,WORLD-20);x=P.x;y=P.y;P.invT=Math.max(P.invT,.3)}
    PFX.charge(GHOST||P,ox,oy,x,y,s);
    for(const e of enemies)if(!e.dead&&segDist(e.x,e.y,ox,oy,x,y)<(s.w||40)+hR(e)){hurtE(e,pw*rnd(.9,1.1),s);applyFx(e,s,{x:e.x-Math.cos(a)*10,y:e.y-Math.sin(a)*10})}shake=Math.max(shake,3);break}
  case'trap':{const p=clampRange(t,TRAP_RANGE),n=s.cnt>1?s.cnt:1,own=GHOST?GHOST.id:0,pts=[];
    // 덫밭: 하나는 겨눈 자리, 나머지는 둘레에 고르게
    if(n>1){pts.push(p);for(let k=1;k<n;k++){const an=k/(n-1)*6.283+.4;pts.push(landAt(p.x,p.y,p.x+Math.cos(an)*(s.ring||150),p.y+Math.sin(an)*(s.ring||150)))}}else pts.push(p);
    const mine=traps.filter(q=>q.id===id&&q.own===own);let over=mine.length+pts.length-(s.maxN||2);for(const q of mine){if(over--<=0)break;q.life=0}
    pts.forEach((q,k)=>{const ss=n>1?Object.assign({},s,k%2?{burn:1,el:'fire'}:{knock:100}):s;traps.push({x:q.x,y:q.y,s:ss,id,own,dmg:pw,arm:s.arm||.6,life:s.life||30,age:0})});
    traps=traps.filter(q=>q.life>0);rings.push({x:p.x,y:p.y,r:4,max:30,life:.3,col:EL[s.el]||EL.phys});break}
  case'intervene':{if(GHOST)break;const cand=NET.on?[...NET.peers.values()].filter(r=>!r.dead&&netSame(r)&&dist(r,P)<=s.range):[];
    if(!cand.length){P.mp+=c;P.cd[id]=0;msg(NET.on?'가까이에 이을 동료가 없습니다':`${s.n}: 같이 하기에서 동료와 이어 씁니다`,'#a39d8f');break}
    let r=cand[0];if(t)for(const o of cand)if(dist(o,t)<dist(r,t))r=o;
    P.lnkOut={id:r.id,t:s.dur,max:s.dur,share:s.share};netSend({t:'lnk',to:r.id,sh:s.share,d:s.dur});msg(`${s.n}: ${r.name||'동료'}님이 받는 피해의 ${Math.round(s.share*100)}%를 대신 받습니다`,EL.phys);break}
  }}
// 시전 뒤: 연속 타격(hits) · 소환 동료 강화 · 삼원소 · 석궁 꿰뚫기 · 가호 도발
function clsAfter(s,id,L,t,pw,CM){
  if(!CM&&!GHOST&&s.hits>1&&t)for(let i=1;i<s.hits;i++)clsLater.push({at:time+i*(s.hitIv||.12),id,t:{x:t.x,y:t.y},P});
  if(GHOST)return;
  if(s.kind==='ward'&&s.taunt&&!HAS_PTY)for(const e of enemies)if(!e.dead&&dist(e,P)<260)clsFx(e,{taunt:s.taunt},P,P);
  if(s.kind==='summon')for(const a of allies)if(a.s&&a.s.id===id&&!a.v18){a.v18=1;a.dmg*=1+passSum('petDmg');a.max=a.hp=Math.round(a.hp*(1+passSum('petHp')));if(s.form==='falcon')a.r=12}
  if(s.kind==='bolt'){let k=0;const w=mainWT();
    for(let i=projs.length-1;i>=0&&i>=projs.length-12;i--){const p=projs[i];if(p.s!==s)continue;
      if(s.tri){const el=['fire','ice','storm'][k++%3];p.s=Object.assign({},s,{el,tri:0,burn:el==='fire'?1:0,freeze:el==='ice'?1:0,arc:el==='storm'?2:0});p.col=EL[el]}
      if(id==='quickshot'&&w&&w.pierce&&!s.pierce){p.hit=new Set();p.pmax=1+w.pierce}}}}
// 몸짓·외침: 물리 기술은 마법진 대신 자세와 외침(대사)만
{const _cf=castFx;castFx=function(s){if(!PHYS_CLS[s.cls])return _cf(s);
  FXB.other(s);heroCast(GHOST||P,s.el);PFX.cast(GHOST||P,s);
  if(s.chant&&(s.cd>=.8||time-lastChant>2.5)){texts.push({x:P.x,y:P.y,z:70,t:'「'+s.chant+'」',c:'#f4ead2',life:1.15,chant:true});lastChant=time}
  if(s.rank>=6&&!GHOST){banner={t:s.n,sub:`${s.kn!==s.n?s.kn+' · ':''}스킬 레벨 ${s.L}${s.chant?' · '+s.chant:''}`,col:EL[s.el]||EL.phys,life:1.7,max:1.7}}}}
// 강화: 새 칸(막기·공격 속도·명중 …)을 같이 담고, 같은 무리(excl)의 방어 강화는 하나만
const BUFF_X=['blk','counter','ias','acc','threat','healUp','imbue','stealth','nextShot','markDmg','wave','eva'];
{const _sf=supFx;supFx=function(s,id,pwr,from){
  if(s.kind==='buff'&&s.excl&&PHYS_CLS[s.cls])for(const k in P.buffs)if(k!==id&&SPELLS[k]&&SPELLS[k].excl===s.excl){delete P.buffs[k];P.hp=Math.min(P.hp,maxHp())}
  const r=_sf(s,id,pwr,from);
  if(s.kind==='buff'&&PHYS_CLS[s.cls]&&P.buffs[id]){for(const k of BUFF_X)if(s[k])P.buffs[id][k]=s[k];
    if(s.stealth&&!from)for(const e of enemies)e.aggroed=false}
  return r}}
// 적중: 명중 판정(물리) · 표식 · 치명타 보너스 · 생명력 흡수 · 마나 회복(mhit) · 번개 튐
{const _he=hurtE;hurtE=function(e,amt,s){
  if(!e||e.dead||!s||s.ghost)return _he(e,amt,s);
  const pc=PHYS_CLS[s.cls];
  if(pc&&s.phys&&!s.proc&&R()>hitChance(e)){e._miss=s;ftext(e.x,e.y,'빗나감','#a39d8f',false,e.r*2+16);return}
  let m=1;if(!NET.guest&&e.markT>0)m+=e.markAmp||0;
  if(pc){const md=buffSum('markDmg'),t=TYPES[e.k]||{};if(md>0&&(e.markT>0||t.boss||t.mini)){const bd=Math.min(.5,buffSum('dmg'));m*=(1+Math.min(.5,bd+md))/(1+bd)}}
  let cb=0;if(pc){if(s.critB)cb+=s.critB;if(s.markCrit&&e.markT>0)cb+=s.markCrit}
  if(cb)P.buffs._cb={t:1,max:1,crit:cb,n:''};
  try{_he(e,amt*m,s)}finally{if(cb)delete P.buffs._cb}
  if(pc&&!P.dead){const ls=s.phys?passSum('ls'):0;if(ls>0)P.hp=Math.min(maxHp(),P.hp+amt*m*ls/100);
    if(s.mhit&&!s._mh){s._mh=1;P.mp=Math.min(maxMp(),P.mp+s.mhit)}
    if(s.arc&&!s.arcKid){const hit=new Set([e]);let from={x:e.x,y:e.y,z:16};for(let i=0;i<s.arc;i++){const o=nearestEnemy(e,220,hit);if(!o)break;hit.add(o);
      zap(from,{x:o.x,y:o.y,z:16},Object.assign({life:.22},stormStyle(3)));_he(o,amt*m*.5,Object.assign({},s,{arc:0,arcKid:1,phys:0,mhit:0}));from={x:o.x,y:o.y,z:16}}}}}}
// 상태 효과: 도발 · 약화 · 표식 · 묶기 · 끌어당기기 (빗나간 적에게는 아무것도 걸리지 않는다)
{const _af=applyFx;applyFx=function(e,s,from){if(e&&s&&e._miss===s){e._miss=null;return}_af(e,s,from);
  if(!e||e.dead||!s||s.ghost||!(s.taunt||s.weaken||s.mark||s.root||s.pull))return;
  if(NET.guest&&e.id)netSend({t:'fx2',to:NET.hostId,id:e.id,ta:s.taunt||0,wk:s.weaken?[s.weaken.dmg,s.weaken.dur]:0,mk:s.mark?[s.mark.amp,s.mark.dur]:0,rt:s.root||0,pl:s.pull&&from?[Math.round(from.x),Math.round(from.y)]:0});
  clsFx(e,s,from,P)}}
// 도발: 위협 표(party18.js PTY)가 있으면 그쪽이 맡는다(applyFx·supFx를 PTY가 감쌈). 사냥 동료(늑대)의 붙잡기만 여기서
const HAS_PTY=typeof PTY==='object'&&!!PTY&&typeof PTY.taunt==='function';
function clsFx(e,s,from,by){const t=TYPES[e.k]||{},big=t.boss||t.mini;
  if(s.taunt&&(!HAS_PTY||(by&&by.ally))){e.tauntT=Math.max(e.tauntT||0,s.taunt);e.tauntBy=by||P;e.aggroed=true}
  if(s.weaken){const w=s.weaken;if(!(e.weakT>0)){e.dmg0=e.dmg;e.weakD=w.dmg;e.dmg=e.dmg*(1-w.dmg)}e.weakT=Math.max(e.weakT||0,w.dur)}
  if(s.mark){const mk=s.mark;if(!(e.markT>0)||mk.amp>=(e.markAmp||0))e.markAmp=mk.amp;e.markT=Math.max(e.markT||0,mk.dur)}
  if(s.root)e.rootT=Math.max(e.rootT||0,big?Math.min(1.5,s.root):s.root);
  if(s.pull&&from){const d=dist(e,from),want=13+e.r+14;if(d>want){const k=(big?.25:1)*(d-want),ux=(from.x-e.x)/d,uy=(from.y-e.y)/d;for(let i=0;i<6;i++)moveBody(e,ux*k/6,uy*k/6)}}}
// 맞을 때: 회피(궁수) · 막기(방패) · 받아치기 · 대신 맞기(이어진 동료에게 나눔)
let RIPOSTE_S=null;
{const _hp=hitPlayer;hitPlayer=function(d,src,o){
  if(P.dead||P.invT>0)return _hp(d,src);
  if(PHYS_CLS[P.cls]){const t=src&&TYPES[src.k],big=t&&t.boss&&((src.dash||0)>0||(src.cast||0)>0);
    if(!big&&R()<evaC()){ftext(P.x,P.y,'피함','#bfeedd');PFX.evade(P);return}
    if(R()<blkC()){d*=.4;ftext(P.x,P.y,'막음','#e8e4d8');PFX.block(P,src);if(typeof PTY==='object'&&PTY.block)PTY.block(src);core21OnBlock();/* v21 굳은 맹세 */const rp=P.buffs.riposte;
      if(rp&&rp.counter&&src&&!src.dead&&src.hp!=null&&TYPES[src.k]){RIPOSTE_S=RIPOSTE_S||Object.assign({},SPELLS.riposte,{phys:0,mult:1});hurtE(src,physPower()*rp.counter*physBuffMul(),RIPOSTE_S)}}}
  if(P.lnkIn&&P.lnkIn.t>0&&NET.on&&!(o&&o.lnk)){const part=Math.round(d*P.lnkIn.share);if(part>0){d-=part;netSend({t:'lnkd',to:P.lnkIn.from,d:part})}}
  return _hp(d,src)}}
{const _hl=healP;healP=function(n){const u=buffSum('healUp');return _hl(u>0?n*(1+Math.min(.5,u)):n)}}
// 노리는 대상: 도발한 사람 · 숨은 사람은 놓친다
const stealthOn=()=>!!(P.buffs&&P.buffs.camouflage&&P.buffs.camouflage.stealth);
{const _et=enemyTarget;enemyTarget=function(e){
  if(e.tauntT>0&&e.tauntBy){const b=e.tauntBy,ok=b===P?!P.dead&&!stealthOn():b.remote?(!b.dead&&netSame(b)&&NET.peers.get(b.id)===b):b.ally?allies.includes(b):false;if(ok)return{tg:b,d:dist(e,b)}}
  const r=_et(e);if(r.tg!==P||!stealthOn())return r;
  let tg=null,bd=1e9;if(NET.host)for(const q of NET.peers.values()){if(q.dead||!netSame(q))continue;const d=dist(e,q);if(d<bd){bd=d;tg=q}}for(const a of allies){const d=dist(e,a);if(d<bd){bd=d;tg=a}}
  return tg?{tg,d:bd}:{tg:P,d:1e9}}}
{const _cr=castReady;castReady=function(id,ch){const s=SPELLS[id];if(s&&s.wt&&!GHOST&&!wtOk(s.wt))return false;return _cr(id,ch)}}
// 매 프레임: 상태 시간 · 덫 · 연속 타격 · 깃발 · 이어짐
{const _u=update;update=function(dt){const pins=[];for(const e of enemies)if(e.rootT>0&&!e.dead)pins.push(e,e.x,e.y);
  _u(dt);
  for(let i=0;i<pins.length;i+=3){const e=pins[i];if(!e.dead&&e.rootT>0){e.x=pins[i+1];e.y=pins[i+2]}}
  clsTick(dt)}}
function clsTick(dt){
  for(const e of enemies){if(e.tauntT>0)e.tauntT-=dt;if(e.markT>0)e.markT-=dt;if(e.rootT>0)e.rootT-=dt;
    if(e.weakT>0){e.weakT-=dt;if(e.weakT<=0&&e.dmg0!=null){e.dmg=e.dmg0;e.dmg0=null}}}
  if(traps.length){for(const q of traps){q.age+=dt;q.life-=dt;if(q.age<q.arm||q.life<=0)continue;const tr=Math.max(30,q.s.rad*.45);
      if(enemies.some(e=>!e.dead&&dist(e,q)<tr+hR(e))){q.life=0;PFX.trap(q,'boom');for(const e of enemies)if(!e.dead&&dist(e,q)<q.s.rad+hR(e)){hurtE(e,q.dmg*rnd(.9,1.1),q.s);applyFx(e,q.s,q)}shake=Math.max(shake,3)}}
    traps=traps.filter(q=>q.life>0)}
  if(clsLater.length){const due=clsLater.filter(o=>o.at<=time);clsLater=clsLater.filter(o=>o.at>time&&o.P===P);
    for(const o of due){if(o.P!==P||P.dead)continue;CAST_MOD={free:1,tick:1,mul:1,share:1};try{tryCast(o.id,o.t)}finally{CAST_MOD=null}}}
  for(const w of swings)w.t-=dt;if(swings.length)swings=swings.filter(w=>w.t>0);
  if(P.lnkOut){P.lnkOut.t-=dt;if(P.lnkOut.t<=0)P.lnkOut=null}if(P.lnkIn){P.lnkIn.t-=dt;if(P.lnkIn.t<=0)P.lnkIn=null}
  if(!P.dead)for(const f of fields)if(f.s.ally&&dist(P,f)<f.rad)P.buffs['_f_'+f.s.id]={t:.7,max:.7,dmg:f.s.ally.dmg||0,ias:f.s.ally.ias||0,n:f.s.n};
  for(const a of allies)if(a.s&&a.s.form==='wolf'&&a.s.taunt)for(const e of enemies)if(!e.dead&&dist(e,a)<a.r+e.r+30){e.tauntT=Math.max(e.tauntT||0,.6);e.tauntBy=a}
  for(const p of projs)if(p.pmax&&p.hit&&p.hit.size>=p.pmax)p.life=0}
// 그리기 (castDraw: 빛나는 효과 단계, 월드 좌표): 덫 · 휘두르기 · 표식 · 이어진 줄
{const _cd=castDraw;castDraw=function(){_cd();clsDraw()}}
// 전사·궁수가 외우거나 이어 쓸 때는 마법진(근원어 문양) 대신 진행 고리만 (castDraw가 그 둘레에 고리를 따로 그린다)
{const _cg=castGlyphAt;castGlyphAt=function(x,y,col,r,k,spin){if(x===P.x&&y===P.y&&PHYS_CLS[P.cls])return;if(NET.on)for(const q of NET.peers.values())if(q.x===x&&q.y===y&&PHYS_CLS[q.cls]){ctx.globalAlpha=.6;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r*.9,-1.571,-1.571+6.283*k);ctx.stroke();ctx.globalAlpha=1;return}return _cg(x,y,col,r,k,spin)}}
function clsDraw(){const pa=ctx.globalAlpha;
  for(const q of traps){const on=q.age>=q.arm,col=EL[q.s.el]||EL.phys,r=Math.max(16,Math.min(34,q.s.rad*.3));ctx.globalAlpha=on?.55+.25*Math.sin(time*6+q.x):.3;ctx.strokeStyle=col;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(q.x,q.y,r,0,6.283);ctx.stroke();ctx.beginPath();for(let i=0;i<6;i++){const a=i*1.047+time*.6;ctx.moveTo(q.x+Math.cos(a)*r*.45,q.y+Math.sin(a)*r*.45);ctx.lineTo(q.x+Math.cos(a)*r,q.y+Math.sin(a)*r)}ctx.stroke()}
  for(const w of swings){const k=w.t/w.max;ctx.globalAlpha=.75*k;ctx.strokeStyle=w.col;ctx.lineWidth=w.big?7:5;ctx.beginPath();ctx.arc(w.x,w.y,w.reach*(.75+.25*(1-k)),w.a-w.arc/2,w.a+w.arc/2);ctx.stroke();
    ctx.globalAlpha=.9*k;ctx.strokeStyle='#fff';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(w.x,w.y,w.reach*(.8+.2*(1-k)),w.a-w.arc/2*(1-k*.3),w.a+w.arc/2*(1-k*.3));ctx.stroke()}
  for(const e of enemies)if(e.markT>0&&!e.dead){ctx.globalAlpha=.7;ctx.strokeStyle='#ff9a4a';ctx.lineWidth=2;const r=e.r+10;ctx.beginPath();ctx.arc(e.x,e.y,r,0,6.283);ctx.moveTo(e.x-r-6,e.y);ctx.lineTo(e.x-r+4,e.y);ctx.moveTo(e.x+r-4,e.y);ctx.lineTo(e.x+r+6,e.y);ctx.stroke()}
  const tether=(a,b)=>{ctx.globalAlpha=.55;ctx.strokeStyle='#e8d8a8';ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([])};
  if(NET.on){if(P.lnkOut){const r=NET.peers.get(P.lnkOut.id);if(r&&netSame(r))tether(P,r)}for(const r of NET.peers.values())if(r.lk&&netSame(r)){const o=r.lk===NET.id?P:NET.peers.get(r.lk);if(o)tether(r,o)}}
  ctx.globalAlpha=pa}
// 사냥 동료 그림: 늑대는 몬스터 늑대 그림을 빌리고, 매는 가볍게 그린다
{const _da=drawAlly;drawAlly=function(a){const f=a.s&&a.s.form;if(f!=='wolf'&&f!=='falcon')return _da(a);const s=a._s;if(!onScreen(s,80))return;
  if(f==='wolf'){const pe=a.pe||(a.pe={k:'wolf',freezeT:0,stunT:0,slowT:0,elite:false});Object.assign(pe,{x:a.x,y:a.y,fx:a.fx||1,anim:a.anim,lunge:a.lunge,hurt:a.hurt});
    ctx.save();ctx.globalAlpha=.5;ctx.strokeStyle='#8cf08a';ctx.lineWidth=1.5;ell2(s.x,s.y,18,7);ctx.restore();drawMon(ctx,pe,s.x,s.y)}
  else{const b=Math.sin(a.anim*14),hy=s.y-46+Math.sin(a.anim*2)*4-(a.lunge>0?-14:0);ctx.save();Kit.shadow(ctx,s.x,s.y,10,4,.6);ctx.translate(s.x,hy);ctx.scale(a.fx||1,1);
    ctx.fillStyle='#6a4a2a';ctx.beginPath();ctx.moveTo(-2,0);ctx.quadraticCurveTo(-16,-10-b*8,-26,-2-b*10);ctx.quadraticCurveTo(-14,2,-2,4);ctx.fill();ctx.beginPath();ctx.moveTo(2,0);ctx.quadraticCurveTo(16,-10-b*8,26,-2-b*10);ctx.quadraticCurveTo(14,2,2,4);ctx.fill();
    ctx.fillStyle='#8a6a42';ctx.beginPath();ctx.ellipse(0,1,5,8,0,0,6.283);ctx.fill();ctx.fillStyle='#e8e0d0';ctx.beginPath();ctx.arc(3,-6,3.2,0,6.283);ctx.fill();ctx.fillStyle='#e8b840';ctx.beginPath();ctx.moveTo(6,-6);ctx.lineTo(9,-5);ctx.lineTo(6,-4);ctx.fill();ctx.restore()}
  const w=30,y=s.y-(f==='falcon'?72:50);ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(s.x-w/2-1,y-1,w+2,5);ctx.fillStyle='#6ad06a';ctx.fillRect(s.x-w/2,y,w*clamp(a.hp/a.max,0,1),3)}}
const ell2=(x,y,rx,ry)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.283);ctx.stroke()};

/* ===== 같이 하기: 무기 종류 알리기 · 상태 효과 · 이어짐 ===== */
{const _ns=netSend;netSend=function(o){if(o&&o.t==='st'){const g=P.gear||{};o.gw=g.staff&&g.staff.wt||0;o.go=g.off?g.off.wt||0:0;o.gor=g.off?g.off.rar|0:-1;if(P.lnkOut)o.lk=P.lnkOut.id}return _ns(o)}}
{const _nm=netOnMsg;netOnMsg=function(m){
  if(m.t==='fx2'){if(NET.host){const e=enemies.find(o=>o.id===m.id),r=NET.peers.get(m.from);if(e&&!e.dead&&m.ta&&HAS_PTY)PTY.taunt(e,m.from,m.ta);if(e&&!e.dead)clsFx(e,{taunt:HAS_PTY?0:m.ta,weaken:m.wk?{dmg:m.wk[0],dur:m.wk[1]}:null,mark:m.mk?{amp:m.mk[0],dur:m.mk[1]}:null,root:m.rt,pull:m.pl?1:0},m.pl?{x:m.pl[0],y:m.pl[1]}:null,r||null)}return}
  if(m.t==='lnk'){if(m.to===NET.id){const r=NET.peers.get(m.from);P.lnkIn={from:m.from,share:clamp(+m.sh||0,0,.5),t:Math.min(30,+m.d||0)};msg(`${r?r.name:'동료'}님이 나를 지킵니다 (받는 피해 ${Math.round(P.lnkIn.share*100)}% 대신 받음)`,EL.phys)}return}
  if(m.t==='lnkd'){if(m.to===NET.id&&!P.dead&&P.lnkOut)hitPlayer(Math.max(0,+m.d||0),null,{lnk:1});return}
  if(m.t==='dmg'&&NET.host){const e=enemies.find(o=>o.id===m.id);if(e&&e.markT>0)m.a=Math.round(m.a*(1+(e.markAmp||0)))}
  const r=_nm(m);
  if(m.t==='st'){const q=NET.peers.get(m.from);if(q){q.gear=q.gear||{};if(m.gw){q.gear.staff=q.gear.staff||{rar:0};q.gear.staff.wt=m.gw}if(q.gear)q.gear.off=m.go?{rar:m.gor|0,wt:m.go}:null;q.lk=m.lk||0}}
  return r}}

/* ===== 화면: 능력치 칸 · 스킬 창 숫자 ===== */
// 계열 수가 다른 직업으로 바꾼 뒤(사제 5 → 전사 4) 고른 계열이 남아 있으면 첫 계열로
{const _th=treeHtml;treeHtml=function(){const n=CLASSES[P.cls].trees.length;if(!(treeSel>=0&&treeSel<n)){treeSel=0;nodeSel=null}const h=_th.apply(this,arguments);return PHYS_CLS[P.cls]&&typeof h==='string'?h.replace('한 마법에 최대','한 스킬에 최대').replace('이어진 마법만 위의 마법에','이어진 스킬만 위의 스킬에'):h}}
function clsStatRows(C){if(!PHYS_CLS[P.cls])return null;const wr=P.cls==='warrior';
  const help={str:wr?'1점마다 공격력 +1 (전사의 주 능력치)':'1점마다 공격력 +0.3',dex:wr?'1점마다 공격력 +0.3, 명중 +1':'1점마다 공격력 +1, 명중 +1 (궁수의 주 능력치)',
    vit:`생명력 +${Math.round(4*C.hp*10)/10}`,spi:`마나 +${Math.round(3*C.mp*10)/10}, 마나 회복 +0.06/초`};
  return STAT_KEYS[P.cls].map(k=>[k,STAT_N[k],help[k]])}
function clsStatList(){const pct=v=>Math.round(v*1000)/10+'%',r=[['공격력',Math.round(physPower())],['명중',Math.round(accRating())],['명중률 (같은 레벨)',pct(hitChance({k:'wolf',lvl:P.lvl}))],
  ['공격 간격',atkIv(SPELLS[CLASSES[P.cls].start[0]]).toFixed(2)+'초'],['물리 피해',`+${Math.round(Math.min(PSCALE.pctCap,stat('pdmg')/100+passSum('pdmg'))*100)}%`]];
  if(P.cls==='warrior')r.push(['막기',pct(blkC())]);r.push(['회피',pct(evaC())]);const w=mainWT();r.push(['무기',w?w.n:'없음']);return r}
const PVN={blk:'막기 확률',acc:'명중',crit:'치명타',pdmg:'물리 피해',hp:'최대 생명력',dr:'받는 피해 감소',regen:'초당 마나 회복',ls:'생명력 흡수 %',eva:'회피',spd:'이동 속도',elArrow:'원소 화살 피해',petDmg:'동료 피해',petHp:'동료 생명력'};
{const _na=numsAt;numsAt=function(id,L){const out=_na(id,L),s0=SPELLS[id];if(!PHYS_CLS[s0.cls])return out;const s=eff(id,L),add=[];
  if(s.kind==='passive'){const rows=[];for(const k in s0.pv){const v=s[k];rows.push([PVN[k]||k,(k==='acc'||k==='regen'||k==='ls')?'+'+Math.round(v*10)/10:'+'+Math.round(v*1000)/10+'%'])}
    if(s0.wt)rows.push(['필요한 무기',WT_REQN[s0.wt]]);rows.push(['상태','늘 켜짐']);return rows}
  const i=out.findIndex(r=>r[0]==='피해');
  if(isDmg(s)){const d=physPower()*s.mult*physBuffMul()*physScale(id,L),row=['피해',`${Math.round(d*.9)}~${Math.round(d*1.1)}`+(s.cnt>1?` ×${s.cnt}발`:'')+(s.hits>1?` ×${s.hits}번`:'')+(s.kind==='field'?' /0.5초':s.kind==='rain'?' /낙하':'')];if(i>=0)out[i]=row;else out.unshift(row)}
  if(s.aspd)add.push(['공격 간격',atkIv(s).toFixed(2)+'초']);if(s.kind==='melee')add.push(['사거리 · 맞는 적',`${Math.round(meleeReach(s))} · ${s.max||1}`]);
  if(s.mhit)add.push(['맞히면 마나',`+${s.mhit}`]);if(s.taunt)add.push(['도발',s.taunt+'초']);if(s.mark)add.push(['표식',`받는 피해 +${Math.round(s.mark.amp*100)}% · ${s.mark.dur}초`]);
  if(s.weaken)add.push(['약화',`주는 피해 -${Math.round(s.weaken.dmg*100)}% · ${s.weaken.dur}초`]);if(s.root)add.push(['묶기',s.root+'초']);if(s.blk)add.push(['막기',`+${Math.round(s.blk*100)}%`]);
  if(s.ias)add.push(['공격 속도',`+${Math.round(s.ias*100)}%`]);if(s.acc)add.push(['명중',`+${s.acc}`]);if(s.share)add.push(['대신 받는 피해',Math.round(s.share*100)+'%']);if(s.excl)add.push(['겹침','방어 강화는 하나만']);
  if(s.wt)add.push(['필요한 무기',WT_REQN[s.wt]+(wtOk(s.wt)?' ✓':' ✗')]);
  const mi=out.findIndex(r=>r[0]==='마나');out.splice(mi>=0?mi:out.length,0,...add);return out}}
{const _dh=detailHtml;detailHtml=function(id){let h=_dh(id);const s=SPELLS[id];if(!PHYS_CLS[s.cls])return h;const C=CLASSES[P.cls];
  h=h.replace(/<div class="muted">시너지:[^<]*<\/div>/,`<div class="muted">시너지: 같은 ${C.trees[TREE[id]]} 계열의 다른 스킬에 찍은 1점마다 피해 +1% (최대 +40%, 지금 +${Math.min(40,synergy(id))}%). 스킬 레벨(레벨마다 +6%)·시너지·물리 피해 %는 더한 뒤 한 번만 곱합니다</div>`).replace(/선행 마법/g,'선행 스킬');
  if(s.wt)h=h.replace('<div>스킬 레벨',`<div class="req${wtOk(s.wt)?' ok':''}">필요한 무기: ${WT_REQN[s.wt]}${wtOk(s.wt)?' ✓':' — 지금 들고 있지 않습니다'}</div><div>스킬 레벨`);
  return h}}

/* ===== 점검 도우미 (#qa · t11A) ===== */
// 이 스킬을 쓸 수 있는 무기를 쥐여 준다 (전사 검+방패 / 창, 궁수 활+화살통)
function clsGearFor(id){const s=SPELLS[id];if(!s||!PHYS_CLS[s.cls]||P.cls!==s.cls)return;const want=s.wt==='polearm'?['polearm']:P.cls==='warrior'?['sword','shield']:['bow','quiver'];
  const cur=(P.gear.staff&&P.gear.staff.wt)||'';if(cur===want[0]&&(want.length<2||(P.gear.off&&P.gear.off.wt===want[1])))return;
  P.gear.off=null;for(const wt of want){const it=makeBaseV18(wt,Math.max(1,P.lvl),P.cls);P.gear[it.slot]=it}passT=-1}
function clsSnap(){if(!PHYS_CLS[P.cls])return{};const o={atk:physPower(),acc:accRating(),blk:blkC(),eva:evaC(),ias:buffSum('ias')};
  for(const k of ['pdmg','ls','elArrow','petDmg','petHp','markDmg','imbue','stealth','healUp','threat','counter','nextShot','floor','wave'])o[k]=buffSum(k);return o}
queueMicrotask(()=>{const g=window.__game;if(!g)return;Object.assign(g,{clsGearFor,makeBaseV18,physPower,hitChance,blkC,evaC,atkIv,wtOk,canWear,WT,PFX,clsGhost:m=>netGhostCast(m),clsNet:()=>NET,clsPeer:id=>netPeer(id),clsMsg:m=>netOnMsg(m)});
  Object.defineProperties(g,{traps:{get:()=>traps,configurable:true},swings:{get:()=>swings,configurable:true},clsProjs:{get:()=>projs,configurable:true}})});
