import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import FloatingActions from "@/components/FloatingActions";
import SmoothScroll from "@/components/motion/SmoothScroll";
import CursorFollower from "@/components/motion/CursorFollower";
import Providers from "@/components/Providers";
import ScrollProgress from "@/components/motion/ScrollProgress";
import SpotlightEffect from "@/components/motion/SpotlightEffect";

export const metadata: Metadata = {
  title: {
    default: "Tech.Mind: Build Your Brand. Grow With Purpose.",
    template: "%s — Tech.Mind",
  },
  description:
    "Complete digital marketing solutions: Meta Ads, Google Ads, SEO, influencer marketing, video, websites and web applications. Strategy, creativity and performance under one roof.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-paper">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
          <ScrollProgress />
          <SpotlightEffect />
          <SmoothScroll />
          <CursorFollower />
          <Header />
          <main><PageTransition>{children}</PageTransition></main>
          <Footer />
          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}
