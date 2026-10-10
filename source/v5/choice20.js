/* ---------- v20 Q2 고르는 의뢰 (설계: rpg/v20-ideas/code/choice-quests.js) ----------
   v18 마을 의뢰 6개(rw1 dg1 wc1 sh2 tm1 gh2)를 받을 때 두 갈래 중 하나를 고른다. 고른 갈래는 P.sq.ch[id]='a'|'b' (sq.js sqClean이 남김).
   고른 갈래의 말·목표·끝말·보상이 원래 것을 덮는다(getter). 포기하면 다시 고를 수 있다. 다음 의뢰(req)는 갈래와 상관없이 열린다.
   echo: 그 갈래를 고른 사람에게만 나중 의뢰에 한 줄 + 작은 덤(상자 하나 더 · 장비 하나 더 · 보스 10% 느림 · 보스 생명력 −10%).
   보상 금화는 지금 게임 값(a 갈래 = 원래 의뢰)에 맞춰 설계 비율대로 줄이고 늘린다. */
const CHOICE={
 rw1:{ask:'…그런데 말이야, 들개들이 원래 이렇게 마을 가까이 오진 않았어. 돌무덤 쪽에서 쫓겨 온 건지도 몰라.',
  a:{btn:'들개를 잡는다',say:'그래, 일단 양부터 지키자고. 열 마리면 된다.',goals:[{type:'kill',k:['h_hound'],n:10,d:'황야 들개 처치'}],done:'오늘 밤엔 양들이 울지 않는군. 고마워, 많진 않지만 받아 줘.',rw:{xp:1,gold:340,pot:2}},
  b:{btn:'들개를 쫓아낸 것을 찾는다',say:'돌무덤 사이를 어슬렁대는 돌무덤 전사들이 들개 굴을 짓밟았다는 소문이 있어. 놈들을 쓰러뜨리면 들개들도 제 굴로 돌아가겠지.',goals:[{type:'kill',k:['h_cairn'],n:8,d:'돌무덤 전사 처치'}],
     done:'정말이네, 들개들이 언덕 너머로 돌아갔어. 양도 들개도 살았군. 넌 생각이 깊은 사람이야.',rw:{xp:1.3,gold:200,pot:2},echo:{rw5:{done:'(오스크) 들개들이 요즘은 마을 대신 망령을 쫓더라. 네 덕이야.'}}}},
 dg1:{ask:'…아, 그리고 도적 중에 어린 녀석 하나가 있다던데. 굶어서 들어간 거라는 말도 있고.',
  a:{btn:'도구를 되찾는다',say:'도적놈들을 쫓아가 여섯 벌만 되찾아 줘.',goals:[{type:'collect',k:['c_bandit'],p:.5,n:6,item:'발굴 도구',d:'협곡 도적에게서 발굴 도구 되찾기'}],done:'내 곡괭이! 손잡이에 이름까지 새겨 뒀는데 돌아왔군. 고마워, 이건 수고비야.',rw:{xp:1,gold:420,pot:2}},
  b:{btn:'어린 도적을 찾아 설득한다',say:'협곡 도적 몇 놈을 쫓아내다 보면 그 녀석이 숨은 곳이 나올 거야. 도구를 돌려주면 일자리를 주겠다고 전해 줘.',goals:[{type:'kill',k:['c_bandit'],n:6,d:'협곡 도적 쫓아내기'},{type:'find',use:'dg_kidcamp',d:'협곡 바위틈에서 어린 도적 레트 찾기'}],
     done:'(레트가 고개를 숙이고 곡괭이를 내민다) 레트라고? 좋아, 내일부터 발굴단 짐꾼이다. 도구도 사람도 되찾았군.',rw:{xp:1.2,gold:260,pot:2},echo:{dg3:{say:'(레트) 보물고 안쪽 왼쪽 벽은 도적왕도 몰라요. 거기 상자 하나 더 있어요!',bonus:{chest:1}}}}},
 wc1:{ask:'…솔직히 말하면, 저 녀석들 가운데 내 조카도 있어.',
  a:{btn:'산길을 정리한다',say:'산채의 법대로 하겠네. 열 놈만 쫓아내 주게.',goals:[{type:'kill',k:['k_rogue'],n:10,d:'변절한 산사람 처치'}],done:'씁쓸하지만 해야 할 일이었네. 산채의 술 한 병과 함께 받아 두게.',rw:{xp:1,gold:380,pot:2}},
  b:{btn:'조카를 데려온다',say:'고원곰 굴 근처에 놈들 야영지가 있다더군. 곰을 몇 마리 치워 주면 그 녀석이 겁을 먹고 내 말을 들을지도 몰라. 조카 이름은 하쿤이야.',goals:[{type:'kill',k:['k_bear'],n:6,d:'야영지 둘레의 잿빛 고원곰 처치'},{type:'find',use:'wc_rogcamp',d:'변절자 야영지에서 하쿤 데려오기'}],
     done:'하쿤… 이 못난 녀석. 그래도 살아 돌아왔으니 됐다. 이 은혜는 산채가 잊지 않겠네.',rw:{xp:1.3,gold:240,pot:2,tp:1},echo:{wc4:{done:'(하쿤) 천둥뿔이 쓰러진 자리에 이걸 묻어 두려고 했어요. 받아요.',bonus:{item:1}}}}},
 sh2:{ask:'…아니면 모래 정령들 속에 든 맑은 핵을 쓰는 방법도 있다는데, 그건 위험해요.',
  a:{btn:'모래 백합을 캔다',say:'오아시스 둘레에서 다섯 포기만 캐 주세요.',goals:[{type:'gather',use:'sh_lily',n:5,item:'모래 백합',d:'오아시스 둘레에서 모래 백합 캐기'}],done:'백합을 띄우니 빛이 한결 옅어졌어요. 완전히 사라진 건 아니지만… 고마워요, 이건 샘지기의 감사예요.',rw:{xp:.8,gold:340,pot:3}},
  b:{btn:'모래 정령의 핵을 쓴다',say:'정말요? 모래 정령 핵 넷이면 충분할 거예요. 조심하세요!',goals:[{type:'collect',k:['d_sand'],p:.4,n:4,item:'맑은 모래 핵',d:'모래 정령에게서 맑은 핵 모으기'}],
     done:'와… 샘 바닥이 보여요! 보랏빛이 완전히 걷혔어요. 그런데 핵 하나가 아직 떨려요. 문 조각과 닮은 떨림이에요…',rw:{xp:1.1,gold:240,pot:2},echo:{sh3:{say:'(메흐라) 핵을 쓴 뒤로 미라들이 샘이 아니라 무덤 쪽으로 돌아가요. 무덤 문이 반쯤 열려 있을 거예요.'}}}},
 tm1:{ask:'…그런데 저 주술사들, 흉내만 내는 게 아니라 뭔가에게 박자를 바치는 것 같기도 해.',
  a:{btn:'주술사를 잡는다',say:'마을 둘레 주술사 열 마리만 잡아 주게.',goals:[{type:'kill',k:['j_lizard'],n:10,d:'도마뱀 주술사 처치'}],done:'오늘 밤은 숲이 조용하군. 이제야 내 북소리가 제 소리로 들리겠어. 고맙네.',rw:{xp:.9,gold:430,pot:2}},
  b:{btn:'북소리를 따라가 본다',say:'그럼 오늘 밤 내가 북을 칠 테니, 되돌아오는 소리를 따라가 보게. 숲 속 세 군데에서 소리가 날 걸세.',
     goals:[{type:'use',use:'tm_drum1',d:'첫 번째 메아리 북 찾기'},{type:'use',use:'tm_drum2',d:'두 번째 메아리 북 찾기'},{type:'use',use:'tm_drum3',d:'세 번째 메아리 북 찾기'},{type:'kill',k:['j_lizard'],n:4,d:'북을 지키던 주술사 처치'}],
     done:'북 가죽에 보랏빛 돌가루가… 놈들은 신전 안의 무언가에게 박자를 바치고 있었군. 고맙네, 자네 덕에 진짜 적이 보여.',rw:{xp:1.2,gold:300,pot:2},echo:{tm4:{say:'(아하르) 자네가 찾은 북 셋을 내가 다시 쳐 두겠네. 그림자가 그 박자에 흔들릴 걸세.',bonus:{bossSlow:.1}}}}},
 gh2:{ask:'…아니, 잠깐. 차라리 내가 직접 번개 수호석에서 측정값을 더 모으는 게 나을지도 모르겠군.',
  a:{btn:'일지를 전한다',say:'남쪽 마지막 등불 초소의 기록관 미로에게 전해 주게.',goals:[{type:'talk',npc:'ll_miro',item:'폭풍 일지 사본',d:'마지막 등불의 기록관 미로에게 폭풍 일지 전하기'}],turn:'ll_miro',
     done:'(미로) 갈매기 등대의 폭풍 일지라니! 보세요, 번개가 몰린 밤과 균열이 크게 숨 쉰 밤이 거의 겹쳐요. 이건 제 몫의 수고비예요.',rw:{xp:1,gold:460,tp:2}},
  b:{btn:'측정값을 더 모은다',say:'번개 수호석 넷을 깨면 안에 쌓인 번개 흔적이 나오네. 그걸 일지에 붙여 미로에게 가져가 주게.',
     goals:[{type:'collect',k:['t_sentinel'],p:.5,n:4,item:'번개 흔적',d:'번개 수호석에서 번개 흔적 모으기'},{type:'talk',npc:'ll_miro',item:'측정값을 붙인 폭풍 일지',d:'마지막 등불의 기록관 미로에게 일지 전하기'}],turn:'ll_miro',
     done:'(미로) 측정값까지! 이제 확실해요. 균열이 숨 쉴 때마다 번개가 끌려가요. 다음 큰 숨이 언제일지 맞힐 수 있겠어요.',rw:{xp:1.4,gold:360,tp:2},echo:{ll4:{say:'(미로) 오르뎀 어르신 측정값 덕에 눈이 언제 뜨는지 알아요. 지금 가면 반쯤 감겨 있을 거예요.',bonus:{bossHp:-.1}}}}}};
