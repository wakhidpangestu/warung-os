import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  QRIS_ENABLED: z.enum(["true", "false"]).default("false"),
  CRON_SECRET: z.string().min(32),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(input: Record<string, string | undefined>): ServerEnv {
  return serverEnvSchema.parse({
    DATABASE_URL: input.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: input.SUPABASE_SERVICE_ROLE_KEY,
    AUTH_SECRET: input.AUTH_SECRET,
    QRIS_ENABLED: input.QRIS_ENABLED,
    CRON_SECRET: input.CRON_SECRET,
  });
}

export const serverEnv = parseServerEnv(process.env);
