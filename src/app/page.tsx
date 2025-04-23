import Map from '@/components/Map';
import { client } from "../../sanity/lib/client";
import { urlForImage } from "../../sanity/lib/image";
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import ScrollIndicator from '@/components/ScrollIndicator';
import Image from 'next/image';
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

export const revalidate = 0; // revalidate this page on every request

// Helper function to safely get image URL from Sanity
function getSanityImageUrl(image: SanityImageSource, fallbackIndex: number): string {
  const fallbackUrl = `/assets/images/programs/${fallbackIndex === 0 ? 'tiny-kids' : fallbackIndex === 1 ? 'kids' : fallbackIndex === 2 ? 'adults' : 'women'}.jpg`;
  
  if (!image) {
    return fallbackUrl;
  }
  
  try {
    return urlForImage(image).url();
  } catch (error) {
    console.error('Error generating image URL:', error);
    return fallbackUrl;
  }
}

export default async function Home() {
  const { alert, programs } = await getHomepageData();

  const alertStyles = {
    success: {
      bg: 'bg-green-900/20',
      border: 'border-green-900/20',
      text: 'text-green-200'
    },
    warning: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-900/20',
      text: 'text-yellow-200'
    },
    info: {
      bg: 'bg-blue-900/20',
      border: 'border-blue-900/20',
      text: 'text-blue-200'
    }
  };

  // Business data for structured data
  const businessData = {
    name: "Lovitt's BJJ",
    description: "At Lovitt's BJJ, we blend technical excellence with a welcoming atmosphere, creating an environment where both beginners and advanced practitioners can thrive.",
    url: "https://lovittsbjj.com",
    telephone: "+14155591404", // Updated with actual phone number
    address: {
      streetAddress: "2190 Solano Way", // Updated with actual address
      addressLocality: "Concord",
      addressRegion: "CA",
      postalCode: "94520", // Updated with actual zip code
      addressCountry: "US"
    },
    geo: {
      latitude: "37.9738", // Updated with Concord, CA coordinates
      longitude: "-122.0353" // Updated with Concord, CA coordinates
    },
    openingHours: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "21:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:30",
        closes: "12:00"
      }
    ],
    image: "https://lovittsbjj.com/assets/images/logo.png",
    priceRange: "$$",
    socialLinks: [
      "https://www.facebook.com/people/Lovitt-s-Jiujitsu-of-Concord/100063572163018/",
      "https://www.instagram.com/lovittsbjj/"
    ]
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData type="LocalBusiness" data={businessData} />
      
      {/* Alert Section */}
      {alert?.isActive && (
        <div className={`${alertStyles[alert.type].bg} border-b ${alertStyles[alert.type].border}`}>
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="flex-1 flex items-center justify-center">
                <p className={`font-[--font-bebas-neue] text-xl ${alertStyles[alert.type].text} tracking-wide text-center`}>
                  {alert.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] py-6 px-4 sm:px-6 lg:px-8">
        <ScrollIndicator />
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            {/* Using Next.js Image component */}
            <Image
              src="/assets/images/logo.png"
              alt="Lovitt&apos;s BJJ Logo"
              width={500}
              height={500}
              className="mx-auto"
            />
            <h1 className="font-[--font-bebas-neue] text-4xl sm:text-5xl text-white tracking-wide">
              Train with Purpose, Grow with Community
            </h1>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg">
              At Lovitt&apos;s BJJ, we blend technical excellence with a welcoming atmosphere, 
              creating an environment where both beginners and advanced practitioners can thrive.
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {programs?.map((program, index) => (
              <div key={index} className="bg-[#111111] rounded-lg border border-gray-800 overflow-hidden text-center">
                <div className="aspect-w-16 aspect-h-9 relative h-48">
                  <Image
                    src={getSanityImageUrl(program.image, index)}
                    alt={program.title || `Program ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-2 tracking-wide">{program.title || `Program ${index + 1}`}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {program.description || "Program description not available."}
                  </p>
                </div>
              </div>
            ))}
            
            {/* If no programs are defined in Sanity, show default programs */}
            {(!programs || programs.length === 0) && (
              <>
                {/* Tiny Kids Program */}
                <div className="bg-[#111111] rounded-lg border border-gray-800 overflow-hidden text-center">
                  <div className="aspect-w-16 aspect-h-9 relative h-48">
                    <Image
                      src="/assets/images/programs/tiny-kids.jpg"
                      alt="Tiny Kids BJJ Program"
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-2 tracking-wide">Tiny Kids BJJ<br />(Ages 4-5)</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Children develop essential life skills and physical coordination in a nurturing environment.
                      Through fun, engaging exercises, they build confidence while learning fundamental movements and social skills.
                    </p>
                  </div>
                </div>

                {/* Kids Program */}
                <div className="bg-[#111111] rounded-lg border border-gray-800 overflow-hidden text-center">
                  <div className="aspect-w-16 aspect-h-9 relative h-48">
                    <Image
                      src="/assets/images/programs/kids.jpg"
                      alt="Kids BJJ Program"
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-2 tracking-wide">Kids BJJ <br /> (Ages 6-12)</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Our Kids BJJ program builds physical skills and character. Students learn self-defense while developing
                      strength, focus, and confidence through structured training. We emphasize respect, discipline, and
                      perseverance both on and off the mats.
                    </p>
                  </div>
                </div>

                {/* Adult Program */}
                <div className="bg-[#111111] rounded-lg border border-gray-800 overflow-hidden text-center">
                  <div className="aspect-w-16 aspect-h-9 relative h-48">
                    <Image
                      src="/assets/images/programs/adults.jpg"
                      alt="Adult BJJ Program"
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-2 tracking-wide">Adults BJJ</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Join our welcoming adult BJJ program, suitable for all skill levels. Learn effective self-defense while
                      improving technique, strength, and mental resilience. Our structured classes and supportive community
                      ensure consistent progress in your martial arts journey.
                    </p>
                  </div>
                </div>

                {/* Muay Thai */}
                <div className="bg-[#111111] rounded-lg border border-gray-800 overflow-hidden text-center">
                  <div className="aspect-w-16 aspect-h-9 relative h-48">
                    <Image
                      src="/assets/images/programs/women.jpg"
                      alt="Muay Thai"
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-[--font-bebas-neue] text-white mb-2 tracking-wide">Muay Thai</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Experience the &quot;Art of Eight Limbs&quot; in our dynamic Muay Thai program. Classes focus on striking techniques, 
                      clinch work, and conditioning. Join us Monday evenings at 7:30pm and Saturday mornings at 8:30am. 
                      Wear comfortable athletic clothing, hand wraps, and a mouthguard.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-6 mb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-[--font-bebas-neue] text-white mb-4 tracking-wide">Get In Touch</h2>
            <p className="text-gray-400 mb-8">
              Ready to start your BJJ journey? Contact us today and take the first step towards transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Hours of Operation */}
            <div className="w-full bg-[#111111] p-4 sm:p-6 rounded-lg border border-gray-800 h-full">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#FF9800]/10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <svg className="w-6 h-6 text-[#FF9800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-[--font-bebas-neue] text-xl sm:text-2xl text-white mb-2 tracking-wide">Hours of Operation</h3>
                  <div className="text-gray-400 text-base sm:text-lg">
                    <div className="grid grid-cols-2 gap-x-2 sm:gap-x-6 gap-y-1">
                      <span className="font-medium">Monday:</span>
                      <span>9:00 AM - 9:30 PM</span>
                      <span className="font-medium">Tuesday:</span>
                      <span>9:00 AM - 9:30 PM</span>
                      <span className="font-medium">Wednesday:</span>
                      <span>9:00 AM - 9:30 PM</span>
                      <span className="font-medium">Thursday:</span>
                      <span>9:00 AM - 9:30 PM</span>
                      <span className="font-medium">Friday:</span>
                      <span>9:00 AM - 9:30 PM</span>
                      <span className="font-medium">Saturday:</span>
                      <span>8:30 AM - 12:00 PM</span>
                      <span className="font-medium">Sunday:</span>
                      <span>Closed</span>
                    </div>
                    <p className="mt-4 text-xs sm:text-sm">
                      <span className="text-[#FF9800] font-medium">Note:</span> Class times vary. See our <a href="/schedule" className="text-[#FF9800] hover:underline">schedule page</a> for specific class times.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <div className="grid grid-cols-1 gap-8">
                {/* Phone */}
                <div className="bg-[#111111] p-4 sm:p-6 rounded-lg border border-gray-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#2196F3]/10 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-[#2196F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.693l2.694 3l2.694-3v-2a2 2 0 012-2v-1a2 2 0 012-2V11a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 106 0v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v1a2 2 0 012 2 2 2 0 012 2 2 2 0 012 2V13a2 2 0 00-2-2h-2a2 2 0 00-2 2V11z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-[--font-bebas-neue] text-xl sm:text-2xl text-white mb-2 tracking-wide">Contact Us</h3>
                      <p className="text-gray-400">
                        <a href="tel:4155591404" className="hover:text-blue-400 transition-colors">
                          (415) 559-1404
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-[#111111] p-4 sm:p-6 rounded-lg border border-gray-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-[--font-bebas-neue] text-xl sm:text-2xl text-white mb-2 tracking-wide">Email</h3>
                      <p className="text-gray-400">
                        <a href="mailto:Markangelolovitt@lovittsjiujitsu.com" className="hover:text-green-400 transition-colors">
                          Markangelolovitt@lovittsjiujitsu.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-[#111111] p-4 sm:p-6 rounded-lg border border-gray-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#F44336]/10 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-[#F44336]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-[--font-bebas-neue] text-xl sm:text-2xl text-white mb-2 tracking-wide">Visit Us</h3>
                      <p className="text-gray-400">
                        2190 Solano Way<br />Concord, CA 94520
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map - Full Width */}
          <div className="mt-12 w-full">
            <Map />
          </div>


        </div>
      </div>
    </>
  );
}
