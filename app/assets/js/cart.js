// Order list: add items from Pricing and Gallery, review them, place the order.
(() => {
  const KEY = 'lj_cart', cfg = window.LEONJAI_CONFIG || {}, sb = window.LJ && window.LJ.sb;
  const app = document.body.dataset.app || '';
  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
  items = items.filter(i => i && typeof i.name === 'string' && i.usd > 0 && i.qty > 0);
  const subs = [];
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} subs.forEach(f => f()); render(); };
  const currency = () => (typeof cur !== 'undefined' ? cur : 'USD');
  const money = usd => currency() === 'PHP' ? '₱' + Math.round(usd * (cfg.PESO_RATE || 54)).toLocaleString('en-US') : '$' + (Math.round(usd * 100) / 100).toLocaleString('en-US');
  const count = () => items.reduce((s, i) => s + i.qty, 0);
  const total = () => items.reduce((s, i) => s + i.usd * i.qty, 0);

  const Cart = window.LJCart = {
    items: () => items.map(i => ({ ...i })), count, total, money,
    onChange: f => subs.push(f),
    add(name, usd) { const f = items.find(i => i.name === name); if (f) f.qty = Math.min(10, f.qty + 1); else items.push({ name, usd, qty: 1 }); save(); },
    setQty(name, q) { const f = items.find(i => i.name === name); if (!f) return; f.qty = Math.max(0, Math.min(10, q)); items = items.filter(i => i.qty > 0); save(); },
    remove(name) { items = items.filter(i => i.name !== name); save(); },
    clear() { items = []; save(); },
    async place() {
      if (!sb) return { error: 'Orders are not set up yet. Add your Supabase keys to config.js.' };
      if (!items.length) return { error: 'Your order list is empty.' };
      const { data } = await sb.auth.getSession();
      if (!data.session) return { login: true };
      const rows = items.map(i => ({ item: i.qty > 1 ? i.name + ' ×' + i.qty : i.name, amount_usd: Math.round(i.usd * i.qty * 100) / 100 }));
      const { error } = await sb.rpc('place_orders', { p_items: rows });
      if (error) return { error: error.message };
      const usd = Math.round(total() * 100) / 100, label = items.length === 1 ? rows[0].item : items.length + ' items';
      items = []; save();
      return { ok: true, count: rows.length, usd, label };
    }
  };

  // Check out: save the order list, then open the peso payment page with the total.
  Cart.checkout = async () => {
    const r = await Cart.place();
    if (r.ok) location.href = app + 'pay-peso/index.html?item=' + encodeURIComponent(r.label) + '&usd=' + r.usd;
    return r;
  };

  // Header button with a count
  const acct = document.getElementById('acct');
  if (acct) {
    const b = document.createElement('button');
    b.className = 'btn out'; b.id = 'cartBtn'; b.setAttribute('aria-label', 'Order list');
    b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg><span class="t">Orders</span><span class="badge zero" id="cartN">0</span>';
    acct.parentNode.insertBefore(b, acct);
  }

  // Drawer
  const wrap = document.createElement('div');
  wrap.id = 'cartWrap'; wrap.hidden = true;
  wrap.innerHTML = '<div class="scrim"></div><aside class="drawer" role="dialog" aria-label="Order list"><div class="dh"><h3>Order list <span class="count" id="dN">0</span></h3><button class="x" aria-label="Close">×</button></div><ul class="cl" id="dList"></ul><div class="dt"><span>Total</span><b id="dTot"></b></div><div class="msg" id="dMsg" role="status"></div><button class="btn gold" id="dPay">Check out</button><button class="btn out" id="dGo">Place order, pay later</button><button class="lnk" id="dClr">Clear list</button></aside>';
  document.body.appendChild(wrap);
  const q = s => wrap.querySelector(s);
  const say = (t, good) => { const m = q('#dMsg'); m.textContent = t; m.className = 'msg ' + (t ? (good ? 'ok' : 'err') : ''); };
  const open = o => { wrap.hidden = !o; if (o) { say(''); q('.x').focus(); } };

  function render() {
    const n = count(), badge = document.getElementById('cartN');
    if (badge) { badge.textContent = n; badge.classList.toggle('zero', n === 0); }
    q('#dN').textContent = n;
    q('#dTot').textContent = money(total());
    const ul = q('#dList'); ul.textContent = '';
    if (!items.length) { const li = document.createElement('li'); li.className = 'empty'; li.textContent = 'Your order list is empty. Use Add order on any price.'; ul.append(li); }
    items.forEach(i => {
      const li = document.createElement('li'), nm = document.createElement('b'), sm = document.createElement('small'), row = document.createElement('div');
      nm.textContent = i.name; sm.textContent = money(i.usd) + ' each, ' + money(i.usd * i.qty) + ' total'; row.className = 'qty';
      const mk = (t, label, fn, cls) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('aria-label', label); if (cls) b.className = cls; b.onclick = fn; return b; };
      const num = document.createElement('span'); num.textContent = i.qty;
      row.append(mk('−', 'Fewer', () => Cart.setQty(i.name, i.qty - 1)), num, mk('+', 'More', () => Cart.setQty(i.name, i.qty + 1)), mk('Remove', 'Remove ' + i.name, () => Cart.remove(i.name), 'rm'));
      li.append(nm, sm, row); ul.append(li);
    });
    q('#dGo').disabled = q('#dPay').disabled = !items.length;
  }

  document.addEventListener('click', e => {
    if (e.target.closest('#cartBtn')) return open(wrap.hidden);
    if (e.target.closest('#cartWrap .scrim, #cartWrap .x')) return open(false);
    const a = e.target.closest('[data-add]');
    if (a) {
      Cart.add(a.dataset.add, parseFloat(a.dataset.p));
      const old = a.textContent; a.textContent = 'Added ✓'; a.classList.add('done');
      setTimeout(() => { a.textContent = old; a.classList.remove('done'); }, 1200);
      if (typeof toast === 'function') toast('Added to your order list');
    }
    if (e.target.closest('#cur')) setTimeout(render, 0);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !wrap.hidden) open(false); });
  q('#dClr').onclick = () => Cart.clear();
  q('#dGo').onclick = async () => {
    const b = q('#dGo'); b.disabled = true;
    const r = await Cart.place();
    b.disabled = !items.length;
    if (r.login) { say('Please sign in to place your order. Your list is saved.'); return setTimeout(() => { location.href = app + 'login/index.html'; }, 1200); }
    if (r.error) return say(r.error);
    say('Order placed (' + r.count + ' item' + (r.count > 1 ? 's' : '') + '). You can follow it in Profile.', true);
  };
  q('#dPay').onclick = async () => {
    const b = q('#dPay'); b.disabled = true;
    const r = await Cart.checkout();
    b.disabled = !items.length;
    if (r.login) { say('Please sign in to check out. Your list is saved.'); return setTimeout(() => { location.href = app + 'login/index.html'; }, 1200); }
    if (r.error) say(r.error);
  };
  render();
})();
