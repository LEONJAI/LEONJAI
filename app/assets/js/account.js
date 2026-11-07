(function () {
  var c = window.APP_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  function say(id, t, err) { var m = $(id); m.textContent = t; m.className = "msg" + (err ? " err" : "") + (id === "photoMsg" ? " center" : ""); }
  function ageOf(iso) {
    var b = new Date(iso), n = new Date(), a = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
    return a;
  }

  /* Menu: open one drawer at a time */
  function drawer(btnId, panelId) {
    $(btnId).onclick = function () {
      var open = $(panelId).hidden;
      ["profilePanel", "settingsPanel", "workstationPanel"].forEach(function (p) { $(p).hidden = true; });
      ["openProfile", "openSettings", "openWorkstation"].forEach(function (b) { if (b) b.setAttribute("aria-expanded", "false"); });
      $(panelId).hidden = !open;
      this.setAttribute("aria-expanded", String(open));
    };
  }
  drawer("openProfile", "profilePanel");
  drawer("openSettings", "settingsPanel");
  drawer("openWorkstation", "workstationPanel");

  /* Dark mode */
  function isDark() {
    var t = document.documentElement.getAttribute("data-theme");
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function syncSwitch() { $("darkSwitch").setAttribute("aria-checked", String(isDark())); }
  $("darkSwitch").onclick = function () {
    var next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncSwitch();
  };
  syncSwitch();

  if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) { $("name").textContent = "Add your Supabase keys in config.js"; return; }
  var db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  var user = null;
  $("birthday").max = new Date().toISOString().slice(0, 10);

  db.auth.getSession().then(function (r) {
    if (!r.data.session) { location.replace(LJ_URL("../login/")); return; }
    user = r.data.session.user;
    $("vEmail").textContent = user.email;
    loadProfile();
  });

  function paint() {
    var full = ($("firstName").value + " " + $("lastName").value).trim();
    var u = $("username").value.trim();
    var shown = full || u || user.email.split("@")[0];
    $("name").textContent = shown;
    $("handle").textContent = u ? "@" + u : "";
    if (!$("avatar").style.backgroundImage) $("avatar").textContent = shown.charAt(0).toUpperCase();
    var nv = function (v) { return v || "Not added"; };
    $("vName").textContent = nv(full);
    $("vUser").textContent = u ? "@" + u : "Not added";
    $("vBirth").textContent = $("birthday").value ? new Date($("birthday").value + "T00:00:00").toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "Not added";
    $("vAge").textContent = $("birthday").value ? ageOf($("birthday").value) : "Not added";
    $("vAddress").textContent = nv($("address").value.trim());
    $("vPhone").textContent = nv($("phone").value.trim());
    $("vBio").textContent = nv($("bio").value.trim());
  }

  function editing(on) { $("profileView").hidden = on; $("profileForm").hidden = !on; }
  $("editBtn").onclick = function () { editing(true); };
  $("cancelEdit").onclick = function () { loadProfile(); editing(false); say("profileMsg", ""); };

  function setPhoto(url) {
    if (!url) return;
    $("avatar").style.backgroundImage = 'url("' + url + '")';
    $("avatar").textContent = "";
  }

  function loadProfile() {
    db.from("profiles").select("username, first_name, last_name, birthday, address, phone, bio, avatar_url, subscription_active").eq("id", user.id).maybeSingle().then(function (r) {
      var p = r.data || {};
      $("firstName").value = p.first_name || "";
      $("lastName").value = p.last_name || "";
      $("username").value = p.username || "";
      $("birthday").value = p.birthday || "";
      $("address").value = p.address || "";
      $("phone").value = p.phone || "";
      $("bio").value = p.bio || "";
      setPhoto(p.avatar_url);
      paint();
      if (p.subscription_active === true) {
        $("openWorkstation").hidden = false;
        loadMedia();
      }
      if (r.error) say("photoMsg", "Could not load your profile. Run migration.sql, migration2.sql and migration3.sql in Supabase.", true);
    });
  }

  var mediaTypes = { photo: { label: "Photo", accept: /^image\//, max: 10 * 1024 * 1024 }, video: { label: "Video", accept: /^video\//, max: 100 * 1024 * 1024 }, logo: { label: "Logo", accept: /^(image\/(png|jpeg|webp|svg\+xml)|application\/pdf)$/, max: 10 * 1024 * 1024 } };
  function loadMedia() {
    db.from("profile_media").select("id, media_type, object_path, file_name, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).then(function (r) {
      if (r.error) return say("mediaMsg", "Could not load your workstation. Run migration5.sql in Supabase.", true);
      var list = $("mediaList"); list.textContent = "";
      (r.data || []).forEach(function (item) {
        var row = document.createElement("div"); row.className = "media-item";
        var name = document.createElement("span"); name.textContent = mediaTypes[item.media_type].label + " · " + item.file_name;
        var preview = document.createElement("button"); preview.type = "button"; preview.className = "btn ghost"; preview.textContent = "View";
        preview.onclick = function () { db.storage.from("workstation").createSignedUrl(item.object_path, 300).then(function (s) { if (s.data) window.open(s.data.signedUrl, "_blank", "noopener"); else say("mediaMsg", "Could not open this file.", true); }); };
        var remove = document.createElement("button"); remove.type = "button"; remove.className = "btn ghost"; remove.textContent = "Delete";
        remove.onclick = function () { db.from("profile_media").delete().eq("id", item.id).then(function (d) { if (d.error) return say("mediaMsg", d.error.message, true); db.storage.from("workstation").remove([item.object_path]).then(loadMedia); }); };
        row.append(name, preview, remove); list.appendChild(row);
      });
      if (!(r.data || []).length) { var empty = document.createElement("p"); empty.className = "muted"; empty.textContent = "No files yet. Upload your first item above."; list.appendChild(empty); }
    });
  }
  $("uploadMedia").onclick = function () {
    var file = $("mediaFile").files[0], type = $("mediaType").value, rule = mediaTypes[type];
    if (!file) return say("mediaMsg", "Choose a file to upload.", true);
    if (!rule.accept.test(file.type)) return say("mediaMsg", "Choose a valid " + rule.label.toLowerCase() + " file.", true);
    if (file.size > rule.max) return say("mediaMsg", rule.label + " files must be under " + (rule.max / 1024 / 1024) + " MB.", true);
    say("mediaMsg", "Uploading…");
    var safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100), path = user.id + "/" + type + "/" + Date.now() + "-" + safeName;
    db.storage.from("workstation").upload(path, file, { contentType: file.type }).then(function (u) {
      if (u.error) return say("mediaMsg", "Upload failed: " + u.error.message, true);
      db.from("profile_media").insert({ user_id: user.id, media_type: type, object_path: path, file_name: file.name }).then(function (r) {
        if (r.error) { db.storage.from("workstation").remove([path]); return say("mediaMsg", "Could not save file details: " + r.error.message, true); }
        $("mediaFile").value = ""; say("mediaMsg", "Uploaded."); loadMedia();
      });
    });
  };

  $("photo").onchange = function () {
    var f = this.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) return say("photoMsg", "Choose an image file.", true);
    if (f.size > 2 * 1024 * 1024) return say("photoMsg", "Photo must be under 2 MB.", true);
    say("photoMsg", "Uploading…");
    var path = user.id + "/avatar";
    db.storage.from("avatars").upload(path, f, { upsert: true, contentType: f.type }).then(function (r) {
      if (r.error) return say("photoMsg", "Upload failed: " + r.error.message, true);
      var url = db.storage.from("avatars").getPublicUrl(path).data.publicUrl + "?t=" + Date.now();
      db.from("profiles").update({ avatar_url: url }).eq("id", user.id).then(function (u) {
        if (u.error) return say("photoMsg", u.error.message, true);
        setPhoto(url);
        say("photoMsg", "Photo updated.");
      });
    });
  };

  $("saveProfile").onclick = function () {
    say("profileMsg", "Saving…");
    db.from("profiles").upsert({
      id: user.id,
      first_name: $("firstName").value.trim(),
      last_name: $("lastName").value.trim(),
      birthday: $("birthday").value || null,
      address: $("address").value.trim(),
      phone: $("phone").value.trim(),
      bio: $("bio").value.trim()
    }).then(function (r) {
      if (r.error) return say("profileMsg", r.error.message, true);
      paint();
      say("profileMsg", "");
      editing(false);
    });
  };

  $("saveUser").onclick = function () {
    var username = $("username").value.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(username)) return say("userMsg", "Username must be 3 to 20 letters, numbers or underscores.", true);
    say("userMsg", "Saving…");
    db.from("profiles").upsert({ id: user.id, username: username }).then(function (r) {
      if (r.error) return say("userMsg", r.error.code === "23505" ? "That username is taken. Try another." : r.error.message, true);
      $("username").value = username;
      paint();
      say("userMsg", "Username updated.");
    });
  };

  $("savePass").onclick = function () {
    var p = $("newPass").value;
    if (p.length < 8) return say("passMsg", "Use at least 8 characters.", true);
    db.auth.updateUser({ password: p }).then(function (r) {
      if (r.error) return say("passMsg", r.error.message, true);
      $("newPass").value = "";
      say("passMsg", "Password updated.");
    });
  };

  $("logout").onclick = function () {
    db.auth.signOut().then(function () { location.href = LJ_URL("../../"); });
  };
})();
