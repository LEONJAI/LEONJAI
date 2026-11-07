// 1) Shows each price in dollars and pesos.  2) Wires the "Pay in USD" and "Pay in PHP" buttons.
(function () {
  var cfg = window.APP_CONFIG || {};

  // Default prices. Override them in config.js with PRICES if you like.
  var prices = Object.assign({
    logo: { usd: 300, php: 6500 },
    poster: { usd: 120, php: 2500 },
    brand: { usd: 1200, php: 20000 },
    packaging: { usd: 350, php: 7000 },
    icons: { usd: 350, php: 6000 },
    social: { usd: 180, php: 3000 },
    deck: { usd: 500, php: 8000 },
    canva: { usd: 120, php: 3000 },
    kit: { usd: 250, php: 6000 },
    planner: { usd: 200, php: 4500 },
    menu: { usd: 80, php: 1800 },
    promo: { usd: 100, php: 2200 },
    resume: { usd: 40, php: 800 },
    bizmat: { usd: 90, php: 2000 },
    photo: { usd: 150, php: 2500 },
    web: { usd: 1500, php: 30000 },
    store: { usd: 1200, php: 25000 },
    ui: { usd: 600, php: 12000 },
    landing: { usd: 500, php: 10000 },
    shopify: { usd: 450, php: 12000 },
    booking: { usd: 700, php: 15000 },
    seo: { usd: 400, php: 10000 },
    email: { usd: 250, php: 5500 },
    smm: { usd: 500, php: 12000 },
    reels: { usd: 200, php: 4500 },
    video: { usd: 250, php: 5000 },
    translate: { usd: 150, php: 3500 },
    access: { usd: 350, php: 8000 }
  }, cfg.PRICES || {});

  var fmt = function (n) { return n.toLocaleString("en-US"); };

  document.querySelectorAll("[data-price]").forEach(function (el) {
    var p = prices[el.dataset.price];
    if (!p) return;
    el.textContent = "";
    el.append("$" + fmt(p.usd));
    var php = document.createElement("span");
    php.className = "php";
    php.textContent = "₱" + fmt(p.php);
    el.append(php);
  });

  // Payment links: PAY_LINKS[plan].usd / .php  (old STRIPE_LINKS still works for USD)
  function linkFor(plan, cur) {
    var l = (cfg.PAY_LINKS || {})[plan];
    if (l && l[cur]) return l[cur];
    if (cur === "usd" && (cfg.STRIPE_LINKS || {})[plan]) return cfg.STRIPE_LINKS[plan];
    return "";
  }

  document.querySelectorAll(".pay").forEach(function (a) {
    var plan = a.dataset.plan, cur = a.dataset.cur || "usd", p = prices[plan];
    if (p) a.textContent = cur === "php" ? "Pay ₱" + fmt(p.php) : "Pay $" + fmt(p.usd);
    var url = linkFor(plan, cur);
    if (url) { a.href = url; return; }
    if (cur === "php") { a.href = LJ_URL("app/pay-peso/?plan=" + plan); return; }
    a.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Payments are not set up yet. Add the " + cur.toUpperCase() + " payment link for \"" + plan + "\" in config.js.");
    });
  });
})();
