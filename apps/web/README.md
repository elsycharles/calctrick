# CalcTrick Web

The mobile-first Next.js PWA for CalcTrick. Calculations run locally through the `trick-engine` workspace, and the five most recent calculations are stored on the device with IndexedDB.

## Run locally

From the repository root:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test the production PWA

The service worker is disabled during development. To test installation and offline behavior:

```bash
npm run build
npm run start --workspace web
```

Load the page once while online, then switch the browser offline and reload it.

## Deploy on Vercel

1. Push the repository to GitHub and import it from the Vercel dashboard.
2. Set **Root Directory** to `apps/web`.
3. Keep the detected framework as **Next.js** and the default build command.
4. In the project build settings, enable **Include source files outside the Root Directory** so Vercel can build the `trick-engine` workspace.
5. Add `NEXT_PUBLIC_SITE_URL` to the Production environment with the final URL, for example `https://calctrick.com`. Do not include a trailing slash.
6. Deploy, then add the custom domain in **Settings → Domains** if needed.
7. Open the production URL once, test a calculation, installation and offline reload.

Every push to the production branch creates a production deployment. Other branches and pull requests receive preview deployments.

## SEO launch checklist

The app generates these public discovery endpoints automatically:

- `/robots.txt`
- `/sitemap.xml`
- `/opengraph-image`
- `/tricks` and the individual mental-math guides
- `/privacy`

After the custom domain is connected:

1. Confirm `NEXT_PUBLIC_SITE_URL` uses that domain and redeploy.
2. Inspect the page source and verify the canonical, Open Graph and Twitter metadata.
3. Add the domain to Google Search Console.
4. Verify the URL-prefix property with the HTML file at `/googlec2224002b644f670.html`. Keep this file in `public` after verification so Search Console can continue checking ownership.
5. Alternatively, use DNS verification or add the provided token as `GOOGLE_SITE_VERIFICATION` in Vercel for HTML-tag verification.
6. Submit `https://your-domain.example/sitemap.xml` in Search Console.
7. Test one shared calculator URL such as `/?a=24&op=mul&b=25` and its social preview.

The app does not require backend secrets, a database or API environment variables.
