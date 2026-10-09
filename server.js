// 아르세이아의 견습생 · 같이 하기 서버
// 설치할 것 없이 Node.js만 있으면 됩니다:  node server.js   (포트를 바꾸려면 PORT=9000 node server.js)
// 하는 일: game.html을 보여 주고, 접속한 사람들 사이에 메시지(게임·대화·파티 초대)를 전달합니다. 게임 계산은 방장의 브라우저가 합니다.
// v19: 대화 채널(전체 · 파티 · 귓속말), 최근 전체 대화 30줄(메모리에만, 재시작하면 사라짐), 5초에 5번까지.
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
const clients=new Map();let nextId=1,hostId=0;
// v19 대화: 최근 「전체」 대화만 메모리에 30줄 (저장하지 않음)
const HIST=[],HIST_MAX=30,CHAT_N=5,CHAT_MS=5000,CHAT_LEN=120;

// game.html을 읽어 쪽 하나로 감싸고 gzip까지 해 둔다. game.html이 바뀌면(수정 시각·크기) 다시 만든다.
let PACK=null;
function pagePack(cb){fs.stat(GAME,(e,st)=>{if(e)return cb(e);const key=st.mtimeMs+':'+st.size;if(PACK&&PACK.key===key)return cb(null,PACK);
  fs.readFile(GAME,(err,buf)=>{if(err)return cb(err);
    const raw=Buffer.from('<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'+APPHEAD+'<script>window.COOP_SERVER=1'+(FB?';window.FIREBASE_CONFIG='+JSON.stringify(FB).replace(/</g,'\\u003c'):'')+'</script></head><body>'+buf.toString('utf8')+'</body></html>');
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
  {const m=/^\/img\/(flare-[a-z0-9_-]+\.js)$/.exec(req.url.split('?')[0]);if(m){const f=path.join(__dirname,'img',m[1]);
    fs.stat(f,(e,st)=>{if(e||!st.isFile()){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Content-Length':st.size,'Cache-Control':'public, max-age=604800'});fs.createReadStream(f).pipe(res)});return}}
  if(req.url==='/sw.js'||req.url.startsWith('/app/')){appFile(req,res);return}
  if(req.url==='/status'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({players:clients.size,inParty:[...clients.values()].filter(c=>c.room).length,host:hostId}));return}
  res.writeHead(404);res.end();
});

// ---- 웹소켓 (RFC 6455, 텍스트 메시지만) ----
server.on('upgrade',(req,sock)=>{
  const key=req.headers['sec-websocket-key'];if(!key||req.headers.upgrade.toLowerCase()!=='websocket'){sock.destroy();return}
  const acc=crypto.createHash('sha1').update(key+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+acc+'\r\n\r\n');
  sock.setNoDelay(true);
  const c={id:nextId++,sock,buf:Buffer.alloc(0),name:'',cls:'',lvl:0,room:false,cv:0,ct:[],hist:false};clients.set(c.id,c);
  send(c,{t:'hello',id:c.id,host:hostId,f:['chat2']});// f: 이 서버가 아는 것 (옛 게임은 무시)
  sock.on('data',d=>{c.buf=Buffer.concat([c.buf,d]);let m;while((m=readFrame(c))!==null){if(m===false){drop(c);return}onMsg(c,m)}});
  sock.on('close',()=>drop(c));sock.on('error',()=>drop(c));
});
function readFrame(c){const b=c.buf;if(b.length<2)return null;
  const op=b[0]&15,masked=b[1]&128;let len=b[1]&127,off=2;
  if(len===126){if(b.length<4)return null;len=b.readUInt16BE(2);off=4}else if(len===127){if(b.length<10)return null;len=Number(b.readBigUInt64BE(2));off=10}
  if(len>4*1048576)return false;
  const mo=off;if(masked)off+=4;if(b.length<off+len)return null;
  let p=b.subarray(off,off+len);if(masked){const mk=b.subarray(mo,mo+4);p=Buffer.from(p);for(let i=0;i<p.length;i++)p[i]^=mk[i&3]}
  c.buf=b.subarray(off+len);
  if(op===8)return false;if(op===9){raw(c,10,p);return''}if(op!==1)return'';return p.toString('utf8')}
function raw(c,op,p){const n=p.length;let h;if(n<126){h=Buffer.from([128|op,n])}else if(n<65536){h=Buffer.alloc(4);h[0]=128|op;h[1]=126;h.writeUInt16BE(n,2)}else{h=Buffer.alloc(10);h[0]=128|op;h[1]=127;h.writeBigUInt64BE(BigInt(n),2)}
  try{c.sock.write(Buffer.concat([h,p]))}catch(_){}}
function send(c,o){raw(c,1,Buffer.from(typeof o==='string'?o:JSON.stringify(o)))}
// 서버에 들어온 사람은 모두 "접속자"(대화·초대 가능), 그중 방에 들어간 사람만 게임 메시지를 주고받는다
function roomcast(o,except){const s=typeof o==='string'?o:JSON.stringify(o);for(const c of clients.values())if(c.room&&c.id!==except)send(c,s)}
function lobbycast(o){const s=typeof o==='string'?o:JSON.stringify(o);for(const c of clients.values())if(c.name)send(c,s)}
function who(){lobbycast({t:'who',host:hostId,list:[...clients.values()].filter(c=>c.name).map(c=>({id:c.id,n:c.name,c:c.cls,l:c.lvl,r:c.room?1:0}))})}
function part(c){if(!c.room)return;c.room=false;
  if(c.id===hostId){hostId=0;roomcast({t:'hostgone'});for(const o of clients.values())o.room=false;console.log(`- ${c.name} 방을 닫음`)}
  else{roomcast({t:'leave',id:c.id});console.log(`- ${c.name} 파티에서 나감`)}}
function drop(c){if(!clients.has(c.id))return;clients.delete(c.id);try{c.sock.destroy()}catch(_){}
  console.log(`- ${c.name||'손님'} 접속 끊김 (지금 ${clients.size}명)`);part(c);who()}
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
    const o={t:'chat',ch,from:c.id,n:c.name,x,p:1,ts};for(const d of clients.values())if(d.room)out(d,o);return}
  const d=(m.to&&clients.get(+m.to))||findName(m.tn);
  if(!d||!d.name){csys(c,`${nm(m.tn)||'그 사람'}님은 지금 접속해 있지 않습니다`);return}
  if(d===c){csys(c,'자기 자신에게는 귓속말을 보낼 수 없습니다');return}
  const o={t:'chat',ch,from:c.id,n:c.name,to:d.id,tn:d.name,x,p:c.room?1:0,ts};out(d,o);send(c,o)}
function onMsg(c,s){if(!s)return;let m;try{m=JSON.parse(s)}catch(_){return}
  if(m.t==='me'){c.name=nm(m.name).slice(0,16)||'모험가';c.cls=String(m.cls||'').slice(0,12);c.lvl=m.lvl|0;c.cv=Math.min(999,m.cv|0);
    if(!c.hist&&c.cv>=19){c.hist=true;if(HIST.length)send(c,{t:'chist',list:HIST})}who();return}
  if(m.t==='join'){if(m.name)c.name=nm(m.name).slice(0,16)||'모험가';if(!c.name)c.name='모험가';if(c.room)return;
    if(m.host){if(hostId&&clients.has(hostId)){send(c,{t:'err',msg:'이미 방장이 있습니다. 참가하기를 누르세요'});return}hostId=c.id}
    else if(!hostId){send(c,{t:'err',msg:'아직 방이 없습니다. 먼저 한 사람이 방 만들기를 누르세요'});return}
    c.room=true;console.log(`+ ${c.name} ${c.id===hostId?'방을 만듦':'파티 참가'}`);
    send(c,{t:'joined',id:c.id,host:hostId});roomcast({t:'peer',id:c.id,name:c.name},c.id);who();return}
  if(!c.name)return;
  if(m.t==='part'){part(c);who();return}
  if(m.t==='chat'){onChat(c,m);return}
  if(m.t==='inv'||m.t==='invr'){const d=clients.get(m.to);if(!d||!d.name||d===c)return;
    if(m.t==='inv'&&!c.room)return;send(d,{t:m.t,from:c.id,n:c.name,ok:m.ok?1:0});return}
  if(!c.room)return;
  m.from=c.id;
  // to가 있으면 그 사람에게만, 없으면 방 안의 모두에게
  if(m.to){const d=clients.get(m.to);if(d&&d.room)send(d,m)}else roomcast(m,c.id);
}
setInterval(()=>{for(const c of clients.values())raw(c,9,Buffer.alloc(0))},20000);
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
