-- Categories, each with an optional monthly budget in euros
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  monthly_budget numeric(12, 2) check (monthly_budget is null or monthly_budget >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- Spending entries: money already spent
create table public.spending (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  spent_on date not null default current_date,
  category_id uuid references public.categories (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index spending_user_date_idx on public.spending (user_id, spent_on desc);
create index spending_category_idx on public.spending (category_id);

alter table public.categories enable row level security;
alter table public.spending enable row level security;

create policy "Own categories" on public.categories
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Own spending" on public.spending
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Give every new user the starter categories
create function public.create_starter_categories()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.categories (user_id, name)
  select new.id, name
  from unnest(array[
    'Groceries', 'Eating out', 'Transport', 'Car', 'Bills', 'Rent',
    'Subscriptions', 'Health', 'Shopping', 'Other'
  ]) as name;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_starter_categories();
