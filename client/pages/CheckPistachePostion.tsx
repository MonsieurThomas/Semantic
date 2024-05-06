import React from 'react'

function updatePistacheTab(obj: { pistacheType: string; pistacheColor: string; value: string; color: string }, pistacheTab:any, setPistacheTab:any) {
    type Quartet = [string, string, string, string]; // Assurez-vous que ceci est déclaré dans la portée approprié

    if (Array.isArray(pistacheTab)) {
        const index = pistacheTab.findIndex((item:Quartet) => item[2] === obj.value); // item[2] correspond à 'value'
        // your logic here
        let newPistacheTab = [...pistacheTab];
        
        if (index !== -1) {
            // Si l'élément existe, supprimez-le
            newPistacheTab.splice(index, 1);
        } else {
            // Si l'élément n'existe pas, ajoutez le nouveau objet
            newPistacheTab.push([obj.pistacheType, obj.pistacheColor, obj.value, obj.color]);
        }
        
        // Mettre à jour l'état avec le nouveau tableau
        setPistacheTab(newPistacheTab);
    } else {
      console.error('pistacheTab is not an array:', pistacheTab);
    }
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

function CheckTache (adjustedX:number, obj:any)
{
    // if (adjustedX >= obj.x + 400 && adjustedX <= obj.x + 750)
    //     console.log("Couleur")
    if (adjustedX >= obj.x + 395 && adjustedX <= obj.x + 435)
    console.log("1")
    else if (adjustedX >= obj.x + 440 && adjustedX <= obj.x + 475)
    console.log("2")
    else if (adjustedX >= obj.x + 490 && adjustedX <= obj.x + 520)
    console.log("3")
    else if (adjustedX >= obj.x + 530 && adjustedX <= obj.x + 575)
    console.log("4")
    else if (adjustedX >= obj.x + 580 && adjustedX <= obj.x + 610)
    console.log("5")
    else if (adjustedX >= obj.x + 625 && adjustedX <= obj.x + 655)
    console.log("6")
    else if (adjustedX >= obj.x + 670 && adjustedX <= obj.x + 700)
    console.log("7")

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

function CheckPistachePostion(obj:any, adjustedX:number, adjustedY:number, pistacheTab:any, setPistacheTab:any) {

    if (adjustedY >= obj.y - 80 && adjustedY <= obj.y - 40)
    {
        console.log("Etiquette");
        CheckColor (adjustedX, obj)
        obj.pistacheType = "etiquette"
    }
        
    else if (adjustedY >= obj.y - 5 && adjustedY <= obj.y + 35)
        {
            console.log("Priorité");
            CheckColor (adjustedX, obj)
            obj.pistacheType = "priorité"
            CheckNum(adjustedX, obj)
        }
    else if (
        adjustedY >= obj.y + 80 &&
            adjustedY <= obj.y + 110)
        {
            CheckColor (adjustedX, obj)
            obj.pistacheType = "tache"
            CheckNum(adjustedX, obj)
            console.log(obj.pistacheType);
        }
    else if (
        adjustedY >= obj.y + 150 &&
            adjustedY <= obj.y + 190)
        {
            console.log("Drapeaux");
            CheckColor (adjustedX, obj)
            obj.pistacheType = "flag"
        }
    else
        console.log("Mince")

    updatePistacheTab(obj, pistacheTab, setPistacheTab)
    // setPistacheTab([...pistacheTab, [obj.pistacheType, obj.pistacheColor, obj.value, obj.color]]);
}

export default CheckPistachePostion
