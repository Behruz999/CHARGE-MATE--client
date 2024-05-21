/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // This handles the purge configuration
  darkMode: "class", // or 'media' if you want to use prefers-color-scheme
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        "white-70": "rgba(255, 255, 255, 0.7)",
      },
      transitionDuration: {
        400: "400ms",
        500: "500ms",
      },
      transitionTimingFunction: {
        "in-out-quad": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
      },
      borderRadius: {
        "top-right-lg": "1.5rem",
        "top-left-lg": "1.5rem",
        "bottom-right-lg": "1.5rem",
      },
      fontSize: {
        "custom-sm": "14px",
        "custom-md": "18px",
        "custom-lg": "35px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-center-webkit": {
          "text-align": "-webkit-center",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
