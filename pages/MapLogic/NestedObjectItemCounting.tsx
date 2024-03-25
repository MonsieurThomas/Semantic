interface NestedObject {
  [key: string]: any;
}

function countNestedObjectLevels(obj: NestedObject) {
  // const count = (currentObj: any, depth: number = 0) => {
  //   if (typeof currentObj !== "object" || currentObj === null) {
  //     return { value: currentObj, depth }; // For non-objects, return the value and depth directly
  //   }

  //   let structure: NestedObject = {};
  //   let length = 0; // Initialize length count for this level

  //   for (const key in currentObj) {
  //     if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
  //       const item = currentObj[key];
  //       const { structure: nestedStructure, depth: nestedDepth } = count(
  //         item,
  //         depth + 1
  //       );
  //       structure[key] = nestedStructure; // Add the nested structure or value directly
  //       length += 1; // Count each item at this level
  //     }
  //   }

  //   // Attach a length property and the nested structure or value
  //   return { structure: { ...structure, length }, depth };
  //   // return { structure: { ...structure, length }, depth };
  // };

  // const { structure: resultStructure } = count(obj);
  // return resultStructure;
}







//   const countNestedObjectLevels = (obj: NestedObject): Array<{level: number, count: number}> => {
//     // Initialisation d'un tableau pour stocker les résultats
//     let results: Array<{level: number, count: number}> = [];

//     const count = (obj: NestedObject, depth: number) => {
//       if (typeof obj !== "object" || obj === null) {
//         return;
//       }
//       let currentLevel = results.find(result => result.level === depth);
//       if (!currentLevel) {
//         currentLevel = { level: depth, count: 0 };
//         results.push(currentLevel);
//       }

//       for (const key in obj) {
//         if (Object.prototype.hasOwnProperty.call(obj, key)) {
//           currentLevel.count++;

//           count(obj[key], depth + 1);
//         }
//       }
//     };
//     for (const key in obj) {}
//     count(obj, 1);
//     return results;
//   };

export default countNestedObjectLevels;
