/* ====== 1. SUPABASE CONFIG — paste your project values ======
   Supabase Dashboard → Project Settings → API:
   • Project URL        → SUPABASE_URL      (looks like https://abcdxyz.supabase.co)
   • anon / public key  → SUPABASE_ANON_KEY (safe in the browser; NEVER paste the service_role key)
   Until both are replaced, the site runs in demo mode and sign-in is disabled. */
   const SUPABASE_URL: 'https://jdilbwzpnfrzuliimgdc.supabase.co';
   const SUPABASE_ANON_KEY: 'sb_publishable_v1V0LgHVR_KDQZyI2_fJrg_TWZMwhjY',
const STUDIO_EMAIL = "hello@leonjai.example";
// Payment link for paid video licenses (e.g. a Stripe Payment Link). Leave empty until you have one.
const CHECKOUT_URL = "";
/* ============================================================ */

const configured = !SUPABASE_URL.includes("YOUR-PROJECT");
const db = configured ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k){ try { return localStorage.getItem(k); } catch { return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch {} }
};

/* ---------- Demo content (replaced by Supabase tables of the same name when they have rows) ---------- */
const DEMO = {
  work: [
    { title:"Nami Coffee", kind:"Brand identity", note:"Logo, packaging and menu for a Cebu roastery.", color:"#007E92" },
    { title:"Hanbit Records", kind:"Poster series", note:"Gig posters for a Seoul indie label.", color:"#6C3FD1" },
    { title:"Sora Ramen", kind:"Logo", note:"Mark and signage for a Tokyo noodle bar.", color:"#D7302B" },
    { title:"Lone Star Skate", kind:"Website", note:"Shop and lookbook for an Austin crew.", color:"#1B2B4B" },
    { title:"Pulse Studio", kind:"Social kit", note:"Templates for a fitness creator.", color:"#E58A00" }
  ],
  services: [
    { title:"Logo design", note:"Primary mark, variants and a one-page usage guide.", tag:"Design" },
    { title:"Posters and flyers", note:"Print-ready files for events, menus and launches.", tag:"Print" },
    { title:"Brand identity", note:"Logo, colors, type and templates in one kit.", tag:"Brand" },
    { title:"Websites", note:"Fast, mobile-first sites you can edit yourself.", tag:"Web" },
    { title:"Social media kits", note:"Templates for posts, stories and covers.", tag:"Digital" }
  ],
  gallery: [
    ...["Harbor at dawn","Rice terraces","Neon alley","Street market","Cafe window","Night train"].map((t,i)=>({type:"photo",title:t,color:["#0E6E7E","#3C6E47","#6C3FD1","#B5532A","#2B4C7E","#8A2C5A"][i]})),
    ...["Wave mark","Torii monogram","Hangul seal","Star badge","Kite emblem","Lotus line"].map((t,i)=>({type:"logo",title:t,color:["#121A2B","#D7302B","#1D5C63","#6C3FD1","#C27C0E","#2E3A59"][i]})),
    ...["City timelapse 4K","Ink in water 4K","Rain on glass 4K","Crowd crossing 4K"].map((t,i)=>({type:"video",title:t,color:["#17324D","#3A2A57","#1F4D4A","#4D2A2A"][i],price_usd:12,price_php:350}))
  ],
  prices: [
    { grp:"design", title:"Logo", note:"2 concepts, 2 revisions, full file pack.", usd:120, php:3500 },
    { grp:"design", title:"Poster or flyer", note:"One layout, print and web files.", usd:60, php:1800 },
    { grp:"design", title:"Brand identity", note:"Logo, palette, type, 5 templates.", usd:450, php:13500 },
    { grp:"design", title:"Social media kit", note:"10 editable templates.", usd:90, php:2800 },
    { grp:"web", title:"One-page website", note:"Responsive, with contact form.", usd:300, php:9000 },
    { grp:"web", title:"Multi-page website", note:"Up to 5 pages, with CMS.", usd:700, php:21000 },
    { grp:"web", title:"Monthly downloads", note:"Licensed photos, logos and clips.", usd:19, php:550, per:"/mo" }
  ]
};
const DB = { ...DEMO };
async function load(table, order) {
  if (!db) return;
  let q = db.from(table).select("*"); if (order) q = q.order(order);
  const { data, error } = await q;
  if (!error && data?.length) DB[table] = data;
}

