const fs = require('fs');

module.exports = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, res) => {
      if (err) reject(err);
      else resolve(JSON.parse(res));
    });
  });
