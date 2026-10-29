import "server-only";
import { requireUser } from "@/lib/supabase/server";

export type Category = {
  id: string;
  name: string;
  monthly_budget: number | null;
};

export type SpendingEntry = {
  id: string;
  amount: number;
  spent_on: string;
  note: string | null;
  category_id: string | null;
};

export async function getCategories(): Promise<Category[]> {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("categories")
    .select("id, name, monthly_budget")
    .order("name");
  return (data ?? []).map((c) => ({
    ...c,
    monthly_budget: c.monthly_budget === null ? null : Number(c.monthly_budget),
  }));
}

export async function getSpending(options: {
  from?: string;
  to?: string;
  categoryId?: string;
  limit?: number;
}): Promise<SpendingEntry[]> {
  const { supabase } = await requireUser();
  let query = supabase
    .from("spending")
    .select("id, amount, spent_on, note, category_id")
    .order("spent_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (options.from) query = query.gte("spent_on", options.from);
  if (options.to) query = query.lte("spent_on", options.to);
  if (options.categoryId) query = query.eq("category_id", options.categoryId);
  if (options.limit) query = query.limit(options.limit);
  const { data } = await query;
  return (data ?? []).map((s) => ({ ...s, amount: Number(s.amount) }));
}

export async function getSpendingEntry(id: string): Promise<SpendingEntry | null> {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("spending")
    .select("id, amount, spent_on, note, category_id")
    .eq("id", id)
    .maybeSingle();
  return data ? { ...data, amount: Number(data.amount) } : null;
}