/* ---------- i18n ---------- */
const T = {
  en:{nav_work:"Work",nav_services:"Services",nav_gallery:"Gallery",nav_pricing:"Pricing",nav_contact:"Contact",get_quote:"Get a quote",
    hero_title:"Graphic design that gets noticed.",hero_sub:"We design logos, posters and brand identities for small businesses and creative teams.",cta_quote:"Get a free quote",cta_work:"See our work",hint:"Move your cursor over this tile",
    work_title:"Selected work",serv_title:"Services",serv_sub:"Design products and website services for small businesses and creators, wherever they are. Need one thing or a whole brand? Pick what fits and we will help with the rest.",
    gal_title:"Gallery",gal_sub:"Protected previews. License a photo, logo or 4K clip, or",gal_link:"subscribe for monthly downloads",tab_photo:"Photos",tab_logo:"Logos",tab_video:"Video",
    price_title:"Pricing",price_sub:"Starting prices. Dollar rates are for clients abroad. Peso rates are set for the local market, so they run lower than a straight conversion. Choose a currency, or ask for a custom quote.",price_g1:"Graphic design and digital products",price_g2:"Website and digital services",price_more:"Need something not listed?",price_ask:"Ask for a quote",
    q_title:"Get a free quote",q_sub:"Tell us what you need and when. We reply within two working days.",q_name:"Your name",q_email:"Email",q_need:"What do you need?",q_choose:"Choose one",q_budget:"Budget",q_details:"Project details",q_send:"Request my free quote",q_copy:"Or copy our email",
    clients:"Trusted by",hero_eyebrow:"Welcome to LeonjAI",from:"from",sending:"Sending…",ok:"Request sent. We reply within two working days.",bad:"Enter your name, a valid email and what you need.",fail:"Couldn't send. Try again, or email us directly.",demo:"Demo mode: add your Supabase keys in app.js to receive requests.",copied:"Email copied."},
  ja:{nav_work:"実績",nav_services:"サービス",nav_gallery:"ギャラリー",nav_pricing:"料金",nav_contact:"お問い合わせ",get_quote:"見積もり",
    hero_title:"目立つ、グラフィックデザイン。",hero_sub:"小さな会社やクリエイターのために、ロゴ、ポスター、ブランドを設計します。",cta_quote:"無料で見積もる",cta_work:"実績を見る",hint:"このタイルの上でカーソルを動かしてください",
    work_title:"制作実績",serv_title:"サービス",serv_sub:"小規模事業者やクリエイター向けのデザインとウェブサービス。ひとつだけでも、ブランド全体でもご相談ください。",
    gal_title:"ギャラリー",gal_sub:"保護されたプレビュー。写真・ロゴ・4K映像のライセンス、または",gal_link:"月額ダウンロードを購読",tab_photo:"写真",tab_logo:"ロゴ",tab_video:"動画",
    price_title:"料金",price_sub:"開始価格です。ドルは海外のお客様向け、ペソは国内向けの価格です。通貨を選ぶか、個別にお見積もりします。",price_g1:"グラフィックデザインとデジタル商品",price_g2:"ウェブとデジタルサービス",price_more:"掲載のない内容は",price_ask:"見積もりを依頼",
    q_title:"無料見積もり",q_sub:"ご希望の内容と時期をお知らせください。2営業日以内に返信します。",q_name:"お名前",q_email:"メール",q_need:"ご依頼内容",q_choose:"選択してください",q_budget:"予算",q_details:"プロジェクトの詳細",q_send:"無料見積もりを依頼",q_copy:"メールアドレスをコピー",
    clients:"お取引先",hero_eyebrow:"LeonjAIへようこそ",from:"から",sending:"送信中…",ok:"送信しました。2営業日以内に返信します。",bad:"お名前、有効なメール、ご依頼内容を入力してください。",fail:"送信できませんでした。再度お試しいただくか、メールでご連絡ください。",demo:"デモモード：app.js に Supabase のキーを設定してください。",copied:"コピーしました。"},
  ko:{nav_work:"작업",nav_services:"서비스",nav_gallery:"갤러리",nav_pricing:"가격",nav_contact:"문의",get_quote:"견적 받기",
    hero_title:"눈에 띄는 그래픽 디자인.",hero_sub:"소규모 사업자와 크리에이티브 팀을 위해 로고, 포스터, 브랜드 아이덴티티를 디자인합니다.",cta_quote:"무료 견적 받기",cta_work:"작업 보기",hint:"이 타일 위에서 커서를 움직여 보세요",
    work_title:"선별 작업",serv_title:"서비스",serv_sub:"소규모 사업자와 크리에이터를 위한 디자인 및 웹 서비스. 하나만 필요하든 브랜드 전체가 필요하든 편하게 선택하세요.",
    gal_title:"갤러리",gal_sub:"보호된 미리보기. 사진, 로고, 4K 영상을 라이선스하거나",gal_link:"월간 다운로드를 구독하세요",tab_photo:"사진",tab_logo:"로고",tab_video:"영상",
    price_title:"가격",price_sub:"시작 가격입니다. 달러는 해외 고객용, 페소는 현지 시장용입니다. 통화를 선택하거나 맞춤 견적을 요청하세요.",price_g1:"그래픽 디자인 및 디지털 상품",price_g2:"웹사이트 및 디지털 서비스",price_more:"목록에 없는 작업은",price_ask:"견적 요청",
    q_title:"무료 견적",q_sub:"필요한 작업과 일정을 알려주세요. 영업일 기준 2일 안에 답장드립니다.",q_name:"이름",q_email:"이메일",q_need:"필요한 작업",q_choose:"선택하세요",q_budget:"예산",q_details:"프로젝트 상세",q_send:"무료 견적 요청",q_copy:"이메일 주소 복사",
    clients:"함께한 고객",hero_eyebrow:"LeonjAI에 오신 것을 환영합니다",from:"부터",sending:"전송 중…",ok:"요청이 전송되었습니다. 영업일 기준 2일 안에 답장드립니다.",bad:"이름, 올바른 이메일, 필요한 작업을 입력하세요.",fail:"전송하지 못했습니다. 다시 시도하거나 이메일로 문의하세요.",demo:"데모 모드: app.js에 Supabase 키를 입력하세요.",copied:"복사되었습니다."}
};
Object.assign(T.en, {
  sign_in:"Sign in", sign_up:"Create account", sign_out:"Sign out", password:"Password", to_signup:"No account? Create one", to_signin:"Have an account? Sign in",
  download:"Download", buy_download:"Buy & download", need_signin:"Sign in to download this file.",
  video_paid:"Videos are paid licenses. Sign in, then buy to download.", video_buy_note:"Buy this clip to unlock the 4K download.",
  paid_refresh:"I've paid – refresh", checkout_missing:"Payments aren't set up yet. Add a checkout link in app.js.",
  after_pay:"Complete the payment in the new tab, then press “I've paid – refresh”.", dl_fail:"Download failed. Try again.", no_file:"No file is attached to this item yet.",
  auth_demo:"Demo mode: add your Supabase keys in app.js to enable sign-in.", confirm_email:"Check your email to confirm your account, then sign in.",
  open:"Open preview", still_locked:"Payment not found yet. It can take a minute.", unlocked:"Purchase confirmed. You can download now." });
