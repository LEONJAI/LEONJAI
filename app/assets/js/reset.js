(function () {
  var c = window.APP_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  function say(t, err) { $("msg").textContent = t; $("msg").className = "msg" + (err ? " err" : ""); }

  if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) return say("Add your Supabase keys in config.js.", true);
  var db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  var ready = false;

  function open() { ready = true; $("form").hidden = false; say(""); }

  // The emailed link signs the person in temporarily so they can set a new password.
  db.auth.onAuthStateChange(function (event) { if (event === "PASSWORD_RECOVERY") open(); });
  setTimeout(function () {
    if (ready) return;
    say("This reset link is invalid or has expired. Request a new one from the log in page.", true);
    $("again").hidden = false;
  }, 2500);

  $("save").onclick = function () {
    var a = $("p1").value, b = $("p2").value;
    if (a.length < 8) return say("Use at least 8 characters.", true);
    if (a !== b) return say("The two passwords do not match.", true);
    say("Saving…");
    db.auth.updateUser({ password: a }).then(function (r) {
      if (r.error) return say(r.error.message, true);
      say("Password updated. Taking you to your account…");
      setTimeout(function () { location.href = LJ_URL("../account/"); }, 1200);
    });
  };
})();
