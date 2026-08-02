-- AlgoYo‘l mastery curriculum: ownership, rich lessons, quizzes and strict unlocking.
alter table public.roadmaps add column if not exists owner_id uuid references public.profiles(id);
alter table public.roadmaps add column if not exists prerequisite_roadmap_id uuid references public.roadmaps(id);
alter table public.roadmaps add column if not exists min_rating integer not null default 800;
alter table public.roadmaps add column if not exists max_rating integer not null default 2200;
alter table public.roadmaps add column if not exists estimated_minutes integer not null default 180;
alter table public.roadmaps add column if not exists archived_at timestamptz;

alter table public.lessons add column if not exists summary_uz text not null default '';
alter table public.lessons add column if not exists summary_en text not null default '';
alter table public.lessons add column if not exists complexity_text text not null default '';
alter table public.lessons add column if not exists cpp_example text not null default '';
alter table public.lessons add column if not exists python_example text not null default '';
alter table public.lessons add column if not exists estimated_minutes integer not null default 20;
alter table public.lessons add column if not exists min_rating integer not null default 800;
alter table public.lessons add column if not exists max_rating integer not null default 1200;

create table if not exists public.lesson_quizzes (
  id uuid primary key default gen_random_uuid(), lesson_id uuid not null unique references public.lessons on delete cascade,
  question_uz text not null, question_en text not null, passing_score integer not null default 70 check(passing_score between 1 and 100)
);
create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(), quiz_id uuid not null references public.lesson_quizzes on delete cascade,
  text_uz text not null, text_en text not null, is_correct boolean not null default false, sort_order integer not null
);
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles on delete cascade,
  quiz_id uuid not null references public.lesson_quizzes on delete cascade, score integer not null check(score between 0 and 100),
  passed boolean not null, created_at timestamptz not null default now()
);
create table if not exists public.lesson_problems (
  lesson_id uuid primary key references public.lessons on delete cascade, problem_id uuid not null references public.problems,
  required_verdict public.submission_status not null default 'accepted'
);
create table if not exists public.lesson_completions (
  user_id uuid references public.profiles on delete cascade, lesson_id uuid references public.lessons on delete cascade,
  quiz_passed_at timestamptz, problem_accepted_at timestamptz, completed_at timestamptz,
  primary key(user_id,lesson_id)
);

create index if not exists idx_lessons_section_order on public.lessons(section_id,sort_order);
create index if not exists idx_quiz_attempts_user_quiz on public.quiz_attempts(user_id,quiz_id,created_at desc);
create index if not exists idx_roadmaps_owner on public.roadmaps(owner_id) where archived_at is null;

alter table public.lesson_quizzes enable row level security; alter table public.quiz_options enable row level security;
alter table public.quiz_attempts enable row level security; alter table public.lesson_problems enable row level security;
alter table public.lesson_completions enable row level security;
create policy "published quizzes" on public.lesson_quizzes for select using(exists(select 1 from public.lessons l join public.roadmap_sections s on s.id=l.section_id join public.roadmaps r on r.id=s.roadmap_id where l.id=lesson_id and r.published and r.archived_at is null));
create policy "published quiz options" on public.quiz_options for select using(exists(select 1 from public.lesson_quizzes q join public.lessons l on l.id=q.lesson_id join public.roadmap_sections s on s.id=l.section_id join public.roadmaps r on r.id=s.roadmap_id where q.id=quiz_id and r.published and r.archived_at is null));
create policy "own quiz attempts" on public.quiz_attempts for select using(user_id=auth.uid());
create policy "own completions" on public.lesson_completions for select using(user_id=auth.uid());

drop policy if exists "roadmap author insert" on public.roadmaps;
create policy "roadmap author insert" on public.roadmaps for insert with check(owner_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','owner')));
drop policy if exists "roadmap author update" on public.roadmaps;
create policy "roadmap author update" on public.roadmaps for update using(owner_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='owner'));

create or replace function public.lesson_is_unlocked(p_lesson uuid,p_user uuid) returns boolean language sql stable security definer set search_path=public as $$
  with target as (select l.section_id,l.sort_order from lessons l where l.id=p_lesson), previous as (
    select l.id from lessons l,target t where l.section_id=t.section_id and l.sort_order<t.sort_order order by l.sort_order desc limit 1
  ) select not exists(select 1 from previous) or exists(select 1 from lesson_completions c join previous p on p.id=c.lesson_id where c.user_id=p_user and c.completed_at is not null)
