import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lovittsbjj.com'),
  title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
  description: "Join Lovitt's BJJ for expert Brazilian Jiu-Jitsu training in a welcoming environment. Classes for all ages and skill levels including Kids BJJ, Adult BJJ, and Muay Thai.",
  keywords: "BJJ, Brazilian Jiu-Jitsu, Martial Arts, Muay Thai, Kids BJJ, Concord BJJ, Lovitts BJJ",
  openGraph: {
    title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
    description: "Join Lovitt's BJJ for expert Brazilian Jiu-Jitsu training in a welcoming environment. Classes for all ages and skill levels.",
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
    description: "Join Lovitt's BJJ for expert Brazilian Jiu-Jitsu training in a welcoming environment. Classes for all ages and skill levels.",
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
  verification: {
    google: "verification_token", // Replace with your Google Search Console verification token
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="title" content="Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord" />
        <meta name="description" content="Join Lovitt's BJJ for expert Brazilian Jiu-Jitsu training in a welcoming environment. Classes for all ages and skill levels including Kids BJJ, Adult BJJ, and Muay Thai." />
        <meta name="keywords" content="BJJ, Brazilian Jiu-Jitsu, Martial Arts, Muay Thai, Kids BJJ, Concord BJJ, Lovitts BJJ" />
        <meta property="og:title" content="Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord" />
        <meta property="og:description" content="Join Lovitt's BJJ for expert Brazilian Jiu-Jitsu training in a welcoming environment. Classes for all ages and skill levels." />
        <meta property="og:url" content="https://lovittsbjj.com" />
        <meta property="og:site_name" content="Lovitts BJJ" />
        <meta property="og:image" content="/assets/images/logo.png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content="Lovitts BJJ Logo" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord" />
        <meta name="twitter:description" content="Join Lovitt's BJJ for expert Brazilian Jiu-Jitsu training in a welcoming environment. Classes for all ages and skill levels." />
        <meta name="twitter:image" content="/assets/images/logo.png" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview=-1, max-image-preview=large, max-snippet=-1" />
        <meta name="google-site-verification" content="verification_token" />
      </head>
      <body className={`${bebasNeue.variable} bg-black text-white text-stroke`}>
        <GoogleAnalytics />
        <Navbar />
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
