/* v43(사용자 「잿빛 성가대의 무덤 주인을 쓰러뜨렸는데 불 꺼진 왕도에 입장할 수 없어」):
   예전에는 왕도 길이 3차 전직 의뢰 「왕도의 문」(120레벨)을 받아 둔 채 무덤 주인을 잡고, 의뢰를 마치고 보고까지 해야만 열렸다.
   의뢰를 받기 전(또는 보고 전)에 잡으면 막힌 채 「무덤의 주인을 쓰러뜨려야 걷힙니다」만 떴음.
   → 무덤 주인(b_w3choir)을 한 번이라도 쓰러뜨리면 그 캐릭터는 왕도 길이 열림. 새 저장 칸 P.w3.choir(없으면 0).
     v42 저장은 업적 기록(P.g42.ac.ty.b_w3choir)에 남은 처치 수로 옮김. 「왕도의 문」을 나중에 받아도 처치가 바로 채워짐. */
const w3ChoirN=()=>{if(!P)return 0;const w=P.w3,a=P.g42&&P.g42.ac&&P.g42.ac.ty;return Math.max(w&&typeof w==='object'?Math.max(0,w.choir|0):0,a&&typeof a==='object'?Math.max(0,a.b_w3choir|0):0)};
const w3ChoirFill=()=>{if(w3ChoirN()>0&&typeof j3HookGoal==='function')w3Try(()=>j3HookGoal('choir'))};
{const _co=J3Q.capitalOpen;J3Q.capitalOpen=function(){return _co.apply(this,arguments)||w3ChoirN()>0}}
{const _bd=dgBossDrop;dgBossDrop=function(e){const was=!!(P&&J3Q.capitalOpen()),r=_bd.apply(this,arguments);
  if(P&&e&&e.k==='b_w3choir'){P.w3=P.w3&&typeof P.w3==='object'?P.w3:{};P.w3.choir=Math.max(0,P.w3.choir|0)+1;w3ChoirFill();if(!was)msg('「불 꺼진 왕도」로 가는 길이 열렸습니다','#ffcf7a')}
  return r}}
{const _sa=sqAccept;sqAccept=function(id){const r=_sa.apply(this,arguments);if(SQBY[id]&&SQBY[id].j3q)w3ChoirFill();return r}}
{const _sd=saveData;saveData=function(){const d=_sd.apply(this,arguments);const n=P&&P.w3&&typeof P.w3==='object'?Math.max(0,P.w3.choir|0):0;if(n>0)d.w3=Object.assign({},d.w3&&typeof d.w3==='object'?d.w3:{},{choir:n});return d}}
{const _ld=load;load=function(d,slot){const ok=_ld.apply(this,arguments);if(ok&&P){P.w3=P.w3&&typeof P.w3==='object'?P.w3:{};const w=d&&d.w3;P.w3.choir=Math.max(w&&typeof w==='object'?Math.max(0,w.choir|0):0,w3ChoirN());w3ChoirFill()}return ok}}
setTimeout(()=>{try{if(window.__game)Object.assign(window.__game,{w3ChoirN})}catch(_){}},0);
