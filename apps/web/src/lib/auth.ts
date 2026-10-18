import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ShopRole } from "@/domain/iam/roles";

export type Membership = { shop_id: string; role: ShopRole; shops: { name: string }[] };

export async function getSessionAndMembership(): Promise<{ userId: string; memberships: Membership[] }> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("shop_memberships")
    .select("shop_id, role, shops(name)")
    .eq("user_id", user.id);

  if (error) throw new Error("Tidak dapat memuat keanggotaan toko.");
  return { userId: user.id, memberships: (data ?? []) as Membership[] };
}
