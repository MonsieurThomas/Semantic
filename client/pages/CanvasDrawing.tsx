"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import nestedObjectData from "../src/app/utils/NestedObjectData";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DrawTab from "./MapLogic/DrawTab";
import PdfDisplay from "./PdfDisplay";

interface NestedObject {
  [key: string]: any;
}

const CanvasDrawing = () => {
  let count = 0;
  let branchNb = 0;
  let localeTab: Array<any> = [];

  function processNestedObject(
    obj: NestedObject,
    depth = 0,
    branch = 0,
    parentKey = "",
    path = "" //
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
        !Array.isArray(obj[key])
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
      } else {
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
          value: obj[key],
          branch: branchNb,
          path: currentPath.substring(2),
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
    count = 0;
    branchNb = 0;
    console.log("Mince pendant instanciation");

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
    console.log("obj.y", obj.y);
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
    let maxBranch = 0;
    let midBranch = 0;
    let midCount = 0;
    let maxCount = 0;
    console.log("Mince apres instanciation");
    tab.forEach((obj) => {
      // branche moyenne pour envoyer la moitié de la carte a gauche
      if (obj.branch > maxBranch) {
        maxBranch = obj.branch;
      }
    });
    midBranch = maxBranch / 2 + 1;

    tab.forEach((obj) => {
      // hauteur max de la section droite de la carte
      if (obj.branch < midBranch) if (midCount < obj.y) midCount = obj.y;
    });

    tab.forEach((obj) => {
      // hauteur max total pour calcul de la postion de la section gauche
      if (obj) if (maxCount < obj.y) maxCount = obj.y;
    });

    tab.forEach((obj) => {
      // changement de position pour la gauche
      if (obj.branch >= midBranch) {
        obj.y = obj.y - midCount + (maxCount - midCount) / 2;
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
      obj.hideRoot = false;
    });
  }

  function Color(tab: Array<any>) {
    const randomNumber = Math.random();
    const color = ["#FA463E", "#01B577", "#F39D4C", "#E2C524", "#47B8D4"];
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
  const [isZooming, setIsZooming] = useState(false);
  const [zoomFraction, setZoomFraction] = useState<number>(0.35);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringObject, setIsHoveringObject] = useState(false);
  const [isPdfVisible, setIsPdfVisible] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const pdfRef = useRef(null);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoom = 0.7;
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
    DrawTab(ctx, localTab);
    ctx.restore();
  }, [panOffset, zoomLevel, localTab]);

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
          adjustedY >= obj.y - 30 &&
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
        console.log("newPanOffsetX dans handlewheel = ", newPanOffsetX);
        console.log("newPanOffsetY dans handlewheel = ", newPanOffsetY);
        // console.log("newZoomLevel dans handlewheel = ", newZoomLevel);
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
          console.log("sur la case ", obj.value);
          setIsPdfVisible(!isPdfVisible);
        }
        if (
          adjustedX >= obj.x + 15 &&
          adjustedX <= obj.x + 70 &&
          adjustedY >= obj.y - 40 &&
          adjustedY <= obj.y
        ) {
          obj.hideRoot = !obj.hideRoot;
          hideCases(localTab, obj);
        }
      });
    };

    function handleClickOutside(event) {
      if (pdfRef.current && !pdfRef.current.contains(event.target)) {
        setIsPdfVisible(false); // Cache le PDF si le clic est à l'extérieur
      }
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("click", handleCanvasClick);
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
    });
    if (zoomHandle) {
      zoomHandle.addEventListener("mousedown", onMouseDown);
    }
    canvas?.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("click", handleCanvasClick);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("mousedown", handleClickOutside);
      if (zoomHandle) {
        zoomHandle.removeEventListener("mousedown", onMouseDown);
      }
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
    pdfRef,
    hideCases,
    isPdfVisible,
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

  return (
    <>
      <div
        className="bg-[#F2F2F2] fixed ml-10 mt-2 rounded-xl "
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)} //
      >
        {isPdfVisible && (
          <div ref={pdfRef}>
            <PdfDisplay />
          </div>
        )}
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
              .filter((obj) => obj.value.includes(searchValue))
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
      <div className="flex items-center justify-center">
        {isPdfVisible && <PdfDisplay />}
      </div>
      {/* {localTab
        .filter((obj) => obj.hover)
        .map((obj) => {
          const adjustedX = obj.x * zoomLevel + panOffset.x;
          const adjustedY = obj.y * zoomLevel + panOffset.y;
          console.log("zoomLevel dans return = ", zoomLevel);

          console.log("panOffset.x", panOffset.x);
          console.log("panOffset.y", panOffset.y);
          // console.log("panOffset.y", panOffset.y);
          // console.log("adjustedX", adjustedX);
          // console.log("adjustedY", adjustedY);

          return (
            <React.Fragment key={obj.value}>
              <div
                style={{
                  position: "absolute",
                  top: `${adjustedY}px`,
                  left: `${adjustedX}px`,
                  transform: "translate(-50%, -50%)", // Centrer l'icône par rapport à ses coordonnées
                }}
              >
                <SearchOutlinedIcon />
              </div>
            </React.Fragment>
          );
        })} */}

      <div className=" flex justify-center">
        <canvas
          ref={canvasRef}
          width={widthScreen}
          height={heightScreen}
          style={{ border: "1px solid black" }}
        />
      </div>
      <div>
        {localTab.map((item, id) => {
          return <div key={id}>{JSON.stringify(item)}</div>;
        })}
        This is count = {count};
      </div>
    </>
  );
};

export default CanvasDrawing;
