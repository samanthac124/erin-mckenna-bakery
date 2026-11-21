# Erin McKenna’s Bakery — mobile prototype

A clickable, mobile-first prototype built from my Figma designs for a UX case study.
It covers the core task flow: browse treats → view a product → add to cart → choose delivery or pickup → check out.

**Concept project — not affiliated with Erin McKenna’s Bakery. No orders are placed and nothing is sent anywhere.**

## View it
Open the live site on a phone (or a narrow browser window): it's designed at 390px wide.

## How it's built
Plain HTML, CSS and JavaScript with no build step. The cart is kept in the browser's local storage.

- `index.html` – home
- `category.html` – shop (All Treats grid, single-category lists)
- `product.html` – product detail
- `cart.html`, `delivery.html`, `pickup.html`, `thanks.html` – checkout flow
- `css/styles.css`, `js/` – shared styles and page scripts

To run locally, serve the folder with any static server, e.g. `python -m http.server 8080`.
