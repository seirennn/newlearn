declare module 'pdfjs-dist/build/pdf.worker.entry' {
  interface PDFWorkerOptions {
    name?: string;
    port?: MessagePort | Worker | null; 
  }

  class PDFWorker {
    constructor(options?: PDFWorkerOptions);
    destroy(): void;
  }

  export default PDFWorker;
}
