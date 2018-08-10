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
  let { rules, dependencies } = createRules(extensions);
  res.webpackDependencies = JSON.stringify({
    devDependencies: dependencies,
  });
  // rules = util.inspect(rules, { showHidden: false, depth: null });
  const output = path.join(__dirname, '..', '..', '..', '..', 'electronUserData', 'webpack-dist');
  res.webpackConfigString = `
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: '${entry}',
    context: '${rootDir}',
    output: {
      path: '${output}',
      filename: 'bundle.js',
    },
    module: {
      rules:[${rules}],
    },
    devServer: {
      contentBase: path.join(__dirname, 'webpack-dist'),
    },
    plugins: [
    new HtmlWebpackPlugin(${indexHtmlPath}), 
    new MiniCssExtractPlugin('bundle.css')
  ],
  resolve: {
    extensions: ${extensionsToResolve.length ? '[' + extensionsToResolve + ']' : ''},
  },
  };`;
  return res;
};
