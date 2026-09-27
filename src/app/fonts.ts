import localFont from "next/font/local";

/*
  Fonts are self-hosted (sourced from the @fontsource-variable packages and
  committed to the repo) rather than fetched from Google Fonts at build time.
  This keeps builds reproducible and offline-safe, and avoids a dependency on
  Google Fonts uptime in production.

  Newsreader (serif) carries the reading voice: manuscript body, contents,
  introduction/epilogue, and normal book text.
  Cormorant Garamond (serif) is the DISPLAY voice: large emotive headings only.
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

/*
  Cormorant Garamond (serif) is the DISPLAY typeface — used only for large,
  emotive headings. It is not a reading font; long-form body text stays on
  Newsreader. Self-hosted (from @fontsource-variable) to match the offline-safe
  approach above.
*/
export const cormorantGaramond = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-variable.woff2", style: "normal", weight: "300 700" },
    { path: "./fonts/cormorant-garamond-variable-italic.woff2", style: "italic", weight: "300 700" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});
