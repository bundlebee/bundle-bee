// !! if webpack is not installed globally, we should tell them they need to install it
// TODO the functions that get called after the various prompts should be refactored into a reusable function
// TODO prompt params should probably be set outside of the prompt call (look at docs)
// TODO dont use set timeout for the deletion of the files obs. make a callback or promise or something
// TODO maybe peek to see if babelrc exists and use that
// TODO add like all the presets normally so we don't error out
// TODO AND THEN GET EXPENSIFY AND MCMI WORKING
// TODO use all bable plugins and presets
// TODO, only the regular build runs when we use env webpack. check on using production and development
// TODO get the scripts we need to use
// TODO make sure temp.js is getting deleted, and potentially change the name
// TODO we find a config file in cra even though it isn't there. fix this
// TODO add mini-css-extract to our config files
// !! delete config if it wasn't there initially
//?? probably should get the entry point set up for auto find and if not let them enter it
// ?? look into how to handle our creating a webpack if they use an array of chunks for their entry instead of a single file

const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const rimraf = require('rimraf');
const fse = require('fs-extra');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const babel = require('babel-core');
const fork = require('child_process').fork;

const createWebpackConfig = require('./utils/webpack-template');
const folderIndexer = require('./utils/get-files-from-root.js');
prompt.start();

const distDirPath = path.join(__dirname, '..', 'dist');
// ?? ODD. these files get recrearted by parcel even when i delete them, and i have to add them here for them to delete at all. if i add them later, the code block doesn't run
const foldersToDeleteAfterRunning = [
  path.join(__dirname, '.cache'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '..', 'dist'),
];
const filesToDeleteAfterRunning = [path.join(__dirname, '..', 'webpack.config.js')];
const deleteTemporaryFilesAndFolders = (files = [], folders = []) => {
  folders.forEach((path, i, arr) => {
    fse.remove(path, (err, res) => {
      if (i === arr.length - 1) console.log('last folder deleted');
    });
  });
  files.forEach((path, i, arr) => {
    fs.unlink(path, (err, res) => {
      if (i === arr.length - 1) console.log('last file deleted');
    });
  });
};

const getFiles = rootDir => {
  return new Promise((resolve, reject) => {
    folderIndexer(rootDir, (err, res) => {
      if (err) reject(err);
      if (res) resolve(res);
    });
  });
};

const createAndSaveWebpackConfig = (
  entryFile,
  extensions,
  outputPath = path.join(__dirname, '..', 'dist'),
  indexHtmlPath,
  rootDir
) => {
  return new Promise((resolve, reject) => {
    const pathToOurDist = path.join(__dirname, '..', 'dist');
    const dynamicWebpackConfig = createWebpackConfig(
      entryFile,
      extensions,
      (outputPath = pathToOurDist),
      indexHtmlPath,
      rootDir
    );
    const webpackConfigSavePath = path.join(rootDir, 'webpack.config.js');
    // if they have an existing webpack, we want to temproarily rename that to something else, and then rename it back after we run ours and save ours to our dist flder
    let tempFileName;
    if (fs.existsSync(webpackConfigSavePath)) {
      tempFileName = path.join(rootDir, 'temp-store-current-webpack.config.js');
      console.log(`renaming ${webpackConfigSavePath} to ${tempFileName}`);
      fs.renameSync(webpackConfigSavePath, tempFileName);
    }
    fs.writeFile(webpackConfigSavePath, dynamicWebpackConfig, (err, res) => {
      if (err) reject(err);
      // also write to our dist folder so we can grab it again later if they want to use ours
      const writeConfigToOurDistPath = path.join(pathToOurDist, 'webpack.config.js');
      fs.writeFile(writeConfigToOurDistPath, dynamicWebpackConfig, (err, res) => {
        if (err) reject(err);
        console.log('webpack config saved to dist for later use');
        resolve({ rootDir, tempFileName });
      });
    });
  });
};

const getRequiredInfoFromFiles = (files, rootDir) => {
  function packageJSONExistsInDir(fileEntry, rootDir) {
    return fileEntry.name === 'package.json' && fileEntry.fullParentDir === rootDir;
  }
  const webpackConfig = { exists: false, path: null, content: null };
  let entryFileAbsolutePath;
  let entryIsInRoot;
  let indexHtmlPath;
  let filePaths = files.reduce((files, fileInfo) => {
    // check if entry file is in root of project
    if (!entryIsInRoot && packageJSONExistsInDir(fileInfo, rootDir)) entryIsInRoot = true;
    const { name, fullPath } = fileInfo;
    // TODO prompt if multiple webpack configs found
    // check for webpack config outside of node modules
    if (
      name === 'webpack.config.js' &&
      !fullPath.includes('/node_modules/') &&
      !webpackConfig.exists
    ) {
      webpackConfig.exists = true;
      (webpackConfig.fullPath = fullPath),
        //might not need some of this stuff anymore. might just need to know if it exists. we'll see
        (webpackConfig.content = fs.readFileSync(fullPath, 'utf-8'));
      webpackConfig.info = fileInfo;
    }
    {
      if (name === 'index.html' && !fullPath.includes('/node_modules/') && !indexHtmlPath)
        indexHtmlPath = fullPath;
    }
    // make sure /src/ is in the root of the project (name should be src/index.js and when you remove src/index.js)
    if (fullPath.includes('/src/index.js') && fullPath.replace('/src/index.js', '') === rootDir) {
      entryFileAbsolutePath = `'${fullPath}'`;
    }
    return files.concat(name);
  }, []);
  const extensions = files
    .map(file => path.extname(file.name))
    .reduce((acc, ext) => (acc.includes(ext) ? acc : acc.concat(ext)), []);
  return {
    webpackConfig,
    entryIsInRoot,
    indexHtmlPath,
    extensions,
    filePaths,
    entryFileAbsolutePath,
  };
};

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
const indexFilesFromRoot = rootDir => {
  // in case they provide a file, just grab the directory's path. it's possibly using fs stats to test if file or directory is better, but that is a slower, synchronous function. i think this works in all cases
  rootDir = path.extname(rootDir) ? path.dirname(rootDir) : rootDir;
  return new Promise((resolve, reject) => {
    getFiles(rootDir)
      .then(files => {
        let {
          webpackConfig,
          entryIsInRoot,
          indexHtmlPath,
          extensions,
          entryFileAbsolutePath,
        } = getRequiredInfoFromFiles(files, rootDir);
        if (!entryIsInRoot) {
          console.log('----------no package.json in provided directory----------'); // TODO prompt them to make sure this is the root folder
        }
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
        resolve(response);
      })
      .catch(e => console.log(e));
  });
};
const runWebpack = requestObject => {
  return new Promise((resolve, reject) => {
    const {
      entryFileAbsolutePath,
      extensions,
      indexHtmlPath,
      rootDir,
      createNewConfig,
    } = requestObject;
    console.log('​indexHtmlPath', indexHtmlPath);

    if (createNewConfig) {
      console.log('******************************');
      console.log('creating new webpack config...');
      console.log('******************************');
      createAndSaveWebpackConfig(entryFileAbsolutePath, extensions, null, indexHtmlPath, rootDir)
        .then(({ rootDir, tempFileName }) => {
          runConfigFromTheirRoot(rootDir)
            .then(() => {
              const configToDelete = path.join(rootDir, 'webpack.config.js');
              if (tempFileName) {
                fs.unlinkSync(configToDelete);
                fs.renameSync(tempFileName, configToDelete);
              } else {
                fs.unlinkSync(configToDelete);
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
