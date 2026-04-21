-- Profiles Table
create table public.profiles (
  id text primary key, -- matches Clerk user ID
  name text,
  age integer,
  weight numeric,
  pcos boolean,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Daily Logs Table
create table public.logs (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade not null,
  sleep numeric,
  water numeric,
  exercise integer,
  created_at date default CURRENT_DATE not null
);
-- Ensure only one log per user per day
create unique index logs_user_id_created_at_idx on public.logs (user_id, created_at);

-- Symptoms Table
create table public.symptoms (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade not null,
  type text not null,
  severity integer check (severity >= 1 and severity <= 5),
  created_at date default CURRENT_DATE not null
);

-- Cycles Table
create table public.cycles (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id) on delete cascade not null,
  start_date date not null,
  end_date date
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.logs enable row level security;
alter table public.symptoms enable row level security;
alter table public.cycles enable row level security;

-- Policies (assuming 'request.jwt.sub' holds the Clerk user ID in a custom webhook or decoded token, but typically if inserting from server route with service role key, RLS can be bypassed for that route. For client-side, proper Clerk/Supabase integration via custom JWT needs to be set up)
