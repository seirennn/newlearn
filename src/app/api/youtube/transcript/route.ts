import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json() as { videoId: string };

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    try {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
      
      if (!transcriptItems || transcriptItems.length === 0) {
        return NextResponse.json(
          { error: 'No transcript available for this video' },
          { status: 404 }
        );
      }

      // Format the transcript
      const transcript = transcriptItems
        .map(item => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!transcript) {
        return NextResponse.json(
          { error: 'No transcript content found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ transcript });
    } catch (error) {
      console.error('Error fetching transcript:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transcript. Make sure the video exists and has captions available.';
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in transcript API:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}
