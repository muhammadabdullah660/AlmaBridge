/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

module.exports = {
  darkMode: ["class"], // Enable dark mode based on class
  content: [
    "./pages/**/*.{ts,tsx}", 
    "./components/**/*.{ts,tsx}", 
    "./app/**/*.{ts,tsx}", 
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space-grotesk)"], // Default sans font
        "space-grotesk": ["var(--font-space-grotesk)"], // Explicit custom font
      },
      colors: {
        background: "hsl(var(--background))", // Background color
        foreground: "hsl(var(--foreground))", // Foreground color
        accent: "hsl(var(--accent))",         // Accent color
      },
    },
  },
  plugins: [
    tailwindcssAnimate, // Use imported plugin
  ],
};
