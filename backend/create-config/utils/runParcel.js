const path = require('path');
const { exec } = require('child_process');
const getSavedProjectDataFromFile = require('./createWebPackConfigHelpers/getSavedProjectDataFromFile.js');
const addParcelDependenciesToRes = require('./parcelBundleHelpers/addParcelDependenciesToUserDataObject.js');
const writeToFile = require('./file-and-system-actions/writeToFile.js');

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
  .then(res => addParcelDependenciesToRes(res))
  .then(res => writeToFile(res.parcelDependencies, path.join('parcel-dist', 'package.json'), res))
  .then(res => {
    const entry = res.indexHtmlPath || res.entry;
    const parcelBundlerProcess = path.join(__dirname, 'parcelBundleHelpers', 'parcelBundler.js');

    exec(
      `node ${parcelBundlerProcess} ${entry} ${rootDir} ${pathToWriteStatsFile} ${outputDir}`,
      null,
      error => {
        if (error) process.send({ error });
        else {
          process.send('');
          process.exit();
        }
      }
    );
  })
  .catch(e => console.log(e));
