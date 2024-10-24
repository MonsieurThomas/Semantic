"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DrawTab from "./MapLogic/DrawTab";
import CheckPistachePostion from "./CheckPistachePostion";
import MarquePage from "../public/MarquePage.png";
import useOutsideClick from "../src/hooks/useOutsideClick";
import useInsideClick from "../src/hooks/useInsideClick";
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
import { useSearchParams } from "next/navigation";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { searchPlugin } from "@react-pdf-viewer/search";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";

interface NestedObject {
  [key: string]: any;
}

function textToParagraphs(text: string) {
  return text
    .split("\n\n") // Split the text by double new lines to get paragraphs
    .filter((paragraph) => paragraph.trim() !== "") // Filter out any empty paragraphs
    .map((paragraph) => ({ content: paragraph.trim(), word: "true" })); // Trim and map to an object
}

function paragraphsToText(jsonString: string) {
  try {
    // Parse the JSON string
    const dataArray = JSON.parse(jsonString);

    // Initialize an empty array to store the content
    const contentArray: any = [];

    // Iterate over each object in the array
    dataArray.forEach((item: any) => {
      if (item.content) {
        contentArray.push(item.content);
      }
    });

    // Join the array elements into a single string
    const resultString = contentArray.join(" ");

    return resultString;
  } catch (error) {
    console.error("Invalid JSON string:", error);
    return "";
  }
}

function paragraphsToTextSplit(text: string): string[] {
  return text.split(/\s+/); // Divise le texte par les espaces et renvoie un tableau de mots
}

