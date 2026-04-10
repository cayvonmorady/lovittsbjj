import { Mistral } from '@mistralai/mistralai';
import { addSpecialInformation, readCrawledContent } from './crawler';
import { endTimer, startTimer, timeAsync, timeSync } from './serverTiming';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const MISTRAL_REQUEST_TIMEOUT_MS = 8_000;
const WEBSITE_CONTEXT = addSpecialInformation(readCrawledContent());

let mistralClient: Mistral | null = null;

function getMistralClient(): Mistral {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error('MISTRAL_API_KEY is not set in the environment variables');
  }

  if (!mistralClient) {
    mistralClient = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }

  return mistralClient;
}

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

export async function generateMistralResponse(query: string, conversationHistory: Message[] = []): Promise<string> {
  const totalLabel = startTimer('generateMistralResponse total');

  try {
    const needsSpecificProgram = isGeneralQuery(query);
    const specificProgram = getSpecificProgram(query);

    const systemMessage = timeSync('generateMistralResponse build-system-message', () => {
      let prompt = `You are a helpful assistant for Lovitt's BJJ, a martial arts gym in Concord, CA. Answer questions using ONLY the information provided below. Be concise and accurate.

=== SCHOOL INFORMATION ===
${WEBSITE_CONTEXT}
=== END SCHOOL INFORMATION ===

RULES:
1. Use ONLY the pricing and schedule data from the structured "PRICING PLANS" and "WEEKLY CLASS SCHEDULE" sections above. Never guess or make up prices or class times.
2. Keep responses to 1-3 sentences for simple questions. Only give longer answers when the user asks for detailed information.
3. If someone asks about a specific program (like "how much is Muay Thai"), give the price directly - do not ask them to clarify.
4. If someone asks a vague question about "classes" or "pricing" without specifying a program, ask which program they're interested in: Adult BJJ, Kids BJJ, Muay Thai, Women's Self Defense, or Personal Training.
5. Format links as markdown: [Schedule Page](https://www.lovittsbjj.com/schedule), [Pricing Page](https://www.lovittsbjj.com/pricing).
6. If you don't know something, say so and suggest contacting (415) 559-1404 or Markangelolovitt@lovittsjiujitsu.com.
7. Do NOT add sign-offs like "Best regards" or unnecessary pleasantries.
8. Remember context from previous messages in the conversation.
`;

      if (needsSpecificProgram && !specificProgram && conversationHistory.length === 0) {
        prompt += `\nThe user is asking a general question without specifying a program. Respond ONLY with:\n"Which program are you interested in - Adult BJJ, Kids BJJ, Muay Thai, Women's Self Defense, or Personal Training?"\n`;
      }

      return prompt;
    });

    const messages = timeSync('generateMistralResponse build-messages', () => {
      const preparedMessages: Message[] = [
        { role: 'system', content: systemMessage }
      ];

      if (conversationHistory.length > 0) {
        preparedMessages.push(...conversationHistory.slice(-5));
      }

      preparedMessages.push({ role: 'user', content: query });

      return preparedMessages;
    });

    console.log('generateMistralResponse input', {
      historyLength: conversationHistory.length,
      promptCharacters: systemMessage.length,
      queryLength: query.length,
      timeoutMs: MISTRAL_REQUEST_TIMEOUT_MS,
    });

    const chatResponse = await timeAsync(
      'generateMistralResponse mistral.complete',
      () =>
        getMistralClient().chat.complete(
          {
            model: 'open-mistral-nemo',
            messages,
            temperature: 0.4,
            maxTokens: 300,
          },
          { timeoutMs: MISTRAL_REQUEST_TIMEOUT_MS }
        )
    );

    return timeSync('generateMistralResponse normalize-response', () => {
      const content = chatResponse.choices?.[0]?.message?.content;

      if (typeof content === 'string') {
        return content.trim();
      }

      if (Array.isArray(content)) {
        return content.map(chunk =>
          typeof chunk === 'string' ? chunk : JSON.stringify(chunk)
        ).join('').trim();
      }

      throw new Error('Mistral returned an empty response payload');
    });
  } catch (error) {
    console.error('Error generating response with MistralAI:', error);
    throw error;
  } finally {
    endTimer(totalLabel);
  }
}
