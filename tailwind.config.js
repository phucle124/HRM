/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f6f1ea',
        panel: '#fffdf9',
        line: '#e5ddd3',
        brand: {
          DEFAULT: '#b79d84',
          deep: '#7c6754',
          soft: '#efe6dc',
          muted: '#d8cabc',
        },
      },
    },
  },
  plugins: [],
};