Object.assign(T.ja, {
  sign_in:"ログイン", sign_up:"アカウント作成", sign_out:"ログアウト", password:"パスワード", to_signup:"アカウントをお持ちでない方はこちら", to_signin:"アカウントをお持ちの方はこちら",
  download:"ダウンロード", buy_download:"購入してダウンロード", need_signin:"ダウンロードするにはログインしてください。",
  video_paid:"動画は有料ライセンスです。ログイン後に購入するとダウンロードできます。", video_buy_note:"このクリップを購入すると4Kをダウンロードできます。",
  paid_refresh:"支払い済み・更新", checkout_missing:"決済は未設定です。app.js に決済リンクを追加してください。",
  after_pay:"新しいタブで支払いを完了し、「支払い済み・更新」を押してください。", dl_fail:"ダウンロードに失敗しました。もう一度お試しください。", no_file:"この項目にはまだファイルがありません。",
  auth_demo:"デモモード：app.js に Supabase のキーを設定するとログインできます。", confirm_email:"確認メールでアカウントを有効化してから、ログインしてください。",
  open:"プレビューを開く", still_locked:"支払いがまだ確認できません。少し待ってからお試しください。", unlocked:"購入を確認しました。ダウンロードできます。" });
Object.assign(T.ko, {
  sign_in:"로그인", sign_up:"계정 만들기", sign_out:"로그아웃", password:"비밀번호", to_signup:"계정이 없으신가요? 만들기", to_signin:"계정이 있으신가요? 로그인",
  download:"다운로드", buy_download:"구매 후 다운로드", need_signin:"다운로드하려면 로그인하세요.",
  video_paid:"영상은 유료 라이선스입니다. 로그인 후 구매하면 다운로드할 수 있습니다.", video_buy_note:"이 클립을 구매하면 4K 다운로드가 열립니다.",
  paid_refresh:"결제 완료 · 새로고침", checkout_missing:"결제가 아직 설정되지 않았습니다. app.js에 결제 링크를 추가하세요.",
  after_pay:"새 탭에서 결제를 완료한 뒤 “결제 완료 · 새로고침”을 누르세요.", dl_fail:"다운로드하지 못했습니다. 다시 시도하세요.", no_file:"이 항목에는 아직 파일이 없습니다.",
  auth_demo:"데모 모드: app.js에 Supabase 키를 입력하면 로그인할 수 있습니다.", confirm_email:"이메일을 확인해 계정을 인증한 뒤 로그인하세요.",
  open:"미리보기 열기", still_locked:"결제를 아직 확인하지 못했습니다. 잠시 후 다시 시도하세요.", unlocked:"구매가 확인되었습니다. 다운로드할 수 있습니다." });

