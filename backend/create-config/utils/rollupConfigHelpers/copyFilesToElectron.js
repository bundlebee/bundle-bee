const fs = require('fs');
const copydir = require('copy-dir');
const path = require('path');

module.exports = res =>
  new Promise((resolve, reject) => {
    const localRollupDistPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'electronUserData',
      'rollup-dist'
    );
    const usersRollupDistPath = path.join(res.rootDir, 'bundle-bee-rollup-dist');
    if (!fs.existsSync(localRollupDistPath)) fs.mkdirSync(localRollupDistPath);
    copydir(usersRollupDistPath, localRollupDistPath, err => {
      if (err) reject(err);
      resolve(res);
    });
  });
