const babylon = require('babylon');
const traverse = require('babel-traverse').default;

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

  console.log('wahoooooo');

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
  console.log('sending process');

  process.send(response);
  return response;
})
