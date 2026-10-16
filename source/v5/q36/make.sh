# q36/mid.js high.js empty.js -> ../q36data.js (build: ongi32d.js 다음, region.js 앞)
cd "$(dirname "$0")" && {
echo '/* v36 지역 의뢰: 마을마다 잡기 · 모으기 · 특수 의뢰 · 지역 특색 의뢰 하나(sig) — q36/*.js 를 합친 것 (q36/make.sh) */'
cat mid.js; echo; cat high.js; echo; cat empty.js; echo
cat <<'JS'
const Q36_FOLK={...Q36_MID_FOLK,...Q36_HIGH_FOLK,...Q36_EMPTY_FOLK};
const Q36_SQ=[...Q36_MID_SQ,...Q36_HIGH_SQ,...Q36_EMPTY_SQ];
for(const q of Q36_SQ)if(q.sig&&!/^특색/.test(q.kind))q.kind='특색 '+q.kind;
/* 봉인 · 수수께끼 · 추적의 셈 수를 돌 · 물음 · 흔적 수에 맞춘다 (quest30.js 는 Q30_SQ 만 채움) */
for(const q of Q36_SQ)for(const g of q.goals){if(g.type==='ritual')g.n=g.stones.length;if(g.type==='riddle')g.n=g.qs.length;if(g.type==='track')g.n=g.steps.length+1}
Object.assign(WX_FOLK,Q36_FOLK);
WX_SQ.push(...Q36_SQ);
JS
} > ../q36data.js && node -e "new Function(require('fs').readFileSync('../q36data.js','utf8').replace(/Object.assign\(WX_FOLK[^\n]*|WX_SQ.push[^\n]*/g,''))" && echo Q36_OK
