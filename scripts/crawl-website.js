require('dotenv').config();

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.lovittsbjj.com';
const CONTENT_DIR = path.join(process.cwd(), 'content');
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CATEGORY_LABELS = {
  adult: 'Adult Programs',
  kids: 'Kids Programs',
  womens: "Women's Programs",
  muaythai: 'Muay Thai',
  personal: 'Personal Training',
};

const TYPE_LABELS = {
  'tiny-kids': 'Tiny Kids',
  'kids': 'Kids',
  'kids-13': 'Kids 13+',
  'adults': 'Adults',
  'womens': "Women's",
  'muay-thai': 'Muay Thai',
};

const DEFAULT_HOMEPAGE = {
  hero: {
    title: 'Train with Purpose, Grow with Community',
    subtitle: "At Lovitt's BJJ in Concord, we blend technical excellence with a welcoming atmosphere for students from Concord, Pleasant Hill, Walnut Creek, and nearby communities.",
  },
  programs: [
    {
      title: 'Tiny Kids BJJ (Ages 4-5)',
      description: 'Children develop essential life skills and physical coordination in a nurturing environment through fun, engaging exercises.',
    },
    {
      title: 'Kids BJJ (Ages 7-12)',
      description: 'Students learn self-defense while developing strength, focus, confidence, respect, discipline, and perseverance.',
    },
    {
      title: 'Kids BJJ (Ages 13+)',
      description: 'Older youth classes focused on more advanced technique development, positional awareness, and structured sparring.',
    },
    {
      title: 'Adults BJJ',
      description: 'Beginner-friendly and advanced Brazilian Jiu-Jitsu classes with gi and no-gi training.',
    },
    {
      title: 'Muay Thai',
      description: 'Striking, clinch work, conditioning, pad work, and bag work in a beginner-friendly environment.',
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

const DEFAULT_BUSINESS_INFO = {
  name: "Lovitt's BJJ",
  phone: '(415) 559-1404',
  email: 'Markangelolovitt@lovittsjiujitsu.com',
  address: '2190 Solano Way, Concord, CA 94520',
  hours: [
    'Monday-Friday: 9:00 AM-9:30 PM',
    'Saturday: 8:30 AM-12:00 PM',
    'Sunday: Closed',
  ],
  areaServed: ['Concord', 'Pleasant Hill', 'Walnut Creek', 'Martinez', 'Pacheco'],
  socialLinks: [
    'https://www.facebook.com/people/Lovitt-s-Jiujitsu-of-Concord/100063572163018/',
    'https://www.instagram.com/lovittsbjj/',
  ],
};

const SCHEDULE_NOTES = [
  'Arrive 10-15 minutes before class starts.',
  'Gi classes require a BJJ gi; No Gi classes require a rash guard with shorts or spats.',
  'Muay Thai classes use athletic clothing, hand wraps, and a mouthguard.',
  'Contact the gym to schedule a private lesson if regular class times do not work.',
];

const HOMEPAGE_QUERY = `*[_type == "homepage"][0] {
  hero {
    title,
    subtitle
  },
  alert {
    isActive,
    message,
    type
  },
  programs[] {
    title,
    description
  },
  location {
    address,
    city,
    state,
    zipCode,
    phone,
    email,
    googleMapsUrl
  }
}`;

const PRICING_QUERY = `*[_type == "pricing"] {
  category,
  plans[] {
    name,
    price,
    perMonth,
    features,
    highlighted
  }
}`;

const CLASS_QUERY = `*[_type == "class"] {
  name,
  dayOfWeek,
  startTime,
  duration,
  type,
  uniform,
  note
}`;

const INSTRUCTOR_QUERY = `*[_type == "instructor"] | order(order asc) {
  name,
  title,
  secondaryTitle,
  bio,
  achievements,
  certifications,
  socialMedia
}`;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xtgasnb2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-27',
  useCdn: false,
  perspective: 'published',
});

function normalizeList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function joinLines(lines) {
  return lines.filter((line) => typeof line === 'string' && line.trim().length > 0).join('\n').trim();
}

function formatTime(time) {
  if (!time || !time.includes(':')) return time || 'Time unavailable';

  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  if (Number.isNaN(hour)) return time;

  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${minute} ${suffix}`;
}

function getTimeSortValue(time) {
  if (!time || !time.includes(':')) return Number.MAX_SAFE_INTEGER;

  const [hourText, minuteText] = time.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return (hour * 60) + minute;
}

function formatPrice(price) {
  if (typeof price !== 'string' || price.trim().length === 0) {
    return 'Price unavailable';
  }

  const trimmedPrice = price.trim();
  return /^\$/.test(trimmedPrice) || /free/i.test(trimmedPrice) ? trimmedPrice : `$${trimmedPrice}`;
}

function blocksToText(blocks) {
  return normalizeList(blocks)
    .map((block) =>
      normalizeList(block?.children)
        .map((child) => (typeof child?.text === 'string' ? child.text.trim() : ''))
        .filter(Boolean)
        .join('')
    )
    .filter(Boolean)
    .join('\n');
}

function getBusinessInfo(location) {
  const resolvedLocation = location || DEFAULT_HOMEPAGE.location;
  const cityStateZip = joinLines([
    [resolvedLocation.city || 'Concord', resolvedLocation.state || 'CA'].filter(Boolean).join(', '),
    resolvedLocation.zipCode || '94520',
  ]).replace('\n', ' ');

  const addressParts = [
    resolvedLocation.address || '2190 Solano Way',
    cityStateZip.trim(),
  ].filter(Boolean);

  return {
    ...DEFAULT_BUSINESS_INFO,
    phone: resolvedLocation.phone || DEFAULT_BUSINESS_INFO.phone,
    email: resolvedLocation.email || DEFAULT_BUSINESS_INFO.email,
    address: addressParts.join(', '),
    googleMapsUrl: resolvedLocation.googleMapsUrl || DEFAULT_HOMEPAGE.location.googleMapsUrl,
  };
}

function formatBusinessSection(location) {
  const businessInfo = getBusinessInfo(location);

  return joinLines([
    `Gym: ${businessInfo.name}`,
    `Website: ${BASE_URL}`,
    `Phone: ${businessInfo.phone}`,
    `Email: ${businessInfo.email}`,
    `Address: ${businessInfo.address}`,
    `Google Maps: ${businessInfo.googleMapsUrl}`,
    `Hours: ${businessInfo.hours.join('; ')}`,
    `Area Served: ${businessInfo.areaServed.join(', ')}`,
    `Social Links: ${businessInfo.socialLinks.join(', ')}`,
    `Important Pages: Schedule ${BASE_URL}/schedule | Pricing ${BASE_URL}/pricing | Instructors ${BASE_URL}/instructor`,
  ]);
}

function formatHomepageSection(homepage) {
  const source = homepage || DEFAULT_HOMEPAGE;
  const programs = normalizeList(source.programs);
  const lines = [];

  if (source.hero?.title) {
    lines.push(`Hero Title: ${source.hero.title}`);
  }

  if (source.hero?.subtitle) {
    lines.push(`Hero Subtitle: ${source.hero.subtitle}`);
  }

  if (source.alert?.isActive && source.alert?.message) {
    lines.push(`Active Alert (${source.alert.type || 'info'}): ${source.alert.message}`);
  }

  if (programs.length > 0) {
    lines.push('');
    lines.push('Programs:');
    programs.forEach((program) => {
      const title = program.title || 'Untitled Program';
      const description = program.description || 'Description not provided.';
      lines.push(`- ${title}: ${description}`);
    });
  }

  return joinLines(lines);
}

function formatPricingSection(pricingDocs) {
  const categories = normalizeList(pricingDocs)
    .map((doc) => ({
      label: CATEGORY_LABELS[doc.category] || doc.category || 'Uncategorized',
      plans: normalizeList(doc.plans),
    }))
    .filter((doc) => doc.plans.length > 0)
    .sort((a, b) => a.label.localeCompare(b.label));

  if (categories.length === 0) {
    return 'Pricing data is currently unavailable in the crawl output.';
  }

  const lines = [];

  categories.forEach((category) => {
    lines.push(`${category.label}:`);
    category.plans.forEach((plan) => {
      const priceSuffix = plan.perMonth ? ' per month' : '';
      const features = normalizeList(plan.features);
      const featureText = features.length > 0 ? ` Includes: ${features.join('; ')}.` : '';
      const highlightText = plan.highlighted ? ' Recommended option.' : '';
      lines.push(`- ${plan.name || 'Unnamed plan'}: ${formatPrice(plan.price)}${priceSuffix}.${featureText}${highlightText}`.trim());
    });
    lines.push('');
  });

  return joinLines(lines);
}

function formatScheduleSection(classes) {
  const classList = normalizeList(classes).sort((a, b) => {
    const dayDelta = DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek);
    if (dayDelta !== 0) return dayDelta;
    return getTimeSortValue(a.startTime) - getTimeSortValue(b.startTime);
  });

  if (classList.length === 0) {
    return 'Schedule data is currently unavailable in the crawl output.';
  }

  const lines = [];
  let currentDay = '';

  classList.forEach((classItem) => {
    if (classItem.dayOfWeek !== currentDay) {
      currentDay = classItem.dayOfWeek;
      lines.push(`${currentDay}:`);
    }

    const types = normalizeList(classItem.type).map((type) => TYPE_LABELS[type] || type);
    const uniforms = normalizeList(classItem.uniform);
    const note = classItem.note ? ` Note: ${classItem.note}.` : '';
    const typeText = types.length > 0 ? ` Audience: ${types.join(', ')}.` : '';
    const uniformText = uniforms.length > 0 ? ` Uniform: ${uniforms.join(', ')}.` : '';
    lines.push(`- ${formatTime(classItem.startTime)} | ${classItem.name || 'Class'} | ${classItem.duration || 'Unknown'} minutes.${typeText}${uniformText}${note}`.trim());
  });

  lines.push('');
  lines.push('General Schedule Notes:');
  SCHEDULE_NOTES.forEach((note) => lines.push(`- ${note}`));

  return joinLines(lines);
}

function formatInstructorSection(instructors) {
  const instructorList = normalizeList(instructors);

  if (instructorList.length === 0) {
    return 'Instructor data is currently unavailable in the crawl output.';
  }

  const lines = [];

  instructorList.forEach((instructor) => {
    lines.push(`${instructor.name || 'Instructor'}:`);

    if (instructor.title) {
      lines.push(`- Title: ${instructor.title}`);
    }

    if (instructor.secondaryTitle) {
      lines.push(`- Secondary Title: ${instructor.secondaryTitle}`);
    }

    const bio = blocksToText(instructor.bio);
    if (bio) {
      lines.push(`- Bio: ${bio}`);
    }

    const achievements = normalizeList(instructor.achievements);
    if (achievements.length > 0) {
      lines.push(`- Achievements: ${achievements.join('; ')}`);
    }

    const certifications = normalizeList(instructor.certifications);
    if (certifications.length > 0) {
      lines.push(`- Certifications: ${certifications.join('; ')}`);
    }

    const socialLinks = Object.entries(instructor.socialMedia || {})
      .filter(([, url]) => Boolean(url))
      .map(([platform, url]) => `${platform}: ${url}`);

    if (socialLinks.length > 0) {
      lines.push(`- Social Media: ${socialLinks.join('; ')}`);
    }

    lines.push('');
  });

  return joinLines(lines);
}

async function safeFetch(label, query, fallback) {
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error(`Error fetching ${label}:`, error);
    return fallback;
  }
}

function ensureContentDirectory() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

async function crawlWebsite() {
  ensureContentDirectory();

  const [homepage, pricingDocs, classes, instructors] = await Promise.all([
    safeFetch('homepage content', HOMEPAGE_QUERY, DEFAULT_HOMEPAGE),
    safeFetch('pricing content', PRICING_QUERY, []),
    safeFetch('class schedule', CLASS_QUERY, []),
    safeFetch('instructor content', INSTRUCTOR_QUERY, []),
  ]);

  const sections = {
    home: joinLines([
      formatBusinessSection(homepage?.location),
      '',
      formatHomepageSection(homepage),
    ]),
    schedule: formatScheduleSection(classes),
    pricing: formatPricingSection(pricingDocs),
    instructor: formatInstructorSection(instructors),
  };

  Object.entries(sections).forEach(([fileName, content]) => {
    fs.writeFileSync(path.join(CONTENT_DIR, `${fileName}.txt`), `${content}\n`, 'utf-8');
  });

  const allContent = joinLines([
    '--- SITE PROFILE & HOMEPAGE ---',
    sections.home,
    '',
    '--- WEEKLY CLASS SCHEDULE ---',
    sections.schedule,
    '',
    '--- PRICING PLANS ---',
    sections.pricing,
    '',
    '--- INSTRUCTORS ---',
    sections.instructor,
  ]);

  fs.writeFileSync(path.join(CONTENT_DIR, 'all_content.txt'), `${allContent}\n`, 'utf-8');
  console.log(`Successfully crawled website and saved content (${allContent.length} characters)`);
  return allContent;
}

crawlWebsite().catch((error) => {
  console.error('Error during website crawl:', error);
  process.exit(1);
});
