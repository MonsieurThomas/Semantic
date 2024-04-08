// import React, { useState, useEffect } from "react";
// import { getDocument } from "pdfjs-dist";
// import { GlobalWorkerOptions } from "pdfjs-dist";

// const PdfViewer: React.FC<{ pdfPath: string }> = ({ pdfPath }) => {
// const [formattedText, setFormattedText] = useState(""); // Contiendra le texte HTML

// useEffect(() => {
//   GlobalWorkerOptions.workerPort = new Worker(
//     new URL("pdfjs-dist/build/pdf.worker", import.meta.url)
//   );
//   async function extractAndFormatText() {
//     const loadingTask = getDocument(pdfPath);
//     try {
//       const pdfDoc = await loadingTask.promise;
//       let htmlContent = "";

//       for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
//         const page = await pdfDoc.getPage(pageNum);
//         const textContent = await page.getTextContent();

//         textContent.items.forEach((item: any) => {
//           const isTitle = item.transform[0] > 15; // `item.transform[0]` peut représenter la taille de la police
//           console.log(item.transform[0]);
//           if (isTitle) {
//             htmlContent += `<h2>${item.str}</h2>`;
//           } else {
//             htmlContent += `<p>${item.str}</p>`;
//           }
//         });
//       }

//       setFormattedText(htmlContent);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   extractAndFormatText();
// }, [pdfPath]);
// console.log(formattedText);

// return formattedText;
// };

// export default PdfViewer;
// "use client"
// import React, { useEffect, useState } from "react";
// import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
// import styles from "./PdfViewer.module.css";

// const PdfViewer = (pdfPath:any) => {

//     GlobalWorkerOptions.workerPort = new Worker(
//       new URL("pdfjs-dist/build/pdf.worker", import.meta.url)
//     );

//     // async function extractPdfContent(pdfPath: string) {

//       let htmlContent = "";

//       try {
//         const loadingTask = getDocument(pdfPath);
//         const pdfDoc = await loadingTask.promise;

//         for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
//           const page = await pdfDoc.getPage(pageNum);
//           const textContent = await page.getTextContent();

//           textContent.items.forEach((item: any) => {
//             const isTitle = item.transform[0] > 12; // `item.transform[0]` peut représenter la taille de la police
//             if ("str" in item) {
//               // Vérifiez si l'objet item a la propriété str
//               if (isTitle) {
//                 htmlContent += `<h2 class="${styles.title}">${item.str}</h2>`;
//               } else {
//                 htmlContent += `<p class="${styles.paragraph}">${item.str}</p>`;
//               }
//             }
//           });
//         }

//       } catch (error) {
//         console.error("Erreur lors de l'extraction du PDF:", error);
//       }
//     // }

//   return (htmlContent);
// };

// export default PdfViewer;

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

if (typeof window !== "undefined") {
  // S'assurer que le code s'exécute seulement côté client
  GlobalWorkerOptions.workerPort = new Worker(
    new URL("pdfjs-dist/build/pdf.worker", import.meta.url)
  );
}
async function extractPdfContent(pdfPath: any) {
  let htmlContent = "";

  try {
    const loadingTask = getDocument(pdfPath);
    const pdfDoc = await loadingTask.promise;

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      textContent.items.forEach((item) => {
        // Vérifiez si l'objet item a la propriété str
        if ("str" in item) {
          const isTitle = item.transform[0] > 12; // `item.transform[0]` peut représenter la taille de la police
          if (isTitle) {
            htmlContent += `<h2>${item.str}</h2>`;
          } else {
            htmlContent += `<p>${item.str}</p>`;
          }
        }
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'extraction du PDF:", error);
  }

  return htmlContent; // Renvoie le contenu HTML extrait
}

// };

export default extractPdfContent;
