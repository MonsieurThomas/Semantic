"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import apiResponse from "../src/app/utils/ApiJsonResponse";
import MapObject from "../src/app/utils/MapObject";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DrawTab from "./MapLogic/DrawTab";
import CheckPistachePostion from "./CheckPistachePostion";
import MarquePage from "../public/MarquePage.png";
import useOutsideClick from "../src/hooks/useOutsideClick";
import task0 from "../public/task0.png";
import task1 from "../public/task1.png";
import task2 from "../public/task2.png";
import task3 from "../public/task3.png";
import task4 from "../public/task4.png";
import task5 from "../public/task5.png";
import task6 from "../public/task6.png";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { FaFontAwesomeFlag } from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";

interface NestedObject {
  [key: string]: any;
}

const CanvasDrawing = () => {
  const router = useRouter();
  const { id } = router.query;
  const [nestedObjectData, setNestedObjectData] = useState<NestedObject | null>(
    null
  );

  useEffect(() => {
    if (id) {
      const fetchDocument = async () => {
        try {
          console.log("try de canvasDrawing = ");
          const response = await axios.get(`/api/getDocumentById?id=${id}`);
          const document = response.data;
          console.log("this is document = ", document);
          if (document.openaiResponse) {
            const cleanResponse = document.openaiResponse
              .replace(/```json|```/g, "")
              .trim();
            console.log("this is cleanResponse = ", cleanResponse);
            const parsedResponse = JSON.parse(cleanResponse);
            setNestedObjectData(parsedResponse);
            console.log("On a un document.openaiResponse");
            console.log(JSON.stringify(parsedResponse));
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      };
      fetchDocument();
    }
  }, [id]);

  //
  let count = 0;
  let branchNb = 0;
  let localeTab: Array<any> = [];

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
        !("value" in obj[key]) // Check if it's not a terminal node
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
      } else if ("value" in obj[key]) {
        // Handle terminal nodes with value and offset
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
          bounding: obj[key].bounding,
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

    return localeTab;
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////  countNestedObjectLevels   ////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const setupCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get the rendering context");
    }
    let ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);
    return ctx;
  };

  function setCamera(obj: any) {
    const centerX = obj.x + 3500 / 2;
    const centerY = obj.y * 1600 + 1000 / 2;
    const centerViewportX = widthScreen / 2;
    const centerViewportY = heightScreen / 2;
    const newZoomLevel = 0.02;

    const panX = (centerX * newZoomLevel - centerViewportX) * -1;
    const panY = (centerY * newZoomLevel - centerViewportY) * -1;

    setPanOffset({ x: panX, y: panY });
    setZoomLevel(newZoomLevel);
    redrawCanvas();
  }

  function ChangeXandY(tab: Array<any>) {
    let midBranch = 0;
    let midCount = 0;

    tab.forEach((obj) => {
      // branche moyenne pour envoyer la moitié de la carte a gauche
      if (obj.count === Math.floor(count / 2)) midBranch = obj.branch + 1;
    });
    console.log("midBranch = ", midBranch);
    tab.forEach((obj) => {
      // hauteur max de la section droite de la carte
      if (obj.branch < midBranch) if (midCount < obj.y) midCount = obj.y;
    });
    console.log("midCount = ", midCount);
    console.log("count = ", count);

    tab.forEach((obj) => {
      // creating obj.end for drawing arc
      let localeNumObj = obj.path[obj.path.length - 1];
      let max = 0;
      let diff = 0;
      obj.begin = false;
      tab.forEach((obj2) => {
        let localeNumObj2 = obj2.path[obj2.path.length - 1];
        // if ( obj.path[obj.path.length - 1] == "1") obj.begin = true;
        if (obj.path.slice(0, -1) === obj2.path.slice(0, -1)) {
          diff++;
          if (localeNumObj2 > max) max = localeNumObj2;
          if (
            obj.path[obj.path.length - 1] == "1" &&
            obj2.path[obj2.path.length - 1] === "2"
          ) {
            obj.begin = true;
          }
        }
      });
      localeNumObj === max && diff > 1 ? (obj.end = true) : (obj.end = false);
    });

    tab.forEach((obj) => {
      // // changement de position pour la gauche

      if (obj.branch >= midBranch) {
        // console.log("This is obj.y avant la magouille midbranch", obj.y);
        // console.log("This is midCount", midCount);
        obj.y = obj.y - midCount;
        // obj.y = (obj.y - (midCount - (count - midCount))) / 2;
        // console.log("\n\nThis is obj.y dans la magouille midbranch", obj.y);
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
      obj.y = obj.y * 1300;
      obj.x = obj.x * 6000;
      obj.hover = false;
      obj.hide = false;
      obj.occurence = 2;
    });

    console.log("tab apres modif = ", tab);
  }

  function Color(tab: Array<any>) {
    const color = [
      "#000229",
      "#B22920",
      "#1BA024",
      "#E2C524",
      "#F56600",
      "#47B8D4",
    ];
    tab.forEach((obj) => {
      if (obj.branch === 0) {
        obj.color = color[0];
      } else {
        obj.color = color[((obj.branch - 1) % (color.length - 1)) + 1];
      }
    });
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 10000,
    height: 10000,
  });
  // const { innerWidth, innerHeight } = window;
  // setDimensions({ width: innerWidth, height: innerHeight });

  const [localTab, setLocalTab] = useState<Array<any>>([]);

  useEffect(() => {
    const nestedDummy = JSON.parse(JSON.stringify(nestedObjectData));
    console.log("this is nestedDummy before = ", nestedDummy);
    const tab = AddCoordinates(nestedDummy);
    console.log("This is result from addCoordinate = ", tab);
    ChangeXandY(tab);
    Color(tab);
    setLocalTab(tab);
  }, [nestedObjectData]);

  useEffect(() => {
    console.log("This is localTab = ", localTab);
  }, [localTab]);

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
  const modalRef = useRef<HTMLDivElement>(null);

  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomFraction, setZoomFraction] = useState<number>(0.0); //
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
  const [showBackground, setShowBackground] = useState(false);
  const [programmaticScroll, setProgrammaticScroll] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [lastClickedIndex, setLastClickedIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoom = 0.1;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const minZoom = 0.02;
  const [selectedParagraphIndex, setSelectedParagraphIndex] =
    useState<number>(0);
  const [disableClicks, setDisableClicks] = useState(false);
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
    if (!canvas) return; // Make sure the canvas is not null
    const ctx = setupCanvas(canvas); // Call setupCanvas directly with the ref
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
          adjustedX <= obj.x + 3500 &&
          adjustedY >= obj.y - 300 &&
          adjustedY <= obj.y + 1000
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
    const handleResize = () => {
      const innerWidth = window.innerWidth;
      const innerHeight = window.innerHeight;

      // console.log("Window resized");
      setDimensions({ width: innerWidth, height: innerHeight });

      if (canvasRef.current) {
        canvasRef.current.width = innerWidth;
        canvasRef.current.height = innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it initially

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          const zoomFraction =
            newPositionX / (rect.width - zoomHandle.offsetWidth);
          setZoomFraction(zoomFraction);

          if (canvas) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            // console.log("canvas.width = ", canvas.width)
            // console.log("canvas.height = ", canvas.height)
            const minZoom = 0.02;
            const maxZoom = 0.1;
            const newZoomLevel = minZoom + (maxZoom - minZoom) * zoomFraction;
            // console.log("panOffset.x = ", panOffset.x)
            // console.log("panOffset.y = ", panOffset.y)

            const newPanOffsetX =
              panOffset.x + (centerX - (centerX * newZoomLevel) / zoomLevel);
            const newPanOffsetY =
              panOffset.y + (centerY - (centerY * newZoomLevel) / zoomLevel);

            setZoomLevel(newZoomLevel);
            setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });

            // console.log("Ca zoom");
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
      if (isTextShown) return;
      e.preventDefault();

      const zoomIntensity = 0.003;
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
        setZoomLevel(newZoomLevel);
        setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });
        redrawCanvas();
      }
    };

    const onMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
      }
      if (isZooming) {
        setIsZooming(false);
      }
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
          adjustedX <= obj.x + 3500 &&
          adjustedY >= obj.y &&
          adjustedY <= obj.y + 1000
        ) {
          if (obj.bounding && !isTextShown && !disableClicks) {
            setSelected(obj);
            setIsTextShown(true);
          }
        }
        if (
          adjustedX >= obj.x + 150 &&
          adjustedX <= obj.x + 700 &&
          adjustedY >= obj.y - 400 &&
          adjustedY <= obj.y
        ) {
          obj.hideRoot = !obj.hideRoot;
          hideCases(localTab, obj);
        } else if (
          adjustedX >= obj.x + 2900 &&
          adjustedX <= obj.x + 3500 &&
          adjustedY >= obj.y - 400 &&
          adjustedY <= obj.y
        ) {
          if (isPistacheOpen == false) obj.isPistache = !obj.isPistache;
          else if (isPistacheOpen && obj.isPistache)
            obj.isPistache = !obj.isPistache;
          redrawCanvas();
        }
        if (
          obj.isPistache &&
          adjustedX >= obj.x + 4000 &&
          adjustedX <= obj.x + 7500 &&
          adjustedY >= obj.y - 1200 &&
          adjustedY <= obj.y + 2600
        )
          setPistacheTab(
            CheckPistachePostion(obj, adjustedX, adjustedY, pistacheTab)
          );
        redrawCanvas();
      });
    };
    const handleScroll = () => {
      if (!programmaticScroll) setShowBackground(false);
    };

    const handleScrollOverflow = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const totalScrollHeight = scrollHeight - clientHeight;
      const scrolledPercentage = (scrollTop / totalScrollHeight) * 100;
      setScrollPercentage(scrolledPercentage);
    };
    const modal = modalRef.current;

    // window.addEventListener('resize', handleResize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("click", handleCanvasClick);
    // document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("wheel", handleWheel, { passive: false });
    if (scrollContainer)
      scrollContainer.addEventListener("scroll", handleScrollOverflow);
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
    });
    if (modal) modal.addEventListener("scroll", handleScroll);
    if (zoomHandle) zoomHandle.addEventListener("mousedown", onMouseDown);
    canvas?.addEventListener("mousedown", onMouseDown);
    // handleResize();
    return () => {
      // window.removeEventListener('resize', handleResize);
      if (modal) modal.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("click", handleCanvasClick);
      // document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("wheel", handleWheel);
      if (scrollContainer)
        scrollContainer.removeEventListener("scroll", handleScrollOverflow);
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
    const calculatedOpacity = 1 - (obj.path.length - 0.5) / 10;
    const opacity = Math.max(calculatedOpacity, 0.1);
    return Math.max(opacity);
  }

  const zoomToValue = useCallback(
    (obj: any) => {
      setDisableClicks(true);
      const centerX = obj.x + 3500 / 2;
      const centerY = obj.y + 1000 / 2;

      const centerViewportX = widthScreen / 2;
      const centerViewportY = heightScreen / 2;
      const newZoomLevel = 0.05;

      const panX = (centerX * newZoomLevel - centerViewportX) * -1;
      const panY = (centerY * newZoomLevel - centerViewportY) * -1;

      setPanOffset({ x: panX, y: panY });
      setZoomLevel(newZoomLevel);
      // console.log("setDisableClicks = ", disableClicks)
      setTimeout(() => setDisableClicks(false), 300);
      // console.log("setDisableClicks apres = ", disableClicks)
      redrawCanvas();
    },
    [
      widthScreen,
      heightScreen,
      setPanOffset,
      setZoomLevel,
      redrawCanvas,
      disableClicks,
    ]
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
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selected]);

  const togglePistacheTab = () => {
    setShowPistacheTab(!showPistacheTab);
  };

  function removeItem(targetItem: any): void {
    const newPistacheTab = pistacheTab.filter(
      (item: any) => item.value !== targetItem.value
    );
    setPistacheTab(newPistacheTab);

    if (newPistacheTab.length === 0) {
      setShowPistacheTab(false);
    }
    const newLocalTab = localTab.map((item) => {
      if (item.value === targetItem.value) {
        const updatedItem = {
          ...item,
          pistacheType: undefined,
          pistacheColor: undefined,
        };
        return updatedItem;
      }
      return item;
    });
    setLocalTab(newLocalTab);
  }

  const handleClickOutside = () => {
    if (hoveredIndex == null) setIsTextShown(false);
  };

  useOutsideClick(modalRef, handleClickOutside);

  const itemHeight = 52;
  const maxHeight = itemHeight * 4;
  const dynamicHeight = itemHeight * pistacheTab.length + 12;
  const scrollNeeded = dynamicHeight > maxHeight;

  useEffect(() => {
    if (selected)
      findFullString(
        0,
        selected,
        textRefs,
        setSelectedParagraphIndex,
        setShowBackground,
        setProgrammaticScroll
      );
  }, [isTextShown, selected]);

  const findFullString = (
    index: number,
    selected: any,
    textRefs: any,
    setSelectedParagraphIndex: any,
    setShowBackground: any,
    setProgrammaticScroll: any
  ) => {
    // Regular expression to match all variations of the separator
    const separatorRegex = /\.{3}\s*[-–—]>\s*\.{3}/;
    let searchText = String(selected.bounding[index]);

    if (searchText.endsWith("...")) {
      searchText = searchText.slice(0, -3);
    }

    if (!separatorRegex.test(searchText)) {
      console.log("No separator found in searchText:", searchText);
      return;
    }

    const parts = searchText.split(separatorRegex);
    const startText = parts[0];
    const endText = parts[1];
    console.log("startText", startText);
    console.log("endText", endText);

    console.log("apiResponse = ", apiResponse);
    const apiText = apiResponse.find(
      (item) => item.content.includes(startText)
      // item.content.includes(startText) && item.content.includes(endText)
    );

    if (apiText) {
      const textIndex = apiResponse.findIndex((item: any) => item === apiText);
      setSelectedParagraphIndex(textIndex);
      setShowBackground(true);
      setProgrammaticScroll(true);
      const textElement = textRefs.current[textIndex];

      if (textElement) {
        let blockPosition: ScrollLogicalPosition = "center";
        if (index === 0) {
          blockPosition = "start";
        } else if (index === 1) {
          blockPosition = "center";
        } else if (index === 2) {
          blockPosition = "end";
        }

        textElement.scrollIntoView({
          behavior: "smooth",
          block: blockPosition,
        });
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
              placeholder="Rechercher"
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
              style={{ top: "-3px" }}
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
        <div className="w-[250px] h-[300px] ml-9 mt-11 bg-slate-800 rounded-2xl fixed overflow-auto">
          <div className="p-2">
            {localTab
              .filter((obj) =>
                obj.value.toLowerCase().startsWith(searchValue.toLowerCase())
              )
              .map((obj, index) => (
                <div
                  key={index}
                  className="mx-1 mb-1 inline-block rounded-md bg-white"
                >
                  <div
                    className="relative rounded-md cursor-pointer"
                    onClick={() => zoomToValue(obj)}
                    style={{
                      position: "relative",
                      padding: "0px 12px",
                      boxSizing: "border-box",
                      borderRadius: "inherit",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: obj.color,
                        opacity: getOpacity(obj),
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: "inherit",
                        zIndex: 1,
                        fontFamily: "Lexend",
                        boxSizing: "border-box",
                      }}
                    />
                    <span
                      style={{
                        position: "relative",
                        zIndex: 2,
                        opacity: 1,
                        fontFamily: "Lexend",
                        fontSize: "16px",
                        fontWeight: obj.path.length >= 3 ? 500 : 600,
                        color: obj.path.length > 3 ? "black" : "#F0FFFF",
                      }}
                    >
                      {obj.value}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className=" flex justify-center">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {isTextShown && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 bg-[rgba(0,0,20,0.90)] flex justify-center px-4"
        >
          <div className="flex w-full max-w-[1000px] mr-[300px]">
            <div
              className="flex flex-col overflow-auto px-5 py-3"
              style={{ flex: 2, width: "300px", maxHeight: "100vh" }}
            >
              {selected.bounding.map((offset: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center my-[80px] gap-3"
                >
                  <div
                    className="bg-gray-200 rounded-lg text-black text-sm p-2 px-[30px] cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() =>
                      findFullString(
                        index,
                        selected,
                        textRefs,
                        setSelectedParagraphIndex,
                        setShowBackground,
                        setProgrammaticScroll
                      )
                    }
                  >
                    <div
                      className="whitespace-nowrap overflow-hidden text-ellipsis text-center"
                      style={{ maxWidth: "320px", fontFamily: "Lexend" }}
                    >
                      {selected.value}
                    </div>
                    <h1 className="text-center">P.{"XX"}</h1>
                  </div>
                  <div
                    className="bg-gray-200 rounded-lg text-black text-sm py-1 min-w-[40px] text-center"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                </div>
              ))}
            </div>
            <div
              ref={modalRef}
              className="bg-white rounded-lg shadow-lg overflow-auto custom-scrollbar"
              style={{ flex: 5, maxHeight: "100vh" }}
            >
              <div
                style={{
                  backgroundColor: showBackground
                    ? "rgba(0, 0, 40, 0.45)"
                    : "transparent",
                  fontFamily: "Lexend",
                  textAlign: "justify",
                }}
              >
                {apiResponse.map((item, index) => {
                  const hasRole = item.role && item.role !== "pageNumber";
                  const textStyle = hasRole
                    ? "text-lg font-bold"
                    : "text-base font-normal";
                  const isParagraphSelected = index === selectedParagraphIndex;
                  const backgroundColor = isParagraphSelected ? "white" : "";

                  return (
                    <div
                      key={index}
                      ref={(el) => {
                        textRefs.current[index] = el;
                      }}
                    >
                      {item.content.length >= 100 || hasRole ? (
                        <p
                          className={`${textStyle} p-5`}
                          style={{ backgroundColor }}
                        >
                          {item.content}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {pistacheTab.length > 0 && (
        <Image
          src={MarquePage}
          alt="no image"
          className="fixed top-[84px] w-20 h-16 cursor-pointer"
          style={{
            userSelect: "none",
            right: showPistacheTab ? "275px" : "-15px",
          }}
          onClick={togglePistacheTab}
        />
      )}
      {showPistacheTab && (
        <div
          className="ml-10 mt-14 fixed top-10 right-0 w-[300px] bg-slate-800 rounded-xl py-4"
          style={{
            height: `${scrollNeeded ? maxHeight : dynamicHeight}px`,
            overflowY: scrollNeeded ? "auto" : "hidden",
            borderTopLeftRadius: "1rem",
            borderBottomLeftRadius: "1rem",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
          }}
        >
          {pistacheTab.map((item: any, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                fontFamily: "Lexend",
                fontSize: "17px",
              }}
            >
              {item.pistacheType === "tache" ? (
                <div>
                  {/* Images pour les taches */}
                  {item.pistacheNum === 1 && (
                    <Image
                      src={task0}
                      alt="Logo"
                      style={{
                        height: "30px",
                        width: "30px",
                        margin: "0 20px 0 10px",
                      }}
                      onClick={() => removeItem(item)}
                    />
                  )}
                  {item.pistacheNum === 3 && (
                    <Image
                      src={task2}
                      alt="Logo"
                      style={{
                        height: "30px",
                        width: "30px",
                        margin: "0 20px 0 10px",
                      }}
                      onClick={() => removeItem(item)}
                    />
                  )}
                  {item.pistacheNum === 4 && (
                    <Image
                      src={task3}
                      alt="Logo"
                      style={{
                        height: "30px",
                        width: "30px",
                        margin: "0 20px 0 10px",
                      }}
                      onClick={() => removeItem(item)}
                    />
                  )}
                  {item.pistacheNum === 5 && (
                    <Image
                      src={task4}
                      alt="Logo"
                      style={{
                        height: "30px",
                        width: "30px",
                        margin: "0 20px 0 10px",
                      }}
                      onClick={() => removeItem(item)}
                    />
                  )}
                  {item.pistacheNum === 6 && (
                    <Image
                      src={task5}
                      alt="Logo"
                      style={{
                        height: "30px",
                        width: "30px",
                        margin: "0 20px 0 10px",
                      }}
                      onClick={() => removeItem(item)}
                    />
                  )}
                  {item.pistacheNum === 7 && (
                    <Image
                      src={task6}
                      alt="Logo"
                      style={{
                        height: "30px",
                        width: "30px",
                        margin: "0 20px 0 10px",
                      }}
                      onClick={() => removeItem(item)}
                    />
                  )}
                </div>
              ) : item.pistacheType === "priorité" ? (
                // Bouton pour priorité avec le numéro à l'intérieur
                <button
                  style={{
                    position: "relative",
                    height: "30px",
                    width: "30px",
                    backgroundColor: item.pistacheColor,
                    borderRadius: "50%",
                    cursor: "pointer",
                    margin: " 0 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                  onClick={() => removeItem(item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: "bold",
                      fontFamily: "Lexend",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    {item.pistacheNum}
                  </span>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      display: hoveredIndex === index ? "flex" : "none",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                    }}
                  >
                    <RxCross1
                      style={{ color: "white", width: "35px", height: "35px" }}
                    />
                  </div>
                </button>
              ) : item.pistacheType === "flag" ? (
                // Bouton pour priorité avec le numéro à l'intérieur
                <button
                  style={{
                    position: "relative",
                    height: "30px",
                    width: "30px",
                    backgroundColor: item.pistacheColor,
                    borderRadius: "50%",
                    cursor: "pointer",
                    margin: " 0 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                  onClick={() => removeItem(item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "26px",
                      fontWeight: "bold",
                      fontFamily: "Lexend",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    <FaFontAwesomeFlag style={{ fontSize: "16px" }} />
                  </span>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      display: hoveredIndex === index ? "flex" : "none",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                    }}
                  >
                    <RxCross1
                      style={{ color: "white", width: "35px", height: "35px" }}
                    />
                  </div>
                </button>
              ) : (
                <button
                  style={{
                    position: "relative",
                    height: "30px",
                    width: "30px",
                    backgroundColor: item.pistacheColor,
                    borderRadius: "50%",
                    cursor: "pointer",
                    margin: "0 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                  onClick={() => removeItem(item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      display: hoveredIndex === index ? "flex" : "none",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RxCross1
                      style={{ color: "white", width: "35px", height: "35px" }}
                    />
                  </div>
                </button>
              )}

              <div
                style={{
                  color: "white",
                  backgroundColor: item.color,
                  padding: "6px 0 6px 10px",
                  borderTopLeftRadius: "12px",
                  borderBottomLeftRadius: "12px",
                  borderTopRightRadius: "0",
                  borderBottomRightRadius: "0",
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flexGrow: 1,
                  width: "100%",
                }}
                onClick={() => zoomToValue(item)}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* <h1>This is pistacheTab length = {pistacheTab.length}</h1>
      <h1>This is number of scrollPercentage = {scrollPercentage}</h1>
      <h1>This is number of pages = {pageCount}</h1>
      <div>
        {localTab.map((item, id) => {
          return <div key={id}>{JSON.stringify(item)}</div>;
        })}
        This is count = {count};
      </div> */}

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
