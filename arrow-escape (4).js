/* Game (Arrow Escape 2D) · módulo isolado para PinkOS. Sem dependências. Usa o sistema de janelas existente (wins, R, N, WD, T, open). */
(function(){
const DS=[[1,0],[-1,0],[0,1],[0,-1]],K=(x,y)=>x+","+y;
const tri=(p,a,b,c)=>{const s=(p,q,r)=>(p[0]-r[0])*(q[1]-r[1])-(q[0]-r[0])*(p[1]-r[1]),d=[s(p,a,b),s(p,b,c),s(p,c,a)];return!(d.some(v=>v<0)&&d.some(v=>v>0))};
const SH={
 heart:(u,v)=>{const x=u*1.25,y=-v*1.25+.15;return Math.pow(x*x+y*y-1,3)-x*x*y*y*y<0},
 star:(u,v)=>Math.hypot(u,v)<.3+.7*Math.pow(Math.abs(Math.cos(2.5*(Math.atan2(v,u)+Math.PI/2))),1.4),
 cat:(u,v)=>{const a=Math.abs(u);return((u/.95)**2+((v-.2)/.72)**2<1||tri([-a,v],[-.95,.05],[-.85,-.9],[-.15,-.4]))&&Math.hypot(a-.42,v-.2)>.11&&Math.hypot(u,v-.48)>.09}};
const LV=[{n:9,f:SH.heart,m:3,seed:1,name:"Easy|Fácil"},{n:13,f:SH.star,m:5,seed:7,name:"Medium|Médio"},{n:19,f:SH.cat,m:6,seed:13,name:"Hard|Difícil"}];
const rnd=s=>()=>(s=(s*1664525+1013904223)>>>0)/4294967296;
const mapOf=S=>{const m=new Map();S.forEach(s=>{if(!s.out)s.c.forEach(c=>m.set(K(c[0],c[1]),s))});return m};
function ray(m,s,n){const h=s.c[s.c.length-1];let x=h[0]+s.d[0],y=h[1]+s.d[1];while(x>=0&&y>=0&&x<n&&y<n){const q=m.get(K(x,y));if(q)return q;x+=s.d[0];y+=s.d[1]}return null}
function peel(S,n){const m=mapOf(S);let a=S.slice(),r=0,f=1;while(a.length&&f){const fr=a.filter(s=>!ray(m,s,n));f=fr.length;fr.forEach(s=>s.c.forEach(c=>m.delete(K(c[0],c[1]))));a=a.filter(s=>!fr.includes(s));r++}return{r,a}}
function solve(S,n){const p=peel(S,n);return p.a.length?0:p.r}
const aim=s=>{if(s.c.length>1){const a=s.c[s.c.length-2],h=s.c[s.c.length-1];s.d=[h[0]-a[0],h[1]-a[1]]}};
function try1(L,seed){const r=rnd(seed),n=L.n,free=new Set(),S=[];
 for(let x=0;x<n;x++)for(let y=0;y<n;y++)if(L.f((x+.5)/n*2-1,(y+.5)/n*2-1))free.add(K(x,y));
 const nb=(x,y)=>DS.map(d=>[x+d[0],y+d[1]]).filter(q=>free.has(K(q[0],q[1])));
 while(free.size){let b=null,bn=9;for(const k of free){const [x,y]=k.split(",").map(Number),c=nb(x,y).length;if(c<bn||(c==bn&&r()<.3)){bn=c;b=[x,y]}}
  const c=[b];free.delete(K(b[0],b[1]));const len=2+Math.floor(r()*(L.m-1));
  while(c.length<len){const h=c[c.length-1],o=nb(h[0],h[1]);if(!o.length)break;const q=o[Math.floor(r()*o.length)];c.push(q);free.delete(K(q[0],q[1]))}
  let d;if(c.length>1){const a=c[c.length-2],h=c[c.length-1];d=[h[0]-a[0],h[1]-a[1]]}else d=DS[Math.floor(r()*4)];
  S.push({c,d,out:0})}
 for(let it=0;it<400;it++){const p=peel(S,n);if(!p.a.length)return S;const t=p.a[Math.floor(r()*p.a.length)];
  if(t.c.length>1){t.c.reverse();aim(t)}else t.d=DS[Math.floor(r()*4)]}
 return null}
function gen(L){for(let s=L.seed;;s++){const S=try1(L,s);if(S)return S}}
const W0=typeof window!=="undefined"?window:globalThis;W0.AE_LOGIC={gen,try1,solve,ray,LV,mapOf};
if(typeof document==="undefined"||typeof wins==="undefined"||typeof R==="undefined"||W0.__ae)return;W0.__ae=1;

const css=document.createElement("style");css.textContent=`
#aeBtn{background:var(--baby);border:1px solid var(--line);color:var(--pk);font-weight:600}
#task #aeBtn:hover{background:#fff;border-color:var(--pk)}
.ae-root{position:relative;overflow:hidden;margin:-22px;height:min(560px,calc(100vh - 220px));min-height:340px;background:radial-gradient(90% 70% at 50% 45%,#fff,var(--pale) 60%,var(--baby));outline:none;line-height:1.3}
@media(max-width:700px){.ae-root{height:calc(100dvh - 132px - env(safe-area-inset-top,0px))}}
.ae-c{position:absolute;inset:0;width:100%;height:100%;touch-action:manipulation;cursor:pointer}
.ae-h{position:absolute;top:8px;left:8px;right:8px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;z-index:2;pointer-events:none}
.ae-h .sp{flex:1}.ae-h b,.ae-h .pill{pointer-events:none}
.ae-h b{font:600 18px Playfair Display,serif}.ae-h .pill{border:1px solid var(--line);background:#fffd;border-radius:99px;padding:2px 12px;font-size:13px}
.ae-h button{all:unset;pointer-events:auto;position:relative;cursor:pointer;padding:4px 10px;border-radius:8px;font-size:13px;font-weight:500;background:#fffc;border:1px solid var(--line)}
.ae-h button:hover{background:#fff;border-color:var(--pk)}
.ae-o{position:absolute;inset:0;z-index:3;display:none;place-items:center;text-align:center;padding:16px;background:#fff4f8e8;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.ae-o.on{display:grid;animation:aeIn .3s ease-out}@keyframes aeIn{0%{opacity:0;transform:scale(.97)}}
.ae-o h2{margin:0 0 6px;font:600 30px/1.1 Playfair Display,serif}.ae-o p{margin:0 0 12px;max-width:380px}
.ae-o,.ae-o *{pointer-events:auto}.ae-o .btn{margin:4px;position:relative}.ae-hint{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:12px;color:var(--mute);z-index:1;pointer-events:none}`;
document.head.appendChild(css);

const root=document.createElement("div");root.className="ae-root";
root.innerHTML='<canvas class="ae-c"></canvas><div class="ae-h"><b id="aeT"></b><span class="pill" id="aeL"></span><span class="pill" id="aeR"></span><span class="pill" id="aeS"></span><span class="sp"></span><button data-a="re">↺</button><button data-a="snd"></button><button data-a="menu"></button></div><div class="ae-hint"></div><div class="ae-o"></div>';
const cv=root.querySelector("canvas"),cx=cv.getContext("2d"),ov=root.querySelector(".ae-o");
const COL=["#d81b72","#e8458b","#b0306d","#ff6aa6"];
let Wd=0,Hd=0,S=[],M=new Map(),lv=0,n=9,left=0,mist=0,tot=0,gain=0,st="menu",hov=null,parts=[],run=0,snd=true,ac=null,cs=20,ox=0,oy=0;
const now=()=>performance.now();
function sfx(f,d,ty,g){if(!snd)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),v=ac.createGain();o.type=ty||"sine";o.frequency.value=f;v.gain.value=g||.035;v.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(v).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch{}}
const px=p=>[ox+(p[0]+.5)*cs,oy+(p[1]+.5)*cs];
const at=(P,u)=>{const i=Math.max(0,Math.min(Math.floor(u),P.length-2)),f=u-i;return[P[i][0]+(P[i+1][0]-P[i][0])*f,P[i][1]+(P[i+1][1]-P[i][1])*f]};

function snake(s,i,u0,al,off,col,glow){const P=s.P,m=s.c.length,u1=u0+m-1,L=[at(P,u0)];
 for(let k=Math.floor(u0)+1;k<u1;k++)L.push(P[Math.min(k,P.length-1)]);if(m>1)L.push(at(P,u1));
 const q=L.map(px).map(p=>[p[0]+off[0],p[1]+off[1]]),h=q[q.length-1],d=s.d;
 cx.globalAlpha=al;cx.lineCap=cx.lineJoin="round";
 if(glow){cx.strokeStyle="#fff";cx.lineWidth=cs*.5;cx.beginPath();q.forEach((p,k)=>k?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke()}
 cx.strokeStyle=col;cx.lineWidth=cs*.22;cx.beginPath();q.forEach((p,k)=>k?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke();
 const tp=[h[0]+d[0]*cs*.42,h[1]+d[1]*cs*.42],pp=[-d[1]*cs*.3,d[0]*cs*.3];
 cx.fillStyle=col;cx.beginPath();cx.moveTo(tp[0],tp[1]);cx.lineTo(h[0]+pp[0],h[1]+pp[1]);cx.lineTo(h[0]-pp[0],h[1]-pp[1]);cx.closePath();cx.fill();cx.globalAlpha=1}

function draw(){const t=now();cx.clearRect(0,0,Wd,Hd);
 S.forEach((s,i)=>{let off=[0,0],col=COL[i%4],glow=0;
  if(s.out){const u=(t-s.t0)/32,tot=s.c.length+n;if(u>=tot)return;snake(s,i,u,Math.min(1,(tot-u)/6),off,col,0);return}
  if(s.sh&&t-s.sh<450){const e=Math.sin((t-s.sh)*.06)*.18*cs*(1-(t-s.sh)/450);off=[s.d[0]*e,s.d[1]*e]}
  if(s.fl&&t-s.fl<700)col="#17121A";if(hov===s){col="#ff4f9a";glow=1}
  if(s.hi&&t-s.hi<1800&&Math.floor((t-s.hi)/220)%2==0)glow=1;
  snake(s,i,0,1,off,col,glow)});
 parts=parts.filter(q=>(q.l-=.02)>0);for(const q of parts){q.x+=q.vx;q.y+=q.vy;q.vy+=.12;cx.globalAlpha=q.l;cx.fillStyle=q.c;cx.beginPath();cx.arc(q.x,q.y,q.s*q.l,0,7);cx.fill()}cx.globalAlpha=1}

function loop(){if(!root.isConnected){run=0;return}if(!root.offsetParent){setTimeout(loop,250);return}
 const b=cv.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;
 if(b.width!=Wd||b.height!=Hd||cv.width!=Math.round(b.width*d)){Wd=b.width;Hd=b.height;cv.width=Math.round(Wd*d);cv.height=Math.round(Hd*d);cx.setTransform(d,0,0,d,0,0)}
 cs=Math.min(Wd-16,Hd-84)/n;ox=(Wd-cs*n)/2;oy=46+(Hd-84-cs*n)/2;
 if(st!="menu")draw();else cx.clearRect(0,0,Wd,Hd);requestAnimationFrame(loop)}

function pick(x,y){let best=null,bd=cs*.55;for(const s of S){if(s.out)continue;const q=s.c.map(px);for(let i=0;i<q.length;i++){const a=q[i],b=q[Math.min(i+1,q.length-1)],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy,k=l?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l)):0,e=Math.hypot(x-a[0]-dx*k,y-a[1]-dy*k);if(e<bd){bd=e;best=s}}}return best}
function burst(s){const[x,y]=px(s.c[s.c.length-1]);for(let i=0;i<16;i++){const a=Math.random()*6.28,v=1+Math.random()*3;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,l:1,s:2+Math.random()*4,c:["#e8458b","#ffd3e5","#fff","#ff8fbf"][i%4]})}}
function remove(s){if(st!="play"||s.out)return;const b=ray(M,s,n);
 if(b){mist++;s.sh=now();if(b!==s)b.fl=now();sfx(150,.18,"triangle",.05);return}
 s.out=1;s.t0=now();s.c.forEach(c=>M.delete(K(c[0],c[1])));left--;burst(s);sfx(600+(S.length-left)*10,.14);hud();
 if(!left)setTimeout(win,800)}
