-- ============================================================
-- Travel Slate — Supabase Schema
-- Paste this into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  name        text not null,
  avatar      text,
  avatar_url  text,
  bio         text,
  tags        text[] default '{}',
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can read all profiles"  on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar', '✈️')
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── ENTRIES ─────────────────────────────────────────────────
create table public.entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  city        text,
  state       text,
  country     text default 'USA',
  type        text,
  cuisine     text,
  dish        text,
  rating      int check (rating between 1 and 5),
  verdict     text,
  notes       text,
  tags        text[] default '{}',
  photo_url   text,
  created_at  timestamptz default now()
);
alter table public.entries enable row level security;
create policy "Users can read all entries"   on public.entries for select using (true);
create policy "Users can insert own entries" on public.entries for insert with check (auth.uid() = user_id);
create policy "Users can update own entries" on public.entries for update using (auth.uid() = user_id);
create policy "Users can delete own entries" on public.entries for delete using (auth.uid() = user_id);

-- ─── TRIPS ───────────────────────────────────────────────────
create table public.trips (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  destination text not null,
  start_date  date,
  end_date    date,
  completed   boolean default false,
  notes       text,
  cover_photo text,
  created_at  timestamptz default now()
);

-- ─── TRIP MEMBERS ────────────────────────────────────────────
-- Created before trips RLS policies so the policy can reference this table
create table public.trip_members (
  trip_id   uuid references public.trips(id) on delete cascade,
  user_id   uuid references public.profiles(id) on delete cascade,
  role      text default 'viewer',
  primary key (trip_id, user_id)
);

-- Now add trips RLS (trip_members exists now)
alter table public.trips enable row level security;
create policy "Users can read own or shared trips" on public.trips for select
  using (auth.uid() = user_id or exists (
    select 1 from public.trip_members where trip_id = trips.id and user_id = auth.uid()
  ));
create policy "Users can insert own trips" on public.trips for insert with check (auth.uid() = user_id);
create policy "Users can update own trips" on public.trips for update using (auth.uid() = user_id);
create policy "Users can delete own trips" on public.trips for delete using (auth.uid() = user_id);

alter table public.trip_members enable row level security;
create policy "Trip owner can manage members" on public.trip_members for all
  using (exists (select 1 from public.trips where id = trip_id and user_id = auth.uid()));
create policy "Members can read their own membership" on public.trip_members for select
  using (auth.uid() = user_id);

-- ─── TRIP DAYS ────────────────────────────────────────────────
create table public.trip_days (
  id          uuid primary key default uuid_generate_v4(),
  trip_id     uuid not null references public.trips(id) on delete cascade,
  day_number  int not null,
  name        text,
  city        text,
  notes       text,
  unique (trip_id, day_number)
);
alter table public.trip_days enable row level security;
create policy "Trip access controls day access" on public.trip_days for all
  using (exists (
    select 1 from public.trips t
    where t.id = trip_id
      and (t.user_id = auth.uid() or exists (
        select 1 from public.trip_members where trip_id = t.id and user_id = auth.uid()
      ))
  ));

-- ─── TRIP PLACES ─────────────────────────────────────────────
create table public.trip_places (
  id                    uuid primary key default uuid_generate_v4(),
  day_id                uuid not null references public.trip_days(id) on delete cascade,
  entry_id              uuid references public.entries(id) on delete set null,
  name                  text not null,
  type                  text,
  city                  text,
  state                 text,
  verdict               text,
  cuisine               text,
  distance_from_prev    text,
  travel_time_from_prev text,
  visited               boolean default false,
  order_idx             int default 0
);
alter table public.trip_places enable row level security;
create policy "Trip access controls place access" on public.trip_places for all
  using (exists (
    select 1 from public.trip_days td
    join public.trips t on t.id = td.trip_id
    where td.id = day_id
      and (t.user_id = auth.uid() or exists (
        select 1 from public.trip_members where trip_id = t.id and user_id = auth.uid()
      ))
  ));

-- ─── PACK LIST ────────────────────────────────────────────────
create table public.pack_list_items (
  id        uuid primary key default uuid_generate_v4(),
  trip_id   uuid not null references public.trips(id) on delete cascade,
  text      text not null,
  packed    boolean default false,
  order_idx int default 0
);
alter table public.pack_list_items enable row level security;
create policy "Trip owner controls pack list" on public.pack_list_items for all
  using (exists (select 1 from public.trips where id = trip_id and user_id = auth.uid()));

-- ─── BOOK & RESERVE ──────────────────────────────────────────
create table public.book_remind_items (
  id        uuid primary key default uuid_generate_v4(),
  trip_id   uuid not null references public.trips(id) on delete cascade,
  text      text not null,
  order_idx int default 0
);
alter table public.book_remind_items enable row level security;
create policy "Trip owner controls book list" on public.book_remind_items for all
  using (exists (select 1 from public.trips where id = trip_id and user_id = auth.uid()));

-- ─── BOOKMARKS ───────────────────────────────────────────────
create table public.bookmarks (
  user_id    uuid references public.profiles(id) on delete cascade,
  entry_id   uuid references public.entries(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, entry_id)
);
alter table public.bookmarks enable row level security;
create policy "Users manage own bookmarks" on public.bookmarks for all
  using (auth.uid() = user_id);

-- ─── STORAGE BUCKET ──────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
  on conflict do nothing;
create policy "Anyone can read photos" on storage.objects for select
  using (bucket_id = 'photos');
create policy "Auth users can upload photos" on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "Users can delete own photos" on storage.objects for delete
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);
