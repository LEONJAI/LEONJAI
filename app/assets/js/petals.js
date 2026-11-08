// Falling sakura petals for the login, profile, reset and payment pages (the home page has its own copy in script.js).
(() => {
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const c=document.createElement('canvas');c.id='sakura';document.body.appendChild(c);const x=c.getContext('2d');let W,H;const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight};rs();addEventListener('resize',rs);
const ps=Array.from({length:innerWidth<640?16:32},()=>{const d=.3+Math.random()*.7;return {x:Math.random()*W,y:Math.random()*H,r:5+d*10,d,v:.25+d*.55,s:Math.random()*6,w:.008+Math.random()*.012,a:Math.random()*6,rot:(Math.random()-.5)*.02,f:Math.random()*6,fs:.01+Math.random()*.02}});
(function f(){x.clearRect(0,0,W,H);const dk=root.dataset.theme==='dark';
ps.forEach(p=>{p.y+=p.v;p.s+=p.w;p.x+=Math.sin(p.s)*.5+.3*p.d+.1;p.a+=p.rot;p.f+=p.fs;if(p.y>H+20||p.x>W+20){p.y=-20;p.x=Math.random()*W*1.1-W*.1}
const al=(dk?.45:.4)+.4*p.d,g=x.createLinearGradient(0,-p.r,0,p.r);g.addColorStop(0,dk?`rgba(255,214,228,${al})`:`rgba(255,225,234,${al})`);g.addColorStop(1,dk?`rgba(238,140,172,${al})`:`rgba(240,150,176,${al})`);
x.save();x.translate(p.x,p.y);x.rotate(p.a);x.scale(.45+.55*Math.abs(Math.cos(p.f)),1);x.fillStyle=g;x.shadowColor=dk?'rgba(255,170,200,.5)':'rgba(240,140,170,.35)';x.shadowBlur=p.d>.7?8:3;
x.beginPath();x.moveTo(0,-p.r);x.bezierCurveTo(p.r*.8,-p.r*.5,p.r*.55,p.r*.75,p.r*.08,p.r);x.quadraticCurveTo(0,p.r*.82,-p.r*.08,p.r);x.bezierCurveTo(-p.r*.55,p.r*.75,-p.r*.8,-p.r*.5,0,-p.r);x.fill();x.restore()});requestAnimationFrame(f)})();
})();
