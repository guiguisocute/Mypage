/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#f8f9fa', // 极简灰白底
        surface: '#ffffff',
        primary: '#18181b',    // 近乎黑色的主色
        secondary: '#71717a',  // 高级灰
        accent: '#2563eb',     // 克制的点缀蓝
      }
    },
  },
  plugins: [],
}
