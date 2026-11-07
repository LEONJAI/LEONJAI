// Lead capture, ad/analytics tracking (after consent), first-touch attribution, click-to-chat.
(function () {
  var cfg = window.APP_CONFIG || {}, $ = function (id) { return document.getElementById(id); };
  var save = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var load = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* 1. Where did this visitor come from? Saved with every lead so you can see which ads pay off. */
  var q = new URLSearchParams(location.search), utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"].forEach(function (k) { if (q.get(k)) utm[k] = q.get(k).slice(0, 120); });
  if (Object.keys(utm).length || !load("lj_first")) save("lj_first", JSON.stringify({ utm: utm, ref: (document.referrer || "").slice(0, 200), page: location.pathname }));
  var first = {}; try { first = JSON.parse(load("lj_first") || "{}"); } catch (e) {}

  /* 2. Tracking pixels load only after the visitor accepts. */
  var tracking = false;
  function loadTracking() {
    if (tracking) return; tracking = true;
    if (cfg.GA4_ID) {
      var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(cfg.GA4_ID); document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
      gtag("js", new Date()); gtag("config", cfg.GA4_ID);
    }
    if (cfg.META_PIXEL_ID) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", cfg.META_PIXEL_ID); fbq("track", "PageView");
    }
  }
  var MAP = { lead: ["generate_lead", "Lead"], checkout: ["begin_checkout", "InitiateCheckout"], view: ["view_item", "ViewContent"], chat: ["contact", "Contact"], quote_click: ["quote_click", "Contact"] };
  function track(kind, data) {
    var m = MAP[kind]; if (!m) return; data = data || {};
    try { if (window.gtag) gtag("event", m[0], data); if (window.fbq) fbq("track", m[1], data); } catch (e) {}
  }
  if (cfg.GA4_ID || cfg.META_PIXEL_ID) {
    var c = load("lj_consent");
    if (c === "yes") loadTracking();
    else if (!c) {
      var bar = document.createElement("div"); bar.className = "consent"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Cookie notice");
      bar.innerHTML = '<p>We use cookies to measure our ads and improve the site.</p><button type="button" class="btn" id="cy">Accept</button><button type="button" class="btn alt" id="cn">Decline</button>';
      document.body.appendChild(bar);
      bar.addEventListener("click", function (e) {
        var id = e.target.id; if (id !== "cy" && id !== "cn") return;
        save("lj_consent", id === "cy" ? "yes" : "no"); bar.remove(); if (id === "cy") loadTracking();
      });
    }
  }

  /* 3. Track the clicks that make money. */
  document.addEventListener("click", function (e) {
    var t = e.target;
    var buy = t.closest(".pay, .vbuy, #vm-usd, #vm-php");
    if (buy) { var card = buy.closest(".vcard, .card"); var h = card && card.querySelector("h3, .vinfo h3"); track("checkout", { item_name: (h ? h.textContent : (document.getElementById("vm-title") || {}).textContent) || buy.dataset.plan || "item" }); return; }
    if (t.closest("[data-track=quote]")) { track("quote_click"); return; }
    if (t.closest(".chat a")) { track("chat"); return; }
    var vc = t.closest(".vcard"); if (vc && !t.closest("a")) { var vh = vc.querySelector("h3"); track("view", { item_name: vh ? vh.textContent : "vault item" }); }
  });

  /* 4. Quote form: saves the lead (with ad source) and falls back to email. */
  var form = $("quote"), status = $("qstatus"), sending = false;
  function say(msg, ok) { status.textContent = msg; status.className = "wide qs " + (ok ? "ok" : "err"); }
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault(); if (sending) return;
    var f = new FormData(form), d = {};
    ["name", "email", "need", "budget", "message"].forEach(function (k) { d[k] = (f.get(k) || "").toString().trim(); });
    if (f.get("website")) return say("Thanks! We will be in touch.", true); // spam trap
    if (!d.name || !/^\S+@\S+\.\S+$/.test(d.email) || !d.need) return say("Please add your name, a valid email and what you need.", false);
    var row = { name: d.name, email: d.email, need: d.need, budget: d.budget || null, message: d.message || null, source: (first.utm && first.utm.utm_source) || (first.ref ? "referral" : "direct"), utm: first.utm || {}, referrer: first.ref || null, landing_page: first.page || "/" };
    var btn = $("qsend"); sending = true; btn.disabled = true; btn.textContent = "Sending…";
    var done = function (ok) {
      sending = false; btn.disabled = false; btn.textContent = "Request my free quote";
      if (ok) { track("lead", { value: 1, currency: "USD", item_name: d.need }); form.reset(); say("Thank you! We got your request and will reply within two working days.", true); }
      else {
        var to = cfg.CONTACT_EMAIL || "hello@jeisaru.com";
        location.href = "mailto:" + to + "?subject=" + encodeURIComponent("Quote request: " + d.need) + "&body=" + encodeURIComponent(d.message + "\n\nName: " + d.name + "\nEmail: " + d.email + "\nBudget: " + (d.budget || "-"));
        say("We could not send it automatically, so your email app should open. You can also write to " + to + ".", false);
      }
    };
    if (!cfg.SUPABASE_URL || !window.supabase) return done(false);
    window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY).from("leads").insert(row).then(function (r) { done(!r.error); }, function () { done(false); });
  });

  /* 5. Click-to-chat button (shows only when you add a number or page in config.js). */
  if (cfg.WHATSAPP || cfg.MESSENGER) {
    var box = document.createElement("div"); box.className = "chat";
    if (cfg.WHATSAPP) box.innerHTML += '<a href="https://wa.me/' + encodeURIComponent(cfg.WHATSAPP) + '?text=' + encodeURIComponent("Hi LeonjAI, I would like a quote.") + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">WhatsApp</a>';
    if (cfg.MESSENGER) box.innerHTML += '<a class="m" href="https://m.me/' + encodeURIComponent(cfg.MESSENGER) + '" target="_blank" rel="noopener" aria-label="Chat on Messenger">Messenger</a>';
    document.body.appendChild(box);
  }
})();
