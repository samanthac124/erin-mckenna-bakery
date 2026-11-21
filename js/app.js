/* Shared data, cart store, layout chrome and helpers for the prototype. */
(function () {
  "use strict";

  const A = "assets/";

  // focus: [x0, y0, x1, y1] = fraction of the source image to frame (taken from the Figma crops)
  const PRODUCTS = {
    chocolate: {
      id: "chocolate",
      name: "Double Yummy Chocolate Cake",
      price: 100,
      category: "cakes",
      img: A + "cake-chocolate.png", w: 600, h: 900,
      focus: { card: [0.316, 0.399, 0.992, 0.796], big: [0, 0.4, 0.818, 0.781], hero: [0.02, 0.412, 0.99, 0.815] },
      blurb: "Our chocolate cake is rich and packed with the best chocolate chips in the world, so you know it’s gotta be good! Each cake serves 8-10 people.",
      about: "Our chocolate cake is rich and packed with the best chocolate chips in the world, so you know it’s gotta be good! Each cake is 6” and serves 8-10 people. The cake is shipped in ice packs and can be refrigerated one week.",
    },
    vanilla: {
      id: "vanilla",
      name: "Madagascar Vanilla Cake",
      price: 100,
      category: "cakes",
      img: A + "cake-vanilla.png", w: 925, h: 1465,
      focus: { card: [0.213, 0.527, 0.521, 0.738], big: [0.214, 0.508, 0.806, 0.812], hero: [0.12, 0.5, 0.88, 0.8] },
      blurb: "Our vanilla cake has no refined sugar, and it’s kosher, too!  Each delicious cake serves 8-10 people.",
      about: "Our vanilla cake has no refined sugar, and it’s kosher, too! Made with real Madagascar vanilla, each 6” cake serves 8-10 people. The cake is shipped in ice packs and can be refrigerated one week.",
    },
    confetti: {
      id: "confetti",
      name: "Confetti Cake",
      price: 100,
      category: "cakes",
      img: A + "cake-confetti.png", w: 720, h: 900,
      focus: { card: [0.021, 0.213, 0.941, 0.849], big: [0, 0.162, 0.972, 0.737], hero: [0, 0.2, 1, 0.75] },
      blurb: "Don’t be fooled by this demure-looking cake! It’s stuffed with sprinkles that will practically explode with excitement when you cut into it!",
      about: "Don’t be fooled by this demure-looking cake! It’s stuffed with sprinkles that will practically explode with excitement when you cut into it! Each 6” cake serves 8-10 people.",
    },
    cupcakes: {
      id: "cupcakes",
      name: "Fancy Pants Cupcakes",
      price: 100,
      category: "cupcakes",
      img: A + "cupcakes.png", w: 900, h: 668,
      focus: { card: [0.154, 0.062, 0.809, 1], big: [0.05, 0.05, 0.95, 1], hero: [0.02, 0.05, 0.98, 1] },
      blurb: "A dozen frosted cupcakes in our favorite party flavors, topped with sprinkles and made for sharing.",
      about: "A dozen frosted cupcakes in our favorite party flavors, topped with sprinkles and made for sharing. Shipped cold in ice packs and best enjoyed within one week.",
    },
  };

  const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "cakes", label: "Cakes" },
    { id: "cookies", label: "Cookies" },
    { id: "cupcakes", label: "Cupcakes" },
    { id: "donuts", label: "Donuts" },
    { id: "breads", label: "Breads" },
    { id: "mixes", label: "Mixes" },
    { id: "cookbooks", label: "Cookbooks", hidden: true },
    { id: "merch", label: "Merch", hidden: true },
  ];

  const LOCATIONS = ["Los Angeles, CA", "New York, NY", "Orlando, FL", "Santa Monica, CA"];

  /* ---------- Cart store (localStorage, per viewer) ---------- */
  const CART_KEY = "emb-cart";
  const ORDER_KEY = "emb-order";

  function safeGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* storage unavailable: cart lives for this page only */ }
  }

  let memCart = safeGet(CART_KEY, []).filter((l) => PRODUCTS[l.id] && l.qty > 0);

  const Cart = {
    lines() { return memCart.slice(); },
    count() { return memCart.reduce((n, l) => n + l.qty, 0); },
    subtotal() { return memCart.reduce((s, l) => s + PRODUCTS[l.id].price * l.qty, 0); },
    add(id, qty) {
      const line = memCart.find((l) => l.id === id);
      if (line) line.qty += qty; else memCart.push({ id, qty });
      this.save();
    },
    setQty(id, qty) {
      const line = memCart.find((l) => l.id === id);
      if (!line) return;
      line.qty = Math.max(1, qty);
      this.save();
    },
    remove(id) {
      memCart = memCart.filter((l) => l.id !== id);
      this.save();
    },
    clear() { memCart = []; this.save(); },
    save() {
      safeSet(CART_KEY, memCart);
      updateBadge();
    },
  };

  /* ---------- Helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + n;
  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const param = (name) => new URLSearchParams(location.search).get(name);

  /** Inline style that frames `focus` of a product image inside a W×H box (object-fit: cover with a focal rect). */
  function cropStyle(p, ctx, W, H) {
    const f = p.focus[ctx] || p.focus.card;
    const fw = (f[2] - f[0]) * p.w;
    const fh = (f[3] - f[1]) * p.h;
    const s = Math.max(W / fw, H / fh);
    const iw = p.w * s, ih = p.h * s;
    let left = W / 2 - ((f[0] + f[2]) / 2) * iw;
    let top = H / 2 - ((f[1] + f[3]) / 2) * ih;
    left = Math.min(0, Math.max(W - iw, left));
    top = Math.min(0, Math.max(H - ih, top));
    return `width:${iw.toFixed(1)}px;height:${ih.toFixed(1)}px;left:${left.toFixed(1)}px;top:${top.toFixed(1)}px`;
  }

  function productImage(p, ctx, box) {
    const [x, y, w, h, r] = box;
    return `<div class="crop" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${r != null ? `border-radius:${r}px;` : ""}">` +
      `<img src="${p.img}" alt="${esc(p.name)}" style="${cropStyle(p, ctx, w, h)}"></div>`;
  }

  function stars(cls, img) {
    return `<div class="stars ${cls || ""}" role="img" aria-label="Not yet rated">${`<img src="${A}${img || "icon-star.svg"}" alt="">`.repeat(5)}</div>`;
  }

  function tagHTML(cls, text) {
    return `<p class="${cls}"><span>${text}</span></p>`;
  }

  let toastTimer;
  function toast(msg) {
    let el = qs(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2600);
  }

  /* ---------- Chrome: header, drawer, footer, category nav ---------- */
  function headerHTML() {
    return `
      <div class="ship-banner">WE DELIVER NATIONWIDE</div>
      <nav class="topnav" aria-label="Main">
        <div class="topnav__inner">
          <button class="topnav__btn topnav__btn--menu" data-action="menu" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><img src="${A}icon-menu.svg" alt=""></button>
          <button class="topnav__btn topnav__btn--user" data-action="account" aria-label="Account"><img src="${A}icon-user.svg" alt=""></button>
          <a class="logo" href="index.html" aria-label="Erin McKenna’s Bakery home">Erin<br>McKenna’s<br>Bakery</a>
          <button class="topnav__btn topnav__btn--search" data-action="search" aria-label="Search"><img src="${A}icon-search.svg" alt=""></button>
          <a class="topnav__btn topnav__btn--cart" href="cart.html" aria-label="Cart"><img src="${A}icon-cart.svg" alt=""><span class="cart-badge" hidden></span></a>
        </div>
      </nav>`;
  }

  function drawerHTML() {
    const cats = CATEGORIES.filter((c) => !c.hidden)
      .map((c) => `<li><a href="category.html?c=${c.id}">${c.id === "all" ? "All treats" : c.label}</a></li>`).join("");
    const locs = LOCATIONS.map((l) => `<li><a href="pickup.html">${l}</a></li>`).join("");
    return `
      <div class="drawer-backdrop" data-action="close-menu"></div>
      <aside class="drawer" id="drawer" aria-label="Menu" aria-hidden="true">
        <button class="drawer__close" data-action="close-menu" aria-label="Close menu"><img src="${A}icon-x.svg" alt=""></button>
        <ul class="drawer__nav">
          <li class="drawer__item">
            <button class="drawer__row" aria-expanded="false" data-action="toggle-sub">BAKERY MENU <img src="${A}icon-chevron-down.svg" alt=""></button>
            <ul class="drawer__sub" hidden>${cats}</ul>
          </li>
          <li class="drawer__item"><a class="drawer__row" href="delivery.html">SHIPPING/DELIVERY</a></li>
          <li class="drawer__item"><a class="drawer__row" href="product.html?id=chocolate#ingredients">OUR INGREDIENTS</a></li>
          <li class="drawer__item">
            <button class="drawer__row" aria-expanded="false" data-action="toggle-sub">LOCATIONS <img src="${A}icon-chevron-down.svg" alt=""></button>
            <ul class="drawer__sub" hidden>${locs}</ul>
          </li>
          <li class="drawer__item"><a class="drawer__row" href="category.html?c=mixes">MIXES/COOKBOOKS</a></li>
        </ul>
        <div class="drawer__contact">
          <p>CONTACT</p>
          <a href="tel:+18554622225">855.GO.BABYCAKES</a>
          <a href="mailto:info@erinmckennasbakery.com">info@erinmckennasbakery.com</a>
        </div>
        <div class="drawer__actions">
          <button class="btn btn--dark" data-action="account">Sign In</button>
          <button class="btn btn--outline" data-action="account">Join Now</button>
        </div>
      </aside>`;
  }

  function footerHTML() {
    return `
      <footer class="site-footer">
        <ul class="col-1">
          <li><b>Delivery options</b></li>
          <li><a href="delivery.html">Ship nationwide</a></li>
          <li><a href="delivery.html">Same-day delivery</a></li>
          <li><a href="delivery.html">Local delivery</a></li>
          <li><b>Products</b></li>
          <li><a href="category.html?c=cakes">Custom cakes</a></li>
          <li><a href="category.html?c=cookbooks">Cookbooks</a></li>
          <li><a href="category.html?c=mixes">Mixes</a></li>
          <li><a href="category.html?c=merch">Clothing</a></li>
        </ul>
        <ul class="col-2">
          <li><a href="index.html">Our story</a></li>
          <li><b>Contact</b></li>
          <li><a href="pickup.html">Los Angeles Address</a></li>
          <li><a href="pickup.html">New York Address</a></li>
          <li><a href="pickup.html">Orlando Address</a></li>
          <li><a href="pickup.html">Santa Monica Address</a></li>
        </ul>
        <div class="socials">
          <a href="#" aria-label="Instagram"><img src="${A}social-instagram.svg" alt=""></a>
          <a href="#" aria-label="Facebook"><img src="${A}social-facebook.svg" alt=""></a>
          <a href="#" aria-label="Pinterest"><img src="${A}social-pinterest.svg" alt=""></a>
          <a href="mailto:info@erinmckennasbakery.com" aria-label="Email"><img src="${A}social-mail.svg" alt=""></a>
        </div>
      </footer>`;
  }

  /** Category tabs. variant: "shadow" (All page) or "viewall" (category + product pages). */
  function catnavHTML(active, variant) {
    const tabs = CATEGORIES.filter((c) => !c.hidden && (variant === "shadow" || c.id !== "all"))
      .map((c) => `<a class="cat-tab" href="category.html?c=${c.id}"${c.id === active ? ' aria-current="page"' : ""}>${c.label}</a>`).join("");
    return `<nav class="catnav catnav--${variant}" aria-label="Categories"><div class="cat-tabs">${tabs}</div>` +
      (variant === "viewall" ? `<a class="view-all" href="category.html?c=all">View All</a>` : "") + `</nav>`;
  }

  function promoHTML() {
    const t = "ALL GLUTEN FREE &amp; VEGAN &amp; NUT FREE &amp; SOY FREE!";
    return `<div class="promo" role="note"><div class="promo__track"><span>${t}</span><span aria-hidden="true">${t}</span></div></div>`;
  }

  function updateBadge() {
    const b = qs(".cart-badge");
    if (!b) return;
    const n = Cart.count();
    b.textContent = n;
    b.hidden = n === 0;
  }

  /** viaKeyboard: move focus into / back out of the menu (skipped for mouse and touch so no focus ring flashes). */
  function setMenu(open, viaKeyboard) {
    document.body.classList.toggle("drawer-open", open);
    document.documentElement.classList.toggle("no-scroll", open);
    const btn = qs('[data-action="menu"]');
    const drawer = qs("#drawer");
    if (btn) btn.setAttribute("aria-expanded", String(open));
    if (drawer) drawer.setAttribute("aria-hidden", String(!open));
    if (!viaKeyboard) return;
    if (open) qs(".drawer__close").focus();
    else if (btn) btn.focus();
  }

  function mountChrome() {
    const head = qs("#site-header");
    if (head) head.innerHTML = headerHTML();
    const foot = qs("#site-footer");
    if (foot) foot.outerHTML = footerHTML();
    const page = qs(".page");
    if (page) page.insertAdjacentHTML("beforeend",
      `<p class="concept-note">Concept prototype for a UX case study — not affiliated with Erin McKenna’s Bakery. No orders are placed.</p>`);
    document.body.insertAdjacentHTML("beforeend", drawerHTML());
    updateBadge();

    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-action]");
      if (!el) return;
      const a = el.dataset.action;
      const kb = e.detail === 0; // keyboard-triggered clicks report detail 0
      if (a === "menu") setMenu(true, kb);
      else if (a === "close-menu") setMenu(false, kb);
      else if (a === "toggle-sub") {
        const open = el.getAttribute("aria-expanded") !== "true";
        el.setAttribute("aria-expanded", String(open));
        el.nextElementSibling.hidden = !open;
      } else if (a === "account") toast("Accounts aren’t part of this prototype.");
      else if (a === "search") toast("Search isn’t part of this prototype — try the menu.");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("drawer-open")) setMenu(false, true);
    });
  }

  /* Scale the 390px design down on narrower phones. */
  function fitWidth() {
    const w = document.documentElement.clientWidth;
    document.body.style.zoom = w < 390 ? String(w / 390) : "";
  }

  window.EMB = { PRODUCTS, CATEGORIES, LOCATIONS, Cart, ORDER_KEY, safeGet, safeSet, esc, money, qs, qsa, param, cropStyle, productImage, stars, tagHTML, toast, catnavHTML, promoHTML };

  fitWidth();
  window.addEventListener("resize", fitWidth);
  mountChrome();
})();
