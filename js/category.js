(function () {
  "use strict";
  const { PRODUCTS, CATEGORIES, Cart, esc, money, qs, param, productImage, stars, tagHTML, toast, playWhileVisible, catnavHTML, promoHTML } = window.EMB;

  const catId = CATEGORIES.some((c) => c.id === param("c")) ? param("c") : "all";
  const cat = CATEGORIES.find((c) => c.id === catId);
  const items = Object.values(PRODUCTS).filter((p) => catId === "all" || p.category === catId);
  const root = qs("#category");
  const title = catId === "all" ? "All Treats" : cat.label;
  document.title = `${title} · Erin McKenna’s Bakery`;

  // The grid uses the short allergen tag on purpose: the full wording doesn't fit the narrow cards.
  const smallCard = (p) => `
    <a class="card" href="product.html?id=${p.id}">
      ${productImage(p, "card", [10, 10, 139, 132, 5])}
      <h2 class="card__title">${esc(p.name)}</h2>
      <div class="card__stars">${stars(p.rating, "stars--sm")}</div>
      <p class="card__price">${money(p.price)}</p>
      ${p.food !== false ? `<div class="card__tag">${tagHTML("tag-hl", "GLUTEN, DAIRY, NUT &amp; SOY FREE. VEGAN.")}</div>` : ""}
    </a>`;

  const bigCard = (p) => `
    <article class="big-card">
      ${productImage(p, "big", [20, 20, 300, 200, 5])}
      <div class="big-card__body">
        <h2 class="big-card__title"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h2>
        <div class="big-card__meta">${stars(p.rating)}<p class="big-card__price">${money(p.price)}</p></div>
        ${p.food !== false ? tagHTML("tag-lg big-card__tag", "GLUTEN FREE, DAIRY FREE, NUT FREE, SOY FREE &amp; VEGAN") : ""}
        <p class="big-card__desc">${esc(p.blurb)}</p>
      </div>
      <a class="link-caps big-card__details" href="product.html?id=${p.id}" aria-label="Details: ${esc(p.name)}">DETAILS</a>
      <button class="btn btn--dark" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">Add to Cart</button>
    </article>`;

  const body = catId === "all"
    ? `<div class="card-grid">${items.map(smallCard).join("")}</div>`
    : `<div class="big-list">${items.map(bigCard).join("")}</div>`;

  root.innerHTML =
    catnavHTML(catId, catId === "all" ? "shadow" : "viewall") +
    `<div style="height:${catId === "all" ? 1 : 9}px"></div>` +
    promoHTML() +
    `<section class="cat-main${catId === "all" ? "" : " cat-main--big"}">
      <h1 class="title-box">${esc(title)}</h1>
      ${body}
    </section>`;

  // Gold banner scrolls for 5 seconds once on screen, then glides back to the start of the message.
  const promo = qs(".promo");
  const track = qs(".promo__track");
  playWhileVisible(promo, 5000, () => {
    const x = new DOMMatrix(getComputedStyle(track).transform).m41;
    track.style.animation = "none";
    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      track.style.transition = "transform .8s ease";
      track.style.transform = "translateX(0)";
    }));
  });

  // Keep the active tab in view on narrow tab rows.
  const active = qs('.cat-tab[aria-current="page"]');
  if (active) active.scrollIntoView({ inline: "nearest", block: "nearest" });

  // Adding keeps you on the page; the message links to the cart.
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const p = PRODUCTS[btn.dataset.add];
    Cart.add(p.id, 1);
    toast(`Added ${p.name}.`, { label: "View cart", href: "cart.html" });
  });
})();
