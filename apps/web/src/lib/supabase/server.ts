import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnv } from "@/lib/env";

export async function createClient() {
  const publicEnv = getPublicEnv();
  const cookieStore = await cookies();
  return createServerClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (entries) => {
        try { entries.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server Component cannot set cookies. */ }
      }
    }
  });
}
