// // TODO, only the regular build runs when we use env webpack. check on using production and development
// // TODO add mini-css-extract to our config files

// const fs = require('fs');
// const path = require('path');
// const babylon = require('babylon');
// const traverse = require('babel-traverse').default;
// const fork = require('child_process').fork;

// const createWebpackConfig = require('./utils/createWebPackConfigHelpers/createConfigStringFromParams.js');

// const createAndSaveWebpackConfig = (
//   entryFile,
//   extensions,
//   outputPath = path.join(__dirname, '..', 'dist'),
//   indexHtmlPath,
//   rootDir,
//   webpackConfig
// ) => {
//   return new Promise((resolve, reject) => {
//     const pathToOurDist = path.join(__dirname, '..', '..', 'electronUserData', 'dist');
//     console.log('​pathToOurDist', pathToOurDist);

//     const dynamicWebpackConfig = createWebpackConfig(
//       entryFile,
//       extensions,
//       (outputPath = pathToOurDist),
//       indexHtmlPath,
//       rootDir
//     );
//     const webpackConfigSavePath = path.join(pathToOurDist, 'webpack.config.js');
//     fs.writeFile(webpackConfigSavePath, dynamicWebpackConfig, (err, res) => {
//       if (err) reject(err);
//       resolve({ path: pathToOurDist });
//     });
//   });
// };

// // INPUT: str absolute path of file
// //OUTPUT: str containing webpack entry info || null
// const parseConfigForOutput = configFileStr => {
//   try {
//     let output;
//     const ast = babylon.parse(configFileStr, { sourceType: 'module' });
//     traverse(ast, {
//       Identifier: {
//         enter(path) {
//           if (path.node.name === 'entry') {
//             let entryValue = configFileStr.slice(path.parent.value.start, path.parent.value.end);
//             output = entryValue;
//           }
//         },
//       },
//     });
//     return output;
//   } catch (error) {
//     return null;
//   }
// };

// // ************** BELOW ARE FUNCTIONS THAT ARE EXPORTED (ABOVE ARE ALL HELPER FUNCTIONS FOR THE EXPORT FUNCTIONS) ***************************

// const parseExistingConfigurationForOutput = requestObject => {
//   return new Promise((resolve, reject) => {
//     resolve('config');
//   });
// };

// const runWebpack = userProjectInfo => {
//   //   newConfigRequired(userProjectInfo).then(newConfigRequired => {
//   //     if (newConfigRequired) {

//   //     }
//   //   });
//   // {
//   return new Promise((resolve, reject) => {
//     const {
//       webpackConfig,
//       entry,
//       extensions,
//       indexHtmlPath,
//       rootDir,
//       createNewConfig,
//     } = userProjectInfo;
//     if (createNewConfig) {
//       console.log('******************************');
//       console.log('creating new webpack config...');
//       console.log('******************************');
//       createAndSaveWebpackConfig(entry, extensions, null, indexHtmlPath, rootDir, webpackConfig)
//         .then(({ path }) => {
//           runConfigFromTheirRoot(path)
//             .then(() => resolve())
//             .catch(e => console.log(e));
//         })
//         .catch(e => console.log(e));
//     } else {
//       console.log('*************************************');
//       console.log('running existing webpack.config.js...');
//       console.log('*************************************');
//       runConfigFromTheirRoot(rootDir)
//         .then(() => resolve())
//         .catch(e => console.log(e));
//     }
//   });
// };

// module.exports = { runWebpack };
