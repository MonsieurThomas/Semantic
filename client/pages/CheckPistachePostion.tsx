
function updatePistacheTab(obj: any, pistacheTab: any) {
    if (!Array.isArray(pistacheTab)) {
        console.error("Invalid pistacheTab: Expected an array", pistacheTab);
        return []; // Return an empty array or the existing pistacheTab as appropriate
    }

    const index = pistacheTab.findIndex((item: any) => item.value === obj.value);
    const newPistacheTab = [...pistacheTab];

    if (index !== -1) {
        // Check if updates are necessary
        if (newPistacheTab[index].pistacheColor !== obj.pistacheColor || newPistacheTab[index].pistacheType !== obj.pistacheType) {
            newPistacheTab[index] = {...newPistacheTab[index], ...obj};
        }
    } else {
        // Add the new item if not found
        newPistacheTab.push(obj);
    }

    return newPistacheTab;
}

  


function CheckNum (adjustedX:number, obj:any)
{
    if (adjustedX >= obj.x + 395 && adjustedX <= obj.x + 435)
    obj.pistacheNum = 1
    else if (adjustedX >= obj.x + 440 && adjustedX <= obj.x + 475)
    obj.pistacheNum = 2
    else if (adjustedX >= obj.x + 490 && adjustedX <= obj.x + 520)
    obj.pistacheNum = 3
    else if (adjustedX >= obj.x + 530 && adjustedX <= obj.x + 575)
    obj.pistacheNum = 4
    else if (adjustedX >= obj.x + 580 && adjustedX <= obj.x + 610)
    obj.pistacheNum = 5
    else if (adjustedX >= obj.x + 625 && adjustedX <= obj.x + 655)
    obj.pistacheNum = 6
    else if (adjustedX >= obj.x + 670 && adjustedX <= obj.x + 700)
    obj.pistacheNum = 7

}

function CheckColor (adjustedX:number, obj:any)
{
    if (adjustedX >= obj.x + 395 && adjustedX <= obj.x + 435)
        obj.pistacheColor = "#FF9E43" // #FF9E43
    if (adjustedX >= obj.x + 440 && adjustedX <= obj.x + 475)
        obj.pistacheColor = "#FF4748" //orange
    else if (adjustedX >= obj.x + 490 && adjustedX <= obj.x + 520)
        obj.pistacheColor = "#F1C700" //jaune
    else if (adjustedX >= obj.x + 530 && adjustedX <= obj.x + 575)
        obj.pistacheColor = "#1EC07C" // vert
    else if (adjustedX >= obj.x + 580 && adjustedX <= obj.x + 610)
        obj.pistacheColor = "#577CFF" // bleue
    else if (adjustedX >= obj.x + 625 && adjustedX <= obj.x + 655)
        obj.pistacheColor = "#6B4BCD" // violet
    else if (adjustedX >= obj.x + 670 && adjustedX <= obj.x + 700)
        obj.pistacheColor = "#9D9DA0" // gris
}

function CheckPistachePosition(obj:any, adjustedX:number, adjustedY:number, pistacheTab:any) {
    if (adjustedY >= obj.y - 80 && adjustedY <= obj.y - 40) {
      CheckColor(adjustedX, obj);
      obj.pistacheType = "etiquette";
    } else if (adjustedY >= obj.y - 5 && adjustedY <= obj.y + 35) {
      CheckColor(adjustedX, obj);
      obj.pistacheType = "priorité";
      CheckNum(adjustedX, obj);
    } else if (adjustedY >= obj.y + 80 && adjustedY <= obj.y + 110) {
      CheckColor(adjustedX, obj);
      obj.pistacheType = "tache";
      CheckNum(adjustedX, obj);
      obj.pistacheColor = "#1EC07C" 
    } else if (adjustedY >= obj.y + 150 && adjustedY <= obj.y + 190) {
      CheckColor(adjustedX, obj);
      obj.pistacheType = "flag";
    } else {
      console.log("No matching position found");
    }
    obj.isPistache = false;
    return updatePistacheTab(obj, pistacheTab);
  }
  

export default CheckPistachePosition
///////