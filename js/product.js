(function () {
  "use strict";
  const { PRODUCTS, Cart, esc, money, qs, qsa, param, productImage, stars, tagHTML, toast, catnavHTML } = window.EMB;
  const A = "assets/";

  const p = PRODUCTS[param("id")] || PRODUCTS.chocolate;
  document.title = `${p.name} · Erin McKenna’s Bakery`;

  const INGREDIENTS = "Vegan Organic Sugar, Brown Rice Flour (Whole Grain Brown Rice), Garbanzo Fava Bean Flour, Potato Starch, Non-gmo Canola Oil, Pear Or Applesauce, Arrowroot Starch, Organic Vanilla Extract, Baking Powder (Sodium, Acid Pyrophosphate, Sodium Bicarbonate, Corn Starch, Monocalcium Phosphate), Kosher Salt, Xanthan Gum, Baking Soda (Sodium Bicarbonate)";

  const TABS = {
    about: p.about,
    ingredients: "Made without gluten, dairy, eggs, nuts or soy, in a dedicated allergen-free kitchen. Sweetened with vegan organic sugar. See the full ingredient list below.",
    delivery: "We ship nationwide in insulated boxes with ice packs, so your treats arrive cold and fresh. Local delivery and pickup are available in select cities.",
  };

  const REVIEWS = [
    { top: 257, title: "It was awesome. I totally would buy it again. ", date: "2/2/2022",
      short: "The gift recipient (my vegan daughter) LOVED her gift. She, and even her non vegan friends thought the cake ...",
      full: "The gift recipient (my vegan daughter) LOVED her gift. She, and even her non vegan friends thought the cake was delicious." },
    { top: 394, title: "We loved it. Truly a special treat.", date: "2/2/2022",
      short: "The cake was everything they said it would be. It was great to be able to enjoy tasty treats without worrying  ...",
      full: "The cake was everything they said it would be. It was great to be able to enjoy tasty treats without worrying about allergies." },
    { top: 531, title: "Did not taste vegan - in a good way", date: "2/2/2022",
      full: "Made my vegan gluten free, soy free daughter very happy for her anniversary. Extras were nice too." },
  ];

  const ALLERGENS = [
    { x: 16, top: 792, label: "Gluten Free", img: "icon-gluten-free.png", w: 47.917, crop: "width:150.21%;height:149.25%;left:-25.11%;top:-9.81%" },
    { x: 208, top: 792, label: "Celiac Safe", img: "icon-celiac-safe.png", crop: "width:164.71%;height:164.71%;left:-32.24%;top:-15.76%" },
    { x: 16, top: 851, label: "Vegan", img: "icon-vegan.png", crop: "width:123.02%;height:123.02%;left:-11.6%;top:0.88%" },
    { x: 208, top: 851, label: "Soy Free", img: "icon-soy-free.png", crop: "width:133.84%;height:133.59%;left:-17.02%;top:-3.44%" },
    { x: 16, top: 910, label: "Dairy Free", img: "icon-dairy-free.png", crop: "width:150.21%;height:149.89%;left:-25.11%;top:-9.85%" },
    { x: 208, top: 910, label: "Nut Free", img: "icon-nut-free.png", w: 52.083, flip: true, crop: "width:149.89%;height:150.86%;left:-25.05%;top:-10.56%" },
  ];

  const review = (r, i) => `
    <div class="abs" style="left:16px;top:${r.top}px">${stars("", "icon-star-alt.svg")}</div>
    <h3 class="abs review-title" style="left:16px;top:${r.top + 30}px">${esc(r.title)}</h3>
    <div class="abs review-body" style="left:16px;top:${r.top + 56}px;width:300px">
      ${r.short
        ? `<p data-review="${i}">${esc(r.short)}</p><button type="button" data-more="${i}" aria-expanded="false">Read more</button>`
        : `<p>${esc(r.full)}</p>`}
    </div>
    <p class="abs review-date" style="right:16px;top:${r.top + 94}px">${r.date}</p>`;

  const allergen = (a) => `
    <div class="allergen" style="left:${a.x}px;top:${a.top}px">
      <div class="crop" style="width:${a.w || 50}px;${a.flip ? "transform:scaleY(-1);" : ""}"><img src="${A}${a.img}" alt="" style="${a.crop}"></div>
      <span style="margin-left:${a.w ? 50 - a.w : 0}px">${a.label}</span>
    </div>`;

  const qs1 = (s) => qs(s, root);
  const root = qs("#product");

  root.innerHTML = `
    ${catnavHTML(p.category, "viewall")}
    <div class="pdp">
      <section class="pdp-card" aria-labelledby="pdp-title">
        ${productImage(p, "hero", [0, 15, 363, 215])}
        <img class="abs" src="${A}line.svg" alt="" style="left:22px;top:243px;width:76px;height:2px">
        <h1 class="abs pdp-title" id="pdp-title" style="left:22px;top:273px">${esc(p.name)}</h1>
        <div class="abs" style="left:22px;top:302px">${stars()}</div>
        <a class="abs pdp-reviews-link" href="#reviews" style="left:136px;top:304px">50 Reviews</a>
        <div class="abs" style="left:22px;top:332px;width:230px">${tagHTML("tag-lg", "GLUTEN FREE, DAIRY FREE, NUT FREE, SOY FREE &amp; VEGAN")}</div>
        <p class="abs pdp-price" style="right:22px;top:332px">${money(p.price)}</p>

        <div class="pdp-tabs" role="tablist" aria-label="Product information">
          <button class="pdp-tab" role="tab" id="tab-about" aria-selected="true" aria-controls="pdp-panel" data-tab="about">About</button>
          <button class="pdp-tab" role="tab" id="tab-ingredients" aria-selected="false" aria-controls="pdp-panel" data-tab="ingredients" tabindex="-1">Ingredients</button>
          <button class="pdp-tab" role="tab" id="tab-delivery" aria-selected="false" aria-controls="pdp-panel" data-tab="delivery" tabindex="-1">Delivery</button>
        </div>
        <p class="pdp-panel" id="pdp-panel" role="tabpanel" aria-labelledby="tab-about">${esc(TABS.about)}</p>

        <div class="qty" style="left:22px;top:585px">
          <button type="button" data-step="-1" aria-label="Decrease quantity"><img src="${A}icon-minus.svg" alt=""></button>
          <output id="qty" aria-live="polite">1</output>
          <button type="button" data-step="1" aria-label="Increase quantity"><img src="${A}icon-plus.svg" alt=""></button>
        </div>
        <button class="btn btn--dark abs" id="add-to-cart" style="right:22px;top:580px;width:223px;height:60px">Add  to Cart</button>
      </section>

      <div class="pdp-details">
        <h2 class="abs center-x script-title" id="reviews" style="top:40px">Reviews</h2>
        <div class="abs" style="left:49px;top:89px">${stars("", "icon-star-alt.svg")}</div>
        <p class="abs center-x" style="left:290px;top:88px;font:700 20px/22px var(--f-ui)">50</p>
        <p class="abs center-x stat-label" style="left:99px;top:118px">AVERAGE RATING</p>
        <p class="abs center-x stat-label" style="left:290px;top:118px">TOTAL REVIEWS</p>
        <button class="btn btn--outline abs" id="write-review" style="left:31px;top:167px;width:328px;height:50px">Write a Review</button>
        ${REVIEWS.map(review).join("")}
        <a class="abs center-x link-caps" style="top:659px" href="#reviews" data-toast="Showing the 3 most recent reviews in this prototype.">MORE REVIEWS</a>

        <h2 class="abs center-x script-title" id="ingredients" style="top:738px">Ingredients</h2>
        ${ALLERGENS.map(allergen).join("")}
        <label class="abs input-label" for="ing-search" style="left:16px;top:992px">Search ingredients</label>
        <div class="search-wrap" style="left:16px;top:1019px;width:359px;height:44px">
          <input class="field" id="ing-search" type="search" autocomplete="off" aria-describedby="ing-text">
          <img src="${A}icon-search-sm.svg" alt="">
        </div>
        <p class="abs ingredients-text" id="ing-text" style="left:52px;top:1085px;width:287px">${INGREDIENTS}</p>
        <a class="abs center-x link-caps" style="top:1299px" href="#ingredients" data-toast="All of our treats are made in a dedicated allergen-free kitchen.">MORE ABOUT INGREDIENTS</a>

        <h2 class="abs center-x script-title" style="top:1374px">Delivery</h2>
        <div class="abs delivery-block" id="delivery-block" style="left:16px;top:1428px;width:359px">
          <ul class="delivery-list">
            <li><span class="icon-badge"><img src="${A}icon-bag.svg" alt=""></span><div><h3>Choose</h3><p>Select your favorite treat and add a gift note or cake writing.</p></div></li>
            <li><span class="icon-badge"><img src="${A}icon-truck.svg" alt=""></span><div><h3>Schedule</h3><p>Pick a day and time for fresh delivery or local pickup.</p></div></li>
            <li><span class="icon-badge"><img src="${A}icon-cart-lg.svg" alt=""></span><div><h3>Enjoy</h3><p>We ship nationwide, packed cold so your treats arrive fresh.</p></div></li>
          </ul>
          <form id="loc-form" style="margin-top:36px" novalidate>
            <label class="input-label" for="loc">Check location</label>
            <input class="field" id="loc" style="margin-top:10px;height:35px;padding-left:18px" placeholder="Enter ZIP or city and state" autocomplete="postal-code">
          </form>
          <p style="margin-top:39px;text-align:center"><a class="link-caps" href="delivery.html">MORE ABOUT DELIVERY</a></p>
        </div>
      </div>
    </div>`;

  /* The delivery list flows naturally, so size the details area to fit it (46px below, as in the design). */
  const block = qs1("#delivery-block");
  const fitDetails = () => { block.parentElement.style.height = block.offsetTop + block.offsetHeight + 46 + "px"; };
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
    panel.textContent = TABS[btn.dataset.tab];
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

  /* Quantity + add to cart */
  let qty = 1;
  const out = qs1("#qty");
  root.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (step) {
      qty = Math.min(20, Math.max(1, qty + Number(step.dataset.step)));
      out.textContent = qty;
      return;
    }
    const more = e.target.closest("[data-more]");
    if (more) {
      const i = more.dataset.more;
      const open = more.getAttribute("aria-expanded") !== "true";
      qs1(`[data-review="${i}"]`).textContent = open ? REVIEWS[i].full : REVIEWS[i].short;
      more.textContent = open ? "Read less" : "Read more";
      more.setAttribute("aria-expanded", String(open));
      return;
    }
    const t = e.target.closest("[data-toast]");
    if (t) toast(t.dataset.toast);
  });

  qs1("#add-to-cart").addEventListener("click", () => {
    Cart.add(p.id, qty);
    location.href = "cart.html";
  });
  qs1("#write-review").addEventListener("click", () => toast("Writing reviews isn’t part of this prototype."));

  /* Ingredient search: highlight matches */
  const ingText = qs1("#ing-text");
  qs1("#ing-search").addEventListener("input", (e) => {
    const term = e.target.value.trim();
    if (!term) { ingText.textContent = INGREDIENTS; return; }
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const hits = INGREDIENTS.match(re);
    ingText.innerHTML = esc(INGREDIENTS).replace(re, (m) => `<mark>${m}</mark>`);
    if (!hits) toast(`No “${term}” in this recipe.`);
  });

  /* Delivery location check */
  qs1("#loc-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = qs1("#loc").value.trim();
    if (!v) { toast("Enter a ZIP code or city and state."); return; }
    toast(`Good news — we deliver to ${v}!`);
  });

  if (location.hash === "#ingredients") qs1("#ingredients").scrollIntoView();
})();
