const returnCurrentDirectoryFromPath = require('./indexFilesFromRootHelpers/returnCurrentDirectoryFromPath.js');
const getAllFilesInCurrentDirectory = require('./indexFilesFromRootHelpers/getAllFilesInCurrentDirectory.js');
const getInfoForWebpackConfigFromFileList = require('./createWebPackConfigHelpers/getInfoForWebpackConfigFromFileList.js');
const tryAndSetEntryFromWebpackConfigEntry = require('./createWebPackConfigHelpers/parseEntryFromWebpack.js');
const writeToFile = require('./file-and-system-actions/writeToFile.js');

const pathFromDrag = process.argv[process.argv.length - 1];

returnCurrentDirectoryFromPath(pathFromDrag)
  .then(rootDir => getAllFilesInCurrentDirectory(rootDir))
  .then(res => getInfoForWebpackConfigFromFileList(res))
  .then(res => tryAndSetEntryFromWebpackConfigEntry(res, res.webpackConfig))
  .then(res => writeToFile(res, 'configurationData.js', res))
  .then(res => {
    process.send({
      foundWebpackConfig: res.webpackConfig.exists,
      foundEntryFile: res.entry ? true : false,
    });
    process.exit();
  })
  .catch(e => {
    process.send({ e });
    process.exit();
  });
