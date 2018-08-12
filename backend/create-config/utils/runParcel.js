const path = require('path');
const { exec } = require('child_process');
const getSavedProjectDataFromFile = require('./createWebPackConfigHelpers/getSavedProjectDataFromFile.js');
const addParcelDependenciesToRes = require('./parcelBundleHelpers/addParcelDependenciesToUserDataObject.js');
const writeToFile = require('./file-and-system-actions/writeToFile.js');
const validator = require('html-validator');
const fs = require('fs');

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
    const options = {
      format: 'text',
    };
    const parcelBundlerProcess = path.join(__dirname, 'parcelBundleHelpers', 'parcelBundler.js');
    let entry;
    console.log('here: ', res.indexHtmlPath);
    if (res.indexHtmlPath) {
      fs.readFile(res.indexHtmlPath, 'utf8', (err, html) => {
        if (err) throw err;
        options.data = html;
        validator(options).then(data => {
          if (!data.includes('Error:')) {
            entry = res.indexHtmlPath;
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
          }
        });
      });
    }
    entry = res.entry;
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
