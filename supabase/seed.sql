-- ============================================================
-- MeshROC 演示数据种子（在 Supabase Dashboard -> SQL Editor 以超级用户执行）
--
-- 设计目标：无论当前数据库里 comments / groups / messages 表的实际结构如何，
-- 本脚本都不会因「列不存在」而失败。做法：
--   1) 用 information_schema 动态检测并补齐 app 代码需要的列（幂等，已存在则跳过）；
--   2) 插入数据时先用 information_schema 过滤出「真实存在」的列，再拼装 INSERT。
--
-- 踩过的坑（已规避）：
--   * auth.users.confirmed_at 是生成列 -> 改用 email_confirmed_at
--   * groups.id / messages.group_id / group_members.* 是 uuid -> 用 uuid 字面量并 ::uuid 转换
--   * groups 没有 description 列 -> 不写
--   * groups.owner_id 是 uuid -> 用真实节点 uuid
-- ============================================================

-- 0. 幂等清理旧的演示数据（用 EXISTS 包裹，表不存在也不报错）
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='comments') THEN
    EXECUTE 'DELETE FROM public.comments WHERE post_id IN (''/meshroc-guestbook-longfast'',''/meshroc-guestbook-mediumfast'')';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='messages') THEN
    EXECUTE 'DELETE FROM public.messages WHERE group_id IN (''b1111111-1111-1111-1111-111111111101'',''b1111111-1111-1111-1111-111111111102'')';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='group_members') THEN
    EXECUTE 'DELETE FROM public.group_members WHERE group_id IN (''b1111111-1111-1111-1111-111111111101'',''b1111111-1111-1111-1111-111111111102'')';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='groups') THEN
    EXECUTE 'DELETE FROM public.groups WHERE id IN (''b1111111-1111-1111-1111-111111111101'',''b1111111-1111-1111-1111-111111111102'')';
  END IF;
END $$;

-- 1. 创建 8 个节点风格账号（auth.users.confirmed_at 不能写，用 email_confirmed_at）
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  aud, role, created_at, updated_at
)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'relay-a@meshroc.local',  extensions.crypt('MeshROC2026!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"username":"relay_a","nickname":"中继节点·A","avatar_url":"📡"}', 'authenticated', 'authenticated', now() - interval '30 days', now()),
  ('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'peak@meshroc.local',     extensions.crypt('MeshROC2026!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"username":"peak_node","nickname":"高山观测站","avatar_url":"🏔️"}', 'authenticated', 'authenticated', now() - interval '28 days', now()),
  ('a3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'sat@meshroc.local',       extensions.crypt('MeshROC2026!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"username":"sat_link","nickname":"卫星回传节点","avatar_url":"🛰️"}', 'authenticated', 'authenticated', now() - interval '25 days', now()),
  ('a4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'tide@meshroc.local',      extensions.crypt('MeshROC2026!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"username":"tide_station","nickname":"海岸电台","avatar_url":"🌊"}', 'authenticated', 'authenticated', now() - interval '22 days', now()),
  ('a5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'forest@meshroc.local',    extensions.crypt('MeshROC2026!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"username":"forest_relay","nickname":"密林中继","avatar_url":"🌲"}', 'authenticated', 'authenticated', now() - interval '18 days', now()),
  ('a6666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'urban@meshroc.local',     extensions.crypt('MeshROC2026!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"username":"urban_hub","nickname":"城区枢纽","avatar_url":"🏙️"}', 'authenticated', 'authenticated', now() - interval '14 days', now()),
  ('a7777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'loop@meshroc.local',      extensions.crypt('MeshROC2026!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"username":"loop_bridge","nickname":"环网桥接","avatar_url":"🔁"}', 'authenticated', 'authenticated', now() - interval '10 days', now()),
  ('a8888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'official@meshroc.local',  extensions.crypt('MeshROC2026!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"username":"meshroc_official","nickname":"MeshROC官方","avatar_url":"🌐"}', 'authenticated', 'authenticated', now() - interval '40 days', now());

