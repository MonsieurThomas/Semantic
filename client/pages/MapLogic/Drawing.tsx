interface DrawPoint {
  x: number;
  y: number;
}

const traverseAndDraw = (
  obj: any,
  ctx: CanvasRenderingContext2D,
  midBranch: number,
  deltaX: number,
  parentPos: DrawPoint
): void => {
  const drawLine = (
    ctx: CanvasRenderingContext2D,
    start: DrawPoint,
    end: DrawPoint
  ) => {
    const midX = (start.x + end.x) / 2;
    ctx.beginPath();
    ctx.moveTo(start.x + 350, start.y);
    ctx.lineTo(midX, start.y);
    ctx.lineTo(midX, end.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = "black";

    ctx.stroke();
  };

  const drawLineInverse = (
    ctx: CanvasRenderingContext2D,
    start: DrawPoint,
    end: DrawPoint
  ) => {
    const midX = (start.x + (end.x + 350)) / 2;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(midX, start.y);
    ctx.lineTo(midX, end.y);
    ctx.lineTo(end.x + 350, end.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
  };

  const drawSquare = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    label2: string,
    color: string
  ) => {
    const posX = x * 550;
    const posY = y * 160;
    ctx.fillStyle = color;
    ctx.fillRect(posX, posY, 350, 100);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(label, posX + 10, posY + 40);
    ctx.fillText(label2, posX + 10, posY + 70);
    return { x: posX, y: posY + 50 };
  };

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let val = obj[key];
      if (typeof val === "object" && val !== null) {
        let tmpVal = null;
        if (!val.x) {
          tmpVal = val;
          val = val.value;
        }

        const adjustedY = val.branch >= midBranch ? -val.y : val.y;
        const adjustedX = val.branch >= midBranch ? val.x - deltaX : val.x;
        const currentPos = drawSquare(
          ctx,
          adjustedY,
          adjustedX,
          `x: ${val.x}, y: ${val.y}`,
          `branch: ${val.branch}`,
          val.color
        );
        if (val.branch != 0 && val.branch < midBranch)
          drawLine(ctx, parentPos, currentPos);
        if (val.branch != 0 && val.branch >= midBranch)
          drawLineInverse(ctx, parentPos, currentPos);
        if (tmpVal) traverseAndDraw(tmpVal, ctx, midBranch, deltaX, currentPos);
        else traverseAndDraw(val, ctx, midBranch, deltaX, currentPos);
      }
    }
  }
};

export default traverseAndDraw;
