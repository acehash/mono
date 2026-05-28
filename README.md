# Mono — 简单记账

极简个人记账 PWA，基于 Next.js + Supabase 构建。

## 功能

- **记一笔**：快速记录收入/支出，支持 8 个支出分类 + 6 个收入分类
- **流水页**：按月查看记录，支持编辑和删除，左滑单条操作
- **统计页**：饼图展示分类占比，趋势图查看收支变化
- **首页**：本月收支概览 + 支出 Top3 + 最近记录
- **PWA**：添加到主屏幕，支持离线访问
- **iPhone 快捷指令**：通过 API 快速记账

## 技术栈

- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Supabase (PostgreSQL)
- Recharts (图表)
- next-pwa (PWA 支持)

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入 Supabase 配置

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 环境变量

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

## 数据库

Supabase 中需要创建 `transactions` 表：

```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12,2) NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 按用户和日期查询
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
```

## 用户标识

首次访问自动生成 UUID，存储在 cookie（+ localStorage 备份）。所有数据库操作通过此 UUID 区分用户，无需登录。

## iPhone 快捷指令

通过 `POST /api/shortcut` 快速记账：

```json
{
  "type": "expense",
  "category": "餐饮",
  "amount": 35.5,
  "note": "午饭"
}
```

请求头需携带 `x-user-id`（从 cookie 读取）。

## 部署

```bash
npm run build
npm start
```

推荐部署到 Vercel，自动支持环境变量配置。
