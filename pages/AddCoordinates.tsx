interface NestedObject {
  [key: string]: any;
}

const AddCoordinates = (obj: NestedObject) => {
  // const AddCoordinates = (obj: NestedObject): NestedObject => {
    const newObj: NestedObject = {};

    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        newObj[key] = AddCoordinates(obj[key] as NestedObject);
      } else {
        newObj[key] = obj[key];
      }
    }
    newObj.x = 0;
    newObj.y = 0;
    newObj.isParsed = false;
  
    // return newObj;
  };

  export default AddCoordinates;