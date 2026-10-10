/* ---------- v25 성벽에 걸친 던전 문 옮기기 (사용자 2026-10-10 09:22 「봉인 서고가 성벽에 걸쳐 있는데 고쳐야 돼」) ----------
   · 3막 던전 문(act3-21.js)은 v21 마을 크기에 맞춰 자리를 잡았는데, v22에서 아르덴을 1.5배로 넓히며 성벽을 바깥으로 다시 세워(town22.js tw22Walls)
     「봉인 서고」 문이 서쪽 성벽 위에 놓였다(문 (-685,84) · 성벽 x=-705).
   · 마을 넓히기가 끝난 뒤, 던전 문(DM21GATES)이 성벽 · 성탑 · 울타리 · 건물에 걸쳤으면
     같은 방향으로 안전 지대(tSafe) 바깥, 성벽 밖 빈자리를 다시 찾는다(dm21FindSpot과 같은 규칙: 물 · 막힌 땅 · 다른 입구 · 건물에서 떨어진 곳).
   · 걸리지 않은 문은 그대로. 규칙 · 숫자 · 저장은 바꾸지 않는다(문 자리는 저장되지 않음). */
const WALL25={K:new Set(['cwall','gatetower','fence']),PAD:60,moved:[]};
// 문 d가 성벽 · 울타리 · 건물 발자리에 걸쳤나
function wall25Hit(L,d,pad){pad=pad==null?WALL25.PAD:pad;for(const o of L.decor){if(o===d||!o.foot||o.dm21g||o.use)continue;if(!(WALL25.K.has(o.k)||o.k==='bld'||o.k==='house'))continue;
    for(const f of o.foot)if(d.x>f[0]-pad&&d.x<f[2]+pad&&d.y>f[1]-pad&&d.y<f[3]+pad)return o}return null}
function wall25Fix(){const out=[];for(const g of DM21GATES){const d=g.d;if(!d)continue;const L=dm21Layer(g.reg);if(!L)continue;
    const T=(L.towns||[]).slice().sort((a,b)=>Math.hypot(a.x-d.x,a.y-d.y)-Math.hypot(b.x-d.x,b.y-d.y))[0];
    const hit=wall25Hit(L,d);if(!hit)continue;
    const a0=T?Math.atan2(d.y-T.y,d.x-T.x):0,i=L.decor.indexOf(d),li=L.lights.findIndex(l=>l.dm21g===g.id);
    if(i>=0)L.decor.splice(i,1);// 자기 자신은 빈자리 찾기에서 빼고
    let p=null;const r0=(T?tSafe(T):SAFE)+160;for(const r1 of [r0+500,r0+900,r0+1400]){p=dm21FindSpot(g.reg,T,a0,{r0,r1});if(p&&!wall25Hit(L,p)&&DM21GATES.every(o=>o===g||!o.d||o.reg!==g.reg||Math.hypot(o.d.x-p.x,o.d.y-p.y)>360))break;p=null}
    L.decor.push(d);if(!p)continue;const from={x:d.x,y:d.y};d.x=p.x;d.y=p.y;d._s=null;if(li>=0){L.lights[li].x=p.x;L.lights[li].y=p.y-20}
    out.push({id:g.id,from,to:p,why:hit.k})}
  if(out.length&&typeof REG!=='undefined'&&REG.id==='home'&&!DG&&!IN){try{setArr(decor,HOME.decor);setArr(LIGHTS,HOME.lights);chunks.clear();mmBg=null}catch(e){if(window.__QA)throw e}}
  WALL25.moved.push(...out);return out}
try{wall25Fix()}catch(e){if(window.__QA)throw e}
window.__wall25={WALL25,wall25Hit,wall25Fix};
