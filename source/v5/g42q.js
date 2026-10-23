/* ---------- v42 의뢰 다양화 (제안 15) · 3막 보강 (제안 16) ----------
   15) 55~100 마을 의뢰의 「잡아 와 · 모아 와」 15개를 새 종류로 바꾼다.
     · sneak 몰래 지나가기: 시작 자리에 서면 경비 몬스터가 선다(보는 거리 G42Q.sight). 들키거나(쫓아오거나 맞으면) 처음부터. 끝 자리까지 가면 끝.
     · rescue 구조: 갇힌 사람 곁에서 3초 동안 풀어 주고(그때 몬스터가 덮친다) 쉼터까지 데려온다(따라오는 동안 몇 번 덮친다). 사람은 다치지 않는다.
     · 같이 하기 손님: 몬스터는 방장만 부르므로, 손님은 경비 · 덮침 없이 자리만 밟으면 된다(quest30.js 와 같은 규칙).
   16) 3막 처치 목표 18개 중 9개를 던전 안의 장면 · 특별한 싸움으로 바꾼다 (던전 안에서만 움직임 · 자리는 들어갈 때마다 그 던전 방에서 고른다).
     · dgfind 찾기(주울 때마다 덮침) · dghold 버티기(정해진 시간 · 등불이 있으면 등불을 지킴) · dgrun 시간 안에 건너기 · dgorder 순서대로 손 얹기(틀리면 덮침)
     · dgtalk 말로 겨루기: 물음 셋. 다 맞히면 끝, 틀리면 그 상대가 덤비고 쓰러뜨려도 끝.
   · 저장: 새 칸 없음(진행은 P.sq 그대로). 이미 받아 둔 의뢰는 한 번만 옮긴다(P.g42.qmig): 예전 목표를 다 했으면 새 목표도 다 한 것으로, 아니면 처음부터. */
