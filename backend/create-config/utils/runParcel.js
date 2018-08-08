const path = require('path');
const { exec } = require('child_process');
const getSavedProjectDataFromFile = require('./createWebPackConfigHelpers/getSavedProjectDataFromFile.js');

const pathToWriteStatsFile = process.argv[process.argv.length - 1];
const outputDir = path.join(path.dirname(pathToWriteStatsFile), 'dist');
const pathToSavedData = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'electronUserData',
  'configurationData.js'
);
getSavedProjectDataFromFile(pathToSavedData)
  .then(({ entry }) => {
    exec(
      `parcel build ${entry} --out-dir ${outputDir} --detailed-report > ${pathToWriteStatsFile}`,
      (error, stdout) => {
        console.log('cwd: ', process.cwd());

        console.log('​outputDir', outputDir);
        console.log('​stdout', stdout);
        console.log('​error', error);

        if (error) process.send({ error });
        else process.send('');
        process.exit();
      }
    );
  })
  .catch(e => console.log(e));
