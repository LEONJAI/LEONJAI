// Shows "Account" instead of "Log in" when someone is signed in.
(function () {
  var c = window.APP_CONFIG || {}, link = document.getElementById("navAuth");
  if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY || !window.supabase || !link) return;
  window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY).auth.getSession().then(function (r) {
    if (r.data && r.data.session) { link.textContent = "My account"; link.href = LJ_URL("app/account/"); }
  });
})();
