const path = require('path');

module.exports = pathFromDragAndDrop => {
  return new Promise((resolve, reject) => {
    if (!path.isAbsolute(pathFromDragAndDrop)) reject();
    const rootDir = path.extname(pathFromDragAndDrop)
      ? path.dirname(pathFromDragAndDrop)
      : pathFromDragAndDrop;
    resolve(rootDir);
  });
};
