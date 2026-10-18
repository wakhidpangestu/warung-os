import type { NextConfig } from "next";

const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const contentSecurityPolicy = process.env.NODE_ENV === "development"
  ? `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' ${supabaseOrigin} ws://localhost:3000; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'`
  : `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ${supabaseOrigin}; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'`;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers: async () => [{
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Content-Security-Policy", value: contentSecurityPolicy }
    ]
  }]
};

export default nextConfig;
