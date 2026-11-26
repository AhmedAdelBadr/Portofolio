// ============================================================
// CONFIG — Google Apps Script Web App URL for the demo form
// (see /apps-script/Code.gs and README.md)
// ============================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyJ1nSuQaLD5kKYlRKMYmtZIQla0dbTl4RntqnDuWef0aOZic2WVu8K7t4Drdntkoirlw/exec";

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- mobile menu ----------
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// ---------- active nav link on scroll ----------
const navMap = new Map([...links.querySelectorAll("a")].map((a) => [a.getAttribute("href").slice(1), a]));
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navMap.forEach((a) => a.classList.remove("active"));
      navMap.get(e.target.id)?.classList.add("active");
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

// ---------- reveal on scroll ----------
const revealTargets = document.querySelectorAll(
  ".sec-head, .timeline li, .chap-head, .split, .role, .card, .work-card, .showcase, .learned, .cred-grid, .demo-inner, .logos"
);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

// ---------- count-up stats ----------
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll("[data-count]").forEach((el) => {
  if (reduce) return;
  const end = Number(el.dataset.count), suffix = el.dataset.suffix || "";
  const fmt = (n) => n.toLocaleString("en-US") + suffix;
  const run = () => {
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { run(); io.disconnect(); } });
  io.observe(el);
});

// ---------- only one video plays at a time ----------
const videos = document.querySelectorAll("video");
videos.forEach((v) => v.addEventListener("play", () => videos.forEach((o) => { if (o !== v) o.pause(); })));

// ---------- demo request form -> Google Sheet ----------
const form = document.getElementById("demo-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    status.textContent = "Please add your name and a valid email.";
    status.className = "form-status err";
    return;
  }

  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  status.textContent = "Sending…";
  status.className = "form-status";

  const payload = {
    name,
    email,
    company: form.company.value.trim(),
    message: form.message.value.trim(),
    submittedAt: new Date().toISOString(),
  };

  try {
    // Apps Script doesn't send CORS headers, so the response can't be read;
    // no-cors still delivers the POST to the sheet.
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    status.textContent = "Thank you. Your request is in, and I'll reply by email shortly.";
    status.className = "form-status ok";
    form.reset();
  } catch (err) {
    status.textContent = "Something went wrong. Please email ahmedadel7194@hotmail.com directly.";
    status.className = "form-status err";
  } finally {
    btn.disabled = false;
  }
});
