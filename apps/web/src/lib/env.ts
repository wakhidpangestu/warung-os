import { z } from "zod";

const publicEnvSchema = z
  .object({
    NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("WarungOS"),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1)
  })
  .strict();

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function parsePublicEnv(input: Record<string, string | undefined>): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_APP_NAME: input.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: input.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: input.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: input.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });
}

export function getPublicEnv(): PublicEnv {
  return parsePublicEnv(process.env);
}
