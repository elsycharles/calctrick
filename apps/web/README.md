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