const G42Q={sight:140,run:{},res:{},dg:{},lock:0};
Q30.T.add('sneak');Q30.T.add('rescue');
const g42QL=(k,o)=>Object.assign({key:'g42q_'+k,body:'#5a4a3a',legs:'#3a3028',cape:'#4a3a2a',hair:'#3a2a1a',hs:1,hat:0},o);
/* ===== 15) 바꾸는 마을 의뢰 15개 ===== */
const G42Q_SQ={
 q36_h29_reed_camp_1:{kind:'구조',t:'갈대섬에 남은 뱃사공',say:'갑각수들이 어젯밤 또 배를 뒤집었어. 뱃사공 미로가 동쪽 갈대섬으로 헤엄쳐 올라갔는데, 녀석들이 섬을 빙 둘러싸고 있어서 못 나오고 있네. 밧줄에 엉킨 채로 말이야. 가서 풀어 주고 쉼터까지 데려와 주게.',done:'미로! 물에 젖은 생쥐 꼴이군. …고맙네, 정말 고마워. 오늘 밤엔 내가 밧줄을 두 겹으로 매겠네.',
  goals:[{type:'rescue',reg:'h29_reed',at:[20,880],who:{n:'뱃사공 미로',L:g42QL('miro',{body:'#4a5a5a',cape:'#6a8a8a',hair:'#c8a070'})},mob:'h29_reed_1',n:2,d:'동쪽 갈대섬의 뱃사공 미로를 풀어 쉼터로 데려오기'}]},
 q36_h29_reed_camp_2:{kind:'몰래 지나가기',t:'사냥수 둥지의 은빛 갈대',say:'갈대 비늘 사냥수들이 잠드는 물웅덩이 한가운데에 은빛 갈대가 자라요. 그걸로 만든 피리는 바람만 불어도 운대요. 그런데 사냥수들이 잠귀가 밝아서, 들키면 다 같이 덤벼요. 몰래, 아주 몰래 다녀와 주실래요?',done:'은빛 갈대다! 아무도 안 깼어요? 대단해요. 이건 제일 먼저 당신 피리로 만들게요.',
  goals:[{type:'sneak',reg:'h29_reed',at:[150,640],end:[150,1250],guards:[[140,850],[160,980],[145,1110],[158,1180]],mob:'h29_reed_0',what:'은빛 갈대',n:1,d:'잠든 사냥수들에게 들키지 않고 은빛 갈대 꺾어 오기'}]},
 q36_h29_kiln_camp_1:{kind:'구조',t:'가짜 불빛을 따라간 나그네',say:'어젯밤 나그네 하나가 도마뱀 꼬리 불빛을 길등인 줄 알고 따라갔다가 남쪽 뜨거운 바위 틈에 빠졌어. 소리는 들리는데 내가 초소를 비울 수가 없어. 끌어올려서 여기까지 데려와 줘. 도마뱀들이 또 몰려들 거야.',done:'살았구나, 살았어! 발바닥이 조금 익었지만 걸을 수는 있대. 진짜 불빛만 따라오라고 내가 단단히 일러 뒀어.',
  goals:[{type:'rescue',reg:'h29_kiln',at:[95,900],who:{n:'길 잃은 나그네 셀로',L:g42QL('selo',{body:'#7a5a3a',cape:'#a08050',hair:'#5a3a20',hat:1,hatC:'#8a6a40'})},mob:'h29_kiln_0',n:2,d:'바위 틈에 빠진 나그네 셀로를 구해 초소로 데려오기'}]},
 q36_h29_kiln_camp_2:{kind:'몰래 지나가기',t:'불티 요정의 옛 가마',say:'옛 숯가마 바닥에는 아직 식지 않은 불티가 한가득 깔려 있어. 문제는 불티 요정들이 그 가마를 둥지 삼아 지킨다는 거지. 싸우면 가마가 무너져. 요정들 눈을 피해 가마까지 가서 불티를 한 통 떠 와 줘.',done:'통이 아직도 따끈하네. 가마도 멀쩡하고. 이걸로 구운 유리는 해 질 녘 하늘 같은 빛이 나. 첫 번째 꽃병은 네 몫이야.',
  goals:[{type:'sneak',reg:'h29_kiln',at:[-30,620],end:[-30,1240],guards:[[-40,820],[-20,950],[-38,1080],[-22,1170]],mob:'h29_kiln_2',what:'옛 숯가마',n:1,d:'불티 요정들에게 들키지 않고 옛 숯가마에서 불티 떠 오기'}]},
 q36_h29_crystal_camp_1:{kind:'몰래 지나가기',t:'벌레 굴에 쫓는 향 놓기',say:'수정 뿔 벌레들은 굴 한가운데 알자리를 두고 산다. 거기에 쓴쑥 향을 피워 두면 녀석들이 스스로 굴을 옮기지. 싸우면 알자리가 흩어져서 숲 곳곳에 새 굴이 생겨. 몰래 들어가서 향만 놓고 나와.',done:'향 냄새가 여기까지 나는군. 벌레들이 줄지어 북쪽 바위산으로 옮겨 가고 있다. 어린 수정들은 이제 숨 좀 쉬겠어.',
  goals:[{type:'sneak',reg:'h29_crystal',at:[200,600],end:[200,1220],guards:[[190,800],[212,930],[195,1060],[206,1150]],mob:'h29_crystal_0',what:'벌레 알자리',n:1,d:'수정 뿔 벌레들에게 들키지 않고 알자리에 쓴쑥 향 놓기'}]},
 q36_h29_crystal_camp_2:{kind:'구조',t:'맥에 홀린 견습생',say:'제 동생이 맥 소리를 더 가까이 듣겠다며 숲 깊이 들어갔다가… 주술사들한테 붙잡혔어요. 수정 우리에 가둬 두고 마나를 뽑아 간대요. 우리를 깨고 동생을 데려와 주세요. 이름은 세린이에요. 제 이름이랑 한 글자 달라요.',done:'세린! …괜찮아, 이제 괜찮아. 다시는 혼자 맥을 따라가지 마. 정말 고맙습니다. 이 은혜는 맥이 마를 때까지 잊지 않을게요.',
  goals:[{type:'rescue',reg:'h29_crystal',at:[-60,740],who:{n:'견습생 세린',L:g42QL('serin',{body:'#3a6a6a',cape:'#4a9aa8',hair:'#2a2a3a',dress:1})},mob:'h29_crystal_2',n:2,d:'수정 우리에 갇힌 견습생 세린을 구해 파수막으로 데려오기'}]},
 q36_h29_snow_camp_1:{kind:'구조',t:'눈 구덩이에 빠진 순례자',say:'아침에 떠난 순례자 하나가 갑각수 등을 밟고 눈 구덩이로 굴렀어. 발목이 물려서 혼자 못 올라오고 있다네. 구덩이 둘레엔 녀석들이 아직 묻혀 있고. 끌어올려서 쉼터까지 부축해 줘.',done:'발목은 붕대로 감았네. 며칠 쉬면 다시 걸을 수 있대. 순례길에 표시를 더 세워야겠어. 고맙네.',
  goals:[{type:'rescue',reg:'h29_snow',at:[60,900],who:{n:'순례자 하안',L:g42QL('haan',{body:'#8a8a9a',cape:'#c8c8d8',hair:'#e8e8f0',hat:1,hatC:'#a8a8b8'})},mob:'h29_snow_0',n:2,d:'눈 구덩이에 빠진 순례자 하안을 구해 쉼터로 데려오기'}]},
 q36_h29_snow_camp_2:{kind:'몰래 지나가기',t:'성소 앞 이름 명부',say:'얼어붙은 순례병들이 지키는 옛 성소 앞에 순례자 명부가 놓여 있대요. 거기 그분들 이름이 다 적혀 있을 거예요. 그분들은 아직 성소를 지키는 줄 알아요. 싸우지 말고, 깨우지 말고, 명부만 가져와 주세요.',done:'명부예요… 첫 장부터 이름이 빼곡해요. 이제 성소에 가면 이 이름들을 하나하나 불러 드릴게요. 노래를 하나 더 배워야겠어요.',
  goals:[{type:'sneak',reg:'h29_snow',at:[-120,600],end:[-45,1230],guards:[[-130,800],[-110,930],[-128,1050],[-112,1160]],mob:'h29_snow_1',what:'순례자 명부',n:1,d:'얼어붙은 순례병들을 깨우지 않고 성소 앞 명부 가져오기'}]},
 q36_h29_bell_camp_1:{kind:'몰래 지나가기',t:'소리 없는 무리 사이로',say:'어제 등을 물린 지킴이가 뿔피리를 떨어뜨렸다. 종원 사냥개 무리가 쉬는 돌기둥 사이에 말이야. 녀석들은 소리가 아니라 눈으로 사냥하지. 눈에 띄지 않게 가서 뿔피리를 가져와라. 그게 있어야 무리가 올 때 알릴 수 있다.',done:'뿔피리를 찾았군. 소리 없는 놈들 사이를 소리 없이 다녀왔다니, 너도 이 정원에 꽤 익숙해졌나 보다.',
  goals:[{type:'sneak',reg:'h29_bell',at:[30,620],end:[30,1240],guards:[[20,820],[42,950],[25,1080],[38,1170]],mob:'h29_bell_0',what:'떨어진 뿔피리',n:1,d:'종원 사냥개 무리 눈에 띄지 않고 뿔피리 찾아오기'}]},
 q36_h29_bell_camp_2:{kind:'구조',t:'정원 깊이 걸어간 아버지',say:'아버지가 또 사라졌어요. 소리를 잃은 뒤로 가끔 종이 있던 자리로 걸어가 그냥 서 계세요. 이번엔 깨진 종의 아가리들 한가운데예요. 아버지를 모셔 와 주세요. 손을 잡아 드리면 따라오실 거예요.',done:'아버지! …손이 차가워요. 그래도 따라오셨네요. 아까 아가리들 사이에서 아버지가 손가락으로 허공을 톡 두드리셨대요. 종을 치던 그 손짓으로요.',
  goals:[{type:'rescue',reg:'h29_bell',at:[-150,720],who:{n:'종지기 오렌',L:g42QL('oren',{body:'#6a5a3a',cape:'#8a7a50',hair:'#d8d0c0',hs:2})},mob:'h29_bell_2',n:2,d:'깨진 종의 아가리들 사이에 선 종지기 오렌을 지킴터로 모셔 오기'}]},
 q36_h29_veil_camp_1:{kind:'몰래 지나가기',t:'금 간 봉인석 살피기',say:'동쪽 끝 봉인석에 금이 몇 개나 갔는지 알아야 한다. 그런데 그 둘레를 봉인을 삼키는 짐승들이 지킨다. 싸움이 나면 녀석들이 돌을 더 세게 갉는다. 들키지 말고 가서 금을 세어 와라.',done:'금이 일곱… 생각보다 적다. 아직 새벽빛으로 메울 수 있겠어. 잘 다녀왔다.',
  goals:[{type:'sneak',reg:'h29_veil',at:[-80,620],end:[-80,1240],guards:[[-90,820],[-70,950],[-88,1080],[-72,1170]],mob:'h29_veil_2',what:'동쪽 끝 봉인석',n:1,d:'봉인을 삼키는 짐승들에게 들키지 않고 동쪽 봉인석 살피기'}]},
 q36_h29_veil_camp_2:{kind:'구조',t:'봉인 고리에 갇힌 견습 사제',say:'제 견습 사제 하나가 봉인석에 새벽빛을 부으러 갔다가 고리 안에 갇혔어요. 망령들이 고리 바깥을 맴돌아서 나오지를 못해요. 고리를 풀고 데려와 주세요. 이름은 노아예요.',done:'노아, 무사하구나. 다음엔 꼭 둘이서 가자. …고맙습니다. 새벽빛이 당신 길에도 늘 비치기를.',
  goals:[{type:'rescue',reg:'h29_veil',at:[110,730],who:{n:'견습 사제 노아',L:g42QL('noa',{body:'#d8c8a0',cape:'#f0e0b0',hair:'#a07040'})},mob:'h29_veil_3',n:2,d:'봉인 고리에 갇힌 견습 사제 노아를 구해 파수막으로 데려오기'}]},
 q36_pilgrimtent_2:{kind:'몰래 지나가기',t:'맹세 두루마리',say:'재 맹세 기사들은 「마지막 한 사람까지 지키겠다」는 맹세에 갇혀 있어요. 그 맹세를 적은 두루마리가 옛 순례 제단에 아직 놓여 있대요. 기사들 눈을 피해 두루마리를 가져와 주세요. 태우면 맹세가 풀린대요.',done:'두루마리를 불에 넣자 멀리서 투구 벗는 소리가 났어요. 이제야 맹세를 내려놓은 거겠죠.',
  goals:[{type:'sneak',reg:'plateau',from:'pilgrimtent',at:[60,600],end:[60,1220],guards:[[50,800],[70,930],[55,1060],[68,1150]],mob:'a_knight',what:'옛 순례 제단',n:1,d:'재 맹세 기사들에게 들키지 않고 맹세 두루마리 가져오기'}]},
 q36_rootwatch_3:{kind:'구조',t:'뿌리에 묶인 순례자',say:'땅속 길을 걷던 순례자 하나가 뿌리에 묶였어요. 아직 덜 묶여서 지금 풀면 살 수 있어요. 이 약을 뿌리 매듭에 붓고 풀어 주세요. 그리고 꼭 여기까지 데려와 주세요. 뿌리 짐승들이 냄새를 맡고 올 거예요.',done:'제때 왔어요. 몇 시간만 늦었어도 뿌리가 숨까지 감았을 거예요. 이제 그 길에 표시를 세워 둘게요.',
  goals:[{type:'rescue',reg:'roots',from:'rootwatch',at:[-40,900],who:{n:'순례자 오디',L:g42QL('odi',{body:'#5a6a3a',cape:'#7a8a50',hair:'#4a3a2a'})},mob:'rt_pilgrim',n:2,d:'뿌리에 묶인 순례자 오디를 풀어 파수막으로 데려오기'}]},
 q36_keeperhouse_2:{kind:'몰래 지나가기',t:'교대 종',say:'불 꺼진 근위병들은 그날 밤 순찰을 아직도 돌고 있어. 교대 종이 울리지 않았으니까. 옛 초소에 교대 종이 있어. 녀석들 눈에 띄지 말고 가서 종을 울려 줘. …다 내 동료들이야. 싸우지 않고 쉬게 해 주고 싶어.',done:'종소리가 들렸어. 근위병들이 하나둘 창을 내려놓더군. 마지막 한 명이 경례를 했어. 이제 교대할 시간이란 걸 안 거겠지.',
  goals:[{type:'sneak',reg:'capital',from:'keeperhouse',at:[-60,600],end:[-60,1230],guards:[[-70,800],[-50,930],[-66,1060],[-54,1160]],mob:'z_guard',what:'옛 초소의 교대 종',n:1,d:'불 꺼진 근위병들에게 들키지 않고 교대 종 울리기'}]}};
