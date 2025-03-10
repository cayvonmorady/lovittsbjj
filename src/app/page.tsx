import Map from '@/components/Map';
import { client } from "../../sanity/lib/client";
import ScrollIndicator from '@/components/ScrollIndicator';
import Image from 'next/image';

interface Alert {
  isActive: boolean;
  message: string;
  type: 'info' | 'warning' | 'success';
}

interface HomepageData {
  alert?: Alert;
}

async function getHomepageData(): Promise<HomepageData> {
  return await client.fetch(`
    *[_type == "homepage"][0] {
      alert {
        isActive,
        message,
        type
      }
    }
  `);
}

export const revalidate = 0; // revalidate this page on every request

export default async function Home() {
  const { alert } = await getHomepageData();

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

  return (
    <>
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

      <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <ScrollIndicator />
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            {/* Using Next.js Image component */}
            <Image
              src="/assets/images/logo.png"
              alt="Lovitt&apos;s BJJ Logo"
              width={240}
              height={240}
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
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-6 mb-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-[--font-bebas-neue] text-white mb-4 tracking-wide">Get In Touch</h2>
            <p className="text-gray-400 mb-8">
              Ready to start your BJJ journey? Contact us today and take the first step towards transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="w-full">
              <Map />
            </div>

            {/* Contact Info */}
            <div>
              <div className="grid grid-cols-1 gap-8">
                {/* Phone */}
                <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#2196F3]/10 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-[#2196F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-[--font-bebas-neue] text-xl text-white mb-1 tracking-wide">Call Us</h3>
                      <p className="text-gray-400">
                        <a href="tel:4155591404" className="hover:text-blue-400 transition-colors">
                          (415) 559-1404
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-[--font-bebas-neue] text-xl text-white mb-1 tracking-wide">Email</h3>
                      <p className="text-gray-400">
                        <a href="mailto:Markangelolovitt@lovittsjiujitsu.com" className="hover:text-green-400 transition-colors">
                          Markangelolovitt@lovittsjiujitsu.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#F44336]/10 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-[#F44336]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-[--font-bebas-neue] text-xl text-white mb-1 tracking-wide">Visit Us</h3>
                      <p className="text-gray-400">2190 Solano Way<br />Concord, CA 94520</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex justify-start gap-6 mt-8">
                <a href="https://www.instagram.com/lovittsbjj/" className="text-gray-400 hover:text-purple-500 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/people/Lovitt-s-Jiujitsu-of-Concord/100063572163018/" className="text-gray-400 hover:text-purple-500 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  <span className="sr-only">YouTube</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.772 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
