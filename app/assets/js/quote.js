// Home page: save quote requests to Supabase. Runs before script.js clears the form.
(() => {
  const sb = window.LJ && window.LJ.sb, f = document.getElementById('qf');
  if (!sb || !f) return;
  const v = id => document.getElementById(id).value;
  f.addEventListener('submit', () => {
    const n = v('qn').trim(), em = v('qe').trim(), s = v('qs');
    if (!n || !/^\S+@\S+\.\S+$/.test(em) || !s) return;
    sb.rpc('submit_quote', { p_name: n, p_email: em, p_service: s, p_budget: v('qb'), p_details: v('qd') })
      .then(({ error }) => { if (error) console.warn('Quote not saved:', error.message); });
  }, true);
})();
