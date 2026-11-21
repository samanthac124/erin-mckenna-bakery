/* Material-style date picker matching the "SELECT DATE" dialog in the Figma file. */
(function () {
  "use strict";
  const A = "assets/";
  const DOW = ["M", "T", "W", "T", "F", "S", "S"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const SHORT_M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const SHORT_D = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
  const fmtShort = (d) => `${SHORT_D[d.getDay()]}, ${SHORT_M[d.getMonth()]} ${d.getDate()}`;

  /**
   * attach(field, { onPick }) — `field` is a <button> showing the chosen date.
   * The dialog is positioned 88px above the field (as in the design).
   */
  function attach(field, opts) {
    const today = startOfDay(new Date());
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // earliest: tomorrow
    let selected = null;   // committed value
    let pending = null;    // value while dialog is open
    let view = new Date(minDate.getFullYear(), minDate.getMonth(), 1);

    const dlg = document.createElement("div");
    dlg.className = "datepicker";
    dlg.hidden = true;
    dlg.setAttribute("role", "dialog");
    dlg.setAttribute("aria-modal", "true");
    dlg.setAttribute("aria-label", "Select date");
    field.closest(".form").appendChild(dlg);

    function render() {
      const y = view.getFullYear(), m = view.getMonth();
      const first = new Date(y, m, 1);
      const lead = (first.getDay() + 6) % 7; // Monday-first
      const days = new Date(y, m + 1, 0).getDate();
      const prevDisabled = y < minDate.getFullYear() || (y === minDate.getFullYear() && m <= minDate.getMonth());
      const shown = pending || minDate;

      let cells = DOW.map((d) => `<div class="dp-dow" aria-hidden="true">${d}</div>`).join("");
      cells += "<div></div>".repeat(lead);
      for (let d = 1; d <= days; d++) {
        const date = new Date(y, m, d);
        const cls = ["dp-day"];
        if (sameDay(date, today)) cls.push("is-today");
        if (sameDay(date, pending)) cls.push("is-selected");
        const label = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        cells += `<button type="button" class="${cls.join(" ")}" data-day="${d}" aria-label="${label}"${sameDay(date, pending) ? ' aria-pressed="true"' : ""}${date < minDate ? " disabled" : ""}><span>${d}</span></button>`;
      }

      dlg.innerHTML = `
        <div class="dp-head">
          <p class="dp-head__label">Select date</p>
          <div class="dp-head__row"><p class="dp-head__date" aria-live="polite">${pending ? fmtShort(pending) : fmtShort(shown)}</p><img src="${A}icon-pencil.svg" alt=""></div>
        </div>
        <div class="dp-month">
          <p class="dp-month__name">${MONTHS[m]} ${y} <img src="${A}icon-caret.svg" alt=""></p>
          <div class="dp-pager">
            <button type="button" data-nav="-1" aria-label="Previous month"${prevDisabled ? " disabled" : ""}></button>
            <button type="button" data-nav="1" aria-label="Next month"></button>
          </div>
        </div>
        <div class="dp-grid">${cells}</div>
        <div class="dp-actions">
          <button type="button" data-act="cancel">Cancel</button>
          <button type="button" data-act="ok" style="width:72px">Ok</button>
        </div>`;
    }

    function focusDay() {
      const target = dlg.querySelector(".dp-day.is-selected") || dlg.querySelector(".dp-day:not(:disabled)");
      if (target) target.focus();
    }

    function open() {
      pending = selected;
      const base = selected || minDate;
      view = new Date(base.getFullYear(), base.getMonth(), 1);
      render();
      dlg.style.top = field.closest(".date-field").offsetTop - 88 + "px";
      dlg.hidden = false;
      field.setAttribute("aria-expanded", "true");
      focusDay();
      setTimeout(() => document.addEventListener("pointerdown", outside), 0);
    }

    function close(commit) {
      if (commit && pending) {
        selected = pending;
        opts.onPick(selected);
      }
      dlg.hidden = true;
      field.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", outside);
      field.focus();
    }

    function outside(e) {
      if (!dlg.contains(e.target) && e.target !== field) close(false);
    }

    field.setAttribute("aria-haspopup", "dialog");
    field.setAttribute("aria-expanded", "false");
    field.addEventListener("click", () => (dlg.hidden ? open() : close(false)));

    dlg.addEventListener("click", (e) => {
      const day = e.target.closest("[data-day]");
      if (day && !day.disabled) {
        pending = new Date(view.getFullYear(), view.getMonth(), Number(day.dataset.day));
        render();
        focusDay();
        return;
      }
      const nav = e.target.closest("[data-nav]");
      if (nav && !nav.disabled) {
        view = new Date(view.getFullYear(), view.getMonth() + Number(nav.dataset.nav), 1);
        render();
        const again = dlg.querySelector(`[data-nav="${nav.dataset.nav}"]`);
        (again && !again.disabled ? again : dlg.querySelector("[data-nav]:not(:disabled)")).focus();
        return;
      }
      const act = e.target.closest("[data-act]");
      if (act) close(act.dataset.act === "ok");
    });

    dlg.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); close(false); return; }
      const day = e.target.closest("[data-day]");
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (!day || !step) return;
      e.preventDefault();
      const cur = new Date(view.getFullYear(), view.getMonth(), Number(day.dataset.day));
      const next = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + step);
      if (next < minDate) return;
      pending = next;
      view = new Date(next.getFullYear(), next.getMonth(), 1);
      render();
      focusDay();
    });
  }

  window.EMBDatePicker = { attach };
})();
