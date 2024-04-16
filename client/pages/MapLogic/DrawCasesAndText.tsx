import eyeShape from "./DrawEyeShape";
import drawMagicWand from "./DrawMagicWand";

function wrapText(
    ctx: CanvasRenderingContext2D,
    obj: any,
    boxWidth: number,
    lineHeight: number
  ) {
    const words = obj.value.split(" ");
    let lines = [];
    let line = "";
    let totalHeight = 0;
    let boxX = obj.x;
    let boxY = obj.y + 5;
    if (obj.branch == 0) boxX -= 50;
  
    // Pré-calculer les lignes pour déterminer la hauteur totale
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > boxWidth && i > 0) {
        lines.push(line);
        line = words[i] + " ";
        totalHeight += lineHeight;
        if (lines.length === 3) {
          break;
        }
      } else {
        line = testLine;
      }
    }
    if (lines.length < 3) {
      lines.push(line); // Ajoute la dernière ligne si moins de trois
    } else {
      lines[2] = line.trim() + "..."; // Tronque et ajoute "..." à la troisième ligne
    }
    let startY = boxY + lineHeight;
    // Dessiner les lignes centrées horizontalement jusqu'à un maximum de trois
    lines.forEach((ln, index) => {
      if (index < 3) {
        // Dessine seulement les trois premières lignes
        const lineWidth = ctx.measureText(ln).width;
        const startX = boxX + (boxWidth - lineWidth) / 2;
        ctx.fillText(ln, startX, startY);
        startY += lineHeight; // Ajouter l'écart augmenté entre les lignes
      }
    });
  }
  
  export default function DrawSquare(
    ctx: CanvasRenderingContext2D,
    obj: any,
    caseWidth: number,
    caseHeight: number
  ) {
    if (obj.hide) return;
  
    let posX = obj.x;
    let posY = obj.y;
    const cornerRadius = 20;
    if (obj.branch == 0) {
      posX = obj.x - 50;
      posY = obj.y - 50;
      caseWidth += 100;
      caseHeight += 100;
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
  
    const calculatedOpacity = (10 - (Math.abs(obj.x / caseWidth) - 1) * 1.5) / 10;
    const opacity = Math.max(calculatedOpacity, 0.5);
    ctx.globalAlpha = opacity;
  
    ctx.fillStyle = obj.color;
    ctx.fill();
    if (obj.path.length < 3) ctx.fillStyle = "white";
    else ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    if (obj.branch == 0) ctx.font = "50px Arial";
    if (obj.hover && obj.branch != 0) eyeShape(ctx, obj);
    if (obj.hover && obj.branch != 0) drawMagicWand(ctx, obj);
    wrapText(ctx, obj, caseWidth, 27);
  }