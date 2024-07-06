function DrawLine(
  ctx: CanvasRenderingContext2D,
  obj: any,
  obj2: any,
  caseWidth: number,
  caseHeight: number
) {
  let cornerRadius = 200;

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
    ctx.lineWidth = 60;
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
    ctx.lineWidth = 60;
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

function wrapText(ctx: CanvasRenderingContext2D, obj: any, boxWidth: number) {
  const boxHeight = 1500;
  const words = obj.value.split(" ");
  let fontSize = "380px";
  let lineHeight = 350;
  ctx.font =
    obj.path.length < 3 ? `bold ${fontSize} Lexend` : `${fontSize} Lexend`;

  let lines: string[] = [];
  let line = "";
  let boxX = obj.x;
  let boxY = obj.y + 5;

  if (obj.branch == 0) {
    boxX -= 500;
    ctx.font = `bold 500px Lexend`;
    lineHeight = 550;
  }

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > boxWidth) {
      lines.push(line.trim());
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }

  if (line.trim().length > 0) {
    lines.push(line.trim());
  }

  if (lines.length > 2) {
    lines = lines.slice(0, 2);
    while (ctx.measureText(lines[1] + "...").width > boxWidth) {
      lines[1] = lines[1].slice(0, -1);
    }
    lines[1] = lines[1].trim() + "...";
  }

  const totalTextHeight = lines.length * lineHeight;
  let startY = boxY + (boxHeight - totalTextHeight) / 2;

  lines.forEach((ln) => {
    const lineWidth = ctx.measureText(ln).width;
    const startX = boxX + (boxWidth - lineWidth) / 2;
    ctx.fillText(ln, startX, startY);
    startY += lineHeight;
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
  const cornerRadius = 160;
  if (obj.branch == 0) {
    posX = obj.x - 500;
    posY = obj.y - 500;
    caseWidth += 1000;
    caseHeight += 1000;
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
  ctx.save();

  // const calculatedOpacity = (10 - (Math.abs(obj.x / caseWidth) - 1) * 0.95) / 10;
  const calculatedOpacity = 1 - (obj.path.length - 0.5) / 10;
  // console.log("Math.abs(obj.x / caseWidth = ", Math.abs(obj.x / caseWidth), " for ", obj.value);
  const opacity = Math.max(calculatedOpacity, 0.1);
  // console.log("opacity = ", opacity, " for ", obj.value);

  ctx.globalAlpha = opacity;

  ctx.fillStyle = obj.color;
  ctx.fill();
  ctx.restore();

  if (obj.path.length <= 3) ctx.fillStyle = "white";
  else ctx.fillStyle = "black";
  if (obj.branch == 0) ctx.font = "80px Lexend";
  wrapText(ctx, obj, caseWidth); // affichage texte
  if (obj.hover && obj.branch != 0 && !obj.bounding) eyeShape(ctx, obj);
  if (obj.hover && obj.branch != 0) drawMagicWand(ctx, obj);
  if (obj.pistacheColor) {
    // pistache part
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(obj.x + 3400, obj.y, 200, 0, 2 * Math.PI);
    ctx.fillStyle = obj.pistacheColor;
    ctx.fill();
    if (obj.pistacheType == "flag") {
      drawFlag(ctx, obj.x + 3380, obj.y, 140);
      ctx.strokeStyle = obj.pistacheColor;
    } else if (obj.pistacheType == "priorité") {
      ctx.fillStyle = "white";
      ctx.fillText(`${obj.pistacheNum}`, obj.x + 3300, obj.y + 120);
      ctx.strokeStyle = obj.pistacheColor;
    } else if (obj.pistacheType == "tache") {
      drawLoadingCircle(
        ctx,
        obj.x + 3400,
        obj.y - 200,
        obj.pistacheNum - 1,
        200
      );
      ctx.strokeStyle = "#1EC07C";
    } else if (obj.pistacheType == "etiquette") {
      ctx.strokeStyle = obj.pistacheColor;
    }
    ctx.stroke();
  }
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
      // red
      ctx.moveTo(obj.x + 3800, obj.y + caseHeight);
      ctx.quadraticCurveTo(
        obj.x + obj2.x,
        obj.y + (obj2.y - obj.y),
        obj2.x + 100,
        obj2.y + caseHeight / 2
      );
    } else {
      ctx.moveTo(obj.x + 3800, obj.y);
      ctx.quadraticCurveTo(
        obj.x + caseWidth,
        obj.y,
        obj2.x + 100,
        obj2.y + caseHeight - 400
      );
    }
    ctx.strokeStyle = obj2.color;
    ctx.lineWidth = 120;
    ctx.stroke();
  } else {
    // ctx.beginPath();
    if (obj2.y > obj.y) {
      ctx.moveTo(obj.x + 500, obj.y + caseHeight + 400);
      ctx.quadraticCurveTo(
        obj.x + obj2.x / 2,
        obj.y + (obj2.y - obj.y),
        obj2.x + caseWidth - 100,
        obj2.y + caseHeight / 2
      );
    } else {
      ctx.moveTo(obj.x + 500, obj.y - 400);
      ctx.quadraticCurveTo(
        obj.x + obj2.x / 2,
        obj.y - (obj.y - obj2.y),
        obj2.x + caseWidth - 100,
        obj2.y + caseHeight / 2
      );
    }
    ctx.strokeStyle = obj2.color;
    ctx.lineWidth = 120;

    ctx.stroke();
  }
}

function eyeShape(ctx: CanvasRenderingContext2D, obj: any) {
  ctx.save();

  const x = obj.x + 360;
  const y = obj.y - 160;

  const startX = x - 180;
  const endX = x + 180;

  ctx.beginPath();
  ctx.lineWidth = 9;
  ctx.moveTo(startX, y);
  ctx.quadraticCurveTo(x, y - 180, endX, y);
  ctx.strokeStyle = "black";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.quadraticCurveTo(x, y + 180, endX, y);
  ctx.strokeStyle = "black";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, 68, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, 36, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();

  if (obj.hideRoot) {
    ctx.beginPath();
    ctx.moveTo(startX, y + 180);
    ctx.lineTo(endX, y - 180);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 27;
    ctx.stroke();
  }

  ctx.restore();
}

function drawMagicWand(ctx: CanvasRenderingContext2D, obj: any) {
  let startX = obj.x + 2950;
  let startY = obj.y + 20;
  let color = "black";
  let length = 240;
  ctx.save();
  ctx.translate(startX + length / 2, startY + length / 2);
  ctx.rotate(Math.PI / 4);
  ctx.translate(-(startX + length / 2), -(startY + length / 2));

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX, startY - length);
  ctx.strokeStyle = color;
  ctx.lineWidth = 35;
  ctx.stroke();
  drawStar(ctx, startX, startY - length, 7, 70, 30, color);
  ctx.restore();
}

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
  ctx.lineWidth = 10;

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

