# Jake Reardon — Portfolio

Static site for showcasing live projects and tracking personal status (live / revisit / to-do). Built for Render Static Sites at `jakereardon.onrender.com`.

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
npx serve .
```

## Deploy on Render

1. Push this folder to a GitHub repo (or add it as a subdirectory and set the root directory).
2. In Render: **New → Static Site**.
3. Connect the repo.
4. Settings:
   - **Root Directory**: `jakereardon` (if the repo is a monorepo parent) or leave blank if this folder *is* the repo
   - **Build Command**: leave empty
   - **Publish Directory**: `.`
5. After deploy, set the subdomain to `jakereardon` (or attach a custom domain).

You can also deploy from [`render.yaml`](render.yaml) via Blueprint.

## Adding a project

Edit [`projects.js`](projects.js) and append an object:

```js
{
  id: 'unique-slug',
  title: 'Name',
  url: 'https://example.com/',
  blurb: 'One short sentence.',
  tags: ['web'],
  status: 'live' // or 'revisit' | 'todo'
}
```

Status toggles on the site override defaults in your browser via `localStorage`.
