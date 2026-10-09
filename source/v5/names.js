// 멋진 이름과 영창: [이름, 영창]. 설정집의 이름은 kn으로 남긴다
const NAMES={
  spark:['플레임 스파크','카스'],stop:['셀 바인드','셀'],gust:['윈드 해머','베안'],
  static:['스파크 체인','타룬'],waterjet:['아쿠아 블래스트','에아 벨'],ease:['페더 스텝','비엔 카이'],
  firebolt:['파이어 애로우','카스 벨'],frost:['프로스트 바이트','에아셀'],windblade:['게일 블레이드','베안 시르'],blink:['블링크','파스 카이'],flash:['솔라 플레어','이르 엔테'],
  frostarrow:['아이스 니들','에아셀 벨'],firewall:['파이어 월','카스 도르'],fissure:['어스 브레이커','도르 시르'],shieldcircle:['아케인 실드','셀 엔'],
  fireburst:['파이어 볼','카스 벨 엔테'],lightning:['라이트닝 볼트','타룬 벨'],iceprison:['프로즌 프리즌','에아셀 엔'],stonerain:['스톤 레인','도르 오르 엔테'],arcaneheal:['마나 리스토어','비엔 로'],
  blizzard:['블리자드','에아셀 베안 엔테'],quake:['어스퀘이크','도르 아르'],twinflames:['트윈 플레임','카스 벨, 카스 벨'],lightspear:['썬더 랜스','타룬 시르 벨'],firebird:['피닉스 콜','카스 실 넨'],
  chainlightning:['체인 라이트닝','타룬 벨 엔테'],thunderrain:['썬더 스톰','타룬 오르 엔테'],pillar:['플레임 필라','카스 아르 오르 엔테'],sunflame:['솔라 레이','카스 이르 시르 아르'],frozenground:['앱솔루트 제로','에아셀 아르 엔테'],
  dragonbreath:['드래곤 브레스','카스 아르 시르 엔테'],timestop:['타임 스톱','셀 타이르'],callstorm:['템페스트','베안 타룬 아르 넨'],stonebody:['스톤 스킨','도르 비엔 바'],firebirdflock:['피닉스 스웜','카스 실 넨 엔테'],
  skyfire:['헬파이어','카스 오르 아르 엔테 에온'],heavenbolt:['저지먼트 썬더','타룬 오르 아르 에온'],sunfall:['선 폴','카스 이르 오르 아르 에온'],glacier:['글레이셜 에이지','에아셀 오르 아르 에온'],
  holyspark:['홀리 스파크','빛이여'],minorheal:['힐','아우렐이여, 낫게 하소서'],lightward:['라이트 베일','빛으로 감싸소서'],blessing:['블레스','여명의 가호를'],
  lightarrow:['홀리 애로우','새벽빛이여, 날아가라'],faith:['디바인 스트렝스','믿음에 힘을'],symbolflash:['홀리 플래시','성표여, 빛나라'],
  javelin:['홀리 재블린','꿰뚫어라'],closewounds:['큐어 운즈','상처를 닫으소서'],divineshield:['디바인 실드','아우렐의 방패를'],turnundead:['턴 언데드','부정한 것은 물러가라'],
  holyburst:['홀리 노바','빛이여, 터져라'],chainoflight:['체인 오브 라이트','빛이여, 이어져라'],holychains:['홀리 바인드','은총의 사슬로 묶으라'],grace:['가디언 엔젤','쓰러지지 않게 하소서'],
  pillaroflight:['라이트 필라','하늘이여, 내려오소서'],lingering:['리제너레이션','은총이 머물게 하소서'],waveoflight:['홀리 웨이브','빛이여, 밀려가라'],exorcircle:['엑소시즘','이 원 안에 부정은 없다'],herobless:['히어로즈 블레싱','영웅의 힘을 내리소서'],
  rainoflight:['홀리 레인','빛을 비처럼 내리소서'],greaterheal:['그레이터 힐','아우렐이여, 온전케 하소서'],healcircle:['서클 오브 힐링','빛의 원이여, 우리를 감싸라'],burningsigil:['세이크리드 사인','성표여, 타올라라'],
  judgment:['저지먼트','심판하소서'],thunderprayer:['디바인 썬더','하늘의 노여움을'],oath:['언브레이커블','나는 쓰러지지 않는다'],holysun:['세이크리드 선','작은 해를 띄우소서'],
  godspear:['스피어 오브 갓','신의 창이여'],greatjudgment:['라스트 저지먼트','모두를 심판하소서'],inviolable:['디바인 인터벤션','어떤 해도 닿지 않으리'],regeneration:['풀 리스토어','온전히 되살리소서'],
  wrath:['래스 오브 헤븐','하늘이여, 노하소서'],thousandspears:['사우전드 랜스','천 개의 빛이여'],returnmiracle:['미라클 오브 리턴','다시 일어서게 하소서'],sunsword:['솔라 블레이드','해를 칼로 쥐노라'],
  // v17 심판 계열 (속죄에서 옮겨 온 것 포함)
  smite:['스마이트','내리치소서'],holycross:['홀리 크로스','십자를 긋노라'],holyfire:['홀리 파이어','성화여, 타올라라'],hammerofjustice:['해머 오브 저스티스','정의의 망치를'],
  blessedhammer:['블레스드 해머','축복받은 망치여, 돌아라'],consecration:['컨시크레이션','이 땅을 거룩하게'],avengersshield:['어벤저 실드','응징의 방패여'],radiance:['래디언스','빛이여, 곧게 뻗어라'],
  chastise:['체스티즈','꿇어라'],divinestorm:['디바인 스톰','빛이여, 휘몰아쳐라'],fistofheaven:['피스트 오브 헤븐','하늘이여, 내리치소서'],hammerofwrath:['해머 오브 래스','천벌을 내리소서'],
  gloriadomini:['글로리아 도미니','주의 영광으로'],condemn:['컨뎀네이션','이 원 안의 죄를 묻노라'],grandcross:['그랜드 크로스','십자의 심판을'],sacredsword:['세이크리드 소드','심판의 검을 내리소서'],
  apotheosis:['어벤징 래스','응징의 날개를'],
};
const NAMES2={
  ember:['엠버 스캐터','카스'],
  warmth:['웜스','카스'],
  dancingflames:['댄싱 플레임','카스'],
  smokecall:['스모크 클라우드','카스'],
  flameshaping:['플레임 버스트','카스'],
  flamelash:['플레임 래시','카스 시르'],
  steamjet:['스팀 제트','카스 에아'],
  flamemantle:['플레임 맨틀','카스 비엔'],
  blazinggust:['블레이징 거스트','카스 베안'],
  ringoffire:['링 오브 파이어','카스 엔 엔테'],
  flamelance:['플레임 랜스','카스 시르 벨'],
  firestorm:['파이어스톰','카스 베안 엔테'],
  callmagma:['마그마 이럽션','카스도르 아르 오르 엔테'],
  heartoffire:['하트 오브 파이어','카스 비엔 바 엔'],
  seaofflame:['씨 오브 플레임','카스 아르 엔테 오르 에온'],
  splash:['스플래시','에아'],
  drawwater:['워터 서지','에아'],
  purifywater:['퓨리파이','에아'],
  watershaping:['워터 오브','에아'],
  gatherdew:['듀 힐링','에아'],
  waterwhip:['워터 윕','에아 시르'],
  mire:['마이어','에아 도르'],
  iceshield:['아이스 실드','에아셀 엔'],
  iceblade:['아이스 블레이드','에아셀 시르'],
  shardvolley:['샤드 발리','에아셀 벨 엔테'],
  whirlpool:['월풀','에아 아르 엔'],
  callwave:['웨이브 크래시','에아 아르 벨'],
  frostarmor:['프로스트 아머','에아셀 비엔 엔'],
  callrain:['프리징 레인','에아 베안 오르 엔테'],
  icecitadel:['아이스 시타델','에아셀 도르 아르 엔'],
  endlesswinter:['엔드리스 윈터','에아셀 오르 아르 엔테'],
  bodyofwater:['워터 폼','에아 비엔 바 엔'],
  turncurrent:['리버스 커런트','에아 로 파스 아르'],
  tidalwave:['타이달 웨이브','에아 오르 아르 엔테 에온'],
  monsoon:['몬순','에아 베안 오르 엔테 에온'],
  breeze:['브리즈','베안'],
  clearair:['에어 블래스트','베안'],
  windshaping:['윈드 오브','베안'],
  windreading:['윈드 리딩','베안'],
  airwall:['에어 월','베안 엔'],
  dustdevil:['더스트 데빌','베안 도르'],
  shockinggrasp:['쇼킹 그래스프','베안 타룬'],
  doubledgust:['더블 거스트','베안 아르, 베안 아르'],
  windleap:['윈드 리프','베안 비엔'],
  whirlwind:['훨윈드','베안 아르 엔'],
  hail:['헤일스톰','베안 에아셀 벨'],
  sandstorm:['샌드스톰','베안 도르 엔테'],
  eyeofstorm:['아이 오브 스톰','베안 셀 엔테'],
  vacuumblade:['배큐엄 블레이드','베안 셀 시르 아르'],
  lightningbody:['라이트닝 폼','베안 타룬 비엔 바'],
  thundervoice:['썬더 보이스','베안 벨 미르 엔테'],
  typhoon:['타이푼','베안 에아 오르 아르 에온'],
  rendingsky:['스카이 렌더','베안 시르 오르 아르 에온'],
  stoneset:['스톤 스킨','도르'],
  crackstone:['스톤 샤드','도르'],
  earthshaping:['어스 서지','도르'],
  sandshaping:['샌드 블라스트','도르'],
  stonethrow:['볼더 스로','도르 벨'],
  mudgrasp:['머드 그래스프','도르 에아'],
  quicksand:['퀵샌드','도르 바'],
  obsidian:['옵시디언 스파이크','카스도르 셀 벨'],
  stoneguardian:['스톤 골렘','도르 비엔 넨'],
  crystallance:['크리스탈 랜스','도르 이르 시르'],
  earthquake:['그레이트 퀘이크','도르 아르 시르 엔테'],
  jaws:['어스 팽','도르 시르 아르 엔'],
  magmariver:['마그마 리버','카스도르 아르 벨 엔테'],
  raisemountain:['마운틴 라이즈','도르 오르 아르 엔테 에온'],
  splitcanyon:['캐니언 스플릿','도르 시르 오르 아르 에온'],
  light:['라이트 볼트','이르'],
  hold:['홀드 퍼슨','셀'],
  heatoflight:['라이트 히트','이르 카스'],
  slowtime:['슬로우','셀 타이르 엔'],
  lancelight:['라이트 랜스','이르 시르 벨'],
  spacetwist:['스페이스 트위스트','파스 바 엔테'],
  lightrain:['라이트 레인','이르 오르 엔테'],
  spaceprison:['디멘션 프리즌','파스 셀 문 엔'],
  dawnblade:['던 블레이드','이르 시르 엔'],
  rewind:['리와인드','셀 로 타이르 엔'],
  spacerend:['디멘션 렌드','파스 시르 아르 엔테'],
  starlight:['스타폴','이르 오르 아르 엔테 에온'],
};Object.assign(NAMES,NAMES2);
for(const id in SPELLS){const s=SPELLS[id],nm=NAMES[id];s.kn=s.n;if(nm){s.n=nm[0];s.chant=nm[1]}}
/* v18 (SYS): 다른 게임 이름을 그대로 가져온 마법의 화면 이름 바꾸기 — id는 그대로(저장·단축칸·+스킬 옵션 안전). 설명 끝의 출처 표시도 지운다. (v18-design/code/v18-rename.js) */
const RENAME_V18={
  // ---- 사제 · 라그나로크 ----
  kyrie:        {n:'헤일로 가드',      kn:'후광의 막',         en:'Halo Guard',            chant:'후광이여, 감싸라'},
  safetywall:   {n:'스레숄드 오브 라이트', kn:'빛의 문턱',      en:'Threshold of Light',    chant:'이 문턱을 넘지 못하리'},
  blessing:     {n:'던 블레싱',        kn:'여명의 가호',       en:"Dawn's Favor"},
  agiup:        {n:'필그림 스트라이드', kn:'순례자의 발걸음',   en:"Pilgrim's Stride",      chant:'발걸음을 가볍게'},
  impositio:    {n:'세이크리드 터치',  kn:'안수의 축복',       en:'Sacred Touch',          chant:'이 손에 힘을'},
  gloria:       {n:'빅토리 앤섬',      kn:'승리의 찬가',       en:'Anthem of Victory',     chant:'승리를 노래하라'},
  magnificat:   {n:'스프링 캔티클',    kn:'샘물의 찬미',       en:'Canticle of the Spring',chant:'샘이여, 넘쳐흘러라'},
  aspersio:     {n:'홀리 워터',        kn:'성수 뿌리기',       en:'Holy Water',            chant:'성수로 씻노라'},
  assumptio:    {n:'어센딩 그레이스',  kn:'들어 올리는 은총',  en:'Ascending Grace',       chant:'하늘로 들어 올리소서'},
  sanctuary:    {n:'피스 가든',        kn:'평온의 뜰',         en:'Garden of Peace',       chant:'이곳은 평온하리'},
  magnus:       {n:'퍼지 오브 던',     kn:'새벽의 대정화',     en:'Purge of Dawn',         chant:'새벽이여, 모두 씻어 내라'},
  holycross:    {n:'세인트 마크',      kn:'성호 긋기',         en:'Sign of the Saint'},
  grandcross:   {n:'크로스 오브 포 윈즈', kn:'사방의 성호',    en:'Cross of Four Winds',   chant:'사방을 정화하노라'},
  gloriadomini: {n:'아우렐 글로리',    kn:'아우렐의 영광',     en:"Aurel's Glory",         chant:'아우렐의 영광으로'},
  // ---- 사제 · 월드 오브 워크래프트 ----
  barrier:      {n:'워드 오브 램파트', kn:'성벽의 말씀',       en:'Word of Rampart',       chant:'말씀이 성벽이 되리'},
  guardianspirit:{n:'워처스 윙',       kn:'지켜보는 날개',     en:"Watcher's Wings",       chant:'날개로 덮으소서'},
  painsup:      {n:'인듀어 프레이어',  kn:'견딤의 기도',       en:'Prayer of Endurance',   chant:'견디게 하소서'},
  salvation:    {n:'세이빙 워드',      kn:'구원의 한마디',     en:'Saving Word',           chant:'일어나라'},
  divinehymn:   {n:'헤븐리 코랄',      kn:'하늘의 합창',       en:'Heavenly Chorale',      chant:'하늘이여, 함께 노래하라'},
  renew:        {n:'리바이빙 라이트',  kn:'되살아나는 빛',     en:'Reviving Light',        chant:'빛이 머물게 하소서'},
  prayerheal:   {n:'커뮤널 프레이어',  kn:'함께 드리는 기도',  en:'Communal Prayer',       chant:'우리 모두를 낫게 하소서'},
  kings:        {n:'아르덴 블레싱',    kn:'아르덴의 가호',     en:"Arden's Favor",         chant:'왕도의 가호를'},
  wisdom:       {n:'클리어 마인드',    kn:'맑은 마음',         en:'Clear Mind',            chant:'마음을 맑게'},
  fortitude:    {n:'아이언 바우',      kn:'강철의 서원',       en:'Iron Vow',              chant:'강철처럼 버티게 하소서'},
  aegis:        {n:'세인트 버클러',    kn:'성자의 원방패',     en:"Saint's Buckler",       chant:'성자의 방패를'},
  divineshield: {n:'라이트 바스티온',  kn:'빛의 보루',         en:'Bastion of Light'},
  inviolable:   {n:'언터처블 라이트',  kn:'불가침',            en:'Inviolable Light'},
  avengersshield:{n:'저스티스 디스크', kn:'정의의 원반',       en:'Disc of Justice',       chant:'정의여, 날아가라'},
  hammerofjustice:{n:'버딕트 해머',    kn:'판결의 망치',       en:'Hammer of Verdict',     chant:'판결을 내리노라'},
  hammerofwrath:{n:'폴링 리트리뷰션',  kn:'떨어지는 천벌',     en:'Falling Retribution'},
  consecration: {n:'할로우드 그라운드',kn:'거룩한 땅',         en:'Hallowed Ground'},
  divinestorm:  {n:'라이트 사이클론',  kn:'빛의 회오리',       en:'Cyclone of Light'},
  holyfire:     {n:'세인트 엠버',      kn:'성자의 불씨',       en:"Saint's Ember"},
  chastise:     {n:'저지스 게이즈',    kn:'판관의 눈길',       en:"Judge's Gaze"},
  apotheosis:   {n:'윙즈 오브 리트리뷰션', kn:'응징의 날개',   en:'Wings of Retribution'},
  // ---- 사제 · 디아블로 2 ----
  blessedhammer:{n:'오비팅 해머',      kn:'맴도는 축복 망치',  en:'Orbiting Hammer'},
  fistofheaven: {n:'스카이 피스트',    kn:'하늘의 주먹',       en:'Fist of the Sky'},
  // ---- 마법사 ----
  frostdiver:   {n:'크리핑 프로스트',  kn:'기어가는 서리',     en:'Creeping Frost',        chant:'에아셀 도르'},   // 라그나로크
  stormgust:    {n:'화이트 게일',      kn:'흰 돌풍',           en:'White Gale',            chant:'에아셀 베안 아르'},// 라그나로크
  lordvermilion:{n:'크림슨 썬더폴',    kn:'진홍 뇌우',         en:'Crimson Thunderfall',   chant:'타룬 카스 오르 엔테'},// 라그나로크
  frozenorb:    {n:'프로스트 글로브',  kn:'구르는 얼음 구슬',  en:'Frost Globe',           chant:'에아셀 엔 벨'},  // 디아블로 2
  hydra:        {n:'파이어 살라만더',  kn:'세 머리 불도마뱀',  en:'Fire Salamander',       chant:'카스 넨 아르'},  // 디아블로 2
  arcanemissiles:{n:'아케인 시커',     kn:'뒤쫓는 마력탄',     en:'Arcane Seekers',        chant:'셀 벨 넨'},      // 월드 오브 워크래프트
  pyroblast:    {n:'인페르노 코어',    kn:'응축 화염탄',       en:'Inferno Core',          chant:'카스 아르 벨 에온'},// 월드 오브 워크래프트(한국어판 이름 그대로였음)
  hold:         {n:'홀딩 서클',        kn:'붙들기',            en:'Holding Circle'},                              // D&D 「홀드 퍼슨」
  shockinggrasp:{n:'볼트 핸드',        kn:'번쩍이는 손',       en:'Bolt Hand'},                                   // D&D 「쇼킹 그래스프」
  // ---- 덤: 화면 이름이 겹치던 것 (stonebody 와 stoneset 이 둘 다 「스톤 스킨」이었음) ----
  stoneset:     {n:'스톤 셸',          kn:'돌 굳히기',         en:'Stoneset'},
};
// 설명 끝에 붙어 있던 출처 표시 "(라그나로크)" 같은 것은 지운다. 키리에는 첫 문장이 원래 기도문 뜻이라 바꾼다.
const DESC_FIX_V18={kyrie:s=>s.replace(/^주여 자비를\.\s*/,'빛의 고리가 몸을 감쌉니다. '),
  hydra:s=>s.replace('세 머리 히드라를','세 머리 불도마뱀을').replace('세 머리 히드라','세 머리 불도마뱀'),guardianspirit:s=>s.replace('수호 천사가','지켜보는 날개가')};
