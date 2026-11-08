// Profile page: photo, details, settings, log out.
(async () => {
  const { sb } = window.LJ, q = s => document.querySelector(s);
  if (!sb) { q('#nocfg').hidden = false; return; }
  const { data } = await sb.auth.getSession();
  if (!data.session) { location.replace('../login/'); return; }
  const user = data.session.user;
  const say = (t, good) => { const m = q('#msg'); m.textContent = t; m.className = 'msg ' + (good ? 'ok' : 'err'); };
  const p = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
  const prof = p.data || {};
  const nameOf = () => (prof.full_name && prof.full_name.trim()) || user.email.split('@')[0];

  function drawHead() {
    q('#pname').textContent = nameOf();
    q('#email').textContent = user.email;
    const av = q('#av'); av.textContent = '';
    if (prof.avatar && /^data:image\/(jpeg|png|webp);base64,/.test(prof.avatar)) {
      const im = document.createElement('img'); im.src = prof.avatar; im.alt = ''; av.append(im);
    } else av.textContent = nameOf().charAt(0).toUpperCase();
  }
  drawHead();
  q('#acc').hidden = false;

  // Rows that open a panel
  document.querySelectorAll('.row-btn[data-panel]').forEach(b => {
    b.onclick = () => { const pn = document.getElementById(b.dataset.panel), open = pn.hidden; pn.hidden = !open; b.setAttribute('aria-expanded', open); };
  });

  // Photo: resized to 160px and saved on the profile row
  q('#cam').onclick = () => q('#file').click();
  q('#file').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f), img = new Image();
    img.onload = async () => {
      const c = document.createElement('canvas'); c.width = c.height = 160;
      const s = Math.min(img.width, img.height);
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 160, 160);
      URL.revokeObjectURL(url);
      const avatar = c.toDataURL('image/jpeg', 0.8);
      const { error } = await sb.from('profiles').update({ avatar }).eq('id', user.id);
      if (error) return say('Could not save the photo. Run migration7.sql in Supabase.');
      prof.avatar = avatar; drawHead(); say('Photo updated.', true);
    };
    img.onerror = () => { URL.revokeObjectURL(url); say('That file is not an image.'); };
    img.src = url;
  };

  // Details
  q('#nm').value = prof.full_name || ''; q('#ad').value = prof.address || ''; q('#bd').value = prof.birthday || ''; q('#ph').value = prof.phone || ''; q('#em').value = user.email;
  q('#pf').onsubmit = async e => {
    e.preventDefault();
    const m = q('#dmsg'), btn = q('#pf button'), em = q('#em').value.trim().toLowerCase(), bd = q('#bd').value, ph = q('#ph').value.trim(), nm = q('#nm').value.trim();
    const bad = t => { m.textContent = t; m.className = 'msg err'; };
    if (!nm) return bad('Add your full name.');
    if (!/^\S+@\S+\.\S+$/.test(em)) return bad('Enter a valid email.');
    if (bd && (bd > new Date().toISOString().slice(0, 10) || bd < '1900-01-01')) return bad('Check the birthday.');
    if (ph && !/^[+0-9][0-9\s\-()]{6,19}$/.test(ph)) return bad('Check the contact number.');
    btn.disabled = true;
    const upd = { full_name: nm, address: q('#ad').value.trim() || null, birthday: bd || null, phone: ph || null };
    const { error } = await sb.from('profiles').update(upd).eq('id', user.id);
    if (error) { btn.disabled = false; return bad('Could not save. Run migration8.sql in Supabase.'); }
    Object.assign(prof, upd); drawHead();
    let note = 'Saved.';
    if (em !== user.email.toLowerCase()) {
      const r = await sb.auth.updateUser({ email: em });
      if (r.error) { btn.disabled = false; return bad(r.error.message); }
      note = 'Saved. Check your new email to confirm the change.';
    }
    btn.disabled = false; m.textContent = note; m.className = 'msg ok';
  };

  // Settings and log out
  q('#del').onclick = async e => {
    const b = e.target;
    if (!b.dataset.ok) { b.dataset.ok = 1; b.textContent = 'Click again to delete'; return; }
    const { error } = await sb.rpc('delete_my_account');
    if (error) return say(error.message);
    await sb.auth.signOut(); location.href = '../../';
  };
  q('#so').onclick = async () => { await sb.auth.signOut(); location.href = '../../'; };
})();
