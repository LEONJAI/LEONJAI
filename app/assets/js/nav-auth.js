// Header "Profile" button on every page: goes to login or account, and shows the visitor's name.
(() => {
  const btn = document.getElementById('acct'), app = document.body.dataset.app || '';
  if (!btn) return;
  let signedIn = false;
  btn.addEventListener('click', e => { e.preventDefault(); location.href = app + (signedIn ? 'account/index.html' : 'login/index.html'); });
  const sb = window.LJ && window.LJ.sb;
  if (!sb) return;
  sb.auth.getSession().then(async ({ data }) => {
    if (!data.session) return;
    signedIn = true;
  });
  // Home page: save the order request when a signed-in visitor sends one from the order summary.
  document.addEventListener('click', e => {
    const a = e.target.closest('#mailOrder');
    if (a && signedIn) sb.rpc('place_order', { p_item: decodeURIComponent(a.dataset.o) });
  });
})();
