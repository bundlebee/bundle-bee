const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = res =>
  new Promise((resolve, reject) => {
    const originalProcessDir = process.cwd();
    const rollupCommandAbsoluteLocation = path.join(
      require.resolve('rollup'),
      '..',
      '..',
      '..',
      '.bin',
      'rollup'
    );
    const rollupConfigPath = path.join(res.rootDir, 'bundle-bee-rollup.config.js');
    console.log('​rollupCommandAbsoluteLocation', rollupCommandAbsoluteLocation);
    process.chdir(res.rootDir);
    // exec(`${rollupCommandAbsoluteLocation} -c ${rollupConfigPath}`, (err, stdout, stderr) => {
    //   process.chdir(originalProcessDir);
    //   if (err) reject(err);
    //   fs.unlink(rollupConfigPath, err => {
    //     if (err) reject(err);
    //     console.log('finished running rollup');
    //     resolve(res);
    //   });
    // });
    
    const rollupBundlerPath = path.join(__dirname, 'rollupBundler.js');
    exec(`node ${rollupBundlerPath} ${rollupConfigPath}`, (err, stdout, stderr) => {
      process.chdir(originalProcessDir);
      if (err) reject(err);
      fs.unlink(rollupConfigPath, err => {
        if (err) reject(err);
        console.log('finished running rollup');
        resolve(res);
      });
    });
  });
