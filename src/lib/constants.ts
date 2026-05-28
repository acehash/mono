export const CATEGORY_EMOJI: Record<string, string> = {
  "餐饮": "🍜", "交通": "🚌", "购物": "🛒", "娱乐": "🎬",
  "居住": "🏠", "医疗": "💊", "教育": "📚", "通讯": "📱",
  "工资": "💵", "奖金": "🎁", "投资": "📈", "兼职": "💼",
  "理财": "💰", "红包": "🧧",
  "其他收入": "📥", "其他支出": "📤",
};

export const CATEGORY_COLORS: Record<string, string> = {
  "餐饮": "#FF9500", "交通": "#007AFF", "购物": "#AF52DE", "娱乐": "#FF2D55",
  "居住": "#5856D6", "医疗": "#34C759", "教育": "#5AC8FA", "通讯": "#FF6482",
  "工资": "#2ECC71", "奖金": "#FFD60A", "投资": "#3498DB", "兼职": "#9B59B6",
  "其他收入": "#8E8E93", "其他支出": "#636366",
};

export function getCategoryEmoji(name: string): string {
  return CATEGORY_EMOJI[name] || "📝";
}

export function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[name] || "#8E8E93";
}

export function formatAmount(v: number): string {
  return parseFloat(v.toFixed(2)).toString();
}
