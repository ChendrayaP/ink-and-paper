import localFont from "next/font/local";

/*
  Fonts are self-hosted (sourced from the @fontsource-variable packages and
  committed to the repo) rather than fetched from Google Fonts at build time.
  This keeps builds reproducible and offline-safe, and avoids a dependency on
  Google Fonts uptime in production.

  Newsreader (serif) carries the literary voice: book and chapter titles.
  Inter (sans) handles UI: navigation, buttons, metadata, the Studio.
*/
export const newsreader = localFont({
  src: "./fonts/newsreader-variable.woff2",
  variable: "--font-newsreader",
  display: "swap",
  weight: "200 800",
  style: "normal",
});

export const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  style: "normal",
});
