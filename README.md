# Jake Reardon — Portfolio

Standalone static portfolio for selected sites and projects.

**This is its own repo.** It is not part of FitLapse / fitness-progress-viewer.

Meant for Render at `jakereardon.onrender.com`.

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
npx serve .
```

## Deploy on Render

1. Render → **New → Static Site**
2. Connect the **jakereardon** GitHub repo
3. Settings:
   - **Build Command**: leave empty (or `true`)
   - **Publish Directory**: `.`
4. Set the subdomain to `jakereardon`

## Adding a project

Edit [`projects.js`](projects.js):

```js
{
  id: 'unique-slug',
  title: 'Name',
  url: 'https://example.com/',
  blurb: 'One short sentence.',
  tags: ['web']
}
```
