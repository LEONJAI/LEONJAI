// Sign in and create account.
(() => {
  const { sb, cfg } = window.LJ, q = s => document.querySelector(s), msg = q('#msg');
  const say = (t, good) => { msg.textContent = t; msg.className = 'msg ' + (good ? 'ok' : 'err'); };
  let mode = 'in';
  function setMode(m) {
    mode = m;
    q('#up-fields').hidden = m !== 'up';
    q('#go').textContent = m === 'in' ? 'Sign in' : 'Create account';
    q('#t-in').classList.toggle('on', m === 'in');
    q('#t-up').classList.toggle('on', m === 'up');
    q('#pw').autocomplete = m === 'in' ? 'current-password' : 'new-password';
    say('');
  }
  q('#t-in').onclick = () => setMode('in');
  q('#t-up').onclick = () => setMode('up');
  if (location.hash === '#signup') setMode('up');

  // Back from sign up: the confirmation link has been sent, so ask them to confirm and sign in.
  const params = new URLSearchParams(location.search);
  if (params.get('sent')) {
    q('#em').value = params.get('email') || '';
    setMode('in');
    say('We sent a confirmation link to your email. Open it, then sign in here.', true);
  }

  if (!sb) { say('Sign-in is not set up yet. Add your Supabase URL and anon key to app/assets/js/config.js.'); return; }
  sb.auth.getSession().then(({ data }) => { if (data.session) location.replace('../account/'); });

  q('#lf').onsubmit = async e => {
    e.preventDefault();
    const em = q('#em').value.trim().toLowerCase(), pw = q('#pw').value, btn = q('#go');
    if (!/^\S+@\S+\.\S+$/.test(em)) return say('Enter a valid email.');
    if (pw.length < 8) return say('Use a password of at least 8 characters.');
    if (mode === 'up') {
      const name = q('#nm').value.trim(), address = q('#ad').value.trim(), birthday = q('#bd').value, phone = q('#ph').value.trim();
      if (!name) return say('Add your full name.');
      if (!address) return say('Add your address.');
      if (!birthday || birthday > new Date().toISOString().slice(0, 10) || birthday < '1900-01-01') return say('Add a valid birthday.');
      if (!/^[+0-9][0-9\s\-()]{6,19}$/.test(phone)) return say('Add a valid contact number.');
      btn.disabled = true;
      const { data, error } = await sb.auth.signUp({ email: em, password: pw, options: { data: { full_name: name, address, birthday, phone }, emailRedirectTo: (cfg.SITE_URL || location.origin + '/') + 'app/account/' } });
      if (error) { btn.disabled = false; return say(error.message); }
      if (!data.session) {
        say('Confirmation link sent to ' + em + '. Taking you to the sign-in page...', true);
        setTimeout(() => { location.href = '?sent=1&email=' + encodeURIComponent(em); }, 2500);
        return;
      }
    } else {
      btn.disabled = true;
      const { error } = await sb.auth.signInWithPassword({ email: em, password: pw });
      if (error) { btn.disabled = false; return say('Email or password is not right.'); }
    }
    location.href = '../account/';
  };
})();
