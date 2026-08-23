-- =============================================================================
-- Genesis Esports — Supabase schema, security policies, storage bucket & seed data
-- =============================================================================
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / DROP ... IF EXISTS.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. TABLES
-- -----------------------------------------------------------------------------

create table if not exists public.team_info (
  id uuid primary key default gen_random_uuid(),
  team_name text not null default 'Genesis Esports',
  country text,
  region text,
  game text,
  org_type text,
  created_date date,
  total_winnings numeric,
  instagram_url text,
  hero_tagline text,
  squad_photo_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  ign text not null,
  full_name text,
  role text,
  photo_url text,
  is_active boolean not null default true,
  join_date date,
  leave_date date,
  next_team_status text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  join_date date,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.placements (
  id uuid primary key default gen_random_uuid(),
  tier text not null,
  first integer not null default 0,
  second integer not null default 0,
  third integer not null default 0,
  top3 integer not null default 0,
  results integer not null default 0,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  tournament text not null,
  tier text,
  place text,
  prize numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  award text not null,
  player text not null,
  tournament text,
  prize numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.upcoming_events (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date,
  name text not null,
  tier text,
  notes text,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY
--    Public (anon) visitors can only READ. Only signed-in admins (authenticated
--    role) can insert / update / delete. Create your admin user in
--    Authentication → Users — anyone with those credentials can edit everything.
-- -----------------------------------------------------------------------------

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'team_info', 'players', 'staff', 'placements',
      'achievements', 'awards', 'timeline_events', 'upcoming_events'
    ])
  loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "Public read access" on public.%I;', t);
    execute format(
      'create policy "Public read access" on public.%I for select using (true);', t
    );

    execute format('drop policy if exists "Authenticated insert" on public.%I;', t);
    execute format(
      'create policy "Authenticated insert" on public.%I for insert to authenticated with check (true);', t
    );

    execute format('drop policy if exists "Authenticated update" on public.%I;', t);
    execute format(
      'create policy "Authenticated update" on public.%I for update to authenticated using (true) with check (true);', t
    );

    execute format('drop policy if exists "Authenticated delete" on public.%I;', t);
    execute format(
      'create policy "Authenticated delete" on public.%I for delete to authenticated using (true);', t
    );
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- 3. STORAGE — public bucket for player/staff/squad photos
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('team-photos', 'team-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public read team-photos" on storage.objects;
create policy "Public read team-photos"
  on storage.objects for select
  using (bucket_id = 'team-photos');

drop policy if exists "Authenticated upload team-photos" on storage.objects;
create policy "Authenticated upload team-photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'team-photos');

drop policy if exists "Authenticated update team-photos" on storage.objects;
create policy "Authenticated update team-photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'team-photos');

drop policy if exists "Authenticated delete team-photos" on storage.objects;
create policy "Authenticated delete team-photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'team-photos');

-- -----------------------------------------------------------------------------
-- 4. SEED DATA — sourced from the Genesis Esports team profile (Liquipedia,
--    22 Aug 2026). Only inserted the first time (guarded by "not exists").
-- -----------------------------------------------------------------------------

insert into public.team_info (team_name, country, region, game, org_type, created_date, total_winnings)
select 'Genesis Esports', 'India', 'Asia', 'PUBG Mobile / BGMI', 'Indian esports organization', '2023-02-01', 103573
where not exists (select 1 from public.team_info);

-- Active roster
insert into public.players (ign, full_name, is_active, join_date, order_index)
select v.ign, v.full_name, true, v.join_date::date, v.order_index
from (values
  ('HunterZ', 'Mohammed Kaif Khan', '2025-05-20', 1),
  ('Zap', 'Parth Parihar', '2025-05-20', 2),
  ('GravityJOD', 'Ashhar Hasan', '2025-07-20', 3),
  ('ViPER', 'Aldan Shaikh', '2025-09-18', 4),
  ('FurY', 'Tushar Kumar', '2025-12-09', 5)
) as v(ign, full_name, join_date, order_index)
where not exists (select 1 from public.players);

-- Former players
insert into public.players (ign, full_name, is_active, join_date, leave_date, next_team_status, order_index)
select v.ign, v.full_name, false, v.join_date::date, v.leave_date::date, v.next_team_status, v.order_index
from (values
  ('Pukar', 'Pukar Singla', '2023-02-25', '2023-05-30', 'TeamXSpark', 10),
  ('Sarang', 'Sarangajyoti Deka', '2023-03-11', '2023-05-30', 'TeamXSpark', 11),
  ('Fierce', 'Ritesh Nawandar', '2023-02-25', '2023-05-28', 'Revenant Esports', 12),
  ('Punkk', 'Ashutosh Singh', '2023-02-25', '2023-05-28', 'Velocity Gaming', 13),
  ('CLUTCH', 'Gautam Arora', '2023-07-10', '2024-04-12', 'FS Esports', 14),
  ('EXPLICIT', 'Pushpak Mishra', '2023-07-10', '2024-04-12', 'Wyld Fangs (Coach)', 15),
  ('HITMAN', 'Rohit Sharma', '2023-07-10', '2024-04-12', 'FS Esports', 16),
  ('Apollo', 'Nishant Laspal', '2025-02-04', '2025-07-21', 'Money Makers', 17),
  ('SHADOW', 'Arjun Mandhalkar', '2025-02-04', '2025-07-21', 'Money Makers', 18),
  ('Sam999', 'Samihan Kulkarni', '2025-02-09', '2025-07-21', 'Money Makers', 19),
  ('Mac', 'Balabhaskar R', '2025-02-04', '2025-05-18', 'TWOB', 20),
  ('Syrax', 'Dhairya Solanki', '2025-02-04', '2025-05-18', 'Team Aryan', 21),
  ('Wixxky', 'Deepanshu Yadav', '2025-02-04', '2025-02-05', 'Retired', 22)
) as v(ign, full_name, join_date, leave_date, next_team_status, order_index)
where not exists (select 1 from public.players where is_active = false);

-- Organization staff
insert into public.staff (name, role, join_date, order_index)
select v.name, v.role, v.join_date::date, v.order_index
from (values
  ('Pravesh Kumar', 'Team Manager', '2023-02-01', 1),
  ('Abhinav Rai', 'CEO', '2023-02-01', 2),
  ('Devesh Kumar (Tom)', 'COO', '2025-01-01', 3)
) as v(name, role, join_date, order_index)
where not exists (select 1 from public.staff);

-- Placement summary
insert into public.placements (tier, first, second, third, top3, results, order_index)
select v.tier, v.first, v.second, v.third, v.top3, v.results, v.order_index
from (values
  ('A-Tier', 0, 1, 0, 1, 8, 1),
  ('B-Tier', 0, 0, 0, 0, 12, 2),
  ('C-Tier', 1, 6, 2, 9, 21, 3),
  ('Total', 1, 7, 2, 10, 41, 4)
) as v(tier, first, second, third, top3, results, order_index)
where not exists (select 1 from public.placements);

-- Notable tournament results
insert into public.achievements (date, tournament, tier, place, prize)
select v.date::date, v.tournament, v.tier, v.place, v.prize
from (values
  ('2026-07-17', 'Revamp Master Series', 'C', '1st', 2074),
  ('2026-06-21', 'Battlegrounds Mobile India Pro Series 2026', 'A', '12th', 8481),
  ('2026-03-29', 'Battlegrounds Mobile India Series 2026', 'A', '2nd', 52752),
  ('2026-02-25', 'Premiership Season One', 'C', '2nd', 1650),
  ('2025-12-11', 'Rising Championship Season 1', 'C', '2nd', 1670),
  ('2025-11-20', '1M DYNASTY Season 2', 'C', '2nd', 1695),
  ('2025-09-14', 'BGMI Masters Series Season 4', 'A', '11th', 2549),
  ('2025-08-10', 'iQOO Battlegrounds Series', 'A', '5th', 2850),
  ('2025-07-06', 'Battlegrounds Mobile India Pro Series 2025', 'A', '13th', 8158),
  ('2025-04-27', 'Battlegrounds Mobile India Series 2025', 'A', '12th', 8901)
) as v(date, tournament, tier, place, prize)
where not exists (select 1 from public.achievements);

-- Individual awards
insert into public.awards (date, award, player, tournament, prize)
select v.date::date, v.award, v.player, v.tournament, v.prize
from (values
  ('2026-07-17', 'MVP', 'ViPER', 'Revamp Master Series', 519),
  ('2026-03-29', 'MVP', 'HunterZ', 'Battlegrounds Mobile India Series 2026', 3165),
  ('2026-02-25', 'MVP', 'HunterZ', 'Premiership Season One', 440)
) as v(date, award, player, tournament, prize)
where not exists (select 1 from public.awards);

-- Recorded timeline
insert into public.timeline_events (event_date, description)
select v.event_date::date, v.description
from (values
  ('2023-02-25', 'Pukar, Fierce, and Punkk joined Genesis.'),
  ('2023-03-11', 'Sarang joined Genesis.'),
  ('2023-05-28', 'Fierce and Punkk departed.'),
  ('2023-05-30', 'Pukar and Sarang departed.'),
  ('2023-07-10', 'CLUTCH, EXPLICIT, and HITMAN joined.'),
  ('2024-04-12', 'CLUTCH, EXPLICIT, and HITMAN departed.'),
  ('2025-01-01', 'Tom joined as COO.'),
  ('2025-02-04', 'Apollo, Wixxky, Mac, SHADOW, and Syrax joined.'),
  ('2025-02-09', 'Sam joined.'),
  ('2025-05-18', 'Mac and Syrax departed.'),
  ('2025-05-20', 'HunterZ and Zap joined.'),
  ('2025-07-20', 'GravityJOD joined.'),
  ('2025-07-21', 'Apollo, SHADOW, and Sam departed.'),
  ('2025-09-18', 'ViPER joined.'),
  ('2025-12-09', 'FurY joined.')
) as v(event_date, description)
where not exists (select 1 from public.timeline_events);

-- Upcoming schedule
insert into public.upcoming_events (start_date, end_date, name, tier, notes)
select v.start_date::date, v.end_date::date, v.name, v.tier, v.notes
from (values
  ('2026-08-10', '2026-09-06', 'BGMI Masters Series Season 5', 'A', 'Listed on the team profile as an upcoming A-Tier event.'),
  ('2026-08-23', '2026-08-23', 'Super Weekend 1', null, 'Five games scheduled across Rondo, Erangel, and Miramar.')
) as v(start_date, end_date, name, tier, notes)
where not exists (select 1 from public.upcoming_events);

-- =============================================================================
-- Done. Next steps:
--   1. Authentication → Users → Add user → create your admin login.
--   2. Project Settings → API → copy the Project URL and anon public key into
--      your .env file (see .env.example) and into Netlify's environment
--      variables when you deploy.
-- =============================================================================
