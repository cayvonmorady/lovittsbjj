import Map from '@/components/Map';
import ProgramsAccordion from '@/components/ProgramsAccordion';
import { client } from "../../sanity/lib/client";

import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
  description: "Train with purpose and grow with community at Lovitt's BJJ in Concord. We offer BJJ classes for all ages including Tiny Kids, Kids, Adults, and Muay Thai.",
  keywords: "BJJ Concord, Brazilian Jiu-Jitsu, Kids martial arts, Muay Thai, BJJ academy, Lovitts BJJ",
  openGraph: {
    title: "Lovitts BJJ | Brazilian Jiu-Jitsu Training in Concord",
    description: "Train with purpose and grow with community at Lovitt's BJJ in Concord. We offer BJJ classes for all ages and skill levels.",
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

  const alertStyles = {
    success: { bg: 'bg-green-900/20', border: 'border-green-900/20', text: 'text-green-200' },
    warning: { bg: 'bg-yellow-900/20', border: 'border-yellow-900/20', text: 'text-yellow-200' },
    info: { bg: 'bg-blue-900/20', border: 'border-blue-900/20', text: 'text-blue-200' },
  };

  const businessData = {
    name: "Lovitt's BJJ",
    description: "At Lovitt's BJJ, we blend technical excellence with a welcoming atmosphere, creating an environment where both beginners and advanced practitioners can thrive.",
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
      title: "Kids BJJ\n(Ages 6-12)",
      description: "Our Kids BJJ program builds physical skills and character. Students learn self-defense while developing strength, focus, and confidence through structured training. We emphasize respect, discipline, and perseverance both on and off the mats.",
      image: "/assets/images/programs/kids.jpg",
      alt: "Kids BJJ Program",
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
          <h1 className="font-[--font-bebas-neue] text-4xl lg:text-5xl text-white tracking-wide">
            Train with Purpose, Grow with Community
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-lg leading-relaxed">
            At Lovitt&apos;s BJJ, we blend technical excellence with a welcoming atmosphere,
            creating an environment where both beginners and advanced practitioners can thrive.
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/schedule"
              className="w-full sm:w-auto px-8 py-3 bg-[#AA4A44] hover:bg-[#cc0000] text-black font-[--font-bebas-neue] text-xl tracking-wide rounded-lg transition-colors duration-200"
            >
              View Schedule
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-3 border border-gray-600 hover:border-gray-400 text-white font-[--font-bebas-neue] text-xl tracking-wide rounded-lg transition-colors duration-200"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Programs FAQ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-[--font-bebas-neue] text-3xl sm:text-4xl text-white tracking-wide text-center mb-10">
            Our Programs
          </h2>
          <ProgramsAccordion
            programs={(programs && programs.length > 0
              ? programs.map((program, index) => ({
                  title: program.title || `Program ${index + 1}`,
                  description: program.description || "Program description not available.",
                }))
              : defaultPrograms.map((p) => ({ title: p.title, description: p.description }))
            )}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-[--font-bebas-neue] text-white mb-3 tracking-wide">Hours & Location</h2>
            <p className="text-gray-400">
              Ready to start your BJJ journey? Come by anytime to take the first step towards transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Hours of Operation */}
            <div className="bg-[#111111] p-6 rounded-lg border border-gray-800 flex flex-col">
              <h3 className="font-[--font-bebas-neue] text-2xl text-white mb-5 tracking-wide text-center">
                Hours of Operation
              </h3>
              <div className="flex-1 flex flex-col justify-center">
                <div className="rounded-lg overflow-hidden border border-gray-800">
                  <div className="flex items-center justify-between px-5 py-3 bg-[#1a1a1a]">
                    <span className="text-gray-300 font-medium">Monday – Friday</span>
                    <span className="text-white">9:00 AM – 9:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3 bg-[#111111]">
                    <span className="text-gray-300 font-medium">Saturday</span>
                    <span className="text-white">8:30 AM – 12:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3 bg-[#1a1a1a]">
                    <span className="text-gray-300 font-medium">Sunday</span>
                    <span className="text-gray-500">Closed</span>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm text-center text-gray-400">
                <span className="text-[#AA4A44] font-medium">Note:</span> Class times vary. See our{' '}
                <Link href="/schedule" className="text-[#AA4A44] hover:underline">schedule page</Link>{' '}
                for specific class times.
              </p>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-gray-800 min-h-[300px]">
              <Map />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