function DrawBubble(ctx: CanvasRenderingContext2D, obj: any, zoom: number) {
  ctx.save();

  if (Array.isArray(obj.bounding) && obj.bounding.length > 0) {
    if (obj.hide) return;
    if (zoom > 50) {
      let opacity = (zoom - 50) / 50;
      // let opacity = (99/70) * zoom - 41.3;
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      if (obj.x < 0)
        ctx.arc(obj.x - 600, obj.y + 500, 300, 0, 2 * Math.PI, false);
      else ctx.arc(obj.x + 4100, obj.y + 500, 300, 0, 2 * Math.PI, false);
      const opacityfill = Math.min(opacity, 0.05);
      // console.log("opacity = ", opacity, " for ", obj.value);
      ctx.globalAlpha = opacityfill;
      ctx.fillStyle = obj.color;
      ctx.fill();
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 44;
      ctx.strokeStyle = obj.color;
      ctx.stroke();

      ctx.fillStyle = obj.color;
      ctx.font = "450px Lexend";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (obj.x < 0) {
        ctx.fillText(obj.bounding.length.toString(), obj.x - 600, obj.y + 515);
      } else {
        ctx.fillText(obj.bounding.length.toString(), obj.x + 4100, obj.y + 515);
      }
    }
  }
  ctx.restore();
}

