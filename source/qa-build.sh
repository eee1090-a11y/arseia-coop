#!/usr/bin/env bash
# 자가 점검(#qa)용 빌드: 아무 소스 폴더(v5-v15, v5 …)를 그 폴더의 build.sh 순서대로 붙이고,
# a.html 바로 뒤에 qa0.js, b5.js 바로 앞에 qa.js를 끼워 넣는다. QA 파일은 늘 v5/에서 가져온다.
# 사용법: bash qa-build.sh SRC_DIR OUT.html
#   SRC_DIR  : 소스 폴더 (예: v5-v15, v5)
#   OUT.html : 출력 파일. 상대 경로면 build-to.sh와 같이 SRC_DIR 기준 (예: ../game-qa-v15.html → 스크래치패드/game-qa-v15.html)
#   QA_DIR   : (환경 변수, 선택) qa0.js/qa.js를 가져올 폴더. 기본값은 이 스크립트 옆의 v5/
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="${1:?SRC_DIR 필요}"; OUT="${2:?OUT.html 필요}"
SRC="$(cd "$SRC" && pwd)"
QA_DIR="${QA_DIR:-$HERE/v5}"
case "$OUT" in /*) ;; *) OUT="$SRC/$OUT";; esac
OUT="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"
[ -f "$QA_DIR/qa0.js" ] && [ -f "$QA_DIR/qa.js" ] || { echo "qa0.js/qa.js가 $QA_DIR 에 없습니다" >&2; exit 1; }
# build.sh의 파일 목록 (cat a.html ... > 까지), qa 파일은 일단 빼고 다시 정해진 자리에 넣는다
LIST=$(grep -o 'cat a.html[^>]*' "$SRC/build.sh" | head -1 | sed 's/^cat //')
[ -n "$LIST" ] || { echo "$SRC/build.sh 에서 파일 목록을 찾지 못했습니다" >&2; exit 1; }
TMP="$(mktemp)"; trap 'rm -f "$TMP" "$TMP.check.js" "$TMP.qa0.js"' EXIT
FOUND_B5=0
for f in $LIST; do
  case "$f" in qa0.js|qa.js) continue;; esac
  if [ "$f" = "b5.js" ]; then cat "$QA_DIR/qa.js" >> "$TMP"; FOUND_B5=1; fi
  cat "$SRC/$f" >> "$TMP"
  if [ "$f" = "a.html" ]; then cat "$QA_DIR/qa0.js" >> "$TMP"; fi
done
[ "$FOUND_B5" = 1 ] || { echo "목록에 b5.js가 없습니다" >&2; exit 1; }
# 문법 검사: 게임 IIFE 본문과 qa0 블록
python3 - "$TMP" <<'EOF'
import sys
s=open(sys.argv[1]).read()
a=s.index('<script>\n(()=>{');b=s.rindex('</script>')
open(sys.argv[1]+'.check.js','w').write(s[a+8:b])
q=s.index('/* ---------- QA 0');qs=s.rindex('<script>',0,q);qe=s.index('</script>',q)
open(sys.argv[1]+'.qa0.js','w').write(s[qs+8:qe])
EOF
node --check "$TMP.check.js"
node --check "$TMP.qa0.js"
cp "$TMP" "$OUT"
echo "QA_BUILD_OK $OUT ($(wc -c < "$OUT") bytes)"
