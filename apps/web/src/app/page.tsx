import { redirect } from "next/navigation";
import { getSessionAndMembership } from "@/lib/auth";

export default async function HomePage() {
  const { memberships } = await getSessionAndMembership();
  redirect(memberships.length > 0 ? "/dashboard" : "/setup-toko");
}
