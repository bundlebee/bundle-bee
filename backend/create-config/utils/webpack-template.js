const path = require('path');
const util = require('util');
const createRules = require('./create-rules.js');

const resolvedWebpackPath = require.resolve('webpack');
const resolvedPathPath = require.resolve('path');
const resolvedHTMLPath = require.resolve('html-webpack-plugin');
const pathToOurTemplate = path.join(__dirname, '..', 'template.html');

module.exports = (entry, extensions, outputPath, htmlTemplateEntry, rootDir) => {
  const importantExtensions = ['.js', '.jsx', '.css', '.sass', '.scss', '.less'];
  const extensionsToResolve = extensions.reduce((acc, x) => {
    if (!acc.includes(x) && importantExtensions.includes(x)) acc.push(`'${x}'`);
    return acc;
  }, []);
  htmlTemplateEntry = htmlTemplateEntry
    ? `{title: 'template', template: '${htmlTemplateEntry}'}`
    : `{title: 'template', template: '${pathToOurTemplate}'}`;
  // util.inspect  preserves regex (unlike) JSON.stringify.  showHidden : false allows for deeply nested objects
  const rules = util.inspect(createRules(extensions), { showHidden: false, depth: null });
  const config = `
const webpack = require('${resolvedWebpackPath}')
const path = require('${resolvedPathPath}');
const HtmlWebpackPlugin = require('${resolvedHTMLPath}');

module.exports = {
    entry: ${entry},
    context: '${rootDir}',
    output: {
      path: '${outputPath}',
      filename: 'bundle.js',
    },
    module: {
      rules:${rules},
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
    new HtmlWebpackPlugin(${htmlTemplateEntry}), 
  ],
  resolve: {
    extensions: ${extensionsToResolve.length ? '[' + extensionsToResolve + ']' : ''},
  },
  };`;

  return config;
};