let lang = store.get("lang") || (navigator.language || "en").slice(0,2);
if (!T[lang]) lang = "en";
let cur = store.get("cur") === "PHP" ? "PHP" : "USD";
let tab = "photo";
const tr = k => T[lang][k] ?? T.en[k];

function applyLang(l) {
  lang = l; store.set("lang", l);
  document.documentElement.lang = l;
  $$("[data-i18n]").forEach(el => { el.textContent = T[l][el.dataset.i18n]; });
  $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === l));
  renderPrices(); refreshAuthUI(); if (lb.open) renderLightbox();
}
$$("[data-lang]").forEach(b => b.addEventListener("click", () => applyLang(b.dataset.lang)));

/* ---------- Sakura petals (background canvas) ---------- */
(function () {
  const cv = $("#sakura"), g = cv.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, petals = [], last = 0;
  const rand = (a, b) => a + Math.random() * (b - a);
  function make(initial) {
    const s = rand(7, 15);
    return { x: rand(0, W), y: initial ? rand(0, H) : rand(-40, -10), s,
      vy: rand(22, 48) * (s / 11), sway: rand(14, 40), ph: rand(0, 6.28), freq: rand(.5, 1.2),
      rot: rand(0, 6.28), vr: rand(-1, 1), flip: rand(0, 6.28), vf: rand(1, 2.4), a: rand(.55, .95) };
  }
  function resize() {
    const dpr = devicePixelRatio || 1;
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(34, Math.max(12, W / 40)));
    while (petals.length < n) petals.push(make(true));
    petals.length = n;
  }
  function draw(p) {
    g.save();
    g.translate(p.x, p.y); g.rotate(p.rot);
    g.scale(1, .35 + .65 * Math.abs(Math.cos(p.flip)));      // flutter: petal turns edge-on
    g.globalAlpha = p.a;
    const grad = g.createLinearGradient(-p.s, 0, p.s, 0);
    grad.addColorStop(0, "#F7B6CB"); grad.addColorStop(1, "#D9779B");
    g.fillStyle = grad;
    g.beginPath(); g.ellipse(0, 0, p.s, p.s * .42, 0, 0, 6.2832); g.fill();
    g.restore();
  }
  function frame(t) {
    const dt = Math.min(.05, (t - last) / 1000 || 0); last = t;
    g.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.y += p.vy * dt; p.ph += p.freq * dt; p.x += Math.sin(p.ph) * p.sway * dt + 8 * dt;
      p.rot += p.vr * dt; p.flip += p.vf * dt;
      if (p.y > H + 20 || p.x > W + 30) Object.assign(p, make(false));
      draw(p);
    }
    requestAnimationFrame(frame);
  }
  resize(); addEventListener("resize", resize);
  if (still) { g.clearRect(0, 0, W, H); petals.forEach(draw); } else requestAnimationFrame(frame);
})();

/* ---------- Hero spotlight ---------- */
const hero = $("#hero");
hero.addEventListener("pointermove", e => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
  hero.style.setProperty("--my", (e.clientY - r.top) + "px");
});

