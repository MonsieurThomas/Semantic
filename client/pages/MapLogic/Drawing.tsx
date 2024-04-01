const traverseAndDraw = (obj: any, ctx: CanvasRenderingContext2D) => {
  const drawSquare = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    label2: string
  ) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(x + x * 250, y + y * 50, 500, 100);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(label, x + x * 250 + 10, y + y * 50 + 30);
    ctx.fillText(label2, x + x * 250 + 10, y + y * 50 + 60);
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
          }
          drawSquare(ctx, val.y * 2, val.x * 2, label, label2); // inverser
        }
        traverseAndDraw(val, ctx);
      }
    }
  }
};

export default traverseAndDraw;
