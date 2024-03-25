"use client";

import React, { useEffect, useRef, useCallback } from "react";
import nestedObjectData from "../src/app/utils/NestedObject";
import TotalItemsCounting from "./MapLogic/TotalItemsCounting";
import countNestedObjectLevels from "./MapLogic/NestedObjectItemCounting";
// import AddCoordinates from "./MapLogic/AddCoordinates";
import exploreObject from "./MapLogic/Explore";

interface NestedObject {
  [key: string]: any;
}

const CanvasDrawing = () => {
  // const nestedObject: any = countNestedObjectLevels(nestedObjectData);
  const total = TotalItemsCounting(nestedObjectData);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const objectWithCoordinate = AddCoordinates(nestedObjectData);

  exploreObject(nestedObjectData);

  const drawLevel = (
    ctx: CanvasRenderingContext2D,
    length: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    for (let i = 0; i < length; i++) {
      // dessin case
      const rectY = y + (height + 20) * i; // Allignement case meme niveau
      ctx.strokeRect(x, rectY, width, height);
      ctx.fillText(`Length: ${length}`, x, rectY + 5 + 15);
    }
  };

  const drawRectangles = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      obj: NestedObject,
      x: number,
      y: number,
      width: number,
      height: number,
      depth: number
    ) => {
      if ("length" in obj) {
        drawLevel(ctx, obj.length, x, y, width, height);
        x += height + 20; // Decalage Niveau suivant
      }

      for (const key in obj) {
        if (key !== "length" && typeof obj[key] === "object") {
          drawRectangles(
            ctx,
            obj[key],
            x + (width + 40), // ecartement entre niveaux
            y,
            width,
            height,
            depth + 1
          );
        }
      }
    },
    []
  );

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawRectangles(ctx, nestedObjectData, 20, 20, 180, 80, 0);
      }
    }
  }, [drawRectangles]); // data

  return (
    <div>
      <canvas ref={canvasRef} width="3000" height="500" />;
      <h1>This is input {JSON.stringify(nestedObjectData)}</h1>
      <div style={{ padding: "30px" }} />
      {/* <h1>This is countNestedObjectLevels {JSON.stringify(nestedObject)}</h1> */}
      <div style={{ padding: "30px" }} />
      <h1>
        This is TotalItemsCounting, total des extremités {JSON.stringify(total)}
      </h1>
      <div style={{ padding: "10px" }} />
      <h1>
        This is AddCoordinates, lapos;objet avec x,y et isParsed{" "}
        {/* {JSON.stringify(objectWithCoordinate)} */}
      </h1>
    </div>
  );
};

export default CanvasDrawing;
