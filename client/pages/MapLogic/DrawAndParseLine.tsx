import DrawCurveLine from "./DrawCurvedLine";

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
  
 export default function ParseLine(
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