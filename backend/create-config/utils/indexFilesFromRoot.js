const babylon = require('babylon');
const traverse = require('babel-traverse').default;

const returnCurrentDirectoryFromPath = require('./indexFilesFromRootHelpers/returnCurrentDirectoryFromPath.js');
const getAllFilesInCurrentDirectory = require('./indexFilesFromRootHelpers/getAllFilesInCurrentDirectory.js');
const getInfoForWebpackConfigFromFileList = require('./createWebPackConfigHelpers/getInfoForWebpackConfigFromFileList.js');
const writeToFile = require('./file-and-system-actions/writeToFile.js');

const parseConfigForOutput = configFileStr => {
  try {
    let output;
    const ast = babylon.parse(configFileStr, { sourceType: 'module' });
    traverse(ast, {
      Identifier: {
        enter(path) {
          if (path.node.name === 'entry') {
            let entryValue = configFileStr.slice(path.parent.value.start, path.parent.value.end);
            output = entryValue;
          }
        },
      },
    });
    return output;
  } catch (error) {
    return null;
  }
};

const pathFromDrag = process.argv[process.argv.length - 1];

returnCurrentDirectoryFromPath(pathFromDrag)
  .then(rootDir => getAllFilesInCurrentDirectory(rootDir))
  .then(files => getInfoForWebpackConfigFromFileList(files))
  .then(res => writeToFile(res, 'configurationData.js'))
  .then(res => {
    console.log('got here');
    console.log('res.entryFileAbsolutePath: ', res.entryFileAbsolutePath);
    console.log('res.webpackConfig.exists: ', res.webpackConfig.exists);

    process.send({
      foundWebpackConfig: res.webpackConfig.exists,
      foundEntryFile: res.entryFileAbsolutePath ? true : false,
    });
  })
  .catch(e => console.log(e));
//   console.log('wahoooooo');

//   let {
//     webpackConfig,
//     entryIsInRoot,
//     indexHtmlPath,
//     extensions,
//     entryFileAbsolutePath,
//     rootDir,
//   } = res;

//   if (webpackConfig.exists) {
//     const entryFromParsingWebpackConfig = parseConfigForOutput(webpackConfig.content);
//     if (
//       entryFromParsingWebpackConfig &&
//       entryFromParsingWebpackConfig !== 'null' &&
//       entryFromParsingWebpackConfig !== 'undefined'
//     ) {
//       entryFileAbsolutePath = entryFromParsingWebpackConfig;
//     }
//   }
//   const response = {
//     webpackConfig,
//     entryIsInRoot,
//     indexHtmlPath,
//     extensions,
//     rootDir,
//     entryFileAbsolutePath,
//   };
//   console.log('sending process');

//   process.send(response);
//   return response;
// })
