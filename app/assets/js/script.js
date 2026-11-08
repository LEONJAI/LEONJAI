/* LeonjAI home page: work, services, pricing, quote form */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RATE=60;let cur='USD';
const fmt=(u,p)=>cur==='USD'?'$'+u:'₱'+(p??u*RATE*.9).toLocaleString('en-US');
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),2600)}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

// theme
function log(){return false}

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
function drawPrices(){[['p1',P1],['p2',P2],['p3',P3]].forEach(([id,a])=>{$('#'+id).innerHTML=a.map(p=>`<div class="mini"><b>${p[0]}</b><span>${p[1]}</span><div class="pr">${fmt(p[2])}</div><div class="pay"><button data-n="${p[0]}" data-p="${p[2]}" data-c="USD">Pay $${p[2]}</button><button data-n="${p[0]}" data-p="${p[2]}" data-c="PHP">Pay ₱${Math.round(p[2]*RATE*.9).toLocaleString('en-US')}</button></div><button class="add" data-add="${p[0]}" data-p="${p[2]}">Add order</button></div>`).join('')})}
drawPrices();
$('#cur').onclick=e=>{const b=e.target.closest('button');if(!b)return;cur=b.dataset.c;$$('#cur button').forEach(x=>x.classList.toggle('on',x===b));drawPrices()};
$$('.car').forEach(car);

// quote select
$('#qs').innerHTML+=ALL.map(p=>`<option>${p[0]}</option>`).join('')+'<option>Something else</option>';

const dlg=$('#dlg');
function modal(html){dlg.innerHTML=html+'<form method="dialog" style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn out">Close</button></form>';dlg.showModal()}
document.addEventListener('click',e=>{const pay=e.target.closest('.pay button');if(!pay)return;if(pay.dataset.c==='PHP')location.href='app/pay-peso/?item='+encodeURIComponent(pay.dataset.n)+'&usd='+pay.dataset.p;else checkout(pay.dataset.n,+pay.dataset.p,pay.dataset.c)});
function checkout(name,usd,c){const amt=c==='USD'?'$'+usd:'₱'+Math.round(usd*RATE*.9).toLocaleString('en-US');
modal(`<h3>Order summary</h3><p style="margin:4px 0"><b>${name}</b></p><p style="font-size:20px;font-family:'Cormorant Garamond',serif;margin:4px 0">${amt} <small style="font:11px Inter;color:var(--mute)">${c}</small></p><p style="font-size:11px;color:var(--mute)">This is a demo, so no payment is taken. Send the order as a request and we will reply with an invoice.</p><div style="display:flex;gap:8px"><a class="btn" id="mailOrder" data-o="${encodeURIComponent(name+' · '+amt)}" href="mailto:${EMAIL}?subject=${encodeURIComponent('Order: '+name)}&body=${encodeURIComponent('I would like to order '+name+' at '+amt+' ('+c+').')}">Send order request</a></div>`)}

// form
const EMAIL=(window.LEONJAI_CONFIG&&window.LEONJAI_CONFIG.CONTACT_EMAIL)||'hello@leonjai.example';
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(EMAIL);toast('Email copied: '+EMAIL)}catch(e){toast('Our email: '+EMAIL)}};
$('#qf').onsubmit=e=>{e.preventDefault();const m=$('#qm'),n=$('#qn').value.trim(),em=$('#qe').value.trim();
if(!n||!/^\S+@\S+\.\S+$/.test(em)||!$('#qs').value){m.style.color='#ffb4a8';m.textContent='Add your name, a valid email and what you need.';return}
const body=`Name: ${n}\nEmail: ${em}\nNeed: ${$('#qs').value}\nBudget: ${$('#qb').value}\n\n${$('#qd').value}`;
m.style.color='#a8e6b8';m.textContent='Thanks, '+n+'. Your email app should open with the request ready to send.';
log('reqs',$('#qs').value+' · budget: '+$('#qb').value);location.href=`mailto:${EMAIL}?subject=${encodeURIComponent('Quote request: '+$('#qs').value)}&body=${encodeURIComponent(body)}`;e.target.reset()};
// Japanese styling: kanji labels, side nav, progress line, petals, reveals
(()=>{const kj={'Selected work':'作品集','Services':'事業','Pricing':'料金','Get a free quote':'お見積り'};
$$('h2').forEach(h=>{const k=kj[h.textContent.trim()];if(k)h.insertAdjacentHTML('beforeend',`<span class="jp">${k}</span>`);h.classList.add('ink')});
const nk={work:'作品',services:'事業',pricing:'料金',quote:'連絡'};
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
const ps=Array.from({length:innerWidth<640?16:32},()=>{const d=.3+Math.random()*.7;return {x:Math.random()*W,y:Math.random()*H,r:5+d*10,d,v:.25+d*.55,s:Math.random()*6,w:.008+Math.random()*.012,a:Math.random()*6,rot:(Math.random()-.5)*.02,f:Math.random()*6,fs:.01+Math.random()*.02}});
(function f(){x.clearRect(0,0,W,H);const dk=root.dataset.theme==='dark';
ps.forEach(p=>{p.y+=p.v;p.s+=p.w;p.x+=Math.sin(p.s)*.5+.3*p.d+.1;p.a+=p.rot;p.f+=p.fs;if(p.y>H+20||p.x>W+20){p.y=-20;p.x=Math.random()*W*1.1-W*.1}
const al=(dk?.45:.4)+.4*p.d,g=x.createLinearGradient(0,-p.r,0,p.r);g.addColorStop(0,dk?`rgba(255,214,228,${al})`:`rgba(255,225,234,${al})`);g.addColorStop(1,dk?`rgba(238,140,172,${al})`:`rgba(240,150,176,${al})`);
x.save();x.translate(p.x,p.y);x.rotate(p.a);x.scale(.45+.55*Math.abs(Math.cos(p.f)),1);x.fillStyle=g;x.shadowColor=dk?'rgba(255,170,200,.5)':'rgba(240,140,170,.35)';x.shadowBlur=p.d>.7?8:3;
x.beginPath();x.moveTo(0,-p.r);x.bezierCurveTo(p.r*.8,-p.r*.5,p.r*.55,p.r*.75,p.r*.08,p.r);x.quadraticCurveTo(0,p.r*.82,-p.r*.08,p.r);x.bezierCurveTo(-p.r*.55,p.r*.75,-p.r*.8,-p.r*.5,0,-p.r);x.fill();x.restore()});requestAnimationFrame(f)})();
})();
// autoplay with play/pause
$$('.car').forEach(box=>{const t=$('.track',box);


setInterval(()=>{if(document.hidden)return;const k=[...t.children],step=k[1].offsetLeft-k[0].offsetLeft,i=Math.round(t.scrollLeft/step),n=(i+1>=k.length||t.scrollLeft+t.clientWidth>=t.scrollWidth-4)?0:i+1;t.scrollTo({left:n*step,behavior:'smooth'})},3500)});
