export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#0F1B2D", paper: "#FAF7F2", line: "#E3DDD3", brand: "#0B5FFF", formal: "#0056A8", cable: "#E4002B",
      informal: "#C77700", comunit: "#1F8A4C", alert: "#D92D20", wa: { bg: "#ECE5DD", out: "#D9FDD3", head: "#075E54" } },
    fontFamily: { sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"] },
    keyframes: {
      drop: { "0%": { transform: "translateY(-30px)", opacity: "0" }, "70%": { transform: "translateY(4px)" }, "100%": { transform: "translateY(0)", opacity: "1" } },
      slidedown: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(0)" } },
      pulseRing: { "0%": { boxShadow: "0 0 0 0 rgba(217,45,32,.5)" }, "100%": { boxShadow: "0 0 0 18px rgba(217,45,32,0)" } } },
    animation: { drop: "drop .5s ease-out both", slidedown: "slidedown .35s ease-out both", pulseRing: "pulseRing 1.6s infinite" } } },
  plugins: [],
};
