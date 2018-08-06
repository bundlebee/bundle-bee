const fs = require('fs');
const path = require('path');

module.exports = (data, fileName) => {
  return new Promise((resolve, reject) => {
    let stringData = typeof data === 'string' ? data : JSON.stringify(data);
    const savePath = path.join(__dirname, '..', '..', '..', '..', 'electronUserData', fileName);
    fs.writeFile(savePath, stringData, (err, res) => {
      if (err) reject(`error writing file ${fileName}`);
      resolve(data);
    });
  });
};