const CHOICE_SPOTS={
  dg_kidcamp:{region:'canyon',at:'협곡 바위틈 야영 흔적',n:'어린 도적 레트',k:'campfire',lab:'어린 도적 레트 설득하기'},
  wc_rogcamp:{region:'highland',at:'고원곰 굴 옆 변절자 야영지',n:'하쿤',k:'campfire',lab:'하쿤 데려오기'},
  tm_drum1:{region:'jungle',at:'마을 북쪽 덩굴 아래',n:'메아리 북',k:'edrum',lab:'메아리 북 두드리기'},
  tm_drum2:{region:'jungle',at:'마을 동쪽 늪가',n:'메아리 북',k:'edrum',lab:'메아리 북 두드리기'},
  tm_drum3:{region:'jungle',at:'신전 가는 길 바위 위',n:'메아리 북',k:'edrum',lab:'메아리 북 두드리기'}};
const CH_BOSS={tm4:'r_kali',ll4:'r_nyxar',dg3:'b_titanguard'};
const chOf=id=>{const s=P&&P.sq;return s&&s.ch&&typeof s.ch==='object'?s.ch[id]||null:null};
// 원래 의뢰를 갈래 getter로 바꾼다 (a 갈래 = 지금 게임 값, b 갈래 금화는 설계 비율로)
for(const id in CHOICE){const q=SQBY[id],C=CHOICE[id];if(!q)continue;const base={say:q.say,goals:q.goals,done:q.done,rw:q.rw,turn:q.turn};q._chBase=base;q.choice=1;
  const k=C.a.rw.gold?base.rw.gold/C.a.rw.gold:1;C.a.goals=base.goals;C.a.rw=base.rw;C.b.rw=Object.assign({},C.b.rw,{gold:Math.round(C.b.rw.gold*k/10)*10});if(base.turn&&!C.a.turn)C.a.turn=base.turn;
  const br=()=>{const c=chOf(id);return c&&C[c]?C[c]:null};
  Object.defineProperty(q,'say',{configurable:true,enumerable:true,get(){const b=br();return b?b.say:base.say+' '+C.ask},set(v){base.say=v}});
  Object.defineProperty(q,'goals',{configurable:true,enumerable:true,get(){const b=br();return b?b.goals:base.goals},set(v){base.goals=v}});
  Object.defineProperty(q,'done',{configurable:true,enumerable:true,get(){const b=br();return b?b.done:base.done},set(v){base.done=v}});
  Object.defineProperty(q,'rw',{configurable:true,enumerable:true,get(){const b=br();return b?b.rw:base.rw},set(v){base.rw=v}});
  Object.defineProperty(q,'turn',{configurable:true,enumerable:true,get(){const b=br();return b&&b.turn||base.turn},set(v){base.turn=v}})}
