/* v29 작업G: 실제 방어구의 방어력, 옛 아이템 이전, 레벨 차이 피해.
   feedback28/party28/cg28 뒤, qa/b5 앞. 기존 공격력·저장 필드는 바꾸지 않는다. */
const G29={K:10,base:2.5,maxRed:.75,normalCap:.5,bossCap:.6,
  rarity:[1,1.05,1.12,1.18,1.25,1.35],curve:[[-20,.25],[-10,.5],[0,1],[10,1.1],[15,1.58],[20,1.6]]};
function g29Armor(it){if(!it)return false;return it.slot==='robe'||it.slot==='hat'||(it.slot==='off'&&(it.wt==='shield'||(!it.wt&&it.cls==='warrior')))}
function g29Value(it){if(!g29Armor(it))return 0;const L=clamp(Number(it.il)||1,1,MAXLV+3),war=it.cls==='warrior'||it.wt==='plate'||it.wt==='shield';
  const share=it.slot==='robe'?(war?8:10):it.slot==='hat'?(war?4:5):3;return Math.max(1,Math.round(L*share*G29.rarity[clamp(it.rar|0,0,5)]))}
function g29Ensure(it){if(it&&typeof it==='object'&&it.stats&&!Object.prototype.hasOwnProperty.call(it,'defense'))it.defense=g29Value(it);return it}
function g29Total(g){let n=0;for(const it of Object.values(g||P.gear||{})){if(g29Armor(it)){g29Ensure(it);const a=Number(it.defense);if(Number.isFinite(a)&&a>0)n+=a}}return n}
function g29Reduction(a,L){a=Math.max(0,Number(a)||0);L=Math.max(1,Number(L)||1);return Math.min(G29.maxRed,a/(a+G29.K*L))}
function g29Curve(d){const p=G29.curve;if(d<=p[0][0])return p[0][1];for(let i=1;i<p.length;i++){const [x,a]=p[i-1],[y,b]=p[i];if(d<=y){const t=(d-x)/(y-x);return a+(b-a)*t*t*(3-2*t)}}return p[p.length-1][1]}
function g29Boss(src){const t=src&&TYPES[src.k];return !!(src&&(src._b24||src.boss||t&&(t.boss||t.mini)))}
function g29Source(e){return e?{k:e.k,lvl:e.lvl,mel:e.mel,_b24:e._b24,boss:g29Boss(e)?1:0,dead:false}:null}
function g29Damage(d,src,level,armor){if(!(d>0)||!src||!Number.isFinite(Number(src.lvl)))return d;
  const L=Math.max(1,Number(src.lvl)),curve=g29Curve(L-level),mul=G29.base*(g29Boss(src)?Math.min(1.1,curve):curve);
  return Math.max(1,d*mul*(1-g29Reduction(armor,L)))}
{const f=hitPlayer;hitPlayer=function(d,src,...args){return f.call(this,g29Damage(d,src,P.lvl,g29Total()),src,...args)}}
// 모든 생성 경로. 기존 등급·옵션·난수 굴림을 그대로 두고 필드 하나만 채운다.
{const f=makeItem;makeItem=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=makeHat;makeHat=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=makeItemV18;makeItemV18=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=makeBaseV18;makeBaseV18=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=makeCore21;makeCore21=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=j2MakeUniq;j2MakeUniq=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=j3MakeUniq;j3MakeUniq=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=w3Uniq;w3Uniq=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=e22MakeSet;e22MakeSet=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=e22MakeName;e22MakeName=function(){return g29Ensure(f.apply(this,arguments))}}
{const f=saveData;saveData=function(){for(const it of [...Object.values(P.gear||{}),...(P.bag||[])])g29Ensure(it);return f.apply(this,arguments)}}
ITEMTIP_LINES.push(it=>{g29Ensure(it);return `<div class="tt-s">방어력 ${g29Armor(it)?Math.max(0,Number(it.defense)||0):0}</div>`});
{const f=tipCmp;tipCmp=function(it,cur,sl){let h=f.apply(this,arguments);g29Ensure(it);g29Ensure(cur);const d=(g29Armor(it)?Number(it.defense)||0:0)-(g29Armor(cur)?Number(cur.defense)||0:0);
  return h+`<div class="tt-c" style="color:${d>0?'#8cf08a':d<0?'#ff8a7a':'#a39d8f'}">방어력 차이 ${d>0?'+':''}${d}</div>`}}
{const f=charHtml;charHtml=function(){const n=g29Total(),red=Math.round(g29Reduction(n,P.lvl)*100);return f.apply(this,arguments).replace('<h2>능력</h2>',`<div class="g29stats"><b>방어력 합계 ${n}</b><br>피해 감소 약 ${red}%(같은 레벨 몬스터 기준)</div><h2>능력</h2>`)}}
{const st=document.createElement('style');st.textContent='.g29stats{margin:8px 0;line-height:1.5;overflow-wrap:anywhere}#itip{max-width:min(300px,calc(100vw - 16px));max-height:calc(100dvh - 16px);overflow:auto;overflow-wrap:anywhere;pointer-events:auto}';document.head.appendChild(st)}
// 시험 도구에서 실제 게임 계산을 부르기 위한 읽기용 연결.
setTimeout(()=>{window.__armor29={G29,g29Armor,g29Value,g29Ensure,g29Total,g29Reduction,g29Curve,g29Damage,g29Source,hitPlayer,maxHp,itemTip,charHtml}},0);
