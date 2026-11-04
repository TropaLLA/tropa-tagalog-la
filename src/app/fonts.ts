import localFont from "next/font/local";

// Title font: used only by the .title-screen class (sign-in title, home hero heading).
export const quiapo = localFont({
  src: [{ path: "./fonts/Quiapo_Free.ttf", weight: "400", style: "normal" }],
  variable: "--font-title",
  display: "swap",
});

// Header font: h1, h2, h3 and .page-heading. Only a Regular file exists.
export const cubao = localFont({
  src: [{ path: "./fonts/cubao-free-regular.otf", weight: "400", style: "normal" }],
  variable: "--font-header",
  display: "swap",
});

// Body font. Only a Bold file exists, so all body text renders in this weight.
export const kagitingan = localFont({
  src: [{ path: "./fonts/(v2)-Kagitingan-Bold.otf", weight: "700", style: "normal" }],
  variable: "--font-body",
  display: "swap",
});
