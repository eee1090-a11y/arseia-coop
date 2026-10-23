/* 작업I: 화면 성벽만 교체. 충돌/저장/길 자료는 그대로. */
const I29={half:760,gap:125,visual:[],corners:[],gates:[]};
function i29Build(){const t=RCACHE.royal&&RCACHE.royal.town;if(!t||I29.visual.length)return;const H=I29.half,G=I29.gap;
 const obj=(k,x,y,pv,len)=>({k,x:t.x+x,y:t.y+y,pv,tprop:1,s:1,v:0,i29:1,len});
 for(const pv of [0,1])for(const sign of [-1,1]){
  for(const [a,b] of [[-H,-G],[G,H]]){const n=Math.ceil((b-a)/140),len=(b-a)/n;
   for(let j=0;j<n;j++){const u=a+(j+.5)*len,d=obj('cwall',pv?sign*H:u,pv?u:sign*H,pv,len);d.ends=pv?[[d.x,d.y-len/2],[d.x,d.y+len/2]]:[[d.x-len/2,d.y],[d.x+len/2,d.y]];I29.visual.push(d);}}
  I29.gates.push(obj('gatepoint',pv?sign*H:0,pv?0:sign*H,pv));
  for(const u of [-G-22,G+22])I29.visual.push(obj('gatetower',pv?sign*H:u,pv?u:sign*H,0));
 }
 for(const x of [-H,H])for(const y of [-H,H]){const d=obj('gatetower',x,y,0);I29.corners.push(d);I29.visual.push(d);}
}
i29Build();
{const old=decoVisible;decoVisible=function(cx0,cx1,cy0,cy1,out){const r=old.apply(this,arguments);if(REG.id!=='royal'||IN||DG)return r;i29Build();
 for(let i=r.length-1;i>=0;i--)if(r[i].k==='cwall'||r[i].k==='gatetower')r.splice(i,1);
 for(const d of I29.visual)if(d.x>=(cx0-1)*CH&&d.x<(cx1+2)*CH&&d.y>=(cy0-1)*CH&&d.y<(cy1+2)*CH)r.push(d);return r;};}
// 기존 그림의 앞끝 기준점을 중앙으로 바꾸고, 길이와 바닥 기울기만 맞춘다.
function i29Wall(d){const PK=cgPK(CG.TOWN),r=PK&&cgR(PK,d.pv?'095_castle_wall_axis_y':'095_castle_wall_axis_x');
 const s=d._s;if(!r){const e=twProp(d);if(e){ctx.save();ctx.translate(s.x,s.y);const k=d.len/140;ctx.transform(k,(d.pv?-1:1)*(k-1)*.5,0,1,0,0);SC.draw(ctx,e,0,0);ctx.restore();}return;}
 const ends=d.pv?[45.5,141,230,64]:[35,61,207,141],span=ends[2]-ends[0],a=d.len*KI/span,sg=d.pv?-1:1;ctx.save();ctx.translate(s.x,s.y);ctx.transform(a,sg*a*.5-(ends[3]-ends[1])/span,0,1,0,0);
 FLC.draw(ctx,PK.img,r[0],r[1],r[2],r[3],-(ends[0]+ends[2])/2,-(ends[1]+ends[3])/2,r[2],r[3]);ctx.restore();
}
{const old=twDrawProp;twDrawProp=function(d){if(d.i29&&d.k==='cwall'){i29Wall(d);return;}return old.apply(this,arguments);};}
setTimeout(()=>{if(window.__game)Object.assign(window.__game,{I29,i29Wall});},0);


