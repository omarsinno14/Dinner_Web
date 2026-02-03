# Dinner Invite Website

Single-page, playful-professional dinner invite built with Next.js App Router, TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quick edits

- Main copy, date, time, place, and button text: `app/page.tsx`.
- Details card values: `detailItems` array in `app/page.tsx`.
- Name in the headline and NO-button modal: `app/page.tsx`.

## Visit tracking hook

- `notifyVisit()` lives near the top of `app/page.tsx`.
- It currently logs `VISIT EVENT: {timestamp, userAgent}` to the console.
- A commented-out `fetch("/api/notify-visit")` call is included for later webhook/email use.
- Placeholder API route: `app/api/notify-visit/route.ts`.

## Deploy to Vercel (quick start)

1. Push the repo to GitHub.
2. In Vercel, click **New Project** and import the repo.
3. Keep defaults (Next.js detected automatically) and deploy.
