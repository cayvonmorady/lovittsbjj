const { createClient } = require('@sanity/client');
require('dotenv').config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-27',
  useCdn: false,
});

async function seedHomepage() {
  console.log('Seeding homepage document into Sanity...');

  // Delete any existing homepage documents first
  const existing = await client.fetch('*[_type == "homepage"]');
  if (existing.length > 0) {
    console.log(`Found ${existing.length} existing homepage document(s), deleting...`);
    for (const doc of existing) {
      await client.delete(doc._id);
    }
    console.log('Deleted existing homepage documents.');
  }

  const homepageDoc = {
    _type: 'homepage',
    hero: {
      title: 'Train with Purpose, Grow with Community',
      subtitle:
        "At Lovitt's BJJ, we blend technical excellence with a welcoming atmosphere, creating an environment where both beginners and advanced practitioners can thrive.",
    },
    alert: {
      isActive: true,
      message: 'Check out our new Muay Thai class!',
      type: 'info',
    },
    programs: [
      {
        _key: 'tiny-kids',
        title: 'Tiny Kids BJJ (Ages 4-5)',
        description:
          'Children develop essential life skills and physical coordination in a nurturing environment. Through fun, engaging exercises, they build confidence while learning fundamental movements and social skills.',
      },
      {
        _key: 'kids',
        title: 'Kids BJJ (Ages 6-12)',
        description:
          'Our Kids BJJ program builds physical skills and character. Students learn self-defense while developing strength, focus, and confidence through structured training. We emphasize respect, discipline, and perseverance both on and off the mats.',
      },
      {
        _key: 'adults',
        title: 'Adults BJJ',
        description:
          'Join our welcoming adult BJJ program, suitable for all skill levels. Classes focus developing fundamental and advanced techniques with a curriculum featuring both gi and no-gi.',
      },
      {
        _key: 'muay-thai',
        title: 'Muay Thai',
        description:
          "Our beginner friendly classes focus on striking techniques, clinch work, and conditioning. Students can expect to focus on pad and bag work, with the option to spar at the instructor's discretion.",
      },
    ],
    location: {
      address: '2190 Solano Way',
      city: 'Concord',
      state: 'CA',
      zipCode: '94520',
      phone: '(415) 559-1404',
      email: 'Markangelolovitt@lovittsjiujitsu.com',
      googleMapsUrl: 'https://maps.google.com/?q=2190+Solano+Way+Concord+CA+94520',
    },
  };

  const result = await client.create(homepageDoc);
  console.log(`Homepage document created with ID: ${result._id}`);

  // Publish the document (Sanity creates drafts by default with tokens)
  // Let's verify it exists
  const verify = await client.fetch('*[_type == "homepage"][0]{ _id, hero, alert, "programCount": count(programs), location }');
  console.log('Verification:', JSON.stringify(verify, null, 2));
  console.log('Homepage seeding complete!');
}

seedHomepage().catch((err) => {
  console.error('Failed to seed homepage:', err);
  process.exit(1);
});