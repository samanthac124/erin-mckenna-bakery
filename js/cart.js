(function () {
  "use strict";
  const { PRODUCTS, Cart, esc, money, qs, productImage } = window.EMB;
  const A = "assets/";
  const root = qs("#cart");

  // Order box: 24px page margin, 20px inner padding; text column starts 20px right of the picture.
  const line = (l) => {
    const p = PRODUCTS[l.id];
    return `
      <li class="order-item">
        <button class="order-item__remove" data-remove="${p.id}" aria-label="Remove ${esc(p.name)}"><img src="${A}icon-x.svg" alt=""></button>
        ${productImage(p, "card", [20, 25, 125, 122, 5])}
        <a class="order-item__name" href="product.html?id=${p.id}">${esc(p.name)}</a>
        <p class="order-item__price">${money(p.price * l.qty)}</p>
        <div class="order-item__qty">
          <button data-qty="${p.id}" data-step="-1" aria-label="Decrease quantity of ${esc(p.name)}"${l.qty <= 1 ? " disabled" : ""}><img src="${A}icon-minus-sm.svg" alt=""></button>
          <output aria-live="polite" aria-label="Quantity">${l.qty}</output>
          <button data-qty="${p.id}" data-step="1" aria-label="Increase quantity of ${esc(p.name)}"><img src="${A}icon-plus-sm.svg" alt=""></button>
        </div>
      </li>`;
  };

  function render() {
    const lines = Cart.lines();
    const empty = lines.length === 0;
    root.innerHTML = `
      <h1 class="order-title">MY ORDER</h1>
      ${empty
        ? `<p class="cart-empty">Your cart is empty.</p>`
        : `<div class="order-heads" aria-hidden="true"><span style="left:24px">Product</span><span style="left:190px">Price</span></div>
           <ul class="order-items">${lines.map(line).join("")}</ul>
           <div class="totals totals--cart"><div><span>Subtotal</span><span>${money(Cart.subtotal())}</span></div></div>`}
      <p class="center" style="margin-top:39px"><a class="link-caps link-caps--wide" href="category.html?c=all">KEEP SHOPPING</a></p>
      ${empty ? "" : `
      <p class="center" style="margin-top:43px;font:400 12px/22px var(--f-body);letter-spacing:-0.24px">Pickup available in select cities only</p>
      <a class="btn btn--dark btn--cta" href="delivery.html" style="margin-top:14px">DELIVERY</a>
      <a class="btn btn--outline btn--cta" href="pickup.html" style="margin-top:22px">PICKUP</a>`}`;
  }

  root.addEventListener("click", (e) => {
    const rm = e.target.closest("[data-remove]");
    if (rm) { Cart.remove(rm.dataset.remove); render(); return; }
    const q = e.target.closest("[data-qty]");
    if (q) {
      const l = Cart.lines().find((x) => x.id === q.dataset.qty);
      Cart.setQty(l.id, l.qty + Number(q.dataset.step));
      render();
      const again = root.querySelector(`[data-qty="${l.id}"][data-step="${q.dataset.step}"]`);
      if (again && !again.disabled) again.focus();
    }
  });

  render();
})();
