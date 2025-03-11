// JavaScript version of the website crawler
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

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
async function fetchPage(url) {
  try {
    console.log(`Fetching ${url}...`);
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
function extractTextContent(html) {
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
function extractScheduleData(html) {
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

// Define a function to extract pricing information
function extractPricingData(html) {
  const $ = cheerio.load(html);
  let pricingData = "Pricing Information:\n";
  
  // Extract pricing information
  $('.pricing-plan').each((i, planElement) => {
    const planName = $(planElement).find('h3').text().trim();
    const planPrice = $(planElement).find('.price').text().trim();
    const planDescription = $(planElement).find('.description').text().trim();
    
    pricingData += `\n${planName}: ${planPrice}\n`;
    pricingData += `Description: ${planDescription}\n`;
  });
  
  return pricingData;
}

// Define a function to crawl the website and save the content
async function crawlWebsite() {
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
    } else if (pagePath === '/pricing') {
      pageContent = extractPricingData(html);
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
  
  // Add special information about different programs based on the Muay Thai memory and general knowledge
  const programInfo = `
--- Program Information ---

Adult BJJ:
- For adults of all experience levels
- Classes available throughout the week (see [Schedule Page](https://www.lovittsbjj.com/schedule) for specific times)
- Focus on technique, sparring, and competition preparation

Kids BJJ:
- Age-appropriate classes for children
- Classes available throughout the week (see [Schedule Page](https://www.lovittsbjj.com/schedule) for specific times)
- Focus on discipline, respect, and self-confidence

Muay Thai:
- Classes on Monday at 7:30pm and Saturday at 8:30am (1 hour each)
- Attire: Comfortable athletic clothing, hand wraps, and a mouthguard (no uniform requirement)
- Focus on striking techniques, clinch work, and conditioning

Women's Fitness:
- Classes designed specifically for women
- See [Schedule Page](https://www.lovittsbjj.com/schedule) for class times
- Focus on fitness, self-defense, and empowerment
`;
  
  allContent += programInfo;
  
  // Save all content to a single file
  fs.writeFileSync(
    path.join(contentDir, 'all_content.txt'),
    allContent,
    'utf-8'
  );
  
  console.log(`Successfully crawled website and saved content (${allContent.length} characters)`);
  return allContent;
}

// Run the crawler
crawlWebsite().catch(error => {
  console.error('Error during website crawl:', error);
  process.exit(1);
});
