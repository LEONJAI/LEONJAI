// Site settings. Edit, save, reload. Use the anon (public) key only, never the service_role key.
window.LEONJAI_CONFIG = {
  SUPABASE_URL: 'https://YOUR-PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR-ANON-KEY',
  CONTACT_EMAIL: 'hello@leonjai.example',
  SITE_URL: 'https://your-domain.example/',
  PESO_RATE: 54, // pesos per US dollar, same rate the Pay buttons show
  PAY_PESO: {
    gcash: { name: 'Your name', number: '09XX XXX XXXX' },
    bank: { bank: 'Bank name', name: 'Account name', number: '0000 0000 0000' }
  }
};
(function () {
  const c = window.LEONJAI_CONFIG;
  const ok = c.SUPABASE_URL && c.SUPABASE_ANON_KEY && !/YOUR-/.test(c.SUPABASE_URL + c.SUPABASE_ANON_KEY) && window.supabase;
  window.LJ = { cfg: c, configured: !!ok, sb: ok ? window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY) : null };
})();
