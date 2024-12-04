'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Initialize worker
import { pdfjs } from 'react-pdf';

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

interface PDFViewerProps {
  file: File | null;
  onTextExtracted: (text: string) => void;
}

export function PDFViewer({ file, onTextExtracted }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1.25);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      extractTextFromPDF(file);
      return () => URL.revokeObjectURL(url);
    } else {
      setPdfUrl(null);
    }
  }, [file]);

  const extractTextFromPDF = async (file: File) => {
    try {
      setIsExtracting(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      onTextExtracted(fullText.trim());
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(width);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
    setRotation(0);
  }

  const previousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.75));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!file || !pdfUrl) {
    return (
      <div className="flex-1 h-[calc(100vh-220px)] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-700 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No PDF Selected</h3>
        <p className="text-neutral-400 text-center max-w-sm">
          Import a PDF file to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={previousPage}
              disabled={pageNumber <= 1}
              className="px-3 py-1.5 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-sm text-neutral-400">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              className="px-3 py-1.5 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-neutral-800" />

          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.75}
              className="p-1.5 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-neutral-400 min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 5}
              className="p-1.5 bg-neutral-800 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={rotate}
              className="p-1.5 bg-neutral-800 rounded-lg hover:bg-neutral-700"
              title="Rotate"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>

          {isExtracting && (
            <span className="text-sm text-neutral-400">
              Extracting text...
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6" ref={containerRef}>
        <div className="flex justify-center min-h-min">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onItemClick={({ pageNumber }) => {
              if (pageNumber) {
                setPageNumber(pageNumber);
              }
            }}
            loading={
              <div className="flex items-center justify-center py-20">
                <div className="animate-pulse text-neutral-400">Loading PDF...</div>
              </div>
            }
            error={
              <div className="flex items-center justify-center py-20 text-red-500">
                Error loading PDF. Please try again.
              </div>
            }
            className="max-w-full"
          >
            {numPages > 0 && (
              <Page
                key={`page_${pageNumber}`}
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                loading={
                  <div 
                    className="bg-neutral-800/50 animate-pulse rounded-lg" 
                    style={{ 
                      width: containerWidth * 0.8,
                      height: (containerWidth * 0.8) * 1.4,
                    }}
                  />
                }
                className="shadow-xl"
                width={containerWidth * 0.8}
              />
            )}
          </Document>
        </div>
      </div>
    </div>
  );
}
