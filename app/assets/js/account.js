// Account page: profile, orders, peso payments, quote requests, sign out, delete.
(async () => {
  const { sb } = window.LJ, q = s => document.querySelector(s);
  if (!sb) { q('#nocfg').hidden = false; return; }
  const { data } = await sb.auth.getSession();
  if (!data.session) { location.replace('../login/index.html'); return; }
  const user = data.session.user;
  const say = (t, good) => { const m = q('#msg'); m.textContent = t; m.className = 'msg ' + (good ? 'ok' : 'err'); };
  const day = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fill = (sel, rows, fmt) => {
    const ul = q(sel); ul.textContent = '';
    if (!rows.length) { const li = document.createElement('li'); li.textContent = 'Nothing here yet.'; ul.append(li); return; }
    rows.forEach(r => { const [t, s] = fmt(r), li = document.createElement('li'), sm = document.createElement('small'); li.textContent = t; sm.textContent = s; li.append(sm); ul.append(li); });
  };
  const [p, o, pp, r] = await Promise.all([
    sb.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    sb.from('orders').select('item,status,created_at').order('created_at', { ascending: false }).limit(50),
    sb.from('peso_payments').select('item,amount_php,reference,status,created_at').order('created_at', { ascending: false }).limit(50),
    sb.from('quote_requests').select('service,budget,created_at').order('created_at', { ascending: false }).limit(50)
  ]);
  q('#email').textContent = user.email;
  q('#nm').value = (p.data && p.data.full_name) || '';
  fill('#orders', o.data || [], x => [x.item, x.status + ', ' + day(x.created_at)]);
  fill('#pesos', pp.data || [], x => [x.item + ' (₱' + x.amount_php.toLocaleString('en-US') + ')', x.status + ', ref ' + x.reference + ', ' + day(x.created_at)]);
  fill('#quotes', r.data || [], x => [x.service, 'Budget: ' + (x.budget || 'not set') + ', ' + day(x.created_at)]);
  q('#acc').hidden = false;
  q('#pf').onsubmit = async e => {
    e.preventDefault();
    const { error } = await sb.from('profiles').update({ full_name: q('#nm').value.trim() }).eq('id', user.id);
    say(error ? error.message : 'Saved.', !error);
  };
  q('#so').onclick = async () => { await sb.auth.signOut(); location.href = '../../index.html'; };
  q('#del').onclick = async e => {
    const b = e.target;
    if (!b.dataset.ok) { b.dataset.ok = 1; b.textContent = 'Click again to delete'; return; }
    const { error } = await sb.rpc('delete_my_account');
    if (error) return say(error.message);
    await sb.auth.signOut(); location.href = '../../index.html';
  };
})();
