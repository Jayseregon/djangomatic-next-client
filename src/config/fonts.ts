import {
    Fira_Code as FontMono,
    Italiana, Roboto
} from "next/font/google";

export const fontSans = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400"
});

export const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
});
