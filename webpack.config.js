const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CSSExtract = new ExtractTextPlugin('bundle.css');

module.exports = {
  watch: true,
  target: 'electron-renderer',
  entry: './app/src/index.js',
  output: {
    path: __dirname + '/app/build',
    publicPath: 'build/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['react'],
        },
      },
      {
        test: /\.s?(c|a)ss$/,
        use: CSSExtract.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },

  plugins: [CSSExtract],

  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
};
