import React from "react";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import 'pdfjs-dist/legacy/build/pdf.worker';


function PdfDisplay() {
//   GlobalWorkerOptions.workerSrc = "/_next/static/chunks/pdf.worker.min.js";

//   const pdfPath = process.argv[2] || "./Crypto.pdf";

//   // Will be using promises to load document, pages and misc data instead of
//   // callback.
//   const loadingTask = getDocument(pdfPath);
//   loadingTask.promise
//     .then(function (doc: any) {
//       const numPages = doc.numPages;
//       console.log("# Document Loaded");
//       console.log("Number of Pages: " + numPages);
//       console.log();

//       let lastPromise; // will be used to chain promises
//       lastPromise = doc.getMetadata().then(function (data: any) {
//         console.log("# Metadata Is Loaded");
//         console.log("## Info");
//         console.log(JSON.stringify(data.info, null, 2));
//         console.log();
//         if (data.metadata) {
//           console.log("## Metadata");
//           console.log(JSON.stringify(data.metadata.getAll(), null, 2));
//           console.log();
//         }
//       });

//       const loadPage = function (pageNum: any) {
//         return doc.getPage(pageNum).then(function (page: any) {
//           console.log("# Page " + pageNum);
//           const viewport = page.getViewport({ scale: 1.0 });
//           console.log("Size: " + viewport.width + "x" + viewport.height);
//           console.log();
//           return page
//             .getTextContent()
//             .then(function (content: any) {
//               // Content contains lots of information about the text layout and
//               // styles, but we need only strings at the moment
//               const strings = content.items.map(function (item: any) {
//                 return item.str;
//               });
//               console.log("## Text Content");
//               console.log(strings.join(" "));
//               // Release page resources.
//               page.cleanup();
//             })
//             .then(function () {
//               console.log();
//             });
//         });
//       };
//       // Loading of the first page will wait on metadata and subsequent loadings
//       // will wait on the previous pages.
//       for (let i = 1; i <= numPages; i++) {
//         lastPromise = lastPromise.then(loadPage.bind(null, i));
//       }
//       return lastPromise;
//     })
//     .then(
//       function () {
//         console.log("# End of Document");
//       },
//       function (err: any) {
//         console.error("Error: " + err);
//       }
//     );
// }
}
export default PdfDisplay;