function applyRenameV18(){
  for(const id in RENAME_V18){const s=SPELLS[id],r=RENAME_V18[id];if(!s)continue;
    s.n=r.n;s.kn=r.kn;s.en=r.en;if(r.chant)s.chant=r.chant}
  for(const id in SPELLS){const s=SPELLS[id];if(!s.desc)continue;
    s.desc=s.desc.replace(/\s*\((라그나로크|월드 오브 워크래프트[^)]*|디아블로 ?2)\)\s*$/,'');
    if(DESC_FIX_V18[id])s.desc=DESC_FIX_V18[id](s.desc)}
}
applyRenameV18();

const ICON={
  arcane:'<path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z"/>',
  fire:'<path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
  ice:'<path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" fill="none" stroke-width="2" stroke-linecap="round"/>',
  storm:'<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>',
  earth:'<path d="M2 20L9 7l4 6 3-4 6 11z"/>',
  wind:'<path d="M3 8h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 18h7" fill="none" stroke-width="2" stroke-linecap="round"/>',
  light:'<circle cx="12" cy="12" r="4.5"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M4.2 19.8L7 17M17 7l2.8-2.8" fill="none" stroke-width="2" stroke-linecap="round"/>',
  holy:'<path d="M10 2h4v6h6v4h-6v10h-4V12H4V8h6z"/>',
  heal:'<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
  shield:'<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/>',
  buff:'<path d="M12 3l7 8h-4v9H9v-9H5z"/>',
  blink:'<path d="M4 5l7 7-7 7M12 5l7 7-7 7" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
  pot:'<path d="M9 2h6v2h-1v4.2c3 1 5 3.6 5 6.8a7 7 0 0 1-14 0c0-3.2 2-5.8 5-6.8V4H9z"/>',
};
const iconKey=s=>({heal:'heal',hot:'heal',shield:'shield',ward:'shield',invuln:'shield',buff:'buff',blink:'blink'})[s.kind]||s.el;
const svg=(k,col)=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="${col}" stroke="${col}" stroke-width="0">${ICON[k]}</svg>`;

