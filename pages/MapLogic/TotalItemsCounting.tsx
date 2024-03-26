const TotalItemsCounting = (obj: any): [number, number] => {
  let count = 0;
  let maxDepth = 0;

  const countProperties = (obj: any, depth: number) => {
    maxDepth = Math.max(maxDepth, depth);

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === "object") {
          countProperties(obj[key], depth + 1);
        } else {
          count++;
        }
      }
    }
  };

  countProperties(obj, 1);
  return [count, maxDepth];
};

export default TotalItemsCounting;
