export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#18a2be', dark: '#0d7a91', light: '#4fc3d8', xlight: '#e8f7fb' },
        dark: '#1a2332'
      },
      fontFamily: {
        arabic: ['"Noto Kufi Arabic"', 'sans-serif'],
        english: ['"Exo 2"', 'sans-serif']
      }
    }
  },
  plugins: []
}