/* ---------- Bento renderers ---------- */
const PALETTE = ["navy","cream","orange","red","white","dark"];
const CLIENTS = ["Nami Coffee","Hanbit Records","Sora Ramen","Lone Star Skate","Pulse Studio","Aoi Books"];
const initials = s => s.split(/\s+/).map(w => w[0]).join("").slice(0,2).toUpperCase();
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function spans(n) {            // how many of 12 columns each tile takes
  if (n <= 4) return Array(n).fill(12 / n);
  const full = Math.floor(n / 3) * 3, rem = n - full, out = Array(full).fill(4);
  return out.concat(rem === 1 ? [12] : rem === 2 ? [6, 6] : []);
}
const mspans = n => Array.from({ length: n }, (_, i) => (n % 2 && i === n - 1 ? 12 : 6));   // phone layout: two tiles per row
function placeTile(t, span, rows, m) { t.style.setProperty("--span", span); if (rows) t.style.setProperty("--rows", rows); if (m) t.style.setProperty("--mspan", m); return t; }
function goLink(service) {
  const a = el("a", "go"); a.href = "#quote"; a.dataset.service = service;
  a.setAttribute("aria-label", "Request " + service); a.append(el("span", null, "↗")); return a;
}

const WORK_SHAPE = [[5,2],[4,1],[3,1],[4,1],[3,1]];
function renderWork() {
  const g = $("#work-grid"); g.textContent = "";
  DB.work.forEach((w, i) => {
    const [s, r] = WORK_SHAPE[i] || [4, 1];
    const t = placeTile(el("article", "tile work " + PALETTE[i % 5]), s, r, 6);
    t.append(el("span", "pill", w.kind || ""), el("h3", null, w.title), el("p", null, w.note || ""), el("span", "ghost", initials(w.title)));
    g.append(t);
  });
}
function renderServices() {
  const g = $("#serv-grid"); g.textContent = "";
  const sp = spans(DB.services.length), ms = mspans(DB.services.length);
  DB.services.forEach((s, i) => {
    const t = placeTile(el("article", "tile svc " + PALETTE[(i + 1) % 6]), sp[i], 0, ms[i]);
    t.append(el("span", "pill", s.tag || ""), el("h3", null, s.title), el("p", null, s.note || ""), goLink(s.title));
    g.append(t);
  });
}
const GAL_COLORS = ["#114B77","#C23B34","#F29A2E","#2B4C7E","#6C3FD1","#1D5C63"];
const currentItems = () => DB.gallery.filter(i => i.type === tab);
function renderGallery() {
  const g = $("#gal-grid"); g.textContent = "";
  currentItems().forEach((i, n) => {
    i._c = i.color || GAL_COLORS[n % GAL_COLORS.length];
    const th = el("button", "thumb", initials(i.title)); th.type = "button";
    th.style.background = `linear-gradient(135deg, ${i._c}, color-mix(in srgb, ${i._c} 55%, #000))`;
    if (i.preview_url && i.type !== "video") { th.textContent = ""; th.style.background = `center / cover url("${encodeURI(i.preview_url)}")`; }
    if (i.type === "video") th.append(el("span", "play", "▶ 4K"));
    th.setAttribute("aria-label", `${i.title} – ${tr("open")}`); th.title = i.title;
    th.addEventListener("click", () => openLightbox(n));
    th.addEventListener("contextmenu", e => e.preventDefault());
    g.append(th);
  });
}
function renderPrices() {
  const sym = cur === "USD" ? "$" : "₱";
  ["design", "web"].forEach((grp, gi) => {
    const g = $("#price-" + grp); g.textContent = "";
    const items = DB.prices.filter(p => p.grp === grp), sp = spans(items.length), ms = mspans(items.length);
    items.forEach((p, i) => {
      const t = placeTile(el("article", "tile prc " + PALETTE[(i + gi * 2) % 5]), sp[i], 0, ms[i]);
      const price = el("div", "price"), amt = cur === "USD" ? p.usd : p.php;
      price.append(el("small", null, T[lang].from + " "), document.createTextNode(sym + Number(amt).toLocaleString("en-US")), el("small", null, p.per || ""));
      t.append(el("h3", null, p.title), el("p", null, p.note || ""), price, goLink(p.title));
      g.append(t);
    });
  });
  $$("[data-cur]").forEach(b => b.setAttribute("aria-pressed", b.dataset.cur === cur));
}
function renderClients() {
  const g = $("#client-grid");
  CLIENTS.forEach(n => g.append(el("div", "tile white", n)));
}
function fillServiceSelect() {
  const sel = $("#service");
  [...DB.services.map(s => s.title), "Something else"].forEach(n => { const o = el("option", null, n); o.value = n; sel.append(o); });
}