const CanvasDrawing = () => {
  const router = useRouter();
  const { id } = router.query;
  const [nestedObjectData, setNestedObjectData] = useState<NestedObject | null>(
    null
  );
  const [apiResponse, setApiResponse] = useState<NestedObject | null>(null);
  const [fullText, setFullText] = useState<string | null>(null);
  const [fullTextSplit, setFullTextSplit] = useState<string[] | null>(null);

  let caseWidth = 4800;
  let caseHeigth = 1200;

  // console.log("\n\n\n\nThis is document in fetching avant= \n\n\n\n");

  useEffect(() => {
    if (id) {
      const fetchDocument = async () => {
        try {
          const response = await axios.get(`/api/getDocumentById?id=${id}`);
          const document = response.data;
          if (document.openaiResponse) {
            console.log(
              "\n\n\n\nThis is document.openaiResponse in fetching =",
              document.openaiResponse,
              "\n\n\n\n"
            );
            const cleanResponse = document.openaiResponse
              .replace(/```json|```/g, "")
              .trim();
            const parsedResponse = JSON.parse(cleanResponse);
            setNestedObjectData(parsedResponse);
            console.log("On a un document.openaiResponse");
            console.log(JSON.stringify(parsedResponse));
          }
          if (document.rawText) {
            try {
              setApiResponse(JSON.parse(document.rawText));
              setFullText(paragraphsToText(document.rawText));
              setFullTextSplit(
                paragraphsToTextSplit(paragraphsToText(document.rawText))
              );
            } catch (error) {
              setFullText(document.rawText);
              setFullTextSplit(paragraphsToTextSplit(document.rawText));
              setApiResponse(textToParagraphs(document.rawText));
            }
          }
          if (document.elements) setPistacheTab(document.elements);
          setFileData(document.fileData);
          console.log("document.fileData == ", document.fileData);
          console.log("document.rawText dans l'api", document.rawText);
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      };
      fetchDocument();
    }
  }, [id]);

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
        !("bounding" in obj[key]) // Check if it's not a terminal node
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
          obj[key].value,
          currentPath
        );
        newObj[key] = { ...processedObj };
        localCount += subCount;
        localSum += subSum;
      } else if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        "bounding" in obj[key]
      ) {
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
    console.log("nested obj before parsing = ", obj);

    const [newObj, , ,] = processNestedObject(obj, 0);
    // count = 0;
    branchNb = 0;

    localeTab.forEach((object) => {
      if (!object.path && !object.value) {
        object.value = Object.keys(obj)[0];
        object.branch = 0;
      }
    });
    console.log("localeTab = ", localeTab);

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
    const centerX = 6000 / 2;
    const centerY = obj.y * 1300;
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
      if (obj.branch < midBranch) {
        // obj.y = obj.y - midCount;
        obj.x = -obj.x;
      } else obj.y = obj.y - midCount;
    });

    tab.forEach((obj) => {
      // retire un point devant path parce qu'apres la 10eme branche il y en a un
      if (obj.path[0] == ".") {
        obj.path = obj.path.substring(1);
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
      obj.y = obj.y * 1500;
      obj.x = obj.x * 7000;
      obj.hover = false;
      obj.hide = false;
      obj.occurence = 2;
      // console.log("obj = ", obj);

      for (let i = 0; i < pistacheTab.length; i++) {
        if (pistacheTab[i].value === obj.value) {
          Object.assign(obj, pistacheTab[i]);
          obj.isPistache = false;
          console.log("this is new obj = ", obj);
          break; // Sort de la boucle dès qu'une correspondance est trouvée
        }
      }
    });
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
    // console.log("this is data json before = ", nestedDummy);
    const tab = AddCoordinates(nestedDummy);
    // console.log("This is result from addCoordinate = ", tab);
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
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const pistacheRef = useRef<HTMLDivElement>(null);

  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomFraction, setZoomFraction] = useState<number>(0.0); //
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringObject, setIsHoveringObject] = useState(false);
  const [pistacheTab, setPistacheTab] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [fileData, setFileData] = useState<Uint8Array>(new Uint8Array());
  const [showPistacheTab, setShowPistacheTab] = useState(false);
  const [isTextShown, setIsTextShown] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [selected, setSelected] = useState<any>();
  const [selectedCitation, setSelectedCitation] = useState(false);
  const [isPistacheOpen, setIsPistacheOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [isPistacheHovered, setIsPistacheHovered] = useState(false);
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
  const [selectedParagraphIndices, setSelectedParagraphIndices] = useState<
    number[]
  >([]);
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

  useEffect(() => {
    console.log("pistacheTab dans le useEffect = ", pistacheTab);

    if (pistacheTab?.length > 0) {
      const updateDocument = async () => {
        try {
          const response = await axios.post("/api/updateDocument", {
            id: id,
            pistacheTab: pistacheTab,
          });

          console.log("Document updated:", response.data);
        } catch (error) {
          console.error("Error updating document:", error);
        }
      };

      updateDocument();
    }
  }, [pistacheTab]);

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
          adjustedX <= obj.x + 4800 &&
          adjustedY >= obj.y - 600 &&
          adjustedY <= obj.y + 1200
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
            const minZoom = 0.02;
            const maxZoom = 0.1;
            const newZoomLevel = minZoom + (maxZoom - minZoom) * zoomFraction;

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        document.activeElement !== document.querySelector('input[type="text"]')
      ) {
        event.preventDefault();
        // Ajoutez ici toute logique spécifique que vous souhaitez lorsque la barre d'espace est pressée
        // console.log("Barre d'espace pressée !");
        for (const obj of localTab) {
          if (obj.branch === 0) {
            // setCamera(obj);
            break;
          }
        }
        const centerX = 6000 / 2;
        const centerY = 5 * 1300;
        const centerViewportX = widthScreen / 2;
        const centerViewportY = heightScreen / 2;
        const newZoomLevel = 0.02;

        const panX = (centerX * newZoomLevel - centerViewportX) * -1;
        const panY = (centerY * newZoomLevel - centerViewportY) * -1;

        setPanOffset({ x: panX, y: panY });
        setZoomLevel(newZoomLevel);
        setZoomFraction(0);
        if (zoomHandle) zoomHandle.style.left = `${0}px`;
        // console.log("setDisableClicks = ", disableClicks)

        // console.log("setDisableClicks apres = ", disableClicks)
        redrawCanvas();
      }
    };

    const handleInputClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !isTextShown
      ) {
        setSearchValue("");
        setIsHovering(false);
      }
      if (
        pistacheRef.current &&
        !pistacheRef.current.contains(event.target as Node)
      ) {
        setShowPistacheTab(false);
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
      document.body.style.transform = "scale(1)";

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left - panOffset.x;
      const y = e.clientY - rect.top - panOffset.y;
      let newPistacheHovered = false;

      localTab.forEach((obj) => {
        const adjustedX = x / zoomLevel;
        const adjustedY = y / zoomLevel;

        if (
          adjustedX >= obj.x + 150 &&
          adjustedX <= obj.x + 700 &&
          adjustedY >= obj.y - 400 &&
          adjustedY <= obj.y
        ) {
          obj.hideRoot = !obj.hideRoot;
          hideCases(localTab, obj);
        } else if (
          adjustedX >= obj.x + caseWidth - 500 &&
          adjustedX <= obj.x + caseWidth &&
          adjustedY >= obj.y - 600 &&
          adjustedY <= obj.y
        ) {
          obj.isPistache = !obj.isPistache;
          // console.log("ici pistache", obj.isPistache);
          redrawCanvas();
        } else if (
          obj.isPistache &&
          adjustedX >= obj.x + 4000 &&
          adjustedX <= obj.x + 8700 &&
          adjustedY >= obj.y - 1200 &&
          adjustedY <= obj.y + 2600
        ) {
          setPistacheTab(
            CheckPistachePostion(
              obj,
              adjustedX,
              adjustedY,
              pistacheTab,
              caseWidth,
              caseHeigth
            )
          );
          newPistacheHovered = true;
        }
        if (
          obj.isPistache &&
          (adjustedX < obj.x + 4000 ||
            adjustedX > obj.x + 8700 ||
            adjustedY < obj.y - 1200 ||
            adjustedY > obj.y + 2600) &&
          !(
            adjustedX >= obj.x + caseWidth - 500 &&
            adjustedX <= obj.x + caseWidth &&
            adjustedY >= obj.y - 400 &&
            adjustedY <= obj.y
          )
        ) {
          console.log("ici close pistache");
          obj.isPistache = false;
        }
        redrawCanvas();
      });

      // Maintenant vérifiez si vous devez afficher le texte ou non
      localTab.forEach((obj) => {
        const adjustedX = x / zoomLevel;
        const adjustedY = y / zoomLevel;

        if (
          adjustedX >= obj.x &&
          adjustedX <= obj.x + caseWidth &&
          adjustedY >= obj.y &&
          adjustedY <= obj.y + caseHeigth
        ) {
          if (obj.branch == 0) {
            setIsMenuShown(true);
          }
          if (
            obj.bounding &&
            !isTextShown &&
            !disableClicks &&
            !isPistacheHovered &&
            !newPistacheHovered
          ) {
            setSelected(obj);
            setIsTextShown(true);
          }
        }
      });
    };

    const handleScroll = () => {
      // console.log("programmaticScroll", programmaticScroll);
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

    function getZoomLevel() {
      return Math.round(window.devicePixelRatio * 100);
    }

    window.addEventListener("resize", () => {
      console.log("Zoom level: " + getZoomLevel() + "%");
    });
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("click", handleCanvasClick);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleInputClickOutside);
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
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("click", handleCanvasClick);
      document.removeEventListener("mousedown", handleInputClickOutside);
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
        if (Math.max(obj.path.length - objPath.path.length) != 2 && obj.hide)
          console.log("ok");
        else obj.hide = !obj.hide;
        console.log(
          "Math.max(obj.path - objPath.path) =",
          Math.max(obj.path.length - objPath.path.length)
        );
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
    else setShowBackground(false);
  };

  const handleClickInside = () => {
    setShowBackground(false);
  };

  useOutsideClick(modalRef, handleClickOutside);
  useInsideClick(modalRef, handleClickInside);

  const itemHeight = 52;
  const maxHeight = itemHeight * 4;
  const dynamicHeight = itemHeight * pistacheTab?.length + 12;
  const scrollNeeded = dynamicHeight > maxHeight;

  useEffect(() => {
    // console.log("isPistacheHovered = ", isPistacheHovered);
  }, [isPistacheHovered]);

  useEffect(() => {
    if (selected)
      findFullString(
        0,
        selected,
        textRefs,
        selectedParagraphIndices,
        setShowBackground,
        setProgrammaticScroll
      );
  }, [isTextShown, selected]);

  useEffect(() => {
    if (selectedCitation)
      findFullStringFromCitation(
        selectedCitation,
        textRefs,
        selectedParagraphIndices,
        setShowBackground,
        setProgrammaticScroll
      );
  }, [isTextShown, selectedCitation]);

  function removeDots(input: string): string {
    return input.replace(/·/g, "").trim();
  }

  const findFullString = (
    index: number,
    selected: any,
    textRefs: any,
    selectedParagraphIndices: any,
    setShowBackground: any,
    setProgrammaticScroll: any
  ) => {
    const separatorRegex = /\.{3}\s*[-–—]>\s*\.{3}|\s*[-–—]>\s*/;
    let searchText = String(selected.bounding[index]);
    if (searchText.endsWith("...")) {
      searchText = searchText.slice(0, -3);
    }

    if (!separatorRegex.test(searchText)) {
      console.log("No separator found in searchText:", searchText);
      return;
    }

    const parts = searchText.split(separatorRegex);
    const startText = removeDots(parts[0]);
    const endText = removeDots(parts[1]);

    let apiText: any[] = [];

    // Find paragraph containing both startText and endText
    let combinedText = apiResponse?.find(
      (item: any) =>
        removeDots(item.content).includes(startText) &&
        removeDots(item.content).includes(endText)
    );
    if (combinedText) {
      apiText.push(combinedText);
    } else {
      // Find paragraph containing startText
      let startTextParagraph = apiResponse?.find((item: any) =>
        removeDots(item.content).includes(startText)
      );
      if (!startTextParagraph) {
        // console.log("Dans le nouveau if");
        // console.log("Dans le nouveau if startText = ", startText);

        apiResponse?.forEach((item: any, idx: number) => {
          // console.log(`Index: ${idx}, Content: ${removeDots(item.content)}`);
        });

        startTextParagraph = apiResponse?.find((item: any) =>
          startText.includes(removeDots(item.content))
        );
        // console.log(
        //   "startTextParagraph apres le nouveau if = ",
        //   startTextParagraph
        // );
      }
      // Find paragraph containing endText
      let endTextParagraph = apiResponse?.find((item: any) =>
        removeDots(item.content).includes(endText)
      );

      if (startTextParagraph) {
        apiText.push(startTextParagraph);
      }

      if (endTextParagraph && endTextParagraph !== startTextParagraph) {
        apiText.push(endTextParagraph);
      }
    }

    if (apiText.length > 0) {
      const textIndices = apiText.map((text) =>
        apiResponse?.findIndex((item: any) => item === text)
      );

      setSelectedParagraphIndices(textIndices);
      setShowBackground(true);
      setProgrammaticScroll(true);
      // console.log("textIndices dans findString = ", textIndices);
      textIndices.forEach((textIndex, idx) => {
        // console.log("textIndices dans findString = ", textIndex);
        // console.log("textIndices dans findString = ", idx);
        const textElement = textRefs.current[textIndex];

        // console.log("text element dans fullstring = ", textElement);
        if (textElement) {
          let blockPosition: ScrollLogicalPosition = "center";
          if (index === 0) {
            blockPosition = "center";
          } else if (index === 1) {
            blockPosition = "center";
          } else if (index === 2) {
            blockPosition = "end";
          }

          textElement.scrollIntoView({
            behavior: "smooth",
            block: blockPosition,
          });

          if (idx === textIndices.length - 1) {
            setTimeout(() => {
              setProgrammaticScroll(false);
            }, 1000);
          }
        }
      });
    } else {
      console.log("No matching text found.");
    }
  };

  const prepareCitationOpening = (context: any) => {
    setSelectedCitation(context);
    setIsTextShown(true);
  };

  const findFullStringFromCitation = (
    context: any,
    textRefs: any,
    selectedParagraphIndices: any,
    setShowBackground: any,
    setProgrammaticScroll: any
  ) => {
    // console.log("apiResponse", apiResponse);
    // console.log("context", context);

    const contextWords = context.split(" ");
    // console.log("THis is context", context);

    const startText = contextWords.slice(0, 6).join(" ");
    const endText = contextWords.slice(5, 11).join(" ");

    // console.log("startText", startText);
    // console.log("endText", endText);

    let apiText: any[] = [];

    // Find paragraph containing both startText and endText
    let combinedText = apiResponse?.find((item: any) =>
      removeDots(item.content.toLowerCase()).includes(context)
    );
    // console.log("combinedText = ", combinedText);

    // If the entire context is not found, look for startText and endText
    if (!combinedText) {
      combinedText = apiResponse?.find(
        (item: any) =>
          removeDots(item.content.toLowerCase()).includes(startText) &&
          removeDots(item.content.toLowerCase()).includes(endText)
      );
    }

    // console.log("combinedText", combinedText);

    if (combinedText) {
      apiText.push(combinedText);
      // console.log("combinedText");
    } else {
      // Find paragraph containing startText
      let startTextParagraph = apiResponse?.find((item: any) =>
        removeDots(item.content.toLowerCase()).includes(startText)
      );
      if (!startTextParagraph) {
        // apiResponse?.forEach((item: any, idx: number) => {
        //   console.log(`Index: ${idx}, Content: ${removeDots(item.content)}`);
        // });

        startTextParagraph = apiResponse?.find((item: any) =>
          removeDots(item.content.toLowerCase()).includes(startText)
        );
        // console.log(
        //   "startTextParagraph apres le nouveau if = ",
        //   startTextParagraph
        // );
      }
      // Find paragraph containing endText
      let endTextParagraph = apiResponse?.find((item: any) =>
        removeDots(item.content.toLowerCase()).includes(endText)
      );

      if (startTextParagraph) {
        apiText.push(startTextParagraph);
      }

      if (endTextParagraph && endTextParagraph !== startTextParagraph) {
        apiText.push(endTextParagraph);
      }
    }
    if (apiText.length > 0) {
      const textIndices = apiText.map((text) =>
        apiResponse?.findIndex((item: any) => item === text)
      );

      setSelectedParagraphIndices(textIndices);
      // console.log("textIndices = ", textIndices);
      // console.log("textRefs = ", textRefs);
      setShowBackground(true);
      setProgrammaticScroll(true);
      setSelected(null);
      // setIsTextShown(true);

      // console.log("textIndices = ", textIndices);
      // console.log("textRefs = ", textRefs);
      textIndices.forEach((textIndex, idx) => {
        // console.log("textIndices dans findString = ", textIndex);
        // console.log("textIndices dans findString = ", idx);
        const textElement = textRefs.current[textIndex];
        // console.log("textElement = ", textElement);

        if (textElement) {
          let blockPosition: ScrollLogicalPosition = "center";

          textElement.scrollIntoView({
            behavior: "smooth",
            block: blockPosition,
          });

          if (idx === textIndices.length - 1) {
            setTimeout(() => {
              setProgrammaticScroll(false);
            }, 1000);
          }
        }
      });
    } else {
      console.log("No matching text found.");
    }
  };

  const filterValues = (obj: { value: string }) => {
    const searchWord = searchValue.toLowerCase();
    const objValue = obj.value.toLowerCase();

    return objValue.includes(searchWord) && objValue.startsWith(searchWord);
  };

  type ContextType = string[];

  const getContexts = (
    searchValue: string,
    fullText: string | null
  ): string[] => {
    const contexts: string[] = [];
    if (searchValue.length < 3) return [];
    if (fullText) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const fullTextLowerCase = fullText.toLowerCase();

      let searchIndex = 0;
      while (
        (searchIndex = fullTextLowerCase.indexOf(
          lowerCaseSearchValue,
          searchIndex
        )) !== -1
      ) {
        if (fullTextLowerCase[searchIndex - 1] != " ") {
          searchIndex++;
          while (fullTextLowerCase[searchIndex] != " ") searchIndex++;
        }
        const beforeText = fullTextLowerCase
          .slice(searchIndex - 60, searchIndex)
          .split(/\s+/);
        const afterText = fullTextLowerCase
          // .slice(searchIndex + lowerCaseSearchValue.length)
          .slice(searchIndex)
          .split(/\s+/);

        // Get the 5 words before the search term
        const beforeWords = beforeText.slice(-5);

        // Get the 5 words after the search term
        const afterWords = afterText.slice(0, 5);

        // Reconstruct the context with 5 words before, the search term, and 5 words after
        let context: string[] = [];

        context.push(...beforeWords);
        // context.push("abc");
        // context.push(
        //   fullText.slice(searchIndex, searchIndex + searchValue.length).trim()
        // );
        // context.push("def");
        context.push(...afterWords);

        contexts.push(context.join(" ").replace(/\s+/g, " "));

        // console.log(
        //   'fullText.slice(searchIndex, searchIndex + searchValue.length) "',
        //   fullText[searchIndex - 1],
        //   '"'
        // );
        // if (fullText[searchIndex - 1] != " ")
        // context = [
        //   ...beforeWords,
        //   fullText.slice(searchIndex, searchIndex + searchValue.length), // Remove spaces around the search term
        //   // ...afterWords,
        // ].join(" ");
        // else
        // {
        //   context = [
        //     ...beforeWords,
        //     fullText.slice(searchIndex, searchIndex + searchValue.length), // Remove spaces around the search term
        //     // ...afterWords,
        //   ].join(" ");

        // }

        // contexts.push(context);
        searchIndex += lowerCaseSearchValue.length;
      }
    }

    return contexts;
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const contexts: ContextType = searchValue
    ? getContexts(searchValue, fullText)
    : [];

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const searchPluginInstance = searchPlugin();
  const { highlight } = searchPluginInstance;

  const base64ToArrayBuffer = (base64: any) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  useEffect(() => {
    if (fileData) {
      const bufferArray = new Uint8Array(fileData.data); // Convert to Uint8Array
      const blob = new Blob([bufferArray], { type: "application/pdf" }); // Create a Blob
      const url = URL.createObjectURL(blob); // Create Blob URL
      setFileUrl(url); // Set the Blob URL

      // Clean up the object URL after the component is unmounted
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [fileData]);

  return (
    <>
      <div
        className="bg-[#F2F2F2] fixed ml-10 mt-2 rounded-xl"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        ref={containerRef}
      >
        {!isHovering && !searchValue && <SearchOutlinedIcon className="mt-1" />}
        {isHovering || searchValue ? (
          <div className="flex justify-center items-center">
            <SearchOutlinedIcon
              className="cursor-pointer"
              onClick={focusInput}
            />
            <input
              type="text"
              placeholder="Rechercher"
              className="bg-[#F2F2F2] p-1 w-[150px] rounded-xl"
              onChange={handleInputChange}
              value={searchValue}
              style={{ userSelect: "none", outline: "none" }}
              ref={inputRef}
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
        <div
          className="w-[250px] h-[300px] ml-9 mt-11 bg-slate-800 rounded-2xl fixed overflow-auto"
          ref={resultsRef}
        >
          <div className="p-2">
            {localTab.filter(filterValues).map((obj, index) => (
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
            {searchValue.length >= 3 &&
              contexts.map((context: any, ctxIndex: any) => (
                <div
                  key={ctxIndex}
                  className="mx-1 mb-1 inline-block rounded-md bg-white"
                >
                  <div
                    className="relative rounded-md cursor-pointer"
                    style={{
                      position: "relative",
                      padding: "0px 12px",
                      boxSizing: "border-box",
                      borderRadius: "inherit",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "gray",
                        opacity: 0.2,
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
                    <button
                      style={{
                        position: "relative",
                        zIndex: 2,
                        opacity: 1,
                        fontFamily: "Lexend",
                        fontSize: "14px",
                        color: "black",
                      }}
                      onClick={() => prepareCitationOpening(context)}
                    >
                      {context}
                    </button>
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
          className="fixed inset-0 bg-[rgba(0,0,20,0.90)] flex justify-center px-4 z-10 max-h-[100vh]"
          onClick={handleClickOutside}
        >
          <div
            className="flex w-full max-w-[1000px] mr-[300px] "
            ref={modalRef}
            onClick={handleClickInside}
          >
            {selected &&
              selected.bounding.map((offset: any, index: number) => (
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
                        setSelectedParagraphIndices,
                        setShowBackground,
                        setProgrammaticScroll
                      )
                    }
                  >
                    <div
                      className="whitespace-nowra overflow-hidde text-ellipss text-center p-1"
                      style={{ maxWidth: "180px", fontFamily: "Lexend" }}
                    >
                      {selected.value}
                    </div>
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

            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              {fileUrl ? (
                <Viewer
                  fileUrl={fileUrl}
                  plugins={[defaultLayoutPluginInstance, searchPluginInstance]}
                  renderLoader={(progress: number) => (
                    <div style={{ width: "240px", margin: "0 auto" }}>
                      <ProgressBar progress={Math.round(progress * 100)} />
                    </div>
                  )}
                />
              ) : (
                <p>No PDF file loaded</p>
              )}
            </Worker>
            {/* 
            <div
              className="flex flex-col overflow-auto px-5 py-3"
              style={{ flex: 2, width: "300px", maxHeight: "100vh" }}
            >
              {selected &&
                selected.bounding.map((offset: any, index: number) => (
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
                          setSelectedParagraphIndices,
                          setShowBackground,
                          setProgrammaticScroll
                        )
                      }
                    >
                      <div
                        className="whitespace-nowra overflow-hidde text-ellipss text-center p-1"
                        style={{ maxWidth: "180px", fontFamily: "Lexend" }}
                      >
                        {selected.value}
                      </div>
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
                {apiResponse?.map((item: any, index: number) => {
                  const hasRole = item.role && item.role !== "pageNumber";
                  const textStyle = hasRole
                    ? "text-lg font-bold"
                    : "text-base font-normal";

                  // Determine if the current index is within the selected range
                  const isParagraphSelected =
                    (selectedParagraphIndices.length === 2 &&
                      index >= selectedParagraphIndices[0] &&
                      index <= selectedParagraphIndices[1]) ||
                    (selectedParagraphIndices.length === 1 &&
                      index === selectedParagraphIndices[0]);

                  const backgroundColor = isParagraphSelected ? "white" : "";

                  return (
                    <div
                      key={index}
                      ref={(el) => {
                        textRefs.current[index] = el;
                      }}
                    >
                      {(item.content.length >= 100 || hasRole || item.word) &&
                      !item.content.startsWith("doc-nb-") ? (
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
              </div> */}
          </div>
        </div>
      )}
      <div>
        {pistacheTab?.length > 0 && (
          <Image
            src={MarquePage}
            alt="no image"
            className="fixed top-[84px] w-20 h-16 cursor-pointer"
            style={{
              userSelect: "none",
              right: showPistacheTab ? "275px" : "-15px",
            }}
            onClick={togglePistacheTab}
            onMouseEnter={() => setIsPistacheHovered(true)}
            onMouseLeave={() => setIsPistacheHovered(false)}
          />
        )}
        {showPistacheTab && (
          <div
            ref={pistacheRef}
            className="ml-10 mt-14 fixed top-10 right-0 w-[300px] bg-slate-800 rounded-xl py-4"
            style={{
              height: `${scrollNeeded ? maxHeight : dynamicHeight}px`,
              overflowY: scrollNeeded ? "auto" : "hidden",
              borderTopLeftRadius: "1rem",
              borderBottomLeftRadius: "1rem",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
            }}
            onMouseEnter={() => setIsPistacheHovered(true)}
            onMouseLeave={() => setIsPistacheHovered(false)}
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
                        style={{
                          color: "white",
                          width: "35px",
                          height: "35px",
                        }}
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
                        style={{
                          color: "white",
                          width: "35px",
                          height: "35px",
                        }}
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
                        style={{
                          color: "white",
                          width: "35px",
                          height: "35px",
                        }}
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
                    cursor: "pointer",
                  }}
                  onClick={() => zoomToValue(item)}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CanvasDrawing;
