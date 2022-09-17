const cleanData = (obj?: any) =>
  obj && Object.keys(obj as object).reduce((acc, key) =>
    (obj[key] === undefined ? {...acc} : {...acc, [key]: obj[key]}), {});

export default cleanData;
