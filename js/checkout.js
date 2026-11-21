(function () {
  "use strict";
  const { Cart, LOCATIONS, ORDER_KEY, safeSet, esc, money, qs, qsa } = window.EMB;
  const A = "assets/";
  const mode = document.body.dataset.mode; // "delivery" | "pickup"
  const isDelivery = mode === "delivery";
  const shipping = isDelivery ? 20 : 0;
  const root = qs("#checkout");

  if (Cart.count() === 0) { location.replace("cart.html"); return; }

  const firstField = isDelivery
    ? `<label class="form-label" for="zip" style="margin-top:31px">Delivery ZIP</label>
       <input class="field" id="zip" name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5" placeholder="Enter ZIP " style="margin-top:10px;padding-left:15px" aria-describedby="zip-err">
       <p class="field-error" id="zip-err" aria-live="polite"></p>`
    : `<p class="form-label" id="loc-label" style="margin-top:31px">Pickup Location</p>
       <div class="select" style="margin-top:6px">
         <button type="button" class="field is-placeholder" id="loc" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="loc-label loc" aria-describedby="loc-err">Choose location</button>
         <img src="${A}icon-chevron-down.svg" alt="">
         <ul class="select-menu" role="listbox" id="loc-menu" aria-labelledby="loc-label" hidden>
           ${["", ...LOCATIONS].map((l, i) => `<li role="option" id="loc-opt-${i}" data-value="${esc(l)}" aria-selected="${i === 0}">${l || "Choose location"}</li>`).join("")}
         </ul>
       </div>
       <p class="field-error" id="loc-err" aria-live="polite"></p>
       <a class="link-caps link-caps--wide" href="delivery.html" style="display:inline-block;margin-top:7px;font-weight:400">I need delivery</a>`;

  const noteLabel = isDelivery ? "Add gift note (optional)" : "Add cake writing (optional)";
  const dateLabel = isDelivery ? "Delivery date" : "Pickup date";

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="cart.html">Cart</a><img src="${A}icon-chevron-right.svg" alt=""><span aria-current="page">${isDelivery ? "Delivery" : "Pickup"}</span></nav>
    <h1 class="sr-only">${isDelivery ? "Delivery details" : "Pickup details"}</h1>
    <form class="form" id="form" novalidate>
      ${firstField}
      <p class="form-label" id="date-label" style="margin-top:${isDelivery ? 26 : 20}px">${dateLabel}</p>
      <div class="date-field" style="margin-top:8px">
        <button type="button" class="field" id="date" aria-labelledby="date-label date" aria-describedby="date-err"></button>
        <img src="${A}icon-calendar.svg" alt="">
      </div>
      <p class="field-error" id="date-err" aria-live="polite"></p>
      <label class="check" style="margin-top:27px"><input type="checkbox" id="note-on"> ${noteLabel}</label>
      <textarea class="field" id="note" aria-label="${noteLabel}" maxlength="${isDelivery ? 200 : 40}" style="margin-top:8px" disabled></textarea>
      <div class="totals" style="margin-top:30px;padding:0">
        <div><span class="shipping-label">Subtotal</span><span>${money(Cart.subtotal())}</span></div>
        <div><span class="shipping-label">${isDelivery ? "Shipping" : "Pickup"}</span><span>${shipping ? money(shipping) : "Free"}</span></div>
        <div class="totals__total"><span>Total</span><span>${money(Cart.subtotal() + shipping)}</span></div>
      </div>
      <button class="btn btn--dark btn--cta" type="submit" style="margin-top:30px">CHECKOUT</button>
      <p class="center" style="margin-top:26px"><a class="link-caps link-caps--wide" href="cart.html">RETURN TO CART</a></p>
    </form>`;

  const form = qs("#form");
  const dateBtn = qs("#date");
  let pickedDate = null;
  let location_ = "";

  function setError(id, msg, field) {
    qs(`#${id}-err`).textContent = msg;
    if (field) {
      field.classList.toggle("is-invalid", !!msg);
      field.setAttribute("aria-invalid", msg ? "true" : "false");
    }
  }

  /* Date picker */
  window.EMBDatePicker.attach(dateBtn, {
    onPick(d) {
      pickedDate = d;
      dateBtn.textContent = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
      setError("date", "", dateBtn);
    },
  });

  /* Gift note / cake writing */
  const noteOn = qs("#note-on");
  const note = qs("#note");
  noteOn.addEventListener("change", () => {
    note.disabled = !noteOn.checked;
    if (noteOn.checked) note.focus();
  });

  /* Delivery ZIP */
  const zip = qs("#zip");
  if (zip) {
    zip.addEventListener("input", () => {
      zip.value = zip.value.replace(/\D/g, "").slice(0, 5);
      if (/^\d{5}$/.test(zip.value)) setError("zip", "", zip);
    });
  }

  /* Pickup location listbox */
  const locBtn = qs("#loc");
  if (locBtn) {
    const wrap = locBtn.closest(".select");
    const menu = qs("#loc-menu");
    const opts = qsa("[role=option]", menu);
    let active = 0;

    const highlight = (i) => {
      active = (i + opts.length) % opts.length;
      opts.forEach((o, j) => o.classList.toggle("is-active", j === active));
      locBtn.setAttribute("aria-activedescendant", opts[active].id);
    };
    const openMenu = () => {
      menu.hidden = false; wrap.dataset.open = "";
      locBtn.setAttribute("aria-expanded", "true");
      highlight(Math.max(0, opts.findIndex((o) => o.getAttribute("aria-selected") === "true")));
    };
    const closeMenu = () => {
      menu.hidden = true; delete wrap.dataset.open;
      locBtn.setAttribute("aria-expanded", "false");
      locBtn.removeAttribute("aria-activedescendant");
    };
    const choose = (i) => {
      opts.forEach((o, j) => o.setAttribute("aria-selected", String(j === i)));
      location_ = opts[i].dataset.value;
      locBtn.textContent = location_ || "Choose location";
      locBtn.classList.toggle("is-placeholder", !location_);
      if (location_) setError("loc", "", locBtn);
      closeMenu();
    };

    locBtn.addEventListener("click", () => (menu.hidden ? openMenu() : closeMenu()));
    locBtn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (menu.hidden) openMenu(); else highlight(active + (e.key === "ArrowDown" ? 1 : -1));
      } else if ((e.key === "Enter" || e.key === " ") && !menu.hidden) {
        e.preventDefault(); choose(active);
      } else if (e.key === "Escape") closeMenu();
    });
    opts.forEach((o, i) => o.addEventListener("click", () => { choose(i); locBtn.focus(); }));
    document.addEventListener("pointerdown", (e) => { if (!wrap.contains(e.target)) closeMenu(); });
  }

  /* Submit */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstBad = null;
    if (zip && !/^\d{5}$/.test(zip.value)) { setError("zip", "Enter a 5-digit ZIP code.", zip); firstBad = firstBad || zip; }
    if (locBtn && !location_) { setError("loc", "Choose a pickup location.", locBtn); firstBad = firstBad || locBtn; }
    if (!pickedDate) { setError("date", `Choose a ${isDelivery ? "delivery" : "pickup"} date.`, dateBtn); firstBad = firstBad || dateBtn; }
    if (firstBad) { firstBad.focus(); return; }

    safeSet(ORDER_KEY, {
      mode,
      where: zip ? zip.value : location_,
      date: pickedDate.toISOString(),
      note: noteOn.checked ? note.value.trim() : "",
      lines: Cart.lines(),
      total: Cart.subtotal() + shipping,
    });
    Cart.clear();
    location.href = "thanks.html";
  });
})();