-- 2. 回写 profiles（handle_new_user 触发器可能已建行，用 DO UPDATE 确保昵称/头像正确）
INSERT INTO public.profiles (id, username, nickname, email, avatar_url, signature, gender, real_name, created_at, updated_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'relay_a',       '中继节点·A',   'relay-a@meshroc.local',  '📡', '专注 LoRa 中继与链路优化',  'unknown', '', now() - interval '30 days', now()),
  ('a2222222-2222-2222-2222-222222222222', 'peak_node',     '高山观测站',   'peak@meshroc.local',     '🏔️', '山顶气象+中继，海拔 2100m', 'unknown', '', now() - interval '28 days', now()),
  ('a3333333-3333-3333-3333-333333333333', 'sat_link',      '卫星回传节点', 'sat@meshroc.local',      '🛰️', '用卫星链路把山地网络回传骨干', 'unknown', '', now() - interval '25 days', now()),
  ('a4444444-4444-4444-4444-444444444444', 'tide_station',  '海岸电台',     'tide@meshroc.local',     '🌊', '沿海岸线布点，关注潮汐对信号影响', 'unknown', '', now() - interval '22 days', now()),
  ('a5555555-5555-5555-5555-555555555555', 'forest_relay',  '密林中继',     'forest@meshroc.local',   '🌲', '密林穿透测试爱好者', 'unknown', '', now() - interval '18 days', now()),
  ('a6666666-6666-6666-6666-666666666666', 'urban_hub',     '城区枢纽',     'urban@meshroc.local',    '🏙️', '城市多点组网实验', 'unknown', '', now() - interval '14 days', now()),
  ('a7777777-7777-7777-7777-777777777777', 'loop_bridge',   '环网桥接',     'loop@meshroc.local',     '🔁', '负责把各子网桥接成环', 'unknown', '', now() - interval '10 days', now()),
  ('a8888888-8888-8888-8888-888888888888', 'meshroc_official','MeshROC官方', 'official@meshroc.local', '🌐', '互联之域 MeshROC 官方账号', 'unknown', '', now() - interval '40 days', now())
ON CONFLICT (id) DO UPDATE SET
  username  = EXCLUDED.username,
  nickname  = EXCLUDED.nickname,
  email     = EXCLUDED.email,
  avatar_url= EXCLUDED.avatar_url,
  signature = EXCLUDED.signature,
  updated_at= now();

-- 3. 动态补齐 app 需要的列（幂等：已存在则跳过；表不存在则跳过）
DO $$
BEGIN
  -- comments: app 用到 post_id, user_id, content, nickname, avatar_url, is_deleted
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='comments') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='comments' AND column_name='post_id') THEN
      EXECUTE 'ALTER TABLE public.comments ADD COLUMN post_id TEXT';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='comments' AND column_name='user_id') THEN
      EXECUTE 'ALTER TABLE public.comments ADD COLUMN user_id UUID';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='comments' AND column_name='nickname') THEN
      EXECUTE 'ALTER TABLE public.comments ADD COLUMN nickname TEXT';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='comments' AND column_name='avatar_url') THEN
      EXECUTE 'ALTER TABLE public.comments ADD COLUMN avatar_url TEXT';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='comments' AND column_name='is_deleted') THEN
      EXECUTE 'ALTER TABLE public.comments ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false';
    END IF;
  END IF;

  -- groups: app 用到 group_name, avatar_url, owner_id, is_top（id 已是 uuid 主键）
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='groups') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='groups' AND column_name='group_name') THEN
      EXECUTE 'ALTER TABLE public.groups ADD COLUMN group_name TEXT';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='groups' AND column_name='avatar_url') THEN
      EXECUTE 'ALTER TABLE public.groups ADD COLUMN avatar_url TEXT';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='groups' AND column_name='owner_id') THEN
      EXECUTE 'ALTER TABLE public.groups ADD COLUMN owner_id UUID';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='groups' AND column_name='is_top') THEN
      EXECUTE 'ALTER TABLE public.groups ADD COLUMN is_top BOOLEAN NOT NULL DEFAULT false';
    END IF;
  END IF;

  -- messages: app 用到 from_user_id, to_user_id, group_id, content, created_at
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='messages') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='from_user_id') THEN
      EXECUTE 'ALTER TABLE public.messages ADD COLUMN from_user_id UUID';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='to_user_id') THEN
      EXECUTE 'ALTER TABLE public.messages ADD COLUMN to_user_id UUID';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='group_id') THEN
      EXECUTE 'ALTER TABLE public.messages ADD COLUMN group_id UUID';
    END IF;
  END IF;
