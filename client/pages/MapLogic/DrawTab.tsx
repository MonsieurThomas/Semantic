import ParseLine from "./DrawAndParseLine";
import DrawSquare from "./DrawCasesAndText";
import DrawBubble from "./DrawOccurencesBubble";

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
