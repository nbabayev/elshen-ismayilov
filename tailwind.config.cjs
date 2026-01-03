const { default: plugin } = require("@tailwindcss/line-clamp");

// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("@tailwindcss/line-clamp")],
  theme: {
    container: {
      center: true, // ortala (mx-auto yazmağa ehtiyac yoxdur)
      padding: "1rem", // default yan padding
      screens: {
        sm: "600px", // öz ölçülərin
        md: "728px",
        lg: "984px",
        xl: "1180px",
        // "2xl": "1496px",
      },
    },
    extend: {
      fontFamily: {
        lexend: ["var(--font-lexend)"],
        geist_san: ["var(--font-geist-sans)"],
        robotoSlab: ["var(--font-roboto-slab)"],
        geist_mono: ["var(--font-geist-mono)"],
        playfair: ["var(--playfair_Display)"],
      },
    },
    spacing: (() => {
      let pxScale = {};
      for (let i = 0; i <= 500; i++) {
        pxScale[i] = `${i}px`;
      }
      return pxScale;
    })(),
  },
};
