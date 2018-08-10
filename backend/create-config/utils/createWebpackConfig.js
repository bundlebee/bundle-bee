const path = require('path');

const getSavedProjectDataFromLocalFile = require('./createWebPackConfigHelpers/getSavedProjectDataFromFile.js');
const setEntryFromDragPathIfDragPathExists = require('./createWebPackConfigHelpers/SetEntryFromDragPathIfDragPathExists.js');
const createWebpackConfig = require('./createWebPackConfigHelpers/createConfigStringFromParams.js');
const writeToFile = require('./file-and-system-actions/writeToFile.js');

const pathToUserDataFolder = path.join(__dirname, '..', '..', '..', 'electronUserData');
const pathToLocalFile = path.join(pathToUserDataFolder, 'configurationData.js');

getSavedProjectDataFromLocalFile(pathToLocalFile)
  .then(res => setEntryFromDragPathIfDragPathExists(res, process.argv[process.argv.length - 1]))
  .then(res => createWebpackConfig(res))
  .then(({ config, res }) => {
    writeToFile(config, 'webpack.config.js');
    writeToFile(config, path.join('webpack-dist', 'webpack.config.js'));
    writeToFile(res.webpackDependencies, path.join('webpack-dist', 'package.json'));
    return res;
  })
  .then(res => writeToFile(res, 'configurationData.js'))
  .then(() => {
    process.send({ webpackDirectory: pathToUserDataFolder });
    process.exit();
  })
  .catch(err => {
    process.send({ err });
    process.exit();
  });
