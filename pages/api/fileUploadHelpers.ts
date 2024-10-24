import { useRouter } from "next/navigation";

// Function to merge all PDFs and serve the final merged PDF
const mergeAllPdfs = async (
  pdfFiles: (File | string)[],
  citation: string,
  router: ReturnType<typeof useRouter>
) => {
  try {
    const formData = new FormData();

    // Append each PDF to the FormData
    console.log("pdfFiles", pdfFiles);
    for (const [index, file] of pdfFiles.entries()) {
      if (typeof file === "string") {
        // Convert the URL to Blob and then create a File object
        const fileBlob = await fetch(file).then((res) => res.blob());
        const fileObj = new File([fileBlob], `file${index}.pdf`);
        formData.append(`pdf${index}`, fileObj);
      } else if (file instanceof File) {
        // If it's already a File object, append it directly
        formData.append(`pdf${index}`, file);
      }
    }

    // Call the API to merge the PDFs
    const mergeResponse = await fetch("/api/merge-pdfs", {
      method: "POST",
      body: formData,
    });

    const mergeResult = await mergeResponse.json();
    console.log("mergeResult = ", mergeResult);
    if (mergeResult.mergedPdfUrl) {
      router.push(
        `/JumpToFirstMatchExample?url=${encodeURIComponent(
          mergeResult.mergedPdfUrl
        )}&citation=${encodeURIComponent(citation)}`
      );
    } else {
      alert("Failed to merge the PDFs.");
    } // creation liseuse
  } catch (error) {
    console.error("Error during PDF merging process:", error);
    alert("Error during PDF merging.");
  }
};

// Main function to handle the submission
export const handleSubmit = async (
  files: File[],
  citation: string,
  router: ReturnType<typeof useRouter>
) => {
  if (files.length > 0 && citation) {
    const formData = new FormData();
    let pdfFiles: (File | string)[] = []; // Store PDFs as File objects or URLs
    let hasDocx = false;

    // Identify file types and append files to FormData
    files.forEach((file, index) => {
      if (file.type === "application/pdf") {
        pdfFiles.push(file); // Collect PDFs for later merging
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        hasDocx = true;
        formData.append(`file${index}`, file); // Append Word files for conversion
      }
    });

    if (hasDocx) {
      // Step 1: Convert Word files to PDF
      try {
        const mergeResponse = await fetch("/api/convert-word-to-pdf", {
          method: "POST",
          body: formData,
        });
        const mergeResult = await mergeResponse.json();
        console.log("mergeResult", mergeResult);
        if (mergeResult.pdfUrl) {
          // Add converted PDFs (URLs) to pdfFiles array
          pdfFiles = [...pdfFiles, mergeResult.pdfUrl]; // Assuming URLs are returned

          // Proceed to merge all PDFs
          await mergeAllPdfs(pdfFiles, citation, router);
        } else {
          alert("Failed to convert the Word documents to PDF.");
        }
      } catch (error) {
        console.error("Error during Word to PDF conversion:", error);
        alert("Error during Word to PDF conversion.");
      }
    } else {
      // If no Word files, directly merge the uploaded PDF files
      await mergeAllPdfs(pdfFiles, citation, router);
    }
  } else {
    alert("Please upload files and enter a citation.");
  }
};
