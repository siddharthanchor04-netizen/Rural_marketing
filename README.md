# Meri Kahani, Meri Zubani — stories of women who run the bazaar

*Meri kahani, meri zubani*: my story, in my own words. This site is the AI deliverable for our ET Rural Marketing (Bottom of the Pyramid) project on women's entrepreneurship in rural markets. Several women we met hesitated to speak and asked their husbands to answer for them; this platform lets them tell their own stories, in writing or as voice notes.

## What's inside
- **Six field stories** from interviews in and around Sanquelim, Goa, by Sneha, Ravi and Parth.
- **Accounts** with just a username and password (no email or phone needed).
- **Share your story**: title, category, and up to 6 photos, videos or voice notes.
- **Categories, search, claps ("Shabaash!") and comments.**
- **Help desk**: growing a business, Mudra, PM SVANidhi, PMEGP, Stand-Up India, Goa EDC/CMRY, SHGs, documents, licences (checked Nov 2026).
- **Sakhi**: an offline help bot that answers from the help desk and the six stories.

## Two ways to store data
| Mode | When | Who sees posts |
|---|---|---|
| **Online (Supabase)** | `js/config.js` has your Supabase URL and key | Everyone |
| **Local** | `js/config.js` is empty | Only the browser that wrote them |

## Set up the free online database (Supabase, about 10 minutes)
1. Sign up at https://supabase.com and click **New project**. Pick the free plan and a region near India (e.g. Mumbai). Save the database password somewhere safe.
2. Open **SQL Editor → New query**, paste everything from `supabase/schema.sql`, and click **Run**. This creates the tables, the security rules and the `media` storage bucket.
3. Open **Authentication → Sign In / Providers → Email** and turn **Confirm email** OFF. (Women sign in with a username; the site turns it into a placeholder address like `meena@users.merikahani.app`, and no email is ever sent.)
4. Open **Project Settings → API** (or **API Keys**) and copy the **Project URL** and the **anon / publishable** key. Never use the `service_role` / secret key in the site.
5. Paste both into `js/config.js` and push. The footer will say "Stories are saved online".

Free-plan notes: 500 MB database, 1 GB file storage. A free project pauses after a week with no visits; open the Supabase dashboard and click **Restore** if that happens. There's no self-service password reset without email: the site owner can reset a member's password from **Authentication → Users**.

## Deploy on GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)`.

## Run locally
`python3 -m http.server` in this folder, then open http://localhost:8000.

Fonts: Rozha One, Tiro Devanagari Hindi, Kalam (SIL Open Font License), self-hosted in `/fonts`. Supabase client: `vendor/supabase.js` (MIT).
