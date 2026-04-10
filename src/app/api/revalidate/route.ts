import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { endTimer, startTimer, timeSync } from '@/lib/serverTiming';

export async function POST(request: NextRequest) {
  const totalLabel = startTimer('POST /api/revalidate total');

  try {
    // Check if this is a batch revalidation request
    const { searchParams } = new URL(request.url);
    const isBatch = searchParams.get('batch') === 'true';
    
    if (isBatch) {
      // Revalidate all main paths for batch publishing
      timeSync('POST /api/revalidate batch-paths', () => {
        revalidatePath('/');
        revalidatePath('/pricing');
        revalidatePath('/schedule');
        revalidatePath('/instructor');
        // Gallery page is temporarily hidden, but we'll revalidate it anyway
        revalidatePath('/gallery');
      });
      
      return NextResponse.json({ 
        revalidated: true, 
        message: 'Batch revalidation successful',
        now: Date.now() 
      });
    }
    
    // Regular single-document revalidation
    const body = await request.json();
    
    // Get the paths to revalidate based on the document type
    const paths: string[] = [];
    if (body._type === 'pricing') {
      paths.push('/pricing');
    } else if (body._type === 'schedule') {
      paths.push('/schedule');
    } else if (body._type === 'class') {
      paths.push('/schedule');
    } else if (body._type === 'instructor') {
      paths.push('/instructor');
    } else if (body._type === 'gallery') {
      paths.push('/gallery');
    }

    // Revalidate all affected paths
    timeSync('POST /api/revalidate targeted-paths', () => {
      for (const path of paths) {
        revalidatePath(path);
      }
    });

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error('Error revalidating:', err);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  } finally {
    endTimer(totalLabel);
  }
}
