import React from "react";

let width = 550;
let height = 160;
let caseWidth = 350;
let caseHeight = 100;

function DrawCurveLine(ctx: CanvasRenderingContext2D, obj: any, obj2: any) {
  ctx.beginPath();

  if (obj2.x > 0) {
    if (obj2.y > obj.y) {
      ctx.moveTo(obj.x + 300, obj.y + caseHeight);
      ctx.quadraticCurveTo(
        obj.x + obj2.x / 2,
        obj.y + (obj2.y - obj.y),
        obj2.x,
        obj2.y + caseHeight / 2
      );
    } else {
      ctx.moveTo(obj.x + 300, obj.y);
      ctx.quadraticCurveTo(
        obj.x + obj2.x / 2,
        obj.y - (obj.y - obj2.y),
        obj2.x,
        obj2.y + caseHeight / 2
      );
    }
    ctx.strokeStyle = obj2.color;
    ctx.lineWidth = 6;
    ctx.stroke();
  } else {
    ctx.beginPath();
    if (obj2.y > obj.y) {
      ctx.moveTo(obj.x + 50, obj.y + caseHeight);
      ctx.quadraticCurveTo(
        obj.x + obj2.x / 4,
        obj.y + (obj2.y - obj.y),
        obj2.x + 300,
        obj2.y + caseHeight / 2
      );
    } else {
    //   console.log("ici aussi");
      ctx.moveTo(obj.x + 50, obj.y);
      ctx.quadraticCurveTo(
        obj.x + obj2.x / 2,
        obj.y - (obj.y - obj2.y),
        obj2.x,
        obj2.y + caseHeight / 2
      );
    }
    ctx.strokeStyle = obj2.color;
    ctx.lineWidth = 6;

    ctx.stroke();
  }
}

function DrawLine(ctx: CanvasRenderingContext2D, obj: any, obj2: any) {
  ctx.beginPath();
  let midX = (obj.x + obj2.x + caseWidth) / 2;
  ctx.beginPath();
  ctx.moveTo(obj.x, obj.y + caseHeight / 2);
  ctx.lineTo(midX, obj.y + caseHeight / 2);
  ctx.lineTo(midX, obj2.y + caseHeight / 2);
  ctx.lineTo(obj2.x + caseWidth, obj2.y + caseHeight / 2);
  ctx.strokeStyle = obj.color;
  ctx.lineWidth = 3; // Augmente l'épaisseur de la ligne
  ctx.stroke();
}



function ParseLine(ctx: CanvasRenderingContext2D, tab: Array<any>) {
  //   console.log("ok");
  tab.forEach((obj) => {
    tab.forEach((obj2) => {
      if (
        obj.path.includes(obj2.path) &&
        obj.path.startsWith(obj2.path) &&
        Math.abs(obj2.path.length - obj.path.length) == 2
      ) {
        // console.log("ok pour ", obj.path, "et ", obj2.path);
        if (obj.x > 0) DrawLine(ctx, obj, obj2);
        else DrawLine(ctx, obj2, obj);
      }
      if (
        Math.abs(obj2.path.length + obj.path.length) === 1 &&
        obj.path.length === 0
      ) {
        DrawCurveLine(ctx, obj, obj2);
      }
    });
  });
}

function DrawSquare(ctx: CanvasRenderingContext2D, obj: any) {
  const posX = obj.x;
  const posY = obj.y;
  ctx.fillStyle = obj.color;
  ctx.fillRect(posX, posY, caseWidth, caseHeight);
}

function DrawTab(ctx: CanvasRenderingContext2D, tab: Array<any>) {
    if (!Array.isArray(tab)) {
        console.error("DrawTab a reçu un argument qui n'est pas un tableau", tab);
        return; // Sort de la fonction si tab n'est pas un tableau
      }
  tab.forEach((obj) => {
    obj.y = obj.y * height;
    obj.x = obj.x * width;
  });
  tab.forEach((obj) => {
    DrawSquare(ctx, obj);
  });
  ParseLine(ctx, tab);
}

export default DrawTab;