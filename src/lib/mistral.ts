import { Mistral } from '@mistralai/mistralai';
import { readCrawledContent, addSpecialInformation } from './crawler';

// Define the message interface
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Check if the query is about general topics that need more specific information
export function isGeneralQuery(query: string): boolean {
  const generalTopics = [
    'time', 'times', 'schedule', 'schedules', 'class', 'classes',
    'price', 'prices', 'pricing', 'cost', 'costs', 'fee', 'fees',
    'program', 'programs', 'offering', 'offerings',
    'when', 'how much'
  ];
  
  const lowercaseQuery = query.toLowerCase();
  return generalTopics.some(topic => lowercaseQuery.includes(topic));
}

// Check if the query is specifically about a program
export function getSpecificProgram(query: string): string | null {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes('muay thai') || lowercaseQuery.includes('muaythai')) {
    return 'muay thai';
  }
  
  if (lowercaseQuery.includes('kid') || lowercaseQuery.includes('child') || lowercaseQuery.includes('children')) {
    return 'kids bjj';
  }
  
  if (lowercaseQuery.includes('women') || lowercaseQuery.includes('woman') || lowercaseQuery.includes('female') || lowercaseQuery.includes('fitness')) {
    return 'women\'s fitness';
  }
  
  if (lowercaseQuery.includes('adult') || lowercaseQuery.includes('men')) {
    return 'adult bjj';
  }
  
  return null;
}

// Define a function to generate a response using MistralAI
export async function generateMistralResponse(query: string, conversationHistory: Message[] = []): Promise<string> {
  try {
    // Check if the API key is set
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('MISTRAL_API_KEY is not set in the environment variables');
    }

    // Initialize the MistralAI client
    const mistralClient = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY
    });

    // Get the crawled content
    let websiteContent = readCrawledContent();
    
    // Add special information about Muay Thai classes
    websiteContent = addSpecialInformation(websiteContent);

    // Check if this is a general query that needs more specific information
    const needsSpecificProgram = isGeneralQuery(query);
    const specificProgram = getSpecificProgram(query);

    // Create a system message with context about the website
    let systemMessage = `
You are a helpful, friendly, and conversational assistant for Lovitt's BJJ, a Brazilian Jiu-Jitsu school in Concord, CA.
Use the following information about the school to answer questions:

${websiteContent}

IMPORTANT PROGRAM DETAILS:
1. Adult BJJ: Classes for adults of all experience levels focusing on technique, sparring, and competition preparation. This is our largest offering.
2. Kids BJJ: Age-appropriate classes for children focusing on discipline, respect, and self-confidence. The font size for Kids BJJ classes in the schedule is set to 'text-sm' for better visual distinction.
3. Muay Thai: Classes on Monday at 7:30pm and Saturday at 8:30am, each for an hour. Participants should wear comfortable athletic clothing, hand wraps, and a mouthguard (no uniform requirement like BJJ classes).
4. Women's Fitness: Classes designed specifically for women focusing on fitness, self-defense, and empowerment.

IMPORTANT RESPONSE GUIDELINES:
1. Be conversational and friendly in your responses. Use a warm, welcoming tone.
2. Keep responses EXTREMELY CONCISE - no more than 1-2 sentences for simple questions.
3. If a user asks a general question about times, pricing, schedule, or classes WITHOUT specifying which program they're interested in, ONLY ask which program they're interested in. Your entire response should be something like: "Which program are you interested in - Adult BJJ, Kids BJJ, Muay Thai, or Women's Fitness?"
4. Always format website URLs as proper markdown links. For example, use [Schedule Page](https://www.lovittsbjj.com/schedule) instead of just mentioning "the schedule page" or "lovittsbjj.com/schedule".
5. If you don't know the answer to a question, politely suggest contacting the school directly at Markangelolovitt@lovittsjiujitsu.com or (415) 559-1404.
6. DO NOT include unnecessary information or sign your messages with "Best regards, Lovitt's BJJ Team".
7. DO NOT add any extra fluff or unnecessary details to your responses.
8. You do not need to add any pleasantries.
9. IMPORTANT: Remember context from previous messages in the conversation. If a user previously mentioned interest in a specific program, use that information when answering follow-up questions.
`;

    // Additional instructions for general queries with no conversation history
    if (needsSpecificProgram && !specificProgram && conversationHistory.length === 0) {
      systemMessage += `
IMPORTANT: This is a general query about classes, schedule, or pricing without specifying a program. Your ENTIRE response should be ONLY:

"Which program are you interested in - Adult BJJ, Kids BJJ, Muay Thai, or Women's Fitness?"

DO NOT add any additional information, links, or pleasantries. Keep it extremely concise.
`;
    }

    // Prepare the messages array for the API call
    const messages: Message[] = [
      { role: 'system', content: systemMessage }
    ];

    // Add conversation history if available
    if (conversationHistory.length > 0) {
      // Only include the last 5 messages to keep context manageable
      const recentHistory = conversationHistory.slice(-5);
      messages.push(...recentHistory);
    }

    // Add the current user query
    messages.push({ role: 'user', content: query });

    // Call the MistralAI API using the chat method
    const chatResponse = await mistralClient.chat.complete({
      model: 'open-mistral-7b', // Using the free Mistral 7B model
      messages: messages,
      temperature: 0.7,
      maxTokens: 200 // Reduced max tokens to encourage shorter responses
    });

    // Return the generated response
    const content = chatResponse.choices?.[0]?.message?.content;
    if (typeof content === 'string') {
      return content.trim();
    } else if (Array.isArray(content)) {
      // Handle content chunks if returned as an array
      return content.map(chunk => 
        typeof chunk === 'string' ? chunk : JSON.stringify(chunk)
      ).join('').trim();
    }
    return 'I apologize, but I couldn\'t generate a response. Please try again later.';
  } catch (error) {
    console.error('Error generating response with MistralAI:', error);
    return 'I apologize, but I encountered an error. Please try again later or contact the school directly.';
  }
}
