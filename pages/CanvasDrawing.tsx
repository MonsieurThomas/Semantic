"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import nestedObjectData from "../src/app/utils/NestedObject";
import TotalItemsCounting from "./MapLogic/TotalItemsCounting";
import Zoomlogic from "./Zoomlogic";

interface NestedObject {
  [key: string]: any;
}

const CanvasDrawing = () => {
  ///////////////////////////////  ADDCoordinate   /////////////////////////////////////////////////////
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
        localCount += subCount; // Inclure le compte des niveaux inférieurs
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
    // console.log(
    //   "This is localSum = ",
    //   localSum,
    //   "and localCount = ",
    //   localCount,
    //   "and depth = ",
    //   depth
    // );
    localSum += localSum / localCount;
    localCount++;
    return [newObj, localCount, localSum];
  }

  const AddCoordinates = (obj: NestedObject): NestedObject => {
    const [newObj, ,] = processNestedObject(obj, 1); // Commencer à la profondeur 1
    return newObj;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////  countNestedObjectLevels   ////////////////////////////////////////////////////
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
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const nestedDummy = JSON.parse(JSON.stringify(nestedObjectData));

  const nestedObject: any = countNestedObjectLevels(nestedObjectData);
  const total = TotalItemsCounting(nestedObjectData);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectWithCoordinate: NestedObject = AddCoordinates(nestedDummy);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////  Drawing function   ////////////////////////////////////////////////

  
  const traverseAndDraw = useCallback((obj: any, ctx: CanvasRenderingContext2D) => {
    const drawSquare = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      label: string
    ) => {
      ctx.fillStyle = "blue"; // Couleur des carrés
      ctx.fillRect(x + x * 100, y + y * 50, 200, 100);
      ctx.fillStyle = "white"; // Couleur du texte pour le contraste
      ctx.font = "20px Arial"; // Taille et type de police pour le label
      ctx.fillText(label, x + x * 100 + 10, y + y * 50 + 30);
    };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const val = obj[key];
        if (typeof val === "object" && val !== null) {
          if ("x" in val && "y" in val) {
            const label = `x: ${val.x}, y: ${val.y}`;
            drawSquare(ctx, val.y * 2, val.x * 2, label); // inverser
          }
          traverseAndDraw(val, ctx);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Nettoyer le canvas avant de dessiner
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Parcourir l'objet imbriqué et dessiner des carrés
        traverseAndDraw(objectWithCoordinate, ctx);
      }
    }
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////     Zoom Logic    ///////////////////////////////////////////////////

  // const zoomHandleRef = useRef<HTMLDivElement>(null);
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const maxZoom = 2; // Définissez selon vos besoins
  // const minZoom = 0.5; // Définissez selon vos besoins
  // let zoomLevel = 1;

  // useEffect(() => {
  //   const onMouseMove = (e: MouseEvent) => {
  //     const zoomHandle = zoomHandleRef.current;
  //     const canvas = canvasRef.current;
  //     // if (!zoomHandle || !canvas) return;

  //     // Convertir la position X de la souris en position relative dans le slider
  //     if (zoomHandle) {
  //       const rect = zoomHandle.parentElement!.getBoundingClientRect();
  //       const newPositionX = Math.max(
  //         0,
  //         Math.min(e.clientX - rect.left, rect.width - zoomHandle.offsetWidth)
  //       );

  //       // Mettre à jour la position de la boule de zoom
  //       zoomHandle.style.left = `${newPositionX}px`;

  //       // Calculer le nouveau niveau de zoom
  //       const zoomFraction =
  //         newPositionX / (rect.width - zoomHandle.offsetWidth);
  //       zoomLevel = minZoom + (maxZoom - minZoom) * zoomFraction;
  //       console.log("zoomLevel = ", zoomLevel);
  //     }

  //     // Redessiner le canvas avec le nouveau niveau de zoom
  //     redrawCanvas(zoomLevel);
  //   };

  //   const onMouseDown = () => {
  //     document.addEventListener("mousemove", onMouseMove);
  //     document.addEventListener(
  //       "mouseup",
  //       () => {
  //         document.removeEventListener("mousemove", onMouseMove);
  //       },
  //       { once: true }
  //     );
  //   };

  //   if (zoomHandleRef.current) {
  //     zoomHandleRef.current.addEventListener("mousedown", onMouseDown);
  //   }

  //   return () => {
  //     if (zoomHandleRef.current) {
  //       zoomHandleRef.current.removeEventListener("mousedown", onMouseDown);
  //     }
  //   };
  // }, []);

  // const redrawCanvas = (zoomLevel: number) => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   ctx.clearRect(0, 0, canvas.width, canvas.height); //
  //   ctx.save();
  //   ctx.scale(zoomLevel, zoomLevel);
  //   traverseAndDraw(objectWithCoordinate, ctx); //
  //   ctx.restore();
  // };

  // Zoomlogic(canvasRef, zoomHandle, zoomSlider)
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [isZooming, setIsZooming] = useState(false);
  const zoomHandleRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoom = 2;
  const minZoom = 0.5;

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
  }, [panOffset, zoomLevel, objectWithCoordinate, traverseAndDraw]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const zoomHandle = zoomHandleRef.current;

    const onZoomHandleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation(); // Empêcher l'événement de se propager au canvas
      setIsZooming(true);
      // Plus de logique si nécessaire
    };

    // Modifier onMouseDown pour distinguer les deux cas
    const onMouseDown = (e: MouseEvent) => {
      if (!isZooming) {
        setIsPanning(true);
        setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isPanning && canvas) {
        const dx = e.clientX - startPan.x;
        const dy = e.clientY - startPan.y;
        setPanOffset({ x: dx, y: dy });
        redrawCanvas();
      }

      // Gestion du mouvement de la poignée de zoom
      if (zoomHandle && e.target === zoomHandle) {
        const rect = zoomHandle.parentElement!.getBoundingClientRect();
        const newPositionX = Math.max(
          0,
          Math.min(e.clientX - rect.left, rect.width - zoomHandle.offsetWidth)
        );

        zoomHandle.style.left = `${newPositionX}px`;

        const zoomFraction =
          newPositionX / (rect.width - zoomHandle.offsetWidth);
        const newZoomLevel = minZoom + (maxZoom - minZoom) * zoomFraction;
        setZoomLevel(newZoomLevel);
        redrawCanvas();
      }
    };

    const onMouseUp = () => setIsPanning(false);

    // Ajout des écouteurs d'événements pour la souris
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    if (zoomHandle) {
      zoomHandle.addEventListener("mousedown", onMouseDown); // Pour déplacer la poignée de zoom
    }
    canvas?.addEventListener("mousedown", onMouseDown); // Pour commencer le panning

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
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className=" ml-10 mt-10 fixed w-[200px] h-5 bg-[#ddd]">
        <div
          ref={zoomHandleRef}
          className="absolute w-5 h-5 bg-[#333] cursor-pointer border-lg"
        ></div>
      </div>
      <div className=" relative flex justify-center">
        <canvas
          ref={canvasRef}
          width={total[1] * (200 + 100)}
          height={total[0] * (100 + 8)}
          style={{ border: "1px solid #000" }}
        />
      </div>
    </>
  );
};

export default CanvasDrawing;
