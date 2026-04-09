'use client';

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

interface PricingClientProps {
  pricingData: PricingCategory[];
}

export default function PricingClient({ pricingData }: PricingClientProps) {
  const adultPlans = pricingData.find(p => p.category === 'adult')?.plans || [];
  const kidsPlans = pricingData.find(p => p.category === 'kids')?.plans || [];
  const womensPlans = pricingData.find(p => p.category === 'womens')?.plans || [];
  const muayThaiPlans = pricingData.find(p => p.category === 'muaythai')?.plans || [];
  const personalPlans = pricingData.find(p => p.category === 'personal')?.plans || [];

  // Helper function to render pricing plans with consistent layout
  const renderPricingPlans = (plans: PricingPlan[]) => {
    const renderPlanCard = (plan: PricingPlan) => (
      <div
        key={plan.name}
        className={`relative flex flex-col rounded-lg overflow-hidden h-full transition-transform duration-200 ${
          plan.highlighted
            ? "bg-surface2 border-2 border-brand/70 shadow-lg shadow-brand/10 scale-[1.02]"
            : "bg-surface border border-border"
        }`}
      >
        <div className="px-6 py-8 flex flex-col flex-1">
          <h3 className="text-2xl font-[--font-bebas-neue] text-text tracking-wider text-center mb-4">
            {plan.name}
          </h3>
          <div className="text-center mb-6">
            <span className={`text-5xl font-bold ${plan.highlighted ? "text-brand" : "text-text"}`}>
              ${plan.price}
            </span>
            {plan.perMonth && (
              <span className="text-muted text-lg">/mo</span>
            )}
          </div>
          <ul className="space-y-3 flex-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg
                  className={`h-5 w-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-brand" : "text-text2"}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-muted">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );

    // For 2 plans, use 50% width layout
    if (plans.length === 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
          {plans.map(renderPlanCard)}
        </div>
      );
    }

    // For 3 or more plans, use the standard grid
    return (
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {plans.map(renderPlanCard)}
      </div>
    );
  };

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <h1
          className="text-5xl uppercase tracking-widest text-text mb-2"
          style={{ fontFamily: 'var(--font-bebas-neue)' }}
        >
          Membership Plans
        </h1>
        <p className="text-muted mb-8">Simple, transparent pricing for adults and kids.</p>

        <div className="card p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-muted">
            <div className="flex items-start space-x-3">
              <svg
                className="h-6 w-6 text-brand mt-1 flex-shrink-0"
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
                <h3 className="font-semibold text-text mb-1">Transparent Pricing</h3>
                <p>No hidden fees or surprise charges. What you see is what you pay.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg
                className="h-6 w-6 text-brand mt-1 flex-shrink-0"
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
                <h3 className="font-semibold text-text mb-1">Flexible Options</h3>
                <p>Choose between drop-in classes, monthly, or yearly memberships.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg
                className="h-6 w-6 text-brand mt-1 flex-shrink-0"
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
                <h3 className="font-semibold text-text mb-1">Family Friendly</h3>
                <p>Special rates for families training together. Build bonds on the mats. Please visit for more info.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl uppercase font-[--font-bebas-neue] text-text mb-6 tracking-wider text-center">
            Adult BJJ Programs
          </h2>
          {renderPricingPlans(adultPlans)}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl uppercase font-[--font-bebas-neue] text-text mb-6 tracking-wider text-center">
            All Kids
          </h2>
          {renderPricingPlans(kidsPlans)}
        </div>

        {womensPlans.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl uppercase font-[--font-bebas-neue] text-text mb-6 tracking-wider text-center">
              Women&apos;s Self Defense
            </h2>
            {renderPricingPlans(womensPlans)}
          </div>
        )}

        {muayThaiPlans.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl uppercase font-[--font-bebas-neue] text-text mb-6 tracking-wider text-center">
              Muay Thai Programs
            </h2>
            {renderPricingPlans(muayThaiPlans)}
          </div>
        )}

        {personalPlans.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl uppercase font-[--font-bebas-neue] text-text mb-6 tracking-wider text-center">
              Personal Training
            </h2>
            {renderPricingPlans(personalPlans)}
          </div>
        )}
      </div>
    </main>
  );
}
