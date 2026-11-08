const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RATE=60;let cur='USD';
const fmt=(u,p)=>cur==='USD'?'$'+u:'₱'+(p??u*RATE*.9).toLocaleString('en-US');
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),2600)}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

// theme
const root=document.documentElement;
function setTheme(t){root.dataset.theme=t;document.body.classList.toggle('dk',t==='dark');store('theme',t)}
setTheme(store('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
$('#theme').onclick=()=>setTheme(root.dataset.theme==='dark'?'light':'dark');
// accounts (saved in this browser only)
const DB=()=>{try{return JSON.parse(store('lj_users')||'{}')}catch(e){return {}}};
const saveDB=d=>store('lj_users',JSON.stringify(d));
let me=store('lj_session')||null;
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('lj:'+s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const acctUser=()=>me?DB()[me]:null;
function sync(){const u=acctUser();$('#acct').textContent=u?u.name.split(' ')[0]:'My account';if(u){if(!$('#qn').value)$('#qn').value=u.name;if(!$('#qe').value)$('#qe').value=me}}
function log(kind,text){const d=DB();if(me&&d[me]){d[me][kind].unshift({t:text,d:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})});saveDB(d);return true}return false}
let mode='in',sub='orders';
function acct(){const u=acctUser();let h;
if(!u){h=`<h3>${mode==='in'?'Sign in':'Create account'}</h3><p style="font-size:11px;color:var(--mute);margin:0 0 10px">Accounts are saved in this browser only. Use one to keep your orders and quote requests together.</p><form id="af" style="display:grid;gap:8px">${mode==='up'?'<input id="an" placeholder="Your name" autocomplete="name">':''}<input id="ae" type="email" placeholder="Email" autocomplete="email"><input id="ap" type="password" placeholder="Password (8+ characters)" autocomplete="${mode==='in'?'current-password':'new-password'}"><div id="am" role="alert" style="font-size:11px;color:#c0392b;min-height:14px"></div><button class="btn" style="padding:9px">${mode==='in'?'Sign in':'Create account'}</button></form><p style="font-size:11px;text-align:center;margin:10px 0 0">${mode==='in'?'New here?':'Already have an account?'} <a href="#" id="sw">${mode==='in'?'Create an account':'Sign in'}</a></p>`}
else{const list=u[sub];h=`<h3>Hi, ${esc(u.name)}</h3><p style="font-size:11px;color:var(--mute);margin:0 0 10px">${esc(me)}</p><div class="tabs" id="at"><button data-s="orders" class="${sub==='orders'?'on':''}">Orders</button><button data-s="reqs" class="${sub==='reqs'?'on':''}">Quote requests</button></div><ul style="list-style:none;padding:0;margin:0 0 12px;max-height:200px;overflow:auto;font-size:12px">${list.length?list.map(x=>`<li style="padding:7px 0;border-bottom:1px solid var(--line)"><b>${esc(x.t)}</b><br><span style="color:var(--mute);font-size:10px">${x.d}</span></li>`).join(''):'<li style="color:var(--mute)">Nothing here yet. '+(sub==='orders'?'Pick a service in Pricing and send an order request.':'Use Get a free quote to send your first one.')+'</li>'}</ul><div style="display:flex;gap:8px"><button class="btn out" id="so">Sign out</button><button class="btn out" id="del">Delete account</button></div>`}
dlg.innerHTML=h+'<form method="dialog" style="margin-top:12px;text-align:right"><button class="btn out">Close</button></form>';
if(!dlg.open)dlg.showModal();
if(!u){$('#sw').onclick=e=>{e.preventDefault();mode=mode==='in'?'up':'in';acct()};
$('#af').onsubmit=async e=>{e.preventDefault();const m=$('#am'),em=$('#ae').value.trim().toLowerCase(),pw=$('#ap').value,d=DB();
if(!/^\S+@\S+\.\S+$/.test(em)){m.textContent='Enter a valid email.';return}
if(pw.length<8){m.textContent='Use a password of at least 8 characters.';return}
const hs=await sha(pw);
if(mode==='up'){const n=$('#an').value.trim();if(!n){m.textContent='Add your name.';return}if(d[em]){m.textContent='That email already has an account. Sign in instead.';return}d[em]={name:n,hash:hs,orders:[],reqs:[]};saveDB(d);if(!DB()[em]){m.textContent='This browser is blocking storage, so the account cannot be saved.';return}}
else if(!d[em]||d[em].hash!==hs){m.textContent='Email or password is not right.';return}
me=em;store('lj_session',em);sync();acct();toast('Signed in as '+em)}}
else{$('#at').onclick=e=>{const b=e.target.closest('button');if(b){sub=b.dataset.s;acct()}};
$('#so').onclick=()=>{me=null;store('lj_session','');sync();mode='in';acct();toast('Signed out')};
$('#del').onclick=e=>{const b=e.target;if(b.dataset.ok){const d=DB();delete d[me];saveDB(d);me=null;store('lj_session','');sync();mode='in';acct();toast('Account deleted')}else{b.dataset.ok=1;b.textContent='Click again to delete'}}}}
$('#acct').onclick=acct;sync();
document.addEventListener('click',e=>{const a=e.target.closest('#mailOrder');if(a)toast(log('orders',decodeURIComponent(a.dataset.o))?'Order saved to your account':'Sign in to keep a record of your orders')});

// hero art follows cursor
const art=$('#art');art.addEventListener('pointermove',e=>{const r=art.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
$('#c1').setAttribute('transform',`translate(${x*24} ${y*24})`);$('#c2').setAttribute('transform',`rotate(${15+x*50} 129 71) translate(${-x*16} ${y*16})`);$('#c3').setAttribute('transform',`translate(${x*-18} ${y*-14})`)});

// carousel
function car(box){const t=$('.track',box),dots=$('.dots',box),n=$('.n',box);
const kids=()=>[...t.children];
dots.innerHTML=kids().map(()=>'<i></i>').join('');
const step=()=>kids()[0].getBoundingClientRect().width+10;
const idx=()=>Math.min(kids().length-1,Math.round(t.scrollLeft/step()));
const upd=()=>{const i=idx();$$('i',dots).forEach((d,j)=>d.classList.toggle('on',j===i));n.textContent=(i+1)+' / '+kids().length};
t.addEventListener('scroll',upd,{passive:true});
$('.prev',box).onclick=()=>t.scrollBy({left:-step()});
$('.next',box).onclick=()=>{ if(t.scrollLeft+t.clientWidth>=t.scrollWidth-4)t.scrollTo({left:0});else t.scrollBy({left:step()})};
upd();}

// work
const pal=[['#2f5d8c','#b23a48','#fff'],['#3f6b52','#c4a04a','#f3efe3'],['#7a2e3a','#eee9dd','#c4a04a'],['#1b2a4a','#e0662b','#f3efe3']];
const work=[['Summit Outdoors','Icons and signage for a hiking trail network.',['Icons','Signage']],['Kape Sugbo','Packaging and logo for a Cebu coffee roaster.',['Logo','Packaging']],['Tidewater Yoga','Brand identity and class posters.',['Branding','Print']],['Mango Lane','Menu design and social templates.',['Menu','Social']],['Harbor Books','Bookmarks, bags and a storefront sign.',['Print']],['Nimbus Labs','Pitch deck and product icons.',['Deck','Icons']],['Orca Surf Co.','Merch and sticker pack.',['Merch']],['Fern & Field','Wedding stationery suite.',['Print']],['Pulse Fitness','App icons and promo video.',['Icons','Motion']],['Casa Lumi','Lighting brand logo and catalog.',['Logo']],['Bluebird Café','Menu boards and loyalty cards.',['Print']],['Atlas Movers','Fleet livery and brand guide.',['Branding']]];
$('#workTrack').innerHTML=work.map((w,i)=>{const p=pal[i%4],s=i%3;
const sh=s===0?`<polygon points="120,40 170,120 70,120" fill="${p[1]}"/><rect x="0" y="150" width="130" height="50" fill="${p[2]}"/>`:s===1?`<circle cx="110" cy="100" r="55" fill="${p[1]}"/><rect x="20" y="20" width="60" height="30" fill="${p[2]}"/>`:`<rect x="50" y="40" width="110" height="110" rx="18" fill="${p[1]}" transform="rotate(12 105 95)"/><circle cx="40" cy="160" r="22" fill="${p[2]}"/>`;
return `<div class="slide"><svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"><rect width="200" height="200" fill="${p[0]}"/>${sh}</svg><div><h3>${w[0]}</h3><p>${w[1]}</p><span>${w[2].map(x=>`<span class="tag">${x}</span>`).join('')}</span></div></div>`}).join('');

// services
const svc=[['Logo and branding','Logos, colors and type that hold together.'],['Poster and print','Posters, flyers, menus and cards.'],['Photo editing','Clean, polished photos.'],['Video and motion','Clips and animated logos.'],['Online store design','Shops that are easy to use.'],['Presentation design','Clean, friendly slide decks.']];
$('#svcTrack').innerHTML=svc.map(s=>`<div class="mini"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');

// pricing
const P1=[['Icons and illustration','A set of 12 custom icons.',350],['Social media pack','12 matching post designs.',180],['Presentation','A pitch deck of up to 15 slides.',90],['Canva template pack','10 editable templates for one brand.',120]];
const P2=[['Shopify store setup','Theme, up to 25 products, payments.',450],['Booking website','Services, calendar booking and reminders.',600],['SEO','Billed monthly. Keywords, on-page fixes, reports.',300],['Email marketing setup','Welcome flow and 3 campaign templates.',220]];
const P3=[['Social media management','Billed monthly. 12 posts, scheduling, replies.',500],['Video editing','Cut-and-polish videos with captions.',200],['Motion graphics','One animated logo or 30-second clip.',250],['Translation and localization','Up to 1,500 words, native-speaker review.',150]];
const ALL=[...P1,...P2,...P3];
function drawPrices(){[['p1',P1],['p2',P2],['p3',P3]].forEach(([id,a])=>{$('#'+id).innerHTML=a.map(p=>`<div class="mini"><b>${p[0]}</b><span>${p[1]}</span><div class="pr">${fmt(p[2])}</div><div class="pay"><button data-n="${p[0]}" data-p="${p[2]}" data-c="USD">Pay $${p[2]}</button><button data-n="${p[0]}" data-p="${p[2]}" data-c="PHP">Pay ₱${Math.round(p[2]*RATE*.9).toLocaleString('en-US')}</button></div></div>`).join('')})}
drawPrices();
$('#cur').onclick=e=>{const b=e.target.closest('button');if(!b)return;cur=b.dataset.c;$$('#cur button').forEach(x=>x.classList.toggle('on',x===b));drawPrices();drawGal()};
$$('.car').forEach(car);

// quote select
$('#qs').innerHTML+=ALL.map(p=>`<option>${p[0]}</option>`).join('')+'<option>Something else</option>';

// gallery
const G={photos:[['Neon Metropolis','A neon-lit city skyline at night. Suited to hero banners, posters and album art.','5K',49,'#6a2c91','#e83f9e'],['Forest in Morning Fog','Mist drifting through an old mountain forest. Calm, wide and easy to crop.','4K',39,'#1f6b5c','#5fe3c0'],['Golden Dunes at Dawn','Wide desert panorama with low sun and long shadows. Warm, clean tones.','4K',59,'#a8581e','#ffc457']],
logos:[['Compass Mark','A clean compass rose, vector, one or two colors.','SVG',29,'#1b2a4a','#c4a04a'],['Leaf Monogram','Soft leaf shape wrapped around a letter.','SVG',35,'#3f6b52','#eee9dd'],['Bold Block Wordmark','Heavy geometric type, ready for signage.','SVG',25,'#7a2e3a','#f3efe3']],
video:[['Logo Reveal Loop','A 5-second logo sting in 4K, alpha channel.','4K',79,'#2f5d8c','#fff'],['Ink Transition Pack','Ten wipes for edits, 4K, 60 fps.','4K',99,'#222','#e0662b'],['Particle Background','Seamless loop for slides and streams.','4K',69,'#3b2a6b','#9fd0ff']]};
let tab='photos';
function drawGal(){$('#gal').innerHTML=G[tab].map((g,i)=>`<div class="item"><div class="img"><svg viewBox="0 0 200 120" preserveAspectRatio="none"><defs><linearGradient id="g${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g[4]}"/><stop offset="1" stop-color="#111"/></linearGradient></defs><rect width="200" height="120" fill="url(#g${i})"/><circle cx="${60+i*40}" cy="40" r="16" fill="${g[5]}"/>${[0,1,2,3,4,5,6,7].map(k=>`<rect x="${k*25+4}" y="${60+(k*37%30)}" width="18" height="70" fill="#0b0d16"/>`).join('')}<text x="100" y="75" fill="#fff4" font-size="12" text-anchor="middle" transform="rotate(-12 100 75)">PREVIEW ONLY</text></svg><em>PROTECTED</em></div><div class="body"><div style="color:var(--mute);font-size:9px">${g[2]==='SVG'?'Vector':g[2]+' · wide'}</div><h3>${g[0]}</h3><p>${g[1]}</p><span style="font-size:8px;letter-spacing:.4px;color:var(--mute)">COMMERCIAL LICENSE</span><span class="price">${fmt(g[3])}</span><div class="row"><button data-pv="${i}">Preview</button><button data-buy="${i}">Buy</button></div></div></div>`).join('')}
drawGal();
$('#tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;tab=b.dataset.t;$$('#tabs button').forEach(x=>x.classList.toggle('on',x===b));drawGal()};
const dlg=$('#dlg');
function modal(html){dlg.innerHTML=html+'<form method="dialog" style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn out">Close</button></form>';dlg.showModal()}
document.addEventListener('click',e=>{
const pv=e.target.closest('[data-pv]'),by=e.target.closest('[data-buy]'),pay=e.target.closest('.pay button'),gl=dlg.querySelector('[data-go]');
if(pv){const g=G[tab][pv.dataset.pv];modal(`<h3>${g.slice(0,1)}</h3><svg viewBox="0 0 200 120"><rect width="200" height="120" fill="${g[4]}"/><circle cx="100" cy="50" r="26" fill="${g[5]}"/><text x="100" y="100" fill="#fff6" font-size="11" text-anchor="middle">PREVIEW ONLY</text></svg><p style="font-size:12px;color:var(--mute)">${g[1]}</p>`)}
if(by){const g=G[tab][by.dataset.buy];checkout(g[0]+' (license)',g[3],cur)}
if(pay)checkout(pay.dataset.n,+pay.dataset.p,pay.dataset.c);
});
function checkout(name,usd,c){const amt=c==='USD'?'$'+usd:'₱'+Math.round(usd*RATE*.9).toLocaleString('en-US');
modal(`<h3>Order summary</h3><p style="margin:4px 0"><b>${name}</b></p><p style="font-size:20px;font-family:'Cormorant Garamond',serif;margin:4px 0">${amt} <small style="font:11px Inter;color:var(--mute)">${c}</small></p><p style="font-size:11px;color:var(--mute)">This is a demo, so no payment is taken. Send the order as a request and we will reply with an invoice.</p><div style="display:flex;gap:8px"><a class="btn" id="mailOrder" data-o="${encodeURIComponent(name+' · '+amt)}" href="mailto:hello@leonjai.example?subject=${encodeURIComponent('Order: '+name)}&body=${encodeURIComponent('I would like to order '+name+' at '+amt+' ('+c+').')}">Send order request</a></div>`)}

// form
const EMAIL='hello@leonjai.example';
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(EMAIL);toast('Email copied: '+EMAIL)}catch(e){toast('Our email: '+EMAIL)}};
$('#qf').onsubmit=e=>{e.preventDefault();const m=$('#qm'),n=$('#qn').value.trim(),em=$('#qe').value.trim();
if(!n||!/^\S+@\S+\.\S+$/.test(em)||!$('#qs').value){m.style.color='#ffb4a8';m.textContent='Add your name, a valid email and what you need.';return}
const body=`Name: ${n}\nEmail: ${em}\nNeed: ${$('#qs').value}\nBudget: ${$('#qb').value}\n\n${$('#qd').value}`;
m.style.color='#a8e6b8';m.textContent='Thanks, '+n+'. Your email app should open with the request ready to send.';
log('reqs',$('#qs').value+' · budget: '+$('#qb').value);location.href=`mailto:${EMAIL}?subject=${encodeURIComponent('Quote request: '+$('#qs').value)}&body=${encodeURIComponent(body)}`;e.target.reset()};
// Japanese styling: kanji labels, side nav, progress line, petals, reveals
(()=>{const kj={'Selected work':'作品集','Services':'事業','Gallery':'画廊','Pricing':'料金','Get a free quote':'お見積り'};
$$('h2').forEach(h=>{const k=kj[h.textContent.trim()];if(k)h.insertAdjacentHTML('beforeend',`<span class="jp">${k}</span>`);h.classList.add('ink')});
const nk={work:'作品',services:'事業',gallery:'画廊',pricing:'料金',quote:'連絡'};
$$('nav a').forEach(a=>{const k=nk[a.getAttribute('href').slice(1)];if(k)a.insertAdjacentHTML('beforeend',`<small>${k}</small>`)});
const side=document.createElement('aside');side.className='side';side.innerHTML=Object.entries(nk).map(([id,k])=>`<a href="#${id}" aria-label="${id}">${k}</a>`).join('');document.body.appendChild(side);
const pr=document.createElement('div');pr.id='prog';document.body.appendChild(pr);
addEventListener('scroll',()=>{const m=document.documentElement.scrollHeight-innerHeight;pr.style.transform=`scaleX(${m>0?scrollY/m:0})`},{passive:true});
$$('.panel,.quote').forEach(e=>e.classList.add('door'));
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1}):null;
const reveal=()=>$$('.ink:not(.in),.door:not(.in)').forEach(e=>{const r=e.getBoundingClientRect();if(r.top<innerHeight*.92&&r.bottom>0)e.classList.add('in')});
addEventListener('scroll',reveal,{passive:true});addEventListener('resize',reveal);addEventListener('load',reveal);reveal();setTimeout(reveal,300);
if('IntersectionObserver' in window){const act=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('.side a,nav a').forEach(a=>a.classList.toggle('here',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-40% 0px -55% 0px'});Object.keys(nk).forEach(id=>{const s=document.getElementById(id);if(s)act.observe(s)})}
$('footer').insertAdjacentHTML('beforeend','<br>ご利用ありがとうございます');
$('#art').insertAdjacentHTML('beforeend','<svg class="enso" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" pathLength="100"/></svg>');
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const c=document.createElement('canvas');c.id='sakura';document.body.appendChild(c);const x=c.getContext('2d');let W,H;const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight};rs();addEventListener('resize',rs);
const ps=Array.from({length:innerWidth<640?14:28},()=>({x:Math.random()*W,y:Math.random()*H,r:4+Math.random()*5,v:.4+Math.random()*.7,s:Math.random()*6,w:.01+Math.random()*.02,a:Math.random()*6}));
(function f(){x.clearRect(0,0,W,H);const dk=root.dataset.theme==='dark';x.fillStyle=dk?'rgba(240,170,185,.5)':'rgba(236,150,170,.55)';
ps.forEach(p=>{p.y+=p.v;p.s+=p.w;p.x+=Math.sin(p.s)*.6+.25;p.a+=.02;if(p.y>H+10||p.x>W+10){p.y=-10;p.x=Math.random()*W}
x.save();x.translate(p.x,p.y);x.rotate(p.a);x.scale(1,.6+.4*Math.sin(p.a*1.3));x.beginPath();x.moveTo(0,-p.r);x.bezierCurveTo(p.r,-p.r*.6,p.r*.8,p.r*.7,0,p.r);x.bezierCurveTo(-p.r*.8,p.r*.7,-p.r,-p.r*.6,0,-p.r);x.fill();x.restore()});requestAnimationFrame(f)})();
})();
