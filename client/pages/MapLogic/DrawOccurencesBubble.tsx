export default function DrawBubble(
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