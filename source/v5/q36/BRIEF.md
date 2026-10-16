# v36 지역 의뢰 쓰기: 작업 안내 (모든 작업자 공통)

You are writing quest DATA (JavaScript object literals) for a Korean browser RPG. You only create ONE file: the output path given in your task. Do not edit any other file.

## Source to read first (read-only)
- Game source folder: /tmp/claude-0/-home-claude/8464b53a-9c21-52e8-a8a0-4a365a511880/scratchpad/v36
- `q30data.js` — the best examples of every special quest type (track 추적, defend 지키기, ritual 봉인, riddle 수수께끼, chase 추격) and of camp NPCs (WX_FOLK entries). Copy its object shapes exactly.
- `wx-towns.js` lines 1-190 — town NPCs and the existing kill (처치) / gather / dungeon quests per region town. Tone reference.
- `context.json` in this folder — for every town: its NPCs (folk), the region's monsters (type id : name / min level), dungeons, and the quests that already exist there (avoid duplicating their story).

## Who the user is and the request
The owner (Korean, non-developer) said: quests in the new high-level regions are thin; every region should have distinctive quests; across levels low→high there should be a reasonable mix of kill / collect / riddle / track / defend and other types, not only kill & collect. Write natural Korean, warm, concrete, each region's own flavour (its monsters, landscape, NPC personalities from their `lines`). NEVER name or allude to other games. No English in player-facing text.

## Goal types you may use (exact shapes)
- kill: `{type:'kill',k:['typeId',...],n:8,d:'목표 글'}` — k must be monster type ids from that region's list in context.json.
- collect (monster drops): `{type:'collect',k:['typeId',...],p:.5,n:6,item:'물건 이름',d:'목표 글'}` — p = drop chance per kill (0.4–0.7).
- track: `{type:'track',reg:'REGION_ID',steps:[[deg,dist,'발견 글'],...4 steps],foe:'typeId',foeN:'이름 붙은 적',d:'목표 글',n:5}` (n = steps+1)
- defend: `{type:'defend',reg:'REGION_ID',at:[deg,dist],secs:45..90,hp:N,mobs:['typeId',...],what:'지킬 것',d:'목표 글'}` — hp ≈ 12×level.
- ritual: `{type:'ritual',reg:'REGION_ID',stones:[[deg,dist,'이름'],...3-5],order:[indices],hint:'힌트 글',mobs:['typeId',...],d:'목표 글'}` — order is the correct visiting order (indices into stones); the hint + say text must let the player deduce the order logically from the stone names.
- riddle: `{type:'riddle',npc:'folkId',qs:[['물음',['보기1','보기2','보기3'],정답번호0-2],...3],d:'목표 글',n:3}` — npc = the giver (a folk id in that town). Riddles must have one clearly correct answer; vary correct index.
- chase: `{type:'chase',reg:'REGION_ID',at:[deg,dist],path:[[deg,dist],...5],who:{n:'이름',L:{body:'#hex',legs:'#hex',cape:'#hex',hair:'#hex',hs:0-4,hat:0-6,hatC:'#hex'}},d:'목표 글'}`
- Positions: `[deg, dist]` = angle in degrees (0 = east, 90 = south on the map) and distance from the town centre. Use dist 600–1900. Vary angles between quests of the same town so they don't overlap.

## Quest object shape
`{id:'q36_<town>_<n>',town:'<townId>',giver:'<folkId>',req:'<previous id in same town chain or omit>',lvl:N,kind:'처치|수집|추적|지키기|봉인|수수께끼|추격',t:'제목',say:'의뢰 내용(2-4문장, 왜·어디·무엇)',done:'끝냈을 때 한두 문장',goals:[...one goal...],rw:{xp:X,gold:G,pot:P,tp:T}}`
- lvl: within the region's level band (region base … base+8). Order the town's new quests by lvl.
- Use `req` to chain at most 2 quests; most should be independent (no req) so players see several at once.
- Rewards: gold = round(lvl*lvl*0.1 + lvl*4); xp: kill 1, collect .8, track/chase/riddle .9, ritual/defend 1.1, the town's signature quest 1.2; pot 2–3; tp 1 for defend/ritual/signature.
- Each town gets exactly ONE 「특색」 quest: mark it by starting `t` normally but add `sig:1` to the object. It must use the region's unique landscape/culture (e.g. desert caravan, ice footprints, lava kiln, tidal path) and should be a special type (not plain kill/collect).

## NPCs for towns that have none
For towns with no folk, add 2 NPCs in an object `FOLK` keyed `q36f_<town>_<a|b>` with this shape (copy from q30data.js camp NPCs):
`{town:'<townId>',at:[-170,120] (first) / [150,-190] (second, with walk:[[150,-190],[190,-150],[120,-150]]),n:'이름 직업',role:'직업',L:{...appearance like q30data},lines:['대사1','대사2']}`

## Output file format (exactly)
```js
// <group> — written for v36
const Q36_<GROUP>_FOLK={ ... };   // may be empty {}
const Q36_<GROUP>_SQ=[ ... ];
```
No other code. Use single quotes in JS strings, escape any single quote inside text. Make sure the file parses (`node --check` it: wrap test with `node -e "require('fs');new Function(require('fs').readFileSync(F,'utf8'))"`).

At the end, print a short table: town | id | lvl | kind | title | sig.
