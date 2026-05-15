-- ============================================================
-- 来悟单词书 Web 端 · Supabase Schema
-- 在 Supabase Dashboard > SQL Editor 中复制粘贴整段执行
-- ============================================================

-- 启用 pg_trgm 扩展（用于模糊搜索）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- 主表：words
-- ============================================================
CREATE TABLE IF NOT EXISTS words (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  pronunciation_us TEXT,
  pronunciation_uk TEXT,
  frequency_level SMALLINT DEFAULT 2 CHECK (frequency_level BETWEEN 1 AND 3),
  has_slang BOOLEAN DEFAULT false,
  has_mnemonic BOOLEAN DEFAULT false,
  pos_list TEXT[] DEFAULT ARRAY[]::TEXT[],
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 索引：保证搜索 / 筛选秒响应
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_word ON words(word);
CREATE INDEX IF NOT EXISTS idx_freq ON words(frequency_level);
CREATE INDEX IF NOT EXISTS idx_pos ON words USING GIN(pos_list);
CREATE INDEX IF NOT EXISTS idx_word_trgm ON words USING GIN(word gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_has_slang ON words(has_slang) WHERE has_slang = true;
CREATE INDEX IF NOT EXISTS idx_has_mnemonic ON words(has_mnemonic) WHERE has_mnemonic = true;

-- ============================================================
-- RLS：公开只读（评审展示无需账号）
-- ============================================================
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- 先删旧策略避免重复创建报错
DROP POLICY IF EXISTS "Public read access" ON words;

CREATE POLICY "Public read access"
  ON words FOR SELECT
  USING (true);

-- ============================================================
-- 完成。验证：
-- SELECT count(*) FROM words;
-- ============================================================
