
const webpack = require('/Users/bren/Codesmith/zweek-7-PROJECT/initial-webpack-config-test-with-adam/bundle-bee/node_modules/webpack/lib/webpack.js')
const path = require('path');
const HtmlWebpackPlugin = require('/Users/bren/Codesmith/zweek-7-PROJECT/initial-webpack-config-test-with-adam/bundle-bee/node_modules/html-webpack-plugin/index.js');

module.exports = {
    entry: '/Users/bren/React/1-indecisionApp/src/index.js',
    context: '/Users/bren/React/1-indecisionApp',
    output: {
      path: '/Users/bren/Codesmith/zweek-7-PROJECT/initial-webpack-config-test-with-adam/bundle-bee/backend/dist',
      filename: 'bundle.js',
    },
    module: {
      rules:[ { test: /\.jsx?$/i,
    exclude: /node_modules/,
    use: 
     { loader: 'babel-loader',
       options: 
        { presets: [ 'babel-preset-env', 'babel-preset-react' ],
          plugins: [ 'transform-class-properties' ] } } },
  { test: /\.css$/i, use: 'css-loader' },
  { test: /\.(gif|png|jpe?g|svg)$/i,
    use: 
     [ 'file-loader',
       { loader: 'image-webpack-loader',
         options: { bypassOnDebug: true, disable: true } } ] },
  { test: /\.s(c|a)ss$/i,
    exclude: /node_modules/,
    use: [ 'style-loader', 'css-loader', 'sass-loader' ] } ],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
    new HtmlWebpackPlugin({title: 'template', template: '/Users/bren/React/1-indecisionApp/public/index.html'}), 
  ],
  resolve: {
    extensions: ['.js','.css','.scss','.sass'],
  },
  };