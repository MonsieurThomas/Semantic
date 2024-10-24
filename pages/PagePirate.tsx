import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { handleSubmit } from "./api/fileUploadHelpers"; // Import the function from the new file

const UploadFiles = () => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]); // State for multiple files (PDFs and Word files)
  const [citation, setCitation] = useState<string>("");

  // Handle file uploads (both PDF and Word files)
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...(Array.from(selectedFiles) as File[]),
      ]); // Append the new files to the existing array
    }
  };

  // Use the imported handleSubmit function for submission
  const handleSubmission = async () => {
    await handleSubmit(files, citation, router);
  };

  return (
    <div>
      <div>
        <h2>Upload Files (PDFs or Word)</h2>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          multiple
        />
        <input
          type="text"
          value={citation}
          onChange={(e) => setCitation(e.target.value)}
          placeholder="Enter citation"
          className="border p-2 mt-2"
        />
        <button
          onClick={handleSubmission}
          className="p-2 bg-blue-500 text-white mt-2"
        >
          Submit and Search
        </button>
      </div>
    </div>
  );
};

export default UploadFiles;
