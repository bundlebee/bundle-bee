const fs = require('fs');
const path = require('path');

function packageJSONExistsInDir(fileEntry, rootDir) {
  return fileEntry.name === 'package.json' && fileEntry.fullParentDir === rootDir;
}

module.exports = files => {
  const rootDir = files[0] ? files[0].fullParentDir : null;
  console.log('rootDir');
  console.log(rootDir);
  const webpackConfig = { exists: false, path: null, content: null };
  let entry;
  let entryIsInRoot;
  let indexHtmlPath;
  let filePaths = files.reduce((files, fileInfo) => {
    // check if entry file is in root of project
    if (!entryIsInRoot && packageJSONExistsInDir(fileInfo, rootDir)) entryIsInRoot = true;
    const { name, fullPath, fullParentDir } = fileInfo;
    // TODO prompt if multiple webpack configs found
    // check for webpack config outside of node modules
    if (
      name === 'webpack.config.js' &&
      !fullPath.includes('/node_modules/') &&
      !webpackConfig.exists
    ) {
      webpackConfig.exists = true;
      webpackConfig.path = fullPath;
      webpackConfig.content = fs.readFileSync(fullPath, 'utf-8');
      webpackConfig.name = name;
      webpackConfig.dir = fullParentDir;
    }
    {
      if (
        name === 'index.html' &&
        !fullPath.includes('/node_modules/') &&
        !indexHtmlPath &&
        !fullPath.includes('/dist/')
      )
        indexHtmlPath = fullPath;
    }
    // make sure /src/ is in the root of the project (name should be src/index.js when you remove src/index.js)
    if (
      (fullPath.includes('/src/index.js') && fullPath.replace('/src/index.js', '') === rootDir) ||
      (fullPath.includes('\\src\\index.js') && fullPath.replace('\\src\\index.js', '') === rootDir)
    ) {
      entry = fullPath;
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
    rootDir,
    entry,
  };
};