function win(){if(st!="play")return;gain=Math.max(S.length*10-mist*5,S.length*2);tot+=gain;st=lv<2?"done":"final";[523,659,784,1046].forEach((f,i)=>setTimeout(()=>sfx(f,.25),i*110));ovl()}
function start(i){lv=i;n=LV[i].n;S=gen(LV[i]);S.forEach(s=>{const h=s.c[s.c.length-1];s.P=s.c.slice();for(let k=1;k<=s.c.length+n+2;k++)s.P.push([h[0]+s.d[0]*k,h[1]+s.d[1]*k])});M=mapOf(S);left=S.length;mist=0;parts=[];st="play";hov=null;ovl()}

const tx=(en,pt)=>T(en+"|"+pt);
function hud(){const q=s=>root.querySelector(s);q("#aeT").textContent=tx("Game","Jogo");q("#aeL").textContent=st=="menu"?"":tx("Level ","Nível ")+(lv+1)+" · "+T(LV[lv].name);q("#aeR").textContent=st=="menu"?"":tx("Left: ","Restam: ")+left;q("#aeS").textContent=tx("Score: ","Pontos: ")+tot;
 q("[data-a=snd]").textContent=snd?"♪ on":"♪ off";q("[data-a=menu]").textContent="☰ Menu";
 q(".ae-hint").textContent=st=="play"?tx("Click an arrow with a clear path to slide it out|Clica numa seta com o caminho livre para a fazer sair"):""}
