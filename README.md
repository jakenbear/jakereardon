# Jake Reardon — Portfolio

Standalone static site for showcasing live projects and tracking personal status (live / revisit / to-do).

**This is its own repo.** It is not part of FitLapse / fitness-progress-viewer.

Meant for Render at `jakereardon.onrender.com`.

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
npx serve .
```

## Push to a new GitHub repo

Create an **empty** repo on GitHub named something like `jakereardon` (do not push into fitness-progress-viewer), then:

```bash
cd Z:\_SOURCE_CODE_\jakereardon
git remote add origin https://github.com/jakenbear/jakereardon.git
git push -u origin main
```

(Use your real GitHub username/repo URL if different.)

## Deploy on Render

1. Render → **New → Static Site**
2. Connect the **jakereardon** GitHub repo (not FitLapse)
3. Settings:
   - **Build Command**: leave empty (or `true`)
   - **Publish Directory**: `.`
4. After deploy, set the subdomain to `jakereardon`

[`render.yaml`](render.yaml) is included if you prefer Blueprint deploy.

## Adding a project

Edit [`projects.js`](projects.js):

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
