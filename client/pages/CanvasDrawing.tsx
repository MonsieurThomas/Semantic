"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import nestedObjectData from "../src/app/utils/NestedObjectData";
import apiResponse from "../src/app/utils/ApiJsonResponse";
import MapObject from "../src/app/utils/MapObject";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DrawTab from "./MapLogic/DrawTab";
import CheckPistachePostion from "./CheckPistachePostion";
import MarquePage from "../public/MarquePage.png"
import useOutsideClick from '../src/hooks/useOutsideClick'; 
import task0 from "../public/task0.png"
import task1 from "../public/task1.png"
import task2 from "../public/task2.png"
import task3 from "../public/task3.png"
import task4 from "../public/task4.png"
import task5 from "../public/task5.png"
import task6 from "../public/task6.png"
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
// import "../src/app/styles/style.css"


interface NestedObject {
  [key: string]: any;
}

const CanvasDrawing = () => {
  
  let count = 0;
  let branchNb = 0;
  let localeTab: Array<any> = [];
  let pdf = "";
  
  function processNestedObject(
    obj: NestedObject,
    depth = 0,
    branch = 0,
    parentKey = "",
    path = ""
  ): [NestedObject, number, number, number] {
    let localCount = 0;
    let localSum = 0;
    const newObj: NestedObject = {};
    let index = 0;
  
    for (const key in obj) {
      let currentPath = path ? `${path}.${index + 1}` : `${index + 1}`;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key]) &&
        !('value' in obj[key])  // Check if it's not a terminal node
      ) {
        if (depth === 1) {
          branchNb++;
          path = `${branchNb}`;
        }
        index++;
        const [processedObj, subCount, subSum] = processNestedObject(
          obj[key],
          depth + 1,
          branchNb,
          key,
          currentPath
        );
        newObj[key] = { ...processedObj };
        localCount += subCount;
        localSum += subSum;
      } else if ('value' in obj[key]) {  // Handle terminal nodes with value and offset
        if (depth === 1) {
          branchNb++;
        }
        index++;
        count++;
        localCount++;
        localSum += count;
        localeTab.push({
          x: depth,
          y: count,
          value: obj[key].value,
          branch: branchNb,
          path: currentPath.substring(2),
          count: count,
          bounding: obj[key].bounding
        });
      }
    }
  
    if (localSum && depth - 1 >= 0) {
      localeTab.push({
        x: depth - 1,
        y: localSum / localCount,
        value: parentKey,
        branch: branchNb,
        path: path.substring(2),
        count: count,
      });
    }
    localSum += localSum / localCount;
    localCount++;
    return [newObj, localCount, localSum, branch];
  }
  

  const AddCoordinates: (obj: NestedObject) => any[][] = (
    obj: NestedObject
  ) => {
    localeTab = [];
    const [newObj, , ,] = processNestedObject(obj, 0);
    // count = 0;
    branchNb = 0;
    // console.log("Mince pendant instanciation");

    return localeTab;
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////  countNestedObjectLevels   ////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function setCamera(obj: any) {
    const centerX = obj.x + 350 / 2;
    const centerY = obj.y * 160 + 100 / 2;
    // console.log("obj.y", obj.y);
    const centerViewportX = widthScreen / 2;
    const centerViewportY = heightScreen / 2;
    const newZoomLevel = 0.3;

    const panX = (centerX * newZoomLevel - centerViewportX) * -1;
    const panY = (centerY * newZoomLevel - centerViewportY) * -1;

    setPanOffset({ x: panX, y: panY });
    setZoomLevel(newZoomLevel);
    redrawCanvas();
  }

  function ChangeXandY(tab: Array<any>) {
    let midBranch = 0;
    let midCount = 0;
    let maxCount = 0;

    tab.forEach((obj) => {
      // branche moyenne pour envoyer la moitié de la carte a gauche
      if (obj.count === Math.floor(count / 2)) midBranch = obj.branch + 1;
    });
    // console.log("This is midbranch = ", midBranch);

    tab.forEach((obj) => {
      // hauteur max de la section droite de la carte
      if (obj.branch < midBranch) if (midCount < obj.y) midCount = obj.y;
    });

    tab.forEach((obj) => {
      // creating obj.end for drawing arc
      let localeNumObj = obj.path[obj.path.length - 1];
      let max = 0;
      let diff = 0;
      obj.begin = false;
      tab.forEach((obj2) => {
        let localeNumObj2 = obj2.path[obj2.path.length - 1];
        if (obj.path.slice(0, -1) === obj2.path.slice(0, -1)) {
          diff++;
          if (localeNumObj2 > max) max = localeNumObj2;
          if (
            obj.path[obj.path.length - 1] == "1" &&
            obj2.path[obj2.path.length - 1] === "2"
          ) {
            // console.log(`ok pour ${obj.path} et ${obj2.path}`);
            obj.begin = true;
          }
        }
      });
      localeNumObj === max && diff > 1 ? (obj.end = true) : (obj.end = false);
    });

    tab.forEach((obj) => {
      // // changement de position pour la gauche

      if (obj.branch >= midBranch) {
        obj.y = obj.y - midCount + (count - midCount) / 2 - 3;
        obj.x = -obj.x;
      }
    });

    tab.forEach((obj) => {
      //placement titre centrale a la moyenne de la section droite
      if (obj.x === 0 || obj.x === -0) {
        obj.y = midCount / 2;
        obj.branch = 0;
        setCamera(obj);
      }
    });

    tab.forEach((obj) => {
      obj.y = obj.y * 160;
      obj.x = obj.x * 550;
      obj.hover = false;
      obj.hide = false;
      obj.occurence = 2;
    });
  }

  /////
  /////
  /////word

