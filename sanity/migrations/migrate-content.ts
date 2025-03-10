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

interface SanityImage {
  _type: 'image'
  asset: {
    _type: 'reference'
    _ref: string
  }
}

interface Program {
  title: string;
  description: string;
  image: SanityImage;
}

interface HomepageContent {
  _type: 'homepage';
  alert: {
    isActive: boolean;
    message: string;
    type: string;
  };
  hero: {
    title: string;
    subtitle: string;
    image?: SanityImage;
  };
  programs: Program[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    googleMapsUrl: string;
  };
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
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults' },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids' },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids' },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults' },
  },
  'Thursday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults' },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids' },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids' },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults' },
  },
  'Friday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults' },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids' },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids' },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults' },
  },
  'Saturday': {
    '10:00': { name: 'Adults BJJ', startTime: '10:00', duration: 90, type: 'adults', isNoGi: true },
    '11:30': { name: 'Kids BJJ', startTime: '11:30', duration: 60, type: 'kids', isNoGi: true },
  }
};

const pricingData = [
  {
    category: 'Monthly Memberships',
    plans: [
      {
        name: 'Kids Program',
        price: '150',
        perMonth: true,
        features: [
          'Access to Kids BJJ Classes',
          'Belt Promotions',
          'Free Gi'
        ],
        highlighted: false
      },
      {
        name: 'Adult Program',
        price: '175',
        perMonth: true,
        features: [
          'Access to All Adult Classes',
          'Belt Promotions',
          'Free Gi'
        ],
        highlighted: true
      },
      {
        name: "Women's Program",
        price: '150',
        perMonth: true,
        features: [
          "Access to Women's Classes",
          'Belt Promotions',
          'Free Gi'
        ],
        highlighted: false
      }
    ]
  }
];

// Homepage content
const homepageContent: HomepageContent = {
  _type: 'homepage',
  alert: {
    isActive: true,
    message: 'Holiday Closure: December 24th to January 1st — Classes Resume January 2nd',
    type: 'info'
  },
  hero: {
    title: 'Train with Purpose, Grow with Community',
    subtitle: "At Lovitt's BJJ, we blend technical excellence with a welcoming atmosphere, creating an environment where both beginners and advanced practitioners can thrive.",
  },
  programs: [
    {
      title: 'Tiny Kids BJJ',
      description: 'A fun and engaging program designed specifically for our youngest practitioners, focusing on basic movements, coordination, and discipline.',
      image: {
        _type: 'image' as const,
        asset: {
          _type: 'reference' as const,
          _ref: 'placeholder-tiny-kids'
        }
      }
    },
    {
      title: 'Kids BJJ',
      description: 'Building confidence, discipline, and self-defense skills in a safe and structured environment.',
      image: {
        _type: 'image' as const,
        asset: {
          _type: 'reference' as const,
          _ref: 'placeholder-kids'
        }
      }
    },
    {
      title: 'Adult BJJ',
      description: 'Technical training for all skill levels, with both Gi and No-Gi classes available throughout the week.',
      image: {
        _type: 'image' as const,
        asset: {
          _type: 'reference' as const,
          _ref: 'placeholder-adult'
        }
      }
    },
    {
      title: "Women's Program",
      description: 'Empowering women through Brazilian Jiu-Jitsu in a supportive and focused training environment.',
      image: {
        _type: 'image' as const,
        asset: {
          _type: 'reference' as const,
          _ref: 'placeholder-womens'
        }
      }
    }
  ],
  location: {
    address: '1234 Main Street',
    city: 'Concord',
    state: 'CA',
    zipCode: '94520',
    phone: '(415) 559-1404',
    email: 'Markangelolovitt@lovittsjiujitsu.com',
    googleMapsUrl: 'https://goo.gl/maps/your-gym-location'
  }
};

async function uploadImage(imagePath: string): Promise<string | null> {
  try {
    const fullPath = `${process.cwd()}${imagePath}`;
    const fs = require('fs');
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`Warning: Image not found at ${fullPath}`);
      return null;
    }
    
    const imageAsset = await client.assets.upload('image', fs.createReadStream(fullPath));
    console.log(`Successfully uploaded image: ${imagePath}`);
    return imageAsset._id;
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error);
    return null;
  }
}

async function migrateSchedule() {
  console.log('Starting schedule migration...');
  
  try {
    // First, delete all existing class documents
    const deleteResult = await client.delete({ query: '*[_type == "class"]' });
    console.log(`Deleted ${deleteResult.length} existing class documents`);
    
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
    
    // Create all class documents using a transaction
    const transaction = client.transaction();
    classDocuments.forEach(doc => {
      transaction.create(doc);
    });
    
    await transaction.commit();
    console.log('Schedule migration completed successfully');
    
  } catch (error) {
    console.error('Error migrating schedule:', error);
    throw error;
  }
}

async function migratePricing() {
  console.log('Starting pricing migration...');
  
  try {
    // First, delete all existing pricing documents
    const deleteResult = await client.delete({ query: '*[_type == "pricing"]' });
    console.log(`Deleted ${deleteResult.length} existing pricing documents`);
    
    // Create pricing documents using a transaction
    const transaction = client.transaction();
    
    pricingData.forEach(category => {
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
      
      transaction.create(pricingDoc);
    });
    
    await transaction.commit();
    console.log('Pricing migration completed successfully');
    
  } catch (error) {
    console.error('Error migrating pricing:', error);
    throw error;
  }
}

async function migrateHomepage() {
  console.log('Starting homepage migration...');
  
  try {
    // First, delete all existing homepage documents
    const deleteResult = await client.delete({ query: '*[_type == "homepage"]' });
    console.log(`Deleted ${deleteResult.length} existing homepage documents`);
    
    const content = { ...homepageContent };
    
    // Upload images and update references
    const heroImageRef = await uploadImage('/public/assets/images/hero.jpg');
    if (heroImageRef) {
      content.hero.image = {
        _type: 'image' as const,
        asset: {
          _type: 'reference' as const,
          _ref: heroImageRef
        }
      };
    }
    
    const updatedPrograms = await Promise.all(
      content.programs.map(async (program) => {
        const imageRef = await uploadImage(`/public/assets/images/programs/${program.title.toLowerCase().replace(/\s+/g, '-')}.jpg`);
        if (imageRef) {
          return {
            ...program,
            image: {
              _type: 'image' as const,
              asset: {
                _type: 'reference' as const,
                _ref: imageRef
              }
            }
          };
        }
        return program;
      })
    );
    
    content.programs = updatedPrograms;
    
    // Create homepage document
    await client.create(content);
    console.log('Homepage migration completed successfully');
    
  } catch (error) {
    console.error('Error migrating homepage:', error);
    throw error;
  }
}

// Function to migrate all content
async function migrateAllContent() {
  console.log('Starting content migration...');
  
  try {
    // Check Sanity connection
    await client.fetch('*[_type == "system"][0]').catch(() => {
      throw new Error('Could not connect to Sanity. Please check your credentials and network connection.');
    });
    
    // Run migrations in sequence
    await migrateSchedule();
    await migratePricing();
    await migrateHomepage();
    
    console.log('All content migrated successfully! ');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateAllContent();
