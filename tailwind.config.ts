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
        cobalt: "#0047CC",
        "cobalt-dark": "#0039A6",
        "cobalt-light": "#1A5CE0",
        ink: "#080808",
        signal: "#E8002A",
        "off-white": "#F5F5F5",
      },
      fontFamily: {
        barlow: ["'Barlow'", "sans-serif"],
        "barlow-condensed": ["'Barlow Condensed'", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "0.95", letterSpacing: "-0.01em" }],
      },
    },
  },
  plugins: [],
};

export default config;