//   const [htmlContent, setHtmlContent] = useState("");

//   useEffect(() => {
//     const analyzeDocument = async () => {
//         try {
//             console.log("\n\nthis is htmlcontent before\n\n");
//             const response = await fetch(`${window.location.origin}/api/analyzeDocument`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ filePath: "./pages/api/textMap.pdf" }), // Ensure this is accessible server-side
//             });
//             const data = await response.json();
//             console.log("\n\nthis is htmlcontent, c'est une reussite\n\n");

//             setHtmlContent(data);
//             console.log("this is htmlcontent in useEffect = ", data);

//         } catch (error) {
//             console.error('Error fetching analysis results:', error);
//         }
//     };

//     analyzeDocument();
// }, []);
 

  /////
  /////
  /////
  /////
  /////
  /////

  function Color(tab: Array<any>) {
    const randomNumber = Math.random();
    const color = [
      "#000229",
      "#FA463E",
      "#01B577",
      "#F39D4C",
      "#E2C524",
      "#47B8D4",
    ];
    tab.forEach((obj) => {
      obj.color = color[obj.branch];
    });
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [localTab, setLocalTab] = useState<Array<any>>([]);

  useEffect(() => {
    const nestedDummy = JSON.parse(JSON.stringify(nestedObjectData));
    const tab = AddCoordinates(nestedDummy);
    ChangeXandY(tab);
    Color(tab);
    setLocalTab(tab);
    // console.log("This is count = ", count);
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const zoomHandleRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const modalRef   = useRef<HTMLDivElement>(null);

  type Quartet = [string, string, string, string];

  const [selectedText, setSelectedText] = useState<string | null>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomFraction, setZoomFraction] = useState<number>(0.35);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringObject, setIsHoveringObject] = useState(false);
  const [pistacheTab, setPistacheTab] = useState<any>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showPistacheTab, setShowPistacheTab] = useState(false);
  const [isTextShown, setIsTextShown] = useState(false);
  const [fullText, setFullText] = useState("");
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [selected, setSelected] = useState<any>();
  const [isPistacheOpen, setIsPistacheOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoom = 0.7;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const minZoom = 0.15;
  const widthScreen = 1500;
  const heightScreen = 500;

  const onZoomHandleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setIsZooming(true);
    },
    []
  );

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y); ///// position de depart
    ctx.scale(zoomLevel, zoomLevel);
    DrawTab(ctx, localTab, formatZoom(zoomFraction));
    ctx.restore();
  }, [panOffset, zoomLevel, localTab, zoomFraction]);

  useEffect(() => {
    redrawCanvas();
  }, [localTab, redrawCanvas]);

  const checkClosenessWithCases = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left - panOffset.x;
      const y = e.clientY - rect.top - panOffset.y;

      let isHovering = false;

      localTab.forEach((obj) => {
        const adjustedX = x / zoomLevel;
        const adjustedY = y / zoomLevel;

        if (
          adjustedX >= obj.x &&
          adjustedX <= obj.x + 350 &&
          adjustedY >= obj.y - 50 &&
          adjustedY <= obj.y + 100
        ) {
          obj.hover = true;
          isHovering = true;
        } else {
          obj.hover = false;
        }
      });
      setIsHoveringObject(isHovering);
      redrawCanvas();
    },
    [zoomLevel, panOffset.x, panOffset.y, localTab, redrawCanvas]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const zoomHandle = zoomHandleRef.current;
    const scrollContainer = scrollContainerRef.current;

    const onMouseDown = (e: MouseEvent) => {
      if (
        zoomHandleRef.current &&
        zoomHandleRef.current.contains(e.target as Node)
      ) {
      } else {
        // zoom
        setIsPanning(true); // souris enfoncé
        setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      checkClosenessWithCases(e);
      if (isZooming && zoomHandle) {
        const rect = zoomHandle.parentElement!.getBoundingClientRect();
        const handleWidth = zoomHandle.offsetWidth;
        const newPositionX = e.clientX - rect.left - handleWidth / 2;
        const newLeft = Math.max(
          0,
          Math.min(newPositionX, rect.width - handleWidth)
        );
        zoomHandle.style.left = `${newLeft}px`;
        if (newPositionX >= 0 && newPositionX < rect.width - 4) {
          setZoomFraction(newPositionX / (rect.width - zoomHandle.offsetWidth));
          if (canvas) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const canvasX = (centerX - panOffset.x) / zoomLevel;
            const canvasY = (centerY - panOffset.y) / zoomLevel;
            const newZoomLevel = minZoom + (maxZoom - minZoom) * zoomFraction;
            const newPanOffsetX = centerX - canvasX * newZoomLevel;
            const newPanOffsetY = centerY - canvasY * newZoomLevel;
            setZoomLevel(newZoomLevel);
            setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });
          }
        }
      } else if (isPanning && canvas) {
        const dx = e.clientX - startPan.x;
        const dy = e.clientY - startPan.y;
        setPanOffset({ x: dx, y: dy });
        redrawCanvas();
      }

      if (zoomHandle && e.target === zoomHandle && isZooming) {
        redrawCanvas();
      }
    };

    /////handle weel ////
    /////handle weel ////
    /////handle weel ////
    const handleWheel = (e: WheelEvent) => {
      if (searchValue && e.clientX < 220 && e.clientX < 435) return;
      if (showPistacheTab && e.clientX > 1140 && e.clientX < 1500) return;
      console.log("e.clientX dans handlewheel = ", e.clientX)
      if (isTextShown) return;
      e.preventDefault();

      const zoomIntensity = 0.03;
      const direction = e.deltaY < 0 ? 1 : -1;
      const newZoomLevel = Math.min(
        maxZoom,
        Math.max(minZoom, zoomLevel + direction * zoomIntensity)
      );
      setZoomFraction((newZoomLevel - minZoom) / (maxZoom - minZoom));

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const canvasX = (mouseX - rect.left - panOffset.x) / zoomLevel;
        const canvasY = (mouseY - rect.top - panOffset.y) / zoomLevel;
        const newPanOffsetX =
          panOffset.x - (canvasX * newZoomLevel - canvasX * zoomLevel);
        const newPanOffsetY =
          panOffset.y - (canvasY * newZoomLevel - canvasY * zoomLevel);

        // zoom bar
        if (zoomHandle) {
          const rect = zoomHandle.parentElement!.getBoundingClientRect();
          const handleWidth = zoomHandle.offsetWidth;
          const newPositionX = Math.min(
            maxZoom,
            Math.max(minZoom, zoomLevel + direction * zoomIntensity)
          );
          const newLeft = Math.max(
            0,
            Math.min(newPositionX, rect.width - handleWidth)
          );
          zoomHandle.style.left = `${
            ((newLeft - minZoom) / (maxZoom - minZoom)) * 150
          }px`;
        }
        // console.log("newPanOffsetX dans handlewheel = ", newPanOffsetX);
        // console.log("newPanOffsetY dans handlewheel = ", newPanOffsetY);
        // console.log("newZoomLevel dans handlewheel = ", newZoomLevel);
        setZoomLevel(newZoomLevel);
        setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });
        redrawCanvas();
      }
    };

    // const handleClickOutside = (e: MouseEvent) => {
    //   // // Vérifie si le clic a été en dehors du contenu du texte
    //   // if (e.target?.id === "modal-backdrop") {
    //   setIsTextShown(false);
    //   // }
    // };

    const onMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
      }
      if (isZooming) {
        setIsZooming(false);
      }
    };

    const handleScroll = () => {
      // console.log("ScrollPourcent debut")
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollPosition = window.pageYOffset;
      const scrolledPercentage = (currentScrollPosition / totalScrollHeight) * 100;

      // setScrollPercentage(scrolledPercentage);
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // setIsPistacheOpen(!isPistacheOpen)

      const x = e.clientX - rect.left - panOffset.x;
      const y = e.clientY - rect.top - panOffset.y;

      localTab.forEach((obj) => {
        const adjustedX = x / zoomLevel;
        const adjustedY = y / zoomLevel;

        if (
          adjustedX >= obj.x &&
          adjustedX <= obj.x + 350 &&
          adjustedY >= obj.y &&
          adjustedY <= obj.y + 100
        ) {
          if (obj.bounding)
          // console.log("this is setSelected ", selected);
          if (obj.bounding) 
          {
            setSelected(obj);
            setIsTextShown(!isTextShown);
          }
        }
        if (
          adjustedX >= obj.x + 15 &&
          adjustedX <= obj.x + 70 &&
          adjustedY >= obj.y - 40 &&
          adjustedY <= obj.y
        ) {
          obj.hideRoot = !obj.hideRoot;
          hideCases(localTab, obj);
        } else if (
          adjustedX >= obj.x + 290 &&
          adjustedX <= obj.x + 350 &&
          adjustedY >= obj.y - 40 &&
          adjustedY <= obj.y
        ) {
          if (isPistacheOpen == false)
            obj.isPistache = !obj.isPistache;

          else if (isPistacheOpen && obj.isPistache)
            obj.isPistache = !obj.isPistache;
          redrawCanvas();
        }
        if (obj.isPistache &&
          adjustedX >= obj.x + 400 &&
          adjustedX <= obj.x + 750 &&
          adjustedY >= obj.y - 120 &&
          adjustedY <= obj.y + 260)
          setPistacheTab(CheckPistachePostion(obj, adjustedX, adjustedY, pistacheTab));
          redrawCanvas();
      });
    };

    const handleScrollOverflow = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const totalScrollHeight = scrollHeight - clientHeight;
      const scrolledPercentage = (scrollTop / totalScrollHeight) * 100;
      setScrollPercentage(scrolledPercentage);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("click", handleCanvasClick);
    // document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("wheel", handleWheel, { passive: false });
    if (scrollContainer) scrollContainer.addEventListener('scroll', handleScrollOverflow);
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
    });
    window.addEventListener('scroll', handleScroll);
    if (zoomHandle) zoomHandle.addEventListener("mousedown", onMouseDown);
    canvas?.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("click", handleCanvasClick);
      // document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("wheel", handleWheel);
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScrollOverflow);
      if (zoomHandle) zoomHandle.removeEventListener("mousedown", onMouseDown);
      canvas?.removeEventListener("mousedown", onMouseDown);
    };
  }, [
    isPanning,
    panOffset,
    zoomLevel,
    redrawCanvas,
    startPan.x,
    startPan.y,
    isZooming,
    zoomFraction,
    searchValue,
    localTab,
    checkClosenessWithCases,
    hideCases,
    isTextShown,
  ]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////  zoom pad  ///////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  function formatZoom(zoomFraction: number): number {
    zoomFraction *= 100;
    let formattedNumber = parseInt(zoomFraction.toFixed(0));
    if (formattedNumber > 100) formattedNumber = 100;
    return formattedNumber;
  }

  const handleInputChange = (event: any) => {
    setSearchValue(event.target.value);
  };

  function getOpacity(obj: any) {
    const calculatedOpacity = (10 - (Math.abs(obj.x / 550) - 1) * 1.5) / 10;
    return Math.max(calculatedOpacity, 0.5);
  }

  const zoomToValue = useCallback(
    (obj: any) => {
      const centerX = obj.x + 350 / 2;
      const centerY = obj.y + 100 / 2;

      const centerViewportX = widthScreen / 2;
      const centerViewportY = heightScreen / 2;
      const newZoomLevel = 0.5;

      const panX = (centerX * newZoomLevel - centerViewportX) * -1;
      const panY = (centerY * newZoomLevel - centerViewportY) * -1;

      setPanOffset({ x: panX, y: panY });
      setZoomLevel(newZoomLevel);
      redrawCanvas();
    },
    [widthScreen, heightScreen, setPanOffset, setZoomLevel, redrawCanvas]
  );

  function hideCases(localTab: any, objPath: any) {
    localTab.forEach((obj: any) => {
      if (
        obj.path.includes(objPath.path) &&
        obj.path.startsWith(objPath.path) &&
        obj.path.length != objPath.path.length
      ) {
        obj.hide = !obj.hide;
      }
    });
    redrawCanvas();
  }

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selected]);

  const togglePistacheTab = () => {
    console.log("Nouvelle func")
    setShowPistacheTab(!showPistacheTab);
  };

  function removeItem(targetItem: any): void {
    const newPistacheTab = pistacheTab.filter((item:any) => item.value !== targetItem.value);
    setPistacheTab(newPistacheTab);

    if (newPistacheTab.length === 0) {
        setShowPistacheTab(false);
    }
    const newLocalTab = localTab.map(item => {
      console.log("dans 2eme aprtie de remove")
        if (item.value === targetItem.value) {
          console.log("dans 2eme aprtie de remove")

            const updatedItem = { ...item, pistacheType: undefined, pistacheColor: undefined };
            return updatedItem;
        }
        return item;
    });
    setLocalTab(newLocalTab);
}



