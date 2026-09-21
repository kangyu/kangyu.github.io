# Yu Kang — Personal Homepage

Static site (no build step) for GitHub Pages.

```
index.html            page structure and hand-written content
assets/css/style.css  styles (dark/light themes)
assets/js/main.js     interactions, research-area cards, timeline chart, publication list
assets/js/pubs.js     publication data — edit this to add/update papers
assets/img/           project figures (webp)
```

## Adding a paper
Append an object to `window.PUBS` in `assets/js/pubs.js`:

```js
{ "t": "Title", "au": "A, B, Yu Kang, C", "v": "ICSE 2027", "y": 2027,
  "a": "coding", "l": "https://arxiv.org/abs/xxxx", "tg": ["featured"], "c": null }
```
`a` is one of `coding | env | gui | agent | aiops | early`; `tg` may contain `lead`, `first`, `featured`
(`featured`/`lead`/`first` show under "Selected only"). Area counts and the timeline update automatically.

## Deploy
Push to a repo named `<username>.github.io` (or any repo with Pages enabled on the `main` branch, root folder).
