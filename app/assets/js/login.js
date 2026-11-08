// Sign in and create account.
(() => {
  const { sb, cfg } = window.LJ, q = s => document.querySelector(s), msg = q('#msg');
  const say = (t, good) => { msg.textContent = t; msg.className = 'msg ' + (good ? 'ok' : 'err'); };
  let mode = 'in';
  function setMode(m) {
    mode = m;
    q('#name-row').hidden = m !== 'up';
    q('#go').textContent = m === 'in' ? 'Sign in' : 'Create account';
    q('#t-in').classList.toggle('on', m === 'in');
    q('#t-up').classList.toggle('on', m === 'up');
    q('#pw').autocomplete = m === 'in' ? 'current-password' : 'new-password';
    say('');
  }
  q('#t-in').onclick = () => setMode('in');
  q('#t-up').onclick = () => setMode('up');
  if (location.hash === '#signup') setMode('up');
  if (!sb) { say('Sign-in is not set up yet. Add your Supabase URL and anon key to app/assets/js/config.js.'); return; }
  sb.auth.getSession().then(({ data }) => { if (data.session) location.replace('../account/index.html'); });
  q('#lf').onsubmit = async e => {
    e.preventDefault();
    const em = q('#em').value.trim().toLowerCase(), pw = q('#pw').value, btn = q('#go');
    if (!/^\S+@\S+\.\S+$/.test(em)) return say('Enter a valid email.');
    if (pw.length < 8) return say('Use a password of at least 8 characters.');
    btn.disabled = true;
    if (mode === 'up') {
      const name = q('#nm').value.trim();
      if (!name) { btn.disabled = false; return say('Add your name.'); }
      const { data, error } = await sb.auth.signUp({ email: em, password: pw, options: { data: { full_name: name }, emailRedirectTo: (cfg.SITE_URL || location.origin + '/') + 'app/account/index.html' } });
      btn.disabled = false;
      if (error) return say(error.message);
      if (!data.session) { setMode('in'); return say('Check your email to confirm your account, then sign in.', true); }
    } else {
      const { error } = await sb.auth.signInWithPassword({ email: em, password: pw });
      if (error) { btn.disabled = false; return say('Email or password is not right.'); }
    }
    location.href = '../account/index.html';
  };
})();