// 원래 목표를 기억해 두고(옮기기용) 바꾼다
const G42Q_OLD={};
for(const id in G42Q_SQ){const q=SQBY[id],N=G42Q_SQ[id];if(!q)continue;G42Q_OLD[id]=q.goals.map(g=>({type:g.type,n:g.n||1}));for(const k of ['kind','t','say','done','goals'])q[k]=N[k];q.g42=1}
/* ===== 몰래 지나가기 ===== */
{const _ag=aggroOf;aggroOf=(e,t)=>e.g42sn?e.g42sr:_ag(e,t)}
const g42SnLive=id=>enemies.filter(e=>!e.dead&&e.g42sn===id);
function g42SnStop(id,keep){const run=G42Q.run[id];if(!run)return;delete G42Q.run[id];for(const e of enemies)if(e.g42sn===id){e.g42sn=null;if(!keep){const i=enemies.indexOf(e);if(i>=0)enemies.splice(i,1)}}}
/* 자리: 시작은 q30Spot. 끝은 시작에서 걸어서 닿는 450~700 떨어진 곳(바란 방향 먼저), 경비는 그 사이 길 양옆에 엇갈려 선다 */
function g42SnGeo(q,g){const ck=q.id+'/sgeo';if(Q30.pos[ck])return Q30.pos[ck];const st=q30Spot(q,'a',g,g.at);if(!st)return null;
  const here=REG.id===(g.reg||'home')&&!DG&&!IN,ok=here?q30Reach(REG.id):null,good=(x,y)=>q30OkAt(x,y)&&(!ok||wxCanReach(ok,x,y));
  const want=q30Raw(g,g.end)||{x:st.x,y:st.y+600},a0=Math.atan2(want.y-st.y,want.x-st.x);let en=null;
  if(here)for(let k=0;k<36&&!en;k++){const a=a0+(k%2?1:-1)*Math.ceil(k/2)*.35;for(const r of [620,560,700,500,450]){const x=st.x+Math.cos(a)*r,y=st.y+Math.sin(a)*r;if(good(x,y)){en={x,y};break}}}
  if(!en)en={x:st.x+Math.cos(a0)*600,y:st.y+Math.sin(a0)*600};
  const L=Math.hypot(en.x-st.x,en.y-st.y)||1,ux=(en.x-st.x)/L,uy=(en.y-st.y)/L,gu=[];
  g.guards.forEach((_,i)=>{const t=.32+i*(.36/Math.max(1,g.guards.length-1)),o=(i%2?-1:1)*90,bx=st.x+ux*L*t-uy*o,by=st.y+uy*L*t+ux*o;let p=null;
    for(let r=0;r<200&&!p;r+=20)for(let m=0;m<8;m++){const x=bx+Math.cos(m*.785)*r,y=by+Math.sin(m*.785)*r;if(!here||good(x,y)&&Math.hypot(x-en.x,y-en.y)>G42Q.sight+50&&Math.hypot(x-st.x,y-st.y)>G42Q.sight+50){p={x,y};break}}gu.push(p||{x:bx,y:by})});
  const G0={st,en,gu};if(here)Q30.pos[ck]=G0;return G0}