const handleClickOutside = () => {
  console.log('Modal should close now');
  if (hoveredIndex == null)
    setIsTextShown(false);
};

useOutsideClick(modalRef, handleClickOutside);
  

  const itemHeight = 70;
  const maxHeight = itemHeight * 4;
  const dynamicHeight = itemHeight * pistacheTab.length;
  const scrollNeeded = dynamicHeight > maxHeight;

  const findFullString = (index:number) => {
    console.log("Index clicked:", index);
    const searchText = String(selected.bounding[index]);
    console.log("Search Text:", searchText);
  
    if (!searchText.includes("... —> ...")) {
      console.error("Search text does not contain expected separator.");
      return;
    }
  
    const parts = searchText.split("... —> ...");
    const startText = parts[0];
    const endText = parts[1];
    console.log("Start text:", startText, "End text:", endText);
  
    const apiText = apiResponse.find(item => 
      item.content.includes(startText) && item.content.includes(endText)
    );
  
    if (apiText) {
      console.log("Full text found:", apiText.content);
      const textIndex = apiResponse.findIndex(item => item === apiText);
      const textElement = textRefs.current[textIndex];
  
      if (textElement) {
        textElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        textElement.style.backgroundColor = 'lightblue'; // Change background color to light blue
      }
    } else {
      console.log("No matching text found.");
    }
  };
  

  return (
    <>
      <div
        className="bg-[#F2F2F2] fixed ml-10 mt-2 rounded-xl "
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)} //
      >
        {!isHovering && !searchValue && <SearchOutlinedIcon className="mt-1" />}
        {isHovering || searchValue ? (
          <div className="flex justify-center items-center">
            <SearchOutlinedIcon className="cursor-pointer" />
            <input
              type="text"
              placeholder="rechercher"
              // placeholder={searchValue ? searchValue : "rechercher"}
              className="bg-[#F2F2F2] p-1 w-[150px] rounded-xl"
              onChange={handleInputChange}
              value={searchValue}
              style={{ userSelect: "none", outline: "none" }}
            />
          </div>
        ) : null}
      </div>
      {!searchValue && (
        <>
          <div className=" ml-10 mt-14 fixed w-[150px] h-[2px] bg-[#ddd]">
            <div
              ref={zoomHandleRef}
              onMouseDown={onZoomHandleMouseDown}
              className="absolute w-2 h-2 bg-[#DCDCDC] cursor-pointer border-lg rounded-xl"
              style={{ top: "-3px", left: "50px" }}
            />
            <div
              className="ml-[160px] mt-[-8px] fixed font-[#ddd] text-xs text-[#a3a3a3]"
              style={{ userSelect: "none" }}
            >
              {formatZoom(zoomFraction)} %
            </div>
          </div>
        </>
      )}
      {searchValue && (
        <div className="w-[182px] h-[300px] ml-9 mt-11 bg-slate-800 rounded-2xl fixed overflow-auto">
          <div>
            {localTab
              .filter((obj) => obj.value.toLowerCase().startsWith(searchValue.toLowerCase()))
              .map((obj, index) => (
                <div
                  key={index}
                  className="ml-3 mb-1 inline-block rounded-md bg-white"
                >
                  <div
                    className=" rounded-md text-xs p-1 cursor-pointer"
                    style={{
                      backgroundColor: obj.color,
                      opacity: `${getOpacity(obj)}`,
                    }}
                    onClick={() => zoomToValue(obj)}
                  >
                    {obj.value}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className=" flex justify-center">
        <canvas
          ref={canvasRef}
          width={widthScreen}
          height={heightScreen}
          // style={{ border: "1px solid black" }}
        />
      </div>
    
      {isTextShown && (
      <div
        id="modal-backdrop"
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center px-4" // Reduced outer padding
        
      >
        <div className="flex w-full max-w-[1100px] gap-5 mr-[150px]"> {/* Constrain width and center horizontally */}
          {/* Sidebar for the boxes with its own scroll */}
          <div className="flex flex-col overflow-auto px-5 py-3" style={{ flex:2 ,width: '300px', maxHeight: '100vh' }}> {/* Adjusted sidebar dimensions and spacing */}
            {console.log("this is selected = ", selected)}
            {console.log("this is selected.bounding = ", selected.bounding)}
            {selected.bounding.map((offset: any, index: number) => (
              <div key={index} className="flex justify-between items-center my-[80px] gap-3"> {/* Evenly space and align items */}
                <div className="bg-gray-200 rounded-lg text-black text-sm p-3 flex-grow cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)} 
                  onMouseLeave={() => setHoveredIndex(null)} 
                  onClick={() => findFullString(index)}
                > 
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis text-center" style={{ maxWidth: '220px' }}>
                    {MapObject[0]?.title}
                  </div>
                  <h1 className="text-center">P.{offset}</h1>
                </div>
                <div className="bg-gray-200 rounded-lg text-black text-sm px-3 py-1 min-w-[40px] text-center"
                onMouseEnter={() => setHoveredIndex(index)} 
                onMouseLeave={() => setHoveredIndex(null)} 
                > {/* Consistent sizing for letters */}
                  {String.fromCharCode(65 + index)}
                </div>
              </div>
            ))}
          </div>
          <div 
  ref={modalRef} 
  className="bg-white rounded-lg shadow-lg overflow-auto p-5 custom-scrollbar" 
  style={{ flex: 5, maxHeight: '100vh' }}>
            {apiResponse.map((item, index) => {
              const hasRole = item.role && item.role !== "pageNumber";
              const textStyle = hasRole ? 'text-lg font-bold' : 'text-base font-normal';
              const containsSelected = item.content.toLowerCase().includes(selected.value.toLowerCase());
              const colorStyle = containsSelected ? 'text-blue-500 opacity-50' : '';

              return (
                <div key={index} ref={el => textRefs.current[index] = el}>
                  {item.content.length >= 100 || hasRole ? (
                    <p ref={containsSelected && !selectedRef.current ? selectedRef : null} className={`${textStyle} ${colorStyle} pt-7`}>
                      {item.content}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}




    {
      pistacheTab.length > 0 && (
        <Image src={MarquePage} alt="no image" className="fixed top-20 w-20 h-20 cursor-pointer" style={{ userSelect: "none", right: showPistacheTab ? "280px" : "-15px" }} onClick={togglePistacheTab}/>
      )
    } 
      {
  showPistacheTab && (
    <div 
      className="ml-10 mt-14 fixed top-10 right-0 w-[300px] bg-slate-800 rounded-xl p-4"
      style={{height: `${scrollNeeded ? maxHeight : dynamicHeight}px`, overflowY: scrollNeeded ? 'auto' : 'hidden' }}
    >
    {
  pistacheTab.map((item:any, index:number) => (
    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', }}>
      {item.pistacheType === "tache" ? (
        <>
          {item.pistacheNum === 1 && <Image src={task0} alt="Logo" style={{ height: '30px', width: '30px', marginRight: '10px' }} onClick={() => removeItem(item)} />}
          {item.pistacheNum === 2 && <Image src={task1} alt="Logo" style={{ height: '30px', width: '30px', marginRight: '10px' }} onClick={() => removeItem(item)} />}
          {item.pistacheNum === 3 && <Image src={task2} alt="Logo" style={{ height: '30px', width: '30px', marginRight: '10px' }} onClick={() => removeItem(item)} />}
          {item.pistacheNum === 4 && <Image src={task3} alt="Logo" style={{ height: '30px', width: '30px', marginRight: '10px' }} onClick={() => removeItem(item)} />}
          {item.pistacheNum === 5 && <Image src={task4} alt="Logo" style={{ height: '30px', width: '30px', marginRight: '10px' }} onClick={() => removeItem(item)} />}
          {item.pistacheNum === 6 && <Image src={task5} alt="Logo" style={{ height: '30px', width: '30px', marginRight: '10px' }} onClick={() => removeItem(item)} />}
          {item.pistacheNum === 7 && <Image src={task6} alt="Logo" style={{ height: '30px', width: '30px', marginRight: '10px' }} onClick={() => removeItem(item)} />}
        </>
      ) : (
        <button
          style={{ position: 'relative', height: '30px', width: '30px', backgroundColor: item.pistacheColor, borderRadius: '50%', cursor: 'pointer', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}
          onClick={() => removeItem(item)}
          onMouseEnter={() => {  
            console.log("Mouse enter at index:", index);
            setHoveredIndex(index);
          }} 
          onMouseLeave={() => {
            console.log("Mouse sortie at index:", index);
            setHoveredIndex(null);
          }}  
        >
          <div style={{width: '20px',height: '20px',display: hoveredIndex === index ? 'flex' : 'none',alignItems: 'center',justifyContent: 'center',}}>
            <RxCross1 style={{ color: 'white' }} />
          </div>
        </button>
      )}
  
      <div
        style={{color: 'white',backgroundColor: item.color,padding: '10px',borderRadius: '20px',fontWeight: "500",whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',flexGrow: 1,}}
        onClick={() => zoomToValue(item)}
      >
        {item.value}
      </div>
    </div>
  ))  
}


    </div>
  )
}


      <h1>This is pistacheTab length = {pistacheTab.length}</h1>
      <h1>This is number of scrollPercentage = {scrollPercentage}</h1>
      <h1>This is number of pages = {pageCount}</h1>
      <div>
        {localTab.map((item, id) => {
          return <div key={id}>{JSON.stringify(item)}</div>;
        })}
        This is count = {count};
      </div>

{/* 
    {apiResponse.map((item, index) => (
      <div key={index} className="p-0">
        {item.role && <p className="font-semibold p-6">Role: {item.role}</p>}
        {(item.content.length >= 100 || (item.role && item.role !=="pageNumber"))&& (
          <p className={`${item.role ? 'text-lg font-bold pt-7' : 'text-base font-normal pt-2'}`}>
          {item.content}
          </p>
        )}
      </div>
    ))} */}

    </>
  );
};

export default CanvasDrawing;
