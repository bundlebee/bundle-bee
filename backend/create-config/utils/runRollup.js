const path = require('path');

const getSavedProjectDataFromFile = require('./createWebPackConfigHelpers/getSavedProjectDataFromFile.js');
const createRollupRulesFromFileTypes = require('./rollupConfigHelpers/createRollupRulesFromFileTypes.js');
const createRollupConfigFromParams = require('./rollupConfigHelpers/createRollupConfigFromParams.js');
const runRollupFromUsersRoot = require('./rollupConfigHelpers/runRollupFromUsersRoot.js');
const copyFilesToElectron = require('./rollupConfigHelpers/copyFilesToElectron.js');
const deleteCreatedFilesFromUsersRoot = require('./rollupConfigHelpers/deleteCreatedFilesFromUsersRoot.js');
const writeToFile = require('./file-and-system-actions/writeToFile.js');

// const pathToWriteStats = process.argv[process.argv.length - 1];
const pathToUserDataFolder = path.join(__dirname, '..', '..', '..', 'electronUserData');
const pathToLocalFile = path.join(pathToUserDataFolder, 'configurationData.js');

getSavedProjectDataFromFile(pathToLocalFile)
  .then(res => createRollupRulesFromFileTypes(res))
  .then(res => createRollupConfigFromParams(res))
  .then(res =>
    writeToFile(res.rollupConfigString, path.join('rollup-dist', 'rollup.config.js'), res)
  )
  .then(res => writeToFile(res.rollupDependencies, path.join('rollup-dist', 'package.json'), res))
  .then(res => runRollupFromUsersRoot(res))
  .then(res => copyFilesToElectron(res))
  .then(res => deleteCreatedFilesFromUsersRoot(res))
  .then(res => {
    writeToFile(res, 'configurationData.js');
  })
  .then(() => {
    process.send('');
    process.exit();
  })
  .catch(err => {
    process.send({ err });
    process.exit();
  });
