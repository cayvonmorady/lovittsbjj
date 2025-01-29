import { Metadata } from 'next';
import { client } from '../../../sanity/lib/client';
import PricingClient from '@/components/PricingClient';

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
        price: '200',
        perMonth: true,
        features: [
          'Month-to-Month Commitment',
          'Unlimited BJJ Classes'
        ],
        highlighted: false
      },
      {
        name: 'Annual Unlimited',
        price: '125',
        perMonth: true,
        features: [
          'Best Value - Save $900/year',
          'Unlimited BJJ Classes',
          'Lovitts BJJ Gi'
        ],
        highlighted: true
      },
      {
        name: 'Drop-In Class',
        price: '25',
        perMonth: false,
        features: [
          'Single Class Access',
          'No Commitment',
          'Great for Visitors'
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
          'Month-to-Month Commitment',
          'Unlimited BJJ Classes'
        ],
        highlighted: false
      },
      {
        name: 'Kids Annual',
        price: '100',
        perMonth: true,
        features: [
          'Best Value - Save $240/year',
          'Unlimited BJJ Classes',
          'Lovitts BJJ Gi'
        ],
        highlighted: true
      },
      {
        name: 'Drop-In Class',
        price: '25',
        perMonth: false,
        features: [
          'Single Class Access',
          'No Commitment',
          'Great for Visitors'
        ],
        highlighted: false
      }
    ]
  }
];

export const metadata: Metadata = {
  title: 'Pricing | Lovitt\'s BJJ',
  description: 'View our membership plans and pricing options for both adults and kids BJJ programs.',
};

export const revalidate = 60; // Revalidate this page every 60 seconds

async function getPricingData(): Promise<PricingCategory[]> {
  try {
    const query = `*[_type == "pricing"] {
      _id,
      category,
      plans[] {
        name,
        price,
        perMonth,
        features,
        highlighted
      }
    }`;
    
    const data = await client.fetch(query);
    
    if (!data || data.length === 0) {
      console.log('No pricing data from Sanity, using development data');
      return devPricingData;
    }

    return data;
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    return devPricingData;
  }
}

export default async function PricingPage() {
  const pricingData = await getPricingData();
  return <PricingClient pricingData={pricingData} />;
}
