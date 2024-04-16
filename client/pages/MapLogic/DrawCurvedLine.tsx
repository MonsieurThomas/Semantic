export default function DrawCurveLine(
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
      ctx.beginPath();
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
  