function ovl(){const b=(a,l,c)=>`<button class="btn ${c||""}" data-a="${a}">${l}</button>`;let h="";
 if(st=="menu")h=`<div><h2>${tx("Game","Jogo")} ✦</h2><p>${tx("Slide out every arrow whose path is clear. Blocked ones won’t budge, so plan your order!","Faz sair todas as setas com o caminho livre. As bloqueadas não se mexem, por isso planeia a ordem!")}</p>${LV.map((l,i)=>b("lv"+i,(i+1)+" · "+T(l.name),i?"w":"")).join("<br>")}</div>`;
 else if(st=="done")h=`<div><h2>${tx("Level complete ♡","Nível concluído ♡")}</h2><p>+${gain} ${tx("points · total ","pontos · total ")}${tot}</p>${b("next",tx("Next level ›","Próximo nível ›"))}${b("re",tx("Replay","Repetir"),"w")}</div>`;
 else if(st=="final")h=`<div><h2>${tx("All levels cleared ✦","Todos os níveis concluídos ✦")}</h2><p>${tx("Final score: ","Pontuação final: ")}<b>${tot}</b></p>${b("again",tx("Play again","Jogar outra vez"))}${b("menu",tx("Menu","Menu"),"w")}</div>`;
 ov.innerHTML=h;ov.classList.toggle("on",!!h);hud()}

