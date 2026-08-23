# Genesis Esports — Team Website + Admin Panel

A React (Vite + Tailwind) site for **Genesis Esports**, an Indian PUBG Mobile / BGMI
organization, with a Supabase backend and a password-protected admin panel that can
edit every piece of content on the site — team info, roster & photos, staff,
placements, tournament results, awards, timeline, and upcoming schedule.

Content is pre-seeded from the team's profile PDF you provided (Liquipedia source,
22 Aug 2026) — everything except the reference/citation section.

---

## 1. Set up Supabase (backend)

1. Create a project at [supabase.com](https://supabase.com) (free tier is enough).
2. Go to **SQL Editor → New query**, paste the entire contents of
   `supabase/schema.sql`, and click **Run**.
   This creates all tables, security policies, the `team-photos` storage bucket,
   and seeds it with the team's current data.
3. Go to **Authentication → Users → Add user** and create your own admin login
   (email + password). This is the only account that can sign in to `/admin`.
4. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon / public** key

## 2. Configure the project

```bash
cp .env.example .env
```

Paste your Project URL and anon key into `.env`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

## 3. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` for the site, `http://localhost:5173/admin/login`
for the admin panel.

## 4. Deploy to Netlify

1. Push this project to a GitHub/GitLab repo (or drag-and-drop the built `dist`
   folder onto Netlify — but a Git-connected deploy is recommended so future edits
   are easy).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
   Build settings are already defined in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Under **Site settings → Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. The `netlify.toml` redirect rule makes client-side routing (React
   Router) work correctly on refresh/direct links, including `/admin`.

## 5. Using the admin panel

Go to `yoursite.com/admin/login` and sign in with the user you created in
Supabase Authentication. From the dashboard you can manage:

- **Team Info** — name, location, winnings, hero tagline, and the full **squad
  photo** shown above the roster.
- **Roster & Former Players** — add/edit players, upload individual **photos**
  (this fills the reserved photo slot on each player card), and toggle
  "Active roster" to move someone into the Former Players / History list.
- **Organization Staff**, **Placement Summary**, **Tournament Results**,
  **Individual Awards**, **Recorded Timeline**, **Upcoming Schedule**.

Every change saves straight to Supabase and appears on the live site immediately
— no redeploy needed, since content is fetched at page load, not built into the
bundle.

Photos are uploaded to the public `team-photos` storage bucket created by the
SQL script; only signed-in admins can upload/delete, anyone can view.

## Project structure

```
src/
  assets/            enhanced Genesis Esports logo
  components/         Navbar, Footer, PlayerCard, StatStrip, etc.
  components/admin/   generic CrudManager + RecordForm used by every admin page
  context/            Supabase auth session context
  lib/                Supabase client, data access layer, storage helper
  pages/               Home, Roster, Achievements, Organization, History, Schedule
  pages/admin/         Login, layout, dashboard, and one manager page per table
supabase/
  schema.sql           tables, RLS policies, storage bucket, seed data
```

## Notes

- Design system: black / orange / white, condensed display type (Teko) for
  headlines, Inter for body copy, and a monospace HUD/scoreboard treatment for
  stats — pulled directly from the crest logo you supplied.
- All public tables are readable by anyone (`select`), but only an
  authenticated Supabase user can insert/update/delete — enforced by Postgres
  Row Level Security, not just hidden in the UI.
- Figures (winnings, placements, prizes) reflect the source profile at the time
  it was captured and can be updated any time from the admin panel.
