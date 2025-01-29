import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Sanity
    const body = await request.json();
    
    // Get the paths to revalidate based on the document type
    const paths = [];
    if (body._type === 'pricing') {
      paths.push('/pricing');
    } else if (body._type === 'schedule') {
      paths.push('/schedule');
    } else if (body._type === 'instructor') {
      paths.push('/instructor');
    } else if (body._type === 'gallery') {
      paths.push('/gallery');
    }

    // Revalidate all affected paths
    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error('Error revalidating:', err);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
