create extension if not exists pgcrypto;
create type public.user_role as enum ('user','admin','owner');
create type public.problem_difficulty as enum ('easy','medium','hard');
create type public.submission_status as enum ('queued','judging','accepted','wrong_answer','compilation_error','runtime_error','time_limit','memory_limit','judge_error');
create type public.duel_status as enum ('waiting','active','finished','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-zA-Z0-9_]{3,24}$'),
  display_name text not null default '', avatar_url text,
  preferred_language text not null default 'uz' check (preferred_language in ('uz','en')),
  role public.user_role not null default 'user', duel_rating integer not null default 1200,
  solved_count integer not null default 0, created_at timestamptz not null default now()
);
create table public.roadmaps (id uuid primary key default gen_random_uuid(), slug text unique not null, title_uz text not null, title_en text not null, description_uz text not null, description_en text not null, sort_order int not null, published boolean not null default false);
create table public.roadmap_sections (id uuid primary key default gen_random_uuid(), roadmap_id uuid not null references public.roadmaps on delete cascade, title_uz text not null, title_en text not null, sort_order int not null);
create table public.lessons (id uuid primary key default gen_random_uuid(), section_id uuid not null references public.roadmap_sections on delete cascade, slug text not null, title_uz text not null, title_en text not null, content_uz text not null, content_en text not null, sort_order int not null, unique(section_id,slug));
create table public.lesson_progress (user_id uuid references public.profiles on delete cascade, lesson_id uuid references public.lessons on delete cascade, completed_at timestamptz not null default now(), primary key(user_id,lesson_id));
create table public.problems (id uuid primary key default gen_random_uuid(), author_id uuid not null references public.profiles, slug text unique not null, difficulty public.problem_difficulty not null, points int not null check(points in (100,200,300)), tags text[] not null default '{}', time_limit_ms int not null default 1000 check(time_limit_ms between 100 and 10000), memory_limit_kb int not null default 262144, published boolean not null default false, archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.problem_translations (problem_id uuid references public.problems on delete cascade, language text check(language in ('uz','en')), title text not null, statement text not null, input_format text not null, output_format text not null, constraints_text text not null, editorial text, primary key(problem_id,language));
create table public.problem_tests (id uuid primary key default gen_random_uuid(), problem_id uuid not null references public.problems on delete cascade, input text not null, expected_output text not null, is_sample boolean not null default false, sort_order int not null default 0);
create table public.submissions (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles, problem_id uuid not null references public.problems, duel_id uuid, language text not null check(language in ('cpp20','python3')), source_code text not null, status public.submission_status not null default 'queued', judge_token text, runtime_ms int, memory_kb int, created_at timestamptz not null default now());
create table public.duels (id uuid primary key default gen_random_uuid(), status public.duel_status not null default 'waiting', started_at timestamptz, ends_at timestamptz, finished_at timestamptz, current_stage int not null default 0 check(current_stage between 0 and 3), created_at timestamptz not null default now());
alter table public.submissions add constraint submissions_duel_fk foreign key(duel_id) references public.duels;
create table public.duel_participants (duel_id uuid references public.duels on delete cascade, user_id uuid references public.profiles, score int not null default 0, rating_before int not null, rating_after int, primary key(duel_id,user_id));
create table public.duel_problems (duel_id uuid references public.duels on delete cascade, stage int check(stage between 0 and 2), problem_id uuid references public.problems, points int not null, claimed_by uuid references public.profiles, claimed_at timestamptz, primary key(duel_id,stage), unique(duel_id,problem_id));
create table public.duel_invites (id uuid primary key default gen_random_uuid(), creator_id uuid references public.profiles, token_hash text unique not null, expires_at timestamptz not null, accepted_by uuid references public.profiles, created_at timestamptz not null default now());
create table public.matchmaking_entries (user_id uuid primary key references public.profiles, rating int not null, created_at timestamptz not null default now());
create table public.rating_history (id uuid primary key default gen_random_uuid(), duel_id uuid not null references public.duels, user_id uuid not null references public.profiles, rating_before int not null, rating_after int not null, delta int generated always as (rating_after-rating_before) stored, created_at timestamptz not null default now(), unique(duel_id,user_id));
create table public.audit_logs (id bigint generated always as identity primary key, actor_id uuid references public.profiles, action text not null, entity_type text not null, entity_id uuid, metadata jsonb not null default '{}', created_at timestamptz not null default now());

create index idx_problems_published_difficulty on public.problems(published,difficulty) where archived_at is null;
create index idx_submissions_user_problem on public.submissions(user_id,problem_id,created_at desc);
create index idx_duel_participants_user on public.duel_participants(user_id,duel_id);
create index idx_profiles_rating on public.profiles(duel_rating desc);
create index idx_matchmaking_rating_created on public.matchmaking_entries(rating,created_at);

alter table public.profiles enable row level security; alter table public.roadmaps enable row level security; alter table public.roadmap_sections enable row level security; alter table public.lessons enable row level security; alter table public.lesson_progress enable row level security; alter table public.problems enable row level security; alter table public.problem_translations enable row level security; alter table public.problem_tests enable row level security; alter table public.submissions enable row level security; alter table public.duels enable row level security; alter table public.duel_participants enable row level security; alter table public.duel_problems enable row level security; alter table public.duel_invites enable row level security; alter table public.matchmaking_entries enable row level security; alter table public.rating_history enable row level security; alter table public.audit_logs enable row level security;
create policy "public profiles" on public.profiles for select using(true);
create policy "own profile update" on public.profiles for update using(auth.uid()=id) with check(auth.uid()=id and role=(select role from public.profiles where id=auth.uid()));
create policy "published roadmaps" on public.roadmaps for select using(published or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='owner'));
create policy "published problems" on public.problems for select using((published and archived_at is null) or author_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='owner'));
create policy "admin problem insert" on public.problems for insert with check(author_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','owner')));
create policy "author problem update" on public.problems for update using(author_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='owner'));
create policy "own progress" on public.lesson_progress for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own submissions" on public.submissions for select using(user_id=auth.uid());
create policy "own submission insert" on public.submissions for insert with check(user_id=auth.uid());
create policy "duel participant read" on public.duels for select using(exists(select 1 from public.duel_participants dp where dp.duel_id=id and dp.user_id=auth.uid()));
create policy "participant rows" on public.duel_participants for select using(exists(select 1 from public.duel_participants mine where mine.duel_id=duel_id and mine.user_id=auth.uid()));
create policy "sanitized duel problems" on public.duel_problems for select using(exists(select 1 from public.duel_participants mine join public.duels d on d.id=mine.duel_id where mine.duel_id=duel_id and mine.user_id=auth.uid() and stage<=d.current_stage));

create or replace function public.bootstrap_profile() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,username,display_name,role) values(new.id, coalesce(new.raw_user_meta_data->>'username','user_'||substr(new.id::text,1,8)), coalesce(new.raw_user_meta_data->>'display_name',''), case when lower(new.email)=lower(current_setting('app.owner_email',true)) then 'owner'::public.user_role else 'user'::public.user_role end); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.bootstrap_profile();

create or replace function public.claim_duel_problem(p_duel uuid,p_stage int,p_user uuid) returns boolean language plpgsql security definer set search_path=public as $$ declare claimed int; begin update duel_problems set claimed_by=p_user,claimed_at=now() where duel_id=p_duel and stage=p_stage and claimed_by is null; get diagnostics claimed=row_count; if claimed=0 then return false; end if; update duel_participants dp set score=score+(select points from duel_problems where duel_id=p_duel and stage=p_stage) where dp.duel_id=p_duel and dp.user_id=p_user; update duels set current_stage=least(3,current_stage+1),status=case when p_stage=2 then 'finished'::duel_status else status end,finished_at=case when p_stage=2 then now() else finished_at end where id=p_duel and status='active' and now()<ends_at; return true; end $$;
