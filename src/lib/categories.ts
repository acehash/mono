import { supabase } from "./supabase";
import type { Category } from "./types";

export async function getCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order("sort_order");

  if (error) throw error;
  return data || [];
}

export async function getCategoriesByType(
  userId: string,
  type: "income" | "expense"
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .eq("type", type)
    .order("sort_order");

  if (error) throw error;
  return data || [];
}