/* ---------- Interactions ---------- */
$$("[data-tab]").forEach(b => b.addEventListener("click", () => {
  tab = b.dataset.tab; $$("[data-tab]").forEach(x => x.setAttribute("aria-selected", x === b)); renderGallery();
}));
$$("[data-cur]").forEach(b => b.addEventListener("click", () => { cur = b.dataset.cur; store.set("cur", cur); renderPrices(); }));
document.addEventListener("click", e => {          // ↗ buttons preselect the service in the quote form
  const a = e.target.closest("[data-service]"); if (!a) return;
  const words = a.dataset.service.toLowerCase().split(/[\s-]+/).filter(w => w.length > 3);
  const opt = [...$("#service").options].find(o => words.some(w => o.value.toLowerCase().startsWith(w)));
  if (opt) $("#service").value = opt.value;
});

/* ---------- Auth (Supabase Auth) ---------- */
const authDlg = $("#auth"), lb = $("#lightbox"), lbMsg = $("#lb-msg");
let user = null, owned = new Set(), authMode = "in";
async function loadOwned() {
  owned = new Set();
  if (!db || !user) return;
  const { data } = await db.from("purchases").select("gallery_id");
  (data || []).forEach(r => owned.add(r.gallery_id));
}
if (db) db.auth.onAuthStateChange((_ev, session) => {
  user = session?.user || null;
  setTimeout(async () => { await loadOwned(); refreshAuthUI(); if (lb.open) renderLightbox(); }, 0);   // avoid calling Supabase inside its own callback
});
function refreshAuthUI() {
  const b = $("#auth-btn");
  if (user) { b.textContent = `${(user.email || "").split("@")[0].slice(0, 14)} · ${tr("sign_out")}`; b.setAttribute("aria-label", `${tr("sign_out")} (${user.email})`); }
  else { b.textContent = tr("sign_in"); b.removeAttribute("aria-label"); }
  $("#auth-title").textContent = tr(authMode === "in" ? "sign_in" : "sign_up");
  $("#auth-submit").textContent = tr(authMode === "in" ? "sign_in" : "sign_up");
  $("#auth-switch").textContent = tr(authMode === "in" ? "to_signup" : "to_signin");
  $("#signup-fields").hidden = authMode !== "up";
  $("#a-dob").required = authMode === "up";
  $("#a-address").required = authMode === "up";
  $("#a-pass").autocomplete = authMode === "in" ? "current-password" : "new-password";
}
function openAuth(mode) { authMode = mode || "in"; $("#auth-msg").textContent = ""; refreshAuthUI(); authDlg.showModal(); $("#a-email").focus(); }
$("#auth-btn").addEventListener("click", async () => { if (user) await db.auth.signOut(); else openAuth("in"); });
$("#auth-switch").addEventListener("click", () => { authMode = authMode === "in" ? "up" : "in"; $("#auth-msg").textContent = ""; refreshAuthUI(); });
$("#password-toggle").addEventListener("click", () => {
  const input = $("#a-pass"), visible = input.type === "password";
  input.type = visible ? "text" : "password";
  $("#password-toggle").setAttribute("aria-label", visible ? "Hide password" : "Show password");
  $("#password-toggle").setAttribute("aria-pressed", String(visible));
  $("#password-toggle").textContent = visible ? "⊗" : "◉";
});
$("#forgot-password").addEventListener("click", async () => {
  const m = $("#auth-msg"), email = $("#a-email").value.trim();
  if (!email) { $("#a-email").focus(); m.textContent = "Enter your email address first."; m.className = "err"; return; }
  if (!db) { m.textContent = tr("auth_demo"); m.className = "err"; return; }
  m.textContent = tr("sending"); m.className = "";
  const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  m.textContent = error ? error.message : "If an account exists for that email, a password reset link has been sent.";
  m.className = error ? "err" : "ok";
});
$("#auth-close").addEventListener("click", () => authDlg.close());
authDlg.addEventListener("click", e => { if (e.target === authDlg) authDlg.close(); });
$("#auth-form").addEventListener("submit", async e => {
  e.preventDefault();
  const m = $("#auth-msg"), say2 = (x, c) => { m.textContent = x; m.className = c || ""; };
  if (!db) return say2(tr("auth_demo"), "err");
  say2(tr("sending"));
  const email = $("#a-email").value.trim(), password = $("#a-pass").value;
  const res = authMode === "in"
    ? await db.auth.signInWithPassword({ email, password })
    : await db.auth.signUp({ email, password, options: { data: { date_of_birth: $("#a-dob").value, address: $("#a-address").value.trim() } } });
  if (res.error) return say2(res.error.message, "err");
  if (authMode === "up" && !res.data.session) return say2(tr("confirm_email"), "ok");
  $("#auth-form").reset(); say2(""); authDlg.close();
});