// echo: 나중 의뢰의 말 · 끝말에 한 줄
const CH_ECHO={};for(const id in CHOICE)for(const c of ['a','b']){const e=CHOICE[id][c].echo;if(e)for(const t in e)(CH_ECHO[t]=CH_ECHO[t]||[]).push({src:id,c,...e[t]})}
const chEcho=t=>(CH_ECHO[t]||[]).filter(x=>chOf(x.src)===x.c);
for(const t in CH_ECHO){const q=SQBY[t];if(!q)continue;const d0=Object.getOwnPropertyDescriptor(q,'say'),d1=Object.getOwnPropertyDescriptor(q,'done');let s0=q.say,e0=q.done;
  Object.defineProperty(q,'say',{configurable:true,enumerable:true,get(){const x=chEcho(t).filter(x=>x.say).map(x=>x.say);const b=d0&&d0.get?d0.get.call(q):s0;return x.length?b+' '+x.join(' '):b},set(v){if(d0&&d0.set)d0.set.call(q,v);else s0=v}});
  Object.defineProperty(q,'done',{configurable:true,enumerable:true,get(){const x=chEcho(t).filter(x=>x.done).map(x=>x.done);const b=d1&&d1.get?d1.get.call(q):e0;return x.length?b+' '+x.join(' '):b},set(v){if(d1&&d1.set)d1.set.call(q,v);else e0=v}})}
