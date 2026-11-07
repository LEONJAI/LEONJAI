// Media vault: tabbed gallery, protected preview modal, licence buttons.
(function () {
  var cfg = window.APP_CONFIG || {}, RATE = 58;
  var rnd = function (s) { return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
  var svg = function (b) { return '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + b + '</svg>'; };

  // Night skyline: sky, stars, moon glow, two building layers with lit windows, hills.
  function city(a, b, moon, far, near, lit, seed) {
    var r = rnd(seed), o = "", x = -10, k, w, h, y, xx;
    for (k = 0; k < 16; k++) o += '<circle cx="' + (r() * 400).toFixed(0) + '" cy="' + (r() * 110).toFixed(0) + '" r="' + (.5 + r() * .8).toFixed(1) + '" fill="#fff" opacity="' + (.3 + r() * .5).toFixed(2) + '"/>';
    o += '<circle cx="272" cy="78" r="95" fill="url(#m' + seed + ')"/><circle cx="272" cy="78" r="34" fill="' + moon + '"/>';
    for (x = -10; x < 400; x += w + 3) { w = 26 + r() * 30; h = 60 + r() * 90; o += '<rect x="' + x.toFixed(0) + '" y="' + (250 - h).toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '" fill="' + far + '" opacity=".75"/>'; }
    for (x = -6; x < 400; x += w + 3) {
      w = 22 + r() * 30; h = 80 + r() * 120; y = 250 - h;
      o += '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '" fill="' + near + '"/>';
      for (var wy = y + 9; wy < 232; wy += 9) for (xx = x + 5; xx < x + w - 6; xx += 8) if (r() > .72) o += '<rect x="' + xx.toFixed(0) + '" y="' + wy.toFixed(0) + '" width="3" height="4" fill="' + lit + '" opacity="' + (.5 + r() * .5).toFixed(2) + '"/>';
    }
    return svg('<defs><linearGradient id="s' + seed + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient><radialGradient id="m' + seed + '"><stop offset="0" stop-color="' + moon + '" stop-opacity=".45"/><stop offset="1" stop-color="' + moon + '" stop-opacity="0"/></radialGradient><linearGradient id="h' + seed + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + b + '" stop-opacity="0"/><stop offset="1" stop-color="' + b + '" stop-opacity=".55"/></linearGradient></defs><rect width="400" height="250" fill="url(#s' + seed + ')"/>' + o + '<rect y="170" width="400" height="80" fill="url(#h' + seed + ')"/><path d="M0 250V232Q110 208 205 230T400 222V250Z" fill="#05070f" opacity=".9"/>');
  }
  // Logo on an artboard with crop marks.
  function mark(inner) {
    var t = '<path d="M20 36V20H36M364 20H380V36M380 214V230H364M36 230H20V214" fill="none" stroke="#14213D" stroke-opacity=".28"/>';
    return svg('<rect width="400" height="250" fill="#ECEAE4"/>' + t + inner);
  }
  var LOGO = {
    a: mark('<circle cx="200" cy="125" r="62" fill="none" stroke="#2F5D8A" stroke-width="6"/><path d="M168 160V92l32 44 32-44v68" fill="none" stroke="#2F5D8A" stroke-width="13" stroke-linejoin="round" stroke-linecap="round"/>'),
    b: mark('<circle cx="200" cy="125" r="62" fill="none" stroke="#B23A48" stroke-width="6"/><circle cx="200" cy="125" r="26" fill="#B23A48"/><circle cx="244" cy="81" r="9" fill="#B8923F"/>'),
    c: mark('<circle cx="200" cy="125" r="64" fill="none" stroke="#3E6B57" stroke-width="3"/><path d="M200 172C162 152 160 108 200 80C240 108 238 152 200 172Z" fill="#3E6B57"/><path d="M200 168V104" stroke="#ECEAE4" stroke-width="4" stroke-linecap="round"/>')
  };
  function clip(kind) {
    var base = {
      gold: '<rect width="400" height="250" fill="#1a1206"/><circle class="vb" cx="140" cy="120" r="84" fill="#d9a441" opacity=".85"/><circle class="vb vb2" cx="270" cy="140" r="72" fill="#9c5a22" opacity=".85"/>',
      grid: '<rect width="400" height="250" fill="#060b1e"/>' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<path d="M200 90L' + (i * 66) + ' 250" stroke="#38d9ff" stroke-opacity=".5" fill="none"/>'; }).join("") + [0, 1, 2, 3].map(function (i) { return '<path class="vb" d="M0 ' + (120 + i * 38) + 'H400" stroke="#ff4fd0" stroke-opacity=".55"/>'; }).join(""),
      sea: '<defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a4a"/><stop offset=".55" stop-color="#d9607a"/><stop offset=".56" stop-color="#0f6b7a"/><stop offset="1" stop-color="#06303c"/></linearGradient></defs><rect width="400" height="250" fill="url(#gs)"/><circle class="vb" cx="200" cy="138" r="34" fill="#ffd38a"/>'
    }[kind];
    return svg(base + '<rect y="238" width="400" height="12" fill="#000" opacity=".4"/><rect y="238" width="110" height="12" fill="#B8923F"/><circle cx="200" cy="120" r="24" fill="#000" opacity=".45"/><path d="M193 107l21 13-21 13z" fill="#fff"/>');
  }

  var ITEMS = [
    { id: "vault-neon", t: "photo", n: "Neon Metropolis", d: "A neon-lit city skyline at night. Suited to hero banners, posters and album art.", s: "8K · 7680 × 4320 px", p: 49, a: city("#2a1360", "#8a1f7a", "#e04fb5", "#2c1a55", "#150b2c", "#ffd27a", 11) },
    { id: "vault-forest", t: "photo", n: "Forest in Morning Fog", d: "Mist drifting through an old mountain forest. Calm, wide and easy to crop.", s: "6K RAW · 6000 × 4000 px", p: 39, a: city("#0f7f4c", "#0b4a45", "#7fe3ee", "#12543a", "#0a2a1e", "#e8ffd0", 22) },
    { id: "vault-dunes", t: "photo", n: "Golden Dunes at Dawn", d: "Wide desert panorama with low sun and long shadows. Warm, clean tones.", s: "8K · 7680 × 4320 px", p: 59, a: city("#9c5018", "#4e2c12", "#f0c462", "#6a3d1a", "#24160c", "#ffd9a0", 33) },
    { id: "vault-monogram", t: "logo", n: "Monogram Emblem", d: "A clean monogram in a ring. Fully editable, with a one-colour version.", s: "Vector · SVG, AI, PDF", p: 79, a: LOGO.a },
    { id: "vault-orbit", t: "logo", n: "Orbit Mark", d: "A bold ring and dot mark that suits software, studios and startups.", s: "Vector · SVG, AI, PDF", p: 69, a: LOGO.b },
    { id: "vault-leaf", t: "logo", n: "Leaf Crest", d: "A simple leaf crest for cafes, skincare and wellness labels.", s: "Vector · SVG, AI, PDF", p: 89, a: LOGO.c },
    { id: "vault-gold", t: "video", n: "Liquid Gold Loop", d: "A seamless liquid gold background loop for titles and promos.", s: "4K UHD · 3840 × 2160 · 0:12", p: 145, a: clip("gold"), dur: "4K · 0:12" },
    { id: "vault-grid", t: "video", n: "Data Grid Tunnel", d: "A neon grid fly-through for tech reveals and intros.", s: "4K UHD · 3840 × 2160 · 0:15", p: 185, a: clip("grid"), dur: "4K · 0:15" },
    { id: "vault-sea", t: "video", n: "Ocean Sunset", d: "A calm sea horizon at golden hour with gentle waves.", s: "4K UHD · 3840 × 2160 · 0:20", p: 165, a: clip("sea"), dur: "4K · 0:20" }
  ];
  var TABS = [["photo", "Photos"], ["logo", "Logos"], ["video", "Video"]];
  var LABEL = { photo: "Photograph", logo: "Vector", video: "Video" };
  var payHref = function (it) { var l = cfg.PAY_LINKS || {}; return (l[it.id] && l[it.id].usd) || (l.vault && l.vault.usd) || ""; };
  var noLink = function (e) { e.preventDefault(); alert("Payments are not set up yet. Add the USD payment link for this item in config.js."); };
  var peso = function (usd) { return Math.round(usd * RATE / 10) * 10; };

  var grid = document.getElementById("vgrid"), tabs = document.getElementById("vtabs"), modal = document.getElementById("vmodal");
  if (!grid) return;
  var current = null, lastFocus = null;
  var el = function (id) { return document.getElementById(id); };

  TABS.forEach(function (t, k) {
    var b = document.createElement("button");
    b.type = "button"; b.dataset.tab = t[0]; b.setAttribute("aria-pressed", k === 0);
    b.textContent = t[1];
    tabs.appendChild(b);
  });
  tabs.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    tabs.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
    render(b.dataset.tab);
  });

  function render(tab) {
    grid.innerHTML = "";
    ITEMS.forEach(function (it, i) {
      if (tab !== "all" && it.t !== tab) return;
      var c = document.createElement("article"); c.className = "vcard";
      c.innerHTML = '<button type="button" class="vart" data-i="' + i + '" aria-label="Preview ' + it.n + '"><span class="vbadge">' + LABEL[it.t] + '</span>' + (it.dur ? '<span class="vdur">' + it.dur + '</span>' : '') + it.a + '</button>' +
        '<div class="vinfo"><div class="vspec">' + it.s + '</div><h3>' + it.n + '</h3><p>' + it.d + '</p></div>' +
        '<div class="vfoot"><small>Commercial license</small><p class="vprice">$' + it.p + '<span>₱' + peso(it.p).toLocaleString("en-US") + '</span></p><div class="vbtns"><button type="button" class="btn alt" data-i="' + i + '">Preview</button><a class="btn vbuy" href="#">Buy</a></div></div>';
      var buy = c.querySelector(".vbuy"), h = payHref(it);
      if (h) buy.href = h; else buy.addEventListener("click", noLink);
      grid.appendChild(c);
    });
  }
  grid.addEventListener("click", function (e) {
    if (e.target.closest("a")) return;
    var c = e.target.closest(".vcard"); if (c) open(+c.querySelector(".vart").dataset.i);
  });

  function open(i) {
    var it = ITEMS[i]; current = it; lastFocus = document.activeElement;
    el("vm-art").innerHTML = '<span class="vbadge">' + LABEL[it.t] + "</span>" + (it.dur ? '<span class="vdur">' + it.dur + "</span>" : "") + it.a;
    el("vm-title").textContent = it.n; el("vm-desc").textContent = it.d; el("vm-spec").textContent = it.s + "  ·  Watermarked preview";
    var php = peso(it.p), usd = el("vm-usd"), pbtn = el("vm-php");
    usd.textContent = "Buy $" + it.p; pbtn.textContent = "Buy ₱" + php.toLocaleString("en-US");
    pbtn.href = LJ_URL("app/pay-peso/?plan=vault&amt=" + php + "&name=" + encodeURIComponent(it.n + " license"));
    usd.href = payHref(it) || "#"; usd.removeAttribute("target");
    modal.classList.add("on"); modal.classList.remove("shield"); document.body.style.overflow = "hidden";
    el("vm-close").focus();
  }
  function close() { modal.classList.remove("on", "shield"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  el("vm-close").addEventListener("click", close);
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  el("vm-usd").addEventListener("click", function (e) { if (this.getAttribute("href") === "#") noLink(e); });

  // Deterrents against casual copying (a browser cannot fully prevent screenshots).
  var on = function () { return modal.classList.contains("on"); };
  var hide = function (ms) { if (!on()) return; modal.classList.add("shield"); if (ms) setTimeout(function () { modal.classList.remove("shield"); }, ms); };
  document.getElementById("gallery").addEventListener("contextmenu", function (e) { e.preventDefault(); });
  document.getElementById("gallery").addEventListener("dragstart", function (e) { e.preventDefault(); });
  window.addEventListener("blur", function () { hide(); });
  window.addEventListener("focus", function () { modal.classList.remove("shield"); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) hide(); });
  document.addEventListener("keyup", function (e) {
    if (e.key === "PrintScreen") { hide(1500); try { navigator.clipboard.writeText(""); } catch (x) {} }
  });
  document.addEventListener("keydown", function (e) {
    if (!on()) return;
    if (e.key === "Escape") return close();
    if ((e.ctrlKey || e.metaKey) && /^[spu]$/i.test(e.key)) e.preventDefault();
    if (e.key === "PrintScreen" || (e.metaKey && e.shiftKey)) hide(1500);
  });

  render("photo");
})();
