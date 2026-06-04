import next from "eslint-config-next";
import prettier from "eslint-plugin-prettier";

const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
      "no-undef": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