/* ---------- Gallery lightbox: zoom, download (sign-in), paid videos ---------- */
let lbItems = [], lbIdx = 0, zoom = 1;
const setMsg = (x, c) => { lbMsg.textContent = x; lbMsg.className = c || ""; };
function openLightbox(i) { lbItems = currentItems(); lbIdx = i; zoom = 1; renderLightbox(); lb.showModal(); }
function setZoom(z) {
  zoom = Math.min(4, Math.max(1, z));
  const m = $(".lb-media"); if (m) m.style.width = (zoom * 100) + "%";
  $("#lb-zoom").textContent = Math.round(zoom * 100) + "%";
}
function renderLightbox() {
  const it = lbItems[lbIdx]; if (!it) return;
  const paid = it.type === "video", has = paid && !!user && owned.has(it.id);
  $("#lb-title").textContent = it.title;
  const stage = $("#lb-stage"); stage.textContent = "";
  const box = el("div", "lb-media wm");
  if (paid && it.preview_url) {
    const v = el("video"); v.src = it.preview_url; v.controls = true; v.muted = true; v.playsInline = true;
    v.setAttribute("controlslist", "nodownload noremoteplayback"); v.disablePictureInPicture = true;
    v.addEventListener("contextmenu", e => e.preventDefault()); box.append(v);
  } else if (it.preview_url) {
    const im = el("img"); im.src = it.preview_url; im.alt = it.title; im.draggable = false;
    im.addEventListener("contextmenu", e => e.preventDefault()); box.append(im); box.classList.add("zoomable");
  } else {
    box.classList.add("thumb", "zoomable"); box.textContent = initials(it.title);
    box.style.background = `linear-gradient(135deg, ${it._c}, color-mix(in srgb, ${it._c} 55%, #000))`;
    if (paid) box.append(el("span", "play", "▶ 4K"));
  }
  box.addEventListener("click", () => { if (box.classList.contains("zoomable")) setZoom(zoom > 1 ? 1 : 2); });
  stage.append(box); setZoom(zoom);

  const price = Number(cur === "USD" ? it.price_usd : it.price_php);
  $("#lb-price").textContent = paid && !has && price ? (cur === "USD" ? "$" : "₱") + price.toLocaleString("en-US") : "";
  $("#lb-dl").textContent = !paid || has ? "⬇ " + tr("download") : tr("buy_download");
  $("#lb-refresh").hidden = !(paid && user && !has);
  setMsg(!user ? tr(paid ? "video_paid" : "need_signin") : paid && !has ? tr("video_buy_note") : "");
}
function triggerDownload(url, name) {
  const a = document.createElement("a"); a.href = url; if (name) a.download = name;
  document.body.append(a); a.click(); a.remove();
}
function placeholderSvg(it) {
  const esc = s => s.replace(/[&<>]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
  return new Blob([`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${it._c}"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><text x="600" y="500" font-family="Georgia,serif" font-size="220" fill="#fff" text-anchor="middle">${esc(initials(it.title))}</text><text x="600" y="800" font-family="sans-serif" font-size="48" fill="#fff" fill-opacity=".8" text-anchor="middle">${esc(it.title)}</text></svg>`], { type: "image/svg+xml" });
}
async function handleDownload() {
  const it = lbItems[lbIdx], paid = it.type === "video";
  if (!user) return openAuth("in");                         // sign-in required for everything
  if (paid && !owned.has(it.id)) return buy(it);            // videos also need a purchase
  try {
    if (it.file_path) {
      const { data, error } = await db.storage.from(paid ? "videos" : "downloads").createSignedUrl(it.file_path, 60, { download: true });
      if (error) throw error; triggerDownload(data.signedUrl);
    } else if (!paid) {
      const url = URL.createObjectURL(placeholderSvg(it)); triggerDownload(url, it.title + ".svg"); setTimeout(() => URL.revokeObjectURL(url), 4000);
    } else return setMsg(tr("no_file"), "err");
  } catch { setMsg(tr("dl_fail"), "err"); }
}
function buy(it) {
  if (!CHECKOUT_URL) return setMsg(tr("checkout_missing"), "err");
  const u = new URL(CHECKOUT_URL);
  u.searchParams.set("client_reference_id", `${user.id}__${it.id}`); u.searchParams.set("prefilled_email", user.email);
  window.open(u.toString(), "_blank", "noopener"); setMsg(tr("after_pay"), "ok");
}
$("#lb-dl").addEventListener("click", handleDownload);
$("#lb-refresh").addEventListener("click", async () => {
  await loadOwned(); renderLightbox();
  const it = lbItems[lbIdx]; owned.has(it.id) ? setMsg(tr("unlocked"), "ok") : setMsg(tr("still_locked"), "err");
});
const step = d => { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; zoom = 1; renderLightbox(); };
$("#lb-prev").addEventListener("click", () => step(-1));
$("#lb-next").addEventListener("click", () => step(1));
$("#lb-in").addEventListener("click", () => setZoom(zoom + .5));
$("#lb-out").addEventListener("click", () => setZoom(zoom - .5));
$("#lb-close").addEventListener("click", () => lb.close());
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
lb.addEventListener("close", () => { $("#lb-stage").textContent = ""; });
lb.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1);
  else if (e.key === "+" || e.key === "=") setZoom(zoom + .5); else if (e.key === "-") setZoom(zoom - .5);
});

