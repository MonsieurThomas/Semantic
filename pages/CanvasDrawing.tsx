"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import nestedObjectData from "../src/app/utils/NestedObject";
import TotalItemsCounting from "./MapLogic/TotalItemsCounting";
// import countNestedObjectLevels from "./ParsingLogic";
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

  const zoomHandleRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoom = 2;
  const minZoom = 0.3;

  const onZoomHandleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation(); // Important pour éviter de déclencher le panning ou d'autres actions
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
    ctx.translate(panOffset.x, panOffset.y);
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

    // Modifier onMouseDown pour distinguer les deux cas
    const onMouseDown = (e: MouseEvent) => {
      console.log("mouse down");
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

        // Définir la nouvelle position de la poignée de zoom
        zoomHandle.style.left = `${newLeft}px`;
        // console.log(newPositionX);
        if (newPositionX >= 0 && newPositionX <= rect.width) {
          const zoomFraction =
            newPositionX / (rect.width - zoomHandle.offsetWidth);
          const newZoomLevel = minZoom + (maxZoom - minZoom) * zoomFraction;

          // Calculez d'abord newPanOffsetX et newPanOffsetY en utilisant newZoomLevel
          const currentCenterX = (-panOffset.x + rect.width / 2) / zoomLevel;
          const currentCenterY = (-panOffset.y + rect.height / 2) / zoomLevel;
          console.log("currentCenterY", currentCenterY);
          const newPanOffsetX = -(
            currentCenterX * newZoomLevel -
            rect.width / 2
          );
          console.log("newPanOffsetX", newPanOffsetX);
          const newPanOffsetY = -(
            currentCenterY * newZoomLevel -
            rect.height / 2
          );

          // Ensuite, mettez à jour zoomLevel et panOffset
          setZoomLevel(newZoomLevel);
          setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });
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
    if (zoomHandle) {
      zoomHandle.addEventListener("mousedown", onMouseDown);
    }
    canvas?.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
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
  ]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <input
        type="text"
        placeholder="rechercher"
        className="bg-black-300 fixed ml-10 mt-2"
      />
      <div className=" ml-10 mt-12 fixed w-[150px] h-[2px] bg-[#ddd]">
        <div
          ref={zoomHandleRef}
          onMouseDown={onZoomHandleMouseDown}
          className="absolute w-2 h-2 bg-[#DCDCDC] cursor-pointer border-lg rounded-xl"
          style={{ top: "-3px", left: "50px" }}
        ></div>
      </div>
      <div className=" flex justify-center">
        <canvas
          ref={canvasRef}
          width={total[1] * (200 + 50)}
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
