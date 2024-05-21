/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' if you want to use prefers-color-scheme
  theme: {
    extend: {
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
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
        "top-right-lg": "1.5rem", // Border radius for top-right corner
        "top-left-lg": "1.5rem", // Border radius for top-left corner
        "bottom-right-lg": "1.5rem", // Border radius for bottom-right corner
      },
      fontSize: {
        "custom-sm": "14px", // Custom small font size
        "custom-md": "18px", // Custom medium font size
        "custom-lg": "35px", // Custom large font size
        // Add more custom font sizes as needed
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
  darkMode: "class",
};
