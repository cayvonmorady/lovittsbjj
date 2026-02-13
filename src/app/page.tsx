import Map from '@/components/Map';
import ProgramsAccordion from '@/components/ProgramsAccordion';
import { client } from "../../sanity/lib/client";

import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
  description: "Train Brazilian Jiu-Jitsu in Concord with classes for Tiny Kids, Kids, Adults, and Muay Thai. Convenient for families in Concord, Pleasant Hill, and Walnut Creek.",
  keywords: "BJJ Concord, Brazilian Jiu-Jitsu, Kids martial arts Concord, Muay Thai Concord, Pleasant Hill BJJ, Walnut Creek BJJ, Lovitts BJJ",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
    description: "Train with purpose and grow with community at Lovitt's BJJ in Concord. Classes for all ages and skill levels in the East Bay.",
    url: "https://lovittsbjj.com",
    type: "website",
  },
};

interface Alert {
  isActive: boolean;
  message: string;
  type: 'info' | 'warning' | 'success';
}

interface Program {
  title: string;
  description: string;
  image: {
    asset: {
      _ref: string;
    };
  };
}

interface HomepageData {
  alert?: Alert;
  programs?: Program[];
}

async function getHomepageData(): Promise<HomepageData> {
  return await client.fetch(`
    *[_type == "homepage"][0] {
      alert {
        isActive,
        message,
        type
      },
      programs[] {
        title,
        description,
        image {
          asset {
            _ref
          }
        }
      }
    }
  `);
}

export const revalidate = 0;

