import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { searchPlugin } from "@react-pdf-viewer/search";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";

const JumpToFirstMatchExample: React.FC = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams?.get("url");
  const keyword = searchParams?.get("citation");

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);

  const handleDocumentLoad = () => setDocumentLoaded(true);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const searchPluginInstance = searchPlugin();
  const { highlight } = searchPluginInstance;

  React.useEffect(() => {
    if (isDocumentLoaded && keyword) {
      highlight(keyword);
    }
  }, [isDocumentLoaded]);
  

  if (!fileUrl) {
    return <p>Error: No PDF file provided.</p>;
  }

  return (
    <div className="h-screen w-screen">
      {fileUrl ? (
        <>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={fileUrl}
              plugins={[defaultLayoutPluginInstance, searchPluginInstance]}
              onDocumentLoad={handleDocumentLoad}
              renderLoader={(progress: number) => (
                <div style={{ width: '240px', margin: '0 auto' }}>
                  <ProgressBar progress={Math.round(progress * 100)} />
                </div>
              )}
    
            />
          </Worker>
        </>
      ) : (
        <p>No PDF file loaded</p>
      )}
    </div>
  );
};

export default JumpToFirstMatchExample;
