const path = require('path');
const Bundler = require('parcel-bundler');
const fs = require('fs');

const parcelEntryFile = process.argv[2];
const rootDir = process.argv[3];
const pathToWriteStatsFile = process.argv[4];
const outputDir = process.argv[5];
// hack for production mode
process.env.NODE_ENV = 'production';

// hack to change node.js directory
process.chdir(rootDir);
// define the bundler
const bundler = new Bundler(parcelEntryFile, { detailedReport: true, outDir: outputDir });
bundler.bundle();

// on bundler completion, gather size and timing information
bundler.on('bundled', mainBundle => {
  /* one main bundle, and (possibly) multiple child bundles from the main bundle, each of which contain assets that need conversion. */
  /* we're only going one level deep, without recursively going through the child bundles. */
  const bundles = [mainBundle].concat(Array.from(mainBundle.childBundles));

  const bundleOutputs = bundles.map(bundle =>
    Array.from(bundle.assets).map(asset => ({
      name: path.relative(rootDir, asset.name),
      buildTime: asset.buildTime,
      bundledSize: asset.bundledSize,
    }))
  );

  const output = bundleOutputs.reduce((acc, arr) => acc.concat(arr));

  output.forEach(asset => {
    asset.relativeName = asset.relativeName;
  });

  fs.writeFileSync(pathToWriteStatsFile, JSON.stringify(output, null, 2));
});
