// TODO the functions that get called after the various prompts should be refactored into a reusable function
// TODO prompt params should probably be set outside of the prompt call (look at docs)
// TODO dont use set timeout for the deletion of the files obs. make a callback or promise or something
// TODO maybe peek to see if babelrc exists and use that
// TODO add like all the presets normally so we don't error out
// TODO AND THEN GET EXPENSIFY AND MCMI WORKING
// TODO use all bable plugins and presets
// TODO, only the regular build runs when we use env webpack. check on using production and development
// TODO we find a config file in cra even though it isn't there. fix this
// TODO add mini-css-extract to our config files
// !! delete config if it wasn't there initially
//?? probably should get the entry point set up for auto find and if not let them enter it
// ?? look into how to handle our creating a webpack if they use an array of chunks for their entry instead of a single file

const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const babel = require('babel-core');
const fork = require('child_process').fork;

const returnCurrentDirectoryFromPath = require('./utils/indexFilesFromRootHelpers/returnCurrentDirectoryFromPath.js');
const getAllFilesInCurrentDirectory = require('./utils/indexFilesFromRootHelpers/getAllFilesInCurrentDirectory.js');
const getInfoForWebpackConfigFromFileList = require('./utils/createWebPackConfigHelpers/getInfoForWebpackConfigFromFileList.js');
const createWebpackConfig = require('./utils/createWebPackConfigHelpers/webpack-template');

const createAndSaveWebpackConfig = (
  entryFile,
  extensions,
  outputPath = path.join(__dirname, '..', 'dist'),
  indexHtmlPath,
  rootDir,
  webpackConfig
) => {
  return new Promise((resolve, reject) => {
    // const pathToOurDist = path.join(__dirname, '..', 'dist');
    const pathToOurDist = path.join('/Users/bren/Desktop', 'dist');
    const dynamicWebpackConfig = createWebpackConfig(
      entryFile,
      extensions,
      (outputPath = pathToOurDist),
      indexHtmlPath,
      rootDir
    );
    const webpackConfigSavePath = path.join(rootDir, 'webpack.config.js');
    if (webpackConfig.exists) {
      // if they have an existing webpack, we want to temproarily rename that to something else, and then rename it back after we run ours and save ours to our dist flder
      let tempFileName;
      if (fs.existsSync(webpackConfigSavePath)) {
        tempFileName = path.join(rootDir, 'temp-store-current-webpack.config.js');
        console.log(`renaming ${webpackConfigSavePath} to ${tempFileName}`);
        fs.renameSync(webpackConfigSavePath, tempFileName);
      }
      fs.writeFile(webpackConfigSavePath, dynamicWebpackConfig, (err, res) => {
        if (err) reject(err);
        resolve({ rootDir, tempFileName });
      });
    } else {
      console.log('no webpack exists. writing with impunity');
      fs.writeFile(webpackConfigSavePath, dynamicWebpackConfig, (err, res) => {
        if (err) reject(err);
        // also write to our dist folder so we can grab it again later if they want to use ours
        const writeConfigToOurDistPath = path.join(pathToOurDist, 'webpack.config.js');
        fs.writeFile(writeConfigToOurDistPath, dynamicWebpackConfig, (err, res) => {
          if (err) reject(err);
          console.log('webpack config saved to dist for later use');
          resolve({ rootDir, tempFileName: false });
        });
      });
    }
  });
};

// INPUT: str absolute path of file
//OUTPUT: str containing webpack entry info || null
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

const runConfigFromTheirRoot = rootDir => {
  return new Promise((resolve, reject) => {
    const statsWritePath = path.join(__dirname, '..', 'dist', 'stats.json');
    const pathToChild = path.join(
      __dirname,
      'utils',
      'file-and-system-actions',
      'run-webpack-from-separate-dir-child-process.js'
    );
    const child = fork(pathToChild, [statsWritePath], { cwd: rootDir });

    child.on('message', message => {
      if (message) {
        if (message.error) {
          console.log('error: ', message.error);
          reject(message.error);
        } else {
          console.log('webpack successfully run and stas.json successfully written...');
          resolve();
        }
      }
    });
  });
};
// ************** BELOW ARE FUNCTIONS THAT ARE EXPORTED (ABOVE ARE ALL HELPER FUNCTIONS FOR THE EXPORT FUNCTIONS) ***************************
const indexFilesFromRoot = pathFromDrag =>
  returnCurrentDirectoryFromPath(pathFromDrag)
    .then(rootDir => getAllFilesInCurrentDirectory(rootDir))
    .then(files => getInfoForWebpackConfigFromFileList(files))
    .then(res => {
      const electron = require('electron');
      const userDataPath = (electron.app || electron.remote.app).getPath('userData');
      console.log('user data path', userDataPath);
      let {
        webpackConfig,
        entryIsInRoot,
        indexHtmlPath,
        extensions,
        entryFileAbsolutePath,
        rootDir,
      } = res;

      if (webpackConfig.exists) {
        const entryFromParsingWebpackConfig = parseConfigForOutput(webpackConfig.content);
        if (
          entryFromParsingWebpackConfig &&
          entryFromParsingWebpackConfig !== 'null' &&
          entryFromParsingWebpackConfig !== 'undefined'
        ) {
          entryFileAbsolutePath = entryFromParsingWebpackConfig;
        }
      }
      const response = {
        webpackConfig,
        entryIsInRoot,
        indexHtmlPath,
        extensions,
        rootDir,
        entryFileAbsolutePath,
      };

      return response;
    })
    .catch(e => console.log(e));
const runWebpack = requestObject => {
  return new Promise((resolve, reject) => {
    console.log(requestObject.webpackConfig);

    const {
      webpackConfig,
      entryFileAbsolutePath,
      extensions,
      indexHtmlPath,
      rootDir,
      createNewConfig,
    } = requestObject;
    if (createNewConfig) {
      console.log('******************************');
      console.log('creating new webpack config...');
      console.log('******************************');
      createAndSaveWebpackConfig(
        entryFileAbsolutePath,
        extensions,
        null,
        indexHtmlPath,
        rootDir,
        webpackConfig
      )
        .then(({ rootDir, tempFileName }) => {
          runConfigFromTheirRoot(rootDir)
            .then(() => {
              const configToDelete = path.join(rootDir, 'webpack.config.js');
              if (tempFileName) {
                fs.unlinkSync(configToDelete);
                fs.renameSync(tempFileName, configToDelete);
              }
              resolve();
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    } else {
      console.log('*************************************');
      console.log('running existing webpack.config.js...');
      console.log('*************************************');
      runConfigFromTheirRoot(rootDir)
        .then(() => {
          resolve();
        })
        .catch(e => console.log(e));
    }
  });
};

module.exports = { indexFilesFromRoot, runWebpack };
