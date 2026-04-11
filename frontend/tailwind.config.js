// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'flame-glow': 'flame-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ember-float': 'ember-float 6s linear infinite',
      },
      keyframes: {
        'flame-glow': {
          '0%, 100%': { boxShadow: '0 0 10px 0px rgba(239, 68, 68, 0.5)' },
          '50%': { boxShadow: '0 0 25px 5px rgba(239, 68, 68, 0.7)' },
        },
        'ember-float': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translateY(-100px) scale(0.5)', opacity: '0' },
        }
      },
      backgroundImage: {
        'combat-village': "url('https://cdn.pixabay.com/photo/2021/09/20/12/35/soldier-6640656_1280.jpg')", // Ruined village fighting scene for hero bg
      }
    },
  },
  plugins: [],
}