root.addEventListener("click",e=>{const el=e.target.closest("[data-a]");if(!el)return;const a=el.dataset.a;
 if(a.startsWith("lv")){tot=0;start(+a[2])}else if(a=="next")start(lv+1);else if(a=="again"){tot=0;start(0)}
 else if(a=="re"){if(st=="done")tot-=gain;start(lv)}else if(a=="menu"){st="menu";ovl()}
 else if(a=="snd"){snd=!snd;hud()}
});
cv.addEventListener("click",e=>{if(st!="play")return;const r=cv.getBoundingClientRect(),s=pick(e.clientX-r.left,e.clientY-r.top);if(s)remove(s)});
cv.addEventListener("pointermove",e=>{if(st!="play")return;const r=cv.getBoundingClientRect();hov=pick(e.clientX-r.left,e.clientY-r.top)});
cv.addEventListener("pointerleave",()=>hov=null);

N.game="Game|Jogo";WD.game=620;
R.game=()=>{queueMicrotask(()=>{const w=wins.game,bd=w&&w.el.querySelector(".bd");if(bd&&root.parentNode!==bd)bd.appendChild(root);ovl();if(!run){run=1;loop()}});return""};
const task=document.getElementById("task");
if(task){const b=document.createElement("button");b.id="aeBtn";b.type="button";const lb=()=>b.textContent="◆ "+T("Game|Jogo");lb();b.onclick=()=>open("game");task.appendChild(b);document.addEventListener("click",e=>{if(e.target.closest("[data-l]"))setTimeout(lb,0)})}
})();
