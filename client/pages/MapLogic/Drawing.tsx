interface DrawPoint {
  x: number;
  y: number;
}

const traverseAndDraw = (
  obj: any,
  ctx: CanvasRenderingContext2D,
  midBranch: number,
  deltaX: number
) => {



  const drawLine = (
    ctx: CanvasRenderingContext2D,
    start: DrawPoint,
    end: DrawPoint
  ) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
  };

  const drawSquare = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    label2: string
  ) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(x * 550, y * 160, 350, 100);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(label, x * 550, y * 160 + 30);
    ctx.fillText(label2, x * 550, y * 160 + 60);
  };
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      if (typeof val === "object" && val !== null) {
        if ("x" in val && "y" in val) {
          const label = `x: ${val.x}, y: ${val.y}`;

          let label2 = "";
          if ("value" in val) {
            label2 = `branch: ${val.branch}, value: ${val.value}`;
          } else if ("titre" in val) {
            label2 = `branch: ${val.branch}, titre: ${val.titre}`;
          } else if ("Bloc" in val) {
            label2 = `branch: ${val.branch}, Bloc: ${val.Bloc}`;
          } else label2 = `none`;
          if (val.branch >= midBranch)
          {
            drawSquare(ctx, -val.y, val.x - deltaX, label, label2);
            // drawLine(
            //   ctx,
            //   { x: val.x * 350, y: val.y * 100 },
            //   { x: val.x * 350 + 300, y: val.y * 100 + 100 }
            // );
          }
            // logique pour dessin a gauche
          else drawSquare(ctx, val.y, val.x, label, label2);
          console.log(`okk avec x= ${val.x}`);
          // drawLine(
          //   ctx,
          //   { x: val.x * 350, y: val.y * 100 },
          //   { x: val.x * 350 + 300, y: val.y * 100 + 100 }
          // );
        }
        traverseAndDraw(val, ctx, midBranch, deltaX);
      }
    }
  }
};

export default traverseAndDraw;
