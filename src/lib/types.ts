export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  user_id: string | null;
  type: TransactionType;
  name: string;
  icon: string;
  sort_order: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category_id: string;
  note: string | null;
  date: string;
  created_at: string;
}

export interface TransactionWithCategory extends Transaction {
  categories: Category;
}
