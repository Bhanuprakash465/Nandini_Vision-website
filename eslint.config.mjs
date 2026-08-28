import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Flat ESLint config for Next.js 16 (App Router).
 */
const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "next-env.d.ts",
      "back/**",
    ],
  },
];

export default eslintConfig;
