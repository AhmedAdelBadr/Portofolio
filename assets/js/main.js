// ============================================================
// CONFIG — replace with your deployed Google Apps Script Web App URL
// (see /apps-script/Code.gs and README.md for setup steps)
// ============================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyJ1nSuQaLD5kKYlRKMYmtZIQla0dbTl4RntqnDuWef0aOZic2WVu8K7t4Drdntkoirlw/exec";

// ============================================================
// Footer year
// ============================================================
document.getElementById("year").textContent = new Date().getFullYear();

// ============================================================
// Altitude tab switching
// ============================================================
const tabs = document.querySelectorAll(".altitude-tab");
const panels = document.querySelectorAll(".altitude-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-target");

    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    panels.forEach((p) => p.classList.remove("active"));
    document.getElementById(`panel-${target}`).classList.add("active");
  });
});

// ============================================================
// SQL code tabs + lightweight syntax highlighting
// ============================================================
const SQL_KW = /\b(SELECT|FROM|WHERE|JOIN|LEFT|CROSS|LATERAL|USING|ON|AS|AND|OR|NOT|IS|NULL|CASE|WHEN|THEN|ELSE|END|WITH|UNION|ALL|CREATE|OR REPLACE|VIEW|OVER|PARTITION|BY|ORDER|ROWS|BETWEEN|PRECEDING|CURRENT|ROW|WINDOW|DESC|INTERVAL|DATE|GROUP|HAVING)\b/g;
const SQL_FN = /\b(lag|avg|row_number|round|max|min|count|sum|generate_series|date_trunc|rank)\b(?=\()/g;

function highlightSQL(el) {
  const lines = el.textContent.split("\n").map((line) => {
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const ci = line.indexOf("--");
    const code = ci >= 0 ? line.slice(0, ci) : line;
    const comment = ci >= 0 ? line.slice(ci) : "";
    let html = esc(code)
      .replace(/'[^']*'/g, (m) => `<span class="str">${m}</span>`)
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>')
      .replace(SQL_FN, '<span class="fn">$1</span>')
      .replace(SQL_KW, '<span class="kw">$1</span>');
    if (comment) html += `<span class="cm">${esc(comment)}</span>`;
    return html;
  });
  el.innerHTML = lines.join("\n");
}
document.querySelectorAll(".code-panel code").forEach(highlightSQL);

const codeTabs = document.querySelectorAll(".code-tab");
codeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    codeTabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    document.querySelectorAll(".code-panel").forEach((p) => p.classList.remove("active"));
    document.getElementById(`code-${tab.dataset.code}`).classList.add("active");
  });
});

// ============================================================
// Demo request form -> Google Sheet via Apps Script
// ============================================================
const form = document.getElementById("demo-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (SCRIPT_URL.includes("PASTE_YOUR")) {
    status.textContent = "Form isn't connected yet — add your Apps Script URL in assets/js/main.js (see README.md).";
    status.className = "form-status err";
    return;
  }

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  status.textContent = "Sending…";
  status.className = "form-status";

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    company: form.company.value.trim(),
    message: form.message.value.trim(),
    submittedAt: new Date().toISOString(),
  };

  try {
    // Apps Script web apps don't return CORS headers, so the response
    // body isn't readable from the browser. mode: "no-cors" still lets
    // the POST go through and reach the sheet — we just can't inspect
    // the response, so we optimistically show success after it resolves.
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    status.textContent = "Thanks — your request has been sent. I'll follow up by email shortly.";
    status.className = "form-status ok";
    form.reset();
  } catch (err) {
    status.textContent = "Something went wrong sending your request. Please try again or email directly.";
    status.className = "form-status err";
  } finally {
    submitBtn.disabled = false;
  }
});