Q30TICK.sneak=function(q,j,g,dt){const G0=g42SnGeo(q,g);if(!G0)return;const st=G0.st,en=G0.en,run=G42Q.run[q.id];
  q30Mark(q.id+'/sa',{kind:'clue',x:st.x,y:st.y,lb:run?'시작 자리':'여기서 시작 · 몰래 지나가기'});q30Mark(q.id+'/se',{kind:'g42goal',x:en.x,y:en.y,lb:g.what,on:!!run});
  if(!run){const W=G42Q.snw||(G42Q.snw={});if(W[q.id]){if(dist(P,st)>120)delete W[q.id];return}if(!P.dead&&dist(P,st)<90){const r=G42Q.run[q.id]={t:0,pt:0,n:0};
      if(q30Host())G0.gu.forEach((p,i)=>{const e=q30Mob(g.mob,p.x,p.y);if(e){r.n++;e.g42sn=q.id;e.g42sr=G42Q.sight;e.g42h={x:p.x,y:p.y,i};e.aggroed=false;e.wx=p.x;e.wy=p.y;e.wt=0}});
      banner={t:'몰래 지나가기',sub:`경비 눈(둥근 빛) 안에 들어가거나 싸우면 처음부터 · 「${g.what}」까지`,col:'#b8e0a0',life:2.6,max:2.6};msg(`몰래 지나가기 시작: 「${g.what}」까지 들키지 말고 가세요`,'#b8e0a0')}return}
  run.t+=dt;run.pt-=dt;const live=g42SnLive(q.id);
  for(const e of live){q30Mark(q.id+'/sight'+e.g42h.i,{kind:'g42sight',x:e.x,y:e.y,r:G42Q.sight});
    if(run.pt<=0&&!e.aggroed){const a=R()*6.283;e.wx=e.g42h.x+Math.cos(a)*45;e.wy=e.g42h.y+Math.sin(a)*45;e.wt=3}}
  if(run.pt<=0)run.pt=3;
  const seen=live.some(e=>e.aggroed)||(q30Host()&&live.length<run.n);
  if(seen){g42SnStop(q.id,true);(G42Q.snw||(G42Q.snw={}))[q.id]=1;shake=Math.max(shake,4);banner={t:'들켰다!',sub:'경비가 덤빕니다 · 시작 자리로 돌아가면 다시 할 수 있어요',col:'#ff9a7a',life:2.6,max:2.6};msg(`들켰습니다! 「${q.t}」 몰래 지나가기는 처음부터입니다 (시작 자리에 다시 서기)`,'#ff9a7a');return}
  if(P.dead||dist(P,st)>2200){g42SnStop(q.id);return}
  if(!P.dead&&dist(P,en)<80){g42SnStop(q.id);sqProgress(q,j,1,true);burst(en.x,en.y,'#b8e0a0',26,130,3,24);rings.push({x:en.x,y:en.y,r:8,max:130,life:.8,col:'#b8e0a0'});
    banner={t:'들키지 않았다!',sub:g.what,col:'#b8e0a0',life:2.4,max:2.4};msg(`「${g.what}」에 닿았습니다. 아무도 눈치채지 못했어요`,'#b8e0a0')}};
/* ===== 구조 ===== */
Q30TICK.rescue=function(q,j,g,dt){const c=q30C(q,j),sp=q30Spot(q,'t',g,g.at),home=q30Base(g);let R0=G42Q.res[q.id];
  if(!R0)R0=G42Q.res[q.id]={x:sp.x,y:sp.y,st:c>=1?'wait':'trap',ft:0,amb:0,walkT:0,face:1};
  const host=q30Host(),amb=n=>{if(!host)return;for(let i=0;i<n;i++){const p=q30Near(R0.x,R0.y,220,320);if(p)q30Mob(g.mob,p.x,p.y,{agg:1})}};
  if(R0.st==='trap'){const near=!P.dead&&dist(P,R0)<80;if(near){if(R0.ft===0){amb(3);msg(`${g.who.n}을(를) 풀어 주는 중… 곁에 3초 머무세요`,'#ffd98a')}R0.ft+=dt;if(R0.ft>=3){R0.st='follow';R0.ft=0;R0.amb=12;sqProgress(q,j,1,true);
        burst(R0.x,R0.y,'#ffd98a',24,120,3,20);banner={t:'풀어 주었다!',sub:`${g.who.n}이(가) 따라옵니다 · ${home?home.n:'쉼터'}까지 데려가세요`,col:'#ffd98a',life:2.6,max:2.6}}}else R0.ft=Math.max(0,R0.ft-dt*.5)}
  else if(R0.st==='wait'){if(!P.dead&&dist(P,R0)<90){R0.st='follow';R0.amb=12;msg(`${g.who.n}: 「다시 와 주셨군요!」`,'#ffd98a')}}
  else{const d=dist(P,R0);R0.moving=false;if(d>70&&d<700&&!P.dead){const sp2=SPEED*.95*dt,dx=P.x-R0.x,dy=P.y-R0.y,nx=R0.x+dx/d*sp2,ny=R0.y+dy/d*sp2;if(!blockedAt(nx,ny)){R0.x=nx;R0.y=ny}else{R0.x=P.x-dx/d*60;R0.y=P.y-dy/d*60}R0.moving=true;R0.walkT+=dt;const sx=dx-dy;if(Math.abs(sx)>.5)R0.face=sx>0?1:-1}
    if(d>=700||P.dead){R0.st='wait'}
    R0.amb-=dt;if(R0.amb<=0){R0.amb=18;amb(2)}
    if(home&&Math.hypot(R0.x-home.x,R0.y-home.y)<300){delete G42Q.res[q.id];sqProgress(q,j,1,true);burst(R0.x,R0.y,'#ffd98a',30,150,3,30);banner={t:'무사히 데려왔다!',sub:g.who.n,col:'#ffd98a',life:2.4,max:2.4};msg(`${g.who.n}을(를) 무사히 데려왔습니다`,'#ffd98a');return}}
  const say=R0.st==='trap'?(R0.ft>0?`푸는 중 ${Math.min(3,R0.ft).toFixed(1)}/3초`:'살려 주세요!'):R0.st==='wait'?'여기서 기다릴게요…':null;
  q30Mark(q.id+'/res',{kind:'runner',x:R0.x,y:R0.y,L:g.who.L,n:g.who.n,moving:!!R0.moving,walkT:R0.walkT,face:R0.face,say,sayT:time+1});
  if(R0.st==='trap')q30Mark(q.id+'/resr',{kind:'g42bind',x:R0.x,y:R0.y,f:R0.ft/3})};
/* 목표 글 · 길 안내 · 그리기 */
{const _g=sqGoalText;sqGoalText=function(q,j){const g=q.goals[j];if(!g||(g.type!=='sneak'&&g.type!=='rescue')||sqGoalDone(q,j))return _g(q,j);
  if(g.type==='sneak')return G42Q.run[q.id]?`${g.d} · 몰래 가는 중`:g.d;const c=q30C(q,j);return c>=1?`${g.d} · 데려가는 중`:g.d}}
{const _t=sqTarget;sqTarget=function(q){try{const j=q30Cur(q);if(j>=0&&sqState().a[q.id]){const g=q.goals[j],reg=g.reg||'home',rn=reg==='home'?'':REGIONS[reg].n+' · ';
  if(g.type==='sneak'){const G0=g42SnGeo(q,g),p=G0&&(G42Q.run[q.id]?G0.en:G0.st);if(p)return{reg,x:p.x,y:p.y,label:`${rn}${G42Q.run[q.id]?g.what:'몰래 지나가기 시작 자리'}`}}
  if(g.type==='rescue'){const c=q30C(q,j),R0=G42Q.res[q.id];if(c>=1&&R0&&R0.st==='follow'){const h=q30Base(g);if(h)return{reg,x:h.x,y:h.y,label:`${rn}${h.n||'쉼터'}`}}const p=R0||q30Spot(q,'t',g,g.at);if(p)return{reg,x:p.x,y:p.y,label:`${rn}${g.who.n}`}}}}catch(err){if(window.__QA)throw err}return _t(q)}}
{const _rd=drawRegionDecor;drawRegionDecor=function(d){if(d.k!=='q30'||!(d.kind==='g42sight'||d.kind==='g42goal'||d.kind==='g42bind'))return _rd(d);const s=d._s;if(!s)return true;const pa=ctx.globalAlpha,pul=.5+.5*Math.sin(time*4+d.x*.01);
  if(d.kind==='g42sight'){const R=d.r,near=dist(P,d)<R+60;ctx.globalAlpha=near?.16+.08*pul:.08;ctx.fillStyle=near?'#ff8a5a':'#ffe08a';ctx.beginPath();ctx.ellipse(s.x,s.y,R,R/2,0,0,6.283);ctx.fill();ctx.globalAlpha=near?.7:.35;ctx.strokeStyle=near?'#ff8a5a':'#ffe08a';ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=pa;return true}
  if(d.kind==='g42goal'){ctx.globalCompositeOperation='lighter';glow(s.x,s.y-10,50+pul*12,'#b8e0a0');ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.85;ctx.strokeStyle='#b8e0a0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x,s.y,34+pul*6,17+pul*3,0,0,6.283);ctx.stroke();ctx.globalAlpha=pa;
    QLBL.push({x:s.x,y:s.y-44,n:d.lb+(d.on?' · 여기까지':''),mk:'',c:'#b8e0a0',say:'',sa:0,ph:d.x});return true}
  if(d.kind==='g42bind'){ctx.globalAlpha=.8;ctx.strokeStyle='#c8a060';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(s.x,s.y-2,26,13,0,0,6.283);ctx.stroke();if(d.f>0){ctx.strokeStyle='#ffd98a';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(s.x,s.y-2,32,16,0,-1.57,-1.57+6.283*Math.min(1,d.f));ctx.stroke()}ctx.globalAlpha=pa;return true}
  return true}}
