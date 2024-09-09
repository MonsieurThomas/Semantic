function updatePistacheTab(obj: any, pistacheTab: any) {
    // console.log("Passage dans updatePistacheTab")
  if (!Array.isArray(pistacheTab)) {
    console.error("Invalid pistacheTab: Expected an array", pistacheTab);
    return []; // Return an empty array or the existing pistacheTab as appropriate
  }

  const index = pistacheTab.findIndex((item: any) => item.value === obj.value);
  const newPistacheTab = [...pistacheTab];

  if (index !== -1) {
    // Check if updates are necessary
    if (
      newPistacheTab[index].pistacheColor !== obj.pistacheColor ||
      newPistacheTab[index].pistacheType !== obj.pistacheType
    ) {
      newPistacheTab[index] = { ...newPistacheTab[index], ...obj };
    }
  } else {
    // Add the new item if not found
    newPistacheTab.push(obj);
  }

  return newPistacheTab;
}

function CheckNum(adjustedX: number, obj: any) {
  if (adjustedX >= obj.x + 5300 && adjustedX <= obj.x + 5600)
    obj.pistacheNum = 1;
  else if (adjustedX >= obj.x + 5750 && adjustedX <= obj.x + 6050)
    obj.pistacheNum = 2;
  else if (adjustedX >= obj.x + 6200 && adjustedX <= obj.x + 6500)
    obj.pistacheNum = 3;
  else if (adjustedX >= obj.x + 6650 && adjustedX <= obj.x + 6950)
    obj.pistacheNum = 4;
  else if (adjustedX >= obj.x + 7100 && adjustedX <= obj.x + 7400)
    obj.pistacheNum = 5;
  else if (adjustedX >= obj.x + 7550 && adjustedX <= obj.x + 7850)
    obj.pistacheNum = 6;
  else if (adjustedX >= obj.x + 8000 && adjustedX <= obj.x + 8300)
    obj.pistacheNum = 7;
}

function CheckColor(adjustedX: number, obj: any) {
  //   console.log("adjustedY dans check color pour ", obj.pistacheType);

  if (adjustedX >= obj.x + 5300 && adjustedX <= obj.x + 5600)
    obj.pistacheColor = "#FF9E43"; // #FF9E43
  else if (adjustedX >= obj.x + 5750 && adjustedX <= obj.x + 6050)
    obj.pistacheColor = "#FF4748"; //orange
  else if (adjustedX >= obj.x + 6200 && adjustedX <= obj.x + 6500)
    obj.pistacheColor = "#F1C700"; //jaune
  else if (adjustedX >= obj.x + 6650 && adjustedX <= obj.x + 6950)
    obj.pistacheColor = "#1EC07C"; // vert
  else if (adjustedX >= obj.x + 7100 && adjustedX <= obj.x + 7400)
    obj.pistacheColor = "#577CFF"; // bleue
  else if (adjustedX >= obj.x + 7550 && adjustedX <= obj.x + 7850)
    obj.pistacheColor = "#6B4BCD"; // violet
  else if (adjustedX >= obj.x + 8000 && adjustedX <= obj.x + 8300)
    obj.pistacheColor = "#9D9DA0"; // gris
}

function CheckPistachePosition(
  obj: any,
  adjustedX: number,
  adjustedY: number,
  pistacheTab: any,
  caseWidth: number,
  caseHeight: number
) {
  //   console.log("adjustedY", adjustedY)
  if (adjustedY >= obj.y - 650 && adjustedY <= obj.y - 300) {
    obj.pistacheType = "etiquette";
    CheckColor(adjustedX, obj);
    CheckNum(adjustedX, obj);
  } else if (adjustedY >= obj.y + 100 && adjustedY <= obj.y + 450) {
    CheckColor(adjustedX, obj);
    obj.pistacheType = "priorité";
    CheckNum(adjustedX, obj);
  } else if (adjustedY >= obj.y + 850 && adjustedY <= obj.y + 1200) {
    CheckColor(adjustedX, obj);
    obj.pistacheType = "tache";
    CheckNum(adjustedX, obj);
    //   console.log("pistacheNum = ", obj.pistacheNum)
    obj.pistacheColor = "#1EC07C";
  } else if (adjustedY >= obj.y + 1600 && adjustedY <= obj.y + 1950) {
    CheckColor(adjustedX, obj);
    obj.pistacheType = "flag";
    CheckNum(adjustedX, obj);
  } else {
    console.log("No matching position found");
  }
//   obj.isPistache = false;
//   console.log("obj.pistacheColor avant le return = ", obj.pistacheColor)
//   console.log("obj.pistacheNum avant le return = ", obj.pistacheNum)
  if (obj.pistacheColor && obj.pistacheNum)
    return updatePistacheTab(obj, pistacheTab);
  else {
    obj.pistacheColor = null;
    obj.pistacheNum = null;
  }
}

export default CheckPistachePosition;
