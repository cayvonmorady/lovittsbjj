import { NextResponse } from 'next/server';
import { generateMistralResponse, isGeneralQuery, getSpecificProgram } from '@/lib/mistral';
import { findResponse } from '@/lib/chatResponses';

// Function to convert markdown links to HTML links
function convertMarkdownLinksToHtml(text: string): string {
  // Regex to match markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  // Replace all markdown links with HTML links
  return text.replace(markdownLinkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

// Function to ensure concise responses for general queries
function ensureConciseResponse(query: string, response: string, conversationHistory: any[]): string {
  // If this is a first-time general query without a specific program
  if (isGeneralQuery(query) && !getSpecificProgram(query) && conversationHistory.length <= 1) {
    // Always return this exact response for general queries, regardless of what the model generated
    return "Which program are you interested in - Adult BJJ, Kids BJJ, Muay Thai, or Women's Fitness?";
  }
  
  // For specific queries or follow-up questions, return the original response
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
      // Use the MistralAI integration with conversation history
      const mistralResponse = await generateMistralResponse(query, history);
      
      // Ensure the response is concise for general queries
      const conciseResponse = ensureConciseResponse(query, mistralResponse, history);
      
      // Convert markdown links to HTML links
      const formattedResponse = convertMarkdownLinksToHtml(conciseResponse);
      
      return NextResponse.json({ response: formattedResponse });
    } catch (mistralError) {
      console.error('Error with MistralAI:', mistralError);
      
      // Fall back to the static responses if MistralAI fails
      const fallbackResponse = findResponse(query);
      
      // Ensure the fallback response is also concise for general queries
      const conciseFallbackResponse = ensureConciseResponse(query, fallbackResponse, history);
      
      // Also convert markdown links in fallback responses
      const formattedFallbackResponse = convertMarkdownLinksToHtml(conciseFallbackResponse);
      
      return NextResponse.json({ response: formattedFallbackResponse });
    }
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
