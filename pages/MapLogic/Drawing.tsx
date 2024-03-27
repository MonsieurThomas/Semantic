const traverseAndDraw = (obj: any, ctx: CanvasRenderingContext2D) => {
  const drawSquare = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string
  ) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(x + x * 100, y + y * 50, 200, 100);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
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
};

export default traverseAndDraw;
