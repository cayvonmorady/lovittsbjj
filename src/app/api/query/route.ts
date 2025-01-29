import { NextRequest, NextResponse } from 'next/server';
import { queryIndex } from '@/utils/llama-index';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const response = await queryIndex(query);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}
