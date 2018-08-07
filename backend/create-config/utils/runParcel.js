const path = require('path');
const { exec } = require('child_process');
const getSavedProjectDataFromFile = require('./createWebPackConfigHelpers/getSavedProjectDataFromFile.js');

const pathToWriteStatsFile = process.argv[process.argv.length - 1];
const pathToSavedData = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'electronUserData',
  'configurationData.js'
);

// getSavedProjectDataFromFile(pathToSavedData)
//   .then(({ entry, indexHtmlPath, rootDir }) => {
//     const parcelEntryFile = indexHtmlPath || entry;
//     exec(
//       `parcel build ${parcelEntryFile} --detailed-report > ${pathToWriteStatsFile}`,
//       null,
//       error => {
//         if (error) process.send({ error });
//         else process.send({ status: 'done' });
//         process.exit();
//       }
//     );
//   })
//   .catch(e => console.log(e));

getSavedProjectDataFromFile(pathToSavedData)
  .then(({ entry, indexHtmlPath, rootDir }) => {
    const parcelBundlerProcess = path.join(__dirname, 'parcelBundleHelpers', 'parcelBundler.js');
    const parcelEntryFile = indexHtmlPath || entry;
    exec(
      `node ${parcelBundlerProcess} ${parcelEntryFile} > ${pathToWriteStatsFile}`,
      null,
      error => {
        if (error) process.send({ error });
        else process.send({ status: 'done' });
        process.exit();
      }
    );
  })
  .catch(e => console.log(e));



