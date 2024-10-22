// import { useRouter } from "next/navigation";
// import { ChangeEvent, useState } from "react";

// const UploadPdf = () => {
//   const router = useRouter();
//   const [pdfUrl, setPdfUrl] = useState<string>("");
//   const [citation, setCitation] = useState<string>("");
//   const [wordFile, setWordFile] = useState<File | null>(null); // State for Word file

//   // Handle PDF upload
//   const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const fileUrl = URL.createObjectURL(file); // Generate a temporary URL for the uploaded file
//       setPdfUrl(fileUrl);
//     }
//   };

//   // Handle Word file upload
//   const handleWordUpload = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setWordFile(file); // Store the Word file
//     }
//   };

//   // Handle PDF submission
//   const handleSubmitPdf = () => {
//     if (pdfUrl && citation) {
//       router.push(
//         `/JumpToFirstMatchExample?url=${encodeURIComponent(pdfUrl)}&citation=${encodeURIComponent(
//           citation
//         )}`
//       );
//     } else {
//       alert("Please upload a PDF file and enter a citation.");
//     }
//   };

//   // Handle Word to PDF conversion and submission
//   const handleWordSubmit = async () => {
//     if (wordFile && citation) {
//       const formData = new FormData();
//       formData.append('file', wordFile);

//       try {
//         // Call your backend API to convert the Word document to PDF
//         const response = await fetch('/api/convert-word-to-pdf', {
//           method: 'POST',
//           body: formData,
//         });
//         const result = await response.json();

//         if (result.pdfUrl) {
//           router.push(
//             `/JumpToFirstMatchExample?url=${encodeURIComponent(result.pdfUrl)}&citation=${encodeURIComponent(
//               citation
//             )}`
//           );
//         } else {
//           alert('Failed to convert Word document to PDF.');
//         }
//       } catch (error) {
//         console.error('Error during conversion:', error);
//         alert('Error during Word to PDF conversion.');
//       }
//     } else {
//       alert('Please upload a Word file and enter a citation.');
//     }
//   };

//   return (
//     <div>
//       {/* PDF Upload Section */}
//       <div>
//         <h2>Upload PDF</h2>
//         <input type="file" accept="application/pdf" onChange={handleFileUpload} />
//         <input
//           type="text"
//           value={citation}
//           onChange={(e) => setCitation(e.target.value)}
//           placeholder="Enter citation"
//           className="border p-2 mt-2"
//         />
//         <button onClick={handleSubmitPdf} className="p-2 bg-blue-500 text-white mt-2">
//           Upload and Search Citation in PDF
//         </button>
//       </div>

//       <hr className="my-4" />

//       {/* Word to PDF Upload Section */}
//       <div>
//         <h2>Convert Word to PDF</h2>
//         <input type="file" accept=".doc,.docx" onChange={handleWordUpload} />
//         <input
//           type="text"
//           value={citation}
//           onChange={(e) => setCitation(e.target.value)}
//           placeholder="Enter citation"
//           className="border p-2 mt-2"
//         />
//         <button onClick={handleWordSubmit} className="p-2 bg-green-500 text-white mt-2">
//           Convert Word to PDF and Search Citation
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UploadPdf;


import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const UploadPdf = () => {
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [citation, setCitation] = useState<string>("");
  const [wordFile, setWordFile] = useState<File | null>(null); // State for Word file

  // Handle PDF upload
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Generate a temporary URL for the uploaded file
      setPdfUrl(fileUrl);
    }
  };

  // Handle Word file upload
  const handleWordUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setWordFile(file); // Store the Word file
    }
  };

  // Handle PDF submission
  const handleSubmitPdf = () => {
    if (pdfUrl && citation) {
      router.push(
        `/JumpToFirstMatchExample?url=${encodeURIComponent(pdfUrl)}&citation=${encodeURIComponent(
          citation
        )}`
      );
    } else {
      alert("Please upload a PDF file and enter a citation.");
    }
  };

  // Handle Word to PDF conversion and submission
  const handleWordSubmit = async () => {
    if (wordFile && citation) {
      const formData = new FormData();
      formData.append('file', wordFile);

      try {
        // Call your backend API to convert the Word document to PDF
        const response = await fetch('/api/convert-word-to-pdf', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (result.pdfUrl) {
          router.push(
            `/JumpToFirstMatchExample?url=${encodeURIComponent(result.pdfUrl)}&citation=${encodeURIComponent(
              citation
            )}`
          );
        } else {
          alert('Failed to convert', );
          console.log(result)
        }
      } catch (error) {
        console.error('Error during conversion:', error);
        alert('Error during Word to PDF conversion.');
      }
    } else {
      alert('Please upload a Word file and enter a citation.');
    }
  };

  return (
    <div>
      {/* PDF Upload Section */}
      <div>
        <h2>Upload PDF</h2>
        <input type="file" accept="application/pdf" onChange={handleFileUpload} />
        <input
          type="text"
          value={citation}
          onChange={(e) => setCitation(e.target.value)}
          placeholder="Enter citation"
          className="border p-2 mt-2"
        />
        <button onClick={handleSubmitPdf} className="p-2 bg-blue-500 text-white mt-2">
          Upload and Search Citation in PDF
        </button>
      </div>

      <hr className="my-4" />

      {/* Word to PDF Upload Section */}
      <div>
        <h2>Convert Word to PDF</h2>
        <input type="file" accept=".doc,.docx" onChange={handleWordUpload} />
        <input
          type="text"
          value={citation}
          onChange={(e) => setCitation(e.target.value)}
          placeholder="Enter citation"
          className="border p-2 mt-2"
        />
        <button onClick={handleWordSubmit} className="p-2 bg-green-500 text-white mt-2">
          Convert Word to PDF and Search Citation
        </button>
      </div>
    </div>
  );
};

export default UploadPdf;