export default async function Home() {
  const { alert, programs } = await getHomepageData();
  const featuredProgramOrder: Record<string, number> = {
    "tiny kids bjj": 0,
    "kids bjj": 1,
    "kids bjj 13+": 2,
  };

  const normalizeProgramTitle = (title: string) => title.replace(/\s+/g, " ").trim();
  const formatProgramTitle = (title: string) => {
    const normalized = normalizeProgramTitle(title);
    const lower = normalized.toLowerCase();
    if (lower.includes("kids bjj") && lower.includes("13+")) {
      return "Kids BJJ (Ages 13+)";
    }
    return normalized;
  };
  const getProgramSortOrder = (title: string) => {
    const normalized = normalizeProgramTitle(title).toLowerCase();
    if (normalized.includes("tiny kids")) return featuredProgramOrder["tiny kids bjj"];
    if (normalized.includes("13+")) return featuredProgramOrder["kids bjj 13+"];
    if (normalized.includes("kids")) return featuredProgramOrder["kids bjj"];
    return Number.MAX_SAFE_INTEGER;
  };

  const alertStyles = {
    success: { bg: 'bg-green-900/20', border: 'border-green-900/20', text: 'text-green-200' },
    warning: { bg: 'bg-yellow-900/20', border: 'border-yellow-900/20', text: 'text-yellow-200' },
    info: { bg: 'bg-blue-900/20', border: 'border-blue-900/20', text: 'text-blue-200' },
  };

  const businessData = {
    name: "Lovitt's BJJ",
    description: "At Lovitt's BJJ, we blend technical excellence with a welcoming atmosphere in Concord, creating an environment where beginners and advanced practitioners can thrive.",
    url: "https://lovittsbjj.com",
    telephone: "+14155591404",
    address: {
      streetAddress: "2190 Solano Way",
      addressLocality: "Concord",
      addressRegion: "CA",
      postalCode: "94520",
      addressCountry: "US",
    },
    geo: { latitude: "37.9738", longitude: "-122.0353" },
    openingHours: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "21:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "08:30", closes: "12:00" },
    ],
    image: "https://lovittsbjj.com/assets/images/logo.png",
    priceRange: "$$",
    areaServed: ["Concord", "Pleasant Hill", "Walnut Creek", "Martinez", "Pacheco"],
    socialLinks: [
      "https://www.facebook.com/people/Lovitt-s-Jiujitsu-of-Concord/100063572163018/",
      "https://www.instagram.com/lovittsbjj/",
    ],
  };

  const defaultPrograms = [
    {
      title: "Tiny Kids BJJ\n(Ages 4-5)",
      description: "Children develop essential life skills and physical coordination in a nurturing environment. Through fun, engaging exercises, they build confidence while learning fundamental movements and social skills.",
      image: "/assets/images/programs/tiny-kids.jpg",
      alt: "Tiny Kids BJJ Program",
    },
    {
      title: "Kids BJJ (Ages 7-12)",
      description: "Our Kids BJJ program builds physical skills and character. Students learn self-defense while developing strength, focus, and confidence through structured training. We emphasize respect, discipline, and perseverance both on and off the mats.",
      image: "/assets/images/programs/kids.jpg",
      alt: "Kids BJJ Program",
    },
    {
      title: "Kids BJJ (Ages 13+)",
      description: "Our Kids BJJ 13+ classes are designed for older youth ready for more advanced technique development, positional awareness, and structured sparring in a supportive, disciplined environment.",
      image: "/assets/images/programs/kids.jpg",
      alt: "Kids BJJ 13+ Program",
    },
    {
      title: "Adults BJJ",
      description: "Join our welcoming adult BJJ program, suitable for all skill levels. Learn effective self-defense while improving technique, strength, and mental resilience. Our structured classes and supportive community ensure consistent progress.",
      image: "/assets/images/programs/adults.jpg",
      alt: "Adult BJJ Program",
    },
    {
      title: "Muay Thai",
      description: "Experience the \"Art of Eight Limbs\" in our dynamic Muay Thai program. Classes focus on striking techniques, clinch work, and conditioning. Join us Monday evenings at 7:30pm and Saturday mornings at 8:30am.",
      image: "/assets/images/programs/women.jpg",
      alt: "Muay Thai",
    },
  ];

  return (
    <>
      <StructuredData type="LocalBusiness" data={businessData} />

      {/* Alert Banner */}
      {alert?.isActive && (
        <div className={`${alertStyles[alert.type].bg} border-b ${alertStyles[alert.type].border}`}>
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 text-center">
            <p className={`font-[--font-bebas-neue] text-xl ${alertStyles[alert.type].text} tracking-wide`}>
              {alert.message}
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <Image
            src="/assets/images/logo.png"
            alt="Lovitt's BJJ Logo"
            width={280}
            height={280}
            className="mx-auto w-[180px] sm:w-[240px] lg:w-[280px] h-auto"
            priority
          />
          <h1 className="font-[--font-bebas-neue] text-4xl lg:text-5xl text-text tracking-wide">
            Train with Purpose, Grow with Community
          </h1>
          <p className="max-w-2xl mx-auto text-text2 text-lg leading-relaxed">
            At Lovitt&apos;s BJJ in Concord, we blend technical excellence with a welcoming atmosphere for students from Concord, Pleasant Hill, Walnut Creek, and nearby communities.
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/schedule"
              className="btn-primary w-full sm:w-auto px-8"
            >
              View Schedule
            </Link>
            <Link
              href="/pricing"
              className="btn-outline w-full sm:w-auto px-8"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Programs FAQ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-[--font-bebas-neue] text-3xl sm:text-4xl text-text tracking-wide text-center mb-10">
            Our Programs
          </h2>
          <ProgramsAccordion
            programs={(programs && programs.length > 0
              ? programs
                .map((program, index) => ({
                  title: program.title || `Program ${index + 1}`,
                  description: program.description || "Program description not available.",
                }))
                .sort((a, b) => getProgramSortOrder(a.title) - getProgramSortOrder(b.title))
                .map((program) => ({
                  ...program,
                  title: formatProgramTitle(program.title),
                }))
              : defaultPrograms
                .map((p) => ({ title: formatProgramTitle(p.title), description: p.description }))
                .sort((a, b) => getProgramSortOrder(a.title) - getProgramSortOrder(b.title))
            )}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-[--font-bebas-neue] text-text mb-3 tracking-wide">Hours & Location</h2>
            <p className="text-muted">
              Ready to start your BJJ journey? Come by anytime to take the first step towards transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Hours of Operation */}
            <div className="card p-6 flex flex-col">
              <h3 className="font-[--font-bebas-neue] text-2xl text-text mb-5 tracking-wide text-center">
                Hours of Operation
              </h3>
              <div className="flex-1 flex flex-col justify-center">
                <div className="rounded-lg overflow-hidden border border-border">
                  <div className="flex items-center justify-between px-5 py-3 bg-surface2">
                    <span className="text-text2 font-medium">Monday – Friday</span>
                    <span className="text-text">9:00 AM – 9:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3 bg-surface">
                    <span className="text-text2 font-medium">Saturday</span>
                    <span className="text-text">8:30 AM – 12:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3 bg-surface2">
                    <span className="text-text2 font-medium">Sunday</span>
                    <span className="text-muted">Closed</span>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm text-center text-muted">
                <span className="text-brand font-medium">Note:</span> Class times vary. See our{' '}
                <Link href="/schedule" className="text-brand hover:underline">schedule page</Link>{' '}
                for specific class times.
              </p>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-border min-h-[300px]">
              <Map />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
