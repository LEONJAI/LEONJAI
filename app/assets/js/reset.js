// Send a reset email, then set a new password when the visitor comes back from the email link.
(() => {
  const { sb, cfg } = window.LJ, q = s => document.querySelector(s);
  const say = (el, t, good) => { el.textContent = t; el.className = 'msg ' + (good ? 'ok' : 'err'); };
  if (!sb) return say(q('#msg'), 'Reset is not set up yet. Add your Supabase URL and anon key to app/assets/js/config.js.');
  q('#req').onsubmit = async e => {
    e.preventDefault();
    const em = q('#em').value.trim().toLowerCase(), m = q('#msg');
    if (!/^\S+@\S+\.\S+$/.test(em)) return say(m, 'Enter a valid email.');
    const { error } = await sb.auth.resetPasswordForEmail(em, { redirectTo: (cfg.SITE_URL || location.origin + '/') + 'app/reset/' });
    say(m, error ? error.message : 'If that email has an account, a reset link is on its way.', !error);
  };
  sb.auth.onAuthStateChange(ev => {
    if (ev !== 'PASSWORD_RECOVERY') return;
    q('#req').hidden = true; q('#setp').hidden = false;
  });
  q('#setp').onsubmit = async e => {
    e.preventDefault();
    const p = q('#np').value, m = q('#msg2');
    if (p.length < 8) return say(m, 'Use a password of at least 8 characters.');
    const { error } = await sb.auth.updateUser({ password: p });
    if (error) return say(m, error.message);
    say(m, 'Password updated. Taking you to your account.', true);
    setTimeout(() => location.href = '../account/', 1200);
  };
})();
