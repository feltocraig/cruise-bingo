This project was created by Gemini from the following prompt.

✅ Prompt: Offline Bingo Web App

Build a minimal web app for a 5x5 bingo card game that works offline (PWA-style).

Requirements:

The card should be randomized per user load — same list of 25 pre-written items, shuffled and placed randomly into the 5x5 grid (with a “FREE” space in the center).

Users manually tap or click a square to toggle a checkmark or shaded state.

The grid should be responsive (work on mobile).

State (marked/unmarked) should persist across reloads using local storage.

All assets and functionality must work offline (use a service worker or PWA manifest to cache files).

Use minimal styling (vanilla CSS or lightweight library like Tailwind optional).

Pure JavaScript preferred — no framework like React or Vue.

Include all files in a single folder (HTML, CSS, JS, manifest, service worker).

Bonus: include a reset button to regenerate a new card layout from the same item list.

---

### Deploying a New Version

To ensure users get the latest version of the app, you must update the `CACHE_NAME` in `sw.js`. This will trigger the service worker to install the new files and clear out the old cache.

For example, if your `CACHE_NAME` is:

```javascript
const CACHE_NAME = 'cruise-bingo-cache-v2';
```

You would update it to:

```javascript
const CACHE_NAME = 'cruise-bingo-cache-v3';
```