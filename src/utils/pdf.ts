import * as pdfjsLib from 'pdfjs-dist';

// Initialize the PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    // Get total number of pages
    const numPages = pdf.numPages;

    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      fullText += `Page ${i}\n\n`;
      
      // Combine text items with proper spacing
      const items = textContent.items as { str: string; transform: number[] }[];
      let lastY: number | null = null;
      let text = '';

      items.forEach((item) => {
        const y = item.transform[5]; // Vertical position
        if (lastY !== null && Math.abs(y - lastY) > 5) {
          // New line
          text += '\n';
        } else if (text.length > 0 && !text.endsWith(' ')) {
          // Add space between words on same line
          text += ' ';
        }
        text += item.str;
        lastY = y;
      });

      fullText += text + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}
