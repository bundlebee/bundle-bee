
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: '/Users/bren/Codesmith/week-5/reactscrumboard/src/index.js',
    context: '/Users/bren/Codesmith/week-5/reactscrumboard',
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
  { test: /\.s(c|a)ss$/i,
    exclude: /node_modules/,
    use: [ 'style-loader', 'css-loader', 'sass-loader' ] },
  { test: /\.(gif|png|jpe?g|svg)$/i,
    use: 
     [ 'file-loader',
       { loader: 'image-webpack-loader',
         options: { bypassOnDebug: true, disable: true } } ] },
  { test: /\.css$/i, use: 'css-loader' } ],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
    new HtmlWebpackPlugin({
      title: 'custom template',
      template: '/Users/bren/Codesmith/zweek-7-PROJECT/initial-webpack-config-test-with-adam/bundle-bee/backend/create-config/template.html',
    }), 
  ],
  resolve: {
    extensions: ['.jsx', '.scss','.sass','.less', '.js', '.css'],
  },
  };