import { NextResponse } from 'next/server';
import { generateMistralResponse, isGeneralQuery, getSpecificProgram } from '@/lib/mistral';
import { findResponse } from '@/lib/chatResponses';

// Define the message interface
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Define error interface for better type safety
interface ApiError extends Error {
  message: string;
  stack?: string;
}

// Function to convert markdown links to HTML links
function convertMarkdownLinksToHtml(text: string): string {
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return text.replace(markdownLinkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

// Function to ensure concise responses for general queries
function ensureConciseResponse(query: string, response: string, conversationHistory: Message[]): string {
  // Only override for vague general queries with no specific program and no conversation context
  if (isGeneralQuery(query) && !getSpecificProgram(query) && conversationHistory.length <= 1) {
    return "Which program are you interested in — Adult BJJ, Kids BJJ, Muay Thai, Women's Self Defense, or Personal Training?";
  }
  return response;
}

export async function POST(req: Request) {
  try {
    const { query, history = [] } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Try to use MistralAI first
    try {
      if (!process.env.MISTRAL_API_KEY) {
        console.warn('MISTRAL_API_KEY is not set. Falling back to static responses.');
        throw new Error('MISTRAL_API_KEY is not configured');
      }

      const mistralResponse = await generateMistralResponse(query, history);
      const conciseResponse = ensureConciseResponse(query, mistralResponse, history);
      const formattedResponse = convertMarkdownLinksToHtml(conciseResponse);
      
      return NextResponse.json({ response: formattedResponse });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('MistralAI error:', apiError.message || 'Unknown error');
      
      // Fall back to static keyword-based responses
      const fallbackResponse = findResponse(query);
      const conciseFallback = ensureConciseResponse(query, fallbackResponse, history);
      const formattedFallback = convertMarkdownLinksToHtml(conciseFallback);
      
      return NextResponse.json({ response: formattedFallback });
    }
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}