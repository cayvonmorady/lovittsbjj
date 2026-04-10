import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.lovittsbjj.com';
const CONTENT_DIR = path.join(process.cwd(), 'content');
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CATEGORY_LABELS: Record<string, string> = {
  adult: 'Adult Programs',
  kids: 'Kids Programs',
  womens: "Women's Programs",
  muaythai: 'Muay Thai',
  personal: 'Personal Training',
};

const TYPE_LABELS: Record<string, string> = {
  'tiny-kids': 'Tiny Kids',
  'kids': 'Kids',
  'kids-13': 'Kids 13+',
  'adults': 'Adults',
  'womens': "Women's",
  'muay-thai': 'Muay Thai',
};

interface HomepageLocation {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  googleMapsUrl?: string;
}

interface HomepageProgram {
  title?: string;
  description?: string;
}

interface HomepageDocument {
  hero?: {
    title?: string;
    subtitle?: string;
  };
  alert?: {
    isActive?: boolean;
    message?: string;
    type?: string;
  };
  programs?: HomepageProgram[];
  location?: HomepageLocation;
}

interface PricingPlan {
  name?: string;
  price?: string;
  perMonth?: boolean;
  features?: string[];
  highlighted?: boolean;
}

interface PricingDocument {
  category?: string;
  plans?: PricingPlan[];
}

interface ClassDocument {
  name?: string;
  dayOfWeek?: string;
  startTime?: string;
  duration?: number;
  type?: string[];
  uniform?: string[];
  note?: string;
}

interface PortableTextChild {
  text?: string;
}

interface PortableTextBlock {
  children?: PortableTextChild[];
}

interface InstructorDocument {
  name?: string;
  title?: string;
  secondaryTitle?: string;
  bio?: PortableTextBlock[];
  achievements?: string[];
  certifications?: string[];
  socialMedia?: Record<string, string | undefined>;
}

