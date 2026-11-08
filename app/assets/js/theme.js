// Light and dark mode, shared by every page.
const root = document.documentElement;
function setTheme(t) {
  root.dataset.theme = t;
  document.body.classList.toggle('dk', t === 'dark');
  try { localStorage.setItem('theme', t); } catch (e) {}
}
(function () {
  let t = null;
  try { t = localStorage.getItem('theme'); } catch (e) {}
  setTheme(t || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));
  const b = document.getElementById('theme');
  if (b) b.onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
})();
