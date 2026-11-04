# Portfolio

Vite + vanilla JS. No framework.

    npm install
    npm run dev       # http://localhost:5173
    npm run build     # outputs dist/
    npm run preview   # serves dist/

Vercel detects Vite automatically (build: `npm run build`, output: `dist`).

## Edit content

- Project cards are `<article class="node">` in `index.html`. The commented block inside each shows the lines to add: description, one result, stack and repo link.
- Add email, LinkedIn and resume links in the Contact block.
- `src/main.js` draws the path from the card positions. Keep `data-node="left"` and `data-node="right"` alternating.
- `public/404.html` is the custom not-found page.

## Project pages

- Text, stack and screenshot captions live in `src/projects.js`.
- Screenshots are in `public/shots/`. Add a file there and an entry under `shots` to show it.
