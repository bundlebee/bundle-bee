const fs = require('fs');
const copydir = require('copy-dir');
const path = require('path');

module.exports = res =>
  new Promise((resolve, reject) => {
    const rollupDistPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'electronUserData',
      'rollup-dist'
    );
    // const usersRollupDistPath = path.join(res.rootDir, 'bundle-bee-rollup-dist');
    if (!fs.existsSync(rollupDistPath)) fs.mkdirSync(rollupDistPath);
    copydir(
      // usersRollupDistPath,
      '/Users/bren/React/1-indecisionApp-rollup-tests/bundle-bee-rollup-dist',
      path.join(__dirname, '..', '..', '..', '..', 'electronUserData', 'rollup-dist'),
      err => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
