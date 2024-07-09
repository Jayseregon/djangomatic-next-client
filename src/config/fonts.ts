import {
    Fira_Code as FontMono,
    Italiana, Roboto
} from "next/font/google";

export const fontSans = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "300", "400", "500", "700", "900",],
  style: ["normal", "italic"],
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});