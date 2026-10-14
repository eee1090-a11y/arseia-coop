/* ---------- v32 옹기여신의 설원 (자료) · 친구들에게 바치는 지역 · 신전 · 심연 던전 · 2인조 보스 (사용자 2026-10-14) ----------
   「북부의 지역을 새로 만들어서 거기에 옹기여신의 동상과 신전 · 신전 내부로 들어가면 심연의 입구 같은 던전 · 2인조 보스(옹기 던지는 돼지 · 코에서 실리콘 화살을 쏘는 가짜코 여신)」
   · 이 파일은 자료만: 지역 1곳(잿불 용암지대 북쪽 포탈) · 들판 몬스터 4종 · 던전 1곳(준보스 둘 + 보스 둘) · 쉼터 사람 둘.
     움직임(신전 · 동상 · 보스 기믹 · 그림)은 ongi32.js.
   · hunt29.js 뒤 · region.js 앞에 붙는다. region.js가 부르는 h29Install을 감싸 지역을 맨 끝(REG_IDS 28번째)에 붙인다 → 기존 지역 번호 · 같이 하기 번호 그대로.
   · 레벨: 들판 60~69(보통) · 던전 65(보스 67). 악몽 +20 · 지옥 +40은 기존 규칙.
   · 저장: 새 값 없음(가 본 마을 목록 P.towns 에 쉼터 id 'ongi_camp'가 들어갈 뿐). */
const OG32={reg:'ongi',camp:'ongi_camp',dg:'og32_abyss',pig:'b_ongipig',god:'b_fakenose'};
const OG32_TYPES={};
// 들판 몬스터: 같은 레벨대(심연의 균열 54~58) 몬스터의 모양 · 수치를 빌려 이름 · 색만 새로
{const mk=(id,src,o)=>{const t=WX_TYPES[src];OG32_TYPES[id]={...t,...o,reg:1}};
 mk('og_0','v_shade',{n:'깨진 옹기 망령',min:60,col:'#a8784a',pcol:'#ffcf9a',eye:'#ffcf9a'});
 mk('og_1','v_maw',{n:'가마 진흙덩이',min:60,col:'#8a5a32'});
 mk('og_2','v_knight',{n:'신전 파수 기사',min:62,col:'#c8ccd8',eye:'#bfe6ff',undead:false});
 mk('og_3','v_seer',{n:'가짜코 숭배자',min:64,col:'#e8b8c8',pcol:'#ffd6e0',eye:'#fff0f4',undead:false});
 // 던전 준보스: 같은 레벨대 준보스를 빌린다
 OG32_TYPES.m_og_toh={...WX_TYPES.m_keymaster,n:'가마지기 거상 토우',col:'#9a6a3e',eye:'#ffb070'};
 OG32_TYPES.m_og_priest={...WX_TYPES.m_riftmother,n:'심연을 여는 사제',col:'#7a5a9a',pcol:'#e8c8ff',summon:'og_3'};
 // 2인조 보스 (생명력 하나를 같이 쓴다 · 그림 'ongipig' · 'ongigod'는 ongi32.js)
 // 돼지가 던전 보스(TYPES boss)이고 가짜코 여신은 돼지가 깨어날 때 함께 내려온다(보스 표시는 몸에만 · 보상은 돼지 한 번).
 OG32_TYPES[OG32.pig]={n:'옹기돼지',hp:2600,dmg:30,spd:92,r:30,xp:960,aggro:620,atk:1.7,col:'#e8a0a8',ranged:true,pcol:'#a8642f',draw:'ongipig',sc:2.3,boss:1,
   skills:['slam','charge'],eye:'#3a1a10',aura:'rgba(255,170,120,.32)',og:1};
 OG32_TYPES[OG32.god]={n:'가짜코 여신',hp:2600,dmg:28,spd:100,r:28,xp:0,aggro:620,atk:1.5,col:'#ece6d8',ranged:true,pcol:'#f3c9d6',draw:'ongigod',sc:2.3,
   skills:['volley'],eye:'#fff0f4',aura:'rgba(255,214,224,.34)',og:2,still:0}}
