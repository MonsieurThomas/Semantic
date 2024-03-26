"use client";

import React, { useEffect, useRef, useCallback } from "react";
import nestedObjectData from "../src/app/utils/NestedObject";
import TotalItemsCounting from "./MapLogic/TotalItemsCounting";

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
    console.log(
      "This is localSum = ",
      localSum,
      "and localCount = ",
      localCount,
      "and depth = ",
      depth
    );
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
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  const traverseAndDraw = (obj: any, ctx: CanvasRenderingContext2D) => {
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
  };

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

  return (
    <div>
      <canvas
        ref={canvasRef}
        // width={total[0] * (200 + 100)}
        // height={total[1] * (100 + 20)}
        width="3000"
        height="3000"
      />
      ;<h1>This is input {JSON.stringify(nestedObjectData)}</h1>
      <div style={{ padding: "30px" }} />
      <h1>This is countNestedObjectLevels {JSON.stringify(nestedObject)}</h1>
      <div style={{ padding: "30px" }} />
      <h1>
        This is TotalItemsCounting, total des extremités {JSON.stringify(total)}
      </h1>
      <div style={{ padding: "10px" }} />
      <h1>
        This is AddCoordinates, l&apos;objet avec x,y et isParsed{" "}
        {JSON.stringify(objectWithCoordinate)}
      </h1>
    </div>
  );
};

export default CanvasDrawing;