// 받기: 두 단추 (고르기 전에는 「의뢰 받기」 대신)
function chAccept(id,c){const q=SQBY[id];if(!q||!CHOICE[id]||!CHOICE[id][c]||sqAvail(q)!=='ok')return false;const s=sqState();if(!v20Obj(s.ch))s.ch={};s.ch[id]=c;sqAccept(id);if(!s.a[id]){delete s.ch[id];return false}
  msg(`갈래를 골랐습니다: 「${CHOICE[id][c].btn}」`,'#9fe0ff');const g=sqFolk(q.giver);if(g){g.say=CHOICE[id][c].say;g.sayT=time+5}return true}
V20A.chpick=v=>{const [id,c]=String(v).split(':');chAccept(id,c)};
{const _acc=sqAccept;sqAccept=function(id){if(CHOICE[id]){const s=sqState();if(!v20Obj(s.ch))s.ch={};if(!s.ch[id])s.ch[id]='a'}return _acc.apply(this,arguments)}}
{const _ab=sqAbandon;sqAbandon=function(id){const r=_ab.apply(this,arguments);const s=sqState();if(CHOICE[id]&&!s.a[id]&&!(s.d[id]>0)&&v20Obj(s.ch))delete s.ch[id];return r}}
const chRwTxt=r=>[`경험치 ×${r.xp}`,`금화 ${r.gold}`,r.pot?`물약 ${r.pot}개씩`:'',r.tp?`귀환 두루마리 ${r.tp}장`:''].filter(Boolean).join(' · ');
{const _n=sqNpcHtml;sqNpcHtml=function(){let h=_n();for(const id in CHOICE){const q=SQBY[id];if(!q)continue;const key=`data-sqacc="${id}">의뢰 받기</button>`;if(!h.includes(key)||chOf(id))continue;const C=CHOICE[id];
  const box=`<div class="v20box"><h3>어떻게 할까요? <span class="muted" style="font-weight:400">한 번 고르면 끝날 때까지 바꿀 수 없습니다 (포기하면 다시 고름)</span></h3>${['a','b'].map(c=>`<div class="v20row"><div><b>${C[c].btn}</b><div class="muted" style="font-size:12px">${C[c].goals.map(g=>g.d).join(' · ')}</div><div class="muted" style="font-size:12px">보상: ${chRwTxt(C[c].rw)}</div></div><div class="btns">${v20Btn('chpick',id+':'+c,'이렇게 하기',{cls:c==='a'?'primary':''})}</div></div>`).join('')}</div>`;
  h=h.replace(`<button class="primary" type="button" ${key}`,box)}return h}}
