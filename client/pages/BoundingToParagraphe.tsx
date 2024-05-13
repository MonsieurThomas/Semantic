import apiResponse from "../src/app/utils/ApiJsonResponse";
import React, { useState } from "react";




const findFullString = (index:number, selected:any, textRefs:any, setSelectedParagraphIndex:any, setShowBackground:any, setProgrammaticScroll:any) => {
    console.log("this selected", selected)
    const searchText = String(selected.bounding[index]);
  
    if (!searchText.includes("... —> ...")) {
      return;
    }
  
    const parts = searchText.split("... —> ...");
    const startText = parts[0];
    const endText = parts[1];
  
    const apiText = apiResponse.find(item => 
      item.content.includes(startText) && item.content.includes(endText)
    );
  
    if (apiText) {
      const textIndex = apiResponse.findIndex((item:any) => item === apiText);
      setSelectedParagraphIndex(textIndex);
      setShowBackground(true);
      setProgrammaticScroll(true); 
      const textElement = textRefs.current[textIndex];
  
      if (textElement) {
        textElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => setProgrammaticScroll(false), 1000);      }
    } else {
      console.log("No matching text found.");
    }
  };


  export default findFullString;