export default function drawMagicWand(ctx: CanvasRenderingContext2D, obj: any) {
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