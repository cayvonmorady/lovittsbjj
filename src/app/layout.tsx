import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { SpeedInsights } from "@vercel/speed-insights/next";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lovittsbjj.com"),
  title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
  description:
    "Join Lovitt's BJJ in Concord, CA for Brazilian Jiu-Jitsu training. Classes for kids and adults from Concord, Pleasant Hill, Walnut Creek, and nearby communities.",
  keywords:
    "BJJ, Brazilian Jiu-Jitsu, Martial Arts, Muay Thai, Kids BJJ, Concord BJJ, Pleasant Hill BJJ, Walnut Creek BJJ, Lovitts BJJ",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
    description:
      "Train Brazilian Jiu-Jitsu in Concord with classes for all ages. Serving Concord, Pleasant Hill, Walnut Creek, and nearby East Bay communities.",
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
      "Train Brazilian Jiu-Jitsu in Concord with classes for all ages and skill levels.",
    images: ["/assets/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationData = {
    name: "Lovitt's BJJ",
    url: "https://lovittsbjj.com",
    logo: "https://lovittsbjj.com/assets/images/logo.png",
    description:
      "Brazilian Jiu-Jitsu academy in Concord, California serving students across Concord and nearby East Bay communities.",
    socialLinks: [
      "https://www.facebook.com/people/Lovitt-s-Jiujitsu-of-Concord/100063572163018/",
      "https://www.instagram.com/lovittsbjj/",
    ],
  };

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
        <StructuredData type="Organization" data={organizationData} />
        <GoogleAnalytics />
        <Navbar />
        <main className="app-content">{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
