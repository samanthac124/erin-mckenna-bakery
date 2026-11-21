(function () {
  "use strict";
  const { PRODUCTS, CATEGORIES, Cart, esc, money, qs, param, productImage, stars, tagHTML, catnavHTML, promoHTML } = window.EMB;

  const catId = CATEGORIES.some((c) => c.id === param("c")) ? param("c") : "all";
  const cat = CATEGORIES.find((c) => c.id === catId);
  const items = Object.values(PRODUCTS).filter((p) => catId === "all" || p.category === catId);
  const root = qs("#category");
  const title = catId === "all" ? "All Treats" : cat.label;
  document.title = `${title} · Erin McKenna’s Bakery`;

  const smallCard = (p) => `
    <a class="card" href="product.html?id=${p.id}">
      ${productImage(p, "card", [10, 10, 148, 132, 5])}
      <h2 class="card__title">${esc(p.name)}</h2>
      <div class="card__stars">${stars("stars--sm")}</div>
      <p class="card__price">${money(p.price)}</p>
      <div class="card__tag">${tagHTML("tag-hl", "GLUTEN, DAIRY, NUT &amp; SOY FREE. VEGAN.")}</div>
    </a>`;

  const bigCard = (p) => `
    <article class="big-card">
      ${productImage(p, "big", [20, 20, 323, 200, 5])}
      <div class="big-card__body">
        <h2 class="big-card__title"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h2>
        <div class="big-card__meta">${stars()}<p class="big-card__price">${money(p.price)}</p></div>
        ${tagHTML("tag-lg big-card__tag", "GLUTEN FREE, DAIRY FREE, NUT FREE, SOY FREE &amp; VEGAN")}
        <p class="big-card__desc">${esc(p.blurb)}</p>
      </div>
      <a class="link-caps big-card__details" href="product.html?id=${p.id}">DETAILS</a>
      <button class="btn btn--dark" data-add="${p.id}">Add  to Cart</button>
    </article>`;

  let body;
  if (!items.length) {
    body = `<p class="empty-cat">Our ${esc(cat.label.toLowerCase())} are coming soon to this prototype.<br>
      <a class="link-caps" href="category.html?c=all">SEE ALL TREATS</a></p>`;
  } else if (catId === "all") {
    body = `<div class="card-grid">${items.map(smallCard).join("")}</div>`;
  } else {
    body = `<div class="big-list">${items.map(bigCard).join("")}</div>`;
  }

  root.innerHTML =
    catnavHTML(catId, catId === "all" ? "shadow" : "viewall") +
    `<div style="height:${catId === "all" ? 1 : 9}px"></div>` +
    promoHTML() +
    `<section class="cat-main${catId === "all" ? "" : " cat-main--big"}">
      <h1 class="title-box">${esc(title)}</h1>
      ${body}
    </section>`;

  // Keep the active tab in view on narrow tab rows.
  const active = qs('.cat-tab[aria-current="page"]');
  if (active) active.scrollIntoView({ inline: "nearest", block: "nearest" });

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    Cart.add(btn.dataset.add, 1);
    location.href = "cart.html";
  });
})();
