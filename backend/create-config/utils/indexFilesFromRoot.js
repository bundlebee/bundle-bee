const returnCurrentDirectoryFromPath = require('./indexFilesFromRootHelpers/returnCurrentDirectoryFromPath.js');
const getAllFilesInCurrentDirectory = require('./indexFilesFromRootHelpers/getAllFilesInCurrentDirectory.js');
const getInfoForWebpackConfigFromFileList = require('./createWebPackConfigHelpers/getInfoForWebpackConfigFromFileList.js');
const writeToFile = require('./file-and-system-actions/writeToFile.js');

const pathFromDrag = process.argv[process.argv.length - 1];

returnCurrentDirectoryFromPath(pathFromDrag)
  .then(rootDir => getAllFilesInCurrentDirectory(rootDir))
  .then(files => getInfoForWebpackConfigFromFileList(files))
  .then(res => writeToFile(res, 'configurationData.js'))
  .then(res =>
    process.send({
      foundWebpackConfig: res.webpackConfig.exists,
      foundEntryFile: res.entryFileAbsolutePath ? true : false,
    })
  )
  .catch(e => console.log(e));
