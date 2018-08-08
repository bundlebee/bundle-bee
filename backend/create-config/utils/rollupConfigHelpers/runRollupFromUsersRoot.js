const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = res =>
  new Promise((resolve, reject) => {
    const originalProcessDir = process.cwd();
    // process.chdir(res.rootDir);
    const rollupCommandAbsoluteLocation = path.join(
      require.resolve('rollup'),
      '..',
      '..',
      '..',
      '.bin',
      'rollup'
    );
    const rollupConfigPath =
      '/Users/bren/React/1-indecisionApp-rollup-tests/bundle-bee-rollup.config.js';
    console.log('​rollupCommandAbsoluteLocation', rollupCommandAbsoluteLocation);
    process.chdir('/Users/bren/React/1-indecisionApp-rollup-tests/');
    exec(`${rollupCommandAbsoluteLocation} -c ${rollupConfigPath}`, (err, stdout, stderr) => {
      process.chdir(originalProcessDir);
      if (err) reject(err);
      fs.unlink(rollupConfigPath, err => {
        if (err) reject(err);
        console.log('finished running rollup');
        resolve(res);
      });
    });
  });
