// Show and hide password buttons.
document.querySelectorAll('[data-showpass]').forEach(b => {
  b.onclick = () => {
    const i = document.getElementById(b.dataset.showpass), show = i.type === 'password';
    i.type = show ? 'text' : 'password';
    b.textContent = show ? 'Hide' : 'Show';
    b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  };
});
