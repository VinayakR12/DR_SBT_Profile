This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Home Content + Supabase

The public home page now loads section data from Supabase when available and automatically falls back to the static backup file in `app/data.ts` if the database is missing or unavailable.

To enable the live content store:

1. Run the SQL in `supabase/home_content.sql` in your Supabase project.
2. Keep `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
3. Open `/admin`, choose `Home`, and use the content manager to sync, edit, restore, or delete section overrides.

The admin panel writes section-level rows into Supabase, while the public site continues to render from the backup content file if Supabase fails.

## About Content + Supabase

The public About page also loads from Supabase when available and falls back to the static backup file in `app/Database/Aboutdata.ts` if the database is missing or unavailable.

The About override is stored as a separate row in the existing `home_content_sections` table using the `about` key, so no extra migration table is needed. Keep the same Supabase environment variables from the Home setup in `.env.local`.

Open `/admin`, choose `About`, and use the content manager to edit, restore, or delete the page override.

The admin panel writes a single page-level row into Supabase, while the public About page continues to render from the backup content file if Supabase fails.

## Research Publications + Supabase

The `/research/publications` page now loads from Supabase first and falls back to `app/Database/Researchdata.ts` when a remote override is missing or unavailable.

The override is stored as a separate row in `home_content_sections` with the `research_publications` key.

Open `/admin`, choose `Research Publications`, and use the section-wise editor to:

1. Save individual sections (`Hero`, `Stats`, `Papers`, `Thesis`, `CTA`).
2. Add or remove repeatable records (papers and thesis detail rows).
3. Sync all sections, restore backup content, or delete the DB override.

## Research Patents + Supabase

The `/research/patents` page now loads from Supabase first and falls back to `app/Database/Patentdata.ts` when a remote override is missing or unavailable.

The override is stored as a separate row in `home_content_sections` with the `research_patents` key.

Open `/admin`, choose `Research Patents`, and use the section-wise editor to:

1. Save individual sections (`Hero`, `Stats`, `Patents Heading`, `Patents`, `Copyright Heading`, `Copyrights`, `CTA`).
2. Add or remove repeatable records for patents and copyrights.
3. Upload/remove image and document assets for each patent/copyright record.
4. Sync all sections, restore backup content, or delete the DB override.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
