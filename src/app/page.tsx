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
            <h2 className="text-4xl font-[--font-bebas-neue] text-white mb-3 tracking-wide">Get In Touch</h2>
            <p className="text-gray-400">
              Ready to start your BJJ journey? Contact us today and take the first step towards transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Hours of Operation */}
            <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
              <h3 className="font-[--font-bebas-neue] text-2xl text-white mb-5 tracking-wide text-center">
                Hours of Operation
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base max-w-xs mx-auto text-gray-300">
                <span className="font-medium text-right text-gray-400">Monday:</span>
                <span>9 AM – 9:30 PM</span>
                <span className="font-medium text-right text-gray-400">Tuesday:</span>
                <span>9 AM – 9:30 PM</span>
                <span className="font-medium text-right text-gray-400">Wednesday:</span>
                <span>9 AM – 9:30 PM</span>
                <span className="font-medium text-right text-gray-400">Thursday:</span>
                <span>9 AM – 9:30 PM</span>
                <span className="font-medium text-right text-gray-400">Friday:</span>
                <span>9 AM – 9:30 PM</span>
                <span className="font-medium text-right text-gray-400">Saturday:</span>
                <span>8:30 AM – 12 PM</span>
                <span className="font-medium text-right text-gray-400">Sunday:</span>
                <span>Closed</span>
              </div>
              <p className="mt-5 text-sm text-center text-gray-400">
                <span className="text-[#AA4A44] font-medium">Note:</span> Class times vary. See our{' '}
                <Link href="/schedule" className="text-[#AA4A44] hover:underline">schedule page</Link>{' '}
                for specific class times.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="bg-[#111111] p-5 rounded-lg border border-gray-800 flex items-center gap-4">
                <div className="w-11 h-11 bg-[#2196F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#2196F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-[--font-bebas-neue] text-lg text-white tracking-wide">Phone</h4>
                  <a href="tel:4155591404" className="text-gray-400 hover:text-[#2196F3] transition-colors">
                    (415) 559-1404
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="bg-[#111111] p-5 rounded-lg border border-gray-800 flex items-center gap-4">
                <div className="w-11 h-11 bg-[#4CAF50]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="font-[--font-bebas-neue] text-lg text-white tracking-wide">Email</h4>
                  <a href="mailto:Markangelolovitt@lovittsjiujitsu.com" className="text-gray-400 hover:text-[#4CAF50] transition-colors text-sm break-all">
                    Markangelolovitt@lovittsjiujitsu.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="bg-[#111111] p-5 rounded-lg border border-gray-800 flex items-center gap-4">
                <div className="w-11 h-11 bg-[#F44336]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#F44336]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-[--font-bebas-neue] text-lg text-white tracking-wide">Visit Us</h4>
                  <p className="text-gray-400 text-sm">
                    2190 Solano Way<br />Concord, CA 94520
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-10 w-full">
            <Map />
          </div>
        </div>
      </section>
    </>
  );
}
