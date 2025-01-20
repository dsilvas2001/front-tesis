/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      monstserrat: ['Montserrat', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
      primary: ['Open Sans', 'sans-serif']
    },
    extend: {
      colors: {
        primary: {
          400: '#f2be1d', // Primary base: usado para botones, enlaces o acciones principales.
          500: '#dda210', // Primary más fuerte (hover o énfasis).
          titulo: '#DDA10B', // Primary más fuerte (hover o énfasis).
        },
        secondary: {
          50: '#fdfae9',  // Usado para fondos muy claros.
          100: '#fcf5c5', // Fondos secundarios o destacados suaves.
        },
        accent: {
          200: '#fae88e', // Usado para resaltar componentes secundarios.
          300: '#f6d44e', // Usado para elementos complementarios (e.g., íconos).
        },
        warning: {
          600: '#c37f0b', // Advertencias, alertas fuertes.
          700: '#9b5b0d', // Mensajes serios o acciones críticas.
        },
        neutral: {
          800: '#814812', // Textos oscuros en fondos claros.
          900: '#6d3b16', // Bordes o sombras.
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