// 지역을 떠나거나 불러오면 정리
{const _lr=loadRegion;loadRegion=function(id){for(const k in G42Q.run)g42SnStop(k,true);for(const k in G42Q.res){const R0=G42Q.res[k];if(R0.st==='follow')R0.st='wait'}return _lr.apply(this,arguments)}}
{const _ld=load;load=function(d,slot){G42Q.run={};G42Q.res={};G42Q.dg={};const ok=_ld.apply(this,arguments);if(ok)try{g42QMig()}catch(e){if(window.__QA)throw e}return ok}}
{const _ab=sqAbandon;sqAbandon=function(id){g42SnStop(id,true);delete G42Q.res[id];return _ab.apply(this,arguments)}}

/* ===== 16) 3막 보강: 던전 안 장면 · 특별한 싸움 ===== */
const G42_A3TALK={
 archivist:{n:'말을 잃은 서고장',mini:'am_archivist',L:g42QL('archiv',{body:'#3a3a5a',cape:'#5a5a8a',hair:'#a8a8c0',hat:1,hatC:'#2a2a4a'}),hello:'(먹물 같은 목소리) …기록을 읽은 자만 이 문을 지난다. 세 번 묻겠다.',
  qs:[['재의 군주를 가둔 봉인 기둥은 몇 개였는가?',['일곱','아홉','열둘'],1],['드워프는 근원어를 어떻게 다루는가?',['목소리로 부른다','망치로 쇠에 두드린다','물에 적어 둔다'],1],['백 년 전 원로 회의는 얕아지는 마나를 무엇의 탓이라 했는가?',['계절의 탓','전쟁의 탓','신들의 탓'],0]],
  ok:'…기록을 아는구나. 지나가라. 원로 베르탄은 더 깊은 곳에 있다.',bad:'틀렸다. 기록을 모르는 자는 기록이 될 뿐!'},
 knight:{n:'첫 파수 기사 하르데',mini:'a3_towerknight',elite:1,L:g42QL('harde',{body:'#2a2a2a',cape:'#4a2a2a',hair:'#6a6a6a',hat:1,hatC:'#1a1a1a'}),hello:'(녹슨 투구 너머) 탑을 지키겠다고 맹세한 지 사백 년. 너는 무엇을 위해 올라가는가. 답해라.',
  qs:[['맹세를 지키다 쓰러진 자에게 강철 사제단은 무엇을 해 주는가?',['쇠 종을 한 번 울린다','이름을 지운다','방패를 묻는다'],0],['봉인이 세상에 무엇을 하는가?',['마나를 지킨다','마나를 마신다','마나를 낳는다'],1],['너는 이 탑을 어떻게 하려는가?',['부수러 왔다','답을 들으러 왔다','숨으러 왔다'],1]],
  ok:'…답을 들으러 왔다라. 우리도 그것을 기다렸다. 위층으로 가라. 우리는 이제 쉬겠다.',bad:'거짓이다! 파수 기사들이여, 칼을 들어라!'}};
const G42_A3={
 a3q1:{1:{type:'dgfind',dg:'a3_archive',n:6,item:'흩어진 기록 쪽',mob:'a3_inkwraith',d:'봉인 서고에 흩어진 기록 쪽 찾기 (주울 때마다 먹물 망령이 깨어남)'}},
 a3q2:{0:{type:'dgtalk',dg:'a3_archive',who:'archivist',n:1,d:'말을 잃은 서고장과 말로 겨루기 (틀리면 싸움)'}},
 a3q4:{0:{type:'dghold',dg:'a3_pass',secs:60,mob:'a3_frostfang',what:'바람막이 바위',n:1,d:'눈보라가 그칠 때까지 바람막이 바위 곁에서 60초 버티기 (늑대 무리)'}},
 a3q5:{3:{type:'dgrun',dg:'a3_falls',n:1,d:'금 가는 얼음 다리를 시간 안에 건너기'}},
 a3q7:{0:{type:'dgorder',dg:'a3_tower',stones:['물의 기둥','불의 기둥','바람의 기둥','흙의 기둥'],order:[0,1,2,3],hint:'물이 불을 끄고, 불이 바람을 부르고, 바람이 흙을 깎는다',mob:'a3_ashacolyte',n:4,d:'봉인 기둥 넷에 차례로 손 얹기'},
       1:{type:'dghold',dg:'a3_tower',secs:45,mob:'a3_ashacolyte',what:'봉인 등불',ward:1,n:1,d:'재의 사도 잔당이 끄려는 봉인 등불을 45초 지키기'}},
 a3q8:{0:{type:'dgtalk',dg:'a3_tower',who:'knight',n:1,d:'첫 파수 기사의 맹세 듣고 답하기 (틀리면 싸움)'}},
 a3q11b:{0:{type:'dgorder',dg:'a3_deep',stones:['첫째 모루','둘째 모루','셋째 모루','넷째 모루'],order:[2,0,3,1],hint:'망령의 망치는 가운데에서 시작해 바깥으로, 다시 안으로 돈다 (셋째 → 첫째 → 넷째 → 둘째)',mob:'a3_runetrap',boss:'am_forgeghost',n:4,d:'첫 룬 대장장이의 망치질 따라 하기 (모루 넷 · 틀리면 망령이 덤빔)'}},
 a3q13:{0:{type:'dghold',dg:'a3_summit',secs:90,mob:'a3_ashbody',what:'꼭대기 문 앞 계단',n:1,d:'꼭대기 문 앞에서 재로 된 몸을 막으며 90초 버티기'}}};
