import React from "react";

let width = 550;
let height = 160;

function eyeShape(ctx: CanvasRenderingContext2D, obj: any) {
  const x = obj.x + 40;
  const y = obj.y - 20;

  // Les nouveaux points pour les extrémités pointues
  const startX = x - 20; // Début de la courbe à gauche
  const endX = x + 20; // Fin de la courbe à droite

  // Dessine le contour supérieur de l'œil avec une courbe pointue
  ctx.beginPath();
  ctx.moveTo(startX, y); // Commence à gauche
  ctx.quadraticCurveTo(x, y - 20, endX, y); // Courbe supérieure
  ctx.stroke();

  // Dessine le contour inférieur de l'œil avec une courbe pointue
  ctx.beginPath();
  ctx.moveTo(startX, y); // Re-commence à gauche
  ctx.quadraticCurveTo(x, y + 20, endX, y); // Courbe inférieure
  ctx.stroke();

  // Dessine l'iris (sans modification)
  ctx.beginPath();
  ctx.arc(x, y, 7.5, 0, 2 * Math.PI); // rayonIris était 7.5
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();

  // Dessine la pupille (sans modification)
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI); // rayonPupille était 4
  // ctx.fillStyle = "black";
  ctx.fill();

  if (obj.hideRoot) {
    ctx.beginPath();
    ctx.moveTo(startX, y + 20); // Commence en haut à gauche
    ctx.lineTo(endX, y - 20); // Fini en bas à droite
    ctx.strokeStyle = "black"; // Couleur de la ligne
    ctx.lineWidth = 3; // Augmente l'épaisseur de la ligne
    ctx.stroke();
  }
}

// Utilisez cette fonction dans votre méthode redrawCanvas
// en passant le contexte du canvas et les coordonnées où vous voulez dessiner la forme

function DrawCurveLine(
  ctx: CanvasRenderingContext2D,
  obj: any,
  obj2: any,
  caseWidth: number,
  caseHeight: number
) {
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
    ctx.lineWidth = 12;
    ctx.stroke();
  } else {
    ctx.beginPath();
    if (obj2.y > obj.y) {
      ctx.moveTo(obj.x + 50, obj.y + caseHeight);
      ctx.quadraticCurveTo(
        obj.x + obj2.x / 2,
        obj.y + (obj2.y - obj.y),
        obj2.x + caseWidth,
        obj2.y + caseHeight / 2
      );
    } else {
      ctx.moveTo(obj.x + 50, obj.y);
      ctx.quadraticCurveTo(
        obj.x + obj2.x / 2,
        obj.y - (obj.y - obj2.y),
        obj2.x + caseWidth,
        obj2.y + caseHeight / 2
      );
    }
    ctx.strokeStyle = obj2.color;
    ctx.lineWidth = 12;

    ctx.stroke();
  }
}

function DrawLine(
  ctx: CanvasRenderingContext2D,
  obj: any,
  obj2: any,
  caseWidth: number,
  caseHeight: number
) {
  let cornerRadius = 20;

  // ctx.beginPath();
  let midX = (obj.x + obj2.x + caseWidth) / 2;
  ctx.beginPath();
  ctx.moveTo(obj.x, obj.y + caseHeight / 2);

  if (obj.x > 0) {
    if (obj.path[obj.path.length - 1] == "1") {
      ctx.lineTo(midX + cornerRadius, obj.y + caseHeight / 2);
      ctx.arc(
        midX + cornerRadius,
        obj.y + caseHeight / 2 + cornerRadius,
        cornerRadius,
        1.5 * Math.PI,
        1 * Math.PI,
        true
      );
    } else if (obj.end) {
      ctx.arc(
        midX + cornerRadius,
        obj.y + caseHeight / 2 - cornerRadius,
        cornerRadius,
        0.5 * Math.PI,
        1 * Math.PI
      );
    } else ctx.lineTo(midX, obj.y + caseHeight / 2);
    ctx.lineTo(midX, obj2.y + caseHeight / 2);
    ctx.lineTo(obj2.x + caseWidth, obj2.y + caseHeight / 2);
    ctx.strokeStyle = obj.color;
    ctx.lineWidth = 8;
    ctx.stroke();
  }

  if (obj.x < 0) {
    // ctx.lineTo(midX, obj.y + caseHeight / 2);
    ctx.lineTo(midX, obj.y + caseHeight / 2);
    if (obj2.path[obj2.path.length - 1] == "1") {
      ctx.arc(
        midX - cornerRadius,
        obj2.y + caseHeight / 2 + cornerRadius,
        cornerRadius,
        2 * Math.PI,
        1.5 * Math.PI,
        true
      );
    } else if (obj2.end) {
      ctx.arc(
        midX - cornerRadius,
        obj2.y + caseHeight / 2 - cornerRadius,
        cornerRadius,
        2 * Math.PI,
        0.5 * Math.PI
      );
    } else ctx.lineTo(midX, obj2.y + caseHeight / 2);
    ctx.lineTo(obj2.x + caseWidth, obj2.y + caseHeight / 2);
    ctx.strokeStyle = obj.color;
    ctx.lineWidth = 8;
    ctx.stroke();
  }
}

