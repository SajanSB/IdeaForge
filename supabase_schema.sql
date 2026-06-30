-- ============================================================
-- IdeaForge — Supabase Schema (idempotent — safe to re-run)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Custom types (skip if already exists) ────────────────────
do $$ begin
  create type project_status as enum ('draft','eliciting','reviewing','paying','generating','complete','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_provider as enum ('razorpay','stripe');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending','paid','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type complexity_level as enum ('Simple','Medium','Complex');
exception when duplicate_object then null; end $$;

-- ── profiles ─────────────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  created_at timestamptz default now() not null
);

-- ── projects ─────────────────────────────────────────────────
create table if not exists projects (
  id                  text primary key,
  user_id             uuid not null references auth.users(id) on delete cascade,
  idea_text           text not null,
  industry            text,
  tech_preference     text,
  status              project_status not null default 'draft',
  complexity          complexity_level,
  estimated_cost_inr  numeric(10,2),
  review_feedback     text,
  payment_provider    payment_provider,
  payment_id          text,
  payment_status      payment_status not null default 'pending',
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);

-- ── qa_responses ─────────────────────────────────────────────
create table if not exists qa_responses (
  id          uuid primary key default gen_random_uuid(),
  project_id  text not null references projects(id) on delete cascade,
  question    text not null,
  answer      text,
  skipped     boolean not null default false,
  order_index integer not null,
  created_at  timestamptz default now() not null,
  unique (project_id, order_index)
);

-- ── documents ────────────────────────────────────────────────
create table if not exists documents (
  id           uuid primary key default gen_random_uuid(),
  project_id   text not null references projects(id) on delete cascade,
  doc_type     text not null,
  content      text not null,
  generated_at timestamptz default now() not null,
  unique (project_id, doc_type)
);

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists projects_user_created_idx   on projects       (user_id, created_at desc);
create index if not exists qa_responses_project_idx    on qa_responses   (project_id, order_index);
create index if not exists documents_project_idx       on documents      (project_id);

-- ── updated_at trigger ───────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ begin
  create trigger projects_updated_at
    before update on projects
    for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

-- ── Auto-create profile on signup ────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

do $$ begin
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function handle_new_user();
exception when duplicate_object then null; end $$;

-- ── Row Level Security ────────────────────────────────────────
alter table profiles     enable row level security;
alter table projects     enable row level security;
alter table qa_responses enable row level security;
alter table documents    enable row level security;

-- profiles: own row only
do $$ begin
  create policy "profiles: own row" on profiles for all using (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- projects: own rows only
do $$ begin
  create policy "projects: own rows" on projects for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- qa_responses: via project ownership
do $$ begin
  create policy "qa_responses: via project" on qa_responses for all
    using (project_id in (select id from projects where user_id = auth.uid()));
exception when duplicate_object then null; end $$;

-- documents: via project ownership
do $$ begin
  create policy "documents: via project" on documents for all
    using (project_id in (select id from projects where user_id = auth.uid()));
exception when duplicate_object then null; end $$;

-- ── Realtime publications ─────────────────────────────────────
do $$ begin
  alter publication supabase_realtime add table documents;
exception when others then null; end $$;

do $$ begin
  alter publication supabase_realtime add table projects;
exception when others then null; end $$;
