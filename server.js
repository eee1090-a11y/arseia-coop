// 아르세이아의 견습생 · 같이 하기 서버
// 설치할 것 없이 Node.js만 있으면 됩니다:  node server.js   (포트를 바꾸려면 PORT=9000 node server.js)
// 하는 일: game.html을 보여 주고, 접속한 사람들 사이에 메시지(게임·대화·파티 초대)를 전달합니다. 게임 계산은 방장의 브라우저가 합니다.
// v19: 대화 채널(전체 · 파티 · 귓속말), 최근 전체 대화 30줄(메모리에만, 재시작하면 사라짐), 5초에 5번까지.
// v50: 방이 여러 개. 예전에는 서버 전체에 방이 하나뿐이라, 다른 사람(또는 끊긴 채 남은 창)이 방장이면 새 방을 못 만들고 그 방에 들어가야 했다
//      (그 방장이 다른 곳에 있거나 멈춰 있으면 몬스터 · 던전 · 지역 넘기가 모두 안 됨). 이제 「방 만들기」는 늘 내 방을 만들고, 초대를 받으면 초대한 사람의 방으로 간다.
//      방장 화면이 20초 멈추면(다른 앱 · 화면 끔 · 창 내림) 움직이는 동료에게 방장을 넘기고, 방장이 나가도 새 게임 동료가 있으면 방장을 넘긴다.
//      새 게임은 5초마다 「살아 있음」(hb)을 보내고, 60초 동안 아무것도 안 오면 그 연결을 끊는다(예전 게임은 hb를 안 보내므로 예전처럼 둔다).
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto'),os=require('os'),zlib=require('zlib');
const PORT=+process.env.PORT||8080,GAME=path.join(__dirname,'game.html');
// 구글 로그인(선택): Render의 Environment에 FIREBASE_CONFIG 이름으로 Firebase 웹 앱 설정을 붙여 넣으면 켜진다.
// "const firebaseConfig = { apiKey: "...", ... };" 를 통째로 붙여 넣어도 된다.
function fbConfig(){const raw=process.env.FIREBASE_CONFIG||'';if(!raw.trim())return null;const o={};
  for(const m of raw.matchAll(/["']?(\w+)["']?\s*:\s*["']([^"']+)["']/g))o[m[1]]=m[2];
  if(!o.apiKey||!o.authDomain||!o.projectId){console.log('  FIREBASE_CONFIG를 읽지 못했습니다. apiKey, authDomain, projectId가 들어 있는지 확인하세요');return null}
  return o}
const FB=fbConfig();
// v21 게임 창(앱으로 설치): server.js 옆 app 폴더가 있으면 켜진다. 없으면 예전처럼 웹 페이지로만 동작한다.
const APPDIR=path.join(__dirname,'app'),APP=fs.existsSync(path.join(APPDIR,'manifest.webmanifest'));
const APPFILES={'manifest.webmanifest':'application/manifest+json','icon-192.png':'image/png','icon-512.png':'image/png','icon-180.png':'image/png','icon.svg':'image/svg+xml'};
const APPHEAD=APP?'<link rel="manifest" href="/app/manifest.webmanifest"><meta name="theme-color" content="#1b1430"><link rel="icon" href="/app/icon-192.png"><link rel="apple-touch-icon" href="/app/icon-180.png">'+
  '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="아르세이아"><meta name="apple-mobile-web-app-status-bar-style" content="black">'+
  '<script>window.APP_INSTALL=1;addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__bip=e;dispatchEvent(new Event("app-installable"))});'+
  'if("serviceWorker"in navigator)addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){})})</script>':'';
function appFile(req,res){const n=req.url==='/sw.js'?'sw.js':req.url.slice(5).split('?')[0];
  const type=n==='sw.js'?'text/javascript; charset=utf-8':APPFILES[n];if(!APP||!type){res.writeHead(404);res.end();return}
  fs.readFile(path.join(APPDIR,n),(e,buf)=>{if(e){res.writeHead(404);res.end();return}
    res.writeHead(200,{'Content-Type':type,'Cache-Control':/\.png$|\.svg$/.test(n)?'public, max-age=86400':'no-cache'});res.end(buf)})}
const clients=new Map(),ROOMS=new Map();let nextId=1;// ROOMS: 방 번호 → {rid, host}
// v19 대화: 최근 「전체」 대화만 메모리에 30줄 (저장하지 않음)
const HIST=[],HIST_MAX=30,CHAT_N=5,CHAT_MS=5000,CHAT_LEN=120;

// game.html을 읽어 쪽 하나로 감싸고 gzip까지 해 둔다. game.html이 바뀌면(수정 시각·크기) 다시 만든다.
let PACK=null;
function pagePack(cb){fs.stat(GAME,(e,st)=>{if(e)return cb(e);const key=st.mtimeMs+':'+st.size;if(PACK&&PACK.key===key)return cb(null,PACK);
  fs.readFile(GAME,(err,buf)=>{if(err)return cb(err);
    const raw=Buffer.from('<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">'+APPHEAD+'<script>window.COOP_SERVER=1'+(FB?';window.FIREBASE_CONFIG='+JSON.stringify(FB).replace(/</g,'\\u003c'):'')+'</script></head><body>'+buf.toString('utf8')+'</body></html>');
    zlib.gzip(raw,{level:6},(ze,gz)=>{if(ze)return cb(ze);PACK={key,raw,gz,etag:'"'+crypto.createHash('sha1').update(raw).digest('hex').slice(0,20)+'"'};cb(null,PACK)})})})}
const server=http.createServer((req,res)=>{
  if(req.url==='/'||req.url.startsWith('/?')||req.url==='/index.html'){
    // v18: game.html에 배경음악이 들어가 약 13MB가 됐다 → 한 번 만든 페이지를 gzip으로 줄여 두고(약 10MB), ETag로 바뀌지 않았으면 다시 보내지 않는다(304).
    pagePack((err,pk)=>{if(err){res.writeHead(500);res.end('game.html을 찾을 수 없습니다');return}
      if(req.headers['if-none-match']===pk.etag){res.writeHead(304,{'ETag':pk.etag,'Cache-Control':'no-cache'});res.end();return}
      const gz=/\bgzip\b/.test(req.headers['accept-encoding']||'');
      res.writeHead(200,Object.assign({'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache','ETag':pk.etag,'Vary':'Accept-Encoding'},gz?{'Content-Encoding':'gzip'}:{}));
      res.end(gz?pk.gz:pk.raw)});return}
  // v20: 배경음악은 game.html 옆 audio/music 폴더의 파일로 둔다(브라우저가 곡을 기억해 두어 다음부터는 받지 않음)
  {const m=/^\/audio\/music\/([a-z0-9_-]+\.mp3)$/.exec(req.url.split('?')[0]);if(m){const f=path.join(__dirname,'audio','music',m[1]);
    fs.stat(f,(e,st)=>{if(e){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':'audio/mpeg','Content-Length':st.size,'Cache-Control':'public, max-age=604800'});fs.createReadStream(f).pipe(res)});return}}
  // v21: 무료 그림(Flare)은 game.html 옆 img 폴더의 flare-*.js 파일(처음 필요할 때 받음 · 이름 규칙 밖은 404)
  // v35: 스킬 이펙트 그림(fx-*.js, v31부터)도 내준다 — 전에는 flare-만 받아서 이 주소로 하면 이펙트 그림이 하나도 안 나왔음
  // v42: 그림 묶음을 작은 목록(.m.js) + 그림 파일(.webp/.png)로도 내준다 (받는 양 약 25%↓)
  {const m=/^\/img\/((?:flare|fx)-[a-z0-9_-]+\.(m\.js|js|webp|png))$/.exec(req.url.split('?')[0]);if(m){const f=path.join(__dirname,'img',m[1]),ty=m[2]==='webp'?'image/webp':m[2]==='png'?'image/png':'text/javascript; charset=utf-8';
    fs.stat(f,(e,st)=>{if(e||!st.isFile()){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':ty,'Content-Length':st.size,'Cache-Control':'public, max-age=604800'});fs.createReadStream(f).pipe(res)});return}}
  if(req.url==='/sw.js'||req.url.startsWith('/app/')){appFile(req,res);return}
  if(req.url==='/status'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({players:clients.size,inParty:[...clients.values()].filter(c=>c.room).length,host:bestHost(),rooms:[...ROOMS.values()].map(R=>({host:(clients.get(R.host)||{}).name||'',n:[...clients.values()].filter(c=>c.room===R.rid).length,quiet:Math.round((Date.now()-((clients.get(R.host)||{}).lastG||0))/1000)}))}));return}
  res.writeHead(404);res.end();
});

// ---- 웹소켓 (RFC 6455, 텍스트 메시지만) ----
server.on('upgrade',(req,sock)=>{
  const key=req.headers['sec-websocket-key'];if(!key||req.headers.upgrade.toLowerCase()!=='websocket'){sock.destroy();return}
  const acc=crypto.createHash('sha1').update(key+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+acc+'\r\n\r\n');
  sock.setNoDelay(true);
  const c={id:nextId++,sock,buf:Buffer.alloc(0),name:'',cls:'',lvl:0,room:0,cv:0,ct:[],hist:false,last:Date.now(),lastG:0,hb:0};clients.set(c.id,c);
  send(c,{t:'hello',id:c.id,host:bestHost(),f:['chat2','rooms']});// f: 이 서버가 아는 것 (옛 게임은 무시)
  sock.on('data',d=>{c.last=Date.now();c.buf=Buffer.concat([c.buf,d]);let m;while((m=readFrame(c))!==null){if(m===false){drop(c);return}onMsg(c,m)}});
  sock.on('close',()=>drop(c));sock.on('error',()=>drop(c));
});
function readFrame(c){const b=c.buf;if(b.length<2)return null;
  const op=b[0]&15,masked=b[1]&128;let len=b[1]&127,off=2;
  if(len===126){if(b.length<4)return null;len=b.readUInt16BE(2);off=4}else if(len===127){if(b.length<10)return null;len=Number(b.readBigUInt64BE(2));off=10}
  if(len>4*1048576)return false;
  const mo=off;if(masked)off+=4;if(b.length<off+len)return null;
  let p=b.subarray(off,off+len);if(masked){const mk=b.subarray(mo,mo+4);p=Buffer.from(p);for(let i=0;i<p.length;i++)p[i]^=mk[i&3]}
  c.buf=b.subarray(off+len);
  if(op===8)return false;if(op===9){raw(c,10,p);return''}
  // v50: 중간 장치(프록시)가 큰 메시지를 여러 조각으로 나눠 보내도 이어 붙인다 (전에는 첫 조각만 읽고 버려서 큰 메시지 · 던전 자료가 사라질 수 있었음)
  const fin=b[0]&128;
  if(op===1||op===2){if(fin){c.frag=null;return op===1?p.toString('utf8'):''}c.frag=[Buffer.from(p)];c.fop=op;c.flen=p.length;return''}
  if(op===0&&c.frag){c.frag.push(Buffer.from(p));c.flen+=p.length;if(c.flen>4*1048576)return false;if(!fin)return'';const all=Buffer.concat(c.frag),o=c.fop;c.frag=null;return o===1?all.toString('utf8'):''}
  return''}
function raw(c,op,p){const n=p.length;let h;if(n<126){h=Buffer.from([128|op,n])}else if(n<65536){h=Buffer.alloc(4);h[0]=128|op;h[1]=126;h.writeUInt16BE(n,2)}else{h=Buffer.alloc(10);h[0]=128|op;h[1]=127;h.writeBigUInt64BE(BigInt(n),2)}
  try{c.sock.write(Buffer.concat([h,p]))}catch(_){}}
function send(c,o){raw(c,1,Buffer.from(typeof o==='string'?o:JSON.stringify(o)))}
// 서버에 들어온 사람은 모두 "접속자"(대화·초대 가능), 그중 방에 들어간 사람만 게임 메시지를 주고받는다
function roomcast(o,except,rid){const s=typeof o==='string'?o:JSON.stringify(o);for(const c of clients.values())if(c.room&&c.room===rid&&c.id!==except)send(c,s)}
const HOST_MS=+process.env.HOST_MS||20000,DEAD_MS=+process.env.DEAD_MS||60000;// 시험에서 바꿀 수 있음
const hostStale=H=>!H||Date.now()-(H.lastG||0)>HOST_MS;
const members=rid=>[...clients.values()].filter(c=>c.room===rid);
// 예전 게임은 방이 하나라고 여기므로 「참가하기」는 지금 가장 잘 돌아가는 방으로
function bestRoom(){let b=null,bt=-1;for(const R of ROOMS.values()){const H=clients.get(R.host);if(!H)continue;const t=(hostStale(H)?0:1e15)+(H.lastG||0);if(t>bt){bt=t;b=R}}return b}
const bestHost=()=>{const R=bestRoom();return R?R.host:0};
// 방장을 넘길 동료: 새 게임(cv 50+)이고 최근 움직인 사람
function nextHost(R,not){const now=Date.now();return members(R.rid).filter(o=>o.id!==not&&o.cv>=50&&now-(o.lastG||0)<5000).sort((a,b)=>b.lastG-a.lastG)[0]||null}
function giveHost(R,n,why){const H=clients.get(R.host);R.host=n.id;console.log(`~ ${H?H.name:'방장'} ${why} → ${n.name}에게 방장을 넘김`);roomcast({t:'host',id:n.id,n:n.name},0,R.rid)}
function lobbycast(o){const s=typeof o==='string'?o:JSON.stringify(o);for(const c of clients.values())if(c.name)send(c,s)}
function who(){lobbycast({t:'who',host:bestHost(),list:[...clients.values()].filter(c=>c.name).map(c=>{const R=c.room&&ROOMS.get(c.room);return{id:c.id,n:c.name,c:c.cls,l:c.lvl,r:c.room?1:0,rid:c.room||0,h:R&&R.host===c.id?1:0}})})}
// 방장이 「파티 나가기」를 누르면 남은 동료가 둘 이상일 때 동료에게 넘기고, 연결이 끊기면(drop) 예전처럼 파티를 풀어 다시 이어 들어오게 한다(던전 안 파티가 그대로 다시 모임)
function part(c,dropped){if(!c.room)return;const rid=c.room,R=ROOMS.get(rid);c.room=0;
  if(R&&R.host===c.id){const n=dropped||members(rid).length<2?null:nextHost(R,c.id);// 둘만 있던 파티는 예전처럼 풀림
    if(n){giveHost(R,n,'나감');roomcast({t:'leave',id:c.id},0,rid)}
    else{roomcast({t:'hostgone'},0,rid);for(const o of members(rid))o.room=0;ROOMS.delete(rid);console.log(`- ${c.name} 방을 닫음`)}}
  else{roomcast({t:'leave',id:c.id},0,rid);console.log(`- ${c.name} 파티에서 나감`)}
  if(R&&!members(rid).length)ROOMS.delete(rid)}
function drop(c){if(!clients.has(c.id))return;clients.delete(c.id);try{c.sock.destroy()}catch(_){}
  console.log(`- ${c.name||'손님'} 접속 끊김 (지금 ${clients.size}명)`);part(c,true);who()}
const nm=s=>String(s||'').replace(/[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g,' ').replace(/\s+/g,' ').trim();
// v19 대화: 5초에 5번까지 · 120자 · 글자 그대로 전달(화면에 그릴 때 게임이 모두 글자로 바꿔 그린다)
function chatOk(c){const now=Date.now();while(c.ct.length&&now-c.ct[0]>=CHAT_MS)c.ct.shift();if(c.ct.length>=CHAT_N)return false;c.ct.push(now);return true}
const csys=(c,x)=>{if(c.cv>=19)send(c,{t:'csys',x})};
function findName(n){n=nm(n).toLowerCase();if(!n)return null;for(const o of clients.values())if(o.name&&o.name.toLowerCase()===n)return o;return null}
function onChat(c,m){const x=nm(m.x).slice(0,CHAT_LEN);if(!x)return;
  if(!chatOk(c)){csys(c,'너무 빨리 보내고 있습니다. 잠시 뒤에 다시 보내세요');return}
  const ch=m.ch==='party'||m.ch==='w'?m.ch:'all',ts=Date.now();
  if(ch==='all'){const o={t:'chat',ch,from:c.id,n:c.name,x,p:c.room?1:0,ts};lobbycast(o);HIST.push({from:c.id,n:c.name,x,ts});if(HIST.length>HIST_MAX)HIST.shift();return}
  // 옛 게임(v18)은 ch를 모르므로 글 앞에 채널을 붙여 보낸다
  const out=(d,o)=>send(d,d.cv>=19?o:Object.assign({},o,{x:(ch==='w'?'(귓속말) ':'(파티) ')+o.x}));
  if(ch==='party'){if(!c.room){csys(c,'파티에 들어가 있지 않습니다');return}
    const o={t:'chat',ch,from:c.id,n:c.name,x,p:1,ts};for(const d of clients.values())if(d.room===c.room)out(d,o);return}
  const d=(m.to&&clients.get(+m.to))||findName(m.tn);
  if(!d||!d.name){csys(c,`${nm(m.tn)||'그 사람'}님은 지금 접속해 있지 않습니다`);return}
  if(d===c){csys(c,'자기 자신에게는 귓속말을 보낼 수 없습니다');return}
  const o={t:'chat',ch,from:c.id,n:c.name,to:d.id,tn:d.name,x,p:c.room?1:0,ts};out(d,o);send(c,o)}
function onMsg(c,s){if(!s)return;let m;try{m=JSON.parse(s)}catch(_){return}
  if(m.t==='me'){c.name=nm(m.name).slice(0,16)||'모험가';c.cls=String(m.cls||'').slice(0,12);c.lvl=m.lvl|0;c.cv=Math.min(999,m.cv|0);
    if(!c.hist&&c.cv>=19){c.hist=true;if(HIST.length)send(c,{t:'chist',list:HIST})}who();return}
  if(m.t==='join'){if(m.name)c.name=nm(m.name).slice(0,16)||'모험가';if(!c.name)c.name='모험가';if(c.room)return;
    if(m.t==='join'&&m.cv)c.cv=Math.max(c.cv,Math.min(999,m.cv|0));
    let R;
    if(m.host){R={rid:c.id,host:c.id};ROOMS.set(R.rid,R)}
    else{const d=m.to&&clients.get(+m.to);// 초대한 사람(또는 그 방의 누구든)의 방으로
      R=d&&d.room?ROOMS.get(d.room):m.to?null:bestRoom();
      if(!R){send(c,{t:'err',msg:m.to?'그 사람의 파티가 이제 없습니다. 다시 초대를 받거나 방 만들기를 누르세요':'아직 방이 없습니다. 먼저 한 사람이 방 만들기를 누르세요'});return}}
    c.room=R.rid;c.lastG=Date.now();console.log(`+ ${c.name} ${R.host===c.id?'방을 만듦':'파티 참가'} (방 ${R.rid})`);
    send(c,{t:'joined',id:c.id,host:R.host,rid:R.rid});roomcast({t:'peer',id:c.id,name:c.name},c.id,R.rid);who();return}
  if(m.t==='hb'){c.hb=1;return}
  if(!c.name)return;
  if(m.t==='part'){part(c);who();return}
  if(m.t==='chat'){onChat(c,m);return}
  if(m.t==='inv'||m.t==='invr'){const d=clients.get(m.to);if(!d||!d.name||d===c)return;
    if(m.t==='inv'&&!c.room)return;send(d,{t:m.t,from:c.id,n:c.name,ok:m.ok?1:0});return}
  if(!c.room)return;
  m.from=c.id;c.lastG=Date.now();
  // to가 있으면 그 사람에게만, 없으면 방 안의 모두에게
  if(m.to){const d=clients.get(m.to);if(d&&d.room===c.room)send(d,m)}else roomcast(m,c.id,c.room);
}
setInterval(()=>{for(const c of clients.values())raw(c,9,Buffer.alloc(0))},20000);
// v50: 말 없는 연결 끊기 · 멈춘 방장 넘기기
setInterval(()=>{const now=Date.now();
  for(const c of [...clients.values()])if(c.hb&&now-c.last>DEAD_MS){console.log(`- ${c.name||'손님'} ${Math.round((now-c.last)/1000)}초 동안 말이 없어 연결을 끊음`);drop(c)}
  let ch=0;for(const R of [...ROOMS.values()]){const H=clients.get(R.host);if(!H){ROOMS.delete(R.rid);continue}if(!hostStale(H))continue;
    const n=nextHost(R,H.id);if(n){giveHost(R,n,`화면이 ${Math.round((now-H.lastG)/1000)}초 멈춤`);ch=1}}
  if(ch)who()},2000);
server.on('error',e=>{if(e.code==='EADDRINUSE')console.log(`\n  ${PORT}번 포트를 이미 쓰고 있습니다. 서버가 이미 켜져 있는지 확인하세요.\n`);else console.log(e.message)});
server.listen(PORT,()=>{
  const ips=[];for(const l of Object.values(os.networkInterfaces()))for(const a of l||[])if(a.family==='IPv4'&&!a.internal)ips.push(a.address);
  console.log('\n  아르세이아의 견습생 · 같이 하기 서버가 켜졌습니다\n');
  console.log(`  이 컴퓨터에서:      http://localhost:${PORT}`);
  for(const ip of ips)console.log(`  같은 와이파이 친구: http://${ip}:${PORT}`);
  console.log(APP?'  게임 창(앱으로 설치): 켜짐':'  게임 창(앱으로 설치): 꺼짐 (app 폴더 없음)');
  console.log(FB?`  구글 로그인: 켜짐 (${FB.projectId})`:'  구글 로그인: 꺼짐 (FIREBASE_CONFIG 없음)');
  console.log('\n  끄려면 이 창을 닫거나 Ctrl+C\n');
  if(process.argv.includes('--open')){const u='http://localhost:'+PORT,cmd=process.platform==='win32'?`start "" "${u}"`:process.platform==='darwin'?`open "${u}"`:`xdg-open "${u}"`;require('child_process').exec(cmd,()=>{})}
});
