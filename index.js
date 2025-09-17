function getImages() {
  // 1. Dump the source code of LoadNextPages
  const src = LoadNextPages.toString();

  // 2. Extract the finalize function name and array name
  //    Pattern looks like:  finalizeFn(5, arrayName[currImage])
  const match = src.match(/([A-Za-z_$][\w$]*)\s*\(\s*\d+\s*,\s*([A-Za-z_$][\w$]*)\[currImage\]\)/);
  if (!match) throw new Error("Could not detect finalize function and array from LoadNextPages");

  const finalizeName = match[1];
  const arrayName = match[2];

  // 3. Resolve them from global scope
  const finalizeFn = self[finalizeName] || window[finalizeName];
  const arr = self[arrayName] || window[arrayName];

  if (typeof finalizeFn !== "function") {
    throw new Error(`Finalize function ${finalizeName} not found`);
  }
  if (!Array.isArray(arr)) {
    throw new Error(`Array ${arrayName} not found`);
  }

  // 4. Apply the finalize function to every entry in the array
  const urls = arr.map(token => finalizeFn(5, token));

  return urls;
}

const pageLinks = getImages();