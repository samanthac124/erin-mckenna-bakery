(function () {
  "use strict";
  const { qs, qsa } = window.EMB;

  // Allergen strip: append a hidden copy of the track so the marquee loops without a gap.
  const belt = qs("#allergen-belt");
  if (belt) {
    const copy = belt.firstElementChild.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    belt.appendChild(copy);
  }

  // Shop treats slider: each 260px panel snaps to the center, so panel i sits at scrollLeft = i * 260.
  const PANEL = 260;
  const slider = qs("#shop-slider");
  const prev = qs(".shop-arrow--prev");
  const next = qs(".shop-arrow--next");
  const goTo = (i) => slider.scrollTo({ left: i * PANEL, behavior: "smooth" });
  const current = () => Math.round(slider.scrollLeft / PANEL);

  // Mouse drag-to-scroll for the horizontal sliders (touch already scrolls natively).
  qsa("[data-drag]").forEach((el) => {
    let startX = 0, startLeft = 0, moved = false, down = false;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
      el.classList.add("is-dragging"); // snapping would fight the drag
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      el.classList.remove("is-dragging");
      if (el === slider) goTo(Math.round(el.scrollLeft / PANEL)); // settle on the nearest panel
    });
    // Don't follow a panel link at the end of a drag.
    el.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
    el.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // Arrows step one panel; each hides at its end. Progress bar starts at 25% as in the design.
  const fill = qs("#shop-progress");
  prev.addEventListener("click", () => goTo(current() - 1));
  next.addEventListener("click", () => goTo(current() + 1));
  const update = () => {
    const max = slider.scrollWidth - slider.clientWidth;
    const f = max > 0 ? slider.scrollLeft / max : 0;
    fill.style.width = (25 + f * 75).toFixed(1) + "%";
    const atStart = slider.scrollLeft < 10, atEnd = slider.scrollLeft > max - 10;
    // Keep keyboard focus on a visible arrow when the focused one hides.
    if (atStart && document.activeElement === prev) next.focus();
    if (atEnd && document.activeElement === next) prev.focus();
    prev.hidden = atStart;
    next.hidden = atEnd;
  };
  slider.addEventListener("scroll", update, { passive: true });
  update();
})();
