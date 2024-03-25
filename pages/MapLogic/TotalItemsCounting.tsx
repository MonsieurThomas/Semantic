const TotalItemsCounting = (obj:any) => {
    let count = 0;
    
    const countProperties = (obj:any) => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (typeof obj[key] === 'object') {
            countProperties(obj[key]);
          } else {
            count++;
          }
        }
      }
    };
    
    countProperties(obj);
    return count;
  };

  export default TotalItemsCounting;