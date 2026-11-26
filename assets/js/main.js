const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyJ1nSuQaLD5kKYlRKMYmtZIQla0dbTl4RntqnDuWef0aOZic2WVu8K7t4Drdntkoirlw/exec";
document.getElementById("year").textContent = new Date().getFullYear();
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// duplicate the logo strip so the marquee loops seamlessly
const logos = document.querySelector(".logos");
if (logos) logos.innerHTML += logos.innerHTML.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"');

// ---------- tabs: active section + keep active tab in view ----------
const tabLinks = [...document.querySelectorAll("#tabs a")];
const byId = new Map(tabLinks.map((a) => [a.hash.slice(1), a]));
const setActive = (id) => {
  tabLinks.forEach((a) => a.classList.toggle("active", a.hash === "#" + id));
  const a = byId.get(id);
  if (a) a.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
};
const spy = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
  { rootMargin: "-40% 0px -55% 0px" }
);
byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
window.addEventListener("scroll", () => { if (window.scrollY < 200) tabLinks.forEach((a) => a.classList.remove("active")); }, { passive: true });

// ---------- reading progress ----------
const bar = document.getElementById("progress");
const onScroll = () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- reveal ----------
const io = new IntersectionObserver(
  (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
  { threshold: 0.1 }
);
document.querySelectorAll(".sec-side, .player, .caption, .feat, .pipeline li, .bignums, .role, .steps, .proj, .timeline li, .skills, .form")
  .forEach((el) => { el.classList.add("rv"); io.observe(el); });

// ---------- counters ----------
document.querySelectorAll("[data-count]").forEach((el) => {
  if (reduce) return;
  const end = +el.dataset.count, suf = el.dataset.suffix || "";
  const o = new IntersectionObserver((en) => {
    if (!en[0].isIntersecting) return;
    o.disconnect();
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1300);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US") + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  o.observe(el);
});

// ---------- tile loops: pause off-screen / reduced motion; one main video at a time ----------
const loops = document.querySelectorAll(".tile-bg");
if (reduce) loops.forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });
else {
  const lo = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause())));
  loops.forEach((v) => lo.observe(v));
}
const players = document.querySelectorAll(".player video");
players.forEach((v) => v.addEventListener("play", () => players.forEach((o) => o !== v && o.pause())));

// a tile click on the AI card scrolls to the demo; start it if the visitor came from the tile
document.querySelector(".t-ai")?.addEventListener("click", () => {
  setTimeout(() => { const v = document.querySelector("#ai video"); v?.play().catch(() => {}); }, 700);
});

// ---------- demo form ----------
const form = document.getElementById("demo-form");
const status = document.getElementById("form-status");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value.trim(), email = form.email.value.trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    status.textContent = "Please add your name and a valid email.";
    status.className = "form-status err";
    return;
  }
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  status.textContent = "Sending…";
  status.className = "form-status";
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name, email, company: form.company.value.trim(), message: form.message.value.trim(), submittedAt: new Date().toISOString() }),
    });
    status.textContent = "Thank you. Your request is in, and I'll reply by email shortly.";
    status.className = "form-status ok";
    form.reset();
  } catch {
    status.textContent = "Something went wrong. Please email ahmedadel7194@hotmail.com directly.";
    status.className = "form-status err";
  } finally {
    btn.disabled = false;
  }
});
