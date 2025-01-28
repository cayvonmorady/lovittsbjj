const { createClient } = require('@sanity/client');
require('dotenv').config();

interface ClassInfo {
  name: string;
  startTime: string;
  duration: number;
  type: string;
  isNoGi?: boolean;
  note?: string;
}

interface ScheduleData {
  [key: string]: {
    [key: string]: ClassInfo;
  };
}

interface PricingPlan {
  name: string;
  price: string;
  perMonth: boolean;
  features: string[];
  highlighted?: boolean;
}

interface PricingCategory {
  category: string;
  plans: PricingPlan[];
}

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN, 
  apiVersion: '2024-01-27',
  useCdn: false,
});

// Development data from schedule page
const scheduleData: ScheduleData = {
  'Tuesday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults' },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids' },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids' },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults' },
  },
  'Wednesday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults', isNoGi: true },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids', isNoGi: true },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids', isNoGi: true },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults', isNoGi: true },
  },
  'Thursday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults', isNoGi: true },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids', isNoGi: true },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids', isNoGi: true },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults', isNoGi: true },
  },
  'Friday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults' },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids' },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids' },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults' },
  },
  'Saturday': {
    'kids': { name: 'Kids BJJ', startTime: '11:45', duration: 75, type: 'kids' },
    'tiny': { name: 'Tiny Kids BJJ', startTime: '11:45', duration: 75, type: 'tiny-kids' },
    'adults': { name: 'Adults BJJ', startTime: '13:00', duration: 60, type: 'adults' },
    'womens': { name: "Women's Self Defense", startTime: '17:30', duration: 60, type: 'womens', note: 'First Saturdays' },
  },
  'Sunday': {
    '12:00': { name: 'Open Mat', startTime: '12:00', duration: 120, type: 'adults' },
  },
};

// Pricing data
const pricingData: PricingCategory[] = [
  {
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
          'Available for Visitors',
          'No Commitment Required'
        ],
        highlighted: false
      }
    ]
  },
  {
    category: 'kids',
    plans: [
      {
        name: 'Monthly Kids Program',
        price: '125',
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
        name: 'Annual Kids Program',
        price: '1250',
        perMonth: false,
        features: [
          'Best Value - Save $250/year',
          'Structured Learning Environment',
          'Age-Appropriate Training',
          'Character Development',
          'Physical Fitness',
          'Free Gi'
        ],
        highlighted: false
      }
    ]
  }
];

// Homepage content
const homepageContent = {
  _type: 'homepage',
  alert: {
    enabled: true,
    message: 'Holiday Closure: December 24th to January 1st — Classes Resume January 2nd'
  },
  hero: {
    title: 'Train with Purpose, Grow with Community',
    subtitle: "At Lovitt's BJJ, we blend technical excellence with a welcoming atmosphere, creating an environment where both beginners and advanced practitioners can thrive."
  },
  programs: [
    {
      title: 'Tiny Kids BJJ',
      description: 'A fun and engaging program designed specifically for our youngest practitioners, focusing on basic movements, coordination, and discipline.',
      imageUrl: '/assets/images/programs/tiny-kids.jpg',
      link: '/schedule'
    },
    {
      title: 'Kids BJJ',
      description: 'Building confidence, discipline, and self-defense skills in a safe and structured environment.',
      imageUrl: '/assets/images/programs/kids.jpg',
      link: '/schedule'
    },
    {
      title: 'Adult BJJ',
      description: 'Technical training for all skill levels, with both Gi and No-Gi classes available throughout the week.',
      imageUrl: '/assets/images/programs/adults.jpg',
      link: '/schedule'
    },
    {
      title: "Women's Program",
      description: 'Empowering women through Brazilian Jiu-Jitsu in a supportive and focused training environment.',
      imageUrl: '/assets/images/programs/womens.jpg',
      link: '/schedule'
    }
  ],
  location: {
    title: 'Visit Our Academy',
    address: '1234 Main Street, Seattle, WA 98101',
    description: 'Located in the heart of Seattle, our academy offers a spacious training area with state-of-the-art facilities.'
  }
};

async function migrateSchedule() {
  console.log('Starting schedule migration...');
  
  try {
    // First, delete all existing class documents
    await client.delete({ query: '*[_type == "class"]' });
    console.log('Deleted existing class documents');
    
    // Convert schedule data to array of class documents
    const classDocuments = [];
    
    for (const [day, classes] of Object.entries(scheduleData)) {
      for (const [time, classInfo] of Object.entries(classes)) {
        classDocuments.push({
          _type: 'class',
          name: classInfo.name,
          dayOfWeek: day,
          startTime: classInfo.startTime,
          duration: classInfo.duration,
          type: classInfo.type,
          isNoGi: classInfo.isNoGi || false,
          ...(classInfo.note ? { note: classInfo.note } : {}),
        });
      }
    }
    
    console.log(`Creating ${classDocuments.length} class documents...`);
    
    // Create all class documents one by one
    for (const doc of classDocuments) {
      await client.create(doc);
      console.log(`Created class: ${doc.name} on ${doc.dayOfWeek} at ${doc.startTime}`);
    }
    
    console.log('Schedule migration completed');
    
  } catch (error) {
    console.error('Error migrating schedule:', error);
  }
}

async function migratePricing() {
  console.log('Starting pricing migration...');
  
  try {
    // First, delete all existing pricing documents
    await client.delete({ query: '*[_type == "pricing"]' });
    console.log('Deleted existing pricing documents');
    
    // Create pricing documents
    for (const category of pricingData) {
      const pricingDoc = {
        _type: 'pricing',
        category: category.category,
        plans: category.plans.map(plan => ({
          name: plan.name,
          price: plan.price,
          perMonth: plan.perMonth,
          features: plan.features,
          highlighted: plan.highlighted || false
        }))
      };
      
      await client.create(pricingDoc);
      console.log(`Created pricing category: ${category.category}`);
    }
    
    console.log('Pricing migration completed');
    
  } catch (error) {
    console.error('Error migrating pricing:', error);
  }
}

async function migrateHomepage() {
  console.log('Starting homepage migration...');
  
  try {
    // First, delete all existing homepage documents
    await client.delete({ query: '*[_type == "homepage"]' });
    console.log('Deleted existing homepage documents');
    
    // Create homepage document
    await client.create(homepageContent);
    console.log('Created homepage content');
    
  } catch (error) {
    console.error('Error migrating homepage:', error);
  }
}

// Function to migrate all content
async function migrateAllContent() {
  try {
    await migrateSchedule();
    await migratePricing();
    await migrateHomepage();
    console.log('All content migrated successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// Run the migration
migrateAllContent();
