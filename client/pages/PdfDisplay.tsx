import React, { useState, useEffect } from 'react';
// // import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// import * as pdfjsLib from "pdfjs-dist/webpack";
// import 'pdfjs-dist/legacy/build/pdf.worker.entry';

// interface PdfDisplayProps {
//     file: string;
//     isVisible: boolean;
//   }
  
//   const PdfDisplay: React.FC<PdfDisplayProps> = ({ file, isVisible }) => {
//     const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  
//   useEffect(() => {
//     const fetchPdf = async () => {
//       if (isVisible) {
//         // Charge le document PDF
//         const loadingTask = pdfjsLib.getDocument(file);
//         const pdf = await loadingTask.promise;
//         setPdfDocument(pdf);
//       } else {
//         setPdfDocument(null);
//       }
//     };

//     fetchPdf();
//   }, [file, isVisible]);

//   useEffect(() => {
//     const renderPdf = async () => {
//       if (pdfDocument) {
//         // Obtient la première page du document PDF
//         const page = await pdfDocument.getPage(1);
//         const scale = 1.5;
//         const viewport = page.getViewport({ scale: scale });

//         // Prépare le canvas pour le rendu du PDF
//         const canvas = document.getElementById('pdfCanvas');
//         const context = canvas.getContext('2d');
//         canvas.height = viewport.height;
//         canvas.width = viewport.width;

//         // Rendu de la page PDF
//         const renderContext = {
//           canvasContext: context,
//           viewport: viewport,
//         };
//         await page.render(renderContext).promise;
//       }
//     };

//     renderPdf();
//   }, [pdfDocument]);

//   if (!isVisible) {
//     return null;
//   }

//   return (
//     <div>
//       <canvas id="pdfCanvas"></canvas>
//     </div>
//   );
function PdfDisplay() {
    return (
      <iframe
        src="/Crypto.pdf"
        width="80%"
        height="600px"
        style={{ border: 'none' }}
      ></iframe>
    );
  }

export default PdfDisplay;