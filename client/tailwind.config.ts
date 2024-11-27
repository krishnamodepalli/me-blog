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
        primary: "var(--primary-col)",

        t1: "var(--text-level-1)",
        t2: "var(--text-level-2)",
        t3: "var(--text-level-3)",
        t4: "var(--text-level-4)",

        bg1: "var(--bg-level-1)",
        bg2: "var(--bg-level-2)",
        bg3: "var(--bg-level-3)",
        bg4: "var(--bg-level-4)",
      },
    },
  },
  plugins: [],
};
export default config;
