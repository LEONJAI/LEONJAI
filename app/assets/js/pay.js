// Shared payment helpers.
window.LJPay = {
  rate: () => (window.LEONJAI_CONFIG && window.LEONJAI_CONFIG.PESO_RATE) || 54,
  php(usd) { return Math.round(usd * this.rate()); },
  peso(n) { return '₱' + Number(n).toLocaleString('en-US'); },
  order() {
    const p = new URLSearchParams(location.search), usd = parseFloat(p.get('usd'));
    const item = (p.get('item') || '').slice(0, 200);
    return item && usd > 0 ? { item, usd } : null;
  }
};
