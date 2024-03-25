interface NestedObject {
    [key: string]: any;
  }

function exploreObject(obj: NestedObject) {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        console.log(`Key: ${key}, Type: Object`);
        // Vous pouvez examiner le contenu de l'objet sans y entrer
        console.log("this is obj[key] = ", obj[key]);
        console.log("obj de item1 = ", obj["item1"])
      } else {
        console.log(`Key: ${key}, Value: ${obj[key]}`);
      }
    }
  }

  export default exploreObject;