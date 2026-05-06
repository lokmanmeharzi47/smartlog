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
        // Primary — Deep Navy
        primary: {
          DEFAULT: "#031635",
          container: "#1A2B4B",
          fixed: "#D8E2FF",
          "fixed-dim": "#B6C6EF",
        },
        // Secondary
        secondary: {
          DEFAULT: "#585E6D",
          container: "#DADFF1",
          fixed: "#DDE2F4",
          "fixed-dim": "#C1C6D8",
        },
        // Tertiary
        tertiary: {
          DEFAULT: "#231400",
          container: "#3E2700",
        },
        // Surface system
        surface: {
          DEFAULT: "#F8F9FA",
          bright: "#F8F9FA",
          dim: "#D9DADB",
          variant: "#E1E3E4",
          tint: "#4E5E81",
          container: {
            DEFAULT: "#EDEEEF",
            high: "#E7E8E9",
            highest: "#E1E3E4",
            low: "#F3F4F5",
            lowest: "#FFFFFF",
          },
        },
        // On-tokens
        "on-surface": {
          DEFAULT: "#191C1D",
          variant: "#44474E",
        },
        "on-primary": {
          DEFAULT: "#FFFFFF",
          container: "#8293B8",
        },
        "on-secondary": {
          DEFAULT: "#FFFFFF",
          container: "#5D6272",
        },
        // Background
        background: "#F8F9FA",
        "on-background": "#191C1D",
        // Semantic
        error: {
          DEFAULT: "#BA1A1A",
          container: "#FFDAD6",
        },
        "on-error": "#FFFFFF",
        "on-error-container": "#93000A",
        // Outline
        outline: {
          DEFAULT: "#75777F",
          variant: "#C5C6CF",
        },
        // Inverse
        "inverse-surface": "#2E3132",
        "inverse-on-surface": "#F0F1F2",
        "inverse-primary": "#B6C6EF",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.12", fontWeight: "700" }],
        "display-md": ["2.75rem", { lineHeight: "1.16", fontWeight: "700" }],
        "display-sm": ["2.25rem", { lineHeight: "1.22", fontWeight: "600" }],
        "headline-lg": ["2rem", { lineHeight: "1.25", fontWeight: "600" }],
        "headline-md": ["1.75rem", { lineHeight: "1.29", fontWeight: "600" }],
        "headline-sm": ["1.5rem", { lineHeight: "1.33", fontWeight: "600" }],
        "title-lg": ["1.375rem", { lineHeight: "1.27", fontWeight: "500" }],
        "title-md": ["1rem", { lineHeight: "1.5", fontWeight: "500", letterSpacing: "0.009375em" }],
        "title-sm": ["0.875rem", { lineHeight: "1.43", fontWeight: "500", letterSpacing: "0.00625em" }],
        "body-lg": ["1rem", { lineHeight: "1.5" }],
        "body-md": ["0.875rem", { lineHeight: "1.43" }],
        "body-sm": ["0.75rem", { lineHeight: "1.33" }],
        "label-lg": ["0.875rem", { lineHeight: "1.43", fontWeight: "500", letterSpacing: "0.00625em" }],
        "label-md": ["0.75rem", { lineHeight: "1.33", fontWeight: "500", letterSpacing: "0.03125em" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.45", fontWeight: "500", letterSpacing: "0.03125em" }],
      },
      borderRadius: {
        sm: "0.125rem",
        md: "0.375rem",
        DEFAULT: "0.25rem",      // ROUND_FOUR
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      spacing: {
        "0.5": "0.125rem",
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "7": "1.75rem",
        "8": "2rem",
        "9": "2.25rem",
        "10": "2.5rem",
        "11": "2.75rem",
        "12": "3rem",
        "14": "3.5rem",
        "16": "4rem",
        "18": "4.5rem",
        "20": "5rem",
        "24": "6rem",
        "28": "7rem",
        "32": "8rem",
        "36": "9rem",
        "40": "10rem",
        "48": "12rem",
        "56": "14rem",
        "64": "16rem",
        "72": "18rem",
        "80": "20rem",
      },
      boxShadow: {
        ambient: "0 16px 32px 0px rgba(25, 28, 29, 0.04)",
        float: "0 12px 32px 0px rgba(25, 28, 29, 0.08)",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #1A2B4B 0%, #031635 100%)",
        "surface-gradient": "linear-gradient(135deg, #F3F4F5 0%, #F8F9FA 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