const G42Q_A3OLD={};
for(const id in G42_A3){const q=SQBY[id];if(!q)continue;G42Q_A3OLD[id]={};for(const j in G42_A3[id]){const og=q.goals[j];G42Q_A3OLD[id][j]={type:og.type,n:og.n||1,k:og.k};q.goals[j]=Object.assign({},G42_A3[id][j])}}
const G42_DGT=new Set(['dgfind','dgtalk','dghold','dgrun','dgorder']);
// 지금 할 3막 목표 (앞 목표를 다 했을 때만)
function g42A3Cur(q){if(!q||!q.a3)return -1;for(let j=0;j<q.goals.length;j++){if(sqGoalDone(q,j))continue;return G42_DGT.has(q.goals[j].type)?j:-1}return -1}
const g42A3Here=g=>!!(DG&&DG.a21&&DG.a21.k==='a3'&&DG.a21.id===g.dg);
// 이 던전 안 자리 (들어갈 때마다 새로)
function g42DgSpots(){const a=DG&&DG.a21;if(!a)return null;if(a.g42)return a.g42;const rs=DG.rooms.filter(r=>r!==DG.start),D0=bfs(DG.g,DG.start.cx,DG.start.cy);
  const by=rs.map(r=>({r,d:D0[tIdx(r.cx,r.cy)]})).filter(o=>o.d>=0).sort((x,y)=>x.d-y.d);const rg=mulberry(v20Hash(a.id+'|'+DG.rooms.length));
  a.g42={by,rg,spot:{},st:{}};return a.g42}
function g42DgAt(key,pick){const S=g42DgSpots();if(!S)return null;if(S.spot[key])return S.spot[key];const o=pick(S.by)||S.by[0];if(!o)return null;let p=dm21Spot(o.r,S.rg,1);const near=(x,y)=>Object.values(S.spot).some(s=>Math.hypot(s.x-x,s.y-y)<110);
  if(near(p.x,p.y))for(let k=0;k<24;k++){const a=k*.785+S.rg(),r=110+k*8,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;if(dgFree(x,y,14)&&!near(x,y)){p={x,y};break}}
  return S.spot[key]={x:Math.round(p.x),y:Math.round(p.y),room:o.r,d:o.d}}
const g42Mid=by=>by[Math.floor(by.length/2)];const g42Far=by=>by[by.length-1];
function g42DgMob(k,x,y,o){if(!TYPES[k]||!q30Host())return null;const p=(()=>{for(let i=0;i<12;i++){const a=R()*6.283,r=rnd(o&&o.r0||160,o&&o.r1||260),px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(dgFree(px,py,14))return{x:px,y:py}}return{x,y}})();
  const e=dgMob(k,p.x,p.y,DG.lvl+(o&&o.up||0),o&&o.elite?{elite:1}:null);e.aggroed=true;rings.push({x:p.x,y:p.y,r:6,max:70,life:.5,col:'#c8a0ff'});return e}
