import { crawlWebsite } from '../src/lib/crawler';

// This script is meant to be run during the build/deployment process
async function main() {
  console.log('Starting website crawl for chatbot content...');
  
  try {
    const content = await crawlWebsite();
    console.log(`Successfully crawled website and saved content (${content.length} characters)`);
  } catch (error) {
    console.error('Error during website crawl:', error);
    process.exit(1);
  }
}

main();
