// Pay in pesos: show the amount and how to pay, then record the payment reference for us to confirm.
(async () => {
  const { sb, cfg } = window.LJ, q = s => document.querySelector(s), P = window.LJPay, order = P.order();
  const say = (t, good) => { const m = q('#msg'); m.textContent = t; m.className = 'msg ' + (good ? 'ok' : 'err'); };
  if (!order) { q('#none').hidden = false; return; }
  q('#has').hidden = false;
  const amount = P.php(order.usd);
  q('#item').textContent = order.item;
  q('#amt').textContent = P.peso(amount);
  const g = cfg.PAY_PESO.gcash, b = cfg.PAY_PESO.bank;
  const how = () => q('#method').value === 'gcash'
    ? `Send ${P.peso(amount)} by GCash to ${g.name}, ${g.number}.`
    : `Transfer ${P.peso(amount)} to ${b.bank}, account name ${b.name}, number ${b.number}.`;
  q('#how').textContent = how();
  q('#method').onchange = () => { q('#how').textContent = how(); };
  let session = null;
  if (sb) { session = (await sb.auth.getSession()).data.session; if (!session) q('#login-note').hidden = false; }
  q('#pf').onsubmit = async e => {
    e.preventDefault();
    const ref = q('#ref').value.trim();
    if (!sb) return say('Payments are not set up yet. Add your Supabase keys to app/assets/js/config.js.');
    if (!session) return say('Please sign in first.');
    if (ref.length < 4) return say('Enter the reference number from your receipt.');
    const { error } = await sb.rpc('submit_peso_payment', { p_item: order.item, p_amount_php: amount, p_method: q('#method').value, p_reference: ref });
    if (error) return say(error.message);
    say('Thank you. We will confirm your payment within one working day. You can follow it in your account.', true);
    q('#pf').querySelector('button').disabled = true;
  };
})();
