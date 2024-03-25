type NestedObject = Record<string, any>;

const AddCoordinates = (obj: NestedObject): NestedObject => {
  const newObj: NestedObject = {};

  for (const key in obj) {
    if (typeof obj[key] === "object" && (obj[key] !== null || obj[key].isParsed == false)) {
      newObj[key+"1"] = { x: 0, y: 0, isParsed: false };
      console.log(`Key: ${key}, Type: Object`);
      console.log(obj[key]);
      newObj[key] = AddCoordinates(obj[key] as NestedObject);
    } else {
      newObj[key] = { x: 0, y: 0, isParsed: false };
    }
  }
  return newObj;
};

export default AddCoordinates;
