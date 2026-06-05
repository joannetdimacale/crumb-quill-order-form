# Crumb & Quill Order Form v2

Static custom preorder form for GitHub Pages, connected to Formspree.

## v2 changes
- Added welcome / opening screen with "Reserve a Box" button.
- Added actual logo image asset.
- Removed "Soft Launch Menu" text from the header.
- Added subtle doodle-style background elements.
- Replaced date picker with a Friday-only dropdown.
- Added 50% downpayment reminder and downpayment estimate.
- Removed sticky order summary behavior so it does not cover fields.
- Kept Flavor of the Week as an optional/editable section.

## Files/folders to upload
Upload these to the GitHub repository root:

- `index.html`
- `styles.css`
- `script.js`
- `assets/crumb-quill-logo.png`
- `README.md`

## Formspree
Current endpoint:
https://formspree.io/f/xojzvzdn

The endpoint is already placed in `script.js`.

## Editing products/prices
Open `script.js` and edit the `products` array.

## Flavor of the Week
For a future weekly flavor, add it to the `products` array or replace the optional copy in `index.html`.

Example product:
{ id: "cookie-week-biscoff", category: "cookies", name: "Biscoff Brown Butter", price: 429, note: "Flavor of the Week", badge: "Weekly" }

## GitHub Pages
After uploading changes, GitHub Pages may need 1–3 minutes to rebuild.
