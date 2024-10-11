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
        backg: "var(--primary-bg)",
        sbackg: "var(--secondary-bg)",
        tp: "var(--primary-text)",
        ts: "var(--secondary-text)",
        tse: "var(--secondary-extra-text)",
        dim: "var(--dim-text)",

        skyblue: "var(--skyblue)",
      },
    },
  },
  plugins: [],
};
export default config;