END $$;

-- 4. 通用 INSERT 构造器：仅使用「真实存在」的列，杜绝列不存在报错
CREATE OR REPLACE FUNCTION meshroc_seed_insert(
  p_table text,
  p_rows jsonb
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_cols text[];
  v_row  jsonb;
  v_keys text[];
  v_col  text;
  v_val  text;
  v_sql  text;
  v_placeholders text;
  v_pair text;
  r      record;
BEGIN
  -- 取表真实存在的列名
  SELECT array_agg(column_name::text)
    INTO v_cols
    FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = p_table;

  FOR v_row IN SELECT jsonb_array_elements(p_rows) LOOP
    -- 兜底：若表有 NOT NULL 的 username 列、数据只给了 nickname，则用 nickname 填充 username
    IF 'username' = ANY(v_cols) AND NOT (v_row ? 'username') AND (v_row ? 'nickname') THEN
      v_row := v_row || jsonb_build_object('username', v_row->>'nickname');
    END IF;
    v_keys := ARRAY[]::text[];
    v_placeholders := '';
    FOR v_col IN SELECT * FROM jsonb_object_keys(v_row) LOOP
      IF v_col = ANY(v_cols) THEN
        v_keys := array_append(v_keys, v_col);
        -- 文本值统一用 quote_literal 转义
        v_val := v_row ->> v_col;
        v_pair := CASE WHEN v_val IS NULL THEN 'NULL'
                       ELSE quote_literal(v_val) END;
        v_placeholders := v_placeholders || v_pair || ', ';
      END IF;
    END LOOP;
    -- 兜底填充：NOT NULL 且无默认值、但数据未提供的列，给一个类型占位值，避免违反非空约束
    FOR r IN
      SELECT column_name, data_type
        FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = p_table
         AND is_nullable = 'NO' AND column_default IS NULL
         AND column_name <> ALL(v_keys)
    LOOP
      v_keys := array_append(v_keys, r.column_name);
      IF r.data_type IN ('uuid') THEN
        v_placeholders := v_placeholders || quote_literal('00000000-0000-0000-0000-000000000000') || ', ';
      ELSIF r.data_type IN ('boolean') THEN
        v_placeholders := v_placeholders || 'false, ';
      ELSIF r.data_type IN ('timestamp','timestamptz','timestamp with time zone','timestamp without time zone') THEN
        v_placeholders := v_placeholders || 'now(), ';
      ELSIF r.data_type IN ('integer','bigint','smallint','numeric','real','double precision') THEN
        v_placeholders := v_placeholders || '0, ';
      ELSIF r.data_type IN ('json','jsonb') THEN
        v_placeholders := v_placeholders || quote_literal('{}') || ', ';
      ELSE
        v_placeholders := v_placeholders || quote_literal('') || ', ';
      END IF;
    END LOOP;
    -- 去掉末尾逗号与空格
    v_placeholders := rtrim(v_placeholders, ', ');
    v_sql := format('INSERT INTO public.%I (%s) VALUES (%s)',
                   p_table, array_to_string(v_keys, ', '), v_placeholders);
    EXECUTE v_sql;
  END LOOP;
END;
$$;

-- 5. 插入群（只写存在的列；group_name/owner_id/is_top 若表未补列则自动跳过）
SELECT meshroc_seed_insert('groups', jsonb_build_array(
  jsonb_build_object(
    'id', 'b1111111-1111-1111-1111-111111111101',
    'name', '主交流群',
    'group_name', '主交流群',
    'avatar_url', '🌐',
    'owner_id', 'a8888888-8888-8888-8888-888888888888',
    'created_by', 'a8888888-8888-8888-8888-888888888888',
    'is_top', true
  ),
  jsonb_build_object(
    'id', 'b1111111-1111-1111-1111-111111111102',
    'name', 'LongFast 频道',
    'group_name', 'LongFast 频道',
    'avatar_url', '📡',
    'owner_id', 'a8888888-8888-8888-8888-888888888888',
    'created_by', 'a8888888-8888-8888-8888-888888888888',
    'is_top', false
  )
));

-- 6. 群成员（uuid 交叉连接，显式 ::uuid）
INSERT INTO public.group_members (group_id, user_id, joined_at)
SELECT g.id::uuid, u.id::uuid, now()
FROM (VALUES
  ('b1111111-1111-1111-1111-111111111101'),
  ('b1111111-1111-1111-1111-111111111102')
) AS g(id)
CROSS JOIN (VALUES
  ('a1111111-1111-1111-1111-111111111111'),
  ('a2222222-2222-2222-2222-222222222222'),
  ('a3333333-3333-3333-3333-333333333333'),
  ('a4444444-4444-4444-4444-444444444444'),
  ('a5555555-5555-5555-5555-555555555555'),
  ('a6666666-6666-6666-6666-666666666666'),
  ('a7777777-7777-7777-7777-777777777777'),
  ('a8888888-8888-8888-8888-888888888888')
) AS u(id)
ON CONFLICT DO NOTHING;

-- 7. 留言板：LongFast 频道
SELECT meshroc_seed_insert('comments', jsonb_build_array(
  jsonb_build_object('post_id','/meshroc-guestbook-longfast','user_id','a8888888-8888-8888-8888-888888888888','content','欢迎来到 LongFast 频道～这里专门聊长距离低速率的组网调参。','nickname','MeshROC官方','avatar_url','🌐','is_deleted',false),
  jsonb_build_object('post_id','/meshroc-guestbook-longfast','user_id','a1111111-1111-1111-1111-111111111111','content','我这边中继节点开了 LongFast，空旷地直线能跑到 8km 左右，山体绕射损耗比想象中小。','nickname','中继节点·A','avatar_url','📡','is_deleted',false),
  jsonb_build_object('post_id','/meshroc-guestbook-longfast','user_id','a2222222-2222-2222-2222-222222222222','content','山顶站实测：同样功率下 LongFast 比 ShortFast 远了将近一倍，代价是发一条消息要等半秒多。','nickname','高山观测站','avatar_url','🏔️','is_deleted',false),
  jsonb_build_object('post_id','/meshroc-guestbook-longfast','user_id','a5555555-5555-5555-5555-555555555555','content','密林里 LongFast 穿透明显更好，但重传次数上去了，建议把 hop_limit 调到 4。','nickname','密林中继','avatar_url','🌲','is_deleted',false),
  jsonb_build_object('post_id','/meshroc-guestbook-longfast','user_id','a7777777-7777-7777-7777-777777777777','content','环网这边把几个 LongFast 簇桥起来后，端到端时延控制在 2s 内，体验可以。','nickname','环网桥接','avatar_url','🔁','is_deleted',false),
  jsonb_build_object('post_id','/meshroc-guestbook-longfast','user_id','a3333333-3333-3333-3333-333333333333','content','卫星回传节点提醒：LongFast 帧更长，卫星上行星座要注意时隙占用，别把整个超帧占满。','nickname','卫星回传节点','avatar_url','🛰️','is_deleted',false)
));

-- 8. 留言板：MediumFast 频道
SELECT meshroc_seed_insert('comments', jsonb_build_array(
  jsonb_build_object('post_id','/meshroc-guestbook-mediumfast','user_id','a8888888-8888-8888-8888-888888888888','content','MediumFast 频道适合城区多点密集通信，速率和覆盖比较均衡。','nickname','MeshROC官方','avatar_url','🌐','is_deleted',false),
  jsonb_build_object('post_id','/meshroc-guestbook-mediumfast','user_id','a6666666-6666-6666-6666-666666666666','content','城区枢纽实测 MediumFast：楼宇之间基本能通，单跳 1.5km，组了 12 个节点的小网。','nickname','城区枢纽','avatar_url','🏙️','is_deleted',false),
  jsonb_build_object('post_id','/meshroc-guestbook-mediumfast','user_id','a4444444-4444-4444-4444-444444444444','content','海岸电台补充：靠海湿度大，MediumFast 在清晨雾天衰减明显，建议预留 3dB 余量。','nickname','海岸电台','avatar_url','🌊','is_deleted',false),
  jsonb_build_object('post_id','/meshroc-guestbook-mediumfast','user_id','a1111111-1111-1111-1111-111111111111','content','中继角度：MediumFast 做骨干回传有点吃力，更适合做叶子节点的接入层。','nickname','中继节点·A','avatar_url','📡','is_deleted',false)
));

-- 9. 聊天室消息：主交流群
SELECT meshroc_seed_insert('messages', jsonb_build_array(
  jsonb_build_object('from_user_id','a8888888-8888-8888-8888-888888888888','to_user_id','a8888888-8888-8888-8888-888888888888','group_id','b1111111-1111-1111-1111-111111111101','content','📌 欢迎来到 MeshROC 主交流群！这里讨论 Meshtastic 离线组网、固件刷写与节点部署。'),
  jsonb_build_object('from_user_id','a2222222-2222-2222-2222-222222222222','to_user_id','a2222222-2222-2222-2222-222222222222','group_id','b1111111-1111-1111-1111-111111111101','content','刚把固件刷到 2.5.x，节点命名规范建议用「位置+角色」，比如「高山观测站」。'),
  jsonb_build_object('from_user_id','a6666666-6666-6666-6666-666666666666','to_user_id','a6666666-6666-6666-6666-666666666666','group_id','b1111111-1111-1111-1111-111111111101','content','城区实测一把：12 节点 Mesh，断电一台骨干，剩余自动绕路，体验不错。'),
  jsonb_build_object('from_user_id','a7777777-7777-7777-7777-777777777777','to_user_id','a7777777-7777-7777-7777-777777777777','group_id','b1111111-1111-1111-1111-111111111101','content','环网拓扑记得把关键桥接节点接双电源，不然单点挂了整环裂开。'),
  jsonb_build_object('from_user_id','a1111111-1111-1111-1111-111111111111','to_user_id','a1111111-1111-1111-1111-111111111111','group_id','b1111111-1111-1111-1111-111111111101','content','中继节点建议固定天线高度 + 外置 LNA，远距离链路收益很大。')
));

-- 10. 聊天室消息：LongFast 频道
SELECT meshroc_seed_insert('messages', jsonb_build_array(
  jsonb_build_object('from_user_id','a2222222-2222-2222-2222-222222222222','to_user_id','a2222222-2222-2222-2222-222222222222','group_id','b1111111-1111-1111-1111-111111111102','content','山顶站 LongFast 调参笔记：region 用 CN_470，功率拉到 30dBm 合法上限。'),
  jsonb_build_object('from_user_id','a3333333-3333-3333-3333-333333333333','to_user_id','a3333333-3333-3333-3333-333333333333','group_id','b1111111-1111-1111-1111-111111111102','content','卫星回传侧把 LongFast 的 slot 预留出来，避免和 ShortFast 抢时隙。')
));

-- 清理临时函数
DROP FUNCTION IF EXISTS meshroc_seed_insert(text, jsonb);

-- 完成提示
SELECT 'seed done: 8 users, groups, guestbook (longfast/mediumfast), chat messages inserted (columns auto-adapted).' AS result;
