// import ParseLine from "./DrawAndParseLine";
// import DrawSquare from "./DrawCasesAndText";
// import DrawBubble from "./DrawOccurencesBubble";

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
    if (obj.begin) {
      // if (obj.path[obj.path.length - 1] == "1") {
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
    if (obj2.begin) {
      // if (obj2.path[obj2.path.length - 1] == "1") {
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



function wrapText(
  ctx: CanvasRenderingContext2D,
  obj: any,
  boxWidth: number,
  lineHeight: number
) {
  const words = obj.value.split(" ");
  let lines = [];
  let line = "";
  let totalHeight = 0;
  let boxX = obj.x;
  let boxY = obj.y + 5;
  if (obj.branch == 0) boxX -= 50;

  // Pré-calculer les lignes pour déterminer la hauteur totale
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > boxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
      totalHeight += lineHeight;
      if (lines.length === 3) {
        break;
      }
    } else {
      line = testLine;
    }
  }
  if (lines.length < 3) {
    lines.push(line); // Ajoute la dernière ligne si moins de trois
  } else {
    lines[2] = line.trim() + "..."; // Tronque et ajoute "..." à la troisième ligne
  }
  let startY = boxY + lineHeight;
  // Dessiner les lignes centrées horizontalement jusqu'à un maximum de trois
  lines.forEach((ln, index) => {
    if (index < 3) {
      // Dessine seulement les trois premières lignes
      const lineWidth = ctx.measureText(ln).width;
      const startX = boxX + (boxWidth - lineWidth) / 2;
      ctx.fillText(ln, startX, startY);
      startY += lineHeight; // Ajouter l'écart augmenté entre les lignes
    }
  });
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
  if (obj.path.length < 3) ctx.fillStyle = "white";
  else ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  if (obj.branch == 0) ctx.font = "50px Arial";
  if (obj.hover && obj.branch != 0) eyeShape(ctx, obj);
  if (obj.hover && obj.branch != 0) drawMagicWand(ctx, obj);
  wrapText(ctx, obj, caseWidth, 27);
}




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
      ctx.moveTo(obj.x + 400, obj.y + caseHeight);
      ctx.quadraticCurveTo(
        obj.x + obj2.x,
        obj.y + (obj2.y - obj.y),
        obj2.x,
        obj2.y + caseHeight / 2
      );
    } else {
      ctx.moveTo(obj.x + 400, obj.y);
      ctx.quadraticCurveTo(
        obj.x,
        obj.y - (obj2.y - obj.y),
        obj2.x,
        obj2.y + caseHeight / 2
      );
    }
    ctx.strokeStyle = obj2.color;
    ctx.lineWidth = 12;
    ctx.stroke();
  } else {
    // ctx.beginPath();
    if (obj2.y > obj.y) {
      ctx.moveTo(obj.x + 50, obj.y + caseHeight + 50);
      ctx.quadraticCurveTo(
        obj.x + obj2.x / 2,
        obj.y + (obj2.y - obj.y),
        obj2.x + caseWidth,
        obj2.y + caseHeight / 2
      );
    } else {
      ctx.moveTo(obj.x + 50, obj.y - 50);
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




function eyeShape(ctx: CanvasRenderingContext2D, obj: any) {
  ctx.save(); // Sauvegarde l'état actuel du contexte

  const x = obj.x + 40;
  const y = obj.y - 20;

  const startX = x - 20; // Début de la courbe à gauche
  const endX = x + 20; // Fin de la courbe à droite

  // Dessine le contour supérieur de l'œil
  ctx.beginPath();
  ctx.moveTo(startX, y); // Commence à gauche
  ctx.quadraticCurveTo(x, y - 20, endX, y); // Courbe supérieure
  ctx.strokeStyle = "black"; // Assurez-vous de définir la couleur de contour
  ctx.stroke();

  // Dessine le contour inférieur de l'œil
  ctx.beginPath();
  ctx.moveTo(startX, y); // Re-commence à gauche
  ctx.quadraticCurveTo(x, y + 20, endX, y); // Courbe inférieure
  ctx.strokeStyle = "black"; // Assurez-vous de définir la couleur de contour
  ctx.stroke();

  // Dessine l'iris
  ctx.beginPath();
  ctx.arc(x, y, 7.5, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();

  // Dessine la pupille
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
    // Code qui s'exécute seulement côté client
  if (obj.hideRoot) {
    ctx.beginPath();
    ctx.moveTo(startX, y + 20);
    ctx.lineTo(endX, y - 20);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  ctx.restore(); // Restaure l'état initial du contexte
}




function drawMagicWand(ctx: CanvasRenderingContext2D, obj: any) {
  let startX = obj.x + 290;
  let startY = obj.y;
  let color = "black";
  let length = 30;
  ctx.save();
  ctx.translate(startX + length / 2, startY + length / 2);
  ctx.rotate(Math.PI / 4);
  ctx.translate(-(startX + length / 2), -(startY + length / 2));

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX, startY - length);
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.stroke();

  // Dessine l'étoile à l'extrémité de la baguette
  drawStar(ctx, startX, startY - length, 7, 10, 4, color);

  ctx.restore(); // Restaure les transformations
};

const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  color: string
) => {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

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



const drawLoadingCircle2 = (ctx: CanvasRenderingContext2D, posX: number, labelPosY: number, num: number, circleRadius: number) => {
  const startAngle = -0.5 * Math.PI;
  let endAngle = startAngle;

  if (num > 0 && num <= 6) {
      endAngle = startAngle + (2 * Math.PI * (num / 6));
  }
  ctx.beginPath();
  ctx.arc(posX + (num + 1) * 45, labelPosY + 20, circleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  if (num > 0 && num <= 6) {
      ctx.beginPath();
      ctx.moveTo(posX + (num + 1) * 45, labelPosY + 20); 
      ctx.arc(posX + (num + 1) * 45, labelPosY + 20, circleRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = '#1EC07C';
      ctx.fill();
  }
  if (num == 6) {
      ctx.beginPath();
      ctx.moveTo(posX + (num + 1) * 45 - 9, labelPosY + 20);
      ctx.lineTo(posX + (num + 1) * 45 - 2, labelPosY + 25);
      ctx.lineTo(posX + (num + 1) * 45 + 8, labelPosY + 10);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 5;
      ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(posX + (num + 1) * 45, labelPosY + 20, circleRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#1EC07C';
  ctx.lineWidth = 2;
  ctx.stroke();
};



function drawLoadingCircle(ctx: CanvasRenderingContext2D, posX: number, labelPosY: number, num: number, circleRadius: number) {
  const startAngle = -0.5 * Math.PI;
  let endAngle = startAngle;

  if (num > 0 && num <= 6) {
      endAngle = startAngle + (2 * Math.PI * (num / 6));
  }
  ctx.beginPath();
  ctx.arc(posX + (num + 1) * 45, labelPosY + 20, circleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  if (num > 0 && num <= 6) {
      ctx.beginPath();
      ctx.moveTo(posX + (num + 1) * 45, labelPosY + 20); 
      ctx.arc(posX + (num + 1) * 45, labelPosY + 20, circleRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = '#1EC07C';
      ctx.fill();
  }
  if (num == 6) {
    ctx.beginPath();
    ctx.moveTo(posX + (num + 1) * 45 - 9, labelPosY + 20);
    ctx.lineTo(posX + (num + 1) * 45-2, labelPosY + 25);
    ctx.lineTo(posX + (num + 1) * 45 + 8, labelPosY + 10);
    // ctx.moveTo(posX + (num + 1) * 45 - 10, labelPosY + 30);
    // ctx.lineTo(posX + (num + 1) * 45, labelPosY + 20);
    // ctx.lineTo(posX + (num + 1) * 45 + 10, labelPosY + 30);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke();
}



  ctx.beginPath();
  ctx.arc(posX + (num + 1) * 45, labelPosY + 20, circleRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#1EC07C';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawFlag(ctx: CanvasRenderingContext2D, x:number, y:number, size:number) {
  const flagHeight = size * 0.9;
  const flagWidth = size * 0.9;
  const poleHeight = size * 2;
  const poleWidth = size * 0.4;
  ctx.fillStyle = "white";
  ctx.fillRect(x - poleWidth / 2, y - size, poleWidth, poleHeight);
  ctx.fillRect(x, y - size, flagWidth, flagHeight);
  ctx.fillRect(x + size * 0.5, y - size / 1.6, flagWidth * 0.8, flagHeight * 0.8);
}

function Pistache(ctx: CanvasRenderingContext2D, obj:any, caseWidth:number, caseHeight:number) {
  console.log("ok dans pistache pour obj = ", obj.value);
  let posX = obj.x + caseWidth + 20;
  let posY = obj.y - 100;
  const cornerRadius = 20;
  ctx.beginPath();
  ctx.moveTo(posX + cornerRadius, posY);
  ctx.lineTo(posX + caseWidth - cornerRadius, posY);
  ctx.arc(posX + caseWidth - cornerRadius, posY + cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
  ctx.lineTo(posX + caseWidth, posY + caseHeight - cornerRadius);
  ctx.arc(posX + caseWidth - cornerRadius, posY + caseHeight - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
  ctx.lineTo(posX + cornerRadius, posY + caseHeight);
  ctx.arc(posX + cornerRadius, posY + caseHeight - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
  ctx.lineTo(posX, posY + cornerRadius);
  ctx.arc(posX + cornerRadius, posY + cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.stroke();
  const labels = ["Etiquette", "Priorité", "Tâche", "Drapeau"];
  const colors = ["#FF9E43","#FF4748","#F1C700","#1EC07C","#577CFF","#6B4BCD","#9D9DA0"];
  const circleRadius = 15;
  labels.forEach((label, index) => {
    const labelPosY = posY - 15 + (index + 0.5) * (caseHeight / labels.length);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(label, posX + 10, labelPosY);
    colors.forEach((color, num) => {
      ctx.beginPath();
      if (index != 2) ctx.arc(posX + (num + 1) * 45, labelPosY + 20, circleRadius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.stroke();
      if (index == 1){
        ctx.font = "bold 26px Arial";
        ctx.fillStyle = "white"; // Ensure text color is black
        ctx.fillText(`${num + 1}`, posX-7 + (num + 1) * 45, labelPosY + 30);
      }
      if (index === 2) drawLoadingCircle(ctx,posX, labelPosY, num, circleRadius)
      if (index === 3) drawFlag(ctx, posX - 2 + (num + 1) * 45, labelPosY + 20, circleRadius - 5);
    });
  });
  
}


function DrawTab(ctx: CanvasRenderingContext2D, tab: Array<any>, zoom: number) {
  if (!Array.isArray(tab)) {
    return;
  }

  let caseWidth = 350;
  let caseHeight = 100;
  tab.forEach((obj) => {
    DrawSquare(ctx, obj, caseWidth, caseHeight);
    DrawBubble(ctx, obj, caseWidth, caseHeight, zoom);
  });
  ParseLine(ctx, tab, caseWidth, caseHeight);
  tab.forEach((obj) => {
    if (obj.isPistache) Pistache(ctx, obj, caseWidth, caseHeight + 200);
  });
}

export default DrawTab;
