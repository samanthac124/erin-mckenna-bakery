/* Bouncing dots: every [data-dot] drifts slowly inside its nearest [data-dot-frame] and bounces off the edges.
   Dots are moved behind the frame's content, only animate while their frame is on screen,
   and stay still for people who ask their device to reduce motion. */
(function () {
  "use strict";
  const MIN_SPEED = 6, MAX_SPEED = 12; // px per second
  const PLAY_SECONDS = 5; // each section's dots move for 5s of on-screen time, then rest (WCAG 2.2.2)

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const frames = new Map(); // frame element -> { dots: [], visible, w, h }

  document.querySelectorAll("[data-dot]").forEach((el) => {
    const frame = el.closest("[data-dot-frame]");
    if (!frame) return;
    if (!frames.has(frame)) frames.set(frame, { dots: [], visible: false, w: 0, h: 0, played: 0 });

    // Layering: sit just above the frame's background art (marked data-under-dots), below everything else.
    const under = [...frame.children].filter((c) => c.hasAttribute("data-under-dots")).pop();
    if (el.parentElement === frame) {
      if (under) under.after(el); else frame.prepend(el);
    }

    const size = el.offsetWidth;
    const angle = Math.random() * Math.PI * 2;
    const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    const dot = { el, size, x: el.offsetLeft, y: el.offsetTop, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
    el.style.left = "0px";
    el.style.top = "0px";
    el.style.pointerEvents = "none";
    el.style.willChange = "transform";
    place(dot);
    frames.get(frame).dots.push(dot);
  });
  if (!frames.size) return;

  function place(d) { d.el.style.transform = `translate(${d.x.toFixed(2)}px, ${d.y.toFixed(2)}px)`; }

  function measure() {
    frames.forEach((f, frame) => {
      f.w = frame.clientWidth; f.h = frame.clientHeight;
      // Keep every dot fully inside its frame (start positions from Figma can sit on an edge).
      f.dots.forEach((d) => {
        d.x = Math.min(Math.max(0, d.x), f.w - d.size);
        d.y = Math.min(Math.max(0, d.y), f.h - d.size);
        place(d);
      });
    });
  }
  measure();
  window.addEventListener("resize", measure);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { frames.get(e.target).visible = e.isIntersecting; });
    kick();
  }, { rootMargin: "100px" });
  frames.forEach((_, frame) => io.observe(frame));

  let last = 0, running = false;
  function step(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0); // clamp after tab switches
    last = t;
    let any = false;
    frames.forEach((f) => {
      if (!f.visible || f.played >= PLAY_SECONDS) return;
      any = true;
      f.played += dt;
      f.dots.forEach((d) => {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        const maxX = f.w - d.size, maxY = f.h - d.size;
        if (d.x < 0) { d.x = 0; d.vx = Math.abs(d.vx); }
        else if (d.x > maxX) { d.x = maxX; d.vx = -Math.abs(d.vx); }
        if (d.y < 0) { d.y = 0; d.vy = Math.abs(d.vy); }
        else if (d.y > maxY) { d.y = maxY; d.vy = -Math.abs(d.vy); }
        place(d);
      });
    });
    if (any && !motionQuery.matches) requestAnimationFrame(step);
    else running = false;
  }
  function kick() {
    if (running || motionQuery.matches) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(step);
  }
  motionQuery.addEventListener("change", kick);
  kick();
})();
