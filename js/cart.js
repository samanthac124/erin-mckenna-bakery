(function () {
  "use strict";
  const { PRODUCTS, Cart, esc, money, qs, productImage } = window.EMB;
  const A = "assets/";
  const root = qs("#cart");

  const line = (l) => {
    const p = PRODUCTS[l.id];
    return `
      <li class="order-item">
        <button class="order-item__remove" data-remove="${p.id}" aria-label="Remove ${esc(p.name)}"><img src="${A}icon-x.svg" alt=""></button>
        ${productImage(p, "card", [23, 25, 125, 122, 5])}
        <a class="order-item__name" href="product.html?id=${p.id}">${esc(p.name)}</a>
        <p class="order-item__price">${money(p.price * l.qty)}</p>
        <div class="order-item__qty">
          <button data-qty="${p.id}" data-step="-1" aria-label="Decrease quantity"${l.qty <= 1 ? " disabled" : ""}><img src="${A}icon-minus-sm.svg" alt=""></button>
          <output aria-live="polite">${l.qty}</output>
          <button data-qty="${p.id}" data-step="1" aria-label="Increase quantity"><img src="${A}icon-plus-sm.svg" alt=""></button>
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
        : `<div class="order-heads" aria-hidden="true"><span style="left:17px">Product</span><span style="left:205px">Price</span></div>
           <ul class="order-items" style="list-style:none;margin-bottom:0">${lines.map(line).join("")}</ul>
           <div class="totals" style="margin-top:28px;padding-left:17px;padding-right:20px"><div><span>Subtotal</span><span>${money(Cart.subtotal())}</span></div></div>`}
      <p style="margin-top:39px;text-align:center"><a class="link-caps link-caps--wide" href="category.html?c=all">KEEP SHOPPING</a></p>
      ${empty ? "" : `
      <p style="margin-top:43px;text-align:center;font:400 12px/22px var(--f-body);letter-spacing:-0.24px">Pickup available in select cities only</p>
      <a class="btn btn--dark" href="delivery.html" style="margin:14px 0 0 77px;width:237px;height:61px">DELIVERY</a>
      <a class="btn btn--outline" href="pickup.html" style="margin:22px 0 0 77px;width:237px;height:60px">PICKUP</a>`}`;
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
