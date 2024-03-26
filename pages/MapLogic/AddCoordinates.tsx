type NestedObject = Record<string, any>;

// const AddCoordinates = (obj: NestedObject) => {
const AddCoordinates = (obj: NestedObject): NestedObject => {
  const newObj: NestedObject = {};

  for (const key in obj) {
    // Directly check if the value is an object and not null
    if (typeof obj[key] === "object" && obj[key] !== null) {
      // Apply the function recursively without the initial assignment
      newObj[key] = AddCoordinates(obj[key] as NestedObject);
    } else {
      // For non-object values, assign the new object with coordinates and isParsed flag
      newObj[key] = { x: 0, y: 0, isParsed: false };
    }
  }
  return newObj;
};

export default AddCoordinates;
