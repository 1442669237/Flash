-- =====================================================
-- 闪现小程序 - Supabase 数据库表结构
-- =====================================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(50) NOT NULL DEFAULT '匿名用户',
  avatar TEXT DEFAULT '',
  gender VARCHAR(20) DEFAULT 'unknown',
  tags TEXT[] DEFAULT '{}',
  credit_score INTEGER DEFAULT 100 CHECK (credit_score >= 0 AND credit_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 活动表
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  max_people INTEGER NOT NULL DEFAULT 2 CHECK (max_people >= 2 AND max_people <= 20),
  current_people INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'full', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT valid_people_count CHECK (current_people <= max_people)
);

-- 3. 活动参与表
CREATE TABLE IF NOT EXISTS activity_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- 4. 消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'location', 'system', 'image')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 索引
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_activities_creator ON activities(creator_id);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_location ON activities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_activities_expires ON activities(expires_at);
CREATE INDEX IF NOT EXISTS idx_participants_activity ON activity_participants(activity_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON activity_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_activity ON messages(activity_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

-- =====================================================
-- RLS (Row Level Security) 策略
-- =====================================================

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "用户可查看所有用户信息" ON users
  FOR SELECT USING (true);

CREATE POLICY "用户可更新自己的信息" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "用户可插入自己的信息" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 活动表策略
CREATE POLICY "活动可见所有人" ON activities
  FOR SELECT USING (true);

CREATE POLICY "创建者可更新活动" ON activities
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "已登录用户可创建活动" ON activities
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "创建者可删除活动" ON activities
  FOR DELETE USING (auth.uid() = creator_id);

-- 活动参与表策略
CREATE POLICY "参与者可查看参与信息" ON activity_participants
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM activity_participants WHERE activity_id = activity_id
    )
  );

CREATE POLICY "已登录用户可加入活动" ON activity_participants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "参与者可退出活动" ON activity_participants
  FOR DELETE USING (auth.uid() = user_id);

-- 消息表策略
CREATE POLICY "活动参与者可查看消息" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM activity_participants WHERE activity_id = messages.activity_id
    )
  );

CREATE POLICY "活动参与者可发送消息" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM activity_participants WHERE activity_id = activity_id
    )
  );

-- =====================================================
-- 自动更新时间戳的触发器
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 自动更新活动人数的触发器
-- =====================================================
CREATE OR REPLACE FUNCTION update_activity_people_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE activities
    SET current_people = current_people + 1
    WHERE id = NEW.activity_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE activities
    SET current_people = current_people - 1
    WHERE id = OLD.activity_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER participant_count_trigger
  AFTER INSERT OR DELETE ON activity_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_people_count();

-- =====================================================
-- 自动更新活动状态的触发器
-- =====================================================
CREATE OR REPLACE FUNCTION update_activity_status()
RETURNS TRIGGER AS $$
BEGIN
  -- 如果人数已满，标记为 full
  IF NEW.current_people >= NEW.max_people THEN
    UPDATE activities SET status = 'full' WHERE id = NEW.id;
  ELSE
    UPDATE activities SET status = 'active' WHERE id = NEW.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_status_trigger
  AFTER UPDATE OF current_people ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_status();

-- =====================================================
-- 清理过期活动的函数
-- =====================================================
CREATE OR REPLACE FUNCTION expire_old_activities()
RETURNS void AS $$
BEGIN
  UPDATE activities
  SET status = 'expired'
  WHERE status = 'active' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 可选：创建一个定时任务来清理过期活动（需要 pg_cron 扩展）
-- SELECT cron.schedule('cleanup-expired-activities', '*/5 * * * *', 'SELECT expire_old_activities()');
