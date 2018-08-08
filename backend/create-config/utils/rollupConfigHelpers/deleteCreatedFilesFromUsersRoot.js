const rimraf = require('rimraf');
const path = require('path');

module.exports = res =>
  new Promise((resolve, reject) => {
    // const usersDirectoryToRemove = path.join(res.rootDir, 'bundle-bee-rollup-dist');
    rimraf('/Users/bren/React/1-indecisionApp-rollup-tests/bundle-bee-rollup-dist/', err => {
      if (err) reject(err);
      resolve(res);
    });
  });
