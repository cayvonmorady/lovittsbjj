import { client } from '../../../sanity/lib/client';

interface PricingPlan {
  name: string;
  price: string;
  perMonth: boolean;
  features: string[];
  highlighted?: boolean;
}

interface PricingCategory {
  _id: string;
  category: string;
  plans: PricingPlan[];
}

// Development fallback data
const devPricingData: PricingCategory[] = [
  {
    _id: 'adult-pricing',
    category: 'adult',
    plans: [
      {
        name: 'Monthly Unlimited',
        price: '150',
        perMonth: true,
        features: [
          'Unlimited BJJ Classes',
          'Access to All Adult Programs',
          'Open Mat Sessions',
          'Competition Training'
        ],
        highlighted: true
      },
      {
        name: 'Annual Membership',
        price: '1500',
        perMonth: false,
        features: [
          'Best Value - Save $300/year',
          'Unlimited BJJ Classes',
          'Access to All Adult Programs',
          'Open Mat Sessions',
          'Competition Training',
          'Free Gi'
        ],
        highlighted: false
      },
      {
        name: 'Drop-In Class',
        price: '25',
        perMonth: false,
        features: [
          'Single Class Access',
          'No Commitment Required',
          'Great for Visitors',
          'Available for Any Class Time'
        ],
        highlighted: false
      }
    ]
  },
  {
    _id: 'kids-pricing',
    category: 'kids',
    plans: [
      {
        name: 'Kids Monthly',
        price: '120',
        perMonth: true,
        features: [
          'Structured Learning Environment',
          'Age-Appropriate Training',
          'Character Development',
          'Physical Fitness'
        ],
        highlighted: true
      },
      {
        name: 'Kids Annual',
        price: '1200',
        perMonth: false,
        features: [
          'Save $240/year',
          'Structured Learning Environment',
          'Age-Appropriate Training',
          'Character Development',
          'Physical Fitness',
          'Free Kids Gi'
        ],
        highlighted: false
      },
      {
        name: 'Family Plan',
        price: '250',
        perMonth: true,
        features: [
          'Up to 3 Family Members',
          'Access to All Programs',
          'Flexible Schedule',
          'Build Family Bonds'
        ],
        highlighted: false
      }
    ]
  }
];

async function getPricingData(): Promise<PricingCategory[]> {
  if (process.env.NODE_ENV === 'development') {
    return devPricingData;
  }

  try {
    const pricing = await client.fetch<PricingCategory[]>(`*[_type == "pricing"]`);
    return pricing.length > 0 ? pricing : devPricingData;
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    return devPricingData;
  }
}

export default async function PricingPage() {
  const pricingData = await getPricingData();
  const adultPlans = pricingData.find(p => p.category === 'adult')?.plans || [];
  const kidsPlans = pricingData.find(p => p.category === 'kids')?.plans || [];

  return (
    <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 bg-[#141419]">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-8 tracking-wider text-center">
          Membership Plans
        </h1>

        <div className="bg-[#1c1c23] border border-gray-800 rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-[--font-bebas-neue] text-white mb-6 tracking-wider text-center">
            Why Train With Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-gray-300">
            <div className="flex items-start space-x-3">
              <svg
                className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-semibold text-white mb-1">Transparent Pricing</h3>
                <p>No hidden fees or surprise charges. What you see is what you pay.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg
                className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-semibold text-white mb-1">Flexible Options</h3>
                <p>Choose between drop-in classes, monthly, or yearly memberships.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg
                className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <div>
                <h3 className="font-semibold text-white mb-1">Family Friendly</h3>
                <p>Special rates for families training together. Build bonds on the mats.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-[--font-bebas-neue] text-white mb-6 tracking-wider text-center">
            Adult Programs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {adultPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-[#1c1c23] border border-gray-800 rounded-lg shadow-lg overflow-hidden ${
                  plan.highlighted ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-[--font-bebas-neue] text-white tracking-wider text-center mb-4">
                    {plan.name}
                  </h3>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    {plan.perMonth && (
                      <span className="text-gray-300">/month</span>
                    )}
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-blue-500 mr-2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-[--font-bebas-neue] text-white mb-6 tracking-wider text-center">
            Kids Programs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {kidsPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-[#1c1c23] border border-gray-800 rounded-lg shadow-lg overflow-hidden ${
                  plan.highlighted ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-[--font-bebas-neue] text-white tracking-wider text-center mb-4">
                    {plan.name}
                  </h3>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    {plan.perMonth && (
                      <span className="text-gray-300">/month</span>
                    )}
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-blue-500 mr-2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
