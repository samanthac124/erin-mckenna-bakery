(function () {
  "use strict";
  const { PRODUCTS, Cart, esc, money, qs, qsa, param, productImage, stars, tagHTML, toast, catnavHTML } = window.EMB;
  const A = "assets/";

  const p = PRODUCTS[param("id")] || PRODUCTS.chocolate;
  const isFood = p.food !== false;
  document.title = `${p.name} · Erin McKenna’s Bakery`;

  const INGREDIENTS = "Vegan Organic Sugar, Brown Rice Flour (Whole Grain Brown Rice), Garbanzo Fava Bean Flour, Potato Starch, Non-gmo Canola Oil, Pear Or Applesauce, Arrowroot Starch, Organic Vanilla Extract, Baking Powder (Sodium, Acid Pyrophosphate, Sodium Bicarbonate, Corn Starch, Monocalcium Phosphate), Kosher Salt, Xanthan Gum, Baking Soda (Sodium Bicarbonate)";

  // Tabs give a short summary and point to the full section further down the page.
  const TABS = {
    about: esc(p.about),
    ingredients: isFood
      ? `Made without gluten, dairy, eggs, nuts or soy, in a dedicated allergen-free kitchen. <a class="link-inline" href="#ingredients">See all ingredients</a>`
      : `${esc(p.details)} <a class="link-inline" href="#ingredients">More details</a>`,
    delivery: `We ship nationwide in insulated boxes${isFood ? " with ice packs, so your treats arrive cold and fresh" : ""}. Local delivery and pickup are available in select cities. <a class="link-inline" href="#delivery-info">See delivery details</a>`,
  };

  const CAKE_REVIEWS = [
    { rating: 5, title: "It was awesome. I totally would buy it again.",
      short: "The gift recipient (my vegan daughter) LOVED her gift. She, and even her non vegan friends thought the cake ...",
      full: "The gift recipient (my vegan daughter) LOVED her gift. She, and even her non vegan friends thought the cake was delicious." },
    { rating: 5, title: "We loved it. Truly a special treat.",
      short: "The cake was everything they said it would be. It was great to be able to enjoy tasty treats without worrying ...",
      full: "The cake was everything they said it would be. It was great to be able to enjoy tasty treats without worrying about allergies." },
    { rating: 4, title: "Did not taste vegan - in a good way",
      full: "Made my vegan gluten free, soy free daughter very happy for her anniversary. Extras were nice too." },
  ];
  const OTHER_REVIEWS = [
    { rating: 5, title: "My whole family could enjoy it.",
      short: "Finding treats that work for all of our allergies is so hard. This arrived quickly, well packed, and every one of us ...",
      full: "Finding treats that work for all of our allergies is so hard. This arrived quickly, well packed, and every one of us loved it." },
    { rating: 5, title: "Already ordered again.",
      short: "I was nervous ordering online, but it was exactly as pictured and the customer service team answered all my questions ...",
      full: "I was nervous ordering online, but it was exactly as pictured and the customer service team answered all my questions within a day." },
    { rating: 4, title: "A lovely gift.",
      full: "Sent this to a friend with celiac disease and she was thrilled. Would love more flavors!" },
  ];
  const REVIEWS = (p.category === "cakes" ? CAKE_REVIEWS : OTHER_REVIEWS).map((r, i) => ({ ...r, top: 257 + i * 137, date: "2/2/2022" }));

  const ALLERGENS = [
    { label: "Gluten Free", img: "icon-gluten-free.png", w: 47.917, crop: "width:150.21%;height:149.25%;left:-25.11%;top:-9.81%" },
    { label: "Celiac Safe", img: "icon-celiac-safe.png", crop: "width:164.71%;height:164.71%;left:-32.24%;top:-15.76%" },
    { label: "Vegan", img: "icon-vegan.png", crop: "width:123.02%;height:123.02%;left:-11.6%;top:0.88%" },
    { label: "Soy Free", img: "icon-soy-free.png", crop: "width:133.84%;height:133.59%;left:-17.02%;top:-3.44%" },
    { label: "Dairy Free", img: "icon-dairy-free.png", crop: "width:150.21%;height:149.89%;left:-25.11%;top:-9.85%" },
    { label: "Nut Free", img: "icon-nut-free.png", w: 52.083, flip: true, crop: "width:149.89%;height:150.86%;left:-25.05%;top:-10.56%" },
  ];

  const M = 24; // page side margin

  const review = (r, i) => `
    <div class="abs" style="left:${M}px;top:${r.top}px">${stars(r.rating)}</div>
    <h3 class="abs review-title" style="left:${M}px;top:${r.top + 30}px">${esc(r.title)}</h3>
    <div class="abs review-body" style="left:${M}px;top:${r.top + 56}px;width:296px">
      ${r.short
        ? `<p data-review="${i}">${esc(r.short)}</p><button type="button" data-more="${i}" aria-expanded="false" aria-label="Read more: ${esc(r.title)}">Read more</button>`
        : `<p>${esc(r.full)}</p>`}
    </div>
    <p class="abs review-date" style="right:${M}px;top:${r.top + 94}px">${r.date}</p>`;

  const allergen = (a) => `
    <li class="allergen">
      <div class="crop" style="width:${a.w || 50}px;${a.flip ? "transform:scaleY(-1);" : ""}"><img src="${A}${a.img}" alt="" style="${a.crop}"></div>
      <span style="margin-left:${a.w ? 50 - a.w : 0}px">${a.label}</span>
    </li>`;

  const root = qs("#product");
  const qs1 = (s) => qs(s, root);

  root.innerHTML = `
    ${catnavHTML(p.category, "viewall")}
    <div class="pdp">
      <section class="pdp-card" aria-labelledby="pdp-title">
        ${productImage(p, "hero", [0, 15, 340, 215])}
        <img class="abs" src="${A}line.svg" alt="" style="left:20px;top:243px;width:76px;height:2px">
        <h1 class="abs pdp-title" id="pdp-title" style="left:20px;top:273px">${esc(p.name)}</h1>
        <div class="abs" style="left:20px;top:302px">${stars(p.rating)}</div>
        <a class="abs pdp-reviews-link" href="#reviews" style="left:134px;top:304px">${p.reviews} Reviews</a>
        ${isFood ? `<div class="abs" style="left:20px;top:332px;width:230px">${tagHTML("tag-lg", "GLUTEN FREE, DAIRY FREE, NUT FREE, SOY FREE &amp; VEGAN")}</div>` : ""}
        <p class="abs pdp-price" style="right:20px;top:332px">${money(p.price)}</p>

        <div class="pdp-tabs" role="tablist" aria-label="Product information">
          <button class="pdp-tab" role="tab" id="tab-about" aria-selected="true" aria-controls="pdp-panel" data-tab="about">About</button>
          <button class="pdp-tab" role="tab" id="tab-ingredients" aria-selected="false" aria-controls="pdp-panel" data-tab="ingredients" tabindex="-1">${isFood ? "Ingredients" : "Details"}</button>
          <button class="pdp-tab" role="tab" id="tab-delivery" aria-selected="false" aria-controls="pdp-panel" data-tab="delivery" tabindex="-1">Delivery</button>
        </div>
        <div class="pdp-panel" id="pdp-panel" role="tabpanel" aria-labelledby="tab-about"><p>${TABS.about}</p></div>

        <div class="qty" style="left:20px;top:585px">
          <button type="button" data-step="-1" aria-label="Decrease quantity"><img src="${A}icon-minus.svg" alt=""></button>
          <output id="qty" aria-live="polite">1</output>
          <button type="button" data-step="1" aria-label="Increase quantity"><img src="${A}icon-plus.svg" alt=""></button>
        </div>
        <button class="btn btn--dark abs" id="add-to-cart" style="right:20px;top:582px;width:210px">Add to Cart</button>
      </section>

      <div class="pdp-details">
        <h2 class="abs center-x section-title" id="reviews" style="top:40px">Reviews</h2>
        <div class="abs center-x" style="left:110px;top:89px">${stars(p.rating)}</div>
        <p class="abs center-x stat-number" style="left:280px;top:88px">${p.reviews}</p>
        <p class="abs center-x stat-label" style="left:110px;top:118px">AVERAGE ${p.rating} / 5</p>
        <p class="abs center-x stat-label" style="left:280px;top:118px">TOTAL REVIEWS</p>
        <button class="btn btn--outline abs" id="write-review" style="left:${M}px;top:167px;width:342px">Write a Review</button>
        ${REVIEWS.map(review).join("")}
        <button type="button" class="abs center-x link-caps" style="top:659px" data-toast="Only the 3 most recent reviews are part of this prototype.">MORE REVIEWS</button>

        <div class="abs details-flow" id="details-flow" style="left:${M}px;top:738px;width:342px">
          <h2 class="section-title" id="ingredients">${isFood ? "Ingredients" : "Details"}</h2>
          ${isFood ? `
          <ul class="allergen-grid">${ALLERGENS.map(allergen).join("")}</ul>
          <label class="input-label" for="ing-search" style="display:block;margin-top:32px">Search ingredients</label>
          <div class="search-wrap">
            <input class="field" id="ing-search" type="search" autocomplete="off" aria-describedby="ing-text">
            <img src="${A}icon-search-sm.svg" alt="">
          </div>
          <p class="ingredients-text" id="ing-text">${INGREDIENTS}</p>
          <p class="center" style="margin-top:16px"><button type="button" class="link-caps" data-toast="All of our treats are made in a dedicated allergen-free kitchen.">MORE ABOUT INGREDIENTS</button></p>`
          : `<p class="details-text">${esc(p.details)}</p>`}

          <h2 class="section-title" id="delivery-info" style="margin-top:53px">Delivery</h2>
          <ul class="delivery-list">
            <li><span class="icon-badge"><img src="${A}icon-bag.svg" alt=""></span><div><h3>Choose</h3><p>Select your favorite treat and add a gift note or cake writing.</p></div></li>
            <li><span class="icon-badge"><img src="${A}icon-truck.svg" alt=""></span><div><h3>Schedule</h3><p>Pick a day for fresh delivery or local pickup.</p></div></li>
            <li><span class="icon-badge"><img src="${A}icon-cart-lg.svg" alt=""></span><div><h3>Enjoy</h3><p>We ship nationwide, packed cold so your treats arrive fresh.</p></div></li>
          </ul>
          <form id="loc-form" style="margin-top:36px" novalidate>
            <label class="input-label" for="loc">Check location</label>
            <input class="field" id="loc" style="margin-top:10px;height:44px;padding-left:18px" placeholder="Enter ZIP or city and state" autocomplete="postal-code" aria-describedby="loc-msg">
            <p class="loc-msg" id="loc-msg" role="status"></p>
          </form>
          <p class="center" style="margin-top:31px"><a class="link-caps" href="index.html#delivery">MORE ABOUT DELIVERY</a></p>
        </div>
      </div>
    </div>`;

  /* The lower sections flow naturally, so size the details area to fit them (46px below, as in the design). */
  const flow = qs1("#details-flow");
  const fitDetails = () => { flow.parentElement.style.height = flow.offsetTop + flow.offsetHeight + 46 + "px"; };
  fitDetails();
  if (document.fonts) document.fonts.ready.then(fitDetails);

  /* Tabs */
  const tabs = qsa(".pdp-tab", root);
  const panel = qs1("#pdp-panel");
  function selectTab(btn) {
    tabs.forEach((t) => {
      const on = t === btn;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panel.innerHTML = `<p>${TABS[btn.dataset.tab]}</p>`;
    panel.setAttribute("aria-labelledby", btn.id);
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });

  /* Quantity, reviews */
  let qty = 1;
  const out = qs1("#qty");
  root.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (step) {
      const next = qty + Number(step.dataset.step);
      if (next > 20) { toast("For orders over 20, please call the bakery."); return; }
      qty = Math.max(1, next);
      out.textContent = qty;
      return;
    }
    const more = e.target.closest("[data-more]");
    if (more) {
      const r = REVIEWS[more.dataset.more];
      const open = more.getAttribute("aria-expanded") !== "true";
      qs1(`[data-review="${more.dataset.more}"]`).textContent = open ? r.full : r.short;
      more.textContent = open ? "Read less" : "Read more";
      more.setAttribute("aria-label", `${open ? "Read less" : "Read more"}: ${r.title}`);
      more.setAttribute("aria-expanded", String(open));
    }
  });

  // Adding keeps you on the page; the message links to the cart.
  qs1("#add-to-cart").addEventListener("click", () => {
    Cart.add(p.id, qty);
    toast(`Added ${qty} × ${p.name}.`, { label: "View cart", href: "cart.html" });
  });
  qs1("#write-review").addEventListener("click", () => toast("Writing reviews isn’t part of this prototype."));

  /* Ingredient search: highlight matches */
  const search = qs1("#ing-search");
  if (search) {
    const ingText = qs1("#ing-text");
    let missTimer;
    search.addEventListener("input", () => {
      const term = search.value.trim();
      clearTimeout(missTimer);
      if (!term) { ingText.textContent = INGREDIENTS; return; }
      const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      ingText.innerHTML = esc(INGREDIENTS).replace(re, (m) => `<mark>${m}</mark>`);
      if (!re.test(INGREDIENTS) && term.length >= 3) missTimer = setTimeout(() => toast(`No “${term}” in this recipe.`), 600);
    });
  }

  /* Delivery location check: a 5-digit ZIP or "City, ST" */
  const locMsg = qs1("#loc-msg");
  qs1("#loc-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = qs1("#loc");
    const v = input.value.trim();
    const ok = /^\d{5}$/.test(v) || /^[A-Za-z][A-Za-z .'-]+,\s*[A-Za-z]{2}$/.test(v);
    input.classList.toggle("is-invalid", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    locMsg.classList.toggle("is-error", !ok);
    locMsg.textContent = ok
      ? `Good news — we deliver to ${v}.`
      : "Enter a 5-digit ZIP or a city and state, like Orlando, FL.";
    fitDetails();
  });

  if (location.hash) { const t = qs1(location.hash); if (t) t.scrollIntoView(); }
})();