/* ===== 새 자리: 협곡 야영 흔적 · 변절자 야영지 · 메아리 북 셋 ===== */
twDef('edrum',60,70,30,54,(g,v)=>{Kit.shadow(g,4,2,18,6,.85);twCyl(g,0,0,0,13,20,'#7a4a2a',{bands:[.2,.8],bandC:'#3a2414'});const t=isoP(0,0,20);g.fillStyle='#d8c090';g.beginPath();g.ellipse(t.x,t.y,13*KI*1.414,13*KI*.707,0,0,6.283);g.fill();
  g.fillStyle='rgba(140,90,200,.55)';g.beginPath();g.ellipse(t.x,t.y,6,3,0,0,6.283);g.fill();g.strokeStyle='#5a3a20';g.lineWidth=1.2;for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(t.x+i*5,t.y+2);g.lineTo(t.x+i*6,t.y+18);g.stroke()}});
const CH_SPOT={};
{const used=[];for(const sid in CHOICE_SPOTS){const S0=CHOICE_SPOTS[sid],L=RCACHE[S0.region];if(!L||!L.town)continue;const T=L.town,ok=L.lq?(L.okT||(L.okT=wxReach(L.lq,T.x,T.y))):null,rg=v20Rng(v20Hash(sid));let p=null;
  for(let k=0;k<160&&!p;k++){const a=rg()*6.283,r=560+rg()*520,x=T.x+Math.cos(a)*r,y=T.y+Math.sin(a)*r;if(x<200||y<200||x>WORLD-200||y>WORLD-200)continue;if(wxLiq(L,x,y)||(ok&&!wxCanReach(ok,x,y)))continue;
    if(Math.hypot(x-T.x,y-T.y)<TOWN_R+160||used.some(u=>Math.hypot(u.x-x,u.y-y)<160)||L.decor.some(d=>(d.use||d.k==='cave'||d.k==='edgeportal')&&Math.hypot(d.x-x,d.y-y)<120)||(L.caves||[]).some(c=>Math.hypot(c.x-x,c.y-y)<160)||(L.edges||[]).some(e=>Math.hypot(e.x-x,e.y-y)<160))continue;p={x,y}}
  if(!p)p={x:T.x+620,y:T.y+120};used.push(p);for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(!d.use&&!d.town&&!d.tprop&&d.k!=='tfolk'&&d.k!=='cave'&&d.k!=='edgeportal'&&d.k!=='npc'&&Math.hypot(d.x-p.x,d.y-p.y)<46)L.decor.splice(i,1)}
  L.decor.push({x:p.x,y:p.y,k:S0.k,pv:0,use:sid,si:0,qonly:1,tprop:1,s:1,v:0,zl:0});SQSPOT[sid]=[{x:p.x,y:p.y}];WXSPOT_REG[sid]=S0.region;CH_SPOT[sid]={reg:S0.region,x:p.x,y:p.y,label:`${REGIONS[S0.region].n} · ${S0.at}`}}
  v20SyncDecor()}
{const _l=sqUseLive;sqUseLive=function(d){const S0=d&&CHOICE_SPOTS[d.use];if(!S0)return _l(d);const h=sqUseQ(d.use);if(!h)return null;const a=sqState().a[h.q.id];if(!a||(h.q.goals[h.j].type==='find'&&a.got.includes(d.si)))return null;return{label:S0.lab,col:'#ffd34d',q:1}}}
{const _u=sqUse;sqUse=function(d){const S0=d&&CHOICE_SPOTS[d.use];if(!S0)return _u(d);const h=sqUseQ(d.use);if(!h)return;const a=sqState().a[h.q.id],g=h.q.goals[h.j];if(g.type==='find'){if(a.got.includes(d.si))return;a.got.push(d.si)}
  rings.push({x:d.x,y:d.y,r:8,max:110,life:.8,col:'#ffd34d'});burst(d.x,d.y,S0.k==='edrum'?'#b48aff':'#ffd98a',18,100,3,24);if(S0.k==='edrum'){shake=Math.max(shake,3);rings.push({x:d.x,y:d.y,r:8,max:200,life:1,col:'#b48aff'})}
  msg(S0.k==='edrum'?'둥— 둥— 메아리 북이 대답합니다':`${S0.n}${v20J(S0.n,'를','을')} 찾았습니다. 의뢰인에게 돌아가세요`,'#9fe0ff');sqProgress(h.q,h.j,1,true)}}
{const _t=sqTarget;sqTarget=function(q){if(!q||!q.choice)return _t(q);const a=sqState().a[q.id];if(a&&!sqAllDone(q))for(let j=0;j<q.goals.length;j++){if(sqGoalDone(q,j))continue;const g=q.goals[j];if(g.use&&CH_SPOT[g.use])return CH_SPOT[g.use];break}return _t(q)}}
{const _m=sqMarks;sqMarks=function(world){const o=_m(world);if(world||IN||DG||!P)return o;const s=sqState();for(const id in s.a){const q=SQBY[id];if(!q||!q.choice)continue;q.goals.forEach((g,j)=>{const sp=g.use&&CH_SPOT[g.use];if(sp&&sp.reg===REG.id&&!sqGoalDone(q,j))o.push({x:sp.x,y:sp.y,kind:'dot',col:'#ffd34d'})})}return o}}
/* ===== echo 덤 ===== */
const chBonus=t=>{for(const x of chEcho(t))if(x.bonus)return x.bonus;return null};
{const _f=sqFinish;sqFinish=function(id){const s=sqState(),n0=s.d[id]|0;const bo=chBonus(id);const q=SQBY[id];_f.apply(this,arguments);if((s.d[id]|0)<=n0||!bo||!bo.item)return;
  const it=makeItem(Math.max(q.lvl,P.lvl-2),true);if(P.bag.length<BAG_MAX){P.bag.push(it);msg(`덤: ${it.name}`,RAR[it.rar].c)}else loot.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),kind:'item',item:it,t:0,keep:1})}}
