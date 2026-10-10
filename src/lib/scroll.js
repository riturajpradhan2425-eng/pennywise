export const scrollToId = (hash) => (e) => {
  if (e) e.preventDefault();
  const el = document.querySelector(hash);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};
