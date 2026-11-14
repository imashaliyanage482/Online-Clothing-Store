/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        cream: {
          DEFAULT: '#F5F0E8',
          light: '#FAF7F2',
          dark: '#EDE5D8',
        },
        fashionBlack: {
          DEFAULT: '#252525',
          soft: '#2D2D2D',
          deep: '#1A1A1A',
        },
        beige: {
          DEFAULT: '#B69A7A',
          light: '#C7AD90',
          dark: '#A38666',
        },
        fashion: {
          bg: '#F5F0E8',
          cream: '#F5F0E8',
          sand: '#EBE3D5',
          muted: '#8E8880',
          dark: '#252525',
          beige: '#B69A7A',
          card: '#FAF7F2',
        },
      },
    },
  },
  plugins: [],
};

