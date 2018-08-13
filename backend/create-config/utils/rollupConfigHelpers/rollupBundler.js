const rollup = require('rollup');
const fs = require('fs');
const path = require('path');

const rollupConfigPath = process.argv[2];
const config = require(rollupConfigPath);
const inputOptions = { input: config.input, plugins: config.plugins };
const outputOptions = config.output;

const beginTime = Date.now();
let Bundle;
rollup
  .rollup(inputOptions)
  .then(bundle => {
    Bundle = bundle;
    return bundle.generate(outputOptions);
  })
  .then(result => {
    const totalElapsedTime = Date.now() - beginTime;
    const totalBundleSize = Buffer.from(result.code).length;
    fs.writeFileSync(
      path.join(__dirname, '..', '..', '..', '..', 'electronUserData', 'rollup-totals-stats.json'),
      JSON.stringify({ totalBundleSize, totalElapsedTime }, null, 2)
    );
    Bundle.write(outputOptions);
  });
