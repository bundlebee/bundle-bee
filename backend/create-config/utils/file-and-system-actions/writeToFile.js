const fs = require('fs');
const path = require('path');

module.exports = (data, fileName, res) => {
  return new Promise((resolve, reject) => {
    let stringData = typeof data === 'string' ? data : JSON.stringify(data);
    const savePath = path.join(__dirname, '..', '..', '..', '..', 'electronUserData', fileName);
    const saveDir = path.dirname(savePath);
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir);
    }
    fs.writeFile(savePath, stringData, err => {
      if (err) reject(`error writing file ${fileName}`);
      resolve(res);
    });
  });
};
