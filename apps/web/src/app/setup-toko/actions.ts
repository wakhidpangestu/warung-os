"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const setupSchema = z.object({ name: z.string().trim().min(2).max(120) });
export type SetupState = { error?: string };

export async function setupShop(_: SetupState, formData: FormData): Promise<SetupState> {
  const parsed = setupSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: "Nama toko harus terdiri dari 2 sampai 120 karakter." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.rpc("create_shop_for_owner", { shop_name: parsed.data.name });
  if (error) return { error: "Toko belum dapat dibuat. Coba lagi." };
  redirect("/dashboard");
}
