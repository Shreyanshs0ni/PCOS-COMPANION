-- =============================================
-- PCOS Companion — Database Schema (MVP)
-- =============================================

-- Drop existing tables if rebuilding
drop table if exists public.streaks cascade;
drop table if exists public.reminders cascade;
drop table if exists public.ai_insights cascade;
drop table if exists public.tracker_settings cascade;
drop table if exists public.check_in_entries cascade;
drop table if exists public.cycles cascade;
drop table if exists public.symptoms cascade;
drop table if exists public.logs cascade;
drop table if exists public.profiles cascade;

-- =============================================
-- 1. PROFILES (Extended Health Profile)
-- =============================================
create table public.profiles (
  id text primary key, -- matches Clerk user ID
  name text,
  birthday date,
  sex_at_birth text,
  gender_identity text,
  ethnicity text,
  height numeric,
  weight numeric,
  blood_type text,
  phone text,
  occupation text,
  marital_status text,
  diet_type text,
  physical_activity_level text,
  pcos_diagnosed boolean default false,
  cycle_regularity text,
  main_symptoms text[], -- array of symptom strings
  onboarding_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 2. CHECK-IN ENTRIES (Unified logging)
-- =============================================
create table public.check_in_entries (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade not null,
  tracker_type text not null, -- 'journal','mood','symptoms','medications','sleep','water','exercise','nutrition','cycle','weight','stress'
  data jsonb not null default '{}', -- flexible structured data per tracker type
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast lookups by user and date
create index check_in_entries_user_date_idx on public.check_in_entries (user_id, created_at desc);
create index check_in_entries_type_idx on public.check_in_entries (user_id, tracker_type, created_at desc);

-- =============================================
-- 3. TRACKER SETTINGS (Per-user visibility)
-- =============================================
create table public.tracker_settings (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade not null,
  tracker_type text not null,
  enabled boolean default true,
  display_order integer default 0,
  unique(user_id, tracker_type)
);

-- =============================================
-- 4. CYCLES
-- =============================================
create table public.cycles (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade not null,
  start_date date not null,
  end_date date,
  cycle_length integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index cycles_user_date_idx on public.cycles (user_id, start_date desc);

-- =============================================
-- 5. AI INSIGHTS
-- =============================================
create table public.ai_insights (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade not null,
  prompt_context text,
  response text not null,
  response_json jsonb,
  cache_key text,
  timeframe_days integer default 30,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index ai_insights_user_date_idx on public.ai_insights (user_id, created_at desc);
create index ai_insights_user_cache_idx on public.ai_insights (user_id, cache_key, created_at desc);

-- =============================================
-- 6. REMINDERS
-- =============================================
create table public.reminders (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade not null,
  title text not null,
  reminder_time time not null,
  days_of_week integer[] default '{1,2,3,4,5,6,7}', -- 1=Mon, 7=Sun
  enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 7. STREAKS
-- =============================================
create table public.streaks (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade unique not null,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_check_in_date date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;
alter table public.check_in_entries enable row level security;
alter table public.tracker_settings enable row level security;
alter table public.cycles enable row level security;
alter table public.ai_insights enable row level security;
alter table public.reminders enable row level security;
alter table public.streaks enable row level security;

-- Permissive policies: auth is enforced in Next.js server actions via Clerk
create policy "Allow all on profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all on check_in_entries" on public.check_in_entries for all using (true) with check (true);
create policy "Allow all on tracker_settings" on public.tracker_settings for all using (true) with check (true);
create policy "Allow all on cycles" on public.cycles for all using (true) with check (true);
create policy "Allow all on ai_insights" on public.ai_insights for all using (true) with check (true);
create policy "Allow all on reminders" on public.reminders for all using (true) with check (true);
create policy "Allow all on streaks" on public.streaks for all using (true) with check (true);
