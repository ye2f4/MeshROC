-- =========================================================
--  MeshROC 节点地图：节点表 + 可通联关系表
--  在 Supabase Dashboard → SQL Editor 中执行本文件
-- =========================================================

/* ---------------- 节点表 ---------------- */
create table if not exists public.mesh_nodes (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  name             text not null,
  short_name       text,
  hardware_model   text,
  role             text,
  altitude_type    text not null default 'meter',   -- 'floor' | 'meter'
  altitude_value   numeric not null default 0,
  antenna_gain     numeric default 0,               -- dBi
  battery_capacity numeric default 0,               -- mAh
  supports_mqtt    boolean not null default false,
  latitude         double precision,
  longitude        double precision,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists mesh_nodes_geo_idx on public.mesh_nodes (latitude, longitude);

/* ---------------- 可通联关系表 ---------------- */
create table if not exists public.mesh_node_links (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  from_node  uuid not null references public.mesh_nodes(id) on delete cascade,
  to_node    uuid not null references public.mesh_nodes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (from_node, to_node),
  check (from_node <> to_node)
);

create index if not exists mesh_node_links_from_idx on public.mesh_node_links (from_node);
create index if not exists mesh_node_links_to_idx   on public.mesh_node_links (to_node);

/* ---------------- 行级安全策略 ---------------- */
alter table public.mesh_nodes        enable row level security;
alter table public.mesh_node_links   enable row level security;

-- 地图展示需要公开可读
drop policy if exists "mesh_nodes public read"   on public.mesh_nodes;
create policy "mesh_nodes public read" on public.mesh_nodes
  for select using (true);

drop policy if exists "mesh_links public read"   on public.mesh_node_links;
create policy "mesh_links public read" on public.mesh_node_links
  for select using (true);

-- 社区共建：允许写入（如需登录后才可编辑，改为 references auth.users(id) 校验）
drop policy if exists "mesh_nodes insert" on public.mesh_nodes;
create policy "mesh_nodes insert" on public.mesh_nodes for insert with check (true);
drop policy if exists "mesh_nodes update" on public.mesh_nodes;
create policy "mesh_nodes update" on public.mesh_nodes for update using (true);
drop policy if exists "mesh_nodes delete" on public.mesh_nodes;
create policy "mesh_nodes delete" on public.mesh_nodes for delete using (true);

drop policy if exists "mesh_links insert" on public.mesh_node_links;
create policy "mesh_links insert" on public.mesh_node_links for insert with check (true);
drop policy if exists "mesh_links delete" on public.mesh_node_links;
create policy "mesh_links delete" on public.mesh_node_links for delete using (true);
