# 사용법: bash build-to.sh ../game-이름.html   (다른 사람의 빌드와 겹치지 않게 출력 파일을 따로 둔다)
cd "$(dirname "$0")" && OUT="$1" && FILES=$(grep -o 'cat a.html[^>]*' build.sh | sed 's/^cat //') && cat $FILES > "$OUT" && python3 -c "
import sys;s=open(sys.argv[1]).read();a=s.index('<script>\n(()=>{');b=s.rindex('</script>');open(sys.argv[1]+'.check.js','w').write(s[a+8:b])" "$OUT" && node --check "$OUT.check.js" && echo BUILD_OK