$$;
create or replace function public.refresh_lesson_completion(p_lesson uuid) returns boolean language plpgsql security definer set search_path=public as $$
declare q_passed timestamptz; p_accepted timestamptz; begin
  if not lesson_is_unlocked(p_lesson,auth.uid()) then raise exception 'lesson_locked'; end if;
  select max(a.created_at) into q_passed from quiz_attempts a join lesson_quizzes q on q.id=a.quiz_id where a.user_id=auth.uid() and q.lesson_id=p_lesson and a.passed;
  select max(s.created_at) into p_accepted from submissions s join lesson_problems lp on lp.problem_id=s.problem_id where s.user_id=auth.uid() and lp.lesson_id=p_lesson and s.status='accepted';
  insert into lesson_completions(user_id,lesson_id,quiz_passed_at,problem_accepted_at,completed_at) values(auth.uid(),p_lesson,q_passed,p_accepted,case when q_passed is not null and p_accepted is not null then now() end)
  on conflict(user_id,lesson_id) do update set quiz_passed_at=excluded.quiz_passed_at,problem_accepted_at=excluded.problem_accepted_at,completed_at=excluded.completed_at;
  return q_passed is not null and p_accepted is not null;
end $$;

insert into public.roadmaps(slug,title_uz,title_en,description_uz,description_en,sort_order,published,min_rating,max_rating,estimated_minutes) values
('foundations','Asoslar va murakkablik','Foundations & Complexity','Algoritm tezligi, xotira va to‘g‘ri baholash.','Reason about runtime, memory, and constraints.',1,true,800,1100,180),
('sorting','Saralash algoritmlari','Sorting Algorithms','Saralash usullarini tanlash va qo‘llash.','Choose and apply the right sorting method.',2,true,800,1400,180),
('binary-search','Ikkilik qidiruv','Binary Search','Qidiruv maydonini yarmiga qisqartirish.','Cut the search space in half.',3,true,900,1600,190),
('two-pointers','Ikki ko‘rsatkich va oyna','Two Pointers & Sliding Window','Segmentlarni chiziqli vaqtda boshqarish.','Manage ranges in linear time.',4,true,900,1600,190),
('greedy','Ochko‘z algoritmlar','Greedy Algorithms','Mahalliy tanlovdan global optimumga.','Turn local choices into global optima.',5,true,1000,1800,210),
('backtracking','Rekursiya va backtracking','Recursion & Backtracking','Holat daraxtini xavfsiz kezish.','Explore state trees safely.',6,true,900,1700,210),
('data-structures','Ma’lumot tuzilmalari','Data Structures','Ma’lumotni tez so‘rash va yangilash.','Query and update data efficiently.',7,true,1000,1900,230),
('graphs','Graf algoritmlari','Graph Algorithms','Tugunlar va qirralar orasidagi yo‘llar.','Navigate nodes, edges, and paths.',8,true,1000,2100,240),
('trees','Daraxt algoritmlari','Tree Algorithms','Ierarxik graflarda samarali hisoblash.','Compute efficiently on hierarchical graphs.',9,true,1100,2200,240),
('dynamic-programming','Dinamik dasturlash','Dynamic Programming','Holat va o‘tishlar bilan qayta hisoblashni yo‘qotish.','Eliminate repeated work with states and transitions.',10,true,1100,2200,250),
('strings','Satr algoritmlari','String Algorithms','Matn ichidan andozalarni tez topish.','Find patterns inside text efficiently.',11,true,1000,2100,220),
('math','Matematika va sonlar nazariyasi','Math & Number Theory','Musobaqalar uchun arifmetika va kombinatorika.','Build contest-ready arithmetic and combinatorics.',12,true,900,2000,230)
on conflict(slug) do update set title_uz=excluded.title_uz,title_en=excluded.title_en,description_uz=excluded.description_uz,description_en=excluded.description_en,sort_order=excluded.sort_order,published=true,min_rating=excluded.min_rating,max_rating=excluded.max_rating,estimated_minutes=excluded.estimated_minutes;
