#!/usr/bin/env bash
# v48 릴리스 빌드(게임 코드 줄이기): 평소 빌드(build-to.sh) 뒤 게임 코드만 terser로 줄인다 (min48.cjs 설명 참고).
# 사용법:
#   bash build-min.sh ../game-v48.html          → 줄인 릴리스 게임 (BUILD_OK · MIN_OK · node --check 통과해야 끝). 줄이기 전 것은 OUT 이름.full.html 로 남는다
#   bash build-min.sh --qa ../q26c/f48min.html  → 줄인 #qa 검사판 (qa-build.sh 를 이 폴더 qa 파일로 → 줄이기)
#   terser 위치: MIN_TOOLS (기본 이 폴더 옆 ../tools-min). 없으면: mkdir -p ../tools-min && cd ../tools-min && npm init -y && npm install terser
# 출력 경로가 상대 경로면 이 폴더 기준 (build-to.sh 와 같음)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
QA=0;if [ "${1:-}" = "--qa" ];then QA=1;shift;fi
OUT="${1:?출력 파일 필요}";case "$OUT" in /*) ;; *) OUT="$HERE/$OUT";; esac
FULL="${OUT%.html}.full.html"
if [ $QA = 1 ];then QA_DIR="$HERE" bash "$HERE/../qa-build.sh" "$HERE" "$FULL"
else (cd "$HERE" && bash build-to.sh "$FULL") | tail -1 | grep -qx BUILD_OK || { echo "평소 빌드 실패" >&2; exit 1; }; echo BUILD_OK; fi
node "$HERE/min48.cjs" "$FULL" "$OUT"
node --check "$OUT.check.js" && echo "CHECK_OK $OUT"
