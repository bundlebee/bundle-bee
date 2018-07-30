const path = require('path');
const util = require('util');
const createRules = require('./create-rules.js');

// NOTE: NEED TO ADD ARGUMENT FOR HTML FILE IF IT EXISTS. MAYBE PUBLIC PATH, output path, ETC AS WELL
module.exports = (entry, extensions, outputPath, htmlTemplateEntry) => {
  // set the path as absolute
  entry = path.resolve(entry);
  // util.inspect  preserves regex (unlike) JSON.stringify.  showHidden : false allows for deeply nested objects
  const rules = util.inspect(createRules(extensions), { showHidden: false, depth: null });
  // apply entry file and rules array to the base config
  const config = `
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: '${entry}',
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
    new HtmlWebpackPlugin({
      title: 'custom template',
      template: '${htmlTemplateEntry}',
    }), 
  ],
  resolve: {
    extensions: ['.jsx', '.scss','.sass','.less', '.js', '.css'],
  },
  };`;

  return config;
};