const DEFAULT_HOMEPAGE: HomepageDocument = {
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

function normalizeList<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function joinLines(lines: Array<string | undefined>): string {
  return lines.filter((line): line is string => Boolean(line && line.trim())).join('\n').trim();
}

function formatTime(time?: string): string {
  if (!time || !time.includes(':')) {
    return time || 'Time unavailable';
  }

  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  if (Number.isNaN(hour)) {
    return time;
  }

  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${minute} ${suffix}`;
}

function getTimeSortValue(time?: string): number {
  if (!time || !time.includes(':')) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [hourText, minuteText] = time.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return (hour * 60) + minute;
}

function formatPrice(price?: string): string {
  if (!price || !price.trim()) {
    return 'Price unavailable';
  }

  const trimmedPrice = price.trim();
  return trimmedPrice.startsWith('$') || /free/i.test(trimmedPrice) ? trimmedPrice : `$${trimmedPrice}`;
}

function blocksToText(blocks: PortableTextBlock[] | undefined): string {
  return normalizeList(blocks)
    .map((block) =>
      normalizeList(block.children)
        .map((child) => child.text?.trim() || '')
        .filter(Boolean)
        .join('')
    )
    .filter(Boolean)
    .join('\n');
}

function getBusinessInfo(location?: HomepageLocation) {
  const resolvedLocation = location || DEFAULT_HOMEPAGE.location || {};
  const cityState = [resolvedLocation.city || 'Concord', resolvedLocation.state || 'CA']
    .filter(Boolean)
    .join(', ');
  const cityStateZip = [cityState, resolvedLocation.zipCode || '94520'].filter(Boolean).join(' ');
  const address = [resolvedLocation.address || '2190 Solano Way', cityStateZip].filter(Boolean).join(', ');

  return {
    ...DEFAULT_BUSINESS_INFO,
    phone: resolvedLocation.phone || DEFAULT_BUSINESS_INFO.phone,
    email: resolvedLocation.email || DEFAULT_BUSINESS_INFO.email,
    address,
    googleMapsUrl: resolvedLocation.googleMapsUrl || DEFAULT_HOMEPAGE.location?.googleMapsUrl || '',
  };
}

function formatBusinessSection(location?: HomepageLocation): string {
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

function formatHomepageSection(homepage?: HomepageDocument | null): string {
  const source = homepage || DEFAULT_HOMEPAGE;
  const programs = normalizeList(source.programs);
  const lines: string[] = [];

  if (source.hero?.title) {
    lines.push(`Hero Title: ${source.hero.title}`);
  }

  if (source.hero?.subtitle) {
    lines.push(`Hero Subtitle: ${source.hero.subtitle}`);
  }

  if (source.alert?.isActive && source.alert.message) {
    lines.push(`Active Alert (${source.alert.type || 'info'}): ${source.alert.message}`);
  }

  if (programs.length > 0) {
    lines.push('');
    lines.push('Programs:');
    programs.forEach((program) => {
      lines.push(`- ${program.title || 'Untitled Program'}: ${program.description || 'Description not provided.'}`);
    });
  }

  return joinLines(lines);
}

function formatPricingSection(pricingDocs: PricingDocument[]): string {
  const categories = normalizeList(pricingDocs)
    .map((doc) => ({
      label: CATEGORY_LABELS[doc.category || ''] || doc.category || 'Uncategorized',
      plans: normalizeList(doc.plans),
    }))
    .filter((doc) => doc.plans.length > 0)
    .sort((a, b) => a.label.localeCompare(b.label));

  if (categories.length === 0) {
    return 'Pricing data is currently unavailable in the crawl output.';
  }

  const lines: string[] = [];

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

function formatScheduleSection(classes: ClassDocument[]): string {
  const classList = normalizeList(classes).sort((a, b) => {
    const dayDelta = DAY_ORDER.indexOf(a.dayOfWeek || '') - DAY_ORDER.indexOf(b.dayOfWeek || '');
    if (dayDelta !== 0) {
      return dayDelta;
    }

    return getTimeSortValue(a.startTime) - getTimeSortValue(b.startTime);
  });

  if (classList.length === 0) {
    return 'Schedule data is currently unavailable in the crawl output.';
  }

  const lines: string[] = [];
  let currentDay = '';

  classList.forEach((classItem) => {
    if (classItem.dayOfWeek && classItem.dayOfWeek !== currentDay) {
      currentDay = classItem.dayOfWeek;
      lines.push(`${currentDay}:`);
    }

    const types = normalizeList(classItem.type).map((type) => TYPE_LABELS[type] || type);
    const uniforms = normalizeList(classItem.uniform);
    const typeText = types.length > 0 ? ` Audience: ${types.join(', ')}.` : '';
    const uniformText = uniforms.length > 0 ? ` Uniform: ${uniforms.join(', ')}.` : '';
    const noteText = classItem.note ? ` Note: ${classItem.note}.` : '';
    lines.push(`- ${formatTime(classItem.startTime)} | ${classItem.name || 'Class'} | ${classItem.duration || 'Unknown'} minutes.${typeText}${uniformText}${noteText}`.trim());
  });

  lines.push('');
  lines.push('General Schedule Notes:');
  SCHEDULE_NOTES.forEach((note) => lines.push(`- ${note}`));

  return joinLines(lines);
}

function formatInstructorSection(instructors: InstructorDocument[]): string {
  const instructorList = normalizeList(instructors);

  if (instructorList.length === 0) {
    return 'Instructor data is currently unavailable in the crawl output.';
  }

  const lines: string[] = [];

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

async function safeFetch<T>(label: string, query: string, fallback: T): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query);
  } catch (error) {
    console.error(`Error fetching ${label}:`, error);
    return fallback;
  }
}

function ensureContentDirectory(): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

export async function crawlWebsite(): Promise<string> {
  ensureContentDirectory();

  const [homepage, pricingDocs, classes, instructors] = await Promise.all([
    safeFetch<HomepageDocument | null>('homepage content', HOMEPAGE_QUERY, DEFAULT_HOMEPAGE),
    safeFetch<PricingDocument[]>('pricing content', PRICING_QUERY, []),
    safeFetch<ClassDocument[]>('class schedule', CLASS_QUERY, []),
    safeFetch<InstructorDocument[]>('instructor content', INSTRUCTOR_QUERY, []),
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
  return allContent;
}

export function readCrawledContent(): string {
  try {
    const contentPath = path.join(CONTENT_DIR, 'all_content.txt');
    if (fs.existsSync(contentPath)) {
      return fs.readFileSync(contentPath, 'utf-8');
    }

    return '';
  } catch (error) {
    console.error('Error reading crawled content:', error);
    return '';
  }
}

export function addSpecialInformation(content: string): string {
  const supplementalNotes = `

--- RESPONSE NOTES ---
Use the "PRICING PLANS" and "WEEKLY CLASS SCHEDULE" sections for pricing and schedule questions.
If a program, price, or schedule item is missing from the crawled content, say you do not see it in the current knowledge base.
When contact details are needed, direct people to (415) 559-1404 or Markangelolovitt@lovittsjiujitsu.com.
`;

  return joinLines([content, supplementalNotes]);
}
