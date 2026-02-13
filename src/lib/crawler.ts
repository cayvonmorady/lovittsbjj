import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Define the base URL of the website
const BASE_URL = 'https://www.lovittsbjj.com';

// Define the pages to crawl
const PAGES_TO_CRAWL = [
  '/',
  '/schedule',
  '/pricing',
  '/instructor'
];

// Define a function to fetch the HTML content of a page
async function fetchPage(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return '';
  }
}

// Define a function to extract text content from HTML
function extractTextContent(html: string): string {
  const $ = cheerio.load(html);
  
  // Remove script and style elements
  $('script, style, svg, path, meta, link').remove();
  
  // Extract text from the body
  const bodyText = $('body').text();
  
  // Clean up the text (remove extra whitespace, etc.)
  return bodyText
    .replace(/\s+/g, ' ')
    .trim();
}

// Define a function to extract structured data from the schedule page
function extractScheduleData(html: string): string {
  const $ = cheerio.load(html);
  let scheduleData = "Schedule Information:\n";
  
  // Extract schedule information
  $('.schedule-day').each((i, dayElement) => {
    const dayName = $(dayElement).find('h3').text().trim();
    scheduleData += `\n${dayName}:\n`;
    
    $(dayElement).find('.class-item').each((j, classElement) => {
      const className = $(classElement).find('.class-name').text().trim();
      const classTime = $(classElement).find('.class-time').text().trim();
      scheduleData += `- ${className}: ${classTime}\n`;
    });
  });
  
  return scheduleData;
}

// Define a function to crawl the website and save the content
export async function crawlWebsite(): Promise<string> {
  let allContent = '';
  
  // Create a directory for the crawled content if it doesn't exist
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  // Crawl each page
  for (const pagePath of PAGES_TO_CRAWL) {
    const url = `${BASE_URL}${pagePath}`;
    console.log(`Crawling ${url}...`);
    
    const html = await fetchPage(url);
    if (!html) continue;
    
    let pageContent = '';
    
    // Extract special structured data for specific pages
    if (pagePath === '/schedule') {
      pageContent = extractScheduleData(html);
    } else {
      pageContent = extractTextContent(html);
    }
    
    // Add page title and content to the all content string
    allContent += `\n\n--- Page: ${pagePath} ---\n${pageContent}`;
    
    // Save the page content to a file
    const fileName = pagePath === '/' ? 'home' : pagePath.substring(1);
    fs.writeFileSync(
      path.join(contentDir, `${fileName}.txt`),
      pageContent,
      'utf-8'
    );
  }
  
  // Save all content to a single file
  fs.writeFileSync(
    path.join(contentDir, 'all_content.txt'),
    allContent,
    'utf-8'
  );
  
  return allContent;
}

// Function to read the crawled content
export function readCrawledContent(): string {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'all_content.txt');
    if (fs.existsSync(contentPath)) {
      return fs.readFileSync(contentPath, 'utf-8');
    }
    return '';
  } catch (error) {
    console.error('Error reading crawled content:', error);
    return '';
  }
}

// Add comprehensive program, pricing, and schedule information
export function addSpecialInformation(content: string): string {
  const detailedInfo = `

--- ACCURATE PRICING INFORMATION (USE THIS DATA) ---

ADULT BJJ PRICING:
- Monthly Unlimited: $215/month (month-to-month, no commitment)
- 12-Month Commitment: $175/month (best value)
- Drop-In Class: $30 per class

KIDS & TINY KIDS BJJ PRICING:
- Monthly Unlimited: $190/month (month-to-month, no commitment)
- 12-Month Commitment: $150/month (best value)
- Drop-In Class: $30 per class

MUAY THAI PRICING:
- Monthly Unlimited: $120/month
- Drop-In Class: $30 per class

WOMEN'S SELF DEFENSE PRICING:
- Monthly Unlimited: $120/month
- Drop-In Class: $30 per class

PERSONAL TRAINING PRICING:
- Monthly Package: $300/month
- Single Session: $75 per session

--- PROGRAM DETAILS ---

ADULT BJJ: Classes for adults of all experience levels focusing on technique, sparring, and competition preparation. Offers both gi and no-gi training.

KIDS BJJ (Ages 6-12): Builds physical skills and character. Students learn self-defense while developing strength, focus, and confidence through structured training. Emphasizes respect, discipline, and perseverance.

TINY KIDS BJJ (Ages 4-5): Children develop essential life skills and physical coordination in a nurturing environment through fun, engaging exercises.

MUAY THAI: Beginner-friendly classes focusing on striking techniques, clinch work, and conditioning. Classes are held Monday at 7:30pm and Saturday at 8:30am (1 hour each). Wear comfortable athletic clothing, hand wraps, and a mouthguard (no uniform requirement like BJJ).

WOMEN'S SELF DEFENSE: Dedicated program for women focusing on practical self-defense skills in a supportive environment.

PERSONAL TRAINING: One-on-one sessions with experienced instructors for personalized skill development.

--- CONTACT & LOCATION ---
Phone: (415) 559-1404
Email: Markangelolovitt@lovittsjiujitsu.com
Address: 2190 Solano Way, Concord, CA 94520
Hours: Mon-Fri 9:00 AM - 9:30 PM, Sat 8:30 AM - 12:00 PM, Sun Closed

--- INSTRUCTOR ---
Markangelo Lovitt - BJJ Coach & Owner. 10+ years of training experience. Student of David Freeman (black belt under Caio Terra). Opened the gym in Concord, CA in 2018. Currently a brown belt in Brazilian Jiu-Jitsu.
`;

  return content + detailedInfo;
}
