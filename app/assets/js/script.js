(function(){
 var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 var $=function(id){return document.getElementById(id)};

 /* One carousel for work, services and pricing */
 function carousel(stage,o){
  var track=stage.querySelector(".track"),dotsEl=stage.querySelector(".dots"),count=stage.querySelector(".count"),
      items=o.group?Array.prototype.slice.call(track.children):null,
      slides=[],n=0,i=0,key="",timer=null,inView=true,moved=false,sx=null;
  function build(){
   if(items){
    var g=o.grid(window.innerWidth),k=g.join("x");
    if(k===key&&slides.length)return false;
    key=k;track.innerHTML="";slides=[];
    var per=g[0]*g[1];
    for(var a=0;a<items.length;a+=per){
     var pg=document.createElement("div");pg.className="pg";pg.style.setProperty("--pv",g[0]);
     items.slice(a,a+per).forEach(function(c){pg.appendChild(c)});
     track.appendChild(pg);slides.push(pg);
    }
   }else if(!slides.length){slides=Array.prototype.slice.call(track.children)}
   n=slides.length;dotsEl.innerHTML="";
   for(var d=0;d<n;d++){(function(d){var b=document.createElement("button");b.setAttribute("aria-label","Go to "+(d+1));b.onclick=function(){go(d)};dotsEl.appendChild(b)})(d)}
   i=Math.min(i,n-1);
   return true;
  }
  function run(){
   clearInterval(timer);timer=null;
   if(inView&&!document.hidden&&n>1)timer=setInterval(function(){go(i+1)},o.delay||5000);
   count.setAttribute("aria-live",timer?"off":"polite");
  }
  function go(x){
   i=(x+n)%n;
   track.style.transform="translateX(-"+i*100+"%)";
   stage.style.background=o.colors[i%o.colors.length];
   count.textContent=(i+1)+" / "+n;
   Array.prototype.forEach.call(dotsEl.children,function(d,j){d.setAttribute("aria-current",j===i)});
   slides.forEach(function(s,j){s.classList.toggle("on",j===i)});
   run();
  }
  stage.querySelector(".prev").onclick=function(){go(i-1)};
  stage.querySelector(".next").onclick=function(){go(i+1)};
  stage.tabIndex=0;
  stage.addEventListener("keydown",function(e){if(e.key==="ArrowLeft")go(i-1);if(e.key==="ArrowRight")go(i+1)});
  document.addEventListener("visibilitychange",run);
  if("IntersectionObserver" in window)new IntersectionObserver(function(en){inView=en[0].isIntersecting;run()},{threshold:.2}).observe(stage);
  track.addEventListener("pointerdown",function(e){sx=e.clientX;moved=false});
  window.addEventListener("pointerup",function(e){if(sx===null)return;var d=e.clientX-sx;moved=Math.abs(d)>10;if(Math.abs(d)>50)go(d<0?i+1:i-1);sx=null});
  if(o.clickNext)track.addEventListener("click",function(){if(!moved)go(i+1)});
  if(items)window.addEventListener("resize",function(){if(build())go(i)});
  build();go(0);
 }

 carousel($("workStage"),{clickNext:true,delay:5000,
  colors:["#2F5D8A","#7A2E3A","#14213D","#3E6B57","#2F5D8A","#14213D","#7A2E3A","#3E6B57","#14213D","#2F5D8A","#3E6B57","#7A2E3A"]});
 carousel($("svcStage"),{group:true,delay:6000,colors:["#2F5D8A","#7A2E3A","#3E6B57"],
  grid:function(w){return w<=560?[1,3]:w<=900?[2,2]:[4,1]}});

 carousel($("priceStageA"),{group:true,delay:8000,colors:["#2F5D8A","#7A2E3A","#3E6B57"],
  grid:function(w){return w<=560?[1,1]:w<=900?[2,1]:[4,1]}});
 carousel($("priceStageB"),{group:true,delay:8000,colors:["#7A2E3A","#3E6B57","#2F5D8A"],
  grid:function(w){return w<=560?[1,1]:w<=900?[2,1]:[4,1]}});

 /* Hero shapes follow the cursor */
 var play=$("play"),sp=play.querySelectorAll("span"),f=[40,-60,90];
 function move(e){
  var r=play.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  for(var j=0;j<sp.length;j++)sp[j].style.transform="translate("+(x*f[j])+"px,"+(y*f[j])+"px)";
 }
 play.addEventListener("pointermove",move);
 play.addEventListener("pointerleave",function(){for(var j=0;j<sp.length;j++)sp[j].style.transform=""});

 $("mail").onclick=function(){
  var b=this,t="hello@jeisaru.com";
  try{navigator.clipboard.writeText(t)}catch(e){}
  b.textContent="Copied: "+t;setTimeout(function(){b.textContent="Copy our email"},2500);
 };

 /* Dark mode switch */
 var ds=$("darkSwitch");
 if(ds){
  var isDark=function(){var t=document.documentElement.getAttribute("data-theme");return t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches};
  var sync=function(){ds.setAttribute("aria-checked",String(isDark()))};
  ds.onclick=function(){
   var next=isDark()?"light":"dark";
   document.documentElement.setAttribute("data-theme",next);
   try{localStorage.setItem("theme",next)}catch(e){}
   sync();
  };
  sync();
 }

 /* Mobile menu */
 var mb=$("menuBtn"),nav=$("nav");
 if(mb&&nav){
  var shut=function(){nav.classList.remove("open");mb.setAttribute("aria-expanded","false")};
  mb.onclick=function(e){e.stopPropagation();var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",String(o))};
  nav.addEventListener("click",function(e){if(e.target.closest("a"))shut()});
  document.addEventListener("click",function(e){if(!nav.contains(e.target))shut()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")shut()});
 }
})();