// 보물고 상자 하나 더 (dg3 · 수호 거상을 쓰러뜨릴 때)
{const _rk=rewardKill;rewardKill=function(e){_rk.apply(this,arguments);if(!P||GHOST||e.k!==CH_BOSS.dg3||!DG)return;const s=sqState();if(!s.a.dg3)return;const bo=chBonus('dg3');if(!bo||!bo.chest)return;
  loot.push({x:e.x+rnd(-50,50),y:e.y+rnd(-50,50),kind:'item',item:makeItem(e.lvl,true),t:0});msg('레트가 말한 왼쪽 벽 상자에서 장비가 하나 더 나왔습니다','#ffd34d')}}
// 보스: 칼리 이동 10% 느림 · 니크사르 생명력 −10% (주인 · 혼자일 때 적에 적용)
V20.tick.push(dt=>{if(!P||NET.guest)return;const s=sqState();for(const e of enemies){if(e.dead)continue;
  if(e.k===CH_BOSS.ll4&&!e._chHp&&s.a.ll4){e._chHp=1;const bo=chBonus('ll4');if(bo&&bo.bossHp){const k=1+bo.bossHp;e.max=Math.round(e.max*k);e.hp=Math.min(e.hp,e.max);msg('니크사르의 눈이 반쯤 감겨 있습니다 (생명력 −10%)','#9fe0ff')}}
  if(e.k===CH_BOSS.tm4&&s.a.tm4){const bo=chBonus('tm4');if(bo&&bo.bossSlow&&e._px!=null&&!(e.dash>0)){e.x=e._px+(e.x-e._px)*(1-bo.bossSlow);e.y=e._py+(e.y-e._py)*(1-bo.bossSlow)}e._px=e.x;e._py=e.y}}});
window.__v20=window.__v20||{};Object.assign(window.__v20,{CHOICE,CHOICE_SPOTS,CH_SPOT,CH_ECHO,chOf,chAccept,chEcho,chBonus});