const G42DG={
 dgfind(q,j,g,dt,S){const c=q30C(q,j);if(!S.st[q.id+j])S.st[q.id+j]={got:new Set(Array.from({length:c},(_,i)=>i))};const st=S.st[q.id+j],L=[];
   for(let i=0;i<g.n;i++){const p=g42DgAt(q.id+'/f'+i,by=>by[Math.min(by.length-1,Math.floor((i+.5)*by.length/g.n))]);if(!p||st.got.has(i))continue;L.push({i,p})}
   S.marks.push(...L.map(o=>({x:o.p.x,y:o.p.y,k:'page',lb:g.item})));
   for(const o of L)if(!P.dead&&dist(P,o.p)<70){st.got.add(o.i);sqProgress(q,j,1,true);burst(o.p.x,o.p.y,'#ffe8b0',20,110,3,20);msg(`${g.item} ${Math.min(c+1,g.n)}/${g.n}`,'#ffe8b0');for(let k=0;k<2;k++)g42DgMob(g.mob,o.p.x,o.p.y);break}},
 dghold(q,j,g,dt,S){const p=g42DgAt(q.id+'/h'+j,g42Mid);if(!p)return;const key=q.id+j;let run=S.st[key];
   S.marks.push({x:p.x,y:p.y,k:'hold',lb:run?`${g.what} · ${Math.max(0,Math.ceil(run.t))}초`:`${g.what} · 가까이 가면 시작`,on:!!run,f:run&&g.ward?run.hp/100:null});
   if(!run){if(!P.dead&&dist(P,p)<110){S.st[key]={t:g.secs,wv:1,hp:100,out:0};banner={t:`${g.what} 지키기`,sub:`${g.secs}초 동안 버티세요 · 큰 원 밖에 5초 넘게 있으면 처음부터`,col:WX_QCOL.main,life:2.4,max:2.4}}return}
   run.t-=dt;run.wv-=dt;if(run.wv<=0){run.wv=4;const live=enemies.filter(e=>!e.dead&&e.g42w===key).length;for(let i=0,n=Math.min(7-live,3);i<n;i++){const e=g42DgMob(g.mob,p.x,p.y,{r0:300,r1:420});if(e)e.g42w=key}}
   if(g.ward)for(const e of enemies){if(e.dead||e.g42w!==key)continue;if(!e.aggroed||dist(e,p)>e.r*(e.sc||1)+40){if(dist(e,P)>260){e.wx=p.x;e.wy=p.y;e.wt=4}continue}e._g42T=(e._g42T==null?.6:e._g42T)-dt;if(e._g42T<=0){e._g42T=1.4;run.hp-=4;ftext(p.x,p.y,'-4%','#ff9a7a',false,60)}}
   const fail=why=>{delete S.st[key];msg(`${why} 처음부터 다시 합니다. ${g.what} 곁으로 가세요`,'#ff8a6a');banner={t:'지키기 실패',sub:why,col:'#ff8a6a',life:2.2,max:2.2}};
   if(g.ward&&run.hp<=0)return fail(`${g.what}이(가) 꺼졌습니다.`);if(P.dead)return fail('쓰러졌습니다.');
   if(dist(P,p)>DEF35.zone){run.out+=dt;if(run.out>=DEF35.grace)return fail('원 밖에 오래 있었습니다.')}else run.out=0;
   if(run.t<=0){delete S.st[key];sqProgress(q,j,1,true);rings.push({x:p.x,y:p.y,r:10,max:200,life:1,col:'#ffd08a'});banner={t:'버텨 냈다!',sub:g.what,col:WX_QCOL.main,life:2.4,max:2.4};msg(`「${g.d}」 해냈습니다`,WX_QCOL.main)}},
 dgrun(q,j,g,dt,S){const a=g42DgAt(q.id+'/ra',by=>by[0]),b=g42DgAt(q.id+'/rb',by=>by[Math.max(1,Math.floor(by.length*.7))]);if(!a||!b)return;const key=q.id+j;let run=S.st[key];
   const lim=run?run.lim:Math.round(10+Math.abs((b.d||0)-(a.d||0))*.9);
   S.marks.push({x:a.x,y:a.y,k:'start',lb:run?'출발':'얼음 다리 앞 · 서면 출발'},{x:b.x,y:b.y,k:'goal',lb:run?`건너편 · ${Math.max(0,Math.ceil(run.t))}초`:'건너편'});
   if(!run){if(S.st[key+'w']){if(dist(P,a)>120)delete S.st[key+'w'];return}if(!P.dead&&dist(P,a)<80){S.st[key]={t:lim,lim,ct:0};banner={t:'얼음 다리',sub:`${lim}초 안에 건너편(빛나는 고리)까지 · 멈추면 얼음이 무너집니다`,col:'#cfeeff',life:2.4,max:2.4}}return}
   run.t-=dt;run.ct-=dt;if(run.ct<=0){run.ct=.35;for(let k=0;k<3;k++)parts.push({x:P.x+rnd(-40,40),y:P.y+rnd(30,60),z:2,vx:rnd(-20,20),vy:rnd(-10,10),vz:rnd(20,60),life:.7,max:.7,col:'#cfeeff',sz:2.2})}
   if(run.t<=0||P.dead){delete S.st[key];S.st[key+'w']=1;shake=Math.max(shake,5);msg('얼음이 무너졌습니다! 한 걸음 물러났다가 다리 앞에 다시 서면 처음부터','#ff9a7a');banner={t:'얼음이 무너졌다',sub:'다리 앞에서 다시',col:'#ff9a7a',life:2.2,max:2.2};const r0=g42DgSpots();if(r0&&!P.dead){P.x=a.x;P.y=a.y;followCam()}return}
   if(dist(P,b)<80){delete S.st[key];sqProgress(q,j,1,true);burst(b.x,b.y,'#cfeeff',30,150,3,30);banner={t:'건넜다!',sub:`${Math.ceil(run.lim-run.t)}초`,col:'#cfeeff',life:2.4,max:2.4};msg('얼음 다리를 건넜습니다','#cfeeff')}},
 dgorder(q,j,g,dt,S){const c=q30C(q,j),lit=g.order.slice(0,c),key=q.id+j;if(!S.st[key])S.st[key]={on:-1,pen:0};const st=S.st[key];let on=-1;
   const base=g42DgAt(q.id+'/o',g42Far);if(!base)return;const R0=base.room;
   g.stones.forEach((n,i)=>{const p=S.spot[q.id+'/o'+i]||(S.spot[q.id+'/o'+i]=(()=>{const a=i/g.stones.length*6.283+.6,r=Math.min(R0.w,R0.h)*TS*.3;for(let k=0;k<10;k++){const x=base.x+Math.cos(a)*r*(1-k*.08),y=base.y+Math.sin(a)*r*(1-k*.08);if(dgFree(x,y,14))return{x,y}}return{x:base.x+Math.cos(a)*40,y:base.y+Math.sin(a)*40}})());
     S.marks.push({x:p.x,y:p.y,k:'stone',lb:n,lit:lit.includes(i)});if(on<0&&!P.dead&&dist(P,p)<64)on=i});
   if(c===0&&!st.hint&&dist(P,base)<400){st.hint=1;msg(`힌트: ${g.hint}`,'#ffd98a')}
   const was=st.on;st.on=on;if(on<0||on===was||lit.includes(on))return;const p=S.spot[q.id+'/o'+on];
   if(g.order[c]===on){sqProgress(q,j,1,true);burst(p.x,p.y,'#ffd98a',20,110,3,20);msg(`${g.stones[on]} (${c+1}/${g.n})`,'#ffd98a');return}
   const a=sqState().a[q.id];if(a)a.c['g'+j]=0;shake=Math.max(shake,3);msg(`순서가 틀렸습니다! 힌트: ${g.hint}`,'#ff9a7a');banner={t:'순서가 틀렸습니다',sub:`힌트: ${g.hint}`,col:'#ff9a7a',life:2.4,max:2.4};
   if(time>st.pen){st.pen=time+8;if(g.boss&&!enemies.some(e=>!e.dead&&e.g42b===key)){const e=g42DgMob(g.boss,base.x,base.y,{up:1,r0:60,r1:120});if(e){e.g42b=key;e.g42q=q.id;e.g42j=j;msg(`${TYPES[g.boss].n}이(가) 덤빕니다! 쓰러뜨려도 됩니다`,'#ff9a7a')}}else for(let k=0;k<2;k++)g42DgMob(g.mob,p.x,p.y)}questHud();save()},
 dgtalk(q,j,g,dt,S){const T=G42_A3TALK[g.who];const p=g42DgAt(q.id+'/t',g42Mid);if(!p||!T)return;const key=q.id+j;const st=S.st[key]||(S.st[key]={i:0,fight:0});
   if(st.fight){const e=enemies.find(e=>e.g42q===q.id&&e.g42t);if(!e&&q30Host()&&!st.spawned){st.spawned=1;const m=g42DgMob(T.mini,p.x,p.y,{up:1,r0:10,r1:40,elite:T.elite});if(m){m.g42q=q.id;m.g42j=j;m.g42t=1}if(T.elite)for(let k=0;k<2;k++)g42DgMob(T.mini,p.x,p.y)}return}
   S.marks.push({x:p.x,y:p.y,k:'talk',L:T.L,lb:T.n});if(!P.dead&&dist(P,p)<90&&!st.near){st.near=1;g42TalkOpen(q.id,j)}else if(dist(P,p)>=140)st.near=0}};
function g42DgTick(dt){if(!P||!DG||!DG.a21||DG.a21.k!=='a3')return;const S=g42DgSpots();if(!S)return;S.marks=[];const s=sqState();
  for(const id in s.a){const q=SQBY[id],j=g42A3Cur(q);if(j<0)continue;const g=q.goals[j];if(!g42A3Here(g))continue;try{G42DG[g.type](q,j,g,dt,S)}catch(e){if(window.__QA)throw e}}}
{const _u=update;update=function(dt){_u(dt);try{g42DgTick(dt)}catch(e){if(window.__QA)throw e}}}
// 말로 겨루기 창
function g42TalkOpen(id,j){G42Q.talk={id,j};v20Open('g42talk',id+':'+j)}
V20P.g42talk={title:()=>{const t=G42Q.talk,q=t&&SQBY[t.id],g=q&&q.goals[t.j];return g?G42_A3TALK[g.who].n:'말로 겨루기'},html(){const t=G42Q.talk,q=t&&SQBY[t.id],g=q&&q.goals[t.j];if(!g||g.type!=='dgtalk'||sqGoalDone(q,t.j))return '<p class="muted">이야기가 끝났습니다.</p>';
  const T=G42_A3TALK[g.who],S=g42DgSpots(),st=S&&S.st[q.id+t.j];if(!st)return '<p class="muted">가까이 가서 다시 말을 거세요.</p>';if(st.fight)return `<p>${v20Esc(T.bad)}</p><p class="muted">쓰러뜨려도 의뢰를 마칠 수 있습니다.</p>`;
  const Q=T.qs[st.i];if(!Q)return '';return `<p class="qsay">「${v20Esc(st.i===0?T.hello:'다음.')}」</p><div class="v20box"><b>물음 ${st.i+1}/${T.qs.length}</b><p class="qsay">「${v20Esc(Q[0])}」</p><div class="row" style="flex-wrap:wrap;gap:6px">${Q[1].map((c,i)=>v20Btn('g42ans',i,v20Esc(c),{cls:'ghost'})).join('')}</div></div>`}};
