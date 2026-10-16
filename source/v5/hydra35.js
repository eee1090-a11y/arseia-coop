/* ---------- v35: 히드라 = 설치형 (사용자 2026-10-15 「파이어 살라만더는 히드라로 바꿔주고 따로 별도의 피통을 부여하지 않았으면 좋겠어.
   몹들이 다 히드라한테 어그로를 끌리니까 노코스트로 너무 안전하게 사냥이 되니까. 그냥 설치형 장판과 같은 컨셉이라고 생각하면돼.」)
   · 이름은 names.js에서 다시 「히드라」. 히드라(form hydra)는 생명력 막대 없음(r5.js) · 몬스터가 노리지 않음(enemyTarget) · 피해를 받지 않음(hurtAlly)
     · 몬스터 투사체가 히드라에 막히지 않음(b3.js). 지속 시간(10초)이 지나면 사라지는 것과 3마리까지는 그대로. */
const isNoTg=a=>!!(a&&a.s&&a.s.form==='hydra');
{const _et=enemyTarget;enemyTarget=function(e){if(!allies.some(isNoTg))return _et.apply(this,arguments);const all=allies;allies=all.filter(a=>!isNoTg(a));try{return _et.apply(this,arguments)}finally{allies=all}}}
{const _ha=hurtAlly;hurtAlly=function(a){if(isNoTg(a))return;return _ha.apply(this,arguments)}}
