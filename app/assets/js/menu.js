// mobile menu
(()=>{const h=document.querySelector('header'),m=document.getElementById('menu');if(!m)return;
const set=o=>{h.classList.toggle('open',o);m.setAttribute('aria-expanded',o);m.setAttribute('aria-label',o?'Close menu':'Open menu')};
m.onclick=()=>set(!h.classList.contains('open'));
h.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>set(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
addEventListener('resize',()=>{if(innerWidth>1240)set(false)});
document.addEventListener('click',e=>{if(!h.contains(e.target))set(false)});
})();
