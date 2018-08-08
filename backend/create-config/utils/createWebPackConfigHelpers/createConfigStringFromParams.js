const path = require('path');
const util = require('util');
const createRules = require('./create-rules.js');

const pathToOurTemplate = path.join(__dirname, 'template.html');

module.exports = res => {
  let { entry, extensions, indexHtmlPath, rootDir } = res;
  const importantExtensions = ['.js', '.jsx', '.css', '.sass', '.scss', '.less'];
  const extensionsToResolve = extensions.reduce((acc, x) => {
    if (!acc.includes(x) && importantExtensions.includes(x)) acc.push(`'${x}'`);
    return acc;
  }, []);
  indexHtmlPath = indexHtmlPath
    ? `{title: 'template', template: '${indexHtmlPath}'}`
    : `{title: 'template', template: '${pathToOurTemplate}'}`;
  // util.inspect  preserves regex (unlike) JSON.stringify.  showHidden : false allows for deeply nested objects
  const rules = util.inspect(createRules(extensions), { showHidden: false, depth: null });
  const output = path.join(__dirname, '..', '..', '..', '..', 'electronUserData', 'dist');
  const config = `
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: '${entry}',
    context: '${rootDir}',
    output: {
      path: '${output}',
      filename: 'bundle.js',
    },
    module: {
      rules:${rules},
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
    new HtmlWebpackPlugin(${indexHtmlPath}), 
  ],
  resolve: {
    extensions: ${extensionsToResolve.length ? '[' + extensionsToResolve + ']' : ''},
  },
  };`;

  return { res, config };
};
