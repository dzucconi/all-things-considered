export default (wait = 30000) =>
  setInterval(() => {
    window.location.href = window.location.href;
    window.setTimeout(() => window.stop(), 0);
  }, wait);
