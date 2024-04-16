
export default function eyeShape(ctx: CanvasRenderingContext2D, obj: any) {
    ctx.save(); // Sauvegarde l'état actuel du contexte
  
    const x = obj.x + 40;
    const y = obj.y - 20;
  
    const startX = x - 20; // Début de la courbe à gauche
    const endX = x + 20; // Fin de la courbe à droite
  
    // Dessine le contour supérieur de l'œil
    ctx.beginPath();
    ctx.moveTo(startX, y); // Commence à gauche
    ctx.quadraticCurveTo(x, y - 20, endX, y); // Courbe supérieure
    ctx.strokeStyle = "black"; // Assurez-vous de définir la couleur de contour
    ctx.stroke();
  
    // Dessine le contour inférieur de l'œil
    ctx.beginPath();
    ctx.moveTo(startX, y); // Re-commence à gauche
    ctx.quadraticCurveTo(x, y + 20, endX, y); // Courbe inférieure
    ctx.strokeStyle = "black"; // Assurez-vous de définir la couleur de contour
    ctx.stroke();
  
    // Dessine l'iris
    ctx.beginPath();
    ctx.arc(x, y, 7.5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
  
    // Dessine la pupille
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();
  
    if (obj.hideRoot) {
      ctx.beginPath();
      ctx.moveTo(startX, y + 20);
      ctx.lineTo(endX, y - 20);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  
    ctx.restore(); // Restaure l'état initial du contexte
  }