-- 创建枚举类型
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- 分类表
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 交易记录表
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  category_id UUID NOT NULL REFERENCES categories(id),
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX idx_categories_user_type ON categories(user_id, type);

-- RLS 策略
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- categories: 系统预设对所有人可见，用户自定义仅自己可见
CREATE POLICY "System categories are viewable by everyone"
  ON categories FOR SELECT
  USING (user_id IS NULL);

CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- transactions: 仅自己可见
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- 预设分类数据
INSERT INTO categories (user_id, type, name, icon, sort_order) VALUES
  -- 支出分类
  (NULL, 'expense', '餐饮', 'utensils', 1),
  (NULL, 'expense', '交通', 'bus', 2),
  (NULL, 'expense', '购物', 'shopping-bag', 3),
  (NULL, 'expense', '居住', 'home', 4),
  (NULL, 'expense', '娱乐', 'gamepad', 5),
  (NULL, 'expense', '医疗', 'heart', 6),
  (NULL, 'expense', '教育', 'book', 7),
  (NULL, 'expense', '其他', 'more', 8),
  -- 收入分类
  (NULL, 'income', '工资', 'briefcase', 1),
  (NULL, 'income', '奖金', 'trophy', 2),
  (NULL, 'income', '理财', 'chart', 3),
  (NULL, 'income', '兼职', 'tool', 4),
  (NULL, 'income', '红包', 'gift', 5),
  (NULL, 'income', '其他', 'more', 6);
