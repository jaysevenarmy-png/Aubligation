-- Players table
create table players (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  nickname text not null,
  created_at timestamptz default now()
);

-- Game sessions
create table game_sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id),
  started_at timestamptz default now(),
  completed_at timestamptz,
  total_score integer default 0
);

-- Riddle attempts
create table riddle_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references game_sessions(id),
  act_id text not null,
  riddle_id text not null,
  answer text,
  is_correct boolean,
  hints_used integer default 0,
  time_taken_seconds integer,
  points_earned integer default 0,
  attempted_at timestamptz default now()
);

-- Enable RLS
alter table players enable row level security;
alter table game_sessions enable row level security;
alter table riddle_attempts enable row level security;

-- Leaderboard view (public read)
create view leaderboard as
select
  p.nickname,
  gs.total_score as score,
  gs.completed_at,
  (
    select count(distinct ra.act_id)
    from riddle_attempts ra
    where ra.session_id = gs.id
  ) as acts_completed
from game_sessions gs
join players p on p.id = gs.player_id
where gs.completed_at is not null
order by gs.total_score desc
limit 10;
