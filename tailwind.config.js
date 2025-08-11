
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { background:"#0b0c10", panel:"#121317", primary:"#00f0ff", positive:"#19c37d", negative:"#ff4b4b" },
      boxShadow: { glow: "0 0 25px rgba(0,240,255,0.15)" }
    }
  },
  plugins: []
}
