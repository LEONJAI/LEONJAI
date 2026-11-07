(function () {
  var c = window.APP_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  var msg = $("msg"), mode = "login";

  function say(t, err) { msg.textContent = t; msg.className = "msg" + (err ? " err" : ""); }

  if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) {
    say("Login is not set up yet. Add your Supabase keys in config.js.", true);
    $("submit").disabled = true;
    return;
  }
  var db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);

  db.auth.getSession().then(function (r) { if (r.data.session) location.replace(LJ_URL("../account/")); });
  db.auth.onAuthStateChange(function (_e, s) { if (s) location.replace(LJ_URL("../account/")); });

  $("birthday").max = new Date().toISOString().slice(0, 10);

  $("toggle").onclick = function () {
    mode = mode === "login" ? "signup" : "login";
    $("title").textContent = $("submit").textContent = mode === "login" ? "Log in" : "Sign up";
    $("signupFields").hidden = mode === "login";
    $("forgot").hidden = mode !== "login";
    $("password").autocomplete = mode === "login" ? "current-password" : "new-password";
    this.textContent = mode === "login" ? "Need an account? Sign up" : "Have an account? Log in";
    say("");
  };

  $("forgot").onclick = function () {
    var email = $("email").value.trim();
    if (!email) return say("Type your email above first, then click Forgot password.", true);
    say("Sending…");
    db.auth.resetPasswordForEmail(email, { redirectTo: new URL("/app/reset/", location.origin).href }).then(function (r) {
      if (r.error) return say(r.error.message, true);
      say("If that email has an account, a reset link is on its way. Check your inbox and spam folder.");
    });
  };

  function ageOf(iso) {
    var b = new Date(iso), n = new Date(), a = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
    return a;
  }

  function signUp(email, password) {
    var d = {
      first_name: $("firstName").value.trim(),
      last_name: $("lastName").value.trim(),
      username: $("username").value.trim().toLowerCase(),
      birthday: $("birthday").value,
      address: $("address").value.trim()
    };
    if (!d.first_name || !d.last_name) return say("Enter your first and last name.", true);
    if (!/^[a-z0-9_]{3,20}$/.test(d.username)) return say("Username must be 3 to 20 letters, numbers or underscores.", true);
    if (!d.birthday) return say("Enter your birthday.", true);
    if (ageOf(d.birthday) < 13) return say("You must be at least 13 to sign up.", true);
    if (!d.address) return say("Enter your address.", true);

    say("Working…");
    db.rpc("username_available", { name: d.username }).then(function (r) {
      if (r.error) return say("Could not check the username. Run migration2.sql in Supabase. Details: " + r.error.message, true);
      if (!r.data) return say("That username is taken. Try another.", true);
      db.auth.signUp({ email: email, password: password, options: { data: d } }).then(function (res) {
        if (res.error) return say(res.error.message, true);
        if (!res.data.session) say("Check your email to confirm your account.");
      });
    });
  }

  $("submit").onclick = function () {
    var email = $("email").value.trim(), password = $("password").value;
    if (!email || password.length < 8) return say("Enter your email and a password of at least 8 characters.", true);
    if (mode === "signup") return signUp(email, password);
    say("Working…");
    db.auth.signInWithPassword({ email: email, password: password }).then(function (r) {
      if (r.error) say(r.error.message, true);
    });
  };
})();
