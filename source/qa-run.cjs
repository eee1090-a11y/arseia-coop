// 아르세이아의 견습생 · 자가 점검 실행기
// 사용법: node qa-run.cjs game-qa-v15.html [--shot=shots-qa/qa-table.png] [--port=8070] [--timeout=420] [--only=정규식]
//  - HTML 파일 하나를 작은 정적 서버(8070~8079 중 빈 포트)로 띄우고, 헤드리스 Chromium(1280×800)으로 #qa를 연다.
//  - window.__QA_RESULT가 생길 때까지 기다린 뒤, 콘솔 오류·페이지 오류와 함께 표 하나로 출력한다.
//  - HTML 옆에 qa-report.md, qa-report.json을 쓴다. 실패가 있거나 시간이 넘으면 종료 코드 1.
//  - 바깥 주소(구글 글꼴, Firebase …)로의 요청은 모두 빈 응답으로 막는다.
//  - --only=정규식: '그룹 항목' 이름이 맞는 점검만 돌린다(개발용).
const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const args=process.argv.slice(2),opt={};const files=[];
for(const a of args){const m=/^--([^=]+)(?:=(.*))?$/.exec(a);if(m)opt[m[1]]=m[2]==null?true:m[2];else files.push(a)}
if(!files[0]){console.error('사용법: node qa-run.cjs GAME.html [--shot=FILE.png] [--port=N] [--timeout=초]');process.exit(2)}
const FILE=path.resolve(files[0]),DIR=path.dirname(FILE),TIMEOUT=(+opt.timeout||420)*1000;
const html=fs.readFileSync(FILE,'utf8');
const page0=/^\s*<!doctype/i.test(html)?html:'<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+html+'</body></html>';
function listen(port){return new Promise((ok,no)=>{const s=http.createServer((q,r)=>{if(q.url==='/'||q.url.startsWith('/?')||q.url==='/index.html'){r.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});r.end(page0)}else{const mm=/^\/audio\/music\/([a-z]+\.mp3)$/.exec(q.url.split('?')[0]),mf=mm&&require('path').join(process.env.MUSIC_DIR||require('path').join(__dirname,'..','audio','music'),mm[1]);if(mm&&mm[1]==='qanone.mp3'){r.writeHead(200,{'Content-Type':'audio/mpeg'});r.end('not music')}else if(mf&&fs.existsSync(mf)){r.writeHead(200,{'Content-Type':'audio/mpeg'});fs.createReadStream(mf).pipe(r)}else{r.writeHead(404);r.end()}}});
  s.once('error',no);s.listen(port,'127.0.0.1',()=>ok(s))})}