function drawLoadingCircle(
  ctx: CanvasRenderingContext2D,
  posX: number,
  labelPosY: number,
  num: number,
  circleRadius: number
) {
  const startAngle = -0.5 * Math.PI;
  let endAngle = startAngle;

  if (num > 0 && num <= 6) {
    endAngle = startAngle + 2 * Math.PI * (num / 6);
  }
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.arc(posX, labelPosY + 200, circleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();

  if (num > 0 && num <= 6) {
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.moveTo(posX, labelPosY + 200);
    ctx.arc(posX, labelPosY + 200, circleRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = "#1EC07C";
    ctx.fill();
  }
  if (num == 6) {
    ctx.beginPath();
    ctx.moveTo(posX - 90, labelPosY + 200);
    ctx.lineTo(posX - 20, labelPosY + 250);
    ctx.lineTo(posX + 80, labelPosY + 100);
    // ctx.moveTo(posX + (num + 1) * 45 - 10, labelPosY + 30);
    // ctx.lineTo(posX + (num + 1) * 45, labelPosY + 20);
    // ctx.lineTo(posX + (num + 1) * 45 + 10, labelPosY + 30);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 50;
    ctx.fill();
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(posX, labelPosY + 200, circleRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#1EC07C";
  ctx.lineWidth = 20;
  ctx.stroke();
}

function drawFlag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const flagHeight = size * 0.9;
  const flagWidth = size * 0.9;
  const poleHeight = size * 2;
  const poleWidth = size * 0.4;
  ctx.fillStyle = "white";
  ctx.fillRect(x - poleWidth / 2, y - size, poleWidth, poleHeight);
  ctx.fillRect(x, y - size, flagWidth, flagHeight);
  ctx.fillRect(
    x + size * 0.5,
    y - size / 1.4,
    flagWidth * 0.8,
    flagHeight * 0.8
  );
}

function Pistache(
  ctx: CanvasRenderingContext2D,
  obj: any,
  caseWidth: number,
  caseHeight: number
) {
  // console.log("ok dans pistache pour obj = ", obj.value);
  let posX = obj.x + caseWidth + 200;
  let posY = obj.y - 1000;
  const cornerRadius = 200;
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
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.stroke();
  const labels = ["Etiquette", "Priorité", "Tâche", "Drapeau"];
  const colors = [
    "#FF9E43",
    "#FF4748",
    "#F1C700",
    "#1EC07C",
    "#577CFF",
    "#6B4BCD",
    "#9D9DA0",
  ];
  const circleRadius = 150;
  labels.forEach((label, index) => {
    const labelPosY = posY - 3500 + (index + 5) * (caseHeight / labels.length);
    ctx.fillStyle = "black";
    ctx.font = "160px Lexend";
    ctx.fillText(label, posX + 100, labelPosY);
    colors.forEach((color, num) => {
      ctx.beginPath();
      if (index != 2)
        ctx.arc(
          posX + (num + 1) * 450,
          labelPosY + 280,
          circleRadius,
          0,
          2 * Math.PI
        );
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.stroke();
      if (index == 1) {
        ctx.font = "bold 260px Lexend";
        ctx.fillStyle = "white"; // Ensure text color is black
        ctx.fillText(
          `${num + 1}`,
          posX - 70 + (num + 1) * 450,
          labelPosY + 380
        );
      }
      if (index === 2)
        drawLoadingCircle(
          ctx,
          posX - 20 + (num + 1) * 450,
          labelPosY + 80,
          num,
          circleRadius + 10
        );
      if (index === 3)
        drawFlag(
          ctx,
          posX - 20 + (num + 1) * 450,
          labelPosY + 300,
          circleRadius - 50
        );
    });
  });
}

function DrawTab(ctx: CanvasRenderingContext2D, tab: Array<any>, zoom: number) {
  if (!Array.isArray(tab)) {
    return;
  }

  let caseWidth = 3500;
  let caseHeight = 1000;
  ParseLine(ctx, tab, caseWidth, caseHeight);
  tab.forEach((obj) => {
    DrawSquare(ctx, obj, caseWidth, caseHeight);
    DrawBubble(ctx, obj, zoom);
  });
  tab.forEach((obj) => {
    if (obj.isPistache) Pistache(ctx, obj, caseWidth, caseHeight + 2000);
  });
}

export default DrawTab;
