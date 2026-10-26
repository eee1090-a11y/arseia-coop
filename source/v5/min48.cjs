// v48 릴리스용 게임 코드 줄이기(압축): 다 붙인 게임 HTML에서 게임 코드(<script>\n(()=>{ … </script>) 하나만 terser로 줄인다.
// · 줄인 뒤에도 게임 코드는 '<script>\n(()=>{' 로 시작한다(다른 점검 도구가 이 표시로 게임 코드를 찾음).
// · HTML · CSS · 다른 <script>(#qa 준비 qa0 등)는 한 글자도 안 바꾼다. 글자(한국어 포함)는 그대로(ascii_only 끔).
// · 이름 줄이기(mangle)와 설명 글 · 빈칸 지우기만 한다. 코드 바꿔 쓰기(compress)는 끈다:
//   게임은 뒤 파일이 앞 파일의 함수를 감싸 바꾸고({const _f=fn;fn=function(){…}}) window.__game으로 속성 이름을 내보내므로
//   함수 합치기 · 펼치기 같은 바꿔 쓰기 위험을 피한다(크기는 1~2%만 더 줄어서). 이름은 게임 함수 안에서만 바뀌고
//   속성 이름(.name · window.__game.x · V20A['키'])과 바깥 이름(window · document …)은 그대로. 코드가 이름을 글자로 찾는 곳(eval · new Function · fn.name · toString)은 없음(v48에서 확인).
// 사용법: node min48.cjs IN.html OUT.html   (terser 위치: 환경 변수 MIN_TOOLS, 기본 이 파일 옆 ../tools-min)
const fs=require('fs'),path=require('path');
const T=process.env.MIN_TOOLS||path.join(__dirname,'..','tools-min');
let terser;try{terser=require(path.join(T,'node_modules','terser'))}catch(e){console.error('terser가 없습니다: '+T+' (cd '+T+' && npm init -y && npm install terser)');process.exit(2)}
const [IN,OUT]=process.argv.slice(2);if(!IN||!OUT){console.error('사용법: node min48.cjs IN.html OUT.html');process.exit(2)}
const s=fs.readFileSync(IN,'utf8'),HEAD='<script>\n(()=>{',a=s.indexOf(HEAD);if(a<0){console.error('게임 코드 시작(<script>\\n(()=>{)을 못 찾음');process.exit(1)}
const b=s.indexOf('</script>',a);if(b<0||b!==s.lastIndexOf('</script>')){console.error('게임 코드가 마지막 <script>가 아님');process.exit(1)}
const js=s.slice(a+8,b);
(async()=>{const t0=Date.now();const r=await terser.minify(js,{ecma:2020,module:false,toplevel:false,compress:false,mangle:{keep_fnames:false,safari10:false},
    format:{ascii_only:false,comments:false,inline_script:true,beautify:false,semicolons:true}});
  if(!r||!r.code){console.error('줄이기 실패');process.exit(1)}
  const out=s.slice(0,a+9)+r.code+'\n'+s.slice(b);if(out.indexOf(HEAD)!==a){console.error('줄인 코드 시작이 <script>\\n(()=>{ 가 아님');process.exit(1)}fs.writeFileSync(OUT,out);
  fs.writeFileSync(OUT+'.check.js',r.code);
  const B=x=>Buffer.byteLength(x),z=x=>require('zlib').gzipSync(x,{level:6}).length,mb=n=>(n/1048576).toFixed(2)+'MB';
  console.log(`MIN_OK ${path.basename(OUT)} 파일 ${mb(B(s))} → ${mb(B(out))} · 게임 코드 ${mb(B(js))} → ${mb(B(r.code))} · gzip ${mb(z(s))} → ${mb(z(out))} · ${((Date.now()-t0)/1000).toFixed(1)}초`)})().catch(e=>{console.error(e&&e.message||e);process.exit(1)});
