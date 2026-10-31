# Rohit Raman: portfolio site

A one-page website for getting freelance backend work. It shows what Rohit builds, one featured project, his services, skills and process, and a contact form.

Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion and Lucide icons.

- Design spec: [docs/superpowers/specs/2026-10-31-portfolio-design.md](docs/superpowers/specs/2026-10-31-portfolio-design.md)
- Build plan: [docs/superpowers/plans/2026-10-31-portfolio.md](docs/superpowers/plans/2026-10-31-portfolio.md)

## Run it on your computer

You need Node.js 22 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173. The page reloads when you save a file.

| Command | What it does |
|---|---|
| `npm run dev` | Runs the site while you work on it |
| `npm run build` | Makes the finished site in the `dist` folder |
| `npm run preview` | Shows the finished `dist` site on http://localhost:4173 |
| `npm test` | Runs the automatic checks |
| `npm run typecheck` | Checks the TypeScript code for mistakes |

## Where to change things

All the words and data are in `src/content/`. You do not need to touch the components.

| File | What is in it |
|---|---|
| `site.ts` | Name, email, links, hero text, about text, section titles, contact text |
| `services.ts` | The 7 services |
| `skills.ts` | The skill groups |
| `process.ts` | The 5 steps of how a project runs |
| `projects.ts` | The featured projects |

## Add a project

Open `src/content/projects.ts` and add one more object to the list. Only `id`, `title`, `tagline`, `problem`, `role`, `features` and `stack` are required. Everything else is optional, and anything you leave out simply does not show, so there are no empty boxes.

| Optional field | What it shows |
|---|---|
| `status` | A small line above the title, for example "Deployed" |
| `facts` | Big numbers on the card, for example `{ label: 'Roles', value: '5' }`. Real counts only |
| `architecture` | A diagram. Each block has `x` and `y` as a percentage (15 to 85 across, 0 to 100 down) |
| `media` | Screenshots. Put the files in `public/projects/<id>/` and use `/projects/<id>/file.png` |
| `links` | Buttons to a repo, demo or article. Must start with `https://` |

The `id` becomes the web address of the case study: `yoursite.com/#<id>` opens it directly.

For screenshots of client work, hide all patient and client details first.

## Things only you can supply

The site works without all of these. Here is what it does until you add them.

| Item | Until then |
|---|---|
| Web3Forms key | The contact form opens the visitor's email app with the message filled in |
| Site address (`VITE_SITE_URL`) | The canonical link, share-preview image link and sitemap are left out |
| Screenshots of the clinic project | None are shown |
| Availability line, for example "Currently taking on select projects" | Not shown |
| Phone or WhatsApp | Not shown |
| Patient self-registration by QR code (built, not deployed yet) | Left out of the feature list. Add it to `projects.ts` once it is live |

Please also read the clinic project text in `projects.ts` once, especially your role, and change anything that is not exactly right.

## Set up the contact form (free)

1. Go to web3forms.com and enter your email address. They email you an **access key**.
2. For local testing, copy `.env.example` to `.env.local` and paste the key after `VITE_WEB3FORMS_KEY=`.
3. For the live site, add the same name and value in Render (see below).
4. If your Web3Forms plan allows it, limit the key to your site's address.

The key is public by design: it can only send messages to your email. Without it, the form still works by opening the visitor's email app.

## Put it online on Render (free)

A Render **Static Site** is free and never goes to sleep. This is different from Render's free "web service", which sleeps when idle. This site has no server, so it does not need one.

1. Put the project on GitHub (a new, empty repo; push this folder to it). Nothing has been pushed for you. The site's code is on the branch `feature/build-portfolio`; the `main` branch holds only the design documents. Either merge that branch into `main` before you deploy, or tell Render to use `feature/build-portfolio` (in step 2 pick that branch, or later under **Settings**, **Branch**). A deploy of `main` before the merge will fail because there is no site in it yet.
2. In Render, choose **New**, then **Blueprint**, pick the repo, and click **Apply**. Render reads `render.yaml` and sets everything up.
3. When asked, fill in `VITE_WEB3FORMS_KEY`. Leave `VITE_SITE_URL` empty for now. If Render will not accept an empty value, type `https://example.com` and replace it in step 5.
4. Wait for the first deploy. Render gives you an address like `https://rohit-portfolio.onrender.com`.
5. Go to the service's **Environment** tab, set `VITE_SITE_URL` to that address, and redeploy. Now the share preview and sitemap work.
6. Optional: add your own domain under **Settings**, then **Custom Domains**, and update `VITE_SITE_URL` to match.

Without the Blueprint: **New**, **Static Site**, build command `npm ci && npm run build`, publish directory `dist`, and add the two variables yourself.

After this, every push to the branch Render is watching updates the live site by itself.

## Keep it free

Checked against GitHub's, Render's and Cloudflare's own pages on 31 October 2026. Plans change, so look again before you rely on any number.

| Part | Cost | Limit that matters |
|---|---|---|
| GitHub private repo | Free | None for one site |
| Render Static Site (Hobby workspace) | No monthly fee | 5 GB of traffic and 500 build minutes a month |
| Web3Forms contact form | Free per their public listings | 250 messages a month. The site works without it |
| Address ending in `.onrender.com` | Free | None |
| Your own domain name | Buying one costs money; attaching it to Render is free (2 included) | Optional, skip it to stay at zero |

**Do not add a payment method to Render.** With no card on file, Render cannot charge you. If a month ever goes over the free amounts, Render switches the site off until the next month instead. With a card on file it would bill the extra, at $0.15 per GB of traffic and $5 per 1,000 build minutes.

This site is light: a first visit downloads about 225 KB, so 5 GB is roughly 20,000 first visits a month. Repeat visitors download far less because the files are cached.

If you ever want no traffic limit at all, Cloudflare Pages is free with 500 builds a month, and its limits page lists no bandwidth cap. The same build works there (see below).

## Cloudflare Pages works too

Use the same repo. Build command `npm run build`, output folder `dist`, and set `NODE_VERSION` to `22` plus the two variables.

## Before you share the link

- Open it on your phone.
- Send yourself a test message through the form.
- Paste the link into WhatsApp or LinkedIn to see the preview. These apps remember old previews, so test with the final address.

## Change the share-preview image

The image is `public/og-image.png`. It is made from `scripts/og.html`. Edit that file, then run this from the project folder, with the full path to your own folder. On Windows, replace `chrome` with the full path to `chrome.exe`, for example `"C:\Program Files\Google\Chrome\Application\chrome.exe"`:

```bash
chrome --headless=new --hide-scrollbars --window-size=1200,630 --screenshot=public/og-image.png file:///FULL/PATH/TO/portfolio/scripts/og.html
```
