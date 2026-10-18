import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#166534",
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
