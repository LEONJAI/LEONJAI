(function () {
  var cfg = window.APP_CONFIG || {};
  var pay = cfg.PESO_PAY || {};
  var names = { logo: "Logo design", poster: "Poster design", brand: "Brand identity", packaging: "Packaging", icons: "Icons and illustration", social: "Social media pack", deck: "Presentation", canva: "Canva template pack", kit: "Canva brand kit", planner: "Digital planner", menu: "Menu design", promo: "Promo graphics", resume: "Resume design", bizmat: "Business materials", photo: "Photo editing", web: "Web design", store: "Online store design", ui: "UI and app design", landing: "Landing page", shopify: "Shopify store setup", booking: "Booking website", seo: "SEO", email: "Email marketing setup", smm: "Social media management", reels: "Video editing", video: "Motion graphics", translate: "Translation and localization", access: "Accessibility fixes" };
  var prices = Object.assign({ logo: { php: 6500 }, poster: { php: 2500 }, brand: { php: 20000 }, packaging: { php: 7000 }, icons: { php: 6000 }, social: { php: 3000 }, deck: { php: 8000 }, canva: { php: 3000 }, kit: { php: 6000 }, planner: { php: 4500 }, menu: { php: 1800 }, promo: { php: 2200 }, resume: { php: 800 }, bizmat: { php: 2000 }, photo: { php: 2500 }, web: { php: 30000 }, store: { php: 25000 }, ui: { php: 12000 }, landing: { php: 10000 }, shopify: { php: 12000 }, booking: { php: 15000 }, seo: { php: 10000 }, email: { php: 5500 }, smm: { php: 12000 }, reels: { php: 4500 }, video: { php: 5000 }, translate: { php: 3500 }, access: { php: 8000 } }, cfg.PRICES || {});
  var $ = function (id) { return document.getElementById(id); };

  var plan = new URLSearchParams(location.search).get("plan");
  if (plan === "vault") {
    var q = new URLSearchParams(location.search);
    names.vault = (q.get("name") || "Gallery license").slice(0, 80);
    prices.vault = { php: Math.max(0, parseInt(q.get("amt"), 10) || 0) };
  }
  if (!names[plan]) plan = "logo";
  var amount = "₱" + prices[plan].php.toLocaleString("en-US");
  var ref = plan.slice(0, 2).toUpperCase() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  $("item").textContent = names[plan];
  $("amount").textContent = amount;
  $("ref").textContent = ref;

  function method(title, lines) {
    var d = document.createElement("div");
    d.className = "method";
    var h = document.createElement("h2");
    h.textContent = title;
    d.appendChild(h);
    lines.forEach(function (l) { var p = document.createElement("p"); p.textContent = l; d.appendChild(p); });
    $("methods").appendChild(d);
  }
  if (pay.gcashNumber) method("GCash", ["Name: " + (pay.gcashName || ""), "Number: " + pay.gcashNumber]);
  if (pay.mayaNumber) method("Maya", ["Name: " + (pay.mayaName || ""), "Number: " + pay.mayaNumber]);
  if (pay.bankAccountNumber) method(pay.bankName || "Bank transfer", ["Account name: " + (pay.bankAccountName || ""), "Account number: " + pay.bankAccountNumber]);
  if (!$("methods").children.length) method("Not set up yet", ["Add your PESO_PAY details in config.js."]);

  if (pay.qrImage) { $("qr").src = pay.qrImage; $("qr").hidden = false; }

  var to = (cfg.CONTACT_EMAIL || "hello@jeisaru.com");
  $("mail").href = "mailto:" + to + "?subject=" + encodeURIComponent("Payment receipt " + ref + " – " + names[plan]) +
    "&body=" + encodeURIComponent("Hi, I paid " + amount + " for " + names[plan] + ".\nReference: " + ref + "\n\nReceipt screenshot attached.");
})();
