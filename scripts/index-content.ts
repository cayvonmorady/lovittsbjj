import { client } from '../sanity/lib/client';
import { addDocumentToIndex } from '../src/utils/llama-index';

async function indexContent() {
  try {
    // Fetch all content from Sanity
    const query = `*[_type in ["class", "pricing", "instructor"]]`;
    const content = await client.fetch(query);

    // Index each piece of content
    for (const item of content) {
      const textContent = JSON.stringify(item);
      await addDocumentToIndex(textContent, {
        type: item._type,
        id: item._id,
      });
    }

    console.log('Content indexed successfully');
  } catch (error) {
    console.error('Error indexing content:', error);
  }
}

indexContent();