function ParseLine(
  ctx: CanvasRenderingContext2D,
  tab: Array<any>,
  caseWidth: number,
  caseHeight: number
) {
  tab.forEach((obj) => {
    tab.forEach((obj2) => {
      if (
        obj.path.includes(obj2.path) &&
        obj.path.startsWith(obj2.path) &&
        Math.abs(obj2.path.length - obj.path.length) == 2 &&
        !obj.hide &&
        !obj2.hide
      ) {
        if (obj.x > 0) DrawLine(ctx, obj, obj2, caseWidth, caseHeight);
        else DrawLine(ctx, obj2, obj, caseWidth, caseHeight);
      }
      if (
        Math.abs(obj2.path.length + obj.path.length) === 1 &&
        obj.path.length === 0 &&
        !obj.hide &&
        !obj2.hide
      ) {
        DrawCurveLine(ctx, obj, obj2, caseWidth, caseHeight);
      }
    });
  });
}

function DrawBubble(
  ctx: CanvasRenderingContext2D,
  obj: any,
  caseWidth: number,
  caseHeight: number,
  zoom: number
) {
  ctx.save();

  if (zoom > 50) {
    let opacity = (zoom - 50) / 50;
    ctx.globalAlpha = opacity;

    ctx.beginPath();
    if (obj.x < 0) ctx.arc(obj.x - 20, obj.y + 50, 14, 0, 2 * Math.PI, false);
    else ctx.arc(obj.x + 370, obj.y + 50, 14, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    if (obj.occurence) {
      ctx.fillStyle = "black";
      ctx.font = "17px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (obj.x < 0) {
        ctx.fillText(obj.occurence.toString(), obj.x - 20, obj.y + 50);
      } else {
        ctx.fillText(obj.occurence.toString(), obj.x + 370, obj.y + 50);
      }
    }
  }

  ctx.restore();
}

function DrawSquare(
  ctx: CanvasRenderingContext2D,
  obj: any,
  caseWidth: number,
  caseHeight: number
) {
  if (obj.hide) return;

  let posX = obj.x;
  let posY = obj.y;
  const cornerRadius = 20;
  if (obj.branch == 0) {
    posX = obj.x - 50;
    posY = obj.y - 50;
    caseWidth += 100;
    caseHeight += 100;
  }
  ctx.beginPath();
  ctx.moveTo(posX + cornerRadius, posY);
  ctx.lineTo(posX + caseWidth - cornerRadius, posY);
  ctx.arc(
    posX + caseWidth - cornerRadius,
    posY + cornerRadius,
    cornerRadius,
    1.5 * Math.PI,
    2 * Math.PI
  );
  ctx.lineTo(posX + caseWidth, posY + caseHeight - cornerRadius);
  ctx.arc(
    posX + caseWidth - cornerRadius,
    posY + caseHeight - cornerRadius,
    cornerRadius,
    0,
    0.5 * Math.PI
  );
  ctx.lineTo(posX + cornerRadius, posY + caseHeight);
  ctx.arc(
    posX + cornerRadius,
    posY + caseHeight - cornerRadius,
    cornerRadius,
    0.5 * Math.PI,
    Math.PI
  );
  ctx.lineTo(posX, posY + cornerRadius);
  ctx.arc(
    posX + cornerRadius,
    posY + cornerRadius,
    cornerRadius,
    Math.PI,
    1.5 * Math.PI
  );
  ctx.closePath();

  const calculatedOpacity = (10 - (Math.abs(obj.x / caseWidth) - 1) * 1.5) / 10;
  const opacity = Math.max(calculatedOpacity, 0.5);
  ctx.globalAlpha = opacity;

  ctx.fillStyle = obj.color;
  ctx.fill();
  if (obj.path.length < 3)
    ctx.fillStyle = "white"; // ou toute autre couleur pour le texte
  else ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  const xy = `${obj.x} et ${obj.y} et ${obj.count}`;
  if (obj.hover) eyeShape(ctx, obj);
  ctx.fillText(obj.value, posX + 10, posY + 30);
  ctx.fillText(xy, posX + 10, posY + 60);
}

function DrawTab(ctx: CanvasRenderingContext2D, tab: Array<any>, zoom: number) {
  if (!Array.isArray(tab)) {
    return;
  }
  //   console.log("on passe le return DrawTab", { tab });

  let caseWidth = 350;
  let caseHeight = 100;
  ParseLine(ctx, tab, caseWidth, caseHeight);
  tab.forEach((obj) => {
    DrawSquare(ctx, obj, caseWidth, caseHeight);
    DrawBubble(ctx, obj, caseWidth, caseHeight, zoom);
  });
}

export default DrawTab;
