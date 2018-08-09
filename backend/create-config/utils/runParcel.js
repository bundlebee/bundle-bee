const path = require('path');
const { exec } = require('child_process');
const getSavedProjectDataFromFile = require('./createWebPackConfigHelpers/getSavedProjectDataFromFile.js');

const rootDir = process.argv[2];
const pathToWriteStatsFile = process.argv[3];
const outputDir = path.join(path.dirname(pathToWriteStatsFile), 'parcel-dist');
const pathToSavedData = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'electronUserData',
  'configurationData.js'
);

getSavedProjectDataFromFile(pathToSavedData)
  .then(results => {
    const entry = results.indexHtmlPath || results.entry;
    const parcelBundlerProcess = path.join(__dirname, 'parcelBundleHelpers', 'parcelBundler.js');
    exec(
      `node ${parcelBundlerProcess} ${entry} ${rootDir} ${pathToWriteStatsFile} ${outputDir}`,
      null,
      error => {
        if (error) process.send({ error });
        else process.send('');
        process.exit();
      }
    );
  })
  .catch(e => console.log(e));
