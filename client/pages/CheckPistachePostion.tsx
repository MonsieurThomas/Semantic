
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
    if (adjustedX >= obj.x + 3950 && adjustedX <= obj.x + 4350)
    obj.pistacheNum = 1
    else if (adjustedX >= obj.x + 4400 && adjustedX <= obj.x + 4750)
    obj.pistacheNum = 2
    else if (adjustedX >= obj.x + 4900 && adjustedX <= obj.x + 5200)
    obj.pistacheNum = 3
    else if (adjustedX >= obj.x + 5300 && adjustedX <= obj.x + 5750)
    obj.pistacheNum = 4
    else if (adjustedX >= obj.x + 5800 && adjustedX <= obj.x + 6100)
    obj.pistacheNum = 5
    else if (adjustedX >= obj.x + 6250 && adjustedX <= obj.x + 6550)
    obj.pistacheNum = 6
    else if (adjustedX >= obj.x + 6700 && adjustedX <= obj.x + 7000)
    obj.pistacheNum = 7

}

function CheckColor (adjustedX:number, obj:any)
{
    console.log("adjustedY dans check color pour ", obj.pistacheType)

    if (adjustedX >= obj.x + 3950 && adjustedX <= obj.x + 4350)
        obj.pistacheColor = "#FF9E43" // #FF9E43
    if (adjustedX >= obj.x + 4400 && adjustedX <= obj.x + 4750)
        obj.pistacheColor = "#FF4748" //orange
    else if (adjustedX >= obj.x + 4900 && adjustedX <= obj.x + 5200)
        obj.pistacheColor = "#F1C700" //jaune
    else if (adjustedX >= obj.x + 5300 && adjustedX <= obj.x + 5750)
        obj.pistacheColor = "#1EC07C" // vert
    else if (adjustedX >= obj.x + 5800 && adjustedX <= obj.x + 6100)
        obj.pistacheColor = "#577CFF" // bleue
    else if (adjustedX >= obj.x + 6250 && adjustedX <= obj.x + 6550)
        obj.pistacheColor = "#6B4BCD" // violet
    else if (adjustedX >= obj.x + 6700 && adjustedX <= obj.x + 7000)
        obj.pistacheColor = "#9D9DA0" // gris
}

function CheckPistachePosition(obj:any, adjustedX:number, adjustedY:number, pistacheTab:any) {
    // console.log("adjustedY", adjustedY)
    if (adjustedY >= obj.y - 800 && adjustedY <= obj.y - 250) {
      CheckColor(adjustedX, obj);
      obj.pistacheType = "etiquette";
    } else if (adjustedY >= obj.y - 50 && adjustedY <= obj.y + 350) {
      CheckColor(adjustedX, obj);
      obj.pistacheType = "priorité";
      CheckNum(adjustedX, obj);
    } else if (adjustedY >= obj.y + 800 && adjustedY <= obj.y + 1100) {
      CheckColor(adjustedX, obj);
      obj.pistacheType = "tache";
      CheckNum(adjustedX, obj);
      console.log("pistacheNum = ", obj.pistacheNum)
      obj.pistacheColor = "#1EC07C" 
    } else if (adjustedY >= obj.y + 1500 && adjustedY <= obj.y + 1900) {
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