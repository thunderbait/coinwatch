"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";

function parseAmount(value: FormDataEntryValue | null) {
  const amount = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(amount) && amount > 0
    ? Math.round(amount * 100) / 100
    : null;
}

function parseBudget(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (text === "") return null;
  const budget = Number(text.replace(",", "."));
  return Number.isFinite(budget) && budget >= 0 ? budget : null;
}

function spendingFields(formData: FormData) {
  const amount = parseAmount(formData.get("amount"));
  const spentOn = String(formData.get("spent_on") ?? "");
  if (!amount || !/^\d{4}-\d{2}-\d{2}$/.test(spentOn)) {
    return null;
  }
  return {
    amount,
    spent_on: spentOn,
    category_id: String(formData.get("category_id") ?? "") || null,
    note: String(formData.get("note") ?? "").trim() || null,
  };
}

export async function addSpending(formData: FormData) {
  const { supabase } = await requireUser();
  const fields = spendingFields(formData);
  if (!fields) redirect("/add?error=1");

  const { error } = await supabase.from("spending").insert(fields);
  if (error) redirect("/add?error=1");

  revalidatePath("/", "layout");
  redirect("/?added=1");
}

export async function updateSpending(id: string, formData: FormData) {
  const { supabase } = await requireUser();
  const fields = spendingFields(formData);
  if (!fields) redirect(`/entries/${id}?error=1`);

  const { error } = await supabase.from("spending").update(fields).eq("id", id);
  if (error) redirect(`/entries/${id}?error=1`);

  revalidatePath("/", "layout");
  redirect("/history");
}

export async function deleteSpending(id: string) {
  const { supabase } = await requireUser();
  await supabase.from("spending").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect("/history");
}

export async function addCategory(formData: FormData) {
  const { supabase } = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (name) {
    await supabase.from("categories").insert({
      name,
      monthly_budget: parseBudget(formData.get("monthly_budget")),
    });
  }
  revalidatePath("/", "layout");
}

export async function updateCategory(id: string, formData: FormData) {
  const { supabase } = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (name) {
    await supabase
      .from("categories")
      .update({ name, monthly_budget: parseBudget(formData.get("monthly_budget")) })
      .eq("id", id);
  }
  revalidatePath("/", "layout");
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireUser();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/", "layout");
}

export async function signOut() {
  const { supabase } = await requireUser();
  await supabase.auth.signOut();
  redirect("/login");
}
