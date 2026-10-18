import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  },
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next/*", "@/app/*"],
              message: "Domain harus tetap murni dan tidak boleh bergantung pada Next.js atau app layer."
            }
          ]
        }
      ]
    }
  },
  { ignores: [".next/**", "node_modules/**", "playwright-report/**", "test-results/**"] }
);
