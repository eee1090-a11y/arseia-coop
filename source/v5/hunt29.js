/* v29 작업H: 70~100 사냥터. wx21-world.js 뒤에서 데이터 함수를 정의하고,
   region.js가 왕도 뒤·REG_IDS 앞에서 호출한다. 기존 지역 번호·수치·저장은 유지한다.
   지역·장식·몬스터는 기존 생성기와 재료를 쓰며, 정예와 보상은 기존 규칙이다. */
const H29_TYPES={};
const H29_SPECS=[
 {id:'h29_reed',n:'달물결 갈대벌',base:70,cap:9,src:'mistlake',entry:'W',edges:{W:'lava',E:'h29_kiln'},pos:[1,-3],seed:173,col:'#8cc8bc',town:'달물결 쉼터',desc:'달빛이 은빛 갈대를 흔드는 오래된 나루. 물안개 사이로 사냥꾼의 발자국이 이어집니다.',names:['갈대 비늘 사냥수','달물결 갑각수','나루 안개술사','침수된 수호석'],types:['th_wyvern','th_monk','th_roc','th_cloud'],mix:[['fern',18],['tree',8],['mossrock',14],['bush',12],['stump',6]]},
 {id:'h29_kiln',n:'붉은 유리 황야',base:70,cap:9,src:'scorch',entry:'W',edges:{W:'h29_reed',S:'h29_crystal'},pos:[2,-3],seed:179,col:'#df9769',town:'유리길 초소',desc:'옛 숯가마의 열기로 모래가 붉은 유리처럼 굳은 황야. 검은 바위 사이로 식은 불씨가 빛납니다.',names:['유리등 도마뱀','숯길 방랑 기사','붉은 불티 요정','유리껍질 거상'],types:['th_wyvern','th_monk','th_roc','th_cloud'],mix:[['sandrock',16],['obsidian',12],['ashtree',10],['lavarock',10],['vent',3]]},
 {id:'h29_crystal',n:'푸른 맥 수정림',base:80,cap:9,src:'roots',entry:'N',edges:{N:'h29_kiln',E:'h29_snow',S:'h29_bell'},pos:[2,-2],seed:181,col:'#9be0bf',town:'푸른 맥 파수막',desc:'나무뿌리와 푸른 수정이 한데 얽힌 숲. 땅속 마나의 맥이 잔잔히 뛰고 있습니다.',names:['수정 뿔 벌레','맥을 잃은 순례자','푸른 맥 주술사','수정뿌리 거상'],types:['rt_beetle','rt_pilgrim','rt_shaman','rt_golem'],mix:[['oak',16],['mossrock',16],['icespike',8],['mushroom',8],['templestone',5]]},
 {id:'h29_snow',n:'눈잠든 순례길',base:80,cap:9,src:'starsea',entry:'W',edges:{W:'h29_crystal'},pos:[3,-2],seed:191,col:'#c6ddf0',town:'눈잠 쉼터',desc:'오래전 순례자의 발길이 멎은 눈 덮인 길. 얼음 기둥 사이로 푸른 등불이 남아 있습니다.',names:['눈잠 갑각수','얼어붙은 순례병','길잃은 서리 무당','순례길 얼음 거상'],types:['rt_beetle','rt_pilgrim','rt_shaman','rt_golem'],mix:[['snowpine',16],['iceboulder',12],['icespike',10],['frozenbones',6],['ruinpillar',5]]},
 {id:'h29_bell',n:'메아리 없는 종원',base:90,cap:9,src:'thunder',entry:'N',edges:{N:'h29_crystal',E:'h29_veil'},pos:[2,-1],seed:193,col:'#dac981',town:'종원 지킴터',desc:'울려도 소리가 돌아오지 않는 돌기둥의 정원. 바람이 부서진 종의 흔적을 감싸고 있습니다.',names:['종원 사냥개','침묵의 종지기','깨진 종의 아가리','무음의 잔영'],types:['ec_hound','ec_paladin','ec_maw','ec_shade'],mix:[['ruinpillar',18],['templestone',14],['windtree',8],['rock',12],['mossrock',8]]},
 {id:'h29_veil',n:'새벽 봉인의 벌판',base:90,cap:9,src:'eclipse',entry:'W',edges:{W:'h29_bell'},pos:[3,-1],seed:197,col:'#b7a4df',town:'새벽 파수막',desc:'새벽빛이 오래된 봉인석을 비추는 벌판. 어둠과 빛의 경계에서 잊힌 맹세가 살아 움직입니다.',names:['봉인그늘 사냥개','새벽 맹세 기사','봉인을 삼키는 짐승','빛바랜 봉인 망령'],types:['ec_hound','ec_paladin','ec_maw','ec_shade'],mix:[['templestone',18],['ruinpillar',10],['obsidian',8],['ashtree',8],['bones',4]]}
];
function h29Install(){
 for(const [i,S] of H29_SPECS.entries()){
  const A=REGIONS[S.src],mobs=S.types.map((k,j)=>{
   const id=S.id+'_'+j,t=WX_TYPES[k];H29_TYPES[id]={...t,n:S.names[j],min:S.base+[0,0,2,4][j],col:[S.col,'#9d957e',S.col,'#75858d'][j],eye:S.col,reg:1};
   // 대표 속성을 두 지역씩 다르게 해 같은 레벨에서 고를 수 있다.
   const el=['ice','fire','earth','ice','storm','dark'][i];if(j!==1)WX21_EL[id]=el;return id;
  });
  REGIONS[S.id]={id:S.id,n:S.n,base:S.base,zs:360,zcap:S.cap,col:S.col,entry:S.entry,edges:{...S.edges},seed:S.seed,noLair:1,straight:1,
   town:{id:S.id+'_camp',n:S.town,area:S.n,desc:S.desc,roof:[...A.town.roof]},
   th:{...A.th,pal:A.th.pal.map(c=>[...c]),liq:{...A.th.liq,th:.9}},mix:S.mix,mobs};
  WX_WPOS[S.id]=S.pos;
 }
 for(const k in H29_TYPES){const t=H29_TYPES[k];if(!MON[t.draw])t.draw=t.alt||'wolf'}
 Object.assign(TYPES,H29_TYPES);
 // 지역 번호는 기존 왕도까지 그대로 두고 새 여섯 곳만 끝에 붙인다.
 REGIONS.lava.edges.E='h29_reed';
}
