import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        muted: "hsl(210 40% 96.1%)",
        "muted-foreground": "hsl(215.4 16.3% 46.9%)",
        popover: "hsl(0 0% 100%)",
        "popover-foreground": "hsl(222.2 84% 4.9%)",
        border: "hsl(214.3 31.8% 91.4%)",
        input: "hsl(214.3 31.8% 91.4%)",
        ring: "hsl(215 20.2% 65.1%)",
        primary: "hsl(221.2 83.2% 53%)",
        "primary-foreground": "hsl(210 40% 98%)",
        secondary: "hsl(210 40% 96.1%)",
        "secondary-foreground": "hsl(222.2 47.4% 11.2%)",
        destructive: "hsl(0 72.2% 50.6%)",
        "destructive-foreground": "hsl(210 40% 98%)",
        accent: "hsl(210 40% 96.1%)",
        "accent-foreground": "hsl(222.2 47.4% 11.2%)",
        card: "hsl(0 0% 100%)",
        "card-foreground": "hsl(222.2 84% 4.9%)",
      }
    }
  },
  plugins: [],
};

export default config;
