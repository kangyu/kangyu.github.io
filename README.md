# Yu Kang — Personal Homepage

Static site (no build step) for GitHub Pages: https://kangyu.github.io/

```
index.html              English home page (default)
publications.html       English full publication list
zh/index.html           Chinese home page
zh/publications.html    Chinese full publication list
assets/css/style.css    styles (dark/light themes)
assets/js/main.js       theme, nav, counters, publication rendering (UI strings in EN/ZH)
assets/js/pubs.js       publication data, shared by all pages — edit this to add/update papers
assets/img/             project figures (webp)
```

The English and Chinese home pages are separate hand-written files. When you change content on one,
make the same change on the other. In the Chinese pages keep each paragraph on one line: a line break
inside Chinese text renders as a stray space.

## Adding a paper
Append an object to `window.PUBS` in `assets/js/pubs.js`:

```js
{ "t": "Title", "au": "A, B, Yu Kang, C", "v": "ICSE 2027", "y": 2027,
  "a": "coding", "l": "https://arxiv.org/abs/xxxx", "tg": ["sel"], "c": null }
```
`a` is one of `coding | env | agent | gui | aiops | early` (the filter chips on the publications page).
`tg` may contain `lead`, `first`, and `sel`. Papers tagged `sel` appear under "Selected publications"
on both home pages and under "Selected only" on the publications pages.

## Deploy
Push to `main`; GitHub Pages serves the repository root.