/* ---------- Quote form (Supabase table: quotes) ---------- */
const form = $("#quote-form"), status = $("#status");
const say = (m, c) => { status.textContent = m; status.className = c || ""; };
form.addEventListener("submit", async e => {
  e.preventDefault();
  const v = Object.fromEntries(new FormData(form));
  if (!v.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()) || !v.service) return say(T[lang].bad, "err");
  if (!db) return say(T[lang].demo, "err");
  say(T[lang].sending);
  const { error } = await db.from("quotes").insert({ name:v.name.trim(), email:v.email.trim().toLowerCase(), service:v.service, budget:v.budget, details:v.details.trim(), lang });
  if (error) return say(T[lang].fail, "err");
  form.reset(); say(T[lang].ok, "ok");
});
$("#copy-mail").addEventListener("click", async () => {
  const out = $("#copy-status");
  let msg = T[lang].copied;
  try { await navigator.clipboard.writeText(STUDIO_EMAIL); } catch { msg = STUDIO_EMAIL; }
  out.textContent = msg;
  clearTimeout(out._t); out._t = setTimeout(() => { out.textContent = ""; }, 3500);
});

/* ---------- Init ---------- */
(async () => {
  await Promise.all([load("work","id"), load("services","id"), load("gallery","id"), load("prices","id")]);
  renderWork(); renderServices(); renderGallery(); renderClients(); fillServiceSelect(); applyLang(lang);
})();

/* ---------- Clean URLs: no "index.html" in the address bar when using the nav ---------- */
(function () {
  const clean = hash => {
    try { history.replaceState(null, "", location.pathname.replace(/\/index\.html$/, "/") + location.search + (hash || "")); } catch {}
  };
  clean(location.hash);
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute("href"), target = id.length > 1 && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    clean(id);
  });
})();


/* ---------- Mobile burger menu: nav links + Sign in live inside the dropdown ---------- */
(function () {
  const bar = $(".bar"), burger = $("#burger"), nav = $("#main-nav"), authBtn = $("#auth-btn"), tools = $(".tools"), quote = $(".tools .btn.small");
  const mq = matchMedia("(max-width: 860px)");
  const setOpen = o => { bar.classList.toggle("menu-open", o); burger.setAttribute("aria-expanded", String(o)); };
  function place() {                       // Sign in sits in the menu on phones, in the header on desktop
    if (mq.matches) nav.append(authBtn); else tools.insertBefore(authBtn, quote);
    if (!mq.matches) setOpen(false);
  }
  burger.addEventListener("click", e => { e.stopPropagation(); setOpen(!bar.classList.contains("menu-open")); });
  nav.addEventListener("click", e => { if (e.target.closest("a") || e.target.closest("#auth-btn")) setOpen(false); });
  document.addEventListener("click", e => { if (!bar.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  mq.addEventListener("change", place); place();
})();
