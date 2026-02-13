import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lovittsbjj.com"),
  title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
  description:
    "Join Lovitt's BJJ for expert Brazilian Jiu-Jitsu training in a welcoming environment. Classes for all ages and skill levels including Kids BJJ, Adult BJJ, and Muay Thai.",
  keywords:
    "BJJ, Brazilian Jiu-Jitsu, Martial Arts, Muay Thai, Kids BJJ, Concord BJJ, Lovitts BJJ",
  openGraph: {
    title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
    description:
      "Join Lovitt's BJJ for expert Brazilian Jiu-Jitsu training in a welcoming environment. Classes for all ages and skill levels.",
    url: "https://lovittsbjj.com",
    siteName: "Lovitts BJJ",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 800,
        height: 600,
        alt: "Lovitts BJJ Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
    description:
      "Join Lovitt's BJJ for expert Brazilian Jiu-Jitsu training in a welcoming environment. Classes for all ages and skill levels.",
    images: ["/assets/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeInitScript = `
    (function() {
      try {
        var key = "${THEME_STORAGE_KEY}";
        var stored = localStorage.getItem(key);
        var theme = (stored === "light" || stored === "dark")
          ? stored
          : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.classList.toggle("dark", theme === "dark");
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${bebasNeue.variable} app-shell`}>
        <GoogleAnalytics />
        <Navbar />
        {children}
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
