import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Format transcript with timestamps
    const formattedTranscript = transcriptItems
      .map(item => {
        const minutes = Math.floor(item.offset / 60000);
        const seconds = Math.floor((item.offset % 60000) / 1000);
        const timestamp = `[${minutes}:${seconds.toString().padStart(2, '0')}]`;
        return `${timestamp} ${item.text}`;
      })
      .join('\n');

    return NextResponse.json({ transcript: formattedTranscript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}