Object.assign(TYPES,OG32_TYPES);
// 속성: 들판은 어둠 · 대지 · 냉기 · 신성(고를 수 있게 넷 다 다르게)
Object.assign(WX21_EL,{og_0:'dark',og_1:'earth',og_2:'ice',og_3:'holy'});
// 던전: 신전 문(옹기여신 신전) 바로 안 = 「심연의 입구」. 동굴 자리는 신전 건물 안(ongi32.js가 신전을 세우고 동굴 그림은 숨긴다)
const OG32_DG={id:OG32.dg,reg:OG32.reg,at:'near',n:'옹기여신 신전 · 심연의 입구',x:3000,y:4420,lvl:65,floor:[46,36,48],wall:['#5a4652','#1a1218','#86707a'],torch:'#ffb0c8',
  mobs:['og_0','og_1','og_3'],minis:['m_og_toh','m_og_priest'],boss:OG32.pig,loot:'옹기 · 실리콘 · 모든 원소',og:1};
WX_DUNGEONS.push(OG32_DG);
// 쉼터 사람 둘 (wxPlaceFolk가 자리를 다듬는다)
Object.assign(WX_FOLK,{
 og_mira:{town:OG32.camp,at:[-180,-150],n:'신전지기 미라',role:'신전지기',L:{body:'#e8e0d0',cape:'#c8906a',hair:'#3a2418',hs:2,dress:1,prop:'staff',gem:'#ffd6e0'},
  lines:['이 성소는 오랜 벗들에게 바쳐진 곳이에요. 함께 웃던 날들을 잊지 말라고요.','옹기여신께서는 깨진 옹기도 버리지 않으셨대요. 금 간 자리를 흙으로 메워 다시 쓰셨지요.','신전 안 깊은 곳에서 돼지 울음과 낯선 노랫소리가 들려요. 혼자보다는 벗과 함께 가세요.']},
 og_koko:{town:OG32.camp,at:[190,120],n:'순례자 코코',role:'순례자',L:{body:'#6a5a7a',cape:'#e8b8c8',hair:'#c8a070',hs:3,hat:1,hatC:'#4a3a5a',prop:'basket'},walk:[[190,120],[230,160],[150,160]],
  lines:['가짜코 여신이 코끝으로 활을 쏜다는 얘기, 농담이 아니었어요!','두 분이 멀어지기 시작하면 그 사이에 절대 서 있지 마세요. 옹기랑 실리콘이 비처럼 날아와요.','둘은 생명을 나눠 쓴대요. 아무 쪽이나 때려도 함께 깎여요.']}});
WX_TWOUT[OG32.reg]={st:'frost',local:['옹기 굽는 장인','#7a5a3a',3,'가마 불은 눈보라에도 꺼지지 않아. 여신께서 지켜 주시거든.'],props:['snowpine','kegs','barrel','iceboulder']};
// 지역 (잿불 용암지대 북쪽 포탈) — region.js가 h29Install()을 부를 때 함께 붙는다
function og32Install(){const A=REGIONS.ice;
  REGIONS[OG32.reg]={id:OG32.reg,n:'옹기여신의 설원',base:60,zs:360,zcap:9,col:'#f0c8b0',entry:'S',edges:{S:'lava'},seed:211,noLair:1,straight:1,
    town:{id:OG32.camp,n:'옹기여신 성소',area:'옹기여신의 설원',desc:'눈 덮인 고원 위, 흙빛 옹기여신의 동상과 신전이 서 있는 성소. 오랜 벗들에게 바쳐진 곳입니다.',roof:['#7a4a32','#6a3a2a','#8a5a3a','#5a3a2a']},
    th:{...A.th,pal:[[188,180,178],[166,158,160]],deep:[120,110,118],liq:{...A.th.liq,th:.86}},
    mix:[['snowpine',18],['iceboulder',12],['icespike',6],['templestone',8],['ruinpillar',6],['frozenbones',3],['rock',5]],
    mobs:['og_0','og_1','og_2','og_3']};
  WX_WPOS[OG32.reg]=[0,-4];REGIONS.lava.edges.N=OG32.reg}
{const _h=h29Install;h29Install=function(){const r=_h.apply(this,arguments);og32Install();return r}}
