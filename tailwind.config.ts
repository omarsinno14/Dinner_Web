import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
