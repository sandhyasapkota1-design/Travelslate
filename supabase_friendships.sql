-- ─── FRIENDSHIPS ─────────────────────────────────────────────
create table public.friendships (
  user_id    uuid references public.profiles(id) on delete cascade,
  friend_id  uuid references public.profiles(id) on delete cascade,
  status     text default 'pending', -- 'pending' | 'accepted'
  created_at timestamptz default now(),
  primary key (user_id, friend_id)
);
alter table public.friendships enable row level security;
create policy "Users can read own friendships" on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "Users can send friend requests" on public.friendships for insert
  with check (auth.uid() = user_id);
create policy "Users can update friendships they received" on public.friendships for update
  using (auth.uid() = friend_id);
create policy "Users can delete own friendships" on public.friendships for delete
  using (auth.uid() = user_id or auth.uid() = friend_id);

-- ─── UPDATE ENTRIES RLS ───────────────────────────────────────
-- Drop the old open policy and replace with friends-only
drop policy if exists "Users can read all entries" on public.entries;
create policy "Users can read own and friends entries" on public.entries for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.friendships f
      where status = 'accepted'
        and (
          (f.user_id = auth.uid() and f.friend_id = entries.user_id)
          or
          (f.friend_id = auth.uid() and f.user_id = entries.user_id)
        )
    )
  );
