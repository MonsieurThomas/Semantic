"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import nestedObjectData from "../src/app/utils/NestedObjectData";
import TotalItemsCounting from "./MapLogic/TotalItemsCounting";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import traverseAndDraw from "./MapLogic/Drawing";

interface NestedObject {
  [key: string]: any;
}

const CanvasDrawing = () => {
  let count = 0;

  function processNestedObject(
    obj: NestedObject,
    depth = 0
  ): [NestedObject, number, number] {
    let localCount = 0;
    let localSum = 0;
    const newObj: NestedObject = {};

    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        const [processedObj, subCount, subSum] = processNestedObject(
          obj[key] as NestedObject,
          depth + 1
        );
        newObj[key] = processedObj;
        localCount += subCount;
        localSum += subSum;
      } else {
        count++;
        localCount++;
        localSum += count;
        newObj[key] = { x: count, y: depth };
      }
    }
    if (localSum && depth - 1 > 0)
      newObj["pos"] = { x: localSum / localCount, y: depth - 1 };
    localSum += localSum / localCount;
    localCount++;
    return [newObj, localCount, localSum];
  }

  const AddCoordinates = (obj: NestedObject): NestedObject => {
    const [newObj, ,] = processNestedObject(obj, 1);
    return newObj;
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function countNestedObjectLevels(obj: NestedObject) {
    const count = (currentObj: any, depth: number = 0) => {
      if (typeof currentObj !== "object" || currentObj === null) {
        return { value: currentObj, depth }; // For non-objects, return the value and depth directly
      }

      let structure: NestedObject = {};
      let length = 0; // Initialize length count for this level

      for (const key in currentObj) {
        if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
          const item = currentObj[key];
          const { structure: nestedStructure, depth: nestedDepth } = count(
            item,
            depth + 1
          );
          structure[key] = nestedStructure; // Add the nested structure or value directly
          length += 1; // Count each item at this level
        }
      }

      // Attach a length property and the nested structure or value
      return { structure: { ...structure, length }, depth };
      // return { structure: { ...structure, length }, depth };
    };

    const { structure: resultStructure } = count(obj);
    return resultStructure;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////  countNestedObjectLevels   ////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const nestedDummy = JSON.parse(JSON.stringify(nestedObjectData));
  const nestedObject: any = countNestedObjectLevels(nestedObjectData);
  const total = TotalItemsCounting(nestedObjectData);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectWithCoordinate: NestedObject = AddCoordinates(nestedDummy);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        traverseAndDraw(objectWithCoordinate, ctx);
      }
    }
  }, [objectWithCoordinate]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoom = 2;
  const minZoom = 0.2;

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
    traverseAndDraw(objectWithCoordinate, ctx);
    ctx.restore();
  }, [panOffset, zoomLevel, objectWithCoordinate]);
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const zoomHandle = zoomHandleRef.current;

    console.log("zoomLevel", zoomLevel);
    const onMouseDown = (e: MouseEvent) => {
      if (
        zoomHandleRef.current &&
        zoomHandleRef.current.contains(e.target as Node)
      ) {
        // La souris est enfoncée sur la poignée de zoom
      } else {
        // La souris est enfoncée ailleurs, commencer le panning
        setIsPanning(true);
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
      console.log("handleWheel");
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
          console.log("newLeft", newLeft);
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
      <div className="bg-[#F2F2F2] fixed ml-10 mt-2 rounded-xl ">
        <SearchOutlinedIcon />
        <input
          type="text"
          placeholder="rechercher"
          className="bg-[#F2F2F2] p-1 w-[150px] rounded-xl"
          style={{ userSelect: "none" }}
        />
      </div>
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
          {" "}
          {formatZoom(zoomFraction)} %
        </div>
      </div>
      <div className=" flex justify-center">
        <canvas
          ref={canvasRef}
          width="1400px"
          height={total[0] * (100 + 8)}
          style={{ border: "1px solid black" }}
        />
      </div>
      <h1>
        This is objectWithCoordinate = {JSON.stringify(objectWithCoordinate)}
      </h1>
    </>
  );
};

export default CanvasDrawing;
