/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep purple sampled from the Anandi Sarees logo (#54208C)
        royal: {
          DEFAULT: "#54208C",
          50: "#F2EAFB",
          100: "#E1CCF5",
          200: "#C39AEA",
          300: "#A46BDB",
          400: "#8746C4",
          500: "#6B2FA5",
          600: "#54208C",
          700: "#401A6B",
          800: "#2D124C",
          900: "#1B0A2E",
        },
        // Gold sampled from the logo's knot mark (#F7BA67)
        gold: {
          DEFAULT: "#F7BA67",
          50: "#FEF8EF",
          100: "#FCEBD1",
          200: "#F9D9A8",
          300: "#F7BA67",
          400: "#F2A53F",
          500: "#E58C22",
          600: "#BD6E17",
          700: "#905414",
          800: "#623A0F",
          900: "#392209",
        },
        cream: {
          DEFAULT: "#FBF5EC",
          100: "#FFFDFB",
          200: "#FBF5EC",
          300: "#F3E7D3",
        },
        charcoal: {
          DEFAULT: "#211F1E",
          light: "#3A3634",
        },
        // Admin panel neutral surface background
        surface: {
          DEFAULT: "#F7F5F2",
          dark: "#161414",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        heading: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      // Design-system reference scale (font.size.*, space.*) — additive tokens,
      // namespaced so they don't override Tailwind's existing xs/sm/lg/xl/2xl
      // scale already used throughout the site (colors/fonts stay unchanged).
      fontSize: {
        "ds-xs": ["13px", { lineHeight: "20.8px" }],
        "ds-sm": ["14px", { lineHeight: "20.8px" }],
        "ds-md": ["15px", { lineHeight: "20.8px" }],
        "ds-lg": ["16px", { lineHeight: "20.8px" }],
        "ds-xl": ["28px", { lineHeight: "1.2" }],
        "ds-2xl": ["40px", { lineHeight: "1.15" }],
      },
      spacing: {
        "ds-1": "7.5px",
        "ds-2": "8px",
        "ds-3": "10px",
        "ds-4": "12px",
        "ds-5": "14px",
        "ds-6": "16px",
        "ds-7": "23.24px",
        "ds-8": "30px",
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(84, 32, 140, 0.18)",
        gold: "0 0 0 1px rgba(247, 186, 103, 0.4)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FCEBD1 0%, #F7BA67 50%, #E58C22 100%)",
        "gold-gradient-vertical": "linear-gradient(180deg, #F9D9A8 0%, #F7BA67 60%, #BD6E17 100%)",
        "royal-gradient": "linear-gradient(135deg, #6B2FA5 0%, #401A6B 100%)",
        "royal-gradient-radial": "radial-gradient(circle at 30% 20%, #8746C4 0%, #54208C 45%, #2D124C 100%)",
        "royal-gold-gradient": "linear-gradient(120deg, #401A6B 0%, #54208C 45%, #BD6E17 100%)",
        "mesh-hero": "radial-gradient(at 15% 20%, rgba(135,70,196,0.55) 0px, transparent 55%), radial-gradient(at 85% 15%, rgba(247,186,103,0.35) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(64,26,107,0.6) 0px, transparent 55%)",
        "surface-gradient": "linear-gradient(180deg, #FFFDFB 0%, #FBF5EC 60%, #F3E7D3 100%)",
        "card-sheen": "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 40%)",
        "sidebar-gradient": "linear-gradient(180deg, #ffffff 0%, #F7F5F2 100%)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontSize: {
        "ds-xs": ["13px", { lineHeight: "20.8px" }],
        "ds-sm": ["14px", { lineHeight: "20.8px" }],
        "ds-md": ["15px", { lineHeight: "20.8px" }],
        "ds-lg": ["16px", { lineHeight: "20.8px" }],
        "ds-xl": ["28px", { lineHeight: "1.2" }],
        "ds-2xl": ["40px", { lineHeight: "1.15" }],
      },
      spacing: {
        "ds-1": "7.5px",
        "ds-2": "8px",
        "ds-3": "10px",
        "ds-4": "12px",
        "ds-5": "14px",
        "ds-6": "16px",
        "ds-7": "23.24px",
        "ds-8": "30px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        "scroll-x": "scroll-x 32s linear infinite",
        "scroll-x-slow": "scroll-x 48s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
