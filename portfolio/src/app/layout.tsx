import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ahmed Islam — Web / Game Developer",
  description: "Portfolio of Ahmed Islam, a creative Full Stack & Game Developer building high-performance web experiences.",
  icons: {
    icon: "/Whisk_ac2fbcc3d41edcc84b343c65fc7df497eg.png",
    shortcut: "/Whisk_ac2fbcc3d41edcc84b343c65fc7df497eg.png",
    apple: "/Whisk_ac2fbcc3d41edcc84b343c65fc7df497eg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
