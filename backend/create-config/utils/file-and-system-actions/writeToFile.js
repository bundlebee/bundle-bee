const fs = require('fs');
const path = require('path');

module.exports = (data, fileName) => {
  return new Promise((resolve, reject) => {
    const stringData = JSON.stringify(data);
    const savePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'electronUserData',
      fileName
    );
    fs.writeFile(savePath, stringData, (err, res) => {
      console.log(err);
      if (err) reject(`error writing file ${fileName}`);
      resolve(data);
    });
  });
};