V20A.g42ans=v=>{const t=G42Q.talk,q=t&&SQBY[t.id],g=q&&q.goals[t.j];if(!g||g.type!=='dgtalk')return;const T=G42_A3TALK[g.who],S=g42DgSpots(),st=S&&S.st[q.id+t.j];if(!st||st.fight)return;
  const Q=T.qs[st.i];if(!Q)return;if((v|0)===Q[2]){st.i++;msg(`「${Q[1][v|0]}」 · 맞았습니다`,'#9fe0ff');if(st.i>=T.qs.length){sqProgress(q,t.j,1,true);msg(`${T.n}: 「${T.ok}」`,WX_QCOL.main);banner={t:'말로 이겼다',sub:T.n,col:WX_QCOL.main,life:2.4,max:2.4};closePanel()}}
  else{st.fight=1;msg(`${T.n}: 「${T.bad}」`,'#ff9a7a');closePanel()}};
// 말로 겨루다 싸움이 된 상대 · 틀려서 나온 망령: 쓰러뜨리면 그 목표 끝
{const _k=questKill;questKill=function(e){_k.apply(this,arguments);try{if(e&&e.g42q){const q=SQBY[e.g42q];if(q&&sqState().a[q.id]&&!sqGoalDone(q,e.g42j)){const g=q.goals[e.g42j];sqProgress(q,e.g42j,(g.n||1)-q30C(q,e.g42j),true);msg(`「${g.d}」 해냈습니다`,WX_QCOL.main)}}}catch(err){if(window.__QA)throw err}}}
// 그리기 (던전 안)
DM21GLOW.push(()=>{const a=DG.a21;if(!a||a.k!=='a3'||!a.g42||!a.g42.marks)return;const pul=.5+.5*Math.sin(time*4);
  for(const m of a.g42.marks){const sc=W2S(m.x,m.y);if(!onScreen(sc,140))continue;let lc='#ffe8b0',ly=46;
    ctx.globalCompositeOperation='lighter';
    if(m.k==='page'){ctx.globalAlpha=.5+.3*pul;glow(sc.x,sc.y-14,36,'#ffe8b0');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#f0e0b8';ctx.save();ctx.translate(sc.x,sc.y-16-pul*3);ctx.rotate(-.3);ctx.fillRect(-7,-9,14,18);ctx.strokeStyle='#7a6040';ctx.lineWidth=1;for(let y=-5;y<7;y+=3){ctx.beginPath();ctx.moveTo(-4,y);ctx.lineTo(4,y);ctx.stroke()}ctx.restore()}
    else if(m.k==='hold'){ctx.globalAlpha=m.on?.5:.3;glow(sc.x,sc.y-30,m.on?48:34,'#ffd08a');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.6;ctx.strokeStyle=m.on?'#ffd08a':'#c8b080';ctx.lineWidth=2;const R=m.on?DEF35.zone:70;ctx.beginPath();ctx.ellipse(sc.x,sc.y,R,R/2,0,0,6.283);ctx.stroke();ctx.globalAlpha=1;
      ctx.fillStyle='#4a3a2a';ctx.fillRect(sc.x-3,sc.y-40,6,40);ctx.fillStyle='#fff0c0';ctx.beginPath();ctx.arc(sc.x,sc.y-46,5,0,6.283);ctx.fill();if(m.f!=null){ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(sc.x-30,sc.y-74,60,6);ctx.fillStyle=m.f<.3?'#ff5a4a':'#ffd08a';ctx.fillRect(sc.x-30,sc.y-74,60*Math.max(0,m.f),6)}ly=84;lc='#ffd08a'}
    else if(m.k==='start'||m.k==='goal'){ctx.globalAlpha=.45+.2*pul;glow(sc.x,sc.y-6,42,'#cfeeff');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.8;ctx.strokeStyle='#cfeeff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sc.x,sc.y,40+pul*6,20+pul*3,0,0,6.283);ctx.stroke();ctx.globalAlpha=1;lc='#cfeeff';ly=34}
    else if(m.k==='stone'){ctx.globalAlpha=m.lit?.55:.2;glow(sc.x,sc.y-24,m.lit?40:26,m.lit?'#ffd98a':'#a8a8c8');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle=m.lit?'#6a5a3a':'#4a4a56';ctx.beginPath();ctx.moveTo(sc.x-11,sc.y);ctx.lineTo(sc.x-8,sc.y-32);ctx.lineTo(sc.x,sc.y-38);ctx.lineTo(sc.x+8,sc.y-32);ctx.lineTo(sc.x+11,sc.y);ctx.closePath();ctx.fill();ctx.fillStyle=m.lit?'#fff0c0':'#9a9ab8';ctx.fillRect(sc.x-2,sc.y-28,4,12);lc=m.lit?'#ffd98a':'#c8c8d8';ly=50}
    else if(m.k==='talk'){ctx.globalAlpha=.35+.15*pul;glow(sc.x,sc.y-40,34,'#b0b0ff');ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';const e=twFolkSprite(m.L,0);if(e){ctx.globalAlpha=.85;SC.draw(ctx,e,sc.x,sc.y);ctx.globalAlpha=1}lc='#c8c8ff';ly=86}
    ctx.globalCompositeOperation='source-over';ctx.font=`600 12px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(m.lb,sc.x,sc.y-ly);ctx.fillStyle=lc;ctx.fillText(m.lb,sc.x,sc.y-ly)}});
// 목표 글 · 길 안내
{const _g=sqGoalText;sqGoalText=function(q,j){const g=q.goals[j];if(!g||!G42_DGT.has(g.type)||sqGoalDone(q,j))return _g(q,j);const c=q30C(q,j);
  if(g.type==='dgfind'||g.type==='dgorder')return `${g.d} ${Math.min(c,g.n)}/${g.n}`;const D=A3_DGBY[g.dg];return `${g.d}${D?` · ${D.n}`:''}`}}
{const _t=sqTarget;sqTarget=function(q){try{if(q&&q.a3&&sqState().a[q.id]){const j=g42A3Cur(q);if(j>=0){const D=A3_DGBY[q.goals[j].g42dg||q.goals[j].dg];if(D)return a3GateTarget(D)}}}catch(err){if(window.__QA)throw err}return _t(q)}}
/* ===== 이미 받아 둔 의뢰 옮기기 (한 번만) ===== */
function g42QMig(){const g=g42S();if((g.qmig|0)>=42||!P.sq)return;const s=sqState();
  for(const id in G42Q_OLD){const a=s.a[id];if(!a||!a.c)continue;const q=SQBY[id],all=G42Q_OLD[id].every((o,j)=>(a.c['g'+j]|0)>=o.n);for(const k in a.c)if(/^g\d+$/.test(k))delete a.c[k];q.goals.forEach((G,j)=>{a.c['g'+j]=all?(G.n||1):0})}
  for(const id in G42Q_A3OLD){const a=s.a[id];if(!a||!a.c)continue;const q=SQBY[id];for(const j in G42Q_A3OLD[id]){if(!q.goals[j])continue;const o=G42Q_A3OLD[id][j],c=a.c['g'+j]|0;a.c['g'+j]=c>=o.n?(q.goals[j].n||1):0}}
  g.qmig=42}
{const _ng=newGame;newGame=function(){G42Q.run={};G42Q.res={};const r=_ng.apply(this,arguments);if(P)g42S().qmig=42;return r}}
Object.assign(window.__g42,{g42SnGeo,G42Q,G42Q_SQ,G42_A3,G42_A3TALK,G42DG,g42QMig,g42A3Cur,g42DgSpots,g42SnStop});