const esc=s=>String(s==null?'':s).replace(/\|/g,'\\|').replace(/\n/g,' ');
(async()=>{
  let srv,port;for(const p of opt.port?[+opt.port]:[8070,8071,8072,8073,8074,8075,8076,8077,8078,8079]){try{srv=await listen(p);port=p;break}catch(_){}}
  if(!srv){console.error('8070~8079에 빈 포트가 없습니다');process.exit(2)}
  const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:800}});const pg=await ctx.newPage();
  const consoleErr=[],pageErr=[],blocked=new Set();
  if(opt.only)await ctx.addInitScript(o=>{window.__QA_ONLY=o},String(opt.only));
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(`http://127.0.0.1:${port}/`)||u.startsWith('data:')||u.startsWith('blob:'))return r.continue();blocked.add(new URL(u).host);return r.fulfill({status:200,contentType:r.request().resourceType()==='stylesheet'?'text/css':'text/plain',body:''})});
  pg.on('console',m=>{if(m.type()==='error')consoleErr.push(m.text())});pg.on('pageerror',e=>pageErr.push(e.message));
  const t0=Date.now();let res=null,timedOut=false;
  try{await pg.goto(`http://127.0.0.1:${port}/#qa`,{waitUntil:'domcontentloaded'});
    await pg.waitForFunction(()=>window.__QA_RESULT,null,{timeout:TIMEOUT,polling:500});res=await pg.evaluate(()=>window.__QA_RESULT)}
  catch(e){timedOut=true;res=await pg.evaluate(()=>window.__QA_RESULT||null).catch(()=>null);pageErr.push('실행기: '+e.message.split('\n')[0])}
  const wall=((Date.now()-t0)/1000).toFixed(1);
  if(opt.shot){const f=path.resolve(opt.shot===true?path.join(DIR,'shots-qa','qa-table.png'):opt.shot);fs.mkdirSync(path.dirname(f),{recursive:true});await pg.screenshot({path:f});console.log('스크린샷:',f)}
  await b.close();srv.close();
  // 보고서
  const R=res&&res.results||[],S=res&&res.summary||{total:0,pass:0,fail:0},fails=R.filter(r=>!r.pass);
  const bad=pageErr.length+consoleErr.length;if(opt.only)console.log('(--only 필터: '+opt.only+')');
  let md=`# 자가 점검 보고서 — ${path.basename(FILE)}\n\n`;
  md+=`- 실행: ${new Date().toISOString()} · 걸린 시간 ${wall}초 (점검 ${((S.ms||0)/1000).toFixed(1)}초)${res&&res.version?` · 패치노트 버전 v${res.version}`:''}\n`;
  md+=`- **결과: ${S.total}개 중 통과 ${S.pass}, 실패 ${S.fail}**${timedOut?' · **시간 초과/중단**':''}${res&&res.fatal?' · **치명 오류: '+esc(res.fatal)+'**':''}\n`;
  md+=`- 진짜 localStorage 접근: **${res?res.realStorageAccess:'?'}회**${res&&res.realStorageLog&&res.realStorageLog.length?' ('+res.realStorageLog.join(', ')+')':''} · 가짜 저장소 쓰기 ${res?res.storeWrites:'?'}회 · 지우기 ${res&&res.storeRemoves?res.storeRemoves.length:'?'}회\n`;
  md+=`- 페이지 오류 ${pageErr.length} · 콘솔 오류 ${consoleErr.length} · 막은 바깥 요청: ${[...blocked].join(', ')||'없음'}\n\n`;
  if(res&&res.perf){md+='## 성능 (update+render 한 프레임, ms)\n\n| 장면 | 평균 | p95 | 최악 | 프레임 |\n|---|---|---|---|---|\n';
    const N={town:'마을',townWarm:'마을(땅 굽기 끝난 뒤)',fight50:'몬스터 50마리 전투',rank9:'9위계 마법 연속',stress:'안정성(50마리+큰 마법 30초)'};
    for(const [k,p] of Object.entries(res.perf))md+=`| ${N[k]||k} | ${p.avgMs} | ${p.p95Ms} | ${p.worstMs} | ${p.frames} |\n`;md+='\n'}
  if(fails.length){md+=`## 실패 ${fails.length}\n\n| group | test | result | reason |\n|---|---|---|---|\n`;for(const r of fails)md+=`| ${esc(r.group)} | ${esc(r.name)} | FAIL | ${esc(r.reason)} |\n`;md+='\n'}
  if(pageErr.length||consoleErr.length){md+='## 페이지·콘솔 오류\n\n';for(const e of pageErr)md+=`- page: ${esc(e)}\n`;for(const e of consoleErr)md+=`- console: ${esc(e)}\n`;md+='\n'}
  md+=`## 전체 결과\n\n| group | test | result | reason |\n|---|---|---|---|\n`;for(const r of R)md+=`| ${esc(r.group)} | ${esc(r.name)} | ${r.pass?'PASS':'FAIL'} | ${esc(r.reason)} (${r.ms}ms) |\n`;
  md+=`\n**요약: ${S.total}개 · 통과 ${S.pass} · 실패 ${S.fail} · 진짜 저장소 접근 ${res?res.realStorageAccess:'?'}회 · 페이지/콘솔 오류 ${bad}**\n`;
  fs.writeFileSync(path.join(DIR,'qa-report.md'),md);
  fs.writeFileSync(path.join(DIR,'qa-report.json'),JSON.stringify({file:path.basename(FILE),wallSec:+wall,timedOut,consoleErrors:consoleErr,pageErrors:pageErr,blockedHosts:[...blocked],...(res||{})},null,1));
  console.log(md);console.log('보고서:',path.join(DIR,'qa-report.md'),path.join(DIR,'qa-report.json'));
  process.exit(!res||timedOut||S.fail||bad||res.realStorageAccess?1:0)})();
