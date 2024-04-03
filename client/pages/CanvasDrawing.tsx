"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import nestedObjectData from "../src/app/utils/NestedObjectData";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import traverseAndDraw from "./MapLogic/Drawing";
import DrawTab from "./MapLogic/DrawTab";

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
    console.log("ok");
    return [newObj, localCount, localSum, branch];
  }

  const AddCoordinates: (obj: NestedObject) => any[][] = (
    obj: NestedObject
  ) => {
    localeTab = [];
    const [newObj, , ,] = processNestedObject(obj, 0);
    return localeTab;
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////  countNestedObjectLevels   ////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function ChangeXandY(tab: Array<any>) {
    let maxBranch = 0;
    let midBranch = 0;
    let midCount = 0;
    let maxCount = 0;

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
      }
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

  const nestedDummy = JSON.parse(JSON.stringify(nestedObjectData));
  let localTab = AddCoordinates(nestedDummy);
  ChangeXandY(localTab);
  Color(localTab);

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
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoom = 0.7;
  const minZoom = 0.15;

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

  // useEffect(() => {
  //   redrawCanvas();
  // }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const zoomHandle = zoomHandleRef.current;

    // console.log("zoomLevel", zoomLevel);
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
            const centerY = window.innerHeight / 1.8;
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
      e.preventDefault();
      // console.log("handleWheel");
      const zoomIntensity = 0.05;
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

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("wheel", handleWheel, { passive: false });

    if (zoomHandle) {
      zoomHandle.addEventListener("mousedown", onMouseDown);
    }
    canvas?.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("wheel", handleWheel); // Correction ici
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

  ////

  return (
    <>
      {/* <div className="bg-[#F2F2F2] fixed ml-10 mt-2 rounded-xl ">
        <SearchOutlinedIcon />
        <input
          type="text"
          placeholder="rechercher"
          className="bg-[#F2F2F2] p-1 w-[150px] rounded-xl"
          style={{ userSelect: "none" }}
        />
      </div> */}
      {/* <div className=" ml-10 mt-14 fixed w-[150px] h-[2px] bg-[#ddd]">
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
          {" "}
          {formatZoom(zoomFraction)} %
        </div>
      </div> */}
      <div className=" flex justify-center">
        <canvas
          ref={canvasRef}
          width="1400px"
          height="500px"
          style={{ border: "1px solid black" }}
        />
      </div>
      <div>
        {/* This is objectWithCoordinate = {JSON.stringify(tab)} */}
        {/* This is objectWithCoordinate = {JSON.stringify(objectWithCoordinate)} */}
        {/* This is objectWithCoordinate = {JSON.stringify(flatArray)} */}
        {localTab.map((item, id) => {
          return <div key={id}>{JSON.stringify(item)}</div>;
        })}
        This is count = {count};
      </div>
      <>
        {/* {tab.map((item, id) => {
          return (
            <h1 key={id} className="m-4">
              {JSON.stringify(item)}!!!!!\n\n!
            </h1>
          );
        })} */}
      </>
    </>
  );
};

export default CanvasDrawing;
