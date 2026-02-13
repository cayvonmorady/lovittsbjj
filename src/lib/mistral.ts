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
  
  if (lowercaseQuery.includes('muay thai') || lowercaseQuery.includes('muaythai') || lowercaseQuery.includes('kickboxing') || lowercaseQuery.includes('striking')) {
    return 'muay thai';
  }
  
  if (lowercaseQuery.includes('tiny') || (lowercaseQuery.includes('kid') && lowercaseQuery.includes('4')) || (lowercaseQuery.includes('kid') && lowercaseQuery.includes('5'))) {
    return 'tiny kids bjj';
  }
  
  if (lowercaseQuery.includes('kid') || lowercaseQuery.includes('child') || lowercaseQuery.includes('children') || lowercaseQuery.includes('youth') || lowercaseQuery.includes('junior')) {
    return 'kids bjj';
  }
  
  if (lowercaseQuery.includes('women') || lowercaseQuery.includes('woman') || lowercaseQuery.includes('female') || lowercaseQuery.includes('self defense') || lowercaseQuery.includes('self-defense')) {
    return 'women\'s self defense';
  }
  
  if (lowercaseQuery.includes('personal training') || lowercaseQuery.includes('private') || lowercaseQuery.includes('one on one') || lowercaseQuery.includes('1 on 1')) {
    return 'personal training';
  }
  
  if (lowercaseQuery.includes('adult') || lowercaseQuery.includes('bjj')) {
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
    
    // Add comprehensive program, pricing, and schedule information
    websiteContent = addSpecialInformation(websiteContent);

    // Check if this is a general query that needs more specific information
    const needsSpecificProgram = isGeneralQuery(query);
    const specificProgram = getSpecificProgram(query);

    // Create the system prompt
    let systemMessage = `You are a helpful assistant for Lovitt's BJJ, a martial arts gym in Concord, CA. Answer questions using ONLY the information provided below. Be concise and accurate.

=== SCHOOL INFORMATION ===
${websiteContent}
=== END SCHOOL INFORMATION ===

RULES:
1. Use ONLY the pricing data from the "ACCURATE PRICING INFORMATION" section above. Never guess or make up prices.
2. Keep responses to 1-3 sentences for simple questions. Only give longer answers when the user asks for detailed information.
3. If someone asks about a specific program (like "how much is Muay Thai"), give the price directly — do not ask them to clarify.
4. If someone asks a vague question about "classes" or "pricing" without specifying a program, ask which program they're interested in: Adult BJJ, Kids BJJ, Muay Thai, Women's Self Defense, or Personal Training.
5. Format links as markdown: [Schedule Page](https://www.lovittsbjj.com/schedule), [Pricing Page](https://www.lovittsbjj.com/pricing).
6. If you don't know something, say so and suggest contacting (415) 559-1404 or Markangelolovitt@lovittsjiujitsu.com.
7. Do NOT add sign-offs like "Best regards" or unnecessary pleasantries.
8. Remember context from previous messages in the conversation.
`;

    // Additional instructions for general queries with no conversation history
    if (needsSpecificProgram && !specificProgram && conversationHistory.length === 0) {
      systemMessage += `\nThe user is asking a general question without specifying a program. Respond ONLY with:\n"Which program are you interested in — Adult BJJ, Kids BJJ, Muay Thai, Women's Self Defense, or Personal Training?"\n`;
    }

    // Prepare the messages array for the API call
    const messages: Message[] = [
      { role: 'system', content: systemMessage }
    ];

    // Add conversation history if available (last 5 messages)
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      messages.push(...recentHistory);
    }

    // Add the current user query
    messages.push({ role: 'user', content: query });

    // Call the MistralAI API
    const chatResponse = await mistralClient.chat.complete({
      model: 'open-mistral-nemo',
      messages: messages,
      temperature: 0.4,
      maxTokens: 300
    });

    // Return the generated response
    const content = chatResponse.choices?.[0]?.message?.content;
    if (typeof content === 'string') {
      return content.trim();
    } else if (Array.isArray(content)) {
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