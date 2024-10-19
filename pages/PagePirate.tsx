import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const UploadPdf = () => {
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [citation, setCitation] = useState<string>("");

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Generate a temporary URL for the uploaded file
      setPdfUrl(fileUrl);
    }
  };

  const handleSubmit = () => {
    if (pdfUrl && citation) {
      // Redirect to the PDF viewer page with both the file URL and citation as query parameters
      router.push(
        `/PDFViewer?url=${encodeURIComponent(pdfUrl)}&citation=${encodeURIComponent(
          citation
        )}`
      );
    } else {
      alert("Please upload a PDF file and enter a citation.");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
      />
      <input
        type="text"
        value={citation}
        onChange={(e) => setCitation(e.target.value)}
        placeholder="Enter citation"
        className="border p-2 mt-2"
      />
      <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white">
        Upload and Search Citation
      </button>
    </div>
  );
};

export default UploadPdf;
