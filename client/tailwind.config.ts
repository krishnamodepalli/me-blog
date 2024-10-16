import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        backg: "var(--bg-main-col)",
        sbackg: "var(--bg-sub-col)",
        tp: "var(--text-main-col)",
        ts: "var(--text-sub-col)",
        tse: "var(--secondary-extra-text)",
        dim: "var(--dim-text)",

        skyblue: "var(--primary-col)",
      },
    },
  },
  plugins: [],
};
export default config;
