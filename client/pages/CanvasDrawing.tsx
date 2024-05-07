"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import nestedObjectData from "../src/app/utils/NestedObjectData";
import apiResponse from "../src/app/utils/ApiJsonResponse";
import MapObject from "../src/app/utils/MapObject";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DrawTab from "./MapLogic/DrawTab";
import CheckPistachePostion from "./CheckPistachePostion";
import MarquePage from "../public/MarquePage.png"
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";


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
          offset: obj[key].offset
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

  type Quartet = [string, string, string, string];

  const [isZooming, setIsZooming] = useState(false);
  const [zoomFraction, setZoomFraction] = useState<number>(0.35);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringObject, setIsHoveringObject] = useState(false);
  const [pistacheTab, setPistacheTab] = useState<any>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showPistacheTab, setShowPistacheTab] = useState(false);
  const [isTextShown, SetIsTextShown] = useState(false);
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

    const handleClickOutside = (e: MouseEvent) => {
      // // Vérifie si le clic a été en dehors du contenu du texte
      // if (e.target?.id === "modal-backdrop") {
      SetIsTextShown(false);
      // }
    };

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
          setSelected(obj);
          // console.log("this is setSelected ", selected);
          if (obj.offset) // = fin de branche donc possible affichage du texte
            SetIsTextShown(!isTextShown);
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
          {
            obj.isPistache = !obj.isPistache;
            // setIsPistacheOpen(!isPistacheOpen)
          }
          else if (isPistacheOpen && obj.isPistache)
          {
            obj.isPistache = !obj.isPistache;
            // setIsPistacheOpen(!isPistacheOpen)
          }
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
    document.addEventListener("mousedown", handleClickOutside);
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
      document.removeEventListener("mousedown", handleClickOutside);
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
    // console.log("showPistacheTab func avabt", showPistacheTab)
    
    setShowPistacheTab(!showPistacheTab);
    // console.log("showPistacheTab func apres", showPistacheTab)

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

  
  
  
  

  const itemHeight = 70;
  const maxHeight = itemHeight * 4;
  const dynamicHeight = itemHeight * pistacheTab.length;
  const scrollNeeded = dynamicHeight > maxHeight;


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
    className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center p-4"
    ref={scrollContainerRef}
  >
    <div className="flex max-w-[1000px] mx-auto" style={{ width: '100%' }}> {/* Adjusting the flex container */}
      {/* Sidebar for the boxes with its own scroll */}
      <div className="flex flex-col justify-start overflow-auto mr-4" style={{ maxHeight: '80vh', minWidth: '250px', maxWidth: '300px' }}> {/* Adjusted sidebar dimensions */}
        {selected.offset && selected.offset.map((offset: any, index: number) => (
          <div key={index} className="bg-gray-200 px-5 py-5 mr-4 my-16 rounded-lg text-black text-sm leading-snug"> {/* Reduced padding, adjusted line height for better text fit */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <span>{MapObject[0]?.title}</span>
              <h1 className="mt-2">P.{offset}</h1> {/* Margin-top for spacing between title and page number */}
            </div>
          </div>
        ))}
      </div>
      {/* Main text content with its own scroll */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex-grow overflow-auto" style={{ maxHeight: '100vh' }}>
        {apiResponse.map((item, index) => {
          const hasRole = item.role && item.role !== "pageNumber";
          const textStyle = hasRole ? 'text-lg font-bold' : 'text-base font-normal';
          const containsSelected = item.content.toLowerCase().includes(selected.value.toLowerCase());
          const colorStyle = containsSelected ? 'text-blue-500 opacity-50' : '';
          
          return (
            <div key={index} className="p-0">
              {(item.content.length >= 100 || hasRole) && (
                <p
                  ref={containsSelected && !selectedRef.current ? selectedRef : null}
                  className={`${textStyle} ${colorStyle} pt-7`}
                >
                  {item.content}
                </p>
              )}
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
      style={{
        height: `${scrollNeeded ? maxHeight : dynamicHeight}px`, // Utilisation de maxHeight si le défilement est nécessaire
        overflowY: scrollNeeded ? 'auto' : 'hidden', // Activation du défilement si nécessaire
      }}
    >
    {
  pistacheTab.map((item:any, index:number) => (
    <div
      key={index}
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
      }}
    >
      <button
      style={{
        position: 'relative',
        height: '30px',
        width: '30px',
        backgroundColor: item.pistacheColor,
        borderRadius: '50%',
        cursor: 'pointer',
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      onClick={() => removeItem(item)}
      onMouseEnter={() => {  
        console.log("Mouse enter at index:", index);
      setHoveredIndex(index);
    }} 
      onMouseLeave={() => {
        console.log("Mouse sortie at index:", index);
        setHoveredIndex(null)
      }}  
    >
      <div style={{
        width: '20px',
        height: '20px',
        display: hoveredIndex === index ? 'flex' : 'none', // Show icon only when hovered
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <RxCross1 style={{ color: 'white' }} />
      </div>
    </button>
      
      <div
        style={{
          color: 'white',
          backgroundColor: item.color,
          padding: '10px',
          borderRadius: '20px',
          fontWeight:"500",
          // textAlign: 'right',
          whiteSpace: 'nowrap',          // Empêche le texte de passer à la ligne suivante
          overflow: 'hidden',            // Masque les débordements de texte qui ne rentrent pas dans une ligne
          textOverflow: 'ellipsis',      // Ajoute des points de suspension si le texte déborde
          flexGrow: 1,                   // Permet à la case de prendre tout l'espace horizontal disponible
        }}
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
