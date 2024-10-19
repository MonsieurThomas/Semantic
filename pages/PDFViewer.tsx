"use client";

import { useSearchParams } from "next/navigation";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";

// Set the PDF.js worker URL
import { GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const PdfViewer: React.FC = () => {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams?.get("url");
  const citationQuery = searchParams?.get("citation"); // Get the citation from the URL

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Initialize the search plugin with the citation query
  const searchPluginInstance = searchPlugin({
    keyword: citationQuery ? [citationQuery] : [], // Highlight the citation if it exists
  });

  return (
    <div className="h-screen w-screen">
      {pdfUrl ? (
        <>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[defaultLayoutPluginInstance, searchPluginInstance]} // Use the search plugin
            />
          </Worker>

          {/* Input for searching citation manually */}
          <div className="mt-4">
            <input
              type="text"
              value={citationQuery || ""}
              readOnly
              placeholder="Enter citation"
              className="border p-2"
            />
          </div>
        </>
      ) : (
        <p>No PDF file loaded</p>
      )}
    </div>
  );
};

export default PdfViewer;
